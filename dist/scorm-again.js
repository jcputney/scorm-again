(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = debounce;

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Scorm12API2 = _interopRequireDefault(require("./Scorm12API"));

var _aicc_cmi = require("./cmi/aicc_cmi");

var _scorm12_cmi = require("./cmi/scorm12_cmi");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * The AICC API class
 */
var AICC = /*#__PURE__*/function (_Scorm12API) {
  _inherits(AICC, _Scorm12API);

  var _super = _createSuper(AICC);

  /**
   * Constructor to create AICC API object
   * @param {object} settings
   */
  function AICC(settings) {
    var _this;

    _classCallCheck(this, AICC);

    var finalSettings = _objectSpread(_objectSpread({}, {
      mastery_override: false
    }), settings);

    _this = _super.call(this, finalSettings);
    _this.cmi = new _aicc_cmi.CMI();
    _this.nav = new _scorm12_cmi.NAV();
    return _this;
  }
  /**
   * Gets or builds a new child element to add to the array.
   *
   * @param {string} CMIElement
   * @param {any} value
   * @param {boolean} foundFirstIndex
   * @return {object}
   */


  _createClass(AICC, [{
    key: "getChildElement",
    value: function getChildElement(CMIElement, value, foundFirstIndex) {
      var newChild = _get(_getPrototypeOf(AICC.prototype), "getChildElement", this).call(this, CMIElement, value, foundFirstIndex);

      if (!newChild) {
        if (this.stringMatches(CMIElement, 'cmi\\.evaluation\\.comments\\.\\d+')) {
          newChild = new _aicc_cmi.CMIEvaluationCommentsObject();
        } else if (this.stringMatches(CMIElement, 'cmi\\.student_data\\.tries\\.\\d+')) {
          newChild = new _aicc_cmi.CMITriesObject();
        } else if (this.stringMatches(CMIElement, 'cmi\\.student_data\\.attempt_records\\.\\d+')) {
          newChild = new _aicc_cmi.CMIAttemptRecordsObject();
        }
      }

      return newChild;
    }
    /**
     * Replace the whole API with another
     *
     * @param {AICC} newAPI
     */

  }, {
    key: "replaceWithAnotherScormAPI",
    value: function replaceWithAnotherScormAPI(newAPI) {
      // Data Model
      this.cmi = newAPI.cmi;
      this.nav = newAPI.nav;
    }
  }]);

  return AICC;
}(_Scorm12API2["default"]);

exports["default"] = AICC;

},{"./Scorm12API":4,"./cmi/aicc_cmi":6,"./cmi/scorm12_cmi":8}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _common = require("./cmi/common");

var _exceptions = require("./exceptions");

var _error_codes2 = _interopRequireDefault(require("./constants/error_codes"));

var _api_constants = _interopRequireDefault(require("./constants/api_constants"));

var _utilities = require("./utilities");

var _lodash = _interopRequireDefault(require("lodash.debounce"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

var global_constants = _api_constants["default"].global;
var scorm12_error_codes = _error_codes2["default"].scorm12;
/**
 * Base API class for AICC, SCORM 1.2, and SCORM 2004. Should be considered
 * abstract, and never initialized on it's own.
 */

var _timeout = /*#__PURE__*/new WeakMap();

var _error_codes = /*#__PURE__*/new WeakMap();

var _settings = /*#__PURE__*/new WeakMap();

var BaseAPI = /*#__PURE__*/function () {
  /**
   * Constructor for Base API class. Sets some shared API fields, as well as
   * sets up options for the API.
   * @param {object} error_codes
   * @param {object} settings
   */
  function BaseAPI(error_codes, settings) {
    _classCallCheck(this, BaseAPI);

    _timeout.set(this, {
      writable: true,
      value: void 0
    });

    _error_codes.set(this, {
      writable: true,
      value: void 0
    });

    _settings.set(this, {
      writable: true,
      value: {
        autocommit: false,
        autocommitSeconds: 10,
        asyncCommit: false,
        sendBeaconCommit: false,
        lmsCommitUrl: false,
        dataCommitFormat: 'json',
        // valid formats are 'json' or 'flattened', 'params'
        commitRequestDataType: 'application/json;charset=UTF-8',
        autoProgress: false,
        logLevel: global_constants.LOG_LEVEL_ERROR,
        selfReportSessionTime: false,
        alwaysSendTotalTime: false,
        strict_errors: true,
        responseHandler: function responseHandler(xhr) {
          var result;

          if (typeof xhr !== 'undefined') {
            result = JSON.parse(xhr.responseText);

            if (result === null || !{}.hasOwnProperty.call(result, 'result')) {
              result = {};

              if (xhr.status === 200) {
                result.result = global_constants.SCORM_TRUE;
                result.errorCode = 0;
              } else {
                result.result = global_constants.SCORM_FALSE;
                result.errorCode = 101;
              }
            }
          }

          return result;
        }
      }
    });

    _defineProperty(this, "cmi", void 0);

    _defineProperty(this, "startingData", void 0);

    if ((this instanceof BaseAPI ? this.constructor : void 0) === BaseAPI) {
      throw new TypeError('Cannot construct BaseAPI instances directly');
    }

    this.currentState = global_constants.STATE_NOT_INITIALIZED;
    this.lastErrorCode = 0;
    this.listenerArray = [];

    _classPrivateFieldSet(this, _timeout, null);

    _classPrivateFieldSet(this, _error_codes, error_codes);

    this.settings = settings;
    this.apiLogLevel = this.settings.logLevel;
    this.selfReportSessionTime = this.settings.selfReportSessionTime;
  }
  /**
   * Initialize the API
   * @param {string} callbackName
   * @param {string} initializeMessage
   * @param {string} terminationMessage
   * @return {string}
   */


  _createClass(BaseAPI, [{
    key: "initialize",
    value: function initialize(callbackName, initializeMessage, terminationMessage) {
      var returnValue = global_constants.SCORM_FALSE;

      if (this.isInitialized()) {
        this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).INITIALIZED, initializeMessage);
      } else if (this.isTerminated()) {
        this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).TERMINATED, terminationMessage);
      } else {
        if (this.selfReportSessionTime) {
          this.cmi.setStartTime();
        }

        this.currentState = global_constants.STATE_INITIALIZED;
        this.lastErrorCode = 0;
        returnValue = global_constants.SCORM_TRUE;
        this.processListeners(callbackName);
      }

      this.apiLog(callbackName, null, 'returned: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      this.clearSCORMError(returnValue);
      return returnValue;
    }
    /**
     * Getter for #error_codes
     * @return {object}
     */

  }, {
    key: "error_codes",
    get: function get() {
      return _classPrivateFieldGet(this, _error_codes);
    }
    /**
     * Getter for #settings
     * @return {object}
     */

  }, {
    key: "settings",
    get: function get() {
      return _classPrivateFieldGet(this, _settings);
    }
    /**
     * Setter for #settings
     * @param {object} settings
     */
    ,
    set: function set(settings) {
      _classPrivateFieldSet(this, _settings, _objectSpread(_objectSpread({}, _classPrivateFieldGet(this, _settings)), settings));
    }
    /**
     * Terminates the current run of the API
     * @param {string} callbackName
     * @param {boolean} checkTerminated
     * @return {string}
     */

  }, {
    key: "terminate",
    value: function terminate(callbackName, checkTerminated) {
      var returnValue = global_constants.SCORM_FALSE;

      if (this.checkState(checkTerminated, _classPrivateFieldGet(this, _error_codes).TERMINATION_BEFORE_INIT, _classPrivateFieldGet(this, _error_codes).MULTIPLE_TERMINATION)) {
        this.currentState = global_constants.STATE_TERMINATED;
        var result = this.storeData(true);

        if (!this.settings.sendBeaconCommit && !this.settings.asyncCommit && typeof result.errorCode !== 'undefined' && result.errorCode > 0) {
          this.throwSCORMError(result.errorCode);
        }

        returnValue = typeof result !== 'undefined' && result.result ? result.result : global_constants.SCORM_FALSE;
        if (checkTerminated) this.lastErrorCode = 0;
        returnValue = global_constants.SCORM_TRUE;
        this.processListeners(callbackName);
      }

      this.apiLog(callbackName, null, 'returned: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      this.clearSCORMError(returnValue);
      return returnValue;
    }
    /**
     * Get the value of the CMIElement.
     *
     * @param {string} callbackName
     * @param {boolean} checkTerminated
     * @param {string} CMIElement
     * @return {string}
     */

  }, {
    key: "getValue",
    value: function getValue(callbackName, checkTerminated, CMIElement) {
      var returnValue;

      if (this.checkState(checkTerminated, _classPrivateFieldGet(this, _error_codes).RETRIEVE_BEFORE_INIT, _classPrivateFieldGet(this, _error_codes).RETRIEVE_AFTER_TERM)) {
        if (checkTerminated) this.lastErrorCode = 0;

        try {
          returnValue = this.getCMIValue(CMIElement);
        } catch (e) {
          if (e instanceof _exceptions.ValidationError) {
            this.lastErrorCode = e.errorCode;
            returnValue = global_constants.SCORM_FALSE;
          } else {
            if (e.message) {
              console.error(e.message);
            } else {
              console.error(e);
            }

            this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).GENERAL);
          }
        }

        this.processListeners(callbackName, CMIElement);
      }

      this.apiLog(callbackName, CMIElement, ': returned: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      this.clearSCORMError(returnValue);
      return returnValue;
    }
    /**
     * Sets the value of the CMIElement.
     *
     * @param {string} callbackName
     * @param {string} commitCallback
     * @param {boolean} checkTerminated
     * @param {string} CMIElement
     * @param {*} value
     * @return {string}
     */

  }, {
    key: "setValue",
    value: function setValue(callbackName, commitCallback, checkTerminated, CMIElement, value) {
      if (value !== undefined) {
        value = String(value);
      }

      var returnValue = global_constants.SCORM_FALSE;

      if (this.checkState(checkTerminated, _classPrivateFieldGet(this, _error_codes).STORE_BEFORE_INIT, _classPrivateFieldGet(this, _error_codes).STORE_AFTER_TERM)) {
        if (checkTerminated) this.lastErrorCode = 0;

        try {
          returnValue = this.setCMIValue(CMIElement, value);
        } catch (e) {
          if (e instanceof _exceptions.ValidationError) {
            this.lastErrorCode = e.errorCode;
            returnValue = global_constants.SCORM_FALSE;
          } else {
            if (e.message) {
              console.error(e.message);
            } else {
              console.error(e);
            }

            this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).GENERAL);
          }
        }

        this.processListeners(callbackName, CMIElement, value);
      }

      if (returnValue === undefined) {
        returnValue = global_constants.SCORM_FALSE;
      } // If we didn't have any errors while setting the data, go ahead and
      // schedule a commit, if autocommit is turned on


      if (String(this.lastErrorCode) === '0') {
        if (this.settings.autocommit && !_classPrivateFieldGet(this, _timeout)) {
          this.scheduleCommit(this.settings.autocommitSeconds * 1000, commitCallback);
        }
      }

      this.apiLog(callbackName, CMIElement, ': ' + value + ': result: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      this.clearSCORMError(returnValue);
      return returnValue;
    }
    /**
     * Orders LMS to store all content parameters
     * @param {string} callbackName
     * @param {boolean} checkTerminated
     * @return {string}
     */

  }, {
    key: "commit",
    value: function commit(callbackName, checkTerminated) {
      this.clearScheduledCommit();
      var returnValue = global_constants.SCORM_FALSE;

      if (this.checkState(checkTerminated, _classPrivateFieldGet(this, _error_codes).COMMIT_BEFORE_INIT, _classPrivateFieldGet(this, _error_codes).COMMIT_AFTER_TERM)) {
        var result = this.storeData(false);

        if (!this.settings.sendBeaconCommit && !this.settings.asyncCommit && result.errorCode && result.errorCode > 0) {
          this.throwSCORMError(result.errorCode);
        }

        returnValue = typeof result !== 'undefined' && result.result ? result.result : global_constants.SCORM_FALSE;
        this.apiLog(callbackName, 'HttpRequest', ' Result: ' + returnValue, global_constants.LOG_LEVEL_DEBUG);
        if (checkTerminated) this.lastErrorCode = 0;
        this.processListeners(callbackName);
      }

      this.apiLog(callbackName, null, 'returned: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      this.clearSCORMError(returnValue);
      return returnValue;
    }
    /**
     * Returns last error code
     * @param {string} callbackName
     * @return {string}
     */

  }, {
    key: "getLastError",
    value: function getLastError(callbackName) {
      var returnValue = String(this.lastErrorCode);
      this.processListeners(callbackName);
      this.apiLog(callbackName, null, 'returned: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      return returnValue;
    }
    /**
     * Returns the errorNumber error description
     *
     * @param {string} callbackName
     * @param {(string|number)} CMIErrorCode
     * @return {string}
     */

  }, {
    key: "getErrorString",
    value: function getErrorString(callbackName, CMIErrorCode) {
      var returnValue = '';

      if (CMIErrorCode !== null && CMIErrorCode !== '') {
        returnValue = this.getLmsErrorMessageDetails(CMIErrorCode);
        this.processListeners(callbackName);
      }

      this.apiLog(callbackName, null, 'returned: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      return returnValue;
    }
    /**
     * Returns a comprehensive description of the errorNumber error.
     *
     * @param {string} callbackName
     * @param {(string|number)} CMIErrorCode
     * @return {string}
     */

  }, {
    key: "getDiagnostic",
    value: function getDiagnostic(callbackName, CMIErrorCode) {
      var returnValue = '';

      if (CMIErrorCode !== null && CMIErrorCode !== '') {
        returnValue = this.getLmsErrorMessageDetails(CMIErrorCode, true);
        this.processListeners(callbackName);
      }

      this.apiLog(callbackName, null, 'returned: ' + returnValue, global_constants.LOG_LEVEL_INFO);
      return returnValue;
    }
    /**
     * Checks the LMS state and ensures it has been initialized.
     *
     * @param {boolean} checkTerminated
     * @param {number} beforeInitError
     * @param {number} afterTermError
     * @return {boolean}
     */

  }, {
    key: "checkState",
    value: function checkState(checkTerminated, beforeInitError, afterTermError) {
      if (this.isNotInitialized()) {
        this.throwSCORMError(beforeInitError);
        return false;
      } else if (checkTerminated && this.isTerminated()) {
        this.throwSCORMError(afterTermError);
        return false;
      }

      return true;
    }
    /**
     * Logging for all SCORM actions
     *
     * @param {string} functionName
     * @param {string} CMIElement
     * @param {string} logMessage
     * @param {number}messageLevel
     */

  }, {
    key: "apiLog",
    value: function apiLog(functionName, CMIElement, logMessage, messageLevel) {
      logMessage = this.formatMessage(functionName, CMIElement, logMessage);

      if (messageLevel >= this.apiLogLevel) {
        switch (messageLevel) {
          case global_constants.LOG_LEVEL_ERROR:
            console.error(logMessage);
            break;

          case global_constants.LOG_LEVEL_WARNING:
            console.warn(logMessage);
            break;

          case global_constants.LOG_LEVEL_INFO:
            console.info(logMessage);
            break;

          case global_constants.LOG_LEVEL_DEBUG:
            if (console.debug) {
              console.debug(logMessage);
            } else {
              console.log(logMessage);
            }

            break;
        }
      }
    }
    /**
     * Formats the SCORM messages for easy reading
     *
     * @param {string} functionName
     * @param {string} CMIElement
     * @param {string} message
     * @return {string}
     */

  }, {
    key: "formatMessage",
    value: function formatMessage(functionName, CMIElement, message) {
      var baseLength = 20;
      var messageString = '';
      messageString += functionName;
      var fillChars = baseLength - messageString.length;

      for (var i = 0; i < fillChars; i++) {
        messageString += ' ';
      }

      messageString += ': ';

      if (CMIElement) {
        var CMIElementBaseLength = 70;
        messageString += CMIElement;
        fillChars = CMIElementBaseLength - messageString.length;

        for (var j = 0; j < fillChars; j++) {
          messageString += ' ';
        }
      }

      if (message) {
        messageString += message;
      }

      return messageString;
    }
    /**
     * Checks to see if {str} contains {tester}
     *
     * @param {string} str String to check against
     * @param {string} tester String to check for
     * @return {boolean}
     */

  }, {
    key: "stringMatches",
    value: function stringMatches(str, tester) {
      return str && tester && str.match(tester);
    }
    /**
     * Check to see if the specific object has the given property
     * @param {*} refObject
     * @param {string} attribute
     * @return {boolean}
     * @private
     */

  }, {
    key: "_checkObjectHasProperty",
    value: function _checkObjectHasProperty(refObject, attribute) {
      return Object.hasOwnProperty.call(refObject, attribute) || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(refObject), attribute) || attribute in refObject;
    }
    /**
     * Returns the message that corresponds to errorNumber
     * APIs that inherit BaseAPI should override this function
     *
     * @param {(string|number)} _errorNumber
     * @param {boolean} _detail
     * @return {string}
     * @abstract
     */

  }, {
    key: "getLmsErrorMessageDetails",
    value: function getLmsErrorMessageDetails(_errorNumber, _detail) {
      throw new Error('The getLmsErrorMessageDetails method has not been implemented');
    }
    /**
     * Gets the value for the specific element.
     * APIs that inherit BaseAPI should override this function
     *
     * @param {string} _CMIElement
     * @return {string}
     * @abstract
     */

  }, {
    key: "getCMIValue",
    value: function getCMIValue(_CMIElement) {
      throw new Error('The getCMIValue method has not been implemented');
    }
    /**
     * Sets the value for the specific element.
     * APIs that inherit BaseAPI should override this function
     *
     * @param {string} _CMIElement
     * @param {any} _value
     * @return {string}
     * @abstract
     */

  }, {
    key: "setCMIValue",
    value: function setCMIValue(_CMIElement, _value) {
      throw new Error('The setCMIValue method has not been implemented');
    }
    /**
     * Shared API method to set a valid for a given element.
     *
     * @param {string} methodName
     * @param {boolean} scorm2004
     * @param {string} CMIElement
     * @param {*} value
     * @return {string}
     */

  }, {
    key: "_commonSetCMIValue",
    value: function _commonSetCMIValue(methodName, scorm2004, CMIElement, value) {
      if (!CMIElement || CMIElement === '') {
        return global_constants.SCORM_FALSE;
      }

      var structure = CMIElement.split('.');
      var refObject = this;
      var returnValue = global_constants.SCORM_FALSE;
      var foundFirstIndex = false;
      var invalidErrorMessage = "The data model element passed to ".concat(methodName, " (").concat(CMIElement, ") is not a valid SCORM data model element.");
      var invalidErrorCode = scorm2004 ? _classPrivateFieldGet(this, _error_codes).UNDEFINED_DATA_MODEL : _classPrivateFieldGet(this, _error_codes).GENERAL;

      for (var i = 0; i < structure.length; i++) {
        var attribute = structure[i];

        if (i === structure.length - 1) {
          if (scorm2004 && attribute.substr(0, 8) === '{target=' && typeof refObject._isTargetValid == 'function') {
            this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).READ_ONLY_ELEMENT);
          } else if (!this._checkObjectHasProperty(refObject, attribute)) {
            this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
          } else {
            if (this.isInitialized() && this.stringMatches(CMIElement, '\\.correct_responses\\.\\d+')) {
              this.validateCorrectResponse(CMIElement, value);
            }

            if (!scorm2004 || this.lastErrorCode === 0) {
              refObject[attribute] = value;
              returnValue = global_constants.SCORM_TRUE;
            }
          }
        } else {
          refObject = refObject[attribute];

          if (!refObject) {
            this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
            break;
          }

          if (refObject instanceof _common.CMIArray) {
            var index = parseInt(structure[i + 1], 10); // SCO is trying to set an item on an array

            if (!isNaN(index)) {
              var item = refObject.childArray[index];

              if (item) {
                refObject = item;
                foundFirstIndex = true;
              } else {
                var newChild = this.getChildElement(CMIElement, value, foundFirstIndex);
                foundFirstIndex = true;

                if (!newChild) {
                  this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
                } else {
                  if (refObject.initialized) newChild.initialize();
                  refObject.childArray.push(newChild);
                  refObject = newChild;
                }
              } // Have to update i value to skip the array position


              i++;
            }
          }
        }
      }

      if (returnValue === global_constants.SCORM_FALSE) {
        this.apiLog(methodName, null, "There was an error setting the value for: ".concat(CMIElement, ", value of: ").concat(value), global_constants.LOG_LEVEL_WARNING);
      }

      return returnValue;
    }
    /**
     * Abstract method for validating that a response is correct.
     *
     * @param {string} _CMIElement
     * @param {*} _value
     */

  }, {
    key: "validateCorrectResponse",
    value: function validateCorrectResponse(_CMIElement, _value) {// just a stub method
    }
    /**
     * Gets or builds a new child element to add to the array.
     * APIs that inherit BaseAPI should override this method.
     *
     * @param {string} _CMIElement - unused
     * @param {*} _value - unused
     * @param {boolean} _foundFirstIndex - unused
     * @return {*}
     * @abstract
     */

  }, {
    key: "getChildElement",
    value: function getChildElement(_CMIElement, _value, _foundFirstIndex) {
      throw new Error('The getChildElement method has not been implemented');
    }
    /**
     * Gets a value from the CMI Object
     *
     * @param {string} methodName
     * @param {boolean} scorm2004
     * @param {string} CMIElement
     * @return {*}
     */

  }, {
    key: "_commonGetCMIValue",
    value: function _commonGetCMIValue(methodName, scorm2004, CMIElement) {
      if (!CMIElement || CMIElement === '') {
        return '';
      }

      var structure = CMIElement.split('.');
      var refObject = this;
      var attribute = null;
      var uninitializedErrorMessage = "The data model element passed to ".concat(methodName, " (").concat(CMIElement, ") has not been initialized.");
      var invalidErrorMessage = "The data model element passed to ".concat(methodName, " (").concat(CMIElement, ") is not a valid SCORM data model element.");
      var invalidErrorCode = scorm2004 ? _classPrivateFieldGet(this, _error_codes).UNDEFINED_DATA_MODEL : _classPrivateFieldGet(this, _error_codes).GENERAL;

      for (var i = 0; i < structure.length; i++) {
        attribute = structure[i];

        if (!scorm2004) {
          if (i === structure.length - 1) {
            if (!this._checkObjectHasProperty(refObject, attribute)) {
              this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
              return;
            }
          }
        } else {
          if (String(attribute).substr(0, 8) === '{target=' && typeof refObject._isTargetValid == 'function') {
            var target = String(attribute).substr(8, String(attribute).length - 9);
            return refObject._isTargetValid(target);
          } else if (!this._checkObjectHasProperty(refObject, attribute)) {
            this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
            return;
          }
        }

        refObject = refObject[attribute];

        if (refObject === undefined) {
          this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
          break;
        }

        if (refObject instanceof _common.CMIArray) {
          var index = parseInt(structure[i + 1], 10); // SCO is trying to set an item on an array

          if (!isNaN(index)) {
            var item = refObject.childArray[index];

            if (item) {
              refObject = item;
            } else {
              this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).VALUE_NOT_INITIALIZED, uninitializedErrorMessage);
              break;
            } // Have to update i value to skip the array position


            i++;
          }
        }
      }

      if (refObject === null || refObject === undefined) {
        if (!scorm2004) {
          if (attribute === '_children') {
            this.throwSCORMError(scorm12_error_codes.CHILDREN_ERROR);
          } else if (attribute === '_count') {
            this.throwSCORMError(scorm12_error_codes.COUNT_ERROR);
          }
        }
      } else {
        return refObject;
      }
    }
    /**
     * Returns true if the API's current state is STATE_INITIALIZED
     *
     * @return {boolean}
     */

  }, {
    key: "isInitialized",
    value: function isInitialized() {
      return this.currentState === global_constants.STATE_INITIALIZED;
    }
    /**
     * Returns true if the API's current state is STATE_NOT_INITIALIZED
     *
     * @return {boolean}
     */

  }, {
    key: "isNotInitialized",
    value: function isNotInitialized() {
      return this.currentState === global_constants.STATE_NOT_INITIALIZED;
    }
    /**
     * Returns true if the API's current state is STATE_TERMINATED
     *
     * @return {boolean}
     */

  }, {
    key: "isTerminated",
    value: function isTerminated() {
      return this.currentState === global_constants.STATE_TERMINATED;
    }
    /**
     * Provides a mechanism for attaching to a specific SCORM event
     *
     * @param {string} listenerName
     * @param {function} callback
     */

  }, {
    key: "on",
    value: function on(listenerName, callback) {
      if (!callback) return;
      var listenerFunctions = listenerName.split(' ');

      for (var i = 0; i < listenerFunctions.length; i++) {
        var listenerSplit = listenerFunctions[i].split('.');
        if (listenerSplit.length === 0) return;
        var functionName = listenerSplit[0];
        var CMIElement = null;

        if (listenerSplit.length > 1) {
          CMIElement = listenerName.replace(functionName + '.', '');
        }

        this.listenerArray.push({
          functionName: functionName,
          CMIElement: CMIElement,
          callback: callback
        });
        this.apiLog('on', functionName, "Added event listener: ".concat(this.listenerArray.length), global_constants.LOG_LEVEL_INFO);
      }
    }
    /**
     * Provides a mechanism for detaching a specific SCORM event listener
     *
     * @param {string} listenerName
     * @param {function} callback
     */

  }, {
    key: "off",
    value: function off(listenerName, callback) {
      var _this = this;

      if (!callback) return;
      var listenerFunctions = listenerName.split(' ');

      var _loop = function _loop(i) {
        var listenerSplit = listenerFunctions[i].split('.');
        if (listenerSplit.length === 0) return {
          v: void 0
        };
        var functionName = listenerSplit[0];
        var CMIElement = null;

        if (listenerSplit.length > 1) {
          CMIElement = listenerName.replace(functionName + '.', '');
        }

        var removeIndex = _this.listenerArray.findIndex(function (obj) {
          return obj.functionName === functionName && obj.CMIElement === CMIElement && obj.callback === callback;
        });

        if (removeIndex !== -1) {
          _this.listenerArray.splice(removeIndex, 1);

          _this.apiLog('off', functionName, "Removed event listener: ".concat(_this.listenerArray.length), global_constants.LOG_LEVEL_INFO);
        }
      };

      for (var i = 0; i < listenerFunctions.length; i++) {
        var _ret = _loop(i);

        if (_typeof(_ret) === "object") return _ret.v;
      }
    }
    /**
     * Provides a mechanism for clearing all listeners from a specific SCORM event
     *
     * @param {string} listenerName
     */

  }, {
    key: "clear",
    value: function clear(listenerName) {
      var _this2 = this;

      var listenerFunctions = listenerName.split(' ');

      var _loop2 = function _loop2(i) {
        var listenerSplit = listenerFunctions[i].split('.');
        if (listenerSplit.length === 0) return {
          v: void 0
        };
        var functionName = listenerSplit[0];
        var CMIElement = null;

        if (listenerSplit.length > 1) {
          CMIElement = listenerName.replace(functionName + '.', '');
        }

        _this2.listenerArray = _this2.listenerArray.filter(function (obj) {
          return obj.functionName !== functionName && obj.CMIElement !== CMIElement;
        });
      };

      for (var i = 0; i < listenerFunctions.length; i++) {
        var _ret2 = _loop2(i);

        if (_typeof(_ret2) === "object") return _ret2.v;
      }
    }
    /**
     * Processes any 'on' listeners that have been created
     *
     * @param {string} functionName
     * @param {string} CMIElement
     * @param {*} value
     */

  }, {
    key: "processListeners",
    value: function processListeners(functionName, CMIElement, value) {
      this.apiLog(functionName, CMIElement, value);

      for (var i = 0; i < this.listenerArray.length; i++) {
        var listener = this.listenerArray[i];
        var functionsMatch = listener.functionName === functionName;
        var listenerHasCMIElement = !!listener.CMIElement;
        var CMIElementsMatch = false;

        if (CMIElement && listener.CMIElement && listener.CMIElement.substring(listener.CMIElement.length - 1) === '*') {
          CMIElementsMatch = CMIElement.indexOf(listener.CMIElement.substring(0, listener.CMIElement.length - 1)) === 0;
        } else {
          CMIElementsMatch = listener.CMIElement === CMIElement;
        }

        if (functionsMatch && (!listenerHasCMIElement || CMIElementsMatch)) {
          listener.callback(CMIElement, value);
        }
      }
    }
    /**
     * Throws a SCORM error
     *
     * @param {number} errorNumber
     * @param {string} message
     */

  }, {
    key: "throwSCORMError",
    value: function throwSCORMError(errorNumber, message) {
      if (!message) {
        message = this.getLmsErrorMessageDetails(errorNumber);
      }

      this.apiLog('throwSCORMError', null, errorNumber + ': ' + message, global_constants.LOG_LEVEL_ERROR);
      this.lastErrorCode = String(errorNumber);
    }
    /**
     * Clears the last SCORM error code on success.
     *
     * @param {string} success
     */

  }, {
    key: "clearSCORMError",
    value: function clearSCORMError(success) {
      if (success !== undefined && success !== global_constants.SCORM_FALSE) {
        this.lastErrorCode = 0;
      }
    }
    /**
     * Attempts to store the data to the LMS, logs data if no LMS configured
     * APIs that inherit BaseAPI should override this function
     *
     * @param {boolean} _calculateTotalTime
     * @return {string}
     * @abstract
     */

  }, {
    key: "storeData",
    value: function storeData(_calculateTotalTime) {
      throw new Error('The storeData method has not been implemented');
    }
    /**
     * Load the CMI from a flattened JSON object
     * @param {object} json
     * @param {string} CMIElement
     */

  }, {
    key: "loadFromFlattenedJSON",
    value: function loadFromFlattenedJSON(json, CMIElement) {
      var _this3 = this;

      if (!this.isNotInitialized()) {
        console.error('loadFromFlattenedJSON can only be called before the call to lmsInitialize.');
        return;
      }
      /**
       * Test match pattern.
       *
       * @param {string} a
       * @param {string} c
       * @param {RegExp} a_pattern
       * @return {number}
       */


      function testPattern(a, c, a_pattern) {
        var a_match = a.match(a_pattern);
        var c_match;

        if (a_match !== null && (c_match = c.match(a_pattern)) !== null) {
          var a_num = Number(a_match[2]);
          var c_num = Number(c_match[2]);

          if (a_num === c_num) {
            if (a_match[3] === 'id') {
              return -1;
            } else if (a_match[3] === 'type') {
              if (c_match[3] === 'id') {
                return 1;
              } else {
                return -1;
              }
            } else {
              return 1;
            }
          }

          return a_num - c_num;
        }

        return null;
      }

      var int_pattern = /^(cmi\.interactions\.)(\d+)\.(.*)$/;
      var obj_pattern = /^(cmi\.objectives\.)(\d+)\.(.*)$/;
      var result = Object.keys(json).map(function (key) {
        return [String(key), json[key]];
      }); // CMI interactions need to have id and type loaded before any other fields

      result.sort(function (_ref, _ref2) {
        var _ref3 = _slicedToArray(_ref, 2),
            a = _ref3[0],
            b = _ref3[1];

        var _ref4 = _slicedToArray(_ref2, 2),
            c = _ref4[0],
            d = _ref4[1];

        var test;

        if ((test = testPattern(a, c, int_pattern)) !== null) {
          return test;
        }

        if ((test = testPattern(a, c, obj_pattern)) !== null) {
          return test;
        }

        if (a < c) {
          return -1;
        }

        if (a > c) {
          return 1;
        }

        return 0;
      });
      var obj;
      result.forEach(function (element) {
        obj = {};
        obj[element[0]] = element[1];

        _this3.loadFromJSON((0, _utilities.unflatten)(obj), CMIElement);
      });
    }
    /**
     * Loads CMI data from a JSON object.
     *
     * @param {object} json
     * @param {string} CMIElement
     */

  }, {
    key: "loadFromJSON",
    value: function loadFromJSON(json, CMIElement) {
      if (!this.isNotInitialized()) {
        console.error('loadFromJSON can only be called before the call to lmsInitialize.');
        return;
      }

      CMIElement = CMIElement !== undefined ? CMIElement : 'cmi';
      this.startingData = json; // could this be refactored down to flatten(json) then setCMIValue on each?

      for (var key in json) {
        if ({}.hasOwnProperty.call(json, key) && json[key]) {
          var currentCMIElement = (CMIElement ? CMIElement + '.' : '') + key;
          var value = json[key];

          if (value['childArray']) {
            for (var i = 0; i < value['childArray'].length; i++) {
              this.loadFromJSON(value['childArray'][i], currentCMIElement + '.' + i);
            }
          } else if (value.constructor === Object) {
            this.loadFromJSON(value, currentCMIElement);
          } else {
            this.setCMIValue(currentCMIElement, value);
          }
        }
      }
    }
    /**
     * Render the CMI object to JSON for sending to an LMS.
     *
     * @return {string}
     */

  }, {
    key: "renderCMIToJSONString",
    value: function renderCMIToJSONString() {
      var cmi = this.cmi; // Do we want/need to return fields that have no set value?
      // return JSON.stringify({ cmi }, (k, v) => v === undefined ? null : v, 2);

      return JSON.stringify({
        cmi: cmi
      });
    }
    /**
     * Returns a JS object representing the current cmi
     * @return {object}
     */

  }, {
    key: "renderCMIToJSONObject",
    value: function renderCMIToJSONObject() {
      // Do we want/need to return fields that have no set value?
      // return JSON.stringify({ cmi }, (k, v) => v === undefined ? null : v, 2);
      return JSON.parse(this.renderCMIToJSONString());
    }
    /**
     * Render the cmi object to the proper format for LMS commit
     * APIs that inherit BaseAPI should override this function
     *
     * @param {boolean} _terminateCommit
     * @return {*}
     * @abstract
     */

  }, {
    key: "renderCommitCMI",
    value: function renderCommitCMI(_terminateCommit) {
      throw new Error('The storeData method has not been implemented');
    }
    /**
     * Send the request to the LMS
     * @param {string} url
     * @param {object|Array} params
     * @param {boolean} immediate
     * @return {object}
     */

  }, {
    key: "processHttpRequest",
    value: function processHttpRequest(url, params) {
      var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var api = this;

      var process = function process(url, params, settings, error_codes) {
        var genericError = {
          'result': global_constants.SCORM_FALSE,
          'errorCode': error_codes.GENERAL
        };
        var result;

        if (!settings.sendBeaconCommit) {
          var httpReq = new XMLHttpRequest();
          httpReq.open('POST', url, settings.asyncCommit);

          if (settings.asyncCommit) {
            httpReq.onload = function (e) {
              if (typeof settings.responseHandler === 'function') {
                result = settings.responseHandler(httpReq);
              } else {
                result = JSON.parse(httpReq.responseText);
              }
            };
          }

          try {
            if (params instanceof Array) {
              httpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
              httpReq.send(params.join('&'));
            } else {
              httpReq.setRequestHeader('Content-Type', settings.commitRequestDataType);
              httpReq.send(JSON.stringify(params));
            }

            if (!settings.asyncCommit) {
              if (typeof settings.responseHandler === 'function') {
                result = settings.responseHandler(httpReq);
              } else {
                result = JSON.parse(httpReq.responseText);
              }
            } else {
              result = {};
              result.result = global_constants.SCORM_TRUE;
              result.errorCode = 0;
              api.processListeners('CommitSuccess');
              return result;
            }
          } catch (e) {
            console.error(e);
            api.processListeners('CommitError');
            return genericError;
          }
        } else {
          try {
            var headers = {
              type: settings.commitRequestDataType
            };
            var blob;

            if (params instanceof Array) {
              blob = new Blob([params.join('&')], headers);
            } else {
              blob = new Blob([JSON.stringify(params)], headers);
            }

            result = {};

            if (navigator.sendBeacon(url, blob)) {
              result.result = global_constants.SCORM_TRUE;
              result.errorCode = 0;
            } else {
              result.result = global_constants.SCORM_FALSE;
              result.errorCode = 101;
            }
          } catch (e) {
            console.error(e);
            api.processListeners('CommitError');
            return genericError;
          }
        }

        if (typeof result === 'undefined') {
          api.processListeners('CommitError');
          return genericError;
        }

        if (result.result === true || result.result === global_constants.SCORM_TRUE) {
          api.processListeners('CommitSuccess');
        } else {
          api.processListeners('CommitError');
        }

        return result;
      };

      if (typeof _lodash["default"] !== 'undefined') {
        var debounced = (0, _lodash["default"])(process, 500);
        debounced(url, params, this.settings, this.error_codes); // if we're terminating, go ahead and commit immediately

        if (immediate) {
          debounced.flush();
        }

        return {
          result: global_constants.SCORM_TRUE,
          errorCode: 0
        };
      } else {
        return process(url, params, this.settings, this.error_codes);
      }
    }
    /**
     * Throws a SCORM error
     *
     * @param {number} when - the number of milliseconds to wait before committing
     * @param {string} callback - the name of the commit event callback
     */

  }, {
    key: "scheduleCommit",
    value: function scheduleCommit(when, callback) {
      _classPrivateFieldSet(this, _timeout, new ScheduledCommit(this, when, callback));

      this.apiLog('scheduleCommit', '', 'scheduled', global_constants.LOG_LEVEL_DEBUG);
    }
    /**
     * Clears and cancels any currently scheduled commits
     */

  }, {
    key: "clearScheduledCommit",
    value: function clearScheduledCommit() {
      if (_classPrivateFieldGet(this, _timeout)) {
        _classPrivateFieldGet(this, _timeout).cancel();

        _classPrivateFieldSet(this, _timeout, null);

        this.apiLog('clearScheduledCommit', '', 'cleared', global_constants.LOG_LEVEL_DEBUG);
      }
    }
  }]);

  return BaseAPI;
}();
/**
 * Private class that wraps a timeout call to the commit() function
 */


exports["default"] = BaseAPI;

var _API = /*#__PURE__*/new WeakMap();

var _cancelled = /*#__PURE__*/new WeakMap();

var _timeout2 = /*#__PURE__*/new WeakMap();

var _callback = /*#__PURE__*/new WeakMap();

var ScheduledCommit = /*#__PURE__*/function () {
  /**
   * Constructor for ScheduledCommit
   * @param {BaseAPI} API
   * @param {number} when
   * @param {string} callback
   */
  function ScheduledCommit(API, when, callback) {
    _classCallCheck(this, ScheduledCommit);

    _API.set(this, {
      writable: true,
      value: void 0
    });

    _cancelled.set(this, {
      writable: true,
      value: false
    });

    _timeout2.set(this, {
      writable: true,
      value: void 0
    });

    _callback.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _API, API);

    _classPrivateFieldSet(this, _timeout2, setTimeout(this.wrapper.bind(this), when));

    _classPrivateFieldSet(this, _callback, callback);
  }
  /**
   * Cancel any currently scheduled commit
   */


  _createClass(ScheduledCommit, [{
    key: "cancel",
    value: function cancel() {
      _classPrivateFieldSet(this, _cancelled, true);

      if (_classPrivateFieldGet(this, _timeout2)) {
        clearTimeout(_classPrivateFieldGet(this, _timeout2));
      }
    }
    /**
     * Wrap the API commit call to check if the call has already been cancelled
     */

  }, {
    key: "wrapper",
    value: function wrapper() {
      if (!_classPrivateFieldGet(this, _cancelled)) {
        _classPrivateFieldGet(this, _API).commit(_classPrivateFieldGet(this, _callback));
      }
    }
  }]);

  return ScheduledCommit;
}();

},{"./cmi/common":7,"./constants/api_constants":10,"./constants/error_codes":11,"./exceptions":15,"./utilities":17,"lodash.debounce":1}],4:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _BaseAPI2 = _interopRequireDefault(require("./BaseAPI"));

var _scorm12_cmi = require("./cmi/scorm12_cmi");

var Utilities = _interopRequireWildcard(require("./utilities"));

var _api_constants = _interopRequireDefault(require("./constants/api_constants"));

var _error_codes = _interopRequireDefault(require("./constants/error_codes"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var scorm12_constants = _api_constants["default"].scorm12;
var global_constants = _api_constants["default"].global;
var scorm12_error_codes = _error_codes["default"].scorm12;
/**
 * API class for SCORM 1.2
 */

var Scorm12API = /*#__PURE__*/function (_BaseAPI) {
  _inherits(Scorm12API, _BaseAPI);

  var _super = _createSuper(Scorm12API);

  /**
   * Constructor for SCORM 1.2 API
   * @param {object} settings
   */
  function Scorm12API(settings) {
    var _this;

    _classCallCheck(this, Scorm12API);

    var finalSettings = _objectSpread(_objectSpread({}, {
      mastery_override: false
    }), settings);

    _this = _super.call(this, scorm12_error_codes, finalSettings);
    _this.cmi = new _scorm12_cmi.CMI();
    _this.nav = new _scorm12_cmi.NAV(); // Rename functions to match 1.2 Spec and expose to modules

    _this.LMSInitialize = _this.lmsInitialize;
    _this.LMSFinish = _this.lmsFinish;
    _this.LMSGetValue = _this.lmsGetValue;
    _this.LMSSetValue = _this.lmsSetValue;
    _this.LMSCommit = _this.lmsCommit;
    _this.LMSGetLastError = _this.lmsGetLastError;
    _this.LMSGetErrorString = _this.lmsGetErrorString;
    _this.LMSGetDiagnostic = _this.lmsGetDiagnostic;
    return _this;
  }
  /**
   * lmsInitialize function from SCORM 1.2 Spec
   *
   * @return {string} bool
   */


  _createClass(Scorm12API, [{
    key: "lmsInitialize",
    value: function lmsInitialize() {
      this.cmi.initialize();
      return this.initialize('LMSInitialize', 'LMS was already initialized!', 'LMS is already finished!');
    }
    /**
     * LMSFinish function from SCORM 1.2 Spec
     *
     * @return {string} bool
     */

  }, {
    key: "lmsFinish",
    value: function lmsFinish() {
      var result = this.terminate('LMSFinish', true);

      if (result === global_constants.SCORM_TRUE) {
        if (this.nav.event !== '') {
          if (this.nav.event === 'continue') {
            this.processListeners('SequenceNext');
          } else {
            this.processListeners('SequencePrevious');
          }
        } else if (this.settings.autoProgress) {
          this.processListeners('SequenceNext');
        }
      }

      return result;
    }
    /**
     * LMSGetValue function from SCORM 1.2 Spec
     *
     * @param {string} CMIElement
     * @return {string}
     */

  }, {
    key: "lmsGetValue",
    value: function lmsGetValue(CMIElement) {
      return this.getValue('LMSGetValue', false, CMIElement);
    }
    /**
     * LMSSetValue function from SCORM 1.2 Spec
     *
     * @param {string} CMIElement
     * @param {*} value
     * @return {string}
     */

  }, {
    key: "lmsSetValue",
    value: function lmsSetValue(CMIElement, value) {
      return this.setValue('LMSSetValue', 'LMSCommit', false, CMIElement, value);
    }
    /**
     * LMSCommit function from SCORM 1.2 Spec
     *
     * @return {string} bool
     */

  }, {
    key: "lmsCommit",
    value: function lmsCommit() {
      return this.commit('LMSCommit', false);
    }
    /**
     * LMSGetLastError function from SCORM 1.2 Spec
     *
     * @return {string}
     */

  }, {
    key: "lmsGetLastError",
    value: function lmsGetLastError() {
      return this.getLastError('LMSGetLastError');
    }
    /**
     * LMSGetErrorString function from SCORM 1.2 Spec
     *
     * @param {string} CMIErrorCode
     * @return {string}
     */

  }, {
    key: "lmsGetErrorString",
    value: function lmsGetErrorString(CMIErrorCode) {
      return this.getErrorString('LMSGetErrorString', CMIErrorCode);
    }
    /**
     * LMSGetDiagnostic function from SCORM 1.2 Spec
     *
     * @param {string} CMIErrorCode
     * @return {string}
     */

  }, {
    key: "lmsGetDiagnostic",
    value: function lmsGetDiagnostic(CMIErrorCode) {
      return this.getDiagnostic('LMSGetDiagnostic', CMIErrorCode);
    }
    /**
     * Sets a value on the CMI Object
     *
     * @param {string} CMIElement
     * @param {*} value
     * @return {string}
     */

  }, {
    key: "setCMIValue",
    value: function setCMIValue(CMIElement, value) {
      return this._commonSetCMIValue('LMSSetValue', false, CMIElement, value);
    }
    /**
     * Gets a value from the CMI Object
     *
     * @param {string} CMIElement
     * @return {*}
     */

  }, {
    key: "getCMIValue",
    value: function getCMIValue(CMIElement) {
      return this._commonGetCMIValue('getCMIValue', false, CMIElement);
    }
    /**
     * Gets or builds a new child element to add to the array.
     *
     * @param {string} CMIElement
     * @param {*} value
     * @param {boolean} foundFirstIndex
     * @return {object}
     */

  }, {
    key: "getChildElement",
    value: function getChildElement(CMIElement, value, foundFirstIndex) {
      var newChild;

      if (this.stringMatches(CMIElement, 'cmi\\.objectives\\.\\d+')) {
        newChild = new _scorm12_cmi.CMIObjectivesObject();
      } else if (foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d+\\.correct_responses\\.\\d+')) {
        newChild = new _scorm12_cmi.CMIInteractionsCorrectResponsesObject();
      } else if (foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d+\\.objectives\\.\\d+')) {
        newChild = new _scorm12_cmi.CMIInteractionsObjectivesObject();
      } else if (!foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d+')) {
        newChild = new _scorm12_cmi.CMIInteractionsObject();
      }

      return newChild;
    }
    /**
     * Validates Correct Response values
     *
     * @param {string} CMIElement
     * @param {*} value
     * @return {boolean}
     */

  }, {
    key: "validateCorrectResponse",
    value: function validateCorrectResponse(CMIElement, value) {
      return true;
    }
    /**
     * Returns the message that corresponds to errorNumber.
     *
     * @param {*} errorNumber
     * @param {boolean} detail
     * @return {string}
     */

  }, {
    key: "getLmsErrorMessageDetails",
    value: function getLmsErrorMessageDetails(errorNumber, detail) {
      var basicMessage = 'No Error';
      var detailMessage = 'No Error'; // Set error number to string since inconsistent from modules if string or number

      errorNumber = String(errorNumber);

      if (scorm12_constants.error_descriptions[errorNumber]) {
        basicMessage = scorm12_constants.error_descriptions[errorNumber].basicMessage;
        detailMessage = scorm12_constants.error_descriptions[errorNumber].detailMessage;
      }

      return detail ? detailMessage : basicMessage;
    }
    /**
     * Replace the whole API with another
     *
     * @param {Scorm12API} newAPI
     */

  }, {
    key: "replaceWithAnotherScormAPI",
    value: function replaceWithAnotherScormAPI(newAPI) {
      // Data Model
      this.cmi = newAPI.cmi;
    }
    /**
     * Render the cmi object to the proper format for LMS commit
     *
     * @param {boolean} terminateCommit
     * @return {object|Array}
     */

  }, {
    key: "renderCommitCMI",
    value: function renderCommitCMI(terminateCommit) {
      var cmiExport = this.renderCMIToJSONObject();

      if (terminateCommit) {
        cmiExport.cmi.core.total_time = this.cmi.getCurrentTotalTime();
      }

      var result = [];
      var flattened = Utilities.flatten(cmiExport);

      switch (this.settings.dataCommitFormat) {
        case 'flattened':
          return Utilities.flatten(cmiExport);

        case 'params':
          for (var item in flattened) {
            if ({}.hasOwnProperty.call(flattened, item)) {
              result.push("".concat(item, "=").concat(flattened[item]));
            }
          }

          return result;

        case 'json':
        default:
          return cmiExport;
      }
    }
    /**
     * Attempts to store the data to the LMS
     *
     * @param {boolean} terminateCommit
     * @return {string}
     */

  }, {
    key: "storeData",
    value: function storeData(terminateCommit) {
      if (terminateCommit) {
        var originalStatus = this.cmi.core.lesson_status;

        if (originalStatus === 'not attempted') {
          this.cmi.core.lesson_status = 'completed';
        }

        if (this.cmi.core.lesson_mode === 'normal') {
          if (this.cmi.core.credit === 'credit') {
            if (this.settings.mastery_override && this.cmi.student_data.mastery_score !== '' && this.cmi.core.score.raw !== '') {
              if (parseFloat(this.cmi.core.score.raw) >= parseFloat(this.cmi.student_data.mastery_score)) {
                this.cmi.core.lesson_status = 'passed';
              } else {
                this.cmi.core.lesson_status = 'failed';
              }
            }
          }
        } else if (this.cmi.core.lesson_mode === 'browse') {
          var _this$startingData, _this$startingData$cm, _this$startingData$cm2;

          if ((((_this$startingData = this.startingData) === null || _this$startingData === void 0 ? void 0 : (_this$startingData$cm = _this$startingData.cmi) === null || _this$startingData$cm === void 0 ? void 0 : (_this$startingData$cm2 = _this$startingData$cm.core) === null || _this$startingData$cm2 === void 0 ? void 0 : _this$startingData$cm2.lesson_status) || '') === '' && originalStatus === 'not attempted') {
            this.cmi.core.lesson_status = 'browsed';
          }
        }
      }

      var commitObject = this.renderCommitCMI(terminateCommit || this.settings.alwaysSendTotalTime);

      if (this.settings.lmsCommitUrl) {
        if (this.apiLogLevel === global_constants.LOG_LEVEL_DEBUG) {
          console.debug('Commit (terminated: ' + (terminateCommit ? 'yes' : 'no') + '): ');
          console.debug(commitObject);
        }

        return this.processHttpRequest(this.settings.lmsCommitUrl, commitObject, terminateCommit);
      } else {
        console.log('Commit (terminated: ' + (terminateCommit ? 'yes' : 'no') + '): ');
        console.log(commitObject);
        return global_constants.SCORM_TRUE;
      }
    }
  }]);

  return Scorm12API;
}(_BaseAPI2["default"]);

exports["default"] = Scorm12API;

},{"./BaseAPI":3,"./cmi/scorm12_cmi":8,"./constants/api_constants":10,"./constants/error_codes":11,"./utilities":17}],5:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _BaseAPI2 = _interopRequireDefault(require("./BaseAPI"));

var _scorm2004_cmi = require("./cmi/scorm2004_cmi");

var Utilities = _interopRequireWildcard(require("./utilities"));

var _api_constants = _interopRequireDefault(require("./constants/api_constants"));

var _error_codes = _interopRequireDefault(require("./constants/error_codes"));

var _response_constants = _interopRequireDefault(require("./constants/response_constants"));

var _language_constants = _interopRequireDefault(require("./constants/language_constants"));

var _regex = _interopRequireDefault(require("./constants/regex"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var scorm2004_constants = _api_constants["default"].scorm2004;
var global_constants = _api_constants["default"].global;
var scorm2004_error_codes = _error_codes["default"].scorm2004;
var correct_responses = _response_constants["default"].correct;
var scorm2004_regex = _regex["default"].scorm2004;
/**
 * API class for SCORM 2004
 */

var _version = /*#__PURE__*/new WeakMap();

var Scorm2004API = /*#__PURE__*/function (_BaseAPI) {
  _inherits(Scorm2004API, _BaseAPI);

  var _super = _createSuper(Scorm2004API);

  /**
   * Constructor for SCORM 2004 API
   * @param {object} settings
   */
  function Scorm2004API(settings) {
    var _this;

    _classCallCheck(this, Scorm2004API);

    var finalSettings = _objectSpread(_objectSpread({}, {
      mastery_override: false
    }), settings);

    _this = _super.call(this, scorm2004_error_codes, finalSettings);

    _version.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _defineProperty(_assertThisInitialized(_this), "checkDuplicatedPattern", function (correct_response, current_index, value) {
      var found = false;
      var count = correct_response._count;

      for (var i = 0; i < count && !found; i++) {
        if (i !== current_index && correct_response.childArray[i] === value) {
          found = true;
        }
      }

      return found;
    });

    _this.cmi = new _scorm2004_cmi.CMI();
    _this.adl = new _scorm2004_cmi.ADL(); // Rename functions to match 2004 Spec and expose to modules

    _this.Initialize = _this.lmsInitialize;
    _this.Terminate = _this.lmsTerminate;
    _this.GetValue = _this.lmsGetValue;
    _this.SetValue = _this.lmsSetValue;
    _this.Commit = _this.lmsCommit;
    _this.GetLastError = _this.lmsGetLastError;
    _this.GetErrorString = _this.lmsGetErrorString;
    _this.GetDiagnostic = _this.lmsGetDiagnostic;
    return _this;
  }
  /**
   * Getter for #version
   * @return {string}
   */


  _createClass(Scorm2004API, [{
    key: "version",
    get: function get() {
      return _classPrivateFieldGet(this, _version);
    }
    /**
     * @return {string} bool
     */

  }, {
    key: "lmsInitialize",
    value: function lmsInitialize() {
      this.cmi.initialize();
      return this.initialize('Initialize');
    }
    /**
     * @return {string} bool
     */

  }, {
    key: "lmsTerminate",
    value: function lmsTerminate() {
      var result = this.terminate('Terminate', true);

      if (result === global_constants.SCORM_TRUE) {
        if (this.adl.nav.request !== '_none_') {
          switch (this.adl.nav.request) {
            case 'continue':
              this.processListeners('SequenceNext');
              break;

            case 'previous':
              this.processListeners('SequencePrevious');
              break;

            case 'choice':
              this.processListeners('SequenceChoice');
              break;

            case 'exit':
              this.processListeners('SequenceExit');
              break;

            case 'exitAll':
              this.processListeners('SequenceExitAll');
              break;

            case 'abandon':
              this.processListeners('SequenceAbandon');
              break;

            case 'abandonAll':
              this.processListeners('SequenceAbandonAll');
              break;
          }
        } else if (this.settings.autoProgress) {
          this.processListeners('SequenceNext');
        }
      }

      return result;
    }
    /**
     * @param {string} CMIElement
     * @return {string}
     */

  }, {
    key: "lmsGetValue",
    value: function lmsGetValue(CMIElement) {
      return this.getValue('GetValue', true, CMIElement);
    }
    /**
     * @param {string} CMIElement
     * @param {any} value
     * @return {string}
     */

  }, {
    key: "lmsSetValue",
    value: function lmsSetValue(CMIElement, value) {
      return this.setValue('SetValue', 'Commit', true, CMIElement, value);
    }
    /**
     * Orders LMS to store all content parameters
     *
     * @return {string} bool
     */

  }, {
    key: "lmsCommit",
    value: function lmsCommit() {
      return this.commit('Commit');
    }
    /**
     * Returns last error code
     *
     * @return {string}
     */

  }, {
    key: "lmsGetLastError",
    value: function lmsGetLastError() {
      return this.getLastError('GetLastError');
    }
    /**
     * Returns the errorNumber error description
     *
     * @param {(string|number)} CMIErrorCode
     * @return {string}
     */

  }, {
    key: "lmsGetErrorString",
    value: function lmsGetErrorString(CMIErrorCode) {
      return this.getErrorString('GetErrorString', CMIErrorCode);
    }
    /**
     * Returns a comprehensive description of the errorNumber error.
     *
     * @param {(string|number)} CMIErrorCode
     * @return {string}
     */

  }, {
    key: "lmsGetDiagnostic",
    value: function lmsGetDiagnostic(CMIErrorCode) {
      return this.getDiagnostic('GetDiagnostic', CMIErrorCode);
    }
    /**
     * Sets a value on the CMI Object
     *
     * @param {string} CMIElement
     * @param {any} value
     * @return {string}
     */

  }, {
    key: "setCMIValue",
    value: function setCMIValue(CMIElement, value) {
      return this._commonSetCMIValue('SetValue', true, CMIElement, value);
    }
    /**
     * Gets or builds a new child element to add to the array.
     *
     * @param {string} CMIElement
     * @param {any} value
     * @param {boolean} foundFirstIndex
     * @return {any}
     */

  }, {
    key: "getChildElement",
    value: function getChildElement(CMIElement, value, foundFirstIndex) {
      var newChild;

      if (this.stringMatches(CMIElement, 'cmi\\.objectives\\.\\d+')) {
        newChild = new _scorm2004_cmi.CMIObjectivesObject();
      } else if (foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d+\\.correct_responses\\.\\d+')) {
        var parts = CMIElement.split('.');
        var index = Number(parts[2]);
        var interaction = this.cmi.interactions.childArray[index];

        if (this.isInitialized()) {
          if (!interaction.type) {
            this.throwSCORMError(scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED);
          } else {
            this.checkDuplicateChoiceResponse(interaction, value);
            var response_type = correct_responses[interaction.type];

            if (response_type) {
              this.checkValidResponseType(response_type, value, interaction.type);
            } else {
              this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE, 'Incorrect Response Type: ' + interaction.type);
            }
          }
        }

        if (this.lastErrorCode === 0) {
          newChild = new _scorm2004_cmi.CMIInteractionsCorrectResponsesObject();
        }
      } else if (foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d+\\.objectives\\.\\d+')) {
        newChild = new _scorm2004_cmi.CMIInteractionsObjectivesObject();
      } else if (!foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d+')) {
        newChild = new _scorm2004_cmi.CMIInteractionsObject();
      } else if (this.stringMatches(CMIElement, 'cmi\\.comments_from_learner\\.\\d+')) {
        newChild = new _scorm2004_cmi.CMICommentsObject();
      } else if (this.stringMatches(CMIElement, 'cmi\\.comments_from_lms\\.\\d+')) {
        newChild = new _scorm2004_cmi.CMICommentsObject(true);
      }

      return newChild;
    }
    /**
     * Checks for valid response types
     * @param {object} response_type
     * @param {any} value
     * @param {string} interaction_type
     */

  }, {
    key: "checkValidResponseType",
    value: function checkValidResponseType(response_type, value, interaction_type) {
      var nodes = [];

      if (response_type !== null && response_type !== void 0 && response_type.delimiter) {
        nodes = String(value).split(response_type.delimiter);
      } else {
        nodes[0] = value;
      }

      if (nodes.length > 0 && nodes.length <= response_type.max) {
        this.checkCorrectResponseValue(interaction_type, nodes, value);
      } else if (nodes.length > response_type.max) {
        this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE, 'Data Model Element Pattern Too Long');
      }
    }
    /**
     * Checks for duplicate 'choice' responses.
     * @param {CMIInteractionsObject} interaction
     * @param {any} value
     */

  }, {
    key: "checkDuplicateChoiceResponse",
    value: function checkDuplicateChoiceResponse(interaction, value) {
      var interaction_count = interaction.correct_responses._count;

      if (interaction.type === 'choice') {
        for (var i = 0; i < interaction_count && this.lastErrorCode === 0; i++) {
          var response = interaction.correct_responses.childArray[i];

          if (response.pattern === value) {
            this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE);
          }
        }
      }
    }
    /**
     * Validate correct response.
     * @param {string} CMIElement
     * @param {*} value
     */

  }, {
    key: "validateCorrectResponse",
    value: function validateCorrectResponse(CMIElement, value) {
      var parts = CMIElement.split('.');
      var index = Number(parts[2]);
      var pattern_index = Number(parts[4]);
      var interaction = this.cmi.interactions.childArray[index];
      var interaction_count = interaction.correct_responses._count;
      this.checkDuplicateChoiceResponse(interaction, value);
      var response_type = correct_responses[interaction.type];

      if (typeof response_type.limit === 'undefined' || interaction_count <= response_type.limit) {
        this.checkValidResponseType(response_type, value, interaction.type);

        if (this.lastErrorCode === 0 && (!response_type.duplicate || !this.checkDuplicatedPattern(interaction.correct_responses, pattern_index, value)) || this.lastErrorCode === 0 && value === '') {// do nothing, we want the inverse
        } else {
          if (this.lastErrorCode === 0) {
            this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE, 'Data Model Element Pattern Already Exists');
          }
        }
      } else {
        this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE, 'Data Model Element Collection Limit Reached');
      }
    }
    /**
     * Gets a value from the CMI Object
     *
     * @param {string} CMIElement
     * @return {*}
     */

  }, {
    key: "getCMIValue",
    value: function getCMIValue(CMIElement) {
      return this._commonGetCMIValue('GetValue', true, CMIElement);
    }
    /**
     * Returns the message that corresponds to errorNumber.
     *
     * @param {(string|number)} errorNumber
     * @param {boolean} detail
     * @return {string}
     */

  }, {
    key: "getLmsErrorMessageDetails",
    value: function getLmsErrorMessageDetails(errorNumber, detail) {
      var basicMessage = '';
      var detailMessage = ''; // Set error number to string since inconsistent from modules if string or number

      errorNumber = String(errorNumber);

      if (scorm2004_constants.error_descriptions[errorNumber]) {
        basicMessage = scorm2004_constants.error_descriptions[errorNumber].basicMessage;
        detailMessage = scorm2004_constants.error_descriptions[errorNumber].detailMessage;
      }

      return detail ? detailMessage : basicMessage;
    }
    /**
     * Check to see if a correct_response value has been duplicated
     * @param {CMIArray} correct_response
     * @param {number} current_index
     * @param {*} value
     * @return {boolean}
     */

  }, {
    key: "checkCorrectResponseValue",
    value:
    /**
     * Checks for a valid correct_response value
     * @param {string} interaction_type
     * @param {Array} nodes
     * @param {*} value
     */
    function checkCorrectResponseValue(interaction_type, nodes, value) {
      var response = correct_responses[interaction_type];
      var formatRegex = new RegExp(response.format);

      for (var i = 0; i < nodes.length && this.lastErrorCode === 0; i++) {
        if (interaction_type.match('^(fill-in|long-fill-in|matching|performance|sequencing)$')) {
          nodes[i] = this.removeCorrectResponsePrefixes(nodes[i]);
        }

        if (response !== null && response !== void 0 && response.delimiter2) {
          var values = nodes[i].split(response.delimiter2);

          if (values.length === 2) {
            var matches = values[0].match(formatRegex);

            if (!matches) {
              this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
            } else {
              if (!values[1].match(new RegExp(response.format2))) {
                this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
              }
            }
          } else {
            this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
          }
        } else {
          var _matches = nodes[i].match(formatRegex);

          if (!_matches && value !== '' || !_matches && interaction_type === 'true-false') {
            this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
          } else {
            if (interaction_type === 'numeric' && nodes.length > 1) {
              if (Number(nodes[0]) > Number(nodes[1])) {
                this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
              }
            } else {
              if (nodes[i] !== '' && response.unique) {
                for (var j = 0; j < i && this.lastErrorCode === 0; j++) {
                  if (nodes[i] === nodes[j]) {
                    this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
                  }
                }
              }
            }
          }
        }
      }
    }
    /**
     * Remove prefixes from correct_response
     * @param {string} node
     * @return {*}
     */

  }, {
    key: "removeCorrectResponsePrefixes",
    value: function removeCorrectResponsePrefixes(node) {
      var seenOrder = false;
      var seenCase = false;
      var seenLang = false;
      var prefixRegex = new RegExp('^({(lang|case_matters|order_matters)=([^}]+)})');
      var matches = node.match(prefixRegex);
      var langMatches = null;

      while (matches) {
        switch (matches[2]) {
          case 'lang':
            langMatches = node.match(scorm2004_regex.CMILangcr);

            if (langMatches) {
              var lang = langMatches[3];

              if (lang !== undefined && lang.length > 0) {
                if (_language_constants["default"][lang.toLowerCase()] === undefined) {
                  this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
                }
              }
            }

            seenLang = true;
            break;

          case 'case_matters':
            if (!seenLang && !seenOrder && !seenCase) {
              if (matches[3] !== 'true' && matches[3] !== 'false') {
                this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
              }
            }

            seenCase = true;
            break;

          case 'order_matters':
            if (!seenCase && !seenLang && !seenOrder) {
              if (matches[3] !== 'true' && matches[3] !== 'false') {
                this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
              }
            }

            seenOrder = true;
            break;

          default:
            break;
        }

        node = node.substr(matches[1].length);
        matches = node.match(prefixRegex);
      }

      return node;
    }
    /**
     * Replace the whole API with another
     * @param {Scorm2004API} newAPI
     */

  }, {
    key: "replaceWithAnotherScormAPI",
    value: function replaceWithAnotherScormAPI(newAPI) {
      // Data Model
      this.cmi = newAPI.cmi;
      this.adl = newAPI.adl;
    }
    /**
     * Render the cmi object to the proper format for LMS commit
     *
     * @param {boolean} terminateCommit
     * @return {object|Array}
     */

  }, {
    key: "renderCommitCMI",
    value: function renderCommitCMI(terminateCommit) {
      var cmiExport = this.renderCMIToJSONObject();

      if (terminateCommit) {
        cmiExport.cmi.total_time = this.cmi.getCurrentTotalTime();
      }

      var result = [];
      var flattened = Utilities.flatten(cmiExport);

      switch (this.settings.dataCommitFormat) {
        case 'flattened':
          return Utilities.flatten(cmiExport);

        case 'params':
          for (var item in flattened) {
            if ({}.hasOwnProperty.call(flattened, item)) {
              result.push("".concat(item, "=").concat(flattened[item]));
            }
          }

          return result;

        case 'json':
        default:
          return cmiExport;
      }
    }
    /**
     * Attempts to store the data to the LMS
     *
     * @param {boolean} terminateCommit
     * @return {string}
     */

  }, {
    key: "storeData",
    value: function storeData(terminateCommit) {
      var _this$startingData, _this$startingData$ad, _this$startingData$ad2;

      if (terminateCommit) {
        if (this.cmi.mode === 'normal') {
          if (this.cmi.credit === 'credit') {
            if (this.cmi.completion_threshold && this.cmi.progress_measure) {
              if (this.cmi.progress_measure >= this.cmi.completion_threshold) {
                console.debug('Setting Completion Status: Completed');
                this.cmi.completion_status = 'completed';
              } else {
                console.debug('Setting Completion Status: Incomplete');
                this.cmi.completion_status = 'incomplete';
              }
            }

            if (this.cmi.scaled_passing_score && this.cmi.score.scaled) {
              if (this.cmi.score.scaled >= this.cmi.scaled_passing_score) {
                console.debug('Setting Success Status: Passed');
                this.cmi.success_status = 'passed';
              } else {
                console.debug('Setting Success Status: Failed');
                this.cmi.success_status = 'failed';
              }
            }
          }
        }
      }

      var navRequest = false;

      if (this.adl.nav.request !== ((_this$startingData = this.startingData) === null || _this$startingData === void 0 ? void 0 : (_this$startingData$ad = _this$startingData.adl) === null || _this$startingData$ad === void 0 ? void 0 : (_this$startingData$ad2 = _this$startingData$ad.nav) === null || _this$startingData$ad2 === void 0 ? void 0 : _this$startingData$ad2.request) && this.adl.nav.request !== '_none_') {
        this.adl.nav.request = encodeURIComponent(this.adl.nav.request);
        navRequest = true;
      }

      var commitObject = this.renderCommitCMI(terminateCommit || this.settings.alwaysSendTotalTime);

      if (this.settings.lmsCommitUrl) {
        if (this.apiLogLevel === global_constants.LOG_LEVEL_DEBUG) {
          console.debug('Commit (terminated: ' + (terminateCommit ? 'yes' : 'no') + '): ');
          console.debug(commitObject);
        }

        var result = this.processHttpRequest(this.settings.lmsCommitUrl, commitObject, terminateCommit); // check if this is a sequencing call, and then call the necessary JS

        {
          if (navRequest && result.navRequest !== undefined && result.navRequest !== '') {
            Function("\"use strict\";(() => { ".concat(result.navRequest, " })()"))();
          }
        }
        return result;
      } else {
        console.log('Commit (terminated: ' + (terminateCommit ? 'yes' : 'no') + '): ');
        console.log(commitObject);
        return global_constants.SCORM_TRUE;
      }
    }
  }]);

  return Scorm2004API;
}(_BaseAPI2["default"]);

exports["default"] = Scorm2004API;

},{"./BaseAPI":3,"./cmi/scorm2004_cmi":9,"./constants/api_constants":10,"./constants/error_codes":11,"./constants/language_constants":12,"./constants/regex":13,"./constants/response_constants":14,"./utilities":17}],6:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CMIEvaluationCommentsObject = exports.CMIAttemptRecordsObject = exports.CMIAttemptRecords = exports.CMITriesObject = exports.CMITries = exports.CMIPathsObject = exports.CMIPaths = exports.CMIStudentDemographics = exports.CMI = void 0;

var Scorm12CMI = _interopRequireWildcard(require("./scorm12_cmi"));

var _common = require("./common");

var _api_constants = _interopRequireDefault(require("../constants/api_constants"));

var _regex = _interopRequireDefault(require("../constants/regex"));

var _error_codes = _interopRequireDefault(require("../constants/error_codes"));

var _exceptions = require("../exceptions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var aicc_constants = _api_constants["default"].aicc;
var aicc_regex = _regex["default"].aicc;
var aicc_error_codes = _error_codes["default"].scorm12;
/**
 * Helper method for throwing Read Only error
 */

function throwReadOnlyError() {
  throw new _exceptions.AICCValidationError(aicc_error_codes.READ_ONLY_ELEMENT);
}
/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} regexPattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */


function checkAICCValidFormat(value, regexPattern, allowEmptyString) {
  return (0, _common.checkValidFormat)(value, regexPattern, aicc_error_codes.TYPE_MISMATCH, _exceptions.AICCValidationError, allowEmptyString);
}
/**
 * CMI Class for AICC
 */


var CMI = /*#__PURE__*/function (_Scorm12CMI$CMI) {
  _inherits(CMI, _Scorm12CMI$CMI);

  var _super = _createSuper(CMI);

  /**
   * Constructor for AICC CMI object
   * @param {boolean} initialized
   */
  function CMI(initialized) {
    var _this;

    _classCallCheck(this, CMI);

    _this = _super.call(this, aicc_constants.cmi_children);
    if (initialized) _this.initialize();
    _this.student_preference = new AICCStudentPreferences();
    _this.student_data = new AICCCMIStudentData();
    _this.student_demographics = new CMIStudentDemographics();
    _this.evaluation = new CMIEvaluation();
    _this.paths = new CMIPaths();
    return _this;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMI, [{
    key: "initialize",
    value: function initialize() {
      var _this$student_prefere, _this$student_data, _this$student_demogra, _this$evaluation, _this$paths;

      _get(_getPrototypeOf(CMI.prototype), "initialize", this).call(this);

      (_this$student_prefere = this.student_preference) === null || _this$student_prefere === void 0 ? void 0 : _this$student_prefere.initialize();
      (_this$student_data = this.student_data) === null || _this$student_data === void 0 ? void 0 : _this$student_data.initialize();
      (_this$student_demogra = this.student_demographics) === null || _this$student_demogra === void 0 ? void 0 : _this$student_demogra.initialize();
      (_this$evaluation = this.evaluation) === null || _this$evaluation === void 0 ? void 0 : _this$evaluation.initialize();
      (_this$paths = this.paths) === null || _this$paths === void 0 ? void 0 : _this$paths.initialize();
    }
    /**
     * toJSON for cmi
     *
     * @return {
     *    {
     *      suspend_data: string,
     *      launch_data: string,
     *      comments: string,
     *      comments_from_lms: string,
     *      core: CMICore,
     *      objectives: CMIObjectives,
     *      student_data: CMIStudentData,
     *      student_preference: CMIStudentPreference,
     *      interactions: CMIInteractions,
     *      paths: CMIPaths
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'suspend_data': this.suspend_data,
        'launch_data': this.launch_data,
        'comments': this.comments,
        'comments_from_lms': this.comments_from_lms,
        'core': this.core,
        'objectives': this.objectives,
        'student_data': this.student_data,
        'student_preference': this.student_preference,
        'student_demographics': this.student_demographics,
        'interactions': this.interactions,
        'evaluation': this.evaluation,
        'paths': this.paths
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMI;
}(Scorm12CMI.CMI);
/**
 * AICC Evaluation object
 */


exports.CMI = CMI;

var CMIEvaluation = /*#__PURE__*/function (_BaseCMI) {
  _inherits(CMIEvaluation, _BaseCMI);

  var _super2 = _createSuper(CMIEvaluation);

  /**
   * Constructor for AICC Evaluation object
   */
  function CMIEvaluation() {
    var _this2;

    _classCallCheck(this, CMIEvaluation);

    _this2 = _super2.call(this);
    _this2.comments = new CMIEvaluationComments();
    return _this2;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMIEvaluation, [{
    key: "initialize",
    value: function initialize() {
      var _this$comments;

      _get(_getPrototypeOf(CMIEvaluation.prototype), "initialize", this).call(this);

      (_this$comments = this.comments) === null || _this$comments === void 0 ? void 0 : _this$comments.initialize();
    }
    /**
     * toJSON for cmi.evaluation object
     * @return {{comments: CMIEvaluationComments}}
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'comments': this.comments
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIEvaluation;
}(_common.BaseCMI);
/**
 * Class representing AICC's cmi.evaluation.comments object
 */


var CMIEvaluationComments = /*#__PURE__*/function (_CMIArray) {
  _inherits(CMIEvaluationComments, _CMIArray);

  var _super3 = _createSuper(CMIEvaluationComments);

  /**
   * Constructor for AICC Evaluation Comments object
   */
  function CMIEvaluationComments() {
    _classCallCheck(this, CMIEvaluationComments);

    return _super3.call(this, {
      children: aicc_constants.comments_children,
      errorCode: aicc_error_codes.INVALID_SET_VALUE,
      errorClass: _exceptions.AICCValidationError
    });
  }

  return CMIEvaluationComments;
}(_common.CMIArray);
/**
 * StudentPreferences class for AICC
 */


var _lesson_type = /*#__PURE__*/new WeakMap();

var _text_color = /*#__PURE__*/new WeakMap();

var _text_location = /*#__PURE__*/new WeakMap();

var _text_size = /*#__PURE__*/new WeakMap();

var _video = /*#__PURE__*/new WeakMap();

var AICCStudentPreferences = /*#__PURE__*/function (_Scorm12CMI$CMIStuden) {
  _inherits(AICCStudentPreferences, _Scorm12CMI$CMIStuden);

  var _super4 = _createSuper(AICCStudentPreferences);

  /**
   * Constructor for AICC Student Preferences object
   */
  function AICCStudentPreferences() {
    var _this3;

    _classCallCheck(this, AICCStudentPreferences);

    _this3 = _super4.call(this, aicc_constants.student_preference_children);

    _lesson_type.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _text_color.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _text_location.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _text_size.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _video.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _this3.windows = new _common.CMIArray({
      errorCode: aicc_error_codes.INVALID_SET_VALUE,
      errorClass: _exceptions.AICCValidationError,
      children: ''
    });
    return _this3;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(AICCStudentPreferences, [{
    key: "initialize",
    value: function initialize() {
      var _this$windows;

      _get(_getPrototypeOf(AICCStudentPreferences.prototype), "initialize", this).call(this);

      (_this$windows = this.windows) === null || _this$windows === void 0 ? void 0 : _this$windows.initialize();
    }
  }, {
    key: "lesson_type",
    get:
    /**
     * Getter for #lesson_type
     * @return {string}
     */
    function get() {
      return _classPrivateFieldGet(this, _lesson_type);
    }
    /**
     * Setter for #lesson_type
     * @param {string} lesson_type
     */
    ,
    set: function set(lesson_type) {
      if (checkAICCValidFormat(lesson_type, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _lesson_type, lesson_type);
      }
    }
    /**
     * Getter for #text_color
     * @return {string}
     */

  }, {
    key: "text_color",
    get: function get() {
      return _classPrivateFieldGet(this, _text_color);
    }
    /**
     * Setter for #text_color
     * @param {string} text_color
     */
    ,
    set: function set(text_color) {
      if (checkAICCValidFormat(text_color, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _text_color, text_color);
      }
    }
    /**
     * Getter for #text_location
     * @return {string}
     */

  }, {
    key: "text_location",
    get: function get() {
      return _classPrivateFieldGet(this, _text_location);
    }
    /**
     * Setter for #text_location
     * @param {string} text_location
     */
    ,
    set: function set(text_location) {
      if (checkAICCValidFormat(text_location, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _text_location, text_location);
      }
    }
    /**
     * Getter for #text_size
     * @return {string}
     */

  }, {
    key: "text_size",
    get: function get() {
      return _classPrivateFieldGet(this, _text_size);
    }
    /**
     * Setter for #text_size
     * @param {string} text_size
     */
    ,
    set: function set(text_size) {
      if (checkAICCValidFormat(text_size, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _text_size, text_size);
      }
    }
    /**
     * Getter for #video
     * @return {string}
     */

  }, {
    key: "video",
    get: function get() {
      return _classPrivateFieldGet(this, _video);
    }
    /**
     * Setter for #video
     * @param {string} video
     */
    ,
    set: function set(video) {
      if (checkAICCValidFormat(video, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _video, video);
      }
    }
    /**
     * toJSON for cmi.student_preference
     *
     * @return {
     *    {
     *      audio: string,
     *      language: string,
     *      speed: string,
     *      text: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'audio': this.audio,
        'language': this.language,
        'lesson_type': this.lesson_type,
        'speed': this.speed,
        'text': this.text,
        'text_color': this.text_color,
        'text_location': this.text_location,
        'text_size': this.text_size,
        'video': this.video,
        'windows': this.windows
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return AICCStudentPreferences;
}(Scorm12CMI.CMIStudentPreference);
/**
 * StudentData class for AICC
 */


var _tries_during_lesson = /*#__PURE__*/new WeakMap();

var AICCCMIStudentData = /*#__PURE__*/function (_Scorm12CMI$CMIStuden2) {
  _inherits(AICCCMIStudentData, _Scorm12CMI$CMIStuden2);

  var _super5 = _createSuper(AICCCMIStudentData);

  /**
   * Constructor for AICC StudentData object
   */
  function AICCCMIStudentData() {
    var _this4;

    _classCallCheck(this, AICCCMIStudentData);

    _this4 = _super5.call(this, aicc_constants.student_data_children);

    _tries_during_lesson.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _this4.tries = new CMITries();
    return _this4;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(AICCCMIStudentData, [{
    key: "initialize",
    value: function initialize() {
      var _this$tries;

      _get(_getPrototypeOf(AICCCMIStudentData.prototype), "initialize", this).call(this);

      (_this$tries = this.tries) === null || _this$tries === void 0 ? void 0 : _this$tries.initialize();
    }
  }, {
    key: "tries_during_lesson",
    get:
    /**
     * Getter for tries_during_lesson
     * @return {string}
     */
    function get() {
      return _classPrivateFieldGet(this, _tries_during_lesson);
    }
    /**
     * Setter for #tries_during_lesson. Sets an error if trying to set after
     *  initialization.
     * @param {string} tries_during_lesson
     */
    ,
    set: function set(tries_during_lesson) {
      !this.initialized ? _classPrivateFieldSet(this, _tries_during_lesson, tries_during_lesson) : throwReadOnlyError();
    }
    /**
     * toJSON for cmi.student_data object
     * @return {
     *    {
     *      mastery_score: string,
     *      max_time_allowed: string,
     *      time_limit_action: string,
     *      tries: CMITries
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'mastery_score': this.mastery_score,
        'max_time_allowed': this.max_time_allowed,
        'time_limit_action': this.time_limit_action,
        'tries': this.tries
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return AICCCMIStudentData;
}(Scorm12CMI.CMIStudentData);
/**
 * Class representing the AICC cmi.student_demographics object
 */


var _children = /*#__PURE__*/new WeakMap();

var _city = /*#__PURE__*/new WeakMap();

var _class = /*#__PURE__*/new WeakMap();

var _company = /*#__PURE__*/new WeakMap();

var _country = /*#__PURE__*/new WeakMap();

var _experience = /*#__PURE__*/new WeakMap();

var _familiar_name = /*#__PURE__*/new WeakMap();

var _instructor_name = /*#__PURE__*/new WeakMap();

var _title = /*#__PURE__*/new WeakMap();

var _native_language = /*#__PURE__*/new WeakMap();

var _state = /*#__PURE__*/new WeakMap();

var _street_address = /*#__PURE__*/new WeakMap();

var _telephone = /*#__PURE__*/new WeakMap();

var _years_experience = /*#__PURE__*/new WeakMap();

var CMIStudentDemographics = /*#__PURE__*/function (_BaseCMI2) {
  _inherits(CMIStudentDemographics, _BaseCMI2);

  var _super6 = _createSuper(CMIStudentDemographics);

  /**
   * Constructor for AICC StudentDemographics object
   */
  function CMIStudentDemographics() {
    var _this5;

    _classCallCheck(this, CMIStudentDemographics);

    _this5 = _super6.call(this);

    _children.set(_assertThisInitialized(_this5), {
      writable: true,
      value: aicc_constants.student_demographics_children
    });

    _city.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _class.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _company.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _country.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _experience.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _familiar_name.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _instructor_name.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _title.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _native_language.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _state.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _street_address.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _telephone.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _years_experience.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    return _this5;
  }

  _createClass(CMIStudentDemographics, [{
    key: "_children",
    get:
    /**
     * Getter for _children
     * @return {string}
     */
    function get() {
      return _classPrivateFieldGet(this, _children);
    }
    /**
     * Getter for city
     * @return {string}
     */

  }, {
    key: "city",
    get: function get() {
      return _classPrivateFieldGet(this, _city);
    }
    /**
     * Setter for #city. Sets an error if trying to set after
     *  initialization.
     * @param {string} city
     */
    ,
    set: function set(city) {
      !this.initialized ? _classPrivateFieldSet(this, _city, city) : throwReadOnlyError();
    }
    /**
     * Getter for class
     * @return {string}
     */

  }, {
    key: "class",
    get: function get() {
      return _classPrivateFieldGet(this, _class);
    }
    /**
     * Setter for #class. Sets an error if trying to set after
     *  initialization.
     * @param {string} clazz
     */
    ,
    set: function set(clazz) {
      !this.initialized ? _classPrivateFieldSet(this, _class, clazz) : throwReadOnlyError();
    }
    /**
     * Getter for company
     * @return {string}
     */

  }, {
    key: "company",
    get: function get() {
      return _classPrivateFieldGet(this, _company);
    }
    /**
     * Setter for #company. Sets an error if trying to set after
     *  initialization.
     * @param {string} company
     */
    ,
    set: function set(company) {
      !this.initialized ? _classPrivateFieldSet(this, _company, company) : throwReadOnlyError();
    }
    /**
     * Getter for country
     * @return {string}
     */

  }, {
    key: "country",
    get: function get() {
      return _classPrivateFieldGet(this, _country);
    }
    /**
     * Setter for #country. Sets an error if trying to set after
     *  initialization.
     * @param {string} country
     */
    ,
    set: function set(country) {
      !this.initialized ? _classPrivateFieldSet(this, _country, country) : throwReadOnlyError();
    }
    /**
     * Getter for experience
     * @return {string}
     */

  }, {
    key: "experience",
    get: function get() {
      return _classPrivateFieldGet(this, _experience);
    }
    /**
     * Setter for #experience. Sets an error if trying to set after
     *  initialization.
     * @param {string} experience
     */
    ,
    set: function set(experience) {
      !this.initialized ? _classPrivateFieldSet(this, _experience, experience) : throwReadOnlyError();
    }
    /**
     * Getter for familiar_name
     * @return {string}
     */

  }, {
    key: "familiar_name",
    get: function get() {
      return _classPrivateFieldGet(this, _familiar_name);
    }
    /**
     * Setter for #familiar_name. Sets an error if trying to set after
     *  initialization.
     * @param {string} familiar_name
     */
    ,
    set: function set(familiar_name) {
      !this.initialized ? _classPrivateFieldSet(this, _familiar_name, familiar_name) : throwReadOnlyError();
    }
    /**
     * Getter for instructor_name
     * @return {string}
     */

  }, {
    key: "instructor_name",
    get: function get() {
      return _classPrivateFieldGet(this, _instructor_name);
    }
    /**
     * Setter for #instructor_name. Sets an error if trying to set after
     *  initialization.
     * @param {string} instructor_name
     */
    ,
    set: function set(instructor_name) {
      !this.initialized ? _classPrivateFieldSet(this, _instructor_name, instructor_name) : throwReadOnlyError();
    }
    /**
     * Getter for title
     * @return {string}
     */

  }, {
    key: "title",
    get: function get() {
      return _classPrivateFieldGet(this, _title);
    }
    /**
     * Setter for #title. Sets an error if trying to set after
     *  initialization.
     * @param {string} title
     */
    ,
    set: function set(title) {
      !this.initialized ? _classPrivateFieldSet(this, _title, title) : throwReadOnlyError();
    }
    /**
     * Getter for native_language
     * @return {string}
     */

  }, {
    key: "native_language",
    get: function get() {
      return _classPrivateFieldGet(this, _native_language);
    }
    /**
     * Setter for #native_language. Sets an error if trying to set after
     *  initialization.
     * @param {string} native_language
     */
    ,
    set: function set(native_language) {
      !this.initialized ? _classPrivateFieldSet(this, _native_language, native_language) : throwReadOnlyError();
    }
    /**
     * Getter for state
     * @return {string}
     */

  }, {
    key: "state",
    get: function get() {
      return _classPrivateFieldGet(this, _state);
    }
    /**
     * Setter for #state. Sets an error if trying to set after
     *  initialization.
     * @param {string} state
     */
    ,
    set: function set(state) {
      !this.initialized ? _classPrivateFieldSet(this, _state, state) : throwReadOnlyError();
    }
    /**
     * Getter for street_address
     * @return {string}
     */

  }, {
    key: "street_address",
    get: function get() {
      return _classPrivateFieldGet(this, _street_address);
    }
    /**
     * Setter for #street_address. Sets an error if trying to set after
     *  initialization.
     * @param {string} street_address
     */
    ,
    set: function set(street_address) {
      !this.initialized ? _classPrivateFieldSet(this, _street_address, street_address) : throwReadOnlyError();
    }
    /**
     * Getter for telephone
     * @return {string}
     */

  }, {
    key: "telephone",
    get: function get() {
      return _classPrivateFieldGet(this, _telephone);
    }
    /**
     * Setter for #telephone. Sets an error if trying to set after
     *  initialization.
     * @param {string} telephone
     */
    ,
    set: function set(telephone) {
      !this.initialized ? _classPrivateFieldSet(this, _telephone, telephone) : throwReadOnlyError();
    }
    /**
     * Getter for years_experience
     * @return {string}
     */

  }, {
    key: "years_experience",
    get: function get() {
      return _classPrivateFieldGet(this, _years_experience);
    }
    /**
     * Setter for #years_experience. Sets an error if trying to set after
     *  initialization.
     * @param {string} years_experience
     */
    ,
    set: function set(years_experience) {
      !this.initialized ? _classPrivateFieldSet(this, _years_experience, years_experience) : throwReadOnlyError();
    }
    /**
     * toJSON for cmi.student_demographics object
     * @return {
     *      {
     *        city: string,
     *        class: string,
     *        company: string,
     *        country: string,
     *        experience: string,
     *        familiar_name: string,
     *        instructor_name: string,
     *        title: string,
     *        native_language: string,
     *        state: string,
     *        street_address: string,
     *        telephone: string,
     *        years_experience: string
     *      }
     *    }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'city': this.city,
        'class': this["class"],
        'company': this.company,
        'country': this.country,
        'experience': this.experience,
        'familiar_name': this.familiar_name,
        'instructor_name': this.instructor_name,
        'title': this.title,
        'native_language': this.native_language,
        'state': this.state,
        'street_address': this.street_address,
        'telephone': this.telephone,
        'years_experience': this.years_experience
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIStudentDemographics;
}(_common.BaseCMI);
/**
 * Class representing the AICC cmi.paths object
 */


exports.CMIStudentDemographics = CMIStudentDemographics;

var CMIPaths = /*#__PURE__*/function (_CMIArray2) {
  _inherits(CMIPaths, _CMIArray2);

  var _super7 = _createSuper(CMIPaths);

  /**
   * Constructor for inline Paths Array class
   */
  function CMIPaths() {
    _classCallCheck(this, CMIPaths);

    return _super7.call(this, {
      children: aicc_constants.paths_children
    });
  }

  return CMIPaths;
}(_common.CMIArray);
/**
 * Class for AICC Paths
 */


exports.CMIPaths = CMIPaths;

var _location_id = /*#__PURE__*/new WeakMap();

var _date = /*#__PURE__*/new WeakMap();

var _time = /*#__PURE__*/new WeakMap();

var _status = /*#__PURE__*/new WeakMap();

var _why_left = /*#__PURE__*/new WeakMap();

var _time_in_element = /*#__PURE__*/new WeakMap();

var CMIPathsObject = /*#__PURE__*/function (_BaseCMI3) {
  _inherits(CMIPathsObject, _BaseCMI3);

  var _super8 = _createSuper(CMIPathsObject);

  /**
   * Constructor for AICC Paths objects
   */
  function CMIPathsObject() {
    var _this6;

    _classCallCheck(this, CMIPathsObject);

    _this6 = _super8.call(this);

    _location_id.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _date.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _time.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _status.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _why_left.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _time_in_element.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    return _this6;
  }

  _createClass(CMIPathsObject, [{
    key: "location_id",
    get:
    /**
     * Getter for #location_id
     * @return {string}
     */
    function get() {
      return _classPrivateFieldGet(this, _location_id);
    }
    /**
     * Setter for #location_id
     * @param {string} location_id
     */
    ,
    set: function set(location_id) {
      if (checkAICCValidFormat(location_id, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _location_id, location_id);
      }
    }
    /**
     * Getter for #date
     * @return {string}
     */

  }, {
    key: "date",
    get: function get() {
      return _classPrivateFieldGet(this, _date);
    }
    /**
     * Setter for #date
     * @param {string} date
     */
    ,
    set: function set(date) {
      if (checkAICCValidFormat(date, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _date, date);
      }
    }
    /**
     * Getter for #time
     * @return {string}
     */

  }, {
    key: "time",
    get: function get() {
      return _classPrivateFieldGet(this, _time);
    }
    /**
     * Setter for #time
     * @param {string} time
     */
    ,
    set: function set(time) {
      if (checkAICCValidFormat(time, aicc_regex.CMITime)) {
        _classPrivateFieldSet(this, _time, time);
      }
    }
    /**
     * Getter for #status
     * @return {string}
     */

  }, {
    key: "status",
    get: function get() {
      return _classPrivateFieldGet(this, _status);
    }
    /**
     * Setter for #status
     * @param {string} status
     */
    ,
    set: function set(status) {
      if (checkAICCValidFormat(status, aicc_regex.CMIStatus2)) {
        _classPrivateFieldSet(this, _status, status);
      }
    }
    /**
     * Getter for #why_left
     * @return {string}
     */

  }, {
    key: "why_left",
    get: function get() {
      return _classPrivateFieldGet(this, _why_left);
    }
    /**
     * Setter for #why_left
     * @param {string} why_left
     */
    ,
    set: function set(why_left) {
      if (checkAICCValidFormat(why_left, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _why_left, why_left);
      }
    }
    /**
     * Getter for #time_in_element
     * @return {string}
     */

  }, {
    key: "time_in_element",
    get: function get() {
      return _classPrivateFieldGet(this, _time_in_element);
    }
    /**
     * Setter for #time_in_element
     * @param {string} time_in_element
     */
    ,
    set: function set(time_in_element) {
      if (checkAICCValidFormat(time_in_element, aicc_regex.CMITime)) {
        _classPrivateFieldSet(this, _time_in_element, time_in_element);
      }
    }
    /**
     * toJSON for cmi.paths.n object
     * @return {
     *    {
     *      location_id: string,
     *      date: string,
     *      time: string,
     *      status: string,
     *      why_left: string,
     *      time_in_element: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'location_id': this.location_id,
        'date': this.date,
        'time': this.time,
        'status': this.status,
        'why_left': this.why_left,
        'time_in_element': this.time_in_element
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIPathsObject;
}(_common.BaseCMI);
/**
 * Class representing the AICC cmi.student_data.tries object
 */


exports.CMIPathsObject = CMIPathsObject;

var CMITries = /*#__PURE__*/function (_CMIArray3) {
  _inherits(CMITries, _CMIArray3);

  var _super9 = _createSuper(CMITries);

  /**
   * Constructor for inline Tries Array class
   */
  function CMITries() {
    _classCallCheck(this, CMITries);

    return _super9.call(this, {
      children: aicc_constants.tries_children
    });
  }

  return CMITries;
}(_common.CMIArray);
/**
 * Class for AICC Tries
 */


exports.CMITries = CMITries;

var _status2 = /*#__PURE__*/new WeakMap();

var _time2 = /*#__PURE__*/new WeakMap();

var CMITriesObject = /*#__PURE__*/function (_BaseCMI4) {
  _inherits(CMITriesObject, _BaseCMI4);

  var _super10 = _createSuper(CMITriesObject);

  /**
   * Constructor for AICC Tries object
   */
  function CMITriesObject() {
    var _this7;

    _classCallCheck(this, CMITriesObject);

    _this7 = _super10.call(this);

    _status2.set(_assertThisInitialized(_this7), {
      writable: true,
      value: ''
    });

    _time2.set(_assertThisInitialized(_this7), {
      writable: true,
      value: ''
    });

    _this7.score = new _common.CMIScore({
      score_children: aicc_constants.score_children,
      score_range: aicc_regex.score_range,
      invalidErrorCode: aicc_error_codes.INVALID_SET_VALUE,
      invalidTypeCode: aicc_error_codes.TYPE_MISMATCH,
      invalidRangeCode: aicc_error_codes.VALUE_OUT_OF_RANGE,
      errorClass: _exceptions.AICCValidationError
    });
    return _this7;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMITriesObject, [{
    key: "initialize",
    value: function initialize() {
      var _this$score;

      _get(_getPrototypeOf(CMITriesObject.prototype), "initialize", this).call(this);

      (_this$score = this.score) === null || _this$score === void 0 ? void 0 : _this$score.initialize();
    }
  }, {
    key: "status",
    get:
    /**
     * Getter for #status
     * @return {string}
     */
    function get() {
      return _classPrivateFieldGet(this, _status2);
    }
    /**
     * Setter for #status
     * @param {string} status
     */
    ,
    set: function set(status) {
      if (checkAICCValidFormat(status, aicc_regex.CMIStatus2)) {
        _classPrivateFieldSet(this, _status2, status);
      }
    }
    /**
     * Getter for #time
     * @return {string}
     */

  }, {
    key: "time",
    get: function get() {
      return _classPrivateFieldGet(this, _time2);
    }
    /**
     * Setter for #time
     * @param {string} time
     */
    ,
    set: function set(time) {
      if (checkAICCValidFormat(time, aicc_regex.CMITime)) {
        _classPrivateFieldSet(this, _time2, time);
      }
    }
    /**
     * toJSON for cmi.student_data.tries.n object
     * @return {
     *    {
     *      status: string,
     *      time: string,
     *      score: CMIScore
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'status': this.status,
        'time': this.time,
        'score': this.score
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMITriesObject;
}(_common.BaseCMI);
/**
 * Class for cmi.student_data.attempt_records array
 */


exports.CMITriesObject = CMITriesObject;

var CMIAttemptRecords = /*#__PURE__*/function (_CMIArray4) {
  _inherits(CMIAttemptRecords, _CMIArray4);

  var _super11 = _createSuper(CMIAttemptRecords);

  /**
   * Constructor for inline Tries Array class
   */
  function CMIAttemptRecords() {
    _classCallCheck(this, CMIAttemptRecords);

    return _super11.call(this, {
      children: aicc_constants.attempt_records_children
    });
  }

  return CMIAttemptRecords;
}(_common.CMIArray);
/**
 * Class for AICC Attempt Records
 */


exports.CMIAttemptRecords = CMIAttemptRecords;

var _lesson_status = /*#__PURE__*/new WeakMap();

var CMIAttemptRecordsObject = /*#__PURE__*/function (_BaseCMI5) {
  _inherits(CMIAttemptRecordsObject, _BaseCMI5);

  var _super12 = _createSuper(CMIAttemptRecordsObject);

  /**
   * Constructor for AICC Attempt Records object
   */
  function CMIAttemptRecordsObject() {
    var _this8;

    _classCallCheck(this, CMIAttemptRecordsObject);

    _this8 = _super12.call(this);

    _lesson_status.set(_assertThisInitialized(_this8), {
      writable: true,
      value: ''
    });

    _this8.score = new _common.CMIScore({
      score_children: aicc_constants.score_children,
      score_range: aicc_regex.score_range,
      invalidErrorCode: aicc_error_codes.INVALID_SET_VALUE,
      invalidTypeCode: aicc_error_codes.TYPE_MISMATCH,
      invalidRangeCode: aicc_error_codes.VALUE_OUT_OF_RANGE,
      errorClass: _exceptions.AICCValidationError
    });
    return _this8;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMIAttemptRecordsObject, [{
    key: "initialize",
    value: function initialize() {
      var _this$score2;

      _get(_getPrototypeOf(CMIAttemptRecordsObject.prototype), "initialize", this).call(this);

      (_this$score2 = this.score) === null || _this$score2 === void 0 ? void 0 : _this$score2.initialize();
    }
  }, {
    key: "lesson_status",
    get:
    /**
     * Getter for #lesson_status
     * @return {string}
     */
    function get() {
      return _classPrivateFieldGet(this, _lesson_status);
    }
    /**
     * Setter for #lesson_status
     * @param {string} lesson_status
     */
    ,
    set: function set(lesson_status) {
      if (checkAICCValidFormat(lesson_status, aicc_regex.CMIStatus2)) {
        _classPrivateFieldSet(this, _lesson_status, lesson_status);
      }
    }
    /**
     * toJSON for cmi.student_data.attempt_records.n object
     * @return {
     *    {
     *      status: string,
     *      time: string,
     *      score: CMIScore
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'lesson_status': this.lesson_status,
        'score': this.score
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIAttemptRecordsObject;
}(_common.BaseCMI);
/**
 * Class for AICC Evaluation Comments
 */


exports.CMIAttemptRecordsObject = CMIAttemptRecordsObject;

var _content = /*#__PURE__*/new WeakMap();

var _location = /*#__PURE__*/new WeakMap();

var _time3 = /*#__PURE__*/new WeakMap();

var CMIEvaluationCommentsObject = /*#__PURE__*/function (_BaseCMI6) {
  _inherits(CMIEvaluationCommentsObject, _BaseCMI6);

  var _super13 = _createSuper(CMIEvaluationCommentsObject);

  /**
   * Constructor for Evaluation Comments
   */
  function CMIEvaluationCommentsObject() {
    var _this9;

    _classCallCheck(this, CMIEvaluationCommentsObject);

    _this9 = _super13.call(this);

    _content.set(_assertThisInitialized(_this9), {
      writable: true,
      value: ''
    });

    _location.set(_assertThisInitialized(_this9), {
      writable: true,
      value: ''
    });

    _time3.set(_assertThisInitialized(_this9), {
      writable: true,
      value: ''
    });

    return _this9;
  }

  _createClass(CMIEvaluationCommentsObject, [{
    key: "content",
    get:
    /**
     * Getter for #content
     * @return {string}
     */
    function get() {
      return _classPrivateFieldGet(this, _content);
    }
    /**
     * Setter for #content
     * @param {string} content
     */
    ,
    set: function set(content) {
      if (checkAICCValidFormat(content, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _content, content);
      }
    }
    /**
     * Getter for #location
     * @return {string}
     */

  }, {
    key: "location",
    get: function get() {
      return _classPrivateFieldGet(this, _location);
    }
    /**
     * Setter for #location
     * @param {string} location
     */
    ,
    set: function set(location) {
      if (checkAICCValidFormat(location, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _location, location);
      }
    }
    /**
     * Getter for #time
     * @return {string}
     */

  }, {
    key: "time",
    get: function get() {
      return _classPrivateFieldGet(this, _time3);
    }
    /**
     * Setting for #time
     * @param {string} time
     */
    ,
    set: function set(time) {
      if (checkAICCValidFormat(time, aicc_regex.CMITime)) {
        _classPrivateFieldSet(this, _time3, time);
      }
    }
    /**
     * toJSON for cmi.evaulation.comments.n object
     * @return {
     *    {
     *      content: string,
     *      location: string,
     *      time: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'content': this.content,
        'location': this.location,
        'time': this.time
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIEvaluationCommentsObject;
}(_common.BaseCMI);

exports.CMIEvaluationCommentsObject = CMIEvaluationCommentsObject;

},{"../constants/api_constants":10,"../constants/error_codes":11,"../constants/regex":13,"../exceptions":15,"./common":7,"./scorm12_cmi":8}],7:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkValidFormat = checkValidFormat;
exports.checkValidRange = checkValidRange;
exports.CMIArray = exports.CMIScore = exports.BaseCMI = void 0;

var _api_constants = _interopRequireDefault(require("../constants/api_constants"));

var _error_codes = _interopRequireDefault(require("../constants/error_codes"));

var _regex = _interopRequireDefault(require("../constants/regex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var scorm12_constants = _api_constants["default"].scorm12;
var scorm12_regex = _regex["default"].scorm12;
var scorm12_error_codes = _error_codes["default"].scorm12;
/**
 * Check if the value matches the proper format. If not, throw proper error code.
 *
 * @param {string} value
 * @param {string} regexPattern
 * @param {number} errorCode
 * @param {class} errorClass
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */

function checkValidFormat(value, regexPattern, errorCode, errorClass, allowEmptyString) {
  var formatRegex = new RegExp(regexPattern);
  var matches = value.match(formatRegex);

  if (allowEmptyString && value === '') {
    return true;
  }

  if (value === undefined || !matches || matches[0] === '') {
    throw new errorClass.prototype.constructor(errorCode);
  }

  return true;
}
/**
 * Check if the value matches the proper range. If not, throw proper error code.
 *
 * @param {*} value
 * @param {string} rangePattern
 * @param {number} errorCode
 * @param {class} errorClass
 * @return {boolean}
 */


function checkValidRange(value, rangePattern, errorCode, errorClass) {
  var ranges = rangePattern.split('#');
  value = value * 1.0;

  if (value >= ranges[0]) {
    if (ranges[1] === '*' || value <= ranges[1]) {
      return true;
    } else {
      throw new errorClass.prototype.constructor(errorCode);
    }
  } else {
    throw new errorClass.prototype.constructor(errorCode);
  }
}
/**
 * Base class for API cmi objects
 */


var _initialized = /*#__PURE__*/new WeakMap();

var _start_time = /*#__PURE__*/new WeakMap();

var BaseCMI = /*#__PURE__*/function () {
  /**
   * Constructor for BaseCMI, just marks the class as abstract
   */
  function BaseCMI() {
    _classCallCheck(this, BaseCMI);

    _defineProperty(this, "jsonString", false);

    _initialized.set(this, {
      writable: true,
      value: false
    });

    _start_time.set(this, {
      writable: true,
      value: void 0
    });

    if ((this instanceof BaseCMI ? this.constructor : void 0) === BaseCMI) {
      throw new TypeError('Cannot construct BaseCMI instances directly');
    }
  }
  /**
   * Getter for #initialized
   * @return {boolean}
   */


  _createClass(BaseCMI, [{
    key: "initialized",
    get: function get() {
      return _classPrivateFieldGet(this, _initialized);
    }
    /**
     * Getter for #start_time
     * @return {Number}
     */

  }, {
    key: "start_time",
    get: function get() {
      return _classPrivateFieldGet(this, _start_time);
    }
    /**
     * Called when the API has been initialized after the CMI has been created
     */

  }, {
    key: "initialize",
    value: function initialize() {
      _classPrivateFieldSet(this, _initialized, true);
    }
    /**
     * Called when the player should override the 'session_time' provided by
     * the module
     */

  }, {
    key: "setStartTime",
    value: function setStartTime() {
      _classPrivateFieldSet(this, _start_time, new Date().getTime());
    }
  }]);

  return BaseCMI;
}();
/**
 * Base class for cmi *.score objects
 */


exports.BaseCMI = BaseCMI;

var _children2 = /*#__PURE__*/new WeakMap();

var _score_range = /*#__PURE__*/new WeakMap();

var _invalid_error_code = /*#__PURE__*/new WeakMap();

var _invalid_type_code = /*#__PURE__*/new WeakMap();

var _invalid_range_code = /*#__PURE__*/new WeakMap();

var _decimal_regex = /*#__PURE__*/new WeakMap();

var _error_class = new WeakMap();

var _raw = /*#__PURE__*/new WeakMap();

var _min = /*#__PURE__*/new WeakMap();

var _max = /*#__PURE__*/new WeakMap();

var CMIScore = /*#__PURE__*/function (_BaseCMI) {
  _inherits(CMIScore, _BaseCMI);

  var _super = _createSuper(CMIScore);

  /**
   * Constructor for *.score
   * @param {string} score_children
   * @param {string} score_range
   * @param {string} max
   * @param {number} invalidErrorCode
   * @param {number} invalidTypeCode
   * @param {number} invalidRangeCode
   * @param {string} decimalRegex
   * @param {class} errorClass
   */
  function CMIScore(_ref) {
    var _this;

    var score_children = _ref.score_children,
        score_range = _ref.score_range,
        max = _ref.max,
        invalidErrorCode = _ref.invalidErrorCode,
        invalidTypeCode = _ref.invalidTypeCode,
        invalidRangeCode = _ref.invalidRangeCode,
        decimalRegex = _ref.decimalRegex,
        errorClass = _ref.errorClass;

    _classCallCheck(this, CMIScore);

    _this = _super.call(this);

    _children2.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _score_range.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _invalid_error_code.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _invalid_type_code.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _invalid_range_code.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _decimal_regex.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _error_class.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _raw.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _min.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _max.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(_assertThisInitialized(_this), _children2, score_children || scorm12_constants.score_children);

    _classPrivateFieldSet(_assertThisInitialized(_this), _score_range, !score_range ? false : scorm12_regex.score_range);

    _classPrivateFieldSet(_assertThisInitialized(_this), _max, max || max === '' ? max : '100');

    _classPrivateFieldSet(_assertThisInitialized(_this), _invalid_error_code, invalidErrorCode || scorm12_error_codes.INVALID_SET_VALUE);

    _classPrivateFieldSet(_assertThisInitialized(_this), _invalid_type_code, invalidTypeCode || scorm12_error_codes.TYPE_MISMATCH);

    _classPrivateFieldSet(_assertThisInitialized(_this), _invalid_range_code, invalidRangeCode || scorm12_error_codes.VALUE_OUT_OF_RANGE);

    _classPrivateFieldSet(_assertThisInitialized(_this), _decimal_regex, decimalRegex || scorm12_regex.CMIDecimal);

    _classPrivateFieldSet(_assertThisInitialized(_this), _error_class, errorClass);

    return _this;
  }

  _createClass(CMIScore, [{
    key: "_children",
    get:
    /**
     * Getter for _children
     * @return {string}
     * @private
     */
    function get() {
      return _classPrivateFieldGet(this, _children2);
    }
    /**
     * Setter for _children. Just throws an error.
     * @param {string} _children
     * @private
     */
    ,
    set: function set(_children) {
      throw new (_classPrivateFieldGet(this, _error_class).prototype.constructor)(_classPrivateFieldGet(this, _invalid_error_code));
    }
    /**
     * Getter for #raw
     * @return {string}
     */

  }, {
    key: "raw",
    get: function get() {
      return _classPrivateFieldGet(this, _raw);
    }
    /**
     * Setter for #raw
     * @param {string} raw
     */
    ,
    set: function set(raw) {
      if (checkValidFormat(raw, _classPrivateFieldGet(this, _decimal_regex), _classPrivateFieldGet(this, _invalid_type_code), _classPrivateFieldGet(this, _error_class)) && (!_classPrivateFieldGet(this, _score_range) || checkValidRange(raw, _classPrivateFieldGet(this, _score_range), _classPrivateFieldGet(this, _invalid_range_code), _classPrivateFieldGet(this, _error_class)))) {
        _classPrivateFieldSet(this, _raw, raw);
      }
    }
    /**
     * Getter for #min
     * @return {string}
     */

  }, {
    key: "min",
    get: function get() {
      return _classPrivateFieldGet(this, _min);
    }
    /**
     * Setter for #min
     * @param {string} min
     */
    ,
    set: function set(min) {
      if (checkValidFormat(min, _classPrivateFieldGet(this, _decimal_regex), _classPrivateFieldGet(this, _invalid_type_code), _classPrivateFieldGet(this, _error_class)) && (!_classPrivateFieldGet(this, _score_range) || checkValidRange(min, _classPrivateFieldGet(this, _score_range), _classPrivateFieldGet(this, _invalid_range_code), _classPrivateFieldGet(this, _error_class)))) {
        _classPrivateFieldSet(this, _min, min);
      }
    }
    /**
     * Getter for #max
     * @return {string}
     */

  }, {
    key: "max",
    get: function get() {
      return _classPrivateFieldGet(this, _max);
    }
    /**
     * Setter for #max
     * @param {string} max
     */
    ,
    set: function set(max) {
      if (checkValidFormat(max, _classPrivateFieldGet(this, _decimal_regex), _classPrivateFieldGet(this, _invalid_type_code), _classPrivateFieldGet(this, _error_class)) && (!_classPrivateFieldGet(this, _score_range) || checkValidRange(max, _classPrivateFieldGet(this, _score_range), _classPrivateFieldGet(this, _invalid_range_code), _classPrivateFieldGet(this, _error_class)))) {
        _classPrivateFieldSet(this, _max, max);
      }
    }
    /**
     * toJSON for *.score
     * @return {{min: string, max: string, raw: string}}
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'raw': this.raw,
        'min': this.min,
        'max': this.max
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIScore;
}(BaseCMI);
/**
 * Base class for cmi *.n objects
 */


exports.CMIScore = CMIScore;

var _errorCode = /*#__PURE__*/new WeakMap();

var _errorClass = new WeakMap();

var _children3 = /*#__PURE__*/new WeakMap();

var CMIArray = /*#__PURE__*/function (_BaseCMI2) {
  _inherits(CMIArray, _BaseCMI2);

  var _super2 = _createSuper(CMIArray);

  /**
   * Constructor cmi *.n arrays
   * @param {string} children
   * @param {number} errorCode
   * @param {class} errorClass
   */
  function CMIArray(_ref2) {
    var _this2;

    var children = _ref2.children,
        errorCode = _ref2.errorCode,
        errorClass = _ref2.errorClass;

    _classCallCheck(this, CMIArray);

    _this2 = _super2.call(this);

    _errorCode.set(_assertThisInitialized(_this2), {
      writable: true,
      value: void 0
    });

    _errorClass.set(_assertThisInitialized(_this2), {
      writable: true,
      value: void 0
    });

    _children3.set(_assertThisInitialized(_this2), {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(_assertThisInitialized(_this2), _children3, children);

    _classPrivateFieldSet(_assertThisInitialized(_this2), _errorCode, errorCode);

    _classPrivateFieldSet(_assertThisInitialized(_this2), _errorClass, errorClass);

    _this2.childArray = [];
    return _this2;
  }

  _createClass(CMIArray, [{
    key: "_children",
    get:
    /**
     * Getter for _children
     * @return {*}
     */
    function get() {
      return _classPrivateFieldGet(this, _children3);
    }
    /**
     * Setter for _children. Just throws an error.
     * @param {string} _children
     */
    ,
    set: function set(_children) {
      throw new (_classPrivateFieldGet(this, _errorClass).prototype.constructor)(_classPrivateFieldGet(this, _errorCode));
    }
    /**
     * Getter for _count
     * @return {number}
     */

  }, {
    key: "_count",
    get: function get() {
      return this.childArray.length;
    }
    /**
     * Setter for _count. Just throws an error.
     * @param {number} _count
     */
    ,
    set: function set(_count) {
      throw new (_classPrivateFieldGet(this, _errorClass).prototype.constructor)(_classPrivateFieldGet(this, _errorCode));
    }
    /**
     * toJSON for *.n arrays
     * @return {object}
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {};

      for (var i = 0; i < this.childArray.length; i++) {
        result[i + ''] = this.childArray[i];
      }

      delete this.jsonString;
      return result;
    }
  }]);

  return CMIArray;
}(BaseCMI);

exports.CMIArray = CMIArray;

},{"../constants/api_constants":10,"../constants/error_codes":11,"../constants/regex":13}],8:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throwReadOnlyError = throwReadOnlyError;
exports.throwWriteOnlyError = throwWriteOnlyError;
exports.check12ValidFormat = check12ValidFormat;
exports.check12ValidRange = check12ValidRange;
exports.NAV = exports.CMIInteractionsCorrectResponsesObject = exports.CMIInteractionsObjectivesObject = exports.CMIObjectivesObject = exports.CMIInteractionsObject = exports.CMIStudentPreference = exports.CMIStudentData = exports.CMI = void 0;

var _common = require("./common");

var _api_constants = _interopRequireDefault(require("../constants/api_constants"));

var _error_codes = _interopRequireDefault(require("../constants/error_codes"));

var _regex = _interopRequireDefault(require("../constants/regex"));

var _exceptions = require("../exceptions");

var Utilities = _interopRequireWildcard(require("../utilities"));

var Util = Utilities;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

var scorm12_constants = _api_constants["default"].scorm12;
var scorm12_regex = _regex["default"].scorm12;
var scorm12_error_codes = _error_codes["default"].scorm12;
/**
 * Helper method for throwing Read Only error
 */

function throwReadOnlyError() {
  throw new _exceptions.Scorm12ValidationError(scorm12_error_codes.READ_ONLY_ELEMENT);
}
/**
 * Helper method for throwing Write Only error
 */


function throwWriteOnlyError() {
  throw new _exceptions.Scorm12ValidationError(scorm12_error_codes.WRITE_ONLY_ELEMENT);
}
/**
 * Helper method for throwing Invalid Set error
 */


function throwInvalidValueError() {
  throw new _exceptions.Scorm12ValidationError(scorm12_error_codes.INVALID_SET_VALUE);
}
/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} regexPattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */


function check12ValidFormat(value, regexPattern, allowEmptyString) {
  return (0, _common.checkValidFormat)(value, regexPattern, scorm12_error_codes.TYPE_MISMATCH, _exceptions.Scorm12ValidationError, allowEmptyString);
}
/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} rangePattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */


function check12ValidRange(value, rangePattern, allowEmptyString) {
  return (0, _common.checkValidRange)(value, rangePattern, scorm12_error_codes.VALUE_OUT_OF_RANGE, _exceptions.Scorm12ValidationError, allowEmptyString);
}
/**
 * Class representing the cmi object for SCORM 1.2
 */


var _children2 = /*#__PURE__*/new WeakMap();

var _version2 = /*#__PURE__*/new WeakMap();

var _launch_data = /*#__PURE__*/new WeakMap();

var _comments = /*#__PURE__*/new WeakMap();

var _comments_from_lms = /*#__PURE__*/new WeakMap();

var CMI = /*#__PURE__*/function (_BaseCMI) {
  _inherits(CMI, _BaseCMI);

  var _super = _createSuper(CMI);

  /**
   * Constructor for the SCORM 1.2 cmi object
   * @param {string} cmi_children
   * @param {(CMIStudentData|AICCCMIStudentData)} student_data
   * @param {boolean} initialized
   */
  function CMI(cmi_children, student_data, initialized) {
    var _this;

    _classCallCheck(this, CMI);

    _this = _super.call(this);

    _children2.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _version2.set(_assertThisInitialized(_this), {
      writable: true,
      value: '3.4'
    });

    _launch_data.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _comments.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _comments_from_lms.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _defineProperty(_assertThisInitialized(_this), "student_data", null);

    if (initialized) _this.initialize();

    _classPrivateFieldSet(_assertThisInitialized(_this), _children2, cmi_children ? cmi_children : scorm12_constants.cmi_children);

    _this.core = new CMICore();
    _this.objectives = new CMIObjectives();
    _this.student_data = student_data ? student_data : new CMIStudentData();
    _this.student_preference = new CMIStudentPreference();
    _this.interactions = new CMIInteractions();
    return _this;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMI, [{
    key: "initialize",
    value: function initialize() {
      var _this$core, _this$objectives, _this$student_data, _this$student_prefere, _this$interactions;

      _get(_getPrototypeOf(CMI.prototype), "initialize", this).call(this);

      (_this$core = this.core) === null || _this$core === void 0 ? void 0 : _this$core.initialize();
      (_this$objectives = this.objectives) === null || _this$objectives === void 0 ? void 0 : _this$objectives.initialize();
      (_this$student_data = this.student_data) === null || _this$student_data === void 0 ? void 0 : _this$student_data.initialize();
      (_this$student_prefere = this.student_preference) === null || _this$student_prefere === void 0 ? void 0 : _this$student_prefere.initialize();
      (_this$interactions = this.interactions) === null || _this$interactions === void 0 ? void 0 : _this$interactions.initialize();
    }
    /**
     * toJSON for cmi
     *
     * @return {
     *    {
     *      suspend_data: string,
     *      launch_data: string,
     *      comments: string,
     *      comments_from_lms: string,
     *      core: CMICore,
     *      objectives: CMIObjectives,
     *      student_data: CMIStudentData,
     *      student_preference: CMIStudentPreference,
     *      interactions: CMIInteractions
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'suspend_data': this.suspend_data,
        'launch_data': this.launch_data,
        'comments': this.comments,
        'comments_from_lms': this.comments_from_lms,
        'core': this.core,
        'objectives': this.objectives,
        'student_data': this.student_data,
        'student_preference': this.student_preference,
        'interactions': this.interactions
      };
      delete this.jsonString;
      return result;
    }
    /**
     * Getter for #_version
     * @return {string}
     */

  }, {
    key: "_version",
    get: function get() {
      return _classPrivateFieldGet(this, _version2);
    }
    /**
     * Setter for #_version. Just throws an error.
     * @param {string} _version
     */
    ,
    set: function set(_version) {
      throwInvalidValueError();
    }
    /**
     * Getter for #_children
     * @return {string}
     */

  }, {
    key: "_children",
    get: function get() {
      return _classPrivateFieldGet(this, _children2);
    }
    /**
     * Setter for #_version. Just throws an error.
     * @param {string} _children
     */
    ,
    set: function set(_children) {
      throwInvalidValueError();
    }
    /**
     * Getter for #suspend_data
     * @return {string}
     */

  }, {
    key: "suspend_data",
    get: function get() {
      var _this$core2;

      return (_this$core2 = this.core) === null || _this$core2 === void 0 ? void 0 : _this$core2.suspend_data;
    }
    /**
     * Setter for #suspend_data
     * @param {string} suspend_data
     */
    ,
    set: function set(suspend_data) {
      if (this.core) {
        this.core.suspend_data = suspend_data;
      }
    }
    /**
     * Getter for #launch_data
     * @return {string}
     */

  }, {
    key: "launch_data",
    get: function get() {
      return _classPrivateFieldGet(this, _launch_data);
    }
    /**
     * Setter for #launch_data. Can only be called before  initialization.
     * @param {string} launch_data
     */
    ,
    set: function set(launch_data) {
      !this.initialized ? _classPrivateFieldSet(this, _launch_data, launch_data) : throwReadOnlyError();
    }
    /**
     * Getter for #comments
     * @return {string}
     */

  }, {
    key: "comments",
    get: function get() {
      return _classPrivateFieldGet(this, _comments);
    }
    /**
     * Setter for #comments
     * @param {string} comments
     */
    ,
    set: function set(comments) {
      if (check12ValidFormat(comments, scorm12_regex.CMIString4096, true)) {
        _classPrivateFieldSet(this, _comments, comments);
      }
    }
    /**
     * Getter for #comments_from_lms
     * @return {string}
     */

  }, {
    key: "comments_from_lms",
    get: function get() {
      return _classPrivateFieldGet(this, _comments_from_lms);
    }
    /**
     * Setter for #comments_from_lms. Can only be called before  initialization.
     * @param {string} comments_from_lms
     */
    ,
    set: function set(comments_from_lms) {
      !this.initialized ? _classPrivateFieldSet(this, _comments_from_lms, comments_from_lms) : throwReadOnlyError();
    }
    /**
     * Adds the current session time to the existing total time.
     *
     * @return {string}
     */

  }, {
    key: "getCurrentTotalTime",
    value: function getCurrentTotalTime() {
      return this.core.getCurrentTotalTime(this.start_time);
    }
  }]);

  return CMI;
}(_common.BaseCMI);
/**
 * Class representing the cmi.core object
 * @extends BaseCMI
 */


exports.CMI = CMI;

var _children3 = /*#__PURE__*/new WeakMap();

var _student_id = /*#__PURE__*/new WeakMap();

var _student_name = /*#__PURE__*/new WeakMap();

var _lesson_location = /*#__PURE__*/new WeakMap();

var _credit = /*#__PURE__*/new WeakMap();

var _lesson_status = /*#__PURE__*/new WeakMap();

var _entry = /*#__PURE__*/new WeakMap();

var _total_time = /*#__PURE__*/new WeakMap();

var _lesson_mode = /*#__PURE__*/new WeakMap();

var _exit = /*#__PURE__*/new WeakMap();

var _session_time = /*#__PURE__*/new WeakMap();

var _suspend_data = /*#__PURE__*/new WeakMap();

var CMICore = /*#__PURE__*/function (_BaseCMI2) {
  _inherits(CMICore, _BaseCMI2);

  var _super2 = _createSuper(CMICore);

  /**
   * Constructor for cmi.core
   */
  function CMICore() {
    var _this2;

    _classCallCheck(this, CMICore);

    _this2 = _super2.call(this);

    _children3.set(_assertThisInitialized(_this2), {
      writable: true,
      value: scorm12_constants.core_children
    });

    _student_id.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _student_name.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _lesson_location.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _credit.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _lesson_status.set(_assertThisInitialized(_this2), {
      writable: true,
      value: 'not attempted'
    });

    _entry.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _total_time.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _lesson_mode.set(_assertThisInitialized(_this2), {
      writable: true,
      value: 'normal'
    });

    _exit.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _session_time.set(_assertThisInitialized(_this2), {
      writable: true,
      value: '00:00:00'
    });

    _suspend_data.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _this2.score = new _common.CMIScore({
      score_children: scorm12_constants.score_children,
      score_range: scorm12_regex.score_range,
      invalidErrorCode: scorm12_error_codes.INVALID_SET_VALUE,
      invalidTypeCode: scorm12_error_codes.TYPE_MISMATCH,
      invalidRangeCode: scorm12_error_codes.VALUE_OUT_OF_RANGE,
      errorClass: _exceptions.Scorm12ValidationError
    });
    return _this2;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMICore, [{
    key: "initialize",
    value: function initialize() {
      var _this$score;

      _get(_getPrototypeOf(CMICore.prototype), "initialize", this).call(this);

      (_this$score = this.score) === null || _this$score === void 0 ? void 0 : _this$score.initialize();
    }
  }, {
    key: "_children",
    get:
    /**
     * Getter for #_children
     * @return {string}
     * @private
     */
    function get() {
      return _classPrivateFieldGet(this, _children3);
    }
    /**
     * Setter for #_children. Just throws an error.
     * @param {string} _children
     * @private
     */
    ,
    set: function set(_children) {
      throwInvalidValueError();
    }
    /**
     * Getter for #student_id
     * @return {string}
     */

  }, {
    key: "student_id",
    get: function get() {
      return _classPrivateFieldGet(this, _student_id);
    }
    /**
     * Setter for #student_id. Can only be called before  initialization.
     * @param {string} student_id
     */
    ,
    set: function set(student_id) {
      !this.initialized ? _classPrivateFieldSet(this, _student_id, student_id) : throwReadOnlyError();
    }
    /**
     * Getter for #student_name
     * @return {string}
     */

  }, {
    key: "student_name",
    get: function get() {
      return _classPrivateFieldGet(this, _student_name);
    }
    /**
     * Setter for #student_name. Can only be called before  initialization.
     * @param {string} student_name
     */
    ,
    set: function set(student_name) {
      !this.initialized ? _classPrivateFieldSet(this, _student_name, student_name) : throwReadOnlyError();
    }
    /**
     * Getter for #lesson_location
     * @return {string}
     */

  }, {
    key: "lesson_location",
    get: function get() {
      return _classPrivateFieldGet(this, _lesson_location);
    }
    /**
     * Setter for #lesson_location
     * @param {string} lesson_location
     */
    ,
    set: function set(lesson_location) {
      if (check12ValidFormat(lesson_location, scorm12_regex.CMIString256, true)) {
        _classPrivateFieldSet(this, _lesson_location, lesson_location);
      }
    }
    /**
     * Getter for #credit
     * @return {string}
     */

  }, {
    key: "credit",
    get: function get() {
      return _classPrivateFieldGet(this, _credit);
    }
    /**
     * Setter for #credit. Can only be called before  initialization.
     * @param {string} credit
     */
    ,
    set: function set(credit) {
      !this.initialized ? _classPrivateFieldSet(this, _credit, credit) : throwReadOnlyError();
    }
    /**
     * Getter for #lesson_status
     * @return {string}
     */

  }, {
    key: "lesson_status",
    get: function get() {
      return _classPrivateFieldGet(this, _lesson_status);
    }
    /**
     * Setter for #lesson_status
     * @param {string} lesson_status
     */
    ,
    set: function set(lesson_status) {
      if (this.initialized) {
        if (check12ValidFormat(lesson_status, scorm12_regex.CMIStatus)) {
          _classPrivateFieldSet(this, _lesson_status, lesson_status);
        }
      } else {
        if (check12ValidFormat(lesson_status, scorm12_regex.CMIStatus2)) {
          _classPrivateFieldSet(this, _lesson_status, lesson_status);
        }
      }
    }
    /**
     * Getter for #entry
     * @return {string}
     */

  }, {
    key: "entry",
    get: function get() {
      return _classPrivateFieldGet(this, _entry);
    }
    /**
     * Setter for #entry. Can only be called before  initialization.
     * @param {string} entry
     */
    ,
    set: function set(entry) {
      !this.initialized ? _classPrivateFieldSet(this, _entry, entry) : throwReadOnlyError();
    }
    /**
     * Getter for #total_time
     * @return {string}
     */

  }, {
    key: "total_time",
    get: function get() {
      return _classPrivateFieldGet(this, _total_time);
    }
    /**
     * Setter for #total_time. Can only be called before  initialization.
     * @param {string} total_time
     */
    ,
    set: function set(total_time) {
      !this.initialized ? _classPrivateFieldSet(this, _total_time, total_time) : throwReadOnlyError();
    }
    /**
     * Getter for #lesson_mode
     * @return {string}
     */

  }, {
    key: "lesson_mode",
    get: function get() {
      return _classPrivateFieldGet(this, _lesson_mode);
    }
    /**
     * Setter for #lesson_mode. Can only be called before  initialization.
     * @param {string} lesson_mode
     */
    ,
    set: function set(lesson_mode) {
      !this.initialized ? _classPrivateFieldSet(this, _lesson_mode, lesson_mode) : throwReadOnlyError();
    }
    /**
     * Getter for #exit. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "exit",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _exit);
    }
    /**
     * Setter for #exit
     * @param {string} exit
     */
    ,
    set: function set(exit) {
      if (check12ValidFormat(exit, scorm12_regex.CMIExit, true)) {
        _classPrivateFieldSet(this, _exit, exit);
      }
    }
    /**
     * Getter for #session_time. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "session_time",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _session_time);
    }
    /**
     * Setter for #session_time
     * @param {string} session_time
     */
    ,
    set: function set(session_time) {
      if (check12ValidFormat(session_time, scorm12_regex.CMITimespan)) {
        _classPrivateFieldSet(this, _session_time, session_time);
      }
    }
    /**
     * Getter for #suspend_data
     * @return {string}
     */

  }, {
    key: "suspend_data",
    get: function get() {
      return _classPrivateFieldGet(this, _suspend_data);
    }
    /**
     * Setter for #suspend_data
     * @param {string} suspend_data
     */
    ,
    set: function set(suspend_data) {
      if (check12ValidFormat(suspend_data, scorm12_regex.CMIString4096, true)) {
        _classPrivateFieldSet(this, _suspend_data, suspend_data);
      }
    }
    /**
     * Adds the current session time to the existing total time.
     * @param {Number} start_time
     * @return {string}
     */

  }, {
    key: "getCurrentTotalTime",
    value: function getCurrentTotalTime(start_time) {
      var sessionTime = _classPrivateFieldGet(this, _session_time);

      var startTime = start_time;

      if (typeof startTime !== 'undefined' && startTime !== null) {
        var seconds = new Date().getTime() - startTime;
        sessionTime = Util.getSecondsAsHHMMSS(seconds / 1000);
      }

      return Utilities.addHHMMSSTimeStrings(_classPrivateFieldGet(this, _total_time), sessionTime, new RegExp(scorm12_regex.CMITimespan));
    }
    /**
     * toJSON for cmi.core
     *
     * @return {
     *    {
     *      student_name: string,
     *      entry: string,
     *      exit: string,
     *      score: CMIScore,
     *      student_id: string,
     *      lesson_mode: string,
     *      lesson_location: string,
     *      lesson_status: string,
     *      credit: string,
     *      session_time: *
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'student_id': this.student_id,
        'student_name': this.student_name,
        'lesson_location': this.lesson_location,
        'credit': this.credit,
        'lesson_status': this.lesson_status,
        'entry': this.entry,
        'lesson_mode': this.lesson_mode,
        'exit': this.exit,
        'session_time': this.session_time,
        'score': this.score
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMICore;
}(_common.BaseCMI);
/**
 * Class representing SCORM 1.2's cmi.objectives object
 * @extends CMIArray
 */


var CMIObjectives = /*#__PURE__*/function (_CMIArray) {
  _inherits(CMIObjectives, _CMIArray);

  var _super3 = _createSuper(CMIObjectives);

  /**
   * Constructor for cmi.objectives
   */
  function CMIObjectives() {
    _classCallCheck(this, CMIObjectives);

    return _super3.call(this, {
      children: scorm12_constants.objectives_children,
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
      errorClass: _exceptions.Scorm12ValidationError
    });
  }

  return CMIObjectives;
}(_common.CMIArray);
/**
 * Class representing SCORM 1.2's cmi.student_data object
 * @extends BaseCMI
 */


var _children4 = /*#__PURE__*/new WeakMap();

var _mastery_score = /*#__PURE__*/new WeakMap();

var _max_time_allowed = /*#__PURE__*/new WeakMap();

var _time_limit_action = /*#__PURE__*/new WeakMap();

var CMIStudentData = /*#__PURE__*/function (_BaseCMI3) {
  _inherits(CMIStudentData, _BaseCMI3);

  var _super4 = _createSuper(CMIStudentData);

  /**
   * Constructor for cmi.student_data
   * @param {string} student_data_children
   */
  function CMIStudentData(student_data_children) {
    var _this3;

    _classCallCheck(this, CMIStudentData);

    _this3 = _super4.call(this);

    _children4.set(_assertThisInitialized(_this3), {
      writable: true,
      value: void 0
    });

    _mastery_score.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _max_time_allowed.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _time_limit_action.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _classPrivateFieldSet(_assertThisInitialized(_this3), _children4, student_data_children ? student_data_children : scorm12_constants.student_data_children);

    return _this3;
  }
  /**
   * Getter for #_children
   * @return {*}
   * @private
   */


  _createClass(CMIStudentData, [{
    key: "_children",
    get: function get() {
      return _classPrivateFieldGet(this, _children4);
    }
    /**
     * Setter for #_children. Just throws an error.
     * @param {string} _children
     * @private
     */
    ,
    set: function set(_children) {
      throwInvalidValueError();
    }
    /**
     * Getter for #master_score
     * @return {string}
     */

  }, {
    key: "mastery_score",
    get: function get() {
      return _classPrivateFieldGet(this, _mastery_score);
    }
    /**
     * Setter for #master_score. Can only be called before  initialization.
     * @param {string} mastery_score
     */
    ,
    set: function set(mastery_score) {
      !this.initialized ? _classPrivateFieldSet(this, _mastery_score, mastery_score) : throwReadOnlyError();
    }
    /**
     * Getter for #max_time_allowed
     * @return {string}
     */

  }, {
    key: "max_time_allowed",
    get: function get() {
      return _classPrivateFieldGet(this, _max_time_allowed);
    }
    /**
     * Setter for #max_time_allowed. Can only be called before  initialization.
     * @param {string} max_time_allowed
     */
    ,
    set: function set(max_time_allowed) {
      !this.initialized ? _classPrivateFieldSet(this, _max_time_allowed, max_time_allowed) : throwReadOnlyError();
    }
    /**
     * Getter for #time_limit_action
     * @return {string}
     */

  }, {
    key: "time_limit_action",
    get: function get() {
      return _classPrivateFieldGet(this, _time_limit_action);
    }
    /**
     * Setter for #time_limit_action. Can only be called before  initialization.
     * @param {string} time_limit_action
     */
    ,
    set: function set(time_limit_action) {
      !this.initialized ? _classPrivateFieldSet(this, _time_limit_action, time_limit_action) : throwReadOnlyError();
    }
    /**
     * toJSON for cmi.student_data
     *
     * @return {
     *    {
     *      max_time_allowed: string,
     *      time_limit_action: string,
     *      mastery_score: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'mastery_score': this.mastery_score,
        'max_time_allowed': this.max_time_allowed,
        'time_limit_action': this.time_limit_action
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIStudentData;
}(_common.BaseCMI);
/**
 * Class representing SCORM 1.2's cmi.student_preference object
 * @extends BaseCMI
 */


exports.CMIStudentData = CMIStudentData;

var _children5 = /*#__PURE__*/new WeakMap();

var _audio = /*#__PURE__*/new WeakMap();

var _language = /*#__PURE__*/new WeakMap();

var _speed = /*#__PURE__*/new WeakMap();

var _text = /*#__PURE__*/new WeakMap();

var CMIStudentPreference = /*#__PURE__*/function (_BaseCMI4) {
  _inherits(CMIStudentPreference, _BaseCMI4);

  var _super5 = _createSuper(CMIStudentPreference);

  /**
   * Constructor for cmi.student_preference
   * @param {string} student_preference_children
   */
  function CMIStudentPreference(student_preference_children) {
    var _this4;

    _classCallCheck(this, CMIStudentPreference);

    _this4 = _super5.call(this);

    _children5.set(_assertThisInitialized(_this4), {
      writable: true,
      value: void 0
    });

    _audio.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _language.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _speed.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _text.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _classPrivateFieldSet(_assertThisInitialized(_this4), _children5, student_preference_children ? student_preference_children : scorm12_constants.student_preference_children);

    return _this4;
  }

  _createClass(CMIStudentPreference, [{
    key: "_children",
    get:
    /**
     * Getter for #_children
     * @return {string}
     * @private
     */
    function get() {
      return _classPrivateFieldGet(this, _children5);
    }
    /**
     * Setter for #_children. Just throws an error.
     * @param {string} _children
     * @private
     */
    ,
    set: function set(_children) {
      throwInvalidValueError();
    }
    /**
     * Getter for #audio
     * @return {string}
     */

  }, {
    key: "audio",
    get: function get() {
      return _classPrivateFieldGet(this, _audio);
    }
    /**
     * Setter for #audio
     * @param {string} audio
     */
    ,
    set: function set(audio) {
      if (check12ValidFormat(audio, scorm12_regex.CMISInteger) && check12ValidRange(audio, scorm12_regex.audio_range)) {
        _classPrivateFieldSet(this, _audio, audio);
      }
    }
    /**
     * Getter for #language
     * @return {string}
     */

  }, {
    key: "language",
    get: function get() {
      return _classPrivateFieldGet(this, _language);
    }
    /**
     * Setter for #language
     * @param {string} language
     */
    ,
    set: function set(language) {
      if (check12ValidFormat(language, scorm12_regex.CMIString256)) {
        _classPrivateFieldSet(this, _language, language);
      }
    }
    /**
     * Getter for #speed
     * @return {string}
     */

  }, {
    key: "speed",
    get: function get() {
      return _classPrivateFieldGet(this, _speed);
    }
    /**
     * Setter for #speed
     * @param {string} speed
     */
    ,
    set: function set(speed) {
      if (check12ValidFormat(speed, scorm12_regex.CMISInteger) && check12ValidRange(speed, scorm12_regex.speed_range)) {
        _classPrivateFieldSet(this, _speed, speed);
      }
    }
    /**
     * Getter for #text
     * @return {string}
     */

  }, {
    key: "text",
    get: function get() {
      return _classPrivateFieldGet(this, _text);
    }
    /**
     * Setter for #text
     * @param {string} text
     */
    ,
    set: function set(text) {
      if (check12ValidFormat(text, scorm12_regex.CMISInteger) && check12ValidRange(text, scorm12_regex.text_range)) {
        _classPrivateFieldSet(this, _text, text);
      }
    }
    /**
     * toJSON for cmi.student_preference
     *
     * @return {
     *    {
     *      audio: string,
     *      language: string,
     *      speed: string,
     *      text: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'audio': this.audio,
        'language': this.language,
        'speed': this.speed,
        'text': this.text
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIStudentPreference;
}(_common.BaseCMI);
/**
 * Class representing SCORM 1.2's cmi.interactions object
 * @extends BaseCMI
 */


exports.CMIStudentPreference = CMIStudentPreference;

var CMIInteractions = /*#__PURE__*/function (_CMIArray2) {
  _inherits(CMIInteractions, _CMIArray2);

  var _super6 = _createSuper(CMIInteractions);

  /**
   * Constructor for cmi.interactions
   */
  function CMIInteractions() {
    _classCallCheck(this, CMIInteractions);

    return _super6.call(this, {
      children: scorm12_constants.interactions_children,
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
      errorClass: _exceptions.Scorm12ValidationError
    });
  }

  return CMIInteractions;
}(_common.CMIArray);
/**
 * Class representing SCORM 1.2's cmi.interactions.n object
 * @extends BaseCMI
 */


var _id = /*#__PURE__*/new WeakMap();

var _time = /*#__PURE__*/new WeakMap();

var _type = /*#__PURE__*/new WeakMap();

var _weighting = /*#__PURE__*/new WeakMap();

var _student_response = /*#__PURE__*/new WeakMap();

var _result = /*#__PURE__*/new WeakMap();

var _latency = /*#__PURE__*/new WeakMap();

var CMIInteractionsObject = /*#__PURE__*/function (_BaseCMI5) {
  _inherits(CMIInteractionsObject, _BaseCMI5);

  var _super7 = _createSuper(CMIInteractionsObject);

  /**
   * Constructor for cmi.interactions.n object
   */
  function CMIInteractionsObject() {
    var _this5;

    _classCallCheck(this, CMIInteractionsObject);

    _this5 = _super7.call(this);

    _id.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _time.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _type.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _weighting.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _student_response.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _result.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _latency.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _this5.objectives = new _common.CMIArray({
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
      errorClass: _exceptions.Scorm12ValidationError,
      children: scorm12_constants.objectives_children
    });
    _this5.correct_responses = new _common.CMIArray({
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
      errorClass: _exceptions.Scorm12ValidationError,
      children: scorm12_constants.correct_responses_children
    });
    return _this5;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMIInteractionsObject, [{
    key: "initialize",
    value: function initialize() {
      var _this$objectives2, _this$correct_respons;

      _get(_getPrototypeOf(CMIInteractionsObject.prototype), "initialize", this).call(this);

      (_this$objectives2 = this.objectives) === null || _this$objectives2 === void 0 ? void 0 : _this$objectives2.initialize();
      (_this$correct_respons = this.correct_responses) === null || _this$correct_respons === void 0 ? void 0 : _this$correct_respons.initialize();
    }
  }, {
    key: "id",
    get:
    /**
     * Getter for #id. Should only be called during JSON export.
     * @return {*}
     */
    function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _id);
    }
    /**
     * Setter for #id
     * @param {string} id
     */
    ,
    set: function set(id) {
      if (check12ValidFormat(id, scorm12_regex.CMIIdentifier)) {
        _classPrivateFieldSet(this, _id, id);
      }
    }
    /**
     * Getter for #time. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "time",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _time);
    }
    /**
     * Setter for #time
     * @param {string} time
     */
    ,
    set: function set(time) {
      if (check12ValidFormat(time, scorm12_regex.CMITime)) {
        _classPrivateFieldSet(this, _time, time);
      }
    }
    /**
     * Getter for #type. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "type",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _type);
    }
    /**
     * Setter for #type
     * @param {string} type
     */
    ,
    set: function set(type) {
      if (check12ValidFormat(type, scorm12_regex.CMIType)) {
        _classPrivateFieldSet(this, _type, type);
      }
    }
    /**
     * Getter for #weighting. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "weighting",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _weighting);
    }
    /**
     * Setter for #weighting
     * @param {string} weighting
     */
    ,
    set: function set(weighting) {
      if (check12ValidFormat(weighting, scorm12_regex.CMIDecimal) && check12ValidRange(weighting, scorm12_regex.weighting_range)) {
        _classPrivateFieldSet(this, _weighting, weighting);
      }
    }
    /**
     * Getter for #student_response. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "student_response",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _student_response);
    }
    /**
     * Setter for #student_response
     * @param {string} student_response
     */
    ,
    set: function set(student_response) {
      if (check12ValidFormat(student_response, scorm12_regex.CMIFeedback, true)) {
        _classPrivateFieldSet(this, _student_response, student_response);
      }
    }
    /**
     * Getter for #result. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "result",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _result);
    }
    /**
     * Setter for #result
     * @param {string} result
     */
    ,
    set: function set(result) {
      if (check12ValidFormat(result, scorm12_regex.CMIResult)) {
        _classPrivateFieldSet(this, _result, result);
      }
    }
    /**
     * Getter for #latency. Should only be called during JSON export.
     * @return {*}
     */

  }, {
    key: "latency",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _latency);
    }
    /**
     * Setter for #latency
     * @param {string} latency
     */
    ,
    set: function set(latency) {
      if (check12ValidFormat(latency, scorm12_regex.CMITimespan)) {
        _classPrivateFieldSet(this, _latency, latency);
      }
    }
    /**
     * toJSON for cmi.interactions.n
     *
     * @return {
     *    {
     *      id: string,
     *      time: string,
     *      type: string,
     *      weighting: string,
     *      student_response: string,
     *      result: string,
     *      latency: string,
     *      objectives: CMIArray,
     *      correct_responses: CMIArray
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'id': this.id,
        'time': this.time,
        'type': this.type,
        'weighting': this.weighting,
        'student_response': this.student_response,
        'result': this.result,
        'latency': this.latency,
        'objectives': this.objectives,
        'correct_responses': this.correct_responses
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIInteractionsObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 1.2's cmi.objectives.n object
 * @extends BaseCMI
 */


exports.CMIInteractionsObject = CMIInteractionsObject;

var _id2 = /*#__PURE__*/new WeakMap();

var _status = /*#__PURE__*/new WeakMap();

var CMIObjectivesObject = /*#__PURE__*/function (_BaseCMI6) {
  _inherits(CMIObjectivesObject, _BaseCMI6);

  var _super8 = _createSuper(CMIObjectivesObject);

  /**
   * Constructor for cmi.objectives.n
   */
  function CMIObjectivesObject() {
    var _this6;

    _classCallCheck(this, CMIObjectivesObject);

    _this6 = _super8.call(this);

    _id2.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _status.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _this6.score = new _common.CMIScore({
      score_children: scorm12_constants.score_children,
      score_range: scorm12_regex.score_range,
      invalidErrorCode: scorm12_error_codes.INVALID_SET_VALUE,
      invalidTypeCode: scorm12_error_codes.TYPE_MISMATCH,
      invalidRangeCode: scorm12_error_codes.VALUE_OUT_OF_RANGE,
      errorClass: _exceptions.Scorm12ValidationError
    });
    return _this6;
  }

  _createClass(CMIObjectivesObject, [{
    key: "id",
    get:
    /**
     * Getter for #id
     * @return {""}
     */
    function get() {
      return _classPrivateFieldGet(this, _id2);
    }
    /**
     * Setter for #id
     * @param {string} id
     */
    ,
    set: function set(id) {
      if (check12ValidFormat(id, scorm12_regex.CMIIdentifier)) {
        _classPrivateFieldSet(this, _id2, id);
      }
    }
    /**
     * Getter for #status
     * @return {""}
     */

  }, {
    key: "status",
    get: function get() {
      return _classPrivateFieldGet(this, _status);
    }
    /**
     * Setter for #status
     * @param {string} status
     */
    ,
    set: function set(status) {
      if (check12ValidFormat(status, scorm12_regex.CMIStatus2)) {
        _classPrivateFieldSet(this, _status, status);
      }
    }
    /**
     * toJSON for cmi.objectives.n
     * @return {
     *    {
     *      id: string,
     *      status: string,
     *      score: CMIScore
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'id': this.id,
        'status': this.status,
        'score': this.score
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIObjectivesObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 1.2's cmi.interactions.n.objectives.n object
 * @extends BaseCMI
 */


exports.CMIObjectivesObject = CMIObjectivesObject;

var _id3 = /*#__PURE__*/new WeakMap();

var CMIInteractionsObjectivesObject = /*#__PURE__*/function (_BaseCMI7) {
  _inherits(CMIInteractionsObjectivesObject, _BaseCMI7);

  var _super9 = _createSuper(CMIInteractionsObjectivesObject);

  /**
   * Constructor for cmi.interactions.n.objectives.n
   */
  function CMIInteractionsObjectivesObject() {
    var _this7;

    _classCallCheck(this, CMIInteractionsObjectivesObject);

    _this7 = _super9.call(this);

    _id3.set(_assertThisInitialized(_this7), {
      writable: true,
      value: ''
    });

    return _this7;
  }

  _createClass(CMIInteractionsObjectivesObject, [{
    key: "id",
    get:
    /**
     * Getter for #id
     * @return {""}
     */
    function get() {
      return _classPrivateFieldGet(this, _id3);
    }
    /**
     * Setter for #id
     * @param {string} id
     */
    ,
    set: function set(id) {
      if (check12ValidFormat(id, scorm12_regex.CMIIdentifier)) {
        _classPrivateFieldSet(this, _id3, id);
      }
    }
    /**
     * toJSON for cmi.interactions.n.objectives.n
     * @return {
     *    {
     *      id: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'id': this.id
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIInteractionsObjectivesObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 1.2's cmi.interactions.correct_responses.n object
 * @extends BaseCMI
 */


exports.CMIInteractionsObjectivesObject = CMIInteractionsObjectivesObject;

var _pattern = /*#__PURE__*/new WeakMap();

var CMIInteractionsCorrectResponsesObject = /*#__PURE__*/function (_BaseCMI8) {
  _inherits(CMIInteractionsCorrectResponsesObject, _BaseCMI8);

  var _super10 = _createSuper(CMIInteractionsCorrectResponsesObject);

  /**
   * Constructor for cmi.interactions.correct_responses.n
   */
  function CMIInteractionsCorrectResponsesObject() {
    var _this8;

    _classCallCheck(this, CMIInteractionsCorrectResponsesObject);

    _this8 = _super10.call(this);

    _pattern.set(_assertThisInitialized(_this8), {
      writable: true,
      value: ''
    });

    return _this8;
  }

  _createClass(CMIInteractionsCorrectResponsesObject, [{
    key: "pattern",
    get:
    /**
     * Getter for #pattern
     * @return {string}
     */
    function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _pattern);
    }
    /**
     * Setter for #pattern
     * @param {string} pattern
     */
    ,
    set: function set(pattern) {
      if (check12ValidFormat(pattern, scorm12_regex.CMIFeedback, true)) {
        _classPrivateFieldSet(this, _pattern, pattern);
      }
    }
    /**
     * toJSON for cmi.interactions.correct_responses.n
     * @return {
     *    {
     *      pattern: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'pattern': this.pattern
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIInteractionsCorrectResponsesObject;
}(_common.BaseCMI);
/**
 * Class for AICC Navigation object
 */


exports.CMIInteractionsCorrectResponsesObject = CMIInteractionsCorrectResponsesObject;

var _event = /*#__PURE__*/new WeakMap();

var NAV = /*#__PURE__*/function (_BaseCMI9) {
  _inherits(NAV, _BaseCMI9);

  var _super11 = _createSuper(NAV);

  /**
   * Constructor for NAV object
   */
  function NAV() {
    var _this9;

    _classCallCheck(this, NAV);

    _this9 = _super11.call(this);

    _event.set(_assertThisInitialized(_this9), {
      writable: true,
      value: ''
    });

    return _this9;
  }

  _createClass(NAV, [{
    key: "event",
    get:
    /**
     * Getter for #event
     * @return {string}
     */
    function get() {
      return _classPrivateFieldGet(this, _event);
    }
    /**
     * Setter for #event
     * @param {string} event
     */
    ,
    set: function set(event) {
      if (check12ValidFormat(event, scorm12_regex.NAVEvent)) {
        _classPrivateFieldSet(this, _event, event);
      }
    }
    /**
     * toJSON for nav object
     * @return {
     *    {
     *      event: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'event': this.event
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return NAV;
}(_common.BaseCMI);

exports.NAV = NAV;

},{"../constants/api_constants":10,"../constants/error_codes":11,"../constants/regex":13,"../exceptions":15,"../utilities":17,"./common":7}],9:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ADL = exports.CMIInteractionsCorrectResponsesObject = exports.CMIInteractionsObjectivesObject = exports.CMICommentsObject = exports.CMIObjectivesObject = exports.CMIInteractionsObject = exports.CMI = void 0;

var _common = require("./common");

var _api_constants = _interopRequireDefault(require("../constants/api_constants"));

var _regex = _interopRequireDefault(require("../constants/regex"));

var _error_codes = _interopRequireDefault(require("../constants/error_codes"));

var _response_constants = _interopRequireDefault(require("../constants/response_constants"));

var _exceptions = require("../exceptions");

var Util = _interopRequireWildcard(require("../utilities"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var scorm2004_constants = _api_constants["default"].scorm2004;
var scorm2004_error_codes = _error_codes["default"].scorm2004;
var learner_responses = _response_constants["default"].learner;
var scorm2004_regex = _regex["default"].scorm2004;
/**
 * Helper method for throwing Read Only error
 */

function throwReadOnlyError() {
  throw new _exceptions.Scorm2004ValidationError(scorm2004_error_codes.READ_ONLY_ELEMENT);
}
/**
 * Helper method for throwing Write Only error
 */


function throwWriteOnlyError() {
  throw new _exceptions.Scorm2004ValidationError(scorm2004_error_codes.WRITE_ONLY_ELEMENT);
}
/**
 * Helper method for throwing Type Mismatch error
 */


function throwTypeMismatchError() {
  throw new _exceptions.Scorm2004ValidationError(scorm2004_error_codes.TYPE_MISMATCH);
}
/**
 * Helper method for throwing Dependency Not Established error
 */


function throwDependencyNotEstablishedError() {
  throw new _exceptions.Scorm2004ValidationError(scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED);
}
/**
 * Helper method for throwing Dependency Not Established error
 */


function throwGeneralSetError() {
  throw new _exceptions.Scorm2004ValidationError(scorm2004_error_codes.GENERAL_SET_FAILURE);
}
/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} regexPattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */


function check2004ValidFormat(value, regexPattern, allowEmptyString) {
  return (0, _common.checkValidFormat)(value, regexPattern, scorm2004_error_codes.TYPE_MISMATCH, _exceptions.Scorm2004ValidationError, allowEmptyString);
}
/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} rangePattern
 * @return {boolean}
 */


function check2004ValidRange(value, rangePattern) {
  return (0, _common.checkValidRange)(value, rangePattern, scorm2004_error_codes.VALUE_OUT_OF_RANGE, _exceptions.Scorm2004ValidationError);
}
/**
 * Class representing cmi object for SCORM 2004
 */


var _version2 = /*#__PURE__*/new WeakMap();

var _children2 = /*#__PURE__*/new WeakMap();

var _completion_status = /*#__PURE__*/new WeakMap();

var _completion_threshold = /*#__PURE__*/new WeakMap();

var _credit = /*#__PURE__*/new WeakMap();

var _entry = /*#__PURE__*/new WeakMap();

var _exit = /*#__PURE__*/new WeakMap();

var _launch_data = /*#__PURE__*/new WeakMap();

var _learner_id = /*#__PURE__*/new WeakMap();

var _learner_name = /*#__PURE__*/new WeakMap();

var _location = /*#__PURE__*/new WeakMap();

var _max_time_allowed = /*#__PURE__*/new WeakMap();

var _mode = /*#__PURE__*/new WeakMap();

var _progress_measure = /*#__PURE__*/new WeakMap();

var _scaled_passing_score = /*#__PURE__*/new WeakMap();

var _session_time = /*#__PURE__*/new WeakMap();

var _success_status = /*#__PURE__*/new WeakMap();

var _suspend_data = /*#__PURE__*/new WeakMap();

var _time_limit_action = /*#__PURE__*/new WeakMap();

var _total_time = /*#__PURE__*/new WeakMap();

var CMI = /*#__PURE__*/function (_BaseCMI) {
  _inherits(CMI, _BaseCMI);

  var _super = _createSuper(CMI);

  /**
   * Constructor for the SCORM 2004 cmi object
   * @param {boolean} initialized
   */
  function CMI(initialized) {
    var _this;

    _classCallCheck(this, CMI);

    _this = _super.call(this);

    _version2.set(_assertThisInitialized(_this), {
      writable: true,
      value: '1.0'
    });

    _children2.set(_assertThisInitialized(_this), {
      writable: true,
      value: scorm2004_constants.cmi_children
    });

    _completion_status.set(_assertThisInitialized(_this), {
      writable: true,
      value: 'unknown'
    });

    _completion_threshold.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _credit.set(_assertThisInitialized(_this), {
      writable: true,
      value: 'credit'
    });

    _entry.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _exit.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _launch_data.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _learner_id.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _learner_name.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _location.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _max_time_allowed.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _mode.set(_assertThisInitialized(_this), {
      writable: true,
      value: 'normal'
    });

    _progress_measure.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _scaled_passing_score.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _session_time.set(_assertThisInitialized(_this), {
      writable: true,
      value: 'PT0H0M0S'
    });

    _success_status.set(_assertThisInitialized(_this), {
      writable: true,
      value: 'unknown'
    });

    _suspend_data.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _time_limit_action.set(_assertThisInitialized(_this), {
      writable: true,
      value: 'continue,no message'
    });

    _total_time.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _this.learner_preference = new CMILearnerPreference();
    _this.score = new Scorm2004CMIScore();
    _this.comments_from_learner = new CMICommentsFromLearner();
    _this.comments_from_lms = new CMICommentsFromLMS();
    _this.interactions = new CMIInteractions();
    _this.objectives = new CMIObjectives();
    if (initialized) _this.initialize();
    return _this;
  }

  _createClass(CMI, [{
    key: "initialize",
    value:
    /**
     * Called when the API has been initialized after the CMI has been created
     */
    function initialize() {
      var _this$learner_prefere, _this$score, _this$comments_from_l, _this$comments_from_l2, _this$interactions, _this$objectives;

      _get(_getPrototypeOf(CMI.prototype), "initialize", this).call(this);

      (_this$learner_prefere = this.learner_preference) === null || _this$learner_prefere === void 0 ? void 0 : _this$learner_prefere.initialize();
      (_this$score = this.score) === null || _this$score === void 0 ? void 0 : _this$score.initialize();
      (_this$comments_from_l = this.comments_from_learner) === null || _this$comments_from_l === void 0 ? void 0 : _this$comments_from_l.initialize();
      (_this$comments_from_l2 = this.comments_from_lms) === null || _this$comments_from_l2 === void 0 ? void 0 : _this$comments_from_l2.initialize();
      (_this$interactions = this.interactions) === null || _this$interactions === void 0 ? void 0 : _this$interactions.initialize();
      (_this$objectives = this.objectives) === null || _this$objectives === void 0 ? void 0 : _this$objectives.initialize();
    }
    /**
     * Getter for #_version
     * @return {string}
     * @private
     */

  }, {
    key: "_version",
    get: function get() {
      return _classPrivateFieldGet(this, _version2);
    }
    /**
     * Setter for #_version. Just throws an error.
     * @param {string} _version
     * @private
     */
    ,
    set: function set(_version) {
      throwReadOnlyError();
    }
    /**
     * Getter for #_children
     * @return {string}
     * @private
     */

  }, {
    key: "_children",
    get: function get() {
      return _classPrivateFieldGet(this, _children2);
    }
    /**
     * Setter for #_children. Just throws an error.
     * @param {number} _children
     * @private
     */
    ,
    set: function set(_children) {
      throwReadOnlyError();
    }
    /**
     * Getter for #completion_status
     * @return {string}
     */

  }, {
    key: "completion_status",
    get: function get() {
      return _classPrivateFieldGet(this, _completion_status);
    }
    /**
     * Setter for #completion_status
     * @param {string} completion_status
     */
    ,
    set: function set(completion_status) {
      if (check2004ValidFormat(completion_status, scorm2004_regex.CMICStatus)) {
        _classPrivateFieldSet(this, _completion_status, completion_status);
      }
    }
    /**
     * Getter for #completion_threshold
     * @return {string}
     */

  }, {
    key: "completion_threshold",
    get: function get() {
      return _classPrivateFieldGet(this, _completion_threshold);
    }
    /**
     * Setter for #completion_threshold. Can only be called before  initialization.
     * @param {string} completion_threshold
     */
    ,
    set: function set(completion_threshold) {
      !this.initialized ? _classPrivateFieldSet(this, _completion_threshold, completion_threshold) : throwReadOnlyError();
    }
    /**
     * Setter for #credit
     * @return {string}
     */

  }, {
    key: "credit",
    get: function get() {
      return _classPrivateFieldGet(this, _credit);
    }
    /**
     * Setter for #credit. Can only be called before  initialization.
     * @param {string} credit
     */
    ,
    set: function set(credit) {
      !this.initialized ? _classPrivateFieldSet(this, _credit, credit) : throwReadOnlyError();
    }
    /**
     * Getter for #entry
     * @return {string}
     */

  }, {
    key: "entry",
    get: function get() {
      return _classPrivateFieldGet(this, _entry);
    }
    /**
     * Setter for #entry. Can only be called before  initialization.
     * @param {string} entry
     */
    ,
    set: function set(entry) {
      !this.initialized ? _classPrivateFieldSet(this, _entry, entry) : throwReadOnlyError();
    }
    /**
     * Getter for #exit. Should only be called during JSON export.
     * @return {string}
     */

  }, {
    key: "exit",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _exit);
    }
    /**
     * Getter for #exit
     * @param {string} exit
     */
    ,
    set: function set(exit) {
      if (check2004ValidFormat(exit, scorm2004_regex.CMIExit, true)) {
        _classPrivateFieldSet(this, _exit, exit);
      }
    }
    /**
     * Getter for #launch_data
     * @return {string}
     */

  }, {
    key: "launch_data",
    get: function get() {
      return _classPrivateFieldGet(this, _launch_data);
    }
    /**
     * Setter for #launch_data. Can only be called before  initialization.
     * @param {string} launch_data
     */
    ,
    set: function set(launch_data) {
      !this.initialized ? _classPrivateFieldSet(this, _launch_data, launch_data) : throwReadOnlyError();
    }
    /**
     * Getter for #learner_id
     * @return {string}
     */

  }, {
    key: "learner_id",
    get: function get() {
      return _classPrivateFieldGet(this, _learner_id);
    }
    /**
     * Setter for #learner_id. Can only be called before  initialization.
     * @param {string} learner_id
     */
    ,
    set: function set(learner_id) {
      !this.initialized ? _classPrivateFieldSet(this, _learner_id, learner_id) : throwReadOnlyError();
    }
    /**
     * Getter for #learner_name
     * @return {string}
     */

  }, {
    key: "learner_name",
    get: function get() {
      return _classPrivateFieldGet(this, _learner_name);
    }
    /**
     * Setter for #learner_name. Can only be called before  initialization.
     * @param {string} learner_name
     */
    ,
    set: function set(learner_name) {
      !this.initialized ? _classPrivateFieldSet(this, _learner_name, learner_name) : throwReadOnlyError();
    }
    /**
     * Getter for #location
     * @return {string}
     */

  }, {
    key: "location",
    get: function get() {
      return _classPrivateFieldGet(this, _location);
    }
    /**
     * Setter for #location
     * @param {string} location
     */
    ,
    set: function set(location) {
      if (check2004ValidFormat(location, scorm2004_regex.CMIString1000)) {
        _classPrivateFieldSet(this, _location, location);
      }
    }
    /**
     * Getter for #max_time_allowed
     * @return {string}
     */

  }, {
    key: "max_time_allowed",
    get: function get() {
      return _classPrivateFieldGet(this, _max_time_allowed);
    }
    /**
     * Setter for #max_time_allowed. Can only be called before  initialization.
     * @param {string} max_time_allowed
     */
    ,
    set: function set(max_time_allowed) {
      !this.initialized ? _classPrivateFieldSet(this, _max_time_allowed, max_time_allowed) : throwReadOnlyError();
    }
    /**
     * Getter for #mode
     * @return {string}
     */

  }, {
    key: "mode",
    get: function get() {
      return _classPrivateFieldGet(this, _mode);
    }
    /**
     * Setter for #mode. Can only be called before  initialization.
     * @param {string} mode
     */
    ,
    set: function set(mode) {
      !this.initialized ? _classPrivateFieldSet(this, _mode, mode) : throwReadOnlyError();
    }
    /**
     * Getter for #progress_measure
     * @return {string}
     */

  }, {
    key: "progress_measure",
    get: function get() {
      return _classPrivateFieldGet(this, _progress_measure);
    }
    /**
     * Setter for #progress_measure
     * @param {string} progress_measure
     */
    ,
    set: function set(progress_measure) {
      if (check2004ValidFormat(progress_measure, scorm2004_regex.CMIDecimal) && check2004ValidRange(progress_measure, scorm2004_regex.progress_range)) {
        _classPrivateFieldSet(this, _progress_measure, progress_measure);
      }
    }
    /**
     * Getter for #scaled_passing_score
     * @return {string}
     */

  }, {
    key: "scaled_passing_score",
    get: function get() {
      return _classPrivateFieldGet(this, _scaled_passing_score);
    }
    /**
     * Setter for #scaled_passing_score. Can only be called before  initialization.
     * @param {string} scaled_passing_score
     */
    ,
    set: function set(scaled_passing_score) {
      !this.initialized ? _classPrivateFieldSet(this, _scaled_passing_score, scaled_passing_score) : throwReadOnlyError();
    }
    /**
     * Getter for #session_time. Should only be called during JSON export.
     * @return {string}
     */

  }, {
    key: "session_time",
    get: function get() {
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _session_time);
    }
    /**
     * Setter for #session_time
     * @param {string} session_time
     */
    ,
    set: function set(session_time) {
      if (check2004ValidFormat(session_time, scorm2004_regex.CMITimespan)) {
        _classPrivateFieldSet(this, _session_time, session_time);
      }
    }
    /**
     * Getter for #success_status
     * @return {string}
     */

  }, {
    key: "success_status",
    get: function get() {
      return _classPrivateFieldGet(this, _success_status);
    }
    /**
     * Setter for #success_status
     * @param {string} success_status
     */
    ,
    set: function set(success_status) {
      if (check2004ValidFormat(success_status, scorm2004_regex.CMISStatus)) {
        _classPrivateFieldSet(this, _success_status, success_status);
      }
    }
    /**
     * Getter for #suspend_data
     * @return {string}
     */

  }, {
    key: "suspend_data",
    get: function get() {
      return _classPrivateFieldGet(this, _suspend_data);
    }
    /**
     * Setter for #suspend_data
     * @param {string} suspend_data
     */
    ,
    set: function set(suspend_data) {
      if (check2004ValidFormat(suspend_data, scorm2004_regex.CMIString64000, true)) {
        _classPrivateFieldSet(this, _suspend_data, suspend_data);
      }
    }
    /**
     * Getter for #time_limit_action
     * @return {string}
     */

  }, {
    key: "time_limit_action",
    get: function get() {
      return _classPrivateFieldGet(this, _time_limit_action);
    }
    /**
     * Setter for #time_limit_action. Can only be called before  initialization.
     * @param {string} time_limit_action
     */
    ,
    set: function set(time_limit_action) {
      !this.initialized ? _classPrivateFieldSet(this, _time_limit_action, time_limit_action) : throwReadOnlyError();
    }
    /**
     * Getter for #total_time
     * @return {string}
     */

  }, {
    key: "total_time",
    get: function get() {
      return _classPrivateFieldGet(this, _total_time);
    }
    /**
     * Setter for #total_time. Can only be called before  initialization.
     * @param {string} total_time
     */
    ,
    set: function set(total_time) {
      !this.initialized ? _classPrivateFieldSet(this, _total_time, total_time) : throwReadOnlyError();
    }
    /**
     * Adds the current session time to the existing total time.
     *
     * @return {string} ISO8601 Duration
     */

  }, {
    key: "getCurrentTotalTime",
    value: function getCurrentTotalTime() {
      var sessionTime = _classPrivateFieldGet(this, _session_time);

      var startTime = this.start_time;

      if (typeof startTime !== 'undefined' && startTime !== null) {
        var seconds = new Date().getTime() - startTime;
        sessionTime = Util.getSecondsAsISODuration(seconds / 1000);
      }

      return Util.addTwoDurations(_classPrivateFieldGet(this, _total_time), sessionTime, scorm2004_regex.CMITimespan);
    }
    /**
     * toJSON for cmi
     *
     * @return {
     *    {
     *      comments_from_learner: CMICommentsFromLearner,
     *      comments_from_lms: CMICommentsFromLMS,
     *      completion_status: string,
     *      completion_threshold: string,
     *      credit: string,
     *      entry: string,
     *      exit: string,
     *      interactions: CMIInteractions,
     *      launch_data: string,
     *      learner_id: string,
     *      learner_name: string,
     *      learner_preference: CMILearnerPreference,
     *      location: string,
     *      max_time_allowed: string,
     *      mode: string,
     *      objectives: CMIObjectives,
     *      progress_measure: string,
     *      scaled_passing_score: string,
     *      score: Scorm2004CMIScore,
     *      session_time: string,
     *      success_status: string,
     *      suspend_data: string,
     *      time_limit_action: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'comments_from_learner': this.comments_from_learner,
        'comments_from_lms': this.comments_from_lms,
        'completion_status': this.completion_status,
        'completion_threshold': this.completion_threshold,
        'credit': this.credit,
        'entry': this.entry,
        'exit': this.exit,
        'interactions': this.interactions,
        'launch_data': this.launch_data,
        'learner_id': this.learner_id,
        'learner_name': this.learner_name,
        'learner_preference': this.learner_preference,
        'location': this.location,
        'max_time_allowed': this.max_time_allowed,
        'mode': this.mode,
        'objectives': this.objectives,
        'progress_measure': this.progress_measure,
        'scaled_passing_score': this.scaled_passing_score,
        'score': this.score,
        'session_time': this.session_time,
        'success_status': this.success_status,
        'suspend_data': this.suspend_data,
        'time_limit_action': this.time_limit_action
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMI;
}(_common.BaseCMI);
/**
 * Class for SCORM 2004's cmi.learner_preference object
 */


exports.CMI = CMI;

var _children3 = /*#__PURE__*/new WeakMap();

var _audio_level = /*#__PURE__*/new WeakMap();

var _language = /*#__PURE__*/new WeakMap();

var _delivery_speed = /*#__PURE__*/new WeakMap();

var _audio_captioning = /*#__PURE__*/new WeakMap();

var CMILearnerPreference = /*#__PURE__*/function (_BaseCMI2) {
  _inherits(CMILearnerPreference, _BaseCMI2);

  var _super2 = _createSuper(CMILearnerPreference);

  /**
   * Constructor for cmi.learner_preference
   */
  function CMILearnerPreference() {
    var _this2;

    _classCallCheck(this, CMILearnerPreference);

    _this2 = _super2.call(this);

    _children3.set(_assertThisInitialized(_this2), {
      writable: true,
      value: scorm2004_constants.student_preference_children
    });

    _audio_level.set(_assertThisInitialized(_this2), {
      writable: true,
      value: '1'
    });

    _language.set(_assertThisInitialized(_this2), {
      writable: true,
      value: ''
    });

    _delivery_speed.set(_assertThisInitialized(_this2), {
      writable: true,
      value: '1'
    });

    _audio_captioning.set(_assertThisInitialized(_this2), {
      writable: true,
      value: '0'
    });

    return _this2;
  }
  /**
   * Getter for #_children
   * @return {string}
   * @private
   */


  _createClass(CMILearnerPreference, [{
    key: "_children",
    get: function get() {
      return _classPrivateFieldGet(this, _children3);
    }
    /**
     * Setter for #_children. Just throws an error.
     * @param {string} _children
     * @private
     */
    ,
    set: function set(_children) {
      throwReadOnlyError();
    }
    /**
     * Getter for #audio_level
     * @return {string}
     */

  }, {
    key: "audio_level",
    get: function get() {
      return _classPrivateFieldGet(this, _audio_level);
    }
    /**
     * Setter for #audio_level
     * @param {string} audio_level
     */
    ,
    set: function set(audio_level) {
      if (check2004ValidFormat(audio_level, scorm2004_regex.CMIDecimal) && check2004ValidRange(audio_level, scorm2004_regex.audio_range)) {
        _classPrivateFieldSet(this, _audio_level, audio_level);
      }
    }
    /**
     * Getter for #language
     * @return {string}
     */

  }, {
    key: "language",
    get: function get() {
      return _classPrivateFieldGet(this, _language);
    }
    /**
     * Setter for #language
     * @param {string} language
     */
    ,
    set: function set(language) {
      if (check2004ValidFormat(language, scorm2004_regex.CMILang)) {
        _classPrivateFieldSet(this, _language, language);
      }
    }
    /**
     * Getter for #delivery_speed
     * @return {string}
     */

  }, {
    key: "delivery_speed",
    get: function get() {
      return _classPrivateFieldGet(this, _delivery_speed);
    }
    /**
     * Setter for #delivery_speed
     * @param {string} delivery_speed
     */
    ,
    set: function set(delivery_speed) {
      if (check2004ValidFormat(delivery_speed, scorm2004_regex.CMIDecimal) && check2004ValidRange(delivery_speed, scorm2004_regex.speed_range)) {
        _classPrivateFieldSet(this, _delivery_speed, delivery_speed);
      }
    }
    /**
     * Getter for #audio_captioning
     * @return {string}
     */

  }, {
    key: "audio_captioning",
    get: function get() {
      return _classPrivateFieldGet(this, _audio_captioning);
    }
    /**
     * Setter for #audio_captioning
     * @param {string} audio_captioning
     */
    ,
    set: function set(audio_captioning) {
      if (check2004ValidFormat(audio_captioning, scorm2004_regex.CMISInteger) && check2004ValidRange(audio_captioning, scorm2004_regex.text_range)) {
        _classPrivateFieldSet(this, _audio_captioning, audio_captioning);
      }
    }
    /**
     * toJSON for cmi.learner_preference
     *
     * @return {
     *    {
     *      audio_level: string,
     *      language: string,
     *      delivery_speed: string,
     *      audio_captioning: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'audio_level': this.audio_level,
        'language': this.language,
        'delivery_speed': this.delivery_speed,
        'audio_captioning': this.audio_captioning
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMILearnerPreference;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's cmi.interactions object
 */


var CMIInteractions = /*#__PURE__*/function (_CMIArray) {
  _inherits(CMIInteractions, _CMIArray);

  var _super3 = _createSuper(CMIInteractions);

  /**
   * Constructor for cmi.objectives Array
   */
  function CMIInteractions() {
    _classCallCheck(this, CMIInteractions);

    return _super3.call(this, {
      children: scorm2004_constants.interactions_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      errorClass: _exceptions.Scorm2004ValidationError
    });
  }

  return CMIInteractions;
}(_common.CMIArray);
/**
 * Class representing SCORM 2004's cmi.objectives object
 */


var CMIObjectives = /*#__PURE__*/function (_CMIArray2) {
  _inherits(CMIObjectives, _CMIArray2);

  var _super4 = _createSuper(CMIObjectives);

  /**
   * Constructor for cmi.objectives Array
   */
  function CMIObjectives() {
    _classCallCheck(this, CMIObjectives);

    return _super4.call(this, {
      children: scorm2004_constants.objectives_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      errorClass: _exceptions.Scorm2004ValidationError
    });
  }

  return CMIObjectives;
}(_common.CMIArray);
/**
 * Class representing SCORM 2004's cmi.comments_from_lms object
 */


var CMICommentsFromLMS = /*#__PURE__*/function (_CMIArray3) {
  _inherits(CMICommentsFromLMS, _CMIArray3);

  var _super5 = _createSuper(CMICommentsFromLMS);

  /**
   * Constructor for cmi.comments_from_lms Array
   */
  function CMICommentsFromLMS() {
    _classCallCheck(this, CMICommentsFromLMS);

    return _super5.call(this, {
      children: scorm2004_constants.comments_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      errorClass: _exceptions.Scorm2004ValidationError
    });
  }

  return CMICommentsFromLMS;
}(_common.CMIArray);
/**
 * Class representing SCORM 2004's cmi.comments_from_learner object
 */


var CMICommentsFromLearner = /*#__PURE__*/function (_CMIArray4) {
  _inherits(CMICommentsFromLearner, _CMIArray4);

  var _super6 = _createSuper(CMICommentsFromLearner);

  /**
   * Constructor for cmi.comments_from_learner Array
   */
  function CMICommentsFromLearner() {
    _classCallCheck(this, CMICommentsFromLearner);

    return _super6.call(this, {
      children: scorm2004_constants.comments_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      errorClass: _exceptions.Scorm2004ValidationError
    });
  }

  return CMICommentsFromLearner;
}(_common.CMIArray);
/**
 * Class for SCORM 2004's cmi.interaction.n object
 */


var _id = /*#__PURE__*/new WeakMap();

var _type = /*#__PURE__*/new WeakMap();

var _timestamp = /*#__PURE__*/new WeakMap();

var _weighting = /*#__PURE__*/new WeakMap();

var _learner_response = /*#__PURE__*/new WeakMap();

var _result = /*#__PURE__*/new WeakMap();

var _latency = /*#__PURE__*/new WeakMap();

var _description = /*#__PURE__*/new WeakMap();

var CMIInteractionsObject = /*#__PURE__*/function (_BaseCMI3) {
  _inherits(CMIInteractionsObject, _BaseCMI3);

  var _super7 = _createSuper(CMIInteractionsObject);

  /**
   * Constructor for cmi.interaction.n
   */
  function CMIInteractionsObject() {
    var _this3;

    _classCallCheck(this, CMIInteractionsObject);

    _this3 = _super7.call(this);

    _id.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _type.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _timestamp.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _weighting.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _learner_response.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _result.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _latency.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _description.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _this3.objectives = new _common.CMIArray({
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      errorClass: _exceptions.Scorm2004ValidationError,
      children: scorm2004_constants.objectives_children
    });
    _this3.correct_responses = new _common.CMIArray({
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      errorClass: _exceptions.Scorm2004ValidationError,
      children: scorm2004_constants.correct_responses_children
    });
    return _this3;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMIInteractionsObject, [{
    key: "initialize",
    value: function initialize() {
      var _this$objectives2, _this$correct_respons;

      _get(_getPrototypeOf(CMIInteractionsObject.prototype), "initialize", this).call(this);

      (_this$objectives2 = this.objectives) === null || _this$objectives2 === void 0 ? void 0 : _this$objectives2.initialize();
      (_this$correct_respons = this.correct_responses) === null || _this$correct_respons === void 0 ? void 0 : _this$correct_respons.initialize();
    }
    /**
     * Getter for #id
     * @return {string}
     */

  }, {
    key: "id",
    get: function get() {
      return _classPrivateFieldGet(this, _id);
    }
    /**
     * Setter for #id
     * @param {string} id
     */
    ,
    set: function set(id) {
      if (check2004ValidFormat(id, scorm2004_regex.CMILongIdentifier)) {
        _classPrivateFieldSet(this, _id, id);
      }
    }
    /**
     * Getter for #type
     * @return {string}
     */

  }, {
    key: "type",
    get: function get() {
      return _classPrivateFieldGet(this, _type);
    }
    /**
     * Setter for #type
     * @param {string} type
     */
    ,
    set: function set(type) {
      if (this.initialized && _classPrivateFieldGet(this, _id) === '') {
        throwDependencyNotEstablishedError();
      } else {
        if (check2004ValidFormat(type, scorm2004_regex.CMIType)) {
          _classPrivateFieldSet(this, _type, type);
        }
      }
    }
    /**
     * Getter for #timestamp
     * @return {string}
     */

  }, {
    key: "timestamp",
    get: function get() {
      return _classPrivateFieldGet(this, _timestamp);
    }
    /**
     * Setter for #timestamp
     * @param {string} timestamp
     */
    ,
    set: function set(timestamp) {
      if (this.initialized && _classPrivateFieldGet(this, _id) === '') {
        throwDependencyNotEstablishedError();
      } else {
        if (check2004ValidFormat(timestamp, scorm2004_regex.CMITime)) {
          _classPrivateFieldSet(this, _timestamp, timestamp);
        }
      }
    }
    /**
     * Getter for #weighting
     * @return {string}
     */

  }, {
    key: "weighting",
    get: function get() {
      return _classPrivateFieldGet(this, _weighting);
    }
    /**
     * Setter for #weighting
     * @param {string} weighting
     */
    ,
    set: function set(weighting) {
      if (this.initialized && _classPrivateFieldGet(this, _id) === '') {
        throwDependencyNotEstablishedError();
      } else {
        if (check2004ValidFormat(weighting, scorm2004_regex.CMIDecimal)) {
          _classPrivateFieldSet(this, _weighting, weighting);
        }
      }
    }
    /**
     * Getter for #learner_response
     * @return {string}
     */

  }, {
    key: "learner_response",
    get: function get() {
      return _classPrivateFieldGet(this, _learner_response);
    }
    /**
     * Setter for #learner_response. Does type validation to make sure response
     * matches SCORM 2004's spec
     * @param {string} learner_response
     */
    ,
    set: function set(learner_response) {
      if (this.initialized && (_classPrivateFieldGet(this, _type) === '' || _classPrivateFieldGet(this, _id) === '')) {
        throwDependencyNotEstablishedError();
      } else {
        var nodes = [];
        var response_type = learner_responses[this.type];

        if (response_type) {
          if (response_type !== null && response_type !== void 0 && response_type.delimiter) {
            nodes = learner_response.split(response_type.delimiter);
          } else {
            nodes[0] = learner_response;
          }

          if (nodes.length > 0 && nodes.length <= response_type.max) {
            var formatRegex = new RegExp(response_type.format);

            for (var i = 0; i < nodes.length; i++) {
              if (response_type !== null && response_type !== void 0 && response_type.delimiter2) {
                var values = nodes[i].split(response_type.delimiter2);

                if (values.length === 2) {
                  if (!values[0].match(formatRegex)) {
                    throwTypeMismatchError();
                  } else {
                    if (!values[1].match(new RegExp(response_type.format2))) {
                      throwTypeMismatchError();
                    }
                  }
                } else {
                  throwTypeMismatchError();
                }
              } else {
                if (!nodes[i].match(formatRegex)) {
                  throwTypeMismatchError();
                } else {
                  if (nodes[i] !== '' && response_type.unique) {
                    for (var j = 0; j < i; j++) {
                      if (nodes[i] === nodes[j]) {
                        throwTypeMismatchError();
                      }
                    }
                  }
                }
              }
            }
          } else {
            throwGeneralSetError();
          }

          _classPrivateFieldSet(this, _learner_response, learner_response);
        } else {
          throwTypeMismatchError();
        }
      }
    }
    /**
     * Getter for #result
     * @return {string}
     */

  }, {
    key: "result",
    get: function get() {
      return _classPrivateFieldGet(this, _result);
    }
    /**
     * Setter for #result
     * @param {string} result
     */
    ,
    set: function set(result) {
      if (check2004ValidFormat(result, scorm2004_regex.CMIResult)) {
        _classPrivateFieldSet(this, _result, result);
      }
    }
    /**
     * Getter for #latency
     * @return {string}
     */

  }, {
    key: "latency",
    get: function get() {
      return _classPrivateFieldGet(this, _latency);
    }
    /**
     * Setter for #latency
     * @param {string} latency
     */
    ,
    set: function set(latency) {
      if (this.initialized && _classPrivateFieldGet(this, _id) === '') {
        throwDependencyNotEstablishedError();
      } else {
        if (check2004ValidFormat(latency, scorm2004_regex.CMITimespan)) {
          _classPrivateFieldSet(this, _latency, latency);
        }
      }
    }
    /**
     * Getter for #description
     * @return {string}
     */

  }, {
    key: "description",
    get: function get() {
      return _classPrivateFieldGet(this, _description);
    }
    /**
     * Setter for #description
     * @param {string} description
     */
    ,
    set: function set(description) {
      if (this.initialized && _classPrivateFieldGet(this, _id) === '') {
        throwDependencyNotEstablishedError();
      } else {
        if (check2004ValidFormat(description, scorm2004_regex.CMILangString250, true)) {
          _classPrivateFieldSet(this, _description, description);
        }
      }
    }
    /**
     * toJSON for cmi.interactions.n
     *
     * @return {
     *    {
     *      id: string,
     *      type: string,
     *      objectives: CMIArray,
     *      timestamp: string,
     *      correct_responses: CMIArray,
     *      weighting: string,
     *      learner_response: string,
     *      result: string,
     *      latency: string,
     *      description: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'id': this.id,
        'type': this.type,
        'objectives': this.objectives,
        'timestamp': this.timestamp,
        'weighting': this.weighting,
        'learner_response': this.learner_response,
        'result': this.result,
        'latency': this.latency,
        'description': this.description,
        'correct_responses': this.correct_responses
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIInteractionsObject;
}(_common.BaseCMI);
/**
 * Class for SCORM 2004's cmi.objectives.n object
 */


exports.CMIInteractionsObject = CMIInteractionsObject;

var _id2 = /*#__PURE__*/new WeakMap();

var _success_status2 = /*#__PURE__*/new WeakMap();

var _completion_status2 = /*#__PURE__*/new WeakMap();

var _progress_measure2 = /*#__PURE__*/new WeakMap();

var _description2 = /*#__PURE__*/new WeakMap();

var CMIObjectivesObject = /*#__PURE__*/function (_BaseCMI4) {
  _inherits(CMIObjectivesObject, _BaseCMI4);

  var _super8 = _createSuper(CMIObjectivesObject);

  /**
   * Constructor for cmi.objectives.n
   */
  function CMIObjectivesObject() {
    var _this4;

    _classCallCheck(this, CMIObjectivesObject);

    _this4 = _super8.call(this);

    _id2.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _success_status2.set(_assertThisInitialized(_this4), {
      writable: true,
      value: 'unknown'
    });

    _completion_status2.set(_assertThisInitialized(_this4), {
      writable: true,
      value: 'unknown'
    });

    _progress_measure2.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _description2.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _this4.score = new Scorm2004CMIScore();
    return _this4;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMIObjectivesObject, [{
    key: "initialize",
    value: function initialize() {
      var _this$score2;

      _get(_getPrototypeOf(CMIObjectivesObject.prototype), "initialize", this).call(this);

      (_this$score2 = this.score) === null || _this$score2 === void 0 ? void 0 : _this$score2.initialize();
    }
    /**
     * Getter for #id
     * @return {string}
     */

  }, {
    key: "id",
    get: function get() {
      return _classPrivateFieldGet(this, _id2);
    }
    /**
     * Setter for #id
     * @param {string} id
     */
    ,
    set: function set(id) {
      if (check2004ValidFormat(id, scorm2004_regex.CMILongIdentifier)) {
        _classPrivateFieldSet(this, _id2, id);
      }
    }
    /**
     * Getter for #success_status
     * @return {string}
     */

  }, {
    key: "success_status",
    get: function get() {
      return _classPrivateFieldGet(this, _success_status2);
    }
    /**
     * Setter for #success_status
     * @param {string} success_status
     */
    ,
    set: function set(success_status) {
      if (this.initialized && _classPrivateFieldGet(this, _id2) === '') {
        throwDependencyNotEstablishedError();
      } else {
        if (check2004ValidFormat(success_status, scorm2004_regex.CMISStatus)) {
          _classPrivateFieldSet(this, _success_status2, success_status);
        }
      }
    }
    /**
     * Getter for #completion_status
     * @return {string}
     */

  }, {
    key: "completion_status",
    get: function get() {
      return _classPrivateFieldGet(this, _completion_status2);
    }
    /**
     * Setter for #completion_status
     * @param {string} completion_status
     */
    ,
    set: function set(completion_status) {
      if (this.initialized && _classPrivateFieldGet(this, _id2) === '') {
        throwDependencyNotEstablishedError();
      } else {
        if (check2004ValidFormat(completion_status, scorm2004_regex.CMICStatus)) {
          _classPrivateFieldSet(this, _completion_status2, completion_status);
        }
      }
    }
    /**
     * Getter for #progress_measure
     * @return {string}
     */

  }, {
    key: "progress_measure",
    get: function get() {
      return _classPrivateFieldGet(this, _progress_measure2);
    }
    /**
     * Setter for #progress_measure
     * @param {string} progress_measure
     */
    ,
    set: function set(progress_measure) {
      if (this.initialized && _classPrivateFieldGet(this, _id2) === '') {
        throwDependencyNotEstablishedError();
      } else {
        if (check2004ValidFormat(progress_measure, scorm2004_regex.CMIDecimal) && check2004ValidRange(progress_measure, scorm2004_regex.progress_range)) {
          _classPrivateFieldSet(this, _progress_measure2, progress_measure);
        }
      }
    }
    /**
     * Getter for #description
     * @return {string}
     */

  }, {
    key: "description",
    get: function get() {
      return _classPrivateFieldGet(this, _description2);
    }
    /**
     * Setter for #description
     * @param {string} description
     */
    ,
    set: function set(description) {
      if (this.initialized && _classPrivateFieldGet(this, _id2) === '') {
        throwDependencyNotEstablishedError();
      } else {
        if (check2004ValidFormat(description, scorm2004_regex.CMILangString250, true)) {
          _classPrivateFieldSet(this, _description2, description);
        }
      }
    }
    /**
     * toJSON for cmi.objectives.n
     *
     * @return {
     *    {
     *      id: string,
     *      success_status: string,
     *      completion_status: string,
     *      progress_measure: string,
     *      description: string,
     *      score: Scorm2004CMIScore
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'id': this.id,
        'success_status': this.success_status,
        'completion_status': this.completion_status,
        'progress_measure': this.progress_measure,
        'description': this.description,
        'score': this.score
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIObjectivesObject;
}(_common.BaseCMI);
/**
 * Class for SCORM 2004's cmi *.score object
 */


exports.CMIObjectivesObject = CMIObjectivesObject;

var _scaled = /*#__PURE__*/new WeakMap();

var Scorm2004CMIScore = /*#__PURE__*/function (_CMIScore) {
  _inherits(Scorm2004CMIScore, _CMIScore);

  var _super9 = _createSuper(Scorm2004CMIScore);

  /**
   * Constructor for cmi *.score
   */
  function Scorm2004CMIScore() {
    var _this5;

    _classCallCheck(this, Scorm2004CMIScore);

    _this5 = _super9.call(this, {
      score_children: scorm2004_constants.score_children,
      max: '',
      invalidErrorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      invalidTypeCode: scorm2004_error_codes.TYPE_MISMATCH,
      invalidRangeCode: scorm2004_error_codes.VALUE_OUT_OF_RANGE,
      decimalRegex: scorm2004_regex.CMIDecimal,
      errorClass: _exceptions.Scorm2004ValidationError
    });

    _scaled.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    return _this5;
  }
  /**
   * Getter for #scaled
   * @return {string}
   */


  _createClass(Scorm2004CMIScore, [{
    key: "scaled",
    get: function get() {
      return _classPrivateFieldGet(this, _scaled);
    }
    /**
     * Setter for #scaled
     * @param {string} scaled
     */
    ,
    set: function set(scaled) {
      if (check2004ValidFormat(scaled, scorm2004_regex.CMIDecimal) && check2004ValidRange(scaled, scorm2004_regex.scaled_range)) {
        _classPrivateFieldSet(this, _scaled, scaled);
      }
    }
    /**
     * toJSON for cmi *.score
     *
     * @return {
     *    {
     *      scaled: string,
     *      raw: string,
     *      min: string,
     *      max: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'scaled': this.scaled,
        'raw': _get(_getPrototypeOf(Scorm2004CMIScore.prototype), "raw", this),
        'min': _get(_getPrototypeOf(Scorm2004CMIScore.prototype), "min", this),
        'max': _get(_getPrototypeOf(Scorm2004CMIScore.prototype), "max", this)
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return Scorm2004CMIScore;
}(_common.CMIScore);
/**
 * Class representing SCORM 2004's cmi.comments_from_learner.n and cmi.comments_from_lms.n object
 */


var _comment = /*#__PURE__*/new WeakMap();

var _location2 = /*#__PURE__*/new WeakMap();

var _timestamp2 = /*#__PURE__*/new WeakMap();

var _readOnlyAfterInit = /*#__PURE__*/new WeakMap();

var CMICommentsObject = /*#__PURE__*/function (_BaseCMI5) {
  _inherits(CMICommentsObject, _BaseCMI5);

  var _super10 = _createSuper(CMICommentsObject);

  /**
   * Constructor for cmi.comments_from_learner.n and cmi.comments_from_lms.n
   * @param {boolean} readOnlyAfterInit
   */
  function CMICommentsObject() {
    var _this6;

    var readOnlyAfterInit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    _classCallCheck(this, CMICommentsObject);

    _this6 = _super10.call(this);

    _comment.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _location2.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _timestamp2.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _readOnlyAfterInit.set(_assertThisInitialized(_this6), {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(_assertThisInitialized(_this6), _comment, '');

    _classPrivateFieldSet(_assertThisInitialized(_this6), _location2, '');

    _classPrivateFieldSet(_assertThisInitialized(_this6), _timestamp2, '');

    _classPrivateFieldSet(_assertThisInitialized(_this6), _readOnlyAfterInit, readOnlyAfterInit);

    return _this6;
  }
  /**
   * Getter for #comment
   * @return {string}
   */


  _createClass(CMICommentsObject, [{
    key: "comment",
    get: function get() {
      return _classPrivateFieldGet(this, _comment);
    }
    /**
     * Setter for #comment
     * @param {string} comment
     */
    ,
    set: function set(comment) {
      if (this.initialized && _classPrivateFieldGet(this, _readOnlyAfterInit)) {
        throwReadOnlyError();
      } else {
        if (check2004ValidFormat(comment, scorm2004_regex.CMILangString4000, true)) {
          _classPrivateFieldSet(this, _comment, comment);
        }
      }
    }
    /**
     * Getter for #location
     * @return {string}
     */

  }, {
    key: "location",
    get: function get() {
      return _classPrivateFieldGet(this, _location2);
    }
    /**
     * Setter for #location
     * @param {string} location
     */
    ,
    set: function set(location) {
      if (this.initialized && _classPrivateFieldGet(this, _readOnlyAfterInit)) {
        throwReadOnlyError();
      } else {
        if (check2004ValidFormat(location, scorm2004_regex.CMIString250)) {
          _classPrivateFieldSet(this, _location2, location);
        }
      }
    }
    /**
     * Getter for #timestamp
     * @return {string}
     */

  }, {
    key: "timestamp",
    get: function get() {
      return _classPrivateFieldGet(this, _timestamp2);
    }
    /**
     * Setter for #timestamp
     * @param {string} timestamp
     */
    ,
    set: function set(timestamp) {
      if (this.initialized && _classPrivateFieldGet(this, _readOnlyAfterInit)) {
        throwReadOnlyError();
      } else {
        if (check2004ValidFormat(timestamp, scorm2004_regex.CMITime)) {
          _classPrivateFieldSet(this, _timestamp2, timestamp);
        }
      }
    }
    /**
     * toJSON for cmi.comments_from_learner.n object
     * @return {
     *    {
     *      comment: string,
     *      location: string,
     *      timestamp: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'comment': this.comment,
        'location': this.location,
        'timestamp': this.timestamp
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMICommentsObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's cmi.interactions.n.objectives.n object
 */


exports.CMICommentsObject = CMICommentsObject;

var _id3 = /*#__PURE__*/new WeakMap();

var CMIInteractionsObjectivesObject = /*#__PURE__*/function (_BaseCMI6) {
  _inherits(CMIInteractionsObjectivesObject, _BaseCMI6);

  var _super11 = _createSuper(CMIInteractionsObjectivesObject);

  /**
   * Constructor for cmi.interactions.n.objectives.n
   */
  function CMIInteractionsObjectivesObject() {
    var _this7;

    _classCallCheck(this, CMIInteractionsObjectivesObject);

    _this7 = _super11.call(this);

    _id3.set(_assertThisInitialized(_this7), {
      writable: true,
      value: ''
    });

    return _this7;
  }
  /**
   * Getter for #id
   * @return {string}
   */


  _createClass(CMIInteractionsObjectivesObject, [{
    key: "id",
    get: function get() {
      return _classPrivateFieldGet(this, _id3);
    }
    /**
     * Setter for #id
     * @param {string} id
     */
    ,
    set: function set(id) {
      if (check2004ValidFormat(id, scorm2004_regex.CMILongIdentifier)) {
        _classPrivateFieldSet(this, _id3, id);
      }
    }
    /**
     * toJSON for cmi.interactions.n.objectives.n
     * @return {
     *    {
     *      id: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'id': this.id
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIInteractionsObjectivesObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's cmi.interactions.n.correct_responses.n object
 */


exports.CMIInteractionsObjectivesObject = CMIInteractionsObjectivesObject;

var _pattern = /*#__PURE__*/new WeakMap();

var CMIInteractionsCorrectResponsesObject = /*#__PURE__*/function (_BaseCMI7) {
  _inherits(CMIInteractionsCorrectResponsesObject, _BaseCMI7);

  var _super12 = _createSuper(CMIInteractionsCorrectResponsesObject);

  /**
   * Constructor for cmi.interactions.n.correct_responses.n
   */
  function CMIInteractionsCorrectResponsesObject() {
    var _this8;

    _classCallCheck(this, CMIInteractionsCorrectResponsesObject);

    _this8 = _super12.call(this);

    _pattern.set(_assertThisInitialized(_this8), {
      writable: true,
      value: ''
    });

    return _this8;
  }
  /**
   * Getter for #pattern
   * @return {string}
   */


  _createClass(CMIInteractionsCorrectResponsesObject, [{
    key: "pattern",
    get: function get() {
      return _classPrivateFieldGet(this, _pattern);
    }
    /**
     * Setter for #pattern
     * @param {string} pattern
     */
    ,
    set: function set(pattern) {
      if (check2004ValidFormat(pattern, scorm2004_regex.CMIFeedback)) {
        _classPrivateFieldSet(this, _pattern, pattern);
      }
    }
    /**
     * toJSON cmi.interactions.n.correct_responses.n object
     * @return {
     *    {
     *      pattern: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'pattern': this.pattern
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return CMIInteractionsCorrectResponsesObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's adl object
 */


exports.CMIInteractionsCorrectResponsesObject = CMIInteractionsCorrectResponsesObject;

var ADL = /*#__PURE__*/function (_BaseCMI8) {
  _inherits(ADL, _BaseCMI8);

  var _super13 = _createSuper(ADL);

  /**
   * Constructor for adl
   */
  function ADL() {
    var _this9;

    _classCallCheck(this, ADL);

    _this9 = _super13.call(this);
    _this9.nav = new ADLNav();
    return _this9;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(ADL, [{
    key: "initialize",
    value: function initialize() {
      var _this$nav;

      _get(_getPrototypeOf(ADL.prototype), "initialize", this).call(this);

      (_this$nav = this.nav) === null || _this$nav === void 0 ? void 0 : _this$nav.initialize();
    }
    /**
     * toJSON for adl
     * @return {
     *    {
     *      nav: {
     *        request: string
     *      }
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'nav': this.nav
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return ADL;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's adl.nav object
 */


exports.ADL = ADL;

var _request = /*#__PURE__*/new WeakMap();

var ADLNav = /*#__PURE__*/function (_BaseCMI9) {
  _inherits(ADLNav, _BaseCMI9);

  var _super14 = _createSuper(ADLNav);

  /**
   * Constructor for adl.nav
   */
  function ADLNav() {
    var _this10;

    _classCallCheck(this, ADLNav);

    _this10 = _super14.call(this);

    _request.set(_assertThisInitialized(_this10), {
      writable: true,
      value: '_none_'
    });

    _this10.request_valid = new ADLNavRequestValid();
    return _this10;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(ADLNav, [{
    key: "initialize",
    value: function initialize() {
      var _this$request_valid;

      _get(_getPrototypeOf(ADLNav.prototype), "initialize", this).call(this);

      (_this$request_valid = this.request_valid) === null || _this$request_valid === void 0 ? void 0 : _this$request_valid.initialize();
    }
    /**
     * Getter for #request
     * @return {string}
     */

  }, {
    key: "request",
    get: function get() {
      return _classPrivateFieldGet(this, _request);
    }
    /**
     * Setter for #request
     * @param {string} request
     */
    ,
    set: function set(request) {
      if (check2004ValidFormat(request, scorm2004_regex.NAVEvent)) {
        _classPrivateFieldSet(this, _request, request);
      }
    }
    /**
     * toJSON for adl.nav
     *
     * @return {
     *    {
     *      request: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'request': this.request
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return ADLNav;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's adl.nav.request_valid object
 */


var _continue = /*#__PURE__*/new WeakMap();

var _previous = /*#__PURE__*/new WeakMap();

var ADLNavRequestValid = /*#__PURE__*/function (_BaseCMI10) {
  _inherits(ADLNavRequestValid, _BaseCMI10);

  var _super15 = _createSuper(ADLNavRequestValid);

  /**
   * Constructor for adl.nav.request_valid
   */
  function ADLNavRequestValid() {
    var _this11;

    _classCallCheck(this, ADLNavRequestValid);

    _this11 = _super15.call(this);

    _continue.set(_assertThisInitialized(_this11), {
      writable: true,
      value: 'unknown'
    });

    _previous.set(_assertThisInitialized(_this11), {
      writable: true,
      value: 'unknown'
    });

    _defineProperty(_assertThisInitialized(_this11), "choice", /*#__PURE__*/function () {
      function _class2() {
        _classCallCheck(this, _class2);

        _defineProperty(this, "_isTargetValid", function (_target) {
          return 'unknown';
        });
      }

      return _class2;
    }());

    _defineProperty(_assertThisInitialized(_this11), "jump", /*#__PURE__*/function () {
      function _class4() {
        _classCallCheck(this, _class4);

        _defineProperty(this, "_isTargetValid", function (_target) {
          return 'unknown';
        });
      }

      return _class4;
    }());

    return _this11;
  }
  /**
   * Getter for #continue
   * @return {string}
   */


  _createClass(ADLNavRequestValid, [{
    key: "continue",
    get: function get() {
      return _classPrivateFieldGet(this, _continue);
    }
    /**
     * Setter for #continue. Just throws an error.
     * @param {*} _
     */
    ,
    set: function set(_) {
      throwReadOnlyError();
    }
    /**
     * Getter for #previous
     * @return {string}
     */

  }, {
    key: "previous",
    get: function get() {
      return _classPrivateFieldGet(this, _previous);
    }
    /**
     * Setter for #previous. Just throws an error.
     * @param {*} _
     */
    ,
    set: function set(_) {
      throwReadOnlyError();
    }
    /**
     * toJSON for adl.nav.request_valid
     *
     * @return {
     *    {
     *      previous: string,
     *      continue: string
     *    }
     *  }
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'previous': this.previous,
        'continue': this["continue"]
      };
      delete this.jsonString;
      return result;
    }
  }]);

  return ADLNavRequestValid;
}(_common.BaseCMI);

},{"../constants/api_constants":10,"../constants/error_codes":11,"../constants/regex":13,"../constants/response_constants":14,"../exceptions":15,"../utilities":17,"./common":7}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var global = {
  SCORM_TRUE: 'true',
  SCORM_FALSE: 'false',
  STATE_NOT_INITIALIZED: 0,
  STATE_INITIALIZED: 1,
  STATE_TERMINATED: 2,
  LOG_LEVEL_DEBUG: 1,
  LOG_LEVEL_INFO: 2,
  LOG_LEVEL_WARNING: 3,
  LOG_LEVEL_ERROR: 4,
  LOG_LEVEL_NONE: 5
};
var scorm12 = {
  // Children lists
  cmi_children: 'core,suspend_data,launch_data,comments,objectives,student_data,student_preference,interactions',
  core_children: 'student_id,student_name,lesson_location,credit,lesson_status,entry,score,total_time,lesson_mode,exit,session_time',
  score_children: 'raw,min,max',
  comments_children: 'content,location,time',
  objectives_children: 'id,score,status',
  correct_responses_children: 'pattern',
  student_data_children: 'mastery_score,max_time_allowed,time_limit_action',
  student_preference_children: 'audio,language,speed,text',
  interactions_children: 'id,objectives,time,type,correct_responses,weighting,student_response,result,latency',
  error_descriptions: {
    '101': {
      basicMessage: 'General Exception',
      detailMessage: 'No specific error code exists to describe the error. Use LMSGetDiagnostic for more information'
    },
    '201': {
      basicMessage: 'Invalid argument error',
      detailMessage: 'Indicates that an argument represents an invalid data model element or is otherwise incorrect.'
    },
    '202': {
      basicMessage: 'Element cannot have children',
      detailMessage: 'Indicates that LMSGetValue was called with a data model element name that ends in "_children" for a data model element that does not support the "_children" suffix.'
    },
    '203': {
      basicMessage: 'Element not an array - cannot have count',
      detailMessage: 'Indicates that LMSGetValue was called with a data model element name that ends in "_count" for a data model element that does not support the "_count" suffix.'
    },
    '301': {
      basicMessage: 'Not initialized',
      detailMessage: 'Indicates that an API call was made before the call to lmsInitialize.'
    },
    '401': {
      basicMessage: 'Not implemented error',
      detailMessage: 'The data model element indicated in a call to LMSGetValue or LMSSetValue is valid, but was not implemented by this LMS. SCORM 1.2 defines a set of data model elements as being optional for an LMS to implement.'
    },
    '402': {
      basicMessage: 'Invalid set value, element is a keyword',
      detailMessage: 'Indicates that LMSSetValue was called on a data model element that represents a keyword (elements that end in "_children" and "_count").'
    },
    '403': {
      basicMessage: 'Element is read only',
      detailMessage: 'LMSSetValue was called with a data model element that can only be read.'
    },
    '404': {
      basicMessage: 'Element is write only',
      detailMessage: 'LMSGetValue was called on a data model element that can only be written to.'
    },
    '405': {
      basicMessage: 'Incorrect Data Type',
      detailMessage: 'LMSSetValue was called with a value that is not consistent with the data format of the supplied data model element.'
    },
    '407': {
      basicMessage: 'Element Value Out Of Range',
      detailMessage: 'The numeric value supplied to a LMSSetValue call is outside of the numeric range allowed for the supplied data model element.'
    },
    '408': {
      basicMessage: 'Data Model Dependency Not Established',
      detailMessage: 'Some data model elements cannot be set until another data model element was set. This error condition indicates that the prerequisite element was not set before the dependent element.'
    }
  }
};

var aicc = _objectSpread(_objectSpread({}, scorm12), {
  cmi_children: 'core,suspend_data,launch_data,comments,objectives,student_data,student_preference,interactions,evaluation',
  student_preference_children: 'audio,language,lesson_type,speed,text,text_color,text_location,text_size,video,windows',
  student_data_children: 'attempt_number,tries,mastery_score,max_time_allowed,time_limit_action',
  student_demographics_children: 'city,class,company,country,experience,familiar_name,instructor_name,title,native_language,state,street_address,telephone,years_experience',
  tries_children: 'time,status,score',
  attempt_records_children: 'score,lesson_status',
  paths_children: 'location_id,date,time,status,why_left,time_in_element'
});

var scorm2004 = {
  // Children lists
  cmi_children: '_version,comments_from_learner,comments_from_lms,completion_status,credit,entry,exit,interactions,launch_data,learner_id,learner_name,learner_preference,location,max_time_allowed,mode,objectives,progress_measure,scaled_passing_score,score,session_time,success_status,suspend_data,time_limit_action,total_time',
  comments_children: 'comment,timestamp,location',
  score_children: 'max,raw,scaled,min',
  objectives_children: 'progress_measure,completion_status,success_status,description,score,id',
  correct_responses_children: 'pattern',
  student_data_children: 'mastery_score,max_time_allowed,time_limit_action',
  student_preference_children: 'audio_level,audio_captioning,delivery_speed,language',
  interactions_children: 'id,type,objectives,timestamp,correct_responses,weighting,learner_response,result,latency,description',
  error_descriptions: {
    '0': {
      basicMessage: 'No Error',
      detailMessage: 'No error occurred, the previous API call was successful.'
    },
    '101': {
      basicMessage: 'General Exception',
      detailMessage: 'No specific error code exists to describe the error. Use GetDiagnostic for more information.'
    },
    '102': {
      basicMessage: 'General Initialization Failure',
      detailMessage: 'Call to Initialize failed for an unknown reason.'
    },
    '103': {
      basicMessage: 'Already Initialized',
      detailMessage: 'Call to Initialize failed because Initialize was already called.'
    },
    '104': {
      basicMessage: 'Content Instance Terminated',
      detailMessage: 'Call to Initialize failed because Terminate was already called.'
    },
    '111': {
      basicMessage: 'General Termination Failure',
      detailMessage: 'Call to Terminate failed for an unknown reason.'
    },
    '112': {
      basicMessage: 'Termination Before Initialization',
      detailMessage: 'Call to Terminate failed because it was made before the call to Initialize.'
    },
    '113': {
      basicMessage: 'Termination After Termination',
      detailMessage: 'Call to Terminate failed because Terminate was already called.'
    },
    '122': {
      basicMessage: 'Retrieve Data Before Initialization',
      detailMessage: 'Call to GetValue failed because it was made before the call to Initialize.'
    },
    '123': {
      basicMessage: 'Retrieve Data After Termination',
      detailMessage: 'Call to GetValue failed because it was made after the call to Terminate.'
    },
    '132': {
      basicMessage: 'Store Data Before Initialization',
      detailMessage: 'Call to SetValue failed because it was made before the call to Initialize.'
    },
    '133': {
      basicMessage: 'Store Data After Termination',
      detailMessage: 'Call to SetValue failed because it was made after the call to Terminate.'
    },
    '142': {
      basicMessage: 'Commit Before Initialization',
      detailMessage: 'Call to Commit failed because it was made before the call to Initialize.'
    },
    '143': {
      basicMessage: 'Commit After Termination',
      detailMessage: 'Call to Commit failed because it was made after the call to Terminate.'
    },
    '201': {
      basicMessage: 'General Argument Error',
      detailMessage: 'An invalid argument was passed to an API method (usually indicates that Initialize, Commit or Terminate did not receive the expected empty string argument.'
    },
    '301': {
      basicMessage: 'General Get Failure',
      detailMessage: 'Indicates a failed GetValue call where no other specific error code is applicable. Use GetDiagnostic for more information.'
    },
    '351': {
      basicMessage: 'General Set Failure',
      detailMessage: 'Indicates a failed SetValue call where no other specific error code is applicable. Use GetDiagnostic for more information.'
    },
    '391': {
      basicMessage: 'General Commit Failure',
      detailMessage: 'Indicates a failed Commit call where no other specific error code is applicable. Use GetDiagnostic for more information.'
    },
    '401': {
      basicMessage: 'Undefined Data Model Element',
      detailMessage: 'The data model element name passed to GetValue or SetValue is not a valid SCORM data model element.'
    },
    '402': {
      basicMessage: 'Unimplemented Data Model Element',
      detailMessage: 'The data model element indicated in a call to GetValue or SetValue is valid, but was not implemented by this LMS. In SCORM 2004, this error would indicate an LMS that is not fully SCORM conformant.'
    },
    '403': {
      basicMessage: 'Data Model Element Value Not Initialized',
      detailMessage: 'Attempt to read a data model element that has not been initialized by the LMS or through a SetValue call. This error condition is often reached during normal execution of a SCO.'
    },
    '404': {
      basicMessage: 'Data Model Element Is Read Only',
      detailMessage: 'SetValue was called with a data model element that can only be read.'
    },
    '405': {
      basicMessage: 'Data Model Element Is Write Only',
      detailMessage: 'GetValue was called on a data model element that can only be written to.'
    },
    '406': {
      basicMessage: 'Data Model Element Type Mismatch',
      detailMessage: 'SetValue was called with a value that is not consistent with the data format of the supplied data model element.'
    },
    '407': {
      basicMessage: 'Data Model Element Value Out Of Range',
      detailMessage: 'The numeric value supplied to a SetValue call is outside of the numeric range allowed for the supplied data model element.'
    },
    '408': {
      basicMessage: 'Data Model Dependency Not Established',
      detailMessage: 'Some data model elements cannot be set until another data model element was set. This error condition indicates that the prerequisite element was not set before the dependent element.'
    }
  }
};
var APIConstants = {
  global: global,
  scorm12: scorm12,
  aicc: aicc,
  scorm2004: scorm2004
};
var _default = APIConstants;
exports["default"] = _default;

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var global = {
  GENERAL: 101,
  INITIALIZATION_FAILED: 101,
  INITIALIZED: 101,
  TERMINATED: 101,
  TERMINATION_FAILURE: 101,
  TERMINATION_BEFORE_INIT: 101,
  MULTIPLE_TERMINATION: 101,
  RETRIEVE_BEFORE_INIT: 101,
  RETRIEVE_AFTER_TERM: 101,
  STORE_BEFORE_INIT: 101,
  STORE_AFTER_TERM: 101,
  COMMIT_BEFORE_INIT: 101,
  COMMIT_AFTER_TERM: 101,
  ARGUMENT_ERROR: 101,
  CHILDREN_ERROR: 101,
  COUNT_ERROR: 101,
  GENERAL_GET_FAILURE: 101,
  GENERAL_SET_FAILURE: 101,
  GENERAL_COMMIT_FAILURE: 101,
  UNDEFINED_DATA_MODEL: 101,
  UNIMPLEMENTED_ELEMENT: 101,
  VALUE_NOT_INITIALIZED: 101,
  INVALID_SET_VALUE: 101,
  READ_ONLY_ELEMENT: 101,
  WRITE_ONLY_ELEMENT: 101,
  TYPE_MISMATCH: 101,
  VALUE_OUT_OF_RANGE: 101,
  DEPENDENCY_NOT_ESTABLISHED: 101
};

var scorm12 = _objectSpread(_objectSpread({}, global), {
  RETRIEVE_BEFORE_INIT: 301,
  STORE_BEFORE_INIT: 301,
  COMMIT_BEFORE_INIT: 301,
  ARGUMENT_ERROR: 201,
  CHILDREN_ERROR: 202,
  COUNT_ERROR: 203,
  UNDEFINED_DATA_MODEL: 401,
  UNIMPLEMENTED_ELEMENT: 401,
  VALUE_NOT_INITIALIZED: 301,
  INVALID_SET_VALUE: 402,
  READ_ONLY_ELEMENT: 403,
  WRITE_ONLY_ELEMENT: 404,
  TYPE_MISMATCH: 405,
  VALUE_OUT_OF_RANGE: 407,
  DEPENDENCY_NOT_ESTABLISHED: 408
});

var scorm2004 = _objectSpread(_objectSpread({}, global), {
  INITIALIZATION_FAILED: 102,
  INITIALIZED: 103,
  TERMINATED: 104,
  TERMINATION_FAILURE: 111,
  TERMINATION_BEFORE_INIT: 112,
  MULTIPLE_TERMINATIONS: 113,
  RETRIEVE_BEFORE_INIT: 122,
  RETRIEVE_AFTER_TERM: 123,
  STORE_BEFORE_INIT: 132,
  STORE_AFTER_TERM: 133,
  COMMIT_BEFORE_INIT: 142,
  COMMIT_AFTER_TERM: 143,
  ARGUMENT_ERROR: 201,
  GENERAL_GET_FAILURE: 301,
  GENERAL_SET_FAILURE: 351,
  GENERAL_COMMIT_FAILURE: 391,
  UNDEFINED_DATA_MODEL: 401,
  UNIMPLEMENTED_ELEMENT: 402,
  VALUE_NOT_INITIALIZED: 403,
  READ_ONLY_ELEMENT: 404,
  WRITE_ONLY_ELEMENT: 405,
  TYPE_MISMATCH: 406,
  VALUE_OUT_OF_RANGE: 407,
  DEPENDENCY_NOT_ESTABLISHED: 408
});

var ErrorCodes = {
  scorm12: scorm12,
  scorm2004: scorm2004
};
var _default = ErrorCodes;
exports["default"] = _default;

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var ValidLanguages = {
  'aa': 'aa',
  'ab': 'ab',
  'ae': 'ae',
  'af': 'af',
  'ak': 'ak',
  'am': 'am',
  'an': 'an',
  'ar': 'ar',
  'as': 'as',
  'av': 'av',
  'ay': 'ay',
  'az': 'az',
  'ba': 'ba',
  'be': 'be',
  'bg': 'bg',
  'bh': 'bh',
  'bi': 'bi',
  'bm': 'bm',
  'bn': 'bn',
  'bo': 'bo',
  'br': 'br',
  'bs': 'bs',
  'ca': 'ca',
  'ce': 'ce',
  'ch': 'ch',
  'co': 'co',
  'cr': 'cr',
  'cs': 'cs',
  'cu': 'cu',
  'cv': 'cv',
  'cy': 'cy',
  'da': 'da',
  'de': 'de',
  'dv': 'dv',
  'dz': 'dz',
  'ee': 'ee',
  'el': 'el',
  'en': 'en',
  'eo': 'eo',
  'es': 'es',
  'et': 'et',
  'eu': 'eu',
  'fa': 'fa',
  'ff': 'ff',
  'fi': 'fi',
  'fj': 'fj',
  'fo': 'fo',
  'fr': 'fr',
  'fy': 'fy',
  'ga': 'ga',
  'gd': 'gd',
  'gl': 'gl',
  'gn': 'gn',
  'gu': 'gu',
  'gv': 'gv',
  'ha': 'ha',
  'he': 'he',
  'hi': 'hi',
  'ho': 'ho',
  'hr': 'hr',
  'ht': 'ht',
  'hu': 'hu',
  'hy': 'hy',
  'hz': 'hz',
  'ia': 'ia',
  'id': 'id',
  'ie': 'ie',
  'ig': 'ig',
  'ii': 'ii',
  'ik': 'ik',
  'io': 'io',
  'is': 'is',
  'it': 'it',
  'iu': 'iu',
  'ja': 'ja',
  'jv': 'jv',
  'ka': 'ka',
  'kg': 'kg',
  'ki': 'ki',
  'kj': 'kj',
  'kk': 'kk',
  'kl': 'kl',
  'km': 'km',
  'kn': 'kn',
  'ko': 'ko',
  'kr': 'kr',
  'ks': 'ks',
  'ku': 'ku',
  'kv': 'kv',
  'kw': 'kw',
  'ky': 'ky',
  'la': 'la',
  'lb': 'lb',
  'lg': 'lg',
  'li': 'li',
  'ln': 'ln',
  'lo': 'lo',
  'lt': 'lt',
  'lu': 'lu',
  'lv': 'lv',
  'mg': 'mg',
  'mh': 'mh',
  'mi': 'mi',
  'mk': 'mk',
  'ml': 'ml',
  'mn': 'mn',
  'mo': 'mo',
  'mr': 'mr',
  'ms': 'ms',
  'mt': 'mt',
  'my': 'my',
  'na': 'na',
  'nb': 'nb',
  'nd': 'nd',
  'ne': 'ne',
  'ng': 'ng',
  'nl': 'nl',
  'nn': 'nn',
  'no': 'no',
  'nr': 'nr',
  'nv': 'nv',
  'ny': 'ny',
  'oc': 'oc',
  'oj': 'oj',
  'om': 'om',
  'or': 'or',
  'os': 'os',
  'pa': 'pa',
  'pi': 'pi',
  'pl': 'pl',
  'ps': 'ps',
  'pt': 'pt',
  'qu': 'qu',
  'rm': 'rm',
  'rn': 'rn',
  'ro': 'ro',
  'ru': 'ru',
  'rw': 'rw',
  'sa': 'sa',
  'sc': 'sc',
  'sd': 'sd',
  'se': 'se',
  'sg': 'sg',
  'sh': 'sh',
  'si': 'si',
  'sk': 'sk',
  'sl': 'sl',
  'sm': 'sm',
  'sn': 'sn',
  'so': 'so',
  'sq': 'sq',
  'sr': 'sr',
  'ss': 'ss',
  'st': 'st',
  'su': 'su',
  'sv': 'sv',
  'sw': 'sw',
  'ta': 'ta',
  'te': 'te',
  'tg': 'tg',
  'th': 'th',
  'ti': 'ti',
  'tk': 'tk',
  'tl': 'tl',
  'tn': 'tn',
  'to': 'to',
  'tr': 'tr',
  'ts': 'ts',
  'tt': 'tt',
  'tw': 'tw',
  'ty': 'ty',
  'ug': 'ug',
  'uk': 'uk',
  'ur': 'ur',
  'uz': 'uz',
  've': 've',
  'vi': 'vi',
  'vo': 'vo',
  'wa': 'wa',
  'wo': 'wo',
  'xh': 'xh',
  'yi': 'yi',
  'yo': 'yo',
  'za': 'za',
  'zh': 'zh',
  'zu': 'zu',
  'aar': 'aar',
  'abk': 'abk',
  'ave': 'ave',
  'afr': 'afr',
  'aka': 'aka',
  'amh': 'amh',
  'arg': 'arg',
  'ara': 'ara',
  'asm': 'asm',
  'ava': 'ava',
  'aym': 'aym',
  'aze': 'aze',
  'bak': 'bak',
  'bel': 'bel',
  'bul': 'bul',
  'bih': 'bih',
  'bis': 'bis',
  'bam': 'bam',
  'ben': 'ben',
  'tib': 'tib',
  'bod': 'bod',
  'bre': 'bre',
  'bos': 'bos',
  'cat': 'cat',
  'che': 'che',
  'cha': 'cha',
  'cos': 'cos',
  'cre': 'cre',
  'cze': 'cze',
  'ces': 'ces',
  'chu': 'chu',
  'chv': 'chv',
  'wel': 'wel',
  'cym': 'cym',
  'dan': 'dan',
  'ger': 'ger',
  'deu': 'deu',
  'div': 'div',
  'dzo': 'dzo',
  'ewe': 'ewe',
  'gre': 'gre',
  'ell': 'ell',
  'eng': 'eng',
  'epo': 'epo',
  'spa': 'spa',
  'est': 'est',
  'baq': 'baq',
  'eus': 'eus',
  'per': 'per',
  'fas': 'fas',
  'ful': 'ful',
  'fin': 'fin',
  'fij': 'fij',
  'fao': 'fao',
  'fre': 'fre',
  'fra': 'fra',
  'fry': 'fry',
  'gle': 'gle',
  'gla': 'gla',
  'glg': 'glg',
  'grn': 'grn',
  'guj': 'guj',
  'glv': 'glv',
  'hau': 'hau',
  'heb': 'heb',
  'hin': 'hin',
  'hmo': 'hmo',
  'hrv': 'hrv',
  'hat': 'hat',
  'hun': 'hun',
  'arm': 'arm',
  'hye': 'hye',
  'her': 'her',
  'ina': 'ina',
  'ind': 'ind',
  'ile': 'ile',
  'ibo': 'ibo',
  'iii': 'iii',
  'ipk': 'ipk',
  'ido': 'ido',
  'ice': 'ice',
  'isl': 'isl',
  'ita': 'ita',
  'iku': 'iku',
  'jpn': 'jpn',
  'jav': 'jav',
  'geo': 'geo',
  'kat': 'kat',
  'kon': 'kon',
  'kik': 'kik',
  'kua': 'kua',
  'kaz': 'kaz',
  'kal': 'kal',
  'khm': 'khm',
  'kan': 'kan',
  'kor': 'kor',
  'kau': 'kau',
  'kas': 'kas',
  'kur': 'kur',
  'kom': 'kom',
  'cor': 'cor',
  'kir': 'kir',
  'lat': 'lat',
  'ltz': 'ltz',
  'lug': 'lug',
  'lim': 'lim',
  'lin': 'lin',
  'lao': 'lao',
  'lit': 'lit',
  'lub': 'lub',
  'lav': 'lav',
  'mlg': 'mlg',
  'mah': 'mah',
  'mao': 'mao',
  'mri': 'mri',
  'mac': 'mac',
  'mkd': 'mkd',
  'mal': 'mal',
  'mon': 'mon',
  'mol': 'mol',
  'mar': 'mar',
  'may': 'may',
  'msa': 'msa',
  'mlt': 'mlt',
  'bur': 'bur',
  'mya': 'mya',
  'nau': 'nau',
  'nob': 'nob',
  'nde': 'nde',
  'nep': 'nep',
  'ndo': 'ndo',
  'dut': 'dut',
  'nld': 'nld',
  'nno': 'nno',
  'nor': 'nor',
  'nbl': 'nbl',
  'nav': 'nav',
  'nya': 'nya',
  'oci': 'oci',
  'oji': 'oji',
  'orm': 'orm',
  'ori': 'ori',
  'oss': 'oss',
  'pan': 'pan',
  'pli': 'pli',
  'pol': 'pol',
  'pus': 'pus',
  'por': 'por',
  'que': 'que',
  'roh': 'roh',
  'run': 'run',
  'rum': 'rum',
  'ron': 'ron',
  'rus': 'rus',
  'kin': 'kin',
  'san': 'san',
  'srd': 'srd',
  'snd': 'snd',
  'sme': 'sme',
  'sag': 'sag',
  'slo': 'slo',
  'sin': 'sin',
  'slk': 'slk',
  'slv': 'slv',
  'smo': 'smo',
  'sna': 'sna',
  'som': 'som',
  'alb': 'alb',
  'sqi': 'sqi',
  'srp': 'srp',
  'ssw': 'ssw',
  'sot': 'sot',
  'sun': 'sun',
  'swe': 'swe',
  'swa': 'swa',
  'tam': 'tam',
  'tel': 'tel',
  'tgk': 'tgk',
  'tha': 'tha',
  'tir': 'tir',
  'tuk': 'tuk',
  'tgl': 'tgl',
  'tsn': 'tsn',
  'ton': 'ton',
  'tur': 'tur',
  'tso': 'tso',
  'tat': 'tat',
  'twi': 'twi',
  'tah': 'tah',
  'uig': 'uig',
  'ukr': 'ukr',
  'urd': 'urd',
  'uzb': 'uzb',
  'ven': 'ven',
  'vie': 'vie',
  'vol': 'vol',
  'wln': 'wln',
  'wol': 'wol',
  'xho': 'xho',
  'yid': 'yid',
  'yor': 'yor',
  'zha': 'zha',
  'chi': 'chi',
  'zho': 'zho',
  'zul': 'zul'
};
var _default = ValidLanguages;
exports["default"] = _default;

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var scorm12 = {
  CMIString256: '^.{0,255}$',
  CMIString4096: '^.{0,4096}$',
  CMITime: '^(?:[01]\\d|2[0123]):(?:[012345]\\d):(?:[012345]\\d)$',
  // eslint-disable-line
  CMITimespan: '^([0-9]{2,}):([0-9]{2}):([0-9]{2})(\.[0-9]{1,2})?$',
  // eslint-disable-line
  CMIInteger: '^\\d+$',
  CMISInteger: '^-?([0-9]+)$',
  CMIDecimal: '^-?([0-9]{0,3})(\.[0-9]*)?$',
  // eslint-disable-line
  CMIIdentifier: "^[\\u0021-\\u007E\\s]{0,255}$",
  CMIFeedback: '^.{0,255}$',
  // This must be redefined
  CMIIndex: '[._](\\d+).',
  // Vocabulary Data Type Definition
  CMIStatus: '^(passed|completed|failed|incomplete|browsed)$',
  CMIStatus2: '^(passed|completed|failed|incomplete|browsed|not attempted)$',
  CMIExit: '^(time-out|suspend|logout|)$',
  CMIType: '^(true-false|choice|fill-in|matching|performance|sequencing|likert|numeric)$',
  CMIResult: '^(correct|wrong|unanticipated|neutral|([0-9]{0,3})?(\\.[0-9]*)?)$',
  // eslint-disable-line
  NAVEvent: '^(previous|continue)$',
  // Data ranges
  score_range: '0#100',
  audio_range: '-1#100',
  speed_range: '-100#100',
  weighting_range: '-100#100',
  text_range: '-1#1'
};

var aicc = _objectSpread(_objectSpread({}, scorm12), {
  CMIIdentifier: '^\\w{1,255}$'
});

var scorm2004 = {
  CMIString200: "^[\\u0000-\\uFFFF]{0,200}$",
  CMIString250: "^[\\u0000-\\uFFFF]{0,250}$",
  CMIString1000: "^[\\u0000-\\uFFFF]{0,1000}$",
  CMIString4000: "^[\\u0000-\\uFFFF]{0,4000}$",
  CMIString64000: "^[\\u0000-\\uFFFF]{0,64000}$",
  CMILang: '^([a-zA-Z]{2,3}|i|x)(\-[a-zA-Z0-9\-]{2,8})?$|^$',
  // eslint-disable-line
  CMILangString250: '^(\{lang=([a-zA-Z]{2,3}|i|x)(\-[a-zA-Z0-9\-]{2,8})?\})?((?!\{.*$).{0,250}$)?$',
  // eslint-disable-line
  CMILangcr: '^((\{lang=([a-zA-Z]{2,3}|i|x)?(\-[a-zA-Z0-9\-]{2,8})?\}))(.*?)$',
  // eslint-disable-line
  CMILangString250cr: '^((\{lang=([a-zA-Z]{2,3}|i|x)?(\-[a-zA-Z0-9\-]{2,8})?\})?(.{0,250})?)?$',
  // eslint-disable-line
  CMILangString4000: '^(\{lang=([a-zA-Z]{2,3}|i|x)(\-[a-zA-Z0-9\-]{2,8})?\})?((?!\{.*$).{0,4000}$)?$',
  // eslint-disable-line
  CMITime: '^(19[7-9]{1}[0-9]{1}|20[0-2]{1}[0-9]{1}|203[0-8]{1})((-(0[1-9]{1}|1[0-2]{1}))((-(0[1-9]{1}|[1-2]{1}[0-9]{1}|3[0-1]{1}))(T([0-1]{1}[0-9]{1}|2[0-3]{1})((:[0-5]{1}[0-9]{1})((:[0-5]{1}[0-9]{1})((\\.[0-9]{1,2})((Z|([+|-]([0-1]{1}[0-9]{1}|2[0-3]{1})))(:[0-5]{1}[0-9]{1})?)?)?)?)?)?)?)?$',
  CMITimespan: '^P(?:([.,\\d]+)Y)?(?:([.,\\d]+)M)?(?:([.,\\d]+)W)?(?:([.,\\d]+)D)?(?:T?(?:([.,\\d]+)H)?(?:([.,\\d]+)M)?(?:([.,\\d]+)S)?)?$',
  CMIInteger: '^\\d+$',
  CMISInteger: '^-?([0-9]+)$',
  CMIDecimal: '^-?([0-9]{1,5})(\\.[0-9]{1,18})?$',
  CMIIdentifier: '^\\S{1,250}[a-zA-Z0-9]$',
  CMIShortIdentifier: '^[\\w\\.\\-\\_]{1,250}$',
  // eslint-disable-line
  CMILongIdentifier: '^(?:(?!urn:)\\S{1,4000}|urn:[A-Za-z0-9-]{1,31}:\\S{1,4000}|.{1,4000})$',
  // need to re-examine this
  CMIFeedback: '^.*$',
  // This must be redefined
  CMIIndex: '[._](\\d+).',
  CMIIndexStore: '.N(\\d+).',
  // Vocabulary Data Type Definition
  CMICStatus: '^(completed|incomplete|not attempted|unknown)$',
  CMISStatus: '^(passed|failed|unknown)$',
  CMIExit: '^(time-out|suspend|logout|normal)$',
  CMIType: '^(true-false|choice|fill-in|long-fill-in|matching|performance|sequencing|likert|numeric|other)$',
  CMIResult: '^(correct|incorrect|unanticipated|neutral|-?([0-9]{1,4})(\\.[0-9]{1,18})?)$',
  NAVEvent: '^(previous|continue|exit|exitAll|abandon|abandonAll|suspendAll|\{target=\\S{0,200}[a-zA-Z0-9]\}choice|jump)$',
  // eslint-disable-line
  NAVBoolean: '^(unknown|true|false$)',
  NAVTarget: '^(previous|continue|choice.{target=\\S{0,200}[a-zA-Z0-9]})$',
  // Data ranges
  scaled_range: '-1#1',
  audio_range: '0#*',
  speed_range: '0#*',
  text_range: '-1#1',
  progress_range: '0#1'
};
var Regex = {
  aicc: aicc,
  scorm12: scorm12,
  scorm2004: scorm2004
};
var _default = Regex;
exports["default"] = _default;

},{}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regex = _interopRequireDefault(require("./regex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var scorm2004_regex = _regex["default"].scorm2004;
var learner = {
  'true-false': {
    format: '^true$|^false$',
    max: 1,
    delimiter: '',
    unique: false
  },
  'choice': {
    format: scorm2004_regex.CMIShortIdentifier,
    max: 36,
    delimiter: '[,]',
    unique: true
  },
  'fill-in': {
    format: scorm2004_regex.CMILangString250,
    max: 10,
    delimiter: '[,]',
    unique: false
  },
  'long-fill-in': {
    format: scorm2004_regex.CMILangString4000,
    max: 1,
    delimiter: '',
    unique: false
  },
  'matching': {
    format: scorm2004_regex.CMIShortIdentifier,
    format2: scorm2004_regex.CMIShortIdentifier,
    max: 36,
    delimiter: '[,]',
    delimiter2: '[.]',
    unique: false
  },
  'performance': {
    format: '^$|' + scorm2004_regex.CMIShortIdentifier,
    format2: scorm2004_regex.CMIDecimal + '|^$|' + scorm2004_regex.CMIShortIdentifier,
    max: 250,
    delimiter: '[,]',
    delimiter2: '[.]',
    unique: false
  },
  'sequencing': {
    format: scorm2004_regex.CMIShortIdentifier,
    max: 36,
    delimiter: '[,]',
    unique: false
  },
  'likert': {
    format: scorm2004_regex.CMIShortIdentifier,
    max: 1,
    delimiter: '',
    unique: false
  },
  'numeric': {
    format: scorm2004_regex.CMIDecimal,
    max: 1,
    delimiter: '',
    unique: false
  },
  'other': {
    format: scorm2004_regex.CMIString4000,
    max: 1,
    delimiter: '',
    unique: false
  }
};
var correct = {
  'true-false': {
    max: 1,
    delimiter: '',
    unique: false,
    duplicate: false,
    format: '^true$|^false$',
    limit: 1
  },
  'choice': {
    max: 36,
    delimiter: '[,]',
    unique: true,
    duplicate: false,
    format: scorm2004_regex.CMIShortIdentifier
  },
  'fill-in': {
    max: 10,
    delimiter: '[,]',
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMILangString250cr
  },
  'long-fill-in': {
    max: 1,
    delimiter: '',
    unique: false,
    duplicate: true,
    format: scorm2004_regex.CMILangString4000
  },
  'matching': {
    max: 36,
    delimiter: '[,]',
    delimiter2: '[.]',
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIShortIdentifier,
    format2: scorm2004_regex.CMIShortIdentifier
  },
  'performance': {
    max: 250,
    delimiter: '[,]',
    delimiter2: '[.]',
    unique: false,
    duplicate: false,
    format: '^$|' + scorm2004_regex.CMIShortIdentifier,
    format2: scorm2004_regex.CMIDecimal + '|^$|' + scorm2004_regex.CMIShortIdentifier
  },
  'sequencing': {
    max: 36,
    delimiter: '[,]',
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIShortIdentifier
  },
  'likert': {
    max: 1,
    delimiter: '',
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIShortIdentifier,
    limit: 1
  },
  'numeric': {
    max: 2,
    delimiter: '[:]',
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIDecimal,
    limit: 1
  },
  'other': {
    max: 1,
    delimiter: '',
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIString4000,
    limit: 1
  }
};
var Responses = {
  learner: learner,
  correct: correct
};
var _default = Responses;
exports["default"] = _default;

},{"./regex":13}],15:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scorm2004ValidationError = exports.AICCValidationError = exports.Scorm12ValidationError = exports.ValidationError = void 0;

var _api_constants = _interopRequireDefault(require("./constants/api_constants"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }

function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }

function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }

function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

var scorm12_errors = _api_constants["default"].scorm12.error_descriptions;
var aicc_errors = _api_constants["default"].aicc.error_descriptions;
var scorm2004_errors = _api_constants["default"].scorm2004.error_descriptions;
  
/**
 * Base Validation Exception
 */

var _errorCode = new WeakMap();

var _errorMessage = new WeakMap();

var _detailedMessage = new WeakMap();

var ValidationError = /*#__PURE__*/function (_Error) {
  _inherits(ValidationError, _Error);

  var _super = _createSuper(ValidationError);

  /**
   * Constructor to take in an error message and code
   * @param {number} errorCode
   * @param {string} errorMessage
   * @param {string} detailedMessage
   */
  function ValidationError(errorCode, errorMessage, detailedMessage) {
    var _this;

    _classCallCheck(this, ValidationError);

    _this = _super.call(this, errorMessage);

    _errorCode.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _errorMessage.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _detailedMessage.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(_assertThisInitialized(_this), _errorCode, errorCode);

    _classPrivateFieldSet(_assertThisInitialized(_this), _errorMessage, errorMessage);

    _classPrivateFieldSet(_assertThisInitialized(_this), _detailedMessage, detailedMessage);

    return _this;
  }

  _createClass(ValidationError, [{
    key: "errorCode",
    get:
    /**
     * Getter for #errorCode
     * @return {number}
     */
    function get() {
      return _classPrivateFieldGet(this, _errorCode);
    }
    /**
     * Getter for #errorMessage
     * @return {string}
     */

  }, {
    key: "errorMessage",
    get: function get() {
      return _classPrivateFieldGet(this, _errorMessage);
    }
    /**
     * Getter for #detailedMessage
     * @return {string}
     */

  }, {
    key: "detailedMessage",
    get: function get() {
      return _classPrivateFieldGet(this, _detailedMessage);
    }
  }]);

  return ValidationError;
}( /*#__PURE__*/_wrapNativeSuper(Error));
/**
 * SCORM 1.2 Validation Error
 */


exports.ValidationError = ValidationError;

var Scorm12ValidationError = /*#__PURE__*/function (_ValidationError) {
  _inherits(Scorm12ValidationError, _ValidationError);

  var _super2 = _createSuper(Scorm12ValidationError);

  /**
   * Constructor to take in an error code
   * @param {number} errorCode
   */
  function Scorm12ValidationError(errorCode) {
    var _this2;

    _classCallCheck(this, Scorm12ValidationError);

    if ({}.hasOwnProperty.call(scorm12_errors, String(errorCode))) {
      _this2 = _super2.call(this, errorCode, scorm12_errors[String(errorCode)].basicMessage, scorm12_errors[String(errorCode)].detailMessage);
    } else {
      _this2 = _super2.call(this, 101, scorm12_errors['101'].basicMessage, scorm12_errors['101'].detailMessage);
    }

    return _possibleConstructorReturn(_this2);
  }

  return Scorm12ValidationError;
}(ValidationError);
/**
 * AICC Validation Error
 */


exports.Scorm12ValidationError = Scorm12ValidationError;

var AICCValidationError = /*#__PURE__*/function (_ValidationError2) {
  _inherits(AICCValidationError, _ValidationError2);

  var _super3 = _createSuper(AICCValidationError);

  /**
   * Constructor to take in an error code
   * @param {number} errorCode
   */
  function AICCValidationError(errorCode) {
    var _this3;

    _classCallCheck(this, AICCValidationError);

    if ({}.hasOwnProperty.call(aicc_errors, String(errorCode))) {
      _this3 = _super3.call(this, errorCode, aicc_errors[String(errorCode)].basicMessage, aicc_errors[String(errorCode)].detailMessage);
    } else {
      _this3 = _super3.call(this, 101, aicc_errors['101'].basicMessage, aicc_errors['101'].detailMessage);
    }

    return _possibleConstructorReturn(_this3);
  }

  return AICCValidationError;
}(ValidationError);
/**
 * SCORM 2004 Validation Error
 */


exports.AICCValidationError = AICCValidationError;

var Scorm2004ValidationError = /*#__PURE__*/function (_ValidationError3) {
  _inherits(Scorm2004ValidationError, _ValidationError3);

  var _super4 = _createSuper(Scorm2004ValidationError);

  /**
   * Constructor to take in an error code
   * @param {number} errorCode
   */
  function Scorm2004ValidationError(errorCode) {
    var _this4;

    _classCallCheck(this, Scorm2004ValidationError);

    if ({}.hasOwnProperty.call(scorm2004_errors, String(errorCode))) {
      _this4 = _super4.call(this, errorCode, scorm2004_errors[String(errorCode)].basicMessage, scorm2004_errors[String(errorCode)].detailMessage);
    } else {
      _this4 = _super4.call(this, 101, scorm2004_errors['101'].basicMessage, scorm2004_errors['101'].detailMessage);
    }

    return _possibleConstructorReturn(_this4);
  }

  return Scorm2004ValidationError;
}(ValidationError);

exports.Scorm2004ValidationError = Scorm2004ValidationError;

},{"./constants/api_constants":10}],16:[function(require,module,exports){
"use strict";

var _Scorm2004API = _interopRequireDefault(require("./Scorm2004API"));

var _Scorm12API = _interopRequireDefault(require("./Scorm12API"));

var _AICC = _interopRequireDefault(require("./AICC"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

window.Scorm12API = _Scorm12API["default"];
window.Scorm2004API = _Scorm2004API["default"];
window.AICC = _AICC["default"];

},{"./AICC":2,"./Scorm12API":4,"./Scorm2004API":5}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSecondsAsHHMMSS = getSecondsAsHHMMSS;
exports.getSecondsAsISODuration = getSecondsAsISODuration;
exports.getTimeAsSeconds = getTimeAsSeconds;
exports.getDurationAsSeconds = getDurationAsSeconds;
exports.addTwoDurations = addTwoDurations;
exports.addHHMMSSTimeStrings = addHHMMSSTimeStrings;
exports.flatten = flatten;
exports.unflatten = unflatten;
exports.countDecimals = countDecimals;
exports.SECONDS_PER_DAY = exports.SECONDS_PER_HOUR = exports.SECONDS_PER_MINUTE = exports.SECONDS_PER_SECOND = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var SECONDS_PER_SECOND = 1.0;
exports.SECONDS_PER_SECOND = SECONDS_PER_SECOND;
var SECONDS_PER_MINUTE = 60;
exports.SECONDS_PER_MINUTE = SECONDS_PER_MINUTE;
var SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;
exports.SECONDS_PER_HOUR = SECONDS_PER_HOUR;
var SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;
exports.SECONDS_PER_DAY = SECONDS_PER_DAY;
var designations = [['D', SECONDS_PER_DAY], ['H', SECONDS_PER_HOUR], ['M', SECONDS_PER_MINUTE], ['S', SECONDS_PER_SECOND]];
/**
 * Converts a Number to a String of HH:MM:SS
 *
 * @param {Number} totalSeconds
 * @return {string}
 */

function getSecondsAsHHMMSS(totalSeconds) {
  // SCORM spec does not deal with negative durations, give zero back
  if (!totalSeconds || totalSeconds <= 0) {
    return '00:00:00';
  }

  var hours = Math.floor(totalSeconds / SECONDS_PER_HOUR);
  var dateObj = new Date(totalSeconds * 1000);
  var minutes = dateObj.getUTCMinutes(); // make sure we add any possible decimal value

  var seconds = dateObj.getSeconds();
  var ms = totalSeconds % 1.0;
  var msStr = '';

  if (countDecimals(ms) > 0) {
    if (countDecimals(ms) > 2) {
      msStr = ms.toFixed(2);
    } else {
      msStr = String(ms);
    }

    msStr = '.' + msStr.split('.')[1];
  }

  return (hours + ':' + minutes + ':' + seconds).replace(/\b\d\b/g, '0$&') + msStr;
}
/**
 * Calculate the number of seconds from ISO 8601 Duration
 *
 * @param {Number} seconds
 * @return {String}
 */


function getSecondsAsISODuration(seconds) {
  // SCORM spec does not deal with negative durations, give zero back
  if (!seconds || seconds <= 0) {
    return 'PT0S';
  }

  var duration = 'P';
  var remainder = seconds;
  designations.forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        sign = _ref2[0],
        current_seconds = _ref2[1];

    var value = Math.floor(remainder / current_seconds);
    remainder = remainder % current_seconds;

    if (countDecimals(remainder) > 2) {
      remainder = Number(Number(remainder).toFixed(2));
    } // If we have anything left in the remainder, and we're currently adding
    // seconds to the duration, go ahead and add the decimal to the seconds


    if (sign === 'S' && remainder > 0) {
      value += remainder;
    }

    if (value) {
      if ((duration.indexOf('D') > 0 || sign === 'H' || sign === 'M' || sign === 'S') && duration.indexOf('T') === -1) {
        duration += 'T';
      }

      duration += "".concat(value).concat(sign);
    }
  });
  return duration;
}
/**
 * Calculate the number of seconds from HH:MM:SS.DDDDDD
 *
 * @param {string} timeString
 * @param {RegExp} timeRegex
 * @return {number}
 */


function getTimeAsSeconds(timeString, timeRegex) {
  if (!timeString || typeof timeString !== 'string' || !timeString.match(timeRegex)) {
    return 0;
  }

  var parts = timeString.split(':');
  var hours = Number(parts[0]);
  var minutes = Number(parts[1]);
  var seconds = Number(parts[2]);
  return hours * 3600 + minutes * 60 + seconds;
}
/**
 * Calculate the number of seconds from ISO 8601 Duration
 *
 * @param {string} duration
 * @param {RegExp} durationRegex
 * @return {number}
 */


function getDurationAsSeconds(duration, durationRegex) {
  if (!duration || !duration.match(durationRegex)) {
    return 0;
  }

  var _ref3 = new RegExp(durationRegex).exec(duration) || [],
      _ref4 = _slicedToArray(_ref3, 8),
      years = _ref4[1],
      months = _ref4[2],
      days = _ref4[4],
      hours = _ref4[5],
      minutes = _ref4[6],
      seconds = _ref4[7];

  var result = 0.0;
  result += Number(seconds) * 1.0 || 0.0;
  result += Number(minutes) * 60.0 || 0.0;
  result += Number(hours) * 3600.0 || 0.0;
  result += Number(days) * (60 * 60 * 24.0) || 0.0;
  result += Number(years) * (60 * 60 * 24 * 365.0) || 0.0;
  return result;
}
/**
 * Adds together two ISO8601 Duration strings
 *
 * @param {string} first
 * @param {string} second
 * @param {RegExp} durationRegex
 * @return {string}
 */


function addTwoDurations(first, second, durationRegex) {
  return getSecondsAsISODuration(getDurationAsSeconds(first, durationRegex) + getDurationAsSeconds(second, durationRegex));
}
/**
 * Add together two HH:MM:SS.DD strings
 *
 * @param {string} first
 * @param {string} second
 * @param {RegExp} timeRegex
 * @return {string}
 */


function addHHMMSSTimeStrings(first, second, timeRegex) {
  return getSecondsAsHHMMSS(getTimeAsSeconds(first, timeRegex) + getTimeAsSeconds(second, timeRegex));
}
/**
 * Flatten a JSON object down to string paths for each values
 * @param {object} data
 * @return {object}
 */


function flatten(data) {
  var result = {};
  /**
   * Recurse through the object
   * @param {*} cur
   * @param {*} prop
   */

  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (var i = 0, l = cur.length; i < l; i++) {
        recurse(cur[i], prop + '[' + i + ']');
        if (l === 0) result[prop] = [];
      }
    } else {
      var isEmpty = true;

      for (var p in cur) {
        if ({}.hasOwnProperty.call(cur, p)) {
          isEmpty = false;
          recurse(cur[p], prop ? prop + '.' + p : p);
        }
      }

      if (isEmpty && prop) result[prop] = {};
    }
  }

  recurse(data, '');
  return result;
}
/**
 * Un-flatten a flat JSON object
 * @param {object} data
 * @return {object}
 */


function unflatten(data) {
  'use strict';

  if (Object(data) !== data || Array.isArray(data)) return data;
  var regex = /\.?([^.[\]]+)|\[(\d+)]/g;
  var result = {};

  for (var p in data) {
    if ({}.hasOwnProperty.call(data, p)) {
      var cur = result;
      var prop = '';
      var m = regex.exec(p);

      while (m) {
        cur = cur[prop] || (cur[prop] = m[2] ? [] : {});
        prop = m[2] || m[1];
        m = regex.exec(p);
      }

      cur[prop] = data[p];
    }
  }

  return result[''] || result;
}
/**
 * Counts the number of decimal places
 * @param {number} num
 * @return {number}
 */


function countDecimals(num) {
  if (Math.floor(num) === num || String(num).indexOf('.') < 0) return 0;
  var parts = num.toString().split('.')[1];
  return parts.length || 0;
}

},{}]},{},[2,3,6,7,8,9,10,11,12,13,14,15,16,4,5,17])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlYm91bmNlL2luZGV4LmpzIiwic3JjL0FJQ0MuanMiLCJzcmMvQmFzZUFQSS5qcyIsInNyYy9TY29ybTEyQVBJLmpzIiwic3JjL1Njb3JtMjAwNEFQSS5qcyIsInNyYy9jbWkvYWljY19jbWkuanMiLCJzcmMvY21pL2NvbW1vbi5qcyIsInNyYy9jbWkvc2Nvcm0xMl9jbWkuanMiLCJzcmMvY21pL3Njb3JtMjAwNF9jbWkuanMiLCJzcmMvY29uc3RhbnRzL2FwaV9jb25zdGFudHMuanMiLCJzcmMvY29uc3RhbnRzL2Vycm9yX2NvZGVzLmpzIiwic3JjL2NvbnN0YW50cy9sYW5ndWFnZV9jb25zdGFudHMuanMiLCJzcmMvY29uc3RhbnRzL3JlZ2V4LmpzIiwic3JjL2NvbnN0YW50cy9yZXNwb25zZV9jb25zdGFudHMuanMiLCJzcmMvZXhjZXB0aW9ucy5qcyIsInNyYy9leHBvcnRzLmpzIiwic3JjL3V0aWxpdGllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUEsYUFBYSxFQUFFO0FBRlYsS0FiVztBQWlCbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLDZCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQWpCVztBQXFCbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLDZCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXJCVztBQXlCbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLG1DQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXpCVztBQTZCbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLCtCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQTdCVztBQWlDbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLHFDQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQWpDVztBQXFDbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLGlDQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXJDVztBQXlDbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLGtDQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXpDVztBQTZDbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLDhCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQTdDVztBQWlEbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLDhCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQWpEVztBQXFEbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLDBCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXJEVztBQXlEbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLHdCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXpEVztBQTZEbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLHFCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQTdEVztBQWlFbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLHFCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQWpFVztBQXFFbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLHdCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXJFVztBQXlFbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLDhCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXpFVztBQTZFbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLGtDQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQTdFVztBQWlGbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLDBDQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQWpGVztBQXFGbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLGlDQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXJGVztBQXlGbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLGtDQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXpGVztBQTZGbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLGtDQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQTdGVztBQWlHbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLHVDQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQWpHVztBQXFHbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLHVDQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVjtBQXJHVztBQVhKLENBQWxCO0FBdUhBLElBQU0sWUFBWSxHQUFHO0FBQ25CLEVBQUEsTUFBTSxFQUFFLE1BRFc7QUFFbkIsRUFBQSxPQUFPLEVBQUUsT0FGVTtBQUduQixFQUFBLElBQUksRUFBRSxJQUhhO0FBSW5CLEVBQUEsU0FBUyxFQUFFO0FBSlEsQ0FBckI7ZUFPZSxZOzs7Ozs7Ozs7Ozs7Ozs7OztBQ2hOZixJQUFNLE1BQU0sR0FBRztBQUNiLEVBQUEsT0FBTyxFQUFFLEdBREk7QUFFYixFQUFBLHFCQUFxQixFQUFFLEdBRlY7QUFHYixFQUFBLFdBQVcsRUFBRSxHQUhBO0FBSWIsRUFBQSxVQUFVLEVBQUUsR0FKQztBQUtiLEVBQUEsbUJBQW1CLEVBQUUsR0FMUjtBQU1iLEVBQUEsdUJBQXVCLEVBQUUsR0FOWjtBQU9iLEVBQUEsb0JBQW9CLEVBQUUsR0FQVDtBQVFiLEVBQUEsb0JBQW9CLEVBQUUsR0FSVDtBQVNiLEVBQUEsbUJBQW1CLEVBQUUsR0FUUjtBQVViLEVBQUEsaUJBQWlCLEVBQUUsR0FWTjtBQVdiLEVBQUEsZ0JBQWdCLEVBQUUsR0FYTDtBQVliLEVBQUEsa0JBQWtCLEVBQUUsR0FaUDtBQWFiLEVBQUEsaUJBQWlCLEVBQUUsR0FiTjtBQWNiLEVBQUEsY0FBYyxFQUFFLEdBZEg7QUFlYixFQUFBLGNBQWMsRUFBRSxHQWZIO0FBZ0JiLEVBQUEsV0FBVyxFQUFFLEdBaEJBO0FBaUJiLEVBQUEsbUJBQW1CLEVBQUUsR0FqQlI7QUFrQmIsRUFBQSxtQkFBbUIsRUFBRSxHQWxCUjtBQW1CYixFQUFBLHNCQUFzQixFQUFFLEdBbkJYO0FBb0JiLEVBQUEsb0JBQW9CLEVBQUUsR0FwQlQ7QUFxQmIsRUFBQSxxQkFBcUIsRUFBRSxHQXJCVjtBQXNCYixFQUFBLHFCQUFxQixFQUFFLEdBdEJWO0FBdUJiLEVBQUEsaUJBQWlCLEVBQUUsR0F2Qk47QUF3QmIsRUFBQSxpQkFBaUIsRUFBRSxHQXhCTjtBQXlCYixFQUFBLGtCQUFrQixFQUFFLEdBekJQO0FBMEJiLEVBQUEsYUFBYSxFQUFFLEdBMUJGO0FBMkJiLEVBQUEsa0JBQWtCLEVBQUUsR0EzQlA7QUE0QmIsRUFBQSwwQkFBMEIsRUFBRTtBQTVCZixDQUFmOztBQStCQSxJQUFNLE9BQU8sbUNBQ1IsTUFEUSxHQUNHO0FBQ1osRUFBQSxvQkFBb0IsRUFBRSxHQURWO0FBRVosRUFBQSxpQkFBaUIsRUFBRSxHQUZQO0FBR1osRUFBQSxrQkFBa0IsRUFBRSxHQUhSO0FBSVosRUFBQSxjQUFjLEVBQUUsR0FKSjtBQUtaLEVBQUEsY0FBYyxFQUFFLEdBTEo7QUFNWixFQUFBLFdBQVcsRUFBRSxHQU5EO0FBT1osRUFBQSxvQkFBb0IsRUFBRSxHQVBWO0FBUVosRUFBQSxxQkFBcUIsRUFBRSxHQVJYO0FBU1osRUFBQSxxQkFBcUIsRUFBRSxHQVRYO0FBVVosRUFBQSxpQkFBaUIsRUFBRSxHQVZQO0FBV1osRUFBQSxpQkFBaUIsRUFBRSxHQVhQO0FBWVosRUFBQSxrQkFBa0IsRUFBRSxHQVpSO0FBYVosRUFBQSxhQUFhLEVBQUUsR0FiSDtBQWNaLEVBQUEsa0JBQWtCLEVBQUUsR0FkUjtBQWVaLEVBQUEsMEJBQTBCLEVBQUU7QUFmaEIsQ0FESCxDQUFiOztBQW9CQSxJQUFNLFNBQVMsbUNBQ1YsTUFEVSxHQUNDO0FBQ1osRUFBQSxxQkFBcUIsRUFBRSxHQURYO0FBRVosRUFBQSxXQUFXLEVBQUUsR0FGRDtBQUdaLEVBQUEsVUFBVSxFQUFFLEdBSEE7QUFJWixFQUFBLG1CQUFtQixFQUFFLEdBSlQ7QUFLWixFQUFBLHVCQUF1QixFQUFFLEdBTGI7QUFNWixFQUFBLHFCQUFxQixFQUFFLEdBTlg7QUFPWixFQUFBLG9CQUFvQixFQUFFLEdBUFY7QUFRWixFQUFBLG1CQUFtQixFQUFFLEdBUlQ7QUFTWixFQUFBLGlCQUFpQixFQUFFLEdBVFA7QUFVWixFQUFBLGdCQUFnQixFQUFFLEdBVk47QUFXWixFQUFBLGtCQUFrQixFQUFFLEdBWFI7QUFZWixFQUFBLGlCQUFpQixFQUFFLEdBWlA7QUFhWixFQUFBLGNBQWMsRUFBRSxHQWJKO0FBY1osRUFBQSxtQkFBbUIsRUFBRSxHQWRUO0FBZVosRUFBQSxtQkFBbUIsRUFBRSxHQWZUO0FBZ0JaLEVBQUEsc0JBQXNCLEVBQUUsR0FoQlo7QUFpQlosRUFBQSxvQkFBb0IsRUFBRSxHQWpCVjtBQWtCWixFQUFBLHFCQUFxQixFQUFFLEdBbEJYO0FBbUJaLEVBQUEscUJBQXFCLEVBQUUsR0FuQlg7QUFvQlosRUFBQSxpQkFBaUIsRUFBRSxHQXBCUDtBQXFCWixFQUFBLGtCQUFrQixFQUFFLEdBckJSO0FBc0JaLEVBQUEsYUFBYSxFQUFFLEdBdEJIO0FBdUJaLEVBQUEsa0JBQWtCLEVBQUUsR0F2QlI7QUF3QlosRUFBQSwwQkFBMEIsRUFBRTtBQXhCaEIsQ0FERCxDQUFmOztBQTZCQSxJQUFNLFVBQVUsR0FBRztBQUNqQixFQUFBLE9BQU8sRUFBRSxPQURRO0FBRWpCLEVBQUEsU0FBUyxFQUFFO0FBRk0sQ0FBbkI7ZUFLZSxVOzs7Ozs7Ozs7O0FDdEZmLElBQU0sY0FBYyxHQUFHO0FBQ3JCLFFBQU0sSUFEZTtBQUNULFFBQU0sSUFERztBQUNHLFFBQU0sSUFEVDtBQUNlLFFBQU0sSUFEckI7QUFDMkIsUUFBTSxJQURqQztBQUN1QyxRQUFNLElBRDdDO0FBRXJCLFFBQU0sSUFGZTtBQUVULFFBQU0sSUFGRztBQUVHLFFBQU0sSUFGVDtBQUVlLFFBQU0sSUFGckI7QUFFMkIsUUFBTSxJQUZqQztBQUV1QyxRQUFNLElBRjdDO0FBR3JCLFFBQU0sSUFIZTtBQUdULFFBQU0sSUFIRztBQUdHLFFBQU0sSUFIVDtBQUdlLFFBQU0sSUFIckI7QUFHMkIsUUFBTSxJQUhqQztBQUd1QyxRQUFNLElBSDdDO0FBSXJCLFFBQU0sSUFKZTtBQUlULFFBQU0sSUFKRztBQUlHLFFBQU0sSUFKVDtBQUllLFFBQU0sSUFKckI7QUFJMkIsUUFBTSxJQUpqQztBQUl1QyxRQUFNLElBSjdDO0FBS3JCLFFBQU0sSUFMZTtBQUtULFFBQU0sSUFMRztBQUtHLFFBQU0sSUFMVDtBQUtlLFFBQU0sSUFMckI7QUFLMkIsUUFBTSxJQUxqQztBQUt1QyxRQUFNLElBTDdDO0FBTXJCLFFBQU0sSUFOZTtBQU1ULFFBQU0sSUFORztBQU1HLFFBQU0sSUFOVDtBQU1lLFFBQU0sSUFOckI7QUFNMkIsUUFBTSxJQU5qQztBQU11QyxRQUFNLElBTjdDO0FBT3JCLFFBQU0sSUFQZTtBQU9ULFFBQU0sSUFQRztBQU9HLFFBQU0sSUFQVDtBQU9lLFFBQU0sSUFQckI7QUFPMkIsUUFBTSxJQVBqQztBQU91QyxRQUFNLElBUDdDO0FBUXJCLFFBQU0sSUFSZTtBQVFULFFBQU0sSUFSRztBQVFHLFFBQU0sSUFSVDtBQVFlLFFBQU0sSUFSckI7QUFRMkIsUUFBTSxJQVJqQztBQVF1QyxRQUFNLElBUjdDO0FBU3JCLFFBQU0sSUFUZTtBQVNULFFBQU0sSUFURztBQVNHLFFBQU0sSUFUVDtBQVNlLFFBQU0sSUFUckI7QUFTMkIsUUFBTSxJQVRqQztBQVN1QyxRQUFNLElBVDdDO0FBVXJCLFFBQU0sSUFWZTtBQVVULFFBQU0sSUFWRztBQVVHLFFBQU0sSUFWVDtBQVVlLFFBQU0sSUFWckI7QUFVMkIsUUFBTSxJQVZqQztBQVV1QyxRQUFNLElBVjdDO0FBV3JCLFFBQU0sSUFYZTtBQVdULFFBQU0sSUFYRztBQVdHLFFBQU0sSUFYVDtBQVdlLFFBQU0sSUFYckI7QUFXMkIsUUFBTSxJQVhqQztBQVd1QyxRQUFNLElBWDdDO0FBWXJCLFFBQU0sSUFaZTtBQVlULFFBQU0sSUFaRztBQVlHLFFBQU0sSUFaVDtBQVllLFFBQU0sSUFackI7QUFZMkIsUUFBTSxJQVpqQztBQVl1QyxRQUFNLElBWjdDO0FBYXJCLFFBQU0sSUFiZTtBQWFULFFBQU0sSUFiRztBQWFHLFFBQU0sSUFiVDtBQWFlLFFBQU0sSUFickI7QUFhMkIsUUFBTSxJQWJqQztBQWF1QyxRQUFNLElBYjdDO0FBY3JCLFFBQU0sSUFkZTtBQWNULFFBQU0sSUFkRztBQWNHLFFBQU0sSUFkVDtBQWNlLFFBQU0sSUFkckI7QUFjMkIsUUFBTSxJQWRqQztBQWN1QyxRQUFNLElBZDdDO0FBZXJCLFFBQU0sSUFmZTtBQWVULFFBQU0sSUFmRztBQWVHLFFBQU0sSUFmVDtBQWVlLFFBQU0sSUFmckI7QUFlMkIsUUFBTSxJQWZqQztBQWV1QyxRQUFNLElBZjdDO0FBZ0JyQixRQUFNLElBaEJlO0FBZ0JULFFBQU0sSUFoQkc7QUFnQkcsUUFBTSxJQWhCVDtBQWdCZSxRQUFNLElBaEJyQjtBQWdCMkIsUUFBTSxJQWhCakM7QUFnQnVDLFFBQU0sSUFoQjdDO0FBaUJyQixRQUFNLElBakJlO0FBaUJULFFBQU0sSUFqQkc7QUFpQkcsUUFBTSxJQWpCVDtBQWlCZSxRQUFNLElBakJyQjtBQWlCMkIsUUFBTSxJQWpCakM7QUFpQnVDLFFBQU0sSUFqQjdDO0FBa0JyQixRQUFNLElBbEJlO0FBa0JULFFBQU0sSUFsQkc7QUFrQkcsUUFBTSxJQWxCVDtBQWtCZSxRQUFNLElBbEJyQjtBQWtCMkIsUUFBTSxJQWxCakM7QUFrQnVDLFFBQU0sSUFsQjdDO0FBbUJyQixRQUFNLElBbkJlO0FBbUJULFFBQU0sSUFuQkc7QUFtQkcsUUFBTSxJQW5CVDtBQW1CZSxRQUFNLElBbkJyQjtBQW1CMkIsUUFBTSxJQW5CakM7QUFtQnVDLFFBQU0sSUFuQjdDO0FBb0JyQixRQUFNLElBcEJlO0FBb0JULFFBQU0sSUFwQkc7QUFvQkcsUUFBTSxJQXBCVDtBQW9CZSxRQUFNLElBcEJyQjtBQW9CMkIsUUFBTSxJQXBCakM7QUFvQnVDLFFBQU0sSUFwQjdDO0FBcUJyQixRQUFNLElBckJlO0FBcUJULFFBQU0sSUFyQkc7QUFxQkcsUUFBTSxJQXJCVDtBQXFCZSxRQUFNLElBckJyQjtBQXFCMkIsUUFBTSxJQXJCakM7QUFxQnVDLFFBQU0sSUFyQjdDO0FBc0JyQixRQUFNLElBdEJlO0FBc0JULFFBQU0sSUF0Qkc7QUFzQkcsUUFBTSxJQXRCVDtBQXNCZSxRQUFNLElBdEJyQjtBQXNCMkIsUUFBTSxJQXRCakM7QUFzQnVDLFFBQU0sSUF0QjdDO0FBdUJyQixRQUFNLElBdkJlO0FBdUJULFFBQU0sSUF2Qkc7QUF1QkcsUUFBTSxJQXZCVDtBQXVCZSxRQUFNLElBdkJyQjtBQXVCMkIsUUFBTSxJQXZCakM7QUF1QnVDLFFBQU0sSUF2QjdDO0FBd0JyQixRQUFNLElBeEJlO0FBd0JULFFBQU0sSUF4Qkc7QUF3QkcsUUFBTSxJQXhCVDtBQXdCZSxRQUFNLElBeEJyQjtBQXdCMkIsUUFBTSxJQXhCakM7QUF3QnVDLFFBQU0sSUF4QjdDO0FBeUJyQixRQUFNLElBekJlO0FBeUJULFFBQU0sSUF6Qkc7QUF5QkcsUUFBTSxJQXpCVDtBQXlCZSxRQUFNLElBekJyQjtBQXlCMkIsUUFBTSxJQXpCakM7QUF5QnVDLFFBQU0sSUF6QjdDO0FBMEJyQixRQUFNLElBMUJlO0FBMEJULFFBQU0sSUExQkc7QUEwQkcsUUFBTSxJQTFCVDtBQTBCZSxRQUFNLElBMUJyQjtBQTBCMkIsUUFBTSxJQTFCakM7QUEwQnVDLFFBQU0sSUExQjdDO0FBMkJyQixRQUFNLElBM0JlO0FBMkJULFFBQU0sSUEzQkc7QUEyQkcsUUFBTSxJQTNCVDtBQTJCZSxRQUFNLElBM0JyQjtBQTJCMkIsUUFBTSxJQTNCakM7QUEyQnVDLFFBQU0sSUEzQjdDO0FBNEJyQixRQUFNLElBNUJlO0FBNEJULFFBQU0sSUE1Qkc7QUE0QkcsUUFBTSxJQTVCVDtBQTRCZSxRQUFNLElBNUJyQjtBQTRCMkIsUUFBTSxJQTVCakM7QUE0QnVDLFFBQU0sSUE1QjdDO0FBNkJyQixRQUFNLElBN0JlO0FBNkJULFFBQU0sSUE3Qkc7QUE2QkcsUUFBTSxJQTdCVDtBQTZCZSxRQUFNLElBN0JyQjtBQTZCMkIsUUFBTSxJQTdCakM7QUE2QnVDLFFBQU0sSUE3QjdDO0FBOEJyQixRQUFNLElBOUJlO0FBOEJULFFBQU0sSUE5Qkc7QUE4QkcsUUFBTSxJQTlCVDtBQThCZSxRQUFNLElBOUJyQjtBQThCMkIsUUFBTSxJQTlCakM7QUE4QnVDLFFBQU0sSUE5QjdDO0FBK0JyQixRQUFNLElBL0JlO0FBK0JULFFBQU0sSUEvQkc7QUErQkcsUUFBTSxJQS9CVDtBQStCZSxRQUFNLElBL0JyQjtBQStCMkIsUUFBTSxJQS9CakM7QUErQnVDLFFBQU0sSUEvQjdDO0FBZ0NyQixTQUFPLEtBaENjO0FBZ0NQLFNBQU8sS0FoQ0E7QUFnQ08sU0FBTyxLQWhDZDtBQWdDcUIsU0FBTyxLQWhDNUI7QUFnQ21DLFNBQU8sS0FoQzFDO0FBaUNyQixTQUFPLEtBakNjO0FBaUNQLFNBQU8sS0FqQ0E7QUFpQ08sU0FBTyxLQWpDZDtBQWlDcUIsU0FBTyxLQWpDNUI7QUFpQ21DLFNBQU8sS0FqQzFDO0FBa0NyQixTQUFPLEtBbENjO0FBa0NQLFNBQU8sS0FsQ0E7QUFrQ08sU0FBTyxLQWxDZDtBQWtDcUIsU0FBTyxLQWxDNUI7QUFrQ21DLFNBQU8sS0FsQzFDO0FBbUNyQixTQUFPLEtBbkNjO0FBbUNQLFNBQU8sS0FuQ0E7QUFtQ08sU0FBTyxLQW5DZDtBQW1DcUIsU0FBTyxLQW5DNUI7QUFtQ21DLFNBQU8sS0FuQzFDO0FBb0NyQixTQUFPLEtBcENjO0FBb0NQLFNBQU8sS0FwQ0E7QUFvQ08sU0FBTyxLQXBDZDtBQW9DcUIsU0FBTyxLQXBDNUI7QUFvQ21DLFNBQU8sS0FwQzFDO0FBcUNyQixTQUFPLEtBckNjO0FBcUNQLFNBQU8sS0FyQ0E7QUFxQ08sU0FBTyxLQXJDZDtBQXFDcUIsU0FBTyxLQXJDNUI7QUFxQ21DLFNBQU8sS0FyQzFDO0FBc0NyQixTQUFPLEtBdENjO0FBc0NQLFNBQU8sS0F0Q0E7QUFzQ08sU0FBTyxLQXRDZDtBQXNDcUIsU0FBTyxLQXRDNUI7QUFzQ21DLFNBQU8sS0F0QzFDO0FBdUNyQixTQUFPLEtBdkNjO0FBdUNQLFNBQU8sS0F2Q0E7QUF1Q08sU0FBTyxLQXZDZDtBQXVDcUIsU0FBTyxLQXZDNUI7QUF1Q21DLFNBQU8sS0F2QzFDO0FBd0NyQixTQUFPLEtBeENjO0FBd0NQLFNBQU8sS0F4Q0E7QUF3Q08sU0FBTyxLQXhDZDtBQXdDcUIsU0FBTyxLQXhDNUI7QUF3Q21DLFNBQU8sS0F4QzFDO0FBeUNyQixTQUFPLEtBekNjO0FBeUNQLFNBQU8sS0F6Q0E7QUF5Q08sU0FBTyxLQXpDZDtBQXlDcUIsU0FBTyxLQXpDNUI7QUF5Q21DLFNBQU8sS0F6QzFDO0FBMENyQixTQUFPLEtBMUNjO0FBMENQLFNBQU8sS0ExQ0E7QUEwQ08sU0FBTyxLQTFDZDtBQTBDcUIsU0FBTyxLQTFDNUI7QUEwQ21DLFNBQU8sS0ExQzFDO0FBMkNyQixTQUFPLEtBM0NjO0FBMkNQLFNBQU8sS0EzQ0E7QUEyQ08sU0FBTyxLQTNDZDtBQTJDcUIsU0FBTyxLQTNDNUI7QUEyQ21DLFNBQU8sS0EzQzFDO0FBNENyQixTQUFPLEtBNUNjO0FBNENQLFNBQU8sS0E1Q0E7QUE0Q08sU0FBTyxLQTVDZDtBQTRDcUIsU0FBTyxLQTVDNUI7QUE0Q21DLFNBQU8sS0E1QzFDO0FBNkNyQixTQUFPLEtBN0NjO0FBNkNQLFNBQU8sS0E3Q0E7QUE2Q08sU0FBTyxLQTdDZDtBQTZDcUIsU0FBTyxLQTdDNUI7QUE2Q21DLFNBQU8sS0E3QzFDO0FBOENyQixTQUFPLEtBOUNjO0FBOENQLFNBQU8sS0E5Q0E7QUE4Q08sU0FBTyxLQTlDZDtBQThDcUIsU0FBTyxLQTlDNUI7QUE4Q21DLFNBQU8sS0E5QzFDO0FBK0NyQixTQUFPLEtBL0NjO0FBK0NQLFNBQU8sS0EvQ0E7QUErQ08sU0FBTyxLQS9DZDtBQStDcUIsU0FBTyxLQS9DNUI7QUErQ21DLFNBQU8sS0EvQzFDO0FBZ0RyQixTQUFPLEtBaERjO0FBZ0RQLFNBQU8sS0FoREE7QUFnRE8sU0FBTyxLQWhEZDtBQWdEcUIsU0FBTyxLQWhENUI7QUFnRG1DLFNBQU8sS0FoRDFDO0FBaURyQixTQUFPLEtBakRjO0FBaURQLFNBQU8sS0FqREE7QUFpRE8sU0FBTyxLQWpEZDtBQWlEcUIsU0FBTyxLQWpENUI7QUFpRG1DLFNBQU8sS0FqRDFDO0FBa0RyQixTQUFPLEtBbERjO0FBa0RQLFNBQU8sS0FsREE7QUFrRE8sU0FBTyxLQWxEZDtBQWtEcUIsU0FBTyxLQWxENUI7QUFrRG1DLFNBQU8sS0FsRDFDO0FBbURyQixTQUFPLEtBbkRjO0FBbURQLFNBQU8sS0FuREE7QUFtRE8sU0FBTyxLQW5EZDtBQW1EcUIsU0FBTyxLQW5ENUI7QUFtRG1DLFNBQU8sS0FuRDFDO0FBb0RyQixTQUFPLEtBcERjO0FBb0RQLFNBQU8sS0FwREE7QUFvRE8sU0FBTyxLQXBEZDtBQW9EcUIsU0FBTyxLQXBENUI7QUFvRG1DLFNBQU8sS0FwRDFDO0FBcURyQixTQUFPLEtBckRjO0FBcURQLFNBQU8sS0FyREE7QUFxRE8sU0FBTyxLQXJEZDtBQXFEcUIsU0FBTyxLQXJENUI7QUFxRG1DLFNBQU8sS0FyRDFDO0FBc0RyQixTQUFPLEtBdERjO0FBc0RQLFNBQU8sS0F0REE7QUFzRE8sU0FBTyxLQXREZDtBQXNEcUIsU0FBTyxLQXRENUI7QUFzRG1DLFNBQU8sS0F0RDFDO0FBdURyQixTQUFPLEtBdkRjO0FBdURQLFNBQU8sS0F2REE7QUF1RE8sU0FBTyxLQXZEZDtBQXVEcUIsU0FBTyxLQXZENUI7QUF1RG1DLFNBQU8sS0F2RDFDO0FBd0RyQixTQUFPLEtBeERjO0FBd0RQLFNBQU8sS0F4REE7QUF3RE8sU0FBTyxLQXhEZDtBQXdEcUIsU0FBTyxLQXhENUI7QUF3RG1DLFNBQU8sS0F4RDFDO0FBeURyQixTQUFPLEtBekRjO0FBeURQLFNBQU8sS0F6REE7QUF5RE8sU0FBTyxLQXpEZDtBQXlEcUIsU0FBTyxLQXpENUI7QUF5RG1DLFNBQU8sS0F6RDFDO0FBMERyQixTQUFPLEtBMURjO0FBMERQLFNBQU8sS0ExREE7QUEwRE8sU0FBTyxLQTFEZDtBQTBEcUIsU0FBTyxLQTFENUI7QUEwRG1DLFNBQU8sS0ExRDFDO0FBMkRyQixTQUFPLEtBM0RjO0FBMkRQLFNBQU8sS0EzREE7QUEyRE8sU0FBTyxLQTNEZDtBQTJEcUIsU0FBTyxLQTNENUI7QUEyRG1DLFNBQU8sS0EzRDFDO0FBNERyQixTQUFPLEtBNURjO0FBNERQLFNBQU8sS0E1REE7QUE0RE8sU0FBTyxLQTVEZDtBQTREcUIsU0FBTyxLQTVENUI7QUE0RG1DLFNBQU8sS0E1RDFDO0FBNkRyQixTQUFPLEtBN0RjO0FBNkRQLFNBQU8sS0E3REE7QUE2RE8sU0FBTyxLQTdEZDtBQTZEcUIsU0FBTyxLQTdENUI7QUE2RG1DLFNBQU8sS0E3RDFDO0FBOERyQixTQUFPLEtBOURjO0FBOERQLFNBQU8sS0E5REE7QUE4RE8sU0FBTyxLQTlEZDtBQThEcUIsU0FBTyxLQTlENUI7QUE4RG1DLFNBQU8sS0E5RDFDO0FBK0RyQixTQUFPLEtBL0RjO0FBK0RQLFNBQU8sS0EvREE7QUErRE8sU0FBTyxLQS9EZDtBQStEcUIsU0FBTyxLQS9ENUI7QUErRG1DLFNBQU8sS0EvRDFDO0FBZ0VyQixTQUFPLEtBaEVjO0FBZ0VQLFNBQU8sS0FoRUE7QUFnRU8sU0FBTyxLQWhFZDtBQWdFcUIsU0FBTyxLQWhFNUI7QUFnRW1DLFNBQU8sS0FoRTFDO0FBaUVyQixTQUFPLEtBakVjO0FBaUVQLFNBQU8sS0FqRUE7QUFpRU8sU0FBTyxLQWpFZDtBQWlFcUIsU0FBTyxLQWpFNUI7QUFpRW1DLFNBQU8sS0FqRTFDO0FBa0VyQixTQUFPLEtBbEVjO0FBa0VQLFNBQU8sS0FsRUE7QUFrRU8sU0FBTyxLQWxFZDtBQWtFcUIsU0FBTyxLQWxFNUI7QUFrRW1DLFNBQU8sS0FsRTFDO0FBbUVyQixTQUFPLEtBbkVjO0FBbUVQLFNBQU8sS0FuRUE7QUFtRU8sU0FBTyxLQW5FZDtBQW1FcUIsU0FBTyxLQW5FNUI7QUFtRW1DLFNBQU8sS0FuRTFDO0FBb0VyQixTQUFPLEtBcEVjO0FBb0VQLFNBQU8sS0FwRUE7QUFvRU8sU0FBTyxLQXBFZDtBQW9FcUIsU0FBTyxLQXBFNUI7QUFvRW1DLFNBQU8sS0FwRTFDO0FBcUVyQixTQUFPLEtBckVjO0FBcUVQLFNBQU8sS0FyRUE7QUFxRU8sU0FBTyxLQXJFZDtBQXFFcUIsU0FBTyxLQXJFNUI7QUFxRW1DLFNBQU8sS0FyRTFDO0FBc0VyQixTQUFPLEtBdEVjO0FBc0VQLFNBQU8sS0F0RUE7QUFzRU8sU0FBTyxLQXRFZDtBQXNFcUIsU0FBTyxLQXRFNUI7QUFzRW1DLFNBQU8sS0F0RTFDO0FBdUVyQixTQUFPLEtBdkVjO0FBdUVQLFNBQU8sS0F2RUE7QUF1RU8sU0FBTyxLQXZFZDtBQXVFcUIsU0FBTyxLQXZFNUI7QUF1RW1DLFNBQU8sS0F2RTFDO0FBd0VyQixTQUFPLEtBeEVjO0FBd0VQLFNBQU8sS0F4RUE7QUF3RU8sU0FBTyxLQXhFZDtBQXdFcUIsU0FBTyxLQXhFNUI7QUF3RW1DLFNBQU87QUF4RTFDLENBQXZCO2VBMkVlLGM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekVmLElBQU0sT0FBTyxHQUFHO0FBQ2QsRUFBQSxZQUFZLEVBQUUsWUFEQTtBQUVkLEVBQUEsYUFBYSxFQUFFLGFBRkQ7QUFHZCxFQUFBLE9BQU8sRUFBRSx1REFISztBQUdvRDtBQUNsRSxFQUFBLFdBQVcsRUFBRSxvREFKQztBQUlxRDtBQUNuRSxFQUFBLFVBQVUsRUFBRSxRQUxFO0FBTWQsRUFBQSxXQUFXLEVBQUUsY0FOQztBQU9kLEVBQUEsVUFBVSxFQUFFLDZCQVBFO0FBTzZCO0FBQzNDLEVBQUEsYUFBYSxFQUFFLCtCQVJEO0FBU2QsRUFBQSxXQUFXLEVBQUUsWUFUQztBQVNhO0FBQzNCLEVBQUEsUUFBUSxFQUFFLGFBVkk7QUFZZDtBQUNBLEVBQUEsU0FBUyxFQUFFLGdEQWJHO0FBY2QsRUFBQSxVQUFVLEVBQUUsOERBZEU7QUFlZCxFQUFBLE9BQU8sRUFBRSw4QkFmSztBQWdCZCxFQUFBLE9BQU8sRUFBRSw4RUFoQks7QUFpQmQsRUFBQSxTQUFTLEVBQUUsbUVBakJHO0FBaUJrRTtBQUNoRixFQUFBLFFBQVEsRUFBRSx1QkFsQkk7QUFvQmQ7QUFDQSxFQUFBLFdBQVcsRUFBRSxPQXJCQztBQXNCZCxFQUFBLFdBQVcsRUFBRSxRQXRCQztBQXVCZCxFQUFBLFdBQVcsRUFBRSxVQXZCQztBQXdCZCxFQUFBLGVBQWUsRUFBRSxVQXhCSDtBQXlCZCxFQUFBLFVBQVUsRUFBRTtBQXpCRSxDQUFoQjs7QUE0QkEsSUFBTSxJQUFJLG1DQUNMLE9BREssR0FDTztBQUNiLEVBQUEsYUFBYSxFQUFFO0FBREYsQ0FEUCxDQUFWOztBQU1BLElBQU0sU0FBUyxHQUFHO0FBQ2hCLEVBQUEsWUFBWSxFQUFFLDRCQURFO0FBRWhCLEVBQUEsWUFBWSxFQUFFLDRCQUZFO0FBR2hCLEVBQUEsYUFBYSxFQUFFLDZCQUhDO0FBSWhCLEVBQUEsYUFBYSxFQUFFLDZCQUpDO0FBS2hCLEVBQUEsY0FBYyxFQUFFLDhCQUxBO0FBTWhCLEVBQUEsT0FBTyxFQUFFLGlEQU5PO0FBTTRDO0FBQzVELEVBQUEsZ0JBQWdCLEVBQUUsK0VBUEY7QUFPbUY7QUFDbkcsRUFBQSxTQUFTLEVBQUUsaUVBUks7QUFROEQ7QUFDOUUsRUFBQSxrQkFBa0IsRUFBRSx5RUFUSjtBQVMrRTtBQUMvRixFQUFBLGlCQUFpQixFQUFFLGdGQVZIO0FBVXFGO0FBQ3JHLEVBQUEsT0FBTyxFQUFFLDBSQVhPO0FBWWhCLEVBQUEsV0FBVyxFQUFFLDRIQVpHO0FBYWhCLEVBQUEsVUFBVSxFQUFFLFFBYkk7QUFjaEIsRUFBQSxXQUFXLEVBQUUsY0FkRztBQWVoQixFQUFBLFVBQVUsRUFBRSxtQ0FmSTtBQWdCaEIsRUFBQSxhQUFhLEVBQUUseUJBaEJDO0FBaUJoQixFQUFBLGtCQUFrQixFQUFFLHlCQWpCSjtBQWlCK0I7QUFDL0MsRUFBQSxpQkFBaUIsRUFBRSx3RUFsQkg7QUFrQjZFO0FBQzdGLEVBQUEsV0FBVyxFQUFFLE1BbkJHO0FBbUJLO0FBQ3JCLEVBQUEsUUFBUSxFQUFFLGFBcEJNO0FBcUJoQixFQUFBLGFBQWEsRUFBRSxXQXJCQztBQXVCaEI7QUFDQSxFQUFBLFVBQVUsRUFBRSxnREF4Qkk7QUF5QmhCLEVBQUEsVUFBVSxFQUFFLDJCQXpCSTtBQTBCaEIsRUFBQSxPQUFPLEVBQUUsb0NBMUJPO0FBMkJoQixFQUFBLE9BQU8sRUFBRSxpR0EzQk87QUE0QmhCLEVBQUEsU0FBUyxFQUFFLDZFQTVCSztBQTZCaEIsRUFBQSxRQUFRLEVBQUUsOEdBN0JNO0FBNkIwRztBQUMxSCxFQUFBLFVBQVUsRUFBRSx3QkE5Qkk7QUErQmhCLEVBQUEsU0FBUyxFQUFFLDZEQS9CSztBQWlDaEI7QUFDQSxFQUFBLFlBQVksRUFBRSxNQWxDRTtBQW1DaEIsRUFBQSxXQUFXLEVBQUUsS0FuQ0c7QUFvQ2hCLEVBQUEsV0FBVyxFQUFFLEtBcENHO0FBcUNoQixFQUFBLFVBQVUsRUFBRSxNQXJDSTtBQXNDaEIsRUFBQSxjQUFjLEVBQUU7QUF0Q0EsQ0FBbEI7QUF5Q0EsSUFBTSxLQUFLLEdBQUc7QUFDWixFQUFBLElBQUksRUFBRSxJQURNO0FBRVosRUFBQSxPQUFPLEVBQUUsT0FGRztBQUdaLEVBQUEsU0FBUyxFQUFFO0FBSEMsQ0FBZDtlQU1lLEs7Ozs7Ozs7Ozs7O0FDbEZmOzs7O0FBRUEsSUFBTSxlQUFlLEdBQUcsa0JBQU0sU0FBOUI7QUFFQSxJQUFNLE9BQU8sR0FBRztBQUNkLGdCQUFjO0FBQ1osSUFBQSxNQUFNLEVBQUUsZ0JBREk7QUFFWixJQUFBLEdBQUcsRUFBRSxDQUZPO0FBR1osSUFBQSxTQUFTLEVBQUUsRUFIQztBQUlaLElBQUEsTUFBTSxFQUFFO0FBSkksR0FEQTtBQU9kLFlBQVU7QUFDUixJQUFBLE1BQU0sRUFBRSxlQUFlLENBQUMsa0JBRGhCO0FBRVIsSUFBQSxHQUFHLEVBQUUsRUFGRztBQUdSLElBQUEsU0FBUyxFQUFFLEtBSEg7QUFJUixJQUFBLE1BQU0sRUFBRTtBQUpBLEdBUEk7QUFhZCxhQUFXO0FBQ1QsSUFBQSxNQUFNLEVBQUUsZUFBZSxDQUFDLGdCQURmO0FBRVQsSUFBQSxHQUFHLEVBQUUsRUFGSTtBQUdULElBQUEsU0FBUyxFQUFFLEtBSEY7QUFJVCxJQUFBLE1BQU0sRUFBRTtBQUpDLEdBYkc7QUFtQmQsa0JBQWdCO0FBQ2QsSUFBQSxNQUFNLEVBQUUsZUFBZSxDQUFDLGlCQURWO0FBRWQsSUFBQSxHQUFHLEVBQUUsQ0FGUztBQUdkLElBQUEsU0FBUyxFQUFFLEVBSEc7QUFJZCxJQUFBLE1BQU0sRUFBRTtBQUpNLEdBbkJGO0FBeUJkLGNBQVk7QUFDVixJQUFBLE1BQU0sRUFBRSxlQUFlLENBQUMsa0JBRGQ7QUFFVixJQUFBLE9BQU8sRUFBRSxlQUFlLENBQUMsa0JBRmY7QUFHVixJQUFBLEdBQUcsRUFBRSxFQUhLO0FBSVYsSUFBQSxTQUFTLEVBQUUsS0FKRDtBQUtWLElBQUEsVUFBVSxFQUFFLEtBTEY7QUFNVixJQUFBLE1BQU0sRUFBRTtBQU5FLEdBekJFO0FBaUNkLGlCQUFlO0FBQ2IsSUFBQSxNQUFNLEVBQUUsUUFBUSxlQUFlLENBQUMsa0JBRG5CO0FBRWIsSUFBQSxPQUFPLEVBQUUsZUFBZSxDQUFDLFVBQWhCLEdBQTZCLE1BQTdCLEdBQ0wsZUFBZSxDQUFDLGtCQUhQO0FBSWIsSUFBQSxHQUFHLEVBQUUsR0FKUTtBQUtiLElBQUEsU0FBUyxFQUFFLEtBTEU7QUFNYixJQUFBLFVBQVUsRUFBRSxLQU5DO0FBT2IsSUFBQSxNQUFNLEVBQUU7QUFQSyxHQWpDRDtBQTBDZCxnQkFBYztBQUNaLElBQUEsTUFBTSxFQUFFLGVBQWUsQ0FBQyxrQkFEWjtBQUVaLElBQUEsR0FBRyxFQUFFLEVBRk87QUFHWixJQUFBLFNBQVMsRUFBRSxLQUhDO0FBSVosSUFBQSxNQUFNLEVBQUU7QUFKSSxHQTFDQTtBQWdEZCxZQUFVO0FBQ1IsSUFBQSxNQUFNLEVBQUUsZUFBZSxDQUFDLGtCQURoQjtBQUVSLElBQUEsR0FBRyxFQUFFLENBRkc7QUFHUixJQUFBLFNBQVMsRUFBRSxFQUhIO0FBSVIsSUFBQSxNQUFNLEVBQUU7QUFKQSxHQWhESTtBQXNEZCxhQUFXO0FBQ1QsSUFBQSxNQUFNLEVBQUUsZUFBZSxDQUFDLFVBRGY7QUFFVCxJQUFBLEdBQUcsRUFBRSxDQUZJO0FBR1QsSUFBQSxTQUFTLEVBQUUsRUFIRjtBQUlULElBQUEsTUFBTSxFQUFFO0FBSkMsR0F0REc7QUE0RGQsV0FBUztBQUNQLElBQUEsTUFBTSxFQUFFLGVBQWUsQ0FBQyxhQURqQjtBQUVQLElBQUEsR0FBRyxFQUFFLENBRkU7QUFHUCxJQUFBLFNBQVMsRUFBRSxFQUhKO0FBSVAsSUFBQSxNQUFNLEVBQUU7QUFKRDtBQTVESyxDQUFoQjtBQW9FQSxJQUFNLE9BQU8sR0FBRztBQUNkLGdCQUFjO0FBQ1osSUFBQSxHQUFHLEVBQUUsQ0FETztBQUVaLElBQUEsU0FBUyxFQUFFLEVBRkM7QUFHWixJQUFBLE1BQU0sRUFBRSxLQUhJO0FBSVosSUFBQSxTQUFTLEVBQUUsS0FKQztBQUtaLElBQUEsTUFBTSxFQUFFLGdCQUxJO0FBTVosSUFBQSxLQUFLLEVBQUU7QUFOSyxHQURBO0FBU2QsWUFBVTtBQUNSLElBQUEsR0FBRyxFQUFFLEVBREc7QUFFUixJQUFBLFNBQVMsRUFBRSxLQUZIO0FBR1IsSUFBQSxNQUFNLEVBQUUsSUFIQTtBQUlSLElBQUEsU0FBUyxFQUFFLEtBSkg7QUFLUixJQUFBLE1BQU0sRUFBRSxlQUFlLENBQUM7QUFMaEIsR0FUSTtBQWdCZCxhQUFXO0FBQ1QsSUFBQSxHQUFHLEVBQUUsRUFESTtBQUVULElBQUEsU0FBUyxFQUFFLEtBRkY7QUFHVCxJQUFBLE1BQU0sRUFBRSxLQUhDO0FBSVQsSUFBQSxTQUFTLEVBQUUsS0FKRjtBQUtULElBQUEsTUFBTSxFQUFFLGVBQWUsQ0FBQztBQUxmLEdBaEJHO0FBdUJkLGtCQUFnQjtBQUNkLElBQUEsR0FBRyxFQUFFLENBRFM7QUFFZCxJQUFBLFNBQVMsRUFBRSxFQUZHO0FBR2QsSUFBQSxNQUFNLEVBQUUsS0FITTtBQUlkLElBQUEsU0FBUyxFQUFFLElBSkc7QUFLZCxJQUFBLE1BQU0sRUFBRSxlQUFlLENBQUM7QUFMVixHQXZCRjtBQThCZCxjQUFZO0FBQ1YsSUFBQSxHQUFHLEVBQUUsRUFESztBQUVWLElBQUEsU0FBUyxFQUFFLEtBRkQ7QUFHVixJQUFBLFVBQVUsRUFBRSxLQUhGO0FBSVYsSUFBQSxNQUFNLEVBQUUsS0FKRTtBQUtWLElBQUEsU0FBUyxFQUFFLEtBTEQ7QUFNVixJQUFBLE1BQU0sRUFBRSxlQUFlLENBQUMsa0JBTmQ7QUFPVixJQUFBLE9BQU8sRUFBRSxlQUFlLENBQUM7QUFQZixHQTlCRTtBQXVDZCxpQkFBZTtBQUNiLElBQUEsR0FBRyxFQUFFLEdBRFE7QUFFYixJQUFBLFNBQVMsRUFBRSxLQUZFO0FBR2IsSUFBQSxVQUFVLEVBQUUsS0FIQztBQUliLElBQUEsTUFBTSxFQUFFLEtBSks7QUFLYixJQUFBLFNBQVMsRUFBRSxLQUxFO0FBTWIsSUFBQSxNQUFNLEVBQUUsUUFBUSxlQUFlLENBQUMsa0JBTm5CO0FBT2IsSUFBQSxPQUFPLEVBQUUsZUFBZSxDQUFDLFVBQWhCLEdBQTZCLE1BQTdCLEdBQ0wsZUFBZSxDQUFDO0FBUlAsR0F2Q0Q7QUFpRGQsZ0JBQWM7QUFDWixJQUFBLEdBQUcsRUFBRSxFQURPO0FBRVosSUFBQSxTQUFTLEVBQUUsS0FGQztBQUdaLElBQUEsTUFBTSxFQUFFLEtBSEk7QUFJWixJQUFBLFNBQVMsRUFBRSxLQUpDO0FBS1osSUFBQSxNQUFNLEVBQUUsZUFBZSxDQUFDO0FBTFosR0FqREE7QUF3RGQsWUFBVTtBQUNSLElBQUEsR0FBRyxFQUFFLENBREc7QUFFUixJQUFBLFNBQVMsRUFBRSxFQUZIO0FBR1IsSUFBQSxNQUFNLEVBQUUsS0FIQTtBQUlSLElBQUEsU0FBUyxFQUFFLEtBSkg7QUFLUixJQUFBLE1BQU0sRUFBRSxlQUFlLENBQUMsa0JBTGhCO0FBTVIsSUFBQSxLQUFLLEVBQUU7QUFOQyxHQXhESTtBQWdFZCxhQUFXO0FBQ1QsSUFBQSxHQUFHLEVBQUUsQ0FESTtBQUVULElBQUEsU0FBUyxFQUFFLEtBRkY7QUFHVCxJQUFBLE1BQU0sRUFBRSxLQUhDO0FBSVQsSUFBQSxTQUFTLEVBQUUsS0FKRjtBQUtULElBQUEsTUFBTSxFQUFFLGVBQWUsQ0FBQyxVQUxmO0FBTVQsSUFBQSxLQUFLLEVBQUU7QUFORSxHQWhFRztBQXdFZCxXQUFTO0FBQ1AsSUFBQSxHQUFHLEVBQUUsQ0FERTtBQUVQLElBQUEsU0FBUyxFQUFFLEVBRko7QUFHUCxJQUFBLE1BQU0sRUFBRSxLQUhEO0FBSVAsSUFBQSxTQUFTLEVBQUUsS0FKSjtBQUtQLElBQUEsTUFBTSxFQUFFLGVBQWUsQ0FBQyxhQUxqQjtBQU1QLElBQUEsS0FBSyxFQUFFO0FBTkE7QUF4RUssQ0FBaEI7QUFrRkEsSUFBTSxTQUFTLEdBQUc7QUFDaEIsRUFBQSxPQUFPLEVBQUUsT0FETztBQUVoQixFQUFBLE9BQU8sRUFBRTtBQUZPLENBQWxCO2VBS2UsUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUpmO0FBQ0E7QUFDQTtJQUNhLGU7Ozs7O0FBQ1g7QUFDRjtBQUNBO0FBQ0E7QUFDRSwyQkFBWSxTQUFaLEVBQStCO0FBQUE7O0FBQUE7O0FBQzdCLDhCQUFNLFNBQU47O0FBRDZCO0FBQUE7QUFBQTtBQUFBOztBQUU3QixxRUFBa0IsU0FBbEI7O0FBRjZCO0FBRzlCOzs7OztBQUlEO0FBQ0Y7QUFDQTtBQUNBO0FBQ0UsbUJBQWdCO0FBQ2QsbUNBQU8sSUFBUDtBQUNEO0FBRUQ7QUFDRjtBQUNBO0FBQ0E7Ozs7U0FDRSxlQUFjO0FBQ1osYUFBTywwQ0FBa0IsRUFBekI7QUFDRDs7OztpQ0ExQmtDLEs7Ozs7Ozs7QUNMckM7O0FBQ0E7O0FBQ0E7Ozs7QUFFQSxNQUFNLENBQUMsVUFBUCxHQUFvQixzQkFBcEI7QUFDQSxNQUFNLENBQUMsWUFBUCxHQUFzQix3QkFBdEI7QUFDQSxNQUFNLENBQUMsSUFBUCxHQUFjLGdCQUFkOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTE8sSUFBTSxrQkFBa0IsR0FBRyxHQUEzQjs7QUFDQSxJQUFNLGtCQUFrQixHQUFHLEVBQTNCOztBQUNBLElBQU0sZ0JBQWdCLEdBQUcsS0FBSyxrQkFBOUI7O0FBQ0EsSUFBTSxlQUFlLEdBQUcsS0FBSyxnQkFBN0I7O0FBRVAsSUFBTSxZQUFZLEdBQUcsQ0FDbkIsQ0FBQyxHQUFELEVBQU0sZUFBTixDQURtQixFQUVuQixDQUFDLEdBQUQsRUFBTSxnQkFBTixDQUZtQixFQUduQixDQUFDLEdBQUQsRUFBTSxrQkFBTixDQUhtQixFQUluQixDQUFDLEdBQUQsRUFBTSxrQkFBTixDQUptQixDQUFyQjtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDTyxTQUFTLGtCQUFULENBQTRCLFlBQTVCLEVBQWtEO0FBQ3ZEO0FBQ0EsTUFBSSxDQUFDLFlBQUQsSUFBaUIsWUFBWSxJQUFJLENBQXJDLEVBQXdDO0FBQ3RDLFdBQU8sVUFBUDtBQUNEOztBQUVELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFMLENBQVcsWUFBWSxHQUFHLGdCQUExQixDQUFkO0FBRUEsTUFBTSxPQUFPLEdBQUcsSUFBSSxJQUFKLENBQVMsWUFBWSxHQUFHLElBQXhCLENBQWhCO0FBQ0EsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQVIsRUFBaEIsQ0FUdUQsQ0FVdkQ7O0FBQ0EsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVIsRUFBaEI7QUFDQSxNQUFNLEVBQUUsR0FBRyxZQUFZLEdBQUcsR0FBMUI7QUFDQSxNQUFJLEtBQUssR0FBRyxFQUFaOztBQUNBLE1BQUksYUFBYSxDQUFDLEVBQUQsQ0FBYixHQUFvQixDQUF4QixFQUEyQjtBQUN6QixRQUFJLGFBQWEsQ0FBQyxFQUFELENBQWIsR0FBb0IsQ0FBeEIsRUFBMkI7QUFDekIsTUFBQSxLQUFLLEdBQUcsRUFBRSxDQUFDLE9BQUgsQ0FBVyxDQUFYLENBQVI7QUFDRCxLQUZELE1BRU87QUFDTCxNQUFBLEtBQUssR0FBRyxNQUFNLENBQUMsRUFBRCxDQUFkO0FBQ0Q7O0FBQ0QsSUFBQSxLQUFLLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBTixDQUFZLEdBQVosRUFBaUIsQ0FBakIsQ0FBZDtBQUNEOztBQUVELFNBQU8sQ0FBQyxLQUFLLEdBQUcsR0FBUixHQUFjLE9BQWQsR0FBd0IsR0FBeEIsR0FBOEIsT0FBL0IsRUFBd0MsT0FBeEMsQ0FBZ0QsU0FBaEQsRUFDSCxLQURHLElBQ00sS0FEYjtBQUVEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTLHVCQUFULENBQWlDLE9BQWpDLEVBQWtEO0FBQ3ZEO0FBQ0EsTUFBSSxDQUFDLE9BQUQsSUFBWSxPQUFPLElBQUksQ0FBM0IsRUFBOEI7QUFDNUIsV0FBTyxNQUFQO0FBQ0Q7O0FBRUQsTUFBSSxRQUFRLEdBQUcsR0FBZjtBQUNBLE1BQUksU0FBUyxHQUFHLE9BQWhCO0FBRUEsRUFBQSxZQUFZLENBQUMsT0FBYixDQUFxQixnQkFBNkI7QUFBQTtBQUFBLFFBQTNCLElBQTJCO0FBQUEsUUFBckIsZUFBcUI7O0FBQ2hELFFBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFMLENBQVcsU0FBUyxHQUFHLGVBQXZCLENBQVo7QUFFQSxJQUFBLFNBQVMsR0FBRyxTQUFTLEdBQUcsZUFBeEI7O0FBQ0EsUUFBSSxhQUFhLENBQUMsU0FBRCxDQUFiLEdBQTJCLENBQS9CLEVBQWtDO0FBQ2hDLE1BQUEsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBRCxDQUFOLENBQWtCLE9BQWxCLENBQTBCLENBQTFCLENBQUQsQ0FBbEI7QUFDRCxLQU4rQyxDQU9oRDtBQUNBOzs7QUFDQSxRQUFJLElBQUksS0FBSyxHQUFULElBQWdCLFNBQVMsR0FBRyxDQUFoQyxFQUFtQztBQUNqQyxNQUFBLEtBQUssSUFBSSxTQUFUO0FBQ0Q7O0FBRUQsUUFBSSxLQUFKLEVBQVc7QUFDVCxVQUFJLENBQUMsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsR0FBakIsSUFBd0IsQ0FBeEIsSUFDRCxJQUFJLEtBQUssR0FEUixJQUNlLElBQUksS0FBSyxHQUR4QixJQUMrQixJQUFJLEtBQUssR0FEekMsS0FFQSxRQUFRLENBQUMsT0FBVCxDQUFpQixHQUFqQixNQUEwQixDQUFDLENBRi9CLEVBRWtDO0FBQ2hDLFFBQUEsUUFBUSxJQUFJLEdBQVo7QUFDRDs7QUFDRCxNQUFBLFFBQVEsY0FBTyxLQUFQLFNBQWUsSUFBZixDQUFSO0FBQ0Q7QUFDRixHQXJCRDtBQXVCQSxTQUFPLFFBQVA7QUFDRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTLGdCQUFULENBQTBCLFVBQTFCLEVBQThDLFNBQTlDLEVBQWlFO0FBQ3RFLE1BQUksQ0FBQyxVQUFELElBQWUsT0FBTyxVQUFQLEtBQXNCLFFBQXJDLElBQ0EsQ0FBQyxVQUFVLENBQUMsS0FBWCxDQUFpQixTQUFqQixDQURMLEVBQ2tDO0FBQ2hDLFdBQU8sQ0FBUDtBQUNEOztBQUNELE1BQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFYLENBQWlCLEdBQWpCLENBQWQ7QUFDQSxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUQsQ0FBTixDQUFwQjtBQUNBLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBRCxDQUFOLENBQXRCO0FBQ0EsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFELENBQU4sQ0FBdEI7QUFDQSxTQUFRLEtBQUssR0FBRyxJQUFULEdBQWtCLE9BQU8sR0FBRyxFQUE1QixHQUFrQyxPQUF6QztBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVMsb0JBQVQsQ0FBOEIsUUFBOUIsRUFBZ0QsYUFBaEQsRUFBdUU7QUFDNUUsTUFBSSxDQUFDLFFBQUQsSUFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFULENBQWUsYUFBZixDQUFsQixFQUFpRDtBQUMvQyxXQUFPLENBQVA7QUFDRDs7QUFFRCxjQUEyRCxJQUFJLE1BQUosQ0FDdkQsYUFEdUQsRUFDeEMsSUFEd0MsQ0FDbkMsUUFEbUMsS0FDdEIsRUFEckM7QUFBQTtBQUFBLE1BQVMsS0FBVDtBQUFBLE1BQWdCLE1BQWhCO0FBQUEsTUFBMEIsSUFBMUI7QUFBQSxNQUFnQyxLQUFoQztBQUFBLE1BQXVDLE9BQXZDO0FBQUEsTUFBZ0QsT0FBaEQ7O0FBR0EsTUFBSSxNQUFNLEdBQUcsR0FBYjtBQUVBLEVBQUEsTUFBTSxJQUFLLE1BQU0sQ0FBQyxPQUFELENBQU4sR0FBa0IsR0FBbEIsSUFBeUIsR0FBcEM7QUFDQSxFQUFBLE1BQU0sSUFBSyxNQUFNLENBQUMsT0FBRCxDQUFOLEdBQWtCLElBQWxCLElBQTBCLEdBQXJDO0FBQ0EsRUFBQSxNQUFNLElBQUssTUFBTSxDQUFDLEtBQUQsQ0FBTixHQUFnQixNQUFoQixJQUEwQixHQUFyQztBQUNBLEVBQUEsTUFBTSxJQUFLLE1BQU0sQ0FBQyxJQUFELENBQU4sSUFBZ0IsS0FBSyxFQUFMLEdBQVUsSUFBMUIsS0FBbUMsR0FBOUM7QUFDQSxFQUFBLE1BQU0sSUFBSyxNQUFNLENBQUMsS0FBRCxDQUFOLElBQWlCLEtBQUssRUFBTCxHQUFVLEVBQVYsR0FBZSxLQUFoQyxLQUEwQyxHQUFyRDtBQUVBLFNBQU8sTUFBUDtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBUyxlQUFULENBQ0gsS0FERyxFQUVILE1BRkcsRUFHSCxhQUhHLEVBR29CO0FBQ3pCLFNBQU8sdUJBQXVCLENBQzFCLG9CQUFvQixDQUFDLEtBQUQsRUFBUSxhQUFSLENBQXBCLEdBQ0Esb0JBQW9CLENBQUMsTUFBRCxFQUFTLGFBQVQsQ0FGTSxDQUE5QjtBQUlEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBUyxvQkFBVCxDQUNILEtBREcsRUFFSCxNQUZHLEVBR0gsU0FIRyxFQUdnQjtBQUNyQixTQUFPLGtCQUFrQixDQUNyQixnQkFBZ0IsQ0FBQyxLQUFELEVBQVEsU0FBUixDQUFoQixHQUNBLGdCQUFnQixDQUNaLE1BRFksRUFDSixTQURJLENBRkssQ0FBekI7QUFLRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVMsT0FBVCxDQUFpQixJQUFqQixFQUF1QjtBQUM1QixNQUFNLE1BQU0sR0FBRyxFQUFmO0FBRUE7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7QUFDRSxXQUFTLE9BQVQsQ0FBaUIsR0FBakIsRUFBc0IsSUFBdEIsRUFBNEI7QUFDMUIsUUFBSSxNQUFNLENBQUMsR0FBRCxDQUFOLEtBQWdCLEdBQXBCLEVBQXlCO0FBQ3ZCLE1BQUEsTUFBTSxDQUFDLElBQUQsQ0FBTixHQUFlLEdBQWY7QUFDRCxLQUZELE1BRU8sSUFBSSxLQUFLLENBQUMsT0FBTixDQUFjLEdBQWQsQ0FBSixFQUF3QjtBQUM3QixXQUFLLElBQUksQ0FBQyxHQUFHLENBQVIsRUFBVyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQXhCLEVBQWdDLENBQUMsR0FBRyxDQUFwQyxFQUF1QyxDQUFDLEVBQXhDLEVBQTRDO0FBQzFDLFFBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFELENBQUosRUFBUyxJQUFJLEdBQUcsR0FBUCxHQUFhLENBQWIsR0FBaUIsR0FBMUIsQ0FBUDtBQUNBLFlBQUksQ0FBQyxLQUFLLENBQVYsRUFBYSxNQUFNLENBQUMsSUFBRCxDQUFOLEdBQWUsRUFBZjtBQUNkO0FBQ0YsS0FMTSxNQUtBO0FBQ0wsVUFBSSxPQUFPLEdBQUcsSUFBZDs7QUFDQSxXQUFLLElBQU0sQ0FBWCxJQUFnQixHQUFoQixFQUFxQjtBQUNuQixZQUFJLEdBQUcsY0FBSCxDQUFrQixJQUFsQixDQUF1QixHQUF2QixFQUE0QixDQUE1QixDQUFKLEVBQW9DO0FBQ2xDLFVBQUEsT0FBTyxHQUFHLEtBQVY7QUFDQSxVQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBRCxDQUFKLEVBQVMsSUFBSSxHQUFHLElBQUksR0FBRyxHQUFQLEdBQWEsQ0FBaEIsR0FBb0IsQ0FBakMsQ0FBUDtBQUNEO0FBQ0Y7O0FBQ0QsVUFBSSxPQUFPLElBQUksSUFBZixFQUFxQixNQUFNLENBQUMsSUFBRCxDQUFOLEdBQWUsRUFBZjtBQUN0QjtBQUNGOztBQUVELEVBQUEsT0FBTyxDQUFDLElBQUQsRUFBTyxFQUFQLENBQVA7QUFDQSxTQUFPLE1BQVA7QUFDRDtBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVMsU0FBVCxDQUFtQixJQUFuQixFQUF5QjtBQUM5Qjs7QUFDQSxNQUFJLE1BQU0sQ0FBQyxJQUFELENBQU4sS0FBaUIsSUFBakIsSUFBeUIsS0FBSyxDQUFDLE9BQU4sQ0FBYyxJQUFkLENBQTdCLEVBQWtELE9BQU8sSUFBUDtBQUNsRCxNQUFNLEtBQUssR0FBRyx5QkFBZDtBQUNBLE1BQU0sTUFBTSxHQUFHLEVBQWY7O0FBQ0EsT0FBSyxJQUFNLENBQVgsSUFBZ0IsSUFBaEIsRUFBc0I7QUFDcEIsUUFBSSxHQUFHLGNBQUgsQ0FBa0IsSUFBbEIsQ0FBdUIsSUFBdkIsRUFBNkIsQ0FBN0IsQ0FBSixFQUFxQztBQUNuQyxVQUFJLEdBQUcsR0FBRyxNQUFWO0FBQ0EsVUFBSSxJQUFJLEdBQUcsRUFBWDtBQUNBLFVBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFOLENBQVcsQ0FBWCxDQUFSOztBQUNBLGFBQU8sQ0FBUCxFQUFVO0FBQ1IsUUFBQSxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUQsQ0FBSCxLQUFjLEdBQUcsQ0FBQyxJQUFELENBQUgsR0FBYSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU8sRUFBUCxHQUFZLEVBQXZDLENBQU47QUFDQSxRQUFBLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBRCxDQUFELElBQVEsQ0FBQyxDQUFDLENBQUQsQ0FBaEI7QUFDQSxRQUFBLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBTixDQUFXLENBQVgsQ0FBSjtBQUNEOztBQUNELE1BQUEsR0FBRyxDQUFDLElBQUQsQ0FBSCxHQUFZLElBQUksQ0FBQyxDQUFELENBQWhCO0FBQ0Q7QUFDRjs7QUFDRCxTQUFPLE1BQU0sQ0FBQyxFQUFELENBQU4sSUFBYyxNQUFyQjtBQUNEO0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBUyxhQUFULENBQXVCLEdBQXZCLEVBQW9DO0FBQ3pDLE1BQUksSUFBSSxDQUFDLEtBQUwsQ0FBVyxHQUFYLE1BQW9CLEdBQXBCLElBQTJCLE1BQU0sQ0FBQyxHQUFELENBQU4sQ0FBWSxPQUFaLENBQW9CLEdBQXBCLElBQTJCLENBQTFELEVBQTZELE9BQU8sQ0FBUDtBQUM3RCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsUUFBSixHQUFlLEtBQWYsQ0FBcUIsR0FBckIsRUFBMEIsQ0FBMUIsQ0FBZDtBQUNBLFNBQU8sS0FBSyxDQUFDLE1BQU4sSUFBZ0IsQ0FBdkI7QUFDRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogbG9kYXNoIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcXVlcnkub3JnLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogVXNlZCBhcyB0aGUgYFR5cGVFcnJvcmAgbWVzc2FnZSBmb3IgXCJGdW5jdGlvbnNcIiBtZXRob2RzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW0gPSAvXlxccyt8XFxzKyQvZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJhZCBzaWduZWQgaGV4YWRlY2ltYWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiaW5hcnkgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb2N0YWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pO1xuXG4vKiogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgd2l0aG91dCBhIGRlcGVuZGVuY3kgb24gYHJvb3RgLiAqL1xudmFyIGZyZWVQYXJzZUludCA9IHBhcnNlSW50O1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogR2V0cyB0aGUgdGltZXN0YW1wIG9mIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgaGF2ZSBlbGFwc2VkIHNpbmNlXG4gKiB0aGUgVW5peCBlcG9jaCAoMSBKYW51YXJ5IDE5NzAgMDA6MDA6MDAgVVRDKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgRGF0ZVxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgdGltZXN0YW1wLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmVyKGZ1bmN0aW9uKHN0YW1wKSB7XG4gKiAgIGNvbnNvbGUubG9nKF8ubm93KCkgLSBzdGFtcCk7XG4gKiB9LCBfLm5vdygpKTtcbiAqIC8vID0+IExvZ3MgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgaXQgdG9vayBmb3IgdGhlIGRlZmVycmVkIGludm9jYXRpb24uXG4gKi9cbnZhciBub3cgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHJvb3QuRGF0ZS5ub3coKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRlYm91bmNlZCBmdW5jdGlvbiB0aGF0IGRlbGF5cyBpbnZva2luZyBgZnVuY2AgdW50aWwgYWZ0ZXIgYHdhaXRgXG4gKiBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB3YXNcbiAqIGludm9rZWQuIFRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgIG1ldGhvZCB0byBjYW5jZWxcbiAqIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLlxuICogUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2Agc2hvdWxkIGJlIGludm9rZWQgb24gdGhlXG4gKiBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkXG4gKiB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50XG4gKiBjYWxscyB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYFxuICogaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIGRlYm91bmNlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy5kZWJvdW5jZWAgYW5kIGBfLnRocm90dGxlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlYm91bmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9ZmFsc2VdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFdhaXRdXG4gKiAgVGhlIG1heGltdW0gdGltZSBgZnVuY2AgaXMgYWxsb3dlZCB0byBiZSBkZWxheWVkIGJlZm9yZSBpdCdzIGludm9rZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGRlYm91bmNlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgY29zdGx5IGNhbGN1bGF0aW9ucyB3aGlsZSB0aGUgd2luZG93IHNpemUgaXMgaW4gZmx1eC5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCBfLmRlYm91bmNlKGNhbGN1bGF0ZUxheW91dCwgMTUwKSk7XG4gKlxuICogLy8gSW52b2tlIGBzZW5kTWFpbGAgd2hlbiBjbGlja2VkLCBkZWJvdW5jaW5nIHN1YnNlcXVlbnQgY2FsbHMuXG4gKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgXy5kZWJvdW5jZShzZW5kTWFpbCwgMzAwLCB7XG4gKiAgICdsZWFkaW5nJzogdHJ1ZSxcbiAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAqIH0pKTtcbiAqXG4gKiAvLyBFbnN1cmUgYGJhdGNoTG9nYCBpcyBpbnZva2VkIG9uY2UgYWZ0ZXIgMSBzZWNvbmQgb2YgZGVib3VuY2VkIGNhbGxzLlxuICogdmFyIGRlYm91bmNlZCA9IF8uZGVib3VuY2UoYmF0Y2hMb2csIDI1MCwgeyAnbWF4V2FpdCc6IDEwMDAgfSk7XG4gKiB2YXIgc291cmNlID0gbmV3IEV2ZW50U291cmNlKCcvc3RyZWFtJyk7XG4gKiBqUXVlcnkoc291cmNlKS5vbignbWVzc2FnZScsIGRlYm91bmNlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyBkZWJvdW5jZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGRlYm91bmNlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsYXN0QXJncyxcbiAgICAgIGxhc3RUaGlzLFxuICAgICAgbWF4V2FpdCxcbiAgICAgIHJlc3VsdCxcbiAgICAgIHRpbWVySWQsXG4gICAgICBsYXN0Q2FsbFRpbWUsXG4gICAgICBsYXN0SW52b2tlVGltZSA9IDAsXG4gICAgICBsZWFkaW5nID0gZmFsc2UsXG4gICAgICBtYXhpbmcgPSBmYWxzZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB3YWl0ID0gdG9OdW1iZXIod2FpdCkgfHwgMDtcbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICEhb3B0aW9ucy5sZWFkaW5nO1xuICAgIG1heGluZyA9ICdtYXhXYWl0JyBpbiBvcHRpb25zO1xuICAgIG1heFdhaXQgPSBtYXhpbmcgPyBuYXRpdmVNYXgodG9OdW1iZXIob3B0aW9ucy5tYXhXYWl0KSB8fCAwLCB3YWl0KSA6IG1heFdhaXQ7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGludm9rZUZ1bmModGltZSkge1xuICAgIHZhciBhcmdzID0gbGFzdEFyZ3MsXG4gICAgICAgIHRoaXNBcmcgPSBsYXN0VGhpcztcblxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlYWRpbmdFZGdlKHRpbWUpIHtcbiAgICAvLyBSZXNldCBhbnkgYG1heFdhaXRgIHRpbWVyLlxuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICAvLyBTdGFydCB0aGUgdGltZXIgZm9yIHRoZSB0cmFpbGluZyBlZGdlLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgLy8gSW52b2tlIHRoZSBsZWFkaW5nIGVkZ2UuXG4gICAgcmV0dXJuIGxlYWRpbmcgPyBpbnZva2VGdW5jKHRpbWUpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtYWluaW5nV2FpdCh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZSxcbiAgICAgICAgcmVzdWx0ID0gd2FpdCAtIHRpbWVTaW5jZUxhc3RDYWxsO1xuXG4gICAgcmV0dXJuIG1heGluZyA/IG5hdGl2ZU1pbihyZXN1bHQsIG1heFdhaXQgLSB0aW1lU2luY2VMYXN0SW52b2tlKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZEludm9rZSh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZTtcblxuICAgIC8vIEVpdGhlciB0aGlzIGlzIHRoZSBmaXJzdCBjYWxsLCBhY3Rpdml0eSBoYXMgc3RvcHBlZCBhbmQgd2UncmUgYXQgdGhlXG4gICAgLy8gdHJhaWxpbmcgZWRnZSwgdGhlIHN5c3RlbSB0aW1lIGhhcyBnb25lIGJhY2t3YXJkcyBhbmQgd2UncmUgdHJlYXRpbmdcbiAgICAvLyBpdCBhcyB0aGUgdHJhaWxpbmcgZWRnZSwgb3Igd2UndmUgaGl0IHRoZSBgbWF4V2FpdGAgbGltaXQuXG4gICAgcmV0dXJuIChsYXN0Q2FsbFRpbWUgPT09IHVuZGVmaW5lZCB8fCAodGltZVNpbmNlTGFzdENhbGwgPj0gd2FpdCkgfHxcbiAgICAgICh0aW1lU2luY2VMYXN0Q2FsbCA8IDApIHx8IChtYXhpbmcgJiYgdGltZVNpbmNlTGFzdEludm9rZSA+PSBtYXhXYWl0KSk7XG4gIH1cblxuICBmdW5jdGlvbiB0aW1lckV4cGlyZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKTtcbiAgICBpZiAoc2hvdWxkSW52b2tlKHRpbWUpKSB7XG4gICAgICByZXR1cm4gdHJhaWxpbmdFZGdlKHRpbWUpO1xuICAgIH1cbiAgICAvLyBSZXN0YXJ0IHRoZSB0aW1lci5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHJlbWFpbmluZ1dhaXQodGltZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhaWxpbmdFZGdlKHRpbWUpIHtcbiAgICB0aW1lcklkID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gT25seSBpbnZva2UgaWYgd2UgaGF2ZSBgbGFzdEFyZ3NgIHdoaWNoIG1lYW5zIGBmdW5jYCBoYXMgYmVlblxuICAgIC8vIGRlYm91bmNlZCBhdCBsZWFzdCBvbmNlLlxuICAgIGlmICh0cmFpbGluZyAmJiBsYXN0QXJncykge1xuICAgICAgcmV0dXJuIGludm9rZUZ1bmModGltZSk7XG4gICAgfVxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBpZiAodGltZXJJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgfVxuICAgIGxhc3RJbnZva2VUaW1lID0gMDtcbiAgICBsYXN0QXJncyA9IGxhc3RDYWxsVGltZSA9IGxhc3RUaGlzID0gdGltZXJJZCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHJldHVybiB0aW1lcklkID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiB0cmFpbGluZ0VkZ2Uobm93KCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCksXG4gICAgICAgIGlzSW52b2tpbmcgPSBzaG91bGRJbnZva2UodGltZSk7XG5cbiAgICBsYXN0QXJncyA9IGFyZ3VtZW50cztcbiAgICBsYXN0VGhpcyA9IHRoaXM7XG4gICAgbGFzdENhbGxUaW1lID0gdGltZTtcblxuICAgIGlmIChpc0ludm9raW5nKSB7XG4gICAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBsZWFkaW5nRWRnZShsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG1heGluZykge1xuICAgICAgICAvLyBIYW5kbGUgaW52b2NhdGlvbnMgaW4gYSB0aWdodCBsb29wLlxuICAgICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgICAgICByZXR1cm4gaW52b2tlRnVuYyhsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGRlYm91bmNlZC5jYW5jZWwgPSBjYW5jZWw7XG4gIGRlYm91bmNlZC5mbHVzaCA9IGZsdXNoO1xuICByZXR1cm4gZGVib3VuY2VkO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b051bWJlcigzLjIpO1xuICogLy8gPT4gMy4yXG4gKlxuICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9OdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gSW5maW5pdHlcbiAqXG4gKiBfLnRvTnVtYmVyKCczLjInKTtcbiAqIC8vID0+IDMuMlxuICovXG5mdW5jdGlvbiB0b051bWJlcih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTkFOO1xuICB9XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICB2YXIgb3RoZXIgPSB0eXBlb2YgdmFsdWUudmFsdWVPZiA9PSAnZnVuY3Rpb24nID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG4gICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyAob3RoZXIgKyAnJykgOiBvdGhlcjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiArdmFsdWU7XG4gIH1cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlVHJpbSwgJycpO1xuICB2YXIgaXNCaW5hcnkgPSByZUlzQmluYXJ5LnRlc3QodmFsdWUpO1xuICByZXR1cm4gKGlzQmluYXJ5IHx8IHJlSXNPY3RhbC50ZXN0KHZhbHVlKSlcbiAgICA/IGZyZWVQYXJzZUludCh2YWx1ZS5zbGljZSgyKSwgaXNCaW5hcnkgPyAyIDogOClcbiAgICA6IChyZUlzQmFkSGV4LnRlc3QodmFsdWUpID8gTkFOIDogK3ZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWJvdW5jZTtcbiIsIi8vIEBmbG93XG5pbXBvcnQgU2Nvcm0xMkFQSSBmcm9tICcuL1Njb3JtMTJBUEknO1xuaW1wb3J0IHtcbiAgQ01JLFxuICBDTUlBdHRlbXB0UmVjb3Jkc09iamVjdCxcbiAgQ01JRXZhbHVhdGlvbkNvbW1lbnRzT2JqZWN0LFxuICBDTUlUcmllc09iamVjdCxcbn0gZnJvbSAnLi9jbWkvYWljY19jbWknO1xuaW1wb3J0IHtOQVZ9IGZyb20gJy4vY21pL3Njb3JtMTJfY21pJztcblxuLyoqXG4gKiBUaGUgQUlDQyBBUEkgY2xhc3NcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQUlDQyBleHRlbmRzIFNjb3JtMTJBUEkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgdG8gY3JlYXRlIEFJQ0MgQVBJIG9iamVjdFxuICAgKiBAcGFyYW0ge29iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiB7fSkge1xuICAgIGNvbnN0IGZpbmFsU2V0dGluZ3MgPSB7XG4gICAgICAuLi57XG4gICAgICAgIG1hc3Rlcnlfb3ZlcnJpZGU6IGZhbHNlLFxuICAgICAgfSwgLi4uc2V0dGluZ3MsXG4gICAgfTtcblxuICAgIHN1cGVyKGZpbmFsU2V0dGluZ3MpO1xuXG4gICAgdGhpcy5jbWkgPSBuZXcgQ01JKCk7XG4gICAgdGhpcy5uYXYgPSBuZXcgTkFWKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBvciBidWlsZHMgYSBuZXcgY2hpbGQgZWxlbWVudCB0byBhZGQgdG8gdGhlIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICogQHBhcmFtIHtib29sZWFufSBmb3VuZEZpcnN0SW5kZXhcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cbiAgZ2V0Q2hpbGRFbGVtZW50KENNSUVsZW1lbnQsIHZhbHVlLCBmb3VuZEZpcnN0SW5kZXgpIHtcbiAgICBsZXQgbmV3Q2hpbGQgPSBzdXBlci5nZXRDaGlsZEVsZW1lbnQoQ01JRWxlbWVudCwgdmFsdWUsIGZvdW5kRmlyc3RJbmRleCk7XG5cbiAgICBpZiAoIW5ld0NoaWxkKSB7XG4gICAgICBpZiAodGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsICdjbWlcXFxcLmV2YWx1YXRpb25cXFxcLmNvbW1lbnRzXFxcXC5cXFxcZCsnKSkge1xuICAgICAgICBuZXdDaGlsZCA9IG5ldyBDTUlFdmFsdWF0aW9uQ29tbWVudHNPYmplY3QoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsXG4gICAgICAgICAgJ2NtaVxcXFwuc3R1ZGVudF9kYXRhXFxcXC50cmllc1xcXFwuXFxcXGQrJykpIHtcbiAgICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JVHJpZXNPYmplY3QoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsXG4gICAgICAgICAgJ2NtaVxcXFwuc3R1ZGVudF9kYXRhXFxcXC5hdHRlbXB0X3JlY29yZHNcXFxcLlxcXFxkKycpKSB7XG4gICAgICAgIG5ld0NoaWxkID0gbmV3IENNSUF0dGVtcHRSZWNvcmRzT2JqZWN0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0NoaWxkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgdGhlIHdob2xlIEFQSSB3aXRoIGFub3RoZXJcbiAgICpcbiAgICogQHBhcmFtIHtBSUNDfSBuZXdBUElcbiAgICovXG4gIHJlcGxhY2VXaXRoQW5vdGhlclNjb3JtQVBJKG5ld0FQSSkge1xuICAgIC8vIERhdGEgTW9kZWxcbiAgICB0aGlzLmNtaSA9IG5ld0FQSS5jbWk7XG4gICAgdGhpcy5uYXYgPSBuZXdBUEkubmF2O1xuICB9XG59XG4iLCIvLyBAZmxvd1xuaW1wb3J0IHtDTUlBcnJheX0gZnJvbSAnLi9jbWkvY29tbW9uJztcbmltcG9ydCB7VmFsaWRhdGlvbkVycm9yfSBmcm9tICcuL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IEVycm9yQ29kZXMgZnJvbSAnLi9jb25zdGFudHMvZXJyb3JfY29kZXMnO1xuaW1wb3J0IEFQSUNvbnN0YW50cyBmcm9tICcuL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCB7dW5mbGF0dGVufSBmcm9tICcuL3V0aWxpdGllcyc7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSAnbG9kYXNoLmRlYm91bmNlJztcblxuY29uc3QgZ2xvYmFsX2NvbnN0YW50cyA9IEFQSUNvbnN0YW50cy5nbG9iYWw7XG5jb25zdCBzY29ybTEyX2Vycm9yX2NvZGVzID0gRXJyb3JDb2Rlcy5zY29ybTEyO1xuXG4vKipcbiAqIEJhc2UgQVBJIGNsYXNzIGZvciBBSUNDLCBTQ09STSAxLjIsIGFuZCBTQ09STSAyMDA0LiBTaG91bGQgYmUgY29uc2lkZXJlZFxuICogYWJzdHJhY3QsIGFuZCBuZXZlciBpbml0aWFsaXplZCBvbiBpdCdzIG93bi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUFQSSB7XG4gICN0aW1lb3V0O1xuICAjZXJyb3JfY29kZXM7XG4gICNzZXR0aW5ncyA9IHtcbiAgICBhdXRvY29tbWl0OiBmYWxzZSxcbiAgICBhdXRvY29tbWl0U2Vjb25kczogMTAsXG4gICAgYXN5bmNDb21taXQ6IGZhbHNlLFxuICAgIHNlbmRCZWFjb25Db21taXQ6IGZhbHNlLFxuICAgIGxtc0NvbW1pdFVybDogZmFsc2UsXG4gICAgZGF0YUNvbW1pdEZvcm1hdDogJ2pzb24nLCAvLyB2YWxpZCBmb3JtYXRzIGFyZSAnanNvbicgb3IgJ2ZsYXR0ZW5lZCcsICdwYXJhbXMnXG4gICAgY29tbWl0UmVxdWVzdERhdGFUeXBlOiAnYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PVVURi04JyxcbiAgICBhdXRvUHJvZ3Jlc3M6IGZhbHNlLFxuICAgIGxvZ0xldmVsOiBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9FUlJPUixcbiAgICBzZWxmUmVwb3J0U2Vzc2lvblRpbWU6IGZhbHNlLFxuICAgIGFsd2F5c1NlbmRUb3RhbFRpbWU6IGZhbHNlLFxuICAgIHN0cmljdF9lcnJvcnM6IHRydWUsXG4gICAgcmVzcG9uc2VIYW5kbGVyOiBmdW5jdGlvbih4aHIpIHtcbiAgICAgIGxldCByZXN1bHQ7XG4gICAgICBpZiAodHlwZW9mIHhociAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gbnVsbCB8fCAhe30uaGFzT3duUHJvcGVydHkuY2FsbChyZXN1bHQsICdyZXN1bHQnKSkge1xuICAgICAgICAgIHJlc3VsdCA9IHt9O1xuICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIHJlc3VsdC5yZXN1bHQgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUU7XG4gICAgICAgICAgICByZXN1bHQuZXJyb3JDb2RlID0gMDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0LnJlc3VsdCA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG4gICAgICAgICAgICByZXN1bHQuZXJyb3JDb2RlID0gMTAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LFxuICB9O1xuICBjbWk7XG4gIHN0YXJ0aW5nRGF0YToge307XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBCYXNlIEFQSSBjbGFzcy4gU2V0cyBzb21lIHNoYXJlZCBBUEkgZmllbGRzLCBhcyB3ZWxsIGFzXG4gICAqIHNldHMgdXAgb3B0aW9ucyBmb3IgdGhlIEFQSS5cbiAgICogQHBhcmFtIHtvYmplY3R9IGVycm9yX2NvZGVzXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgY29uc3RydWN0b3IoZXJyb3JfY29kZXMsIHNldHRpbmdzKSB7XG4gICAgaWYgKG5ldy50YXJnZXQgPT09IEJhc2VBUEkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb25zdHJ1Y3QgQmFzZUFQSSBpbnN0YW5jZXMgZGlyZWN0bHknKTtcbiAgICB9XG4gICAgdGhpcy5jdXJyZW50U3RhdGUgPSBnbG9iYWxfY29uc3RhbnRzLlNUQVRFX05PVF9JTklUSUFMSVpFRDtcbiAgICB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuICAgIHRoaXMubGlzdGVuZXJBcnJheSA9IFtdO1xuXG4gICAgdGhpcy4jdGltZW91dCA9IG51bGw7XG4gICAgdGhpcy4jZXJyb3JfY29kZXMgPSBlcnJvcl9jb2RlcztcblxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICB0aGlzLmFwaUxvZ0xldmVsID0gdGhpcy5zZXR0aW5ncy5sb2dMZXZlbDtcbiAgICB0aGlzLnNlbGZSZXBvcnRTZXNzaW9uVGltZSA9IHRoaXMuc2V0dGluZ3Muc2VsZlJlcG9ydFNlc3Npb25UaW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIEFQSVxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpbml0aWFsaXplTWVzc2FnZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGVybWluYXRpb25NZXNzYWdlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGluaXRpYWxpemUoXG4gICAgICBjYWxsYmFja05hbWU6IFN0cmluZyxcbiAgICAgIGluaXRpYWxpemVNZXNzYWdlPzogU3RyaW5nLFxuICAgICAgdGVybWluYXRpb25NZXNzYWdlPzogU3RyaW5nKSB7XG4gICAgbGV0IHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcblxuICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQoKSkge1xuICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IodGhpcy4jZXJyb3JfY29kZXMuSU5JVElBTElaRUQsIGluaXRpYWxpemVNZXNzYWdlKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNUZXJtaW5hdGVkKCkpIHtcbiAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHRoaXMuI2Vycm9yX2NvZGVzLlRFUk1JTkFURUQsIHRlcm1pbmF0aW9uTWVzc2FnZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLnNlbGZSZXBvcnRTZXNzaW9uVGltZSkge1xuICAgICAgICB0aGlzLmNtaS5zZXRTdGFydFRpbWUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBnbG9iYWxfY29uc3RhbnRzLlNUQVRFX0lOSVRJQUxJWkVEO1xuICAgICAgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcbiAgICAgIHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBudWxsLCAncmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG4gICAgdGhpcy5jbGVhclNDT1JNRXJyb3IocmV0dXJuVmFsdWUpO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2Vycm9yX2NvZGVzXG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIGdldCBlcnJvcl9jb2RlcygpIHtcbiAgICByZXR1cm4gdGhpcy4jZXJyb3JfY29kZXM7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc2V0dGluZ3NcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cbiAgZ2V0IHNldHRpbmdzKCkge1xuICAgIHJldHVybiB0aGlzLiNzZXR0aW5ncztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzZXR0aW5nc1xuICAgKiBAcGFyYW0ge29iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIHNldCBzZXR0aW5ncyhzZXR0aW5nczogT2JqZWN0KSB7XG4gICAgdGhpcy4jc2V0dGluZ3MgPSB7Li4udGhpcy4jc2V0dGluZ3MsIC4uLnNldHRpbmdzfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUZXJtaW5hdGVzIHRoZSBjdXJyZW50IHJ1biBvZiB0aGUgQVBJXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHBhcmFtIHtib29sZWFufSBjaGVja1Rlcm1pbmF0ZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgdGVybWluYXRlKFxuICAgICAgY2FsbGJhY2tOYW1lOiBTdHJpbmcsXG4gICAgICBjaGVja1Rlcm1pbmF0ZWQ6IGJvb2xlYW4pIHtcbiAgICBsZXQgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuXG4gICAgaWYgKHRoaXMuY2hlY2tTdGF0ZShjaGVja1Rlcm1pbmF0ZWQsXG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLlRFUk1JTkFUSU9OX0JFRk9SRV9JTklULFxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5NVUxUSVBMRV9URVJNSU5BVElPTikpIHtcbiAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gZ2xvYmFsX2NvbnN0YW50cy5TVEFURV9URVJNSU5BVEVEO1xuXG4gICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnN0b3JlRGF0YSh0cnVlKTtcbiAgICAgIGlmICghdGhpcy5zZXR0aW5ncy5zZW5kQmVhY29uQ29tbWl0ICYmICF0aGlzLnNldHRpbmdzLmFzeW5jQ29tbWl0ICYmXG4gICAgICAgICAgdHlwZW9mIHJlc3VsdC5lcnJvckNvZGUgIT09ICd1bmRlZmluZWQnICYmIHJlc3VsdC5lcnJvckNvZGUgPiAwKSB7XG4gICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHJlc3VsdC5lcnJvckNvZGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuVmFsdWUgPSAodHlwZW9mIHJlc3VsdCAhPT0gJ3VuZGVmaW5lZCcgJiYgcmVzdWx0LnJlc3VsdCkgP1xuICAgICAgICAgIHJlc3VsdC5yZXN1bHQgOiBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuXG4gICAgICBpZiAoY2hlY2tUZXJtaW5hdGVkKSB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuXG4gICAgICByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRTtcbiAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUpO1xuICAgIH1cblxuICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgbnVsbCwgJ3JldHVybmVkOiAnICsgcmV0dXJuVmFsdWUsXG4gICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pO1xuICAgIHRoaXMuY2xlYXJTQ09STUVycm9yKHJldHVyblZhbHVlKTtcblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHZhbHVlIG9mIHRoZSBDTUlFbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tUZXJtaW5hdGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldFZhbHVlKFxuICAgICAgY2FsbGJhY2tOYW1lOiBTdHJpbmcsXG4gICAgICBjaGVja1Rlcm1pbmF0ZWQ6IGJvb2xlYW4sXG4gICAgICBDTUlFbGVtZW50OiBTdHJpbmcpIHtcbiAgICBsZXQgcmV0dXJuVmFsdWU7XG5cbiAgICBpZiAodGhpcy5jaGVja1N0YXRlKGNoZWNrVGVybWluYXRlZCxcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuUkVUUklFVkVfQkVGT1JFX0lOSVQsXG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLlJFVFJJRVZFX0FGVEVSX1RFUk0pKSB7XG4gICAgICBpZiAoY2hlY2tUZXJtaW5hdGVkKSB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuVmFsdWUgPSB0aGlzLmdldENNSVZhbHVlKENNSUVsZW1lbnQpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIFZhbGlkYXRpb25FcnJvcikge1xuICAgICAgICAgIHRoaXMubGFzdEVycm9yQ29kZSA9IGUuZXJyb3JDb2RlO1xuICAgICAgICAgIHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoZS5tZXNzYWdlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUubWVzc2FnZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHRoaXMuI2Vycm9yX2NvZGVzLkdFTkVSQUwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lLCBDTUlFbGVtZW50KTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIENNSUVsZW1lbnQsICc6IHJldHVybmVkOiAnICsgcmV0dXJuVmFsdWUsXG4gICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pO1xuICAgIHRoaXMuY2xlYXJTQ09STUVycm9yKHJldHVyblZhbHVlKTtcblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgQ01JRWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29tbWl0Q2FsbGJhY2tcbiAgICogQHBhcmFtIHtib29sZWFufSBjaGVja1Rlcm1pbmF0ZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBzZXRWYWx1ZShcbiAgICAgIGNhbGxiYWNrTmFtZTogU3RyaW5nLFxuICAgICAgY29tbWl0Q2FsbGJhY2s6IFN0cmluZyxcbiAgICAgIGNoZWNrVGVybWluYXRlZDogYm9vbGVhbixcbiAgICAgIENNSUVsZW1lbnQsXG4gICAgICB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSk7XG4gICAgfVxuICAgIGxldCByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG5cbiAgICBpZiAodGhpcy5jaGVja1N0YXRlKGNoZWNrVGVybWluYXRlZCwgdGhpcy4jZXJyb3JfY29kZXMuU1RPUkVfQkVGT1JFX0lOSVQsXG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLlNUT1JFX0FGVEVSX1RFUk0pKSB7XG4gICAgICBpZiAoY2hlY2tUZXJtaW5hdGVkKSB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuVmFsdWUgPSB0aGlzLnNldENNSVZhbHVlKENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBWYWxpZGF0aW9uRXJyb3IpIHtcbiAgICAgICAgICB0aGlzLmxhc3RFcnJvckNvZGUgPSBlLmVycm9yQ29kZTtcbiAgICAgICAgICByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGUubWVzc2FnZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlLm1lc3NhZ2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcih0aGlzLiNlcnJvcl9jb2Rlcy5HRU5FUkFMKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSwgQ01JRWxlbWVudCwgdmFsdWUpO1xuICAgIH1cblxuICAgIGlmIChyZXR1cm5WYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG4gICAgfVxuXG4gICAgLy8gSWYgd2UgZGlkbid0IGhhdmUgYW55IGVycm9ycyB3aGlsZSBzZXR0aW5nIHRoZSBkYXRhLCBnbyBhaGVhZCBhbmRcbiAgICAvLyBzY2hlZHVsZSBhIGNvbW1pdCwgaWYgYXV0b2NvbW1pdCBpcyB0dXJuZWQgb25cbiAgICBpZiAoU3RyaW5nKHRoaXMubGFzdEVycm9yQ29kZSkgPT09ICcwJykge1xuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuYXV0b2NvbW1pdCAmJiAhdGhpcy4jdGltZW91dCkge1xuICAgICAgICB0aGlzLnNjaGVkdWxlQ29tbWl0KHRoaXMuc2V0dGluZ3MuYXV0b2NvbW1pdFNlY29uZHMgKiAxMDAwLCBjb21taXRDYWxsYmFjayk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBDTUlFbGVtZW50LFxuICAgICAgICAnOiAnICsgdmFsdWUgKyAnOiByZXN1bHQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG4gICAgdGhpcy5jbGVhclNDT1JNRXJyb3IocmV0dXJuVmFsdWUpO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIE9yZGVycyBMTVMgdG8gc3RvcmUgYWxsIGNvbnRlbnQgcGFyYW1ldGVyc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tUZXJtaW5hdGVkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGNvbW1pdChcbiAgICAgIGNhbGxiYWNrTmFtZTogU3RyaW5nLFxuICAgICAgY2hlY2tUZXJtaW5hdGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5jbGVhclNjaGVkdWxlZENvbW1pdCgpO1xuXG4gICAgbGV0IHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcblxuICAgIGlmICh0aGlzLmNoZWNrU3RhdGUoY2hlY2tUZXJtaW5hdGVkLCB0aGlzLiNlcnJvcl9jb2Rlcy5DT01NSVRfQkVGT1JFX0lOSVQsXG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLkNPTU1JVF9BRlRFUl9URVJNKSkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5zdG9yZURhdGEoZmFsc2UpO1xuICAgICAgaWYgKCF0aGlzLnNldHRpbmdzLnNlbmRCZWFjb25Db21taXQgJiYgIXRoaXMuc2V0dGluZ3MuYXN5bmNDb21taXQgJiZcbiAgICAgICAgICByZXN1bHQuZXJyb3JDb2RlICYmIHJlc3VsdC5lcnJvckNvZGUgPiAwKSB7XG4gICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHJlc3VsdC5lcnJvckNvZGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuVmFsdWUgPSAodHlwZW9mIHJlc3VsdCAhPT0gJ3VuZGVmaW5lZCcgJiYgcmVzdWx0LnJlc3VsdCkgP1xuICAgICAgICAgIHJlc3VsdC5yZXN1bHQgOiBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuXG4gICAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsICdIdHRwUmVxdWVzdCcsICcgUmVzdWx0OiAnICsgcmV0dXJuVmFsdWUsXG4gICAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfREVCVUcpO1xuXG4gICAgICBpZiAoY2hlY2tUZXJtaW5hdGVkKSB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuXG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcbiAgICB0aGlzLmNsZWFyU0NPUk1FcnJvcihyZXR1cm5WYWx1ZSk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBsYXN0IGVycm9yIGNvZGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXRMYXN0RXJyb3IoY2FsbGJhY2tOYW1lOiBTdHJpbmcpIHtcbiAgICBjb25zdCByZXR1cm5WYWx1ZSA9IFN0cmluZyh0aGlzLmxhc3RFcnJvckNvZGUpO1xuXG4gICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSk7XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBlcnJvck51bWJlciBlcnJvciBkZXNjcmlwdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXIpfSBDTUlFcnJvckNvZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0RXJyb3JTdHJpbmcoY2FsbGJhY2tOYW1lOiBTdHJpbmcsIENNSUVycm9yQ29kZSkge1xuICAgIGxldCByZXR1cm5WYWx1ZSA9ICcnO1xuXG4gICAgaWYgKENNSUVycm9yQ29kZSAhPT0gbnVsbCAmJiBDTUlFcnJvckNvZGUgIT09ICcnKSB7XG4gICAgICByZXR1cm5WYWx1ZSA9IHRoaXMuZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhDTUlFcnJvckNvZGUpO1xuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBudWxsLCAncmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGNvbXByZWhlbnNpdmUgZGVzY3JpcHRpb24gb2YgdGhlIGVycm9yTnVtYmVyIGVycm9yLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXIpfSBDTUlFcnJvckNvZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0RGlhZ25vc3RpYyhjYWxsYmFja05hbWU6IFN0cmluZywgQ01JRXJyb3JDb2RlKSB7XG4gICAgbGV0IHJldHVyblZhbHVlID0gJyc7XG5cbiAgICBpZiAoQ01JRXJyb3JDb2RlICE9PSBudWxsICYmIENNSUVycm9yQ29kZSAhPT0gJycpIHtcbiAgICAgIHJldHVyblZhbHVlID0gdGhpcy5nZXRMbXNFcnJvck1lc3NhZ2VEZXRhaWxzKENNSUVycm9yQ29kZSwgdHJ1ZSk7XG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgdGhlIExNUyBzdGF0ZSBhbmQgZW5zdXJlcyBpdCBoYXMgYmVlbiBpbml0aWFsaXplZC5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBjaGVja1Rlcm1pbmF0ZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGJlZm9yZUluaXRFcnJvclxuICAgKiBAcGFyYW0ge251bWJlcn0gYWZ0ZXJUZXJtRXJyb3JcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGNoZWNrU3RhdGUoXG4gICAgICBjaGVja1Rlcm1pbmF0ZWQ6IGJvb2xlYW4sXG4gICAgICBiZWZvcmVJbml0RXJyb3I6IG51bWJlcixcbiAgICAgIGFmdGVyVGVybUVycm9yPzogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuaXNOb3RJbml0aWFsaXplZCgpKSB7XG4gICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihiZWZvcmVJbml0RXJyb3IpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoY2hlY2tUZXJtaW5hdGVkICYmIHRoaXMuaXNUZXJtaW5hdGVkKCkpIHtcbiAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGFmdGVyVGVybUVycm9yKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2dnaW5nIGZvciBhbGwgU0NPUk0gYWN0aW9uc1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZnVuY3Rpb25OYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2dNZXNzYWdlXG4gICAqIEBwYXJhbSB7bnVtYmVyfW1lc3NhZ2VMZXZlbFxuICAgKi9cbiAgYXBpTG9nKFxuICAgICAgZnVuY3Rpb25OYW1lOiBTdHJpbmcsXG4gICAgICBDTUlFbGVtZW50OiBTdHJpbmcsXG4gICAgICBsb2dNZXNzYWdlOiBTdHJpbmcsXG4gICAgICBtZXNzYWdlTGV2ZWw6IG51bWJlcikge1xuICAgIGxvZ01lc3NhZ2UgPSB0aGlzLmZvcm1hdE1lc3NhZ2UoZnVuY3Rpb25OYW1lLCBDTUlFbGVtZW50LCBsb2dNZXNzYWdlKTtcblxuICAgIGlmIChtZXNzYWdlTGV2ZWwgPj0gdGhpcy5hcGlMb2dMZXZlbCkge1xuICAgICAgc3dpdGNoIChtZXNzYWdlTGV2ZWwpIHtcbiAgICAgICAgY2FzZSBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9FUlJPUjpcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGxvZ01lc3NhZ2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX1dBUk5JTkc6XG4gICAgICAgICAgY29uc29sZS53YXJuKGxvZ01lc3NhZ2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk86XG4gICAgICAgICAgY29uc29sZS5pbmZvKGxvZ01lc3NhZ2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0RFQlVHOlxuICAgICAgICAgIGlmIChjb25zb2xlLmRlYnVnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKGxvZ01lc3NhZ2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhsb2dNZXNzYWdlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZvcm1hdHMgdGhlIFNDT1JNIG1lc3NhZ2VzIGZvciBlYXN5IHJlYWRpbmdcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZ1bmN0aW9uTmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmb3JtYXRNZXNzYWdlKGZ1bmN0aW9uTmFtZTogU3RyaW5nLCBDTUlFbGVtZW50OiBTdHJpbmcsIG1lc3NhZ2U6IFN0cmluZykge1xuICAgIGNvbnN0IGJhc2VMZW5ndGggPSAyMDtcbiAgICBsZXQgbWVzc2FnZVN0cmluZyA9ICcnO1xuXG4gICAgbWVzc2FnZVN0cmluZyArPSBmdW5jdGlvbk5hbWU7XG5cbiAgICBsZXQgZmlsbENoYXJzID0gYmFzZUxlbmd0aCAtIG1lc3NhZ2VTdHJpbmcubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxsQ2hhcnM7IGkrKykge1xuICAgICAgbWVzc2FnZVN0cmluZyArPSAnICc7XG4gICAgfVxuXG4gICAgbWVzc2FnZVN0cmluZyArPSAnOiAnO1xuXG4gICAgaWYgKENNSUVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IENNSUVsZW1lbnRCYXNlTGVuZ3RoID0gNzA7XG5cbiAgICAgIG1lc3NhZ2VTdHJpbmcgKz0gQ01JRWxlbWVudDtcblxuICAgICAgZmlsbENoYXJzID0gQ01JRWxlbWVudEJhc2VMZW5ndGggLSBtZXNzYWdlU3RyaW5nLmxlbmd0aDtcblxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBmaWxsQ2hhcnM7IGorKykge1xuICAgICAgICBtZXNzYWdlU3RyaW5nICs9ICcgJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobWVzc2FnZSkge1xuICAgICAgbWVzc2FnZVN0cmluZyArPSBtZXNzYWdlO1xuICAgIH1cblxuICAgIHJldHVybiBtZXNzYWdlU3RyaW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB0byBzZWUgaWYge3N0cn0gY29udGFpbnMge3Rlc3Rlcn1cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciBTdHJpbmcgdG8gY2hlY2sgYWdhaW5zdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGVzdGVyIFN0cmluZyB0byBjaGVjayBmb3JcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIHN0cmluZ01hdGNoZXMoc3RyOiBTdHJpbmcsIHRlc3RlcjogU3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0ciAmJiB0ZXN0ZXIgJiYgc3RyLm1hdGNoKHRlc3Rlcik7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgdG8gc2VlIGlmIHRoZSBzcGVjaWZpYyBvYmplY3QgaGFzIHRoZSBnaXZlbiBwcm9wZXJ0eVxuICAgKiBAcGFyYW0geyp9IHJlZk9iamVjdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY2hlY2tPYmplY3RIYXNQcm9wZXJ0eShyZWZPYmplY3QsIGF0dHJpYnV0ZTogU3RyaW5nKSB7XG4gICAgcmV0dXJuIE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlZk9iamVjdCwgYXR0cmlidXRlKSB8fFxuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFxuICAgICAgICAgICAgT2JqZWN0LmdldFByb3RvdHlwZU9mKHJlZk9iamVjdCksIGF0dHJpYnV0ZSkgfHxcbiAgICAgICAgKGF0dHJpYnV0ZSBpbiByZWZPYmplY3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1lc3NhZ2UgdGhhdCBjb3JyZXNwb25kcyB0byBlcnJvck51bWJlclxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXIpfSBfZXJyb3JOdW1iZXJcbiAgICogQHBhcmFtIHtib29sZWFufSBfZGV0YWlsXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBnZXRMbXNFcnJvck1lc3NhZ2VEZXRhaWxzKF9lcnJvck51bWJlciwgX2RldGFpbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ1RoZSBnZXRMbXNFcnJvck1lc3NhZ2VEZXRhaWxzIG1ldGhvZCBoYXMgbm90IGJlZW4gaW1wbGVtZW50ZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSB2YWx1ZSBmb3IgdGhlIHNwZWNpZmljIGVsZW1lbnQuXG4gICAqIEFQSXMgdGhhdCBpbmhlcml0IEJhc2VBUEkgc2hvdWxkIG92ZXJyaWRlIHRoaXMgZnVuY3Rpb25cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IF9DTUlFbGVtZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBnZXRDTUlWYWx1ZShfQ01JRWxlbWVudCkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIGdldENNSVZhbHVlIG1ldGhvZCBoYXMgbm90IGJlZW4gaW1wbGVtZW50ZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBmb3IgdGhlIHNwZWNpZmljIGVsZW1lbnQuXG4gICAqIEFQSXMgdGhhdCBpbmhlcml0IEJhc2VBUEkgc2hvdWxkIG92ZXJyaWRlIHRoaXMgZnVuY3Rpb25cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IF9DTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7YW55fSBfdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHNldENNSVZhbHVlKF9DTUlFbGVtZW50LCBfdmFsdWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBzZXRDTUlWYWx1ZSBtZXRob2QgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogU2hhcmVkIEFQSSBtZXRob2QgdG8gc2V0IGEgdmFsaWQgZm9yIGEgZ2l2ZW4gZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZE5hbWVcbiAgICogQHBhcmFtIHtib29sZWFufSBzY29ybTIwMDRcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBfY29tbW9uU2V0Q01JVmFsdWUoXG4gICAgICBtZXRob2ROYW1lOiBTdHJpbmcsIHNjb3JtMjAwNDogYm9vbGVhbiwgQ01JRWxlbWVudCwgdmFsdWUpIHtcbiAgICBpZiAoIUNNSUVsZW1lbnQgfHwgQ01JRWxlbWVudCA9PT0gJycpIHtcbiAgICAgIHJldHVybiBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuICAgIH1cblxuICAgIGNvbnN0IHN0cnVjdHVyZSA9IENNSUVsZW1lbnQuc3BsaXQoJy4nKTtcbiAgICBsZXQgcmVmT2JqZWN0ID0gdGhpcztcbiAgICBsZXQgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuICAgIGxldCBmb3VuZEZpcnN0SW5kZXggPSBmYWxzZTtcblxuICAgIGNvbnN0IGludmFsaWRFcnJvck1lc3NhZ2UgPSBgVGhlIGRhdGEgbW9kZWwgZWxlbWVudCBwYXNzZWQgdG8gJHttZXRob2ROYW1lfSAoJHtDTUlFbGVtZW50fSkgaXMgbm90IGEgdmFsaWQgU0NPUk0gZGF0YSBtb2RlbCBlbGVtZW50LmA7XG4gICAgY29uc3QgaW52YWxpZEVycm9yQ29kZSA9IHNjb3JtMjAwNCA/XG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLlVOREVGSU5FRF9EQVRBX01PREVMIDpcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuR0VORVJBTDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RydWN0dXJlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBhdHRyaWJ1dGUgPSBzdHJ1Y3R1cmVbaV07XG5cbiAgICAgIGlmIChpID09PSBzdHJ1Y3R1cmUubGVuZ3RoIC0gMSkge1xuICAgICAgICBpZiAoc2Nvcm0yMDA0ICYmIChhdHRyaWJ1dGUuc3Vic3RyKDAsIDgpID09PSAne3RhcmdldD0nKSAmJlxuICAgICAgICAgICAgKHR5cGVvZiByZWZPYmplY3QuX2lzVGFyZ2V0VmFsaWQgPT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcih0aGlzLiNlcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX2NoZWNrT2JqZWN0SGFzUHJvcGVydHkocmVmT2JqZWN0LCBhdHRyaWJ1dGUpKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoaW52YWxpZEVycm9yQ29kZSwgaW52YWxpZEVycm9yTWVzc2FnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNJbml0aWFsaXplZCgpICYmXG4gICAgICAgICAgICAgIHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LCAnXFxcXC5jb3JyZWN0X3Jlc3BvbnNlc1xcXFwuXFxcXGQrJykpIHtcbiAgICAgICAgICAgIHRoaXMudmFsaWRhdGVDb3JyZWN0UmVzcG9uc2UoQ01JRWxlbWVudCwgdmFsdWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghc2Nvcm0yMDA0IHx8IHRoaXMubGFzdEVycm9yQ29kZSA9PT0gMCkge1xuICAgICAgICAgICAgcmVmT2JqZWN0W2F0dHJpYnV0ZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVmT2JqZWN0ID0gcmVmT2JqZWN0W2F0dHJpYnV0ZV07XG4gICAgICAgIGlmICghcmVmT2JqZWN0KSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoaW52YWxpZEVycm9yQ29kZSwgaW52YWxpZEVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVmT2JqZWN0IGluc3RhbmNlb2YgQ01JQXJyYXkpIHtcbiAgICAgICAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KHN0cnVjdHVyZVtpICsgMV0sIDEwKTtcblxuICAgICAgICAgIC8vIFNDTyBpcyB0cnlpbmcgdG8gc2V0IGFuIGl0ZW0gb24gYW4gYXJyYXlcbiAgICAgICAgICBpZiAoIWlzTmFOKGluZGV4KSkge1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHJlZk9iamVjdC5jaGlsZEFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgcmVmT2JqZWN0ID0gaXRlbTtcbiAgICAgICAgICAgICAgZm91bmRGaXJzdEluZGV4ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnN0IG5ld0NoaWxkID0gdGhpcy5nZXRDaGlsZEVsZW1lbnQoQ01JRWxlbWVudCwgdmFsdWUsXG4gICAgICAgICAgICAgICAgICBmb3VuZEZpcnN0SW5kZXgpO1xuICAgICAgICAgICAgICBmb3VuZEZpcnN0SW5kZXggPSB0cnVlO1xuXG4gICAgICAgICAgICAgIGlmICghbmV3Q2hpbGQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihpbnZhbGlkRXJyb3JDb2RlLCBpbnZhbGlkRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocmVmT2JqZWN0LmluaXRpYWxpemVkKSBuZXdDaGlsZC5pbml0aWFsaXplKCk7XG5cbiAgICAgICAgICAgICAgICByZWZPYmplY3QuY2hpbGRBcnJheS5wdXNoKG5ld0NoaWxkKTtcbiAgICAgICAgICAgICAgICByZWZPYmplY3QgPSBuZXdDaGlsZDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBIYXZlIHRvIHVwZGF0ZSBpIHZhbHVlIHRvIHNraXAgdGhlIGFycmF5IHBvc2l0aW9uXG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJldHVyblZhbHVlID09PSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFKSB7XG4gICAgICB0aGlzLmFwaUxvZyhtZXRob2ROYW1lLCBudWxsLFxuICAgICAgICAgIGBUaGVyZSB3YXMgYW4gZXJyb3Igc2V0dGluZyB0aGUgdmFsdWUgZm9yOiAke0NNSUVsZW1lbnR9LCB2YWx1ZSBvZjogJHt2YWx1ZX1gLFxuICAgICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX1dBUk5JTkcpO1xuICAgIH1cblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBYnN0cmFjdCBtZXRob2QgZm9yIHZhbGlkYXRpbmcgdGhhdCBhIHJlc3BvbnNlIGlzIGNvcnJlY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfQ01JRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IF92YWx1ZVxuICAgKi9cbiAgdmFsaWRhdGVDb3JyZWN0UmVzcG9uc2UoX0NNSUVsZW1lbnQsIF92YWx1ZSkge1xuICAgIC8vIGp1c3QgYSBzdHViIG1ldGhvZFxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgb3IgYnVpbGRzIGEgbmV3IGNoaWxkIGVsZW1lbnQgdG8gYWRkIHRvIHRoZSBhcnJheS5cbiAgICogQVBJcyB0aGF0IGluaGVyaXQgQmFzZUFQSSBzaG91bGQgb3ZlcnJpZGUgdGhpcyBtZXRob2QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfQ01JRWxlbWVudCAtIHVudXNlZFxuICAgKiBAcGFyYW0geyp9IF92YWx1ZSAtIHVudXNlZFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IF9mb3VuZEZpcnN0SW5kZXggLSB1bnVzZWRcbiAgICogQHJldHVybiB7Kn1cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBnZXRDaGlsZEVsZW1lbnQoX0NNSUVsZW1lbnQsIF92YWx1ZSwgX2ZvdW5kRmlyc3RJbmRleCkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIGdldENoaWxkRWxlbWVudCBtZXRob2QgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHZhbHVlIGZyb20gdGhlIENNSSBPYmplY3RcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZE5hbWVcbiAgICogQHBhcmFtIHtib29sZWFufSBzY29ybTIwMDRcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIF9jb21tb25HZXRDTUlWYWx1ZShtZXRob2ROYW1lOiBTdHJpbmcsIHNjb3JtMjAwNDogYm9vbGVhbiwgQ01JRWxlbWVudCkge1xuICAgIGlmICghQ01JRWxlbWVudCB8fCBDTUlFbGVtZW50ID09PSAnJykge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGNvbnN0IHN0cnVjdHVyZSA9IENNSUVsZW1lbnQuc3BsaXQoJy4nKTtcbiAgICBsZXQgcmVmT2JqZWN0ID0gdGhpcztcbiAgICBsZXQgYXR0cmlidXRlID0gbnVsbDtcblxuICAgIGNvbnN0IHVuaW5pdGlhbGl6ZWRFcnJvck1lc3NhZ2UgPSBgVGhlIGRhdGEgbW9kZWwgZWxlbWVudCBwYXNzZWQgdG8gJHttZXRob2ROYW1lfSAoJHtDTUlFbGVtZW50fSkgaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkLmA7XG4gICAgY29uc3QgaW52YWxpZEVycm9yTWVzc2FnZSA9IGBUaGUgZGF0YSBtb2RlbCBlbGVtZW50IHBhc3NlZCB0byAke21ldGhvZE5hbWV9ICgke0NNSUVsZW1lbnR9KSBpcyBub3QgYSB2YWxpZCBTQ09STSBkYXRhIG1vZGVsIGVsZW1lbnQuYDtcbiAgICBjb25zdCBpbnZhbGlkRXJyb3JDb2RlID0gc2Nvcm0yMDA0ID9cbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuVU5ERUZJTkVEX0RBVEFfTU9ERUwgOlxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5HRU5FUkFMO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHJ1Y3R1cmUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGF0dHJpYnV0ZSA9IHN0cnVjdHVyZVtpXTtcblxuICAgICAgaWYgKCFzY29ybTIwMDQpIHtcbiAgICAgICAgaWYgKGkgPT09IHN0cnVjdHVyZS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLl9jaGVja09iamVjdEhhc1Byb3BlcnR5KHJlZk9iamVjdCwgYXR0cmlidXRlKSkge1xuICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoaW52YWxpZEVycm9yQ29kZSwgaW52YWxpZEVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoKFN0cmluZyhhdHRyaWJ1dGUpLnN1YnN0cigwLCA4KSA9PT0gJ3t0YXJnZXQ9JykgJiZcbiAgICAgICAgICAgICh0eXBlb2YgcmVmT2JqZWN0Ll9pc1RhcmdldFZhbGlkID09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgY29uc3QgdGFyZ2V0ID0gU3RyaW5nKGF0dHJpYnV0ZSkuXG4gICAgICAgICAgICAgIHN1YnN0cig4LCBTdHJpbmcoYXR0cmlidXRlKS5sZW5ndGggLSA5KTtcbiAgICAgICAgICByZXR1cm4gcmVmT2JqZWN0Ll9pc1RhcmdldFZhbGlkKHRhcmdldCk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX2NoZWNrT2JqZWN0SGFzUHJvcGVydHkocmVmT2JqZWN0LCBhdHRyaWJ1dGUpKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoaW52YWxpZEVycm9yQ29kZSwgaW52YWxpZEVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJlZk9iamVjdCA9IHJlZk9iamVjdFthdHRyaWJ1dGVdO1xuICAgICAgaWYgKHJlZk9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlZk9iamVjdCBpbnN0YW5jZW9mIENNSUFycmF5KSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoc3RydWN0dXJlW2kgKyAxXSwgMTApO1xuXG4gICAgICAgIC8vIFNDTyBpcyB0cnlpbmcgdG8gc2V0IGFuIGl0ZW0gb24gYW4gYXJyYXlcbiAgICAgICAgaWYgKCFpc05hTihpbmRleCkpIHtcbiAgICAgICAgICBjb25zdCBpdGVtID0gcmVmT2JqZWN0LmNoaWxkQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgIHJlZk9iamVjdCA9IGl0ZW07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHRoaXMuI2Vycm9yX2NvZGVzLlZBTFVFX05PVF9JTklUSUFMSVpFRCxcbiAgICAgICAgICAgICAgICB1bmluaXRpYWxpemVkRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEhhdmUgdG8gdXBkYXRlIGkgdmFsdWUgdG8gc2tpcCB0aGUgYXJyYXkgcG9zaXRpb25cbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocmVmT2JqZWN0ID09PSBudWxsIHx8IHJlZk9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoIXNjb3JtMjAwNCkge1xuICAgICAgICBpZiAoYXR0cmlidXRlID09PSAnX2NoaWxkcmVuJykge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMTJfZXJyb3JfY29kZXMuQ0hJTERSRU5fRVJST1IpO1xuICAgICAgICB9IGVsc2UgaWYgKGF0dHJpYnV0ZSA9PT0gJ19jb3VudCcpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTEyX2Vycm9yX2NvZGVzLkNPVU5UX0VSUk9SKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVmT2JqZWN0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIEFQSSdzIGN1cnJlbnQgc3RhdGUgaXMgU1RBVEVfSU5JVElBTElaRURcbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGlzSW5pdGlhbGl6ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlID09PSBnbG9iYWxfY29uc3RhbnRzLlNUQVRFX0lOSVRJQUxJWkVEO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgQVBJJ3MgY3VycmVudCBzdGF0ZSBpcyBTVEFURV9OT1RfSU5JVElBTElaRURcbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGlzTm90SW5pdGlhbGl6ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlID09PSBnbG9iYWxfY29uc3RhbnRzLlNUQVRFX05PVF9JTklUSUFMSVpFRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIEFQSSdzIGN1cnJlbnQgc3RhdGUgaXMgU1RBVEVfVEVSTUlOQVRFRFxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgaXNUZXJtaW5hdGVkKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9PT0gZ2xvYmFsX2NvbnN0YW50cy5TVEFURV9URVJNSU5BVEVEO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3ZpZGVzIGEgbWVjaGFuaXNtIGZvciBhdHRhY2hpbmcgdG8gYSBzcGVjaWZpYyBTQ09STSBldmVudFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGlzdGVuZXJOYW1lXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbihsaXN0ZW5lck5hbWU6IFN0cmluZywgY2FsbGJhY2s6IGZ1bmN0aW9uKSB7XG4gICAgaWYgKCFjYWxsYmFjaykgcmV0dXJuO1xuXG4gICAgY29uc3QgbGlzdGVuZXJGdW5jdGlvbnMgPSBsaXN0ZW5lck5hbWUuc3BsaXQoJyAnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3RlbmVyRnVuY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lclNwbGl0ID0gbGlzdGVuZXJGdW5jdGlvbnNbaV0uc3BsaXQoJy4nKTtcbiAgICAgIGlmIChsaXN0ZW5lclNwbGl0Lmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBmdW5jdGlvbk5hbWUgPSBsaXN0ZW5lclNwbGl0WzBdO1xuXG4gICAgICBsZXQgQ01JRWxlbWVudCA9IG51bGw7XG4gICAgICBpZiAobGlzdGVuZXJTcGxpdC5sZW5ndGggPiAxKSB7XG4gICAgICAgIENNSUVsZW1lbnQgPSBsaXN0ZW5lck5hbWUucmVwbGFjZShmdW5jdGlvbk5hbWUgKyAnLicsICcnKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5saXN0ZW5lckFycmF5LnB1c2goe1xuICAgICAgICBmdW5jdGlvbk5hbWU6IGZ1bmN0aW9uTmFtZSxcbiAgICAgICAgQ01JRWxlbWVudDogQ01JRWxlbWVudCxcbiAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuYXBpTG9nKCdvbicsIGZ1bmN0aW9uTmFtZSwgYEFkZGVkIGV2ZW50IGxpc3RlbmVyOiAke3RoaXMubGlzdGVuZXJBcnJheS5sZW5ndGh9YCwgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByb3ZpZGVzIGEgbWVjaGFuaXNtIGZvciBkZXRhY2hpbmcgYSBzcGVjaWZpYyBTQ09STSBldmVudCBsaXN0ZW5lclxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGlzdGVuZXJOYW1lXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvZmYobGlzdGVuZXJOYW1lOiBTdHJpbmcsIGNhbGxiYWNrOiBmdW5jdGlvbikge1xuICAgIGlmICghY2FsbGJhY2spIHJldHVybjtcblxuICAgIGNvbnN0IGxpc3RlbmVyRnVuY3Rpb25zID0gbGlzdGVuZXJOYW1lLnNwbGl0KCcgJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0ZW5lckZ1bmN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbGlzdGVuZXJTcGxpdCA9IGxpc3RlbmVyRnVuY3Rpb25zW2ldLnNwbGl0KCcuJyk7XG4gICAgICBpZiAobGlzdGVuZXJTcGxpdC5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgICAgY29uc3QgZnVuY3Rpb25OYW1lID0gbGlzdGVuZXJTcGxpdFswXTtcblxuICAgICAgbGV0IENNSUVsZW1lbnQgPSBudWxsO1xuICAgICAgaWYgKGxpc3RlbmVyU3BsaXQubGVuZ3RoID4gMSkge1xuICAgICAgICBDTUlFbGVtZW50ID0gbGlzdGVuZXJOYW1lLnJlcGxhY2UoZnVuY3Rpb25OYW1lICsgJy4nLCAnJyk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlbW92ZUluZGV4ID0gdGhpcy5saXN0ZW5lckFycmF5LmZpbmRJbmRleCgob2JqKSA9PlxuICAgICAgICBvYmouZnVuY3Rpb25OYW1lID09PSBmdW5jdGlvbk5hbWUgJiZcbiAgICAgICAgb2JqLkNNSUVsZW1lbnQgPT09IENNSUVsZW1lbnQgJiZcbiAgICAgICAgb2JqLmNhbGxiYWNrID09PSBjYWxsYmFja1xuICAgICAgKTtcbiAgICAgIGlmIChyZW1vdmVJbmRleCAhPT0gLTEpIHtcbiAgICAgICAgdGhpcy5saXN0ZW5lckFycmF5LnNwbGljZShyZW1vdmVJbmRleCwgMSk7XG4gICAgICAgIHRoaXMuYXBpTG9nKCdvZmYnLCBmdW5jdGlvbk5hbWUsIGBSZW1vdmVkIGV2ZW50IGxpc3RlbmVyOiAke3RoaXMubGlzdGVuZXJBcnJheS5sZW5ndGh9YCwgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByb3ZpZGVzIGEgbWVjaGFuaXNtIGZvciBjbGVhcmluZyBhbGwgbGlzdGVuZXJzIGZyb20gYSBzcGVjaWZpYyBTQ09STSBldmVudFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGlzdGVuZXJOYW1lXG4gICAqL1xuICBjbGVhcihsaXN0ZW5lck5hbWU6IFN0cmluZykge1xuICAgIGNvbnN0IGxpc3RlbmVyRnVuY3Rpb25zID0gbGlzdGVuZXJOYW1lLnNwbGl0KCcgJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0ZW5lckZ1bmN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbGlzdGVuZXJTcGxpdCA9IGxpc3RlbmVyRnVuY3Rpb25zW2ldLnNwbGl0KCcuJyk7XG4gICAgICBpZiAobGlzdGVuZXJTcGxpdC5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgICAgY29uc3QgZnVuY3Rpb25OYW1lID0gbGlzdGVuZXJTcGxpdFswXTtcblxuICAgICAgbGV0IENNSUVsZW1lbnQgPSBudWxsO1xuICAgICAgaWYgKGxpc3RlbmVyU3BsaXQubGVuZ3RoID4gMSkge1xuICAgICAgICBDTUlFbGVtZW50ID0gbGlzdGVuZXJOYW1lLnJlcGxhY2UoZnVuY3Rpb25OYW1lICsgJy4nLCAnJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGlzdGVuZXJBcnJheSA9IHRoaXMubGlzdGVuZXJBcnJheS5maWx0ZXIoKG9iaikgPT5cbiAgICAgICAgb2JqLmZ1bmN0aW9uTmFtZSAhPT0gZnVuY3Rpb25OYW1lICYmXG4gICAgICAgIG9iai5DTUlFbGVtZW50ICE9PSBDTUlFbGVtZW50LFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHJvY2Vzc2VzIGFueSAnb24nIGxpc3RlbmVycyB0aGF0IGhhdmUgYmVlbiBjcmVhdGVkXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmdW5jdGlvbk5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKi9cbiAgcHJvY2Vzc0xpc3RlbmVycyhmdW5jdGlvbk5hbWU6IFN0cmluZywgQ01JRWxlbWVudDogU3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5hcGlMb2coZnVuY3Rpb25OYW1lLCBDTUlFbGVtZW50LCB2YWx1ZSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxpc3RlbmVyQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gdGhpcy5saXN0ZW5lckFycmF5W2ldO1xuICAgICAgY29uc3QgZnVuY3Rpb25zTWF0Y2ggPSBsaXN0ZW5lci5mdW5jdGlvbk5hbWUgPT09IGZ1bmN0aW9uTmFtZTtcbiAgICAgIGNvbnN0IGxpc3RlbmVySGFzQ01JRWxlbWVudCA9ICEhbGlzdGVuZXIuQ01JRWxlbWVudDtcbiAgICAgIGxldCBDTUlFbGVtZW50c01hdGNoID0gZmFsc2U7XG4gICAgICBpZiAoQ01JRWxlbWVudCAmJiBsaXN0ZW5lci5DTUlFbGVtZW50ICYmXG4gICAgICAgICAgbGlzdGVuZXIuQ01JRWxlbWVudC5zdWJzdHJpbmcobGlzdGVuZXIuQ01JRWxlbWVudC5sZW5ndGggLSAxKSA9PT1cbiAgICAgICAgICAnKicpIHtcbiAgICAgICAgQ01JRWxlbWVudHNNYXRjaCA9IENNSUVsZW1lbnQuaW5kZXhPZihsaXN0ZW5lci5DTUlFbGVtZW50LnN1YnN0cmluZygwLFxuICAgICAgICAgICAgbGlzdGVuZXIuQ01JRWxlbWVudC5sZW5ndGggLSAxKSkgPT09IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBDTUlFbGVtZW50c01hdGNoID0gbGlzdGVuZXIuQ01JRWxlbWVudCA9PT0gQ01JRWxlbWVudDtcbiAgICAgIH1cblxuICAgICAgaWYgKGZ1bmN0aW9uc01hdGNoICYmICghbGlzdGVuZXJIYXNDTUlFbGVtZW50IHx8IENNSUVsZW1lbnRzTWF0Y2gpKSB7XG4gICAgICAgIGxpc3RlbmVyLmNhbGxiYWNrKENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhyb3dzIGEgU0NPUk0gZXJyb3JcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGVycm9yTnVtYmVyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXG4gICAqL1xuICB0aHJvd1NDT1JNRXJyb3IoZXJyb3JOdW1iZXI6IG51bWJlciwgbWVzc2FnZTogU3RyaW5nKSB7XG4gICAgaWYgKCFtZXNzYWdlKSB7XG4gICAgICBtZXNzYWdlID0gdGhpcy5nZXRMbXNFcnJvck1lc3NhZ2VEZXRhaWxzKGVycm9yTnVtYmVyKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZygndGhyb3dTQ09STUVycm9yJywgbnVsbCwgZXJyb3JOdW1iZXIgKyAnOiAnICsgbWVzc2FnZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfRVJST1IpO1xuXG4gICAgdGhpcy5sYXN0RXJyb3JDb2RlID0gU3RyaW5nKGVycm9yTnVtYmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIGxhc3QgU0NPUk0gZXJyb3IgY29kZSBvbiBzdWNjZXNzLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3VjY2Vzc1xuICAgKi9cbiAgY2xlYXJTQ09STUVycm9yKHN1Y2Nlc3M6IFN0cmluZykge1xuICAgIGlmIChzdWNjZXNzICE9PSB1bmRlZmluZWQgJiYgc3VjY2VzcyAhPT0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRSkge1xuICAgICAgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdHMgdG8gc3RvcmUgdGhlIGRhdGEgdG8gdGhlIExNUywgbG9ncyBkYXRhIGlmIG5vIExNUyBjb25maWd1cmVkXG4gICAqIEFQSXMgdGhhdCBpbmhlcml0IEJhc2VBUEkgc2hvdWxkIG92ZXJyaWRlIHRoaXMgZnVuY3Rpb25cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBfY2FsY3VsYXRlVG90YWxUaW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBzdG9yZURhdGEoX2NhbGN1bGF0ZVRvdGFsVGltZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ1RoZSBzdG9yZURhdGEgbWV0aG9kIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgdGhlIENNSSBmcm9tIGEgZmxhdHRlbmVkIEpTT04gb2JqZWN0XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBqc29uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqL1xuICBsb2FkRnJvbUZsYXR0ZW5lZEpTT04oanNvbiwgQ01JRWxlbWVudCkge1xuICAgIGlmICghdGhpcy5pc05vdEluaXRpYWxpemVkKCkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgJ2xvYWRGcm9tRmxhdHRlbmVkSlNPTiBjYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlIHRoZSBjYWxsIHRvIGxtc0luaXRpYWxpemUuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGVzdCBtYXRjaCBwYXR0ZXJuLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGFcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY1xuICAgICAqIEBwYXJhbSB7UmVnRXhwfSBhX3BhdHRlcm5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG4gICAgZnVuY3Rpb24gdGVzdFBhdHRlcm4oYSwgYywgYV9wYXR0ZXJuKSB7XG4gICAgICBjb25zdCBhX21hdGNoID0gYS5tYXRjaChhX3BhdHRlcm4pO1xuXG4gICAgICBsZXQgY19tYXRjaDtcbiAgICAgIGlmIChhX21hdGNoICE9PSBudWxsICYmIChjX21hdGNoID0gYy5tYXRjaChhX3BhdHRlcm4pKSAhPT0gbnVsbCkge1xuICAgICAgICBjb25zdCBhX251bSA9IE51bWJlcihhX21hdGNoWzJdKTtcbiAgICAgICAgY29uc3QgY19udW0gPSBOdW1iZXIoY19tYXRjaFsyXSk7XG4gICAgICAgIGlmIChhX251bSA9PT0gY19udW0pIHtcbiAgICAgICAgICBpZiAoYV9tYXRjaFszXSA9PT0gJ2lkJykge1xuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgIH0gZWxzZSBpZiAoYV9tYXRjaFszXSA9PT0gJ3R5cGUnKSB7XG4gICAgICAgICAgICBpZiAoY19tYXRjaFszXSA9PT0gJ2lkJykge1xuICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhX251bSAtIGNfbnVtO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBpbnRfcGF0dGVybiA9IC9eKGNtaVxcLmludGVyYWN0aW9uc1xcLikoXFxkKylcXC4oLiopJC87XG4gICAgY29uc3Qgb2JqX3BhdHRlcm4gPSAvXihjbWlcXC5vYmplY3RpdmVzXFwuKShcXGQrKVxcLiguKikkLztcblxuICAgIGNvbnN0IHJlc3VsdCA9IE9iamVjdC5rZXlzKGpzb24pLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBbU3RyaW5nKGtleSksIGpzb25ba2V5XV07XG4gICAgfSk7XG5cbiAgICAvLyBDTUkgaW50ZXJhY3Rpb25zIG5lZWQgdG8gaGF2ZSBpZCBhbmQgdHlwZSBsb2FkZWQgYmVmb3JlIGFueSBvdGhlciBmaWVsZHNcbiAgICByZXN1bHQuc29ydChmdW5jdGlvbihbYSwgYl0sIFtjLCBkXSkge1xuICAgICAgbGV0IHRlc3Q7XG4gICAgICBpZiAoKHRlc3QgPSB0ZXN0UGF0dGVybihhLCBjLCBpbnRfcGF0dGVybikpICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0ZXN0O1xuICAgICAgfVxuICAgICAgaWYgKCh0ZXN0ID0gdGVzdFBhdHRlcm4oYSwgYywgb2JqX3BhdHRlcm4pKSAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGVzdDtcbiAgICAgIH1cblxuICAgICAgaWYgKGEgPCBjKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICAgIGlmIChhID4gYykge1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAwO1xuICAgIH0pO1xuXG4gICAgbGV0IG9iajtcbiAgICByZXN1bHQuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgb2JqID0ge307XG4gICAgICBvYmpbZWxlbWVudFswXV0gPSBlbGVtZW50WzFdO1xuICAgICAgdGhpcy5sb2FkRnJvbUpTT04odW5mbGF0dGVuKG9iaiksIENNSUVsZW1lbnQpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIENNSSBkYXRhIGZyb20gYSBKU09OIG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGpzb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICovXG4gIGxvYWRGcm9tSlNPTihqc29uLCBDTUlFbGVtZW50KSB7XG4gICAgaWYgKCF0aGlzLmlzTm90SW5pdGlhbGl6ZWQoKSkge1xuICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAnbG9hZEZyb21KU09OIGNhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgdGhlIGNhbGwgdG8gbG1zSW5pdGlhbGl6ZS4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBDTUlFbGVtZW50ID0gQ01JRWxlbWVudCAhPT0gdW5kZWZpbmVkID8gQ01JRWxlbWVudCA6ICdjbWknO1xuXG4gICAgdGhpcy5zdGFydGluZ0RhdGEgPSBqc29uO1xuXG4gICAgLy8gY291bGQgdGhpcyBiZSByZWZhY3RvcmVkIGRvd24gdG8gZmxhdHRlbihqc29uKSB0aGVuIHNldENNSVZhbHVlIG9uIGVhY2g/XG4gICAgZm9yIChjb25zdCBrZXkgaW4ganNvbikge1xuICAgICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoanNvbiwga2V5KSAmJiBqc29uW2tleV0pIHtcbiAgICAgICAgY29uc3QgY3VycmVudENNSUVsZW1lbnQgPSAoQ01JRWxlbWVudCA/IENNSUVsZW1lbnQgKyAnLicgOiAnJykgKyBrZXk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0ganNvbltrZXldO1xuXG4gICAgICAgIGlmICh2YWx1ZVsnY2hpbGRBcnJheSddKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZVsnY2hpbGRBcnJheSddLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRGcm9tSlNPTih2YWx1ZVsnY2hpbGRBcnJheSddW2ldLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRDTUlFbGVtZW50ICsgJy4nICsgaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlLmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHtcbiAgICAgICAgICB0aGlzLmxvYWRGcm9tSlNPTih2YWx1ZSwgY3VycmVudENNSUVsZW1lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0Q01JVmFsdWUoY3VycmVudENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIENNSSBvYmplY3QgdG8gSlNPTiBmb3Igc2VuZGluZyB0byBhbiBMTVMuXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHJlbmRlckNNSVRvSlNPTlN0cmluZygpIHtcbiAgICBjb25zdCBjbWkgPSB0aGlzLmNtaTtcbiAgICAvLyBEbyB3ZSB3YW50L25lZWQgdG8gcmV0dXJuIGZpZWxkcyB0aGF0IGhhdmUgbm8gc2V0IHZhbHVlP1xuICAgIC8vIHJldHVybiBKU09OLnN0cmluZ2lmeSh7IGNtaSB9LCAoaywgdikgPT4gdiA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IHYsIDIpO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh7Y21pfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIEpTIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGN1cnJlbnQgY21pXG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIHJlbmRlckNNSVRvSlNPTk9iamVjdCgpIHtcbiAgICAvLyBEbyB3ZSB3YW50L25lZWQgdG8gcmV0dXJuIGZpZWxkcyB0aGF0IGhhdmUgbm8gc2V0IHZhbHVlP1xuICAgIC8vIHJldHVybiBKU09OLnN0cmluZ2lmeSh7IGNtaSB9LCAoaywgdikgPT4gdiA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IHYsIDIpO1xuICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMucmVuZGVyQ01JVG9KU09OU3RyaW5nKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgY21pIG9iamVjdCB0byB0aGUgcHJvcGVyIGZvcm1hdCBmb3IgTE1TIGNvbW1pdFxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gX3Rlcm1pbmF0ZUNvbW1pdFxuICAgKiBAcmV0dXJuIHsqfVxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHJlbmRlckNvbW1pdENNSShfdGVybWluYXRlQ29tbWl0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlIHN0b3JlRGF0YSBtZXRob2QgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCB0aGUgcmVxdWVzdCB0byB0aGUgTE1TXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHtvYmplY3R8QXJyYXl9IHBhcmFtc1xuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGltbWVkaWF0ZVxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICBwcm9jZXNzSHR0cFJlcXVlc3QodXJsOiBTdHJpbmcsIHBhcmFtcywgaW1tZWRpYXRlID0gZmFsc2UpIHtcbiAgICBjb25zdCBhcGkgPSB0aGlzO1xuICAgIGNvbnN0IHByb2Nlc3MgPSBmdW5jdGlvbih1cmwsIHBhcmFtcywgc2V0dGluZ3MsIGVycm9yX2NvZGVzKSB7XG4gICAgICBjb25zdCBnZW5lcmljRXJyb3IgPSB7XG4gICAgICAgICdyZXN1bHQnOiBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFLFxuICAgICAgICAnZXJyb3JDb2RlJzogZXJyb3JfY29kZXMuR0VORVJBTCxcbiAgICAgIH07XG5cbiAgICAgIGxldCByZXN1bHQ7XG4gICAgICBpZiAoIXNldHRpbmdzLnNlbmRCZWFjb25Db21taXQpIHtcbiAgICAgICAgY29uc3QgaHR0cFJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICBodHRwUmVxLm9wZW4oJ1BPU1QnLCB1cmwsIHNldHRpbmdzLmFzeW5jQ29tbWl0KTtcbiAgICAgICAgaWYgKHNldHRpbmdzLmFzeW5jQ29tbWl0KSB7XG4gICAgICAgICAgaHR0cFJlcS5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHNldHRpbmdzLnJlc3BvbnNlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICByZXN1bHQgPSBzZXR0aW5ncy5yZXNwb25zZUhhbmRsZXIoaHR0cFJlcSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKGh0dHBSZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHBhcmFtcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBodHRwUmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsXG4gICAgICAgICAgICAgICAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xuICAgICAgICAgICAgaHR0cFJlcS5zZW5kKHBhcmFtcy5qb2luKCcmJykpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBodHRwUmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MuY29tbWl0UmVxdWVzdERhdGFUeXBlKTtcbiAgICAgICAgICAgIGh0dHBSZXEuc2VuZChKU09OLnN0cmluZ2lmeShwYXJhbXMpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXNldHRpbmdzLmFzeW5jQ29tbWl0KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHNldHRpbmdzLnJlc3BvbnNlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICByZXN1bHQgPSBzZXR0aW5ncy5yZXNwb25zZUhhbmRsZXIoaHR0cFJlcSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKGh0dHBSZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0ge307XG4gICAgICAgICAgICByZXN1bHQucmVzdWx0ID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgICAgICAgICAgcmVzdWx0LmVycm9yQ29kZSA9IDA7XG4gICAgICAgICAgICBhcGkucHJvY2Vzc0xpc3RlbmVycygnQ29tbWl0U3VjY2VzcycpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIGFwaS5wcm9jZXNzTGlzdGVuZXJzKCdDb21taXRFcnJvcicpO1xuICAgICAgICAgIHJldHVybiBnZW5lcmljRXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgaGVhZGVycyA9IHtcbiAgICAgICAgICAgIHR5cGU6IHNldHRpbmdzLmNvbW1pdFJlcXVlc3REYXRhVHlwZSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGxldCBibG9iO1xuICAgICAgICAgIGlmIChwYXJhbXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgYmxvYiA9IG5ldyBCbG9iKFtwYXJhbXMuam9pbignJicpXSwgaGVhZGVycyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJsb2IgPSBuZXcgQmxvYihbSlNPTi5zdHJpbmdpZnkocGFyYW1zKV0sIGhlYWRlcnMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc3VsdCA9IHt9O1xuICAgICAgICAgIGlmIChuYXZpZ2F0b3Iuc2VuZEJlYWNvbih1cmwsIGJsb2IpKSB7XG4gICAgICAgICAgICByZXN1bHQucmVzdWx0ID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgICAgICAgICAgcmVzdWx0LmVycm9yQ29kZSA9IDA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdC5yZXN1bHQgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuICAgICAgICAgICAgcmVzdWx0LmVycm9yQ29kZSA9IDEwMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIGFwaS5wcm9jZXNzTGlzdGVuZXJzKCdDb21taXRFcnJvcicpO1xuICAgICAgICAgIHJldHVybiBnZW5lcmljRXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiByZXN1bHQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGFwaS5wcm9jZXNzTGlzdGVuZXJzKCdDb21taXRFcnJvcicpO1xuICAgICAgICByZXR1cm4gZ2VuZXJpY0Vycm9yO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzdWx0LnJlc3VsdCA9PT0gdHJ1ZSB8fFxuICAgICAgICAgIHJlc3VsdC5yZXN1bHQgPT09IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRSkge1xuICAgICAgICBhcGkucHJvY2Vzc0xpc3RlbmVycygnQ29tbWl0U3VjY2VzcycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXBpLnByb2Nlc3NMaXN0ZW5lcnMoJ0NvbW1pdEVycm9yJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgZGVib3VuY2UgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCBkZWJvdW5jZWQgPSBkZWJvdW5jZShwcm9jZXNzLCA1MDApO1xuICAgICAgZGVib3VuY2VkKHVybCwgcGFyYW1zLCB0aGlzLnNldHRpbmdzLCB0aGlzLmVycm9yX2NvZGVzKTtcblxuICAgICAgLy8gaWYgd2UncmUgdGVybWluYXRpbmcsIGdvIGFoZWFkIGFuZCBjb21taXQgaW1tZWRpYXRlbHlcbiAgICAgIGlmIChpbW1lZGlhdGUpIHtcbiAgICAgICAgZGVib3VuY2VkLmZsdXNoKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlc3VsdDogZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFLFxuICAgICAgICBlcnJvckNvZGU6IDAsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcHJvY2Vzcyh1cmwsIHBhcmFtcywgdGhpcy5zZXR0aW5ncywgdGhpcy5lcnJvcl9jb2Rlcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRocm93cyBhIFNDT1JNIGVycm9yXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aGVuIC0gdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gd2FpdCBiZWZvcmUgY29tbWl0dGluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2sgLSB0aGUgbmFtZSBvZiB0aGUgY29tbWl0IGV2ZW50IGNhbGxiYWNrXG4gICAqL1xuICBzY2hlZHVsZUNvbW1pdCh3aGVuOiBudW1iZXIsIGNhbGxiYWNrOiBzdHJpbmcpIHtcbiAgICB0aGlzLiN0aW1lb3V0ID0gbmV3IFNjaGVkdWxlZENvbW1pdCh0aGlzLCB3aGVuLCBjYWxsYmFjayk7XG4gICAgdGhpcy5hcGlMb2coJ3NjaGVkdWxlQ29tbWl0JywgJycsICdzY2hlZHVsZWQnLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9ERUJVRyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIGFuZCBjYW5jZWxzIGFueSBjdXJyZW50bHkgc2NoZWR1bGVkIGNvbW1pdHNcbiAgICovXG4gIGNsZWFyU2NoZWR1bGVkQ29tbWl0KCkge1xuICAgIGlmICh0aGlzLiN0aW1lb3V0KSB7XG4gICAgICB0aGlzLiN0aW1lb3V0LmNhbmNlbCgpO1xuICAgICAgdGhpcy4jdGltZW91dCA9IG51bGw7XG4gICAgICB0aGlzLmFwaUxvZygnY2xlYXJTY2hlZHVsZWRDb21taXQnLCAnJywgJ2NsZWFyZWQnLFxuICAgICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0RFQlVHKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBQcml2YXRlIGNsYXNzIHRoYXQgd3JhcHMgYSB0aW1lb3V0IGNhbGwgdG8gdGhlIGNvbW1pdCgpIGZ1bmN0aW9uXG4gKi9cbmNsYXNzIFNjaGVkdWxlZENvbW1pdCB7XG4gICNBUEk7XG4gICNjYW5jZWxsZWQgPSBmYWxzZTtcbiAgI3RpbWVvdXQ7XG4gICNjYWxsYmFjaztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIFNjaGVkdWxlZENvbW1pdFxuICAgKiBAcGFyYW0ge0Jhc2VBUEl9IEFQSVxuICAgKiBAcGFyYW0ge251bWJlcn0gd2hlblxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tcbiAgICovXG4gIGNvbnN0cnVjdG9yKEFQSTogYW55LCB3aGVuOiBudW1iZXIsIGNhbGxiYWNrOiBzdHJpbmcpIHtcbiAgICB0aGlzLiNBUEkgPSBBUEk7XG4gICAgdGhpcy4jdGltZW91dCA9IHNldFRpbWVvdXQodGhpcy53cmFwcGVyLmJpbmQodGhpcyksIHdoZW4pO1xuICAgIHRoaXMuI2NhbGxiYWNrID0gY2FsbGJhY2s7XG4gIH1cblxuICAvKipcbiAgICogQ2FuY2VsIGFueSBjdXJyZW50bHkgc2NoZWR1bGVkIGNvbW1pdFxuICAgKi9cbiAgY2FuY2VsKCkge1xuICAgIHRoaXMuI2NhbmNlbGxlZCA9IHRydWU7XG4gICAgaWYgKHRoaXMuI3RpbWVvdXQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLiN0aW1lb3V0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV3JhcCB0aGUgQVBJIGNvbW1pdCBjYWxsIHRvIGNoZWNrIGlmIHRoZSBjYWxsIGhhcyBhbHJlYWR5IGJlZW4gY2FuY2VsbGVkXG4gICAqL1xuICB3cmFwcGVyKCkge1xuICAgIGlmICghdGhpcy4jY2FuY2VsbGVkKSB7XG4gICAgICB0aGlzLiNBUEkuY29tbWl0KHRoaXMuI2NhbGxiYWNrKTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vIEBmbG93XG5pbXBvcnQgQmFzZUFQSSBmcm9tICcuL0Jhc2VBUEknO1xuaW1wb3J0IHtcbiAgQ01JLFxuICBDTUlJbnRlcmFjdGlvbnNDb3JyZWN0UmVzcG9uc2VzT2JqZWN0LFxuICBDTUlJbnRlcmFjdGlvbnNPYmplY3QsXG4gIENNSUludGVyYWN0aW9uc09iamVjdGl2ZXNPYmplY3QsXG4gIENNSU9iamVjdGl2ZXNPYmplY3QsIE5BVixcbn0gZnJvbSAnLi9jbWkvc2Nvcm0xMl9jbWknO1xuaW1wb3J0ICogYXMgVXRpbGl0aWVzIGZyb20gJy4vdXRpbGl0aWVzJztcbmltcG9ydCBBUElDb25zdGFudHMgZnJvbSAnLi9jb25zdGFudHMvYXBpX2NvbnN0YW50cyc7XG5pbXBvcnQgRXJyb3JDb2RlcyBmcm9tICcuL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5cbmNvbnN0IHNjb3JtMTJfY29uc3RhbnRzID0gQVBJQ29uc3RhbnRzLnNjb3JtMTI7XG5jb25zdCBnbG9iYWxfY29uc3RhbnRzID0gQVBJQ29uc3RhbnRzLmdsb2JhbDtcbmNvbnN0IHNjb3JtMTJfZXJyb3JfY29kZXMgPSBFcnJvckNvZGVzLnNjb3JtMTI7XG5cbi8qKlxuICogQVBJIGNsYXNzIGZvciBTQ09STSAxLjJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2Nvcm0xMkFQSSBleHRlbmRzIEJhc2VBUEkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIFNDT1JNIDEuMiBBUElcbiAgICogQHBhcmFtIHtvYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzZXR0aW5nczoge30pIHtcbiAgICBjb25zdCBmaW5hbFNldHRpbmdzID0ge1xuICAgICAgLi4ue1xuICAgICAgICBtYXN0ZXJ5X292ZXJyaWRlOiBmYWxzZSxcbiAgICAgIH0sIC4uLnNldHRpbmdzLFxuICAgIH07XG5cbiAgICBzdXBlcihzY29ybTEyX2Vycm9yX2NvZGVzLCBmaW5hbFNldHRpbmdzKTtcblxuICAgIHRoaXMuY21pID0gbmV3IENNSSgpO1xuICAgIHRoaXMubmF2ID0gbmV3IE5BVigpO1xuXG4gICAgLy8gUmVuYW1lIGZ1bmN0aW9ucyB0byBtYXRjaCAxLjIgU3BlYyBhbmQgZXhwb3NlIHRvIG1vZHVsZXNcbiAgICB0aGlzLkxNU0luaXRpYWxpemUgPSB0aGlzLmxtc0luaXRpYWxpemU7XG4gICAgdGhpcy5MTVNGaW5pc2ggPSB0aGlzLmxtc0ZpbmlzaDtcbiAgICB0aGlzLkxNU0dldFZhbHVlID0gdGhpcy5sbXNHZXRWYWx1ZTtcbiAgICB0aGlzLkxNU1NldFZhbHVlID0gdGhpcy5sbXNTZXRWYWx1ZTtcbiAgICB0aGlzLkxNU0NvbW1pdCA9IHRoaXMubG1zQ29tbWl0O1xuICAgIHRoaXMuTE1TR2V0TGFzdEVycm9yID0gdGhpcy5sbXNHZXRMYXN0RXJyb3I7XG4gICAgdGhpcy5MTVNHZXRFcnJvclN0cmluZyA9IHRoaXMubG1zR2V0RXJyb3JTdHJpbmc7XG4gICAgdGhpcy5MTVNHZXREaWFnbm9zdGljID0gdGhpcy5sbXNHZXREaWFnbm9zdGljO1xuICB9XG5cbiAgLyoqXG4gICAqIGxtc0luaXRpYWxpemUgZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJvb2xcbiAgICovXG4gIGxtc0luaXRpYWxpemUoKSB7XG4gICAgdGhpcy5jbWkuaW5pdGlhbGl6ZSgpO1xuICAgIHJldHVybiB0aGlzLmluaXRpYWxpemUoJ0xNU0luaXRpYWxpemUnLCAnTE1TIHdhcyBhbHJlYWR5IGluaXRpYWxpemVkIScsXG4gICAgICAgICdMTVMgaXMgYWxyZWFkeSBmaW5pc2hlZCEnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMTVNGaW5pc2ggZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJvb2xcbiAgICovXG4gIGxtc0ZpbmlzaCgpIHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLnRlcm1pbmF0ZSgnTE1TRmluaXNoJywgdHJ1ZSk7XG5cbiAgICBpZiAocmVzdWx0ID09PSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUUpIHtcbiAgICAgIGlmICh0aGlzLm5hdi5ldmVudCAhPT0gJycpIHtcbiAgICAgICAgaWYgKHRoaXMubmF2LmV2ZW50ID09PSAnY29udGludWUnKSB7XG4gICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZU5leHQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlUHJldmlvdXMnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLmF1dG9Qcm9ncmVzcykge1xuICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlTmV4dCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogTE1TR2V0VmFsdWUgZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXRWYWx1ZShDTUlFbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUoJ0xNU0dldFZhbHVlJywgZmFsc2UsIENNSUVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIExNU1NldFZhbHVlIGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNTZXRWYWx1ZShDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnNldFZhbHVlKCdMTVNTZXRWYWx1ZScsICdMTVNDb21taXQnLCBmYWxzZSwgQ01JRWxlbWVudCwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIExNU0NvbW1pdCBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYm9vbFxuICAgKi9cbiAgbG1zQ29tbWl0KCkge1xuICAgIHJldHVybiB0aGlzLmNvbW1pdCgnTE1TQ29tbWl0JywgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIExNU0dldExhc3RFcnJvciBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc0dldExhc3RFcnJvcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRMYXN0RXJyb3IoJ0xNU0dldExhc3RFcnJvcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIExNU0dldEVycm9yU3RyaW5nIGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVycm9yQ29kZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXRFcnJvclN0cmluZyhDTUlFcnJvckNvZGUpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRFcnJvclN0cmluZygnTE1TR2V0RXJyb3JTdHJpbmcnLCBDTUlFcnJvckNvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIExNU0dldERpYWdub3N0aWMgZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRXJyb3JDb2RlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc0dldERpYWdub3N0aWMoQ01JRXJyb3JDb2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RGlhZ25vc3RpYygnTE1TR2V0RGlhZ25vc3RpYycsIENNSUVycm9yQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhIHZhbHVlIG9uIHRoZSBDTUkgT2JqZWN0XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgc2V0Q01JVmFsdWUoQ01JRWxlbWVudCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tbW9uU2V0Q01JVmFsdWUoJ0xNU1NldFZhbHVlJywgZmFsc2UsIENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgdmFsdWUgZnJvbSB0aGUgQ01JIE9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0Q01JVmFsdWUoQ01JRWxlbWVudCkge1xuICAgIHJldHVybiB0aGlzLl9jb21tb25HZXRDTUlWYWx1ZSgnZ2V0Q01JVmFsdWUnLCBmYWxzZSwgQ01JRWxlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBvciBidWlsZHMgYSBuZXcgY2hpbGQgZWxlbWVudCB0byBhZGQgdG8gdGhlIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm91bmRGaXJzdEluZGV4XG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIGdldENoaWxkRWxlbWVudChDTUlFbGVtZW50LCB2YWx1ZSwgZm91bmRGaXJzdEluZGV4KSB7XG4gICAgbGV0IG5ld0NoaWxkO1xuXG4gICAgaWYgKHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LCAnY21pXFxcXC5vYmplY3RpdmVzXFxcXC5cXFxcZCsnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JT2JqZWN0aXZlc09iamVjdCgpO1xuICAgIH0gZWxzZSBpZiAoZm91bmRGaXJzdEluZGV4ICYmIHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LFxuICAgICAgICAnY21pXFxcXC5pbnRlcmFjdGlvbnNcXFxcLlxcXFxkK1xcXFwuY29ycmVjdF9yZXNwb25zZXNcXFxcLlxcXFxkKycpKSB7XG4gICAgICBuZXdDaGlsZCA9IG5ldyBDTUlJbnRlcmFjdGlvbnNDb3JyZWN0UmVzcG9uc2VzT2JqZWN0KCk7XG4gICAgfSBlbHNlIGlmIChmb3VuZEZpcnN0SW5kZXggJiYgdGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsXG4gICAgICAgICdjbWlcXFxcLmludGVyYWN0aW9uc1xcXFwuXFxcXGQrXFxcXC5vYmplY3RpdmVzXFxcXC5cXFxcZCsnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JSW50ZXJhY3Rpb25zT2JqZWN0aXZlc09iamVjdCgpO1xuICAgIH0gZWxzZSBpZiAoIWZvdW5kRmlyc3RJbmRleCAmJlxuICAgICAgICB0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ2NtaVxcXFwuaW50ZXJhY3Rpb25zXFxcXC5cXFxcZCsnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JSW50ZXJhY3Rpb25zT2JqZWN0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0NoaWxkO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlcyBDb3JyZWN0IFJlc3BvbnNlIHZhbHVlc1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICB2YWxpZGF0ZUNvcnJlY3RSZXNwb25zZShDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1lc3NhZ2UgdGhhdCBjb3JyZXNwb25kcyB0byBlcnJvck51bWJlci5cbiAgICpcbiAgICogQHBhcmFtIHsqfSBlcnJvck51bWJlclxuICAgKiBAcGFyYW0ge2Jvb2xlYW4gfWRldGFpbFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXRMbXNFcnJvck1lc3NhZ2VEZXRhaWxzKGVycm9yTnVtYmVyLCBkZXRhaWwpIHtcbiAgICBsZXQgYmFzaWNNZXNzYWdlID0gJ05vIEVycm9yJztcbiAgICBsZXQgZGV0YWlsTWVzc2FnZSA9ICdObyBFcnJvcic7XG5cbiAgICAvLyBTZXQgZXJyb3IgbnVtYmVyIHRvIHN0cmluZyBzaW5jZSBpbmNvbnNpc3RlbnQgZnJvbSBtb2R1bGVzIGlmIHN0cmluZyBvciBudW1iZXJcbiAgICBlcnJvck51bWJlciA9IFN0cmluZyhlcnJvck51bWJlcik7XG4gICAgaWYgKHNjb3JtMTJfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tlcnJvck51bWJlcl0pIHtcbiAgICAgIGJhc2ljTWVzc2FnZSA9IHNjb3JtMTJfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tlcnJvck51bWJlcl0uYmFzaWNNZXNzYWdlO1xuICAgICAgZGV0YWlsTWVzc2FnZSA9IHNjb3JtMTJfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tlcnJvck51bWJlcl0uZGV0YWlsTWVzc2FnZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGV0YWlsID8gZGV0YWlsTWVzc2FnZSA6IGJhc2ljTWVzc2FnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIHRoZSB3aG9sZSBBUEkgd2l0aCBhbm90aGVyXG4gICAqXG4gICAqIEBwYXJhbSB7U2Nvcm0xMkFQSX0gbmV3QVBJXG4gICAqL1xuICByZXBsYWNlV2l0aEFub3RoZXJTY29ybUFQSShuZXdBUEkpIHtcbiAgICAvLyBEYXRhIE1vZGVsXG4gICAgdGhpcy5jbWkgPSBuZXdBUEkuY21pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgY21pIG9iamVjdCB0byB0aGUgcHJvcGVyIGZvcm1hdCBmb3IgTE1TIGNvbW1pdFxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHRlcm1pbmF0ZUNvbW1pdFxuICAgKiBAcmV0dXJuIHtvYmplY3R8QXJyYXl9XG4gICAqL1xuICByZW5kZXJDb21taXRDTUkodGVybWluYXRlQ29tbWl0OiBib29sZWFuKSB7XG4gICAgY29uc3QgY21pRXhwb3J0ID0gdGhpcy5yZW5kZXJDTUlUb0pTT05PYmplY3QoKTtcblxuICAgIGlmICh0ZXJtaW5hdGVDb21taXQpIHtcbiAgICAgIGNtaUV4cG9ydC5jbWkuY29yZS50b3RhbF90aW1lID0gdGhpcy5jbWkuZ2V0Q3VycmVudFRvdGFsVGltZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgIGNvbnN0IGZsYXR0ZW5lZCA9IFV0aWxpdGllcy5mbGF0dGVuKGNtaUV4cG9ydCk7XG4gICAgc3dpdGNoICh0aGlzLnNldHRpbmdzLmRhdGFDb21taXRGb3JtYXQpIHtcbiAgICAgIGNhc2UgJ2ZsYXR0ZW5lZCc6XG4gICAgICAgIHJldHVybiBVdGlsaXRpZXMuZmxhdHRlbihjbWlFeHBvcnQpO1xuICAgICAgY2FzZSAncGFyYW1zJzpcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIGluIGZsYXR0ZW5lZCkge1xuICAgICAgICAgIGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGZsYXR0ZW5lZCwgaXRlbSkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGAke2l0ZW19PSR7ZmxhdHRlbmVkW2l0ZW1dfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgY2FzZSAnanNvbic6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gY21pRXhwb3J0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0cyB0byBzdG9yZSB0aGUgZGF0YSB0byB0aGUgTE1TXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdGVybWluYXRlQ29tbWl0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHN0b3JlRGF0YSh0ZXJtaW5hdGVDb21taXQ6IGJvb2xlYW4pIHtcbiAgICBpZiAodGVybWluYXRlQ29tbWl0KSB7XG4gICAgICBjb25zdCBvcmlnaW5hbFN0YXR1cyA9IHRoaXMuY21pLmNvcmUubGVzc29uX3N0YXR1cztcbiAgICAgIGlmIChvcmlnaW5hbFN0YXR1cyA9PT0gJ25vdCBhdHRlbXB0ZWQnKSB7XG4gICAgICAgIHRoaXMuY21pLmNvcmUubGVzc29uX3N0YXR1cyA9ICdjb21wbGV0ZWQnO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jbWkuY29yZS5sZXNzb25fbW9kZSA9PT0gJ25vcm1hbCcpIHtcbiAgICAgICAgaWYgKHRoaXMuY21pLmNvcmUuY3JlZGl0ID09PSAnY3JlZGl0Jykge1xuICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLm1hc3Rlcnlfb3ZlcnJpZGUgJiZcbiAgICAgICAgICAgICAgdGhpcy5jbWkuc3R1ZGVudF9kYXRhLm1hc3Rlcnlfc2NvcmUgIT09ICcnICYmXG4gICAgICAgICAgICAgIHRoaXMuY21pLmNvcmUuc2NvcmUucmF3ICE9PSAnJykge1xuICAgICAgICAgICAgaWYgKHBhcnNlRmxvYXQodGhpcy5jbWkuY29yZS5zY29yZS5yYXcpID49XG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdCh0aGlzLmNtaS5zdHVkZW50X2RhdGEubWFzdGVyeV9zY29yZSkpIHtcbiAgICAgICAgICAgICAgdGhpcy5jbWkuY29yZS5sZXNzb25fc3RhdHVzID0gJ3Bhc3NlZCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLmNtaS5jb3JlLmxlc3Nvbl9zdGF0dXMgPSAnZmFpbGVkJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jbWkuY29yZS5sZXNzb25fbW9kZSA9PT0gJ2Jyb3dzZScpIHtcbiAgICAgICAgaWYgKCh0aGlzLnN0YXJ0aW5nRGF0YT8uY21pPy5jb3JlPy5sZXNzb25fc3RhdHVzIHx8ICcnKSA9PT0gJycgJiZcbiAgICAgICAgICAgIG9yaWdpbmFsU3RhdHVzID09PSAnbm90IGF0dGVtcHRlZCcpIHtcbiAgICAgICAgICB0aGlzLmNtaS5jb3JlLmxlc3Nvbl9zdGF0dXMgPSAnYnJvd3NlZCc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBjb21taXRPYmplY3QgPSB0aGlzLnJlbmRlckNvbW1pdENNSSh0ZXJtaW5hdGVDb21taXQgfHxcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5hbHdheXNTZW5kVG90YWxUaW1lKTtcblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmxtc0NvbW1pdFVybCkge1xuICAgICAgaWYgKHRoaXMuYXBpTG9nTGV2ZWwgPT09IGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0RFQlVHKSB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ0NvbW1pdCAodGVybWluYXRlZDogJyArXG4gICAgICAgICAgICAodGVybWluYXRlQ29tbWl0ID8gJ3llcycgOiAnbm8nKSArICcpOiAnKTtcbiAgICAgICAgY29uc29sZS5kZWJ1Zyhjb21taXRPYmplY3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0h0dHBSZXF1ZXN0KHRoaXMuc2V0dGluZ3MubG1zQ29tbWl0VXJsLCBjb21taXRPYmplY3QsXG4gICAgICAgICAgdGVybWluYXRlQ29tbWl0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ0NvbW1pdCAodGVybWluYXRlZDogJyArXG4gICAgICAgICAgKHRlcm1pbmF0ZUNvbW1pdCA/ICd5ZXMnIDogJ25vJykgKyAnKTogJyk7XG4gICAgICBjb25zb2xlLmxvZyhjb21taXRPYmplY3QpO1xuICAgICAgcmV0dXJuIGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vIEBmbG93XG5pbXBvcnQgQmFzZUFQSSBmcm9tICcuL0Jhc2VBUEknO1xuaW1wb3J0IHtcbiAgQURMLFxuICBDTUksXG4gIENNSUNvbW1lbnRzT2JqZWN0LFxuICBDTUlJbnRlcmFjdGlvbnNDb3JyZWN0UmVzcG9uc2VzT2JqZWN0LFxuICBDTUlJbnRlcmFjdGlvbnNPYmplY3QsXG4gIENNSUludGVyYWN0aW9uc09iamVjdGl2ZXNPYmplY3QsXG4gIENNSU9iamVjdGl2ZXNPYmplY3QsXG59IGZyb20gJy4vY21pL3Njb3JtMjAwNF9jbWknO1xuaW1wb3J0ICogYXMgVXRpbGl0aWVzIGZyb20gJy4vdXRpbGl0aWVzJztcbmltcG9ydCBBUElDb25zdGFudHMgZnJvbSAnLi9jb25zdGFudHMvYXBpX2NvbnN0YW50cyc7XG5pbXBvcnQgRXJyb3JDb2RlcyBmcm9tICcuL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQgUmVzcG9uc2VzIGZyb20gJy4vY29uc3RhbnRzL3Jlc3BvbnNlX2NvbnN0YW50cyc7XG5pbXBvcnQgVmFsaWRMYW5ndWFnZXMgZnJvbSAnLi9jb25zdGFudHMvbGFuZ3VhZ2VfY29uc3RhbnRzJztcbmltcG9ydCBSZWdleCBmcm9tICcuL2NvbnN0YW50cy9yZWdleCc7XG5cbmNvbnN0IHNjb3JtMjAwNF9jb25zdGFudHMgPSBBUElDb25zdGFudHMuc2Nvcm0yMDA0O1xuY29uc3QgZ2xvYmFsX2NvbnN0YW50cyA9IEFQSUNvbnN0YW50cy5nbG9iYWw7XG5jb25zdCBzY29ybTIwMDRfZXJyb3JfY29kZXMgPSBFcnJvckNvZGVzLnNjb3JtMjAwNDtcbmNvbnN0IGNvcnJlY3RfcmVzcG9uc2VzID0gUmVzcG9uc2VzLmNvcnJlY3Q7XG5jb25zdCBzY29ybTIwMDRfcmVnZXggPSBSZWdleC5zY29ybTIwMDQ7XG5cbi8qKlxuICogQVBJIGNsYXNzIGZvciBTQ09STSAyMDA0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjb3JtMjAwNEFQSSBleHRlbmRzIEJhc2VBUEkge1xuICAjdmVyc2lvbjogJzEuMCc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBTQ09STSAyMDA0IEFQSVxuICAgKiBAcGFyYW0ge29iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiB7fSkge1xuICAgIGNvbnN0IGZpbmFsU2V0dGluZ3MgPSB7XG4gICAgICAuLi57XG4gICAgICAgIG1hc3Rlcnlfb3ZlcnJpZGU6IGZhbHNlLFxuICAgICAgfSwgLi4uc2V0dGluZ3MsXG4gICAgfTtcblxuICAgIHN1cGVyKHNjb3JtMjAwNF9lcnJvcl9jb2RlcywgZmluYWxTZXR0aW5ncyk7XG5cbiAgICB0aGlzLmNtaSA9IG5ldyBDTUkoKTtcbiAgICB0aGlzLmFkbCA9IG5ldyBBREwoKTtcblxuICAgIC8vIFJlbmFtZSBmdW5jdGlvbnMgdG8gbWF0Y2ggMjAwNCBTcGVjIGFuZCBleHBvc2UgdG8gbW9kdWxlc1xuICAgIHRoaXMuSW5pdGlhbGl6ZSA9IHRoaXMubG1zSW5pdGlhbGl6ZTtcbiAgICB0aGlzLlRlcm1pbmF0ZSA9IHRoaXMubG1zVGVybWluYXRlO1xuICAgIHRoaXMuR2V0VmFsdWUgPSB0aGlzLmxtc0dldFZhbHVlO1xuICAgIHRoaXMuU2V0VmFsdWUgPSB0aGlzLmxtc1NldFZhbHVlO1xuICAgIHRoaXMuQ29tbWl0ID0gdGhpcy5sbXNDb21taXQ7XG4gICAgdGhpcy5HZXRMYXN0RXJyb3IgPSB0aGlzLmxtc0dldExhc3RFcnJvcjtcbiAgICB0aGlzLkdldEVycm9yU3RyaW5nID0gdGhpcy5sbXNHZXRFcnJvclN0cmluZztcbiAgICB0aGlzLkdldERpYWdub3N0aWMgPSB0aGlzLmxtc0dldERpYWdub3N0aWM7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdmVyc2lvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdmVyc2lvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jdmVyc2lvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJvb2xcbiAgICovXG4gIGxtc0luaXRpYWxpemUoKSB7XG4gICAgdGhpcy5jbWkuaW5pdGlhbGl6ZSgpO1xuICAgIHJldHVybiB0aGlzLmluaXRpYWxpemUoJ0luaXRpYWxpemUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJvb2xcbiAgICovXG4gIGxtc1Rlcm1pbmF0ZSgpIHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLnRlcm1pbmF0ZSgnVGVybWluYXRlJywgdHJ1ZSk7XG5cbiAgICBpZiAocmVzdWx0ID09PSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUUpIHtcbiAgICAgIGlmICh0aGlzLmFkbC5uYXYucmVxdWVzdCAhPT0gJ19ub25lXycpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLmFkbC5uYXYucmVxdWVzdCkge1xuICAgICAgICAgIGNhc2UgJ2NvbnRpbnVlJzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VOZXh0Jyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdwcmV2aW91cyc6XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlUHJldmlvdXMnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2Nob2ljZSc6XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlQ2hvaWNlJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdleGl0JzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VFeGl0Jyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdleGl0QWxsJzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VFeGl0QWxsJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdhYmFuZG9uJzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VBYmFuZG9uJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdhYmFuZG9uQWxsJzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VBYmFuZG9uQWxsJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLmF1dG9Qcm9ncmVzcykge1xuICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlTmV4dCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zR2V0VmFsdWUoQ01JRWxlbWVudCkge1xuICAgIHJldHVybiB0aGlzLmdldFZhbHVlKCdHZXRWYWx1ZScsIHRydWUsIENNSUVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNTZXRWYWx1ZShDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnNldFZhbHVlKCdTZXRWYWx1ZScsICdDb21taXQnLCB0cnVlLCBDTUlFbGVtZW50LCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogT3JkZXJzIExNUyB0byBzdG9yZSBhbGwgY29udGVudCBwYXJhbWV0ZXJzXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYm9vbFxuICAgKi9cbiAgbG1zQ29tbWl0KCkge1xuICAgIHJldHVybiB0aGlzLmNvbW1pdCgnQ29tbWl0Jyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBsYXN0IGVycm9yIGNvZGVcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zR2V0TGFzdEVycm9yKCkge1xuICAgIHJldHVybiB0aGlzLmdldExhc3RFcnJvcignR2V0TGFzdEVycm9yJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZXJyb3JOdW1iZXIgZXJyb3IgZGVzY3JpcHRpb25cbiAgICpcbiAgICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcil9IENNSUVycm9yQ29kZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXRFcnJvclN0cmluZyhDTUlFcnJvckNvZGUpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRFcnJvclN0cmluZygnR2V0RXJyb3JTdHJpbmcnLCBDTUlFcnJvckNvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBjb21wcmVoZW5zaXZlIGRlc2NyaXB0aW9uIG9mIHRoZSBlcnJvck51bWJlciBlcnJvci5cbiAgICpcbiAgICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcil9IENNSUVycm9yQ29kZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXREaWFnbm9zdGljKENNSUVycm9yQ29kZSkge1xuICAgIHJldHVybiB0aGlzLmdldERpYWdub3N0aWMoJ0dldERpYWdub3N0aWMnLCBDTUlFcnJvckNvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSB2YWx1ZSBvbiB0aGUgQ01JIE9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgc2V0Q01JVmFsdWUoQ01JRWxlbWVudCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tbW9uU2V0Q01JVmFsdWUoJ1NldFZhbHVlJywgdHJ1ZSwgQ01JRWxlbWVudCwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgb3IgYnVpbGRzIGEgbmV3IGNoaWxkIGVsZW1lbnQgdG8gYWRkIHRvIHRoZSBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHthbnl9IHZhbHVlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm91bmRGaXJzdEluZGV4XG4gICAqIEByZXR1cm4ge2FueX1cbiAgICovXG4gIGdldENoaWxkRWxlbWVudChDTUlFbGVtZW50LCB2YWx1ZSwgZm91bmRGaXJzdEluZGV4KSB7XG4gICAgbGV0IG5ld0NoaWxkO1xuXG4gICAgaWYgKHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LCAnY21pXFxcXC5vYmplY3RpdmVzXFxcXC5cXFxcZCsnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JT2JqZWN0aXZlc09iamVjdCgpO1xuICAgIH0gZWxzZSBpZiAoZm91bmRGaXJzdEluZGV4ICYmIHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LFxuICAgICAgICAnY21pXFxcXC5pbnRlcmFjdGlvbnNcXFxcLlxcXFxkK1xcXFwuY29ycmVjdF9yZXNwb25zZXNcXFxcLlxcXFxkKycpKSB7XG4gICAgICBjb25zdCBwYXJ0cyA9IENNSUVsZW1lbnQuc3BsaXQoJy4nKTtcbiAgICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKHBhcnRzWzJdKTtcbiAgICAgIGNvbnN0IGludGVyYWN0aW9uID0gdGhpcy5jbWkuaW50ZXJhY3Rpb25zLmNoaWxkQXJyYXlbaW5kZXhdO1xuICAgICAgaWYgKHRoaXMuaXNJbml0aWFsaXplZCgpKSB7XG4gICAgICAgIGlmICghaW50ZXJhY3Rpb24udHlwZSkge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKFxuICAgICAgICAgICAgICBzY29ybTIwMDRfZXJyb3JfY29kZXMuREVQRU5ERU5DWV9OT1RfRVNUQUJMSVNIRUQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuY2hlY2tEdXBsaWNhdGVDaG9pY2VSZXNwb25zZShpbnRlcmFjdGlvbiwgdmFsdWUpO1xuXG4gICAgICAgICAgY29uc3QgcmVzcG9uc2VfdHlwZSA9IGNvcnJlY3RfcmVzcG9uc2VzW2ludGVyYWN0aW9uLnR5cGVdO1xuICAgICAgICAgIGlmIChyZXNwb25zZV90eXBlKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrVmFsaWRSZXNwb25zZVR5cGUocmVzcG9uc2VfdHlwZSwgdmFsdWUsIGludGVyYWN0aW9uLnR5cGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuR0VORVJBTF9TRVRfRkFJTFVSRSxcbiAgICAgICAgICAgICAgICAnSW5jb3JyZWN0IFJlc3BvbnNlIFR5cGU6ICcgKyBpbnRlcmFjdGlvbi50eXBlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmxhc3RFcnJvckNvZGUgPT09IDApIHtcbiAgICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JSW50ZXJhY3Rpb25zQ29ycmVjdFJlc3BvbnNlc09iamVjdCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZm91bmRGaXJzdEluZGV4ICYmIHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LFxuICAgICAgICAnY21pXFxcXC5pbnRlcmFjdGlvbnNcXFxcLlxcXFxkK1xcXFwub2JqZWN0aXZlc1xcXFwuXFxcXGQrJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSUludGVyYWN0aW9uc09iamVjdGl2ZXNPYmplY3QoKTtcbiAgICB9IGVsc2UgaWYgKCFmb3VuZEZpcnN0SW5kZXggJiZcbiAgICAgICAgdGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsICdjbWlcXFxcLmludGVyYWN0aW9uc1xcXFwuXFxcXGQrJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSUludGVyYWN0aW9uc09iamVjdCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsXG4gICAgICAgICdjbWlcXFxcLmNvbW1lbnRzX2Zyb21fbGVhcm5lclxcXFwuXFxcXGQrJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSUNvbW1lbnRzT2JqZWN0KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCxcbiAgICAgICAgJ2NtaVxcXFwuY29tbWVudHNfZnJvbV9sbXNcXFxcLlxcXFxkKycpKSB7XG4gICAgICBuZXdDaGlsZCA9IG5ldyBDTUlDb21tZW50c09iamVjdCh0cnVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3Q2hpbGQ7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGZvciB2YWxpZCByZXNwb25zZSB0eXBlc1xuICAgKiBAcGFyYW0ge29iamVjdH0gcmVzcG9uc2VfdHlwZVxuICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGludGVyYWN0aW9uX3R5cGVcbiAgICovXG4gIGNoZWNrVmFsaWRSZXNwb25zZVR5cGUocmVzcG9uc2VfdHlwZSwgdmFsdWUsIGludGVyYWN0aW9uX3R5cGUpIHtcbiAgICBsZXQgbm9kZXMgPSBbXTtcbiAgICBpZiAocmVzcG9uc2VfdHlwZT8uZGVsaW1pdGVyKSB7XG4gICAgICBub2RlcyA9IFN0cmluZyh2YWx1ZSkuc3BsaXQocmVzcG9uc2VfdHlwZS5kZWxpbWl0ZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBub2Rlc1swXSA9IHZhbHVlO1xuICAgIH1cblxuICAgIGlmIChub2Rlcy5sZW5ndGggPiAwICYmIG5vZGVzLmxlbmd0aCA8PSByZXNwb25zZV90eXBlLm1heCkge1xuICAgICAgdGhpcy5jaGVja0NvcnJlY3RSZXNwb25zZVZhbHVlKGludGVyYWN0aW9uX3R5cGUsIG5vZGVzLCB2YWx1ZSk7XG4gICAgfSBlbHNlIGlmIChub2Rlcy5sZW5ndGggPiByZXNwb25zZV90eXBlLm1heCkge1xuICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUsXG4gICAgICAgICAgJ0RhdGEgTW9kZWwgRWxlbWVudCBQYXR0ZXJuIFRvbyBMb25nJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBmb3IgZHVwbGljYXRlICdjaG9pY2UnIHJlc3BvbnNlcy5cbiAgICogQHBhcmFtIHtDTUlJbnRlcmFjdGlvbnNPYmplY3R9IGludGVyYWN0aW9uXG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICAgKi9cbiAgY2hlY2tEdXBsaWNhdGVDaG9pY2VSZXNwb25zZShpbnRlcmFjdGlvbiwgdmFsdWUpIHtcbiAgICBjb25zdCBpbnRlcmFjdGlvbl9jb3VudCA9IGludGVyYWN0aW9uLmNvcnJlY3RfcmVzcG9uc2VzLl9jb3VudDtcbiAgICBpZiAoaW50ZXJhY3Rpb24udHlwZSA9PT0gJ2Nob2ljZScpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW50ZXJhY3Rpb25fY291bnQgJiYgdGhpcy5sYXN0RXJyb3JDb2RlID09PVxuICAgICAgMDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gaW50ZXJhY3Rpb24uY29ycmVjdF9yZXNwb25zZXMuY2hpbGRBcnJheVtpXTtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnBhdHRlcm4gPT09IHZhbHVlKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIGNvcnJlY3QgcmVzcG9uc2UuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICovXG4gIHZhbGlkYXRlQ29ycmVjdFJlc3BvbnNlKENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgY29uc3QgcGFydHMgPSBDTUlFbGVtZW50LnNwbGl0KCcuJyk7XG4gICAgY29uc3QgaW5kZXggPSBOdW1iZXIocGFydHNbMl0pO1xuICAgIGNvbnN0IHBhdHRlcm5faW5kZXggPSBOdW1iZXIocGFydHNbNF0pO1xuICAgIGNvbnN0IGludGVyYWN0aW9uID0gdGhpcy5jbWkuaW50ZXJhY3Rpb25zLmNoaWxkQXJyYXlbaW5kZXhdO1xuXG4gICAgY29uc3QgaW50ZXJhY3Rpb25fY291bnQgPSBpbnRlcmFjdGlvbi5jb3JyZWN0X3Jlc3BvbnNlcy5fY291bnQ7XG4gICAgdGhpcy5jaGVja0R1cGxpY2F0ZUNob2ljZVJlc3BvbnNlKGludGVyYWN0aW9uLCB2YWx1ZSk7XG5cbiAgICBjb25zdCByZXNwb25zZV90eXBlID0gY29ycmVjdF9yZXNwb25zZXNbaW50ZXJhY3Rpb24udHlwZV07XG4gICAgaWYgKHR5cGVvZiByZXNwb25zZV90eXBlLmxpbWl0ID09PSAndW5kZWZpbmVkJyB8fCBpbnRlcmFjdGlvbl9jb3VudCA8PVxuICAgICAgICByZXNwb25zZV90eXBlLmxpbWl0KSB7XG4gICAgICB0aGlzLmNoZWNrVmFsaWRSZXNwb25zZVR5cGUocmVzcG9uc2VfdHlwZSwgdmFsdWUsIGludGVyYWN0aW9uLnR5cGUpO1xuXG4gICAgICBpZiAodGhpcy5sYXN0RXJyb3JDb2RlID09PSAwICYmXG4gICAgICAgICAgKCFyZXNwb25zZV90eXBlLmR1cGxpY2F0ZSB8fFxuICAgICAgICAgICAgICAhdGhpcy5jaGVja0R1cGxpY2F0ZWRQYXR0ZXJuKGludGVyYWN0aW9uLmNvcnJlY3RfcmVzcG9uc2VzLFxuICAgICAgICAgICAgICAgICAgcGF0dGVybl9pbmRleCwgdmFsdWUpKSB8fFxuICAgICAgICAgICh0aGlzLmxhc3RFcnJvckNvZGUgPT09IDAgJiYgdmFsdWUgPT09ICcnKSkge1xuICAgICAgICAvLyBkbyBub3RoaW5nLCB3ZSB3YW50IHRoZSBpbnZlcnNlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5sYXN0RXJyb3JDb2RlID09PSAwKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUsXG4gICAgICAgICAgICAgICdEYXRhIE1vZGVsIEVsZW1lbnQgUGF0dGVybiBBbHJlYWR5IEV4aXN0cycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5HRU5FUkFMX1NFVF9GQUlMVVJFLFxuICAgICAgICAgICdEYXRhIE1vZGVsIEVsZW1lbnQgQ29sbGVjdGlvbiBMaW1pdCBSZWFjaGVkJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSB2YWx1ZSBmcm9tIHRoZSBDTUkgT2JqZWN0XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXRDTUlWYWx1ZShDTUlFbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbW1vbkdldENNSVZhbHVlKCdHZXRWYWx1ZScsIHRydWUsIENNSUVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1lc3NhZ2UgdGhhdCBjb3JyZXNwb25kcyB0byBlcnJvck51bWJlci5cbiAgICpcbiAgICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcil9IGVycm9yTnVtYmVyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZGV0YWlsXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldExtc0Vycm9yTWVzc2FnZURldGFpbHMoZXJyb3JOdW1iZXIsIGRldGFpbCkge1xuICAgIGxldCBiYXNpY01lc3NhZ2UgPSAnJztcbiAgICBsZXQgZGV0YWlsTWVzc2FnZSA9ICcnO1xuXG4gICAgLy8gU2V0IGVycm9yIG51bWJlciB0byBzdHJpbmcgc2luY2UgaW5jb25zaXN0ZW50IGZyb20gbW9kdWxlcyBpZiBzdHJpbmcgb3IgbnVtYmVyXG4gICAgZXJyb3JOdW1iZXIgPSBTdHJpbmcoZXJyb3JOdW1iZXIpO1xuICAgIGlmIChzY29ybTIwMDRfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tlcnJvck51bWJlcl0pIHtcbiAgICAgIGJhc2ljTWVzc2FnZSA9IHNjb3JtMjAwNF9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW2Vycm9yTnVtYmVyXS5iYXNpY01lc3NhZ2U7XG4gICAgICBkZXRhaWxNZXNzYWdlID0gc2Nvcm0yMDA0X2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbZXJyb3JOdW1iZXJdLmRldGFpbE1lc3NhZ2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRldGFpbCA/IGRldGFpbE1lc3NhZ2UgOiBiYXNpY01lc3NhZ2U7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgdG8gc2VlIGlmIGEgY29ycmVjdF9yZXNwb25zZSB2YWx1ZSBoYXMgYmVlbiBkdXBsaWNhdGVkXG4gICAqIEBwYXJhbSB7Q01JQXJyYXl9IGNvcnJlY3RfcmVzcG9uc2VcbiAgICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRfaW5kZXhcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgY2hlY2tEdXBsaWNhdGVkUGF0dGVybiA9IChjb3JyZWN0X3Jlc3BvbnNlLCBjdXJyZW50X2luZGV4LCB2YWx1ZSkgPT4ge1xuICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgIGNvbnN0IGNvdW50ID0gY29ycmVjdF9yZXNwb25zZS5fY291bnQ7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudCAmJiAhZm91bmQ7IGkrKykge1xuICAgICAgaWYgKGkgIT09IGN1cnJlbnRfaW5kZXggJiYgY29ycmVjdF9yZXNwb25zZS5jaGlsZEFycmF5W2ldID09PSB2YWx1ZSkge1xuICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmb3VuZDtcbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2tzIGZvciBhIHZhbGlkIGNvcnJlY3RfcmVzcG9uc2UgdmFsdWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGludGVyYWN0aW9uX3R5cGVcbiAgICogQHBhcmFtIHtBcnJheX0gbm9kZXNcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKi9cbiAgY2hlY2tDb3JyZWN0UmVzcG9uc2VWYWx1ZShpbnRlcmFjdGlvbl90eXBlLCBub2RlcywgdmFsdWUpIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGNvcnJlY3RfcmVzcG9uc2VzW2ludGVyYWN0aW9uX3R5cGVdO1xuICAgIGNvbnN0IGZvcm1hdFJlZ2V4ID0gbmV3IFJlZ0V4cChyZXNwb25zZS5mb3JtYXQpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoICYmIHRoaXMubGFzdEVycm9yQ29kZSA9PT0gMDsgaSsrKSB7XG4gICAgICBpZiAoaW50ZXJhY3Rpb25fdHlwZS5tYXRjaChcbiAgICAgICAgICAnXihmaWxsLWlufGxvbmctZmlsbC1pbnxtYXRjaGluZ3xwZXJmb3JtYW5jZXxzZXF1ZW5jaW5nKSQnKSkge1xuICAgICAgICBub2Rlc1tpXSA9IHRoaXMucmVtb3ZlQ29ycmVjdFJlc3BvbnNlUHJlZml4ZXMobm9kZXNbaV0pO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzcG9uc2U/LmRlbGltaXRlcjIpIHtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gbm9kZXNbaV0uc3BsaXQocmVzcG9uc2UuZGVsaW1pdGVyMik7XG4gICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgY29uc3QgbWF0Y2hlcyA9IHZhbHVlc1swXS5tYXRjaChmb3JtYXRSZWdleCk7XG4gICAgICAgICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghdmFsdWVzWzFdLm1hdGNoKG5ldyBSZWdFeHAocmVzcG9uc2UuZm9ybWF0MikpKSB7XG4gICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBtYXRjaGVzID0gbm9kZXNbaV0ubWF0Y2goZm9ybWF0UmVnZXgpO1xuICAgICAgICBpZiAoKCFtYXRjaGVzICYmIHZhbHVlICE9PSAnJykgfHxcbiAgICAgICAgICAgICghbWF0Y2hlcyAmJiBpbnRlcmFjdGlvbl90eXBlID09PSAndHJ1ZS1mYWxzZScpKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChpbnRlcmFjdGlvbl90eXBlID09PSAnbnVtZXJpYycgJiYgbm9kZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgaWYgKE51bWJlcihub2Rlc1swXSkgPiBOdW1iZXIobm9kZXNbMV0pKSB7XG4gICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG5vZGVzW2ldICE9PSAnJyAmJiByZXNwb25zZS51bmlxdWUpIHtcbiAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBpICYmIHRoaXMubGFzdEVycm9yQ29kZSA9PT0gMDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGVzW2ldID09PSBub2Rlc1tqXSkge1xuICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgcHJlZml4ZXMgZnJvbSBjb3JyZWN0X3Jlc3BvbnNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBub2RlXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICByZW1vdmVDb3JyZWN0UmVzcG9uc2VQcmVmaXhlcyhub2RlKSB7XG4gICAgbGV0IHNlZW5PcmRlciA9IGZhbHNlO1xuICAgIGxldCBzZWVuQ2FzZSA9IGZhbHNlO1xuICAgIGxldCBzZWVuTGFuZyA9IGZhbHNlO1xuXG4gICAgY29uc3QgcHJlZml4UmVnZXggPSBuZXcgUmVnRXhwKFxuICAgICAgICAnXih7KGxhbmd8Y2FzZV9tYXR0ZXJzfG9yZGVyX21hdHRlcnMpPShbXn1dKyl9KScpO1xuICAgIGxldCBtYXRjaGVzID0gbm9kZS5tYXRjaChwcmVmaXhSZWdleCk7XG4gICAgbGV0IGxhbmdNYXRjaGVzID0gbnVsbDtcbiAgICB3aGlsZSAobWF0Y2hlcykge1xuICAgICAgc3dpdGNoIChtYXRjaGVzWzJdKSB7XG4gICAgICAgIGNhc2UgJ2xhbmcnOlxuICAgICAgICAgIGxhbmdNYXRjaGVzID0gbm9kZS5tYXRjaChzY29ybTIwMDRfcmVnZXguQ01JTGFuZ2NyKTtcbiAgICAgICAgICBpZiAobGFuZ01hdGNoZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGxhbmcgPSBsYW5nTWF0Y2hlc1szXTtcbiAgICAgICAgICAgIGlmIChsYW5nICE9PSB1bmRlZmluZWQgJiYgbGFuZy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGlmIChWYWxpZExhbmd1YWdlc1tsYW5nLnRvTG93ZXJDYXNlKCldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2VlbkxhbmcgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjYXNlX21hdHRlcnMnOlxuICAgICAgICAgIGlmICghc2VlbkxhbmcgJiYgIXNlZW5PcmRlciAmJiAhc2VlbkNhc2UpIHtcbiAgICAgICAgICAgIGlmIChtYXRjaGVzWzNdICE9PSAndHJ1ZScgJiYgbWF0Y2hlc1szXSAhPT0gJ2ZhbHNlJykge1xuICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2VlbkNhc2UgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdvcmRlcl9tYXR0ZXJzJzpcbiAgICAgICAgICBpZiAoIXNlZW5DYXNlICYmICFzZWVuTGFuZyAmJiAhc2Vlbk9yZGVyKSB7XG4gICAgICAgICAgICBpZiAobWF0Y2hlc1szXSAhPT0gJ3RydWUnICYmIG1hdGNoZXNbM10gIT09ICdmYWxzZScpIHtcbiAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHNlZW5PcmRlciA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBub2RlID0gbm9kZS5zdWJzdHIobWF0Y2hlc1sxXS5sZW5ndGgpO1xuICAgICAgbWF0Y2hlcyA9IG5vZGUubWF0Y2gocHJlZml4UmVnZXgpO1xuICAgIH1cblxuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgdGhlIHdob2xlIEFQSSB3aXRoIGFub3RoZXJcbiAgICogQHBhcmFtIHtTY29ybTIwMDRBUEl9IG5ld0FQSVxuICAgKi9cbiAgcmVwbGFjZVdpdGhBbm90aGVyU2Nvcm1BUEkobmV3QVBJKSB7XG4gICAgLy8gRGF0YSBNb2RlbFxuICAgIHRoaXMuY21pID0gbmV3QVBJLmNtaTtcbiAgICB0aGlzLmFkbCA9IG5ld0FQSS5hZGw7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBjbWkgb2JqZWN0IHRvIHRoZSBwcm9wZXIgZm9ybWF0IGZvciBMTVMgY29tbWl0XG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdGVybWluYXRlQ29tbWl0XG4gICAqIEByZXR1cm4ge29iamVjdHxBcnJheX1cbiAgICovXG4gIHJlbmRlckNvbW1pdENNSSh0ZXJtaW5hdGVDb21taXQ6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBjbWlFeHBvcnQgPSB0aGlzLnJlbmRlckNNSVRvSlNPTk9iamVjdCgpO1xuXG4gICAgaWYgKHRlcm1pbmF0ZUNvbW1pdCkge1xuICAgICAgY21pRXhwb3J0LmNtaS50b3RhbF90aW1lID0gdGhpcy5jbWkuZ2V0Q3VycmVudFRvdGFsVGltZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgIGNvbnN0IGZsYXR0ZW5lZCA9IFV0aWxpdGllcy5mbGF0dGVuKGNtaUV4cG9ydCk7XG4gICAgc3dpdGNoICh0aGlzLnNldHRpbmdzLmRhdGFDb21taXRGb3JtYXQpIHtcbiAgICAgIGNhc2UgJ2ZsYXR0ZW5lZCc6XG4gICAgICAgIHJldHVybiBVdGlsaXRpZXMuZmxhdHRlbihjbWlFeHBvcnQpO1xuICAgICAgY2FzZSAncGFyYW1zJzpcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIGluIGZsYXR0ZW5lZCkge1xuICAgICAgICAgIGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGZsYXR0ZW5lZCwgaXRlbSkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGAke2l0ZW19PSR7ZmxhdHRlbmVkW2l0ZW1dfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgY2FzZSAnanNvbic6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gY21pRXhwb3J0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0cyB0byBzdG9yZSB0aGUgZGF0YSB0byB0aGUgTE1TXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdGVybWluYXRlQ29tbWl0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHN0b3JlRGF0YSh0ZXJtaW5hdGVDb21taXQ6IGJvb2xlYW4pIHtcbiAgICBpZiAodGVybWluYXRlQ29tbWl0KSB7XG4gICAgICBpZiAodGhpcy5jbWkubW9kZSA9PT0gJ25vcm1hbCcpIHtcbiAgICAgICAgaWYgKHRoaXMuY21pLmNyZWRpdCA9PT0gJ2NyZWRpdCcpIHtcbiAgICAgICAgICBpZiAodGhpcy5jbWkuY29tcGxldGlvbl90aHJlc2hvbGQgJiYgdGhpcy5jbWkucHJvZ3Jlc3NfbWVhc3VyZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY21pLnByb2dyZXNzX21lYXN1cmUgPj0gdGhpcy5jbWkuY29tcGxldGlvbl90aHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnU2V0dGluZyBDb21wbGV0aW9uIFN0YXR1czogQ29tcGxldGVkJyk7XG4gICAgICAgICAgICAgIHRoaXMuY21pLmNvbXBsZXRpb25fc3RhdHVzID0gJ2NvbXBsZXRlZCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdTZXR0aW5nIENvbXBsZXRpb24gU3RhdHVzOiBJbmNvbXBsZXRlJyk7XG4gICAgICAgICAgICAgIHRoaXMuY21pLmNvbXBsZXRpb25fc3RhdHVzID0gJ2luY29tcGxldGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5jbWkuc2NhbGVkX3Bhc3Npbmdfc2NvcmUgJiYgdGhpcy5jbWkuc2NvcmUuc2NhbGVkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbWkuc2NvcmUuc2NhbGVkID49IHRoaXMuY21pLnNjYWxlZF9wYXNzaW5nX3Njb3JlKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ1NldHRpbmcgU3VjY2VzcyBTdGF0dXM6IFBhc3NlZCcpO1xuICAgICAgICAgICAgICB0aGlzLmNtaS5zdWNjZXNzX3N0YXR1cyA9ICdwYXNzZWQnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnU2V0dGluZyBTdWNjZXNzIFN0YXR1czogRmFpbGVkJyk7XG4gICAgICAgICAgICAgIHRoaXMuY21pLnN1Y2Nlc3Nfc3RhdHVzID0gJ2ZhaWxlZCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IG5hdlJlcXVlc3QgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5hZGwubmF2LnJlcXVlc3QgIT09ICh0aGlzLnN0YXJ0aW5nRGF0YT8uYWRsPy5uYXY/LnJlcXVlc3QpICYmXG4gICAgICAgIHRoaXMuYWRsLm5hdi5yZXF1ZXN0ICE9PSAnX25vbmVfJykge1xuICAgICAgdGhpcy5hZGwubmF2LnJlcXVlc3QgPSBlbmNvZGVVUklDb21wb25lbnQodGhpcy5hZGwubmF2LnJlcXVlc3QpO1xuICAgICAgbmF2UmVxdWVzdCA9IHRydWU7XG4gICAgfVxuXG4gICAgY29uc3QgY29tbWl0T2JqZWN0ID0gdGhpcy5yZW5kZXJDb21taXRDTUkodGVybWluYXRlQ29tbWl0IHx8XG4gICAgICAgIHRoaXMuc2V0dGluZ3MuYWx3YXlzU2VuZFRvdGFsVGltZSk7XG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5sbXNDb21taXRVcmwpIHtcbiAgICAgIGlmICh0aGlzLmFwaUxvZ0xldmVsID09PSBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9ERUJVRykge1xuICAgICAgICBjb25zb2xlLmRlYnVnKCdDb21taXQgKHRlcm1pbmF0ZWQ6ICcgK1xuICAgICAgICAgICAgKHRlcm1pbmF0ZUNvbW1pdCA/ICd5ZXMnIDogJ25vJykgKyAnKTogJyk7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoY29tbWl0T2JqZWN0KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMucHJvY2Vzc0h0dHBSZXF1ZXN0KHRoaXMuc2V0dGluZ3MubG1zQ29tbWl0VXJsLFxuICAgICAgICAgIGNvbW1pdE9iamVjdCwgdGVybWluYXRlQ29tbWl0KTtcblxuICAgICAgLy8gY2hlY2sgaWYgdGhpcyBpcyBhIHNlcXVlbmNpbmcgY2FsbCwgYW5kIHRoZW4gY2FsbCB0aGUgbmVjZXNzYXJ5IEpTXG4gICAgICB7XG4gICAgICAgIGlmIChuYXZSZXF1ZXN0ICYmIHJlc3VsdC5uYXZSZXF1ZXN0ICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIHJlc3VsdC5uYXZSZXF1ZXN0ICE9PSAnJykge1xuICAgICAgICAgIEZ1bmN0aW9uKGBcInVzZSBzdHJpY3RcIjsoKCkgPT4geyAke3Jlc3VsdC5uYXZSZXF1ZXN0fSB9KSgpYCkoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ0NvbW1pdCAodGVybWluYXRlZDogJyArXG4gICAgICAgICAgKHRlcm1pbmF0ZUNvbW1pdCA/ICd5ZXMnIDogJ25vJykgKyAnKTogJyk7XG4gICAgICBjb25zb2xlLmxvZyhjb21taXRPYmplY3QpO1xuICAgICAgcmV0dXJuIGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIFNjb3JtMTJDTUkgZnJvbSAnLi9zY29ybTEyX2NtaSc7XG5pbXBvcnQge0Jhc2VDTUksIENNSUFycmF5LCBDTUlTY29yZX0gZnJvbSAnLi9jb21tb24nO1xuaW1wb3J0IEFQSUNvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMvYXBpX2NvbnN0YW50cyc7XG5pbXBvcnQgUmVnZXggZnJvbSAnLi4vY29uc3RhbnRzL3JlZ2V4JztcbmltcG9ydCBFcnJvckNvZGVzIGZyb20gJy4uL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQge1xuICBjaGVjazEyVmFsaWRGb3JtYXQsXG4gIHRocm93UmVhZE9ubHlFcnJvcixcbn0gZnJvbSAnLi9zY29ybTEyX2NtaSc7XG5cbmNvbnN0IGFpY2NfY29uc3RhbnRzID0gQVBJQ29uc3RhbnRzLmFpY2M7XG5jb25zdCBhaWNjX3JlZ2V4ID0gUmVnZXguYWljYztcbmNvbnN0IHNjb3JtMTJfZXJyb3JfY29kZXMgPSBFcnJvckNvZGVzLnNjb3JtMTI7XG5cbi8qKlxuICogQ01JIENsYXNzIGZvciBBSUNDXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUkgZXh0ZW5kcyBTY29ybTEyQ01JLkNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBDTUkgb2JqZWN0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5pdGlhbGl6ZWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKGluaXRpYWxpemVkOiBib29sZWFuKSB7XG4gICAgc3VwZXIoYWljY19jb25zdGFudHMuY21pX2NoaWxkcmVuKTtcblxuICAgIGlmIChpbml0aWFsaXplZCkgdGhpcy5pbml0aWFsaXplKCk7XG5cbiAgICB0aGlzLnN0dWRlbnRfcHJlZmVyZW5jZSA9IG5ldyBBSUNDU3R1ZGVudFByZWZlcmVuY2VzKCk7XG4gICAgdGhpcy5zdHVkZW50X2RhdGEgPSBuZXcgQUlDQ0NNSVN0dWRlbnREYXRhKCk7XG4gICAgdGhpcy5zdHVkZW50X2RlbW9ncmFwaGljcyA9IG5ldyBDTUlTdHVkZW50RGVtb2dyYXBoaWNzKCk7XG4gICAgdGhpcy5ldmFsdWF0aW9uID0gbmV3IENNSUV2YWx1YXRpb24oKTtcbiAgICB0aGlzLnBhdGhzID0gbmV3IENNSVBhdGhzKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc3R1ZGVudF9wcmVmZXJlbmNlPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zdHVkZW50X2RhdGE/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnN0dWRlbnRfZGVtb2dyYXBoaWNzPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5ldmFsdWF0aW9uPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5wYXRocz8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgc3VzcGVuZF9kYXRhOiBzdHJpbmcsXG4gICAqICAgICAgbGF1bmNoX2RhdGE6IHN0cmluZyxcbiAgICogICAgICBjb21tZW50czogc3RyaW5nLFxuICAgKiAgICAgIGNvbW1lbnRzX2Zyb21fbG1zOiBzdHJpbmcsXG4gICAqICAgICAgY29yZTogQ01JQ29yZSxcbiAgICogICAgICBvYmplY3RpdmVzOiBDTUlPYmplY3RpdmVzLFxuICAgKiAgICAgIHN0dWRlbnRfZGF0YTogQ01JU3R1ZGVudERhdGEsXG4gICAqICAgICAgc3R1ZGVudF9wcmVmZXJlbmNlOiBDTUlTdHVkZW50UHJlZmVyZW5jZSxcbiAgICogICAgICBpbnRlcmFjdGlvbnM6IENNSUludGVyYWN0aW9ucyxcbiAgICogICAgICBwYXRoczogQ01JUGF0aHNcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3N1c3BlbmRfZGF0YSc6IHRoaXMuc3VzcGVuZF9kYXRhLFxuICAgICAgJ2xhdW5jaF9kYXRhJzogdGhpcy5sYXVuY2hfZGF0YSxcbiAgICAgICdjb21tZW50cyc6IHRoaXMuY29tbWVudHMsXG4gICAgICAnY29tbWVudHNfZnJvbV9sbXMnOiB0aGlzLmNvbW1lbnRzX2Zyb21fbG1zLFxuICAgICAgJ2NvcmUnOiB0aGlzLmNvcmUsXG4gICAgICAnb2JqZWN0aXZlcyc6IHRoaXMub2JqZWN0aXZlcyxcbiAgICAgICdzdHVkZW50X2RhdGEnOiB0aGlzLnN0dWRlbnRfZGF0YSxcbiAgICAgICdzdHVkZW50X3ByZWZlcmVuY2UnOiB0aGlzLnN0dWRlbnRfcHJlZmVyZW5jZSxcbiAgICAgICdzdHVkZW50X2RlbW9ncmFwaGljcyc6IHRoaXMuc3R1ZGVudF9kZW1vZ3JhcGhpY3MsXG4gICAgICAnaW50ZXJhY3Rpb25zJzogdGhpcy5pbnRlcmFjdGlvbnMsXG4gICAgICAnZXZhbHVhdGlvbic6IHRoaXMuZXZhbHVhdGlvbixcbiAgICAgICdwYXRocyc6IHRoaXMucGF0aHMsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBBSUNDIEV2YWx1YXRpb24gb2JqZWN0XG4gKi9cbmNsYXNzIENNSUV2YWx1YXRpb24gZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIEV2YWx1YXRpb24gb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5jb21tZW50cyA9IG5ldyBDTUlFdmFsdWF0aW9uQ29tbWVudHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5jb21tZW50cz8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmV2YWx1YXRpb24gb2JqZWN0XG4gICAqIEByZXR1cm4ge3tjb21tZW50czogQ01JRXZhbHVhdGlvbkNvbW1lbnRzfX1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdjb21tZW50cyc6IHRoaXMuY29tbWVudHMsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgQUlDQydzIGNtaS5ldmFsdWF0aW9uLmNvbW1lbnRzIG9iamVjdFxuICovXG5jbGFzcyBDTUlFdmFsdWF0aW9uQ29tbWVudHMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBFdmFsdWF0aW9uIENvbW1lbnRzIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoYWljY19jb25zdGFudHMuY29tbWVudHNfY2hpbGRyZW4sXG4gICAgICAgIHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUpO1xuICB9XG59XG5cbi8qKlxuICogU3R1ZGVudFByZWZlcmVuY2VzIGNsYXNzIGZvciBBSUNDXG4gKi9cbmNsYXNzIEFJQ0NTdHVkZW50UHJlZmVyZW5jZXMgZXh0ZW5kcyBTY29ybTEyQ01JLkNNSVN0dWRlbnRQcmVmZXJlbmNlIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIFN0dWRlbnQgUHJlZmVyZW5jZXMgb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihhaWNjX2NvbnN0YW50cy5zdHVkZW50X3ByZWZlcmVuY2VfY2hpbGRyZW4pO1xuXG4gICAgdGhpcy53aW5kb3dzID0gbmV3IENNSUFycmF5KHtcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgIGNoaWxkcmVuOiAnJyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy53aW5kb3dzPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAjbGVzc29uX3R5cGUgPSAnJztcbiAgI3RleHRfY29sb3IgPSAnJztcbiAgI3RleHRfbG9jYXRpb24gPSAnJztcbiAgI3RleHRfc2l6ZSA9ICcnO1xuICAjdmlkZW8gPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGVzc29uX3R5cGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlc3Nvbl90eXBlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuI2xlc3Nvbl90eXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xlc3Nvbl90eXBlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZXNzb25fdHlwZVxuICAgKi9cbiAgc2V0IGxlc3Nvbl90eXBlKGxlc3Nvbl90eXBlOiBzdHJpbmcpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGxlc3Nvbl90eXBlLCBhaWNjX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI2xlc3Nvbl90eXBlID0gbGVzc29uX3R5cGU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RleHRfY29sb3JcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRleHRfY29sb3IoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy4jdGV4dF9jb2xvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0ZXh0X2NvbG9yXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0X2NvbG9yXG4gICAqL1xuICBzZXQgdGV4dF9jb2xvcih0ZXh0X2NvbG9yOiBzdHJpbmcpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHRleHRfY29sb3IsIGFpY2NfcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jdGV4dF9jb2xvciA9IHRleHRfY29sb3I7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RleHRfbG9jYXRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRleHRfbG9jYXRpb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy4jdGV4dF9sb2NhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0ZXh0X2xvY2F0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0X2xvY2F0aW9uXG4gICAqL1xuICBzZXQgdGV4dF9sb2NhdGlvbih0ZXh0X2xvY2F0aW9uOiBzdHJpbmcpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHRleHRfbG9jYXRpb24sIGFpY2NfcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jdGV4dF9sb2NhdGlvbiA9IHRleHRfbG9jYXRpb247XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RleHRfc2l6ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGV4dF9zaXplKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuI3RleHRfc2l6ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0ZXh0X3NpemVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHRfc2l6ZVxuICAgKi9cbiAgc2V0IHRleHRfc2l6ZSh0ZXh0X3NpemU6IHN0cmluZykge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQodGV4dF9zaXplLCBhaWNjX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI3RleHRfc2l6ZSA9IHRleHRfc2l6ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdmlkZW9cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHZpZGVvKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuI3ZpZGVvO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3ZpZGVvXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2aWRlb1xuICAgKi9cbiAgc2V0IHZpZGVvKHZpZGVvOiBzdHJpbmcpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHZpZGVvLCBhaWNjX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI3ZpZGVvID0gdmlkZW87XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLnN0dWRlbnRfcHJlZmVyZW5jZVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGF1ZGlvOiBzdHJpbmcsXG4gICAqICAgICAgbGFuZ3VhZ2U6IHN0cmluZyxcbiAgICogICAgICBzcGVlZDogc3RyaW5nLFxuICAgKiAgICAgIHRleHQ6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnYXVkaW8nOiB0aGlzLmF1ZGlvLFxuICAgICAgJ2xhbmd1YWdlJzogdGhpcy5sYW5ndWFnZSxcbiAgICAgICdsZXNzb25fdHlwZSc6IHRoaXMubGVzc29uX3R5cGUsXG4gICAgICAnc3BlZWQnOiB0aGlzLnNwZWVkLFxuICAgICAgJ3RleHQnOiB0aGlzLnRleHQsXG4gICAgICAndGV4dF9jb2xvcic6IHRoaXMudGV4dF9jb2xvcixcbiAgICAgICd0ZXh0X2xvY2F0aW9uJzogdGhpcy50ZXh0X2xvY2F0aW9uLFxuICAgICAgJ3RleHRfc2l6ZSc6IHRoaXMudGV4dF9zaXplLFxuICAgICAgJ3ZpZGVvJzogdGhpcy52aWRlbyxcbiAgICAgICd3aW5kb3dzJzogdGhpcy53aW5kb3dzLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogU3R1ZGVudERhdGEgY2xhc3MgZm9yIEFJQ0NcbiAqL1xuY2xhc3MgQUlDQ0NNSVN0dWRlbnREYXRhIGV4dGVuZHMgU2Nvcm0xMkNNSS5DTUlTdHVkZW50RGF0YSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBTdHVkZW50RGF0YSBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKGFpY2NfY29uc3RhbnRzLnN0dWRlbnRfZGF0YV9jaGlsZHJlbik7XG5cbiAgICB0aGlzLnRyaWVzID0gbmV3IENNSVRyaWVzKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMudHJpZXM/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICN0cmllc19kdXJpbmdfbGVzc29uID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgdHJpZXNfZHVyaW5nX2xlc3NvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdHJpZXNfZHVyaW5nX2xlc3NvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jdHJpZXNfZHVyaW5nX2xlc3NvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0cmllc19kdXJpbmdfbGVzc29uLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHJpZXNfZHVyaW5nX2xlc3NvblxuICAgKi9cbiAgc2V0IHRyaWVzX2R1cmluZ19sZXNzb24odHJpZXNfZHVyaW5nX2xlc3Nvbikge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jdHJpZXNfZHVyaW5nX2xlc3NvbiA9IHRyaWVzX2R1cmluZ19sZXNzb24gOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5zdHVkZW50X2RhdGEgb2JqZWN0XG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgbWFzdGVyeV9zY29yZTogc3RyaW5nLFxuICAgKiAgICAgIG1heF90aW1lX2FsbG93ZWQ6IHN0cmluZyxcbiAgICogICAgICB0aW1lX2xpbWl0X2FjdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIHRyaWVzOiBDTUlUcmllc1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnbWFzdGVyeV9zY29yZSc6IHRoaXMubWFzdGVyeV9zY29yZSxcbiAgICAgICdtYXhfdGltZV9hbGxvd2VkJzogdGhpcy5tYXhfdGltZV9hbGxvd2VkLFxuICAgICAgJ3RpbWVfbGltaXRfYWN0aW9uJzogdGhpcy50aW1lX2xpbWl0X2FjdGlvbixcbiAgICAgICd0cmllcyc6IHRoaXMudHJpZXMsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgdGhlIEFJQ0MgY21pLnN0dWRlbnRfZGVtb2dyYXBoaWNzIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JU3R1ZGVudERlbW9ncmFwaGljcyBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEFJQ0MgU3R1ZGVudERlbW9ncmFwaGljcyBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAjX2NoaWxkcmVuID0gYWljY19jb25zdGFudHMuc3R1ZGVudF9kZW1vZ3JhcGhpY3NfY2hpbGRyZW47XG4gICNjaXR5ID0gJyc7XG4gICNjbGFzcyA9ICcnO1xuICAjY29tcGFueSA9ICcnO1xuICAjY291bnRyeSA9ICcnO1xuICAjZXhwZXJpZW5jZSA9ICcnO1xuICAjZmFtaWxpYXJfbmFtZSA9ICcnO1xuICAjaW5zdHJ1Y3Rvcl9uYW1lID0gJyc7XG4gICN0aXRsZSA9ICcnO1xuICAjbmF0aXZlX2xhbmd1YWdlID0gJyc7XG4gICNzdGF0ZSA9ICcnO1xuICAjc3RyZWV0X2FkZHJlc3MgPSAnJztcbiAgI3RlbGVwaG9uZSA9ICcnO1xuICAjeWVhcnNfZXhwZXJpZW5jZSA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIGNpdHlcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NpdHk7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY2l0eS4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNpdHlcbiAgICovXG4gIHNldCBjaXR5KGNpdHkpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2NpdHkgPSBjaXR5IDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBjbGFzc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY2xhc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NsYXNzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NsYXNzLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhenpcbiAgICovXG4gIHNldCBjbGFzcyhjbGF6eikge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jY2xhc3MgPSBjbGF6eiA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgY29tcGFueVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29tcGFueSgpIHtcbiAgICByZXR1cm4gdGhpcy4jY29tcGFueTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb21wYW55LiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29tcGFueVxuICAgKi9cbiAgc2V0IGNvbXBhbnkoY29tcGFueSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jY29tcGFueSA9IGNvbXBhbnkgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIGNvdW50cnlcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvdW50cnkoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvdW50cnk7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY291bnRyeS4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvdW50cnlcbiAgICovXG4gIHNldCBjb3VudHJ5KGNvdW50cnkpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2NvdW50cnkgPSBjb3VudHJ5IDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBleHBlcmllbmNlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBleHBlcmllbmNlKCkge1xuICAgIHJldHVybiB0aGlzLiNleHBlcmllbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2V4cGVyaWVuY2UuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBleHBlcmllbmNlXG4gICAqL1xuICBzZXQgZXhwZXJpZW5jZShleHBlcmllbmNlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNleHBlcmllbmNlID0gZXhwZXJpZW5jZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgZmFtaWxpYXJfbmFtZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZmFtaWxpYXJfbmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jZmFtaWxpYXJfbmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNmYW1pbGlhcl9uYW1lLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmFtaWxpYXJfbmFtZVxuICAgKi9cbiAgc2V0IGZhbWlsaWFyX25hbWUoZmFtaWxpYXJfbmFtZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jZmFtaWxpYXJfbmFtZSA9IGZhbWlsaWFyX25hbWUgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIGluc3RydWN0b3JfbmFtZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgaW5zdHJ1Y3Rvcl9uYW1lKCkge1xuICAgIHJldHVybiB0aGlzLiNpbnN0cnVjdG9yX25hbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjaW5zdHJ1Y3Rvcl9uYW1lLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaW5zdHJ1Y3Rvcl9uYW1lXG4gICAqL1xuICBzZXQgaW5zdHJ1Y3Rvcl9uYW1lKGluc3RydWN0b3JfbmFtZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jaW5zdHJ1Y3Rvcl9uYW1lID0gaW5zdHJ1Y3Rvcl9uYW1lIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciB0aXRsZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGl0bGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpdGxlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpdGxlLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGl0bGVcbiAgICovXG4gIHNldCB0aXRsZSh0aXRsZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jdGl0bGUgPSB0aXRsZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgbmF0aXZlX2xhbmd1YWdlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBuYXRpdmVfbGFuZ3VhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuI25hdGl2ZV9sYW5ndWFnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNuYXRpdmVfbGFuZ3VhZ2UuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYXRpdmVfbGFuZ3VhZ2VcbiAgICovXG4gIHNldCBuYXRpdmVfbGFuZ3VhZ2UobmF0aXZlX2xhbmd1YWdlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNuYXRpdmVfbGFuZ3VhZ2UgPSBuYXRpdmVfbGFuZ3VhZ2UgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIHN0YXRlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jc3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3RhdGUuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0ZVxuICAgKi9cbiAgc2V0IHN0YXRlKHN0YXRlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNzdGF0ZSA9IHN0YXRlIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBzdHJlZXRfYWRkcmVzc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3RyZWV0X2FkZHJlc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0cmVldF9hZGRyZXNzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N0cmVldF9hZGRyZXNzLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyZWV0X2FkZHJlc3NcbiAgICovXG4gIHNldCBzdHJlZXRfYWRkcmVzcyhzdHJlZXRfYWRkcmVzcykge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jc3RyZWV0X2FkZHJlc3MgPSBzdHJlZXRfYWRkcmVzcyA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgdGVsZXBob25lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0ZWxlcGhvbmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RlbGVwaG9uZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0ZWxlcGhvbmUuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZWxlcGhvbmVcbiAgICovXG4gIHNldCB0ZWxlcGhvbmUodGVsZXBob25lKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiN0ZWxlcGhvbmUgPSB0ZWxlcGhvbmUgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIHllYXJzX2V4cGVyaWVuY2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHllYXJzX2V4cGVyaWVuY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3llYXJzX2V4cGVyaWVuY2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjeWVhcnNfZXhwZXJpZW5jZS4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHllYXJzX2V4cGVyaWVuY2VcbiAgICovXG4gIHNldCB5ZWFyc19leHBlcmllbmNlKHllYXJzX2V4cGVyaWVuY2UpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI3llYXJzX2V4cGVyaWVuY2UgPSB5ZWFyc19leHBlcmllbmNlIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuc3R1ZGVudF9kZW1vZ3JhcGhpY3Mgb2JqZWN0XG4gICAqIEByZXR1cm4ge1xuICAgKiAgICAgIHtcbiAgICogICAgICAgIGNpdHk6IHN0cmluZyxcbiAgICogICAgICAgIGNsYXNzOiBzdHJpbmcsXG4gICAqICAgICAgICBjb21wYW55OiBzdHJpbmcsXG4gICAqICAgICAgICBjb3VudHJ5OiBzdHJpbmcsXG4gICAqICAgICAgICBleHBlcmllbmNlOiBzdHJpbmcsXG4gICAqICAgICAgICBmYW1pbGlhcl9uYW1lOiBzdHJpbmcsXG4gICAqICAgICAgICBpbnN0cnVjdG9yX25hbWU6IHN0cmluZyxcbiAgICogICAgICAgIHRpdGxlOiBzdHJpbmcsXG4gICAqICAgICAgICBuYXRpdmVfbGFuZ3VhZ2U6IHN0cmluZyxcbiAgICogICAgICAgIHN0YXRlOiBzdHJpbmcsXG4gICAqICAgICAgICBzdHJlZXRfYWRkcmVzczogc3RyaW5nLFxuICAgKiAgICAgICAgdGVsZXBob25lOiBzdHJpbmcsXG4gICAqICAgICAgICB5ZWFyc19leHBlcmllbmNlOiBzdHJpbmdcbiAgICogICAgICB9XG4gICAqICAgIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdjaXR5JzogdGhpcy5jaXR5LFxuICAgICAgJ2NsYXNzJzogdGhpcy5jbGFzcyxcbiAgICAgICdjb21wYW55JzogdGhpcy5jb21wYW55LFxuICAgICAgJ2NvdW50cnknOiB0aGlzLmNvdW50cnksXG4gICAgICAnZXhwZXJpZW5jZSc6IHRoaXMuZXhwZXJpZW5jZSxcbiAgICAgICdmYW1pbGlhcl9uYW1lJzogdGhpcy5mYW1pbGlhcl9uYW1lLFxuICAgICAgJ2luc3RydWN0b3JfbmFtZSc6IHRoaXMuaW5zdHJ1Y3Rvcl9uYW1lLFxuICAgICAgJ3RpdGxlJzogdGhpcy50aXRsZSxcbiAgICAgICduYXRpdmVfbGFuZ3VhZ2UnOiB0aGlzLm5hdGl2ZV9sYW5ndWFnZSxcbiAgICAgICdzdGF0ZSc6IHRoaXMuc3RhdGUsXG4gICAgICAnc3RyZWV0X2FkZHJlc3MnOiB0aGlzLnN0cmVldF9hZGRyZXNzLFxuICAgICAgJ3RlbGVwaG9uZSc6IHRoaXMudGVsZXBob25lLFxuICAgICAgJ3llYXJzX2V4cGVyaWVuY2UnOiB0aGlzLnllYXJzX2V4cGVyaWVuY2UsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgdGhlIEFJQ0MgY21pLnBhdGhzIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JUGF0aHMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgaW5saW5lIFBhdGhzIEFycmF5IGNsYXNzXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihhaWNjX2NvbnN0YW50cy5wYXRoc19jaGlsZHJlbik7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgQUlDQyBQYXRoc1xuICovXG5leHBvcnQgY2xhc3MgQ01JUGF0aHNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIFBhdGhzIG9iamVjdHNcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAjbG9jYXRpb25faWQgPSAnJztcbiAgI2RhdGUgPSAnJztcbiAgI3RpbWUgPSAnJztcbiAgI3N0YXR1cyA9ICcnO1xuICAjd2h5X2xlZnQgPSAnJztcbiAgI3RpbWVfaW5fZWxlbWVudCA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsb2NhdGlvbl9pZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbG9jYXRpb25faWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xvY2F0aW9uX2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xvY2F0aW9uX2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvbl9pZFxuICAgKi9cbiAgc2V0IGxvY2F0aW9uX2lkKGxvY2F0aW9uX2lkKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChsb2NhdGlvbl9pZCwgYWljY19yZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiNsb2NhdGlvbl9pZCA9IGxvY2F0aW9uX2lkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNkYXRlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLiNkYXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2RhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRhdGVcbiAgICovXG4gIHNldCBkYXRlKGRhdGUpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGRhdGUsIGFpY2NfcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jZGF0ZSA9IGRhdGU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGltZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZVxuICAgKi9cbiAgc2V0IHRpbWUodGltZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQodGltZSwgYWljY19yZWdleC5DTUlUaW1lKSkge1xuICAgICAgdGhpcy4jdGltZSA9IHRpbWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNzdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0dXNcbiAgICovXG4gIHNldCBzdGF0dXMoc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChzdGF0dXMsIGFpY2NfcmVnZXguQ01JU3RhdHVzMikpIHtcbiAgICAgIHRoaXMuI3N0YXR1cyA9IHN0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjd2h5X2xlZnRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHdoeV9sZWZ0KCkge1xuICAgIHJldHVybiB0aGlzLiN3aHlfbGVmdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN3aHlfbGVmdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gd2h5X2xlZnRcbiAgICovXG4gIHNldCB3aHlfbGVmdCh3aHlfbGVmdCkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQod2h5X2xlZnQsIGFpY2NfcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jd2h5X2xlZnQgPSB3aHlfbGVmdDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZV9pbl9lbGVtZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lX2luX2VsZW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWVfaW5fZWxlbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lX2luX2VsZW1lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVfaW5fZWxlbWVudFxuICAgKi9cbiAgc2V0IHRpbWVfaW5fZWxlbWVudCh0aW1lX2luX2VsZW1lbnQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHRpbWVfaW5fZWxlbWVudCwgYWljY19yZWdleC5DTUlUaW1lKSkge1xuICAgICAgdGhpcy4jdGltZV9pbl9lbGVtZW50ID0gdGltZV9pbl9lbGVtZW50O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5wYXRocy5uIG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGxvY2F0aW9uX2lkOiBzdHJpbmcsXG4gICAqICAgICAgZGF0ZTogc3RyaW5nLFxuICAgKiAgICAgIHRpbWU6IHN0cmluZyxcbiAgICogICAgICBzdGF0dXM6IHN0cmluZyxcbiAgICogICAgICB3aHlfbGVmdDogc3RyaW5nLFxuICAgKiAgICAgIHRpbWVfaW5fZWxlbWVudDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdsb2NhdGlvbl9pZCc6IHRoaXMubG9jYXRpb25faWQsXG4gICAgICAnZGF0ZSc6IHRoaXMuZGF0ZSxcbiAgICAgICd0aW1lJzogdGhpcy50aW1lLFxuICAgICAgJ3N0YXR1cyc6IHRoaXMuc3RhdHVzLFxuICAgICAgJ3doeV9sZWZ0JzogdGhpcy53aHlfbGVmdCxcbiAgICAgICd0aW1lX2luX2VsZW1lbnQnOiB0aGlzLnRpbWVfaW5fZWxlbWVudCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyB0aGUgQUlDQyBjbWkuc3R1ZGVudF9kYXRhLnRyaWVzIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JVHJpZXMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgaW5saW5lIFRyaWVzIEFycmF5IGNsYXNzXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihhaWNjX2NvbnN0YW50cy50cmllc19jaGlsZHJlbik7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgQUlDQyBUcmllc1xuICovXG5leHBvcnQgY2xhc3MgQ01JVHJpZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIFRyaWVzIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc2NvcmUgPSBuZXcgQ01JU2NvcmUoXG4gICAgICAgIHtcbiAgICAgICAgICBzY29yZV9jaGlsZHJlbjogYWljY19jb25zdGFudHMuc2NvcmVfY2hpbGRyZW4sXG4gICAgICAgICAgc2NvcmVfcmFuZ2U6IGFpY2NfcmVnZXguc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgaW52YWxpZEVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgICAgICBpbnZhbGlkVHlwZUNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCxcbiAgICAgICAgICBpbnZhbGlkUmFuZ2VDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRSxcbiAgICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc2NvcmU/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICNzdGF0dXMgPSAnJztcbiAgI3RpbWUgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3RhdHVzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0YXR1c1xuICAgKi9cbiAgc2V0IHN0YXR1cyhzdGF0dXMpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHN0YXR1cywgYWljY19yZWdleC5DTUlTdGF0dXMyKSkge1xuICAgICAgdGhpcy4jc3RhdHVzID0gc3RhdHVzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0aW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lKCkge1xuICAgIHJldHVybiB0aGlzLiN0aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVcbiAgICovXG4gIHNldCB0aW1lKHRpbWUpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHRpbWUsIGFpY2NfcmVnZXguQ01JVGltZSkpIHtcbiAgICAgIHRoaXMuI3RpbWUgPSB0aW1lO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5zdHVkZW50X2RhdGEudHJpZXMubiBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBzdGF0dXM6IHN0cmluZyxcbiAgICogICAgICB0aW1lOiBzdHJpbmcsXG4gICAqICAgICAgc2NvcmU6IENNSVNjb3JlXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdzdGF0dXMnOiB0aGlzLnN0YXR1cyxcbiAgICAgICd0aW1lJzogdGhpcy50aW1lLFxuICAgICAgJ3Njb3JlJzogdGhpcy5zY29yZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBjbWkuc3R1ZGVudF9kYXRhLmF0dGVtcHRfcmVjb3JkcyBhcnJheVxuICovXG5leHBvcnQgY2xhc3MgQ01JQXR0ZW1wdFJlY29yZHMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgaW5saW5lIFRyaWVzIEFycmF5IGNsYXNzXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihhaWNjX2NvbnN0YW50cy5hdHRlbXB0X3JlY29yZHNfY2hpbGRyZW4pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIEFJQ0MgQXR0ZW1wdCBSZWNvcmRzXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlBdHRlbXB0UmVjb3Jkc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEFJQ0MgQXR0ZW1wdCBSZWNvcmRzIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc2NvcmUgPSBuZXcgQ01JU2NvcmUoXG4gICAgICAgIHtcbiAgICAgICAgICBzY29yZV9jaGlsZHJlbjogYWljY19jb25zdGFudHMuc2NvcmVfY2hpbGRyZW4sXG4gICAgICAgICAgc2NvcmVfcmFuZ2U6IGFpY2NfcmVnZXguc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgaW52YWxpZEVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgICAgICBpbnZhbGlkVHlwZUNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCxcbiAgICAgICAgICBpbnZhbGlkUmFuZ2VDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRSxcbiAgICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc2NvcmU/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICNsZXNzb25fc3RhdHVzID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xlc3Nvbl9zdGF0dXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlc3Nvbl9zdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xlc3Nvbl9zdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGVzc29uX3N0YXR1c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gbGVzc29uX3N0YXR1c1xuICAgKi9cbiAgc2V0IGxlc3Nvbl9zdGF0dXMobGVzc29uX3N0YXR1cykge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQobGVzc29uX3N0YXR1cywgYWljY19yZWdleC5DTUlTdGF0dXMyKSkge1xuICAgICAgdGhpcy4jbGVzc29uX3N0YXR1cyA9IGxlc3Nvbl9zdGF0dXM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLnN0dWRlbnRfZGF0YS5hdHRlbXB0X3JlY29yZHMubiBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBzdGF0dXM6IHN0cmluZyxcbiAgICogICAgICB0aW1lOiBzdHJpbmcsXG4gICAqICAgICAgc2NvcmU6IENNSVNjb3JlXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdsZXNzb25fc3RhdHVzJzogdGhpcy5sZXNzb25fc3RhdHVzLFxuICAgICAgJ3Njb3JlJzogdGhpcy5zY29yZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBBSUNDIEV2YWx1YXRpb24gQ29tbWVudHNcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUV2YWx1YXRpb25Db21tZW50c09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEV2YWx1YXRpb24gQ29tbWVudHNcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAjY29udGVudCA9ICcnO1xuICAjbG9jYXRpb24gPSAnJztcbiAgI3RpbWUgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29udGVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29udGVudCgpIHtcbiAgICByZXR1cm4gdGhpcy4jY29udGVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb250ZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50XG4gICAqL1xuICBzZXQgY29udGVudChjb250ZW50KSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChjb250ZW50LCBhaWNjX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI2NvbnRlbnQgPSBjb250ZW50O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsb2NhdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xvY2F0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xvY2F0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvblxuICAgKi9cbiAgc2V0IGxvY2F0aW9uKGxvY2F0aW9uKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChsb2NhdGlvbiwgYWljY19yZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiNsb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0aW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lKCkge1xuICAgIHJldHVybiB0aGlzLiN0aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRpbmcgZm9yICN0aW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lXG4gICAqL1xuICBzZXQgdGltZSh0aW1lKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh0aW1lLCBhaWNjX3JlZ2V4LkNNSVRpbWUpKSB7XG4gICAgICB0aGlzLiN0aW1lID0gdGltZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuZXZhdWxhdGlvbi5jb21tZW50cy5uIG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGNvbnRlbnQ6IHN0cmluZyxcbiAgICogICAgICBsb2NhdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIHRpbWU6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnY29udGVudCc6IHRoaXMuY29udGVudCxcbiAgICAgICdsb2NhdGlvbic6IHRoaXMubG9jYXRpb24sXG4gICAgICAndGltZSc6IHRoaXMudGltZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCBBUElDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuaW1wb3J0IEVycm9yQ29kZXMgZnJvbSAnLi4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJztcbmltcG9ydCB7VmFsaWRhdGlvbkVycm9yfSBmcm9tICcuLi9leGNlcHRpb25zJztcbmltcG9ydCBSZWdleCBmcm9tICcuLi9jb25zdGFudHMvcmVnZXgnO1xuXG5jb25zdCBzY29ybTEyX2NvbnN0YW50cyA9IEFQSUNvbnN0YW50cy5zY29ybTEyO1xuY29uc3Qgc2Nvcm0xMl9yZWdleCA9IFJlZ2V4LnNjb3JtMTI7XG5jb25zdCBzY29ybTEyX2Vycm9yX2NvZGVzID0gRXJyb3JDb2Rlcy5zY29ybTEyO1xuXG4vKipcbiAqIENoZWNrIGlmIHRoZSB2YWx1ZSBtYXRjaGVzIHRoZSBwcm9wZXIgZm9ybWF0LiBJZiBub3QsIHRocm93IHByb3BlciBlcnJvciBjb2RlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9IHJlZ2V4UGF0dGVyblxuICogQHBhcmFtIHtudW1iZXJ9IGVycm9yQ29kZVxuICogQHBhcmFtIHtib29sZWFufSBhbGxvd0VtcHR5U3RyaW5nXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tWYWxpZEZvcm1hdChcbiAgICB2YWx1ZTogU3RyaW5nLFxuICAgIHJlZ2V4UGF0dGVybjogU3RyaW5nLFxuICAgIGVycm9yQ29kZTogbnVtYmVyLFxuICAgIGFsbG93RW1wdHlTdHJpbmc/OiBib29sZWFuKSB7XG4gIGNvbnN0IGZvcm1hdFJlZ2V4ID0gbmV3IFJlZ0V4cChyZWdleFBhdHRlcm4pO1xuICBjb25zdCBtYXRjaGVzID0gdmFsdWUubWF0Y2goZm9ybWF0UmVnZXgpO1xuICBpZiAoYWxsb3dFbXB0eVN0cmluZyAmJiB2YWx1ZSA9PT0gJycpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCAhbWF0Y2hlcyB8fCBtYXRjaGVzWzBdID09PSAnJykge1xuICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoZXJyb3JDb2RlKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgdmFsdWUgbWF0Y2hlcyB0aGUgcHJvcGVyIHJhbmdlLiBJZiBub3QsIHRocm93IHByb3BlciBlcnJvciBjb2RlLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSByYW5nZVBhdHRlcm5cbiAqIEBwYXJhbSB7bnVtYmVyfSBlcnJvckNvZGVcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1ZhbGlkUmFuZ2UoXG4gICAgdmFsdWU6IGFueSwgcmFuZ2VQYXR0ZXJuOiBTdHJpbmcsIGVycm9yQ29kZTogbnVtYmVyKSB7XG4gIGNvbnN0IHJhbmdlcyA9IHJhbmdlUGF0dGVybi5zcGxpdCgnIycpO1xuICB2YWx1ZSA9IHZhbHVlICogMS4wO1xuICBpZiAodmFsdWUgPj0gcmFuZ2VzWzBdKSB7XG4gICAgaWYgKChyYW5nZXNbMV0gPT09ICcqJykgfHwgKHZhbHVlIDw9IHJhbmdlc1sxXSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKGVycm9yQ29kZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoZXJyb3JDb2RlKTtcbiAgfVxufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIEFQSSBjbWkgb2JqZWN0c1xuICovXG5leHBvcnQgY2xhc3MgQmFzZUNNSSB7XG4gIGpzb25TdHJpbmcgPSBmYWxzZTtcbiAgI2luaXRpYWxpemVkID0gZmFsc2U7XG4gICNzdGFydF90aW1lO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQmFzZUNNSSwganVzdCBtYXJrcyB0aGUgY2xhc3MgYXMgYWJzdHJhY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGlmIChuZXcudGFyZ2V0ID09PSBCYXNlQ01JKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29uc3RydWN0IEJhc2VDTUkgaW5zdGFuY2VzIGRpcmVjdGx5Jyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2luaXRpYWxpemVkXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBnZXQgaW5pdGlhbGl6ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2luaXRpYWxpemVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N0YXJ0X3RpbWVcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHN0YXJ0X3RpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0YXJ0X3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgdGhpcy4jaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBwbGF5ZXIgc2hvdWxkIG92ZXJyaWRlIHRoZSAnc2Vzc2lvbl90aW1lJyBwcm92aWRlZCBieVxuICAgKiB0aGUgbW9kdWxlXG4gICAqL1xuICBzZXRTdGFydFRpbWUoKSB7XG4gICAgdGhpcy4jc3RhcnRfdGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgY21pICouc2NvcmUgb2JqZWN0c1xuICovXG5leHBvcnQgY2xhc3MgQ01JU2NvcmUgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciAqLnNjb3JlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY29yZV9jaGlsZHJlblxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NvcmVfcmFuZ2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1heFxuICAgKiBAcGFyYW0ge251bWJlcn0gaW52YWxpZEVycm9yQ29kZVxuICAgKiBAcGFyYW0ge251bWJlcn0gaW52YWxpZFR5cGVDb2RlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbnZhbGlkUmFuZ2VDb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkZWNpbWFsUmVnZXhcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgICAge1xuICAgICAgICBzY29yZV9jaGlsZHJlbixcbiAgICAgICAgc2NvcmVfcmFuZ2UsXG4gICAgICAgIG1heCxcbiAgICAgICAgaW52YWxpZEVycm9yQ29kZSxcbiAgICAgICAgaW52YWxpZFR5cGVDb2RlLFxuICAgICAgICBpbnZhbGlkUmFuZ2VDb2RlLFxuICAgICAgICBkZWNpbWFsUmVnZXgsXG4gICAgICB9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuI19jaGlsZHJlbiA9IHNjb3JlX2NoaWxkcmVuIHx8XG4gICAgICAgIHNjb3JtMTJfY29uc3RhbnRzLnNjb3JlX2NoaWxkcmVuO1xuICAgIHRoaXMuI19zY29yZV9yYW5nZSA9ICFzY29yZV9yYW5nZSA/IGZhbHNlIDogc2Nvcm0xMl9yZWdleC5zY29yZV9yYW5nZTtcbiAgICB0aGlzLiNtYXggPSAobWF4IHx8IG1heCA9PT0gJycpID8gbWF4IDogJzEwMCc7XG4gICAgdGhpcy4jX2ludmFsaWRfZXJyb3JfY29kZSA9IGludmFsaWRFcnJvckNvZGUgfHxcbiAgICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRTtcbiAgICB0aGlzLiNfaW52YWxpZF90eXBlX2NvZGUgPSBpbnZhbGlkVHlwZUNvZGUgfHxcbiAgICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIO1xuICAgIHRoaXMuI19pbnZhbGlkX3JhbmdlX2NvZGUgPSBpbnZhbGlkUmFuZ2VDb2RlIHx8XG4gICAgICAgIHNjb3JtMTJfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFO1xuICAgIHRoaXMuI19kZWNpbWFsX3JlZ2V4ID0gZGVjaW1hbFJlZ2V4IHx8XG4gICAgICAgIHNjb3JtMTJfcmVnZXguQ01JRGVjaW1hbDtcbiAgfVxuXG4gICNfY2hpbGRyZW47XG4gICNfc2NvcmVfcmFuZ2U7XG4gICNfaW52YWxpZF9lcnJvcl9jb2RlO1xuICAjX2ludmFsaWRfdHlwZV9jb2RlO1xuICAjX2ludmFsaWRfcmFuZ2VfY29kZTtcbiAgI19kZWNpbWFsX3JlZ2V4O1xuICAjcmF3ID0gJyc7XG4gICNtaW4gPSAnJztcbiAgI21heDtcblxuICAvKipcbiAgICogR2V0dGVyIGZvciBfY2hpbGRyZW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IF9jaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHRoaXMuI19pbnZhbGlkX2Vycm9yX2NvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3Jhd1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgcmF3KCkge1xuICAgIHJldHVybiB0aGlzLiNyYXc7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcmF3XG4gICAqIEBwYXJhbSB7c3RyaW5nfSByYXdcbiAgICovXG4gIHNldCByYXcocmF3KSB7XG4gICAgaWYgKGNoZWNrVmFsaWRGb3JtYXQocmF3LCB0aGlzLiNfZGVjaW1hbF9yZWdleCxcbiAgICAgICAgdGhpcy4jX2ludmFsaWRfdHlwZV9jb2RlKSAmJlxuICAgICAgICAoIXRoaXMuI19zY29yZV9yYW5nZSB8fFxuICAgICAgICAgICAgY2hlY2tWYWxpZFJhbmdlKHJhdywgdGhpcy4jX3Njb3JlX3JhbmdlLFxuICAgICAgICAgICAgICAgIHRoaXMuI19pbnZhbGlkX3JhbmdlX2NvZGUpKSkge1xuICAgICAgdGhpcy4jcmF3ID0gcmF3O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNtaW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1pbigpIHtcbiAgICByZXR1cm4gdGhpcy4jbWluO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI21pblxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWluXG4gICAqL1xuICBzZXQgbWluKG1pbikge1xuICAgIGlmIChjaGVja1ZhbGlkRm9ybWF0KG1pbiwgdGhpcy4jX2RlY2ltYWxfcmVnZXgsXG4gICAgICAgIHRoaXMuI19pbnZhbGlkX3R5cGVfY29kZSkgJiZcbiAgICAgICAgKCF0aGlzLiNfc2NvcmVfcmFuZ2UgfHxcbiAgICAgICAgICAgIGNoZWNrVmFsaWRSYW5nZShtaW4sIHRoaXMuI19zY29yZV9yYW5nZSxcbiAgICAgICAgICAgICAgICB0aGlzLiNfaW52YWxpZF9yYW5nZV9jb2RlKSkpIHtcbiAgICAgIHRoaXMuI21pbiA9IG1pbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbWF4XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBtYXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuI21heDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNtYXhcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1heFxuICAgKi9cbiAgc2V0IG1heChtYXgpIHtcbiAgICBpZiAoY2hlY2tWYWxpZEZvcm1hdChtYXgsIHRoaXMuI19kZWNpbWFsX3JlZ2V4LFxuICAgICAgICB0aGlzLiNfaW52YWxpZF90eXBlX2NvZGUpICYmXG4gICAgICAgICghdGhpcy4jX3Njb3JlX3JhbmdlIHx8XG4gICAgICAgICAgICBjaGVja1ZhbGlkUmFuZ2UobWF4LCB0aGlzLiNfc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgICAgICAgdGhpcy4jX2ludmFsaWRfcmFuZ2VfY29kZSkpKSB7XG4gICAgICB0aGlzLiNtYXggPSBtYXg7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgKi5zY29yZVxuICAgKiBAcmV0dXJuIHt7bWluOiBzdHJpbmcsIG1heDogc3RyaW5nLCByYXc6IHN0cmluZ319XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAncmF3JzogdGhpcy5yYXcsXG4gICAgICAnbWluJzogdGhpcy5taW4sXG4gICAgICAnbWF4JzogdGhpcy5tYXgsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBjbWkgKi5uIG9iamVjdHNcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUFycmF5IGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBjbWkgKi5uIGFycmF5c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY2hpbGRyZW5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGVycm9yQ29kZVxuICAgKi9cbiAgY29uc3RydWN0b3Ioe2NoaWxkcmVuLCBlcnJvckNvZGV9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLiNfY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICB0aGlzLiNlcnJvckNvZGUgPSBlcnJvckNvZGU7XG4gICAgdGhpcy5jaGlsZEFycmF5ID0gW107XG4gIH1cblxuICAjZXJyb3JDb2RlO1xuICAjX2NoaWxkcmVuO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIF9jaGlsZHJlblxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IF9jaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHRoaXMuI2Vycm9yQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBfY291bnRcbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cbiAgZ2V0IF9jb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZEFycmF5Lmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yIF9jb3VudC4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBfY291bnRcbiAgICovXG4gIHNldCBfY291bnQoX2NvdW50KSB7XG4gICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcih0aGlzLiNlcnJvckNvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgKi5uIGFycmF5c1xuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0W2kgKyAnJ10gPSB0aGlzLmNoaWxkQXJyYXlbaV07XG4gICAgfVxuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCB7XG4gIEJhc2VDTUksXG4gIGNoZWNrVmFsaWRGb3JtYXQsXG4gIGNoZWNrVmFsaWRSYW5nZSxcbiAgQ01JQXJyYXksXG4gIENNSVNjb3JlLFxufSBmcm9tICcuL2NvbW1vbic7XG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCBFcnJvckNvZGVzIGZyb20gJy4uL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQgUmVnZXggZnJvbSAnLi4vY29uc3RhbnRzL3JlZ2V4JztcbmltcG9ydCB7VmFsaWRhdGlvbkVycm9yfSBmcm9tICcuLi9leGNlcHRpb25zJztcbmltcG9ydCAqIGFzIFV0aWxpdGllcyBmcm9tICcuLi91dGlsaXRpZXMnO1xuaW1wb3J0ICogYXMgVXRpbCBmcm9tICcuLi91dGlsaXRpZXMnO1xuXG5jb25zdCBzY29ybTEyX2NvbnN0YW50cyA9IEFQSUNvbnN0YW50cy5zY29ybTEyO1xuY29uc3Qgc2Nvcm0xMl9yZWdleCA9IFJlZ2V4LnNjb3JtMTI7XG5jb25zdCBzY29ybTEyX2Vycm9yX2NvZGVzID0gRXJyb3JDb2Rlcy5zY29ybTEyO1xuXG4vKipcbiAqIEhlbHBlciBtZXRob2QgZm9yIHRocm93aW5nIFJlYWQgT25seSBlcnJvclxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dSZWFkT25seUVycm9yKCkge1xuICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHNjb3JtMTJfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQpO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QgZm9yIHRocm93aW5nIFdyaXRlIE9ubHkgZXJyb3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93V3JpdGVPbmx5RXJyb3IoKSB7XG4gIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3Ioc2Nvcm0xMl9lcnJvcl9jb2Rlcy5XUklURV9PTkxZX0VMRU1FTlQpO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QgZm9yIHRocm93aW5nIEludmFsaWQgU2V0IGVycm9yXG4gKi9cbmZ1bmN0aW9uIHRocm93SW52YWxpZFZhbHVlRXJyb3IoKSB7XG4gIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3Ioc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCwgbm8gcmVhc29uIHRvIGhhdmUgdG8gcGFzcyB0aGUgc2FtZSBlcnJvciBjb2RlcyBldmVyeSB0aW1lXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVnZXhQYXR0ZXJuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGFsbG93RW1wdHlTdHJpbmdcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVjazEyVmFsaWRGb3JtYXQoXG4gICAgdmFsdWU6IFN0cmluZyxcbiAgICByZWdleFBhdHRlcm46IFN0cmluZyxcbiAgICBhbGxvd0VtcHR5U3RyaW5nPzogYm9vbGVhbikge1xuICByZXR1cm4gY2hlY2tWYWxpZEZvcm1hdCh2YWx1ZSwgcmVnZXhQYXR0ZXJuLFxuICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENILCBhbGxvd0VtcHR5U3RyaW5nKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kLCBubyByZWFzb24gdG8gaGF2ZSB0byBwYXNzIHRoZSBzYW1lIGVycm9yIGNvZGVzIGV2ZXJ5IHRpbWVcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSByYW5nZVBhdHRlcm5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWxsb3dFbXB0eVN0cmluZ1xuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrMTJWYWxpZFJhbmdlKFxuICAgIHZhbHVlOiBhbnksXG4gICAgcmFuZ2VQYXR0ZXJuOiBTdHJpbmcsXG4gICAgYWxsb3dFbXB0eVN0cmluZz86IGJvb2xlYW4pIHtcbiAgcmV0dXJuIGNoZWNrVmFsaWRSYW5nZSh2YWx1ZSwgcmFuZ2VQYXR0ZXJuLFxuICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0UsIGFsbG93RW1wdHlTdHJpbmcpO1xufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyB0aGUgY21pIG9iamVjdCBmb3IgU0NPUk0gMS4yXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUkgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI19jaGlsZHJlbiA9ICcnO1xuICAjX3ZlcnNpb24gPSAnMy40JztcbiAgI2xhdW5jaF9kYXRhID0gJyc7XG4gICNjb21tZW50cyA9ICcnO1xuICAjY29tbWVudHNfZnJvbV9sbXMgPSAnJztcblxuICBzdHVkZW50X2RhdGEgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgdGhlIFNDT1JNIDEuMiBjbWkgb2JqZWN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbWlfY2hpbGRyZW5cbiAgICogQHBhcmFtIHsoQ01JU3R1ZGVudERhdGF8QUlDQ0NNSVN0dWRlbnREYXRhKX0gc3R1ZGVudF9kYXRhXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5pdGlhbGl6ZWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNtaV9jaGlsZHJlbiwgc3R1ZGVudF9kYXRhLCBpbml0aWFsaXplZDogYm9vbGVhbikge1xuICAgIHN1cGVyKCk7XG5cbiAgICBpZiAoaW5pdGlhbGl6ZWQpIHRoaXMuaW5pdGlhbGl6ZSgpO1xuXG4gICAgdGhpcy4jX2NoaWxkcmVuID0gY21pX2NoaWxkcmVuID9cbiAgICAgICAgY21pX2NoaWxkcmVuIDpcbiAgICAgICAgc2Nvcm0xMl9jb25zdGFudHMuY21pX2NoaWxkcmVuO1xuICAgIHRoaXMuY29yZSA9IG5ldyBDTUlDb3JlKCk7XG4gICAgdGhpcy5vYmplY3RpdmVzID0gbmV3IENNSU9iamVjdGl2ZXMoKTtcbiAgICB0aGlzLnN0dWRlbnRfZGF0YSA9IHN0dWRlbnRfZGF0YSA/IHN0dWRlbnRfZGF0YSA6IG5ldyBDTUlTdHVkZW50RGF0YSgpO1xuICAgIHRoaXMuc3R1ZGVudF9wcmVmZXJlbmNlID0gbmV3IENNSVN0dWRlbnRQcmVmZXJlbmNlKCk7XG4gICAgdGhpcy5pbnRlcmFjdGlvbnMgPSBuZXcgQ01JSW50ZXJhY3Rpb25zKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuY29yZT8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMub2JqZWN0aXZlcz8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc3R1ZGVudF9kYXRhPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zdHVkZW50X3ByZWZlcmVuY2U/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmludGVyYWN0aW9ucz8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgc3VzcGVuZF9kYXRhOiBzdHJpbmcsXG4gICAqICAgICAgbGF1bmNoX2RhdGE6IHN0cmluZyxcbiAgICogICAgICBjb21tZW50czogc3RyaW5nLFxuICAgKiAgICAgIGNvbW1lbnRzX2Zyb21fbG1zOiBzdHJpbmcsXG4gICAqICAgICAgY29yZTogQ01JQ29yZSxcbiAgICogICAgICBvYmplY3RpdmVzOiBDTUlPYmplY3RpdmVzLFxuICAgKiAgICAgIHN0dWRlbnRfZGF0YTogQ01JU3R1ZGVudERhdGEsXG4gICAqICAgICAgc3R1ZGVudF9wcmVmZXJlbmNlOiBDTUlTdHVkZW50UHJlZmVyZW5jZSxcbiAgICogICAgICBpbnRlcmFjdGlvbnM6IENNSUludGVyYWN0aW9uc1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnc3VzcGVuZF9kYXRhJzogdGhpcy5zdXNwZW5kX2RhdGEsXG4gICAgICAnbGF1bmNoX2RhdGEnOiB0aGlzLmxhdW5jaF9kYXRhLFxuICAgICAgJ2NvbW1lbnRzJzogdGhpcy5jb21tZW50cyxcbiAgICAgICdjb21tZW50c19mcm9tX2xtcyc6IHRoaXMuY29tbWVudHNfZnJvbV9sbXMsXG4gICAgICAnY29yZSc6IHRoaXMuY29yZSxcbiAgICAgICdvYmplY3RpdmVzJzogdGhpcy5vYmplY3RpdmVzLFxuICAgICAgJ3N0dWRlbnRfZGF0YSc6IHRoaXMuc3R1ZGVudF9kYXRhLFxuICAgICAgJ3N0dWRlbnRfcHJlZmVyZW5jZSc6IHRoaXMuc3R1ZGVudF9wcmVmZXJlbmNlLFxuICAgICAgJ2ludGVyYWN0aW9ucyc6IHRoaXMuaW50ZXJhY3Rpb25zLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI192ZXJzaW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBfdmVyc2lvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX3ZlcnNpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX3ZlcnNpb24uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX3ZlcnNpb25cbiAgICovXG4gIHNldCBfdmVyc2lvbihfdmVyc2lvbikge1xuICAgIHRocm93SW52YWxpZFZhbHVlRXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNfY2hpbGRyZW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IF9jaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI192ZXJzaW9uLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvd0ludmFsaWRWYWx1ZUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3VzcGVuZF9kYXRhXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdXNwZW5kX2RhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29yZT8uc3VzcGVuZF9kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N1c3BlbmRfZGF0YVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3VzcGVuZF9kYXRhXG4gICAqL1xuICBzZXQgc3VzcGVuZF9kYXRhKHN1c3BlbmRfZGF0YSkge1xuICAgIGlmICh0aGlzLmNvcmUpIHtcbiAgICAgIHRoaXMuY29yZS5zdXNwZW5kX2RhdGEgPSBzdXNwZW5kX2RhdGE7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xhdW5jaF9kYXRhXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsYXVuY2hfZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGF1bmNoX2RhdGE7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGF1bmNoX2RhdGEuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGF1bmNoX2RhdGFcbiAgICovXG4gIHNldCBsYXVuY2hfZGF0YShsYXVuY2hfZGF0YSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jbGF1bmNoX2RhdGEgPSBsYXVuY2hfZGF0YSA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NvbW1lbnRzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb21tZW50cygpIHtcbiAgICByZXR1cm4gdGhpcy4jY29tbWVudHM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29tbWVudHNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbW1lbnRzXG4gICAqL1xuICBzZXQgY29tbWVudHMoY29tbWVudHMpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGNvbW1lbnRzLCBzY29ybTEyX3JlZ2V4LkNNSVN0cmluZzQwOTYsIHRydWUpKSB7XG4gICAgICB0aGlzLiNjb21tZW50cyA9IGNvbW1lbnRzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb21tZW50c19mcm9tX2xtc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29tbWVudHNfZnJvbV9sbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbW1lbnRzX2Zyb21fbG1zO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbW1lbnRzX2Zyb21fbG1zLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbW1lbnRzX2Zyb21fbG1zXG4gICAqL1xuICBzZXQgY29tbWVudHNfZnJvbV9sbXMoY29tbWVudHNfZnJvbV9sbXMpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2NvbW1lbnRzX2Zyb21fbG1zID0gY29tbWVudHNfZnJvbV9sbXMgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHRoZSBjdXJyZW50IHNlc3Npb24gdGltZSB0byB0aGUgZXhpc3RpbmcgdG90YWwgdGltZS5cbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0Q3VycmVudFRvdGFsVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb3JlLmdldEN1cnJlbnRUb3RhbFRpbWUodGhpcy5zdGFydF90aW1lKTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyB0aGUgY21pLmNvcmUgb2JqZWN0XG4gKiBAZXh0ZW5kcyBCYXNlQ01JXG4gKi9cbmNsYXNzIENNSUNvcmUgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuY29yZVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc2NvcmUgPSBuZXcgQ01JU2NvcmUoXG4gICAgICAgIHtcbiAgICAgICAgICBzY29yZV9jaGlsZHJlbjogc2Nvcm0xMl9jb25zdGFudHMuc2NvcmVfY2hpbGRyZW4sXG4gICAgICAgICAgc2NvcmVfcmFuZ2U6IHNjb3JtMTJfcmVnZXguc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgaW52YWxpZEVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgICAgICBpbnZhbGlkVHlwZUNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCxcbiAgICAgICAgICBpbnZhbGlkUmFuZ2VDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRSxcbiAgICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc2NvcmU/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICNfY2hpbGRyZW4gPSBzY29ybTEyX2NvbnN0YW50cy5jb3JlX2NoaWxkcmVuO1xuICAjc3R1ZGVudF9pZCA9ICcnO1xuICAjc3R1ZGVudF9uYW1lID0gJyc7XG4gICNsZXNzb25fbG9jYXRpb24gPSAnJztcbiAgI2NyZWRpdCA9ICcnO1xuICAjbGVzc29uX3N0YXR1cyA9ICdub3QgYXR0ZW1wdGVkJztcbiAgI2VudHJ5ID0gJyc7XG4gICN0b3RhbF90aW1lID0gJyc7XG4gICNsZXNzb25fbW9kZSA9ICdub3JtYWwnO1xuICAjZXhpdCA9ICcnO1xuICAjc2Vzc2lvbl90aW1lID0gJzAwOjAwOjAwJztcbiAgI3N1c3BlbmRfZGF0YSA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNfY2hpbGRyZW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IF9jaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI19jaGlsZHJlbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfY2hpbGRyZW5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldCBfY2hpbGRyZW4oX2NoaWxkcmVuKSB7XG4gICAgdGhyb3dJbnZhbGlkVmFsdWVFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N0dWRlbnRfaWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN0dWRlbnRfaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0dWRlbnRfaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3R1ZGVudF9pZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHVkZW50X2lkXG4gICAqL1xuICBzZXQgc3R1ZGVudF9pZChzdHVkZW50X2lkKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNzdHVkZW50X2lkID0gc3R1ZGVudF9pZCA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N0dWRlbnRfbmFtZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3R1ZGVudF9uYW1lKCkge1xuICAgIHJldHVybiB0aGlzLiNzdHVkZW50X25hbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3R1ZGVudF9uYW1lLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0dWRlbnRfbmFtZVxuICAgKi9cbiAgc2V0IHN0dWRlbnRfbmFtZShzdHVkZW50X25hbWUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI3N0dWRlbnRfbmFtZSA9IHN0dWRlbnRfbmFtZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xlc3Nvbl9sb2NhdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVzc29uX2xvY2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNsZXNzb25fbG9jYXRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGVzc29uX2xvY2F0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZXNzb25fbG9jYXRpb25cbiAgICovXG4gIHNldCBsZXNzb25fbG9jYXRpb24obGVzc29uX2xvY2F0aW9uKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChsZXNzb25fbG9jYXRpb24sIHNjb3JtMTJfcmVnZXguQ01JU3RyaW5nMjU2LCB0cnVlKSkge1xuICAgICAgdGhpcy4jbGVzc29uX2xvY2F0aW9uID0gbGVzc29uX2xvY2F0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjcmVkaXRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNyZWRpdCgpIHtcbiAgICByZXR1cm4gdGhpcy4jY3JlZGl0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NyZWRpdC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjcmVkaXRcbiAgICovXG4gIHNldCBjcmVkaXQoY3JlZGl0KSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNjcmVkaXQgPSBjcmVkaXQgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsZXNzb25fc3RhdHVzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsZXNzb25fc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNsZXNzb25fc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xlc3Nvbl9zdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlc3Nvbl9zdGF0dXNcbiAgICovXG4gIHNldCBsZXNzb25fc3RhdHVzKGxlc3Nvbl9zdGF0dXMpIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChsZXNzb25fc3RhdHVzLCBzY29ybTEyX3JlZ2V4LkNNSVN0YXR1cykpIHtcbiAgICAgICAgdGhpcy4jbGVzc29uX3N0YXR1cyA9IGxlc3Nvbl9zdGF0dXM7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQobGVzc29uX3N0YXR1cywgc2Nvcm0xMl9yZWdleC5DTUlTdGF0dXMyKSkge1xuICAgICAgICB0aGlzLiNsZXNzb25fc3RhdHVzID0gbGVzc29uX3N0YXR1cztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZW50cnlcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGVudHJ5KCkge1xuICAgIHJldHVybiB0aGlzLiNlbnRyeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNlbnRyeS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlbnRyeVxuICAgKi9cbiAgc2V0IGVudHJ5KGVudHJ5KSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNlbnRyeSA9IGVudHJ5IDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdG90YWxfdGltZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdG90YWxfdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jdG90YWxfdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0b3RhbF90aW1lLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvdGFsX3RpbWVcbiAgICovXG4gIHNldCB0b3RhbF90aW1lKHRvdGFsX3RpbWUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI3RvdGFsX3RpbWUgPSB0b3RhbF90aW1lIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGVzc29uX21vZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlc3Nvbl9tb2RlKCkge1xuICAgIHJldHVybiB0aGlzLiNsZXNzb25fbW9kZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsZXNzb25fbW9kZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZXNzb25fbW9kZVxuICAgKi9cbiAgc2V0IGxlc3Nvbl9tb2RlKGxlc3Nvbl9tb2RlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNsZXNzb25fbW9kZSA9IGxlc3Nvbl9tb2RlIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZXhpdC4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCBleGl0KCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNleGl0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2V4aXRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV4aXRcbiAgICovXG4gIHNldCBleGl0KGV4aXQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGV4aXQsIHNjb3JtMTJfcmVnZXguQ01JRXhpdCwgdHJ1ZSkpIHtcbiAgICAgIHRoaXMuI2V4aXQgPSBleGl0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzZXNzaW9uX3RpbWUuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgc2Vzc2lvbl90aW1lKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNzZXNzaW9uX3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc2Vzc2lvbl90aW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZXNzaW9uX3RpbWVcbiAgICovXG4gIHNldCBzZXNzaW9uX3RpbWUoc2Vzc2lvbl90aW1lKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChzZXNzaW9uX3RpbWUsIHNjb3JtMTJfcmVnZXguQ01JVGltZXNwYW4pKSB7XG4gICAgICB0aGlzLiNzZXNzaW9uX3RpbWUgPSBzZXNzaW9uX3RpbWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N1c3BlbmRfZGF0YVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3VzcGVuZF9kYXRhKCkge1xuICAgIHJldHVybiB0aGlzLiNzdXNwZW5kX2RhdGE7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3VzcGVuZF9kYXRhXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdXNwZW5kX2RhdGFcbiAgICovXG4gIHNldCBzdXNwZW5kX2RhdGEoc3VzcGVuZF9kYXRhKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChzdXNwZW5kX2RhdGEsIHNjb3JtMTJfcmVnZXguQ01JU3RyaW5nNDA5NiwgdHJ1ZSkpIHtcbiAgICAgIHRoaXMuI3N1c3BlbmRfZGF0YSA9IHN1c3BlbmRfZGF0YTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0aGUgY3VycmVudCBzZXNzaW9uIHRpbWUgdG8gdGhlIGV4aXN0aW5nIHRvdGFsIHRpbWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydF90aW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldEN1cnJlbnRUb3RhbFRpbWUoc3RhcnRfdGltZTogTnVtYmVyKSB7XG4gICAgbGV0IHNlc3Npb25UaW1lID0gdGhpcy4jc2Vzc2lvbl90aW1lO1xuICAgIGNvbnN0IHN0YXJ0VGltZSA9IHN0YXJ0X3RpbWU7XG5cbiAgICBpZiAodHlwZW9mIHN0YXJ0VGltZSAhPT0gJ3VuZGVmaW5lZCcgJiYgc3RhcnRUaW1lICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBzZWNvbmRzID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBzdGFydFRpbWU7XG4gICAgICBzZXNzaW9uVGltZSA9IFV0aWwuZ2V0U2Vjb25kc0FzSEhNTVNTKHNlY29uZHMgLyAxMDAwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gVXRpbGl0aWVzLmFkZEhITU1TU1RpbWVTdHJpbmdzKFxuICAgICAgICB0aGlzLiN0b3RhbF90aW1lLFxuICAgICAgICBzZXNzaW9uVGltZSxcbiAgICAgICAgbmV3IFJlZ0V4cChzY29ybTEyX3JlZ2V4LkNNSVRpbWVzcGFuKSxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmNvcmVcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBzdHVkZW50X25hbWU6IHN0cmluZyxcbiAgICogICAgICBlbnRyeTogc3RyaW5nLFxuICAgKiAgICAgIGV4aXQ6IHN0cmluZyxcbiAgICogICAgICBzY29yZTogQ01JU2NvcmUsXG4gICAqICAgICAgc3R1ZGVudF9pZDogc3RyaW5nLFxuICAgKiAgICAgIGxlc3Nvbl9tb2RlOiBzdHJpbmcsXG4gICAqICAgICAgbGVzc29uX2xvY2F0aW9uOiBzdHJpbmcsXG4gICAqICAgICAgbGVzc29uX3N0YXR1czogc3RyaW5nLFxuICAgKiAgICAgIGNyZWRpdDogc3RyaW5nLFxuICAgKiAgICAgIHNlc3Npb25fdGltZTogKlxuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnc3R1ZGVudF9pZCc6IHRoaXMuc3R1ZGVudF9pZCxcbiAgICAgICdzdHVkZW50X25hbWUnOiB0aGlzLnN0dWRlbnRfbmFtZSxcbiAgICAgICdsZXNzb25fbG9jYXRpb24nOiB0aGlzLmxlc3Nvbl9sb2NhdGlvbixcbiAgICAgICdjcmVkaXQnOiB0aGlzLmNyZWRpdCxcbiAgICAgICdsZXNzb25fc3RhdHVzJzogdGhpcy5sZXNzb25fc3RhdHVzLFxuICAgICAgJ2VudHJ5JzogdGhpcy5lbnRyeSxcbiAgICAgICdsZXNzb25fbW9kZSc6IHRoaXMubGVzc29uX21vZGUsXG4gICAgICAnZXhpdCc6IHRoaXMuZXhpdCxcbiAgICAgICdzZXNzaW9uX3RpbWUnOiB0aGlzLnNlc3Npb25fdGltZSxcbiAgICAgICdzY29yZSc6IHRoaXMuc2NvcmUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLm9iamVjdGl2ZXMgb2JqZWN0XG4gKiBAZXh0ZW5kcyBDTUlBcnJheVxuICovXG5jbGFzcyBDTUlPYmplY3RpdmVzIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5vYmplY3RpdmVzXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogc2Nvcm0xMl9jb25zdGFudHMub2JqZWN0aXZlc19jaGlsZHJlbixcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkuc3R1ZGVudF9kYXRhIG9iamVjdFxuICogQGV4dGVuZHMgQmFzZUNNSVxuICovXG5leHBvcnQgY2xhc3MgQ01JU3R1ZGVudERhdGEgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI19jaGlsZHJlbjtcbiAgI21hc3Rlcnlfc2NvcmUgPSAnJztcbiAgI21heF90aW1lX2FsbG93ZWQgPSAnJztcbiAgI3RpbWVfbGltaXRfYWN0aW9uID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuc3R1ZGVudF9kYXRhXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHVkZW50X2RhdGFfY2hpbGRyZW5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHN0dWRlbnRfZGF0YV9jaGlsZHJlbikge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLiNfY2hpbGRyZW4gPSBzdHVkZW50X2RhdGFfY2hpbGRyZW4gP1xuICAgICAgICBzdHVkZW50X2RhdGFfY2hpbGRyZW4gOlxuICAgICAgICBzY29ybTEyX2NvbnN0YW50cy5zdHVkZW50X2RhdGFfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX2NoaWxkcmVuXG4gICAqIEByZXR1cm4geyp9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvd0ludmFsaWRWYWx1ZUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbWFzdGVyX3Njb3JlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBtYXN0ZXJ5X3Njb3JlKCkge1xuICAgIHJldHVybiB0aGlzLiNtYXN0ZXJ5X3Njb3JlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI21hc3Rlcl9zY29yZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYXN0ZXJ5X3Njb3JlXG4gICAqL1xuICBzZXQgbWFzdGVyeV9zY29yZShtYXN0ZXJ5X3Njb3JlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNtYXN0ZXJ5X3Njb3JlID0gbWFzdGVyeV9zY29yZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI21heF90aW1lX2FsbG93ZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1heF90aW1lX2FsbG93ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI21heF90aW1lX2FsbG93ZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbWF4X3RpbWVfYWxsb3dlZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYXhfdGltZV9hbGxvd2VkXG4gICAqL1xuICBzZXQgbWF4X3RpbWVfYWxsb3dlZChtYXhfdGltZV9hbGxvd2VkKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNtYXhfdGltZV9hbGxvd2VkID0gbWF4X3RpbWVfYWxsb3dlZCA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWVfbGltaXRfYWN0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lX2xpbWl0X2FjdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jdGltZV9saW1pdF9hY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGltZV9saW1pdF9hY3Rpb24uIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZV9saW1pdF9hY3Rpb25cbiAgICovXG4gIHNldCB0aW1lX2xpbWl0X2FjdGlvbih0aW1lX2xpbWl0X2FjdGlvbikge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jdGltZV9saW1pdF9hY3Rpb24gPSB0aW1lX2xpbWl0X2FjdGlvbiA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLnN0dWRlbnRfZGF0YVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIG1heF90aW1lX2FsbG93ZWQ6IHN0cmluZyxcbiAgICogICAgICB0aW1lX2xpbWl0X2FjdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIG1hc3Rlcnlfc2NvcmU6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnbWFzdGVyeV9zY29yZSc6IHRoaXMubWFzdGVyeV9zY29yZSxcbiAgICAgICdtYXhfdGltZV9hbGxvd2VkJzogdGhpcy5tYXhfdGltZV9hbGxvd2VkLFxuICAgICAgJ3RpbWVfbGltaXRfYWN0aW9uJzogdGhpcy50aW1lX2xpbWl0X2FjdGlvbixcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkuc3R1ZGVudF9wcmVmZXJlbmNlIG9iamVjdFxuICogQGV4dGVuZHMgQmFzZUNNSVxuICovXG5leHBvcnQgY2xhc3MgQ01JU3R1ZGVudFByZWZlcmVuY2UgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI19jaGlsZHJlbjtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5zdHVkZW50X3ByZWZlcmVuY2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlblxuICAgKi9cbiAgY29uc3RydWN0b3Ioc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuI19jaGlsZHJlbiA9IHN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbiA/XG4gICAgICAgIHN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbiA6XG4gICAgICAgIHNjb3JtMTJfY29uc3RhbnRzLnN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbjtcbiAgfVxuXG4gICNhdWRpbyA9ICcnO1xuICAjbGFuZ3VhZ2UgPSAnJztcbiAgI3NwZWVkID0gJyc7XG4gICN0ZXh0ID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI19jaGlsZHJlblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvd0ludmFsaWRWYWx1ZUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjYXVkaW9cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGF1ZGlvKCkge1xuICAgIHJldHVybiB0aGlzLiNhdWRpbztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNhdWRpb1xuICAgKiBAcGFyYW0ge3N0cmluZ30gYXVkaW9cbiAgICovXG4gIHNldCBhdWRpbyhhdWRpbykge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoYXVkaW8sIHNjb3JtMTJfcmVnZXguQ01JU0ludGVnZXIpICYmXG4gICAgICAgIGNoZWNrMTJWYWxpZFJhbmdlKGF1ZGlvLCBzY29ybTEyX3JlZ2V4LmF1ZGlvX3JhbmdlKSkge1xuICAgICAgdGhpcy4jYXVkaW8gPSBhdWRpbztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGFuZ3VhZ2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxhbmd1YWdlKCkge1xuICAgIHJldHVybiB0aGlzLiNsYW5ndWFnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsYW5ndWFnZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGFuZ3VhZ2VcbiAgICovXG4gIHNldCBsYW5ndWFnZShsYW5ndWFnZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQobGFuZ3VhZ2UsIHNjb3JtMTJfcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jbGFuZ3VhZ2UgPSBsYW5ndWFnZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3BlZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHNwZWVkKCkge1xuICAgIHJldHVybiB0aGlzLiNzcGVlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzcGVlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3BlZWRcbiAgICovXG4gIHNldCBzcGVlZChzcGVlZCkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoc3BlZWQsIHNjb3JtMTJfcmVnZXguQ01JU0ludGVnZXIpICYmXG4gICAgICAgIGNoZWNrMTJWYWxpZFJhbmdlKHNwZWVkLCBzY29ybTEyX3JlZ2V4LnNwZWVkX3JhbmdlKSkge1xuICAgICAgdGhpcy4jc3BlZWQgPSBzcGVlZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGV4dFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy4jdGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0ZXh0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4gICAqL1xuICBzZXQgdGV4dCh0ZXh0KSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh0ZXh0LCBzY29ybTEyX3JlZ2V4LkNNSVNJbnRlZ2VyKSAmJlxuICAgICAgICBjaGVjazEyVmFsaWRSYW5nZSh0ZXh0LCBzY29ybTEyX3JlZ2V4LnRleHRfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiN0ZXh0ID0gdGV4dDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuc3R1ZGVudF9wcmVmZXJlbmNlXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgYXVkaW86IHN0cmluZyxcbiAgICogICAgICBsYW5ndWFnZTogc3RyaW5nLFxuICAgKiAgICAgIHNwZWVkOiBzdHJpbmcsXG4gICAqICAgICAgdGV4dDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdhdWRpbyc6IHRoaXMuYXVkaW8sXG4gICAgICAnbGFuZ3VhZ2UnOiB0aGlzLmxhbmd1YWdlLFxuICAgICAgJ3NwZWVkJzogdGhpcy5zcGVlZCxcbiAgICAgICd0ZXh0JzogdGhpcy50ZXh0LFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5pbnRlcmFjdGlvbnMgb2JqZWN0XG4gKiBAZXh0ZW5kcyBCYXNlQ01JXG4gKi9cbmNsYXNzIENNSUludGVyYWN0aW9ucyBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogc2Nvcm0xMl9jb25zdGFudHMuaW50ZXJhY3Rpb25zX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5pbnRlcmFjdGlvbnMubiBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5pbnRlcmFjdGlvbnMubiBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLm9iamVjdGl2ZXMgPSBuZXcgQ01JQXJyYXkoe1xuICAgICAgZXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgY2hpbGRyZW46IHNjb3JtMTJfY29uc3RhbnRzLm9iamVjdGl2ZXNfY2hpbGRyZW4sXG4gICAgfSk7XG4gICAgdGhpcy5jb3JyZWN0X3Jlc3BvbnNlcyA9IG5ldyBDTUlBcnJheSh7XG4gICAgICBlcnJvckNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUsXG4gICAgICBjaGlsZHJlbjogc2Nvcm0xMl9jb25zdGFudHMuY29ycmVjdF9yZXNwb25zZXNfY2hpbGRyZW4sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMub2JqZWN0aXZlcz8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuY29ycmVjdF9yZXNwb25zZXM/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICNpZCA9ICcnO1xuICAjdGltZSA9ICcnO1xuICAjdHlwZSA9ICcnO1xuICAjd2VpZ2h0aW5nID0gJyc7XG4gICNzdHVkZW50X3Jlc3BvbnNlID0gJyc7XG4gICNyZXN1bHQgPSAnJztcbiAgI2xhdGVuY3kgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaWQuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChpZCwgc2Nvcm0xMl9yZWdleC5DTUlJZGVudGlmaWVyKSkge1xuICAgICAgdGhpcy4jaWQgPSBpZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZS4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCB0aW1lKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiN0aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVcbiAgICovXG4gIHNldCB0aW1lKHRpbWUpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHRpbWUsIHNjb3JtMTJfcmVnZXguQ01JVGltZSkpIHtcbiAgICAgIHRoaXMuI3RpbWUgPSB0aW1lO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0eXBlLiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI3R5cGU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICAgKi9cbiAgc2V0IHR5cGUodHlwZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQodHlwZSwgc2Nvcm0xMl9yZWdleC5DTUlUeXBlKSkge1xuICAgICAgdGhpcy4jdHlwZSA9IHR5cGU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3dlaWdodGluZy4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCB3ZWlnaHRpbmcoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/XG4gICAgICAgIHRocm93V3JpdGVPbmx5RXJyb3IoKSA6XG4gICAgICAgIHRoaXMuI3dlaWdodGluZztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN3ZWlnaHRpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IHdlaWdodGluZ1xuICAgKi9cbiAgc2V0IHdlaWdodGluZyh3ZWlnaHRpbmcpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHdlaWdodGluZywgc2Nvcm0xMl9yZWdleC5DTUlEZWNpbWFsKSAmJlxuICAgICAgICBjaGVjazEyVmFsaWRSYW5nZSh3ZWlnaHRpbmcsIHNjb3JtMTJfcmVnZXgud2VpZ2h0aW5nX3JhbmdlKSkge1xuICAgICAgdGhpcy4jd2VpZ2h0aW5nID0gd2VpZ2h0aW5nO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdHVkZW50X3Jlc3BvbnNlLiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IHN0dWRlbnRfcmVzcG9uc2UoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI3N0dWRlbnRfcmVzcG9uc2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3R1ZGVudF9yZXNwb25zZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3R1ZGVudF9yZXNwb25zZVxuICAgKi9cbiAgc2V0IHN0dWRlbnRfcmVzcG9uc2Uoc3R1ZGVudF9yZXNwb25zZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoc3R1ZGVudF9yZXNwb25zZSwgc2Nvcm0xMl9yZWdleC5DTUlGZWVkYmFjaywgdHJ1ZSkpIHtcbiAgICAgIHRoaXMuI3N0dWRlbnRfcmVzcG9uc2UgPSBzdHVkZW50X3Jlc3BvbnNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNyZXN1bHQuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgcmVzdWx0KCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNyZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcmVzdWx0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZXN1bHRcbiAgICovXG4gIHNldCByZXN1bHQocmVzdWx0KSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChyZXN1bHQsIHNjb3JtMTJfcmVnZXguQ01JUmVzdWx0KSkge1xuICAgICAgdGhpcy4jcmVzdWx0ID0gcmVzdWx0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsYXRlbmN5LiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IGxhdGVuY3koKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI2xhdGVuY3k7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGF0ZW5jeVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGF0ZW5jeVxuICAgKi9cbiAgc2V0IGxhdGVuY3kobGF0ZW5jeSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQobGF0ZW5jeSwgc2Nvcm0xMl9yZWdleC5DTUlUaW1lc3BhbikpIHtcbiAgICAgIHRoaXMuI2xhdGVuY3kgPSBsYXRlbmN5O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5pbnRlcmFjdGlvbnMublxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGlkOiBzdHJpbmcsXG4gICAqICAgICAgdGltZTogc3RyaW5nLFxuICAgKiAgICAgIHR5cGU6IHN0cmluZyxcbiAgICogICAgICB3ZWlnaHRpbmc6IHN0cmluZyxcbiAgICogICAgICBzdHVkZW50X3Jlc3BvbnNlOiBzdHJpbmcsXG4gICAqICAgICAgcmVzdWx0OiBzdHJpbmcsXG4gICAqICAgICAgbGF0ZW5jeTogc3RyaW5nLFxuICAgKiAgICAgIG9iamVjdGl2ZXM6IENNSUFycmF5LFxuICAgKiAgICAgIGNvcnJlY3RfcmVzcG9uc2VzOiBDTUlBcnJheVxuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnaWQnOiB0aGlzLmlkLFxuICAgICAgJ3RpbWUnOiB0aGlzLnRpbWUsXG4gICAgICAndHlwZSc6IHRoaXMudHlwZSxcbiAgICAgICd3ZWlnaHRpbmcnOiB0aGlzLndlaWdodGluZyxcbiAgICAgICdzdHVkZW50X3Jlc3BvbnNlJzogdGhpcy5zdHVkZW50X3Jlc3BvbnNlLFxuICAgICAgJ3Jlc3VsdCc6IHRoaXMucmVzdWx0LFxuICAgICAgJ2xhdGVuY3knOiB0aGlzLmxhdGVuY3ksXG4gICAgICAnb2JqZWN0aXZlcyc6IHRoaXMub2JqZWN0aXZlcyxcbiAgICAgICdjb3JyZWN0X3Jlc3BvbnNlcyc6IHRoaXMuY29ycmVjdF9yZXNwb25zZXMsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLm9iamVjdGl2ZXMubiBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSU9iamVjdGl2ZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkub2JqZWN0aXZlcy5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zY29yZSA9IG5ldyBDTUlTY29yZShcbiAgICAgICAge1xuICAgICAgICAgIHNjb3JlX2NoaWxkcmVuOiBzY29ybTEyX2NvbnN0YW50cy5zY29yZV9jaGlsZHJlbixcbiAgICAgICAgICBzY29yZV9yYW5nZTogc2Nvcm0xMl9yZWdleC5zY29yZV9yYW5nZSxcbiAgICAgICAgICBpbnZhbGlkRXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgICAgIGludmFsaWRUeXBlQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENILFxuICAgICAgICAgIGludmFsaWRSYW5nZUNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFLFxuICAgICAgICB9KTtcbiAgfVxuXG4gICNpZCA9ICcnO1xuICAjc3RhdHVzID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2lkXG4gICAqIEByZXR1cm4ge1wiXCJ9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChpZCwgc2Nvcm0xMl9yZWdleC5DTUlJZGVudGlmaWVyKSkge1xuICAgICAgdGhpcy4jaWQgPSBpZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3RhdHVzXG4gICAqIEByZXR1cm4ge1wiXCJ9XG4gICAqL1xuICBnZXQgc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNzdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0dXNcbiAgICovXG4gIHNldCBzdGF0dXMoc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChzdGF0dXMsIHNjb3JtMTJfcmVnZXguQ01JU3RhdHVzMikpIHtcbiAgICAgIHRoaXMuI3N0YXR1cyA9IHN0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkub2JqZWN0aXZlcy5uXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgaWQ6IHN0cmluZyxcbiAgICogICAgICBzdGF0dXM6IHN0cmluZyxcbiAgICogICAgICBzY29yZTogQ01JU2NvcmVcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICAgICdzdGF0dXMnOiB0aGlzLnN0YXR1cyxcbiAgICAgICdzY29yZSc6IHRoaXMuc2NvcmUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLmludGVyYWN0aW9ucy5uLm9iamVjdGl2ZXMubiBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc09iamVjdGl2ZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4ub2JqZWN0aXZlcy5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgI2lkID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2lkXG4gICAqIEByZXR1cm4ge1wiXCJ9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChpZCwgc2Nvcm0xMl9yZWdleC5DTUlJZGVudGlmaWVyKSkge1xuICAgICAgdGhpcy4jaWQgPSBpZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4ub2JqZWN0aXZlcy5uXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgaWQ6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnaWQnOiB0aGlzLmlkLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5pbnRlcmFjdGlvbnMuY29ycmVjdF9yZXNwb25zZXMubiBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc0NvcnJlY3RSZXNwb25zZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLmNvcnJlY3RfcmVzcG9uc2VzLm5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAjcGF0dGVybiA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNwYXR0ZXJuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBwYXR0ZXJuKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNwYXR0ZXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3BhdHRlcm5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdHRlcm5cbiAgICovXG4gIHNldCBwYXR0ZXJuKHBhdHRlcm4pIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHBhdHRlcm4sIHNjb3JtMTJfcmVnZXguQ01JRmVlZGJhY2ssIHRydWUpKSB7XG4gICAgICB0aGlzLiNwYXR0ZXJuID0gcGF0dGVybjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuaW50ZXJhY3Rpb25zLmNvcnJlY3RfcmVzcG9uc2VzLm5cbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBwYXR0ZXJuOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3BhdHRlcm4nOiB0aGlzLnBhdHRlcm4sXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgQUlDQyBOYXZpZ2F0aW9uIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgTkFWIGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgTkFWIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gICNldmVudCA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNldmVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZXZlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2V2ZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2V2ZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgKi9cbiAgc2V0IGV2ZW50KGV2ZW50KSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChldmVudCwgc2Nvcm0xMl9yZWdleC5OQVZFdmVudCkpIHtcbiAgICAgIHRoaXMuI2V2ZW50ID0gZXZlbnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgbmF2IG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGV2ZW50OiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2V2ZW50JzogdGhpcy5ldmVudCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCB7XG4gIEJhc2VDTUksXG4gIGNoZWNrVmFsaWRGb3JtYXQsXG4gIGNoZWNrVmFsaWRSYW5nZSxcbiAgQ01JQXJyYXksXG4gIENNSVNjb3JlLFxufSBmcm9tICcuL2NvbW1vbic7XG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCBSZWdleCBmcm9tICcuLi9jb25zdGFudHMvcmVnZXgnO1xuaW1wb3J0IEVycm9yQ29kZXMgZnJvbSAnLi4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJztcbmltcG9ydCBSZXNwb25zZXMgZnJvbSAnLi4vY29uc3RhbnRzL3Jlc3BvbnNlX2NvbnN0YW50cyc7XG5pbXBvcnQge1ZhbGlkYXRpb25FcnJvcn0gZnJvbSAnLi4vZXhjZXB0aW9ucyc7XG5pbXBvcnQgKiBhcyBVdGlsIGZyb20gJy4uL3V0aWxpdGllcyc7XG5cbmNvbnN0IHNjb3JtMjAwNF9jb25zdGFudHMgPSBBUElDb25zdGFudHMuc2Nvcm0yMDA0O1xuY29uc3Qgc2Nvcm0yMDA0X2Vycm9yX2NvZGVzID0gRXJyb3JDb2Rlcy5zY29ybTIwMDQ7XG5jb25zdCBsZWFybmVyX3Jlc3BvbnNlcyA9IFJlc3BvbnNlcy5sZWFybmVyO1xuXG5jb25zdCBzY29ybTIwMDRfcmVnZXggPSBSZWdleC5zY29ybTIwMDQ7XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgUmVhZCBPbmx5IGVycm9yXG4gKi9cbmZ1bmN0aW9uIHRocm93UmVhZE9ubHlFcnJvcigpIHtcbiAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQpO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QgZm9yIHRocm93aW5nIFdyaXRlIE9ubHkgZXJyb3JcbiAqL1xuZnVuY3Rpb24gdGhyb3dXcml0ZU9ubHlFcnJvcigpIHtcbiAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuV1JJVEVfT05MWV9FTEVNRU5UKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIGZvciB0aHJvd2luZyBUeXBlIE1pc21hdGNoIGVycm9yXG4gKi9cbmZ1bmN0aW9uIHRocm93VHlwZU1pc21hdGNoRXJyb3IoKSB7XG4gIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QsIG5vIHJlYXNvbiB0byBoYXZlIHRvIHBhc3MgdGhlIHNhbWUgZXJyb3IgY29kZXMgZXZlcnkgdGltZVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9IHJlZ2V4UGF0dGVyblxuICogQHBhcmFtIHtib29sZWFufSBhbGxvd0VtcHR5U3RyaW5nXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBjaGVjazIwMDRWYWxpZEZvcm1hdChcbiAgICB2YWx1ZTogU3RyaW5nLFxuICAgIHJlZ2V4UGF0dGVybjogU3RyaW5nLFxuICAgIGFsbG93RW1wdHlTdHJpbmc/OiBib29sZWFuKSB7XG4gIHJldHVybiBjaGVja1ZhbGlkRm9ybWF0KHZhbHVlLCByZWdleFBhdHRlcm4sXG4gICAgICBzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCwgYWxsb3dFbXB0eVN0cmluZyk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCwgbm8gcmVhc29uIHRvIGhhdmUgdG8gcGFzcyB0aGUgc2FtZSBlcnJvciBjb2RlcyBldmVyeSB0aW1lXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcmFuZ2VQYXR0ZXJuXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBjaGVjazIwMDRWYWxpZFJhbmdlKHZhbHVlOiBhbnksIHJhbmdlUGF0dGVybjogU3RyaW5nKSB7XG4gIHJldHVybiBjaGVja1ZhbGlkUmFuZ2UodmFsdWUsIHJhbmdlUGF0dGVybixcbiAgICAgIHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0UpO1xufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBjbWkgb2JqZWN0IGZvciBTQ09STSAyMDA0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUkgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciB0aGUgU0NPUk0gMjAwNCBjbWkgb2JqZWN0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5pdGlhbGl6ZWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKGluaXRpYWxpemVkOiBib29sZWFuKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubGVhcm5lcl9wcmVmZXJlbmNlID0gbmV3IENNSUxlYXJuZXJQcmVmZXJlbmNlKCk7XG4gICAgdGhpcy5zY29yZSA9IG5ldyBTY29ybTIwMDRDTUlTY29yZSgpO1xuICAgIHRoaXMuY29tbWVudHNfZnJvbV9sZWFybmVyID0gbmV3IENNSUNvbW1lbnRzRnJvbUxlYXJuZXIoKTtcbiAgICB0aGlzLmNvbW1lbnRzX2Zyb21fbG1zID0gbmV3IENNSUNvbW1lbnRzRnJvbUxNUygpO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zID0gbmV3IENNSUludGVyYWN0aW9ucygpO1xuICAgIHRoaXMub2JqZWN0aXZlcyA9IG5ldyBDTUlPYmplY3RpdmVzKCk7XG5cbiAgICBpZiAoaW5pdGlhbGl6ZWQpIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgI192ZXJzaW9uID0gJzEuMCc7XG4gICNfY2hpbGRyZW4gPSBzY29ybTIwMDRfY29uc3RhbnRzLmNtaV9jaGlsZHJlbjtcbiAgI2NvbXBsZXRpb25fc3RhdHVzID0gJ3Vua25vd24nO1xuICAjY29tcGxldGlvbl90aHJlc2hvbGQgPSAnJztcbiAgI2NyZWRpdCA9ICdjcmVkaXQnO1xuICAjZW50cnkgPSAnJztcbiAgI2V4aXQgPSAnJztcbiAgI2xhdW5jaF9kYXRhID0gJyc7XG4gICNsZWFybmVyX2lkID0gJyc7XG4gICNsZWFybmVyX25hbWUgPSAnJztcbiAgI2xvY2F0aW9uID0gJyc7XG4gICNtYXhfdGltZV9hbGxvd2VkID0gJyc7XG4gICNtb2RlID0gJ25vcm1hbCc7XG4gICNwcm9ncmVzc19tZWFzdXJlID0gJyc7XG4gICNzY2FsZWRfcGFzc2luZ19zY29yZSA9ICcnO1xuICAjc2Vzc2lvbl90aW1lID0gJ1BUMEgwTTBTJztcbiAgI3N1Y2Nlc3Nfc3RhdHVzID0gJ3Vua25vd24nO1xuICAjc3VzcGVuZF9kYXRhID0gJyc7XG4gICN0aW1lX2xpbWl0X2FjdGlvbiA9ICdjb250aW51ZSxubyBtZXNzYWdlJztcbiAgI3RvdGFsX3RpbWUgPSAnJztcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMubGVhcm5lcl9wcmVmZXJlbmNlPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zY29yZT8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuY29tbWVudHNfZnJvbV9sZWFybmVyPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5jb21tZW50c19mcm9tX2xtcz8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5vYmplY3RpdmVzPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX3ZlcnNpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IF92ZXJzaW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNfdmVyc2lvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfdmVyc2lvbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfdmVyc2lvblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF92ZXJzaW9uKF92ZXJzaW9uKSB7XG4gICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX2NoaWxkcmVuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge251bWJlcn0gX2NoaWxkcmVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NvbXBsZXRpb25fc3RhdHVzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb21wbGV0aW9uX3N0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jY29tcGxldGlvbl9zdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29tcGxldGlvbl9zdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbXBsZXRpb25fc3RhdHVzXG4gICAqL1xuICBzZXQgY29tcGxldGlvbl9zdGF0dXMoY29tcGxldGlvbl9zdGF0dXMpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoY29tcGxldGlvbl9zdGF0dXMsIHNjb3JtMjAwNF9yZWdleC5DTUlDU3RhdHVzKSkge1xuICAgICAgdGhpcy4jY29tcGxldGlvbl9zdGF0dXMgPSBjb21wbGV0aW9uX3N0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29tcGxldGlvbl90aHJlc2hvbGRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbXBsZXRpb25fdGhyZXNob2xkKCkge1xuICAgIHJldHVybiB0aGlzLiNjb21wbGV0aW9uX3RocmVzaG9sZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb21wbGV0aW9uX3RocmVzaG9sZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21wbGV0aW9uX3RocmVzaG9sZFxuICAgKi9cbiAgc2V0IGNvbXBsZXRpb25fdGhyZXNob2xkKGNvbXBsZXRpb25fdGhyZXNob2xkKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNjb21wbGV0aW9uX3RocmVzaG9sZCA9IGNvbXBsZXRpb25fdGhyZXNob2xkIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY3JlZGl0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjcmVkaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NyZWRpdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjcmVkaXQuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY3JlZGl0XG4gICAqL1xuICBzZXQgY3JlZGl0KGNyZWRpdCkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jY3JlZGl0ID0gY3JlZGl0IDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZW50cnlcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGVudHJ5KCkge1xuICAgIHJldHVybiB0aGlzLiNlbnRyeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNlbnRyeS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlbnRyeVxuICAgKi9cbiAgc2V0IGVudHJ5KGVudHJ5KSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNlbnRyeSA9IGVudHJ5IDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZXhpdC4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGV4aXQoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI2V4aXQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZXhpdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXhpdFxuICAgKi9cbiAgc2V0IGV4aXQoZXhpdCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChleGl0LCBzY29ybTIwMDRfcmVnZXguQ01JRXhpdCwgdHJ1ZSkpIHtcbiAgICAgIHRoaXMuI2V4aXQgPSBleGl0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsYXVuY2hfZGF0YVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGF1bmNoX2RhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xhdW5jaF9kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xhdW5jaF9kYXRhLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhdW5jaF9kYXRhXG4gICAqL1xuICBzZXQgbGF1bmNoX2RhdGEobGF1bmNoX2RhdGEpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI2xhdW5jaF9kYXRhID0gbGF1bmNoX2RhdGEgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsZWFybmVyX2lkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsZWFybmVyX2lkKCkge1xuICAgIHJldHVybiB0aGlzLiNsZWFybmVyX2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xlYXJuZXJfaWQuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGVhcm5lcl9pZFxuICAgKi9cbiAgc2V0IGxlYXJuZXJfaWQobGVhcm5lcl9pZCkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jbGVhcm5lcl9pZCA9IGxlYXJuZXJfaWQgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsZWFybmVyX25hbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlYXJuZXJfbmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGVhcm5lcl9uYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xlYXJuZXJfbmFtZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZWFybmVyX25hbWVcbiAgICovXG4gIHNldCBsZWFybmVyX25hbWUobGVhcm5lcl9uYW1lKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNsZWFybmVyX25hbWUgPSBsZWFybmVyX25hbWUgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsb2NhdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xvY2F0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xvY2F0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvblxuICAgKi9cbiAgc2V0IGxvY2F0aW9uKGxvY2F0aW9uKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGxvY2F0aW9uLCBzY29ybTIwMDRfcmVnZXguQ01JU3RyaW5nMTAwMCkpIHtcbiAgICAgIHRoaXMuI2xvY2F0aW9uID0gbG9jYXRpb247XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI21heF90aW1lX2FsbG93ZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1heF90aW1lX2FsbG93ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI21heF90aW1lX2FsbG93ZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbWF4X3RpbWVfYWxsb3dlZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYXhfdGltZV9hbGxvd2VkXG4gICAqL1xuICBzZXQgbWF4X3RpbWVfYWxsb3dlZChtYXhfdGltZV9hbGxvd2VkKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNtYXhfdGltZV9hbGxvd2VkID0gbWF4X3RpbWVfYWxsb3dlZCA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI21vZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI21vZGU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbW9kZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtb2RlXG4gICAqL1xuICBzZXQgbW9kZShtb2RlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNtb2RlID0gbW9kZSA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3Byb2dyZXNzX21lYXN1cmVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHByb2dyZXNzX21lYXN1cmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3Byb2dyZXNzX21lYXN1cmU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcHJvZ3Jlc3NfbWVhc3VyZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvZ3Jlc3NfbWVhc3VyZVxuICAgKi9cbiAgc2V0IHByb2dyZXNzX21lYXN1cmUocHJvZ3Jlc3NfbWVhc3VyZSkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChwcm9ncmVzc19tZWFzdXJlLCBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCkgJiZcbiAgICAgICAgY2hlY2syMDA0VmFsaWRSYW5nZShwcm9ncmVzc19tZWFzdXJlLCBzY29ybTIwMDRfcmVnZXgucHJvZ3Jlc3NfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiNwcm9ncmVzc19tZWFzdXJlID0gcHJvZ3Jlc3NfbWVhc3VyZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc2NhbGVkX3Bhc3Npbmdfc2NvcmVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHNjYWxlZF9wYXNzaW5nX3Njb3JlKCkge1xuICAgIHJldHVybiB0aGlzLiNzY2FsZWRfcGFzc2luZ19zY29yZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzY2FsZWRfcGFzc2luZ19zY29yZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY2FsZWRfcGFzc2luZ19zY29yZVxuICAgKi9cbiAgc2V0IHNjYWxlZF9wYXNzaW5nX3Njb3JlKHNjYWxlZF9wYXNzaW5nX3Njb3JlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNzY2FsZWRfcGFzc2luZ19zY29yZSA9IHNjYWxlZF9wYXNzaW5nX3Njb3JlIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc2Vzc2lvbl90aW1lLiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc2Vzc2lvbl90aW1lKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNzZXNzaW9uX3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc2Vzc2lvbl90aW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZXNzaW9uX3RpbWVcbiAgICovXG4gIHNldCBzZXNzaW9uX3RpbWUoc2Vzc2lvbl90aW1lKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHNlc3Npb25fdGltZSwgc2Nvcm0yMDA0X3JlZ2V4LkNNSVRpbWVzcGFuKSkge1xuICAgICAgdGhpcy4jc2Vzc2lvbl90aW1lID0gc2Vzc2lvbl90aW1lO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdWNjZXNzX3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3VjY2Vzc19zdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N1Y2Nlc3Nfc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N1Y2Nlc3Nfc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdWNjZXNzX3N0YXR1c1xuICAgKi9cbiAgc2V0IHN1Y2Nlc3Nfc3RhdHVzKHN1Y2Nlc3Nfc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHN1Y2Nlc3Nfc3RhdHVzLCBzY29ybTIwMDRfcmVnZXguQ01JU1N0YXR1cykpIHtcbiAgICAgIHRoaXMuI3N1Y2Nlc3Nfc3RhdHVzID0gc3VjY2Vzc19zdGF0dXM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N1c3BlbmRfZGF0YVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3VzcGVuZF9kYXRhKCkge1xuICAgIHJldHVybiB0aGlzLiNzdXNwZW5kX2RhdGE7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3VzcGVuZF9kYXRhXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdXNwZW5kX2RhdGFcbiAgICovXG4gIHNldCBzdXNwZW5kX2RhdGEoc3VzcGVuZF9kYXRhKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHN1c3BlbmRfZGF0YSwgc2Nvcm0yMDA0X3JlZ2V4LkNNSVN0cmluZzY0MDAwLFxuICAgICAgICB0cnVlKSkge1xuICAgICAgdGhpcy4jc3VzcGVuZF9kYXRhID0gc3VzcGVuZF9kYXRhO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0aW1lX2xpbWl0X2FjdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGltZV9saW1pdF9hY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWVfbGltaXRfYWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpbWVfbGltaXRfYWN0aW9uLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVfbGltaXRfYWN0aW9uXG4gICAqL1xuICBzZXQgdGltZV9saW1pdF9hY3Rpb24odGltZV9saW1pdF9hY3Rpb24pIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI3RpbWVfbGltaXRfYWN0aW9uID0gdGltZV9saW1pdF9hY3Rpb24gOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0b3RhbF90aW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0b3RhbF90aW1lKCkge1xuICAgIHJldHVybiB0aGlzLiN0b3RhbF90aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RvdGFsX3RpbWUuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG90YWxfdGltZVxuICAgKi9cbiAgc2V0IHRvdGFsX3RpbWUodG90YWxfdGltZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jdG90YWxfdGltZSA9IHRvdGFsX3RpbWUgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHRoZSBjdXJyZW50IHNlc3Npb24gdGltZSB0byB0aGUgZXhpc3RpbmcgdG90YWwgdGltZS5cbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSBJU084NjAxIER1cmF0aW9uXG4gICAqL1xuICBnZXRDdXJyZW50VG90YWxUaW1lKCkge1xuICAgIGxldCBzZXNzaW9uVGltZSA9IHRoaXMuI3Nlc3Npb25fdGltZTtcbiAgICBjb25zdCBzdGFydFRpbWUgPSB0aGlzLnN0YXJ0X3RpbWU7XG5cbiAgICBpZiAodHlwZW9mIHN0YXJ0VGltZSAhPT0gJ3VuZGVmaW5lZCcgJiYgc3RhcnRUaW1lICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBzZWNvbmRzID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBzdGFydFRpbWU7XG4gICAgICBzZXNzaW9uVGltZSA9IFV0aWwuZ2V0U2Vjb25kc0FzSVNPRHVyYXRpb24oc2Vjb25kcyAvIDEwMDApO1xuICAgIH1cblxuICAgIHJldHVybiBVdGlsLmFkZFR3b0R1cmF0aW9ucyhcbiAgICAgICAgdGhpcy4jdG90YWxfdGltZSxcbiAgICAgICAgc2Vzc2lvblRpbWUsXG4gICAgICAgIHNjb3JtMjAwNF9yZWdleC5DTUlUaW1lc3BhbixcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgY29tbWVudHNfZnJvbV9sZWFybmVyOiBDTUlDb21tZW50c0Zyb21MZWFybmVyLFxuICAgKiAgICAgIGNvbW1lbnRzX2Zyb21fbG1zOiBDTUlDb21tZW50c0Zyb21MTVMsXG4gICAqICAgICAgY29tcGxldGlvbl9zdGF0dXM6IHN0cmluZyxcbiAgICogICAgICBjb21wbGV0aW9uX3RocmVzaG9sZDogc3RyaW5nLFxuICAgKiAgICAgIGNyZWRpdDogc3RyaW5nLFxuICAgKiAgICAgIGVudHJ5OiBzdHJpbmcsXG4gICAqICAgICAgZXhpdDogc3RyaW5nLFxuICAgKiAgICAgIGludGVyYWN0aW9uczogQ01JSW50ZXJhY3Rpb25zLFxuICAgKiAgICAgIGxhdW5jaF9kYXRhOiBzdHJpbmcsXG4gICAqICAgICAgbGVhcm5lcl9pZDogc3RyaW5nLFxuICAgKiAgICAgIGxlYXJuZXJfbmFtZTogc3RyaW5nLFxuICAgKiAgICAgIGxlYXJuZXJfcHJlZmVyZW5jZTogQ01JTGVhcm5lclByZWZlcmVuY2UsXG4gICAqICAgICAgbG9jYXRpb246IHN0cmluZyxcbiAgICogICAgICBtYXhfdGltZV9hbGxvd2VkOiBzdHJpbmcsXG4gICAqICAgICAgbW9kZTogc3RyaW5nLFxuICAgKiAgICAgIG9iamVjdGl2ZXM6IENNSU9iamVjdGl2ZXMsXG4gICAqICAgICAgcHJvZ3Jlc3NfbWVhc3VyZTogc3RyaW5nLFxuICAgKiAgICAgIHNjYWxlZF9wYXNzaW5nX3Njb3JlOiBzdHJpbmcsXG4gICAqICAgICAgc2NvcmU6IFNjb3JtMjAwNENNSVNjb3JlLFxuICAgKiAgICAgIHNlc3Npb25fdGltZTogc3RyaW5nLFxuICAgKiAgICAgIHN1Y2Nlc3Nfc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgc3VzcGVuZF9kYXRhOiBzdHJpbmcsXG4gICAqICAgICAgdGltZV9saW1pdF9hY3Rpb246IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnY29tbWVudHNfZnJvbV9sZWFybmVyJzogdGhpcy5jb21tZW50c19mcm9tX2xlYXJuZXIsXG4gICAgICAnY29tbWVudHNfZnJvbV9sbXMnOiB0aGlzLmNvbW1lbnRzX2Zyb21fbG1zLFxuICAgICAgJ2NvbXBsZXRpb25fc3RhdHVzJzogdGhpcy5jb21wbGV0aW9uX3N0YXR1cyxcbiAgICAgICdjb21wbGV0aW9uX3RocmVzaG9sZCc6IHRoaXMuY29tcGxldGlvbl90aHJlc2hvbGQsXG4gICAgICAnY3JlZGl0JzogdGhpcy5jcmVkaXQsXG4gICAgICAnZW50cnknOiB0aGlzLmVudHJ5LFxuICAgICAgJ2V4aXQnOiB0aGlzLmV4aXQsXG4gICAgICAnaW50ZXJhY3Rpb25zJzogdGhpcy5pbnRlcmFjdGlvbnMsXG4gICAgICAnbGF1bmNoX2RhdGEnOiB0aGlzLmxhdW5jaF9kYXRhLFxuICAgICAgJ2xlYXJuZXJfaWQnOiB0aGlzLmxlYXJuZXJfaWQsXG4gICAgICAnbGVhcm5lcl9uYW1lJzogdGhpcy5sZWFybmVyX25hbWUsXG4gICAgICAnbGVhcm5lcl9wcmVmZXJlbmNlJzogdGhpcy5sZWFybmVyX3ByZWZlcmVuY2UsXG4gICAgICAnbG9jYXRpb24nOiB0aGlzLmxvY2F0aW9uLFxuICAgICAgJ21heF90aW1lX2FsbG93ZWQnOiB0aGlzLm1heF90aW1lX2FsbG93ZWQsXG4gICAgICAnbW9kZSc6IHRoaXMubW9kZSxcbiAgICAgICdvYmplY3RpdmVzJzogdGhpcy5vYmplY3RpdmVzLFxuICAgICAgJ3Byb2dyZXNzX21lYXN1cmUnOiB0aGlzLnByb2dyZXNzX21lYXN1cmUsXG4gICAgICAnc2NhbGVkX3Bhc3Npbmdfc2NvcmUnOiB0aGlzLnNjYWxlZF9wYXNzaW5nX3Njb3JlLFxuICAgICAgJ3Njb3JlJzogdGhpcy5zY29yZSxcbiAgICAgICdzZXNzaW9uX3RpbWUnOiB0aGlzLnNlc3Npb25fdGltZSxcbiAgICAgICdzdWNjZXNzX3N0YXR1cyc6IHRoaXMuc3VjY2Vzc19zdGF0dXMsXG4gICAgICAnc3VzcGVuZF9kYXRhJzogdGhpcy5zdXNwZW5kX2RhdGEsXG4gICAgICAndGltZV9saW1pdF9hY3Rpb24nOiB0aGlzLnRpbWVfbGltaXRfYWN0aW9uLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIFNDT1JNIDIwMDQncyBjbWkubGVhcm5lcl9wcmVmZXJlbmNlIG9iamVjdFxuICovXG5jbGFzcyBDTUlMZWFybmVyUHJlZmVyZW5jZSBleHRlbmRzIEJhc2VDTUkge1xuICAjX2NoaWxkcmVuID0gc2Nvcm0yMDA0X2NvbnN0YW50cy5zdHVkZW50X3ByZWZlcmVuY2VfY2hpbGRyZW47XG4gICNhdWRpb19sZXZlbCA9ICcxJztcbiAgI2xhbmd1YWdlID0gJyc7XG4gICNkZWxpdmVyeV9zcGVlZCA9ICcxJztcbiAgI2F1ZGlvX2NhcHRpb25pbmcgPSAnMCc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkubGVhcm5lcl9wcmVmZXJlbmNlXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI19jaGlsZHJlblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNhdWRpb19sZXZlbFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgYXVkaW9fbGV2ZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2F1ZGlvX2xldmVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2F1ZGlvX2xldmVsXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdWRpb19sZXZlbFxuICAgKi9cbiAgc2V0IGF1ZGlvX2xldmVsKGF1ZGlvX2xldmVsKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGF1ZGlvX2xldmVsLCBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCkgJiZcbiAgICAgICAgY2hlY2syMDA0VmFsaWRSYW5nZShhdWRpb19sZXZlbCwgc2Nvcm0yMDA0X3JlZ2V4LmF1ZGlvX3JhbmdlKSkge1xuICAgICAgdGhpcy4jYXVkaW9fbGV2ZWwgPSBhdWRpb19sZXZlbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGFuZ3VhZ2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxhbmd1YWdlKCkge1xuICAgIHJldHVybiB0aGlzLiNsYW5ndWFnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsYW5ndWFnZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGFuZ3VhZ2VcbiAgICovXG4gIHNldCBsYW5ndWFnZShsYW5ndWFnZSkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChsYW5ndWFnZSwgc2Nvcm0yMDA0X3JlZ2V4LkNNSUxhbmcpKSB7XG4gICAgICB0aGlzLiNsYW5ndWFnZSA9IGxhbmd1YWdlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNkZWxpdmVyeV9zcGVlZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZGVsaXZlcnlfc3BlZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2RlbGl2ZXJ5X3NwZWVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2RlbGl2ZXJ5X3NwZWVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkZWxpdmVyeV9zcGVlZFxuICAgKi9cbiAgc2V0IGRlbGl2ZXJ5X3NwZWVkKGRlbGl2ZXJ5X3NwZWVkKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGRlbGl2ZXJ5X3NwZWVkLCBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCkgJiZcbiAgICAgICAgY2hlY2syMDA0VmFsaWRSYW5nZShkZWxpdmVyeV9zcGVlZCwgc2Nvcm0yMDA0X3JlZ2V4LnNwZWVkX3JhbmdlKSkge1xuICAgICAgdGhpcy4jZGVsaXZlcnlfc3BlZWQgPSBkZWxpdmVyeV9zcGVlZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjYXVkaW9fY2FwdGlvbmluZ1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgYXVkaW9fY2FwdGlvbmluZygpIHtcbiAgICByZXR1cm4gdGhpcy4jYXVkaW9fY2FwdGlvbmluZztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNhdWRpb19jYXB0aW9uaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdWRpb19jYXB0aW9uaW5nXG4gICAqL1xuICBzZXQgYXVkaW9fY2FwdGlvbmluZyhhdWRpb19jYXB0aW9uaW5nKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGF1ZGlvX2NhcHRpb25pbmcsIHNjb3JtMjAwNF9yZWdleC5DTUlTSW50ZWdlcikgJiZcbiAgICAgICAgY2hlY2syMDA0VmFsaWRSYW5nZShhdWRpb19jYXB0aW9uaW5nLCBzY29ybTIwMDRfcmVnZXgudGV4dF9yYW5nZSkpIHtcbiAgICAgIHRoaXMuI2F1ZGlvX2NhcHRpb25pbmcgPSBhdWRpb19jYXB0aW9uaW5nO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5sZWFybmVyX3ByZWZlcmVuY2VcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBhdWRpb19sZXZlbDogc3RyaW5nLFxuICAgKiAgICAgIGxhbmd1YWdlOiBzdHJpbmcsXG4gICAqICAgICAgZGVsaXZlcnlfc3BlZWQ6IHN0cmluZyxcbiAgICogICAgICBhdWRpb19jYXB0aW9uaW5nOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2F1ZGlvX2xldmVsJzogdGhpcy5hdWRpb19sZXZlbCxcbiAgICAgICdsYW5ndWFnZSc6IHRoaXMubGFuZ3VhZ2UsXG4gICAgICAnZGVsaXZlcnlfc3BlZWQnOiB0aGlzLmRlbGl2ZXJ5X3NwZWVkLFxuICAgICAgJ2F1ZGlvX2NhcHRpb25pbmcnOiB0aGlzLmF1ZGlvX2NhcHRpb25pbmcsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGNtaS5pbnRlcmFjdGlvbnMgb2JqZWN0XG4gKi9cbmNsYXNzIENNSUludGVyYWN0aW9ucyBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkub2JqZWN0aXZlcyBBcnJheVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe1xuICAgICAgY2hpbGRyZW46IHNjb3JtMjAwNF9jb25zdGFudHMuaW50ZXJhY3Rpb25zX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGNtaS5vYmplY3RpdmVzIG9iamVjdFxuICovXG5jbGFzcyBDTUlPYmplY3RpdmVzIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5vYmplY3RpdmVzIEFycmF5XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogc2Nvcm0yMDA0X2NvbnN0YW50cy5vYmplY3RpdmVzX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGNtaS5jb21tZW50c19mcm9tX2xtcyBvYmplY3RcbiAqL1xuY2xhc3MgQ01JQ29tbWVudHNGcm9tTE1TIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5jb21tZW50c19mcm9tX2xtcyBBcnJheVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe1xuICAgICAgY2hpbGRyZW46IHNjb3JtMjAwNF9jb25zdGFudHMuY29tbWVudHNfY2hpbGRyZW4sXG4gICAgICBlcnJvckNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmNvbW1lbnRzX2Zyb21fbGVhcm5lciBvYmplY3RcbiAqL1xuY2xhc3MgQ01JQ29tbWVudHNGcm9tTGVhcm5lciBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuY29tbWVudHNfZnJvbV9sZWFybmVyIEFycmF5XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogc2Nvcm0yMDA0X2NvbnN0YW50cy5jb21tZW50c19jaGlsZHJlbixcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5ULFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIFNDT1JNIDIwMDQncyBjbWkuaW50ZXJhY3Rpb24ubiBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAjaWQgPSAnJztcbiAgI3R5cGUgPSAnJztcbiAgI3RpbWVzdGFtcCA9ICcnO1xuICAjd2VpZ2h0aW5nID0gJyc7XG4gICNsZWFybmVyX3Jlc3BvbnNlID0gJyc7XG4gICNyZXN1bHQgPSAnJztcbiAgI2xhdGVuY3kgPSAnJztcbiAgI2Rlc2NyaXB0aW9uID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb24ublxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMub2JqZWN0aXZlcyA9IG5ldyBDTUlBcnJheSh7XG4gICAgICBlcnJvckNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCxcbiAgICAgIGNoaWxkcmVuOiBzY29ybTIwMDRfY29uc3RhbnRzLm9iamVjdGl2ZXNfY2hpbGRyZW4sXG4gICAgfSk7XG4gICAgdGhpcy5jb3JyZWN0X3Jlc3BvbnNlcyA9IG5ldyBDTUlBcnJheSh7XG4gICAgICBlcnJvckNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCxcbiAgICAgIGNoaWxkcmVuOiBzY29ybTIwMDRfY29uc3RhbnRzLmNvcnJlY3RfcmVzcG9uc2VzX2NoaWxkcmVuLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLm9iamVjdGl2ZXM/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmNvcnJlY3RfcmVzcG9uc2VzPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLiNpZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNpZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICovXG4gIHNldCBpZChpZCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChpZCwgc2Nvcm0yMDA0X3JlZ2V4LkNNSUxvbmdJZGVudGlmaWVyKSkge1xuICAgICAgdGhpcy4jaWQgPSBpZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdHlwZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jdHlwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0eXBlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gICAqL1xuICBzZXQgdHlwZSh0eXBlKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQgJiYgdGhpcy4jaWQgPT09ICcnKSB7XG4gICAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFxuICAgICAgICAgIHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5ERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdCh0eXBlLCBzY29ybTIwMDRfcmVnZXguQ01JVHlwZSkpIHtcbiAgICAgICAgdGhpcy4jdHlwZSA9IHR5cGU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWVzdGFtcFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGltZXN0YW1wKCkge1xuICAgIHJldHVybiB0aGlzLiN0aW1lc3RhbXA7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGltZXN0YW1wXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lc3RhbXBcbiAgICovXG4gIHNldCB0aW1lc3RhbXAodGltZXN0YW1wKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQgJiYgdGhpcy4jaWQgPT09ICcnKSB7XG4gICAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFxuICAgICAgICAgIHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5ERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdCh0aW1lc3RhbXAsIHNjb3JtMjAwNF9yZWdleC5DTUlUaW1lKSkge1xuICAgICAgICB0aGlzLiN0aW1lc3RhbXAgPSB0aW1lc3RhbXA7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3dlaWdodGluZ1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgd2VpZ2h0aW5nKCkge1xuICAgIHJldHVybiB0aGlzLiN3ZWlnaHRpbmc7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjd2VpZ2h0aW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3ZWlnaHRpbmdcbiAgICovXG4gIHNldCB3ZWlnaHRpbmcod2VpZ2h0aW5nKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQgJiYgdGhpcy4jaWQgPT09ICcnKSB7XG4gICAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFxuICAgICAgICAgIHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5ERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdCh3ZWlnaHRpbmcsIHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsKSkge1xuICAgICAgICB0aGlzLiN3ZWlnaHRpbmcgPSB3ZWlnaHRpbmc7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xlYXJuZXJfcmVzcG9uc2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlYXJuZXJfcmVzcG9uc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xlYXJuZXJfcmVzcG9uc2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGVhcm5lcl9yZXNwb25zZS4gRG9lcyB0eXBlIHZhbGlkYXRpb24gdG8gbWFrZSBzdXJlIHJlc3BvbnNlXG4gICAqIG1hdGNoZXMgU0NPUk0gMjAwNCdzIHNwZWNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlYXJuZXJfcmVzcG9uc2VcbiAgICovXG4gIHNldCBsZWFybmVyX3Jlc3BvbnNlKGxlYXJuZXJfcmVzcG9uc2UpIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiAodGhpcy4jdHlwZSA9PT0gJycgfHwgdGhpcy4jaWQgPT09ICcnKSkge1xuICAgICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihcbiAgICAgICAgICBzY29ybTIwMDRfZXJyb3JfY29kZXMuREVQRU5ERU5DWV9OT1RfRVNUQUJMSVNIRUQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbm9kZXMgPSBbXTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlX3R5cGUgPSBsZWFybmVyX3Jlc3BvbnNlc1t0aGlzLnR5cGVdO1xuICAgICAgaWYgKHJlc3BvbnNlX3R5cGUpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlX3R5cGU/LmRlbGltaXRlcikge1xuICAgICAgICAgIG5vZGVzID0gbGVhcm5lcl9yZXNwb25zZS5zcGxpdChyZXNwb25zZV90eXBlLmRlbGltaXRlcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm9kZXNbMF0gPSBsZWFybmVyX3Jlc3BvbnNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKChub2Rlcy5sZW5ndGggPiAwKSAmJiAobm9kZXMubGVuZ3RoIDw9IHJlc3BvbnNlX3R5cGUubWF4KSkge1xuICAgICAgICAgIGNvbnN0IGZvcm1hdFJlZ2V4ID0gbmV3IFJlZ0V4cChyZXNwb25zZV90eXBlLmZvcm1hdCk7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlX3R5cGU/LmRlbGltaXRlcjIpIHtcbiAgICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gbm9kZXNbaV0uc3BsaXQocmVzcG9uc2VfdHlwZS5kZWxpbWl0ZXIyKTtcbiAgICAgICAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXZhbHVlc1swXS5tYXRjaChmb3JtYXRSZWdleCkpIHtcbiAgICAgICAgICAgICAgICAgIHRocm93VHlwZU1pc21hdGNoRXJyb3IoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgaWYgKCF2YWx1ZXNbMV0ubWF0Y2gobmV3IFJlZ0V4cChyZXNwb25zZV90eXBlLmZvcm1hdDIpKSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvd1R5cGVNaXNtYXRjaEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93VHlwZU1pc21hdGNoRXJyb3IoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKCFub2Rlc1tpXS5tYXRjaChmb3JtYXRSZWdleCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvd1R5cGVNaXNtYXRjaEVycm9yKCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGVzW2ldICE9PSAnJyAmJiByZXNwb25zZV90eXBlLnVuaXF1ZSkge1xuICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBpOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vZGVzW2ldID09PSBub2Rlc1tqXSkge1xuICAgICAgICAgICAgICAgICAgICAgIHRocm93VHlwZU1pc21hdGNoRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5HRU5FUkFMX1NFVF9GQUlMVVJFKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuI2xlYXJuZXJfcmVzcG9uc2UgPSBsZWFybmVyX3Jlc3BvbnNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3Jlc3VsdFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgcmVzdWx0KCkge1xuICAgIHJldHVybiB0aGlzLiNyZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcmVzdWx0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZXN1bHRcbiAgICovXG4gIHNldCByZXN1bHQocmVzdWx0KSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHJlc3VsdCwgc2Nvcm0yMDA0X3JlZ2V4LkNNSVJlc3VsdCkpIHtcbiAgICAgIHRoaXMuI3Jlc3VsdCA9IHJlc3VsdDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGF0ZW5jeVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGF0ZW5jeSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGF0ZW5jeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsYXRlbmN5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsYXRlbmN5XG4gICAqL1xuICBzZXQgbGF0ZW5jeShsYXRlbmN5KSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQgJiYgdGhpcy4jaWQgPT09ICcnKSB7XG4gICAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFxuICAgICAgICAgIHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5ERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChsYXRlbmN5LCBzY29ybTIwMDRfcmVnZXguQ01JVGltZXNwYW4pKSB7XG4gICAgICAgIHRoaXMuI2xhdGVuY3kgPSBsYXRlbmN5O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNkZXNjcmlwdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZGVzY3JpcHRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI2Rlc2NyaXB0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2Rlc2NyaXB0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkZXNjcmlwdGlvblxuICAgKi9cbiAgc2V0IGRlc2NyaXB0aW9uKGRlc2NyaXB0aW9uKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQgJiYgdGhpcy4jaWQgPT09ICcnKSB7XG4gICAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFxuICAgICAgICAgIHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5ERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChkZXNjcmlwdGlvbiwgc2Nvcm0yMDA0X3JlZ2V4LkNNSUxhbmdTdHJpbmcyNTAsXG4gICAgICAgICAgdHJ1ZSkpIHtcbiAgICAgICAgdGhpcy4jZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuaW50ZXJhY3Rpb25zLm5cbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBpZDogc3RyaW5nLFxuICAgKiAgICAgIHR5cGU6IHN0cmluZyxcbiAgICogICAgICBvYmplY3RpdmVzOiBDTUlBcnJheSxcbiAgICogICAgICB0aW1lc3RhbXA6IHN0cmluZyxcbiAgICogICAgICBjb3JyZWN0X3Jlc3BvbnNlczogQ01JQXJyYXksXG4gICAqICAgICAgd2VpZ2h0aW5nOiBzdHJpbmcsXG4gICAqICAgICAgbGVhcm5lcl9yZXNwb25zZTogc3RyaW5nLFxuICAgKiAgICAgIHJlc3VsdDogc3RyaW5nLFxuICAgKiAgICAgIGxhdGVuY3k6IHN0cmluZyxcbiAgICogICAgICBkZXNjcmlwdGlvbjogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdpZCc6IHRoaXMuaWQsXG4gICAgICAndHlwZSc6IHRoaXMudHlwZSxcbiAgICAgICdvYmplY3RpdmVzJzogdGhpcy5vYmplY3RpdmVzLFxuICAgICAgJ3RpbWVzdGFtcCc6IHRoaXMudGltZXN0YW1wLFxuICAgICAgJ3dlaWdodGluZyc6IHRoaXMud2VpZ2h0aW5nLFxuICAgICAgJ2xlYXJuZXJfcmVzcG9uc2UnOiB0aGlzLmxlYXJuZXJfcmVzcG9uc2UsXG4gICAgICAncmVzdWx0JzogdGhpcy5yZXN1bHQsXG4gICAgICAnbGF0ZW5jeSc6IHRoaXMubGF0ZW5jeSxcbiAgICAgICdkZXNjcmlwdGlvbic6IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICAnY29ycmVjdF9yZXNwb25zZXMnOiB0aGlzLmNvcnJlY3RfcmVzcG9uc2VzLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIFNDT1JNIDIwMDQncyBjbWkub2JqZWN0aXZlcy5uIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JT2JqZWN0aXZlc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAjaWQgPSAnJztcbiAgI3N1Y2Nlc3Nfc3RhdHVzID0gJ3Vua25vd24nO1xuICAjY29tcGxldGlvbl9zdGF0dXMgPSAndW5rbm93bic7XG4gICNwcm9ncmVzc19tZWFzdXJlID0gJyc7XG4gICNkZXNjcmlwdGlvbiA9ICcnO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLm9iamVjdGl2ZXMublxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc2NvcmUgPSBuZXcgU2Nvcm0yMDA0Q01JU2NvcmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zY29yZT8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2lkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjaWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBzZXQgaWQoaWQpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoaWQsIHNjb3JtMjAwNF9yZWdleC5DTUlMb25nSWRlbnRpZmllcikpIHtcbiAgICAgIHRoaXMuI2lkID0gaWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N1Y2Nlc3Nfc3RhdHVzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdWNjZXNzX3N0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jc3VjY2Vzc19zdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3VjY2Vzc19zdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN1Y2Nlc3Nfc3RhdHVzXG4gICAqL1xuICBzZXQgc3VjY2Vzc19zdGF0dXMoc3VjY2Vzc19zdGF0dXMpIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNpZCA9PT0gJycpIHtcbiAgICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoXG4gICAgICAgICAgc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkRFUEVOREVOQ1lfTk9UX0VTVEFCTElTSEVEKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHN1Y2Nlc3Nfc3RhdHVzLCBzY29ybTIwMDRfcmVnZXguQ01JU1N0YXR1cykpIHtcbiAgICAgICAgdGhpcy4jc3VjY2Vzc19zdGF0dXMgPSBzdWNjZXNzX3N0YXR1cztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29tcGxldGlvbl9zdGF0dXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbXBsZXRpb25fc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNjb21wbGV0aW9uX3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb21wbGV0aW9uX3N0YXR1c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY29tcGxldGlvbl9zdGF0dXNcbiAgICovXG4gIHNldCBjb21wbGV0aW9uX3N0YXR1cyhjb21wbGV0aW9uX3N0YXR1cykge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkICYmIHRoaXMuI2lkID09PSAnJykge1xuICAgICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihcbiAgICAgICAgICBzY29ybTIwMDRfZXJyb3JfY29kZXMuREVQRU5ERU5DWV9OT1RfRVNUQUJMSVNIRUQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoY29tcGxldGlvbl9zdGF0dXMsIHNjb3JtMjAwNF9yZWdleC5DTUlDU3RhdHVzKSkge1xuICAgICAgICB0aGlzLiNjb21wbGV0aW9uX3N0YXR1cyA9IGNvbXBsZXRpb25fc3RhdHVzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNwcm9ncmVzc19tZWFzdXJlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBwcm9ncmVzc19tZWFzdXJlKCkge1xuICAgIHJldHVybiB0aGlzLiNwcm9ncmVzc19tZWFzdXJlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3Byb2dyZXNzX21lYXN1cmVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb2dyZXNzX21lYXN1cmVcbiAgICovXG4gIHNldCBwcm9ncmVzc19tZWFzdXJlKHByb2dyZXNzX21lYXN1cmUpIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNpZCA9PT0gJycpIHtcbiAgICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoXG4gICAgICAgICAgc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkRFUEVOREVOQ1lfTk9UX0VTVEFCTElTSEVEKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHByb2dyZXNzX21lYXN1cmUsIHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsKSAmJlxuICAgICAgICAgIGNoZWNrMjAwNFZhbGlkUmFuZ2UocHJvZ3Jlc3NfbWVhc3VyZSxcbiAgICAgICAgICAgICAgc2Nvcm0yMDA0X3JlZ2V4LnByb2dyZXNzX3JhbmdlKSkge1xuICAgICAgICB0aGlzLiNwcm9ncmVzc19tZWFzdXJlID0gcHJvZ3Jlc3NfbWVhc3VyZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZGVzY3JpcHRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGRlc2NyaXB0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNkZXNjcmlwdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNkZXNjcmlwdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGVzY3JpcHRpb25cbiAgICovXG4gIHNldCBkZXNjcmlwdGlvbihkZXNjcmlwdGlvbikge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkICYmIHRoaXMuI2lkID09PSAnJykge1xuICAgICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihcbiAgICAgICAgICBzY29ybTIwMDRfZXJyb3JfY29kZXMuREVQRU5ERU5DWV9OT1RfRVNUQUJMSVNIRUQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoZGVzY3JpcHRpb24sIHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nU3RyaW5nMjUwLFxuICAgICAgICAgIHRydWUpKSB7XG4gICAgICAgIHRoaXMuI2Rlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLm9iamVjdGl2ZXMublxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGlkOiBzdHJpbmcsXG4gICAqICAgICAgc3VjY2Vzc19zdGF0dXM6IHN0cmluZyxcbiAgICogICAgICBjb21wbGV0aW9uX3N0YXR1czogc3RyaW5nLFxuICAgKiAgICAgIHByb2dyZXNzX21lYXN1cmU6IHN0cmluZyxcbiAgICogICAgICBkZXNjcmlwdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIHNjb3JlOiBTY29ybTIwMDRDTUlTY29yZVxuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnaWQnOiB0aGlzLmlkLFxuICAgICAgJ3N1Y2Nlc3Nfc3RhdHVzJzogdGhpcy5zdWNjZXNzX3N0YXR1cyxcbiAgICAgICdjb21wbGV0aW9uX3N0YXR1cyc6IHRoaXMuY29tcGxldGlvbl9zdGF0dXMsXG4gICAgICAncHJvZ3Jlc3NfbWVhc3VyZSc6IHRoaXMucHJvZ3Jlc3NfbWVhc3VyZSxcbiAgICAgICdkZXNjcmlwdGlvbic6IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICAnc2NvcmUnOiB0aGlzLnNjb3JlLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIFNDT1JNIDIwMDQncyBjbWkgKi5zY29yZSBvYmplY3RcbiAqL1xuY2xhc3MgU2Nvcm0yMDA0Q01JU2NvcmUgZXh0ZW5kcyBDTUlTY29yZSB7XG4gICNzY2FsZWQgPSAnJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaSAqLnNjb3JlXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihcbiAgICAgICAge1xuICAgICAgICAgIHNjb3JlX2NoaWxkcmVuOiBzY29ybTIwMDRfY29uc3RhbnRzLnNjb3JlX2NoaWxkcmVuLFxuICAgICAgICAgIG1heDogJycsXG4gICAgICAgICAgaW52YWxpZEVycm9yQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5ULFxuICAgICAgICAgIGludmFsaWRUeXBlQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gsXG4gICAgICAgICAgaW52YWxpZFJhbmdlQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRSxcbiAgICAgICAgICBkZWNpbWFsUmVnZXg6IHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsLFxuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzY2FsZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHNjYWxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jc2NhbGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3NjYWxlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NhbGVkXG4gICAqL1xuICBzZXQgc2NhbGVkKHNjYWxlZCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChzY2FsZWQsIHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsKSAmJlxuICAgICAgICBjaGVjazIwMDRWYWxpZFJhbmdlKHNjYWxlZCwgc2Nvcm0yMDA0X3JlZ2V4LnNjYWxlZF9yYW5nZSkpIHtcbiAgICAgIHRoaXMuI3NjYWxlZCA9IHNjYWxlZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkgKi5zY29yZVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHNjYWxlZDogc3RyaW5nLFxuICAgKiAgICAgIHJhdzogc3RyaW5nLFxuICAgKiAgICAgIG1pbjogc3RyaW5nLFxuICAgKiAgICAgIG1heDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdzY2FsZWQnOiB0aGlzLnNjYWxlZCxcbiAgICAgICdyYXcnOiBzdXBlci5yYXcsXG4gICAgICAnbWluJzogc3VwZXIubWluLFxuICAgICAgJ21heCc6IHN1cGVyLm1heCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmNvbW1lbnRzX2Zyb21fbGVhcm5lci5uIGFuZCBjbWkuY29tbWVudHNfZnJvbV9sbXMubiBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUNvbW1lbnRzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNjb21tZW50ID0gJyc7XG4gICNsb2NhdGlvbiA9ICcnO1xuICAjdGltZXN0YW1wID0gJyc7XG4gICNyZWFkT25seUFmdGVySW5pdDtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5jb21tZW50c19mcm9tX2xlYXJuZXIubiBhbmQgY21pLmNvbW1lbnRzX2Zyb21fbG1zLm5cbiAgICogQHBhcmFtIHtib29sZWFufSByZWFkT25seUFmdGVySW5pdFxuICAgKi9cbiAgY29uc3RydWN0b3IocmVhZE9ubHlBZnRlckluaXQgPSBmYWxzZSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy4jY29tbWVudCA9ICcnO1xuICAgIHRoaXMuI2xvY2F0aW9uID0gJyc7XG4gICAgdGhpcy4jdGltZXN0YW1wID0gJyc7XG4gICAgdGhpcy4jcmVhZE9ubHlBZnRlckluaXQgPSByZWFkT25seUFmdGVySW5pdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb21tZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb21tZW50KCkge1xuICAgIHJldHVybiB0aGlzLiNjb21tZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbW1lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbW1lbnRcbiAgICovXG4gIHNldCBjb21tZW50KGNvbW1lbnQpIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNyZWFkT25seUFmdGVySW5pdCkge1xuICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChjb21tZW50LCBzY29ybTIwMDRfcmVnZXguQ01JTGFuZ1N0cmluZzQwMDAsXG4gICAgICAgICAgdHJ1ZSkpIHtcbiAgICAgICAgdGhpcy4jY29tbWVudCA9IGNvbW1lbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xvY2F0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsb2NhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jbG9jYXRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbG9jYXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uXG4gICAqL1xuICBzZXQgbG9jYXRpb24obG9jYXRpb24pIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNyZWFkT25seUFmdGVySW5pdCkge1xuICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChsb2NhdGlvbiwgc2Nvcm0yMDA0X3JlZ2V4LkNNSVN0cmluZzI1MCkpIHtcbiAgICAgICAgdGhpcy4jbG9jYXRpb24gPSBsb2NhdGlvbjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZXN0YW1wXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lc3RhbXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWVzdGFtcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lc3RhbXBcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVzdGFtcFxuICAgKi9cbiAgc2V0IHRpbWVzdGFtcCh0aW1lc3RhbXApIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNyZWFkT25seUFmdGVySW5pdCkge1xuICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdCh0aW1lc3RhbXAsIHNjb3JtMjAwNF9yZWdleC5DTUlUaW1lKSkge1xuICAgICAgICB0aGlzLiN0aW1lc3RhbXAgPSB0aW1lc3RhbXA7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmNvbW1lbnRzX2Zyb21fbGVhcm5lci5uIG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGNvbW1lbnQ6IHN0cmluZyxcbiAgICogICAgICBsb2NhdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIHRpbWVzdGFtcDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdjb21tZW50JzogdGhpcy5jb21tZW50LFxuICAgICAgJ2xvY2F0aW9uJzogdGhpcy5sb2NhdGlvbixcbiAgICAgICd0aW1lc3RhbXAnOiB0aGlzLnRpbWVzdGFtcCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmludGVyYWN0aW9ucy5uLm9iamVjdGl2ZXMubiBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc09iamVjdGl2ZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI2lkID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4ub2JqZWN0aXZlcy5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2lkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjaWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBzZXQgaWQoaWQpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoaWQsIHNjb3JtMjAwNF9yZWdleC5DTUlMb25nSWRlbnRpZmllcikpIHtcbiAgICAgIHRoaXMuI2lkID0gaWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmludGVyYWN0aW9ucy5uLm9iamVjdGl2ZXMublxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGlkOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmludGVyYWN0aW9ucy5uLmNvcnJlY3RfcmVzcG9uc2VzLm4gb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlJbnRlcmFjdGlvbnNDb3JyZWN0UmVzcG9uc2VzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNwYXR0ZXJuID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4uY29ycmVjdF9yZXNwb25zZXMublxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNwYXR0ZXJuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBwYXR0ZXJuKCkge1xuICAgIHJldHVybiB0aGlzLiNwYXR0ZXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3BhdHRlcm5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdHRlcm5cbiAgICovXG4gIHNldCBwYXR0ZXJuKHBhdHRlcm4pIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQocGF0dGVybiwgc2Nvcm0yMDA0X3JlZ2V4LkNNSUZlZWRiYWNrKSkge1xuICAgICAgdGhpcy4jcGF0dGVybiA9IHBhdHRlcm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBjbWkuaW50ZXJhY3Rpb25zLm4uY29ycmVjdF9yZXNwb25zZXMubiBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBwYXR0ZXJuOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3BhdHRlcm4nOiB0aGlzLnBhdHRlcm4sXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGFkbCBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIEFETCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGFkbFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubmF2ID0gbmV3IEFETE5hdigpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLm5hdj8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgYWRsXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgbmF2OiB7XG4gICAqICAgICAgICByZXF1ZXN0OiBzdHJpbmdcbiAgICogICAgICB9XG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICduYXYnOiB0aGlzLm5hdixcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgYWRsLm5hdiBvYmplY3RcbiAqL1xuY2xhc3MgQURMTmF2IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNyZXF1ZXN0ID0gJ19ub25lXyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBhZGwubmF2XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5yZXF1ZXN0X3ZhbGlkID0gbmV3IEFETE5hdlJlcXVlc3RWYWxpZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnJlcXVlc3RfdmFsaWQ/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNyZXF1ZXN0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCByZXF1ZXN0KCkge1xuICAgIHJldHVybiB0aGlzLiNyZXF1ZXN0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3JlcXVlc3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3RcbiAgICovXG4gIHNldCByZXF1ZXN0KHJlcXVlc3QpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQocmVxdWVzdCwgc2Nvcm0yMDA0X3JlZ2V4Lk5BVkV2ZW50KSkge1xuICAgICAgdGhpcy4jcmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgYWRsLm5hdlxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHJlcXVlc3Q6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAncmVxdWVzdCc6IHRoaXMucmVxdWVzdCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgYWRsLm5hdi5yZXF1ZXN0X3ZhbGlkIG9iamVjdFxuICovXG5jbGFzcyBBRExOYXZSZXF1ZXN0VmFsaWQgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI2NvbnRpbnVlID0gJ3Vua25vd24nO1xuICAjcHJldmlvdXMgPSAndW5rbm93bic7XG4gIGNob2ljZSA9IGNsYXNzIHtcbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0YXJnZXQgaXMgdmFsaWRcbiAgICAgKiBAcGFyYW0geyp9IF90YXJnZXRcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgX2lzVGFyZ2V0VmFsaWQgPSAoX3RhcmdldCkgPT4gJ3Vua25vd24nO1xuICB9O1xuICBqdW1wID0gY2xhc3Mge1xuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRhcmdldCBpcyB2YWxpZFxuICAgICAqIEBwYXJhbSB7Kn0gX3RhcmdldFxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBfaXNUYXJnZXRWYWxpZCA9IChfdGFyZ2V0KSA9PiAndW5rbm93bic7XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBhZGwubmF2LnJlcXVlc3RfdmFsaWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29udGludWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbnRpbnVlKCkge1xuICAgIHJldHVybiB0aGlzLiNjb250aW51ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb250aW51ZS4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7Kn0gX1xuICAgKi9cbiAgc2V0IGNvbnRpbnVlKF8pIHtcbiAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNwcmV2aW91c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgcHJldmlvdXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3ByZXZpb3VzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3ByZXZpb3VzLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHsqfSBfXG4gICAqL1xuICBzZXQgcHJldmlvdXMoXykge1xuICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgYWRsLm5hdi5yZXF1ZXN0X3ZhbGlkXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgcHJldmlvdXM6IHN0cmluZyxcbiAgICogICAgICBjb250aW51ZTogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdwcmV2aW91cyc6IHRoaXMucHJldmlvdXMsXG4gICAgICAnY29udGludWUnOiB0aGlzLmNvbnRpbnVlLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iLCIvLyBAZmxvd1xuXG5jb25zdCBnbG9iYWwgPSB7XG4gIFNDT1JNX1RSVUU6ICd0cnVlJyxcbiAgU0NPUk1fRkFMU0U6ICdmYWxzZScsXG4gIFNUQVRFX05PVF9JTklUSUFMSVpFRDogMCxcbiAgU1RBVEVfSU5JVElBTElaRUQ6IDEsXG4gIFNUQVRFX1RFUk1JTkFURUQ6IDIsXG4gIExPR19MRVZFTF9ERUJVRzogMSxcbiAgTE9HX0xFVkVMX0lORk86IDIsXG4gIExPR19MRVZFTF9XQVJOSU5HOiAzLFxuICBMT0dfTEVWRUxfRVJST1I6IDQsXG4gIExPR19MRVZFTF9OT05FOiA1LFxufTtcblxuY29uc3Qgc2Nvcm0xMiA9IHtcbiAgLy8gQ2hpbGRyZW4gbGlzdHNcbiAgY21pX2NoaWxkcmVuOiAnY29yZSxzdXNwZW5kX2RhdGEsbGF1bmNoX2RhdGEsY29tbWVudHMsb2JqZWN0aXZlcyxzdHVkZW50X2RhdGEsc3R1ZGVudF9wcmVmZXJlbmNlLGludGVyYWN0aW9ucycsXG4gIGNvcmVfY2hpbGRyZW46ICdzdHVkZW50X2lkLHN0dWRlbnRfbmFtZSxsZXNzb25fbG9jYXRpb24sY3JlZGl0LGxlc3Nvbl9zdGF0dXMsZW50cnksc2NvcmUsdG90YWxfdGltZSxsZXNzb25fbW9kZSxleGl0LHNlc3Npb25fdGltZScsXG4gIHNjb3JlX2NoaWxkcmVuOiAncmF3LG1pbixtYXgnLFxuICBjb21tZW50c19jaGlsZHJlbjogJ2NvbnRlbnQsbG9jYXRpb24sdGltZScsXG4gIG9iamVjdGl2ZXNfY2hpbGRyZW46ICdpZCxzY29yZSxzdGF0dXMnLFxuICBjb3JyZWN0X3Jlc3BvbnNlc19jaGlsZHJlbjogJ3BhdHRlcm4nLFxuICBzdHVkZW50X2RhdGFfY2hpbGRyZW46ICdtYXN0ZXJ5X3Njb3JlLG1heF90aW1lX2FsbG93ZWQsdGltZV9saW1pdF9hY3Rpb24nLFxuICBzdHVkZW50X3ByZWZlcmVuY2VfY2hpbGRyZW46ICdhdWRpbyxsYW5ndWFnZSxzcGVlZCx0ZXh0JyxcbiAgaW50ZXJhY3Rpb25zX2NoaWxkcmVuOiAnaWQsb2JqZWN0aXZlcyx0aW1lLHR5cGUsY29ycmVjdF9yZXNwb25zZXMsd2VpZ2h0aW5nLHN0dWRlbnRfcmVzcG9uc2UscmVzdWx0LGxhdGVuY3knLFxuXG4gIGVycm9yX2Rlc2NyaXB0aW9uczoge1xuICAgICcxMDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIEV4Y2VwdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTm8gc3BlY2lmaWMgZXJyb3IgY29kZSBleGlzdHMgdG8gZGVzY3JpYmUgdGhlIGVycm9yLiBVc2UgTE1TR2V0RGlhZ25vc3RpYyBmb3IgbW9yZSBpbmZvcm1hdGlvbicsXG4gICAgfSxcbiAgICAnMjAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnSW52YWxpZCBhcmd1bWVudCBlcnJvcicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIHRoYXQgYW4gYXJndW1lbnQgcmVwcmVzZW50cyBhbiBpbnZhbGlkIGRhdGEgbW9kZWwgZWxlbWVudCBvciBpcyBvdGhlcndpc2UgaW5jb3JyZWN0LicsXG4gICAgfSxcbiAgICAnMjAyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRWxlbWVudCBjYW5ub3QgaGF2ZSBjaGlsZHJlbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIHRoYXQgTE1TR2V0VmFsdWUgd2FzIGNhbGxlZCB3aXRoIGEgZGF0YSBtb2RlbCBlbGVtZW50IG5hbWUgdGhhdCBlbmRzIGluIFwiX2NoaWxkcmVuXCIgZm9yIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgZG9lcyBub3Qgc3VwcG9ydCB0aGUgXCJfY2hpbGRyZW5cIiBzdWZmaXguJyxcbiAgICB9LFxuICAgICcyMDMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdFbGVtZW50IG5vdCBhbiBhcnJheSAtIGNhbm5vdCBoYXZlIGNvdW50JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgdGhhdCBMTVNHZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSBkYXRhIG1vZGVsIGVsZW1lbnQgbmFtZSB0aGF0IGVuZHMgaW4gXCJfY291bnRcIiBmb3IgYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBkb2VzIG5vdCBzdXBwb3J0IHRoZSBcIl9jb3VudFwiIHN1ZmZpeC4nLFxuICAgIH0sXG4gICAgJzMwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ05vdCBpbml0aWFsaXplZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIHRoYXQgYW4gQVBJIGNhbGwgd2FzIG1hZGUgYmVmb3JlIHRoZSBjYWxsIHRvIGxtc0luaXRpYWxpemUuJyxcbiAgICB9LFxuICAgICc0MDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdOb3QgaW1wbGVtZW50ZWQgZXJyb3InLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1RoZSBkYXRhIG1vZGVsIGVsZW1lbnQgaW5kaWNhdGVkIGluIGEgY2FsbCB0byBMTVNHZXRWYWx1ZSBvciBMTVNTZXRWYWx1ZSBpcyB2YWxpZCwgYnV0IHdhcyBub3QgaW1wbGVtZW50ZWQgYnkgdGhpcyBMTVMuIFNDT1JNIDEuMiBkZWZpbmVzIGEgc2V0IG9mIGRhdGEgbW9kZWwgZWxlbWVudHMgYXMgYmVpbmcgb3B0aW9uYWwgZm9yIGFuIExNUyB0byBpbXBsZW1lbnQuJyxcbiAgICB9LFxuICAgICc0MDInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdJbnZhbGlkIHNldCB2YWx1ZSwgZWxlbWVudCBpcyBhIGtleXdvcmQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyB0aGF0IExNU1NldFZhbHVlIHdhcyBjYWxsZWQgb24gYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCByZXByZXNlbnRzIGEga2V5d29yZCAoZWxlbWVudHMgdGhhdCBlbmQgaW4gXCJfY2hpbGRyZW5cIiBhbmQgXCJfY291bnRcIikuJyxcbiAgICB9LFxuICAgICc0MDMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdFbGVtZW50IGlzIHJlYWQgb25seScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTE1TU2V0VmFsdWUgd2FzIGNhbGxlZCB3aXRoIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgY2FuIG9ubHkgYmUgcmVhZC4nLFxuICAgIH0sXG4gICAgJzQwNCc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0VsZW1lbnQgaXMgd3JpdGUgb25seScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTE1TR2V0VmFsdWUgd2FzIGNhbGxlZCBvbiBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IGNhbiBvbmx5IGJlIHdyaXR0ZW4gdG8uJyxcbiAgICB9LFxuICAgICc0MDUnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdJbmNvcnJlY3QgRGF0YSBUeXBlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdMTVNTZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSB2YWx1ZSB0aGF0IGlzIG5vdCBjb25zaXN0ZW50IHdpdGggdGhlIGRhdGEgZm9ybWF0IG9mIHRoZSBzdXBwbGllZCBkYXRhIG1vZGVsIGVsZW1lbnQuJyxcbiAgICB9LFxuICB9LFxufTtcblxuY29uc3QgYWljYyA9IHtcbiAgLi4uc2Nvcm0xMiwgLi4ue1xuICAgIGNtaV9jaGlsZHJlbjogJ2NvcmUsc3VzcGVuZF9kYXRhLGxhdW5jaF9kYXRhLGNvbW1lbnRzLG9iamVjdGl2ZXMsc3R1ZGVudF9kYXRhLHN0dWRlbnRfcHJlZmVyZW5jZSxpbnRlcmFjdGlvbnMsZXZhbHVhdGlvbicsXG4gICAgc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuOiAnYXVkaW8sbGFuZ3VhZ2UsbGVzc29uX3R5cGUsc3BlZWQsdGV4dCx0ZXh0X2NvbG9yLHRleHRfbG9jYXRpb24sdGV4dF9zaXplLHZpZGVvLHdpbmRvd3MnLFxuICAgIHN0dWRlbnRfZGF0YV9jaGlsZHJlbjogJ2F0dGVtcHRfbnVtYmVyLHRyaWVzLG1hc3Rlcnlfc2NvcmUsbWF4X3RpbWVfYWxsb3dlZCx0aW1lX2xpbWl0X2FjdGlvbicsXG4gICAgc3R1ZGVudF9kZW1vZ3JhcGhpY3NfY2hpbGRyZW46ICdjaXR5LGNsYXNzLGNvbXBhbnksY291bnRyeSxleHBlcmllbmNlLGZhbWlsaWFyX25hbWUsaW5zdHJ1Y3Rvcl9uYW1lLHRpdGxlLG5hdGl2ZV9sYW5ndWFnZSxzdGF0ZSxzdHJlZXRfYWRkcmVzcyx0ZWxlcGhvbmUseWVhcnNfZXhwZXJpZW5jZScsXG4gICAgdHJpZXNfY2hpbGRyZW46ICd0aW1lLHN0YXR1cyxzY29yZScsXG4gICAgYXR0ZW1wdF9yZWNvcmRzX2NoaWxkcmVuOiAnc2NvcmUsbGVzc29uX3N0YXR1cycsXG4gICAgcGF0aHNfY2hpbGRyZW46ICdsb2NhdGlvbl9pZCxkYXRlLHRpbWUsc3RhdHVzLHdoeV9sZWZ0LHRpbWVfaW5fZWxlbWVudCcsXG4gIH0sXG59O1xuXG5jb25zdCBzY29ybTIwMDQgPSB7XG4gIC8vIENoaWxkcmVuIGxpc3RzXG4gIGNtaV9jaGlsZHJlbjogJ192ZXJzaW9uLGNvbW1lbnRzX2Zyb21fbGVhcm5lcixjb21tZW50c19mcm9tX2xtcyxjb21wbGV0aW9uX3N0YXR1cyxjcmVkaXQsZW50cnksZXhpdCxpbnRlcmFjdGlvbnMsbGF1bmNoX2RhdGEsbGVhcm5lcl9pZCxsZWFybmVyX25hbWUsbGVhcm5lcl9wcmVmZXJlbmNlLGxvY2F0aW9uLG1heF90aW1lX2FsbG93ZWQsbW9kZSxvYmplY3RpdmVzLHByb2dyZXNzX21lYXN1cmUsc2NhbGVkX3Bhc3Npbmdfc2NvcmUsc2NvcmUsc2Vzc2lvbl90aW1lLHN1Y2Nlc3Nfc3RhdHVzLHN1c3BlbmRfZGF0YSx0aW1lX2xpbWl0X2FjdGlvbix0b3RhbF90aW1lJyxcbiAgY29tbWVudHNfY2hpbGRyZW46ICdjb21tZW50LHRpbWVzdGFtcCxsb2NhdGlvbicsXG4gIHNjb3JlX2NoaWxkcmVuOiAnbWF4LHJhdyxzY2FsZWQsbWluJyxcbiAgb2JqZWN0aXZlc19jaGlsZHJlbjogJ3Byb2dyZXNzX21lYXN1cmUsY29tcGxldGlvbl9zdGF0dXMsc3VjY2Vzc19zdGF0dXMsZGVzY3JpcHRpb24sc2NvcmUsaWQnLFxuICBjb3JyZWN0X3Jlc3BvbnNlc19jaGlsZHJlbjogJ3BhdHRlcm4nLFxuICBzdHVkZW50X2RhdGFfY2hpbGRyZW46ICdtYXN0ZXJ5X3Njb3JlLG1heF90aW1lX2FsbG93ZWQsdGltZV9saW1pdF9hY3Rpb24nLFxuICBzdHVkZW50X3ByZWZlcmVuY2VfY2hpbGRyZW46ICdhdWRpb19sZXZlbCxhdWRpb19jYXB0aW9uaW5nLGRlbGl2ZXJ5X3NwZWVkLGxhbmd1YWdlJyxcbiAgaW50ZXJhY3Rpb25zX2NoaWxkcmVuOiAnaWQsdHlwZSxvYmplY3RpdmVzLHRpbWVzdGFtcCxjb3JyZWN0X3Jlc3BvbnNlcyx3ZWlnaHRpbmcsbGVhcm5lcl9yZXNwb25zZSxyZXN1bHQsbGF0ZW5jeSxkZXNjcmlwdGlvbicsXG5cbiAgZXJyb3JfZGVzY3JpcHRpb25zOiB7XG4gICAgJzAnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdObyBFcnJvcicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTm8gZXJyb3Igb2NjdXJyZWQsIHRoZSBwcmV2aW91cyBBUEkgY2FsbCB3YXMgc3VjY2Vzc2Z1bC4nLFxuICAgIH0sXG4gICAgJzEwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgRXhjZXB0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdObyBzcGVjaWZpYyBlcnJvciBjb2RlIGV4aXN0cyB0byBkZXNjcmliZSB0aGUgZXJyb3IuIFVzZSBHZXREaWFnbm9zdGljIGZvciBtb3JlIGluZm9ybWF0aW9uLicsXG4gICAgfSxcbiAgICAnMTAyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBJbml0aWFsaXphdGlvbiBGYWlsdXJlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIEluaXRpYWxpemUgZmFpbGVkIGZvciBhbiB1bmtub3duIHJlYXNvbi4nLFxuICAgIH0sXG4gICAgJzEwMyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0FscmVhZHkgSW5pdGlhbGl6ZWQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gSW5pdGlhbGl6ZSBmYWlsZWQgYmVjYXVzZSBJbml0aWFsaXplIHdhcyBhbHJlYWR5IGNhbGxlZC4nLFxuICAgIH0sXG4gICAgJzEwNCc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0NvbnRlbnQgSW5zdGFuY2UgVGVybWluYXRlZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBJbml0aWFsaXplIGZhaWxlZCBiZWNhdXNlIFRlcm1pbmF0ZSB3YXMgYWxyZWFkeSBjYWxsZWQuJyxcbiAgICB9LFxuICAgICcxMTEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIFRlcm1pbmF0aW9uIEZhaWx1cmUnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gVGVybWluYXRlIGZhaWxlZCBmb3IgYW4gdW5rbm93biByZWFzb24uJyxcbiAgICB9LFxuICAgICcxMTInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdUZXJtaW5hdGlvbiBCZWZvcmUgSW5pdGlhbGl6YXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gVGVybWluYXRlIGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGJlZm9yZSB0aGUgY2FsbCB0byBJbml0aWFsaXplLicsXG4gICAgfSxcbiAgICAnMTEzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnVGVybWluYXRpb24gQWZ0ZXIgVGVybWluYXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gVGVybWluYXRlIGZhaWxlZCBiZWNhdXNlIFRlcm1pbmF0ZSB3YXMgYWxyZWFkeSBjYWxsZWQuJyxcbiAgICB9LFxuICAgICcxMjInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdSZXRyaWV2ZSBEYXRhIEJlZm9yZSBJbml0aWFsaXphdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBHZXRWYWx1ZSBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBiZWZvcmUgdGhlIGNhbGwgdG8gSW5pdGlhbGl6ZS4nLFxuICAgIH0sXG4gICAgJzEyMyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1JldHJpZXZlIERhdGEgQWZ0ZXIgVGVybWluYXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gR2V0VmFsdWUgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYWZ0ZXIgdGhlIGNhbGwgdG8gVGVybWluYXRlLicsXG4gICAgfSxcbiAgICAnMTMyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnU3RvcmUgRGF0YSBCZWZvcmUgSW5pdGlhbGl6YXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gU2V0VmFsdWUgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYmVmb3JlIHRoZSBjYWxsIHRvIEluaXRpYWxpemUuJyxcbiAgICB9LFxuICAgICcxMzMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdTdG9yZSBEYXRhIEFmdGVyIFRlcm1pbmF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIFNldFZhbHVlIGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGFmdGVyIHRoZSBjYWxsIHRvIFRlcm1pbmF0ZS4nLFxuICAgIH0sXG4gICAgJzE0Mic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0NvbW1pdCBCZWZvcmUgSW5pdGlhbGl6YXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gQ29tbWl0IGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGJlZm9yZSB0aGUgY2FsbCB0byBJbml0aWFsaXplLicsXG4gICAgfSxcbiAgICAnMTQzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnQ29tbWl0IEFmdGVyIFRlcm1pbmF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIENvbW1pdCBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBhZnRlciB0aGUgY2FsbCB0byBUZXJtaW5hdGUuJyxcbiAgICB9LFxuICAgICcyMDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIEFyZ3VtZW50IEVycm9yJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdBbiBpbnZhbGlkIGFyZ3VtZW50IHdhcyBwYXNzZWQgdG8gYW4gQVBJIG1ldGhvZCAodXN1YWxseSBpbmRpY2F0ZXMgdGhhdCBJbml0aWFsaXplLCBDb21taXQgb3IgVGVybWluYXRlIGRpZCBub3QgcmVjZWl2ZSB0aGUgZXhwZWN0ZWQgZW1wdHkgc3RyaW5nIGFyZ3VtZW50LicsXG4gICAgfSxcbiAgICAnMzAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBHZXQgRmFpbHVyZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIGEgZmFpbGVkIEdldFZhbHVlIGNhbGwgd2hlcmUgbm8gb3RoZXIgc3BlY2lmaWMgZXJyb3IgY29kZSBpcyBhcHBsaWNhYmxlLiBVc2UgR2V0RGlhZ25vc3RpYyBmb3IgbW9yZSBpbmZvcm1hdGlvbi4nLFxuICAgIH0sXG4gICAgJzM1MSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgU2V0IEZhaWx1cmUnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyBhIGZhaWxlZCBTZXRWYWx1ZSBjYWxsIHdoZXJlIG5vIG90aGVyIHNwZWNpZmljIGVycm9yIGNvZGUgaXMgYXBwbGljYWJsZS4gVXNlIEdldERpYWdub3N0aWMgZm9yIG1vcmUgaW5mb3JtYXRpb24uJyxcbiAgICB9LFxuICAgICczOTEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIENvbW1pdCBGYWlsdXJlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgYSBmYWlsZWQgQ29tbWl0IGNhbGwgd2hlcmUgbm8gb3RoZXIgc3BlY2lmaWMgZXJyb3IgY29kZSBpcyBhcHBsaWNhYmxlLiBVc2UgR2V0RGlhZ25vc3RpYyBmb3IgbW9yZSBpbmZvcm1hdGlvbi4nLFxuICAgIH0sXG4gICAgJzQwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1VuZGVmaW5lZCBEYXRhIE1vZGVsIEVsZW1lbnQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1RoZSBkYXRhIG1vZGVsIGVsZW1lbnQgbmFtZSBwYXNzZWQgdG8gR2V0VmFsdWUgb3IgU2V0VmFsdWUgaXMgbm90IGEgdmFsaWQgU0NPUk0gZGF0YSBtb2RlbCBlbGVtZW50LicsXG4gICAgfSxcbiAgICAnNDAyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnVW5pbXBsZW1lbnRlZCBEYXRhIE1vZGVsIEVsZW1lbnQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1RoZSBkYXRhIG1vZGVsIGVsZW1lbnQgaW5kaWNhdGVkIGluIGEgY2FsbCB0byBHZXRWYWx1ZSBvciBTZXRWYWx1ZSBpcyB2YWxpZCwgYnV0IHdhcyBub3QgaW1wbGVtZW50ZWQgYnkgdGhpcyBMTVMuIEluIFNDT1JNIDIwMDQsIHRoaXMgZXJyb3Igd291bGQgaW5kaWNhdGUgYW4gTE1TIHRoYXQgaXMgbm90IGZ1bGx5IFNDT1JNIGNvbmZvcm1hbnQuJyxcbiAgICB9LFxuICAgICc0MDMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdEYXRhIE1vZGVsIEVsZW1lbnQgVmFsdWUgTm90IEluaXRpYWxpemVkJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdBdHRlbXB0IHRvIHJlYWQgYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQgYnkgdGhlIExNUyBvciB0aHJvdWdoIGEgU2V0VmFsdWUgY2FsbC4gVGhpcyBlcnJvciBjb25kaXRpb24gaXMgb2Z0ZW4gcmVhY2hlZCBkdXJpbmcgbm9ybWFsIGV4ZWN1dGlvbiBvZiBhIFNDTy4nLFxuICAgIH0sXG4gICAgJzQwNCc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0RhdGEgTW9kZWwgRWxlbWVudCBJcyBSZWFkIE9ubHknLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1NldFZhbHVlIHdhcyBjYWxsZWQgd2l0aCBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IGNhbiBvbmx5IGJlIHJlYWQuJyxcbiAgICB9LFxuICAgICc0MDUnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdEYXRhIE1vZGVsIEVsZW1lbnQgSXMgV3JpdGUgT25seScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnR2V0VmFsdWUgd2FzIGNhbGxlZCBvbiBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IGNhbiBvbmx5IGJlIHdyaXR0ZW4gdG8uJyxcbiAgICB9LFxuICAgICc0MDYnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdEYXRhIE1vZGVsIEVsZW1lbnQgVHlwZSBNaXNtYXRjaCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnU2V0VmFsdWUgd2FzIGNhbGxlZCB3aXRoIGEgdmFsdWUgdGhhdCBpcyBub3QgY29uc2lzdGVudCB3aXRoIHRoZSBkYXRhIGZvcm1hdCBvZiB0aGUgc3VwcGxpZWQgZGF0YSBtb2RlbCBlbGVtZW50LicsXG4gICAgfSxcbiAgICAnNDA3Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBFbGVtZW50IFZhbHVlIE91dCBPZiBSYW5nZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnVGhlIG51bWVyaWMgdmFsdWUgc3VwcGxpZWQgdG8gYSBTZXRWYWx1ZSBjYWxsIGlzIG91dHNpZGUgb2YgdGhlIG51bWVyaWMgcmFuZ2UgYWxsb3dlZCBmb3IgdGhlIHN1cHBsaWVkIGRhdGEgbW9kZWwgZWxlbWVudC4nLFxuICAgIH0sXG4gICAgJzQwOCc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0RhdGEgTW9kZWwgRGVwZW5kZW5jeSBOb3QgRXN0YWJsaXNoZWQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1NvbWUgZGF0YSBtb2RlbCBlbGVtZW50cyBjYW5ub3QgYmUgc2V0IHVudGlsIGFub3RoZXIgZGF0YSBtb2RlbCBlbGVtZW50IHdhcyBzZXQuIFRoaXMgZXJyb3IgY29uZGl0aW9uIGluZGljYXRlcyB0aGF0IHRoZSBwcmVyZXF1aXNpdGUgZWxlbWVudCB3YXMgbm90IHNldCBiZWZvcmUgdGhlIGRlcGVuZGVudCBlbGVtZW50LicsXG4gICAgfSxcbiAgfSxcbn07XG5cbmNvbnN0IEFQSUNvbnN0YW50cyA9IHtcbiAgZ2xvYmFsOiBnbG9iYWwsXG4gIHNjb3JtMTI6IHNjb3JtMTIsXG4gIGFpY2M6IGFpY2MsXG4gIHNjb3JtMjAwNDogc2Nvcm0yMDA0LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgQVBJQ29uc3RhbnRzO1xuIiwiLy8gQGZsb3dcbmNvbnN0IGdsb2JhbCA9IHtcbiAgR0VORVJBTDogMTAxLFxuICBJTklUSUFMSVpBVElPTl9GQUlMRUQ6IDEwMSxcbiAgSU5JVElBTElaRUQ6IDEwMSxcbiAgVEVSTUlOQVRFRDogMTAxLFxuICBURVJNSU5BVElPTl9GQUlMVVJFOiAxMDEsXG4gIFRFUk1JTkFUSU9OX0JFRk9SRV9JTklUOiAxMDEsXG4gIE1VTFRJUExFX1RFUk1JTkFUSU9OOiAxMDEsXG4gIFJFVFJJRVZFX0JFRk9SRV9JTklUOiAxMDEsXG4gIFJFVFJJRVZFX0FGVEVSX1RFUk06IDEwMSxcbiAgU1RPUkVfQkVGT1JFX0lOSVQ6IDEwMSxcbiAgU1RPUkVfQUZURVJfVEVSTTogMTAxLFxuICBDT01NSVRfQkVGT1JFX0lOSVQ6IDEwMSxcbiAgQ09NTUlUX0FGVEVSX1RFUk06IDEwMSxcbiAgQVJHVU1FTlRfRVJST1I6IDEwMSxcbiAgQ0hJTERSRU5fRVJST1I6IDEwMSxcbiAgQ09VTlRfRVJST1I6IDEwMSxcbiAgR0VORVJBTF9HRVRfRkFJTFVSRTogMTAxLFxuICBHRU5FUkFMX1NFVF9GQUlMVVJFOiAxMDEsXG4gIEdFTkVSQUxfQ09NTUlUX0ZBSUxVUkU6IDEwMSxcbiAgVU5ERUZJTkVEX0RBVEFfTU9ERUw6IDEwMSxcbiAgVU5JTVBMRU1FTlRFRF9FTEVNRU5UOiAxMDEsXG4gIFZBTFVFX05PVF9JTklUSUFMSVpFRDogMTAxLFxuICBJTlZBTElEX1NFVF9WQUxVRTogMTAxLFxuICBSRUFEX09OTFlfRUxFTUVOVDogMTAxLFxuICBXUklURV9PTkxZX0VMRU1FTlQ6IDEwMSxcbiAgVFlQRV9NSVNNQVRDSDogMTAxLFxuICBWQUxVRV9PVVRfT0ZfUkFOR0U6IDEwMSxcbiAgREVQRU5ERU5DWV9OT1RfRVNUQUJMSVNIRUQ6IDEwMSxcbn07XG5cbmNvbnN0IHNjb3JtMTIgPSB7XG4gIC4uLmdsb2JhbCwgLi4ue1xuICAgIFJFVFJJRVZFX0JFRk9SRV9JTklUOiAzMDEsXG4gICAgU1RPUkVfQkVGT1JFX0lOSVQ6IDMwMSxcbiAgICBDT01NSVRfQkVGT1JFX0lOSVQ6IDMwMSxcbiAgICBBUkdVTUVOVF9FUlJPUjogMjAxLFxuICAgIENISUxEUkVOX0VSUk9SOiAyMDIsXG4gICAgQ09VTlRfRVJST1I6IDIwMyxcbiAgICBVTkRFRklORURfREFUQV9NT0RFTDogNDAxLFxuICAgIFVOSU1QTEVNRU5URURfRUxFTUVOVDogNDAxLFxuICAgIFZBTFVFX05PVF9JTklUSUFMSVpFRDogMzAxLFxuICAgIElOVkFMSURfU0VUX1ZBTFVFOiA0MDIsXG4gICAgUkVBRF9PTkxZX0VMRU1FTlQ6IDQwMyxcbiAgICBXUklURV9PTkxZX0VMRU1FTlQ6IDQwNCxcbiAgICBUWVBFX01JU01BVENIOiA0MDUsXG4gICAgVkFMVUVfT1VUX09GX1JBTkdFOiA0MDcsXG4gICAgREVQRU5ERU5DWV9OT1RfRVNUQUJMSVNIRUQ6IDQwOCxcbiAgfSxcbn07XG5cbmNvbnN0IHNjb3JtMjAwNCA9IHtcbiAgLi4uZ2xvYmFsLCAuLi57XG4gICAgSU5JVElBTElaQVRJT05fRkFJTEVEOiAxMDIsXG4gICAgSU5JVElBTElaRUQ6IDEwMyxcbiAgICBURVJNSU5BVEVEOiAxMDQsXG4gICAgVEVSTUlOQVRJT05fRkFJTFVSRTogMTExLFxuICAgIFRFUk1JTkFUSU9OX0JFRk9SRV9JTklUOiAxMTIsXG4gICAgTVVMVElQTEVfVEVSTUlOQVRJT05TOiAxMTMsXG4gICAgUkVUUklFVkVfQkVGT1JFX0lOSVQ6IDEyMixcbiAgICBSRVRSSUVWRV9BRlRFUl9URVJNOiAxMjMsXG4gICAgU1RPUkVfQkVGT1JFX0lOSVQ6IDEzMixcbiAgICBTVE9SRV9BRlRFUl9URVJNOiAxMzMsXG4gICAgQ09NTUlUX0JFRk9SRV9JTklUOiAxNDIsXG4gICAgQ09NTUlUX0FGVEVSX1RFUk06IDE0MyxcbiAgICBBUkdVTUVOVF9FUlJPUjogMjAxLFxuICAgIEdFTkVSQUxfR0VUX0ZBSUxVUkU6IDMwMSxcbiAgICBHRU5FUkFMX1NFVF9GQUlMVVJFOiAzNTEsXG4gICAgR0VORVJBTF9DT01NSVRfRkFJTFVSRTogMzkxLFxuICAgIFVOREVGSU5FRF9EQVRBX01PREVMOiA0MDEsXG4gICAgVU5JTVBMRU1FTlRFRF9FTEVNRU5UOiA0MDIsXG4gICAgVkFMVUVfTk9UX0lOSVRJQUxJWkVEOiA0MDMsXG4gICAgUkVBRF9PTkxZX0VMRU1FTlQ6IDQwNCxcbiAgICBXUklURV9PTkxZX0VMRU1FTlQ6IDQwNSxcbiAgICBUWVBFX01JU01BVENIOiA0MDYsXG4gICAgVkFMVUVfT1VUX09GX1JBTkdFOiA0MDcsXG4gICAgREVQRU5ERU5DWV9OT1RfRVNUQUJMSVNIRUQ6IDQwOCxcbiAgfSxcbn07XG5cbmNvbnN0IEVycm9yQ29kZXMgPSB7XG4gIHNjb3JtMTI6IHNjb3JtMTIsXG4gIHNjb3JtMjAwNDogc2Nvcm0yMDA0LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgRXJyb3JDb2RlcztcbiIsImNvbnN0IFZhbGlkTGFuZ3VhZ2VzID0ge1xuICAnYWEnOiAnYWEnLCAnYWInOiAnYWInLCAnYWUnOiAnYWUnLCAnYWYnOiAnYWYnLCAnYWsnOiAnYWsnLCAnYW0nOiAnYW0nLFxuICAnYW4nOiAnYW4nLCAnYXInOiAnYXInLCAnYXMnOiAnYXMnLCAnYXYnOiAnYXYnLCAnYXknOiAnYXknLCAnYXonOiAnYXonLFxuICAnYmEnOiAnYmEnLCAnYmUnOiAnYmUnLCAnYmcnOiAnYmcnLCAnYmgnOiAnYmgnLCAnYmknOiAnYmknLCAnYm0nOiAnYm0nLFxuICAnYm4nOiAnYm4nLCAnYm8nOiAnYm8nLCAnYnInOiAnYnInLCAnYnMnOiAnYnMnLCAnY2EnOiAnY2EnLCAnY2UnOiAnY2UnLFxuICAnY2gnOiAnY2gnLCAnY28nOiAnY28nLCAnY3InOiAnY3InLCAnY3MnOiAnY3MnLCAnY3UnOiAnY3UnLCAnY3YnOiAnY3YnLFxuICAnY3knOiAnY3knLCAnZGEnOiAnZGEnLCAnZGUnOiAnZGUnLCAnZHYnOiAnZHYnLCAnZHonOiAnZHonLCAnZWUnOiAnZWUnLFxuICAnZWwnOiAnZWwnLCAnZW4nOiAnZW4nLCAnZW8nOiAnZW8nLCAnZXMnOiAnZXMnLCAnZXQnOiAnZXQnLCAnZXUnOiAnZXUnLFxuICAnZmEnOiAnZmEnLCAnZmYnOiAnZmYnLCAnZmknOiAnZmknLCAnZmonOiAnZmonLCAnZm8nOiAnZm8nLCAnZnInOiAnZnInLFxuICAnZnknOiAnZnknLCAnZ2EnOiAnZ2EnLCAnZ2QnOiAnZ2QnLCAnZ2wnOiAnZ2wnLCAnZ24nOiAnZ24nLCAnZ3UnOiAnZ3UnLFxuICAnZ3YnOiAnZ3YnLCAnaGEnOiAnaGEnLCAnaGUnOiAnaGUnLCAnaGknOiAnaGknLCAnaG8nOiAnaG8nLCAnaHInOiAnaHInLFxuICAnaHQnOiAnaHQnLCAnaHUnOiAnaHUnLCAnaHknOiAnaHknLCAnaHonOiAnaHonLCAnaWEnOiAnaWEnLCAnaWQnOiAnaWQnLFxuICAnaWUnOiAnaWUnLCAnaWcnOiAnaWcnLCAnaWknOiAnaWknLCAnaWsnOiAnaWsnLCAnaW8nOiAnaW8nLCAnaXMnOiAnaXMnLFxuICAnaXQnOiAnaXQnLCAnaXUnOiAnaXUnLCAnamEnOiAnamEnLCAnanYnOiAnanYnLCAna2EnOiAna2EnLCAna2cnOiAna2cnLFxuICAna2knOiAna2knLCAna2onOiAna2onLCAna2snOiAna2snLCAna2wnOiAna2wnLCAna20nOiAna20nLCAna24nOiAna24nLFxuICAna28nOiAna28nLCAna3InOiAna3InLCAna3MnOiAna3MnLCAna3UnOiAna3UnLCAna3YnOiAna3YnLCAna3cnOiAna3cnLFxuICAna3knOiAna3knLCAnbGEnOiAnbGEnLCAnbGInOiAnbGInLCAnbGcnOiAnbGcnLCAnbGknOiAnbGknLCAnbG4nOiAnbG4nLFxuICAnbG8nOiAnbG8nLCAnbHQnOiAnbHQnLCAnbHUnOiAnbHUnLCAnbHYnOiAnbHYnLCAnbWcnOiAnbWcnLCAnbWgnOiAnbWgnLFxuICAnbWknOiAnbWknLCAnbWsnOiAnbWsnLCAnbWwnOiAnbWwnLCAnbW4nOiAnbW4nLCAnbW8nOiAnbW8nLCAnbXInOiAnbXInLFxuICAnbXMnOiAnbXMnLCAnbXQnOiAnbXQnLCAnbXknOiAnbXknLCAnbmEnOiAnbmEnLCAnbmInOiAnbmInLCAnbmQnOiAnbmQnLFxuICAnbmUnOiAnbmUnLCAnbmcnOiAnbmcnLCAnbmwnOiAnbmwnLCAnbm4nOiAnbm4nLCAnbm8nOiAnbm8nLCAnbnInOiAnbnInLFxuICAnbnYnOiAnbnYnLCAnbnknOiAnbnknLCAnb2MnOiAnb2MnLCAnb2onOiAnb2onLCAnb20nOiAnb20nLCAnb3InOiAnb3InLFxuICAnb3MnOiAnb3MnLCAncGEnOiAncGEnLCAncGknOiAncGknLCAncGwnOiAncGwnLCAncHMnOiAncHMnLCAncHQnOiAncHQnLFxuICAncXUnOiAncXUnLCAncm0nOiAncm0nLCAncm4nOiAncm4nLCAncm8nOiAncm8nLCAncnUnOiAncnUnLCAncncnOiAncncnLFxuICAnc2EnOiAnc2EnLCAnc2MnOiAnc2MnLCAnc2QnOiAnc2QnLCAnc2UnOiAnc2UnLCAnc2cnOiAnc2cnLCAnc2gnOiAnc2gnLFxuICAnc2knOiAnc2knLCAnc2snOiAnc2snLCAnc2wnOiAnc2wnLCAnc20nOiAnc20nLCAnc24nOiAnc24nLCAnc28nOiAnc28nLFxuICAnc3EnOiAnc3EnLCAnc3InOiAnc3InLCAnc3MnOiAnc3MnLCAnc3QnOiAnc3QnLCAnc3UnOiAnc3UnLCAnc3YnOiAnc3YnLFxuICAnc3cnOiAnc3cnLCAndGEnOiAndGEnLCAndGUnOiAndGUnLCAndGcnOiAndGcnLCAndGgnOiAndGgnLCAndGknOiAndGknLFxuICAndGsnOiAndGsnLCAndGwnOiAndGwnLCAndG4nOiAndG4nLCAndG8nOiAndG8nLCAndHInOiAndHInLCAndHMnOiAndHMnLFxuICAndHQnOiAndHQnLCAndHcnOiAndHcnLCAndHknOiAndHknLCAndWcnOiAndWcnLCAndWsnOiAndWsnLCAndXInOiAndXInLFxuICAndXonOiAndXonLCAndmUnOiAndmUnLCAndmknOiAndmknLCAndm8nOiAndm8nLCAnd2EnOiAnd2EnLCAnd28nOiAnd28nLFxuICAneGgnOiAneGgnLCAneWknOiAneWknLCAneW8nOiAneW8nLCAnemEnOiAnemEnLCAnemgnOiAnemgnLCAnenUnOiAnenUnLFxuICAnYWFyJzogJ2FhcicsICdhYmsnOiAnYWJrJywgJ2F2ZSc6ICdhdmUnLCAnYWZyJzogJ2FmcicsICdha2EnOiAnYWthJyxcbiAgJ2FtaCc6ICdhbWgnLCAnYXJnJzogJ2FyZycsICdhcmEnOiAnYXJhJywgJ2FzbSc6ICdhc20nLCAnYXZhJzogJ2F2YScsXG4gICdheW0nOiAnYXltJywgJ2F6ZSc6ICdhemUnLCAnYmFrJzogJ2JhaycsICdiZWwnOiAnYmVsJywgJ2J1bCc6ICdidWwnLFxuICAnYmloJzogJ2JpaCcsICdiaXMnOiAnYmlzJywgJ2JhbSc6ICdiYW0nLCAnYmVuJzogJ2JlbicsICd0aWInOiAndGliJyxcbiAgJ2JvZCc6ICdib2QnLCAnYnJlJzogJ2JyZScsICdib3MnOiAnYm9zJywgJ2NhdCc6ICdjYXQnLCAnY2hlJzogJ2NoZScsXG4gICdjaGEnOiAnY2hhJywgJ2Nvcyc6ICdjb3MnLCAnY3JlJzogJ2NyZScsICdjemUnOiAnY3plJywgJ2Nlcyc6ICdjZXMnLFxuICAnY2h1JzogJ2NodScsICdjaHYnOiAnY2h2JywgJ3dlbCc6ICd3ZWwnLCAnY3ltJzogJ2N5bScsICdkYW4nOiAnZGFuJyxcbiAgJ2dlcic6ICdnZXInLCAnZGV1JzogJ2RldScsICdkaXYnOiAnZGl2JywgJ2R6byc6ICdkem8nLCAnZXdlJzogJ2V3ZScsXG4gICdncmUnOiAnZ3JlJywgJ2VsbCc6ICdlbGwnLCAnZW5nJzogJ2VuZycsICdlcG8nOiAnZXBvJywgJ3NwYSc6ICdzcGEnLFxuICAnZXN0JzogJ2VzdCcsICdiYXEnOiAnYmFxJywgJ2V1cyc6ICdldXMnLCAncGVyJzogJ3BlcicsICdmYXMnOiAnZmFzJyxcbiAgJ2Z1bCc6ICdmdWwnLCAnZmluJzogJ2ZpbicsICdmaWonOiAnZmlqJywgJ2Zhbyc6ICdmYW8nLCAnZnJlJzogJ2ZyZScsXG4gICdmcmEnOiAnZnJhJywgJ2ZyeSc6ICdmcnknLCAnZ2xlJzogJ2dsZScsICdnbGEnOiAnZ2xhJywgJ2dsZyc6ICdnbGcnLFxuICAnZ3JuJzogJ2dybicsICdndWonOiAnZ3VqJywgJ2dsdic6ICdnbHYnLCAnaGF1JzogJ2hhdScsICdoZWInOiAnaGViJyxcbiAgJ2hpbic6ICdoaW4nLCAnaG1vJzogJ2htbycsICdocnYnOiAnaHJ2JywgJ2hhdCc6ICdoYXQnLCAnaHVuJzogJ2h1bicsXG4gICdhcm0nOiAnYXJtJywgJ2h5ZSc6ICdoeWUnLCAnaGVyJzogJ2hlcicsICdpbmEnOiAnaW5hJywgJ2luZCc6ICdpbmQnLFxuICAnaWxlJzogJ2lsZScsICdpYm8nOiAnaWJvJywgJ2lpaSc6ICdpaWknLCAnaXBrJzogJ2lwaycsICdpZG8nOiAnaWRvJyxcbiAgJ2ljZSc6ICdpY2UnLCAnaXNsJzogJ2lzbCcsICdpdGEnOiAnaXRhJywgJ2lrdSc6ICdpa3UnLCAnanBuJzogJ2pwbicsXG4gICdqYXYnOiAnamF2JywgJ2dlbyc6ICdnZW8nLCAna2F0JzogJ2thdCcsICdrb24nOiAna29uJywgJ2tpayc6ICdraWsnLFxuICAna3VhJzogJ2t1YScsICdrYXonOiAna2F6JywgJ2thbCc6ICdrYWwnLCAna2htJzogJ2tobScsICdrYW4nOiAna2FuJyxcbiAgJ2tvcic6ICdrb3InLCAna2F1JzogJ2thdScsICdrYXMnOiAna2FzJywgJ2t1cic6ICdrdXInLCAna29tJzogJ2tvbScsXG4gICdjb3InOiAnY29yJywgJ2tpcic6ICdraXInLCAnbGF0JzogJ2xhdCcsICdsdHonOiAnbHR6JywgJ2x1Zyc6ICdsdWcnLFxuICAnbGltJzogJ2xpbScsICdsaW4nOiAnbGluJywgJ2xhbyc6ICdsYW8nLCAnbGl0JzogJ2xpdCcsICdsdWInOiAnbHViJyxcbiAgJ2xhdic6ICdsYXYnLCAnbWxnJzogJ21sZycsICdtYWgnOiAnbWFoJywgJ21hbyc6ICdtYW8nLCAnbXJpJzogJ21yaScsXG4gICdtYWMnOiAnbWFjJywgJ21rZCc6ICdta2QnLCAnbWFsJzogJ21hbCcsICdtb24nOiAnbW9uJywgJ21vbCc6ICdtb2wnLFxuICAnbWFyJzogJ21hcicsICdtYXknOiAnbWF5JywgJ21zYSc6ICdtc2EnLCAnbWx0JzogJ21sdCcsICdidXInOiAnYnVyJyxcbiAgJ215YSc6ICdteWEnLCAnbmF1JzogJ25hdScsICdub2InOiAnbm9iJywgJ25kZSc6ICduZGUnLCAnbmVwJzogJ25lcCcsXG4gICduZG8nOiAnbmRvJywgJ2R1dCc6ICdkdXQnLCAnbmxkJzogJ25sZCcsICdubm8nOiAnbm5vJywgJ25vcic6ICdub3InLFxuICAnbmJsJzogJ25ibCcsICduYXYnOiAnbmF2JywgJ255YSc6ICdueWEnLCAnb2NpJzogJ29jaScsICdvamknOiAnb2ppJyxcbiAgJ29ybSc6ICdvcm0nLCAnb3JpJzogJ29yaScsICdvc3MnOiAnb3NzJywgJ3Bhbic6ICdwYW4nLCAncGxpJzogJ3BsaScsXG4gICdwb2wnOiAncG9sJywgJ3B1cyc6ICdwdXMnLCAncG9yJzogJ3BvcicsICdxdWUnOiAncXVlJywgJ3JvaCc6ICdyb2gnLFxuICAncnVuJzogJ3J1bicsICdydW0nOiAncnVtJywgJ3Jvbic6ICdyb24nLCAncnVzJzogJ3J1cycsICdraW4nOiAna2luJyxcbiAgJ3Nhbic6ICdzYW4nLCAnc3JkJzogJ3NyZCcsICdzbmQnOiAnc25kJywgJ3NtZSc6ICdzbWUnLCAnc2FnJzogJ3NhZycsXG4gICdzbG8nOiAnc2xvJywgJ3Npbic6ICdzaW4nLCAnc2xrJzogJ3NsaycsICdzbHYnOiAnc2x2JywgJ3Ntbyc6ICdzbW8nLFxuICAnc25hJzogJ3NuYScsICdzb20nOiAnc29tJywgJ2FsYic6ICdhbGInLCAnc3FpJzogJ3NxaScsICdzcnAnOiAnc3JwJyxcbiAgJ3Nzdyc6ICdzc3cnLCAnc290JzogJ3NvdCcsICdzdW4nOiAnc3VuJywgJ3N3ZSc6ICdzd2UnLCAnc3dhJzogJ3N3YScsXG4gICd0YW0nOiAndGFtJywgJ3RlbCc6ICd0ZWwnLCAndGdrJzogJ3RnaycsICd0aGEnOiAndGhhJywgJ3Rpcic6ICd0aXInLFxuICAndHVrJzogJ3R1aycsICd0Z2wnOiAndGdsJywgJ3Rzbic6ICd0c24nLCAndG9uJzogJ3RvbicsICd0dXInOiAndHVyJyxcbiAgJ3Rzbyc6ICd0c28nLCAndGF0JzogJ3RhdCcsICd0d2knOiAndHdpJywgJ3RhaCc6ICd0YWgnLCAndWlnJzogJ3VpZycsXG4gICd1a3InOiAndWtyJywgJ3VyZCc6ICd1cmQnLCAndXpiJzogJ3V6YicsICd2ZW4nOiAndmVuJywgJ3ZpZSc6ICd2aWUnLFxuICAndm9sJzogJ3ZvbCcsICd3bG4nOiAnd2xuJywgJ3dvbCc6ICd3b2wnLCAneGhvJzogJ3hobycsICd5aWQnOiAneWlkJyxcbiAgJ3lvcic6ICd5b3InLCAnemhhJzogJ3poYScsICdjaGknOiAnY2hpJywgJ3pobyc6ICd6aG8nLCAnenVsJzogJ3p1bCcsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBWYWxpZExhbmd1YWdlcztcbiIsIi8vIEBmbG93XG5cbmNvbnN0IHNjb3JtMTIgPSB7XG4gIENNSVN0cmluZzI1NjogJ14uezAsMjU1fSQnLFxuICBDTUlTdHJpbmc0MDk2OiAnXi57MCw0MDk2fSQnLFxuICBDTUlUaW1lOiAnXig/OlswMV1cXFxcZHwyWzAxMjNdKTooPzpbMDEyMzQ1XVxcXFxkKTooPzpbMDEyMzQ1XVxcXFxkKSQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSVRpbWVzcGFuOiAnXihbMC05XXsyLH0pOihbMC05XXsyfSk6KFswLTldezJ9KShcXC5bMC05XXsxLDJ9KT8kJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlJbnRlZ2VyOiAnXlxcXFxkKyQnLFxuICBDTUlTSW50ZWdlcjogJ14tPyhbMC05XSspJCcsXG4gIENNSURlY2ltYWw6ICdeLT8oWzAtOV17MCwzfSkoXFwuWzAtOV0qKT8kJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlJZGVudGlmaWVyOiAnXltcXFxcdTAwMjEtXFxcXHUwMDdFXFxcXHNdezAsMjU1fSQnLFxuICBDTUlGZWVkYmFjazogJ14uezAsMjU1fSQnLCAvLyBUaGlzIG11c3QgYmUgcmVkZWZpbmVkXG4gIENNSUluZGV4OiAnWy5fXShcXFxcZCspLicsXG5cbiAgLy8gVm9jYWJ1bGFyeSBEYXRhIFR5cGUgRGVmaW5pdGlvblxuICBDTUlTdGF0dXM6ICdeKHBhc3NlZHxjb21wbGV0ZWR8ZmFpbGVkfGluY29tcGxldGV8YnJvd3NlZCkkJyxcbiAgQ01JU3RhdHVzMjogJ14ocGFzc2VkfGNvbXBsZXRlZHxmYWlsZWR8aW5jb21wbGV0ZXxicm93c2VkfG5vdCBhdHRlbXB0ZWQpJCcsXG4gIENNSUV4aXQ6ICdeKHRpbWUtb3V0fHN1c3BlbmR8bG9nb3V0fCkkJyxcbiAgQ01JVHlwZTogJ14odHJ1ZS1mYWxzZXxjaG9pY2V8ZmlsbC1pbnxtYXRjaGluZ3xwZXJmb3JtYW5jZXxzZXF1ZW5jaW5nfGxpa2VydHxudW1lcmljKSQnLFxuICBDTUlSZXN1bHQ6ICdeKGNvcnJlY3R8d3Jvbmd8dW5hbnRpY2lwYXRlZHxuZXV0cmFsfChbMC05XXswLDN9KT8oXFxcXC5bMC05XSopPykkJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBOQVZFdmVudDogJ14ocHJldmlvdXN8Y29udGludWUpJCcsXG5cbiAgLy8gRGF0YSByYW5nZXNcbiAgc2NvcmVfcmFuZ2U6ICcwIzEwMCcsXG4gIGF1ZGlvX3JhbmdlOiAnLTEjMTAwJyxcbiAgc3BlZWRfcmFuZ2U6ICctMTAwIzEwMCcsXG4gIHdlaWdodGluZ19yYW5nZTogJy0xMDAjMTAwJyxcbiAgdGV4dF9yYW5nZTogJy0xIzEnLFxufTtcblxuY29uc3QgYWljYyA9IHtcbiAgLi4uc2Nvcm0xMiwgLi4ue1xuICAgIENNSUlkZW50aWZpZXI6ICdeXFxcXHd7MSwyNTV9JCcsXG4gIH0sXG59O1xuXG5jb25zdCBzY29ybTIwMDQgPSB7XG4gIENNSVN0cmluZzIwMDogJ15bXFxcXHUwMDAwLVxcXFx1RkZGRl17MCwyMDB9JCcsXG4gIENNSVN0cmluZzI1MDogJ15bXFxcXHUwMDAwLVxcXFx1RkZGRl17MCwyNTB9JCcsXG4gIENNSVN0cmluZzEwMDA6ICdeW1xcXFx1MDAwMC1cXFxcdUZGRkZdezAsMTAwMH0kJyxcbiAgQ01JU3RyaW5nNDAwMDogJ15bXFxcXHUwMDAwLVxcXFx1RkZGRl17MCw0MDAwfSQnLFxuICBDTUlTdHJpbmc2NDAwMDogJ15bXFxcXHUwMDAwLVxcXFx1RkZGRl17MCw2NDAwMH0kJyxcbiAgQ01JTGFuZzogJ14oW2EtekEtWl17MiwzfXxpfHgpKFxcLVthLXpBLVowLTlcXC1dezIsOH0pPyR8XiQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUxhbmdTdHJpbmcyNTA6ICdeKFxce2xhbmc9KFthLXpBLVpdezIsM318aXx4KShcXC1bYS16QS1aMC05XFwtXXsyLDh9KT9cXH0pPygoPyFcXHsuKiQpLnswLDI1MH0kKT8kJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlMYW5nY3I6ICdeKChcXHtsYW5nPShbYS16QS1aXXsyLDN9fGl8eCk/KFxcLVthLXpBLVowLTlcXC1dezIsOH0pP1xcfSkpKC4qPykkJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlMYW5nU3RyaW5nMjUwY3I6ICdeKChcXHtsYW5nPShbYS16QS1aXXsyLDN9fGl8eCk/KFxcLVthLXpBLVowLTlcXC1dezIsOH0pP1xcfSk/KC57MCwyNTB9KT8pPyQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUxhbmdTdHJpbmc0MDAwOiAnXihcXHtsYW5nPShbYS16QS1aXXsyLDN9fGl8eCkoXFwtW2EtekEtWjAtOVxcLV17Miw4fSk/XFx9KT8oKD8hXFx7LiokKS57MCw0MDAwfSQpPyQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSVRpbWU6ICdeKDE5WzctOV17MX1bMC05XXsxfXwyMFswLTJdezF9WzAtOV17MX18MjAzWzAtOF17MX0pKCgtKDBbMS05XXsxfXwxWzAtMl17MX0pKSgoLSgwWzEtOV17MX18WzEtMl17MX1bMC05XXsxfXwzWzAtMV17MX0pKShUKFswLTFdezF9WzAtOV17MX18MlswLTNdezF9KSgoOlswLTVdezF9WzAtOV17MX0pKCg6WzAtNV17MX1bMC05XXsxfSkoKFxcXFwuWzAtOV17MSwyfSkoKFp8KFsrfC1dKFswLTFdezF9WzAtOV17MX18MlswLTNdezF9KSkpKDpbMC01XXsxfVswLTldezF9KT8pPyk/KT8pPyk/KT8pPyQnLFxuICBDTUlUaW1lc3BhbjogJ15QKD86KFsuLFxcXFxkXSspWSk/KD86KFsuLFxcXFxkXSspTSk/KD86KFsuLFxcXFxkXSspVyk/KD86KFsuLFxcXFxkXSspRCk/KD86VD8oPzooWy4sXFxcXGRdKylIKT8oPzooWy4sXFxcXGRdKylNKT8oPzooWy4sXFxcXGRdKylTKT8pPyQnLFxuICBDTUlJbnRlZ2VyOiAnXlxcXFxkKyQnLFxuICBDTUlTSW50ZWdlcjogJ14tPyhbMC05XSspJCcsXG4gIENNSURlY2ltYWw6ICdeLT8oWzAtOV17MSw1fSkoXFxcXC5bMC05XXsxLDE4fSk/JCcsXG4gIENNSUlkZW50aWZpZXI6ICdeXFxcXFN7MSwyNTB9W2EtekEtWjAtOV0kJyxcbiAgQ01JU2hvcnRJZGVudGlmaWVyOiAnXltcXFxcd1xcXFwuXFxcXC1cXFxcX117MSwyNTB9JCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JTG9uZ0lkZW50aWZpZXI6ICdeKD86KD8hdXJuOilcXFxcU3sxLDQwMDB9fHVybjpbQS1aYS16MC05LV17MSwzMX06XFxcXFN7MSw0MDAwfXwuezEsNDAwMH0pJCcsIC8vIG5lZWQgdG8gcmUtZXhhbWluZSB0aGlzXG4gIENNSUZlZWRiYWNrOiAnXi4qJCcsIC8vIFRoaXMgbXVzdCBiZSByZWRlZmluZWRcbiAgQ01JSW5kZXg6ICdbLl9dKFxcXFxkKykuJyxcbiAgQ01JSW5kZXhTdG9yZTogJy5OKFxcXFxkKykuJyxcblxuICAvLyBWb2NhYnVsYXJ5IERhdGEgVHlwZSBEZWZpbml0aW9uXG4gIENNSUNTdGF0dXM6ICdeKGNvbXBsZXRlZHxpbmNvbXBsZXRlfG5vdCBhdHRlbXB0ZWR8dW5rbm93bikkJyxcbiAgQ01JU1N0YXR1czogJ14ocGFzc2VkfGZhaWxlZHx1bmtub3duKSQnLFxuICBDTUlFeGl0OiAnXih0aW1lLW91dHxzdXNwZW5kfGxvZ291dHxub3JtYWwpJCcsXG4gIENNSVR5cGU6ICdeKHRydWUtZmFsc2V8Y2hvaWNlfGZpbGwtaW58bG9uZy1maWxsLWlufG1hdGNoaW5nfHBlcmZvcm1hbmNlfHNlcXVlbmNpbmd8bGlrZXJ0fG51bWVyaWN8b3RoZXIpJCcsXG4gIENNSVJlc3VsdDogJ14oY29ycmVjdHxpbmNvcnJlY3R8dW5hbnRpY2lwYXRlZHxuZXV0cmFsfC0/KFswLTldezEsNH0pKFxcXFwuWzAtOV17MSwxOH0pPykkJyxcbiAgTkFWRXZlbnQ6ICdeKHByZXZpb3VzfGNvbnRpbnVlfGV4aXR8ZXhpdEFsbHxhYmFuZG9ufGFiYW5kb25BbGx8c3VzcGVuZEFsbHxcXHt0YXJnZXQ9XFxcXFN7MCwyMDB9W2EtekEtWjAtOV1cXH1jaG9pY2V8anVtcCkkJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBOQVZCb29sZWFuOiAnXih1bmtub3dufHRydWV8ZmFsc2UkKScsXG4gIE5BVlRhcmdldDogJ14ocHJldmlvdXN8Y29udGludWV8Y2hvaWNlLnt0YXJnZXQ9XFxcXFN7MCwyMDB9W2EtekEtWjAtOV19KSQnLFxuXG4gIC8vIERhdGEgcmFuZ2VzXG4gIHNjYWxlZF9yYW5nZTogJy0xIzEnLFxuICBhdWRpb19yYW5nZTogJzAjKicsXG4gIHNwZWVkX3JhbmdlOiAnMCMqJyxcbiAgdGV4dF9yYW5nZTogJy0xIzEnLFxuICBwcm9ncmVzc19yYW5nZTogJzAjMScsXG59O1xuXG5jb25zdCBSZWdleCA9IHtcbiAgYWljYzogYWljYyxcbiAgc2Nvcm0xMjogc2Nvcm0xMixcbiAgc2Nvcm0yMDA0OiBzY29ybTIwMDQsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZWdleDtcbiIsIi8vIEBmbG93XG5pbXBvcnQgUmVnZXggZnJvbSAnLi9yZWdleCc7XG5cbmNvbnN0IHNjb3JtMjAwNF9yZWdleCA9IFJlZ2V4LnNjb3JtMjAwNDtcblxuY29uc3QgbGVhcm5lciA9IHtcbiAgJ3RydWUtZmFsc2UnOiB7XG4gICAgZm9ybWF0OiAnXnRydWUkfF5mYWxzZSQnLFxuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG4gICdjaG9pY2UnOiB7XG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIG1heDogMzYsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICB1bmlxdWU6IHRydWUsXG4gIH0sXG4gICdmaWxsLWluJzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSUxhbmdTdHJpbmcyNTAsXG4gICAgbWF4OiAxMCxcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG4gICdsb25nLWZpbGwtaW4nOiB7XG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JTGFuZ1N0cmluZzQwMDAsXG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ21hdGNoaW5nJzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBmb3JtYXQyOiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIG1heDogMzYsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICBkZWxpbWl0ZXIyOiAnWy5dJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAncGVyZm9ybWFuY2UnOiB7XG4gICAgZm9ybWF0OiAnXiR8JyArIHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgZm9ybWF0Mjogc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwgKyAnfF4kfCcgK1xuICAgICAgICBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIG1heDogMjUwLFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgZGVsaW1pdGVyMjogJ1suXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ3NlcXVlbmNpbmcnOiB7XG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIG1heDogMzYsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAnbGlrZXJ0Jzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAnbnVtZXJpYyc6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsLFxuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG4gICdvdGhlcic6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTdHJpbmc0MDAwLFxuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG59O1xuXG5jb25zdCBjb3JyZWN0ID0ge1xuICAndHJ1ZS1mYWxzZSc6IHtcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiAnXnRydWUkfF5mYWxzZSQnLFxuICAgIGxpbWl0OiAxLFxuICB9LFxuICAnY2hvaWNlJzoge1xuICAgIG1heDogMzYsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICB1bmlxdWU6IHRydWUsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gIH0sXG4gICdmaWxsLWluJzoge1xuICAgIG1heDogMTAsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JTGFuZ1N0cmluZzI1MGNyLFxuICB9LFxuICAnbG9uZy1maWxsLWluJzoge1xuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiB0cnVlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSUxhbmdTdHJpbmc0MDAwLFxuICB9LFxuICAnbWF0Y2hpbmcnOiB7XG4gICAgbWF4OiAzNixcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIGRlbGltaXRlcjI6ICdbLl0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgZm9ybWF0Mjogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgfSxcbiAgJ3BlcmZvcm1hbmNlJzoge1xuICAgIG1heDogMjUwLFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgZGVsaW1pdGVyMjogJ1suXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogJ14kfCcgKyBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIGZvcm1hdDI6IHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsICsgJ3xeJHwnICtcbiAgICAgICAgc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgfSxcbiAgJ3NlcXVlbmNpbmcnOiB7XG4gICAgbWF4OiAzNixcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gIH0sXG4gICdsaWtlcnQnOiB7XG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBsaW1pdDogMSxcbiAgfSxcbiAgJ251bWVyaWMnOiB7XG4gICAgbWF4OiAyLFxuICAgIGRlbGltaXRlcjogJ1s6XScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwsXG4gICAgbGltaXQ6IDEsXG4gIH0sXG4gICdvdGhlcic6IHtcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU3RyaW5nNDAwMCxcbiAgICBsaW1pdDogMSxcbiAgfSxcbn07XG5cbmNvbnN0IFJlc3BvbnNlcyA9IHtcbiAgbGVhcm5lcjogbGVhcm5lcixcbiAgY29ycmVjdDogY29ycmVjdCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJlc3BvbnNlcztcbiIsIi8vIEBmbG93XG5cbi8qKlxuICogRGF0YSBWYWxpZGF0aW9uIEV4Y2VwdGlvblxuICovXG5leHBvcnQgY2xhc3MgVmFsaWRhdGlvbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgdG8gdGFrZSBpbiBhbiBlcnJvciBtZXNzYWdlIGFuZCBjb2RlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBlcnJvckNvZGVcbiAgICovXG4gIGNvbnN0cnVjdG9yKGVycm9yQ29kZTogbnVtYmVyKSB7XG4gICAgc3VwZXIoZXJyb3JDb2RlKTtcbiAgICB0aGlzLiNlcnJvckNvZGUgPSBlcnJvckNvZGU7XG4gIH1cblxuICAjZXJyb3JDb2RlO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNlcnJvckNvZGVcbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cbiAgZ2V0IGVycm9yQ29kZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jZXJyb3JDb2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyeWluZyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdCBFcnJvciBtZXNzYWdlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBtZXNzYWdlKCkge1xuICAgIHJldHVybiB0aGlzLiNlcnJvckNvZGUgKyAnJztcbiAgfVxufVxuIiwiaW1wb3J0IFNjb3JtMjAwNEFQSSBmcm9tICcuL1Njb3JtMjAwNEFQSSc7XG5pbXBvcnQgU2Nvcm0xMkFQSSBmcm9tICcuL1Njb3JtMTJBUEknO1xuaW1wb3J0IEFJQ0MgZnJvbSAnLi9BSUNDJztcblxud2luZG93LlNjb3JtMTJBUEkgPSBTY29ybTEyQVBJO1xud2luZG93LlNjb3JtMjAwNEFQSSA9IFNjb3JtMjAwNEFQSTtcbndpbmRvdy5BSUNDID0gQUlDQztcbiIsIi8vIEBmbG93XG5leHBvcnQgY29uc3QgU0VDT05EU19QRVJfU0VDT05EID0gMS4wO1xuZXhwb3J0IGNvbnN0IFNFQ09ORFNfUEVSX01JTlVURSA9IDYwO1xuZXhwb3J0IGNvbnN0IFNFQ09ORFNfUEVSX0hPVVIgPSA2MCAqIFNFQ09ORFNfUEVSX01JTlVURTtcbmV4cG9ydCBjb25zdCBTRUNPTkRTX1BFUl9EQVkgPSAyNCAqIFNFQ09ORFNfUEVSX0hPVVI7XG5cbmNvbnN0IGRlc2lnbmF0aW9ucyA9IFtcbiAgWydEJywgU0VDT05EU19QRVJfREFZXSxcbiAgWydIJywgU0VDT05EU19QRVJfSE9VUl0sXG4gIFsnTScsIFNFQ09ORFNfUEVSX01JTlVURV0sXG4gIFsnUycsIFNFQ09ORFNfUEVSX1NFQ09ORF0sXG5dO1xuXG4vKipcbiAqIENvbnZlcnRzIGEgTnVtYmVyIHRvIGEgU3RyaW5nIG9mIEhIOk1NOlNTXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHRvdGFsU2Vjb25kc1xuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2Vjb25kc0FzSEhNTVNTKHRvdGFsU2Vjb25kczogTnVtYmVyKSB7XG4gIC8vIFNDT1JNIHNwZWMgZG9lcyBub3QgZGVhbCB3aXRoIG5lZ2F0aXZlIGR1cmF0aW9ucywgZ2l2ZSB6ZXJvIGJhY2tcbiAgaWYgKCF0b3RhbFNlY29uZHMgfHwgdG90YWxTZWNvbmRzIDw9IDApIHtcbiAgICByZXR1cm4gJzAwOjAwOjAwJztcbiAgfVxuXG4gIGNvbnN0IGhvdXJzID0gTWF0aC5mbG9vcih0b3RhbFNlY29uZHMgLyBTRUNPTkRTX1BFUl9IT1VSKTtcblxuICBjb25zdCBkYXRlT2JqID0gbmV3IERhdGUodG90YWxTZWNvbmRzICogMTAwMCk7XG4gIGNvbnN0IG1pbnV0ZXMgPSBkYXRlT2JqLmdldFVUQ01pbnV0ZXMoKTtcbiAgLy8gbWFrZSBzdXJlIHdlIGFkZCBhbnkgcG9zc2libGUgZGVjaW1hbCB2YWx1ZVxuICBjb25zdCBzZWNvbmRzID0gZGF0ZU9iai5nZXRTZWNvbmRzKCk7XG4gIGNvbnN0IG1zID0gdG90YWxTZWNvbmRzICUgMS4wO1xuICBsZXQgbXNTdHIgPSAnJztcbiAgaWYgKGNvdW50RGVjaW1hbHMobXMpID4gMCkge1xuICAgIGlmIChjb3VudERlY2ltYWxzKG1zKSA+IDIpIHtcbiAgICAgIG1zU3RyID0gbXMudG9GaXhlZCgyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbXNTdHIgPSBTdHJpbmcobXMpO1xuICAgIH1cbiAgICBtc1N0ciA9ICcuJyArIG1zU3RyLnNwbGl0KCcuJylbMV07XG4gIH1cblxuICByZXR1cm4gKGhvdXJzICsgJzonICsgbWludXRlcyArICc6JyArIHNlY29uZHMpLnJlcGxhY2UoL1xcYlxcZFxcYi9nLFxuICAgICAgJzAkJicpICsgbXNTdHI7XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlIHRoZSBudW1iZXIgb2Ygc2Vjb25kcyBmcm9tIElTTyA4NjAxIER1cmF0aW9uXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHNlY29uZHNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNlY29uZHNBc0lTT0R1cmF0aW9uKHNlY29uZHM6IE51bWJlcikge1xuICAvLyBTQ09STSBzcGVjIGRvZXMgbm90IGRlYWwgd2l0aCBuZWdhdGl2ZSBkdXJhdGlvbnMsIGdpdmUgemVybyBiYWNrXG4gIGlmICghc2Vjb25kcyB8fCBzZWNvbmRzIDw9IDApIHtcbiAgICByZXR1cm4gJ1BUMFMnO1xuICB9XG5cbiAgbGV0IGR1cmF0aW9uID0gJ1AnO1xuICBsZXQgcmVtYWluZGVyID0gc2Vjb25kcztcblxuICBkZXNpZ25hdGlvbnMuZm9yRWFjaCgoW3NpZ24sIGN1cnJlbnRfc2Vjb25kc10pID0+IHtcbiAgICBsZXQgdmFsdWUgPSBNYXRoLmZsb29yKHJlbWFpbmRlciAvIGN1cnJlbnRfc2Vjb25kcyk7XG5cbiAgICByZW1haW5kZXIgPSByZW1haW5kZXIgJSBjdXJyZW50X3NlY29uZHM7XG4gICAgaWYgKGNvdW50RGVjaW1hbHMocmVtYWluZGVyKSA+IDIpIHtcbiAgICAgIHJlbWFpbmRlciA9IE51bWJlcihOdW1iZXIocmVtYWluZGVyKS50b0ZpeGVkKDIpKTtcbiAgICB9XG4gICAgLy8gSWYgd2UgaGF2ZSBhbnl0aGluZyBsZWZ0IGluIHRoZSByZW1haW5kZXIsIGFuZCB3ZSdyZSBjdXJyZW50bHkgYWRkaW5nXG4gICAgLy8gc2Vjb25kcyB0byB0aGUgZHVyYXRpb24sIGdvIGFoZWFkIGFuZCBhZGQgdGhlIGRlY2ltYWwgdG8gdGhlIHNlY29uZHNcbiAgICBpZiAoc2lnbiA9PT0gJ1MnICYmIHJlbWFpbmRlciA+IDApIHtcbiAgICAgIHZhbHVlICs9IHJlbWFpbmRlcjtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIGlmICgoZHVyYXRpb24uaW5kZXhPZignRCcpID4gMCB8fFxuICAgICAgICAgIHNpZ24gPT09ICdIJyB8fCBzaWduID09PSAnTScgfHwgc2lnbiA9PT0gJ1MnKSAmJlxuICAgICAgICAgIGR1cmF0aW9uLmluZGV4T2YoJ1QnKSA9PT0gLTEpIHtcbiAgICAgICAgZHVyYXRpb24gKz0gJ1QnO1xuICAgICAgfVxuICAgICAgZHVyYXRpb24gKz0gYCR7dmFsdWV9JHtzaWdufWA7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZHVyYXRpb247XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlIHRoZSBudW1iZXIgb2Ygc2Vjb25kcyBmcm9tIEhIOk1NOlNTLkRERERERFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lU3RyaW5nXG4gKiBAcGFyYW0ge1JlZ0V4cH0gdGltZVJlZ2V4XG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUaW1lQXNTZWNvbmRzKHRpbWVTdHJpbmc6IFN0cmluZywgdGltZVJlZ2V4OiBSZWdFeHApIHtcbiAgaWYgKCF0aW1lU3RyaW5nIHx8IHR5cGVvZiB0aW1lU3RyaW5nICE9PSAnc3RyaW5nJyB8fFxuICAgICAgIXRpbWVTdHJpbmcubWF0Y2godGltZVJlZ2V4KSkge1xuICAgIHJldHVybiAwO1xuICB9XG4gIGNvbnN0IHBhcnRzID0gdGltZVN0cmluZy5zcGxpdCgnOicpO1xuICBjb25zdCBob3VycyA9IE51bWJlcihwYXJ0c1swXSk7XG4gIGNvbnN0IG1pbnV0ZXMgPSBOdW1iZXIocGFydHNbMV0pO1xuICBjb25zdCBzZWNvbmRzID0gTnVtYmVyKHBhcnRzWzJdKTtcbiAgcmV0dXJuIChob3VycyAqIDM2MDApICsgKG1pbnV0ZXMgKiA2MCkgKyBzZWNvbmRzO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZSB0aGUgbnVtYmVyIG9mIHNlY29uZHMgZnJvbSBJU08gODYwMSBEdXJhdGlvblxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBkdXJhdGlvblxuICogQHBhcmFtIHtSZWdFeHB9IGR1cmF0aW9uUmVnZXhcbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldER1cmF0aW9uQXNTZWNvbmRzKGR1cmF0aW9uOiBTdHJpbmcsIGR1cmF0aW9uUmVnZXg6IFJlZ0V4cCkge1xuICBpZiAoIWR1cmF0aW9uIHx8ICFkdXJhdGlvbi5tYXRjaChkdXJhdGlvblJlZ2V4KSkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgY29uc3QgWywgeWVhcnMsIG1vbnRocywgLCBkYXlzLCBob3VycywgbWludXRlcywgc2Vjb25kc10gPSBuZXcgUmVnRXhwKFxuICAgICAgZHVyYXRpb25SZWdleCkuZXhlYyhkdXJhdGlvbikgfHwgW107XG5cbiAgbGV0IHJlc3VsdCA9IDAuMDtcblxuICByZXN1bHQgKz0gKE51bWJlcihzZWNvbmRzKSAqIDEuMCB8fCAwLjApO1xuICByZXN1bHQgKz0gKE51bWJlcihtaW51dGVzKSAqIDYwLjAgfHwgMC4wKTtcbiAgcmVzdWx0ICs9IChOdW1iZXIoaG91cnMpICogMzYwMC4wIHx8IDAuMCk7XG4gIHJlc3VsdCArPSAoTnVtYmVyKGRheXMpICogKDYwICogNjAgKiAyNC4wKSB8fCAwLjApO1xuICByZXN1bHQgKz0gKE51bWJlcih5ZWFycykgKiAoNjAgKiA2MCAqIDI0ICogMzY1LjApIHx8IDAuMCk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBZGRzIHRvZ2V0aGVyIHR3byBJU084NjAxIER1cmF0aW9uIHN0cmluZ3NcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlyc3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWNvbmRcbiAqIEBwYXJhbSB7UmVnRXhwfSBkdXJhdGlvblJlZ2V4XG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRUd29EdXJhdGlvbnMoXG4gICAgZmlyc3Q6IFN0cmluZyxcbiAgICBzZWNvbmQ6IFN0cmluZyxcbiAgICBkdXJhdGlvblJlZ2V4OiBSZWdFeHApIHtcbiAgcmV0dXJuIGdldFNlY29uZHNBc0lTT0R1cmF0aW9uKFxuICAgICAgZ2V0RHVyYXRpb25Bc1NlY29uZHMoZmlyc3QsIGR1cmF0aW9uUmVnZXgpICtcbiAgICAgIGdldER1cmF0aW9uQXNTZWNvbmRzKHNlY29uZCwgZHVyYXRpb25SZWdleCksXG4gICk7XG59XG5cbi8qKlxuICogQWRkIHRvZ2V0aGVyIHR3byBISDpNTTpTUy5ERCBzdHJpbmdzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGZpcnN0XG4gKiBAcGFyYW0ge3N0cmluZ30gc2Vjb25kXG4gKiBAcGFyYW0ge1JlZ0V4cH0gdGltZVJlZ2V4XG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRISE1NU1NUaW1lU3RyaW5ncyhcbiAgICBmaXJzdDogU3RyaW5nLFxuICAgIHNlY29uZDogU3RyaW5nLFxuICAgIHRpbWVSZWdleDogUmVnRXhwKSB7XG4gIHJldHVybiBnZXRTZWNvbmRzQXNISE1NU1MoXG4gICAgICBnZXRUaW1lQXNTZWNvbmRzKGZpcnN0LCB0aW1lUmVnZXgpICtcbiAgICAgIGdldFRpbWVBc1NlY29uZHMoXG4gICAgICAgICAgc2Vjb25kLCB0aW1lUmVnZXgpLFxuICApO1xufVxuXG4vKipcbiAqIEZsYXR0ZW4gYSBKU09OIG9iamVjdCBkb3duIHRvIHN0cmluZyBwYXRocyBmb3IgZWFjaCB2YWx1ZXNcbiAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuKGRhdGEpIHtcbiAgY29uc3QgcmVzdWx0ID0ge307XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2UgdGhyb3VnaCB0aGUgb2JqZWN0XG4gICAqIEBwYXJhbSB7Kn0gY3VyXG4gICAqIEBwYXJhbSB7Kn0gcHJvcFxuICAgKi9cbiAgZnVuY3Rpb24gcmVjdXJzZShjdXIsIHByb3ApIHtcbiAgICBpZiAoT2JqZWN0KGN1cikgIT09IGN1cikge1xuICAgICAgcmVzdWx0W3Byb3BdID0gY3VyO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShjdXIpKSB7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGN1ci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgcmVjdXJzZShjdXJbaV0sIHByb3AgKyAnWycgKyBpICsgJ10nKTtcbiAgICAgICAgaWYgKGwgPT09IDApIHJlc3VsdFtwcm9wXSA9IFtdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgaXNFbXB0eSA9IHRydWU7XG4gICAgICBmb3IgKGNvbnN0IHAgaW4gY3VyKSB7XG4gICAgICAgIGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGN1ciwgcCkpIHtcbiAgICAgICAgICBpc0VtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgcmVjdXJzZShjdXJbcF0sIHByb3AgPyBwcm9wICsgJy4nICsgcCA6IHApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNFbXB0eSAmJiBwcm9wKSByZXN1bHRbcHJvcF0gPSB7fTtcbiAgICB9XG4gIH1cblxuICByZWN1cnNlKGRhdGEsICcnKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBVbi1mbGF0dGVuIGEgZmxhdCBKU09OIG9iamVjdFxuICogQHBhcmFtIHtvYmplY3R9IGRhdGFcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuZmxhdHRlbihkYXRhKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgaWYgKE9iamVjdChkYXRhKSAhPT0gZGF0YSB8fCBBcnJheS5pc0FycmF5KGRhdGEpKSByZXR1cm4gZGF0YTtcbiAgY29uc3QgcmVnZXggPSAvXFwuPyhbXi5bXFxdXSspfFxcWyhcXGQrKV0vZztcbiAgY29uc3QgcmVzdWx0ID0ge307XG4gIGZvciAoY29uc3QgcCBpbiBkYXRhKSB7XG4gICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoZGF0YSwgcCkpIHtcbiAgICAgIGxldCBjdXIgPSByZXN1bHQ7XG4gICAgICBsZXQgcHJvcCA9ICcnO1xuICAgICAgbGV0IG0gPSByZWdleC5leGVjKHApO1xuICAgICAgd2hpbGUgKG0pIHtcbiAgICAgICAgY3VyID0gY3VyW3Byb3BdIHx8IChjdXJbcHJvcF0gPSAobVsyXSA/IFtdIDoge30pKTtcbiAgICAgICAgcHJvcCA9IG1bMl0gfHwgbVsxXTtcbiAgICAgICAgbSA9IHJlZ2V4LmV4ZWMocCk7XG4gICAgICB9XG4gICAgICBjdXJbcHJvcF0gPSBkYXRhW3BdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0WycnXSB8fCByZXN1bHQ7XG59XG5cbi8qKlxuICogQ291bnRzIHRoZSBudW1iZXIgb2YgZGVjaW1hbCBwbGFjZXNcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvdW50RGVjaW1hbHMobnVtOiBudW1iZXIpIHtcbiAgaWYgKE1hdGguZmxvb3IobnVtKSA9PT0gbnVtIHx8IFN0cmluZyhudW0pLmluZGV4T2YoJy4nKSA8IDApIHJldHVybiAwO1xuICBjb25zdCBwYXJ0cyA9IG51bS50b1N0cmluZygpLnNwbGl0KCcuJylbMV07XG4gIHJldHVybiBwYXJ0cy5sZW5ndGggfHwgMDtcbn1cbiJdfQ==
