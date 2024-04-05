"use strict";
(() => {
var exports = {};
exports.id = 912;
exports.ids = [912];
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

/***/ 9491:
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ 4300:
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ 6113:
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ 3685:
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ 3477:
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ 7310:
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ 3837:
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ 9796:
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ 2042:
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

// NAMESPACE OBJECT: ./app/api/auth/[...nextauth]/route.tsx
var route_namespaceObject = {};
__webpack_require__.r(route_namespaceObject);
__webpack_require__.d(route_namespaceObject, {
  "GET": () => (handler),
  "POST": () => (handler)
});

// EXTERNAL MODULE: ../../node_modules/.pnpm/next@13.4.4_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/server/node-polyfill-headers.js
var node_polyfill_headers = __webpack_require__(6382);
// EXTERNAL MODULE: ../../node_modules/.pnpm/next@13.4.4_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/server/future/route-modules/app-route/module.js
var app_route_module = __webpack_require__(9373);
var module_default = /*#__PURE__*/__webpack_require__.n(app_route_module);
// EXTERNAL MODULE: ../../node_modules/.pnpm/next-auth@4.22.1_next@13.4.4_react-dom@18.2.0_react@18.2.0/node_modules/next-auth/next/index.js
var next = __webpack_require__(1765);
// EXTERNAL MODULE: ../../node_modules/.pnpm/next-auth@4.22.1_next@13.4.4_react-dom@18.2.0_react@18.2.0/node_modules/next-auth/providers/google.js
var google = __webpack_require__(5670);
// EXTERNAL MODULE: ./utils/database.ts
var database = __webpack_require__(6648);
// EXTERNAL MODULE: external "mongoose"
var external_mongoose_ = __webpack_require__(1185);
;// CONCATENATED MODULE: ./models/user.ts

const userSchema = new external_mongoose_.Schema({
    email: {
        type: String,
        unique: [
            true,
            "Email already exists"
        ],
        required: [
            true,
            "Email is required"
        ]
    },
    username: {
        type: String,
        required: [
            true,
            "Username is required"
        ],
        match: [
            /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
            "Username is invalid, it should contain 8-20 alphanumeric characters and be unique!"
        ]
    },
    image: {
        type: String
    }
});
const User = external_mongoose_.models.User || (0,external_mongoose_.model)("User", userSchema);
/* harmony default export */ const user = (User);

;// CONCATENATED MODULE: ./app/api/auth/[...nextauth]/route.tsx




console.log({
    clientId: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
});
// type Profile = {
//   email: string;
//   name: string;
//   picture: string;
// };
const GoogleId = process.env.GOOGLE_ID || "none";
const GoogleSecret = process.env.GOOGLE_CLIENT_SECRET || "none";
const handler = (0,next/* default */.ZP)({
    providers: [
        (0,google/* default */.Z)({
            clientId: GoogleId,
            clientSecret: GoogleSecret
        })
    ],
    callbacks: {
        async session ({ session  }) {
            if (session.user) {
                const sessionUser = await user.findOne({
                    email: session.user.email
                });
                session.user.id = sessionUser._id.toString();
            }
            return session;
        },
        async signIn ({ profile  }) {
            try {
                await (0,database/* connectToDB */.P)();
                const userExists = await user.findOne({
                    email: profile.email
                });
                if (!userExists) {
                    await user.create({
                        email: profile.email,
                        username: profile.name.replace(/\s/g, "").toLowerCase(),
                        image: profile.picture
                    });
                }
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        }
    }
});


;// CONCATENATED MODULE: ../../node_modules/.pnpm/next@13.4.4_react-dom@18.2.0_react@18.2.0/node_modules/next/dist/build/webpack/loaders/next-app-loader.js?page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.tsx&appDir=%2Fhome%2Fweiying-chen%2Fnode%2Fmonorepo_setup%2Fapps%2Fweb%2Fapp&appPaths=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=!

    

    

    

    const routeModule = new (module_default())({
    userland: route_namespaceObject,
    pathname: "/api/auth/[...nextauth]",
    resolvedPagePath: "/home/weiying-chen/node/monorepo_setup/apps/web/app/api/auth/[...nextauth]/route.tsx",
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

    const originalPathname = "/api/auth/[...nextauth]/route"

    

/***/ }),

/***/ 6648:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "P": () => (/* binding */ connectToDB)
/* harmony export */ });
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1185);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);

let isConnected = false;
const connectToDB = async ()=>{
    mongoose__WEBPACK_IMPORTED_MODULE_0___default().set("strictQuery", true);
    if (isConnected) {
        console.log("already connected");
        return;
    }
    try {
        const MONGODB_URI = process.env.MONGODB_URI || "none";
        await mongoose__WEBPACK_IMPORTED_MODULE_0___default().connect(MONGODB_URI, {
            dbName: "share_prompt"
        });
        isConnected = true;
        console.log("connected to db");
    } catch (err) {
        console.log(err);
    }
};


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [693,203,496], () => (__webpack_exec__(2042)));
module.exports = __webpack_exports__;

})();