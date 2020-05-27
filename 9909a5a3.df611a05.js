/*! For license information please see 9909a5a3.df611a05.js.LICENSE.txt */
(window.webpackJsonp=window.webpackJsonp||[]).push([[46],{198:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return a})),n.d(t,"metadata",(function(){return c})),n.d(t,"rightToc",(function(){return u})),n.d(t,"default",(function(){return s}));var r=n(1),o=n(11),i=(n(226),n(225)),a={id:"offix-cache",title:"Offix Cache",sidebar_label:"Client Cache"},c={id:"offix-cache",title:"Offix Cache",description:"The `offix-cache` package helps developers to manage some of their client's state such as cache, optimistic responses and subscriptions.",source:"@site/../docs/ref-cache.md",permalink:"/docs/next/offix-cache",editUrl:"https://github.com/aerogear/offix/edit/master/website/../docs/ref-cache.md",version:"next",sidebar_label:"Client Cache",sidebar:"docs",previous:{title:"Offline Support",permalink:"/docs/next/offline-client"},next:{title:"Client Side Conflict Resolution",permalink:"/docs/next/conflict-client"}},u=[{value:"Optimistic UI",id:"optimistic-ui",children:[]},{value:"Mutation Cache Helpers",id:"mutation-cache-helpers",children:[]},{value:"Subscription Helpers",id:"subscription-helpers",children:[{value:"Multiple Subscriptions",id:"multiple-subscriptions",children:[]}]}],l={rightToc:u};function s(e){var t=e.components,n=Object(o.a)(e,["components"]);return Object(i.b)("wrapper",Object(r.a)({},l,n,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,"The ",Object(i.b)("inlineCode",{parentName:"p"},"offix-cache")," package helps developers to manage some of their client's state such as cache, optimistic responses and subscriptions."),Object(i.b)("p",null,"Offix Cache capabilities are available automatically when using ",Object(i.b)("inlineCode",{parentName:"p"},"client.offlineMutate"),"."),Object(i.b)("h2",{id:"optimistic-ui"},"Optimistic UI"),Object(i.b)("p",null,"In Apollo Client, mutation results are not applied to the UI until responses are received from the server. To provide a better user experience, an application may want to update the UI immediately. ",Object(i.b)("a",Object(r.a)({parentName:"p"},{href:"https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-mutation-options-optimisticResponse",title:"Optimistic Responses"}),"Optimistic Responses")," are an easy to way to achieve this goal. However, creating individual optimistic responses for each mutation in your application can introduce boilerplate code. offix-cache can automatically create optimistic responses for you to reduce this boilerplate."),Object(i.b)("p",null,"The ",Object(i.b)("inlineCode",{parentName:"p"},"createOptimisticResponse")," function returns an object which can be passed directly to Apollo Client's mutate function. ",Object(i.b)("inlineCode",{parentName:"p"},"createOptimisticResponse")," will help to build expected response object from input arguments.\nif your mutation returns different values you will still need to build it manually."),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-javascript"}),"import { createOptimisticResponse } from 'offix-cache';\n\nconst optimisticResponse = createOptimisticResponse({\n  mutation: ADD_TASK,\n  variables: { some_key: 'some_value' },\n  operationType: 'add',\n  returnType: 'Task',\n  idField: 'id'\n});\n\napolloClient.mutate({\n  mutation: ADD_TASK,\n  optimisticResponse: optimisticResponse\n});\n")),Object(i.b)("h2",{id:"mutation-cache-helpers"},"Mutation Cache Helpers"),Object(i.b)("p",null,Object(i.b)("inlineCode",{parentName:"p"},"offix-cache")," provides a mechanism to automatically update the client cache based on the result returned by a mutation. The ",Object(i.b)("inlineCode",{parentName:"p"},"createMutationOptions")," function returns a ",Object(i.b)("inlineCode",{parentName:"p"},"MutationOptions")," object compatible with Apollo Client's mutate."),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-javascript"}),"const { createMutationOptions, CacheOperation } = require('offix-cache');\n\nconst mutationOptions = {\n  mutation: ADD_TASK,\n  variables: {\n    title: 'item title'\n  },\n  updateQuery: {\n    query: GET_TASKS,\n    variables: {\n      filterBy: 'some filter'\n    }\n  },\n  returnType: 'Task',\n  operationType: CacheOperation.ADD,\n  idField: 'id'\n};\n")),Object(i.b)("p",null,"We can also provide more than one query to update in the cache by providing an array to the ",Object(i.b)("inlineCode",{parentName:"p"},"updateQuery")," parameter:"),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-javascript"}),"const mutationOptions = {\n  ...\n  updateQuery: [\n    { query: GET_TASKS, variables: {} }\n  ],\n  ...\n};\n")),Object(i.b)("p",null,"Where ",Object(i.b)("inlineCode",{parentName:"p"},"mutationOptions")," is either of the two objects shown above, we can then pass this object to our mutate function."),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-javascript"}),"const options = createMutationOptions(mutationOptions);\n\napolloClient.mutate(options);\n")),Object(i.b)("blockquote",null,Object(i.b)("p",{parentName:"blockquote"},"NOTE: Cache helpers currently support only GraphQL Queries that return arrays.\nFor example ",Object(i.b)("inlineCode",{parentName:"p"},"getUsers():[User]"),".\nWhen working with single objects returned by Queries we usually do not need use any helper as Query will be updated automatically on every update")),Object(i.b)("h2",{id:"subscription-helpers"},"Subscription Helpers"),Object(i.b)("p",null,Object(i.b)("inlineCode",{parentName:"p"},"offix-cache")," provides a subscription cache update method helper which can generate the necessary options to be used with Apollo Client's ",Object(i.b)("inlineCode",{parentName:"p"},"subscribeToMore")," function."),Object(i.b)("p",null,"To use this helper, we first need to create some options. These options should take the folowing form:"),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-javascript"}),"const { CacheOperation } = require('offix-cache');\n\nconst options = {\n  subscriptionQuery: TASK_ADDED_SUBSCRIPTION,\n  cacheUpdateQuery: GET_TASKS,\n  operationType: CacheOperation.ADD\n};\n")),Object(i.b)("p",null,"This options object will be used to inform the subscription helper that for every data object received because of the ",Object(i.b)("inlineCode",{parentName:"p"},"TASK_ADDED_SUBSCRIPTION")," the ",Object(i.b)("inlineCode",{parentName:"p"},"GET_TASKS")," query should also be kept up to date in the cache."),Object(i.b)("p",null,"We can then create the required cache update functions in the following way:"),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-javascript"}),"const { createSubscriptionOptions } = require('offix-cache');\n\nconst subscriptionOptions = createSubscriptionOptions(options);\n")),Object(i.b)("p",null,"To use this helper we then pass this ",Object(i.b)("inlineCode",{parentName:"p"},"subscriptionOptions")," variable to the ",Object(i.b)("inlineCode",{parentName:"p"},"subscribeToMore")," function of our ",Object(i.b)("inlineCode",{parentName:"p"},"ObservableQuery"),"."),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-javascript"}),"const query =\n  apolloClient.watchQuery <\n  AllTasks >\n  {\n    query: GET_TASKS\n  };\n\nquery.subscribeToMore(subscriptionOptions);\n")),Object(i.b)("p",null,"The cache will now be kept up to date with automatic data deduplication being performed."),Object(i.b)("h3",{id:"multiple-subscriptions"},"Multiple Subscriptions"),Object(i.b)("p",null,Object(i.b)("inlineCode",{parentName:"p"},"offix-cache")," also provides the ability to automatically call ",Object(i.b)("inlineCode",{parentName:"p"},"subscribeToMore")," on your ",Object(i.b)("inlineCode",{parentName:"p"},"ObservableQuery"),". This can be useful in a situation where you may have multiple subscriptions which can affect one single query. For example, if you have a ",Object(i.b)("inlineCode",{parentName:"p"},"TaskAdded"),", ",Object(i.b)("inlineCode",{parentName:"p"},"TaskDeleted")," and a ",Object(i.b)("inlineCode",{parentName:"p"},"TaskUpdated")," subscription you would need three separate ",Object(i.b)("inlineCode",{parentName:"p"},"subscribeToMore")," function calls. This can become tedious as your number of subscriptions grow. To combat this, we can use the ",Object(i.b)("inlineCode",{parentName:"p"},"subscribeToMoreHelper")," function from offix-cache to automatically handle this for us by passing it an array of subscriptions and their corresponding queries which need to be updated."),Object(i.b)("pre",null,Object(i.b)("code",Object(r.a)({parentName:"pre"},{className:"language-javascript"}),"const { CacheOperation } = require('offix-cache');\n\nconst addOptions = {\n  subscriptionQuery: TASK_ADDED_SUBSCRIPTION,\n  cacheUpdateQuery: GET_TASKS,\n  operationType: CacheOperation.ADD\n};\n\nconst deleteOptions = {\n  subscriptionQuery: TASK_DELETED_SUBSCRIPTION,\n  cacheUpdateQuery: GET_TASKS,\n  operationType: CacheOperation.DELETE\n};\n\nconst updateOptions = {\n  subscriptionQuery: TASK_UPDATED_SUBSCRIPTION,\n  cacheUpdateQuery: GET_TASKS,\n  operationType: CacheOperation.REFRESH\n};\n\nconst query =\n  client.watchQuery <\n  AllTasks >\n  {\n    query: GET_TASKS\n  };\n\nsubscribeToMoreHelper(query, [addOptions, deleteOptions, updateOptions]);\n")))}s.isMDXComponent=!0},225:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return d}));var r=n(0),o=n.n(r);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=o.a.createContext({}),s=function(e){var t=o.a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):c({},t,{},e)),n},p=function(e){var t=s(e.components);return o.a.createElement(l.Provider,{value:t},e.children)},f={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},b=Object(r.forwardRef)((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,a=e.parentName,l=u(e,["components","mdxType","originalType","parentName"]),p=s(n),b=r,d=p["".concat(a,".").concat(b)]||p[b]||f[b]||i;return n?o.a.createElement(d,c({ref:t},l,{components:n})):o.a.createElement(d,c({ref:t},l))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,a=new Array(i);a[0]=b;var c={};for(var u in t)hasOwnProperty.call(t,u)&&(c[u]=t[u]);c.originalType=e,c.mdxType="string"==typeof e?e:r,a[1]=c;for(var l=2;l<i;l++)a[l]=n[l];return o.a.createElement.apply(null,a)}return o.a.createElement.apply(null,n)}b.displayName="MDXCreateElement"},226:function(e,t,n){"use strict";e.exports=n(227)},227:function(e,t,n){"use strict";var r=n(228),o="function"==typeof Symbol&&Symbol.for,i=o?Symbol.for("react.element"):60103,a=o?Symbol.for("react.portal"):60106,c=o?Symbol.for("react.fragment"):60107,u=o?Symbol.for("react.strict_mode"):60108,l=o?Symbol.for("react.profiler"):60114,s=o?Symbol.for("react.provider"):60109,p=o?Symbol.for("react.context"):60110,f=o?Symbol.for("react.forward_ref"):60112,b=o?Symbol.for("react.suspense"):60113,d=o?Symbol.for("react.memo"):60115,h=o?Symbol.for("react.lazy"):60116,m="function"==typeof Symbol&&Symbol.iterator;function y(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,n=1;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var O={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},j={};function v(e,t,n){this.props=e,this.context=t,this.refs=j,this.updater=n||O}function g(){}function w(e,t,n){this.props=e,this.context=t,this.refs=j,this.updater=n||O}v.prototype.isReactComponent={},v.prototype.setState=function(e,t){if("object"!=typeof e&&"function"!=typeof e&&null!=e)throw Error(y(85));this.updater.enqueueSetState(this,e,t,"setState")},v.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},g.prototype=v.prototype;var C=w.prototype=new g;C.constructor=w,r(C,v.prototype),C.isPureReactComponent=!0;var T={current:null},S=Object.prototype.hasOwnProperty,N={key:!0,ref:!0,__self:!0,__source:!0};function _(e,t,n){var r,o={},a=null,c=null;if(null!=t)for(r in void 0!==t.ref&&(c=t.ref),void 0!==t.key&&(a=""+t.key),t)S.call(t,r)&&!N.hasOwnProperty(r)&&(o[r]=t[r]);var u=arguments.length-2;if(1===u)o.children=n;else if(1<u){for(var l=Array(u),s=0;s<u;s++)l[s]=arguments[s+2];o.children=l}if(e&&e.defaultProps)for(r in u=e.defaultProps)void 0===o[r]&&(o[r]=u[r]);return{$$typeof:i,type:e,key:a,ref:c,props:o,_owner:T.current}}function x(e){return"object"==typeof e&&null!==e&&e.$$typeof===i}var E=/\/+/g,k=[];function A(e,t,n,r){if(k.length){var o=k.pop();return o.result=e,o.keyPrefix=t,o.func=n,o.context=r,o.count=0,o}return{result:e,keyPrefix:t,func:n,context:r,count:0}}function P(e){e.result=null,e.keyPrefix=null,e.func=null,e.context=null,e.count=0,10>k.length&&k.push(e)}function D(e,t,n){return null==e?0:function e(t,n,r,o){var c=typeof t;"undefined"!==c&&"boolean"!==c||(t=null);var u=!1;if(null===t)u=!0;else switch(c){case"string":case"number":u=!0;break;case"object":switch(t.$$typeof){case i:case a:u=!0}}if(u)return r(o,t,""===n?"."+R(t,0):n),1;if(u=0,n=""===n?".":n+":",Array.isArray(t))for(var l=0;l<t.length;l++){var s=n+R(c=t[l],l);u+=e(c,s,r,o)}else if(null===t||"object"!=typeof t?s=null:s="function"==typeof(s=m&&t[m]||t["@@iterator"])?s:null,"function"==typeof s)for(t=s.call(t),l=0;!(c=t.next()).done;)u+=e(c=c.value,s=n+R(c,l++),r,o);else if("object"===c)throw r=""+t,Error(y(31,"[object Object]"===r?"object with keys {"+Object.keys(t).join(", ")+"}":r,""));return u}(e,"",t,n)}function R(e,t){return"object"==typeof e&&null!==e&&null!=e.key?function(e){var t={"=":"=0",":":"=2"};return"$"+(""+e).replace(/[=:]/g,(function(e){return t[e]}))}(e.key):t.toString(36)}function q(e,t){e.func.call(e.context,t,e.count++)}function M(e,t,n){var r=e.result,o=e.keyPrefix;e=e.func.call(e.context,t,e.count++),Array.isArray(e)?U(e,r,n,(function(e){return e})):null!=e&&(x(e)&&(e=function(e,t){return{$$typeof:i,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}(e,o+(!e.key||t&&t.key===e.key?"":(""+e.key).replace(E,"$&/")+"/")+n)),r.push(e))}function U(e,t,n,r,o){var i="";null!=n&&(i=(""+n).replace(E,"$&/")+"/"),D(e,M,t=A(t,i,r,o)),P(t)}var I={current:null};function $(){var e=I.current;if(null===e)throw Error(y(321));return e}var Q={ReactCurrentDispatcher:I,ReactCurrentBatchConfig:{suspense:null},ReactCurrentOwner:T,IsSomeRendererActing:{current:!1},assign:r};t.Children={map:function(e,t,n){if(null==e)return e;var r=[];return U(e,r,null,t,n),r},forEach:function(e,t,n){if(null==e)return e;D(e,q,t=A(null,null,t,n)),P(t)},count:function(e){return D(e,(function(){return null}),null)},toArray:function(e){var t=[];return U(e,t,null,(function(e){return e})),t},only:function(e){if(!x(e))throw Error(y(143));return e}},t.Component=v,t.Fragment=c,t.Profiler=l,t.PureComponent=w,t.StrictMode=u,t.Suspense=b,t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Q,t.cloneElement=function(e,t,n){if(null==e)throw Error(y(267,e));var o=r({},e.props),a=e.key,c=e.ref,u=e._owner;if(null!=t){if(void 0!==t.ref&&(c=t.ref,u=T.current),void 0!==t.key&&(a=""+t.key),e.type&&e.type.defaultProps)var l=e.type.defaultProps;for(s in t)S.call(t,s)&&!N.hasOwnProperty(s)&&(o[s]=void 0===t[s]&&void 0!==l?l[s]:t[s])}var s=arguments.length-2;if(1===s)o.children=n;else if(1<s){l=Array(s);for(var p=0;p<s;p++)l[p]=arguments[p+2];o.children=l}return{$$typeof:i,type:e.type,key:a,ref:c,props:o,_owner:u}},t.createContext=function(e,t){return void 0===t&&(t=null),(e={$$typeof:p,_calculateChangedBits:t,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null}).Provider={$$typeof:s,_context:e},e.Consumer=e},t.createElement=_,t.createFactory=function(e){var t=_.bind(null,e);return t.type=e,t},t.createRef=function(){return{current:null}},t.forwardRef=function(e){return{$$typeof:f,render:e}},t.isValidElement=x,t.lazy=function(e){return{$$typeof:h,_ctor:e,_status:-1,_result:null}},t.memo=function(e,t){return{$$typeof:d,type:e,compare:void 0===t?null:t}},t.useCallback=function(e,t){return $().useCallback(e,t)},t.useContext=function(e,t){return $().useContext(e,t)},t.useDebugValue=function(){},t.useEffect=function(e,t){return $().useEffect(e,t)},t.useImperativeHandle=function(e,t,n){return $().useImperativeHandle(e,t,n)},t.useLayoutEffect=function(e,t){return $().useLayoutEffect(e,t)},t.useMemo=function(e,t){return $().useMemo(e,t)},t.useReducer=function(e,t,n){return $().useReducer(e,t,n)},t.useRef=function(e){return $().useRef(e)},t.useState=function(e){return $().useState(e)},t.version="16.13.1"},228:function(e,t,n){"use strict";var r=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable;function a(e){if(null==e)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(e)}e.exports=function(){try{if(!Object.assign)return!1;var e=new String("abc");if(e[5]="de","5"===Object.getOwnPropertyNames(e)[0])return!1;for(var t={},n=0;n<10;n++)t["_"+String.fromCharCode(n)]=n;if("0123456789"!==Object.getOwnPropertyNames(t).map((function(e){return t[e]})).join(""))return!1;var r={};return"abcdefghijklmnopqrst".split("").forEach((function(e){r[e]=e})),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},r)).join("")}catch(o){return!1}}()?Object.assign:function(e,t){for(var n,c,u=a(e),l=1;l<arguments.length;l++){for(var s in n=Object(arguments[l]))o.call(n,s)&&(u[s]=n[s]);if(r){c=r(n);for(var p=0;p<c.length;p++)i.call(n,c[p])&&(u[c[p]]=n[c[p]])}}return u}}}]);