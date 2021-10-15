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

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

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

},{"./Scorm12API":4,"./cmi/aicc_cmi":5,"./cmi/scorm12_cmi":7}],3:[function(require,module,exports){
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

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

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

    _classPrivateFieldInitSpec(this, _timeout, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _error_codes, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _settings, {
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
        xhrHeaders: {},
        xhrWithCredentials: false,
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

          if (Object.keys(settings.xhrHeaders).length) {
            Object.keys(settings.xhrHeaders).forEach(function (header) {
              httpReq.setRequestHeader(header, settings.xhrHeaders[header]);
            });
          }

          httpReq.withCredentials = settings.xhrWithCredentials;

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

    _classPrivateFieldInitSpec(this, _API, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _cancelled, {
      writable: true,
      value: false
    });

    _classPrivateFieldInitSpec(this, _timeout2, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _callback, {
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

},{"./cmi/common":6,"./constants/api_constants":8,"./constants/error_codes":9,"./exceptions":11,"./utilities":13,"lodash.debounce":1}],4:[function(require,module,exports){
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

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

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

      if (this.apiLogLevel === global_constants.LOG_LEVEL_DEBUG) {
        console.debug('Commit (terminated: ' + (terminateCommit ? 'yes' : 'no') + '): ');
        console.debug(commitObject);
      }

      if (this.settings.lmsCommitUrl) {
        return this.processHttpRequest(this.settings.lmsCommitUrl, commitObject, terminateCommit);
      } else {
        return global_constants.SCORM_TRUE;
      }
    }
  }]);

  return Scorm12API;
}(_BaseAPI2["default"]);

exports["default"] = Scorm12API;

},{"./BaseAPI":3,"./cmi/scorm12_cmi":7,"./constants/api_constants":8,"./constants/error_codes":9,"./utilities":13}],5:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CMITriesObject = exports.CMITries = exports.CMIStudentDemographics = exports.CMIPathsObject = exports.CMIPaths = exports.CMIEvaluationCommentsObject = exports.CMIAttemptRecordsObject = exports.CMIAttemptRecords = exports.CMI = void 0;

var Scorm12CMI = _interopRequireWildcard(require("./scorm12_cmi"));

var _common = require("./common");

var _api_constants = _interopRequireDefault(require("../constants/api_constants"));

var _regex = _interopRequireDefault(require("../constants/regex"));

var _error_codes = _interopRequireDefault(require("../constants/error_codes"));

var _exceptions = require("../exceptions");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

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

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

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

    _classPrivateFieldInitSpec(_assertThisInitialized(_this3), _lesson_type, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this3), _text_color, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this3), _text_location, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this3), _text_size, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this3), _video, {
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

    _classPrivateFieldInitSpec(_assertThisInitialized(_this4), _tries_during_lesson, {
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

    _classPrivateFieldInitSpec(_assertThisInitialized(_this5), _children, {
      writable: true,
      value: aicc_constants.student_demographics_children
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this5), _city, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this5), _class, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this5), _company, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this5), _country, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this5), _experience, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this5), _familiar_name, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this5), _instructor_name, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this5), _title, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this5), _native_language, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this5), _state, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this5), _street_address, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this5), _telephone, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this5), _years_experience, {
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

    _classPrivateFieldInitSpec(_assertThisInitialized(_this6), _location_id, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this6), _date, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this6), _time, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this6), _status, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this6), _why_left, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this6), _time_in_element, {
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

    _classPrivateFieldInitSpec(_assertThisInitialized(_this7), _status2, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this7), _time2, {
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

    _classPrivateFieldInitSpec(_assertThisInitialized(_this8), _lesson_status, {
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

    _classPrivateFieldInitSpec(_assertThisInitialized(_this9), _content, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this9), _location, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this9), _time3, {
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

},{"../constants/api_constants":8,"../constants/error_codes":9,"../constants/regex":10,"../exceptions":11,"./common":6,"./scorm12_cmi":7}],6:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CMIScore = exports.CMIArray = exports.BaseCMI = void 0;
exports.checkValidFormat = checkValidFormat;
exports.checkValidRange = checkValidRange;

var _api_constants = _interopRequireDefault(require("../constants/api_constants"));

var _error_codes = _interopRequireDefault(require("../constants/error_codes"));

var _regex = _interopRequireDefault(require("../constants/regex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

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

    _classPrivateFieldInitSpec(this, _initialized, {
      writable: true,
      value: false
    });

    _classPrivateFieldInitSpec(this, _start_time, {
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

var _error_class = /*#__PURE__*/new WeakMap();

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

    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _children2, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _score_range, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _invalid_error_code, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _invalid_type_code, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _invalid_range_code, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _decimal_regex, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _error_class, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _raw, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _min, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _max, {
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

var _errorClass = /*#__PURE__*/new WeakMap();

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

    _classPrivateFieldInitSpec(_assertThisInitialized(_this2), _errorCode, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this2), _errorClass, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this2), _children3, {
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

},{"../constants/api_constants":8,"../constants/error_codes":9,"../constants/regex":10}],7:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NAV = exports.CMIStudentPreference = exports.CMIStudentData = exports.CMIObjectivesObject = exports.CMIInteractionsObjectivesObject = exports.CMIInteractionsObject = exports.CMIInteractionsCorrectResponsesObject = exports.CMI = void 0;
exports.check12ValidFormat = check12ValidFormat;
exports.check12ValidRange = check12ValidRange;
exports.throwReadOnlyError = throwReadOnlyError;
exports.throwWriteOnlyError = throwWriteOnlyError;

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

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

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

    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _children2, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _version2, {
      writable: true,
      value: '3.4'
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _launch_data, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _comments, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _comments_from_lms, {
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

    _classPrivateFieldInitSpec(_assertThisInitialized(_this2), _children3, {
      writable: true,
      value: scorm12_constants.core_children
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this2), _student_id, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this2), _student_name, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this2), _lesson_location, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this2), _credit, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this2), _lesson_status, {
      writable: true,
      value: 'not attempted'
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this2), _entry, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this2), _total_time, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this2), _lesson_mode, {
      writable: true,
      value: 'normal'
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this2), _exit, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this2), _session_time, {
      writable: true,
      value: '00:00:00'
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this2), _suspend_data, {
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

    _classPrivateFieldInitSpec(_assertThisInitialized(_this3), _children4, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this3), _mastery_score, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this3), _max_time_allowed, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this3), _time_limit_action, {
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

    _classPrivateFieldInitSpec(_assertThisInitialized(_this4), _children5, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this4), _audio, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this4), _language, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this4), _speed, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this4), _text, {
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

    _classPrivateFieldInitSpec(_assertThisInitialized(_this5), _id, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this5), _time, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this5), _type, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this5), _weighting, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this5), _student_response, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this5), _result, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this5), _latency, {
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

    _classPrivateFieldInitSpec(_assertThisInitialized(_this6), _id2, {
      writable: true,
      value: ''
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this6), _status, {
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

    _classPrivateFieldInitSpec(_assertThisInitialized(_this7), _id3, {
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

    _classPrivateFieldInitSpec(_assertThisInitialized(_this8), _pattern, {
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

    _classPrivateFieldInitSpec(_assertThisInitialized(_this9), _event, {
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

},{"../constants/api_constants":8,"../constants/error_codes":9,"../constants/regex":10,"../exceptions":11,"../utilities":13,"./common":6}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationError = exports.Scorm2004ValidationError = exports.Scorm12ValidationError = exports.AICCValidationError = void 0;

var _api_constants = _interopRequireDefault(require("./constants/api_constants"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }

function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }

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

var _errorCode = /*#__PURE__*/new WeakMap();

var _errorMessage = /*#__PURE__*/new WeakMap();

var _detailedMessage = /*#__PURE__*/new WeakMap();

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

    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _errorCode, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _errorMessage, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _detailedMessage, {
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

},{"./constants/api_constants":8}],12:[function(require,module,exports){
"use strict";

var _AICC = _interopRequireDefault(require("../AICC"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

window.AICC = _AICC["default"];

},{"../AICC":2}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SECONDS_PER_SECOND = exports.SECONDS_PER_MINUTE = exports.SECONDS_PER_HOUR = exports.SECONDS_PER_DAY = void 0;
exports.addHHMMSSTimeStrings = addHHMMSSTimeStrings;
exports.addTwoDurations = addTwoDurations;
exports.countDecimals = countDecimals;
exports.flatten = flatten;
exports.getDurationAsSeconds = getDurationAsSeconds;
exports.getSecondsAsHHMMSS = getSecondsAsHHMMSS;
exports.getSecondsAsISODuration = getSecondsAsISODuration;
exports.getTimeAsSeconds = getTimeAsSeconds;
exports.unflatten = unflatten;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

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

},{}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlYm91bmNlL2luZGV4LmpzIiwic3JjL0FJQ0MuanMiLCJzcmMvQmFzZUFQSS5qcyIsInNyYy9TY29ybTEyQVBJLmpzIiwic3JjL2NtaS9haWNjX2NtaS5qcyIsInNyYy9jbWkvY29tbW9uLmpzIiwic3JjL2NtaS9zY29ybTEyX2NtaS5qcyIsInNyYy9jb25zdGFudHMvYXBpX2NvbnN0YW50cy5qcyIsInNyYy9jb25zdGFudHMvZXJyb3JfY29kZXMuanMiLCJzcmMvY29uc3RhbnRzL3JlZ2V4LmpzIiwic3JjL2V4Y2VwdGlvbnMuanMiLCJzcmMvZXhwb3J0cy9haWNjLmpzIiwic3JjL3V0aWxpdGllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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bUNBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBekJXO0FBNkJsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsK0JBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBN0JXO0FBaUNsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUscUNBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBakNXO0FBcUNsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsaUNBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBckNXO0FBeUNsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsa0NBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBekNXO0FBNkNsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsOEJBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBN0NXO0FBaURsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsOEJBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBakRXO0FBcURsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsMEJBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBckRXO0FBeURsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsd0JBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBekRXO0FBNkRsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUscUJBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBN0RXO0FBaUVsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUscUJBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBakVXO0FBcUVsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsd0JBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBckVXO0FBeUVsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsOEJBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBekVXO0FBNkVsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsa0NB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LFFBQUEsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFELENBQUQsSUFBUSxDQUFDLENBQUMsQ0FBRCxDQUFoQjtBQUNBLFFBQUEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFOLENBQVcsQ0FBWCxDQUFKO0FBQ0Q7O0FBQ0QsTUFBQSxHQUFHLENBQUMsSUFBRCxDQUFILEdBQVksSUFBSSxDQUFDLENBQUQsQ0FBaEI7QUFDRDtBQUNGOztBQUNELFNBQU8sTUFBTSxDQUFDLEVBQUQsQ0FBTixJQUFjLE1BQXJCO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTLGFBQVQsQ0FBdUIsR0FBdkIsRUFBb0M7QUFDekMsTUFBSSxJQUFJLENBQUMsS0FBTCxDQUFXLEdBQVgsTUFBb0IsR0FBcEIsSUFBMkIsTUFBTSxDQUFDLEdBQUQsQ0FBTixDQUFZLE9BQVosQ0FBb0IsR0FBcEIsSUFBMkIsQ0FBMUQsRUFBNkQsT0FBTyxDQUFQO0FBQzdELE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxRQUFKLEdBQWUsS0FBZixDQUFxQixHQUFyQixFQUEwQixDQUExQixDQUFkO0FBQ0EsU0FBTyxLQUFLLENBQUMsTUFBTixJQUFnQixDQUF2QjtBQUNEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBsb2Rhc2ggKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pxdWVyeS5vcmcvPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBOQU4gPSAwIC8gMDtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLiAqL1xudmFyIHJlVHJpbSA9IC9eXFxzK3xcXHMrJC9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmFkIHNpZ25lZCBoZXhhZGVjaW1hbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCYWRIZXggPSAvXlstK10weFswLTlhLWZdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJpbmFyeSBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCaW5hcnkgPSAvXjBiWzAxXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvY3RhbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNPY3RhbCA9IC9eMG9bMC03XSskL2k7XG5cbi8qKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB3aXRob3V0IGEgZGVwZW5kZW5jeSBvbiBgcm9vdGAuICovXG52YXIgZnJlZVBhcnNlSW50ID0gcGFyc2VJbnQ7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heCxcbiAgICBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBHZXRzIHRoZSB0aW1lc3RhbXAgb2YgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBoYXZlIGVsYXBzZWQgc2luY2VcbiAqIHRoZSBVbml4IGVwb2NoICgxIEphbnVhcnkgMTk3MCAwMDowMDowMCBVVEMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBEYXRlXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSB0aW1lc3RhbXAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmZXIoZnVuY3Rpb24oc3RhbXApIHtcbiAqICAgY29uc29sZS5sb2coXy5ub3coKSAtIHN0YW1wKTtcbiAqIH0sIF8ubm93KCkpO1xuICogLy8gPT4gTG9ncyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpdCB0b29rIGZvciB0aGUgZGVmZXJyZWQgaW52b2NhdGlvbi5cbiAqL1xudmFyIG5vdyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcm9vdC5EYXRlLm5vdygpO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZGVib3VuY2VkIGZ1bmN0aW9uIHRoYXQgZGVsYXlzIGludm9raW5nIGBmdW5jYCB1bnRpbCBhZnRlciBgd2FpdGBcbiAqIG1pbGxpc2Vjb25kcyBoYXZlIGVsYXBzZWQgc2luY2UgdGhlIGxhc3QgdGltZSB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHdhc1xuICogaW52b2tlZC4gVGhlIGRlYm91bmNlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGAgbWV0aG9kIHRvIGNhbmNlbFxuICogZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG8gaW1tZWRpYXRlbHkgaW52b2tlIHRoZW0uXG4gKiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYCBzaG91bGQgYmUgaW52b2tlZCBvbiB0aGVcbiAqIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YCB0aW1lb3V0LiBUaGUgYGZ1bmNgIGlzIGludm9rZWRcbiAqIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24uIFN1YnNlcXVlbnRcbiAqIGNhbGxzIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgXG4gKiBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLmRlYm91bmNlYCBhbmQgYF8udGhyb3R0bGVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVib3VuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz1mYWxzZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4V2FpdF1cbiAqICBUaGUgbWF4aW11bSB0aW1lIGBmdW5jYCBpcyBhbGxvd2VkIHRvIGJlIGRlbGF5ZWQgYmVmb3JlIGl0J3MgaW52b2tlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZGVib3VuY2VkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBjb3N0bHkgY2FsY3VsYXRpb25zIHdoaWxlIHRoZSB3aW5kb3cgc2l6ZSBpcyBpbiBmbHV4LlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Jlc2l6ZScsIF8uZGVib3VuY2UoY2FsY3VsYXRlTGF5b3V0LCAxNTApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHNlbmRNYWlsYCB3aGVuIGNsaWNrZWQsIGRlYm91bmNpbmcgc3Vic2VxdWVudCBjYWxscy5cbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCBfLmRlYm91bmNlKHNlbmRNYWlsLCAzMDAsIHtcbiAqICAgJ2xlYWRpbmcnOiB0cnVlLFxuICogICAndHJhaWxpbmcnOiBmYWxzZVxuICogfSkpO1xuICpcbiAqIC8vIEVuc3VyZSBgYmF0Y2hMb2dgIGlzIGludm9rZWQgb25jZSBhZnRlciAxIHNlY29uZCBvZiBkZWJvdW5jZWQgY2FsbHMuXG4gKiB2YXIgZGVib3VuY2VkID0gXy5kZWJvdW5jZShiYXRjaExvZywgMjUwLCB7ICdtYXhXYWl0JzogMTAwMCB9KTtcbiAqIHZhciBzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UoJy9zdHJlYW0nKTtcbiAqIGpRdWVyeShzb3VyY2UpLm9uKCdtZXNzYWdlJywgZGVib3VuY2VkKTtcbiAqXG4gKiAvLyBDYW5jZWwgdGhlIHRyYWlsaW5nIGRlYm91bmNlZCBpbnZvY2F0aW9uLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3BvcHN0YXRlJywgZGVib3VuY2VkLmNhbmNlbCk7XG4gKi9cbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGxhc3RBcmdzLFxuICAgICAgbGFzdFRoaXMsXG4gICAgICBtYXhXYWl0LFxuICAgICAgcmVzdWx0LFxuICAgICAgdGltZXJJZCxcbiAgICAgIGxhc3RDYWxsVGltZSxcbiAgICAgIGxhc3RJbnZva2VUaW1lID0gMCxcbiAgICAgIGxlYWRpbmcgPSBmYWxzZSxcbiAgICAgIG1heGluZyA9IGZhbHNlLFxuICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHdhaXQgPSB0b051bWJlcih3YWl0KSB8fCAwO1xuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gISFvcHRpb25zLmxlYWRpbmc7XG4gICAgbWF4aW5nID0gJ21heFdhaXQnIGluIG9wdGlvbnM7XG4gICAgbWF4V2FpdCA9IG1heGluZyA/IG5hdGl2ZU1heCh0b051bWJlcihvcHRpb25zLm1heFdhaXQpIHx8IDAsIHdhaXQpIDogbWF4V2FpdDtcbiAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICB9XG5cbiAgZnVuY3Rpb24gaW52b2tlRnVuYyh0aW1lKSB7XG4gICAgdmFyIGFyZ3MgPSBsYXN0QXJncyxcbiAgICAgICAgdGhpc0FyZyA9IGxhc3RUaGlzO1xuXG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gbGVhZGluZ0VkZ2UodGltZSkge1xuICAgIC8vIFJlc2V0IGFueSBgbWF4V2FpdGAgdGltZXIuXG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIC8vIFN0YXJ0IHRoZSB0aW1lciBmb3IgdGhlIHRyYWlsaW5nIGVkZ2UuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAvLyBJbnZva2UgdGhlIGxlYWRpbmcgZWRnZS5cbiAgICByZXR1cm4gbGVhZGluZyA/IGludm9rZUZ1bmModGltZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiByZW1haW5pbmdXYWl0KHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lLFxuICAgICAgICByZXN1bHQgPSB3YWl0IC0gdGltZVNpbmNlTGFzdENhbGw7XG5cbiAgICByZXR1cm4gbWF4aW5nID8gbmF0aXZlTWluKHJlc3VsdCwgbWF4V2FpdCAtIHRpbWVTaW5jZUxhc3RJbnZva2UpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvdWxkSW52b2tlKHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lO1xuXG4gICAgLy8gRWl0aGVyIHRoaXMgaXMgdGhlIGZpcnN0IGNhbGwsIGFjdGl2aXR5IGhhcyBzdG9wcGVkIGFuZCB3ZSdyZSBhdCB0aGVcbiAgICAvLyB0cmFpbGluZyBlZGdlLCB0aGUgc3lzdGVtIHRpbWUgaGFzIGdvbmUgYmFja3dhcmRzIGFuZCB3ZSdyZSB0cmVhdGluZ1xuICAgIC8vIGl0IGFzIHRoZSB0cmFpbGluZyBlZGdlLCBvciB3ZSd2ZSBoaXQgdGhlIGBtYXhXYWl0YCBsaW1pdC5cbiAgICByZXR1cm4gKGxhc3RDYWxsVGltZSA9PT0gdW5kZWZpbmVkIHx8ICh0aW1lU2luY2VMYXN0Q2FsbCA+PSB3YWl0KSB8fFxuICAgICAgKHRpbWVTaW5jZUxhc3RDYWxsIDwgMCkgfHwgKG1heGluZyAmJiB0aW1lU2luY2VMYXN0SW52b2tlID49IG1heFdhaXQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVyRXhwaXJlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpO1xuICAgIGlmIChzaG91bGRJbnZva2UodGltZSkpIHtcbiAgICAgIHJldHVybiB0cmFpbGluZ0VkZ2UodGltZSk7XG4gICAgfVxuICAgIC8vIFJlc3RhcnQgdGhlIHRpbWVyLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgcmVtYWluaW5nV2FpdCh0aW1lKSk7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFpbGluZ0VkZ2UodGltZSkge1xuICAgIHRpbWVySWQgPSB1bmRlZmluZWQ7XG5cbiAgICAvLyBPbmx5IGludm9rZSBpZiB3ZSBoYXZlIGBsYXN0QXJnc2Agd2hpY2ggbWVhbnMgYGZ1bmNgIGhhcyBiZWVuXG4gICAgLy8gZGVib3VuY2VkIGF0IGxlYXN0IG9uY2UuXG4gICAgaWYgKHRyYWlsaW5nICYmIGxhc3RBcmdzKSB7XG4gICAgICByZXR1cm4gaW52b2tlRnVuYyh0aW1lKTtcbiAgICB9XG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIGlmICh0aW1lcklkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICB9XG4gICAgbGFzdEludm9rZVRpbWUgPSAwO1xuICAgIGxhc3RBcmdzID0gbGFzdENhbGxUaW1lID0gbGFzdFRoaXMgPSB0aW1lcklkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgcmV0dXJuIHRpbWVySWQgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IHRyYWlsaW5nRWRnZShub3coKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKSxcbiAgICAgICAgaXNJbnZva2luZyA9IHNob3VsZEludm9rZSh0aW1lKTtcblxuICAgIGxhc3RBcmdzID0gYXJndW1lbnRzO1xuICAgIGxhc3RUaGlzID0gdGhpcztcbiAgICBsYXN0Q2FsbFRpbWUgPSB0aW1lO1xuXG4gICAgaWYgKGlzSW52b2tpbmcpIHtcbiAgICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGxlYWRpbmdFZGdlKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgICBpZiAobWF4aW5nKSB7XG4gICAgICAgIC8vIEhhbmRsZSBpbnZvY2F0aW9ucyBpbiBhIHRpZ2h0IGxvb3AuXG4gICAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgICAgIHJldHVybiBpbnZva2VGdW5jKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGNhbmNlbDtcbiAgZGVib3VuY2VkLmZsdXNoID0gZmx1c2g7XG4gIHJldHVybiBkZWJvdW5jZWQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlYm91bmNlO1xuIiwiLy8gQGZsb3dcbmltcG9ydCBTY29ybTEyQVBJIGZyb20gJy4vU2Nvcm0xMkFQSSc7XG5pbXBvcnQge1xuICBDTUksXG4gIENNSUF0dGVtcHRSZWNvcmRzT2JqZWN0LFxuICBDTUlFdmFsdWF0aW9uQ29tbWVudHNPYmplY3QsXG4gIENNSVRyaWVzT2JqZWN0LFxufSBmcm9tICcuL2NtaS9haWNjX2NtaSc7XG5pbXBvcnQge05BVn0gZnJvbSAnLi9jbWkvc2Nvcm0xMl9jbWknO1xuXG4vKipcbiAqIFRoZSBBSUNDIEFQSSBjbGFzc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBSUNDIGV4dGVuZHMgU2Nvcm0xMkFQSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciB0byBjcmVhdGUgQUlDQyBBUEkgb2JqZWN0XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IHt9KSB7XG4gICAgY29uc3QgZmluYWxTZXR0aW5ncyA9IHtcbiAgICAgIC4uLntcbiAgICAgICAgbWFzdGVyeV9vdmVycmlkZTogZmFsc2UsXG4gICAgICB9LCAuLi5zZXR0aW5ncyxcbiAgICB9O1xuXG4gICAgc3VwZXIoZmluYWxTZXR0aW5ncyk7XG5cbiAgICB0aGlzLmNtaSA9IG5ldyBDTUkoKTtcbiAgICB0aGlzLm5hdiA9IG5ldyBOQVYoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIG9yIGJ1aWxkcyBhIG5ldyBjaGlsZCBlbGVtZW50IHRvIGFkZCB0byB0aGUgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvdW5kRmlyc3RJbmRleFxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICBnZXRDaGlsZEVsZW1lbnQoQ01JRWxlbWVudCwgdmFsdWUsIGZvdW5kRmlyc3RJbmRleCkge1xuICAgIGxldCBuZXdDaGlsZCA9IHN1cGVyLmdldENoaWxkRWxlbWVudChDTUlFbGVtZW50LCB2YWx1ZSwgZm91bmRGaXJzdEluZGV4KTtcblxuICAgIGlmICghbmV3Q2hpbGQpIHtcbiAgICAgIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ2NtaVxcXFwuZXZhbHVhdGlvblxcXFwuY29tbWVudHNcXFxcLlxcXFxkKycpKSB7XG4gICAgICAgIG5ld0NoaWxkID0gbmV3IENNSUV2YWx1YXRpb25Db21tZW50c09iamVjdCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCxcbiAgICAgICAgICAnY21pXFxcXC5zdHVkZW50X2RhdGFcXFxcLnRyaWVzXFxcXC5cXFxcZCsnKSkge1xuICAgICAgICBuZXdDaGlsZCA9IG5ldyBDTUlUcmllc09iamVjdCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCxcbiAgICAgICAgICAnY21pXFxcXC5zdHVkZW50X2RhdGFcXFxcLmF0dGVtcHRfcmVjb3Jkc1xcXFwuXFxcXGQrJykpIHtcbiAgICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JQXR0ZW1wdFJlY29yZHNPYmplY3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3Q2hpbGQ7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSB0aGUgd2hvbGUgQVBJIHdpdGggYW5vdGhlclxuICAgKlxuICAgKiBAcGFyYW0ge0FJQ0N9IG5ld0FQSVxuICAgKi9cbiAgcmVwbGFjZVdpdGhBbm90aGVyU2Nvcm1BUEkobmV3QVBJKSB7XG4gICAgLy8gRGF0YSBNb2RlbFxuICAgIHRoaXMuY21pID0gbmV3QVBJLmNtaTtcbiAgICB0aGlzLm5hdiA9IG5ld0FQSS5uYXY7XG4gIH1cbn1cbiIsIi8vIEBmbG93XG5pbXBvcnQge0NNSUFycmF5fSBmcm9tICcuL2NtaS9jb21tb24nO1xuaW1wb3J0IHtWYWxpZGF0aW9uRXJyb3J9IGZyb20gJy4vZXhjZXB0aW9ucyc7XG5pbXBvcnQgRXJyb3JDb2RlcyBmcm9tICcuL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuaW1wb3J0IHt1bmZsYXR0ZW59IGZyb20gJy4vdXRpbGl0aWVzJztcbmltcG9ydCBkZWJvdW5jZSBmcm9tICdsb2Rhc2guZGVib3VuY2UnO1xuXG5jb25zdCBnbG9iYWxfY29uc3RhbnRzID0gQVBJQ29uc3RhbnRzLmdsb2JhbDtcbmNvbnN0IHNjb3JtMTJfZXJyb3JfY29kZXMgPSBFcnJvckNvZGVzLnNjb3JtMTI7XG5cbi8qKlxuICogQmFzZSBBUEkgY2xhc3MgZm9yIEFJQ0MsIFNDT1JNIDEuMiwgYW5kIFNDT1JNIDIwMDQuIFNob3VsZCBiZSBjb25zaWRlcmVkXG4gKiBhYnN0cmFjdCwgYW5kIG5ldmVyIGluaXRpYWxpemVkIG9uIGl0J3Mgb3duLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlQVBJIHtcbiAgI3RpbWVvdXQ7XG4gICNlcnJvcl9jb2RlcztcbiAgI3NldHRpbmdzID0ge1xuICAgIGF1dG9jb21taXQ6IGZhbHNlLFxuICAgIGF1dG9jb21taXRTZWNvbmRzOiAxMCxcbiAgICBhc3luY0NvbW1pdDogZmFsc2UsXG4gICAgc2VuZEJlYWNvbkNvbW1pdDogZmFsc2UsXG4gICAgbG1zQ29tbWl0VXJsOiBmYWxzZSxcbiAgICBkYXRhQ29tbWl0Rm9ybWF0OiAnanNvbicsIC8vIHZhbGlkIGZvcm1hdHMgYXJlICdqc29uJyBvciAnZmxhdHRlbmVkJywgJ3BhcmFtcydcbiAgICBjb21taXRSZXF1ZXN0RGF0YVR5cGU6ICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLTgnLFxuICAgIGF1dG9Qcm9ncmVzczogZmFsc2UsXG4gICAgbG9nTGV2ZWw6IGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0VSUk9SLFxuICAgIHNlbGZSZXBvcnRTZXNzaW9uVGltZTogZmFsc2UsXG4gICAgYWx3YXlzU2VuZFRvdGFsVGltZTogZmFsc2UsXG4gICAgc3RyaWN0X2Vycm9yczogdHJ1ZSxcbiAgICB4aHJIZWFkZXJzOiB7fSxcbiAgICB4aHJXaXRoQ3JlZGVudGlhbHM6IGZhbHNlLFxuICAgIHJlc3BvbnNlSGFuZGxlcjogZnVuY3Rpb24oeGhyKSB7XG4gICAgICBsZXQgcmVzdWx0O1xuICAgICAgaWYgKHR5cGVvZiB4aHIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwgfHwgIXt9Lmhhc093blByb3BlcnR5LmNhbGwocmVzdWx0LCAncmVzdWx0JykpIHtcbiAgICAgICAgICByZXN1bHQgPSB7fTtcbiAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICByZXN1bHQucmVzdWx0ID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgICAgICAgICAgcmVzdWx0LmVycm9yQ29kZSA9IDA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdC5yZXN1bHQgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuICAgICAgICAgICAgcmVzdWx0LmVycm9yQ29kZSA9IDEwMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcbiAgfTtcbiAgY21pO1xuICBzdGFydGluZ0RhdGE6IHt9O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQmFzZSBBUEkgY2xhc3MuIFNldHMgc29tZSBzaGFyZWQgQVBJIGZpZWxkcywgYXMgd2VsbCBhc1xuICAgKiBzZXRzIHVwIG9wdGlvbnMgZm9yIHRoZSBBUEkuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBlcnJvcl9jb2Rlc1xuICAgKiBAcGFyYW0ge29iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKGVycm9yX2NvZGVzLCBzZXR0aW5ncykge1xuICAgIGlmIChuZXcudGFyZ2V0ID09PSBCYXNlQVBJKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29uc3RydWN0IEJhc2VBUEkgaW5zdGFuY2VzIGRpcmVjdGx5Jyk7XG4gICAgfVxuICAgIHRoaXMuY3VycmVudFN0YXRlID0gZ2xvYmFsX2NvbnN0YW50cy5TVEFURV9OT1RfSU5JVElBTElaRUQ7XG4gICAgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcbiAgICB0aGlzLmxpc3RlbmVyQXJyYXkgPSBbXTtcblxuICAgIHRoaXMuI3RpbWVvdXQgPSBudWxsO1xuICAgIHRoaXMuI2Vycm9yX2NvZGVzID0gZXJyb3JfY29kZXM7XG5cbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XG4gICAgdGhpcy5hcGlMb2dMZXZlbCA9IHRoaXMuc2V0dGluZ3MubG9nTGV2ZWw7XG4gICAgdGhpcy5zZWxmUmVwb3J0U2Vzc2lvblRpbWUgPSB0aGlzLnNldHRpbmdzLnNlbGZSZXBvcnRTZXNzaW9uVGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBBUElcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gaW5pdGlhbGl6ZU1lc3NhZ2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRlcm1pbmF0aW9uTWVzc2FnZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBpbml0aWFsaXplKFxuICAgICAgY2FsbGJhY2tOYW1lOiBTdHJpbmcsXG4gICAgICBpbml0aWFsaXplTWVzc2FnZT86IFN0cmluZyxcbiAgICAgIHRlcm1pbmF0aW9uTWVzc2FnZT86IFN0cmluZykge1xuICAgIGxldCByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG5cbiAgICBpZiAodGhpcy5pc0luaXRpYWxpemVkKCkpIHtcbiAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHRoaXMuI2Vycm9yX2NvZGVzLklOSVRJQUxJWkVELCBpbml0aWFsaXplTWVzc2FnZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzVGVybWluYXRlZCgpKSB7XG4gICAgICB0aGlzLnRocm93U0NPUk1FcnJvcih0aGlzLiNlcnJvcl9jb2Rlcy5URVJNSU5BVEVELCB0ZXJtaW5hdGlvbk1lc3NhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5zZWxmUmVwb3J0U2Vzc2lvblRpbWUpIHtcbiAgICAgICAgdGhpcy5jbWkuc2V0U3RhcnRUaW1lKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gZ2xvYmFsX2NvbnN0YW50cy5TVEFURV9JTklUSUFMSVpFRDtcbiAgICAgIHRoaXMubGFzdEVycm9yQ29kZSA9IDA7XG4gICAgICByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRTtcbiAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUpO1xuICAgIH1cblxuICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgbnVsbCwgJ3JldHVybmVkOiAnICsgcmV0dXJuVmFsdWUsXG4gICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pO1xuICAgIHRoaXMuY2xlYXJTQ09STUVycm9yKHJldHVyblZhbHVlKTtcblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNlcnJvcl9jb2Rlc1xuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICBnZXQgZXJyb3JfY29kZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2Vycm9yX2NvZGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3NldHRpbmdzXG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIGdldCBzZXR0aW5ncygpIHtcbiAgICByZXR1cm4gdGhpcy4jc2V0dGluZ3M7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc2V0dGluZ3NcbiAgICogQHBhcmFtIHtvYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3M6IE9iamVjdCkge1xuICAgIHRoaXMuI3NldHRpbmdzID0gey4uLnRoaXMuI3NldHRpbmdzLCAuLi5zZXR0aW5nc307XG4gIH1cblxuICAvKipcbiAgICogVGVybWluYXRlcyB0aGUgY3VycmVudCBydW4gb2YgdGhlIEFQSVxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tUZXJtaW5hdGVkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHRlcm1pbmF0ZShcbiAgICAgIGNhbGxiYWNrTmFtZTogU3RyaW5nLFxuICAgICAgY2hlY2tUZXJtaW5hdGVkOiBib29sZWFuKSB7XG4gICAgbGV0IHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcblxuICAgIGlmICh0aGlzLmNoZWNrU3RhdGUoY2hlY2tUZXJtaW5hdGVkLFxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5URVJNSU5BVElPTl9CRUZPUkVfSU5JVCxcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuTVVMVElQTEVfVEVSTUlOQVRJT04pKSB7XG4gICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IGdsb2JhbF9jb25zdGFudHMuU1RBVEVfVEVSTUlOQVRFRDtcblxuICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5zdG9yZURhdGEodHJ1ZSk7XG4gICAgICBpZiAoIXRoaXMuc2V0dGluZ3Muc2VuZEJlYWNvbkNvbW1pdCAmJiAhdGhpcy5zZXR0aW5ncy5hc3luY0NvbW1pdCAmJlxuICAgICAgICAgIHR5cGVvZiByZXN1bHQuZXJyb3JDb2RlICE9PSAndW5kZWZpbmVkJyAmJiByZXN1bHQuZXJyb3JDb2RlID4gMCkge1xuICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihyZXN1bHQuZXJyb3JDb2RlKTtcbiAgICAgIH1cbiAgICAgIHJldHVyblZhbHVlID0gKHR5cGVvZiByZXN1bHQgIT09ICd1bmRlZmluZWQnICYmIHJlc3VsdC5yZXN1bHQpID9cbiAgICAgICAgICByZXN1bHQucmVzdWx0IDogZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcblxuICAgICAgaWYgKGNoZWNrVGVybWluYXRlZCkgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcblxuICAgICAgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUU7XG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcbiAgICB0aGlzLmNsZWFyU0NPUk1FcnJvcihyZXR1cm5WYWx1ZSk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSB2YWx1ZSBvZiB0aGUgQ01JRWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrVGVybWluYXRlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXRWYWx1ZShcbiAgICAgIGNhbGxiYWNrTmFtZTogU3RyaW5nLFxuICAgICAgY2hlY2tUZXJtaW5hdGVkOiBib29sZWFuLFxuICAgICAgQ01JRWxlbWVudDogU3RyaW5nKSB7XG4gICAgbGV0IHJldHVyblZhbHVlO1xuXG4gICAgaWYgKHRoaXMuY2hlY2tTdGF0ZShjaGVja1Rlcm1pbmF0ZWQsXG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLlJFVFJJRVZFX0JFRk9SRV9JTklULFxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5SRVRSSUVWRV9BRlRFUl9URVJNKSkge1xuICAgICAgaWYgKGNoZWNrVGVybWluYXRlZCkgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVyblZhbHVlID0gdGhpcy5nZXRDTUlWYWx1ZShDTUlFbGVtZW50KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBWYWxpZGF0aW9uRXJyb3IpIHtcbiAgICAgICAgICB0aGlzLmxhc3RFcnJvckNvZGUgPSBlLmVycm9yQ29kZTtcbiAgICAgICAgICByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGUubWVzc2FnZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlLm1lc3NhZ2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcih0aGlzLiNlcnJvcl9jb2Rlcy5HRU5FUkFMKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSwgQ01JRWxlbWVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBDTUlFbGVtZW50LCAnOiByZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcbiAgICB0aGlzLmNsZWFyU0NPUk1FcnJvcihyZXR1cm5WYWx1ZSk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIENNSUVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbW1pdENhbGxiYWNrXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tUZXJtaW5hdGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgc2V0VmFsdWUoXG4gICAgICBjYWxsYmFja05hbWU6IFN0cmluZyxcbiAgICAgIGNvbW1pdENhbGxiYWNrOiBTdHJpbmcsXG4gICAgICBjaGVja1Rlcm1pbmF0ZWQ6IGJvb2xlYW4sXG4gICAgICBDTUlFbGVtZW50LFxuICAgICAgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuICAgIH1cbiAgICBsZXQgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuXG4gICAgaWYgKHRoaXMuY2hlY2tTdGF0ZShjaGVja1Rlcm1pbmF0ZWQsIHRoaXMuI2Vycm9yX2NvZGVzLlNUT1JFX0JFRk9SRV9JTklULFxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5TVE9SRV9BRlRFUl9URVJNKSkge1xuICAgICAgaWYgKGNoZWNrVGVybWluYXRlZCkgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVyblZhbHVlID0gdGhpcy5zZXRDTUlWYWx1ZShDTUlFbGVtZW50LCB2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgVmFsaWRhdGlvbkVycm9yKSB7XG4gICAgICAgICAgdGhpcy5sYXN0RXJyb3JDb2RlID0gZS5lcnJvckNvZGU7XG4gICAgICAgICAgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChlLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZS5tZXNzYWdlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IodGhpcy4jZXJyb3JfY29kZXMuR0VORVJBTCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUsIENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAocmV0dXJuVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuICAgIH1cblxuICAgIC8vIElmIHdlIGRpZG4ndCBoYXZlIGFueSBlcnJvcnMgd2hpbGUgc2V0dGluZyB0aGUgZGF0YSwgZ28gYWhlYWQgYW5kXG4gICAgLy8gc2NoZWR1bGUgYSBjb21taXQsIGlmIGF1dG9jb21taXQgaXMgdHVybmVkIG9uXG4gICAgaWYgKFN0cmluZyh0aGlzLmxhc3RFcnJvckNvZGUpID09PSAnMCcpIHtcbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLmF1dG9jb21taXQgJiYgIXRoaXMuI3RpbWVvdXQpIHtcbiAgICAgICAgdGhpcy5zY2hlZHVsZUNvbW1pdCh0aGlzLnNldHRpbmdzLmF1dG9jb21taXRTZWNvbmRzICogMTAwMCwgY29tbWl0Q2FsbGJhY2spO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgQ01JRWxlbWVudCxcbiAgICAgICAgJzogJyArIHZhbHVlICsgJzogcmVzdWx0OiAnICsgcmV0dXJuVmFsdWUsXG4gICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pO1xuICAgIHRoaXMuY2xlYXJTQ09STUVycm9yKHJldHVyblZhbHVlKTtcblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcmRlcnMgTE1TIHRvIHN0b3JlIGFsbCBjb250ZW50IHBhcmFtZXRlcnNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrVGVybWluYXRlZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBjb21taXQoXG4gICAgICBjYWxsYmFja05hbWU6IFN0cmluZyxcbiAgICAgIGNoZWNrVGVybWluYXRlZDogYm9vbGVhbikge1xuICAgIHRoaXMuY2xlYXJTY2hlZHVsZWRDb21taXQoKTtcblxuICAgIGxldCByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG5cbiAgICBpZiAodGhpcy5jaGVja1N0YXRlKGNoZWNrVGVybWluYXRlZCwgdGhpcy4jZXJyb3JfY29kZXMuQ09NTUlUX0JFRk9SRV9JTklULFxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5DT01NSVRfQUZURVJfVEVSTSkpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuc3RvcmVEYXRhKGZhbHNlKTtcbiAgICAgIGlmICghdGhpcy5zZXR0aW5ncy5zZW5kQmVhY29uQ29tbWl0ICYmICF0aGlzLnNldHRpbmdzLmFzeW5jQ29tbWl0ICYmXG4gICAgICAgICAgcmVzdWx0LmVycm9yQ29kZSAmJiByZXN1bHQuZXJyb3JDb2RlID4gMCkge1xuICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihyZXN1bHQuZXJyb3JDb2RlKTtcbiAgICAgIH1cbiAgICAgIHJldHVyblZhbHVlID0gKHR5cGVvZiByZXN1bHQgIT09ICd1bmRlZmluZWQnICYmIHJlc3VsdC5yZXN1bHQpID9cbiAgICAgICAgICByZXN1bHQucmVzdWx0IDogZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcblxuICAgICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCAnSHR0cFJlcXVlc3QnLCAnIFJlc3VsdDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0RFQlVHKTtcblxuICAgICAgaWYgKGNoZWNrVGVybWluYXRlZCkgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcblxuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBudWxsLCAncmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG4gICAgdGhpcy5jbGVhclNDT1JNRXJyb3IocmV0dXJuVmFsdWUpO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgbGFzdCBlcnJvciBjb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0TGFzdEVycm9yKGNhbGxiYWNrTmFtZTogU3RyaW5nKSB7XG4gICAgY29uc3QgcmV0dXJuVmFsdWUgPSBTdHJpbmcodGhpcy5sYXN0RXJyb3JDb2RlKTtcblxuICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUpO1xuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBudWxsLCAncmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZXJyb3JOdW1iZXIgZXJyb3IgZGVzY3JpcHRpb25cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gQ01JRXJyb3JDb2RlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldEVycm9yU3RyaW5nKGNhbGxiYWNrTmFtZTogU3RyaW5nLCBDTUlFcnJvckNvZGUpIHtcbiAgICBsZXQgcmV0dXJuVmFsdWUgPSAnJztcblxuICAgIGlmIChDTUlFcnJvckNvZGUgIT09IG51bGwgJiYgQ01JRXJyb3JDb2RlICE9PSAnJykge1xuICAgICAgcmV0dXJuVmFsdWUgPSB0aGlzLmdldExtc0Vycm9yTWVzc2FnZURldGFpbHMoQ01JRXJyb3JDb2RlKTtcbiAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUpO1xuICAgIH1cblxuICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgbnVsbCwgJ3JldHVybmVkOiAnICsgcmV0dXJuVmFsdWUsXG4gICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBjb21wcmVoZW5zaXZlIGRlc2NyaXB0aW9uIG9mIHRoZSBlcnJvck51bWJlciBlcnJvci5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gQ01JRXJyb3JDb2RlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldERpYWdub3N0aWMoY2FsbGJhY2tOYW1lOiBTdHJpbmcsIENNSUVycm9yQ29kZSkge1xuICAgIGxldCByZXR1cm5WYWx1ZSA9ICcnO1xuXG4gICAgaWYgKENNSUVycm9yQ29kZSAhPT0gbnVsbCAmJiBDTUlFcnJvckNvZGUgIT09ICcnKSB7XG4gICAgICByZXR1cm5WYWx1ZSA9IHRoaXMuZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhDTUlFcnJvckNvZGUsIHRydWUpO1xuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBudWxsLCAncmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHRoZSBMTVMgc3RhdGUgYW5kIGVuc3VyZXMgaXQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tUZXJtaW5hdGVkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiZWZvcmVJbml0RXJyb3JcbiAgICogQHBhcmFtIHtudW1iZXJ9IGFmdGVyVGVybUVycm9yXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBjaGVja1N0YXRlKFxuICAgICAgY2hlY2tUZXJtaW5hdGVkOiBib29sZWFuLFxuICAgICAgYmVmb3JlSW5pdEVycm9yOiBudW1iZXIsXG4gICAgICBhZnRlclRlcm1FcnJvcj86IG51bWJlcikge1xuICAgIGlmICh0aGlzLmlzTm90SW5pdGlhbGl6ZWQoKSkge1xuICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoYmVmb3JlSW5pdEVycm9yKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGNoZWNrVGVybWluYXRlZCAmJiB0aGlzLmlzVGVybWluYXRlZCgpKSB7XG4gICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihhZnRlclRlcm1FcnJvcik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogTG9nZ2luZyBmb3IgYWxsIFNDT1JNIGFjdGlvbnNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZ1bmN0aW9uTmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9nTWVzc2FnZVxuICAgKiBAcGFyYW0ge251bWJlcn1tZXNzYWdlTGV2ZWxcbiAgICovXG4gIGFwaUxvZyhcbiAgICAgIGZ1bmN0aW9uTmFtZTogU3RyaW5nLFxuICAgICAgQ01JRWxlbWVudDogU3RyaW5nLFxuICAgICAgbG9nTWVzc2FnZTogU3RyaW5nLFxuICAgICAgbWVzc2FnZUxldmVsOiBudW1iZXIpIHtcbiAgICBsb2dNZXNzYWdlID0gdGhpcy5mb3JtYXRNZXNzYWdlKGZ1bmN0aW9uTmFtZSwgQ01JRWxlbWVudCwgbG9nTWVzc2FnZSk7XG5cbiAgICBpZiAobWVzc2FnZUxldmVsID49IHRoaXMuYXBpTG9nTGV2ZWwpIHtcbiAgICAgIHN3aXRjaCAobWVzc2FnZUxldmVsKSB7XG4gICAgICAgIGNhc2UgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfRVJST1I6XG4gICAgICAgICAgY29uc29sZS5lcnJvcihsb2dNZXNzYWdlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9XQVJOSU5HOlxuICAgICAgICAgIGNvbnNvbGUud2Fybihsb2dNZXNzYWdlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPOlxuICAgICAgICAgIGNvbnNvbGUuaW5mbyhsb2dNZXNzYWdlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9ERUJVRzpcbiAgICAgICAgICBpZiAoY29uc29sZS5kZWJ1Zykge1xuICAgICAgICAgICAgY29uc29sZS5kZWJ1Zyhsb2dNZXNzYWdlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2cobG9nTWVzc2FnZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGb3JtYXRzIHRoZSBTQ09STSBtZXNzYWdlcyBmb3IgZWFzeSByZWFkaW5nXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmdW5jdGlvbk5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZm9ybWF0TWVzc2FnZShmdW5jdGlvbk5hbWU6IFN0cmluZywgQ01JRWxlbWVudDogU3RyaW5nLCBtZXNzYWdlOiBTdHJpbmcpIHtcbiAgICBjb25zdCBiYXNlTGVuZ3RoID0gMjA7XG4gICAgbGV0IG1lc3NhZ2VTdHJpbmcgPSAnJztcblxuICAgIG1lc3NhZ2VTdHJpbmcgKz0gZnVuY3Rpb25OYW1lO1xuXG4gICAgbGV0IGZpbGxDaGFycyA9IGJhc2VMZW5ndGggLSBtZXNzYWdlU3RyaW5nLmxlbmd0aDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsbENoYXJzOyBpKyspIHtcbiAgICAgIG1lc3NhZ2VTdHJpbmcgKz0gJyAnO1xuICAgIH1cblxuICAgIG1lc3NhZ2VTdHJpbmcgKz0gJzogJztcblxuICAgIGlmIChDTUlFbGVtZW50KSB7XG4gICAgICBjb25zdCBDTUlFbGVtZW50QmFzZUxlbmd0aCA9IDcwO1xuXG4gICAgICBtZXNzYWdlU3RyaW5nICs9IENNSUVsZW1lbnQ7XG5cbiAgICAgIGZpbGxDaGFycyA9IENNSUVsZW1lbnRCYXNlTGVuZ3RoIC0gbWVzc2FnZVN0cmluZy5sZW5ndGg7XG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZmlsbENoYXJzOyBqKyspIHtcbiAgICAgICAgbWVzc2FnZVN0cmluZyArPSAnICc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgIG1lc3NhZ2VTdHJpbmcgKz0gbWVzc2FnZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVzc2FnZVN0cmluZztcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgdG8gc2VlIGlmIHtzdHJ9IGNvbnRhaW5zIHt0ZXN0ZXJ9XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgU3RyaW5nIHRvIGNoZWNrIGFnYWluc3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRlc3RlciBTdHJpbmcgdG8gY2hlY2sgZm9yXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBzdHJpbmdNYXRjaGVzKHN0cjogU3RyaW5nLCB0ZXN0ZXI6IFN0cmluZykge1xuICAgIHJldHVybiBzdHIgJiYgdGVzdGVyICYmIHN0ci5tYXRjaCh0ZXN0ZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHRvIHNlZSBpZiB0aGUgc3BlY2lmaWMgb2JqZWN0IGhhcyB0aGUgZ2l2ZW4gcHJvcGVydHlcbiAgICogQHBhcmFtIHsqfSByZWZPYmplY3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZVxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2NoZWNrT2JqZWN0SGFzUHJvcGVydHkocmVmT2JqZWN0LCBhdHRyaWJ1dGU6IFN0cmluZykge1xuICAgIHJldHVybiBPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChyZWZPYmplY3QsIGF0dHJpYnV0ZSkgfHxcbiAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihcbiAgICAgICAgICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihyZWZPYmplY3QpLCBhdHRyaWJ1dGUpIHx8XG4gICAgICAgIChhdHRyaWJ1dGUgaW4gcmVmT2JqZWN0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtZXNzYWdlIHRoYXQgY29ycmVzcG9uZHMgdG8gZXJyb3JOdW1iZXJcbiAgICogQVBJcyB0aGF0IGluaGVyaXQgQmFzZUFQSSBzaG91bGQgb3ZlcnJpZGUgdGhpcyBmdW5jdGlvblxuICAgKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gX2Vycm9yTnVtYmVyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gX2RldGFpbFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhfZXJyb3JOdW1iZXIsIF9kZXRhaWwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdUaGUgZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyBtZXRob2QgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdmFsdWUgZm9yIHRoZSBzcGVjaWZpYyBlbGVtZW50LlxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0Q01JVmFsdWUoX0NNSUVsZW1lbnQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBnZXRDTUlWYWx1ZSBtZXRob2QgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgZm9yIHRoZSBzcGVjaWZpYyBlbGVtZW50LlxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfQ01JRWxlbWVudFxuICAgKiBAcGFyYW0ge2FueX0gX3ZhbHVlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBzZXRDTUlWYWx1ZShfQ01JRWxlbWVudCwgX3ZhbHVlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgc2V0Q01JVmFsdWUgbWV0aG9kIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNoYXJlZCBBUEkgbWV0aG9kIHRvIHNldCBhIHZhbGlkIGZvciBhIGdpdmVuIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc2Nvcm0yMDA0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgX2NvbW1vblNldENNSVZhbHVlKFxuICAgICAgbWV0aG9kTmFtZTogU3RyaW5nLCBzY29ybTIwMDQ6IGJvb2xlYW4sIENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgaWYgKCFDTUlFbGVtZW50IHx8IENNSUVsZW1lbnQgPT09ICcnKSB7XG4gICAgICByZXR1cm4gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcbiAgICB9XG5cbiAgICBjb25zdCBzdHJ1Y3R1cmUgPSBDTUlFbGVtZW50LnNwbGl0KCcuJyk7XG4gICAgbGV0IHJlZk9iamVjdCA9IHRoaXM7XG4gICAgbGV0IHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcbiAgICBsZXQgZm91bmRGaXJzdEluZGV4ID0gZmFsc2U7XG5cbiAgICBjb25zdCBpbnZhbGlkRXJyb3JNZXNzYWdlID0gYFRoZSBkYXRhIG1vZGVsIGVsZW1lbnQgcGFzc2VkIHRvICR7bWV0aG9kTmFtZX0gKCR7Q01JRWxlbWVudH0pIGlzIG5vdCBhIHZhbGlkIFNDT1JNIGRhdGEgbW9kZWwgZWxlbWVudC5gO1xuICAgIGNvbnN0IGludmFsaWRFcnJvckNvZGUgPSBzY29ybTIwMDQgP1xuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5VTkRFRklORURfREFUQV9NT0RFTCA6XG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLkdFTkVSQUw7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0cnVjdHVyZS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYXR0cmlidXRlID0gc3RydWN0dXJlW2ldO1xuXG4gICAgICBpZiAoaSA9PT0gc3RydWN0dXJlLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgaWYgKHNjb3JtMjAwNCAmJiAoYXR0cmlidXRlLnN1YnN0cigwLCA4KSA9PT0gJ3t0YXJnZXQ9JykgJiZcbiAgICAgICAgICAgICh0eXBlb2YgcmVmT2JqZWN0Ll9pc1RhcmdldFZhbGlkID09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IodGhpcy4jZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQpO1xuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9jaGVja09iamVjdEhhc1Byb3BlcnR5KHJlZk9iamVjdCwgYXR0cmlidXRlKSkge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQoKSAmJlxuICAgICAgICAgICAgICB0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ1xcXFwuY29ycmVjdF9yZXNwb25zZXNcXFxcLlxcXFxkKycpKSB7XG4gICAgICAgICAgICB0aGlzLnZhbGlkYXRlQ29ycmVjdFJlc3BvbnNlKENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXNjb3JtMjAwNCB8fCB0aGlzLmxhc3RFcnJvckNvZGUgPT09IDApIHtcbiAgICAgICAgICAgIHJlZk9iamVjdFthdHRyaWJ1dGVdID0gdmFsdWU7XG4gICAgICAgICAgICByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZk9iamVjdCA9IHJlZk9iamVjdFthdHRyaWJ1dGVdO1xuICAgICAgICBpZiAoIXJlZk9iamVjdCkge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlZk9iamVjdCBpbnN0YW5jZW9mIENNSUFycmF5KSB7XG4gICAgICAgICAgY29uc3QgaW5kZXggPSBwYXJzZUludChzdHJ1Y3R1cmVbaSArIDFdLCAxMCk7XG5cbiAgICAgICAgICAvLyBTQ08gaXMgdHJ5aW5nIHRvIHNldCBhbiBpdGVtIG9uIGFuIGFycmF5XG4gICAgICAgICAgaWYgKCFpc05hTihpbmRleCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSByZWZPYmplY3QuY2hpbGRBcnJheVtpbmRleF07XG5cbiAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgIHJlZk9iamVjdCA9IGl0ZW07XG4gICAgICAgICAgICAgIGZvdW5kRmlyc3RJbmRleCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zdCBuZXdDaGlsZCA9IHRoaXMuZ2V0Q2hpbGRFbGVtZW50KENNSUVsZW1lbnQsIHZhbHVlLFxuICAgICAgICAgICAgICAgICAgZm91bmRGaXJzdEluZGV4KTtcbiAgICAgICAgICAgICAgZm91bmRGaXJzdEluZGV4ID0gdHJ1ZTtcblxuICAgICAgICAgICAgICBpZiAoIW5ld0NoaWxkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoaW52YWxpZEVycm9yQ29kZSwgaW52YWxpZEVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlZk9iamVjdC5pbml0aWFsaXplZCkgbmV3Q2hpbGQuaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgICAgICAgICAgcmVmT2JqZWN0LmNoaWxkQXJyYXkucHVzaChuZXdDaGlsZCk7XG4gICAgICAgICAgICAgICAgcmVmT2JqZWN0ID0gbmV3Q2hpbGQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSGF2ZSB0byB1cGRhdGUgaSB2YWx1ZSB0byBza2lwIHRoZSBhcnJheSBwb3NpdGlvblxuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyZXR1cm5WYWx1ZSA9PT0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRSkge1xuICAgICAgdGhpcy5hcGlMb2cobWV0aG9kTmFtZSwgbnVsbCxcbiAgICAgICAgICBgVGhlcmUgd2FzIGFuIGVycm9yIHNldHRpbmcgdGhlIHZhbHVlIGZvcjogJHtDTUlFbGVtZW50fSwgdmFsdWUgb2Y6ICR7dmFsdWV9YCxcbiAgICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9XQVJOSU5HKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQWJzdHJhY3QgbWV0aG9kIGZvciB2YWxpZGF0aW5nIHRoYXQgYSByZXNwb25zZSBpcyBjb3JyZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX0NNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSBfdmFsdWVcbiAgICovXG4gIHZhbGlkYXRlQ29ycmVjdFJlc3BvbnNlKF9DTUlFbGVtZW50LCBfdmFsdWUpIHtcbiAgICAvLyBqdXN0IGEgc3R1YiBtZXRob2RcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIG9yIGJ1aWxkcyBhIG5ldyBjaGlsZCBlbGVtZW50IHRvIGFkZCB0byB0aGUgYXJyYXkuXG4gICAqIEFQSXMgdGhhdCBpbmhlcml0IEJhc2VBUEkgc2hvdWxkIG92ZXJyaWRlIHRoaXMgbWV0aG9kLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX0NNSUVsZW1lbnQgLSB1bnVzZWRcbiAgICogQHBhcmFtIHsqfSBfdmFsdWUgLSB1bnVzZWRcbiAgICogQHBhcmFtIHtib29sZWFufSBfZm91bmRGaXJzdEluZGV4IC0gdW51c2VkXG4gICAqIEByZXR1cm4geyp9XG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0Q2hpbGRFbGVtZW50KF9DTUlFbGVtZW50LCBfdmFsdWUsIF9mb3VuZEZpcnN0SW5kZXgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBnZXRDaGlsZEVsZW1lbnQgbWV0aG9kIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSB2YWx1ZSBmcm9tIHRoZSBDTUkgT2JqZWN0XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc2Nvcm0yMDA0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBfY29tbW9uR2V0Q01JVmFsdWUobWV0aG9kTmFtZTogU3RyaW5nLCBzY29ybTIwMDQ6IGJvb2xlYW4sIENNSUVsZW1lbnQpIHtcbiAgICBpZiAoIUNNSUVsZW1lbnQgfHwgQ01JRWxlbWVudCA9PT0gJycpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBjb25zdCBzdHJ1Y3R1cmUgPSBDTUlFbGVtZW50LnNwbGl0KCcuJyk7XG4gICAgbGV0IHJlZk9iamVjdCA9IHRoaXM7XG4gICAgbGV0IGF0dHJpYnV0ZSA9IG51bGw7XG5cbiAgICBjb25zdCB1bmluaXRpYWxpemVkRXJyb3JNZXNzYWdlID0gYFRoZSBkYXRhIG1vZGVsIGVsZW1lbnQgcGFzc2VkIHRvICR7bWV0aG9kTmFtZX0gKCR7Q01JRWxlbWVudH0pIGhhcyBub3QgYmVlbiBpbml0aWFsaXplZC5gO1xuICAgIGNvbnN0IGludmFsaWRFcnJvck1lc3NhZ2UgPSBgVGhlIGRhdGEgbW9kZWwgZWxlbWVudCBwYXNzZWQgdG8gJHttZXRob2ROYW1lfSAoJHtDTUlFbGVtZW50fSkgaXMgbm90IGEgdmFsaWQgU0NPUk0gZGF0YSBtb2RlbCBlbGVtZW50LmA7XG4gICAgY29uc3QgaW52YWxpZEVycm9yQ29kZSA9IHNjb3JtMjAwNCA/XG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLlVOREVGSU5FRF9EQVRBX01PREVMIDpcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuR0VORVJBTDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RydWN0dXJlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhdHRyaWJ1dGUgPSBzdHJ1Y3R1cmVbaV07XG5cbiAgICAgIGlmICghc2Nvcm0yMDA0KSB7XG4gICAgICAgIGlmIChpID09PSBzdHJ1Y3R1cmUubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGlmICghdGhpcy5fY2hlY2tPYmplY3RIYXNQcm9wZXJ0eShyZWZPYmplY3QsIGF0dHJpYnV0ZSkpIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKChTdHJpbmcoYXR0cmlidXRlKS5zdWJzdHIoMCwgOCkgPT09ICd7dGFyZ2V0PScpICYmXG4gICAgICAgICAgICAodHlwZW9mIHJlZk9iamVjdC5faXNUYXJnZXRWYWxpZCA9PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICAgIGNvbnN0IHRhcmdldCA9IFN0cmluZyhhdHRyaWJ1dGUpLlxuICAgICAgICAgICAgICBzdWJzdHIoOCwgU3RyaW5nKGF0dHJpYnV0ZSkubGVuZ3RoIC0gOSk7XG4gICAgICAgICAgcmV0dXJuIHJlZk9iamVjdC5faXNUYXJnZXRWYWxpZCh0YXJnZXQpO1xuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9jaGVja09iamVjdEhhc1Byb3BlcnR5KHJlZk9iamVjdCwgYXR0cmlidXRlKSkge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZWZPYmplY3QgPSByZWZPYmplY3RbYXR0cmlidXRlXTtcbiAgICAgIGlmIChyZWZPYmplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihpbnZhbGlkRXJyb3JDb2RlLCBpbnZhbGlkRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWZPYmplY3QgaW5zdGFuY2VvZiBDTUlBcnJheSkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KHN0cnVjdHVyZVtpICsgMV0sIDEwKTtcblxuICAgICAgICAvLyBTQ08gaXMgdHJ5aW5nIHRvIHNldCBhbiBpdGVtIG9uIGFuIGFycmF5XG4gICAgICAgIGlmICghaXNOYU4oaW5kZXgpKSB7XG4gICAgICAgICAgY29uc3QgaXRlbSA9IHJlZk9iamVjdC5jaGlsZEFycmF5W2luZGV4XTtcblxuICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICByZWZPYmplY3QgPSBpdGVtO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcih0aGlzLiNlcnJvcl9jb2Rlcy5WQUxVRV9OT1RfSU5JVElBTElaRUQsXG4gICAgICAgICAgICAgICAgdW5pbml0aWFsaXplZEVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBIYXZlIHRvIHVwZGF0ZSBpIHZhbHVlIHRvIHNraXAgdGhlIGFycmF5IHBvc2l0aW9uXG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJlZk9iamVjdCA9PT0gbnVsbCB8fCByZWZPYmplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKCFzY29ybTIwMDQpIHtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZSA9PT0gJ19jaGlsZHJlbicpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTEyX2Vycm9yX2NvZGVzLkNISUxEUkVOX0VSUk9SKTtcbiAgICAgICAgfSBlbHNlIGlmIChhdHRyaWJ1dGUgPT09ICdfY291bnQnKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0xMl9lcnJvcl9jb2Rlcy5DT1VOVF9FUlJPUik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlZk9iamVjdDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBBUEkncyBjdXJyZW50IHN0YXRlIGlzIFNUQVRFX0lOSVRJQUxJWkVEXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBpc0luaXRpYWxpemVkKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9PT0gZ2xvYmFsX2NvbnN0YW50cy5TVEFURV9JTklUSUFMSVpFRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIEFQSSdzIGN1cnJlbnQgc3RhdGUgaXMgU1RBVEVfTk9UX0lOSVRJQUxJWkVEXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBpc05vdEluaXRpYWxpemVkKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9PT0gZ2xvYmFsX2NvbnN0YW50cy5TVEFURV9OT1RfSU5JVElBTElaRUQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBBUEkncyBjdXJyZW50IHN0YXRlIGlzIFNUQVRFX1RFUk1JTkFURURcbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGlzVGVybWluYXRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUgPT09IGdsb2JhbF9jb25zdGFudHMuU1RBVEVfVEVSTUlOQVRFRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBhIG1lY2hhbmlzbSBmb3IgYXR0YWNoaW5nIHRvIGEgc3BlY2lmaWMgU0NPUk0gZXZlbnRcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxpc3RlbmVyTmFtZVxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb24obGlzdGVuZXJOYW1lOiBTdHJpbmcsIGNhbGxiYWNrOiBmdW5jdGlvbikge1xuICAgIGlmICghY2FsbGJhY2spIHJldHVybjtcblxuICAgIGNvbnN0IGxpc3RlbmVyRnVuY3Rpb25zID0gbGlzdGVuZXJOYW1lLnNwbGl0KCcgJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0ZW5lckZ1bmN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbGlzdGVuZXJTcGxpdCA9IGxpc3RlbmVyRnVuY3Rpb25zW2ldLnNwbGl0KCcuJyk7XG4gICAgICBpZiAobGlzdGVuZXJTcGxpdC5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgICAgY29uc3QgZnVuY3Rpb25OYW1lID0gbGlzdGVuZXJTcGxpdFswXTtcblxuICAgICAgbGV0IENNSUVsZW1lbnQgPSBudWxsO1xuICAgICAgaWYgKGxpc3RlbmVyU3BsaXQubGVuZ3RoID4gMSkge1xuICAgICAgICBDTUlFbGVtZW50ID0gbGlzdGVuZXJOYW1lLnJlcGxhY2UoZnVuY3Rpb25OYW1lICsgJy4nLCAnJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGlzdGVuZXJBcnJheS5wdXNoKHtcbiAgICAgICAgZnVuY3Rpb25OYW1lOiBmdW5jdGlvbk5hbWUsXG4gICAgICAgIENNSUVsZW1lbnQ6IENNSUVsZW1lbnQsXG4gICAgICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmFwaUxvZygnb24nLCBmdW5jdGlvbk5hbWUsIGBBZGRlZCBldmVudCBsaXN0ZW5lcjogJHt0aGlzLmxpc3RlbmVyQXJyYXkubGVuZ3RofWAsIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBhIG1lY2hhbmlzbSBmb3IgZGV0YWNoaW5nIGEgc3BlY2lmaWMgU0NPUk0gZXZlbnQgbGlzdGVuZXJcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxpc3RlbmVyTmFtZVxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb2ZmKGxpc3RlbmVyTmFtZTogU3RyaW5nLCBjYWxsYmFjazogZnVuY3Rpb24pIHtcbiAgICBpZiAoIWNhbGxiYWNrKSByZXR1cm47XG5cbiAgICBjb25zdCBsaXN0ZW5lckZ1bmN0aW9ucyA9IGxpc3RlbmVyTmFtZS5zcGxpdCgnICcpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdGVuZXJGdW5jdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGxpc3RlbmVyU3BsaXQgPSBsaXN0ZW5lckZ1bmN0aW9uc1tpXS5zcGxpdCgnLicpO1xuICAgICAgaWYgKGxpc3RlbmVyU3BsaXQubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IGZ1bmN0aW9uTmFtZSA9IGxpc3RlbmVyU3BsaXRbMF07XG5cbiAgICAgIGxldCBDTUlFbGVtZW50ID0gbnVsbDtcbiAgICAgIGlmIChsaXN0ZW5lclNwbGl0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgQ01JRWxlbWVudCA9IGxpc3RlbmVyTmFtZS5yZXBsYWNlKGZ1bmN0aW9uTmFtZSArICcuJywgJycpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZW1vdmVJbmRleCA9IHRoaXMubGlzdGVuZXJBcnJheS5maW5kSW5kZXgoKG9iaikgPT5cbiAgICAgICAgb2JqLmZ1bmN0aW9uTmFtZSA9PT0gZnVuY3Rpb25OYW1lICYmXG4gICAgICAgIG9iai5DTUlFbGVtZW50ID09PSBDTUlFbGVtZW50ICYmXG4gICAgICAgIG9iai5jYWxsYmFjayA9PT0gY2FsbGJhY2tcbiAgICAgICk7XG4gICAgICBpZiAocmVtb3ZlSW5kZXggIT09IC0xKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJBcnJheS5zcGxpY2UocmVtb3ZlSW5kZXgsIDEpO1xuICAgICAgICB0aGlzLmFwaUxvZygnb2ZmJywgZnVuY3Rpb25OYW1lLCBgUmVtb3ZlZCBldmVudCBsaXN0ZW5lcjogJHt0aGlzLmxpc3RlbmVyQXJyYXkubGVuZ3RofWAsIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBhIG1lY2hhbmlzbSBmb3IgY2xlYXJpbmcgYWxsIGxpc3RlbmVycyBmcm9tIGEgc3BlY2lmaWMgU0NPUk0gZXZlbnRcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxpc3RlbmVyTmFtZVxuICAgKi9cbiAgY2xlYXIobGlzdGVuZXJOYW1lOiBTdHJpbmcpIHtcbiAgICBjb25zdCBsaXN0ZW5lckZ1bmN0aW9ucyA9IGxpc3RlbmVyTmFtZS5zcGxpdCgnICcpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdGVuZXJGdW5jdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGxpc3RlbmVyU3BsaXQgPSBsaXN0ZW5lckZ1bmN0aW9uc1tpXS5zcGxpdCgnLicpO1xuICAgICAgaWYgKGxpc3RlbmVyU3BsaXQubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IGZ1bmN0aW9uTmFtZSA9IGxpc3RlbmVyU3BsaXRbMF07XG5cbiAgICAgIGxldCBDTUlFbGVtZW50ID0gbnVsbDtcbiAgICAgIGlmIChsaXN0ZW5lclNwbGl0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgQ01JRWxlbWVudCA9IGxpc3RlbmVyTmFtZS5yZXBsYWNlKGZ1bmN0aW9uTmFtZSArICcuJywgJycpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmxpc3RlbmVyQXJyYXkgPSB0aGlzLmxpc3RlbmVyQXJyYXkuZmlsdGVyKChvYmopID0+XG4gICAgICAgIG9iai5mdW5jdGlvbk5hbWUgIT09IGZ1bmN0aW9uTmFtZSAmJlxuICAgICAgICBvYmouQ01JRWxlbWVudCAhPT0gQ01JRWxlbWVudCxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByb2Nlc3NlcyBhbnkgJ29uJyBsaXN0ZW5lcnMgdGhhdCBoYXZlIGJlZW4gY3JlYXRlZFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZnVuY3Rpb25OYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICovXG4gIHByb2Nlc3NMaXN0ZW5lcnMoZnVuY3Rpb25OYW1lOiBTdHJpbmcsIENNSUVsZW1lbnQ6IFN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIHRoaXMuYXBpTG9nKGZ1bmN0aW9uTmFtZSwgQ01JRWxlbWVudCwgdmFsdWUpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saXN0ZW5lckFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IHRoaXMubGlzdGVuZXJBcnJheVtpXTtcbiAgICAgIGNvbnN0IGZ1bmN0aW9uc01hdGNoID0gbGlzdGVuZXIuZnVuY3Rpb25OYW1lID09PSBmdW5jdGlvbk5hbWU7XG4gICAgICBjb25zdCBsaXN0ZW5lckhhc0NNSUVsZW1lbnQgPSAhIWxpc3RlbmVyLkNNSUVsZW1lbnQ7XG4gICAgICBsZXQgQ01JRWxlbWVudHNNYXRjaCA9IGZhbHNlO1xuICAgICAgaWYgKENNSUVsZW1lbnQgJiYgbGlzdGVuZXIuQ01JRWxlbWVudCAmJlxuICAgICAgICAgIGxpc3RlbmVyLkNNSUVsZW1lbnQuc3Vic3RyaW5nKGxpc3RlbmVyLkNNSUVsZW1lbnQubGVuZ3RoIC0gMSkgPT09XG4gICAgICAgICAgJyonKSB7XG4gICAgICAgIENNSUVsZW1lbnRzTWF0Y2ggPSBDTUlFbGVtZW50LmluZGV4T2YobGlzdGVuZXIuQ01JRWxlbWVudC5zdWJzdHJpbmcoMCxcbiAgICAgICAgICAgIGxpc3RlbmVyLkNNSUVsZW1lbnQubGVuZ3RoIC0gMSkpID09PSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgQ01JRWxlbWVudHNNYXRjaCA9IGxpc3RlbmVyLkNNSUVsZW1lbnQgPT09IENNSUVsZW1lbnQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChmdW5jdGlvbnNNYXRjaCAmJiAoIWxpc3RlbmVySGFzQ01JRWxlbWVudCB8fCBDTUlFbGVtZW50c01hdGNoKSkge1xuICAgICAgICBsaXN0ZW5lci5jYWxsYmFjayhDTUlFbGVtZW50LCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRocm93cyBhIFNDT1JNIGVycm9yXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBlcnJvck51bWJlclxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuICAgKi9cbiAgdGhyb3dTQ09STUVycm9yKGVycm9yTnVtYmVyOiBudW1iZXIsIG1lc3NhZ2U6IFN0cmluZykge1xuICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgbWVzc2FnZSA9IHRoaXMuZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhlcnJvck51bWJlcik7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coJ3Rocm93U0NPUk1FcnJvcicsIG51bGwsIGVycm9yTnVtYmVyICsgJzogJyArIG1lc3NhZ2UsXG4gICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0VSUk9SKTtcblxuICAgIHRoaXMubGFzdEVycm9yQ29kZSA9IFN0cmluZyhlcnJvck51bWJlcik7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBsYXN0IFNDT1JNIGVycm9yIGNvZGUgb24gc3VjY2Vzcy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN1Y2Nlc3NcbiAgICovXG4gIGNsZWFyU0NPUk1FcnJvcihzdWNjZXNzOiBTdHJpbmcpIHtcbiAgICBpZiAoc3VjY2VzcyAhPT0gdW5kZWZpbmVkICYmIHN1Y2Nlc3MgIT09IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0UpIHtcbiAgICAgIHRoaXMubGFzdEVycm9yQ29kZSA9IDA7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHRzIHRvIHN0b3JlIHRoZSBkYXRhIHRvIHRoZSBMTVMsIGxvZ3MgZGF0YSBpZiBubyBMTVMgY29uZmlndXJlZFxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gX2NhbGN1bGF0ZVRvdGFsVGltZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgc3RvcmVEYXRhKF9jYWxjdWxhdGVUb3RhbFRpbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdUaGUgc3RvcmVEYXRhIG1ldGhvZCBoYXMgbm90IGJlZW4gaW1wbGVtZW50ZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIHRoZSBDTUkgZnJvbSBhIGZsYXR0ZW5lZCBKU09OIG9iamVjdFxuICAgKiBAcGFyYW0ge29iamVjdH0ganNvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKi9cbiAgbG9hZEZyb21GbGF0dGVuZWRKU09OKGpzb24sIENNSUVsZW1lbnQpIHtcbiAgICBpZiAoIXRoaXMuaXNOb3RJbml0aWFsaXplZCgpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICdsb2FkRnJvbUZsYXR0ZW5lZEpTT04gY2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSB0aGUgY2FsbCB0byBsbXNJbml0aWFsaXplLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRlc3QgbWF0Y2ggcGF0dGVybi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNcbiAgICAgKiBAcGFyYW0ge1JlZ0V4cH0gYV9wYXR0ZXJuXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRlc3RQYXR0ZXJuKGEsIGMsIGFfcGF0dGVybikge1xuICAgICAgY29uc3QgYV9tYXRjaCA9IGEubWF0Y2goYV9wYXR0ZXJuKTtcblxuICAgICAgbGV0IGNfbWF0Y2g7XG4gICAgICBpZiAoYV9tYXRjaCAhPT0gbnVsbCAmJiAoY19tYXRjaCA9IGMubWF0Y2goYV9wYXR0ZXJuKSkgIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgYV9udW0gPSBOdW1iZXIoYV9tYXRjaFsyXSk7XG4gICAgICAgIGNvbnN0IGNfbnVtID0gTnVtYmVyKGNfbWF0Y2hbMl0pO1xuICAgICAgICBpZiAoYV9udW0gPT09IGNfbnVtKSB7XG4gICAgICAgICAgaWYgKGFfbWF0Y2hbM10gPT09ICdpZCcpIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFfbWF0Y2hbM10gPT09ICd0eXBlJykge1xuICAgICAgICAgICAgaWYgKGNfbWF0Y2hbM10gPT09ICdpZCcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYV9udW0gLSBjX251bTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgaW50X3BhdHRlcm4gPSAvXihjbWlcXC5pbnRlcmFjdGlvbnNcXC4pKFxcZCspXFwuKC4qKSQvO1xuICAgIGNvbnN0IG9ial9wYXR0ZXJuID0gL14oY21pXFwub2JqZWN0aXZlc1xcLikoXFxkKylcXC4oLiopJC87XG5cbiAgICBjb25zdCByZXN1bHQgPSBPYmplY3Qua2V5cyhqc29uKS5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gW1N0cmluZyhrZXkpLCBqc29uW2tleV1dO1xuICAgIH0pO1xuXG4gICAgLy8gQ01JIGludGVyYWN0aW9ucyBuZWVkIHRvIGhhdmUgaWQgYW5kIHR5cGUgbG9hZGVkIGJlZm9yZSBhbnkgb3RoZXIgZmllbGRzXG4gICAgcmVzdWx0LnNvcnQoZnVuY3Rpb24oW2EsIGJdLCBbYywgZF0pIHtcbiAgICAgIGxldCB0ZXN0O1xuICAgICAgaWYgKCh0ZXN0ID0gdGVzdFBhdHRlcm4oYSwgYywgaW50X3BhdHRlcm4pKSAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGVzdDtcbiAgICAgIH1cbiAgICAgIGlmICgodGVzdCA9IHRlc3RQYXR0ZXJuKGEsIGMsIG9ial9wYXR0ZXJuKSkgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRlc3Q7XG4gICAgICB9XG5cbiAgICAgIGlmIChhIDwgYykge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICBpZiAoYSA+IGMpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9KTtcblxuICAgIGxldCBvYmo7XG4gICAgcmVzdWx0LmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIG9iaiA9IHt9O1xuICAgICAgb2JqW2VsZW1lbnRbMF1dID0gZWxlbWVudFsxXTtcbiAgICAgIHRoaXMubG9hZEZyb21KU09OKHVuZmxhdHRlbihvYmopLCBDTUlFbGVtZW50KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkcyBDTUkgZGF0YSBmcm9tIGEgSlNPTiBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBqc29uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqL1xuICBsb2FkRnJvbUpTT04oanNvbiwgQ01JRWxlbWVudCkge1xuICAgIGlmICghdGhpcy5pc05vdEluaXRpYWxpemVkKCkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgJ2xvYWRGcm9tSlNPTiBjYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlIHRoZSBjYWxsIHRvIGxtc0luaXRpYWxpemUuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgQ01JRWxlbWVudCA9IENNSUVsZW1lbnQgIT09IHVuZGVmaW5lZCA/IENNSUVsZW1lbnQgOiAnY21pJztcblxuICAgIHRoaXMuc3RhcnRpbmdEYXRhID0ganNvbjtcblxuICAgIC8vIGNvdWxkIHRoaXMgYmUgcmVmYWN0b3JlZCBkb3duIHRvIGZsYXR0ZW4oanNvbikgdGhlbiBzZXRDTUlWYWx1ZSBvbiBlYWNoP1xuICAgIGZvciAoY29uc3Qga2V5IGluIGpzb24pIHtcbiAgICAgIGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGpzb24sIGtleSkgJiYganNvbltrZXldKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRDTUlFbGVtZW50ID0gKENNSUVsZW1lbnQgPyBDTUlFbGVtZW50ICsgJy4nIDogJycpICsga2V5O1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGpzb25ba2V5XTtcblxuICAgICAgICBpZiAodmFsdWVbJ2NoaWxkQXJyYXknXSkge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVbJ2NoaWxkQXJyYXknXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5sb2FkRnJvbUpTT04odmFsdWVbJ2NoaWxkQXJyYXknXVtpXSxcbiAgICAgICAgICAgICAgICBjdXJyZW50Q01JRWxlbWVudCArICcuJyArIGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB7XG4gICAgICAgICAgdGhpcy5sb2FkRnJvbUpTT04odmFsdWUsIGN1cnJlbnRDTUlFbGVtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldENNSVZhbHVlKGN1cnJlbnRDTUlFbGVtZW50LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBDTUkgb2JqZWN0IHRvIEpTT04gZm9yIHNlbmRpbmcgdG8gYW4gTE1TLlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICByZW5kZXJDTUlUb0pTT05TdHJpbmcoKSB7XG4gICAgY29uc3QgY21pID0gdGhpcy5jbWk7XG4gICAgLy8gRG8gd2Ugd2FudC9uZWVkIHRvIHJldHVybiBmaWVsZHMgdGhhdCBoYXZlIG5vIHNldCB2YWx1ZT9cbiAgICAvLyByZXR1cm4gSlNPTi5zdHJpbmdpZnkoeyBjbWkgfSwgKGssIHYpID0+IHYgPT09IHVuZGVmaW5lZCA/IG51bGwgOiB2LCAyKTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoe2NtaX0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBKUyBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjdXJyZW50IGNtaVxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICByZW5kZXJDTUlUb0pTT05PYmplY3QoKSB7XG4gICAgLy8gRG8gd2Ugd2FudC9uZWVkIHRvIHJldHVybiBmaWVsZHMgdGhhdCBoYXZlIG5vIHNldCB2YWx1ZT9cbiAgICAvLyByZXR1cm4gSlNPTi5zdHJpbmdpZnkoeyBjbWkgfSwgKGssIHYpID0+IHYgPT09IHVuZGVmaW5lZCA/IG51bGwgOiB2LCAyKTtcbiAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLnJlbmRlckNNSVRvSlNPTlN0cmluZygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGNtaSBvYmplY3QgdG8gdGhlIHByb3BlciBmb3JtYXQgZm9yIExNUyBjb21taXRcbiAgICogQVBJcyB0aGF0IGluaGVyaXQgQmFzZUFQSSBzaG91bGQgb3ZlcnJpZGUgdGhpcyBmdW5jdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IF90ZXJtaW5hdGVDb21taXRcbiAgICogQHJldHVybiB7Kn1cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICByZW5kZXJDb21taXRDTUkoX3Rlcm1pbmF0ZUNvbW1pdCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ1RoZSBzdG9yZURhdGEgbWV0aG9kIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgdGhlIHJlcXVlc3QgdG8gdGhlIExNU1xuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAqIEBwYXJhbSB7b2JqZWN0fEFycmF5fSBwYXJhbXNcbiAgICogQHBhcmFtIHtib29sZWFufSBpbW1lZGlhdGVcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cbiAgcHJvY2Vzc0h0dHBSZXF1ZXN0KHVybDogU3RyaW5nLCBwYXJhbXMsIGltbWVkaWF0ZSA9IGZhbHNlKSB7XG4gICAgY29uc3QgYXBpID0gdGhpcztcbiAgICBjb25zdCBwcm9jZXNzID0gZnVuY3Rpb24odXJsLCBwYXJhbXMsIHNldHRpbmdzLCBlcnJvcl9jb2Rlcykge1xuICAgICAgY29uc3QgZ2VuZXJpY0Vycm9yID0ge1xuICAgICAgICAncmVzdWx0JzogZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRSxcbiAgICAgICAgJ2Vycm9yQ29kZSc6IGVycm9yX2NvZGVzLkdFTkVSQUwsXG4gICAgICB9O1xuXG4gICAgICBsZXQgcmVzdWx0O1xuICAgICAgaWYgKCFzZXR0aW5ncy5zZW5kQmVhY29uQ29tbWl0KSB7XG4gICAgICAgIGNvbnN0IGh0dHBSZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgaHR0cFJlcS5vcGVuKCdQT1NUJywgdXJsLCBzZXR0aW5ncy5hc3luY0NvbW1pdCk7XG5cbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHNldHRpbmdzLnhockhlYWRlcnMpLmxlbmd0aCkge1xuICAgICAgICAgIE9iamVjdC5rZXlzKHNldHRpbmdzLnhockhlYWRlcnMpLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgICAgICAgaHR0cFJlcS5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgc2V0dGluZ3MueGhySGVhZGVyc1toZWFkZXJdKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGh0dHBSZXEud2l0aENyZWRlbnRpYWxzID0gc2V0dGluZ3MueGhyV2l0aENyZWRlbnRpYWxzO1xuXG4gICAgICAgIGlmIChzZXR0aW5ncy5hc3luY0NvbW1pdCkge1xuICAgICAgICAgIGh0dHBSZXEub25sb2FkID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzZXR0aW5ncy5yZXNwb25zZUhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgcmVzdWx0ID0gc2V0dGluZ3MucmVzcG9uc2VIYW5kbGVyKGh0dHBSZXEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShodHRwUmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChwYXJhbXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgaHR0cFJlcS5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLFxuICAgICAgICAgICAgICAgICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcbiAgICAgICAgICAgIGh0dHBSZXEuc2VuZChwYXJhbXMuam9pbignJicpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaHR0cFJlcS5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLFxuICAgICAgICAgICAgICAgIHNldHRpbmdzLmNvbW1pdFJlcXVlc3REYXRhVHlwZSk7XG4gICAgICAgICAgICBodHRwUmVxLnNlbmQoSlNPTi5zdHJpbmdpZnkocGFyYW1zKSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFzZXR0aW5ncy5hc3luY0NvbW1pdCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzZXR0aW5ncy5yZXNwb25zZUhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgcmVzdWx0ID0gc2V0dGluZ3MucmVzcG9uc2VIYW5kbGVyKGh0dHBSZXEpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZShodHRwUmVxLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHt9O1xuICAgICAgICAgICAgcmVzdWx0LnJlc3VsdCA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRTtcbiAgICAgICAgICAgIHJlc3VsdC5lcnJvckNvZGUgPSAwO1xuICAgICAgICAgICAgYXBpLnByb2Nlc3NMaXN0ZW5lcnMoJ0NvbW1pdFN1Y2Nlc3MnKTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICBhcGkucHJvY2Vzc0xpc3RlbmVycygnQ29tbWl0RXJyb3InKTtcbiAgICAgICAgICByZXR1cm4gZ2VuZXJpY0Vycm9yO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGhlYWRlcnMgPSB7XG4gICAgICAgICAgICB0eXBlOiBzZXR0aW5ncy5jb21taXRSZXF1ZXN0RGF0YVR5cGUsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBsZXQgYmxvYjtcbiAgICAgICAgICBpZiAocGFyYW1zIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGJsb2IgPSBuZXcgQmxvYihbcGFyYW1zLmpvaW4oJyYnKV0sIGhlYWRlcnMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBibG9iID0gbmV3IEJsb2IoW0pTT04uc3RyaW5naWZ5KHBhcmFtcyldLCBoZWFkZXJzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXN1bHQgPSB7fTtcbiAgICAgICAgICBpZiAobmF2aWdhdG9yLnNlbmRCZWFjb24odXJsLCBibG9iKSkge1xuICAgICAgICAgICAgcmVzdWx0LnJlc3VsdCA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRTtcbiAgICAgICAgICAgIHJlc3VsdC5lcnJvckNvZGUgPSAwO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQucmVzdWx0ID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcbiAgICAgICAgICAgIHJlc3VsdC5lcnJvckNvZGUgPSAxMDE7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICBhcGkucHJvY2Vzc0xpc3RlbmVycygnQ29tbWl0RXJyb3InKTtcbiAgICAgICAgICByZXR1cm4gZ2VuZXJpY0Vycm9yO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBhcGkucHJvY2Vzc0xpc3RlbmVycygnQ29tbWl0RXJyb3InKTtcbiAgICAgICAgcmV0dXJuIGdlbmVyaWNFcnJvcjtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3VsdC5yZXN1bHQgPT09IHRydWUgfHxcbiAgICAgICAgICByZXN1bHQucmVzdWx0ID09PSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUUpIHtcbiAgICAgICAgYXBpLnByb2Nlc3NMaXN0ZW5lcnMoJ0NvbW1pdFN1Y2Nlc3MnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFwaS5wcm9jZXNzTGlzdGVuZXJzKCdDb21taXRFcnJvcicpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICBpZiAodHlwZW9mIGRlYm91bmNlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc3QgZGVib3VuY2VkID0gZGVib3VuY2UocHJvY2VzcywgNTAwKTtcbiAgICAgIGRlYm91bmNlZCh1cmwsIHBhcmFtcywgdGhpcy5zZXR0aW5ncywgdGhpcy5lcnJvcl9jb2Rlcyk7XG5cbiAgICAgIC8vIGlmIHdlJ3JlIHRlcm1pbmF0aW5nLCBnbyBhaGVhZCBhbmQgY29tbWl0IGltbWVkaWF0ZWx5XG4gICAgICBpZiAoaW1tZWRpYXRlKSB7XG4gICAgICAgIGRlYm91bmNlZC5mbHVzaCgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICByZXN1bHQ6IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRSxcbiAgICAgICAgZXJyb3JDb2RlOiAwLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHByb2Nlc3ModXJsLCBwYXJhbXMsIHRoaXMuc2V0dGluZ3MsIHRoaXMuZXJyb3JfY29kZXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaHJvd3MgYSBTQ09STSBlcnJvclxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gd2hlbiAtIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHdhaXQgYmVmb3JlIGNvbW1pdHRpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrIC0gdGhlIG5hbWUgb2YgdGhlIGNvbW1pdCBldmVudCBjYWxsYmFja1xuICAgKi9cbiAgc2NoZWR1bGVDb21taXQod2hlbjogbnVtYmVyLCBjYWxsYmFjazogc3RyaW5nKSB7XG4gICAgdGhpcy4jdGltZW91dCA9IG5ldyBTY2hlZHVsZWRDb21taXQodGhpcywgd2hlbiwgY2FsbGJhY2spO1xuICAgIHRoaXMuYXBpTG9nKCdzY2hlZHVsZUNvbW1pdCcsICcnLCAnc2NoZWR1bGVkJyxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfREVCVUcpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyBhbmQgY2FuY2VscyBhbnkgY3VycmVudGx5IHNjaGVkdWxlZCBjb21taXRzXG4gICAqL1xuICBjbGVhclNjaGVkdWxlZENvbW1pdCgpIHtcbiAgICBpZiAodGhpcy4jdGltZW91dCkge1xuICAgICAgdGhpcy4jdGltZW91dC5jYW5jZWwoKTtcbiAgICAgIHRoaXMuI3RpbWVvdXQgPSBudWxsO1xuICAgICAgdGhpcy5hcGlMb2coJ2NsZWFyU2NoZWR1bGVkQ29tbWl0JywgJycsICdjbGVhcmVkJyxcbiAgICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9ERUJVRyk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUHJpdmF0ZSBjbGFzcyB0aGF0IHdyYXBzIGEgdGltZW91dCBjYWxsIHRvIHRoZSBjb21taXQoKSBmdW5jdGlvblxuICovXG5jbGFzcyBTY2hlZHVsZWRDb21taXQge1xuICAjQVBJO1xuICAjY2FuY2VsbGVkID0gZmFsc2U7XG4gICN0aW1lb3V0O1xuICAjY2FsbGJhY2s7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBTY2hlZHVsZWRDb21taXRcbiAgICogQHBhcmFtIHtCYXNlQVBJfSBBUElcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdoZW5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrXG4gICAqL1xuICBjb25zdHJ1Y3RvcihBUEk6IGFueSwgd2hlbjogbnVtYmVyLCBjYWxsYmFjazogc3RyaW5nKSB7XG4gICAgdGhpcy4jQVBJID0gQVBJO1xuICAgIHRoaXMuI3RpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMud3JhcHBlci5iaW5kKHRoaXMpLCB3aGVuKTtcbiAgICB0aGlzLiNjYWxsYmFjayA9IGNhbGxiYWNrO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbmNlbCBhbnkgY3VycmVudGx5IHNjaGVkdWxlZCBjb21taXRcbiAgICovXG4gIGNhbmNlbCgpIHtcbiAgICB0aGlzLiNjYW5jZWxsZWQgPSB0cnVlO1xuICAgIGlmICh0aGlzLiN0aW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy4jdGltZW91dCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFdyYXAgdGhlIEFQSSBjb21taXQgY2FsbCB0byBjaGVjayBpZiB0aGUgY2FsbCBoYXMgYWxyZWFkeSBiZWVuIGNhbmNlbGxlZFxuICAgKi9cbiAgd3JhcHBlcigpIHtcbiAgICBpZiAoIXRoaXMuI2NhbmNlbGxlZCkge1xuICAgICAgdGhpcy4jQVBJLmNvbW1pdCh0aGlzLiNjYWxsYmFjayk7XG4gICAgfVxuICB9XG59XG4iLCIvLyBAZmxvd1xuaW1wb3J0IEJhc2VBUEkgZnJvbSAnLi9CYXNlQVBJJztcbmltcG9ydCB7XG4gIENNSSxcbiAgQ01JSW50ZXJhY3Rpb25zQ29ycmVjdFJlc3BvbnNlc09iamVjdCxcbiAgQ01JSW50ZXJhY3Rpb25zT2JqZWN0LFxuICBDTUlJbnRlcmFjdGlvbnNPYmplY3RpdmVzT2JqZWN0LFxuICBDTUlPYmplY3RpdmVzT2JqZWN0LCBOQVYsXG59IGZyb20gJy4vY21pL3Njb3JtMTJfY21pJztcbmltcG9ydCAqIGFzIFV0aWxpdGllcyBmcm9tICcuL3V0aWxpdGllcyc7XG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuaW1wb3J0IEVycm9yQ29kZXMgZnJvbSAnLi9jb25zdGFudHMvZXJyb3JfY29kZXMnO1xuXG5jb25zdCBzY29ybTEyX2NvbnN0YW50cyA9IEFQSUNvbnN0YW50cy5zY29ybTEyO1xuY29uc3QgZ2xvYmFsX2NvbnN0YW50cyA9IEFQSUNvbnN0YW50cy5nbG9iYWw7XG5jb25zdCBzY29ybTEyX2Vycm9yX2NvZGVzID0gRXJyb3JDb2Rlcy5zY29ybTEyO1xuXG4vKipcbiAqIEFQSSBjbGFzcyBmb3IgU0NPUk0gMS4yXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjb3JtMTJBUEkgZXh0ZW5kcyBCYXNlQVBJIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBTQ09STSAxLjIgQVBJXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IHt9KSB7XG4gICAgY29uc3QgZmluYWxTZXR0aW5ncyA9IHtcbiAgICAgIC4uLntcbiAgICAgICAgbWFzdGVyeV9vdmVycmlkZTogZmFsc2UsXG4gICAgICB9LCAuLi5zZXR0aW5ncyxcbiAgICB9O1xuXG4gICAgc3VwZXIoc2Nvcm0xMl9lcnJvcl9jb2RlcywgZmluYWxTZXR0aW5ncyk7XG5cbiAgICB0aGlzLmNtaSA9IG5ldyBDTUkoKTtcbiAgICB0aGlzLm5hdiA9IG5ldyBOQVYoKTtcblxuICAgIC8vIFJlbmFtZSBmdW5jdGlvbnMgdG8gbWF0Y2ggMS4yIFNwZWMgYW5kIGV4cG9zZSB0byBtb2R1bGVzXG4gICAgdGhpcy5MTVNJbml0aWFsaXplID0gdGhpcy5sbXNJbml0aWFsaXplO1xuICAgIHRoaXMuTE1TRmluaXNoID0gdGhpcy5sbXNGaW5pc2g7XG4gICAgdGhpcy5MTVNHZXRWYWx1ZSA9IHRoaXMubG1zR2V0VmFsdWU7XG4gICAgdGhpcy5MTVNTZXRWYWx1ZSA9IHRoaXMubG1zU2V0VmFsdWU7XG4gICAgdGhpcy5MTVNDb21taXQgPSB0aGlzLmxtc0NvbW1pdDtcbiAgICB0aGlzLkxNU0dldExhc3RFcnJvciA9IHRoaXMubG1zR2V0TGFzdEVycm9yO1xuICAgIHRoaXMuTE1TR2V0RXJyb3JTdHJpbmcgPSB0aGlzLmxtc0dldEVycm9yU3RyaW5nO1xuICAgIHRoaXMuTE1TR2V0RGlhZ25vc3RpYyA9IHRoaXMubG1zR2V0RGlhZ25vc3RpYztcbiAgfVxuXG4gIC8qKlxuICAgKiBsbXNJbml0aWFsaXplIGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSBib29sXG4gICAqL1xuICBsbXNJbml0aWFsaXplKCkge1xuICAgIHRoaXMuY21pLmluaXRpYWxpemUoKTtcbiAgICByZXR1cm4gdGhpcy5pbml0aWFsaXplKCdMTVNJbml0aWFsaXplJywgJ0xNUyB3YXMgYWxyZWFkeSBpbml0aWFsaXplZCEnLFxuICAgICAgICAnTE1TIGlzIGFscmVhZHkgZmluaXNoZWQhJyk7XG4gIH1cblxuICAvKipcbiAgICogTE1TRmluaXNoIGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSBib29sXG4gICAqL1xuICBsbXNGaW5pc2goKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy50ZXJtaW5hdGUoJ0xNU0ZpbmlzaCcsIHRydWUpO1xuXG4gICAgaWYgKHJlc3VsdCA9PT0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFKSB7XG4gICAgICBpZiAodGhpcy5uYXYuZXZlbnQgIT09ICcnKSB7XG4gICAgICAgIGlmICh0aGlzLm5hdi5ldmVudCA9PT0gJ2NvbnRpbnVlJykge1xuICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VOZXh0Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZVByZXZpb3VzJyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zZXR0aW5ncy5hdXRvUHJvZ3Jlc3MpIHtcbiAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZU5leHQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIExNU0dldFZhbHVlIGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zR2V0VmFsdWUoQ01JRWxlbWVudCkge1xuICAgIHJldHVybiB0aGlzLmdldFZhbHVlKCdMTVNHZXRWYWx1ZScsIGZhbHNlLCBDTUlFbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMTVNTZXRWYWx1ZSBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zU2V0VmFsdWUoQ01JRWxlbWVudCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5zZXRWYWx1ZSgnTE1TU2V0VmFsdWUnLCAnTE1TQ29tbWl0JywgZmFsc2UsIENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMTVNDb21taXQgZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJvb2xcbiAgICovXG4gIGxtc0NvbW1pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb21taXQoJ0xNU0NvbW1pdCcsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMTVNHZXRMYXN0RXJyb3IgZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXRMYXN0RXJyb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TGFzdEVycm9yKCdMTVNHZXRMYXN0RXJyb3InKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMTVNHZXRFcnJvclN0cmluZyBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFcnJvckNvZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zR2V0RXJyb3JTdHJpbmcoQ01JRXJyb3JDb2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RXJyb3JTdHJpbmcoJ0xNU0dldEVycm9yU3RyaW5nJywgQ01JRXJyb3JDb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMTVNHZXREaWFnbm9zdGljIGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVycm9yQ29kZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXREaWFnbm9zdGljKENNSUVycm9yQ29kZSkge1xuICAgIHJldHVybiB0aGlzLmdldERpYWdub3N0aWMoJ0xNU0dldERpYWdub3N0aWMnLCBDTUlFcnJvckNvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSB2YWx1ZSBvbiB0aGUgQ01JIE9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHNldENNSVZhbHVlKENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbW1vblNldENNSVZhbHVlKCdMTVNTZXRWYWx1ZScsIGZhbHNlLCBDTUlFbGVtZW50LCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHZhbHVlIGZyb20gdGhlIENNSSBPYmplY3RcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldENNSVZhbHVlKENNSUVsZW1lbnQpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tbW9uR2V0Q01JVmFsdWUoJ2dldENNSVZhbHVlJywgZmFsc2UsIENNSUVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgb3IgYnVpbGRzIGEgbmV3IGNoaWxkIGVsZW1lbnQgdG8gYWRkIHRvIHRoZSBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvdW5kRmlyc3RJbmRleFxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICBnZXRDaGlsZEVsZW1lbnQoQ01JRWxlbWVudCwgdmFsdWUsIGZvdW5kRmlyc3RJbmRleCkge1xuICAgIGxldCBuZXdDaGlsZDtcblxuICAgIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ2NtaVxcXFwub2JqZWN0aXZlc1xcXFwuXFxcXGQrJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSU9iamVjdGl2ZXNPYmplY3QoKTtcbiAgICB9IGVsc2UgaWYgKGZvdW5kRmlyc3RJbmRleCAmJiB0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCxcbiAgICAgICAgJ2NtaVxcXFwuaW50ZXJhY3Rpb25zXFxcXC5cXFxcZCtcXFxcLmNvcnJlY3RfcmVzcG9uc2VzXFxcXC5cXFxcZCsnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JSW50ZXJhY3Rpb25zQ29ycmVjdFJlc3BvbnNlc09iamVjdCgpO1xuICAgIH0gZWxzZSBpZiAoZm91bmRGaXJzdEluZGV4ICYmIHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LFxuICAgICAgICAnY21pXFxcXC5pbnRlcmFjdGlvbnNcXFxcLlxcXFxkK1xcXFwub2JqZWN0aXZlc1xcXFwuXFxcXGQrJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSUludGVyYWN0aW9uc09iamVjdGl2ZXNPYmplY3QoKTtcbiAgICB9IGVsc2UgaWYgKCFmb3VuZEZpcnN0SW5kZXggJiZcbiAgICAgICAgdGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsICdjbWlcXFxcLmludGVyYWN0aW9uc1xcXFwuXFxcXGQrJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSUludGVyYWN0aW9uc09iamVjdCgpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXdDaGlsZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZXMgQ29ycmVjdCBSZXNwb25zZSB2YWx1ZXNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgdmFsaWRhdGVDb3JyZWN0UmVzcG9uc2UoQ01JRWxlbWVudCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtZXNzYWdlIHRoYXQgY29ycmVzcG9uZHMgdG8gZXJyb3JOdW1iZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gZXJyb3JOdW1iZXJcbiAgICogQHBhcmFtIHtib29sZWFufSBkZXRhaWxcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhlcnJvck51bWJlciwgZGV0YWlsKSB7XG4gICAgbGV0IGJhc2ljTWVzc2FnZSA9ICdObyBFcnJvcic7XG4gICAgbGV0IGRldGFpbE1lc3NhZ2UgPSAnTm8gRXJyb3InO1xuXG4gICAgLy8gU2V0IGVycm9yIG51bWJlciB0byBzdHJpbmcgc2luY2UgaW5jb25zaXN0ZW50IGZyb20gbW9kdWxlcyBpZiBzdHJpbmcgb3IgbnVtYmVyXG4gICAgZXJyb3JOdW1iZXIgPSBTdHJpbmcoZXJyb3JOdW1iZXIpO1xuICAgIGlmIChzY29ybTEyX2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbZXJyb3JOdW1iZXJdKSB7XG4gICAgICBiYXNpY01lc3NhZ2UgPSBzY29ybTEyX2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbZXJyb3JOdW1iZXJdLmJhc2ljTWVzc2FnZTtcbiAgICAgIGRldGFpbE1lc3NhZ2UgPSBzY29ybTEyX2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbZXJyb3JOdW1iZXJdLmRldGFpbE1lc3NhZ2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRldGFpbCA/IGRldGFpbE1lc3NhZ2UgOiBiYXNpY01lc3NhZ2U7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSB0aGUgd2hvbGUgQVBJIHdpdGggYW5vdGhlclxuICAgKlxuICAgKiBAcGFyYW0ge1Njb3JtMTJBUEl9IG5ld0FQSVxuICAgKi9cbiAgcmVwbGFjZVdpdGhBbm90aGVyU2Nvcm1BUEkobmV3QVBJKSB7XG4gICAgLy8gRGF0YSBNb2RlbFxuICAgIHRoaXMuY21pID0gbmV3QVBJLmNtaTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGNtaSBvYmplY3QgdG8gdGhlIHByb3BlciBmb3JtYXQgZm9yIExNUyBjb21taXRcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSB0ZXJtaW5hdGVDb21taXRcbiAgICogQHJldHVybiB7b2JqZWN0fEFycmF5fVxuICAgKi9cbiAgcmVuZGVyQ29tbWl0Q01JKHRlcm1pbmF0ZUNvbW1pdDogYm9vbGVhbikge1xuICAgIGNvbnN0IGNtaUV4cG9ydCA9IHRoaXMucmVuZGVyQ01JVG9KU09OT2JqZWN0KCk7XG5cbiAgICBpZiAodGVybWluYXRlQ29tbWl0KSB7XG4gICAgICBjbWlFeHBvcnQuY21pLmNvcmUudG90YWxfdGltZSA9IHRoaXMuY21pLmdldEN1cnJlbnRUb3RhbFRpbWUoKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICBjb25zdCBmbGF0dGVuZWQgPSBVdGlsaXRpZXMuZmxhdHRlbihjbWlFeHBvcnQpO1xuICAgIHN3aXRjaCAodGhpcy5zZXR0aW5ncy5kYXRhQ29tbWl0Rm9ybWF0KSB7XG4gICAgICBjYXNlICdmbGF0dGVuZWQnOlxuICAgICAgICByZXR1cm4gVXRpbGl0aWVzLmZsYXR0ZW4oY21pRXhwb3J0KTtcbiAgICAgIGNhc2UgJ3BhcmFtcyc6XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBpbiBmbGF0dGVuZWQpIHtcbiAgICAgICAgICBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChmbGF0dGVuZWQsIGl0ZW0pKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChgJHtpdGVtfT0ke2ZsYXR0ZW5lZFtpdGVtXX1gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIGNhc2UgJ2pzb24nOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGNtaUV4cG9ydDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdHMgdG8gc3RvcmUgdGhlIGRhdGEgdG8gdGhlIExNU1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHRlcm1pbmF0ZUNvbW1pdFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBzdG9yZURhdGEodGVybWluYXRlQ29tbWl0OiBib29sZWFuKSB7XG4gICAgaWYgKHRlcm1pbmF0ZUNvbW1pdCkge1xuICAgICAgY29uc3Qgb3JpZ2luYWxTdGF0dXMgPSB0aGlzLmNtaS5jb3JlLmxlc3Nvbl9zdGF0dXM7XG4gICAgICBpZiAob3JpZ2luYWxTdGF0dXMgPT09ICdub3QgYXR0ZW1wdGVkJykge1xuICAgICAgICB0aGlzLmNtaS5jb3JlLmxlc3Nvbl9zdGF0dXMgPSAnY29tcGxldGVkJztcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY21pLmNvcmUubGVzc29uX21vZGUgPT09ICdub3JtYWwnKSB7XG4gICAgICAgIGlmICh0aGlzLmNtaS5jb3JlLmNyZWRpdCA9PT0gJ2NyZWRpdCcpIHtcbiAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5tYXN0ZXJ5X292ZXJyaWRlICYmXG4gICAgICAgICAgICAgIHRoaXMuY21pLnN0dWRlbnRfZGF0YS5tYXN0ZXJ5X3Njb3JlICE9PSAnJyAmJlxuICAgICAgICAgICAgICB0aGlzLmNtaS5jb3JlLnNjb3JlLnJhdyAhPT0gJycpIHtcbiAgICAgICAgICAgIGlmIChwYXJzZUZsb2F0KHRoaXMuY21pLmNvcmUuc2NvcmUucmF3KSA+PSBwYXJzZUZsb2F0KHRoaXMuY21pLnN0dWRlbnRfZGF0YS5tYXN0ZXJ5X3Njb3JlKSkge1xuICAgICAgICAgICAgICB0aGlzLmNtaS5jb3JlLmxlc3Nvbl9zdGF0dXMgPSAncGFzc2VkJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuY21pLmNvcmUubGVzc29uX3N0YXR1cyA9ICdmYWlsZWQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNtaS5jb3JlLmxlc3Nvbl9tb2RlID09PSAnYnJvd3NlJykge1xuICAgICAgICBpZiAoKHRoaXMuc3RhcnRpbmdEYXRhPy5jbWk/LmNvcmU/Lmxlc3Nvbl9zdGF0dXMgfHwgJycpID09PSAnJyAmJiBvcmlnaW5hbFN0YXR1cyA9PT0gJ25vdCBhdHRlbXB0ZWQnKSB7XG4gICAgICAgICAgdGhpcy5jbWkuY29yZS5sZXNzb25fc3RhdHVzID0gJ2Jyb3dzZWQnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY29tbWl0T2JqZWN0ID0gdGhpcy5yZW5kZXJDb21taXRDTUkodGVybWluYXRlQ29tbWl0IHx8XG4gICAgICAgIHRoaXMuc2V0dGluZ3MuYWx3YXlzU2VuZFRvdGFsVGltZSk7XG5cbiAgICBpZiAodGhpcy5hcGlMb2dMZXZlbCA9PT0gZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfREVCVUcpIHtcbiAgICAgIGNvbnNvbGUuZGVidWcoJ0NvbW1pdCAodGVybWluYXRlZDogJyArICh0ZXJtaW5hdGVDb21taXQgPyAneWVzJyA6ICdubycpICsgJyk6ICcpO1xuICAgICAgY29uc29sZS5kZWJ1Zyhjb21taXRPYmplY3QpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5sbXNDb21taXRVcmwpIHtcbiAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NIdHRwUmVxdWVzdCh0aGlzLnNldHRpbmdzLmxtc0NvbW1pdFVybCwgY29tbWl0T2JqZWN0LCB0ZXJtaW5hdGVDb21taXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgU2Nvcm0xMkNNSSBmcm9tICcuL3Njb3JtMTJfY21pJztcbmltcG9ydCB7QmFzZUNNSSwgY2hlY2tWYWxpZEZvcm1hdCwgQ01JQXJyYXksIENNSVNjb3JlfSBmcm9tICcuL2NvbW1vbic7XG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCBSZWdleCBmcm9tICcuLi9jb25zdGFudHMvcmVnZXgnO1xuaW1wb3J0IEVycm9yQ29kZXMgZnJvbSAnLi4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJztcbmltcG9ydCB7QUlDQ1ZhbGlkYXRpb25FcnJvcn0gZnJvbSAnLi4vZXhjZXB0aW9ucyc7XG5cbmNvbnN0IGFpY2NfY29uc3RhbnRzID0gQVBJQ29uc3RhbnRzLmFpY2M7XG5jb25zdCBhaWNjX3JlZ2V4ID0gUmVnZXguYWljYztcbmNvbnN0IGFpY2NfZXJyb3JfY29kZXMgPSBFcnJvckNvZGVzLnNjb3JtMTI7XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgUmVhZCBPbmx5IGVycm9yXG4gKi9cbmZ1bmN0aW9uIHRocm93UmVhZE9ubHlFcnJvcigpIHtcbiAgdGhyb3cgbmV3IEFJQ0NWYWxpZGF0aW9uRXJyb3IoYWljY19lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCwgbm8gcmVhc29uIHRvIGhhdmUgdG8gcGFzcyB0aGUgc2FtZSBlcnJvciBjb2RlcyBldmVyeSB0aW1lXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVnZXhQYXR0ZXJuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGFsbG93RW1wdHlTdHJpbmdcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGNoZWNrQUlDQ1ZhbGlkRm9ybWF0KFxuICAgIHZhbHVlOiBTdHJpbmcsXG4gICAgcmVnZXhQYXR0ZXJuOiBTdHJpbmcsXG4gICAgYWxsb3dFbXB0eVN0cmluZz86IGJvb2xlYW4pIHtcbiAgcmV0dXJuIGNoZWNrVmFsaWRGb3JtYXQoXG4gICAgICB2YWx1ZSxcbiAgICAgIHJlZ2V4UGF0dGVybixcbiAgICAgIGFpY2NfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCxcbiAgICAgIEFJQ0NWYWxpZGF0aW9uRXJyb3IsXG4gICAgICBhbGxvd0VtcHR5U3RyaW5nXG4gICk7XG59XG5cbi8qKlxuICogQ01JIENsYXNzIGZvciBBSUNDXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUkgZXh0ZW5kcyBTY29ybTEyQ01JLkNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBDTUkgb2JqZWN0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5pdGlhbGl6ZWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKGluaXRpYWxpemVkOiBib29sZWFuKSB7XG4gICAgc3VwZXIoYWljY19jb25zdGFudHMuY21pX2NoaWxkcmVuKTtcblxuICAgIGlmIChpbml0aWFsaXplZCkgdGhpcy5pbml0aWFsaXplKCk7XG5cbiAgICB0aGlzLnN0dWRlbnRfcHJlZmVyZW5jZSA9IG5ldyBBSUNDU3R1ZGVudFByZWZlcmVuY2VzKCk7XG4gICAgdGhpcy5zdHVkZW50X2RhdGEgPSBuZXcgQUlDQ0NNSVN0dWRlbnREYXRhKCk7XG4gICAgdGhpcy5zdHVkZW50X2RlbW9ncmFwaGljcyA9IG5ldyBDTUlTdHVkZW50RGVtb2dyYXBoaWNzKCk7XG4gICAgdGhpcy5ldmFsdWF0aW9uID0gbmV3IENNSUV2YWx1YXRpb24oKTtcbiAgICB0aGlzLnBhdGhzID0gbmV3IENNSVBhdGhzKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc3R1ZGVudF9wcmVmZXJlbmNlPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zdHVkZW50X2RhdGE/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnN0dWRlbnRfZGVtb2dyYXBoaWNzPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5ldmFsdWF0aW9uPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5wYXRocz8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgc3VzcGVuZF9kYXRhOiBzdHJpbmcsXG4gICAqICAgICAgbGF1bmNoX2RhdGE6IHN0cmluZyxcbiAgICogICAgICBjb21tZW50czogc3RyaW5nLFxuICAgKiAgICAgIGNvbW1lbnRzX2Zyb21fbG1zOiBzdHJpbmcsXG4gICAqICAgICAgY29yZTogQ01JQ29yZSxcbiAgICogICAgICBvYmplY3RpdmVzOiBDTUlPYmplY3RpdmVzLFxuICAgKiAgICAgIHN0dWRlbnRfZGF0YTogQ01JU3R1ZGVudERhdGEsXG4gICAqICAgICAgc3R1ZGVudF9wcmVmZXJlbmNlOiBDTUlTdHVkZW50UHJlZmVyZW5jZSxcbiAgICogICAgICBpbnRlcmFjdGlvbnM6IENNSUludGVyYWN0aW9ucyxcbiAgICogICAgICBwYXRoczogQ01JUGF0aHNcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3N1c3BlbmRfZGF0YSc6IHRoaXMuc3VzcGVuZF9kYXRhLFxuICAgICAgJ2xhdW5jaF9kYXRhJzogdGhpcy5sYXVuY2hfZGF0YSxcbiAgICAgICdjb21tZW50cyc6IHRoaXMuY29tbWVudHMsXG4gICAgICAnY29tbWVudHNfZnJvbV9sbXMnOiB0aGlzLmNvbW1lbnRzX2Zyb21fbG1zLFxuICAgICAgJ2NvcmUnOiB0aGlzLmNvcmUsXG4gICAgICAnb2JqZWN0aXZlcyc6IHRoaXMub2JqZWN0aXZlcyxcbiAgICAgICdzdHVkZW50X2RhdGEnOiB0aGlzLnN0dWRlbnRfZGF0YSxcbiAgICAgICdzdHVkZW50X3ByZWZlcmVuY2UnOiB0aGlzLnN0dWRlbnRfcHJlZmVyZW5jZSxcbiAgICAgICdzdHVkZW50X2RlbW9ncmFwaGljcyc6IHRoaXMuc3R1ZGVudF9kZW1vZ3JhcGhpY3MsXG4gICAgICAnaW50ZXJhY3Rpb25zJzogdGhpcy5pbnRlcmFjdGlvbnMsXG4gICAgICAnZXZhbHVhdGlvbic6IHRoaXMuZXZhbHVhdGlvbixcbiAgICAgICdwYXRocyc6IHRoaXMucGF0aHMsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBBSUNDIEV2YWx1YXRpb24gb2JqZWN0XG4gKi9cbmNsYXNzIENNSUV2YWx1YXRpb24gZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIEV2YWx1YXRpb24gb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5jb21tZW50cyA9IG5ldyBDTUlFdmFsdWF0aW9uQ29tbWVudHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5jb21tZW50cz8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmV2YWx1YXRpb24gb2JqZWN0XG4gICAqIEByZXR1cm4ge3tjb21tZW50czogQ01JRXZhbHVhdGlvbkNvbW1lbnRzfX1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdjb21tZW50cyc6IHRoaXMuY29tbWVudHMsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgQUlDQydzIGNtaS5ldmFsdWF0aW9uLmNvbW1lbnRzIG9iamVjdFxuICovXG5jbGFzcyBDTUlFdmFsdWF0aW9uQ29tbWVudHMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBFdmFsdWF0aW9uIENvbW1lbnRzIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe1xuICAgICAgY2hpbGRyZW46IGFpY2NfY29uc3RhbnRzLmNvbW1lbnRzX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBhaWNjX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgZXJyb3JDbGFzczogQUlDQ1ZhbGlkYXRpb25FcnJvcixcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFN0dWRlbnRQcmVmZXJlbmNlcyBjbGFzcyBmb3IgQUlDQ1xuICovXG5jbGFzcyBBSUNDU3R1ZGVudFByZWZlcmVuY2VzIGV4dGVuZHMgU2Nvcm0xMkNNSS5DTUlTdHVkZW50UHJlZmVyZW5jZSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBTdHVkZW50IFByZWZlcmVuY2VzIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoYWljY19jb25zdGFudHMuc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuKTtcblxuICAgIHRoaXMud2luZG93cyA9IG5ldyBDTUlBcnJheSh7XG4gICAgICBlcnJvckNvZGU6IGFpY2NfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUsXG4gICAgICBlcnJvckNsYXNzOiBBSUNDVmFsaWRhdGlvbkVycm9yLFxuICAgICAgY2hpbGRyZW46ICcnLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLndpbmRvd3M/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICNsZXNzb25fdHlwZSA9ICcnO1xuICAjdGV4dF9jb2xvciA9ICcnO1xuICAjdGV4dF9sb2NhdGlvbiA9ICcnO1xuICAjdGV4dF9zaXplID0gJyc7XG4gICN2aWRlbyA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsZXNzb25fdHlwZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVzc29uX3R5cGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy4jbGVzc29uX3R5cGU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGVzc29uX3R5cGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlc3Nvbl90eXBlXG4gICAqL1xuICBzZXQgbGVzc29uX3R5cGUobGVzc29uX3R5cGU6IHN0cmluZykge1xuICAgIGlmIChjaGVja0FJQ0NWYWxpZEZvcm1hdChsZXNzb25fdHlwZSwgYWljY19yZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiNsZXNzb25fdHlwZSA9IGxlc3Nvbl90eXBlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0ZXh0X2NvbG9yXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0ZXh0X2NvbG9yKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuI3RleHRfY29sb3I7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGV4dF9jb2xvclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dF9jb2xvclxuICAgKi9cbiAgc2V0IHRleHRfY29sb3IodGV4dF9jb2xvcjogc3RyaW5nKSB7XG4gICAgaWYgKGNoZWNrQUlDQ1ZhbGlkRm9ybWF0KHRleHRfY29sb3IsIGFpY2NfcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jdGV4dF9jb2xvciA9IHRleHRfY29sb3I7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RleHRfbG9jYXRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRleHRfbG9jYXRpb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy4jdGV4dF9sb2NhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0ZXh0X2xvY2F0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0X2xvY2F0aW9uXG4gICAqL1xuICBzZXQgdGV4dF9sb2NhdGlvbih0ZXh0X2xvY2F0aW9uOiBzdHJpbmcpIHtcbiAgICBpZiAoY2hlY2tBSUNDVmFsaWRGb3JtYXQodGV4dF9sb2NhdGlvbiwgYWljY19yZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiN0ZXh0X2xvY2F0aW9uID0gdGV4dF9sb2NhdGlvbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGV4dF9zaXplXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0ZXh0X3NpemUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy4jdGV4dF9zaXplO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RleHRfc2l6ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dF9zaXplXG4gICAqL1xuICBzZXQgdGV4dF9zaXplKHRleHRfc2l6ZTogc3RyaW5nKSB7XG4gICAgaWYgKGNoZWNrQUlDQ1ZhbGlkRm9ybWF0KHRleHRfc2l6ZSwgYWljY19yZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiN0ZXh0X3NpemUgPSB0ZXh0X3NpemU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3ZpZGVvXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB2aWRlbygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLiN2aWRlbztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN2aWRlb1xuICAgKiBAcGFyYW0ge3N0cmluZ30gdmlkZW9cbiAgICovXG4gIHNldCB2aWRlbyh2aWRlbzogc3RyaW5nKSB7XG4gICAgaWYgKGNoZWNrQUlDQ1ZhbGlkRm9ybWF0KHZpZGVvLCBhaWNjX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI3ZpZGVvID0gdmlkZW87XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLnN0dWRlbnRfcHJlZmVyZW5jZVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGF1ZGlvOiBzdHJpbmcsXG4gICAqICAgICAgbGFuZ3VhZ2U6IHN0cmluZyxcbiAgICogICAgICBzcGVlZDogc3RyaW5nLFxuICAgKiAgICAgIHRleHQ6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnYXVkaW8nOiB0aGlzLmF1ZGlvLFxuICAgICAgJ2xhbmd1YWdlJzogdGhpcy5sYW5ndWFnZSxcbiAgICAgICdsZXNzb25fdHlwZSc6IHRoaXMubGVzc29uX3R5cGUsXG4gICAgICAnc3BlZWQnOiB0aGlzLnNwZWVkLFxuICAgICAgJ3RleHQnOiB0aGlzLnRleHQsXG4gICAgICAndGV4dF9jb2xvcic6IHRoaXMudGV4dF9jb2xvcixcbiAgICAgICd0ZXh0X2xvY2F0aW9uJzogdGhpcy50ZXh0X2xvY2F0aW9uLFxuICAgICAgJ3RleHRfc2l6ZSc6IHRoaXMudGV4dF9zaXplLFxuICAgICAgJ3ZpZGVvJzogdGhpcy52aWRlbyxcbiAgICAgICd3aW5kb3dzJzogdGhpcy53aW5kb3dzLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogU3R1ZGVudERhdGEgY2xhc3MgZm9yIEFJQ0NcbiAqL1xuY2xhc3MgQUlDQ0NNSVN0dWRlbnREYXRhIGV4dGVuZHMgU2Nvcm0xMkNNSS5DTUlTdHVkZW50RGF0YSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBTdHVkZW50RGF0YSBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKGFpY2NfY29uc3RhbnRzLnN0dWRlbnRfZGF0YV9jaGlsZHJlbik7XG5cbiAgICB0aGlzLnRyaWVzID0gbmV3IENNSVRyaWVzKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMudHJpZXM/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICN0cmllc19kdXJpbmdfbGVzc29uID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgdHJpZXNfZHVyaW5nX2xlc3NvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdHJpZXNfZHVyaW5nX2xlc3NvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jdHJpZXNfZHVyaW5nX2xlc3NvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0cmllc19kdXJpbmdfbGVzc29uLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHJpZXNfZHVyaW5nX2xlc3NvblxuICAgKi9cbiAgc2V0IHRyaWVzX2R1cmluZ19sZXNzb24odHJpZXNfZHVyaW5nX2xlc3Nvbikge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jdHJpZXNfZHVyaW5nX2xlc3NvbiA9IHRyaWVzX2R1cmluZ19sZXNzb24gOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5zdHVkZW50X2RhdGEgb2JqZWN0XG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgbWFzdGVyeV9zY29yZTogc3RyaW5nLFxuICAgKiAgICAgIG1heF90aW1lX2FsbG93ZWQ6IHN0cmluZyxcbiAgICogICAgICB0aW1lX2xpbWl0X2FjdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIHRyaWVzOiBDTUlUcmllc1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnbWFzdGVyeV9zY29yZSc6IHRoaXMubWFzdGVyeV9zY29yZSxcbiAgICAgICdtYXhfdGltZV9hbGxvd2VkJzogdGhpcy5tYXhfdGltZV9hbGxvd2VkLFxuICAgICAgJ3RpbWVfbGltaXRfYWN0aW9uJzogdGhpcy50aW1lX2xpbWl0X2FjdGlvbixcbiAgICAgICd0cmllcyc6IHRoaXMudHJpZXMsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgdGhlIEFJQ0MgY21pLnN0dWRlbnRfZGVtb2dyYXBoaWNzIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JU3R1ZGVudERlbW9ncmFwaGljcyBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEFJQ0MgU3R1ZGVudERlbW9ncmFwaGljcyBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAjX2NoaWxkcmVuID0gYWljY19jb25zdGFudHMuc3R1ZGVudF9kZW1vZ3JhcGhpY3NfY2hpbGRyZW47XG4gICNjaXR5ID0gJyc7XG4gICNjbGFzcyA9ICcnO1xuICAjY29tcGFueSA9ICcnO1xuICAjY291bnRyeSA9ICcnO1xuICAjZXhwZXJpZW5jZSA9ICcnO1xuICAjZmFtaWxpYXJfbmFtZSA9ICcnO1xuICAjaW5zdHJ1Y3Rvcl9uYW1lID0gJyc7XG4gICN0aXRsZSA9ICcnO1xuICAjbmF0aXZlX2xhbmd1YWdlID0gJyc7XG4gICNzdGF0ZSA9ICcnO1xuICAjc3RyZWV0X2FkZHJlc3MgPSAnJztcbiAgI3RlbGVwaG9uZSA9ICcnO1xuICAjeWVhcnNfZXhwZXJpZW5jZSA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIF9jaGlsZHJlblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBjaXR5XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjaXR5KCkge1xuICAgIHJldHVybiB0aGlzLiNjaXR5O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NpdHkuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjaXR5XG4gICAqL1xuICBzZXQgY2l0eShjaXR5KSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNjaXR5ID0gY2l0eSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgY2xhc3NcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNsYXNzKCkge1xuICAgIHJldHVybiB0aGlzLiNjbGFzcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjbGFzcy4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXp6XG4gICAqL1xuICBzZXQgY2xhc3MoY2xhenopIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2NsYXNzID0gY2xhenogOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIGNvbXBhbnlcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbXBhbnkoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbXBhbnk7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29tcGFueS4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbXBhbnlcbiAgICovXG4gIHNldCBjb21wYW55KGNvbXBhbnkpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2NvbXBhbnkgPSBjb21wYW55IDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBjb3VudHJ5XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb3VudHJ5KCkge1xuICAgIHJldHVybiB0aGlzLiNjb3VudHJ5O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvdW50cnkuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb3VudHJ5XG4gICAqL1xuICBzZXQgY291bnRyeShjb3VudHJ5KSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNjb3VudHJ5ID0gY291bnRyeSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgZXhwZXJpZW5jZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZXhwZXJpZW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jZXhwZXJpZW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNleHBlcmllbmNlLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXhwZXJpZW5jZVxuICAgKi9cbiAgc2V0IGV4cGVyaWVuY2UoZXhwZXJpZW5jZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jZXhwZXJpZW5jZSA9IGV4cGVyaWVuY2UgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIGZhbWlsaWFyX25hbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGZhbWlsaWFyX25hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2ZhbWlsaWFyX25hbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZmFtaWxpYXJfbmFtZS4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGZhbWlsaWFyX25hbWVcbiAgICovXG4gIHNldCBmYW1pbGlhcl9uYW1lKGZhbWlsaWFyX25hbWUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2ZhbWlsaWFyX25hbWUgPSBmYW1pbGlhcl9uYW1lIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBpbnN0cnVjdG9yX25hbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGluc3RydWN0b3JfbmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jaW5zdHJ1Y3Rvcl9uYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2luc3RydWN0b3JfbmFtZS4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGluc3RydWN0b3JfbmFtZVxuICAgKi9cbiAgc2V0IGluc3RydWN0b3JfbmFtZShpbnN0cnVjdG9yX25hbWUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2luc3RydWN0b3JfbmFtZSA9IGluc3RydWN0b3JfbmFtZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgdGl0bGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRpdGxlKCkge1xuICAgIHJldHVybiB0aGlzLiN0aXRsZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aXRsZS4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpdGxlXG4gICAqL1xuICBzZXQgdGl0bGUodGl0bGUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI3RpdGxlID0gdGl0bGUgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIG5hdGl2ZV9sYW5ndWFnZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbmF0aXZlX2xhbmd1YWdlKCkge1xuICAgIHJldHVybiB0aGlzLiNuYXRpdmVfbGFuZ3VhZ2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbmF0aXZlX2xhbmd1YWdlLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmF0aXZlX2xhbmd1YWdlXG4gICAqL1xuICBzZXQgbmF0aXZlX2xhbmd1YWdlKG5hdGl2ZV9sYW5ndWFnZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jbmF0aXZlX2xhbmd1YWdlID0gbmF0aXZlX2xhbmd1YWdlIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBzdGF0ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3RhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N0YXRlLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RhdGVcbiAgICovXG4gIHNldCBzdGF0ZShzdGF0ZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jc3RhdGUgPSBzdGF0ZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3Igc3RyZWV0X2FkZHJlc3NcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN0cmVldF9hZGRyZXNzKCkge1xuICAgIHJldHVybiB0aGlzLiNzdHJlZXRfYWRkcmVzcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdHJlZXRfYWRkcmVzcy4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0cmVldF9hZGRyZXNzXG4gICAqL1xuICBzZXQgc3RyZWV0X2FkZHJlc3Moc3RyZWV0X2FkZHJlc3MpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI3N0cmVldF9hZGRyZXNzID0gc3RyZWV0X2FkZHJlc3MgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIHRlbGVwaG9uZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGVsZXBob25lKCkge1xuICAgIHJldHVybiB0aGlzLiN0ZWxlcGhvbmU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGVsZXBob25lLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGVsZXBob25lXG4gICAqL1xuICBzZXQgdGVsZXBob25lKHRlbGVwaG9uZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jdGVsZXBob25lID0gdGVsZXBob25lIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciB5ZWFyc19leHBlcmllbmNlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB5ZWFyc19leHBlcmllbmNlKCkge1xuICAgIHJldHVybiB0aGlzLiN5ZWFyc19leHBlcmllbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3llYXJzX2V4cGVyaWVuY2UuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB5ZWFyc19leHBlcmllbmNlXG4gICAqL1xuICBzZXQgeWVhcnNfZXhwZXJpZW5jZSh5ZWFyc19leHBlcmllbmNlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiN5ZWFyc19leHBlcmllbmNlID0geWVhcnNfZXhwZXJpZW5jZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLnN0dWRlbnRfZGVtb2dyYXBoaWNzIG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAgICB7XG4gICAqICAgICAgICBjaXR5OiBzdHJpbmcsXG4gICAqICAgICAgICBjbGFzczogc3RyaW5nLFxuICAgKiAgICAgICAgY29tcGFueTogc3RyaW5nLFxuICAgKiAgICAgICAgY291bnRyeTogc3RyaW5nLFxuICAgKiAgICAgICAgZXhwZXJpZW5jZTogc3RyaW5nLFxuICAgKiAgICAgICAgZmFtaWxpYXJfbmFtZTogc3RyaW5nLFxuICAgKiAgICAgICAgaW5zdHJ1Y3Rvcl9uYW1lOiBzdHJpbmcsXG4gICAqICAgICAgICB0aXRsZTogc3RyaW5nLFxuICAgKiAgICAgICAgbmF0aXZlX2xhbmd1YWdlOiBzdHJpbmcsXG4gICAqICAgICAgICBzdGF0ZTogc3RyaW5nLFxuICAgKiAgICAgICAgc3RyZWV0X2FkZHJlc3M6IHN0cmluZyxcbiAgICogICAgICAgIHRlbGVwaG9uZTogc3RyaW5nLFxuICAgKiAgICAgICAgeWVhcnNfZXhwZXJpZW5jZTogc3RyaW5nXG4gICAqICAgICAgfVxuICAgKiAgICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnY2l0eSc6IHRoaXMuY2l0eSxcbiAgICAgICdjbGFzcyc6IHRoaXMuY2xhc3MsXG4gICAgICAnY29tcGFueSc6IHRoaXMuY29tcGFueSxcbiAgICAgICdjb3VudHJ5JzogdGhpcy5jb3VudHJ5LFxuICAgICAgJ2V4cGVyaWVuY2UnOiB0aGlzLmV4cGVyaWVuY2UsXG4gICAgICAnZmFtaWxpYXJfbmFtZSc6IHRoaXMuZmFtaWxpYXJfbmFtZSxcbiAgICAgICdpbnN0cnVjdG9yX25hbWUnOiB0aGlzLmluc3RydWN0b3JfbmFtZSxcbiAgICAgICd0aXRsZSc6IHRoaXMudGl0bGUsXG4gICAgICAnbmF0aXZlX2xhbmd1YWdlJzogdGhpcy5uYXRpdmVfbGFuZ3VhZ2UsXG4gICAgICAnc3RhdGUnOiB0aGlzLnN0YXRlLFxuICAgICAgJ3N0cmVldF9hZGRyZXNzJzogdGhpcy5zdHJlZXRfYWRkcmVzcyxcbiAgICAgICd0ZWxlcGhvbmUnOiB0aGlzLnRlbGVwaG9uZSxcbiAgICAgICd5ZWFyc19leHBlcmllbmNlJzogdGhpcy55ZWFyc19leHBlcmllbmNlLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIHRoZSBBSUNDIGNtaS5wYXRocyBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSVBhdGhzIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGlubGluZSBQYXRocyBBcnJheSBjbGFzc1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe2NoaWxkcmVuOiBhaWNjX2NvbnN0YW50cy5wYXRoc19jaGlsZHJlbn0pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIEFJQ0MgUGF0aHNcbiAqL1xuZXhwb3J0IGNsYXNzIENNSVBhdGhzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBQYXRocyBvYmplY3RzXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgI2xvY2F0aW9uX2lkID0gJyc7XG4gICNkYXRlID0gJyc7XG4gICN0aW1lID0gJyc7XG4gICNzdGF0dXMgPSAnJztcbiAgI3doeV9sZWZ0ID0gJyc7XG4gICN0aW1lX2luX2VsZW1lbnQgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbG9jYXRpb25faWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxvY2F0aW9uX2lkKCkge1xuICAgIHJldHVybiB0aGlzLiNsb2NhdGlvbl9pZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsb2NhdGlvbl9pZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb25faWRcbiAgICovXG4gIHNldCBsb2NhdGlvbl9pZChsb2NhdGlvbl9pZCkge1xuICAgIGlmIChjaGVja0FJQ0NWYWxpZEZvcm1hdChsb2NhdGlvbl9pZCwgYWljY19yZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiNsb2NhdGlvbl9pZCA9IGxvY2F0aW9uX2lkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNkYXRlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBkYXRlKCkge1xuICAgIHJldHVybiB0aGlzLiNkYXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2RhdGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRhdGVcbiAgICovXG4gIHNldCBkYXRlKGRhdGUpIHtcbiAgICBpZiAoY2hlY2tBSUNDVmFsaWRGb3JtYXQoZGF0ZSwgYWljY19yZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiNkYXRlID0gZGF0ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lXG4gICAqL1xuICBzZXQgdGltZSh0aW1lKSB7XG4gICAgaWYgKGNoZWNrQUlDQ1ZhbGlkRm9ybWF0KHRpbWUsIGFpY2NfcmVnZXguQ01JVGltZSkpIHtcbiAgICAgIHRoaXMuI3RpbWUgPSB0aW1lO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdGF0dXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N0YXR1c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RhdHVzXG4gICAqL1xuICBzZXQgc3RhdHVzKHN0YXR1cykge1xuICAgIGlmIChjaGVja0FJQ0NWYWxpZEZvcm1hdChzdGF0dXMsIGFpY2NfcmVnZXguQ01JU3RhdHVzMikpIHtcbiAgICAgIHRoaXMuI3N0YXR1cyA9IHN0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjd2h5X2xlZnRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHdoeV9sZWZ0KCkge1xuICAgIHJldHVybiB0aGlzLiN3aHlfbGVmdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN3aHlfbGVmdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gd2h5X2xlZnRcbiAgICovXG4gIHNldCB3aHlfbGVmdCh3aHlfbGVmdCkge1xuICAgIGlmIChjaGVja0FJQ0NWYWxpZEZvcm1hdCh3aHlfbGVmdCwgYWljY19yZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiN3aHlfbGVmdCA9IHdoeV9sZWZ0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0aW1lX2luX2VsZW1lbnRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRpbWVfaW5fZWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy4jdGltZV9pbl9lbGVtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpbWVfaW5fZWxlbWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZV9pbl9lbGVtZW50XG4gICAqL1xuICBzZXQgdGltZV9pbl9lbGVtZW50KHRpbWVfaW5fZWxlbWVudCkge1xuICAgIGlmIChjaGVja0FJQ0NWYWxpZEZvcm1hdCh0aW1lX2luX2VsZW1lbnQsIGFpY2NfcmVnZXguQ01JVGltZSkpIHtcbiAgICAgIHRoaXMuI3RpbWVfaW5fZWxlbWVudCA9IHRpbWVfaW5fZWxlbWVudDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkucGF0aHMubiBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBsb2NhdGlvbl9pZDogc3RyaW5nLFxuICAgKiAgICAgIGRhdGU6IHN0cmluZyxcbiAgICogICAgICB0aW1lOiBzdHJpbmcsXG4gICAqICAgICAgc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgd2h5X2xlZnQ6IHN0cmluZyxcbiAgICogICAgICB0aW1lX2luX2VsZW1lbnQ6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnbG9jYXRpb25faWQnOiB0aGlzLmxvY2F0aW9uX2lkLFxuICAgICAgJ2RhdGUnOiB0aGlzLmRhdGUsXG4gICAgICAndGltZSc6IHRoaXMudGltZSxcbiAgICAgICdzdGF0dXMnOiB0aGlzLnN0YXR1cyxcbiAgICAgICd3aHlfbGVmdCc6IHRoaXMud2h5X2xlZnQsXG4gICAgICAndGltZV9pbl9lbGVtZW50JzogdGhpcy50aW1lX2luX2VsZW1lbnQsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgdGhlIEFJQ0MgY21pLnN0dWRlbnRfZGF0YS50cmllcyBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSVRyaWVzIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGlubGluZSBUcmllcyBBcnJheSBjbGFzc1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe2NoaWxkcmVuOiBhaWNjX2NvbnN0YW50cy50cmllc19jaGlsZHJlbn0pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIEFJQ0MgVHJpZXNcbiAqL1xuZXhwb3J0IGNsYXNzIENNSVRyaWVzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBUcmllcyBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnNjb3JlID0gbmV3IENNSVNjb3JlKFxuICAgICAgICB7XG4gICAgICAgICAgc2NvcmVfY2hpbGRyZW46IGFpY2NfY29uc3RhbnRzLnNjb3JlX2NoaWxkcmVuLFxuICAgICAgICAgIHNjb3JlX3JhbmdlOiBhaWNjX3JlZ2V4LnNjb3JlX3JhbmdlLFxuICAgICAgICAgIGludmFsaWRFcnJvckNvZGU6IGFpY2NfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUsXG4gICAgICAgICAgaW52YWxpZFR5cGVDb2RlOiBhaWNjX2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gsXG4gICAgICAgICAgaW52YWxpZFJhbmdlQ29kZTogYWljY19lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0UsXG4gICAgICAgICAgZXJyb3JDbGFzczogQUlDQ1ZhbGlkYXRpb25FcnJvcixcbiAgICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc2NvcmU/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICNzdGF0dXMgPSAnJztcbiAgI3RpbWUgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3RhdHVzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0YXR1c1xuICAgKi9cbiAgc2V0IHN0YXR1cyhzdGF0dXMpIHtcbiAgICBpZiAoY2hlY2tBSUNDVmFsaWRGb3JtYXQoc3RhdHVzLCBhaWNjX3JlZ2V4LkNNSVN0YXR1czIpKSB7XG4gICAgICB0aGlzLiNzdGF0dXMgPSBzdGF0dXM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGltZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZVxuICAgKi9cbiAgc2V0IHRpbWUodGltZSkge1xuICAgIGlmIChjaGVja0FJQ0NWYWxpZEZvcm1hdCh0aW1lLCBhaWNjX3JlZ2V4LkNNSVRpbWUpKSB7XG4gICAgICB0aGlzLiN0aW1lID0gdGltZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuc3R1ZGVudF9kYXRhLnRyaWVzLm4gb2JqZWN0XG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgdGltZTogc3RyaW5nLFxuICAgKiAgICAgIHNjb3JlOiBDTUlTY29yZVxuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnc3RhdHVzJzogdGhpcy5zdGF0dXMsXG4gICAgICAndGltZSc6IHRoaXMudGltZSxcbiAgICAgICdzY29yZSc6IHRoaXMuc2NvcmUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgY21pLnN0dWRlbnRfZGF0YS5hdHRlbXB0X3JlY29yZHMgYXJyYXlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUF0dGVtcHRSZWNvcmRzIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGlubGluZSBUcmllcyBBcnJheSBjbGFzc1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe2NoaWxkcmVuOiBhaWNjX2NvbnN0YW50cy5hdHRlbXB0X3JlY29yZHNfY2hpbGRyZW59KTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBBSUNDIEF0dGVtcHQgUmVjb3Jkc1xuICovXG5leHBvcnQgY2xhc3MgQ01JQXR0ZW1wdFJlY29yZHNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIEF0dGVtcHQgUmVjb3JkcyBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnNjb3JlID0gbmV3IENNSVNjb3JlKFxuICAgICAgICB7XG4gICAgICAgICAgc2NvcmVfY2hpbGRyZW46IGFpY2NfY29uc3RhbnRzLnNjb3JlX2NoaWxkcmVuLFxuICAgICAgICAgIHNjb3JlX3JhbmdlOiBhaWNjX3JlZ2V4LnNjb3JlX3JhbmdlLFxuICAgICAgICAgIGludmFsaWRFcnJvckNvZGU6IGFpY2NfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUsXG4gICAgICAgICAgaW52YWxpZFR5cGVDb2RlOiBhaWNjX2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gsXG4gICAgICAgICAgaW52YWxpZFJhbmdlQ29kZTogYWljY19lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0UsXG4gICAgICAgICAgZXJyb3JDbGFzczogQUlDQ1ZhbGlkYXRpb25FcnJvcixcbiAgICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc2NvcmU/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICNsZXNzb25fc3RhdHVzID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xlc3Nvbl9zdGF0dXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlc3Nvbl9zdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xlc3Nvbl9zdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGVzc29uX3N0YXR1c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gbGVzc29uX3N0YXR1c1xuICAgKi9cbiAgc2V0IGxlc3Nvbl9zdGF0dXMobGVzc29uX3N0YXR1cykge1xuICAgIGlmIChjaGVja0FJQ0NWYWxpZEZvcm1hdChsZXNzb25fc3RhdHVzLCBhaWNjX3JlZ2V4LkNNSVN0YXR1czIpKSB7XG4gICAgICB0aGlzLiNsZXNzb25fc3RhdHVzID0gbGVzc29uX3N0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuc3R1ZGVudF9kYXRhLmF0dGVtcHRfcmVjb3Jkcy5uIG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHN0YXR1czogc3RyaW5nLFxuICAgKiAgICAgIHRpbWU6IHN0cmluZyxcbiAgICogICAgICBzY29yZTogQ01JU2NvcmVcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2xlc3Nvbl9zdGF0dXMnOiB0aGlzLmxlc3Nvbl9zdGF0dXMsXG4gICAgICAnc2NvcmUnOiB0aGlzLnNjb3JlLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIEFJQ0MgRXZhbHVhdGlvbiBDb21tZW50c1xuICovXG5leHBvcnQgY2xhc3MgQ01JRXZhbHVhdGlvbkNvbW1lbnRzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgRXZhbHVhdGlvbiBDb21tZW50c1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gICNjb250ZW50ID0gJyc7XG4gICNsb2NhdGlvbiA9ICcnO1xuICAjdGltZSA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb250ZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb250ZW50KCkge1xuICAgIHJldHVybiB0aGlzLiNjb250ZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbnRlbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnRcbiAgICovXG4gIHNldCBjb250ZW50KGNvbnRlbnQpIHtcbiAgICBpZiAoY2hlY2tBSUNDVmFsaWRGb3JtYXQoY29udGVudCwgYWljY19yZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiNjb250ZW50ID0gY29udGVudDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbG9jYXRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxvY2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNsb2NhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsb2NhdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb25cbiAgICovXG4gIHNldCBsb2NhdGlvbihsb2NhdGlvbikge1xuICAgIGlmIChjaGVja0FJQ0NWYWxpZEZvcm1hdChsb2NhdGlvbiwgYWljY19yZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiNsb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0aW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lKCkge1xuICAgIHJldHVybiB0aGlzLiN0aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRpbmcgZm9yICN0aW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lXG4gICAqL1xuICBzZXQgdGltZSh0aW1lKSB7XG4gICAgaWYgKGNoZWNrQUlDQ1ZhbGlkRm9ybWF0KHRpbWUsIGFpY2NfcmVnZXguQ01JVGltZSkpIHtcbiAgICAgIHRoaXMuI3RpbWUgPSB0aW1lO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5ldmF1bGF0aW9uLmNvbW1lbnRzLm4gb2JqZWN0XG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgY29udGVudDogc3RyaW5nLFxuICAgKiAgICAgIGxvY2F0aW9uOiBzdHJpbmcsXG4gICAqICAgICAgdGltZTogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdjb250ZW50JzogdGhpcy5jb250ZW50LFxuICAgICAgJ2xvY2F0aW9uJzogdGhpcy5sb2NhdGlvbixcbiAgICAgICd0aW1lJzogdGhpcy50aW1lLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iLCIvLyBAZmxvd1xuaW1wb3J0IEFQSUNvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMvYXBpX2NvbnN0YW50cyc7XG5pbXBvcnQgRXJyb3JDb2RlcyBmcm9tICcuLi9jb25zdGFudHMvZXJyb3JfY29kZXMnO1xuaW1wb3J0IFJlZ2V4IGZyb20gJy4uL2NvbnN0YW50cy9yZWdleCc7XG5cbmNvbnN0IHNjb3JtMTJfY29uc3RhbnRzID0gQVBJQ29uc3RhbnRzLnNjb3JtMTI7XG5jb25zdCBzY29ybTEyX3JlZ2V4ID0gUmVnZXguc2Nvcm0xMjtcbmNvbnN0IHNjb3JtMTJfZXJyb3JfY29kZXMgPSBFcnJvckNvZGVzLnNjb3JtMTI7XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIHZhbHVlIG1hdGNoZXMgdGhlIHByb3BlciBmb3JtYXQuIElmIG5vdCwgdGhyb3cgcHJvcGVyIGVycm9yIGNvZGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVnZXhQYXR0ZXJuXG4gKiBAcGFyYW0ge251bWJlcn0gZXJyb3JDb2RlXG4gKiBAcGFyYW0ge2NsYXNzfSBlcnJvckNsYXNzXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGFsbG93RW1wdHlTdHJpbmdcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1ZhbGlkRm9ybWF0KFxuICAgIHZhbHVlOiBTdHJpbmcsXG4gICAgcmVnZXhQYXR0ZXJuOiBTdHJpbmcsXG4gICAgZXJyb3JDb2RlOiBudW1iZXIsXG4gICAgZXJyb3JDbGFzczogZnVuY3Rpb24sXG4gICAgYWxsb3dFbXB0eVN0cmluZz86IGJvb2xlYW4pIHtcbiAgY29uc3QgZm9ybWF0UmVnZXggPSBuZXcgUmVnRXhwKHJlZ2V4UGF0dGVybik7XG4gIGNvbnN0IG1hdGNoZXMgPSB2YWx1ZS5tYXRjaChmb3JtYXRSZWdleCk7XG4gIGlmIChhbGxvd0VtcHR5U3RyaW5nICYmIHZhbHVlID09PSAnJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8ICFtYXRjaGVzIHx8IG1hdGNoZXNbMF0gPT09ICcnKSB7XG4gICAgdGhyb3cgbmV3IGVycm9yQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yKGVycm9yQ29kZSk7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIHZhbHVlIG1hdGNoZXMgdGhlIHByb3BlciByYW5nZS4gSWYgbm90LCB0aHJvdyBwcm9wZXIgZXJyb3IgY29kZS5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcmFuZ2VQYXR0ZXJuXG4gKiBAcGFyYW0ge251bWJlcn0gZXJyb3JDb2RlXG4gKiBAcGFyYW0ge2NsYXNzfSBlcnJvckNsYXNzXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tWYWxpZFJhbmdlKFxuICAgIHZhbHVlOiBhbnksXG4gICAgcmFuZ2VQYXR0ZXJuOiBTdHJpbmcsXG4gICAgZXJyb3JDb2RlOiBudW1iZXIsXG4gICAgZXJyb3JDbGFzczogZnVuY3Rpb24pIHtcbiAgY29uc3QgcmFuZ2VzID0gcmFuZ2VQYXR0ZXJuLnNwbGl0KCcjJyk7XG4gIHZhbHVlID0gdmFsdWUgKiAxLjA7XG4gIGlmICh2YWx1ZSA+PSByYW5nZXNbMF0pIHtcbiAgICBpZiAoKHJhbmdlc1sxXSA9PT0gJyonKSB8fCAodmFsdWUgPD0gcmFuZ2VzWzFdKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBlcnJvckNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvcihlcnJvckNvZGUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IoZXJyb3JDb2RlKTtcbiAgfVxufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIEFQSSBjbWkgb2JqZWN0c1xuICovXG5leHBvcnQgY2xhc3MgQmFzZUNNSSB7XG4gIGpzb25TdHJpbmcgPSBmYWxzZTtcbiAgI2luaXRpYWxpemVkID0gZmFsc2U7XG4gICNzdGFydF90aW1lO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQmFzZUNNSSwganVzdCBtYXJrcyB0aGUgY2xhc3MgYXMgYWJzdHJhY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGlmIChuZXcudGFyZ2V0ID09PSBCYXNlQ01JKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29uc3RydWN0IEJhc2VDTUkgaW5zdGFuY2VzIGRpcmVjdGx5Jyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2luaXRpYWxpemVkXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBnZXQgaW5pdGlhbGl6ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2luaXRpYWxpemVkO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N0YXJ0X3RpbWVcbiAgICogQHJldHVybiB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IHN0YXJ0X3RpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0YXJ0X3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgdGhpcy4jaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBwbGF5ZXIgc2hvdWxkIG92ZXJyaWRlIHRoZSAnc2Vzc2lvbl90aW1lJyBwcm92aWRlZCBieVxuICAgKiB0aGUgbW9kdWxlXG4gICAqL1xuICBzZXRTdGFydFRpbWUoKSB7XG4gICAgdGhpcy4jc3RhcnRfdGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgY21pICouc2NvcmUgb2JqZWN0c1xuICovXG5leHBvcnQgY2xhc3MgQ01JU2NvcmUgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciAqLnNjb3JlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY29yZV9jaGlsZHJlblxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NvcmVfcmFuZ2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1heFxuICAgKiBAcGFyYW0ge251bWJlcn0gaW52YWxpZEVycm9yQ29kZVxuICAgKiBAcGFyYW0ge251bWJlcn0gaW52YWxpZFR5cGVDb2RlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbnZhbGlkUmFuZ2VDb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkZWNpbWFsUmVnZXhcbiAgICogQHBhcmFtIHtjbGFzc30gZXJyb3JDbGFzc1xuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgICB7XG4gICAgICAgIHNjb3JlX2NoaWxkcmVuLFxuICAgICAgICBzY29yZV9yYW5nZSxcbiAgICAgICAgbWF4LFxuICAgICAgICBpbnZhbGlkRXJyb3JDb2RlLFxuICAgICAgICBpbnZhbGlkVHlwZUNvZGUsXG4gICAgICAgIGludmFsaWRSYW5nZUNvZGUsXG4gICAgICAgIGRlY2ltYWxSZWdleCxcbiAgICAgICAgZXJyb3JDbGFzcyxcbiAgICAgIH0pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy4jX2NoaWxkcmVuID0gc2NvcmVfY2hpbGRyZW4gfHxcbiAgICAgICAgc2Nvcm0xMl9jb25zdGFudHMuc2NvcmVfY2hpbGRyZW47XG4gICAgdGhpcy4jX3Njb3JlX3JhbmdlID0gIXNjb3JlX3JhbmdlID8gZmFsc2UgOiBzY29ybTEyX3JlZ2V4LnNjb3JlX3JhbmdlO1xuICAgIHRoaXMuI21heCA9IChtYXggfHwgbWF4ID09PSAnJykgPyBtYXggOiAnMTAwJztcbiAgICB0aGlzLiNfaW52YWxpZF9lcnJvcl9jb2RlID0gaW52YWxpZEVycm9yQ29kZSB8fFxuICAgICAgICBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFO1xuICAgIHRoaXMuI19pbnZhbGlkX3R5cGVfY29kZSA9IGludmFsaWRUeXBlQ29kZSB8fFxuICAgICAgICBzY29ybTEyX2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0g7XG4gICAgdGhpcy4jX2ludmFsaWRfcmFuZ2VfY29kZSA9IGludmFsaWRSYW5nZUNvZGUgfHxcbiAgICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0U7XG4gICAgdGhpcy4jX2RlY2ltYWxfcmVnZXggPSBkZWNpbWFsUmVnZXggfHxcbiAgICAgICAgc2Nvcm0xMl9yZWdleC5DTUlEZWNpbWFsO1xuICAgIHRoaXMuI19lcnJvcl9jbGFzcyA9IGVycm9yQ2xhc3M7XG4gIH1cblxuICAjX2NoaWxkcmVuO1xuICAjX3Njb3JlX3JhbmdlO1xuICAjX2ludmFsaWRfZXJyb3JfY29kZTtcbiAgI19pbnZhbGlkX3R5cGVfY29kZTtcbiAgI19pbnZhbGlkX3JhbmdlX2NvZGU7XG4gICNfZGVjaW1hbF9yZWdleDtcbiAgI19lcnJvcl9jbGFzcztcbiAgI3JhdyA9ICcnO1xuICAjbWluID0gJyc7XG4gICNtYXg7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgX2NoaWxkcmVuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yIF9jaGlsZHJlbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfY2hpbGRyZW5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldCBfY2hpbGRyZW4oX2NoaWxkcmVuKSB7XG4gICAgdGhyb3cgbmV3IHRoaXMuI19lcnJvcl9jbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IodGhpcy4jX2ludmFsaWRfZXJyb3JfY29kZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjcmF3XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCByYXcoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3JhdztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNyYXdcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJhd1xuICAgKi9cbiAgc2V0IHJhdyhyYXcpIHtcbiAgICBpZiAoY2hlY2tWYWxpZEZvcm1hdChyYXcsIHRoaXMuI19kZWNpbWFsX3JlZ2V4LCB0aGlzLiNfaW52YWxpZF90eXBlX2NvZGUsIHRoaXMuI19lcnJvcl9jbGFzcykgJiZcbiAgICAgICAgKCF0aGlzLiNfc2NvcmVfcmFuZ2UgfHxcbiAgICAgICAgICAgIGNoZWNrVmFsaWRSYW5nZShyYXcsIHRoaXMuI19zY29yZV9yYW5nZSwgdGhpcy4jX2ludmFsaWRfcmFuZ2VfY29kZSwgdGhpcy4jX2Vycm9yX2NsYXNzKSkpIHtcbiAgICAgIHRoaXMuI3JhdyA9IHJhdztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbWluXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBtaW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI21pbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNtaW5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1pblxuICAgKi9cbiAgc2V0IG1pbihtaW4pIHtcbiAgICBpZiAoY2hlY2tWYWxpZEZvcm1hdChtaW4sIHRoaXMuI19kZWNpbWFsX3JlZ2V4LCB0aGlzLiNfaW52YWxpZF90eXBlX2NvZGUsIHRoaXMuI19lcnJvcl9jbGFzcykgJiZcbiAgICAgICAgKCF0aGlzLiNfc2NvcmVfcmFuZ2UgfHxcbiAgICAgICAgICAgIGNoZWNrVmFsaWRSYW5nZShtaW4sIHRoaXMuI19zY29yZV9yYW5nZSwgdGhpcy4jX2ludmFsaWRfcmFuZ2VfY29kZSwgdGhpcy4jX2Vycm9yX2NsYXNzKSkpIHtcbiAgICAgIHRoaXMuI21pbiA9IG1pbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbWF4XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBtYXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuI21heDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNtYXhcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1heFxuICAgKi9cbiAgc2V0IG1heChtYXgpIHtcbiAgICBpZiAoY2hlY2tWYWxpZEZvcm1hdChtYXgsIHRoaXMuI19kZWNpbWFsX3JlZ2V4LCB0aGlzLiNfaW52YWxpZF90eXBlX2NvZGUsIHRoaXMuI19lcnJvcl9jbGFzcykgJiZcbiAgICAgICAgKCF0aGlzLiNfc2NvcmVfcmFuZ2UgfHxcbiAgICAgICAgICAgIGNoZWNrVmFsaWRSYW5nZShtYXgsIHRoaXMuI19zY29yZV9yYW5nZSwgdGhpcy4jX2ludmFsaWRfcmFuZ2VfY29kZSwgdGhpcy4jX2Vycm9yX2NsYXNzKSkpIHtcbiAgICAgIHRoaXMuI21heCA9IG1heDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciAqLnNjb3JlXG4gICAqIEByZXR1cm4ge3ttaW46IHN0cmluZywgbWF4OiBzdHJpbmcsIHJhdzogc3RyaW5nfX1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdyYXcnOiB0aGlzLnJhdyxcbiAgICAgICdtaW4nOiB0aGlzLm1pbixcbiAgICAgICdtYXgnOiB0aGlzLm1heCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGNtaSAqLm4gb2JqZWN0c1xuICovXG5leHBvcnQgY2xhc3MgQ01JQXJyYXkgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGNtaSAqLm4gYXJyYXlzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjaGlsZHJlblxuICAgKiBAcGFyYW0ge251bWJlcn0gZXJyb3JDb2RlXG4gICAqIEBwYXJhbSB7Y2xhc3N9IGVycm9yQ2xhc3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKHtjaGlsZHJlbiwgZXJyb3JDb2RlLCBlcnJvckNsYXNzfSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy4jX2NoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgdGhpcy4jZXJyb3JDb2RlID0gZXJyb3JDb2RlO1xuICAgIHRoaXMuI2Vycm9yQ2xhc3MgPSBlcnJvckNsYXNzO1xuICAgIHRoaXMuY2hpbGRBcnJheSA9IFtdO1xuICB9XG5cbiAgI2Vycm9yQ29kZTtcbiAgI2Vycm9yQ2xhc3M7XG4gICNfY2hpbGRyZW47XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgX2NoaWxkcmVuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciBfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX2NoaWxkcmVuXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93IG5ldyB0aGlzLiNlcnJvckNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcih0aGlzLiNlcnJvckNvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgX2NvdW50XG4gICAqIEByZXR1cm4ge251bWJlcn1cbiAgICovXG4gIGdldCBfY291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hpbGRBcnJheS5sZW5ndGg7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciBfY291bnQuIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge251bWJlcn0gX2NvdW50XG4gICAqL1xuICBzZXQgX2NvdW50KF9jb3VudCkge1xuICAgIHRocm93IG5ldyB0aGlzLiNlcnJvckNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcih0aGlzLiNlcnJvckNvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgKi5uIGFycmF5c1xuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0W2kgKyAnJ10gPSB0aGlzLmNoaWxkQXJyYXlbaV07XG4gICAgfVxuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCB7XG4gIEJhc2VDTUksXG4gIGNoZWNrVmFsaWRGb3JtYXQsXG4gIGNoZWNrVmFsaWRSYW5nZSxcbiAgQ01JQXJyYXksXG4gIENNSVNjb3JlLFxufSBmcm9tICcuL2NvbW1vbic7XG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCBFcnJvckNvZGVzIGZyb20gJy4uL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQgUmVnZXggZnJvbSAnLi4vY29uc3RhbnRzL3JlZ2V4JztcbmltcG9ydCB7U2Nvcm0xMlZhbGlkYXRpb25FcnJvcn0gZnJvbSAnLi4vZXhjZXB0aW9ucyc7XG5pbXBvcnQgKiBhcyBVdGlsaXRpZXMgZnJvbSAnLi4vdXRpbGl0aWVzJztcbmltcG9ydCAqIGFzIFV0aWwgZnJvbSAnLi4vdXRpbGl0aWVzJztcblxuY29uc3Qgc2Nvcm0xMl9jb25zdGFudHMgPSBBUElDb25zdGFudHMuc2Nvcm0xMjtcbmNvbnN0IHNjb3JtMTJfcmVnZXggPSBSZWdleC5zY29ybTEyO1xuY29uc3Qgc2Nvcm0xMl9lcnJvcl9jb2RlcyA9IEVycm9yQ29kZXMuc2Nvcm0xMjtcblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIGZvciB0aHJvd2luZyBSZWFkIE9ubHkgZXJyb3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93UmVhZE9ubHlFcnJvcigpIHtcbiAgdGhyb3cgbmV3IFNjb3JtMTJWYWxpZGF0aW9uRXJyb3Ioc2Nvcm0xMl9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgV3JpdGUgT25seSBlcnJvclxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dXcml0ZU9ubHlFcnJvcigpIHtcbiAgdGhyb3cgbmV3IFNjb3JtMTJWYWxpZGF0aW9uRXJyb3Ioc2Nvcm0xMl9lcnJvcl9jb2Rlcy5XUklURV9PTkxZX0VMRU1FTlQpO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QgZm9yIHRocm93aW5nIEludmFsaWQgU2V0IGVycm9yXG4gKi9cbmZ1bmN0aW9uIHRocm93SW52YWxpZFZhbHVlRXJyb3IoKSB7XG4gIHRocm93IG5ldyBTY29ybTEyVmFsaWRhdGlvbkVycm9yKHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUpO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QsIG5vIHJlYXNvbiB0byBoYXZlIHRvIHBhc3MgdGhlIHNhbWUgZXJyb3IgY29kZXMgZXZlcnkgdGltZVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9IHJlZ2V4UGF0dGVyblxuICogQHBhcmFtIHtib29sZWFufSBhbGxvd0VtcHR5U3RyaW5nXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2sxMlZhbGlkRm9ybWF0KFxuICAgIHZhbHVlOiBTdHJpbmcsXG4gICAgcmVnZXhQYXR0ZXJuOiBTdHJpbmcsXG4gICAgYWxsb3dFbXB0eVN0cmluZz86IGJvb2xlYW4pIHtcbiAgcmV0dXJuIGNoZWNrVmFsaWRGb3JtYXQoXG4gICAgICB2YWx1ZSxcbiAgICAgIHJlZ2V4UGF0dGVybixcbiAgICAgIHNjb3JtMTJfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCxcbiAgICAgIFNjb3JtMTJWYWxpZGF0aW9uRXJyb3IsXG4gICAgICBhbGxvd0VtcHR5U3RyaW5nXG4gICk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCwgbm8gcmVhc29uIHRvIGhhdmUgdG8gcGFzcyB0aGUgc2FtZSBlcnJvciBjb2RlcyBldmVyeSB0aW1lXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcmFuZ2VQYXR0ZXJuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGFsbG93RW1wdHlTdHJpbmdcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVjazEyVmFsaWRSYW5nZShcbiAgICB2YWx1ZTogYW55LFxuICAgIHJhbmdlUGF0dGVybjogU3RyaW5nLFxuICAgIGFsbG93RW1wdHlTdHJpbmc/OiBib29sZWFuKSB7XG4gIHJldHVybiBjaGVja1ZhbGlkUmFuZ2UoXG4gICAgICB2YWx1ZSxcbiAgICAgIHJhbmdlUGF0dGVybixcbiAgICAgIHNjb3JtMTJfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFLFxuICAgICAgU2Nvcm0xMlZhbGlkYXRpb25FcnJvcixcbiAgICAgIGFsbG93RW1wdHlTdHJpbmdcbiAgKTtcbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgdGhlIGNtaSBvYmplY3QgZm9yIFNDT1JNIDEuMlxuICovXG5leHBvcnQgY2xhc3MgQ01JIGV4dGVuZHMgQmFzZUNNSSB7XG4gICNfY2hpbGRyZW4gPSAnJztcbiAgI192ZXJzaW9uID0gJzMuNCc7XG4gICNsYXVuY2hfZGF0YSA9ICcnO1xuICAjY29tbWVudHMgPSAnJztcbiAgI2NvbW1lbnRzX2Zyb21fbG1zID0gJyc7XG5cbiAgc3R1ZGVudF9kYXRhID0gbnVsbDtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIHRoZSBTQ09STSAxLjIgY21pIG9iamVjdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gY21pX2NoaWxkcmVuXG4gICAqIEBwYXJhbSB7KENNSVN0dWRlbnREYXRhfEFJQ0NDTUlTdHVkZW50RGF0YSl9IHN0dWRlbnRfZGF0YVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGluaXRpYWxpemVkXG4gICAqL1xuICBjb25zdHJ1Y3RvcihjbWlfY2hpbGRyZW4sIHN0dWRlbnRfZGF0YSwgaW5pdGlhbGl6ZWQ6IGJvb2xlYW4pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKGluaXRpYWxpemVkKSB0aGlzLmluaXRpYWxpemUoKTtcblxuICAgIHRoaXMuI19jaGlsZHJlbiA9IGNtaV9jaGlsZHJlbiA/XG4gICAgICAgIGNtaV9jaGlsZHJlbiA6XG4gICAgICAgIHNjb3JtMTJfY29uc3RhbnRzLmNtaV9jaGlsZHJlbjtcbiAgICB0aGlzLmNvcmUgPSBuZXcgQ01JQ29yZSgpO1xuICAgIHRoaXMub2JqZWN0aXZlcyA9IG5ldyBDTUlPYmplY3RpdmVzKCk7XG4gICAgdGhpcy5zdHVkZW50X2RhdGEgPSBzdHVkZW50X2RhdGEgPyBzdHVkZW50X2RhdGEgOiBuZXcgQ01JU3R1ZGVudERhdGEoKTtcbiAgICB0aGlzLnN0dWRlbnRfcHJlZmVyZW5jZSA9IG5ldyBDTUlTdHVkZW50UHJlZmVyZW5jZSgpO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zID0gbmV3IENNSUludGVyYWN0aW9ucygpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmNvcmU/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLm9iamVjdGl2ZXM/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnN0dWRlbnRfZGF0YT8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc3R1ZGVudF9wcmVmZXJlbmNlPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5pbnRlcmFjdGlvbnM/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHN1c3BlbmRfZGF0YTogc3RyaW5nLFxuICAgKiAgICAgIGxhdW5jaF9kYXRhOiBzdHJpbmcsXG4gICAqICAgICAgY29tbWVudHM6IHN0cmluZyxcbiAgICogICAgICBjb21tZW50c19mcm9tX2xtczogc3RyaW5nLFxuICAgKiAgICAgIGNvcmU6IENNSUNvcmUsXG4gICAqICAgICAgb2JqZWN0aXZlczogQ01JT2JqZWN0aXZlcyxcbiAgICogICAgICBzdHVkZW50X2RhdGE6IENNSVN0dWRlbnREYXRhLFxuICAgKiAgICAgIHN0dWRlbnRfcHJlZmVyZW5jZTogQ01JU3R1ZGVudFByZWZlcmVuY2UsXG4gICAqICAgICAgaW50ZXJhY3Rpb25zOiBDTUlJbnRlcmFjdGlvbnNcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3N1c3BlbmRfZGF0YSc6IHRoaXMuc3VzcGVuZF9kYXRhLFxuICAgICAgJ2xhdW5jaF9kYXRhJzogdGhpcy5sYXVuY2hfZGF0YSxcbiAgICAgICdjb21tZW50cyc6IHRoaXMuY29tbWVudHMsXG4gICAgICAnY29tbWVudHNfZnJvbV9sbXMnOiB0aGlzLmNvbW1lbnRzX2Zyb21fbG1zLFxuICAgICAgJ2NvcmUnOiB0aGlzLmNvcmUsXG4gICAgICAnb2JqZWN0aXZlcyc6IHRoaXMub2JqZWN0aXZlcyxcbiAgICAgICdzdHVkZW50X2RhdGEnOiB0aGlzLnN0dWRlbnRfZGF0YSxcbiAgICAgICdzdHVkZW50X3ByZWZlcmVuY2UnOiB0aGlzLnN0dWRlbnRfcHJlZmVyZW5jZSxcbiAgICAgICdpbnRlcmFjdGlvbnMnOiB0aGlzLmludGVyYWN0aW9ucyxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNfdmVyc2lvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgX3ZlcnNpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI192ZXJzaW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI192ZXJzaW9uLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF92ZXJzaW9uXG4gICAqL1xuICBzZXQgX3ZlcnNpb24oX3ZlcnNpb24pIHtcbiAgICB0aHJvd0ludmFsaWRWYWx1ZUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX2NoaWxkcmVuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfdmVyc2lvbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfY2hpbGRyZW5cbiAgICovXG4gIHNldCBfY2hpbGRyZW4oX2NoaWxkcmVuKSB7XG4gICAgdGhyb3dJbnZhbGlkVmFsdWVFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N1c3BlbmRfZGF0YVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3VzcGVuZF9kYXRhKCkge1xuICAgIHJldHVybiB0aGlzLmNvcmU/LnN1c3BlbmRfZGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdXNwZW5kX2RhdGFcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN1c3BlbmRfZGF0YVxuICAgKi9cbiAgc2V0IHN1c3BlbmRfZGF0YShzdXNwZW5kX2RhdGEpIHtcbiAgICBpZiAodGhpcy5jb3JlKSB7XG4gICAgICB0aGlzLmNvcmUuc3VzcGVuZF9kYXRhID0gc3VzcGVuZF9kYXRhO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsYXVuY2hfZGF0YVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGF1bmNoX2RhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xhdW5jaF9kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xhdW5jaF9kYXRhLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhdW5jaF9kYXRhXG4gICAqL1xuICBzZXQgbGF1bmNoX2RhdGEobGF1bmNoX2RhdGEpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI2xhdW5jaF9kYXRhID0gbGF1bmNoX2RhdGEgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb21tZW50c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29tbWVudHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbW1lbnRzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbW1lbnRzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21tZW50c1xuICAgKi9cbiAgc2V0IGNvbW1lbnRzKGNvbW1lbnRzKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChjb21tZW50cywgc2Nvcm0xMl9yZWdleC5DTUlTdHJpbmc0MDk2LCB0cnVlKSkge1xuICAgICAgdGhpcy4jY29tbWVudHMgPSBjb21tZW50cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29tbWVudHNfZnJvbV9sbXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbW1lbnRzX2Zyb21fbG1zKCkge1xuICAgIHJldHVybiB0aGlzLiNjb21tZW50c19mcm9tX2xtcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb21tZW50c19mcm9tX2xtcy4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21tZW50c19mcm9tX2xtc1xuICAgKi9cbiAgc2V0IGNvbW1lbnRzX2Zyb21fbG1zKGNvbW1lbnRzX2Zyb21fbG1zKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNjb21tZW50c19mcm9tX2xtcyA9IGNvbW1lbnRzX2Zyb21fbG1zIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0aGUgY3VycmVudCBzZXNzaW9uIHRpbWUgdG8gdGhlIGV4aXN0aW5nIHRvdGFsIHRpbWUuXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldEN1cnJlbnRUb3RhbFRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29yZS5nZXRDdXJyZW50VG90YWxUaW1lKHRoaXMuc3RhcnRfdGltZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgdGhlIGNtaS5jb3JlIG9iamVjdFxuICogQGV4dGVuZHMgQmFzZUNNSVxuICovXG5jbGFzcyBDTUlDb3JlIGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmNvcmVcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnNjb3JlID0gbmV3IENNSVNjb3JlKFxuICAgICAgICB7XG4gICAgICAgICAgc2NvcmVfY2hpbGRyZW46IHNjb3JtMTJfY29uc3RhbnRzLnNjb3JlX2NoaWxkcmVuLFxuICAgICAgICAgIHNjb3JlX3JhbmdlOiBzY29ybTEyX3JlZ2V4LnNjb3JlX3JhbmdlLFxuICAgICAgICAgIGludmFsaWRFcnJvckNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUsXG4gICAgICAgICAgaW52YWxpZFR5cGVDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gsXG4gICAgICAgICAgaW52YWxpZFJhbmdlQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0UsXG4gICAgICAgICAgZXJyb3JDbGFzczogU2Nvcm0xMlZhbGlkYXRpb25FcnJvcixcbiAgICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc2NvcmU/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICNfY2hpbGRyZW4gPSBzY29ybTEyX2NvbnN0YW50cy5jb3JlX2NoaWxkcmVuO1xuICAjc3R1ZGVudF9pZCA9ICcnO1xuICAjc3R1ZGVudF9uYW1lID0gJyc7XG4gICNsZXNzb25fbG9jYXRpb24gPSAnJztcbiAgI2NyZWRpdCA9ICcnO1xuICAjbGVzc29uX3N0YXR1cyA9ICdub3QgYXR0ZW1wdGVkJztcbiAgI2VudHJ5ID0gJyc7XG4gICN0b3RhbF90aW1lID0gJyc7XG4gICNsZXNzb25fbW9kZSA9ICdub3JtYWwnO1xuICAjZXhpdCA9ICcnO1xuICAjc2Vzc2lvbl90aW1lID0gJzAwOjAwOjAwJztcbiAgI3N1c3BlbmRfZGF0YSA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNfY2hpbGRyZW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IF9jaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI19jaGlsZHJlbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfY2hpbGRyZW5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldCBfY2hpbGRyZW4oX2NoaWxkcmVuKSB7XG4gICAgdGhyb3dJbnZhbGlkVmFsdWVFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N0dWRlbnRfaWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN0dWRlbnRfaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0dWRlbnRfaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3R1ZGVudF9pZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHVkZW50X2lkXG4gICAqL1xuICBzZXQgc3R1ZGVudF9pZChzdHVkZW50X2lkKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNzdHVkZW50X2lkID0gc3R1ZGVudF9pZCA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N0dWRlbnRfbmFtZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3R1ZGVudF9uYW1lKCkge1xuICAgIHJldHVybiB0aGlzLiNzdHVkZW50X25hbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3R1ZGVudF9uYW1lLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0dWRlbnRfbmFtZVxuICAgKi9cbiAgc2V0IHN0dWRlbnRfbmFtZShzdHVkZW50X25hbWUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI3N0dWRlbnRfbmFtZSA9IHN0dWRlbnRfbmFtZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xlc3Nvbl9sb2NhdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVzc29uX2xvY2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNsZXNzb25fbG9jYXRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGVzc29uX2xvY2F0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZXNzb25fbG9jYXRpb25cbiAgICovXG4gIHNldCBsZXNzb25fbG9jYXRpb24obGVzc29uX2xvY2F0aW9uKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChsZXNzb25fbG9jYXRpb24sIHNjb3JtMTJfcmVnZXguQ01JU3RyaW5nMjU2LCB0cnVlKSkge1xuICAgICAgdGhpcy4jbGVzc29uX2xvY2F0aW9uID0gbGVzc29uX2xvY2F0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjcmVkaXRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNyZWRpdCgpIHtcbiAgICByZXR1cm4gdGhpcy4jY3JlZGl0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NyZWRpdC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjcmVkaXRcbiAgICovXG4gIHNldCBjcmVkaXQoY3JlZGl0KSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNjcmVkaXQgPSBjcmVkaXQgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsZXNzb25fc3RhdHVzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsZXNzb25fc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNsZXNzb25fc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xlc3Nvbl9zdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlc3Nvbl9zdGF0dXNcbiAgICovXG4gIHNldCBsZXNzb25fc3RhdHVzKGxlc3Nvbl9zdGF0dXMpIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChsZXNzb25fc3RhdHVzLCBzY29ybTEyX3JlZ2V4LkNNSVN0YXR1cykpIHtcbiAgICAgICAgdGhpcy4jbGVzc29uX3N0YXR1cyA9IGxlc3Nvbl9zdGF0dXM7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQobGVzc29uX3N0YXR1cywgc2Nvcm0xMl9yZWdleC5DTUlTdGF0dXMyKSkge1xuICAgICAgICB0aGlzLiNsZXNzb25fc3RhdHVzID0gbGVzc29uX3N0YXR1cztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZW50cnlcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGVudHJ5KCkge1xuICAgIHJldHVybiB0aGlzLiNlbnRyeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNlbnRyeS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlbnRyeVxuICAgKi9cbiAgc2V0IGVudHJ5KGVudHJ5KSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNlbnRyeSA9IGVudHJ5IDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdG90YWxfdGltZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdG90YWxfdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jdG90YWxfdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0b3RhbF90aW1lLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvdGFsX3RpbWVcbiAgICovXG4gIHNldCB0b3RhbF90aW1lKHRvdGFsX3RpbWUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI3RvdGFsX3RpbWUgPSB0b3RhbF90aW1lIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGVzc29uX21vZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlc3Nvbl9tb2RlKCkge1xuICAgIHJldHVybiB0aGlzLiNsZXNzb25fbW9kZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsZXNzb25fbW9kZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZXNzb25fbW9kZVxuICAgKi9cbiAgc2V0IGxlc3Nvbl9tb2RlKGxlc3Nvbl9tb2RlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNsZXNzb25fbW9kZSA9IGxlc3Nvbl9tb2RlIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZXhpdC4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCBleGl0KCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNleGl0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2V4aXRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV4aXRcbiAgICovXG4gIHNldCBleGl0KGV4aXQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGV4aXQsIHNjb3JtMTJfcmVnZXguQ01JRXhpdCwgdHJ1ZSkpIHtcbiAgICAgIHRoaXMuI2V4aXQgPSBleGl0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzZXNzaW9uX3RpbWUuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgc2Vzc2lvbl90aW1lKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNzZXNzaW9uX3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc2Vzc2lvbl90aW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZXNzaW9uX3RpbWVcbiAgICovXG4gIHNldCBzZXNzaW9uX3RpbWUoc2Vzc2lvbl90aW1lKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChzZXNzaW9uX3RpbWUsIHNjb3JtMTJfcmVnZXguQ01JVGltZXNwYW4pKSB7XG4gICAgICB0aGlzLiNzZXNzaW9uX3RpbWUgPSBzZXNzaW9uX3RpbWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N1c3BlbmRfZGF0YVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3VzcGVuZF9kYXRhKCkge1xuICAgIHJldHVybiB0aGlzLiNzdXNwZW5kX2RhdGE7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3VzcGVuZF9kYXRhXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdXNwZW5kX2RhdGFcbiAgICovXG4gIHNldCBzdXNwZW5kX2RhdGEoc3VzcGVuZF9kYXRhKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChzdXNwZW5kX2RhdGEsIHNjb3JtMTJfcmVnZXguQ01JU3RyaW5nNDA5NiwgdHJ1ZSkpIHtcbiAgICAgIHRoaXMuI3N1c3BlbmRfZGF0YSA9IHN1c3BlbmRfZGF0YTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0aGUgY3VycmVudCBzZXNzaW9uIHRpbWUgdG8gdGhlIGV4aXN0aW5nIHRvdGFsIHRpbWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydF90aW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldEN1cnJlbnRUb3RhbFRpbWUoc3RhcnRfdGltZTogTnVtYmVyKSB7XG4gICAgbGV0IHNlc3Npb25UaW1lID0gdGhpcy4jc2Vzc2lvbl90aW1lO1xuICAgIGNvbnN0IHN0YXJ0VGltZSA9IHN0YXJ0X3RpbWU7XG5cbiAgICBpZiAodHlwZW9mIHN0YXJ0VGltZSAhPT0gJ3VuZGVmaW5lZCcgJiYgc3RhcnRUaW1lICE9PSBudWxsKSB7XG4gICAgICBjb25zdCBzZWNvbmRzID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBzdGFydFRpbWU7XG4gICAgICBzZXNzaW9uVGltZSA9IFV0aWwuZ2V0U2Vjb25kc0FzSEhNTVNTKHNlY29uZHMgLyAxMDAwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gVXRpbGl0aWVzLmFkZEhITU1TU1RpbWVTdHJpbmdzKFxuICAgICAgICB0aGlzLiN0b3RhbF90aW1lLFxuICAgICAgICBzZXNzaW9uVGltZSxcbiAgICAgICAgbmV3IFJlZ0V4cChzY29ybTEyX3JlZ2V4LkNNSVRpbWVzcGFuKSxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmNvcmVcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBzdHVkZW50X25hbWU6IHN0cmluZyxcbiAgICogICAgICBlbnRyeTogc3RyaW5nLFxuICAgKiAgICAgIGV4aXQ6IHN0cmluZyxcbiAgICogICAgICBzY29yZTogQ01JU2NvcmUsXG4gICAqICAgICAgc3R1ZGVudF9pZDogc3RyaW5nLFxuICAgKiAgICAgIGxlc3Nvbl9tb2RlOiBzdHJpbmcsXG4gICAqICAgICAgbGVzc29uX2xvY2F0aW9uOiBzdHJpbmcsXG4gICAqICAgICAgbGVzc29uX3N0YXR1czogc3RyaW5nLFxuICAgKiAgICAgIGNyZWRpdDogc3RyaW5nLFxuICAgKiAgICAgIHNlc3Npb25fdGltZTogKlxuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnc3R1ZGVudF9pZCc6IHRoaXMuc3R1ZGVudF9pZCxcbiAgICAgICdzdHVkZW50X25hbWUnOiB0aGlzLnN0dWRlbnRfbmFtZSxcbiAgICAgICdsZXNzb25fbG9jYXRpb24nOiB0aGlzLmxlc3Nvbl9sb2NhdGlvbixcbiAgICAgICdjcmVkaXQnOiB0aGlzLmNyZWRpdCxcbiAgICAgICdsZXNzb25fc3RhdHVzJzogdGhpcy5sZXNzb25fc3RhdHVzLFxuICAgICAgJ2VudHJ5JzogdGhpcy5lbnRyeSxcbiAgICAgICdsZXNzb25fbW9kZSc6IHRoaXMubGVzc29uX21vZGUsXG4gICAgICAnZXhpdCc6IHRoaXMuZXhpdCxcbiAgICAgICdzZXNzaW9uX3RpbWUnOiB0aGlzLnNlc3Npb25fdGltZSxcbiAgICAgICdzY29yZSc6IHRoaXMuc2NvcmUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLm9iamVjdGl2ZXMgb2JqZWN0XG4gKiBAZXh0ZW5kcyBDTUlBcnJheVxuICovXG5jbGFzcyBDTUlPYmplY3RpdmVzIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5vYmplY3RpdmVzXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogc2Nvcm0xMl9jb25zdGFudHMub2JqZWN0aXZlc19jaGlsZHJlbixcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgIGVycm9yQ2xhc3M6IFNjb3JtMTJWYWxpZGF0aW9uRXJyb3IsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLnN0dWRlbnRfZGF0YSBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSVN0dWRlbnREYXRhIGV4dGVuZHMgQmFzZUNNSSB7XG4gICNfY2hpbGRyZW47XG4gICNtYXN0ZXJ5X3Njb3JlID0gJyc7XG4gICNtYXhfdGltZV9hbGxvd2VkID0gJyc7XG4gICN0aW1lX2xpbWl0X2FjdGlvbiA9ICcnO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLnN0dWRlbnRfZGF0YVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3R1ZGVudF9kYXRhX2NoaWxkcmVuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzdHVkZW50X2RhdGFfY2hpbGRyZW4pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy4jX2NoaWxkcmVuID0gc3R1ZGVudF9kYXRhX2NoaWxkcmVuID9cbiAgICAgICAgc3R1ZGVudF9kYXRhX2NoaWxkcmVuIDpcbiAgICAgICAgc2Nvcm0xMl9jb25zdGFudHMuc3R1ZGVudF9kYXRhX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI19jaGlsZHJlblxuICAgKiBAcmV0dXJuIHsqfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IF9jaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI19jaGlsZHJlbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfY2hpbGRyZW5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldCBfY2hpbGRyZW4oX2NoaWxkcmVuKSB7XG4gICAgdGhyb3dJbnZhbGlkVmFsdWVFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI21hc3Rlcl9zY29yZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbWFzdGVyeV9zY29yZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbWFzdGVyeV9zY29yZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNtYXN0ZXJfc2NvcmUuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWFzdGVyeV9zY29yZVxuICAgKi9cbiAgc2V0IG1hc3Rlcnlfc2NvcmUobWFzdGVyeV9zY29yZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jbWFzdGVyeV9zY29yZSA9IG1hc3Rlcnlfc2NvcmUgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNtYXhfdGltZV9hbGxvd2VkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBtYXhfdGltZV9hbGxvd2VkKCkge1xuICAgIHJldHVybiB0aGlzLiNtYXhfdGltZV9hbGxvd2VkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI21heF90aW1lX2FsbG93ZWQuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWF4X3RpbWVfYWxsb3dlZFxuICAgKi9cbiAgc2V0IG1heF90aW1lX2FsbG93ZWQobWF4X3RpbWVfYWxsb3dlZCkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jbWF4X3RpbWVfYWxsb3dlZCA9IG1heF90aW1lX2FsbG93ZWQgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0aW1lX2xpbWl0X2FjdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGltZV9saW1pdF9hY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWVfbGltaXRfYWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpbWVfbGltaXRfYWN0aW9uLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVfbGltaXRfYWN0aW9uXG4gICAqL1xuICBzZXQgdGltZV9saW1pdF9hY3Rpb24odGltZV9saW1pdF9hY3Rpb24pIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI3RpbWVfbGltaXRfYWN0aW9uID0gdGltZV9saW1pdF9hY3Rpb24gOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5zdHVkZW50X2RhdGFcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBtYXhfdGltZV9hbGxvd2VkOiBzdHJpbmcsXG4gICAqICAgICAgdGltZV9saW1pdF9hY3Rpb246IHN0cmluZyxcbiAgICogICAgICBtYXN0ZXJ5X3Njb3JlOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ21hc3Rlcnlfc2NvcmUnOiB0aGlzLm1hc3Rlcnlfc2NvcmUsXG4gICAgICAnbWF4X3RpbWVfYWxsb3dlZCc6IHRoaXMubWF4X3RpbWVfYWxsb3dlZCxcbiAgICAgICd0aW1lX2xpbWl0X2FjdGlvbic6IHRoaXMudGltZV9saW1pdF9hY3Rpb24sXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLnN0dWRlbnRfcHJlZmVyZW5jZSBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSVN0dWRlbnRQcmVmZXJlbmNlIGV4dGVuZHMgQmFzZUNNSSB7XG4gICNfY2hpbGRyZW47XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuc3R1ZGVudF9wcmVmZXJlbmNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHVkZW50X3ByZWZlcmVuY2VfY2hpbGRyZW5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbikge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLiNfY2hpbGRyZW4gPSBzdHVkZW50X3ByZWZlcmVuY2VfY2hpbGRyZW4gP1xuICAgICAgICBzdHVkZW50X3ByZWZlcmVuY2VfY2hpbGRyZW4gOlxuICAgICAgICBzY29ybTEyX2NvbnN0YW50cy5zdHVkZW50X3ByZWZlcmVuY2VfY2hpbGRyZW47XG4gIH1cblxuICAjYXVkaW8gPSAnJztcbiAgI2xhbmd1YWdlID0gJyc7XG4gICNzcGVlZCA9ICcnO1xuICAjdGV4dCA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNfY2hpbGRyZW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IF9jaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI19jaGlsZHJlbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfY2hpbGRyZW5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldCBfY2hpbGRyZW4oX2NoaWxkcmVuKSB7XG4gICAgdGhyb3dJbnZhbGlkVmFsdWVFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2F1ZGlvXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBhdWRpbygpIHtcbiAgICByZXR1cm4gdGhpcy4jYXVkaW87XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjYXVkaW9cbiAgICogQHBhcmFtIHtzdHJpbmd9IGF1ZGlvXG4gICAqL1xuICBzZXQgYXVkaW8oYXVkaW8pIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGF1ZGlvLCBzY29ybTEyX3JlZ2V4LkNNSVNJbnRlZ2VyKSAmJlxuICAgICAgICBjaGVjazEyVmFsaWRSYW5nZShhdWRpbywgc2Nvcm0xMl9yZWdleC5hdWRpb19yYW5nZSkpIHtcbiAgICAgIHRoaXMuI2F1ZGlvID0gYXVkaW87XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xhbmd1YWdlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsYW5ndWFnZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGFuZ3VhZ2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGFuZ3VhZ2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhbmd1YWdlXG4gICAqL1xuICBzZXQgbGFuZ3VhZ2UobGFuZ3VhZ2UpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGxhbmd1YWdlLCBzY29ybTEyX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI2xhbmd1YWdlID0gbGFuZ3VhZ2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3NwZWVkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzcGVlZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jc3BlZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3BlZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNwZWVkXG4gICAqL1xuICBzZXQgc3BlZWQoc3BlZWQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHNwZWVkLCBzY29ybTEyX3JlZ2V4LkNNSVNJbnRlZ2VyKSAmJlxuICAgICAgICBjaGVjazEyVmFsaWRSYW5nZShzcGVlZCwgc2Nvcm0xMl9yZWdleC5zcGVlZF9yYW5nZSkpIHtcbiAgICAgIHRoaXMuI3NwZWVkID0gc3BlZWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RleHRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RleHQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGV4dFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuICAgKi9cbiAgc2V0IHRleHQodGV4dCkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQodGV4dCwgc2Nvcm0xMl9yZWdleC5DTUlTSW50ZWdlcikgJiZcbiAgICAgICAgY2hlY2sxMlZhbGlkUmFuZ2UodGV4dCwgc2Nvcm0xMl9yZWdleC50ZXh0X3JhbmdlKSkge1xuICAgICAgdGhpcy4jdGV4dCA9IHRleHQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLnN0dWRlbnRfcHJlZmVyZW5jZVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGF1ZGlvOiBzdHJpbmcsXG4gICAqICAgICAgbGFuZ3VhZ2U6IHN0cmluZyxcbiAgICogICAgICBzcGVlZDogc3RyaW5nLFxuICAgKiAgICAgIHRleHQ6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnYXVkaW8nOiB0aGlzLmF1ZGlvLFxuICAgICAgJ2xhbmd1YWdlJzogdGhpcy5sYW5ndWFnZSxcbiAgICAgICdzcGVlZCc6IHRoaXMuc3BlZWQsXG4gICAgICAndGV4dCc6IHRoaXMudGV4dCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkuaW50ZXJhY3Rpb25zIG9iamVjdFxuICogQGV4dGVuZHMgQmFzZUNNSVxuICovXG5jbGFzcyBDTUlJbnRlcmFjdGlvbnMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmludGVyYWN0aW9uc1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe1xuICAgICAgY2hpbGRyZW46IHNjb3JtMTJfY29uc3RhbnRzLmludGVyYWN0aW9uc19jaGlsZHJlbixcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgIGVycm9yQ2xhc3M6IFNjb3JtMTJWYWxpZGF0aW9uRXJyb3IsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLmludGVyYWN0aW9ucy5uIG9iamVjdFxuICogQGV4dGVuZHMgQmFzZUNNSVxuICovXG5leHBvcnQgY2xhc3MgQ01JSW50ZXJhY3Rpb25zT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmludGVyYWN0aW9ucy5uIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMub2JqZWN0aXZlcyA9IG5ldyBDTUlBcnJheSh7XG4gICAgICBlcnJvckNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUsXG4gICAgICBlcnJvckNsYXNzOiBTY29ybTEyVmFsaWRhdGlvbkVycm9yLFxuICAgICAgY2hpbGRyZW46IHNjb3JtMTJfY29uc3RhbnRzLm9iamVjdGl2ZXNfY2hpbGRyZW4sXG4gICAgfSk7XG4gICAgdGhpcy5jb3JyZWN0X3Jlc3BvbnNlcyA9IG5ldyBDTUlBcnJheSh7XG4gICAgICBlcnJvckNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUsXG4gICAgICBlcnJvckNsYXNzOiBTY29ybTEyVmFsaWRhdGlvbkVycm9yLFxuICAgICAgY2hpbGRyZW46IHNjb3JtMTJfY29uc3RhbnRzLmNvcnJlY3RfcmVzcG9uc2VzX2NoaWxkcmVuLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLm9iamVjdGl2ZXM/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmNvcnJlY3RfcmVzcG9uc2VzPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAjaWQgPSAnJztcbiAgI3RpbWUgPSAnJztcbiAgI3R5cGUgPSAnJztcbiAgI3dlaWdodGluZyA9ICcnO1xuICAjc3R1ZGVudF9yZXNwb25zZSA9ICcnO1xuICAjcmVzdWx0ID0gJyc7XG4gICNsYXRlbmN5ID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2lkLiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IGlkKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNpZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNpZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICovXG4gIHNldCBpZChpZCkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoaWQsIHNjb3JtMTJfcmVnZXguQ01JSWRlbnRpZmllcikpIHtcbiAgICAgIHRoaXMuI2lkID0gaWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWUuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgdGltZSgpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lXG4gICAqL1xuICBzZXQgdGltZSh0aW1lKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh0aW1lLCBzY29ybTEyX3JlZ2V4LkNNSVRpbWUpKSB7XG4gICAgICB0aGlzLiN0aW1lID0gdGltZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdHlwZS4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiN0eXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3R5cGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAgICovXG4gIHNldCB0eXBlKHR5cGUpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHR5cGUsIHNjb3JtMTJfcmVnZXguQ01JVHlwZSkpIHtcbiAgICAgIHRoaXMuI3R5cGUgPSB0eXBlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN3ZWlnaHRpbmcuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgd2VpZ2h0aW5nKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgP1xuICAgICAgICB0aHJvd1dyaXRlT25seUVycm9yKCkgOlxuICAgICAgICB0aGlzLiN3ZWlnaHRpbmc7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjd2VpZ2h0aW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3ZWlnaHRpbmdcbiAgICovXG4gIHNldCB3ZWlnaHRpbmcod2VpZ2h0aW5nKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh3ZWlnaHRpbmcsIHNjb3JtMTJfcmVnZXguQ01JRGVjaW1hbCkgJiZcbiAgICAgICAgY2hlY2sxMlZhbGlkUmFuZ2Uod2VpZ2h0aW5nLCBzY29ybTEyX3JlZ2V4LndlaWdodGluZ19yYW5nZSkpIHtcbiAgICAgIHRoaXMuI3dlaWdodGluZyA9IHdlaWdodGluZztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3R1ZGVudF9yZXNwb25zZS4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCBzdHVkZW50X3Jlc3BvbnNlKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNzdHVkZW50X3Jlc3BvbnNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N0dWRlbnRfcmVzcG9uc2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0dWRlbnRfcmVzcG9uc2VcbiAgICovXG4gIHNldCBzdHVkZW50X3Jlc3BvbnNlKHN0dWRlbnRfcmVzcG9uc2UpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHN0dWRlbnRfcmVzcG9uc2UsIHNjb3JtMTJfcmVnZXguQ01JRmVlZGJhY2ssIHRydWUpKSB7XG4gICAgICB0aGlzLiNzdHVkZW50X3Jlc3BvbnNlID0gc3R1ZGVudF9yZXNwb25zZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjcmVzdWx0LiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IHJlc3VsdCgpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3Jlc3VsdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVzdWx0XG4gICAqL1xuICBzZXQgcmVzdWx0KHJlc3VsdCkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQocmVzdWx0LCBzY29ybTEyX3JlZ2V4LkNNSVJlc3VsdCkpIHtcbiAgICAgIHRoaXMuI3Jlc3VsdCA9IHJlc3VsdDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGF0ZW5jeS4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCBsYXRlbmN5KCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNsYXRlbmN5O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xhdGVuY3lcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhdGVuY3lcbiAgICovXG4gIHNldCBsYXRlbmN5KGxhdGVuY3kpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGxhdGVuY3ksIHNjb3JtMTJfcmVnZXguQ01JVGltZXNwYW4pKSB7XG4gICAgICB0aGlzLiNsYXRlbmN5ID0gbGF0ZW5jeTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuaW50ZXJhY3Rpb25zLm5cbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBpZDogc3RyaW5nLFxuICAgKiAgICAgIHRpbWU6IHN0cmluZyxcbiAgICogICAgICB0eXBlOiBzdHJpbmcsXG4gICAqICAgICAgd2VpZ2h0aW5nOiBzdHJpbmcsXG4gICAqICAgICAgc3R1ZGVudF9yZXNwb25zZTogc3RyaW5nLFxuICAgKiAgICAgIHJlc3VsdDogc3RyaW5nLFxuICAgKiAgICAgIGxhdGVuY3k6IHN0cmluZyxcbiAgICogICAgICBvYmplY3RpdmVzOiBDTUlBcnJheSxcbiAgICogICAgICBjb3JyZWN0X3Jlc3BvbnNlczogQ01JQXJyYXlcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICAgICd0aW1lJzogdGhpcy50aW1lLFxuICAgICAgJ3R5cGUnOiB0aGlzLnR5cGUsXG4gICAgICAnd2VpZ2h0aW5nJzogdGhpcy53ZWlnaHRpbmcsXG4gICAgICAnc3R1ZGVudF9yZXNwb25zZSc6IHRoaXMuc3R1ZGVudF9yZXNwb25zZSxcbiAgICAgICdyZXN1bHQnOiB0aGlzLnJlc3VsdCxcbiAgICAgICdsYXRlbmN5JzogdGhpcy5sYXRlbmN5LFxuICAgICAgJ29iamVjdGl2ZXMnOiB0aGlzLm9iamVjdGl2ZXMsXG4gICAgICAnY29ycmVjdF9yZXNwb25zZXMnOiB0aGlzLmNvcnJlY3RfcmVzcG9uc2VzLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5vYmplY3RpdmVzLm4gb2JqZWN0XG4gKiBAZXh0ZW5kcyBCYXNlQ01JXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlPYmplY3RpdmVzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLm9iamVjdGl2ZXMublxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc2NvcmUgPSBuZXcgQ01JU2NvcmUoXG4gICAgICAgIHtcbiAgICAgICAgICBzY29yZV9jaGlsZHJlbjogc2Nvcm0xMl9jb25zdGFudHMuc2NvcmVfY2hpbGRyZW4sXG4gICAgICAgICAgc2NvcmVfcmFuZ2U6IHNjb3JtMTJfcmVnZXguc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgaW52YWxpZEVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgICAgICBpbnZhbGlkVHlwZUNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCxcbiAgICAgICAgICBpbnZhbGlkUmFuZ2VDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRSxcbiAgICAgICAgICBlcnJvckNsYXNzOiBTY29ybTEyVmFsaWRhdGlvbkVycm9yLFxuICAgICAgICB9KTtcbiAgfVxuXG4gICNpZCA9ICcnO1xuICAjc3RhdHVzID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2lkXG4gICAqIEByZXR1cm4ge1wiXCJ9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChpZCwgc2Nvcm0xMl9yZWdleC5DTUlJZGVudGlmaWVyKSkge1xuICAgICAgdGhpcy4jaWQgPSBpZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3RhdHVzXG4gICAqIEByZXR1cm4ge1wiXCJ9XG4gICAqL1xuICBnZXQgc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNzdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0dXNcbiAgICovXG4gIHNldCBzdGF0dXMoc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChzdGF0dXMsIHNjb3JtMTJfcmVnZXguQ01JU3RhdHVzMikpIHtcbiAgICAgIHRoaXMuI3N0YXR1cyA9IHN0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkub2JqZWN0aXZlcy5uXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgaWQ6IHN0cmluZyxcbiAgICogICAgICBzdGF0dXM6IHN0cmluZyxcbiAgICogICAgICBzY29yZTogQ01JU2NvcmVcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICAgICdzdGF0dXMnOiB0aGlzLnN0YXR1cyxcbiAgICAgICdzY29yZSc6IHRoaXMuc2NvcmUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLmludGVyYWN0aW9ucy5uLm9iamVjdGl2ZXMubiBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc09iamVjdGl2ZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4ub2JqZWN0aXZlcy5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgI2lkID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2lkXG4gICAqIEByZXR1cm4ge1wiXCJ9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChpZCwgc2Nvcm0xMl9yZWdleC5DTUlJZGVudGlmaWVyKSkge1xuICAgICAgdGhpcy4jaWQgPSBpZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4ub2JqZWN0aXZlcy5uXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgaWQ6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnaWQnOiB0aGlzLmlkLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5pbnRlcmFjdGlvbnMuY29ycmVjdF9yZXNwb25zZXMubiBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc0NvcnJlY3RSZXNwb25zZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLmNvcnJlY3RfcmVzcG9uc2VzLm5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAjcGF0dGVybiA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNwYXR0ZXJuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBwYXR0ZXJuKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNwYXR0ZXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3BhdHRlcm5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdHRlcm5cbiAgICovXG4gIHNldCBwYXR0ZXJuKHBhdHRlcm4pIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHBhdHRlcm4sIHNjb3JtMTJfcmVnZXguQ01JRmVlZGJhY2ssIHRydWUpKSB7XG4gICAgICB0aGlzLiNwYXR0ZXJuID0gcGF0dGVybjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuaW50ZXJhY3Rpb25zLmNvcnJlY3RfcmVzcG9uc2VzLm5cbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBwYXR0ZXJuOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3BhdHRlcm4nOiB0aGlzLnBhdHRlcm4sXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgQUlDQyBOYXZpZ2F0aW9uIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgTkFWIGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgTkFWIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gICNldmVudCA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNldmVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZXZlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2V2ZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2V2ZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgKi9cbiAgc2V0IGV2ZW50KGV2ZW50KSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChldmVudCwgc2Nvcm0xMl9yZWdleC5OQVZFdmVudCkpIHtcbiAgICAgIHRoaXMuI2V2ZW50ID0gZXZlbnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgbmF2IG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGV2ZW50OiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2V2ZW50JzogdGhpcy5ldmVudCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIiwiLy8gQGZsb3dcblxuY29uc3QgZ2xvYmFsID0ge1xuICBTQ09STV9UUlVFOiAndHJ1ZScsXG4gIFNDT1JNX0ZBTFNFOiAnZmFsc2UnLFxuICBTVEFURV9OT1RfSU5JVElBTElaRUQ6IDAsXG4gIFNUQVRFX0lOSVRJQUxJWkVEOiAxLFxuICBTVEFURV9URVJNSU5BVEVEOiAyLFxuICBMT0dfTEVWRUxfREVCVUc6IDEsXG4gIExPR19MRVZFTF9JTkZPOiAyLFxuICBMT0dfTEVWRUxfV0FSTklORzogMyxcbiAgTE9HX0xFVkVMX0VSUk9SOiA0LFxuICBMT0dfTEVWRUxfTk9ORTogNSxcbn07XG5cbmNvbnN0IHNjb3JtMTIgPSB7XG4gIC8vIENoaWxkcmVuIGxpc3RzXG4gIGNtaV9jaGlsZHJlbjogJ2NvcmUsc3VzcGVuZF9kYXRhLGxhdW5jaF9kYXRhLGNvbW1lbnRzLG9iamVjdGl2ZXMsc3R1ZGVudF9kYXRhLHN0dWRlbnRfcHJlZmVyZW5jZSxpbnRlcmFjdGlvbnMnLFxuICBjb3JlX2NoaWxkcmVuOiAnc3R1ZGVudF9pZCxzdHVkZW50X25hbWUsbGVzc29uX2xvY2F0aW9uLGNyZWRpdCxsZXNzb25fc3RhdHVzLGVudHJ5LHNjb3JlLHRvdGFsX3RpbWUsbGVzc29uX21vZGUsZXhpdCxzZXNzaW9uX3RpbWUnLFxuICBzY29yZV9jaGlsZHJlbjogJ3JhdyxtaW4sbWF4JyxcbiAgY29tbWVudHNfY2hpbGRyZW46ICdjb250ZW50LGxvY2F0aW9uLHRpbWUnLFxuICBvYmplY3RpdmVzX2NoaWxkcmVuOiAnaWQsc2NvcmUsc3RhdHVzJyxcbiAgY29ycmVjdF9yZXNwb25zZXNfY2hpbGRyZW46ICdwYXR0ZXJuJyxcbiAgc3R1ZGVudF9kYXRhX2NoaWxkcmVuOiAnbWFzdGVyeV9zY29yZSxtYXhfdGltZV9hbGxvd2VkLHRpbWVfbGltaXRfYWN0aW9uJyxcbiAgc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuOiAnYXVkaW8sbGFuZ3VhZ2Usc3BlZWQsdGV4dCcsXG4gIGludGVyYWN0aW9uc19jaGlsZHJlbjogJ2lkLG9iamVjdGl2ZXMsdGltZSx0eXBlLGNvcnJlY3RfcmVzcG9uc2VzLHdlaWdodGluZyxzdHVkZW50X3Jlc3BvbnNlLHJlc3VsdCxsYXRlbmN5JyxcblxuICBlcnJvcl9kZXNjcmlwdGlvbnM6IHtcbiAgICAnMTAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBFeGNlcHRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ05vIHNwZWNpZmljIGVycm9yIGNvZGUgZXhpc3RzIHRvIGRlc2NyaWJlIHRoZSBlcnJvci4gVXNlIExNU0dldERpYWdub3N0aWMgZm9yIG1vcmUgaW5mb3JtYXRpb24nLFxuICAgIH0sXG4gICAgJzIwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0ludmFsaWQgYXJndW1lbnQgZXJyb3InLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyB0aGF0IGFuIGFyZ3VtZW50IHJlcHJlc2VudHMgYW4gaW52YWxpZCBkYXRhIG1vZGVsIGVsZW1lbnQgb3IgaXMgb3RoZXJ3aXNlIGluY29ycmVjdC4nLFxuICAgIH0sXG4gICAgJzIwMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0VsZW1lbnQgY2Fubm90IGhhdmUgY2hpbGRyZW4nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyB0aGF0IExNU0dldFZhbHVlIHdhcyBjYWxsZWQgd2l0aCBhIGRhdGEgbW9kZWwgZWxlbWVudCBuYW1lIHRoYXQgZW5kcyBpbiBcIl9jaGlsZHJlblwiIGZvciBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IGRvZXMgbm90IHN1cHBvcnQgdGhlIFwiX2NoaWxkcmVuXCIgc3VmZml4LicsXG4gICAgfSxcbiAgICAnMjAzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRWxlbWVudCBub3QgYW4gYXJyYXkgLSBjYW5ub3QgaGF2ZSBjb3VudCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIHRoYXQgTE1TR2V0VmFsdWUgd2FzIGNhbGxlZCB3aXRoIGEgZGF0YSBtb2RlbCBlbGVtZW50IG5hbWUgdGhhdCBlbmRzIGluIFwiX2NvdW50XCIgZm9yIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgZG9lcyBub3Qgc3VwcG9ydCB0aGUgXCJfY291bnRcIiBzdWZmaXguJyxcbiAgICB9LFxuICAgICczMDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdOb3QgaW5pdGlhbGl6ZWQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyB0aGF0IGFuIEFQSSBjYWxsIHdhcyBtYWRlIGJlZm9yZSB0aGUgY2FsbCB0byBsbXNJbml0aWFsaXplLicsXG4gICAgfSxcbiAgICAnNDAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnTm90IGltcGxlbWVudGVkIGVycm9yJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdUaGUgZGF0YSBtb2RlbCBlbGVtZW50IGluZGljYXRlZCBpbiBhIGNhbGwgdG8gTE1TR2V0VmFsdWUgb3IgTE1TU2V0VmFsdWUgaXMgdmFsaWQsIGJ1dCB3YXMgbm90IGltcGxlbWVudGVkIGJ5IHRoaXMgTE1TLiBTQ09STSAxLjIgZGVmaW5lcyBhIHNldCBvZiBkYXRhIG1vZGVsIGVsZW1lbnRzIGFzIGJlaW5nIG9wdGlvbmFsIGZvciBhbiBMTVMgdG8gaW1wbGVtZW50LicsXG4gICAgfSxcbiAgICAnNDAyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnSW52YWxpZCBzZXQgdmFsdWUsIGVsZW1lbnQgaXMgYSBrZXl3b3JkJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgdGhhdCBMTVNTZXRWYWx1ZSB3YXMgY2FsbGVkIG9uIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgcmVwcmVzZW50cyBhIGtleXdvcmQgKGVsZW1lbnRzIHRoYXQgZW5kIGluIFwiX2NoaWxkcmVuXCIgYW5kIFwiX2NvdW50XCIpLicsXG4gICAgfSxcbiAgICAnNDAzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRWxlbWVudCBpcyByZWFkIG9ubHknLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0xNU1NldFZhbHVlIHdhcyBjYWxsZWQgd2l0aCBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IGNhbiBvbmx5IGJlIHJlYWQuJyxcbiAgICB9LFxuICAgICc0MDQnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdFbGVtZW50IGlzIHdyaXRlIG9ubHknLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0xNU0dldFZhbHVlIHdhcyBjYWxsZWQgb24gYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBjYW4gb25seSBiZSB3cml0dGVuIHRvLicsXG4gICAgfSxcbiAgICAnNDA1Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnSW5jb3JyZWN0IERhdGEgVHlwZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTE1TU2V0VmFsdWUgd2FzIGNhbGxlZCB3aXRoIGEgdmFsdWUgdGhhdCBpcyBub3QgY29uc2lzdGVudCB3aXRoIHRoZSBkYXRhIGZvcm1hdCBvZiB0aGUgc3VwcGxpZWQgZGF0YSBtb2RlbCBlbGVtZW50LicsXG4gICAgfSxcbiAgICAnNDA3Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRWxlbWVudCBWYWx1ZSBPdXQgT2YgUmFuZ2UnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1RoZSBudW1lcmljIHZhbHVlIHN1cHBsaWVkIHRvIGEgTE1TU2V0VmFsdWUgY2FsbCBpcyBvdXRzaWRlIG9mIHRoZSBudW1lcmljIHJhbmdlIGFsbG93ZWQgZm9yIHRoZSBzdXBwbGllZCBkYXRhIG1vZGVsIGVsZW1lbnQuJyxcbiAgICB9LFxuICAgICc0MDgnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdEYXRhIE1vZGVsIERlcGVuZGVuY3kgTm90IEVzdGFibGlzaGVkJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdTb21lIGRhdGEgbW9kZWwgZWxlbWVudHMgY2Fubm90IGJlIHNldCB1bnRpbCBhbm90aGVyIGRhdGEgbW9kZWwgZWxlbWVudCB3YXMgc2V0LiBUaGlzIGVycm9yIGNvbmRpdGlvbiBpbmRpY2F0ZXMgdGhhdCB0aGUgcHJlcmVxdWlzaXRlIGVsZW1lbnQgd2FzIG5vdCBzZXQgYmVmb3JlIHRoZSBkZXBlbmRlbnQgZWxlbWVudC4nLFxuICAgIH0sXG4gIH0sXG59O1xuXG5jb25zdCBhaWNjID0ge1xuICAuLi5zY29ybTEyLCAuLi57XG4gICAgY21pX2NoaWxkcmVuOiAnY29yZSxzdXNwZW5kX2RhdGEsbGF1bmNoX2RhdGEsY29tbWVudHMsb2JqZWN0aXZlcyxzdHVkZW50X2RhdGEsc3R1ZGVudF9wcmVmZXJlbmNlLGludGVyYWN0aW9ucyxldmFsdWF0aW9uJyxcbiAgICBzdHVkZW50X3ByZWZlcmVuY2VfY2hpbGRyZW46ICdhdWRpbyxsYW5ndWFnZSxsZXNzb25fdHlwZSxzcGVlZCx0ZXh0LHRleHRfY29sb3IsdGV4dF9sb2NhdGlvbix0ZXh0X3NpemUsdmlkZW8sd2luZG93cycsXG4gICAgc3R1ZGVudF9kYXRhX2NoaWxkcmVuOiAnYXR0ZW1wdF9udW1iZXIsdHJpZXMsbWFzdGVyeV9zY29yZSxtYXhfdGltZV9hbGxvd2VkLHRpbWVfbGltaXRfYWN0aW9uJyxcbiAgICBzdHVkZW50X2RlbW9ncmFwaGljc19jaGlsZHJlbjogJ2NpdHksY2xhc3MsY29tcGFueSxjb3VudHJ5LGV4cGVyaWVuY2UsZmFtaWxpYXJfbmFtZSxpbnN0cnVjdG9yX25hbWUsdGl0bGUsbmF0aXZlX2xhbmd1YWdlLHN0YXRlLHN0cmVldF9hZGRyZXNzLHRlbGVwaG9uZSx5ZWFyc19leHBlcmllbmNlJyxcbiAgICB0cmllc19jaGlsZHJlbjogJ3RpbWUsc3RhdHVzLHNjb3JlJyxcbiAgICBhdHRlbXB0X3JlY29yZHNfY2hpbGRyZW46ICdzY29yZSxsZXNzb25fc3RhdHVzJyxcbiAgICBwYXRoc19jaGlsZHJlbjogJ2xvY2F0aW9uX2lkLGRhdGUsdGltZSxzdGF0dXMsd2h5X2xlZnQsdGltZV9pbl9lbGVtZW50JyxcbiAgfSxcbn07XG5cbmNvbnN0IHNjb3JtMjAwNCA9IHtcbiAgLy8gQ2hpbGRyZW4gbGlzdHNcbiAgY21pX2NoaWxkcmVuOiAnX3ZlcnNpb24sY29tbWVudHNfZnJvbV9sZWFybmVyLGNvbW1lbnRzX2Zyb21fbG1zLGNvbXBsZXRpb25fc3RhdHVzLGNyZWRpdCxlbnRyeSxleGl0LGludGVyYWN0aW9ucyxsYXVuY2hfZGF0YSxsZWFybmVyX2lkLGxlYXJuZXJfbmFtZSxsZWFybmVyX3ByZWZlcmVuY2UsbG9jYXRpb24sbWF4X3RpbWVfYWxsb3dlZCxtb2RlLG9iamVjdGl2ZXMscHJvZ3Jlc3NfbWVhc3VyZSxzY2FsZWRfcGFzc2luZ19zY29yZSxzY29yZSxzZXNzaW9uX3RpbWUsc3VjY2Vzc19zdGF0dXMsc3VzcGVuZF9kYXRhLHRpbWVfbGltaXRfYWN0aW9uLHRvdGFsX3RpbWUnLFxuICBjb21tZW50c19jaGlsZHJlbjogJ2NvbW1lbnQsdGltZXN0YW1wLGxvY2F0aW9uJyxcbiAgc2NvcmVfY2hpbGRyZW46ICdtYXgscmF3LHNjYWxlZCxtaW4nLFxuICBvYmplY3RpdmVzX2NoaWxkcmVuOiAncHJvZ3Jlc3NfbWVhc3VyZSxjb21wbGV0aW9uX3N0YXR1cyxzdWNjZXNzX3N0YXR1cyxkZXNjcmlwdGlvbixzY29yZSxpZCcsXG4gIGNvcnJlY3RfcmVzcG9uc2VzX2NoaWxkcmVuOiAncGF0dGVybicsXG4gIHN0dWRlbnRfZGF0YV9jaGlsZHJlbjogJ21hc3Rlcnlfc2NvcmUsbWF4X3RpbWVfYWxsb3dlZCx0aW1lX2xpbWl0X2FjdGlvbicsXG4gIHN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbjogJ2F1ZGlvX2xldmVsLGF1ZGlvX2NhcHRpb25pbmcsZGVsaXZlcnlfc3BlZWQsbGFuZ3VhZ2UnLFxuICBpbnRlcmFjdGlvbnNfY2hpbGRyZW46ICdpZCx0eXBlLG9iamVjdGl2ZXMsdGltZXN0YW1wLGNvcnJlY3RfcmVzcG9uc2VzLHdlaWdodGluZyxsZWFybmVyX3Jlc3BvbnNlLHJlc3VsdCxsYXRlbmN5LGRlc2NyaXB0aW9uJyxcblxuICBlcnJvcl9kZXNjcmlwdGlvbnM6IHtcbiAgICAnMCc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ05vIEVycm9yJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdObyBlcnJvciBvY2N1cnJlZCwgdGhlIHByZXZpb3VzIEFQSSBjYWxsIHdhcyBzdWNjZXNzZnVsLicsXG4gICAgfSxcbiAgICAnMTAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBFeGNlcHRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ05vIHNwZWNpZmljIGVycm9yIGNvZGUgZXhpc3RzIHRvIGRlc2NyaWJlIHRoZSBlcnJvci4gVXNlIEdldERpYWdub3N0aWMgZm9yIG1vcmUgaW5mb3JtYXRpb24uJyxcbiAgICB9LFxuICAgICcxMDInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIEluaXRpYWxpemF0aW9uIEZhaWx1cmUnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gSW5pdGlhbGl6ZSBmYWlsZWQgZm9yIGFuIHVua25vd24gcmVhc29uLicsXG4gICAgfSxcbiAgICAnMTAzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnQWxyZWFkeSBJbml0aWFsaXplZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBJbml0aWFsaXplIGZhaWxlZCBiZWNhdXNlIEluaXRpYWxpemUgd2FzIGFscmVhZHkgY2FsbGVkLicsXG4gICAgfSxcbiAgICAnMTA0Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnQ29udGVudCBJbnN0YW5jZSBUZXJtaW5hdGVkJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIEluaXRpYWxpemUgZmFpbGVkIGJlY2F1c2UgVGVybWluYXRlIHdhcyBhbHJlYWR5IGNhbGxlZC4nLFxuICAgIH0sXG4gICAgJzExMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgVGVybWluYXRpb24gRmFpbHVyZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBUZXJtaW5hdGUgZmFpbGVkIGZvciBhbiB1bmtub3duIHJlYXNvbi4nLFxuICAgIH0sXG4gICAgJzExMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1Rlcm1pbmF0aW9uIEJlZm9yZSBJbml0aWFsaXphdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBUZXJtaW5hdGUgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYmVmb3JlIHRoZSBjYWxsIHRvIEluaXRpYWxpemUuJyxcbiAgICB9LFxuICAgICcxMTMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdUZXJtaW5hdGlvbiBBZnRlciBUZXJtaW5hdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBUZXJtaW5hdGUgZmFpbGVkIGJlY2F1c2UgVGVybWluYXRlIHdhcyBhbHJlYWR5IGNhbGxlZC4nLFxuICAgIH0sXG4gICAgJzEyMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1JldHJpZXZlIERhdGEgQmVmb3JlIEluaXRpYWxpemF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIEdldFZhbHVlIGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGJlZm9yZSB0aGUgY2FsbCB0byBJbml0aWFsaXplLicsXG4gICAgfSxcbiAgICAnMTIzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnUmV0cmlldmUgRGF0YSBBZnRlciBUZXJtaW5hdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBHZXRWYWx1ZSBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBhZnRlciB0aGUgY2FsbCB0byBUZXJtaW5hdGUuJyxcbiAgICB9LFxuICAgICcxMzInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdTdG9yZSBEYXRhIEJlZm9yZSBJbml0aWFsaXphdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBTZXRWYWx1ZSBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBiZWZvcmUgdGhlIGNhbGwgdG8gSW5pdGlhbGl6ZS4nLFxuICAgIH0sXG4gICAgJzEzMyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1N0b3JlIERhdGEgQWZ0ZXIgVGVybWluYXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gU2V0VmFsdWUgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYWZ0ZXIgdGhlIGNhbGwgdG8gVGVybWluYXRlLicsXG4gICAgfSxcbiAgICAnMTQyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnQ29tbWl0IEJlZm9yZSBJbml0aWFsaXphdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBDb21taXQgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYmVmb3JlIHRoZSBjYWxsIHRvIEluaXRpYWxpemUuJyxcbiAgICB9LFxuICAgICcxNDMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdDb21taXQgQWZ0ZXIgVGVybWluYXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gQ29tbWl0IGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGFmdGVyIHRoZSBjYWxsIHRvIFRlcm1pbmF0ZS4nLFxuICAgIH0sXG4gICAgJzIwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgQXJndW1lbnQgRXJyb3InLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0FuIGludmFsaWQgYXJndW1lbnQgd2FzIHBhc3NlZCB0byBhbiBBUEkgbWV0aG9kICh1c3VhbGx5IGluZGljYXRlcyB0aGF0IEluaXRpYWxpemUsIENvbW1pdCBvciBUZXJtaW5hdGUgZGlkIG5vdCByZWNlaXZlIHRoZSBleHBlY3RlZCBlbXB0eSBzdHJpbmcgYXJndW1lbnQuJyxcbiAgICB9LFxuICAgICczMDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIEdldCBGYWlsdXJlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgYSBmYWlsZWQgR2V0VmFsdWUgY2FsbCB3aGVyZSBubyBvdGhlciBzcGVjaWZpYyBlcnJvciBjb2RlIGlzIGFwcGxpY2FibGUuIFVzZSBHZXREaWFnbm9zdGljIGZvciBtb3JlIGluZm9ybWF0aW9uLicsXG4gICAgfSxcbiAgICAnMzUxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBTZXQgRmFpbHVyZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIGEgZmFpbGVkIFNldFZhbHVlIGNhbGwgd2hlcmUgbm8gb3RoZXIgc3BlY2lmaWMgZXJyb3IgY29kZSBpcyBhcHBsaWNhYmxlLiBVc2UgR2V0RGlhZ25vc3RpYyBmb3IgbW9yZSBpbmZvcm1hdGlvbi4nLFxuICAgIH0sXG4gICAgJzM5MSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgQ29tbWl0IEZhaWx1cmUnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyBhIGZhaWxlZCBDb21taXQgY2FsbCB3aGVyZSBubyBvdGhlciBzcGVjaWZpYyBlcnJvciBjb2RlIGlzIGFwcGxpY2FibGUuIFVzZSBHZXREaWFnbm9zdGljIGZvciBtb3JlIGluZm9ybWF0aW9uLicsXG4gICAgfSxcbiAgICAnNDAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnVW5kZWZpbmVkIERhdGEgTW9kZWwgRWxlbWVudCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnVGhlIGRhdGEgbW9kZWwgZWxlbWVudCBuYW1lIHBhc3NlZCB0byBHZXRWYWx1ZSBvciBTZXRWYWx1ZSBpcyBub3QgYSB2YWxpZCBTQ09STSBkYXRhIG1vZGVsIGVsZW1lbnQuJyxcbiAgICB9LFxuICAgICc0MDInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdVbmltcGxlbWVudGVkIERhdGEgTW9kZWwgRWxlbWVudCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnVGhlIGRhdGEgbW9kZWwgZWxlbWVudCBpbmRpY2F0ZWQgaW4gYSBjYWxsIHRvIEdldFZhbHVlIG9yIFNldFZhbHVlIGlzIHZhbGlkLCBidXQgd2FzIG5vdCBpbXBsZW1lbnRlZCBieSB0aGlzIExNUy4gSW4gU0NPUk0gMjAwNCwgdGhpcyBlcnJvciB3b3VsZCBpbmRpY2F0ZSBhbiBMTVMgdGhhdCBpcyBub3QgZnVsbHkgU0NPUk0gY29uZm9ybWFudC4nLFxuICAgIH0sXG4gICAgJzQwMyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0RhdGEgTW9kZWwgRWxlbWVudCBWYWx1ZSBOb3QgSW5pdGlhbGl6ZWQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0F0dGVtcHQgdG8gcmVhZCBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IGhhcyBub3QgYmVlbiBpbml0aWFsaXplZCBieSB0aGUgTE1TIG9yIHRocm91Z2ggYSBTZXRWYWx1ZSBjYWxsLiBUaGlzIGVycm9yIGNvbmRpdGlvbiBpcyBvZnRlbiByZWFjaGVkIGR1cmluZyBub3JtYWwgZXhlY3V0aW9uIG9mIGEgU0NPLicsXG4gICAgfSxcbiAgICAnNDA0Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBFbGVtZW50IElzIFJlYWQgT25seScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnU2V0VmFsdWUgd2FzIGNhbGxlZCB3aXRoIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgY2FuIG9ubHkgYmUgcmVhZC4nLFxuICAgIH0sXG4gICAgJzQwNSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0RhdGEgTW9kZWwgRWxlbWVudCBJcyBXcml0ZSBPbmx5JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdHZXRWYWx1ZSB3YXMgY2FsbGVkIG9uIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgY2FuIG9ubHkgYmUgd3JpdHRlbiB0by4nLFxuICAgIH0sXG4gICAgJzQwNic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0RhdGEgTW9kZWwgRWxlbWVudCBUeXBlIE1pc21hdGNoJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdTZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSB2YWx1ZSB0aGF0IGlzIG5vdCBjb25zaXN0ZW50IHdpdGggdGhlIGRhdGEgZm9ybWF0IG9mIHRoZSBzdXBwbGllZCBkYXRhIG1vZGVsIGVsZW1lbnQuJyxcbiAgICB9LFxuICAgICc0MDcnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdEYXRhIE1vZGVsIEVsZW1lbnQgVmFsdWUgT3V0IE9mIFJhbmdlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdUaGUgbnVtZXJpYyB2YWx1ZSBzdXBwbGllZCB0byBhIFNldFZhbHVlIGNhbGwgaXMgb3V0c2lkZSBvZiB0aGUgbnVtZXJpYyByYW5nZSBhbGxvd2VkIGZvciB0aGUgc3VwcGxpZWQgZGF0YSBtb2RlbCBlbGVtZW50LicsXG4gICAgfSxcbiAgICAnNDA4Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBEZXBlbmRlbmN5IE5vdCBFc3RhYmxpc2hlZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnU29tZSBkYXRhIG1vZGVsIGVsZW1lbnRzIGNhbm5vdCBiZSBzZXQgdW50aWwgYW5vdGhlciBkYXRhIG1vZGVsIGVsZW1lbnQgd2FzIHNldC4gVGhpcyBlcnJvciBjb25kaXRpb24gaW5kaWNhdGVzIHRoYXQgdGhlIHByZXJlcXVpc2l0ZSBlbGVtZW50IHdhcyBub3Qgc2V0IGJlZm9yZSB0aGUgZGVwZW5kZW50IGVsZW1lbnQuJyxcbiAgICB9LFxuICB9LFxufTtcblxuY29uc3QgQVBJQ29uc3RhbnRzID0ge1xuICBnbG9iYWw6IGdsb2JhbCxcbiAgc2Nvcm0xMjogc2Nvcm0xMixcbiAgYWljYzogYWljYyxcbiAgc2Nvcm0yMDA0OiBzY29ybTIwMDQsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBUElDb25zdGFudHM7XG4iLCIvLyBAZmxvd1xuY29uc3QgZ2xvYmFsID0ge1xuICBHRU5FUkFMOiAxMDEsXG4gIElOSVRJQUxJWkFUSU9OX0ZBSUxFRDogMTAxLFxuICBJTklUSUFMSVpFRDogMTAxLFxuICBURVJNSU5BVEVEOiAxMDEsXG4gIFRFUk1JTkFUSU9OX0ZBSUxVUkU6IDEwMSxcbiAgVEVSTUlOQVRJT05fQkVGT1JFX0lOSVQ6IDEwMSxcbiAgTVVMVElQTEVfVEVSTUlOQVRJT046IDEwMSxcbiAgUkVUUklFVkVfQkVGT1JFX0lOSVQ6IDEwMSxcbiAgUkVUUklFVkVfQUZURVJfVEVSTTogMTAxLFxuICBTVE9SRV9CRUZPUkVfSU5JVDogMTAxLFxuICBTVE9SRV9BRlRFUl9URVJNOiAxMDEsXG4gIENPTU1JVF9CRUZPUkVfSU5JVDogMTAxLFxuICBDT01NSVRfQUZURVJfVEVSTTogMTAxLFxuICBBUkdVTUVOVF9FUlJPUjogMTAxLFxuICBDSElMRFJFTl9FUlJPUjogMTAxLFxuICBDT1VOVF9FUlJPUjogMTAxLFxuICBHRU5FUkFMX0dFVF9GQUlMVVJFOiAxMDEsXG4gIEdFTkVSQUxfU0VUX0ZBSUxVUkU6IDEwMSxcbiAgR0VORVJBTF9DT01NSVRfRkFJTFVSRTogMTAxLFxuICBVTkRFRklORURfREFUQV9NT0RFTDogMTAxLFxuICBVTklNUExFTUVOVEVEX0VMRU1FTlQ6IDEwMSxcbiAgVkFMVUVfTk9UX0lOSVRJQUxJWkVEOiAxMDEsXG4gIElOVkFMSURfU0VUX1ZBTFVFOiAxMDEsXG4gIFJFQURfT05MWV9FTEVNRU5UOiAxMDEsXG4gIFdSSVRFX09OTFlfRUxFTUVOVDogMTAxLFxuICBUWVBFX01JU01BVENIOiAxMDEsXG4gIFZBTFVFX09VVF9PRl9SQU5HRTogMTAxLFxuICBERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRDogMTAxLFxufTtcblxuY29uc3Qgc2Nvcm0xMiA9IHtcbiAgLi4uZ2xvYmFsLCAuLi57XG4gICAgUkVUUklFVkVfQkVGT1JFX0lOSVQ6IDMwMSxcbiAgICBTVE9SRV9CRUZPUkVfSU5JVDogMzAxLFxuICAgIENPTU1JVF9CRUZPUkVfSU5JVDogMzAxLFxuICAgIEFSR1VNRU5UX0VSUk9SOiAyMDEsXG4gICAgQ0hJTERSRU5fRVJST1I6IDIwMixcbiAgICBDT1VOVF9FUlJPUjogMjAzLFxuICAgIFVOREVGSU5FRF9EQVRBX01PREVMOiA0MDEsXG4gICAgVU5JTVBMRU1FTlRFRF9FTEVNRU5UOiA0MDEsXG4gICAgVkFMVUVfTk9UX0lOSVRJQUxJWkVEOiAzMDEsXG4gICAgSU5WQUxJRF9TRVRfVkFMVUU6IDQwMixcbiAgICBSRUFEX09OTFlfRUxFTUVOVDogNDAzLFxuICAgIFdSSVRFX09OTFlfRUxFTUVOVDogNDA0LFxuICAgIFRZUEVfTUlTTUFUQ0g6IDQwNSxcbiAgICBWQUxVRV9PVVRfT0ZfUkFOR0U6IDQwNyxcbiAgICBERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRDogNDA4LFxuICB9LFxufTtcblxuY29uc3Qgc2Nvcm0yMDA0ID0ge1xuICAuLi5nbG9iYWwsIC4uLntcbiAgICBJTklUSUFMSVpBVElPTl9GQUlMRUQ6IDEwMixcbiAgICBJTklUSUFMSVpFRDogMTAzLFxuICAgIFRFUk1JTkFURUQ6IDEwNCxcbiAgICBURVJNSU5BVElPTl9GQUlMVVJFOiAxMTEsXG4gICAgVEVSTUlOQVRJT05fQkVGT1JFX0lOSVQ6IDExMixcbiAgICBNVUxUSVBMRV9URVJNSU5BVElPTlM6IDExMyxcbiAgICBSRVRSSUVWRV9CRUZPUkVfSU5JVDogMTIyLFxuICAgIFJFVFJJRVZFX0FGVEVSX1RFUk06IDEyMyxcbiAgICBTVE9SRV9CRUZPUkVfSU5JVDogMTMyLFxuICAgIFNUT1JFX0FGVEVSX1RFUk06IDEzMyxcbiAgICBDT01NSVRfQkVGT1JFX0lOSVQ6IDE0MixcbiAgICBDT01NSVRfQUZURVJfVEVSTTogMTQzLFxuICAgIEFSR1VNRU5UX0VSUk9SOiAyMDEsXG4gICAgR0VORVJBTF9HRVRfRkFJTFVSRTogMzAxLFxuICAgIEdFTkVSQUxfU0VUX0ZBSUxVUkU6IDM1MSxcbiAgICBHRU5FUkFMX0NPTU1JVF9GQUlMVVJFOiAzOTEsXG4gICAgVU5ERUZJTkVEX0RBVEFfTU9ERUw6IDQwMSxcbiAgICBVTklNUExFTUVOVEVEX0VMRU1FTlQ6IDQwMixcbiAgICBWQUxVRV9OT1RfSU5JVElBTElaRUQ6IDQwMyxcbiAgICBSRUFEX09OTFlfRUxFTUVOVDogNDA0LFxuICAgIFdSSVRFX09OTFlfRUxFTUVOVDogNDA1LFxuICAgIFRZUEVfTUlTTUFUQ0g6IDQwNixcbiAgICBWQUxVRV9PVVRfT0ZfUkFOR0U6IDQwNyxcbiAgICBERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRDogNDA4LFxuICB9LFxufTtcblxuY29uc3QgRXJyb3JDb2RlcyA9IHtcbiAgc2Nvcm0xMjogc2Nvcm0xMixcbiAgc2Nvcm0yMDA0OiBzY29ybTIwMDQsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBFcnJvckNvZGVzO1xuIiwiLy8gQGZsb3dcblxuY29uc3Qgc2Nvcm0xMiA9IHtcbiAgQ01JU3RyaW5nMjU2OiAnXi57MCwyNTV9JCcsXG4gIENNSVN0cmluZzQwOTY6ICdeLnswLDQwOTZ9JCcsXG4gIENNSVRpbWU6ICdeKD86WzAxXVxcXFxkfDJbMDEyM10pOig/OlswMTIzNDVdXFxcXGQpOig/OlswMTIzNDVdXFxcXGQpJCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JVGltZXNwYW46ICdeKFswLTldezIsfSk6KFswLTldezJ9KTooWzAtOV17Mn0pKFxcLlswLTldezEsMn0pPyQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUludGVnZXI6ICdeXFxcXGQrJCcsXG4gIENNSVNJbnRlZ2VyOiAnXi0/KFswLTldKykkJyxcbiAgQ01JRGVjaW1hbDogJ14tPyhbMC05XXswLDN9KShcXC5bMC05XSopPyQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUlkZW50aWZpZXI6ICdeW1xcXFx1MDAyMS1cXFxcdTAwN0VcXFxcc117MCwyNTV9JCcsXG4gIENNSUZlZWRiYWNrOiAnXi57MCwyNTV9JCcsIC8vIFRoaXMgbXVzdCBiZSByZWRlZmluZWRcbiAgQ01JSW5kZXg6ICdbLl9dKFxcXFxkKykuJyxcblxuICAvLyBWb2NhYnVsYXJ5IERhdGEgVHlwZSBEZWZpbml0aW9uXG4gIENNSVN0YXR1czogJ14ocGFzc2VkfGNvbXBsZXRlZHxmYWlsZWR8aW5jb21wbGV0ZXxicm93c2VkKSQnLFxuICBDTUlTdGF0dXMyOiAnXihwYXNzZWR8Y29tcGxldGVkfGZhaWxlZHxpbmNvbXBsZXRlfGJyb3dzZWR8bm90IGF0dGVtcHRlZCkkJyxcbiAgQ01JRXhpdDogJ14odGltZS1vdXR8c3VzcGVuZHxsb2dvdXR8KSQnLFxuICBDTUlUeXBlOiAnXih0cnVlLWZhbHNlfGNob2ljZXxmaWxsLWlufG1hdGNoaW5nfHBlcmZvcm1hbmNlfHNlcXVlbmNpbmd8bGlrZXJ0fG51bWVyaWMpJCcsXG4gIENNSVJlc3VsdDogJ14oY29ycmVjdHx3cm9uZ3x1bmFudGljaXBhdGVkfG5ldXRyYWx8KFswLTldezAsM30pPyhcXFxcLlswLTldKik/KSQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIE5BVkV2ZW50OiAnXihwcmV2aW91c3xjb250aW51ZSkkJyxcblxuICAvLyBEYXRhIHJhbmdlc1xuICBzY29yZV9yYW5nZTogJzAjMTAwJyxcbiAgYXVkaW9fcmFuZ2U6ICctMSMxMDAnLFxuICBzcGVlZF9yYW5nZTogJy0xMDAjMTAwJyxcbiAgd2VpZ2h0aW5nX3JhbmdlOiAnLTEwMCMxMDAnLFxuICB0ZXh0X3JhbmdlOiAnLTEjMScsXG59O1xuXG5jb25zdCBhaWNjID0ge1xuICAuLi5zY29ybTEyLCAuLi57XG4gICAgQ01JSWRlbnRpZmllcjogJ15cXFxcd3sxLDI1NX0kJyxcbiAgfSxcbn07XG5cbmNvbnN0IHNjb3JtMjAwNCA9IHtcbiAgQ01JU3RyaW5nMjAwOiAnXltcXFxcdTAwMDAtXFxcXHVGRkZGXXswLDIwMH0kJyxcbiAgQ01JU3RyaW5nMjUwOiAnXltcXFxcdTAwMDAtXFxcXHVGRkZGXXswLDI1MH0kJyxcbiAgQ01JU3RyaW5nMTAwMDogJ15bXFxcXHUwMDAwLVxcXFx1RkZGRl17MCwxMDAwfSQnLFxuICBDTUlTdHJpbmc0MDAwOiAnXltcXFxcdTAwMDAtXFxcXHVGRkZGXXswLDQwMDB9JCcsXG4gIENNSVN0cmluZzY0MDAwOiAnXltcXFxcdTAwMDAtXFxcXHVGRkZGXXswLDY0MDAwfSQnLFxuICBDTUlMYW5nOiAnXihbYS16QS1aXXsyLDN9fGl8eCkoXFwtW2EtekEtWjAtOVxcLV17Miw4fSk/JHxeJCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JTGFuZ1N0cmluZzI1MDogJ14oXFx7bGFuZz0oW2EtekEtWl17MiwzfXxpfHgpKFxcLVthLXpBLVowLTlcXC1dezIsOH0pP1xcfSk/KCg/IVxcey4qJCkuezAsMjUwfSQpPyQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUxhbmdjcjogJ14oKFxce2xhbmc9KFthLXpBLVpdezIsM318aXx4KT8oXFwtW2EtekEtWjAtOVxcLV17Miw4fSk/XFx9KSkoLio/KSQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUxhbmdTdHJpbmcyNTBjcjogJ14oKFxce2xhbmc9KFthLXpBLVpdezIsM318aXx4KT8oXFwtW2EtekEtWjAtOVxcLV17Miw4fSk/XFx9KT8oLnswLDI1MH0pPyk/JCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JTGFuZ1N0cmluZzQwMDA6ICdeKFxce2xhbmc9KFthLXpBLVpdezIsM318aXx4KShcXC1bYS16QS1aMC05XFwtXXsyLDh9KT9cXH0pPygoPyFcXHsuKiQpLnswLDQwMDB9JCk/JCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JVGltZTogJ14oMTlbNy05XXsxfVswLTldezF9fDIwWzAtMl17MX1bMC05XXsxfXwyMDNbMC04XXsxfSkoKC0oMFsxLTldezF9fDFbMC0yXXsxfSkpKCgtKDBbMS05XXsxfXxbMS0yXXsxfVswLTldezF9fDNbMC0xXXsxfSkpKFQoWzAtMV17MX1bMC05XXsxfXwyWzAtM117MX0pKCg6WzAtNV17MX1bMC05XXsxfSkoKDpbMC01XXsxfVswLTldezF9KSgoXFxcXC5bMC05XXsxLDJ9KSgoWnwoWyt8LV0oWzAtMV17MX1bMC05XXsxfXwyWzAtM117MX0pKSkoOlswLTVdezF9WzAtOV17MX0pPyk/KT8pPyk/KT8pPyk/JCcsXG4gIENNSVRpbWVzcGFuOiAnXlAoPzooWy4sXFxcXGRdKylZKT8oPzooWy4sXFxcXGRdKylNKT8oPzooWy4sXFxcXGRdKylXKT8oPzooWy4sXFxcXGRdKylEKT8oPzpUPyg/OihbLixcXFxcZF0rKUgpPyg/OihbLixcXFxcZF0rKU0pPyg/OihbLixcXFxcZF0rKVMpPyk/JCcsXG4gIENNSUludGVnZXI6ICdeXFxcXGQrJCcsXG4gIENNSVNJbnRlZ2VyOiAnXi0/KFswLTldKykkJyxcbiAgQ01JRGVjaW1hbDogJ14tPyhbMC05XXsxLDV9KShcXFxcLlswLTldezEsMTh9KT8kJyxcbiAgQ01JSWRlbnRpZmllcjogJ15cXFxcU3sxLDI1MH1bYS16QS1aMC05XSQnLFxuICBDTUlTaG9ydElkZW50aWZpZXI6ICdeW1xcXFx3XFxcXC5cXFxcLVxcXFxfXXsxLDI1MH0kJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlMb25nSWRlbnRpZmllcjogJ14oPzooPyF1cm46KVxcXFxTezEsNDAwMH18dXJuOltBLVphLXowLTktXXsxLDMxfTpcXFxcU3sxLDQwMDB9fC57MSw0MDAwfSkkJywgLy8gbmVlZCB0byByZS1leGFtaW5lIHRoaXNcbiAgQ01JRmVlZGJhY2s6ICdeLiokJywgLy8gVGhpcyBtdXN0IGJlIHJlZGVmaW5lZFxuICBDTUlJbmRleDogJ1suX10oXFxcXGQrKS4nLFxuICBDTUlJbmRleFN0b3JlOiAnLk4oXFxcXGQrKS4nLFxuXG4gIC8vIFZvY2FidWxhcnkgRGF0YSBUeXBlIERlZmluaXRpb25cbiAgQ01JQ1N0YXR1czogJ14oY29tcGxldGVkfGluY29tcGxldGV8bm90IGF0dGVtcHRlZHx1bmtub3duKSQnLFxuICBDTUlTU3RhdHVzOiAnXihwYXNzZWR8ZmFpbGVkfHVua25vd24pJCcsXG4gIENNSUV4aXQ6ICdeKHRpbWUtb3V0fHN1c3BlbmR8bG9nb3V0fG5vcm1hbCkkJyxcbiAgQ01JVHlwZTogJ14odHJ1ZS1mYWxzZXxjaG9pY2V8ZmlsbC1pbnxsb25nLWZpbGwtaW58bWF0Y2hpbmd8cGVyZm9ybWFuY2V8c2VxdWVuY2luZ3xsaWtlcnR8bnVtZXJpY3xvdGhlcikkJyxcbiAgQ01JUmVzdWx0OiAnXihjb3JyZWN0fGluY29ycmVjdHx1bmFudGljaXBhdGVkfG5ldXRyYWx8LT8oWzAtOV17MSw0fSkoXFxcXC5bMC05XXsxLDE4fSk/KSQnLFxuICBOQVZFdmVudDogJ14ocHJldmlvdXN8Y29udGludWV8ZXhpdHxleGl0QWxsfGFiYW5kb258YWJhbmRvbkFsbHxzdXNwZW5kQWxsfFxce3RhcmdldD1cXFxcU3swLDIwMH1bYS16QS1aMC05XVxcfWNob2ljZXxqdW1wKSQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIE5BVkJvb2xlYW46ICdeKHVua25vd258dHJ1ZXxmYWxzZSQpJyxcbiAgTkFWVGFyZ2V0OiAnXihwcmV2aW91c3xjb250aW51ZXxjaG9pY2Uue3RhcmdldD1cXFxcU3swLDIwMH1bYS16QS1aMC05XX0pJCcsXG5cbiAgLy8gRGF0YSByYW5nZXNcbiAgc2NhbGVkX3JhbmdlOiAnLTEjMScsXG4gIGF1ZGlvX3JhbmdlOiAnMCMqJyxcbiAgc3BlZWRfcmFuZ2U6ICcwIyonLFxuICB0ZXh0X3JhbmdlOiAnLTEjMScsXG4gIHByb2dyZXNzX3JhbmdlOiAnMCMxJyxcbn07XG5cbmNvbnN0IFJlZ2V4ID0ge1xuICBhaWNjOiBhaWNjLFxuICBzY29ybTEyOiBzY29ybTEyLFxuICBzY29ybTIwMDQ6IHNjb3JtMjAwNCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFJlZ2V4O1xuIiwiLy8gQGZsb3dcblxuaW1wb3J0IEFQSUNvbnN0YW50cyBmcm9tICcuL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcblxuY29uc3Qgc2Nvcm0xMl9lcnJvcnMgPSBBUElDb25zdGFudHMuc2Nvcm0xMi5lcnJvcl9kZXNjcmlwdGlvbnM7XG5jb25zdCBhaWNjX2Vycm9ycyA9IEFQSUNvbnN0YW50cy5haWNjLmVycm9yX2Rlc2NyaXB0aW9ucztcbmNvbnN0IHNjb3JtMjAwNF9lcnJvcnMgPSBBUElDb25zdGFudHMuc2Nvcm0yMDA0LmVycm9yX2Rlc2NyaXB0aW9ucztcblxuLyoqXG4gKiBCYXNlIFZhbGlkYXRpb24gRXhjZXB0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBWYWxpZGF0aW9uRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciB0byB0YWtlIGluIGFuIGVycm9yIG1lc3NhZ2UgYW5kIGNvZGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IGVycm9yQ29kZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXJyb3JNZXNzYWdlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkZXRhaWxlZE1lc3NhZ2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKGVycm9yQ29kZTogbnVtYmVyLCBlcnJvck1lc3NhZ2U6IFN0cmluZywgZGV0YWlsZWRNZXNzYWdlOiBTdHJpbmcpIHtcbiAgICBzdXBlcihlcnJvck1lc3NhZ2UpO1xuICAgIHRoaXMuI2Vycm9yQ29kZSA9IGVycm9yQ29kZTtcbiAgICB0aGlzLiNlcnJvck1lc3NhZ2UgPSBlcnJvck1lc3NhZ2U7XG4gICAgdGhpcy4jZGV0YWlsZWRNZXNzYWdlID0gZGV0YWlsZWRNZXNzYWdlO1xuICB9XG5cbiAgI2Vycm9yQ29kZTtcbiAgI2Vycm9yTWVzc2FnZTtcbiAgI2RldGFpbGVkTWVzc2FnZTtcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZXJyb3JDb2RlXG4gICAqIEByZXR1cm4ge251bWJlcn1cbiAgICovXG4gIGdldCBlcnJvckNvZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2Vycm9yQ29kZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNlcnJvck1lc3NhZ2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGVycm9yTWVzc2FnZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jZXJyb3JNZXNzYWdlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2RldGFpbGVkTWVzc2FnZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZGV0YWlsZWRNZXNzYWdlKCkge1xuICAgIHJldHVybiB0aGlzLiNkZXRhaWxlZE1lc3NhZ2U7XG4gIH1cbn1cblxuLyoqXG4gKiBTQ09STSAxLjIgVmFsaWRhdGlvbiBFcnJvclxuICovXG5leHBvcnQgY2xhc3MgU2Nvcm0xMlZhbGlkYXRpb25FcnJvciBleHRlbmRzIFZhbGlkYXRpb25FcnJvciB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciB0byB0YWtlIGluIGFuIGVycm9yIGNvZGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IGVycm9yQ29kZVxuICAgKi9cbiAgY29uc3RydWN0b3IoZXJyb3JDb2RlOiBudW1iZXIpIHtcbiAgICBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChzY29ybTEyX2Vycm9ycywgU3RyaW5nKGVycm9yQ29kZSkpKSB7XG4gICAgICBzdXBlcihlcnJvckNvZGUsIHNjb3JtMTJfZXJyb3JzW1N0cmluZyhlcnJvckNvZGUpXS5iYXNpY01lc3NhZ2UsIHNjb3JtMTJfZXJyb3JzW1N0cmluZyhlcnJvckNvZGUpXS5kZXRhaWxNZXNzYWdlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3VwZXIoMTAxLCBzY29ybTEyX2Vycm9yc1snMTAxJ10uYmFzaWNNZXNzYWdlLCBzY29ybTEyX2Vycm9yc1snMTAxJ10uZGV0YWlsTWVzc2FnZSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQUlDQyBWYWxpZGF0aW9uIEVycm9yXG4gKi9cbmV4cG9ydCBjbGFzcyBBSUNDVmFsaWRhdGlvbkVycm9yIGV4dGVuZHMgVmFsaWRhdGlvbkVycm9yIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIHRvIHRha2UgaW4gYW4gZXJyb3IgY29kZVxuICAgKiBAcGFyYW0ge251bWJlcn0gZXJyb3JDb2RlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlcnJvckNvZGU6IG51bWJlcikge1xuICAgIGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFpY2NfZXJyb3JzLCBTdHJpbmcoZXJyb3JDb2RlKSkpIHtcbiAgICAgIHN1cGVyKGVycm9yQ29kZSwgYWljY19lcnJvcnNbU3RyaW5nKGVycm9yQ29kZSldLmJhc2ljTWVzc2FnZSwgYWljY19lcnJvcnNbU3RyaW5nKGVycm9yQ29kZSldLmRldGFpbE1lc3NhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdXBlcigxMDEsIGFpY2NfZXJyb3JzWycxMDEnXS5iYXNpY01lc3NhZ2UsIGFpY2NfZXJyb3JzWycxMDEnXS5kZXRhaWxNZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBTQ09STSAyMDA0IFZhbGlkYXRpb24gRXJyb3JcbiAqL1xuZXhwb3J0IGNsYXNzIFNjb3JtMjAwNFZhbGlkYXRpb25FcnJvciBleHRlbmRzIFZhbGlkYXRpb25FcnJvciB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciB0byB0YWtlIGluIGFuIGVycm9yIGNvZGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IGVycm9yQ29kZVxuICAgKi9cbiAgY29uc3RydWN0b3IoZXJyb3JDb2RlOiBudW1iZXIpIHtcbiAgICBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChzY29ybTIwMDRfZXJyb3JzLCBTdHJpbmcoZXJyb3JDb2RlKSkpIHtcbiAgICAgIHN1cGVyKGVycm9yQ29kZSwgc2Nvcm0yMDA0X2Vycm9yc1tTdHJpbmcoZXJyb3JDb2RlKV0uYmFzaWNNZXNzYWdlLCBzY29ybTIwMDRfZXJyb3JzW1N0cmluZyhlcnJvckNvZGUpXS5kZXRhaWxNZXNzYWdlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3VwZXIoMTAxLCBzY29ybTIwMDRfZXJyb3JzWycxMDEnXS5iYXNpY01lc3NhZ2UsIHNjb3JtMjAwNF9lcnJvcnNbJzEwMSddLmRldGFpbE1lc3NhZ2UpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IEFJQ0MgZnJvbSAnLi4vQUlDQyc7XG5cbndpbmRvdy5BSUNDID0gQUlDQztcbiIsIi8vIEBmbG93XG5leHBvcnQgY29uc3QgU0VDT05EU19QRVJfU0VDT05EID0gMS4wO1xuZXhwb3J0IGNvbnN0IFNFQ09ORFNfUEVSX01JTlVURSA9IDYwO1xuZXhwb3J0IGNvbnN0IFNFQ09ORFNfUEVSX0hPVVIgPSA2MCAqIFNFQ09ORFNfUEVSX01JTlVURTtcbmV4cG9ydCBjb25zdCBTRUNPTkRTX1BFUl9EQVkgPSAyNCAqIFNFQ09ORFNfUEVSX0hPVVI7XG5cbmNvbnN0IGRlc2lnbmF0aW9ucyA9IFtcbiAgWydEJywgU0VDT05EU19QRVJfREFZXSxcbiAgWydIJywgU0VDT05EU19QRVJfSE9VUl0sXG4gIFsnTScsIFNFQ09ORFNfUEVSX01JTlVURV0sXG4gIFsnUycsIFNFQ09ORFNfUEVSX1NFQ09ORF0sXG5dO1xuXG4vKipcbiAqIENvbnZlcnRzIGEgTnVtYmVyIHRvIGEgU3RyaW5nIG9mIEhIOk1NOlNTXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHRvdGFsU2Vjb25kc1xuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2Vjb25kc0FzSEhNTVNTKHRvdGFsU2Vjb25kczogTnVtYmVyKSB7XG4gIC8vIFNDT1JNIHNwZWMgZG9lcyBub3QgZGVhbCB3aXRoIG5lZ2F0aXZlIGR1cmF0aW9ucywgZ2l2ZSB6ZXJvIGJhY2tcbiAgaWYgKCF0b3RhbFNlY29uZHMgfHwgdG90YWxTZWNvbmRzIDw9IDApIHtcbiAgICByZXR1cm4gJzAwOjAwOjAwJztcbiAgfVxuXG4gIGNvbnN0IGhvdXJzID0gTWF0aC5mbG9vcih0b3RhbFNlY29uZHMgLyBTRUNPTkRTX1BFUl9IT1VSKTtcblxuICBjb25zdCBkYXRlT2JqID0gbmV3IERhdGUodG90YWxTZWNvbmRzICogMTAwMCk7XG4gIGNvbnN0IG1pbnV0ZXMgPSBkYXRlT2JqLmdldFVUQ01pbnV0ZXMoKTtcbiAgLy8gbWFrZSBzdXJlIHdlIGFkZCBhbnkgcG9zc2libGUgZGVjaW1hbCB2YWx1ZVxuICBjb25zdCBzZWNvbmRzID0gZGF0ZU9iai5nZXRTZWNvbmRzKCk7XG4gIGNvbnN0IG1zID0gdG90YWxTZWNvbmRzICUgMS4wO1xuICBsZXQgbXNTdHIgPSAnJztcbiAgaWYgKGNvdW50RGVjaW1hbHMobXMpID4gMCkge1xuICAgIGlmIChjb3VudERlY2ltYWxzKG1zKSA+IDIpIHtcbiAgICAgIG1zU3RyID0gbXMudG9GaXhlZCgyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbXNTdHIgPSBTdHJpbmcobXMpO1xuICAgIH1cbiAgICBtc1N0ciA9ICcuJyArIG1zU3RyLnNwbGl0KCcuJylbMV07XG4gIH1cblxuICByZXR1cm4gKGhvdXJzICsgJzonICsgbWludXRlcyArICc6JyArIHNlY29uZHMpLnJlcGxhY2UoL1xcYlxcZFxcYi9nLFxuICAgICAgJzAkJicpICsgbXNTdHI7XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlIHRoZSBudW1iZXIgb2Ygc2Vjb25kcyBmcm9tIElTTyA4NjAxIER1cmF0aW9uXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHNlY29uZHNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNlY29uZHNBc0lTT0R1cmF0aW9uKHNlY29uZHM6IE51bWJlcikge1xuICAvLyBTQ09STSBzcGVjIGRvZXMgbm90IGRlYWwgd2l0aCBuZWdhdGl2ZSBkdXJhdGlvbnMsIGdpdmUgemVybyBiYWNrXG4gIGlmICghc2Vjb25kcyB8fCBzZWNvbmRzIDw9IDApIHtcbiAgICByZXR1cm4gJ1BUMFMnO1xuICB9XG5cbiAgbGV0IGR1cmF0aW9uID0gJ1AnO1xuICBsZXQgcmVtYWluZGVyID0gc2Vjb25kcztcblxuICBkZXNpZ25hdGlvbnMuZm9yRWFjaCgoW3NpZ24sIGN1cnJlbnRfc2Vjb25kc10pID0+IHtcbiAgICBsZXQgdmFsdWUgPSBNYXRoLmZsb29yKHJlbWFpbmRlciAvIGN1cnJlbnRfc2Vjb25kcyk7XG5cbiAgICByZW1haW5kZXIgPSByZW1haW5kZXIgJSBjdXJyZW50X3NlY29uZHM7XG4gICAgaWYgKGNvdW50RGVjaW1hbHMocmVtYWluZGVyKSA+IDIpIHtcbiAgICAgIHJlbWFpbmRlciA9IE51bWJlcihOdW1iZXIocmVtYWluZGVyKS50b0ZpeGVkKDIpKTtcbiAgICB9XG4gICAgLy8gSWYgd2UgaGF2ZSBhbnl0aGluZyBsZWZ0IGluIHRoZSByZW1haW5kZXIsIGFuZCB3ZSdyZSBjdXJyZW50bHkgYWRkaW5nXG4gICAgLy8gc2Vjb25kcyB0byB0aGUgZHVyYXRpb24sIGdvIGFoZWFkIGFuZCBhZGQgdGhlIGRlY2ltYWwgdG8gdGhlIHNlY29uZHNcbiAgICBpZiAoc2lnbiA9PT0gJ1MnICYmIHJlbWFpbmRlciA+IDApIHtcbiAgICAgIHZhbHVlICs9IHJlbWFpbmRlcjtcbiAgICB9XG5cbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIGlmICgoZHVyYXRpb24uaW5kZXhPZignRCcpID4gMCB8fFxuICAgICAgICAgIHNpZ24gPT09ICdIJyB8fCBzaWduID09PSAnTScgfHwgc2lnbiA9PT0gJ1MnKSAmJlxuICAgICAgICAgIGR1cmF0aW9uLmluZGV4T2YoJ1QnKSA9PT0gLTEpIHtcbiAgICAgICAgZHVyYXRpb24gKz0gJ1QnO1xuICAgICAgfVxuICAgICAgZHVyYXRpb24gKz0gYCR7dmFsdWV9JHtzaWdufWA7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZHVyYXRpb247XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlIHRoZSBudW1iZXIgb2Ygc2Vjb25kcyBmcm9tIEhIOk1NOlNTLkRERERERFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lU3RyaW5nXG4gKiBAcGFyYW0ge1JlZ0V4cH0gdGltZVJlZ2V4XG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUaW1lQXNTZWNvbmRzKHRpbWVTdHJpbmc6IFN0cmluZywgdGltZVJlZ2V4OiBSZWdFeHApIHtcbiAgaWYgKCF0aW1lU3RyaW5nIHx8IHR5cGVvZiB0aW1lU3RyaW5nICE9PSAnc3RyaW5nJyB8fFxuICAgICAgIXRpbWVTdHJpbmcubWF0Y2godGltZVJlZ2V4KSkge1xuICAgIHJldHVybiAwO1xuICB9XG4gIGNvbnN0IHBhcnRzID0gdGltZVN0cmluZy5zcGxpdCgnOicpO1xuICBjb25zdCBob3VycyA9IE51bWJlcihwYXJ0c1swXSk7XG4gIGNvbnN0IG1pbnV0ZXMgPSBOdW1iZXIocGFydHNbMV0pO1xuICBjb25zdCBzZWNvbmRzID0gTnVtYmVyKHBhcnRzWzJdKTtcbiAgcmV0dXJuIChob3VycyAqIDM2MDApICsgKG1pbnV0ZXMgKiA2MCkgKyBzZWNvbmRzO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZSB0aGUgbnVtYmVyIG9mIHNlY29uZHMgZnJvbSBJU08gODYwMSBEdXJhdGlvblxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBkdXJhdGlvblxuICogQHBhcmFtIHtSZWdFeHB9IGR1cmF0aW9uUmVnZXhcbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldER1cmF0aW9uQXNTZWNvbmRzKGR1cmF0aW9uOiBTdHJpbmcsIGR1cmF0aW9uUmVnZXg6IFJlZ0V4cCkge1xuICBpZiAoIWR1cmF0aW9uIHx8ICFkdXJhdGlvbi5tYXRjaChkdXJhdGlvblJlZ2V4KSkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgY29uc3QgWywgeWVhcnMsIG1vbnRocywgLCBkYXlzLCBob3VycywgbWludXRlcywgc2Vjb25kc10gPSBuZXcgUmVnRXhwKFxuICAgICAgZHVyYXRpb25SZWdleCkuZXhlYyhkdXJhdGlvbikgfHwgW107XG5cbiAgbGV0IHJlc3VsdCA9IDAuMDtcblxuICByZXN1bHQgKz0gKE51bWJlcihzZWNvbmRzKSAqIDEuMCB8fCAwLjApO1xuICByZXN1bHQgKz0gKE51bWJlcihtaW51dGVzKSAqIDYwLjAgfHwgMC4wKTtcbiAgcmVzdWx0ICs9IChOdW1iZXIoaG91cnMpICogMzYwMC4wIHx8IDAuMCk7XG4gIHJlc3VsdCArPSAoTnVtYmVyKGRheXMpICogKDYwICogNjAgKiAyNC4wKSB8fCAwLjApO1xuICByZXN1bHQgKz0gKE51bWJlcih5ZWFycykgKiAoNjAgKiA2MCAqIDI0ICogMzY1LjApIHx8IDAuMCk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBZGRzIHRvZ2V0aGVyIHR3byBJU084NjAxIER1cmF0aW9uIHN0cmluZ3NcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlyc3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWNvbmRcbiAqIEBwYXJhbSB7UmVnRXhwfSBkdXJhdGlvblJlZ2V4XG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRUd29EdXJhdGlvbnMoXG4gICAgZmlyc3Q6IFN0cmluZyxcbiAgICBzZWNvbmQ6IFN0cmluZyxcbiAgICBkdXJhdGlvblJlZ2V4OiBSZWdFeHApIHtcbiAgcmV0dXJuIGdldFNlY29uZHNBc0lTT0R1cmF0aW9uKFxuICAgICAgZ2V0RHVyYXRpb25Bc1NlY29uZHMoZmlyc3QsIGR1cmF0aW9uUmVnZXgpICtcbiAgICAgIGdldER1cmF0aW9uQXNTZWNvbmRzKHNlY29uZCwgZHVyYXRpb25SZWdleCksXG4gICk7XG59XG5cbi8qKlxuICogQWRkIHRvZ2V0aGVyIHR3byBISDpNTTpTUy5ERCBzdHJpbmdzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGZpcnN0XG4gKiBAcGFyYW0ge3N0cmluZ30gc2Vjb25kXG4gKiBAcGFyYW0ge1JlZ0V4cH0gdGltZVJlZ2V4XG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRISE1NU1NUaW1lU3RyaW5ncyhcbiAgICBmaXJzdDogU3RyaW5nLFxuICAgIHNlY29uZDogU3RyaW5nLFxuICAgIHRpbWVSZWdleDogUmVnRXhwKSB7XG4gIHJldHVybiBnZXRTZWNvbmRzQXNISE1NU1MoXG4gICAgICBnZXRUaW1lQXNTZWNvbmRzKGZpcnN0LCB0aW1lUmVnZXgpICtcbiAgICAgIGdldFRpbWVBc1NlY29uZHMoXG4gICAgICAgICAgc2Vjb25kLCB0aW1lUmVnZXgpLFxuICApO1xufVxuXG4vKipcbiAqIEZsYXR0ZW4gYSBKU09OIG9iamVjdCBkb3duIHRvIHN0cmluZyBwYXRocyBmb3IgZWFjaCB2YWx1ZXNcbiAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuKGRhdGEpIHtcbiAgY29uc3QgcmVzdWx0ID0ge307XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2UgdGhyb3VnaCB0aGUgb2JqZWN0XG4gICAqIEBwYXJhbSB7Kn0gY3VyXG4gICAqIEBwYXJhbSB7Kn0gcHJvcFxuICAgKi9cbiAgZnVuY3Rpb24gcmVjdXJzZShjdXIsIHByb3ApIHtcbiAgICBpZiAoT2JqZWN0KGN1cikgIT09IGN1cikge1xuICAgICAgcmVzdWx0W3Byb3BdID0gY3VyO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShjdXIpKSB7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGN1ci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgcmVjdXJzZShjdXJbaV0sIHByb3AgKyAnWycgKyBpICsgJ10nKTtcbiAgICAgICAgaWYgKGwgPT09IDApIHJlc3VsdFtwcm9wXSA9IFtdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgaXNFbXB0eSA9IHRydWU7XG4gICAgICBmb3IgKGNvbnN0IHAgaW4gY3VyKSB7XG4gICAgICAgIGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGN1ciwgcCkpIHtcbiAgICAgICAgICBpc0VtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgcmVjdXJzZShjdXJbcF0sIHByb3AgPyBwcm9wICsgJy4nICsgcCA6IHApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNFbXB0eSAmJiBwcm9wKSByZXN1bHRbcHJvcF0gPSB7fTtcbiAgICB9XG4gIH1cblxuICByZWN1cnNlKGRhdGEsICcnKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBVbi1mbGF0dGVuIGEgZmxhdCBKU09OIG9iamVjdFxuICogQHBhcmFtIHtvYmplY3R9IGRhdGFcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuZmxhdHRlbihkYXRhKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgaWYgKE9iamVjdChkYXRhKSAhPT0gZGF0YSB8fCBBcnJheS5pc0FycmF5KGRhdGEpKSByZXR1cm4gZGF0YTtcbiAgY29uc3QgcmVnZXggPSAvXFwuPyhbXi5bXFxdXSspfFxcWyhcXGQrKV0vZztcbiAgY29uc3QgcmVzdWx0ID0ge307XG4gIGZvciAoY29uc3QgcCBpbiBkYXRhKSB7XG4gICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoZGF0YSwgcCkpIHtcbiAgICAgIGxldCBjdXIgPSByZXN1bHQ7XG4gICAgICBsZXQgcHJvcCA9ICcnO1xuICAgICAgbGV0IG0gPSByZWdleC5leGVjKHApO1xuICAgICAgd2hpbGUgKG0pIHtcbiAgICAgICAgY3VyID0gY3VyW3Byb3BdIHx8IChjdXJbcHJvcF0gPSAobVsyXSA/IFtdIDoge30pKTtcbiAgICAgICAgcHJvcCA9IG1bMl0gfHwgbVsxXTtcbiAgICAgICAgbSA9IHJlZ2V4LmV4ZWMocCk7XG4gICAgICB9XG4gICAgICBjdXJbcHJvcF0gPSBkYXRhW3BdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0WycnXSB8fCByZXN1bHQ7XG59XG5cbi8qKlxuICogQ291bnRzIHRoZSBudW1iZXIgb2YgZGVjaW1hbCBwbGFjZXNcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvdW50RGVjaW1hbHMobnVtOiBudW1iZXIpIHtcbiAgaWYgKE1hdGguZmxvb3IobnVtKSA9PT0gbnVtIHx8IFN0cmluZyhudW0pLmluZGV4T2YoJy4nKSA8IDApIHJldHVybiAwO1xuICBjb25zdCBwYXJ0cyA9IG51bS50b1N0cmluZygpLnNwbGl0KCcuJylbMV07XG4gIHJldHVybiBwYXJ0cy5sZW5ndGggfHwgMDtcbn1cbiJdfQ==
