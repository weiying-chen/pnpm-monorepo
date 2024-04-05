"use strict";
exports.id = 825;
exports.ids = [825];
exports.modules = {

/***/ 5456:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1185);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);

const PromptSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema({
    creator: {
        type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,
        ref: "User"
    },
    prompt: {
        type: String,
        required: [
            true,
            "Prompt is required"
        ]
    },
    tag: {
        type: String,
        required: [
            true,
            "Tag is required"
        ]
    }
});
const Prompt = mongoose__WEBPACK_IMPORTED_MODULE_0__.models.Prompt || (0,mongoose__WEBPACK_IMPORTED_MODULE_0__.model)("Prompt", PromptSchema);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Prompt);


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