"use strict";
(() => {
var exports = {};
exports.id = 82;
exports.ids = [82];
exports.modules = {

/***/ 1185:
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ 7783:
/***/ ((module) => {

module.exports = require("next/dist/compiled/@edge-runtime/cookies");

/***/ }),

/***/ 8530:
/***/ ((module) => {

module.exports = require("next/dist/compiled/@opentelemetry/api");

/***/ }),

/***/ 4426:
/***/ ((module) => {

module.exports = require("next/dist/compiled/chalk");

/***/ }),

/***/ 252:
/***/ ((module) => {

module.exports = require("next/dist/compiled/cookie");

/***/ }),

/***/ 4842:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "headerHooks": () => (/* binding */ headerHooks),
  "originalPathname": () => (/* binding */ originalPathname),
  "requestAsyncStorage": () => (/* binding */ requestAsyncStorage),
  "routeModule": () => (/* binding */ routeModule),
  "serverHooks": () => (/* binding */ serverHooks),
  "staticGenerationAsyncStorage": () => (/* binding */ staticGenerationAsyncStorage),
  "staticGenerationBailout": () => (/* binding */ staticGenerationBailout)
});

// NAMESPACE OBJECT: ./app/api/prompt/new/route.ts
var route_namespaceObject = {};
__webpack_require__.r(route_namespaceObject);
__webpack_require__.d(route_namespaceObject, {
  "POST": () => (POST)
});

// EXTERNAL MODULE: ../../node_modules/.pnpm/next@13.4.4_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/server/node-polyfill-headers.js
var node_polyfill_headers = __webpack_require__(6382);
// EXTERNAL MODULE: ../../node_modules/.pnpm/next@13.4.4_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/server/future/route-modules/app-route/module.js
var app_route_module = __webpack_require__(9373);
var module_default = /*#__PURE__*/__webpack_require__.n(app_route_module);
// EXTERNAL MODULE: ./utils/database.ts
var database = __webpack_require__(6648);
// EXTERNAL MODULE: ./models/prompt.ts
var models_prompt = __webpack_require__(5456);
;// CONCATENATED MODULE: ./app/api/prompt/new/route.ts


const POST = async (req, res)=>{
    const { userId , prompt , tag  } = await req.json();
    try {
        await (0,database/* connectToDB */.P)();
        const newPrompt = new models_prompt/* default */.Z({
            creator: userId,
            prompt,
            tag
        });
        await newPrompt.save();
        return new Response(JSON.stringify(newPrompt), {
            status: 201
        });
    } catch (err) {
        console.log(err);
        return new Response(JSON.stringify(err), {
            status: 500
        });
    }
};

;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@13.4.4_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?page=%2Fapi%2Fprompt%2Fnew%2Froute&name=app%2Fapi%2Fprompt%2Fnew%2Froute&pagePath=private-next-app-dir%2Fapi%2Fprompt%2Fnew%2Froute.ts&appDir=%2Fhome%2Fweiying-chen%2Fnode%2Fmonorepo_setup%2Fapps%2Fweb%2Fapp&appPaths=%2Fapi%2Fprompt%2Fnew%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=!

    

    

    

    const routeModule = new (module_default())({
    userland: route_namespaceObject,
    pathname: "/api/prompt/new",
    resolvedPagePath: "/home/weiying-chen/node/monorepo_setup/apps/web/app/api/prompt/new/route.ts",
    nextConfigOutput: undefined,
  })

    // Pull out the exports that we need to expose from the module. This should
    // be eliminated when we've moved the other routes to the new format. These
    // are used to hook into the route.
    const {
      requestAsyncStorage,
      staticGenerationAsyncStorage,
      serverHooks,
      headerHooks,
      staticGenerationBailout
    } = routeModule

    const originalPathname = "/api/prompt/new/route"

    

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [693,203,825], () => (__webpack_exec__(4842)));
module.exports = __webpack_exports__;

})();