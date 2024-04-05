"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "../../node_modules/.pnpm/next@13.4.4_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/pages/_app.js":
/*!***************************************************************************************************************!*\
  !*** ../../node_modules/.pnpm/next@13.4.4_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/pages/_app.js ***!
  \***************************************************************************************************************/
/***/ ((module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({\n    value: true\n}));\nObject.defineProperty(exports, \"default\", ({\n    enumerable: true,\n    get: function() {\n        return App;\n    }\n}));\nconst _interop_require_default = __webpack_require__(/*! @swc/helpers/_/_interop_require_default */ \"../../node_modules/.pnpm/@swc+helpers@0.5.1/node_modules/@swc/helpers/cjs/_interop_require_default.cjs\");\nconst _react = /*#__PURE__*/ _interop_require_default._(__webpack_require__(/*! react */ \"react?1189\"));\nconst _utils = __webpack_require__(/*! ../shared/lib/utils */ \"../shared/lib/utils\");\n/**\n * `App` component is used for initialize of pages. It allows for overwriting and full control of the `page` initialization.\n * This allows for keeping state between navigation, custom error handling, injecting additional data.\n */ async function appGetInitialProps(param) {\n    let { Component , ctx  } = param;\n    const pageProps = await (0, _utils.loadGetInitialProps)(Component, ctx);\n    return {\n        pageProps\n    };\n}\nclass App extends _react.default.Component {\n    render() {\n        const { Component , pageProps  } = this.props;\n        return /*#__PURE__*/ _react.default.createElement(Component, pageProps);\n    }\n}\n(()=>{\n    App.origGetInitialProps = appGetInitialProps;\n})();\n(()=>{\n    App.getInitialProps = appGetInitialProps;\n})();\nif ((typeof exports.default === \"function\" || typeof exports.default === \"object\" && exports.default !== null) && typeof exports.default.__esModule === \"undefined\") {\n    Object.defineProperty(exports.default, \"__esModule\", {\n        value: true\n    });\n    Object.assign(exports.default, exports);\n    module.exports = exports.default;\n} //# sourceMappingURL=_app.js.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL25leHRAMTMuNC40X3JlYWN0LWRvbUAxOC4yLjBfcmVhY3RAMTguMi4wL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvcGFnZXMvX2FwcC5qcy5qcyIsIm1hcHBpbmdzIjoiQUFBYTtBQUNiQSw4Q0FBNkM7SUFDekNHLE9BQU87QUFDWCxDQUFDLEVBQUM7QUFDRkgsMkNBQTBDO0lBQ3RDSSxZQUFZO0lBQ1pDLEtBQUs7UUFDRCxPQUFPQztJQUNYO0FBQ0osQ0FBQyxFQUFDO0FBQ0YsTUFBTUMsMkJBQTJCQyxtQkFBT0EsQ0FBQyx1SkFBeUM7QUFDbEYsTUFBTUMsU0FBUyxXQUFXLEdBQUdGLHlCQUF5QkcsRUFBRUYsbUJBQU9BLENBQUMseUJBQU87QUFDdkUsTUFBTUcsU0FBU0gsbUJBQU9BLENBQUMsZ0RBQXFCO0FBQzVDOzs7Q0FHQyxHQUFHLGVBQWVJLG1CQUFtQkMsS0FBSztJQUN2QyxJQUFJLEVBQUVDLFVBQVMsRUFBR0MsSUFBRyxFQUFHLEdBQUdGO0lBQzNCLE1BQU1HLFlBQVksTUFBTSxDQUFDLEdBQUdMLE9BQU9NLG1CQUFrQixFQUFHSCxXQUFXQztJQUNuRSxPQUFPO1FBQ0hDO0lBQ0o7QUFDSjtBQUNBLE1BQU1WLFlBQVlHLE9BQU9TLFFBQVFKO0lBQzdCSyxTQUFTO1FBQ0wsTUFBTSxFQUFFTCxVQUFTLEVBQUdFLFVBQVMsRUFBRyxHQUFHLElBQUksQ0FBQ0k7UUFDeEMsT0FBTyxXQUFXLEdBQUdYLE9BQU9TLFFBQVFHLGNBQWNQLFdBQVdFO0lBQ2pFO0FBQ0o7QUFDQztJQUNHVixJQUFJZ0Isc0JBQXNCVjtBQUM5QjtBQUNDO0lBQ0dOLElBQUlpQixrQkFBa0JYO0FBQzFCO0FBRUEsSUFBSSxDQUFDLE9BQU9WLFFBQVFnQixZQUFZLGNBQWUsT0FBT2hCLFFBQVFnQixZQUFZLFlBQVloQixRQUFRZ0IsWUFBWSxJQUFJLEtBQU0sT0FBT2hCLFFBQVFnQixRQUFRTSxlQUFlLGFBQWE7SUFDckt4QixPQUFPQyxlQUFlQyxRQUFRZ0IsU0FBUyxjQUFjO1FBQUVmLE9BQU87SUFBSztJQUNuRUgsT0FBT3lCLE9BQU92QixRQUFRZ0IsU0FBU2hCO0lBQy9Cd0IsT0FBT3hCLFVBQVVBLFFBQVFnQjtBQUMzQixFQUVBLGdDQUFnQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYi8uLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vbmV4dEAxMy40LjRfcmVhY3QtZG9tQDE4LjIuMF9yZWFjdEAxOC4yLjAvbm9kZV9tb2R1bGVzL25leHQvZGlzdC9wYWdlcy9fYXBwLmpzP2JhOTgiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgICB2YWx1ZTogdHJ1ZVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJkZWZhdWx0XCIsIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBBcHA7XG4gICAgfVxufSk7XG5jb25zdCBfaW50ZXJvcF9yZXF1aXJlX2RlZmF1bHQgPSByZXF1aXJlKFwiQHN3Yy9oZWxwZXJzL18vX2ludGVyb3BfcmVxdWlyZV9kZWZhdWx0XCIpO1xuY29uc3QgX3JlYWN0ID0gLyojX19QVVJFX18qLyBfaW50ZXJvcF9yZXF1aXJlX2RlZmF1bHQuXyhyZXF1aXJlKFwicmVhY3RcIikpO1xuY29uc3QgX3V0aWxzID0gcmVxdWlyZShcIi4uL3NoYXJlZC9saWIvdXRpbHNcIik7XG4vKipcbiAqIGBBcHBgIGNvbXBvbmVudCBpcyB1c2VkIGZvciBpbml0aWFsaXplIG9mIHBhZ2VzLiBJdCBhbGxvd3MgZm9yIG92ZXJ3cml0aW5nIGFuZCBmdWxsIGNvbnRyb2wgb2YgdGhlIGBwYWdlYCBpbml0aWFsaXphdGlvbi5cbiAqIFRoaXMgYWxsb3dzIGZvciBrZWVwaW5nIHN0YXRlIGJldHdlZW4gbmF2aWdhdGlvbiwgY3VzdG9tIGVycm9yIGhhbmRsaW5nLCBpbmplY3RpbmcgYWRkaXRpb25hbCBkYXRhLlxuICovIGFzeW5jIGZ1bmN0aW9uIGFwcEdldEluaXRpYWxQcm9wcyhwYXJhbSkge1xuICAgIGxldCB7IENvbXBvbmVudCAsIGN0eCAgfSA9IHBhcmFtO1xuICAgIGNvbnN0IHBhZ2VQcm9wcyA9IGF3YWl0ICgwLCBfdXRpbHMubG9hZEdldEluaXRpYWxQcm9wcykoQ29tcG9uZW50LCBjdHgpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhZ2VQcm9wc1xuICAgIH07XG59XG5jbGFzcyBBcHAgZXh0ZW5kcyBfcmVhY3QuZGVmYXVsdC5Db21wb25lbnQge1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgeyBDb21wb25lbnQgLCBwYWdlUHJvcHMgIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICByZXR1cm4gLyojX19QVVJFX18qLyBfcmVhY3QuZGVmYXVsdC5jcmVhdGVFbGVtZW50KENvbXBvbmVudCwgcGFnZVByb3BzKTtcbiAgICB9XG59XG4oKCk9PntcbiAgICBBcHAub3JpZ0dldEluaXRpYWxQcm9wcyA9IGFwcEdldEluaXRpYWxQcm9wcztcbn0pKCk7XG4oKCk9PntcbiAgICBBcHAuZ2V0SW5pdGlhbFByb3BzID0gYXBwR2V0SW5pdGlhbFByb3BzO1xufSkoKTtcblxuaWYgKCh0eXBlb2YgZXhwb3J0cy5kZWZhdWx0ID09PSAnZnVuY3Rpb24nIHx8ICh0eXBlb2YgZXhwb3J0cy5kZWZhdWx0ID09PSAnb2JqZWN0JyAmJiBleHBvcnRzLmRlZmF1bHQgIT09IG51bGwpKSAmJiB0eXBlb2YgZXhwb3J0cy5kZWZhdWx0Ll9fZXNNb2R1bGUgPT09ICd1bmRlZmluZWQnKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLmRlZmF1bHQsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiAgT2JqZWN0LmFzc2lnbihleHBvcnRzLmRlZmF1bHQsIGV4cG9ydHMpO1xuICBtb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMuZGVmYXVsdDtcbn1cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9X2FwcC5qcy5tYXAiXSwibmFtZXMiOlsiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwidmFsdWUiLCJlbnVtZXJhYmxlIiwiZ2V0IiwiQXBwIiwiX2ludGVyb3BfcmVxdWlyZV9kZWZhdWx0IiwicmVxdWlyZSIsIl9yZWFjdCIsIl8iLCJfdXRpbHMiLCJhcHBHZXRJbml0aWFsUHJvcHMiLCJwYXJhbSIsIkNvbXBvbmVudCIsImN0eCIsInBhZ2VQcm9wcyIsImxvYWRHZXRJbml0aWFsUHJvcHMiLCJkZWZhdWx0IiwicmVuZGVyIiwicHJvcHMiLCJjcmVhdGVFbGVtZW50Iiwib3JpZ0dldEluaXRpYWxQcm9wcyIsImdldEluaXRpYWxQcm9wcyIsIl9fZXNNb2R1bGUiLCJhc3NpZ24iLCJtb2R1bGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///../../node_modules/.pnpm/next@13.4.4_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/pages/_app.js\n");

/***/ }),

/***/ "../shared/lib/utils":
/*!************************************************!*\
  !*** external "next/dist/shared/lib/utils.js" ***!
  \************************************************/
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/utils.js");

/***/ }),

/***/ "react?1189":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ "../../node_modules/.pnpm/@swc+helpers@0.5.1/node_modules/@swc/helpers/cjs/_interop_require_default.cjs":
/*!**************************************************************************************************************!*\
  !*** ../../node_modules/.pnpm/@swc+helpers@0.5.1/node_modules/@swc/helpers/cjs/_interop_require_default.cjs ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\n\nexports._ = exports._interop_require_default = _interop_require_default;\nfunction _interop_require_default(obj) {\n    return obj && obj.__esModule ? obj : { default: obj };\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0Bzd2MraGVscGVyc0AwLjUuMS9ub2RlX21vZHVsZXMvQHN3Yy9oZWxwZXJzL2Nqcy9faW50ZXJvcF9yZXF1aXJlX2RlZmF1bHQuY2pzLmpzIiwibWFwcGluZ3MiOiJBQUFhOztBQUViLFNBQVMsR0FBRyxnQ0FBZ0M7QUFDNUM7QUFDQSwyQ0FBMkM7QUFDM0MiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWIvLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0Bzd2MraGVscGVyc0AwLjUuMS9ub2RlX21vZHVsZXMvQHN3Yy9oZWxwZXJzL2Nqcy9faW50ZXJvcF9yZXF1aXJlX2RlZmF1bHQuY2pzPzg4YzMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuXyA9IGV4cG9ydHMuX2ludGVyb3BfcmVxdWlyZV9kZWZhdWx0ID0gX2ludGVyb3BfcmVxdWlyZV9kZWZhdWx0O1xuZnVuY3Rpb24gX2ludGVyb3BfcmVxdWlyZV9kZWZhdWx0KG9iaikge1xuICAgIHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9O1xufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///../../node_modules/.pnpm/@swc+helpers@0.5.1/node_modules/@swc/helpers/cjs/_interop_require_default.cjs\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("../../node_modules/.pnpm/next@13.4.4_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/pages/_app.js"));
module.exports = __webpack_exports__;

})();