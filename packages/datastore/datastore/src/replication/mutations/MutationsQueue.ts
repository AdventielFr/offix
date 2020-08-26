
import { MutationRequest } from "./MutationRequest";
import { LocalStorage, CRUDEvents } from "../../storage";
import { createLogger } from "../../utils/logger";
import { Client, OperationResult, CombinedError } from "urql";
import { NetworkStatusEvent } from "../network/NetworkStatus";
import { Model } from "../../Model";
import { mutationQueueModel } from "../api/MetadataModels";
import { NetworkIndicator } from "../network/NetworkIndicator";
import { ReplicatorMutations } from "./ReplicatorMutations";
import { GlobalReplicationConfig, MutationsConfig } from "../api/ReplicationConfig";
import { buildGraphQLCRUDMutations } from "./buildGraphQLCRUDMutations";
import invariant from "tiny-invariant";
import { getFirstOperationData } from "../utils/getFirstOperationData";
import traverse from "traverse";

const logger = createLogger("replicator-mutationqueue");

interface MutationReplicationOptions {
  storage: LocalStorage;
  client: Client;
  networkIndicator: NetworkIndicator;
}

/**
 * Interface that is injected into model in order to add new items to replication engine
 */
export interface ModelChangeReplication {
  /**
   * Save replication request
   * @param model
   * @param data
   * @param eventType
   * @param store
   */
  saveChangeForReplication(model: Model, data: any, eventType: CRUDEvents, store: LocalStorage): Promise<void>;
}
/**
 * Represents single row where we persist all items
 * We use single row to ensure consistency
 */
const MUTATION_ROW_ID = "offline_changes";

/**
 * Queue that manages replication of the mutations for all local edits.
 */
export class MutationsReplicationQueue implements ModelChangeReplication {
  // Map of the storeName to the GraphQL documents
  private modelMap: {
    [name: string]: { documents: ReplicatorMutations; model: Model };
  };
  // Queue is open (available to process data) if needed
  private open?: boolean;
  // Queue is currently procesisng requests (used as semaphore to avoid processing multiple times)
  private processing: boolean;
  private options: MutationReplicationOptions;

  constructor(options: MutationReplicationOptions) {
    this.options = options;
    this.processing = false;
    this.modelMap = {};
  }

  /**
   * Add models that should be replicated to the server
   *
   * @param models
   * @param globalConfig
   */
  public addModels(models: Model[], globalConfig: GlobalReplicationConfig) {
    for (const model of models) {
      let config: MutationsConfig | undefined = globalConfig.mutations;
      if (model.replicationConfig) {
        config = Object.assign({}, config, model.replicationConfig.mutations);
      }
      if (config?.enabled) {
        let documents;
        // Use Custom GraphQL queries
        if (globalConfig.documentBuilders?.mutations) {
          documents = globalConfig.documentBuilders?.mutations(model);
        } else {
          // Use GraphQLCRUD
          documents = buildGraphQLCRUDMutations(model);
        }
        // Save queries for model
        this.modelMap[`${model.getStoreName()}`] = { documents, model };

        // Enable replication for this model
        model.replication = this;
      }
    }
  }

  /**
   * Initialize networkstatus and Queue to make sure that it is in proper state after startup.
   */
  public init(models: Model[], globalConfig: GlobalReplicationConfig) {
    this.addModels(models, globalConfig);
    // Subscribe to network updates and open and close replication
    this.options.networkIndicator.subscribe({
      next: (message: NetworkStatusEvent) => {
        logger(`Network state changed: ${message}`);
        this.open = message.isOnline;
        if (this.open) {
          this.process();
        }
      },
      complete: () => {
        this.open = false;
      }
    });

    // Intentionally async to start replication in background
    this.options.networkIndicator.isNetworkReachable().then((result) => {
      if (this.open === undefined) {
        // first time
        this.open = result;
      } else if (this.open === result) {
        // No state change
        return;
      }

      if (result === true) {
        // Going online
        this.process();
      }
      this.open = result;
    });
  }

  /**
   * Save user change to bereplicated by engine
   */
  public async saveChangeForReplication(model: Model, data: any, eventType: CRUDEvents, store: LocalStorage) {
    // Actual graphql queries need to be persisted at the time of request creation
    // This will ensure consistency for situations when model changed (without migrating queue)
    const storeName = model.getStoreName();
    const operations = this.modelMap[storeName];

    invariant(operations, "Missing GraphQL mutations for replication");
    const mutationRequest = {
      storeName,
      data,
      eventType
    };
    if (Array.isArray(data)) {
      // handling multiple updates to different objects for single model
      // we need to decompose them into individual changes
      for (const element of data) {
        mutationRequest.data = element;
        await this.enqueueRequest(mutationRequest, store);
      }
    } else {
      await this.enqueueRequest(mutationRequest, store);
    }

    logger("Saved Queue. Preparing to process");
    this.process();
  }

  public async process() {
    if (!this.open) {
      logger("Client offline. Stop processsing queue");
      return;
    }

    if (this.processing) {
      logger("Client is processing already. Stop processsing queue");
      return;
    }

    this.processing = true;
    while (this.open) {
      const storedMutations = await this.getStoredMutations();
      if (!storedMutations) {
        logger("Mutation Queue is empty - nothing to replicate");
        break;
      }

      const item: MutationRequest = storedMutations[0];
      logger("Mutation queue processing - online");
      invariant(this.modelMap[item.storeName], `Store is not setup for replication ${item.storeName}`);

      const mutation = this.getMutationDocument(item);

      let variables = { input: item.data };
      if (item.eventType === CRUDEvents.ADD) {
        // Do not sent id to server - workaround for
        // https://github.com/aerogear/graphback/issues/1900
        variables = { input: { ...item.data, _id: undefined } };
      } else {
        // Do not sent _deleted
        variables.input._deleted = undefined;
      }
      try {
        const result = await this.options.client.mutation(mutation, variables).toPromise();
        await this.resultProcessor(item, result);
        await this.dequeueRequest();
        logger("Mutation dequeued");
      } catch (error) {
        const retry = this.errorHandler(error, item);
        if (!retry) {
          await this.dequeueRequest();
          // TODO revert object
          // TODO dequeue all related elements
        } else {
          // Network error no action
          break;
        }
      }
    }
    this.processing = false;
  }

  private async getStoredMutations() {
    const data = await this.options.storage.queryById(mutationQueueModel.getStoreName(), "id", MUTATION_ROW_ID);
    if (data) {
      if (data.items.length !== 0) {
        return data.items;
      }
    }
  }

  private getMutationDocument({ storeName, eventType }: MutationRequest) {
    let mutationDocument;
    if (CRUDEvents.ADD === eventType) {
      mutationDocument = this.modelMap[storeName].documents.create;
    } else if (CRUDEvents.UPDATE === eventType) {
      mutationDocument = this.modelMap[storeName].documents.update;
    } else if (CRUDEvents.DELETE === eventType) {
      mutationDocument = this.modelMap[storeName].documents.delete;
    } else {
      logger("Invalid store event received");
      throw new Error("Invalid store event received");
    }
    return mutationDocument;
  }

  private async dequeueRequest() {
    logger("Removing request from the queue");
    const items = await this.getStoredMutations();
    if (items && items instanceof Array) {
      items.shift();
      const storeName = mutationQueueModel.getStoreName();
      const saved = await this.options.storage.saveOrUpdate(storeName, "id", { id: MUTATION_ROW_ID, items });
      invariant(saved, "Store should be saved after mutation is rejected");
    } else {
      logger("Should not happen");
    }
  }

  private async enqueueRequest(mutationRequest: MutationRequest, storage: LocalStorage = this.options.storage) {
    let items = await this.getStoredMutations();
    if (items && items instanceof Array) {
      items.push(mutationRequest);
    } else {
      items = [mutationRequest];
    }

    await storage.saveOrUpdate(mutationQueueModel.getStoreName(), "id", { id: MUTATION_ROW_ID, items });
  }

  /**
   * Handler for mutation error
   * @param error
   */
  private errorHandler(error: CombinedError, request: MutationRequest) {
    logger("error happend when processing request", error);
    const model = this.modelMap[request.storeName].model;
    const userErrorHandler = model.replicationConfig?.mutations?.errorHandler;
    if (userErrorHandler) {
      logger("error handled by user");
      return userErrorHandler(error.networkError, error.graphQLErrors);
    }

    if (error?.networkError?.message === "Failed to fetch") {
      // workaround for lack of number of tries
      this.open = false;
      return true;
    }
    return false;
  }

  private async resultProcessor(currentItem: MutationRequest, data: OperationResult<any>) {
    logger("Processing result from server");
    if (data.error) {
      throw data.error;
    }

    const model = this.modelMap[currentItem.storeName].model;
    const primaryKey = model.schema.getPrimaryKey();
    const returnedData = getFirstOperationData(data);
    if (!returnedData) {
      // Should not happen for valid queries/server
      throw new Error("Missing data from query.");
    }
    if (currentItem.eventType === CRUDEvents.ADD) {
      // TODO handling for ADD works but it really convoluted
      const transaction = await this.options.storage.createTransaction();
      // Local updates lost here
      try {
        await transaction.removeById(model.getStoreName(), primaryKey, currentItem.data);
        try {
          await transaction.save(model.getStoreName(), returnedData);
          model.changeEventStream.publish({
            eventType: CRUDEvents.ID_SWAP,
            data: [
              {
                previous: currentItem.data,
                current: returnedData
              }
            ]
          });
        } catch (error) {
          // if key already exists then live update has already saved the result
          // in this case, emit a delete event for the old document
          model.changeEventStream.publish({
            eventType: CRUDEvents.DELETE,
            data: [currentItem.data]
          });
        }

        const items: MutationRequest[] = await this.getStoredMutations();
        const itemUpdates = getQueueUpdates(
          items,
          this.modelMap,
          currentItem.data[primaryKey],
          returnedData[primaryKey],
          primaryKey
        );

        // persist queue. No need to await here since we will await trx.commit
        transaction.saveOrUpdate(mutationQueueModel.getStoreName(), "id", { id: MUTATION_ROW_ID, items });

        // persist updated items
        const promises = itemUpdates.map(async (item: any) => {
          const itemModel = this.modelMap[item.storeName].model;
          const itemKey = itemModel.getSchema().getPrimaryKey();
          const result = await transaction.updateById(item.storeName, itemKey, item.update);
          return { storeName: itemModel.getStoreName(), data: result };
        });

        const events: any = {};
        (await Promise.all(promises)).forEach((result) => {
          if (events[result.storeName]) {
            events[result.storeName].push(result.data);
            return;
          }
          events[result.storeName] = [result.data];
        });

        await transaction.commit();

        Object.keys(events).forEach((key) => {
          const itemModel = this.modelMap[key].model;
          itemModel.changeEventStream.publish({
            eventType: CRUDEvents.UPDATE,
            data: events[key]
          });
        });
      } catch (error) {
        await transaction.rollback();
      }
    }
    // No need for handling for deletes and updates
    // TODO handle conflicts
  }
}

export function getQueueUpdates(items: MutationRequest[], modelMap: any, clientKey: string, serverKey: string, primaryKey: string) {
  const itemUpdates: any = {};

  let documentRoot: any;
  traverse(items)
    .forEach(function(value) {
      if (this.level < 3) { return; }
      if (this.level === 3 && this.parent?.key === "data") {
        documentRoot = this;
      }

      if (value === clientKey) {
        this.update(serverKey);
        if (this.key === primaryKey) { return; } // id has already been swapped
      }

      const item = documentRoot.parent.parent.node;
      const data = item.data;
      const storeName = item.storeName;
      const itemPrimaryKey = modelMap[storeName].getSchema().getPrimaryKey();
      const id = data[itemPrimaryKey];

      if (item.eventType === CRUDEvents.DELETE) {
        delete itemUpdates[id];
        return;
      }

      itemUpdates[id] = {
        storeName, update: {
          ...(itemUpdates[id] ? itemUpdates[id].update : {}),
          [itemPrimaryKey]: id,
          [documentRoot.key]: documentRoot.node
        }
      };
    });

  return Object.keys(itemUpdates).map((key) => itemUpdates[key]);;
}
