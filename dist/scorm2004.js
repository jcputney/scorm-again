/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/lodash.debounce/index.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash.debounce/index.js ***!
  \***********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
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
var freeGlobal = (typeof __webpack_require__.g === "undefined" ? "undefined" : _typeof(__webpack_require__.g)) == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

/** Detect free variable `self`. */
var freeSelf = (typeof self === "undefined" ? "undefined" : _typeof(self)) == 'object' && self && self.Object === Object && self;

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
var now = function now() {
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
    return lastCallTime === undefined || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
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
  var type = _typeof(value);
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
  return !!value && _typeof(value) == 'object';
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
  return _typeof(value) == 'symbol' || isObjectLike(value) && objectToString.call(value) == symbolTag;
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
    value = isObject(other) ? other + '' : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
module.exports = debounce;

/***/ }),

/***/ "./src/BaseAPI.js":
/*!************************!*\
  !*** ./src/BaseAPI.js ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ BaseAPI; }
/* harmony export */ });
/* harmony import */ var _cmi_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cmi/common */ "./src/cmi/common.js");
/* harmony import */ var _exceptions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./exceptions */ "./src/exceptions.js");
/* harmony import */ var _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants/error_codes */ "./src/constants/error_codes.js");
/* harmony import */ var _constants_api_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants/api_constants */ "./src/constants/api_constants.js");
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utilities */ "./src/utilities.js");
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lodash.debounce */ "./node_modules/lodash.debounce/index.js");
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_5__);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }






var global_constants = _constants_api_constants__WEBPACK_IMPORTED_MODULE_3__["default"].global;
var scorm12_error_codes = _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__["default"].scorm12;

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
        },
        requestHandler: function requestHandler(commitObject) {
          return commitObject;
        },
        onLogMessage: function onLogMessage(messageLevel, logMessage) {
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
     */,
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
          if (e instanceof _exceptions__WEBPACK_IMPORTED_MODULE_1__.ValidationError) {
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
          if (e instanceof _exceptions__WEBPACK_IMPORTED_MODULE_1__.ValidationError) {
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
      }

      // If we didn't have any errors while setting the data, go ahead and
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
        this.settings.onLogMessage(messageLevel, logMessage);
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
          if (refObject instanceof _cmi_common__WEBPACK_IMPORTED_MODULE_0__.CMIArray) {
            var index = parseInt(structure[i + 1], 10);

            // SCO is trying to set an item on an array
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
              }

              // Have to update i value to skip the array position
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
    value: function validateCorrectResponse(_CMIElement, _value) {
      // just a stub method
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
        if (refObject instanceof _cmi_common__WEBPACK_IMPORTED_MODULE_0__.CMIArray) {
          var index = parseInt(structure[i + 1], 10);

          // SCO is trying to set an item on an array
          if (!isNaN(index)) {
            var item = refObject.childArray[index];
            if (item) {
              refObject = item;
            } else {
              this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).VALUE_NOT_INITIALIZED, uninitializedErrorMessage);
              break;
            }

            // Have to update i value to skip the array position
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
      var _loop = function _loop() {
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
        var _ret = _loop();
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
      var _loop2 = function _loop2() {
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
        var _ret2 = _loop2();
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
      });

      // CMI interactions need to have id and type loaded before any other fields
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
        _this3.loadFromJSON((0,_utilities__WEBPACK_IMPORTED_MODULE_4__.unflatten)(obj), CMIElement);
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
      this.startingData = json;

      // could this be refactored down to flatten(json) then setCMIValue on each?
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
      var cmi = this.cmi;
      // Do we want/need to return fields that have no set value?
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
            params = settings.requestHandler(params);
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
            params = settings.requestHandler(params);
            fetch(url, {
              method: 'POST',
              body: params instanceof Array ? params.join('&') : JSON.stringify(params),
              headers: _objectSpread(_objectSpread({}, settings.xhrHeaders), {}, {
                'Content-Type': settings.commitRequestDataType
              }),
              credentials: settings.xhrWithCredentials ? 'include' : undefined,
              keepalive: true
            });
            result = {};
            result.result = global_constants.SCORM_TRUE;
            result.errorCode = 0;
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
      if (typeof (lodash_debounce__WEBPACK_IMPORTED_MODULE_5___default()) !== 'undefined') {
        var debounced = lodash_debounce__WEBPACK_IMPORTED_MODULE_5___default()(process, 500);
        debounced(url, params, this.settings, this.error_codes);

        // if we're terminating, go ahead and commit immediately
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

/***/ }),

/***/ "./src/Scorm2004API.js":
/*!*****************************!*\
  !*** ./src/Scorm2004API.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Scorm2004API; }
/* harmony export */ });
/* harmony import */ var _BaseAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BaseAPI */ "./src/BaseAPI.js");
/* harmony import */ var _cmi_scorm2004_cmi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cmi/scorm2004_cmi */ "./src/cmi/scorm2004_cmi.js");
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utilities */ "./src/utilities.js");
/* harmony import */ var _constants_api_constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants/api_constants */ "./src/constants/api_constants.js");
/* harmony import */ var _constants_error_codes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./constants/error_codes */ "./src/constants/error_codes.js");
/* harmony import */ var _constants_response_constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./constants/response_constants */ "./src/constants/response_constants.js");
/* harmony import */ var _constants_language_constants__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./constants/language_constants */ "./src/constants/language_constants.js");
/* harmony import */ var _constants_regex__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./constants/regex */ "./src/constants/regex.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }








var scorm2004_constants = _constants_api_constants__WEBPACK_IMPORTED_MODULE_3__["default"].scorm2004;
var global_constants = _constants_api_constants__WEBPACK_IMPORTED_MODULE_3__["default"].global;
var scorm2004_error_codes = _constants_error_codes__WEBPACK_IMPORTED_MODULE_4__["default"].scorm2004;
var correct_responses = _constants_response_constants__WEBPACK_IMPORTED_MODULE_5__["default"].correct;
var scorm2004_regex = _constants_regex__WEBPACK_IMPORTED_MODULE_7__["default"].scorm2004;

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
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _version, {
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
    _this.cmi = new _cmi_scorm2004_cmi__WEBPACK_IMPORTED_MODULE_1__.CMI();
    _this.adl = new _cmi_scorm2004_cmi__WEBPACK_IMPORTED_MODULE_1__.ADL();

    // Rename functions to match 2004 Spec and expose to modules
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
        newChild = new _cmi_scorm2004_cmi__WEBPACK_IMPORTED_MODULE_1__.CMIObjectivesObject();
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
          newChild = new _cmi_scorm2004_cmi__WEBPACK_IMPORTED_MODULE_1__.CMIInteractionsCorrectResponsesObject();
        }
      } else if (foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d+\\.objectives\\.\\d+')) {
        newChild = new _cmi_scorm2004_cmi__WEBPACK_IMPORTED_MODULE_1__.CMIInteractionsObjectivesObject();
      } else if (!foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d+')) {
        newChild = new _cmi_scorm2004_cmi__WEBPACK_IMPORTED_MODULE_1__.CMIInteractionsObject();
      } else if (this.stringMatches(CMIElement, 'cmi\\.comments_from_learner\\.\\d+')) {
        newChild = new _cmi_scorm2004_cmi__WEBPACK_IMPORTED_MODULE_1__.CMICommentsObject();
      } else if (this.stringMatches(CMIElement, 'cmi\\.comments_from_lms\\.\\d+')) {
        newChild = new _cmi_scorm2004_cmi__WEBPACK_IMPORTED_MODULE_1__.CMICommentsObject(true);
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
        if (this.lastErrorCode === 0 && (!response_type.duplicate || !this.checkDuplicatedPattern(interaction.correct_responses, pattern_index, value)) || this.lastErrorCode === 0 && value === '') {
          // do nothing, we want the inverse
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
      var detailMessage = '';

      // Set error number to string since inconsistent from modules if string or number
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
                if (_constants_language_constants__WEBPACK_IMPORTED_MODULE_6__["default"][lang.toLowerCase()] === undefined) {
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
      var flattened = _utilities__WEBPACK_IMPORTED_MODULE_2__.flatten(cmiExport);
      switch (this.settings.dataCommitFormat) {
        case 'flattened':
          return _utilities__WEBPACK_IMPORTED_MODULE_2__.flatten(cmiExport);
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
        var result = this.processHttpRequest(this.settings.lmsCommitUrl, commitObject, terminateCommit);

        // check if this is a sequencing call, and then call the necessary JS
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
}(_BaseAPI__WEBPACK_IMPORTED_MODULE_0__["default"]);


/***/ }),

/***/ "./src/cmi/common.js":
/*!***************************!*\
  !*** ./src/cmi/common.js ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BaseCMI": function() { return /* binding */ BaseCMI; },
/* harmony export */   "CMIArray": function() { return /* binding */ CMIArray; },
/* harmony export */   "CMIScore": function() { return /* binding */ CMIScore; },
/* harmony export */   "checkValidFormat": function() { return /* binding */ checkValidFormat; },
/* harmony export */   "checkValidRange": function() { return /* binding */ checkValidRange; }
/* harmony export */ });
/* harmony import */ var _constants_api_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants/api_constants */ "./src/constants/api_constants.js");
/* harmony import */ var _constants_error_codes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/error_codes */ "./src/constants/error_codes.js");
/* harmony import */ var _constants_regex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants/regex */ "./src/constants/regex.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }



var scorm12_constants = _constants_api_constants__WEBPACK_IMPORTED_MODULE_0__["default"].scorm12;
var scorm12_regex = _constants_regex__WEBPACK_IMPORTED_MODULE_2__["default"].scorm12;
var scorm12_error_codes = _constants_error_codes__WEBPACK_IMPORTED_MODULE_1__["default"].scorm12;

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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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

/***/ }),

/***/ "./src/cmi/scorm2004_cmi.js":
/*!**********************************!*\
  !*** ./src/cmi/scorm2004_cmi.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ADL": function() { return /* binding */ ADL; },
/* harmony export */   "CMI": function() { return /* binding */ CMI; },
/* harmony export */   "CMICommentsObject": function() { return /* binding */ CMICommentsObject; },
/* harmony export */   "CMIInteractionsCorrectResponsesObject": function() { return /* binding */ CMIInteractionsCorrectResponsesObject; },
/* harmony export */   "CMIInteractionsObject": function() { return /* binding */ CMIInteractionsObject; },
/* harmony export */   "CMIInteractionsObjectivesObject": function() { return /* binding */ CMIInteractionsObjectivesObject; },
/* harmony export */   "CMIObjectivesObject": function() { return /* binding */ CMIObjectivesObject; }
/* harmony export */ });
/* harmony import */ var _common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common */ "./src/cmi/common.js");
/* harmony import */ var _constants_api_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants/api_constants */ "./src/constants/api_constants.js");
/* harmony import */ var _constants_regex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants/regex */ "./src/constants/regex.js");
/* harmony import */ var _constants_error_codes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants/error_codes */ "./src/constants/error_codes.js");
/* harmony import */ var _constants_response_constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants/response_constants */ "./src/constants/response_constants.js");
/* harmony import */ var _exceptions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../exceptions */ "./src/exceptions.js");
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utilities */ "./src/utilities.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }







var scorm2004_constants = _constants_api_constants__WEBPACK_IMPORTED_MODULE_1__["default"].scorm2004;
var scorm2004_error_codes = _constants_error_codes__WEBPACK_IMPORTED_MODULE_3__["default"].scorm2004;
var learner_responses = _constants_response_constants__WEBPACK_IMPORTED_MODULE_4__["default"].learner;
var scorm2004_regex = _constants_regex__WEBPACK_IMPORTED_MODULE_2__["default"].scorm2004;

/**
 * Helper method for throwing Read Only error
 */
function throwReadOnlyError() {
  throw new _exceptions__WEBPACK_IMPORTED_MODULE_5__.Scorm2004ValidationError(scorm2004_error_codes.READ_ONLY_ELEMENT);
}

/**
 * Helper method for throwing Write Only error
 */
function throwWriteOnlyError() {
  throw new _exceptions__WEBPACK_IMPORTED_MODULE_5__.Scorm2004ValidationError(scorm2004_error_codes.WRITE_ONLY_ELEMENT);
}

/**
 * Helper method for throwing Type Mismatch error
 */
function throwTypeMismatchError() {
  throw new _exceptions__WEBPACK_IMPORTED_MODULE_5__.Scorm2004ValidationError(scorm2004_error_codes.TYPE_MISMATCH);
}

/**
 * Helper method for throwing Dependency Not Established error
 */
function throwDependencyNotEstablishedError() {
  throw new _exceptions__WEBPACK_IMPORTED_MODULE_5__.Scorm2004ValidationError(scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED);
}

/**
 * Helper method for throwing Dependency Not Established error
 */
function throwGeneralSetError() {
  throw new _exceptions__WEBPACK_IMPORTED_MODULE_5__.Scorm2004ValidationError(scorm2004_error_codes.GENERAL_SET_FAILURE);
}

/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} regexPattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */
function check2004ValidFormat(value, regexPattern, allowEmptyString) {
  return (0,_common__WEBPACK_IMPORTED_MODULE_0__.checkValidFormat)(value, regexPattern, scorm2004_error_codes.TYPE_MISMATCH, _exceptions__WEBPACK_IMPORTED_MODULE_5__.Scorm2004ValidationError, allowEmptyString);
}

/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} rangePattern
 * @return {boolean}
 */
function check2004ValidRange(value, rangePattern) {
  return (0,_common__WEBPACK_IMPORTED_MODULE_0__.checkValidRange)(value, rangePattern, scorm2004_error_codes.VALUE_OUT_OF_RANGE, _exceptions__WEBPACK_IMPORTED_MODULE_5__.Scorm2004ValidationError);
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
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _version2, {
      writable: true,
      value: '1.0'
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _children2, {
      writable: true,
      value: scorm2004_constants.cmi_children
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _completion_status, {
      writable: true,
      value: 'unknown'
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _completion_threshold, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _credit, {
      writable: true,
      value: 'credit'
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _entry, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _exit, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _launch_data, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _learner_id, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _learner_name, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _location, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _max_time_allowed, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _mode, {
      writable: true,
      value: 'normal'
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _progress_measure, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _scaled_passing_score, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _session_time, {
      writable: true,
      value: 'PT0H0M0S'
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _success_status, {
      writable: true,
      value: 'unknown'
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _suspend_data, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _time_limit_action, {
      writable: true,
      value: 'continue,no message'
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this), _total_time, {
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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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
        sessionTime = _utilities__WEBPACK_IMPORTED_MODULE_6__.getSecondsAsISODuration(seconds / 1000);
      }
      return _utilities__WEBPACK_IMPORTED_MODULE_6__.addTwoDurations(_classPrivateFieldGet(this, _total_time), sessionTime, scorm2004_regex.CMITimespan);
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
}(_common__WEBPACK_IMPORTED_MODULE_0__.BaseCMI);

/**
 * Class for SCORM 2004's cmi.learner_preference object
 */
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
    _classPrivateFieldInitSpec(_assertThisInitialized(_this2), _children3, {
      writable: true,
      value: scorm2004_constants.student_preference_children
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this2), _audio_level, {
      writable: true,
      value: '1'
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this2), _language, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this2), _delivery_speed, {
      writable: true,
      value: '1'
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this2), _audio_captioning, {
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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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
}(_common__WEBPACK_IMPORTED_MODULE_0__.BaseCMI);
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
      errorClass: _exceptions__WEBPACK_IMPORTED_MODULE_5__.Scorm2004ValidationError
    });
  }
  return _createClass(CMIInteractions);
}(_common__WEBPACK_IMPORTED_MODULE_0__.CMIArray);
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
      errorClass: _exceptions__WEBPACK_IMPORTED_MODULE_5__.Scorm2004ValidationError
    });
  }
  return _createClass(CMIObjectives);
}(_common__WEBPACK_IMPORTED_MODULE_0__.CMIArray);
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
      errorClass: _exceptions__WEBPACK_IMPORTED_MODULE_5__.Scorm2004ValidationError
    });
  }
  return _createClass(CMICommentsFromLMS);
}(_common__WEBPACK_IMPORTED_MODULE_0__.CMIArray);
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
      errorClass: _exceptions__WEBPACK_IMPORTED_MODULE_5__.Scorm2004ValidationError
    });
  }
  return _createClass(CMICommentsFromLearner);
}(_common__WEBPACK_IMPORTED_MODULE_0__.CMIArray);
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
    _classPrivateFieldInitSpec(_assertThisInitialized(_this3), _id, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this3), _type, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this3), _timestamp, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this3), _weighting, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this3), _learner_response, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this3), _result, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this3), _latency, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this3), _description, {
      writable: true,
      value: ''
    });
    _this3.objectives = new _common__WEBPACK_IMPORTED_MODULE_0__.CMIArray({
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      errorClass: _exceptions__WEBPACK_IMPORTED_MODULE_5__.Scorm2004ValidationError,
      children: scorm2004_constants.objectives_children
    });
    _this3.correct_responses = new _common__WEBPACK_IMPORTED_MODULE_0__.CMIArray({
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      errorClass: _exceptions__WEBPACK_IMPORTED_MODULE_5__.Scorm2004ValidationError,
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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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
}(_common__WEBPACK_IMPORTED_MODULE_0__.BaseCMI);

/**
 * Class for SCORM 2004's cmi.objectives.n object
 */
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
    _classPrivateFieldInitSpec(_assertThisInitialized(_this4), _id2, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this4), _success_status2, {
      writable: true,
      value: 'unknown'
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this4), _completion_status2, {
      writable: true,
      value: 'unknown'
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this4), _progress_measure2, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this4), _description2, {
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
     */,
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
     */,
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
     */,
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
     */,
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
     */,
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
}(_common__WEBPACK_IMPORTED_MODULE_0__.BaseCMI);

/**
 * Class for SCORM 2004's cmi *.score object
 */
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
      errorClass: _exceptions__WEBPACK_IMPORTED_MODULE_5__.Scorm2004ValidationError
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this5), _scaled, {
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
     */,
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
}(_common__WEBPACK_IMPORTED_MODULE_0__.CMIScore);
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
    _classPrivateFieldInitSpec(_assertThisInitialized(_this6), _comment, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this6), _location2, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this6), _timestamp2, {
      writable: true,
      value: ''
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this6), _readOnlyAfterInit, {
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
     */,
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
     */,
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
     */,
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
}(_common__WEBPACK_IMPORTED_MODULE_0__.BaseCMI);

/**
 * Class representing SCORM 2004's cmi.interactions.n.objectives.n object
 */
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
    _classPrivateFieldInitSpec(_assertThisInitialized(_this7), _id3, {
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
     */,
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
}(_common__WEBPACK_IMPORTED_MODULE_0__.BaseCMI);

/**
 * Class representing SCORM 2004's cmi.interactions.n.correct_responses.n object
 */
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
    _classPrivateFieldInitSpec(_assertThisInitialized(_this8), _pattern, {
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
     */,
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
}(_common__WEBPACK_IMPORTED_MODULE_0__.BaseCMI);

/**
 * Class representing SCORM 2004's adl object
 */
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
}(_common__WEBPACK_IMPORTED_MODULE_0__.BaseCMI);

/**
 * Class representing SCORM 2004's adl.nav object
 */
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
    _classPrivateFieldInitSpec(_assertThisInitialized(_this10), _request, {
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
     */,
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
}(_common__WEBPACK_IMPORTED_MODULE_0__.BaseCMI);
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
    _classPrivateFieldInitSpec(_assertThisInitialized(_this11), _continue, {
      writable: true,
      value: 'unknown'
    });
    _classPrivateFieldInitSpec(_assertThisInitialized(_this11), _previous, {
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
      /**
       * Check if target is valid
       * @param {*} _target
       * @return {string}
       */
      return _createClass(_class2);
    }());
    _defineProperty(_assertThisInitialized(_this11), "jump", /*#__PURE__*/function () {
      function _class4() {
        _classCallCheck(this, _class4);
        _defineProperty(this, "_isTargetValid", function (_target) {
          return 'unknown';
        });
      }
      /**
       * Check if target is valid
       * @param {*} _target
       * @return {string}
       */
      return _createClass(_class4);
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
     */,
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
     */,
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
        'continue': this.continue
      };
      delete this.jsonString;
      return result;
    }
  }]);
  return ADLNavRequestValid;
}(_common__WEBPACK_IMPORTED_MODULE_0__.BaseCMI);

/***/ }),

/***/ "./src/constants/api_constants.js":
/*!****************************************!*\
  !*** ./src/constants/api_constants.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
/* harmony default export */ __webpack_exports__["default"] = (APIConstants);

/***/ }),

/***/ "./src/constants/error_codes.js":
/*!**************************************!*\
  !*** ./src/constants/error_codes.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
/* harmony default export */ __webpack_exports__["default"] = (ErrorCodes);

/***/ }),

/***/ "./src/constants/language_constants.js":
/*!*********************************************!*\
  !*** ./src/constants/language_constants.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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
/* harmony default export */ __webpack_exports__["default"] = (ValidLanguages);

/***/ }),

/***/ "./src/constants/regex.js":
/*!********************************!*\
  !*** ./src/constants/regex.js ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
/* harmony default export */ __webpack_exports__["default"] = (Regex);

/***/ }),

/***/ "./src/constants/response_constants.js":
/*!*********************************************!*\
  !*** ./src/constants/response_constants.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _regex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./regex */ "./src/constants/regex.js");

var scorm2004_regex = _regex__WEBPACK_IMPORTED_MODULE_0__["default"].scorm2004;
var learner = {
  'true-false': {
    format: '^true$|^false$',
    max: 1,
    delimiter: '',
    unique: false
  },
  'choice': {
    format: scorm2004_regex.CMILongIdentifier,
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
    format: scorm2004_regex.CMILongIdentifier
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
/* harmony default export */ __webpack_exports__["default"] = (Responses);

/***/ }),

/***/ "./src/exceptions.js":
/*!***************************!*\
  !*** ./src/exceptions.js ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AICCValidationError": function() { return /* binding */ AICCValidationError; },
/* harmony export */   "Scorm12ValidationError": function() { return /* binding */ Scorm12ValidationError; },
/* harmony export */   "Scorm2004ValidationError": function() { return /* binding */ Scorm2004ValidationError; },
/* harmony export */   "ValidationError": function() { return /* binding */ ValidationError; }
/* harmony export */ });
/* harmony import */ var _constants_api_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants/api_constants */ "./src/constants/api_constants.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }
function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct.bind(); } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }

var scorm12_errors = _constants_api_constants__WEBPACK_IMPORTED_MODULE_0__["default"].scorm12.error_descriptions;
var aicc_errors = _constants_api_constants__WEBPACK_IMPORTED_MODULE_0__["default"].aicc.error_descriptions;
var scorm2004_errors = _constants_api_constants__WEBPACK_IMPORTED_MODULE_0__["default"].scorm2004.error_descriptions;

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
  return _createClass(Scorm12ValidationError);
}(ValidationError);

/**
 * AICC Validation Error
 */
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
  return _createClass(AICCValidationError);
}(ValidationError);

/**
 * SCORM 2004 Validation Error
 */
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
  return _createClass(Scorm2004ValidationError);
}(ValidationError);

/***/ }),

/***/ "./src/utilities.js":
/*!**************************!*\
  !*** ./src/utilities.js ***!
  \**************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SECONDS_PER_DAY": function() { return /* binding */ SECONDS_PER_DAY; },
/* harmony export */   "SECONDS_PER_HOUR": function() { return /* binding */ SECONDS_PER_HOUR; },
/* harmony export */   "SECONDS_PER_MINUTE": function() { return /* binding */ SECONDS_PER_MINUTE; },
/* harmony export */   "SECONDS_PER_SECOND": function() { return /* binding */ SECONDS_PER_SECOND; },
/* harmony export */   "addHHMMSSTimeStrings": function() { return /* binding */ addHHMMSSTimeStrings; },
/* harmony export */   "addTwoDurations": function() { return /* binding */ addTwoDurations; },
/* harmony export */   "countDecimals": function() { return /* binding */ countDecimals; },
/* harmony export */   "flatten": function() { return /* binding */ flatten; },
/* harmony export */   "getDurationAsSeconds": function() { return /* binding */ getDurationAsSeconds; },
/* harmony export */   "getSecondsAsHHMMSS": function() { return /* binding */ getSecondsAsHHMMSS; },
/* harmony export */   "getSecondsAsISODuration": function() { return /* binding */ getSecondsAsISODuration; },
/* harmony export */   "getTimeAsSeconds": function() { return /* binding */ getTimeAsSeconds; },
/* harmony export */   "unflatten": function() { return /* binding */ unflatten; }
/* harmony export */ });
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var SECONDS_PER_SECOND = 1.0;
var SECONDS_PER_MINUTE = 60;
var SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;
var SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;
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
  var minutes = dateObj.getUTCMinutes();
  // make sure we add any possible decimal value
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
    }
    // If we have anything left in the remainder, and we're currently adding
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
  result += Number(seconds) || 0.0;
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

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!**********************************!*\
  !*** ./src/exports/scorm2004.js ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Scorm2004API__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Scorm2004API */ "./src/Scorm2004API.js");

window.Scorm2004API = _Scorm2004API__WEBPACK_IMPORTED_MODULE_0__["default"];
}();
/******/ })()
;
//# sourceMappingURL=scorm2004.js.map