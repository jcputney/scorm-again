(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Scorm12API2 = _interopRequireDefault(require("./Scorm12API"));

var _aicc_cmi = require("./cmi/aicc_cmi");

var _scorm12_cmi = require("./cmi/scorm12_cmi");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

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

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

var global_constants = _api_constants["default"].global;
var scorm12_error_codes = _error_codes2["default"].scorm12;
/**
 * Base API class for AICC, SCORM 1.2, and SCORM 2004. Should be considered
 * abstract, and never initialized on it's own.
 */

var _timeout = new WeakMap();

var _error_codes = new WeakMap();

var _settings = new WeakMap();

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
        responseHandler: function responseHandler(xhr) {
          var result;

          if (typeof xhr !== 'undefined') {
            result = JSON.parse(xhr.responseText);

            if (result === null || !{}.hasOwnProperty.call(result, 'result')) {
              result = {};

              if (xhr.status === 200) {
                result.result = global_constants.SCORM_TRUE;
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
    key: "terminate",

    /**
     * Terminates the current run of the API
     * @param {string} callbackName
     * @param {boolean} checkTerminated
     * @return {string}
     */
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
        returnValue = this.getCMIValue(CMIElement);
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
     * @param {boolean} checkTerminated
     * @param {string} CMIElement
     * @param {*} value
     * @return {string}
     */

  }, {
    key: "setValue",
    value: function setValue(callbackName, checkTerminated, CMIElement, value) {
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
          this.scheduleCommit(this.settings.autocommitSeconds * 1000);
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
            if (this.stringMatches(CMIElement, '\\.correct_responses\\.\\d+')) {
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
      this.loadFromJSON((0, _utilities.unflatten)(json), CMIElement);
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

      var process = function process(url, params, settings, error_codes) {
        var genericError = {
          'result': global_constants.SCORM_FALSE,
          'errorCode': error_codes.GENERAL
        };
        var result;

        if (!settings.sendBeaconCommit) {
          var httpReq = new XMLHttpRequest();
          httpReq.open('POST', url, settings.asyncCommit);

          try {
            if (params instanceof Array) {
              httpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
              httpReq.send(params.join('&'));
            } else {
              httpReq.setRequestHeader('Content-Type', settings.commitRequestDataType);
              httpReq.send(JSON.stringify(params));
            }

            if (typeof settings.responseHandler === 'function') {
              result = settings.responseHandler(httpReq);
            } else {
              result = JSON.parse(httpReq.responseText);
            }
          } catch (e) {
            console.error(e);
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
            return genericError;
          }
        }

        if (typeof result === 'undefined') {
          return genericError;
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
     */

  }, {
    key: "scheduleCommit",
    value: function scheduleCommit(when) {
      _classPrivateFieldSet(this, _timeout, new ScheduledCommit(this, when));

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
  }]);

  return BaseAPI;
}();
/**
 * Private class that wraps a timeout call to the commit() function
 */


exports["default"] = BaseAPI;

var _API = new WeakMap();

var _cancelled = new WeakMap();

var _timeout2 = new WeakMap();

var ScheduledCommit = /*#__PURE__*/function () {
  /**
   * Constructor for ScheduledCommit
   * @param {BaseAPI} API
   * @param {number} when
   */
  function ScheduledCommit(API, when) {
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

    _classPrivateFieldSet(this, _API, API);

    _classPrivateFieldSet(this, _timeout2, setTimeout(this.wrapper.bind(this), when));
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
        _classPrivateFieldGet(this, _API).commit();
      }
    }
  }]);

  return ScheduledCommit;
}();

},{"./cmi/common":7,"./constants/api_constants":10,"./constants/error_codes":11,"./exceptions":15,"./utilities":17,"lodash.debounce":1}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _BaseAPI2 = _interopRequireDefault(require("./BaseAPI"));

var _scorm12_cmi = require("./cmi/scorm12_cmi");

var Utilities = _interopRequireWildcard(require("./utilities"));

var _api_constants = _interopRequireDefault(require("./constants/api_constants"));

var _error_codes = _interopRequireDefault(require("./constants/error_codes"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

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

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

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
      var result = this.terminate('LMSFinish', false);

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
      return this.setValue('LMSSetValue', false, CMIElement, value);
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
     * @param {boolean }detail
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

      var commitObject = this.renderCommitCMI(terminateCommit);

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

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var scorm2004_constants = _api_constants["default"].scorm2004;
var global_constants = _api_constants["default"].global;
var scorm2004_error_codes = _error_codes["default"].scorm2004;
var correct_responses = _response_constants["default"].correct;
var scorm2004_regex = _regex["default"].scorm2004;
/**
 * API class for SCORM 2004
 */

var _version = new WeakMap();

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
    key: "lmsInitialize",

    /**
     * @return {string} bool
     */
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
      return this.setValue('SetValue', true, CMIElement, value);
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

        if (!interaction.type) {
          this.throwSCORMError(scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED);
        } else {
          var interaction_type = interaction.type;
          var interaction_count = interaction.correct_responses._count;

          if (interaction_type === 'choice') {
            for (var i = 0; i < interaction_count && this.lastErrorCode === 0; i++) {
              var response = interaction.correct_responses.childArray[i];

              if (response.pattern === value) {
                this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE);
              }
            }
          }

          var response_type = correct_responses[interaction_type];

          if (response_type) {
            var nodes = [];

            if (response_type === null || response_type === void 0 ? void 0 : response_type.delimiter) {
              nodes = String(value).split(response_type.delimiter);
            } else {
              nodes[0] = value;
            }

            if (nodes.length > 0 && nodes.length <= response_type.max) {
              this.checkCorrectResponseValue(interaction_type, nodes, value);
            } else if (nodes.length > response_type.max) {
              this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE, 'Data Model Element Pattern Too Long');
            }
          } else {
            this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE, 'Incorrect Response Type: ' + interaction_type);
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
      var interaction_type = interaction.type;
      var interaction_count = interaction.correct_responses._count;

      if (interaction_type === 'choice') {
        for (var i = 0; i < interaction_count && this.lastErrorCode === 0; i++) {
          var response = interaction.correct_responses.childArray[i];

          if (response.pattern === value) {
            this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE);
          }
        }
      }

      var response_type = correct_responses[interaction_type];

      if (typeof response_type.limit === 'undefined' || interaction_count <= response_type.limit) {
        var nodes = [];

        if (response_type === null || response_type === void 0 ? void 0 : response_type.delimiter) {
          nodes = String(value).split(response_type.delimiter);
        } else {
          nodes[0] = value;
        }

        if (nodes.length > 0 && nodes.length <= response_type.max) {
          this.checkCorrectResponseValue(interaction_type, nodes, value);
        } else if (nodes.length > response_type.max) {
          this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE, 'Data Model Element Pattern Too Long');
        }

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

    /**
     * Checks for a valid correct_response value
     * @param {string} interaction_type
     * @param {Array} nodes
     * @param {*} value
     */
    value: function checkCorrectResponseValue(interaction_type, nodes, value) {
      var response = correct_responses[interaction_type];
      var formatRegex = new RegExp(response.format);

      for (var i = 0; i < nodes.length && this.lastErrorCode === 0; i++) {
        if (interaction_type.match('^(fill-in|long-fill-in|matching|performance|sequencing)$')) {
          nodes[i] = this.removeCorrectResponsePrefixes(nodes[i]);
        }

        if (response === null || response === void 0 ? void 0 : response.delimiter2) {
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

      var commitObject = this.renderCommitCMI(terminateCommit);

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
  }, {
    key: "version",
    get: function get() {
      return _classPrivateFieldGet(this, _version);
    }
  }]);

  return Scorm2004API;
}(_BaseAPI2["default"]);

exports["default"] = Scorm2004API;

},{"./BaseAPI":3,"./cmi/scorm2004_cmi":9,"./constants/api_constants":10,"./constants/error_codes":11,"./constants/language_constants":12,"./constants/regex":13,"./constants/response_constants":14,"./utilities":17}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CMIEvaluationCommentsObject = exports.CMIAttemptRecordsObject = exports.CMIAttemptRecords = exports.CMITriesObject = exports.CMITries = exports.CMIPathsObject = exports.CMIPaths = exports.CMIStudentDemographics = exports.CMI = void 0;

var Scorm12CMI = _interopRequireWildcard(require("./scorm12_cmi"));

var _common = require("./common");

var _api_constants = _interopRequireDefault(require("../constants/api_constants"));

var _regex = _interopRequireDefault(require("../constants/regex"));

var _error_codes = _interopRequireDefault(require("../constants/error_codes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

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

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var aicc_constants = _api_constants["default"].aicc;
var aicc_regex = _regex["default"].aicc;
var scorm12_error_codes = _error_codes["default"].scorm12;
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

    return _super3.call(this, aicc_constants.comments_children, scorm12_error_codes.INVALID_SET_VALUE);
  }

  return CMIEvaluationComments;
}(_common.CMIArray);
/**
 * StudentPreferences class for AICC
 */


var _lesson_type = new WeakMap();

var _text_color = new WeakMap();

var _text_location = new WeakMap();

var _text_size = new WeakMap();

var _video = new WeakMap();

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
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
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
    key: "toJSON",

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
  }, {
    key: "lesson_type",

    /**
     * Getter for #lesson_type
     * @return {string}
     */
    get: function get() {
      return _classPrivateFieldGet(this, _lesson_type);
    }
    /**
     * Setter for #lesson_type
     * @param {string} lesson_type
     */
    ,
    set: function set(lesson_type) {
      if ((0, Scorm12CMI.check12ValidFormat)(lesson_type, aicc_regex.CMIString256)) {
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
      if ((0, Scorm12CMI.check12ValidFormat)(text_color, aicc_regex.CMIString256)) {
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
      if ((0, Scorm12CMI.check12ValidFormat)(text_location, aicc_regex.CMIString256)) {
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
      if ((0, Scorm12CMI.check12ValidFormat)(text_size, aicc_regex.CMIString256)) {
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
      if ((0, Scorm12CMI.check12ValidFormat)(video, aicc_regex.CMIString256)) {
        _classPrivateFieldSet(this, _video, video);
      }
    }
  }]);

  return AICCStudentPreferences;
}(Scorm12CMI.CMIStudentPreference);
/**
 * StudentData class for AICC
 */


var _tries_during_lesson = new WeakMap();

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
    key: "toJSON",

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
  }, {
    key: "tries_during_lesson",

    /**
     * Getter for tries_during_lesson
     * @return {string}
     */
    get: function get() {
      return _classPrivateFieldGet(this, _tries_during_lesson);
    }
    /**
     * Setter for #tries_during_lesson. Sets an error if trying to set after
     *  initialization.
     * @param {string} tries_during_lesson
     */
    ,
    set: function set(tries_during_lesson) {
      !this.initialized ? _classPrivateFieldSet(this, _tries_during_lesson, tries_during_lesson) : (0, Scorm12CMI.throwReadOnlyError)();
    }
  }]);

  return AICCCMIStudentData;
}(Scorm12CMI.CMIStudentData);
/**
 * Class representing the AICC cmi.student_demographics object
 */


var _children = new WeakMap();

var _city = new WeakMap();

var _class = new WeakMap();

var _company = new WeakMap();

var _country = new WeakMap();

var _experience = new WeakMap();

var _familiar_name = new WeakMap();

var _instructor_name = new WeakMap();

var _title = new WeakMap();

var _native_language = new WeakMap();

var _state = new WeakMap();

var _street_address = new WeakMap();

var _telephone = new WeakMap();

var _years_experience = new WeakMap();

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
    key: "toJSON",

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
  }, {
    key: "city",

    /**
     * Getter for city
     * @return {string}
     */
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
      !this.initialized ? _classPrivateFieldSet(this, _city, city) : (0, Scorm12CMI.throwReadOnlyError)();
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
      !this.initialized ? _classPrivateFieldSet(this, _class, clazz) : (0, Scorm12CMI.throwReadOnlyError)();
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
      !this.initialized ? _classPrivateFieldSet(this, _company, company) : (0, Scorm12CMI.throwReadOnlyError)();
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
      !this.initialized ? _classPrivateFieldSet(this, _country, country) : (0, Scorm12CMI.throwReadOnlyError)();
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
      !this.initialized ? _classPrivateFieldSet(this, _experience, experience) : (0, Scorm12CMI.throwReadOnlyError)();
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
      !this.initialized ? _classPrivateFieldSet(this, _familiar_name, familiar_name) : (0, Scorm12CMI.throwReadOnlyError)();
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
      !this.initialized ? _classPrivateFieldSet(this, _instructor_name, instructor_name) : (0, Scorm12CMI.throwReadOnlyError)();
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
      !this.initialized ? _classPrivateFieldSet(this, _title, title) : (0, Scorm12CMI.throwReadOnlyError)();
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
      !this.initialized ? _classPrivateFieldSet(this, _native_language, native_language) : (0, Scorm12CMI.throwReadOnlyError)();
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
      !this.initialized ? _classPrivateFieldSet(this, _state, state) : (0, Scorm12CMI.throwReadOnlyError)();
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
      !this.initialized ? _classPrivateFieldSet(this, _street_address, street_address) : (0, Scorm12CMI.throwReadOnlyError)();
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
      !this.initialized ? _classPrivateFieldSet(this, _telephone, telephone) : (0, Scorm12CMI.throwReadOnlyError)();
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
      !this.initialized ? _classPrivateFieldSet(this, _years_experience, years_experience) : (0, Scorm12CMI.throwReadOnlyError)();
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

    return _super7.call(this, aicc_constants.paths_children);
  }

  return CMIPaths;
}(_common.CMIArray);
/**
 * Class for AICC Paths
 */


exports.CMIPaths = CMIPaths;

var _location_id = new WeakMap();

var _date = new WeakMap();

var _time = new WeakMap();

var _status = new WeakMap();

var _why_left = new WeakMap();

var _time_in_element = new WeakMap();

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
    key: "toJSON",

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
  }, {
    key: "location_id",

    /**
     * Getter for #location_id
     * @return {string}
     */
    get: function get() {
      return _classPrivateFieldGet(this, _location_id);
    }
    /**
     * Setter for #location_id
     * @param {string} location_id
     */
    ,
    set: function set(location_id) {
      if ((0, Scorm12CMI.check12ValidFormat)(location_id, aicc_regex.CMIString256)) {
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
      if ((0, Scorm12CMI.check12ValidFormat)(date, aicc_regex.CMIString256)) {
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
      if ((0, Scorm12CMI.check12ValidFormat)(time, aicc_regex.CMITime)) {
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
      if ((0, Scorm12CMI.check12ValidFormat)(status, aicc_regex.CMIStatus2)) {
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
      if ((0, Scorm12CMI.check12ValidFormat)(why_left, aicc_regex.CMIString256)) {
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
      if ((0, Scorm12CMI.check12ValidFormat)(time_in_element, aicc_regex.CMITime)) {
        _classPrivateFieldSet(this, _time_in_element, time_in_element);
      }
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

    return _super9.call(this, aicc_constants.tries_children);
  }

  return CMITries;
}(_common.CMIArray);
/**
 * Class for AICC Tries
 */


exports.CMITries = CMITries;

var _status2 = new WeakMap();

var _time2 = new WeakMap();

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
      invalidErrorCode: scorm12_error_codes.INVALID_SET_VALUE,
      invalidTypeCode: scorm12_error_codes.TYPE_MISMATCH,
      invalidRangeCode: scorm12_error_codes.VALUE_OUT_OF_RANGE
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
    key: "toJSON",

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
  }, {
    key: "status",

    /**
     * Getter for #status
     * @return {string}
     */
    get: function get() {
      return _classPrivateFieldGet(this, _status2);
    }
    /**
     * Setter for #status
     * @param {string} status
     */
    ,
    set: function set(status) {
      if ((0, Scorm12CMI.check12ValidFormat)(status, aicc_regex.CMIStatus2)) {
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
      if ((0, Scorm12CMI.check12ValidFormat)(time, aicc_regex.CMITime)) {
        _classPrivateFieldSet(this, _time2, time);
      }
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

    return _super11.call(this, aicc_constants.attempt_records_children);
  }

  return CMIAttemptRecords;
}(_common.CMIArray);
/**
 * Class for AICC Attempt Records
 */


exports.CMIAttemptRecords = CMIAttemptRecords;

var _lesson_status = new WeakMap();

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
      invalidErrorCode: scorm12_error_codes.INVALID_SET_VALUE,
      invalidTypeCode: scorm12_error_codes.TYPE_MISMATCH,
      invalidRangeCode: scorm12_error_codes.VALUE_OUT_OF_RANGE
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
    key: "toJSON",

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
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'lesson_status': this.lesson_status,
        'score': this.score
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "lesson_status",

    /**
     * Getter for #lesson_status
     * @return {string}
     */
    get: function get() {
      return _classPrivateFieldGet(this, _lesson_status);
    }
    /**
     * Setter for #lesson_status
     * @param {string} lesson_status
     */
    ,
    set: function set(lesson_status) {
      if ((0, Scorm12CMI.check12ValidFormat)(lesson_status, aicc_regex.CMIStatus2)) {
        _classPrivateFieldSet(this, _lesson_status, lesson_status);
      }
    }
  }]);

  return CMIAttemptRecordsObject;
}(_common.BaseCMI);
/**
 * Class for AICC Evaluation Comments
 */


exports.CMIAttemptRecordsObject = CMIAttemptRecordsObject;

var _content = new WeakMap();

var _location = new WeakMap();

var _time3 = new WeakMap();

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
    key: "toJSON",

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
  }, {
    key: "content",

    /**
     * Getter for #content
     * @return {string}
     */
    get: function get() {
      return _classPrivateFieldGet(this, _content);
    }
    /**
     * Setter for #content
     * @param {string} content
     */
    ,
    set: function set(content) {
      if ((0, Scorm12CMI.check12ValidFormat)(content, aicc_regex.CMIString256)) {
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
      if ((0, Scorm12CMI.check12ValidFormat)(location, aicc_regex.CMIString256)) {
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
      if ((0, Scorm12CMI.check12ValidFormat)(time, aicc_regex.CMITime)) {
        _classPrivateFieldSet(this, _time3, time);
      }
    }
  }]);

  return CMIEvaluationCommentsObject;
}(_common.BaseCMI);

exports.CMIEvaluationCommentsObject = CMIEvaluationCommentsObject;

},{"../constants/api_constants":10,"../constants/error_codes":11,"../constants/regex":13,"./common":7,"./scorm12_cmi":8}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkValidFormat = checkValidFormat;
exports.checkValidRange = checkValidRange;
exports.CMIArray = exports.CMIScore = exports.BaseCMI = void 0;

var _api_constants = _interopRequireDefault(require("../constants/api_constants"));

var _error_codes = _interopRequireDefault(require("../constants/error_codes"));

var _exceptions = require("../exceptions");

var _regex = _interopRequireDefault(require("../constants/regex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var scorm12_constants = _api_constants["default"].scorm12;
var scorm12_regex = _regex["default"].scorm12;
var scorm12_error_codes = _error_codes["default"].scorm12;
/**
 * Check if the value matches the proper format. If not, throw proper error code.
 *
 * @param {string} value
 * @param {string} regexPattern
 * @param {number} errorCode
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */

function checkValidFormat(value, regexPattern, errorCode, allowEmptyString) {
  var formatRegex = new RegExp(regexPattern);
  var matches = value.match(formatRegex);

  if (allowEmptyString && value === '') {
    return true;
  }

  if (value === undefined || !matches || matches[0] === '') {
    throw new _exceptions.ValidationError(errorCode);
  }

  return true;
}
/**
 * Check if the value matches the proper range. If not, throw proper error code.
 *
 * @param {*} value
 * @param {string} rangePattern
 * @param {number} errorCode
 * @return {boolean}
 */


function checkValidRange(value, rangePattern, errorCode) {
  var ranges = rangePattern.split('#');
  value = value * 1.0;

  if (value >= ranges[0]) {
    if (ranges[1] === '*' || value <= ranges[1]) {
      return true;
    } else {
      throw new _exceptions.ValidationError(errorCode);
    }
  } else {
    throw new _exceptions.ValidationError(errorCode);
  }
}
/**
 * Base class for API cmi objects
 */


var _initialized = new WeakMap();

var _start_time = new WeakMap();

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
    key: "initialize",

    /**
     * Called when the API has been initialized after the CMI has been created
     */
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
  }, {
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
  }]);

  return BaseCMI;
}();
/**
 * Base class for cmi *.score objects
 */


exports.BaseCMI = BaseCMI;

var _children2 = new WeakMap();

var _score_range = new WeakMap();

var _invalid_error_code = new WeakMap();

var _invalid_type_code = new WeakMap();

var _invalid_range_code = new WeakMap();

var _decimal_regex = new WeakMap();

var _raw = new WeakMap();

var _min = new WeakMap();

var _max = new WeakMap();

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
   */
  function CMIScore(_ref) {
    var _this;

    var score_children = _ref.score_children,
        score_range = _ref.score_range,
        max = _ref.max,
        invalidErrorCode = _ref.invalidErrorCode,
        invalidTypeCode = _ref.invalidTypeCode,
        invalidRangeCode = _ref.invalidRangeCode,
        decimalRegex = _ref.decimalRegex;

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

    return _this;
  }

  _createClass(CMIScore, [{
    key: "toJSON",

    /**
     * toJSON for *.score
     * @return {{min: string, max: string, raw: string}}
     */
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
  }, {
    key: "_children",

    /**
     * Getter for _children
     * @return {string}
     * @private
     */
    get: function get() {
      return _classPrivateFieldGet(this, _children2);
    }
    /**
     * Setter for _children. Just throws an error.
     * @param {string} _children
     * @private
     */
    ,
    set: function set(_children) {
      throw new _exceptions.ValidationError(_classPrivateFieldGet(this, _invalid_error_code));
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
      if (checkValidFormat(raw, _classPrivateFieldGet(this, _decimal_regex), _classPrivateFieldGet(this, _invalid_type_code)) && (!_classPrivateFieldGet(this, _score_range) || checkValidRange(raw, _classPrivateFieldGet(this, _score_range), _classPrivateFieldGet(this, _invalid_range_code)))) {
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
      if (checkValidFormat(min, _classPrivateFieldGet(this, _decimal_regex), _classPrivateFieldGet(this, _invalid_type_code)) && (!_classPrivateFieldGet(this, _score_range) || checkValidRange(min, _classPrivateFieldGet(this, _score_range), _classPrivateFieldGet(this, _invalid_range_code)))) {
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
      if (checkValidFormat(max, _classPrivateFieldGet(this, _decimal_regex), _classPrivateFieldGet(this, _invalid_type_code)) && (!_classPrivateFieldGet(this, _score_range) || checkValidRange(max, _classPrivateFieldGet(this, _score_range), _classPrivateFieldGet(this, _invalid_range_code)))) {
        _classPrivateFieldSet(this, _max, max);
      }
    }
  }]);

  return CMIScore;
}(BaseCMI);
/**
 * Base class for cmi *.n objects
 */


exports.CMIScore = CMIScore;

var _errorCode = new WeakMap();

var _children3 = new WeakMap();

var CMIArray = /*#__PURE__*/function (_BaseCMI2) {
  _inherits(CMIArray, _BaseCMI2);

  var _super2 = _createSuper(CMIArray);

  /**
   * Constructor cmi *.n arrays
   * @param {string} children
   * @param {number} errorCode
   */
  function CMIArray(_ref2) {
    var _this2;

    var children = _ref2.children,
        errorCode = _ref2.errorCode;

    _classCallCheck(this, CMIArray);

    _this2 = _super2.call(this);

    _errorCode.set(_assertThisInitialized(_this2), {
      writable: true,
      value: void 0
    });

    _children3.set(_assertThisInitialized(_this2), {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(_assertThisInitialized(_this2), _children3, children);

    _classPrivateFieldSet(_assertThisInitialized(_this2), _errorCode, errorCode);

    _this2.childArray = [];
    return _this2;
  }

  _createClass(CMIArray, [{
    key: "toJSON",

    /**
     * toJSON for *.n arrays
     * @return {object}
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {};

      for (var i = 0; i < this.childArray.length; i++) {
        result[i + ''] = this.childArray[i];
      }

      delete this.jsonString;
      return result;
    }
  }, {
    key: "_children",

    /**
     * Getter for _children
     * @return {*}
     */
    get: function get() {
      return _classPrivateFieldGet(this, _children3);
    }
    /**
     * Setter for _children. Just throws an error.
     * @param {string} _children
     */
    ,
    set: function set(_children) {
      throw new _exceptions.ValidationError(_classPrivateFieldGet(this, _errorCode));
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
      throw new _exceptions.ValidationError(_classPrivateFieldGet(this, _errorCode));
    }
  }]);

  return CMIArray;
}(BaseCMI);

exports.CMIArray = CMIArray;

},{"../constants/api_constants":10,"../constants/error_codes":11,"../constants/regex":13,"../exceptions":15}],8:[function(require,module,exports){
"use strict";

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

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

var scorm12_constants = _api_constants["default"].scorm12;
var scorm12_regex = _regex["default"].scorm12;
var scorm12_error_codes = _error_codes["default"].scorm12;
/**
 * Helper method for throwing Read Only error
 */

function throwReadOnlyError() {
  throw new _exceptions.ValidationError(scorm12_error_codes.READ_ONLY_ELEMENT);
}
/**
 * Helper method for throwing Write Only error
 */


function throwWriteOnlyError() {
  throw new _exceptions.ValidationError(scorm12_error_codes.WRITE_ONLY_ELEMENT);
}
/**
 * Helper method for throwing Invalid Set error
 */


function throwInvalidValueError() {
  throw new _exceptions.ValidationError(scorm12_error_codes.INVALID_SET_VALUE);
}
/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} regexPattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */


function check12ValidFormat(value, regexPattern, allowEmptyString) {
  return (0, _common.checkValidFormat)(value, regexPattern, scorm12_error_codes.TYPE_MISMATCH, allowEmptyString);
}
/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} rangePattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */


function check12ValidRange(value, rangePattern, allowEmptyString) {
  return (0, _common.checkValidRange)(value, rangePattern, scorm12_error_codes.VALUE_OUT_OF_RANGE, allowEmptyString);
}
/**
 * Class representing the cmi object for SCORM 1.2
 */


var _children2 = new WeakMap();

var _version2 = new WeakMap();

var _launch_data = new WeakMap();

var _comments = new WeakMap();

var _comments_from_lms = new WeakMap();

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
    key: "getCurrentTotalTime",

    /**
     * Adds the current session time to the existing total time.
     *
     * @return {string}
     */
    value: function getCurrentTotalTime() {
      return this.core.getCurrentTotalTime(this.start_time);
    }
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
      if (check12ValidFormat(comments, scorm12_regex.CMIString4096)) {
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
  }]);

  return CMI;
}(_common.BaseCMI);
/**
 * Class representing the cmi.core object
 * @extends BaseCMI
 */


exports.CMI = CMI;

var _children3 = new WeakMap();

var _student_id = new WeakMap();

var _student_name = new WeakMap();

var _lesson_location = new WeakMap();

var _credit = new WeakMap();

var _lesson_status = new WeakMap();

var _entry = new WeakMap();

var _total_time = new WeakMap();

var _lesson_mode = new WeakMap();

var _exit = new WeakMap();

var _session_time = new WeakMap();

var _suspend_data = new WeakMap();

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
      invalidRangeCode: scorm12_error_codes.VALUE_OUT_OF_RANGE
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
    key: "getCurrentTotalTime",

    /**
     * Adds the current session time to the existing total time.
     * @param {Number} start_time
     * @return {string}
     */
    value: function getCurrentTotalTime(start_time) {
      var sessionTime = _classPrivateFieldGet(this, _session_time);

      var startTime = start_time;

      if (typeof startTime !== 'undefined' || startTime === null) {
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
  }, {
    key: "_children",

    /**
     * Getter for #_children
     * @return {string}
     * @private
     */
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
      if (check12ValidFormat(lesson_status, scorm12_regex.CMIStatus)) {
        _classPrivateFieldSet(this, _lesson_status, lesson_status);
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
      errorCode: scorm12_error_codes.INVALID_SET_VALUE
    });
  }

  return CMIObjectives;
}(_common.CMIArray);
/**
 * Class representing SCORM 1.2's cmi.student_data object
 * @extends BaseCMI
 */


var _children4 = new WeakMap();

var _mastery_score = new WeakMap();

var _max_time_allowed = new WeakMap();

var _time_limit_action = new WeakMap();

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
    key: "toJSON",

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
  }, {
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
  }]);

  return CMIStudentData;
}(_common.BaseCMI);
/**
 * Class representing SCORM 1.2's cmi.student_preference object
 * @extends BaseCMI
 */


exports.CMIStudentData = CMIStudentData;

var _children5 = new WeakMap();

var _audio = new WeakMap();

var _language = new WeakMap();

var _speed = new WeakMap();

var _text = new WeakMap();

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
    key: "toJSON",

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
  }, {
    key: "_children",

    /**
     * Getter for #_children
     * @return {string}
     * @private
     */
    get: function get() {
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
      errorCode: scorm12_error_codes.INVALID_SET_VALUE
    });
  }

  return CMIInteractions;
}(_common.CMIArray);
/**
 * Class representing SCORM 1.2's cmi.interactions.n object
 * @extends BaseCMI
 */


var _id = new WeakMap();

var _time = new WeakMap();

var _type = new WeakMap();

var _weighting = new WeakMap();

var _student_response = new WeakMap();

var _result = new WeakMap();

var _latency = new WeakMap();

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
      children: scorm12_constants.objectives_children
    });
    _this5.correct_responses = new _common.CMIArray({
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
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
    key: "toJSON",

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
  }, {
    key: "id",

    /**
     * Getter for #id. Should only be called during JSON export.
     * @return {*}
     */
    get: function get() {
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
  }]);

  return CMIInteractionsObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 1.2's cmi.objectives.n object
 * @extends BaseCMI
 */


exports.CMIInteractionsObject = CMIInteractionsObject;

var _id2 = new WeakMap();

var _status = new WeakMap();

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
      invalidRangeCode: scorm12_error_codes.VALUE_OUT_OF_RANGE
    });
    return _this6;
  }

  _createClass(CMIObjectivesObject, [{
    key: "toJSON",

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
  }, {
    key: "id",

    /**
     * Getter for #id
     * @return {""}
     */
    get: function get() {
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
  }]);

  return CMIObjectivesObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 1.2's cmi.interactions.n.objectives.n object
 * @extends BaseCMI
 */


exports.CMIObjectivesObject = CMIObjectivesObject;

var _id3 = new WeakMap();

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
    key: "toJSON",

    /**
     * toJSON for cmi.interactions.n.objectives.n
     * @return {
     *    {
     *      id: string
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'id': this.id
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "id",

    /**
     * Getter for #id
     * @return {""}
     */
    get: function get() {
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
  }]);

  return CMIInteractionsObjectivesObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 1.2's cmi.interactions.correct_responses.n object
 * @extends BaseCMI
 */


exports.CMIInteractionsObjectivesObject = CMIInteractionsObjectivesObject;

var _pattern = new WeakMap();

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
    key: "toJSON",

    /**
     * toJSON for cmi.interactions.correct_responses.n
     * @return {
     *    {
     *      pattern: string
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'pattern': this.pattern
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "pattern",

    /**
     * Getter for #pattern
     * @return {string}
     */
    get: function get() {
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
  }]);

  return CMIInteractionsCorrectResponsesObject;
}(_common.BaseCMI);
/**
 * Class for AICC Navigation object
 */


exports.CMIInteractionsCorrectResponsesObject = CMIInteractionsCorrectResponsesObject;

var _event = new WeakMap();

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
    key: "toJSON",

    /**
     * toJSON for nav object
     * @return {
     *    {
     *      event: string
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'event': this.event
      };
      delete this.jsonString;
      return result;
    }
  }, {
    key: "event",

    /**
     * Getter for #event
     * @return {string}
     */
    get: function get() {
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
  }]);

  return NAV;
}(_common.BaseCMI);

exports.NAV = NAV;

},{"../constants/api_constants":10,"../constants/error_codes":11,"../constants/regex":13,"../exceptions":15,"../utilities":17,"./common":7}],9:[function(require,module,exports){
"use strict";

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

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var scorm2004_constants = _api_constants["default"].scorm2004;
var scorm2004_error_codes = _error_codes["default"].scorm2004;
var learner_responses = _response_constants["default"].learner;
var scorm2004_regex = _regex["default"].scorm2004;
/**
 * Helper method for throwing Read Only error
 */

function throwReadOnlyError() {
  throw new _exceptions.ValidationError(scorm2004_error_codes.READ_ONLY_ELEMENT);
}
/**
 * Helper method for throwing Write Only error
 */


function throwWriteOnlyError() {
  throw new _exceptions.ValidationError(scorm2004_error_codes.WRITE_ONLY_ELEMENT);
}
/**
 * Helper method for throwing Type Mismatch error
 */


function throwTypeMismatchError() {
  throw new _exceptions.ValidationError(scorm2004_error_codes.TYPE_MISMATCH);
}
/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} regexPattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */


function check2004ValidFormat(value, regexPattern, allowEmptyString) {
  return (0, _common.checkValidFormat)(value, regexPattern, scorm2004_error_codes.TYPE_MISMATCH, allowEmptyString);
}
/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} rangePattern
 * @return {boolean}
 */


function check2004ValidRange(value, rangePattern) {
  return (0, _common.checkValidRange)(value, rangePattern, scorm2004_error_codes.VALUE_OUT_OF_RANGE);
}
/**
 * Class representing cmi object for SCORM 2004
 */


var _version2 = new WeakMap();

var _children2 = new WeakMap();

var _completion_status = new WeakMap();

var _completion_threshold = new WeakMap();

var _credit = new WeakMap();

var _entry = new WeakMap();

var _exit = new WeakMap();

var _launch_data = new WeakMap();

var _learner_id = new WeakMap();

var _learner_name = new WeakMap();

var _location = new WeakMap();

var _max_time_allowed = new WeakMap();

var _mode = new WeakMap();

var _progress_measure = new WeakMap();

var _scaled_passing_score = new WeakMap();

var _session_time = new WeakMap();

var _success_status = new WeakMap();

var _suspend_data = new WeakMap();

var _time_limit_action = new WeakMap();

var _total_time = new WeakMap();

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

    /**
     * Called when the API has been initialized after the CMI has been created
     */
    value: function initialize() {
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
    key: "getCurrentTotalTime",

    /**
     * Adds the current session time to the existing total time.
     *
     * @return {string} ISO8601 Duration
     */
    value: function getCurrentTotalTime() {
      var sessionTime = _classPrivateFieldGet(this, _session_time);

      var startTime = this.start_time;

      if (typeof startTime !== 'undefined' || startTime === null) {
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
  }]);

  return CMI;
}(_common.BaseCMI);
/**
 * Class for SCORM 2004's cmi.learner_preference object
 */


exports.CMI = CMI;

var _children3 = new WeakMap();

var _audio_level = new WeakMap();

var _language = new WeakMap();

var _delivery_speed = new WeakMap();

var _audio_captioning = new WeakMap();

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
    key: "toJSON",

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
  }, {
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
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT
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
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT
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
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT
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
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT
    });
  }

  return CMICommentsFromLearner;
}(_common.CMIArray);
/**
 * Class for SCORM 2004's cmi.interaction.n object
 */


var _id = new WeakMap();

var _type = new WeakMap();

var _timestamp = new WeakMap();

var _weighting = new WeakMap();

var _learner_response = new WeakMap();

var _result = new WeakMap();

var _latency = new WeakMap();

var _description = new WeakMap();

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
      children: scorm2004_constants.objectives_children
    });
    _this3.correct_responses = new _common.CMIArray({
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
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
    key: "toJSON",

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
      if (check2004ValidFormat(type, scorm2004_regex.CMIType)) {
        _classPrivateFieldSet(this, _type, type);
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
      if (check2004ValidFormat(timestamp, scorm2004_regex.CMITime)) {
        _classPrivateFieldSet(this, _timestamp, timestamp);
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
      if (check2004ValidFormat(weighting, scorm2004_regex.CMIDecimal)) {
        _classPrivateFieldSet(this, _weighting, weighting);
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
      if (typeof this.type === 'undefined') {
        throw new _exceptions.ValidationError(scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED);
      } else {
        var nodes = [];
        var response_type = learner_responses[this.type];

        if (response_type) {
          if (response_type === null || response_type === void 0 ? void 0 : response_type.delimiter) {
            nodes = learner_response.split(response_type.delimiter);
          } else {
            nodes[0] = learner_response;
          }

          if (nodes.length > 0 && nodes.length <= response_type.max) {
            var formatRegex = new RegExp(response_type.format);

            for (var i = 0; i < nodes.length; i++) {
              if (response_type === null || response_type === void 0 ? void 0 : response_type.delimiter2) {
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
            throw new _exceptions.ValidationError(scorm2004_error_codes.GENERAL_SET_FAILURE);
          }
        } else {
          throw new _exceptions.ValidationError(scorm2004_error_codes.TYPE_MISMATCH);
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
      if (check2004ValidFormat(latency, scorm2004_regex.CMITimespan)) {
        _classPrivateFieldSet(this, _latency, latency);
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
      if (check2004ValidFormat(description, scorm2004_regex.CMILangString250, true)) {
        _classPrivateFieldSet(this, _description, description);
      }
    }
  }]);

  return CMIInteractionsObject;
}(_common.BaseCMI);
/**
 * Class for SCORM 2004's cmi.objectives.n object
 */


exports.CMIInteractionsObject = CMIInteractionsObject;

var _id2 = new WeakMap();

var _success_status2 = new WeakMap();

var _completion_status2 = new WeakMap();

var _progress_measure2 = new WeakMap();

var _description2 = new WeakMap();

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
    key: "toJSON",

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
      if (check2004ValidFormat(success_status, scorm2004_regex.CMISStatus)) {
        _classPrivateFieldSet(this, _success_status2, success_status);
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
      if (check2004ValidFormat(completion_status, scorm2004_regex.CMICStatus)) {
        _classPrivateFieldSet(this, _completion_status2, completion_status);
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
      if (check2004ValidFormat(progress_measure, scorm2004_regex.CMIDecimal) && check2004ValidRange(progress_measure, scorm2004_regex.progress_range)) {
        _classPrivateFieldSet(this, _progress_measure2, progress_measure);
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
      if (check2004ValidFormat(description, scorm2004_regex.CMILangString250, true)) {
        _classPrivateFieldSet(this, _description2, description);
      }
    }
  }]);

  return CMIObjectivesObject;
}(_common.BaseCMI);
/**
 * Class for SCORM 2004's cmi *.score object
 */


exports.CMIObjectivesObject = CMIObjectivesObject;

var _scaled = new WeakMap();

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
      decimalRegex: scorm2004_regex.CMIDecimal
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
    key: "toJSON",

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
  }, {
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
  }]);

  return Scorm2004CMIScore;
}(_common.CMIScore);
/**
 * Class representing SCORM 2004's cmi.comments_from_learner.n and cmi.comments_from_lms.n object
 */


var _comment = new WeakMap();

var _location2 = new WeakMap();

var _timestamp2 = new WeakMap();

var _readOnlyAfterInit = new WeakMap();

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
    key: "toJSON",

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
  }, {
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
  }]);

  return CMICommentsObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's cmi.interactions.n.objectives.n object
 */


exports.CMICommentsObject = CMICommentsObject;

var _id3 = new WeakMap();

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
    key: "toJSON",

    /**
     * toJSON for cmi.interactions.n.objectives.n
     * @return {
     *    {
     *      id: string
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'id': this.id
      };
      delete this.jsonString;
      return result;
    }
  }, {
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
  }]);

  return CMIInteractionsObjectivesObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's cmi.interactions.n.correct_responses.n object
 */


exports.CMIInteractionsObjectivesObject = CMIInteractionsObjectivesObject;

var _pattern = new WeakMap();

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
    key: "toJSON",

    /**
     * toJSON cmi.interactions.n.correct_responses.n object
     * @return {
     *    {
     *      pattern: string
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'pattern': this.pattern
      };
      delete this.jsonString;
      return result;
    }
  }, {
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

var _request = new WeakMap();

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
    key: "toJSON",

    /**
     * toJSON for adl.nav
     *
     * @return {
     *    {
     *      request: string
     *    }
     *  }
     */
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'request': this.request
      };
      delete this.jsonString;
      return result;
    }
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
  }]);

  return ADLNav;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's adl.nav.request_valid object
 */


var _continue = new WeakMap();

var _previous = new WeakMap();

var ADLNavRequestValid = /*#__PURE__*/function (_BaseCMI10) {
  _inherits(ADLNavRequestValid, _BaseCMI10);

  var _super15 = _createSuper(ADLNavRequestValid);

  /**
   * Constructor for adl.nav.request_valid
   */
  function ADLNavRequestValid() {
    var _temp, _temp2;

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

    _defineProperty(_assertThisInitialized(_this11), "choice", (_temp = function _temp() {
      _classCallCheck(this, _temp);

      _defineProperty(this, "_isTargetValid", function (_target) {
        return 'unknown';
      });
    }, _temp));

    _defineProperty(_assertThisInitialized(_this11), "jump", (_temp2 = function _temp2() {
      _classCallCheck(this, _temp2);

      _defineProperty(this, "_isTargetValid", function (_target) {
        return 'unknown';
      });
    }, _temp2));

    return _this11;
  }
  /**
   * Getter for #continue
   * @return {string}
   */


  _createClass(ADLNavRequestValid, [{
    key: "toJSON",

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
    value: function toJSON() {
      this.jsonString = true;
      var result = {
        'previous': this.previous,
        'continue': this["continue"]
      };
      delete this.jsonString;
      return result;
    }
  }, {
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
  }]);

  return ADLNavRequestValid;
}(_common.BaseCMI);

},{"../constants/api_constants":10,"../constants/error_codes":11,"../constants/regex":13,"../constants/response_constants":14,"../exceptions":15,"../utilities":17,"./common":7}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

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
  CMIIdentifier: "^[\\u0021-\\u007E]{0,255}$",
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
  CMIResult: '^(correct|wrong|unanticipated|neutral|-?([0-9]{1,4})(\\.[0-9]{1,18})?)$',
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationError = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

var _errorCode = new WeakMap();

/**
 * Data Validation Exception
 */
var ValidationError = /*#__PURE__*/function (_Error) {
  _inherits(ValidationError, _Error);

  var _super = _createSuper(ValidationError);

  /**
   * Constructor to take in an error message and code
   * @param {number} errorCode
   */
  function ValidationError(errorCode) {
    var _this;

    _classCallCheck(this, ValidationError);

    _this = _super.call(this, errorCode);

    _errorCode.set(_assertThisInitialized(_this), {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(_assertThisInitialized(_this), _errorCode, errorCode);

    return _this;
  }

  _createClass(ValidationError, [{
    key: "errorCode",

    /**
     * Getter for #errorCode
     * @return {number}
     */
    get: function get() {
      return _classPrivateFieldGet(this, _errorCode);
    }
    /**
     * Trying to override the default Error message
     * @return {string}
     */

  }, {
    key: "message",
    get: function get() {
      return _classPrivateFieldGet(this, _errorCode) + '';
    }
  }]);

  return ValidationError;
}( /*#__PURE__*/_wrapNativeSuper(Error));

exports.ValidationError = ValidationError;

},{}],16:[function(require,module,exports){
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

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlYm91bmNlL2luZGV4LmpzIiwic3JjL0FJQ0MuanMiLCJzcmMvQmFzZUFQSS5qcyIsInNyYy9TY29ybTEyQVBJLmpzIiwic3JjL1Njb3JtMjAwNEFQSS5qcyIsInNyYy9jbWkvYWljY19jbWkuanMiLCJzcmMvY21pL2NvbW1vbi5qcyIsInNyYy9jbWkvc2Nvcm0xMl9jbWkuanMiLCJzcmMvY21pL3Njb3JtMjAwNF9jbWkuanMiLCJzcmMvY29uc3RhbnRzL2FwaV9jb25zdGFudHMuanMiLCJzcmMvY29uc3RhbnRzL2Vycm9yX2NvZGVzLmpzIiwic3JjL2NvbnN0YW50cy9sYW5ndWFnZV9jb25zdGFudHMuanMiLCJzcmMvY29uc3RhbnRzL3JlZ2V4LmpzIiwic3JjL2NvbnN0YW50cy9yZXNwb25zZV9jb25zdGFudHMuanMiLCJzcmMvZXhjZXB0aW9ucy5qcyIsInNyYy9leHBvcnRzLmpzIiwic3JjL3V0aWxpdGllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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eUNsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsa0NBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBekNXO0FBNkNsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsOEJBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBN0NXO0FBaURsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsOEJBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBakRXO0FBcURsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsMEJBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBckRXO0FBeURsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsd0JBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBekRXO0FBNkRsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUscUJBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBN0RXO0FBaUVsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUscUJBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBakVXO0FBcUVsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsd0JBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBckVXO0FBeUVsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsOEJBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBekVXO0FBNkVsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsa0NBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBN0VXO0FBaUZsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsMENBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBakZXO0FBcUZsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsaUNBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBckZXO0FBeUZsQixXQUFPO0FBQ0wsTUFBQSxZQUFZLEVBQUUsa0NBRFQ7QUFFTCxNQUFBLGFBQWEsRUFBRTtBQUZWLEtBekZXO0FBNkZs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R0FBRyxLQUFLLENBQUMsSUFBTixDQUFXLENBQVgsQ0FBUjs7QUFDQSxhQUFPLENBQVAsRUFBVTtBQUNSLFFBQUEsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFELENBQUgsS0FBYyxHQUFHLENBQUMsSUFBRCxDQUFILEdBQWEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPLEVBQVAsR0FBWSxFQUF2QyxDQUFOO0FBQ0EsUUFBQSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUQsQ0FBRCxJQUFRLENBQUMsQ0FBQyxDQUFELENBQWhCO0FBQ0EsUUFBQSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQU4sQ0FBVyxDQUFYLENBQUo7QUFDRDs7QUFDRCxNQUFBLEdBQUcsQ0FBQyxJQUFELENBQUgsR0FBWSxJQUFJLENBQUMsQ0FBRCxDQUFoQjtBQUNEO0FBQ0Y7O0FBQ0QsU0FBTyxNQUFNLENBQUMsRUFBRCxDQUFOLElBQWMsTUFBckI7QUFDRDtBQUVEOzs7Ozs7O0FBS08sU0FBUyxhQUFULENBQXVCLEdBQXZCLEVBQW9DO0FBQ3pDLE1BQUksSUFBSSxDQUFDLEtBQUwsQ0FBVyxHQUFYLE1BQW9CLEdBQXBCLElBQTJCLE1BQU0sQ0FBQyxHQUFELENBQU4sQ0FBWSxPQUFaLENBQW9CLEdBQXBCLElBQTJCLENBQTFELEVBQTZELE9BQU8sQ0FBUDtBQUM3RCxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsUUFBSixHQUFlLEtBQWYsQ0FBcUIsR0FBckIsRUFBMEIsQ0FBMUIsQ0FBZDtBQUNBLFNBQU8sS0FBSyxDQUFDLE1BQU4sSUFBZ0IsQ0FBdkI7QUFDRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogbG9kYXNoIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcXVlcnkub3JnLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogVXNlZCBhcyB0aGUgYFR5cGVFcnJvcmAgbWVzc2FnZSBmb3IgXCJGdW5jdGlvbnNcIiBtZXRob2RzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW0gPSAvXlxccyt8XFxzKyQvZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJhZCBzaWduZWQgaGV4YWRlY2ltYWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiaW5hcnkgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb2N0YWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pO1xuXG4vKiogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgd2l0aG91dCBhIGRlcGVuZGVuY3kgb24gYHJvb3RgLiAqL1xudmFyIGZyZWVQYXJzZUludCA9IHBhcnNlSW50O1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogR2V0cyB0aGUgdGltZXN0YW1wIG9mIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgaGF2ZSBlbGFwc2VkIHNpbmNlXG4gKiB0aGUgVW5peCBlcG9jaCAoMSBKYW51YXJ5IDE5NzAgMDA6MDA6MDAgVVRDKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgRGF0ZVxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgdGltZXN0YW1wLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmVyKGZ1bmN0aW9uKHN0YW1wKSB7XG4gKiAgIGNvbnNvbGUubG9nKF8ubm93KCkgLSBzdGFtcCk7XG4gKiB9LCBfLm5vdygpKTtcbiAqIC8vID0+IExvZ3MgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgaXQgdG9vayBmb3IgdGhlIGRlZmVycmVkIGludm9jYXRpb24uXG4gKi9cbnZhciBub3cgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHJvb3QuRGF0ZS5ub3coKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRlYm91bmNlZCBmdW5jdGlvbiB0aGF0IGRlbGF5cyBpbnZva2luZyBgZnVuY2AgdW50aWwgYWZ0ZXIgYHdhaXRgXG4gKiBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB3YXNcbiAqIGludm9rZWQuIFRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgIG1ldGhvZCB0byBjYW5jZWxcbiAqIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLlxuICogUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2Agc2hvdWxkIGJlIGludm9rZWQgb24gdGhlXG4gKiBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkXG4gKiB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50XG4gKiBjYWxscyB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYFxuICogaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIGRlYm91bmNlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy5kZWJvdW5jZWAgYW5kIGBfLnRocm90dGxlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlYm91bmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9ZmFsc2VdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFdhaXRdXG4gKiAgVGhlIG1heGltdW0gdGltZSBgZnVuY2AgaXMgYWxsb3dlZCB0byBiZSBkZWxheWVkIGJlZm9yZSBpdCdzIGludm9rZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGRlYm91bmNlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgY29zdGx5IGNhbGN1bGF0aW9ucyB3aGlsZSB0aGUgd2luZG93IHNpemUgaXMgaW4gZmx1eC5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCBfLmRlYm91bmNlKGNhbGN1bGF0ZUxheW91dCwgMTUwKSk7XG4gKlxuICogLy8gSW52b2tlIGBzZW5kTWFpbGAgd2hlbiBjbGlja2VkLCBkZWJvdW5jaW5nIHN1YnNlcXVlbnQgY2FsbHMuXG4gKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgXy5kZWJvdW5jZShzZW5kTWFpbCwgMzAwLCB7XG4gKiAgICdsZWFkaW5nJzogdHJ1ZSxcbiAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAqIH0pKTtcbiAqXG4gKiAvLyBFbnN1cmUgYGJhdGNoTG9nYCBpcyBpbnZva2VkIG9uY2UgYWZ0ZXIgMSBzZWNvbmQgb2YgZGVib3VuY2VkIGNhbGxzLlxuICogdmFyIGRlYm91bmNlZCA9IF8uZGVib3VuY2UoYmF0Y2hMb2csIDI1MCwgeyAnbWF4V2FpdCc6IDEwMDAgfSk7XG4gKiB2YXIgc291cmNlID0gbmV3IEV2ZW50U291cmNlKCcvc3RyZWFtJyk7XG4gKiBqUXVlcnkoc291cmNlKS5vbignbWVzc2FnZScsIGRlYm91bmNlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyBkZWJvdW5jZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGRlYm91bmNlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsYXN0QXJncyxcbiAgICAgIGxhc3RUaGlzLFxuICAgICAgbWF4V2FpdCxcbiAgICAgIHJlc3VsdCxcbiAgICAgIHRpbWVySWQsXG4gICAgICBsYXN0Q2FsbFRpbWUsXG4gICAgICBsYXN0SW52b2tlVGltZSA9IDAsXG4gICAgICBsZWFkaW5nID0gZmFsc2UsXG4gICAgICBtYXhpbmcgPSBmYWxzZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB3YWl0ID0gdG9OdW1iZXIod2FpdCkgfHwgMDtcbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICEhb3B0aW9ucy5sZWFkaW5nO1xuICAgIG1heGluZyA9ICdtYXhXYWl0JyBpbiBvcHRpb25zO1xuICAgIG1heFdhaXQgPSBtYXhpbmcgPyBuYXRpdmVNYXgodG9OdW1iZXIob3B0aW9ucy5tYXhXYWl0KSB8fCAwLCB3YWl0KSA6IG1heFdhaXQ7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGludm9rZUZ1bmModGltZSkge1xuICAgIHZhciBhcmdzID0gbGFzdEFyZ3MsXG4gICAgICAgIHRoaXNBcmcgPSBsYXN0VGhpcztcblxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlYWRpbmdFZGdlKHRpbWUpIHtcbiAgICAvLyBSZXNldCBhbnkgYG1heFdhaXRgIHRpbWVyLlxuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICAvLyBTdGFydCB0aGUgdGltZXIgZm9yIHRoZSB0cmFpbGluZyBlZGdlLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgLy8gSW52b2tlIHRoZSBsZWFkaW5nIGVkZ2UuXG4gICAgcmV0dXJuIGxlYWRpbmcgPyBpbnZva2VGdW5jKHRpbWUpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtYWluaW5nV2FpdCh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZSxcbiAgICAgICAgcmVzdWx0ID0gd2FpdCAtIHRpbWVTaW5jZUxhc3RDYWxsO1xuXG4gICAgcmV0dXJuIG1heGluZyA/IG5hdGl2ZU1pbihyZXN1bHQsIG1heFdhaXQgLSB0aW1lU2luY2VMYXN0SW52b2tlKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZEludm9rZSh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZTtcblxuICAgIC8vIEVpdGhlciB0aGlzIGlzIHRoZSBmaXJzdCBjYWxsLCBhY3Rpdml0eSBoYXMgc3RvcHBlZCBhbmQgd2UncmUgYXQgdGhlXG4gICAgLy8gdHJhaWxpbmcgZWRnZSwgdGhlIHN5c3RlbSB0aW1lIGhhcyBnb25lIGJhY2t3YXJkcyBhbmQgd2UncmUgdHJlYXRpbmdcbiAgICAvLyBpdCBhcyB0aGUgdHJhaWxpbmcgZWRnZSwgb3Igd2UndmUgaGl0IHRoZSBgbWF4V2FpdGAgbGltaXQuXG4gICAgcmV0dXJuIChsYXN0Q2FsbFRpbWUgPT09IHVuZGVmaW5lZCB8fCAodGltZVNpbmNlTGFzdENhbGwgPj0gd2FpdCkgfHxcbiAgICAgICh0aW1lU2luY2VMYXN0Q2FsbCA8IDApIHx8IChtYXhpbmcgJiYgdGltZVNpbmNlTGFzdEludm9rZSA+PSBtYXhXYWl0KSk7XG4gIH1cblxuICBmdW5jdGlvbiB0aW1lckV4cGlyZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKTtcbiAgICBpZiAoc2hvdWxkSW52b2tlKHRpbWUpKSB7XG4gICAgICByZXR1cm4gdHJhaWxpbmdFZGdlKHRpbWUpO1xuICAgIH1cbiAgICAvLyBSZXN0YXJ0IHRoZSB0aW1lci5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHJlbWFpbmluZ1dhaXQodGltZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhaWxpbmdFZGdlKHRpbWUpIHtcbiAgICB0aW1lcklkID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gT25seSBpbnZva2UgaWYgd2UgaGF2ZSBgbGFzdEFyZ3NgIHdoaWNoIG1lYW5zIGBmdW5jYCBoYXMgYmVlblxuICAgIC8vIGRlYm91bmNlZCBhdCBsZWFzdCBvbmNlLlxuICAgIGlmICh0cmFpbGluZyAmJiBsYXN0QXJncykge1xuICAgICAgcmV0dXJuIGludm9rZUZ1bmModGltZSk7XG4gICAgfVxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBpZiAodGltZXJJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgfVxuICAgIGxhc3RJbnZva2VUaW1lID0gMDtcbiAgICBsYXN0QXJncyA9IGxhc3RDYWxsVGltZSA9IGxhc3RUaGlzID0gdGltZXJJZCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHJldHVybiB0aW1lcklkID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiB0cmFpbGluZ0VkZ2Uobm93KCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCksXG4gICAgICAgIGlzSW52b2tpbmcgPSBzaG91bGRJbnZva2UodGltZSk7XG5cbiAgICBsYXN0QXJncyA9IGFyZ3VtZW50cztcbiAgICBsYXN0VGhpcyA9IHRoaXM7XG4gICAgbGFzdENhbGxUaW1lID0gdGltZTtcblxuICAgIGlmIChpc0ludm9raW5nKSB7XG4gICAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBsZWFkaW5nRWRnZShsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG1heGluZykge1xuICAgICAgICAvLyBIYW5kbGUgaW52b2NhdGlvbnMgaW4gYSB0aWdodCBsb29wLlxuICAgICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgICAgICByZXR1cm4gaW52b2tlRnVuYyhsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGRlYm91bmNlZC5jYW5jZWwgPSBjYW5jZWw7XG4gIGRlYm91bmNlZC5mbHVzaCA9IGZsdXNoO1xuICByZXR1cm4gZGVib3VuY2VkO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b051bWJlcigzLjIpO1xuICogLy8gPT4gMy4yXG4gKlxuICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9OdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gSW5maW5pdHlcbiAqXG4gKiBfLnRvTnVtYmVyKCczLjInKTtcbiAqIC8vID0+IDMuMlxuICovXG5mdW5jdGlvbiB0b051bWJlcih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTkFOO1xuICB9XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICB2YXIgb3RoZXIgPSB0eXBlb2YgdmFsdWUudmFsdWVPZiA9PSAnZnVuY3Rpb24nID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG4gICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyAob3RoZXIgKyAnJykgOiBvdGhlcjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiArdmFsdWU7XG4gIH1cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlVHJpbSwgJycpO1xuICB2YXIgaXNCaW5hcnkgPSByZUlzQmluYXJ5LnRlc3QodmFsdWUpO1xuICByZXR1cm4gKGlzQmluYXJ5IHx8IHJlSXNPY3RhbC50ZXN0KHZhbHVlKSlcbiAgICA/IGZyZWVQYXJzZUludCh2YWx1ZS5zbGljZSgyKSwgaXNCaW5hcnkgPyAyIDogOClcbiAgICA6IChyZUlzQmFkSGV4LnRlc3QodmFsdWUpID8gTkFOIDogK3ZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWJvdW5jZTtcbiIsIi8vIEBmbG93XG5pbXBvcnQgU2Nvcm0xMkFQSSBmcm9tICcuL1Njb3JtMTJBUEknO1xuaW1wb3J0IHtcbiAgQ01JLFxuICBDTUlBdHRlbXB0UmVjb3Jkc09iamVjdCxcbiAgQ01JRXZhbHVhdGlvbkNvbW1lbnRzT2JqZWN0LFxuICBDTUlUcmllc09iamVjdCxcbn0gZnJvbSAnLi9jbWkvYWljY19jbWknO1xuaW1wb3J0IHtOQVZ9IGZyb20gJy4vY21pL3Njb3JtMTJfY21pJztcblxuLyoqXG4gKiBUaGUgQUlDQyBBUEkgY2xhc3NcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQUlDQyBleHRlbmRzIFNjb3JtMTJBUEkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgdG8gY3JlYXRlIEFJQ0MgQVBJIG9iamVjdFxuICAgKiBAcGFyYW0ge29iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiB7fSkge1xuICAgIGNvbnN0IGZpbmFsU2V0dGluZ3MgPSB7XG4gICAgICAuLi57XG4gICAgICAgIG1hc3Rlcnlfb3ZlcnJpZGU6IGZhbHNlLFxuICAgICAgfSwgLi4uc2V0dGluZ3MsXG4gICAgfTtcblxuICAgIHN1cGVyKGZpbmFsU2V0dGluZ3MpO1xuXG4gICAgdGhpcy5jbWkgPSBuZXcgQ01JKCk7XG4gICAgdGhpcy5uYXYgPSBuZXcgTkFWKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBvciBidWlsZHMgYSBuZXcgY2hpbGQgZWxlbWVudCB0byBhZGQgdG8gdGhlIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICogQHBhcmFtIHtib29sZWFufSBmb3VuZEZpcnN0SW5kZXhcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cbiAgZ2V0Q2hpbGRFbGVtZW50KENNSUVsZW1lbnQsIHZhbHVlLCBmb3VuZEZpcnN0SW5kZXgpIHtcbiAgICBsZXQgbmV3Q2hpbGQgPSBzdXBlci5nZXRDaGlsZEVsZW1lbnQoQ01JRWxlbWVudCwgdmFsdWUsIGZvdW5kRmlyc3RJbmRleCk7XG5cbiAgICBpZiAoIW5ld0NoaWxkKSB7XG4gICAgICBpZiAodGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsICdjbWlcXFxcLmV2YWx1YXRpb25cXFxcLmNvbW1lbnRzXFxcXC5cXFxcZCsnKSkge1xuICAgICAgICBuZXdDaGlsZCA9IG5ldyBDTUlFdmFsdWF0aW9uQ29tbWVudHNPYmplY3QoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsXG4gICAgICAgICAgJ2NtaVxcXFwuc3R1ZGVudF9kYXRhXFxcXC50cmllc1xcXFwuXFxcXGQrJykpIHtcbiAgICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JVHJpZXNPYmplY3QoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsXG4gICAgICAgICAgJ2NtaVxcXFwuc3R1ZGVudF9kYXRhXFxcXC5hdHRlbXB0X3JlY29yZHNcXFxcLlxcXFxkKycpKSB7XG4gICAgICAgIG5ld0NoaWxkID0gbmV3IENNSUF0dGVtcHRSZWNvcmRzT2JqZWN0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0NoaWxkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgdGhlIHdob2xlIEFQSSB3aXRoIGFub3RoZXJcbiAgICpcbiAgICogQHBhcmFtIHtBSUNDfSBuZXdBUElcbiAgICovXG4gIHJlcGxhY2VXaXRoQW5vdGhlclNjb3JtQVBJKG5ld0FQSSkge1xuICAgIC8vIERhdGEgTW9kZWxcbiAgICB0aGlzLmNtaSA9IG5ld0FQSS5jbWk7XG4gICAgdGhpcy5uYXYgPSBuZXdBUEkubmF2O1xuICB9XG59XG4iLCIvLyBAZmxvd1xuaW1wb3J0IHtDTUlBcnJheX0gZnJvbSAnLi9jbWkvY29tbW9uJztcbmltcG9ydCB7VmFsaWRhdGlvbkVycm9yfSBmcm9tICcuL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IEVycm9yQ29kZXMgZnJvbSAnLi9jb25zdGFudHMvZXJyb3JfY29kZXMnO1xuaW1wb3J0IEFQSUNvbnN0YW50cyBmcm9tICcuL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCB7dW5mbGF0dGVufSBmcm9tICcuL3V0aWxpdGllcyc7XG5pbXBvcnQgZGVib3VuY2UgZnJvbSAnbG9kYXNoLmRlYm91bmNlJztcblxuY29uc3QgZ2xvYmFsX2NvbnN0YW50cyA9IEFQSUNvbnN0YW50cy5nbG9iYWw7XG5jb25zdCBzY29ybTEyX2Vycm9yX2NvZGVzID0gRXJyb3JDb2Rlcy5zY29ybTEyO1xuXG4vKipcbiAqIEJhc2UgQVBJIGNsYXNzIGZvciBBSUNDLCBTQ09STSAxLjIsIGFuZCBTQ09STSAyMDA0LiBTaG91bGQgYmUgY29uc2lkZXJlZFxuICogYWJzdHJhY3QsIGFuZCBuZXZlciBpbml0aWFsaXplZCBvbiBpdCdzIG93bi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUFQSSB7XG4gICN0aW1lb3V0O1xuICAjZXJyb3JfY29kZXM7XG4gICNzZXR0aW5ncyA9IHtcbiAgICBhdXRvY29tbWl0OiBmYWxzZSxcbiAgICBhdXRvY29tbWl0U2Vjb25kczogMTAsXG4gICAgYXN5bmNDb21taXQ6IGZhbHNlLFxuICAgIHNlbmRCZWFjb25Db21taXQ6IGZhbHNlLFxuICAgIGxtc0NvbW1pdFVybDogZmFsc2UsXG4gICAgZGF0YUNvbW1pdEZvcm1hdDogJ2pzb24nLCAvLyB2YWxpZCBmb3JtYXRzIGFyZSAnanNvbicgb3IgJ2ZsYXR0ZW5lZCcsICdwYXJhbXMnXG4gICAgY29tbWl0UmVxdWVzdERhdGFUeXBlOiAnYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PVVURi04JyxcbiAgICBhdXRvUHJvZ3Jlc3M6IGZhbHNlLFxuICAgIGxvZ0xldmVsOiBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9FUlJPUixcbiAgICBzZWxmUmVwb3J0U2Vzc2lvblRpbWU6IGZhbHNlLFxuICAgIHJlc3BvbnNlSGFuZGxlcjogZnVuY3Rpb24oeGhyKSB7XG4gICAgICBsZXQgcmVzdWx0O1xuICAgICAgaWYgKHR5cGVvZiB4aHIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwgfHwgIXt9Lmhhc093blByb3BlcnR5LmNhbGwocmVzdWx0LCAncmVzdWx0JykpIHtcbiAgICAgICAgICByZXN1bHQgPSB7fTtcbiAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICByZXN1bHQucmVzdWx0ID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQucmVzdWx0ID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcbiAgICAgICAgICAgIHJlc3VsdC5lcnJvckNvZGUgPSAxMDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG4gIH07XG4gIGNtaTtcbiAgc3RhcnRpbmdEYXRhOiB7fTtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEJhc2UgQVBJIGNsYXNzLiBTZXRzIHNvbWUgc2hhcmVkIEFQSSBmaWVsZHMsIGFzIHdlbGwgYXNcbiAgICogc2V0cyB1cCBvcHRpb25zIGZvciB0aGUgQVBJLlxuICAgKiBAcGFyYW0ge29iamVjdH0gZXJyb3JfY29kZXNcbiAgICogQHBhcmFtIHtvYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlcnJvcl9jb2Rlcywgc2V0dGluZ3MpIHtcbiAgICBpZiAobmV3LnRhcmdldCA9PT0gQmFzZUFQSSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnN0cnVjdCBCYXNlQVBJIGluc3RhbmNlcyBkaXJlY3RseScpO1xuICAgIH1cbiAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IGdsb2JhbF9jb25zdGFudHMuU1RBVEVfTk9UX0lOSVRJQUxJWkVEO1xuICAgIHRoaXMubGFzdEVycm9yQ29kZSA9IDA7XG4gICAgdGhpcy5saXN0ZW5lckFycmF5ID0gW107XG5cbiAgICB0aGlzLiN0aW1lb3V0ID0gbnVsbDtcbiAgICB0aGlzLiNlcnJvcl9jb2RlcyA9IGVycm9yX2NvZGVzO1xuXG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgIHRoaXMuYXBpTG9nTGV2ZWwgPSB0aGlzLnNldHRpbmdzLmxvZ0xldmVsO1xuICAgIHRoaXMuc2VsZlJlcG9ydFNlc3Npb25UaW1lID0gdGhpcy5zZXR0aW5ncy5zZWxmUmVwb3J0U2Vzc2lvblRpbWU7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgQVBJXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGluaXRpYWxpemVNZXNzYWdlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXJtaW5hdGlvbk1lc3NhZ2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgaW5pdGlhbGl6ZShcbiAgICAgIGNhbGxiYWNrTmFtZTogU3RyaW5nLFxuICAgICAgaW5pdGlhbGl6ZU1lc3NhZ2U/OiBTdHJpbmcsXG4gICAgICB0ZXJtaW5hdGlvbk1lc3NhZ2U/OiBTdHJpbmcpIHtcbiAgICBsZXQgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuXG4gICAgaWYgKHRoaXMuaXNJbml0aWFsaXplZCgpKSB7XG4gICAgICB0aGlzLnRocm93U0NPUk1FcnJvcih0aGlzLiNlcnJvcl9jb2Rlcy5JTklUSUFMSVpFRCwgaW5pdGlhbGl6ZU1lc3NhZ2UpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc1Rlcm1pbmF0ZWQoKSkge1xuICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IodGhpcy4jZXJyb3JfY29kZXMuVEVSTUlOQVRFRCwgdGVybWluYXRpb25NZXNzYWdlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuc2VsZlJlcG9ydFNlc3Npb25UaW1lKSB7XG4gICAgICAgIHRoaXMuY21pLnNldFN0YXJ0VGltZSgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IGdsb2JhbF9jb25zdGFudHMuU1RBVEVfSU5JVElBTElaRUQ7XG4gICAgICB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuICAgICAgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUU7XG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcbiAgICB0aGlzLmNsZWFyU0NPUk1FcnJvcihyZXR1cm5WYWx1ZSk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZXJyb3JfY29kZXNcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cbiAgZ2V0IGVycm9yX2NvZGVzKCkge1xuICAgIHJldHVybiB0aGlzLiNlcnJvcl9jb2RlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzZXR0aW5nc1xuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICBnZXQgc2V0dGluZ3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3NldHRpbmdzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3NldHRpbmdzXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzOiBPYmplY3QpIHtcbiAgICB0aGlzLiNzZXR0aW5ncyA9IHsuLi50aGlzLiNzZXR0aW5ncywgLi4uc2V0dGluZ3N9O1xuICB9XG5cbiAgLyoqXG4gICAqIFRlcm1pbmF0ZXMgdGhlIGN1cnJlbnQgcnVuIG9mIHRoZSBBUElcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrVGVybWluYXRlZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICB0ZXJtaW5hdGUoXG4gICAgICBjYWxsYmFja05hbWU6IFN0cmluZyxcbiAgICAgIGNoZWNrVGVybWluYXRlZDogYm9vbGVhbikge1xuICAgIGxldCByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG5cbiAgICBpZiAodGhpcy5jaGVja1N0YXRlKGNoZWNrVGVybWluYXRlZCxcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuVEVSTUlOQVRJT05fQkVGT1JFX0lOSVQsXG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLk1VTFRJUExFX1RFUk1JTkFUSU9OKSkge1xuICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBnbG9iYWxfY29uc3RhbnRzLlNUQVRFX1RFUk1JTkFURUQ7XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuc3RvcmVEYXRhKHRydWUpO1xuICAgICAgaWYgKCF0aGlzLnNldHRpbmdzLnNlbmRCZWFjb25Db21taXQgJiYgIXRoaXMuc2V0dGluZ3MuYXN5bmNDb21taXQgJiZcbiAgICAgICAgICB0eXBlb2YgcmVzdWx0LmVycm9yQ29kZSAhPT0gJ3VuZGVmaW5lZCcgJiYgcmVzdWx0LmVycm9yQ29kZSA+IDApIHtcbiAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IocmVzdWx0LmVycm9yQ29kZSk7XG4gICAgICB9XG4gICAgICByZXR1cm5WYWx1ZSA9ICh0eXBlb2YgcmVzdWx0ICE9PSAndW5kZWZpbmVkJyAmJiByZXN1bHQucmVzdWx0KSA/XG4gICAgICAgICAgcmVzdWx0LnJlc3VsdCA6IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG5cbiAgICAgIGlmIChjaGVja1Rlcm1pbmF0ZWQpIHRoaXMubGFzdEVycm9yQ29kZSA9IDA7XG5cbiAgICAgIHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBudWxsLCAncmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG4gICAgdGhpcy5jbGVhclNDT1JNRXJyb3IocmV0dXJuVmFsdWUpO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgdmFsdWUgb2YgdGhlIENNSUVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHBhcmFtIHtib29sZWFufSBjaGVja1Rlcm1pbmF0ZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0VmFsdWUoXG4gICAgICBjYWxsYmFja05hbWU6IFN0cmluZyxcbiAgICAgIGNoZWNrVGVybWluYXRlZDogYm9vbGVhbixcbiAgICAgIENNSUVsZW1lbnQ6IFN0cmluZykge1xuICAgIGxldCByZXR1cm5WYWx1ZTtcblxuICAgIGlmICh0aGlzLmNoZWNrU3RhdGUoY2hlY2tUZXJtaW5hdGVkLFxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5SRVRSSUVWRV9CRUZPUkVfSU5JVCxcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuUkVUUklFVkVfQUZURVJfVEVSTSkpIHtcbiAgICAgIGlmIChjaGVja1Rlcm1pbmF0ZWQpIHRoaXMubGFzdEVycm9yQ29kZSA9IDA7XG4gICAgICByZXR1cm5WYWx1ZSA9IHRoaXMuZ2V0Q01JVmFsdWUoQ01JRWxlbWVudCk7XG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lLCBDTUlFbGVtZW50KTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIENNSUVsZW1lbnQsICc6IHJldHVybmVkOiAnICsgcmV0dXJuVmFsdWUsXG4gICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pO1xuICAgIHRoaXMuY2xlYXJTQ09STUVycm9yKHJldHVyblZhbHVlKTtcblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgQ01JRWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrVGVybWluYXRlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHNldFZhbHVlKFxuICAgICAgY2FsbGJhY2tOYW1lOiBTdHJpbmcsXG4gICAgICBjaGVja1Rlcm1pbmF0ZWQ6IGJvb2xlYW4sXG4gICAgICBDTUlFbGVtZW50LFxuICAgICAgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuICAgIH1cbiAgICBsZXQgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuXG4gICAgaWYgKHRoaXMuY2hlY2tTdGF0ZShjaGVja1Rlcm1pbmF0ZWQsIHRoaXMuI2Vycm9yX2NvZGVzLlNUT1JFX0JFRk9SRV9JTklULFxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5TVE9SRV9BRlRFUl9URVJNKSkge1xuICAgICAgaWYgKGNoZWNrVGVybWluYXRlZCkgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVyblZhbHVlID0gdGhpcy5zZXRDTUlWYWx1ZShDTUlFbGVtZW50LCB2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgVmFsaWRhdGlvbkVycm9yKSB7XG4gICAgICAgICAgdGhpcy5sYXN0RXJyb3JDb2RlID0gZS5lcnJvckNvZGU7XG4gICAgICAgICAgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChlLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZS5tZXNzYWdlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IodGhpcy4jZXJyb3JfY29kZXMuR0VORVJBTCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUsIENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAocmV0dXJuVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuICAgIH1cblxuICAgIC8vIElmIHdlIGRpZG4ndCBoYXZlIGFueSBlcnJvcnMgd2hpbGUgc2V0dGluZyB0aGUgZGF0YSwgZ28gYWhlYWQgYW5kXG4gICAgLy8gc2NoZWR1bGUgYSBjb21taXQsIGlmIGF1dG9jb21taXQgaXMgdHVybmVkIG9uXG4gICAgaWYgKFN0cmluZyh0aGlzLmxhc3RFcnJvckNvZGUpID09PSAnMCcpIHtcbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLmF1dG9jb21taXQgJiYgIXRoaXMuI3RpbWVvdXQpIHtcbiAgICAgICAgdGhpcy5zY2hlZHVsZUNvbW1pdCh0aGlzLnNldHRpbmdzLmF1dG9jb21taXRTZWNvbmRzICogMTAwMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBDTUlFbGVtZW50LFxuICAgICAgICAnOiAnICsgdmFsdWUgKyAnOiByZXN1bHQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG4gICAgdGhpcy5jbGVhclNDT1JNRXJyb3IocmV0dXJuVmFsdWUpO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIE9yZGVycyBMTVMgdG8gc3RvcmUgYWxsIGNvbnRlbnQgcGFyYW1ldGVyc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tUZXJtaW5hdGVkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGNvbW1pdChcbiAgICAgIGNhbGxiYWNrTmFtZTogU3RyaW5nLFxuICAgICAgY2hlY2tUZXJtaW5hdGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5jbGVhclNjaGVkdWxlZENvbW1pdCgpO1xuXG4gICAgbGV0IHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcblxuICAgIGlmICh0aGlzLmNoZWNrU3RhdGUoY2hlY2tUZXJtaW5hdGVkLCB0aGlzLiNlcnJvcl9jb2Rlcy5DT01NSVRfQkVGT1JFX0lOSVQsXG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLkNPTU1JVF9BRlRFUl9URVJNKSkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5zdG9yZURhdGEoZmFsc2UpO1xuICAgICAgaWYgKCF0aGlzLnNldHRpbmdzLnNlbmRCZWFjb25Db21taXQgJiYgIXRoaXMuc2V0dGluZ3MuYXN5bmNDb21taXQgJiZcbiAgICAgICAgICByZXN1bHQuZXJyb3JDb2RlICYmIHJlc3VsdC5lcnJvckNvZGUgPiAwKSB7XG4gICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHJlc3VsdC5lcnJvckNvZGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuVmFsdWUgPSAodHlwZW9mIHJlc3VsdCAhPT0gJ3VuZGVmaW5lZCcgJiYgcmVzdWx0LnJlc3VsdCkgP1xuICAgICAgICAgIHJlc3VsdC5yZXN1bHQgOiBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuXG4gICAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsICdIdHRwUmVxdWVzdCcsICcgUmVzdWx0OiAnICsgcmV0dXJuVmFsdWUsXG4gICAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfREVCVUcpO1xuXG4gICAgICBpZiAoY2hlY2tUZXJtaW5hdGVkKSB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuXG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcbiAgICB0aGlzLmNsZWFyU0NPUk1FcnJvcihyZXR1cm5WYWx1ZSk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBsYXN0IGVycm9yIGNvZGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXRMYXN0RXJyb3IoY2FsbGJhY2tOYW1lOiBTdHJpbmcpIHtcbiAgICBjb25zdCByZXR1cm5WYWx1ZSA9IFN0cmluZyh0aGlzLmxhc3RFcnJvckNvZGUpO1xuXG4gICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSk7XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBlcnJvck51bWJlciBlcnJvciBkZXNjcmlwdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXIpfSBDTUlFcnJvckNvZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0RXJyb3JTdHJpbmcoY2FsbGJhY2tOYW1lOiBTdHJpbmcsIENNSUVycm9yQ29kZSkge1xuICAgIGxldCByZXR1cm5WYWx1ZSA9ICcnO1xuXG4gICAgaWYgKENNSUVycm9yQ29kZSAhPT0gbnVsbCAmJiBDTUlFcnJvckNvZGUgIT09ICcnKSB7XG4gICAgICByZXR1cm5WYWx1ZSA9IHRoaXMuZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhDTUlFcnJvckNvZGUpO1xuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBudWxsLCAncmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGNvbXByZWhlbnNpdmUgZGVzY3JpcHRpb24gb2YgdGhlIGVycm9yTnVtYmVyIGVycm9yLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXIpfSBDTUlFcnJvckNvZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0RGlhZ25vc3RpYyhjYWxsYmFja05hbWU6IFN0cmluZywgQ01JRXJyb3JDb2RlKSB7XG4gICAgbGV0IHJldHVyblZhbHVlID0gJyc7XG5cbiAgICBpZiAoQ01JRXJyb3JDb2RlICE9PSBudWxsICYmIENNSUVycm9yQ29kZSAhPT0gJycpIHtcbiAgICAgIHJldHVyblZhbHVlID0gdGhpcy5nZXRMbXNFcnJvck1lc3NhZ2VEZXRhaWxzKENNSUVycm9yQ29kZSwgdHJ1ZSk7XG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgdGhlIExNUyBzdGF0ZSBhbmQgZW5zdXJlcyBpdCBoYXMgYmVlbiBpbml0aWFsaXplZC5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBjaGVja1Rlcm1pbmF0ZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGJlZm9yZUluaXRFcnJvclxuICAgKiBAcGFyYW0ge251bWJlcn0gYWZ0ZXJUZXJtRXJyb3JcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGNoZWNrU3RhdGUoXG4gICAgICBjaGVja1Rlcm1pbmF0ZWQ6IGJvb2xlYW4sXG4gICAgICBiZWZvcmVJbml0RXJyb3I6IG51bWJlcixcbiAgICAgIGFmdGVyVGVybUVycm9yPzogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuaXNOb3RJbml0aWFsaXplZCgpKSB7XG4gICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihiZWZvcmVJbml0RXJyb3IpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoY2hlY2tUZXJtaW5hdGVkICYmIHRoaXMuaXNUZXJtaW5hdGVkKCkpIHtcbiAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGFmdGVyVGVybUVycm9yKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2dnaW5nIGZvciBhbGwgU0NPUk0gYWN0aW9uc1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZnVuY3Rpb25OYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2dNZXNzYWdlXG4gICAqIEBwYXJhbSB7bnVtYmVyfW1lc3NhZ2VMZXZlbFxuICAgKi9cbiAgYXBpTG9nKFxuICAgICAgZnVuY3Rpb25OYW1lOiBTdHJpbmcsXG4gICAgICBDTUlFbGVtZW50OiBTdHJpbmcsXG4gICAgICBsb2dNZXNzYWdlOiBTdHJpbmcsXG4gICAgICBtZXNzYWdlTGV2ZWw6IG51bWJlcikge1xuICAgIGxvZ01lc3NhZ2UgPSB0aGlzLmZvcm1hdE1lc3NhZ2UoZnVuY3Rpb25OYW1lLCBDTUlFbGVtZW50LCBsb2dNZXNzYWdlKTtcblxuICAgIGlmIChtZXNzYWdlTGV2ZWwgPj0gdGhpcy5hcGlMb2dMZXZlbCkge1xuICAgICAgc3dpdGNoIChtZXNzYWdlTGV2ZWwpIHtcbiAgICAgICAgY2FzZSBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9FUlJPUjpcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGxvZ01lc3NhZ2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX1dBUk5JTkc6XG4gICAgICAgICAgY29uc29sZS53YXJuKGxvZ01lc3NhZ2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk86XG4gICAgICAgICAgY29uc29sZS5pbmZvKGxvZ01lc3NhZ2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0RFQlVHOlxuICAgICAgICAgIGlmIChjb25zb2xlLmRlYnVnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKGxvZ01lc3NhZ2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhsb2dNZXNzYWdlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZvcm1hdHMgdGhlIFNDT1JNIG1lc3NhZ2VzIGZvciBlYXN5IHJlYWRpbmdcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZ1bmN0aW9uTmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmb3JtYXRNZXNzYWdlKGZ1bmN0aW9uTmFtZTogU3RyaW5nLCBDTUlFbGVtZW50OiBTdHJpbmcsIG1lc3NhZ2U6IFN0cmluZykge1xuICAgIGNvbnN0IGJhc2VMZW5ndGggPSAyMDtcbiAgICBsZXQgbWVzc2FnZVN0cmluZyA9ICcnO1xuXG4gICAgbWVzc2FnZVN0cmluZyArPSBmdW5jdGlvbk5hbWU7XG5cbiAgICBsZXQgZmlsbENoYXJzID0gYmFzZUxlbmd0aCAtIG1lc3NhZ2VTdHJpbmcubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxsQ2hhcnM7IGkrKykge1xuICAgICAgbWVzc2FnZVN0cmluZyArPSAnICc7XG4gICAgfVxuXG4gICAgbWVzc2FnZVN0cmluZyArPSAnOiAnO1xuXG4gICAgaWYgKENNSUVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IENNSUVsZW1lbnRCYXNlTGVuZ3RoID0gNzA7XG5cbiAgICAgIG1lc3NhZ2VTdHJpbmcgKz0gQ01JRWxlbWVudDtcblxuICAgICAgZmlsbENoYXJzID0gQ01JRWxlbWVudEJhc2VMZW5ndGggLSBtZXNzYWdlU3RyaW5nLmxlbmd0aDtcblxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBmaWxsQ2hhcnM7IGorKykge1xuICAgICAgICBtZXNzYWdlU3RyaW5nICs9ICcgJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobWVzc2FnZSkge1xuICAgICAgbWVzc2FnZVN0cmluZyArPSBtZXNzYWdlO1xuICAgIH1cblxuICAgIHJldHVybiBtZXNzYWdlU3RyaW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB0byBzZWUgaWYge3N0cn0gY29udGFpbnMge3Rlc3Rlcn1cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciBTdHJpbmcgdG8gY2hlY2sgYWdhaW5zdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGVzdGVyIFN0cmluZyB0byBjaGVjayBmb3JcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIHN0cmluZ01hdGNoZXMoc3RyOiBTdHJpbmcsIHRlc3RlcjogU3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0ciAmJiB0ZXN0ZXIgJiYgc3RyLm1hdGNoKHRlc3Rlcik7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgdG8gc2VlIGlmIHRoZSBzcGVjaWZpYyBvYmplY3QgaGFzIHRoZSBnaXZlbiBwcm9wZXJ0eVxuICAgKiBAcGFyYW0geyp9IHJlZk9iamVjdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY2hlY2tPYmplY3RIYXNQcm9wZXJ0eShyZWZPYmplY3QsIGF0dHJpYnV0ZTogU3RyaW5nKSB7XG4gICAgcmV0dXJuIE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlZk9iamVjdCwgYXR0cmlidXRlKSB8fFxuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFxuICAgICAgICAgICAgT2JqZWN0LmdldFByb3RvdHlwZU9mKHJlZk9iamVjdCksIGF0dHJpYnV0ZSkgfHxcbiAgICAgICAgKGF0dHJpYnV0ZSBpbiByZWZPYmplY3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1lc3NhZ2UgdGhhdCBjb3JyZXNwb25kcyB0byBlcnJvck51bWJlclxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXIpfSBfZXJyb3JOdW1iZXJcbiAgICogQHBhcmFtIHtib29sZWFufSBfZGV0YWlsXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBnZXRMbXNFcnJvck1lc3NhZ2VEZXRhaWxzKF9lcnJvck51bWJlciwgX2RldGFpbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ1RoZSBnZXRMbXNFcnJvck1lc3NhZ2VEZXRhaWxzIG1ldGhvZCBoYXMgbm90IGJlZW4gaW1wbGVtZW50ZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSB2YWx1ZSBmb3IgdGhlIHNwZWNpZmljIGVsZW1lbnQuXG4gICAqIEFQSXMgdGhhdCBpbmhlcml0IEJhc2VBUEkgc2hvdWxkIG92ZXJyaWRlIHRoaXMgZnVuY3Rpb25cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IF9DTUlFbGVtZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBnZXRDTUlWYWx1ZShfQ01JRWxlbWVudCkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIGdldENNSVZhbHVlIG1ldGhvZCBoYXMgbm90IGJlZW4gaW1wbGVtZW50ZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBmb3IgdGhlIHNwZWNpZmljIGVsZW1lbnQuXG4gICAqIEFQSXMgdGhhdCBpbmhlcml0IEJhc2VBUEkgc2hvdWxkIG92ZXJyaWRlIHRoaXMgZnVuY3Rpb25cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IF9DTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7YW55fSBfdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHNldENNSVZhbHVlKF9DTUlFbGVtZW50LCBfdmFsdWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBzZXRDTUlWYWx1ZSBtZXRob2QgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogU2hhcmVkIEFQSSBtZXRob2QgdG8gc2V0IGEgdmFsaWQgZm9yIGEgZ2l2ZW4gZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZE5hbWVcbiAgICogQHBhcmFtIHtib29sZWFufSBzY29ybTIwMDRcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBfY29tbW9uU2V0Q01JVmFsdWUoXG4gICAgICBtZXRob2ROYW1lOiBTdHJpbmcsIHNjb3JtMjAwNDogYm9vbGVhbiwgQ01JRWxlbWVudCwgdmFsdWUpIHtcbiAgICBpZiAoIUNNSUVsZW1lbnQgfHwgQ01JRWxlbWVudCA9PT0gJycpIHtcbiAgICAgIHJldHVybiBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuICAgIH1cblxuICAgIGNvbnN0IHN0cnVjdHVyZSA9IENNSUVsZW1lbnQuc3BsaXQoJy4nKTtcbiAgICBsZXQgcmVmT2JqZWN0ID0gdGhpcztcbiAgICBsZXQgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuICAgIGxldCBmb3VuZEZpcnN0SW5kZXggPSBmYWxzZTtcblxuICAgIGNvbnN0IGludmFsaWRFcnJvck1lc3NhZ2UgPSBgVGhlIGRhdGEgbW9kZWwgZWxlbWVudCBwYXNzZWQgdG8gJHttZXRob2ROYW1lfSAoJHtDTUlFbGVtZW50fSkgaXMgbm90IGEgdmFsaWQgU0NPUk0gZGF0YSBtb2RlbCBlbGVtZW50LmA7XG4gICAgY29uc3QgaW52YWxpZEVycm9yQ29kZSA9IHNjb3JtMjAwNCA/XG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLlVOREVGSU5FRF9EQVRBX01PREVMIDpcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuR0VORVJBTDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RydWN0dXJlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBhdHRyaWJ1dGUgPSBzdHJ1Y3R1cmVbaV07XG5cbiAgICAgIGlmIChpID09PSBzdHJ1Y3R1cmUubGVuZ3RoIC0gMSkge1xuICAgICAgICBpZiAoc2Nvcm0yMDA0ICYmIChhdHRyaWJ1dGUuc3Vic3RyKDAsIDgpID09PSAne3RhcmdldD0nKSAmJlxuICAgICAgICAgICAgKHR5cGVvZiByZWZPYmplY3QuX2lzVGFyZ2V0VmFsaWQgPT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcih0aGlzLiNlcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX2NoZWNrT2JqZWN0SGFzUHJvcGVydHkocmVmT2JqZWN0LCBhdHRyaWJ1dGUpKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoaW52YWxpZEVycm9yQ29kZSwgaW52YWxpZEVycm9yTWVzc2FnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LCAnXFxcXC5jb3JyZWN0X3Jlc3BvbnNlc1xcXFwuXFxcXGQrJykpIHtcbiAgICAgICAgICAgIHRoaXMudmFsaWRhdGVDb3JyZWN0UmVzcG9uc2UoQ01JRWxlbWVudCwgdmFsdWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghc2Nvcm0yMDA0IHx8IHRoaXMubGFzdEVycm9yQ29kZSA9PT0gMCkge1xuICAgICAgICAgICAgcmVmT2JqZWN0W2F0dHJpYnV0ZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVmT2JqZWN0ID0gcmVmT2JqZWN0W2F0dHJpYnV0ZV07XG4gICAgICAgIGlmICghcmVmT2JqZWN0KSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoaW52YWxpZEVycm9yQ29kZSwgaW52YWxpZEVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVmT2JqZWN0IGluc3RhbmNlb2YgQ01JQXJyYXkpIHtcbiAgICAgICAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KHN0cnVjdHVyZVtpICsgMV0sIDEwKTtcblxuICAgICAgICAgIC8vIFNDTyBpcyB0cnlpbmcgdG8gc2V0IGFuIGl0ZW0gb24gYW4gYXJyYXlcbiAgICAgICAgICBpZiAoIWlzTmFOKGluZGV4KSkge1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHJlZk9iamVjdC5jaGlsZEFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgcmVmT2JqZWN0ID0gaXRlbTtcbiAgICAgICAgICAgICAgZm91bmRGaXJzdEluZGV4ID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnN0IG5ld0NoaWxkID0gdGhpcy5nZXRDaGlsZEVsZW1lbnQoQ01JRWxlbWVudCwgdmFsdWUsXG4gICAgICAgICAgICAgICAgICBmb3VuZEZpcnN0SW5kZXgpO1xuICAgICAgICAgICAgICBmb3VuZEZpcnN0SW5kZXggPSB0cnVlO1xuXG4gICAgICAgICAgICAgIGlmICghbmV3Q2hpbGQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihpbnZhbGlkRXJyb3JDb2RlLCBpbnZhbGlkRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocmVmT2JqZWN0LmluaXRpYWxpemVkKSBuZXdDaGlsZC5pbml0aWFsaXplKCk7XG5cbiAgICAgICAgICAgICAgICByZWZPYmplY3QuY2hpbGRBcnJheS5wdXNoKG5ld0NoaWxkKTtcbiAgICAgICAgICAgICAgICByZWZPYmplY3QgPSBuZXdDaGlsZDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBIYXZlIHRvIHVwZGF0ZSBpIHZhbHVlIHRvIHNraXAgdGhlIGFycmF5IHBvc2l0aW9uXG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJldHVyblZhbHVlID09PSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFKSB7XG4gICAgICB0aGlzLmFwaUxvZyhtZXRob2ROYW1lLCBudWxsLFxuICAgICAgICAgIGBUaGVyZSB3YXMgYW4gZXJyb3Igc2V0dGluZyB0aGUgdmFsdWUgZm9yOiAke0NNSUVsZW1lbnR9LCB2YWx1ZSBvZjogJHt2YWx1ZX1gLFxuICAgICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX1dBUk5JTkcpO1xuICAgIH1cblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBYnN0cmFjdCBtZXRob2QgZm9yIHZhbGlkYXRpbmcgdGhhdCBhIHJlc3BvbnNlIGlzIGNvcnJlY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfQ01JRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IF92YWx1ZVxuICAgKi9cbiAgdmFsaWRhdGVDb3JyZWN0UmVzcG9uc2UoX0NNSUVsZW1lbnQsIF92YWx1ZSkge1xuICAgIC8vIGp1c3QgYSBzdHViIG1ldGhvZFxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgb3IgYnVpbGRzIGEgbmV3IGNoaWxkIGVsZW1lbnQgdG8gYWRkIHRvIHRoZSBhcnJheS5cbiAgICogQVBJcyB0aGF0IGluaGVyaXQgQmFzZUFQSSBzaG91bGQgb3ZlcnJpZGUgdGhpcyBtZXRob2QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfQ01JRWxlbWVudCAtIHVudXNlZFxuICAgKiBAcGFyYW0geyp9IF92YWx1ZSAtIHVudXNlZFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IF9mb3VuZEZpcnN0SW5kZXggLSB1bnVzZWRcbiAgICogQHJldHVybiB7Kn1cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBnZXRDaGlsZEVsZW1lbnQoX0NNSUVsZW1lbnQsIF92YWx1ZSwgX2ZvdW5kRmlyc3RJbmRleCkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIGdldENoaWxkRWxlbWVudCBtZXRob2QgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHZhbHVlIGZyb20gdGhlIENNSSBPYmplY3RcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZE5hbWVcbiAgICogQHBhcmFtIHtib29sZWFufSBzY29ybTIwMDRcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIF9jb21tb25HZXRDTUlWYWx1ZShtZXRob2ROYW1lOiBTdHJpbmcsIHNjb3JtMjAwNDogYm9vbGVhbiwgQ01JRWxlbWVudCkge1xuICAgIGlmICghQ01JRWxlbWVudCB8fCBDTUlFbGVtZW50ID09PSAnJykge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGNvbnN0IHN0cnVjdHVyZSA9IENNSUVsZW1lbnQuc3BsaXQoJy4nKTtcbiAgICBsZXQgcmVmT2JqZWN0ID0gdGhpcztcbiAgICBsZXQgYXR0cmlidXRlID0gbnVsbDtcblxuICAgIGNvbnN0IHVuaW5pdGlhbGl6ZWRFcnJvck1lc3NhZ2UgPSBgVGhlIGRhdGEgbW9kZWwgZWxlbWVudCBwYXNzZWQgdG8gJHttZXRob2ROYW1lfSAoJHtDTUlFbGVtZW50fSkgaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkLmA7XG4gICAgY29uc3QgaW52YWxpZEVycm9yTWVzc2FnZSA9IGBUaGUgZGF0YSBtb2RlbCBlbGVtZW50IHBhc3NlZCB0byAke21ldGhvZE5hbWV9ICgke0NNSUVsZW1lbnR9KSBpcyBub3QgYSB2YWxpZCBTQ09STSBkYXRhIG1vZGVsIGVsZW1lbnQuYDtcbiAgICBjb25zdCBpbnZhbGlkRXJyb3JDb2RlID0gc2Nvcm0yMDA0ID9cbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuVU5ERUZJTkVEX0RBVEFfTU9ERUwgOlxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5HRU5FUkFMO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHJ1Y3R1cmUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGF0dHJpYnV0ZSA9IHN0cnVjdHVyZVtpXTtcblxuICAgICAgaWYgKCFzY29ybTIwMDQpIHtcbiAgICAgICAgaWYgKGkgPT09IHN0cnVjdHVyZS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLl9jaGVja09iamVjdEhhc1Byb3BlcnR5KHJlZk9iamVjdCwgYXR0cmlidXRlKSkge1xuICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoaW52YWxpZEVycm9yQ29kZSwgaW52YWxpZEVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoKFN0cmluZyhhdHRyaWJ1dGUpLnN1YnN0cigwLCA4KSA9PT0gJ3t0YXJnZXQ9JykgJiZcbiAgICAgICAgICAgICh0eXBlb2YgcmVmT2JqZWN0Ll9pc1RhcmdldFZhbGlkID09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgY29uc3QgdGFyZ2V0ID0gU3RyaW5nKGF0dHJpYnV0ZSkuXG4gICAgICAgICAgICAgIHN1YnN0cig4LCBTdHJpbmcoYXR0cmlidXRlKS5sZW5ndGggLSA5KTtcbiAgICAgICAgICByZXR1cm4gcmVmT2JqZWN0Ll9pc1RhcmdldFZhbGlkKHRhcmdldCk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX2NoZWNrT2JqZWN0SGFzUHJvcGVydHkocmVmT2JqZWN0LCBhdHRyaWJ1dGUpKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoaW52YWxpZEVycm9yQ29kZSwgaW52YWxpZEVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJlZk9iamVjdCA9IHJlZk9iamVjdFthdHRyaWJ1dGVdO1xuICAgICAgaWYgKHJlZk9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlZk9iamVjdCBpbnN0YW5jZW9mIENNSUFycmF5KSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoc3RydWN0dXJlW2kgKyAxXSwgMTApO1xuXG4gICAgICAgIC8vIFNDTyBpcyB0cnlpbmcgdG8gc2V0IGFuIGl0ZW0gb24gYW4gYXJyYXlcbiAgICAgICAgaWYgKCFpc05hTihpbmRleCkpIHtcbiAgICAgICAgICBjb25zdCBpdGVtID0gcmVmT2JqZWN0LmNoaWxkQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgIHJlZk9iamVjdCA9IGl0ZW07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHRoaXMuI2Vycm9yX2NvZGVzLlZBTFVFX05PVF9JTklUSUFMSVpFRCxcbiAgICAgICAgICAgICAgICB1bmluaXRpYWxpemVkRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEhhdmUgdG8gdXBkYXRlIGkgdmFsdWUgdG8gc2tpcCB0aGUgYXJyYXkgcG9zaXRpb25cbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocmVmT2JqZWN0ID09PSBudWxsIHx8IHJlZk9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoIXNjb3JtMjAwNCkge1xuICAgICAgICBpZiAoYXR0cmlidXRlID09PSAnX2NoaWxkcmVuJykge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMTJfZXJyb3JfY29kZXMuQ0hJTERSRU5fRVJST1IpO1xuICAgICAgICB9IGVsc2UgaWYgKGF0dHJpYnV0ZSA9PT0gJ19jb3VudCcpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTEyX2Vycm9yX2NvZGVzLkNPVU5UX0VSUk9SKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVmT2JqZWN0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIEFQSSdzIGN1cnJlbnQgc3RhdGUgaXMgU1RBVEVfSU5JVElBTElaRURcbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGlzSW5pdGlhbGl6ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlID09PSBnbG9iYWxfY29uc3RhbnRzLlNUQVRFX0lOSVRJQUxJWkVEO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgQVBJJ3MgY3VycmVudCBzdGF0ZSBpcyBTVEFURV9OT1RfSU5JVElBTElaRURcbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGlzTm90SW5pdGlhbGl6ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlID09PSBnbG9iYWxfY29uc3RhbnRzLlNUQVRFX05PVF9JTklUSUFMSVpFRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIEFQSSdzIGN1cnJlbnQgc3RhdGUgaXMgU1RBVEVfVEVSTUlOQVRFRFxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgaXNUZXJtaW5hdGVkKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9PT0gZ2xvYmFsX2NvbnN0YW50cy5TVEFURV9URVJNSU5BVEVEO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3ZpZGVzIGEgbWVjaGFuaXNtIGZvciBhdHRhY2hpbmcgdG8gYSBzcGVjaWZpYyBTQ09STSBldmVudFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGlzdGVuZXJOYW1lXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbihsaXN0ZW5lck5hbWU6IFN0cmluZywgY2FsbGJhY2s6IGZ1bmN0aW9uKSB7XG4gICAgaWYgKCFjYWxsYmFjaykgcmV0dXJuO1xuXG4gICAgY29uc3QgbGlzdGVuZXJGdW5jdGlvbnMgPSBsaXN0ZW5lck5hbWUuc3BsaXQoJyAnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3RlbmVyRnVuY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lclNwbGl0ID0gbGlzdGVuZXJGdW5jdGlvbnNbaV0uc3BsaXQoJy4nKTtcbiAgICAgIGlmIChsaXN0ZW5lclNwbGl0Lmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBmdW5jdGlvbk5hbWUgPSBsaXN0ZW5lclNwbGl0WzBdO1xuXG4gICAgICBsZXQgQ01JRWxlbWVudCA9IG51bGw7XG4gICAgICBpZiAobGlzdGVuZXJTcGxpdC5sZW5ndGggPiAxKSB7XG4gICAgICAgIENNSUVsZW1lbnQgPSBsaXN0ZW5lck5hbWUucmVwbGFjZShmdW5jdGlvbk5hbWUgKyAnLicsICcnKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5saXN0ZW5lckFycmF5LnB1c2goe1xuICAgICAgICBmdW5jdGlvbk5hbWU6IGZ1bmN0aW9uTmFtZSxcbiAgICAgICAgQ01JRWxlbWVudDogQ01JRWxlbWVudCxcbiAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByb2Nlc3NlcyBhbnkgJ29uJyBsaXN0ZW5lcnMgdGhhdCBoYXZlIGJlZW4gY3JlYXRlZFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZnVuY3Rpb25OYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICovXG4gIHByb2Nlc3NMaXN0ZW5lcnMoZnVuY3Rpb25OYW1lOiBTdHJpbmcsIENNSUVsZW1lbnQ6IFN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIHRoaXMuYXBpTG9nKGZ1bmN0aW9uTmFtZSwgQ01JRWxlbWVudCwgdmFsdWUpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saXN0ZW5lckFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IHRoaXMubGlzdGVuZXJBcnJheVtpXTtcbiAgICAgIGNvbnN0IGZ1bmN0aW9uc01hdGNoID0gbGlzdGVuZXIuZnVuY3Rpb25OYW1lID09PSBmdW5jdGlvbk5hbWU7XG4gICAgICBjb25zdCBsaXN0ZW5lckhhc0NNSUVsZW1lbnQgPSAhIWxpc3RlbmVyLkNNSUVsZW1lbnQ7XG4gICAgICBsZXQgQ01JRWxlbWVudHNNYXRjaCA9IGZhbHNlO1xuICAgICAgaWYgKENNSUVsZW1lbnQgJiYgbGlzdGVuZXIuQ01JRWxlbWVudCAmJlxuICAgICAgICAgIGxpc3RlbmVyLkNNSUVsZW1lbnQuc3Vic3RyaW5nKGxpc3RlbmVyLkNNSUVsZW1lbnQubGVuZ3RoIC0gMSkgPT09XG4gICAgICAgICAgJyonKSB7XG4gICAgICAgIENNSUVsZW1lbnRzTWF0Y2ggPSBDTUlFbGVtZW50LmluZGV4T2YobGlzdGVuZXIuQ01JRWxlbWVudC5zdWJzdHJpbmcoMCxcbiAgICAgICAgICAgIGxpc3RlbmVyLkNNSUVsZW1lbnQubGVuZ3RoIC0gMSkpID09PSAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgQ01JRWxlbWVudHNNYXRjaCA9IGxpc3RlbmVyLkNNSUVsZW1lbnQgPT09IENNSUVsZW1lbnQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChmdW5jdGlvbnNNYXRjaCAmJiAoIWxpc3RlbmVySGFzQ01JRWxlbWVudCB8fCBDTUlFbGVtZW50c01hdGNoKSkge1xuICAgICAgICBsaXN0ZW5lci5jYWxsYmFjayhDTUlFbGVtZW50LCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRocm93cyBhIFNDT1JNIGVycm9yXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBlcnJvck51bWJlclxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuICAgKi9cbiAgdGhyb3dTQ09STUVycm9yKGVycm9yTnVtYmVyOiBudW1iZXIsIG1lc3NhZ2U6IFN0cmluZykge1xuICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgbWVzc2FnZSA9IHRoaXMuZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhlcnJvck51bWJlcik7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coJ3Rocm93U0NPUk1FcnJvcicsIG51bGwsIGVycm9yTnVtYmVyICsgJzogJyArIG1lc3NhZ2UsXG4gICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0VSUk9SKTtcblxuICAgIHRoaXMubGFzdEVycm9yQ29kZSA9IFN0cmluZyhlcnJvck51bWJlcik7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBsYXN0IFNDT1JNIGVycm9yIGNvZGUgb24gc3VjY2Vzcy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN1Y2Nlc3NcbiAgICovXG4gIGNsZWFyU0NPUk1FcnJvcihzdWNjZXNzOiBTdHJpbmcpIHtcbiAgICBpZiAoc3VjY2VzcyAhPT0gdW5kZWZpbmVkICYmIHN1Y2Nlc3MgIT09IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0UpIHtcbiAgICAgIHRoaXMubGFzdEVycm9yQ29kZSA9IDA7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHRzIHRvIHN0b3JlIHRoZSBkYXRhIHRvIHRoZSBMTVMsIGxvZ3MgZGF0YSBpZiBubyBMTVMgY29uZmlndXJlZFxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gX2NhbGN1bGF0ZVRvdGFsVGltZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgc3RvcmVEYXRhKF9jYWxjdWxhdGVUb3RhbFRpbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdUaGUgc3RvcmVEYXRhIG1ldGhvZCBoYXMgbm90IGJlZW4gaW1wbGVtZW50ZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIHRoZSBDTUkgZnJvbSBhIGZsYXR0ZW5lZCBKU09OIG9iamVjdFxuICAgKiBAcGFyYW0ge29iamVjdH0ganNvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKi9cbiAgbG9hZEZyb21GbGF0dGVuZWRKU09OKGpzb24sIENNSUVsZW1lbnQpIHtcbiAgICB0aGlzLmxvYWRGcm9tSlNPTih1bmZsYXR0ZW4oanNvbiksIENNSUVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIENNSSBkYXRhIGZyb20gYSBKU09OIG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGpzb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICovXG4gIGxvYWRGcm9tSlNPTihqc29uLCBDTUlFbGVtZW50KSB7XG4gICAgaWYgKCF0aGlzLmlzTm90SW5pdGlhbGl6ZWQoKSkge1xuICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAnbG9hZEZyb21KU09OIGNhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgdGhlIGNhbGwgdG8gbG1zSW5pdGlhbGl6ZS4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBDTUlFbGVtZW50ID0gQ01JRWxlbWVudCAhPT0gdW5kZWZpbmVkID8gQ01JRWxlbWVudCA6ICdjbWknO1xuXG4gICAgdGhpcy5zdGFydGluZ0RhdGEgPSBqc29uO1xuXG4gICAgLy8gY291bGQgdGhpcyBiZSByZWZhY3RvcmVkIGRvd24gdG8gZmxhdHRlbihqc29uKSB0aGVuIHNldENNSVZhbHVlIG9uIGVhY2g/XG4gICAgZm9yIChjb25zdCBrZXkgaW4ganNvbikge1xuICAgICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoanNvbiwga2V5KSAmJiBqc29uW2tleV0pIHtcbiAgICAgICAgY29uc3QgY3VycmVudENNSUVsZW1lbnQgPSAoQ01JRWxlbWVudCA/IENNSUVsZW1lbnQgKyAnLicgOiAnJykgKyBrZXk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0ganNvbltrZXldO1xuXG4gICAgICAgIGlmICh2YWx1ZVsnY2hpbGRBcnJheSddKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZVsnY2hpbGRBcnJheSddLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRGcm9tSlNPTih2YWx1ZVsnY2hpbGRBcnJheSddW2ldLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRDTUlFbGVtZW50ICsgJy4nICsgaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlLmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHtcbiAgICAgICAgICB0aGlzLmxvYWRGcm9tSlNPTih2YWx1ZSwgY3VycmVudENNSUVsZW1lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0Q01JVmFsdWUoY3VycmVudENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIENNSSBvYmplY3QgdG8gSlNPTiBmb3Igc2VuZGluZyB0byBhbiBMTVMuXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHJlbmRlckNNSVRvSlNPTlN0cmluZygpIHtcbiAgICBjb25zdCBjbWkgPSB0aGlzLmNtaTtcbiAgICAvLyBEbyB3ZSB3YW50L25lZWQgdG8gcmV0dXJuIGZpZWxkcyB0aGF0IGhhdmUgbm8gc2V0IHZhbHVlP1xuICAgIC8vIHJldHVybiBKU09OLnN0cmluZ2lmeSh7IGNtaSB9LCAoaywgdikgPT4gdiA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IHYsIDIpO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh7Y21pfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIEpTIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGN1cnJlbnQgY21pXG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIHJlbmRlckNNSVRvSlNPTk9iamVjdCgpIHtcbiAgICAvLyBEbyB3ZSB3YW50L25lZWQgdG8gcmV0dXJuIGZpZWxkcyB0aGF0IGhhdmUgbm8gc2V0IHZhbHVlP1xuICAgIC8vIHJldHVybiBKU09OLnN0cmluZ2lmeSh7IGNtaSB9LCAoaywgdikgPT4gdiA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IHYsIDIpO1xuICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMucmVuZGVyQ01JVG9KU09OU3RyaW5nKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgY21pIG9iamVjdCB0byB0aGUgcHJvcGVyIGZvcm1hdCBmb3IgTE1TIGNvbW1pdFxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gX3Rlcm1pbmF0ZUNvbW1pdFxuICAgKiBAcmV0dXJuIHsqfVxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHJlbmRlckNvbW1pdENNSShfdGVybWluYXRlQ29tbWl0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlIHN0b3JlRGF0YSBtZXRob2QgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCB0aGUgcmVxdWVzdCB0byB0aGUgTE1TXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHtvYmplY3R8QXJyYXl9IHBhcmFtc1xuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGltbWVkaWF0ZVxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICBwcm9jZXNzSHR0cFJlcXVlc3QodXJsOiBTdHJpbmcsIHBhcmFtcywgaW1tZWRpYXRlID0gZmFsc2UpIHtcbiAgICBjb25zdCBwcm9jZXNzID0gZnVuY3Rpb24odXJsLCBwYXJhbXMsIHNldHRpbmdzLCBlcnJvcl9jb2Rlcykge1xuICAgICAgY29uc3QgZ2VuZXJpY0Vycm9yID0ge1xuICAgICAgICAncmVzdWx0JzogZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRSxcbiAgICAgICAgJ2Vycm9yQ29kZSc6IGVycm9yX2NvZGVzLkdFTkVSQUwsXG4gICAgICB9O1xuXG4gICAgICBsZXQgcmVzdWx0O1xuICAgICAgaWYgKCFzZXR0aW5ncy5zZW5kQmVhY29uQ29tbWl0KSB7XG4gICAgICAgIGNvbnN0IGh0dHBSZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgaHR0cFJlcS5vcGVuKCdQT1NUJywgdXJsLCBzZXR0aW5ncy5hc3luY0NvbW1pdCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHBhcmFtcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBodHRwUmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsXG4gICAgICAgICAgICAgICAgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xuICAgICAgICAgICAgaHR0cFJlcS5zZW5kKHBhcmFtcy5qb2luKCcmJykpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBodHRwUmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsXG4gICAgICAgICAgICAgICAgc2V0dGluZ3MuY29tbWl0UmVxdWVzdERhdGFUeXBlKTtcbiAgICAgICAgICAgIGh0dHBSZXEuc2VuZChKU09OLnN0cmluZ2lmeShwYXJhbXMpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodHlwZW9mIHNldHRpbmdzLnJlc3BvbnNlSGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmVzdWx0ID0gc2V0dGluZ3MucmVzcG9uc2VIYW5kbGVyKGh0dHBSZXEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKGh0dHBSZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIHJldHVybiBnZW5lcmljRXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgaGVhZGVycyA9IHtcbiAgICAgICAgICAgIHR5cGU6IHNldHRpbmdzLmNvbW1pdFJlcXVlc3REYXRhVHlwZSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGxldCBibG9iO1xuICAgICAgICAgIGlmIChwYXJhbXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgYmxvYiA9IG5ldyBCbG9iKFtwYXJhbXMuam9pbignJicpXSwgaGVhZGVycyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJsb2IgPSBuZXcgQmxvYihbSlNPTi5zdHJpbmdpZnkocGFyYW1zKV0sIGhlYWRlcnMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc3VsdCA9IHt9O1xuICAgICAgICAgIGlmIChuYXZpZ2F0b3Iuc2VuZEJlYWNvbih1cmwsIGJsb2IpKSB7XG4gICAgICAgICAgICByZXN1bHQucmVzdWx0ID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgICAgICAgICAgcmVzdWx0LmVycm9yQ29kZSA9IDA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdC5yZXN1bHQgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuICAgICAgICAgICAgcmVzdWx0LmVycm9yQ29kZSA9IDEwMTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIHJldHVybiBnZW5lcmljRXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiByZXN1bHQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHJldHVybiBnZW5lcmljRXJyb3I7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgZGVib3VuY2UgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCBkZWJvdW5jZWQgPSBkZWJvdW5jZShwcm9jZXNzLCA1MDApO1xuICAgICAgZGVib3VuY2VkKHVybCwgcGFyYW1zLCB0aGlzLnNldHRpbmdzLCB0aGlzLmVycm9yX2NvZGVzKTtcblxuICAgICAgLy8gaWYgd2UncmUgdGVybWluYXRpbmcsIGdvIGFoZWFkIGFuZCBjb21taXQgaW1tZWRpYXRlbHlcbiAgICAgIGlmIChpbW1lZGlhdGUpIHtcbiAgICAgICAgZGVib3VuY2VkLmZsdXNoKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlc3VsdDogZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFLFxuICAgICAgICBlcnJvckNvZGU6IDAsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcHJvY2Vzcyh1cmwsIHBhcmFtcywgdGhpcy5zZXR0aW5ncywgdGhpcy5lcnJvcl9jb2Rlcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRocm93cyBhIFNDT1JNIGVycm9yXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aGVuIC0gdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gd2FpdCBiZWZvcmUgY29tbWl0dGluZ1xuICAgKi9cbiAgc2NoZWR1bGVDb21taXQod2hlbjogbnVtYmVyKSB7XG4gICAgdGhpcy4jdGltZW91dCA9IG5ldyBTY2hlZHVsZWRDb21taXQodGhpcywgd2hlbik7XG4gICAgdGhpcy5hcGlMb2coJ3NjaGVkdWxlQ29tbWl0JywgJycsICdzY2hlZHVsZWQnLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9ERUJVRyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIGFuZCBjYW5jZWxzIGFueSBjdXJyZW50bHkgc2NoZWR1bGVkIGNvbW1pdHNcbiAgICovXG4gIGNsZWFyU2NoZWR1bGVkQ29tbWl0KCkge1xuICAgIGlmICh0aGlzLiN0aW1lb3V0KSB7XG4gICAgICB0aGlzLiN0aW1lb3V0LmNhbmNlbCgpO1xuICAgICAgdGhpcy4jdGltZW91dCA9IG51bGw7XG4gICAgICB0aGlzLmFwaUxvZygnY2xlYXJTY2hlZHVsZWRDb21taXQnLCAnJywgJ2NsZWFyZWQnLFxuICAgICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0RFQlVHKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBQcml2YXRlIGNsYXNzIHRoYXQgd3JhcHMgYSB0aW1lb3V0IGNhbGwgdG8gdGhlIGNvbW1pdCgpIGZ1bmN0aW9uXG4gKi9cbmNsYXNzIFNjaGVkdWxlZENvbW1pdCB7XG4gICNBUEk7XG4gICNjYW5jZWxsZWQgPSBmYWxzZTtcbiAgI3RpbWVvdXQ7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBTY2hlZHVsZWRDb21taXRcbiAgICogQHBhcmFtIHtCYXNlQVBJfSBBUElcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdoZW5cbiAgICovXG4gIGNvbnN0cnVjdG9yKEFQSTogYW55LCB3aGVuOiBudW1iZXIpIHtcbiAgICB0aGlzLiNBUEkgPSBBUEk7XG4gICAgdGhpcy4jdGltZW91dCA9IHNldFRpbWVvdXQodGhpcy53cmFwcGVyLmJpbmQodGhpcyksIHdoZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbmNlbCBhbnkgY3VycmVudGx5IHNjaGVkdWxlZCBjb21taXRcbiAgICovXG4gIGNhbmNlbCgpIHtcbiAgICB0aGlzLiNjYW5jZWxsZWQgPSB0cnVlO1xuICAgIGlmICh0aGlzLiN0aW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy4jdGltZW91dCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFdyYXAgdGhlIEFQSSBjb21taXQgY2FsbCB0byBjaGVjayBpZiB0aGUgY2FsbCBoYXMgYWxyZWFkeSBiZWVuIGNhbmNlbGxlZFxuICAgKi9cbiAgd3JhcHBlcigpIHtcbiAgICBpZiAoIXRoaXMuI2NhbmNlbGxlZCkge1xuICAgICAgdGhpcy4jQVBJLmNvbW1pdCgpO1xuICAgIH1cbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCBCYXNlQVBJIGZyb20gJy4vQmFzZUFQSSc7XG5pbXBvcnQge1xuICBDTUksXG4gIENNSUludGVyYWN0aW9uc0NvcnJlY3RSZXNwb25zZXNPYmplY3QsXG4gIENNSUludGVyYWN0aW9uc09iamVjdCxcbiAgQ01JSW50ZXJhY3Rpb25zT2JqZWN0aXZlc09iamVjdCxcbiAgQ01JT2JqZWN0aXZlc09iamVjdCwgTkFWLFxufSBmcm9tICcuL2NtaS9zY29ybTEyX2NtaSc7XG5pbXBvcnQgKiBhcyBVdGlsaXRpZXMgZnJvbSAnLi91dGlsaXRpZXMnO1xuaW1wb3J0IEFQSUNvbnN0YW50cyBmcm9tICcuL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCBFcnJvckNvZGVzIGZyb20gJy4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJztcblxuY29uc3Qgc2Nvcm0xMl9jb25zdGFudHMgPSBBUElDb25zdGFudHMuc2Nvcm0xMjtcbmNvbnN0IGdsb2JhbF9jb25zdGFudHMgPSBBUElDb25zdGFudHMuZ2xvYmFsO1xuY29uc3Qgc2Nvcm0xMl9lcnJvcl9jb2RlcyA9IEVycm9yQ29kZXMuc2Nvcm0xMjtcblxuLyoqXG4gKiBBUEkgY2xhc3MgZm9yIFNDT1JNIDEuMlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY29ybTEyQVBJIGV4dGVuZHMgQmFzZUFQSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgU0NPUk0gMS4yIEFQSVxuICAgKiBAcGFyYW0ge29iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiB7fSkge1xuICAgIGNvbnN0IGZpbmFsU2V0dGluZ3MgPSB7XG4gICAgICAuLi57XG4gICAgICAgIG1hc3Rlcnlfb3ZlcnJpZGU6IGZhbHNlLFxuICAgICAgfSwgLi4uc2V0dGluZ3MsXG4gICAgfTtcblxuICAgIHN1cGVyKHNjb3JtMTJfZXJyb3JfY29kZXMsIGZpbmFsU2V0dGluZ3MpO1xuXG4gICAgdGhpcy5jbWkgPSBuZXcgQ01JKCk7XG4gICAgdGhpcy5uYXYgPSBuZXcgTkFWKCk7XG5cbiAgICAvLyBSZW5hbWUgZnVuY3Rpb25zIHRvIG1hdGNoIDEuMiBTcGVjIGFuZCBleHBvc2UgdG8gbW9kdWxlc1xuICAgIHRoaXMuTE1TSW5pdGlhbGl6ZSA9IHRoaXMubG1zSW5pdGlhbGl6ZTtcbiAgICB0aGlzLkxNU0ZpbmlzaCA9IHRoaXMubG1zRmluaXNoO1xuICAgIHRoaXMuTE1TR2V0VmFsdWUgPSB0aGlzLmxtc0dldFZhbHVlO1xuICAgIHRoaXMuTE1TU2V0VmFsdWUgPSB0aGlzLmxtc1NldFZhbHVlO1xuICAgIHRoaXMuTE1TQ29tbWl0ID0gdGhpcy5sbXNDb21taXQ7XG4gICAgdGhpcy5MTVNHZXRMYXN0RXJyb3IgPSB0aGlzLmxtc0dldExhc3RFcnJvcjtcbiAgICB0aGlzLkxNU0dldEVycm9yU3RyaW5nID0gdGhpcy5sbXNHZXRFcnJvclN0cmluZztcbiAgICB0aGlzLkxNU0dldERpYWdub3N0aWMgPSB0aGlzLmxtc0dldERpYWdub3N0aWM7XG4gIH1cblxuICAvKipcbiAgICogbG1zSW5pdGlhbGl6ZSBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYm9vbFxuICAgKi9cbiAgbG1zSW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLmNtaS5pbml0aWFsaXplKCk7XG4gICAgcmV0dXJuIHRoaXMuaW5pdGlhbGl6ZSgnTE1TSW5pdGlhbGl6ZScsICdMTVMgd2FzIGFscmVhZHkgaW5pdGlhbGl6ZWQhJyxcbiAgICAgICAgJ0xNUyBpcyBhbHJlYWR5IGZpbmlzaGVkIScpO1xuICB9XG5cbiAgLyoqXG4gICAqIExNU0ZpbmlzaCBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYm9vbFxuICAgKi9cbiAgbG1zRmluaXNoKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMudGVybWluYXRlKCdMTVNGaW5pc2gnLCBmYWxzZSk7XG5cbiAgICBpZiAocmVzdWx0ID09PSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUUpIHtcbiAgICAgIGlmICh0aGlzLm5hdi5ldmVudCAhPT0gJycpIHtcbiAgICAgICAgaWYgKHRoaXMubmF2LmV2ZW50ID09PSAnY29udGludWUnKSB7XG4gICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZU5leHQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlUHJldmlvdXMnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLmF1dG9Qcm9ncmVzcykge1xuICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlTmV4dCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogTE1TR2V0VmFsdWUgZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXRWYWx1ZShDTUlFbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUoJ0xNU0dldFZhbHVlJywgZmFsc2UsIENNSUVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIExNU1NldFZhbHVlIGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNTZXRWYWx1ZShDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnNldFZhbHVlKCdMTVNTZXRWYWx1ZScsIGZhbHNlLCBDTUlFbGVtZW50LCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogTE1TQ29tbWl0IGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSBib29sXG4gICAqL1xuICBsbXNDb21taXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29tbWl0KCdMTVNDb21taXQnLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogTE1TR2V0TGFzdEVycm9yIGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zR2V0TGFzdEVycm9yKCkge1xuICAgIHJldHVybiB0aGlzLmdldExhc3RFcnJvcignTE1TR2V0TGFzdEVycm9yJyk7XG4gIH1cblxuICAvKipcbiAgICogTE1TR2V0RXJyb3JTdHJpbmcgZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRXJyb3JDb2RlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc0dldEVycm9yU3RyaW5nKENNSUVycm9yQ29kZSkge1xuICAgIHJldHVybiB0aGlzLmdldEVycm9yU3RyaW5nKCdMTVNHZXRFcnJvclN0cmluZycsIENNSUVycm9yQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogTE1TR2V0RGlhZ25vc3RpYyBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFcnJvckNvZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zR2V0RGlhZ25vc3RpYyhDTUlFcnJvckNvZGUpIHtcbiAgICByZXR1cm4gdGhpcy5nZXREaWFnbm9zdGljKCdMTVNHZXREaWFnbm9zdGljJywgQ01JRXJyb3JDb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGEgdmFsdWUgb24gdGhlIENNSSBPYmplY3RcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBzZXRDTUlWYWx1ZShDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9jb21tb25TZXRDTUlWYWx1ZSgnTE1TU2V0VmFsdWUnLCBmYWxzZSwgQ01JRWxlbWVudCwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSB2YWx1ZSBmcm9tIHRoZSBDTUkgT2JqZWN0XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXRDTUlWYWx1ZShDTUlFbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbW1vbkdldENNSVZhbHVlKCdnZXRDTUlWYWx1ZScsIGZhbHNlLCBDTUlFbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIG9yIGJ1aWxkcyBhIG5ldyBjaGlsZCBlbGVtZW50IHRvIGFkZCB0byB0aGUgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHBhcmFtIHtib29sZWFufSBmb3VuZEZpcnN0SW5kZXhcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cbiAgZ2V0Q2hpbGRFbGVtZW50KENNSUVsZW1lbnQsIHZhbHVlLCBmb3VuZEZpcnN0SW5kZXgpIHtcbiAgICBsZXQgbmV3Q2hpbGQ7XG5cbiAgICBpZiAodGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsICdjbWlcXFxcLm9iamVjdGl2ZXNcXFxcLlxcXFxkKycpKSB7XG4gICAgICBuZXdDaGlsZCA9IG5ldyBDTUlPYmplY3RpdmVzT2JqZWN0KCk7XG4gICAgfSBlbHNlIGlmIChmb3VuZEZpcnN0SW5kZXggJiYgdGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsXG4gICAgICAgICdjbWlcXFxcLmludGVyYWN0aW9uc1xcXFwuXFxcXGQrXFxcXC5jb3JyZWN0X3Jlc3BvbnNlc1xcXFwuXFxcXGQrJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSUludGVyYWN0aW9uc0NvcnJlY3RSZXNwb25zZXNPYmplY3QoKTtcbiAgICB9IGVsc2UgaWYgKGZvdW5kRmlyc3RJbmRleCAmJiB0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCxcbiAgICAgICAgJ2NtaVxcXFwuaW50ZXJhY3Rpb25zXFxcXC5cXFxcZCtcXFxcLm9iamVjdGl2ZXNcXFxcLlxcXFxkKycpKSB7XG4gICAgICBuZXdDaGlsZCA9IG5ldyBDTUlJbnRlcmFjdGlvbnNPYmplY3RpdmVzT2JqZWN0KCk7XG4gICAgfSBlbHNlIGlmICghZm91bmRGaXJzdEluZGV4ICYmXG4gICAgICAgIHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LCAnY21pXFxcXC5pbnRlcmFjdGlvbnNcXFxcLlxcXFxkKycpKSB7XG4gICAgICBuZXdDaGlsZCA9IG5ldyBDTUlJbnRlcmFjdGlvbnNPYmplY3QoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3Q2hpbGQ7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGVzIENvcnJlY3QgUmVzcG9uc2UgdmFsdWVzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIHZhbGlkYXRlQ29ycmVjdFJlc3BvbnNlKENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWVzc2FnZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGVycm9yTnVtYmVyLlxuICAgKlxuICAgKiBAcGFyYW0geyp9IGVycm9yTnVtYmVyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbiB9ZGV0YWlsXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldExtc0Vycm9yTWVzc2FnZURldGFpbHMoZXJyb3JOdW1iZXIsIGRldGFpbCkge1xuICAgIGxldCBiYXNpY01lc3NhZ2UgPSAnTm8gRXJyb3InO1xuICAgIGxldCBkZXRhaWxNZXNzYWdlID0gJ05vIEVycm9yJztcblxuICAgIC8vIFNldCBlcnJvciBudW1iZXIgdG8gc3RyaW5nIHNpbmNlIGluY29uc2lzdGVudCBmcm9tIG1vZHVsZXMgaWYgc3RyaW5nIG9yIG51bWJlclxuICAgIGVycm9yTnVtYmVyID0gU3RyaW5nKGVycm9yTnVtYmVyKTtcbiAgICBpZiAoc2Nvcm0xMl9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW2Vycm9yTnVtYmVyXSkge1xuICAgICAgYmFzaWNNZXNzYWdlID0gc2Nvcm0xMl9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW2Vycm9yTnVtYmVyXS5iYXNpY01lc3NhZ2U7XG4gICAgICBkZXRhaWxNZXNzYWdlID0gc2Nvcm0xMl9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW2Vycm9yTnVtYmVyXS5kZXRhaWxNZXNzYWdlO1xuICAgIH1cblxuICAgIHJldHVybiBkZXRhaWwgPyBkZXRhaWxNZXNzYWdlIDogYmFzaWNNZXNzYWdlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgdGhlIHdob2xlIEFQSSB3aXRoIGFub3RoZXJcbiAgICpcbiAgICogQHBhcmFtIHtTY29ybTEyQVBJfSBuZXdBUElcbiAgICovXG4gIHJlcGxhY2VXaXRoQW5vdGhlclNjb3JtQVBJKG5ld0FQSSkge1xuICAgIC8vIERhdGEgTW9kZWxcbiAgICB0aGlzLmNtaSA9IG5ld0FQSS5jbWk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBjbWkgb2JqZWN0IHRvIHRoZSBwcm9wZXIgZm9ybWF0IGZvciBMTVMgY29tbWl0XG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdGVybWluYXRlQ29tbWl0XG4gICAqIEByZXR1cm4ge29iamVjdHxBcnJheX1cbiAgICovXG4gIHJlbmRlckNvbW1pdENNSSh0ZXJtaW5hdGVDb21taXQ6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBjbWlFeHBvcnQgPSB0aGlzLnJlbmRlckNNSVRvSlNPTk9iamVjdCgpO1xuXG4gICAgaWYgKHRlcm1pbmF0ZUNvbW1pdCkge1xuICAgICAgY21pRXhwb3J0LmNtaS5jb3JlLnRvdGFsX3RpbWUgPSB0aGlzLmNtaS5nZXRDdXJyZW50VG90YWxUaW1lKCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgY29uc3QgZmxhdHRlbmVkID0gVXRpbGl0aWVzLmZsYXR0ZW4oY21pRXhwb3J0KTtcbiAgICBzd2l0Y2ggKHRoaXMuc2V0dGluZ3MuZGF0YUNvbW1pdEZvcm1hdCkge1xuICAgICAgY2FzZSAnZmxhdHRlbmVkJzpcbiAgICAgICAgcmV0dXJuIFV0aWxpdGllcy5mbGF0dGVuKGNtaUV4cG9ydCk7XG4gICAgICBjYXNlICdwYXJhbXMnOlxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gaW4gZmxhdHRlbmVkKSB7XG4gICAgICAgICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoZmxhdHRlbmVkLCBpdGVtKSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goYCR7aXRlbX09JHtmbGF0dGVuZWRbaXRlbV19YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICBjYXNlICdqc29uJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBjbWlFeHBvcnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHRzIHRvIHN0b3JlIHRoZSBkYXRhIHRvIHRoZSBMTVNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSB0ZXJtaW5hdGVDb21taXRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgc3RvcmVEYXRhKHRlcm1pbmF0ZUNvbW1pdDogYm9vbGVhbikge1xuICAgIGlmICh0ZXJtaW5hdGVDb21taXQpIHtcbiAgICAgIGNvbnN0IG9yaWdpbmFsU3RhdHVzID0gdGhpcy5jbWkuY29yZS5sZXNzb25fc3RhdHVzO1xuICAgICAgaWYgKG9yaWdpbmFsU3RhdHVzID09PSAnbm90IGF0dGVtcHRlZCcpIHtcbiAgICAgICAgdGhpcy5jbWkuY29yZS5sZXNzb25fc3RhdHVzID0gJ2NvbXBsZXRlZCc7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmNtaS5jb3JlLmxlc3Nvbl9tb2RlID09PSAnbm9ybWFsJykge1xuICAgICAgICBpZiAodGhpcy5jbWkuY29yZS5jcmVkaXQgPT09ICdjcmVkaXQnKSB7XG4gICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MubWFzdGVyeV9vdmVycmlkZSAmJlxuICAgICAgICAgICAgICB0aGlzLmNtaS5zdHVkZW50X2RhdGEubWFzdGVyeV9zY29yZSAhPT0gJycgJiZcbiAgICAgICAgICAgICAgdGhpcy5jbWkuY29yZS5zY29yZS5yYXcgIT09ICcnKSB7XG4gICAgICAgICAgICBpZiAocGFyc2VGbG9hdCh0aGlzLmNtaS5jb3JlLnNjb3JlLnJhdykgPj1cbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KHRoaXMuY21pLnN0dWRlbnRfZGF0YS5tYXN0ZXJ5X3Njb3JlKSkge1xuICAgICAgICAgICAgICB0aGlzLmNtaS5jb3JlLmxlc3Nvbl9zdGF0dXMgPSAncGFzc2VkJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuY21pLmNvcmUubGVzc29uX3N0YXR1cyA9ICdmYWlsZWQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNtaS5jb3JlLmxlc3Nvbl9tb2RlID09PSAnYnJvd3NlJykge1xuICAgICAgICBpZiAoKHRoaXMuc3RhcnRpbmdEYXRhPy5jbWk/LmNvcmU/Lmxlc3Nvbl9zdGF0dXMgfHwgJycpID09PSAnJyAmJlxuICAgICAgICAgICAgb3JpZ2luYWxTdGF0dXMgPT09ICdub3QgYXR0ZW1wdGVkJykge1xuICAgICAgICAgIHRoaXMuY21pLmNvcmUubGVzc29uX3N0YXR1cyA9ICdicm93c2VkJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGNvbW1pdE9iamVjdCA9IHRoaXMucmVuZGVyQ29tbWl0Q01JKHRlcm1pbmF0ZUNvbW1pdCk7XG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5sbXNDb21taXRVcmwpIHtcbiAgICAgIGlmICh0aGlzLmFwaUxvZ0xldmVsID09PSBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9ERUJVRykge1xuICAgICAgICBjb25zb2xlLmRlYnVnKCdDb21taXQgKHRlcm1pbmF0ZWQ6ICcgK1xuICAgICAgICAgICAgKHRlcm1pbmF0ZUNvbW1pdCA/ICd5ZXMnIDogJ25vJykgKyAnKTogJyk7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoY29tbWl0T2JqZWN0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NIdHRwUmVxdWVzdCh0aGlzLnNldHRpbmdzLmxtc0NvbW1pdFVybCwgY29tbWl0T2JqZWN0LCB0ZXJtaW5hdGVDb21taXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnQ29tbWl0ICh0ZXJtaW5hdGVkOiAnICtcbiAgICAgICAgICAodGVybWluYXRlQ29tbWl0ID8gJ3llcycgOiAnbm8nKSArICcpOiAnKTtcbiAgICAgIGNvbnNvbGUubG9nKGNvbW1pdE9iamVjdCk7XG4gICAgICByZXR1cm4gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgIH1cbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCBCYXNlQVBJIGZyb20gJy4vQmFzZUFQSSc7XG5pbXBvcnQge1xuICBBREwsXG4gIENNSSxcbiAgQ01JQ29tbWVudHNPYmplY3QsXG4gIENNSUludGVyYWN0aW9uc0NvcnJlY3RSZXNwb25zZXNPYmplY3QsXG4gIENNSUludGVyYWN0aW9uc09iamVjdCxcbiAgQ01JSW50ZXJhY3Rpb25zT2JqZWN0aXZlc09iamVjdCxcbiAgQ01JT2JqZWN0aXZlc09iamVjdCxcbn0gZnJvbSAnLi9jbWkvc2Nvcm0yMDA0X2NtaSc7XG5pbXBvcnQgKiBhcyBVdGlsaXRpZXMgZnJvbSAnLi91dGlsaXRpZXMnO1xuaW1wb3J0IEFQSUNvbnN0YW50cyBmcm9tICcuL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCBFcnJvckNvZGVzIGZyb20gJy4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJztcbmltcG9ydCBSZXNwb25zZXMgZnJvbSAnLi9jb25zdGFudHMvcmVzcG9uc2VfY29uc3RhbnRzJztcbmltcG9ydCBWYWxpZExhbmd1YWdlcyBmcm9tICcuL2NvbnN0YW50cy9sYW5ndWFnZV9jb25zdGFudHMnO1xuaW1wb3J0IFJlZ2V4IGZyb20gJy4vY29uc3RhbnRzL3JlZ2V4JztcblxuY29uc3Qgc2Nvcm0yMDA0X2NvbnN0YW50cyA9IEFQSUNvbnN0YW50cy5zY29ybTIwMDQ7XG5jb25zdCBnbG9iYWxfY29uc3RhbnRzID0gQVBJQ29uc3RhbnRzLmdsb2JhbDtcbmNvbnN0IHNjb3JtMjAwNF9lcnJvcl9jb2RlcyA9IEVycm9yQ29kZXMuc2Nvcm0yMDA0O1xuY29uc3QgY29ycmVjdF9yZXNwb25zZXMgPSBSZXNwb25zZXMuY29ycmVjdDtcbmNvbnN0IHNjb3JtMjAwNF9yZWdleCA9IFJlZ2V4LnNjb3JtMjAwNDtcblxuLyoqXG4gKiBBUEkgY2xhc3MgZm9yIFNDT1JNIDIwMDRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2Nvcm0yMDA0QVBJIGV4dGVuZHMgQmFzZUFQSSB7XG4gICN2ZXJzaW9uOiAnMS4wJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIFNDT1JNIDIwMDQgQVBJXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IHt9KSB7XG4gICAgY29uc3QgZmluYWxTZXR0aW5ncyA9IHtcbiAgICAgIC4uLntcbiAgICAgICAgbWFzdGVyeV9vdmVycmlkZTogZmFsc2UsXG4gICAgICB9LCAuLi5zZXR0aW5ncyxcbiAgICB9O1xuXG4gICAgc3VwZXIoc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLCBmaW5hbFNldHRpbmdzKTtcblxuICAgIHRoaXMuY21pID0gbmV3IENNSSgpO1xuICAgIHRoaXMuYWRsID0gbmV3IEFETCgpO1xuXG4gICAgLy8gUmVuYW1lIGZ1bmN0aW9ucyB0byBtYXRjaCAyMDA0IFNwZWMgYW5kIGV4cG9zZSB0byBtb2R1bGVzXG4gICAgdGhpcy5Jbml0aWFsaXplID0gdGhpcy5sbXNJbml0aWFsaXplO1xuICAgIHRoaXMuVGVybWluYXRlID0gdGhpcy5sbXNUZXJtaW5hdGU7XG4gICAgdGhpcy5HZXRWYWx1ZSA9IHRoaXMubG1zR2V0VmFsdWU7XG4gICAgdGhpcy5TZXRWYWx1ZSA9IHRoaXMubG1zU2V0VmFsdWU7XG4gICAgdGhpcy5Db21taXQgPSB0aGlzLmxtc0NvbW1pdDtcbiAgICB0aGlzLkdldExhc3RFcnJvciA9IHRoaXMubG1zR2V0TGFzdEVycm9yO1xuICAgIHRoaXMuR2V0RXJyb3JTdHJpbmcgPSB0aGlzLmxtc0dldEVycm9yU3RyaW5nO1xuICAgIHRoaXMuR2V0RGlhZ25vc3RpYyA9IHRoaXMubG1zR2V0RGlhZ25vc3RpYztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN2ZXJzaW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB2ZXJzaW9uKCkge1xuICAgIHJldHVybiB0aGlzLiN2ZXJzaW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYm9vbFxuICAgKi9cbiAgbG1zSW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLmNtaS5pbml0aWFsaXplKCk7XG4gICAgcmV0dXJuIHRoaXMuaW5pdGlhbGl6ZSgnSW5pdGlhbGl6ZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYm9vbFxuICAgKi9cbiAgbG1zVGVybWluYXRlKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMudGVybWluYXRlKCdUZXJtaW5hdGUnLCB0cnVlKTtcblxuICAgIGlmIChyZXN1bHQgPT09IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRSkge1xuICAgICAgaWYgKHRoaXMuYWRsLm5hdi5yZXF1ZXN0ICE9PSAnX25vbmVfJykge1xuICAgICAgICBzd2l0Y2ggKHRoaXMuYWRsLm5hdi5yZXF1ZXN0KSB7XG4gICAgICAgICAgY2FzZSAnY29udGludWUnOlxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZU5leHQnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3ByZXZpb3VzJzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VQcmV2aW91cycpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnY2hvaWNlJzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VDaG9pY2UnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2V4aXQnOlxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZUV4aXQnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2V4aXRBbGwnOlxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZUV4aXRBbGwnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2FiYW5kb24nOlxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZUFiYW5kb24nKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2FiYW5kb25BbGwnOlxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZUFiYW5kb25BbGwnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc2V0dGluZ3MuYXV0b1Byb2dyZXNzKSB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VOZXh0Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXRWYWx1ZShDTUlFbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUoJ0dldFZhbHVlJywgdHJ1ZSwgQ01JRWxlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHthbnl9IHZhbHVlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc1NldFZhbHVlKENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0VmFsdWUoJ1NldFZhbHVlJywgdHJ1ZSwgQ01JRWxlbWVudCwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE9yZGVycyBMTVMgdG8gc3RvcmUgYWxsIGNvbnRlbnQgcGFyYW1ldGVyc1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJvb2xcbiAgICovXG4gIGxtc0NvbW1pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb21taXQoJ0NvbW1pdCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgbGFzdCBlcnJvciBjb2RlXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc0dldExhc3RFcnJvcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRMYXN0RXJyb3IoJ0dldExhc3RFcnJvcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGVycm9yTnVtYmVyIGVycm9yIGRlc2NyaXB0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXIpfSBDTUlFcnJvckNvZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zR2V0RXJyb3JTdHJpbmcoQ01JRXJyb3JDb2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RXJyb3JTdHJpbmcoJ0dldEVycm9yU3RyaW5nJywgQ01JRXJyb3JDb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgY29tcHJlaGVuc2l2ZSBkZXNjcmlwdGlvbiBvZiB0aGUgZXJyb3JOdW1iZXIgZXJyb3IuXG4gICAqXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXIpfSBDTUlFcnJvckNvZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zR2V0RGlhZ25vc3RpYyhDTUlFcnJvckNvZGUpIHtcbiAgICByZXR1cm4gdGhpcy5nZXREaWFnbm9zdGljKCdHZXREaWFnbm9zdGljJywgQ01JRXJyb3JDb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGEgdmFsdWUgb24gdGhlIENNSSBPYmplY3RcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHthbnl9IHZhbHVlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHNldENNSVZhbHVlKENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbW1vblNldENNSVZhbHVlKCdTZXRWYWx1ZScsIHRydWUsIENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIG9yIGJ1aWxkcyBhIG5ldyBjaGlsZCBlbGVtZW50IHRvIGFkZCB0byB0aGUgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvdW5kRmlyc3RJbmRleFxuICAgKiBAcmV0dXJuIHthbnl9XG4gICAqL1xuICBnZXRDaGlsZEVsZW1lbnQoQ01JRWxlbWVudCwgdmFsdWUsIGZvdW5kRmlyc3RJbmRleCkge1xuICAgIGxldCBuZXdDaGlsZDtcblxuICAgIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ2NtaVxcXFwub2JqZWN0aXZlc1xcXFwuXFxcXGQrJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSU9iamVjdGl2ZXNPYmplY3QoKTtcbiAgICB9IGVsc2UgaWYgKGZvdW5kRmlyc3RJbmRleCAmJiB0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCxcbiAgICAgICAgJ2NtaVxcXFwuaW50ZXJhY3Rpb25zXFxcXC5cXFxcZCtcXFxcLmNvcnJlY3RfcmVzcG9uc2VzXFxcXC5cXFxcZCsnKSkge1xuICAgICAgY29uc3QgcGFydHMgPSBDTUlFbGVtZW50LnNwbGl0KCcuJyk7XG4gICAgICBjb25zdCBpbmRleCA9IE51bWJlcihwYXJ0c1syXSk7XG4gICAgICBjb25zdCBpbnRlcmFjdGlvbiA9IHRoaXMuY21pLmludGVyYWN0aW9ucy5jaGlsZEFycmF5W2luZGV4XTtcbiAgICAgIGlmICghaW50ZXJhY3Rpb24udHlwZSkge1xuICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuREVQRU5ERU5DWV9OT1RfRVNUQUJMSVNIRUQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgaW50ZXJhY3Rpb25fdHlwZSA9IGludGVyYWN0aW9uLnR5cGU7XG4gICAgICAgIGNvbnN0IGludGVyYWN0aW9uX2NvdW50ID0gaW50ZXJhY3Rpb24uY29ycmVjdF9yZXNwb25zZXMuX2NvdW50O1xuICAgICAgICBpZiAoaW50ZXJhY3Rpb25fdHlwZSA9PT0gJ2Nob2ljZScpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGludGVyYWN0aW9uX2NvdW50ICYmIHRoaXMubGFzdEVycm9yQ29kZSA9PT1cbiAgICAgICAgICAwOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gaW50ZXJhY3Rpb24uY29ycmVjdF9yZXNwb25zZXMuY2hpbGRBcnJheVtpXTtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5wYXR0ZXJuID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuR0VORVJBTF9TRVRfRkFJTFVSRSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzcG9uc2VfdHlwZSA9IGNvcnJlY3RfcmVzcG9uc2VzW2ludGVyYWN0aW9uX3R5cGVdO1xuICAgICAgICBpZiAocmVzcG9uc2VfdHlwZSkge1xuICAgICAgICAgIGxldCBub2RlcyA9IFtdO1xuICAgICAgICAgIGlmIChyZXNwb25zZV90eXBlPy5kZWxpbWl0ZXIpIHtcbiAgICAgICAgICAgIG5vZGVzID0gU3RyaW5nKHZhbHVlKS5zcGxpdChyZXNwb25zZV90eXBlLmRlbGltaXRlcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5vZGVzWzBdID0gdmFsdWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKG5vZGVzLmxlbmd0aCA+IDAgJiYgbm9kZXMubGVuZ3RoIDw9IHJlc3BvbnNlX3R5cGUubWF4KSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrQ29ycmVjdFJlc3BvbnNlVmFsdWUoaW50ZXJhY3Rpb25fdHlwZSwgbm9kZXMsIHZhbHVlKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG5vZGVzLmxlbmd0aCA+IHJlc3BvbnNlX3R5cGUubWF4KSB7XG4gICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuR0VORVJBTF9TRVRfRkFJTFVSRSxcbiAgICAgICAgICAgICAgICAnRGF0YSBNb2RlbCBFbGVtZW50IFBhdHRlcm4gVG9vIExvbmcnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUsXG4gICAgICAgICAgICAgICdJbmNvcnJlY3QgUmVzcG9uc2UgVHlwZTogJyArIGludGVyYWN0aW9uX3R5cGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5sYXN0RXJyb3JDb2RlID09PSAwKSB7XG4gICAgICAgIG5ld0NoaWxkID0gbmV3IENNSUludGVyYWN0aW9uc0NvcnJlY3RSZXNwb25zZXNPYmplY3QoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZvdW5kRmlyc3RJbmRleCAmJiB0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCxcbiAgICAgICAgJ2NtaVxcXFwuaW50ZXJhY3Rpb25zXFxcXC5cXFxcZCtcXFxcLm9iamVjdGl2ZXNcXFxcLlxcXFxkKycpKSB7XG4gICAgICBuZXdDaGlsZCA9IG5ldyBDTUlJbnRlcmFjdGlvbnNPYmplY3RpdmVzT2JqZWN0KCk7XG4gICAgfSBlbHNlIGlmICghZm91bmRGaXJzdEluZGV4ICYmXG4gICAgICAgIHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LCAnY21pXFxcXC5pbnRlcmFjdGlvbnNcXFxcLlxcXFxkKycpKSB7XG4gICAgICBuZXdDaGlsZCA9IG5ldyBDTUlJbnRlcmFjdGlvbnNPYmplY3QoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LFxuICAgICAgICAnY21pXFxcXC5jb21tZW50c19mcm9tX2xlYXJuZXJcXFxcLlxcXFxkKycpKSB7XG4gICAgICBuZXdDaGlsZCA9IG5ldyBDTUlDb21tZW50c09iamVjdCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsXG4gICAgICAgICdjbWlcXFxcLmNvbW1lbnRzX2Zyb21fbG1zXFxcXC5cXFxcZCsnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JQ29tbWVudHNPYmplY3QodHJ1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0NoaWxkO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIGNvcnJlY3QgcmVzcG9uc2UuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICovXG4gIHZhbGlkYXRlQ29ycmVjdFJlc3BvbnNlKENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgY29uc3QgcGFydHMgPSBDTUlFbGVtZW50LnNwbGl0KCcuJyk7XG4gICAgY29uc3QgaW5kZXggPSBOdW1iZXIocGFydHNbMl0pO1xuICAgIGNvbnN0IHBhdHRlcm5faW5kZXggPSBOdW1iZXIocGFydHNbNF0pO1xuICAgIGNvbnN0IGludGVyYWN0aW9uID0gdGhpcy5jbWkuaW50ZXJhY3Rpb25zLmNoaWxkQXJyYXlbaW5kZXhdO1xuXG4gICAgY29uc3QgaW50ZXJhY3Rpb25fdHlwZSA9IGludGVyYWN0aW9uLnR5cGU7XG4gICAgY29uc3QgaW50ZXJhY3Rpb25fY291bnQgPSBpbnRlcmFjdGlvbi5jb3JyZWN0X3Jlc3BvbnNlcy5fY291bnQ7XG4gICAgaWYgKGludGVyYWN0aW9uX3R5cGUgPT09ICdjaG9pY2UnKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGludGVyYWN0aW9uX2NvdW50ICYmIHRoaXMubGFzdEVycm9yQ29kZSA9PT0gMDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gaW50ZXJhY3Rpb24uY29ycmVjdF9yZXNwb25zZXMuY2hpbGRBcnJheVtpXTtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnBhdHRlcm4gPT09IHZhbHVlKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2VfdHlwZSA9IGNvcnJlY3RfcmVzcG9uc2VzW2ludGVyYWN0aW9uX3R5cGVdO1xuICAgIGlmICh0eXBlb2YgcmVzcG9uc2VfdHlwZS5saW1pdCA9PT0gJ3VuZGVmaW5lZCcgfHwgaW50ZXJhY3Rpb25fY291bnQgPD1cbiAgICAgICAgcmVzcG9uc2VfdHlwZS5saW1pdCkge1xuICAgICAgbGV0IG5vZGVzID0gW107XG4gICAgICBpZiAocmVzcG9uc2VfdHlwZT8uZGVsaW1pdGVyKSB7XG4gICAgICAgIG5vZGVzID0gU3RyaW5nKHZhbHVlKS5zcGxpdChyZXNwb25zZV90eXBlLmRlbGltaXRlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2Rlc1swXSA9IHZhbHVlO1xuICAgICAgfVxuXG4gICAgICBpZiAobm9kZXMubGVuZ3RoID4gMCAmJiBub2Rlcy5sZW5ndGggPD0gcmVzcG9uc2VfdHlwZS5tYXgpIHtcbiAgICAgICAgdGhpcy5jaGVja0NvcnJlY3RSZXNwb25zZVZhbHVlKGludGVyYWN0aW9uX3R5cGUsIG5vZGVzLCB2YWx1ZSk7XG4gICAgICB9IGVsc2UgaWYgKG5vZGVzLmxlbmd0aCA+IHJlc3BvbnNlX3R5cGUubWF4KSB7XG4gICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5HRU5FUkFMX1NFVF9GQUlMVVJFLFxuICAgICAgICAgICAgJ0RhdGEgTW9kZWwgRWxlbWVudCBQYXR0ZXJuIFRvbyBMb25nJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmxhc3RFcnJvckNvZGUgPT09IDAgJiZcbiAgICAgICAgICAoIXJlc3BvbnNlX3R5cGUuZHVwbGljYXRlIHx8XG4gICAgICAgICAgICAgICF0aGlzLmNoZWNrRHVwbGljYXRlZFBhdHRlcm4oaW50ZXJhY3Rpb24uY29ycmVjdF9yZXNwb25zZXMsXG4gICAgICAgICAgICAgICAgICBwYXR0ZXJuX2luZGV4LCB2YWx1ZSkpIHx8XG4gICAgICAgICAgKHRoaXMubGFzdEVycm9yQ29kZSA9PT0gMCAmJiB2YWx1ZSA9PT0gJycpKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmcsIHdlIHdhbnQgdGhlIGludmVyc2VcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLmxhc3RFcnJvckNvZGUgPT09IDApIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuR0VORVJBTF9TRVRfRkFJTFVSRSxcbiAgICAgICAgICAgICAgJ0RhdGEgTW9kZWwgRWxlbWVudCBQYXR0ZXJuIEFscmVhZHkgRXhpc3RzJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUsXG4gICAgICAgICAgJ0RhdGEgTW9kZWwgRWxlbWVudCBDb2xsZWN0aW9uIExpbWl0IFJlYWNoZWQnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHZhbHVlIGZyb20gdGhlIENNSSBPYmplY3RcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldENNSVZhbHVlKENNSUVsZW1lbnQpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tbW9uR2V0Q01JVmFsdWUoJ0dldFZhbHVlJywgdHJ1ZSwgQ01JRWxlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWVzc2FnZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGVycm9yTnVtYmVyLlxuICAgKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gZXJyb3JOdW1iZXJcbiAgICogQHBhcmFtIHtib29sZWFufSBkZXRhaWxcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhlcnJvck51bWJlciwgZGV0YWlsKSB7XG4gICAgbGV0IGJhc2ljTWVzc2FnZSA9ICcnO1xuICAgIGxldCBkZXRhaWxNZXNzYWdlID0gJyc7XG5cbiAgICAvLyBTZXQgZXJyb3IgbnVtYmVyIHRvIHN0cmluZyBzaW5jZSBpbmNvbnNpc3RlbnQgZnJvbSBtb2R1bGVzIGlmIHN0cmluZyBvciBudW1iZXJcbiAgICBlcnJvck51bWJlciA9IFN0cmluZyhlcnJvck51bWJlcik7XG4gICAgaWYgKHNjb3JtMjAwNF9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW2Vycm9yTnVtYmVyXSkge1xuICAgICAgYmFzaWNNZXNzYWdlID0gc2Nvcm0yMDA0X2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbZXJyb3JOdW1iZXJdLmJhc2ljTWVzc2FnZTtcbiAgICAgIGRldGFpbE1lc3NhZ2UgPSBzY29ybTIwMDRfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tlcnJvck51bWJlcl0uZGV0YWlsTWVzc2FnZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGV0YWlsID8gZGV0YWlsTWVzc2FnZSA6IGJhc2ljTWVzc2FnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB0byBzZWUgaWYgYSBjb3JyZWN0X3Jlc3BvbnNlIHZhbHVlIGhhcyBiZWVuIGR1cGxpY2F0ZWRcbiAgICogQHBhcmFtIHtDTUlBcnJheX0gY29ycmVjdF9yZXNwb25zZVxuICAgKiBAcGFyYW0ge251bWJlcn0gY3VycmVudF9pbmRleFxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBjaGVja0R1cGxpY2F0ZWRQYXR0ZXJuID0gKGNvcnJlY3RfcmVzcG9uc2UsIGN1cnJlbnRfaW5kZXgsIHZhbHVlKSA9PiB7XG4gICAgbGV0IGZvdW5kID0gZmFsc2U7XG4gICAgY29uc3QgY291bnQgPSBjb3JyZWN0X3Jlc3BvbnNlLl9jb3VudDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50ICYmICFmb3VuZDsgaSsrKSB7XG4gICAgICBpZiAoaSAhPT0gY3VycmVudF9pbmRleCAmJiBjb3JyZWN0X3Jlc3BvbnNlLmNoaWxkQXJyYXlbaV0gPT09IHZhbHVlKSB7XG4gICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZvdW5kO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVja3MgZm9yIGEgdmFsaWQgY29ycmVjdF9yZXNwb25zZSB2YWx1ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gaW50ZXJhY3Rpb25fdHlwZVxuICAgKiBAcGFyYW0ge0FycmF5fSBub2Rlc1xuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqL1xuICBjaGVja0NvcnJlY3RSZXNwb25zZVZhbHVlKGludGVyYWN0aW9uX3R5cGUsIG5vZGVzLCB2YWx1ZSkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gY29ycmVjdF9yZXNwb25zZXNbaW50ZXJhY3Rpb25fdHlwZV07XG4gICAgY29uc3QgZm9ybWF0UmVnZXggPSBuZXcgUmVnRXhwKHJlc3BvbnNlLmZvcm1hdCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGggJiYgdGhpcy5sYXN0RXJyb3JDb2RlID09PSAwOyBpKyspIHtcbiAgICAgIGlmIChpbnRlcmFjdGlvbl90eXBlLm1hdGNoKFxuICAgICAgICAgICdeKGZpbGwtaW58bG9uZy1maWxsLWlufG1hdGNoaW5nfHBlcmZvcm1hbmNlfHNlcXVlbmNpbmcpJCcpKSB7XG4gICAgICAgIG5vZGVzW2ldID0gdGhpcy5yZW1vdmVDb3JyZWN0UmVzcG9uc2VQcmVmaXhlcyhub2Rlc1tpXSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNwb25zZT8uZGVsaW1pdGVyMikge1xuICAgICAgICBjb25zdCB2YWx1ZXMgPSBub2Rlc1tpXS5zcGxpdChyZXNwb25zZS5kZWxpbWl0ZXIyKTtcbiAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICBjb25zdCBtYXRjaGVzID0gdmFsdWVzWzBdLm1hdGNoKGZvcm1hdFJlZ2V4KTtcbiAgICAgICAgICBpZiAoIW1hdGNoZXMpIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF2YWx1ZXNbMV0ubWF0Y2gobmV3IFJlZ0V4cChyZXNwb25zZS5mb3JtYXQyKSkpIHtcbiAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG1hdGNoZXMgPSBub2Rlc1tpXS5tYXRjaChmb3JtYXRSZWdleCk7XG4gICAgICAgIGlmICgoIW1hdGNoZXMgJiYgdmFsdWUgIT09ICcnKSB8fFxuICAgICAgICAgICAgKCFtYXRjaGVzICYmIGludGVyYWN0aW9uX3R5cGUgPT09ICd0cnVlLWZhbHNlJykpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGludGVyYWN0aW9uX3R5cGUgPT09ICdudW1lcmljJyAmJiBub2Rlcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBpZiAoTnVtYmVyKG5vZGVzWzBdKSA+IE51bWJlcihub2Rlc1sxXSkpIHtcbiAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobm9kZXNbaV0gIT09ICcnICYmIHJlc3BvbnNlLnVuaXF1ZSkge1xuICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGkgJiYgdGhpcy5sYXN0RXJyb3JDb2RlID09PSAwOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZXNbaV0gPT09IG5vZGVzW2pdKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBwcmVmaXhlcyBmcm9tIGNvcnJlY3RfcmVzcG9uc2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5vZGVcbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIHJlbW92ZUNvcnJlY3RSZXNwb25zZVByZWZpeGVzKG5vZGUpIHtcbiAgICBsZXQgc2Vlbk9yZGVyID0gZmFsc2U7XG4gICAgbGV0IHNlZW5DYXNlID0gZmFsc2U7XG4gICAgbGV0IHNlZW5MYW5nID0gZmFsc2U7XG5cbiAgICBjb25zdCBwcmVmaXhSZWdleCA9IG5ldyBSZWdFeHAoXG4gICAgICAgICdeKHsobGFuZ3xjYXNlX21hdHRlcnN8b3JkZXJfbWF0dGVycyk9KFtefV0rKX0pJyk7XG4gICAgbGV0IG1hdGNoZXMgPSBub2RlLm1hdGNoKHByZWZpeFJlZ2V4KTtcbiAgICBsZXQgbGFuZ01hdGNoZXMgPSBudWxsO1xuICAgIHdoaWxlIChtYXRjaGVzKSB7XG4gICAgICBzd2l0Y2ggKG1hdGNoZXNbMl0pIHtcbiAgICAgICAgY2FzZSAnbGFuZyc6XG4gICAgICAgICAgbGFuZ01hdGNoZXMgPSBub2RlLm1hdGNoKHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nY3IpO1xuICAgICAgICAgIGlmIChsYW5nTWF0Y2hlcykge1xuICAgICAgICAgICAgY29uc3QgbGFuZyA9IGxhbmdNYXRjaGVzWzNdO1xuICAgICAgICAgICAgaWYgKGxhbmcgIT09IHVuZGVmaW5lZCAmJiBsYW5nLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgaWYgKFZhbGlkTGFuZ3VhZ2VzW2xhbmcudG9Mb3dlckNhc2UoKV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzZWVuTGFuZyA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Nhc2VfbWF0dGVycyc6XG4gICAgICAgICAgaWYgKCFzZWVuTGFuZyAmJiAhc2Vlbk9yZGVyICYmICFzZWVuQ2FzZSkge1xuICAgICAgICAgICAgaWYgKG1hdGNoZXNbM10gIT09ICd0cnVlJyAmJiBtYXRjaGVzWzNdICE9PSAnZmFsc2UnKSB7XG4gICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzZWVuQ2FzZSA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ29yZGVyX21hdHRlcnMnOlxuICAgICAgICAgIGlmICghc2VlbkNhc2UgJiYgIXNlZW5MYW5nICYmICFzZWVuT3JkZXIpIHtcbiAgICAgICAgICAgIGlmIChtYXRjaGVzWzNdICE9PSAndHJ1ZScgJiYgbWF0Y2hlc1szXSAhPT0gJ2ZhbHNlJykge1xuICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2Vlbk9yZGVyID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIG5vZGUgPSBub2RlLnN1YnN0cihtYXRjaGVzWzFdLmxlbmd0aCk7XG4gICAgICBtYXRjaGVzID0gbm9kZS5tYXRjaChwcmVmaXhSZWdleCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSB0aGUgd2hvbGUgQVBJIHdpdGggYW5vdGhlclxuICAgKiBAcGFyYW0ge1Njb3JtMjAwNEFQSX0gbmV3QVBJXG4gICAqL1xuICByZXBsYWNlV2l0aEFub3RoZXJTY29ybUFQSShuZXdBUEkpIHtcbiAgICAvLyBEYXRhIE1vZGVsXG4gICAgdGhpcy5jbWkgPSBuZXdBUEkuY21pO1xuICAgIHRoaXMuYWRsID0gbmV3QVBJLmFkbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGNtaSBvYmplY3QgdG8gdGhlIHByb3BlciBmb3JtYXQgZm9yIExNUyBjb21taXRcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSB0ZXJtaW5hdGVDb21taXRcbiAgICogQHJldHVybiB7b2JqZWN0fEFycmF5fVxuICAgKi9cbiAgcmVuZGVyQ29tbWl0Q01JKHRlcm1pbmF0ZUNvbW1pdDogYm9vbGVhbikge1xuICAgIGNvbnN0IGNtaUV4cG9ydCA9IHRoaXMucmVuZGVyQ01JVG9KU09OT2JqZWN0KCk7XG5cbiAgICBpZiAodGVybWluYXRlQ29tbWl0KSB7XG4gICAgICBjbWlFeHBvcnQuY21pLnRvdGFsX3RpbWUgPSB0aGlzLmNtaS5nZXRDdXJyZW50VG90YWxUaW1lKCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgY29uc3QgZmxhdHRlbmVkID0gVXRpbGl0aWVzLmZsYXR0ZW4oY21pRXhwb3J0KTtcbiAgICBzd2l0Y2ggKHRoaXMuc2V0dGluZ3MuZGF0YUNvbW1pdEZvcm1hdCkge1xuICAgICAgY2FzZSAnZmxhdHRlbmVkJzpcbiAgICAgICAgcmV0dXJuIFV0aWxpdGllcy5mbGF0dGVuKGNtaUV4cG9ydCk7XG4gICAgICBjYXNlICdwYXJhbXMnOlxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gaW4gZmxhdHRlbmVkKSB7XG4gICAgICAgICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoZmxhdHRlbmVkLCBpdGVtKSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goYCR7aXRlbX09JHtmbGF0dGVuZWRbaXRlbV19YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICBjYXNlICdqc29uJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBjbWlFeHBvcnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHRzIHRvIHN0b3JlIHRoZSBkYXRhIHRvIHRoZSBMTVNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSB0ZXJtaW5hdGVDb21taXRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgc3RvcmVEYXRhKHRlcm1pbmF0ZUNvbW1pdDogYm9vbGVhbikge1xuICAgIGlmICh0ZXJtaW5hdGVDb21taXQpIHtcbiAgICAgIGlmICh0aGlzLmNtaS5tb2RlID09PSAnbm9ybWFsJykge1xuICAgICAgICBpZiAodGhpcy5jbWkuY3JlZGl0ID09PSAnY3JlZGl0Jykge1xuICAgICAgICAgIGlmICh0aGlzLmNtaS5jb21wbGV0aW9uX3RocmVzaG9sZCAmJiB0aGlzLmNtaS5wcm9ncmVzc19tZWFzdXJlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbWkucHJvZ3Jlc3NfbWVhc3VyZSA+PSB0aGlzLmNtaS5jb21wbGV0aW9uX3RocmVzaG9sZCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdTZXR0aW5nIENvbXBsZXRpb24gU3RhdHVzOiBDb21wbGV0ZWQnKTtcbiAgICAgICAgICAgICAgdGhpcy5jbWkuY29tcGxldGlvbl9zdGF0dXMgPSAnY29tcGxldGVkJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ1NldHRpbmcgQ29tcGxldGlvbiBTdGF0dXM6IEluY29tcGxldGUnKTtcbiAgICAgICAgICAgICAgdGhpcy5jbWkuY29tcGxldGlvbl9zdGF0dXMgPSAnaW5jb21wbGV0ZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLmNtaS5zY2FsZWRfcGFzc2luZ19zY29yZSAmJiB0aGlzLmNtaS5zY29yZS5zY2FsZWQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNtaS5zY29yZS5zY2FsZWQgPj0gdGhpcy5jbWkuc2NhbGVkX3Bhc3Npbmdfc2NvcmUpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnU2V0dGluZyBTdWNjZXNzIFN0YXR1czogUGFzc2VkJyk7XG4gICAgICAgICAgICAgIHRoaXMuY21pLnN1Y2Nlc3Nfc3RhdHVzID0gJ3Bhc3NlZCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdTZXR0aW5nIFN1Y2Nlc3MgU3RhdHVzOiBGYWlsZWQnKTtcbiAgICAgICAgICAgICAgdGhpcy5jbWkuc3VjY2Vzc19zdGF0dXMgPSAnZmFpbGVkJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgbmF2UmVxdWVzdCA9IGZhbHNlO1xuICAgIGlmICh0aGlzLmFkbC5uYXYucmVxdWVzdCAhPT0gKHRoaXMuc3RhcnRpbmdEYXRhPy5hZGw/Lm5hdj8ucmVxdWVzdCkgJiZcbiAgICAgICAgdGhpcy5hZGwubmF2LnJlcXVlc3QgIT09ICdfbm9uZV8nKSB7XG4gICAgICB0aGlzLmFkbC5uYXYucmVxdWVzdCA9IGVuY29kZVVSSUNvbXBvbmVudCh0aGlzLmFkbC5uYXYucmVxdWVzdCk7XG4gICAgICBuYXZSZXF1ZXN0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBjb21taXRPYmplY3QgPSB0aGlzLnJlbmRlckNvbW1pdENNSSh0ZXJtaW5hdGVDb21taXQpO1xuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MubG1zQ29tbWl0VXJsKSB7XG4gICAgICBpZiAodGhpcy5hcGlMb2dMZXZlbCA9PT0gZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfREVCVUcpIHtcbiAgICAgICAgY29uc29sZS5kZWJ1ZygnQ29tbWl0ICh0ZXJtaW5hdGVkOiAnICtcbiAgICAgICAgICAgICh0ZXJtaW5hdGVDb21taXQgPyAneWVzJyA6ICdubycpICsgJyk6ICcpO1xuICAgICAgICBjb25zb2xlLmRlYnVnKGNvbW1pdE9iamVjdCk7XG4gICAgICB9XG4gICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnByb2Nlc3NIdHRwUmVxdWVzdCh0aGlzLnNldHRpbmdzLmxtc0NvbW1pdFVybCxcbiAgICAgICAgICBjb21taXRPYmplY3QsIHRlcm1pbmF0ZUNvbW1pdCk7XG5cbiAgICAgIC8vIGNoZWNrIGlmIHRoaXMgaXMgYSBzZXF1ZW5jaW5nIGNhbGwsIGFuZCB0aGVuIGNhbGwgdGhlIG5lY2Vzc2FyeSBKU1xuICAgICAge1xuICAgICAgICBpZiAobmF2UmVxdWVzdCAmJiByZXN1bHQubmF2UmVxdWVzdCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgcmVzdWx0Lm5hdlJlcXVlc3QgIT09ICcnKSB7XG4gICAgICAgICAgRnVuY3Rpb24oYFwidXNlIHN0cmljdFwiOygoKSA9PiB7ICR7cmVzdWx0Lm5hdlJlcXVlc3R9IH0pKClgKSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnQ29tbWl0ICh0ZXJtaW5hdGVkOiAnICtcbiAgICAgICAgICAodGVybWluYXRlQ29tbWl0ID8gJ3llcycgOiAnbm8nKSArICcpOiAnKTtcbiAgICAgIGNvbnNvbGUubG9nKGNvbW1pdE9iamVjdCk7XG4gICAgICByZXR1cm4gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgU2Nvcm0xMkNNSSBmcm9tICcuL3Njb3JtMTJfY21pJztcbmltcG9ydCB7QmFzZUNNSSwgQ01JQXJyYXksIENNSVNjb3JlfSBmcm9tICcuL2NvbW1vbic7XG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCBSZWdleCBmcm9tICcuLi9jb25zdGFudHMvcmVnZXgnO1xuaW1wb3J0IEVycm9yQ29kZXMgZnJvbSAnLi4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJztcbmltcG9ydCB7XG4gIGNoZWNrMTJWYWxpZEZvcm1hdCxcbiAgdGhyb3dSZWFkT25seUVycm9yLFxufSBmcm9tICcuL3Njb3JtMTJfY21pJztcblxuY29uc3QgYWljY19jb25zdGFudHMgPSBBUElDb25zdGFudHMuYWljYztcbmNvbnN0IGFpY2NfcmVnZXggPSBSZWdleC5haWNjO1xuY29uc3Qgc2Nvcm0xMl9lcnJvcl9jb2RlcyA9IEVycm9yQ29kZXMuc2Nvcm0xMjtcblxuLyoqXG4gKiBDTUkgQ2xhc3MgZm9yIEFJQ0NcbiAqL1xuZXhwb3J0IGNsYXNzIENNSSBleHRlbmRzIFNjb3JtMTJDTUkuQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIENNSSBvYmplY3RcbiAgICogQHBhcmFtIHtib29sZWFufSBpbml0aWFsaXplZFxuICAgKi9cbiAgY29uc3RydWN0b3IoaW5pdGlhbGl6ZWQ6IGJvb2xlYW4pIHtcbiAgICBzdXBlcihhaWNjX2NvbnN0YW50cy5jbWlfY2hpbGRyZW4pO1xuXG4gICAgaWYgKGluaXRpYWxpemVkKSB0aGlzLmluaXRpYWxpemUoKTtcblxuICAgIHRoaXMuc3R1ZGVudF9wcmVmZXJlbmNlID0gbmV3IEFJQ0NTdHVkZW50UHJlZmVyZW5jZXMoKTtcbiAgICB0aGlzLnN0dWRlbnRfZGF0YSA9IG5ldyBBSUNDQ01JU3R1ZGVudERhdGEoKTtcbiAgICB0aGlzLnN0dWRlbnRfZGVtb2dyYXBoaWNzID0gbmV3IENNSVN0dWRlbnREZW1vZ3JhcGhpY3MoKTtcbiAgICB0aGlzLmV2YWx1YXRpb24gPSBuZXcgQ01JRXZhbHVhdGlvbigpO1xuICAgIHRoaXMucGF0aHMgPSBuZXcgQ01JUGF0aHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zdHVkZW50X3ByZWZlcmVuY2U/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnN0dWRlbnRfZGF0YT8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc3R1ZGVudF9kZW1vZ3JhcGhpY3M/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmV2YWx1YXRpb24/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnBhdGhzPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWlcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBzdXNwZW5kX2RhdGE6IHN0cmluZyxcbiAgICogICAgICBsYXVuY2hfZGF0YTogc3RyaW5nLFxuICAgKiAgICAgIGNvbW1lbnRzOiBzdHJpbmcsXG4gICAqICAgICAgY29tbWVudHNfZnJvbV9sbXM6IHN0cmluZyxcbiAgICogICAgICBjb3JlOiBDTUlDb3JlLFxuICAgKiAgICAgIG9iamVjdGl2ZXM6IENNSU9iamVjdGl2ZXMsXG4gICAqICAgICAgc3R1ZGVudF9kYXRhOiBDTUlTdHVkZW50RGF0YSxcbiAgICogICAgICBzdHVkZW50X3ByZWZlcmVuY2U6IENNSVN0dWRlbnRQcmVmZXJlbmNlLFxuICAgKiAgICAgIGludGVyYWN0aW9uczogQ01JSW50ZXJhY3Rpb25zLFxuICAgKiAgICAgIHBhdGhzOiBDTUlQYXRoc1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnc3VzcGVuZF9kYXRhJzogdGhpcy5zdXNwZW5kX2RhdGEsXG4gICAgICAnbGF1bmNoX2RhdGEnOiB0aGlzLmxhdW5jaF9kYXRhLFxuICAgICAgJ2NvbW1lbnRzJzogdGhpcy5jb21tZW50cyxcbiAgICAgICdjb21tZW50c19mcm9tX2xtcyc6IHRoaXMuY29tbWVudHNfZnJvbV9sbXMsXG4gICAgICAnY29yZSc6IHRoaXMuY29yZSxcbiAgICAgICdvYmplY3RpdmVzJzogdGhpcy5vYmplY3RpdmVzLFxuICAgICAgJ3N0dWRlbnRfZGF0YSc6IHRoaXMuc3R1ZGVudF9kYXRhLFxuICAgICAgJ3N0dWRlbnRfcHJlZmVyZW5jZSc6IHRoaXMuc3R1ZGVudF9wcmVmZXJlbmNlLFxuICAgICAgJ3N0dWRlbnRfZGVtb2dyYXBoaWNzJzogdGhpcy5zdHVkZW50X2RlbW9ncmFwaGljcyxcbiAgICAgICdpbnRlcmFjdGlvbnMnOiB0aGlzLmludGVyYWN0aW9ucyxcbiAgICAgICdldmFsdWF0aW9uJzogdGhpcy5ldmFsdWF0aW9uLFxuICAgICAgJ3BhdGhzJzogdGhpcy5wYXRocyxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIEFJQ0MgRXZhbHVhdGlvbiBvYmplY3RcbiAqL1xuY2xhc3MgQ01JRXZhbHVhdGlvbiBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEFJQ0MgRXZhbHVhdGlvbiBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmNvbW1lbnRzID0gbmV3IENNSUV2YWx1YXRpb25Db21tZW50cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmNvbW1lbnRzPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuZXZhbHVhdGlvbiBvYmplY3RcbiAgICogQHJldHVybiB7e2NvbW1lbnRzOiBDTUlFdmFsdWF0aW9uQ29tbWVudHN9fVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2NvbW1lbnRzJzogdGhpcy5jb21tZW50cyxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBBSUNDJ3MgY21pLmV2YWx1YXRpb24uY29tbWVudHMgb2JqZWN0XG4gKi9cbmNsYXNzIENNSUV2YWx1YXRpb25Db21tZW50cyBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIEV2YWx1YXRpb24gQ29tbWVudHMgb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihhaWNjX2NvbnN0YW50cy5jb21tZW50c19jaGlsZHJlbixcbiAgICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSk7XG4gIH1cbn1cblxuLyoqXG4gKiBTdHVkZW50UHJlZmVyZW5jZXMgY2xhc3MgZm9yIEFJQ0NcbiAqL1xuY2xhc3MgQUlDQ1N0dWRlbnRQcmVmZXJlbmNlcyBleHRlbmRzIFNjb3JtMTJDTUkuQ01JU3R1ZGVudFByZWZlcmVuY2Uge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEFJQ0MgU3R1ZGVudCBQcmVmZXJlbmNlcyBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKGFpY2NfY29uc3RhbnRzLnN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbik7XG5cbiAgICB0aGlzLndpbmRvd3MgPSBuZXcgQ01JQXJyYXkoe1xuICAgICAgZXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgY2hpbGRyZW46ICcnLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLndpbmRvd3M/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICNsZXNzb25fdHlwZSA9ICcnO1xuICAjdGV4dF9jb2xvciA9ICcnO1xuICAjdGV4dF9sb2NhdGlvbiA9ICcnO1xuICAjdGV4dF9zaXplID0gJyc7XG4gICN2aWRlbyA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsZXNzb25fdHlwZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVzc29uX3R5cGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy4jbGVzc29uX3R5cGU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGVzc29uX3R5cGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlc3Nvbl90eXBlXG4gICAqL1xuICBzZXQgbGVzc29uX3R5cGUobGVzc29uX3R5cGU6IHN0cmluZykge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQobGVzc29uX3R5cGUsIGFpY2NfcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jbGVzc29uX3R5cGUgPSBsZXNzb25fdHlwZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGV4dF9jb2xvclxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGV4dF9jb2xvcigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLiN0ZXh0X2NvbG9yO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RleHRfY29sb3JcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHRfY29sb3JcbiAgICovXG4gIHNldCB0ZXh0X2NvbG9yKHRleHRfY29sb3I6IHN0cmluZykge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQodGV4dF9jb2xvciwgYWljY19yZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiN0ZXh0X2NvbG9yID0gdGV4dF9jb2xvcjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGV4dF9sb2NhdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGV4dF9sb2NhdGlvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLiN0ZXh0X2xvY2F0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RleHRfbG9jYXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRleHRfbG9jYXRpb25cbiAgICovXG4gIHNldCB0ZXh0X2xvY2F0aW9uKHRleHRfbG9jYXRpb246IHN0cmluZykge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQodGV4dF9sb2NhdGlvbiwgYWljY19yZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiN0ZXh0X2xvY2F0aW9uID0gdGV4dF9sb2NhdGlvbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGV4dF9zaXplXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0ZXh0X3NpemUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy4jdGV4dF9zaXplO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RleHRfc2l6ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dF9zaXplXG4gICAqL1xuICBzZXQgdGV4dF9zaXplKHRleHRfc2l6ZTogc3RyaW5nKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh0ZXh0X3NpemUsIGFpY2NfcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jdGV4dF9zaXplID0gdGV4dF9zaXplO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN2aWRlb1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdmlkZW8oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy4jdmlkZW87XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdmlkZW9cbiAgICogQHBhcmFtIHtzdHJpbmd9IHZpZGVvXG4gICAqL1xuICBzZXQgdmlkZW8odmlkZW86IHN0cmluZykge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQodmlkZW8sIGFpY2NfcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jdmlkZW8gPSB2aWRlbztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuc3R1ZGVudF9wcmVmZXJlbmNlXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgYXVkaW86IHN0cmluZyxcbiAgICogICAgICBsYW5ndWFnZTogc3RyaW5nLFxuICAgKiAgICAgIHNwZWVkOiBzdHJpbmcsXG4gICAqICAgICAgdGV4dDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdhdWRpbyc6IHRoaXMuYXVkaW8sXG4gICAgICAnbGFuZ3VhZ2UnOiB0aGlzLmxhbmd1YWdlLFxuICAgICAgJ2xlc3Nvbl90eXBlJzogdGhpcy5sZXNzb25fdHlwZSxcbiAgICAgICdzcGVlZCc6IHRoaXMuc3BlZWQsXG4gICAgICAndGV4dCc6IHRoaXMudGV4dCxcbiAgICAgICd0ZXh0X2NvbG9yJzogdGhpcy50ZXh0X2NvbG9yLFxuICAgICAgJ3RleHRfbG9jYXRpb24nOiB0aGlzLnRleHRfbG9jYXRpb24sXG4gICAgICAndGV4dF9zaXplJzogdGhpcy50ZXh0X3NpemUsXG4gICAgICAndmlkZW8nOiB0aGlzLnZpZGVvLFxuICAgICAgJ3dpbmRvd3MnOiB0aGlzLndpbmRvd3MsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBTdHVkZW50RGF0YSBjbGFzcyBmb3IgQUlDQ1xuICovXG5jbGFzcyBBSUNDQ01JU3R1ZGVudERhdGEgZXh0ZW5kcyBTY29ybTEyQ01JLkNNSVN0dWRlbnREYXRhIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIFN0dWRlbnREYXRhIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoYWljY19jb25zdGFudHMuc3R1ZGVudF9kYXRhX2NoaWxkcmVuKTtcblxuICAgIHRoaXMudHJpZXMgPSBuZXcgQ01JVHJpZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy50cmllcz8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgI3RyaWVzX2R1cmluZ19sZXNzb24gPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciB0cmllc19kdXJpbmdfbGVzc29uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0cmllc19kdXJpbmdfbGVzc29uKCkge1xuICAgIHJldHVybiB0aGlzLiN0cmllc19kdXJpbmdfbGVzc29uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RyaWVzX2R1cmluZ19sZXNzb24uIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0cmllc19kdXJpbmdfbGVzc29uXG4gICAqL1xuICBzZXQgdHJpZXNfZHVyaW5nX2xlc3Nvbih0cmllc19kdXJpbmdfbGVzc29uKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiN0cmllc19kdXJpbmdfbGVzc29uID0gdHJpZXNfZHVyaW5nX2xlc3NvbiA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLnN0dWRlbnRfZGF0YSBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBtYXN0ZXJ5X3Njb3JlOiBzdHJpbmcsXG4gICAqICAgICAgbWF4X3RpbWVfYWxsb3dlZDogc3RyaW5nLFxuICAgKiAgICAgIHRpbWVfbGltaXRfYWN0aW9uOiBzdHJpbmcsXG4gICAqICAgICAgdHJpZXM6IENNSVRyaWVzXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdtYXN0ZXJ5X3Njb3JlJzogdGhpcy5tYXN0ZXJ5X3Njb3JlLFxuICAgICAgJ21heF90aW1lX2FsbG93ZWQnOiB0aGlzLm1heF90aW1lX2FsbG93ZWQsXG4gICAgICAndGltZV9saW1pdF9hY3Rpb24nOiB0aGlzLnRpbWVfbGltaXRfYWN0aW9uLFxuICAgICAgJ3RyaWVzJzogdGhpcy50cmllcyxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyB0aGUgQUlDQyBjbWkuc3R1ZGVudF9kZW1vZ3JhcGhpY3Mgb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlTdHVkZW50RGVtb2dyYXBoaWNzIGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBTdHVkZW50RGVtb2dyYXBoaWNzIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gICNfY2hpbGRyZW4gPSBhaWNjX2NvbnN0YW50cy5zdHVkZW50X2RlbW9ncmFwaGljc19jaGlsZHJlbjtcbiAgI2NpdHkgPSAnJztcbiAgI2NsYXNzID0gJyc7XG4gICNjb21wYW55ID0gJyc7XG4gICNjb3VudHJ5ID0gJyc7XG4gICNleHBlcmllbmNlID0gJyc7XG4gICNmYW1pbGlhcl9uYW1lID0gJyc7XG4gICNpbnN0cnVjdG9yX25hbWUgPSAnJztcbiAgI3RpdGxlID0gJyc7XG4gICNuYXRpdmVfbGFuZ3VhZ2UgPSAnJztcbiAgI3N0YXRlID0gJyc7XG4gICNzdHJlZXRfYWRkcmVzcyA9ICcnO1xuICAjdGVsZXBob25lID0gJyc7XG4gICN5ZWFyc19leHBlcmllbmNlID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgY2l0eVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY2l0eSgpIHtcbiAgICByZXR1cm4gdGhpcy4jY2l0eTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjaXR5LiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2l0eVxuICAgKi9cbiAgc2V0IGNpdHkoY2l0eSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jY2l0eSA9IGNpdHkgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIGNsYXNzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjbGFzcygpIHtcbiAgICByZXR1cm4gdGhpcy4jY2xhc3M7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY2xhc3MuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbGF6elxuICAgKi9cbiAgc2V0IGNsYXNzKGNsYXp6KSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNjbGFzcyA9IGNsYXp6IDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBjb21wYW55XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb21wYW55KCkge1xuICAgIHJldHVybiB0aGlzLiNjb21wYW55O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbXBhbnkuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21wYW55XG4gICAqL1xuICBzZXQgY29tcGFueShjb21wYW55KSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNjb21wYW55ID0gY29tcGFueSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgY291bnRyeVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY291bnRyeSgpIHtcbiAgICByZXR1cm4gdGhpcy4jY291bnRyeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb3VudHJ5LiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY291bnRyeVxuICAgKi9cbiAgc2V0IGNvdW50cnkoY291bnRyeSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jY291bnRyeSA9IGNvdW50cnkgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIGV4cGVyaWVuY2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGV4cGVyaWVuY2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2V4cGVyaWVuY2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZXhwZXJpZW5jZS4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGV4cGVyaWVuY2VcbiAgICovXG4gIHNldCBleHBlcmllbmNlKGV4cGVyaWVuY2UpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2V4cGVyaWVuY2UgPSBleHBlcmllbmNlIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBmYW1pbGlhcl9uYW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBmYW1pbGlhcl9uYW1lKCkge1xuICAgIHJldHVybiB0aGlzLiNmYW1pbGlhcl9uYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2ZhbWlsaWFyX25hbWUuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmYW1pbGlhcl9uYW1lXG4gICAqL1xuICBzZXQgZmFtaWxpYXJfbmFtZShmYW1pbGlhcl9uYW1lKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNmYW1pbGlhcl9uYW1lID0gZmFtaWxpYXJfbmFtZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgaW5zdHJ1Y3Rvcl9uYW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBpbnN0cnVjdG9yX25hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2luc3RydWN0b3JfbmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNpbnN0cnVjdG9yX25hbWUuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpbnN0cnVjdG9yX25hbWVcbiAgICovXG4gIHNldCBpbnN0cnVjdG9yX25hbWUoaW5zdHJ1Y3Rvcl9uYW1lKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNpbnN0cnVjdG9yX25hbWUgPSBpbnN0cnVjdG9yX25hbWUgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIHRpdGxlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aXRsZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jdGl0bGU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGl0bGUuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aXRsZVxuICAgKi9cbiAgc2V0IHRpdGxlKHRpdGxlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiN0aXRsZSA9IHRpdGxlIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBuYXRpdmVfbGFuZ3VhZ2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG5hdGl2ZV9sYW5ndWFnZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbmF0aXZlX2xhbmd1YWdlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI25hdGl2ZV9sYW5ndWFnZS4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hdGl2ZV9sYW5ndWFnZVxuICAgKi9cbiAgc2V0IG5hdGl2ZV9sYW5ndWFnZShuYXRpdmVfbGFuZ3VhZ2UpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI25hdGl2ZV9sYW5ndWFnZSA9IG5hdGl2ZV9sYW5ndWFnZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3Igc3RhdGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN0YXRlKCkge1xuICAgIHJldHVybiB0aGlzLiNzdGF0ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdGF0ZS4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0YXRlXG4gICAqL1xuICBzZXQgc3RhdGUoc3RhdGUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI3N0YXRlID0gc3RhdGUgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIHN0cmVldF9hZGRyZXNzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdHJlZXRfYWRkcmVzcygpIHtcbiAgICByZXR1cm4gdGhpcy4jc3RyZWV0X2FkZHJlc3M7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3RyZWV0X2FkZHJlc3MuIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHJlZXRfYWRkcmVzc1xuICAgKi9cbiAgc2V0IHN0cmVldF9hZGRyZXNzKHN0cmVldF9hZGRyZXNzKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNzdHJlZXRfYWRkcmVzcyA9IHN0cmVldF9hZGRyZXNzIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciB0ZWxlcGhvbmVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRlbGVwaG9uZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jdGVsZXBob25lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RlbGVwaG9uZS4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRlbGVwaG9uZVxuICAgKi9cbiAgc2V0IHRlbGVwaG9uZSh0ZWxlcGhvbmUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI3RlbGVwaG9uZSA9IHRlbGVwaG9uZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgeWVhcnNfZXhwZXJpZW5jZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgeWVhcnNfZXhwZXJpZW5jZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jeWVhcnNfZXhwZXJpZW5jZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN5ZWFyc19leHBlcmllbmNlLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30geWVhcnNfZXhwZXJpZW5jZVxuICAgKi9cbiAgc2V0IHllYXJzX2V4cGVyaWVuY2UoeWVhcnNfZXhwZXJpZW5jZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jeWVhcnNfZXhwZXJpZW5jZSA9IHllYXJzX2V4cGVyaWVuY2UgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5zdHVkZW50X2RlbW9ncmFwaGljcyBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgICAge1xuICAgKiAgICAgICAgY2l0eTogc3RyaW5nLFxuICAgKiAgICAgICAgY2xhc3M6IHN0cmluZyxcbiAgICogICAgICAgIGNvbXBhbnk6IHN0cmluZyxcbiAgICogICAgICAgIGNvdW50cnk6IHN0cmluZyxcbiAgICogICAgICAgIGV4cGVyaWVuY2U6IHN0cmluZyxcbiAgICogICAgICAgIGZhbWlsaWFyX25hbWU6IHN0cmluZyxcbiAgICogICAgICAgIGluc3RydWN0b3JfbmFtZTogc3RyaW5nLFxuICAgKiAgICAgICAgdGl0bGU6IHN0cmluZyxcbiAgICogICAgICAgIG5hdGl2ZV9sYW5ndWFnZTogc3RyaW5nLFxuICAgKiAgICAgICAgc3RhdGU6IHN0cmluZyxcbiAgICogICAgICAgIHN0cmVldF9hZGRyZXNzOiBzdHJpbmcsXG4gICAqICAgICAgICB0ZWxlcGhvbmU6IHN0cmluZyxcbiAgICogICAgICAgIHllYXJzX2V4cGVyaWVuY2U6IHN0cmluZ1xuICAgKiAgICAgIH1cbiAgICogICAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2NpdHknOiB0aGlzLmNpdHksXG4gICAgICAnY2xhc3MnOiB0aGlzLmNsYXNzLFxuICAgICAgJ2NvbXBhbnknOiB0aGlzLmNvbXBhbnksXG4gICAgICAnY291bnRyeSc6IHRoaXMuY291bnRyeSxcbiAgICAgICdleHBlcmllbmNlJzogdGhpcy5leHBlcmllbmNlLFxuICAgICAgJ2ZhbWlsaWFyX25hbWUnOiB0aGlzLmZhbWlsaWFyX25hbWUsXG4gICAgICAnaW5zdHJ1Y3Rvcl9uYW1lJzogdGhpcy5pbnN0cnVjdG9yX25hbWUsXG4gICAgICAndGl0bGUnOiB0aGlzLnRpdGxlLFxuICAgICAgJ25hdGl2ZV9sYW5ndWFnZSc6IHRoaXMubmF0aXZlX2xhbmd1YWdlLFxuICAgICAgJ3N0YXRlJzogdGhpcy5zdGF0ZSxcbiAgICAgICdzdHJlZXRfYWRkcmVzcyc6IHRoaXMuc3RyZWV0X2FkZHJlc3MsXG4gICAgICAndGVsZXBob25lJzogdGhpcy50ZWxlcGhvbmUsXG4gICAgICAneWVhcnNfZXhwZXJpZW5jZSc6IHRoaXMueWVhcnNfZXhwZXJpZW5jZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyB0aGUgQUlDQyBjbWkucGF0aHMgb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlQYXRocyBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBpbmxpbmUgUGF0aHMgQXJyYXkgY2xhc3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKGFpY2NfY29uc3RhbnRzLnBhdGhzX2NoaWxkcmVuKTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBBSUNDIFBhdGhzXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlQYXRoc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEFJQ0MgUGF0aHMgb2JqZWN0c1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gICNsb2NhdGlvbl9pZCA9ICcnO1xuICAjZGF0ZSA9ICcnO1xuICAjdGltZSA9ICcnO1xuICAjc3RhdHVzID0gJyc7XG4gICN3aHlfbGVmdCA9ICcnO1xuICAjdGltZV9pbl9lbGVtZW50ID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xvY2F0aW9uX2lkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsb2NhdGlvbl9pZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jbG9jYXRpb25faWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbG9jYXRpb25faWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uX2lkXG4gICAqL1xuICBzZXQgbG9jYXRpb25faWQobG9jYXRpb25faWQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGxvY2F0aW9uX2lkLCBhaWNjX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI2xvY2F0aW9uX2lkID0gbG9jYXRpb25faWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2RhdGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGRhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2RhdGU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZGF0ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGF0ZVxuICAgKi9cbiAgc2V0IGRhdGUoZGF0ZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoZGF0ZSwgYWljY19yZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiNkYXRlID0gZGF0ZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lXG4gICAqL1xuICBzZXQgdGltZSh0aW1lKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh0aW1lLCBhaWNjX3JlZ2V4LkNNSVRpbWUpKSB7XG4gICAgICB0aGlzLiN0aW1lID0gdGltZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3RhdHVzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0YXR1c1xuICAgKi9cbiAgc2V0IHN0YXR1cyhzdGF0dXMpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHN0YXR1cywgYWljY19yZWdleC5DTUlTdGF0dXMyKSkge1xuICAgICAgdGhpcy4jc3RhdHVzID0gc3RhdHVzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN3aHlfbGVmdFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgd2h5X2xlZnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3doeV9sZWZ0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3doeV9sZWZ0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3aHlfbGVmdFxuICAgKi9cbiAgc2V0IHdoeV9sZWZ0KHdoeV9sZWZ0KSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh3aHlfbGVmdCwgYWljY19yZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiN3aHlfbGVmdCA9IHdoeV9sZWZ0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0aW1lX2luX2VsZW1lbnRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRpbWVfaW5fZWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy4jdGltZV9pbl9lbGVtZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpbWVfaW5fZWxlbWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZV9pbl9lbGVtZW50XG4gICAqL1xuICBzZXQgdGltZV9pbl9lbGVtZW50KHRpbWVfaW5fZWxlbWVudCkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQodGltZV9pbl9lbGVtZW50LCBhaWNjX3JlZ2V4LkNNSVRpbWUpKSB7XG4gICAgICB0aGlzLiN0aW1lX2luX2VsZW1lbnQgPSB0aW1lX2luX2VsZW1lbnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLnBhdGhzLm4gb2JqZWN0XG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgbG9jYXRpb25faWQ6IHN0cmluZyxcbiAgICogICAgICBkYXRlOiBzdHJpbmcsXG4gICAqICAgICAgdGltZTogc3RyaW5nLFxuICAgKiAgICAgIHN0YXR1czogc3RyaW5nLFxuICAgKiAgICAgIHdoeV9sZWZ0OiBzdHJpbmcsXG4gICAqICAgICAgdGltZV9pbl9lbGVtZW50OiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2xvY2F0aW9uX2lkJzogdGhpcy5sb2NhdGlvbl9pZCxcbiAgICAgICdkYXRlJzogdGhpcy5kYXRlLFxuICAgICAgJ3RpbWUnOiB0aGlzLnRpbWUsXG4gICAgICAnc3RhdHVzJzogdGhpcy5zdGF0dXMsXG4gICAgICAnd2h5X2xlZnQnOiB0aGlzLndoeV9sZWZ0LFxuICAgICAgJ3RpbWVfaW5fZWxlbWVudCc6IHRoaXMudGltZV9pbl9lbGVtZW50LFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIHRoZSBBSUNDIGNtaS5zdHVkZW50X2RhdGEudHJpZXMgb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlUcmllcyBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBpbmxpbmUgVHJpZXMgQXJyYXkgY2xhc3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKGFpY2NfY29uc3RhbnRzLnRyaWVzX2NoaWxkcmVuKTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBBSUNDIFRyaWVzXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlUcmllc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEFJQ0MgVHJpZXMgb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zY29yZSA9IG5ldyBDTUlTY29yZShcbiAgICAgICAge1xuICAgICAgICAgIHNjb3JlX2NoaWxkcmVuOiBhaWNjX2NvbnN0YW50cy5zY29yZV9jaGlsZHJlbixcbiAgICAgICAgICBzY29yZV9yYW5nZTogYWljY19yZWdleC5zY29yZV9yYW5nZSxcbiAgICAgICAgICBpbnZhbGlkRXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgICAgIGludmFsaWRUeXBlQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENILFxuICAgICAgICAgIGludmFsaWRSYW5nZUNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFLFxuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zY29yZT8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgI3N0YXR1cyA9ICcnO1xuICAjdGltZSA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdGF0dXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N0YXR1c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RhdHVzXG4gICAqL1xuICBzZXQgc3RhdHVzKHN0YXR1cykge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoc3RhdHVzLCBhaWNjX3JlZ2V4LkNNSVN0YXR1czIpKSB7XG4gICAgICB0aGlzLiNzdGF0dXMgPSBzdGF0dXM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGltZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZVxuICAgKi9cbiAgc2V0IHRpbWUodGltZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQodGltZSwgYWljY19yZWdleC5DTUlUaW1lKSkge1xuICAgICAgdGhpcy4jdGltZSA9IHRpbWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLnN0dWRlbnRfZGF0YS50cmllcy5uIG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHN0YXR1czogc3RyaW5nLFxuICAgKiAgICAgIHRpbWU6IHN0cmluZyxcbiAgICogICAgICBzY29yZTogQ01JU2NvcmVcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3N0YXR1cyc6IHRoaXMuc3RhdHVzLFxuICAgICAgJ3RpbWUnOiB0aGlzLnRpbWUsXG4gICAgICAnc2NvcmUnOiB0aGlzLnNjb3JlLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIGNtaS5zdHVkZW50X2RhdGEuYXR0ZW1wdF9yZWNvcmRzIGFycmF5XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlBdHRlbXB0UmVjb3JkcyBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBpbmxpbmUgVHJpZXMgQXJyYXkgY2xhc3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKGFpY2NfY29uc3RhbnRzLmF0dGVtcHRfcmVjb3Jkc19jaGlsZHJlbik7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgQUlDQyBBdHRlbXB0IFJlY29yZHNcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUF0dGVtcHRSZWNvcmRzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBBdHRlbXB0IFJlY29yZHMgb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zY29yZSA9IG5ldyBDTUlTY29yZShcbiAgICAgICAge1xuICAgICAgICAgIHNjb3JlX2NoaWxkcmVuOiBhaWNjX2NvbnN0YW50cy5zY29yZV9jaGlsZHJlbixcbiAgICAgICAgICBzY29yZV9yYW5nZTogYWljY19yZWdleC5zY29yZV9yYW5nZSxcbiAgICAgICAgICBpbnZhbGlkRXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgICAgIGludmFsaWRUeXBlQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENILFxuICAgICAgICAgIGludmFsaWRSYW5nZUNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFLFxuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zY29yZT8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgI2xlc3Nvbl9zdGF0dXMgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGVzc29uX3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVzc29uX3N0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jbGVzc29uX3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsZXNzb25fc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZXNzb25fc3RhdHVzXG4gICAqL1xuICBzZXQgbGVzc29uX3N0YXR1cyhsZXNzb25fc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChsZXNzb25fc3RhdHVzLCBhaWNjX3JlZ2V4LkNNSVN0YXR1czIpKSB7XG4gICAgICB0aGlzLiNsZXNzb25fc3RhdHVzID0gbGVzc29uX3N0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuc3R1ZGVudF9kYXRhLmF0dGVtcHRfcmVjb3Jkcy5uIG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHN0YXR1czogc3RyaW5nLFxuICAgKiAgICAgIHRpbWU6IHN0cmluZyxcbiAgICogICAgICBzY29yZTogQ01JU2NvcmVcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2xlc3Nvbl9zdGF0dXMnOiB0aGlzLmxlc3Nvbl9zdGF0dXMsXG4gICAgICAnc2NvcmUnOiB0aGlzLnNjb3JlLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIEFJQ0MgRXZhbHVhdGlvbiBDb21tZW50c1xuICovXG5leHBvcnQgY2xhc3MgQ01JRXZhbHVhdGlvbkNvbW1lbnRzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgRXZhbHVhdGlvbiBDb21tZW50c1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gICNjb250ZW50ID0gJyc7XG4gICNsb2NhdGlvbiA9ICcnO1xuICAjdGltZSA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb250ZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb250ZW50KCkge1xuICAgIHJldHVybiB0aGlzLiNjb250ZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbnRlbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnRcbiAgICovXG4gIHNldCBjb250ZW50KGNvbnRlbnQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGNvbnRlbnQsIGFpY2NfcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jY29udGVudCA9IGNvbnRlbnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xvY2F0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsb2NhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jbG9jYXRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbG9jYXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uXG4gICAqL1xuICBzZXQgbG9jYXRpb24obG9jYXRpb24pIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGxvY2F0aW9uLCBhaWNjX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI2xvY2F0aW9uID0gbG9jYXRpb247XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGluZyBmb3IgI3RpbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVcbiAgICovXG4gIHNldCB0aW1lKHRpbWUpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHRpbWUsIGFpY2NfcmVnZXguQ01JVGltZSkpIHtcbiAgICAgIHRoaXMuI3RpbWUgPSB0aW1lO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5ldmF1bGF0aW9uLmNvbW1lbnRzLm4gb2JqZWN0XG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgY29udGVudDogc3RyaW5nLFxuICAgKiAgICAgIGxvY2F0aW9uOiBzdHJpbmcsXG4gICAqICAgICAgdGltZTogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdjb250ZW50JzogdGhpcy5jb250ZW50LFxuICAgICAgJ2xvY2F0aW9uJzogdGhpcy5sb2NhdGlvbixcbiAgICAgICd0aW1lJzogdGhpcy50aW1lLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iLCIvLyBAZmxvd1xuaW1wb3J0IEFQSUNvbnN0YW50cyBmcm9tICcuLi9jb25zdGFudHMvYXBpX2NvbnN0YW50cyc7XG5pbXBvcnQgRXJyb3JDb2RlcyBmcm9tICcuLi9jb25zdGFudHMvZXJyb3JfY29kZXMnO1xuaW1wb3J0IHtWYWxpZGF0aW9uRXJyb3J9IGZyb20gJy4uL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IFJlZ2V4IGZyb20gJy4uL2NvbnN0YW50cy9yZWdleCc7XG5cbmNvbnN0IHNjb3JtMTJfY29uc3RhbnRzID0gQVBJQ29uc3RhbnRzLnNjb3JtMTI7XG5jb25zdCBzY29ybTEyX3JlZ2V4ID0gUmVnZXguc2Nvcm0xMjtcbmNvbnN0IHNjb3JtMTJfZXJyb3JfY29kZXMgPSBFcnJvckNvZGVzLnNjb3JtMTI7XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIHZhbHVlIG1hdGNoZXMgdGhlIHByb3BlciBmb3JtYXQuIElmIG5vdCwgdGhyb3cgcHJvcGVyIGVycm9yIGNvZGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVnZXhQYXR0ZXJuXG4gKiBAcGFyYW0ge251bWJlcn0gZXJyb3JDb2RlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGFsbG93RW1wdHlTdHJpbmdcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1ZhbGlkRm9ybWF0KFxuICAgIHZhbHVlOiBTdHJpbmcsXG4gICAgcmVnZXhQYXR0ZXJuOiBTdHJpbmcsXG4gICAgZXJyb3JDb2RlOiBudW1iZXIsXG4gICAgYWxsb3dFbXB0eVN0cmluZz86IGJvb2xlYW4pIHtcbiAgY29uc3QgZm9ybWF0UmVnZXggPSBuZXcgUmVnRXhwKHJlZ2V4UGF0dGVybik7XG4gIGNvbnN0IG1hdGNoZXMgPSB2YWx1ZS5tYXRjaChmb3JtYXRSZWdleCk7XG4gIGlmIChhbGxvd0VtcHR5U3RyaW5nICYmIHZhbHVlID09PSAnJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8ICFtYXRjaGVzIHx8IG1hdGNoZXNbMF0gPT09ICcnKSB7XG4gICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihlcnJvckNvZGUpO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSB2YWx1ZSBtYXRjaGVzIHRoZSBwcm9wZXIgcmFuZ2UuIElmIG5vdCwgdGhyb3cgcHJvcGVyIGVycm9yIGNvZGUuXG4gKlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9IHJhbmdlUGF0dGVyblxuICogQHBhcmFtIHtudW1iZXJ9IGVycm9yQ29kZVxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrVmFsaWRSYW5nZShcbiAgICB2YWx1ZTogYW55LCByYW5nZVBhdHRlcm46IFN0cmluZywgZXJyb3JDb2RlOiBudW1iZXIpIHtcbiAgY29uc3QgcmFuZ2VzID0gcmFuZ2VQYXR0ZXJuLnNwbGl0KCcjJyk7XG4gIHZhbHVlID0gdmFsdWUgKiAxLjA7XG4gIGlmICh2YWx1ZSA+PSByYW5nZXNbMF0pIHtcbiAgICBpZiAoKHJhbmdlc1sxXSA9PT0gJyonKSB8fCAodmFsdWUgPD0gcmFuZ2VzWzFdKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoZXJyb3JDb2RlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihlcnJvckNvZGUpO1xuICB9XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgQVBJIGNtaSBvYmplY3RzXG4gKi9cbmV4cG9ydCBjbGFzcyBCYXNlQ01JIHtcbiAganNvblN0cmluZyA9IGZhbHNlO1xuICAjaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgI3N0YXJ0X3RpbWU7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBCYXNlQ01JLCBqdXN0IG1hcmtzIHRoZSBjbGFzcyBhcyBhYnN0cmFjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKG5ldy50YXJnZXQgPT09IEJhc2VDTUkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb25zdHJ1Y3QgQmFzZUNNSSBpbnN0YW5jZXMgZGlyZWN0bHknKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaW5pdGlhbGl6ZWRcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGdldCBpbml0aWFsaXplZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jaW5pdGlhbGl6ZWQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3RhcnRfdGltZVxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgc3RhcnRfdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jc3RhcnRfdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLiNpbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHBsYXllciBzaG91bGQgb3ZlcnJpZGUgdGhlICdzZXNzaW9uX3RpbWUnIHByb3ZpZGVkIGJ5XG4gICAqIHRoZSBtb2R1bGVcbiAgICovXG4gIHNldFN0YXJ0VGltZSgpIHtcbiAgICB0aGlzLiNzdGFydF90aW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBjbWkgKi5zY29yZSBvYmplY3RzXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlTY29yZSBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yICouc2NvcmVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjb3JlX2NoaWxkcmVuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY29yZV9yYW5nZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWF4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbnZhbGlkRXJyb3JDb2RlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbnZhbGlkVHlwZUNvZGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IGludmFsaWRSYW5nZUNvZGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlY2ltYWxSZWdleFxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgICB7XG4gICAgICAgIHNjb3JlX2NoaWxkcmVuLFxuICAgICAgICBzY29yZV9yYW5nZSxcbiAgICAgICAgbWF4LFxuICAgICAgICBpbnZhbGlkRXJyb3JDb2RlLFxuICAgICAgICBpbnZhbGlkVHlwZUNvZGUsXG4gICAgICAgIGludmFsaWRSYW5nZUNvZGUsXG4gICAgICAgIGRlY2ltYWxSZWdleCxcbiAgICAgIH0pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy4jX2NoaWxkcmVuID0gc2NvcmVfY2hpbGRyZW4gfHxcbiAgICAgICAgc2Nvcm0xMl9jb25zdGFudHMuc2NvcmVfY2hpbGRyZW47XG4gICAgdGhpcy4jX3Njb3JlX3JhbmdlID0gIXNjb3JlX3JhbmdlID8gZmFsc2UgOiBzY29ybTEyX3JlZ2V4LnNjb3JlX3JhbmdlO1xuICAgIHRoaXMuI21heCA9IChtYXggfHwgbWF4ID09PSAnJykgPyBtYXggOiAnMTAwJztcbiAgICB0aGlzLiNfaW52YWxpZF9lcnJvcl9jb2RlID0gaW52YWxpZEVycm9yQ29kZSB8fFxuICAgICAgICBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFO1xuICAgIHRoaXMuI19pbnZhbGlkX3R5cGVfY29kZSA9IGludmFsaWRUeXBlQ29kZSB8fFxuICAgICAgICBzY29ybTEyX2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0g7XG4gICAgdGhpcy4jX2ludmFsaWRfcmFuZ2VfY29kZSA9IGludmFsaWRSYW5nZUNvZGUgfHxcbiAgICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0U7XG4gICAgdGhpcy4jX2RlY2ltYWxfcmVnZXggPSBkZWNpbWFsUmVnZXggfHxcbiAgICAgICAgc2Nvcm0xMl9yZWdleC5DTUlEZWNpbWFsO1xuICB9XG5cbiAgI19jaGlsZHJlbjtcbiAgI19zY29yZV9yYW5nZTtcbiAgI19pbnZhbGlkX2Vycm9yX2NvZGU7XG4gICNfaW52YWxpZF90eXBlX2NvZGU7XG4gICNfaW52YWxpZF9yYW5nZV9jb2RlO1xuICAjX2RlY2ltYWxfcmVnZXg7XG4gICNyYXcgPSAnJztcbiAgI21pbiA9ICcnO1xuICAjbWF4O1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIF9jaGlsZHJlblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciBfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX2NoaWxkcmVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IodGhpcy4jX2ludmFsaWRfZXJyb3JfY29kZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjcmF3XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCByYXcoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3JhdztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNyYXdcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJhd1xuICAgKi9cbiAgc2V0IHJhdyhyYXcpIHtcbiAgICBpZiAoY2hlY2tWYWxpZEZvcm1hdChyYXcsIHRoaXMuI19kZWNpbWFsX3JlZ2V4LFxuICAgICAgICB0aGlzLiNfaW52YWxpZF90eXBlX2NvZGUpICYmXG4gICAgICAgICghdGhpcy4jX3Njb3JlX3JhbmdlIHx8XG4gICAgICAgICAgICBjaGVja1ZhbGlkUmFuZ2UocmF3LCB0aGlzLiNfc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgICAgICAgdGhpcy4jX2ludmFsaWRfcmFuZ2VfY29kZSkpKSB7XG4gICAgICB0aGlzLiNyYXcgPSByYXc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI21pblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbWluKCkge1xuICAgIHJldHVybiB0aGlzLiNtaW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbWluXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtaW5cbiAgICovXG4gIHNldCBtaW4obWluKSB7XG4gICAgaWYgKGNoZWNrVmFsaWRGb3JtYXQobWluLCB0aGlzLiNfZGVjaW1hbF9yZWdleCxcbiAgICAgICAgdGhpcy4jX2ludmFsaWRfdHlwZV9jb2RlKSAmJlxuICAgICAgICAoIXRoaXMuI19zY29yZV9yYW5nZSB8fFxuICAgICAgICAgICAgY2hlY2tWYWxpZFJhbmdlKG1pbiwgdGhpcy4jX3Njb3JlX3JhbmdlLFxuICAgICAgICAgICAgICAgIHRoaXMuI19pbnZhbGlkX3JhbmdlX2NvZGUpKSkge1xuICAgICAgdGhpcy4jbWluID0gbWluO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNtYXhcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1heCgpIHtcbiAgICByZXR1cm4gdGhpcy4jbWF4O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI21heFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWF4XG4gICAqL1xuICBzZXQgbWF4KG1heCkge1xuICAgIGlmIChjaGVja1ZhbGlkRm9ybWF0KG1heCwgdGhpcy4jX2RlY2ltYWxfcmVnZXgsXG4gICAgICAgIHRoaXMuI19pbnZhbGlkX3R5cGVfY29kZSkgJiZcbiAgICAgICAgKCF0aGlzLiNfc2NvcmVfcmFuZ2UgfHxcbiAgICAgICAgICAgIGNoZWNrVmFsaWRSYW5nZShtYXgsIHRoaXMuI19zY29yZV9yYW5nZSxcbiAgICAgICAgICAgICAgICB0aGlzLiNfaW52YWxpZF9yYW5nZV9jb2RlKSkpIHtcbiAgICAgIHRoaXMuI21heCA9IG1heDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciAqLnNjb3JlXG4gICAqIEByZXR1cm4ge3ttaW46IHN0cmluZywgbWF4OiBzdHJpbmcsIHJhdzogc3RyaW5nfX1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdyYXcnOiB0aGlzLnJhdyxcbiAgICAgICdtaW4nOiB0aGlzLm1pbixcbiAgICAgICdtYXgnOiB0aGlzLm1heCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGNtaSAqLm4gb2JqZWN0c1xuICovXG5leHBvcnQgY2xhc3MgQ01JQXJyYXkgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGNtaSAqLm4gYXJyYXlzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjaGlsZHJlblxuICAgKiBAcGFyYW0ge251bWJlcn0gZXJyb3JDb2RlXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih7Y2hpbGRyZW4sIGVycm9yQ29kZX0pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuI19jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgIHRoaXMuI2Vycm9yQ29kZSA9IGVycm9yQ29kZTtcbiAgICB0aGlzLmNoaWxkQXJyYXkgPSBbXTtcbiAgfVxuXG4gICNlcnJvckNvZGU7XG4gICNfY2hpbGRyZW47XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgX2NoaWxkcmVuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciBfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX2NoaWxkcmVuXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IodGhpcy4jZXJyb3JDb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIF9jb3VudFxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAqL1xuICBnZXQgX2NvdW50KCkge1xuICAgIHJldHVybiB0aGlzLmNoaWxkQXJyYXkubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgX2NvdW50LiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IF9jb3VudFxuICAgKi9cbiAgc2V0IF9jb3VudChfY291bnQpIHtcbiAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHRoaXMuI2Vycm9yQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciAqLm4gYXJyYXlzXG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHRbaSArICcnXSA9IHRoaXMuY2hpbGRBcnJheVtpXTtcbiAgICB9XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iLCIvLyBAZmxvd1xuaW1wb3J0IHtcbiAgQmFzZUNNSSxcbiAgY2hlY2tWYWxpZEZvcm1hdCxcbiAgY2hlY2tWYWxpZFJhbmdlLFxuICBDTUlBcnJheSxcbiAgQ01JU2NvcmUsXG59IGZyb20gJy4vY29tbW9uJztcbmltcG9ydCBBUElDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuaW1wb3J0IEVycm9yQ29kZXMgZnJvbSAnLi4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJztcbmltcG9ydCBSZWdleCBmcm9tICcuLi9jb25zdGFudHMvcmVnZXgnO1xuaW1wb3J0IHtWYWxpZGF0aW9uRXJyb3J9IGZyb20gJy4uL2V4Y2VwdGlvbnMnO1xuaW1wb3J0ICogYXMgVXRpbGl0aWVzIGZyb20gJy4uL3V0aWxpdGllcyc7XG5pbXBvcnQgKiBhcyBVdGlsIGZyb20gJy4uL3V0aWxpdGllcyc7XG5cbmNvbnN0IHNjb3JtMTJfY29uc3RhbnRzID0gQVBJQ29uc3RhbnRzLnNjb3JtMTI7XG5jb25zdCBzY29ybTEyX3JlZ2V4ID0gUmVnZXguc2Nvcm0xMjtcbmNvbnN0IHNjb3JtMTJfZXJyb3JfY29kZXMgPSBFcnJvckNvZGVzLnNjb3JtMTI7XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgUmVhZCBPbmx5IGVycm9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aHJvd1JlYWRPbmx5RXJyb3IoKSB7XG4gIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3Ioc2Nvcm0xMl9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgV3JpdGUgT25seSBlcnJvclxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dXcml0ZU9ubHlFcnJvcigpIHtcbiAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihzY29ybTEyX2Vycm9yX2NvZGVzLldSSVRFX09OTFlfRUxFTUVOVCk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgSW52YWxpZCBTZXQgZXJyb3JcbiAqL1xuZnVuY3Rpb24gdGhyb3dJbnZhbGlkVmFsdWVFcnJvcigpIHtcbiAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kLCBubyByZWFzb24gdG8gaGF2ZSB0byBwYXNzIHRoZSBzYW1lIGVycm9yIGNvZGVzIGV2ZXJ5IHRpbWVcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWdleFBhdHRlcm5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWxsb3dFbXB0eVN0cmluZ1xuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrMTJWYWxpZEZvcm1hdChcbiAgICB2YWx1ZTogU3RyaW5nLFxuICAgIHJlZ2V4UGF0dGVybjogU3RyaW5nLFxuICAgIGFsbG93RW1wdHlTdHJpbmc/OiBib29sZWFuKSB7XG4gIHJldHVybiBjaGVja1ZhbGlkRm9ybWF0KHZhbHVlLCByZWdleFBhdHRlcm4sXG4gICAgICBzY29ybTEyX2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gsIGFsbG93RW1wdHlTdHJpbmcpO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QsIG5vIHJlYXNvbiB0byBoYXZlIHRvIHBhc3MgdGhlIHNhbWUgZXJyb3IgY29kZXMgZXZlcnkgdGltZVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9IHJhbmdlUGF0dGVyblxuICogQHBhcmFtIHtib29sZWFufSBhbGxvd0VtcHR5U3RyaW5nXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2sxMlZhbGlkUmFuZ2UoXG4gICAgdmFsdWU6IGFueSxcbiAgICByYW5nZVBhdHRlcm46IFN0cmluZyxcbiAgICBhbGxvd0VtcHR5U3RyaW5nPzogYm9vbGVhbikge1xuICByZXR1cm4gY2hlY2tWYWxpZFJhbmdlKHZhbHVlLCByYW5nZVBhdHRlcm4sXG4gICAgICBzY29ybTEyX2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRSwgYWxsb3dFbXB0eVN0cmluZyk7XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIHRoZSBjbWkgb2JqZWN0IGZvciBTQ09STSAxLjJcbiAqL1xuZXhwb3J0IGNsYXNzIENNSSBleHRlbmRzIEJhc2VDTUkge1xuICAjX2NoaWxkcmVuID0gJyc7XG4gICNfdmVyc2lvbiA9ICczLjQnO1xuICAjbGF1bmNoX2RhdGEgPSAnJztcbiAgI2NvbW1lbnRzID0gJyc7XG4gICNjb21tZW50c19mcm9tX2xtcyA9ICcnO1xuXG4gIHN0dWRlbnRfZGF0YSA9IG51bGw7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciB0aGUgU0NPUk0gMS4yIGNtaSBvYmplY3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNtaV9jaGlsZHJlblxuICAgKiBAcGFyYW0geyhDTUlTdHVkZW50RGF0YXxBSUNDQ01JU3R1ZGVudERhdGEpfSBzdHVkZW50X2RhdGFcbiAgICogQHBhcmFtIHtib29sZWFufSBpbml0aWFsaXplZFxuICAgKi9cbiAgY29uc3RydWN0b3IoY21pX2NoaWxkcmVuLCBzdHVkZW50X2RhdGEsIGluaXRpYWxpemVkOiBib29sZWFuKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGlmIChpbml0aWFsaXplZCkgdGhpcy5pbml0aWFsaXplKCk7XG5cbiAgICB0aGlzLiNfY2hpbGRyZW4gPSBjbWlfY2hpbGRyZW4gP1xuICAgICAgICBjbWlfY2hpbGRyZW4gOlxuICAgICAgICBzY29ybTEyX2NvbnN0YW50cy5jbWlfY2hpbGRyZW47XG4gICAgdGhpcy5jb3JlID0gbmV3IENNSUNvcmUoKTtcbiAgICB0aGlzLm9iamVjdGl2ZXMgPSBuZXcgQ01JT2JqZWN0aXZlcygpO1xuICAgIHRoaXMuc3R1ZGVudF9kYXRhID0gc3R1ZGVudF9kYXRhID8gc3R1ZGVudF9kYXRhIDogbmV3IENNSVN0dWRlbnREYXRhKCk7XG4gICAgdGhpcy5zdHVkZW50X3ByZWZlcmVuY2UgPSBuZXcgQ01JU3R1ZGVudFByZWZlcmVuY2UoKTtcbiAgICB0aGlzLmludGVyYWN0aW9ucyA9IG5ldyBDTUlJbnRlcmFjdGlvbnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5jb3JlPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5vYmplY3RpdmVzPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zdHVkZW50X2RhdGE/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnN0dWRlbnRfcHJlZmVyZW5jZT8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWlcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBzdXNwZW5kX2RhdGE6IHN0cmluZyxcbiAgICogICAgICBsYXVuY2hfZGF0YTogc3RyaW5nLFxuICAgKiAgICAgIGNvbW1lbnRzOiBzdHJpbmcsXG4gICAqICAgICAgY29tbWVudHNfZnJvbV9sbXM6IHN0cmluZyxcbiAgICogICAgICBjb3JlOiBDTUlDb3JlLFxuICAgKiAgICAgIG9iamVjdGl2ZXM6IENNSU9iamVjdGl2ZXMsXG4gICAqICAgICAgc3R1ZGVudF9kYXRhOiBDTUlTdHVkZW50RGF0YSxcbiAgICogICAgICBzdHVkZW50X3ByZWZlcmVuY2U6IENNSVN0dWRlbnRQcmVmZXJlbmNlLFxuICAgKiAgICAgIGludGVyYWN0aW9uczogQ01JSW50ZXJhY3Rpb25zXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdzdXNwZW5kX2RhdGEnOiB0aGlzLnN1c3BlbmRfZGF0YSxcbiAgICAgICdsYXVuY2hfZGF0YSc6IHRoaXMubGF1bmNoX2RhdGEsXG4gICAgICAnY29tbWVudHMnOiB0aGlzLmNvbW1lbnRzLFxuICAgICAgJ2NvbW1lbnRzX2Zyb21fbG1zJzogdGhpcy5jb21tZW50c19mcm9tX2xtcyxcbiAgICAgICdjb3JlJzogdGhpcy5jb3JlLFxuICAgICAgJ29iamVjdGl2ZXMnOiB0aGlzLm9iamVjdGl2ZXMsXG4gICAgICAnc3R1ZGVudF9kYXRhJzogdGhpcy5zdHVkZW50X2RhdGEsXG4gICAgICAnc3R1ZGVudF9wcmVmZXJlbmNlJzogdGhpcy5zdHVkZW50X3ByZWZlcmVuY2UsXG4gICAgICAnaW50ZXJhY3Rpb25zJzogdGhpcy5pbnRlcmFjdGlvbnMsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX3ZlcnNpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IF92ZXJzaW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNfdmVyc2lvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfdmVyc2lvbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfdmVyc2lvblxuICAgKi9cbiAgc2V0IF92ZXJzaW9uKF92ZXJzaW9uKSB7XG4gICAgdGhyb3dJbnZhbGlkVmFsdWVFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI19jaGlsZHJlblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX3ZlcnNpb24uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX2NoaWxkcmVuXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93SW52YWxpZFZhbHVlRXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdXNwZW5kX2RhdGFcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN1c3BlbmRfZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb3JlPy5zdXNwZW5kX2RhdGE7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3VzcGVuZF9kYXRhXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdXNwZW5kX2RhdGFcbiAgICovXG4gIHNldCBzdXNwZW5kX2RhdGEoc3VzcGVuZF9kYXRhKSB7XG4gICAgaWYgKHRoaXMuY29yZSkge1xuICAgICAgdGhpcy5jb3JlLnN1c3BlbmRfZGF0YSA9IHN1c3BlbmRfZGF0YTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGF1bmNoX2RhdGFcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxhdW5jaF9kYXRhKCkge1xuICAgIHJldHVybiB0aGlzLiNsYXVuY2hfZGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsYXVuY2hfZGF0YS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsYXVuY2hfZGF0YVxuICAgKi9cbiAgc2V0IGxhdW5jaF9kYXRhKGxhdW5jaF9kYXRhKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNsYXVuY2hfZGF0YSA9IGxhdW5jaF9kYXRhIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29tbWVudHNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbW1lbnRzKCkge1xuICAgIHJldHVybiB0aGlzLiNjb21tZW50cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb21tZW50c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY29tbWVudHNcbiAgICovXG4gIHNldCBjb21tZW50cyhjb21tZW50cykge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoY29tbWVudHMsIHNjb3JtMTJfcmVnZXguQ01JU3RyaW5nNDA5NikpIHtcbiAgICAgIHRoaXMuI2NvbW1lbnRzID0gY29tbWVudHM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NvbW1lbnRzX2Zyb21fbG1zXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb21tZW50c19mcm9tX2xtcygpIHtcbiAgICByZXR1cm4gdGhpcy4jY29tbWVudHNfZnJvbV9sbXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29tbWVudHNfZnJvbV9sbXMuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29tbWVudHNfZnJvbV9sbXNcbiAgICovXG4gIHNldCBjb21tZW50c19mcm9tX2xtcyhjb21tZW50c19mcm9tX2xtcykge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jY29tbWVudHNfZnJvbV9sbXMgPSBjb21tZW50c19mcm9tX2xtcyA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgdGhlIGN1cnJlbnQgc2Vzc2lvbiB0aW1lIHRvIHRoZSBleGlzdGluZyB0b3RhbCB0aW1lLlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXRDdXJyZW50VG90YWxUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLmNvcmUuZ2V0Q3VycmVudFRvdGFsVGltZSh0aGlzLnN0YXJ0X3RpbWUpO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIHRoZSBjbWkuY29yZSBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuY2xhc3MgQ01JQ29yZSBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5jb3JlXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zY29yZSA9IG5ldyBDTUlTY29yZShcbiAgICAgICAge1xuICAgICAgICAgIHNjb3JlX2NoaWxkcmVuOiBzY29ybTEyX2NvbnN0YW50cy5zY29yZV9jaGlsZHJlbixcbiAgICAgICAgICBzY29yZV9yYW5nZTogc2Nvcm0xMl9yZWdleC5zY29yZV9yYW5nZSxcbiAgICAgICAgICBpbnZhbGlkRXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgICAgIGludmFsaWRUeXBlQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENILFxuICAgICAgICAgIGludmFsaWRSYW5nZUNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFLFxuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zY29yZT8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgI19jaGlsZHJlbiA9IHNjb3JtMTJfY29uc3RhbnRzLmNvcmVfY2hpbGRyZW47XG4gICNzdHVkZW50X2lkID0gJyc7XG4gICNzdHVkZW50X25hbWUgPSAnJztcbiAgI2xlc3Nvbl9sb2NhdGlvbiA9ICcnO1xuICAjY3JlZGl0ID0gJyc7XG4gICNsZXNzb25fc3RhdHVzID0gJ25vdCBhdHRlbXB0ZWQnO1xuICAjZW50cnkgPSAnJztcbiAgI3RvdGFsX3RpbWUgPSAnJztcbiAgI2xlc3Nvbl9tb2RlID0gJ25vcm1hbCc7XG4gICNleGl0ID0gJyc7XG4gICNzZXNzaW9uX3RpbWUgPSAnMDA6MDA6MDAnO1xuICAjc3VzcGVuZF9kYXRhID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI19jaGlsZHJlblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvd0ludmFsaWRWYWx1ZUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3R1ZGVudF9pZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3R1ZGVudF9pZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jc3R1ZGVudF9pZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdHVkZW50X2lkLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0dWRlbnRfaWRcbiAgICovXG4gIHNldCBzdHVkZW50X2lkKHN0dWRlbnRfaWQpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI3N0dWRlbnRfaWQgPSBzdHVkZW50X2lkIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3R1ZGVudF9uYW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdHVkZW50X25hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0dWRlbnRfbmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdHVkZW50X25hbWUuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3R1ZGVudF9uYW1lXG4gICAqL1xuICBzZXQgc3R1ZGVudF9uYW1lKHN0dWRlbnRfbmFtZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jc3R1ZGVudF9uYW1lID0gc3R1ZGVudF9uYW1lIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGVzc29uX2xvY2F0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsZXNzb25fbG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xlc3Nvbl9sb2NhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsZXNzb25fbG9jYXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlc3Nvbl9sb2NhdGlvblxuICAgKi9cbiAgc2V0IGxlc3Nvbl9sb2NhdGlvbihsZXNzb25fbG9jYXRpb24pIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGxlc3Nvbl9sb2NhdGlvbiwgc2Nvcm0xMl9yZWdleC5DTUlTdHJpbmcyNTYsIHRydWUpKSB7XG4gICAgICB0aGlzLiNsZXNzb25fbG9jYXRpb24gPSBsZXNzb25fbG9jYXRpb247XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NyZWRpdFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY3JlZGl0KCkge1xuICAgIHJldHVybiB0aGlzLiNjcmVkaXQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY3JlZGl0LiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNyZWRpdFxuICAgKi9cbiAgc2V0IGNyZWRpdChjcmVkaXQpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI2NyZWRpdCA9IGNyZWRpdCA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xlc3Nvbl9zdGF0dXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlc3Nvbl9zdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xlc3Nvbl9zdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGVzc29uX3N0YXR1c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gbGVzc29uX3N0YXR1c1xuICAgKi9cbiAgc2V0IGxlc3Nvbl9zdGF0dXMobGVzc29uX3N0YXR1cykge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQobGVzc29uX3N0YXR1cywgc2Nvcm0xMl9yZWdleC5DTUlTdGF0dXMpKSB7XG4gICAgICB0aGlzLiNsZXNzb25fc3RhdHVzID0gbGVzc29uX3N0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZW50cnlcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGVudHJ5KCkge1xuICAgIHJldHVybiB0aGlzLiNlbnRyeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNlbnRyeS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlbnRyeVxuICAgKi9cbiAgc2V0IGVudHJ5KGVudHJ5KSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNlbnRyeSA9IGVudHJ5IDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdG90YWxfdGltZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdG90YWxfdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jdG90YWxfdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0b3RhbF90aW1lLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvdGFsX3RpbWVcbiAgICovXG4gIHNldCB0b3RhbF90aW1lKHRvdGFsX3RpbWUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI3RvdGFsX3RpbWUgPSB0b3RhbF90aW1lIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGVzc29uX21vZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlc3Nvbl9tb2RlKCkge1xuICAgIHJldHVybiB0aGlzLiNsZXNzb25fbW9kZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsZXNzb25fbW9kZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZXNzb25fbW9kZVxuICAgKi9cbiAgc2V0IGxlc3Nvbl9tb2RlKGxlc3Nvbl9tb2RlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNsZXNzb25fbW9kZSA9IGxlc3Nvbl9tb2RlIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZXhpdC4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCBleGl0KCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNleGl0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2V4aXRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV4aXRcbiAgICovXG4gIHNldCBleGl0KGV4aXQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGV4aXQsIHNjb3JtMTJfcmVnZXguQ01JRXhpdCwgdHJ1ZSkpIHtcbiAgICAgIHRoaXMuI2V4aXQgPSBleGl0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzZXNzaW9uX3RpbWUuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgc2Vzc2lvbl90aW1lKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNzZXNzaW9uX3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc2Vzc2lvbl90aW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZXNzaW9uX3RpbWVcbiAgICovXG4gIHNldCBzZXNzaW9uX3RpbWUoc2Vzc2lvbl90aW1lKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChzZXNzaW9uX3RpbWUsIHNjb3JtMTJfcmVnZXguQ01JVGltZXNwYW4pKSB7XG4gICAgICB0aGlzLiNzZXNzaW9uX3RpbWUgPSBzZXNzaW9uX3RpbWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N1c3BlbmRfZGF0YVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3VzcGVuZF9kYXRhKCkge1xuICAgIHJldHVybiB0aGlzLiNzdXNwZW5kX2RhdGE7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3VzcGVuZF9kYXRhXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdXNwZW5kX2RhdGFcbiAgICovXG4gIHNldCBzdXNwZW5kX2RhdGEoc3VzcGVuZF9kYXRhKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChzdXNwZW5kX2RhdGEsIHNjb3JtMTJfcmVnZXguQ01JU3RyaW5nNDA5NiwgdHJ1ZSkpIHtcbiAgICAgIHRoaXMuI3N1c3BlbmRfZGF0YSA9IHN1c3BlbmRfZGF0YTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0aGUgY3VycmVudCBzZXNzaW9uIHRpbWUgdG8gdGhlIGV4aXN0aW5nIHRvdGFsIHRpbWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzdGFydF90aW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldEN1cnJlbnRUb3RhbFRpbWUoc3RhcnRfdGltZTogTnVtYmVyKSB7XG4gICAgbGV0IHNlc3Npb25UaW1lID0gdGhpcy4jc2Vzc2lvbl90aW1lO1xuICAgIGNvbnN0IHN0YXJ0VGltZSA9IHN0YXJ0X3RpbWU7XG5cbiAgICBpZiAodHlwZW9mIHN0YXJ0VGltZSAhPT0gJ3VuZGVmaW5lZCcgfHwgc3RhcnRUaW1lID09PSBudWxsKSB7XG4gICAgICBjb25zdCBzZWNvbmRzID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBzdGFydFRpbWU7XG4gICAgICBzZXNzaW9uVGltZSA9IFV0aWwuZ2V0U2Vjb25kc0FzSEhNTVNTKHNlY29uZHMgLyAxMDAwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gVXRpbGl0aWVzLmFkZEhITU1TU1RpbWVTdHJpbmdzKFxuICAgICAgICB0aGlzLiN0b3RhbF90aW1lLFxuICAgICAgICBzZXNzaW9uVGltZSxcbiAgICAgICAgbmV3IFJlZ0V4cChzY29ybTEyX3JlZ2V4LkNNSVRpbWVzcGFuKSxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmNvcmVcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBzdHVkZW50X25hbWU6IHN0cmluZyxcbiAgICogICAgICBlbnRyeTogc3RyaW5nLFxuICAgKiAgICAgIGV4aXQ6IHN0cmluZyxcbiAgICogICAgICBzY29yZTogQ01JU2NvcmUsXG4gICAqICAgICAgc3R1ZGVudF9pZDogc3RyaW5nLFxuICAgKiAgICAgIGxlc3Nvbl9tb2RlOiBzdHJpbmcsXG4gICAqICAgICAgbGVzc29uX2xvY2F0aW9uOiBzdHJpbmcsXG4gICAqICAgICAgbGVzc29uX3N0YXR1czogc3RyaW5nLFxuICAgKiAgICAgIGNyZWRpdDogc3RyaW5nLFxuICAgKiAgICAgIHNlc3Npb25fdGltZTogKlxuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnc3R1ZGVudF9pZCc6IHRoaXMuc3R1ZGVudF9pZCxcbiAgICAgICdzdHVkZW50X25hbWUnOiB0aGlzLnN0dWRlbnRfbmFtZSxcbiAgICAgICdsZXNzb25fbG9jYXRpb24nOiB0aGlzLmxlc3Nvbl9sb2NhdGlvbixcbiAgICAgICdjcmVkaXQnOiB0aGlzLmNyZWRpdCxcbiAgICAgICdsZXNzb25fc3RhdHVzJzogdGhpcy5sZXNzb25fc3RhdHVzLFxuICAgICAgJ2VudHJ5JzogdGhpcy5lbnRyeSxcbiAgICAgICdsZXNzb25fbW9kZSc6IHRoaXMubGVzc29uX21vZGUsXG4gICAgICAnZXhpdCc6IHRoaXMuZXhpdCxcbiAgICAgICdzZXNzaW9uX3RpbWUnOiB0aGlzLnNlc3Npb25fdGltZSxcbiAgICAgICdzY29yZSc6IHRoaXMuc2NvcmUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLm9iamVjdGl2ZXMgb2JqZWN0XG4gKiBAZXh0ZW5kcyBDTUlBcnJheVxuICovXG5jbGFzcyBDTUlPYmplY3RpdmVzIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5vYmplY3RpdmVzXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogc2Nvcm0xMl9jb25zdGFudHMub2JqZWN0aXZlc19jaGlsZHJlbixcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkuc3R1ZGVudF9kYXRhIG9iamVjdFxuICogQGV4dGVuZHMgQmFzZUNNSVxuICovXG5leHBvcnQgY2xhc3MgQ01JU3R1ZGVudERhdGEgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI19jaGlsZHJlbjtcbiAgI21hc3Rlcnlfc2NvcmUgPSAnJztcbiAgI21heF90aW1lX2FsbG93ZWQgPSAnJztcbiAgI3RpbWVfbGltaXRfYWN0aW9uID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuc3R1ZGVudF9kYXRhXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHVkZW50X2RhdGFfY2hpbGRyZW5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHN0dWRlbnRfZGF0YV9jaGlsZHJlbikge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLiNfY2hpbGRyZW4gPSBzdHVkZW50X2RhdGFfY2hpbGRyZW4gP1xuICAgICAgICBzdHVkZW50X2RhdGFfY2hpbGRyZW4gOlxuICAgICAgICBzY29ybTEyX2NvbnN0YW50cy5zdHVkZW50X2RhdGFfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX2NoaWxkcmVuXG4gICAqIEByZXR1cm4geyp9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvd0ludmFsaWRWYWx1ZUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbWFzdGVyX3Njb3JlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBtYXN0ZXJ5X3Njb3JlKCkge1xuICAgIHJldHVybiB0aGlzLiNtYXN0ZXJ5X3Njb3JlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI21hc3Rlcl9zY29yZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYXN0ZXJ5X3Njb3JlXG4gICAqL1xuICBzZXQgbWFzdGVyeV9zY29yZShtYXN0ZXJ5X3Njb3JlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNtYXN0ZXJ5X3Njb3JlID0gbWFzdGVyeV9zY29yZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI21heF90aW1lX2FsbG93ZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1heF90aW1lX2FsbG93ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI21heF90aW1lX2FsbG93ZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbWF4X3RpbWVfYWxsb3dlZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYXhfdGltZV9hbGxvd2VkXG4gICAqL1xuICBzZXQgbWF4X3RpbWVfYWxsb3dlZChtYXhfdGltZV9hbGxvd2VkKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNtYXhfdGltZV9hbGxvd2VkID0gbWF4X3RpbWVfYWxsb3dlZCA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWVfbGltaXRfYWN0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lX2xpbWl0X2FjdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jdGltZV9saW1pdF9hY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGltZV9saW1pdF9hY3Rpb24uIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZV9saW1pdF9hY3Rpb25cbiAgICovXG4gIHNldCB0aW1lX2xpbWl0X2FjdGlvbih0aW1lX2xpbWl0X2FjdGlvbikge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jdGltZV9saW1pdF9hY3Rpb24gPSB0aW1lX2xpbWl0X2FjdGlvbiA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLnN0dWRlbnRfZGF0YVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIG1heF90aW1lX2FsbG93ZWQ6IHN0cmluZyxcbiAgICogICAgICB0aW1lX2xpbWl0X2FjdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIG1hc3Rlcnlfc2NvcmU6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnbWFzdGVyeV9zY29yZSc6IHRoaXMubWFzdGVyeV9zY29yZSxcbiAgICAgICdtYXhfdGltZV9hbGxvd2VkJzogdGhpcy5tYXhfdGltZV9hbGxvd2VkLFxuICAgICAgJ3RpbWVfbGltaXRfYWN0aW9uJzogdGhpcy50aW1lX2xpbWl0X2FjdGlvbixcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkuc3R1ZGVudF9wcmVmZXJlbmNlIG9iamVjdFxuICogQGV4dGVuZHMgQmFzZUNNSVxuICovXG5leHBvcnQgY2xhc3MgQ01JU3R1ZGVudFByZWZlcmVuY2UgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI19jaGlsZHJlbjtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5zdHVkZW50X3ByZWZlcmVuY2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlblxuICAgKi9cbiAgY29uc3RydWN0b3Ioc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuI19jaGlsZHJlbiA9IHN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbiA/XG4gICAgICAgIHN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbiA6XG4gICAgICAgIHNjb3JtMTJfY29uc3RhbnRzLnN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbjtcbiAgfVxuXG4gICNhdWRpbyA9ICcnO1xuICAjbGFuZ3VhZ2UgPSAnJztcbiAgI3NwZWVkID0gJyc7XG4gICN0ZXh0ID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI19jaGlsZHJlblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvd0ludmFsaWRWYWx1ZUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjYXVkaW9cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGF1ZGlvKCkge1xuICAgIHJldHVybiB0aGlzLiNhdWRpbztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNhdWRpb1xuICAgKiBAcGFyYW0ge3N0cmluZ30gYXVkaW9cbiAgICovXG4gIHNldCBhdWRpbyhhdWRpbykge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoYXVkaW8sIHNjb3JtMTJfcmVnZXguQ01JU0ludGVnZXIpICYmXG4gICAgICAgIGNoZWNrMTJWYWxpZFJhbmdlKGF1ZGlvLCBzY29ybTEyX3JlZ2V4LmF1ZGlvX3JhbmdlKSkge1xuICAgICAgdGhpcy4jYXVkaW8gPSBhdWRpbztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGFuZ3VhZ2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxhbmd1YWdlKCkge1xuICAgIHJldHVybiB0aGlzLiNsYW5ndWFnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsYW5ndWFnZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGFuZ3VhZ2VcbiAgICovXG4gIHNldCBsYW5ndWFnZShsYW5ndWFnZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQobGFuZ3VhZ2UsIHNjb3JtMTJfcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jbGFuZ3VhZ2UgPSBsYW5ndWFnZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3BlZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHNwZWVkKCkge1xuICAgIHJldHVybiB0aGlzLiNzcGVlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzcGVlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3BlZWRcbiAgICovXG4gIHNldCBzcGVlZChzcGVlZCkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoc3BlZWQsIHNjb3JtMTJfcmVnZXguQ01JU0ludGVnZXIpICYmXG4gICAgICAgIGNoZWNrMTJWYWxpZFJhbmdlKHNwZWVkLCBzY29ybTEyX3JlZ2V4LnNwZWVkX3JhbmdlKSkge1xuICAgICAgdGhpcy4jc3BlZWQgPSBzcGVlZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGV4dFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy4jdGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0ZXh0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4gICAqL1xuICBzZXQgdGV4dCh0ZXh0KSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh0ZXh0LCBzY29ybTEyX3JlZ2V4LkNNSVNJbnRlZ2VyKSAmJlxuICAgICAgICBjaGVjazEyVmFsaWRSYW5nZSh0ZXh0LCBzY29ybTEyX3JlZ2V4LnRleHRfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiN0ZXh0ID0gdGV4dDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuc3R1ZGVudF9wcmVmZXJlbmNlXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgYXVkaW86IHN0cmluZyxcbiAgICogICAgICBsYW5ndWFnZTogc3RyaW5nLFxuICAgKiAgICAgIHNwZWVkOiBzdHJpbmcsXG4gICAqICAgICAgdGV4dDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdhdWRpbyc6IHRoaXMuYXVkaW8sXG4gICAgICAnbGFuZ3VhZ2UnOiB0aGlzLmxhbmd1YWdlLFxuICAgICAgJ3NwZWVkJzogdGhpcy5zcGVlZCxcbiAgICAgICd0ZXh0JzogdGhpcy50ZXh0LFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5pbnRlcmFjdGlvbnMgb2JqZWN0XG4gKiBAZXh0ZW5kcyBCYXNlQ01JXG4gKi9cbmNsYXNzIENNSUludGVyYWN0aW9ucyBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogc2Nvcm0xMl9jb25zdGFudHMuaW50ZXJhY3Rpb25zX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5pbnRlcmFjdGlvbnMubiBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5pbnRlcmFjdGlvbnMubiBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLm9iamVjdGl2ZXMgPSBuZXcgQ01JQXJyYXkoe1xuICAgICAgZXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgY2hpbGRyZW46IHNjb3JtMTJfY29uc3RhbnRzLm9iamVjdGl2ZXNfY2hpbGRyZW4sXG4gICAgfSk7XG4gICAgdGhpcy5jb3JyZWN0X3Jlc3BvbnNlcyA9IG5ldyBDTUlBcnJheSh7XG4gICAgICBlcnJvckNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUsXG4gICAgICBjaGlsZHJlbjogc2Nvcm0xMl9jb25zdGFudHMuY29ycmVjdF9yZXNwb25zZXNfY2hpbGRyZW4sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMub2JqZWN0aXZlcz8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuY29ycmVjdF9yZXNwb25zZXM/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICNpZCA9ICcnO1xuICAjdGltZSA9ICcnO1xuICAjdHlwZSA9ICcnO1xuICAjd2VpZ2h0aW5nID0gJyc7XG4gICNzdHVkZW50X3Jlc3BvbnNlID0gJyc7XG4gICNyZXN1bHQgPSAnJztcbiAgI2xhdGVuY3kgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaWQuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChpZCwgc2Nvcm0xMl9yZWdleC5DTUlJZGVudGlmaWVyKSkge1xuICAgICAgdGhpcy4jaWQgPSBpZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZS4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCB0aW1lKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiN0aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVcbiAgICovXG4gIHNldCB0aW1lKHRpbWUpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHRpbWUsIHNjb3JtMTJfcmVnZXguQ01JVGltZSkpIHtcbiAgICAgIHRoaXMuI3RpbWUgPSB0aW1lO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0eXBlLiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI3R5cGU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICAgKi9cbiAgc2V0IHR5cGUodHlwZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQodHlwZSwgc2Nvcm0xMl9yZWdleC5DTUlUeXBlKSkge1xuICAgICAgdGhpcy4jdHlwZSA9IHR5cGU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3dlaWdodGluZy4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCB3ZWlnaHRpbmcoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/XG4gICAgICAgIHRocm93V3JpdGVPbmx5RXJyb3IoKSA6XG4gICAgICAgIHRoaXMuI3dlaWdodGluZztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN3ZWlnaHRpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IHdlaWdodGluZ1xuICAgKi9cbiAgc2V0IHdlaWdodGluZyh3ZWlnaHRpbmcpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHdlaWdodGluZywgc2Nvcm0xMl9yZWdleC5DTUlEZWNpbWFsKSAmJlxuICAgICAgICBjaGVjazEyVmFsaWRSYW5nZSh3ZWlnaHRpbmcsIHNjb3JtMTJfcmVnZXgud2VpZ2h0aW5nX3JhbmdlKSkge1xuICAgICAgdGhpcy4jd2VpZ2h0aW5nID0gd2VpZ2h0aW5nO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdHVkZW50X3Jlc3BvbnNlLiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IHN0dWRlbnRfcmVzcG9uc2UoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI3N0dWRlbnRfcmVzcG9uc2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3R1ZGVudF9yZXNwb25zZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3R1ZGVudF9yZXNwb25zZVxuICAgKi9cbiAgc2V0IHN0dWRlbnRfcmVzcG9uc2Uoc3R1ZGVudF9yZXNwb25zZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoc3R1ZGVudF9yZXNwb25zZSwgc2Nvcm0xMl9yZWdleC5DTUlGZWVkYmFjaywgdHJ1ZSkpIHtcbiAgICAgIHRoaXMuI3N0dWRlbnRfcmVzcG9uc2UgPSBzdHVkZW50X3Jlc3BvbnNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNyZXN1bHQuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgcmVzdWx0KCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNyZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcmVzdWx0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZXN1bHRcbiAgICovXG4gIHNldCByZXN1bHQocmVzdWx0KSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChyZXN1bHQsIHNjb3JtMTJfcmVnZXguQ01JUmVzdWx0KSkge1xuICAgICAgdGhpcy4jcmVzdWx0ID0gcmVzdWx0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsYXRlbmN5LiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IGxhdGVuY3koKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI2xhdGVuY3k7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGF0ZW5jeVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGF0ZW5jeVxuICAgKi9cbiAgc2V0IGxhdGVuY3kobGF0ZW5jeSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQobGF0ZW5jeSwgc2Nvcm0xMl9yZWdleC5DTUlUaW1lc3BhbikpIHtcbiAgICAgIHRoaXMuI2xhdGVuY3kgPSBsYXRlbmN5O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5pbnRlcmFjdGlvbnMublxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGlkOiBzdHJpbmcsXG4gICAqICAgICAgdGltZTogc3RyaW5nLFxuICAgKiAgICAgIHR5cGU6IHN0cmluZyxcbiAgICogICAgICB3ZWlnaHRpbmc6IHN0cmluZyxcbiAgICogICAgICBzdHVkZW50X3Jlc3BvbnNlOiBzdHJpbmcsXG4gICAqICAgICAgcmVzdWx0OiBzdHJpbmcsXG4gICAqICAgICAgbGF0ZW5jeTogc3RyaW5nLFxuICAgKiAgICAgIG9iamVjdGl2ZXM6IENNSUFycmF5LFxuICAgKiAgICAgIGNvcnJlY3RfcmVzcG9uc2VzOiBDTUlBcnJheVxuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnaWQnOiB0aGlzLmlkLFxuICAgICAgJ3RpbWUnOiB0aGlzLnRpbWUsXG4gICAgICAndHlwZSc6IHRoaXMudHlwZSxcbiAgICAgICd3ZWlnaHRpbmcnOiB0aGlzLndlaWdodGluZyxcbiAgICAgICdzdHVkZW50X3Jlc3BvbnNlJzogdGhpcy5zdHVkZW50X3Jlc3BvbnNlLFxuICAgICAgJ3Jlc3VsdCc6IHRoaXMucmVzdWx0LFxuICAgICAgJ2xhdGVuY3knOiB0aGlzLmxhdGVuY3ksXG4gICAgICAnb2JqZWN0aXZlcyc6IHRoaXMub2JqZWN0aXZlcyxcbiAgICAgICdjb3JyZWN0X3Jlc3BvbnNlcyc6IHRoaXMuY29ycmVjdF9yZXNwb25zZXMsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLm9iamVjdGl2ZXMubiBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSU9iamVjdGl2ZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkub2JqZWN0aXZlcy5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zY29yZSA9IG5ldyBDTUlTY29yZShcbiAgICAgICAge1xuICAgICAgICAgIHNjb3JlX2NoaWxkcmVuOiBzY29ybTEyX2NvbnN0YW50cy5zY29yZV9jaGlsZHJlbixcbiAgICAgICAgICBzY29yZV9yYW5nZTogc2Nvcm0xMl9yZWdleC5zY29yZV9yYW5nZSxcbiAgICAgICAgICBpbnZhbGlkRXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgICAgIGludmFsaWRUeXBlQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENILFxuICAgICAgICAgIGludmFsaWRSYW5nZUNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFLFxuICAgICAgICB9KTtcbiAgfVxuXG4gICNpZCA9ICcnO1xuICAjc3RhdHVzID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2lkXG4gICAqIEByZXR1cm4ge1wiXCJ9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChpZCwgc2Nvcm0xMl9yZWdleC5DTUlJZGVudGlmaWVyKSkge1xuICAgICAgdGhpcy4jaWQgPSBpZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3RhdHVzXG4gICAqIEByZXR1cm4ge1wiXCJ9XG4gICAqL1xuICBnZXQgc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNzdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0dXNcbiAgICovXG4gIHNldCBzdGF0dXMoc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChzdGF0dXMsIHNjb3JtMTJfcmVnZXguQ01JU3RhdHVzMikpIHtcbiAgICAgIHRoaXMuI3N0YXR1cyA9IHN0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkub2JqZWN0aXZlcy5uXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgaWQ6IHN0cmluZyxcbiAgICogICAgICBzdGF0dXM6IHN0cmluZyxcbiAgICogICAgICBzY29yZTogQ01JU2NvcmVcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICAgICdzdGF0dXMnOiB0aGlzLnN0YXR1cyxcbiAgICAgICdzY29yZSc6IHRoaXMuc2NvcmUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLmludGVyYWN0aW9ucy5uLm9iamVjdGl2ZXMubiBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc09iamVjdGl2ZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4ub2JqZWN0aXZlcy5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgI2lkID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2lkXG4gICAqIEByZXR1cm4ge1wiXCJ9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChpZCwgc2Nvcm0xMl9yZWdleC5DTUlJZGVudGlmaWVyKSkge1xuICAgICAgdGhpcy4jaWQgPSBpZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4ub2JqZWN0aXZlcy5uXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgaWQ6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnaWQnOiB0aGlzLmlkLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5pbnRlcmFjdGlvbnMuY29ycmVjdF9yZXNwb25zZXMubiBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc0NvcnJlY3RSZXNwb25zZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLmNvcnJlY3RfcmVzcG9uc2VzLm5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAjcGF0dGVybiA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNwYXR0ZXJuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBwYXR0ZXJuKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNwYXR0ZXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3BhdHRlcm5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdHRlcm5cbiAgICovXG4gIHNldCBwYXR0ZXJuKHBhdHRlcm4pIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHBhdHRlcm4sIHNjb3JtMTJfcmVnZXguQ01JRmVlZGJhY2ssIHRydWUpKSB7XG4gICAgICB0aGlzLiNwYXR0ZXJuID0gcGF0dGVybjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuaW50ZXJhY3Rpb25zLmNvcnJlY3RfcmVzcG9uc2VzLm5cbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBwYXR0ZXJuOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3BhdHRlcm4nOiB0aGlzLnBhdHRlcm4sXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgQUlDQyBOYXZpZ2F0aW9uIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgTkFWIGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgTkFWIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gICNldmVudCA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNldmVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZXZlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2V2ZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2V2ZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgKi9cbiAgc2V0IGV2ZW50KGV2ZW50KSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChldmVudCwgc2Nvcm0xMl9yZWdleC5OQVZFdmVudCkpIHtcbiAgICAgIHRoaXMuI2V2ZW50ID0gZXZlbnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgbmF2IG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGV2ZW50OiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2V2ZW50JzogdGhpcy5ldmVudCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCB7XG4gIEJhc2VDTUksXG4gIGNoZWNrVmFsaWRGb3JtYXQsXG4gIGNoZWNrVmFsaWRSYW5nZSxcbiAgQ01JQXJyYXksXG4gIENNSVNjb3JlLFxufSBmcm9tICcuL2NvbW1vbic7XG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCBSZWdleCBmcm9tICcuLi9jb25zdGFudHMvcmVnZXgnO1xuaW1wb3J0IEVycm9yQ29kZXMgZnJvbSAnLi4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJztcbmltcG9ydCBSZXNwb25zZXMgZnJvbSAnLi4vY29uc3RhbnRzL3Jlc3BvbnNlX2NvbnN0YW50cyc7XG5pbXBvcnQge1ZhbGlkYXRpb25FcnJvcn0gZnJvbSAnLi4vZXhjZXB0aW9ucyc7XG5pbXBvcnQgKiBhcyBVdGlsIGZyb20gJy4uL3V0aWxpdGllcyc7XG5cbmNvbnN0IHNjb3JtMjAwNF9jb25zdGFudHMgPSBBUElDb25zdGFudHMuc2Nvcm0yMDA0O1xuY29uc3Qgc2Nvcm0yMDA0X2Vycm9yX2NvZGVzID0gRXJyb3JDb2Rlcy5zY29ybTIwMDQ7XG5jb25zdCBsZWFybmVyX3Jlc3BvbnNlcyA9IFJlc3BvbnNlcy5sZWFybmVyO1xuXG5jb25zdCBzY29ybTIwMDRfcmVnZXggPSBSZWdleC5zY29ybTIwMDQ7XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgUmVhZCBPbmx5IGVycm9yXG4gKi9cbmZ1bmN0aW9uIHRocm93UmVhZE9ubHlFcnJvcigpIHtcbiAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQpO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QgZm9yIHRocm93aW5nIFdyaXRlIE9ubHkgZXJyb3JcbiAqL1xuZnVuY3Rpb24gdGhyb3dXcml0ZU9ubHlFcnJvcigpIHtcbiAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuV1JJVEVfT05MWV9FTEVNRU5UKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIGZvciB0aHJvd2luZyBUeXBlIE1pc21hdGNoIGVycm9yXG4gKi9cbmZ1bmN0aW9uIHRocm93VHlwZU1pc21hdGNoRXJyb3IoKSB7XG4gIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QsIG5vIHJlYXNvbiB0byBoYXZlIHRvIHBhc3MgdGhlIHNhbWUgZXJyb3IgY29kZXMgZXZlcnkgdGltZVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9IHJlZ2V4UGF0dGVyblxuICogQHBhcmFtIHtib29sZWFufSBhbGxvd0VtcHR5U3RyaW5nXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBjaGVjazIwMDRWYWxpZEZvcm1hdChcbiAgICB2YWx1ZTogU3RyaW5nLFxuICAgIHJlZ2V4UGF0dGVybjogU3RyaW5nLFxuICAgIGFsbG93RW1wdHlTdHJpbmc/OiBib29sZWFuKSB7XG4gIHJldHVybiBjaGVja1ZhbGlkRm9ybWF0KHZhbHVlLCByZWdleFBhdHRlcm4sXG4gICAgICBzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCwgYWxsb3dFbXB0eVN0cmluZyk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCwgbm8gcmVhc29uIHRvIGhhdmUgdG8gcGFzcyB0aGUgc2FtZSBlcnJvciBjb2RlcyBldmVyeSB0aW1lXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcmFuZ2VQYXR0ZXJuXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBjaGVjazIwMDRWYWxpZFJhbmdlKHZhbHVlOiBhbnksIHJhbmdlUGF0dGVybjogU3RyaW5nKSB7XG4gIHJldHVybiBjaGVja1ZhbGlkUmFuZ2UodmFsdWUsIHJhbmdlUGF0dGVybixcbiAgICAgIHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0UpO1xufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBjbWkgb2JqZWN0IGZvciBTQ09STSAyMDA0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUkgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciB0aGUgU0NPUk0gMjAwNCBjbWkgb2JqZWN0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5pdGlhbGl6ZWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKGluaXRpYWxpemVkOiBib29sZWFuKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubGVhcm5lcl9wcmVmZXJlbmNlID0gbmV3IENNSUxlYXJuZXJQcmVmZXJlbmNlKCk7XG4gICAgdGhpcy5zY29yZSA9IG5ldyBTY29ybTIwMDRDTUlTY29yZSgpO1xuICAgIHRoaXMuY29tbWVudHNfZnJvbV9sZWFybmVyID0gbmV3IENNSUNvbW1lbnRzRnJvbUxlYXJuZXIoKTtcbiAgICB0aGlzLmNvbW1lbnRzX2Zyb21fbG1zID0gbmV3IENNSUNvbW1lbnRzRnJvbUxNUygpO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zID0gbmV3IENNSUludGVyYWN0aW9ucygpO1xuICAgIHRoaXMub2JqZWN0aXZlcyA9IG5ldyBDTUlPYmplY3RpdmVzKCk7XG5cbiAgICBpZiAoaW5pdGlhbGl6ZWQpIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgI192ZXJzaW9uID0gJzEuMCc7XG4gICNfY2hpbGRyZW4gPSBzY29ybTIwMDRfY29uc3RhbnRzLmNtaV9jaGlsZHJlbjtcbiAgI2NvbXBsZXRpb25fc3RhdHVzID0gJ3Vua25vd24nO1xuICAjY29tcGxldGlvbl90aHJlc2hvbGQgPSAnJztcbiAgI2NyZWRpdCA9ICdjcmVkaXQnO1xuICAjZW50cnkgPSAnJztcbiAgI2V4aXQgPSAnJztcbiAgI2xhdW5jaF9kYXRhID0gJyc7XG4gICNsZWFybmVyX2lkID0gJyc7XG4gICNsZWFybmVyX25hbWUgPSAnJztcbiAgI2xvY2F0aW9uID0gJyc7XG4gICNtYXhfdGltZV9hbGxvd2VkID0gJyc7XG4gICNtb2RlID0gJ25vcm1hbCc7XG4gICNwcm9ncmVzc19tZWFzdXJlID0gJyc7XG4gICNzY2FsZWRfcGFzc2luZ19zY29yZSA9ICcnO1xuICAjc2Vzc2lvbl90aW1lID0gJ1BUMEgwTTBTJztcbiAgI3N1Y2Nlc3Nfc3RhdHVzID0gJ3Vua25vd24nO1xuICAjc3VzcGVuZF9kYXRhID0gJyc7XG4gICN0aW1lX2xpbWl0X2FjdGlvbiA9ICdjb250aW51ZSxubyBtZXNzYWdlJztcbiAgI3RvdGFsX3RpbWUgPSAnJztcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMubGVhcm5lcl9wcmVmZXJlbmNlPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zY29yZT8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuY29tbWVudHNfZnJvbV9sZWFybmVyPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5jb21tZW50c19mcm9tX2xtcz8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5vYmplY3RpdmVzPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX3ZlcnNpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IF92ZXJzaW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNfdmVyc2lvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfdmVyc2lvbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfdmVyc2lvblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF92ZXJzaW9uKF92ZXJzaW9uKSB7XG4gICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX2NoaWxkcmVuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge251bWJlcn0gX2NoaWxkcmVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NvbXBsZXRpb25fc3RhdHVzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb21wbGV0aW9uX3N0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jY29tcGxldGlvbl9zdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29tcGxldGlvbl9zdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbXBsZXRpb25fc3RhdHVzXG4gICAqL1xuICBzZXQgY29tcGxldGlvbl9zdGF0dXMoY29tcGxldGlvbl9zdGF0dXMpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoY29tcGxldGlvbl9zdGF0dXMsIHNjb3JtMjAwNF9yZWdleC5DTUlDU3RhdHVzKSkge1xuICAgICAgdGhpcy4jY29tcGxldGlvbl9zdGF0dXMgPSBjb21wbGV0aW9uX3N0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29tcGxldGlvbl90aHJlc2hvbGRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbXBsZXRpb25fdGhyZXNob2xkKCkge1xuICAgIHJldHVybiB0aGlzLiNjb21wbGV0aW9uX3RocmVzaG9sZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb21wbGV0aW9uX3RocmVzaG9sZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21wbGV0aW9uX3RocmVzaG9sZFxuICAgKi9cbiAgc2V0IGNvbXBsZXRpb25fdGhyZXNob2xkKGNvbXBsZXRpb25fdGhyZXNob2xkKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNjb21wbGV0aW9uX3RocmVzaG9sZCA9IGNvbXBsZXRpb25fdGhyZXNob2xkIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY3JlZGl0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjcmVkaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NyZWRpdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjcmVkaXQuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY3JlZGl0XG4gICAqL1xuICBzZXQgY3JlZGl0KGNyZWRpdCkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jY3JlZGl0ID0gY3JlZGl0IDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZW50cnlcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGVudHJ5KCkge1xuICAgIHJldHVybiB0aGlzLiNlbnRyeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNlbnRyeS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlbnRyeVxuICAgKi9cbiAgc2V0IGVudHJ5KGVudHJ5KSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNlbnRyeSA9IGVudHJ5IDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZXhpdC4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGV4aXQoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI2V4aXQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZXhpdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXhpdFxuICAgKi9cbiAgc2V0IGV4aXQoZXhpdCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChleGl0LCBzY29ybTIwMDRfcmVnZXguQ01JRXhpdCwgdHJ1ZSkpIHtcbiAgICAgIHRoaXMuI2V4aXQgPSBleGl0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsYXVuY2hfZGF0YVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGF1bmNoX2RhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xhdW5jaF9kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xhdW5jaF9kYXRhLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhdW5jaF9kYXRhXG4gICAqL1xuICBzZXQgbGF1bmNoX2RhdGEobGF1bmNoX2RhdGEpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI2xhdW5jaF9kYXRhID0gbGF1bmNoX2RhdGEgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsZWFybmVyX2lkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsZWFybmVyX2lkKCkge1xuICAgIHJldHVybiB0aGlzLiNsZWFybmVyX2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xlYXJuZXJfaWQuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGVhcm5lcl9pZFxuICAgKi9cbiAgc2V0IGxlYXJuZXJfaWQobGVhcm5lcl9pZCkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jbGVhcm5lcl9pZCA9IGxlYXJuZXJfaWQgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsZWFybmVyX25hbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlYXJuZXJfbmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGVhcm5lcl9uYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xlYXJuZXJfbmFtZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZWFybmVyX25hbWVcbiAgICovXG4gIHNldCBsZWFybmVyX25hbWUobGVhcm5lcl9uYW1lKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNsZWFybmVyX25hbWUgPSBsZWFybmVyX25hbWUgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsb2NhdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xvY2F0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xvY2F0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvblxuICAgKi9cbiAgc2V0IGxvY2F0aW9uKGxvY2F0aW9uKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGxvY2F0aW9uLCBzY29ybTIwMDRfcmVnZXguQ01JU3RyaW5nMTAwMCkpIHtcbiAgICAgIHRoaXMuI2xvY2F0aW9uID0gbG9jYXRpb247XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI21heF90aW1lX2FsbG93ZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1heF90aW1lX2FsbG93ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI21heF90aW1lX2FsbG93ZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbWF4X3RpbWVfYWxsb3dlZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYXhfdGltZV9hbGxvd2VkXG4gICAqL1xuICBzZXQgbWF4X3RpbWVfYWxsb3dlZChtYXhfdGltZV9hbGxvd2VkKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNtYXhfdGltZV9hbGxvd2VkID0gbWF4X3RpbWVfYWxsb3dlZCA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI21vZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI21vZGU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbW9kZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtb2RlXG4gICAqL1xuICBzZXQgbW9kZShtb2RlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNtb2RlID0gbW9kZSA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3Byb2dyZXNzX21lYXN1cmVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHByb2dyZXNzX21lYXN1cmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3Byb2dyZXNzX21lYXN1cmU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcHJvZ3Jlc3NfbWVhc3VyZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvZ3Jlc3NfbWVhc3VyZVxuICAgKi9cbiAgc2V0IHByb2dyZXNzX21lYXN1cmUocHJvZ3Jlc3NfbWVhc3VyZSkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChwcm9ncmVzc19tZWFzdXJlLCBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCkgJiZcbiAgICAgICAgY2hlY2syMDA0VmFsaWRSYW5nZShwcm9ncmVzc19tZWFzdXJlLCBzY29ybTIwMDRfcmVnZXgucHJvZ3Jlc3NfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiNwcm9ncmVzc19tZWFzdXJlID0gcHJvZ3Jlc3NfbWVhc3VyZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc2NhbGVkX3Bhc3Npbmdfc2NvcmVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHNjYWxlZF9wYXNzaW5nX3Njb3JlKCkge1xuICAgIHJldHVybiB0aGlzLiNzY2FsZWRfcGFzc2luZ19zY29yZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzY2FsZWRfcGFzc2luZ19zY29yZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY2FsZWRfcGFzc2luZ19zY29yZVxuICAgKi9cbiAgc2V0IHNjYWxlZF9wYXNzaW5nX3Njb3JlKHNjYWxlZF9wYXNzaW5nX3Njb3JlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNzY2FsZWRfcGFzc2luZ19zY29yZSA9IHNjYWxlZF9wYXNzaW5nX3Njb3JlIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc2Vzc2lvbl90aW1lLiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc2Vzc2lvbl90aW1lKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNzZXNzaW9uX3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc2Vzc2lvbl90aW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZXNzaW9uX3RpbWVcbiAgICovXG4gIHNldCBzZXNzaW9uX3RpbWUoc2Vzc2lvbl90aW1lKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHNlc3Npb25fdGltZSwgc2Nvcm0yMDA0X3JlZ2V4LkNNSVRpbWVzcGFuKSkge1xuICAgICAgdGhpcy4jc2Vzc2lvbl90aW1lID0gc2Vzc2lvbl90aW1lO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdWNjZXNzX3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3VjY2Vzc19zdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N1Y2Nlc3Nfc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N1Y2Nlc3Nfc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdWNjZXNzX3N0YXR1c1xuICAgKi9cbiAgc2V0IHN1Y2Nlc3Nfc3RhdHVzKHN1Y2Nlc3Nfc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHN1Y2Nlc3Nfc3RhdHVzLCBzY29ybTIwMDRfcmVnZXguQ01JU1N0YXR1cykpIHtcbiAgICAgIHRoaXMuI3N1Y2Nlc3Nfc3RhdHVzID0gc3VjY2Vzc19zdGF0dXM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N1c3BlbmRfZGF0YVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3VzcGVuZF9kYXRhKCkge1xuICAgIHJldHVybiB0aGlzLiNzdXNwZW5kX2RhdGE7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3VzcGVuZF9kYXRhXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdXNwZW5kX2RhdGFcbiAgICovXG4gIHNldCBzdXNwZW5kX2RhdGEoc3VzcGVuZF9kYXRhKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHN1c3BlbmRfZGF0YSwgc2Nvcm0yMDA0X3JlZ2V4LkNNSVN0cmluZzY0MDAwLFxuICAgICAgICB0cnVlKSkge1xuICAgICAgdGhpcy4jc3VzcGVuZF9kYXRhID0gc3VzcGVuZF9kYXRhO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0aW1lX2xpbWl0X2FjdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGltZV9saW1pdF9hY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWVfbGltaXRfYWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpbWVfbGltaXRfYWN0aW9uLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVfbGltaXRfYWN0aW9uXG4gICAqL1xuICBzZXQgdGltZV9saW1pdF9hY3Rpb24odGltZV9saW1pdF9hY3Rpb24pIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI3RpbWVfbGltaXRfYWN0aW9uID0gdGltZV9saW1pdF9hY3Rpb24gOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0b3RhbF90aW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0b3RhbF90aW1lKCkge1xuICAgIHJldHVybiB0aGlzLiN0b3RhbF90aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RvdGFsX3RpbWUuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG90YWxfdGltZVxuICAgKi9cbiAgc2V0IHRvdGFsX3RpbWUodG90YWxfdGltZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jdG90YWxfdGltZSA9IHRvdGFsX3RpbWUgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHRoZSBjdXJyZW50IHNlc3Npb24gdGltZSB0byB0aGUgZXhpc3RpbmcgdG90YWwgdGltZS5cbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSBJU084NjAxIER1cmF0aW9uXG4gICAqL1xuICBnZXRDdXJyZW50VG90YWxUaW1lKCkge1xuICAgIGxldCBzZXNzaW9uVGltZSA9IHRoaXMuI3Nlc3Npb25fdGltZTtcbiAgICBjb25zdCBzdGFydFRpbWUgPSB0aGlzLnN0YXJ0X3RpbWU7XG5cbiAgICBpZiAodHlwZW9mIHN0YXJ0VGltZSAhPT0gJ3VuZGVmaW5lZCcgfHwgc3RhcnRUaW1lID09PSBudWxsKSB7XG4gICAgICBjb25zdCBzZWNvbmRzID0gbmV3IERhdGUoKS5nZXRUaW1lKCkgLSBzdGFydFRpbWU7XG4gICAgICBzZXNzaW9uVGltZSA9IFV0aWwuZ2V0U2Vjb25kc0FzSVNPRHVyYXRpb24oc2Vjb25kcyAvIDEwMDApO1xuICAgIH1cblxuICAgIHJldHVybiBVdGlsLmFkZFR3b0R1cmF0aW9ucyhcbiAgICAgICAgdGhpcy4jdG90YWxfdGltZSxcbiAgICAgICAgc2Vzc2lvblRpbWUsXG4gICAgICAgIHNjb3JtMjAwNF9yZWdleC5DTUlUaW1lc3BhbixcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgY29tbWVudHNfZnJvbV9sZWFybmVyOiBDTUlDb21tZW50c0Zyb21MZWFybmVyLFxuICAgKiAgICAgIGNvbW1lbnRzX2Zyb21fbG1zOiBDTUlDb21tZW50c0Zyb21MTVMsXG4gICAqICAgICAgY29tcGxldGlvbl9zdGF0dXM6IHN0cmluZyxcbiAgICogICAgICBjb21wbGV0aW9uX3RocmVzaG9sZDogc3RyaW5nLFxuICAgKiAgICAgIGNyZWRpdDogc3RyaW5nLFxuICAgKiAgICAgIGVudHJ5OiBzdHJpbmcsXG4gICAqICAgICAgZXhpdDogc3RyaW5nLFxuICAgKiAgICAgIGludGVyYWN0aW9uczogQ01JSW50ZXJhY3Rpb25zLFxuICAgKiAgICAgIGxhdW5jaF9kYXRhOiBzdHJpbmcsXG4gICAqICAgICAgbGVhcm5lcl9pZDogc3RyaW5nLFxuICAgKiAgICAgIGxlYXJuZXJfbmFtZTogc3RyaW5nLFxuICAgKiAgICAgIGxlYXJuZXJfcHJlZmVyZW5jZTogQ01JTGVhcm5lclByZWZlcmVuY2UsXG4gICAqICAgICAgbG9jYXRpb246IHN0cmluZyxcbiAgICogICAgICBtYXhfdGltZV9hbGxvd2VkOiBzdHJpbmcsXG4gICAqICAgICAgbW9kZTogc3RyaW5nLFxuICAgKiAgICAgIG9iamVjdGl2ZXM6IENNSU9iamVjdGl2ZXMsXG4gICAqICAgICAgcHJvZ3Jlc3NfbWVhc3VyZTogc3RyaW5nLFxuICAgKiAgICAgIHNjYWxlZF9wYXNzaW5nX3Njb3JlOiBzdHJpbmcsXG4gICAqICAgICAgc2NvcmU6IFNjb3JtMjAwNENNSVNjb3JlLFxuICAgKiAgICAgIHNlc3Npb25fdGltZTogc3RyaW5nLFxuICAgKiAgICAgIHN1Y2Nlc3Nfc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgc3VzcGVuZF9kYXRhOiBzdHJpbmcsXG4gICAqICAgICAgdGltZV9saW1pdF9hY3Rpb246IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnY29tbWVudHNfZnJvbV9sZWFybmVyJzogdGhpcy5jb21tZW50c19mcm9tX2xlYXJuZXIsXG4gICAgICAnY29tbWVudHNfZnJvbV9sbXMnOiB0aGlzLmNvbW1lbnRzX2Zyb21fbG1zLFxuICAgICAgJ2NvbXBsZXRpb25fc3RhdHVzJzogdGhpcy5jb21wbGV0aW9uX3N0YXR1cyxcbiAgICAgICdjb21wbGV0aW9uX3RocmVzaG9sZCc6IHRoaXMuY29tcGxldGlvbl90aHJlc2hvbGQsXG4gICAgICAnY3JlZGl0JzogdGhpcy5jcmVkaXQsXG4gICAgICAnZW50cnknOiB0aGlzLmVudHJ5LFxuICAgICAgJ2V4aXQnOiB0aGlzLmV4aXQsXG4gICAgICAnaW50ZXJhY3Rpb25zJzogdGhpcy5pbnRlcmFjdGlvbnMsXG4gICAgICAnbGF1bmNoX2RhdGEnOiB0aGlzLmxhdW5jaF9kYXRhLFxuICAgICAgJ2xlYXJuZXJfaWQnOiB0aGlzLmxlYXJuZXJfaWQsXG4gICAgICAnbGVhcm5lcl9uYW1lJzogdGhpcy5sZWFybmVyX25hbWUsXG4gICAgICAnbGVhcm5lcl9wcmVmZXJlbmNlJzogdGhpcy5sZWFybmVyX3ByZWZlcmVuY2UsXG4gICAgICAnbG9jYXRpb24nOiB0aGlzLmxvY2F0aW9uLFxuICAgICAgJ21heF90aW1lX2FsbG93ZWQnOiB0aGlzLm1heF90aW1lX2FsbG93ZWQsXG4gICAgICAnbW9kZSc6IHRoaXMubW9kZSxcbiAgICAgICdvYmplY3RpdmVzJzogdGhpcy5vYmplY3RpdmVzLFxuICAgICAgJ3Byb2dyZXNzX21lYXN1cmUnOiB0aGlzLnByb2dyZXNzX21lYXN1cmUsXG4gICAgICAnc2NhbGVkX3Bhc3Npbmdfc2NvcmUnOiB0aGlzLnNjYWxlZF9wYXNzaW5nX3Njb3JlLFxuICAgICAgJ3Njb3JlJzogdGhpcy5zY29yZSxcbiAgICAgICdzZXNzaW9uX3RpbWUnOiB0aGlzLnNlc3Npb25fdGltZSxcbiAgICAgICdzdWNjZXNzX3N0YXR1cyc6IHRoaXMuc3VjY2Vzc19zdGF0dXMsXG4gICAgICAnc3VzcGVuZF9kYXRhJzogdGhpcy5zdXNwZW5kX2RhdGEsXG4gICAgICAndGltZV9saW1pdF9hY3Rpb24nOiB0aGlzLnRpbWVfbGltaXRfYWN0aW9uLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIFNDT1JNIDIwMDQncyBjbWkubGVhcm5lcl9wcmVmZXJlbmNlIG9iamVjdFxuICovXG5jbGFzcyBDTUlMZWFybmVyUHJlZmVyZW5jZSBleHRlbmRzIEJhc2VDTUkge1xuICAjX2NoaWxkcmVuID0gc2Nvcm0yMDA0X2NvbnN0YW50cy5zdHVkZW50X3ByZWZlcmVuY2VfY2hpbGRyZW47XG4gICNhdWRpb19sZXZlbCA9ICcxJztcbiAgI2xhbmd1YWdlID0gJyc7XG4gICNkZWxpdmVyeV9zcGVlZCA9ICcxJztcbiAgI2F1ZGlvX2NhcHRpb25pbmcgPSAnMCc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkubGVhcm5lcl9wcmVmZXJlbmNlXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI19jaGlsZHJlblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNhdWRpb19sZXZlbFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgYXVkaW9fbGV2ZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2F1ZGlvX2xldmVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2F1ZGlvX2xldmVsXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdWRpb19sZXZlbFxuICAgKi9cbiAgc2V0IGF1ZGlvX2xldmVsKGF1ZGlvX2xldmVsKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGF1ZGlvX2xldmVsLCBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCkgJiZcbiAgICAgICAgY2hlY2syMDA0VmFsaWRSYW5nZShhdWRpb19sZXZlbCwgc2Nvcm0yMDA0X3JlZ2V4LmF1ZGlvX3JhbmdlKSkge1xuICAgICAgdGhpcy4jYXVkaW9fbGV2ZWwgPSBhdWRpb19sZXZlbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGFuZ3VhZ2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxhbmd1YWdlKCkge1xuICAgIHJldHVybiB0aGlzLiNsYW5ndWFnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsYW5ndWFnZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGFuZ3VhZ2VcbiAgICovXG4gIHNldCBsYW5ndWFnZShsYW5ndWFnZSkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChsYW5ndWFnZSwgc2Nvcm0yMDA0X3JlZ2V4LkNNSUxhbmcpKSB7XG4gICAgICB0aGlzLiNsYW5ndWFnZSA9IGxhbmd1YWdlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNkZWxpdmVyeV9zcGVlZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZGVsaXZlcnlfc3BlZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2RlbGl2ZXJ5X3NwZWVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2RlbGl2ZXJ5X3NwZWVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkZWxpdmVyeV9zcGVlZFxuICAgKi9cbiAgc2V0IGRlbGl2ZXJ5X3NwZWVkKGRlbGl2ZXJ5X3NwZWVkKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGRlbGl2ZXJ5X3NwZWVkLCBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCkgJiZcbiAgICAgICAgY2hlY2syMDA0VmFsaWRSYW5nZShkZWxpdmVyeV9zcGVlZCwgc2Nvcm0yMDA0X3JlZ2V4LnNwZWVkX3JhbmdlKSkge1xuICAgICAgdGhpcy4jZGVsaXZlcnlfc3BlZWQgPSBkZWxpdmVyeV9zcGVlZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjYXVkaW9fY2FwdGlvbmluZ1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgYXVkaW9fY2FwdGlvbmluZygpIHtcbiAgICByZXR1cm4gdGhpcy4jYXVkaW9fY2FwdGlvbmluZztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNhdWRpb19jYXB0aW9uaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdWRpb19jYXB0aW9uaW5nXG4gICAqL1xuICBzZXQgYXVkaW9fY2FwdGlvbmluZyhhdWRpb19jYXB0aW9uaW5nKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGF1ZGlvX2NhcHRpb25pbmcsIHNjb3JtMjAwNF9yZWdleC5DTUlTSW50ZWdlcikgJiZcbiAgICAgICAgY2hlY2syMDA0VmFsaWRSYW5nZShhdWRpb19jYXB0aW9uaW5nLCBzY29ybTIwMDRfcmVnZXgudGV4dF9yYW5nZSkpIHtcbiAgICAgIHRoaXMuI2F1ZGlvX2NhcHRpb25pbmcgPSBhdWRpb19jYXB0aW9uaW5nO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5sZWFybmVyX3ByZWZlcmVuY2VcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBhdWRpb19sZXZlbDogc3RyaW5nLFxuICAgKiAgICAgIGxhbmd1YWdlOiBzdHJpbmcsXG4gICAqICAgICAgZGVsaXZlcnlfc3BlZWQ6IHN0cmluZyxcbiAgICogICAgICBhdWRpb19jYXB0aW9uaW5nOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2F1ZGlvX2xldmVsJzogdGhpcy5hdWRpb19sZXZlbCxcbiAgICAgICdsYW5ndWFnZSc6IHRoaXMubGFuZ3VhZ2UsXG4gICAgICAnZGVsaXZlcnlfc3BlZWQnOiB0aGlzLmRlbGl2ZXJ5X3NwZWVkLFxuICAgICAgJ2F1ZGlvX2NhcHRpb25pbmcnOiB0aGlzLmF1ZGlvX2NhcHRpb25pbmcsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGNtaS5pbnRlcmFjdGlvbnMgb2JqZWN0XG4gKi9cbmNsYXNzIENNSUludGVyYWN0aW9ucyBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkub2JqZWN0aXZlcyBBcnJheVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe1xuICAgICAgY2hpbGRyZW46IHNjb3JtMjAwNF9jb25zdGFudHMuaW50ZXJhY3Rpb25zX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGNtaS5vYmplY3RpdmVzIG9iamVjdFxuICovXG5jbGFzcyBDTUlPYmplY3RpdmVzIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5vYmplY3RpdmVzIEFycmF5XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogc2Nvcm0yMDA0X2NvbnN0YW50cy5vYmplY3RpdmVzX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGNtaS5jb21tZW50c19mcm9tX2xtcyBvYmplY3RcbiAqL1xuY2xhc3MgQ01JQ29tbWVudHNGcm9tTE1TIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5jb21tZW50c19mcm9tX2xtcyBBcnJheVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe1xuICAgICAgY2hpbGRyZW46IHNjb3JtMjAwNF9jb25zdGFudHMuY29tbWVudHNfY2hpbGRyZW4sXG4gICAgICBlcnJvckNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmNvbW1lbnRzX2Zyb21fbGVhcm5lciBvYmplY3RcbiAqL1xuY2xhc3MgQ01JQ29tbWVudHNGcm9tTGVhcm5lciBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuY29tbWVudHNfZnJvbV9sZWFybmVyIEFycmF5XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogc2Nvcm0yMDA0X2NvbnN0YW50cy5jb21tZW50c19jaGlsZHJlbixcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5ULFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIFNDT1JNIDIwMDQncyBjbWkuaW50ZXJhY3Rpb24ubiBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAjaWQgPSAnJztcbiAgI3R5cGUgPSAnJztcbiAgI3RpbWVzdGFtcCA9ICcnO1xuICAjd2VpZ2h0aW5nID0gJyc7XG4gICNsZWFybmVyX3Jlc3BvbnNlID0gJyc7XG4gICNyZXN1bHQgPSAnJztcbiAgI2xhdGVuY3kgPSAnJztcbiAgI2Rlc2NyaXB0aW9uID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb24ublxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMub2JqZWN0aXZlcyA9IG5ldyBDTUlBcnJheSh7XG4gICAgICBlcnJvckNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCxcbiAgICAgIGNoaWxkcmVuOiBzY29ybTIwMDRfY29uc3RhbnRzLm9iamVjdGl2ZXNfY2hpbGRyZW4sXG4gICAgfSk7XG4gICAgdGhpcy5jb3JyZWN0X3Jlc3BvbnNlcyA9IG5ldyBDTUlBcnJheSh7XG4gICAgICBlcnJvckNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCxcbiAgICAgIGNoaWxkcmVuOiBzY29ybTIwMDRfY29uc3RhbnRzLmNvcnJlY3RfcmVzcG9uc2VzX2NoaWxkcmVuLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLm9iamVjdGl2ZXM/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmNvcnJlY3RfcmVzcG9uc2VzPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLiNpZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNpZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICovXG4gIHNldCBpZChpZCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChpZCwgc2Nvcm0yMDA0X3JlZ2V4LkNNSUxvbmdJZGVudGlmaWVyKSkge1xuICAgICAgdGhpcy4jaWQgPSBpZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdHlwZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jdHlwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0eXBlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gICAqL1xuICBzZXQgdHlwZSh0eXBlKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHR5cGUsIHNjb3JtMjAwNF9yZWdleC5DTUlUeXBlKSkge1xuICAgICAgdGhpcy4jdHlwZSA9IHR5cGU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWVzdGFtcFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGltZXN0YW1wKCkge1xuICAgIHJldHVybiB0aGlzLiN0aW1lc3RhbXA7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGltZXN0YW1wXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lc3RhbXBcbiAgICovXG4gIHNldCB0aW1lc3RhbXAodGltZXN0YW1wKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHRpbWVzdGFtcCwgc2Nvcm0yMDA0X3JlZ2V4LkNNSVRpbWUpKSB7XG4gICAgICB0aGlzLiN0aW1lc3RhbXAgPSB0aW1lc3RhbXA7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3dlaWdodGluZ1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgd2VpZ2h0aW5nKCkge1xuICAgIHJldHVybiB0aGlzLiN3ZWlnaHRpbmc7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjd2VpZ2h0aW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3ZWlnaHRpbmdcbiAgICovXG4gIHNldCB3ZWlnaHRpbmcod2VpZ2h0aW5nKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHdlaWdodGluZywgc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwpKSB7XG4gICAgICB0aGlzLiN3ZWlnaHRpbmcgPSB3ZWlnaHRpbmc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xlYXJuZXJfcmVzcG9uc2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlYXJuZXJfcmVzcG9uc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xlYXJuZXJfcmVzcG9uc2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGVhcm5lcl9yZXNwb25zZS4gRG9lcyB0eXBlIHZhbGlkYXRpb24gdG8gbWFrZSBzdXJlIHJlc3BvbnNlXG4gICAqIG1hdGNoZXMgU0NPUk0gMjAwNCdzIHNwZWNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlYXJuZXJfcmVzcG9uc2VcbiAgICovXG4gIHNldCBsZWFybmVyX3Jlc3BvbnNlKGxlYXJuZXJfcmVzcG9uc2UpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMudHlwZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoXG4gICAgICAgICAgc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkRFUEVOREVOQ1lfTk9UX0VTVEFCTElTSEVEKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG5vZGVzID0gW107XG4gICAgICBjb25zdCByZXNwb25zZV90eXBlID0gbGVhcm5lcl9yZXNwb25zZXNbdGhpcy50eXBlXTtcbiAgICAgIGlmIChyZXNwb25zZV90eXBlKSB7XG4gICAgICAgIGlmIChyZXNwb25zZV90eXBlPy5kZWxpbWl0ZXIpIHtcbiAgICAgICAgICBub2RlcyA9IGxlYXJuZXJfcmVzcG9uc2Uuc3BsaXQocmVzcG9uc2VfdHlwZS5kZWxpbWl0ZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5vZGVzWzBdID0gbGVhcm5lcl9yZXNwb25zZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICgobm9kZXMubGVuZ3RoID4gMCkgJiYgKG5vZGVzLmxlbmd0aCA8PSByZXNwb25zZV90eXBlLm1heCkpIHtcbiAgICAgICAgICBjb25zdCBmb3JtYXRSZWdleCA9IG5ldyBSZWdFeHAocmVzcG9uc2VfdHlwZS5mb3JtYXQpO1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZV90eXBlPy5kZWxpbWl0ZXIyKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IG5vZGVzW2ldLnNwbGl0KHJlc3BvbnNlX3R5cGUuZGVsaW1pdGVyMik7XG4gICAgICAgICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF2YWx1ZXNbMF0ubWF0Y2goZm9ybWF0UmVnZXgpKSB7XG4gICAgICAgICAgICAgICAgICB0aHJvd1R5cGVNaXNtYXRjaEVycm9yKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGlmICghdmFsdWVzWzFdLm1hdGNoKG5ldyBSZWdFeHAocmVzcG9uc2VfdHlwZS5mb3JtYXQyKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3dUeXBlTWlzbWF0Y2hFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvd1R5cGVNaXNtYXRjaEVycm9yKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmICghbm9kZXNbaV0ubWF0Y2goZm9ybWF0UmVnZXgpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3dUeXBlTWlzbWF0Y2hFcnJvcigpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChub2Rlc1tpXSAhPT0gJycgJiYgcmVzcG9uc2VfdHlwZS51bmlxdWUpIHtcbiAgICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2Rlc1tpXSA9PT0gbm9kZXNbal0pIHtcbiAgICAgICAgICAgICAgICAgICAgICB0aHJvd1R5cGVNaXNtYXRjaEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuR0VORVJBTF9TRVRfRkFJTFVSRSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNyZXN1bHRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHJlc3VsdCgpIHtcbiAgICByZXR1cm4gdGhpcy4jcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3Jlc3VsdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVzdWx0XG4gICAqL1xuICBzZXQgcmVzdWx0KHJlc3VsdCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChyZXN1bHQsIHNjb3JtMjAwNF9yZWdleC5DTUlSZXN1bHQpKSB7XG4gICAgICB0aGlzLiNyZXN1bHQgPSByZXN1bHQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xhdGVuY3lcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxhdGVuY3koKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xhdGVuY3k7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGF0ZW5jeVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGF0ZW5jeVxuICAgKi9cbiAgc2V0IGxhdGVuY3kobGF0ZW5jeSkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChsYXRlbmN5LCBzY29ybTIwMDRfcmVnZXguQ01JVGltZXNwYW4pKSB7XG4gICAgICB0aGlzLiNsYXRlbmN5ID0gbGF0ZW5jeTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZGVzY3JpcHRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGRlc2NyaXB0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNkZXNjcmlwdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNkZXNjcmlwdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGVzY3JpcHRpb25cbiAgICovXG4gIHNldCBkZXNjcmlwdGlvbihkZXNjcmlwdGlvbikge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChkZXNjcmlwdGlvbiwgc2Nvcm0yMDA0X3JlZ2V4LkNNSUxhbmdTdHJpbmcyNTAsXG4gICAgICAgIHRydWUpKSB7XG4gICAgICB0aGlzLiNkZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5pbnRlcmFjdGlvbnMublxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGlkOiBzdHJpbmcsXG4gICAqICAgICAgdHlwZTogc3RyaW5nLFxuICAgKiAgICAgIG9iamVjdGl2ZXM6IENNSUFycmF5LFxuICAgKiAgICAgIHRpbWVzdGFtcDogc3RyaW5nLFxuICAgKiAgICAgIGNvcnJlY3RfcmVzcG9uc2VzOiBDTUlBcnJheSxcbiAgICogICAgICB3ZWlnaHRpbmc6IHN0cmluZyxcbiAgICogICAgICBsZWFybmVyX3Jlc3BvbnNlOiBzdHJpbmcsXG4gICAqICAgICAgcmVzdWx0OiBzdHJpbmcsXG4gICAqICAgICAgbGF0ZW5jeTogc3RyaW5nLFxuICAgKiAgICAgIGRlc2NyaXB0aW9uOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICAgICd0eXBlJzogdGhpcy50eXBlLFxuICAgICAgJ29iamVjdGl2ZXMnOiB0aGlzLm9iamVjdGl2ZXMsXG4gICAgICAndGltZXN0YW1wJzogdGhpcy50aW1lc3RhbXAsXG4gICAgICAnd2VpZ2h0aW5nJzogdGhpcy53ZWlnaHRpbmcsXG4gICAgICAnbGVhcm5lcl9yZXNwb25zZSc6IHRoaXMubGVhcm5lcl9yZXNwb25zZSxcbiAgICAgICdyZXN1bHQnOiB0aGlzLnJlc3VsdCxcbiAgICAgICdsYXRlbmN5JzogdGhpcy5sYXRlbmN5LFxuICAgICAgJ2Rlc2NyaXB0aW9uJzogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgICdjb3JyZWN0X3Jlc3BvbnNlcyc6IHRoaXMuY29ycmVjdF9yZXNwb25zZXMsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgU0NPUk0gMjAwNCdzIGNtaS5vYmplY3RpdmVzLm4gb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlPYmplY3RpdmVzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNpZCA9ICcnO1xuICAjc3VjY2Vzc19zdGF0dXMgPSAndW5rbm93bic7XG4gICNjb21wbGV0aW9uX3N0YXR1cyA9ICd1bmtub3duJztcbiAgI3Byb2dyZXNzX21lYXN1cmUgPSAnJztcbiAgI2Rlc2NyaXB0aW9uID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkub2JqZWN0aXZlcy5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zY29yZSA9IG5ldyBTY29ybTIwMDRDTUlTY29yZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnNjb3JlPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLiNpZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNpZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICovXG4gIHNldCBpZChpZCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChpZCwgc2Nvcm0yMDA0X3JlZ2V4LkNNSUxvbmdJZGVudGlmaWVyKSkge1xuICAgICAgdGhpcy4jaWQgPSBpZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3VjY2Vzc19zdGF0dXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN1Y2Nlc3Nfc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNzdWNjZXNzX3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdWNjZXNzX3N0YXR1c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gc3VjY2Vzc19zdGF0dXNcbiAgICovXG4gIHNldCBzdWNjZXNzX3N0YXR1cyhzdWNjZXNzX3N0YXR1cykge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChzdWNjZXNzX3N0YXR1cywgc2Nvcm0yMDA0X3JlZ2V4LkNNSVNTdGF0dXMpKSB7XG4gICAgICB0aGlzLiNzdWNjZXNzX3N0YXR1cyA9IHN1Y2Nlc3Nfc3RhdHVzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb21wbGV0aW9uX3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29tcGxldGlvbl9zdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbXBsZXRpb25fc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbXBsZXRpb25fc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21wbGV0aW9uX3N0YXR1c1xuICAgKi9cbiAgc2V0IGNvbXBsZXRpb25fc3RhdHVzKGNvbXBsZXRpb25fc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGNvbXBsZXRpb25fc3RhdHVzLCBzY29ybTIwMDRfcmVnZXguQ01JQ1N0YXR1cykpIHtcbiAgICAgIHRoaXMuI2NvbXBsZXRpb25fc3RhdHVzID0gY29tcGxldGlvbl9zdGF0dXM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3Byb2dyZXNzX21lYXN1cmVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHByb2dyZXNzX21lYXN1cmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3Byb2dyZXNzX21lYXN1cmU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcHJvZ3Jlc3NfbWVhc3VyZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvZ3Jlc3NfbWVhc3VyZVxuICAgKi9cbiAgc2V0IHByb2dyZXNzX21lYXN1cmUocHJvZ3Jlc3NfbWVhc3VyZSkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChwcm9ncmVzc19tZWFzdXJlLCBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCkgJiZcbiAgICAgICAgY2hlY2syMDA0VmFsaWRSYW5nZShwcm9ncmVzc19tZWFzdXJlLCBzY29ybTIwMDRfcmVnZXgucHJvZ3Jlc3NfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiNwcm9ncmVzc19tZWFzdXJlID0gcHJvZ3Jlc3NfbWVhc3VyZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZGVzY3JpcHRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGRlc2NyaXB0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNkZXNjcmlwdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNkZXNjcmlwdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGVzY3JpcHRpb25cbiAgICovXG4gIHNldCBkZXNjcmlwdGlvbihkZXNjcmlwdGlvbikge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChkZXNjcmlwdGlvbiwgc2Nvcm0yMDA0X3JlZ2V4LkNNSUxhbmdTdHJpbmcyNTAsXG4gICAgICAgIHRydWUpKSB7XG4gICAgICB0aGlzLiNkZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5vYmplY3RpdmVzLm5cbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBpZDogc3RyaW5nLFxuICAgKiAgICAgIHN1Y2Nlc3Nfc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgY29tcGxldGlvbl9zdGF0dXM6IHN0cmluZyxcbiAgICogICAgICBwcm9ncmVzc19tZWFzdXJlOiBzdHJpbmcsXG4gICAqICAgICAgZGVzY3JpcHRpb246IHN0cmluZyxcbiAgICogICAgICBzY29yZTogU2Nvcm0yMDA0Q01JU2NvcmVcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICAgICdzdWNjZXNzX3N0YXR1cyc6IHRoaXMuc3VjY2Vzc19zdGF0dXMsXG4gICAgICAnY29tcGxldGlvbl9zdGF0dXMnOiB0aGlzLmNvbXBsZXRpb25fc3RhdHVzLFxuICAgICAgJ3Byb2dyZXNzX21lYXN1cmUnOiB0aGlzLnByb2dyZXNzX21lYXN1cmUsXG4gICAgICAnZGVzY3JpcHRpb24nOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgJ3Njb3JlJzogdGhpcy5zY29yZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBTQ09STSAyMDA0J3MgY21pICouc2NvcmUgb2JqZWN0XG4gKi9cbmNsYXNzIFNjb3JtMjAwNENNSVNjb3JlIGV4dGVuZHMgQ01JU2NvcmUge1xuICAjc2NhbGVkID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkgKi5zY29yZVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoXG4gICAgICAgIHtcbiAgICAgICAgICBzY29yZV9jaGlsZHJlbjogc2Nvcm0yMDA0X2NvbnN0YW50cy5zY29yZV9jaGlsZHJlbixcbiAgICAgICAgICBtYXg6ICcnLFxuICAgICAgICAgIGludmFsaWRFcnJvckNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCxcbiAgICAgICAgICBpbnZhbGlkVHlwZUNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENILFxuICAgICAgICAgIGludmFsaWRSYW5nZUNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0UsXG4gICAgICAgICAgZGVjaW1hbFJlZ2V4OiBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCxcbiAgICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc2NhbGVkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzY2FsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3NjYWxlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzY2FsZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjYWxlZFxuICAgKi9cbiAgc2V0IHNjYWxlZChzY2FsZWQpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoc2NhbGVkLCBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCkgJiZcbiAgICAgICAgY2hlY2syMDA0VmFsaWRSYW5nZShzY2FsZWQsIHNjb3JtMjAwNF9yZWdleC5zY2FsZWRfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiNzY2FsZWQgPSBzY2FsZWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pICouc2NvcmVcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBzY2FsZWQ6IHN0cmluZyxcbiAgICogICAgICByYXc6IHN0cmluZyxcbiAgICogICAgICBtaW46IHN0cmluZyxcbiAgICogICAgICBtYXg6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnc2NhbGVkJzogdGhpcy5zY2FsZWQsXG4gICAgICAncmF3Jzogc3VwZXIucmF3LFxuICAgICAgJ21pbic6IHN1cGVyLm1pbixcbiAgICAgICdtYXgnOiBzdXBlci5tYXgsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGNtaS5jb21tZW50c19mcm9tX2xlYXJuZXIubiBhbmQgY21pLmNvbW1lbnRzX2Zyb21fbG1zLm4gb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlDb21tZW50c09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAjY29tbWVudCA9ICcnO1xuICAjbG9jYXRpb24gPSAnJztcbiAgI3RpbWVzdGFtcCA9ICcnO1xuICAjcmVhZE9ubHlBZnRlckluaXQ7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuY29tbWVudHNfZnJvbV9sZWFybmVyLm4gYW5kIGNtaS5jb21tZW50c19mcm9tX2xtcy5uXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVhZE9ubHlBZnRlckluaXRcbiAgICovXG4gIGNvbnN0cnVjdG9yKHJlYWRPbmx5QWZ0ZXJJbml0ID0gZmFsc2UpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuI2NvbW1lbnQgPSAnJztcbiAgICB0aGlzLiNsb2NhdGlvbiA9ICcnO1xuICAgIHRoaXMuI3RpbWVzdGFtcCA9ICcnO1xuICAgIHRoaXMuI3JlYWRPbmx5QWZ0ZXJJbml0ID0gcmVhZE9ubHlBZnRlckluaXQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29tbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29tbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy4jY29tbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb21tZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21tZW50XG4gICAqL1xuICBzZXQgY29tbWVudChjb21tZW50KSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQgJiYgdGhpcy4jcmVhZE9ubHlBZnRlckluaXQpIHtcbiAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoY29tbWVudCwgc2Nvcm0yMDA0X3JlZ2V4LkNNSUxhbmdTdHJpbmc0MDAwLFxuICAgICAgICAgIHRydWUpKSB7XG4gICAgICAgIHRoaXMuI2NvbW1lbnQgPSBjb21tZW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsb2NhdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xvY2F0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xvY2F0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvblxuICAgKi9cbiAgc2V0IGxvY2F0aW9uKGxvY2F0aW9uKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQgJiYgdGhpcy4jcmVhZE9ubHlBZnRlckluaXQpIHtcbiAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQobG9jYXRpb24sIHNjb3JtMjAwNF9yZWdleC5DTUlTdHJpbmcyNTApKSB7XG4gICAgICAgIHRoaXMuI2xvY2F0aW9uID0gbG9jYXRpb247XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWVzdGFtcFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGltZXN0YW1wKCkge1xuICAgIHJldHVybiB0aGlzLiN0aW1lc3RhbXA7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGltZXN0YW1wXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lc3RhbXBcbiAgICovXG4gIHNldCB0aW1lc3RhbXAodGltZXN0YW1wKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQgJiYgdGhpcy4jcmVhZE9ubHlBZnRlckluaXQpIHtcbiAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQodGltZXN0YW1wLCBzY29ybTIwMDRfcmVnZXguQ01JVGltZSkpIHtcbiAgICAgICAgdGhpcy4jdGltZXN0YW1wID0gdGltZXN0YW1wO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5jb21tZW50c19mcm9tX2xlYXJuZXIubiBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBjb21tZW50OiBzdHJpbmcsXG4gICAqICAgICAgbG9jYXRpb246IHN0cmluZyxcbiAgICogICAgICB0aW1lc3RhbXA6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnY29tbWVudCc6IHRoaXMuY29tbWVudCxcbiAgICAgICdsb2NhdGlvbic6IHRoaXMubG9jYXRpb24sXG4gICAgICAndGltZXN0YW1wJzogdGhpcy50aW1lc3RhbXAsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGNtaS5pbnRlcmFjdGlvbnMubi5vYmplY3RpdmVzLm4gb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlJbnRlcmFjdGlvbnNPYmplY3RpdmVzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNpZCA9ICcnO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmludGVyYWN0aW9ucy5uLm9iamVjdGl2ZXMublxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNpZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGlkLCBzY29ybTIwMDRfcmVnZXguQ01JTG9uZ0lkZW50aWZpZXIpKSB7XG4gICAgICB0aGlzLiNpZCA9IGlkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5pbnRlcmFjdGlvbnMubi5vYmplY3RpdmVzLm5cbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBpZDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdpZCc6IHRoaXMuaWQsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGNtaS5pbnRlcmFjdGlvbnMubi5jb3JyZWN0X3Jlc3BvbnNlcy5uIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JSW50ZXJhY3Rpb25zQ29ycmVjdFJlc3BvbnNlc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAjcGF0dGVybiA9ICcnO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmludGVyYWN0aW9ucy5uLmNvcnJlY3RfcmVzcG9uc2VzLm5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjcGF0dGVyblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgcGF0dGVybigpIHtcbiAgICByZXR1cm4gdGhpcy4jcGF0dGVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNwYXR0ZXJuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXR0ZXJuXG4gICAqL1xuICBzZXQgcGF0dGVybihwYXR0ZXJuKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHBhdHRlcm4sIHNjb3JtMjAwNF9yZWdleC5DTUlGZWVkYmFjaykpIHtcbiAgICAgIHRoaXMuI3BhdHRlcm4gPSBwYXR0ZXJuO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gY21pLmludGVyYWN0aW9ucy5uLmNvcnJlY3RfcmVzcG9uc2VzLm4gb2JqZWN0XG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgcGF0dGVybjogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdwYXR0ZXJuJzogdGhpcy5wYXR0ZXJuLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDIwMDQncyBhZGwgb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBBREwgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBhZGxcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLm5hdiA9IG5ldyBBRExOYXYoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5uYXY/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGFkbFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIG5hdjoge1xuICAgKiAgICAgICAgcmVxdWVzdDogc3RyaW5nXG4gICAqICAgICAgfVxuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnbmF2JzogdGhpcy5uYXYsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGFkbC5uYXYgb2JqZWN0XG4gKi9cbmNsYXNzIEFETE5hdiBleHRlbmRzIEJhc2VDTUkge1xuICAjcmVxdWVzdCA9ICdfbm9uZV8nO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgYWRsLm5hdlxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMucmVxdWVzdF92YWxpZCA9IG5ldyBBRExOYXZSZXF1ZXN0VmFsaWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5yZXF1ZXN0X3ZhbGlkPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjcmVxdWVzdFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgcmVxdWVzdCgpIHtcbiAgICByZXR1cm4gdGhpcy4jcmVxdWVzdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNyZXF1ZXN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZXF1ZXN0XG4gICAqL1xuICBzZXQgcmVxdWVzdChyZXF1ZXN0KSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHJlcXVlc3QsIHNjb3JtMjAwNF9yZWdleC5OQVZFdmVudCkpIHtcbiAgICAgIHRoaXMuI3JlcXVlc3QgPSByZXF1ZXN0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGFkbC5uYXZcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICByZXF1ZXN0OiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3JlcXVlc3QnOiB0aGlzLnJlcXVlc3QsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGFkbC5uYXYucmVxdWVzdF92YWxpZCBvYmplY3RcbiAqL1xuY2xhc3MgQURMTmF2UmVxdWVzdFZhbGlkIGV4dGVuZHMgQmFzZUNNSSB7XG4gICNjb250aW51ZSA9ICd1bmtub3duJztcbiAgI3ByZXZpb3VzID0gJ3Vua25vd24nO1xuICBjaG9pY2UgPSBjbGFzcyB7XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGFyZ2V0IGlzIHZhbGlkXG4gICAgICogQHBhcmFtIHsqfSBfdGFyZ2V0XG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIF9pc1RhcmdldFZhbGlkID0gKF90YXJnZXQpID0+ICd1bmtub3duJztcbiAgfTtcbiAganVtcCA9IGNsYXNzIHtcbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0YXJnZXQgaXMgdmFsaWRcbiAgICAgKiBAcGFyYW0geyp9IF90YXJnZXRcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgX2lzVGFyZ2V0VmFsaWQgPSAoX3RhcmdldCkgPT4gJ3Vua25vd24nO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgYWRsLm5hdi5yZXF1ZXN0X3ZhbGlkXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NvbnRpbnVlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb250aW51ZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jY29udGludWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29udGludWUuIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0geyp9IF9cbiAgICovXG4gIHNldCBjb250aW51ZShfKSB7XG4gICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjcHJldmlvdXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHByZXZpb3VzKCkge1xuICAgIHJldHVybiB0aGlzLiNwcmV2aW91cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNwcmV2aW91cy4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7Kn0gX1xuICAgKi9cbiAgc2V0IHByZXZpb3VzKF8pIHtcbiAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGFkbC5uYXYucmVxdWVzdF92YWxpZFxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHByZXZpb3VzOiBzdHJpbmcsXG4gICAqICAgICAgY29udGludWU6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAncHJldmlvdXMnOiB0aGlzLnByZXZpb3VzLFxuICAgICAgJ2NvbnRpbnVlJzogdGhpcy5jb250aW51ZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIiwiLy8gQGZsb3dcblxuY29uc3QgZ2xvYmFsID0ge1xuICBTQ09STV9UUlVFOiAndHJ1ZScsXG4gIFNDT1JNX0ZBTFNFOiAnZmFsc2UnLFxuICBTVEFURV9OT1RfSU5JVElBTElaRUQ6IDAsXG4gIFNUQVRFX0lOSVRJQUxJWkVEOiAxLFxuICBTVEFURV9URVJNSU5BVEVEOiAyLFxuICBMT0dfTEVWRUxfREVCVUc6IDEsXG4gIExPR19MRVZFTF9JTkZPOiAyLFxuICBMT0dfTEVWRUxfV0FSTklORzogMyxcbiAgTE9HX0xFVkVMX0VSUk9SOiA0LFxuICBMT0dfTEVWRUxfTk9ORTogNSxcbn07XG5cbmNvbnN0IHNjb3JtMTIgPSB7XG4gIC8vIENoaWxkcmVuIGxpc3RzXG4gIGNtaV9jaGlsZHJlbjogJ2NvcmUsc3VzcGVuZF9kYXRhLGxhdW5jaF9kYXRhLGNvbW1lbnRzLG9iamVjdGl2ZXMsc3R1ZGVudF9kYXRhLHN0dWRlbnRfcHJlZmVyZW5jZSxpbnRlcmFjdGlvbnMnLFxuICBjb3JlX2NoaWxkcmVuOiAnc3R1ZGVudF9pZCxzdHVkZW50X25hbWUsbGVzc29uX2xvY2F0aW9uLGNyZWRpdCxsZXNzb25fc3RhdHVzLGVudHJ5LHNjb3JlLHRvdGFsX3RpbWUsbGVzc29uX21vZGUsZXhpdCxzZXNzaW9uX3RpbWUnLFxuICBzY29yZV9jaGlsZHJlbjogJ3JhdyxtaW4sbWF4JyxcbiAgY29tbWVudHNfY2hpbGRyZW46ICdjb250ZW50LGxvY2F0aW9uLHRpbWUnLFxuICBvYmplY3RpdmVzX2NoaWxkcmVuOiAnaWQsc2NvcmUsc3RhdHVzJyxcbiAgY29ycmVjdF9yZXNwb25zZXNfY2hpbGRyZW46ICdwYXR0ZXJuJyxcbiAgc3R1ZGVudF9kYXRhX2NoaWxkcmVuOiAnbWFzdGVyeV9zY29yZSxtYXhfdGltZV9hbGxvd2VkLHRpbWVfbGltaXRfYWN0aW9uJyxcbiAgc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuOiAnYXVkaW8sbGFuZ3VhZ2Usc3BlZWQsdGV4dCcsXG4gIGludGVyYWN0aW9uc19jaGlsZHJlbjogJ2lkLG9iamVjdGl2ZXMsdGltZSx0eXBlLGNvcnJlY3RfcmVzcG9uc2VzLHdlaWdodGluZyxzdHVkZW50X3Jlc3BvbnNlLHJlc3VsdCxsYXRlbmN5JyxcblxuICBlcnJvcl9kZXNjcmlwdGlvbnM6IHtcbiAgICAnMTAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBFeGNlcHRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ05vIHNwZWNpZmljIGVycm9yIGNvZGUgZXhpc3RzIHRvIGRlc2NyaWJlIHRoZSBlcnJvci4gVXNlIExNU0dldERpYWdub3N0aWMgZm9yIG1vcmUgaW5mb3JtYXRpb24nLFxuICAgIH0sXG4gICAgJzIwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0ludmFsaWQgYXJndW1lbnQgZXJyb3InLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyB0aGF0IGFuIGFyZ3VtZW50IHJlcHJlc2VudHMgYW4gaW52YWxpZCBkYXRhIG1vZGVsIGVsZW1lbnQgb3IgaXMgb3RoZXJ3aXNlIGluY29ycmVjdC4nLFxuICAgIH0sXG4gICAgJzIwMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0VsZW1lbnQgY2Fubm90IGhhdmUgY2hpbGRyZW4nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyB0aGF0IExNU0dldFZhbHVlIHdhcyBjYWxsZWQgd2l0aCBhIGRhdGEgbW9kZWwgZWxlbWVudCBuYW1lIHRoYXQgZW5kcyBpbiBcIl9jaGlsZHJlblwiIGZvciBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IGRvZXMgbm90IHN1cHBvcnQgdGhlIFwiX2NoaWxkcmVuXCIgc3VmZml4LicsXG4gICAgfSxcbiAgICAnMjAzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRWxlbWVudCBub3QgYW4gYXJyYXkgLSBjYW5ub3QgaGF2ZSBjb3VudCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIHRoYXQgTE1TR2V0VmFsdWUgd2FzIGNhbGxlZCB3aXRoIGEgZGF0YSBtb2RlbCBlbGVtZW50IG5hbWUgdGhhdCBlbmRzIGluIFwiX2NvdW50XCIgZm9yIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgZG9lcyBub3Qgc3VwcG9ydCB0aGUgXCJfY291bnRcIiBzdWZmaXguJyxcbiAgICB9LFxuICAgICczMDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdOb3QgaW5pdGlhbGl6ZWQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyB0aGF0IGFuIEFQSSBjYWxsIHdhcyBtYWRlIGJlZm9yZSB0aGUgY2FsbCB0byBsbXNJbml0aWFsaXplLicsXG4gICAgfSxcbiAgICAnNDAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnTm90IGltcGxlbWVudGVkIGVycm9yJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdUaGUgZGF0YSBtb2RlbCBlbGVtZW50IGluZGljYXRlZCBpbiBhIGNhbGwgdG8gTE1TR2V0VmFsdWUgb3IgTE1TU2V0VmFsdWUgaXMgdmFsaWQsIGJ1dCB3YXMgbm90IGltcGxlbWVudGVkIGJ5IHRoaXMgTE1TLiBTQ09STSAxLjIgZGVmaW5lcyBhIHNldCBvZiBkYXRhIG1vZGVsIGVsZW1lbnRzIGFzIGJlaW5nIG9wdGlvbmFsIGZvciBhbiBMTVMgdG8gaW1wbGVtZW50LicsXG4gICAgfSxcbiAgICAnNDAyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnSW52YWxpZCBzZXQgdmFsdWUsIGVsZW1lbnQgaXMgYSBrZXl3b3JkJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgdGhhdCBMTVNTZXRWYWx1ZSB3YXMgY2FsbGVkIG9uIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgcmVwcmVzZW50cyBhIGtleXdvcmQgKGVsZW1lbnRzIHRoYXQgZW5kIGluIFwiX2NoaWxkcmVuXCIgYW5kIFwiX2NvdW50XCIpLicsXG4gICAgfSxcbiAgICAnNDAzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRWxlbWVudCBpcyByZWFkIG9ubHknLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0xNU1NldFZhbHVlIHdhcyBjYWxsZWQgd2l0aCBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IGNhbiBvbmx5IGJlIHJlYWQuJyxcbiAgICB9LFxuICAgICc0MDQnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdFbGVtZW50IGlzIHdyaXRlIG9ubHknLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0xNU0dldFZhbHVlIHdhcyBjYWxsZWQgb24gYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBjYW4gb25seSBiZSB3cml0dGVuIHRvLicsXG4gICAgfSxcbiAgICAnNDA1Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnSW5jb3JyZWN0IERhdGEgVHlwZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTE1TU2V0VmFsdWUgd2FzIGNhbGxlZCB3aXRoIGEgdmFsdWUgdGhhdCBpcyBub3QgY29uc2lzdGVudCB3aXRoIHRoZSBkYXRhIGZvcm1hdCBvZiB0aGUgc3VwcGxpZWQgZGF0YSBtb2RlbCBlbGVtZW50LicsXG4gICAgfSxcbiAgfSxcbn07XG5cbmNvbnN0IGFpY2MgPSB7XG4gIC4uLnNjb3JtMTIsIC4uLntcbiAgICBjbWlfY2hpbGRyZW46ICdjb3JlLHN1c3BlbmRfZGF0YSxsYXVuY2hfZGF0YSxjb21tZW50cyxvYmplY3RpdmVzLHN0dWRlbnRfZGF0YSxzdHVkZW50X3ByZWZlcmVuY2UsaW50ZXJhY3Rpb25zLGV2YWx1YXRpb24nLFxuICAgIHN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbjogJ2F1ZGlvLGxhbmd1YWdlLGxlc3Nvbl90eXBlLHNwZWVkLHRleHQsdGV4dF9jb2xvcix0ZXh0X2xvY2F0aW9uLHRleHRfc2l6ZSx2aWRlbyx3aW5kb3dzJyxcbiAgICBzdHVkZW50X2RhdGFfY2hpbGRyZW46ICdhdHRlbXB0X251bWJlcix0cmllcyxtYXN0ZXJ5X3Njb3JlLG1heF90aW1lX2FsbG93ZWQsdGltZV9saW1pdF9hY3Rpb24nLFxuICAgIHN0dWRlbnRfZGVtb2dyYXBoaWNzX2NoaWxkcmVuOiAnY2l0eSxjbGFzcyxjb21wYW55LGNvdW50cnksZXhwZXJpZW5jZSxmYW1pbGlhcl9uYW1lLGluc3RydWN0b3JfbmFtZSx0aXRsZSxuYXRpdmVfbGFuZ3VhZ2Usc3RhdGUsc3RyZWV0X2FkZHJlc3MsdGVsZXBob25lLHllYXJzX2V4cGVyaWVuY2UnLFxuICAgIHRyaWVzX2NoaWxkcmVuOiAndGltZSxzdGF0dXMsc2NvcmUnLFxuICAgIGF0dGVtcHRfcmVjb3Jkc19jaGlsZHJlbjogJ3Njb3JlLGxlc3Nvbl9zdGF0dXMnLFxuICAgIHBhdGhzX2NoaWxkcmVuOiAnbG9jYXRpb25faWQsZGF0ZSx0aW1lLHN0YXR1cyx3aHlfbGVmdCx0aW1lX2luX2VsZW1lbnQnLFxuICB9LFxufTtcblxuY29uc3Qgc2Nvcm0yMDA0ID0ge1xuICAvLyBDaGlsZHJlbiBsaXN0c1xuICBjbWlfY2hpbGRyZW46ICdfdmVyc2lvbixjb21tZW50c19mcm9tX2xlYXJuZXIsY29tbWVudHNfZnJvbV9sbXMsY29tcGxldGlvbl9zdGF0dXMsY3JlZGl0LGVudHJ5LGV4aXQsaW50ZXJhY3Rpb25zLGxhdW5jaF9kYXRhLGxlYXJuZXJfaWQsbGVhcm5lcl9uYW1lLGxlYXJuZXJfcHJlZmVyZW5jZSxsb2NhdGlvbixtYXhfdGltZV9hbGxvd2VkLG1vZGUsb2JqZWN0aXZlcyxwcm9ncmVzc19tZWFzdXJlLHNjYWxlZF9wYXNzaW5nX3Njb3JlLHNjb3JlLHNlc3Npb25fdGltZSxzdWNjZXNzX3N0YXR1cyxzdXNwZW5kX2RhdGEsdGltZV9saW1pdF9hY3Rpb24sdG90YWxfdGltZScsXG4gIGNvbW1lbnRzX2NoaWxkcmVuOiAnY29tbWVudCx0aW1lc3RhbXAsbG9jYXRpb24nLFxuICBzY29yZV9jaGlsZHJlbjogJ21heCxyYXcsc2NhbGVkLG1pbicsXG4gIG9iamVjdGl2ZXNfY2hpbGRyZW46ICdwcm9ncmVzc19tZWFzdXJlLGNvbXBsZXRpb25fc3RhdHVzLHN1Y2Nlc3Nfc3RhdHVzLGRlc2NyaXB0aW9uLHNjb3JlLGlkJyxcbiAgY29ycmVjdF9yZXNwb25zZXNfY2hpbGRyZW46ICdwYXR0ZXJuJyxcbiAgc3R1ZGVudF9kYXRhX2NoaWxkcmVuOiAnbWFzdGVyeV9zY29yZSxtYXhfdGltZV9hbGxvd2VkLHRpbWVfbGltaXRfYWN0aW9uJyxcbiAgc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuOiAnYXVkaW9fbGV2ZWwsYXVkaW9fY2FwdGlvbmluZyxkZWxpdmVyeV9zcGVlZCxsYW5ndWFnZScsXG4gIGludGVyYWN0aW9uc19jaGlsZHJlbjogJ2lkLHR5cGUsb2JqZWN0aXZlcyx0aW1lc3RhbXAsY29ycmVjdF9yZXNwb25zZXMsd2VpZ2h0aW5nLGxlYXJuZXJfcmVzcG9uc2UscmVzdWx0LGxhdGVuY3ksZGVzY3JpcHRpb24nLFxuXG4gIGVycm9yX2Rlc2NyaXB0aW9uczoge1xuICAgICcwJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnTm8gRXJyb3InLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ05vIGVycm9yIG9jY3VycmVkLCB0aGUgcHJldmlvdXMgQVBJIGNhbGwgd2FzIHN1Y2Nlc3NmdWwuJyxcbiAgICB9LFxuICAgICcxMDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIEV4Y2VwdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTm8gc3BlY2lmaWMgZXJyb3IgY29kZSBleGlzdHMgdG8gZGVzY3JpYmUgdGhlIGVycm9yLiBVc2UgR2V0RGlhZ25vc3RpYyBmb3IgbW9yZSBpbmZvcm1hdGlvbi4nLFxuICAgIH0sXG4gICAgJzEwMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgSW5pdGlhbGl6YXRpb24gRmFpbHVyZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBJbml0aWFsaXplIGZhaWxlZCBmb3IgYW4gdW5rbm93biByZWFzb24uJyxcbiAgICB9LFxuICAgICcxMDMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdBbHJlYWR5IEluaXRpYWxpemVkJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIEluaXRpYWxpemUgZmFpbGVkIGJlY2F1c2UgSW5pdGlhbGl6ZSB3YXMgYWxyZWFkeSBjYWxsZWQuJyxcbiAgICB9LFxuICAgICcxMDQnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdDb250ZW50IEluc3RhbmNlIFRlcm1pbmF0ZWQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gSW5pdGlhbGl6ZSBmYWlsZWQgYmVjYXVzZSBUZXJtaW5hdGUgd2FzIGFscmVhZHkgY2FsbGVkLicsXG4gICAgfSxcbiAgICAnMTExJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBUZXJtaW5hdGlvbiBGYWlsdXJlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIFRlcm1pbmF0ZSBmYWlsZWQgZm9yIGFuIHVua25vd24gcmVhc29uLicsXG4gICAgfSxcbiAgICAnMTEyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnVGVybWluYXRpb24gQmVmb3JlIEluaXRpYWxpemF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIFRlcm1pbmF0ZSBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBiZWZvcmUgdGhlIGNhbGwgdG8gSW5pdGlhbGl6ZS4nLFxuICAgIH0sXG4gICAgJzExMyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1Rlcm1pbmF0aW9uIEFmdGVyIFRlcm1pbmF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIFRlcm1pbmF0ZSBmYWlsZWQgYmVjYXVzZSBUZXJtaW5hdGUgd2FzIGFscmVhZHkgY2FsbGVkLicsXG4gICAgfSxcbiAgICAnMTIyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnUmV0cmlldmUgRGF0YSBCZWZvcmUgSW5pdGlhbGl6YXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gR2V0VmFsdWUgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYmVmb3JlIHRoZSBjYWxsIHRvIEluaXRpYWxpemUuJyxcbiAgICB9LFxuICAgICcxMjMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdSZXRyaWV2ZSBEYXRhIEFmdGVyIFRlcm1pbmF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIEdldFZhbHVlIGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGFmdGVyIHRoZSBjYWxsIHRvIFRlcm1pbmF0ZS4nLFxuICAgIH0sXG4gICAgJzEzMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1N0b3JlIERhdGEgQmVmb3JlIEluaXRpYWxpemF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIFNldFZhbHVlIGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGJlZm9yZSB0aGUgY2FsbCB0byBJbml0aWFsaXplLicsXG4gICAgfSxcbiAgICAnMTMzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnU3RvcmUgRGF0YSBBZnRlciBUZXJtaW5hdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBTZXRWYWx1ZSBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBhZnRlciB0aGUgY2FsbCB0byBUZXJtaW5hdGUuJyxcbiAgICB9LFxuICAgICcxNDInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdDb21taXQgQmVmb3JlIEluaXRpYWxpemF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIENvbW1pdCBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBiZWZvcmUgdGhlIGNhbGwgdG8gSW5pdGlhbGl6ZS4nLFxuICAgIH0sXG4gICAgJzE0Myc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0NvbW1pdCBBZnRlciBUZXJtaW5hdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBDb21taXQgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYWZ0ZXIgdGhlIGNhbGwgdG8gVGVybWluYXRlLicsXG4gICAgfSxcbiAgICAnMjAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBBcmd1bWVudCBFcnJvcicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQW4gaW52YWxpZCBhcmd1bWVudCB3YXMgcGFzc2VkIHRvIGFuIEFQSSBtZXRob2QgKHVzdWFsbHkgaW5kaWNhdGVzIHRoYXQgSW5pdGlhbGl6ZSwgQ29tbWl0IG9yIFRlcm1pbmF0ZSBkaWQgbm90IHJlY2VpdmUgdGhlIGV4cGVjdGVkIGVtcHR5IHN0cmluZyBhcmd1bWVudC4nLFxuICAgIH0sXG4gICAgJzMwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgR2V0IEZhaWx1cmUnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyBhIGZhaWxlZCBHZXRWYWx1ZSBjYWxsIHdoZXJlIG5vIG90aGVyIHNwZWNpZmljIGVycm9yIGNvZGUgaXMgYXBwbGljYWJsZS4gVXNlIEdldERpYWdub3N0aWMgZm9yIG1vcmUgaW5mb3JtYXRpb24uJyxcbiAgICB9LFxuICAgICczNTEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIFNldCBGYWlsdXJlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgYSBmYWlsZWQgU2V0VmFsdWUgY2FsbCB3aGVyZSBubyBvdGhlciBzcGVjaWZpYyBlcnJvciBjb2RlIGlzIGFwcGxpY2FibGUuIFVzZSBHZXREaWFnbm9zdGljIGZvciBtb3JlIGluZm9ybWF0aW9uLicsXG4gICAgfSxcbiAgICAnMzkxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBDb21taXQgRmFpbHVyZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIGEgZmFpbGVkIENvbW1pdCBjYWxsIHdoZXJlIG5vIG90aGVyIHNwZWNpZmljIGVycm9yIGNvZGUgaXMgYXBwbGljYWJsZS4gVXNlIEdldERpYWdub3N0aWMgZm9yIG1vcmUgaW5mb3JtYXRpb24uJyxcbiAgICB9LFxuICAgICc0MDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdVbmRlZmluZWQgRGF0YSBNb2RlbCBFbGVtZW50JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdUaGUgZGF0YSBtb2RlbCBlbGVtZW50IG5hbWUgcGFzc2VkIHRvIEdldFZhbHVlIG9yIFNldFZhbHVlIGlzIG5vdCBhIHZhbGlkIFNDT1JNIGRhdGEgbW9kZWwgZWxlbWVudC4nLFxuICAgIH0sXG4gICAgJzQwMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1VuaW1wbGVtZW50ZWQgRGF0YSBNb2RlbCBFbGVtZW50JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdUaGUgZGF0YSBtb2RlbCBlbGVtZW50IGluZGljYXRlZCBpbiBhIGNhbGwgdG8gR2V0VmFsdWUgb3IgU2V0VmFsdWUgaXMgdmFsaWQsIGJ1dCB3YXMgbm90IGltcGxlbWVudGVkIGJ5IHRoaXMgTE1TLiBJbiBTQ09STSAyMDA0LCB0aGlzIGVycm9yIHdvdWxkIGluZGljYXRlIGFuIExNUyB0aGF0IGlzIG5vdCBmdWxseSBTQ09STSBjb25mb3JtYW50LicsXG4gICAgfSxcbiAgICAnNDAzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBFbGVtZW50IFZhbHVlIE5vdCBJbml0aWFsaXplZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQXR0ZW1wdCB0byByZWFkIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkIGJ5IHRoZSBMTVMgb3IgdGhyb3VnaCBhIFNldFZhbHVlIGNhbGwuIFRoaXMgZXJyb3IgY29uZGl0aW9uIGlzIG9mdGVuIHJlYWNoZWQgZHVyaW5nIG5vcm1hbCBleGVjdXRpb24gb2YgYSBTQ08uJyxcbiAgICB9LFxuICAgICc0MDQnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdEYXRhIE1vZGVsIEVsZW1lbnQgSXMgUmVhZCBPbmx5JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdTZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBjYW4gb25seSBiZSByZWFkLicsXG4gICAgfSxcbiAgICAnNDA1Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBFbGVtZW50IElzIFdyaXRlIE9ubHknLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0dldFZhbHVlIHdhcyBjYWxsZWQgb24gYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBjYW4gb25seSBiZSB3cml0dGVuIHRvLicsXG4gICAgfSxcbiAgICAnNDA2Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBFbGVtZW50IFR5cGUgTWlzbWF0Y2gnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1NldFZhbHVlIHdhcyBjYWxsZWQgd2l0aCBhIHZhbHVlIHRoYXQgaXMgbm90IGNvbnNpc3RlbnQgd2l0aCB0aGUgZGF0YSBmb3JtYXQgb2YgdGhlIHN1cHBsaWVkIGRhdGEgbW9kZWwgZWxlbWVudC4nLFxuICAgIH0sXG4gICAgJzQwNyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0RhdGEgTW9kZWwgRWxlbWVudCBWYWx1ZSBPdXQgT2YgUmFuZ2UnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1RoZSBudW1lcmljIHZhbHVlIHN1cHBsaWVkIHRvIGEgU2V0VmFsdWUgY2FsbCBpcyBvdXRzaWRlIG9mIHRoZSBudW1lcmljIHJhbmdlIGFsbG93ZWQgZm9yIHRoZSBzdXBwbGllZCBkYXRhIG1vZGVsIGVsZW1lbnQuJyxcbiAgICB9LFxuICAgICc0MDgnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdEYXRhIE1vZGVsIERlcGVuZGVuY3kgTm90IEVzdGFibGlzaGVkJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdTb21lIGRhdGEgbW9kZWwgZWxlbWVudHMgY2Fubm90IGJlIHNldCB1bnRpbCBhbm90aGVyIGRhdGEgbW9kZWwgZWxlbWVudCB3YXMgc2V0LiBUaGlzIGVycm9yIGNvbmRpdGlvbiBpbmRpY2F0ZXMgdGhhdCB0aGUgcHJlcmVxdWlzaXRlIGVsZW1lbnQgd2FzIG5vdCBzZXQgYmVmb3JlIHRoZSBkZXBlbmRlbnQgZWxlbWVudC4nLFxuICAgIH0sXG4gIH0sXG59O1xuXG5jb25zdCBBUElDb25zdGFudHMgPSB7XG4gIGdsb2JhbDogZ2xvYmFsLFxuICBzY29ybTEyOiBzY29ybTEyLFxuICBhaWNjOiBhaWNjLFxuICBzY29ybTIwMDQ6IHNjb3JtMjAwNCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFQSUNvbnN0YW50cztcbiIsIi8vIEBmbG93XG5jb25zdCBnbG9iYWwgPSB7XG4gIEdFTkVSQUw6IDEwMSxcbiAgSU5JVElBTElaQVRJT05fRkFJTEVEOiAxMDEsXG4gIElOSVRJQUxJWkVEOiAxMDEsXG4gIFRFUk1JTkFURUQ6IDEwMSxcbiAgVEVSTUlOQVRJT05fRkFJTFVSRTogMTAxLFxuICBURVJNSU5BVElPTl9CRUZPUkVfSU5JVDogMTAxLFxuICBNVUxUSVBMRV9URVJNSU5BVElPTjogMTAxLFxuICBSRVRSSUVWRV9CRUZPUkVfSU5JVDogMTAxLFxuICBSRVRSSUVWRV9BRlRFUl9URVJNOiAxMDEsXG4gIFNUT1JFX0JFRk9SRV9JTklUOiAxMDEsXG4gIFNUT1JFX0FGVEVSX1RFUk06IDEwMSxcbiAgQ09NTUlUX0JFRk9SRV9JTklUOiAxMDEsXG4gIENPTU1JVF9BRlRFUl9URVJNOiAxMDEsXG4gIEFSR1VNRU5UX0VSUk9SOiAxMDEsXG4gIENISUxEUkVOX0VSUk9SOiAxMDEsXG4gIENPVU5UX0VSUk9SOiAxMDEsXG4gIEdFTkVSQUxfR0VUX0ZBSUxVUkU6IDEwMSxcbiAgR0VORVJBTF9TRVRfRkFJTFVSRTogMTAxLFxuICBHRU5FUkFMX0NPTU1JVF9GQUlMVVJFOiAxMDEsXG4gIFVOREVGSU5FRF9EQVRBX01PREVMOiAxMDEsXG4gIFVOSU1QTEVNRU5URURfRUxFTUVOVDogMTAxLFxuICBWQUxVRV9OT1RfSU5JVElBTElaRUQ6IDEwMSxcbiAgSU5WQUxJRF9TRVRfVkFMVUU6IDEwMSxcbiAgUkVBRF9PTkxZX0VMRU1FTlQ6IDEwMSxcbiAgV1JJVEVfT05MWV9FTEVNRU5UOiAxMDEsXG4gIFRZUEVfTUlTTUFUQ0g6IDEwMSxcbiAgVkFMVUVfT1VUX09GX1JBTkdFOiAxMDEsXG4gIERFUEVOREVOQ1lfTk9UX0VTVEFCTElTSEVEOiAxMDEsXG59O1xuXG5jb25zdCBzY29ybTEyID0ge1xuICAuLi5nbG9iYWwsIC4uLntcbiAgICBSRVRSSUVWRV9CRUZPUkVfSU5JVDogMzAxLFxuICAgIFNUT1JFX0JFRk9SRV9JTklUOiAzMDEsXG4gICAgQ09NTUlUX0JFRk9SRV9JTklUOiAzMDEsXG4gICAgQVJHVU1FTlRfRVJST1I6IDIwMSxcbiAgICBDSElMRFJFTl9FUlJPUjogMjAyLFxuICAgIENPVU5UX0VSUk9SOiAyMDMsXG4gICAgVU5ERUZJTkVEX0RBVEFfTU9ERUw6IDQwMSxcbiAgICBVTklNUExFTUVOVEVEX0VMRU1FTlQ6IDQwMSxcbiAgICBWQUxVRV9OT1RfSU5JVElBTElaRUQ6IDMwMSxcbiAgICBJTlZBTElEX1NFVF9WQUxVRTogNDAyLFxuICAgIFJFQURfT05MWV9FTEVNRU5UOiA0MDMsXG4gICAgV1JJVEVfT05MWV9FTEVNRU5UOiA0MDQsXG4gICAgVFlQRV9NSVNNQVRDSDogNDA1LFxuICAgIFZBTFVFX09VVF9PRl9SQU5HRTogNDA3LFxuICAgIERFUEVOREVOQ1lfTk9UX0VTVEFCTElTSEVEOiA0MDgsXG4gIH0sXG59O1xuXG5jb25zdCBzY29ybTIwMDQgPSB7XG4gIC4uLmdsb2JhbCwgLi4ue1xuICAgIElOSVRJQUxJWkFUSU9OX0ZBSUxFRDogMTAyLFxuICAgIElOSVRJQUxJWkVEOiAxMDMsXG4gICAgVEVSTUlOQVRFRDogMTA0LFxuICAgIFRFUk1JTkFUSU9OX0ZBSUxVUkU6IDExMSxcbiAgICBURVJNSU5BVElPTl9CRUZPUkVfSU5JVDogMTEyLFxuICAgIE1VTFRJUExFX1RFUk1JTkFUSU9OUzogMTEzLFxuICAgIFJFVFJJRVZFX0JFRk9SRV9JTklUOiAxMjIsXG4gICAgUkVUUklFVkVfQUZURVJfVEVSTTogMTIzLFxuICAgIFNUT1JFX0JFRk9SRV9JTklUOiAxMzIsXG4gICAgU1RPUkVfQUZURVJfVEVSTTogMTMzLFxuICAgIENPTU1JVF9CRUZPUkVfSU5JVDogMTQyLFxuICAgIENPTU1JVF9BRlRFUl9URVJNOiAxNDMsXG4gICAgQVJHVU1FTlRfRVJST1I6IDIwMSxcbiAgICBHRU5FUkFMX0dFVF9GQUlMVVJFOiAzMDEsXG4gICAgR0VORVJBTF9TRVRfRkFJTFVSRTogMzUxLFxuICAgIEdFTkVSQUxfQ09NTUlUX0ZBSUxVUkU6IDM5MSxcbiAgICBVTkRFRklORURfREFUQV9NT0RFTDogNDAxLFxuICAgIFVOSU1QTEVNRU5URURfRUxFTUVOVDogNDAyLFxuICAgIFZBTFVFX05PVF9JTklUSUFMSVpFRDogNDAzLFxuICAgIFJFQURfT05MWV9FTEVNRU5UOiA0MDQsXG4gICAgV1JJVEVfT05MWV9FTEVNRU5UOiA0MDUsXG4gICAgVFlQRV9NSVNNQVRDSDogNDA2LFxuICAgIFZBTFVFX09VVF9PRl9SQU5HRTogNDA3LFxuICAgIERFUEVOREVOQ1lfTk9UX0VTVEFCTElTSEVEOiA0MDgsXG4gIH0sXG59O1xuXG5jb25zdCBFcnJvckNvZGVzID0ge1xuICBzY29ybTEyOiBzY29ybTEyLFxuICBzY29ybTIwMDQ6IHNjb3JtMjAwNCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEVycm9yQ29kZXM7XG4iLCJjb25zdCBWYWxpZExhbmd1YWdlcyA9IHtcbiAgJ2FhJzogJ2FhJywgJ2FiJzogJ2FiJywgJ2FlJzogJ2FlJywgJ2FmJzogJ2FmJywgJ2FrJzogJ2FrJywgJ2FtJzogJ2FtJyxcbiAgJ2FuJzogJ2FuJywgJ2FyJzogJ2FyJywgJ2FzJzogJ2FzJywgJ2F2JzogJ2F2JywgJ2F5JzogJ2F5JywgJ2F6JzogJ2F6JyxcbiAgJ2JhJzogJ2JhJywgJ2JlJzogJ2JlJywgJ2JnJzogJ2JnJywgJ2JoJzogJ2JoJywgJ2JpJzogJ2JpJywgJ2JtJzogJ2JtJyxcbiAgJ2JuJzogJ2JuJywgJ2JvJzogJ2JvJywgJ2JyJzogJ2JyJywgJ2JzJzogJ2JzJywgJ2NhJzogJ2NhJywgJ2NlJzogJ2NlJyxcbiAgJ2NoJzogJ2NoJywgJ2NvJzogJ2NvJywgJ2NyJzogJ2NyJywgJ2NzJzogJ2NzJywgJ2N1JzogJ2N1JywgJ2N2JzogJ2N2JyxcbiAgJ2N5JzogJ2N5JywgJ2RhJzogJ2RhJywgJ2RlJzogJ2RlJywgJ2R2JzogJ2R2JywgJ2R6JzogJ2R6JywgJ2VlJzogJ2VlJyxcbiAgJ2VsJzogJ2VsJywgJ2VuJzogJ2VuJywgJ2VvJzogJ2VvJywgJ2VzJzogJ2VzJywgJ2V0JzogJ2V0JywgJ2V1JzogJ2V1JyxcbiAgJ2ZhJzogJ2ZhJywgJ2ZmJzogJ2ZmJywgJ2ZpJzogJ2ZpJywgJ2ZqJzogJ2ZqJywgJ2ZvJzogJ2ZvJywgJ2ZyJzogJ2ZyJyxcbiAgJ2Z5JzogJ2Z5JywgJ2dhJzogJ2dhJywgJ2dkJzogJ2dkJywgJ2dsJzogJ2dsJywgJ2duJzogJ2duJywgJ2d1JzogJ2d1JyxcbiAgJ2d2JzogJ2d2JywgJ2hhJzogJ2hhJywgJ2hlJzogJ2hlJywgJ2hpJzogJ2hpJywgJ2hvJzogJ2hvJywgJ2hyJzogJ2hyJyxcbiAgJ2h0JzogJ2h0JywgJ2h1JzogJ2h1JywgJ2h5JzogJ2h5JywgJ2h6JzogJ2h6JywgJ2lhJzogJ2lhJywgJ2lkJzogJ2lkJyxcbiAgJ2llJzogJ2llJywgJ2lnJzogJ2lnJywgJ2lpJzogJ2lpJywgJ2lrJzogJ2lrJywgJ2lvJzogJ2lvJywgJ2lzJzogJ2lzJyxcbiAgJ2l0JzogJ2l0JywgJ2l1JzogJ2l1JywgJ2phJzogJ2phJywgJ2p2JzogJ2p2JywgJ2thJzogJ2thJywgJ2tnJzogJ2tnJyxcbiAgJ2tpJzogJ2tpJywgJ2tqJzogJ2tqJywgJ2trJzogJ2trJywgJ2tsJzogJ2tsJywgJ2ttJzogJ2ttJywgJ2tuJzogJ2tuJyxcbiAgJ2tvJzogJ2tvJywgJ2tyJzogJ2tyJywgJ2tzJzogJ2tzJywgJ2t1JzogJ2t1JywgJ2t2JzogJ2t2JywgJ2t3JzogJ2t3JyxcbiAgJ2t5JzogJ2t5JywgJ2xhJzogJ2xhJywgJ2xiJzogJ2xiJywgJ2xnJzogJ2xnJywgJ2xpJzogJ2xpJywgJ2xuJzogJ2xuJyxcbiAgJ2xvJzogJ2xvJywgJ2x0JzogJ2x0JywgJ2x1JzogJ2x1JywgJ2x2JzogJ2x2JywgJ21nJzogJ21nJywgJ21oJzogJ21oJyxcbiAgJ21pJzogJ21pJywgJ21rJzogJ21rJywgJ21sJzogJ21sJywgJ21uJzogJ21uJywgJ21vJzogJ21vJywgJ21yJzogJ21yJyxcbiAgJ21zJzogJ21zJywgJ210JzogJ210JywgJ215JzogJ215JywgJ25hJzogJ25hJywgJ25iJzogJ25iJywgJ25kJzogJ25kJyxcbiAgJ25lJzogJ25lJywgJ25nJzogJ25nJywgJ25sJzogJ25sJywgJ25uJzogJ25uJywgJ25vJzogJ25vJywgJ25yJzogJ25yJyxcbiAgJ252JzogJ252JywgJ255JzogJ255JywgJ29jJzogJ29jJywgJ29qJzogJ29qJywgJ29tJzogJ29tJywgJ29yJzogJ29yJyxcbiAgJ29zJzogJ29zJywgJ3BhJzogJ3BhJywgJ3BpJzogJ3BpJywgJ3BsJzogJ3BsJywgJ3BzJzogJ3BzJywgJ3B0JzogJ3B0JyxcbiAgJ3F1JzogJ3F1JywgJ3JtJzogJ3JtJywgJ3JuJzogJ3JuJywgJ3JvJzogJ3JvJywgJ3J1JzogJ3J1JywgJ3J3JzogJ3J3JyxcbiAgJ3NhJzogJ3NhJywgJ3NjJzogJ3NjJywgJ3NkJzogJ3NkJywgJ3NlJzogJ3NlJywgJ3NnJzogJ3NnJywgJ3NoJzogJ3NoJyxcbiAgJ3NpJzogJ3NpJywgJ3NrJzogJ3NrJywgJ3NsJzogJ3NsJywgJ3NtJzogJ3NtJywgJ3NuJzogJ3NuJywgJ3NvJzogJ3NvJyxcbiAgJ3NxJzogJ3NxJywgJ3NyJzogJ3NyJywgJ3NzJzogJ3NzJywgJ3N0JzogJ3N0JywgJ3N1JzogJ3N1JywgJ3N2JzogJ3N2JyxcbiAgJ3N3JzogJ3N3JywgJ3RhJzogJ3RhJywgJ3RlJzogJ3RlJywgJ3RnJzogJ3RnJywgJ3RoJzogJ3RoJywgJ3RpJzogJ3RpJyxcbiAgJ3RrJzogJ3RrJywgJ3RsJzogJ3RsJywgJ3RuJzogJ3RuJywgJ3RvJzogJ3RvJywgJ3RyJzogJ3RyJywgJ3RzJzogJ3RzJyxcbiAgJ3R0JzogJ3R0JywgJ3R3JzogJ3R3JywgJ3R5JzogJ3R5JywgJ3VnJzogJ3VnJywgJ3VrJzogJ3VrJywgJ3VyJzogJ3VyJyxcbiAgJ3V6JzogJ3V6JywgJ3ZlJzogJ3ZlJywgJ3ZpJzogJ3ZpJywgJ3ZvJzogJ3ZvJywgJ3dhJzogJ3dhJywgJ3dvJzogJ3dvJyxcbiAgJ3hoJzogJ3hoJywgJ3lpJzogJ3lpJywgJ3lvJzogJ3lvJywgJ3phJzogJ3phJywgJ3poJzogJ3poJywgJ3p1JzogJ3p1JyxcbiAgJ2Fhcic6ICdhYXInLCAnYWJrJzogJ2FiaycsICdhdmUnOiAnYXZlJywgJ2Fmcic6ICdhZnInLCAnYWthJzogJ2FrYScsXG4gICdhbWgnOiAnYW1oJywgJ2FyZyc6ICdhcmcnLCAnYXJhJzogJ2FyYScsICdhc20nOiAnYXNtJywgJ2F2YSc6ICdhdmEnLFxuICAnYXltJzogJ2F5bScsICdhemUnOiAnYXplJywgJ2Jhayc6ICdiYWsnLCAnYmVsJzogJ2JlbCcsICdidWwnOiAnYnVsJyxcbiAgJ2JpaCc6ICdiaWgnLCAnYmlzJzogJ2JpcycsICdiYW0nOiAnYmFtJywgJ2Jlbic6ICdiZW4nLCAndGliJzogJ3RpYicsXG4gICdib2QnOiAnYm9kJywgJ2JyZSc6ICdicmUnLCAnYm9zJzogJ2JvcycsICdjYXQnOiAnY2F0JywgJ2NoZSc6ICdjaGUnLFxuICAnY2hhJzogJ2NoYScsICdjb3MnOiAnY29zJywgJ2NyZSc6ICdjcmUnLCAnY3plJzogJ2N6ZScsICdjZXMnOiAnY2VzJyxcbiAgJ2NodSc6ICdjaHUnLCAnY2h2JzogJ2NodicsICd3ZWwnOiAnd2VsJywgJ2N5bSc6ICdjeW0nLCAnZGFuJzogJ2RhbicsXG4gICdnZXInOiAnZ2VyJywgJ2RldSc6ICdkZXUnLCAnZGl2JzogJ2RpdicsICdkem8nOiAnZHpvJywgJ2V3ZSc6ICdld2UnLFxuICAnZ3JlJzogJ2dyZScsICdlbGwnOiAnZWxsJywgJ2VuZyc6ICdlbmcnLCAnZXBvJzogJ2VwbycsICdzcGEnOiAnc3BhJyxcbiAgJ2VzdCc6ICdlc3QnLCAnYmFxJzogJ2JhcScsICdldXMnOiAnZXVzJywgJ3Blcic6ICdwZXInLCAnZmFzJzogJ2ZhcycsXG4gICdmdWwnOiAnZnVsJywgJ2Zpbic6ICdmaW4nLCAnZmlqJzogJ2ZpaicsICdmYW8nOiAnZmFvJywgJ2ZyZSc6ICdmcmUnLFxuICAnZnJhJzogJ2ZyYScsICdmcnknOiAnZnJ5JywgJ2dsZSc6ICdnbGUnLCAnZ2xhJzogJ2dsYScsICdnbGcnOiAnZ2xnJyxcbiAgJ2dybic6ICdncm4nLCAnZ3VqJzogJ2d1aicsICdnbHYnOiAnZ2x2JywgJ2hhdSc6ICdoYXUnLCAnaGViJzogJ2hlYicsXG4gICdoaW4nOiAnaGluJywgJ2htbyc6ICdobW8nLCAnaHJ2JzogJ2hydicsICdoYXQnOiAnaGF0JywgJ2h1bic6ICdodW4nLFxuICAnYXJtJzogJ2FybScsICdoeWUnOiAnaHllJywgJ2hlcic6ICdoZXInLCAnaW5hJzogJ2luYScsICdpbmQnOiAnaW5kJyxcbiAgJ2lsZSc6ICdpbGUnLCAnaWJvJzogJ2libycsICdpaWknOiAnaWlpJywgJ2lwayc6ICdpcGsnLCAnaWRvJzogJ2lkbycsXG4gICdpY2UnOiAnaWNlJywgJ2lzbCc6ICdpc2wnLCAnaXRhJzogJ2l0YScsICdpa3UnOiAnaWt1JywgJ2pwbic6ICdqcG4nLFxuICAnamF2JzogJ2phdicsICdnZW8nOiAnZ2VvJywgJ2thdCc6ICdrYXQnLCAna29uJzogJ2tvbicsICdraWsnOiAna2lrJyxcbiAgJ2t1YSc6ICdrdWEnLCAna2F6JzogJ2theicsICdrYWwnOiAna2FsJywgJ2tobSc6ICdraG0nLCAna2FuJzogJ2thbicsXG4gICdrb3InOiAna29yJywgJ2thdSc6ICdrYXUnLCAna2FzJzogJ2thcycsICdrdXInOiAna3VyJywgJ2tvbSc6ICdrb20nLFxuICAnY29yJzogJ2NvcicsICdraXInOiAna2lyJywgJ2xhdCc6ICdsYXQnLCAnbHR6JzogJ2x0eicsICdsdWcnOiAnbHVnJyxcbiAgJ2xpbSc6ICdsaW0nLCAnbGluJzogJ2xpbicsICdsYW8nOiAnbGFvJywgJ2xpdCc6ICdsaXQnLCAnbHViJzogJ2x1YicsXG4gICdsYXYnOiAnbGF2JywgJ21sZyc6ICdtbGcnLCAnbWFoJzogJ21haCcsICdtYW8nOiAnbWFvJywgJ21yaSc6ICdtcmknLFxuICAnbWFjJzogJ21hYycsICdta2QnOiAnbWtkJywgJ21hbCc6ICdtYWwnLCAnbW9uJzogJ21vbicsICdtb2wnOiAnbW9sJyxcbiAgJ21hcic6ICdtYXInLCAnbWF5JzogJ21heScsICdtc2EnOiAnbXNhJywgJ21sdCc6ICdtbHQnLCAnYnVyJzogJ2J1cicsXG4gICdteWEnOiAnbXlhJywgJ25hdSc6ICduYXUnLCAnbm9iJzogJ25vYicsICduZGUnOiAnbmRlJywgJ25lcCc6ICduZXAnLFxuICAnbmRvJzogJ25kbycsICdkdXQnOiAnZHV0JywgJ25sZCc6ICdubGQnLCAnbm5vJzogJ25ubycsICdub3InOiAnbm9yJyxcbiAgJ25ibCc6ICduYmwnLCAnbmF2JzogJ25hdicsICdueWEnOiAnbnlhJywgJ29jaSc6ICdvY2knLCAnb2ppJzogJ29qaScsXG4gICdvcm0nOiAnb3JtJywgJ29yaSc6ICdvcmknLCAnb3NzJzogJ29zcycsICdwYW4nOiAncGFuJywgJ3BsaSc6ICdwbGknLFxuICAncG9sJzogJ3BvbCcsICdwdXMnOiAncHVzJywgJ3Bvcic6ICdwb3InLCAncXVlJzogJ3F1ZScsICdyb2gnOiAncm9oJyxcbiAgJ3J1bic6ICdydW4nLCAncnVtJzogJ3J1bScsICdyb24nOiAncm9uJywgJ3J1cyc6ICdydXMnLCAna2luJzogJ2tpbicsXG4gICdzYW4nOiAnc2FuJywgJ3NyZCc6ICdzcmQnLCAnc25kJzogJ3NuZCcsICdzbWUnOiAnc21lJywgJ3NhZyc6ICdzYWcnLFxuICAnc2xvJzogJ3NsbycsICdzaW4nOiAnc2luJywgJ3Nsayc6ICdzbGsnLCAnc2x2JzogJ3NsdicsICdzbW8nOiAnc21vJyxcbiAgJ3NuYSc6ICdzbmEnLCAnc29tJzogJ3NvbScsICdhbGInOiAnYWxiJywgJ3NxaSc6ICdzcWknLCAnc3JwJzogJ3NycCcsXG4gICdzc3cnOiAnc3N3JywgJ3NvdCc6ICdzb3QnLCAnc3VuJzogJ3N1bicsICdzd2UnOiAnc3dlJywgJ3N3YSc6ICdzd2EnLFxuICAndGFtJzogJ3RhbScsICd0ZWwnOiAndGVsJywgJ3Rnayc6ICd0Z2snLCAndGhhJzogJ3RoYScsICd0aXInOiAndGlyJyxcbiAgJ3R1ayc6ICd0dWsnLCAndGdsJzogJ3RnbCcsICd0c24nOiAndHNuJywgJ3Rvbic6ICd0b24nLCAndHVyJzogJ3R1cicsXG4gICd0c28nOiAndHNvJywgJ3RhdCc6ICd0YXQnLCAndHdpJzogJ3R3aScsICd0YWgnOiAndGFoJywgJ3VpZyc6ICd1aWcnLFxuICAndWtyJzogJ3VrcicsICd1cmQnOiAndXJkJywgJ3V6Yic6ICd1emInLCAndmVuJzogJ3ZlbicsICd2aWUnOiAndmllJyxcbiAgJ3ZvbCc6ICd2b2wnLCAnd2xuJzogJ3dsbicsICd3b2wnOiAnd29sJywgJ3hobyc6ICd4aG8nLCAneWlkJzogJ3lpZCcsXG4gICd5b3InOiAneW9yJywgJ3poYSc6ICd6aGEnLCAnY2hpJzogJ2NoaScsICd6aG8nOiAnemhvJywgJ3p1bCc6ICd6dWwnLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgVmFsaWRMYW5ndWFnZXM7XG4iLCIvLyBAZmxvd1xuXG5jb25zdCBzY29ybTEyID0ge1xuICBDTUlTdHJpbmcyNTY6ICdeLnswLDI1NX0kJyxcbiAgQ01JU3RyaW5nNDA5NjogJ14uezAsNDA5Nn0kJyxcbiAgQ01JVGltZTogJ14oPzpbMDFdXFxcXGR8MlswMTIzXSk6KD86WzAxMjM0NV1cXFxcZCk6KD86WzAxMjM0NV1cXFxcZCkkJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlUaW1lc3BhbjogJ14oWzAtOV17Mix9KTooWzAtOV17Mn0pOihbMC05XXsyfSkoXFwuWzAtOV17MSwyfSk/JCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JSW50ZWdlcjogJ15cXFxcZCskJyxcbiAgQ01JU0ludGVnZXI6ICdeLT8oWzAtOV0rKSQnLFxuICBDTUlEZWNpbWFsOiAnXi0/KFswLTldezAsM30pKFxcLlswLTldKik/JCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JSWRlbnRpZmllcjogJ15bXFxcXHUwMDIxLVxcXFx1MDA3RV17MCwyNTV9JCcsXG4gIENNSUZlZWRiYWNrOiAnXi57MCwyNTV9JCcsIC8vIFRoaXMgbXVzdCBiZSByZWRlZmluZWRcbiAgQ01JSW5kZXg6ICdbLl9dKFxcXFxkKykuJyxcblxuICAvLyBWb2NhYnVsYXJ5IERhdGEgVHlwZSBEZWZpbml0aW9uXG4gIENNSVN0YXR1czogJ14ocGFzc2VkfGNvbXBsZXRlZHxmYWlsZWR8aW5jb21wbGV0ZXxicm93c2VkKSQnLFxuICBDTUlTdGF0dXMyOiAnXihwYXNzZWR8Y29tcGxldGVkfGZhaWxlZHxpbmNvbXBsZXRlfGJyb3dzZWR8bm90IGF0dGVtcHRlZCkkJyxcbiAgQ01JRXhpdDogJ14odGltZS1vdXR8c3VzcGVuZHxsb2dvdXR8KSQnLFxuICBDTUlUeXBlOiAnXih0cnVlLWZhbHNlfGNob2ljZXxmaWxsLWlufG1hdGNoaW5nfHBlcmZvcm1hbmNlfHNlcXVlbmNpbmd8bGlrZXJ0fG51bWVyaWMpJCcsXG4gIENNSVJlc3VsdDogJ14oY29ycmVjdHx3cm9uZ3x1bmFudGljaXBhdGVkfG5ldXRyYWx8KFswLTldezAsM30pPyhcXFxcLlswLTldKik/KSQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIE5BVkV2ZW50OiAnXihwcmV2aW91c3xjb250aW51ZSkkJyxcblxuICAvLyBEYXRhIHJhbmdlc1xuICBzY29yZV9yYW5nZTogJzAjMTAwJyxcbiAgYXVkaW9fcmFuZ2U6ICctMSMxMDAnLFxuICBzcGVlZF9yYW5nZTogJy0xMDAjMTAwJyxcbiAgd2VpZ2h0aW5nX3JhbmdlOiAnLTEwMCMxMDAnLFxuICB0ZXh0X3JhbmdlOiAnLTEjMScsXG59O1xuXG5jb25zdCBhaWNjID0ge1xuICAuLi5zY29ybTEyLCAuLi57XG4gICAgQ01JSWRlbnRpZmllcjogJ15cXFxcd3sxLDI1NX0kJyxcbiAgfSxcbn07XG5cbmNvbnN0IHNjb3JtMjAwNCA9IHtcbiAgQ01JU3RyaW5nMjAwOiAnXltcXFxcdTAwMDAtXFxcXHVGRkZGXXswLDIwMH0kJyxcbiAgQ01JU3RyaW5nMjUwOiAnXltcXFxcdTAwMDAtXFxcXHVGRkZGXXswLDI1MH0kJyxcbiAgQ01JU3RyaW5nMTAwMDogJ15bXFxcXHUwMDAwLVxcXFx1RkZGRl17MCwxMDAwfSQnLFxuICBDTUlTdHJpbmc0MDAwOiAnXltcXFxcdTAwMDAtXFxcXHVGRkZGXXswLDQwMDB9JCcsXG4gIENNSVN0cmluZzY0MDAwOiAnXltcXFxcdTAwMDAtXFxcXHVGRkZGXXswLDY0MDAwfSQnLFxuICBDTUlMYW5nOiAnXihbYS16QS1aXXsyLDN9fGl8eCkoXFwtW2EtekEtWjAtOVxcLV17Miw4fSk/JHxeJCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JTGFuZ1N0cmluZzI1MDogJ14oXFx7bGFuZz0oW2EtekEtWl17MiwzfXxpfHgpKFxcLVthLXpBLVowLTlcXC1dezIsOH0pP1xcfSk/KCg/IVxcey4qJCkuezAsMjUwfSQpPyQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUxhbmdjcjogJ14oKFxce2xhbmc9KFthLXpBLVpdezIsM318aXx4KT8oXFwtW2EtekEtWjAtOVxcLV17Miw4fSk/XFx9KSkoLio/KSQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUxhbmdTdHJpbmcyNTBjcjogJ14oKFxce2xhbmc9KFthLXpBLVpdezIsM318aXx4KT8oXFwtW2EtekEtWjAtOVxcLV17Miw4fSk/XFx9KT8oLnswLDI1MH0pPyk/JCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JTGFuZ1N0cmluZzQwMDA6ICdeKFxce2xhbmc9KFthLXpBLVpdezIsM318aXx4KShcXC1bYS16QS1aMC05XFwtXXsyLDh9KT9cXH0pPygoPyFcXHsuKiQpLnswLDQwMDB9JCk/JCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JVGltZTogJ14oMTlbNy05XXsxfVswLTldezF9fDIwWzAtMl17MX1bMC05XXsxfXwyMDNbMC04XXsxfSkoKC0oMFsxLTldezF9fDFbMC0yXXsxfSkpKCgtKDBbMS05XXsxfXxbMS0yXXsxfVswLTldezF9fDNbMC0xXXsxfSkpKFQoWzAtMV17MX1bMC05XXsxfXwyWzAtM117MX0pKCg6WzAtNV17MX1bMC05XXsxfSkoKDpbMC01XXsxfVswLTldezF9KSgoXFxcXC5bMC05XXsxLDJ9KSgoWnwoWyt8LV0oWzAtMV17MX1bMC05XXsxfXwyWzAtM117MX0pKSkoOlswLTVdezF9WzAtOV17MX0pPyk/KT8pPyk/KT8pPyk/JCcsXG4gIENNSVRpbWVzcGFuOiAnXlAoPzooWy4sXFxcXGRdKylZKT8oPzooWy4sXFxcXGRdKylNKT8oPzooWy4sXFxcXGRdKylXKT8oPzooWy4sXFxcXGRdKylEKT8oPzpUPyg/OihbLixcXFxcZF0rKUgpPyg/OihbLixcXFxcZF0rKU0pPyg/OihbLixcXFxcZF0rKVMpPyk/JCcsXG4gIENNSUludGVnZXI6ICdeXFxcXGQrJCcsXG4gIENNSVNJbnRlZ2VyOiAnXi0/KFswLTldKykkJyxcbiAgQ01JRGVjaW1hbDogJ14tPyhbMC05XXsxLDV9KShcXFxcLlswLTldezEsMTh9KT8kJyxcbiAgQ01JSWRlbnRpZmllcjogJ15cXFxcU3sxLDI1MH1bYS16QS1aMC05XSQnLFxuICBDTUlTaG9ydElkZW50aWZpZXI6ICdeW1xcXFx3XFxcXC5cXFxcLVxcXFxfXXsxLDI1MH0kJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlMb25nSWRlbnRpZmllcjogJ14oPzooPyF1cm46KVxcXFxTezEsNDAwMH18dXJuOltBLVphLXowLTktXXsxLDMxfTpcXFxcU3sxLDQwMDB9fC57MSw0MDAwfSkkJywgLy8gbmVlZCB0byByZS1leGFtaW5lIHRoaXNcbiAgQ01JRmVlZGJhY2s6ICdeLiokJywgLy8gVGhpcyBtdXN0IGJlIHJlZGVmaW5lZFxuICBDTUlJbmRleDogJ1suX10oXFxcXGQrKS4nLFxuICBDTUlJbmRleFN0b3JlOiAnLk4oXFxcXGQrKS4nLFxuXG4gIC8vIFZvY2FidWxhcnkgRGF0YSBUeXBlIERlZmluaXRpb25cbiAgQ01JQ1N0YXR1czogJ14oY29tcGxldGVkfGluY29tcGxldGV8bm90IGF0dGVtcHRlZHx1bmtub3duKSQnLFxuICBDTUlTU3RhdHVzOiAnXihwYXNzZWR8ZmFpbGVkfHVua25vd24pJCcsXG4gIENNSUV4aXQ6ICdeKHRpbWUtb3V0fHN1c3BlbmR8bG9nb3V0fG5vcm1hbCkkJyxcbiAgQ01JVHlwZTogJ14odHJ1ZS1mYWxzZXxjaG9pY2V8ZmlsbC1pbnxsb25nLWZpbGwtaW58bWF0Y2hpbmd8cGVyZm9ybWFuY2V8c2VxdWVuY2luZ3xsaWtlcnR8bnVtZXJpY3xvdGhlcikkJyxcbiAgQ01JUmVzdWx0OiAnXihjb3JyZWN0fHdyb25nfHVuYW50aWNpcGF0ZWR8bmV1dHJhbHwtPyhbMC05XXsxLDR9KShcXFxcLlswLTldezEsMTh9KT8pJCcsXG4gIE5BVkV2ZW50OiAnXihwcmV2aW91c3xjb250aW51ZXxleGl0fGV4aXRBbGx8YWJhbmRvbnxhYmFuZG9uQWxsfHN1c3BlbmRBbGx8XFx7dGFyZ2V0PVxcXFxTezAsMjAwfVthLXpBLVowLTldXFx9Y2hvaWNlfGp1bXApJCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgTkFWQm9vbGVhbjogJ14odW5rbm93bnx0cnVlfGZhbHNlJCknLFxuICBOQVZUYXJnZXQ6ICdeKHByZXZpb3VzfGNvbnRpbnVlfGNob2ljZS57dGFyZ2V0PVxcXFxTezAsMjAwfVthLXpBLVowLTldfSkkJyxcblxuICAvLyBEYXRhIHJhbmdlc1xuICBzY2FsZWRfcmFuZ2U6ICctMSMxJyxcbiAgYXVkaW9fcmFuZ2U6ICcwIyonLFxuICBzcGVlZF9yYW5nZTogJzAjKicsXG4gIHRleHRfcmFuZ2U6ICctMSMxJyxcbiAgcHJvZ3Jlc3NfcmFuZ2U6ICcwIzEnLFxufTtcblxuY29uc3QgUmVnZXggPSB7XG4gIGFpY2M6IGFpY2MsXG4gIHNjb3JtMTI6IHNjb3JtMTIsXG4gIHNjb3JtMjAwNDogc2Nvcm0yMDA0LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgUmVnZXg7XG4iLCIvLyBAZmxvd1xuaW1wb3J0IFJlZ2V4IGZyb20gJy4vcmVnZXgnO1xuXG5jb25zdCBzY29ybTIwMDRfcmVnZXggPSBSZWdleC5zY29ybTIwMDQ7XG5cbmNvbnN0IGxlYXJuZXIgPSB7XG4gICd0cnVlLWZhbHNlJzoge1xuICAgIGZvcm1hdDogJ150cnVlJHxeZmFsc2UkJyxcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAnY2hvaWNlJzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBtYXg6IDM2LFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgdW5pcXVlOiB0cnVlLFxuICB9LFxuICAnZmlsbC1pbic6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nU3RyaW5nMjUwLFxuICAgIG1heDogMTAsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAnbG9uZy1maWxsLWluJzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSUxhbmdTdHJpbmc0MDAwLFxuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG4gICdtYXRjaGluZyc6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgZm9ybWF0Mjogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBtYXg6IDM2LFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgZGVsaW1pdGVyMjogJ1suXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ3BlcmZvcm1hbmNlJzoge1xuICAgIGZvcm1hdDogJ14kfCcgKyBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIGZvcm1hdDI6IHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsICsgJ3xeJHwnICtcbiAgICAgICAgc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBtYXg6IDI1MCxcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIGRlbGltaXRlcjI6ICdbLl0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG4gICdzZXF1ZW5jaW5nJzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBtYXg6IDM2LFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ2xpa2VydCc6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ251bWVyaWMnOiB7XG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCxcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAnb3RoZXInOiB7XG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU3RyaW5nNDAwMCxcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxufTtcblxuY29uc3QgY29ycmVjdCA9IHtcbiAgJ3RydWUtZmFsc2UnOiB7XG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogJ150cnVlJHxeZmFsc2UkJyxcbiAgICBsaW1pdDogMSxcbiAgfSxcbiAgJ2Nob2ljZSc6IHtcbiAgICBtYXg6IDM2LFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgdW5pcXVlOiB0cnVlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICB9LFxuICAnZmlsbC1pbic6IHtcbiAgICBtYXg6IDEwLFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSUxhbmdTdHJpbmcyNTBjcixcbiAgfSxcbiAgJ2xvbmctZmlsbC1pbic6IHtcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogdHJ1ZSxcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nU3RyaW5nNDAwMCxcbiAgfSxcbiAgJ21hdGNoaW5nJzoge1xuICAgIG1heDogMzYsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICBkZWxpbWl0ZXIyOiAnWy5dJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIGZvcm1hdDI6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gIH0sXG4gICdwZXJmb3JtYW5jZSc6IHtcbiAgICBtYXg6IDI1MCxcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIGRlbGltaXRlcjI6ICdbLl0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6ICdeJHwnICsgc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBmb3JtYXQyOiBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCArICd8XiR8JyArXG4gICAgICAgIHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gIH0sXG4gICdzZXF1ZW5jaW5nJzoge1xuICAgIG1heDogMzYsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICB9LFxuICAnbGlrZXJ0Jzoge1xuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgbGltaXQ6IDEsXG4gIH0sXG4gICdudW1lcmljJzoge1xuICAgIG1heDogMixcbiAgICBkZWxpbWl0ZXI6ICdbOl0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsLFxuICAgIGxpbWl0OiAxLFxuICB9LFxuICAnb3RoZXInOiB7XG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVN0cmluZzQwMDAsXG4gICAgbGltaXQ6IDEsXG4gIH0sXG59O1xuXG5jb25zdCBSZXNwb25zZXMgPSB7XG4gIGxlYXJuZXI6IGxlYXJuZXIsXG4gIGNvcnJlY3Q6IGNvcnJlY3QsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZXNwb25zZXM7XG4iLCIvLyBAZmxvd1xuXG4vKipcbiAqIERhdGEgVmFsaWRhdGlvbiBFeGNlcHRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIFZhbGlkYXRpb25FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIHRvIHRha2UgaW4gYW4gZXJyb3IgbWVzc2FnZSBhbmQgY29kZVxuICAgKiBAcGFyYW0ge251bWJlcn0gZXJyb3JDb2RlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlcnJvckNvZGU6IG51bWJlcikge1xuICAgIHN1cGVyKGVycm9yQ29kZSk7XG4gICAgdGhpcy4jZXJyb3JDb2RlID0gZXJyb3JDb2RlO1xuICB9XG5cbiAgI2Vycm9yQ29kZTtcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZXJyb3JDb2RlXG4gICAqIEByZXR1cm4ge251bWJlcn1cbiAgICovXG4gIGdldCBlcnJvckNvZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2Vycm9yQ29kZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcnlpbmcgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgRXJyb3IgbWVzc2FnZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbWVzc2FnZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jZXJyb3JDb2RlICsgJyc7XG4gIH1cbn1cbiIsImltcG9ydCBTY29ybTIwMDRBUEkgZnJvbSAnLi9TY29ybTIwMDRBUEknO1xuaW1wb3J0IFNjb3JtMTJBUEkgZnJvbSAnLi9TY29ybTEyQVBJJztcbmltcG9ydCBBSUNDIGZyb20gJy4vQUlDQyc7XG5cbndpbmRvdy5TY29ybTEyQVBJID0gU2Nvcm0xMkFQSTtcbndpbmRvdy5TY29ybTIwMDRBUEkgPSBTY29ybTIwMDRBUEk7XG53aW5kb3cuQUlDQyA9IEFJQ0M7XG4iLCIvLyBAZmxvd1xuZXhwb3J0IGNvbnN0IFNFQ09ORFNfUEVSX1NFQ09ORCA9IDEuMDtcbmV4cG9ydCBjb25zdCBTRUNPTkRTX1BFUl9NSU5VVEUgPSA2MDtcbmV4cG9ydCBjb25zdCBTRUNPTkRTX1BFUl9IT1VSID0gNjAgKiBTRUNPTkRTX1BFUl9NSU5VVEU7XG5leHBvcnQgY29uc3QgU0VDT05EU19QRVJfREFZID0gMjQgKiBTRUNPTkRTX1BFUl9IT1VSO1xuXG5jb25zdCBkZXNpZ25hdGlvbnMgPSBbXG4gIFsnRCcsIFNFQ09ORFNfUEVSX0RBWV0sXG4gIFsnSCcsIFNFQ09ORFNfUEVSX0hPVVJdLFxuICBbJ00nLCBTRUNPTkRTX1BFUl9NSU5VVEVdLFxuICBbJ1MnLCBTRUNPTkRTX1BFUl9TRUNPTkRdLFxuXTtcblxuLyoqXG4gKiBDb252ZXJ0cyBhIE51bWJlciB0byBhIFN0cmluZyBvZiBISDpNTTpTU1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB0b3RhbFNlY29uZHNcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNlY29uZHNBc0hITU1TUyh0b3RhbFNlY29uZHM6IE51bWJlcikge1xuICAvLyBTQ09STSBzcGVjIGRvZXMgbm90IGRlYWwgd2l0aCBuZWdhdGl2ZSBkdXJhdGlvbnMsIGdpdmUgemVybyBiYWNrXG4gIGlmICghdG90YWxTZWNvbmRzIHx8IHRvdGFsU2Vjb25kcyA8PSAwKSB7XG4gICAgcmV0dXJuICcwMDowMDowMCc7XG4gIH1cblxuICBjb25zdCBob3VycyA9IE1hdGguZmxvb3IodG90YWxTZWNvbmRzIC8gU0VDT05EU19QRVJfSE9VUik7XG5cbiAgY29uc3QgZGF0ZU9iaiA9IG5ldyBEYXRlKHRvdGFsU2Vjb25kcyAqIDEwMDApO1xuICBjb25zdCBtaW51dGVzID0gZGF0ZU9iai5nZXRVVENNaW51dGVzKCk7XG4gIC8vIG1ha2Ugc3VyZSB3ZSBhZGQgYW55IHBvc3NpYmxlIGRlY2ltYWwgdmFsdWVcbiAgY29uc3Qgc2Vjb25kcyA9IGRhdGVPYmouZ2V0U2Vjb25kcygpO1xuICBjb25zdCBtcyA9IHRvdGFsU2Vjb25kcyAlIDEuMDtcbiAgbGV0IG1zU3RyID0gJyc7XG4gIGlmIChjb3VudERlY2ltYWxzKG1zKSA+IDApIHtcbiAgICBpZiAoY291bnREZWNpbWFscyhtcykgPiAyKSB7XG4gICAgICBtc1N0ciA9IG1zLnRvRml4ZWQoMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1zU3RyID0gU3RyaW5nKG1zKTtcbiAgICB9XG4gICAgbXNTdHIgPSAnLicgKyBtc1N0ci5zcGxpdCgnLicpWzFdO1xuICB9XG5cbiAgcmV0dXJuIChob3VycyArICc6JyArIG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzKS5yZXBsYWNlKC9cXGJcXGRcXGIvZyxcbiAgICAgICcwJCYnKSArIG1zU3RyO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZSB0aGUgbnVtYmVyIG9mIHNlY29uZHMgZnJvbSBJU08gODYwMSBEdXJhdGlvblxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBzZWNvbmRzXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZWNvbmRzQXNJU09EdXJhdGlvbihzZWNvbmRzOiBOdW1iZXIpIHtcbiAgLy8gU0NPUk0gc3BlYyBkb2VzIG5vdCBkZWFsIHdpdGggbmVnYXRpdmUgZHVyYXRpb25zLCBnaXZlIHplcm8gYmFja1xuICBpZiAoIXNlY29uZHMgfHwgc2Vjb25kcyA8PSAwKSB7XG4gICAgcmV0dXJuICdQVDBTJztcbiAgfVxuXG4gIGxldCBkdXJhdGlvbiA9ICdQJztcbiAgbGV0IHJlbWFpbmRlciA9IHNlY29uZHM7XG5cbiAgZGVzaWduYXRpb25zLmZvckVhY2goKFtzaWduLCBjdXJyZW50X3NlY29uZHNdKSA9PiB7XG4gICAgbGV0IHZhbHVlID0gTWF0aC5mbG9vcihyZW1haW5kZXIgLyBjdXJyZW50X3NlY29uZHMpO1xuXG4gICAgcmVtYWluZGVyID0gcmVtYWluZGVyICUgY3VycmVudF9zZWNvbmRzO1xuICAgIGlmIChjb3VudERlY2ltYWxzKHJlbWFpbmRlcikgPiAyKSB7XG4gICAgICByZW1haW5kZXIgPSBOdW1iZXIoTnVtYmVyKHJlbWFpbmRlcikudG9GaXhlZCgyKSk7XG4gICAgfVxuICAgIC8vIElmIHdlIGhhdmUgYW55dGhpbmcgbGVmdCBpbiB0aGUgcmVtYWluZGVyLCBhbmQgd2UncmUgY3VycmVudGx5IGFkZGluZ1xuICAgIC8vIHNlY29uZHMgdG8gdGhlIGR1cmF0aW9uLCBnbyBhaGVhZCBhbmQgYWRkIHRoZSBkZWNpbWFsIHRvIHRoZSBzZWNvbmRzXG4gICAgaWYgKHNpZ24gPT09ICdTJyAmJiByZW1haW5kZXIgPiAwKSB7XG4gICAgICB2YWx1ZSArPSByZW1haW5kZXI7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBpZiAoKGR1cmF0aW9uLmluZGV4T2YoJ0QnKSA+IDAgfHxcbiAgICAgICAgICBzaWduID09PSAnSCcgfHwgc2lnbiA9PT0gJ00nIHx8IHNpZ24gPT09ICdTJykgJiZcbiAgICAgICAgICBkdXJhdGlvbi5pbmRleE9mKCdUJykgPT09IC0xKSB7XG4gICAgICAgIGR1cmF0aW9uICs9ICdUJztcbiAgICAgIH1cbiAgICAgIGR1cmF0aW9uICs9IGAke3ZhbHVlfSR7c2lnbn1gO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGR1cmF0aW9uO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZSB0aGUgbnVtYmVyIG9mIHNlY29uZHMgZnJvbSBISDpNTTpTUy5ERERERERcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGltZVN0cmluZ1xuICogQHBhcmFtIHtSZWdFeHB9IHRpbWVSZWdleFxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGltZUFzU2Vjb25kcyh0aW1lU3RyaW5nOiBTdHJpbmcsIHRpbWVSZWdleDogUmVnRXhwKSB7XG4gIGlmICghdGltZVN0cmluZyB8fCB0eXBlb2YgdGltZVN0cmluZyAhPT0gJ3N0cmluZycgfHxcbiAgICAgICF0aW1lU3RyaW5nLm1hdGNoKHRpbWVSZWdleCkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICBjb25zdCBwYXJ0cyA9IHRpbWVTdHJpbmcuc3BsaXQoJzonKTtcbiAgY29uc3QgaG91cnMgPSBOdW1iZXIocGFydHNbMF0pO1xuICBjb25zdCBtaW51dGVzID0gTnVtYmVyKHBhcnRzWzFdKTtcbiAgY29uc3Qgc2Vjb25kcyA9IE51bWJlcihwYXJ0c1syXSk7XG4gIHJldHVybiAoaG91cnMgKiAzNjAwKSArIChtaW51dGVzICogNjApICsgc2Vjb25kcztcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgdGhlIG51bWJlciBvZiBzZWNvbmRzIGZyb20gSVNPIDg2MDEgRHVyYXRpb25cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZHVyYXRpb25cbiAqIEBwYXJhbSB7UmVnRXhwfSBkdXJhdGlvblJlZ2V4XG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXREdXJhdGlvbkFzU2Vjb25kcyhkdXJhdGlvbjogU3RyaW5nLCBkdXJhdGlvblJlZ2V4OiBSZWdFeHApIHtcbiAgaWYgKCFkdXJhdGlvbiB8fCAhZHVyYXRpb24ubWF0Y2goZHVyYXRpb25SZWdleCkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGNvbnN0IFssIHllYXJzLCBtb250aHMsICwgZGF5cywgaG91cnMsIG1pbnV0ZXMsIHNlY29uZHNdID0gbmV3IFJlZ0V4cChcbiAgICAgIGR1cmF0aW9uUmVnZXgpLmV4ZWMoZHVyYXRpb24pIHx8IFtdO1xuXG4gIGxldCByZXN1bHQgPSAwLjA7XG5cbiAgcmVzdWx0ICs9IChOdW1iZXIoc2Vjb25kcykgKiAxLjAgfHwgMC4wKTtcbiAgcmVzdWx0ICs9IChOdW1iZXIobWludXRlcykgKiA2MC4wIHx8IDAuMCk7XG4gIHJlc3VsdCArPSAoTnVtYmVyKGhvdXJzKSAqIDM2MDAuMCB8fCAwLjApO1xuICByZXN1bHQgKz0gKE51bWJlcihkYXlzKSAqICg2MCAqIDYwICogMjQuMCkgfHwgMC4wKTtcbiAgcmVzdWx0ICs9IChOdW1iZXIoeWVhcnMpICogKDYwICogNjAgKiAyNCAqIDM2NS4wKSB8fCAwLjApO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQWRkcyB0b2dldGhlciB0d28gSVNPODYwMSBEdXJhdGlvbiBzdHJpbmdzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGZpcnN0XG4gKiBAcGFyYW0ge3N0cmluZ30gc2Vjb25kXG4gKiBAcGFyYW0ge1JlZ0V4cH0gZHVyYXRpb25SZWdleFxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkVHdvRHVyYXRpb25zKFxuICAgIGZpcnN0OiBTdHJpbmcsXG4gICAgc2Vjb25kOiBTdHJpbmcsXG4gICAgZHVyYXRpb25SZWdleDogUmVnRXhwKSB7XG4gIHJldHVybiBnZXRTZWNvbmRzQXNJU09EdXJhdGlvbihcbiAgICAgIGdldER1cmF0aW9uQXNTZWNvbmRzKGZpcnN0LCBkdXJhdGlvblJlZ2V4KSArXG4gICAgICBnZXREdXJhdGlvbkFzU2Vjb25kcyhzZWNvbmQsIGR1cmF0aW9uUmVnZXgpLFxuICApO1xufVxuXG4vKipcbiAqIEFkZCB0b2dldGhlciB0d28gSEg6TU06U1MuREQgc3RyaW5nc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaXJzdFxuICogQHBhcmFtIHtzdHJpbmd9IHNlY29uZFxuICogQHBhcmFtIHtSZWdFeHB9IHRpbWVSZWdleFxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkSEhNTVNTVGltZVN0cmluZ3MoXG4gICAgZmlyc3Q6IFN0cmluZyxcbiAgICBzZWNvbmQ6IFN0cmluZyxcbiAgICB0aW1lUmVnZXg6IFJlZ0V4cCkge1xuICByZXR1cm4gZ2V0U2Vjb25kc0FzSEhNTVNTKFxuICAgICAgZ2V0VGltZUFzU2Vjb25kcyhmaXJzdCwgdGltZVJlZ2V4KSArXG4gICAgICBnZXRUaW1lQXNTZWNvbmRzKFxuICAgICAgICAgIHNlY29uZCwgdGltZVJlZ2V4KSxcbiAgKTtcbn1cblxuLyoqXG4gKiBGbGF0dGVuIGEgSlNPTiBvYmplY3QgZG93biB0byBzdHJpbmcgcGF0aHMgZm9yIGVhY2ggdmFsdWVzXG4gKiBAcGFyYW0ge29iamVjdH0gZGF0YVxuICogQHJldHVybiB7b2JqZWN0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmxhdHRlbihkYXRhKSB7XG4gIGNvbnN0IHJlc3VsdCA9IHt9O1xuXG4gIC8qKlxuICAgKiBSZWN1cnNlIHRocm91Z2ggdGhlIG9iamVjdFxuICAgKiBAcGFyYW0geyp9IGN1clxuICAgKiBAcGFyYW0geyp9IHByb3BcbiAgICovXG4gIGZ1bmN0aW9uIHJlY3Vyc2UoY3VyLCBwcm9wKSB7XG4gICAgaWYgKE9iamVjdChjdXIpICE9PSBjdXIpIHtcbiAgICAgIHJlc3VsdFtwcm9wXSA9IGN1cjtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoY3VyKSkge1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBjdXIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHJlY3Vyc2UoY3VyW2ldLCBwcm9wICsgJ1snICsgaSArICddJyk7XG4gICAgICAgIGlmIChsID09PSAwKSByZXN1bHRbcHJvcF0gPSBbXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGlzRW1wdHkgPSB0cnVlO1xuICAgICAgZm9yIChjb25zdCBwIGluIGN1cikge1xuICAgICAgICBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChjdXIsIHApKSB7XG4gICAgICAgICAgaXNFbXB0eSA9IGZhbHNlO1xuICAgICAgICAgIHJlY3Vyc2UoY3VyW3BdLCBwcm9wID8gcHJvcCArICcuJyArIHAgOiBwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGlzRW1wdHkgJiYgcHJvcCkgcmVzdWx0W3Byb3BdID0ge307XG4gICAgfVxuICB9XG5cbiAgcmVjdXJzZShkYXRhLCAnJyk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVW4tZmxhdHRlbiBhIGZsYXQgSlNPTiBvYmplY3RcbiAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmZsYXR0ZW4oZGF0YSkge1xuICAndXNlIHN0cmljdCc7XG4gIGlmIChPYmplY3QoZGF0YSkgIT09IGRhdGEgfHwgQXJyYXkuaXNBcnJheShkYXRhKSkgcmV0dXJuIGRhdGE7XG4gIGNvbnN0IHJlZ2V4ID0gL1xcLj8oW14uW1xcXV0rKXxcXFsoXFxkKyldL2c7XG4gIGNvbnN0IHJlc3VsdCA9IHt9O1xuICBmb3IgKGNvbnN0IHAgaW4gZGF0YSkge1xuICAgIGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIHApKSB7XG4gICAgICBsZXQgY3VyID0gcmVzdWx0O1xuICAgICAgbGV0IHByb3AgPSAnJztcbiAgICAgIGxldCBtID0gcmVnZXguZXhlYyhwKTtcbiAgICAgIHdoaWxlIChtKSB7XG4gICAgICAgIGN1ciA9IGN1cltwcm9wXSB8fCAoY3VyW3Byb3BdID0gKG1bMl0gPyBbXSA6IHt9KSk7XG4gICAgICAgIHByb3AgPSBtWzJdIHx8IG1bMV07XG4gICAgICAgIG0gPSByZWdleC5leGVjKHApO1xuICAgICAgfVxuICAgICAgY3VyW3Byb3BdID0gZGF0YVtwXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdFsnJ10gfHwgcmVzdWx0O1xufVxuXG4vKipcbiAqIENvdW50cyB0aGUgbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtXG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb3VudERlY2ltYWxzKG51bTogbnVtYmVyKSB7XG4gIGlmIChNYXRoLmZsb29yKG51bSkgPT09IG51bSB8fCBTdHJpbmcobnVtKS5pbmRleE9mKCcuJykgPCAwKSByZXR1cm4gMDtcbiAgY29uc3QgcGFydHMgPSBudW0udG9TdHJpbmcoKS5zcGxpdCgnLicpWzFdO1xuICByZXR1cm4gcGFydHMubGVuZ3RoIHx8IDA7XG59XG4iXX0=
