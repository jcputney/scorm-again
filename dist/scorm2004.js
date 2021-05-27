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

},{"./cmi/common":4,"./constants/api_constants":6,"./constants/error_codes":7,"./exceptions":11,"./utilities":13,"lodash.debounce":1}],3:[function(require,module,exports){
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

      if (this.apiLogLevel === global_constants.LOG_LEVEL_DEBUG) {
        console.debug('Commit (terminated: ' + (terminateCommit ? 'yes' : 'no') + '): ');
        console.debug(commitObject);
      }

      if (this.settings.lmsCommitUrl) {
        var result = this.processHttpRequest(this.settings.lmsCommitUrl, commitObject, terminateCommit); // check if this is a sequencing call, and then call the necessary JS

        {
          if (navRequest && result.navRequest !== undefined && result.navRequest !== '') {
            Function("\"use strict\";(() => { ".concat(result.navRequest, " })()"))();
          }
        }
        return result;
      } else {
        return global_constants.SCORM_TRUE;
      }
    }
  }]);

  return Scorm2004API;
}(_BaseAPI2["default"]);

exports["default"] = Scorm2004API;

},{"./BaseAPI":2,"./cmi/scorm2004_cmi":5,"./constants/api_constants":6,"./constants/error_codes":7,"./constants/language_constants":8,"./constants/regex":9,"./constants/response_constants":10,"./utilities":13}],4:[function(require,module,exports){
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

},{"../constants/api_constants":6,"../constants/error_codes":7,"../constants/regex":9}],5:[function(require,module,exports){
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

},{"../constants/api_constants":6,"../constants/error_codes":7,"../constants/regex":9,"../constants/response_constants":10,"../exceptions":11,"../utilities":13,"./common":4}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{"./regex":9}],11:[function(require,module,exports){
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

},{"./constants/api_constants":6}],12:[function(require,module,exports){
"use strict";

var _Scorm2004API = _interopRequireDefault(require("../Scorm2004API"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

window.Scorm2004API = _Scorm2004API["default"];

},{"../Scorm2004API":3}],13:[function(require,module,exports){
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

},{}]},{},[12])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlYm91bmNlL2luZGV4LmpzIiwic3JjL0Jhc2VBUEkuanMiLCJzcmMvU2Nvcm0yMDA0QVBJLmpzIiwic3JjL2NtaS9jb21tb24uanMiLCJzcmMvY21pL3Njb3JtMjAwNF9jbWkuanMiLCJzcmMvY29uc3RhbnRzL2FwaV9jb25zdGFudHMuanMiLCJzcmMvY29uc3RhbnRzL2Vycm9yX2NvZGVzLmpzIiwic3JjL2NvbnN0YW50cy9sYW5ndWFnZV9jb25zdGFudHMuanMiLCJzcmMvY29uc3RhbnRzL3JlZ2V4LmpzIiwic3JjL2NvbnN0YW50cy9yZXNwb25zZV9jb25zdGFudHMuanMiLCJzcmMvZXhjZXB0aW9ucy5qcyIsInNyYy9leHBvcnRzL3Njb3JtMjAwNC5qcyIsInNyYy91dGlsaXRpZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogbG9kYXNoIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcXVlcnkub3JnLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogVXNlZCBhcyB0aGUgYFR5cGVFcnJvcmAgbWVzc2FnZSBmb3IgXCJGdW5jdGlvbnNcIiBtZXRob2RzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW0gPSAvXlxccyt8XFxzKyQvZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJhZCBzaWduZWQgaGV4YWRlY2ltYWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiaW5hcnkgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb2N0YWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pO1xuXG4vKiogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgd2l0aG91dCBhIGRlcGVuZGVuY3kgb24gYHJvb3RgLiAqL1xudmFyIGZyZWVQYXJzZUludCA9IHBhcnNlSW50O1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogR2V0cyB0aGUgdGltZXN0YW1wIG9mIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgaGF2ZSBlbGFwc2VkIHNpbmNlXG4gKiB0aGUgVW5peCBlcG9jaCAoMSBKYW51YXJ5IDE5NzAgMDA6MDA6MDAgVVRDKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgRGF0ZVxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgdGltZXN0YW1wLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmVyKGZ1bmN0aW9uKHN0YW1wKSB7XG4gKiAgIGNvbnNvbGUubG9nKF8ubm93KCkgLSBzdGFtcCk7XG4gKiB9LCBfLm5vdygpKTtcbiAqIC8vID0+IExvZ3MgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgaXQgdG9vayBmb3IgdGhlIGRlZmVycmVkIGludm9jYXRpb24uXG4gKi9cbnZhciBub3cgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHJvb3QuRGF0ZS5ub3coKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRlYm91bmNlZCBmdW5jdGlvbiB0aGF0IGRlbGF5cyBpbnZva2luZyBgZnVuY2AgdW50aWwgYWZ0ZXIgYHdhaXRgXG4gKiBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB3YXNcbiAqIGludm9rZWQuIFRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgIG1ldGhvZCB0byBjYW5jZWxcbiAqIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLlxuICogUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2Agc2hvdWxkIGJlIGludm9rZWQgb24gdGhlXG4gKiBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkXG4gKiB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50XG4gKiBjYWxscyB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYFxuICogaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIGRlYm91bmNlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy5kZWJvdW5jZWAgYW5kIGBfLnRocm90dGxlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlYm91bmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9ZmFsc2VdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFdhaXRdXG4gKiAgVGhlIG1heGltdW0gdGltZSBgZnVuY2AgaXMgYWxsb3dlZCB0byBiZSBkZWxheWVkIGJlZm9yZSBpdCdzIGludm9rZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGRlYm91bmNlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgY29zdGx5IGNhbGN1bGF0aW9ucyB3aGlsZSB0aGUgd2luZG93IHNpemUgaXMgaW4gZmx1eC5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCBfLmRlYm91bmNlKGNhbGN1bGF0ZUxheW91dCwgMTUwKSk7XG4gKlxuICogLy8gSW52b2tlIGBzZW5kTWFpbGAgd2hlbiBjbGlja2VkLCBkZWJvdW5jaW5nIHN1YnNlcXVlbnQgY2FsbHMuXG4gKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgXy5kZWJvdW5jZShzZW5kTWFpbCwgMzAwLCB7XG4gKiAgICdsZWFkaW5nJzogdHJ1ZSxcbiAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAqIH0pKTtcbiAqXG4gKiAvLyBFbnN1cmUgYGJhdGNoTG9nYCBpcyBpbnZva2VkIG9uY2UgYWZ0ZXIgMSBzZWNvbmQgb2YgZGVib3VuY2VkIGNhbGxzLlxuICogdmFyIGRlYm91bmNlZCA9IF8uZGVib3VuY2UoYmF0Y2hMb2csIDI1MCwgeyAnbWF4V2FpdCc6IDEwMDAgfSk7XG4gKiB2YXIgc291cmNlID0gbmV3IEV2ZW50U291cmNlKCcvc3RyZWFtJyk7XG4gKiBqUXVlcnkoc291cmNlKS5vbignbWVzc2FnZScsIGRlYm91bmNlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyBkZWJvdW5jZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGRlYm91bmNlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsYXN0QXJncyxcbiAgICAgIGxhc3RUaGlzLFxuICAgICAgbWF4V2FpdCxcbiAgICAgIHJlc3VsdCxcbiAgICAgIHRpbWVySWQsXG4gICAgICBsYXN0Q2FsbFRpbWUsXG4gICAgICBsYXN0SW52b2tlVGltZSA9IDAsXG4gICAgICBsZWFkaW5nID0gZmFsc2UsXG4gICAgICBtYXhpbmcgPSBmYWxzZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB3YWl0ID0gdG9OdW1iZXIod2FpdCkgfHwgMDtcbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICEhb3B0aW9ucy5sZWFkaW5nO1xuICAgIG1heGluZyA9ICdtYXhXYWl0JyBpbiBvcHRpb25zO1xuICAgIG1heFdhaXQgPSBtYXhpbmcgPyBuYXRpdmVNYXgodG9OdW1iZXIob3B0aW9ucy5tYXhXYWl0KSB8fCAwLCB3YWl0KSA6IG1heFdhaXQ7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGludm9rZUZ1bmModGltZSkge1xuICAgIHZhciBhcmdzID0gbGFzdEFyZ3MsXG4gICAgICAgIHRoaXNBcmcgPSBsYXN0VGhpcztcblxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlYWRpbmdFZGdlKHRpbWUpIHtcbiAgICAvLyBSZXNldCBhbnkgYG1heFdhaXRgIHRpbWVyLlxuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICAvLyBTdGFydCB0aGUgdGltZXIgZm9yIHRoZSB0cmFpbGluZyBlZGdlLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgLy8gSW52b2tlIHRoZSBsZWFkaW5nIGVkZ2UuXG4gICAgcmV0dXJuIGxlYWRpbmcgPyBpbnZva2VGdW5jKHRpbWUpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtYWluaW5nV2FpdCh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZSxcbiAgICAgICAgcmVzdWx0ID0gd2FpdCAtIHRpbWVTaW5jZUxhc3RDYWxsO1xuXG4gICAgcmV0dXJuIG1heGluZyA/IG5hdGl2ZU1pbihyZXN1bHQsIG1heFdhaXQgLSB0aW1lU2luY2VMYXN0SW52b2tlKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZEludm9rZSh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZTtcblxuICAgIC8vIEVpdGhlciB0aGlzIGlzIHRoZSBmaXJzdCBjYWxsLCBhY3Rpdml0eSBoYXMgc3RvcHBlZCBhbmQgd2UncmUgYXQgdGhlXG4gICAgLy8gdHJhaWxpbmcgZWRnZSwgdGhlIHN5c3RlbSB0aW1lIGhhcyBnb25lIGJhY2t3YXJkcyBhbmQgd2UncmUgdHJlYXRpbmdcbiAgICAvLyBpdCBhcyB0aGUgdHJhaWxpbmcgZWRnZSwgb3Igd2UndmUgaGl0IHRoZSBgbWF4V2FpdGAgbGltaXQuXG4gICAgcmV0dXJuIChsYXN0Q2FsbFRpbWUgPT09IHVuZGVmaW5lZCB8fCAodGltZVNpbmNlTGFzdENhbGwgPj0gd2FpdCkgfHxcbiAgICAgICh0aW1lU2luY2VMYXN0Q2FsbCA8IDApIHx8IChtYXhpbmcgJiYgdGltZVNpbmNlTGFzdEludm9rZSA+PSBtYXhXYWl0KSk7XG4gIH1cblxuICBmdW5jdGlvbiB0aW1lckV4cGlyZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKTtcbiAgICBpZiAoc2hvdWxkSW52b2tlKHRpbWUpKSB7XG4gICAgICByZXR1cm4gdHJhaWxpbmdFZGdlKHRpbWUpO1xuICAgIH1cbiAgICAvLyBSZXN0YXJ0IHRoZSB0aW1lci5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHJlbWFpbmluZ1dhaXQodGltZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhaWxpbmdFZGdlKHRpbWUpIHtcbiAgICB0aW1lcklkID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gT25seSBpbnZva2UgaWYgd2UgaGF2ZSBgbGFzdEFyZ3NgIHdoaWNoIG1lYW5zIGBmdW5jYCBoYXMgYmVlblxuICAgIC8vIGRlYm91bmNlZCBhdCBsZWFzdCBvbmNlLlxuICAgIGlmICh0cmFpbGluZyAmJiBsYXN0QXJncykge1xuICAgICAgcmV0dXJuIGludm9rZUZ1bmModGltZSk7XG4gICAgfVxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBpZiAodGltZXJJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgfVxuICAgIGxhc3RJbnZva2VUaW1lID0gMDtcbiAgICBsYXN0QXJncyA9IGxhc3RDYWxsVGltZSA9IGxhc3RUaGlzID0gdGltZXJJZCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHJldHVybiB0aW1lcklkID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiB0cmFpbGluZ0VkZ2Uobm93KCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCksXG4gICAgICAgIGlzSW52b2tpbmcgPSBzaG91bGRJbnZva2UodGltZSk7XG5cbiAgICBsYXN0QXJncyA9IGFyZ3VtZW50cztcbiAgICBsYXN0VGhpcyA9IHRoaXM7XG4gICAgbGFzdENhbGxUaW1lID0gdGltZTtcblxuICAgIGlmIChpc0ludm9raW5nKSB7XG4gICAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBsZWFkaW5nRWRnZShsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG1heGluZykge1xuICAgICAgICAvLyBIYW5kbGUgaW52b2NhdGlvbnMgaW4gYSB0aWdodCBsb29wLlxuICAgICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgICAgICByZXR1cm4gaW52b2tlRnVuYyhsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGRlYm91bmNlZC5jYW5jZWwgPSBjYW5jZWw7XG4gIGRlYm91bmNlZC5mbHVzaCA9IGZsdXNoO1xuICByZXR1cm4gZGVib3VuY2VkO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b051bWJlcigzLjIpO1xuICogLy8gPT4gMy4yXG4gKlxuICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9OdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gSW5maW5pdHlcbiAqXG4gKiBfLnRvTnVtYmVyKCczLjInKTtcbiAqIC8vID0+IDMuMlxuICovXG5mdW5jdGlvbiB0b051bWJlcih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTkFOO1xuICB9XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICB2YXIgb3RoZXIgPSB0eXBlb2YgdmFsdWUudmFsdWVPZiA9PSAnZnVuY3Rpb24nID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG4gICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyAob3RoZXIgKyAnJykgOiBvdGhlcjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiArdmFsdWU7XG4gIH1cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlVHJpbSwgJycpO1xuICB2YXIgaXNCaW5hcnkgPSByZUlzQmluYXJ5LnRlc3QodmFsdWUpO1xuICByZXR1cm4gKGlzQmluYXJ5IHx8IHJlSXNPY3RhbC50ZXN0KHZhbHVlKSlcbiAgICA/IGZyZWVQYXJzZUludCh2YWx1ZS5zbGljZSgyKSwgaXNCaW5hcnkgPyAyIDogOClcbiAgICA6IChyZUlzQmFkSGV4LnRlc3QodmFsdWUpID8gTkFOIDogK3ZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkZWJvdW5jZTtcbiIsIi8vIEBmbG93XG5pbXBvcnQge0NNSUFycmF5fSBmcm9tICcuL2NtaS9jb21tb24nO1xuaW1wb3J0IHtWYWxpZGF0aW9uRXJyb3J9IGZyb20gJy4vZXhjZXB0aW9ucyc7XG5pbXBvcnQgRXJyb3JDb2RlcyBmcm9tICcuL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuaW1wb3J0IHt1bmZsYXR0ZW59IGZyb20gJy4vdXRpbGl0aWVzJztcbmltcG9ydCBkZWJvdW5jZSBmcm9tICdsb2Rhc2guZGVib3VuY2UnO1xuXG5jb25zdCBnbG9iYWxfY29uc3RhbnRzID0gQVBJQ29uc3RhbnRzLmdsb2JhbDtcbmNvbnN0IHNjb3JtMTJfZXJyb3JfY29kZXMgPSBFcnJvckNvZGVzLnNjb3JtMTI7XG5cbi8qKlxuICogQmFzZSBBUEkgY2xhc3MgZm9yIEFJQ0MsIFNDT1JNIDEuMiwgYW5kIFNDT1JNIDIwMDQuIFNob3VsZCBiZSBjb25zaWRlcmVkXG4gKiBhYnN0cmFjdCwgYW5kIG5ldmVyIGluaXRpYWxpemVkIG9uIGl0J3Mgb3duLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlQVBJIHtcbiAgI3RpbWVvdXQ7XG4gICNlcnJvcl9jb2RlcztcbiAgI3NldHRpbmdzID0ge1xuICAgIGF1dG9jb21taXQ6IGZhbHNlLFxuICAgIGF1dG9jb21taXRTZWNvbmRzOiAxMCxcbiAgICBhc3luY0NvbW1pdDogZmFsc2UsXG4gICAgc2VuZEJlYWNvbkNvbW1pdDogZmFsc2UsXG4gICAgbG1zQ29tbWl0VXJsOiBmYWxzZSxcbiAgICBkYXRhQ29tbWl0Rm9ybWF0OiAnanNvbicsIC8vIHZhbGlkIGZvcm1hdHMgYXJlICdqc29uJyBvciAnZmxhdHRlbmVkJywgJ3BhcmFtcydcbiAgICBjb21taXRSZXF1ZXN0RGF0YVR5cGU6ICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLTgnLFxuICAgIGF1dG9Qcm9ncmVzczogZmFsc2UsXG4gICAgbG9nTGV2ZWw6IGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0VSUk9SLFxuICAgIHNlbGZSZXBvcnRTZXNzaW9uVGltZTogZmFsc2UsXG4gICAgYWx3YXlzU2VuZFRvdGFsVGltZTogZmFsc2UsXG4gICAgc3RyaWN0X2Vycm9yczogdHJ1ZSxcbiAgICByZXNwb25zZUhhbmRsZXI6IGZ1bmN0aW9uKHhocikge1xuICAgICAgbGV0IHJlc3VsdDtcbiAgICAgIGlmICh0eXBlb2YgeGhyICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZVRleHQpO1xuICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsIHx8ICF7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlc3VsdCwgJ3Jlc3VsdCcpKSB7XG4gICAgICAgICAgcmVzdWx0ID0ge307XG4gICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgcmVzdWx0LnJlc3VsdCA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRTtcbiAgICAgICAgICAgIHJlc3VsdC5lcnJvckNvZGUgPSAwO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQucmVzdWx0ID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcbiAgICAgICAgICAgIHJlc3VsdC5lcnJvckNvZGUgPSAxMDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG4gIH07XG4gIGNtaTtcbiAgc3RhcnRpbmdEYXRhOiB7fTtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEJhc2UgQVBJIGNsYXNzLiBTZXRzIHNvbWUgc2hhcmVkIEFQSSBmaWVsZHMsIGFzIHdlbGwgYXNcbiAgICogc2V0cyB1cCBvcHRpb25zIGZvciB0aGUgQVBJLlxuICAgKiBAcGFyYW0ge29iamVjdH0gZXJyb3JfY29kZXNcbiAgICogQHBhcmFtIHtvYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlcnJvcl9jb2Rlcywgc2V0dGluZ3MpIHtcbiAgICBpZiAobmV3LnRhcmdldCA9PT0gQmFzZUFQSSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnN0cnVjdCBCYXNlQVBJIGluc3RhbmNlcyBkaXJlY3RseScpO1xuICAgIH1cbiAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IGdsb2JhbF9jb25zdGFudHMuU1RBVEVfTk9UX0lOSVRJQUxJWkVEO1xuICAgIHRoaXMubGFzdEVycm9yQ29kZSA9IDA7XG4gICAgdGhpcy5saXN0ZW5lckFycmF5ID0gW107XG5cbiAgICB0aGlzLiN0aW1lb3V0ID0gbnVsbDtcbiAgICB0aGlzLiNlcnJvcl9jb2RlcyA9IGVycm9yX2NvZGVzO1xuXG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgIHRoaXMuYXBpTG9nTGV2ZWwgPSB0aGlzLnNldHRpbmdzLmxvZ0xldmVsO1xuICAgIHRoaXMuc2VsZlJlcG9ydFNlc3Npb25UaW1lID0gdGhpcy5zZXR0aW5ncy5zZWxmUmVwb3J0U2Vzc2lvblRpbWU7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgQVBJXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGluaXRpYWxpemVNZXNzYWdlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXJtaW5hdGlvbk1lc3NhZ2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgaW5pdGlhbGl6ZShcbiAgICAgIGNhbGxiYWNrTmFtZTogU3RyaW5nLFxuICAgICAgaW5pdGlhbGl6ZU1lc3NhZ2U/OiBTdHJpbmcsXG4gICAgICB0ZXJtaW5hdGlvbk1lc3NhZ2U/OiBTdHJpbmcpIHtcbiAgICBsZXQgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuXG4gICAgaWYgKHRoaXMuaXNJbml0aWFsaXplZCgpKSB7XG4gICAgICB0aGlzLnRocm93U0NPUk1FcnJvcih0aGlzLiNlcnJvcl9jb2Rlcy5JTklUSUFMSVpFRCwgaW5pdGlhbGl6ZU1lc3NhZ2UpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc1Rlcm1pbmF0ZWQoKSkge1xuICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IodGhpcy4jZXJyb3JfY29kZXMuVEVSTUlOQVRFRCwgdGVybWluYXRpb25NZXNzYWdlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuc2VsZlJlcG9ydFNlc3Npb25UaW1lKSB7XG4gICAgICAgIHRoaXMuY21pLnNldFN0YXJ0VGltZSgpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IGdsb2JhbF9jb25zdGFudHMuU1RBVEVfSU5JVElBTElaRUQ7XG4gICAgICB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuICAgICAgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUU7XG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcbiAgICB0aGlzLmNsZWFyU0NPUk1FcnJvcihyZXR1cm5WYWx1ZSk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZXJyb3JfY29kZXNcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cbiAgZ2V0IGVycm9yX2NvZGVzKCkge1xuICAgIHJldHVybiB0aGlzLiNlcnJvcl9jb2RlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzZXR0aW5nc1xuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICBnZXQgc2V0dGluZ3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3NldHRpbmdzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3NldHRpbmdzXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgc2V0IHNldHRpbmdzKHNldHRpbmdzOiBPYmplY3QpIHtcbiAgICB0aGlzLiNzZXR0aW5ncyA9IHsuLi50aGlzLiNzZXR0aW5ncywgLi4uc2V0dGluZ3N9O1xuICB9XG5cbiAgLyoqXG4gICAqIFRlcm1pbmF0ZXMgdGhlIGN1cnJlbnQgcnVuIG9mIHRoZSBBUElcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrVGVybWluYXRlZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICB0ZXJtaW5hdGUoXG4gICAgICBjYWxsYmFja05hbWU6IFN0cmluZyxcbiAgICAgIGNoZWNrVGVybWluYXRlZDogYm9vbGVhbikge1xuICAgIGxldCByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG5cbiAgICBpZiAodGhpcy5jaGVja1N0YXRlKGNoZWNrVGVybWluYXRlZCxcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuVEVSTUlOQVRJT05fQkVGT1JFX0lOSVQsXG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLk1VTFRJUExFX1RFUk1JTkFUSU9OKSkge1xuICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBnbG9iYWxfY29uc3RhbnRzLlNUQVRFX1RFUk1JTkFURUQ7XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuc3RvcmVEYXRhKHRydWUpO1xuICAgICAgaWYgKCF0aGlzLnNldHRpbmdzLnNlbmRCZWFjb25Db21taXQgJiYgIXRoaXMuc2V0dGluZ3MuYXN5bmNDb21taXQgJiZcbiAgICAgICAgICB0eXBlb2YgcmVzdWx0LmVycm9yQ29kZSAhPT0gJ3VuZGVmaW5lZCcgJiYgcmVzdWx0LmVycm9yQ29kZSA+IDApIHtcbiAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IocmVzdWx0LmVycm9yQ29kZSk7XG4gICAgICB9XG4gICAgICByZXR1cm5WYWx1ZSA9ICh0eXBlb2YgcmVzdWx0ICE9PSAndW5kZWZpbmVkJyAmJiByZXN1bHQucmVzdWx0KSA/XG4gICAgICAgICAgcmVzdWx0LnJlc3VsdCA6IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG5cbiAgICAgIGlmIChjaGVja1Rlcm1pbmF0ZWQpIHRoaXMubGFzdEVycm9yQ29kZSA9IDA7XG5cbiAgICAgIHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBudWxsLCAncmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG4gICAgdGhpcy5jbGVhclNDT1JNRXJyb3IocmV0dXJuVmFsdWUpO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgdmFsdWUgb2YgdGhlIENNSUVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHBhcmFtIHtib29sZWFufSBjaGVja1Rlcm1pbmF0ZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0VmFsdWUoXG4gICAgICBjYWxsYmFja05hbWU6IFN0cmluZyxcbiAgICAgIGNoZWNrVGVybWluYXRlZDogYm9vbGVhbixcbiAgICAgIENNSUVsZW1lbnQ6IFN0cmluZykge1xuICAgIGxldCByZXR1cm5WYWx1ZTtcblxuICAgIGlmICh0aGlzLmNoZWNrU3RhdGUoY2hlY2tUZXJtaW5hdGVkLFxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5SRVRSSUVWRV9CRUZPUkVfSU5JVCxcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuUkVUUklFVkVfQUZURVJfVEVSTSkpIHtcbiAgICAgIGlmIChjaGVja1Rlcm1pbmF0ZWQpIHRoaXMubGFzdEVycm9yQ29kZSA9IDA7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm5WYWx1ZSA9IHRoaXMuZ2V0Q01JVmFsdWUoQ01JRWxlbWVudCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgVmFsaWRhdGlvbkVycm9yKSB7XG4gICAgICAgICAgdGhpcy5sYXN0RXJyb3JDb2RlID0gZS5lcnJvckNvZGU7XG4gICAgICAgICAgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChlLm1lc3NhZ2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZS5tZXNzYWdlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IodGhpcy4jZXJyb3JfY29kZXMuR0VORVJBTCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUsIENNSUVsZW1lbnQpO1xuICAgIH1cblxuICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgQ01JRWxlbWVudCwgJzogcmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG4gICAgdGhpcy5jbGVhclNDT1JNRXJyb3IocmV0dXJuVmFsdWUpO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBDTUlFbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21taXRDYWxsYmFja1xuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrVGVybWluYXRlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHNldFZhbHVlKFxuICAgICAgY2FsbGJhY2tOYW1lOiBTdHJpbmcsXG4gICAgICBjb21taXRDYWxsYmFjazogU3RyaW5nLFxuICAgICAgY2hlY2tUZXJtaW5hdGVkOiBib29sZWFuLFxuICAgICAgQ01JRWxlbWVudCxcbiAgICAgIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbHVlID0gU3RyaW5nKHZhbHVlKTtcbiAgICB9XG4gICAgbGV0IHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcblxuICAgIGlmICh0aGlzLmNoZWNrU3RhdGUoY2hlY2tUZXJtaW5hdGVkLCB0aGlzLiNlcnJvcl9jb2Rlcy5TVE9SRV9CRUZPUkVfSU5JVCxcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuU1RPUkVfQUZURVJfVEVSTSkpIHtcbiAgICAgIGlmIChjaGVja1Rlcm1pbmF0ZWQpIHRoaXMubGFzdEVycm9yQ29kZSA9IDA7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm5WYWx1ZSA9IHRoaXMuc2V0Q01JVmFsdWUoQ01JRWxlbWVudCwgdmFsdWUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIFZhbGlkYXRpb25FcnJvcikge1xuICAgICAgICAgIHRoaXMubGFzdEVycm9yQ29kZSA9IGUuZXJyb3JDb2RlO1xuICAgICAgICAgIHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoZS5tZXNzYWdlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUubWVzc2FnZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHRoaXMuI2Vycm9yX2NvZGVzLkdFTkVSQUwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lLCBDTUlFbGVtZW50LCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgaWYgKHJldHVyblZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcbiAgICB9XG5cbiAgICAvLyBJZiB3ZSBkaWRuJ3QgaGF2ZSBhbnkgZXJyb3JzIHdoaWxlIHNldHRpbmcgdGhlIGRhdGEsIGdvIGFoZWFkIGFuZFxuICAgIC8vIHNjaGVkdWxlIGEgY29tbWl0LCBpZiBhdXRvY29tbWl0IGlzIHR1cm5lZCBvblxuICAgIGlmIChTdHJpbmcodGhpcy5sYXN0RXJyb3JDb2RlKSA9PT0gJzAnKSB7XG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy5hdXRvY29tbWl0ICYmICF0aGlzLiN0aW1lb3V0KSB7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVDb21taXQodGhpcy5zZXR0aW5ncy5hdXRvY29tbWl0U2Vjb25kcyAqIDEwMDAsIGNvbW1pdENhbGxiYWNrKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIENNSUVsZW1lbnQsXG4gICAgICAgICc6ICcgKyB2YWx1ZSArICc6IHJlc3VsdDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcbiAgICB0aGlzLmNsZWFyU0NPUk1FcnJvcihyZXR1cm5WYWx1ZSk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogT3JkZXJzIExNUyB0byBzdG9yZSBhbGwgY29udGVudCBwYXJhbWV0ZXJzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHBhcmFtIHtib29sZWFufSBjaGVja1Rlcm1pbmF0ZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgY29tbWl0KFxuICAgICAgY2FsbGJhY2tOYW1lOiBTdHJpbmcsXG4gICAgICBjaGVja1Rlcm1pbmF0ZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmNsZWFyU2NoZWR1bGVkQ29tbWl0KCk7XG5cbiAgICBsZXQgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuXG4gICAgaWYgKHRoaXMuY2hlY2tTdGF0ZShjaGVja1Rlcm1pbmF0ZWQsIHRoaXMuI2Vycm9yX2NvZGVzLkNPTU1JVF9CRUZPUkVfSU5JVCxcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuQ09NTUlUX0FGVEVSX1RFUk0pKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnN0b3JlRGF0YShmYWxzZSk7XG4gICAgICBpZiAoIXRoaXMuc2V0dGluZ3Muc2VuZEJlYWNvbkNvbW1pdCAmJiAhdGhpcy5zZXR0aW5ncy5hc3luY0NvbW1pdCAmJlxuICAgICAgICAgIHJlc3VsdC5lcnJvckNvZGUgJiYgcmVzdWx0LmVycm9yQ29kZSA+IDApIHtcbiAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IocmVzdWx0LmVycm9yQ29kZSk7XG4gICAgICB9XG4gICAgICByZXR1cm5WYWx1ZSA9ICh0eXBlb2YgcmVzdWx0ICE9PSAndW5kZWZpbmVkJyAmJiByZXN1bHQucmVzdWx0KSA/XG4gICAgICAgICAgcmVzdWx0LnJlc3VsdCA6IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG5cbiAgICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgJ0h0dHBSZXF1ZXN0JywgJyBSZXN1bHQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9ERUJVRyk7XG5cbiAgICAgIGlmIChjaGVja1Rlcm1pbmF0ZWQpIHRoaXMubGFzdEVycm9yQ29kZSA9IDA7XG5cbiAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUpO1xuICAgIH1cblxuICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgbnVsbCwgJ3JldHVybmVkOiAnICsgcmV0dXJuVmFsdWUsXG4gICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pO1xuICAgIHRoaXMuY2xlYXJTQ09STUVycm9yKHJldHVyblZhbHVlKTtcblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGxhc3QgZXJyb3IgY29kZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldExhc3RFcnJvcihjYWxsYmFja05hbWU6IFN0cmluZykge1xuICAgIGNvbnN0IHJldHVyblZhbHVlID0gU3RyaW5nKHRoaXMubGFzdEVycm9yQ29kZSk7XG5cbiAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKTtcblxuICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgbnVsbCwgJ3JldHVybmVkOiAnICsgcmV0dXJuVmFsdWUsXG4gICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGVycm9yTnVtYmVyIGVycm9yIGRlc2NyaXB0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcil9IENNSUVycm9yQ29kZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXRFcnJvclN0cmluZyhjYWxsYmFja05hbWU6IFN0cmluZywgQ01JRXJyb3JDb2RlKSB7XG4gICAgbGV0IHJldHVyblZhbHVlID0gJyc7XG5cbiAgICBpZiAoQ01JRXJyb3JDb2RlICE9PSBudWxsICYmIENNSUVycm9yQ29kZSAhPT0gJycpIHtcbiAgICAgIHJldHVyblZhbHVlID0gdGhpcy5nZXRMbXNFcnJvck1lc3NhZ2VEZXRhaWxzKENNSUVycm9yQ29kZSk7XG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgY29tcHJlaGVuc2l2ZSBkZXNjcmlwdGlvbiBvZiB0aGUgZXJyb3JOdW1iZXIgZXJyb3IuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcil9IENNSUVycm9yQ29kZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXREaWFnbm9zdGljKGNhbGxiYWNrTmFtZTogU3RyaW5nLCBDTUlFcnJvckNvZGUpIHtcbiAgICBsZXQgcmV0dXJuVmFsdWUgPSAnJztcblxuICAgIGlmIChDTUlFcnJvckNvZGUgIT09IG51bGwgJiYgQ01JRXJyb3JDb2RlICE9PSAnJykge1xuICAgICAgcmV0dXJuVmFsdWUgPSB0aGlzLmdldExtc0Vycm9yTWVzc2FnZURldGFpbHMoQ01JRXJyb3JDb2RlLCB0cnVlKTtcbiAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUpO1xuICAgIH1cblxuICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgbnVsbCwgJ3JldHVybmVkOiAnICsgcmV0dXJuVmFsdWUsXG4gICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB0aGUgTE1TIHN0YXRlIGFuZCBlbnN1cmVzIGl0IGhhcyBiZWVuIGluaXRpYWxpemVkLlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrVGVybWluYXRlZFxuICAgKiBAcGFyYW0ge251bWJlcn0gYmVmb3JlSW5pdEVycm9yXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhZnRlclRlcm1FcnJvclxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgY2hlY2tTdGF0ZShcbiAgICAgIGNoZWNrVGVybWluYXRlZDogYm9vbGVhbixcbiAgICAgIGJlZm9yZUluaXRFcnJvcjogbnVtYmVyLFxuICAgICAgYWZ0ZXJUZXJtRXJyb3I/OiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5pc05vdEluaXRpYWxpemVkKCkpIHtcbiAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGJlZm9yZUluaXRFcnJvcik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChjaGVja1Rlcm1pbmF0ZWQgJiYgdGhpcy5pc1Rlcm1pbmF0ZWQoKSkge1xuICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoYWZ0ZXJUZXJtRXJyb3IpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIExvZ2dpbmcgZm9yIGFsbCBTQ09STSBhY3Rpb25zXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmdW5jdGlvbk5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxvZ01lc3NhZ2VcbiAgICogQHBhcmFtIHtudW1iZXJ9bWVzc2FnZUxldmVsXG4gICAqL1xuICBhcGlMb2coXG4gICAgICBmdW5jdGlvbk5hbWU6IFN0cmluZyxcbiAgICAgIENNSUVsZW1lbnQ6IFN0cmluZyxcbiAgICAgIGxvZ01lc3NhZ2U6IFN0cmluZyxcbiAgICAgIG1lc3NhZ2VMZXZlbDogbnVtYmVyKSB7XG4gICAgbG9nTWVzc2FnZSA9IHRoaXMuZm9ybWF0TWVzc2FnZShmdW5jdGlvbk5hbWUsIENNSUVsZW1lbnQsIGxvZ01lc3NhZ2UpO1xuXG4gICAgaWYgKG1lc3NhZ2VMZXZlbCA+PSB0aGlzLmFwaUxvZ0xldmVsKSB7XG4gICAgICBzd2l0Y2ggKG1lc3NhZ2VMZXZlbCkge1xuICAgICAgICBjYXNlIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0VSUk9SOlxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IobG9nTWVzc2FnZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfV0FSTklORzpcbiAgICAgICAgICBjb25zb2xlLndhcm4obG9nTWVzc2FnZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTzpcbiAgICAgICAgICBjb25zb2xlLmluZm8obG9nTWVzc2FnZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfREVCVUc6XG4gICAgICAgICAgaWYgKGNvbnNvbGUuZGVidWcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcobG9nTWVzc2FnZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGxvZ01lc3NhZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRm9ybWF0cyB0aGUgU0NPUk0gbWVzc2FnZXMgZm9yIGVhc3kgcmVhZGluZ1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZnVuY3Rpb25OYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZvcm1hdE1lc3NhZ2UoZnVuY3Rpb25OYW1lOiBTdHJpbmcsIENNSUVsZW1lbnQ6IFN0cmluZywgbWVzc2FnZTogU3RyaW5nKSB7XG4gICAgY29uc3QgYmFzZUxlbmd0aCA9IDIwO1xuICAgIGxldCBtZXNzYWdlU3RyaW5nID0gJyc7XG5cbiAgICBtZXNzYWdlU3RyaW5nICs9IGZ1bmN0aW9uTmFtZTtcblxuICAgIGxldCBmaWxsQ2hhcnMgPSBiYXNlTGVuZ3RoIC0gbWVzc2FnZVN0cmluZy5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGxDaGFyczsgaSsrKSB7XG4gICAgICBtZXNzYWdlU3RyaW5nICs9ICcgJztcbiAgICB9XG5cbiAgICBtZXNzYWdlU3RyaW5nICs9ICc6ICc7XG5cbiAgICBpZiAoQ01JRWxlbWVudCkge1xuICAgICAgY29uc3QgQ01JRWxlbWVudEJhc2VMZW5ndGggPSA3MDtcblxuICAgICAgbWVzc2FnZVN0cmluZyArPSBDTUlFbGVtZW50O1xuXG4gICAgICBmaWxsQ2hhcnMgPSBDTUlFbGVtZW50QmFzZUxlbmd0aCAtIG1lc3NhZ2VTdHJpbmcubGVuZ3RoO1xuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGZpbGxDaGFyczsgaisrKSB7XG4gICAgICAgIG1lc3NhZ2VTdHJpbmcgKz0gJyAnO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICBtZXNzYWdlU3RyaW5nICs9IG1lc3NhZ2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lc3NhZ2VTdHJpbmc7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHRvIHNlZSBpZiB7c3RyfSBjb250YWlucyB7dGVzdGVyfVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIFN0cmluZyB0byBjaGVjayBhZ2FpbnN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXN0ZXIgU3RyaW5nIHRvIGNoZWNrIGZvclxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgc3RyaW5nTWF0Y2hlcyhzdHI6IFN0cmluZywgdGVzdGVyOiBTdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyICYmIHRlc3RlciAmJiBzdHIubWF0Y2godGVzdGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB0byBzZWUgaWYgdGhlIHNwZWNpZmljIG9iamVjdCBoYXMgdGhlIGdpdmVuIHByb3BlcnR5XG4gICAqIEBwYXJhbSB7Kn0gcmVmT2JqZWN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jaGVja09iamVjdEhhc1Byb3BlcnR5KHJlZk9iamVjdCwgYXR0cmlidXRlOiBTdHJpbmcpIHtcbiAgICByZXR1cm4gT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwocmVmT2JqZWN0LCBhdHRyaWJ1dGUpIHx8XG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoXG4gICAgICAgICAgICBPYmplY3QuZ2V0UHJvdG90eXBlT2YocmVmT2JqZWN0KSwgYXR0cmlidXRlKSB8fFxuICAgICAgICAoYXR0cmlidXRlIGluIHJlZk9iamVjdCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWVzc2FnZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGVycm9yTnVtYmVyXG4gICAqIEFQSXMgdGhhdCBpbmhlcml0IEJhc2VBUEkgc2hvdWxkIG92ZXJyaWRlIHRoaXMgZnVuY3Rpb25cbiAgICpcbiAgICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcil9IF9lcnJvck51bWJlclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IF9kZXRhaWxcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGdldExtc0Vycm9yTWVzc2FnZURldGFpbHMoX2Vycm9yTnVtYmVyLCBfZGV0YWlsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlIGdldExtc0Vycm9yTWVzc2FnZURldGFpbHMgbWV0aG9kIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHZhbHVlIGZvciB0aGUgc3BlY2lmaWMgZWxlbWVudC5cbiAgICogQVBJcyB0aGF0IGluaGVyaXQgQmFzZUFQSSBzaG91bGQgb3ZlcnJpZGUgdGhpcyBmdW5jdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX0NNSUVsZW1lbnRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGdldENNSVZhbHVlKF9DTUlFbGVtZW50KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgZ2V0Q01JVmFsdWUgbWV0aG9kIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZhbHVlIGZvciB0aGUgc3BlY2lmaWMgZWxlbWVudC5cbiAgICogQVBJcyB0aGF0IGluaGVyaXQgQmFzZUFQSSBzaG91bGQgb3ZlcnJpZGUgdGhpcyBmdW5jdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX0NNSUVsZW1lbnRcbiAgICogQHBhcmFtIHthbnl9IF92YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgc2V0Q01JVmFsdWUoX0NNSUVsZW1lbnQsIF92YWx1ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIHNldENNSVZhbHVlIG1ldGhvZCBoYXMgbm90IGJlZW4gaW1wbGVtZW50ZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaGFyZWQgQVBJIG1ldGhvZCB0byBzZXQgYSB2YWxpZCBmb3IgYSBnaXZlbiBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kTmFtZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHNjb3JtMjAwNFxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIF9jb21tb25TZXRDTUlWYWx1ZShcbiAgICAgIG1ldGhvZE5hbWU6IFN0cmluZywgc2Nvcm0yMDA0OiBib29sZWFuLCBDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgIGlmICghQ01JRWxlbWVudCB8fCBDTUlFbGVtZW50ID09PSAnJykge1xuICAgICAgcmV0dXJuIGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RydWN0dXJlID0gQ01JRWxlbWVudC5zcGxpdCgnLicpO1xuICAgIGxldCByZWZPYmplY3QgPSB0aGlzO1xuICAgIGxldCByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG4gICAgbGV0IGZvdW5kRmlyc3RJbmRleCA9IGZhbHNlO1xuXG4gICAgY29uc3QgaW52YWxpZEVycm9yTWVzc2FnZSA9IGBUaGUgZGF0YSBtb2RlbCBlbGVtZW50IHBhc3NlZCB0byAke21ldGhvZE5hbWV9ICgke0NNSUVsZW1lbnR9KSBpcyBub3QgYSB2YWxpZCBTQ09STSBkYXRhIG1vZGVsIGVsZW1lbnQuYDtcbiAgICBjb25zdCBpbnZhbGlkRXJyb3JDb2RlID0gc2Nvcm0yMDA0ID9cbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuVU5ERUZJTkVEX0RBVEFfTU9ERUwgOlxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5HRU5FUkFMO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHJ1Y3R1cmUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGF0dHJpYnV0ZSA9IHN0cnVjdHVyZVtpXTtcblxuICAgICAgaWYgKGkgPT09IHN0cnVjdHVyZS5sZW5ndGggLSAxKSB7XG4gICAgICAgIGlmIChzY29ybTIwMDQgJiYgKGF0dHJpYnV0ZS5zdWJzdHIoMCwgOCkgPT09ICd7dGFyZ2V0PScpICYmXG4gICAgICAgICAgICAodHlwZW9mIHJlZk9iamVjdC5faXNUYXJnZXRWYWxpZCA9PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHRoaXMuI2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5UKTtcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5fY2hlY2tPYmplY3RIYXNQcm9wZXJ0eShyZWZPYmplY3QsIGF0dHJpYnV0ZSkpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihpbnZhbGlkRXJyb3JDb2RlLCBpbnZhbGlkRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5pc0luaXRpYWxpemVkKCkgJiZcbiAgICAgICAgICAgICAgdGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsICdcXFxcLmNvcnJlY3RfcmVzcG9uc2VzXFxcXC5cXFxcZCsnKSkge1xuICAgICAgICAgICAgdGhpcy52YWxpZGF0ZUNvcnJlY3RSZXNwb25zZShDTUlFbGVtZW50LCB2YWx1ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFzY29ybTIwMDQgfHwgdGhpcy5sYXN0RXJyb3JDb2RlID09PSAwKSB7XG4gICAgICAgICAgICByZWZPYmplY3RbYXR0cmlidXRlXSA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWZPYmplY3QgPSByZWZPYmplY3RbYXR0cmlidXRlXTtcbiAgICAgICAgaWYgKCFyZWZPYmplY3QpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihpbnZhbGlkRXJyb3JDb2RlLCBpbnZhbGlkRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZWZPYmplY3QgaW5zdGFuY2VvZiBDTUlBcnJheSkge1xuICAgICAgICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoc3RydWN0dXJlW2kgKyAxXSwgMTApO1xuXG4gICAgICAgICAgLy8gU0NPIGlzIHRyeWluZyB0byBzZXQgYW4gaXRlbSBvbiBhbiBhcnJheVxuICAgICAgICAgIGlmICghaXNOYU4oaW5kZXgpKSB7XG4gICAgICAgICAgICBjb25zdCBpdGVtID0gcmVmT2JqZWN0LmNoaWxkQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICByZWZPYmplY3QgPSBpdGVtO1xuICAgICAgICAgICAgICBmb3VuZEZpcnN0SW5kZXggPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc3QgbmV3Q2hpbGQgPSB0aGlzLmdldENoaWxkRWxlbWVudChDTUlFbGVtZW50LCB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgIGZvdW5kRmlyc3RJbmRleCk7XG4gICAgICAgICAgICAgIGZvdW5kRmlyc3RJbmRleCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgaWYgKCFuZXdDaGlsZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChyZWZPYmplY3QuaW5pdGlhbGl6ZWQpIG5ld0NoaWxkLmluaXRpYWxpemUoKTtcblxuICAgICAgICAgICAgICAgIHJlZk9iamVjdC5jaGlsZEFycmF5LnB1c2gobmV3Q2hpbGQpO1xuICAgICAgICAgICAgICAgIHJlZk9iamVjdCA9IG5ld0NoaWxkO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEhhdmUgdG8gdXBkYXRlIGkgdmFsdWUgdG8gc2tpcCB0aGUgYXJyYXkgcG9zaXRpb25cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocmV0dXJuVmFsdWUgPT09IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0UpIHtcbiAgICAgIHRoaXMuYXBpTG9nKG1ldGhvZE5hbWUsIG51bGwsXG4gICAgICAgICAgYFRoZXJlIHdhcyBhbiBlcnJvciBzZXR0aW5nIHRoZSB2YWx1ZSBmb3I6ICR7Q01JRWxlbWVudH0sIHZhbHVlIG9mOiAke3ZhbHVlfWAsXG4gICAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfV0FSTklORyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFic3RyYWN0IG1ldGhvZCBmb3IgdmFsaWRhdGluZyB0aGF0IGEgcmVzcG9uc2UgaXMgY29ycmVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IF9DTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gX3ZhbHVlXG4gICAqL1xuICB2YWxpZGF0ZUNvcnJlY3RSZXNwb25zZShfQ01JRWxlbWVudCwgX3ZhbHVlKSB7XG4gICAgLy8ganVzdCBhIHN0dWIgbWV0aG9kXG4gIH1cblxuICAvKipcbiAgICogR2V0cyBvciBidWlsZHMgYSBuZXcgY2hpbGQgZWxlbWVudCB0byBhZGQgdG8gdGhlIGFycmF5LlxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IF9DTUlFbGVtZW50IC0gdW51c2VkXG4gICAqIEBwYXJhbSB7Kn0gX3ZhbHVlIC0gdW51c2VkXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gX2ZvdW5kRmlyc3RJbmRleCAtIHVudXNlZFxuICAgKiBAcmV0dXJuIHsqfVxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGdldENoaWxkRWxlbWVudChfQ01JRWxlbWVudCwgX3ZhbHVlLCBfZm91bmRGaXJzdEluZGV4KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgZ2V0Q2hpbGRFbGVtZW50IG1ldGhvZCBoYXMgbm90IGJlZW4gaW1wbGVtZW50ZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgdmFsdWUgZnJvbSB0aGUgQ01JIE9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kTmFtZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHNjb3JtMjAwNFxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgX2NvbW1vbkdldENNSVZhbHVlKG1ldGhvZE5hbWU6IFN0cmluZywgc2Nvcm0yMDA0OiBib29sZWFuLCBDTUlFbGVtZW50KSB7XG4gICAgaWYgKCFDTUlFbGVtZW50IHx8IENNSUVsZW1lbnQgPT09ICcnKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RydWN0dXJlID0gQ01JRWxlbWVudC5zcGxpdCgnLicpO1xuICAgIGxldCByZWZPYmplY3QgPSB0aGlzO1xuICAgIGxldCBhdHRyaWJ1dGUgPSBudWxsO1xuXG4gICAgY29uc3QgdW5pbml0aWFsaXplZEVycm9yTWVzc2FnZSA9IGBUaGUgZGF0YSBtb2RlbCBlbGVtZW50IHBhc3NlZCB0byAke21ldGhvZE5hbWV9ICgke0NNSUVsZW1lbnR9KSBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQuYDtcbiAgICBjb25zdCBpbnZhbGlkRXJyb3JNZXNzYWdlID0gYFRoZSBkYXRhIG1vZGVsIGVsZW1lbnQgcGFzc2VkIHRvICR7bWV0aG9kTmFtZX0gKCR7Q01JRWxlbWVudH0pIGlzIG5vdCBhIHZhbGlkIFNDT1JNIGRhdGEgbW9kZWwgZWxlbWVudC5gO1xuICAgIGNvbnN0IGludmFsaWRFcnJvckNvZGUgPSBzY29ybTIwMDQgP1xuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5VTkRFRklORURfREFUQV9NT0RFTCA6XG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLkdFTkVSQUw7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0cnVjdHVyZS5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0cmlidXRlID0gc3RydWN0dXJlW2ldO1xuXG4gICAgICBpZiAoIXNjb3JtMjAwNCkge1xuICAgICAgICBpZiAoaSA9PT0gc3RydWN0dXJlLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBpZiAoIXRoaXMuX2NoZWNrT2JqZWN0SGFzUHJvcGVydHkocmVmT2JqZWN0LCBhdHRyaWJ1dGUpKSB7XG4gICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihpbnZhbGlkRXJyb3JDb2RlLCBpbnZhbGlkRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICgoU3RyaW5nKGF0dHJpYnV0ZSkuc3Vic3RyKDAsIDgpID09PSAne3RhcmdldD0nKSAmJlxuICAgICAgICAgICAgKHR5cGVvZiByZWZPYmplY3QuX2lzVGFyZ2V0VmFsaWQgPT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICBjb25zdCB0YXJnZXQgPSBTdHJpbmcoYXR0cmlidXRlKS5cbiAgICAgICAgICAgICAgc3Vic3RyKDgsIFN0cmluZyhhdHRyaWJ1dGUpLmxlbmd0aCAtIDkpO1xuICAgICAgICAgIHJldHVybiByZWZPYmplY3QuX2lzVGFyZ2V0VmFsaWQodGFyZ2V0KTtcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5fY2hlY2tPYmplY3RIYXNQcm9wZXJ0eShyZWZPYmplY3QsIGF0dHJpYnV0ZSkpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihpbnZhbGlkRXJyb3JDb2RlLCBpbnZhbGlkRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmVmT2JqZWN0ID0gcmVmT2JqZWN0W2F0dHJpYnV0ZV07XG4gICAgICBpZiAocmVmT2JqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoaW52YWxpZEVycm9yQ29kZSwgaW52YWxpZEVycm9yTWVzc2FnZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVmT2JqZWN0IGluc3RhbmNlb2YgQ01JQXJyYXkpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBwYXJzZUludChzdHJ1Y3R1cmVbaSArIDFdLCAxMCk7XG5cbiAgICAgICAgLy8gU0NPIGlzIHRyeWluZyB0byBzZXQgYW4gaXRlbSBvbiBhbiBhcnJheVxuICAgICAgICBpZiAoIWlzTmFOKGluZGV4KSkge1xuICAgICAgICAgIGNvbnN0IGl0ZW0gPSByZWZPYmplY3QuY2hpbGRBcnJheVtpbmRleF07XG5cbiAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgcmVmT2JqZWN0ID0gaXRlbTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IodGhpcy4jZXJyb3JfY29kZXMuVkFMVUVfTk9UX0lOSVRJQUxJWkVELFxuICAgICAgICAgICAgICAgIHVuaW5pdGlhbGl6ZWRFcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSGF2ZSB0byB1cGRhdGUgaSB2YWx1ZSB0byBza2lwIHRoZSBhcnJheSBwb3NpdGlvblxuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyZWZPYmplY3QgPT09IG51bGwgfHwgcmVmT2JqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICghc2Nvcm0yMDA0KSB7XG4gICAgICAgIGlmIChhdHRyaWJ1dGUgPT09ICdfY2hpbGRyZW4nKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0xMl9lcnJvcl9jb2Rlcy5DSElMRFJFTl9FUlJPUik7XG4gICAgICAgIH0gZWxzZSBpZiAoYXR0cmlidXRlID09PSAnX2NvdW50Jykge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMTJfZXJyb3JfY29kZXMuQ09VTlRfRVJST1IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZWZPYmplY3Q7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgQVBJJ3MgY3VycmVudCBzdGF0ZSBpcyBTVEFURV9JTklUSUFMSVpFRFxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgaXNJbml0aWFsaXplZCgpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUgPT09IGdsb2JhbF9jb25zdGFudHMuU1RBVEVfSU5JVElBTElaRUQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBBUEkncyBjdXJyZW50IHN0YXRlIGlzIFNUQVRFX05PVF9JTklUSUFMSVpFRFxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgaXNOb3RJbml0aWFsaXplZCgpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUgPT09IGdsb2JhbF9jb25zdGFudHMuU1RBVEVfTk9UX0lOSVRJQUxJWkVEO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgQVBJJ3MgY3VycmVudCBzdGF0ZSBpcyBTVEFURV9URVJNSU5BVEVEXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBpc1Rlcm1pbmF0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlID09PSBnbG9iYWxfY29uc3RhbnRzLlNUQVRFX1RFUk1JTkFURUQ7XG4gIH1cblxuICAvKipcbiAgICogUHJvdmlkZXMgYSBtZWNoYW5pc20gZm9yIGF0dGFjaGluZyB0byBhIHNwZWNpZmljIFNDT1JNIGV2ZW50XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsaXN0ZW5lck5hbWVcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uKGxpc3RlbmVyTmFtZTogU3RyaW5nLCBjYWxsYmFjazogZnVuY3Rpb24pIHtcbiAgICBpZiAoIWNhbGxiYWNrKSByZXR1cm47XG5cbiAgICBjb25zdCBsaXN0ZW5lckZ1bmN0aW9ucyA9IGxpc3RlbmVyTmFtZS5zcGxpdCgnICcpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdGVuZXJGdW5jdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGxpc3RlbmVyU3BsaXQgPSBsaXN0ZW5lckZ1bmN0aW9uc1tpXS5zcGxpdCgnLicpO1xuICAgICAgaWYgKGxpc3RlbmVyU3BsaXQubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IGZ1bmN0aW9uTmFtZSA9IGxpc3RlbmVyU3BsaXRbMF07XG5cbiAgICAgIGxldCBDTUlFbGVtZW50ID0gbnVsbDtcbiAgICAgIGlmIChsaXN0ZW5lclNwbGl0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgQ01JRWxlbWVudCA9IGxpc3RlbmVyTmFtZS5yZXBsYWNlKGZ1bmN0aW9uTmFtZSArICcuJywgJycpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmxpc3RlbmVyQXJyYXkucHVzaCh7XG4gICAgICAgIGZ1bmN0aW9uTmFtZTogZnVuY3Rpb25OYW1lLFxuICAgICAgICBDTUlFbGVtZW50OiBDTUlFbGVtZW50LFxuICAgICAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5hcGlMb2coJ29uJywgZnVuY3Rpb25OYW1lLCBgQWRkZWQgZXZlbnQgbGlzdGVuZXI6ICR7dGhpcy5saXN0ZW5lckFycmF5Lmxlbmd0aH1gLCBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHJvdmlkZXMgYSBtZWNoYW5pc20gZm9yIGRldGFjaGluZyBhIHNwZWNpZmljIFNDT1JNIGV2ZW50IGxpc3RlbmVyXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsaXN0ZW5lck5hbWVcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9mZihsaXN0ZW5lck5hbWU6IFN0cmluZywgY2FsbGJhY2s6IGZ1bmN0aW9uKSB7XG4gICAgaWYgKCFjYWxsYmFjaykgcmV0dXJuO1xuXG4gICAgY29uc3QgbGlzdGVuZXJGdW5jdGlvbnMgPSBsaXN0ZW5lck5hbWUuc3BsaXQoJyAnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3RlbmVyRnVuY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lclNwbGl0ID0gbGlzdGVuZXJGdW5jdGlvbnNbaV0uc3BsaXQoJy4nKTtcbiAgICAgIGlmIChsaXN0ZW5lclNwbGl0Lmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBmdW5jdGlvbk5hbWUgPSBsaXN0ZW5lclNwbGl0WzBdO1xuXG4gICAgICBsZXQgQ01JRWxlbWVudCA9IG51bGw7XG4gICAgICBpZiAobGlzdGVuZXJTcGxpdC5sZW5ndGggPiAxKSB7XG4gICAgICAgIENNSUVsZW1lbnQgPSBsaXN0ZW5lck5hbWUucmVwbGFjZShmdW5jdGlvbk5hbWUgKyAnLicsICcnKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVtb3ZlSW5kZXggPSB0aGlzLmxpc3RlbmVyQXJyYXkuZmluZEluZGV4KChvYmopID0+XG4gICAgICAgIG9iai5mdW5jdGlvbk5hbWUgPT09IGZ1bmN0aW9uTmFtZSAmJlxuICAgICAgICBvYmouQ01JRWxlbWVudCA9PT0gQ01JRWxlbWVudCAmJlxuICAgICAgICBvYmouY2FsbGJhY2sgPT09IGNhbGxiYWNrXG4gICAgICApO1xuICAgICAgaWYgKHJlbW92ZUluZGV4ICE9PSAtMSkge1xuICAgICAgICB0aGlzLmxpc3RlbmVyQXJyYXkuc3BsaWNlKHJlbW92ZUluZGV4LCAxKTtcbiAgICAgICAgdGhpcy5hcGlMb2coJ29mZicsIGZ1bmN0aW9uTmFtZSwgYFJlbW92ZWQgZXZlbnQgbGlzdGVuZXI6ICR7dGhpcy5saXN0ZW5lckFycmF5Lmxlbmd0aH1gLCBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHJvdmlkZXMgYSBtZWNoYW5pc20gZm9yIGNsZWFyaW5nIGFsbCBsaXN0ZW5lcnMgZnJvbSBhIHNwZWNpZmljIFNDT1JNIGV2ZW50XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsaXN0ZW5lck5hbWVcbiAgICovXG4gIGNsZWFyKGxpc3RlbmVyTmFtZTogU3RyaW5nKSB7XG4gICAgY29uc3QgbGlzdGVuZXJGdW5jdGlvbnMgPSBsaXN0ZW5lck5hbWUuc3BsaXQoJyAnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3RlbmVyRnVuY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lclNwbGl0ID0gbGlzdGVuZXJGdW5jdGlvbnNbaV0uc3BsaXQoJy4nKTtcbiAgICAgIGlmIChsaXN0ZW5lclNwbGl0Lmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBmdW5jdGlvbk5hbWUgPSBsaXN0ZW5lclNwbGl0WzBdO1xuXG4gICAgICBsZXQgQ01JRWxlbWVudCA9IG51bGw7XG4gICAgICBpZiAobGlzdGVuZXJTcGxpdC5sZW5ndGggPiAxKSB7XG4gICAgICAgIENNSUVsZW1lbnQgPSBsaXN0ZW5lck5hbWUucmVwbGFjZShmdW5jdGlvbk5hbWUgKyAnLicsICcnKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5saXN0ZW5lckFycmF5ID0gdGhpcy5saXN0ZW5lckFycmF5LmZpbHRlcigob2JqKSA9PlxuICAgICAgICBvYmouZnVuY3Rpb25OYW1lICE9PSBmdW5jdGlvbk5hbWUgJiZcbiAgICAgICAgb2JqLkNNSUVsZW1lbnQgIT09IENNSUVsZW1lbnQsXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9jZXNzZXMgYW55ICdvbicgbGlzdGVuZXJzIHRoYXQgaGF2ZSBiZWVuIGNyZWF0ZWRcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZ1bmN0aW9uTmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqL1xuICBwcm9jZXNzTGlzdGVuZXJzKGZ1bmN0aW9uTmFtZTogU3RyaW5nLCBDTUlFbGVtZW50OiBTdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLmFwaUxvZyhmdW5jdGlvbk5hbWUsIENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGlzdGVuZXJBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVyQXJyYXlbaV07XG4gICAgICBjb25zdCBmdW5jdGlvbnNNYXRjaCA9IGxpc3RlbmVyLmZ1bmN0aW9uTmFtZSA9PT0gZnVuY3Rpb25OYW1lO1xuICAgICAgY29uc3QgbGlzdGVuZXJIYXNDTUlFbGVtZW50ID0gISFsaXN0ZW5lci5DTUlFbGVtZW50O1xuICAgICAgbGV0IENNSUVsZW1lbnRzTWF0Y2ggPSBmYWxzZTtcbiAgICAgIGlmIChDTUlFbGVtZW50ICYmIGxpc3RlbmVyLkNNSUVsZW1lbnQgJiZcbiAgICAgICAgICBsaXN0ZW5lci5DTUlFbGVtZW50LnN1YnN0cmluZyhsaXN0ZW5lci5DTUlFbGVtZW50Lmxlbmd0aCAtIDEpID09PVxuICAgICAgICAgICcqJykge1xuICAgICAgICBDTUlFbGVtZW50c01hdGNoID0gQ01JRWxlbWVudC5pbmRleE9mKGxpc3RlbmVyLkNNSUVsZW1lbnQuc3Vic3RyaW5nKDAsXG4gICAgICAgICAgICBsaXN0ZW5lci5DTUlFbGVtZW50Lmxlbmd0aCAtIDEpKSA9PT0gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIENNSUVsZW1lbnRzTWF0Y2ggPSBsaXN0ZW5lci5DTUlFbGVtZW50ID09PSBDTUlFbGVtZW50O1xuICAgICAgfVxuXG4gICAgICBpZiAoZnVuY3Rpb25zTWF0Y2ggJiYgKCFsaXN0ZW5lckhhc0NNSUVsZW1lbnQgfHwgQ01JRWxlbWVudHNNYXRjaCkpIHtcbiAgICAgICAgbGlzdGVuZXIuY2FsbGJhY2soQ01JRWxlbWVudCwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaHJvd3MgYSBTQ09STSBlcnJvclxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gZXJyb3JOdW1iZXJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VcbiAgICovXG4gIHRocm93U0NPUk1FcnJvcihlcnJvck51bWJlcjogbnVtYmVyLCBtZXNzYWdlOiBTdHJpbmcpIHtcbiAgICBpZiAoIW1lc3NhZ2UpIHtcbiAgICAgIG1lc3NhZ2UgPSB0aGlzLmdldExtc0Vycm9yTWVzc2FnZURldGFpbHMoZXJyb3JOdW1iZXIpO1xuICAgIH1cblxuICAgIHRoaXMuYXBpTG9nKCd0aHJvd1NDT1JNRXJyb3InLCBudWxsLCBlcnJvck51bWJlciArICc6ICcgKyBtZXNzYWdlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9FUlJPUik7XG5cbiAgICB0aGlzLmxhc3RFcnJvckNvZGUgPSBTdHJpbmcoZXJyb3JOdW1iZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyB0aGUgbGFzdCBTQ09STSBlcnJvciBjb2RlIG9uIHN1Y2Nlc3MuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdWNjZXNzXG4gICAqL1xuICBjbGVhclNDT1JNRXJyb3Ioc3VjY2VzczogU3RyaW5nKSB7XG4gICAgaWYgKHN1Y2Nlc3MgIT09IHVuZGVmaW5lZCAmJiBzdWNjZXNzICE9PSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFKSB7XG4gICAgICB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0cyB0byBzdG9yZSB0aGUgZGF0YSB0byB0aGUgTE1TLCBsb2dzIGRhdGEgaWYgbm8gTE1TIGNvbmZpZ3VyZWRcbiAgICogQVBJcyB0aGF0IGluaGVyaXQgQmFzZUFQSSBzaG91bGQgb3ZlcnJpZGUgdGhpcyBmdW5jdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IF9jYWxjdWxhdGVUb3RhbFRpbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHN0b3JlRGF0YShfY2FsY3VsYXRlVG90YWxUaW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlIHN0b3JlRGF0YSBtZXRob2QgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZCB0aGUgQ01JIGZyb20gYSBmbGF0dGVuZWQgSlNPTiBvYmplY3RcbiAgICogQHBhcmFtIHtvYmplY3R9IGpzb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICovXG4gIGxvYWRGcm9tRmxhdHRlbmVkSlNPTihqc29uLCBDTUlFbGVtZW50KSB7XG4gICAgaWYgKCF0aGlzLmlzTm90SW5pdGlhbGl6ZWQoKSkge1xuICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAnbG9hZEZyb21GbGF0dGVuZWRKU09OIGNhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgdGhlIGNhbGwgdG8gbG1zSW5pdGlhbGl6ZS4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUZXN0IG1hdGNoIHBhdHRlcm4uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gYVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjXG4gICAgICogQHBhcmFtIHtSZWdFeHB9IGFfcGF0dGVyblxuICAgICAqIEByZXR1cm4ge251bWJlcn1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiB0ZXN0UGF0dGVybihhLCBjLCBhX3BhdHRlcm4pIHtcbiAgICAgIGNvbnN0IGFfbWF0Y2ggPSBhLm1hdGNoKGFfcGF0dGVybik7XG5cbiAgICAgIGxldCBjX21hdGNoO1xuICAgICAgaWYgKGFfbWF0Y2ggIT09IG51bGwgJiYgKGNfbWF0Y2ggPSBjLm1hdGNoKGFfcGF0dGVybikpICE9PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGFfbnVtID0gTnVtYmVyKGFfbWF0Y2hbMl0pO1xuICAgICAgICBjb25zdCBjX251bSA9IE51bWJlcihjX21hdGNoWzJdKTtcbiAgICAgICAgaWYgKGFfbnVtID09PSBjX251bSkge1xuICAgICAgICAgIGlmIChhX21hdGNoWzNdID09PSAnaWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgfSBlbHNlIGlmIChhX21hdGNoWzNdID09PSAndHlwZScpIHtcbiAgICAgICAgICAgIGlmIChjX21hdGNoWzNdID09PSAnaWQnKSB7XG4gICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFfbnVtIC0gY19udW07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGludF9wYXR0ZXJuID0gL14oY21pXFwuaW50ZXJhY3Rpb25zXFwuKShcXGQrKVxcLiguKikkLztcbiAgICBjb25zdCBvYmpfcGF0dGVybiA9IC9eKGNtaVxcLm9iamVjdGl2ZXNcXC4pKFxcZCspXFwuKC4qKSQvO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gT2JqZWN0LmtleXMoanNvbikubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIFtTdHJpbmcoa2V5KSwganNvbltrZXldXTtcbiAgICB9KTtcblxuICAgIC8vIENNSSBpbnRlcmFjdGlvbnMgbmVlZCB0byBoYXZlIGlkIGFuZCB0eXBlIGxvYWRlZCBiZWZvcmUgYW55IG90aGVyIGZpZWxkc1xuICAgIHJlc3VsdC5zb3J0KGZ1bmN0aW9uKFthLCBiXSwgW2MsIGRdKSB7XG4gICAgICBsZXQgdGVzdDtcbiAgICAgIGlmICgodGVzdCA9IHRlc3RQYXR0ZXJuKGEsIGMsIGludF9wYXR0ZXJuKSkgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRlc3Q7XG4gICAgICB9XG4gICAgICBpZiAoKHRlc3QgPSB0ZXN0UGF0dGVybihhLCBjLCBvYmpfcGF0dGVybikpICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0ZXN0O1xuICAgICAgfVxuXG4gICAgICBpZiAoYSA8IGMpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgaWYgKGEgPiBjKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfVxuICAgICAgcmV0dXJuIDA7XG4gICAgfSk7XG5cbiAgICBsZXQgb2JqO1xuICAgIHJlc3VsdC5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBvYmogPSB7fTtcbiAgICAgIG9ialtlbGVtZW50WzBdXSA9IGVsZW1lbnRbMV07XG4gICAgICB0aGlzLmxvYWRGcm9tSlNPTih1bmZsYXR0ZW4ob2JqKSwgQ01JRWxlbWVudCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZHMgQ01JIGRhdGEgZnJvbSBhIEpTT04gb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0ganNvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKi9cbiAgbG9hZEZyb21KU09OKGpzb24sIENNSUVsZW1lbnQpIHtcbiAgICBpZiAoIXRoaXMuaXNOb3RJbml0aWFsaXplZCgpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICdsb2FkRnJvbUpTT04gY2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSB0aGUgY2FsbCB0byBsbXNJbml0aWFsaXplLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIENNSUVsZW1lbnQgPSBDTUlFbGVtZW50ICE9PSB1bmRlZmluZWQgPyBDTUlFbGVtZW50IDogJ2NtaSc7XG5cbiAgICB0aGlzLnN0YXJ0aW5nRGF0YSA9IGpzb247XG5cbiAgICAvLyBjb3VsZCB0aGlzIGJlIHJlZmFjdG9yZWQgZG93biB0byBmbGF0dGVuKGpzb24pIHRoZW4gc2V0Q01JVmFsdWUgb24gZWFjaD9cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBqc29uKSB7XG4gICAgICBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChqc29uLCBrZXkpICYmIGpzb25ba2V5XSkge1xuICAgICAgICBjb25zdCBjdXJyZW50Q01JRWxlbWVudCA9IChDTUlFbGVtZW50ID8gQ01JRWxlbWVudCArICcuJyA6ICcnKSArIGtleTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBqc29uW2tleV07XG5cbiAgICAgICAgaWYgKHZhbHVlWydjaGlsZEFycmF5J10pIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZhbHVlWydjaGlsZEFycmF5J10ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMubG9hZEZyb21KU09OKHZhbHVlWydjaGlsZEFycmF5J11baV0sXG4gICAgICAgICAgICAgICAgY3VycmVudENNSUVsZW1lbnQgKyAnLicgKyBpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUuY29uc3RydWN0b3IgPT09IE9iamVjdCkge1xuICAgICAgICAgIHRoaXMubG9hZEZyb21KU09OKHZhbHVlLCBjdXJyZW50Q01JRWxlbWVudCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRDTUlWYWx1ZShjdXJyZW50Q01JRWxlbWVudCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgQ01JIG9iamVjdCB0byBKU09OIGZvciBzZW5kaW5nIHRvIGFuIExNUy5cbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgcmVuZGVyQ01JVG9KU09OU3RyaW5nKCkge1xuICAgIGNvbnN0IGNtaSA9IHRoaXMuY21pO1xuICAgIC8vIERvIHdlIHdhbnQvbmVlZCB0byByZXR1cm4gZmllbGRzIHRoYXQgaGF2ZSBubyBzZXQgdmFsdWU/XG4gICAgLy8gcmV0dXJuIEpTT04uc3RyaW5naWZ5KHsgY21pIH0sIChrLCB2KSA9PiB2ID09PSB1bmRlZmluZWQgPyBudWxsIDogdiwgMik7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHtjbWl9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgSlMgb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgY3VycmVudCBjbWlcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cbiAgcmVuZGVyQ01JVG9KU09OT2JqZWN0KCkge1xuICAgIC8vIERvIHdlIHdhbnQvbmVlZCB0byByZXR1cm4gZmllbGRzIHRoYXQgaGF2ZSBubyBzZXQgdmFsdWU/XG4gICAgLy8gcmV0dXJuIEpTT04uc3RyaW5naWZ5KHsgY21pIH0sIChrLCB2KSA9PiB2ID09PSB1bmRlZmluZWQgPyBudWxsIDogdiwgMik7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UodGhpcy5yZW5kZXJDTUlUb0pTT05TdHJpbmcoKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBjbWkgb2JqZWN0IHRvIHRoZSBwcm9wZXIgZm9ybWF0IGZvciBMTVMgY29tbWl0XG4gICAqIEFQSXMgdGhhdCBpbmhlcml0IEJhc2VBUEkgc2hvdWxkIG92ZXJyaWRlIHRoaXMgZnVuY3Rpb25cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBfdGVybWluYXRlQ29tbWl0XG4gICAqIEByZXR1cm4geyp9XG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgcmVuZGVyQ29tbWl0Q01JKF90ZXJtaW5hdGVDb21taXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdUaGUgc3RvcmVEYXRhIG1ldGhvZCBoYXMgbm90IGJlZW4gaW1wbGVtZW50ZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIHRoZSByZXF1ZXN0IHRvIHRoZSBMTVNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybFxuICAgKiBAcGFyYW0ge29iamVjdHxBcnJheX0gcGFyYW1zXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaW1tZWRpYXRlXG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIHByb2Nlc3NIdHRwUmVxdWVzdCh1cmw6IFN0cmluZywgcGFyYW1zLCBpbW1lZGlhdGUgPSBmYWxzZSkge1xuICAgIGNvbnN0IGFwaSA9IHRoaXM7XG4gICAgY29uc3QgcHJvY2VzcyA9IGZ1bmN0aW9uKHVybCwgcGFyYW1zLCBzZXR0aW5ncywgZXJyb3JfY29kZXMpIHtcbiAgICAgIGNvbnN0IGdlbmVyaWNFcnJvciA9IHtcbiAgICAgICAgJ3Jlc3VsdCc6IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0UsXG4gICAgICAgICdlcnJvckNvZGUnOiBlcnJvcl9jb2Rlcy5HRU5FUkFMLFxuICAgICAgfTtcblxuICAgICAgbGV0IHJlc3VsdDtcbiAgICAgIGlmICghc2V0dGluZ3Muc2VuZEJlYWNvbkNvbW1pdCkge1xuICAgICAgICBjb25zdCBodHRwUmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIGh0dHBSZXEub3BlbignUE9TVCcsIHVybCwgc2V0dGluZ3MuYXN5bmNDb21taXQpO1xuICAgICAgICBpZiAoc2V0dGluZ3MuYXN5bmNDb21taXQpIHtcbiAgICAgICAgICBodHRwUmVxLm9ubG9hZCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc2V0dGluZ3MucmVzcG9uc2VIYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IHNldHRpbmdzLnJlc3BvbnNlSGFuZGxlcihodHRwUmVxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UoaHR0cFJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAocGFyYW1zIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIGh0dHBSZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJyxcbiAgICAgICAgICAgICAgICAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XG4gICAgICAgICAgICBodHRwUmVxLnNlbmQocGFyYW1zLmpvaW4oJyYnKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGh0dHBSZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJyxcbiAgICAgICAgICAgICAgICBzZXR0aW5ncy5jb21taXRSZXF1ZXN0RGF0YVR5cGUpO1xuICAgICAgICAgICAgaHR0cFJlcS5zZW5kKEpTT04uc3RyaW5naWZ5KHBhcmFtcykpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghc2V0dGluZ3MuYXN5bmNDb21taXQpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc2V0dGluZ3MucmVzcG9uc2VIYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IHNldHRpbmdzLnJlc3BvbnNlSGFuZGxlcihodHRwUmVxKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UoaHR0cFJlcS5yZXNwb25zZVRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSB7fTtcbiAgICAgICAgICAgIHJlc3VsdC5yZXN1bHQgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUU7XG4gICAgICAgICAgICByZXN1bHQuZXJyb3JDb2RlID0gMDtcbiAgICAgICAgICAgIGFwaS5wcm9jZXNzTGlzdGVuZXJzKCdDb21taXRTdWNjZXNzJyk7XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgYXBpLnByb2Nlc3NMaXN0ZW5lcnMoJ0NvbW1pdEVycm9yJyk7XG4gICAgICAgICAgcmV0dXJuIGdlbmVyaWNFcnJvcjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCBoZWFkZXJzID0ge1xuICAgICAgICAgICAgdHlwZTogc2V0dGluZ3MuY29tbWl0UmVxdWVzdERhdGFUeXBlLFxuICAgICAgICAgIH07XG4gICAgICAgICAgbGV0IGJsb2I7XG4gICAgICAgICAgaWYgKHBhcmFtcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICBibG9iID0gbmV3IEJsb2IoW3BhcmFtcy5qb2luKCcmJyldLCBoZWFkZXJzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYmxvYiA9IG5ldyBCbG9iKFtKU09OLnN0cmluZ2lmeShwYXJhbXMpXSwgaGVhZGVycyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzdWx0ID0ge307XG4gICAgICAgICAgaWYgKG5hdmlnYXRvci5zZW5kQmVhY29uKHVybCwgYmxvYikpIHtcbiAgICAgICAgICAgIHJlc3VsdC5yZXN1bHQgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUU7XG4gICAgICAgICAgICByZXN1bHQuZXJyb3JDb2RlID0gMDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0LnJlc3VsdCA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG4gICAgICAgICAgICByZXN1bHQuZXJyb3JDb2RlID0gMTAxO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgYXBpLnByb2Nlc3NMaXN0ZW5lcnMoJ0NvbW1pdEVycm9yJyk7XG4gICAgICAgICAgcmV0dXJuIGdlbmVyaWNFcnJvcjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHJlc3VsdCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgYXBpLnByb2Nlc3NMaXN0ZW5lcnMoJ0NvbW1pdEVycm9yJyk7XG4gICAgICAgIHJldHVybiBnZW5lcmljRXJyb3I7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXN1bHQucmVzdWx0ID09PSB0cnVlIHx8XG4gICAgICAgICAgcmVzdWx0LnJlc3VsdCA9PT0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFKSB7XG4gICAgICAgIGFwaS5wcm9jZXNzTGlzdGVuZXJzKCdDb21taXRTdWNjZXNzJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcGkucHJvY2Vzc0xpc3RlbmVycygnQ29tbWl0RXJyb3InKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBkZWJvdW5jZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnN0IGRlYm91bmNlZCA9IGRlYm91bmNlKHByb2Nlc3MsIDUwMCk7XG4gICAgICBkZWJvdW5jZWQodXJsLCBwYXJhbXMsIHRoaXMuc2V0dGluZ3MsIHRoaXMuZXJyb3JfY29kZXMpO1xuXG4gICAgICAvLyBpZiB3ZSdyZSB0ZXJtaW5hdGluZywgZ28gYWhlYWQgYW5kIGNvbW1pdCBpbW1lZGlhdGVseVxuICAgICAgaWYgKGltbWVkaWF0ZSkge1xuICAgICAgICBkZWJvdW5jZWQuZmx1c2goKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdWx0OiBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUUsXG4gICAgICAgIGVycm9yQ29kZTogMCxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwcm9jZXNzKHVybCwgcGFyYW1zLCB0aGlzLnNldHRpbmdzLCB0aGlzLmVycm9yX2NvZGVzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhyb3dzIGEgU0NPUk0gZXJyb3JcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdoZW4gLSB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZSBjb21taXR0aW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFjayAtIHRoZSBuYW1lIG9mIHRoZSBjb21taXQgZXZlbnQgY2FsbGJhY2tcbiAgICovXG4gIHNjaGVkdWxlQ29tbWl0KHdoZW46IG51bWJlciwgY2FsbGJhY2s6IHN0cmluZykge1xuICAgIHRoaXMuI3RpbWVvdXQgPSBuZXcgU2NoZWR1bGVkQ29tbWl0KHRoaXMsIHdoZW4sIGNhbGxiYWNrKTtcbiAgICB0aGlzLmFwaUxvZygnc2NoZWR1bGVDb21taXQnLCAnJywgJ3NjaGVkdWxlZCcsXG4gICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0RFQlVHKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgYW5kIGNhbmNlbHMgYW55IGN1cnJlbnRseSBzY2hlZHVsZWQgY29tbWl0c1xuICAgKi9cbiAgY2xlYXJTY2hlZHVsZWRDb21taXQoKSB7XG4gICAgaWYgKHRoaXMuI3RpbWVvdXQpIHtcbiAgICAgIHRoaXMuI3RpbWVvdXQuY2FuY2VsKCk7XG4gICAgICB0aGlzLiN0aW1lb3V0ID0gbnVsbDtcbiAgICAgIHRoaXMuYXBpTG9nKCdjbGVhclNjaGVkdWxlZENvbW1pdCcsICcnLCAnY2xlYXJlZCcsXG4gICAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfREVCVUcpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFByaXZhdGUgY2xhc3MgdGhhdCB3cmFwcyBhIHRpbWVvdXQgY2FsbCB0byB0aGUgY29tbWl0KCkgZnVuY3Rpb25cbiAqL1xuY2xhc3MgU2NoZWR1bGVkQ29tbWl0IHtcbiAgI0FQSTtcbiAgI2NhbmNlbGxlZCA9IGZhbHNlO1xuICAjdGltZW91dDtcbiAgI2NhbGxiYWNrO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgU2NoZWR1bGVkQ29tbWl0XG4gICAqIEBwYXJhbSB7QmFzZUFQSX0gQVBJXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aGVuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja1xuICAgKi9cbiAgY29uc3RydWN0b3IoQVBJOiBhbnksIHdoZW46IG51bWJlciwgY2FsbGJhY2s6IHN0cmluZykge1xuICAgIHRoaXMuI0FQSSA9IEFQSTtcbiAgICB0aGlzLiN0aW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLndyYXBwZXIuYmluZCh0aGlzKSwgd2hlbik7XG4gICAgdGhpcy4jY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgfVxuXG4gIC8qKlxuICAgKiBDYW5jZWwgYW55IGN1cnJlbnRseSBzY2hlZHVsZWQgY29tbWl0XG4gICAqL1xuICBjYW5jZWwoKSB7XG4gICAgdGhpcy4jY2FuY2VsbGVkID0gdHJ1ZTtcbiAgICBpZiAodGhpcy4jdGltZW91dCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuI3RpbWVvdXQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBXcmFwIHRoZSBBUEkgY29tbWl0IGNhbGwgdG8gY2hlY2sgaWYgdGhlIGNhbGwgaGFzIGFscmVhZHkgYmVlbiBjYW5jZWxsZWRcbiAgICovXG4gIHdyYXBwZXIoKSB7XG4gICAgaWYgKCF0aGlzLiNjYW5jZWxsZWQpIHtcbiAgICAgIHRoaXMuI0FQSS5jb21taXQodGhpcy4jY2FsbGJhY2spO1xuICAgIH1cbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCBCYXNlQVBJIGZyb20gJy4vQmFzZUFQSSc7XG5pbXBvcnQge1xuICBBREwsXG4gIENNSSxcbiAgQ01JQ29tbWVudHNPYmplY3QsXG4gIENNSUludGVyYWN0aW9uc0NvcnJlY3RSZXNwb25zZXNPYmplY3QsXG4gIENNSUludGVyYWN0aW9uc09iamVjdCxcbiAgQ01JSW50ZXJhY3Rpb25zT2JqZWN0aXZlc09iamVjdCxcbiAgQ01JT2JqZWN0aXZlc09iamVjdCxcbn0gZnJvbSAnLi9jbWkvc2Nvcm0yMDA0X2NtaSc7XG5pbXBvcnQgKiBhcyBVdGlsaXRpZXMgZnJvbSAnLi91dGlsaXRpZXMnO1xuaW1wb3J0IEFQSUNvbnN0YW50cyBmcm9tICcuL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCBFcnJvckNvZGVzIGZyb20gJy4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJztcbmltcG9ydCBSZXNwb25zZXMgZnJvbSAnLi9jb25zdGFudHMvcmVzcG9uc2VfY29uc3RhbnRzJztcbmltcG9ydCBWYWxpZExhbmd1YWdlcyBmcm9tICcuL2NvbnN0YW50cy9sYW5ndWFnZV9jb25zdGFudHMnO1xuaW1wb3J0IFJlZ2V4IGZyb20gJy4vY29uc3RhbnRzL3JlZ2V4JztcblxuY29uc3Qgc2Nvcm0yMDA0X2NvbnN0YW50cyA9IEFQSUNvbnN0YW50cy5zY29ybTIwMDQ7XG5jb25zdCBnbG9iYWxfY29uc3RhbnRzID0gQVBJQ29uc3RhbnRzLmdsb2JhbDtcbmNvbnN0IHNjb3JtMjAwNF9lcnJvcl9jb2RlcyA9IEVycm9yQ29kZXMuc2Nvcm0yMDA0O1xuY29uc3QgY29ycmVjdF9yZXNwb25zZXMgPSBSZXNwb25zZXMuY29ycmVjdDtcbmNvbnN0IHNjb3JtMjAwNF9yZWdleCA9IFJlZ2V4LnNjb3JtMjAwNDtcblxuLyoqXG4gKiBBUEkgY2xhc3MgZm9yIFNDT1JNIDIwMDRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2Nvcm0yMDA0QVBJIGV4dGVuZHMgQmFzZUFQSSB7XG4gICN2ZXJzaW9uOiAnMS4wJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIFNDT1JNIDIwMDQgQVBJXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IHt9KSB7XG4gICAgY29uc3QgZmluYWxTZXR0aW5ncyA9IHtcbiAgICAgIC4uLntcbiAgICAgICAgbWFzdGVyeV9vdmVycmlkZTogZmFsc2UsXG4gICAgICB9LCAuLi5zZXR0aW5ncyxcbiAgICB9O1xuXG4gICAgc3VwZXIoc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLCBmaW5hbFNldHRpbmdzKTtcblxuICAgIHRoaXMuY21pID0gbmV3IENNSSgpO1xuICAgIHRoaXMuYWRsID0gbmV3IEFETCgpO1xuXG4gICAgLy8gUmVuYW1lIGZ1bmN0aW9ucyB0byBtYXRjaCAyMDA0IFNwZWMgYW5kIGV4cG9zZSB0byBtb2R1bGVzXG4gICAgdGhpcy5Jbml0aWFsaXplID0gdGhpcy5sbXNJbml0aWFsaXplO1xuICAgIHRoaXMuVGVybWluYXRlID0gdGhpcy5sbXNUZXJtaW5hdGU7XG4gICAgdGhpcy5HZXRWYWx1ZSA9IHRoaXMubG1zR2V0VmFsdWU7XG4gICAgdGhpcy5TZXRWYWx1ZSA9IHRoaXMubG1zU2V0VmFsdWU7XG4gICAgdGhpcy5Db21taXQgPSB0aGlzLmxtc0NvbW1pdDtcbiAgICB0aGlzLkdldExhc3RFcnJvciA9IHRoaXMubG1zR2V0TGFzdEVycm9yO1xuICAgIHRoaXMuR2V0RXJyb3JTdHJpbmcgPSB0aGlzLmxtc0dldEVycm9yU3RyaW5nO1xuICAgIHRoaXMuR2V0RGlhZ25vc3RpYyA9IHRoaXMubG1zR2V0RGlhZ25vc3RpYztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN2ZXJzaW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB2ZXJzaW9uKCkge1xuICAgIHJldHVybiB0aGlzLiN2ZXJzaW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYm9vbFxuICAgKi9cbiAgbG1zSW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLmNtaS5pbml0aWFsaXplKCk7XG4gICAgcmV0dXJuIHRoaXMuaW5pdGlhbGl6ZSgnSW5pdGlhbGl6ZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYm9vbFxuICAgKi9cbiAgbG1zVGVybWluYXRlKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMudGVybWluYXRlKCdUZXJtaW5hdGUnLCB0cnVlKTtcblxuICAgIGlmIChyZXN1bHQgPT09IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRSkge1xuICAgICAgaWYgKHRoaXMuYWRsLm5hdi5yZXF1ZXN0ICE9PSAnX25vbmVfJykge1xuICAgICAgICBzd2l0Y2ggKHRoaXMuYWRsLm5hdi5yZXF1ZXN0KSB7XG4gICAgICAgICAgY2FzZSAnY29udGludWUnOlxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZU5leHQnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3ByZXZpb3VzJzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VQcmV2aW91cycpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnY2hvaWNlJzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VDaG9pY2UnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2V4aXQnOlxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZUV4aXQnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2V4aXRBbGwnOlxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZUV4aXRBbGwnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2FiYW5kb24nOlxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZUFiYW5kb24nKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2FiYW5kb25BbGwnOlxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZUFiYW5kb25BbGwnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc2V0dGluZ3MuYXV0b1Byb2dyZXNzKSB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VOZXh0Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXRWYWx1ZShDTUlFbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUoJ0dldFZhbHVlJywgdHJ1ZSwgQ01JRWxlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHthbnl9IHZhbHVlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc1NldFZhbHVlKENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0VmFsdWUoJ1NldFZhbHVlJywgJ0NvbW1pdCcsIHRydWUsIENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcmRlcnMgTE1TIHRvIHN0b3JlIGFsbCBjb250ZW50IHBhcmFtZXRlcnNcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSBib29sXG4gICAqL1xuICBsbXNDb21taXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29tbWl0KCdDb21taXQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGxhc3QgZXJyb3IgY29kZVxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXRMYXN0RXJyb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TGFzdEVycm9yKCdHZXRMYXN0RXJyb3InKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBlcnJvck51bWJlciBlcnJvciBkZXNjcmlwdGlvblxuICAgKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gQ01JRXJyb3JDb2RlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc0dldEVycm9yU3RyaW5nKENNSUVycm9yQ29kZSkge1xuICAgIHJldHVybiB0aGlzLmdldEVycm9yU3RyaW5nKCdHZXRFcnJvclN0cmluZycsIENNSUVycm9yQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGNvbXByZWhlbnNpdmUgZGVzY3JpcHRpb24gb2YgdGhlIGVycm9yTnVtYmVyIGVycm9yLlxuICAgKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gQ01JRXJyb3JDb2RlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc0dldERpYWdub3N0aWMoQ01JRXJyb3JDb2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RGlhZ25vc3RpYygnR2V0RGlhZ25vc3RpYycsIENNSUVycm9yQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhIHZhbHVlIG9uIHRoZSBDTUkgT2JqZWN0XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBzZXRDTUlWYWx1ZShDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9jb21tb25TZXRDTUlWYWx1ZSgnU2V0VmFsdWUnLCB0cnVlLCBDTUlFbGVtZW50LCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBvciBidWlsZHMgYSBuZXcgY2hpbGQgZWxlbWVudCB0byBhZGQgdG8gdGhlIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICogQHBhcmFtIHtib29sZWFufSBmb3VuZEZpcnN0SW5kZXhcbiAgICogQHJldHVybiB7YW55fVxuICAgKi9cbiAgZ2V0Q2hpbGRFbGVtZW50KENNSUVsZW1lbnQsIHZhbHVlLCBmb3VuZEZpcnN0SW5kZXgpIHtcbiAgICBsZXQgbmV3Q2hpbGQ7XG5cbiAgICBpZiAodGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsICdjbWlcXFxcLm9iamVjdGl2ZXNcXFxcLlxcXFxkKycpKSB7XG4gICAgICBuZXdDaGlsZCA9IG5ldyBDTUlPYmplY3RpdmVzT2JqZWN0KCk7XG4gICAgfSBlbHNlIGlmIChmb3VuZEZpcnN0SW5kZXggJiYgdGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsXG4gICAgICAgICdjbWlcXFxcLmludGVyYWN0aW9uc1xcXFwuXFxcXGQrXFxcXC5jb3JyZWN0X3Jlc3BvbnNlc1xcXFwuXFxcXGQrJykpIHtcbiAgICAgIGNvbnN0IHBhcnRzID0gQ01JRWxlbWVudC5zcGxpdCgnLicpO1xuICAgICAgY29uc3QgaW5kZXggPSBOdW1iZXIocGFydHNbMl0pO1xuICAgICAgY29uc3QgaW50ZXJhY3Rpb24gPSB0aGlzLmNtaS5pbnRlcmFjdGlvbnMuY2hpbGRBcnJheVtpbmRleF07XG4gICAgICBpZiAodGhpcy5pc0luaXRpYWxpemVkKCkpIHtcbiAgICAgICAgaWYgKCFpbnRlcmFjdGlvbi50eXBlKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoXG4gICAgICAgICAgICAgIHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5ERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5jaGVja0R1cGxpY2F0ZUNob2ljZVJlc3BvbnNlKGludGVyYWN0aW9uLCB2YWx1ZSk7XG5cbiAgICAgICAgICBjb25zdCByZXNwb25zZV90eXBlID0gY29ycmVjdF9yZXNwb25zZXNbaW50ZXJhY3Rpb24udHlwZV07XG4gICAgICAgICAgaWYgKHJlc3BvbnNlX3R5cGUpIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tWYWxpZFJlc3BvbnNlVHlwZShyZXNwb25zZV90eXBlLCB2YWx1ZSwgaW50ZXJhY3Rpb24udHlwZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5HRU5FUkFMX1NFVF9GQUlMVVJFLFxuICAgICAgICAgICAgICAgICdJbmNvcnJlY3QgUmVzcG9uc2UgVHlwZTogJyArIGludGVyYWN0aW9uLnR5cGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMubGFzdEVycm9yQ29kZSA9PT0gMCkge1xuICAgICAgICBuZXdDaGlsZCA9IG5ldyBDTUlJbnRlcmFjdGlvbnNDb3JyZWN0UmVzcG9uc2VzT2JqZWN0KCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmb3VuZEZpcnN0SW5kZXggJiYgdGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsXG4gICAgICAgICdjbWlcXFxcLmludGVyYWN0aW9uc1xcXFwuXFxcXGQrXFxcXC5vYmplY3RpdmVzXFxcXC5cXFxcZCsnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JSW50ZXJhY3Rpb25zT2JqZWN0aXZlc09iamVjdCgpO1xuICAgIH0gZWxzZSBpZiAoIWZvdW5kRmlyc3RJbmRleCAmJlxuICAgICAgICB0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ2NtaVxcXFwuaW50ZXJhY3Rpb25zXFxcXC5cXFxcZCsnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JSW50ZXJhY3Rpb25zT2JqZWN0KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCxcbiAgICAgICAgJ2NtaVxcXFwuY29tbWVudHNfZnJvbV9sZWFybmVyXFxcXC5cXFxcZCsnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JQ29tbWVudHNPYmplY3QoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LFxuICAgICAgICAnY21pXFxcXC5jb21tZW50c19mcm9tX2xtc1xcXFwuXFxcXGQrJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSUNvbW1lbnRzT2JqZWN0KHRydWUpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXdDaGlsZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgZm9yIHZhbGlkIHJlc3BvbnNlIHR5cGVzXG4gICAqIEBwYXJhbSB7b2JqZWN0fSByZXNwb25zZV90eXBlXG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gaW50ZXJhY3Rpb25fdHlwZVxuICAgKi9cbiAgY2hlY2tWYWxpZFJlc3BvbnNlVHlwZShyZXNwb25zZV90eXBlLCB2YWx1ZSwgaW50ZXJhY3Rpb25fdHlwZSkge1xuICAgIGxldCBub2RlcyA9IFtdO1xuICAgIGlmIChyZXNwb25zZV90eXBlPy5kZWxpbWl0ZXIpIHtcbiAgICAgIG5vZGVzID0gU3RyaW5nKHZhbHVlKS5zcGxpdChyZXNwb25zZV90eXBlLmRlbGltaXRlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vZGVzWzBdID0gdmFsdWU7XG4gICAgfVxuXG4gICAgaWYgKG5vZGVzLmxlbmd0aCA+IDAgJiYgbm9kZXMubGVuZ3RoIDw9IHJlc3BvbnNlX3R5cGUubWF4KSB7XG4gICAgICB0aGlzLmNoZWNrQ29ycmVjdFJlc3BvbnNlVmFsdWUoaW50ZXJhY3Rpb25fdHlwZSwgbm9kZXMsIHZhbHVlKTtcbiAgICB9IGVsc2UgaWYgKG5vZGVzLmxlbmd0aCA+IHJlc3BvbnNlX3R5cGUubWF4KSB7XG4gICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuR0VORVJBTF9TRVRfRkFJTFVSRSxcbiAgICAgICAgICAnRGF0YSBNb2RlbCBFbGVtZW50IFBhdHRlcm4gVG9vIExvbmcnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGZvciBkdXBsaWNhdGUgJ2Nob2ljZScgcmVzcG9uc2VzLlxuICAgKiBAcGFyYW0ge0NNSUludGVyYWN0aW9uc09iamVjdH0gaW50ZXJhY3Rpb25cbiAgICogQHBhcmFtIHthbnl9IHZhbHVlXG4gICAqL1xuICBjaGVja0R1cGxpY2F0ZUNob2ljZVJlc3BvbnNlKGludGVyYWN0aW9uLCB2YWx1ZSkge1xuICAgIGNvbnN0IGludGVyYWN0aW9uX2NvdW50ID0gaW50ZXJhY3Rpb24uY29ycmVjdF9yZXNwb25zZXMuX2NvdW50O1xuICAgIGlmIChpbnRlcmFjdGlvbi50eXBlID09PSAnY2hvaWNlJykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnRlcmFjdGlvbl9jb3VudCAmJiB0aGlzLmxhc3RFcnJvckNvZGUgPT09XG4gICAgICAwOyBpKyspIHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBpbnRlcmFjdGlvbi5jb3JyZWN0X3Jlc3BvbnNlcy5jaGlsZEFycmF5W2ldO1xuICAgICAgICBpZiAocmVzcG9uc2UucGF0dGVybiA9PT0gdmFsdWUpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuR0VORVJBTF9TRVRfRkFJTFVSRSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGUgY29ycmVjdCByZXNwb25zZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKi9cbiAgdmFsaWRhdGVDb3JyZWN0UmVzcG9uc2UoQ01JRWxlbWVudCwgdmFsdWUpIHtcbiAgICBjb25zdCBwYXJ0cyA9IENNSUVsZW1lbnQuc3BsaXQoJy4nKTtcbiAgICBjb25zdCBpbmRleCA9IE51bWJlcihwYXJ0c1syXSk7XG4gICAgY29uc3QgcGF0dGVybl9pbmRleCA9IE51bWJlcihwYXJ0c1s0XSk7XG4gICAgY29uc3QgaW50ZXJhY3Rpb24gPSB0aGlzLmNtaS5pbnRlcmFjdGlvbnMuY2hpbGRBcnJheVtpbmRleF07XG5cbiAgICBjb25zdCBpbnRlcmFjdGlvbl9jb3VudCA9IGludGVyYWN0aW9uLmNvcnJlY3RfcmVzcG9uc2VzLl9jb3VudDtcbiAgICB0aGlzLmNoZWNrRHVwbGljYXRlQ2hvaWNlUmVzcG9uc2UoaW50ZXJhY3Rpb24sIHZhbHVlKTtcblxuICAgIGNvbnN0IHJlc3BvbnNlX3R5cGUgPSBjb3JyZWN0X3Jlc3BvbnNlc1tpbnRlcmFjdGlvbi50eXBlXTtcbiAgICBpZiAodHlwZW9mIHJlc3BvbnNlX3R5cGUubGltaXQgPT09ICd1bmRlZmluZWQnIHx8IGludGVyYWN0aW9uX2NvdW50IDw9XG4gICAgICAgIHJlc3BvbnNlX3R5cGUubGltaXQpIHtcbiAgICAgIHRoaXMuY2hlY2tWYWxpZFJlc3BvbnNlVHlwZShyZXNwb25zZV90eXBlLCB2YWx1ZSwgaW50ZXJhY3Rpb24udHlwZSk7XG5cbiAgICAgIGlmICh0aGlzLmxhc3RFcnJvckNvZGUgPT09IDAgJiZcbiAgICAgICAgICAoIXJlc3BvbnNlX3R5cGUuZHVwbGljYXRlIHx8XG4gICAgICAgICAgICAgICF0aGlzLmNoZWNrRHVwbGljYXRlZFBhdHRlcm4oaW50ZXJhY3Rpb24uY29ycmVjdF9yZXNwb25zZXMsXG4gICAgICAgICAgICAgICAgICBwYXR0ZXJuX2luZGV4LCB2YWx1ZSkpIHx8XG4gICAgICAgICAgKHRoaXMubGFzdEVycm9yQ29kZSA9PT0gMCAmJiB2YWx1ZSA9PT0gJycpKSB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmcsIHdlIHdhbnQgdGhlIGludmVyc2VcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLmxhc3RFcnJvckNvZGUgPT09IDApIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuR0VORVJBTF9TRVRfRkFJTFVSRSxcbiAgICAgICAgICAgICAgJ0RhdGEgTW9kZWwgRWxlbWVudCBQYXR0ZXJuIEFscmVhZHkgRXhpc3RzJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUsXG4gICAgICAgICAgJ0RhdGEgTW9kZWwgRWxlbWVudCBDb2xsZWN0aW9uIExpbWl0IFJlYWNoZWQnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHZhbHVlIGZyb20gdGhlIENNSSBPYmplY3RcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldENNSVZhbHVlKENNSUVsZW1lbnQpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tbW9uR2V0Q01JVmFsdWUoJ0dldFZhbHVlJywgdHJ1ZSwgQ01JRWxlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWVzc2FnZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGVycm9yTnVtYmVyLlxuICAgKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gZXJyb3JOdW1iZXJcbiAgICogQHBhcmFtIHtib29sZWFufSBkZXRhaWxcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhlcnJvck51bWJlciwgZGV0YWlsKSB7XG4gICAgbGV0IGJhc2ljTWVzc2FnZSA9ICcnO1xuICAgIGxldCBkZXRhaWxNZXNzYWdlID0gJyc7XG5cbiAgICAvLyBTZXQgZXJyb3IgbnVtYmVyIHRvIHN0cmluZyBzaW5jZSBpbmNvbnNpc3RlbnQgZnJvbSBtb2R1bGVzIGlmIHN0cmluZyBvciBudW1iZXJcbiAgICBlcnJvck51bWJlciA9IFN0cmluZyhlcnJvck51bWJlcik7XG4gICAgaWYgKHNjb3JtMjAwNF9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW2Vycm9yTnVtYmVyXSkge1xuICAgICAgYmFzaWNNZXNzYWdlID0gc2Nvcm0yMDA0X2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbZXJyb3JOdW1iZXJdLmJhc2ljTWVzc2FnZTtcbiAgICAgIGRldGFpbE1lc3NhZ2UgPSBzY29ybTIwMDRfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tlcnJvck51bWJlcl0uZGV0YWlsTWVzc2FnZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGV0YWlsID8gZGV0YWlsTWVzc2FnZSA6IGJhc2ljTWVzc2FnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB0byBzZWUgaWYgYSBjb3JyZWN0X3Jlc3BvbnNlIHZhbHVlIGhhcyBiZWVuIGR1cGxpY2F0ZWRcbiAgICogQHBhcmFtIHtDTUlBcnJheX0gY29ycmVjdF9yZXNwb25zZVxuICAgKiBAcGFyYW0ge251bWJlcn0gY3VycmVudF9pbmRleFxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBjaGVja0R1cGxpY2F0ZWRQYXR0ZXJuID0gKGNvcnJlY3RfcmVzcG9uc2UsIGN1cnJlbnRfaW5kZXgsIHZhbHVlKSA9PiB7XG4gICAgbGV0IGZvdW5kID0gZmFsc2U7XG4gICAgY29uc3QgY291bnQgPSBjb3JyZWN0X3Jlc3BvbnNlLl9jb3VudDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50ICYmICFmb3VuZDsgaSsrKSB7XG4gICAgICBpZiAoaSAhPT0gY3VycmVudF9pbmRleCAmJiBjb3JyZWN0X3Jlc3BvbnNlLmNoaWxkQXJyYXlbaV0gPT09IHZhbHVlKSB7XG4gICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZvdW5kO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDaGVja3MgZm9yIGEgdmFsaWQgY29ycmVjdF9yZXNwb25zZSB2YWx1ZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gaW50ZXJhY3Rpb25fdHlwZVxuICAgKiBAcGFyYW0ge0FycmF5fSBub2Rlc1xuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqL1xuICBjaGVja0NvcnJlY3RSZXNwb25zZVZhbHVlKGludGVyYWN0aW9uX3R5cGUsIG5vZGVzLCB2YWx1ZSkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gY29ycmVjdF9yZXNwb25zZXNbaW50ZXJhY3Rpb25fdHlwZV07XG4gICAgY29uc3QgZm9ybWF0UmVnZXggPSBuZXcgUmVnRXhwKHJlc3BvbnNlLmZvcm1hdCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGggJiYgdGhpcy5sYXN0RXJyb3JDb2RlID09PSAwOyBpKyspIHtcbiAgICAgIGlmIChpbnRlcmFjdGlvbl90eXBlLm1hdGNoKFxuICAgICAgICAgICdeKGZpbGwtaW58bG9uZy1maWxsLWlufG1hdGNoaW5nfHBlcmZvcm1hbmNlfHNlcXVlbmNpbmcpJCcpKSB7XG4gICAgICAgIG5vZGVzW2ldID0gdGhpcy5yZW1vdmVDb3JyZWN0UmVzcG9uc2VQcmVmaXhlcyhub2Rlc1tpXSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNwb25zZT8uZGVsaW1pdGVyMikge1xuICAgICAgICBjb25zdCB2YWx1ZXMgPSBub2Rlc1tpXS5zcGxpdChyZXNwb25zZS5kZWxpbWl0ZXIyKTtcbiAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICBjb25zdCBtYXRjaGVzID0gdmFsdWVzWzBdLm1hdGNoKGZvcm1hdFJlZ2V4KTtcbiAgICAgICAgICBpZiAoIW1hdGNoZXMpIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF2YWx1ZXNbMV0ubWF0Y2gobmV3IFJlZ0V4cChyZXNwb25zZS5mb3JtYXQyKSkpIHtcbiAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG1hdGNoZXMgPSBub2Rlc1tpXS5tYXRjaChmb3JtYXRSZWdleCk7XG4gICAgICAgIGlmICgoIW1hdGNoZXMgJiYgdmFsdWUgIT09ICcnKSB8fFxuICAgICAgICAgICAgKCFtYXRjaGVzICYmIGludGVyYWN0aW9uX3R5cGUgPT09ICd0cnVlLWZhbHNlJykpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGludGVyYWN0aW9uX3R5cGUgPT09ICdudW1lcmljJyAmJiBub2Rlcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBpZiAoTnVtYmVyKG5vZGVzWzBdKSA+IE51bWJlcihub2Rlc1sxXSkpIHtcbiAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobm9kZXNbaV0gIT09ICcnICYmIHJlc3BvbnNlLnVuaXF1ZSkge1xuICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGkgJiYgdGhpcy5sYXN0RXJyb3JDb2RlID09PSAwOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZXNbaV0gPT09IG5vZGVzW2pdKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBwcmVmaXhlcyBmcm9tIGNvcnJlY3RfcmVzcG9uc2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5vZGVcbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIHJlbW92ZUNvcnJlY3RSZXNwb25zZVByZWZpeGVzKG5vZGUpIHtcbiAgICBsZXQgc2Vlbk9yZGVyID0gZmFsc2U7XG4gICAgbGV0IHNlZW5DYXNlID0gZmFsc2U7XG4gICAgbGV0IHNlZW5MYW5nID0gZmFsc2U7XG5cbiAgICBjb25zdCBwcmVmaXhSZWdleCA9IG5ldyBSZWdFeHAoXG4gICAgICAgICdeKHsobGFuZ3xjYXNlX21hdHRlcnN8b3JkZXJfbWF0dGVycyk9KFtefV0rKX0pJyk7XG4gICAgbGV0IG1hdGNoZXMgPSBub2RlLm1hdGNoKHByZWZpeFJlZ2V4KTtcbiAgICBsZXQgbGFuZ01hdGNoZXMgPSBudWxsO1xuICAgIHdoaWxlIChtYXRjaGVzKSB7XG4gICAgICBzd2l0Y2ggKG1hdGNoZXNbMl0pIHtcbiAgICAgICAgY2FzZSAnbGFuZyc6XG4gICAgICAgICAgbGFuZ01hdGNoZXMgPSBub2RlLm1hdGNoKHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nY3IpO1xuICAgICAgICAgIGlmIChsYW5nTWF0Y2hlcykge1xuICAgICAgICAgICAgY29uc3QgbGFuZyA9IGxhbmdNYXRjaGVzWzNdO1xuICAgICAgICAgICAgaWYgKGxhbmcgIT09IHVuZGVmaW5lZCAmJiBsYW5nLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgaWYgKFZhbGlkTGFuZ3VhZ2VzW2xhbmcudG9Mb3dlckNhc2UoKV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzZWVuTGFuZyA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Nhc2VfbWF0dGVycyc6XG4gICAgICAgICAgaWYgKCFzZWVuTGFuZyAmJiAhc2Vlbk9yZGVyICYmICFzZWVuQ2FzZSkge1xuICAgICAgICAgICAgaWYgKG1hdGNoZXNbM10gIT09ICd0cnVlJyAmJiBtYXRjaGVzWzNdICE9PSAnZmFsc2UnKSB7XG4gICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzZWVuQ2FzZSA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ29yZGVyX21hdHRlcnMnOlxuICAgICAgICAgIGlmICghc2VlbkNhc2UgJiYgIXNlZW5MYW5nICYmICFzZWVuT3JkZXIpIHtcbiAgICAgICAgICAgIGlmIChtYXRjaGVzWzNdICE9PSAndHJ1ZScgJiYgbWF0Y2hlc1szXSAhPT0gJ2ZhbHNlJykge1xuICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2Vlbk9yZGVyID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIG5vZGUgPSBub2RlLnN1YnN0cihtYXRjaGVzWzFdLmxlbmd0aCk7XG4gICAgICBtYXRjaGVzID0gbm9kZS5tYXRjaChwcmVmaXhSZWdleCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSB0aGUgd2hvbGUgQVBJIHdpdGggYW5vdGhlclxuICAgKiBAcGFyYW0ge1Njb3JtMjAwNEFQSX0gbmV3QVBJXG4gICAqL1xuICByZXBsYWNlV2l0aEFub3RoZXJTY29ybUFQSShuZXdBUEkpIHtcbiAgICAvLyBEYXRhIE1vZGVsXG4gICAgdGhpcy5jbWkgPSBuZXdBUEkuY21pO1xuICAgIHRoaXMuYWRsID0gbmV3QVBJLmFkbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGNtaSBvYmplY3QgdG8gdGhlIHByb3BlciBmb3JtYXQgZm9yIExNUyBjb21taXRcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSB0ZXJtaW5hdGVDb21taXRcbiAgICogQHJldHVybiB7b2JqZWN0fEFycmF5fVxuICAgKi9cbiAgcmVuZGVyQ29tbWl0Q01JKHRlcm1pbmF0ZUNvbW1pdDogYm9vbGVhbikge1xuICAgIGNvbnN0IGNtaUV4cG9ydCA9IHRoaXMucmVuZGVyQ01JVG9KU09OT2JqZWN0KCk7XG5cbiAgICBpZiAodGVybWluYXRlQ29tbWl0KSB7XG4gICAgICBjbWlFeHBvcnQuY21pLnRvdGFsX3RpbWUgPSB0aGlzLmNtaS5nZXRDdXJyZW50VG90YWxUaW1lKCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgY29uc3QgZmxhdHRlbmVkID0gVXRpbGl0aWVzLmZsYXR0ZW4oY21pRXhwb3J0KTtcbiAgICBzd2l0Y2ggKHRoaXMuc2V0dGluZ3MuZGF0YUNvbW1pdEZvcm1hdCkge1xuICAgICAgY2FzZSAnZmxhdHRlbmVkJzpcbiAgICAgICAgcmV0dXJuIFV0aWxpdGllcy5mbGF0dGVuKGNtaUV4cG9ydCk7XG4gICAgICBjYXNlICdwYXJhbXMnOlxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gaW4gZmxhdHRlbmVkKSB7XG4gICAgICAgICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoZmxhdHRlbmVkLCBpdGVtKSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goYCR7aXRlbX09JHtmbGF0dGVuZWRbaXRlbV19YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICBjYXNlICdqc29uJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBjbWlFeHBvcnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHRzIHRvIHN0b3JlIHRoZSBkYXRhIHRvIHRoZSBMTVNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSB0ZXJtaW5hdGVDb21taXRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgc3RvcmVEYXRhKHRlcm1pbmF0ZUNvbW1pdDogYm9vbGVhbikge1xuICAgIGlmICh0ZXJtaW5hdGVDb21taXQpIHtcbiAgICAgIGlmICh0aGlzLmNtaS5tb2RlID09PSAnbm9ybWFsJykge1xuICAgICAgICBpZiAodGhpcy5jbWkuY3JlZGl0ID09PSAnY3JlZGl0Jykge1xuICAgICAgICAgIGlmICh0aGlzLmNtaS5jb21wbGV0aW9uX3RocmVzaG9sZCAmJiB0aGlzLmNtaS5wcm9ncmVzc19tZWFzdXJlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbWkucHJvZ3Jlc3NfbWVhc3VyZSA+PSB0aGlzLmNtaS5jb21wbGV0aW9uX3RocmVzaG9sZCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdTZXR0aW5nIENvbXBsZXRpb24gU3RhdHVzOiBDb21wbGV0ZWQnKTtcbiAgICAgICAgICAgICAgdGhpcy5jbWkuY29tcGxldGlvbl9zdGF0dXMgPSAnY29tcGxldGVkJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ1NldHRpbmcgQ29tcGxldGlvbiBTdGF0dXM6IEluY29tcGxldGUnKTtcbiAgICAgICAgICAgICAgdGhpcy5jbWkuY29tcGxldGlvbl9zdGF0dXMgPSAnaW5jb21wbGV0ZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLmNtaS5zY2FsZWRfcGFzc2luZ19zY29yZSAmJiB0aGlzLmNtaS5zY29yZS5zY2FsZWQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNtaS5zY29yZS5zY2FsZWQgPj0gdGhpcy5jbWkuc2NhbGVkX3Bhc3Npbmdfc2NvcmUpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnU2V0dGluZyBTdWNjZXNzIFN0YXR1czogUGFzc2VkJyk7XG4gICAgICAgICAgICAgIHRoaXMuY21pLnN1Y2Nlc3Nfc3RhdHVzID0gJ3Bhc3NlZCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdTZXR0aW5nIFN1Y2Nlc3MgU3RhdHVzOiBGYWlsZWQnKTtcbiAgICAgICAgICAgICAgdGhpcy5jbWkuc3VjY2Vzc19zdGF0dXMgPSAnZmFpbGVkJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgbmF2UmVxdWVzdCA9IGZhbHNlO1xuICAgIGlmICh0aGlzLmFkbC5uYXYucmVxdWVzdCAhPT0gKHRoaXMuc3RhcnRpbmdEYXRhPy5hZGw/Lm5hdj8ucmVxdWVzdCkgJiZcbiAgICAgICAgdGhpcy5hZGwubmF2LnJlcXVlc3QgIT09ICdfbm9uZV8nKSB7XG4gICAgICB0aGlzLmFkbC5uYXYucmVxdWVzdCA9IGVuY29kZVVSSUNvbXBvbmVudCh0aGlzLmFkbC5uYXYucmVxdWVzdCk7XG4gICAgICBuYXZSZXF1ZXN0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBjb21taXRPYmplY3QgPSB0aGlzLnJlbmRlckNvbW1pdENNSSh0ZXJtaW5hdGVDb21taXQgfHxcbiAgICAgICAgdGhpcy5zZXR0aW5ncy5hbHdheXNTZW5kVG90YWxUaW1lKTtcblxuICAgIGlmICh0aGlzLmFwaUxvZ0xldmVsID09PSBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9ERUJVRykge1xuICAgICAgY29uc29sZS5kZWJ1ZygnQ29tbWl0ICh0ZXJtaW5hdGVkOiAnICtcbiAgICAgICAgICAgICh0ZXJtaW5hdGVDb21taXQgPyAneWVzJyA6ICdubycpICsgJyk6ICcpO1xuICAgICAgY29uc29sZS5kZWJ1Zyhjb21taXRPYmplY3QpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5sbXNDb21taXRVcmwpIHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMucHJvY2Vzc0h0dHBSZXF1ZXN0KHRoaXMuc2V0dGluZ3MubG1zQ29tbWl0VXJsLFxuICAgICAgICAgIGNvbW1pdE9iamVjdCwgdGVybWluYXRlQ29tbWl0KTtcblxuICAgICAgLy8gY2hlY2sgaWYgdGhpcyBpcyBhIHNlcXVlbmNpbmcgY2FsbCwgYW5kIHRoZW4gY2FsbCB0aGUgbmVjZXNzYXJ5IEpTXG4gICAgICB7XG4gICAgICAgIGlmIChuYXZSZXF1ZXN0ICYmIHJlc3VsdC5uYXZSZXF1ZXN0ICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICAgIHJlc3VsdC5uYXZSZXF1ZXN0ICE9PSAnJykge1xuICAgICAgICAgIEZ1bmN0aW9uKGBcInVzZSBzdHJpY3RcIjsoKCkgPT4geyAke3Jlc3VsdC5uYXZSZXF1ZXN0fSB9KSgpYCkoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vIEBmbG93XG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCBFcnJvckNvZGVzIGZyb20gJy4uL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQgUmVnZXggZnJvbSAnLi4vY29uc3RhbnRzL3JlZ2V4JztcblxuY29uc3Qgc2Nvcm0xMl9jb25zdGFudHMgPSBBUElDb25zdGFudHMuc2Nvcm0xMjtcbmNvbnN0IHNjb3JtMTJfcmVnZXggPSBSZWdleC5zY29ybTEyO1xuY29uc3Qgc2Nvcm0xMl9lcnJvcl9jb2RlcyA9IEVycm9yQ29kZXMuc2Nvcm0xMjtcblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgdmFsdWUgbWF0Y2hlcyB0aGUgcHJvcGVyIGZvcm1hdC4gSWYgbm90LCB0aHJvdyBwcm9wZXIgZXJyb3IgY29kZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWdleFBhdHRlcm5cbiAqIEBwYXJhbSB7bnVtYmVyfSBlcnJvckNvZGVcbiAqIEBwYXJhbSB7Y2xhc3N9IGVycm9yQ2xhc3NcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWxsb3dFbXB0eVN0cmluZ1xuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrVmFsaWRGb3JtYXQoXG4gICAgdmFsdWU6IFN0cmluZyxcbiAgICByZWdleFBhdHRlcm46IFN0cmluZyxcbiAgICBlcnJvckNvZGU6IG51bWJlcixcbiAgICBlcnJvckNsYXNzOiBmdW5jdGlvbixcbiAgICBhbGxvd0VtcHR5U3RyaW5nPzogYm9vbGVhbikge1xuICBjb25zdCBmb3JtYXRSZWdleCA9IG5ldyBSZWdFeHAocmVnZXhQYXR0ZXJuKTtcbiAgY29uc3QgbWF0Y2hlcyA9IHZhbHVlLm1hdGNoKGZvcm1hdFJlZ2V4KTtcbiAgaWYgKGFsbG93RW1wdHlTdHJpbmcgJiYgdmFsdWUgPT09ICcnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgIW1hdGNoZXMgfHwgbWF0Y2hlc1swXSA9PT0gJycpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IoZXJyb3JDb2RlKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgdmFsdWUgbWF0Y2hlcyB0aGUgcHJvcGVyIHJhbmdlLiBJZiBub3QsIHRocm93IHByb3BlciBlcnJvciBjb2RlLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSByYW5nZVBhdHRlcm5cbiAqIEBwYXJhbSB7bnVtYmVyfSBlcnJvckNvZGVcbiAqIEBwYXJhbSB7Y2xhc3N9IGVycm9yQ2xhc3NcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1ZhbGlkUmFuZ2UoXG4gICAgdmFsdWU6IGFueSxcbiAgICByYW5nZVBhdHRlcm46IFN0cmluZyxcbiAgICBlcnJvckNvZGU6IG51bWJlcixcbiAgICBlcnJvckNsYXNzOiBmdW5jdGlvbikge1xuICBjb25zdCByYW5nZXMgPSByYW5nZVBhdHRlcm4uc3BsaXQoJyMnKTtcbiAgdmFsdWUgPSB2YWx1ZSAqIDEuMDtcbiAgaWYgKHZhbHVlID49IHJhbmdlc1swXSkge1xuICAgIGlmICgocmFuZ2VzWzFdID09PSAnKicpIHx8ICh2YWx1ZSA8PSByYW5nZXNbMV0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IGVycm9yQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yKGVycm9yQ29kZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBlcnJvckNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvcihlcnJvckNvZGUpO1xuICB9XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgQVBJIGNtaSBvYmplY3RzXG4gKi9cbmV4cG9ydCBjbGFzcyBCYXNlQ01JIHtcbiAganNvblN0cmluZyA9IGZhbHNlO1xuICAjaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgI3N0YXJ0X3RpbWU7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBCYXNlQ01JLCBqdXN0IG1hcmtzIHRoZSBjbGFzcyBhcyBhYnN0cmFjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKG5ldy50YXJnZXQgPT09IEJhc2VDTUkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb25zdHJ1Y3QgQmFzZUNNSSBpbnN0YW5jZXMgZGlyZWN0bHknKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaW5pdGlhbGl6ZWRcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGdldCBpbml0aWFsaXplZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jaW5pdGlhbGl6ZWQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3RhcnRfdGltZVxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XG4gICAqL1xuICBnZXQgc3RhcnRfdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jc3RhcnRfdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLiNpbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHBsYXllciBzaG91bGQgb3ZlcnJpZGUgdGhlICdzZXNzaW9uX3RpbWUnIHByb3ZpZGVkIGJ5XG4gICAqIHRoZSBtb2R1bGVcbiAgICovXG4gIHNldFN0YXJ0VGltZSgpIHtcbiAgICB0aGlzLiNzdGFydF90aW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBjbWkgKi5zY29yZSBvYmplY3RzXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlTY29yZSBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yICouc2NvcmVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjb3JlX2NoaWxkcmVuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY29yZV9yYW5nZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWF4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbnZhbGlkRXJyb3JDb2RlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbnZhbGlkVHlwZUNvZGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IGludmFsaWRSYW5nZUNvZGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlY2ltYWxSZWdleFxuICAgKiBAcGFyYW0ge2NsYXNzfSBlcnJvckNsYXNzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICAgIHtcbiAgICAgICAgc2NvcmVfY2hpbGRyZW4sXG4gICAgICAgIHNjb3JlX3JhbmdlLFxuICAgICAgICBtYXgsXG4gICAgICAgIGludmFsaWRFcnJvckNvZGUsXG4gICAgICAgIGludmFsaWRUeXBlQ29kZSxcbiAgICAgICAgaW52YWxpZFJhbmdlQ29kZSxcbiAgICAgICAgZGVjaW1hbFJlZ2V4LFxuICAgICAgICBlcnJvckNsYXNzLFxuICAgICAgfSkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLiNfY2hpbGRyZW4gPSBzY29yZV9jaGlsZHJlbiB8fFxuICAgICAgICBzY29ybTEyX2NvbnN0YW50cy5zY29yZV9jaGlsZHJlbjtcbiAgICB0aGlzLiNfc2NvcmVfcmFuZ2UgPSAhc2NvcmVfcmFuZ2UgPyBmYWxzZSA6IHNjb3JtMTJfcmVnZXguc2NvcmVfcmFuZ2U7XG4gICAgdGhpcy4jbWF4ID0gKG1heCB8fCBtYXggPT09ICcnKSA/IG1heCA6ICcxMDAnO1xuICAgIHRoaXMuI19pbnZhbGlkX2Vycm9yX2NvZGUgPSBpbnZhbGlkRXJyb3JDb2RlIHx8XG4gICAgICAgIHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUU7XG4gICAgdGhpcy4jX2ludmFsaWRfdHlwZV9jb2RlID0gaW52YWxpZFR5cGVDb2RlIHx8XG4gICAgICAgIHNjb3JtMTJfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSDtcbiAgICB0aGlzLiNfaW52YWxpZF9yYW5nZV9jb2RlID0gaW52YWxpZFJhbmdlQ29kZSB8fFxuICAgICAgICBzY29ybTEyX2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRTtcbiAgICB0aGlzLiNfZGVjaW1hbF9yZWdleCA9IGRlY2ltYWxSZWdleCB8fFxuICAgICAgICBzY29ybTEyX3JlZ2V4LkNNSURlY2ltYWw7XG4gICAgdGhpcy4jX2Vycm9yX2NsYXNzID0gZXJyb3JDbGFzcztcbiAgfVxuXG4gICNfY2hpbGRyZW47XG4gICNfc2NvcmVfcmFuZ2U7XG4gICNfaW52YWxpZF9lcnJvcl9jb2RlO1xuICAjX2ludmFsaWRfdHlwZV9jb2RlO1xuICAjX2ludmFsaWRfcmFuZ2VfY29kZTtcbiAgI19kZWNpbWFsX3JlZ2V4O1xuICAjX2Vycm9yX2NsYXNzO1xuICAjcmF3ID0gJyc7XG4gICNtaW4gPSAnJztcbiAgI21heDtcblxuICAvKipcbiAgICogR2V0dGVyIGZvciBfY2hpbGRyZW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IF9jaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvdyBuZXcgdGhpcy4jX2Vycm9yX2NsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcih0aGlzLiNfaW52YWxpZF9lcnJvcl9jb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNyYXdcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHJhdygpIHtcbiAgICByZXR1cm4gdGhpcy4jcmF3O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3Jhd1xuICAgKiBAcGFyYW0ge3N0cmluZ30gcmF3XG4gICAqL1xuICBzZXQgcmF3KHJhdykge1xuICAgIGlmIChjaGVja1ZhbGlkRm9ybWF0KHJhdywgdGhpcy4jX2RlY2ltYWxfcmVnZXgsIHRoaXMuI19pbnZhbGlkX3R5cGVfY29kZSwgdGhpcy4jX2Vycm9yX2NsYXNzKSAmJlxuICAgICAgICAoIXRoaXMuI19zY29yZV9yYW5nZSB8fFxuICAgICAgICAgICAgY2hlY2tWYWxpZFJhbmdlKHJhdywgdGhpcy4jX3Njb3JlX3JhbmdlLCB0aGlzLiNfaW52YWxpZF9yYW5nZV9jb2RlLCB0aGlzLiNfZXJyb3JfY2xhc3MpKSkge1xuICAgICAgdGhpcy4jcmF3ID0gcmF3O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNtaW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1pbigpIHtcbiAgICByZXR1cm4gdGhpcy4jbWluO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI21pblxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWluXG4gICAqL1xuICBzZXQgbWluKG1pbikge1xuICAgIGlmIChjaGVja1ZhbGlkRm9ybWF0KG1pbiwgdGhpcy4jX2RlY2ltYWxfcmVnZXgsIHRoaXMuI19pbnZhbGlkX3R5cGVfY29kZSwgdGhpcy4jX2Vycm9yX2NsYXNzKSAmJlxuICAgICAgICAoIXRoaXMuI19zY29yZV9yYW5nZSB8fFxuICAgICAgICAgICAgY2hlY2tWYWxpZFJhbmdlKG1pbiwgdGhpcy4jX3Njb3JlX3JhbmdlLCB0aGlzLiNfaW52YWxpZF9yYW5nZV9jb2RlLCB0aGlzLiNfZXJyb3JfY2xhc3MpKSkge1xuICAgICAgdGhpcy4jbWluID0gbWluO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNtYXhcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1heCgpIHtcbiAgICByZXR1cm4gdGhpcy4jbWF4O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI21heFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWF4XG4gICAqL1xuICBzZXQgbWF4KG1heCkge1xuICAgIGlmIChjaGVja1ZhbGlkRm9ybWF0KG1heCwgdGhpcy4jX2RlY2ltYWxfcmVnZXgsIHRoaXMuI19pbnZhbGlkX3R5cGVfY29kZSwgdGhpcy4jX2Vycm9yX2NsYXNzKSAmJlxuICAgICAgICAoIXRoaXMuI19zY29yZV9yYW5nZSB8fFxuICAgICAgICAgICAgY2hlY2tWYWxpZFJhbmdlKG1heCwgdGhpcy4jX3Njb3JlX3JhbmdlLCB0aGlzLiNfaW52YWxpZF9yYW5nZV9jb2RlLCB0aGlzLiNfZXJyb3JfY2xhc3MpKSkge1xuICAgICAgdGhpcy4jbWF4ID0gbWF4O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yICouc2NvcmVcbiAgICogQHJldHVybiB7e21pbjogc3RyaW5nLCBtYXg6IHN0cmluZywgcmF3OiBzdHJpbmd9fVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3Jhdyc6IHRoaXMucmF3LFxuICAgICAgJ21pbic6IHRoaXMubWluLFxuICAgICAgJ21heCc6IHRoaXMubWF4LFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgY21pICoubiBvYmplY3RzXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlBcnJheSBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgY21pICoubiBhcnJheXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNoaWxkcmVuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBlcnJvckNvZGVcbiAgICogQHBhcmFtIHtjbGFzc30gZXJyb3JDbGFzc1xuICAgKi9cbiAgY29uc3RydWN0b3Ioe2NoaWxkcmVuLCBlcnJvckNvZGUsIGVycm9yQ2xhc3N9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLiNfY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICB0aGlzLiNlcnJvckNvZGUgPSBlcnJvckNvZGU7XG4gICAgdGhpcy4jZXJyb3JDbGFzcyA9IGVycm9yQ2xhc3M7XG4gICAgdGhpcy5jaGlsZEFycmF5ID0gW107XG4gIH1cblxuICAjZXJyb3JDb2RlO1xuICAjZXJyb3JDbGFzcztcbiAgI19jaGlsZHJlbjtcblxuICAvKipcbiAgICogR2V0dGVyIGZvciBfY2hpbGRyZW5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yIF9jaGlsZHJlbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfY2hpbGRyZW5cbiAgICovXG4gIHNldCBfY2hpbGRyZW4oX2NoaWxkcmVuKSB7XG4gICAgdGhyb3cgbmV3IHRoaXMuI2Vycm9yQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yKHRoaXMuI2Vycm9yQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBfY291bnRcbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cbiAgZ2V0IF9jb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZEFycmF5Lmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yIF9jb3VudC4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBfY291bnRcbiAgICovXG4gIHNldCBfY291bnQoX2NvdW50KSB7XG4gICAgdGhyb3cgbmV3IHRoaXMuI2Vycm9yQ2xhc3MucHJvdG90eXBlLmNvbnN0cnVjdG9yKHRoaXMuI2Vycm9yQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciAqLm4gYXJyYXlzXG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHRbaSArICcnXSA9IHRoaXMuY2hpbGRBcnJheVtpXTtcbiAgICB9XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iLCIvLyBAZmxvd1xuaW1wb3J0IHtcbiAgQmFzZUNNSSxcbiAgY2hlY2tWYWxpZEZvcm1hdCxcbiAgY2hlY2tWYWxpZFJhbmdlLFxuICBDTUlBcnJheSxcbiAgQ01JU2NvcmUsXG59IGZyb20gJy4vY29tbW9uJztcbmltcG9ydCBBUElDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuaW1wb3J0IFJlZ2V4IGZyb20gJy4uL2NvbnN0YW50cy9yZWdleCc7XG5pbXBvcnQgRXJyb3JDb2RlcyBmcm9tICcuLi9jb25zdGFudHMvZXJyb3JfY29kZXMnO1xuaW1wb3J0IFJlc3BvbnNlcyBmcm9tICcuLi9jb25zdGFudHMvcmVzcG9uc2VfY29uc3RhbnRzJztcbmltcG9ydCB7U2Nvcm0yMDA0VmFsaWRhdGlvbkVycm9yfSBmcm9tICcuLi9leGNlcHRpb25zJztcbmltcG9ydCAqIGFzIFV0aWwgZnJvbSAnLi4vdXRpbGl0aWVzJztcblxuY29uc3Qgc2Nvcm0yMDA0X2NvbnN0YW50cyA9IEFQSUNvbnN0YW50cy5zY29ybTIwMDQ7XG5jb25zdCBzY29ybTIwMDRfZXJyb3JfY29kZXMgPSBFcnJvckNvZGVzLnNjb3JtMjAwNDtcbmNvbnN0IGxlYXJuZXJfcmVzcG9uc2VzID0gUmVzcG9uc2VzLmxlYXJuZXI7XG5cbmNvbnN0IHNjb3JtMjAwNF9yZWdleCA9IFJlZ2V4LnNjb3JtMjAwNDtcblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIGZvciB0aHJvd2luZyBSZWFkIE9ubHkgZXJyb3JcbiAqL1xuZnVuY3Rpb24gdGhyb3dSZWFkT25seUVycm9yKCkge1xuICB0aHJvdyBuZXcgU2Nvcm0yMDA0VmFsaWRhdGlvbkVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgV3JpdGUgT25seSBlcnJvclxuICovXG5mdW5jdGlvbiB0aHJvd1dyaXRlT25seUVycm9yKCkge1xuICB0aHJvdyBuZXcgU2Nvcm0yMDA0VmFsaWRhdGlvbkVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5XUklURV9PTkxZX0VMRU1FTlQpO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QgZm9yIHRocm93aW5nIFR5cGUgTWlzbWF0Y2ggZXJyb3JcbiAqL1xuZnVuY3Rpb24gdGhyb3dUeXBlTWlzbWF0Y2hFcnJvcigpIHtcbiAgdGhyb3cgbmV3IFNjb3JtMjAwNFZhbGlkYXRpb25FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgRGVwZW5kZW5jeSBOb3QgRXN0YWJsaXNoZWQgZXJyb3JcbiAqL1xuZnVuY3Rpb24gdGhyb3dEZXBlbmRlbmN5Tm90RXN0YWJsaXNoZWRFcnJvcigpIHtcbiAgdGhyb3cgbmV3IFNjb3JtMjAwNFZhbGlkYXRpb25FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuREVQRU5ERU5DWV9OT1RfRVNUQUJMSVNIRUQpO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QgZm9yIHRocm93aW5nIERlcGVuZGVuY3kgTm90IEVzdGFibGlzaGVkIGVycm9yXG4gKi9cbmZ1bmN0aW9uIHRocm93R2VuZXJhbFNldEVycm9yKCkge1xuICB0aHJvdyBuZXcgU2Nvcm0yMDA0VmFsaWRhdGlvbkVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5HRU5FUkFMX1NFVF9GQUlMVVJFKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kLCBubyByZWFzb24gdG8gaGF2ZSB0byBwYXNzIHRoZSBzYW1lIGVycm9yIGNvZGVzIGV2ZXJ5IHRpbWVcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWdleFBhdHRlcm5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWxsb3dFbXB0eVN0cmluZ1xuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gY2hlY2syMDA0VmFsaWRGb3JtYXQoXG4gICAgdmFsdWU6IFN0cmluZyxcbiAgICByZWdleFBhdHRlcm46IFN0cmluZyxcbiAgICBhbGxvd0VtcHR5U3RyaW5nPzogYm9vbGVhbikge1xuICByZXR1cm4gY2hlY2tWYWxpZEZvcm1hdChcbiAgICAgIHZhbHVlLFxuICAgICAgcmVnZXhQYXR0ZXJuLFxuICAgICAgc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gsXG4gICAgICBTY29ybTIwMDRWYWxpZGF0aW9uRXJyb3IsXG4gICAgICBhbGxvd0VtcHR5U3RyaW5nLFxuICApO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QsIG5vIHJlYXNvbiB0byBoYXZlIHRvIHBhc3MgdGhlIHNhbWUgZXJyb3IgY29kZXMgZXZlcnkgdGltZVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9IHJhbmdlUGF0dGVyblxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gY2hlY2syMDA0VmFsaWRSYW5nZSh2YWx1ZTogYW55LCByYW5nZVBhdHRlcm46IFN0cmluZykge1xuICByZXR1cm4gY2hlY2tWYWxpZFJhbmdlKFxuICAgICAgdmFsdWUsXG4gICAgICByYW5nZVBhdHRlcm4sXG4gICAgICBzY29ybTIwMDRfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFLFxuICAgICAgU2Nvcm0yMDA0VmFsaWRhdGlvbkVycm9yLFxuICApO1xufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBjbWkgb2JqZWN0IGZvciBTQ09STSAyMDA0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUkgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciB0aGUgU0NPUk0gMjAwNCBjbWkgb2JqZWN0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5pdGlhbGl6ZWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKGluaXRpYWxpemVkOiBib29sZWFuKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubGVhcm5lcl9wcmVmZXJlbmNlID0gbmV3IENNSUxlYXJuZXJQcmVmZXJlbmNlKCk7XG4gICAgdGhpcy5zY29yZSA9IG5ldyBTY29ybTIwMDRDTUlTY29yZSgpO1xuICAgIHRoaXMuY29tbWVudHNfZnJvbV9sZWFybmVyID0gbmV3IENNSUNvbW1lbnRzRnJvbUxlYXJuZXIoKTtcbiAgICB0aGlzLmNvbW1lbnRzX2Zyb21fbG1zID0gbmV3IENNSUNvbW1lbnRzRnJvbUxNUygpO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zID0gbmV3IENNSUludGVyYWN0aW9ucygpO1xuICAgIHRoaXMub2JqZWN0aXZlcyA9IG5ldyBDTUlPYmplY3RpdmVzKCk7XG5cbiAgICBpZiAoaW5pdGlhbGl6ZWQpIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgI192ZXJzaW9uID0gJzEuMCc7XG4gICNfY2hpbGRyZW4gPSBzY29ybTIwMDRfY29uc3RhbnRzLmNtaV9jaGlsZHJlbjtcbiAgI2NvbXBsZXRpb25fc3RhdHVzID0gJ3Vua25vd24nO1xuICAjY29tcGxldGlvbl90aHJlc2hvbGQgPSAnJztcbiAgI2NyZWRpdCA9ICdjcmVkaXQnO1xuICAjZW50cnkgPSAnJztcbiAgI2V4aXQgPSAnJztcbiAgI2xhdW5jaF9kYXRhID0gJyc7XG4gICNsZWFybmVyX2lkID0gJyc7XG4gICNsZWFybmVyX25hbWUgPSAnJztcbiAgI2xvY2F0aW9uID0gJyc7XG4gICNtYXhfdGltZV9hbGxvd2VkID0gJyc7XG4gICNtb2RlID0gJ25vcm1hbCc7XG4gICNwcm9ncmVzc19tZWFzdXJlID0gJyc7XG4gICNzY2FsZWRfcGFzc2luZ19zY29yZSA9ICcnO1xuICAjc2Vzc2lvbl90aW1lID0gJ1BUMEgwTTBTJztcbiAgI3N1Y2Nlc3Nfc3RhdHVzID0gJ3Vua25vd24nO1xuICAjc3VzcGVuZF9kYXRhID0gJyc7XG4gICN0aW1lX2xpbWl0X2FjdGlvbiA9ICdjb250aW51ZSxubyBtZXNzYWdlJztcbiAgI3RvdGFsX3RpbWUgPSAnJztcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMubGVhcm5lcl9wcmVmZXJlbmNlPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zY29yZT8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuY29tbWVudHNfZnJvbV9sZWFybmVyPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5jb21tZW50c19mcm9tX2xtcz8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5vYmplY3RpdmVzPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX3ZlcnNpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IF92ZXJzaW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNfdmVyc2lvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfdmVyc2lvbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfdmVyc2lvblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF92ZXJzaW9uKF92ZXJzaW9uKSB7XG4gICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX2NoaWxkcmVuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge251bWJlcn0gX2NoaWxkcmVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NvbXBsZXRpb25fc3RhdHVzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb21wbGV0aW9uX3N0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jY29tcGxldGlvbl9zdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29tcGxldGlvbl9zdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbXBsZXRpb25fc3RhdHVzXG4gICAqL1xuICBzZXQgY29tcGxldGlvbl9zdGF0dXMoY29tcGxldGlvbl9zdGF0dXMpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoY29tcGxldGlvbl9zdGF0dXMsIHNjb3JtMjAwNF9yZWdleC5DTUlDU3RhdHVzKSkge1xuICAgICAgdGhpcy4jY29tcGxldGlvbl9zdGF0dXMgPSBjb21wbGV0aW9uX3N0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29tcGxldGlvbl90aHJlc2hvbGRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbXBsZXRpb25fdGhyZXNob2xkKCkge1xuICAgIHJldHVybiB0aGlzLiNjb21wbGV0aW9uX3RocmVzaG9sZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb21wbGV0aW9uX3RocmVzaG9sZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21wbGV0aW9uX3RocmVzaG9sZFxuICAgKi9cbiAgc2V0IGNvbXBsZXRpb25fdGhyZXNob2xkKGNvbXBsZXRpb25fdGhyZXNob2xkKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgdGhpcy4jY29tcGxldGlvbl90aHJlc2hvbGQgPSBjb21wbGV0aW9uX3RocmVzaG9sZCA6XG4gICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjcmVkaXRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNyZWRpdCgpIHtcbiAgICByZXR1cm4gdGhpcy4jY3JlZGl0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NyZWRpdC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjcmVkaXRcbiAgICovXG4gIHNldCBjcmVkaXQoY3JlZGl0KSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNjcmVkaXQgPSBjcmVkaXQgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNlbnRyeVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZW50cnkoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2VudHJ5O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2VudHJ5LiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGVudHJ5XG4gICAqL1xuICBzZXQgZW50cnkoZW50cnkpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI2VudHJ5ID0gZW50cnkgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNleGl0LiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZXhpdCgpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jZXhpdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNleGl0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBleGl0XG4gICAqL1xuICBzZXQgZXhpdChleGl0KSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGV4aXQsIHNjb3JtMjAwNF9yZWdleC5DTUlFeGl0LCB0cnVlKSkge1xuICAgICAgdGhpcy4jZXhpdCA9IGV4aXQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xhdW5jaF9kYXRhXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsYXVuY2hfZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGF1bmNoX2RhdGE7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGF1bmNoX2RhdGEuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGF1bmNoX2RhdGFcbiAgICovXG4gIHNldCBsYXVuY2hfZGF0YShsYXVuY2hfZGF0YSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jbGF1bmNoX2RhdGEgPSBsYXVuY2hfZGF0YSA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xlYXJuZXJfaWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlYXJuZXJfaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xlYXJuZXJfaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGVhcm5lcl9pZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZWFybmVyX2lkXG4gICAqL1xuICBzZXQgbGVhcm5lcl9pZChsZWFybmVyX2lkKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNsZWFybmVyX2lkID0gbGVhcm5lcl9pZCA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xlYXJuZXJfbmFtZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVhcm5lcl9uYW1lKCkge1xuICAgIHJldHVybiB0aGlzLiNsZWFybmVyX25hbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGVhcm5lcl9uYW1lLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlYXJuZXJfbmFtZVxuICAgKi9cbiAgc2V0IGxlYXJuZXJfbmFtZShsZWFybmVyX25hbWUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICB0aGlzLiNsZWFybmVyX25hbWUgPSBsZWFybmVyX25hbWUgOlxuICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbG9jYXRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxvY2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNsb2NhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsb2NhdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb25cbiAgICovXG4gIHNldCBsb2NhdGlvbihsb2NhdGlvbikge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChsb2NhdGlvbiwgc2Nvcm0yMDA0X3JlZ2V4LkNNSVN0cmluZzEwMDApKSB7XG4gICAgICB0aGlzLiNsb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNtYXhfdGltZV9hbGxvd2VkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBtYXhfdGltZV9hbGxvd2VkKCkge1xuICAgIHJldHVybiB0aGlzLiNtYXhfdGltZV9hbGxvd2VkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI21heF90aW1lX2FsbG93ZWQuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWF4X3RpbWVfYWxsb3dlZFxuICAgKi9cbiAgc2V0IG1heF90aW1lX2FsbG93ZWQobWF4X3RpbWVfYWxsb3dlZCkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgIHRoaXMuI21heF90aW1lX2FsbG93ZWQgPSBtYXhfdGltZV9hbGxvd2VkIDpcbiAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI21vZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI21vZGU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbW9kZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtb2RlXG4gICAqL1xuICBzZXQgbW9kZShtb2RlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNtb2RlID0gbW9kZSA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3Byb2dyZXNzX21lYXN1cmVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHByb2dyZXNzX21lYXN1cmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3Byb2dyZXNzX21lYXN1cmU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcHJvZ3Jlc3NfbWVhc3VyZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvZ3Jlc3NfbWVhc3VyZVxuICAgKi9cbiAgc2V0IHByb2dyZXNzX21lYXN1cmUocHJvZ3Jlc3NfbWVhc3VyZSkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChwcm9ncmVzc19tZWFzdXJlLCBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCkgJiZcbiAgICAgIGNoZWNrMjAwNFZhbGlkUmFuZ2UocHJvZ3Jlc3NfbWVhc3VyZSwgc2Nvcm0yMDA0X3JlZ2V4LnByb2dyZXNzX3JhbmdlKSkge1xuICAgICAgdGhpcy4jcHJvZ3Jlc3NfbWVhc3VyZSA9IHByb2dyZXNzX21lYXN1cmU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3NjYWxlZF9wYXNzaW5nX3Njb3JlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzY2FsZWRfcGFzc2luZ19zY29yZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jc2NhbGVkX3Bhc3Npbmdfc2NvcmU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc2NhbGVkX3Bhc3Npbmdfc2NvcmUuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NhbGVkX3Bhc3Npbmdfc2NvcmVcbiAgICovXG4gIHNldCBzY2FsZWRfcGFzc2luZ19zY29yZShzY2FsZWRfcGFzc2luZ19zY29yZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgIHRoaXMuI3NjYWxlZF9wYXNzaW5nX3Njb3JlID0gc2NhbGVkX3Bhc3Npbmdfc2NvcmUgOlxuICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc2Vzc2lvbl90aW1lLiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc2Vzc2lvbl90aW1lKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNzZXNzaW9uX3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc2Vzc2lvbl90aW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZXNzaW9uX3RpbWVcbiAgICovXG4gIHNldCBzZXNzaW9uX3RpbWUoc2Vzc2lvbl90aW1lKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHNlc3Npb25fdGltZSwgc2Nvcm0yMDA0X3JlZ2V4LkNNSVRpbWVzcGFuKSkge1xuICAgICAgdGhpcy4jc2Vzc2lvbl90aW1lID0gc2Vzc2lvbl90aW1lO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdWNjZXNzX3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3VjY2Vzc19zdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N1Y2Nlc3Nfc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N1Y2Nlc3Nfc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdWNjZXNzX3N0YXR1c1xuICAgKi9cbiAgc2V0IHN1Y2Nlc3Nfc3RhdHVzKHN1Y2Nlc3Nfc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHN1Y2Nlc3Nfc3RhdHVzLCBzY29ybTIwMDRfcmVnZXguQ01JU1N0YXR1cykpIHtcbiAgICAgIHRoaXMuI3N1Y2Nlc3Nfc3RhdHVzID0gc3VjY2Vzc19zdGF0dXM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N1c3BlbmRfZGF0YVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3VzcGVuZF9kYXRhKCkge1xuICAgIHJldHVybiB0aGlzLiNzdXNwZW5kX2RhdGE7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3VzcGVuZF9kYXRhXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdXNwZW5kX2RhdGFcbiAgICovXG4gIHNldCBzdXNwZW5kX2RhdGEoc3VzcGVuZF9kYXRhKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHN1c3BlbmRfZGF0YSwgc2Nvcm0yMDA0X3JlZ2V4LkNNSVN0cmluZzY0MDAwLFxuICAgICAgICB0cnVlKSkge1xuICAgICAgdGhpcy4jc3VzcGVuZF9kYXRhID0gc3VzcGVuZF9kYXRhO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0aW1lX2xpbWl0X2FjdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGltZV9saW1pdF9hY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWVfbGltaXRfYWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpbWVfbGltaXRfYWN0aW9uLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVfbGltaXRfYWN0aW9uXG4gICAqL1xuICBzZXQgdGltZV9saW1pdF9hY3Rpb24odGltZV9saW1pdF9hY3Rpb24pIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICB0aGlzLiN0aW1lX2xpbWl0X2FjdGlvbiA9IHRpbWVfbGltaXRfYWN0aW9uIDpcbiAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RvdGFsX3RpbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRvdGFsX3RpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RvdGFsX3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdG90YWxfdGltZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3RhbF90aW1lXG4gICAqL1xuICBzZXQgdG90YWxfdGltZSh0b3RhbF90aW1lKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiN0b3RhbF90aW1lID0gdG90YWxfdGltZSA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgdGhlIGN1cnJlbnQgc2Vzc2lvbiB0aW1lIHRvIHRoZSBleGlzdGluZyB0b3RhbCB0aW1lLlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IElTTzg2MDEgRHVyYXRpb25cbiAgICovXG4gIGdldEN1cnJlbnRUb3RhbFRpbWUoKSB7XG4gICAgbGV0IHNlc3Npb25UaW1lID0gdGhpcy4jc2Vzc2lvbl90aW1lO1xuICAgIGNvbnN0IHN0YXJ0VGltZSA9IHRoaXMuc3RhcnRfdGltZTtcblxuICAgIGlmICh0eXBlb2Ygc3RhcnRUaW1lICE9PSAndW5kZWZpbmVkJyAmJiBzdGFydFRpbWUgIT09IG51bGwpIHtcbiAgICAgIGNvbnN0IHNlY29uZHMgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0YXJ0VGltZTtcbiAgICAgIHNlc3Npb25UaW1lID0gVXRpbC5nZXRTZWNvbmRzQXNJU09EdXJhdGlvbihzZWNvbmRzIC8gMTAwMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIFV0aWwuYWRkVHdvRHVyYXRpb25zKFxuICAgICAgICB0aGlzLiN0b3RhbF90aW1lLFxuICAgICAgICBzZXNzaW9uVGltZSxcbiAgICAgICAgc2Nvcm0yMDA0X3JlZ2V4LkNNSVRpbWVzcGFuLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWlcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBjb21tZW50c19mcm9tX2xlYXJuZXI6IENNSUNvbW1lbnRzRnJvbUxlYXJuZXIsXG4gICAqICAgICAgY29tbWVudHNfZnJvbV9sbXM6IENNSUNvbW1lbnRzRnJvbUxNUyxcbiAgICogICAgICBjb21wbGV0aW9uX3N0YXR1czogc3RyaW5nLFxuICAgKiAgICAgIGNvbXBsZXRpb25fdGhyZXNob2xkOiBzdHJpbmcsXG4gICAqICAgICAgY3JlZGl0OiBzdHJpbmcsXG4gICAqICAgICAgZW50cnk6IHN0cmluZyxcbiAgICogICAgICBleGl0OiBzdHJpbmcsXG4gICAqICAgICAgaW50ZXJhY3Rpb25zOiBDTUlJbnRlcmFjdGlvbnMsXG4gICAqICAgICAgbGF1bmNoX2RhdGE6IHN0cmluZyxcbiAgICogICAgICBsZWFybmVyX2lkOiBzdHJpbmcsXG4gICAqICAgICAgbGVhcm5lcl9uYW1lOiBzdHJpbmcsXG4gICAqICAgICAgbGVhcm5lcl9wcmVmZXJlbmNlOiBDTUlMZWFybmVyUHJlZmVyZW5jZSxcbiAgICogICAgICBsb2NhdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIG1heF90aW1lX2FsbG93ZWQ6IHN0cmluZyxcbiAgICogICAgICBtb2RlOiBzdHJpbmcsXG4gICAqICAgICAgb2JqZWN0aXZlczogQ01JT2JqZWN0aXZlcyxcbiAgICogICAgICBwcm9ncmVzc19tZWFzdXJlOiBzdHJpbmcsXG4gICAqICAgICAgc2NhbGVkX3Bhc3Npbmdfc2NvcmU6IHN0cmluZyxcbiAgICogICAgICBzY29yZTogU2Nvcm0yMDA0Q01JU2NvcmUsXG4gICAqICAgICAgc2Vzc2lvbl90aW1lOiBzdHJpbmcsXG4gICAqICAgICAgc3VjY2Vzc19zdGF0dXM6IHN0cmluZyxcbiAgICogICAgICBzdXNwZW5kX2RhdGE6IHN0cmluZyxcbiAgICogICAgICB0aW1lX2xpbWl0X2FjdGlvbjogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdjb21tZW50c19mcm9tX2xlYXJuZXInOiB0aGlzLmNvbW1lbnRzX2Zyb21fbGVhcm5lcixcbiAgICAgICdjb21tZW50c19mcm9tX2xtcyc6IHRoaXMuY29tbWVudHNfZnJvbV9sbXMsXG4gICAgICAnY29tcGxldGlvbl9zdGF0dXMnOiB0aGlzLmNvbXBsZXRpb25fc3RhdHVzLFxuICAgICAgJ2NvbXBsZXRpb25fdGhyZXNob2xkJzogdGhpcy5jb21wbGV0aW9uX3RocmVzaG9sZCxcbiAgICAgICdjcmVkaXQnOiB0aGlzLmNyZWRpdCxcbiAgICAgICdlbnRyeSc6IHRoaXMuZW50cnksXG4gICAgICAnZXhpdCc6IHRoaXMuZXhpdCxcbiAgICAgICdpbnRlcmFjdGlvbnMnOiB0aGlzLmludGVyYWN0aW9ucyxcbiAgICAgICdsYXVuY2hfZGF0YSc6IHRoaXMubGF1bmNoX2RhdGEsXG4gICAgICAnbGVhcm5lcl9pZCc6IHRoaXMubGVhcm5lcl9pZCxcbiAgICAgICdsZWFybmVyX25hbWUnOiB0aGlzLmxlYXJuZXJfbmFtZSxcbiAgICAgICdsZWFybmVyX3ByZWZlcmVuY2UnOiB0aGlzLmxlYXJuZXJfcHJlZmVyZW5jZSxcbiAgICAgICdsb2NhdGlvbic6IHRoaXMubG9jYXRpb24sXG4gICAgICAnbWF4X3RpbWVfYWxsb3dlZCc6IHRoaXMubWF4X3RpbWVfYWxsb3dlZCxcbiAgICAgICdtb2RlJzogdGhpcy5tb2RlLFxuICAgICAgJ29iamVjdGl2ZXMnOiB0aGlzLm9iamVjdGl2ZXMsXG4gICAgICAncHJvZ3Jlc3NfbWVhc3VyZSc6IHRoaXMucHJvZ3Jlc3NfbWVhc3VyZSxcbiAgICAgICdzY2FsZWRfcGFzc2luZ19zY29yZSc6IHRoaXMuc2NhbGVkX3Bhc3Npbmdfc2NvcmUsXG4gICAgICAnc2NvcmUnOiB0aGlzLnNjb3JlLFxuICAgICAgJ3Nlc3Npb25fdGltZSc6IHRoaXMuc2Vzc2lvbl90aW1lLFxuICAgICAgJ3N1Y2Nlc3Nfc3RhdHVzJzogdGhpcy5zdWNjZXNzX3N0YXR1cyxcbiAgICAgICdzdXNwZW5kX2RhdGEnOiB0aGlzLnN1c3BlbmRfZGF0YSxcbiAgICAgICd0aW1lX2xpbWl0X2FjdGlvbic6IHRoaXMudGltZV9saW1pdF9hY3Rpb24sXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgU0NPUk0gMjAwNCdzIGNtaS5sZWFybmVyX3ByZWZlcmVuY2Ugb2JqZWN0XG4gKi9cbmNsYXNzIENNSUxlYXJuZXJQcmVmZXJlbmNlIGV4dGVuZHMgQmFzZUNNSSB7XG4gICNfY2hpbGRyZW4gPSBzY29ybTIwMDRfY29uc3RhbnRzLnN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbjtcbiAgI2F1ZGlvX2xldmVsID0gJzEnO1xuICAjbGFuZ3VhZ2UgPSAnJztcbiAgI2RlbGl2ZXJ5X3NwZWVkID0gJzEnO1xuICAjYXVkaW9fY2FwdGlvbmluZyA9ICcwJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5sZWFybmVyX3ByZWZlcmVuY2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX2NoaWxkcmVuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX2NoaWxkcmVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2F1ZGlvX2xldmVsXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBhdWRpb19sZXZlbCgpIHtcbiAgICByZXR1cm4gdGhpcy4jYXVkaW9fbGV2ZWw7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjYXVkaW9fbGV2ZWxcbiAgICogQHBhcmFtIHtzdHJpbmd9IGF1ZGlvX2xldmVsXG4gICAqL1xuICBzZXQgYXVkaW9fbGV2ZWwoYXVkaW9fbGV2ZWwpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoYXVkaW9fbGV2ZWwsIHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsKSAmJlxuICAgICAgY2hlY2syMDA0VmFsaWRSYW5nZShhdWRpb19sZXZlbCwgc2Nvcm0yMDA0X3JlZ2V4LmF1ZGlvX3JhbmdlKSkge1xuICAgICAgdGhpcy4jYXVkaW9fbGV2ZWwgPSBhdWRpb19sZXZlbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGFuZ3VhZ2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxhbmd1YWdlKCkge1xuICAgIHJldHVybiB0aGlzLiNsYW5ndWFnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsYW5ndWFnZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGFuZ3VhZ2VcbiAgICovXG4gIHNldCBsYW5ndWFnZShsYW5ndWFnZSkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChsYW5ndWFnZSwgc2Nvcm0yMDA0X3JlZ2V4LkNNSUxhbmcpKSB7XG4gICAgICB0aGlzLiNsYW5ndWFnZSA9IGxhbmd1YWdlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNkZWxpdmVyeV9zcGVlZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZGVsaXZlcnlfc3BlZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2RlbGl2ZXJ5X3NwZWVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2RlbGl2ZXJ5X3NwZWVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkZWxpdmVyeV9zcGVlZFxuICAgKi9cbiAgc2V0IGRlbGl2ZXJ5X3NwZWVkKGRlbGl2ZXJ5X3NwZWVkKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGRlbGl2ZXJ5X3NwZWVkLCBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCkgJiZcbiAgICAgIGNoZWNrMjAwNFZhbGlkUmFuZ2UoZGVsaXZlcnlfc3BlZWQsIHNjb3JtMjAwNF9yZWdleC5zcGVlZF9yYW5nZSkpIHtcbiAgICAgIHRoaXMuI2RlbGl2ZXJ5X3NwZWVkID0gZGVsaXZlcnlfc3BlZWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2F1ZGlvX2NhcHRpb25pbmdcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGF1ZGlvX2NhcHRpb25pbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2F1ZGlvX2NhcHRpb25pbmc7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjYXVkaW9fY2FwdGlvbmluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gYXVkaW9fY2FwdGlvbmluZ1xuICAgKi9cbiAgc2V0IGF1ZGlvX2NhcHRpb25pbmcoYXVkaW9fY2FwdGlvbmluZykge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChhdWRpb19jYXB0aW9uaW5nLCBzY29ybTIwMDRfcmVnZXguQ01JU0ludGVnZXIpICYmXG4gICAgICBjaGVjazIwMDRWYWxpZFJhbmdlKGF1ZGlvX2NhcHRpb25pbmcsIHNjb3JtMjAwNF9yZWdleC50ZXh0X3JhbmdlKSkge1xuICAgICAgdGhpcy4jYXVkaW9fY2FwdGlvbmluZyA9IGF1ZGlvX2NhcHRpb25pbmc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmxlYXJuZXJfcHJlZmVyZW5jZVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGF1ZGlvX2xldmVsOiBzdHJpbmcsXG4gICAqICAgICAgbGFuZ3VhZ2U6IHN0cmluZyxcbiAgICogICAgICBkZWxpdmVyeV9zcGVlZDogc3RyaW5nLFxuICAgKiAgICAgIGF1ZGlvX2NhcHRpb25pbmc6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnYXVkaW9fbGV2ZWwnOiB0aGlzLmF1ZGlvX2xldmVsLFxuICAgICAgJ2xhbmd1YWdlJzogdGhpcy5sYW5ndWFnZSxcbiAgICAgICdkZWxpdmVyeV9zcGVlZCc6IHRoaXMuZGVsaXZlcnlfc3BlZWQsXG4gICAgICAnYXVkaW9fY2FwdGlvbmluZyc6IHRoaXMuYXVkaW9fY2FwdGlvbmluZyxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmludGVyYWN0aW9ucyBvYmplY3RcbiAqL1xuY2xhc3MgQ01JSW50ZXJhY3Rpb25zIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5vYmplY3RpdmVzIEFycmF5XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogc2Nvcm0yMDA0X2NvbnN0YW50cy5pbnRlcmFjdGlvbnNfY2hpbGRyZW4sXG4gICAgICBlcnJvckNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCxcbiAgICAgIGVycm9yQ2xhc3M6IFNjb3JtMjAwNFZhbGlkYXRpb25FcnJvcixcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLm9iamVjdGl2ZXMgb2JqZWN0XG4gKi9cbmNsYXNzIENNSU9iamVjdGl2ZXMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLm9iamVjdGl2ZXMgQXJyYXlcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHtcbiAgICAgIGNoaWxkcmVuOiBzY29ybTIwMDRfY29uc3RhbnRzLm9iamVjdGl2ZXNfY2hpbGRyZW4sXG4gICAgICBlcnJvckNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCxcbiAgICAgIGVycm9yQ2xhc3M6IFNjb3JtMjAwNFZhbGlkYXRpb25FcnJvcixcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmNvbW1lbnRzX2Zyb21fbG1zIG9iamVjdFxuICovXG5jbGFzcyBDTUlDb21tZW50c0Zyb21MTVMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmNvbW1lbnRzX2Zyb21fbG1zIEFycmF5XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogc2Nvcm0yMDA0X2NvbnN0YW50cy5jb21tZW50c19jaGlsZHJlbixcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5ULFxuICAgICAgZXJyb3JDbGFzczogU2Nvcm0yMDA0VmFsaWRhdGlvbkVycm9yLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDIwMDQncyBjbWkuY29tbWVudHNfZnJvbV9sZWFybmVyIG9iamVjdFxuICovXG5jbGFzcyBDTUlDb21tZW50c0Zyb21MZWFybmVyIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5jb21tZW50c19mcm9tX2xlYXJuZXIgQXJyYXlcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHtcbiAgICAgIGNoaWxkcmVuOiBzY29ybTIwMDRfY29uc3RhbnRzLmNvbW1lbnRzX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQsXG4gICAgICBlcnJvckNsYXNzOiBTY29ybTIwMDRWYWxpZGF0aW9uRXJyb3IsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgU0NPUk0gMjAwNCdzIGNtaS5pbnRlcmFjdGlvbi5uIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JSW50ZXJhY3Rpb25zT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNpZCA9ICcnO1xuICAjdHlwZSA9ICcnO1xuICAjdGltZXN0YW1wID0gJyc7XG4gICN3ZWlnaHRpbmcgPSAnJztcbiAgI2xlYXJuZXJfcmVzcG9uc2UgPSAnJztcbiAgI3Jlc3VsdCA9ICcnO1xuICAjbGF0ZW5jeSA9ICcnO1xuICAjZGVzY3JpcHRpb24gPSAnJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5pbnRlcmFjdGlvbi5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5vYmplY3RpdmVzID0gbmV3IENNSUFycmF5KHtcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5ULFxuICAgICAgZXJyb3JDbGFzczogU2Nvcm0yMDA0VmFsaWRhdGlvbkVycm9yLFxuICAgICAgY2hpbGRyZW46IHNjb3JtMjAwNF9jb25zdGFudHMub2JqZWN0aXZlc19jaGlsZHJlbixcbiAgICB9KTtcbiAgICB0aGlzLmNvcnJlY3RfcmVzcG9uc2VzID0gbmV3IENNSUFycmF5KHtcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5ULFxuICAgICAgZXJyb3JDbGFzczogU2Nvcm0yMDA0VmFsaWRhdGlvbkVycm9yLFxuICAgICAgY2hpbGRyZW46IHNjb3JtMjAwNF9jb25zdGFudHMuY29ycmVjdF9yZXNwb25zZXNfY2hpbGRyZW4sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMub2JqZWN0aXZlcz8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuY29ycmVjdF9yZXNwb25zZXM/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNpZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGlkLCBzY29ybTIwMDRfcmVnZXguQ01JTG9uZ0lkZW50aWZpZXIpKSB7XG4gICAgICB0aGlzLiNpZCA9IGlkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0eXBlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiB0aGlzLiN0eXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3R5cGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAgICovXG4gIHNldCB0eXBlKHR5cGUpIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNpZCA9PT0gJycpIHtcbiAgICAgIHRocm93RGVwZW5kZW5jeU5vdEVzdGFibGlzaGVkRXJyb3IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHR5cGUsIHNjb3JtMjAwNF9yZWdleC5DTUlUeXBlKSkge1xuICAgICAgICB0aGlzLiN0eXBlID0gdHlwZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZXN0YW1wXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lc3RhbXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWVzdGFtcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lc3RhbXBcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVzdGFtcFxuICAgKi9cbiAgc2V0IHRpbWVzdGFtcCh0aW1lc3RhbXApIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNpZCA9PT0gJycpIHtcbiAgICAgIHRocm93RGVwZW5kZW5jeU5vdEVzdGFibGlzaGVkRXJyb3IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHRpbWVzdGFtcCwgc2Nvcm0yMDA0X3JlZ2V4LkNNSVRpbWUpKSB7XG4gICAgICAgIHRoaXMuI3RpbWVzdGFtcCA9IHRpbWVzdGFtcDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjd2VpZ2h0aW5nXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB3ZWlnaHRpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3dlaWdodGluZztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN3ZWlnaHRpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IHdlaWdodGluZ1xuICAgKi9cbiAgc2V0IHdlaWdodGluZyh3ZWlnaHRpbmcpIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNpZCA9PT0gJycpIHtcbiAgICAgIHRocm93RGVwZW5kZW5jeU5vdEVzdGFibGlzaGVkRXJyb3IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHdlaWdodGluZywgc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwpKSB7XG4gICAgICAgIHRoaXMuI3dlaWdodGluZyA9IHdlaWdodGluZztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGVhcm5lcl9yZXNwb25zZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVhcm5lcl9yZXNwb25zZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGVhcm5lcl9yZXNwb25zZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsZWFybmVyX3Jlc3BvbnNlLiBEb2VzIHR5cGUgdmFsaWRhdGlvbiB0byBtYWtlIHN1cmUgcmVzcG9uc2VcbiAgICogbWF0Y2hlcyBTQ09STSAyMDA0J3Mgc3BlY1xuICAgKiBAcGFyYW0ge3N0cmluZ30gbGVhcm5lcl9yZXNwb25zZVxuICAgKi9cbiAgc2V0IGxlYXJuZXJfcmVzcG9uc2UobGVhcm5lcl9yZXNwb25zZSkge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkICYmICh0aGlzLiN0eXBlID09PSAnJyB8fCB0aGlzLiNpZCA9PT0gJycpKSB7XG4gICAgICB0aHJvd0RlcGVuZGVuY3lOb3RFc3RhYmxpc2hlZEVycm9yKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBub2RlcyA9IFtdO1xuICAgICAgY29uc3QgcmVzcG9uc2VfdHlwZSA9IGxlYXJuZXJfcmVzcG9uc2VzW3RoaXMudHlwZV07XG4gICAgICBpZiAocmVzcG9uc2VfdHlwZSkge1xuICAgICAgICBpZiAocmVzcG9uc2VfdHlwZT8uZGVsaW1pdGVyKSB7XG4gICAgICAgICAgbm9kZXMgPSBsZWFybmVyX3Jlc3BvbnNlLnNwbGl0KHJlc3BvbnNlX3R5cGUuZGVsaW1pdGVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub2Rlc1swXSA9IGxlYXJuZXJfcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKG5vZGVzLmxlbmd0aCA+IDApICYmIChub2Rlcy5sZW5ndGggPD0gcmVzcG9uc2VfdHlwZS5tYXgpKSB7XG4gICAgICAgICAgY29uc3QgZm9ybWF0UmVnZXggPSBuZXcgUmVnRXhwKHJlc3BvbnNlX3R5cGUuZm9ybWF0KTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2VfdHlwZT8uZGVsaW1pdGVyMikge1xuICAgICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBub2Rlc1tpXS5zcGxpdChyZXNwb25zZV90eXBlLmRlbGltaXRlcjIpO1xuICAgICAgICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgIGlmICghdmFsdWVzWzBdLm1hdGNoKGZvcm1hdFJlZ2V4KSkge1xuICAgICAgICAgICAgICAgICAgdGhyb3dUeXBlTWlzbWF0Y2hFcnJvcigpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBpZiAoIXZhbHVlc1sxXS5tYXRjaChuZXcgUmVnRXhwKHJlc3BvbnNlX3R5cGUuZm9ybWF0MikpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93VHlwZU1pc21hdGNoRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3dUeXBlTWlzbWF0Y2hFcnJvcigpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoIW5vZGVzW2ldLm1hdGNoKGZvcm1hdFJlZ2V4KSkge1xuICAgICAgICAgICAgICAgIHRocm93VHlwZU1pc21hdGNoRXJyb3IoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZXNbaV0gIT09ICcnICYmIHJlc3BvbnNlX3R5cGUudW5pcXVlKSB7XG4gICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZXNbaV0gPT09IG5vZGVzW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhyb3dUeXBlTWlzbWF0Y2hFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93R2VuZXJhbFNldEVycm9yKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiNsZWFybmVyX3Jlc3BvbnNlID0gbGVhcm5lcl9yZXNwb25zZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93VHlwZU1pc21hdGNoRXJyb3IoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjcmVzdWx0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCByZXN1bHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3Jlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNyZXN1bHRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlc3VsdFxuICAgKi9cbiAgc2V0IHJlc3VsdChyZXN1bHQpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQocmVzdWx0LCBzY29ybTIwMDRfcmVnZXguQ01JUmVzdWx0KSkge1xuICAgICAgdGhpcy4jcmVzdWx0ID0gcmVzdWx0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsYXRlbmN5XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsYXRlbmN5KCkge1xuICAgIHJldHVybiB0aGlzLiNsYXRlbmN5O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xhdGVuY3lcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhdGVuY3lcbiAgICovXG4gIHNldCBsYXRlbmN5KGxhdGVuY3kpIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNpZCA9PT0gJycpIHtcbiAgICAgIHRocm93RGVwZW5kZW5jeU5vdEVzdGFibGlzaGVkRXJyb3IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGxhdGVuY3ksIHNjb3JtMjAwNF9yZWdleC5DTUlUaW1lc3BhbikpIHtcbiAgICAgICAgdGhpcy4jbGF0ZW5jeSA9IGxhdGVuY3k7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2Rlc2NyaXB0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBkZXNjcmlwdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jZGVzY3JpcHRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZGVzY3JpcHRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyaXB0aW9uXG4gICAqL1xuICBzZXQgZGVzY3JpcHRpb24oZGVzY3JpcHRpb24pIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNpZCA9PT0gJycpIHtcbiAgICAgIHRocm93RGVwZW5kZW5jeU5vdEVzdGFibGlzaGVkRXJyb3IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGRlc2NyaXB0aW9uLCBzY29ybTIwMDRfcmVnZXguQ01JTGFuZ1N0cmluZzI1MCxcbiAgICAgICAgICB0cnVlKSkge1xuICAgICAgICB0aGlzLiNkZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5pbnRlcmFjdGlvbnMublxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGlkOiBzdHJpbmcsXG4gICAqICAgICAgdHlwZTogc3RyaW5nLFxuICAgKiAgICAgIG9iamVjdGl2ZXM6IENNSUFycmF5LFxuICAgKiAgICAgIHRpbWVzdGFtcDogc3RyaW5nLFxuICAgKiAgICAgIGNvcnJlY3RfcmVzcG9uc2VzOiBDTUlBcnJheSxcbiAgICogICAgICB3ZWlnaHRpbmc6IHN0cmluZyxcbiAgICogICAgICBsZWFybmVyX3Jlc3BvbnNlOiBzdHJpbmcsXG4gICAqICAgICAgcmVzdWx0OiBzdHJpbmcsXG4gICAqICAgICAgbGF0ZW5jeTogc3RyaW5nLFxuICAgKiAgICAgIGRlc2NyaXB0aW9uOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICAgICd0eXBlJzogdGhpcy50eXBlLFxuICAgICAgJ29iamVjdGl2ZXMnOiB0aGlzLm9iamVjdGl2ZXMsXG4gICAgICAndGltZXN0YW1wJzogdGhpcy50aW1lc3RhbXAsXG4gICAgICAnd2VpZ2h0aW5nJzogdGhpcy53ZWlnaHRpbmcsXG4gICAgICAnbGVhcm5lcl9yZXNwb25zZSc6IHRoaXMubGVhcm5lcl9yZXNwb25zZSxcbiAgICAgICdyZXN1bHQnOiB0aGlzLnJlc3VsdCxcbiAgICAgICdsYXRlbmN5JzogdGhpcy5sYXRlbmN5LFxuICAgICAgJ2Rlc2NyaXB0aW9uJzogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgICdjb3JyZWN0X3Jlc3BvbnNlcyc6IHRoaXMuY29ycmVjdF9yZXNwb25zZXMsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgU0NPUk0gMjAwNCdzIGNtaS5vYmplY3RpdmVzLm4gb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlPYmplY3RpdmVzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNpZCA9ICcnO1xuICAjc3VjY2Vzc19zdGF0dXMgPSAndW5rbm93bic7XG4gICNjb21wbGV0aW9uX3N0YXR1cyA9ICd1bmtub3duJztcbiAgI3Byb2dyZXNzX21lYXN1cmUgPSAnJztcbiAgI2Rlc2NyaXB0aW9uID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkub2JqZWN0aXZlcy5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zY29yZSA9IG5ldyBTY29ybTIwMDRDTUlTY29yZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnNjb3JlPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLiNpZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNpZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICovXG4gIHNldCBpZChpZCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChpZCwgc2Nvcm0yMDA0X3JlZ2V4LkNNSUxvbmdJZGVudGlmaWVyKSkge1xuICAgICAgdGhpcy4jaWQgPSBpZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3VjY2Vzc19zdGF0dXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN1Y2Nlc3Nfc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNzdWNjZXNzX3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdWNjZXNzX3N0YXR1c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gc3VjY2Vzc19zdGF0dXNcbiAgICovXG4gIHNldCBzdWNjZXNzX3N0YXR1cyhzdWNjZXNzX3N0YXR1cykge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkICYmIHRoaXMuI2lkID09PSAnJykge1xuICAgICAgdGhyb3dEZXBlbmRlbmN5Tm90RXN0YWJsaXNoZWRFcnJvcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoc3VjY2Vzc19zdGF0dXMsIHNjb3JtMjAwNF9yZWdleC5DTUlTU3RhdHVzKSkge1xuICAgICAgICB0aGlzLiNzdWNjZXNzX3N0YXR1cyA9IHN1Y2Nlc3Nfc3RhdHVzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb21wbGV0aW9uX3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29tcGxldGlvbl9zdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbXBsZXRpb25fc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbXBsZXRpb25fc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21wbGV0aW9uX3N0YXR1c1xuICAgKi9cbiAgc2V0IGNvbXBsZXRpb25fc3RhdHVzKGNvbXBsZXRpb25fc3RhdHVzKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQgJiYgdGhpcy4jaWQgPT09ICcnKSB7XG4gICAgICB0aHJvd0RlcGVuZGVuY3lOb3RFc3RhYmxpc2hlZEVycm9yKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChjb21wbGV0aW9uX3N0YXR1cywgc2Nvcm0yMDA0X3JlZ2V4LkNNSUNTdGF0dXMpKSB7XG4gICAgICAgIHRoaXMuI2NvbXBsZXRpb25fc3RhdHVzID0gY29tcGxldGlvbl9zdGF0dXM7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3Byb2dyZXNzX21lYXN1cmVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHByb2dyZXNzX21lYXN1cmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3Byb2dyZXNzX21lYXN1cmU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcHJvZ3Jlc3NfbWVhc3VyZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvZ3Jlc3NfbWVhc3VyZVxuICAgKi9cbiAgc2V0IHByb2dyZXNzX21lYXN1cmUocHJvZ3Jlc3NfbWVhc3VyZSkge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkICYmIHRoaXMuI2lkID09PSAnJykge1xuICAgICAgdGhyb3dEZXBlbmRlbmN5Tm90RXN0YWJsaXNoZWRFcnJvcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQocHJvZ3Jlc3NfbWVhc3VyZSwgc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwpICYmXG4gICAgICAgIGNoZWNrMjAwNFZhbGlkUmFuZ2UocHJvZ3Jlc3NfbWVhc3VyZSxcbiAgICAgICAgICAgIHNjb3JtMjAwNF9yZWdleC5wcm9ncmVzc19yYW5nZSkpIHtcbiAgICAgICAgdGhpcy4jcHJvZ3Jlc3NfbWVhc3VyZSA9IHByb2dyZXNzX21lYXN1cmU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2Rlc2NyaXB0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBkZXNjcmlwdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jZGVzY3JpcHRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZGVzY3JpcHRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyaXB0aW9uXG4gICAqL1xuICBzZXQgZGVzY3JpcHRpb24oZGVzY3JpcHRpb24pIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNpZCA9PT0gJycpIHtcbiAgICAgIHRocm93RGVwZW5kZW5jeU5vdEVzdGFibGlzaGVkRXJyb3IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGRlc2NyaXB0aW9uLCBzY29ybTIwMDRfcmVnZXguQ01JTGFuZ1N0cmluZzI1MCxcbiAgICAgICAgICB0cnVlKSkge1xuICAgICAgICB0aGlzLiNkZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5vYmplY3RpdmVzLm5cbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBpZDogc3RyaW5nLFxuICAgKiAgICAgIHN1Y2Nlc3Nfc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgY29tcGxldGlvbl9zdGF0dXM6IHN0cmluZyxcbiAgICogICAgICBwcm9ncmVzc19tZWFzdXJlOiBzdHJpbmcsXG4gICAqICAgICAgZGVzY3JpcHRpb246IHN0cmluZyxcbiAgICogICAgICBzY29yZTogU2Nvcm0yMDA0Q01JU2NvcmVcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICAgICdzdWNjZXNzX3N0YXR1cyc6IHRoaXMuc3VjY2Vzc19zdGF0dXMsXG4gICAgICAnY29tcGxldGlvbl9zdGF0dXMnOiB0aGlzLmNvbXBsZXRpb25fc3RhdHVzLFxuICAgICAgJ3Byb2dyZXNzX21lYXN1cmUnOiB0aGlzLnByb2dyZXNzX21lYXN1cmUsXG4gICAgICAnZGVzY3JpcHRpb24nOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgJ3Njb3JlJzogdGhpcy5zY29yZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBTQ09STSAyMDA0J3MgY21pICouc2NvcmUgb2JqZWN0XG4gKi9cbmNsYXNzIFNjb3JtMjAwNENNSVNjb3JlIGV4dGVuZHMgQ01JU2NvcmUge1xuICAjc2NhbGVkID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkgKi5zY29yZVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoXG4gICAgICAgIHtcbiAgICAgICAgICBzY29yZV9jaGlsZHJlbjogc2Nvcm0yMDA0X2NvbnN0YW50cy5zY29yZV9jaGlsZHJlbixcbiAgICAgICAgICBtYXg6ICcnLFxuICAgICAgICAgIGludmFsaWRFcnJvckNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCxcbiAgICAgICAgICBpbnZhbGlkVHlwZUNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENILFxuICAgICAgICAgIGludmFsaWRSYW5nZUNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0UsXG4gICAgICAgICAgZGVjaW1hbFJlZ2V4OiBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCxcbiAgICAgICAgICBlcnJvckNsYXNzOiBTY29ybTIwMDRWYWxpZGF0aW9uRXJyb3IsXG4gICAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3NjYWxlZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc2NhbGVkKCkge1xuICAgIHJldHVybiB0aGlzLiNzY2FsZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc2NhbGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY2FsZWRcbiAgICovXG4gIHNldCBzY2FsZWQoc2NhbGVkKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHNjYWxlZCwgc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwpICYmXG4gICAgICBjaGVjazIwMDRWYWxpZFJhbmdlKHNjYWxlZCwgc2Nvcm0yMDA0X3JlZ2V4LnNjYWxlZF9yYW5nZSkpIHtcbiAgICAgIHRoaXMuI3NjYWxlZCA9IHNjYWxlZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkgKi5zY29yZVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHNjYWxlZDogc3RyaW5nLFxuICAgKiAgICAgIHJhdzogc3RyaW5nLFxuICAgKiAgICAgIG1pbjogc3RyaW5nLFxuICAgKiAgICAgIG1heDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdzY2FsZWQnOiB0aGlzLnNjYWxlZCxcbiAgICAgICdyYXcnOiBzdXBlci5yYXcsXG4gICAgICAnbWluJzogc3VwZXIubWluLFxuICAgICAgJ21heCc6IHN1cGVyLm1heCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmNvbW1lbnRzX2Zyb21fbGVhcm5lci5uIGFuZCBjbWkuY29tbWVudHNfZnJvbV9sbXMubiBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUNvbW1lbnRzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNjb21tZW50ID0gJyc7XG4gICNsb2NhdGlvbiA9ICcnO1xuICAjdGltZXN0YW1wID0gJyc7XG4gICNyZWFkT25seUFmdGVySW5pdDtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5jb21tZW50c19mcm9tX2xlYXJuZXIubiBhbmQgY21pLmNvbW1lbnRzX2Zyb21fbG1zLm5cbiAgICogQHBhcmFtIHtib29sZWFufSByZWFkT25seUFmdGVySW5pdFxuICAgKi9cbiAgY29uc3RydWN0b3IocmVhZE9ubHlBZnRlckluaXQgPSBmYWxzZSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy4jY29tbWVudCA9ICcnO1xuICAgIHRoaXMuI2xvY2F0aW9uID0gJyc7XG4gICAgdGhpcy4jdGltZXN0YW1wID0gJyc7XG4gICAgdGhpcy4jcmVhZE9ubHlBZnRlckluaXQgPSByZWFkT25seUFmdGVySW5pdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb21tZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb21tZW50KCkge1xuICAgIHJldHVybiB0aGlzLiNjb21tZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbW1lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbW1lbnRcbiAgICovXG4gIHNldCBjb21tZW50KGNvbW1lbnQpIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNyZWFkT25seUFmdGVySW5pdCkge1xuICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChjb21tZW50LCBzY29ybTIwMDRfcmVnZXguQ01JTGFuZ1N0cmluZzQwMDAsXG4gICAgICAgICAgdHJ1ZSkpIHtcbiAgICAgICAgdGhpcy4jY29tbWVudCA9IGNvbW1lbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xvY2F0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsb2NhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jbG9jYXRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbG9jYXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uXG4gICAqL1xuICBzZXQgbG9jYXRpb24obG9jYXRpb24pIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNyZWFkT25seUFmdGVySW5pdCkge1xuICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChsb2NhdGlvbiwgc2Nvcm0yMDA0X3JlZ2V4LkNNSVN0cmluZzI1MCkpIHtcbiAgICAgICAgdGhpcy4jbG9jYXRpb24gPSBsb2NhdGlvbjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZXN0YW1wXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lc3RhbXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWVzdGFtcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lc3RhbXBcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVzdGFtcFxuICAgKi9cbiAgc2V0IHRpbWVzdGFtcCh0aW1lc3RhbXApIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNyZWFkT25seUFmdGVySW5pdCkge1xuICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdCh0aW1lc3RhbXAsIHNjb3JtMjAwNF9yZWdleC5DTUlUaW1lKSkge1xuICAgICAgICB0aGlzLiN0aW1lc3RhbXAgPSB0aW1lc3RhbXA7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmNvbW1lbnRzX2Zyb21fbGVhcm5lci5uIG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGNvbW1lbnQ6IHN0cmluZyxcbiAgICogICAgICBsb2NhdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIHRpbWVzdGFtcDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdjb21tZW50JzogdGhpcy5jb21tZW50LFxuICAgICAgJ2xvY2F0aW9uJzogdGhpcy5sb2NhdGlvbixcbiAgICAgICd0aW1lc3RhbXAnOiB0aGlzLnRpbWVzdGFtcCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmludGVyYWN0aW9ucy5uLm9iamVjdGl2ZXMubiBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc09iamVjdGl2ZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI2lkID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4ub2JqZWN0aXZlcy5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2lkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjaWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBzZXQgaWQoaWQpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoaWQsIHNjb3JtMjAwNF9yZWdleC5DTUlMb25nSWRlbnRpZmllcikpIHtcbiAgICAgIHRoaXMuI2lkID0gaWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmludGVyYWN0aW9ucy5uLm9iamVjdGl2ZXMublxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGlkOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmludGVyYWN0aW9ucy5uLmNvcnJlY3RfcmVzcG9uc2VzLm4gb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlJbnRlcmFjdGlvbnNDb3JyZWN0UmVzcG9uc2VzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNwYXR0ZXJuID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4uY29ycmVjdF9yZXNwb25zZXMublxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNwYXR0ZXJuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBwYXR0ZXJuKCkge1xuICAgIHJldHVybiB0aGlzLiNwYXR0ZXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3BhdHRlcm5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdHRlcm5cbiAgICovXG4gIHNldCBwYXR0ZXJuKHBhdHRlcm4pIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQocGF0dGVybiwgc2Nvcm0yMDA0X3JlZ2V4LkNNSUZlZWRiYWNrKSkge1xuICAgICAgdGhpcy4jcGF0dGVybiA9IHBhdHRlcm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBjbWkuaW50ZXJhY3Rpb25zLm4uY29ycmVjdF9yZXNwb25zZXMubiBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBwYXR0ZXJuOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3BhdHRlcm4nOiB0aGlzLnBhdHRlcm4sXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGFkbCBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIEFETCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGFkbFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubmF2ID0gbmV3IEFETE5hdigpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLm5hdj8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgYWRsXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgbmF2OiB7XG4gICAqICAgICAgICByZXF1ZXN0OiBzdHJpbmdcbiAgICogICAgICB9XG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICduYXYnOiB0aGlzLm5hdixcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgYWRsLm5hdiBvYmplY3RcbiAqL1xuY2xhc3MgQURMTmF2IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNyZXF1ZXN0ID0gJ19ub25lXyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBhZGwubmF2XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5yZXF1ZXN0X3ZhbGlkID0gbmV3IEFETE5hdlJlcXVlc3RWYWxpZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnJlcXVlc3RfdmFsaWQ/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNyZXF1ZXN0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCByZXF1ZXN0KCkge1xuICAgIHJldHVybiB0aGlzLiNyZXF1ZXN0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3JlcXVlc3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3RcbiAgICovXG4gIHNldCByZXF1ZXN0KHJlcXVlc3QpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQocmVxdWVzdCwgc2Nvcm0yMDA0X3JlZ2V4Lk5BVkV2ZW50KSkge1xuICAgICAgdGhpcy4jcmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgYWRsLm5hdlxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHJlcXVlc3Q6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAncmVxdWVzdCc6IHRoaXMucmVxdWVzdCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgYWRsLm5hdi5yZXF1ZXN0X3ZhbGlkIG9iamVjdFxuICovXG5jbGFzcyBBRExOYXZSZXF1ZXN0VmFsaWQgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI2NvbnRpbnVlID0gJ3Vua25vd24nO1xuICAjcHJldmlvdXMgPSAndW5rbm93bic7XG4gIGNob2ljZSA9IGNsYXNzIHtcbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0YXJnZXQgaXMgdmFsaWRcbiAgICAgKiBAcGFyYW0geyp9IF90YXJnZXRcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgX2lzVGFyZ2V0VmFsaWQgPSAoX3RhcmdldCkgPT4gJ3Vua25vd24nO1xuICB9O1xuICBqdW1wID0gY2xhc3Mge1xuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRhcmdldCBpcyB2YWxpZFxuICAgICAqIEBwYXJhbSB7Kn0gX3RhcmdldFxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBfaXNUYXJnZXRWYWxpZCA9IChfdGFyZ2V0KSA9PiAndW5rbm93bic7XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBhZGwubmF2LnJlcXVlc3RfdmFsaWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29udGludWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbnRpbnVlKCkge1xuICAgIHJldHVybiB0aGlzLiNjb250aW51ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb250aW51ZS4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7Kn0gX1xuICAgKi9cbiAgc2V0IGNvbnRpbnVlKF8pIHtcbiAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNwcmV2aW91c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgcHJldmlvdXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3ByZXZpb3VzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3ByZXZpb3VzLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHsqfSBfXG4gICAqL1xuICBzZXQgcHJldmlvdXMoXykge1xuICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgYWRsLm5hdi5yZXF1ZXN0X3ZhbGlkXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgcHJldmlvdXM6IHN0cmluZyxcbiAgICogICAgICBjb250aW51ZTogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdwcmV2aW91cyc6IHRoaXMucHJldmlvdXMsXG4gICAgICAnY29udGludWUnOiB0aGlzLmNvbnRpbnVlLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iLCIvLyBAZmxvd1xuXG5jb25zdCBnbG9iYWwgPSB7XG4gIFNDT1JNX1RSVUU6ICd0cnVlJyxcbiAgU0NPUk1fRkFMU0U6ICdmYWxzZScsXG4gIFNUQVRFX05PVF9JTklUSUFMSVpFRDogMCxcbiAgU1RBVEVfSU5JVElBTElaRUQ6IDEsXG4gIFNUQVRFX1RFUk1JTkFURUQ6IDIsXG4gIExPR19MRVZFTF9ERUJVRzogMSxcbiAgTE9HX0xFVkVMX0lORk86IDIsXG4gIExPR19MRVZFTF9XQVJOSU5HOiAzLFxuICBMT0dfTEVWRUxfRVJST1I6IDQsXG4gIExPR19MRVZFTF9OT05FOiA1LFxufTtcblxuY29uc3Qgc2Nvcm0xMiA9IHtcbiAgLy8gQ2hpbGRyZW4gbGlzdHNcbiAgY21pX2NoaWxkcmVuOiAnY29yZSxzdXNwZW5kX2RhdGEsbGF1bmNoX2RhdGEsY29tbWVudHMsb2JqZWN0aXZlcyxzdHVkZW50X2RhdGEsc3R1ZGVudF9wcmVmZXJlbmNlLGludGVyYWN0aW9ucycsXG4gIGNvcmVfY2hpbGRyZW46ICdzdHVkZW50X2lkLHN0dWRlbnRfbmFtZSxsZXNzb25fbG9jYXRpb24sY3JlZGl0LGxlc3Nvbl9zdGF0dXMsZW50cnksc2NvcmUsdG90YWxfdGltZSxsZXNzb25fbW9kZSxleGl0LHNlc3Npb25fdGltZScsXG4gIHNjb3JlX2NoaWxkcmVuOiAncmF3LG1pbixtYXgnLFxuICBjb21tZW50c19jaGlsZHJlbjogJ2NvbnRlbnQsbG9jYXRpb24sdGltZScsXG4gIG9iamVjdGl2ZXNfY2hpbGRyZW46ICdpZCxzY29yZSxzdGF0dXMnLFxuICBjb3JyZWN0X3Jlc3BvbnNlc19jaGlsZHJlbjogJ3BhdHRlcm4nLFxuICBzdHVkZW50X2RhdGFfY2hpbGRyZW46ICdtYXN0ZXJ5X3Njb3JlLG1heF90aW1lX2FsbG93ZWQsdGltZV9saW1pdF9hY3Rpb24nLFxuICBzdHVkZW50X3ByZWZlcmVuY2VfY2hpbGRyZW46ICdhdWRpbyxsYW5ndWFnZSxzcGVlZCx0ZXh0JyxcbiAgaW50ZXJhY3Rpb25zX2NoaWxkcmVuOiAnaWQsb2JqZWN0aXZlcyx0aW1lLHR5cGUsY29ycmVjdF9yZXNwb25zZXMsd2VpZ2h0aW5nLHN0dWRlbnRfcmVzcG9uc2UscmVzdWx0LGxhdGVuY3knLFxuXG4gIGVycm9yX2Rlc2NyaXB0aW9uczoge1xuICAgICcxMDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIEV4Y2VwdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTm8gc3BlY2lmaWMgZXJyb3IgY29kZSBleGlzdHMgdG8gZGVzY3JpYmUgdGhlIGVycm9yLiBVc2UgTE1TR2V0RGlhZ25vc3RpYyBmb3IgbW9yZSBpbmZvcm1hdGlvbicsXG4gICAgfSxcbiAgICAnMjAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnSW52YWxpZCBhcmd1bWVudCBlcnJvcicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIHRoYXQgYW4gYXJndW1lbnQgcmVwcmVzZW50cyBhbiBpbnZhbGlkIGRhdGEgbW9kZWwgZWxlbWVudCBvciBpcyBvdGhlcndpc2UgaW5jb3JyZWN0LicsXG4gICAgfSxcbiAgICAnMjAyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRWxlbWVudCBjYW5ub3QgaGF2ZSBjaGlsZHJlbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIHRoYXQgTE1TR2V0VmFsdWUgd2FzIGNhbGxlZCB3aXRoIGEgZGF0YSBtb2RlbCBlbGVtZW50IG5hbWUgdGhhdCBlbmRzIGluIFwiX2NoaWxkcmVuXCIgZm9yIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgZG9lcyBub3Qgc3VwcG9ydCB0aGUgXCJfY2hpbGRyZW5cIiBzdWZmaXguJyxcbiAgICB9LFxuICAgICcyMDMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdFbGVtZW50IG5vdCBhbiBhcnJheSAtIGNhbm5vdCBoYXZlIGNvdW50JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgdGhhdCBMTVNHZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSBkYXRhIG1vZGVsIGVsZW1lbnQgbmFtZSB0aGF0IGVuZHMgaW4gXCJfY291bnRcIiBmb3IgYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBkb2VzIG5vdCBzdXBwb3J0IHRoZSBcIl9jb3VudFwiIHN1ZmZpeC4nLFxuICAgIH0sXG4gICAgJzMwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ05vdCBpbml0aWFsaXplZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIHRoYXQgYW4gQVBJIGNhbGwgd2FzIG1hZGUgYmVmb3JlIHRoZSBjYWxsIHRvIGxtc0luaXRpYWxpemUuJyxcbiAgICB9LFxuICAgICc0MDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdOb3QgaW1wbGVtZW50ZWQgZXJyb3InLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1RoZSBkYXRhIG1vZGVsIGVsZW1lbnQgaW5kaWNhdGVkIGluIGEgY2FsbCB0byBMTVNHZXRWYWx1ZSBvciBMTVNTZXRWYWx1ZSBpcyB2YWxpZCwgYnV0IHdhcyBub3QgaW1wbGVtZW50ZWQgYnkgdGhpcyBMTVMuIFNDT1JNIDEuMiBkZWZpbmVzIGEgc2V0IG9mIGRhdGEgbW9kZWwgZWxlbWVudHMgYXMgYmVpbmcgb3B0aW9uYWwgZm9yIGFuIExNUyB0byBpbXBsZW1lbnQuJyxcbiAgICB9LFxuICAgICc0MDInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdJbnZhbGlkIHNldCB2YWx1ZSwgZWxlbWVudCBpcyBhIGtleXdvcmQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyB0aGF0IExNU1NldFZhbHVlIHdhcyBjYWxsZWQgb24gYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCByZXByZXNlbnRzIGEga2V5d29yZCAoZWxlbWVudHMgdGhhdCBlbmQgaW4gXCJfY2hpbGRyZW5cIiBhbmQgXCJfY291bnRcIikuJyxcbiAgICB9LFxuICAgICc0MDMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdFbGVtZW50IGlzIHJlYWQgb25seScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTE1TU2V0VmFsdWUgd2FzIGNhbGxlZCB3aXRoIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgY2FuIG9ubHkgYmUgcmVhZC4nLFxuICAgIH0sXG4gICAgJzQwNCc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0VsZW1lbnQgaXMgd3JpdGUgb25seScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTE1TR2V0VmFsdWUgd2FzIGNhbGxlZCBvbiBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IGNhbiBvbmx5IGJlIHdyaXR0ZW4gdG8uJyxcbiAgICB9LFxuICAgICc0MDUnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdJbmNvcnJlY3QgRGF0YSBUeXBlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdMTVNTZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSB2YWx1ZSB0aGF0IGlzIG5vdCBjb25zaXN0ZW50IHdpdGggdGhlIGRhdGEgZm9ybWF0IG9mIHRoZSBzdXBwbGllZCBkYXRhIG1vZGVsIGVsZW1lbnQuJyxcbiAgICB9LFxuICAgICc0MDcnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdFbGVtZW50IFZhbHVlIE91dCBPZiBSYW5nZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnVGhlIG51bWVyaWMgdmFsdWUgc3VwcGxpZWQgdG8gYSBMTVNTZXRWYWx1ZSBjYWxsIGlzIG91dHNpZGUgb2YgdGhlIG51bWVyaWMgcmFuZ2UgYWxsb3dlZCBmb3IgdGhlIHN1cHBsaWVkIGRhdGEgbW9kZWwgZWxlbWVudC4nLFxuICAgIH0sXG4gICAgJzQwOCc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0RhdGEgTW9kZWwgRGVwZW5kZW5jeSBOb3QgRXN0YWJsaXNoZWQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1NvbWUgZGF0YSBtb2RlbCBlbGVtZW50cyBjYW5ub3QgYmUgc2V0IHVudGlsIGFub3RoZXIgZGF0YSBtb2RlbCBlbGVtZW50IHdhcyBzZXQuIFRoaXMgZXJyb3IgY29uZGl0aW9uIGluZGljYXRlcyB0aGF0IHRoZSBwcmVyZXF1aXNpdGUgZWxlbWVudCB3YXMgbm90IHNldCBiZWZvcmUgdGhlIGRlcGVuZGVudCBlbGVtZW50LicsXG4gICAgfSxcbiAgfSxcbn07XG5cbmNvbnN0IGFpY2MgPSB7XG4gIC4uLnNjb3JtMTIsIC4uLntcbiAgICBjbWlfY2hpbGRyZW46ICdjb3JlLHN1c3BlbmRfZGF0YSxsYXVuY2hfZGF0YSxjb21tZW50cyxvYmplY3RpdmVzLHN0dWRlbnRfZGF0YSxzdHVkZW50X3ByZWZlcmVuY2UsaW50ZXJhY3Rpb25zLGV2YWx1YXRpb24nLFxuICAgIHN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbjogJ2F1ZGlvLGxhbmd1YWdlLGxlc3Nvbl90eXBlLHNwZWVkLHRleHQsdGV4dF9jb2xvcix0ZXh0X2xvY2F0aW9uLHRleHRfc2l6ZSx2aWRlbyx3aW5kb3dzJyxcbiAgICBzdHVkZW50X2RhdGFfY2hpbGRyZW46ICdhdHRlbXB0X251bWJlcix0cmllcyxtYXN0ZXJ5X3Njb3JlLG1heF90aW1lX2FsbG93ZWQsdGltZV9saW1pdF9hY3Rpb24nLFxuICAgIHN0dWRlbnRfZGVtb2dyYXBoaWNzX2NoaWxkcmVuOiAnY2l0eSxjbGFzcyxjb21wYW55LGNvdW50cnksZXhwZXJpZW5jZSxmYW1pbGlhcl9uYW1lLGluc3RydWN0b3JfbmFtZSx0aXRsZSxuYXRpdmVfbGFuZ3VhZ2Usc3RhdGUsc3RyZWV0X2FkZHJlc3MsdGVsZXBob25lLHllYXJzX2V4cGVyaWVuY2UnLFxuICAgIHRyaWVzX2NoaWxkcmVuOiAndGltZSxzdGF0dXMsc2NvcmUnLFxuICAgIGF0dGVtcHRfcmVjb3Jkc19jaGlsZHJlbjogJ3Njb3JlLGxlc3Nvbl9zdGF0dXMnLFxuICAgIHBhdGhzX2NoaWxkcmVuOiAnbG9jYXRpb25faWQsZGF0ZSx0aW1lLHN0YXR1cyx3aHlfbGVmdCx0aW1lX2luX2VsZW1lbnQnLFxuICB9LFxufTtcblxuY29uc3Qgc2Nvcm0yMDA0ID0ge1xuICAvLyBDaGlsZHJlbiBsaXN0c1xuICBjbWlfY2hpbGRyZW46ICdfdmVyc2lvbixjb21tZW50c19mcm9tX2xlYXJuZXIsY29tbWVudHNfZnJvbV9sbXMsY29tcGxldGlvbl9zdGF0dXMsY3JlZGl0LGVudHJ5LGV4aXQsaW50ZXJhY3Rpb25zLGxhdW5jaF9kYXRhLGxlYXJuZXJfaWQsbGVhcm5lcl9uYW1lLGxlYXJuZXJfcHJlZmVyZW5jZSxsb2NhdGlvbixtYXhfdGltZV9hbGxvd2VkLG1vZGUsb2JqZWN0aXZlcyxwcm9ncmVzc19tZWFzdXJlLHNjYWxlZF9wYXNzaW5nX3Njb3JlLHNjb3JlLHNlc3Npb25fdGltZSxzdWNjZXNzX3N0YXR1cyxzdXNwZW5kX2RhdGEsdGltZV9saW1pdF9hY3Rpb24sdG90YWxfdGltZScsXG4gIGNvbW1lbnRzX2NoaWxkcmVuOiAnY29tbWVudCx0aW1lc3RhbXAsbG9jYXRpb24nLFxuICBzY29yZV9jaGlsZHJlbjogJ21heCxyYXcsc2NhbGVkLG1pbicsXG4gIG9iamVjdGl2ZXNfY2hpbGRyZW46ICdwcm9ncmVzc19tZWFzdXJlLGNvbXBsZXRpb25fc3RhdHVzLHN1Y2Nlc3Nfc3RhdHVzLGRlc2NyaXB0aW9uLHNjb3JlLGlkJyxcbiAgY29ycmVjdF9yZXNwb25zZXNfY2hpbGRyZW46ICdwYXR0ZXJuJyxcbiAgc3R1ZGVudF9kYXRhX2NoaWxkcmVuOiAnbWFzdGVyeV9zY29yZSxtYXhfdGltZV9hbGxvd2VkLHRpbWVfbGltaXRfYWN0aW9uJyxcbiAgc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuOiAnYXVkaW9fbGV2ZWwsYXVkaW9fY2FwdGlvbmluZyxkZWxpdmVyeV9zcGVlZCxsYW5ndWFnZScsXG4gIGludGVyYWN0aW9uc19jaGlsZHJlbjogJ2lkLHR5cGUsb2JqZWN0aXZlcyx0aW1lc3RhbXAsY29ycmVjdF9yZXNwb25zZXMsd2VpZ2h0aW5nLGxlYXJuZXJfcmVzcG9uc2UscmVzdWx0LGxhdGVuY3ksZGVzY3JpcHRpb24nLFxuXG4gIGVycm9yX2Rlc2NyaXB0aW9uczoge1xuICAgICcwJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnTm8gRXJyb3InLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ05vIGVycm9yIG9jY3VycmVkLCB0aGUgcHJldmlvdXMgQVBJIGNhbGwgd2FzIHN1Y2Nlc3NmdWwuJyxcbiAgICB9LFxuICAgICcxMDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIEV4Y2VwdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTm8gc3BlY2lmaWMgZXJyb3IgY29kZSBleGlzdHMgdG8gZGVzY3JpYmUgdGhlIGVycm9yLiBVc2UgR2V0RGlhZ25vc3RpYyBmb3IgbW9yZSBpbmZvcm1hdGlvbi4nLFxuICAgIH0sXG4gICAgJzEwMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgSW5pdGlhbGl6YXRpb24gRmFpbHVyZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBJbml0aWFsaXplIGZhaWxlZCBmb3IgYW4gdW5rbm93biByZWFzb24uJyxcbiAgICB9LFxuICAgICcxMDMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdBbHJlYWR5IEluaXRpYWxpemVkJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIEluaXRpYWxpemUgZmFpbGVkIGJlY2F1c2UgSW5pdGlhbGl6ZSB3YXMgYWxyZWFkeSBjYWxsZWQuJyxcbiAgICB9LFxuICAgICcxMDQnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdDb250ZW50IEluc3RhbmNlIFRlcm1pbmF0ZWQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gSW5pdGlhbGl6ZSBmYWlsZWQgYmVjYXVzZSBUZXJtaW5hdGUgd2FzIGFscmVhZHkgY2FsbGVkLicsXG4gICAgfSxcbiAgICAnMTExJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBUZXJtaW5hdGlvbiBGYWlsdXJlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIFRlcm1pbmF0ZSBmYWlsZWQgZm9yIGFuIHVua25vd24gcmVhc29uLicsXG4gICAgfSxcbiAgICAnMTEyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnVGVybWluYXRpb24gQmVmb3JlIEluaXRpYWxpemF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIFRlcm1pbmF0ZSBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBiZWZvcmUgdGhlIGNhbGwgdG8gSW5pdGlhbGl6ZS4nLFxuICAgIH0sXG4gICAgJzExMyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1Rlcm1pbmF0aW9uIEFmdGVyIFRlcm1pbmF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIFRlcm1pbmF0ZSBmYWlsZWQgYmVjYXVzZSBUZXJtaW5hdGUgd2FzIGFscmVhZHkgY2FsbGVkLicsXG4gICAgfSxcbiAgICAnMTIyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnUmV0cmlldmUgRGF0YSBCZWZvcmUgSW5pdGlhbGl6YXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gR2V0VmFsdWUgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYmVmb3JlIHRoZSBjYWxsIHRvIEluaXRpYWxpemUuJyxcbiAgICB9LFxuICAgICcxMjMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdSZXRyaWV2ZSBEYXRhIEFmdGVyIFRlcm1pbmF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIEdldFZhbHVlIGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGFmdGVyIHRoZSBjYWxsIHRvIFRlcm1pbmF0ZS4nLFxuICAgIH0sXG4gICAgJzEzMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1N0b3JlIERhdGEgQmVmb3JlIEluaXRpYWxpemF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIFNldFZhbHVlIGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGJlZm9yZSB0aGUgY2FsbCB0byBJbml0aWFsaXplLicsXG4gICAgfSxcbiAgICAnMTMzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnU3RvcmUgRGF0YSBBZnRlciBUZXJtaW5hdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBTZXRWYWx1ZSBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBhZnRlciB0aGUgY2FsbCB0byBUZXJtaW5hdGUuJyxcbiAgICB9LFxuICAgICcxNDInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdDb21taXQgQmVmb3JlIEluaXRpYWxpemF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIENvbW1pdCBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBiZWZvcmUgdGhlIGNhbGwgdG8gSW5pdGlhbGl6ZS4nLFxuICAgIH0sXG4gICAgJzE0Myc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0NvbW1pdCBBZnRlciBUZXJtaW5hdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBDb21taXQgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYWZ0ZXIgdGhlIGNhbGwgdG8gVGVybWluYXRlLicsXG4gICAgfSxcbiAgICAnMjAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBBcmd1bWVudCBFcnJvcicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQW4gaW52YWxpZCBhcmd1bWVudCB3YXMgcGFzc2VkIHRvIGFuIEFQSSBtZXRob2QgKHVzdWFsbHkgaW5kaWNhdGVzIHRoYXQgSW5pdGlhbGl6ZSwgQ29tbWl0IG9yIFRlcm1pbmF0ZSBkaWQgbm90IHJlY2VpdmUgdGhlIGV4cGVjdGVkIGVtcHR5IHN0cmluZyBhcmd1bWVudC4nLFxuICAgIH0sXG4gICAgJzMwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgR2V0IEZhaWx1cmUnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyBhIGZhaWxlZCBHZXRWYWx1ZSBjYWxsIHdoZXJlIG5vIG90aGVyIHNwZWNpZmljIGVycm9yIGNvZGUgaXMgYXBwbGljYWJsZS4gVXNlIEdldERpYWdub3N0aWMgZm9yIG1vcmUgaW5mb3JtYXRpb24uJyxcbiAgICB9LFxuICAgICczNTEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIFNldCBGYWlsdXJlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgYSBmYWlsZWQgU2V0VmFsdWUgY2FsbCB3aGVyZSBubyBvdGhlciBzcGVjaWZpYyBlcnJvciBjb2RlIGlzIGFwcGxpY2FibGUuIFVzZSBHZXREaWFnbm9zdGljIGZvciBtb3JlIGluZm9ybWF0aW9uLicsXG4gICAgfSxcbiAgICAnMzkxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBDb21taXQgRmFpbHVyZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIGEgZmFpbGVkIENvbW1pdCBjYWxsIHdoZXJlIG5vIG90aGVyIHNwZWNpZmljIGVycm9yIGNvZGUgaXMgYXBwbGljYWJsZS4gVXNlIEdldERpYWdub3N0aWMgZm9yIG1vcmUgaW5mb3JtYXRpb24uJyxcbiAgICB9LFxuICAgICc0MDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdVbmRlZmluZWQgRGF0YSBNb2RlbCBFbGVtZW50JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdUaGUgZGF0YSBtb2RlbCBlbGVtZW50IG5hbWUgcGFzc2VkIHRvIEdldFZhbHVlIG9yIFNldFZhbHVlIGlzIG5vdCBhIHZhbGlkIFNDT1JNIGRhdGEgbW9kZWwgZWxlbWVudC4nLFxuICAgIH0sXG4gICAgJzQwMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1VuaW1wbGVtZW50ZWQgRGF0YSBNb2RlbCBFbGVtZW50JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdUaGUgZGF0YSBtb2RlbCBlbGVtZW50IGluZGljYXRlZCBpbiBhIGNhbGwgdG8gR2V0VmFsdWUgb3IgU2V0VmFsdWUgaXMgdmFsaWQsIGJ1dCB3YXMgbm90IGltcGxlbWVudGVkIGJ5IHRoaXMgTE1TLiBJbiBTQ09STSAyMDA0LCB0aGlzIGVycm9yIHdvdWxkIGluZGljYXRlIGFuIExNUyB0aGF0IGlzIG5vdCBmdWxseSBTQ09STSBjb25mb3JtYW50LicsXG4gICAgfSxcbiAgICAnNDAzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBFbGVtZW50IFZhbHVlIE5vdCBJbml0aWFsaXplZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQXR0ZW1wdCB0byByZWFkIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkIGJ5IHRoZSBMTVMgb3IgdGhyb3VnaCBhIFNldFZhbHVlIGNhbGwuIFRoaXMgZXJyb3IgY29uZGl0aW9uIGlzIG9mdGVuIHJlYWNoZWQgZHVyaW5nIG5vcm1hbCBleGVjdXRpb24gb2YgYSBTQ08uJyxcbiAgICB9LFxuICAgICc0MDQnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdEYXRhIE1vZGVsIEVsZW1lbnQgSXMgUmVhZCBPbmx5JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdTZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBjYW4gb25seSBiZSByZWFkLicsXG4gICAgfSxcbiAgICAnNDA1Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBFbGVtZW50IElzIFdyaXRlIE9ubHknLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0dldFZhbHVlIHdhcyBjYWxsZWQgb24gYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBjYW4gb25seSBiZSB3cml0dGVuIHRvLicsXG4gICAgfSxcbiAgICAnNDA2Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBFbGVtZW50IFR5cGUgTWlzbWF0Y2gnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1NldFZhbHVlIHdhcyBjYWxsZWQgd2l0aCBhIHZhbHVlIHRoYXQgaXMgbm90IGNvbnNpc3RlbnQgd2l0aCB0aGUgZGF0YSBmb3JtYXQgb2YgdGhlIHN1cHBsaWVkIGRhdGEgbW9kZWwgZWxlbWVudC4nLFxuICAgIH0sXG4gICAgJzQwNyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0RhdGEgTW9kZWwgRWxlbWVudCBWYWx1ZSBPdXQgT2YgUmFuZ2UnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1RoZSBudW1lcmljIHZhbHVlIHN1cHBsaWVkIHRvIGEgU2V0VmFsdWUgY2FsbCBpcyBvdXRzaWRlIG9mIHRoZSBudW1lcmljIHJhbmdlIGFsbG93ZWQgZm9yIHRoZSBzdXBwbGllZCBkYXRhIG1vZGVsIGVsZW1lbnQuJyxcbiAgICB9LFxuICAgICc0MDgnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdEYXRhIE1vZGVsIERlcGVuZGVuY3kgTm90IEVzdGFibGlzaGVkJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdTb21lIGRhdGEgbW9kZWwgZWxlbWVudHMgY2Fubm90IGJlIHNldCB1bnRpbCBhbm90aGVyIGRhdGEgbW9kZWwgZWxlbWVudCB3YXMgc2V0LiBUaGlzIGVycm9yIGNvbmRpdGlvbiBpbmRpY2F0ZXMgdGhhdCB0aGUgcHJlcmVxdWlzaXRlIGVsZW1lbnQgd2FzIG5vdCBzZXQgYmVmb3JlIHRoZSBkZXBlbmRlbnQgZWxlbWVudC4nLFxuICAgIH0sXG4gIH0sXG59O1xuXG5jb25zdCBBUElDb25zdGFudHMgPSB7XG4gIGdsb2JhbDogZ2xvYmFsLFxuICBzY29ybTEyOiBzY29ybTEyLFxuICBhaWNjOiBhaWNjLFxuICBzY29ybTIwMDQ6IHNjb3JtMjAwNCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEFQSUNvbnN0YW50cztcbiIsIi8vIEBmbG93XG5jb25zdCBnbG9iYWwgPSB7XG4gIEdFTkVSQUw6IDEwMSxcbiAgSU5JVElBTElaQVRJT05fRkFJTEVEOiAxMDEsXG4gIElOSVRJQUxJWkVEOiAxMDEsXG4gIFRFUk1JTkFURUQ6IDEwMSxcbiAgVEVSTUlOQVRJT05fRkFJTFVSRTogMTAxLFxuICBURVJNSU5BVElPTl9CRUZPUkVfSU5JVDogMTAxLFxuICBNVUxUSVBMRV9URVJNSU5BVElPTjogMTAxLFxuICBSRVRSSUVWRV9CRUZPUkVfSU5JVDogMTAxLFxuICBSRVRSSUVWRV9BRlRFUl9URVJNOiAxMDEsXG4gIFNUT1JFX0JFRk9SRV9JTklUOiAxMDEsXG4gIFNUT1JFX0FGVEVSX1RFUk06IDEwMSxcbiAgQ09NTUlUX0JFRk9SRV9JTklUOiAxMDEsXG4gIENPTU1JVF9BRlRFUl9URVJNOiAxMDEsXG4gIEFSR1VNRU5UX0VSUk9SOiAxMDEsXG4gIENISUxEUkVOX0VSUk9SOiAxMDEsXG4gIENPVU5UX0VSUk9SOiAxMDEsXG4gIEdFTkVSQUxfR0VUX0ZBSUxVUkU6IDEwMSxcbiAgR0VORVJBTF9TRVRfRkFJTFVSRTogMTAxLFxuICBHRU5FUkFMX0NPTU1JVF9GQUlMVVJFOiAxMDEsXG4gIFVOREVGSU5FRF9EQVRBX01PREVMOiAxMDEsXG4gIFVOSU1QTEVNRU5URURfRUxFTUVOVDogMTAxLFxuICBWQUxVRV9OT1RfSU5JVElBTElaRUQ6IDEwMSxcbiAgSU5WQUxJRF9TRVRfVkFMVUU6IDEwMSxcbiAgUkVBRF9PTkxZX0VMRU1FTlQ6IDEwMSxcbiAgV1JJVEVfT05MWV9FTEVNRU5UOiAxMDEsXG4gIFRZUEVfTUlTTUFUQ0g6IDEwMSxcbiAgVkFMVUVfT1VUX09GX1JBTkdFOiAxMDEsXG4gIERFUEVOREVOQ1lfTk9UX0VTVEFCTElTSEVEOiAxMDEsXG59O1xuXG5jb25zdCBzY29ybTEyID0ge1xuICAuLi5nbG9iYWwsIC4uLntcbiAgICBSRVRSSUVWRV9CRUZPUkVfSU5JVDogMzAxLFxuICAgIFNUT1JFX0JFRk9SRV9JTklUOiAzMDEsXG4gICAgQ09NTUlUX0JFRk9SRV9JTklUOiAzMDEsXG4gICAgQVJHVU1FTlRfRVJST1I6IDIwMSxcbiAgICBDSElMRFJFTl9FUlJPUjogMjAyLFxuICAgIENPVU5UX0VSUk9SOiAyMDMsXG4gICAgVU5ERUZJTkVEX0RBVEFfTU9ERUw6IDQwMSxcbiAgICBVTklNUExFTUVOVEVEX0VMRU1FTlQ6IDQwMSxcbiAgICBWQUxVRV9OT1RfSU5JVElBTElaRUQ6IDMwMSxcbiAgICBJTlZBTElEX1NFVF9WQUxVRTogNDAyLFxuICAgIFJFQURfT05MWV9FTEVNRU5UOiA0MDMsXG4gICAgV1JJVEVfT05MWV9FTEVNRU5UOiA0MDQsXG4gICAgVFlQRV9NSVNNQVRDSDogNDA1LFxuICAgIFZBTFVFX09VVF9PRl9SQU5HRTogNDA3LFxuICAgIERFUEVOREVOQ1lfTk9UX0VTVEFCTElTSEVEOiA0MDgsXG4gIH0sXG59O1xuXG5jb25zdCBzY29ybTIwMDQgPSB7XG4gIC4uLmdsb2JhbCwgLi4ue1xuICAgIElOSVRJQUxJWkFUSU9OX0ZBSUxFRDogMTAyLFxuICAgIElOSVRJQUxJWkVEOiAxMDMsXG4gICAgVEVSTUlOQVRFRDogMTA0LFxuICAgIFRFUk1JTkFUSU9OX0ZBSUxVUkU6IDExMSxcbiAgICBURVJNSU5BVElPTl9CRUZPUkVfSU5JVDogMTEyLFxuICAgIE1VTFRJUExFX1RFUk1JTkFUSU9OUzogMTEzLFxuICAgIFJFVFJJRVZFX0JFRk9SRV9JTklUOiAxMjIsXG4gICAgUkVUUklFVkVfQUZURVJfVEVSTTogMTIzLFxuICAgIFNUT1JFX0JFRk9SRV9JTklUOiAxMzIsXG4gICAgU1RPUkVfQUZURVJfVEVSTTogMTMzLFxuICAgIENPTU1JVF9CRUZPUkVfSU5JVDogMTQyLFxuICAgIENPTU1JVF9BRlRFUl9URVJNOiAxNDMsXG4gICAgQVJHVU1FTlRfRVJST1I6IDIwMSxcbiAgICBHRU5FUkFMX0dFVF9GQUlMVVJFOiAzMDEsXG4gICAgR0VORVJBTF9TRVRfRkFJTFVSRTogMzUxLFxuICAgIEdFTkVSQUxfQ09NTUlUX0ZBSUxVUkU6IDM5MSxcbiAgICBVTkRFRklORURfREFUQV9NT0RFTDogNDAxLFxuICAgIFVOSU1QTEVNRU5URURfRUxFTUVOVDogNDAyLFxuICAgIFZBTFVFX05PVF9JTklUSUFMSVpFRDogNDAzLFxuICAgIFJFQURfT05MWV9FTEVNRU5UOiA0MDQsXG4gICAgV1JJVEVfT05MWV9FTEVNRU5UOiA0MDUsXG4gICAgVFlQRV9NSVNNQVRDSDogNDA2LFxuICAgIFZBTFVFX09VVF9PRl9SQU5HRTogNDA3LFxuICAgIERFUEVOREVOQ1lfTk9UX0VTVEFCTElTSEVEOiA0MDgsXG4gIH0sXG59O1xuXG5jb25zdCBFcnJvckNvZGVzID0ge1xuICBzY29ybTEyOiBzY29ybTEyLFxuICBzY29ybTIwMDQ6IHNjb3JtMjAwNCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEVycm9yQ29kZXM7XG4iLCJjb25zdCBWYWxpZExhbmd1YWdlcyA9IHtcbiAgJ2FhJzogJ2FhJywgJ2FiJzogJ2FiJywgJ2FlJzogJ2FlJywgJ2FmJzogJ2FmJywgJ2FrJzogJ2FrJywgJ2FtJzogJ2FtJyxcbiAgJ2FuJzogJ2FuJywgJ2FyJzogJ2FyJywgJ2FzJzogJ2FzJywgJ2F2JzogJ2F2JywgJ2F5JzogJ2F5JywgJ2F6JzogJ2F6JyxcbiAgJ2JhJzogJ2JhJywgJ2JlJzogJ2JlJywgJ2JnJzogJ2JnJywgJ2JoJzogJ2JoJywgJ2JpJzogJ2JpJywgJ2JtJzogJ2JtJyxcbiAgJ2JuJzogJ2JuJywgJ2JvJzogJ2JvJywgJ2JyJzogJ2JyJywgJ2JzJzogJ2JzJywgJ2NhJzogJ2NhJywgJ2NlJzogJ2NlJyxcbiAgJ2NoJzogJ2NoJywgJ2NvJzogJ2NvJywgJ2NyJzogJ2NyJywgJ2NzJzogJ2NzJywgJ2N1JzogJ2N1JywgJ2N2JzogJ2N2JyxcbiAgJ2N5JzogJ2N5JywgJ2RhJzogJ2RhJywgJ2RlJzogJ2RlJywgJ2R2JzogJ2R2JywgJ2R6JzogJ2R6JywgJ2VlJzogJ2VlJyxcbiAgJ2VsJzogJ2VsJywgJ2VuJzogJ2VuJywgJ2VvJzogJ2VvJywgJ2VzJzogJ2VzJywgJ2V0JzogJ2V0JywgJ2V1JzogJ2V1JyxcbiAgJ2ZhJzogJ2ZhJywgJ2ZmJzogJ2ZmJywgJ2ZpJzogJ2ZpJywgJ2ZqJzogJ2ZqJywgJ2ZvJzogJ2ZvJywgJ2ZyJzogJ2ZyJyxcbiAgJ2Z5JzogJ2Z5JywgJ2dhJzogJ2dhJywgJ2dkJzogJ2dkJywgJ2dsJzogJ2dsJywgJ2duJzogJ2duJywgJ2d1JzogJ2d1JyxcbiAgJ2d2JzogJ2d2JywgJ2hhJzogJ2hhJywgJ2hlJzogJ2hlJywgJ2hpJzogJ2hpJywgJ2hvJzogJ2hvJywgJ2hyJzogJ2hyJyxcbiAgJ2h0JzogJ2h0JywgJ2h1JzogJ2h1JywgJ2h5JzogJ2h5JywgJ2h6JzogJ2h6JywgJ2lhJzogJ2lhJywgJ2lkJzogJ2lkJyxcbiAgJ2llJzogJ2llJywgJ2lnJzogJ2lnJywgJ2lpJzogJ2lpJywgJ2lrJzogJ2lrJywgJ2lvJzogJ2lvJywgJ2lzJzogJ2lzJyxcbiAgJ2l0JzogJ2l0JywgJ2l1JzogJ2l1JywgJ2phJzogJ2phJywgJ2p2JzogJ2p2JywgJ2thJzogJ2thJywgJ2tnJzogJ2tnJyxcbiAgJ2tpJzogJ2tpJywgJ2tqJzogJ2tqJywgJ2trJzogJ2trJywgJ2tsJzogJ2tsJywgJ2ttJzogJ2ttJywgJ2tuJzogJ2tuJyxcbiAgJ2tvJzogJ2tvJywgJ2tyJzogJ2tyJywgJ2tzJzogJ2tzJywgJ2t1JzogJ2t1JywgJ2t2JzogJ2t2JywgJ2t3JzogJ2t3JyxcbiAgJ2t5JzogJ2t5JywgJ2xhJzogJ2xhJywgJ2xiJzogJ2xiJywgJ2xnJzogJ2xnJywgJ2xpJzogJ2xpJywgJ2xuJzogJ2xuJyxcbiAgJ2xvJzogJ2xvJywgJ2x0JzogJ2x0JywgJ2x1JzogJ2x1JywgJ2x2JzogJ2x2JywgJ21nJzogJ21nJywgJ21oJzogJ21oJyxcbiAgJ21pJzogJ21pJywgJ21rJzogJ21rJywgJ21sJzogJ21sJywgJ21uJzogJ21uJywgJ21vJzogJ21vJywgJ21yJzogJ21yJyxcbiAgJ21zJzogJ21zJywgJ210JzogJ210JywgJ215JzogJ215JywgJ25hJzogJ25hJywgJ25iJzogJ25iJywgJ25kJzogJ25kJyxcbiAgJ25lJzogJ25lJywgJ25nJzogJ25nJywgJ25sJzogJ25sJywgJ25uJzogJ25uJywgJ25vJzogJ25vJywgJ25yJzogJ25yJyxcbiAgJ252JzogJ252JywgJ255JzogJ255JywgJ29jJzogJ29jJywgJ29qJzogJ29qJywgJ29tJzogJ29tJywgJ29yJzogJ29yJyxcbiAgJ29zJzogJ29zJywgJ3BhJzogJ3BhJywgJ3BpJzogJ3BpJywgJ3BsJzogJ3BsJywgJ3BzJzogJ3BzJywgJ3B0JzogJ3B0JyxcbiAgJ3F1JzogJ3F1JywgJ3JtJzogJ3JtJywgJ3JuJzogJ3JuJywgJ3JvJzogJ3JvJywgJ3J1JzogJ3J1JywgJ3J3JzogJ3J3JyxcbiAgJ3NhJzogJ3NhJywgJ3NjJzogJ3NjJywgJ3NkJzogJ3NkJywgJ3NlJzogJ3NlJywgJ3NnJzogJ3NnJywgJ3NoJzogJ3NoJyxcbiAgJ3NpJzogJ3NpJywgJ3NrJzogJ3NrJywgJ3NsJzogJ3NsJywgJ3NtJzogJ3NtJywgJ3NuJzogJ3NuJywgJ3NvJzogJ3NvJyxcbiAgJ3NxJzogJ3NxJywgJ3NyJzogJ3NyJywgJ3NzJzogJ3NzJywgJ3N0JzogJ3N0JywgJ3N1JzogJ3N1JywgJ3N2JzogJ3N2JyxcbiAgJ3N3JzogJ3N3JywgJ3RhJzogJ3RhJywgJ3RlJzogJ3RlJywgJ3RnJzogJ3RnJywgJ3RoJzogJ3RoJywgJ3RpJzogJ3RpJyxcbiAgJ3RrJzogJ3RrJywgJ3RsJzogJ3RsJywgJ3RuJzogJ3RuJywgJ3RvJzogJ3RvJywgJ3RyJzogJ3RyJywgJ3RzJzogJ3RzJyxcbiAgJ3R0JzogJ3R0JywgJ3R3JzogJ3R3JywgJ3R5JzogJ3R5JywgJ3VnJzogJ3VnJywgJ3VrJzogJ3VrJywgJ3VyJzogJ3VyJyxcbiAgJ3V6JzogJ3V6JywgJ3ZlJzogJ3ZlJywgJ3ZpJzogJ3ZpJywgJ3ZvJzogJ3ZvJywgJ3dhJzogJ3dhJywgJ3dvJzogJ3dvJyxcbiAgJ3hoJzogJ3hoJywgJ3lpJzogJ3lpJywgJ3lvJzogJ3lvJywgJ3phJzogJ3phJywgJ3poJzogJ3poJywgJ3p1JzogJ3p1JyxcbiAgJ2Fhcic6ICdhYXInLCAnYWJrJzogJ2FiaycsICdhdmUnOiAnYXZlJywgJ2Fmcic6ICdhZnInLCAnYWthJzogJ2FrYScsXG4gICdhbWgnOiAnYW1oJywgJ2FyZyc6ICdhcmcnLCAnYXJhJzogJ2FyYScsICdhc20nOiAnYXNtJywgJ2F2YSc6ICdhdmEnLFxuICAnYXltJzogJ2F5bScsICdhemUnOiAnYXplJywgJ2Jhayc6ICdiYWsnLCAnYmVsJzogJ2JlbCcsICdidWwnOiAnYnVsJyxcbiAgJ2JpaCc6ICdiaWgnLCAnYmlzJzogJ2JpcycsICdiYW0nOiAnYmFtJywgJ2Jlbic6ICdiZW4nLCAndGliJzogJ3RpYicsXG4gICdib2QnOiAnYm9kJywgJ2JyZSc6ICdicmUnLCAnYm9zJzogJ2JvcycsICdjYXQnOiAnY2F0JywgJ2NoZSc6ICdjaGUnLFxuICAnY2hhJzogJ2NoYScsICdjb3MnOiAnY29zJywgJ2NyZSc6ICdjcmUnLCAnY3plJzogJ2N6ZScsICdjZXMnOiAnY2VzJyxcbiAgJ2NodSc6ICdjaHUnLCAnY2h2JzogJ2NodicsICd3ZWwnOiAnd2VsJywgJ2N5bSc6ICdjeW0nLCAnZGFuJzogJ2RhbicsXG4gICdnZXInOiAnZ2VyJywgJ2RldSc6ICdkZXUnLCAnZGl2JzogJ2RpdicsICdkem8nOiAnZHpvJywgJ2V3ZSc6ICdld2UnLFxuICAnZ3JlJzogJ2dyZScsICdlbGwnOiAnZWxsJywgJ2VuZyc6ICdlbmcnLCAnZXBvJzogJ2VwbycsICdzcGEnOiAnc3BhJyxcbiAgJ2VzdCc6ICdlc3QnLCAnYmFxJzogJ2JhcScsICdldXMnOiAnZXVzJywgJ3Blcic6ICdwZXInLCAnZmFzJzogJ2ZhcycsXG4gICdmdWwnOiAnZnVsJywgJ2Zpbic6ICdmaW4nLCAnZmlqJzogJ2ZpaicsICdmYW8nOiAnZmFvJywgJ2ZyZSc6ICdmcmUnLFxuICAnZnJhJzogJ2ZyYScsICdmcnknOiAnZnJ5JywgJ2dsZSc6ICdnbGUnLCAnZ2xhJzogJ2dsYScsICdnbGcnOiAnZ2xnJyxcbiAgJ2dybic6ICdncm4nLCAnZ3VqJzogJ2d1aicsICdnbHYnOiAnZ2x2JywgJ2hhdSc6ICdoYXUnLCAnaGViJzogJ2hlYicsXG4gICdoaW4nOiAnaGluJywgJ2htbyc6ICdobW8nLCAnaHJ2JzogJ2hydicsICdoYXQnOiAnaGF0JywgJ2h1bic6ICdodW4nLFxuICAnYXJtJzogJ2FybScsICdoeWUnOiAnaHllJywgJ2hlcic6ICdoZXInLCAnaW5hJzogJ2luYScsICdpbmQnOiAnaW5kJyxcbiAgJ2lsZSc6ICdpbGUnLCAnaWJvJzogJ2libycsICdpaWknOiAnaWlpJywgJ2lwayc6ICdpcGsnLCAnaWRvJzogJ2lkbycsXG4gICdpY2UnOiAnaWNlJywgJ2lzbCc6ICdpc2wnLCAnaXRhJzogJ2l0YScsICdpa3UnOiAnaWt1JywgJ2pwbic6ICdqcG4nLFxuICAnamF2JzogJ2phdicsICdnZW8nOiAnZ2VvJywgJ2thdCc6ICdrYXQnLCAna29uJzogJ2tvbicsICdraWsnOiAna2lrJyxcbiAgJ2t1YSc6ICdrdWEnLCAna2F6JzogJ2theicsICdrYWwnOiAna2FsJywgJ2tobSc6ICdraG0nLCAna2FuJzogJ2thbicsXG4gICdrb3InOiAna29yJywgJ2thdSc6ICdrYXUnLCAna2FzJzogJ2thcycsICdrdXInOiAna3VyJywgJ2tvbSc6ICdrb20nLFxuICAnY29yJzogJ2NvcicsICdraXInOiAna2lyJywgJ2xhdCc6ICdsYXQnLCAnbHR6JzogJ2x0eicsICdsdWcnOiAnbHVnJyxcbiAgJ2xpbSc6ICdsaW0nLCAnbGluJzogJ2xpbicsICdsYW8nOiAnbGFvJywgJ2xpdCc6ICdsaXQnLCAnbHViJzogJ2x1YicsXG4gICdsYXYnOiAnbGF2JywgJ21sZyc6ICdtbGcnLCAnbWFoJzogJ21haCcsICdtYW8nOiAnbWFvJywgJ21yaSc6ICdtcmknLFxuICAnbWFjJzogJ21hYycsICdta2QnOiAnbWtkJywgJ21hbCc6ICdtYWwnLCAnbW9uJzogJ21vbicsICdtb2wnOiAnbW9sJyxcbiAgJ21hcic6ICdtYXInLCAnbWF5JzogJ21heScsICdtc2EnOiAnbXNhJywgJ21sdCc6ICdtbHQnLCAnYnVyJzogJ2J1cicsXG4gICdteWEnOiAnbXlhJywgJ25hdSc6ICduYXUnLCAnbm9iJzogJ25vYicsICduZGUnOiAnbmRlJywgJ25lcCc6ICduZXAnLFxuICAnbmRvJzogJ25kbycsICdkdXQnOiAnZHV0JywgJ25sZCc6ICdubGQnLCAnbm5vJzogJ25ubycsICdub3InOiAnbm9yJyxcbiAgJ25ibCc6ICduYmwnLCAnbmF2JzogJ25hdicsICdueWEnOiAnbnlhJywgJ29jaSc6ICdvY2knLCAnb2ppJzogJ29qaScsXG4gICdvcm0nOiAnb3JtJywgJ29yaSc6ICdvcmknLCAnb3NzJzogJ29zcycsICdwYW4nOiAncGFuJywgJ3BsaSc6ICdwbGknLFxuICAncG9sJzogJ3BvbCcsICdwdXMnOiAncHVzJywgJ3Bvcic6ICdwb3InLCAncXVlJzogJ3F1ZScsICdyb2gnOiAncm9oJyxcbiAgJ3J1bic6ICdydW4nLCAncnVtJzogJ3J1bScsICdyb24nOiAncm9uJywgJ3J1cyc6ICdydXMnLCAna2luJzogJ2tpbicsXG4gICdzYW4nOiAnc2FuJywgJ3NyZCc6ICdzcmQnLCAnc25kJzogJ3NuZCcsICdzbWUnOiAnc21lJywgJ3NhZyc6ICdzYWcnLFxuICAnc2xvJzogJ3NsbycsICdzaW4nOiAnc2luJywgJ3Nsayc6ICdzbGsnLCAnc2x2JzogJ3NsdicsICdzbW8nOiAnc21vJyxcbiAgJ3NuYSc6ICdzbmEnLCAnc29tJzogJ3NvbScsICdhbGInOiAnYWxiJywgJ3NxaSc6ICdzcWknLCAnc3JwJzogJ3NycCcsXG4gICdzc3cnOiAnc3N3JywgJ3NvdCc6ICdzb3QnLCAnc3VuJzogJ3N1bicsICdzd2UnOiAnc3dlJywgJ3N3YSc6ICdzd2EnLFxuICAndGFtJzogJ3RhbScsICd0ZWwnOiAndGVsJywgJ3Rnayc6ICd0Z2snLCAndGhhJzogJ3RoYScsICd0aXInOiAndGlyJyxcbiAgJ3R1ayc6ICd0dWsnLCAndGdsJzogJ3RnbCcsICd0c24nOiAndHNuJywgJ3Rvbic6ICd0b24nLCAndHVyJzogJ3R1cicsXG4gICd0c28nOiAndHNvJywgJ3RhdCc6ICd0YXQnLCAndHdpJzogJ3R3aScsICd0YWgnOiAndGFoJywgJ3VpZyc6ICd1aWcnLFxuICAndWtyJzogJ3VrcicsICd1cmQnOiAndXJkJywgJ3V6Yic6ICd1emInLCAndmVuJzogJ3ZlbicsICd2aWUnOiAndmllJyxcbiAgJ3ZvbCc6ICd2b2wnLCAnd2xuJzogJ3dsbicsICd3b2wnOiAnd29sJywgJ3hobyc6ICd4aG8nLCAneWlkJzogJ3lpZCcsXG4gICd5b3InOiAneW9yJywgJ3poYSc6ICd6aGEnLCAnY2hpJzogJ2NoaScsICd6aG8nOiAnemhvJywgJ3p1bCc6ICd6dWwnLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgVmFsaWRMYW5ndWFnZXM7XG4iLCIvLyBAZmxvd1xuXG5jb25zdCBzY29ybTEyID0ge1xuICBDTUlTdHJpbmcyNTY6ICdeLnswLDI1NX0kJyxcbiAgQ01JU3RyaW5nNDA5NjogJ14uezAsNDA5Nn0kJyxcbiAgQ01JVGltZTogJ14oPzpbMDFdXFxcXGR8MlswMTIzXSk6KD86WzAxMjM0NV1cXFxcZCk6KD86WzAxMjM0NV1cXFxcZCkkJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlUaW1lc3BhbjogJ14oWzAtOV17Mix9KTooWzAtOV17Mn0pOihbMC05XXsyfSkoXFwuWzAtOV17MSwyfSk/JCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JSW50ZWdlcjogJ15cXFxcZCskJyxcbiAgQ01JU0ludGVnZXI6ICdeLT8oWzAtOV0rKSQnLFxuICBDTUlEZWNpbWFsOiAnXi0/KFswLTldezAsM30pKFxcLlswLTldKik/JCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JSWRlbnRpZmllcjogJ15bXFxcXHUwMDIxLVxcXFx1MDA3RVxcXFxzXXswLDI1NX0kJyxcbiAgQ01JRmVlZGJhY2s6ICdeLnswLDI1NX0kJywgLy8gVGhpcyBtdXN0IGJlIHJlZGVmaW5lZFxuICBDTUlJbmRleDogJ1suX10oXFxcXGQrKS4nLFxuXG4gIC8vIFZvY2FidWxhcnkgRGF0YSBUeXBlIERlZmluaXRpb25cbiAgQ01JU3RhdHVzOiAnXihwYXNzZWR8Y29tcGxldGVkfGZhaWxlZHxpbmNvbXBsZXRlfGJyb3dzZWQpJCcsXG4gIENNSVN0YXR1czI6ICdeKHBhc3NlZHxjb21wbGV0ZWR8ZmFpbGVkfGluY29tcGxldGV8YnJvd3NlZHxub3QgYXR0ZW1wdGVkKSQnLFxuICBDTUlFeGl0OiAnXih0aW1lLW91dHxzdXNwZW5kfGxvZ291dHwpJCcsXG4gIENNSVR5cGU6ICdeKHRydWUtZmFsc2V8Y2hvaWNlfGZpbGwtaW58bWF0Y2hpbmd8cGVyZm9ybWFuY2V8c2VxdWVuY2luZ3xsaWtlcnR8bnVtZXJpYykkJyxcbiAgQ01JUmVzdWx0OiAnXihjb3JyZWN0fHdyb25nfHVuYW50aWNpcGF0ZWR8bmV1dHJhbHwoWzAtOV17MCwzfSk/KFxcXFwuWzAtOV0qKT8pJCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgTkFWRXZlbnQ6ICdeKHByZXZpb3VzfGNvbnRpbnVlKSQnLFxuXG4gIC8vIERhdGEgcmFuZ2VzXG4gIHNjb3JlX3JhbmdlOiAnMCMxMDAnLFxuICBhdWRpb19yYW5nZTogJy0xIzEwMCcsXG4gIHNwZWVkX3JhbmdlOiAnLTEwMCMxMDAnLFxuICB3ZWlnaHRpbmdfcmFuZ2U6ICctMTAwIzEwMCcsXG4gIHRleHRfcmFuZ2U6ICctMSMxJyxcbn07XG5cbmNvbnN0IGFpY2MgPSB7XG4gIC4uLnNjb3JtMTIsIC4uLntcbiAgICBDTUlJZGVudGlmaWVyOiAnXlxcXFx3ezEsMjU1fSQnLFxuICB9LFxufTtcblxuY29uc3Qgc2Nvcm0yMDA0ID0ge1xuICBDTUlTdHJpbmcyMDA6ICdeW1xcXFx1MDAwMC1cXFxcdUZGRkZdezAsMjAwfSQnLFxuICBDTUlTdHJpbmcyNTA6ICdeW1xcXFx1MDAwMC1cXFxcdUZGRkZdezAsMjUwfSQnLFxuICBDTUlTdHJpbmcxMDAwOiAnXltcXFxcdTAwMDAtXFxcXHVGRkZGXXswLDEwMDB9JCcsXG4gIENNSVN0cmluZzQwMDA6ICdeW1xcXFx1MDAwMC1cXFxcdUZGRkZdezAsNDAwMH0kJyxcbiAgQ01JU3RyaW5nNjQwMDA6ICdeW1xcXFx1MDAwMC1cXFxcdUZGRkZdezAsNjQwMDB9JCcsXG4gIENNSUxhbmc6ICdeKFthLXpBLVpdezIsM318aXx4KShcXC1bYS16QS1aMC05XFwtXXsyLDh9KT8kfF4kJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlMYW5nU3RyaW5nMjUwOiAnXihcXHtsYW5nPShbYS16QS1aXXsyLDN9fGl8eCkoXFwtW2EtekEtWjAtOVxcLV17Miw4fSk/XFx9KT8oKD8hXFx7LiokKS57MCwyNTB9JCk/JCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JTGFuZ2NyOiAnXigoXFx7bGFuZz0oW2EtekEtWl17MiwzfXxpfHgpPyhcXC1bYS16QS1aMC05XFwtXXsyLDh9KT9cXH0pKSguKj8pJCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JTGFuZ1N0cmluZzI1MGNyOiAnXigoXFx7bGFuZz0oW2EtekEtWl17MiwzfXxpfHgpPyhcXC1bYS16QS1aMC05XFwtXXsyLDh9KT9cXH0pPyguezAsMjUwfSk/KT8kJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlMYW5nU3RyaW5nNDAwMDogJ14oXFx7bGFuZz0oW2EtekEtWl17MiwzfXxpfHgpKFxcLVthLXpBLVowLTlcXC1dezIsOH0pP1xcfSk/KCg/IVxcey4qJCkuezAsNDAwMH0kKT8kJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlUaW1lOiAnXigxOVs3LTldezF9WzAtOV17MX18MjBbMC0yXXsxfVswLTldezF9fDIwM1swLThdezF9KSgoLSgwWzEtOV17MX18MVswLTJdezF9KSkoKC0oMFsxLTldezF9fFsxLTJdezF9WzAtOV17MX18M1swLTFdezF9KSkoVChbMC0xXXsxfVswLTldezF9fDJbMC0zXXsxfSkoKDpbMC01XXsxfVswLTldezF9KSgoOlswLTVdezF9WzAtOV17MX0pKChcXFxcLlswLTldezEsMn0pKChafChbK3wtXShbMC0xXXsxfVswLTldezF9fDJbMC0zXXsxfSkpKSg6WzAtNV17MX1bMC05XXsxfSk/KT8pPyk/KT8pPyk/KT8kJyxcbiAgQ01JVGltZXNwYW46ICdeUCg/OihbLixcXFxcZF0rKVkpPyg/OihbLixcXFxcZF0rKU0pPyg/OihbLixcXFxcZF0rKVcpPyg/OihbLixcXFxcZF0rKUQpPyg/OlQ/KD86KFsuLFxcXFxkXSspSCk/KD86KFsuLFxcXFxkXSspTSk/KD86KFsuLFxcXFxkXSspUyk/KT8kJyxcbiAgQ01JSW50ZWdlcjogJ15cXFxcZCskJyxcbiAgQ01JU0ludGVnZXI6ICdeLT8oWzAtOV0rKSQnLFxuICBDTUlEZWNpbWFsOiAnXi0/KFswLTldezEsNX0pKFxcXFwuWzAtOV17MSwxOH0pPyQnLFxuICBDTUlJZGVudGlmaWVyOiAnXlxcXFxTezEsMjUwfVthLXpBLVowLTldJCcsXG4gIENNSVNob3J0SWRlbnRpZmllcjogJ15bXFxcXHdcXFxcLlxcXFwtXFxcXF9dezEsMjUwfSQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUxvbmdJZGVudGlmaWVyOiAnXig/Oig/IXVybjopXFxcXFN7MSw0MDAwfXx1cm46W0EtWmEtejAtOS1dezEsMzF9OlxcXFxTezEsNDAwMH18LnsxLDQwMDB9KSQnLCAvLyBuZWVkIHRvIHJlLWV4YW1pbmUgdGhpc1xuICBDTUlGZWVkYmFjazogJ14uKiQnLCAvLyBUaGlzIG11c3QgYmUgcmVkZWZpbmVkXG4gIENNSUluZGV4OiAnWy5fXShcXFxcZCspLicsXG4gIENNSUluZGV4U3RvcmU6ICcuTihcXFxcZCspLicsXG5cbiAgLy8gVm9jYWJ1bGFyeSBEYXRhIFR5cGUgRGVmaW5pdGlvblxuICBDTUlDU3RhdHVzOiAnXihjb21wbGV0ZWR8aW5jb21wbGV0ZXxub3QgYXR0ZW1wdGVkfHVua25vd24pJCcsXG4gIENNSVNTdGF0dXM6ICdeKHBhc3NlZHxmYWlsZWR8dW5rbm93bikkJyxcbiAgQ01JRXhpdDogJ14odGltZS1vdXR8c3VzcGVuZHxsb2dvdXR8bm9ybWFsKSQnLFxuICBDTUlUeXBlOiAnXih0cnVlLWZhbHNlfGNob2ljZXxmaWxsLWlufGxvbmctZmlsbC1pbnxtYXRjaGluZ3xwZXJmb3JtYW5jZXxzZXF1ZW5jaW5nfGxpa2VydHxudW1lcmljfG90aGVyKSQnLFxuICBDTUlSZXN1bHQ6ICdeKGNvcnJlY3R8aW5jb3JyZWN0fHVuYW50aWNpcGF0ZWR8bmV1dHJhbHwtPyhbMC05XXsxLDR9KShcXFxcLlswLTldezEsMTh9KT8pJCcsXG4gIE5BVkV2ZW50OiAnXihwcmV2aW91c3xjb250aW51ZXxleGl0fGV4aXRBbGx8YWJhbmRvbnxhYmFuZG9uQWxsfHN1c3BlbmRBbGx8XFx7dGFyZ2V0PVxcXFxTezAsMjAwfVthLXpBLVowLTldXFx9Y2hvaWNlfGp1bXApJCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgTkFWQm9vbGVhbjogJ14odW5rbm93bnx0cnVlfGZhbHNlJCknLFxuICBOQVZUYXJnZXQ6ICdeKHByZXZpb3VzfGNvbnRpbnVlfGNob2ljZS57dGFyZ2V0PVxcXFxTezAsMjAwfVthLXpBLVowLTldfSkkJyxcblxuICAvLyBEYXRhIHJhbmdlc1xuICBzY2FsZWRfcmFuZ2U6ICctMSMxJyxcbiAgYXVkaW9fcmFuZ2U6ICcwIyonLFxuICBzcGVlZF9yYW5nZTogJzAjKicsXG4gIHRleHRfcmFuZ2U6ICctMSMxJyxcbiAgcHJvZ3Jlc3NfcmFuZ2U6ICcwIzEnLFxufTtcblxuY29uc3QgUmVnZXggPSB7XG4gIGFpY2M6IGFpY2MsXG4gIHNjb3JtMTI6IHNjb3JtMTIsXG4gIHNjb3JtMjAwNDogc2Nvcm0yMDA0LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgUmVnZXg7XG4iLCIvLyBAZmxvd1xuaW1wb3J0IFJlZ2V4IGZyb20gJy4vcmVnZXgnO1xuXG5jb25zdCBzY29ybTIwMDRfcmVnZXggPSBSZWdleC5zY29ybTIwMDQ7XG5cbmNvbnN0IGxlYXJuZXIgPSB7XG4gICd0cnVlLWZhbHNlJzoge1xuICAgIGZvcm1hdDogJ150cnVlJHxeZmFsc2UkJyxcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAnY2hvaWNlJzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBtYXg6IDM2LFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgdW5pcXVlOiB0cnVlLFxuICB9LFxuICAnZmlsbC1pbic6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nU3RyaW5nMjUwLFxuICAgIG1heDogMTAsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAnbG9uZy1maWxsLWluJzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSUxhbmdTdHJpbmc0MDAwLFxuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG4gICdtYXRjaGluZyc6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgZm9ybWF0Mjogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBtYXg6IDM2LFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgZGVsaW1pdGVyMjogJ1suXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ3BlcmZvcm1hbmNlJzoge1xuICAgIGZvcm1hdDogJ14kfCcgKyBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIGZvcm1hdDI6IHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsICsgJ3xeJHwnICtcbiAgICAgICAgc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBtYXg6IDI1MCxcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIGRlbGltaXRlcjI6ICdbLl0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG4gICdzZXF1ZW5jaW5nJzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBtYXg6IDM2LFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ2xpa2VydCc6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ251bWVyaWMnOiB7XG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCxcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAnb3RoZXInOiB7XG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU3RyaW5nNDAwMCxcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxufTtcblxuY29uc3QgY29ycmVjdCA9IHtcbiAgJ3RydWUtZmFsc2UnOiB7XG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogJ150cnVlJHxeZmFsc2UkJyxcbiAgICBsaW1pdDogMSxcbiAgfSxcbiAgJ2Nob2ljZSc6IHtcbiAgICBtYXg6IDM2LFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgdW5pcXVlOiB0cnVlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICB9LFxuICAnZmlsbC1pbic6IHtcbiAgICBtYXg6IDEwLFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSUxhbmdTdHJpbmcyNTBjcixcbiAgfSxcbiAgJ2xvbmctZmlsbC1pbic6IHtcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogdHJ1ZSxcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nU3RyaW5nNDAwMCxcbiAgfSxcbiAgJ21hdGNoaW5nJzoge1xuICAgIG1heDogMzYsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICBkZWxpbWl0ZXIyOiAnWy5dJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIGZvcm1hdDI6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gIH0sXG4gICdwZXJmb3JtYW5jZSc6IHtcbiAgICBtYXg6IDI1MCxcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIGRlbGltaXRlcjI6ICdbLl0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6ICdeJHwnICsgc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBmb3JtYXQyOiBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCArICd8XiR8JyArXG4gICAgICAgIHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gIH0sXG4gICdzZXF1ZW5jaW5nJzoge1xuICAgIG1heDogMzYsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICB9LFxuICAnbGlrZXJ0Jzoge1xuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgbGltaXQ6IDEsXG4gIH0sXG4gICdudW1lcmljJzoge1xuICAgIG1heDogMixcbiAgICBkZWxpbWl0ZXI6ICdbOl0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsLFxuICAgIGxpbWl0OiAxLFxuICB9LFxuICAnb3RoZXInOiB7XG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVN0cmluZzQwMDAsXG4gICAgbGltaXQ6IDEsXG4gIH0sXG59O1xuXG5jb25zdCBSZXNwb25zZXMgPSB7XG4gIGxlYXJuZXI6IGxlYXJuZXIsXG4gIGNvcnJlY3Q6IGNvcnJlY3QsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZXNwb25zZXM7XG4iLCIvLyBAZmxvd1xuXG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuXG5jb25zdCBzY29ybTEyX2Vycm9ycyA9IEFQSUNvbnN0YW50cy5zY29ybTEyLmVycm9yX2Rlc2NyaXB0aW9ucztcbmNvbnN0IGFpY2NfZXJyb3JzID0gQVBJQ29uc3RhbnRzLmFpY2MuZXJyb3JfZGVzY3JpcHRpb25zO1xuY29uc3Qgc2Nvcm0yMDA0X2Vycm9ycyA9IEFQSUNvbnN0YW50cy5zY29ybTIwMDQuZXJyb3JfZGVzY3JpcHRpb25zO1xuXG4vKipcbiAqIEJhc2UgVmFsaWRhdGlvbiBFeGNlcHRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIFZhbGlkYXRpb25FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIHRvIHRha2UgaW4gYW4gZXJyb3IgbWVzc2FnZSBhbmQgY29kZVxuICAgKiBAcGFyYW0ge251bWJlcn0gZXJyb3JDb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlcnJvck1lc3NhZ2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRldGFpbGVkTWVzc2FnZVxuICAgKi9cbiAgY29uc3RydWN0b3IoZXJyb3JDb2RlOiBudW1iZXIsIGVycm9yTWVzc2FnZTogU3RyaW5nLCBkZXRhaWxlZE1lc3NhZ2U6IFN0cmluZykge1xuICAgIHN1cGVyKGVycm9yTWVzc2FnZSk7XG4gICAgdGhpcy4jZXJyb3JDb2RlID0gZXJyb3JDb2RlO1xuICAgIHRoaXMuI2Vycm9yTWVzc2FnZSA9IGVycm9yTWVzc2FnZTtcbiAgICB0aGlzLiNkZXRhaWxlZE1lc3NhZ2UgPSBkZXRhaWxlZE1lc3NhZ2U7XG4gIH1cblxuICAjZXJyb3JDb2RlO1xuICAjZXJyb3JNZXNzYWdlO1xuICAjZGV0YWlsZWRNZXNzYWdlO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNlcnJvckNvZGVcbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cbiAgZ2V0IGVycm9yQ29kZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jZXJyb3JDb2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2Vycm9yTWVzc2FnZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZXJyb3JNZXNzYWdlKCkge1xuICAgIHJldHVybiB0aGlzLiNlcnJvck1lc3NhZ2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZGV0YWlsZWRNZXNzYWdlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBkZXRhaWxlZE1lc3NhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2RldGFpbGVkTWVzc2FnZTtcbiAgfVxufVxuXG4vKipcbiAqIFNDT1JNIDEuMiBWYWxpZGF0aW9uIEVycm9yXG4gKi9cbmV4cG9ydCBjbGFzcyBTY29ybTEyVmFsaWRhdGlvbkVycm9yIGV4dGVuZHMgVmFsaWRhdGlvbkVycm9yIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIHRvIHRha2UgaW4gYW4gZXJyb3IgY29kZVxuICAgKiBAcGFyYW0ge251bWJlcn0gZXJyb3JDb2RlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlcnJvckNvZGU6IG51bWJlcikge1xuICAgIGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNjb3JtMTJfZXJyb3JzLCBTdHJpbmcoZXJyb3JDb2RlKSkpIHtcbiAgICAgIHN1cGVyKGVycm9yQ29kZSwgc2Nvcm0xMl9lcnJvcnNbU3RyaW5nKGVycm9yQ29kZSldLmJhc2ljTWVzc2FnZSwgc2Nvcm0xMl9lcnJvcnNbU3RyaW5nKGVycm9yQ29kZSldLmRldGFpbE1lc3NhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdXBlcigxMDEsIHNjb3JtMTJfZXJyb3JzWycxMDEnXS5iYXNpY01lc3NhZ2UsIHNjb3JtMTJfZXJyb3JzWycxMDEnXS5kZXRhaWxNZXNzYWdlKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBBSUNDIFZhbGlkYXRpb24gRXJyb3JcbiAqL1xuZXhwb3J0IGNsYXNzIEFJQ0NWYWxpZGF0aW9uRXJyb3IgZXh0ZW5kcyBWYWxpZGF0aW9uRXJyb3Ige1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgdG8gdGFrZSBpbiBhbiBlcnJvciBjb2RlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBlcnJvckNvZGVcbiAgICovXG4gIGNvbnN0cnVjdG9yKGVycm9yQ29kZTogbnVtYmVyKSB7XG4gICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoYWljY19lcnJvcnMsIFN0cmluZyhlcnJvckNvZGUpKSkge1xuICAgICAgc3VwZXIoZXJyb3JDb2RlLCBhaWNjX2Vycm9yc1tTdHJpbmcoZXJyb3JDb2RlKV0uYmFzaWNNZXNzYWdlLCBhaWNjX2Vycm9yc1tTdHJpbmcoZXJyb3JDb2RlKV0uZGV0YWlsTWVzc2FnZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1cGVyKDEwMSwgYWljY19lcnJvcnNbJzEwMSddLmJhc2ljTWVzc2FnZSwgYWljY19lcnJvcnNbJzEwMSddLmRldGFpbE1lc3NhZ2UpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFNDT1JNIDIwMDQgVmFsaWRhdGlvbiBFcnJvclxuICovXG5leHBvcnQgY2xhc3MgU2Nvcm0yMDA0VmFsaWRhdGlvbkVycm9yIGV4dGVuZHMgVmFsaWRhdGlvbkVycm9yIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIHRvIHRha2UgaW4gYW4gZXJyb3IgY29kZVxuICAgKiBAcGFyYW0ge251bWJlcn0gZXJyb3JDb2RlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlcnJvckNvZGU6IG51bWJlcikge1xuICAgIGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNjb3JtMjAwNF9lcnJvcnMsIFN0cmluZyhlcnJvckNvZGUpKSkge1xuICAgICAgc3VwZXIoZXJyb3JDb2RlLCBzY29ybTIwMDRfZXJyb3JzW1N0cmluZyhlcnJvckNvZGUpXS5iYXNpY01lc3NhZ2UsIHNjb3JtMjAwNF9lcnJvcnNbU3RyaW5nKGVycm9yQ29kZSldLmRldGFpbE1lc3NhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdXBlcigxMDEsIHNjb3JtMjAwNF9lcnJvcnNbJzEwMSddLmJhc2ljTWVzc2FnZSwgc2Nvcm0yMDA0X2Vycm9yc1snMTAxJ10uZGV0YWlsTWVzc2FnZSk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgU2Nvcm0yMDA0QVBJIGZyb20gJy4uL1Njb3JtMjAwNEFQSSc7XG5cbndpbmRvdy5TY29ybTIwMDRBUEkgPSBTY29ybTIwMDRBUEk7XG4iLCIvLyBAZmxvd1xuZXhwb3J0IGNvbnN0IFNFQ09ORFNfUEVSX1NFQ09ORCA9IDEuMDtcbmV4cG9ydCBjb25zdCBTRUNPTkRTX1BFUl9NSU5VVEUgPSA2MDtcbmV4cG9ydCBjb25zdCBTRUNPTkRTX1BFUl9IT1VSID0gNjAgKiBTRUNPTkRTX1BFUl9NSU5VVEU7XG5leHBvcnQgY29uc3QgU0VDT05EU19QRVJfREFZID0gMjQgKiBTRUNPTkRTX1BFUl9IT1VSO1xuXG5jb25zdCBkZXNpZ25hdGlvbnMgPSBbXG4gIFsnRCcsIFNFQ09ORFNfUEVSX0RBWV0sXG4gIFsnSCcsIFNFQ09ORFNfUEVSX0hPVVJdLFxuICBbJ00nLCBTRUNPTkRTX1BFUl9NSU5VVEVdLFxuICBbJ1MnLCBTRUNPTkRTX1BFUl9TRUNPTkRdLFxuXTtcblxuLyoqXG4gKiBDb252ZXJ0cyBhIE51bWJlciB0byBhIFN0cmluZyBvZiBISDpNTTpTU1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB0b3RhbFNlY29uZHNcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNlY29uZHNBc0hITU1TUyh0b3RhbFNlY29uZHM6IE51bWJlcikge1xuICAvLyBTQ09STSBzcGVjIGRvZXMgbm90IGRlYWwgd2l0aCBuZWdhdGl2ZSBkdXJhdGlvbnMsIGdpdmUgemVybyBiYWNrXG4gIGlmICghdG90YWxTZWNvbmRzIHx8IHRvdGFsU2Vjb25kcyA8PSAwKSB7XG4gICAgcmV0dXJuICcwMDowMDowMCc7XG4gIH1cblxuICBjb25zdCBob3VycyA9IE1hdGguZmxvb3IodG90YWxTZWNvbmRzIC8gU0VDT05EU19QRVJfSE9VUik7XG5cbiAgY29uc3QgZGF0ZU9iaiA9IG5ldyBEYXRlKHRvdGFsU2Vjb25kcyAqIDEwMDApO1xuICBjb25zdCBtaW51dGVzID0gZGF0ZU9iai5nZXRVVENNaW51dGVzKCk7XG4gIC8vIG1ha2Ugc3VyZSB3ZSBhZGQgYW55IHBvc3NpYmxlIGRlY2ltYWwgdmFsdWVcbiAgY29uc3Qgc2Vjb25kcyA9IGRhdGVPYmouZ2V0U2Vjb25kcygpO1xuICBjb25zdCBtcyA9IHRvdGFsU2Vjb25kcyAlIDEuMDtcbiAgbGV0IG1zU3RyID0gJyc7XG4gIGlmIChjb3VudERlY2ltYWxzKG1zKSA+IDApIHtcbiAgICBpZiAoY291bnREZWNpbWFscyhtcykgPiAyKSB7XG4gICAgICBtc1N0ciA9IG1zLnRvRml4ZWQoMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1zU3RyID0gU3RyaW5nKG1zKTtcbiAgICB9XG4gICAgbXNTdHIgPSAnLicgKyBtc1N0ci5zcGxpdCgnLicpWzFdO1xuICB9XG5cbiAgcmV0dXJuIChob3VycyArICc6JyArIG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzKS5yZXBsYWNlKC9cXGJcXGRcXGIvZyxcbiAgICAgICcwJCYnKSArIG1zU3RyO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZSB0aGUgbnVtYmVyIG9mIHNlY29uZHMgZnJvbSBJU08gODYwMSBEdXJhdGlvblxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBzZWNvbmRzXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZWNvbmRzQXNJU09EdXJhdGlvbihzZWNvbmRzOiBOdW1iZXIpIHtcbiAgLy8gU0NPUk0gc3BlYyBkb2VzIG5vdCBkZWFsIHdpdGggbmVnYXRpdmUgZHVyYXRpb25zLCBnaXZlIHplcm8gYmFja1xuICBpZiAoIXNlY29uZHMgfHwgc2Vjb25kcyA8PSAwKSB7XG4gICAgcmV0dXJuICdQVDBTJztcbiAgfVxuXG4gIGxldCBkdXJhdGlvbiA9ICdQJztcbiAgbGV0IHJlbWFpbmRlciA9IHNlY29uZHM7XG5cbiAgZGVzaWduYXRpb25zLmZvckVhY2goKFtzaWduLCBjdXJyZW50X3NlY29uZHNdKSA9PiB7XG4gICAgbGV0IHZhbHVlID0gTWF0aC5mbG9vcihyZW1haW5kZXIgLyBjdXJyZW50X3NlY29uZHMpO1xuXG4gICAgcmVtYWluZGVyID0gcmVtYWluZGVyICUgY3VycmVudF9zZWNvbmRzO1xuICAgIGlmIChjb3VudERlY2ltYWxzKHJlbWFpbmRlcikgPiAyKSB7XG4gICAgICByZW1haW5kZXIgPSBOdW1iZXIoTnVtYmVyKHJlbWFpbmRlcikudG9GaXhlZCgyKSk7XG4gICAgfVxuICAgIC8vIElmIHdlIGhhdmUgYW55dGhpbmcgbGVmdCBpbiB0aGUgcmVtYWluZGVyLCBhbmQgd2UncmUgY3VycmVudGx5IGFkZGluZ1xuICAgIC8vIHNlY29uZHMgdG8gdGhlIGR1cmF0aW9uLCBnbyBhaGVhZCBhbmQgYWRkIHRoZSBkZWNpbWFsIHRvIHRoZSBzZWNvbmRzXG4gICAgaWYgKHNpZ24gPT09ICdTJyAmJiByZW1haW5kZXIgPiAwKSB7XG4gICAgICB2YWx1ZSArPSByZW1haW5kZXI7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBpZiAoKGR1cmF0aW9uLmluZGV4T2YoJ0QnKSA+IDAgfHxcbiAgICAgICAgICBzaWduID09PSAnSCcgfHwgc2lnbiA9PT0gJ00nIHx8IHNpZ24gPT09ICdTJykgJiZcbiAgICAgICAgICBkdXJhdGlvbi5pbmRleE9mKCdUJykgPT09IC0xKSB7XG4gICAgICAgIGR1cmF0aW9uICs9ICdUJztcbiAgICAgIH1cbiAgICAgIGR1cmF0aW9uICs9IGAke3ZhbHVlfSR7c2lnbn1gO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGR1cmF0aW9uO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZSB0aGUgbnVtYmVyIG9mIHNlY29uZHMgZnJvbSBISDpNTTpTUy5ERERERERcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGltZVN0cmluZ1xuICogQHBhcmFtIHtSZWdFeHB9IHRpbWVSZWdleFxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGltZUFzU2Vjb25kcyh0aW1lU3RyaW5nOiBTdHJpbmcsIHRpbWVSZWdleDogUmVnRXhwKSB7XG4gIGlmICghdGltZVN0cmluZyB8fCB0eXBlb2YgdGltZVN0cmluZyAhPT0gJ3N0cmluZycgfHxcbiAgICAgICF0aW1lU3RyaW5nLm1hdGNoKHRpbWVSZWdleCkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICBjb25zdCBwYXJ0cyA9IHRpbWVTdHJpbmcuc3BsaXQoJzonKTtcbiAgY29uc3QgaG91cnMgPSBOdW1iZXIocGFydHNbMF0pO1xuICBjb25zdCBtaW51dGVzID0gTnVtYmVyKHBhcnRzWzFdKTtcbiAgY29uc3Qgc2Vjb25kcyA9IE51bWJlcihwYXJ0c1syXSk7XG4gIHJldHVybiAoaG91cnMgKiAzNjAwKSArIChtaW51dGVzICogNjApICsgc2Vjb25kcztcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgdGhlIG51bWJlciBvZiBzZWNvbmRzIGZyb20gSVNPIDg2MDEgRHVyYXRpb25cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZHVyYXRpb25cbiAqIEBwYXJhbSB7UmVnRXhwfSBkdXJhdGlvblJlZ2V4XG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXREdXJhdGlvbkFzU2Vjb25kcyhkdXJhdGlvbjogU3RyaW5nLCBkdXJhdGlvblJlZ2V4OiBSZWdFeHApIHtcbiAgaWYgKCFkdXJhdGlvbiB8fCAhZHVyYXRpb24ubWF0Y2goZHVyYXRpb25SZWdleCkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGNvbnN0IFssIHllYXJzLCBtb250aHMsICwgZGF5cywgaG91cnMsIG1pbnV0ZXMsIHNlY29uZHNdID0gbmV3IFJlZ0V4cChcbiAgICAgIGR1cmF0aW9uUmVnZXgpLmV4ZWMoZHVyYXRpb24pIHx8IFtdO1xuXG4gIGxldCByZXN1bHQgPSAwLjA7XG5cbiAgcmVzdWx0ICs9IChOdW1iZXIoc2Vjb25kcykgKiAxLjAgfHwgMC4wKTtcbiAgcmVzdWx0ICs9IChOdW1iZXIobWludXRlcykgKiA2MC4wIHx8IDAuMCk7XG4gIHJlc3VsdCArPSAoTnVtYmVyKGhvdXJzKSAqIDM2MDAuMCB8fCAwLjApO1xuICByZXN1bHQgKz0gKE51bWJlcihkYXlzKSAqICg2MCAqIDYwICogMjQuMCkgfHwgMC4wKTtcbiAgcmVzdWx0ICs9IChOdW1iZXIoeWVhcnMpICogKDYwICogNjAgKiAyNCAqIDM2NS4wKSB8fCAwLjApO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQWRkcyB0b2dldGhlciB0d28gSVNPODYwMSBEdXJhdGlvbiBzdHJpbmdzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGZpcnN0XG4gKiBAcGFyYW0ge3N0cmluZ30gc2Vjb25kXG4gKiBAcGFyYW0ge1JlZ0V4cH0gZHVyYXRpb25SZWdleFxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkVHdvRHVyYXRpb25zKFxuICAgIGZpcnN0OiBTdHJpbmcsXG4gICAgc2Vjb25kOiBTdHJpbmcsXG4gICAgZHVyYXRpb25SZWdleDogUmVnRXhwKSB7XG4gIHJldHVybiBnZXRTZWNvbmRzQXNJU09EdXJhdGlvbihcbiAgICAgIGdldER1cmF0aW9uQXNTZWNvbmRzKGZpcnN0LCBkdXJhdGlvblJlZ2V4KSArXG4gICAgICBnZXREdXJhdGlvbkFzU2Vjb25kcyhzZWNvbmQsIGR1cmF0aW9uUmVnZXgpLFxuICApO1xufVxuXG4vKipcbiAqIEFkZCB0b2dldGhlciB0d28gSEg6TU06U1MuREQgc3RyaW5nc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaXJzdFxuICogQHBhcmFtIHtzdHJpbmd9IHNlY29uZFxuICogQHBhcmFtIHtSZWdFeHB9IHRpbWVSZWdleFxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkSEhNTVNTVGltZVN0cmluZ3MoXG4gICAgZmlyc3Q6IFN0cmluZyxcbiAgICBzZWNvbmQ6IFN0cmluZyxcbiAgICB0aW1lUmVnZXg6IFJlZ0V4cCkge1xuICByZXR1cm4gZ2V0U2Vjb25kc0FzSEhNTVNTKFxuICAgICAgZ2V0VGltZUFzU2Vjb25kcyhmaXJzdCwgdGltZVJlZ2V4KSArXG4gICAgICBnZXRUaW1lQXNTZWNvbmRzKFxuICAgICAgICAgIHNlY29uZCwgdGltZVJlZ2V4KSxcbiAgKTtcbn1cblxuLyoqXG4gKiBGbGF0dGVuIGEgSlNPTiBvYmplY3QgZG93biB0byBzdHJpbmcgcGF0aHMgZm9yIGVhY2ggdmFsdWVzXG4gKiBAcGFyYW0ge29iamVjdH0gZGF0YVxuICogQHJldHVybiB7b2JqZWN0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmxhdHRlbihkYXRhKSB7XG4gIGNvbnN0IHJlc3VsdCA9IHt9O1xuXG4gIC8qKlxuICAgKiBSZWN1cnNlIHRocm91Z2ggdGhlIG9iamVjdFxuICAgKiBAcGFyYW0geyp9IGN1clxuICAgKiBAcGFyYW0geyp9IHByb3BcbiAgICovXG4gIGZ1bmN0aW9uIHJlY3Vyc2UoY3VyLCBwcm9wKSB7XG4gICAgaWYgKE9iamVjdChjdXIpICE9PSBjdXIpIHtcbiAgICAgIHJlc3VsdFtwcm9wXSA9IGN1cjtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoY3VyKSkge1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBjdXIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHJlY3Vyc2UoY3VyW2ldLCBwcm9wICsgJ1snICsgaSArICddJyk7XG4gICAgICAgIGlmIChsID09PSAwKSByZXN1bHRbcHJvcF0gPSBbXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGlzRW1wdHkgPSB0cnVlO1xuICAgICAgZm9yIChjb25zdCBwIGluIGN1cikge1xuICAgICAgICBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChjdXIsIHApKSB7XG4gICAgICAgICAgaXNFbXB0eSA9IGZhbHNlO1xuICAgICAgICAgIHJlY3Vyc2UoY3VyW3BdLCBwcm9wID8gcHJvcCArICcuJyArIHAgOiBwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGlzRW1wdHkgJiYgcHJvcCkgcmVzdWx0W3Byb3BdID0ge307XG4gICAgfVxuICB9XG5cbiAgcmVjdXJzZShkYXRhLCAnJyk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVW4tZmxhdHRlbiBhIGZsYXQgSlNPTiBvYmplY3RcbiAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmZsYXR0ZW4oZGF0YSkge1xuICAndXNlIHN0cmljdCc7XG4gIGlmIChPYmplY3QoZGF0YSkgIT09IGRhdGEgfHwgQXJyYXkuaXNBcnJheShkYXRhKSkgcmV0dXJuIGRhdGE7XG4gIGNvbnN0IHJlZ2V4ID0gL1xcLj8oW14uW1xcXV0rKXxcXFsoXFxkKyldL2c7XG4gIGNvbnN0IHJlc3VsdCA9IHt9O1xuICBmb3IgKGNvbnN0IHAgaW4gZGF0YSkge1xuICAgIGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIHApKSB7XG4gICAgICBsZXQgY3VyID0gcmVzdWx0O1xuICAgICAgbGV0IHByb3AgPSAnJztcbiAgICAgIGxldCBtID0gcmVnZXguZXhlYyhwKTtcbiAgICAgIHdoaWxlIChtKSB7XG4gICAgICAgIGN1ciA9IGN1cltwcm9wXSB8fCAoY3VyW3Byb3BdID0gKG1bMl0gPyBbXSA6IHt9KSk7XG4gICAgICAgIHByb3AgPSBtWzJdIHx8IG1bMV07XG4gICAgICAgIG0gPSByZWdleC5leGVjKHApO1xuICAgICAgfVxuICAgICAgY3VyW3Byb3BdID0gZGF0YVtwXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdFsnJ10gfHwgcmVzdWx0O1xufVxuXG4vKipcbiAqIENvdW50cyB0aGUgbnVtYmVyIG9mIGRlY2ltYWwgcGxhY2VzXG4gKiBAcGFyYW0ge251bWJlcn0gbnVtXG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb3VudERlY2ltYWxzKG51bTogbnVtYmVyKSB7XG4gIGlmIChNYXRoLmZsb29yKG51bSkgPT09IG51bSB8fCBTdHJpbmcobnVtKS5pbmRleE9mKCcuJykgPCAwKSByZXR1cm4gMDtcbiAgY29uc3QgcGFydHMgPSBudW0udG9TdHJpbmcoKS5zcGxpdCgnLicpWzFdO1xuICByZXR1cm4gcGFydHMubGVuZ3RoIHx8IDA7XG59XG4iXX0=
