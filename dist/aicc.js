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
exports.Scorm2004ValidationError = exports.AICCValidationError = exports.Scorm12ValidationError = exports.ValidationError = void 0;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlYm91bmNlL2luZGV4LmpzIiwic3JjL0FJQ0MuanMiLCJzcmMvQmFzZUFQSS5qcyIsInNyYy9TY29ybTEyQVBJLmpzIiwic3JjL2NtaS9haWNjX2NtaS5qcyIsInNyYy9jbWkvY29tbW9uLmpzIiwic3JjL2NtaS9zY29ybTEyX2NtaS5qcyIsInNyYy9jb25zdGFudHMvYXBpX2NvbnN0YW50cy5qcyIsInNyYy9jb25zdGFudHMvZXJyb3JfY29kZXMuanMiLCJzcmMvY29uc3RhbnRzL3JlZ2V4LmpzIiwic3JjL2V4Y2VwdGlvbnMuanMiLCJzcmMvZXhwb3J0cy9haWNjLmpzIiwic3JjL3V0aWxpdGllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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bUNBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBekJXO0FBNkJsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsK0JBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBN0JXO0FBaUNsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUscUNBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBakNXO0FBcUNsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsaUNBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBckNXO0FBeUNsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsa0NBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBekNXO0FBNkNsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsOEJBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBN0NXO0FBaURsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsOEJBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBakRXO0FBcURsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsMEJBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBckRXO0FBeURsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsd0JBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBekRXO0FBNkRsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUscUJBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBN0RXO0FBaUVsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUscUJBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBakVXO0FBcUVsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsd0JBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBckVXO0FBeUVsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsOEJBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBekVXO0FBNkVsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsa0NB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LFFBQUEsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFELENBQUQsSUFBUSxDQUFDLENBQUMsQ0FBRCxDQUFoQjtBQUNBLFFBQUEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFOLENBQVcsQ0FBWCxDQUFKO0FBQ0Q7O0FBQ0QsTUFBQSxHQUFHLENBQUMsSUFBRCxDQUFILEdBQVksSUFBSSxDQUFDLENBQUQsQ0FBaEI7QUFDRDtBQUNGOztBQUNELFNBQU8sTUFBTSxDQUFDLEVBQUQsQ0FBTixJQUFjLE1BQXJCO0FBQ0Q7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDTyxTQUFTLGFBQVQsQ0FBdUIsR0FBdkIsRUFBb0M7QUFDekMsTUFBSSxJQUFJLENBQUMsS0FBTCxDQUFXLEdBQVgsTUFBb0IsR0FBcEIsSUFBMkIsTUFBTSxDQUFDLEdBQUQsQ0FBTixDQUFZLE9BQVosQ0FBb0IsR0FBcEIsSUFBMkIsQ0FBMUQsRUFBNkQsT0FBTyxDQUFQO0FBQzdELE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxRQUFKLEdBQWUsS0FBZixDQUFxQixHQUFyQixFQUEwQixDQUExQixDQUFkO0FBQ0EsU0FBTyxLQUFLLENBQUMsTUFBTixJQUFnQixDQUF2QjtBQUNEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBsb2Rhc2ggKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pxdWVyeS5vcmcvPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBOQU4gPSAwIC8gMDtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLiAqL1xudmFyIHJlVHJpbSA9IC9eXFxzK3xcXHMrJC9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmFkIHNpZ25lZCBoZXhhZGVjaW1hbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCYWRIZXggPSAvXlstK10weFswLTlhLWZdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJpbmFyeSBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCaW5hcnkgPSAvXjBiWzAxXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvY3RhbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNPY3RhbCA9IC9eMG9bMC03XSskL2k7XG5cbi8qKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB3aXRob3V0IGEgZGVwZW5kZW5jeSBvbiBgcm9vdGAuICovXG52YXIgZnJlZVBhcnNlSW50ID0gcGFyc2VJbnQ7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heCxcbiAgICBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBHZXRzIHRoZSB0aW1lc3RhbXAgb2YgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBoYXZlIGVsYXBzZWQgc2luY2VcbiAqIHRoZSBVbml4IGVwb2NoICgxIEphbnVhcnkgMTk3MCAwMDowMDowMCBVVEMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBEYXRlXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSB0aW1lc3RhbXAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmZXIoZnVuY3Rpb24oc3RhbXApIHtcbiAqICAgY29uc29sZS5sb2coXy5ub3coKSAtIHN0YW1wKTtcbiAqIH0sIF8ubm93KCkpO1xuICogLy8gPT4gTG9ncyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpdCB0b29rIGZvciB0aGUgZGVmZXJyZWQgaW52b2NhdGlvbi5cbiAqL1xudmFyIG5vdyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcm9vdC5EYXRlLm5vdygpO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZGVib3VuY2VkIGZ1bmN0aW9uIHRoYXQgZGVsYXlzIGludm9raW5nIGBmdW5jYCB1bnRpbCBhZnRlciBgd2FpdGBcbiAqIG1pbGxpc2Vjb25kcyBoYXZlIGVsYXBzZWQgc2luY2UgdGhlIGxhc3QgdGltZSB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHdhc1xuICogaW52b2tlZC4gVGhlIGRlYm91bmNlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGAgbWV0aG9kIHRvIGNhbmNlbFxuICogZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG8gaW1tZWRpYXRlbHkgaW52b2tlIHRoZW0uXG4gKiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYCBzaG91bGQgYmUgaW52b2tlZCBvbiB0aGVcbiAqIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YCB0aW1lb3V0LiBUaGUgYGZ1bmNgIGlzIGludm9rZWRcbiAqIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24uIFN1YnNlcXVlbnRcbiAqIGNhbGxzIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgXG4gKiBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLmRlYm91bmNlYCBhbmQgYF8udGhyb3R0bGVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVib3VuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz1mYWxzZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4V2FpdF1cbiAqICBUaGUgbWF4aW11bSB0aW1lIGBmdW5jYCBpcyBhbGxvd2VkIHRvIGJlIGRlbGF5ZWQgYmVmb3JlIGl0J3MgaW52b2tlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZGVib3VuY2VkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBjb3N0bHkgY2FsY3VsYXRpb25zIHdoaWxlIHRoZSB3aW5kb3cgc2l6ZSBpcyBpbiBmbHV4LlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Jlc2l6ZScsIF8uZGVib3VuY2UoY2FsY3VsYXRlTGF5b3V0LCAxNTApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHNlbmRNYWlsYCB3aGVuIGNsaWNrZWQsIGRlYm91bmNpbmcgc3Vic2VxdWVudCBjYWxscy5cbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCBfLmRlYm91bmNlKHNlbmRNYWlsLCAzMDAsIHtcbiAqICAgJ2xlYWRpbmcnOiB0cnVlLFxuICogICAndHJhaWxpbmcnOiBmYWxzZVxuICogfSkpO1xuICpcbiAqIC8vIEVuc3VyZSBgYmF0Y2hMb2dgIGlzIGludm9rZWQgb25jZSBhZnRlciAxIHNlY29uZCBvZiBkZWJvdW5jZWQgY2FsbHMuXG4gKiB2YXIgZGVib3VuY2VkID0gXy5kZWJvdW5jZShiYXRjaExvZywgMjUwLCB7ICdtYXhXYWl0JzogMTAwMCB9KTtcbiAqIHZhciBzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UoJy9zdHJlYW0nKTtcbiAqIGpRdWVyeShzb3VyY2UpLm9uKCdtZXNzYWdlJywgZGVib3VuY2VkKTtcbiAqXG4gKiAvLyBDYW5jZWwgdGhlIHRyYWlsaW5nIGRlYm91bmNlZCBpbnZvY2F0aW9uLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3BvcHN0YXRlJywgZGVib3VuY2VkLmNhbmNlbCk7XG4gKi9cbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGxhc3RBcmdzLFxuICAgICAgbGFzdFRoaXMsXG4gICAgICBtYXhXYWl0LFxuICAgICAgcmVzdWx0LFxuICAgICAgdGltZXJJZCxcbiAgICAgIGxhc3RDYWxsVGltZSxcbiAgICAgIGxhc3RJbnZva2VUaW1lID0gMCxcbiAgICAgIGxlYWRpbmcgPSBmYWxzZSxcbiAgICAgIG1heGluZyA9IGZhbHNlLFxuICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHdhaXQgPSB0b051bWJlcih3YWl0KSB8fCAwO1xuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gISFvcHRpb25zLmxlYWRpbmc7XG4gICAgbWF4aW5nID0gJ21heFdhaXQnIGluIG9wdGlvbnM7XG4gICAgbWF4V2FpdCA9IG1heGluZyA/IG5hdGl2ZU1heCh0b051bWJlcihvcHRpb25zLm1heFdhaXQpIHx8IDAsIHdhaXQpIDogbWF4V2FpdDtcbiAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICB9XG5cbiAgZnVuY3Rpb24gaW52b2tlRnVuYyh0aW1lKSB7XG4gICAgdmFyIGFyZ3MgPSBsYXN0QXJncyxcbiAgICAgICAgdGhpc0FyZyA9IGxhc3RUaGlzO1xuXG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gbGVhZGluZ0VkZ2UodGltZSkge1xuICAgIC8vIFJlc2V0IGFueSBgbWF4V2FpdGAgdGltZXIuXG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIC8vIFN0YXJ0IHRoZSB0aW1lciBmb3IgdGhlIHRyYWlsaW5nIGVkZ2UuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAvLyBJbnZva2UgdGhlIGxlYWRpbmcgZWRnZS5cbiAgICByZXR1cm4gbGVhZGluZyA/IGludm9rZUZ1bmModGltZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiByZW1haW5pbmdXYWl0KHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lLFxuICAgICAgICByZXN1bHQgPSB3YWl0IC0gdGltZVNpbmNlTGFzdENhbGw7XG5cbiAgICByZXR1cm4gbWF4aW5nID8gbmF0aXZlTWluKHJlc3VsdCwgbWF4V2FpdCAtIHRpbWVTaW5jZUxhc3RJbnZva2UpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvdWxkSW52b2tlKHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lO1xuXG4gICAgLy8gRWl0aGVyIHRoaXMgaXMgdGhlIGZpcnN0IGNhbGwsIGFjdGl2aXR5IGhhcyBzdG9wcGVkIGFuZCB3ZSdyZSBhdCB0aGVcbiAgICAvLyB0cmFpbGluZyBlZGdlLCB0aGUgc3lzdGVtIHRpbWUgaGFzIGdvbmUgYmFja3dhcmRzIGFuZCB3ZSdyZSB0cmVhdGluZ1xuICAgIC8vIGl0IGFzIHRoZSB0cmFpbGluZyBlZGdlLCBvciB3ZSd2ZSBoaXQgdGhlIGBtYXhXYWl0YCBsaW1pdC5cbiAgICByZXR1cm4gKGxhc3RDYWxsVGltZSA9PT0gdW5kZWZpbmVkIHx8ICh0aW1lU2luY2VMYXN0Q2FsbCA+PSB3YWl0KSB8fFxuICAgICAgKHRpbWVTaW5jZUxhc3RDYWxsIDwgMCkgfHwgKG1heGluZyAmJiB0aW1lU2luY2VMYXN0SW52b2tlID49IG1heFdhaXQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVyRXhwaXJlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpO1xuICAgIGlmIChzaG91bGRJbnZva2UodGltZSkpIHtcbiAgICAgIHJldHVybiB0cmFpbGluZ0VkZ2UodGltZSk7XG4gICAgfVxuICAgIC8vIFJlc3RhcnQgdGhlIHRpbWVyLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgcmVtYWluaW5nV2FpdCh0aW1lKSk7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFpbGluZ0VkZ2UodGltZSkge1xuICAgIHRpbWVySWQgPSB1bmRlZmluZWQ7XG5cbiAgICAvLyBPbmx5IGludm9rZSBpZiB3ZSBoYXZlIGBsYXN0QXJnc2Agd2hpY2ggbWVhbnMgYGZ1bmNgIGhhcyBiZWVuXG4gICAgLy8gZGVib3VuY2VkIGF0IGxlYXN0IG9uY2UuXG4gICAgaWYgKHRyYWlsaW5nICYmIGxhc3RBcmdzKSB7XG4gICAgICByZXR1cm4gaW52b2tlRnVuYyh0aW1lKTtcbiAgICB9XG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIGlmICh0aW1lcklkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICB9XG4gICAgbGFzdEludm9rZVRpbWUgPSAwO1xuICAgIGxhc3RBcmdzID0gbGFzdENhbGxUaW1lID0gbGFzdFRoaXMgPSB0aW1lcklkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgcmV0dXJuIHRpbWVySWQgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IHRyYWlsaW5nRWRnZShub3coKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKSxcbiAgICAgICAgaXNJbnZva2luZyA9IHNob3VsZEludm9rZSh0aW1lKTtcblxuICAgIGxhc3RBcmdzID0gYXJndW1lbnRzO1xuICAgIGxhc3RUaGlzID0gdGhpcztcbiAgICBsYXN0Q2FsbFRpbWUgPSB0aW1lO1xuXG4gICAgaWYgKGlzSW52b2tpbmcpIHtcbiAgICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGxlYWRpbmdFZGdlKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgICBpZiAobWF4aW5nKSB7XG4gICAgICAgIC8vIEhhbmRsZSBpbnZvY2F0aW9ucyBpbiBhIHRpZ2h0IGxvb3AuXG4gICAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgICAgIHJldHVybiBpbnZva2VGdW5jKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGNhbmNlbDtcbiAgZGVib3VuY2VkLmZsdXNoID0gZmx1c2g7XG4gIHJldHVybiBkZWJvdW5jZWQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlYm91bmNlO1xuIiwiLy8gQGZsb3dcbmltcG9ydCBTY29ybTEyQVBJIGZyb20gJy4vU2Nvcm0xMkFQSSc7XG5pbXBvcnQge1xuICBDTUksXG4gIENNSUF0dGVtcHRSZWNvcmRzT2JqZWN0LFxuICBDTUlFdmFsdWF0aW9uQ29tbWVudHNPYmplY3QsXG4gIENNSVRyaWVzT2JqZWN0LFxufSBmcm9tICcuL2NtaS9haWNjX2NtaSc7XG5pbXBvcnQge05BVn0gZnJvbSAnLi9jbWkvc2Nvcm0xMl9jbWknO1xuXG4vKipcbiAqIFRoZSBBSUNDIEFQSSBjbGFzc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBSUNDIGV4dGVuZHMgU2Nvcm0xMkFQSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciB0byBjcmVhdGUgQUlDQyBBUEkgb2JqZWN0XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IHt9KSB7XG4gICAgY29uc3QgZmluYWxTZXR0aW5ncyA9IHtcbiAgICAgIC4uLntcbiAgICAgICAgbWFzdGVyeV9vdmVycmlkZTogZmFsc2UsXG4gICAgICB9LCAuLi5zZXR0aW5ncyxcbiAgICB9O1xuXG4gICAgc3VwZXIoZmluYWxTZXR0aW5ncyk7XG5cbiAgICB0aGlzLmNtaSA9IG5ldyBDTUkoKTtcbiAgICB0aGlzLm5hdiA9IG5ldyBOQVYoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIG9yIGJ1aWxkcyBhIG5ldyBjaGlsZCBlbGVtZW50IHRvIGFkZCB0byB0aGUgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvdW5kRmlyc3RJbmRleFxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICBnZXRDaGlsZEVsZW1lbnQoQ01JRWxlbWVudCwgdmFsdWUsIGZvdW5kRmlyc3RJbmRleCkge1xuICAgIGxldCBuZXdDaGlsZCA9IHN1cGVyLmdldENoaWxkRWxlbWVudChDTUlFbGVtZW50LCB2YWx1ZSwgZm91bmRGaXJzdEluZGV4KTtcblxuICAgIGlmICghbmV3Q2hpbGQpIHtcbiAgICAgIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ2NtaVxcXFwuZXZhbHVhdGlvblxcXFwuY29tbWVudHNcXFxcLlxcXFxkKycpKSB7XG4gICAgICAgIG5ld0NoaWxkID0gbmV3IENNSUV2YWx1YXRpb25Db21tZW50c09iamVjdCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCxcbiAgICAgICAgICAnY21pXFxcXC5zdHVkZW50X2RhdGFcXFxcLnRyaWVzXFxcXC5cXFxcZCsnKSkge1xuICAgICAgICBuZXdDaGlsZCA9IG5ldyBDTUlUcmllc09iamVjdCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCxcbiAgICAgICAgICAnY21pXFxcXC5zdHVkZW50X2RhdGFcXFxcLmF0dGVtcHRfcmVjb3Jkc1xcXFwuXFxcXGQrJykpIHtcbiAgICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JQXR0ZW1wdFJlY29yZHNPYmplY3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3Q2hpbGQ7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSB0aGUgd2hvbGUgQVBJIHdpdGggYW5vdGhlclxuICAgKlxuICAgKiBAcGFyYW0ge0FJQ0N9IG5ld0FQSVxuICAgKi9cbiAgcmVwbGFjZVdpdGhBbm90aGVyU2Nvcm1BUEkobmV3QVBJKSB7XG4gICAgLy8gRGF0YSBNb2RlbFxuICAgIHRoaXMuY21pID0gbmV3QVBJLmNtaTtcbiAgICB0aGlzLm5hdiA9IG5ld0FQSS5uYXY7XG4gIH1cbn1cbiIsIi8vIEBmbG93XG5pbXBvcnQge0NNSUFycmF5fSBmcm9tICcuL2NtaS9jb21tb24nO1xuaW1wb3J0IHtWYWxpZGF0aW9uRXJyb3J9IGZyb20gJy4vZXhjZXB0aW9ucyc7XG5pbXBvcnQgRXJyb3JDb2RlcyBmcm9tICcuL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuaW1wb3J0IHt1bmZsYXR0ZW59IGZyb20gJy4vdXRpbGl0aWVzJztcbmltcG9ydCBkZWJvdW5jZSBmcm9tICdsb2Rhc2guZGVib3VuY2UnO1xuXG5jb25zdCBnbG9iYWxfY29uc3RhbnRzID0gQVBJQ29uc3RhbnRzLmdsb2JhbDtcbmNvbnN0IHNjb3JtMTJfZXJyb3JfY29kZXMgPSBFcnJvckNvZGVzLnNjb3JtMTI7XG5cbi8qKlxuICogQmFzZSBBUEkgY2xhc3MgZm9yIEFJQ0MsIFNDT1JNIDEuMiwgYW5kIFNDT1JNIDIwMDQuIFNob3VsZCBiZSBjb25zaWRlcmVkXG4gKiBhYnN0cmFjdCwgYW5kIG5ldmVyIGluaXRpYWxpemVkIG9uIGl0J3Mgb3duLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlQVBJIHtcbiAgI3RpbWVvdXQ7XG4gICNlcnJvcl9jb2RlcztcbiAgI3NldHRpbmdzID0ge1xuICAgIGF1dG9jb21taXQ6IGZhbHNlLFxuICAgIGF1dG9jb21taXRTZWNvbmRzOiAxMCxcbiAgICBhc3luY0NvbW1pdDogZmFsc2UsXG4gICAgc2VuZEJlYWNvbkNvbW1pdDogZmFsc2UsXG4gICAgbG1zQ29tbWl0VXJsOiBmYWxzZSxcbiAgICBkYXRhQ29tbWl0Rm9ybWF0OiAnanNvbicsIC8vIHZhbGlkIGZvcm1hdHMgYXJlICdqc29uJyBvciAnZmxhdHRlbmVkJywgJ3BhcmFtcydcbiAgICBjb21taXRSZXF1ZXN0RGF0YVR5cGU6ICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLTgnLFxuICAgIGF1dG9Qcm9ncmVzczogZmFsc2UsXG4gICAgbG9nTGV2ZWw6IGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0VSUk9SLFxuICAgIHNlbGZSZXBvcnRTZXNzaW9uVGltZTogZmFsc2UsXG4gICAgYWx3YXlzU2VuZFRvdGFsVGltZTogZmFsc2UsXG4gICAgc3RyaWN0X2Vycm9yczogdHJ1ZSxcbiAgICB4aHJIZWFkZXJzOiB7fSxcbiAgICB4aHJXaXRoQ3JlZGVudGlhbHM6IGZhbHNlLFxuICAgIHJlc3BvbnNlSGFuZGxlcjogZnVuY3Rpb24oeGhyKSB7XG4gICAgICBsZXQgcmVzdWx0O1xuICAgICAgaWYgKHR5cGVvZiB4aHIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwgfHwgIXt9Lmhhc093blByb3BlcnR5LmNhbGwocmVzdWx0LCAncmVzdWx0JykpIHtcbiAgICAgICAgICByZXN1bHQgPSB7fTtcbiAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICByZXN1bHQucmVzdWx0ID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgICAgICAgICAgcmVzdWx0LmVycm9yQ29kZSA9IDA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdC5yZXN1bHQgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuICAgICAgICAgICAgcmVzdWx0LmVycm9yQ29kZSA9IDEwMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSxcbiAgfTtcbiAgY21pO1xuICBzdGFydGluZ0RhdGE6IHt9O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQmFzZSBBUEkgY2xhc3MuIFNldHMgc29tZSBzaGFyZWQgQVBJIGZpZWxkcywgYXMgd2VsbCBhc1xuICAgKiBzZXRzIHVwIG9wdGlvbnMgZm9yIHRoZSBBUEkuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBlcnJvcl9jb2Rlc1xuICAgKiBAcGFyYW0ge29iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKGVycm9yX2NvZGVzLCBzZXR0aW5ncykge1xuICAgIGlmIChuZXcudGFyZ2V0ID09PSBCYXNlQVBJKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29uc3RydWN0IEJhc2VBUEkgaW5zdGFuY2VzIGRpcmVjdGx5Jyk7XG4gICAgfVxuICAgIHRoaXMuY3VycmVudFN0YXRlID0gZ2xvYmFsX2NvbnN0YW50cy5TVEFURV9OT1RfSU5JVElBTElaRUQ7XG4gICAgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcbiAgICB0aGlzLmxpc3RlbmVyQXJyYXkgPSBbXTtcblxuICAgIHRoaXMuI3RpbWVvdXQgPSBudWxsO1xuICAgIHRoaXMuI2Vycm9yX2NvZGVzID0gZXJyb3JfY29kZXM7XG5cbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XG4gICAgdGhpcy5hcGlMb2dMZXZlbCA9IHRoaXMuc2V0dGluZ3MubG9nTGV2ZWw7XG4gICAgdGhpcy5zZWxmUmVwb3J0U2Vzc2lvblRpbWUgPSB0aGlzLnNldHRpbmdzLnNlbGZSZXBvcnRTZXNzaW9uVGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBBUElcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gaW5pdGlhbGl6ZU1lc3NhZ2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRlcm1pbmF0aW9uTWVzc2FnZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBpbml0aWFsaXplKFxuICAgICAgY2FsbGJhY2tOYW1lOiBTdHJpbmcsXG4gICAgICBpbml0aWFsaXplTWVzc2FnZT86IFN0cmluZyxcbiAgICAgIHRlcm1pbmF0aW9uTWVzc2FnZT86IFN0cmluZykge1xuICAgIGxldCByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG5cbiAgICBpZiAodGhpcy5pc0luaXRpYWxpemVkKCkpIHtcbiAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHRoaXMuI2Vycm9yX2NvZGVzLklOSVRJQUxJWkVELCBpbml0aWFsaXplTWVzc2FnZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzVGVybWluYXRlZCgpKSB7XG4gICAgICB0aGlzLnRocm93U0NPUk1FcnJvcih0aGlzLiNlcnJvcl9jb2Rlcy5URVJNSU5BVEVELCB0ZXJtaW5hdGlvbk1lc3NhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5zZWxmUmVwb3J0U2Vzc2lvblRpbWUpIHtcbiAgICAgICAgdGhpcy5jbWkuc2V0U3RhcnRUaW1lKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gZ2xvYmFsX2NvbnN0YW50cy5TVEFURV9JTklUSUFMSVpFRDtcbiAgICAgIHRoaXMubGFzdEVycm9yQ29kZSA9IDA7XG4gICAgICByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRTtcbiAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUpO1xuICAgIH1cblxuICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgbnVsbCwgJ3JldHVybmVkOiAnICsgcmV0dXJuVmFsdWUsXG4gICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pO1xuICAgIHRoaXMuY2xlYXJTQ09STUVycm9yKHJldHVyblZhbHVlKTtcblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNlcnJvcl9jb2Rlc1xuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICBnZXQgZXJyb3JfY29kZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2Vycm9yX2NvZGVzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3NldHRpbmdzXG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIGdldCBzZXR0aW5ncygpIHtcbiAgICByZXR1cm4gdGhpcy4jc2V0dGluZ3M7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc2V0dGluZ3NcbiAgICogQHBhcmFtIHtvYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3M6IE9iamVjdCkge1xuICAgIHRoaXMuI3NldHRpbmdzID0gey4uLnRoaXMuI3NldHRpbmdzLCAuLi5zZXR0aW5nc307XG4gIH1cblxuICAvKipcbiAgICogVGVybWluYXRlcyB0aGUgY3VycmVudCBydW4gb2YgdGhlIEFQSVxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tUZXJtaW5hdGVkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHRlcm1pbmF0ZShcbiAgICAgIGNhbGxiYWNrTmFtZTogU3RyaW5nLFxuICAgICAgY2hlY2tUZXJtaW5hdGVkOiBib29sZWFuKSB7XG4gICAgbGV0IHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcblxuICAgIGlmICh0aGlzLmNoZWNrU3RhdGUoY2hlY2tUZXJtaW5hdGVkLFxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5URVJNSU5BVElPTl9CRUZPUkVfSU5JVCxcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuTVVMVElQTEVfVEVSTUlOQVRJT04pKSB7XG4gICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IGdsb2JhbF9jb25zdGFudHMuU1RBVEVfVEVSTUlOQVRFRDtcblxuICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5zdG9yZURhdGEodHJ1ZSk7XG4gICAgICBpZiAoIXRoaXMuc2V0dGluZ3Muc2VuZEJlYWNvbkNvbW1pdCAmJiAhdGhpcy5zZXR0aW5ncy5hc3luY0NvbW1pdCAmJlxuICAgICAgICAgIHR5cGVvZiByZXN1bHQuZXJyb3JDb2RlICE9PSAndW5kZWZpbmVkJyAmJiByZXN1bHQuZXJyb3JDb2RlID4gMCkge1xuICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihyZXN1bHQuZXJyb3JDb2RlKTtcbiAgICAgIH1cbiAgICAgIHJldHVyblZhbHVlID0gKHR5cGVvZiByZXN1bHQgIT09ICd1bmRlZmluZWQnICYmIHJlc3VsdC5yZXN1bHQpID9cbiAgICAgICAgICByZXN1bHQucmVzdWx0IDogZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcblxuICAgICAgaWYgKGNoZWNrVGVybWluYXRlZCkgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcblxuICAgICAgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUU7XG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcbiAgICB0aGlzLmNsZWFyU0NPUk1FcnJvcihyZXR1cm5WYWx1ZSk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSB2YWx1ZSBvZiB0aGUgQ01JRWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrVGVybWluYXRlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXRWYWx1ZShcbiAgICAgIGNhbGxiYWNrTmFtZTogU3RyaW5nLFxuICAgICAgY2hlY2tUZXJtaW5hdGVkOiBib29sZWFuLFxuICAgICAgQ01JRWxlbWVudDogU3RyaW5nKSB7XG4gICAgbGV0IHJldHVyblZhbHVlO1xuXG4gICAgaWYgKHRoaXMuY2hlY2tTdGF0ZShjaGVja1Rlcm1pbmF0ZWQsXG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLlJFVFJJRVZFX0JFRk9SRV9JTklULFxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5SRVRSSUVWRV9BRlRFUl9URVJNKSkge1xuICAgICAgaWYgKGNoZWNrVGVybWluYXRlZCkgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVyblZhbHVlID0gdGhpcy5nZXRDTUlWYWx1ZShDTUlFbGVtZW50KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBWYWxpZGF0aW9uRXJyb3IpIHtcbiAgICAgICAgICB0aGlzLmxhc3RFcnJvckNvZGUgPSBlLmVycm9yQ29kZTtcbiAgICAgICAgICByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGUubWVzc2FnZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlLm1lc3NhZ2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcih0aGlzLiNlcnJvcl9jb2Rlcy5HRU5FUkFMKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSwgQ01JRWxlbWVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBDTUlFbGVtZW50LCAnOiByZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcbiAgICB0aGlzLmNsZWFyU0NPUk1FcnJvcihyZXR1cm5WYWx1ZSk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIENNSUVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbW1pdENhbGxiYWNrXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tUZXJtaW5hdGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgc2V0VmFsdWUoXG4gICAgICBjYWxsYmFja05hbWU6IFN0cmluZyxcbiAgICAgIGNvbW1pdENhbGxiYWNrOiBTdHJpbmcsXG4gICAgICBjaGVja1Rlcm1pbmF0ZWQ6IGJvb2xlYW4sXG4gICAgICBDTUlFbGVtZW50LFxuICAgICAgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuICAgIH1cbiAgICBsZXQgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuXG4gICAgaWYgKHRoaXMuY2hlY2tTdGF0ZShjaGVja1Rlcm1pbmF0ZWQsIHRoaXMuI2Vycm9yX2NvZGVzLlNUT1JFX0JFRk9SRV9JTklULFxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5TVE9SRV9BRlRFUl9URVJNKSkge1xuICAgICAgaWYgKGNoZWNrVGVybWluYXRlZCkgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVyblZhbHVlID0gdGhpcy5zZXRDTUlWYWx1ZShDTUlFbGVtZW50LCB2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgVmFsaWRhdGlvbkVycm9yKSB7XG4gICAgICAgICAgdGhpcy5sYXN0RXJyb3JDb2RlID0gZS5lcnJvckNvZGU7XG4gICAgICAgICAgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChlLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZS5tZXNzYWdlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IodGhpcy4jZXJyb3JfY29kZXMuR0VORVJBTCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUsIENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAocmV0dXJuVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuICAgIH1cblxuICAgIC8vIElmIHdlIGRpZG4ndCBoYXZlIGFueSBlcnJvcnMgd2hpbGUgc2V0dGluZyB0aGUgZGF0YSwgZ28gYWhlYWQgYW5kXG4gICAgLy8gc2NoZWR1bGUgYSBjb21taXQsIGlmIGF1dG9jb21taXQgaXMgdHVybmVkIG9uXG4gICAgaWYgKFN0cmluZyh0aGlzLmxhc3RFcnJvckNvZGUpID09PSAnMCcpIHtcbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLmF1dG9jb21taXQgJiYgIXRoaXMuI3RpbWVvdXQpIHtcbiAgICAgICAgdGhpcy5zY2hlZHVsZUNvbW1pdCh0aGlzLnNldHRpbmdzLmF1dG9jb21taXRTZWNvbmRzICogMTAwMCwgY29tbWl0Q2FsbGJhY2spO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgQ01JRWxlbWVudCxcbiAgICAgICAgJzogJyArIHZhbHVlICsgJzogcmVzdWx0OiAnICsgcmV0dXJuVmFsdWUsXG4gICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pO1xuICAgIHRoaXMuY2xlYXJTQ09STUVycm9yKHJldHVyblZhbHVlKTtcblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcmRlcnMgTE1TIHRvIHN0b3JlIGFsbCBjb250ZW50IHBhcmFtZXRlcnNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrVGVybWluYXRlZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBjb21taXQoXG4gICAgICBjYWxsYmFja05hbWU6IFN0cmluZyxcbiAgICAgIGNoZWNrVGVybWluYXRlZDogYm9vbGVhbikge1xuICAgIHRoaXMuY2xlYXJTY2hlZHVsZWRDb21taXQoKTtcblxuICAgIGxldCByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG5cbiAgICBpZiAodGhpcy5jaGVja1N0YXRlKGNoZWNrVGVybWluYXRlZCwgdGhpcy4jZXJyb3JfY29kZXMuQ09NTUlUX0JFRk9SRV9JTklULFxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5DT01NSVRfQUZURVJfVEVSTSkpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuc3RvcmVEYXRhKGZhbHNlKTtcbiAgICAgIGlmICghdGhpcy5zZXR0aW5ncy5zZW5kQmVhY29uQ29tbWl0ICYmICF0aGlzLnNldHRpbmdzLmFzeW5jQ29tbWl0ICYmXG4gICAgICAgICAgcmVzdWx0LmVycm9yQ29kZSAmJiByZXN1bHQuZXJyb3JDb2RlID4gMCkge1xuICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihyZXN1bHQuZXJyb3JDb2RlKTtcbiAgICAgIH1cbiAgICAgIHJldHVyblZhbHVlID0gKHR5cGVvZiByZXN1bHQgIT09ICd1bmRlZmluZWQnICYmIHJlc3VsdC5yZXN1bHQpID9cbiAgICAgICAgICByZXN1bHQucmVzdWx0IDogZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcblxuICAgICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCAnSHR0cFJlcXVlc3QnLCAnIFJlc3VsdDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0RFQlVHKTtcblxuICAgICAgaWYgKGNoZWNrVGVybWluYXRlZCkgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcblxuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBudWxsLCAncmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG4gICAgdGhpcy5jbGVhclNDT1JNRXJyb3IocmV0dXJuVmFsdWUpO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgbGFzdCBlcnJvciBjb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0TGFzdEVycm9yKGNhbGxiYWNrTmFtZTogU3RyaW5nKSB7XG4gICAgY29uc3QgcmV0dXJuVmFsdWUgPSBTdHJpbmcodGhpcy5sYXN0RXJyb3JDb2RlKTtcblxuICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUpO1xuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBudWxsLCAncmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZXJyb3JOdW1iZXIgZXJyb3IgZGVzY3JpcHRpb25cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gQ01JRXJyb3JDb2RlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldEVycm9yU3RyaW5nKGNhbGxiYWNrTmFtZTogU3RyaW5nLCBDTUlFcnJvckNvZGUpIHtcbiAgICBsZXQgcmV0dXJuVmFsdWUgPSAnJztcblxuICAgIGlmIChDTUlFcnJvckNvZGUgIT09IG51bGwgJiYgQ01JRXJyb3JDb2RlICE9PSAnJykge1xuICAgICAgcmV0dXJuVmFsdWUgPSB0aGlzLmdldExtc0Vycm9yTWVzc2FnZURldGFpbHMoQ01JRXJyb3JDb2RlKTtcbiAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUpO1xuICAgIH1cblxuICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgbnVsbCwgJ3JldHVybmVkOiAnICsgcmV0dXJuVmFsdWUsXG4gICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBjb21wcmVoZW5zaXZlIGRlc2NyaXB0aW9uIG9mIHRoZSBlcnJvck51bWJlciBlcnJvci5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gQ01JRXJyb3JDb2RlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldERpYWdub3N0aWMoY2FsbGJhY2tOYW1lOiBTdHJpbmcsIENNSUVycm9yQ29kZSkge1xuICAgIGxldCByZXR1cm5WYWx1ZSA9ICcnO1xuXG4gICAgaWYgKENNSUVycm9yQ29kZSAhPT0gbnVsbCAmJiBDTUlFcnJvckNvZGUgIT09ICcnKSB7XG4gICAgICByZXR1cm5WYWx1ZSA9IHRoaXMuZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhDTUlFcnJvckNvZGUsIHRydWUpO1xuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBudWxsLCAncmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHRoZSBMTVMgc3RhdGUgYW5kIGVuc3VyZXMgaXQgaGFzIGJlZW4gaW5pdGlhbGl6ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tUZXJtaW5hdGVkXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiZWZvcmVJbml0RXJyb3JcbiAgICogQHBhcmFtIHtudW1iZXJ9IGFmdGVyVGVybUVycm9yXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBjaGVja1N0YXRlKFxuICAgICAgY2hlY2tUZXJtaW5hdGVkOiBib29sZWFuLFxuICAgICAgYmVmb3JlSW5pdEVycm9yOiBudW1iZXIsXG4gICAgICBhZnRlclRlcm1FcnJvcj86IG51bWJlcikge1xuICAgIGlmICh0aGlzLmlzTm90SW5pdGlhbGl6ZWQoKSkge1xuICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoYmVmb3JlSW5pdEVycm9yKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGNoZWNrVGVybWluYXRlZCAmJiB0aGlzLmlzVGVybWluYXRlZCgpKSB7XG4gICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihhZnRlclRlcm1FcnJvcik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogTG9nZ2luZyBmb3IgYWxsIFNDT1JNIGFjdGlvbnNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZ1bmN0aW9uTmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9nTWVzc2FnZVxuICAgKiBAcGFyYW0ge251bWJlcn1tZXNzYWdlTGV2ZWxcbiAgICovXG4gIGFwaUxvZyhcbiAgICAgIGZ1bmN0aW9uTmFtZTogU3RyaW5nLFxuICAgICAgQ01JRWxlbWVudDogU3RyaW5nLFxuICAgICAgbG9nTWVzc2FnZTogU3RyaW5nLFxuICAgICAgbWVzc2FnZUxldmVsOiBudW1iZXIpIHtcbiAgICBsb2dNZXNzYWdlID0gdGhpcy5mb3JtYXRNZXNzYWdlKGZ1bmN0aW9uTmFtZSwgQ01JRWxlbWVudCwgbG9nTWVzc2FnZSk7XG5cbiAgICBpZiAobWVzc2FnZUxldmVsID49IHRoaXMuYXBpTG9nTGV2ZWwpIHtcbiAgICAgIHN3aXRjaCAobWVzc2FnZUxldmVsKSB7XG4gICAgICAgIGNhc2UgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfRVJST1I6XG4gICAgICAgICAgY29uc29sZS5lcnJvcihsb2dNZXNzYWdlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9XQVJOSU5HOlxuICAgICAgICAgIGNvbnNvbGUud2Fybihsb2dNZXNzYWdlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPOlxuICAgICAgICAgIGNvbnNvbGUuaW5mbyhsb2dNZXNzYWdlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9ERUJVRzpcbiAgICAgICAgICBpZiAoY29uc29sZS5kZWJ1Zykge1xuICAgICAgICAgICAgY29uc29sZS5kZWJ1Zyhsb2dNZXNzYWdlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2cobG9nTWVzc2FnZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGb3JtYXRzIHRoZSBTQ09STSBtZXNzYWdlcyBmb3IgZWFzeSByZWFkaW5nXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmdW5jdGlvbk5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZm9ybWF0TWVzc2FnZShmdW5jdGlvbk5hbWU6IFN0cmluZywgQ01JRWxlbWVudDogU3RyaW5nLCBtZXNzYWdlOiBTdHJpbmcpIHtcbiAgICBjb25zdCBiYXNlTGVuZ3RoID0gMjA7XG4gICAgbGV0IG1lc3NhZ2VTdHJpbmcgPSAnJztcblxuICAgIG1lc3NhZ2VTdHJpbmcgKz0gZnVuY3Rpb25OYW1lO1xuXG4gICAgbGV0IGZpbGxDaGFycyA9IGJhc2VMZW5ndGggLSBtZXNzYWdlU3RyaW5nLmxlbmd0aDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsbENoYXJzOyBpKyspIHtcbiAgICAgIG1lc3NhZ2VTdHJpbmcgKz0gJyAnO1xuICAgIH1cblxuICAgIG1lc3NhZ2VTdHJpbmcgKz0gJzogJztcblxuICAgIGlmIChDTUlFbGVtZW50KSB7XG4gICAgICBjb25zdCBDTUlFbGVtZW50QmFzZUxlbmd0aCA9IDcwO1xuXG4gICAgICBtZXNzYWdlU3RyaW5nICs9IENNSUVsZW1lbnQ7XG5cbiAgICAgIGZpbGxDaGFycyA9IENNSUVsZW1lbnRCYXNlTGVuZ3RoIC0gbWVzc2FnZVN0cmluZy5sZW5ndGg7XG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZmlsbENoYXJzOyBqKyspIHtcbiAgICAgICAgbWVzc2FnZVN0cmluZyArPSAnICc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgIG1lc3NhZ2VTdHJpbmcgKz0gbWVzc2FnZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVzc2FnZVN0cmluZztcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgdG8gc2VlIGlmIHtzdHJ9IGNvbnRhaW5zIHt0ZXN0ZXJ9XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgU3RyaW5nIHRvIGNoZWNrIGFnYWluc3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRlc3RlciBTdHJpbmcgdG8gY2hlY2sgZm9yXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBzdHJpbmdNYXRjaGVzKHN0cjogU3RyaW5nLCB0ZXN0ZXI6IFN0cmluZykge1xuICAgIHJldHVybiBzdHIgJiYgdGVzdGVyICYmIHN0ci5tYXRjaCh0ZXN0ZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHRvIHNlZSBpZiB0aGUgc3BlY2lmaWMgb2JqZWN0IGhhcyB0aGUgZ2l2ZW4gcHJvcGVydHlcbiAgICogQHBhcmFtIHsqfSByZWZPYmplY3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZVxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2NoZWNrT2JqZWN0SGFzUHJvcGVydHkocmVmT2JqZWN0LCBhdHRyaWJ1dGU6IFN0cmluZykge1xuICAgIHJldHVybiBPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChyZWZPYmplY3QsIGF0dHJpYnV0ZSkgfHxcbiAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihcbiAgICAgICAgICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihyZWZPYmplY3QpLCBhdHRyaWJ1dGUpIHx8XG4gICAgICAgIChhdHRyaWJ1dGUgaW4gcmVmT2JqZWN0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtZXNzYWdlIHRoYXQgY29ycmVzcG9uZHMgdG8gZXJyb3JOdW1iZXJcbiAgICogQVBJcyB0aGF0IGluaGVyaXQgQmFzZUFQSSBzaG91bGQgb3ZlcnJpZGUgdGhpcyBmdW5jdGlvblxuICAgKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gX2Vycm9yTnVtYmVyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gX2RldGFpbFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhfZXJyb3JOdW1iZXIsIF9kZXRhaWwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdUaGUgZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyBtZXRob2QgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdmFsdWUgZm9yIHRoZSBzcGVjaWZpYyBlbGVtZW50LlxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0Q01JVmFsdWUoX0NNSUVsZW1lbnQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBnZXRDTUlWYWx1ZSBtZXRob2QgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgZm9yIHRoZSBzcGVjaWZpYyBlbGVtZW50LlxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfQ01JRWxlbWVudFxuICAgKiBAcGFyYW0ge2FueX0gX3ZhbHVlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBzZXRDTUlWYWx1ZShfQ01JRWxlbWVudCwgX3ZhbHVlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgc2V0Q01JVmFsdWUgbWV0aG9kIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNoYXJlZCBBUEkgbWV0aG9kIHRvIHNldCBhIHZhbGlkIGZvciBhIGdpdmVuIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc2Nvcm0yMDA0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgX2NvbW1vblNldENNSVZhbHVlKFxuICAgICAgbWV0aG9kTmFtZTogU3RyaW5nLCBzY29ybTIwMDQ6IGJvb2xlYW4sIENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgaWYgKCFDTUlFbGVtZW50IHx8IENNSUVsZW1lbnQgPT09ICcnKSB7XG4gICAgICByZXR1cm4gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcbiAgICB9XG5cbiAgICBjb25zdCBzdHJ1Y3R1cmUgPSBDTUlFbGVtZW50LnNwbGl0KCcuJyk7XG4gICAgbGV0IHJlZk9iamVjdCA9IHRoaXM7XG4gICAgbGV0IHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcbiAgICBsZXQgZm91bmRGaXJzdEluZGV4ID0gZmFsc2U7XG5cbiAgICBjb25zdCBpbnZhbGlkRXJyb3JNZXNzYWdlID0gYFRoZSBkYXRhIG1vZGVsIGVsZW1lbnQgcGFzc2VkIHRvICR7bWV0aG9kTmFtZX0gKCR7Q01JRWxlbWVudH0pIGlzIG5vdCBhIHZhbGlkIFNDT1JNIGRhdGEgbW9kZWwgZWxlbWVudC5gO1xuICAgIGNvbnN0IGludmFsaWRFcnJvckNvZGUgPSBzY29ybTIwMDQgP1xuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5VTkRFRklORURfREFUQV9NT0RFTCA6XG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLkdFTkVSQUw7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0cnVjdHVyZS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYXR0cmlidXRlID0gc3RydWN0dXJlW2ldO1xuXG4gICAgICBpZiAoaSA9PT0gc3RydWN0dXJlLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgaWYgKHNjb3JtMjAwNCAmJiAoYXR0cmlidXRlLnN1YnN0cigwLCA4KSA9PT0gJ3t0YXJnZXQ9JykgJiZcbiAgICAgICAgICAgICh0eXBlb2YgcmVmT2JqZWN0Ll9pc1RhcmdldFZhbGlkID09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IodGhpcy4jZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQpO1xuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9jaGVja09iamVjdEhhc1Byb3BlcnR5KHJlZk9iamVjdCwgYXR0cmlidXRlKSkge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQoKSAmJlxuICAgICAgICAgICAgICB0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ1xcXFwuY29ycmVjdF9yZXNwb25zZXNcXFxcLlxcXFxkKycpKSB7XG4gICAgICAgICAgICB0aGlzLnZhbGlkYXRlQ29ycmVjdFJlc3BvbnNlKENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXNjb3JtMjAwNCB8fCB0aGlzLmxhc3RFcnJvckNvZGUgPT09IDApIHtcbiAgICAgICAgICAgIHJlZk9iamVjdFthdHRyaWJ1dGVdID0gdmFsdWU7XG4gICAgICAgICAgICByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZk9iamVjdCA9IHJlZk9iamVjdFthdHRyaWJ1dGVdO1xuICAgICAgICBpZiAoIXJlZk9iamVjdCkge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlZk9iamVjdCBpbnN0YW5jZW9mIENNSUFycmF5KSB7XG4gICAgICAgICAgY29uc3QgaW5kZXggPSBwYXJzZUludChzdHJ1Y3R1cmVbaSArIDFdLCAxMCk7XG5cbiAgICAgICAgICAvLyBTQ08gaXMgdHJ5aW5nIHRvIHNldCBhbiBpdGVtIG9uIGFuIGFycmF5XG4gICAgICAgICAgaWYgKCFpc05hTihpbmRleCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSByZWZPYmplY3QuY2hpbGRBcnJheVtpbmRleF07XG5cbiAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgIHJlZk9iamVjdCA9IGl0ZW07XG4gICAgICAgICAgICAgIGZvdW5kRmlyc3RJbmRleCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zdCBuZXdDaGlsZCA9IHRoaXMuZ2V0Q2hpbGRFbGVtZW50KENNSUVsZW1lbnQsIHZhbHVlLFxuICAgICAgICAgICAgICAgICAgZm91bmRGaXJzdEluZGV4KTtcbiAgICAgICAgICAgICAgZm91bmRGaXJzdEluZGV4ID0gdHJ1ZTtcblxuICAgICAgICAgICAgICBpZiAoIW5ld0NoaWxkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoaW52YWxpZEVycm9yQ29kZSwgaW52YWxpZEVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlZk9iamVjdC5pbml0aWFsaXplZCkgbmV3Q2hpbGQuaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgICAgICAgICAgcmVmT2JqZWN0LmNoaWxkQXJyYXkucHVzaChuZXdDaGlsZCk7XG4gICAgICAgICAgICAgICAgcmVmT2JqZWN0ID0gbmV3Q2hpbGQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSGF2ZSB0byB1cGRhdGUgaSB2YWx1ZSB0byBza2lwIHRoZSBhcnJheSBwb3NpdGlvblxuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyZXR1cm5WYWx1ZSA9PT0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRSkge1xuICAgICAgdGhpcy5hcGlMb2cobWV0aG9kTmFtZSwgbnVsbCxcbiAgICAgICAgICBgVGhlcmUgd2FzIGFuIGVycm9yIHNldHRpbmcgdGhlIHZhbHVlIGZvcjogJHtDTUlFbGVtZW50fSwgdmFsdWUgb2Y6ICR7dmFsdWV9YCxcbiAgICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9XQVJOSU5HKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQWJzdHJhY3QgbWV0aG9kIGZvciB2YWxpZGF0aW5nIHRoYXQgYSByZXNwb25zZSBpcyBjb3JyZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX0NNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSBfdmFsdWVcbiAgICovXG4gIHZhbGlkYXRlQ29ycmVjdFJlc3BvbnNlKF9DTUlFbGVtZW50LCBfdmFsdWUpIHtcbiAgICAvLyBqdXN0IGEgc3R1YiBtZXRob2RcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIG9yIGJ1aWxkcyBhIG5ldyBjaGlsZCBlbGVtZW50IHRvIGFkZCB0byB0aGUgYXJyYXkuXG4gICAqIEFQSXMgdGhhdCBpbmhlcml0IEJhc2VBUEkgc2hvdWxkIG92ZXJyaWRlIHRoaXMgbWV0aG9kLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX0NNSUVsZW1lbnQgLSB1bnVzZWRcbiAgICogQHBhcmFtIHsqfSBfdmFsdWUgLSB1bnVzZWRcbiAgICogQHBhcmFtIHtib29sZWFufSBfZm91bmRGaXJzdEluZGV4IC0gdW51c2VkXG4gICAqIEByZXR1cm4geyp9XG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0Q2hpbGRFbGVtZW50KF9DTUlFbGVtZW50LCBfdmFsdWUsIF9mb3VuZEZpcnN0SW5kZXgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBnZXRDaGlsZEVsZW1lbnQgbWV0aG9kIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSB2YWx1ZSBmcm9tIHRoZSBDTUkgT2JqZWN0XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc2Nvcm0yMDA0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBfY29tbW9uR2V0Q01JVmFsdWUobWV0aG9kTmFtZTogU3RyaW5nLCBzY29ybTIwMDQ6IGJvb2xlYW4sIENNSUVsZW1lbnQpIHtcbiAgICBpZiAoIUNNSUVsZW1lbnQgfHwgQ01JRWxlbWVudCA9PT0gJycpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBjb25zdCBzdHJ1Y3R1cmUgPSBDTUlFbGVtZW50LnNwbGl0KCcuJyk7XG4gICAgbGV0IHJlZk9iamVjdCA9IHRoaXM7XG4gICAgbGV0IGF0dHJpYnV0ZSA9IG51bGw7XG5cbiAgICBjb25zdCB1bmluaXRpYWxpemVkRXJyb3JNZXNzYWdlID0gYFRoZSBkYXRhIG1vZGVsIGVsZW1lbnQgcGFzc2VkIHRvICR7bWV0aG9kTmFtZX0gKCR7Q01JRWxlbWVudH0pIGhhcyBub3QgYmVlbiBpbml0aWFsaXplZC5gO1xuICAgIGNvbnN0IGludmFsaWRFcnJvck1lc3NhZ2UgPSBgVGhlIGRhdGEgbW9kZWwgZWxlbWVudCBwYXNzZWQgdG8gJHttZXRob2ROYW1lfSAoJHtDTUlFbGVtZW50fSkgaXMgbm90IGEgdmFsaWQgU0NPUk0gZGF0YSBtb2RlbCBlbGVtZW50LmA7XG4gICAgY29uc3QgaW52YWxpZEVycm9yQ29kZSA9IHNjb3JtMjAwNCA/XG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLlVOREVGSU5FRF9EQVRBX01PREVMIDpcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuR0VORVJBTDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RydWN0dXJlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhdHRyaWJ1dGUgPSBzdHJ1Y3R1cmVbaV07XG5cbiAgICAgIGlmICghc2Nvcm0yMDA0KSB7XG4gICAgICAgIGlmIChpID09PSBzdHJ1Y3R1cmUubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGlmICghdGhpcy5fY2hlY2tPYmplY3RIYXNQcm9wZXJ0eShyZWZPYmplY3QsIGF0dHJpYnV0ZSkpIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKChTdHJpbmcoYXR0cmlidXRlKS5zdWJzdHIoMCwgOCkgPT09ICd7dGFyZ2V0PScpICYmXG4gICAgICAgICAgICAodHlwZW9mIHJlZk9iamVjdC5faXNUYXJnZXRWYWxpZCA9PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICAgIGNvbnN0IHRhcmdldCA9IFN0cmluZyhhdHRyaWJ1dGUpLlxuICAgICAgICAgICAgICBzdWJzdHIoOCwgU3RyaW5nKGF0dHJpYnV0ZSkubGVuZ3RoIC0gOSk7XG4gICAgICAgICAgcmV0dXJuIHJlZk9iamVjdC5faXNUYXJnZXRWYWxpZCh0YXJnZXQpO1xuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9jaGVja09iamVjdEhhc1Byb3BlcnR5KHJlZk9iamVjdCwgYXR0cmlidXRlKSkge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZWZPYmplY3QgPSByZWZPYmplY3RbYXR0cmlidXRlXTtcbiAgICAgIGlmIChyZWZPYmplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihpbnZhbGlkRXJyb3JDb2RlLCBpbnZhbGlkRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWZPYmplY3QgaW5zdGFuY2VvZiBDTUlBcnJheSkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KHN0cnVjdHVyZVtpICsgMV0sIDEwKTtcblxuICAgICAgICAvLyBTQ08gaXMgdHJ5aW5nIHRvIHNldCBhbiBpdGVtIG9uIGFuIGFycmF5XG4gICAgICAgIGlmICghaXNOYU4oaW5kZXgpKSB7XG4gICAgICAgICAgY29uc3QgaXRlbSA9IHJlZk9iamVjdC5jaGlsZEFycmF5W2luZGV4XTtcblxuICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICByZWZPYmplY3QgPSBpdGVtO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcih0aGlzLiNlcnJvcl9jb2Rlcy5WQUxVRV9OT1RfSU5JVElBTElaRUQsXG4gICAgICAgICAgICAgICAgdW5pbml0aWFsaXplZEVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBIYXZlIHRvIHVwZGF0ZSBpIHZhbHVlIHRvIHNraXAgdGhlIGFycmF5IHBvc2l0aW9uXG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJlZk9iamVjdCA9PT0gbnVsbCB8fCByZWZPYmplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKCFzY29ybTIwMDQpIHtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZSA9PT0gJ19jaGlsZHJlbicpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTEyX2Vycm9yX2NvZGVzLkNISUxEUkVOX0VSUk9SKTtcbiAgICAgICAgfSBlbHNlIGlmIChhdHRyaWJ1dGUgPT09ICdfY291bnQnKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0xMl9lcnJvcl9jb2Rlcy5DT1VOVF9FUlJPUik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlZk9iamVjdDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBBUEkncyBjdXJyZW50IHN0YXRlIGlzIFNUQVRFX0lOSVRJQUxJWkVEXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBpc0luaXRpYWxpemVkKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9PT0gZ2xvYmFsX2NvbnN0YW50cy5TVEFURV9JTklUSUFMSVpFRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIEFQSSdzIGN1cnJlbnQgc3RhdGUgaXMgU1RBVEVfTk9UX0lOSVRJQUxJWkVEXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBpc05vdEluaXRpYWxpemVkKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9PT0gZ2xvYmFsX2NvbnN0YW50cy5TVEFURV9OT1RfSU5JVElBTElaRUQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBBUEkncyBjdXJyZW50IHN0YXRlIGlzIFNUQVRFX1RFUk1JTkFURURcbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGlzVGVybWluYXRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUgPT09IGdsb2JhbF9jb25zdGFudHMuU1RBVEVfVEVSTUlOQVRFRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBhIG1lY2hhbmlzbSBmb3IgYXR0YWNoaW5nIHRvIGEgc3BlY2lmaWMgU0NPUk0gZXZlbnRcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxpc3RlbmVyTmFtZVxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb24obGlzdGVuZXJOYW1lOiBTdHJpbmcsIGNhbGxiYWNrOiBmdW5jdGlvbikge1xuICAgIGlmICghY2FsbGJhY2spIHJldHVybjtcblxuICAgIGNvbnN0IGxpc3RlbmVyRnVuY3Rpb25zID0gbGlzdGVuZXJOYW1lLnNwbGl0KCcgJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0ZW5lckZ1bmN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbGlzdGVuZXJTcGxpdCA9IGxpc3RlbmVyRnVuY3Rpb25zW2ldLnNwbGl0KCcuJyk7XG4gICAgICBpZiAobGlzdGVuZXJTcGxpdC5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgICAgY29uc3QgZnVuY3Rpb25OYW1lID0gbGlzdGVuZXJTcGxpdFswXTtcblxuICAgICAgbGV0IENNSUVsZW1lbnQgPSBudWxsO1xuICAgICAgaWYgKGxpc3RlbmVyU3BsaXQubGVuZ3RoID4gMSkge1xuICAgICAgICBDTUlFbGVtZW50ID0gbGlzdGVuZXJOYW1lLnJlcGxhY2UoZnVuY3Rpb25OYW1lICsgJy4nLCAnJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGlzdGVuZXJBcnJheS5wdXNoKHtcbiAgICAgICAgZnVuY3Rpb25OYW1lOiBmdW5jdGlvbk5hbWUsXG4gICAgICAgIENNSUVsZW1lbnQ6IENNSUVsZW1lbnQsXG4gICAgICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmFwaUxvZygnb24nLCBmdW5jdGlvbk5hbWUsIGBBZGRlZCBldmVudCBsaXN0ZW5lcjogJHt0aGlzLmxpc3RlbmVyQXJyYXkubGVuZ3RofWAsIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBhIG1lY2hhbmlzbSBmb3IgZGV0YWNoaW5nIGEgc3BlY2lmaWMgU0NPUk0gZXZlbnQgbGlzdGVuZXJcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxpc3RlbmVyTmFtZVxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb2ZmKGxpc3RlbmVyTmFtZTogU3RyaW5nLCBjYWxsYmFjazogZnVuY3Rpb24pIHtcbiAgICBpZiAoIWNhbGxiYWNrKSByZXR1cm47XG5cbiAgICBjb25zdCBsaXN0ZW5lckZ1bmN0aW9ucyA9IGxpc3RlbmVyTmFtZS5zcGxpdCgnICcpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdGVuZXJGdW5jdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGxpc3RlbmVyU3BsaXQgPSBsaXN0ZW5lckZ1bmN0aW9uc1tpXS5zcGxpdCgnLicpO1xuICAgICAgaWYgKGxpc3RlbmVyU3BsaXQubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IGZ1bmN0aW9uTmFtZSA9IGxpc3RlbmVyU3BsaXRbMF07XG5cbiAgICAgIGxldCBDTUlFbGVtZW50ID0gbnVsbDtcbiAgICAgIGlmIChsaXN0ZW5lclNwbGl0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgQ01JRWxlbWVudCA9IGxpc3RlbmVyTmFtZS5yZXBsYWNlKGZ1bmN0aW9uTmFtZSArICcuJywgJycpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZW1vdmVJbmRleCA9IHRoaXMubGlzdGVuZXJBcnJheS5maW5kSW5kZXgoKG9iaikgPT5cbiAgICAgICAgb2JqLmZ1bmN0aW9uTmFtZSA9PT0gZnVuY3Rpb25OYW1lICYmXG4gICAgICAgIG9iai5DTUlFbGVtZW50ID09PSBDTUlFbGVtZW50ICYmXG4gICAgICAgIG9iai5jYWxsYmFjayA9PT0gY2FsbGJhY2tcbiAgICAgICk7XG4gICAgICBpZiAocmVtb3ZlSW5kZXggIT09IC0xKSB7XG4gICAgICAgIHRoaXMubGlzdGVuZXJBcnJheS5zcGxpY2UocmVtb3ZlSW5kZXgsIDEpO1xuICAgICAgICB0aGlzLmFwaUxvZygnb2ZmJywgZnVuY3Rpb25OYW1lLCBgUmVtb3ZlZCBldmVudCBsaXN0ZW5lcjogJHt0aGlzLmxpc3RlbmVyQXJyYXkubGVuZ3RofWAsIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBhIG1lY2hhbmlzbSBmb3IgY2xlYXJpbmcgYWxsIGxpc3RlbmVycyBmcm9tIGEgc3BlY2lmaWMgU0NPUk0gZXZlbnRcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxpc3RlbmVyTmFtZVxuICAgKi9cbiAgY2xlYXIobGlzdGVuZXJOYW1lOiBTdHJpbmcpIHtcbiAgICBjb25zdCBsaXN0ZW5lckZ1bmN0aW9ucyA9IGxpc3RlbmVyTmFtZS5zcGxpdCgnICcpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdGVuZXJGdW5jdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGxpc3RlbmVyU3BsaXQgPSBsaXN0ZW5lckZ1bmN0aW9uc1tpXS5zcGxpdCgnLicpO1xuICAgICAgaWYgKGxpc3RlbmVyU3BsaXQubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IGZ1bmN0aW9uTmFtZSA9IGxpc3RlbmVyU3BsaXRbMF07XG5cbiAgICAgIGxldCBDTUlFbGVtZW50ID0gbnVsbDtcbiAgICAgIGlmIChsaXN0ZW5lclNwbGl0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgQ01JRWxlbWVudCA9IGxpc3RlbmVyTmFtZS5yZXBsYWNlKGZ1bmN0aW9uTmFtZSArICcuJywgJycpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmxpc3RlbmVyQXJyYXkgPSB0aGlzLmxpc3RlbmVyQXJyYXkuZmlsdGVyKChvYmopID0+XG4gICAgICAgIG9iai5mdW5jdGlvbk5hbWUgIT09IGZ1bmN0aW9uTmFtZSAmJlxuICAgICAgICBvYmouQ01JRWxlbWVudCAhPT0gQ01JRWxlbWVudCxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByb2Nlc3NlcyBhbnkgJ29uJyBsaXN0ZW5lcnMgdGhhdCBoYXZlIGJlZW4gY3JlYXRlZFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZnVuY3Rpb25OYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICovXG4gIHByb2Nlc3NMaXN0ZW5lcnMoZnVuY3Rpb25OYW1lOiBTdHJpbmcsIENNSUVsZW1lbnQ6IFN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIHRoaXMuYXBpTG9nKGZ1bmN0aW9uTmFtZSwgQ01JRWxlbWVudCwgdmFsdWUpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saXN0ZW5lckFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IHRoaXMubGlzdGVuZXJBcnJheVtpXTtcbiAgICAgIGNvbnN0IGZ1bmN0aW9uc01hdGNoID0gbGlzdGVuZXIuZnVuY3Rpb25OYW1lID09PSBmdW5jdGlvbk5hbWU7XG4gICAgICBjb25zdCBsaXN0ZW5lckhhc0NNSUVsZW1lbnQgPSAhIWxpc3RlbmVyLkNNSUVsZW1lbnQ7XG4gICAgICBsZXQgQ01JRWxlbWVudHNNYXRjaCA9IGZhbHNlO1xuICAgICAgaWYgKENNSUVsZW1lbnQgJiYgbGlzdGVuZXIuQ01JRWxlbWVudCAmJlxuICAgICAgICAgIGxpc3RlbmVyLkNNSUVsZW1lbnQuc3Vic3RyaW5nKGxpc3RlbmVyLkNNSUVsZW1lbnQubGVuZ3RoIC0gMSkgPT09XG4gICAgICAgICAgJyonKSB7XG4gICAgICAgIENNSUVsZW1lbnRzTWF0Y2ggPSBDTUlFbGVtZW50LmluZGV4T2YobGlzdGVuZXIuQ01JRWxlbWVudC5zdWJzdHJpbmcoMCxcbiAgICAgICAgICAgIGxpc3RlbmVyLkNNSUVsZW1lbnQubGVuZ3RoIC0gMSkpID09PSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgQ01JRWxlbWVudHNNYXRjaCA9IGxpc3RlbmVyLkNNSUVsZW1lbnQgPT09IENNSUVsZW1lbnQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChmdW5jdGlvbnNNYXRjaCAmJiAoIWxpc3RlbmVySGFzQ01JRWxlbWVudCB8fCBDTUlFbGVtZW50c01hdGNoKSkge1xuICAgICAgICBsaXN0ZW5lci5jYWxsYmFjayhDTUlFbGVtZW50LCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRocm93cyBhIFNDT1JNIGVycm9yXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBlcnJvck51bWJlclxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuICAgKi9cbiAgdGhyb3dTQ09STUVycm9yKGVycm9yTnVtYmVyOiBudW1iZXIsIG1lc3NhZ2U6IFN0cmluZykge1xuICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgbWVzc2FnZSA9IHRoaXMuZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhlcnJvck51bWJlcik7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coJ3Rocm93U0NPUk1FcnJvcicsIG51bGwsIGVycm9yTnVtYmVyICsgJzogJyArIG1lc3NhZ2UsXG4gICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0VSUk9SKTtcblxuICAgIHRoaXMubGFzdEVycm9yQ29kZSA9IFN0cmluZyhlcnJvck51bWJlcik7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBsYXN0IFNDT1JNIGVycm9yIGNvZGUgb24gc3VjY2Vzcy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN1Y2Nlc3NcbiAgICovXG4gIGNsZWFyU0NPUk1FcnJvcihzdWNjZXNzOiBTdHJpbmcpIHtcbiAgICBpZiAoc3VjY2VzcyAhPT0gdW5kZWZpbmVkICYmIHN1Y2Nlc3MgIT09IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0UpIHtcbiAgICAgIHRoaXMubGFzdEVycm9yQ29kZSA9IDA7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHRzIHRvIHN0b3JlIHRoZSBkYXRhIHRvIHRoZSBMTVMsIGxvZ3MgZGF0YSBpZiBubyBMTVMgY29uZmlndXJlZFxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gX2NhbGN1bGF0ZVRvdGFsVGltZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgc3RvcmVEYXRhKF9jYWxjdWxhdGVUb3RhbFRpbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdUaGUgc3RvcmVEYXRhIG1ldGhvZCBoYXMgbm90IGJlZW4gaW1wbGVtZW50ZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIHRoZSBDTUkgZnJvbSBhIGZsYXR0ZW5lZCBKU09OIG9iamVjdFxuICAgKiBAcGFyYW0ge29iamVjdH0ganNvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKi9cbiAgbG9hZEZyb21GbGF0dGVuZWRKU09OKGpzb24sIENNSUVsZW1lbnQpIHtcbiAgICBpZiAoIXRoaXMuaXNOb3RJbml0aWFsaXplZCgpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICdsb2FkRnJvbUZsYXR0ZW5lZEpTT04gY2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSB0aGUgY2FsbCB0byBsbXNJbml0aWFsaXplLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRlc3QgbWF0Y2ggcGF0dGVybi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGNcbiAgICAgKiBAcGFyYW0ge1JlZ0V4cH0gYV9wYXR0ZXJuXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqL1xuICAgIGZ1bmN0aW9uIHRlc3RQYXR0ZXJuKGEsIGMsIGFfcGF0dGVybikge1xuICAgICAgY29uc3QgYV9tYXRjaCA9IGEubWF0Y2goYV9wYXR0ZXJuKTtcblxuICAgICAgbGV0IGNfbWF0Y2g7XG4gICAgICBpZiAoYV9tYXRjaCAhPT0gbnVsbCAmJiAoY19tYXRjaCA9IGMubWF0Y2goYV9wYXR0ZXJuKSkgIT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgYV9udW0gPSBOdW1iZXIoYV9tYXRjaFsyXSk7XG4gICAgICAgIGNvbnN0IGNfbnVtID0gTnVtYmVyKGNfbWF0Y2hbMl0pO1xuICAgICAgICBpZiAoYV9udW0gPT09IGNfbnVtKSB7XG4gICAgICAgICAgaWYgKGFfbWF0Y2hbM10gPT09ICdpZCcpIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGFfbWF0Y2hbM10gPT09ICd0eXBlJykge1xuICAgICAgICAgICAgaWYgKGNfbWF0Y2hbM10gPT09ICdpZCcpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYV9udW0gLSBjX251bTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgaW50X3BhdHRlcm4gPSAvXihjbWlcXC5pbnRlcmFjdGlvbnNcXC4pKFxcZCspXFwuKC4qKSQvO1xuICAgIGNvbnN0IG9ial9wYXR0ZXJuID0gL14oY21pXFwub2JqZWN0aXZlc1xcLikoXFxkKylcXC4oLiopJC87XG5cbiAgICBjb25zdCByZXN1bHQgPSBPYmplY3Qua2V5cyhqc29uKS5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gW1N0cmluZyhrZXkpLCBqc29uW2tleV1dO1xuICAgIH0pO1xuXG4gICAgLy8gQ01JIGludGVyYWN0aW9ucyBuZWVkIHRvIGhhdmUgaWQgYW5kIHR5cGUgbG9hZGVkIGJlZm9yZSBhbnkgb3RoZXIgZmllbGRzXG4gICAgcmVzdWx0LnNvcnQoZnVuY3Rpb24oW2EsIGJdLCBbYywgZF0pIHtcbiAgICAgIGxldCB0ZXN0O1xuICAgICAgaWYgKCh0ZXN0ID0gdGVzdFBhdHRlcm4oYSwgYywgaW50X3BhdHRlcm4pKSAhPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGVzdDtcbiAgICAgIH1cbiAgICAgIGlmICgodGVzdCA9IHRlc3RQYXR0ZXJuKGEsIGMsIG9ial9wYXR0ZXJuKSkgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRlc3Q7XG4gICAgICB9XG5cbiAgICAgIGlmIChhIDwgYykge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICBpZiAoYSA+IGMpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9KTtcblxuICAgIGxldCBvYmo7XG4gICAgcmVzdWx0LmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIG9iaiA9IHt9O1xuICAgICAgb2JqW2VsZW1lbnRbMF1dID0gZWxlbWVudFsxXTtcbiAgICAgIHRoaXMubG9hZEZyb21KU09OKHVuZmxhdHRlbihvYmopLCBDTUlFbGVtZW50KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkcyBDTUkgZGF0YSBmcm9tIGEgSlNPTiBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBqc29uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqL1xuICBsb2FkRnJvbUpTT04oanNvbiwgQ01JRWxlbWVudCkge1xuICAgIGlmICghdGhpcy5pc05vdEluaXRpYWxpemVkKCkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgJ2xvYWRGcm9tSlNPTiBjYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlIHRoZSBjYWxsIHRvIGxtc0luaXRpYWxpemUuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgQ01JRWxlbWVudCA9IENNSUVsZW1lbnQgIT09IHVuZGVmaW5lZCA/IENNSUVsZW1lbnQgOiAnY21pJztcblxuICAgIHRoaXMuc3RhcnRpbmdEYXRhID0ganNvbjtcblxuICAgIC8vIGNvdWxkIHRoaXMgYmUgcmVmYWN0b3JlZCBkb3duIHRvIGZsYXR0ZW4oanNvbikgdGhlbiBzZXRDTUlWYWx1ZSBvbiBlYWNoP1xuICAgIGZvciAoY29uc3Qga2V5IGluIGpzb24pIHtcbiAgICAgIGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGpzb24sIGtleSkgJiYganNvbltrZXldKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRDTUlFbGVtZW50ID0gKENNSUVsZW1lbnQgPyBDTUlFbGVtZW50ICsgJy4nIDogJycpICsga2V5O1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGpzb25ba2V5XTtcblxuICAgICAgICBpZiAodmFsdWVbJ2NoaWxkQXJyYXknXSkge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVbJ2NoaWxkQXJyYXknXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5sb2FkRnJvbUpTT04odmFsdWVbJ2NoaWxkQXJyYXknXVtpXSxcbiAgICAgICAgICAgICAgICBjdXJyZW50Q01JRWxlbWVudCArICcuJyArIGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB7XG4gICAgICAgICAgdGhpcy5sb2FkRnJvbUpTT04odmFsdWUsIGN1cnJlbnRDTUlFbGVtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldENNSVZhbHVlKGN1cnJlbnRDTUlFbGVtZW50LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBDTUkgb2JqZWN0IHRvIEpTT04gZm9yIHNlbmRpbmcgdG8gYW4gTE1TLlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICByZW5kZXJDTUlUb0pTT05TdHJpbmcoKSB7XG4gICAgY29uc3QgY21pID0gdGhpcy5jbWk7XG4gICAgLy8gRG8gd2Ugd2FudC9uZWVkIHRvIHJldHVybiBmaWVsZHMgdGhhdCBoYXZlIG5vIHNldCB2YWx1ZT9cbiAgICAvLyByZXR1cm4gSlNPTi5zdHJpbmdpZnkoeyBjbWkgfSwgKGssIHYpID0+IHYgPT09IHVuZGVmaW5lZCA/IG51bGwgOiB2LCAyKTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoe2NtaX0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBKUyBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjdXJyZW50IGNtaVxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICByZW5kZXJDTUlUb0pTT05PYmplY3QoKSB7XG4gICAgLy8gRG8gd2Ugd2FudC9uZWVkIHRvIHJldHVybiBmaWVsZHMgdGhhdCBoYXZlIG5vIHNldCB2YWx1ZT9cbiAgICAvLyByZXR1cm4gSlNPTi5zdHJpbmdpZnkoeyBjbWkgfSwgKGssIHYpID0+IHYgPT09IHVuZGVmaW5lZCA/IG51bGwgOiB2LCAyKTtcbiAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLnJlbmRlckNNSVRvSlNPTlN0cmluZygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGNtaSBvYmplY3QgdG8gdGhlIHByb3BlciBmb3JtYXQgZm9yIExNUyBjb21taXRcbiAgICogQVBJcyB0aGF0IGluaGVyaXQgQmFzZUFQSSBzaG91bGQgb3ZlcnJpZGUgdGhpcyBmdW5jdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IF90ZXJtaW5hdGVDb21taXRcbiAgICogQHJldHVybiB7Kn1cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICByZW5kZXJDb21taXRDTUkoX3Rlcm1pbmF0ZUNvbW1pdCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ1RoZSBzdG9yZURhdGEgbWV0aG9kIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgdGhlIHJlcXVlc3QgdG8gdGhlIExNU1xuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAqIEBwYXJhbSB7b2JqZWN0fEFycmF5fSBwYXJhbXNcbiAgICogQHBhcmFtIHtib29sZWFufSBpbW1lZGlhdGVcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cbiAgcHJvY2Vzc0h0dHBSZXF1ZXN0KHVybDogU3RyaW5nLCBwYXJhbXMsIGltbWVkaWF0ZSA9IGZhbHNlKSB7XG4gICAgY29uc3QgYXBpID0gdGhpcztcbiAgICBjb25zdCBwcm9jZXNzID0gZnVuY3Rpb24odXJsLCBwYXJhbXMsIHNldHRpbmdzLCBlcnJvcl9jb2Rlcykge1xuICAgICAgY29uc3QgZ2VuZXJpY0Vycm9yID0ge1xuICAgICAgICAncmVzdWx0JzogZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRSxcbiAgICAgICAgJ2Vycm9yQ29kZSc6IGVycm9yX2NvZGVzLkdFTkVSQUwsXG4gICAgICB9O1xuXG4gICAgICBsZXQgcmVzdWx0O1xuICAgICAgaWYgKCFzZXR0aW5ncy5zZW5kQmVhY29uQ29tbWl0KSB7XG4gICAgICAgIGNvbnN0IGh0dHBSZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgaHR0cFJlcS5vcGVuKCdQT1NUJywgdXJsLCBzZXR0aW5ncy5hc3luY0NvbW1pdCk7XG5cbiAgICAgICAgaWYoT2JqZWN0LmtleXMoc2V0dGluZ3MueGhySGVhZGVycykubGVuZ3RoKSB7XG4gICAgICAgICAgT2JqZWN0LmtleXMoc2V0dGluZ3MueGhySGVhZGVycykuZm9yRWFjaCgoaGVhZGVyKSA9PiB7XG4gICAgICAgICAgICBodHRwUmVxLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCBzZXR0aW5ncy54aHJIZWFkZXJzW2hlYWRlcl0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGh0dHBSZXEud2l0aENyZWRlbnRpYWxzID0gc2V0dGluZ3MueGhyV2l0aENyZWRlbnRpYWxzXG5cbiAgICAgICAgaWYgKHNldHRpbmdzLmFzeW5jQ29tbWl0KSB7XG4gICAgICAgICAgaHR0cFJlcS5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHNldHRpbmdzLnJlc3BvbnNlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICByZXN1bHQgPSBzZXR0aW5ncy5yZXNwb25zZUhhbmRsZXIoaHR0cFJlcSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKGh0dHBSZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHBhcmFtcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBodHRwUmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsXG4gICAgICAgICAgICAgICAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xuICAgICAgICAgICAgaHR0cFJlcS5zZW5kKHBhcmFtcy5qb2luKCcmJykpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBodHRwUmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MuY29tbWl0UmVxdWVzdERhdGFUeXBlKTtcbiAgICAgICAgICAgIGh0dHBSZXEuc2VuZChKU09OLnN0cmluZ2lmeShwYXJhbXMpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXNldHRpbmdzLmFzeW5jQ29tbWl0KSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHNldHRpbmdzLnJlc3BvbnNlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICByZXN1bHQgPSBzZXR0aW5ncy5yZXNwb25zZUhhbmRsZXIoaHR0cFJlcSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKGh0dHBSZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0ge307XG4gICAgICAgICAgICByZXN1bHQucmVzdWx0ID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgICAgICAgICAgcmVzdWx0LmVycm9yQ29kZSA9IDA7XG4gICAgICAgICAgICBhcGkucHJvY2Vzc0xpc3RlbmVycygnQ29tbWl0U3VjY2VzcycpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIGFwaS5wcm9jZXNzTGlzdGVuZXJzKCdDb21taXRFcnJvcicpO1xuICAgICAgICAgIHJldHVybiBnZW5lcmljRXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgaGVhZGVycyA9IHtcbiAgICAgICAgICAgIHR5cGU6IHNldHRpbmdzLmNvbW1pdFJlcXVlc3REYXRhVHlwZSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGxldCBibG9iO1xuICAgICAgICAgIGlmIChwYXJhbXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgYmxvYiA9IG5ldyBCbG9iKFtwYXJhbXMuam9pbignJicpXSwgaGVhZGVycyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJsb2IgPSBuZXcgQmxvYihbSlNPTi5zdHJpbmdpZnkocGFyYW1zKV0sIGhlYWRlcnMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc3VsdCA9IHt9O1xuICAgICAgICAgIGlmIChuYXZpZ2F0b3Iuc2VuZEJlYWNvbih1cmwsIGJsb2IpKSB7XG4gICAgICAgICAgICByZXN1bHQucmVzdWx0ID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgICAgICAgICAgcmVzdWx0LmVycm9yQ29kZSA9IDA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdC5yZXN1bHQgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuICAgICAgICAgICAgcmVzdWx0LmVycm9yQ29kZSA9IDEwMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIGFwaS5wcm9jZXNzTGlzdGVuZXJzKCdDb21taXRFcnJvcicpO1xuICAgICAgICAgIHJldHVybiBnZW5lcmljRXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiByZXN1bHQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGFwaS5wcm9jZXNzTGlzdGVuZXJzKCdDb21taXRFcnJvcicpO1xuICAgICAgICByZXR1cm4gZ2VuZXJpY0Vycm9yO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzdWx0LnJlc3VsdCA9PT0gdHJ1ZSB8fFxuICAgICAgICAgIHJlc3VsdC5yZXN1bHQgPT09IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRSkge1xuICAgICAgICBhcGkucHJvY2Vzc0xpc3RlbmVycygnQ29tbWl0U3VjY2VzcycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXBpLnByb2Nlc3NMaXN0ZW5lcnMoJ0NvbW1pdEVycm9yJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgZGVib3VuY2UgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCBkZWJvdW5jZWQgPSBkZWJvdW5jZShwcm9jZXNzLCA1MDApO1xuICAgICAgZGVib3VuY2VkKHVybCwgcGFyYW1zLCB0aGlzLnNldHRpbmdzLCB0aGlzLmVycm9yX2NvZGVzKTtcblxuICAgICAgLy8gaWYgd2UncmUgdGVybWluYXRpbmcsIGdvIGFoZWFkIGFuZCBjb21taXQgaW1tZWRpYXRlbHlcbiAgICAgIGlmIChpbW1lZGlhdGUpIHtcbiAgICAgICAgZGVib3VuY2VkLmZsdXNoKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlc3VsdDogZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFLFxuICAgICAgICBlcnJvckNvZGU6IDAsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcHJvY2Vzcyh1cmwsIHBhcmFtcywgdGhpcy5zZXR0aW5ncywgdGhpcy5lcnJvcl9jb2Rlcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRocm93cyBhIFNDT1JNIGVycm9yXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aGVuIC0gdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gd2FpdCBiZWZvcmUgY29tbWl0dGluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2sgLSB0aGUgbmFtZSBvZiB0aGUgY29tbWl0IGV2ZW50IGNhbGxiYWNrXG4gICAqL1xuICBzY2hlZHVsZUNvbW1pdCh3aGVuOiBudW1iZXIsIGNhbGxiYWNrOiBzdHJpbmcpIHtcbiAgICB0aGlzLiN0aW1lb3V0ID0gbmV3IFNjaGVkdWxlZENvbW1pdCh0aGlzLCB3aGVuLCBjYWxsYmFjayk7XG4gICAgdGhpcy5hcGlMb2coJ3NjaGVkdWxlQ29tbWl0JywgJycsICdzY2hlZHVsZWQnLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9ERUJVRyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIGFuZCBjYW5jZWxzIGFueSBjdXJyZW50bHkgc2NoZWR1bGVkIGNvbW1pdHNcbiAgICovXG4gIGNsZWFyU2NoZWR1bGVkQ29tbWl0KCkge1xuICAgIGlmICh0aGlzLiN0aW1lb3V0KSB7XG4gICAgICB0aGlzLiN0aW1lb3V0LmNhbmNlbCgpO1xuICAgICAgdGhpcy4jdGltZW91dCA9IG51bGw7XG4gICAgICB0aGlzLmFwaUxvZygnY2xlYXJTY2hlZHVsZWRDb21taXQnLCAnJywgJ2NsZWFyZWQnLFxuICAgICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0RFQlVHKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBQcml2YXRlIGNsYXNzIHRoYXQgd3JhcHMgYSB0aW1lb3V0IGNhbGwgdG8gdGhlIGNvbW1pdCgpIGZ1bmN0aW9uXG4gKi9cbmNsYXNzIFNjaGVkdWxlZENvbW1pdCB7XG4gICNBUEk7XG4gICNjYW5jZWxsZWQgPSBmYWxzZTtcbiAgI3RpbWVvdXQ7XG4gICNjYWxsYmFjaztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIFNjaGVkdWxlZENvbW1pdFxuICAgKiBAcGFyYW0ge0Jhc2VBUEl9IEFQSVxuICAgKiBAcGFyYW0ge251bWJlcn0gd2hlblxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tcbiAgICovXG4gIGNvbnN0cnVjdG9yKEFQSTogYW55LCB3aGVuOiBudW1iZXIsIGNhbGxiYWNrOiBzdHJpbmcpIHtcbiAgICB0aGlzLiNBUEkgPSBBUEk7XG4gICAgdGhpcy4jdGltZW91dCA9IHNldFRpbWVvdXQodGhpcy53cmFwcGVyLmJpbmQodGhpcyksIHdoZW4pO1xuICAgIHRoaXMuI2NhbGxiYWNrID0gY2FsbGJhY2s7XG4gIH1cblxuICAvKipcbiAgICogQ2FuY2VsIGFueSBjdXJyZW50bHkgc2NoZWR1bGVkIGNvbW1pdFxuICAgKi9cbiAgY2FuY2VsKCkge1xuICAgIHRoaXMuI2NhbmNlbGxlZCA9IHRydWU7XG4gICAgaWYgKHRoaXMuI3RpbWVvdXQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLiN0aW1lb3V0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV3JhcCB0aGUgQVBJIGNvbW1pdCBjYWxsIHRvIGNoZWNrIGlmIHRoZSBjYWxsIGhhcyBhbHJlYWR5IGJlZW4gY2FuY2VsbGVkXG4gICAqL1xuICB3cmFwcGVyKCkge1xuICAgIGlmICghdGhpcy4jY2FuY2VsbGVkKSB7XG4gICAgICB0aGlzLiNBUEkuY29tbWl0KHRoaXMuI2NhbGxiYWNrKTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vIEBmbG93XG5pbXBvcnQgQmFzZUFQSSBmcm9tICcuL0Jhc2VBUEknO1xuaW1wb3J0IHtcbiAgQ01JLFxuICBDTUlJbnRlcmFjdGlvbnNDb3JyZWN0UmVzcG9uc2VzT2JqZWN0LFxuICBDTUlJbnRlcmFjdGlvbnNPYmplY3QsXG4gIENNSUludGVyYWN0aW9uc09iamVjdGl2ZXNPYmplY3QsXG4gIENNSU9iamVjdGl2ZXNPYmplY3QsIE5BVixcbn0gZnJvbSAnLi9jbWkvc2Nvcm0xMl9jbWknO1xuaW1wb3J0ICogYXMgVXRpbGl0aWVzIGZyb20gJy4vdXRpbGl0aWVzJztcbmltcG9ydCBBUElDb25zdGFudHMgZnJvbSAnLi9jb25zdGFudHMvYXBpX2NvbnN0YW50cyc7XG5pbXBvcnQgRXJyb3JDb2RlcyBmcm9tICcuL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5cbmNvbnN0IHNjb3JtMTJfY29uc3RhbnRzID0gQVBJQ29uc3RhbnRzLnNjb3JtMTI7XG5jb25zdCBnbG9iYWxfY29uc3RhbnRzID0gQVBJQ29uc3RhbnRzLmdsb2JhbDtcbmNvbnN0IHNjb3JtMTJfZXJyb3JfY29kZXMgPSBFcnJvckNvZGVzLnNjb3JtMTI7XG5cbi8qKlxuICogQVBJIGNsYXNzIGZvciBTQ09STSAxLjJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2Nvcm0xMkFQSSBleHRlbmRzIEJhc2VBUEkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIFNDT1JNIDEuMiBBUElcbiAgICogQHBhcmFtIHtvYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzZXR0aW5nczoge30pIHtcbiAgICBjb25zdCBmaW5hbFNldHRpbmdzID0ge1xuICAgICAgLi4ue1xuICAgICAgICBtYXN0ZXJ5X292ZXJyaWRlOiBmYWxzZSxcbiAgICAgIH0sIC4uLnNldHRpbmdzLFxuICAgIH07XG5cbiAgICBzdXBlcihzY29ybTEyX2Vycm9yX2NvZGVzLCBmaW5hbFNldHRpbmdzKTtcblxuICAgIHRoaXMuY21pID0gbmV3IENNSSgpO1xuICAgIHRoaXMubmF2ID0gbmV3IE5BVigpO1xuXG4gICAgLy8gUmVuYW1lIGZ1bmN0aW9ucyB0byBtYXRjaCAxLjIgU3BlYyBhbmQgZXhwb3NlIHRvIG1vZHVsZXNcbiAgICB0aGlzLkxNU0luaXRpYWxpemUgPSB0aGlzLmxtc0luaXRpYWxpemU7XG4gICAgdGhpcy5MTVNGaW5pc2ggPSB0aGlzLmxtc0ZpbmlzaDtcbiAgICB0aGlzLkxNU0dldFZhbHVlID0gdGhpcy5sbXNHZXRWYWx1ZTtcbiAgICB0aGlzLkxNU1NldFZhbHVlID0gdGhpcy5sbXNTZXRWYWx1ZTtcbiAgICB0aGlzLkxNU0NvbW1pdCA9IHRoaXMubG1zQ29tbWl0O1xuICAgIHRoaXMuTE1TR2V0TGFzdEVycm9yID0gdGhpcy5sbXNHZXRMYXN0RXJyb3I7XG4gICAgdGhpcy5MTVNHZXRFcnJvclN0cmluZyA9IHRoaXMubG1zR2V0RXJyb3JTdHJpbmc7XG4gICAgdGhpcy5MTVNHZXREaWFnbm9zdGljID0gdGhpcy5sbXNHZXREaWFnbm9zdGljO1xuICB9XG5cbiAgLyoqXG4gICAqIGxtc0luaXRpYWxpemUgZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJvb2xcbiAgICovXG4gIGxtc0luaXRpYWxpemUoKSB7XG4gICAgdGhpcy5jbWkuaW5pdGlhbGl6ZSgpO1xuICAgIHJldHVybiB0aGlzLmluaXRpYWxpemUoJ0xNU0luaXRpYWxpemUnLCAnTE1TIHdhcyBhbHJlYWR5IGluaXRpYWxpemVkIScsXG4gICAgICAgICdMTVMgaXMgYWxyZWFkeSBmaW5pc2hlZCEnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMTVNGaW5pc2ggZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJvb2xcbiAgICovXG4gIGxtc0ZpbmlzaCgpIHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLnRlcm1pbmF0ZSgnTE1TRmluaXNoJywgdHJ1ZSk7XG5cbiAgICBpZiAocmVzdWx0ID09PSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUUpIHtcbiAgICAgIGlmICh0aGlzLm5hdi5ldmVudCAhPT0gJycpIHtcbiAgICAgICAgaWYgKHRoaXMubmF2LmV2ZW50ID09PSAnY29udGludWUnKSB7XG4gICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZU5leHQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlUHJldmlvdXMnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLmF1dG9Qcm9ncmVzcykge1xuICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlTmV4dCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogTE1TR2V0VmFsdWUgZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXRWYWx1ZShDTUlFbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUoJ0xNU0dldFZhbHVlJywgZmFsc2UsIENNSUVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIExNU1NldFZhbHVlIGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNTZXRWYWx1ZShDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnNldFZhbHVlKCdMTVNTZXRWYWx1ZScsICdMTVNDb21taXQnLCBmYWxzZSwgQ01JRWxlbWVudCwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIExNU0NvbW1pdCBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYm9vbFxuICAgKi9cbiAgbG1zQ29tbWl0KCkge1xuICAgIHJldHVybiB0aGlzLmNvbW1pdCgnTE1TQ29tbWl0JywgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIExNU0dldExhc3RFcnJvciBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc0dldExhc3RFcnJvcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRMYXN0RXJyb3IoJ0xNU0dldExhc3RFcnJvcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIExNU0dldEVycm9yU3RyaW5nIGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVycm9yQ29kZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXRFcnJvclN0cmluZyhDTUlFcnJvckNvZGUpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRFcnJvclN0cmluZygnTE1TR2V0RXJyb3JTdHJpbmcnLCBDTUlFcnJvckNvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIExNU0dldERpYWdub3N0aWMgZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRXJyb3JDb2RlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc0dldERpYWdub3N0aWMoQ01JRXJyb3JDb2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RGlhZ25vc3RpYygnTE1TR2V0RGlhZ25vc3RpYycsIENNSUVycm9yQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhIHZhbHVlIG9uIHRoZSBDTUkgT2JqZWN0XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgc2V0Q01JVmFsdWUoQ01JRWxlbWVudCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tbW9uU2V0Q01JVmFsdWUoJ0xNU1NldFZhbHVlJywgZmFsc2UsIENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgdmFsdWUgZnJvbSB0aGUgQ01JIE9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0Q01JVmFsdWUoQ01JRWxlbWVudCkge1xuICAgIHJldHVybiB0aGlzLl9jb21tb25HZXRDTUlWYWx1ZSgnZ2V0Q01JVmFsdWUnLCBmYWxzZSwgQ01JRWxlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBvciBidWlsZHMgYSBuZXcgY2hpbGQgZWxlbWVudCB0byBhZGQgdG8gdGhlIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm91bmRGaXJzdEluZGV4XG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIGdldENoaWxkRWxlbWVudChDTUlFbGVtZW50LCB2YWx1ZSwgZm91bmRGaXJzdEluZGV4KSB7XG4gICAgbGV0IG5ld0NoaWxkO1xuXG4gICAgaWYgKHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LCAnY21pXFxcXC5vYmplY3RpdmVzXFxcXC5cXFxcZCsnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JT2JqZWN0aXZlc09iamVjdCgpO1xuICAgIH0gZWxzZSBpZiAoZm91bmRGaXJzdEluZGV4ICYmIHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LFxuICAgICAgICAnY21pXFxcXC5pbnRlcmFjdGlvbnNcXFxcLlxcXFxkK1xcXFwuY29ycmVjdF9yZXNwb25zZXNcXFxcLlxcXFxkKycpKSB7XG4gICAgICBuZXdDaGlsZCA9IG5ldyBDTUlJbnRlcmFjdGlvbnNDb3JyZWN0UmVzcG9uc2VzT2JqZWN0KCk7XG4gICAgfSBlbHNlIGlmIChmb3VuZEZpcnN0SW5kZXggJiYgdGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsXG4gICAgICAgICdjbWlcXFxcLmludGVyYWN0aW9uc1xcXFwuXFxcXGQrXFxcXC5vYmplY3RpdmVzXFxcXC5cXFxcZCsnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JSW50ZXJhY3Rpb25zT2JqZWN0aXZlc09iamVjdCgpO1xuICAgIH0gZWxzZSBpZiAoIWZvdW5kRmlyc3RJbmRleCAmJlxuICAgICAgICB0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ2NtaVxcXFwuaW50ZXJhY3Rpb25zXFxcXC5cXFxcZCsnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JSW50ZXJhY3Rpb25zT2JqZWN0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0NoaWxkO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlcyBDb3JyZWN0IFJlc3BvbnNlIHZhbHVlc1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICB2YWxpZGF0ZUNvcnJlY3RSZXNwb25zZShDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1lc3NhZ2UgdGhhdCBjb3JyZXNwb25kcyB0byBlcnJvck51bWJlci5cbiAgICpcbiAgICogQHBhcmFtIHsqfSBlcnJvck51bWJlclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGRldGFpbFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXRMbXNFcnJvck1lc3NhZ2VEZXRhaWxzKGVycm9yTnVtYmVyLCBkZXRhaWwpIHtcbiAgICBsZXQgYmFzaWNNZXNzYWdlID0gJ05vIEVycm9yJztcbiAgICBsZXQgZGV0YWlsTWVzc2FnZSA9ICdObyBFcnJvcic7XG5cbiAgICAvLyBTZXQgZXJyb3IgbnVtYmVyIHRvIHN0cmluZyBzaW5jZSBpbmNvbnNpc3RlbnQgZnJvbSBtb2R1bGVzIGlmIHN0cmluZyBvciBudW1iZXJcbiAgICBlcnJvck51bWJlciA9IFN0cmluZyhlcnJvck51bWJlcik7XG4gICAgaWYgKHNjb3JtMTJfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tlcnJvck51bWJlcl0pIHtcbiAgICAgIGJhc2ljTWVzc2FnZSA9IHNjb3JtMTJfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tlcnJvck51bWJlcl0uYmFzaWNNZXNzYWdlO1xuICAgICAgZGV0YWlsTWVzc2FnZSA9IHNjb3JtMTJfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tlcnJvck51bWJlcl0uZGV0YWlsTWVzc2FnZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGV0YWlsID8gZGV0YWlsTWVzc2FnZSA6IGJhc2ljTWVzc2FnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIHRoZSB3aG9sZSBBUEkgd2l0aCBhbm90aGVyXG4gICAqXG4gICAqIEBwYXJhbSB7U2Nvcm0xMkFQSX0gbmV3QVBJXG4gICAqL1xuICByZXBsYWNlV2l0aEFub3RoZXJTY29ybUFQSShuZXdBUEkpIHtcbiAgICAvLyBEYXRhIE1vZGVsXG4gICAgdGhpcy5jbWkgPSBuZXdBUEkuY21pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgY21pIG9iamVjdCB0byB0aGUgcHJvcGVyIGZvcm1hdCBmb3IgTE1TIGNvbW1pdFxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHRlcm1pbmF0ZUNvbW1pdFxuICAgKiBAcmV0dXJuIHtvYmplY3R8QXJyYXl9XG4gICAqL1xuICByZW5kZXJDb21taXRDTUkodGVybWluYXRlQ29tbWl0OiBib29sZWFuKSB7XG4gICAgY29uc3QgY21pRXhwb3J0ID0gdGhpcy5yZW5kZXJDTUlUb0pTT05PYmplY3QoKTtcblxuICAgIGlmICh0ZXJtaW5hdGVDb21taXQpIHtcbiAgICAgIGNtaUV4cG9ydC5jbWkuY29yZS50b3RhbF90aW1lID0gdGhpcy5jbWkuZ2V0Q3VycmVudFRvdGFsVGltZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgIGNvbnN0IGZsYXR0ZW5lZCA9IFV0aWxpdGllcy5mbGF0dGVuKGNtaUV4cG9ydCk7XG4gICAgc3dpdGNoICh0aGlzLnNldHRpbmdzLmRhdGFDb21taXRGb3JtYXQpIHtcbiAgICAgIGNhc2UgJ2ZsYXR0ZW5lZCc6XG4gICAgICAgIHJldHVybiBVdGlsaXRpZXMuZmxhdHRlbihjbWlFeHBvcnQpO1xuICAgICAgY2FzZSAncGFyYW1zJzpcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIGluIGZsYXR0ZW5lZCkge1xuICAgICAgICAgIGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGZsYXR0ZW5lZCwgaXRlbSkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGAke2l0ZW19PSR7ZmxhdHRlbmVkW2l0ZW1dfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgY2FzZSAnanNvbic6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gY21pRXhwb3J0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0cyB0byBzdG9yZSB0aGUgZGF0YSB0byB0aGUgTE1TXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdGVybWluYXRlQ29tbWl0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHN0b3JlRGF0YSh0ZXJtaW5hdGVDb21taXQ6IGJvb2xlYW4pIHtcbiAgICBpZiAodGVybWluYXRlQ29tbWl0KSB7XG4gICAgICBjb25zdCBvcmlnaW5hbFN0YXR1cyA9IHRoaXMuY21pLmNvcmUubGVzc29uX3N0YXR1cztcbiAgICAgIGlmIChvcmlnaW5hbFN0YXR1cyA9PT0gJ25vdCBhdHRlbXB0ZWQnKSB7XG4gICAgICAgIHRoaXMuY21pLmNvcmUubGVzc29uX3N0YXR1cyA9ICdjb21wbGV0ZWQnO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jbWkuY29yZS5sZXNzb25fbW9kZSA9PT0gJ25vcm1hbCcpIHtcbiAgICAgICAgaWYgKHRoaXMuY21pLmNvcmUuY3JlZGl0ID09PSAnY3JlZGl0Jykge1xuICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLm1hc3Rlcnlfb3ZlcnJpZGUgJiZcbiAgICAgICAgICAgICAgdGhpcy5jbWkuc3R1ZGVudF9kYXRhLm1hc3Rlcnlfc2NvcmUgIT09ICcnICYmXG4gICAgICAgICAgICAgIHRoaXMuY21pLmNvcmUuc2NvcmUucmF3ICE9PSAnJykge1xuICAgICAgICAgICAgaWYgKHBhcnNlRmxvYXQodGhpcy5jbWkuY29yZS5zY29yZS5yYXcpID49IHBhcnNlRmxvYXQodGhpcy5jbWkuc3R1ZGVudF9kYXRhLm1hc3Rlcnlfc2NvcmUpKSB7XG4gICAgICAgICAgICAgIHRoaXMuY21pLmNvcmUubGVzc29uX3N0YXR1cyA9ICdwYXNzZWQnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5jbWkuY29yZS5sZXNzb25fc3RhdHVzID0gJ2ZhaWxlZCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY21pLmNvcmUubGVzc29uX21vZGUgPT09ICdicm93c2UnKSB7XG4gICAgICAgIGlmICgodGhpcy5zdGFydGluZ0RhdGE/LmNtaT8uY29yZT8ubGVzc29uX3N0YXR1cyB8fCAnJykgPT09ICcnICYmIG9yaWdpbmFsU3RhdHVzID09PSAnbm90IGF0dGVtcHRlZCcpIHtcbiAgICAgICAgICB0aGlzLmNtaS5jb3JlLmxlc3Nvbl9zdGF0dXMgPSAnYnJvd3NlZCc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBjb21taXRPYmplY3QgPSB0aGlzLnJlbmRlckNvbW1pdENNSSh0ZXJtaW5hdGVDb21taXQgfHxcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5hbHdheXNTZW5kVG90YWxUaW1lKTtcblxuICAgIGlmICh0aGlzLmFwaUxvZ0xldmVsID09PSBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9ERUJVRykge1xuICAgICAgY29uc29sZS5kZWJ1ZygnQ29tbWl0ICh0ZXJtaW5hdGVkOiAnICsgKHRlcm1pbmF0ZUNvbW1pdCA/ICd5ZXMnIDogJ25vJykgKyAnKTogJyk7XG4gICAgICBjb25zb2xlLmRlYnVnKGNvbW1pdE9iamVjdCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnNldHRpbmdzLmxtc0NvbW1pdFVybCkge1xuICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0h0dHBSZXF1ZXN0KHRoaXMuc2V0dGluZ3MubG1zQ29tbWl0VXJsLCBjb21taXRPYmplY3QsIHRlcm1pbmF0ZUNvbW1pdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUU7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBTY29ybTEyQ01JIGZyb20gJy4vc2Nvcm0xMl9jbWknO1xuaW1wb3J0IHtCYXNlQ01JLCBjaGVja1ZhbGlkRm9ybWF0LCBDTUlBcnJheSwgQ01JU2NvcmV9IGZyb20gJy4vY29tbW9uJztcbmltcG9ydCBBUElDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuaW1wb3J0IFJlZ2V4IGZyb20gJy4uL2NvbnN0YW50cy9yZWdleCc7XG5pbXBvcnQgRXJyb3JDb2RlcyBmcm9tICcuLi9jb25zdGFudHMvZXJyb3JfY29kZXMnO1xuaW1wb3J0IHtBSUNDVmFsaWRhdGlvbkVycm9yfSBmcm9tICcuLi9leGNlcHRpb25zJztcblxuY29uc3QgYWljY19jb25zdGFudHMgPSBBUElDb25zdGFudHMuYWljYztcbmNvbnN0IGFpY2NfcmVnZXggPSBSZWdleC5haWNjO1xuY29uc3QgYWljY19lcnJvcl9jb2RlcyA9IEVycm9yQ29kZXMuc2Nvcm0xMjtcblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIGZvciB0aHJvd2luZyBSZWFkIE9ubHkgZXJyb3JcbiAqL1xuZnVuY3Rpb24gdGhyb3dSZWFkT25seUVycm9yKCkge1xuICB0aHJvdyBuZXcgQUlDQ1ZhbGlkYXRpb25FcnJvcihhaWNjX2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5UKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kLCBubyByZWFzb24gdG8gaGF2ZSB0byBwYXNzIHRoZSBzYW1lIGVycm9yIGNvZGVzIGV2ZXJ5IHRpbWVcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWdleFBhdHRlcm5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWxsb3dFbXB0eVN0cmluZ1xuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gY2hlY2tBSUNDVmFsaWRGb3JtYXQoXG4gICAgdmFsdWU6IFN0cmluZyxcbiAgICByZWdleFBhdHRlcm46IFN0cmluZyxcbiAgICBhbGxvd0VtcHR5U3RyaW5nPzogYm9vbGVhbikge1xuICByZXR1cm4gY2hlY2tWYWxpZEZvcm1hdChcbiAgICAgIHZhbHVlLFxuICAgICAgcmVnZXhQYXR0ZXJuLFxuICAgICAgYWljY19lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENILFxuICAgICAgQUlDQ1ZhbGlkYXRpb25FcnJvcixcbiAgICAgIGFsbG93RW1wdHlTdHJpbmdcbiAgKTtcbn1cblxuLyoqXG4gKiBDTUkgQ2xhc3MgZm9yIEFJQ0NcbiAqL1xuZXhwb3J0IGNsYXNzIENNSSBleHRlbmRzIFNjb3JtMTJDTUkuQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIENNSSBvYmplY3RcbiAgICogQHBhcmFtIHtib29sZWFufSBpbml0aWFsaXplZFxuICAgKi9cbiAgY29uc3RydWN0b3IoaW5pdGlhbGl6ZWQ6IGJvb2xlYW4pIHtcbiAgICBzdXBlcihhaWNjX2NvbnN0YW50cy5jbWlfY2hpbGRyZW4pO1xuXG4gICAgaWYgKGluaXRpYWxpemVkKSB0aGlzLmluaXRpYWxpemUoKTtcblxuICAgIHRoaXMuc3R1ZGVudF9wcmVmZXJlbmNlID0gbmV3IEFJQ0NTdHVkZW50UHJlZmVyZW5jZXMoKTtcbiAgICB0aGlzLnN0dWRlbnRfZGF0YSA9IG5ldyBBSUNDQ01JU3R1ZGVudERhdGEoKTtcbiAgICB0aGlzLnN0dWRlbnRfZGVtb2dyYXBoaWNzID0gbmV3IENNSVN0dWRlbnREZW1vZ3JhcGhpY3MoKTtcbiAgICB0aGlzLmV2YWx1YXRpb24gPSBuZXcgQ01JRXZhbHVhdGlvbigpO1xuICAgIHRoaXMucGF0aHMgPSBuZXcgQ01JUGF0aHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zdHVkZW50X3ByZWZlcmVuY2U/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnN0dWRlbnRfZGF0YT8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc3R1ZGVudF9kZW1vZ3JhcGhpY3M/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmV2YWx1YXRpb24/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnBhdGhzPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWlcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBzdXNwZW5kX2RhdGE6IHN0cmluZyxcbiAgICogICAgICBsYXVuY2hfZGF0YTogc3RyaW5nLFxuICAgKiAgICAgIGNvbW1lbnRzOiBzdHJpbmcsXG4gICAqICAgICAgY29tbWVudHNfZnJvbV9sbXM6IHN0cmluZyxcbiAgICogICAgICBjb3JlOiBDTUlDb3JlLFxuICAgKiAgICAgIG9iamVjdGl2ZXM6IENNSU9iamVjdGl2ZXMsXG4gICAqICAgICAgc3R1ZGVudF9kYXRhOiBDTUlTdHVkZW50RGF0YSxcbiAgICogICAgICBzdHVkZW50X3ByZWZlcmVuY2U6IENNSVN0dWRlbnRQcmVmZXJlbmNlLFxuICAgKiAgICAgIGludGVyYWN0aW9uczogQ01JSW50ZXJhY3Rpb25zLFxuICAgKiAgICAgIHBhdGhzOiBDTUlQYXRoc1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnc3VzcGVuZF9kYXRhJzogdGhpcy5zdXNwZW5kX2RhdGEsXG4gICAgICAnbGF1bmNoX2RhdGEnOiB0aGlzLmxhdW5jaF9kYXRhLFxuICAgICAgJ2NvbW1lbnRzJzogdGhpcy5jb21tZW50cyxcbiAgICAgICdjb21tZW50c19mcm9tX2xtcyc6IHRoaXMuY29tbWVudHNfZnJvbV9sbXMsXG4gICAgICAnY29yZSc6IHRoaXMuY29yZSxcbiAgICAgICdvYmplY3RpdmVzJzogdGhpcy5vYmplY3RpdmVzLFxuICAgICAgJ3N0dWRlbnRfZGF0YSc6IHRoaXMuc3R1ZGVudF9kYXRhLFxuICAgICAgJ3N0dWRlbnRfcHJlZmVyZW5jZSc6IHRoaXMuc3R1ZGVudF9wcmVmZXJlbmNlLFxuICAgICAgJ3N0dWRlbnRfZGVtb2dyYXBoaWNzJzogdGhpcy5zdHVkZW50X2RlbW9ncmFwaGljcyxcbiAgICAgICdpbnRlcmFjdGlvbnMnOiB0aGlzLmludGVyYWN0aW9ucyxcbiAgICAgICdldmFsdWF0aW9uJzogdGhpcy5ldmFsdWF0aW9uLFxuICAgICAgJ3BhdGhzJzogdGhpcy5wYXRocyxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIEFJQ0MgRXZhbHVhdGlvbiBvYmplY3RcbiAqL1xuY2xhc3MgQ01JRXZhbHVhdGlvbiBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEFJQ0MgRXZhbHVhdGlvbiBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmNvbW1lbnRzID0gbmV3IENNSUV2YWx1YXRpb25Db21tZW50cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmNvbW1lbnRzPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuZXZhbHVhdGlvbiBvYmplY3RcbiAgICogQHJldHVybiB7e2NvbW1lbnRzOiBDTUlFdmFsdWF0aW9uQ29tbWVudHN9fVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2NvbW1lbnRzJzogdGhpcy5jb21tZW50cyxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBBSUNDJ3MgY21pLmV2YWx1YXRpb24uY29tbWVudHMgb2JqZWN0XG4gKi9cbmNsYXNzIENNSUV2YWx1YXRpb25Db21tZW50cyBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIEV2YWx1YXRpb24gQ29tbWVudHMgb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogYWljY19jb25zdGFudHMuY29tbWVudHNfY2hpbGRyZW4sXG4gICAgICBlcnJvckNvZGU6IGFpY2NfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUsXG4gICAgICBlcnJvckNsYXNzOiBBSUNDVmFsaWRhdGlvbkVycm9yLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogU3R1ZGVudFByZWZlcmVuY2VzIGNsYXNzIGZvciBBSUNDXG4gKi9cbmNsYXNzIEFJQ0NTdHVkZW50UHJlZmVyZW5jZXMgZXh0ZW5kcyBTY29ybTEyQ01JLkNNSVN0dWRlbnRQcmVmZXJlbmNlIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIFN0dWRlbnQgUHJlZmVyZW5jZXMgb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihhaWNjX2NvbnN0YW50cy5zdHVkZW50X3ByZWZlcmVuY2VfY2hpbGRyZW4pO1xuXG4gICAgdGhpcy53aW5kb3dzID0gbmV3IENNSUFycmF5KHtcbiAgICAgIGVycm9yQ29kZTogYWljY19lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgIGVycm9yQ2xhc3M6IEFJQ0NWYWxpZGF0aW9uRXJyb3IsXG4gICAgICBjaGlsZHJlbjogJycsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMud2luZG93cz8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgI2xlc3Nvbl90eXBlID0gJyc7XG4gICN0ZXh0X2NvbG9yID0gJyc7XG4gICN0ZXh0X2xvY2F0aW9uID0gJyc7XG4gICN0ZXh0X3NpemUgPSAnJztcbiAgI3ZpZGVvID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xlc3Nvbl90eXBlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsZXNzb25fdHlwZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLiNsZXNzb25fdHlwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsZXNzb25fdHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGVzc29uX3R5cGVcbiAgICovXG4gIHNldCBsZXNzb25fdHlwZShsZXNzb25fdHlwZTogc3RyaW5nKSB7XG4gICAgaWYgKGNoZWNrQUlDQ1ZhbGlkRm9ybWF0KGxlc3Nvbl90eXBlLCBhaWNjX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI2xlc3Nvbl90eXBlID0gbGVzc29uX3R5cGU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RleHRfY29sb3JcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRleHRfY29sb3IoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy4jdGV4dF9jb2xvcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0ZXh0X2NvbG9yXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0X2NvbG9yXG4gICAqL1xuICBzZXQgdGV4dF9jb2xvcih0ZXh0X2NvbG9yOiBzdHJpbmcpIHtcbiAgICBpZiAoY2hlY2tBSUNDVmFsaWRGb3JtYXQodGV4dF9jb2xvciwgYWljY19yZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiN0ZXh0X2NvbG9yID0gdGV4dF9jb2xvcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGV4dF9sb2NhdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGV4dF9sb2NhdGlvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLiN0ZXh0X2xvY2F0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RleHRfbG9jYXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHRfbG9jYXRpb25cbiAgICovXG4gIHNldCB0ZXh0X2xvY2F0aW9uKHRleHRfbG9jYXRpb246IHN0cmluZykge1xuICAgIGlmIChjaGVja0FJQ0NWYWxpZEZvcm1hdCh0ZXh0X2xvY2F0aW9uLCBhaWNjX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI3RleHRfbG9jYXRpb24gPSB0ZXh0X2xvY2F0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0ZXh0X3NpemVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRleHRfc2l6ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLiN0ZXh0X3NpemU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGV4dF9zaXplXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0X3NpemVcbiAgICovXG4gIHNldCB0ZXh0X3NpemUodGV4dF9zaXplOiBzdHJpbmcpIHtcbiAgICBpZiAoY2hlY2tBSUNDVmFsaWRGb3JtYXQodGV4dF9zaXplLCBhaWNjX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI3RleHRfc2l6ZSA9IHRleHRfc2l6ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdmlkZW9cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHZpZGVvKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuI3ZpZGVvO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3ZpZGVvXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB2aWRlb1xuICAgKi9cbiAgc2V0IHZpZGVvKHZpZGVvOiBzdHJpbmcpIHtcbiAgICBpZiAoY2hlY2tBSUNDVmFsaWRGb3JtYXQodmlkZW8sIGFpY2NfcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jdmlkZW8gPSB2aWRlbztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuc3R1ZGVudF9wcmVmZXJlbmNlXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgYXVkaW86IHN0cmluZyxcbiAgICogICAgICBsYW5ndWFnZTogc3RyaW5nLFxuICAgKiAgICAgIHNwZWVkOiBzdHJpbmcsXG4gICAqICAgICAgdGV4dDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdhdWRpbyc6IHRoaXMuYXVkaW8sXG4gICAgICAnbGFuZ3VhZ2UnOiB0aGlzLmxhbmd1YWdlLFxuICAgICAgJ2xlc3Nvbl90eXBlJzogdGhpcy5sZXNzb25fdHlwZSxcbiAgICAgICdzcGVlZCc6IHRoaXMuc3BlZWQsXG4gICAgICAndGV4dCc6IHRoaXMudGV4dCxcbiAgICAgICd0ZXh0X2NvbG9yJzogdGhpcy50ZXh0X2NvbG9yLFxuICAgICAgJ3RleHRfbG9jYXRpb24nOiB0aGlzLnRleHRfbG9jYXRpb24sXG4gICAgICAndGV4dF9zaXplJzogdGhpcy50ZXh0X3NpemUsXG4gICAgICAndmlkZW8nOiB0aGlzLnZpZGVvLFxuICAgICAgJ3dpbmRvd3MnOiB0aGlzLndpbmRvd3MsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBTdHVkZW50RGF0YSBjbGFzcyBmb3IgQUlDQ1xuICovXG5jbGFzcyBBSUNDQ01JU3R1ZGVudERhdGEgZXh0ZW5kcyBTY29ybTEyQ01JLkNNSVN0dWRlbnREYXRhIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIFN0dWRlbnREYXRhIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoYWljY19jb25zdGFudHMuc3R1ZGVudF9kYXRhX2NoaWxkcmVuKTtcblxuICAgIHRoaXMudHJpZXMgPSBuZXcgQ01JVHJpZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy50cmllcz8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgI3RyaWVzX2R1cmluZ19sZXNzb24gPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciB0cmllc19kdXJpbmdfbGVzc29uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0cmllc19kdXJpbmdfbGVzc29uKCkge1xuICAgIHJldHVybiB0aGlzLiN0cmllc19kdXJpbmdfbGVzc29uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RyaWVzX2R1cmluZ19sZXNzb24uIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0cmllc19kdXJpbmdfbGVzc29uXG4gICAqL1xuICBzZXQgdHJpZXNfZHVyaW5nX2xlc3Nvbih0cmllc19kdXJpbmdfbGVzc29uKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiN0cmllc19kdXJpbmdfbGVzc29uID0gdHJpZXNfZHVyaW5nX2xlc3NvbiA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLnN0dWRlbnRfZGF0YSBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBtYXN0ZXJ5X3Njb3JlOiBzdHJpbmcsXG4gICAqICAgICAgbWF4X3RpbWVfYWxsb3dlZDogc3RyaW5nLFxuICAgKiAgICAgIHRpbWVfbGltaXRfYWN0aW9uOiBzdHJpbmcsXG4gICAqICAgICAgdHJpZXM6IENNSVRyaWVzXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdtYXN0ZXJ5X3Njb3JlJzogdGhpcy5tYXN0ZXJ5X3Njb3JlLFxuICAgICAgJ21heF90aW1lX2FsbG93ZWQnOiB0aGlzLm1heF90aW1lX2FsbG93ZWQsXG4gICAgICAndGltZV9saW1pdF9hY3Rpb24nOiB0aGlzLnRpbWVfbGltaXRfYWN0aW9uLFxuICAgICAgJ3RyaWVzJzogdGhpcy50cmllcyxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyB0aGUgQUlDQyBjbWkuc3R1ZGVudF9kZW1vZ3JhcGhpY3Mgb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlTdHVkZW50RGVtb2dyYXBoaWNzIGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBTdHVkZW50RGVtb2dyYXBoaWNzIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gICNfY2hpbGRyZW4gPSBhaWNjX2NvbnN0YW50cy5zdHVkZW50X2RlbW9ncmFwaGljc19jaGlsZHJlbjtcbiAgI2NpdHkgPSAnJztcbiAgI2NsYXNzID0gJyc7XG4gICNjb21wYW55ID0gJyc7XG4gICNjb3VudHJ5ID0gJyc7XG4gICNleHBlcmllbmNlID0gJyc7XG4gICNmYW1pbGlhcl9uYW1lID0gJyc7XG4gICNpbnN0cnVjdG9yX25hbWUgPSAnJztcbiAgI3RpdGxlID0gJyc7XG4gICNuYXRpdmVfbGFuZ3VhZ2UgPSAnJztcbiAgI3N0YXRlID0gJyc7XG4gICNzdHJlZXRfYWRkcmVzcyA9ICcnO1xuICAjdGVsZXBob25lID0gJyc7XG4gICN5ZWFyc19leHBlcmllbmNlID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgX2NoaWxkcmVuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIGNpdHlcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NpdHk7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY2l0eS4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNpdHlcbiAgICovXG4gIHNldCBjaXR5KGNpdHkpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2NpdHkgPSBjaXR5IDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBjbGFzc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY2xhc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NsYXNzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NsYXNzLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhenpcbiAgICovXG4gIHNldCBjbGFzcyhjbGF6eikge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jY2xhc3MgPSBjbGF6eiA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgY29tcGFueVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29tcGFueSgpIHtcbiAgICByZXR1cm4gdGhpcy4jY29tcGFueTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb21wYW55LiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29tcGFueVxuICAgKi9cbiAgc2V0IGNvbXBhbnkoY29tcGFueSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jY29tcGFueSA9IGNvbXBhbnkgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIGNvdW50cnlcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvdW50cnkoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvdW50cnk7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY291bnRyeS4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvdW50cnlcbiAgICovXG4gIHNldCBjb3VudHJ5KGNvdW50cnkpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2NvdW50cnkgPSBjb3VudHJ5IDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBleHBlcmllbmNlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBleHBlcmllbmNlKCkge1xuICAgIHJldHVybiB0aGlzLiNleHBlcmllbmNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2V4cGVyaWVuY2UuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBleHBlcmllbmNlXG4gICAqL1xuICBzZXQgZXhwZXJpZW5jZShleHBlcmllbmNlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNleHBlcmllbmNlID0gZXhwZXJpZW5jZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgZmFtaWxpYXJfbmFtZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZmFtaWxpYXJfbmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jZmFtaWxpYXJfbmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNmYW1pbGlhcl9uYW1lLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZmFtaWxpYXJfbmFtZVxuICAgKi9cbiAgc2V0IGZhbWlsaWFyX25hbWUoZmFtaWxpYXJfbmFtZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jZmFtaWxpYXJfbmFtZSA9IGZhbWlsaWFyX25hbWUgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIGluc3RydWN0b3JfbmFtZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgaW5zdHJ1Y3Rvcl9uYW1lKCkge1xuICAgIHJldHVybiB0aGlzLiNpbnN0cnVjdG9yX25hbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjaW5zdHJ1Y3Rvcl9uYW1lLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gaW5zdHJ1Y3Rvcl9uYW1lXG4gICAqL1xuICBzZXQgaW5zdHJ1Y3Rvcl9uYW1lKGluc3RydWN0b3JfbmFtZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jaW5zdHJ1Y3Rvcl9uYW1lID0gaW5zdHJ1Y3Rvcl9uYW1lIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciB0aXRsZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGl0bGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpdGxlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpdGxlLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGl0bGVcbiAgICovXG4gIHNldCB0aXRsZSh0aXRsZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jdGl0bGUgPSB0aXRsZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgbmF0aXZlX2xhbmd1YWdlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBuYXRpdmVfbGFuZ3VhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuI25hdGl2ZV9sYW5ndWFnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNuYXRpdmVfbGFuZ3VhZ2UuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYXRpdmVfbGFuZ3VhZ2VcbiAgICovXG4gIHNldCBuYXRpdmVfbGFuZ3VhZ2UobmF0aXZlX2xhbmd1YWdlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNuYXRpdmVfbGFuZ3VhZ2UgPSBuYXRpdmVfbGFuZ3VhZ2UgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIHN0YXRlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdGF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jc3RhdGU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3RhdGUuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0ZVxuICAgKi9cbiAgc2V0IHN0YXRlKHN0YXRlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNzdGF0ZSA9IHN0YXRlIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBzdHJlZXRfYWRkcmVzc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3RyZWV0X2FkZHJlc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0cmVldF9hZGRyZXNzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N0cmVldF9hZGRyZXNzLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyZWV0X2FkZHJlc3NcbiAgICovXG4gIHNldCBzdHJlZXRfYWRkcmVzcyhzdHJlZXRfYWRkcmVzcykge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jc3RyZWV0X2FkZHJlc3MgPSBzdHJlZXRfYWRkcmVzcyA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgdGVsZXBob25lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0ZWxlcGhvbmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RlbGVwaG9uZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0ZWxlcGhvbmUuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZWxlcGhvbmVcbiAgICovXG4gIHNldCB0ZWxlcGhvbmUodGVsZXBob25lKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiN0ZWxlcGhvbmUgPSB0ZWxlcGhvbmUgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIHllYXJzX2V4cGVyaWVuY2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHllYXJzX2V4cGVyaWVuY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3llYXJzX2V4cGVyaWVuY2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjeWVhcnNfZXhwZXJpZW5jZS4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHllYXJzX2V4cGVyaWVuY2VcbiAgICovXG4gIHNldCB5ZWFyc19leHBlcmllbmNlKHllYXJzX2V4cGVyaWVuY2UpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI3llYXJzX2V4cGVyaWVuY2UgPSB5ZWFyc19leHBlcmllbmNlIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuc3R1ZGVudF9kZW1vZ3JhcGhpY3Mgb2JqZWN0XG4gICAqIEByZXR1cm4ge1xuICAgKiAgICAgIHtcbiAgICogICAgICAgIGNpdHk6IHN0cmluZyxcbiAgICogICAgICAgIGNsYXNzOiBzdHJpbmcsXG4gICAqICAgICAgICBjb21wYW55OiBzdHJpbmcsXG4gICAqICAgICAgICBjb3VudHJ5OiBzdHJpbmcsXG4gICAqICAgICAgICBleHBlcmllbmNlOiBzdHJpbmcsXG4gICAqICAgICAgICBmYW1pbGlhcl9uYW1lOiBzdHJpbmcsXG4gICAqICAgICAgICBpbnN0cnVjdG9yX25hbWU6IHN0cmluZyxcbiAgICogICAgICAgIHRpdGxlOiBzdHJpbmcsXG4gICAqICAgICAgICBuYXRpdmVfbGFuZ3VhZ2U6IHN0cmluZyxcbiAgICogICAgICAgIHN0YXRlOiBzdHJpbmcsXG4gICAqICAgICAgICBzdHJlZXRfYWRkcmVzczogc3RyaW5nLFxuICAgKiAgICAgICAgdGVsZXBob25lOiBzdHJpbmcsXG4gICAqICAgICAgICB5ZWFyc19leHBlcmllbmNlOiBzdHJpbmdcbiAgICogICAgICB9XG4gICAqICAgIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdjaXR5JzogdGhpcy5jaXR5LFxuICAgICAgJ2NsYXNzJzogdGhpcy5jbGFzcyxcbiAgICAgICdjb21wYW55JzogdGhpcy5jb21wYW55LFxuICAgICAgJ2NvdW50cnknOiB0aGlzLmNvdW50cnksXG4gICAgICAnZXhwZXJpZW5jZSc6IHRoaXMuZXhwZXJpZW5jZSxcbiAgICAgICdmYW1pbGlhcl9uYW1lJzogdGhpcy5mYW1pbGlhcl9uYW1lLFxuICAgICAgJ2luc3RydWN0b3JfbmFtZSc6IHRoaXMuaW5zdHJ1Y3Rvcl9uYW1lLFxuICAgICAgJ3RpdGxlJzogdGhpcy50aXRsZSxcbiAgICAgICduYXRpdmVfbGFuZ3VhZ2UnOiB0aGlzLm5hdGl2ZV9sYW5ndWFnZSxcbiAgICAgICdzdGF0ZSc6IHRoaXMuc3RhdGUsXG4gICAgICAnc3RyZWV0X2FkZHJlc3MnOiB0aGlzLnN0cmVldF9hZGRyZXNzLFxuICAgICAgJ3RlbGVwaG9uZSc6IHRoaXMudGVsZXBob25lLFxuICAgICAgJ3llYXJzX2V4cGVyaWVuY2UnOiB0aGlzLnllYXJzX2V4cGVyaWVuY2UsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgdGhlIEFJQ0MgY21pLnBhdGhzIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JUGF0aHMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgaW5saW5lIFBhdGhzIEFycmF5IGNsYXNzXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7Y2hpbGRyZW46IGFpY2NfY29uc3RhbnRzLnBhdGhzX2NoaWxkcmVufSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgQUlDQyBQYXRoc1xuICovXG5leHBvcnQgY2xhc3MgQ01JUGF0aHNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIFBhdGhzIG9iamVjdHNcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAjbG9jYXRpb25faWQgPSAnJztcbiAgI2RhdGUgPSAnJztcbiAgI3RpbWUgPSAnJztcbiAgI3N0YXR1cyA9ICcnO1xuICAjd2h5X2xlZnQgPSAnJztcbiAgI3RpbWVfaW5fZWxlbWVudCA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsb2NhdGlvbl9pZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbG9jYXRpb25faWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xvY2F0aW9uX2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xvY2F0aW9uX2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvbl9pZFxuICAgKi9cbiAgc2V0IGxvY2F0aW9uX2lkKGxvY2F0aW9uX2lkKSB7XG4gICAgaWYgKGNoZWNrQUlDQ1ZhbGlkRm9ybWF0KGxvY2F0aW9uX2lkLCBhaWNjX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI2xvY2F0aW9uX2lkID0gbG9jYXRpb25faWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2RhdGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2RhdGU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZGF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGF0ZVxuICAgKi9cbiAgc2V0IGRhdGUoZGF0ZSkge1xuICAgIGlmIChjaGVja0FJQ0NWYWxpZEZvcm1hdChkYXRlLCBhaWNjX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI2RhdGUgPSBkYXRlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0aW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lKCkge1xuICAgIHJldHVybiB0aGlzLiN0aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVcbiAgICovXG4gIHNldCB0aW1lKHRpbWUpIHtcbiAgICBpZiAoY2hlY2tBSUNDVmFsaWRGb3JtYXQodGltZSwgYWljY19yZWdleC5DTUlUaW1lKSkge1xuICAgICAgdGhpcy4jdGltZSA9IHRpbWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNzdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0dXNcbiAgICovXG4gIHNldCBzdGF0dXMoc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrQUlDQ1ZhbGlkRm9ybWF0KHN0YXR1cywgYWljY19yZWdleC5DTUlTdGF0dXMyKSkge1xuICAgICAgdGhpcy4jc3RhdHVzID0gc3RhdHVzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN3aHlfbGVmdFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgd2h5X2xlZnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3doeV9sZWZ0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3doeV9sZWZ0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3aHlfbGVmdFxuICAgKi9cbiAgc2V0IHdoeV9sZWZ0KHdoeV9sZWZ0KSB7XG4gICAgaWYgKGNoZWNrQUlDQ1ZhbGlkRm9ybWF0KHdoeV9sZWZ0LCBhaWNjX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI3doeV9sZWZ0ID0gd2h5X2xlZnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWVfaW5fZWxlbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGltZV9pbl9lbGVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLiN0aW1lX2luX2VsZW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGltZV9pbl9lbGVtZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lX2luX2VsZW1lbnRcbiAgICovXG4gIHNldCB0aW1lX2luX2VsZW1lbnQodGltZV9pbl9lbGVtZW50KSB7XG4gICAgaWYgKGNoZWNrQUlDQ1ZhbGlkRm9ybWF0KHRpbWVfaW5fZWxlbWVudCwgYWljY19yZWdleC5DTUlUaW1lKSkge1xuICAgICAgdGhpcy4jdGltZV9pbl9lbGVtZW50ID0gdGltZV9pbl9lbGVtZW50O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5wYXRocy5uIG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGxvY2F0aW9uX2lkOiBzdHJpbmcsXG4gICAqICAgICAgZGF0ZTogc3RyaW5nLFxuICAgKiAgICAgIHRpbWU6IHN0cmluZyxcbiAgICogICAgICBzdGF0dXM6IHN0cmluZyxcbiAgICogICAgICB3aHlfbGVmdDogc3RyaW5nLFxuICAgKiAgICAgIHRpbWVfaW5fZWxlbWVudDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdsb2NhdGlvbl9pZCc6IHRoaXMubG9jYXRpb25faWQsXG4gICAgICAnZGF0ZSc6IHRoaXMuZGF0ZSxcbiAgICAgICd0aW1lJzogdGhpcy50aW1lLFxuICAgICAgJ3N0YXR1cyc6IHRoaXMuc3RhdHVzLFxuICAgICAgJ3doeV9sZWZ0JzogdGhpcy53aHlfbGVmdCxcbiAgICAgICd0aW1lX2luX2VsZW1lbnQnOiB0aGlzLnRpbWVfaW5fZWxlbWVudCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyB0aGUgQUlDQyBjbWkuc3R1ZGVudF9kYXRhLnRyaWVzIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JVHJpZXMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgaW5saW5lIFRyaWVzIEFycmF5IGNsYXNzXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7Y2hpbGRyZW46IGFpY2NfY29uc3RhbnRzLnRyaWVzX2NoaWxkcmVufSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgQUlDQyBUcmllc1xuICovXG5leHBvcnQgY2xhc3MgQ01JVHJpZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIFRyaWVzIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc2NvcmUgPSBuZXcgQ01JU2NvcmUoXG4gICAgICAgIHtcbiAgICAgICAgICBzY29yZV9jaGlsZHJlbjogYWljY19jb25zdGFudHMuc2NvcmVfY2hpbGRyZW4sXG4gICAgICAgICAgc2NvcmVfcmFuZ2U6IGFpY2NfcmVnZXguc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgaW52YWxpZEVycm9yQ29kZTogYWljY19lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgICAgICBpbnZhbGlkVHlwZUNvZGU6IGFpY2NfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCxcbiAgICAgICAgICBpbnZhbGlkUmFuZ2VDb2RlOiBhaWNjX2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRSxcbiAgICAgICAgICBlcnJvckNsYXNzOiBBSUNDVmFsaWRhdGlvbkVycm9yLFxuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zY29yZT8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgI3N0YXR1cyA9ICcnO1xuICAjdGltZSA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdGF0dXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N0YXR1c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RhdHVzXG4gICAqL1xuICBzZXQgc3RhdHVzKHN0YXR1cykge1xuICAgIGlmIChjaGVja0FJQ0NWYWxpZEZvcm1hdChzdGF0dXMsIGFpY2NfcmVnZXguQ01JU3RhdHVzMikpIHtcbiAgICAgIHRoaXMuI3N0YXR1cyA9IHN0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lXG4gICAqL1xuICBzZXQgdGltZSh0aW1lKSB7XG4gICAgaWYgKGNoZWNrQUlDQ1ZhbGlkRm9ybWF0KHRpbWUsIGFpY2NfcmVnZXguQ01JVGltZSkpIHtcbiAgICAgIHRoaXMuI3RpbWUgPSB0aW1lO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5zdHVkZW50X2RhdGEudHJpZXMubiBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBzdGF0dXM6IHN0cmluZyxcbiAgICogICAgICB0aW1lOiBzdHJpbmcsXG4gICAqICAgICAgc2NvcmU6IENNSVNjb3JlXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdzdGF0dXMnOiB0aGlzLnN0YXR1cyxcbiAgICAgICd0aW1lJzogdGhpcy50aW1lLFxuICAgICAgJ3Njb3JlJzogdGhpcy5zY29yZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBjbWkuc3R1ZGVudF9kYXRhLmF0dGVtcHRfcmVjb3JkcyBhcnJheVxuICovXG5leHBvcnQgY2xhc3MgQ01JQXR0ZW1wdFJlY29yZHMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgaW5saW5lIFRyaWVzIEFycmF5IGNsYXNzXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7Y2hpbGRyZW46IGFpY2NfY29uc3RhbnRzLmF0dGVtcHRfcmVjb3Jkc19jaGlsZHJlbn0pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIEFJQ0MgQXR0ZW1wdCBSZWNvcmRzXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlBdHRlbXB0UmVjb3Jkc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEFJQ0MgQXR0ZW1wdCBSZWNvcmRzIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc2NvcmUgPSBuZXcgQ01JU2NvcmUoXG4gICAgICAgIHtcbiAgICAgICAgICBzY29yZV9jaGlsZHJlbjogYWljY19jb25zdGFudHMuc2NvcmVfY2hpbGRyZW4sXG4gICAgICAgICAgc2NvcmVfcmFuZ2U6IGFpY2NfcmVnZXguc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgaW52YWxpZEVycm9yQ29kZTogYWljY19lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgICAgICBpbnZhbGlkVHlwZUNvZGU6IGFpY2NfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCxcbiAgICAgICAgICBpbnZhbGlkUmFuZ2VDb2RlOiBhaWNjX2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRSxcbiAgICAgICAgICBlcnJvckNsYXNzOiBBSUNDVmFsaWRhdGlvbkVycm9yLFxuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zY29yZT8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgI2xlc3Nvbl9zdGF0dXMgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGVzc29uX3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVzc29uX3N0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jbGVzc29uX3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsZXNzb25fc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZXNzb25fc3RhdHVzXG4gICAqL1xuICBzZXQgbGVzc29uX3N0YXR1cyhsZXNzb25fc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrQUlDQ1ZhbGlkRm9ybWF0KGxlc3Nvbl9zdGF0dXMsIGFpY2NfcmVnZXguQ01JU3RhdHVzMikpIHtcbiAgICAgIHRoaXMuI2xlc3Nvbl9zdGF0dXMgPSBsZXNzb25fc3RhdHVzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5zdHVkZW50X2RhdGEuYXR0ZW1wdF9yZWNvcmRzLm4gb2JqZWN0XG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgdGltZTogc3RyaW5nLFxuICAgKiAgICAgIHNjb3JlOiBDTUlTY29yZVxuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnbGVzc29uX3N0YXR1cyc6IHRoaXMubGVzc29uX3N0YXR1cyxcbiAgICAgICdzY29yZSc6IHRoaXMuc2NvcmUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgQUlDQyBFdmFsdWF0aW9uIENvbW1lbnRzXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlFdmFsdWF0aW9uQ29tbWVudHNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBFdmFsdWF0aW9uIENvbW1lbnRzXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgI2NvbnRlbnQgPSAnJztcbiAgI2xvY2F0aW9uID0gJyc7XG4gICN0aW1lID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NvbnRlbnRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbnRlbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29udGVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29udGVudFxuICAgKi9cbiAgc2V0IGNvbnRlbnQoY29udGVudCkge1xuICAgIGlmIChjaGVja0FJQ0NWYWxpZEZvcm1hdChjb250ZW50LCBhaWNjX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI2NvbnRlbnQgPSBjb250ZW50O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsb2NhdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xvY2F0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xvY2F0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvblxuICAgKi9cbiAgc2V0IGxvY2F0aW9uKGxvY2F0aW9uKSB7XG4gICAgaWYgKGNoZWNrQUlDQ1ZhbGlkRm9ybWF0KGxvY2F0aW9uLCBhaWNjX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI2xvY2F0aW9uID0gbG9jYXRpb247XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGluZyBmb3IgI3RpbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVcbiAgICovXG4gIHNldCB0aW1lKHRpbWUpIHtcbiAgICBpZiAoY2hlY2tBSUNDVmFsaWRGb3JtYXQodGltZSwgYWljY19yZWdleC5DTUlUaW1lKSkge1xuICAgICAgdGhpcy4jdGltZSA9IHRpbWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmV2YXVsYXRpb24uY29tbWVudHMubiBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBjb250ZW50OiBzdHJpbmcsXG4gICAqICAgICAgbG9jYXRpb246IHN0cmluZyxcbiAgICogICAgICB0aW1lOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2NvbnRlbnQnOiB0aGlzLmNvbnRlbnQsXG4gICAgICAnbG9jYXRpb24nOiB0aGlzLmxvY2F0aW9uLFxuICAgICAgJ3RpbWUnOiB0aGlzLnRpbWUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiIsIi8vIEBmbG93XG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCBFcnJvckNvZGVzIGZyb20gJy4uL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQgUmVnZXggZnJvbSAnLi4vY29uc3RhbnRzL3JlZ2V4JztcblxuY29uc3Qgc2Nvcm0xMl9jb25zdGFudHMgPSBBUElDb25zdGFudHMuc2Nvcm0xMjtcbmNvbnN0IHNjb3JtMTJfcmVnZXggPSBSZWdleC5zY29ybTEyO1xuY29uc3Qgc2Nvcm0xMl9lcnJvcl9jb2RlcyA9IEVycm9yQ29kZXMuc2Nvcm0xMjtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgdmFsdWUgbWF0Y2hlcyB0aGUgcHJvcGVyIGZvcm1hdC4gSWYgbm90LCB0aHJvdyBwcm9wZXIgZXJyb3IgY29kZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWdleFBhdHRlcm5cbiAqIEBwYXJhbSB7bnVtYmVyfSBlcnJvckNvZGVcbiAqIEBwYXJhbSB7Y2xhc3N9IGVycm9yQ2xhc3NcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWxsb3dFbXB0eVN0cmluZ1xuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrVmFsaWRGb3JtYXQoXG4gICAgdmFsdWU6IFN0cmluZyxcbiAgICByZWdleFBhdHRlcm46IFN0cmluZyxcbiAgICBlcnJvckNvZGU6IG51bWJlcixcbiAgICBlcnJvckNsYXNzOiBmdW5jdGlvbixcbiAgICBhbGxvd0VtcHR5U3RyaW5nPzogYm9vbGVhbikge1xuICBjb25zdCBmb3JtYXRSZWdleCA9IG5ldyBSZWdFeHAocmVnZXhQYXR0ZXJuKTtcbiAgY29uc3QgbWF0Y2hlcyA9IHZhbHVlLm1hdGNoKGZvcm1hdFJlZ2V4KTtcbiAgaWYgKGFsbG93RW1wdHlTdHJpbmcgJiYgdmFsdWUgPT09ICcnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgIW1hdGNoZXMgfHwgbWF0Y2hlc1swXSA9PT0gJycpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IoZXJyb3JDb2RlKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgdmFsdWUgbWF0Y2hlcyB0aGUgcHJvcGVyIHJhbmdlLiBJZiBub3QsIHRocm93IHByb3BlciBlcnJvciBjb2RlLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSByYW5nZVBhdHRlcm5cbiAqIEBwYXJhbSB7bnVtYmVyfSBlcnJvckNvZGVcbiAqIEBwYXJhbSB7Y2xhc3N9IGVycm9yQ2xhc3NcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1ZhbGlkUmFuZ2UoXG4gICAgdmFsdWU6IGFueSxcbiAgICByYW5nZVBhdHRlcm46IFN0cmluZyxcbiAgICBlcnJvckNvZGU6IG51bWJlcixcbiAgICBlcnJvckNsYXNzOiBmdW5jdGlvbikge1xuICBjb25zdCByYW5nZXMgPSByYW5nZVBhdHRlcm4uc3BsaXQoJyMnKTtcbiAgdmFsdWUgPSB2YWx1ZSAqIDEuMDtcbiAgaWYgKHZhbHVlID49IHJhbmdlc1swXSkge1xuICAgIGlmICgocmFuZ2VzWzFdID09PSAnKicpIHx8ICh2YWx1ZSA8PSByYW5nZXNbMV0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IGVycm9yQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yKGVycm9yQ29kZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBlcnJvckNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvcihlcnJvckNvZGUpO1xuICB9XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgQVBJIGNtaSBvYmplY3RzXG4gKi9cbmV4cG9ydCBjbGFzcyBCYXNlQ01JIHtcbiAganNvblN0cmluZyA9IGZhbHNlO1xuICAjaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgI3N0YXJ0X3RpbWU7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBCYXNlQ01JLCBqdXN0IG1hcmtzIHRoZSBjbGFzcyBhcyBhYnN0cmFjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKG5ldy50YXJnZXQgPT09IEJhc2VDTUkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb25zdHJ1Y3QgQmFzZUNNSSBpbnN0YW5jZXMgZGlyZWN0bHknKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaW5pdGlhbGl6ZWRcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGdldCBpbml0aWFsaXplZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jaW5pdGlhbGl6ZWQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3RhcnRfdGltZVxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgc3RhcnRfdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jc3RhcnRfdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLiNpbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHBsYXllciBzaG91bGQgb3ZlcnJpZGUgdGhlICdzZXNzaW9uX3RpbWUnIHByb3ZpZGVkIGJ5XG4gICAqIHRoZSBtb2R1bGVcbiAgICovXG4gIHNldFN0YXJ0VGltZSgpIHtcbiAgICB0aGlzLiNzdGFydF90aW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBjbWkgKi5zY29yZSBvYmplY3RzXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlTY29yZSBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yICouc2NvcmVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjb3JlX2NoaWxkcmVuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY29yZV9yYW5nZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWF4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbnZhbGlkRXJyb3JDb2RlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbnZhbGlkVHlwZUNvZGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IGludmFsaWRSYW5nZUNvZGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlY2ltYWxSZWdleFxuICAgKiBAcGFyYW0ge2NsYXNzfSBlcnJvckNsYXNzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHtcbiAgICAgICAgc2NvcmVfY2hpbGRyZW4sXG4gICAgICAgIHNjb3JlX3JhbmdlLFxuICAgICAgICBtYXgsXG4gICAgICAgIGludmFsaWRFcnJvckNvZGUsXG4gICAgICAgIGludmFsaWRUeXBlQ29kZSxcbiAgICAgICAgaW52YWxpZFJhbmdlQ29kZSxcbiAgICAgICAgZGVjaW1hbFJlZ2V4LFxuICAgICAgICBlcnJvckNsYXNzLFxuICAgICAgfSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLiNfY2hpbGRyZW4gPSBzY29yZV9jaGlsZHJlbiB8fFxuICAgICAgICBzY29ybTEyX2NvbnN0YW50cy5zY29yZV9jaGlsZHJlbjtcbiAgICB0aGlzLiNfc2NvcmVfcmFuZ2UgPSAhc2NvcmVfcmFuZ2UgPyBmYWxzZSA6IHNjb3JtMTJfcmVnZXguc2NvcmVfcmFuZ2U7XG4gICAgdGhpcy4jbWF4ID0gKG1heCB8fCBtYXggPT09ICcnKSA/IG1heCA6ICcxMDAnO1xuICAgIHRoaXMuI19pbnZhbGlkX2Vycm9yX2NvZGUgPSBpbnZhbGlkRXJyb3JDb2RlIHx8XG4gICAgICAgIHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUU7XG4gICAgdGhpcy4jX2ludmFsaWRfdHlwZV9jb2RlID0gaW52YWxpZFR5cGVDb2RlIHx8XG4gICAgICAgIHNjb3JtMTJfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSDtcbiAgICB0aGlzLiNfaW52YWxpZF9yYW5nZV9jb2RlID0gaW52YWxpZFJhbmdlQ29kZSB8fFxuICAgICAgICBzY29ybTEyX2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRTtcbiAgICB0aGlzLiNfZGVjaW1hbF9yZWdleCA9IGRlY2ltYWxSZWdleCB8fFxuICAgICAgICBzY29ybTEyX3JlZ2V4LkNNSURlY2ltYWw7XG4gICAgdGhpcy4jX2Vycm9yX2NsYXNzID0gZXJyb3JDbGFzcztcbiAgfVxuXG4gICNfY2hpbGRyZW47XG4gICNfc2NvcmVfcmFuZ2U7XG4gICNfaW52YWxpZF9lcnJvcl9jb2RlO1xuICAjX2ludmFsaWRfdHlwZV9jb2RlO1xuICAjX2ludmFsaWRfcmFuZ2VfY29kZTtcbiAgI19kZWNpbWFsX3JlZ2V4O1xuICAjX2Vycm9yX2NsYXNzO1xuICAjcmF3ID0gJyc7XG4gICNtaW4gPSAnJztcbiAgI21heDtcblxuICAvKipcbiAgICogR2V0dGVyIGZvciBfY2hpbGRyZW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IF9jaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvdyBuZXcgdGhpcy4jX2Vycm9yX2NsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcih0aGlzLiNfaW52YWxpZF9lcnJvcl9jb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNyYXdcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHJhdygpIHtcbiAgICByZXR1cm4gdGhpcy4jcmF3O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3Jhd1xuICAgKiBAcGFyYW0ge3N0cmluZ30gcmF3XG4gICAqL1xuICBzZXQgcmF3KHJhdykge1xuICAgIGlmIChjaGVja1ZhbGlkRm9ybWF0KHJhdywgdGhpcy4jX2RlY2ltYWxfcmVnZXgsIHRoaXMuI19pbnZhbGlkX3R5cGVfY29kZSwgdGhpcy4jX2Vycm9yX2NsYXNzKSAmJlxuICAgICAgICAoIXRoaXMuI19zY29yZV9yYW5nZSB8fFxuICAgICAgICAgICAgY2hlY2tWYWxpZFJhbmdlKHJhdywgdGhpcy4jX3Njb3JlX3JhbmdlLCB0aGlzLiNfaW52YWxpZF9yYW5nZV9jb2RlLCB0aGlzLiNfZXJyb3JfY2xhc3MpKSkge1xuICAgICAgdGhpcy4jcmF3ID0gcmF3O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNtaW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1pbigpIHtcbiAgICByZXR1cm4gdGhpcy4jbWluO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI21pblxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWluXG4gICAqL1xuICBzZXQgbWluKG1pbikge1xuICAgIGlmIChjaGVja1ZhbGlkRm9ybWF0KG1pbiwgdGhpcy4jX2RlY2ltYWxfcmVnZXgsIHRoaXMuI19pbnZhbGlkX3R5cGVfY29kZSwgdGhpcy4jX2Vycm9yX2NsYXNzKSAmJlxuICAgICAgICAoIXRoaXMuI19zY29yZV9yYW5nZSB8fFxuICAgICAgICAgICAgY2hlY2tWYWxpZFJhbmdlKG1pbiwgdGhpcy4jX3Njb3JlX3JhbmdlLCB0aGlzLiNfaW52YWxpZF9yYW5nZV9jb2RlLCB0aGlzLiNfZXJyb3JfY2xhc3MpKSkge1xuICAgICAgdGhpcy4jbWluID0gbWluO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNtYXhcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1heCgpIHtcbiAgICByZXR1cm4gdGhpcy4jbWF4O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI21heFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWF4XG4gICAqL1xuICBzZXQgbWF4KG1heCkge1xuICAgIGlmIChjaGVja1ZhbGlkRm9ybWF0KG1heCwgdGhpcy4jX2RlY2ltYWxfcmVnZXgsIHRoaXMuI19pbnZhbGlkX3R5cGVfY29kZSwgdGhpcy4jX2Vycm9yX2NsYXNzKSAmJlxuICAgICAgICAoIXRoaXMuI19zY29yZV9yYW5nZSB8fFxuICAgICAgICAgICAgY2hlY2tWYWxpZFJhbmdlKG1heCwgdGhpcy4jX3Njb3JlX3JhbmdlLCB0aGlzLiNfaW52YWxpZF9yYW5nZV9jb2RlLCB0aGlzLiNfZXJyb3JfY2xhc3MpKSkge1xuICAgICAgdGhpcy4jbWF4ID0gbWF4O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yICouc2NvcmVcbiAgICogQHJldHVybiB7e21pbjogc3RyaW5nLCBtYXg6IHN0cmluZywgcmF3OiBzdHJpbmd9fVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3Jhdyc6IHRoaXMucmF3LFxuICAgICAgJ21pbic6IHRoaXMubWluLFxuICAgICAgJ21heCc6IHRoaXMubWF4LFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgY21pICoubiBvYmplY3RzXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlBcnJheSBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgY21pICoubiBhcnJheXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNoaWxkcmVuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBlcnJvckNvZGVcbiAgICogQHBhcmFtIHtjbGFzc30gZXJyb3JDbGFzc1xuICAgKi9cbiAgY29uc3RydWN0b3Ioe2NoaWxkcmVuLCBlcnJvckNvZGUsIGVycm9yQ2xhc3N9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLiNfY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICB0aGlzLiNlcnJvckNvZGUgPSBlcnJvckNvZGU7XG4gICAgdGhpcy4jZXJyb3JDbGFzcyA9IGVycm9yQ2xhc3M7XG4gICAgdGhpcy5jaGlsZEFycmF5ID0gW107XG4gIH1cblxuICAjZXJyb3JDb2RlO1xuICAjZXJyb3JDbGFzcztcbiAgI19jaGlsZHJlbjtcblxuICAvKipcbiAgICogR2V0dGVyIGZvciBfY2hpbGRyZW5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yIF9jaGlsZHJlbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfY2hpbGRyZW5cbiAgICovXG4gIHNldCBfY2hpbGRyZW4oX2NoaWxkcmVuKSB7XG4gICAgdGhyb3cgbmV3IHRoaXMuI2Vycm9yQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yKHRoaXMuI2Vycm9yQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBfY291bnRcbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cbiAgZ2V0IF9jb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZEFycmF5Lmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yIF9jb3VudC4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBfY291bnRcbiAgICovXG4gIHNldCBfY291bnQoX2NvdW50KSB7XG4gICAgdGhyb3cgbmV3IHRoaXMuI2Vycm9yQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yKHRoaXMuI2Vycm9yQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciAqLm4gYXJyYXlzXG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHRbaSArICcnXSA9IHRoaXMuY2hpbGRBcnJheVtpXTtcbiAgICB9XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iLCIvLyBAZmxvd1xuaW1wb3J0IHtcbiAgQmFzZUNNSSxcbiAgY2hlY2tWYWxpZEZvcm1hdCxcbiAgY2hlY2tWYWxpZFJhbmdlLFxuICBDTUlBcnJheSxcbiAgQ01JU2NvcmUsXG59IGZyb20gJy4vY29tbW9uJztcbmltcG9ydCBBUElDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuaW1wb3J0IEVycm9yQ29kZXMgZnJvbSAnLi4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJztcbmltcG9ydCBSZWdleCBmcm9tICcuLi9jb25zdGFudHMvcmVnZXgnO1xuaW1wb3J0IHtTY29ybTEyVmFsaWRhdGlvbkVycm9yfSBmcm9tICcuLi9leGNlcHRpb25zJztcbmltcG9ydCAqIGFzIFV0aWxpdGllcyBmcm9tICcuLi91dGlsaXRpZXMnO1xuaW1wb3J0ICogYXMgVXRpbCBmcm9tICcuLi91dGlsaXRpZXMnO1xuXG5jb25zdCBzY29ybTEyX2NvbnN0YW50cyA9IEFQSUNvbnN0YW50cy5zY29ybTEyO1xuY29uc3Qgc2Nvcm0xMl9yZWdleCA9IFJlZ2V4LnNjb3JtMTI7XG5jb25zdCBzY29ybTEyX2Vycm9yX2NvZGVzID0gRXJyb3JDb2Rlcy5zY29ybTEyO1xuXG4vKipcbiAqIEhlbHBlciBtZXRob2QgZm9yIHRocm93aW5nIFJlYWQgT25seSBlcnJvclxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dSZWFkT25seUVycm9yKCkge1xuICB0aHJvdyBuZXcgU2Nvcm0xMlZhbGlkYXRpb25FcnJvcihzY29ybTEyX2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5UKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIGZvciB0aHJvd2luZyBXcml0ZSBPbmx5IGVycm9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aHJvd1dyaXRlT25seUVycm9yKCkge1xuICB0aHJvdyBuZXcgU2Nvcm0xMlZhbGlkYXRpb25FcnJvcihzY29ybTEyX2Vycm9yX2NvZGVzLldSSVRFX09OTFlfRUxFTUVOVCk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgSW52YWxpZCBTZXQgZXJyb3JcbiAqL1xuZnVuY3Rpb24gdGhyb3dJbnZhbGlkVmFsdWVFcnJvcigpIHtcbiAgdGhyb3cgbmV3IFNjb3JtMTJWYWxpZGF0aW9uRXJyb3Ioc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCwgbm8gcmVhc29uIHRvIGhhdmUgdG8gcGFzcyB0aGUgc2FtZSBlcnJvciBjb2RlcyBldmVyeSB0aW1lXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVnZXhQYXR0ZXJuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGFsbG93RW1wdHlTdHJpbmdcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVjazEyVmFsaWRGb3JtYXQoXG4gICAgdmFsdWU6IFN0cmluZyxcbiAgICByZWdleFBhdHRlcm46IFN0cmluZyxcbiAgICBhbGxvd0VtcHR5U3RyaW5nPzogYm9vbGVhbikge1xuICByZXR1cm4gY2hlY2tWYWxpZEZvcm1hdChcbiAgICAgIHZhbHVlLFxuICAgICAgcmVnZXhQYXR0ZXJuLFxuICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENILFxuICAgICAgU2Nvcm0xMlZhbGlkYXRpb25FcnJvcixcbiAgICAgIGFsbG93RW1wdHlTdHJpbmdcbiAgKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kLCBubyByZWFzb24gdG8gaGF2ZSB0byBwYXNzIHRoZSBzYW1lIGVycm9yIGNvZGVzIGV2ZXJ5IHRpbWVcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSByYW5nZVBhdHRlcm5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWxsb3dFbXB0eVN0cmluZ1xuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrMTJWYWxpZFJhbmdlKFxuICAgIHZhbHVlOiBhbnksXG4gICAgcmFuZ2VQYXR0ZXJuOiBTdHJpbmcsXG4gICAgYWxsb3dFbXB0eVN0cmluZz86IGJvb2xlYW4pIHtcbiAgcmV0dXJuIGNoZWNrVmFsaWRSYW5nZShcbiAgICAgIHZhbHVlLFxuICAgICAgcmFuZ2VQYXR0ZXJuLFxuICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0UsXG4gICAgICBTY29ybTEyVmFsaWRhdGlvbkVycm9yLFxuICAgICAgYWxsb3dFbXB0eVN0cmluZ1xuICApO1xufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyB0aGUgY21pIG9iamVjdCBmb3IgU0NPUk0gMS4yXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUkgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI19jaGlsZHJlbiA9ICcnO1xuICAjX3ZlcnNpb24gPSAnMy40JztcbiAgI2xhdW5jaF9kYXRhID0gJyc7XG4gICNjb21tZW50cyA9ICcnO1xuICAjY29tbWVudHNfZnJvbV9sbXMgPSAnJztcblxuICBzdHVkZW50X2RhdGEgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgdGhlIFNDT1JNIDEuMiBjbWkgb2JqZWN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbWlfY2hpbGRyZW5cbiAgICogQHBhcmFtIHsoQ01JU3R1ZGVudERhdGF8QUlDQ0NNSVN0dWRlbnREYXRhKX0gc3R1ZGVudF9kYXRhXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5pdGlhbGl6ZWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNtaV9jaGlsZHJlbiwgc3R1ZGVudF9kYXRhLCBpbml0aWFsaXplZDogYm9vbGVhbikge1xuICAgIHN1cGVyKCk7XG5cbiAgICBpZiAoaW5pdGlhbGl6ZWQpIHRoaXMuaW5pdGlhbGl6ZSgpO1xuXG4gICAgdGhpcy4jX2NoaWxkcmVuID0gY21pX2NoaWxkcmVuID9cbiAgICAgICAgY21pX2NoaWxkcmVuIDpcbiAgICAgICAgc2Nvcm0xMl9jb25zdGFudHMuY21pX2NoaWxkcmVuO1xuICAgIHRoaXMuY29yZSA9IG5ldyBDTUlDb3JlKCk7XG4gICAgdGhpcy5vYmplY3RpdmVzID0gbmV3IENNSU9iamVjdGl2ZXMoKTtcbiAgICB0aGlzLnN0dWRlbnRfZGF0YSA9IHN0dWRlbnRfZGF0YSA/IHN0dWRlbnRfZGF0YSA6IG5ldyBDTUlTdHVkZW50RGF0YSgpO1xuICAgIHRoaXMuc3R1ZGVudF9wcmVmZXJlbmNlID0gbmV3IENNSVN0dWRlbnRQcmVmZXJlbmNlKCk7XG4gICAgdGhpcy5pbnRlcmFjdGlvbnMgPSBuZXcgQ01JSW50ZXJhY3Rpb25zKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuY29yZT8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMub2JqZWN0aXZlcz8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc3R1ZGVudF9kYXRhPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zdHVkZW50X3ByZWZlcmVuY2U/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmludGVyYWN0aW9ucz8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgc3VzcGVuZF9kYXRhOiBzdHJpbmcsXG4gICAqICAgICAgbGF1bmNoX2RhdGE6IHN0cmluZyxcbiAgICogICAgICBjb21tZW50czogc3RyaW5nLFxuICAgKiAgICAgIGNvbW1lbnRzX2Zyb21fbG1zOiBzdHJpbmcsXG4gICAqICAgICAgY29yZTogQ01JQ29yZSxcbiAgICogICAgICBvYmplY3RpdmVzOiBDTUlPYmplY3RpdmVzLFxuICAgKiAgICAgIHN0dWRlbnRfZGF0YTogQ01JU3R1ZGVudERhdGEsXG4gICAqICAgICAgc3R1ZGVudF9wcmVmZXJlbmNlOiBDTUlTdHVkZW50UHJlZmVyZW5jZSxcbiAgICogICAgICBpbnRlcmFjdGlvbnM6IENNSUludGVyYWN0aW9uc1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnc3VzcGVuZF9kYXRhJzogdGhpcy5zdXNwZW5kX2RhdGEsXG4gICAgICAnbGF1bmNoX2RhdGEnOiB0aGlzLmxhdW5jaF9kYXRhLFxuICAgICAgJ2NvbW1lbnRzJzogdGhpcy5jb21tZW50cyxcbiAgICAgICdjb21tZW50c19mcm9tX2xtcyc6IHRoaXMuY29tbWVudHNfZnJvbV9sbXMsXG4gICAgICAnY29yZSc6IHRoaXMuY29yZSxcbiAgICAgICdvYmplY3RpdmVzJzogdGhpcy5vYmplY3RpdmVzLFxuICAgICAgJ3N0dWRlbnRfZGF0YSc6IHRoaXMuc3R1ZGVudF9kYXRhLFxuICAgICAgJ3N0dWRlbnRfcHJlZmVyZW5jZSc6IHRoaXMuc3R1ZGVudF9wcmVmZXJlbmNlLFxuICAgICAgJ2ludGVyYWN0aW9ucyc6IHRoaXMuaW50ZXJhY3Rpb25zLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI192ZXJzaW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBfdmVyc2lvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX3ZlcnNpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX3ZlcnNpb24uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX3ZlcnNpb25cbiAgICovXG4gIHNldCBfdmVyc2lvbihfdmVyc2lvbikge1xuICAgIHRocm93SW52YWxpZFZhbHVlRXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNfY2hpbGRyZW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IF9jaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI192ZXJzaW9uLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvd0ludmFsaWRWYWx1ZUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3VzcGVuZF9kYXRhXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdXNwZW5kX2RhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29yZT8uc3VzcGVuZF9kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N1c3BlbmRfZGF0YVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3VzcGVuZF9kYXRhXG4gICAqL1xuICBzZXQgc3VzcGVuZF9kYXRhKHN1c3BlbmRfZGF0YSkge1xuICAgIGlmICh0aGlzLmNvcmUpIHtcbiAgICAgIHRoaXMuY29yZS5zdXNwZW5kX2RhdGEgPSBzdXNwZW5kX2RhdGE7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xhdW5jaF9kYXRhXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsYXVuY2hfZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGF1bmNoX2RhdGE7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGF1bmNoX2RhdGEuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGF1bmNoX2RhdGFcbiAgICovXG4gIHNldCBsYXVuY2hfZGF0YShsYXVuY2hfZGF0YSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jbGF1bmNoX2RhdGEgPSBsYXVuY2hfZGF0YSA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NvbW1lbnRzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb21tZW50cygpIHtcbiAgICByZXR1cm4gdGhpcy4jY29tbWVudHM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29tbWVudHNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbW1lbnRzXG4gICAqL1xuICBzZXQgY29tbWVudHMoY29tbWVudHMpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGNvbW1lbnRzLCBzY29ybTEyX3JlZ2V4LkNNSVN0cmluZzQwOTYsIHRydWUpKSB7XG4gICAgICB0aGlzLiNjb21tZW50cyA9IGNvbW1lbnRzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb21tZW50c19mcm9tX2xtc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29tbWVudHNfZnJvbV9sbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbW1lbnRzX2Zyb21fbG1zO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbW1lbnRzX2Zyb21fbG1zLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbW1lbnRzX2Zyb21fbG1zXG4gICAqL1xuICBzZXQgY29tbWVudHNfZnJvbV9sbXMoY29tbWVudHNfZnJvbV9sbXMpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2NvbW1lbnRzX2Zyb21fbG1zID0gY29tbWVudHNfZnJvbV9sbXMgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHRoZSBjdXJyZW50IHNlc3Npb24gdGltZSB0byB0aGUgZXhpc3RpbmcgdG90YWwgdGltZS5cbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0Q3VycmVudFRvdGFsVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb3JlLmdldEN1cnJlbnRUb3RhbFRpbWUodGhpcy5zdGFydF90aW1lKTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyB0aGUgY21pLmNvcmUgb2JqZWN0XG4gKiBAZXh0ZW5kcyBCYXNlQ01JXG4gKi9cbmNsYXNzIENNSUNvcmUgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuY29yZVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc2NvcmUgPSBuZXcgQ01JU2NvcmUoXG4gICAgICAgIHtcbiAgICAgICAgICBzY29yZV9jaGlsZHJlbjogc2Nvcm0xMl9jb25zdGFudHMuc2NvcmVfY2hpbGRyZW4sXG4gICAgICAgICAgc2NvcmVfcmFuZ2U6IHNjb3JtMTJfcmVnZXguc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgaW52YWxpZEVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgICAgICBpbnZhbGlkVHlwZUNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCxcbiAgICAgICAgICBpbnZhbGlkUmFuZ2VDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRSxcbiAgICAgICAgICBlcnJvckNsYXNzOiBTY29ybTEyVmFsaWRhdGlvbkVycm9yLFxuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zY29yZT8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgI19jaGlsZHJlbiA9IHNjb3JtMTJfY29uc3RhbnRzLmNvcmVfY2hpbGRyZW47XG4gICNzdHVkZW50X2lkID0gJyc7XG4gICNzdHVkZW50X25hbWUgPSAnJztcbiAgI2xlc3Nvbl9sb2NhdGlvbiA9ICcnO1xuICAjY3JlZGl0ID0gJyc7XG4gICNsZXNzb25fc3RhdHVzID0gJ25vdCBhdHRlbXB0ZWQnO1xuICAjZW50cnkgPSAnJztcbiAgI3RvdGFsX3RpbWUgPSAnJztcbiAgI2xlc3Nvbl9tb2RlID0gJ25vcm1hbCc7XG4gICNleGl0ID0gJyc7XG4gICNzZXNzaW9uX3RpbWUgPSAnMDA6MDA6MDAnO1xuICAjc3VzcGVuZF9kYXRhID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI19jaGlsZHJlblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvd0ludmFsaWRWYWx1ZUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3R1ZGVudF9pZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3R1ZGVudF9pZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jc3R1ZGVudF9pZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdHVkZW50X2lkLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0dWRlbnRfaWRcbiAgICovXG4gIHNldCBzdHVkZW50X2lkKHN0dWRlbnRfaWQpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI3N0dWRlbnRfaWQgPSBzdHVkZW50X2lkIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3R1ZGVudF9uYW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdHVkZW50X25hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0dWRlbnRfbmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdHVkZW50X25hbWUuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3R1ZGVudF9uYW1lXG4gICAqL1xuICBzZXQgc3R1ZGVudF9uYW1lKHN0dWRlbnRfbmFtZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jc3R1ZGVudF9uYW1lID0gc3R1ZGVudF9uYW1lIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGVzc29uX2xvY2F0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsZXNzb25fbG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xlc3Nvbl9sb2NhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsZXNzb25fbG9jYXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlc3Nvbl9sb2NhdGlvblxuICAgKi9cbiAgc2V0IGxlc3Nvbl9sb2NhdGlvbihsZXNzb25fbG9jYXRpb24pIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGxlc3Nvbl9sb2NhdGlvbiwgc2Nvcm0xMl9yZWdleC5DTUlTdHJpbmcyNTYsIHRydWUpKSB7XG4gICAgICB0aGlzLiNsZXNzb25fbG9jYXRpb24gPSBsZXNzb25fbG9jYXRpb247XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NyZWRpdFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY3JlZGl0KCkge1xuICAgIHJldHVybiB0aGlzLiNjcmVkaXQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY3JlZGl0LiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNyZWRpdFxuICAgKi9cbiAgc2V0IGNyZWRpdChjcmVkaXQpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI2NyZWRpdCA9IGNyZWRpdCA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xlc3Nvbl9zdGF0dXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlc3Nvbl9zdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xlc3Nvbl9zdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGVzc29uX3N0YXR1c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gbGVzc29uX3N0YXR1c1xuICAgKi9cbiAgc2V0IGxlc3Nvbl9zdGF0dXMobGVzc29uX3N0YXR1cykge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGxlc3Nvbl9zdGF0dXMsIHNjb3JtMTJfcmVnZXguQ01JU3RhdHVzKSkge1xuICAgICAgICB0aGlzLiNsZXNzb25fc3RhdHVzID0gbGVzc29uX3N0YXR1cztcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChsZXNzb25fc3RhdHVzLCBzY29ybTEyX3JlZ2V4LkNNSVN0YXR1czIpKSB7XG4gICAgICAgIHRoaXMuI2xlc3Nvbl9zdGF0dXMgPSBsZXNzb25fc3RhdHVzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNlbnRyeVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZW50cnkoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2VudHJ5O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2VudHJ5LiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGVudHJ5XG4gICAqL1xuICBzZXQgZW50cnkoZW50cnkpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI2VudHJ5ID0gZW50cnkgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0b3RhbF90aW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0b3RhbF90aW1lKCkge1xuICAgIHJldHVybiB0aGlzLiN0b3RhbF90aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RvdGFsX3RpbWUuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG90YWxfdGltZVxuICAgKi9cbiAgc2V0IHRvdGFsX3RpbWUodG90YWxfdGltZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jdG90YWxfdGltZSA9IHRvdGFsX3RpbWUgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsZXNzb25fbW9kZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVzc29uX21vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xlc3Nvbl9tb2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xlc3Nvbl9tb2RlLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlc3Nvbl9tb2RlXG4gICAqL1xuICBzZXQgbGVzc29uX21vZGUobGVzc29uX21vZGUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI2xlc3Nvbl9tb2RlID0gbGVzc29uX21vZGUgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNleGl0LiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IGV4aXQoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI2V4aXQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZXhpdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXhpdFxuICAgKi9cbiAgc2V0IGV4aXQoZXhpdCkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoZXhpdCwgc2Nvcm0xMl9yZWdleC5DTUlFeGl0LCB0cnVlKSkge1xuICAgICAgdGhpcy4jZXhpdCA9IGV4aXQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3Nlc3Npb25fdGltZS4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCBzZXNzaW9uX3RpbWUoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI3Nlc3Npb25fdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzZXNzaW9uX3RpbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlc3Npb25fdGltZVxuICAgKi9cbiAgc2V0IHNlc3Npb25fdGltZShzZXNzaW9uX3RpbWUpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHNlc3Npb25fdGltZSwgc2Nvcm0xMl9yZWdleC5DTUlUaW1lc3BhbikpIHtcbiAgICAgIHRoaXMuI3Nlc3Npb25fdGltZSA9IHNlc3Npb25fdGltZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3VzcGVuZF9kYXRhXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdXNwZW5kX2RhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N1c3BlbmRfZGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdXNwZW5kX2RhdGFcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN1c3BlbmRfZGF0YVxuICAgKi9cbiAgc2V0IHN1c3BlbmRfZGF0YShzdXNwZW5kX2RhdGEpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHN1c3BlbmRfZGF0YSwgc2Nvcm0xMl9yZWdleC5DTUlTdHJpbmc0MDk2LCB0cnVlKSkge1xuICAgICAgdGhpcy4jc3VzcGVuZF9kYXRhID0gc3VzcGVuZF9kYXRhO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHRoZSBjdXJyZW50IHNlc3Npb24gdGltZSB0byB0aGUgZXhpc3RpbmcgdG90YWwgdGltZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0X3RpbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0Q3VycmVudFRvdGFsVGltZShzdGFydF90aW1lOiBOdW1iZXIpIHtcbiAgICBsZXQgc2Vzc2lvblRpbWUgPSB0aGlzLiNzZXNzaW9uX3RpbWU7XG4gICAgY29uc3Qgc3RhcnRUaW1lID0gc3RhcnRfdGltZTtcblxuICAgIGlmICh0eXBlb2Ygc3RhcnRUaW1lICE9PSAndW5kZWZpbmVkJyAmJiBzdGFydFRpbWUgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IHNlY29uZHMgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0YXJ0VGltZTtcbiAgICAgIHNlc3Npb25UaW1lID0gVXRpbC5nZXRTZWNvbmRzQXNISE1NU1Moc2Vjb25kcyAvIDEwMDApO1xuICAgIH1cblxuICAgIHJldHVybiBVdGlsaXRpZXMuYWRkSEhNTVNTVGltZVN0cmluZ3MoXG4gICAgICAgIHRoaXMuI3RvdGFsX3RpbWUsXG4gICAgICAgIHNlc3Npb25UaW1lLFxuICAgICAgICBuZXcgUmVnRXhwKHNjb3JtMTJfcmVnZXguQ01JVGltZXNwYW4pLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuY29yZVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHN0dWRlbnRfbmFtZTogc3RyaW5nLFxuICAgKiAgICAgIGVudHJ5OiBzdHJpbmcsXG4gICAqICAgICAgZXhpdDogc3RyaW5nLFxuICAgKiAgICAgIHNjb3JlOiBDTUlTY29yZSxcbiAgICogICAgICBzdHVkZW50X2lkOiBzdHJpbmcsXG4gICAqICAgICAgbGVzc29uX21vZGU6IHN0cmluZyxcbiAgICogICAgICBsZXNzb25fbG9jYXRpb246IHN0cmluZyxcbiAgICogICAgICBsZXNzb25fc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgY3JlZGl0OiBzdHJpbmcsXG4gICAqICAgICAgc2Vzc2lvbl90aW1lOiAqXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdzdHVkZW50X2lkJzogdGhpcy5zdHVkZW50X2lkLFxuICAgICAgJ3N0dWRlbnRfbmFtZSc6IHRoaXMuc3R1ZGVudF9uYW1lLFxuICAgICAgJ2xlc3Nvbl9sb2NhdGlvbic6IHRoaXMubGVzc29uX2xvY2F0aW9uLFxuICAgICAgJ2NyZWRpdCc6IHRoaXMuY3JlZGl0LFxuICAgICAgJ2xlc3Nvbl9zdGF0dXMnOiB0aGlzLmxlc3Nvbl9zdGF0dXMsXG4gICAgICAnZW50cnknOiB0aGlzLmVudHJ5LFxuICAgICAgJ2xlc3Nvbl9tb2RlJzogdGhpcy5sZXNzb25fbW9kZSxcbiAgICAgICdleGl0JzogdGhpcy5leGl0LFxuICAgICAgJ3Nlc3Npb25fdGltZSc6IHRoaXMuc2Vzc2lvbl90aW1lLFxuICAgICAgJ3Njb3JlJzogdGhpcy5zY29yZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkub2JqZWN0aXZlcyBvYmplY3RcbiAqIEBleHRlbmRzIENNSUFycmF5XG4gKi9cbmNsYXNzIENNSU9iamVjdGl2ZXMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLm9iamVjdGl2ZXNcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHtcbiAgICAgIGNoaWxkcmVuOiBzY29ybTEyX2NvbnN0YW50cy5vYmplY3RpdmVzX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgZXJyb3JDbGFzczogU2Nvcm0xMlZhbGlkYXRpb25FcnJvcixcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkuc3R1ZGVudF9kYXRhIG9iamVjdFxuICogQGV4dGVuZHMgQmFzZUNNSVxuICovXG5leHBvcnQgY2xhc3MgQ01JU3R1ZGVudERhdGEgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI19jaGlsZHJlbjtcbiAgI21hc3Rlcnlfc2NvcmUgPSAnJztcbiAgI21heF90aW1lX2FsbG93ZWQgPSAnJztcbiAgI3RpbWVfbGltaXRfYWN0aW9uID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuc3R1ZGVudF9kYXRhXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHVkZW50X2RhdGFfY2hpbGRyZW5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHN0dWRlbnRfZGF0YV9jaGlsZHJlbikge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLiNfY2hpbGRyZW4gPSBzdHVkZW50X2RhdGFfY2hpbGRyZW4gP1xuICAgICAgICBzdHVkZW50X2RhdGFfY2hpbGRyZW4gOlxuICAgICAgICBzY29ybTEyX2NvbnN0YW50cy5zdHVkZW50X2RhdGFfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX2NoaWxkcmVuXG4gICAqIEByZXR1cm4geyp9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvd0ludmFsaWRWYWx1ZUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbWFzdGVyX3Njb3JlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBtYXN0ZXJ5X3Njb3JlKCkge1xuICAgIHJldHVybiB0aGlzLiNtYXN0ZXJ5X3Njb3JlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI21hc3Rlcl9zY29yZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYXN0ZXJ5X3Njb3JlXG4gICAqL1xuICBzZXQgbWFzdGVyeV9zY29yZShtYXN0ZXJ5X3Njb3JlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNtYXN0ZXJ5X3Njb3JlID0gbWFzdGVyeV9zY29yZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI21heF90aW1lX2FsbG93ZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1heF90aW1lX2FsbG93ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI21heF90aW1lX2FsbG93ZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbWF4X3RpbWVfYWxsb3dlZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYXhfdGltZV9hbGxvd2VkXG4gICAqL1xuICBzZXQgbWF4X3RpbWVfYWxsb3dlZChtYXhfdGltZV9hbGxvd2VkKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNtYXhfdGltZV9hbGxvd2VkID0gbWF4X3RpbWVfYWxsb3dlZCA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWVfbGltaXRfYWN0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lX2xpbWl0X2FjdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jdGltZV9saW1pdF9hY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGltZV9saW1pdF9hY3Rpb24uIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZV9saW1pdF9hY3Rpb25cbiAgICovXG4gIHNldCB0aW1lX2xpbWl0X2FjdGlvbih0aW1lX2xpbWl0X2FjdGlvbikge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jdGltZV9saW1pdF9hY3Rpb24gPSB0aW1lX2xpbWl0X2FjdGlvbiA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLnN0dWRlbnRfZGF0YVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIG1heF90aW1lX2FsbG93ZWQ6IHN0cmluZyxcbiAgICogICAgICB0aW1lX2xpbWl0X2FjdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIG1hc3Rlcnlfc2NvcmU6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnbWFzdGVyeV9zY29yZSc6IHRoaXMubWFzdGVyeV9zY29yZSxcbiAgICAgICdtYXhfdGltZV9hbGxvd2VkJzogdGhpcy5tYXhfdGltZV9hbGxvd2VkLFxuICAgICAgJ3RpbWVfbGltaXRfYWN0aW9uJzogdGhpcy50aW1lX2xpbWl0X2FjdGlvbixcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkuc3R1ZGVudF9wcmVmZXJlbmNlIG9iamVjdFxuICogQGV4dGVuZHMgQmFzZUNNSVxuICovXG5leHBvcnQgY2xhc3MgQ01JU3R1ZGVudFByZWZlcmVuY2UgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI19jaGlsZHJlbjtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5zdHVkZW50X3ByZWZlcmVuY2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlblxuICAgKi9cbiAgY29uc3RydWN0b3Ioc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuI19jaGlsZHJlbiA9IHN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbiA/XG4gICAgICAgIHN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbiA6XG4gICAgICAgIHNjb3JtMTJfY29uc3RhbnRzLnN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbjtcbiAgfVxuXG4gICNhdWRpbyA9ICcnO1xuICAjbGFuZ3VhZ2UgPSAnJztcbiAgI3NwZWVkID0gJyc7XG4gICN0ZXh0ID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI19jaGlsZHJlblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvd0ludmFsaWRWYWx1ZUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjYXVkaW9cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGF1ZGlvKCkge1xuICAgIHJldHVybiB0aGlzLiNhdWRpbztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNhdWRpb1xuICAgKiBAcGFyYW0ge3N0cmluZ30gYXVkaW9cbiAgICovXG4gIHNldCBhdWRpbyhhdWRpbykge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoYXVkaW8sIHNjb3JtMTJfcmVnZXguQ01JU0ludGVnZXIpICYmXG4gICAgICAgIGNoZWNrMTJWYWxpZFJhbmdlKGF1ZGlvLCBzY29ybTEyX3JlZ2V4LmF1ZGlvX3JhbmdlKSkge1xuICAgICAgdGhpcy4jYXVkaW8gPSBhdWRpbztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGFuZ3VhZ2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxhbmd1YWdlKCkge1xuICAgIHJldHVybiB0aGlzLiNsYW5ndWFnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsYW5ndWFnZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGFuZ3VhZ2VcbiAgICovXG4gIHNldCBsYW5ndWFnZShsYW5ndWFnZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQobGFuZ3VhZ2UsIHNjb3JtMTJfcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jbGFuZ3VhZ2UgPSBsYW5ndWFnZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3BlZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHNwZWVkKCkge1xuICAgIHJldHVybiB0aGlzLiNzcGVlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzcGVlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3BlZWRcbiAgICovXG4gIHNldCBzcGVlZChzcGVlZCkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoc3BlZWQsIHNjb3JtMTJfcmVnZXguQ01JU0ludGVnZXIpICYmXG4gICAgICAgIGNoZWNrMTJWYWxpZFJhbmdlKHNwZWVkLCBzY29ybTEyX3JlZ2V4LnNwZWVkX3JhbmdlKSkge1xuICAgICAgdGhpcy4jc3BlZWQgPSBzcGVlZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGV4dFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy4jdGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0ZXh0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4gICAqL1xuICBzZXQgdGV4dCh0ZXh0KSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh0ZXh0LCBzY29ybTEyX3JlZ2V4LkNNSVNJbnRlZ2VyKSAmJlxuICAgICAgICBjaGVjazEyVmFsaWRSYW5nZSh0ZXh0LCBzY29ybTEyX3JlZ2V4LnRleHRfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiN0ZXh0ID0gdGV4dDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuc3R1ZGVudF9wcmVmZXJlbmNlXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgYXVkaW86IHN0cmluZyxcbiAgICogICAgICBsYW5ndWFnZTogc3RyaW5nLFxuICAgKiAgICAgIHNwZWVkOiBzdHJpbmcsXG4gICAqICAgICAgdGV4dDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdhdWRpbyc6IHRoaXMuYXVkaW8sXG4gICAgICAnbGFuZ3VhZ2UnOiB0aGlzLmxhbmd1YWdlLFxuICAgICAgJ3NwZWVkJzogdGhpcy5zcGVlZCxcbiAgICAgICd0ZXh0JzogdGhpcy50ZXh0LFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5pbnRlcmFjdGlvbnMgb2JqZWN0XG4gKiBAZXh0ZW5kcyBCYXNlQ01JXG4gKi9cbmNsYXNzIENNSUludGVyYWN0aW9ucyBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogc2Nvcm0xMl9jb25zdGFudHMuaW50ZXJhY3Rpb25zX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgZXJyb3JDbGFzczogU2Nvcm0xMlZhbGlkYXRpb25FcnJvcixcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkuaW50ZXJhY3Rpb25zLm4gb2JqZWN0XG4gKiBAZXh0ZW5kcyBCYXNlQ01JXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlJbnRlcmFjdGlvbnNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4gb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5vYmplY3RpdmVzID0gbmV3IENNSUFycmF5KHtcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgIGVycm9yQ2xhc3M6IFNjb3JtMTJWYWxpZGF0aW9uRXJyb3IsXG4gICAgICBjaGlsZHJlbjogc2Nvcm0xMl9jb25zdGFudHMub2JqZWN0aXZlc19jaGlsZHJlbixcbiAgICB9KTtcbiAgICB0aGlzLmNvcnJlY3RfcmVzcG9uc2VzID0gbmV3IENNSUFycmF5KHtcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgIGVycm9yQ2xhc3M6IFNjb3JtMTJWYWxpZGF0aW9uRXJyb3IsXG4gICAgICBjaGlsZHJlbjogc2Nvcm0xMl9jb25zdGFudHMuY29ycmVjdF9yZXNwb25zZXNfY2hpbGRyZW4sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMub2JqZWN0aXZlcz8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuY29ycmVjdF9yZXNwb25zZXM/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICNpZCA9ICcnO1xuICAjdGltZSA9ICcnO1xuICAjdHlwZSA9ICcnO1xuICAjd2VpZ2h0aW5nID0gJyc7XG4gICNzdHVkZW50X3Jlc3BvbnNlID0gJyc7XG4gICNyZXN1bHQgPSAnJztcbiAgI2xhdGVuY3kgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaWQuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChpZCwgc2Nvcm0xMl9yZWdleC5DTUlJZGVudGlmaWVyKSkge1xuICAgICAgdGhpcy4jaWQgPSBpZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZS4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCB0aW1lKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiN0aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVcbiAgICovXG4gIHNldCB0aW1lKHRpbWUpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHRpbWUsIHNjb3JtMTJfcmVnZXguQ01JVGltZSkpIHtcbiAgICAgIHRoaXMuI3RpbWUgPSB0aW1lO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0eXBlLiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI3R5cGU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICAgKi9cbiAgc2V0IHR5cGUodHlwZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQodHlwZSwgc2Nvcm0xMl9yZWdleC5DTUlUeXBlKSkge1xuICAgICAgdGhpcy4jdHlwZSA9IHR5cGU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3dlaWdodGluZy4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCB3ZWlnaHRpbmcoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/XG4gICAgICAgIHRocm93V3JpdGVPbmx5RXJyb3IoKSA6XG4gICAgICAgIHRoaXMuI3dlaWdodGluZztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN3ZWlnaHRpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IHdlaWdodGluZ1xuICAgKi9cbiAgc2V0IHdlaWdodGluZyh3ZWlnaHRpbmcpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHdlaWdodGluZywgc2Nvcm0xMl9yZWdleC5DTUlEZWNpbWFsKSAmJlxuICAgICAgICBjaGVjazEyVmFsaWRSYW5nZSh3ZWlnaHRpbmcsIHNjb3JtMTJfcmVnZXgud2VpZ2h0aW5nX3JhbmdlKSkge1xuICAgICAgdGhpcy4jd2VpZ2h0aW5nID0gd2VpZ2h0aW5nO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdHVkZW50X3Jlc3BvbnNlLiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IHN0dWRlbnRfcmVzcG9uc2UoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI3N0dWRlbnRfcmVzcG9uc2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3R1ZGVudF9yZXNwb25zZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3R1ZGVudF9yZXNwb25zZVxuICAgKi9cbiAgc2V0IHN0dWRlbnRfcmVzcG9uc2Uoc3R1ZGVudF9yZXNwb25zZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoc3R1ZGVudF9yZXNwb25zZSwgc2Nvcm0xMl9yZWdleC5DTUlGZWVkYmFjaywgdHJ1ZSkpIHtcbiAgICAgIHRoaXMuI3N0dWRlbnRfcmVzcG9uc2UgPSBzdHVkZW50X3Jlc3BvbnNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNyZXN1bHQuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgcmVzdWx0KCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNyZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcmVzdWx0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZXN1bHRcbiAgICovXG4gIHNldCByZXN1bHQocmVzdWx0KSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChyZXN1bHQsIHNjb3JtMTJfcmVnZXguQ01JUmVzdWx0KSkge1xuICAgICAgdGhpcy4jcmVzdWx0ID0gcmVzdWx0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsYXRlbmN5LiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IGxhdGVuY3koKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI2xhdGVuY3k7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGF0ZW5jeVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGF0ZW5jeVxuICAgKi9cbiAgc2V0IGxhdGVuY3kobGF0ZW5jeSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQobGF0ZW5jeSwgc2Nvcm0xMl9yZWdleC5DTUlUaW1lc3BhbikpIHtcbiAgICAgIHRoaXMuI2xhdGVuY3kgPSBsYXRlbmN5O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5pbnRlcmFjdGlvbnMublxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGlkOiBzdHJpbmcsXG4gICAqICAgICAgdGltZTogc3RyaW5nLFxuICAgKiAgICAgIHR5cGU6IHN0cmluZyxcbiAgICogICAgICB3ZWlnaHRpbmc6IHN0cmluZyxcbiAgICogICAgICBzdHVkZW50X3Jlc3BvbnNlOiBzdHJpbmcsXG4gICAqICAgICAgcmVzdWx0OiBzdHJpbmcsXG4gICAqICAgICAgbGF0ZW5jeTogc3RyaW5nLFxuICAgKiAgICAgIG9iamVjdGl2ZXM6IENNSUFycmF5LFxuICAgKiAgICAgIGNvcnJlY3RfcmVzcG9uc2VzOiBDTUlBcnJheVxuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnaWQnOiB0aGlzLmlkLFxuICAgICAgJ3RpbWUnOiB0aGlzLnRpbWUsXG4gICAgICAndHlwZSc6IHRoaXMudHlwZSxcbiAgICAgICd3ZWlnaHRpbmcnOiB0aGlzLndlaWdodGluZyxcbiAgICAgICdzdHVkZW50X3Jlc3BvbnNlJzogdGhpcy5zdHVkZW50X3Jlc3BvbnNlLFxuICAgICAgJ3Jlc3VsdCc6IHRoaXMucmVzdWx0LFxuICAgICAgJ2xhdGVuY3knOiB0aGlzLmxhdGVuY3ksXG4gICAgICAnb2JqZWN0aXZlcyc6IHRoaXMub2JqZWN0aXZlcyxcbiAgICAgICdjb3JyZWN0X3Jlc3BvbnNlcyc6IHRoaXMuY29ycmVjdF9yZXNwb25zZXMsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLm9iamVjdGl2ZXMubiBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSU9iamVjdGl2ZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkub2JqZWN0aXZlcy5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zY29yZSA9IG5ldyBDTUlTY29yZShcbiAgICAgICAge1xuICAgICAgICAgIHNjb3JlX2NoaWxkcmVuOiBzY29ybTEyX2NvbnN0YW50cy5zY29yZV9jaGlsZHJlbixcbiAgICAgICAgICBzY29yZV9yYW5nZTogc2Nvcm0xMl9yZWdleC5zY29yZV9yYW5nZSxcbiAgICAgICAgICBpbnZhbGlkRXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgICAgIGludmFsaWRUeXBlQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENILFxuICAgICAgICAgIGludmFsaWRSYW5nZUNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFLFxuICAgICAgICAgIGVycm9yQ2xhc3M6IFNjb3JtMTJWYWxpZGF0aW9uRXJyb3IsXG4gICAgICAgIH0pO1xuICB9XG5cbiAgI2lkID0gJyc7XG4gICNzdGF0dXMgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaWRcbiAgICogQHJldHVybiB7XCJcIn1cbiAgICovXG4gIGdldCBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjaWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBzZXQgaWQoaWQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGlkLCBzY29ybTEyX3JlZ2V4LkNNSUlkZW50aWZpZXIpKSB7XG4gICAgICB0aGlzLiNpZCA9IGlkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdGF0dXNcbiAgICogQHJldHVybiB7XCJcIn1cbiAgICovXG4gIGdldCBzdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0YXR1c1xuICAgKi9cbiAgc2V0IHN0YXR1cyhzdGF0dXMpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHN0YXR1cywgc2Nvcm0xMl9yZWdleC5DTUlTdGF0dXMyKSkge1xuICAgICAgdGhpcy4jc3RhdHVzID0gc3RhdHVzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5vYmplY3RpdmVzLm5cbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBpZDogc3RyaW5nLFxuICAgKiAgICAgIHN0YXR1czogc3RyaW5nLFxuICAgKiAgICAgIHNjb3JlOiBDTUlTY29yZVxuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnaWQnOiB0aGlzLmlkLFxuICAgICAgJ3N0YXR1cyc6IHRoaXMuc3RhdHVzLFxuICAgICAgJ3Njb3JlJzogdGhpcy5zY29yZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkuaW50ZXJhY3Rpb25zLm4ub2JqZWN0aXZlcy5uIG9iamVjdFxuICogQGV4dGVuZHMgQmFzZUNNSVxuICovXG5leHBvcnQgY2xhc3MgQ01JSW50ZXJhY3Rpb25zT2JqZWN0aXZlc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5pbnRlcmFjdGlvbnMubi5vYmplY3RpdmVzLm5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAjaWQgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaWRcbiAgICogQHJldHVybiB7XCJcIn1cbiAgICovXG4gIGdldCBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjaWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBzZXQgaWQoaWQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGlkLCBzY29ybTEyX3JlZ2V4LkNNSUlkZW50aWZpZXIpKSB7XG4gICAgICB0aGlzLiNpZCA9IGlkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5pbnRlcmFjdGlvbnMubi5vYmplY3RpdmVzLm5cbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBpZDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdpZCc6IHRoaXMuaWQsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLmludGVyYWN0aW9ucy5jb3JyZWN0X3Jlc3BvbnNlcy5uIG9iamVjdFxuICogQGV4dGVuZHMgQmFzZUNNSVxuICovXG5leHBvcnQgY2xhc3MgQ01JSW50ZXJhY3Rpb25zQ29ycmVjdFJlc3BvbnNlc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5pbnRlcmFjdGlvbnMuY29ycmVjdF9yZXNwb25zZXMublxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gICNwYXR0ZXJuID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3BhdHRlcm5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHBhdHRlcm4oKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI3BhdHRlcm47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcGF0dGVyblxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0dGVyblxuICAgKi9cbiAgc2V0IHBhdHRlcm4ocGF0dGVybikge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQocGF0dGVybiwgc2Nvcm0xMl9yZWdleC5DTUlGZWVkYmFjaywgdHJ1ZSkpIHtcbiAgICAgIHRoaXMuI3BhdHRlcm4gPSBwYXR0ZXJuO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5pbnRlcmFjdGlvbnMuY29ycmVjdF9yZXNwb25zZXMublxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHBhdHRlcm46IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAncGF0dGVybic6IHRoaXMucGF0dGVybixcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBBSUNDIE5hdmlnYXRpb24gb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBOQVYgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBOQVYgb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgI2V2ZW50ID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2V2ZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBldmVudCgpIHtcbiAgICByZXR1cm4gdGhpcy4jZXZlbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZXZlbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAqL1xuICBzZXQgZXZlbnQoZXZlbnQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGV2ZW50LCBzY29ybTEyX3JlZ2V4Lk5BVkV2ZW50KSkge1xuICAgICAgdGhpcy4jZXZlbnQgPSBldmVudDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBuYXYgb2JqZWN0XG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgZXZlbnQ6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnZXZlbnQnOiB0aGlzLmV2ZW50LFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iLCIvLyBAZmxvd1xuXG5jb25zdCBnbG9iYWwgPSB7XG4gIFNDT1JNX1RSVUU6ICd0cnVlJyxcbiAgU0NPUk1fRkFMU0U6ICdmYWxzZScsXG4gIFNUQVRFX05PVF9JTklUSUFMSVpFRDogMCxcbiAgU1RBVEVfSU5JVElBTElaRUQ6IDEsXG4gIFNUQVRFX1RFUk1JTkFURUQ6IDIsXG4gIExPR19MRVZFTF9ERUJVRzogMSxcbiAgTE9HX0xFVkVMX0lORk86IDIsXG4gIExPR19MRVZFTF9XQVJOSU5HOiAzLFxuICBMT0dfTEVWRUxfRVJST1I6IDQsXG4gIExPR19MRVZFTF9OT05FOiA1LFxufTtcblxuY29uc3Qgc2Nvcm0xMiA9IHtcbiAgLy8gQ2hpbGRyZW4gbGlzdHNcbiAgY21pX2NoaWxkcmVuOiAnY29yZSxzdXNwZW5kX2RhdGEsbGF1bmNoX2RhdGEsY29tbWVudHMsb2JqZWN0aXZlcyxzdHVkZW50X2RhdGEsc3R1ZGVudF9wcmVmZXJlbmNlLGludGVyYWN0aW9ucycsXG4gIGNvcmVfY2hpbGRyZW46ICdzdHVkZW50X2lkLHN0dWRlbnRfbmFtZSxsZXNzb25fbG9jYXRpb24sY3JlZGl0LGxlc3Nvbl9zdGF0dXMsZW50cnksc2NvcmUsdG90YWxfdGltZSxsZXNzb25fbW9kZSxleGl0LHNlc3Npb25fdGltZScsXG4gIHNjb3JlX2NoaWxkcmVuOiAncmF3LG1pbixtYXgnLFxuICBjb21tZW50c19jaGlsZHJlbjogJ2NvbnRlbnQsbG9jYXRpb24sdGltZScsXG4gIG9iamVjdGl2ZXNfY2hpbGRyZW46ICdpZCxzY29yZSxzdGF0dXMnLFxuICBjb3JyZWN0X3Jlc3BvbnNlc19jaGlsZHJlbjogJ3BhdHRlcm4nLFxuICBzdHVkZW50X2RhdGFfY2hpbGRyZW46ICdtYXN0ZXJ5X3Njb3JlLG1heF90aW1lX2FsbG93ZWQsdGltZV9saW1pdF9hY3Rpb24nLFxuICBzdHVkZW50X3ByZWZlcmVuY2VfY2hpbGRyZW46ICdhdWRpbyxsYW5ndWFnZSxzcGVlZCx0ZXh0JyxcbiAgaW50ZXJhY3Rpb25zX2NoaWxkcmVuOiAnaWQsb2JqZWN0aXZlcyx0aW1lLHR5cGUsY29ycmVjdF9yZXNwb25zZXMsd2VpZ2h0aW5nLHN0dWRlbnRfcmVzcG9uc2UscmVzdWx0LGxhdGVuY3knLFxuXG4gIGVycm9yX2Rlc2NyaXB0aW9uczoge1xuICAgICcxMDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIEV4Y2VwdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTm8gc3BlY2lmaWMgZXJyb3IgY29kZSBleGlzdHMgdG8gZGVzY3JpYmUgdGhlIGVycm9yLiBVc2UgTE1TR2V0RGlhZ25vc3RpYyBmb3IgbW9yZSBpbmZvcm1hdGlvbicsXG4gICAgfSxcbiAgICAnMjAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnSW52YWxpZCBhcmd1bWVudCBlcnJvcicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIHRoYXQgYW4gYXJndW1lbnQgcmVwcmVzZW50cyBhbiBpbnZhbGlkIGRhdGEgbW9kZWwgZWxlbWVudCBvciBpcyBvdGhlcndpc2UgaW5jb3JyZWN0LicsXG4gICAgfSxcbiAgICAnMjAyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRWxlbWVudCBjYW5ub3QgaGF2ZSBjaGlsZHJlbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIHRoYXQgTE1TR2V0VmFsdWUgd2FzIGNhbGxlZCB3aXRoIGEgZGF0YSBtb2RlbCBlbGVtZW50IG5hbWUgdGhhdCBlbmRzIGluIFwiX2NoaWxkcmVuXCIgZm9yIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgZG9lcyBub3Qgc3VwcG9ydCB0aGUgXCJfY2hpbGRyZW5cIiBzdWZmaXguJyxcbiAgICB9LFxuICAgICcyMDMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdFbGVtZW50IG5vdCBhbiBhcnJheSAtIGNhbm5vdCBoYXZlIGNvdW50JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgdGhhdCBMTVNHZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSBkYXRhIG1vZGVsIGVsZW1lbnQgbmFtZSB0aGF0IGVuZHMgaW4gXCJfY291bnRcIiBmb3IgYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBkb2VzIG5vdCBzdXBwb3J0IHRoZSBcIl9jb3VudFwiIHN1ZmZpeC4nLFxuICAgIH0sXG4gICAgJzMwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ05vdCBpbml0aWFsaXplZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIHRoYXQgYW4gQVBJIGNhbGwgd2FzIG1hZGUgYmVmb3JlIHRoZSBjYWxsIHRvIGxtc0luaXRpYWxpemUuJyxcbiAgICB9LFxuICAgICc0MDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdOb3QgaW1wbGVtZW50ZWQgZXJyb3InLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1RoZSBkYXRhIG1vZGVsIGVsZW1lbnQgaW5kaWNhdGVkIGluIGEgY2FsbCB0byBMTVNHZXRWYWx1ZSBvciBMTVNTZXRWYWx1ZSBpcyB2YWxpZCwgYnV0IHdhcyBub3QgaW1wbGVtZW50ZWQgYnkgdGhpcyBMTVMuIFNDT1JNIDEuMiBkZWZpbmVzIGEgc2V0IG9mIGRhdGEgbW9kZWwgZWxlbWVudHMgYXMgYmVpbmcgb3B0aW9uYWwgZm9yIGFuIExNUyB0byBpbXBsZW1lbnQuJyxcbiAgICB9LFxuICAgICc0MDInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdJbnZhbGlkIHNldCB2YWx1ZSwgZWxlbWVudCBpcyBhIGtleXdvcmQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyB0aGF0IExNU1NldFZhbHVlIHdhcyBjYWxsZWQgb24gYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCByZXByZXNlbnRzIGEga2V5d29yZCAoZWxlbWVudHMgdGhhdCBlbmQgaW4gXCJfY2hpbGRyZW5cIiBhbmQgXCJfY291bnRcIikuJyxcbiAgICB9LFxuICAgICc0MDMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdFbGVtZW50IGlzIHJlYWQgb25seScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTE1TU2V0VmFsdWUgd2FzIGNhbGxlZCB3aXRoIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgY2FuIG9ubHkgYmUgcmVhZC4nLFxuICAgIH0sXG4gICAgJzQwNCc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0VsZW1lbnQgaXMgd3JpdGUgb25seScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTE1TR2V0VmFsdWUgd2FzIGNhbGxlZCBvbiBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IGNhbiBvbmx5IGJlIHdyaXR0ZW4gdG8uJyxcbiAgICB9LFxuICAgICc0MDUnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdJbmNvcnJlY3QgRGF0YSBUeXBlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdMTVNTZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSB2YWx1ZSB0aGF0IGlzIG5vdCBjb25zaXN0ZW50IHdpdGggdGhlIGRhdGEgZm9ybWF0IG9mIHRoZSBzdXBwbGllZCBkYXRhIG1vZGVsIGVsZW1lbnQuJyxcbiAgICB9LFxuICAgICc0MDcnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdFbGVtZW50IFZhbHVlIE91dCBPZiBSYW5nZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnVGhlIG51bWVyaWMgdmFsdWUgc3VwcGxpZWQgdG8gYSBMTVNTZXRWYWx1ZSBjYWxsIGlzIG91dHNpZGUgb2YgdGhlIG51bWVyaWMgcmFuZ2UgYWxsb3dlZCBmb3IgdGhlIHN1cHBsaWVkIGRhdGEgbW9kZWwgZWxlbWVudC4nLFxuICAgIH0sXG4gICAgJzQwOCc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0RhdGEgTW9kZWwgRGVwZW5kZW5jeSBOb3QgRXN0YWJsaXNoZWQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1NvbWUgZGF0YSBtb2RlbCBlbGVtZW50cyBjYW5ub3QgYmUgc2V0IHVudGlsIGFub3RoZXIgZGF0YSBtb2RlbCBlbGVtZW50IHdhcyBzZXQuIFRoaXMgZXJyb3IgY29uZGl0aW9uIGluZGljYXRlcyB0aGF0IHRoZSBwcmVyZXF1aXNpdGUgZWxlbWVudCB3YXMgbm90IHNldCBiZWZvcmUgdGhlIGRlcGVuZGVudCBlbGVtZW50LicsXG4gICAgfSxcbiAgfSxcbn07XG5cbmNvbnN0IGFpY2MgPSB7XG4gIC4uLnNjb3JtMTIsIC4uLntcbiAgICBjbWlfY2hpbGRyZW46ICdjb3JlLHN1c3BlbmRfZGF0YSxsYXVuY2hfZGF0YSxjb21tZW50cyxvYmplY3RpdmVzLHN0dWRlbnRfZGF0YSxzdHVkZW50X3ByZWZlcmVuY2UsaW50ZXJhY3Rpb25zLGV2YWx1YXRpb24nLFxuICAgIHN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbjogJ2F1ZGlvLGxhbmd1YWdlLGxlc3Nvbl90eXBlLHNwZWVkLHRleHQsdGV4dF9jb2xvcix0ZXh0X2xvY2F0aW9uLHRleHRfc2l6ZSx2aWRlbyx3aW5kb3dzJyxcbiAgICBzdHVkZW50X2RhdGFfY2hpbGRyZW46ICdhdHRlbXB0X251bWJlcix0cmllcyxtYXN0ZXJ5X3Njb3JlLG1heF90aW1lX2FsbG93ZWQsdGltZV9saW1pdF9hY3Rpb24nLFxuICAgIHN0dWRlbnRfZGVtb2dyYXBoaWNzX2NoaWxkcmVuOiAnY2l0eSxjbGFzcyxjb21wYW55LGNvdW50cnksZXhwZXJpZW5jZSxmYW1pbGlhcl9uYW1lLGluc3RydWN0b3JfbmFtZSx0aXRsZSxuYXRpdmVfbGFuZ3VhZ2Usc3RhdGUsc3RyZWV0X2FkZHJlc3MsdGVsZXBob25lLHllYXJzX2V4cGVyaWVuY2UnLFxuICAgIHRyaWVzX2NoaWxkcmVuOiAndGltZSxzdGF0dXMsc2NvcmUnLFxuICAgIGF0dGVtcHRfcmVjb3Jkc19jaGlsZHJlbjogJ3Njb3JlLGxlc3Nvbl9zdGF0dXMnLFxuICAgIHBhdGhzX2NoaWxkcmVuOiAnbG9jYXRpb25faWQsZGF0ZSx0aW1lLHN0YXR1cyx3aHlfbGVmdCx0aW1lX2luX2VsZW1lbnQnLFxuICB9LFxufTtcblxuY29uc3Qgc2Nvcm0yMDA0ID0ge1xuICAvLyBDaGlsZHJlbiBsaXN0c1xuICBjbWlfY2hpbGRyZW46ICdfdmVyc2lvbixjb21tZW50c19mcm9tX2xlYXJuZXIsY29tbWVudHNfZnJvbV9sbXMsY29tcGxldGlvbl9zdGF0dXMsY3JlZGl0LGVudHJ5LGV4aXQsaW50ZXJhY3Rpb25zLGxhdW5jaF9kYXRhLGxlYXJuZXJfaWQsbGVhcm5lcl9uYW1lLGxlYXJuZXJfcHJlZmVyZW5jZSxsb2NhdGlvbixtYXhfdGltZV9hbGxvd2VkLG1vZGUsb2JqZWN0aXZlcyxwcm9ncmVzc19tZWFzdXJlLHNjYWxlZF9wYXNzaW5nX3Njb3JlLHNjb3JlLHNlc3Npb25fdGltZSxzdWNjZXNzX3N0YXR1cyxzdXNwZW5kX2RhdGEsdGltZV9saW1pdF9hY3Rpb24sdG90YWxfdGltZScsXG4gIGNvbW1lbnRzX2NoaWxkcmVuOiAnY29tbWVudCx0aW1lc3RhbXAsbG9jYXRpb24nLFxuICBzY29yZV9jaGlsZHJlbjogJ21heCxyYXcsc2NhbGVkLG1pbicsXG4gIG9iamVjdGl2ZXNfY2hpbGRyZW46ICdwcm9ncmVzc19tZWFzdXJlLGNvbXBsZXRpb25fc3RhdHVzLHN1Y2Nlc3Nfc3RhdHVzLGRlc2NyaXB0aW9uLHNjb3JlLGlkJyxcbiAgY29ycmVjdF9yZXNwb25zZXNfY2hpbGRyZW46ICdwYXR0ZXJuJyxcbiAgc3R1ZGVudF9kYXRhX2NoaWxkcmVuOiAnbWFzdGVyeV9zY29yZSxtYXhfdGltZV9hbGxvd2VkLHRpbWVfbGltaXRfYWN0aW9uJyxcbiAgc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuOiAnYXVkaW9fbGV2ZWwsYXVkaW9fY2FwdGlvbmluZyxkZWxpdmVyeV9zcGVlZCxsYW5ndWFnZScsXG4gIGludGVyYWN0aW9uc19jaGlsZHJlbjogJ2lkLHR5cGUsb2JqZWN0aXZlcyx0aW1lc3RhbXAsY29ycmVjdF9yZXNwb25zZXMsd2VpZ2h0aW5nLGxlYXJuZXJfcmVzcG9uc2UscmVzdWx0LGxhdGVuY3ksZGVzY3JpcHRpb24nLFxuXG4gIGVycm9yX2Rlc2NyaXB0aW9uczoge1xuICAgICcwJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnTm8gRXJyb3InLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ05vIGVycm9yIG9jY3VycmVkLCB0aGUgcHJldmlvdXMgQVBJIGNhbGwgd2FzIHN1Y2Nlc3NmdWwuJyxcbiAgICB9LFxuICAgICcxMDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIEV4Y2VwdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTm8gc3BlY2lmaWMgZXJyb3IgY29kZSBleGlzdHMgdG8gZGVzY3JpYmUgdGhlIGVycm9yLiBVc2UgR2V0RGlhZ25vc3RpYyBmb3IgbW9yZSBpbmZvcm1hdGlvbi4nLFxuICAgIH0sXG4gICAgJzEwMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgSW5pdGlhbGl6YXRpb24gRmFpbHVyZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBJbml0aWFsaXplIGZhaWxlZCBmb3IgYW4gdW5rbm93biByZWFzb24uJyxcbiAgICB9LFxuICAgICcxMDMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdBbHJlYWR5IEluaXRpYWxpemVkJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIEluaXRpYWxpemUgZmFpbGVkIGJlY2F1c2UgSW5pdGlhbGl6ZSB3YXMgYWxyZWFkeSBjYWxsZWQuJyxcbiAgICB9LFxuICAgICcxMDQnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdDb250ZW50IEluc3RhbmNlIFRlcm1pbmF0ZWQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gSW5pdGlhbGl6ZSBmYWlsZWQgYmVjYXVzZSBUZXJtaW5hdGUgd2FzIGFscmVhZHkgY2FsbGVkLicsXG4gICAgfSxcbiAgICAnMTExJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBUZXJtaW5hdGlvbiBGYWlsdXJlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIFRlcm1pbmF0ZSBmYWlsZWQgZm9yIGFuIHVua25vd24gcmVhc29uLicsXG4gICAgfSxcbiAgICAnMTEyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnVGVybWluYXRpb24gQmVmb3JlIEluaXRpYWxpemF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIFRlcm1pbmF0ZSBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBiZWZvcmUgdGhlIGNhbGwgdG8gSW5pdGlhbGl6ZS4nLFxuICAgIH0sXG4gICAgJzExMyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1Rlcm1pbmF0aW9uIEFmdGVyIFRlcm1pbmF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIFRlcm1pbmF0ZSBmYWlsZWQgYmVjYXVzZSBUZXJtaW5hdGUgd2FzIGFscmVhZHkgY2FsbGVkLicsXG4gICAgfSxcbiAgICAnMTIyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnUmV0cmlldmUgRGF0YSBCZWZvcmUgSW5pdGlhbGl6YXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gR2V0VmFsdWUgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYmVmb3JlIHRoZSBjYWxsIHRvIEluaXRpYWxpemUuJyxcbiAgICB9LFxuICAgICcxMjMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdSZXRyaWV2ZSBEYXRhIEFmdGVyIFRlcm1pbmF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIEdldFZhbHVlIGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGFmdGVyIHRoZSBjYWxsIHRvIFRlcm1pbmF0ZS4nLFxuICAgIH0sXG4gICAgJzEzMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1N0b3JlIERhdGEgQmVmb3JlIEluaXRpYWxpemF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIFNldFZhbHVlIGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGJlZm9yZSB0aGUgY2FsbCB0byBJbml0aWFsaXplLicsXG4gICAgfSxcbiAgICAnMTMzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnU3RvcmUgRGF0YSBBZnRlciBUZXJtaW5hdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBTZXRWYWx1ZSBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBhZnRlciB0aGUgY2FsbCB0byBUZXJtaW5hdGUuJyxcbiAgICB9LFxuICAgICcxNDInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdDb21taXQgQmVmb3JlIEluaXRpYWxpemF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIENvbW1pdCBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBiZWZvcmUgdGhlIGNhbGwgdG8gSW5pdGlhbGl6ZS4nLFxuICAgIH0sXG4gICAgJzE0Myc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0NvbW1pdCBBZnRlciBUZXJtaW5hdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBDb21taXQgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYWZ0ZXIgdGhlIGNhbGwgdG8gVGVybWluYXRlLicsXG4gICAgfSxcbiAgICAnMjAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBBcmd1bWVudCBFcnJvcicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQW4gaW52YWxpZCBhcmd1bWVudCB3YXMgcGFzc2VkIHRvIGFuIEFQSSBtZXRob2QgKHVzdWFsbHkgaW5kaWNhdGVzIHRoYXQgSW5pdGlhbGl6ZSwgQ29tbWl0IG9yIFRlcm1pbmF0ZSBkaWQgbm90IHJlY2VpdmUgdGhlIGV4cGVjdGVkIGVtcHR5IHN0cmluZyBhcmd1bWVudC4nLFxuICAgIH0sXG4gICAgJzMwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgR2V0IEZhaWx1cmUnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyBhIGZhaWxlZCBHZXRWYWx1ZSBjYWxsIHdoZXJlIG5vIG90aGVyIHNwZWNpZmljIGVycm9yIGNvZGUgaXMgYXBwbGljYWJsZS4gVXNlIEdldERpYWdub3N0aWMgZm9yIG1vcmUgaW5mb3JtYXRpb24uJyxcbiAgICB9LFxuICAgICczNTEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIFNldCBGYWlsdXJlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgYSBmYWlsZWQgU2V0VmFsdWUgY2FsbCB3aGVyZSBubyBvdGhlciBzcGVjaWZpYyBlcnJvciBjb2RlIGlzIGFwcGxpY2FibGUuIFVzZSBHZXREaWFnbm9zdGljIGZvciBtb3JlIGluZm9ybWF0aW9uLicsXG4gICAgfSxcbiAgICAnMzkxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBDb21taXQgRmFpbHVyZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIGEgZmFpbGVkIENvbW1pdCBjYWxsIHdoZXJlIG5vIG90aGVyIHNwZWNpZmljIGVycm9yIGNvZGUgaXMgYXBwbGljYWJsZS4gVXNlIEdldERpYWdub3N0aWMgZm9yIG1vcmUgaW5mb3JtYXRpb24uJyxcbiAgICB9LFxuICAgICc0MDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdVbmRlZmluZWQgRGF0YSBNb2RlbCBFbGVtZW50JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdUaGUgZGF0YSBtb2RlbCBlbGVtZW50IG5hbWUgcGFzc2VkIHRvIEdldFZhbHVlIG9yIFNldFZhbHVlIGlzIG5vdCBhIHZhbGlkIFNDT1JNIGRhdGEgbW9kZWwgZWxlbWVudC4nLFxuICAgIH0sXG4gICAgJzQwMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1VuaW1wbGVtZW50ZWQgRGF0YSBNb2RlbCBFbGVtZW50JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdUaGUgZGF0YSBtb2RlbCBlbGVtZW50IGluZGljYXRlZCBpbiBhIGNhbGwgdG8gR2V0VmFsdWUgb3IgU2V0VmFsdWUgaXMgdmFsaWQsIGJ1dCB3YXMgbm90IGltcGxlbWVudGVkIGJ5IHRoaXMgTE1TLiBJbiBTQ09STSAyMDA0LCB0aGlzIGVycm9yIHdvdWxkIGluZGljYXRlIGFuIExNUyB0aGF0IGlzIG5vdCBmdWxseSBTQ09STSBjb25mb3JtYW50LicsXG4gICAgfSxcbiAgICAnNDAzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBFbGVtZW50IFZhbHVlIE5vdCBJbml0aWFsaXplZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQXR0ZW1wdCB0byByZWFkIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkIGJ5IHRoZSBMTVMgb3IgdGhyb3VnaCBhIFNldFZhbHVlIGNhbGwuIFRoaXMgZXJyb3IgY29uZGl0aW9uIGlzIG9mdGVuIHJlYWNoZWQgZHVyaW5nIG5vcm1hbCBleGVjdXRpb24gb2YgYSBTQ08uJyxcbiAgICB9LFxuICAgICc0MDQnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdEYXRhIE1vZGVsIEVsZW1lbnQgSXMgUmVhZCBPbmx5JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdTZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBjYW4gb25seSBiZSByZWFkLicsXG4gICAgfSxcbiAgICAnNDA1Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBFbGVtZW50IElzIFdyaXRlIE9ubHknLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0dldFZhbHVlIHdhcyBjYWxsZWQgb24gYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBjYW4gb25seSBiZSB3cml0dGVuIHRvLicsXG4gICAgfSxcbiAgICAnNDA2Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBFbGVtZW50IFR5cGUgTWlzbWF0Y2gnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1NldFZhbHVlIHdhcyBjYWxsZWQgd2l0aCBhIHZhbHVlIHRoYXQgaXMgbm90IGNvbnNpc3RlbnQgd2l0aCB0aGUgZGF0YSBmb3JtYXQgb2YgdGhlIHN1cHBsaWVkIGRhdGEgbW9kZWwgZWxlbWVudC4nLFxuICAgIH0sXG4gICAgJzQwNyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0RhdGEgTW9kZWwgRWxlbWVudCBWYWx1ZSBPdXQgT2YgUmFuZ2UnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1RoZSBudW1lcmljIHZhbHVlIHN1cHBsaWVkIHRvIGEgU2V0VmFsdWUgY2FsbCBpcyBvdXRzaWRlIG9mIHRoZSBudW1lcmljIHJhbmdlIGFsbG93ZWQgZm9yIHRoZSBzdXBwbGllZCBkYXRhIG1vZGVsIGVsZW1lbnQuJyxcbiAgICB9LFxuICAgICc0MDgnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdEYXRhIE1vZGVsIERlcGVuZGVuY3kgTm90IEVzdGFibGlzaGVkJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdTb21lIGRhdGEgbW9kZWwgZWxlbWVudHMgY2Fubm90IGJlIHNldCB1bnRpbCBhbm90aGVyIGRhdGEgbW9kZWwgZWxlbWVudCB3YXMgc2V0LiBUaGlzIGVycm9yIGNvbmRpdGlvbiBpbmRpY2F0ZXMgdGhhdCB0aGUgcHJlcmVxdWlzaXRlIGVsZW1lbnQgd2FzIG5vdCBzZXQgYmVmb3JlIHRoZSBkZXBlbmRlbnQgZWxlbWVudC4nLFxuICAgIH0sXG4gIH0sXG59O1xuXG5jb25zdCBBUElDb25zdGFudHMgPSB7XG4gIGdsb2JhbDogZ2xvYmFsLFxuICBzY29ybTEyOiBzY29ybTEyLFxuICBhaWNjOiBhaWNjLFxuICBzY29ybTIwMDQ6IHNjb3JtMjAwNCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFQSUNvbnN0YW50cztcbiIsIi8vIEBmbG93XG5jb25zdCBnbG9iYWwgPSB7XG4gIEdFTkVSQUw6IDEwMSxcbiAgSU5JVElBTElaQVRJT05fRkFJTEVEOiAxMDEsXG4gIElOSVRJQUxJWkVEOiAxMDEsXG4gIFRFUk1JTkFURUQ6IDEwMSxcbiAgVEVSTUlOQVRJT05fRkFJTFVSRTogMTAxLFxuICBURVJNSU5BVElPTl9CRUZPUkVfSU5JVDogMTAxLFxuICBNVUxUSVBMRV9URVJNSU5BVElPTjogMTAxLFxuICBSRVRSSUVWRV9CRUZPUkVfSU5JVDogMTAxLFxuICBSRVRSSUVWRV9BRlRFUl9URVJNOiAxMDEsXG4gIFNUT1JFX0JFRk9SRV9JTklUOiAxMDEsXG4gIFNUT1JFX0FGVEVSX1RFUk06IDEwMSxcbiAgQ09NTUlUX0JFRk9SRV9JTklUOiAxMDEsXG4gIENPTU1JVF9BRlRFUl9URVJNOiAxMDEsXG4gIEFSR1VNRU5UX0VSUk9SOiAxMDEsXG4gIENISUxEUkVOX0VSUk9SOiAxMDEsXG4gIENPVU5UX0VSUk9SOiAxMDEsXG4gIEdFTkVSQUxfR0VUX0ZBSUxVUkU6IDEwMSxcbiAgR0VORVJBTF9TRVRfRkFJTFVSRTogMTAxLFxuICBHRU5FUkFMX0NPTU1JVF9GQUlMVVJFOiAxMDEsXG4gIFVOREVGSU5FRF9EQVRBX01PREVMOiAxMDEsXG4gIFVOSU1QTEVNRU5URURfRUxFTUVOVDogMTAxLFxuICBWQUxVRV9OT1RfSU5JVElBTElaRUQ6IDEwMSxcbiAgSU5WQUxJRF9TRVRfVkFMVUU6IDEwMSxcbiAgUkVBRF9PTkxZX0VMRU1FTlQ6IDEwMSxcbiAgV1JJVEVfT05MWV9FTEVNRU5UOiAxMDEsXG4gIFRZUEVfTUlTTUFUQ0g6IDEwMSxcbiAgVkFMVUVfT1VUX09GX1JBTkdFOiAxMDEsXG4gIERFUEVOREVOQ1lfTk9UX0VTVEFCTElTSEVEOiAxMDEsXG59O1xuXG5jb25zdCBzY29ybTEyID0ge1xuICAuLi5nbG9iYWwsIC4uLntcbiAgICBSRVRSSUVWRV9CRUZPUkVfSU5JVDogMzAxLFxuICAgIFNUT1JFX0JFRk9SRV9JTklUOiAzMDEsXG4gICAgQ09NTUlUX0JFRk9SRV9JTklUOiAzMDEsXG4gICAgQVJHVU1FTlRfRVJST1I6IDIwMSxcbiAgICBDSElMRFJFTl9FUlJPUjogMjAyLFxuICAgIENPVU5UX0VSUk9SOiAyMDMsXG4gICAgVU5ERUZJTkVEX0RBVEFfTU9ERUw6IDQwMSxcbiAgICBVTklNUExFTUVOVEVEX0VMRU1FTlQ6IDQwMSxcbiAgICBWQUxVRV9OT1RfSU5JVElBTElaRUQ6IDMwMSxcbiAgICBJTlZBTElEX1NFVF9WQUxVRTogNDAyLFxuICAgIFJFQURfT05MWV9FTEVNRU5UOiA0MDMsXG4gICAgV1JJVEVfT05MWV9FTEVNRU5UOiA0MDQsXG4gICAgVFlQRV9NSVNNQVRDSDogNDA1LFxuICAgIFZBTFVFX09VVF9PRl9SQU5HRTogNDA3LFxuICAgIERFUEVOREVOQ1lfTk9UX0VTVEFCTElTSEVEOiA0MDgsXG4gIH0sXG59O1xuXG5jb25zdCBzY29ybTIwMDQgPSB7XG4gIC4uLmdsb2JhbCwgLi4ue1xuICAgIElOSVRJQUxJWkFUSU9OX0ZBSUxFRDogMTAyLFxuICAgIElOSVRJQUxJWkVEOiAxMDMsXG4gICAgVEVSTUlOQVRFRDogMTA0LFxuICAgIFRFUk1JTkFUSU9OX0ZBSUxVUkU6IDExMSxcbiAgICBURVJNSU5BVElPTl9CRUZPUkVfSU5JVDogMTEyLFxuICAgIE1VTFRJUExFX1RFUk1JTkFUSU9OUzogMTEzLFxuICAgIFJFVFJJRVZFX0JFRk9SRV9JTklUOiAxMjIsXG4gICAgUkVUUklFVkVfQUZURVJfVEVSTTogMTIzLFxuICAgIFNUT1JFX0JFRk9SRV9JTklUOiAxMzIsXG4gICAgU1RPUkVfQUZURVJfVEVSTTogMTMzLFxuICAgIENPTU1JVF9CRUZPUkVfSU5JVDogMTQyLFxuICAgIENPTU1JVF9BRlRFUl9URVJNOiAxNDMsXG4gICAgQVJHVU1FTlRfRVJST1I6IDIwMSxcbiAgICBHRU5FUkFMX0dFVF9GQUlMVVJFOiAzMDEsXG4gICAgR0VORVJBTF9TRVRfRkFJTFVSRTogMzUxLFxuICAgIEdFTkVSQUxfQ09NTUlUX0ZBSUxVUkU6IDM5MSxcbiAgICBVTkRFRklORURfREFUQV9NT0RFTDogNDAxLFxuICAgIFVOSU1QTEVNRU5URURfRUxFTUVOVDogNDAyLFxuICAgIFZBTFVFX05PVF9JTklUSUFMSVpFRDogNDAzLFxuICAgIFJFQURfT05MWV9FTEVNRU5UOiA0MDQsXG4gICAgV1JJVEVfT05MWV9FTEVNRU5UOiA0MDUsXG4gICAgVFlQRV9NSVNNQVRDSDogNDA2LFxuICAgIFZBTFVFX09VVF9PRl9SQU5HRTogNDA3LFxuICAgIERFUEVOREVOQ1lfTk9UX0VTVEFCTElTSEVEOiA0MDgsXG4gIH0sXG59O1xuXG5jb25zdCBFcnJvckNvZGVzID0ge1xuICBzY29ybTEyOiBzY29ybTEyLFxuICBzY29ybTIwMDQ6IHNjb3JtMjAwNCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEVycm9yQ29kZXM7XG4iLCIvLyBAZmxvd1xuXG5jb25zdCBzY29ybTEyID0ge1xuICBDTUlTdHJpbmcyNTY6ICdeLnswLDI1NX0kJyxcbiAgQ01JU3RyaW5nNDA5NjogJ14uezAsNDA5Nn0kJyxcbiAgQ01JVGltZTogJ14oPzpbMDFdXFxcXGR8MlswMTIzXSk6KD86WzAxMjM0NV1cXFxcZCk6KD86WzAxMjM0NV1cXFxcZCkkJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlUaW1lc3BhbjogJ14oWzAtOV17Mix9KTooWzAtOV17Mn0pOihbMC05XXsyfSkoXFwuWzAtOV17MSwyfSk/JCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JSW50ZWdlcjogJ15cXFxcZCskJyxcbiAgQ01JU0ludGVnZXI6ICdeLT8oWzAtOV0rKSQnLFxuICBDTUlEZWNpbWFsOiAnXi0/KFswLTldezAsM30pKFxcLlswLTldKik/JCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JSWRlbnRpZmllcjogJ15bXFxcXHUwMDIxLVxcXFx1MDA3RVxcXFxzXXswLDI1NX0kJyxcbiAgQ01JRmVlZGJhY2s6ICdeLnswLDI1NX0kJywgLy8gVGhpcyBtdXN0IGJlIHJlZGVmaW5lZFxuICBDTUlJbmRleDogJ1suX10oXFxcXGQrKS4nLFxuXG4gIC8vIFZvY2FidWxhcnkgRGF0YSBUeXBlIERlZmluaXRpb25cbiAgQ01JU3RhdHVzOiAnXihwYXNzZWR8Y29tcGxldGVkfGZhaWxlZHxpbmNvbXBsZXRlfGJyb3dzZWQpJCcsXG4gIENNSVN0YXR1czI6ICdeKHBhc3NlZHxjb21wbGV0ZWR8ZmFpbGVkfGluY29tcGxldGV8YnJvd3NlZHxub3QgYXR0ZW1wdGVkKSQnLFxuICBDTUlFeGl0OiAnXih0aW1lLW91dHxzdXNwZW5kfGxvZ291dHwpJCcsXG4gIENNSVR5cGU6ICdeKHRydWUtZmFsc2V8Y2hvaWNlfGZpbGwtaW58bWF0Y2hpbmd8cGVyZm9ybWFuY2V8c2VxdWVuY2luZ3xsaWtlcnR8bnVtZXJpYykkJyxcbiAgQ01JUmVzdWx0OiAnXihjb3JyZWN0fHdyb25nfHVuYW50aWNpcGF0ZWR8bmV1dHJhbHwoWzAtOV17MCwzfSk/KFxcXFwuWzAtOV0qKT8pJCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgTkFWRXZlbnQ6ICdeKHByZXZpb3VzfGNvbnRpbnVlKSQnLFxuXG4gIC8vIERhdGEgcmFuZ2VzXG4gIHNjb3JlX3JhbmdlOiAnMCMxMDAnLFxuICBhdWRpb19yYW5nZTogJy0xIzEwMCcsXG4gIHNwZWVkX3JhbmdlOiAnLTEwMCMxMDAnLFxuICB3ZWlnaHRpbmdfcmFuZ2U6ICctMTAwIzEwMCcsXG4gIHRleHRfcmFuZ2U6ICctMSMxJyxcbn07XG5cbmNvbnN0IGFpY2MgPSB7XG4gIC4uLnNjb3JtMTIsIC4uLntcbiAgICBDTUlJZGVudGlmaWVyOiAnXlxcXFx3ezEsMjU1fSQnLFxuICB9LFxufTtcblxuY29uc3Qgc2Nvcm0yMDA0ID0ge1xuICBDTUlTdHJpbmcyMDA6ICdeW1xcXFx1MDAwMC1cXFxcdUZGRkZdezAsMjAwfSQnLFxuICBDTUlTdHJpbmcyNTA6ICdeW1xcXFx1MDAwMC1cXFxcdUZGRkZdezAsMjUwfSQnLFxuICBDTUlTdHJpbmcxMDAwOiAnXltcXFxcdTAwMDAtXFxcXHVGRkZGXXswLDEwMDB9JCcsXG4gIENNSVN0cmluZzQwMDA6ICdeW1xcXFx1MDAwMC1cXFxcdUZGRkZdezAsNDAwMH0kJyxcbiAgQ01JU3RyaW5nNjQwMDA6ICdeW1xcXFx1MDAwMC1cXFxcdUZGRkZdezAsNjQwMDB9JCcsXG4gIENNSUxhbmc6ICdeKFthLXpBLVpdezIsM318aXx4KShcXC1bYS16QS1aMC05XFwtXXsyLDh9KT8kfF4kJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlMYW5nU3RyaW5nMjUwOiAnXihcXHtsYW5nPShbYS16QS1aXXsyLDN9fGl8eCkoXFwtW2EtekEtWjAtOVxcLV17Miw4fSk/XFx9KT8oKD8hXFx7LiokKS57MCwyNTB9JCk/JCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JTGFuZ2NyOiAnXigoXFx7bGFuZz0oW2EtekEtWl17MiwzfXxpfHgpPyhcXC1bYS16QS1aMC05XFwtXXsyLDh9KT9cXH0pKSguKj8pJCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JTGFuZ1N0cmluZzI1MGNyOiAnXigoXFx7bGFuZz0oW2EtekEtWl17MiwzfXxpfHgpPyhcXC1bYS16QS1aMC05XFwtXXsyLDh9KT9cXH0pPyguezAsMjUwfSk/KT8kJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlMYW5nU3RyaW5nNDAwMDogJ14oXFx7bGFuZz0oW2EtekEtWl17MiwzfXxpfHgpKFxcLVthLXpBLVowLTlcXC1dezIsOH0pP1xcfSk/KCg/IVxcey4qJCkuezAsNDAwMH0kKT8kJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlUaW1lOiAnXigxOVs3LTldezF9WzAtOV17MX18MjBbMC0yXXsxfVswLTldezF9fDIwM1swLThdezF9KSgoLSgwWzEtOV17MX18MVswLTJdezF9KSkoKC0oMFsxLTldezF9fFsxLTJdezF9WzAtOV17MX18M1swLTFdezF9KSkoVChbMC0xXXsxfVswLTldezF9fDJbMC0zXXsxfSkoKDpbMC01XXsxfVswLTldezF9KSgoOlswLTVdezF9WzAtOV17MX0pKChcXFxcLlswLTldezEsMn0pKChafChbK3wtXShbMC0xXXsxfVswLTldezF9fDJbMC0zXXsxfSkpKSg6WzAtNV17MX1bMC05XXsxfSk/KT8pPyk/KT8pPyk/KT8kJyxcbiAgQ01JVGltZXNwYW46ICdeUCg/OihbLixcXFxcZF0rKVkpPyg/OihbLixcXFxcZF0rKU0pPyg/OihbLixcXFxcZF0rKVcpPyg/OihbLixcXFxcZF0rKUQpPyg/OlQ/KD86KFsuLFxcXFxkXSspSCk/KD86KFsuLFxcXFxkXSspTSk/KD86KFsuLFxcXFxkXSspUyk/KT8kJyxcbiAgQ01JSW50ZWdlcjogJ15cXFxcZCskJyxcbiAgQ01JU0ludGVnZXI6ICdeLT8oWzAtOV0rKSQnLFxuICBDTUlEZWNpbWFsOiAnXi0/KFswLTldezEsNX0pKFxcXFwuWzAtOV17MSwxOH0pPyQnLFxuICBDTUlJZGVudGlmaWVyOiAnXlxcXFxTezEsMjUwfVthLXpBLVowLTldJCcsXG4gIENNSVNob3J0SWRlbnRpZmllcjogJ15bXFxcXHdcXFxcLlxcXFwtXFxcXF9dezEsMjUwfSQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUxvbmdJZGVudGlmaWVyOiAnXig/Oig/IXVybjopXFxcXFN7MSw0MDAwfXx1cm46W0EtWmEtejAtOS1dezEsMzF9OlxcXFxTezEsNDAwMH18LnsxLDQwMDB9KSQnLCAvLyBuZWVkIHRvIHJlLWV4YW1pbmUgdGhpc1xuICBDTUlGZWVkYmFjazogJ14uKiQnLCAvLyBUaGlzIG11c3QgYmUgcmVkZWZpbmVkXG4gIENNSUluZGV4OiAnWy5fXShcXFxcZCspLicsXG4gIENNSUluZGV4U3RvcmU6ICcuTihcXFxcZCspLicsXG5cbiAgLy8gVm9jYWJ1bGFyeSBEYXRhIFR5cGUgRGVmaW5pdGlvblxuICBDTUlDU3RhdHVzOiAnXihjb21wbGV0ZWR8aW5jb21wbGV0ZXxub3QgYXR0ZW1wdGVkfHVua25vd24pJCcsXG4gIENNSVNTdGF0dXM6ICdeKHBhc3NlZHxmYWlsZWR8dW5rbm93bikkJyxcbiAgQ01JRXhpdDogJ14odGltZS1vdXR8c3VzcGVuZHxsb2dvdXR8bm9ybWFsKSQnLFxuICBDTUlUeXBlOiAnXih0cnVlLWZhbHNlfGNob2ljZXxmaWxsLWlufGxvbmctZmlsbC1pbnxtYXRjaGluZ3xwZXJmb3JtYW5jZXxzZXF1ZW5jaW5nfGxpa2VydHxudW1lcmljfG90aGVyKSQnLFxuICBDTUlSZXN1bHQ6ICdeKGNvcnJlY3R8aW5jb3JyZWN0fHVuYW50aWNpcGF0ZWR8bmV1dHJhbHwtPyhbMC05XXsxLDR9KShcXFxcLlswLTldezEsMTh9KT8pJCcsXG4gIE5BVkV2ZW50OiAnXihwcmV2aW91c3xjb250aW51ZXxleGl0fGV4aXRBbGx8YWJhbmRvbnxhYmFuZG9uQWxsfHN1c3BlbmRBbGx8XFx7dGFyZ2V0PVxcXFxTezAsMjAwfVthLXpBLVowLTldXFx9Y2hvaWNlfGp1bXApJCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgTkFWQm9vbGVhbjogJ14odW5rbm93bnx0cnVlfGZhbHNlJCknLFxuICBOQVZUYXJnZXQ6ICdeKHByZXZpb3VzfGNvbnRpbnVlfGNob2ljZS57dGFyZ2V0PVxcXFxTezAsMjAwfVthLXpBLVowLTldfSkkJyxcblxuICAvLyBEYXRhIHJhbmdlc1xuICBzY2FsZWRfcmFuZ2U6ICctMSMxJyxcbiAgYXVkaW9fcmFuZ2U6ICcwIyonLFxuICBzcGVlZF9yYW5nZTogJzAjKicsXG4gIHRleHRfcmFuZ2U6ICctMSMxJyxcbiAgcHJvZ3Jlc3NfcmFuZ2U6ICcwIzEnLFxufTtcblxuY29uc3QgUmVnZXggPSB7XG4gIGFpY2M6IGFpY2MsXG4gIHNjb3JtMTI6IHNjb3JtMTIsXG4gIHNjb3JtMjAwNDogc2Nvcm0yMDA0LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgUmVnZXg7XG4iLCIvLyBAZmxvd1xuXG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuXG5jb25zdCBzY29ybTEyX2Vycm9ycyA9IEFQSUNvbnN0YW50cy5zY29ybTEyLmVycm9yX2Rlc2NyaXB0aW9ucztcbmNvbnN0IGFpY2NfZXJyb3JzID0gQVBJQ29uc3RhbnRzLmFpY2MuZXJyb3JfZGVzY3JpcHRpb25zO1xuY29uc3Qgc2Nvcm0yMDA0X2Vycm9ycyA9IEFQSUNvbnN0YW50cy5zY29ybTIwMDQuZXJyb3JfZGVzY3JpcHRpb25zO1xuXG4vKipcbiAqIEJhc2UgVmFsaWRhdGlvbiBFeGNlcHRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIFZhbGlkYXRpb25FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIHRvIHRha2UgaW4gYW4gZXJyb3IgbWVzc2FnZSBhbmQgY29kZVxuICAgKiBAcGFyYW0ge251bWJlcn0gZXJyb3JDb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlcnJvck1lc3NhZ2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRldGFpbGVkTWVzc2FnZVxuICAgKi9cbiAgY29uc3RydWN0b3IoZXJyb3JDb2RlOiBudW1iZXIsIGVycm9yTWVzc2FnZTogU3RyaW5nLCBkZXRhaWxlZE1lc3NhZ2U6IFN0cmluZykge1xuICAgIHN1cGVyKGVycm9yTWVzc2FnZSk7XG4gICAgdGhpcy4jZXJyb3JDb2RlID0gZXJyb3JDb2RlO1xuICAgIHRoaXMuI2Vycm9yTWVzc2FnZSA9IGVycm9yTWVzc2FnZTtcbiAgICB0aGlzLiNkZXRhaWxlZE1lc3NhZ2UgPSBkZXRhaWxlZE1lc3NhZ2U7XG4gIH1cblxuICAjZXJyb3JDb2RlO1xuICAjZXJyb3JNZXNzYWdlO1xuICAjZGV0YWlsZWRNZXNzYWdlO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNlcnJvckNvZGVcbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cbiAgZ2V0IGVycm9yQ29kZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jZXJyb3JDb2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2Vycm9yTWVzc2FnZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZXJyb3JNZXNzYWdlKCkge1xuICAgIHJldHVybiB0aGlzLiNlcnJvck1lc3NhZ2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZGV0YWlsZWRNZXNzYWdlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBkZXRhaWxlZE1lc3NhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2RldGFpbGVkTWVzc2FnZTtcbiAgfVxufVxuXG4vKipcbiAqIFNDT1JNIDEuMiBWYWxpZGF0aW9uIEVycm9yXG4gKi9cbmV4cG9ydCBjbGFzcyBTY29ybTEyVmFsaWRhdGlvbkVycm9yIGV4dGVuZHMgVmFsaWRhdGlvbkVycm9yIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIHRvIHRha2UgaW4gYW4gZXJyb3IgY29kZVxuICAgKiBAcGFyYW0ge251bWJlcn0gZXJyb3JDb2RlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlcnJvckNvZGU6IG51bWJlcikge1xuICAgIGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNjb3JtMTJfZXJyb3JzLCBTdHJpbmcoZXJyb3JDb2RlKSkpIHtcbiAgICAgIHN1cGVyKGVycm9yQ29kZSwgc2Nvcm0xMl9lcnJvcnNbU3RyaW5nKGVycm9yQ29kZSldLmJhc2ljTWVzc2FnZSwgc2Nvcm0xMl9lcnJvcnNbU3RyaW5nKGVycm9yQ29kZSldLmRldGFpbE1lc3NhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdXBlcigxMDEsIHNjb3JtMTJfZXJyb3JzWycxMDEnXS5iYXNpY01lc3NhZ2UsIHNjb3JtMTJfZXJyb3JzWycxMDEnXS5kZXRhaWxNZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBSUNDIFZhbGlkYXRpb24gRXJyb3JcbiAqL1xuZXhwb3J0IGNsYXNzIEFJQ0NWYWxpZGF0aW9uRXJyb3IgZXh0ZW5kcyBWYWxpZGF0aW9uRXJyb3Ige1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgdG8gdGFrZSBpbiBhbiBlcnJvciBjb2RlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBlcnJvckNvZGVcbiAgICovXG4gIGNvbnN0cnVjdG9yKGVycm9yQ29kZTogbnVtYmVyKSB7XG4gICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoYWljY19lcnJvcnMsIFN0cmluZyhlcnJvckNvZGUpKSkge1xuICAgICAgc3VwZXIoZXJyb3JDb2RlLCBhaWNjX2Vycm9yc1tTdHJpbmcoZXJyb3JDb2RlKV0uYmFzaWNNZXNzYWdlLCBhaWNjX2Vycm9yc1tTdHJpbmcoZXJyb3JDb2RlKV0uZGV0YWlsTWVzc2FnZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1cGVyKDEwMSwgYWljY19lcnJvcnNbJzEwMSddLmJhc2ljTWVzc2FnZSwgYWljY19lcnJvcnNbJzEwMSddLmRldGFpbE1lc3NhZ2UpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFNDT1JNIDIwMDQgVmFsaWRhdGlvbiBFcnJvclxuICovXG5leHBvcnQgY2xhc3MgU2Nvcm0yMDA0VmFsaWRhdGlvbkVycm9yIGV4dGVuZHMgVmFsaWRhdGlvbkVycm9yIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIHRvIHRha2UgaW4gYW4gZXJyb3IgY29kZVxuICAgKiBAcGFyYW0ge251bWJlcn0gZXJyb3JDb2RlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlcnJvckNvZGU6IG51bWJlcikge1xuICAgIGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNjb3JtMjAwNF9lcnJvcnMsIFN0cmluZyhlcnJvckNvZGUpKSkge1xuICAgICAgc3VwZXIoZXJyb3JDb2RlLCBzY29ybTIwMDRfZXJyb3JzW1N0cmluZyhlcnJvckNvZGUpXS5iYXNpY01lc3NhZ2UsIHNjb3JtMjAwNF9lcnJvcnNbU3RyaW5nKGVycm9yQ29kZSldLmRldGFpbE1lc3NhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdXBlcigxMDEsIHNjb3JtMjAwNF9lcnJvcnNbJzEwMSddLmJhc2ljTWVzc2FnZSwgc2Nvcm0yMDA0X2Vycm9yc1snMTAxJ10uZGV0YWlsTWVzc2FnZSk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgQUlDQyBmcm9tICcuLi9BSUNDJztcblxud2luZG93LkFJQ0MgPSBBSUNDO1xuIiwiLy8gQGZsb3dcbmV4cG9ydCBjb25zdCBTRUNPTkRTX1BFUl9TRUNPTkQgPSAxLjA7XG5leHBvcnQgY29uc3QgU0VDT05EU19QRVJfTUlOVVRFID0gNjA7XG5leHBvcnQgY29uc3QgU0VDT05EU19QRVJfSE9VUiA9IDYwICogU0VDT05EU19QRVJfTUlOVVRFO1xuZXhwb3J0IGNvbnN0IFNFQ09ORFNfUEVSX0RBWSA9IDI0ICogU0VDT05EU19QRVJfSE9VUjtcblxuY29uc3QgZGVzaWduYXRpb25zID0gW1xuICBbJ0QnLCBTRUNPTkRTX1BFUl9EQVldLFxuICBbJ0gnLCBTRUNPTkRTX1BFUl9IT1VSXSxcbiAgWydNJywgU0VDT05EU19QRVJfTUlOVVRFXSxcbiAgWydTJywgU0VDT05EU19QRVJfU0VDT05EXSxcbl07XG5cbi8qKlxuICogQ29udmVydHMgYSBOdW1iZXIgdG8gYSBTdHJpbmcgb2YgSEg6TU06U1NcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gdG90YWxTZWNvbmRzXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZWNvbmRzQXNISE1NU1ModG90YWxTZWNvbmRzOiBOdW1iZXIpIHtcbiAgLy8gU0NPUk0gc3BlYyBkb2VzIG5vdCBkZWFsIHdpdGggbmVnYXRpdmUgZHVyYXRpb25zLCBnaXZlIHplcm8gYmFja1xuICBpZiAoIXRvdGFsU2Vjb25kcyB8fCB0b3RhbFNlY29uZHMgPD0gMCkge1xuICAgIHJldHVybiAnMDA6MDA6MDAnO1xuICB9XG5cbiAgY29uc3QgaG91cnMgPSBNYXRoLmZsb29yKHRvdGFsU2Vjb25kcyAvIFNFQ09ORFNfUEVSX0hPVVIpO1xuXG4gIGNvbnN0IGRhdGVPYmogPSBuZXcgRGF0ZSh0b3RhbFNlY29uZHMgKiAxMDAwKTtcbiAgY29uc3QgbWludXRlcyA9IGRhdGVPYmouZ2V0VVRDTWludXRlcygpO1xuICAvLyBtYWtlIHN1cmUgd2UgYWRkIGFueSBwb3NzaWJsZSBkZWNpbWFsIHZhbHVlXG4gIGNvbnN0IHNlY29uZHMgPSBkYXRlT2JqLmdldFNlY29uZHMoKTtcbiAgY29uc3QgbXMgPSB0b3RhbFNlY29uZHMgJSAxLjA7XG4gIGxldCBtc1N0ciA9ICcnO1xuICBpZiAoY291bnREZWNpbWFscyhtcykgPiAwKSB7XG4gICAgaWYgKGNvdW50RGVjaW1hbHMobXMpID4gMikge1xuICAgICAgbXNTdHIgPSBtcy50b0ZpeGVkKDIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtc1N0ciA9IFN0cmluZyhtcyk7XG4gICAgfVxuICAgIG1zU3RyID0gJy4nICsgbXNTdHIuc3BsaXQoJy4nKVsxXTtcbiAgfVxuXG4gIHJldHVybiAoaG91cnMgKyAnOicgKyBtaW51dGVzICsgJzonICsgc2Vjb25kcykucmVwbGFjZSgvXFxiXFxkXFxiL2csXG4gICAgICAnMCQmJykgKyBtc1N0cjtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgdGhlIG51bWJlciBvZiBzZWNvbmRzIGZyb20gSVNPIDg2MDEgRHVyYXRpb25cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gc2Vjb25kc1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2Vjb25kc0FzSVNPRHVyYXRpb24oc2Vjb25kczogTnVtYmVyKSB7XG4gIC8vIFNDT1JNIHNwZWMgZG9lcyBub3QgZGVhbCB3aXRoIG5lZ2F0aXZlIGR1cmF0aW9ucywgZ2l2ZSB6ZXJvIGJhY2tcbiAgaWYgKCFzZWNvbmRzIHx8IHNlY29uZHMgPD0gMCkge1xuICAgIHJldHVybiAnUFQwUyc7XG4gIH1cblxuICBsZXQgZHVyYXRpb24gPSAnUCc7XG4gIGxldCByZW1haW5kZXIgPSBzZWNvbmRzO1xuXG4gIGRlc2lnbmF0aW9ucy5mb3JFYWNoKChbc2lnbiwgY3VycmVudF9zZWNvbmRzXSkgPT4ge1xuICAgIGxldCB2YWx1ZSA9IE1hdGguZmxvb3IocmVtYWluZGVyIC8gY3VycmVudF9zZWNvbmRzKTtcblxuICAgIHJlbWFpbmRlciA9IHJlbWFpbmRlciAlIGN1cnJlbnRfc2Vjb25kcztcbiAgICBpZiAoY291bnREZWNpbWFscyhyZW1haW5kZXIpID4gMikge1xuICAgICAgcmVtYWluZGVyID0gTnVtYmVyKE51bWJlcihyZW1haW5kZXIpLnRvRml4ZWQoMikpO1xuICAgIH1cbiAgICAvLyBJZiB3ZSBoYXZlIGFueXRoaW5nIGxlZnQgaW4gdGhlIHJlbWFpbmRlciwgYW5kIHdlJ3JlIGN1cnJlbnRseSBhZGRpbmdcbiAgICAvLyBzZWNvbmRzIHRvIHRoZSBkdXJhdGlvbiwgZ28gYWhlYWQgYW5kIGFkZCB0aGUgZGVjaW1hbCB0byB0aGUgc2Vjb25kc1xuICAgIGlmIChzaWduID09PSAnUycgJiYgcmVtYWluZGVyID4gMCkge1xuICAgICAgdmFsdWUgKz0gcmVtYWluZGVyO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgaWYgKChkdXJhdGlvbi5pbmRleE9mKCdEJykgPiAwIHx8XG4gICAgICAgICAgc2lnbiA9PT0gJ0gnIHx8IHNpZ24gPT09ICdNJyB8fCBzaWduID09PSAnUycpICYmXG4gICAgICAgICAgZHVyYXRpb24uaW5kZXhPZignVCcpID09PSAtMSkge1xuICAgICAgICBkdXJhdGlvbiArPSAnVCc7XG4gICAgICB9XG4gICAgICBkdXJhdGlvbiArPSBgJHt2YWx1ZX0ke3NpZ259YDtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBkdXJhdGlvbjtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgdGhlIG51bWJlciBvZiBzZWNvbmRzIGZyb20gSEg6TU06U1MuREREREREXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRpbWVTdHJpbmdcbiAqIEBwYXJhbSB7UmVnRXhwfSB0aW1lUmVnZXhcbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFRpbWVBc1NlY29uZHModGltZVN0cmluZzogU3RyaW5nLCB0aW1lUmVnZXg6IFJlZ0V4cCkge1xuICBpZiAoIXRpbWVTdHJpbmcgfHwgdHlwZW9mIHRpbWVTdHJpbmcgIT09ICdzdHJpbmcnIHx8XG4gICAgICAhdGltZVN0cmluZy5tYXRjaCh0aW1lUmVnZXgpKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgY29uc3QgcGFydHMgPSB0aW1lU3RyaW5nLnNwbGl0KCc6Jyk7XG4gIGNvbnN0IGhvdXJzID0gTnVtYmVyKHBhcnRzWzBdKTtcbiAgY29uc3QgbWludXRlcyA9IE51bWJlcihwYXJ0c1sxXSk7XG4gIGNvbnN0IHNlY29uZHMgPSBOdW1iZXIocGFydHNbMl0pO1xuICByZXR1cm4gKGhvdXJzICogMzYwMCkgKyAobWludXRlcyAqIDYwKSArIHNlY29uZHM7XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlIHRoZSBudW1iZXIgb2Ygc2Vjb25kcyBmcm9tIElTTyA4NjAxIER1cmF0aW9uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGR1cmF0aW9uXG4gKiBAcGFyYW0ge1JlZ0V4cH0gZHVyYXRpb25SZWdleFxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RHVyYXRpb25Bc1NlY29uZHMoZHVyYXRpb246IFN0cmluZywgZHVyYXRpb25SZWdleDogUmVnRXhwKSB7XG4gIGlmICghZHVyYXRpb24gfHwgIWR1cmF0aW9uLm1hdGNoKGR1cmF0aW9uUmVnZXgpKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBjb25zdCBbLCB5ZWFycywgbW9udGhzLCAsIGRheXMsIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzXSA9IG5ldyBSZWdFeHAoXG4gICAgICBkdXJhdGlvblJlZ2V4KS5leGVjKGR1cmF0aW9uKSB8fCBbXTtcblxuICBsZXQgcmVzdWx0ID0gMC4wO1xuXG4gIHJlc3VsdCArPSAoTnVtYmVyKHNlY29uZHMpICogMS4wIHx8IDAuMCk7XG4gIHJlc3VsdCArPSAoTnVtYmVyKG1pbnV0ZXMpICogNjAuMCB8fCAwLjApO1xuICByZXN1bHQgKz0gKE51bWJlcihob3VycykgKiAzNjAwLjAgfHwgMC4wKTtcbiAgcmVzdWx0ICs9IChOdW1iZXIoZGF5cykgKiAoNjAgKiA2MCAqIDI0LjApIHx8IDAuMCk7XG4gIHJlc3VsdCArPSAoTnVtYmVyKHllYXJzKSAqICg2MCAqIDYwICogMjQgKiAzNjUuMCkgfHwgMC4wKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEFkZHMgdG9nZXRoZXIgdHdvIElTTzg2MDEgRHVyYXRpb24gc3RyaW5nc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaXJzdFxuICogQHBhcmFtIHtzdHJpbmd9IHNlY29uZFxuICogQHBhcmFtIHtSZWdFeHB9IGR1cmF0aW9uUmVnZXhcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZFR3b0R1cmF0aW9ucyhcbiAgICBmaXJzdDogU3RyaW5nLFxuICAgIHNlY29uZDogU3RyaW5nLFxuICAgIGR1cmF0aW9uUmVnZXg6IFJlZ0V4cCkge1xuICByZXR1cm4gZ2V0U2Vjb25kc0FzSVNPRHVyYXRpb24oXG4gICAgICBnZXREdXJhdGlvbkFzU2Vjb25kcyhmaXJzdCwgZHVyYXRpb25SZWdleCkgK1xuICAgICAgZ2V0RHVyYXRpb25Bc1NlY29uZHMoc2Vjb25kLCBkdXJhdGlvblJlZ2V4KSxcbiAgKTtcbn1cblxuLyoqXG4gKiBBZGQgdG9nZXRoZXIgdHdvIEhIOk1NOlNTLkREIHN0cmluZ3NcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlyc3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWNvbmRcbiAqIEBwYXJhbSB7UmVnRXhwfSB0aW1lUmVnZXhcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZEhITU1TU1RpbWVTdHJpbmdzKFxuICAgIGZpcnN0OiBTdHJpbmcsXG4gICAgc2Vjb25kOiBTdHJpbmcsXG4gICAgdGltZVJlZ2V4OiBSZWdFeHApIHtcbiAgcmV0dXJuIGdldFNlY29uZHNBc0hITU1TUyhcbiAgICAgIGdldFRpbWVBc1NlY29uZHMoZmlyc3QsIHRpbWVSZWdleCkgK1xuICAgICAgZ2V0VGltZUFzU2Vjb25kcyhcbiAgICAgICAgICBzZWNvbmQsIHRpbWVSZWdleCksXG4gICk7XG59XG5cbi8qKlxuICogRmxhdHRlbiBhIEpTT04gb2JqZWN0IGRvd24gdG8gc3RyaW5nIHBhdGhzIGZvciBlYWNoIHZhbHVlc1xuICogQHBhcmFtIHtvYmplY3R9IGRhdGFcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZsYXR0ZW4oZGF0YSkge1xuICBjb25zdCByZXN1bHQgPSB7fTtcblxuICAvKipcbiAgICogUmVjdXJzZSB0aHJvdWdoIHRoZSBvYmplY3RcbiAgICogQHBhcmFtIHsqfSBjdXJcbiAgICogQHBhcmFtIHsqfSBwcm9wXG4gICAqL1xuICBmdW5jdGlvbiByZWN1cnNlKGN1ciwgcHJvcCkge1xuICAgIGlmIChPYmplY3QoY3VyKSAhPT0gY3VyKSB7XG4gICAgICByZXN1bHRbcHJvcF0gPSBjdXI7XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGN1cikpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gY3VyLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICByZWN1cnNlKGN1cltpXSwgcHJvcCArICdbJyArIGkgKyAnXScpO1xuICAgICAgICBpZiAobCA9PT0gMCkgcmVzdWx0W3Byb3BdID0gW107XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBpc0VtcHR5ID0gdHJ1ZTtcbiAgICAgIGZvciAoY29uc3QgcCBpbiBjdXIpIHtcbiAgICAgICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoY3VyLCBwKSkge1xuICAgICAgICAgIGlzRW1wdHkgPSBmYWxzZTtcbiAgICAgICAgICByZWN1cnNlKGN1cltwXSwgcHJvcCA/IHByb3AgKyAnLicgKyBwIDogcCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChpc0VtcHR5ICYmIHByb3ApIHJlc3VsdFtwcm9wXSA9IHt9O1xuICAgIH1cbiAgfVxuXG4gIHJlY3Vyc2UoZGF0YSwgJycpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIFVuLWZsYXR0ZW4gYSBmbGF0IEpTT04gb2JqZWN0XG4gKiBAcGFyYW0ge29iamVjdH0gZGF0YVxuICogQHJldHVybiB7b2JqZWN0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gdW5mbGF0dGVuKGRhdGEpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICBpZiAoT2JqZWN0KGRhdGEpICE9PSBkYXRhIHx8IEFycmF5LmlzQXJyYXkoZGF0YSkpIHJldHVybiBkYXRhO1xuICBjb25zdCByZWdleCA9IC9cXC4/KFteLltcXF1dKyl8XFxbKFxcZCspXS9nO1xuICBjb25zdCByZXN1bHQgPSB7fTtcbiAgZm9yIChjb25zdCBwIGluIGRhdGEpIHtcbiAgICBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBwKSkge1xuICAgICAgbGV0IGN1ciA9IHJlc3VsdDtcbiAgICAgIGxldCBwcm9wID0gJyc7XG4gICAgICBsZXQgbSA9IHJlZ2V4LmV4ZWMocCk7XG4gICAgICB3aGlsZSAobSkge1xuICAgICAgICBjdXIgPSBjdXJbcHJvcF0gfHwgKGN1cltwcm9wXSA9IChtWzJdID8gW10gOiB7fSkpO1xuICAgICAgICBwcm9wID0gbVsyXSB8fCBtWzFdO1xuICAgICAgICBtID0gcmVnZXguZXhlYyhwKTtcbiAgICAgIH1cbiAgICAgIGN1cltwcm9wXSA9IGRhdGFbcF07XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHRbJyddIHx8IHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDb3VudHMgdGhlIG51bWJlciBvZiBkZWNpbWFsIHBsYWNlc1xuICogQHBhcmFtIHtudW1iZXJ9IG51bVxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gY291bnREZWNpbWFscyhudW06IG51bWJlcikge1xuICBpZiAoTWF0aC5mbG9vcihudW0pID09PSBudW0gfHwgU3RyaW5nKG51bSkuaW5kZXhPZignLicpIDwgMCkgcmV0dXJuIDA7XG4gIGNvbnN0IHBhcnRzID0gbnVtLnRvU3RyaW5nKCkuc3BsaXQoJy4nKVsxXTtcbiAgcmV0dXJuIHBhcnRzLmxlbmd0aCB8fCAwO1xufVxuIl19
