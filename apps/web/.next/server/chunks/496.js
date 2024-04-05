exports.id = 496;
exports.ids = [496];
exports.modules = {

/***/ 3963:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */ 
/**
 * Module exports.
 * @public
 */ exports.parse = parse;
exports.serialize = serialize;
/**
 * Module variables.
 * @private
 */ var __toString = Object.prototype.toString;
/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */ var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */ function parse(str, options) {
    if (typeof str !== "string") {
        throw new TypeError("argument str must be a string");
    }
    var obj = {};
    var opt = options || {};
    var dec = opt.decode || decode;
    var index = 0;
    while(index < str.length){
        var eqIdx = str.indexOf("=", index);
        // no more cookie pairs
        if (eqIdx === -1) {
            break;
        }
        var endIdx = str.indexOf(";", index);
        if (endIdx === -1) {
            endIdx = str.length;
        } else if (endIdx < eqIdx) {
            // backtrack on prior semicolon
            index = str.lastIndexOf(";", eqIdx - 1) + 1;
            continue;
        }
        var key = str.slice(index, eqIdx).trim();
        // only assign once
        if (undefined === obj[key]) {
            var val = str.slice(eqIdx + 1, endIdx).trim();
            // quoted values
            if (val.charCodeAt(0) === 0x22) {
                val = val.slice(1, -1);
            }
            obj[key] = tryDecode(val, dec);
        }
        index = endIdx + 1;
    }
    return obj;
}
/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [options]
 * @return {string}
 * @public
 */ function serialize(name, val, options) {
    var opt = options || {};
    var enc = opt.encode || encode;
    if (typeof enc !== "function") {
        throw new TypeError("option encode is invalid");
    }
    if (!fieldContentRegExp.test(name)) {
        throw new TypeError("argument name is invalid");
    }
    var value = enc(val);
    if (value && !fieldContentRegExp.test(value)) {
        throw new TypeError("argument val is invalid");
    }
    var str = name + "=" + value;
    if (null != opt.maxAge) {
        var maxAge = opt.maxAge - 0;
        if (isNaN(maxAge) || !isFinite(maxAge)) {
            throw new TypeError("option maxAge is invalid");
        }
        str += "; Max-Age=" + Math.floor(maxAge);
    }
    if (opt.domain) {
        if (!fieldContentRegExp.test(opt.domain)) {
            throw new TypeError("option domain is invalid");
        }
        str += "; Domain=" + opt.domain;
    }
    if (opt.path) {
        if (!fieldContentRegExp.test(opt.path)) {
            throw new TypeError("option path is invalid");
        }
        str += "; Path=" + opt.path;
    }
    if (opt.expires) {
        var expires = opt.expires;
        if (!isDate(expires) || isNaN(expires.valueOf())) {
            throw new TypeError("option expires is invalid");
        }
        str += "; Expires=" + expires.toUTCString();
    }
    if (opt.httpOnly) {
        str += "; HttpOnly";
    }
    if (opt.secure) {
        str += "; Secure";
    }
    if (opt.priority) {
        var priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
        switch(priority){
            case "low":
                str += "; Priority=Low";
                break;
            case "medium":
                str += "; Priority=Medium";
                break;
            case "high":
                str += "; Priority=High";
                break;
            default:
                throw new TypeError("option priority is invalid");
        }
    }
    if (opt.sameSite) {
        var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch(sameSite){
            case true:
                str += "; SameSite=Strict";
                break;
            case "lax":
                str += "; SameSite=Lax";
                break;
            case "strict":
                str += "; SameSite=Strict";
                break;
            case "none":
                str += "; SameSite=None";
                break;
            default:
                throw new TypeError("option sameSite is invalid");
        }
    }
    return str;
}
/**
 * URL-decode string value. Optimized to skip native call when no %.
 *
 * @param {string} str
 * @returns {string}
 */ function decode(str) {
    return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
}
/**
 * URL-encode value.
 *
 * @param {string} str
 * @returns {string}
 */ function encode(val) {
    return encodeURIComponent(val);
}
/**
 * Determine if value is a Date.
 *
 * @param {*} val
 * @private
 */ function isDate(val) {
    return __toString.call(val) === "[object Date]" || val instanceof Date;
}
/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */ function tryDecode(str, decode) {
    try {
        return decode(str);
    } catch (e) {
        return str;
    }
}


/***/ }),

/***/ 9814:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// A linked list to keep track of recently-used-ness
const Yallist = __webpack_require__(7954);
const MAX = Symbol("max");
const LENGTH = Symbol("length");
const LENGTH_CALCULATOR = Symbol("lengthCalculator");
const ALLOW_STALE = Symbol("allowStale");
const MAX_AGE = Symbol("maxAge");
const DISPOSE = Symbol("dispose");
const NO_DISPOSE_ON_SET = Symbol("noDisposeOnSet");
const LRU_LIST = Symbol("lruList");
const CACHE = Symbol("cache");
const UPDATE_AGE_ON_GET = Symbol("updateAgeOnGet");
const naiveLength = ()=>1;
// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
class LRUCache {
    constructor(options){
        if (typeof options === "number") options = {
            max: options
        };
        if (!options) options = {};
        if (options.max && (typeof options.max !== "number" || options.max < 0)) throw new TypeError("max must be a non-negative number");
        // Kind of weird to have a default max of Infinity, but oh well.
        const max = this[MAX] = options.max || Infinity;
        const lc = options.length || naiveLength;
        this[LENGTH_CALCULATOR] = typeof lc !== "function" ? naiveLength : lc;
        this[ALLOW_STALE] = options.stale || false;
        if (options.maxAge && typeof options.maxAge !== "number") throw new TypeError("maxAge must be a number");
        this[MAX_AGE] = options.maxAge || 0;
        this[DISPOSE] = options.dispose;
        this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
        this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false;
        this.reset();
    }
    // resize the cache when the max changes.
    set max(mL) {
        if (typeof mL !== "number" || mL < 0) throw new TypeError("max must be a non-negative number");
        this[MAX] = mL || Infinity;
        trim(this);
    }
    get max() {
        return this[MAX];
    }
    set allowStale(allowStale) {
        this[ALLOW_STALE] = !!allowStale;
    }
    get allowStale() {
        return this[ALLOW_STALE];
    }
    set maxAge(mA) {
        if (typeof mA !== "number") throw new TypeError("maxAge must be a non-negative number");
        this[MAX_AGE] = mA;
        trim(this);
    }
    get maxAge() {
        return this[MAX_AGE];
    }
    // resize the cache when the lengthCalculator changes.
    set lengthCalculator(lC) {
        if (typeof lC !== "function") lC = naiveLength;
        if (lC !== this[LENGTH_CALCULATOR]) {
            this[LENGTH_CALCULATOR] = lC;
            this[LENGTH] = 0;
            this[LRU_LIST].forEach((hit)=>{
                hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key);
                this[LENGTH] += hit.length;
            });
        }
        trim(this);
    }
    get lengthCalculator() {
        return this[LENGTH_CALCULATOR];
    }
    get length() {
        return this[LENGTH];
    }
    get itemCount() {
        return this[LRU_LIST].length;
    }
    rforEach(fn, thisp) {
        thisp = thisp || this;
        for(let walker = this[LRU_LIST].tail; walker !== null;){
            const prev = walker.prev;
            forEachStep(this, fn, walker, thisp);
            walker = prev;
        }
    }
    forEach(fn, thisp) {
        thisp = thisp || this;
        for(let walker = this[LRU_LIST].head; walker !== null;){
            const next = walker.next;
            forEachStep(this, fn, walker, thisp);
            walker = next;
        }
    }
    keys() {
        return this[LRU_LIST].toArray().map((k)=>k.key);
    }
    values() {
        return this[LRU_LIST].toArray().map((k)=>k.value);
    }
    reset() {
        if (this[DISPOSE] && this[LRU_LIST] && this[LRU_LIST].length) {
            this[LRU_LIST].forEach((hit)=>this[DISPOSE](hit.key, hit.value));
        }
        this[CACHE] = new Map() // hash of items by key
        ;
        this[LRU_LIST] = new Yallist() // list of items in order of use recency
        ;
        this[LENGTH] = 0 // length of items in the list
        ;
    }
    dump() {
        return this[LRU_LIST].map((hit)=>isStale(this, hit) ? false : {
                k: hit.key,
                v: hit.value,
                e: hit.now + (hit.maxAge || 0)
            }).toArray().filter((h)=>h);
    }
    dumpLru() {
        return this[LRU_LIST];
    }
    set(key, value, maxAge) {
        maxAge = maxAge || this[MAX_AGE];
        if (maxAge && typeof maxAge !== "number") throw new TypeError("maxAge must be a number");
        const now = maxAge ? Date.now() : 0;
        const len = this[LENGTH_CALCULATOR](value, key);
        if (this[CACHE].has(key)) {
            if (len > this[MAX]) {
                del(this, this[CACHE].get(key));
                return false;
            }
            const node = this[CACHE].get(key);
            const item = node.value;
            // dispose of the old one before overwriting
            // split out into 2 ifs for better coverage tracking
            if (this[DISPOSE]) {
                if (!this[NO_DISPOSE_ON_SET]) this[DISPOSE](key, item.value);
            }
            item.now = now;
            item.maxAge = maxAge;
            item.value = value;
            this[LENGTH] += len - item.length;
            item.length = len;
            this.get(key);
            trim(this);
            return true;
        }
        const hit = new Entry(key, value, len, now, maxAge);
        // oversized objects fall out of cache automatically.
        if (hit.length > this[MAX]) {
            if (this[DISPOSE]) this[DISPOSE](key, value);
            return false;
        }
        this[LENGTH] += hit.length;
        this[LRU_LIST].unshift(hit);
        this[CACHE].set(key, this[LRU_LIST].head);
        trim(this);
        return true;
    }
    has(key) {
        if (!this[CACHE].has(key)) return false;
        const hit = this[CACHE].get(key).value;
        return !isStale(this, hit);
    }
    get(key) {
        return get(this, key, true);
    }
    peek(key) {
        return get(this, key, false);
    }
    pop() {
        const node = this[LRU_LIST].tail;
        if (!node) return null;
        del(this, node);
        return node.value;
    }
    del(key) {
        del(this, this[CACHE].get(key));
    }
    load(arr) {
        // reset the cache
        this.reset();
        const now = Date.now();
        // A previous serialized cache has the most recent items first
        for(let l = arr.length - 1; l >= 0; l--){
            const hit = arr[l];
            const expiresAt = hit.e || 0;
            if (expiresAt === 0) // the item was created without expiration in a non aged cache
            this.set(hit.k, hit.v);
            else {
                const maxAge = expiresAt - now;
                // dont add already expired items
                if (maxAge > 0) {
                    this.set(hit.k, hit.v, maxAge);
                }
            }
        }
    }
    prune() {
        this[CACHE].forEach((value, key)=>get(this, key, false));
    }
}
const get = (self, key, doUse)=>{
    const node = self[CACHE].get(key);
    if (node) {
        const hit = node.value;
        if (isStale(self, hit)) {
            del(self, node);
            if (!self[ALLOW_STALE]) return undefined;
        } else {
            if (doUse) {
                if (self[UPDATE_AGE_ON_GET]) node.value.now = Date.now();
                self[LRU_LIST].unshiftNode(node);
            }
        }
        return hit.value;
    }
};
const isStale = (self, hit)=>{
    if (!hit || !hit.maxAge && !self[MAX_AGE]) return false;
    const diff = Date.now() - hit.now;
    return hit.maxAge ? diff > hit.maxAge : self[MAX_AGE] && diff > self[MAX_AGE];
};
const trim = (self)=>{
    if (self[LENGTH] > self[MAX]) {
        for(let walker = self[LRU_LIST].tail; self[LENGTH] > self[MAX] && walker !== null;){
            // We know that we're about to delete this one, and also
            // what the next least recently used key will be, so just
            // go ahead and set it now.
            const prev = walker.prev;
            del(self, walker);
            walker = prev;
        }
    }
};
const del = (self, node)=>{
    if (node) {
        const hit = node.value;
        if (self[DISPOSE]) self[DISPOSE](hit.key, hit.value);
        self[LENGTH] -= hit.length;
        self[CACHE].delete(hit.key);
        self[LRU_LIST].removeNode(node);
    }
};
class Entry {
    constructor(key, value, length, now, maxAge){
        this.key = key;
        this.value = value;
        this.length = length;
        this.now = now;
        this.maxAge = maxAge || 0;
    }
}
const forEachStep = (self, fn, node, thisp)=>{
    let hit = node.value;
    if (isStale(self, hit)) {
        del(self, node);
        if (!self[ALLOW_STALE]) hit = undefined;
    }
    if (hit) fn.call(thisp, hit.value, hit.key, self);
};
module.exports = LRUCache;


/***/ }),

/***/ 2057:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(6533);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.UnsupportedStrategy = exports.UnknownError = exports.OAuthCallbackError = exports.MissingSecret = exports.MissingAuthorize = exports.MissingAdapterMethods = exports.MissingAdapter = exports.MissingAPIRoute = exports.InvalidCallbackUrl = exports.AccountNotLinkedError = void 0;
exports.adapterErrorHandler = adapterErrorHandler;
exports.capitalize = capitalize;
exports.eventsErrorHandler = eventsErrorHandler;
exports.upperSnake = upperSnake;
var _regenerator = _interopRequireDefault(__webpack_require__(2764));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(2318));
var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(6150));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(4601));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(639));
var _createClass2 = _interopRequireDefault(__webpack_require__(3268));
var _inherits2 = _interopRequireDefault(__webpack_require__(5881));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(8895));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(8638));
var _wrapNativeSuper2 = _interopRequireDefault(__webpack_require__(2912));
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = (0, _getPrototypeOf2.default)(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = (0, _getPrototypeOf2.default)(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return (0, _possibleConstructorReturn2.default)(this, result);
    };
}
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}
var UnknownError = function(_Error) {
    (0, _inherits2.default)(UnknownError, _Error);
    var _super = _createSuper(UnknownError);
    function UnknownError(error) {
        var _message;
        var _this;
        (0, _classCallCheck2.default)(this, UnknownError);
        _this = _super.call(this, (_message = error === null || error === void 0 ? void 0 : error.message) !== null && _message !== void 0 ? _message : error);
        _this.name = "UnknownError";
        _this.code = error.code;
        if (error instanceof Error) {
            _this.stack = error.stack;
        }
        return _this;
    }
    (0, _createClass2.default)(UnknownError, [
        {
            key: "toJSON",
            value: function toJSON() {
                return {
                    name: this.name,
                    message: this.message,
                    stack: this.stack
                };
            }
        }
    ]);
    return UnknownError;
}((0, _wrapNativeSuper2.default)(Error));
exports.UnknownError = UnknownError;
var OAuthCallbackError = function(_UnknownError) {
    (0, _inherits2.default)(OAuthCallbackError, _UnknownError);
    var _super2 = _createSuper(OAuthCallbackError);
    function OAuthCallbackError() {
        var _this2;
        (0, _classCallCheck2.default)(this, OAuthCallbackError);
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        _this2 = _super2.call.apply(_super2, [
            this
        ].concat(args));
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this2), "name", "OAuthCallbackError");
        return _this2;
    }
    return (0, _createClass2.default)(OAuthCallbackError);
}(UnknownError);
exports.OAuthCallbackError = OAuthCallbackError;
var AccountNotLinkedError = function(_UnknownError2) {
    (0, _inherits2.default)(AccountNotLinkedError, _UnknownError2);
    var _super3 = _createSuper(AccountNotLinkedError);
    function AccountNotLinkedError() {
        var _this3;
        (0, _classCallCheck2.default)(this, AccountNotLinkedError);
        for(var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++){
            args[_key2] = arguments[_key2];
        }
        _this3 = _super3.call.apply(_super3, [
            this
        ].concat(args));
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "name", "AccountNotLinkedError");
        return _this3;
    }
    return (0, _createClass2.default)(AccountNotLinkedError);
}(UnknownError);
exports.AccountNotLinkedError = AccountNotLinkedError;
var MissingAPIRoute = function(_UnknownError3) {
    (0, _inherits2.default)(MissingAPIRoute, _UnknownError3);
    var _super4 = _createSuper(MissingAPIRoute);
    function MissingAPIRoute() {
        var _this4;
        (0, _classCallCheck2.default)(this, MissingAPIRoute);
        for(var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++){
            args[_key3] = arguments[_key3];
        }
        _this4 = _super4.call.apply(_super4, [
            this
        ].concat(args));
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "name", "MissingAPIRouteError");
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "code", "MISSING_NEXTAUTH_API_ROUTE_ERROR");
        return _this4;
    }
    return (0, _createClass2.default)(MissingAPIRoute);
}(UnknownError);
exports.MissingAPIRoute = MissingAPIRoute;
var MissingSecret = function(_UnknownError4) {
    (0, _inherits2.default)(MissingSecret, _UnknownError4);
    var _super5 = _createSuper(MissingSecret);
    function MissingSecret() {
        var _this5;
        (0, _classCallCheck2.default)(this, MissingSecret);
        for(var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++){
            args[_key4] = arguments[_key4];
        }
        _this5 = _super5.call.apply(_super5, [
            this
        ].concat(args));
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this5), "name", "MissingSecretError");
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this5), "code", "NO_SECRET");
        return _this5;
    }
    return (0, _createClass2.default)(MissingSecret);
}(UnknownError);
exports.MissingSecret = MissingSecret;
var MissingAuthorize = function(_UnknownError5) {
    (0, _inherits2.default)(MissingAuthorize, _UnknownError5);
    var _super6 = _createSuper(MissingAuthorize);
    function MissingAuthorize() {
        var _this6;
        (0, _classCallCheck2.default)(this, MissingAuthorize);
        for(var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++){
            args[_key5] = arguments[_key5];
        }
        _this6 = _super6.call.apply(_super6, [
            this
        ].concat(args));
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this6), "name", "MissingAuthorizeError");
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this6), "code", "CALLBACK_CREDENTIALS_HANDLER_ERROR");
        return _this6;
    }
    return (0, _createClass2.default)(MissingAuthorize);
}(UnknownError);
exports.MissingAuthorize = MissingAuthorize;
var MissingAdapter = function(_UnknownError6) {
    (0, _inherits2.default)(MissingAdapter, _UnknownError6);
    var _super7 = _createSuper(MissingAdapter);
    function MissingAdapter() {
        var _this7;
        (0, _classCallCheck2.default)(this, MissingAdapter);
        for(var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++){
            args[_key6] = arguments[_key6];
        }
        _this7 = _super7.call.apply(_super7, [
            this
        ].concat(args));
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this7), "name", "MissingAdapterError");
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this7), "code", "EMAIL_REQUIRES_ADAPTER_ERROR");
        return _this7;
    }
    return (0, _createClass2.default)(MissingAdapter);
}(UnknownError);
exports.MissingAdapter = MissingAdapter;
var MissingAdapterMethods = function(_UnknownError7) {
    (0, _inherits2.default)(MissingAdapterMethods, _UnknownError7);
    var _super8 = _createSuper(MissingAdapterMethods);
    function MissingAdapterMethods() {
        var _this8;
        (0, _classCallCheck2.default)(this, MissingAdapterMethods);
        for(var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++){
            args[_key7] = arguments[_key7];
        }
        _this8 = _super8.call.apply(_super8, [
            this
        ].concat(args));
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this8), "name", "MissingAdapterMethodsError");
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this8), "code", "MISSING_ADAPTER_METHODS_ERROR");
        return _this8;
    }
    return (0, _createClass2.default)(MissingAdapterMethods);
}(UnknownError);
exports.MissingAdapterMethods = MissingAdapterMethods;
var UnsupportedStrategy = function(_UnknownError8) {
    (0, _inherits2.default)(UnsupportedStrategy, _UnknownError8);
    var _super9 = _createSuper(UnsupportedStrategy);
    function UnsupportedStrategy() {
        var _this9;
        (0, _classCallCheck2.default)(this, UnsupportedStrategy);
        for(var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++){
            args[_key8] = arguments[_key8];
        }
        _this9 = _super9.call.apply(_super9, [
            this
        ].concat(args));
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this9), "name", "UnsupportedStrategyError");
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this9), "code", "CALLBACK_CREDENTIALS_JWT_ERROR");
        return _this9;
    }
    return (0, _createClass2.default)(UnsupportedStrategy);
}(UnknownError);
exports.UnsupportedStrategy = UnsupportedStrategy;
var InvalidCallbackUrl = function(_UnknownError9) {
    (0, _inherits2.default)(InvalidCallbackUrl, _UnknownError9);
    var _super10 = _createSuper(InvalidCallbackUrl);
    function InvalidCallbackUrl() {
        var _this10;
        (0, _classCallCheck2.default)(this, InvalidCallbackUrl);
        for(var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++){
            args[_key9] = arguments[_key9];
        }
        _this10 = _super10.call.apply(_super10, [
            this
        ].concat(args));
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this10), "name", "InvalidCallbackUrl");
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this10), "code", "INVALID_CALLBACK_URL_ERROR");
        return _this10;
    }
    return (0, _createClass2.default)(InvalidCallbackUrl);
}(UnknownError);
exports.InvalidCallbackUrl = InvalidCallbackUrl;
function upperSnake(s) {
    return s.replace(/([A-Z])/g, "_$1").toUpperCase();
}
function capitalize(s) {
    return "".concat(s[0].toUpperCase()).concat(s.slice(1));
}
function eventsErrorHandler(methods, logger) {
    return Object.keys(methods).reduce(function(acc, name) {
        acc[name] = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
            var method, _args = arguments;
            return _regenerator.default.wrap(function _callee$(_context) {
                while(1){
                    switch(_context.prev = _context.next){
                        case 0:
                            _context.prev = 0;
                            method = methods[name];
                            _context.next = 4;
                            return method.apply(void 0, _args);
                        case 4:
                            return _context.abrupt("return", _context.sent);
                        case 7:
                            _context.prev = 7;
                            _context.t0 = _context["catch"](0);
                            logger.error("".concat(upperSnake(name), "_EVENT_ERROR"), _context.t0);
                        case 10:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, null, [
                [
                    0,
                    7
                ]
            ]);
        }));
        return acc;
    }, {});
}
function adapterErrorHandler(adapter, logger) {
    if (!adapter) return;
    return Object.keys(adapter).reduce(function(acc, name) {
        acc[name] = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2() {
            var _len10, args, _key10, method, e, _args2 = arguments;
            return _regenerator.default.wrap(function _callee2$(_context2) {
                while(1){
                    switch(_context2.prev = _context2.next){
                        case 0:
                            _context2.prev = 0;
                            for(_len10 = _args2.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++){
                                args[_key10] = _args2[_key10];
                            }
                            logger.debug("adapter_".concat(name), {
                                args: args
                            });
                            method = adapter[name];
                            _context2.next = 6;
                            return method.apply(void 0, args);
                        case 6:
                            return _context2.abrupt("return", _context2.sent);
                        case 9:
                            _context2.prev = 9;
                            _context2.t0 = _context2["catch"](0);
                            logger.error("adapter_error_".concat(name), _context2.t0);
                            e = new UnknownError(_context2.t0);
                            e.name = "".concat(capitalize(name), "Error");
                            throw e;
                        case 15:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, null, [
                [
                    0,
                    9
                ]
            ]);
        }));
        return acc;
    }, {});
}


/***/ }),

/***/ 830:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(6533);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.AuthHandler = AuthHandler;
var _logger = _interopRequireWildcard(__webpack_require__(9233));
var _detectOrigin = __webpack_require__(7039);
var routes = _interopRequireWildcard(__webpack_require__(4136));
var _pages = _interopRequireDefault(__webpack_require__(1551));
var _init = __webpack_require__(9421);
var _assert = __webpack_require__(3352);
var _cookie = __webpack_require__(8246);
var _cookie2 = __webpack_require__(3963);
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
async function getBody(req) {
    try {
        return await req.json();
    } catch (_unused) {}
}
async function toInternalRequest(req) {
    var _headers$xForwarded2;
    if (req instanceof Request) {
        var _req$headers$get, _url$searchParams$get, _headers$xForwarded;
        const url = new URL(req.url);
        const nextauth = url.pathname.split("/").slice(3);
        const headers = Object.fromEntries(req.headers);
        const query = Object.fromEntries(url.searchParams);
        query.nextauth = nextauth;
        return {
            action: nextauth[0],
            method: req.method,
            headers,
            body: await getBody(req),
            cookies: (0, _cookie2.parse)((_req$headers$get = req.headers.get("cookie")) !== null && _req$headers$get !== void 0 ? _req$headers$get : ""),
            providerId: nextauth[1],
            error: (_url$searchParams$get = url.searchParams.get("error")) !== null && _url$searchParams$get !== void 0 ? _url$searchParams$get : nextauth[1],
            origin: (0, _detectOrigin.detectOrigin)((_headers$xForwarded = headers["x-forwarded-host"]) !== null && _headers$xForwarded !== void 0 ? _headers$xForwarded : headers.host, headers["x-forwarded-proto"]),
            query
        };
    }
    const { headers  } = req;
    const host = (_headers$xForwarded2 = headers === null || headers === void 0 ? void 0 : headers["x-forwarded-host"]) !== null && _headers$xForwarded2 !== void 0 ? _headers$xForwarded2 : headers === null || headers === void 0 ? void 0 : headers.host;
    req.origin = (0, _detectOrigin.detectOrigin)(host, headers === null || headers === void 0 ? void 0 : headers["x-forwarded-proto"]);
    return req;
}
async function AuthHandler(params) {
    var _req$body$callbackUrl, _req$body, _req$query2, _req$body2;
    const { options: authOptions , req: incomingRequest  } = params;
    const req = await toInternalRequest(incomingRequest);
    (0, _logger.setLogger)(authOptions.logger, authOptions.debug);
    const assertionResult = (0, _assert.assertConfig)({
        options: authOptions,
        req
    });
    if (Array.isArray(assertionResult)) {
        assertionResult.forEach(_logger.default.warn);
    } else if (assertionResult instanceof Error) {
        var _req$query, _req$query$callbackUr;
        _logger.default.error(assertionResult.code, assertionResult);
        const htmlPages = [
            "signin",
            "signout",
            "error",
            "verify-request"
        ];
        if (!htmlPages.includes(req.action) || req.method !== "GET") {
            const message = `There is a problem with the server configuration. Check the server logs for more information.`;
            return {
                status: 500,
                headers: [
                    {
                        key: "Content-Type",
                        value: "application/json"
                    }
                ],
                body: {
                    message
                }
            };
        }
        const { pages , theme  } = authOptions;
        const authOnErrorPage = (pages === null || pages === void 0 ? void 0 : pages.error) && ((_req$query = req.query) === null || _req$query === void 0 ? void 0 : (_req$query$callbackUr = _req$query.callbackUrl) === null || _req$query$callbackUr === void 0 ? void 0 : _req$query$callbackUr.startsWith(pages.error));
        if (!(pages !== null && pages !== void 0 && pages.error) || authOnErrorPage) {
            if (authOnErrorPage) {
                _logger.default.error("AUTH_ON_ERROR_PAGE_ERROR", new Error(`The error page ${pages === null || pages === void 0 ? void 0 : pages.error} should not require authentication`));
            }
            const render = (0, _pages.default)({
                theme
            });
            return render.error({
                error: "configuration"
            });
        }
        return {
            redirect: `${pages.error}?error=Configuration`
        };
    }
    const { action , providerId , error , method ="GET"  } = req;
    const { options , cookies  } = await (0, _init.init)({
        authOptions,
        action,
        providerId,
        origin: req.origin,
        callbackUrl: (_req$body$callbackUrl = (_req$body = req.body) === null || _req$body === void 0 ? void 0 : _req$body.callbackUrl) !== null && _req$body$callbackUrl !== void 0 ? _req$body$callbackUrl : (_req$query2 = req.query) === null || _req$query2 === void 0 ? void 0 : _req$query2.callbackUrl,
        csrfToken: (_req$body2 = req.body) === null || _req$body2 === void 0 ? void 0 : _req$body2.csrfToken,
        cookies: req.cookies,
        isPost: method === "POST"
    });
    const sessionStore = new _cookie.SessionStore(options.cookies.sessionToken, req, options.logger);
    if (method === "GET") {
        const render = (0, _pages.default)({
            ...options,
            query: req.query,
            cookies
        });
        const { pages  } = options;
        switch(action){
            case "providers":
                return await routes.providers(options.providers);
            case "session":
                {
                    const session = await routes.session({
                        options,
                        sessionStore
                    });
                    if (session.cookies) cookies.push(...session.cookies);
                    return {
                        ...session,
                        cookies
                    };
                }
            case "csrf":
                return {
                    headers: [
                        {
                            key: "Content-Type",
                            value: "application/json"
                        }
                    ],
                    body: {
                        csrfToken: options.csrfToken
                    },
                    cookies
                };
            case "signin":
                if (pages.signIn) {
                    let signinUrl = `${pages.signIn}${pages.signIn.includes("?") ? "&" : "?"}callbackUrl=${encodeURIComponent(options.callbackUrl)}`;
                    if (error) signinUrl = `${signinUrl}&error=${encodeURIComponent(error)}`;
                    return {
                        redirect: signinUrl,
                        cookies
                    };
                }
                return render.signin();
            case "signout":
                if (pages.signOut) return {
                    redirect: pages.signOut,
                    cookies
                };
                return render.signout();
            case "callback":
                if (options.provider) {
                    const callback = await routes.callback({
                        body: req.body,
                        query: req.query,
                        headers: req.headers,
                        cookies: req.cookies,
                        method,
                        options,
                        sessionStore
                    });
                    if (callback.cookies) cookies.push(...callback.cookies);
                    return {
                        ...callback,
                        cookies
                    };
                }
                break;
            case "verify-request":
                if (pages.verifyRequest) {
                    return {
                        redirect: pages.verifyRequest,
                        cookies
                    };
                }
                return render.verifyRequest();
            case "error":
                if ([
                    "Signin",
                    "OAuthSignin",
                    "OAuthCallback",
                    "OAuthCreateAccount",
                    "EmailCreateAccount",
                    "Callback",
                    "OAuthAccountNotLinked",
                    "EmailSignin",
                    "CredentialsSignin",
                    "SessionRequired"
                ].includes(error)) {
                    return {
                        redirect: `${options.url}/signin?error=${error}`,
                        cookies
                    };
                }
                if (pages.error) {
                    return {
                        redirect: `${pages.error}${pages.error.includes("?") ? "&" : "?"}error=${error}`,
                        cookies
                    };
                }
                return render.error({
                    error: error
                });
            default:
        }
    } else if (method === "POST") {
        switch(action){
            case "signin":
                if (options.csrfTokenVerified && options.provider) {
                    const signin = await routes.signin({
                        query: req.query,
                        body: req.body,
                        options
                    });
                    if (signin.cookies) cookies.push(...signin.cookies);
                    return {
                        ...signin,
                        cookies
                    };
                }
                return {
                    redirect: `${options.url}/signin?csrf=true`,
                    cookies
                };
            case "signout":
                if (options.csrfTokenVerified) {
                    const signout = await routes.signout({
                        options,
                        sessionStore
                    });
                    if (signout.cookies) cookies.push(...signout.cookies);
                    return {
                        ...signout,
                        cookies
                    };
                }
                return {
                    redirect: `${options.url}/signout?csrf=true`,
                    cookies
                };
            case "callback":
                if (options.provider) {
                    if (options.provider.type === "credentials" && !options.csrfTokenVerified) {
                        return {
                            redirect: `${options.url}/signin?csrf=true`,
                            cookies
                        };
                    }
                    const callback = await routes.callback({
                        body: req.body,
                        query: req.query,
                        headers: req.headers,
                        cookies: req.cookies,
                        method,
                        options,
                        sessionStore
                    });
                    if (callback.cookies) cookies.push(...callback.cookies);
                    return {
                        ...callback,
                        cookies
                    };
                }
                break;
            case "_log":
                {
                    if (authOptions.logger) {
                        try {
                            var _req$body3;
                            const { code , level , ...metadata } = (_req$body3 = req.body) !== null && _req$body3 !== void 0 ? _req$body3 : {};
                            _logger.default[level](code, metadata);
                        } catch (error) {
                            _logger.default.error("LOGGER_ERROR", error);
                        }
                    }
                    return {};
                }
            case "session":
                {
                    if (options.csrfTokenVerified) {
                        var _req$body4;
                        const session = await routes.session({
                            options,
                            sessionStore,
                            newSession: (_req$body4 = req.body) === null || _req$body4 === void 0 ? void 0 : _req$body4.data,
                            isUpdate: true
                        });
                        if (session.cookies) cookies.push(...session.cookies);
                        return {
                            ...session,
                            cookies
                        };
                    }
                    return {
                        status: 400,
                        body: {},
                        cookies
                    };
                }
            default:
        }
    }
    return {
        status: 400,
        body: `Error: This action with HTTP ${method} is not supported by NextAuth.js`
    };
}


/***/ }),

/***/ 9421:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(6533);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.init = init;
var _crypto = __webpack_require__(6113);
var _logger = _interopRequireDefault(__webpack_require__(9233));
var _errors = __webpack_require__(2057);
var _providers = _interopRequireDefault(__webpack_require__(6129));
var _utils = __webpack_require__(3093);
var cookie = _interopRequireWildcard(__webpack_require__(8246));
var jwt = _interopRequireWildcard(__webpack_require__(7324));
var _defaultCallbacks = __webpack_require__(6993);
var _csrfToken = __webpack_require__(3737);
var _callbackUrl = __webpack_require__(3654);
var _parseUrl = _interopRequireDefault(__webpack_require__(4793));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
async function init({ authOptions , providerId , action , origin , cookies: reqCookies , callbackUrl: reqCallbackUrl , csrfToken: reqCsrfToken , isPost  }) {
    var _authOptions$useSecur, _authOptions$events;
    const url = (0, _parseUrl.default)(origin);
    const secret = (0, _utils.createSecret)({
        authOptions,
        url
    });
    const { providers , provider  } = (0, _providers.default)({
        providers: authOptions.providers,
        url,
        providerId
    });
    const maxAge = 30 * 24 * 60 * 60;
    const options = {
        debug: false,
        pages: {},
        theme: {
            colorScheme: "auto",
            logo: "",
            brandColor: "",
            buttonText: ""
        },
        ...authOptions,
        url,
        action,
        provider,
        cookies: {
            ...cookie.defaultCookies((_authOptions$useSecur = authOptions.useSecureCookies) !== null && _authOptions$useSecur !== void 0 ? _authOptions$useSecur : url.base.startsWith("https://")),
            ...authOptions.cookies
        },
        secret,
        providers,
        session: {
            strategy: authOptions.adapter ? "database" : "jwt",
            maxAge,
            updateAge: 24 * 60 * 60,
            generateSessionToken: ()=>{
                var _randomUUID;
                return (_randomUUID = _crypto.randomUUID === null || _crypto.randomUUID === void 0 ? void 0 : (0, _crypto.randomUUID)()) !== null && _randomUUID !== void 0 ? _randomUUID : (0, _crypto.randomBytes)(32).toString("hex");
            },
            ...authOptions.session
        },
        jwt: {
            secret,
            maxAge,
            encode: jwt.encode,
            decode: jwt.decode,
            ...authOptions.jwt
        },
        events: (0, _errors.eventsErrorHandler)((_authOptions$events = authOptions.events) !== null && _authOptions$events !== void 0 ? _authOptions$events : {}, _logger.default),
        adapter: (0, _errors.adapterErrorHandler)(authOptions.adapter, _logger.default),
        callbacks: {
            ..._defaultCallbacks.defaultCallbacks,
            ...authOptions.callbacks
        },
        logger: _logger.default,
        callbackUrl: url.origin
    };
    const cookies = [];
    const { csrfToken , cookie: csrfCookie , csrfTokenVerified  } = (0, _csrfToken.createCSRFToken)({
        options,
        cookieValue: reqCookies === null || reqCookies === void 0 ? void 0 : reqCookies[options.cookies.csrfToken.name],
        isPost,
        bodyValue: reqCsrfToken
    });
    options.csrfToken = csrfToken;
    options.csrfTokenVerified = csrfTokenVerified;
    if (csrfCookie) {
        cookies.push({
            name: options.cookies.csrfToken.name,
            value: csrfCookie,
            options: options.cookies.csrfToken.options
        });
    }
    const { callbackUrl , callbackUrlCookie  } = await (0, _callbackUrl.createCallbackUrl)({
        options,
        cookieValue: reqCookies === null || reqCookies === void 0 ? void 0 : reqCookies[options.cookies.callbackUrl.name],
        paramValue: reqCallbackUrl
    });
    options.callbackUrl = callbackUrl;
    if (callbackUrlCookie) {
        cookies.push({
            name: options.cookies.callbackUrl.name,
            value: callbackUrlCookie,
            options: options.cookies.callbackUrl.options
        });
    }
    return {
        options,
        cookies
    };
}


/***/ }),

/***/ 3352:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(6533);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.assertConfig = assertConfig;
var _errors = __webpack_require__(2057);
var _parseUrl = _interopRequireDefault(__webpack_require__(4793));
var _cookie = __webpack_require__(8246);
let warned = false;
function isValidHttpUrl(url, baseUrl) {
    try {
        return /^https?:/.test(new URL(url, url.startsWith("/") ? baseUrl : undefined).protocol);
    } catch (_unused) {
        return false;
    }
}
function assertConfig(params) {
    var _req$query, _req$query2, _options$useSecureCoo, _req$cookies, _options$cookies$call, _options$cookies, _options$cookies$call2;
    const { options , req  } = params;
    const warnings = [];
    if (!warned) {
        if (!req.origin) warnings.push("NEXTAUTH_URL");
        if (!options.secret && "production" !== "production") {}
        if (options.debug) warnings.push("DEBUG_ENABLED");
    }
    if (!options.secret && "production" === "production") {
        return new _errors.MissingSecret("Please define a `secret` in production.");
    }
    if (!((_req$query = req.query) !== null && _req$query !== void 0 && _req$query.nextauth) && !req.action) {
        return new _errors.MissingAPIRoute("Cannot find [...nextauth].{js,ts} in `/pages/api/auth`. Make sure the filename is written correctly.");
    }
    const callbackUrlParam = (_req$query2 = req.query) === null || _req$query2 === void 0 ? void 0 : _req$query2.callbackUrl;
    const url = (0, _parseUrl.default)(req.origin);
    if (callbackUrlParam && !isValidHttpUrl(callbackUrlParam, url.base)) {
        return new _errors.InvalidCallbackUrl(`Invalid callback URL. Received: ${callbackUrlParam}`);
    }
    const { callbackUrl: defaultCallbackUrl  } = (0, _cookie.defaultCookies)((_options$useSecureCoo = options.useSecureCookies) !== null && _options$useSecureCoo !== void 0 ? _options$useSecureCoo : url.base.startsWith("https://"));
    const callbackUrlCookie = (_req$cookies = req.cookies) === null || _req$cookies === void 0 ? void 0 : _req$cookies[(_options$cookies$call = (_options$cookies = options.cookies) === null || _options$cookies === void 0 ? void 0 : (_options$cookies$call2 = _options$cookies.callbackUrl) === null || _options$cookies$call2 === void 0 ? void 0 : _options$cookies$call2.name) !== null && _options$cookies$call !== void 0 ? _options$cookies$call : defaultCallbackUrl.name];
    if (callbackUrlCookie && !isValidHttpUrl(callbackUrlCookie, url.base)) {
        return new _errors.InvalidCallbackUrl(`Invalid callback URL. Received: ${callbackUrlCookie}`);
    }
    let hasCredentials, hasEmail;
    let hasTwitterOAuth2;
    for (const provider of options.providers){
        if (provider.type === "credentials") hasCredentials = true;
        else if (provider.type === "email") hasEmail = true;
        else if (provider.id === "twitter" && provider.version === "2.0") hasTwitterOAuth2 = true;
    }
    if (hasCredentials) {
        var _options$session;
        const dbStrategy = ((_options$session = options.session) === null || _options$session === void 0 ? void 0 : _options$session.strategy) === "database";
        const onlyCredentials = !options.providers.some((p)=>p.type !== "credentials");
        if (dbStrategy && onlyCredentials) {
            return new _errors.UnsupportedStrategy("Signin in with credentials only supported if JWT strategy is enabled");
        }
        const credentialsNoAuthorize = options.providers.some((p)=>p.type === "credentials" && !p.authorize);
        if (credentialsNoAuthorize) {
            return new _errors.MissingAuthorize("Must define an authorize() handler to use credentials authentication provider");
        }
    }
    if (hasEmail) {
        const { adapter  } = options;
        if (!adapter) {
            return new _errors.MissingAdapter("E-mail login requires an adapter.");
        }
        const missingMethods = [
            "createVerificationToken",
            "useVerificationToken",
            "getUserByEmail"
        ].filter((method)=>!adapter[method]);
        if (missingMethods.length) {
            return new _errors.MissingAdapterMethods(`Required adapter methods were missing: ${missingMethods.join(", ")}`);
        }
    }
    if (!warned) {
        if (hasTwitterOAuth2) warnings.push("TWITTER_OAUTH_2_BETA");
        warned = true;
    }
    return warnings;
}


/***/ }),

/***/ 6447:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = callbackHandler;
var _errors = __webpack_require__(2057);
var _utils = __webpack_require__(3093);
async function callbackHandler(params) {
    const { sessionToken , profile: _profile , account , options  } = params;
    if (!(account !== null && account !== void 0 && account.providerAccountId) || !account.type) throw new Error("Missing or invalid provider account");
    if (![
        "email",
        "oauth"
    ].includes(account.type)) throw new Error("Provider not supported");
    const { adapter , jwt , events , session: { strategy: sessionStrategy , generateSessionToken  }  } = options;
    if (!adapter) {
        return {
            user: _profile,
            account
        };
    }
    const profile = _profile;
    const { createUser , updateUser , getUser , getUserByAccount , getUserByEmail , linkAccount , createSession , getSessionAndUser , deleteSession  } = adapter;
    let session = null;
    let user = null;
    let isNewUser = false;
    const useJwtSession = sessionStrategy === "jwt";
    if (sessionToken) {
        if (useJwtSession) {
            try {
                session = await jwt.decode({
                    ...jwt,
                    token: sessionToken
                });
                if (session && "sub" in session && session.sub) {
                    user = await getUser(session.sub);
                }
            } catch (_unused) {}
        } else {
            const userAndSession = await getSessionAndUser(sessionToken);
            if (userAndSession) {
                session = userAndSession.session;
                user = userAndSession.user;
            }
        }
    }
    if (account.type === "email") {
        const userByEmail = await getUserByEmail(profile.email);
        if (userByEmail) {
            var _user, _events$updateUser;
            if (((_user = user) === null || _user === void 0 ? void 0 : _user.id) !== userByEmail.id && !useJwtSession && sessionToken) {
                await deleteSession(sessionToken);
            }
            user = await updateUser({
                id: userByEmail.id,
                emailVerified: new Date()
            });
            await ((_events$updateUser = events.updateUser) === null || _events$updateUser === void 0 ? void 0 : _events$updateUser.call(events, {
                user
            }));
        } else {
            var _events$createUser;
            const { id: _ , ...newUser } = {
                ...profile,
                emailVerified: new Date()
            };
            user = await createUser(newUser);
            await ((_events$createUser = events.createUser) === null || _events$createUser === void 0 ? void 0 : _events$createUser.call(events, {
                user
            }));
            isNewUser = true;
        }
        session = useJwtSession ? {} : await createSession({
            sessionToken: await generateSessionToken(),
            userId: user.id,
            expires: (0, _utils.fromDate)(options.session.maxAge)
        });
        return {
            session,
            user,
            isNewUser
        };
    } else if (account.type === "oauth") {
        const userByAccount = await getUserByAccount({
            providerAccountId: account.providerAccountId,
            provider: account.provider
        });
        if (userByAccount) {
            if (user) {
                if (userByAccount.id === user.id) {
                    return {
                        session,
                        user,
                        isNewUser
                    };
                }
                throw new _errors.AccountNotLinkedError("The account is already associated with another user");
            }
            session = useJwtSession ? {} : await createSession({
                sessionToken: await generateSessionToken(),
                userId: userByAccount.id,
                expires: (0, _utils.fromDate)(options.session.maxAge)
            });
            return {
                session,
                user: userByAccount,
                isNewUser
            };
        } else {
            var _events$createUser2, _events$linkAccount2;
            if (user) {
                var _events$linkAccount;
                await linkAccount({
                    ...account,
                    userId: user.id
                });
                await ((_events$linkAccount = events.linkAccount) === null || _events$linkAccount === void 0 ? void 0 : _events$linkAccount.call(events, {
                    user,
                    account,
                    profile
                }));
                return {
                    session,
                    user,
                    isNewUser
                };
            }
            const userByEmail = profile.email ? await getUserByEmail(profile.email) : null;
            if (userByEmail) {
                const provider = options.provider;
                if (provider !== null && provider !== void 0 && provider.allowDangerousEmailAccountLinking) {
                    user = userByEmail;
                } else {
                    throw new _errors.AccountNotLinkedError("Another account already exists with the same e-mail address");
                }
            } else {
                const { id: _ , ...newUser } = {
                    ...profile,
                    emailVerified: null
                };
                user = await createUser(newUser);
            }
            await ((_events$createUser2 = events.createUser) === null || _events$createUser2 === void 0 ? void 0 : _events$createUser2.call(events, {
                user
            }));
            await linkAccount({
                ...account,
                userId: user.id
            });
            await ((_events$linkAccount2 = events.linkAccount) === null || _events$linkAccount2 === void 0 ? void 0 : _events$linkAccount2.call(events, {
                user,
                account,
                profile
            }));
            session = useJwtSession ? {} : await createSession({
                sessionToken: await generateSessionToken(),
                userId: user.id,
                expires: (0, _utils.fromDate)(options.session.maxAge)
            });
            return {
                session,
                user,
                isNewUser: true
            };
        }
    }
    throw new Error("Unsupported account type");
}


/***/ }),

/***/ 3654:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.createCallbackUrl = createCallbackUrl;
async function createCallbackUrl({ options , paramValue , cookieValue  }) {
    const { url , callbacks  } = options;
    let callbackUrl = url.origin;
    if (paramValue) {
        callbackUrl = await callbacks.redirect({
            url: paramValue,
            baseUrl: url.origin
        });
    } else if (cookieValue) {
        callbackUrl = await callbacks.redirect({
            url: cookieValue,
            baseUrl: url.origin
        });
    }
    return {
        callbackUrl,
        callbackUrlCookie: callbackUrl !== cookieValue ? callbackUrl : undefined
    };
}


/***/ }),

/***/ 8246:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(6533);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.SessionStore = void 0;
exports.defaultCookies = defaultCookies;
var _classPrivateFieldGet3 = _interopRequireDefault(__webpack_require__(2587));
var _classPrivateFieldSet2 = _interopRequireDefault(__webpack_require__(9988));
function _classPrivateMethodInitSpec(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);
    privateSet.add(obj);
}
function _classPrivateFieldInitSpec(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
}
const ALLOWED_COOKIE_SIZE = 4096;
const ESTIMATED_EMPTY_COOKIE_SIZE = 163;
const CHUNK_SIZE = ALLOWED_COOKIE_SIZE - ESTIMATED_EMPTY_COOKIE_SIZE;
function defaultCookies(useSecureCookies) {
    const cookiePrefix = useSecureCookies ? "__Secure-" : "";
    return {
        sessionToken: {
            name: `${cookiePrefix}next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies
            }
        },
        callbackUrl: {
            name: `${cookiePrefix}next-auth.callback-url`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies
            }
        },
        csrfToken: {
            name: `${useSecureCookies ? "__Host-" : ""}next-auth.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies
            }
        },
        pkceCodeVerifier: {
            name: `${cookiePrefix}next-auth.pkce.code_verifier`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
                maxAge: 60 * 15
            }
        },
        state: {
            name: `${cookiePrefix}next-auth.state`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
                maxAge: 60 * 15
            }
        },
        nonce: {
            name: `${cookiePrefix}next-auth.nonce`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies
            }
        }
    };
}
var _chunks = new WeakMap();
var _option = new WeakMap();
var _logger = new WeakMap();
var _chunk = new WeakSet();
var _clean = new WeakSet();
class SessionStore {
    constructor(option, req, logger){
        _classPrivateMethodInitSpec(this, _clean);
        _classPrivateMethodInitSpec(this, _chunk);
        _classPrivateFieldInitSpec(this, _chunks, {
            writable: true,
            value: {}
        });
        _classPrivateFieldInitSpec(this, _option, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldInitSpec(this, _logger, {
            writable: true,
            value: void 0
        });
        (0, _classPrivateFieldSet2.default)(this, _logger, logger);
        (0, _classPrivateFieldSet2.default)(this, _option, option);
        const { cookies: _cookies  } = req;
        const { name: cookieName  } = option;
        if (typeof (_cookies === null || _cookies === void 0 ? void 0 : _cookies.getAll) === "function") {
            for (const { name , value  } of _cookies.getAll()){
                if (name.startsWith(cookieName)) {
                    (0, _classPrivateFieldGet3.default)(this, _chunks)[name] = value;
                }
            }
        } else if (_cookies instanceof Map) {
            for (const name of _cookies.keys()){
                if (name.startsWith(cookieName)) (0, _classPrivateFieldGet3.default)(this, _chunks)[name] = _cookies.get(name);
            }
        } else {
            for(const name in _cookies){
                if (name.startsWith(cookieName)) (0, _classPrivateFieldGet3.default)(this, _chunks)[name] = _cookies[name];
            }
        }
    }
    get value() {
        var _Object$values;
        return (_Object$values = Object.values((0, _classPrivateFieldGet3.default)(this, _chunks))) === null || _Object$values === void 0 ? void 0 : _Object$values.join("");
    }
    chunk(value, options) {
        const cookies = _classPrivateMethodGet(this, _clean, _clean2).call(this);
        const chunked = _classPrivateMethodGet(this, _chunk, _chunk2).call(this, {
            name: (0, _classPrivateFieldGet3.default)(this, _option).name,
            value,
            options: {
                ...(0, _classPrivateFieldGet3.default)(this, _option).options,
                ...options
            }
        });
        for (const chunk of chunked){
            cookies[chunk.name] = chunk;
        }
        return Object.values(cookies);
    }
    clean() {
        return Object.values(_classPrivateMethodGet(this, _clean, _clean2).call(this));
    }
}
exports.SessionStore = SessionStore;
function _chunk2(cookie) {
    const chunkCount = Math.ceil(cookie.value.length / CHUNK_SIZE);
    if (chunkCount === 1) {
        (0, _classPrivateFieldGet3.default)(this, _chunks)[cookie.name] = cookie.value;
        return [
            cookie
        ];
    }
    const cookies = [];
    for(let i = 0; i < chunkCount; i++){
        const name = `${cookie.name}.${i}`;
        const value = cookie.value.substr(i * CHUNK_SIZE, CHUNK_SIZE);
        cookies.push({
            ...cookie,
            name,
            value
        });
        (0, _classPrivateFieldGet3.default)(this, _chunks)[name] = value;
    }
    (0, _classPrivateFieldGet3.default)(this, _logger).debug("CHUNKING_SESSION_COOKIE", {
        message: `Session cookie exceeds allowed ${ALLOWED_COOKIE_SIZE} bytes.`,
        emptyCookieSize: ESTIMATED_EMPTY_COOKIE_SIZE,
        valueSize: cookie.value.length,
        chunks: cookies.map((c)=>c.value.length + ESTIMATED_EMPTY_COOKIE_SIZE)
    });
    return cookies;
}
function _clean2() {
    const cleanedChunks = {};
    for(const name in (0, _classPrivateFieldGet3.default)(this, _chunks)){
        var _classPrivateFieldGet2;
        (_classPrivateFieldGet2 = (0, _classPrivateFieldGet3.default)(this, _chunks)) === null || _classPrivateFieldGet2 === void 0 ? true : delete _classPrivateFieldGet2[name];
        cleanedChunks[name] = {
            name,
            value: "",
            options: {
                ...(0, _classPrivateFieldGet3.default)(this, _option).options,
                maxAge: 0
            }
        };
    }
    return cleanedChunks;
}


/***/ }),

/***/ 3737:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.createCSRFToken = createCSRFToken;
var _crypto = __webpack_require__(6113);
function createCSRFToken({ options , cookieValue , isPost , bodyValue  }) {
    if (cookieValue) {
        const [csrfToken, csrfTokenHash] = cookieValue.split("|");
        const expectedCsrfTokenHash = (0, _crypto.createHash)("sha256").update(`${csrfToken}${options.secret}`).digest("hex");
        if (csrfTokenHash === expectedCsrfTokenHash) {
            const csrfTokenVerified = isPost && csrfToken === bodyValue;
            return {
                csrfTokenVerified,
                csrfToken
            };
        }
    }
    const csrfToken = (0, _crypto.randomBytes)(32).toString("hex");
    const csrfTokenHash = (0, _crypto.createHash)("sha256").update(`${csrfToken}${options.secret}`).digest("hex");
    const cookie = `${csrfToken}|${csrfTokenHash}`;
    return {
        cookie,
        csrfToken
    };
}


/***/ }),

/***/ 6993:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.defaultCallbacks = void 0;
const defaultCallbacks = {
    signIn () {
        return true;
    },
    redirect ({ url , baseUrl  }) {
        if (url.startsWith("/")) return `${baseUrl}${url}`;
        else if (new URL(url).origin === baseUrl) return url;
        return baseUrl;
    },
    session ({ session  }) {
        return session;
    },
    jwt ({ token  }) {
        return token;
    }
};
exports.defaultCallbacks = defaultCallbacks;


/***/ }),

/***/ 3870:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = getAdapterUserFromEmail;
async function getAdapterUserFromEmail({ email , adapter  }) {
    const { getUserByEmail  } = adapter;
    const adapterUser = email ? await getUserByEmail(email) : null;
    if (adapterUser) return adapterUser;
    return {
        id: email,
        email,
        emailVerified: null
    };
}


/***/ }),

/***/ 8779:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = email;
var _crypto = __webpack_require__(6113);
var _utils = __webpack_require__(3093);
async function email(identifier, options) {
    var _await$provider$gener, _provider$generateVer, _provider$maxAge;
    const { url , adapter , provider , callbackUrl , theme  } = options;
    const token = (_await$provider$gener = await ((_provider$generateVer = provider.generateVerificationToken) === null || _provider$generateVer === void 0 ? void 0 : _provider$generateVer.call(provider))) !== null && _await$provider$gener !== void 0 ? _await$provider$gener : (0, _crypto.randomBytes)(32).toString("hex");
    const ONE_DAY_IN_SECONDS = 86400;
    const expires = new Date(Date.now() + ((_provider$maxAge = provider.maxAge) !== null && _provider$maxAge !== void 0 ? _provider$maxAge : ONE_DAY_IN_SECONDS) * 1000);
    const params = new URLSearchParams({
        callbackUrl,
        token,
        email: identifier
    });
    const _url = `${url}/callback/${provider.id}?${params}`;
    await Promise.all([
        provider.sendVerificationRequest({
            identifier,
            token,
            expires,
            url: _url,
            provider,
            theme
        }),
        adapter.createVerificationToken({
            identifier,
            token: (0, _utils.hashToken)(token, options),
            expires
        })
    ]);
    return `${url}/verify-request?${new URLSearchParams({
        provider: provider.id,
        type: provider.type
    })}`;
}


/***/ }),

/***/ 2009:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = getAuthorizationUrl;
var _client = __webpack_require__(1859);
var _clientLegacy = __webpack_require__(7486);
var checks = _interopRequireWildcard(__webpack_require__(6917));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
async function getAuthorizationUrl({ options , query  }) {
    var _provider$version;
    const { logger , provider  } = options;
    let params = {};
    if (typeof provider.authorization === "string") {
        const parsedUrl = new URL(provider.authorization);
        const parsedParams = Object.fromEntries(parsedUrl.searchParams);
        params = {
            ...params,
            ...parsedParams
        };
    } else {
        var _provider$authorizati;
        params = {
            ...params,
            ...(_provider$authorizati = provider.authorization) === null || _provider$authorizati === void 0 ? void 0 : _provider$authorizati.params
        };
    }
    params = {
        ...params,
        ...query
    };
    if ((_provider$version = provider.version) !== null && _provider$version !== void 0 && _provider$version.startsWith("1.")) {
        var _provider$authorizati2;
        const client = (0, _clientLegacy.oAuth1Client)(options);
        const tokens = await client.getOAuthRequestToken(params);
        const url = `${(_provider$authorizati2 = provider.authorization) === null || _provider$authorizati2 === void 0 ? void 0 : _provider$authorizati2.url}?${new URLSearchParams({
            oauth_token: tokens.oauth_token,
            oauth_token_secret: tokens.oauth_token_secret,
            ...tokens.params
        })}`;
        _clientLegacy.oAuth1TokenStore.set(tokens.oauth_token, tokens.oauth_token_secret);
        logger.debug("GET_AUTHORIZATION_URL", {
            url,
            provider
        });
        return {
            redirect: url
        };
    }
    const client = await (0, _client.openidClient)(options);
    const authorizationParams = params;
    const cookies = [];
    await checks.state.create(options, cookies, authorizationParams);
    await checks.pkce.create(options, cookies, authorizationParams);
    await checks.nonce.create(options, cookies, authorizationParams);
    const url = client.authorizationUrl(authorizationParams);
    logger.debug("GET_AUTHORIZATION_URL", {
        url,
        cookies,
        provider
    });
    return {
        redirect: url,
        cookies
    };
}


/***/ }),

/***/ 8584:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = oAuthCallback;
var _openidClient = __webpack_require__(6912);
var _client = __webpack_require__(1859);
var _clientLegacy = __webpack_require__(7486);
var _checks = _interopRequireWildcard(__webpack_require__(6917));
var _errors = __webpack_require__(2057);
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
async function oAuthCallback(params) {
    var _body$error, _provider$version;
    const { options , query , body , method , cookies  } = params;
    const { logger , provider  } = options;
    const errorMessage = (_body$error = body === null || body === void 0 ? void 0 : body.error) !== null && _body$error !== void 0 ? _body$error : query === null || query === void 0 ? void 0 : query.error;
    if (errorMessage) {
        const error = new Error(errorMessage);
        logger.error("OAUTH_CALLBACK_HANDLER_ERROR", {
            error,
            error_description: query === null || query === void 0 ? void 0 : query.error_description,
            providerId: provider.id
        });
        logger.debug("OAUTH_CALLBACK_HANDLER_ERROR", {
            body
        });
        throw error;
    }
    if ((_provider$version = provider.version) !== null && _provider$version !== void 0 && _provider$version.startsWith("1.")) {
        try {
            const client = await (0, _clientLegacy.oAuth1Client)(options);
            const { oauth_token , oauth_verifier  } = query !== null && query !== void 0 ? query : {};
            const tokens = await client.getOAuthAccessToken(oauth_token, _clientLegacy.oAuth1TokenStore.get(oauth_token), oauth_verifier);
            let profile = await client.get(provider.profileUrl, tokens.oauth_token, tokens.oauth_token_secret);
            if (typeof profile === "string") {
                profile = JSON.parse(profile);
            }
            const newProfile = await getProfile({
                profile,
                tokens,
                provider,
                logger
            });
            return {
                ...newProfile,
                cookies: []
            };
        } catch (error) {
            logger.error("OAUTH_V1_GET_ACCESS_TOKEN_ERROR", error);
            throw error;
        }
    }
    if (query !== null && query !== void 0 && query.oauth_token) _clientLegacy.oAuth1TokenStore.delete(query.oauth_token);
    try {
        var _provider$token, _provider$token2, _provider$userinfo;
        const client = await (0, _client.openidClient)(options);
        let tokens;
        const checks = {};
        const resCookies = [];
        await _checks.state.use(cookies, resCookies, options, checks);
        await _checks.pkce.use(cookies, resCookies, options, checks);
        await _checks.nonce.use(cookies, resCookies, options, checks);
        const params = {
            ...client.callbackParams({
                url: `http://n?${new URLSearchParams(query)}`,
                body,
                method
            }),
            ...(_provider$token = provider.token) === null || _provider$token === void 0 ? void 0 : _provider$token.params
        };
        if ((_provider$token2 = provider.token) !== null && _provider$token2 !== void 0 && _provider$token2.request) {
            const response = await provider.token.request({
                provider,
                params,
                checks,
                client
            });
            tokens = new _openidClient.TokenSet(response.tokens);
        } else if (provider.idToken) {
            tokens = await client.callback(provider.callbackUrl, params, checks);
        } else {
            tokens = await client.oauthCallback(provider.callbackUrl, params, checks);
        }
        if (Array.isArray(tokens.scope)) {
            tokens.scope = tokens.scope.join(" ");
        }
        let profile;
        if ((_provider$userinfo = provider.userinfo) !== null && _provider$userinfo !== void 0 && _provider$userinfo.request) {
            profile = await provider.userinfo.request({
                provider,
                tokens,
                client
            });
        } else if (provider.idToken) {
            profile = tokens.claims();
        } else {
            var _provider$userinfo2;
            profile = await client.userinfo(tokens, {
                params: (_provider$userinfo2 = provider.userinfo) === null || _provider$userinfo2 === void 0 ? void 0 : _provider$userinfo2.params
            });
        }
        const profileResult = await getProfile({
            profile,
            provider,
            tokens,
            logger
        });
        return {
            ...profileResult,
            cookies: resCookies
        };
    } catch (error) {
        throw new _errors.OAuthCallbackError(error);
    }
}
async function getProfile({ profile: OAuthProfile , tokens , provider , logger  }) {
    try {
        var _profile$email;
        logger.debug("PROFILE_DATA", {
            OAuthProfile
        });
        const profile = await provider.profile(OAuthProfile, tokens);
        profile.email = (_profile$email = profile.email) === null || _profile$email === void 0 ? void 0 : _profile$email.toLowerCase();
        if (!profile.id) throw new TypeError(`Profile id is missing in ${provider.name} OAuth profile response`);
        return {
            profile,
            account: {
                provider: provider.id,
                type: provider.type,
                providerAccountId: profile.id.toString(),
                ...tokens
            },
            OAuthProfile
        };
    } catch (error) {
        logger.error("OAUTH_PARSE_PROFILE_ERROR", {
            error: error,
            OAuthProfile
        });
    }
}


/***/ }),

/***/ 6917:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.pkce = exports.nonce = exports.PKCE_CODE_CHALLENGE_METHOD = void 0;
exports.signCookie = signCookie;
exports.state = void 0;
var _openidClient = __webpack_require__(6912);
var jwt = _interopRequireWildcard(__webpack_require__(7324));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
async function signCookie(type, value, maxAge, options) {
    const { cookies , logger  } = options;
    logger.debug(`CREATE_${type.toUpperCase()}`, {
        value,
        maxAge
    });
    const expires = new Date();
    expires.setTime(expires.getTime() + maxAge * 1000);
    return {
        name: cookies[type].name,
        value: await jwt.encode({
            ...options.jwt,
            maxAge,
            token: {
                value
            }
        }),
        options: {
            ...cookies[type].options,
            expires
        }
    };
}
const PKCE_MAX_AGE = 60 * 15;
const PKCE_CODE_CHALLENGE_METHOD = "S256";
exports.PKCE_CODE_CHALLENGE_METHOD = PKCE_CODE_CHALLENGE_METHOD;
const pkce = {
    async create (options, cookies, resParams) {
        var _options$provider, _options$provider$che, _options$cookies$pkce;
        if (!((_options$provider = options.provider) !== null && _options$provider !== void 0 && (_options$provider$che = _options$provider.checks) !== null && _options$provider$che !== void 0 && _options$provider$che.includes("pkce"))) return;
        const code_verifier = _openidClient.generators.codeVerifier();
        const value = _openidClient.generators.codeChallenge(code_verifier);
        resParams.code_challenge = value;
        resParams.code_challenge_method = PKCE_CODE_CHALLENGE_METHOD;
        const maxAge = (_options$cookies$pkce = options.cookies.pkceCodeVerifier.options.maxAge) !== null && _options$cookies$pkce !== void 0 ? _options$cookies$pkce : PKCE_MAX_AGE;
        cookies.push(await signCookie("pkceCodeVerifier", code_verifier, maxAge, options));
    },
    async use (cookies, resCookies, options, checks) {
        var _options$provider2, _options$provider2$ch;
        if (!((_options$provider2 = options.provider) !== null && _options$provider2 !== void 0 && (_options$provider2$ch = _options$provider2.checks) !== null && _options$provider2$ch !== void 0 && _options$provider2$ch.includes("pkce"))) return;
        const codeVerifier = cookies === null || cookies === void 0 ? void 0 : cookies[options.cookies.pkceCodeVerifier.name];
        if (!codeVerifier) throw new TypeError("PKCE code_verifier cookie was missing.");
        const value = await jwt.decode({
            ...options.jwt,
            token: codeVerifier
        });
        if (!(value !== null && value !== void 0 && value.value)) throw new TypeError("PKCE code_verifier value could not be parsed.");
        resCookies.push({
            name: options.cookies.pkceCodeVerifier.name,
            value: "",
            options: {
                ...options.cookies.pkceCodeVerifier.options,
                maxAge: 0
            }
        });
        checks.code_verifier = value.value;
    }
};
exports.pkce = pkce;
const STATE_MAX_AGE = 60 * 15;
const state = {
    async create (options, cookies, resParams) {
        var _options$provider$che2, _options$cookies$stat;
        if (!((_options$provider$che2 = options.provider.checks) !== null && _options$provider$che2 !== void 0 && _options$provider$che2.includes("state"))) return;
        const value = _openidClient.generators.state();
        resParams.state = value;
        const maxAge = (_options$cookies$stat = options.cookies.state.options.maxAge) !== null && _options$cookies$stat !== void 0 ? _options$cookies$stat : STATE_MAX_AGE;
        cookies.push(await signCookie("state", value, maxAge, options));
    },
    async use (cookies, resCookies, options, checks) {
        var _options$provider$che3;
        if (!((_options$provider$che3 = options.provider.checks) !== null && _options$provider$che3 !== void 0 && _options$provider$che3.includes("state"))) return;
        const state = cookies === null || cookies === void 0 ? void 0 : cookies[options.cookies.state.name];
        if (!state) throw new TypeError("State cookie was missing.");
        const value = await jwt.decode({
            ...options.jwt,
            token: state
        });
        if (!(value !== null && value !== void 0 && value.value)) throw new TypeError("State value could not be parsed.");
        resCookies.push({
            name: options.cookies.state.name,
            value: "",
            options: {
                ...options.cookies.state.options,
                maxAge: 0
            }
        });
        checks.state = value.value;
    }
};
exports.state = state;
const NONCE_MAX_AGE = 60 * 15;
const nonce = {
    async create (options, cookies, resParams) {
        var _options$provider$che4, _options$cookies$nonc;
        if (!((_options$provider$che4 = options.provider.checks) !== null && _options$provider$che4 !== void 0 && _options$provider$che4.includes("nonce"))) return;
        const value = _openidClient.generators.nonce();
        resParams.nonce = value;
        const maxAge = (_options$cookies$nonc = options.cookies.nonce.options.maxAge) !== null && _options$cookies$nonc !== void 0 ? _options$cookies$nonc : NONCE_MAX_AGE;
        cookies.push(await signCookie("nonce", value, maxAge, options));
    },
    async use (cookies, resCookies, options, checks) {
        var _options$provider3, _options$provider3$ch;
        if (!((_options$provider3 = options.provider) !== null && _options$provider3 !== void 0 && (_options$provider3$ch = _options$provider3.checks) !== null && _options$provider3$ch !== void 0 && _options$provider3$ch.includes("nonce"))) return;
        const nonce = cookies === null || cookies === void 0 ? void 0 : cookies[options.cookies.nonce.name];
        if (!nonce) throw new TypeError("Nonce cookie was missing.");
        const value = await jwt.decode({
            ...options.jwt,
            token: nonce
        });
        if (!(value !== null && value !== void 0 && value.value)) throw new TypeError("Nonce value could not be parsed.");
        resCookies.push({
            name: options.cookies.nonce.name,
            value: "",
            options: {
                ...options.cookies.nonce.options,
                maxAge: 0
            }
        });
        checks.nonce = value.value;
    }
};
exports.nonce = nonce;


/***/ }),

/***/ 7486:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.oAuth1Client = oAuth1Client;
exports.oAuth1TokenStore = void 0;
var _oauth = __webpack_require__(6339);
function oAuth1Client(options) {
    var _provider$version, _provider$encoding;
    const provider = options.provider;
    const oauth1Client = new _oauth.OAuth(provider.requestTokenUrl, provider.accessTokenUrl, provider.clientId, provider.clientSecret, (_provider$version = provider.version) !== null && _provider$version !== void 0 ? _provider$version : "1.0", provider.callbackUrl, (_provider$encoding = provider.encoding) !== null && _provider$encoding !== void 0 ? _provider$encoding : "HMAC-SHA1");
    const originalGet = oauth1Client.get.bind(oauth1Client);
    oauth1Client.get = async (...args)=>{
        return await new Promise((resolve, reject)=>{
            originalGet(...args, (error, result)=>{
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    };
    const originalGetOAuth1AccessToken = oauth1Client.getOAuthAccessToken.bind(oauth1Client);
    oauth1Client.getOAuthAccessToken = async (...args)=>{
        return await new Promise((resolve, reject)=>{
            originalGetOAuth1AccessToken(...args, (error, oauth_token, oauth_token_secret)=>{
                if (error) {
                    return reject(error);
                }
                resolve({
                    oauth_token,
                    oauth_token_secret
                });
            });
        });
    };
    const originalGetOAuthRequestToken = oauth1Client.getOAuthRequestToken.bind(oauth1Client);
    oauth1Client.getOAuthRequestToken = async (params = {})=>{
        return await new Promise((resolve, reject)=>{
            originalGetOAuthRequestToken(params, (error, oauth_token, oauth_token_secret, params)=>{
                if (error) {
                    return reject(error);
                }
                resolve({
                    oauth_token,
                    oauth_token_secret,
                    params
                });
            });
        });
    };
    return oauth1Client;
}
const oAuth1TokenStore = new Map();
exports.oAuth1TokenStore = oAuth1TokenStore;


/***/ }),

/***/ 1859:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.openidClient = openidClient;
var _openidClient = __webpack_require__(6912);
async function openidClient(options) {
    const provider = options.provider;
    if (provider.httpOptions) _openidClient.custom.setHttpOptionsDefaults(provider.httpOptions);
    let issuer;
    if (provider.wellKnown) {
        issuer = await _openidClient.Issuer.discover(provider.wellKnown);
    } else {
        var _provider$authorizati, _provider$token, _provider$userinfo;
        issuer = new _openidClient.Issuer({
            issuer: provider.issuer,
            authorization_endpoint: (_provider$authorizati = provider.authorization) === null || _provider$authorizati === void 0 ? void 0 : _provider$authorizati.url,
            token_endpoint: (_provider$token = provider.token) === null || _provider$token === void 0 ? void 0 : _provider$token.url,
            userinfo_endpoint: (_provider$userinfo = provider.userinfo) === null || _provider$userinfo === void 0 ? void 0 : _provider$userinfo.url,
            jwks_uri: provider.jwks_endpoint
        });
    }
    const client = new issuer.Client({
        client_id: provider.clientId,
        client_secret: provider.clientSecret,
        redirect_uris: [
            provider.callbackUrl
        ],
        ...provider.client
    }, provider.jwks);
    client[_openidClient.custom.clock_tolerance] = 10;
    return client;
}


/***/ }),

/***/ 6129:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = parseProviders;
var _merge = __webpack_require__(1401);
function parseProviders(params) {
    const { url , providerId  } = params;
    const providers = params.providers.map(({ options: userOptions , ...rest })=>{
        var _ref;
        if (rest.type === "oauth") {
            var _normalizedUserOption;
            const normalizedOptions = normalizeOAuthOptions(rest);
            const normalizedUserOptions = normalizeOAuthOptions(userOptions, true);
            const id = (_normalizedUserOption = normalizedUserOptions === null || normalizedUserOptions === void 0 ? void 0 : normalizedUserOptions.id) !== null && _normalizedUserOption !== void 0 ? _normalizedUserOption : rest.id;
            return (0, _merge.merge)(normalizedOptions, {
                ...normalizedUserOptions,
                signinUrl: `${url}/signin/${id}`,
                callbackUrl: `${url}/callback/${id}`
            });
        }
        const id = (_ref = userOptions === null || userOptions === void 0 ? void 0 : userOptions.id) !== null && _ref !== void 0 ? _ref : rest.id;
        return (0, _merge.merge)(rest, {
            ...userOptions,
            signinUrl: `${url}/signin/${id}`,
            callbackUrl: `${url}/callback/${id}`
        });
    });
    return {
        providers,
        provider: providers.find(({ id  })=>id === providerId)
    };
}
function normalizeOAuthOptions(oauthOptions, isUserOptions = false) {
    var _normalized$version;
    if (!oauthOptions) return;
    const normalized = Object.entries(oauthOptions).reduce((acc, [key, value])=>{
        if ([
            "authorization",
            "token",
            "userinfo"
        ].includes(key) && typeof value === "string") {
            var _url$searchParams;
            const url = new URL(value);
            acc[key] = {
                url: `${url.origin}${url.pathname}`,
                params: Object.fromEntries((_url$searchParams = url.searchParams) !== null && _url$searchParams !== void 0 ? _url$searchParams : [])
            };
        } else {
            acc[key] = value;
        }
        return acc;
    }, {});
    if (!isUserOptions && !((_normalized$version = normalized.version) !== null && _normalized$version !== void 0 && _normalized$version.startsWith("1."))) {
        var _ref2, _normalized$idToken, _normalized$wellKnown, _normalized$authoriza, _normalized$authoriza2, _normalized$authoriza3;
        normalized.idToken = Boolean((_ref2 = (_normalized$idToken = normalized.idToken) !== null && _normalized$idToken !== void 0 ? _normalized$idToken : (_normalized$wellKnown = normalized.wellKnown) === null || _normalized$wellKnown === void 0 ? void 0 : _normalized$wellKnown.includes("openid-configuration")) !== null && _ref2 !== void 0 ? _ref2 : (_normalized$authoriza = normalized.authorization) === null || _normalized$authoriza === void 0 ? void 0 : (_normalized$authoriza2 = _normalized$authoriza.params) === null || _normalized$authoriza2 === void 0 ? void 0 : (_normalized$authoriza3 = _normalized$authoriza2.scope) === null || _normalized$authoriza3 === void 0 ? void 0 : _normalized$authoriza3.includes("openid"));
        if (!normalized.checks) normalized.checks = [
            "state"
        ];
    }
    return normalized;
}


/***/ }),

/***/ 3093:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.createSecret = createSecret;
exports.fromDate = fromDate;
exports.hashToken = hashToken;
var _crypto = __webpack_require__(6113);
function fromDate(time, date = Date.now()) {
    return new Date(date + time * 1000);
}
function hashToken(token, options) {
    var _provider$secret;
    const { provider , secret  } = options;
    return (0, _crypto.createHash)("sha256").update(`${token}${(_provider$secret = provider.secret) !== null && _provider$secret !== void 0 ? _provider$secret : secret}`).digest("hex");
}
function createSecret(params) {
    var _authOptions$secret;
    const { authOptions , url  } = params;
    return (_authOptions$secret = authOptions.secret) !== null && _authOptions$secret !== void 0 ? _authOptions$secret : (0, _crypto.createHash)("sha256").update(JSON.stringify({
        ...url,
        ...authOptions
    })).digest("hex");
}


/***/ }),

/***/ 2256:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = ErrorPage;
var _preact = __webpack_require__(2127);
function ErrorPage(props) {
    var _errors$error$toLower;
    const { url , error ="default" , theme  } = props;
    const signinPageUrl = `${url}/signin`;
    const errors = {
        default: {
            status: 200,
            heading: "Error",
            message: (0, _preact.h)("p", null, (0, _preact.h)("a", {
                className: "site",
                href: url === null || url === void 0 ? void 0 : url.origin
            }, url === null || url === void 0 ? void 0 : url.host))
        },
        configuration: {
            status: 500,
            heading: "Server error",
            message: (0, _preact.h)("div", null, (0, _preact.h)("p", null, "There is a problem with the server configuration."), (0, _preact.h)("p", null, "Check the server logs for more information."))
        },
        accessdenied: {
            status: 403,
            heading: "Access Denied",
            message: (0, _preact.h)("div", null, (0, _preact.h)("p", null, "You do not have permission to sign in."), (0, _preact.h)("p", null, (0, _preact.h)("a", {
                className: "button",
                href: signinPageUrl
            }, "Sign in")))
        },
        verification: {
            status: 403,
            heading: "Unable to sign in",
            message: (0, _preact.h)("div", null, (0, _preact.h)("p", null, "The sign in link is no longer valid."), (0, _preact.h)("p", null, "It may have been used already or it may have expired.")),
            signin: (0, _preact.h)("p", null, (0, _preact.h)("a", {
                className: "button",
                href: signinPageUrl
            }, "Sign in"))
        }
    };
    const { status , heading , message , signin  } = (_errors$error$toLower = errors[error.toLowerCase()]) !== null && _errors$error$toLower !== void 0 ? _errors$error$toLower : errors.default;
    return {
        status,
        html: (0, _preact.h)("div", {
            className: "error"
        }, (theme === null || theme === void 0 ? void 0 : theme.brandColor) && (0, _preact.h)("style", {
            dangerouslySetInnerHTML: {
                __html: `
        :root {
          --brand-color: ${theme === null || theme === void 0 ? void 0 : theme.brandColor}
        }
      `
            }
        }), (0, _preact.h)("div", {
            className: "card"
        }, (theme === null || theme === void 0 ? void 0 : theme.logo) && (0, _preact.h)("img", {
            src: theme.logo,
            alt: "Logo",
            className: "logo"
        }), (0, _preact.h)("h1", null, heading), (0, _preact.h)("div", {
            className: "message"
        }, message), signin))
    };
}


/***/ }),

/***/ 1551:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(6533);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = renderPage;
var _preactRenderToString = _interopRequireDefault(__webpack_require__(936));
var _signin = _interopRequireDefault(__webpack_require__(867));
var _signout = _interopRequireDefault(__webpack_require__(1964));
var _verifyRequest = _interopRequireDefault(__webpack_require__(2192));
var _error = _interopRequireDefault(__webpack_require__(2256));
var _css = _interopRequireDefault(__webpack_require__(1253));
function renderPage(params) {
    const { url , theme , query , cookies  } = params;
    function send({ html , title , status  }) {
        var _theme$colorScheme;
        return {
            cookies,
            status,
            headers: [
                {
                    key: "Content-Type",
                    value: "text/html"
                }
            ],
            body: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${(0, _css.default)()}</style><title>${title}</title></head><body class="__next-auth-theme-${(_theme$colorScheme = theme === null || theme === void 0 ? void 0 : theme.colorScheme) !== null && _theme$colorScheme !== void 0 ? _theme$colorScheme : "auto"}"><div class="page">${(0, _preactRenderToString.default)(html)}</div></body></html>`
        };
    }
    return {
        signin (props) {
            return send({
                html: (0, _signin.default)({
                    csrfToken: params.csrfToken,
                    providers: params.providers,
                    callbackUrl: params.callbackUrl,
                    theme,
                    ...query,
                    ...props
                }),
                title: "Sign In"
            });
        },
        signout (props) {
            return send({
                html: (0, _signout.default)({
                    csrfToken: params.csrfToken,
                    url,
                    theme,
                    ...props
                }),
                title: "Sign Out"
            });
        },
        verifyRequest (props) {
            return send({
                html: (0, _verifyRequest.default)({
                    url,
                    theme,
                    ...props
                }),
                title: "Verify Request"
            });
        },
        error (props) {
            return send({
                ...(0, _error.default)({
                    url,
                    theme,
                    ...props
                }),
                title: "Error"
            });
        }
    };
}


/***/ }),

/***/ 867:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(6533);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = SigninPage;
var _preact = __webpack_require__(2127);
var _extends2 = _interopRequireDefault(__webpack_require__(9693));
function SigninPage(props) {
    var _errors$errorType;
    const { csrfToken , providers , callbackUrl , theme , email , error: errorType  } = props;
    const providersToRender = providers.filter((provider)=>{
        if (provider.type === "oauth" || provider.type === "email") {
            return true;
        } else if (provider.type === "credentials" && provider.credentials) {
            return true;
        }
        return false;
    });
    if (typeof document !== "undefined" && theme.buttonText) {
        document.documentElement.style.setProperty("--button-text-color", theme.buttonText);
    }
    if (typeof document !== "undefined" && theme.brandColor) {
        document.documentElement.style.setProperty("--brand-color", theme.brandColor);
    }
    const errors = {
        Signin: "Try signing in with a different account.",
        OAuthSignin: "Try signing in with a different account.",
        OAuthCallback: "Try signing in with a different account.",
        OAuthCreateAccount: "Try signing in with a different account.",
        EmailCreateAccount: "Try signing in with a different account.",
        Callback: "Try signing in with a different account.",
        OAuthAccountNotLinked: "To confirm your identity, sign in with the same account you used originally.",
        EmailSignin: "The e-mail could not be sent.",
        CredentialsSignin: "Sign in failed. Check the details you provided are correct.",
        SessionRequired: "Please sign in to access this page.",
        default: "Unable to sign in."
    };
    const error = errorType && ((_errors$errorType = errors[errorType]) !== null && _errors$errorType !== void 0 ? _errors$errorType : errors.default);
    const logos = "https://authjs.dev/img/providers";
    return (0, _preact.h)("div", {
        className: "signin"
    }, theme.brandColor && (0, _preact.h)("style", {
        dangerouslySetInnerHTML: {
            __html: `
        :root {
          --brand-color: ${theme.brandColor}
        }
      `
        }
    }), theme.buttonText && (0, _preact.h)("style", {
        dangerouslySetInnerHTML: {
            __html: `
        :root {
          --button-text-color: ${theme.buttonText}
        }
      `
        }
    }), (0, _preact.h)("div", {
        className: "card"
    }, theme.logo && (0, _preact.h)("img", {
        src: theme.logo,
        alt: "Logo",
        className: "logo"
    }), error && (0, _preact.h)("div", {
        className: "error"
    }, (0, _preact.h)("p", null, error)), providersToRender.map((provider, i)=>{
        var _provider$style$bg, _provider$style, _provider$style$bgDar, _provider$style2, _provider$style$text, _provider$style3, _provider$style$textD, _provider$style4, _provider$style5, _provider$style6;
        return (0, _preact.h)("div", {
            key: provider.id,
            className: "provider"
        }, provider.type === "oauth" && (0, _preact.h)("form", {
            action: provider.signinUrl,
            method: "POST"
        }, (0, _preact.h)("input", {
            type: "hidden",
            name: "csrfToken",
            value: csrfToken
        }), callbackUrl && (0, _preact.h)("input", {
            type: "hidden",
            name: "callbackUrl",
            value: callbackUrl
        }), (0, _preact.h)("button", {
            type: "submit",
            className: "button",
            style: {
                "--provider-bg": (_provider$style$bg = (_provider$style = provider.style) === null || _provider$style === void 0 ? void 0 : _provider$style.bg) !== null && _provider$style$bg !== void 0 ? _provider$style$bg : "",
                "--provider-dark-bg": (_provider$style$bgDar = (_provider$style2 = provider.style) === null || _provider$style2 === void 0 ? void 0 : _provider$style2.bgDark) !== null && _provider$style$bgDar !== void 0 ? _provider$style$bgDar : "",
                "--provider-color": (_provider$style$text = (_provider$style3 = provider.style) === null || _provider$style3 === void 0 ? void 0 : _provider$style3.text) !== null && _provider$style$text !== void 0 ? _provider$style$text : "",
                "--provider-dark-color": (_provider$style$textD = (_provider$style4 = provider.style) === null || _provider$style4 === void 0 ? void 0 : _provider$style4.textDark) !== null && _provider$style$textD !== void 0 ? _provider$style$textD : ""
            }
        }, ((_provider$style5 = provider.style) === null || _provider$style5 === void 0 ? void 0 : _provider$style5.logo) && (0, _preact.h)("img", {
            loading: "lazy",
            height: 24,
            width: 24,
            id: "provider-logo",
            src: `${provider.style.logo.startsWith("/") ? logos : ""}${provider.style.logo}`
        }), ((_provider$style6 = provider.style) === null || _provider$style6 === void 0 ? void 0 : _provider$style6.logoDark) && (0, _preact.h)("img", {
            loading: "lazy",
            height: 24,
            width: 24,
            id: "provider-logo-dark",
            src: `${provider.style.logo.startsWith("/") ? logos : ""}${provider.style.logoDark}`
        }), (0, _preact.h)("span", null, "Sign in with ", provider.name))), (provider.type === "email" || provider.type === "credentials") && i > 0 && providersToRender[i - 1].type !== "email" && providersToRender[i - 1].type !== "credentials" && (0, _preact.h)("hr", null), provider.type === "email" && (0, _preact.h)("form", {
            action: provider.signinUrl,
            method: "POST"
        }, (0, _preact.h)("input", {
            type: "hidden",
            name: "csrfToken",
            value: csrfToken
        }), (0, _preact.h)("label", {
            className: "section-header",
            htmlFor: `input-email-for-${provider.id}-provider`
        }, "Email"), (0, _preact.h)("input", {
            id: `input-email-for-${provider.id}-provider`,
            autoFocus: true,
            type: "email",
            name: "email",
            value: email,
            placeholder: "email@example.com",
            required: true
        }), (0, _preact.h)("button", {
            id: "submitButton",
            type: "submit"
        }, "Sign in with ", provider.name)), provider.type === "credentials" && (0, _preact.h)("form", {
            action: provider.callbackUrl,
            method: "POST"
        }, (0, _preact.h)("input", {
            type: "hidden",
            name: "csrfToken",
            value: csrfToken
        }), Object.keys(provider.credentials).map((credential)=>{
            var _provider$credentials, _provider$credentials2, _provider$credentials3;
            return (0, _preact.h)("div", {
                key: `input-group-${provider.id}`
            }, (0, _preact.h)("label", {
                className: "section-header",
                htmlFor: `input-${credential}-for-${provider.id}-provider`
            }, (_provider$credentials = provider.credentials[credential].label) !== null && _provider$credentials !== void 0 ? _provider$credentials : credential), (0, _preact.h)("input", (0, _extends2.default)({
                name: credential,
                id: `input-${credential}-for-${provider.id}-provider`,
                type: (_provider$credentials2 = provider.credentials[credential].type) !== null && _provider$credentials2 !== void 0 ? _provider$credentials2 : "text",
                placeholder: (_provider$credentials3 = provider.credentials[credential].placeholder) !== null && _provider$credentials3 !== void 0 ? _provider$credentials3 : ""
            }, provider.credentials[credential])));
        }), (0, _preact.h)("button", {
            type: "submit"
        }, "Sign in with ", provider.name)), (provider.type === "email" || provider.type === "credentials") && i + 1 < providersToRender.length && (0, _preact.h)("hr", null));
    })));
}


/***/ }),

/***/ 1964:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = SignoutPage;
var _preact = __webpack_require__(2127);
function SignoutPage(props) {
    const { url , csrfToken , theme  } = props;
    return (0, _preact.h)("div", {
        className: "signout"
    }, theme.brandColor && (0, _preact.h)("style", {
        dangerouslySetInnerHTML: {
            __html: `
        :root {
          --brand-color: ${theme.brandColor}
        }
      `
        }
    }), theme.buttonText && (0, _preact.h)("style", {
        dangerouslySetInnerHTML: {
            __html: `
        :root {
          --button-text-color: ${theme.buttonText}
        }
      `
        }
    }), (0, _preact.h)("div", {
        className: "card"
    }, theme.logo && (0, _preact.h)("img", {
        src: theme.logo,
        alt: "Logo",
        className: "logo"
    }), (0, _preact.h)("h1", null, "Signout"), (0, _preact.h)("p", null, "Are you sure you want to sign out?"), (0, _preact.h)("form", {
        action: `${url}/signout`,
        method: "POST"
    }, (0, _preact.h)("input", {
        type: "hidden",
        name: "csrfToken",
        value: csrfToken
    }), (0, _preact.h)("button", {
        id: "submitButton",
        type: "submit"
    }, "Sign out"))));
}


/***/ }),

/***/ 2192:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = VerifyRequestPage;
var _preact = __webpack_require__(2127);
function VerifyRequestPage(props) {
    const { url , theme  } = props;
    return (0, _preact.h)("div", {
        className: "verify-request"
    }, theme.brandColor && (0, _preact.h)("style", {
        dangerouslySetInnerHTML: {
            __html: `
        :root {
          --brand-color: ${theme.brandColor}
        }
      `
        }
    }), (0, _preact.h)("div", {
        className: "card"
    }, theme.logo && (0, _preact.h)("img", {
        src: theme.logo,
        alt: "Logo",
        className: "logo"
    }), (0, _preact.h)("h1", null, "Check your email"), (0, _preact.h)("p", null, "A sign in link has been sent to your email address."), (0, _preact.h)("p", null, (0, _preact.h)("a", {
        className: "site",
        href: url.origin
    }, url.host))));
}


/***/ }),

/***/ 4647:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(6533);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = callback;
var _callback = _interopRequireDefault(__webpack_require__(8584));
var _callbackHandler = _interopRequireDefault(__webpack_require__(6447));
var _utils = __webpack_require__(3093);
var _getUserFromEmail = _interopRequireDefault(__webpack_require__(3870));
async function callback(params) {
    const { options , query , body , method , headers , sessionStore  } = params;
    const { provider , adapter , url , callbackUrl , pages , jwt , events , callbacks , session: { strategy: sessionStrategy , maxAge: sessionMaxAge  } , logger  } = options;
    const cookies = [];
    const useJwtSession = sessionStrategy === "jwt";
    if (provider.type === "oauth") {
        try {
            const { profile , account , OAuthProfile , cookies: oauthCookies  } = await (0, _callback.default)({
                query,
                body,
                method,
                options,
                cookies: params.cookies
            });
            if (oauthCookies.length) cookies.push(...oauthCookies);
            try {
                var _events$signIn;
                logger.debug("OAUTH_CALLBACK_RESPONSE", {
                    profile,
                    account,
                    OAuthProfile
                });
                if (!profile || !account || !OAuthProfile) {
                    return {
                        redirect: `${url}/signin`,
                        cookies
                    };
                }
                let userOrProfile = profile;
                if (adapter) {
                    const { getUserByAccount  } = adapter;
                    const userByAccount = await getUserByAccount({
                        providerAccountId: account.providerAccountId,
                        provider: provider.id
                    });
                    if (userByAccount) userOrProfile = userByAccount;
                }
                try {
                    const isAllowed = await callbacks.signIn({
                        user: userOrProfile,
                        account,
                        profile: OAuthProfile
                    });
                    if (!isAllowed) {
                        return {
                            redirect: `${url}/error?error=AccessDenied`,
                            cookies
                        };
                    } else if (typeof isAllowed === "string") {
                        return {
                            redirect: isAllowed,
                            cookies
                        };
                    }
                } catch (error) {
                    return {
                        redirect: `${url}/error?error=${encodeURIComponent(error.message)}`,
                        cookies
                    };
                }
                const { user , session , isNewUser  } = await (0, _callbackHandler.default)({
                    sessionToken: sessionStore.value,
                    profile,
                    account,
                    options
                });
                if (useJwtSession) {
                    var _user$id;
                    const defaultToken = {
                        name: user.name,
                        email: user.email,
                        picture: user.image,
                        sub: (_user$id = user.id) === null || _user$id === void 0 ? void 0 : _user$id.toString()
                    };
                    const token = await callbacks.jwt({
                        token: defaultToken,
                        user,
                        account,
                        profile: OAuthProfile,
                        isNewUser,
                        trigger: isNewUser ? "signUp" : "signIn"
                    });
                    const newToken = await jwt.encode({
                        ...jwt,
                        token
                    });
                    const cookieExpires = new Date();
                    cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000);
                    const sessionCookies = sessionStore.chunk(newToken, {
                        expires: cookieExpires
                    });
                    cookies.push(...sessionCookies);
                } else {
                    cookies.push({
                        name: options.cookies.sessionToken.name,
                        value: session.sessionToken,
                        options: {
                            ...options.cookies.sessionToken.options,
                            expires: session.expires
                        }
                    });
                }
                await ((_events$signIn = events.signIn) === null || _events$signIn === void 0 ? void 0 : _events$signIn.call(events, {
                    user,
                    account,
                    profile,
                    isNewUser
                }));
                if (isNewUser && pages.newUser) {
                    return {
                        redirect: `${pages.newUser}${pages.newUser.includes("?") ? "&" : "?"}callbackUrl=${encodeURIComponent(callbackUrl)}`,
                        cookies
                    };
                }
                return {
                    redirect: callbackUrl,
                    cookies
                };
            } catch (error) {
                if (error.name === "AccountNotLinkedError") {
                    return {
                        redirect: `${url}/error?error=OAuthAccountNotLinked`,
                        cookies
                    };
                } else if (error.name === "CreateUserError") {
                    return {
                        redirect: `${url}/error?error=OAuthCreateAccount`,
                        cookies
                    };
                }
                logger.error("OAUTH_CALLBACK_HANDLER_ERROR", error);
                return {
                    redirect: `${url}/error?error=Callback`,
                    cookies
                };
            }
        } catch (error) {
            if (error.name === "OAuthCallbackError") {
                logger.error("OAUTH_CALLBACK_ERROR", {
                    error: error,
                    providerId: provider.id
                });
                return {
                    redirect: `${url}/error?error=OAuthCallback`,
                    cookies
                };
            }
            logger.error("OAUTH_CALLBACK_ERROR", error);
            return {
                redirect: `${url}/error?error=Callback`,
                cookies
            };
        }
    } else if (provider.type === "email") {
        try {
            var _events$signIn2;
            const token = query === null || query === void 0 ? void 0 : query.token;
            const identifier = query === null || query === void 0 ? void 0 : query.email;
            if (!token || !identifier) {
                return {
                    redirect: `${url}/error?error=configuration`,
                    cookies
                };
            }
            const invite = await adapter.useVerificationToken({
                identifier,
                token: (0, _utils.hashToken)(token, options)
            });
            const invalidInvite = !invite || invite.expires.valueOf() < Date.now();
            if (invalidInvite) {
                return {
                    redirect: `${url}/error?error=Verification`,
                    cookies
                };
            }
            const profile = await (0, _getUserFromEmail.default)({
                email: identifier,
                adapter
            });
            const account = {
                providerAccountId: profile.email,
                type: "email",
                provider: provider.id
            };
            try {
                const signInCallbackResponse = await callbacks.signIn({
                    user: profile,
                    account
                });
                if (!signInCallbackResponse) {
                    return {
                        redirect: `${url}/error?error=AccessDenied`,
                        cookies
                    };
                } else if (typeof signInCallbackResponse === "string") {
                    return {
                        redirect: signInCallbackResponse,
                        cookies
                    };
                }
            } catch (error) {
                return {
                    redirect: `${url}/error?error=${encodeURIComponent(error.message)}`,
                    cookies
                };
            }
            const { user , session , isNewUser  } = await (0, _callbackHandler.default)({
                sessionToken: sessionStore.value,
                profile,
                account,
                options
            });
            if (useJwtSession) {
                var _user$id2;
                const defaultToken = {
                    name: user.name,
                    email: user.email,
                    picture: user.image,
                    sub: (_user$id2 = user.id) === null || _user$id2 === void 0 ? void 0 : _user$id2.toString()
                };
                const token = await callbacks.jwt({
                    token: defaultToken,
                    user,
                    account,
                    isNewUser,
                    trigger: isNewUser ? "signUp" : "signIn"
                });
                const newToken = await jwt.encode({
                    ...jwt,
                    token
                });
                const cookieExpires = new Date();
                cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000);
                const sessionCookies = sessionStore.chunk(newToken, {
                    expires: cookieExpires
                });
                cookies.push(...sessionCookies);
            } else {
                cookies.push({
                    name: options.cookies.sessionToken.name,
                    value: session.sessionToken,
                    options: {
                        ...options.cookies.sessionToken.options,
                        expires: session.expires
                    }
                });
            }
            await ((_events$signIn2 = events.signIn) === null || _events$signIn2 === void 0 ? void 0 : _events$signIn2.call(events, {
                user,
                account,
                isNewUser
            }));
            if (isNewUser && pages.newUser) {
                return {
                    redirect: `${pages.newUser}${pages.newUser.includes("?") ? "&" : "?"}callbackUrl=${encodeURIComponent(callbackUrl)}`,
                    cookies
                };
            }
            return {
                redirect: callbackUrl,
                cookies
            };
        } catch (error) {
            if (error.name === "CreateUserError") {
                return {
                    redirect: `${url}/error?error=EmailCreateAccount`,
                    cookies
                };
            }
            logger.error("CALLBACK_EMAIL_ERROR", error);
            return {
                redirect: `${url}/error?error=Callback`,
                cookies
            };
        }
    } else if (provider.type === "credentials" && method === "POST") {
        var _user$id3, _events$signIn3;
        const credentials = body;
        let user;
        try {
            user = await provider.authorize(credentials, {
                query,
                body,
                headers,
                method
            });
            if (!user) {
                return {
                    status: 401,
                    redirect: `${url}/error?${new URLSearchParams({
                        error: "CredentialsSignin",
                        provider: provider.id
                    })}`,
                    cookies
                };
            }
        } catch (error) {
            return {
                status: 401,
                redirect: `${url}/error?error=${encodeURIComponent(error.message)}`,
                cookies
            };
        }
        const account = {
            providerAccountId: user.id,
            type: "credentials",
            provider: provider.id
        };
        try {
            const isAllowed = await callbacks.signIn({
                user,
                account,
                credentials
            });
            if (!isAllowed) {
                return {
                    status: 403,
                    redirect: `${url}/error?error=AccessDenied`,
                    cookies
                };
            } else if (typeof isAllowed === "string") {
                return {
                    redirect: isAllowed,
                    cookies
                };
            }
        } catch (error) {
            return {
                redirect: `${url}/error?error=${encodeURIComponent(error.message)}`,
                cookies
            };
        }
        const defaultToken = {
            name: user.name,
            email: user.email,
            picture: user.image,
            sub: (_user$id3 = user.id) === null || _user$id3 === void 0 ? void 0 : _user$id3.toString()
        };
        const token = await callbacks.jwt({
            token: defaultToken,
            user,
            account,
            isNewUser: false,
            trigger: "signIn"
        });
        const newToken = await jwt.encode({
            ...jwt,
            token
        });
        const cookieExpires = new Date();
        cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000);
        const sessionCookies = sessionStore.chunk(newToken, {
            expires: cookieExpires
        });
        cookies.push(...sessionCookies);
        await ((_events$signIn3 = events.signIn) === null || _events$signIn3 === void 0 ? void 0 : _events$signIn3.call(events, {
            user,
            account
        }));
        return {
            redirect: callbackUrl,
            cookies
        };
    }
    return {
        status: 500,
        body: `Error: Callback for provider type ${provider.type} not supported`,
        cookies
    };
}


/***/ }),

/***/ 4136:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(6533);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "callback", ({
    enumerable: true,
    get: function() {
        return _callback.default;
    }
}));
Object.defineProperty(exports, "providers", ({
    enumerable: true,
    get: function() {
        return _providers.default;
    }
}));
Object.defineProperty(exports, "session", ({
    enumerable: true,
    get: function() {
        return _session.default;
    }
}));
Object.defineProperty(exports, "signin", ({
    enumerable: true,
    get: function() {
        return _signin.default;
    }
}));
Object.defineProperty(exports, "signout", ({
    enumerable: true,
    get: function() {
        return _signout.default;
    }
}));
var _callback = _interopRequireDefault(__webpack_require__(4647));
var _signin = _interopRequireDefault(__webpack_require__(539));
var _signout = _interopRequireDefault(__webpack_require__(7447));
var _session = _interopRequireDefault(__webpack_require__(9300));
var _providers = _interopRequireDefault(__webpack_require__(1528));


/***/ }),

/***/ 1528:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = providers;
function providers(providers) {
    return {
        headers: [
            {
                key: "Content-Type",
                value: "application/json"
            }
        ],
        body: providers.reduce((acc, { id , name , type , signinUrl , callbackUrl  })=>{
            acc[id] = {
                id,
                name,
                type,
                signinUrl,
                callbackUrl
            };
            return acc;
        }, {})
    };
}


/***/ }),

/***/ 9300:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = session;
var _utils = __webpack_require__(3093);
async function session(params) {
    const { options , sessionStore , newSession , isUpdate  } = params;
    const { adapter , jwt , events , callbacks , logger , session: { strategy: sessionStrategy , maxAge: sessionMaxAge  }  } = options;
    const response = {
        body: {},
        headers: [
            {
                key: "Content-Type",
                value: "application/json"
            }
        ],
        cookies: []
    };
    const sessionToken = sessionStore.value;
    if (!sessionToken) return response;
    if (sessionStrategy === "jwt") {
        try {
            var _response$cookies, _events$session;
            const decodedToken = await jwt.decode({
                ...jwt,
                token: sessionToken
            });
            if (!decodedToken) throw new Error("JWT invalid");
            const token = await callbacks.jwt({
                token: decodedToken,
                ...isUpdate && {
                    trigger: "update"
                },
                session: newSession
            });
            const newExpires = (0, _utils.fromDate)(sessionMaxAge);
            const updatedSession = await callbacks.session({
                session: {
                    user: {
                        name: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.name,
                        email: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.email,
                        image: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.picture
                    },
                    expires: newExpires.toISOString()
                },
                token
            });
            response.body = updatedSession;
            const newToken = await jwt.encode({
                ...jwt,
                token,
                maxAge: options.session.maxAge
            });
            const sessionCookies = sessionStore.chunk(newToken, {
                expires: newExpires
            });
            (_response$cookies = response.cookies) === null || _response$cookies === void 0 ? void 0 : _response$cookies.push(...sessionCookies);
            await ((_events$session = events.session) === null || _events$session === void 0 ? void 0 : _events$session.call(events, {
                session: updatedSession,
                token
            }));
        } catch (error) {
            var _response$cookies2;
            logger.error("JWT_SESSION_ERROR", error);
            (_response$cookies2 = response.cookies) === null || _response$cookies2 === void 0 ? void 0 : _response$cookies2.push(...sessionStore.clean());
        }
    } else {
        try {
            const { getSessionAndUser , deleteSession , updateSession  } = adapter;
            let userAndSession = await getSessionAndUser(sessionToken);
            if (userAndSession && userAndSession.session.expires.valueOf() < Date.now()) {
                await deleteSession(sessionToken);
                userAndSession = null;
            }
            if (userAndSession) {
                var _response$cookies3, _events$session2;
                const { user , session  } = userAndSession;
                const sessionUpdateAge = options.session.updateAge;
                const sessionIsDueToBeUpdatedDate = session.expires.valueOf() - sessionMaxAge * 1000 + sessionUpdateAge * 1000;
                const newExpires = (0, _utils.fromDate)(sessionMaxAge);
                if (sessionIsDueToBeUpdatedDate <= Date.now()) {
                    await updateSession({
                        sessionToken,
                        expires: newExpires
                    });
                }
                const sessionPayload = await callbacks.session({
                    session: {
                        user: {
                            name: user.name,
                            email: user.email,
                            image: user.image
                        },
                        expires: session.expires.toISOString()
                    },
                    user,
                    newSession,
                    ...isUpdate ? {
                        trigger: "update"
                    } : {}
                });
                response.body = sessionPayload;
                (_response$cookies3 = response.cookies) === null || _response$cookies3 === void 0 ? void 0 : _response$cookies3.push({
                    name: options.cookies.sessionToken.name,
                    value: sessionToken,
                    options: {
                        ...options.cookies.sessionToken.options,
                        expires: newExpires
                    }
                });
                await ((_events$session2 = events.session) === null || _events$session2 === void 0 ? void 0 : _events$session2.call(events, {
                    session: sessionPayload
                }));
            } else if (sessionToken) {
                var _response$cookies4;
                (_response$cookies4 = response.cookies) === null || _response$cookies4 === void 0 ? void 0 : _response$cookies4.push(...sessionStore.clean());
            }
        } catch (error) {
            logger.error("SESSION_ERROR", error);
        }
    }
    return response;
}


/***/ }),

/***/ 539:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(6533);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = signin;
var _authorizationUrl = _interopRequireDefault(__webpack_require__(2009));
var _signin = _interopRequireDefault(__webpack_require__(8779));
var _getUserFromEmail = _interopRequireDefault(__webpack_require__(3870));
async function signin(params) {
    const { options , query , body  } = params;
    const { url , callbacks , logger , provider  } = options;
    if (!provider.type) {
        return {
            status: 500,
            text: `Error: Type not specified for ${provider.name}`
        };
    }
    if (provider.type === "oauth") {
        try {
            const response = await (0, _authorizationUrl.default)({
                options,
                query
            });
            return response;
        } catch (error) {
            logger.error("SIGNIN_OAUTH_ERROR", {
                error: error,
                providerId: provider.id
            });
            return {
                redirect: `${url}/error?error=OAuthSignin`
            };
        }
    } else if (provider.type === "email") {
        var _provider$normalizeId;
        let email = body === null || body === void 0 ? void 0 : body.email;
        if (!email) return {
            redirect: `${url}/error?error=EmailSignin`
        };
        const normalizer = (_provider$normalizeId = provider.normalizeIdentifier) !== null && _provider$normalizeId !== void 0 ? _provider$normalizeId : (identifier)=>{
            let [local, domain] = identifier.toLowerCase().trim().split("@");
            domain = domain.split(",")[0];
            return `${local}@${domain}`;
        };
        try {
            email = normalizer(body === null || body === void 0 ? void 0 : body.email);
        } catch (error) {
            logger.error("SIGNIN_EMAIL_ERROR", {
                error,
                providerId: provider.id
            });
            return {
                redirect: `${url}/error?error=EmailSignin`
            };
        }
        const user = await (0, _getUserFromEmail.default)({
            email,
            adapter: options.adapter
        });
        const account = {
            providerAccountId: email,
            userId: email,
            type: "email",
            provider: provider.id
        };
        try {
            const signInCallbackResponse = await callbacks.signIn({
                user,
                account,
                email: {
                    verificationRequest: true
                }
            });
            if (!signInCallbackResponse) {
                return {
                    redirect: `${url}/error?error=AccessDenied`
                };
            } else if (typeof signInCallbackResponse === "string") {
                return {
                    redirect: signInCallbackResponse
                };
            }
        } catch (error) {
            return {
                redirect: `${url}/error?${new URLSearchParams({
                    error: error
                })}`
            };
        }
        try {
            const redirect = await (0, _signin.default)(email, options);
            return {
                redirect
            };
        } catch (error) {
            logger.error("SIGNIN_EMAIL_ERROR", {
                error,
                providerId: provider.id
            });
            return {
                redirect: `${url}/error?error=EmailSignin`
            };
        }
    }
    return {
        redirect: `${url}/signin`
    };
}


/***/ }),

/***/ 7447:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = signout;
async function signout(params) {
    const { options , sessionStore  } = params;
    const { adapter , events , jwt , callbackUrl , logger , session  } = options;
    const sessionToken = sessionStore === null || sessionStore === void 0 ? void 0 : sessionStore.value;
    if (!sessionToken) {
        return {
            redirect: callbackUrl
        };
    }
    if (session.strategy === "jwt") {
        try {
            var _events$signOut;
            const decodedJwt = await jwt.decode({
                ...jwt,
                token: sessionToken
            });
            await ((_events$signOut = events.signOut) === null || _events$signOut === void 0 ? void 0 : _events$signOut.call(events, {
                token: decodedJwt
            }));
        } catch (error) {
            logger.error("SIGNOUT_ERROR", error);
        }
    } else {
        try {
            var _events$signOut2;
            const session = await adapter.deleteSession(sessionToken);
            await ((_events$signOut2 = events.signOut) === null || _events$signOut2 === void 0 ? void 0 : _events$signOut2.call(events, {
                session
            }));
        } catch (error) {
            logger.error("SIGNOUT_ERROR", error);
        }
    }
    const sessionCookies = sessionStore.clean();
    return {
        redirect: callbackUrl,
        cookies: sessionCookies
    };
}


/***/ }),

/***/ 1253:
/***/ ((module) => {

"use strict";

module.exports = function() {
    return ':root{--border-width:1px;--border-radius:0.5rem;--color-error:#c94b4b;--color-info:#157efb;--color-info-text:#fff}.__next-auth-theme-auto,.__next-auth-theme-light{--color-background:#ececec;--color-background-card:#fff;--color-text:#000;--color-primary:#444;--color-control-border:#bbb;--color-button-active-background:#f9f9f9;--color-button-active-border:#aaa;--color-seperator:#ccc}.__next-auth-theme-dark{--color-background:#161b22;--color-background-card:#0d1117;--color-text:#fff;--color-primary:#ccc;--color-control-border:#555;--color-button-active-background:#060606;--color-button-active-border:#666;--color-seperator:#444}@media (prefers-color-scheme:dark){.__next-auth-theme-auto{--color-background:#161b22;--color-background-card:#0d1117;--color-text:#fff;--color-primary:#ccc;--color-control-border:#555;--color-button-active-background:#060606;--color-button-active-border:#666;--color-seperator:#444}}body{background-color:var(--color-background);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;margin:0;padding:0}h1{font-weight:400;margin-bottom:1.5rem;padding:0 1rem}h1,p{color:var(--color-text)}form{margin:0;padding:0}label{font-weight:500;margin-bottom:.25rem;text-align:left}input[type],label{color:var(--color-text);display:block}input[type]{background:var(--color-background-card);border:var(--border-width) solid var(--color-control-border);border-radius:var(--border-radius);box-sizing:border-box;font-size:1rem;padding:.5rem 1rem;width:100%}input[type]:focus{box-shadow:none}p{font-size:1.1rem;line-height:2rem;margin:0 0 1.5rem;padding:0 1rem}a.button{line-height:1rem;text-decoration:none}a.button:link,a.button:visited{background-color:var(--color-background);color:var(--color-primary)}button span{flex-grow:1}a.button,button{align-items:center;background-color:var(--provider-bg,var(--color-background-card));border-color:rgba(0,0,0,.1);border-radius:var(--border-radius);color:var(--provider-color,var(--color-primary));display:flex;font-size:1.1rem;font-weight:500;justify-content:center;margin:0 0 .75rem;min-height:62px;padding:.75rem 1rem;position:relative;transition:all .1s ease-in-out}@media (max-width:450px){a.button,button{font-size:.9rem}}a.button:active,a.button:hover,button:active,button:hover{cursor:pointer}a.button #provider-logo,button #provider-logo{display:block;width:25px}a.button #provider-logo-dark,button #provider-logo-dark{display:none}#submitButton{background-color:var(--brand-color,var(--color-info));color:var(--button-text-color,var(--color-info-text));width:100%}@media (prefers-color-scheme:dark){a.button,button{background-color:var(--provider-dark-bg,var(--color-background));color:var(--provider-dark-color,var(--color-primary))}#provider-logo{display:none!important}#provider-logo-dark{display:block!important;width:25px}}a.site{color:var(--color-primary);font-size:1rem;line-height:2rem;text-decoration:none}a.site:hover{text-decoration:underline}.page{display:grid;height:100%;margin:0;padding:0;place-items:center;position:absolute;width:100%}.page>div{text-align:center}.error a.button{display:inline-block;margin-top:.5rem;padding-left:2rem;padding-right:2rem}.error .message{margin-bottom:1.5rem}.signin input[type=text]{display:block;margin-left:auto;margin-right:auto}.signin hr{border:0;border-top:1px solid var(--color-seperator);display:block;margin:2rem auto 1rem;overflow:visible}.signin hr:before{background:var(--color-background-card);color:#888;content:"or";padding:0 .4rem;position:relative;top:-.7rem}.signin .error{background:#f5f5f5;background:var(--color-error);border-radius:.3rem;font-weight:500}.signin .error p{color:var(--color-info-text);font-size:.9rem;line-height:1.2rem;padding:.5rem 1rem;text-align:left}.signin form,.signin>div{display:block}.signin form input[type],.signin>div input[type]{margin-bottom:.5rem}.signin form button,.signin>div button{width:100%}.signin form,.signin>div{max-width:300px}.logo{display:inline-block;margin-bottom:25px;margin-top:20px;max-height:70px;max-width:150px}@media screen and (min-width:450px){.card{width:350px}}@media screen and (max-width:450px){.card{width:200px}}.card{background-color:var(--color-background-card);border-radius:30px;margin:20px 0;padding:20px 50px}.card .header{color:var(--color-primary)}.section-header{color:var(--color-text)}';
};


/***/ }),

/***/ 7324:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(6533);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _exportNames = {
    encode: true,
    decode: true,
    getToken: true
};
exports.decode = decode;
exports.encode = encode;
exports.getToken = getToken;
var _jose = __webpack_require__(5922);
var _hkdf = _interopRequireDefault(__webpack_require__(87));
var _uuid = __webpack_require__(2532);
var _cookie = __webpack_require__(8246);
var _types = __webpack_require__(6835);
Object.keys(_types).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _types[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _types[key];
        }
    });
});
const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60;
const now = ()=>Date.now() / 1000 | 0;
async function encode(params) {
    const { token ={} , secret , maxAge =DEFAULT_MAX_AGE  } = params;
    const encryptionSecret = await getDerivedEncryptionKey(secret);
    return await new _jose.EncryptJWT(token).setProtectedHeader({
        alg: "dir",
        enc: "A256GCM"
    }).setIssuedAt().setExpirationTime(now() + maxAge).setJti((0, _uuid.v4)()).encrypt(encryptionSecret);
}
async function decode(params) {
    const { token , secret  } = params;
    if (!token) return null;
    const encryptionSecret = await getDerivedEncryptionKey(secret);
    const { payload  } = await (0, _jose.jwtDecrypt)(token, encryptionSecret, {
        clockTolerance: 15
    });
    return payload;
}
async function getToken(params) {
    var _process$env$NEXTAUTH, _process$env$NEXTAUTH2, _req$headers;
    const { req , secureCookie =(_process$env$NEXTAUTH = (_process$env$NEXTAUTH2 = process.env.NEXTAUTH_URL) === null || _process$env$NEXTAUTH2 === void 0 ? void 0 : _process$env$NEXTAUTH2.startsWith("https://")) !== null && _process$env$NEXTAUTH !== void 0 ? _process$env$NEXTAUTH : !!process.env.VERCEL , cookieName =secureCookie ? "__Secure-next-auth.session-token" : "next-auth.session-token" , raw , decode: _decode = decode , logger =console , secret =process.env.NEXTAUTH_SECRET  } = params;
    if (!req) throw new Error("Must pass `req` to JWT getToken()");
    const sessionStore = new _cookie.SessionStore({
        name: cookieName,
        options: {
            secure: secureCookie
        }
    }, {
        cookies: req.cookies,
        headers: req.headers
    }, logger);
    let token = sessionStore.value;
    const authorizationHeader = req.headers instanceof Headers ? req.headers.get("authorization") : (_req$headers = req.headers) === null || _req$headers === void 0 ? void 0 : _req$headers.authorization;
    if (!token && (authorizationHeader === null || authorizationHeader === void 0 ? void 0 : authorizationHeader.split(" ")[0]) === "Bearer") {
        const urlEncodedToken = authorizationHeader.split(" ")[1];
        token = decodeURIComponent(urlEncodedToken);
    }
    if (!token) return null;
    if (raw) return token;
    try {
        return await _decode({
            token,
            secret
        });
    } catch (_unused) {
        return null;
    }
}
async function getDerivedEncryptionKey(secret) {
    return await (0, _hkdf.default)("sha256", secret, "", "NextAuth.js Generated Encryption Key", 32);
}


/***/ }),

/***/ 6835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));


/***/ }),

/***/ 1765:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.ZP = void 0;
__webpack_unused_export__ = getServerSession;
__webpack_unused_export__ = unstable_getServerSession;
var _core = __webpack_require__(830);
var _utils = __webpack_require__(7667);
async function NextAuthApiHandler(req, res, options) {
    var _options$secret, _options$jwt$secret, _options$jwt, _ref, _handler$status, _handler$cookies, _handler$headers;
    const { nextauth , ...query } = req.query;
    (_options$secret = options.secret) !== null && _options$secret !== void 0 ? _options$secret : options.secret = (_options$jwt$secret = (_options$jwt = options.jwt) === null || _options$jwt === void 0 ? void 0 : _options$jwt.secret) !== null && _options$jwt$secret !== void 0 ? _options$jwt$secret : process.env.NEXTAUTH_SECRET;
    const handler = await (0, _core.AuthHandler)({
        req: {
            body: req.body,
            query,
            cookies: req.cookies,
            headers: req.headers,
            method: req.method,
            action: nextauth === null || nextauth === void 0 ? void 0 : nextauth[0],
            providerId: nextauth === null || nextauth === void 0 ? void 0 : nextauth[1],
            error: (_ref = req.query.error) !== null && _ref !== void 0 ? _ref : nextauth === null || nextauth === void 0 ? void 0 : nextauth[1]
        },
        options
    });
    res.status((_handler$status = handler.status) !== null && _handler$status !== void 0 ? _handler$status : 200);
    (_handler$cookies = handler.cookies) === null || _handler$cookies === void 0 ? void 0 : _handler$cookies.forEach((cookie)=>(0, _utils.setCookie)(res, cookie));
    (_handler$headers = handler.headers) === null || _handler$headers === void 0 ? void 0 : _handler$headers.forEach((h)=>res.setHeader(h.key, h.value));
    if (handler.redirect) {
        var _req$body;
        if (((_req$body = req.body) === null || _req$body === void 0 ? void 0 : _req$body.json) !== "true") {
            res.status(302).setHeader("Location", handler.redirect);
            return res.end();
        }
        return res.json({
            url: handler.redirect
        });
    }
    return res.send(handler.body);
}
async function NextAuthRouteHandler(req, context, options) {
    var _options$secret2, _context$params, _query$error;
    (_options$secret2 = options.secret) !== null && _options$secret2 !== void 0 ? _options$secret2 : options.secret = process.env.NEXTAUTH_SECRET;
    const { headers , cookies  } = __webpack_require__(167);
    const nextauth = (_context$params = context.params) === null || _context$params === void 0 ? void 0 : _context$params.nextauth;
    const query = Object.fromEntries(req.nextUrl.searchParams);
    const body = await (0, _utils.getBody)(req);
    const internalResponse = await (0, _core.AuthHandler)({
        req: {
            body,
            query,
            cookies: Object.fromEntries(cookies().getAll().map((c)=>[
                    c.name,
                    c.value
                ])),
            headers: Object.fromEntries(headers()),
            method: req.method,
            action: nextauth === null || nextauth === void 0 ? void 0 : nextauth[0],
            providerId: nextauth === null || nextauth === void 0 ? void 0 : nextauth[1],
            error: (_query$error = query.error) !== null && _query$error !== void 0 ? _query$error : nextauth === null || nextauth === void 0 ? void 0 : nextauth[1]
        },
        options
    });
    const response = (0, _utils.toResponse)(internalResponse);
    const redirect = response.headers.get("Location");
    if ((body === null || body === void 0 ? void 0 : body.json) === "true" && redirect) {
        response.headers.delete("Location");
        response.headers.set("Content-Type", "application/json");
        return new Response(JSON.stringify({
            url: redirect
        }), {
            headers: response.headers
        });
    }
    return response;
}
function NextAuth(...args) {
    var _args$;
    if (args.length === 1) {
        return async (req, res)=>{
            if (res !== null && res !== void 0 && res.params) {
                return await NextAuthRouteHandler(req, res, args[0]);
            }
            return await NextAuthApiHandler(req, res, args[0]);
        };
    }
    if ((_args$ = args[1]) !== null && _args$ !== void 0 && _args$.params) {
        return NextAuthRouteHandler(...args);
    }
    return NextAuthApiHandler(...args);
}
var _default = NextAuth;
exports.ZP = _default;
let experimentalRSCWarningShown = false;
async function getServerSession(...args) {
    var _options, _options$secret3;
    const isRSC = args.length === 0 || args.length === 1;
    if (!experimentalRSCWarningShown && isRSC && "production" !== "production") {}
    let req, res, options;
    if (isRSC) {
        options = Object.assign({}, args[0], {
            providers: []
        });
        const { headers , cookies  } = __webpack_require__(167);
        req = {
            headers: Object.fromEntries(headers()),
            cookies: Object.fromEntries(cookies().getAll().map((c)=>[
                    c.name,
                    c.value
                ]))
        };
        res = {
            getHeader () {},
            setCookie () {},
            setHeader () {}
        };
    } else {
        req = args[0];
        res = args[1];
        options = Object.assign({}, args[2], {
            providers: []
        });
    }
    (_options$secret3 = (_options = options).secret) !== null && _options$secret3 !== void 0 ? _options$secret3 : _options.secret = process.env.NEXTAUTH_SECRET;
    const session = await (0, _core.AuthHandler)({
        options,
        req: {
            action: "session",
            method: "GET",
            cookies: req.cookies,
            headers: req.headers
        }
    });
    const { body , cookies , status =200  } = session;
    cookies === null || cookies === void 0 ? void 0 : cookies.forEach((cookie)=>(0, _utils.setCookie)(res, cookie));
    if (body && typeof body !== "string" && Object.keys(body).length) {
        if (status === 200) {
            if (isRSC) delete body.expires;
            return body;
        }
        throw new Error(body.message);
    }
    return null;
}
let deprecatedWarningShown = false;
async function unstable_getServerSession(...args) {
    if (!deprecatedWarningShown && "production" !== "production") {}
    return await getServerSession(...args);
}


/***/ }),

/***/ 7667:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.getBody = getBody;
exports.setCookie = setCookie;
exports.toResponse = toResponse;
var _cookie = __webpack_require__(3963);
function setCookie(res, cookie) {
    var _res$getHeader;
    let setCookieHeader = (_res$getHeader = res.getHeader("Set-Cookie")) !== null && _res$getHeader !== void 0 ? _res$getHeader : [];
    if (!Array.isArray(setCookieHeader)) {
        setCookieHeader = [
            setCookieHeader
        ];
    }
    const { name , value , options  } = cookie;
    const cookieHeader = (0, _cookie.serialize)(name, value, options);
    setCookieHeader.push(cookieHeader);
    res.setHeader("Set-Cookie", setCookieHeader);
}
async function getBody(req) {
    if (!("body" in req) || !req.body || req.method !== "POST") return;
    const contentType = req.headers.get("content-type");
    if (contentType !== null && contentType !== void 0 && contentType.includes("application/json")) {
        return await req.json();
    } else if (contentType !== null && contentType !== void 0 && contentType.includes("application/x-www-form-urlencoded")) {
        const params = new URLSearchParams(await req.text());
        return Object.fromEntries(params);
    }
}
function toResponse(res) {
    var _res$headers, _res$cookies, _res$status;
    const headers = new Headers((_res$headers = res.headers) === null || _res$headers === void 0 ? void 0 : _res$headers.reduce((acc, { key , value  })=>{
        acc[key] = value;
        return acc;
    }, {}));
    (_res$cookies = res.cookies) === null || _res$cookies === void 0 ? void 0 : _res$cookies.forEach((cookie)=>{
        const { name , value , options  } = cookie;
        const cookieHeader = (0, _cookie.serialize)(name, value, options);
        if (headers.has("Set-Cookie")) headers.append("Set-Cookie", cookieHeader);
        else headers.set("Set-Cookie", cookieHeader);
    });
    let body = res.body;
    if (headers.get("content-type") === "application/json") body = JSON.stringify(res.body);
    else if (headers.get("content-type") === "application/x-www-form-urlencoded") body = new URLSearchParams(res.body).toString();
    const status = res.redirect ? 302 : (_res$status = res.status) !== null && _res$status !== void 0 ? _res$status : 200;
    const response = new Response(body, {
        headers,
        status
    });
    if (res.redirect) response.headers.set("Location", res.redirect);
    return response;
}


/***/ }),

/***/ 5670:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.Z = Google;
function Google(options) {
    return {
        id: "google",
        name: "Google",
        type: "oauth",
        wellKnown: "https://accounts.google.com/.well-known/openid-configuration",
        authorization: {
            params: {
                scope: "openid email profile"
            }
        },
        idToken: true,
        checks: [
            "pkce",
            "state"
        ],
        profile (profile) {
            return {
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                image: profile.picture
            };
        },
        style: {
            logo: "/google.svg",
            logoDark: "/google.svg",
            bgDark: "#fff",
            bg: "#fff",
            text: "#000",
            textDark: "#000"
        },
        options
    };
}


/***/ }),

/***/ 7039:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.detectOrigin = detectOrigin;
function detectOrigin(forwardedHost, protocol) {
    var _process$env$VERCEL;
    if ((_process$env$VERCEL = process.env.VERCEL) !== null && _process$env$VERCEL !== void 0 ? _process$env$VERCEL : process.env.AUTH_TRUST_HOST) return `${protocol === "http" ? "http" : "https"}://${forwardedHost}`;
    return process.env.NEXTAUTH_URL;
}


/***/ }),

/***/ 9233:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(6533);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = void 0;
exports.proxyLogger = proxyLogger;
exports.setLogger = setLogger;
var _defineProperty2 = _interopRequireDefault(__webpack_require__(4601));
var _errors = __webpack_require__(2057);
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            (0, _defineProperty2.default)(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function formatError(o) {
    if (o instanceof Error && !(o instanceof _errors.UnknownError)) {
        return {
            message: o.message,
            stack: o.stack,
            name: o.name
        };
    }
    if (hasErrorProperty(o)) {
        var _o$message;
        o.error = formatError(o.error);
        o.message = (_o$message = o.message) !== null && _o$message !== void 0 ? _o$message : o.error.message;
    }
    return o;
}
function hasErrorProperty(x) {
    return !!(x !== null && x !== void 0 && x.error);
}
var _logger = {
    error: function error(code, metadata) {
        metadata = formatError(metadata);
        console.error("[next-auth][error][".concat(code, "]"), "\nhttps://next-auth.js.org/errors#".concat(code.toLowerCase()), metadata.message, metadata);
    },
    warn: function warn(code) {
        console.warn("[next-auth][warn][".concat(code, "]"), "\nhttps://next-auth.js.org/warnings#".concat(code.toLowerCase()));
    },
    debug: function debug(code, metadata) {
        console.log("[next-auth][debug][".concat(code, "]"), metadata);
    }
};
function setLogger() {
    var newLogger = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var debug = arguments.length > 1 ? arguments[1] : undefined;
    if (!debug) _logger.debug = function() {};
    if (newLogger.error) _logger.error = newLogger.error;
    if (newLogger.warn) _logger.warn = newLogger.warn;
    if (newLogger.debug) _logger.debug = newLogger.debug;
}
var _default = _logger;
exports["default"] = _default;
function proxyLogger() {
    var logger = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _logger;
    var basePath = arguments.length > 1 ? arguments[1] : undefined;
    try {
        if (true) {
            return logger;
        }
        var clientLogger = {};
        var _loop = function _loop(level) {
            clientLogger[level] = function(code, metadata) {
                _logger[level](code, metadata);
                if (level === "error") {
                    metadata = formatError(metadata);
                }
                ;
                metadata.client = true;
                var url = "".concat(basePath, "/_log");
                var body = new URLSearchParams(_objectSpread({
                    level: level,
                    code: code
                }, metadata));
                if (navigator.sendBeacon) {
                    return navigator.sendBeacon(url, body);
                }
                return fetch(url, {
                    method: "POST",
                    body: body,
                    keepalive: true
                });
            };
        };
        for(var level in logger){
            _loop(level);
        }
        return clientLogger;
    } catch (_unused) {
        return _logger;
    }
}


/***/ }),

/***/ 1401:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.merge = merge;
function isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
}
function merge(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for(const key in source){
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, {
                    [key]: {}
                });
                merge(target[key], source[key]);
            } else {
                Object.assign(target, {
                    [key]: source[key]
                });
            }
        }
    }
    return merge(target, ...sources);
}


/***/ }),

/***/ 4793:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = parseUrl;
function parseUrl(url) {
    var _url2;
    const defaultUrl = new URL("http://localhost:3000/api/auth");
    if (url && !url.startsWith("http")) {
        url = `https://${url}`;
    }
    const _url = new URL((_url2 = url) !== null && _url2 !== void 0 ? _url2 : defaultUrl);
    const path = (_url.pathname === "/" ? defaultUrl.pathname : _url.pathname).replace(/\/$/, "");
    const base = `${_url.origin}${path}`;
    return {
        origin: _url.origin,
        host: _url.host,
        path,
        base,
        toString: ()=>base
    };
}


/***/ }),

/***/ 167:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = __webpack_require__(4288);


/***/ }),

/***/ 6339:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

exports.OAuth = __webpack_require__(6404).OAuth;
exports.OAuthEcho = __webpack_require__(6404).OAuthEcho;
exports.OAuth2 = __webpack_require__(9426).OAuth2;


/***/ }),

/***/ 7912:
/***/ ((module) => {

"use strict";
// Returns true if this is a host that closes *before* it ends?!?!

module.exports.isAnEarlyCloseHost = function(hostName) {
    return hostName && hostName.match(".*google(apis)?.com$");
};


/***/ }),

/***/ 6404:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var crypto = __webpack_require__(6113), sha1 = __webpack_require__(3313), http = __webpack_require__(3685), https = __webpack_require__(5687), URL = __webpack_require__(7310), querystring = __webpack_require__(3477), OAuthUtils = __webpack_require__(7912);
exports.OAuth = function(requestUrl, accessUrl, consumerKey, consumerSecret, version, authorize_callback, signatureMethod, nonceSize, customHeaders) {
    this._isEcho = false;
    this._requestUrl = requestUrl;
    this._accessUrl = accessUrl;
    this._consumerKey = consumerKey;
    this._consumerSecret = this._encodeData(consumerSecret);
    if (signatureMethod == "RSA-SHA1") {
        this._privateKey = consumerSecret;
    }
    this._version = version;
    if (authorize_callback === undefined) {
        this._authorize_callback = "oob";
    } else {
        this._authorize_callback = authorize_callback;
    }
    if (signatureMethod != "PLAINTEXT" && signatureMethod != "HMAC-SHA1" && signatureMethod != "RSA-SHA1") throw new Error("Un-supported signature method: " + signatureMethod);
    this._signatureMethod = signatureMethod;
    this._nonceSize = nonceSize || 32;
    this._headers = customHeaders || {
        "Accept": "*/*",
        "Connection": "close",
        "User-Agent": "Node authentication"
    };
    this._clientOptions = this._defaultClientOptions = {
        "requestTokenHttpMethod": "POST",
        "accessTokenHttpMethod": "POST",
        "followRedirects": true
    };
    this._oauthParameterSeperator = ",";
};
exports.OAuthEcho = function(realm, verify_credentials, consumerKey, consumerSecret, version, signatureMethod, nonceSize, customHeaders) {
    this._isEcho = true;
    this._realm = realm;
    this._verifyCredentials = verify_credentials;
    this._consumerKey = consumerKey;
    this._consumerSecret = this._encodeData(consumerSecret);
    if (signatureMethod == "RSA-SHA1") {
        this._privateKey = consumerSecret;
    }
    this._version = version;
    if (signatureMethod != "PLAINTEXT" && signatureMethod != "HMAC-SHA1" && signatureMethod != "RSA-SHA1") throw new Error("Un-supported signature method: " + signatureMethod);
    this._signatureMethod = signatureMethod;
    this._nonceSize = nonceSize || 32;
    this._headers = customHeaders || {
        "Accept": "*/*",
        "Connection": "close",
        "User-Agent": "Node authentication"
    };
    this._oauthParameterSeperator = ",";
};
exports.OAuthEcho.prototype = exports.OAuth.prototype;
exports.OAuth.prototype._getTimestamp = function() {
    return Math.floor(new Date().getTime() / 1000);
};
exports.OAuth.prototype._encodeData = function(toEncode) {
    if (toEncode == null || toEncode == "") return "";
    else {
        var result = encodeURIComponent(toEncode);
        // Fix the mismatch between OAuth's  RFC3986's and Javascript's beliefs in what is right and wrong ;)
        return result.replace(/\!/g, "%21").replace(/\'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A");
    }
};
exports.OAuth.prototype._decodeData = function(toDecode) {
    if (toDecode != null) {
        toDecode = toDecode.replace(/\+/g, " ");
    }
    return decodeURIComponent(toDecode);
};
exports.OAuth.prototype._getSignature = function(method, url, parameters, tokenSecret) {
    var signatureBase = this._createSignatureBase(method, url, parameters);
    return this._createSignature(signatureBase, tokenSecret);
};
exports.OAuth.prototype._normalizeUrl = function(url) {
    var parsedUrl = URL.parse(url, true);
    var port = "";
    if (parsedUrl.port) {
        if (parsedUrl.protocol == "http:" && parsedUrl.port != "80" || parsedUrl.protocol == "https:" && parsedUrl.port != "443") {
            port = ":" + parsedUrl.port;
        }
    }
    if (!parsedUrl.pathname || parsedUrl.pathname == "") parsedUrl.pathname = "/";
    return parsedUrl.protocol + "//" + parsedUrl.hostname + port + parsedUrl.pathname;
};
// Is the parameter considered an OAuth parameter
exports.OAuth.prototype._isParameterNameAnOAuthParameter = function(parameter) {
    var m = parameter.match("^oauth_");
    if (m && m[0] === "oauth_") {
        return true;
    } else {
        return false;
    }
};
// build the OAuth request authorization header
exports.OAuth.prototype._buildAuthorizationHeaders = function(orderedParameters) {
    var authHeader = "OAuth ";
    if (this._isEcho) {
        authHeader += 'realm="' + this._realm + '",';
    }
    for(var i = 0; i < orderedParameters.length; i++){
        // Whilst the all the parameters should be included within the signature, only the oauth_ arguments
        // should appear within the authorization header.
        if (this._isParameterNameAnOAuthParameter(orderedParameters[i][0])) {
            authHeader += "" + this._encodeData(orderedParameters[i][0]) + '="' + this._encodeData(orderedParameters[i][1]) + '"' + this._oauthParameterSeperator;
        }
    }
    authHeader = authHeader.substring(0, authHeader.length - this._oauthParameterSeperator.length);
    return authHeader;
};
// Takes an object literal that represents the arguments, and returns an array
// of argument/value pairs.
exports.OAuth.prototype._makeArrayOfArgumentsHash = function(argumentsHash) {
    var argument_pairs = [];
    for(var key in argumentsHash){
        if (argumentsHash.hasOwnProperty(key)) {
            var value = argumentsHash[key];
            if (Array.isArray(value)) {
                for(var i = 0; i < value.length; i++){
                    argument_pairs[argument_pairs.length] = [
                        key,
                        value[i]
                    ];
                }
            } else {
                argument_pairs[argument_pairs.length] = [
                    key,
                    value
                ];
            }
        }
    }
    return argument_pairs;
};
// Sorts the encoded key value pairs by encoded name, then encoded value
exports.OAuth.prototype._sortRequestParams = function(argument_pairs) {
    // Sort by name, then value.
    argument_pairs.sort(function(a, b) {
        if (a[0] == b[0]) {
            return a[1] < b[1] ? -1 : 1;
        } else return a[0] < b[0] ? -1 : 1;
    });
    return argument_pairs;
};
exports.OAuth.prototype._normaliseRequestParams = function(args) {
    var argument_pairs = this._makeArrayOfArgumentsHash(args);
    // First encode them #3.4.1.3.2 .1
    for(var i = 0; i < argument_pairs.length; i++){
        argument_pairs[i][0] = this._encodeData(argument_pairs[i][0]);
        argument_pairs[i][1] = this._encodeData(argument_pairs[i][1]);
    }
    // Then sort them #3.4.1.3.2 .2
    argument_pairs = this._sortRequestParams(argument_pairs);
    // Then concatenate together #3.4.1.3.2 .3 & .4
    var args = "";
    for(var i = 0; i < argument_pairs.length; i++){
        args += argument_pairs[i][0];
        args += "=";
        args += argument_pairs[i][1];
        if (i < argument_pairs.length - 1) args += "&";
    }
    return args;
};
exports.OAuth.prototype._createSignatureBase = function(method, url, parameters) {
    url = this._encodeData(this._normalizeUrl(url));
    parameters = this._encodeData(parameters);
    return method.toUpperCase() + "&" + url + "&" + parameters;
};
exports.OAuth.prototype._createSignature = function(signatureBase, tokenSecret) {
    if (tokenSecret === undefined) var tokenSecret = "";
    else tokenSecret = this._encodeData(tokenSecret);
    // consumerSecret is already encoded
    var key = this._consumerSecret + "&" + tokenSecret;
    var hash = "";
    if (this._signatureMethod == "PLAINTEXT") {
        hash = key;
    } else if (this._signatureMethod == "RSA-SHA1") {
        key = this._privateKey || "";
        hash = crypto.createSign("RSA-SHA1").update(signatureBase).sign(key, "base64");
    } else {
        if (crypto.Hmac) {
            hash = crypto.createHmac("sha1", key).update(signatureBase).digest("base64");
        } else {
            hash = sha1.HMACSHA1(key, signatureBase);
        }
    }
    return hash;
};
exports.OAuth.prototype.NONCE_CHARS = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9"
];
exports.OAuth.prototype._getNonce = function(nonceSize) {
    var result = [];
    var chars = this.NONCE_CHARS;
    var char_pos;
    var nonce_chars_length = chars.length;
    for(var i = 0; i < nonceSize; i++){
        char_pos = Math.floor(Math.random() * nonce_chars_length);
        result[i] = chars[char_pos];
    }
    return result.join("");
};
exports.OAuth.prototype._createClient = function(port, hostname, method, path, headers, sslEnabled) {
    var options = {
        host: hostname,
        port: port,
        path: path,
        method: method,
        headers: headers
    };
    var httpModel;
    if (sslEnabled) {
        httpModel = https;
    } else {
        httpModel = http;
    }
    return httpModel.request(options);
};
exports.OAuth.prototype._prepareParameters = function(oauth_token, oauth_token_secret, method, url, extra_params) {
    var oauthParameters = {
        "oauth_timestamp": this._getTimestamp(),
        "oauth_nonce": this._getNonce(this._nonceSize),
        "oauth_version": this._version,
        "oauth_signature_method": this._signatureMethod,
        "oauth_consumer_key": this._consumerKey
    };
    if (oauth_token) {
        oauthParameters["oauth_token"] = oauth_token;
    }
    var sig;
    if (this._isEcho) {
        sig = this._getSignature("GET", this._verifyCredentials, this._normaliseRequestParams(oauthParameters), oauth_token_secret);
    } else {
        if (extra_params) {
            for(var key in extra_params){
                if (extra_params.hasOwnProperty(key)) oauthParameters[key] = extra_params[key];
            }
        }
        var parsedUrl = URL.parse(url, false);
        if (parsedUrl.query) {
            var key2;
            var extraParameters = querystring.parse(parsedUrl.query);
            for(var key in extraParameters){
                var value = extraParameters[key];
                if (typeof value == "object") {
                    // TODO: This probably should be recursive
                    for(key2 in value){
                        oauthParameters[key + "[" + key2 + "]"] = value[key2];
                    }
                } else {
                    oauthParameters[key] = value;
                }
            }
        }
        sig = this._getSignature(method, url, this._normaliseRequestParams(oauthParameters), oauth_token_secret);
    }
    var orderedParameters = this._sortRequestParams(this._makeArrayOfArgumentsHash(oauthParameters));
    orderedParameters[orderedParameters.length] = [
        "oauth_signature",
        sig
    ];
    return orderedParameters;
};
exports.OAuth.prototype._performSecureRequest = function(oauth_token, oauth_token_secret, method, url, extra_params, post_body, post_content_type, callback) {
    var orderedParameters = this._prepareParameters(oauth_token, oauth_token_secret, method, url, extra_params);
    if (!post_content_type) {
        post_content_type = "application/x-www-form-urlencoded";
    }
    var parsedUrl = URL.parse(url, false);
    if (parsedUrl.protocol == "http:" && !parsedUrl.port) parsedUrl.port = 80;
    if (parsedUrl.protocol == "https:" && !parsedUrl.port) parsedUrl.port = 443;
    var headers = {};
    var authorization = this._buildAuthorizationHeaders(orderedParameters);
    if (this._isEcho) {
        headers["X-Verify-Credentials-Authorization"] = authorization;
    } else {
        headers["Authorization"] = authorization;
    }
    headers["Host"] = parsedUrl.host;
    for(var key in this._headers){
        if (this._headers.hasOwnProperty(key)) {
            headers[key] = this._headers[key];
        }
    }
    // Filter out any passed extra_params that are really to do with OAuth
    for(var key in extra_params){
        if (this._isParameterNameAnOAuthParameter(key)) {
            delete extra_params[key];
        }
    }
    if ((method == "POST" || method == "PUT") && post_body == null && extra_params != null) {
        // Fix the mismatch between the output of querystring.stringify() and this._encodeData()
        post_body = querystring.stringify(extra_params).replace(/\!/g, "%21").replace(/\'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A");
    }
    if (post_body) {
        if (Buffer.isBuffer(post_body)) {
            headers["Content-length"] = post_body.length;
        } else {
            headers["Content-length"] = Buffer.byteLength(post_body);
        }
    } else {
        headers["Content-length"] = 0;
    }
    headers["Content-Type"] = post_content_type;
    var path;
    if (!parsedUrl.pathname || parsedUrl.pathname == "") parsedUrl.pathname = "/";
    if (parsedUrl.query) path = parsedUrl.pathname + "?" + parsedUrl.query;
    else path = parsedUrl.pathname;
    var request;
    if (parsedUrl.protocol == "https:") {
        request = this._createClient(parsedUrl.port, parsedUrl.hostname, method, path, headers, true);
    } else {
        request = this._createClient(parsedUrl.port, parsedUrl.hostname, method, path, headers);
    }
    var clientOptions = this._clientOptions;
    if (callback) {
        var data = "";
        var self = this;
        // Some hosts *cough* google appear to close the connection early / send no content-length header
        // allow this behaviour.
        var allowEarlyClose = OAuthUtils.isAnEarlyCloseHost(parsedUrl.hostname);
        var callbackCalled = false;
        var passBackControl = function(response) {
            if (!callbackCalled) {
                callbackCalled = true;
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    callback(null, data, response);
                } else {
                    // Follow 301 or 302 redirects with Location HTTP header
                    if ((response.statusCode == 301 || response.statusCode == 302) && clientOptions.followRedirects && response.headers && response.headers.location) {
                        self._performSecureRequest(oauth_token, oauth_token_secret, method, response.headers.location, extra_params, post_body, post_content_type, callback);
                    } else {
                        callback({
                            statusCode: response.statusCode,
                            data: data
                        }, data, response);
                    }
                }
            }
        };
        request.on("response", function(response) {
            response.setEncoding("utf8");
            response.on("data", function(chunk) {
                data += chunk;
            });
            response.on("end", function() {
                passBackControl(response);
            });
            response.on("close", function() {
                if (allowEarlyClose) {
                    passBackControl(response);
                }
            });
        });
        request.on("error", function(err) {
            if (!callbackCalled) {
                callbackCalled = true;
                callback(err);
            }
        });
        if ((method == "POST" || method == "PUT") && post_body != null && post_body != "") {
            request.write(post_body);
        }
        request.end();
    } else {
        if ((method == "POST" || method == "PUT") && post_body != null && post_body != "") {
            request.write(post_body);
        }
        return request;
    }
    return;
};
exports.OAuth.prototype.setClientOptions = function(options) {
    var key, mergedOptions = {}, hasOwnProperty = Object.prototype.hasOwnProperty;
    for(key in this._defaultClientOptions){
        if (!hasOwnProperty.call(options, key)) {
            mergedOptions[key] = this._defaultClientOptions[key];
        } else {
            mergedOptions[key] = options[key];
        }
    }
    this._clientOptions = mergedOptions;
};
exports.OAuth.prototype.getOAuthAccessToken = function(oauth_token, oauth_token_secret, oauth_verifier, callback) {
    var extraParams = {};
    if (typeof oauth_verifier == "function") {
        callback = oauth_verifier;
    } else {
        extraParams.oauth_verifier = oauth_verifier;
    }
    this._performSecureRequest(oauth_token, oauth_token_secret, this._clientOptions.accessTokenHttpMethod, this._accessUrl, extraParams, null, null, function(error, data, response) {
        if (error) callback(error);
        else {
            var results = querystring.parse(data);
            var oauth_access_token = results["oauth_token"];
            delete results["oauth_token"];
            var oauth_access_token_secret = results["oauth_token_secret"];
            delete results["oauth_token_secret"];
            callback(null, oauth_access_token, oauth_access_token_secret, results);
        }
    });
};
// Deprecated
exports.OAuth.prototype.getProtectedResource = function(url, method, oauth_token, oauth_token_secret, callback) {
    this._performSecureRequest(oauth_token, oauth_token_secret, method, url, null, "", null, callback);
};
exports.OAuth.prototype["delete"] = function(url, oauth_token, oauth_token_secret, callback) {
    return this._performSecureRequest(oauth_token, oauth_token_secret, "DELETE", url, null, "", null, callback);
};
exports.OAuth.prototype.get = function(url, oauth_token, oauth_token_secret, callback) {
    return this._performSecureRequest(oauth_token, oauth_token_secret, "GET", url, null, "", null, callback);
};
exports.OAuth.prototype._putOrPost = function(method, url, oauth_token, oauth_token_secret, post_body, post_content_type, callback) {
    var extra_params = null;
    if (typeof post_content_type == "function") {
        callback = post_content_type;
        post_content_type = null;
    }
    if (typeof post_body != "string" && !Buffer.isBuffer(post_body)) {
        post_content_type = "application/x-www-form-urlencoded";
        extra_params = post_body;
        post_body = null;
    }
    return this._performSecureRequest(oauth_token, oauth_token_secret, method, url, extra_params, post_body, post_content_type, callback);
};
exports.OAuth.prototype.put = function(url, oauth_token, oauth_token_secret, post_body, post_content_type, callback) {
    return this._putOrPost("PUT", url, oauth_token, oauth_token_secret, post_body, post_content_type, callback);
};
exports.OAuth.prototype.post = function(url, oauth_token, oauth_token_secret, post_body, post_content_type, callback) {
    return this._putOrPost("POST", url, oauth_token, oauth_token_secret, post_body, post_content_type, callback);
};
/**
 * Gets a request token from the OAuth provider and passes that information back
 * to the calling code.
 *
 * The callback should expect a function of the following form:
 *
 * function(err, token, token_secret, parsedQueryString) {}
 *
 * This method has optional parameters so can be called in the following 2 ways:
 *
 * 1) Primary use case: Does a basic request with no extra parameters
 *  getOAuthRequestToken( callbackFunction )
 *
 * 2) As above but allows for provision of extra parameters to be sent as part of the query to the server.
 *  getOAuthRequestToken( extraParams, callbackFunction )
 *
 * N.B. This method will HTTP POST verbs by default, if you wish to override this behaviour you will
 * need to provide a requestTokenHttpMethod option when creating the client.
 *
 **/ exports.OAuth.prototype.getOAuthRequestToken = function(extraParams, callback) {
    if (typeof extraParams == "function") {
        callback = extraParams;
        extraParams = {};
    }
    // Callbacks are 1.0A related
    if (this._authorize_callback) {
        extraParams["oauth_callback"] = this._authorize_callback;
    }
    this._performSecureRequest(null, null, this._clientOptions.requestTokenHttpMethod, this._requestUrl, extraParams, null, null, function(error, data, response) {
        if (error) callback(error);
        else {
            var results = querystring.parse(data);
            var oauth_token = results["oauth_token"];
            var oauth_token_secret = results["oauth_token_secret"];
            delete results["oauth_token"];
            delete results["oauth_token_secret"];
            callback(null, oauth_token, oauth_token_secret, results);
        }
    });
};
exports.OAuth.prototype.signUrl = function(url, oauth_token, oauth_token_secret, method) {
    if (method === undefined) {
        var method = "GET";
    }
    var orderedParameters = this._prepareParameters(oauth_token, oauth_token_secret, method, url, {});
    var parsedUrl = URL.parse(url, false);
    var query = "";
    for(var i = 0; i < orderedParameters.length; i++){
        query += orderedParameters[i][0] + "=" + this._encodeData(orderedParameters[i][1]) + "&";
    }
    query = query.substring(0, query.length - 1);
    return parsedUrl.protocol + "//" + parsedUrl.host + parsedUrl.pathname + "?" + query;
};
exports.OAuth.prototype.authHeader = function(url, oauth_token, oauth_token_secret, method) {
    if (method === undefined) {
        var method = "GET";
    }
    var orderedParameters = this._prepareParameters(oauth_token, oauth_token_secret, method, url, {});
    return this._buildAuthorizationHeaders(orderedParameters);
};


/***/ }),

/***/ 9426:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var querystring = __webpack_require__(3477), crypto = __webpack_require__(6113), https = __webpack_require__(5687), http = __webpack_require__(3685), URL = __webpack_require__(7310), OAuthUtils = __webpack_require__(7912);
exports.OAuth2 = function(clientId, clientSecret, baseSite, authorizePath, accessTokenPath, customHeaders) {
    this._clientId = clientId;
    this._clientSecret = clientSecret;
    this._baseSite = baseSite;
    this._authorizeUrl = authorizePath || "/oauth/authorize";
    this._accessTokenUrl = accessTokenPath || "/oauth/access_token";
    this._accessTokenName = "access_token";
    this._authMethod = "Bearer";
    this._customHeaders = customHeaders || {};
    this._useAuthorizationHeaderForGET = false;
    //our agent
    this._agent = undefined;
};
// Allows you to set an agent to use instead of the default HTTP or
// HTTPS agents. Useful when dealing with your own certificates.
exports.OAuth2.prototype.setAgent = function(agent) {
    this._agent = agent;
};
// This 'hack' method is required for sites that don't use
// 'access_token' as the name of the access token (for requests).
// ( http://tools.ietf.org/html/draft-ietf-oauth-v2-16#section-7 )
// it isn't clear what the correct value should be atm, so allowing
// for specific (temporary?) override for now.
exports.OAuth2.prototype.setAccessTokenName = function(name) {
    this._accessTokenName = name;
};
// Sets the authorization method for Authorization header.
// e.g. Authorization: Bearer <token>  # "Bearer" is the authorization method.
exports.OAuth2.prototype.setAuthMethod = function(authMethod) {
    this._authMethod = authMethod;
};
// If you use the OAuth2 exposed 'get' method (and don't construct your own _request call )
// this will specify whether to use an 'Authorize' header instead of passing the access_token as a query parameter
exports.OAuth2.prototype.useAuthorizationHeaderforGET = function(useIt) {
    this._useAuthorizationHeaderForGET = useIt;
};
exports.OAuth2.prototype._getAccessTokenUrl = function() {
    return this._baseSite + this._accessTokenUrl; /* + "?" + querystring.stringify(params); */ 
};
// Build the authorization header. In particular, build the part after the colon.
// e.g. Authorization: Bearer <token>  # Build "Bearer <token>"
exports.OAuth2.prototype.buildAuthHeader = function(token) {
    return this._authMethod + " " + token;
};
exports.OAuth2.prototype._chooseHttpLibrary = function(parsedUrl) {
    var http_library = https;
    // As this is OAUth2, we *assume* https unless told explicitly otherwise.
    if (parsedUrl.protocol != "https:") {
        http_library = http;
    }
    return http_library;
};
exports.OAuth2.prototype._request = function(method, url, headers, post_body, access_token, callback) {
    var parsedUrl = URL.parse(url, true);
    if (parsedUrl.protocol == "https:" && !parsedUrl.port) {
        parsedUrl.port = 443;
    }
    var http_library = this._chooseHttpLibrary(parsedUrl);
    var realHeaders = {};
    for(var key in this._customHeaders){
        realHeaders[key] = this._customHeaders[key];
    }
    if (headers) {
        for(var key in headers){
            realHeaders[key] = headers[key];
        }
    }
    realHeaders["Host"] = parsedUrl.host;
    if (!realHeaders["User-Agent"]) {
        realHeaders["User-Agent"] = "Node-oauth";
    }
    if (post_body) {
        if (Buffer.isBuffer(post_body)) {
            realHeaders["Content-Length"] = post_body.length;
        } else {
            realHeaders["Content-Length"] = Buffer.byteLength(post_body);
        }
    } else {
        realHeaders["Content-length"] = 0;
    }
    if (access_token && !("Authorization" in realHeaders)) {
        if (!parsedUrl.query) parsedUrl.query = {};
        parsedUrl.query[this._accessTokenName] = access_token;
    }
    var queryStr = querystring.stringify(parsedUrl.query);
    if (queryStr) queryStr = "?" + queryStr;
    var options = {
        host: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + queryStr,
        method: method,
        headers: realHeaders
    };
    this._executeRequest(http_library, options, post_body, callback);
};
exports.OAuth2.prototype._executeRequest = function(http_library, options, post_body, callback) {
    // Some hosts *cough* google appear to close the connection early / send no content-length header
    // allow this behaviour.
    var allowEarlyClose = OAuthUtils.isAnEarlyCloseHost(options.host);
    var callbackCalled = false;
    function passBackControl(response, result) {
        if (!callbackCalled) {
            callbackCalled = true;
            if (!(response.statusCode >= 200 && response.statusCode <= 299) && response.statusCode != 301 && response.statusCode != 302) {
                callback({
                    statusCode: response.statusCode,
                    data: result
                });
            } else {
                callback(null, result, response);
            }
        }
    }
    var result = "";
    //set the agent on the request options
    if (this._agent) {
        options.agent = this._agent;
    }
    var request = http_library.request(options);
    request.on("response", function(response) {
        response.on("data", function(chunk) {
            result += chunk;
        });
        response.on("close", function(err) {
            if (allowEarlyClose) {
                passBackControl(response, result);
            }
        });
        response.addListener("end", function() {
            passBackControl(response, result);
        });
    });
    request.on("error", function(e) {
        callbackCalled = true;
        callback(e);
    });
    if ((options.method == "POST" || options.method == "PUT") && post_body) {
        request.write(post_body);
    }
    request.end();
};
exports.OAuth2.prototype.getAuthorizeUrl = function(params) {
    var params = params || {};
    params["client_id"] = this._clientId;
    return this._baseSite + this._authorizeUrl + "?" + querystring.stringify(params);
};
exports.OAuth2.prototype.getOAuthAccessToken = function(code, params, callback) {
    var params = params || {};
    params["client_id"] = this._clientId;
    params["client_secret"] = this._clientSecret;
    var codeParam = params.grant_type === "refresh_token" ? "refresh_token" : "code";
    params[codeParam] = code;
    var post_data = querystring.stringify(params);
    var post_headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    this._request("POST", this._getAccessTokenUrl(), post_headers, post_data, null, function(error, data, response) {
        if (error) callback(error);
        else {
            var results;
            try {
                // As of http://tools.ietf.org/html/draft-ietf-oauth-v2-07
                // responses should be in JSON
                results = JSON.parse(data);
            } catch (e) {
                // .... However both Facebook + Github currently use rev05 of the spec
                // and neither seem to specify a content-type correctly in their response headers :(
                // clients of these services will suffer a *minor* performance cost of the exception
                // being thrown
                results = querystring.parse(data);
            }
            var access_token = results["access_token"];
            var refresh_token = results["refresh_token"];
            delete results["refresh_token"];
            callback(null, access_token, refresh_token, results); // callback results =-=
        }
    });
};
// Deprecated
exports.OAuth2.prototype.getProtectedResource = function(url, access_token, callback) {
    this._request("GET", url, {}, "", access_token, callback);
};
exports.OAuth2.prototype.get = function(url, access_token, callback) {
    if (this._useAuthorizationHeaderForGET) {
        var headers = {
            "Authorization": this.buildAuthHeader(access_token)
        };
        access_token = null;
    } else {
        headers = {};
    }
    this._request("GET", url, headers, "", access_token, callback);
};


/***/ }),

/***/ 3313:
/***/ ((__unused_webpack_module, exports) => {

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS 180-1
 * Version 2.2 Copyright Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */ /*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */ var hexcase = 1; /* hex output format. 0 - lowercase; 1 - uppercase        */ 
var b64pad = "="; /* base-64 pad character. "=" for strict RFC compliance   */ 
/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */ function hex_sha1(s) {
    return rstr2hex(rstr_sha1(str2rstr_utf8(s)));
}
function b64_sha1(s) {
    return rstr2b64(rstr_sha1(str2rstr_utf8(s)));
}
function any_sha1(s, e) {
    return rstr2any(rstr_sha1(str2rstr_utf8(s)), e);
}
function hex_hmac_sha1(k, d) {
    return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)));
}
function b64_hmac_sha1(k, d) {
    return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)));
}
function any_hmac_sha1(k, d, e) {
    return rstr2any(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)), e);
}
/*
 * Perform a simple self-test to see if the VM is working
 */ function sha1_vm_test() {
    return hex_sha1("abc").toLowerCase() == "a9993e364706816aba3e25717850c26c9cd0d89d";
}
/*
 * Calculate the SHA1 of a raw string
 */ function rstr_sha1(s) {
    return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
}
/*
 * Calculate the HMAC-SHA1 of a key and some data (raw strings)
 */ function rstr_hmac_sha1(key, data) {
    var bkey = rstr2binb(key);
    if (bkey.length > 16) bkey = binb_sha1(bkey, key.length * 8);
    var ipad = Array(16), opad = Array(16);
    for(var i = 0; i < 16; i++){
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }
    var hash = binb_sha1(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
    return binb2rstr(binb_sha1(opad.concat(hash), 512 + 160));
}
/*
 * Convert a raw string to a hex string
 */ function rstr2hex(input) {
    try {
        hexcase;
    } catch (e) {
        hexcase = 0;
    }
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var output = "";
    var x;
    for(var i = 0; i < input.length; i++){
        x = input.charCodeAt(i);
        output += hex_tab.charAt(x >>> 4 & 0x0F) + hex_tab.charAt(x & 0x0F);
    }
    return output;
}
/*
 * Convert a raw string to a base-64 string
 */ function rstr2b64(input) {
    try {
        b64pad;
    } catch (e) {
        b64pad = "";
    }
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var output = "";
    var len = input.length;
    for(var i = 0; i < len; i += 3){
        var triplet = input.charCodeAt(i) << 16 | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
        for(var j = 0; j < 4; j++){
            if (i * 8 + j * 6 > input.length * 8) output += b64pad;
            else output += tab.charAt(triplet >>> 6 * (3 - j) & 0x3F);
        }
    }
    return output;
}
/*
 * Convert a raw string to an arbitrary string encoding
 */ function rstr2any(input, encoding) {
    var divisor = encoding.length;
    var remainders = Array();
    var i, q, x, quotient;
    /* Convert to an array of 16-bit big-endian values, forming the dividend */ var dividend = Array(Math.ceil(input.length / 2));
    for(i = 0; i < dividend.length; i++){
        dividend[i] = input.charCodeAt(i * 2) << 8 | input.charCodeAt(i * 2 + 1);
    }
    /*
   * Repeatedly perform a long division. The binary array forms the dividend,
   * the length of the encoding is the divisor. Once computed, the quotient
   * forms the dividend for the next step. We stop when the dividend is zero.
   * All remainders are stored for later use.
   */ while(dividend.length > 0){
        quotient = Array();
        x = 0;
        for(i = 0; i < dividend.length; i++){
            x = (x << 16) + dividend[i];
            q = Math.floor(x / divisor);
            x -= q * divisor;
            if (quotient.length > 0 || q > 0) quotient[quotient.length] = q;
        }
        remainders[remainders.length] = x;
        dividend = quotient;
    }
    /* Convert the remainders to the output string */ var output = "";
    for(i = remainders.length - 1; i >= 0; i--)output += encoding.charAt(remainders[i]);
    /* Append leading zero equivalents */ var full_length = Math.ceil(input.length * 8 / (Math.log(encoding.length) / Math.log(2)));
    for(i = output.length; i < full_length; i++)output = encoding[0] + output;
    return output;
}
/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */ function str2rstr_utf8(input) {
    var output = "";
    var i = -1;
    var x, y;
    while(++i < input.length){
        /* Decode utf-16 surrogate pairs */ x = input.charCodeAt(i);
        y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
        if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
            x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
            i++;
        }
        /* Encode output as utf-8 */ if (x <= 0x7F) output += String.fromCharCode(x);
        else if (x <= 0x7FF) output += String.fromCharCode(0xC0 | x >>> 6 & 0x1F, 0x80 | x & 0x3F);
        else if (x <= 0xFFFF) output += String.fromCharCode(0xE0 | x >>> 12 & 0x0F, 0x80 | x >>> 6 & 0x3F, 0x80 | x & 0x3F);
        else if (x <= 0x1FFFFF) output += String.fromCharCode(0xF0 | x >>> 18 & 0x07, 0x80 | x >>> 12 & 0x3F, 0x80 | x >>> 6 & 0x3F, 0x80 | x & 0x3F);
    }
    return output;
}
/*
 * Encode a string as utf-16
 */ function str2rstr_utf16le(input) {
    var output = "";
    for(var i = 0; i < input.length; i++)output += String.fromCharCode(input.charCodeAt(i) & 0xFF, input.charCodeAt(i) >>> 8 & 0xFF);
    return output;
}
function str2rstr_utf16be(input) {
    var output = "";
    for(var i = 0; i < input.length; i++)output += String.fromCharCode(input.charCodeAt(i) >>> 8 & 0xFF, input.charCodeAt(i) & 0xFF);
    return output;
}
/*
 * Convert a raw string to an array of big-endian words
 * Characters >255 have their high-byte silently ignored.
 */ function rstr2binb(input) {
    var output = Array(input.length >> 2);
    for(var i = 0; i < output.length; i++)output[i] = 0;
    for(var i = 0; i < input.length * 8; i += 8)output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << 24 - i % 32;
    return output;
}
/*
 * Convert an array of big-endian words to a string
 */ function binb2rstr(input) {
    var output = "";
    for(var i = 0; i < input.length * 32; i += 8)output += String.fromCharCode(input[i >> 5] >>> 24 - i % 32 & 0xFF);
    return output;
}
/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */ function binb_sha1(x, len) {
    /* append padding */ x[len >> 5] |= 0x80 << 24 - len % 32;
    x[(len + 64 >> 9 << 4) + 15] = len;
    var w = Array(80);
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    var e = -1009589776;
    for(var i = 0; i < x.length; i += 16){
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        var olde = e;
        for(var j = 0; j < 80; j++){
            if (j < 16) w[j] = x[i + j];
            else w[j] = bit_rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
            e = d;
            d = c;
            c = bit_rol(b, 30);
            b = a;
            a = t;
        }
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
        e = safe_add(e, olde);
    }
    return Array(a, b, c, d, e);
}
/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */ function sha1_ft(t, b, c, d) {
    if (t < 20) return b & c | ~b & d;
    if (t < 40) return b ^ c ^ d;
    if (t < 60) return b & c | b & d | c & d;
    return b ^ c ^ d;
}
/*
 * Determine the appropriate additive constant for the current iteration
 */ function sha1_kt(t) {
    return t < 20 ? 1518500249 : t < 40 ? 1859775393 : t < 60 ? -1894007588 : -899497514;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */ function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return msw << 16 | lsw & 0xFFFF;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */ function bit_rol(num, cnt) {
    return num << cnt | num >>> 32 - cnt;
}
exports.HMACSHA1 = function(key, data) {
    return b64_hmac_sha1(key, data);
};


/***/ }),

/***/ 2705:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

var crypto = __webpack_require__(6113);
/**
 * Exported function
 *
 * Options:
 *
 *  - `algorithm` hash algo to be used by this instance: *'sha1', 'md5'
 *  - `excludeValues` {true|*false} hash object keys, values ignored
 *  - `encoding` hash encoding, supports 'buffer', '*hex', 'binary', 'base64'
 *  - `ignoreUnknown` {true|*false} ignore unknown object types
 *  - `replacer` optional function that replaces values before hashing
 *  - `respectFunctionProperties` {*true|false} consider function properties when hashing
 *  - `respectFunctionNames` {*true|false} consider 'name' property of functions for hashing
 *  - `respectType` {*true|false} Respect special properties (prototype, constructor)
 *    when hashing to distinguish between types
 *  - `unorderedArrays` {true|*false} Sort all arrays before hashing
 *  - `unorderedSets` {*true|false} Sort `Set` and `Map` instances before hashing
 *  * = default
 *
 * @param {object} object value to hash
 * @param {object} options hashing options
 * @return {string} hash value
 * @api public
 */ exports = module.exports = objectHash;
function objectHash(object, options) {
    options = applyDefaults(object, options);
    return hash(object, options);
}
/**
 * Exported sugar methods
 *
 * @param {object} object value to hash
 * @return {string} hash value
 * @api public
 */ exports.sha1 = function(object) {
    return objectHash(object);
};
exports.keys = function(object) {
    return objectHash(object, {
        excludeValues: true,
        algorithm: "sha1",
        encoding: "hex"
    });
};
exports.MD5 = function(object) {
    return objectHash(object, {
        algorithm: "md5",
        encoding: "hex"
    });
};
exports.keysMD5 = function(object) {
    return objectHash(object, {
        algorithm: "md5",
        encoding: "hex",
        excludeValues: true
    });
};
// Internals
var hashes = crypto.getHashes ? crypto.getHashes().slice() : [
    "sha1",
    "md5"
];
hashes.push("passthrough");
var encodings = [
    "buffer",
    "hex",
    "binary",
    "base64"
];
function applyDefaults(object, sourceOptions) {
    sourceOptions = sourceOptions || {};
    // create a copy rather than mutating
    var options = {};
    options.algorithm = sourceOptions.algorithm || "sha1";
    options.encoding = sourceOptions.encoding || "hex";
    options.excludeValues = sourceOptions.excludeValues ? true : false;
    options.algorithm = options.algorithm.toLowerCase();
    options.encoding = options.encoding.toLowerCase();
    options.ignoreUnknown = sourceOptions.ignoreUnknown !== true ? false : true; // default to false
    options.respectType = sourceOptions.respectType === false ? false : true; // default to true
    options.respectFunctionNames = sourceOptions.respectFunctionNames === false ? false : true;
    options.respectFunctionProperties = sourceOptions.respectFunctionProperties === false ? false : true;
    options.unorderedArrays = sourceOptions.unorderedArrays !== true ? false : true; // default to false
    options.unorderedSets = sourceOptions.unorderedSets === false ? false : true; // default to false
    options.unorderedObjects = sourceOptions.unorderedObjects === false ? false : true; // default to true
    options.replacer = sourceOptions.replacer || undefined;
    options.excludeKeys = sourceOptions.excludeKeys || undefined;
    if (typeof object === "undefined") {
        throw new Error("Object argument required.");
    }
    // if there is a case-insensitive match in the hashes list, accept it
    // (i.e. SHA256 for sha256)
    for(var i = 0; i < hashes.length; ++i){
        if (hashes[i].toLowerCase() === options.algorithm.toLowerCase()) {
            options.algorithm = hashes[i];
        }
    }
    if (hashes.indexOf(options.algorithm) === -1) {
        throw new Error('Algorithm "' + options.algorithm + '"  not supported. ' + "supported values: " + hashes.join(", "));
    }
    if (encodings.indexOf(options.encoding) === -1 && options.algorithm !== "passthrough") {
        throw new Error('Encoding "' + options.encoding + '"  not supported. ' + "supported values: " + encodings.join(", "));
    }
    return options;
}
/** Check if the given function is a native function */ function isNativeFunction(f) {
    if (typeof f !== "function") {
        return false;
    }
    var exp = /^function\s+\w*\s*\(\s*\)\s*{\s+\[native code\]\s+}$/i;
    return exp.exec(Function.prototype.toString.call(f)) != null;
}
function hash(object, options) {
    var hashingStream;
    if (options.algorithm !== "passthrough") {
        hashingStream = crypto.createHash(options.algorithm);
    } else {
        hashingStream = new PassThrough();
    }
    if (typeof hashingStream.write === "undefined") {
        hashingStream.write = hashingStream.update;
        hashingStream.end = hashingStream.update;
    }
    var hasher = typeHasher(options, hashingStream);
    hasher.dispatch(object);
    if (!hashingStream.update) {
        hashingStream.end("");
    }
    if (hashingStream.digest) {
        return hashingStream.digest(options.encoding === "buffer" ? undefined : options.encoding);
    }
    var buf = hashingStream.read();
    if (options.encoding === "buffer") {
        return buf;
    }
    return buf.toString(options.encoding);
}
/**
 * Expose streaming API
 *
 * @param {object} object  Value to serialize
 * @param {object} options  Options, as for hash()
 * @param {object} stream  A stream to write the serializiation to
 * @api public
 */ exports.writeToStream = function(object, options, stream) {
    if (typeof stream === "undefined") {
        stream = options;
        options = {};
    }
    options = applyDefaults(object, options);
    return typeHasher(options, stream).dispatch(object);
};
function typeHasher(options, writeTo, context) {
    context = context || [];
    var write = function(str) {
        if (writeTo.update) {
            return writeTo.update(str, "utf8");
        } else {
            return writeTo.write(str, "utf8");
        }
    };
    return {
        dispatch: function(value) {
            if (options.replacer) {
                value = options.replacer(value);
            }
            var type = typeof value;
            if (value === null) {
                type = "null";
            }
            //console.log("[DEBUG] Dispatch: ", value, "->", type, " -> ", "_" + type);
            return this["_" + type](value);
        },
        _object: function(object) {
            var pattern = /\[object (.*)\]/i;
            var objString = Object.prototype.toString.call(object);
            var objType = pattern.exec(objString);
            if (!objType) {
                objType = "unknown:[" + objString + "]";
            } else {
                objType = objType[1]; // take only the class name
            }
            objType = objType.toLowerCase();
            var objectNumber = null;
            if ((objectNumber = context.indexOf(object)) >= 0) {
                return this.dispatch("[CIRCULAR:" + objectNumber + "]");
            } else {
                context.push(object);
            }
            if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
                write("buffer:");
                return write(object);
            }
            if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
                if (this["_" + objType]) {
                    this["_" + objType](object);
                } else if (options.ignoreUnknown) {
                    return write("[" + objType + "]");
                } else {
                    throw new Error('Unknown object type "' + objType + '"');
                }
            } else {
                var keys = Object.keys(object);
                if (options.unorderedObjects) {
                    keys = keys.sort();
                }
                // Make sure to incorporate special properties, so
                // Types with different prototypes will produce
                // a different hash and objects derived from
                // different functions (`new Foo`, `new Bar`) will
                // produce different hashes.
                // We never do this for native functions since some
                // seem to break because of that.
                if (options.respectType !== false && !isNativeFunction(object)) {
                    keys.splice(0, 0, "prototype", "__proto__", "constructor");
                }
                if (options.excludeKeys) {
                    keys = keys.filter(function(key) {
                        return !options.excludeKeys(key);
                    });
                }
                write("object:" + keys.length + ":");
                var self = this;
                return keys.forEach(function(key) {
                    self.dispatch(key);
                    write(":");
                    if (!options.excludeValues) {
                        self.dispatch(object[key]);
                    }
                    write(",");
                });
            }
        },
        _array: function(arr, unordered) {
            unordered = typeof unordered !== "undefined" ? unordered : options.unorderedArrays !== false; // default to options.unorderedArrays
            var self = this;
            write("array:" + arr.length + ":");
            if (!unordered || arr.length <= 1) {
                return arr.forEach(function(entry) {
                    return self.dispatch(entry);
                });
            }
            // the unordered case is a little more complicated:
            // since there is no canonical ordering on objects,
            // i.e. {a:1} < {a:2} and {a:1} > {a:2} are both false,
            // we first serialize each entry using a PassThrough stream
            // before sorting.
            // also: we can’t use the same context array for all entries
            // since the order of hashing should *not* matter. instead,
            // we keep track of the additions to a copy of the context array
            // and add all of them to the global context array when we’re done
            var contextAdditions = [];
            var entries = arr.map(function(entry) {
                var strm = new PassThrough();
                var localContext = context.slice(); // make copy
                var hasher = typeHasher(options, strm, localContext);
                hasher.dispatch(entry);
                // take only what was added to localContext and append it to contextAdditions
                contextAdditions = contextAdditions.concat(localContext.slice(context.length));
                return strm.read().toString();
            });
            context = context.concat(contextAdditions);
            entries.sort();
            return this._array(entries, false);
        },
        _date: function(date) {
            return write("date:" + date.toJSON());
        },
        _symbol: function(sym) {
            return write("symbol:" + sym.toString());
        },
        _error: function(err) {
            return write("error:" + err.toString());
        },
        _boolean: function(bool) {
            return write("bool:" + bool.toString());
        },
        _string: function(string) {
            write("string:" + string.length + ":");
            write(string.toString());
        },
        _function: function(fn) {
            write("fn:");
            if (isNativeFunction(fn)) {
                this.dispatch("[native]");
            } else {
                this.dispatch(fn.toString());
            }
            if (options.respectFunctionNames !== false) {
                // Make sure we can still distinguish native functions
                // by their name, otherwise String and Function will
                // have the same hash
                this.dispatch("function-name:" + String(fn.name));
            }
            if (options.respectFunctionProperties) {
                this._object(fn);
            }
        },
        _number: function(number) {
            return write("number:" + number.toString());
        },
        _xml: function(xml) {
            return write("xml:" + xml.toString());
        },
        _null: function() {
            return write("Null");
        },
        _undefined: function() {
            return write("Undefined");
        },
        _regexp: function(regex) {
            return write("regex:" + regex.toString());
        },
        _uint8array: function(arr) {
            write("uint8array:");
            return this.dispatch(Array.prototype.slice.call(arr));
        },
        _uint8clampedarray: function(arr) {
            write("uint8clampedarray:");
            return this.dispatch(Array.prototype.slice.call(arr));
        },
        _int8array: function(arr) {
            write("uint8array:");
            return this.dispatch(Array.prototype.slice.call(arr));
        },
        _uint16array: function(arr) {
            write("uint16array:");
            return this.dispatch(Array.prototype.slice.call(arr));
        },
        _int16array: function(arr) {
            write("uint16array:");
            return this.dispatch(Array.prototype.slice.call(arr));
        },
        _uint32array: function(arr) {
            write("uint32array:");
            return this.dispatch(Array.prototype.slice.call(arr));
        },
        _int32array: function(arr) {
            write("uint32array:");
            return this.dispatch(Array.prototype.slice.call(arr));
        },
        _float32array: function(arr) {
            write("float32array:");
            return this.dispatch(Array.prototype.slice.call(arr));
        },
        _float64array: function(arr) {
            write("float64array:");
            return this.dispatch(Array.prototype.slice.call(arr));
        },
        _arraybuffer: function(arr) {
            write("arraybuffer:");
            return this.dispatch(new Uint8Array(arr));
        },
        _url: function(url) {
            return write("url:" + url.toString(), "utf8");
        },
        _map: function(map) {
            write("map:");
            var arr = Array.from(map);
            return this._array(arr, options.unorderedSets !== false);
        },
        _set: function(set) {
            write("set:");
            var arr = Array.from(set);
            return this._array(arr, options.unorderedSets !== false);
        },
        _file: function(file) {
            write("file:");
            return this.dispatch([
                file.name,
                file.size,
                file.type,
                file.lastModfied
            ]);
        },
        _blob: function() {
            if (options.ignoreUnknown) {
                return write("[blob]");
            }
            throw Error("Hashing Blob objects is currently not supported\n" + "(see https://github.com/puleos/object-hash/issues/26)\n" + 'Use "options.replacer" or "options.ignoreUnknown"\n');
        },
        _domwindow: function() {
            return write("domwindow");
        },
        _bigint: function(number) {
            return write("bigint:" + number.toString());
        },
        /* Node.js standard native objects */ _process: function() {
            return write("process");
        },
        _timer: function() {
            return write("timer");
        },
        _pipe: function() {
            return write("pipe");
        },
        _tcp: function() {
            return write("tcp");
        },
        _udp: function() {
            return write("udp");
        },
        _tty: function() {
            return write("tty");
        },
        _statwatcher: function() {
            return write("statwatcher");
        },
        _securecontext: function() {
            return write("securecontext");
        },
        _connection: function() {
            return write("connection");
        },
        _zlib: function() {
            return write("zlib");
        },
        _context: function() {
            return write("context");
        },
        _nodescript: function() {
            return write("nodescript");
        },
        _httpparser: function() {
            return write("httpparser");
        },
        _dataview: function() {
            return write("dataview");
        },
        _signal: function() {
            return write("signal");
        },
        _fsevent: function() {
            return write("fsevent");
        },
        _tlswrap: function() {
            return write("tlswrap");
        }
    };
}
// Mini-implementation of stream.PassThrough
// We are far from having need for the full implementation, and we can
// make assumptions like "many writes, then only one final read"
// and we can ignore encoding specifics
function PassThrough() {
    return {
        buf: "",
        write: function(b) {
            this.buf += b;
        },
        end: function(b) {
            this.buf += b;
        },
        read: function() {
            return this.buf;
        }
    };
}


/***/ }),

/***/ 9265:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const { strict: assert  } = __webpack_require__(9491);
const { createHash  } = __webpack_require__(6113);
const { format  } = __webpack_require__(3837);
const shake256 = __webpack_require__(5619);
let encode;
if (Buffer.isEncoding("base64url")) {
    encode = (input)=>input.toString("base64url");
} else {
    const fromBase64 = (base64)=>base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    encode = (input)=>fromBase64(input.toString("base64"));
}
/** SPECIFICATION
 * Its (_hash) value is the base64url encoding of the left-most half of the hash of the octets of
 * the ASCII representation of the token value, where the hash algorithm used is the hash algorithm
 * used in the alg Header Parameter of the ID Token's JOSE Header. For instance, if the alg is
 * RS256, hash the token value with SHA-256, then take the left-most 128 bits and base64url encode
 * them. The _hash value is a case sensitive string.
 */ /**
 * @name getHash
 * @api private
 *
 * returns the sha length based off the JOSE alg heade value, defaults to sha256
 *
 * @param token {String} token value to generate the hash from
 * @param alg {String} ID Token JOSE header alg value (i.e. RS256, HS384, ES512, PS256)
 * @param [crv] {String} For EdDSA the curve decides what hash algorithm is used. Required for EdDSA
 */ function getHash(alg, crv) {
    switch(alg){
        case "HS256":
        case "RS256":
        case "PS256":
        case "ES256":
        case "ES256K":
            return createHash("sha256");
        case "HS384":
        case "RS384":
        case "PS384":
        case "ES384":
            return createHash("sha384");
        case "HS512":
        case "RS512":
        case "PS512":
        case "ES512":
            return createHash("sha512");
        case "EdDSA":
            switch(crv){
                case "Ed25519":
                    return createHash("sha512");
                case "Ed448":
                    if (!shake256) {
                        throw new TypeError("Ed448 *_hash calculation is not supported in your Node.js runtime version");
                    }
                    return createHash("shake256", {
                        outputLength: 114
                    });
                default:
                    throw new TypeError("unrecognized or invalid EdDSA curve provided");
            }
        default:
            throw new TypeError("unrecognized or invalid JWS algorithm provided");
    }
}
function generate(token, alg, crv) {
    const digest = getHash(alg, crv).update(token).digest();
    return encode(digest.slice(0, digest.length / 2));
}
function validate(names, actual, source, alg, crv) {
    if (typeof names.claim !== "string" || !names.claim) {
        throw new TypeError("names.claim must be a non-empty string");
    }
    if (typeof names.source !== "string" || !names.source) {
        throw new TypeError("names.source must be a non-empty string");
    }
    assert(typeof actual === "string" && actual, `${names.claim} must be a non-empty string`);
    assert(typeof source === "string" && source, `${names.source} must be a non-empty string`);
    let expected;
    let msg;
    try {
        expected = generate(source, alg, crv);
    } catch (err) {
        msg = format("%s could not be validated (%s)", names.claim, err.message);
    }
    msg = msg || format("%s mismatch, expected %s, got: %s", names.claim, expected, actual);
    assert.equal(expected, actual, msg);
}
module.exports = {
    validate,
    generate
};


/***/ }),

/***/ 5619:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const crypto = __webpack_require__(6113);
const [major, minor] = process.version.substring(1).split(".").map((x)=>parseInt(x, 10));
const xofOutputLength = major > 12 || major === 12 && minor >= 8;
const shake256 = xofOutputLength && crypto.getHashes().includes("shake256");
module.exports = shake256;


/***/ }),

/***/ 5546:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const { inspect  } = __webpack_require__(3837);
const stdhttp = __webpack_require__(3685);
const crypto = __webpack_require__(6113);
const { strict: assert  } = __webpack_require__(9491);
const querystring = __webpack_require__(3477);
const url = __webpack_require__(7310);
const jose = __webpack_require__(5922);
const tokenHash = __webpack_require__(9265);
const isKeyObject = __webpack_require__(3048);
const decodeJWT = __webpack_require__(2623);
const base64url = __webpack_require__(7882);
const defaults = __webpack_require__(5547);
const parseWwwAuthenticate = __webpack_require__(8216);
const { assertSigningAlgValuesSupport , assertIssuerConfiguration  } = __webpack_require__(1910);
const pick = __webpack_require__(9107);
const isPlainObject = __webpack_require__(1101);
const processResponse = __webpack_require__(6381);
const TokenSet = __webpack_require__(1498);
const { OPError , RPError  } = __webpack_require__(9244);
const now = __webpack_require__(7373);
const { random  } = __webpack_require__(8734);
const request = __webpack_require__(724);
const { CLOCK_TOLERANCE  } = __webpack_require__(5261);
const { keystores  } = __webpack_require__(9257);
const KeyStore = __webpack_require__(707);
const clone = __webpack_require__(2984);
const { authenticatedPost , resolveResponseType , resolveRedirectUri  } = __webpack_require__(2716);
const { queryKeyStore  } = __webpack_require__(8705);
const DeviceFlowHandle = __webpack_require__(4198);
const [major, minor] = process.version.slice(1).split(".").map((str)=>parseInt(str, 10));
const rsaPssParams = major >= 17 || major === 16 && minor >= 9;
const retryAttempt = Symbol();
const skipNonceCheck = Symbol();
const skipMaxAgeCheck = Symbol();
function pickCb(input) {
    return pick(input, "access_token", "code", "error_description", "error_uri", "error", "expires_in", "id_token", "iss", "response", "session_state", "state", "token_type");
}
function authorizationHeaderValue(token, tokenType = "Bearer") {
    return `${tokenType} ${token}`;
}
function verifyPresence(payload, jwt, prop) {
    if (payload[prop] === undefined) {
        throw new RPError({
            message: `missing required JWT property ${prop}`,
            jwt
        });
    }
}
function authorizationParams(params) {
    const authParams = {
        client_id: this.client_id,
        scope: "openid",
        response_type: resolveResponseType.call(this),
        redirect_uri: resolveRedirectUri.call(this),
        ...params
    };
    Object.entries(authParams).forEach(([key, value])=>{
        if (value === null || value === undefined) {
            delete authParams[key];
        } else if (key === "claims" && typeof value === "object") {
            authParams[key] = JSON.stringify(value);
        } else if (key === "resource" && Array.isArray(value)) {
            authParams[key] = value;
        } else if (typeof value !== "string") {
            authParams[key] = String(value);
        }
    });
    return authParams;
}
function getKeystore(jwks) {
    if (!isPlainObject(jwks) || !Array.isArray(jwks.keys) || jwks.keys.some((k)=>!isPlainObject(k) || !("kty" in k))) {
        throw new TypeError("jwks must be a JSON Web Key Set formatted object");
    }
    return KeyStore.fromJWKS(jwks, {
        onlyPrivate: true
    });
}
// if an OP doesnt support client_secret_basic but supports client_secret_post, use it instead
// this is in place to take care of most common pitfalls when first using discovered Issuers without
// the support for default values defined by Discovery 1.0
function checkBasicSupport(client, properties) {
    try {
        const supported = client.issuer.token_endpoint_auth_methods_supported;
        if (!supported.includes(properties.token_endpoint_auth_method)) {
            if (supported.includes("client_secret_post")) {
                properties.token_endpoint_auth_method = "client_secret_post";
            }
        }
    } catch (err) {}
}
function handleCommonMistakes(client, metadata, properties) {
    if (!metadata.token_endpoint_auth_method) {
        // if no explicit value was provided
        checkBasicSupport(client, properties);
    }
    // :fp: c'mon people... RTFM
    if (metadata.redirect_uri) {
        if (metadata.redirect_uris) {
            throw new TypeError("provide a redirect_uri or redirect_uris, not both");
        }
        properties.redirect_uris = [
            metadata.redirect_uri
        ];
        delete properties.redirect_uri;
    }
    if (metadata.response_type) {
        if (metadata.response_types) {
            throw new TypeError("provide a response_type or response_types, not both");
        }
        properties.response_types = [
            metadata.response_type
        ];
        delete properties.response_type;
    }
}
function getDefaultsForEndpoint(endpoint, issuer, properties) {
    if (!issuer[`${endpoint}_endpoint`]) return;
    const tokenEndpointAuthMethod = properties.token_endpoint_auth_method;
    const tokenEndpointAuthSigningAlg = properties.token_endpoint_auth_signing_alg;
    const eam = `${endpoint}_endpoint_auth_method`;
    const easa = `${endpoint}_endpoint_auth_signing_alg`;
    if (properties[eam] === undefined && properties[easa] === undefined) {
        if (tokenEndpointAuthMethod !== undefined) {
            properties[eam] = tokenEndpointAuthMethod;
        }
        if (tokenEndpointAuthSigningAlg !== undefined) {
            properties[easa] = tokenEndpointAuthSigningAlg;
        }
    }
}
class BaseClient {
    #metadata;
    #issuer;
    #aadIssValidation;
    #additionalAuthorizedParties;
    constructor(issuer, aadIssValidation, metadata = {}, jwks, options){
        this.#metadata = new Map();
        this.#issuer = issuer;
        this.#aadIssValidation = aadIssValidation;
        if (typeof metadata.client_id !== "string" || !metadata.client_id) {
            throw new TypeError("client_id is required");
        }
        const properties = {
            grant_types: [
                "authorization_code"
            ],
            id_token_signed_response_alg: "RS256",
            authorization_signed_response_alg: "RS256",
            response_types: [
                "code"
            ],
            token_endpoint_auth_method: "client_secret_basic",
            ...this.fapi() ? {
                grant_types: [
                    "authorization_code",
                    "implicit"
                ],
                id_token_signed_response_alg: "PS256",
                authorization_signed_response_alg: "PS256",
                response_types: [
                    "code id_token"
                ],
                tls_client_certificate_bound_access_tokens: true,
                token_endpoint_auth_method: undefined
            } : undefined,
            ...metadata
        };
        if (this.fapi()) {
            switch(properties.token_endpoint_auth_method){
                case "self_signed_tls_client_auth":
                case "tls_client_auth":
                    break;
                case "private_key_jwt":
                    if (!jwks) {
                        throw new TypeError("jwks is required");
                    }
                    break;
                case undefined:
                    throw new TypeError("token_endpoint_auth_method is required");
                default:
                    throw new TypeError("invalid or unsupported token_endpoint_auth_method");
            }
        }
        handleCommonMistakes(this, metadata, properties);
        assertSigningAlgValuesSupport("token", this.issuer, properties);
        [
            "introspection",
            "revocation"
        ].forEach((endpoint)=>{
            getDefaultsForEndpoint(endpoint, this.issuer, properties);
            assertSigningAlgValuesSupport(endpoint, this.issuer, properties);
        });
        Object.entries(properties).forEach(([key, value])=>{
            this.#metadata.set(key, value);
            if (!this[key]) {
                Object.defineProperty(this, key, {
                    get () {
                        return this.#metadata.get(key);
                    },
                    enumerable: true
                });
            }
        });
        if (jwks !== undefined) {
            const keystore = getKeystore.call(this, jwks);
            keystores.set(this, keystore);
        }
        if (options != null && options.additionalAuthorizedParties) {
            this.#additionalAuthorizedParties = clone(options.additionalAuthorizedParties);
        }
        this[CLOCK_TOLERANCE] = 0;
    }
    authorizationUrl(params = {}) {
        if (!isPlainObject(params)) {
            throw new TypeError("params must be a plain object");
        }
        assertIssuerConfiguration(this.issuer, "authorization_endpoint");
        const target = url.parse(this.issuer.authorization_endpoint, true);
        target.search = null;
        target.query = {
            ...target.query,
            ...authorizationParams.call(this, params)
        };
        return url.format(target);
    }
    authorizationPost(params = {}) {
        if (!isPlainObject(params)) {
            throw new TypeError("params must be a plain object");
        }
        const inputs = authorizationParams.call(this, params);
        const formInputs = Object.keys(inputs).map((name)=>`<input type="hidden" name="${name}" value="${inputs[name]}"/>`).join("\n");
        return `<!DOCTYPE html>
<head>
<title>Requesting Authorization</title>
</head>
<body onload="javascript:document.forms[0].submit()">
<form method="post" action="${this.issuer.authorization_endpoint}">
  ${formInputs}
</form>
</body>
</html>`;
    }
    endSessionUrl(params = {}) {
        assertIssuerConfiguration(this.issuer, "end_session_endpoint");
        const { 0: postLogout , length  } = this.post_logout_redirect_uris || [];
        const { post_logout_redirect_uri =length === 1 ? postLogout : undefined  } = params;
        let id_token_hint;
        ({ id_token_hint , ...params } = params);
        if (id_token_hint instanceof TokenSet) {
            if (!id_token_hint.id_token) {
                throw new TypeError("id_token not present in TokenSet");
            }
            id_token_hint = id_token_hint.id_token;
        }
        const target = url.parse(this.issuer.end_session_endpoint, true);
        target.search = null;
        defaults(target.query, params, {
            post_logout_redirect_uri,
            client_id: this.client_id
        }, {
            id_token_hint
        });
        Object.entries(target.query).forEach(([key, value])=>{
            if (value === null || value === undefined) {
                delete target.query[key];
            }
        });
        return url.format(target);
    }
    callbackParams(input) {
        const isIncomingMessage = input instanceof stdhttp.IncomingMessage || input && input.method && input.url;
        const isString = typeof input === "string";
        if (!isString && !isIncomingMessage) {
            throw new TypeError("#callbackParams only accepts string urls, http.IncomingMessage or a lookalike");
        }
        if (isIncomingMessage) {
            switch(input.method){
                case "GET":
                    return pickCb(url.parse(input.url, true).query);
                case "POST":
                    if (input.body === undefined) {
                        throw new TypeError("incoming message body missing, include a body parser prior to this method call");
                    }
                    switch(typeof input.body){
                        case "object":
                        case "string":
                            if (Buffer.isBuffer(input.body)) {
                                return pickCb(querystring.parse(input.body.toString("utf-8")));
                            }
                            if (typeof input.body === "string") {
                                return pickCb(querystring.parse(input.body));
                            }
                            return pickCb(input.body);
                        default:
                            throw new TypeError("invalid IncomingMessage body object");
                    }
                default:
                    throw new TypeError("invalid IncomingMessage method");
            }
        } else {
            return pickCb(url.parse(input, true).query);
        }
    }
    async callback(redirectUri, parameters, checks = {}, { exchangeBody , clientAssertionPayload , DPoP  } = {}) {
        let params = pickCb(parameters);
        if (checks.jarm && !("response" in parameters)) {
            throw new RPError({
                message: "expected a JARM response",
                checks,
                params
            });
        } else if ("response" in parameters) {
            const decrypted = await this.decryptJARM(params.response);
            params = await this.validateJARM(decrypted);
        }
        if (this.default_max_age && !checks.max_age) {
            checks.max_age = this.default_max_age;
        }
        if (params.state && !checks.state) {
            throw new TypeError("checks.state argument is missing");
        }
        if (!params.state && checks.state) {
            throw new RPError({
                message: "state missing from the response",
                checks,
                params
            });
        }
        if (checks.state !== params.state) {
            throw new RPError({
                printf: [
                    "state mismatch, expected %s, got: %s",
                    checks.state,
                    params.state
                ],
                checks,
                params
            });
        }
        if ("iss" in params) {
            assertIssuerConfiguration(this.issuer, "issuer");
            if (params.iss !== this.issuer.issuer) {
                throw new RPError({
                    printf: [
                        "iss mismatch, expected %s, got: %s",
                        this.issuer.issuer,
                        params.iss
                    ],
                    params
                });
            }
        } else if (this.issuer.authorization_response_iss_parameter_supported && !("id_token" in params) && !("response" in parameters)) {
            throw new RPError({
                message: "iss missing from the response",
                params
            });
        }
        if (params.error) {
            throw new OPError(params);
        }
        const RESPONSE_TYPE_REQUIRED_PARAMS = {
            code: [
                "code"
            ],
            id_token: [
                "id_token"
            ],
            token: [
                "access_token",
                "token_type"
            ]
        };
        if (checks.response_type) {
            for (const type of checks.response_type.split(" ")){
                if (type === "none") {
                    if (params.code || params.id_token || params.access_token) {
                        throw new RPError({
                            message: 'unexpected params encountered for "none" response',
                            checks,
                            params
                        });
                    }
                } else {
                    for (const param of RESPONSE_TYPE_REQUIRED_PARAMS[type]){
                        if (!params[param]) {
                            throw new RPError({
                                message: `${param} missing from response`,
                                checks,
                                params
                            });
                        }
                    }
                }
            }
        }
        if (params.id_token) {
            const tokenset = new TokenSet(params);
            await this.decryptIdToken(tokenset);
            await this.validateIdToken(tokenset, checks.nonce, "authorization", checks.max_age, checks.state);
            if (!params.code) {
                return tokenset;
            }
        }
        if (params.code) {
            const tokenset = await this.grant({
                ...exchangeBody,
                grant_type: "authorization_code",
                code: params.code,
                redirect_uri: redirectUri,
                code_verifier: checks.code_verifier
            }, {
                clientAssertionPayload,
                DPoP
            });
            await this.decryptIdToken(tokenset);
            await this.validateIdToken(tokenset, checks.nonce, "token", checks.max_age);
            if (params.session_state) {
                tokenset.session_state = params.session_state;
            }
            return tokenset;
        }
        return new TokenSet(params);
    }
    async oauthCallback(redirectUri, parameters, checks = {}, { exchangeBody , clientAssertionPayload , DPoP  } = {}) {
        let params = pickCb(parameters);
        if (checks.jarm && !("response" in parameters)) {
            throw new RPError({
                message: "expected a JARM response",
                checks,
                params
            });
        } else if ("response" in parameters) {
            const decrypted = await this.decryptJARM(params.response);
            params = await this.validateJARM(decrypted);
        }
        if (params.state && !checks.state) {
            throw new TypeError("checks.state argument is missing");
        }
        if (!params.state && checks.state) {
            throw new RPError({
                message: "state missing from the response",
                checks,
                params
            });
        }
        if (checks.state !== params.state) {
            throw new RPError({
                printf: [
                    "state mismatch, expected %s, got: %s",
                    checks.state,
                    params.state
                ],
                checks,
                params
            });
        }
        if ("iss" in params) {
            assertIssuerConfiguration(this.issuer, "issuer");
            if (params.iss !== this.issuer.issuer) {
                throw new RPError({
                    printf: [
                        "iss mismatch, expected %s, got: %s",
                        this.issuer.issuer,
                        params.iss
                    ],
                    params
                });
            }
        } else if (this.issuer.authorization_response_iss_parameter_supported && !("id_token" in params) && !("response" in parameters)) {
            throw new RPError({
                message: "iss missing from the response",
                params
            });
        }
        if (params.error) {
            throw new OPError(params);
        }
        if (typeof params.id_token === "string" && params.id_token.length) {
            throw new RPError({
                message: "id_token detected in the response, you must use client.callback() instead of client.oauthCallback()",
                params
            });
        }
        delete params.id_token;
        const RESPONSE_TYPE_REQUIRED_PARAMS = {
            code: [
                "code"
            ],
            token: [
                "access_token",
                "token_type"
            ]
        };
        if (checks.response_type) {
            for (const type of checks.response_type.split(" ")){
                if (type === "none") {
                    if (params.code || params.id_token || params.access_token) {
                        throw new RPError({
                            message: 'unexpected params encountered for "none" response',
                            checks,
                            params
                        });
                    }
                }
                if (RESPONSE_TYPE_REQUIRED_PARAMS[type]) {
                    for (const param of RESPONSE_TYPE_REQUIRED_PARAMS[type]){
                        if (!params[param]) {
                            throw new RPError({
                                message: `${param} missing from response`,
                                checks,
                                params
                            });
                        }
                    }
                }
            }
        }
        if (params.code) {
            const tokenset = await this.grant({
                ...exchangeBody,
                grant_type: "authorization_code",
                code: params.code,
                redirect_uri: redirectUri,
                code_verifier: checks.code_verifier
            }, {
                clientAssertionPayload,
                DPoP
            });
            if (typeof tokenset.id_token === "string" && tokenset.id_token.length) {
                throw new RPError({
                    message: "id_token detected in the response, you must use client.callback() instead of client.oauthCallback()",
                    params
                });
            }
            delete tokenset.id_token;
            return tokenset;
        }
        return new TokenSet(params);
    }
    async decryptIdToken(token) {
        if (!this.id_token_encrypted_response_alg) {
            return token;
        }
        let idToken = token;
        if (idToken instanceof TokenSet) {
            if (!idToken.id_token) {
                throw new TypeError("id_token not present in TokenSet");
            }
            idToken = idToken.id_token;
        }
        const expectedAlg = this.id_token_encrypted_response_alg;
        const expectedEnc = this.id_token_encrypted_response_enc;
        const result = await this.decryptJWE(idToken, expectedAlg, expectedEnc);
        if (token instanceof TokenSet) {
            token.id_token = result;
            return token;
        }
        return result;
    }
    async validateJWTUserinfo(body) {
        const expectedAlg = this.userinfo_signed_response_alg;
        return this.validateJWT(body, expectedAlg, []);
    }
    async decryptJARM(response) {
        if (!this.authorization_encrypted_response_alg) {
            return response;
        }
        const expectedAlg = this.authorization_encrypted_response_alg;
        const expectedEnc = this.authorization_encrypted_response_enc;
        return this.decryptJWE(response, expectedAlg, expectedEnc);
    }
    async decryptJWTUserinfo(body) {
        if (!this.userinfo_encrypted_response_alg) {
            return body;
        }
        const expectedAlg = this.userinfo_encrypted_response_alg;
        const expectedEnc = this.userinfo_encrypted_response_enc;
        return this.decryptJWE(body, expectedAlg, expectedEnc);
    }
    async decryptJWE(jwe, expectedAlg, expectedEnc = "A128CBC-HS256") {
        const header = JSON.parse(base64url.decode(jwe.split(".")[0]));
        if (header.alg !== expectedAlg) {
            throw new RPError({
                printf: [
                    "unexpected JWE alg received, expected %s, got: %s",
                    expectedAlg,
                    header.alg
                ],
                jwt: jwe
            });
        }
        if (header.enc !== expectedEnc) {
            throw new RPError({
                printf: [
                    "unexpected JWE enc received, expected %s, got: %s",
                    expectedEnc,
                    header.enc
                ],
                jwt: jwe
            });
        }
        const getPlaintext = (result)=>new TextDecoder().decode(result.plaintext);
        let plaintext;
        if (expectedAlg.match(/^(?:RSA|ECDH)/)) {
            const keystore = await keystores.get(this);
            for (const { keyObject: key  } of keystore.all({
                ...jose.decodeProtectedHeader(jwe),
                use: "enc"
            })){
                plaintext = await jose.compactDecrypt(jwe, key).then(getPlaintext, ()=>{});
                if (plaintext) break;
            }
        } else {
            plaintext = await jose.compactDecrypt(jwe, this.secretForAlg(expectedAlg === "dir" ? expectedEnc : expectedAlg)).then(getPlaintext, ()=>{});
        }
        if (!plaintext) {
            throw new RPError({
                message: "failed to decrypt JWE",
                jwt: jwe
            });
        }
        return plaintext;
    }
    async validateIdToken(tokenSet, nonce, returnedBy, maxAge, state) {
        let idToken = tokenSet;
        const expectedAlg = this.id_token_signed_response_alg;
        const isTokenSet = idToken instanceof TokenSet;
        if (isTokenSet) {
            if (!idToken.id_token) {
                throw new TypeError("id_token not present in TokenSet");
            }
            idToken = idToken.id_token;
        }
        idToken = String(idToken);
        const timestamp = now();
        const { protected: header , payload , key  } = await this.validateJWT(idToken, expectedAlg);
        if (typeof maxAge === "number" || maxAge !== skipMaxAgeCheck && this.require_auth_time) {
            if (!payload.auth_time) {
                throw new RPError({
                    message: "missing required JWT property auth_time",
                    jwt: idToken
                });
            }
            if (typeof payload.auth_time !== "number") {
                throw new RPError({
                    message: "JWT auth_time claim must be a JSON numeric value",
                    jwt: idToken
                });
            }
        }
        if (typeof maxAge === "number" && payload.auth_time + maxAge < timestamp - this[CLOCK_TOLERANCE]) {
            throw new RPError({
                printf: [
                    "too much time has elapsed since the last End-User authentication, max_age %i, auth_time: %i, now %i",
                    maxAge,
                    payload.auth_time,
                    timestamp - this[CLOCK_TOLERANCE]
                ],
                now: timestamp,
                tolerance: this[CLOCK_TOLERANCE],
                auth_time: payload.auth_time,
                jwt: idToken
            });
        }
        if (nonce !== skipNonceCheck && (payload.nonce || nonce !== undefined) && payload.nonce !== nonce) {
            throw new RPError({
                printf: [
                    "nonce mismatch, expected %s, got: %s",
                    nonce,
                    payload.nonce
                ],
                jwt: idToken
            });
        }
        if (returnedBy === "authorization") {
            if (!payload.at_hash && tokenSet.access_token) {
                throw new RPError({
                    message: "missing required property at_hash",
                    jwt: idToken
                });
            }
            if (!payload.c_hash && tokenSet.code) {
                throw new RPError({
                    message: "missing required property c_hash",
                    jwt: idToken
                });
            }
            if (this.fapi()) {
                if (!payload.s_hash && (tokenSet.state || state)) {
                    throw new RPError({
                        message: "missing required property s_hash",
                        jwt: idToken
                    });
                }
            }
            if (payload.s_hash) {
                if (!state) {
                    throw new TypeError('cannot verify s_hash, "checks.state" property not provided');
                }
                try {
                    tokenHash.validate({
                        claim: "s_hash",
                        source: "state"
                    }, payload.s_hash, state, header.alg, key.jwk && key.jwk.crv);
                } catch (err) {
                    throw new RPError({
                        message: err.message,
                        jwt: idToken
                    });
                }
            }
        }
        if (this.fapi() && payload.iat < timestamp - 3600) {
            throw new RPError({
                printf: [
                    "JWT issued too far in the past, now %i, iat %i",
                    timestamp,
                    payload.iat
                ],
                now: timestamp,
                tolerance: this[CLOCK_TOLERANCE],
                iat: payload.iat,
                jwt: idToken
            });
        }
        if (tokenSet.access_token && payload.at_hash !== undefined) {
            try {
                tokenHash.validate({
                    claim: "at_hash",
                    source: "access_token"
                }, payload.at_hash, tokenSet.access_token, header.alg, key.jwk && key.jwk.crv);
            } catch (err) {
                throw new RPError({
                    message: err.message,
                    jwt: idToken
                });
            }
        }
        if (tokenSet.code && payload.c_hash !== undefined) {
            try {
                tokenHash.validate({
                    claim: "c_hash",
                    source: "code"
                }, payload.c_hash, tokenSet.code, header.alg, key.jwk && key.jwk.crv);
            } catch (err) {
                throw new RPError({
                    message: err.message,
                    jwt: idToken
                });
            }
        }
        return tokenSet;
    }
    async validateJWT(jwt, expectedAlg, required = [
        "iss",
        "sub",
        "aud",
        "exp",
        "iat"
    ]) {
        const isSelfIssued = this.issuer.issuer === "https://self-issued.me";
        const timestamp = now();
        let header;
        let payload;
        try {
            ({ header , payload  } = decodeJWT(jwt, {
                complete: true
            }));
        } catch (err) {
            throw new RPError({
                printf: [
                    "failed to decode JWT (%s: %s)",
                    err.name,
                    err.message
                ],
                jwt
            });
        }
        if (header.alg !== expectedAlg) {
            throw new RPError({
                printf: [
                    "unexpected JWT alg received, expected %s, got: %s",
                    expectedAlg,
                    header.alg
                ],
                jwt
            });
        }
        if (isSelfIssued) {
            required = [
                ...required,
                "sub_jwk"
            ];
        }
        required.forEach(verifyPresence.bind(undefined, payload, jwt));
        if (payload.iss !== undefined) {
            let expectedIss = this.issuer.issuer;
            if (this.#aadIssValidation) {
                expectedIss = this.issuer.issuer.replace("{tenantid}", payload.tid);
            }
            if (payload.iss !== expectedIss) {
                throw new RPError({
                    printf: [
                        "unexpected iss value, expected %s, got: %s",
                        expectedIss,
                        payload.iss
                    ],
                    jwt
                });
            }
        }
        if (payload.iat !== undefined) {
            if (typeof payload.iat !== "number") {
                throw new RPError({
                    message: "JWT iat claim must be a JSON numeric value",
                    jwt
                });
            }
        }
        if (payload.nbf !== undefined) {
            if (typeof payload.nbf !== "number") {
                throw new RPError({
                    message: "JWT nbf claim must be a JSON numeric value",
                    jwt
                });
            }
            if (payload.nbf > timestamp + this[CLOCK_TOLERANCE]) {
                throw new RPError({
                    printf: [
                        "JWT not active yet, now %i, nbf %i",
                        timestamp + this[CLOCK_TOLERANCE],
                        payload.nbf
                    ],
                    now: timestamp,
                    tolerance: this[CLOCK_TOLERANCE],
                    nbf: payload.nbf,
                    jwt
                });
            }
        }
        if (payload.exp !== undefined) {
            if (typeof payload.exp !== "number") {
                throw new RPError({
                    message: "JWT exp claim must be a JSON numeric value",
                    jwt
                });
            }
            if (timestamp - this[CLOCK_TOLERANCE] >= payload.exp) {
                throw new RPError({
                    printf: [
                        "JWT expired, now %i, exp %i",
                        timestamp - this[CLOCK_TOLERANCE],
                        payload.exp
                    ],
                    now: timestamp,
                    tolerance: this[CLOCK_TOLERANCE],
                    exp: payload.exp,
                    jwt
                });
            }
        }
        if (payload.aud !== undefined) {
            if (Array.isArray(payload.aud)) {
                if (payload.aud.length > 1 && !payload.azp) {
                    throw new RPError({
                        message: "missing required JWT property azp",
                        jwt
                    });
                }
                if (!payload.aud.includes(this.client_id)) {
                    throw new RPError({
                        printf: [
                            "aud is missing the client_id, expected %s to be included in %j",
                            this.client_id,
                            payload.aud
                        ],
                        jwt
                    });
                }
            } else if (payload.aud !== this.client_id) {
                throw new RPError({
                    printf: [
                        "aud mismatch, expected %s, got: %s",
                        this.client_id,
                        payload.aud
                    ],
                    jwt
                });
            }
        }
        if (payload.azp !== undefined) {
            let additionalAuthorizedParties = this.#additionalAuthorizedParties;
            if (typeof additionalAuthorizedParties === "string") {
                additionalAuthorizedParties = [
                    this.client_id,
                    additionalAuthorizedParties
                ];
            } else if (Array.isArray(additionalAuthorizedParties)) {
                additionalAuthorizedParties = [
                    this.client_id,
                    ...additionalAuthorizedParties
                ];
            } else {
                additionalAuthorizedParties = [
                    this.client_id
                ];
            }
            if (!additionalAuthorizedParties.includes(payload.azp)) {
                throw new RPError({
                    printf: [
                        "azp mismatch, got: %s",
                        payload.azp
                    ],
                    jwt
                });
            }
        }
        let keys;
        if (isSelfIssued) {
            try {
                assert(isPlainObject(payload.sub_jwk));
                const key = await jose.importJWK(payload.sub_jwk, header.alg);
                assert.equal(key.type, "public");
                keys = [
                    {
                        keyObject: key
                    }
                ];
            } catch (err) {
                throw new RPError({
                    message: "failed to use sub_jwk claim as an asymmetric JSON Web Key",
                    jwt
                });
            }
            if (await jose.calculateJwkThumbprint(payload.sub_jwk) !== payload.sub) {
                throw new RPError({
                    message: "failed to match the subject with sub_jwk",
                    jwt
                });
            }
        } else if (header.alg.startsWith("HS")) {
            keys = [
                this.secretForAlg(header.alg)
            ];
        } else if (header.alg !== "none") {
            keys = await queryKeyStore.call(this.issuer, {
                ...header,
                use: "sig"
            });
        }
        if (!keys && header.alg === "none") {
            return {
                protected: header,
                payload
            };
        }
        for (const key of keys){
            const verified = await jose.compactVerify(jwt, key instanceof Uint8Array ? key : key.keyObject).catch(()=>{});
            if (verified) {
                return {
                    payload,
                    protected: verified.protectedHeader,
                    key
                };
            }
        }
        throw new RPError({
            message: "failed to validate JWT signature",
            jwt
        });
    }
    async refresh(refreshToken, { exchangeBody , clientAssertionPayload , DPoP  } = {}) {
        let token = refreshToken;
        if (token instanceof TokenSet) {
            if (!token.refresh_token) {
                throw new TypeError("refresh_token not present in TokenSet");
            }
            token = token.refresh_token;
        }
        const tokenset = await this.grant({
            ...exchangeBody,
            grant_type: "refresh_token",
            refresh_token: String(token)
        }, {
            clientAssertionPayload,
            DPoP
        });
        if (tokenset.id_token) {
            await this.decryptIdToken(tokenset);
            await this.validateIdToken(tokenset, skipNonceCheck, "token", skipMaxAgeCheck);
            if (refreshToken instanceof TokenSet && refreshToken.id_token) {
                const expectedSub = refreshToken.claims().sub;
                const actualSub = tokenset.claims().sub;
                if (actualSub !== expectedSub) {
                    throw new RPError({
                        printf: [
                            "sub mismatch, expected %s, got: %s",
                            expectedSub,
                            actualSub
                        ],
                        jwt: tokenset.id_token
                    });
                }
            }
        }
        return tokenset;
    }
    async requestResource(resourceUrl, accessToken, { method , headers , body , DPoP , tokenType =DPoP ? "DPoP" : accessToken instanceof TokenSet ? accessToken.token_type : "Bearer"  } = {}, retry) {
        if (accessToken instanceof TokenSet) {
            if (!accessToken.access_token) {
                throw new TypeError("access_token not present in TokenSet");
            }
            accessToken = accessToken.access_token;
        }
        if (!accessToken) {
            throw new TypeError("no access token provided");
        } else if (typeof accessToken !== "string") {
            throw new TypeError("invalid access token provided");
        }
        const requestOpts = {
            headers: {
                Authorization: authorizationHeaderValue(accessToken, tokenType),
                ...headers
            },
            body
        };
        const mTLS = !!this.tls_client_certificate_bound_access_tokens;
        const response = await request.call(this, {
            ...requestOpts,
            responseType: "buffer",
            method,
            url: resourceUrl
        }, {
            accessToken,
            mTLS,
            DPoP
        });
        const wwwAuthenticate = response.headers["www-authenticate"];
        if (retry !== retryAttempt && wwwAuthenticate && wwwAuthenticate.toLowerCase().startsWith("dpop ") && parseWwwAuthenticate(wwwAuthenticate).error === "use_dpop_nonce") {
            return this.requestResource(resourceUrl, accessToken, {
                method,
                headers,
                body,
                DPoP,
                tokenType
            });
        }
        return response;
    }
    async userinfo(accessToken, { method ="GET" , via ="header" , tokenType , params , DPoP  } = {}) {
        assertIssuerConfiguration(this.issuer, "userinfo_endpoint");
        const options = {
            tokenType,
            method: String(method).toUpperCase(),
            DPoP
        };
        if (options.method !== "GET" && options.method !== "POST") {
            throw new TypeError("#userinfo() method can only be POST or a GET");
        }
        if (via === "body" && options.method !== "POST") {
            throw new TypeError("can only send body on POST");
        }
        const jwt = !!(this.userinfo_signed_response_alg || this.userinfo_encrypted_response_alg);
        if (jwt) {
            options.headers = {
                Accept: "application/jwt"
            };
        } else {
            options.headers = {
                Accept: "application/json"
            };
        }
        const mTLS = !!this.tls_client_certificate_bound_access_tokens;
        let targetUrl;
        if (mTLS && this.issuer.mtls_endpoint_aliases) {
            targetUrl = this.issuer.mtls_endpoint_aliases.userinfo_endpoint;
        }
        targetUrl = new url.URL(targetUrl || this.issuer.userinfo_endpoint);
        if (via === "body") {
            options.headers.Authorization = undefined;
            options.headers["Content-Type"] = "application/x-www-form-urlencoded";
            options.body = new url.URLSearchParams();
            options.body.append("access_token", accessToken instanceof TokenSet ? accessToken.access_token : accessToken);
        }
        // handle additional parameters, GET via querystring, POST via urlencoded body
        if (params) {
            if (options.method === "GET") {
                Object.entries(params).forEach(([key, value])=>{
                    targetUrl.searchParams.append(key, value);
                });
            } else if (options.body) {
                // POST && via body
                Object.entries(params).forEach(([key, value])=>{
                    options.body.append(key, value);
                });
            } else {
                // POST && via header
                options.body = new url.URLSearchParams();
                options.headers["Content-Type"] = "application/x-www-form-urlencoded";
                Object.entries(params).forEach(([key, value])=>{
                    options.body.append(key, value);
                });
            }
        }
        if (options.body) {
            options.body = options.body.toString();
        }
        const response = await this.requestResource(targetUrl, accessToken, options);
        let parsed = processResponse(response, {
            bearer: true
        });
        if (jwt) {
            if (!/^application\/jwt/.test(response.headers["content-type"])) {
                throw new RPError({
                    message: "expected application/jwt response from the userinfo_endpoint",
                    response
                });
            }
            const body = response.body.toString();
            const userinfo = await this.decryptJWTUserinfo(body);
            if (!this.userinfo_signed_response_alg) {
                try {
                    parsed = JSON.parse(userinfo);
                    assert(isPlainObject(parsed));
                } catch (err) {
                    throw new RPError({
                        message: "failed to parse userinfo JWE payload as JSON",
                        jwt: userinfo
                    });
                }
            } else {
                ({ payload: parsed  } = await this.validateJWTUserinfo(userinfo));
            }
        } else {
            try {
                parsed = JSON.parse(response.body);
            } catch (err) {
                Object.defineProperty(err, "response", {
                    value: response
                });
                throw err;
            }
        }
        if (accessToken instanceof TokenSet && accessToken.id_token) {
            const expectedSub = accessToken.claims().sub;
            if (parsed.sub !== expectedSub) {
                throw new RPError({
                    printf: [
                        "userinfo sub mismatch, expected %s, got: %s",
                        expectedSub,
                        parsed.sub
                    ],
                    body: parsed,
                    jwt: accessToken.id_token
                });
            }
        }
        return parsed;
    }
    encryptionSecret(len) {
        const hash = len <= 256 ? "sha256" : len <= 384 ? "sha384" : len <= 512 ? "sha512" : false;
        if (!hash) {
            throw new Error("unsupported symmetric encryption key derivation");
        }
        return crypto.createHash(hash).update(this.client_secret).digest().slice(0, len / 8);
    }
    secretForAlg(alg) {
        if (!this.client_secret) {
            throw new TypeError("client_secret is required");
        }
        if (/^A(\d{3})(?:GCM)?KW$/.test(alg)) {
            return this.encryptionSecret(parseInt(RegExp.$1, 10));
        }
        if (/^A(\d{3})(?:GCM|CBC-HS(\d{3}))$/.test(alg)) {
            return this.encryptionSecret(parseInt(RegExp.$2 || RegExp.$1, 10));
        }
        return new TextEncoder().encode(this.client_secret);
    }
    async grant(body, { clientAssertionPayload , DPoP  } = {}, retry) {
        assertIssuerConfiguration(this.issuer, "token_endpoint");
        const response = await authenticatedPost.call(this, "token", {
            form: body,
            responseType: "json"
        }, {
            clientAssertionPayload,
            DPoP
        });
        let responseBody;
        try {
            responseBody = processResponse(response);
        } catch (err) {
            if (retry !== retryAttempt && err instanceof OPError && err.error === "use_dpop_nonce") {
                return this.grant(body, {
                    clientAssertionPayload,
                    DPoP
                }, retryAttempt);
            }
            throw err;
        }
        return new TokenSet(responseBody);
    }
    async deviceAuthorization(params = {}, { exchangeBody , clientAssertionPayload , DPoP  } = {}) {
        assertIssuerConfiguration(this.issuer, "device_authorization_endpoint");
        assertIssuerConfiguration(this.issuer, "token_endpoint");
        const body = authorizationParams.call(this, {
            client_id: this.client_id,
            redirect_uri: null,
            response_type: null,
            ...params
        });
        const response = await authenticatedPost.call(this, "device_authorization", {
            responseType: "json",
            form: body
        }, {
            clientAssertionPayload,
            endpointAuthMethod: "token"
        });
        const responseBody = processResponse(response);
        return new DeviceFlowHandle({
            client: this,
            exchangeBody,
            clientAssertionPayload,
            response: responseBody,
            maxAge: params.max_age,
            DPoP
        });
    }
    async revoke(token, hint, { revokeBody , clientAssertionPayload  } = {}) {
        assertIssuerConfiguration(this.issuer, "revocation_endpoint");
        if (hint !== undefined && typeof hint !== "string") {
            throw new TypeError("hint must be a string");
        }
        const form = {
            ...revokeBody,
            token
        };
        if (hint) {
            form.token_type_hint = hint;
        }
        const response = await authenticatedPost.call(this, "revocation", {
            form
        }, {
            clientAssertionPayload
        });
        processResponse(response, {
            body: false
        });
    }
    async introspect(token, hint, { introspectBody , clientAssertionPayload  } = {}) {
        assertIssuerConfiguration(this.issuer, "introspection_endpoint");
        if (hint !== undefined && typeof hint !== "string") {
            throw new TypeError("hint must be a string");
        }
        const form = {
            ...introspectBody,
            token
        };
        if (hint) {
            form.token_type_hint = hint;
        }
        const response = await authenticatedPost.call(this, "introspection", {
            form,
            responseType: "json"
        }, {
            clientAssertionPayload
        });
        const responseBody = processResponse(response);
        return responseBody;
    }
    static async register(metadata, options = {}) {
        const { initialAccessToken , jwks , ...clientOptions } = options;
        assertIssuerConfiguration(this.issuer, "registration_endpoint");
        if (jwks !== undefined && !(metadata.jwks || metadata.jwks_uri)) {
            const keystore = await getKeystore.call(this, jwks);
            metadata.jwks = keystore.toJWKS();
        }
        const response = await request.call(this, {
            headers: {
                Accept: "application/json",
                ...initialAccessToken ? {
                    Authorization: authorizationHeaderValue(initialAccessToken)
                } : undefined
            },
            responseType: "json",
            json: metadata,
            url: this.issuer.registration_endpoint,
            method: "POST"
        });
        const responseBody = processResponse(response, {
            statusCode: 201,
            bearer: true
        });
        return new this(responseBody, jwks, clientOptions);
    }
    get metadata() {
        return clone(Object.fromEntries(this.#metadata.entries()));
    }
    static async fromUri(registrationClientUri, registrationAccessToken, jwks, clientOptions) {
        const response = await request.call(this, {
            method: "GET",
            url: registrationClientUri,
            responseType: "json",
            headers: {
                Authorization: authorizationHeaderValue(registrationAccessToken),
                Accept: "application/json"
            }
        });
        const responseBody = processResponse(response, {
            bearer: true
        });
        return new this(responseBody, jwks, clientOptions);
    }
    async requestObject(requestObject = {}, { sign: signingAlgorithm = this.request_object_signing_alg || "none" , encrypt: { alg: eKeyManagement = this.request_object_encryption_alg , enc: eContentEncryption = this.request_object_encryption_enc || "A128CBC-HS256"  } = {}  } = {}) {
        if (!isPlainObject(requestObject)) {
            throw new TypeError("requestObject must be a plain object");
        }
        let signed;
        let key;
        const unix = now();
        const header = {
            alg: signingAlgorithm,
            typ: "oauth-authz-req+jwt"
        };
        const payload = JSON.stringify(defaults({}, requestObject, {
            iss: this.client_id,
            aud: this.issuer.issuer,
            client_id: this.client_id,
            jti: random(),
            iat: unix,
            exp: unix + 300,
            ...this.fapi() ? {
                nbf: unix
            } : undefined
        }));
        if (signingAlgorithm === "none") {
            signed = [
                base64url.encode(JSON.stringify(header)),
                base64url.encode(payload),
                ""
            ].join(".");
        } else {
            const symmetric = signingAlgorithm.startsWith("HS");
            if (symmetric) {
                key = this.secretForAlg(signingAlgorithm);
            } else {
                const keystore = await keystores.get(this);
                if (!keystore) {
                    throw new TypeError(`no keystore present for client, cannot sign using alg ${signingAlgorithm}`);
                }
                key = keystore.get({
                    alg: signingAlgorithm,
                    use: "sig"
                });
                if (!key) {
                    throw new TypeError(`no key to sign with found for alg ${signingAlgorithm}`);
                }
            }
            signed = await new jose.CompactSign(new TextEncoder().encode(payload)).setProtectedHeader({
                ...header,
                kid: symmetric ? undefined : key.jwk.kid
            }).sign(symmetric ? key : key.keyObject);
        }
        if (!eKeyManagement) {
            return signed;
        }
        const fields = {
            alg: eKeyManagement,
            enc: eContentEncryption,
            cty: "oauth-authz-req+jwt"
        };
        if (fields.alg.match(/^(RSA|ECDH)/)) {
            [key] = await queryKeyStore.call(this.issuer, {
                alg: fields.alg,
                use: "enc"
            }, {
                allowMulti: true
            });
        } else {
            key = this.secretForAlg(fields.alg === "dir" ? fields.enc : fields.alg);
        }
        return new jose.CompactEncrypt(new TextEncoder().encode(signed)).setProtectedHeader({
            ...fields,
            kid: key instanceof Uint8Array ? undefined : key.jwk.kid
        }).encrypt(key instanceof Uint8Array ? key : key.keyObject);
    }
    async pushedAuthorizationRequest(params = {}, { clientAssertionPayload  } = {}) {
        assertIssuerConfiguration(this.issuer, "pushed_authorization_request_endpoint");
        const body = {
            ..."request" in params ? params : authorizationParams.call(this, params),
            client_id: this.client_id
        };
        const response = await authenticatedPost.call(this, "pushed_authorization_request", {
            responseType: "json",
            form: body
        }, {
            clientAssertionPayload,
            endpointAuthMethod: "token"
        });
        const responseBody = processResponse(response, {
            statusCode: 201
        });
        if (!("expires_in" in responseBody)) {
            throw new RPError({
                message: "expected expires_in in Pushed Authorization Successful Response",
                response
            });
        }
        if (typeof responseBody.expires_in !== "number") {
            throw new RPError({
                message: "invalid expires_in value in Pushed Authorization Successful Response",
                response
            });
        }
        if (!("request_uri" in responseBody)) {
            throw new RPError({
                message: "expected request_uri in Pushed Authorization Successful Response",
                response
            });
        }
        if (typeof responseBody.request_uri !== "string") {
            throw new RPError({
                message: "invalid request_uri value in Pushed Authorization Successful Response",
                response
            });
        }
        return responseBody;
    }
    get issuer() {
        return this.#issuer;
    }
    /* istanbul ignore next */ [inspect.custom]() {
        return `${this.constructor.name} ${inspect(this.metadata, {
            depth: Infinity,
            colors: process.stdout.isTTY,
            compact: false,
            sorted: true
        })}`;
    }
    fapi() {
        return this.constructor.name === "FAPI1Client";
    }
    async validateJARM(response) {
        const expectedAlg = this.authorization_signed_response_alg;
        const { payload  } = await this.validateJWT(response, expectedAlg, [
            "iss",
            "exp",
            "aud"
        ]);
        return pickCb(payload);
    }
}
const RSPS = /^(?:RS|PS)(?:256|384|512)$/;
function determineRsaAlgorithm(privateKey, privateKeyInput, valuesSupported) {
    if (typeof privateKeyInput === "object" && typeof privateKeyInput.key === "object" && privateKeyInput.key.alg) {
        return privateKeyInput.key.alg;
    }
    if (Array.isArray(valuesSupported)) {
        let candidates = valuesSupported.filter(RegExp.prototype.test.bind(RSPS));
        if (privateKey.asymmetricKeyType === "rsa-pss") {
            candidates = candidates.filter((value)=>value.startsWith("PS"));
        }
        return [
            "PS256",
            "PS384",
            "PS512",
            "RS256",
            "RS384",
            "RS384"
        ].find((preferred)=>candidates.includes(preferred));
    }
    return "PS256";
}
const p256 = Buffer.from([
    42,
    134,
    72,
    206,
    61,
    3,
    1,
    7
]);
const p384 = Buffer.from([
    43,
    129,
    4,
    0,
    34
]);
const p521 = Buffer.from([
    43,
    129,
    4,
    0,
    35
]);
const secp256k1 = Buffer.from([
    43,
    129,
    4,
    0,
    10
]);
function determineEcAlgorithm(privateKey, privateKeyInput) {
    // If input was a JWK
    switch(typeof privateKeyInput === "object" && typeof privateKeyInput.key === "object" && privateKeyInput.key.crv){
        case "P-256":
            return "ES256";
        case "secp256k1":
            return "ES256K";
        case "P-384":
            return "ES384";
        case "P-512":
            return "ES512";
        default:
            break;
    }
    const buf = privateKey.export({
        format: "der",
        type: "pkcs8"
    });
    const i = buf[1] < 128 ? 17 : 18;
    const len = buf[i];
    const curveOid = buf.slice(i + 1, i + 1 + len);
    if (curveOid.equals(p256)) {
        return "ES256";
    }
    if (curveOid.equals(p384)) {
        return "ES384";
    }
    if (curveOid.equals(p521)) {
        return "ES512";
    }
    if (curveOid.equals(secp256k1)) {
        return "ES256K";
    }
    throw new TypeError("unsupported DPoP private key curve");
}
const jwkCache = new WeakMap();
async function getJwk(privateKey, privateKeyInput) {
    if (typeof privateKeyInput === "object" && typeof privateKeyInput.key === "object" && privateKeyInput.key.crv) {
        return pick(privateKeyInput.key, "kty", "crv", "x", "y", "e", "n");
    }
    if (jwkCache.has(privateKeyInput)) {
        return jwkCache.get(privateKeyInput);
    }
    const jwk = pick(await jose.exportJWK(privateKey), "kty", "crv", "x", "y", "e", "n");
    if (isKeyObject(privateKeyInput)) {
        jwkCache.set(privateKeyInput, jwk);
    }
    return jwk;
}
/**
 * @name dpopProof
 * @api private
 */ async function dpopProof(payload, privateKeyInput, accessToken) {
    if (!isPlainObject(payload)) {
        throw new TypeError("payload must be a plain object");
    }
    let privateKey;
    if (isKeyObject(privateKeyInput)) {
        privateKey = privateKeyInput;
    } else {
        privateKey = crypto.createPrivateKey(privateKeyInput);
    }
    if (privateKey.type !== "private") {
        throw new TypeError('"DPoP" option must be a private key');
    }
    let alg;
    switch(privateKey.asymmetricKeyType){
        case "ed25519":
        case "ed448":
            alg = "EdDSA";
            break;
        case "ec":
            alg = determineEcAlgorithm(privateKey, privateKeyInput);
            break;
        case "rsa":
        case rsaPssParams && "rsa-pss":
            alg = determineRsaAlgorithm(privateKey, privateKeyInput, this.issuer.dpop_signing_alg_values_supported);
            break;
        default:
            throw new TypeError("unsupported DPoP private key asymmetric key type");
    }
    if (!alg) {
        throw new TypeError("could not determine DPoP JWS Algorithm");
    }
    return new jose.SignJWT({
        ath: accessToken ? base64url.encode(crypto.createHash("sha256").update(accessToken).digest()) : undefined,
        ...payload
    }).setProtectedHeader({
        alg,
        typ: "dpop+jwt",
        jwk: await getJwk(privateKey, privateKeyInput)
    }).setIssuedAt().setJti(random()).sign(privateKey);
}
Object.defineProperty(BaseClient.prototype, "dpopProof", {
    enumerable: true,
    configurable: true,
    value (...args) {
        process.emitWarning("The DPoP APIs implements an IETF draft (https://www.ietf.org/archive/id/draft-ietf-oauth-dpop-04.html). Breaking draft implementations are included as minor versions of the openid-client library, therefore, the ~ semver operator should be used and close attention be payed to library changelog as well as the drafts themselves.", "DraftWarning");
        Object.defineProperty(BaseClient.prototype, "dpopProof", {
            enumerable: true,
            configurable: true,
            value: dpopProof
        });
        return this.dpopProof(...args);
    }
});
module.exports = (issuer, aadIssValidation = false)=>class Client extends BaseClient {
        constructor(...args){
            super(issuer, aadIssValidation, ...args);
        }
        static get issuer() {
            return issuer;
        }
    };
module.exports.BaseClient = BaseClient;


/***/ }),

/***/ 4198:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const { inspect  } = __webpack_require__(3837);
const { RPError , OPError  } = __webpack_require__(9244);
const now = __webpack_require__(7373);
class DeviceFlowHandle {
    #aborted;
    #client;
    #clientAssertionPayload;
    #DPoP;
    #exchangeBody;
    #expires_at;
    #interval;
    #maxAge;
    #response;
    constructor({ client , exchangeBody , clientAssertionPayload , response , maxAge , DPoP  }){
        [
            "verification_uri",
            "user_code",
            "device_code"
        ].forEach((prop)=>{
            if (typeof response[prop] !== "string" || !response[prop]) {
                throw new RPError(`expected ${prop} string to be returned by Device Authorization Response, got %j`, response[prop]);
            }
        });
        if (!Number.isSafeInteger(response.expires_in)) {
            throw new RPError("expected expires_in number to be returned by Device Authorization Response, got %j", response.expires_in);
        }
        this.#expires_at = now() + response.expires_in;
        this.#client = client;
        this.#DPoP = DPoP;
        this.#maxAge = maxAge;
        this.#exchangeBody = exchangeBody;
        this.#clientAssertionPayload = clientAssertionPayload;
        this.#response = response;
        this.#interval = response.interval * 1000 || 5000;
    }
    abort() {
        this.#aborted = true;
    }
    async poll({ signal  } = {}) {
        if (signal && signal.aborted || this.#aborted) {
            throw new RPError("polling aborted");
        }
        if (this.expired()) {
            throw new RPError("the device code %j has expired and the device authorization session has concluded", this.device_code);
        }
        await new Promise((resolve)=>setTimeout(resolve, this.#interval));
        let tokenset;
        try {
            tokenset = await this.#client.grant({
                ...this.#exchangeBody,
                grant_type: "urn:ietf:params:oauth:grant-type:device_code",
                device_code: this.device_code
            }, {
                clientAssertionPayload: this.#clientAssertionPayload,
                DPoP: this.#DPoP
            });
        } catch (err) {
            switch(err instanceof OPError && err.error){
                case "slow_down":
                    this.#interval += 5000;
                case "authorization_pending":
                    return this.poll({
                        signal
                    });
                default:
                    throw err;
            }
        }
        if ("id_token" in tokenset) {
            await this.#client.decryptIdToken(tokenset);
            await this.#client.validateIdToken(tokenset, undefined, "token", this.#maxAge);
        }
        return tokenset;
    }
    get device_code() {
        return this.#response.device_code;
    }
    get user_code() {
        return this.#response.user_code;
    }
    get verification_uri() {
        return this.#response.verification_uri;
    }
    get verification_uri_complete() {
        return this.#response.verification_uri_complete;
    }
    get expires_in() {
        return Math.max.apply(null, [
            this.#expires_at - now(),
            0
        ]);
    }
    expired() {
        return this.expires_in === 0;
    }
    /* istanbul ignore next */ [inspect.custom]() {
        return `${this.constructor.name} ${inspect(this.#response, {
            depth: Infinity,
            colors: process.stdout.isTTY,
            compact: false,
            sorted: true
        })}`;
    }
}
module.exports = DeviceFlowHandle;


/***/ }),

/***/ 9244:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const { format  } = __webpack_require__(3837);
class OPError extends Error {
    constructor({ error_description , error , error_uri , session_state , state , scope  }, response){
        super(!error_description ? error : `${error} (${error_description})`);
        Object.assign(this, {
            error
        }, error_description && {
            error_description
        }, error_uri && {
            error_uri
        }, state && {
            state
        }, scope && {
            scope
        }, session_state && {
            session_state
        });
        if (response) {
            Object.defineProperty(this, "response", {
                value: response
            });
        }
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
class RPError extends Error {
    constructor(...args){
        if (typeof args[0] === "string") {
            super(format(...args));
        } else {
            const { message , printf , response , ...rest } = args[0];
            if (printf) {
                super(format(...printf));
            } else {
                super(message);
            }
            Object.assign(this, rest);
            if (response) {
                Object.defineProperty(this, "response", {
                    value: response
                });
            }
        }
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = {
    OPError,
    RPError
};


/***/ }),

/***/ 1910:
/***/ ((module) => {

"use strict";

function assertSigningAlgValuesSupport(endpoint, issuer, properties) {
    if (!issuer[`${endpoint}_endpoint`]) return;
    const eam = `${endpoint}_endpoint_auth_method`;
    const easa = `${endpoint}_endpoint_auth_signing_alg`;
    const easavs = `${endpoint}_endpoint_auth_signing_alg_values_supported`;
    if (properties[eam] && properties[eam].endsWith("_jwt") && !properties[easa] && !issuer[easavs]) {
        throw new TypeError(`${easavs} must be configured on the issuer if ${easa} is not defined on a client`);
    }
}
function assertIssuerConfiguration(issuer, endpoint) {
    if (!issuer[endpoint]) {
        throw new TypeError(`${endpoint} must be configured on the issuer`);
    }
}
module.exports = {
    assertSigningAlgValuesSupport,
    assertIssuerConfiguration
};


/***/ }),

/***/ 7882:
/***/ ((module) => {

"use strict";

let encode;
if (Buffer.isEncoding("base64url")) {
    encode = (input, encoding = "utf8")=>Buffer.from(input, encoding).toString("base64url");
} else {
    const fromBase64 = (base64)=>base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    encode = (input, encoding = "utf8")=>fromBase64(Buffer.from(input, encoding).toString("base64"));
}
const decode = (input)=>Buffer.from(input, "base64");
module.exports.decode = decode;
module.exports.encode = encode;


/***/ }),

/***/ 2716:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const jose = __webpack_require__(5922);
const { RPError  } = __webpack_require__(9244);
const { assertIssuerConfiguration  } = __webpack_require__(1910);
const { random  } = __webpack_require__(8734);
const now = __webpack_require__(7373);
const request = __webpack_require__(724);
const { keystores  } = __webpack_require__(9257);
const merge = __webpack_require__(7612);
const formUrlEncode = (value)=>encodeURIComponent(value).replace(/%20/g, "+");
async function clientAssertion(endpoint, payload) {
    let alg = this[`${endpoint}_endpoint_auth_signing_alg`];
    if (!alg) {
        assertIssuerConfiguration(this.issuer, `${endpoint}_endpoint_auth_signing_alg_values_supported`);
    }
    if (this[`${endpoint}_endpoint_auth_method`] === "client_secret_jwt") {
        if (!alg) {
            const supported = this.issuer[`${endpoint}_endpoint_auth_signing_alg_values_supported`];
            alg = Array.isArray(supported) && supported.find((signAlg)=>/^HS(?:256|384|512)/.test(signAlg));
        }
        if (!alg) {
            throw new RPError(`failed to determine a JWS Algorithm to use for ${this[`${endpoint}_endpoint_auth_method`]} Client Assertion`);
        }
        return new jose.CompactSign(Buffer.from(JSON.stringify(payload))).setProtectedHeader({
            alg
        }).sign(this.secretForAlg(alg));
    }
    const keystore = await keystores.get(this);
    if (!keystore) {
        throw new TypeError("no client jwks provided for signing a client assertion with");
    }
    if (!alg) {
        const supported = this.issuer[`${endpoint}_endpoint_auth_signing_alg_values_supported`];
        alg = Array.isArray(supported) && supported.find((signAlg)=>keystore.get({
                alg: signAlg,
                use: "sig"
            }));
    }
    if (!alg) {
        throw new RPError(`failed to determine a JWS Algorithm to use for ${this[`${endpoint}_endpoint_auth_method`]} Client Assertion`);
    }
    const key = keystore.get({
        alg,
        use: "sig"
    });
    if (!key) {
        throw new RPError(`no key found in client jwks to sign a client assertion with using alg ${alg}`);
    }
    return new jose.CompactSign(Buffer.from(JSON.stringify(payload))).setProtectedHeader({
        alg,
        kid: key.jwk && key.jwk.kid
    }).sign(key.keyObject);
}
async function authFor(endpoint, { clientAssertionPayload  } = {}) {
    const authMethod = this[`${endpoint}_endpoint_auth_method`];
    switch(authMethod){
        case "self_signed_tls_client_auth":
        case "tls_client_auth":
        case "none":
            return {
                form: {
                    client_id: this.client_id
                }
            };
        case "client_secret_post":
            if (typeof this.client_secret !== "string") {
                throw new TypeError("client_secret_post client authentication method requires a client_secret");
            }
            return {
                form: {
                    client_id: this.client_id,
                    client_secret: this.client_secret
                }
            };
        case "private_key_jwt":
        case "client_secret_jwt":
            {
                const timestamp = now();
                const audience = [
                    ...new Set([
                        this.issuer.issuer,
                        this.issuer.token_endpoint
                    ].filter(Boolean))
                ];
                const assertion = await clientAssertion.call(this, endpoint, {
                    iat: timestamp,
                    exp: timestamp + 60,
                    jti: random(),
                    iss: this.client_id,
                    sub: this.client_id,
                    aud: audience,
                    ...clientAssertionPayload
                });
                return {
                    form: {
                        client_id: this.client_id,
                        client_assertion: assertion,
                        client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"
                    }
                };
            }
        case "client_secret_basic":
            {
                // This is correct behaviour, see https://tools.ietf.org/html/rfc6749#section-2.3.1 and the
                // related appendix. (also https://github.com/panva/node-openid-client/pull/91)
                // > The client identifier is encoded using the
                // > "application/x-www-form-urlencoded" encoding algorithm per
                // > Appendix B, and the encoded value is used as the username; the client
                // > password is encoded using the same algorithm and used as the
                // > password.
                if (typeof this.client_secret !== "string") {
                    throw new TypeError("client_secret_basic client authentication method requires a client_secret");
                }
                const encoded = `${formUrlEncode(this.client_id)}:${formUrlEncode(this.client_secret)}`;
                const value = Buffer.from(encoded).toString("base64");
                return {
                    headers: {
                        Authorization: `Basic ${value}`
                    }
                };
            }
        default:
            {
                throw new TypeError(`missing, or unsupported, ${endpoint}_endpoint_auth_method`);
            }
    }
}
function resolveResponseType() {
    const { length , 0: value  } = this.response_types;
    if (length === 1) {
        return value;
    }
    return undefined;
}
function resolveRedirectUri() {
    const { length , 0: value  } = this.redirect_uris || [];
    if (length === 1) {
        return value;
    }
    return undefined;
}
async function authenticatedPost(endpoint, opts, { clientAssertionPayload , endpointAuthMethod =endpoint , DPoP  } = {}) {
    const auth = await authFor.call(this, endpointAuthMethod, {
        clientAssertionPayload
    });
    const requestOpts = merge(opts, auth);
    const mTLS = this[`${endpointAuthMethod}_endpoint_auth_method`].includes("tls_client_auth") || endpoint === "token" && this.tls_client_certificate_bound_access_tokens;
    let targetUrl;
    if (mTLS && this.issuer.mtls_endpoint_aliases) {
        targetUrl = this.issuer.mtls_endpoint_aliases[`${endpoint}_endpoint`];
    }
    targetUrl = targetUrl || this.issuer[`${endpoint}_endpoint`];
    if ("form" in requestOpts) {
        for (const [key, value] of Object.entries(requestOpts.form)){
            if (typeof value === "undefined") {
                delete requestOpts.form[key];
            }
        }
    }
    return request.call(this, {
        ...requestOpts,
        method: "POST",
        url: targetUrl,
        headers: {
            ...endpoint !== "revocation" ? {
                Accept: "application/json"
            } : undefined,
            ...requestOpts.headers
        }
    }, {
        mTLS,
        DPoP
    });
}
module.exports = {
    resolveResponseType,
    resolveRedirectUri,
    authFor,
    authenticatedPost
};


/***/ }),

/***/ 5261:
/***/ ((module) => {

"use strict";

const HTTP_OPTIONS = Symbol();
const CLOCK_TOLERANCE = Symbol();
module.exports = {
    CLOCK_TOLERANCE,
    HTTP_OPTIONS
};


/***/ }),

/***/ 2623:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const base64url = __webpack_require__(7882);
module.exports = (token)=>{
    if (typeof token !== "string" || !token) {
        throw new TypeError("JWT must be a string");
    }
    const { 0: header , 1: payload , 2: signature , length  } = token.split(".");
    if (length === 5) {
        throw new TypeError("encrypted JWTs cannot be decoded");
    }
    if (length !== 3) {
        throw new Error("JWTs must have three components");
    }
    try {
        return {
            header: JSON.parse(base64url.decode(header)),
            payload: JSON.parse(base64url.decode(payload)),
            signature
        };
    } catch (err) {
        throw new Error("JWT is malformed");
    }
};


/***/ }),

/***/ 2984:
/***/ ((module) => {

"use strict";

module.exports = globalThis.structuredClone || ((obj)=>JSON.parse(JSON.stringify(obj)));


/***/ }),

/***/ 5547:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const isPlainObject = __webpack_require__(1101);
function defaults(deep, target, ...sources) {
    for (const source of sources){
        if (!isPlainObject(source)) {
            continue;
        }
        for (const [key, value] of Object.entries(source)){
            /* istanbul ignore if */ if (key === "__proto__" || key === "constructor") {
                continue;
            }
            if (typeof target[key] === "undefined" && typeof value !== "undefined") {
                target[key] = value;
            }
            if (deep && isPlainObject(target[key]) && isPlainObject(value)) {
                defaults(true, target[key], value);
            }
        }
    }
    return target;
}
module.exports = defaults.bind(undefined, false);
module.exports.deep = defaults.bind(undefined, true);


/***/ }),

/***/ 8734:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const { createHash , randomBytes  } = __webpack_require__(6113);
const base64url = __webpack_require__(7882);
const random = (bytes = 32)=>base64url.encode(randomBytes(bytes));
module.exports = {
    random,
    state: random,
    nonce: random,
    codeVerifier: random,
    codeChallenge: (codeVerifier)=>base64url.encode(createHash("sha256").update(codeVerifier).digest())
};


/***/ }),

/***/ 3048:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const util = __webpack_require__(3837);
const crypto = __webpack_require__(6113);
module.exports = util.types.isKeyObject || ((obj)=>obj && obj instanceof crypto.KeyObject);


/***/ }),

/***/ 1101:
/***/ ((module) => {

"use strict";

module.exports = (a)=>!!a && a.constructor === Object;


/***/ }),

/***/ 8705:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const objectHash = __webpack_require__(2705);
const LRU = __webpack_require__(9814);
const { RPError  } = __webpack_require__(9244);
const { assertIssuerConfiguration  } = __webpack_require__(1910);
const KeyStore = __webpack_require__(707);
const { keystores  } = __webpack_require__(9257);
const processResponse = __webpack_require__(6381);
const request = __webpack_require__(724);
const inFlight = new WeakMap();
const caches = new WeakMap();
const lrus = (ctx)=>{
    if (!caches.has(ctx)) {
        caches.set(ctx, new LRU({
            max: 100
        }));
    }
    return caches.get(ctx);
};
async function getKeyStore(reload = false) {
    assertIssuerConfiguration(this, "jwks_uri");
    const keystore = keystores.get(this);
    const cache = lrus(this);
    if (reload || !keystore) {
        if (inFlight.has(this)) {
            return inFlight.get(this);
        }
        cache.reset();
        inFlight.set(this, (async ()=>{
            const response = await request.call(this, {
                method: "GET",
                responseType: "json",
                url: this.jwks_uri,
                headers: {
                    Accept: "application/json, application/jwk-set+json"
                }
            }).finally(()=>{
                inFlight.delete(this);
            });
            const jwks = processResponse(response);
            const joseKeyStore = KeyStore.fromJWKS(jwks, {
                onlyPublic: true
            });
            cache.set("throttle", true, 60 * 1000);
            keystores.set(this, joseKeyStore);
            return joseKeyStore;
        })());
        return inFlight.get(this);
    }
    return keystore;
}
async function queryKeyStore({ kid , kty , alg , use  }, { allowMulti =false  } = {}) {
    const cache = lrus(this);
    const def = {
        kid,
        kty,
        alg,
        use
    };
    const defHash = objectHash(def, {
        algorithm: "sha256",
        ignoreUnknown: true,
        unorderedArrays: true,
        unorderedSets: true
    });
    // refresh keystore on every unknown key but also only upto once every minute
    const freshJwksUri = cache.get(defHash) || cache.get("throttle");
    const keystore = await getKeyStore.call(this, !freshJwksUri);
    const keys = keystore.all(def);
    delete def.use;
    if (keys.length === 0) {
        throw new RPError({
            printf: [
                "no valid key found in issuer's jwks_uri for key parameters %j",
                def
            ],
            jwks: keystore
        });
    }
    if (!allowMulti && keys.length > 1 && !kid) {
        throw new RPError({
            printf: [
                "multiple matching keys found in issuer's jwks_uri for key parameters %j, kid must be provided in this case",
                def
            ],
            jwks: keystore
        });
    }
    cache.set(defHash, true);
    return keys;
}
module.exports.queryKeyStore = queryKeyStore;
module.exports.keystore = getKeyStore;


/***/ }),

/***/ 707:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const jose = __webpack_require__(5922);
const clone = __webpack_require__(2984);
const isPlainObject = __webpack_require__(1101);
const isKeyObject = __webpack_require__(3048);
const internal = Symbol();
function fauxAlg(kty) {
    switch(kty){
        case "RSA":
            return "RSA-OAEP";
        case "EC":
            return "ECDH-ES";
        case "OKP":
            return "ECDH-ES";
        case "oct":
            return "HS256";
        default:
            return undefined;
    }
}
const keyscore = (key, { alg , use  })=>{
    let score = 0;
    if (alg && key.alg) {
        score++;
    }
    if (use && key.use) {
        score++;
    }
    return score;
};
function getKtyFromAlg(alg) {
    switch(typeof alg === "string" && alg.slice(0, 2)){
        case "RS":
        case "PS":
            return "RSA";
        case "ES":
            return "EC";
        case "Ed":
            return "OKP";
        default:
            return undefined;
    }
}
function getAlgorithms(use, alg, kty, crv) {
    // Ed25519, Ed448, and secp256k1 always have "alg"
    // OKP always has use
    if (alg) {
        return new Set([
            alg
        ]);
    }
    switch(kty){
        case "EC":
            {
                let algs = [];
                if (use === "enc" || use === undefined) {
                    algs = algs.concat([
                        "ECDH-ES",
                        "ECDH-ES+A128KW",
                        "ECDH-ES+A192KW",
                        "ECDH-ES+A256KW"
                    ]);
                }
                if (use === "sig" || use === undefined) {
                    algs = algs.concat([
                        `ES${crv.slice(-3)}`.replace("21", "12")
                    ]);
                }
                return new Set(algs);
            }
        case "OKP":
            {
                return new Set([
                    "ECDH-ES",
                    "ECDH-ES+A128KW",
                    "ECDH-ES+A192KW",
                    "ECDH-ES+A256KW"
                ]);
            }
        case "RSA":
            {
                let algs = [];
                if (use === "enc" || use === undefined) {
                    algs = algs.concat([
                        "RSA-OAEP",
                        "RSA-OAEP-256",
                        "RSA-OAEP-384",
                        "RSA-OAEP-512",
                        "RSA1_5"
                    ]);
                }
                if (use === "sig" || use === undefined) {
                    algs = algs.concat([
                        "PS256",
                        "PS384",
                        "PS512",
                        "RS256",
                        "RS384",
                        "RS512"
                    ]);
                }
                return new Set(algs);
            }
        default:
            throw new Error("unreachable");
    }
}
module.exports = class KeyStore {
    #keys;
    constructor(i, keys){
        if (i !== internal) throw new Error("invalid constructor call");
        this.#keys = keys;
    }
    toJWKS() {
        return {
            keys: this.map(({ jwk: { d , p , q , dp , dq , qi , ...jwk }  })=>jwk)
        };
    }
    all({ alg , kid , use  } = {}) {
        if (!use || !alg) {
            throw new Error();
        }
        const kty = getKtyFromAlg(alg);
        const search = {
            alg,
            use
        };
        return this.filter((key)=>{
            let candidate = true;
            if (candidate && kty !== undefined && key.jwk.kty !== kty) {
                candidate = false;
            }
            if (candidate && kid !== undefined && key.jwk.kid !== kid) {
                candidate = false;
            }
            if (candidate && use !== undefined && key.jwk.use !== undefined && key.jwk.use !== use) {
                candidate = false;
            }
            if (candidate && key.jwk.alg && key.jwk.alg !== alg) {
                candidate = false;
            } else if (!key.algorithms.has(alg)) {
                candidate = false;
            }
            return candidate;
        }).sort((first, second)=>keyscore(second, search) - keyscore(first, search));
    }
    get(...args) {
        return this.all(...args)[0];
    }
    static async fromJWKS(jwks, { onlyPublic =false , onlyPrivate =false  } = {}) {
        if (!isPlainObject(jwks) || !Array.isArray(jwks.keys) || jwks.keys.some((k)=>!isPlainObject(k) || !("kty" in k))) {
            throw new TypeError("jwks must be a JSON Web Key Set formatted object");
        }
        const keys = [];
        for (let jwk of jwks.keys){
            jwk = clone(jwk);
            const { kty , kid , crv  } = jwk;
            let { alg , use  } = jwk;
            if (typeof kty !== "string" || !kty) {
                continue;
            }
            if (use !== undefined && use !== "sig" && use !== "enc") {
                continue;
            }
            if (typeof alg !== "string" && alg !== undefined) {
                continue;
            }
            if (typeof kid !== "string" && kid !== undefined) {
                continue;
            }
            if (kty === "EC" && use === "sig") {
                switch(crv){
                    case "P-256":
                        alg = "ES256";
                        break;
                    case "P-384":
                        alg = "ES384";
                        break;
                    case "P-521":
                        alg = "ES512";
                        break;
                    default:
                        break;
                }
            }
            if (crv === "secp256k1") {
                use = "sig";
                alg = "ES256K";
            }
            if (kty === "OKP") {
                switch(crv){
                    case "Ed25519":
                    case "Ed448":
                        use = "sig";
                        alg = "EdDSA";
                        break;
                    case "X25519":
                    case "X448":
                        use = "enc";
                        break;
                    default:
                        break;
                }
            }
            if (alg && !use) {
                switch(true){
                    case alg.startsWith("ECDH"):
                        use = "enc";
                        break;
                    case alg.startsWith("RSA"):
                        use = "enc";
                        break;
                    default:
                        break;
                }
            }
            const keyObject = await jose.importJWK(jwk, alg || fauxAlg(jwk.kty)).catch(()=>{});
            if (!keyObject) continue;
            if (keyObject instanceof Uint8Array || keyObject.type === "secret") {
                if (onlyPrivate) {
                    throw new Error("jwks must only contain private keys");
                }
                continue;
            }
            if (!isKeyObject(keyObject)) {
                throw new Error("what?!");
            }
            if (onlyPrivate && keyObject.type !== "private") {
                throw new Error("jwks must only contain private keys");
            }
            if (onlyPublic && keyObject.type !== "public") {
                continue;
            }
            if (kty === "RSA" && keyObject.asymmetricKeySize < 2048) {
                continue;
            }
            keys.push({
                jwk: {
                    ...jwk,
                    alg,
                    use
                },
                keyObject,
                get algorithms () {
                    Object.defineProperty(this, "algorithms", {
                        value: getAlgorithms(this.jwk.use, this.jwk.alg, this.jwk.kty, this.jwk.crv),
                        enumerable: true,
                        configurable: false
                    });
                    return this.algorithms;
                }
            });
        }
        return new this(internal, keys);
    }
    filter(...args) {
        return this.#keys.filter(...args);
    }
    find(...args) {
        return this.#keys.find(...args);
    }
    every(...args) {
        return this.#keys.every(...args);
    }
    some(...args) {
        return this.#keys.some(...args);
    }
    map(...args) {
        return this.#keys.map(...args);
    }
    forEach(...args) {
        return this.#keys.forEach(...args);
    }
    reduce(...args) {
        return this.#keys.reduce(...args);
    }
    sort(...args) {
        return this.#keys.sort(...args);
    }
    *[Symbol.iterator]() {
        for (const key of this.#keys){
            yield key;
        }
    }
};


/***/ }),

/***/ 7612:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const isPlainObject = __webpack_require__(1101);
function merge(target, ...sources) {
    for (const source of sources){
        if (!isPlainObject(source)) {
            continue;
        }
        for (const [key, value] of Object.entries(source)){
            /* istanbul ignore if */ if (key === "__proto__" || key === "constructor") {
                continue;
            }
            if (isPlainObject(target[key]) && isPlainObject(value)) {
                target[key] = merge(target[key], value);
            } else if (typeof value !== "undefined") {
                target[key] = value;
            }
        }
    }
    return target;
}
module.exports = merge;


/***/ }),

/***/ 9107:
/***/ ((module) => {

"use strict";

module.exports = function pick(object, ...paths) {
    const obj = {};
    for (const path of paths){
        if (object[path] !== undefined) {
            obj[path] = object[path];
        }
    }
    return obj;
};


/***/ }),

/***/ 6381:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const { STATUS_CODES  } = __webpack_require__(3685);
const { format  } = __webpack_require__(3837);
const { OPError  } = __webpack_require__(9244);
const parseWwwAuthenticate = __webpack_require__(8216);
const throwAuthenticateErrors = (response)=>{
    const params = parseWwwAuthenticate(response.headers["www-authenticate"]);
    if (params.error) {
        throw new OPError(params, response);
    }
};
const isStandardBodyError = (response)=>{
    let result = false;
    try {
        let jsonbody;
        if (typeof response.body !== "object" || Buffer.isBuffer(response.body)) {
            jsonbody = JSON.parse(response.body);
        } else {
            jsonbody = response.body;
        }
        result = typeof jsonbody.error === "string" && jsonbody.error.length;
        if (result) Object.defineProperty(response, "body", {
            value: jsonbody,
            configurable: true
        });
    } catch (err) {}
    return result;
};
function processResponse(response, { statusCode =200 , body =true , bearer =false  } = {}) {
    if (response.statusCode !== statusCode) {
        if (bearer) {
            throwAuthenticateErrors(response);
        }
        if (isStandardBodyError(response)) {
            throw new OPError(response.body, response);
        }
        throw new OPError({
            error: format("expected %i %s, got: %i %s", statusCode, STATUS_CODES[statusCode], response.statusCode, STATUS_CODES[response.statusCode])
        }, response);
    }
    if (body && !response.body) {
        throw new OPError({
            error: format("expected %i %s with body but no body was returned", statusCode, STATUS_CODES[statusCode])
        }, response);
    }
    return response.body;
}
module.exports = processResponse;


/***/ }),

/***/ 724:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const assert = __webpack_require__(9491);
const querystring = __webpack_require__(3477);
const http = __webpack_require__(3685);
const https = __webpack_require__(5687);
const { once  } = __webpack_require__(2361);
const { URL  } = __webpack_require__(7310);
const LRU = __webpack_require__(9814);
const pkg = __webpack_require__(2959);
const { RPError  } = __webpack_require__(9244);
const pick = __webpack_require__(9107);
const { deep: defaultsDeep  } = __webpack_require__(5547);
const { HTTP_OPTIONS  } = __webpack_require__(5261);
let DEFAULT_HTTP_OPTIONS;
const NQCHAR = /^[\x21\x23-\x5B\x5D-\x7E]+$/;
const allowed = [
    "agent",
    "ca",
    "cert",
    "crl",
    "headers",
    "key",
    "lookup",
    "passphrase",
    "pfx",
    "timeout"
];
const setDefaults = (props, options)=>{
    DEFAULT_HTTP_OPTIONS = defaultsDeep({}, props.length ? pick(options, ...props) : options, DEFAULT_HTTP_OPTIONS);
};
setDefaults([], {
    headers: {
        "User-Agent": `${pkg.name}/${pkg.version} (${pkg.homepage})`
    },
    timeout: 3500
});
function send(req, body, contentType) {
    if (contentType) {
        req.removeHeader("content-type");
        req.setHeader("content-type", contentType);
    }
    if (body) {
        req.removeHeader("content-length");
        req.setHeader("content-length", Buffer.byteLength(body));
        req.write(body);
    }
    req.end();
}
const nonces = new LRU({
    max: 100
});
module.exports = async function request(options, { accessToken , mTLS =false , DPoP  } = {}) {
    let url;
    try {
        url = new URL(options.url);
        delete options.url;
        assert(/^(https?:)$/.test(url.protocol));
    } catch (err) {
        throw new TypeError("only valid absolute URLs can be requested");
    }
    const optsFn = this[HTTP_OPTIONS];
    let opts = options;
    const nonceKey = `${url.origin}${url.pathname}`;
    if (DPoP && "dpopProof" in this) {
        opts.headers = opts.headers || {};
        opts.headers.DPoP = await this.dpopProof({
            htu: `${url.origin}${url.pathname}`,
            htm: options.method,
            nonce: nonces.get(nonceKey)
        }, DPoP, accessToken);
    }
    let userOptions;
    if (optsFn) {
        userOptions = pick(optsFn.call(this, url, defaultsDeep({}, opts, DEFAULT_HTTP_OPTIONS)), ...allowed);
    }
    opts = defaultsDeep({}, userOptions, opts, DEFAULT_HTTP_OPTIONS);
    if (mTLS && !opts.pfx && !(opts.key && opts.cert)) {
        throw new TypeError("mutual-TLS certificate and key not set");
    }
    if (opts.searchParams) {
        for (const [key, value] of Object.entries(opts.searchParams)){
            url.searchParams.delete(key);
            url.searchParams.set(key, value);
        }
    }
    let responseType;
    let form;
    let json;
    let body;
    ({ form , responseType , json , body , ...opts } = opts);
    for (const [key, value] of Object.entries(opts.headers || {})){
        if (value === undefined) {
            delete opts.headers[key];
        }
    }
    let response;
    const req = (url.protocol === "https:" ? https.request : http.request)(url.href, opts);
    return (async ()=>{
        if (json) {
            send(req, JSON.stringify(json), "application/json");
        } else if (form) {
            send(req, querystring.stringify(form), "application/x-www-form-urlencoded");
        } else if (body) {
            send(req, body);
        } else {
            send(req);
        }
        [response] = await Promise.race([
            once(req, "response"),
            once(req, "timeout")
        ]);
        // timeout reached
        if (!response) {
            req.destroy();
            throw new RPError(`outgoing request timed out after ${opts.timeout}ms`);
        }
        const parts = [];
        for await (const part of response){
            parts.push(part);
        }
        if (parts.length) {
            switch(responseType){
                case "json":
                    {
                        Object.defineProperty(response, "body", {
                            get () {
                                let value = Buffer.concat(parts);
                                try {
                                    value = JSON.parse(value);
                                } catch (err) {
                                    Object.defineProperty(err, "response", {
                                        value: response
                                    });
                                    throw err;
                                } finally{
                                    Object.defineProperty(response, "body", {
                                        value,
                                        configurable: true
                                    });
                                }
                                return value;
                            },
                            configurable: true
                        });
                        break;
                    }
                case undefined:
                case "buffer":
                    {
                        Object.defineProperty(response, "body", {
                            get () {
                                const value = Buffer.concat(parts);
                                Object.defineProperty(response, "body", {
                                    value,
                                    configurable: true
                                });
                                return value;
                            },
                            configurable: true
                        });
                        break;
                    }
                default:
                    throw new TypeError("unsupported responseType request option");
            }
        }
        return response;
    })().catch((err)=>{
        if (response) Object.defineProperty(err, "response", {
            value: response
        });
        throw err;
    }).finally(()=>{
        const dpopNonce = response && response.headers["dpop-nonce"];
        if (dpopNonce && NQCHAR.test(dpopNonce)) {
            nonces.set(nonceKey, dpopNonce);
        }
    });
};
module.exports.setDefaults = setDefaults.bind(undefined, allowed);


/***/ }),

/***/ 7373:
/***/ ((module) => {

"use strict";

module.exports = ()=>Math.floor(Date.now() / 1000);


/***/ }),

/***/ 9257:
/***/ ((module) => {

"use strict";

module.exports.keystores = new WeakMap();


/***/ }),

/***/ 3377:
/***/ ((module) => {

"use strict";
// Credit: https://github.com/rohe/pyoidc/blob/master/src/oic/utils/webfinger.py
// -- Normalization --
// A string of any other type is interpreted as a URI either the form of scheme
// "://" authority path-abempty [ "?" query ] [ "#" fragment ] or authority
// path-abempty [ "?" query ] [ "#" fragment ] per RFC 3986 [RFC3986] and is
// normalized according to the following rules:
//
// If the user input Identifier does not have an RFC 3986 [RFC3986] scheme
// portion, the string is interpreted as [userinfo "@"] host [":" port]
// path-abempty [ "?" query ] [ "#" fragment ] per RFC 3986 [RFC3986].
// If the userinfo component is present and all of the path component, query
// component, and port component are empty, the acct scheme is assumed. In this
// case, the normalized URI is formed by prefixing acct: to the string as the
// scheme. Per the 'acct' URI Scheme [I‑D.ietf‑appsawg‑acct‑uri], if there is an
// at-sign character ('@') in the userinfo component, it needs to be
// percent-encoded as described in RFC 3986 [RFC3986].
// For all other inputs without a scheme portion, the https scheme is assumed,
// and the normalized URI is formed by prefixing https:// to the string as the
// scheme.
// If the resulting URI contains a fragment portion, it MUST be stripped off
// together with the fragment delimiter character "#".
// The WebFinger [I‑D.ietf‑appsawg‑webfinger] Resource in this case is the
// resulting URI, and the WebFinger Host is the authority component.
//
// Note: Since the definition of authority in RFC 3986 [RFC3986] is
// [ userinfo "@" ] host [ ":" port ], it is legal to have a user input
// identifier like userinfo@host:port, e.g., alice@example.com:8080.

const PORT = /^\d+$/;
function hasScheme(input) {
    if (input.includes("://")) return true;
    const authority = input.replace(/(\/|\?)/g, "#").split("#")[0];
    if (authority.includes(":")) {
        const index = authority.indexOf(":");
        const hostOrPort = authority.slice(index + 1);
        if (!PORT.test(hostOrPort)) {
            return true;
        }
    }
    return false;
}
function acctSchemeAssumed(input) {
    if (!input.includes("@")) return false;
    const parts = input.split("@");
    const host = parts[parts.length - 1];
    return !(host.includes(":") || host.includes("/") || host.includes("?"));
}
function normalize(input) {
    if (typeof input !== "string") {
        throw new TypeError("input must be a string");
    }
    let output;
    if (hasScheme(input)) {
        output = input;
    } else if (acctSchemeAssumed(input)) {
        output = `acct:${input}`;
    } else {
        output = `https://${input}`;
    }
    return output.split("#")[0];
}
module.exports = normalize;


/***/ }),

/***/ 8216:
/***/ ((module) => {

"use strict";

const REGEXP = /(\w+)=("[^"]*")/g;
module.exports = (wwwAuthenticate)=>{
    const params = {};
    try {
        while(REGEXP.exec(wwwAuthenticate) !== null){
            if (RegExp.$1 && RegExp.$2) {
                params[RegExp.$1] = RegExp.$2.slice(1, -1);
            }
        }
    } catch (err) {}
    return params;
};


/***/ }),

/***/ 1634:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const Issuer = __webpack_require__(9331);
const { OPError , RPError  } = __webpack_require__(9244);
const Strategy = __webpack_require__(1459);
const TokenSet = __webpack_require__(1498);
const { CLOCK_TOLERANCE , HTTP_OPTIONS  } = __webpack_require__(5261);
const generators = __webpack_require__(8734);
const { setDefaults  } = __webpack_require__(724);
module.exports = {
    Issuer,
    Strategy,
    TokenSet,
    errors: {
        OPError,
        RPError
    },
    custom: {
        setHttpOptionsDefaults: setDefaults,
        http_options: HTTP_OPTIONS,
        clock_tolerance: CLOCK_TOLERANCE
    },
    generators
};


/***/ }),

/***/ 9331:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const { inspect  } = __webpack_require__(3837);
const url = __webpack_require__(7310);
const { RPError  } = __webpack_require__(9244);
const getClient = __webpack_require__(5546);
const registry = __webpack_require__(6632);
const processResponse = __webpack_require__(6381);
const webfingerNormalize = __webpack_require__(3377);
const request = __webpack_require__(724);
const clone = __webpack_require__(2984);
const { keystore  } = __webpack_require__(8705);
const AAD_MULTITENANT_DISCOVERY = [
    "https://login.microsoftonline.com/common/.well-known/openid-configuration",
    "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
    "https://login.microsoftonline.com/organizations/v2.0/.well-known/openid-configuration",
    "https://login.microsoftonline.com/consumers/v2.0/.well-known/openid-configuration"
];
const AAD_MULTITENANT = Symbol();
const ISSUER_DEFAULTS = {
    claim_types_supported: [
        "normal"
    ],
    claims_parameter_supported: false,
    grant_types_supported: [
        "authorization_code",
        "implicit"
    ],
    request_parameter_supported: false,
    request_uri_parameter_supported: true,
    require_request_uri_registration: false,
    response_modes_supported: [
        "query",
        "fragment"
    ],
    token_endpoint_auth_methods_supported: [
        "client_secret_basic"
    ]
};
class Issuer {
    #metadata;
    constructor(meta = {}){
        const aadIssValidation = meta[AAD_MULTITENANT];
        delete meta[AAD_MULTITENANT];
        [
            "introspection",
            "revocation"
        ].forEach((endpoint)=>{
            // if intro/revocation endpoint auth specific meta is missing use the token ones if they
            // are defined
            if (meta[`${endpoint}_endpoint`] && meta[`${endpoint}_endpoint_auth_methods_supported`] === undefined && meta[`${endpoint}_endpoint_auth_signing_alg_values_supported`] === undefined) {
                if (meta.token_endpoint_auth_methods_supported) {
                    meta[`${endpoint}_endpoint_auth_methods_supported`] = meta.token_endpoint_auth_methods_supported;
                }
                if (meta.token_endpoint_auth_signing_alg_values_supported) {
                    meta[`${endpoint}_endpoint_auth_signing_alg_values_supported`] = meta.token_endpoint_auth_signing_alg_values_supported;
                }
            }
        });
        this.#metadata = new Map();
        Object.entries(meta).forEach(([key, value])=>{
            this.#metadata.set(key, value);
            if (!this[key]) {
                Object.defineProperty(this, key, {
                    get () {
                        return this.#metadata.get(key);
                    },
                    enumerable: true
                });
            }
        });
        registry.set(this.issuer, this);
        const Client = getClient(this, aadIssValidation);
        Object.defineProperties(this, {
            Client: {
                value: Client,
                enumerable: true
            },
            FAPI1Client: {
                value: class FAPI1Client extends Client {
                },
                enumerable: true
            }
        });
    }
    get metadata() {
        return clone(Object.fromEntries(this.#metadata.entries()));
    }
    static async webfinger(input) {
        const resource = webfingerNormalize(input);
        const { host  } = url.parse(resource);
        const webfingerUrl = `https://${host}/.well-known/webfinger`;
        const response = await request.call(this, {
            method: "GET",
            url: webfingerUrl,
            responseType: "json",
            searchParams: {
                resource,
                rel: "http://openid.net/specs/connect/1.0/issuer"
            },
            headers: {
                Accept: "application/json"
            }
        });
        const body = processResponse(response);
        const location = Array.isArray(body.links) && body.links.find((link)=>typeof link === "object" && link.rel === "http://openid.net/specs/connect/1.0/issuer" && link.href);
        if (!location) {
            throw new RPError({
                message: "no issuer found in webfinger response",
                body
            });
        }
        if (typeof location.href !== "string" || !location.href.startsWith("https://")) {
            throw new RPError({
                printf: [
                    "invalid issuer location %s",
                    location.href
                ],
                body
            });
        }
        const expectedIssuer = location.href;
        if (registry.has(expectedIssuer)) {
            return registry.get(expectedIssuer);
        }
        const issuer = await this.discover(expectedIssuer);
        if (issuer.issuer !== expectedIssuer) {
            registry.del(issuer.issuer);
            throw new RPError("discovered issuer mismatch, expected %s, got: %s", expectedIssuer, issuer.issuer);
        }
        return issuer;
    }
    static async discover(uri) {
        const parsed = url.parse(uri);
        if (parsed.pathname.includes("/.well-known/")) {
            const response = await request.call(this, {
                method: "GET",
                responseType: "json",
                url: uri,
                headers: {
                    Accept: "application/json"
                }
            });
            const body = processResponse(response);
            return new Issuer({
                ...ISSUER_DEFAULTS,
                ...body,
                [AAD_MULTITENANT]: !!AAD_MULTITENANT_DISCOVERY.find((discoveryURL)=>uri.startsWith(discoveryURL))
            });
        }
        let pathname;
        if (parsed.pathname.endsWith("/")) {
            pathname = `${parsed.pathname}.well-known/openid-configuration`;
        } else {
            pathname = `${parsed.pathname}/.well-known/openid-configuration`;
        }
        const wellKnownUri = url.format({
            ...parsed,
            pathname
        });
        const response = await request.call(this, {
            method: "GET",
            responseType: "json",
            url: wellKnownUri,
            headers: {
                Accept: "application/json"
            }
        });
        const body = processResponse(response);
        return new Issuer({
            ...ISSUER_DEFAULTS,
            ...body,
            [AAD_MULTITENANT]: !!AAD_MULTITENANT_DISCOVERY.find((discoveryURL)=>wellKnownUri.startsWith(discoveryURL))
        });
    }
    async reloadJwksUri() {
        await keystore.call(this, true);
    }
    /* istanbul ignore next */ [inspect.custom]() {
        return `${this.constructor.name} ${inspect(this.metadata, {
            depth: Infinity,
            colors: process.stdout.isTTY,
            compact: false,
            sorted: true
        })}`;
    }
}
module.exports = Issuer;


/***/ }),

/***/ 6632:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const LRU = __webpack_require__(9814);
module.exports = new LRU({
    max: 100
});


/***/ }),

/***/ 1459:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const url = __webpack_require__(7310);
const { format  } = __webpack_require__(3837);
const cloneDeep = __webpack_require__(2984);
const { RPError , OPError  } = __webpack_require__(9244);
const { BaseClient  } = __webpack_require__(5546);
const { random , codeChallenge  } = __webpack_require__(8734);
const pick = __webpack_require__(9107);
const { resolveResponseType , resolveRedirectUri  } = __webpack_require__(2716);
function verified(err, user, info = {}) {
    if (err) {
        this.error(err);
    } else if (!user) {
        this.fail(info);
    } else {
        this.success(user, info);
    }
}
function OpenIDConnectStrategy({ client , params ={} , passReqToCallback =false , sessionKey , usePKCE =true , extras ={}  } = {}, verify) {
    if (!(client instanceof BaseClient)) {
        throw new TypeError("client must be an instance of openid-client Client");
    }
    if (typeof verify !== "function") {
        throw new TypeError("verify callback must be a function");
    }
    if (!client.issuer || !client.issuer.issuer) {
        throw new TypeError("client must have an issuer with an identifier");
    }
    this._client = client;
    this._issuer = client.issuer;
    this._verify = verify;
    this._passReqToCallback = passReqToCallback;
    this._usePKCE = usePKCE;
    this._key = sessionKey || `oidc:${url.parse(this._issuer.issuer).hostname}`;
    this._params = cloneDeep(params);
    // state and nonce are handled in authenticate()
    delete this._params.state;
    delete this._params.nonce;
    this._extras = cloneDeep(extras);
    if (!this._params.response_type) this._params.response_type = resolveResponseType.call(client);
    if (!this._params.redirect_uri) this._params.redirect_uri = resolveRedirectUri.call(client);
    if (!this._params.scope) this._params.scope = "openid";
    if (this._usePKCE === true) {
        const supportedMethods = Array.isArray(this._issuer.code_challenge_methods_supported) ? this._issuer.code_challenge_methods_supported : false;
        if (supportedMethods && supportedMethods.includes("S256")) {
            this._usePKCE = "S256";
        } else if (supportedMethods && supportedMethods.includes("plain")) {
            this._usePKCE = "plain";
        } else if (supportedMethods) {
            throw new TypeError("neither code_challenge_method supported by the client is supported by the issuer");
        } else {
            this._usePKCE = "S256";
        }
    } else if (typeof this._usePKCE === "string" && ![
        "plain",
        "S256"
    ].includes(this._usePKCE)) {
        throw new TypeError(`${this._usePKCE} is not valid/implemented PKCE code_challenge_method`);
    }
    this.name = url.parse(client.issuer.issuer).hostname;
}
OpenIDConnectStrategy.prototype.authenticate = function authenticate(req, options) {
    (async ()=>{
        const client = this._client;
        if (!req.session) {
            throw new TypeError("authentication requires session support");
        }
        const reqParams = client.callbackParams(req);
        const sessionKey = this._key;
        const { 0: parameter , length  } = Object.keys(reqParams);
        /**
     * Start authentication request if this has no authorization response parameters or
     * this might a login initiated from a third party as per
     * https://openid.net/specs/openid-connect-core-1_0.html#ThirdPartyInitiatedLogin.
     */ if (length === 0 || length === 1 && parameter === "iss") {
            // provide options object with extra authentication parameters
            const params = {
                state: random(),
                ...this._params,
                ...options
            };
            if (!params.nonce && params.response_type.includes("id_token")) {
                params.nonce = random();
            }
            req.session[sessionKey] = pick(params, "nonce", "state", "max_age", "response_type");
            if (this._usePKCE && params.response_type.includes("code")) {
                const verifier = random();
                req.session[sessionKey].code_verifier = verifier;
                switch(this._usePKCE){
                    case "S256":
                        params.code_challenge = codeChallenge(verifier);
                        params.code_challenge_method = "S256";
                        break;
                    case "plain":
                        params.code_challenge = verifier;
                        break;
                }
            }
            this.redirect(client.authorizationUrl(params));
            return;
        }
        /* end authentication request */ /* start authentication response */ const session = req.session[sessionKey];
        if (Object.keys(session || {}).length === 0) {
            throw new Error(format('did not find expected authorization request details in session, req.session["%s"] is %j', sessionKey, session));
        }
        const { state , nonce , max_age: maxAge , code_verifier: codeVerifier , response_type: responseType  } = session;
        try {
            delete req.session[sessionKey];
        } catch (err) {}
        const opts = {
            redirect_uri: this._params.redirect_uri,
            ...options
        };
        const checks = {
            state,
            nonce,
            max_age: maxAge,
            code_verifier: codeVerifier,
            response_type: responseType
        };
        const tokenset = await client.callback(opts.redirect_uri, reqParams, checks, this._extras);
        const passReq = this._passReqToCallback;
        const loadUserinfo = this._verify.length > (passReq ? 3 : 2) && client.issuer.userinfo_endpoint;
        const args = [
            tokenset,
            verified.bind(this)
        ];
        if (loadUserinfo) {
            if (!tokenset.access_token) {
                throw new RPError({
                    message: "expected access_token to be returned when asking for userinfo in verify callback",
                    tokenset
                });
            }
            const userinfo = await client.userinfo(tokenset);
            args.splice(1, 0, userinfo);
        }
        if (passReq) {
            args.unshift(req);
        }
        this._verify(...args);
    /* end authentication response */ })().catch((error)=>{
        if (error instanceof OPError && error.error !== "server_error" && !error.error.startsWith("invalid") || error instanceof RPError) {
            this.fail(error);
        } else {
            this.error(error);
        }
    });
};
module.exports = OpenIDConnectStrategy;


/***/ }),

/***/ 1498:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const base64url = __webpack_require__(7882);
const now = __webpack_require__(7373);
class TokenSet {
    constructor(values){
        Object.assign(this, values);
        const { constructor , ...properties } = Object.getOwnPropertyDescriptors(this.constructor.prototype);
        Object.defineProperties(this, properties);
    }
    set expires_in(value) {
        this.expires_at = now() + Number(value);
    }
    get expires_in() {
        return Math.max.apply(null, [
            this.expires_at - now(),
            0
        ]);
    }
    expired() {
        return this.expires_in === 0;
    }
    claims() {
        if (!this.id_token) {
            throw new TypeError("id_token not present in TokenSet");
        }
        return JSON.parse(base64url.decode(this.id_token.split(".")[1]));
    }
}
module.exports = TokenSet;


/***/ }),

/***/ 2532:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "NIL": () => (/* reexport */ nil),
  "parse": () => (/* reexport */ esm_node_parse),
  "stringify": () => (/* reexport */ esm_node_stringify),
  "v1": () => (/* reexport */ esm_node_v1),
  "v3": () => (/* reexport */ esm_node_v3),
  "v4": () => (/* reexport */ esm_node_v4),
  "v5": () => (/* reexport */ esm_node_v5),
  "validate": () => (/* reexport */ esm_node_validate),
  "version": () => (/* reexport */ esm_node_version)
});

// EXTERNAL MODULE: external "crypto"
var external_crypto_ = __webpack_require__(6113);
var external_crypto_default = /*#__PURE__*/__webpack_require__.n(external_crypto_);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-node/rng.js

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate
let poolPtr = rnds8Pool.length;
function rng() {
    if (poolPtr > rnds8Pool.length - 16) {
        external_crypto_default().randomFillSync(rnds8Pool);
        poolPtr = 0;
    }
    return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-node/regex.js
/* harmony default export */ const regex = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-node/validate.js

function validate(uuid) {
    return typeof uuid === "string" && regex.test(uuid);
}
/* harmony default export */ const esm_node_validate = (validate);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-node/stringify.js

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */ const byteToHex = [];
for(let i = 0; i < 256; ++i){
    byteToHex.push((i + 0x100).toString(16).substr(1));
}
function stringify(arr, offset = 0) {
    // Note: Be careful editing this code!  It's been tuned for performance
    // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
    const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
    // of the following:
    // - One or more input array values don't map to a hex octet (leading to
    // "undefined" in the uuid)
    // - Invalid input values for the RFC `version` or `variant` fields
    if (!esm_node_validate(uuid)) {
        throw TypeError("Stringified UUID is invalid");
    }
    return uuid;
}
/* harmony default export */ const esm_node_stringify = (stringify);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-node/v1.js

 // **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;
let _clockseq; // Previous uuid creation time
let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details
function v1(options, buf, offset) {
    let i = buf && offset || 0;
    const b = buf || new Array(16);
    options = options || {};
    let node = options.node || _nodeId;
    let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
    // specified.  We do this lazily to minimize issues related to insufficient
    // system entropy.  See #189
    if (node == null || clockseq == null) {
        const seedBytes = options.random || (options.rng || rng)();
        if (node == null) {
            // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
            node = _nodeId = [
                seedBytes[0] | 0x01,
                seedBytes[1],
                seedBytes[2],
                seedBytes[3],
                seedBytes[4],
                seedBytes[5]
            ];
        }
        if (clockseq == null) {
            // Per 4.2.2, randomize (14 bit) clockseq
            clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
        }
    } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)
    const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq === undefined) {
        clockseq = clockseq + 1 & 0x3fff;
    } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
        nsecs = 0;
    } // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
        throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
    }
    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000; // `time_low`
    const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff; // `time_mid`
    const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff; // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`
    b[i++] = clockseq & 0xff; // `node`
    for(let n = 0; n < 6; ++n){
        b[i + n] = node[n];
    }
    return buf || esm_node_stringify(b);
}
/* harmony default export */ const esm_node_v1 = (v1);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-node/parse.js

function parse(uuid) {
    if (!esm_node_validate(uuid)) {
        throw TypeError("Invalid UUID");
    }
    let v;
    const arr = new Uint8Array(16); // Parse ########-....-....-....-............
    arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
    arr[1] = v >>> 16 & 0xff;
    arr[2] = v >>> 8 & 0xff;
    arr[3] = v & 0xff; // Parse ........-####-....-....-............
    arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
    arr[5] = v & 0xff; // Parse ........-....-####-....-............
    arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
    arr[7] = v & 0xff; // Parse ........-....-....-####-............
    arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
    arr[9] = v & 0xff; // Parse ........-....-....-....-############
    // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)
    arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
    arr[11] = v / 0x100000000 & 0xff;
    arr[12] = v >>> 24 & 0xff;
    arr[13] = v >>> 16 & 0xff;
    arr[14] = v >>> 8 & 0xff;
    arr[15] = v & 0xff;
    return arr;
}
/* harmony default export */ const esm_node_parse = (parse);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-node/v35.js


function stringToBytes(str) {
    str = unescape(encodeURIComponent(str)); // UTF8 escape
    const bytes = [];
    for(let i = 0; i < str.length; ++i){
        bytes.push(str.charCodeAt(i));
    }
    return bytes;
}
const DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
const URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
/* harmony default export */ function v35(name, version, hashfunc) {
    function generateUUID(value, namespace, buf, offset) {
        if (typeof value === "string") {
            value = stringToBytes(value);
        }
        if (typeof namespace === "string") {
            namespace = esm_node_parse(namespace);
        }
        if (namespace.length !== 16) {
            throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
        } // Compute hash of namespace and value, Per 4.3
        // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
        // hashfunc([...namespace, ... value])`
        let bytes = new Uint8Array(16 + value.length);
        bytes.set(namespace);
        bytes.set(value, namespace.length);
        bytes = hashfunc(bytes);
        bytes[6] = bytes[6] & 0x0f | version;
        bytes[8] = bytes[8] & 0x3f | 0x80;
        if (buf) {
            offset = offset || 0;
            for(let i = 0; i < 16; ++i){
                buf[offset + i] = bytes[i];
            }
            return buf;
        }
        return esm_node_stringify(bytes);
    } // Function#name is not settable on some platforms (#270)
    try {
        generateUUID.name = name; // eslint-disable-next-line no-empty
    } catch (err) {} // For CommonJS default export support
    generateUUID.DNS = DNS;
    generateUUID.URL = URL;
    return generateUUID;
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-node/md5.js

function md5(bytes) {
    if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
    } else if (typeof bytes === "string") {
        bytes = Buffer.from(bytes, "utf8");
    }
    return external_crypto_default().createHash("md5").update(bytes).digest();
}
/* harmony default export */ const esm_node_md5 = (md5);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-node/v3.js


const v3 = v35("v3", 0x30, esm_node_md5);
/* harmony default export */ const esm_node_v3 = (v3);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-node/v4.js


function v4(options, buf, offset) {
    options = options || {};
    const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = rnds[6] & 0x0f | 0x40;
    rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided
    if (buf) {
        offset = offset || 0;
        for(let i = 0; i < 16; ++i){
            buf[offset + i] = rnds[i];
        }
        return buf;
    }
    return esm_node_stringify(rnds);
}
/* harmony default export */ const esm_node_v4 = (v4);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-node/sha1.js

function sha1(bytes) {
    if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
    } else if (typeof bytes === "string") {
        bytes = Buffer.from(bytes, "utf8");
    }
    return external_crypto_default().createHash("sha1").update(bytes).digest();
}
/* harmony default export */ const esm_node_sha1 = (sha1);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-node/v5.js


const v5 = v35("v5", 0x50, esm_node_sha1);
/* harmony default export */ const esm_node_v5 = (v5);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-node/nil.js
/* harmony default export */ const nil = ("00000000-0000-0000-0000-000000000000");

;// CONCATENATED MODULE: ../../node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-node/version.js

function version(uuid) {
    if (!esm_node_validate(uuid)) {
        throw TypeError("Invalid UUID");
    }
    return parseInt(uuid.substr(14, 1), 16);
}
/* harmony default export */ const esm_node_version = (version);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-node/index.js











/***/ }),

/***/ 4665:
/***/ ((module) => {

"use strict";

module.exports = function(Yallist) {
    Yallist.prototype[Symbol.iterator] = function*() {
        for(let walker = this.head; walker; walker = walker.next){
            yield walker.value;
        }
    };
};


/***/ }),

/***/ 7954:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Yallist;
Yallist.Node = Node;
Yallist.create = Yallist;
function Yallist(list) {
    var self = this;
    if (!(self instanceof Yallist)) {
        self = new Yallist();
    }
    self.tail = null;
    self.head = null;
    self.length = 0;
    if (list && typeof list.forEach === "function") {
        list.forEach(function(item) {
            self.push(item);
        });
    } else if (arguments.length > 0) {
        for(var i = 0, l = arguments.length; i < l; i++){
            self.push(arguments[i]);
        }
    }
    return self;
}
Yallist.prototype.removeNode = function(node) {
    if (node.list !== this) {
        throw new Error("removing node which does not belong to this list");
    }
    var next = node.next;
    var prev = node.prev;
    if (next) {
        next.prev = prev;
    }
    if (prev) {
        prev.next = next;
    }
    if (node === this.head) {
        this.head = next;
    }
    if (node === this.tail) {
        this.tail = prev;
    }
    node.list.length--;
    node.next = null;
    node.prev = null;
    node.list = null;
    return next;
};
Yallist.prototype.unshiftNode = function(node) {
    if (node === this.head) {
        return;
    }
    if (node.list) {
        node.list.removeNode(node);
    }
    var head = this.head;
    node.list = this;
    node.next = head;
    if (head) {
        head.prev = node;
    }
    this.head = node;
    if (!this.tail) {
        this.tail = node;
    }
    this.length++;
};
Yallist.prototype.pushNode = function(node) {
    if (node === this.tail) {
        return;
    }
    if (node.list) {
        node.list.removeNode(node);
    }
    var tail = this.tail;
    node.list = this;
    node.prev = tail;
    if (tail) {
        tail.next = node;
    }
    this.tail = node;
    if (!this.head) {
        this.head = node;
    }
    this.length++;
};
Yallist.prototype.push = function() {
    for(var i = 0, l = arguments.length; i < l; i++){
        push(this, arguments[i]);
    }
    return this.length;
};
Yallist.prototype.unshift = function() {
    for(var i = 0, l = arguments.length; i < l; i++){
        unshift(this, arguments[i]);
    }
    return this.length;
};
Yallist.prototype.pop = function() {
    if (!this.tail) {
        return undefined;
    }
    var res = this.tail.value;
    this.tail = this.tail.prev;
    if (this.tail) {
        this.tail.next = null;
    } else {
        this.head = null;
    }
    this.length--;
    return res;
};
Yallist.prototype.shift = function() {
    if (!this.head) {
        return undefined;
    }
    var res = this.head.value;
    this.head = this.head.next;
    if (this.head) {
        this.head.prev = null;
    } else {
        this.tail = null;
    }
    this.length--;
    return res;
};
Yallist.prototype.forEach = function(fn, thisp) {
    thisp = thisp || this;
    for(var walker = this.head, i = 0; walker !== null; i++){
        fn.call(thisp, walker.value, i, this);
        walker = walker.next;
    }
};
Yallist.prototype.forEachReverse = function(fn, thisp) {
    thisp = thisp || this;
    for(var walker = this.tail, i = this.length - 1; walker !== null; i--){
        fn.call(thisp, walker.value, i, this);
        walker = walker.prev;
    }
};
Yallist.prototype.get = function(n) {
    for(var i = 0, walker = this.head; walker !== null && i < n; i++){
        // abort out of the list early if we hit a cycle
        walker = walker.next;
    }
    if (i === n && walker !== null) {
        return walker.value;
    }
};
Yallist.prototype.getReverse = function(n) {
    for(var i = 0, walker = this.tail; walker !== null && i < n; i++){
        // abort out of the list early if we hit a cycle
        walker = walker.prev;
    }
    if (i === n && walker !== null) {
        return walker.value;
    }
};
Yallist.prototype.map = function(fn, thisp) {
    thisp = thisp || this;
    var res = new Yallist();
    for(var walker = this.head; walker !== null;){
        res.push(fn.call(thisp, walker.value, this));
        walker = walker.next;
    }
    return res;
};
Yallist.prototype.mapReverse = function(fn, thisp) {
    thisp = thisp || this;
    var res = new Yallist();
    for(var walker = this.tail; walker !== null;){
        res.push(fn.call(thisp, walker.value, this));
        walker = walker.prev;
    }
    return res;
};
Yallist.prototype.reduce = function(fn, initial) {
    var acc;
    var walker = this.head;
    if (arguments.length > 1) {
        acc = initial;
    } else if (this.head) {
        walker = this.head.next;
        acc = this.head.value;
    } else {
        throw new TypeError("Reduce of empty list with no initial value");
    }
    for(var i = 0; walker !== null; i++){
        acc = fn(acc, walker.value, i);
        walker = walker.next;
    }
    return acc;
};
Yallist.prototype.reduceReverse = function(fn, initial) {
    var acc;
    var walker = this.tail;
    if (arguments.length > 1) {
        acc = initial;
    } else if (this.tail) {
        walker = this.tail.prev;
        acc = this.tail.value;
    } else {
        throw new TypeError("Reduce of empty list with no initial value");
    }
    for(var i = this.length - 1; walker !== null; i--){
        acc = fn(acc, walker.value, i);
        walker = walker.prev;
    }
    return acc;
};
Yallist.prototype.toArray = function() {
    var arr = new Array(this.length);
    for(var i = 0, walker = this.head; walker !== null; i++){
        arr[i] = walker.value;
        walker = walker.next;
    }
    return arr;
};
Yallist.prototype.toArrayReverse = function() {
    var arr = new Array(this.length);
    for(var i = 0, walker = this.tail; walker !== null; i++){
        arr[i] = walker.value;
        walker = walker.prev;
    }
    return arr;
};
Yallist.prototype.slice = function(from, to) {
    to = to || this.length;
    if (to < 0) {
        to += this.length;
    }
    from = from || 0;
    if (from < 0) {
        from += this.length;
    }
    var ret = new Yallist();
    if (to < from || to < 0) {
        return ret;
    }
    if (from < 0) {
        from = 0;
    }
    if (to > this.length) {
        to = this.length;
    }
    for(var i = 0, walker = this.head; walker !== null && i < from; i++){
        walker = walker.next;
    }
    for(; walker !== null && i < to; i++, walker = walker.next){
        ret.push(walker.value);
    }
    return ret;
};
Yallist.prototype.sliceReverse = function(from, to) {
    to = to || this.length;
    if (to < 0) {
        to += this.length;
    }
    from = from || 0;
    if (from < 0) {
        from += this.length;
    }
    var ret = new Yallist();
    if (to < from || to < 0) {
        return ret;
    }
    if (from < 0) {
        from = 0;
    }
    if (to > this.length) {
        to = this.length;
    }
    for(var i = this.length, walker = this.tail; walker !== null && i > to; i--){
        walker = walker.prev;
    }
    for(; walker !== null && i > from; i--, walker = walker.prev){
        ret.push(walker.value);
    }
    return ret;
};
Yallist.prototype.splice = function(start, deleteCount, ...nodes) {
    if (start > this.length) {
        start = this.length - 1;
    }
    if (start < 0) {
        start = this.length + start;
    }
    for(var i = 0, walker = this.head; walker !== null && i < start; i++){
        walker = walker.next;
    }
    var ret = [];
    for(var i = 0; walker && i < deleteCount; i++){
        ret.push(walker.value);
        walker = this.removeNode(walker);
    }
    if (walker === null) {
        walker = this.tail;
    }
    if (walker !== this.head && walker !== this.tail) {
        walker = walker.prev;
    }
    for(var i = 0; i < nodes.length; i++){
        walker = insert(this, walker, nodes[i]);
    }
    return ret;
};
Yallist.prototype.reverse = function() {
    var head = this.head;
    var tail = this.tail;
    for(var walker = head; walker !== null; walker = walker.prev){
        var p = walker.prev;
        walker.prev = walker.next;
        walker.next = p;
    }
    this.head = tail;
    this.tail = head;
    return this;
};
function insert(self, node, value) {
    var inserted = node === self.head ? new Node(value, null, node, self) : new Node(value, node, node.next, self);
    if (inserted.next === null) {
        self.tail = inserted;
    }
    if (inserted.prev === null) {
        self.head = inserted;
    }
    self.length++;
    return inserted;
}
function push(self, item) {
    self.tail = new Node(item, self.tail, null, self);
    if (!self.head) {
        self.head = self.tail;
    }
    self.length++;
}
function unshift(self, item) {
    self.head = new Node(item, null, self.head, self);
    if (!self.tail) {
        self.tail = self.head;
    }
    self.length++;
}
function Node(value, prev, next, list) {
    if (!(this instanceof Node)) {
        return new Node(value, prev, next, list);
    }
    this.list = list;
    this.value = value;
    if (prev) {
        prev.next = this;
        this.prev = prev;
    } else {
        this.prev = null;
    }
    if (next) {
        next.prev = this;
        this.next = next;
    } else {
        this.next = null;
    }
}
try {
    // add if support for Symbol.iterator is present
    __webpack_require__(4665)(Yallist);
} catch (er) {}


/***/ }),

/***/ 6150:
/***/ ((module) => {

"use strict";

function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
module.exports = _assertThisInitialized, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 2318:
/***/ ((module) => {

"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 5358:
/***/ ((module) => {

"use strict";

function _classApplyDescriptorGet(receiver, descriptor) {
    if (descriptor.get) {
        return descriptor.get.call(receiver);
    }
    return descriptor.value;
}
module.exports = _classApplyDescriptorGet, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 9417:
/***/ ((module) => {

"use strict";

function _classApplyDescriptorSet(receiver, descriptor, value) {
    if (descriptor.set) {
        descriptor.set.call(receiver, value);
    } else {
        if (!descriptor.writable) {
            throw new TypeError("attempted to set read only private field");
        }
        descriptor.value = value;
    }
}
module.exports = _classApplyDescriptorSet, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 639:
/***/ ((module) => {

"use strict";

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 3263:
/***/ ((module) => {

"use strict";

function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to " + action + " private field on non-instance");
    }
    return privateMap.get(receiver);
}
module.exports = _classExtractFieldDescriptor, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 2587:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var classApplyDescriptorGet = __webpack_require__(5358);
var classExtractFieldDescriptor = __webpack_require__(3263);
function _classPrivateFieldGet(receiver, privateMap) {
    var descriptor = classExtractFieldDescriptor(receiver, privateMap, "get");
    return classApplyDescriptorGet(receiver, descriptor);
}
module.exports = _classPrivateFieldGet, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 9988:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var classApplyDescriptorSet = __webpack_require__(9417);
var classExtractFieldDescriptor = __webpack_require__(3263);
function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = classExtractFieldDescriptor(receiver, privateMap, "set");
    classApplyDescriptorSet(receiver, descriptor, value);
    return value;
}
module.exports = _classPrivateFieldSet, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 1381:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var setPrototypeOf = __webpack_require__(3573);
var isNativeReflectConstruct = __webpack_require__(2128);
function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
        module.exports = _construct = Reflect.construct.bind(), module.exports.__esModule = true, module.exports["default"] = module.exports;
    } else {
        module.exports = _construct = function _construct(Parent, args, Class) {
            var a = [
                null
            ];
            a.push.apply(a, args);
            var Constructor = Function.bind.apply(Parent, a);
            var instance = new Constructor();
            if (Class) setPrototypeOf(instance, Class.prototype);
            return instance;
        }, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
    return _construct.apply(null, arguments);
}
module.exports = _construct, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 3268:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toPropertyKey = __webpack_require__(6362);
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, toPropertyKey(descriptor.key), descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
        writable: false
    });
    return Constructor;
}
module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 4601:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toPropertyKey = __webpack_require__(6362);
function _defineProperty(obj, key, value) {
    key = toPropertyKey(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 9693:
/***/ ((module) => {

"use strict";

function _extends() {
    module.exports = _extends = Object.assign ? Object.assign.bind() : function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
    return _extends.apply(this, arguments);
}
module.exports = _extends, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 8638:
/***/ ((module) => {

"use strict";

function _getPrototypeOf(o) {
    module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
    return _getPrototypeOf(o);
}
module.exports = _getPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 5881:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var setPrototypeOf = __webpack_require__(3573);
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    Object.defineProperty(subClass, "prototype", {
        writable: false
    });
    if (superClass) setPrototypeOf(subClass, superClass);
}
module.exports = _inherits, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 6533:
/***/ ((module) => {

"use strict";

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    };
}
module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 8251:
/***/ ((module) => {

"use strict";

function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
module.exports = _isNativeFunction, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 2128:
/***/ ((module) => {

"use strict";

function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}
module.exports = _isNativeReflectConstruct, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 8895:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var _typeof = (__webpack_require__(8940)["default"]);
var assertThisInitialized = __webpack_require__(6150);
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    } else if (call !== void 0) {
        throw new TypeError("Derived constructors may only return object or undefined");
    }
    return assertThisInitialized(self);
}
module.exports = _possibleConstructorReturn, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 29:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var _typeof = (__webpack_require__(8940)["default"]);
function _regeneratorRuntime() {
    "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ 
    module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
        return e;
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
    var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function(t, e, r) {
        t[e] = r.value;
    }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag";
    function define(t, e, r) {
        return Object.defineProperty(t, e, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }), t[e];
    }
    try {
        define({}, "");
    } catch (t) {
        define = function define(t, e, r) {
            return t[e] = r;
        };
    }
    function wrap(t, e, r, n) {
        var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []);
        return o(a, "_invoke", {
            value: makeInvokeMethod(t, r, c)
        }), a;
    }
    function tryCatch(t, e, r) {
        try {
            return {
                type: "normal",
                arg: t.call(e, r)
            };
        } catch (t) {
            return {
                type: "throw",
                arg: t
            };
        }
    }
    e.wrap = wrap;
    var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    var p = {};
    define(p, a, function() {
        return this;
    });
    var d = Object.getPrototypeOf, v = d && d(d(values([])));
    v && v !== r && n.call(v, a) && (p = v);
    var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
    function defineIteratorMethods(t) {
        [
            "next",
            "throw",
            "return"
        ].forEach(function(e) {
            define(t, e, function(t) {
                return this._invoke(e, t);
            });
        });
    }
    function AsyncIterator(t, e) {
        function invoke(r, o, i, a) {
            var c = tryCatch(t[r], t, o);
            if ("throw" !== c.type) {
                var u = c.arg, h = u.value;
                return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function(t) {
                    invoke("next", t, i, a);
                }, function(t) {
                    invoke("throw", t, i, a);
                }) : e.resolve(h).then(function(t) {
                    u.value = t, i(u);
                }, function(t) {
                    return invoke("throw", t, i, a);
                });
            }
            a(c.arg);
        }
        var r;
        o(this, "_invoke", {
            value: function value(t, n) {
                function callInvokeWithMethodAndArg() {
                    return new e(function(e, r) {
                        invoke(t, n, e, r);
                    });
                }
                return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
            }
        });
    }
    function makeInvokeMethod(e, r, n) {
        var o = h;
        return function(i, a) {
            if (o === f) throw new Error("Generator is already running");
            if (o === s) {
                if ("throw" === i) throw a;
                return {
                    value: t,
                    done: !0
                };
            }
            for(n.method = i, n.arg = a;;){
                var c = n.delegate;
                if (c) {
                    var u = maybeInvokeDelegate(c, n);
                    if (u) {
                        if (u === y) continue;
                        return u;
                    }
                }
                if ("next" === n.method) n.sent = n._sent = n.arg;
                else if ("throw" === n.method) {
                    if (o === h) throw o = s, n.arg;
                    n.dispatchException(n.arg);
                } else "return" === n.method && n.abrupt("return", n.arg);
                o = f;
                var p = tryCatch(e, r, n);
                if ("normal" === p.type) {
                    if (o = n.done ? s : l, p.arg === y) continue;
                    return {
                        value: p.arg,
                        done: n.done
                    };
                }
                "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
            }
        };
    }
    function maybeInvokeDelegate(e, r) {
        var n = r.method, o = e.iterator[n];
        if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
        var i = tryCatch(o, e.iterator, r.arg);
        if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
        var a = i.arg;
        return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
    }
    function pushTryEntry(t) {
        var e = {
            tryLoc: t[0]
        };
        1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
    }
    function resetTryEntry(t) {
        var e = t.completion || {};
        e.type = "normal", delete e.arg, t.completion = e;
    }
    function Context(t) {
        this.tryEntries = [
            {
                tryLoc: "root"
            }
        ], t.forEach(pushTryEntry, this), this.reset(!0);
    }
    function values(e) {
        if (e || "" === e) {
            var r = e[a];
            if (r) return r.call(e);
            if ("function" == typeof e.next) return e;
            if (!isNaN(e.length)) {
                var o = -1, i = function next() {
                    for(; ++o < e.length;)if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
                    return next.value = t, next.done = !0, next;
                };
                return i.next = i;
            }
        }
        throw new TypeError(_typeof(e) + " is not iterable");
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
        value: GeneratorFunctionPrototype,
        configurable: !0
    }), o(GeneratorFunctionPrototype, "constructor", {
        value: GeneratorFunction,
        configurable: !0
    }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function(t) {
        var e = "function" == typeof t && t.constructor;
        return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
    }, e.mark = function(t) {
        return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
    }, e.awrap = function(t) {
        return {
            __await: t
        };
    }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function() {
        return this;
    }), e.AsyncIterator = AsyncIterator, e.async = function(t, r, n, o, i) {
        void 0 === i && (i = Promise);
        var a = new AsyncIterator(wrap(t, r, n, o), i);
        return e.isGeneratorFunction(r) ? a : a.next().then(function(t) {
            return t.done ? t.value : a.next();
        });
    }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function() {
        return this;
    }), define(g, "toString", function() {
        return "[object Generator]";
    }), e.keys = function(t) {
        var e = Object(t), r = [];
        for(var n in e)r.push(n);
        return r.reverse(), function next() {
            for(; r.length;){
                var t = r.pop();
                if (t in e) return next.value = t, next.done = !1, next;
            }
            return next.done = !0, next;
        };
    }, e.values = values, Context.prototype = {
        constructor: Context,
        reset: function reset(e) {
            if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for(var r in this)"t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
        },
        stop: function stop() {
            this.done = !0;
            var t = this.tryEntries[0].completion;
            if ("throw" === t.type) throw t.arg;
            return this.rval;
        },
        dispatchException: function dispatchException(e) {
            if (this.done) throw e;
            var r = this;
            function handle(n, o) {
                return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
            }
            for(var o = this.tryEntries.length - 1; o >= 0; --o){
                var i = this.tryEntries[o], a = i.completion;
                if ("root" === i.tryLoc) return handle("end");
                if (i.tryLoc <= this.prev) {
                    var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc");
                    if (c && u) {
                        if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
                        if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
                    } else if (c) {
                        if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
                    } else {
                        if (!u) throw new Error("try statement without catch or finally");
                        if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
                    }
                }
            }
        },
        abrupt: function abrupt(t, e) {
            for(var r = this.tryEntries.length - 1; r >= 0; --r){
                var o = this.tryEntries[r];
                if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
                    var i = o;
                    break;
                }
            }
            i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
            var a = i ? i.completion : {};
            return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
        },
        complete: function complete(t, e) {
            if ("throw" === t.type) throw t.arg;
            return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
        },
        finish: function finish(t) {
            for(var e = this.tryEntries.length - 1; e >= 0; --e){
                var r = this.tryEntries[e];
                if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
            }
        },
        "catch": function _catch(t) {
            for(var e = this.tryEntries.length - 1; e >= 0; --e){
                var r = this.tryEntries[e];
                if (r.tryLoc === t) {
                    var n = r.completion;
                    if ("throw" === n.type) {
                        var o = n.arg;
                        resetTryEntry(r);
                    }
                    return o;
                }
            }
            throw new Error("illegal catch attempt");
        },
        delegateYield: function delegateYield(e, r, n) {
            return this.delegate = {
                iterator: values(e),
                resultName: r,
                nextLoc: n
            }, "next" === this.method && (this.arg = t), y;
        }
    }, e;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 3573:
/***/ ((module) => {

"use strict";

function _setPrototypeOf(o, p) {
    module.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
    return _setPrototypeOf(o, p);
}
module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 3815:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var _typeof = (__webpack_require__(8940)["default"]);
function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}
module.exports = _toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 6362:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var _typeof = (__webpack_require__(8940)["default"]);
var toPrimitive = __webpack_require__(3815);
function _toPropertyKey(arg) {
    var key = toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
}
module.exports = _toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 8940:
/***/ ((module) => {

"use strict";

function _typeof(o) {
    "@babel/helpers - typeof";
    return module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
        return typeof o;
    } : function(o) {
        return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 2912:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getPrototypeOf = __webpack_require__(8638);
var setPrototypeOf = __webpack_require__(3573);
var isNativeFunction = __webpack_require__(8251);
var construct = __webpack_require__(1381);
function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;
    module.exports = _wrapNativeSuper = function _wrapNativeSuper(Class) {
        if (Class === null || !isNativeFunction(Class)) return Class;
        if (typeof Class !== "function") {
            throw new TypeError("Super expression must either be null or a function");
        }
        if (typeof _cache !== "undefined") {
            if (_cache.has(Class)) return _cache.get(Class);
            _cache.set(Class, Wrapper);
        }
        function Wrapper() {
            return construct(Class, arguments, getPrototypeOf(this).constructor);
        }
        Wrapper.prototype = Object.create(Class.prototype, {
            constructor: {
                value: Wrapper,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        return setPrototypeOf(Wrapper, Class);
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
    return _wrapNativeSuper(Class);
}
module.exports = _wrapNativeSuper, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 2764:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// TODO(Babel 8): Remove this file.

var runtime = __webpack_require__(29)();
module.exports = runtime;
// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
    regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
    if (typeof globalThis === "object") {
        globalThis.regeneratorRuntime = runtime;
    } else {
        Function("r", "regeneratorRuntime = r")(runtime);
    }
}


/***/ }),

/***/ 87:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ esm_hkdf),
  "hkdf": () => (/* binding */ esm_hkdf)
});

// EXTERNAL MODULE: external "crypto"
var external_crypto_ = __webpack_require__(6113);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/@panva+hkdf@1.1.1/node_modules/@panva/hkdf/dist/node/esm/runtime/fallback.js

/* harmony default export */ const fallback = ((digest, ikm, salt, info, keylen)=>{
    const hashlen = parseInt(digest.substr(3), 10) >> 3 || 20;
    const prk = (0,external_crypto_.createHmac)(digest, salt.byteLength ? salt : new Uint8Array(hashlen)).update(ikm).digest();
    const N = Math.ceil(keylen / hashlen);
    const T = new Uint8Array(hashlen * N + info.byteLength + 1);
    let prev = 0;
    let start = 0;
    for(let c = 1; c <= N; c++){
        T.set(info, start);
        T[start + info.byteLength] = c;
        T.set((0,external_crypto_.createHmac)(digest, prk).update(T.subarray(prev, start + info.byteLength + 1)).digest(), start);
        prev = start;
        start += hashlen;
    }
    return T.slice(0, keylen);
});

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@panva+hkdf@1.1.1/node_modules/@panva/hkdf/dist/node/esm/runtime/hkdf.js


let hkdf;
if (typeof external_crypto_.hkdf === "function" && !process.versions.electron) {
    hkdf = async (...args)=>new Promise((resolve, reject)=>{
            external_crypto_.hkdf(...args, (err, arrayBuffer)=>{
                if (err) reject(err);
                else resolve(new Uint8Array(arrayBuffer));
            });
        });
}
/* harmony default export */ const runtime_hkdf = (async (digest, ikm, salt, info, keylen)=>(hkdf || fallback)(digest, ikm, salt, info, keylen));

;// CONCATENATED MODULE: ../../node_modules/.pnpm/@panva+hkdf@1.1.1/node_modules/@panva/hkdf/dist/node/esm/index.js

function normalizeDigest(digest) {
    switch(digest){
        case "sha256":
        case "sha384":
        case "sha512":
        case "sha1":
            return digest;
        default:
            throw new TypeError('unsupported "digest" value');
    }
}
function normalizeUint8Array(input, label) {
    if (typeof input === "string") return new TextEncoder().encode(input);
    if (!(input instanceof Uint8Array)) throw new TypeError(`"${label}"" must be an instance of Uint8Array or a string`);
    return input;
}
function normalizeIkm(input) {
    const ikm = normalizeUint8Array(input, "ikm");
    if (!ikm.byteLength) throw new TypeError(`"ikm" must be at least one byte in length`);
    return ikm;
}
function normalizeInfo(input) {
    const info = normalizeUint8Array(input, "info");
    if (info.byteLength > 1024) {
        throw TypeError('"info" must not contain more than 1024 bytes');
    }
    return info;
}
function normalizeKeylen(input, digest) {
    if (typeof input !== "number" || !Number.isInteger(input) || input < 1) {
        throw new TypeError('"keylen" must be a positive integer');
    }
    const hashlen = parseInt(digest.substr(3), 10) >> 3 || 20;
    if (input > 255 * hashlen) {
        throw new TypeError('"keylen" too large');
    }
    return input;
}
async function esm_hkdf(digest, ikm, salt, info, keylen) {
    return runtime_hkdf(normalizeDigest(digest), normalizeIkm(ikm), normalizeUint8Array(salt, "salt"), normalizeInfo(info), normalizeKeylen(keylen, digest));
}



/***/ }),

/***/ 5922:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "CompactEncrypt": () => (/* reexport */ CompactEncrypt),
  "CompactSign": () => (/* reexport */ CompactSign),
  "EmbeddedJWK": () => (/* reexport */ EmbeddedJWK),
  "EncryptJWT": () => (/* reexport */ EncryptJWT),
  "FlattenedEncrypt": () => (/* reexport */ FlattenedEncrypt),
  "FlattenedSign": () => (/* reexport */ FlattenedSign),
  "GeneralEncrypt": () => (/* reexport */ GeneralEncrypt),
  "GeneralSign": () => (/* reexport */ GeneralSign),
  "SignJWT": () => (/* reexport */ SignJWT),
  "UnsecuredJWT": () => (/* reexport */ UnsecuredJWT),
  "base64url": () => (/* reexport */ util_base64url_namespaceObject),
  "calculateJwkThumbprint": () => (/* reexport */ calculateJwkThumbprint),
  "calculateJwkThumbprintUri": () => (/* reexport */ calculateJwkThumbprintUri),
  "compactDecrypt": () => (/* reexport */ compactDecrypt),
  "compactVerify": () => (/* reexport */ compactVerify),
  "createLocalJWKSet": () => (/* reexport */ createLocalJWKSet),
  "createRemoteJWKSet": () => (/* reexport */ createRemoteJWKSet),
  "decodeJwt": () => (/* reexport */ decodeJwt),
  "decodeProtectedHeader": () => (/* reexport */ decodeProtectedHeader),
  "errors": () => (/* reexport */ errors_namespaceObject),
  "exportJWK": () => (/* reexport */ exportJWK),
  "exportPKCS8": () => (/* reexport */ exportPKCS8),
  "exportSPKI": () => (/* reexport */ exportSPKI),
  "flattenedDecrypt": () => (/* reexport */ flattenedDecrypt),
  "flattenedVerify": () => (/* reexport */ flattenedVerify),
  "generalDecrypt": () => (/* reexport */ generalDecrypt),
  "generalVerify": () => (/* reexport */ generalVerify),
  "generateKeyPair": () => (/* reexport */ generate_key_pair_generateKeyPair),
  "generateSecret": () => (/* reexport */ generate_secret_generateSecret),
  "importJWK": () => (/* reexport */ importJWK),
  "importPKCS8": () => (/* reexport */ importPKCS8),
  "importSPKI": () => (/* reexport */ importSPKI),
  "importX509": () => (/* reexport */ importX509),
  "jwtDecrypt": () => (/* reexport */ jwtDecrypt),
  "jwtVerify": () => (/* reexport */ jwtVerify)
});

// NAMESPACE OBJECT: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/util/errors.js
var errors_namespaceObject = {};
__webpack_require__.r(errors_namespaceObject);
__webpack_require__.d(errors_namespaceObject, {
  "JOSEAlgNotAllowed": () => (JOSEAlgNotAllowed),
  "JOSEError": () => (JOSEError),
  "JOSENotSupported": () => (JOSENotSupported),
  "JWEDecryptionFailed": () => (JWEDecryptionFailed),
  "JWEInvalid": () => (JWEInvalid),
  "JWKInvalid": () => (JWKInvalid),
  "JWKSInvalid": () => (JWKSInvalid),
  "JWKSMultipleMatchingKeys": () => (JWKSMultipleMatchingKeys),
  "JWKSNoMatchingKey": () => (JWKSNoMatchingKey),
  "JWKSTimeout": () => (JWKSTimeout),
  "JWSInvalid": () => (JWSInvalid),
  "JWSSignatureVerificationFailed": () => (JWSSignatureVerificationFailed),
  "JWTClaimValidationFailed": () => (JWTClaimValidationFailed),
  "JWTExpired": () => (JWTExpired),
  "JWTInvalid": () => (JWTInvalid)
});

// NAMESPACE OBJECT: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/util/base64url.js
var util_base64url_namespaceObject = {};
__webpack_require__.r(util_base64url_namespaceObject);
__webpack_require__.d(util_base64url_namespaceObject, {
  "decode": () => (base64url_decode),
  "encode": () => (base64url_encode)
});

// EXTERNAL MODULE: external "buffer"
var external_buffer_ = __webpack_require__(4300);
// EXTERNAL MODULE: external "crypto"
var external_crypto_ = __webpack_require__(6113);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/digest.js

const digest = (algorithm, data)=>(0,external_crypto_.createHash)(algorithm).update(data).digest();
/* harmony default export */ const runtime_digest = (digest);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/lib/buffer_utils.js

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const MAX_INT32 = 2 ** 32;
function concat(...buffers) {
    const size = buffers.reduce((acc, { length  })=>acc + length, 0);
    const buf = new Uint8Array(size);
    let i = 0;
    buffers.forEach((buffer)=>{
        buf.set(buffer, i);
        i += buffer.length;
    });
    return buf;
}
function buffer_utils_p2s(alg, p2sInput) {
    return concat(encoder.encode(alg), new Uint8Array([
        0
    ]), p2sInput);
}
function writeUInt32BE(buf, value, offset) {
    if (value < 0 || value >= MAX_INT32) {
        throw new RangeError(`value must be >= 0 and <= ${MAX_INT32 - 1}. Received ${value}`);
    }
    buf.set([
        value >>> 24,
        value >>> 16,
        value >>> 8,
        value & 0xff
    ], offset);
}
function uint64be(value) {
    const high = Math.floor(value / MAX_INT32);
    const low = value % MAX_INT32;
    const buf = new Uint8Array(8);
    writeUInt32BE(buf, high, 0);
    writeUInt32BE(buf, low, 4);
    return buf;
}
function uint32be(value) {
    const buf = new Uint8Array(4);
    writeUInt32BE(buf, value);
    return buf;
}
function lengthAndInput(input) {
    return concat(uint32be(input.length), input);
}
async function concatKdf(secret, bits, value) {
    const iterations = Math.ceil((bits >> 3) / 32);
    const res = new Uint8Array(iterations * 32);
    for(let iter = 0; iter < iterations; iter++){
        const buf = new Uint8Array(4 + secret.length + value.length);
        buf.set(uint32be(iter + 1));
        buf.set(secret, 4);
        buf.set(value, 4 + secret.length);
        res.set(await runtime_digest("sha256", buf), iter * 32);
    }
    return res.slice(0, bits >> 3);
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/base64url.js


let encode;
function normalize(input) {
    let encoded = input;
    if (encoded instanceof Uint8Array) {
        encoded = decoder.decode(encoded);
    }
    return encoded;
}
if (external_buffer_.Buffer.isEncoding("base64url")) {
    encode = (input)=>external_buffer_.Buffer.from(input).toString("base64url");
} else {
    encode = (input)=>external_buffer_.Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
const decodeBase64 = (input)=>Buffer.from(input, "base64");
const encodeBase64 = (input)=>Buffer.from(input).toString("base64");

const decode = (input)=>external_buffer_.Buffer.from(normalize(input), "base64");

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/util/errors.js
class JOSEError extends Error {
    static get code() {
        return "ERR_JOSE_GENERIC";
    }
    constructor(message){
        var _a;
        super(message);
        this.code = "ERR_JOSE_GENERIC";
        this.name = this.constructor.name;
        (_a = Error.captureStackTrace) === null || _a === void 0 ? void 0 : _a.call(Error, this, this.constructor);
    }
}
class JWTClaimValidationFailed extends JOSEError {
    static get code() {
        return "ERR_JWT_CLAIM_VALIDATION_FAILED";
    }
    constructor(message, claim = "unspecified", reason = "unspecified"){
        super(message);
        this.code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
        this.claim = claim;
        this.reason = reason;
    }
}
class JWTExpired extends JOSEError {
    static get code() {
        return "ERR_JWT_EXPIRED";
    }
    constructor(message, claim = "unspecified", reason = "unspecified"){
        super(message);
        this.code = "ERR_JWT_EXPIRED";
        this.claim = claim;
        this.reason = reason;
    }
}
class JOSEAlgNotAllowed extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JOSE_ALG_NOT_ALLOWED";
    }
    static get code() {
        return "ERR_JOSE_ALG_NOT_ALLOWED";
    }
}
class JOSENotSupported extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JOSE_NOT_SUPPORTED";
    }
    static get code() {
        return "ERR_JOSE_NOT_SUPPORTED";
    }
}
class JWEDecryptionFailed extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JWE_DECRYPTION_FAILED";
        this.message = "decryption operation failed";
    }
    static get code() {
        return "ERR_JWE_DECRYPTION_FAILED";
    }
}
class JWEInvalid extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JWE_INVALID";
    }
    static get code() {
        return "ERR_JWE_INVALID";
    }
}
class JWSInvalid extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JWS_INVALID";
    }
    static get code() {
        return "ERR_JWS_INVALID";
    }
}
class JWTInvalid extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JWT_INVALID";
    }
    static get code() {
        return "ERR_JWT_INVALID";
    }
}
class JWKInvalid extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JWK_INVALID";
    }
    static get code() {
        return "ERR_JWK_INVALID";
    }
}
class JWKSInvalid extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JWKS_INVALID";
    }
    static get code() {
        return "ERR_JWKS_INVALID";
    }
}
class JWKSNoMatchingKey extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JWKS_NO_MATCHING_KEY";
        this.message = "no applicable key found in the JSON Web Key Set";
    }
    static get code() {
        return "ERR_JWKS_NO_MATCHING_KEY";
    }
}
class JWKSMultipleMatchingKeys extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
        this.message = "multiple matching keys found in the JSON Web Key Set";
    }
    static get code() {
        return "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
    }
}
Symbol.asyncIterator;
class JWKSTimeout extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JWKS_TIMEOUT";
        this.message = "request timed out";
    }
    static get code() {
        return "ERR_JWKS_TIMEOUT";
    }
}
class JWSSignatureVerificationFailed extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
        this.message = "signature verification failed";
    }
    static get code() {
        return "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/random.js


;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/lib/iv.js


function bitLength(alg) {
    switch(alg){
        case "A128GCM":
        case "A128GCMKW":
        case "A192GCM":
        case "A192GCMKW":
        case "A256GCM":
        case "A256GCMKW":
            return 96;
        case "A128CBC-HS256":
        case "A192CBC-HS384":
        case "A256CBC-HS512":
            return 128;
        default:
            throw new JOSENotSupported(`Unsupported JWE Algorithm: ${alg}`);
    }
}
/* harmony default export */ const lib_iv = ((alg)=>(0,external_crypto_.randomFillSync)(new Uint8Array(bitLength(alg) >> 3)));

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/lib/check_iv_length.js


const checkIvLength = (enc, iv)=>{
    if (iv.length << 3 !== bitLength(enc)) {
        throw new JWEInvalid("Invalid Initialization Vector length");
    }
};
/* harmony default export */ const check_iv_length = (checkIvLength);

// EXTERNAL MODULE: external "util"
var external_util_ = __webpack_require__(3837);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/is_key_object.js


/* harmony default export */ const is_key_object = (external_util_.types.isKeyObject ? (obj)=>external_util_.types.isKeyObject(obj) : (obj)=>obj != null && obj instanceof external_crypto_.KeyObject);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/check_cek_length.js


const checkCekLength = (enc, cek)=>{
    let expected;
    switch(enc){
        case "A128CBC-HS256":
        case "A192CBC-HS384":
        case "A256CBC-HS512":
            expected = parseInt(enc.slice(-3), 10);
            break;
        case "A128GCM":
        case "A192GCM":
        case "A256GCM":
            expected = parseInt(enc.slice(1, 4), 10);
            break;
        default:
            throw new JOSENotSupported(`Content Encryption Algorithm ${enc} is not supported either by JOSE or your javascript runtime`);
    }
    if (cek instanceof Uint8Array) {
        const actual = cek.byteLength << 3;
        if (actual !== expected) {
            throw new JWEInvalid(`Invalid Content Encryption Key length. Expected ${expected} bits, got ${actual} bits`);
        }
        return;
    }
    if (is_key_object(cek) && cek.type === "secret") {
        const actual = cek.symmetricKeySize << 3;
        if (actual !== expected) {
            throw new JWEInvalid(`Invalid Content Encryption Key length. Expected ${expected} bits, got ${actual} bits`);
        }
        return;
    }
    throw new TypeError("Invalid Content Encryption Key type");
};
/* harmony default export */ const check_cek_length = (checkCekLength);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/timing_safe_equal.js

const timingSafeEqual = external_crypto_.timingSafeEqual;
/* harmony default export */ const timing_safe_equal = (timingSafeEqual);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/cbc_tag.js


function cbcTag(aad, iv, ciphertext, macSize, macKey, keySize) {
    const macData = concat(aad, iv, ciphertext, uint64be(aad.length << 3));
    const hmac = (0,external_crypto_.createHmac)(`sha${macSize}`, macKey);
    hmac.update(macData);
    return hmac.digest().slice(0, keySize >> 3);
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/webcrypto.js


const webcrypto = external_crypto_.webcrypto;
/* harmony default export */ const runtime_webcrypto = (webcrypto);
const isCryptoKey = external_util_.types.isCryptoKey ? (key)=>external_util_.types.isCryptoKey(key) : (key)=>false;

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/lib/crypto_key.js
function unusable(name, prop = "algorithm.name") {
    return new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`);
}
function isAlgorithm(algorithm, name) {
    return algorithm.name === name;
}
function getHashLength(hash) {
    return parseInt(hash.name.slice(4), 10);
}
function getNamedCurve(alg) {
    switch(alg){
        case "ES256":
            return "P-256";
        case "ES384":
            return "P-384";
        case "ES512":
            return "P-521";
        default:
            throw new Error("unreachable");
    }
}
function checkUsage(key, usages) {
    if (usages.length && !usages.some((expected)=>key.usages.includes(expected))) {
        let msg = "CryptoKey does not support this operation, its usages must include ";
        if (usages.length > 2) {
            const last = usages.pop();
            msg += `one of ${usages.join(", ")}, or ${last}.`;
        } else if (usages.length === 2) {
            msg += `one of ${usages[0]} or ${usages[1]}.`;
        } else {
            msg += `${usages[0]}.`;
        }
        throw new TypeError(msg);
    }
}
function checkSigCryptoKey(key, alg, ...usages) {
    switch(alg){
        case "HS256":
        case "HS384":
        case "HS512":
            {
                if (!isAlgorithm(key.algorithm, "HMAC")) throw unusable("HMAC");
                const expected = parseInt(alg.slice(2), 10);
                const actual = getHashLength(key.algorithm.hash);
                if (actual !== expected) throw unusable(`SHA-${expected}`, "algorithm.hash");
                break;
            }
        case "RS256":
        case "RS384":
        case "RS512":
            {
                if (!isAlgorithm(key.algorithm, "RSASSA-PKCS1-v1_5")) throw unusable("RSASSA-PKCS1-v1_5");
                const expected = parseInt(alg.slice(2), 10);
                const actual = getHashLength(key.algorithm.hash);
                if (actual !== expected) throw unusable(`SHA-${expected}`, "algorithm.hash");
                break;
            }
        case "PS256":
        case "PS384":
        case "PS512":
            {
                if (!isAlgorithm(key.algorithm, "RSA-PSS")) throw unusable("RSA-PSS");
                const expected = parseInt(alg.slice(2), 10);
                const actual = getHashLength(key.algorithm.hash);
                if (actual !== expected) throw unusable(`SHA-${expected}`, "algorithm.hash");
                break;
            }
        case "EdDSA":
            {
                if (key.algorithm.name !== "Ed25519" && key.algorithm.name !== "Ed448") {
                    throw unusable("Ed25519 or Ed448");
                }
                break;
            }
        case "ES256":
        case "ES384":
        case "ES512":
            {
                if (!isAlgorithm(key.algorithm, "ECDSA")) throw unusable("ECDSA");
                const expected = getNamedCurve(alg);
                const actual = key.algorithm.namedCurve;
                if (actual !== expected) throw unusable(expected, "algorithm.namedCurve");
                break;
            }
        default:
            throw new TypeError("CryptoKey does not support this operation");
    }
    checkUsage(key, usages);
}
function checkEncCryptoKey(key, alg, ...usages) {
    switch(alg){
        case "A128GCM":
        case "A192GCM":
        case "A256GCM":
            {
                if (!isAlgorithm(key.algorithm, "AES-GCM")) throw unusable("AES-GCM");
                const expected = parseInt(alg.slice(1, 4), 10);
                const actual = key.algorithm.length;
                if (actual !== expected) throw unusable(expected, "algorithm.length");
                break;
            }
        case "A128KW":
        case "A192KW":
        case "A256KW":
            {
                if (!isAlgorithm(key.algorithm, "AES-KW")) throw unusable("AES-KW");
                const expected = parseInt(alg.slice(1, 4), 10);
                const actual = key.algorithm.length;
                if (actual !== expected) throw unusable(expected, "algorithm.length");
                break;
            }
        case "ECDH":
            {
                switch(key.algorithm.name){
                    case "ECDH":
                    case "X25519":
                    case "X448":
                        break;
                    default:
                        throw unusable("ECDH, X25519, or X448");
                }
                break;
            }
        case "PBES2-HS256+A128KW":
        case "PBES2-HS384+A192KW":
        case "PBES2-HS512+A256KW":
            if (!isAlgorithm(key.algorithm, "PBKDF2")) throw unusable("PBKDF2");
            break;
        case "RSA-OAEP":
        case "RSA-OAEP-256":
        case "RSA-OAEP-384":
        case "RSA-OAEP-512":
            {
                if (!isAlgorithm(key.algorithm, "RSA-OAEP")) throw unusable("RSA-OAEP");
                const expected = parseInt(alg.slice(9), 10) || 1;
                const actual = getHashLength(key.algorithm.hash);
                if (actual !== expected) throw unusable(`SHA-${expected}`, "algorithm.hash");
                break;
            }
        default:
            throw new TypeError("CryptoKey does not support this operation");
    }
    checkUsage(key, usages);
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/lib/invalid_key_input.js
function message(msg, actual, ...types) {
    if (types.length > 2) {
        const last = types.pop();
        msg += `one of type ${types.join(", ")}, or ${last}.`;
    } else if (types.length === 2) {
        msg += `one of type ${types[0]} or ${types[1]}.`;
    } else {
        msg += `of type ${types[0]}.`;
    }
    if (actual == null) {
        msg += ` Received ${actual}`;
    } else if (typeof actual === "function" && actual.name) {
        msg += ` Received function ${actual.name}`;
    } else if (typeof actual === "object" && actual != null) {
        if (actual.constructor && actual.constructor.name) {
            msg += ` Received an instance of ${actual.constructor.name}`;
        }
    }
    return msg;
}
/* harmony default export */ const invalid_key_input = ((actual, ...types)=>{
    return message("Key must be ", actual, ...types);
});
function withAlg(alg, actual, ...types) {
    return message(`Key for the ${alg} algorithm must be `, actual, ...types);
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/ciphers.js

let ciphers;
/* harmony default export */ const runtime_ciphers = ((algorithm)=>{
    ciphers || (ciphers = new Set((0,external_crypto_.getCiphers)()));
    return ciphers.has(algorithm);
});

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/is_key_like.js


/* harmony default export */ const is_key_like = ((key)=>is_key_object(key) || isCryptoKey(key));
const types = [
    "KeyObject"
];
if (globalThis.CryptoKey || (runtime_webcrypto === null || runtime_webcrypto === void 0 ? void 0 : runtime_webcrypto.CryptoKey)) {
    types.push("CryptoKey");
}


;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/decrypt.js













function cbcDecrypt(enc, cek, ciphertext, iv, tag, aad) {
    const keySize = parseInt(enc.slice(1, 4), 10);
    if (is_key_object(cek)) {
        cek = cek.export();
    }
    const encKey = cek.subarray(keySize >> 3);
    const macKey = cek.subarray(0, keySize >> 3);
    const macSize = parseInt(enc.slice(-3), 10);
    const algorithm = `aes-${keySize}-cbc`;
    if (!runtime_ciphers(algorithm)) {
        throw new JOSENotSupported(`alg ${enc} is not supported by your javascript runtime`);
    }
    const expectedTag = cbcTag(aad, iv, ciphertext, macSize, macKey, keySize);
    let macCheckPassed;
    try {
        macCheckPassed = timing_safe_equal(tag, expectedTag);
    } catch  {}
    if (!macCheckPassed) {
        throw new JWEDecryptionFailed();
    }
    let plaintext;
    try {
        const decipher = (0,external_crypto_.createDecipheriv)(algorithm, encKey, iv);
        plaintext = concat(decipher.update(ciphertext), decipher.final());
    } catch  {}
    if (!plaintext) {
        throw new JWEDecryptionFailed();
    }
    return plaintext;
}
function gcmDecrypt(enc, cek, ciphertext, iv, tag, aad) {
    const keySize = parseInt(enc.slice(1, 4), 10);
    const algorithm = `aes-${keySize}-gcm`;
    if (!runtime_ciphers(algorithm)) {
        throw new JOSENotSupported(`alg ${enc} is not supported by your javascript runtime`);
    }
    try {
        const decipher = (0,external_crypto_.createDecipheriv)(algorithm, cek, iv, {
            authTagLength: 16
        });
        decipher.setAuthTag(tag);
        if (aad.byteLength) {
            decipher.setAAD(aad, {
                plaintextLength: ciphertext.length
            });
        }
        const plaintext = decipher.update(ciphertext);
        decipher.final();
        return plaintext;
    } catch  {
        throw new JWEDecryptionFailed();
    }
}
const decrypt = (enc, cek, ciphertext, iv, tag, aad)=>{
    let key;
    if (isCryptoKey(cek)) {
        checkEncCryptoKey(cek, enc, "decrypt");
        key = external_crypto_.KeyObject.from(cek);
    } else if (cek instanceof Uint8Array || is_key_object(cek)) {
        key = cek;
    } else {
        throw new TypeError(invalid_key_input(cek, ...types, "Uint8Array"));
    }
    check_cek_length(enc, key);
    check_iv_length(enc, iv);
    switch(enc){
        case "A128CBC-HS256":
        case "A192CBC-HS384":
        case "A256CBC-HS512":
            return cbcDecrypt(enc, key, ciphertext, iv, tag, aad);
        case "A128GCM":
        case "A192GCM":
        case "A256GCM":
            return gcmDecrypt(enc, key, ciphertext, iv, tag, aad);
        default:
            throw new JOSENotSupported("Unsupported JWE Content Encryption Algorithm");
    }
};
/* harmony default export */ const runtime_decrypt = (decrypt);

// EXTERNAL MODULE: external "zlib"
var external_zlib_ = __webpack_require__(9796);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/zlib.js


const inflateRaw = (0,external_util_.promisify)(external_zlib_.inflateRaw);
const deflateRaw = (0,external_util_.promisify)(external_zlib_.deflateRaw);
const inflate = (input)=>inflateRaw(input);
const deflate = (input)=>deflateRaw(input);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/lib/is_disjoint.js
const isDisjoint = (...headers)=>{
    const sources = headers.filter(Boolean);
    if (sources.length === 0 || sources.length === 1) {
        return true;
    }
    let acc;
    for (const header of sources){
        const parameters = Object.keys(header);
        if (!acc || acc.size === 0) {
            acc = new Set(parameters);
            continue;
        }
        for (const parameter of parameters){
            if (acc.has(parameter)) {
                return false;
            }
            acc.add(parameter);
        }
    }
    return true;
};
/* harmony default export */ const is_disjoint = (isDisjoint);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/lib/is_object.js
function isObjectLike(value) {
    return typeof value === "object" && value !== null;
}
function isObject(input) {
    if (!isObjectLike(input) || Object.prototype.toString.call(input) !== "[object Object]") {
        return false;
    }
    if (Object.getPrototypeOf(input) === null) {
        return true;
    }
    let proto = input;
    while(Object.getPrototypeOf(proto) !== null){
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(input) === proto;
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/aeskw.js










function checkKeySize(key, alg) {
    if (key.symmetricKeySize << 3 !== parseInt(alg.slice(1, 4), 10)) {
        throw new TypeError(`Invalid key size for alg: ${alg}`);
    }
}
function ensureKeyObject(key, alg, usage) {
    if (is_key_object(key)) {
        return key;
    }
    if (key instanceof Uint8Array) {
        return (0,external_crypto_.createSecretKey)(key);
    }
    if (isCryptoKey(key)) {
        checkEncCryptoKey(key, alg, usage);
        return external_crypto_.KeyObject.from(key);
    }
    throw new TypeError(invalid_key_input(key, ...types, "Uint8Array"));
}
const wrap = (alg, key, cek)=>{
    const size = parseInt(alg.slice(1, 4), 10);
    const algorithm = `aes${size}-wrap`;
    if (!runtime_ciphers(algorithm)) {
        throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
    const keyObject = ensureKeyObject(key, alg, "wrapKey");
    checkKeySize(keyObject, alg);
    const cipher = (0,external_crypto_.createCipheriv)(algorithm, keyObject, external_buffer_.Buffer.alloc(8, 0xa6));
    return concat(cipher.update(cek), cipher.final());
};
const unwrap = (alg, key, encryptedKey)=>{
    const size = parseInt(alg.slice(1, 4), 10);
    const algorithm = `aes${size}-wrap`;
    if (!runtime_ciphers(algorithm)) {
        throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
    const keyObject = ensureKeyObject(key, alg, "unwrapKey");
    checkKeySize(keyObject, alg);
    const cipher = (0,external_crypto_.createDecipheriv)(algorithm, keyObject, external_buffer_.Buffer.alloc(8, 0xa6));
    return concat(cipher.update(encryptedKey), cipher.final());
};

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/get_named_curve.js







const p256 = external_buffer_.Buffer.from([
    42,
    134,
    72,
    206,
    61,
    3,
    1,
    7
]);
const p384 = external_buffer_.Buffer.from([
    43,
    129,
    4,
    0,
    34
]);
const p521 = external_buffer_.Buffer.from([
    43,
    129,
    4,
    0,
    35
]);
const secp256k1 = external_buffer_.Buffer.from([
    43,
    129,
    4,
    0,
    10
]);
const weakMap = new WeakMap();
const namedCurveToJOSE = (namedCurve)=>{
    switch(namedCurve){
        case "prime256v1":
            return "P-256";
        case "secp384r1":
            return "P-384";
        case "secp521r1":
            return "P-521";
        case "secp256k1":
            return "secp256k1";
        default:
            throw new JOSENotSupported("Unsupported key curve for this operation");
    }
};
const get_named_curve_getNamedCurve = (kee, raw)=>{
    var _a;
    let key;
    if (isCryptoKey(kee)) {
        key = external_crypto_.KeyObject.from(kee);
    } else if (is_key_object(kee)) {
        key = kee;
    } else {
        throw new TypeError(invalid_key_input(kee, ...types));
    }
    if (key.type === "secret") {
        throw new TypeError('only "private" or "public" type keys can be used for this operation');
    }
    switch(key.asymmetricKeyType){
        case "ed25519":
        case "ed448":
            return `Ed${key.asymmetricKeyType.slice(2)}`;
        case "x25519":
        case "x448":
            return `X${key.asymmetricKeyType.slice(1)}`;
        case "ec":
            {
                if (weakMap.has(key)) {
                    return weakMap.get(key);
                }
                let namedCurve = (_a = key.asymmetricKeyDetails) === null || _a === void 0 ? void 0 : _a.namedCurve;
                if (!namedCurve && key.type === "private") {
                    namedCurve = get_named_curve_getNamedCurve((0,external_crypto_.createPublicKey)(key), true);
                } else if (!namedCurve) {
                    const buf = key.export({
                        format: "der",
                        type: "spki"
                    });
                    const i = buf[1] < 128 ? 14 : 15;
                    const len = buf[i];
                    const curveOid = buf.slice(i + 1, i + 1 + len);
                    if (curveOid.equals(p256)) {
                        namedCurve = "prime256v1";
                    } else if (curveOid.equals(p384)) {
                        namedCurve = "secp384r1";
                    } else if (curveOid.equals(p521)) {
                        namedCurve = "secp521r1";
                    } else if (curveOid.equals(secp256k1)) {
                        namedCurve = "secp256k1";
                    } else {
                        throw new JOSENotSupported("Unsupported key curve for this operation");
                    }
                }
                if (raw) return namedCurve;
                const curve = namedCurveToJOSE(namedCurve);
                weakMap.set(key, curve);
                return curve;
            }
        default:
            throw new TypeError("Invalid asymmetric key type for this operation");
    }
};
function setCurve(keyObject, curve) {
    weakMap.set(keyObject, curve);
}
/* harmony default export */ const get_named_curve = (get_named_curve_getNamedCurve);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/ecdhes.js










const generateKeyPair = (0,external_util_.promisify)(external_crypto_.generateKeyPair);
async function deriveKey(publicKee, privateKee, algorithm, keyLength, apu = new Uint8Array(0), apv = new Uint8Array(0)) {
    let publicKey;
    if (isCryptoKey(publicKee)) {
        checkEncCryptoKey(publicKee, "ECDH");
        publicKey = external_crypto_.KeyObject.from(publicKee);
    } else if (is_key_object(publicKee)) {
        publicKey = publicKee;
    } else {
        throw new TypeError(invalid_key_input(publicKee, ...types));
    }
    let privateKey;
    if (isCryptoKey(privateKee)) {
        checkEncCryptoKey(privateKee, "ECDH", "deriveBits");
        privateKey = external_crypto_.KeyObject.from(privateKee);
    } else if (is_key_object(privateKee)) {
        privateKey = privateKee;
    } else {
        throw new TypeError(invalid_key_input(privateKee, ...types));
    }
    const value = concat(lengthAndInput(encoder.encode(algorithm)), lengthAndInput(apu), lengthAndInput(apv), uint32be(keyLength));
    const sharedSecret = (0,external_crypto_.diffieHellman)({
        privateKey,
        publicKey
    });
    return concatKdf(sharedSecret, keyLength, value);
}
async function generateEpk(kee) {
    let key;
    if (isCryptoKey(kee)) {
        key = external_crypto_.KeyObject.from(kee);
    } else if (is_key_object(kee)) {
        key = kee;
    } else {
        throw new TypeError(invalid_key_input(kee, ...types));
    }
    switch(key.asymmetricKeyType){
        case "x25519":
            return generateKeyPair("x25519");
        case "x448":
            {
                return generateKeyPair("x448");
            }
        case "ec":
            {
                const namedCurve = get_named_curve(key);
                return generateKeyPair("ec", {
                    namedCurve
                });
            }
        default:
            throw new JOSENotSupported("Invalid or unsupported EPK");
    }
}
const ecdhAllowed = (key)=>[
        "P-256",
        "P-384",
        "P-521",
        "X25519",
        "X448"
    ].includes(get_named_curve(key));

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/lib/check_p2s.js

function checkP2s(p2s) {
    if (!(p2s instanceof Uint8Array) || p2s.length < 8) {
        throw new JWEInvalid("PBES2 Salt Input must be 8 or more octets");
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/pbes2kw.js












const pbkdf2 = (0,external_util_.promisify)(external_crypto_.pbkdf2);
function getPassword(key, alg) {
    if (is_key_object(key)) {
        return key.export();
    }
    if (key instanceof Uint8Array) {
        return key;
    }
    if (isCryptoKey(key)) {
        checkEncCryptoKey(key, alg, "deriveBits", "deriveKey");
        return external_crypto_.KeyObject.from(key).export();
    }
    throw new TypeError(invalid_key_input(key, ...types, "Uint8Array"));
}
const encrypt = async (alg, key, cek, p2c = 2048, p2s = (0,external_crypto_.randomFillSync)(new Uint8Array(16)))=>{
    checkP2s(p2s);
    const salt = buffer_utils_p2s(alg, p2s);
    const keylen = parseInt(alg.slice(13, 16), 10) >> 3;
    const password = getPassword(key, alg);
    const derivedKey = await pbkdf2(password, salt, p2c, keylen, `sha${alg.slice(8, 11)}`);
    const encryptedKey = await wrap(alg.slice(-6), derivedKey, cek);
    return {
        encryptedKey,
        p2c,
        p2s: encode(p2s)
    };
};
const pbes2kw_decrypt = async (alg, key, encryptedKey, p2c, p2s)=>{
    checkP2s(p2s);
    const salt = buffer_utils_p2s(alg, p2s);
    const keylen = parseInt(alg.slice(13, 16), 10) >> 3;
    const password = getPassword(key, alg);
    const derivedKey = await pbkdf2(password, salt, p2c, keylen, `sha${alg.slice(8, 11)}`);
    return unwrap(alg.slice(-6), derivedKey, encryptedKey);
};

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/check_modulus_length.js
const check_modulus_length_weakMap = new WeakMap();
const getLength = (buf, index)=>{
    let len = buf.readUInt8(1);
    if ((len & 0x80) === 0) {
        if (index === 0) {
            return len;
        }
        return getLength(buf.subarray(2 + len), index - 1);
    }
    const num = len & 0x7f;
    len = 0;
    for(let i = 0; i < num; i++){
        len <<= 8;
        const j = buf.readUInt8(2 + i);
        len |= j;
    }
    if (index === 0) {
        return len;
    }
    return getLength(buf.subarray(2 + len), index - 1);
};
const getLengthOfSeqIndex = (sequence, index)=>{
    const len = sequence.readUInt8(1);
    if ((len & 0x80) === 0) {
        return getLength(sequence.subarray(2), index);
    }
    const num = len & 0x7f;
    return getLength(sequence.subarray(2 + num), index);
};
const getModulusLength = (key)=>{
    var _a, _b;
    if (check_modulus_length_weakMap.has(key)) {
        return check_modulus_length_weakMap.get(key);
    }
    const modulusLength = (_b = (_a = key.asymmetricKeyDetails) === null || _a === void 0 ? void 0 : _a.modulusLength) !== null && _b !== void 0 ? _b : getLengthOfSeqIndex(key.export({
        format: "der",
        type: "pkcs1"
    }), key.type === "private" ? 1 : 0) - 1 << 3;
    check_modulus_length_weakMap.set(key, modulusLength);
    return modulusLength;
};
const setModulusLength = (keyObject, modulusLength)=>{
    check_modulus_length_weakMap.set(keyObject, modulusLength);
};
/* harmony default export */ const check_modulus_length = ((key, alg)=>{
    if (getModulusLength(key) < 2048) {
        throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
    }
});

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/rsaes.js







const checkKey = (key, alg)=>{
    if (key.asymmetricKeyType !== "rsa") {
        throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be rsa");
    }
    check_modulus_length(key, alg);
};
const resolvePadding = (alg)=>{
    switch(alg){
        case "RSA-OAEP":
        case "RSA-OAEP-256":
        case "RSA-OAEP-384":
        case "RSA-OAEP-512":
            return external_crypto_.constants.RSA_PKCS1_OAEP_PADDING;
        case "RSA1_5":
            return external_crypto_.constants.RSA_PKCS1_PADDING;
        default:
            return undefined;
    }
};
const resolveOaepHash = (alg)=>{
    switch(alg){
        case "RSA-OAEP":
            return "sha1";
        case "RSA-OAEP-256":
            return "sha256";
        case "RSA-OAEP-384":
            return "sha384";
        case "RSA-OAEP-512":
            return "sha512";
        default:
            return undefined;
    }
};
function rsaes_ensureKeyObject(key, alg, ...usages) {
    if (is_key_object(key)) {
        return key;
    }
    if (isCryptoKey(key)) {
        checkEncCryptoKey(key, alg, ...usages);
        return external_crypto_.KeyObject.from(key);
    }
    throw new TypeError(invalid_key_input(key, ...types));
}
const rsaes_encrypt = (alg, key, cek)=>{
    const padding = resolvePadding(alg);
    const oaepHash = resolveOaepHash(alg);
    const keyObject = rsaes_ensureKeyObject(key, alg, "wrapKey", "encrypt");
    checkKey(keyObject, alg);
    return (0,external_crypto_.publicEncrypt)({
        key: keyObject,
        oaepHash,
        padding
    }, cek);
};
const rsaes_decrypt = (alg, key, encryptedKey)=>{
    const padding = resolvePadding(alg);
    const oaepHash = resolveOaepHash(alg);
    const keyObject = rsaes_ensureKeyObject(key, alg, "unwrapKey", "decrypt");
    checkKey(keyObject, alg);
    return (0,external_crypto_.privateDecrypt)({
        key: keyObject,
        oaepHash,
        padding
    }, encryptedKey);
};

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/lib/cek.js


function cek_bitLength(alg) {
    switch(alg){
        case "A128GCM":
            return 128;
        case "A192GCM":
            return 192;
        case "A256GCM":
        case "A128CBC-HS256":
            return 256;
        case "A192CBC-HS384":
            return 384;
        case "A256CBC-HS512":
            return 512;
        default:
            throw new JOSENotSupported(`Unsupported JWE Algorithm: ${alg}`);
    }
}
/* harmony default export */ const lib_cek = ((alg)=>(0,external_crypto_.randomFillSync)(new Uint8Array(cek_bitLength(alg) >> 3)));

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/asn1.js






const genericExport = (keyType, keyFormat, key)=>{
    let keyObject;
    if (isCryptoKey(key)) {
        if (!key.extractable) {
            throw new TypeError("CryptoKey is not extractable");
        }
        keyObject = external_crypto_.KeyObject.from(key);
    } else if (is_key_object(key)) {
        keyObject = key;
    } else {
        throw new TypeError(invalid_key_input(key, ...types));
    }
    if (keyObject.type !== keyType) {
        throw new TypeError(`key is not a ${keyType} key`);
    }
    return keyObject.export({
        format: "pem",
        type: keyFormat
    });
};
const toSPKI = (key)=>{
    return genericExport("public", "spki", key);
};
const toPKCS8 = (key)=>{
    return genericExport("private", "pkcs8", key);
};
const fromPKCS8 = (pem)=>(0,external_crypto_.createPrivateKey)({
        key: external_buffer_.Buffer.from(pem.replace(/(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g, ""), "base64"),
        type: "pkcs8",
        format: "der"
    });
const fromSPKI = (pem)=>(0,external_crypto_.createPublicKey)({
        key: external_buffer_.Buffer.from(pem.replace(/(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g, ""), "base64"),
        type: "spki",
        format: "der"
    });
const fromX509 = (pem)=>(0,external_crypto_.createPublicKey)({
        key: pem,
        type: "spki",
        format: "pem"
    });

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/asn1_sequence_encoder.js


const tagInteger = 0x02;
const tagBitStr = 0x03;
const tagOctStr = 0x04;
const tagSequence = 0x30;
const bZero = external_buffer_.Buffer.from([
    0x00
]);
const bTagInteger = external_buffer_.Buffer.from([
    tagInteger
]);
const bTagBitStr = external_buffer_.Buffer.from([
    tagBitStr
]);
const bTagSequence = external_buffer_.Buffer.from([
    tagSequence
]);
const bTagOctStr = external_buffer_.Buffer.from([
    tagOctStr
]);
const encodeLength = (len)=>{
    if (len < 128) return external_buffer_.Buffer.from([
        len
    ]);
    const buffer = external_buffer_.Buffer.alloc(5);
    buffer.writeUInt32BE(len, 1);
    let offset = 1;
    while(buffer[offset] === 0)offset++;
    buffer[offset - 1] = 0x80 | 5 - offset;
    return buffer.slice(offset - 1);
};
const oids = new Map([
    [
        "P-256",
        external_buffer_.Buffer.from("06 08 2A 86 48 CE 3D 03 01 07".replace(/ /g, ""), "hex")
    ],
    [
        "secp256k1",
        external_buffer_.Buffer.from("06 05 2B 81 04 00 0A".replace(/ /g, ""), "hex")
    ],
    [
        "P-384",
        external_buffer_.Buffer.from("06 05 2B 81 04 00 22".replace(/ /g, ""), "hex")
    ],
    [
        "P-521",
        external_buffer_.Buffer.from("06 05 2B 81 04 00 23".replace(/ /g, ""), "hex")
    ],
    [
        "ecPublicKey",
        external_buffer_.Buffer.from("06 07 2A 86 48 CE 3D 02 01".replace(/ /g, ""), "hex")
    ],
    [
        "X25519",
        external_buffer_.Buffer.from("06 03 2B 65 6E".replace(/ /g, ""), "hex")
    ],
    [
        "X448",
        external_buffer_.Buffer.from("06 03 2B 65 6F".replace(/ /g, ""), "hex")
    ],
    [
        "Ed25519",
        external_buffer_.Buffer.from("06 03 2B 65 70".replace(/ /g, ""), "hex")
    ],
    [
        "Ed448",
        external_buffer_.Buffer.from("06 03 2B 65 71".replace(/ /g, ""), "hex")
    ]
]);
class DumbAsn1Encoder {
    constructor(){
        this.length = 0;
        this.elements = [];
    }
    oidFor(oid) {
        const bOid = oids.get(oid);
        if (!bOid) {
            throw new JOSENotSupported("Invalid or unsupported OID");
        }
        this.elements.push(bOid);
        this.length += bOid.length;
    }
    zero() {
        this.elements.push(bTagInteger, external_buffer_.Buffer.from([
            0x01
        ]), bZero);
        this.length += 3;
    }
    one() {
        this.elements.push(bTagInteger, external_buffer_.Buffer.from([
            0x01
        ]), external_buffer_.Buffer.from([
            0x01
        ]));
        this.length += 3;
    }
    unsignedInteger(integer) {
        if (integer[0] & 0x80) {
            const len = encodeLength(integer.length + 1);
            this.elements.push(bTagInteger, len, bZero, integer);
            this.length += 2 + len.length + integer.length;
        } else {
            let i = 0;
            while(integer[i] === 0 && (integer[i + 1] & 0x80) === 0)i++;
            const len = encodeLength(integer.length - i);
            this.elements.push(bTagInteger, encodeLength(integer.length - i), integer.slice(i));
            this.length += 1 + len.length + integer.length - i;
        }
    }
    octStr(octStr) {
        const len = encodeLength(octStr.length);
        this.elements.push(bTagOctStr, encodeLength(octStr.length), octStr);
        this.length += 1 + len.length + octStr.length;
    }
    bitStr(bitS) {
        const len = encodeLength(bitS.length + 1);
        this.elements.push(bTagBitStr, encodeLength(bitS.length + 1), bZero, bitS);
        this.length += 1 + len.length + bitS.length + 1;
    }
    add(seq) {
        this.elements.push(seq);
        this.length += seq.length;
    }
    end(tag = bTagSequence) {
        const len = encodeLength(this.length);
        return external_buffer_.Buffer.concat([
            tag,
            len,
            ...this.elements
        ], 1 + len.length + this.length);
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/flags.js
const [major, minor] = process.versions.node.split(".").map((str)=>parseInt(str, 10));
const oneShotCallback = major >= 16 || major === 15 && minor >= 13;
const rsaPssParams = !("electron" in process.versions) && (major >= 17 || major === 16 && minor >= 9);
const jwkExport = major >= 16 || major === 15 && minor >= 9;
const jwkImport = major >= 16 || major === 15 && minor >= 12;

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/jwk_to_key.js








const parse = (jwk)=>{
    if (jwkImport && jwk.kty !== "oct") {
        return jwk.d ? (0,external_crypto_.createPrivateKey)({
            format: "jwk",
            key: jwk
        }) : (0,external_crypto_.createPublicKey)({
            format: "jwk",
            key: jwk
        });
    }
    switch(jwk.kty){
        case "oct":
            {
                return (0,external_crypto_.createSecretKey)(decode(jwk.k));
            }
        case "RSA":
            {
                const enc = new DumbAsn1Encoder();
                const isPrivate = jwk.d !== undefined;
                const modulus = external_buffer_.Buffer.from(jwk.n, "base64");
                const exponent = external_buffer_.Buffer.from(jwk.e, "base64");
                if (isPrivate) {
                    enc.zero();
                    enc.unsignedInteger(modulus);
                    enc.unsignedInteger(exponent);
                    enc.unsignedInteger(external_buffer_.Buffer.from(jwk.d, "base64"));
                    enc.unsignedInteger(external_buffer_.Buffer.from(jwk.p, "base64"));
                    enc.unsignedInteger(external_buffer_.Buffer.from(jwk.q, "base64"));
                    enc.unsignedInteger(external_buffer_.Buffer.from(jwk.dp, "base64"));
                    enc.unsignedInteger(external_buffer_.Buffer.from(jwk.dq, "base64"));
                    enc.unsignedInteger(external_buffer_.Buffer.from(jwk.qi, "base64"));
                } else {
                    enc.unsignedInteger(modulus);
                    enc.unsignedInteger(exponent);
                }
                const der = enc.end();
                const createInput = {
                    key: der,
                    format: "der",
                    type: "pkcs1"
                };
                const keyObject = isPrivate ? (0,external_crypto_.createPrivateKey)(createInput) : (0,external_crypto_.createPublicKey)(createInput);
                setModulusLength(keyObject, modulus.length << 3);
                return keyObject;
            }
        case "EC":
            {
                const enc = new DumbAsn1Encoder();
                const isPrivate = jwk.d !== undefined;
                const pub = external_buffer_.Buffer.concat([
                    external_buffer_.Buffer.alloc(1, 4),
                    external_buffer_.Buffer.from(jwk.x, "base64"),
                    external_buffer_.Buffer.from(jwk.y, "base64")
                ]);
                if (isPrivate) {
                    enc.zero();
                    const enc$1 = new DumbAsn1Encoder();
                    enc$1.oidFor("ecPublicKey");
                    enc$1.oidFor(jwk.crv);
                    enc.add(enc$1.end());
                    const enc$2 = new DumbAsn1Encoder();
                    enc$2.one();
                    enc$2.octStr(external_buffer_.Buffer.from(jwk.d, "base64"));
                    const enc$3 = new DumbAsn1Encoder();
                    enc$3.bitStr(pub);
                    const f2 = enc$3.end(external_buffer_.Buffer.from([
                        0xa1
                    ]));
                    enc$2.add(f2);
                    const f = enc$2.end();
                    const enc$4 = new DumbAsn1Encoder();
                    enc$4.add(f);
                    const f3 = enc$4.end(external_buffer_.Buffer.from([
                        0x04
                    ]));
                    enc.add(f3);
                    const der = enc.end();
                    const keyObject = (0,external_crypto_.createPrivateKey)({
                        key: der,
                        format: "der",
                        type: "pkcs8"
                    });
                    setCurve(keyObject, jwk.crv);
                    return keyObject;
                }
                const enc$1 = new DumbAsn1Encoder();
                enc$1.oidFor("ecPublicKey");
                enc$1.oidFor(jwk.crv);
                enc.add(enc$1.end());
                enc.bitStr(pub);
                const der = enc.end();
                const keyObject = (0,external_crypto_.createPublicKey)({
                    key: der,
                    format: "der",
                    type: "spki"
                });
                setCurve(keyObject, jwk.crv);
                return keyObject;
            }
        case "OKP":
            {
                const enc = new DumbAsn1Encoder();
                const isPrivate = jwk.d !== undefined;
                if (isPrivate) {
                    enc.zero();
                    const enc$1 = new DumbAsn1Encoder();
                    enc$1.oidFor(jwk.crv);
                    enc.add(enc$1.end());
                    const enc$2 = new DumbAsn1Encoder();
                    enc$2.octStr(external_buffer_.Buffer.from(jwk.d, "base64"));
                    const f = enc$2.end(external_buffer_.Buffer.from([
                        0x04
                    ]));
                    enc.add(f);
                    const der = enc.end();
                    return (0,external_crypto_.createPrivateKey)({
                        key: der,
                        format: "der",
                        type: "pkcs8"
                    });
                }
                const enc$1 = new DumbAsn1Encoder();
                enc$1.oidFor(jwk.crv);
                enc.add(enc$1.end());
                enc.bitStr(external_buffer_.Buffer.from(jwk.x, "base64"));
                const der = enc.end();
                return (0,external_crypto_.createPublicKey)({
                    key: der,
                    format: "der",
                    type: "spki"
                });
            }
        default:
            throw new JOSENotSupported('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
    }
};
/* harmony default export */ const jwk_to_key = (parse);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/key/import.js





async function importSPKI(spki, alg, options) {
    if (typeof spki !== "string" || spki.indexOf("-----BEGIN PUBLIC KEY-----") !== 0) {
        throw new TypeError('"spki" must be SPKI formatted string');
    }
    return fromSPKI(spki, alg, options);
}
async function importX509(x509, alg, options) {
    if (typeof x509 !== "string" || x509.indexOf("-----BEGIN CERTIFICATE-----") !== 0) {
        throw new TypeError('"x509" must be X.509 formatted string');
    }
    return fromX509(x509, alg, options);
}
async function importPKCS8(pkcs8, alg, options) {
    if (typeof pkcs8 !== "string" || pkcs8.indexOf("-----BEGIN PRIVATE KEY-----") !== 0) {
        throw new TypeError('"pkcs8" must be PKCS#8 formatted string');
    }
    return fromPKCS8(pkcs8, alg, options);
}
async function importJWK(jwk, alg, octAsKeyObject) {
    var _a;
    if (!isObject(jwk)) {
        throw new TypeError("JWK must be an object");
    }
    alg || (alg = jwk.alg);
    switch(jwk.kty){
        case "oct":
            if (typeof jwk.k !== "string" || !jwk.k) {
                throw new TypeError('missing "k" (Key Value) Parameter value');
            }
            octAsKeyObject !== null && octAsKeyObject !== void 0 ? octAsKeyObject : octAsKeyObject = jwk.ext !== true;
            if (octAsKeyObject) {
                return jwk_to_key({
                    ...jwk,
                    alg,
                    ext: (_a = jwk.ext) !== null && _a !== void 0 ? _a : false
                });
            }
            return decode(jwk.k);
        case "RSA":
            if (jwk.oth !== undefined) {
                throw new JOSENotSupported('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
            }
        case "EC":
        case "OKP":
            return jwk_to_key({
                ...jwk,
                alg
            });
        default:
            throw new JOSENotSupported('Unsupported "kty" (Key Type) Parameter value');
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/lib/check_key_type.js


const symmetricTypeCheck = (alg, key)=>{
    if (key instanceof Uint8Array) return;
    if (!is_key_like(key)) {
        throw new TypeError(withAlg(alg, key, ...types, "Uint8Array"));
    }
    if (key.type !== "secret") {
        throw new TypeError(`${types.join(" or ")} instances for symmetric algorithms must be of type "secret"`);
    }
};
const asymmetricTypeCheck = (alg, key, usage)=>{
    if (!is_key_like(key)) {
        throw new TypeError(withAlg(alg, key, ...types));
    }
    if (key.type === "secret") {
        throw new TypeError(`${types.join(" or ")} instances for asymmetric algorithms must not be of type "secret"`);
    }
    if (usage === "sign" && key.type === "public") {
        throw new TypeError(`${types.join(" or ")} instances for asymmetric algorithm signing must be of type "private"`);
    }
    if (usage === "decrypt" && key.type === "public") {
        throw new TypeError(`${types.join(" or ")} instances for asymmetric algorithm decryption must be of type "private"`);
    }
    if (key.algorithm && usage === "verify" && key.type === "private") {
        throw new TypeError(`${types.join(" or ")} instances for asymmetric algorithm verifying must be of type "public"`);
    }
    if (key.algorithm && usage === "encrypt" && key.type === "private") {
        throw new TypeError(`${types.join(" or ")} instances for asymmetric algorithm encryption must be of type "public"`);
    }
};
const checkKeyType = (alg, key, usage)=>{
    const symmetric = alg.startsWith("HS") || alg === "dir" || alg.startsWith("PBES2") || /^A\d{3}(?:GCM)?KW$/.test(alg);
    if (symmetric) {
        symmetricTypeCheck(alg, key);
    } else {
        asymmetricTypeCheck(alg, key, usage);
    }
};
/* harmony default export */ const check_key_type = (checkKeyType);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/encrypt.js












function cbcEncrypt(enc, plaintext, cek, iv, aad) {
    const keySize = parseInt(enc.slice(1, 4), 10);
    if (is_key_object(cek)) {
        cek = cek.export();
    }
    const encKey = cek.subarray(keySize >> 3);
    const macKey = cek.subarray(0, keySize >> 3);
    const algorithm = `aes-${keySize}-cbc`;
    if (!runtime_ciphers(algorithm)) {
        throw new JOSENotSupported(`alg ${enc} is not supported by your javascript runtime`);
    }
    const cipher = (0,external_crypto_.createCipheriv)(algorithm, encKey, iv);
    const ciphertext = concat(cipher.update(plaintext), cipher.final());
    const macSize = parseInt(enc.slice(-3), 10);
    const tag = cbcTag(aad, iv, ciphertext, macSize, macKey, keySize);
    return {
        ciphertext,
        tag
    };
}
function gcmEncrypt(enc, plaintext, cek, iv, aad) {
    const keySize = parseInt(enc.slice(1, 4), 10);
    const algorithm = `aes-${keySize}-gcm`;
    if (!runtime_ciphers(algorithm)) {
        throw new JOSENotSupported(`alg ${enc} is not supported by your javascript runtime`);
    }
    const cipher = (0,external_crypto_.createCipheriv)(algorithm, cek, iv, {
        authTagLength: 16
    });
    if (aad.byteLength) {
        cipher.setAAD(aad, {
            plaintextLength: plaintext.length
        });
    }
    const ciphertext = cipher.update(plaintext);
    cipher.final();
    const tag = cipher.getAuthTag();
    return {
        ciphertext,
        tag
    };
}
const encrypt_encrypt = (enc, plaintext, cek, iv, aad)=>{
    let key;
    if (isCryptoKey(cek)) {
        checkEncCryptoKey(cek, enc, "encrypt");
        key = external_crypto_.KeyObject.from(cek);
    } else if (cek instanceof Uint8Array || is_key_object(cek)) {
        key = cek;
    } else {
        throw new TypeError(invalid_key_input(cek, ...types, "Uint8Array"));
    }
    check_cek_length(enc, key);
    check_iv_length(enc, iv);
    switch(enc){
        case "A128CBC-HS256":
        case "A192CBC-HS384":
        case "A256CBC-HS512":
            return cbcEncrypt(enc, plaintext, key, iv, aad);
        case "A128GCM":
        case "A192GCM":
        case "A256GCM":
            return gcmEncrypt(enc, plaintext, key, iv, aad);
        default:
            throw new JOSENotSupported("Unsupported JWE Content Encryption Algorithm");
    }
};
/* harmony default export */ const runtime_encrypt = (encrypt_encrypt);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/lib/aesgcmkw.js




async function aesgcmkw_wrap(alg, key, cek, iv) {
    const jweAlgorithm = alg.slice(0, 7);
    iv || (iv = lib_iv(jweAlgorithm));
    const { ciphertext: encryptedKey , tag  } = await runtime_encrypt(jweAlgorithm, cek, key, iv, new Uint8Array(0));
    return {
        encryptedKey,
        iv: encode(iv),
        tag: encode(tag)
    };
}
async function aesgcmkw_unwrap(alg, key, encryptedKey, iv, tag) {
    const jweAlgorithm = alg.slice(0, 7);
    return runtime_decrypt(jweAlgorithm, key, encryptedKey, iv, tag, new Uint8Array(0));
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/lib/decrypt_key_management.js











async function decryptKeyManagement(alg, key, encryptedKey, joseHeader, options) {
    check_key_type(alg, key, "decrypt");
    switch(alg){
        case "dir":
            {
                if (encryptedKey !== undefined) throw new JWEInvalid("Encountered unexpected JWE Encrypted Key");
                return key;
            }
        case "ECDH-ES":
            if (encryptedKey !== undefined) throw new JWEInvalid("Encountered unexpected JWE Encrypted Key");
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
            {
                if (!isObject(joseHeader.epk)) throw new JWEInvalid(`JOSE Header "epk" (Ephemeral Public Key) missing or invalid`);
                if (!ecdhAllowed(key)) throw new JOSENotSupported("ECDH with the provided key is not allowed or not supported by your javascript runtime");
                const epk = await importJWK(joseHeader.epk, alg);
                let partyUInfo;
                let partyVInfo;
                if (joseHeader.apu !== undefined) {
                    if (typeof joseHeader.apu !== "string") throw new JWEInvalid(`JOSE Header "apu" (Agreement PartyUInfo) invalid`);
                    try {
                        partyUInfo = decode(joseHeader.apu);
                    } catch  {
                        throw new JWEInvalid("Failed to base64url decode the apu");
                    }
                }
                if (joseHeader.apv !== undefined) {
                    if (typeof joseHeader.apv !== "string") throw new JWEInvalid(`JOSE Header "apv" (Agreement PartyVInfo) invalid`);
                    try {
                        partyVInfo = decode(joseHeader.apv);
                    } catch  {
                        throw new JWEInvalid("Failed to base64url decode the apv");
                    }
                }
                const sharedSecret = await deriveKey(epk, key, alg === "ECDH-ES" ? joseHeader.enc : alg, alg === "ECDH-ES" ? cek_bitLength(joseHeader.enc) : parseInt(alg.slice(-5, -2), 10), partyUInfo, partyVInfo);
                if (alg === "ECDH-ES") return sharedSecret;
                if (encryptedKey === undefined) throw new JWEInvalid("JWE Encrypted Key missing");
                return unwrap(alg.slice(-6), sharedSecret, encryptedKey);
            }
        case "RSA1_5":
        case "RSA-OAEP":
        case "RSA-OAEP-256":
        case "RSA-OAEP-384":
        case "RSA-OAEP-512":
            {
                if (encryptedKey === undefined) throw new JWEInvalid("JWE Encrypted Key missing");
                return rsaes_decrypt(alg, key, encryptedKey);
            }
        case "PBES2-HS256+A128KW":
        case "PBES2-HS384+A192KW":
        case "PBES2-HS512+A256KW":
            {
                if (encryptedKey === undefined) throw new JWEInvalid("JWE Encrypted Key missing");
                if (typeof joseHeader.p2c !== "number") throw new JWEInvalid(`JOSE Header "p2c" (PBES2 Count) missing or invalid`);
                const p2cLimit = (options === null || options === void 0 ? void 0 : options.maxPBES2Count) || 10000;
                if (joseHeader.p2c > p2cLimit) throw new JWEInvalid(`JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds`);
                if (typeof joseHeader.p2s !== "string") throw new JWEInvalid(`JOSE Header "p2s" (PBES2 Salt) missing or invalid`);
                let p2s;
                try {
                    p2s = decode(joseHeader.p2s);
                } catch  {
                    throw new JWEInvalid("Failed to base64url decode the p2s");
                }
                return pbes2kw_decrypt(alg, key, encryptedKey, joseHeader.p2c, p2s);
            }
        case "A128KW":
        case "A192KW":
        case "A256KW":
            {
                if (encryptedKey === undefined) throw new JWEInvalid("JWE Encrypted Key missing");
                return unwrap(alg, key, encryptedKey);
            }
        case "A128GCMKW":
        case "A192GCMKW":
        case "A256GCMKW":
            {
                if (encryptedKey === undefined) throw new JWEInvalid("JWE Encrypted Key missing");
                if (typeof joseHeader.iv !== "string") throw new JWEInvalid(`JOSE Header "iv" (Initialization Vector) missing or invalid`);
                if (typeof joseHeader.tag !== "string") throw new JWEInvalid(`JOSE Header "tag" (Authentication Tag) missing or invalid`);
                let iv;
                try {
                    iv = decode(joseHeader.iv);
                } catch  {
                    throw new JWEInvalid("Failed to base64url decode the iv");
                }
                let tag;
                try {
                    tag = decode(joseHeader.tag);
                } catch  {
                    throw new JWEInvalid("Failed to base64url decode the tag");
                }
                return aesgcmkw_unwrap(alg, key, encryptedKey, iv, tag);
            }
        default:
            {
                throw new JOSENotSupported('Invalid or unsupported "alg" (JWE Algorithm) header value');
            }
    }
}
/* harmony default export */ const decrypt_key_management = (decryptKeyManagement);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/lib/validate_crit.js

function validateCrit(Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) {
    if (joseHeader.crit !== undefined && protectedHeader.crit === undefined) {
        throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected');
    }
    if (!protectedHeader || protectedHeader.crit === undefined) {
        return new Set();
    }
    if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some((input)=>typeof input !== "string" || input.length === 0)) {
        throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
    }
    let recognized;
    if (recognizedOption !== undefined) {
        recognized = new Map([
            ...Object.entries(recognizedOption),
            ...recognizedDefault.entries()
        ]);
    } else {
        recognized = recognizedDefault;
    }
    for (const parameter of protectedHeader.crit){
        if (!recognized.has(parameter)) {
            throw new JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`);
        }
        if (joseHeader[parameter] === undefined) {
            throw new Err(`Extension Header Parameter "${parameter}" is missing`);
        } else if (recognized.get(parameter) && protectedHeader[parameter] === undefined) {
            throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
        }
    }
    return new Set(protectedHeader.crit);
}
/* harmony default export */ const validate_crit = (validateCrit);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/lib/validate_algorithms.js
const validateAlgorithms = (option, algorithms)=>{
    if (algorithms !== undefined && (!Array.isArray(algorithms) || algorithms.some((s)=>typeof s !== "string"))) {
        throw new TypeError(`"${option}" option must be an array of strings`);
    }
    if (!algorithms) {
        return undefined;
    }
    return new Set(algorithms);
};
/* harmony default export */ const validate_algorithms = (validateAlgorithms);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/jwe/flattened/decrypt.js











async function flattenedDecrypt(jwe, key, options) {
    var _a;
    if (!isObject(jwe)) {
        throw new JWEInvalid("Flattened JWE must be an object");
    }
    if (jwe.protected === undefined && jwe.header === undefined && jwe.unprotected === undefined) {
        throw new JWEInvalid("JOSE Header missing");
    }
    if (typeof jwe.iv !== "string") {
        throw new JWEInvalid("JWE Initialization Vector missing or incorrect type");
    }
    if (typeof jwe.ciphertext !== "string") {
        throw new JWEInvalid("JWE Ciphertext missing or incorrect type");
    }
    if (typeof jwe.tag !== "string") {
        throw new JWEInvalid("JWE Authentication Tag missing or incorrect type");
    }
    if (jwe.protected !== undefined && typeof jwe.protected !== "string") {
        throw new JWEInvalid("JWE Protected Header incorrect type");
    }
    if (jwe.encrypted_key !== undefined && typeof jwe.encrypted_key !== "string") {
        throw new JWEInvalid("JWE Encrypted Key incorrect type");
    }
    if (jwe.aad !== undefined && typeof jwe.aad !== "string") {
        throw new JWEInvalid("JWE AAD incorrect type");
    }
    if (jwe.header !== undefined && !isObject(jwe.header)) {
        throw new JWEInvalid("JWE Shared Unprotected Header incorrect type");
    }
    if (jwe.unprotected !== undefined && !isObject(jwe.unprotected)) {
        throw new JWEInvalid("JWE Per-Recipient Unprotected Header incorrect type");
    }
    let parsedProt;
    if (jwe.protected) {
        try {
            const protectedHeader = decode(jwe.protected);
            parsedProt = JSON.parse(decoder.decode(protectedHeader));
        } catch  {
            throw new JWEInvalid("JWE Protected Header is invalid");
        }
    }
    if (!is_disjoint(parsedProt, jwe.header, jwe.unprotected)) {
        throw new JWEInvalid("JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint");
    }
    const joseHeader = {
        ...parsedProt,
        ...jwe.header,
        ...jwe.unprotected
    };
    validate_crit(JWEInvalid, new Map(), options === null || options === void 0 ? void 0 : options.crit, parsedProt, joseHeader);
    if (joseHeader.zip !== undefined) {
        if (!parsedProt || !parsedProt.zip) {
            throw new JWEInvalid('JWE "zip" (Compression Algorithm) Header MUST be integrity protected');
        }
        if (joseHeader.zip !== "DEF") {
            throw new JOSENotSupported('Unsupported JWE "zip" (Compression Algorithm) Header Parameter value');
        }
    }
    const { alg , enc  } = joseHeader;
    if (typeof alg !== "string" || !alg) {
        throw new JWEInvalid("missing JWE Algorithm (alg) in JWE Header");
    }
    if (typeof enc !== "string" || !enc) {
        throw new JWEInvalid("missing JWE Encryption Algorithm (enc) in JWE Header");
    }
    const keyManagementAlgorithms = options && validate_algorithms("keyManagementAlgorithms", options.keyManagementAlgorithms);
    const contentEncryptionAlgorithms = options && validate_algorithms("contentEncryptionAlgorithms", options.contentEncryptionAlgorithms);
    if (keyManagementAlgorithms && !keyManagementAlgorithms.has(alg)) {
        throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter not allowed');
    }
    if (contentEncryptionAlgorithms && !contentEncryptionAlgorithms.has(enc)) {
        throw new JOSEAlgNotAllowed('"enc" (Encryption Algorithm) Header Parameter not allowed');
    }
    let encryptedKey;
    if (jwe.encrypted_key !== undefined) {
        try {
            encryptedKey = decode(jwe.encrypted_key);
        } catch  {
            throw new JWEInvalid("Failed to base64url decode the encrypted_key");
        }
    }
    let resolvedKey = false;
    if (typeof key === "function") {
        key = await key(parsedProt, jwe);
        resolvedKey = true;
    }
    let cek;
    try {
        cek = await decrypt_key_management(alg, key, encryptedKey, joseHeader, options);
    } catch (err) {
        if (err instanceof TypeError || err instanceof JWEInvalid || err instanceof JOSENotSupported) {
            throw err;
        }
        cek = lib_cek(enc);
    }
    let iv;
    let tag;
    try {
        iv = decode(jwe.iv);
    } catch  {
        throw new JWEInvalid("Failed to base64url decode the iv");
    }
    try {
        tag = decode(jwe.tag);
    } catch  {
        throw new JWEInvalid("Failed to base64url decode the tag");
    }
    const protectedHeader = encoder.encode((_a = jwe.protected) !== null && _a !== void 0 ? _a : "");
    let additionalData;
    if (jwe.aad !== undefined) {
        additionalData = concat(protectedHeader, encoder.encode("."), encoder.encode(jwe.aad));
    } else {
        additionalData = protectedHeader;
    }
    let ciphertext;
    try {
        ciphertext = decode(jwe.ciphertext);
    } catch  {
        throw new JWEInvalid("Failed to base64url decode the ciphertext");
    }
    let plaintext = await runtime_decrypt(enc, cek, ciphertext, iv, tag, additionalData);
    if (joseHeader.zip === "DEF") {
        plaintext = await ((options === null || options === void 0 ? void 0 : options.inflateRaw) || inflate)(plaintext);
    }
    const result = {
        plaintext
    };
    if (jwe.protected !== undefined) {
        result.protectedHeader = parsedProt;
    }
    if (jwe.aad !== undefined) {
        try {
            result.additionalAuthenticatedData = decode(jwe.aad);
        } catch  {
            throw new JWEInvalid("Failed to base64url decode the aad");
        }
    }
    if (jwe.unprotected !== undefined) {
        result.sharedUnprotectedHeader = jwe.unprotected;
    }
    if (jwe.header !== undefined) {
        result.unprotectedHeader = jwe.header;
    }
    if (resolvedKey) {
        return {
            ...result,
            key
        };
    }
    return result;
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/jwe/compact/decrypt.js



async function compactDecrypt(jwe, key, options) {
    if (jwe instanceof Uint8Array) {
        jwe = decoder.decode(jwe);
    }
    if (typeof jwe !== "string") {
        throw new JWEInvalid("Compact JWE must be a string or Uint8Array");
    }
    const { 0: protectedHeader , 1: encryptedKey , 2: iv , 3: ciphertext , 4: tag , length  } = jwe.split(".");
    if (length !== 5) {
        throw new JWEInvalid("Invalid Compact JWE");
    }
    const decrypted = await flattenedDecrypt({
        ciphertext,
        iv: iv || undefined,
        protected: protectedHeader || undefined,
        tag: tag || undefined,
        encrypted_key: encryptedKey || undefined
    }, key, options);
    const result = {
        plaintext: decrypted.plaintext,
        protectedHeader: decrypted.protectedHeader
    };
    if (typeof key === "function") {
        return {
            ...result,
            key: decrypted.key
        };
    }
    return result;
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/jwe/general/decrypt.js



async function generalDecrypt(jwe, key, options) {
    if (!isObject(jwe)) {
        throw new JWEInvalid("General JWE must be an object");
    }
    if (!Array.isArray(jwe.recipients) || !jwe.recipients.every(isObject)) {
        throw new JWEInvalid("JWE Recipients missing or incorrect type");
    }
    if (!jwe.recipients.length) {
        throw new JWEInvalid("JWE Recipients has no members");
    }
    for (const recipient of jwe.recipients){
        try {
            return await flattenedDecrypt({
                aad: jwe.aad,
                ciphertext: jwe.ciphertext,
                encrypted_key: recipient.encrypted_key,
                header: recipient.header,
                iv: jwe.iv,
                protected: jwe.protected,
                tag: jwe.tag,
                unprotected: jwe.unprotected
            }, key, options);
        } catch  {}
    }
    throw new JWEDecryptionFailed();
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/asn1_sequence_decoder.js
const asn1_sequence_decoder_tagInteger = 0x02;
const asn1_sequence_decoder_tagSequence = 0x30;
class Asn1SequenceDecoder {
    constructor(buffer){
        if (buffer[0] !== asn1_sequence_decoder_tagSequence) {
            throw new TypeError();
        }
        this.buffer = buffer;
        this.offset = 1;
        const len = this.decodeLength();
        if (len !== buffer.length - this.offset) {
            throw new TypeError();
        }
    }
    decodeLength() {
        let length = this.buffer[this.offset++];
        if (length & 0x80) {
            const nBytes = length & ~0x80;
            length = 0;
            for(let i = 0; i < nBytes; i++)length = length << 8 | this.buffer[this.offset + i];
            this.offset += nBytes;
        }
        return length;
    }
    unsignedInteger() {
        if (this.buffer[this.offset++] !== asn1_sequence_decoder_tagInteger) {
            throw new TypeError();
        }
        let length = this.decodeLength();
        if (this.buffer[this.offset] === 0) {
            this.offset++;
            length--;
        }
        const result = this.buffer.slice(this.offset, this.offset + length);
        this.offset += length;
        return result;
    }
    end() {
        if (this.offset !== this.buffer.length) {
            throw new TypeError();
        }
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/key_to_jwk.js










const keyToJWK = (key)=>{
    let keyObject;
    if (isCryptoKey(key)) {
        if (!key.extractable) {
            throw new TypeError("CryptoKey is not extractable");
        }
        keyObject = external_crypto_.KeyObject.from(key);
    } else if (is_key_object(key)) {
        keyObject = key;
    } else if (key instanceof Uint8Array) {
        return {
            kty: "oct",
            k: encode(key)
        };
    } else {
        throw new TypeError(invalid_key_input(key, ...types, "Uint8Array"));
    }
    if (jwkExport) {
        if (keyObject.type !== "secret" && ![
            "rsa",
            "ec",
            "ed25519",
            "x25519",
            "ed448",
            "x448"
        ].includes(keyObject.asymmetricKeyType)) {
            throw new JOSENotSupported("Unsupported key asymmetricKeyType");
        }
        return keyObject.export({
            format: "jwk"
        });
    }
    switch(keyObject.type){
        case "secret":
            return {
                kty: "oct",
                k: encode(keyObject.export())
            };
        case "private":
        case "public":
            {
                switch(keyObject.asymmetricKeyType){
                    case "rsa":
                        {
                            const der = keyObject.export({
                                format: "der",
                                type: "pkcs1"
                            });
                            const dec = new Asn1SequenceDecoder(der);
                            if (keyObject.type === "private") {
                                dec.unsignedInteger();
                            }
                            const n = encode(dec.unsignedInteger());
                            const e = encode(dec.unsignedInteger());
                            let jwk;
                            if (keyObject.type === "private") {
                                jwk = {
                                    d: encode(dec.unsignedInteger()),
                                    p: encode(dec.unsignedInteger()),
                                    q: encode(dec.unsignedInteger()),
                                    dp: encode(dec.unsignedInteger()),
                                    dq: encode(dec.unsignedInteger()),
                                    qi: encode(dec.unsignedInteger())
                                };
                            }
                            dec.end();
                            return {
                                kty: "RSA",
                                n,
                                e,
                                ...jwk
                            };
                        }
                    case "ec":
                        {
                            const crv = get_named_curve(keyObject);
                            let len;
                            let offset;
                            let correction;
                            switch(crv){
                                case "secp256k1":
                                    len = 64;
                                    offset = 31 + 2;
                                    correction = -1;
                                    break;
                                case "P-256":
                                    len = 64;
                                    offset = 34 + 2;
                                    correction = -1;
                                    break;
                                case "P-384":
                                    len = 96;
                                    offset = 33 + 2;
                                    correction = -3;
                                    break;
                                case "P-521":
                                    len = 132;
                                    offset = 33 + 2;
                                    correction = -3;
                                    break;
                                default:
                                    throw new JOSENotSupported("Unsupported curve");
                            }
                            if (keyObject.type === "public") {
                                const der = keyObject.export({
                                    type: "spki",
                                    format: "der"
                                });
                                return {
                                    kty: "EC",
                                    crv,
                                    x: encode(der.subarray(-len, -len / 2)),
                                    y: encode(der.subarray(-len / 2))
                                };
                            }
                            const der = keyObject.export({
                                type: "pkcs8",
                                format: "der"
                            });
                            if (der.length < 100) {
                                offset += correction;
                            }
                            return {
                                ...keyToJWK((0,external_crypto_.createPublicKey)(keyObject)),
                                d: encode(der.subarray(offset, offset + len / 2))
                            };
                        }
                    case "ed25519":
                    case "x25519":
                        {
                            const crv = get_named_curve(keyObject);
                            if (keyObject.type === "public") {
                                const der = keyObject.export({
                                    type: "spki",
                                    format: "der"
                                });
                                return {
                                    kty: "OKP",
                                    crv,
                                    x: encode(der.subarray(-32))
                                };
                            }
                            const der = keyObject.export({
                                type: "pkcs8",
                                format: "der"
                            });
                            return {
                                ...keyToJWK((0,external_crypto_.createPublicKey)(keyObject)),
                                d: encode(der.subarray(-32))
                            };
                        }
                    case "ed448":
                    case "x448":
                        {
                            const crv = get_named_curve(keyObject);
                            if (keyObject.type === "public") {
                                const der = keyObject.export({
                                    type: "spki",
                                    format: "der"
                                });
                                return {
                                    kty: "OKP",
                                    crv,
                                    x: encode(der.subarray(crv === "Ed448" ? -57 : -56))
                                };
                            }
                            const der = keyObject.export({
                                type: "pkcs8",
                                format: "der"
                            });
                            return {
                                ...keyToJWK((0,external_crypto_.createPublicKey)(keyObject)),
                                d: encode(der.subarray(crv === "Ed448" ? -57 : -56))
                            };
                        }
                    default:
                        throw new JOSENotSupported("Unsupported key asymmetricKeyType");
                }
            }
        default:
            throw new JOSENotSupported("Unsupported key type");
    }
};
/* harmony default export */ const key_to_jwk = (keyToJWK);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/key/export.js



async function exportSPKI(key) {
    return toSPKI(key);
}
async function exportPKCS8(key) {
    return toPKCS8(key);
}
async function exportJWK(key) {
    return key_to_jwk(key);
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/lib/encrypt_key_management.js










async function encryptKeyManagement(alg, enc, key, providedCek, providedParameters = {}) {
    let encryptedKey;
    let parameters;
    let cek;
    check_key_type(alg, key, "encrypt");
    switch(alg){
        case "dir":
            {
                cek = key;
                break;
            }
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
            {
                if (!ecdhAllowed(key)) {
                    throw new JOSENotSupported("ECDH with the provided key is not allowed or not supported by your javascript runtime");
                }
                const { apu , apv  } = providedParameters;
                let { epk: ephemeralKey  } = providedParameters;
                ephemeralKey || (ephemeralKey = (await generateEpk(key)).privateKey);
                const { x , y , crv , kty  } = await exportJWK(ephemeralKey);
                const sharedSecret = await deriveKey(key, ephemeralKey, alg === "ECDH-ES" ? enc : alg, alg === "ECDH-ES" ? cek_bitLength(enc) : parseInt(alg.slice(-5, -2), 10), apu, apv);
                parameters = {
                    epk: {
                        x,
                        crv,
                        kty
                    }
                };
                if (kty === "EC") parameters.epk.y = y;
                if (apu) parameters.apu = encode(apu);
                if (apv) parameters.apv = encode(apv);
                if (alg === "ECDH-ES") {
                    cek = sharedSecret;
                    break;
                }
                cek = providedCek || lib_cek(enc);
                const kwAlg = alg.slice(-6);
                encryptedKey = await wrap(kwAlg, sharedSecret, cek);
                break;
            }
        case "RSA1_5":
        case "RSA-OAEP":
        case "RSA-OAEP-256":
        case "RSA-OAEP-384":
        case "RSA-OAEP-512":
            {
                cek = providedCek || lib_cek(enc);
                encryptedKey = await rsaes_encrypt(alg, key, cek);
                break;
            }
        case "PBES2-HS256+A128KW":
        case "PBES2-HS384+A192KW":
        case "PBES2-HS512+A256KW":
            {
                cek = providedCek || lib_cek(enc);
                const { p2c , p2s  } = providedParameters;
                ({ encryptedKey , ...parameters } = await encrypt(alg, key, cek, p2c, p2s));
                break;
            }
        case "A128KW":
        case "A192KW":
        case "A256KW":
            {
                cek = providedCek || lib_cek(enc);
                encryptedKey = await wrap(alg, key, cek);
                break;
            }
        case "A128GCMKW":
        case "A192GCMKW":
        case "A256GCMKW":
            {
                cek = providedCek || lib_cek(enc);
                const { iv  } = providedParameters;
                ({ encryptedKey , ...parameters } = await aesgcmkw_wrap(alg, key, cek, iv));
                break;
            }
        default:
            {
                throw new JOSENotSupported('Invalid or unsupported "alg" (JWE Algorithm) header value');
            }
    }
    return {
        cek,
        encryptedKey,
        parameters
    };
}
/* harmony default export */ const encrypt_key_management = (encryptKeyManagement);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/jwe/flattened/encrypt.js









const unprotected = Symbol();
class FlattenedEncrypt {
    constructor(plaintext){
        if (!(plaintext instanceof Uint8Array)) {
            throw new TypeError("plaintext must be an instance of Uint8Array");
        }
        this._plaintext = plaintext;
    }
    setKeyManagementParameters(parameters) {
        if (this._keyManagementParameters) {
            throw new TypeError("setKeyManagementParameters can only be called once");
        }
        this._keyManagementParameters = parameters;
        return this;
    }
    setProtectedHeader(protectedHeader) {
        if (this._protectedHeader) {
            throw new TypeError("setProtectedHeader can only be called once");
        }
        this._protectedHeader = protectedHeader;
        return this;
    }
    setSharedUnprotectedHeader(sharedUnprotectedHeader) {
        if (this._sharedUnprotectedHeader) {
            throw new TypeError("setSharedUnprotectedHeader can only be called once");
        }
        this._sharedUnprotectedHeader = sharedUnprotectedHeader;
        return this;
    }
    setUnprotectedHeader(unprotectedHeader) {
        if (this._unprotectedHeader) {
            throw new TypeError("setUnprotectedHeader can only be called once");
        }
        this._unprotectedHeader = unprotectedHeader;
        return this;
    }
    setAdditionalAuthenticatedData(aad) {
        this._aad = aad;
        return this;
    }
    setContentEncryptionKey(cek) {
        if (this._cek) {
            throw new TypeError("setContentEncryptionKey can only be called once");
        }
        this._cek = cek;
        return this;
    }
    setInitializationVector(iv) {
        if (this._iv) {
            throw new TypeError("setInitializationVector can only be called once");
        }
        this._iv = iv;
        return this;
    }
    async encrypt(key, options) {
        if (!this._protectedHeader && !this._unprotectedHeader && !this._sharedUnprotectedHeader) {
            throw new JWEInvalid("either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()");
        }
        if (!is_disjoint(this._protectedHeader, this._unprotectedHeader, this._sharedUnprotectedHeader)) {
            throw new JWEInvalid("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
        }
        const joseHeader = {
            ...this._protectedHeader,
            ...this._unprotectedHeader,
            ...this._sharedUnprotectedHeader
        };
        validate_crit(JWEInvalid, new Map(), options === null || options === void 0 ? void 0 : options.crit, this._protectedHeader, joseHeader);
        if (joseHeader.zip !== undefined) {
            if (!this._protectedHeader || !this._protectedHeader.zip) {
                throw new JWEInvalid('JWE "zip" (Compression Algorithm) Header MUST be integrity protected');
            }
            if (joseHeader.zip !== "DEF") {
                throw new JOSENotSupported('Unsupported JWE "zip" (Compression Algorithm) Header Parameter value');
            }
        }
        const { alg , enc  } = joseHeader;
        if (typeof alg !== "string" || !alg) {
            throw new JWEInvalid('JWE "alg" (Algorithm) Header Parameter missing or invalid');
        }
        if (typeof enc !== "string" || !enc) {
            throw new JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
        }
        let encryptedKey;
        if (alg === "dir") {
            if (this._cek) {
                throw new TypeError("setContentEncryptionKey cannot be called when using Direct Encryption");
            }
        } else if (alg === "ECDH-ES") {
            if (this._cek) {
                throw new TypeError("setContentEncryptionKey cannot be called when using Direct Key Agreement");
            }
        }
        let cek;
        {
            let parameters;
            ({ cek , encryptedKey , parameters  } = await encrypt_key_management(alg, enc, key, this._cek, this._keyManagementParameters));
            if (parameters) {
                if (options && unprotected in options) {
                    if (!this._unprotectedHeader) {
                        this.setUnprotectedHeader(parameters);
                    } else {
                        this._unprotectedHeader = {
                            ...this._unprotectedHeader,
                            ...parameters
                        };
                    }
                } else {
                    if (!this._protectedHeader) {
                        this.setProtectedHeader(parameters);
                    } else {
                        this._protectedHeader = {
                            ...this._protectedHeader,
                            ...parameters
                        };
                    }
                }
            }
        }
        this._iv || (this._iv = lib_iv(enc));
        let additionalData;
        let protectedHeader;
        let aadMember;
        if (this._protectedHeader) {
            protectedHeader = encoder.encode(encode(JSON.stringify(this._protectedHeader)));
        } else {
            protectedHeader = encoder.encode("");
        }
        if (this._aad) {
            aadMember = encode(this._aad);
            additionalData = concat(protectedHeader, encoder.encode("."), encoder.encode(aadMember));
        } else {
            additionalData = protectedHeader;
        }
        let ciphertext;
        let tag;
        if (joseHeader.zip === "DEF") {
            const deflated = await ((options === null || options === void 0 ? void 0 : options.deflateRaw) || deflate)(this._plaintext);
            ({ ciphertext , tag  } = await runtime_encrypt(enc, deflated, cek, this._iv, additionalData));
        } else {
            ;
            ({ ciphertext , tag  } = await runtime_encrypt(enc, this._plaintext, cek, this._iv, additionalData));
        }
        const jwe = {
            ciphertext: encode(ciphertext),
            iv: encode(this._iv),
            tag: encode(tag)
        };
        if (encryptedKey) {
            jwe.encrypted_key = encode(encryptedKey);
        }
        if (aadMember) {
            jwe.aad = aadMember;
        }
        if (this._protectedHeader) {
            jwe.protected = decoder.decode(protectedHeader);
        }
        if (this._sharedUnprotectedHeader) {
            jwe.unprotected = this._sharedUnprotectedHeader;
        }
        if (this._unprotectedHeader) {
            jwe.header = this._unprotectedHeader;
        }
        return jwe;
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/jwe/general/encrypt.js







class IndividualRecipient {
    constructor(enc, key, options){
        this.parent = enc;
        this.key = key;
        this.options = options;
    }
    setUnprotectedHeader(unprotectedHeader) {
        if (this.unprotectedHeader) {
            throw new TypeError("setUnprotectedHeader can only be called once");
        }
        this.unprotectedHeader = unprotectedHeader;
        return this;
    }
    addRecipient(...args) {
        return this.parent.addRecipient(...args);
    }
    encrypt(...args) {
        return this.parent.encrypt(...args);
    }
    done() {
        return this.parent;
    }
}
class GeneralEncrypt {
    constructor(plaintext){
        this._recipients = [];
        this._plaintext = plaintext;
    }
    addRecipient(key, options) {
        const recipient = new IndividualRecipient(this, key, {
            crit: options === null || options === void 0 ? void 0 : options.crit
        });
        this._recipients.push(recipient);
        return recipient;
    }
    setProtectedHeader(protectedHeader) {
        if (this._protectedHeader) {
            throw new TypeError("setProtectedHeader can only be called once");
        }
        this._protectedHeader = protectedHeader;
        return this;
    }
    setSharedUnprotectedHeader(sharedUnprotectedHeader) {
        if (this._unprotectedHeader) {
            throw new TypeError("setSharedUnprotectedHeader can only be called once");
        }
        this._unprotectedHeader = sharedUnprotectedHeader;
        return this;
    }
    setAdditionalAuthenticatedData(aad) {
        this._aad = aad;
        return this;
    }
    async encrypt(options) {
        var _a, _b, _c;
        if (!this._recipients.length) {
            throw new JWEInvalid("at least one recipient must be added");
        }
        options = {
            deflateRaw: options === null || options === void 0 ? void 0 : options.deflateRaw
        };
        if (this._recipients.length === 1) {
            const [recipient] = this._recipients;
            const flattened = await new FlattenedEncrypt(this._plaintext).setAdditionalAuthenticatedData(this._aad).setProtectedHeader(this._protectedHeader).setSharedUnprotectedHeader(this._unprotectedHeader).setUnprotectedHeader(recipient.unprotectedHeader).encrypt(recipient.key, {
                ...recipient.options,
                ...options
            });
            let jwe = {
                ciphertext: flattened.ciphertext,
                iv: flattened.iv,
                recipients: [
                    {}
                ],
                tag: flattened.tag
            };
            if (flattened.aad) jwe.aad = flattened.aad;
            if (flattened.protected) jwe.protected = flattened.protected;
            if (flattened.unprotected) jwe.unprotected = flattened.unprotected;
            if (flattened.encrypted_key) jwe.recipients[0].encrypted_key = flattened.encrypted_key;
            if (flattened.header) jwe.recipients[0].header = flattened.header;
            return jwe;
        }
        let enc;
        for(let i = 0; i < this._recipients.length; i++){
            const recipient = this._recipients[i];
            if (!is_disjoint(this._protectedHeader, this._unprotectedHeader, recipient.unprotectedHeader)) {
                throw new JWEInvalid("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
            }
            const joseHeader = {
                ...this._protectedHeader,
                ...this._unprotectedHeader,
                ...recipient.unprotectedHeader
            };
            const { alg  } = joseHeader;
            if (typeof alg !== "string" || !alg) {
                throw new JWEInvalid('JWE "alg" (Algorithm) Header Parameter missing or invalid');
            }
            if (alg === "dir" || alg === "ECDH-ES") {
                throw new JWEInvalid('"dir" and "ECDH-ES" alg may only be used with a single recipient');
            }
            if (typeof joseHeader.enc !== "string" || !joseHeader.enc) {
                throw new JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
            }
            if (!enc) {
                enc = joseHeader.enc;
            } else if (enc !== joseHeader.enc) {
                throw new JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter must be the same for all recipients');
            }
            validate_crit(JWEInvalid, new Map(), recipient.options.crit, this._protectedHeader, joseHeader);
            if (joseHeader.zip !== undefined) {
                if (!this._protectedHeader || !this._protectedHeader.zip) {
                    throw new JWEInvalid('JWE "zip" (Compression Algorithm) Header MUST be integrity protected');
                }
            }
        }
        const cek = lib_cek(enc);
        let jwe = {
            ciphertext: "",
            iv: "",
            recipients: [],
            tag: ""
        };
        for(let i = 0; i < this._recipients.length; i++){
            const recipient = this._recipients[i];
            const target = {};
            jwe.recipients.push(target);
            const joseHeader = {
                ...this._protectedHeader,
                ...this._unprotectedHeader,
                ...recipient.unprotectedHeader
            };
            const p2c = joseHeader.alg.startsWith("PBES2") ? 2048 + i : undefined;
            if (i === 0) {
                const flattened = await new FlattenedEncrypt(this._plaintext).setAdditionalAuthenticatedData(this._aad).setContentEncryptionKey(cek).setProtectedHeader(this._protectedHeader).setSharedUnprotectedHeader(this._unprotectedHeader).setUnprotectedHeader(recipient.unprotectedHeader).setKeyManagementParameters({
                    p2c
                }).encrypt(recipient.key, {
                    ...recipient.options,
                    ...options,
                    [unprotected]: true
                });
                jwe.ciphertext = flattened.ciphertext;
                jwe.iv = flattened.iv;
                jwe.tag = flattened.tag;
                if (flattened.aad) jwe.aad = flattened.aad;
                if (flattened.protected) jwe.protected = flattened.protected;
                if (flattened.unprotected) jwe.unprotected = flattened.unprotected;
                target.encrypted_key = flattened.encrypted_key;
                if (flattened.header) target.header = flattened.header;
                continue;
            }
            const { encryptedKey , parameters  } = await encrypt_key_management(((_a = recipient.unprotectedHeader) === null || _a === void 0 ? void 0 : _a.alg) || ((_b = this._protectedHeader) === null || _b === void 0 ? void 0 : _b.alg) || ((_c = this._unprotectedHeader) === null || _c === void 0 ? void 0 : _c.alg), enc, recipient.key, cek, {
                p2c
            });
            target.encrypted_key = encode(encryptedKey);
            if (recipient.unprotectedHeader || parameters) target.header = {
                ...recipient.unprotectedHeader,
                ...parameters
            };
        }
        return jwe;
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/dsa_digest.js

function dsaDigest(alg) {
    switch(alg){
        case "PS256":
        case "RS256":
        case "ES256":
        case "ES256K":
            return "sha256";
        case "PS384":
        case "RS384":
        case "ES384":
            return "sha384";
        case "PS512":
        case "RS512":
        case "ES512":
            return "sha512";
        case "EdDSA":
            return undefined;
        default:
            throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/node_key.js





const PSS = {
    padding: external_crypto_.constants.RSA_PKCS1_PSS_PADDING,
    saltLength: external_crypto_.constants.RSA_PSS_SALTLEN_DIGEST
};
const ecCurveAlgMap = new Map([
    [
        "ES256",
        "P-256"
    ],
    [
        "ES256K",
        "secp256k1"
    ],
    [
        "ES384",
        "P-384"
    ],
    [
        "ES512",
        "P-521"
    ]
]);
function keyForCrypto(alg, key) {
    switch(alg){
        case "EdDSA":
            if (![
                "ed25519",
                "ed448"
            ].includes(key.asymmetricKeyType)) {
                throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be ed25519 or ed448");
            }
            return key;
        case "RS256":
        case "RS384":
        case "RS512":
            if (key.asymmetricKeyType !== "rsa") {
                throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be rsa");
            }
            check_modulus_length(key, alg);
            return key;
        case rsaPssParams && "PS256":
        case rsaPssParams && "PS384":
        case rsaPssParams && "PS512":
            if (key.asymmetricKeyType === "rsa-pss") {
                const { hashAlgorithm , mgf1HashAlgorithm , saltLength  } = key.asymmetricKeyDetails;
                const length = parseInt(alg.slice(-3), 10);
                if (hashAlgorithm !== undefined && (hashAlgorithm !== `sha${length}` || mgf1HashAlgorithm !== hashAlgorithm)) {
                    throw new TypeError(`Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${alg}`);
                }
                if (saltLength !== undefined && saltLength > length >> 3) {
                    throw new TypeError(`Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${alg}`);
                }
            } else if (key.asymmetricKeyType !== "rsa") {
                throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be rsa or rsa-pss");
            }
            check_modulus_length(key, alg);
            return {
                key,
                ...PSS
            };
        case !rsaPssParams && "PS256":
        case !rsaPssParams && "PS384":
        case !rsaPssParams && "PS512":
            if (key.asymmetricKeyType !== "rsa") {
                throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be rsa");
            }
            check_modulus_length(key, alg);
            return {
                key,
                ...PSS
            };
        case "ES256":
        case "ES256K":
        case "ES384":
        case "ES512":
            {
                if (key.asymmetricKeyType !== "ec") {
                    throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be ec");
                }
                const actual = get_named_curve(key);
                const expected = ecCurveAlgMap.get(alg);
                if (actual !== expected) {
                    throw new TypeError(`Invalid key curve for the algorithm, its curve must be ${expected}, got ${actual}`);
                }
                return {
                    dsaEncoding: "ieee-p1363",
                    key
                };
            }
        default:
            throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/hmac_digest.js

function hmacDigest(alg) {
    switch(alg){
        case "HS256":
            return "sha256";
        case "HS384":
            return "sha384";
        case "HS512":
            return "sha512";
        default:
            throw new JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/get_sign_verify_key.js





function getSignVerifyKey(alg, key, usage) {
    if (key instanceof Uint8Array) {
        if (!alg.startsWith("HS")) {
            throw new TypeError(invalid_key_input(key, ...types));
        }
        return (0,external_crypto_.createSecretKey)(key);
    }
    if (key instanceof external_crypto_.KeyObject) {
        return key;
    }
    if (isCryptoKey(key)) {
        checkSigCryptoKey(key, alg, usage);
        return external_crypto_.KeyObject.from(key);
    }
    throw new TypeError(invalid_key_input(key, ...types, "Uint8Array"));
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/sign.js






let oneShotSign;
if (external_crypto_.sign.length > 3) {
    oneShotSign = (0,external_util_.promisify)(external_crypto_.sign);
} else {
    oneShotSign = external_crypto_.sign;
}
const sign = async (alg, key, data)=>{
    const keyObject = getSignVerifyKey(alg, key, "sign");
    if (alg.startsWith("HS")) {
        const hmac = external_crypto_.createHmac(hmacDigest(alg), keyObject);
        hmac.update(data);
        return hmac.digest();
    }
    return oneShotSign(dsaDigest(alg), data, keyForCrypto(alg, keyObject));
};
/* harmony default export */ const runtime_sign = (sign);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/verify.js







let oneShotVerify;
if (external_crypto_.verify.length > 4 && oneShotCallback) {
    oneShotVerify = (0,external_util_.promisify)(external_crypto_.verify);
} else {
    oneShotVerify = external_crypto_.verify;
}
const verify = async (alg, key, signature, data)=>{
    const keyObject = getSignVerifyKey(alg, key, "verify");
    if (alg.startsWith("HS")) {
        const expected = await runtime_sign(alg, keyObject, data);
        const actual = signature;
        try {
            return external_crypto_.timingSafeEqual(actual, expected);
        } catch  {
            return false;
        }
    }
    const algorithm = dsaDigest(alg);
    const keyInput = keyForCrypto(alg, keyObject);
    try {
        return await oneShotVerify(algorithm, data, keyInput, signature);
    } catch  {
        return false;
    }
};
/* harmony default export */ const runtime_verify = (verify);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/jws/flattened/verify.js









async function flattenedVerify(jws, key, options) {
    var _a;
    if (!isObject(jws)) {
        throw new JWSInvalid("Flattened JWS must be an object");
    }
    if (jws.protected === undefined && jws.header === undefined) {
        throw new JWSInvalid('Flattened JWS must have either of the "protected" or "header" members');
    }
    if (jws.protected !== undefined && typeof jws.protected !== "string") {
        throw new JWSInvalid("JWS Protected Header incorrect type");
    }
    if (jws.payload === undefined) {
        throw new JWSInvalid("JWS Payload missing");
    }
    if (typeof jws.signature !== "string") {
        throw new JWSInvalid("JWS Signature missing or incorrect type");
    }
    if (jws.header !== undefined && !isObject(jws.header)) {
        throw new JWSInvalid("JWS Unprotected Header incorrect type");
    }
    let parsedProt = {};
    if (jws.protected) {
        try {
            const protectedHeader = decode(jws.protected);
            parsedProt = JSON.parse(decoder.decode(protectedHeader));
        } catch  {
            throw new JWSInvalid("JWS Protected Header is invalid");
        }
    }
    if (!is_disjoint(parsedProt, jws.header)) {
        throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
    }
    const joseHeader = {
        ...parsedProt,
        ...jws.header
    };
    const extensions = validate_crit(JWSInvalid, new Map([
        [
            "b64",
            true
        ]
    ]), options === null || options === void 0 ? void 0 : options.crit, parsedProt, joseHeader);
    let b64 = true;
    if (extensions.has("b64")) {
        b64 = parsedProt.b64;
        if (typeof b64 !== "boolean") {
            throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
        }
    }
    const { alg  } = joseHeader;
    if (typeof alg !== "string" || !alg) {
        throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
    }
    const algorithms = options && validate_algorithms("algorithms", options.algorithms);
    if (algorithms && !algorithms.has(alg)) {
        throw new JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter not allowed');
    }
    if (b64) {
        if (typeof jws.payload !== "string") {
            throw new JWSInvalid("JWS Payload must be a string");
        }
    } else if (typeof jws.payload !== "string" && !(jws.payload instanceof Uint8Array)) {
        throw new JWSInvalid("JWS Payload must be a string or an Uint8Array instance");
    }
    let resolvedKey = false;
    if (typeof key === "function") {
        key = await key(parsedProt, jws);
        resolvedKey = true;
    }
    check_key_type(alg, key, "verify");
    const data = concat(encoder.encode((_a = jws.protected) !== null && _a !== void 0 ? _a : ""), encoder.encode("."), typeof jws.payload === "string" ? encoder.encode(jws.payload) : jws.payload);
    let signature;
    try {
        signature = decode(jws.signature);
    } catch  {
        throw new JWSInvalid("Failed to base64url decode the signature");
    }
    const verified = await runtime_verify(alg, key, signature, data);
    if (!verified) {
        throw new JWSSignatureVerificationFailed();
    }
    let payload;
    if (b64) {
        try {
            payload = decode(jws.payload);
        } catch  {
            throw new JWSInvalid("Failed to base64url decode the payload");
        }
    } else if (typeof jws.payload === "string") {
        payload = encoder.encode(jws.payload);
    } else {
        payload = jws.payload;
    }
    const result = {
        payload
    };
    if (jws.protected !== undefined) {
        result.protectedHeader = parsedProt;
    }
    if (jws.header !== undefined) {
        result.unprotectedHeader = jws.header;
    }
    if (resolvedKey) {
        return {
            ...result,
            key
        };
    }
    return result;
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/jws/compact/verify.js



async function compactVerify(jws, key, options) {
    if (jws instanceof Uint8Array) {
        jws = decoder.decode(jws);
    }
    if (typeof jws !== "string") {
        throw new JWSInvalid("Compact JWS must be a string or Uint8Array");
    }
    const { 0: protectedHeader , 1: payload , 2: signature , length  } = jws.split(".");
    if (length !== 3) {
        throw new JWSInvalid("Invalid Compact JWS");
    }
    const verified = await flattenedVerify({
        payload,
        protected: protectedHeader,
        signature
    }, key, options);
    const result = {
        payload: verified.payload,
        protectedHeader: verified.protectedHeader
    };
    if (typeof key === "function") {
        return {
            ...result,
            key: verified.key
        };
    }
    return result;
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/jws/general/verify.js



async function generalVerify(jws, key, options) {
    if (!isObject(jws)) {
        throw new JWSInvalid("General JWS must be an object");
    }
    if (!Array.isArray(jws.signatures) || !jws.signatures.every(isObject)) {
        throw new JWSInvalid("JWS Signatures missing or incorrect type");
    }
    for (const signature of jws.signatures){
        try {
            return await flattenedVerify({
                header: signature.header,
                payload: jws.payload,
                protected: signature.protected,
                signature: signature.signature
            }, key, options);
        } catch  {}
    }
    throw new JWSSignatureVerificationFailed();
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/lib/epoch.js
/* harmony default export */ const epoch = ((date)=>Math.floor(date.getTime() / 1000));

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/lib/secs.js
const minute = 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const year = day * 365.25;
const REGEX = /^(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)$/i;
/* harmony default export */ const secs = ((str)=>{
    const matched = REGEX.exec(str);
    if (!matched) {
        throw new TypeError("Invalid time period format");
    }
    const value = parseFloat(matched[1]);
    const unit = matched[2].toLowerCase();
    switch(unit){
        case "sec":
        case "secs":
        case "second":
        case "seconds":
        case "s":
            return Math.round(value);
        case "minute":
        case "minutes":
        case "min":
        case "mins":
        case "m":
            return Math.round(value * minute);
        case "hour":
        case "hours":
        case "hr":
        case "hrs":
        case "h":
            return Math.round(value * hour);
        case "day":
        case "days":
        case "d":
            return Math.round(value * day);
        case "week":
        case "weeks":
        case "w":
            return Math.round(value * week);
        default:
            return Math.round(value * year);
    }
});

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/lib/jwt_claims_set.js





const normalizeTyp = (value)=>value.toLowerCase().replace(/^application\//, "");
const checkAudiencePresence = (audPayload, audOption)=>{
    if (typeof audPayload === "string") {
        return audOption.includes(audPayload);
    }
    if (Array.isArray(audPayload)) {
        return audOption.some(Set.prototype.has.bind(new Set(audPayload)));
    }
    return false;
};
/* harmony default export */ const jwt_claims_set = ((protectedHeader, encodedPayload, options = {})=>{
    const { typ  } = options;
    if (typ && (typeof protectedHeader.typ !== "string" || normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ))) {
        throw new JWTClaimValidationFailed('unexpected "typ" JWT header value', "typ", "check_failed");
    }
    let payload;
    try {
        payload = JSON.parse(decoder.decode(encodedPayload));
    } catch  {}
    if (!isObject(payload)) {
        throw new JWTInvalid("JWT Claims Set must be a top-level JSON object");
    }
    const { requiredClaims =[] , issuer , subject , audience , maxTokenAge  } = options;
    if (maxTokenAge !== undefined) requiredClaims.push("iat");
    if (audience !== undefined) requiredClaims.push("aud");
    if (subject !== undefined) requiredClaims.push("sub");
    if (issuer !== undefined) requiredClaims.push("iss");
    for (const claim of new Set(requiredClaims.reverse())){
        if (!(claim in payload)) {
            throw new JWTClaimValidationFailed(`missing required "${claim}" claim`, claim, "missing");
        }
    }
    if (issuer && !(Array.isArray(issuer) ? issuer : [
        issuer
    ]).includes(payload.iss)) {
        throw new JWTClaimValidationFailed('unexpected "iss" claim value', "iss", "check_failed");
    }
    if (subject && payload.sub !== subject) {
        throw new JWTClaimValidationFailed('unexpected "sub" claim value', "sub", "check_failed");
    }
    if (audience && !checkAudiencePresence(payload.aud, typeof audience === "string" ? [
        audience
    ] : audience)) {
        throw new JWTClaimValidationFailed('unexpected "aud" claim value', "aud", "check_failed");
    }
    let tolerance;
    switch(typeof options.clockTolerance){
        case "string":
            tolerance = secs(options.clockTolerance);
            break;
        case "number":
            tolerance = options.clockTolerance;
            break;
        case "undefined":
            tolerance = 0;
            break;
        default:
            throw new TypeError("Invalid clockTolerance option type");
    }
    const { currentDate  } = options;
    const now = epoch(currentDate || new Date());
    if ((payload.iat !== undefined || maxTokenAge) && typeof payload.iat !== "number") {
        throw new JWTClaimValidationFailed('"iat" claim must be a number', "iat", "invalid");
    }
    if (payload.nbf !== undefined) {
        if (typeof payload.nbf !== "number") {
            throw new JWTClaimValidationFailed('"nbf" claim must be a number', "nbf", "invalid");
        }
        if (payload.nbf > now + tolerance) {
            throw new JWTClaimValidationFailed('"nbf" claim timestamp check failed', "nbf", "check_failed");
        }
    }
    if (payload.exp !== undefined) {
        if (typeof payload.exp !== "number") {
            throw new JWTClaimValidationFailed('"exp" claim must be a number', "exp", "invalid");
        }
        if (payload.exp <= now - tolerance) {
            throw new JWTExpired('"exp" claim timestamp check failed', "exp", "check_failed");
        }
    }
    if (maxTokenAge) {
        const age = now - payload.iat;
        const max = typeof maxTokenAge === "number" ? maxTokenAge : secs(maxTokenAge);
        if (age - tolerance > max) {
            throw new JWTExpired('"iat" claim timestamp check failed (too far in the past)', "iat", "check_failed");
        }
        if (age < 0 - tolerance) {
            throw new JWTClaimValidationFailed('"iat" claim timestamp check failed (it should be in the past)', "iat", "check_failed");
        }
    }
    return payload;
});

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/jwt/verify.js



async function jwtVerify(jwt, key, options) {
    var _a;
    const verified = await compactVerify(jwt, key, options);
    if (((_a = verified.protectedHeader.crit) === null || _a === void 0 ? void 0 : _a.includes("b64")) && verified.protectedHeader.b64 === false) {
        throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
    }
    const payload = jwt_claims_set(verified.protectedHeader, verified.payload, options);
    const result = {
        payload,
        protectedHeader: verified.protectedHeader
    };
    if (typeof key === "function") {
        return {
            ...result,
            key: verified.key
        };
    }
    return result;
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/jwt/decrypt.js



async function jwtDecrypt(jwt, key, options) {
    const decrypted = await compactDecrypt(jwt, key, options);
    const payload = jwt_claims_set(decrypted.protectedHeader, decrypted.plaintext, options);
    const { protectedHeader  } = decrypted;
    if (protectedHeader.iss !== undefined && protectedHeader.iss !== payload.iss) {
        throw new JWTClaimValidationFailed('replicated "iss" claim header parameter mismatch', "iss", "mismatch");
    }
    if (protectedHeader.sub !== undefined && protectedHeader.sub !== payload.sub) {
        throw new JWTClaimValidationFailed('replicated "sub" claim header parameter mismatch', "sub", "mismatch");
    }
    if (protectedHeader.aud !== undefined && JSON.stringify(protectedHeader.aud) !== JSON.stringify(payload.aud)) {
        throw new JWTClaimValidationFailed('replicated "aud" claim header parameter mismatch', "aud", "mismatch");
    }
    const result = {
        payload,
        protectedHeader
    };
    if (typeof key === "function") {
        return {
            ...result,
            key: decrypted.key
        };
    }
    return result;
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/jwe/compact/encrypt.js

class CompactEncrypt {
    constructor(plaintext){
        this._flattened = new FlattenedEncrypt(plaintext);
    }
    setContentEncryptionKey(cek) {
        this._flattened.setContentEncryptionKey(cek);
        return this;
    }
    setInitializationVector(iv) {
        this._flattened.setInitializationVector(iv);
        return this;
    }
    setProtectedHeader(protectedHeader) {
        this._flattened.setProtectedHeader(protectedHeader);
        return this;
    }
    setKeyManagementParameters(parameters) {
        this._flattened.setKeyManagementParameters(parameters);
        return this;
    }
    async encrypt(key, options) {
        const jwe = await this._flattened.encrypt(key, options);
        return [
            jwe.protected,
            jwe.encrypted_key,
            jwe.iv,
            jwe.ciphertext,
            jwe.tag
        ].join(".");
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/jws/flattened/sign.js







class FlattenedSign {
    constructor(payload){
        if (!(payload instanceof Uint8Array)) {
            throw new TypeError("payload must be an instance of Uint8Array");
        }
        this._payload = payload;
    }
    setProtectedHeader(protectedHeader) {
        if (this._protectedHeader) {
            throw new TypeError("setProtectedHeader can only be called once");
        }
        this._protectedHeader = protectedHeader;
        return this;
    }
    setUnprotectedHeader(unprotectedHeader) {
        if (this._unprotectedHeader) {
            throw new TypeError("setUnprotectedHeader can only be called once");
        }
        this._unprotectedHeader = unprotectedHeader;
        return this;
    }
    async sign(key, options) {
        if (!this._protectedHeader && !this._unprotectedHeader) {
            throw new JWSInvalid("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
        }
        if (!is_disjoint(this._protectedHeader, this._unprotectedHeader)) {
            throw new JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
        }
        const joseHeader = {
            ...this._protectedHeader,
            ...this._unprotectedHeader
        };
        const extensions = validate_crit(JWSInvalid, new Map([
            [
                "b64",
                true
            ]
        ]), options === null || options === void 0 ? void 0 : options.crit, this._protectedHeader, joseHeader);
        let b64 = true;
        if (extensions.has("b64")) {
            b64 = this._protectedHeader.b64;
            if (typeof b64 !== "boolean") {
                throw new JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
            }
        }
        const { alg  } = joseHeader;
        if (typeof alg !== "string" || !alg) {
            throw new JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
        }
        check_key_type(alg, key, "sign");
        let payload = this._payload;
        if (b64) {
            payload = encoder.encode(encode(payload));
        }
        let protectedHeader;
        if (this._protectedHeader) {
            protectedHeader = encoder.encode(encode(JSON.stringify(this._protectedHeader)));
        } else {
            protectedHeader = encoder.encode("");
        }
        const data = concat(protectedHeader, encoder.encode("."), payload);
        const signature = await runtime_sign(alg, key, data);
        const jws = {
            signature: encode(signature),
            payload: ""
        };
        if (b64) {
            jws.payload = decoder.decode(payload);
        }
        if (this._unprotectedHeader) {
            jws.header = this._unprotectedHeader;
        }
        if (this._protectedHeader) {
            jws.protected = decoder.decode(protectedHeader);
        }
        return jws;
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/jws/compact/sign.js

class CompactSign {
    constructor(payload){
        this._flattened = new FlattenedSign(payload);
    }
    setProtectedHeader(protectedHeader) {
        this._flattened.setProtectedHeader(protectedHeader);
        return this;
    }
    async sign(key, options) {
        const jws = await this._flattened.sign(key, options);
        if (jws.payload === undefined) {
            throw new TypeError("use the flattened module for creating JWS with b64: false");
        }
        return `${jws.protected}.${jws.payload}.${jws.signature}`;
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/jws/general/sign.js


class IndividualSignature {
    constructor(sig, key, options){
        this.parent = sig;
        this.key = key;
        this.options = options;
    }
    setProtectedHeader(protectedHeader) {
        if (this.protectedHeader) {
            throw new TypeError("setProtectedHeader can only be called once");
        }
        this.protectedHeader = protectedHeader;
        return this;
    }
    setUnprotectedHeader(unprotectedHeader) {
        if (this.unprotectedHeader) {
            throw new TypeError("setUnprotectedHeader can only be called once");
        }
        this.unprotectedHeader = unprotectedHeader;
        return this;
    }
    addSignature(...args) {
        return this.parent.addSignature(...args);
    }
    sign(...args) {
        return this.parent.sign(...args);
    }
    done() {
        return this.parent;
    }
}
class GeneralSign {
    constructor(payload){
        this._signatures = [];
        this._payload = payload;
    }
    addSignature(key, options) {
        const signature = new IndividualSignature(this, key, options);
        this._signatures.push(signature);
        return signature;
    }
    async sign() {
        if (!this._signatures.length) {
            throw new JWSInvalid("at least one signature must be added");
        }
        const jws = {
            signatures: [],
            payload: ""
        };
        for(let i = 0; i < this._signatures.length; i++){
            const signature = this._signatures[i];
            const flattened = new FlattenedSign(this._payload);
            flattened.setProtectedHeader(signature.protectedHeader);
            flattened.setUnprotectedHeader(signature.unprotectedHeader);
            const { payload , ...rest } = await flattened.sign(signature.key, signature.options);
            if (i === 0) {
                jws.payload = payload;
            } else if (jws.payload !== payload) {
                throw new JWSInvalid("inconsistent use of JWS Unencoded Payload (RFC7797)");
            }
            jws.signatures.push(rest);
        }
        return jws;
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/jwt/produce.js



class ProduceJWT {
    constructor(payload){
        if (!isObject(payload)) {
            throw new TypeError("JWT Claims Set MUST be an object");
        }
        this._payload = payload;
    }
    setIssuer(issuer) {
        this._payload = {
            ...this._payload,
            iss: issuer
        };
        return this;
    }
    setSubject(subject) {
        this._payload = {
            ...this._payload,
            sub: subject
        };
        return this;
    }
    setAudience(audience) {
        this._payload = {
            ...this._payload,
            aud: audience
        };
        return this;
    }
    setJti(jwtId) {
        this._payload = {
            ...this._payload,
            jti: jwtId
        };
        return this;
    }
    setNotBefore(input) {
        if (typeof input === "number") {
            this._payload = {
                ...this._payload,
                nbf: input
            };
        } else {
            this._payload = {
                ...this._payload,
                nbf: epoch(new Date()) + secs(input)
            };
        }
        return this;
    }
    setExpirationTime(input) {
        if (typeof input === "number") {
            this._payload = {
                ...this._payload,
                exp: input
            };
        } else {
            this._payload = {
                ...this._payload,
                exp: epoch(new Date()) + secs(input)
            };
        }
        return this;
    }
    setIssuedAt(input) {
        if (typeof input === "undefined") {
            this._payload = {
                ...this._payload,
                iat: epoch(new Date())
            };
        } else {
            this._payload = {
                ...this._payload,
                iat: input
            };
        }
        return this;
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/jwt/sign.js




class SignJWT extends ProduceJWT {
    setProtectedHeader(protectedHeader) {
        this._protectedHeader = protectedHeader;
        return this;
    }
    async sign(key, options) {
        var _a;
        const sig = new CompactSign(encoder.encode(JSON.stringify(this._payload)));
        sig.setProtectedHeader(this._protectedHeader);
        if (Array.isArray((_a = this._protectedHeader) === null || _a === void 0 ? void 0 : _a.crit) && this._protectedHeader.crit.includes("b64") && this._protectedHeader.b64 === false) {
            throw new JWTInvalid("JWTs MUST NOT use unencoded payload");
        }
        return sig.sign(key, options);
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/jwt/encrypt.js



class EncryptJWT extends ProduceJWT {
    setProtectedHeader(protectedHeader) {
        if (this._protectedHeader) {
            throw new TypeError("setProtectedHeader can only be called once");
        }
        this._protectedHeader = protectedHeader;
        return this;
    }
    setKeyManagementParameters(parameters) {
        if (this._keyManagementParameters) {
            throw new TypeError("setKeyManagementParameters can only be called once");
        }
        this._keyManagementParameters = parameters;
        return this;
    }
    setContentEncryptionKey(cek) {
        if (this._cek) {
            throw new TypeError("setContentEncryptionKey can only be called once");
        }
        this._cek = cek;
        return this;
    }
    setInitializationVector(iv) {
        if (this._iv) {
            throw new TypeError("setInitializationVector can only be called once");
        }
        this._iv = iv;
        return this;
    }
    replicateIssuerAsHeader() {
        this._replicateIssuerAsHeader = true;
        return this;
    }
    replicateSubjectAsHeader() {
        this._replicateSubjectAsHeader = true;
        return this;
    }
    replicateAudienceAsHeader() {
        this._replicateAudienceAsHeader = true;
        return this;
    }
    async encrypt(key, options) {
        const enc = new CompactEncrypt(encoder.encode(JSON.stringify(this._payload)));
        if (this._replicateIssuerAsHeader) {
            this._protectedHeader = {
                ...this._protectedHeader,
                iss: this._payload.iss
            };
        }
        if (this._replicateSubjectAsHeader) {
            this._protectedHeader = {
                ...this._protectedHeader,
                sub: this._payload.sub
            };
        }
        if (this._replicateAudienceAsHeader) {
            this._protectedHeader = {
                ...this._protectedHeader,
                aud: this._payload.aud
            };
        }
        enc.setProtectedHeader(this._protectedHeader);
        if (this._iv) {
            enc.setInitializationVector(this._iv);
        }
        if (this._cek) {
            enc.setContentEncryptionKey(this._cek);
        }
        if (this._keyManagementParameters) {
            enc.setKeyManagementParameters(this._keyManagementParameters);
        }
        return enc.encrypt(key, options);
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/jwk/thumbprint.js





const check = (value, description)=>{
    if (typeof value !== "string" || !value) {
        throw new JWKInvalid(`${description} missing or invalid`);
    }
};
async function calculateJwkThumbprint(jwk, digestAlgorithm) {
    if (!isObject(jwk)) {
        throw new TypeError("JWK must be an object");
    }
    digestAlgorithm !== null && digestAlgorithm !== void 0 ? digestAlgorithm : digestAlgorithm = "sha256";
    if (digestAlgorithm !== "sha256" && digestAlgorithm !== "sha384" && digestAlgorithm !== "sha512") {
        throw new TypeError('digestAlgorithm must one of "sha256", "sha384", or "sha512"');
    }
    let components;
    switch(jwk.kty){
        case "EC":
            check(jwk.crv, '"crv" (Curve) Parameter');
            check(jwk.x, '"x" (X Coordinate) Parameter');
            check(jwk.y, '"y" (Y Coordinate) Parameter');
            components = {
                crv: jwk.crv,
                kty: jwk.kty,
                x: jwk.x,
                y: jwk.y
            };
            break;
        case "OKP":
            check(jwk.crv, '"crv" (Subtype of Key Pair) Parameter');
            check(jwk.x, '"x" (Public Key) Parameter');
            components = {
                crv: jwk.crv,
                kty: jwk.kty,
                x: jwk.x
            };
            break;
        case "RSA":
            check(jwk.e, '"e" (Exponent) Parameter');
            check(jwk.n, '"n" (Modulus) Parameter');
            components = {
                e: jwk.e,
                kty: jwk.kty,
                n: jwk.n
            };
            break;
        case "oct":
            check(jwk.k, '"k" (Key Value) Parameter');
            components = {
                k: jwk.k,
                kty: jwk.kty
            };
            break;
        default:
            throw new JOSENotSupported('"kty" (Key Type) Parameter missing or unsupported');
    }
    const data = encoder.encode(JSON.stringify(components));
    return encode(await runtime_digest(digestAlgorithm, data));
}
async function calculateJwkThumbprintUri(jwk, digestAlgorithm) {
    digestAlgorithm !== null && digestAlgorithm !== void 0 ? digestAlgorithm : digestAlgorithm = "sha256";
    const thumbprint = await calculateJwkThumbprint(jwk, digestAlgorithm);
    return `urn:ietf:params:oauth:jwk-thumbprint:sha-${digestAlgorithm.slice(-3)}:${thumbprint}`;
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/jwk/embedded.js



async function EmbeddedJWK(protectedHeader, token) {
    const joseHeader = {
        ...protectedHeader,
        ...token === null || token === void 0 ? void 0 : token.header
    };
    if (!isObject(joseHeader.jwk)) {
        throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a JSON object');
    }
    const key = await importJWK({
        ...joseHeader.jwk,
        ext: true
    }, joseHeader.alg, true);
    if (key instanceof Uint8Array || key.type !== "public") {
        throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a public key');
    }
    return key;
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/jwks/local.js



function getKtyFromAlg(alg) {
    switch(typeof alg === "string" && alg.slice(0, 2)){
        case "RS":
        case "PS":
            return "RSA";
        case "ES":
            return "EC";
        case "Ed":
            return "OKP";
        default:
            throw new JOSENotSupported('Unsupported "alg" value for a JSON Web Key Set');
    }
}
function isJWKSLike(jwks) {
    return jwks && typeof jwks === "object" && Array.isArray(jwks.keys) && jwks.keys.every(isJWKLike);
}
function isJWKLike(key) {
    return isObject(key);
}
function clone(obj) {
    if (typeof structuredClone === "function") {
        return structuredClone(obj);
    }
    return JSON.parse(JSON.stringify(obj));
}
class LocalJWKSet {
    constructor(jwks){
        this._cached = new WeakMap();
        if (!isJWKSLike(jwks)) {
            throw new JWKSInvalid("JSON Web Key Set malformed");
        }
        this._jwks = clone(jwks);
    }
    async getKey(protectedHeader, token) {
        const { alg , kid  } = {
            ...protectedHeader,
            ...token === null || token === void 0 ? void 0 : token.header
        };
        const kty = getKtyFromAlg(alg);
        const candidates = this._jwks.keys.filter((jwk)=>{
            let candidate = kty === jwk.kty;
            if (candidate && typeof kid === "string") {
                candidate = kid === jwk.kid;
            }
            if (candidate && typeof jwk.alg === "string") {
                candidate = alg === jwk.alg;
            }
            if (candidate && typeof jwk.use === "string") {
                candidate = jwk.use === "sig";
            }
            if (candidate && Array.isArray(jwk.key_ops)) {
                candidate = jwk.key_ops.includes("verify");
            }
            if (candidate && alg === "EdDSA") {
                candidate = jwk.crv === "Ed25519" || jwk.crv === "Ed448";
            }
            if (candidate) {
                switch(alg){
                    case "ES256":
                        candidate = jwk.crv === "P-256";
                        break;
                    case "ES256K":
                        candidate = jwk.crv === "secp256k1";
                        break;
                    case "ES384":
                        candidate = jwk.crv === "P-384";
                        break;
                    case "ES512":
                        candidate = jwk.crv === "P-521";
                        break;
                }
            }
            return candidate;
        });
        const { 0: jwk , length  } = candidates;
        if (length === 0) {
            throw new JWKSNoMatchingKey();
        } else if (length !== 1) {
            const error = new JWKSMultipleMatchingKeys();
            const { _cached  } = this;
            error[Symbol.asyncIterator] = async function*() {
                for (const jwk of candidates){
                    try {
                        yield await importWithAlgCache(_cached, jwk, alg);
                    } catch  {
                        continue;
                    }
                }
            };
            throw error;
        }
        return importWithAlgCache(this._cached, jwk, alg);
    }
}
async function importWithAlgCache(cache, jwk, alg) {
    const cached = cache.get(jwk) || cache.set(jwk, {}).get(jwk);
    if (cached[alg] === undefined) {
        const key = await importJWK({
            ...jwk,
            ext: true
        }, alg);
        if (key instanceof Uint8Array || key.type !== "public") {
            throw new JWKSInvalid("JSON Web Key Set members must be public keys");
        }
        cached[alg] = key;
    }
    return cached[alg];
}
function createLocalJWKSet(jwks) {
    const set = new LocalJWKSet(jwks);
    return async function(protectedHeader, token) {
        return set.getKey(protectedHeader, token);
    };
}

// EXTERNAL MODULE: external "http"
var external_http_ = __webpack_require__(3685);
// EXTERNAL MODULE: external "https"
var external_https_ = __webpack_require__(5687);
// EXTERNAL MODULE: external "events"
var external_events_ = __webpack_require__(2361);
;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/fetch_jwks.js





const fetchJwks = async (url, timeout, options)=>{
    let get;
    switch(url.protocol){
        case "https:":
            get = external_https_.get;
            break;
        case "http:":
            get = external_http_.get;
            break;
        default:
            throw new TypeError("Unsupported URL protocol.");
    }
    const { agent , headers  } = options;
    const req = get(url.href, {
        agent,
        timeout,
        headers
    });
    const [response] = await Promise.race([
        (0,external_events_.once)(req, "response"),
        (0,external_events_.once)(req, "timeout")
    ]);
    if (!response) {
        req.destroy();
        throw new JWKSTimeout();
    }
    if (response.statusCode !== 200) {
        throw new JOSEError("Expected 200 OK from the JSON Web Key Set HTTP response");
    }
    const parts = [];
    for await (const part of response){
        parts.push(part);
    }
    try {
        return JSON.parse(decoder.decode(concat(...parts)));
    } catch  {
        throw new JOSEError("Failed to parse the JSON Web Key Set HTTP response as JSON");
    }
};
/* harmony default export */ const fetch_jwks = (fetchJwks);

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/jwks/remote.js



function isCloudflareWorkers() {
    return typeof WebSocketPair !== "undefined" || typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers" || typeof EdgeRuntime !== "undefined" && EdgeRuntime === "vercel";
}
class RemoteJWKSet extends LocalJWKSet {
    constructor(url, options){
        super({
            keys: []
        });
        this._jwks = undefined;
        if (!(url instanceof URL)) {
            throw new TypeError("url must be an instance of URL");
        }
        this._url = new URL(url.href);
        this._options = {
            agent: options === null || options === void 0 ? void 0 : options.agent,
            headers: options === null || options === void 0 ? void 0 : options.headers
        };
        this._timeoutDuration = typeof (options === null || options === void 0 ? void 0 : options.timeoutDuration) === "number" ? options === null || options === void 0 ? void 0 : options.timeoutDuration : 5000;
        this._cooldownDuration = typeof (options === null || options === void 0 ? void 0 : options.cooldownDuration) === "number" ? options === null || options === void 0 ? void 0 : options.cooldownDuration : 30000;
        this._cacheMaxAge = typeof (options === null || options === void 0 ? void 0 : options.cacheMaxAge) === "number" ? options === null || options === void 0 ? void 0 : options.cacheMaxAge : 600000;
    }
    coolingDown() {
        return typeof this._jwksTimestamp === "number" ? Date.now() < this._jwksTimestamp + this._cooldownDuration : false;
    }
    fresh() {
        return typeof this._jwksTimestamp === "number" ? Date.now() < this._jwksTimestamp + this._cacheMaxAge : false;
    }
    async getKey(protectedHeader, token) {
        if (!this._jwks || !this.fresh()) {
            await this.reload();
        }
        try {
            return await super.getKey(protectedHeader, token);
        } catch (err) {
            if (err instanceof JWKSNoMatchingKey) {
                if (this.coolingDown() === false) {
                    await this.reload();
                    return super.getKey(protectedHeader, token);
                }
            }
            throw err;
        }
    }
    async reload() {
        if (this._pendingFetch && isCloudflareWorkers()) {
            this._pendingFetch = undefined;
        }
        this._pendingFetch || (this._pendingFetch = fetch_jwks(this._url, this._timeoutDuration, this._options).then((json)=>{
            if (!isJWKSLike(json)) {
                throw new JWKSInvalid("JSON Web Key Set malformed");
            }
            this._jwks = {
                keys: json.keys
            };
            this._jwksTimestamp = Date.now();
            this._pendingFetch = undefined;
        }).catch((err)=>{
            this._pendingFetch = undefined;
            throw err;
        }));
        await this._pendingFetch;
    }
}
function createRemoteJWKSet(url, options) {
    const set = new RemoteJWKSet(url, options);
    return async function(protectedHeader, token) {
        return set.getKey(protectedHeader, token);
    };
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/jwt/unsecured.js





class UnsecuredJWT extends ProduceJWT {
    encode() {
        const header = encode(JSON.stringify({
            alg: "none"
        }));
        const payload = encode(JSON.stringify(this._payload));
        return `${header}.${payload}.`;
    }
    static decode(jwt, options) {
        if (typeof jwt !== "string") {
            throw new JWTInvalid("Unsecured JWT must be a string");
        }
        const { 0: encodedHeader , 1: encodedPayload , 2: signature , length  } = jwt.split(".");
        if (length !== 3 || signature !== "") {
            throw new JWTInvalid("Invalid Unsecured JWT");
        }
        let header;
        try {
            header = JSON.parse(decoder.decode(decode(encodedHeader)));
            if (header.alg !== "none") throw new Error();
        } catch  {
            throw new JWTInvalid("Invalid Unsecured JWT");
        }
        const payload = jwt_claims_set(header, decode(encodedPayload), options);
        return {
            payload,
            header
        };
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/util/base64url.js

const base64url_encode = encode;
const base64url_decode = decode;

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/util/decode_protected_header.js



function decodeProtectedHeader(token) {
    let protectedB64u;
    if (typeof token === "string") {
        const parts = token.split(".");
        if (parts.length === 3 || parts.length === 5) {
            ;
            [protectedB64u] = parts;
        }
    } else if (typeof token === "object" && token) {
        if ("protected" in token) {
            protectedB64u = token.protected;
        } else {
            throw new TypeError("Token does not contain a Protected Header");
        }
    }
    try {
        if (typeof protectedB64u !== "string" || !protectedB64u) {
            throw new Error();
        }
        const result = JSON.parse(decoder.decode(base64url_decode(protectedB64u)));
        if (!isObject(result)) {
            throw new Error();
        }
        return result;
    } catch  {
        throw new TypeError("Invalid Token or Protected Header formatting");
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/util/decode_jwt.js




function decodeJwt(jwt) {
    if (typeof jwt !== "string") throw new JWTInvalid("JWTs must use Compact JWS serialization, JWT must be a string");
    const { 1: payload , length  } = jwt.split(".");
    if (length === 5) throw new JWTInvalid("Only JWTs using Compact JWS serialization can be decoded");
    if (length !== 3) throw new JWTInvalid("Invalid JWT");
    if (!payload) throw new JWTInvalid("JWTs must contain a payload");
    let decoded;
    try {
        decoded = base64url_decode(payload);
    } catch  {
        throw new JWTInvalid("Failed to base64url decode the payload");
    }
    let result;
    try {
        result = JSON.parse(decoder.decode(decoded));
    } catch  {
        throw new JWTInvalid("Failed to parse the decoded payload as JSON");
    }
    if (!isObject(result)) throw new JWTInvalid("Invalid JWT Claims Set");
    return result;
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/runtime/generate.js





const generate = (0,external_util_.promisify)(external_crypto_.generateKeyPair);
async function generateSecret(alg, options) {
    let length;
    switch(alg){
        case "HS256":
        case "HS384":
        case "HS512":
        case "A128CBC-HS256":
        case "A192CBC-HS384":
        case "A256CBC-HS512":
            length = parseInt(alg.slice(-3), 10);
            break;
        case "A128KW":
        case "A192KW":
        case "A256KW":
        case "A128GCMKW":
        case "A192GCMKW":
        case "A256GCMKW":
        case "A128GCM":
        case "A192GCM":
        case "A256GCM":
            length = parseInt(alg.slice(1, 4), 10);
            break;
        default:
            throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
    }
    return (0,external_crypto_.createSecretKey)((0,external_crypto_.randomFillSync)(new Uint8Array(length >> 3)));
}
async function generate_generateKeyPair(alg, options) {
    var _a, _b;
    switch(alg){
        case "RS256":
        case "RS384":
        case "RS512":
        case "PS256":
        case "PS384":
        case "PS512":
        case "RSA-OAEP":
        case "RSA-OAEP-256":
        case "RSA-OAEP-384":
        case "RSA-OAEP-512":
        case "RSA1_5":
            {
                const modulusLength = (_a = options === null || options === void 0 ? void 0 : options.modulusLength) !== null && _a !== void 0 ? _a : 2048;
                if (typeof modulusLength !== "number" || modulusLength < 2048) {
                    throw new JOSENotSupported("Invalid or unsupported modulusLength option provided, 2048 bits or larger keys must be used");
                }
                const keypair = await generate("rsa", {
                    modulusLength,
                    publicExponent: 0x10001
                });
                setModulusLength(keypair.privateKey, modulusLength);
                setModulusLength(keypair.publicKey, modulusLength);
                return keypair;
            }
        case "ES256":
            return generate("ec", {
                namedCurve: "P-256"
            });
        case "ES256K":
            return generate("ec", {
                namedCurve: "secp256k1"
            });
        case "ES384":
            return generate("ec", {
                namedCurve: "P-384"
            });
        case "ES512":
            return generate("ec", {
                namedCurve: "P-521"
            });
        case "EdDSA":
            {
                switch(options === null || options === void 0 ? void 0 : options.crv){
                    case undefined:
                    case "Ed25519":
                        return generate("ed25519");
                    case "Ed448":
                        return generate("ed448");
                    default:
                        throw new JOSENotSupported("Invalid or unsupported crv option provided, supported values are Ed25519 and Ed448");
                }
            }
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
            const crv = (_b = options === null || options === void 0 ? void 0 : options.crv) !== null && _b !== void 0 ? _b : "P-256";
            switch(crv){
                case undefined:
                case "P-256":
                case "P-384":
                case "P-521":
                    return generate("ec", {
                        namedCurve: crv
                    });
                case "X25519":
                    return generate("x25519");
                case "X448":
                    return generate("x448");
                default:
                    throw new JOSENotSupported("Invalid or unsupported crv option provided, supported values are P-256, P-384, P-521, X25519, and X448");
            }
        default:
            throw new JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
    }
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/key/generate_key_pair.js

async function generate_key_pair_generateKeyPair(alg, options) {
    return generate_generateKeyPair(alg, options);
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/key/generate_secret.js

async function generate_secret_generateSecret(alg, options) {
    return generateSecret(alg, options);
}

;// CONCATENATED MODULE: ../../node_modules/.pnpm/jose@4.14.6/node_modules/jose/dist/node/esm/index.js































/***/ }),

/***/ 6912:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Issuer": () => (/* binding */ Issuer),
/* harmony export */   "Strategy": () => (/* binding */ Strategy),
/* harmony export */   "TokenSet": () => (/* binding */ TokenSet),
/* harmony export */   "custom": () => (/* binding */ custom),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "errors": () => (/* binding */ errors),
/* harmony export */   "generators": () => (/* binding */ generators)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1634);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_index_js__WEBPACK_IMPORTED_MODULE_0__);
const Issuer = _index_js__WEBPACK_IMPORTED_MODULE_0__.Issuer;
const Strategy = _index_js__WEBPACK_IMPORTED_MODULE_0__.Strategy;
const TokenSet = _index_js__WEBPACK_IMPORTED_MODULE_0__.TokenSet;
const errors = _index_js__WEBPACK_IMPORTED_MODULE_0__.errors;
const custom = _index_js__WEBPACK_IMPORTED_MODULE_0__.custom;
const generators = _index_js__WEBPACK_IMPORTED_MODULE_0__.generators;


/***/ }),

/***/ 936:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "render": () => (/* binding */ S),
/* harmony export */   "renderToStaticMarkup": () => (/* binding */ S),
/* harmony export */   "renderToString": () => (/* binding */ S),
/* harmony export */   "shallowRender": () => (/* binding */ x)
/* harmony export */ });
/* harmony import */ var preact__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2127);

var n = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i, o = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/, i = /[\s\n\\/='"\0<>]/, l = /^xlink:?./, a = /["&<]/;
function s(e) {
    if (!1 === a.test(e += "")) return e;
    for(var t = 0, r = 0, n = "", o = ""; r < e.length; r++){
        switch(e.charCodeAt(r)){
            case 34:
                o = "&quot;";
                break;
            case 38:
                o = "&amp;";
                break;
            case 60:
                o = "&lt;";
                break;
            default:
                continue;
        }
        r !== t && (n += e.slice(t, r)), n += o, t = r + 1;
    }
    return r !== t && (n += e.slice(t, r)), n;
}
var f = function(e, t) {
    return String(e).replace(/(\n+)/g, "$1" + (t || "	"));
}, u = function(e, t, r) {
    return String(e).length > (t || 40) || !r && -1 !== String(e).indexOf("\n") || -1 !== String(e).indexOf("<");
}, c = {}, _ = /([A-Z])/g;
function p(e) {
    var t = "";
    for(var r in e){
        var o = e[r];
        null != o && "" !== o && (t && (t += " "), t += "-" == r[0] ? r : c[r] || (c[r] = r.replace(_, "-$1").toLowerCase()), t = "number" == typeof o && !1 === n.test(r) ? t + ": " + o + "px;" : t + ": " + o + ";");
    }
    return t || void 0;
}
function d(e, t) {
    return Array.isArray(t) ? t.reduce(d, e) : null != t && !1 !== t && e.push(t), e;
}
function v() {
    this.__d = !0;
}
function h(e, t) {
    return {
        __v: e,
        context: t,
        props: e.props,
        setState: v,
        forceUpdate: v,
        __d: !0,
        __h: []
    };
}
function g(e, t) {
    var r = e.contextType, n = r && t[r.__c];
    return null != r ? n ? n.props.value : r.__ : t;
}
var y = [];
function m(r, n, a, c, _, v) {
    if (null == r || "boolean" == typeof r) return "";
    if ("object" != typeof r) return "function" == typeof r ? "" : s(r);
    var b = a.pretty, x = b && "string" == typeof b ? b : "	";
    if (Array.isArray(r)) {
        for(var k = "", S = 0; S < r.length; S++)b && S > 0 && (k += "\n"), k += m(r[S], n, a, c, _, v);
        return k;
    }
    if (void 0 !== r.constructor) return "";
    var w, C = r.type, O = r.props, j = !1;
    if ("function" == typeof C) {
        if (j = !0, !a.shallow || !c && !1 !== a.renderRootComponent) {
            if (C === preact__WEBPACK_IMPORTED_MODULE_0__.Fragment) {
                var A = [];
                return d(A, r.props.children), m(A, n, a, !1 !== a.shallowHighOrder, _, v);
            }
            var F, H = r.__c = h(r, n);
            preact__WEBPACK_IMPORTED_MODULE_0__.options.__b && preact__WEBPACK_IMPORTED_MODULE_0__.options.__b(r);
            var M = preact__WEBPACK_IMPORTED_MODULE_0__.options.__r;
            if (C.prototype && "function" == typeof C.prototype.render) {
                var L = g(C, n);
                (H = r.__c = new C(O, L)).__v = r, H._dirty = H.__d = !0, H.props = O, null == H.state && (H.state = {}), null == H._nextState && null == H.__s && (H._nextState = H.__s = H.state), H.context = L, C.getDerivedStateFromProps ? H.state = Object.assign({}, H.state, C.getDerivedStateFromProps(H.props, H.state)) : H.componentWillMount && (H.componentWillMount(), H.state = H._nextState !== H.state ? H._nextState : H.__s !== H.state ? H.__s : H.state), M && M(r), F = H.render(H.props, H.state, H.context);
            } else for(var T = g(C, n), E = 0; H.__d && E++ < 25;)H.__d = !1, M && M(r), F = C.call(r.__c, O, T);
            return H.getChildContext && (n = Object.assign({}, n, H.getChildContext())), preact__WEBPACK_IMPORTED_MODULE_0__.options.diffed && preact__WEBPACK_IMPORTED_MODULE_0__.options.diffed(r), m(F, n, a, !1 !== a.shallowHighOrder, _, v);
        }
        C = (w = C).displayName || w !== Function && w.name || function(e) {
            var t = (Function.prototype.toString.call(e).match(/^\s*function\s+([^( ]+)/) || "")[1];
            if (!t) {
                for(var r = -1, n = y.length; n--;)if (y[n] === e) {
                    r = n;
                    break;
                }
                r < 0 && (r = y.push(e) - 1), t = "UnnamedComponent" + r;
            }
            return t;
        }(w);
    }
    var $, D, N = "<" + C;
    if (O) {
        var P = Object.keys(O);
        a && !0 === a.sortAttributes && P.sort();
        for(var W = 0; W < P.length; W++){
            var I = P[W], R = O[I];
            if ("children" !== I) {
                if (!i.test(I) && (a && a.allAttributes || "key" !== I && "ref" !== I && "__self" !== I && "__source" !== I)) {
                    if ("defaultValue" === I) I = "value";
                    else if ("defaultChecked" === I) I = "checked";
                    else if ("defaultSelected" === I) I = "selected";
                    else if ("className" === I) {
                        if (void 0 !== O.class) continue;
                        I = "class";
                    } else _ && l.test(I) && (I = I.toLowerCase().replace(/^xlink:?/, "xlink:"));
                    if ("htmlFor" === I) {
                        if (O.for) continue;
                        I = "for";
                    }
                    "style" === I && R && "object" == typeof R && (R = p(R)), "a" === I[0] && "r" === I[1] && "boolean" == typeof R && (R = String(R));
                    var U = a.attributeHook && a.attributeHook(I, R, n, a, j);
                    if (U || "" === U) N += U;
                    else if ("dangerouslySetInnerHTML" === I) D = R && R.__html;
                    else if ("textarea" === C && "value" === I) $ = R;
                    else if ((R || 0 === R || "" === R) && "function" != typeof R) {
                        if (!(!0 !== R && "" !== R || (R = I, a && a.xml))) {
                            N = N + " " + I;
                            continue;
                        }
                        if ("value" === I) {
                            if ("select" === C) {
                                v = R;
                                continue;
                            }
                            "option" === C && v == R && void 0 === O.selected && (N += " selected");
                        }
                        N = N + " " + I + '="' + s(R) + '"';
                    }
                }
            } else $ = R;
        }
    }
    if (b) {
        var V = N.replace(/\n\s*/, " ");
        V === N || ~V.indexOf("\n") ? b && ~N.indexOf("\n") && (N += "\n") : N = V;
    }
    if (N += ">", i.test(C)) throw new Error(C + " is not a valid HTML tag name in " + N);
    var q, z = o.test(C) || a.voidElements && a.voidElements.test(C), Z = [];
    if (D) b && u(D) && (D = "\n" + x + f(D, x)), N += D;
    else if (null != $ && d(q = [], $).length) {
        for(var B = b && ~N.indexOf("\n"), G = !1, J = 0; J < q.length; J++){
            var K = q[J];
            if (null != K && !1 !== K) {
                var Q = m(K, n, a, !0, "svg" === C || "foreignObject" !== C && _, v);
                if (b && !B && u(Q) && (B = !0), Q) if (b) {
                    var X = Q.length > 0 && "<" != Q[0];
                    G && X ? Z[Z.length - 1] += Q : Z.push(Q), G = X;
                } else Z.push(Q);
            }
        }
        if (b && B) for(var Y = Z.length; Y--;)Z[Y] = "\n" + x + f(Z[Y], x);
    }
    if (Z.length || D) N += Z.join("");
    else if (a && a.xml) return N.substring(0, N.length - 1) + " />";
    return !z || q || D ? (b && ~N.indexOf("\n") && (N += "\n"), N = N + "</" + C + ">") : N = N.replace(/>$/, " />"), N;
}
var b = {
    shallow: !0
};
S.render = S;
var x = function(e, t) {
    return S(e, t, b);
}, k = [];
function S(n, o, i) {
    o = o || {};
    var l = preact__WEBPACK_IMPORTED_MODULE_0__.options.__s;
    preact__WEBPACK_IMPORTED_MODULE_0__.options.__s = !0;
    var a, s = (0,preact__WEBPACK_IMPORTED_MODULE_0__.h)(preact__WEBPACK_IMPORTED_MODULE_0__.Fragment, null);
    return s.__k = [
        n
    ], a = i && (i.pretty || i.voidElements || i.sortAttributes || i.shallow || i.allAttributes || i.xml || i.attributeHook) ? m(n, o, i) : F(n, o, !1, void 0, s), preact__WEBPACK_IMPORTED_MODULE_0__.options.__c && preact__WEBPACK_IMPORTED_MODULE_0__.options.__c(n, k), preact__WEBPACK_IMPORTED_MODULE_0__.options.__s = l, k.length = 0, a;
}
function w(e) {
    return null == e || "boolean" == typeof e ? null : "string" == typeof e || "number" == typeof e || "bigint" == typeof e ? (0,preact__WEBPACK_IMPORTED_MODULE_0__.h)(null, null, e) : e;
}
function C(e, t) {
    return "className" === e ? "class" : "htmlFor" === e ? "for" : "defaultValue" === e ? "value" : "defaultChecked" === e ? "checked" : "defaultSelected" === e ? "selected" : t && l.test(e) ? e.toLowerCase().replace(/^xlink:?/, "xlink:") : e;
}
function O(e, t) {
    return "style" === e && null != t && "object" == typeof t ? p(t) : "a" === e[0] && "r" === e[1] && "boolean" == typeof t ? String(t) : t;
}
var j = Array.isArray, A = Object.assign;
function F(r, n, l, a, f) {
    if (null == r || !0 === r || !1 === r || "" === r) return "";
    if ("object" != typeof r) return "function" == typeof r ? "" : s(r);
    if (j(r)) {
        var u = "";
        f.__k = r;
        for(var c = 0; c < r.length; c++)u += F(r[c], n, l, a, f), r[c] = w(r[c]);
        return u;
    }
    if (void 0 !== r.constructor) return "";
    r.__ = f, preact__WEBPACK_IMPORTED_MODULE_0__.options.__b && preact__WEBPACK_IMPORTED_MODULE_0__.options.__b(r);
    var _ = r.type, p = r.props;
    if ("function" == typeof _) {
        var d;
        if (_ === preact__WEBPACK_IMPORTED_MODULE_0__.Fragment) d = p.children;
        else {
            d = _.prototype && "function" == typeof _.prototype.render ? function(e, r) {
                var n = e.type, o = g(n, r), i = new n(e.props, o);
                e.__c = i, i.__v = e, i.__d = !0, i.props = e.props, null == i.state && (i.state = {}), null == i.__s && (i.__s = i.state), i.context = o, n.getDerivedStateFromProps ? i.state = A({}, i.state, n.getDerivedStateFromProps(i.props, i.state)) : i.componentWillMount && (i.componentWillMount(), i.state = i.__s !== i.state ? i.__s : i.state);
                var l = preact__WEBPACK_IMPORTED_MODULE_0__.options.__r;
                return l && l(e), i.render(i.props, i.state, i.context);
            }(r, n) : function(e, r) {
                var n, o = h(e, r), i = g(e.type, r);
                e.__c = o;
                for(var l = preact__WEBPACK_IMPORTED_MODULE_0__.options.__r, a = 0; o.__d && a++ < 25;)o.__d = !1, l && l(e), n = e.type.call(o, e.props, i);
                return n;
            }(r, n);
            var v = r.__c;
            v.getChildContext && (n = A({}, n, v.getChildContext()));
        }
        var y = F(d = null != d && d.type === preact__WEBPACK_IMPORTED_MODULE_0__.Fragment && null == d.key ? d.props.children : d, n, l, a, r);
        return preact__WEBPACK_IMPORTED_MODULE_0__.options.diffed && preact__WEBPACK_IMPORTED_MODULE_0__.options.diffed(r), r.__ = void 0, preact__WEBPACK_IMPORTED_MODULE_0__.options.unmount && preact__WEBPACK_IMPORTED_MODULE_0__.options.unmount(r), y;
    }
    var m, b, x = "<";
    if (x += _, p) for(var k in m = p.children, p){
        var S = p[k];
        if (!("key" === k || "ref" === k || "__self" === k || "__source" === k || "children" === k || "className" === k && "class" in p || "htmlFor" === k && "for" in p || i.test(k))) {
            if (S = O(k = C(k, l), S), "dangerouslySetInnerHTML" === k) b = S && S.__html;
            else if ("textarea" === _ && "value" === k) m = S;
            else if ((S || 0 === S || "" === S) && "function" != typeof S) {
                if (!0 === S || "" === S) {
                    S = k, x = x + " " + k;
                    continue;
                }
                if ("value" === k) {
                    if ("select" === _) {
                        a = S;
                        continue;
                    }
                    "option" !== _ || a != S || "selected" in p || (x += " selected");
                }
                x = x + " " + k + '="' + s(S) + '"';
            }
        }
    }
    var H = x;
    if (x += ">", i.test(_)) throw new Error(_ + " is not a valid HTML tag name in " + x);
    var M = "", L = !1;
    if (b) M += b, L = !0;
    else if ("string" == typeof m) M += s(m), L = !0;
    else if (j(m)) {
        r.__k = m;
        for(var T = 0; T < m.length; T++){
            var E = m[T];
            if (m[T] = w(E), null != E && !1 !== E) {
                var $ = F(E, n, "svg" === _ || "foreignObject" !== _ && l, a, r);
                $ && (M += $, L = !0);
            }
        }
    } else if (null != m && !1 !== m && !0 !== m) {
        r.__k = [
            w(m)
        ];
        var D = F(m, n, "svg" === _ || "foreignObject" !== _ && l, a, r);
        D && (M += D, L = !0);
    }
    if (preact__WEBPACK_IMPORTED_MODULE_0__.options.diffed && preact__WEBPACK_IMPORTED_MODULE_0__.options.diffed(r), r.__ = void 0, preact__WEBPACK_IMPORTED_MODULE_0__.options.unmount && preact__WEBPACK_IMPORTED_MODULE_0__.options.unmount(r), L) x += M;
    else if (o.test(_)) return H + " />";
    return x + "</" + _ + ">";
}
S.shallowRender = x;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (S);
 //# sourceMappingURL=index.module.js.map


/***/ }),

/***/ 2127:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Component": () => (/* binding */ b),
/* harmony export */   "Fragment": () => (/* binding */ k),
/* harmony export */   "cloneElement": () => (/* binding */ F),
/* harmony export */   "createContext": () => (/* binding */ G),
/* harmony export */   "createElement": () => (/* binding */ y),
/* harmony export */   "createRef": () => (/* binding */ _),
/* harmony export */   "h": () => (/* binding */ y),
/* harmony export */   "hydrate": () => (/* binding */ E),
/* harmony export */   "isValidElement": () => (/* binding */ t),
/* harmony export */   "options": () => (/* binding */ l),
/* harmony export */   "render": () => (/* binding */ D),
/* harmony export */   "toChildArray": () => (/* binding */ C)
/* harmony export */ });
var n, l, u, t, i, o, r, f, e, c = {}, s = [], a = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, h = Array.isArray;
function v(n, l) {
    for(var u in l)n[u] = l[u];
    return n;
}
function p(n) {
    var l = n.parentNode;
    l && l.removeChild(n);
}
function y(l, u, t) {
    var i, o, r, f = {};
    for(r in u)"key" == r ? i = u[r] : "ref" == r ? o = u[r] : f[r] = u[r];
    if (arguments.length > 2 && (f.children = arguments.length > 3 ? n.call(arguments, 2) : t), "function" == typeof l && null != l.defaultProps) for(r in l.defaultProps)void 0 === f[r] && (f[r] = l.defaultProps[r]);
    return d(l, f, i, o, null);
}
function d(n, t, i, o, r) {
    var f = {
        type: n,
        props: t,
        key: i,
        ref: o,
        __k: null,
        __: null,
        __b: 0,
        __e: null,
        __d: void 0,
        __c: null,
        __h: null,
        constructor: void 0,
        __v: null == r ? ++u : r
    };
    return null == r && null != l.vnode && l.vnode(f), f;
}
function _() {
    return {
        current: null
    };
}
function k(n) {
    return n.children;
}
function b(n, l) {
    this.props = n, this.context = l;
}
function g(n, l) {
    if (null == l) return n.__ ? g(n.__, n.__.__k.indexOf(n) + 1) : null;
    for(var u; l < n.__k.length; l++)if (null != (u = n.__k[l]) && null != u.__e) return u.__e;
    return "function" == typeof n.type ? g(n) : null;
}
function m(n) {
    var l, u;
    if (null != (n = n.__) && null != n.__c) {
        for(n.__e = n.__c.base = null, l = 0; l < n.__k.length; l++)if (null != (u = n.__k[l]) && null != u.__e) {
            n.__e = n.__c.base = u.__e;
            break;
        }
        return m(n);
    }
}
function w(n) {
    (!n.__d && (n.__d = !0) && i.push(n) && !x.__r++ || o !== l.debounceRendering) && ((o = l.debounceRendering) || r)(x);
}
function x() {
    var n, l, u, t, o, r, e, c, s;
    for(i.sort(f); n = i.shift();)n.__d && (l = i.length, t = void 0, o = void 0, r = void 0, c = (e = (u = n).__v).__e, (s = u.__P) && (t = [], o = [], (r = v({}, e)).__v = e.__v + 1, L(s, e, r, u.__n, void 0 !== s.ownerSVGElement, null != e.__h ? [
        c
    ] : null, t, null == c ? g(e) : c, e.__h, o), M(t, e, o), e.__e != c && m(e)), i.length > l && i.sort(f));
    x.__r = 0;
}
function P(n, l, u, t, i, o, r, f, e, a, v) {
    var p, y, _, b, m, w, x, P, C, H = 0, I = t && t.__k || s, T = I.length, j = T, z = l.length;
    for(u.__k = [], p = 0; p < z; p++)null != (b = u.__k[p] = null == (b = l[p]) || "boolean" == typeof b || "function" == typeof b ? null : "string" == typeof b || "number" == typeof b || "bigint" == typeof b ? d(null, b, null, null, b) : h(b) ? d(k, {
        children: b
    }, null, null, null) : b.__b > 0 ? d(b.type, b.props, b.key, b.ref ? b.ref : null, b.__v) : b) ? (b.__ = u, b.__b = u.__b + 1, -1 === (P = A(b, I, x = p + H, j)) ? _ = c : (_ = I[P] || c, I[P] = void 0, j--), L(n, b, _, i, o, r, f, e, a, v), m = b.__e, (y = b.ref) && _.ref != y && (_.ref && O(_.ref, null, b), v.push(y, b.__c || m, b)), null != m && (null == w && (w = m), (C = _ === c || null === _.__v) ? -1 == P && H-- : P !== x && (P === x + 1 ? H++ : P > x ? j > z - x ? H += P - x : H-- : H = P < x && P == x - 1 ? P - x : 0), x = p + H, "function" != typeof b.type || P === x && _.__k !== b.__k ? "function" == typeof b.type || P === x && !C ? void 0 !== b.__d ? (e = b.__d, b.__d = void 0) : e = m.nextSibling : e = S(n, m, e) : e = $(b, e, n), "function" == typeof u.type && (u.__d = e))) : (_ = I[p]) && null == _.key && _.__e && (_.__e == e && (e = g(_)), q(_, _, !1), I[p] = null);
    for(u.__e = w, p = T; p--;)null != I[p] && ("function" == typeof u.type && null != I[p].__e && I[p].__e == u.__d && (u.__d = I[p].__e.nextSibling), q(I[p], I[p]));
}
function $(n, l, u) {
    for(var t, i = n.__k, o = 0; i && o < i.length; o++)(t = i[o]) && (t.__ = n, l = "function" == typeof t.type ? $(t, l, u) : S(u, t.__e, l));
    return l;
}
function C(n, l) {
    return l = l || [], null == n || "boolean" == typeof n || (h(n) ? n.some(function(n) {
        C(n, l);
    }) : l.push(n)), l;
}
function S(n, l, u) {
    return null == u || u.parentNode !== n ? n.insertBefore(l, null) : l == u && null != l.parentNode || n.insertBefore(l, u), l.nextSibling;
}
function A(n, l, u, t) {
    var i = n.key, o = n.type, r = u - 1, f = u + 1, e = l[u];
    if (null === e || e && i == e.key && o === e.type) return u;
    if (t > (null != e ? 1 : 0)) for(; r >= 0 || f < l.length;){
        if (r >= 0) {
            if ((e = l[r]) && i == e.key && o === e.type) return r;
            r--;
        }
        if (f < l.length) {
            if ((e = l[f]) && i == e.key && o === e.type) return f;
            f++;
        }
    }
    return -1;
}
function H(n, l, u, t, i) {
    var o;
    for(o in u)"children" === o || "key" === o || o in l || T(n, o, null, u[o], t);
    for(o in l)i && "function" != typeof l[o] || "children" === o || "key" === o || "value" === o || "checked" === o || u[o] === l[o] || T(n, o, l[o], u[o], t);
}
function I(n, l, u) {
    "-" === l[0] ? n.setProperty(l, null == u ? "" : u) : n[l] = null == u ? "" : "number" != typeof u || a.test(l) ? u : u + "px";
}
function T(n, l, u, t, i) {
    var o;
    n: if ("style" === l) if ("string" == typeof u) n.style.cssText = u;
    else {
        if ("string" == typeof t && (n.style.cssText = t = ""), t) for(l in t)u && l in u || I(n.style, l, "");
        if (u) for(l in u)t && u[l] === t[l] || I(n.style, l, u[l]);
    }
    else if ("o" === l[0] && "n" === l[1]) o = l !== (l = l.replace(/(PointerCapture)$|Capture$/, "$1")), l = l.toLowerCase() in n ? l.toLowerCase().slice(2) : l.slice(2), n.l || (n.l = {}), n.l[l + o] = u, u ? t || n.addEventListener(l, o ? z : j, o) : n.removeEventListener(l, o ? z : j, o);
    else if ("dangerouslySetInnerHTML" !== l) {
        if (i) l = l.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
        else if ("width" !== l && "height" !== l && "href" !== l && "list" !== l && "form" !== l && "tabIndex" !== l && "download" !== l && "rowSpan" !== l && "colSpan" !== l && l in n) try {
            n[l] = null == u ? "" : u;
            break n;
        } catch (n) {}
        "function" == typeof u || (null == u || !1 === u && "-" !== l[4] ? n.removeAttribute(l) : n.setAttribute(l, u));
    }
}
function j(n) {
    return this.l[n.type + !1](l.event ? l.event(n) : n);
}
function z(n) {
    return this.l[n.type + !0](l.event ? l.event(n) : n);
}
function L(n, u, t, i, o, r, f, e, c, s) {
    var a, p, y, d, _, g, m, w, x, $, C, S, A, H, I, T = u.type;
    if (void 0 !== u.constructor) return null;
    null != t.__h && (c = t.__h, e = u.__e = t.__e, u.__h = null, r = [
        e
    ]), (a = l.__b) && a(u);
    n: if ("function" == typeof T) try {
        if (w = u.props, x = (a = T.contextType) && i[a.__c], $ = a ? x ? x.props.value : a.__ : i, t.__c ? m = (p = u.__c = t.__c).__ = p.__E : ("prototype" in T && T.prototype.render ? u.__c = p = new T(w, $) : (u.__c = p = new b(w, $), p.constructor = T, p.render = B), x && x.sub(p), p.props = w, p.state || (p.state = {}), p.context = $, p.__n = i, y = p.__d = !0, p.__h = [], p._sb = []), null == p.__s && (p.__s = p.state), null != T.getDerivedStateFromProps && (p.__s == p.state && (p.__s = v({}, p.__s)), v(p.__s, T.getDerivedStateFromProps(w, p.__s))), d = p.props, _ = p.state, p.__v = u, y) null == T.getDerivedStateFromProps && null != p.componentWillMount && p.componentWillMount(), null != p.componentDidMount && p.__h.push(p.componentDidMount);
        else {
            if (null == T.getDerivedStateFromProps && w !== d && null != p.componentWillReceiveProps && p.componentWillReceiveProps(w, $), !p.__e && (null != p.shouldComponentUpdate && !1 === p.shouldComponentUpdate(w, p.__s, $) || u.__v === t.__v)) {
                for(u.__v !== t.__v && (p.props = w, p.state = p.__s, p.__d = !1), u.__e = t.__e, u.__k = t.__k, u.__k.forEach(function(n) {
                    n && (n.__ = u);
                }), C = 0; C < p._sb.length; C++)p.__h.push(p._sb[C]);
                p._sb = [], p.__h.length && f.push(p);
                break n;
            }
            null != p.componentWillUpdate && p.componentWillUpdate(w, p.__s, $), null != p.componentDidUpdate && p.__h.push(function() {
                p.componentDidUpdate(d, _, g);
            });
        }
        if (p.context = $, p.props = w, p.__P = n, p.__e = !1, S = l.__r, A = 0, "prototype" in T && T.prototype.render) {
            for(p.state = p.__s, p.__d = !1, S && S(u), a = p.render(p.props, p.state, p.context), H = 0; H < p._sb.length; H++)p.__h.push(p._sb[H]);
            p._sb = [];
        } else do {
            p.__d = !1, S && S(u), a = p.render(p.props, p.state, p.context), p.state = p.__s;
        }while (p.__d && ++A < 25);
        p.state = p.__s, null != p.getChildContext && (i = v(v({}, i), p.getChildContext())), y || null == p.getSnapshotBeforeUpdate || (g = p.getSnapshotBeforeUpdate(d, _)), P(n, h(I = null != a && a.type === k && null == a.key ? a.props.children : a) ? I : [
            I
        ], u, t, i, o, r, f, e, c, s), p.base = u.__e, u.__h = null, p.__h.length && f.push(p), m && (p.__E = p.__ = null);
    } catch (n) {
        u.__v = null, (c || null != r) && (u.__e = e, u.__h = !!c, r[r.indexOf(e)] = null), l.__e(n, u, t);
    }
    else null == r && u.__v === t.__v ? (u.__k = t.__k, u.__e = t.__e) : u.__e = N(t.__e, u, t, i, o, r, f, c, s);
    (a = l.diffed) && a(u);
}
function M(n, u, t) {
    for(var i = 0; i < t.length; i++)O(t[i], t[++i], t[++i]);
    l.__c && l.__c(u, n), n.some(function(u) {
        try {
            n = u.__h, u.__h = [], n.some(function(n) {
                n.call(u);
            });
        } catch (n) {
            l.__e(n, u.__v);
        }
    });
}
function N(l, u, t, i, o, r, f, e, s) {
    var a, v, y, d = t.props, _ = u.props, k = u.type, b = 0;
    if ("svg" === k && (o = !0), null != r) {
        for(; b < r.length; b++)if ((a = r[b]) && "setAttribute" in a == !!k && (k ? a.localName === k : 3 === a.nodeType)) {
            l = a, r[b] = null;
            break;
        }
    }
    if (null == l) {
        if (null === k) return document.createTextNode(_);
        l = o ? document.createElementNS("http://www.w3.org/2000/svg", k) : document.createElement(k, _.is && _), r = null, e = !1;
    }
    if (null === k) d === _ || e && l.data === _ || (l.data = _);
    else {
        if (r = r && n.call(l.childNodes), v = (d = t.props || c).dangerouslySetInnerHTML, y = _.dangerouslySetInnerHTML, !e) {
            if (null != r) for(d = {}, b = 0; b < l.attributes.length; b++)d[l.attributes[b].name] = l.attributes[b].value;
            (y || v) && (y && (v && y.__html == v.__html || y.__html === l.innerHTML) || (l.innerHTML = y && y.__html || ""));
        }
        if (H(l, _, d, o, e), y) u.__k = [];
        else if (P(l, h(b = u.props.children) ? b : [
            b
        ], u, t, i, o && "foreignObject" !== k, r, f, r ? r[0] : t.__k && g(t, 0), e, s), null != r) for(b = r.length; b--;)null != r[b] && p(r[b]);
        e || ("value" in _ && void 0 !== (b = _.value) && (b !== l.value || "progress" === k && !b || "option" === k && b !== d.value) && T(l, "value", b, d.value, !1), "checked" in _ && void 0 !== (b = _.checked) && b !== l.checked && T(l, "checked", b, d.checked, !1));
    }
    return l;
}
function O(n, u, t) {
    try {
        "function" == typeof n ? n(u) : n.current = u;
    } catch (n) {
        l.__e(n, t);
    }
}
function q(n, u, t) {
    var i, o;
    if (l.unmount && l.unmount(n), (i = n.ref) && (i.current && i.current !== n.__e || O(i, null, u)), null != (i = n.__c)) {
        if (i.componentWillUnmount) try {
            i.componentWillUnmount();
        } catch (n) {
            l.__e(n, u);
        }
        i.base = i.__P = null, n.__c = void 0;
    }
    if (i = n.__k) for(o = 0; o < i.length; o++)i[o] && q(i[o], u, t || "function" != typeof n.type);
    t || null == n.__e || p(n.__e), n.__ = n.__e = n.__d = void 0;
}
function B(n, l, u) {
    return this.constructor(n, u);
}
function D(u, t, i) {
    var o, r, f, e;
    l.__ && l.__(u, t), r = (o = "function" == typeof i) ? null : i && i.__k || t.__k, f = [], e = [], L(t, u = (!o && i || t).__k = y(k, null, [
        u
    ]), r || c, c, void 0 !== t.ownerSVGElement, !o && i ? [
        i
    ] : r ? null : t.firstChild ? n.call(t.childNodes) : null, f, !o && i ? i : r ? r.__e : t.firstChild, o, e), M(f, u, e);
}
function E(n, l) {
    D(n, l, E);
}
function F(l, u, t) {
    var i, o, r, f, e = v({}, l.props);
    for(r in l.type && l.type.defaultProps && (f = l.type.defaultProps), u)"key" == r ? i = u[r] : "ref" == r ? o = u[r] : e[r] = void 0 === u[r] && void 0 !== f ? f[r] : u[r];
    return arguments.length > 2 && (e.children = arguments.length > 3 ? n.call(arguments, 2) : t), d(l.type, e, i || l.key, o || l.ref, null);
}
function G(n, l) {
    var u = {
        __c: l = "__cC" + e++,
        __: n,
        Consumer: function(n, l) {
            return n.children(l);
        },
        Provider: function(n) {
            var u, t;
            return this.getChildContext || (u = [], (t = {})[l] = this, this.getChildContext = function() {
                return t;
            }, this.shouldComponentUpdate = function(n) {
                this.props.value !== n.value && u.some(function(n) {
                    n.__e = !0, w(n);
                });
            }, this.sub = function(n) {
                u.push(n);
                var l = n.componentWillUnmount;
                n.componentWillUnmount = function() {
                    u.splice(u.indexOf(n), 1), l && l.call(n);
                };
            }), n.children;
        }
    };
    return u.Provider.__ = u.Consumer.contextType = u;
}
n = s.slice, l = {
    __e: function(n, l, u, t) {
        for(var i, o, r; l = l.__;)if ((i = l.__c) && !i.__) try {
            if ((o = i.constructor) && null != o.getDerivedStateFromError && (i.setState(o.getDerivedStateFromError(n)), r = i.__d), null != i.componentDidCatch && (i.componentDidCatch(n, t || {}), r = i.__d), r) return i.__E = i;
        } catch (l) {
            n = l;
        }
        throw n;
    }
}, u = 0, t = function(n) {
    return null != n && void 0 === n.constructor;
}, b.prototype.setState = function(n, l) {
    var u;
    u = null != this.__s && this.__s !== this.state ? this.__s : this.__s = v({}, this.state), "function" == typeof n && (n = n(v({}, u), this.props)), n && v(u, n), null != n && this.__v && (l && this._sb.push(l), w(this));
}, b.prototype.forceUpdate = function(n) {
    this.__v && (this.__e = !0, n && this.__h.push(n), w(this));
}, b.prototype.render = k, i = [], r = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, f = function(n, l) {
    return n.__v.__b - l.__v.__b;
}, x.__r = 0, e = 0;
 //# sourceMappingURL=preact.module.js.map


/***/ }),

/***/ 2959:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"openid-client","version":"5.4.3","description":"OpenID Connect Relying Party (RP, Client) implementation for Node.js runtime, supports passportjs","keywords":["auth","authentication","basic","certified","client","connect","dynamic","electron","hybrid","identity","implicit","oauth","oauth2","oidc","openid","passport","relying party","strategy"],"homepage":"https://github.com/panva/node-openid-client","repository":"panva/node-openid-client","funding":{"url":"https://github.com/sponsors/panva"},"license":"MIT","author":"Filip Skokan <panva.ip@gmail.com>","exports":{"types":"./types/index.d.ts","import":"./lib/index.mjs","require":"./lib/index.js"},"main":"./lib/index.js","types":"./types/index.d.ts","files":["lib","types/index.d.ts"],"scripts":{"format":"npx prettier --loglevel silent --write ./lib ./test ./certification ./types","test":"mocha test/**/*.test.js"},"dependencies":{"jose":"^4.14.4","lru-cache":"^6.0.0","object-hash":"^2.2.0","oidc-token-hash":"^5.0.3"},"devDependencies":{"@types/node":"^16.18.31","@types/passport":"^1.0.12","base64url":"^3.0.1","chai":"^4.3.7","jose2":"npm:jose@^2.0.6","mocha":"^10.2.0","nock":"^13.3.1","prettier":"^2.8.8","readable-mock-req":"^0.2.2","sinon":"^9.2.4","timekeeper":"^2.2.0"},"standard-version":{"scripts":{"postchangelog":"sed -i \'\' -e \'s/### \\\\[/## [/g\' CHANGELOG.md"},"types":[{"type":"feat","section":"Features"},{"type":"fix","section":"Fixes"},{"type":"chore","hidden":true},{"type":"docs","hidden":true},{"type":"style","hidden":true},{"type":"refactor","section":"Refactor","hidden":false},{"type":"perf","section":"Performance","hidden":false},{"type":"test","hidden":true}]}}');

/***/ })

};
;