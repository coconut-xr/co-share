(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{3646:function(e,t,r){var n=r(7228);e.exports=function(e){if(Array.isArray(e))return n(e)}},9713:function(e){e.exports=function(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}},7375:function(e,t,r){"use strict";function n(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}r.d(t,{Z:function(){return n}})},6860:function(e){e.exports=function(e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}},8206:function(e){e.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},319:function(e,t,r){var n=r(3646),a=r(6860),o=r(379),i=r(8206);e.exports=function(e){return n(e)||a(e)||o(e)||i()}},3905:function(e,t,r){"use strict";r.d(t,{kt:function(){return f}});var n=r(7378);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),l=function(e){var t=n.useContext(s),r=t;return e&&(r="function"===typeof e?e(t):i(i({},t),e)),r},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),f=l(r),d=a,h=f["".concat(s,".").concat(d)]||f[d]||u[d]||o;return r?n.createElement(h,i(i({ref:t},p),{},{components:r})):n.createElement(h,i({ref:t},p))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"===typeof e||a){var o=r.length,i=new Array(o);i[0]=p;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"===typeof e?e:a,i[1]=c;for(var l=2;l<o;l++)i[l]=r[l];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}p.displayName="MDXCreateElement"},9138:function(e,t,r){"use strict";r.d(t,{$:function(){return a}});var n=r(4246);function a(){return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("div",{className:"flex-grow-1"}),(0,n.jsx)("footer",{className:"bg-light",children:(0,n.jsxs)("div",{className:"d-flex align-items-center justify-content-around p-3 container-lg",children:[(0,n.jsxs)("a",{target:"_blank",href:"https://github.com/cocoss-org/co-share",className:"text-black d-flex flex-row align-items-center",children:[(0,n.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",fill:"currentColor",className:"bi bi-github mx-2",viewBox:"0 0 16 16",children:(0,n.jsx)("path",{d:"M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"})}),(0,n.jsx)("span",{className:"h5 mb-0",children:"Github"})]}),(0,n.jsx)("a",{target:"_blank",href:"https://www.coconut-xr.com/",children:(0,n.jsx)("img",{height:50,src:"/powered-by.svg"})})]})})]})}},1655:function(e,t,r){"use strict";r.d(t,{h:function(){return o}});var n=r(4246),a=[{title:"Counter",url:"/counter"},{title:"Request",url:"/request"},{title:"Message",url:"/message"},{title:"Group Chat",url:"/group-chat"},{title:"Lockable",url:"/lockable"},{title:"Optimistic Lockable",url:"/optimistic-lockable"},{title:"Whiteboard",url:"/whiteboard"},{title:"Transformable",url:"/transformable"}];function o(e){var t=e.selectedIndex;return(0,n.jsx)("nav",{className:"navbar navbar-expand-lg navbar-light bg-light",children:(0,n.jsxs)("div",{className:"container-fluid",children:[(0,n.jsx)("a",{className:"navbar-brand",href:"/",children:"co-share examples"}),(0,n.jsx)("button",{className:"navbar-toggler",type:"button","data-bs-toggle":"collapse","data-bs-target":"#navbarNavDropdown","aria-controls":"navbarNavDropdown","aria-expanded":"false","aria-label":"Toggle navigation",children:(0,n.jsx)("span",{className:"navbar-toggler-icon"})}),(0,n.jsx)("div",{className:"align-self-flex-end collapse navbar-collapse",id:"navbarNavDropdown",children:(0,n.jsx)("ul",{className:"navbar-nav",children:a.map((function(e,r){var a=e.title,o=e.url;return(0,n.jsx)("li",{className:"nav-item",children:(0,n.jsx)("a",{className:"nav-link ".concat(r===t?"active":""),href:o,children:a})},a)}))})})]})})}},3398:function(e,t,r){"use strict";var n;t.__esModule=!0,t.AmpStateContext=void 0;var a=((n=r(7378))&&n.__esModule?n:{default:n}).default.createContext({});t.AmpStateContext=a},6393:function(e,t,r){"use strict";t.__esModule=!0,t.isInAmpMode=i,t.useAmp=function(){return i(a.default.useContext(o.AmpStateContext))};var n,a=(n=r(7378))&&n.__esModule?n:{default:n},o=r(3398);function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.ampFirst,r=void 0!==t&&t,n=e.hybrid,a=void 0!==n&&n,o=e.hasQuery,i=void 0!==o&&o;return r||a&&i}},2775:function(e,t,r){"use strict";var n=r(9713);function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}t.__esModule=!0,t.defaultHead=f,t.default=void 0;var o,i=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!==typeof e&&"function"!==typeof e)return{default:e};var t=p();if(t&&t.has(e))return t.get(e);var r={},n=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in e)if(Object.prototype.hasOwnProperty.call(e,a)){var o=n?Object.getOwnPropertyDescriptor(e,a):null;o&&(o.get||o.set)?Object.defineProperty(r,a,o):r[a]=e[a]}r.default=e,t&&t.set(e,r);return r}(r(7378)),c=(o=r(3244))&&o.__esModule?o:{default:o},s=r(3398),l=r(1165),u=r(6393);function p(){if("function"!==typeof WeakMap)return null;var e=new WeakMap;return p=function(){return e},e}function f(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=[i.default.createElement("meta",{charSet:"utf-8"})];return e||t.push(i.default.createElement("meta",{name:"viewport",content:"width=device-width"})),t}function d(e,t){return"string"===typeof t||"number"===typeof t?e:t.type===i.default.Fragment?e.concat(i.default.Children.toArray(t.props.children).reduce((function(e,t){return"string"===typeof t||"number"===typeof t?e:e.concat(t)}),[])):e.concat(t)}var h=["name","httpEquiv","charSet","itemProp"];function m(e,t){return e.reduce((function(e,t){var r=i.default.Children.toArray(t.props.children);return e.concat(r)}),[]).reduce(d,[]).reverse().concat(f(t.inAmpMode)).filter(function(){var e=new Set,t=new Set,r=new Set,n={};return function(a){var o=!0,i=!1;if(a.key&&"number"!==typeof a.key&&a.key.indexOf("$")>0){i=!0;var c=a.key.slice(a.key.indexOf("$")+1);e.has(c)?o=!1:e.add(c)}switch(a.type){case"title":case"base":t.has(a.type)?o=!1:t.add(a.type);break;case"meta":for(var s=0,l=h.length;s<l;s++){var u=h[s];if(a.props.hasOwnProperty(u))if("charSet"===u)r.has(u)?o=!1:r.add(u);else{var p=a.props[u],f=n[u]||new Set;"name"===u&&i||!f.has(p)?(f.add(p),n[u]=f):o=!1}}}return o}}()).reverse().map((function(e,r){var o=e.key||r;if(!t.inAmpMode&&"link"===e.type&&e.props.href&&["https://fonts.googleapis.com/css","https://use.typekit.net/"].some((function(t){return e.props.href.startsWith(t)}))){var c=function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}({},e.props||{});return c["data-href"]=c.href,c.href=void 0,c["data-optimized-fonts"]=!0,i.default.cloneElement(e,c)}return i.default.cloneElement(e,{key:o})}))}var b=function(e){var t=e.children,r=(0,i.useContext)(s.AmpStateContext),n=(0,i.useContext)(l.HeadManagerContext);return i.default.createElement(c.default,{reduceComponentsToState:m,headManager:n,inAmpMode:(0,u.isInAmpMode)(r)},t)};t.default=b},3244:function(e,t,r){"use strict";var n=r(319),a=r(4575),o=r(3913),i=(r(1506),r(2205)),c=r(8585),s=r(9754);function l(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=s(e);if(t){var a=s(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return c(this,r)}}t.__esModule=!0,t.default=void 0;var u=r(7378),p=function(e){i(r,e);var t=l(r);function r(e){var o;return a(this,r),(o=t.call(this,e))._hasHeadManager=void 0,o.emitChange=function(){o._hasHeadManager&&o.props.headManager.updateHead(o.props.reduceComponentsToState(n(o.props.headManager.mountedInstances),o.props))},o._hasHeadManager=o.props.headManager&&o.props.headManager.mountedInstances,o}return o(r,[{key:"componentDidMount",value:function(){this._hasHeadManager&&this.props.headManager.mountedInstances.add(this),this.emitChange()}},{key:"componentDidUpdate",value:function(){this.emitChange()}},{key:"componentWillUnmount",value:function(){this._hasHeadManager&&this.props.headManager.mountedInstances.delete(this),this.emitChange()}},{key:"render",value:function(){return null}}]),r}(u.Component);t.default=p},126:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return h}});var n=r(4246),a=(r(7378),r(9008)),o=r(1655),i=r(6156),c=r(7375),s=r(3905);function l(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function u(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?l(Object(r),!0).forEach((function(t){(0,i.Z)(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var p={};function f(e){var t=e.components,r=(0,c.Z)(e,["components"]);return(0,s.kt)("wrapper",u(u(u({},p),r),{},{components:t,mdxType:"MDXLayout"}),(0,s.kt)("h1",null,"co-share"),(0,s.kt)("p",null,"Architecting shared applications using js & node.js."),(0,s.kt)("p",null,(0,s.kt)("inlineCode",{parentName:"p"},"npm i co-share")),(0,s.kt)("h2",null,(0,s.kt)("strong",{parentName:"h2"},"Examples")),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",u({parentName:"li"},{href:"https://co-share.github.io/counter"}),"Counter")," - a global synchronized counter that can be increased asynchronously by every client"),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",u({parentName:"li"},{href:"https://co-share.github.io/requst"}),"Request")," - request response paradigma"),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",u({parentName:"li"},{href:"https://co-share.github.io/group-chat"}),"Group Chat")," - a whatsapp like chat implementation"),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",u({parentName:"li"},{href:"https://co-share.github.io/message"}),"Message")," - direct client to client messaging without any persistent storage in between"),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",u({parentName:"li"},{href:"https://co-share.github.io/lockable"}),"Lockable")," - advanced lock functionality to prevent editing by multiple people simultaneously "),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",u({parentName:"li"},{href:"https://co-share.github.io/optimistic-lockable"}),"Optimistic Lockable")," - performance optimize lockable that allows for optimistic behaviour and error correction"),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",u({parentName:"li"},{href:"https://co-share.github.io/whiteboard"}),"Whiteboard")," - collaborative drawing on a shared whiteboard"),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",u({parentName:"li"},{href:"https://co-share.github.io/transformable"}),"Transformable")," - shared 3D transformation")))}f.isMDXComponent=!0;var d=r(9138);function h(){return(0,n.jsxs)("div",{className:"d-flex flex-column fullscreen",children:[(0,n.jsxs)(a.default,{children:[(0,n.jsx)("title",{children:"Coconut XR"}),(0,n.jsx)("meta",{name:"description",content:"At Coconut XR we bring 3D to the Web, Augmented Reality (AR), Virtual Reality (VR) and XR / WebXR. We connect people and business using the latest collaboration and multiuser technologies with a strong background in cloud and distributed development. With many years of experience in software development and fresh ideas we thrive to build the applications of the future."}),(0,n.jsx)("meta",{name:"viewport",content:"initial-scale=1.0, width=device-width"}),(0,n.jsx)("link",{rel:"icon",type:"image/svg+xml",href:"/res/icon.svg"}),(0,n.jsx)("link",{rel:"mask-icon",href:"/res/icon.svg",color:"#fff"})]}),(0,n.jsx)(o.h,{selectedIndex:-1}),(0,n.jsx)("div",{className:"container-lg p-3",children:(0,n.jsx)(f,{})}),(0,n.jsx)(d.$,{})]})}},5301:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return r(126)}])},9008:function(e,t,r){e.exports=r(2775)}},function(e){e.O(0,[774,888,179],(function(){return t=5301,e(e.s=t);var t}));var t=e.O();_N_E=t}]);