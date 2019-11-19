(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Scorm12API2 = _interopRequireDefault(require("./Scorm12API"));

var _aicc_cmi = require("./cmi/aicc_cmi");

var _scorm12_cmi = require("./cmi/scorm12_cmi");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * The AICC API class
 */
var AICC =
/*#__PURE__*/
function (_Scorm12API) {
  _inherits(AICC, _Scorm12API);

  /**
   * Constructor to create AICC API object
   * @param {object} settings
   */
  function AICC(settings) {
    var _this;

    _classCallCheck(this, AICC);

    var finalSettings = _objectSpread({}, {
      mastery_override: false
    }, {}, settings);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AICC).call(this, finalSettings));
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
        if (this.stringMatches(CMIElement, 'cmi\\.evaluation\\.comments\\.\\d')) {
          newChild = new _aicc_cmi.CMIEvaluationCommentsObject();
        } else if (this.stringMatches(CMIElement, 'cmi\\.student_data\\.tries\\.\\d')) {
          newChild = new _aicc_cmi.CMITriesObject();
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

},{"./Scorm12API":3,"./cmi/aicc_cmi":5,"./cmi/scorm12_cmi":7}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _common = require("./cmi/common");

var _exceptions = require("./exceptions");

var _error_codes2 = require("./constants/error_codes");

var _api_constants = require("./constants/api_constants");

var _utilities = require("./utilities");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

/**
 * Base API class for AICC, SCORM 1.2, and SCORM 2004. Should be considered
 * abstract, and never initialized on it's own.
 */
var BaseAPI =
/*#__PURE__*/
function () {
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
        autocommitSeconds: 60,
        lmsCommitUrl: false,
        dataCommitFormat: 'json',
        // valid formats are 'json' or 'flattened', 'params'
        commitRequestDataType: 'application/json;charset=UTF-8',
        autoProgress: false,
        logLevel: _api_constants.global_constants.LOG_LEVEL_ERROR
      }
    });

    _defineProperty(this, "cmi", void 0);

    _defineProperty(this, "startingData", void 0);

    if ((this instanceof BaseAPI ? this.constructor : void 0) === BaseAPI) {
      throw new TypeError('Cannot construct BaseAPI instances directly');
    }

    this.currentState = _api_constants.global_constants.STATE_NOT_INITIALIZED;
    this.lastErrorCode = 0;
    this.listenerArray = [];

    _classPrivateFieldSet(this, _timeout, null);

    _classPrivateFieldSet(this, _error_codes, error_codes);

    this.settings = settings;
    this.apiLogLevel = this.settings.logLevel;
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
      var returnValue = _api_constants.global_constants.SCORM_FALSE;

      if (this.isInitialized()) {
        this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).INITIALIZED, initializeMessage);
      } else if (this.isTerminated()) {
        this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).TERMINATED, terminationMessage);
      } else {
        this.currentState = _api_constants.global_constants.STATE_INITIALIZED;
        this.lastErrorCode = 0;
        returnValue = _api_constants.global_constants.SCORM_TRUE;
        this.processListeners(callbackName);
      }

      this.apiLog(callbackName, null, 'returned: ' + returnValue, _api_constants.global_constants.LOG_LEVEL_INFO);
      this.clearSCORMError(returnValue);
      return returnValue;
    }
    /**
     * Getter for #settings
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
      var returnValue = _api_constants.global_constants.SCORM_FALSE;

      if (this.checkState(checkTerminated, _classPrivateFieldGet(this, _error_codes).TERMINATION_BEFORE_INIT, _classPrivateFieldGet(this, _error_codes).MULTIPLE_TERMINATION)) {
        var result = this.storeData(true);

        if (result.errorCode && result.errorCode > 0) {
          this.throwSCORMError(result.errorCode);
        }

        returnValue = result.result ? result.result : _api_constants.global_constants.SCORM_FALSE;
        if (checkTerminated) this.lastErrorCode = 0;
        this.currentState = _api_constants.global_constants.STATE_TERMINATED;
        returnValue = _api_constants.global_constants.SCORM_TRUE;
        this.processListeners(callbackName);
      }

      this.apiLog(callbackName, null, 'returned: ' + returnValue, _api_constants.global_constants.LOG_LEVEL_INFO);
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

      this.apiLog(callbackName, CMIElement, ': returned: ' + returnValue, _api_constants.global_constants.LOG_LEVEL_INFO);
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
      var returnValue = _api_constants.global_constants.SCORM_FALSE;

      if (this.checkState(checkTerminated, _classPrivateFieldGet(this, _error_codes).STORE_BEFORE_INIT, _classPrivateFieldGet(this, _error_codes).STORE_AFTER_TERM)) {
        if (checkTerminated) this.lastErrorCode = 0;

        try {
          returnValue = this.setCMIValue(CMIElement, value);
        } catch (e) {
          if (e instanceof _exceptions.ValidationError) {
            this.lastErrorCode = e.errorCode;
            returnValue = _api_constants.global_constants.SCORM_FALSE;
          } else {
            this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).GENERAL);
          }
        }

        this.processListeners(callbackName, CMIElement, value);
      }

      if (returnValue === undefined) {
        returnValue = _api_constants.global_constants.SCORM_FALSE;
      } // If we didn't have any errors while setting the data, go ahead and
      // schedule a commit, if autocommit is turned on


      if (String(this.lastErrorCode) === '0') {
        if (this.settings.autocommit && !_classPrivateFieldGet(this, _timeout)) {
          this.scheduleCommit(this.settings.autocommitSeconds * 1000);
        }
      }

      this.apiLog(callbackName, CMIElement, ': ' + value + ': result: ' + returnValue, _api_constants.global_constants.LOG_LEVEL_INFO);
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
      var returnValue = _api_constants.global_constants.SCORM_FALSE;

      if (this.checkState(checkTerminated, _classPrivateFieldGet(this, _error_codes).COMMIT_BEFORE_INIT, _classPrivateFieldGet(this, _error_codes).COMMIT_AFTER_TERM)) {
        var result = this.storeData(false);

        if (result.errorCode && result.errorCode > 0) {
          this.throwSCORMError(result.errorCode);
        }

        returnValue = result.result ? result.result : _api_constants.global_constants.SCORM_FALSE;
        this.apiLog(callbackName, 'HttpRequest', ' Result: ' + returnValue, _api_constants.global_constants.LOG_LEVEL_DEBUG);
        if (checkTerminated) this.lastErrorCode = 0;
        this.processListeners(callbackName);
      }

      this.apiLog(callbackName, null, 'returned: ' + returnValue, _api_constants.global_constants.LOG_LEVEL_INFO);
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
      this.apiLog(callbackName, null, 'returned: ' + returnValue, _api_constants.global_constants.LOG_LEVEL_INFO);
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

      this.apiLog(callbackName, null, 'returned: ' + returnValue, _api_constants.global_constants.LOG_LEVEL_INFO);
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

      this.apiLog(callbackName, null, 'returned: ' + returnValue, _api_constants.global_constants.LOG_LEVEL_INFO);
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
          case _api_constants.global_constants.LOG_LEVEL_ERROR:
            console.error(logMessage);
            break;

          case _api_constants.global_constants.LOG_LEVEL_WARNING:
            console.warn(logMessage);
            break;

          case _api_constants.global_constants.LOG_LEVEL_INFO:
            console.info(logMessage);
            break;

          case _api_constants.global_constants.LOG_LEVEL_DEBUG:
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
        return _api_constants.global_constants.SCORM_FALSE;
      }

      var structure = CMIElement.split('.');
      var refObject = this;
      var returnValue = _api_constants.global_constants.SCORM_FALSE;
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
            if (this.stringMatches(CMIElement, '\\.correct_responses\\.\\d')) {
              this.validateCorrectResponse(CMIElement, value);
            }

            if (!scorm2004 || this.lastErrorCode === 0) {
              refObject[attribute] = value;
              returnValue = _api_constants.global_constants.SCORM_TRUE;
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

      if (returnValue === _api_constants.global_constants.SCORM_FALSE) {
        this.apiLog(methodName, null, "There was an error setting the value for: ".concat(CMIElement, ", value of: ").concat(value), _api_constants.global_constants.LOG_LEVEL_WARNING);
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
    value: function validateCorrectResponse(_CMIElement, _value) {} // just a stub method

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
            this.throwSCORMError(_error_codes2.scorm12_error_codes.CHILDREN_ERROR);
          } else if (attribute === '_count') {
            this.throwSCORMError(_error_codes2.scorm12_error_codes.COUNT_ERROR);
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
      return this.currentState === _api_constants.global_constants.STATE_INITIALIZED;
    }
    /**
     * Returns true if the API's current state is STATE_NOT_INITIALIZED
     *
     * @return {boolean}
     */

  }, {
    key: "isNotInitialized",
    value: function isNotInitialized() {
      return this.currentState === _api_constants.global_constants.STATE_NOT_INITIALIZED;
    }
    /**
     * Returns true if the API's current state is STATE_TERMINATED
     *
     * @return {boolean}
     */

  }, {
    key: "isTerminated",
    value: function isTerminated() {
      return this.currentState === _api_constants.global_constants.STATE_TERMINATED;
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
      for (var i = 0; i < this.listenerArray.length; i++) {
        var listener = this.listenerArray[i];
        var functionsMatch = listener.functionName === functionName;
        var listenerHasCMIElement = !!listener.CMIElement;
        var CMIElementsMatch = listener.CMIElement === CMIElement;

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

      this.apiLog('throwSCORMError', null, errorNumber + ': ' + message, _api_constants.global_constants.LOG_LEVEL_ERROR);
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
      if (success !== undefined && success !== _api_constants.global_constants.SCORM_FALSE) {
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

      CMIElement = CMIElement || 'cmi';
      this.startingData = json;

      for (var key in json) {
        if ({}.hasOwnProperty.call(json, key) && json[key]) {
          var currentCMIElement = CMIElement + '.' + key;
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
     * @return {object}
     */

  }, {
    key: "processHttpRequest",
    value: function processHttpRequest(url, params) {
      var genericError = {
        'result': _api_constants.global_constants.SCORM_FALSE,
        'errorCode': _classPrivateFieldGet(this, _error_codes).GENERAL
      };
      var httpReq = new XMLHttpRequest();
      httpReq.open('POST', url, false);

      try {
        if (params instanceof Array) {
          httpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          httpReq.send(params.join('&'));
        } else {
          httpReq.setRequestHeader('Content-Type', this.settings.commitRequestDataType);
          httpReq.send(JSON.stringify(params));
        }
      } catch (e) {
        return genericError;
      }

      try {
        return JSON.parse(httpReq.responseText);
      } catch (e) {
        return genericError;
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

      this.apiLog('scheduleCommit', null, null, _api_constants.global_constants.LOG_LEVEL_DEBUG);
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

        this.apiLog('clearScheduledCommit', null, null, _api_constants.global_constants.LOG_LEVEL_DEBUG);
      }
    }
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
      _classPrivateFieldSet(this, _settings, _objectSpread({}, _classPrivateFieldGet(this, _settings), {}, settings));
    }
  }]);

  return BaseAPI;
}();
/**
 * Private class that wraps a timeout call to the commit() function
 */


exports["default"] = BaseAPI;

var _timeout = new WeakMap();

var _error_codes = new WeakMap();

var _settings = new WeakMap();

var ScheduledCommit =
/*#__PURE__*/
function () {
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

    _classPrivateFieldSet(this, _timeout2, setTimeout(this.wrapper, when));
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

var _API = new WeakMap();

var _cancelled = new WeakMap();

var _timeout2 = new WeakMap();

},{"./cmi/common":6,"./constants/api_constants":9,"./constants/error_codes":10,"./exceptions":15,"./utilities":17}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _BaseAPI2 = _interopRequireDefault(require("./BaseAPI"));

var _scorm12_cmi = require("./cmi/scorm12_cmi");

var Utilities = _interopRequireWildcard(require("./utilities"));

var _api_constants = require("./constants/api_constants");

var _error_codes = require("./constants/error_codes");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var constants = _api_constants.scorm12_constants;
/**
 * API class for SCORM 1.2
 */

var Scorm12API =
/*#__PURE__*/
function (_BaseAPI) {
  _inherits(Scorm12API, _BaseAPI);

  /**
   * Constructor for SCORM 1.2 API
   * @param {object} settings
   */
  function Scorm12API(settings) {
    var _this;

    _classCallCheck(this, Scorm12API);

    var finalSettings = _objectSpread({}, {
      mastery_override: false
    }, {}, settings);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Scorm12API).call(this, _error_codes.scorm12_error_codes, finalSettings));
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

      if (result === _api_constants.global_constants.SCORM_TRUE) {
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

      if (this.stringMatches(CMIElement, 'cmi\\.objectives\\.\\d')) {
        newChild = new _scorm12_cmi.CMIObjectivesObject();
      } else if (foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d\\.correct_responses\\.\\d')) {
        newChild = new _scorm12_cmi.CMIInteractionsCorrectResponsesObject();
      } else if (foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d\\.objectives\\.\\d')) {
        newChild = new _scorm12_cmi.CMIInteractionsObjectivesObject();
      } else if (this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d')) {
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

      if (constants.error_descriptions[errorNumber]) {
        basicMessage = constants.error_descriptions[errorNumber].basicMessage;
        detailMessage = constants.error_descriptions[errorNumber].detailMessage;
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
        if (this.apiLogLevel === _api_constants.global_constants.LOG_LEVEL_DEBUG) {
          console.debug('Commit (terminated: ' + (terminateCommit ? 'yes' : 'no') + '): ');
          console.debug(commitObject);
        }

        return this.processHttpRequest(this.settings.lmsCommitUrl, commitObject);
      } else {
        console.log('Commit (terminated: ' + (terminateCommit ? 'yes' : 'no') + '): ');
        console.log(commitObject);
        return _api_constants.global_constants.SCORM_TRUE;
      }
    }
  }]);

  return Scorm12API;
}(_BaseAPI2["default"]);

exports["default"] = Scorm12API;

},{"./BaseAPI":2,"./cmi/scorm12_cmi":7,"./constants/api_constants":9,"./constants/error_codes":10,"./utilities":17}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _BaseAPI2 = _interopRequireDefault(require("./BaseAPI"));

var _scorm2004_cmi = require("./cmi/scorm2004_cmi");

var Utilities = _interopRequireWildcard(require("./utilities"));

var _api_constants = require("./constants/api_constants");

var _error_codes = require("./constants/error_codes");

var _response_constants = require("./constants/response_constants");

var _language_constants = require("./constants/language_constants");

var _regex = require("./constants/regex");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var constants = _api_constants.scorm2004_constants;
/**
 * API class for SCORM 2004
 */

var Scorm2004API =
/*#__PURE__*/
function (_BaseAPI) {
  _inherits(Scorm2004API, _BaseAPI);

  /**
   * Constructor for SCORM 2004 API
   * @param {object} settings
   */
  function Scorm2004API(settings) {
    var _this;

    _classCallCheck(this, Scorm2004API);

    var finalSettings = _objectSpread({}, {
      mastery_override: false
    }, {}, settings);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Scorm2004API).call(this, _error_codes.scorm2004_error_codes, finalSettings));

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

      if (result === _api_constants.global_constants.SCORM_TRUE) {
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

      if (this.stringMatches(CMIElement, 'cmi\\.objectives\\.\\d')) {
        newChild = new _scorm2004_cmi.CMIObjectivesObject();
      } else if (foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d\\.correct_responses\\.\\d')) {
        var parts = CMIElement.split('.');
        var index = Number(parts[2]);
        var interaction = this.cmi.interactions.childArray[index];

        if (typeof interaction.type === 'undefined') {
          this.throwSCORMError(_error_codes.scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED);
        } else {
          var interaction_type = interaction.type;
          var interaction_count = interaction.correct_responses._count;

          if (interaction_type === 'choice') {
            for (var i = 0; i < interaction_count && this.lastErrorCode === 0; i++) {
              var response = interaction.correct_responses.childArray[i];

              if (response.pattern === value) {
                this.throwSCORMError(_error_codes.scorm2004_error_codes.GENERAL_SET_FAILURE);
              }
            }
          }

          var response_type = _response_constants.correct_responses[interaction_type];
          var nodes = [];

          if (response_type.delimiter !== '') {
            nodes = String(value).split(response_type.delimiter);
          } else {
            nodes[0] = value;
          }

          if (nodes.length > 0 && nodes.length <= response_type.max) {
            this.checkCorrectResponseValue(interaction_type, nodes, value);
          } else if (nodes.length > response_type.max) {
            this.throwSCORMError(_error_codes.scorm2004_error_codes.GENERAL_SET_FAILURE, 'Data Model Element Pattern Too Long');
          }
        }

        if (this.lastErrorCode === 0) {
          newChild = new _scorm2004_cmi.CMIInteractionsCorrectResponsesObject();
        }
      } else if (foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d\\.objectives\\.\\d')) {
        newChild = new _scorm2004_cmi.CMIInteractionsObjectivesObject();
      } else if (this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d')) {
        newChild = new _scorm2004_cmi.CMIInteractionsObject();
      } else if (this.stringMatches(CMIElement, 'cmi\\.comments_from_learner\\.\\d')) {
        newChild = new _scorm2004_cmi.CMICommentsObject();
      } else if (this.stringMatches(CMIElement, 'cmi\\.comments_from_lms\\.\\d')) {
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
            this.throwSCORMError(_error_codes.scorm2004_error_codes.GENERAL_SET_FAILURE);
          }
        }
      }

      var response_type = _api_constants.scorm2004_constants.correct_responses[interaction_type];

      if (typeof response_type.limit !== 'undefined' || interaction_count < response_type.limit) {
        var nodes = [];

        if (response_type.delimiter !== '') {
          nodes = String(value).split(response_type.delimiter);
        } else {
          nodes[0] = value;
        }

        if (nodes.length > 0 && nodes.length <= response_type.max) {
          this.checkCorrectResponseValue(interaction_type, nodes, value);
        } else if (nodes.length > response_type.max) {
          this.throwSCORMError(_error_codes.scorm2004_error_codes.GENERAL_SET_FAILURE, 'Data Model Element Pattern Too Long');
        }

        if (this.lastErrorCode === 0 && (!response_type.duplicate || !this.checkDuplicatedPattern(interaction.correct_responses, pattern_index, value)) || this.lastErrorCode === 0 && value === '') {// do nothing, we want the inverse
        } else {
          if (this.lastErrorCode === 0) {
            this.throwSCORMError(_error_codes.scorm2004_error_codes.GENERAL_SET_FAILURE, 'Data Model Element Pattern Already Exists');
          }
        }
      } else {
        this.throwSCORMError(_error_codes.scorm2004_error_codes.GENERAL_SET_FAILURE, 'Data Model Element Collection Limit Reached');
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

      if (constants.error_descriptions[errorNumber]) {
        basicMessage = constants.error_descriptions[errorNumber].basicMessage;
        detailMessage = constants.error_descriptions[errorNumber].detailMessage;
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
      var response = _response_constants.correct_responses[interaction_type];
      var formatRegex = new RegExp(response.format);

      for (var i = 0; i < nodes.length && this.lastErrorCode === 0; i++) {
        if (interaction_type.match('^(fill-in|long-fill-in|matching|performance|sequencing)$')) {
          nodes[i] = this.removeCorrectResponsePrefixes(nodes[i]);
        }

        if (response.delimiter2 !== undefined) {
          var values = nodes[i].split(response.delimiter2);

          if (values.length === 2) {
            var matches = values[0].match(formatRegex);

            if (!matches) {
              this.throwSCORMError(_error_codes.scorm2004_error_codes.TYPE_MISMATCH);
            } else {
              if (!values[1].match(new RegExp(response.format2))) {
                this.throwSCORMError(_error_codes.scorm2004_error_codes.TYPE_MISMATCH);
              }
            }
          } else {
            this.throwSCORMError(_error_codes.scorm2004_error_codes.TYPE_MISMATCH);
          }
        } else {
          var _matches = nodes[i].match(formatRegex);

          if (!_matches && value !== '' || !_matches && interaction_type === 'true-false') {
            this.throwSCORMError(_error_codes.scorm2004_error_codes.TYPE_MISMATCH);
          } else {
            if (interaction_type === 'numeric' && nodes.length > 1) {
              if (Number(nodes[0]) > Number(nodes[1])) {
                this.throwSCORMError(_error_codes.scorm2004_error_codes.TYPE_MISMATCH);
              }
            } else {
              if (nodes[i] !== '' && response.unique) {
                for (var j = 0; j < i && this.lastErrorCode === 0; j++) {
                  if (nodes[i] === nodes[j]) {
                    this.throwSCORMError(_error_codes.scorm2004_error_codes.TYPE_MISMATCH);
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
            langMatches = node.match(_regex.scorm2004_regex.CMILangcr);

            if (langMatches) {
              var lang = langMatches[3];

              if (lang !== undefined && lang.length > 0) {
                if (_language_constants.valid_languages[lang.toLowerCase()] === undefined) {
                  this.throwSCORMError(_error_codes.scorm2004_error_codes.TYPE_MISMATCH);
                }
              }
            }

            seenLang = true;
            break;

          case 'case_matters':
            if (!seenLang && !seenOrder && !seenCase) {
              if (matches[3] !== 'true' && matches[3] !== 'false') {
                this.throwSCORMError(_error_codes.scorm2004_error_codes.TYPE_MISMATCH);
              }
            }

            seenCase = true;
            break;

          case 'order_matters':
            if (!seenCase && !seenLang && !seenOrder) {
              if (matches[3] !== 'true' && matches[3] !== 'false') {
                this.throwSCORMError(_error_codes.scorm2004_error_codes.TYPE_MISMATCH);
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
                this.cmi.completion_status = 'completed';
              } else {
                this.cmi.completion_status = 'incomplete';
              }
            }

            if (this.cmi.scaled_passing_score !== null && this.cmi.score.scaled !== '') {
              if (this.cmi.score.scaled >= this.cmi.scaled_passing_score) {
                this.cmi.success_status = 'passed';
              } else {
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
        if (this.apiLogLevel === _api_constants.global_constants.LOG_LEVEL_DEBUG) {
          console.debug('Commit (terminated: ' + (terminateCommit ? 'yes' : 'no') + '): ');
          console.debug(commitObject);
        }

        var result = this.processHttpRequest(this.settings.lmsCommitUrl, commitObject); // check if this is a sequencing call, and then call the necessary JS

        if (navRequest && result.navRequest !== undefined && result.navRequest !== '') {
          Function("\"use strict\";(() => { ".concat(result.navRequest, " })()"))();
        }

        return result;
      } else {
        console.log('Commit (terminated: ' + (terminateCommit ? 'yes' : 'no') + '): ');
        console.log(commitObject);
        return _api_constants.global_constants.SCORM_TRUE;
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

var _version = new WeakMap();

},{"./BaseAPI":2,"./cmi/scorm2004_cmi":8,"./constants/api_constants":9,"./constants/error_codes":10,"./constants/language_constants":12,"./constants/regex":13,"./constants/response_constants":14,"./utilities":17}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CMIEvaluationCommentsObject = exports.CMITriesObject = exports.CMITries = exports.CMI = void 0;

var Scorm12CMI = _interopRequireWildcard(require("./scorm12_cmi"));

var _common = require("./common");

var _api_constants = require("../constants/api_constants");

var _regex = require("../constants/regex");

var _error_codes = require("../constants/error_codes");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var constants = _api_constants.aicc_constants;
var regex = _regex.aicc_regex;
/**
 * CMI Class for AICC
 */

var CMI =
/*#__PURE__*/
function (_Scorm12CMI$CMI) {
  _inherits(CMI, _Scorm12CMI$CMI);

  /**
   * Constructor for AICC CMI object
   * @param {boolean} initialized
   */
  function CMI(initialized) {
    var _this;

    _classCallCheck(this, CMI);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CMI).call(this, constants.cmi_children));
    if (initialized) _this.initialize();
    _this.student_data = new AICCCMIStudentData();
    _this.evaluation = new CMIEvaluation();
    return _this;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMI, [{
    key: "initialize",
    value: function initialize() {
      var _this$student_data, _this$evaluation;

      _get(_getPrototypeOf(CMI.prototype), "initialize", this).call(this);

      (_this$student_data = this.student_data) === null || _this$student_data === void 0 ? void 0 : _this$student_data.initialize();
      (_this$evaluation = this.evaluation) === null || _this$evaluation === void 0 ? void 0 : _this$evaluation.initialize();
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
        'interactions': this.interactions,
        'evaluation': this.evaluation
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

var CMIEvaluation =
/*#__PURE__*/
function (_BaseCMI) {
  _inherits(CMIEvaluation, _BaseCMI);

  /**
   * Constructor for AICC Evaluation object
   */
  function CMIEvaluation() {
    var _this2;

    _classCallCheck(this, CMIEvaluation);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(CMIEvaluation).call(this));
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


var CMIEvaluationComments =
/*#__PURE__*/
function (_CMIArray) {
  _inherits(CMIEvaluationComments, _CMIArray);

  /**
   * Constructor for AICC Evaluation Comments object
   */
  function CMIEvaluationComments() {
    _classCallCheck(this, CMIEvaluationComments);

    return _possibleConstructorReturn(this, _getPrototypeOf(CMIEvaluationComments).call(this, constants.comments_children, _error_codes.scorm12_error_codes.INVALID_SET_VALUE));
  }

  return CMIEvaluationComments;
}(_common.CMIArray);
/**
 * StudentData class for AICC
 */


var AICCCMIStudentData =
/*#__PURE__*/
function (_Scorm12CMI$CMIStuden) {
  _inherits(AICCCMIStudentData, _Scorm12CMI$CMIStuden);

  /**
   * Constructor for AICC StudentData object
   */
  function AICCCMIStudentData() {
    var _this3;

    _classCallCheck(this, AICCCMIStudentData);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(AICCCMIStudentData).call(this, constants.student_data_children));

    _tries_during_lesson.set(_assertThisInitialized(_this3), {
      writable: true,
      value: ''
    });

    _this3.tries = new CMITries();
    return _this3;
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
 * Class representing the AICC cmi.student_data.tries object
 */


var _tries_during_lesson = new WeakMap();

var CMITries =
/*#__PURE__*/
function (_CMIArray2) {
  _inherits(CMITries, _CMIArray2);

  /**
   * Constructor for inline Tries Array class
   */
  function CMITries() {
    _classCallCheck(this, CMITries);

    return _possibleConstructorReturn(this, _getPrototypeOf(CMITries).call(this, _api_constants.aicc_constants.tries_children));
  }

  return CMITries;
}(_common.CMIArray);
/**
 * Class for AICC Tries
 */


exports.CMITries = CMITries;

var CMITriesObject =
/*#__PURE__*/
function (_BaseCMI2) {
  _inherits(CMITriesObject, _BaseCMI2);

  /**
   * Constructor for AICC Tries object
   */
  function CMITriesObject() {
    var _this4;

    _classCallCheck(this, CMITriesObject);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(CMITriesObject).call(this));

    _status.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _time.set(_assertThisInitialized(_this4), {
      writable: true,
      value: ''
    });

    _this4.score = new _common.CMIScore({
      score_children: constants.score_children,
      score_range: regex.score_range,
      invalidErrorCode: _error_codes.scorm12_error_codes.INVALID_SET_VALUE,
      invalidTypeCode: _error_codes.scorm12_error_codes.TYPE_MISMATCH,
      invalidRangeCode: _error_codes.scorm12_error_codes.VALUE_OUT_OF_RANGE
    });
    return _this4;
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
      return _classPrivateFieldGet(this, _status);
    }
    /**
     * Setter for #status
     * @param {string} status
     */
    ,
    set: function set(status) {
      if ((0, Scorm12CMI.check12ValidFormat)(status, regex.CMIStatus2)) {
        _classPrivateFieldSet(this, _status, status);
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
      if ((0, Scorm12CMI.check12ValidFormat)(time, regex.CMITime)) {
        _classPrivateFieldSet(this, _time, time);
      }
    }
  }]);

  return CMITriesObject;
}(_common.BaseCMI);
/**
 * Class for AICC Evaluation Comments
 */


exports.CMITriesObject = CMITriesObject;

var _status = new WeakMap();

var _time = new WeakMap();

var CMIEvaluationCommentsObject =
/*#__PURE__*/
function (_BaseCMI3) {
  _inherits(CMIEvaluationCommentsObject, _BaseCMI3);

  /**
   * Constructor for Evaluation Comments
   */
  function CMIEvaluationCommentsObject() {
    var _this5;

    _classCallCheck(this, CMIEvaluationCommentsObject);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(CMIEvaluationCommentsObject).call(this));

    _content.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _location.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    _time2.set(_assertThisInitialized(_this5), {
      writable: true,
      value: ''
    });

    return _this5;
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
      if ((0, Scorm12CMI.check12ValidFormat)(content, regex.CMIString256)) {
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
      if ((0, Scorm12CMI.check12ValidFormat)(location, regex.CMIString256)) {
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
      return _classPrivateFieldGet(this, _time2);
    }
    /**
     * Setting for #time
     * @param {string} time
     */
    ,
    set: function set(time) {
      if ((0, Scorm12CMI.check12ValidFormat)(time, regex.CMITime)) {
        _classPrivateFieldSet(this, _time2, time);
      }
    }
  }]);

  return CMIEvaluationCommentsObject;
}(_common.BaseCMI);

exports.CMIEvaluationCommentsObject = CMIEvaluationCommentsObject;

var _content = new WeakMap();

var _location = new WeakMap();

var _time2 = new WeakMap();

},{"../constants/api_constants":9,"../constants/error_codes":10,"../constants/regex":13,"./common":6,"./scorm12_cmi":7}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkValidFormat = checkValidFormat;
exports.checkValidRange = checkValidRange;
exports.CMIArray = exports.CMIScore = exports.BaseCMI = void 0;

var _api_constants = require("../constants/api_constants");

var _error_codes = require("../constants/error_codes");

var _exceptions = require("../exceptions");

var _regex = require("../constants/regex");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

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


var BaseCMI =
/*#__PURE__*/
function () {
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
  }, {
    key: "initialized",
    get: function get() {
      return _classPrivateFieldGet(this, _initialized);
    }
  }]);

  return BaseCMI;
}();
/**
 * Base class for cmi *.score objects
 */


exports.BaseCMI = BaseCMI;

var _initialized = new WeakMap();

var CMIScore =
/*#__PURE__*/
function (_BaseCMI) {
  _inherits(CMIScore, _BaseCMI);

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

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CMIScore).call(this));

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

    _classPrivateFieldSet(_assertThisInitialized(_this), _children2, score_children || _api_constants.scorm12_constants.score_children);

    _classPrivateFieldSet(_assertThisInitialized(_this), _score_range, !score_range ? false : _regex.scorm12_regex.score_range);

    _classPrivateFieldSet(_assertThisInitialized(_this), _max, max || max === '' ? max : '100');

    _classPrivateFieldSet(_assertThisInitialized(_this), _invalid_error_code, invalidErrorCode || _error_codes.scorm12_error_codes.INVALID_SET_VALUE);

    _classPrivateFieldSet(_assertThisInitialized(_this), _invalid_type_code, invalidTypeCode || _error_codes.scorm12_error_codes.TYPE_MISMATCH);

    _classPrivateFieldSet(_assertThisInitialized(_this), _invalid_range_code, invalidRangeCode || _error_codes.scorm12_error_codes.VALUE_OUT_OF_RANGE);

    _classPrivateFieldSet(_assertThisInitialized(_this), _decimal_regex, decimalRegex || _regex.scorm12_regex.CMIDecimal);

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

var _children2 = new WeakMap();

var _score_range = new WeakMap();

var _invalid_error_code = new WeakMap();

var _invalid_type_code = new WeakMap();

var _invalid_range_code = new WeakMap();

var _decimal_regex = new WeakMap();

var _raw = new WeakMap();

var _min = new WeakMap();

var _max = new WeakMap();

var CMIArray =
/*#__PURE__*/
function (_BaseCMI2) {
  _inherits(CMIArray, _BaseCMI2);

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

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(CMIArray).call(this));

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

var _errorCode = new WeakMap();

var _children3 = new WeakMap();

},{"../constants/api_constants":9,"../constants/error_codes":10,"../constants/regex":13,"../exceptions":15}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throwReadOnlyError = throwReadOnlyError;
exports.throwWriteOnlyError = throwWriteOnlyError;
exports.check12ValidFormat = check12ValidFormat;
exports.check12ValidRange = check12ValidRange;
exports.NAV = exports.CMIInteractionsCorrectResponsesObject = exports.CMIInteractionsObjectivesObject = exports.CMIObjectivesObject = exports.CMIInteractionsObject = exports.CMIStudentData = exports.CMI = void 0;

var _common = require("./common");

var _api_constants = require("../constants/api_constants");

var _error_codes = require("../constants/error_codes");

var _regex = require("../constants/regex");

var _exceptions = require("../exceptions");

var Utilities = _interopRequireWildcard(require("../utilities"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

var constants = _api_constants.scorm12_constants;
var regex = _regex.scorm12_regex;
/**
 * Helper method for throwing Read Only error
 */

function throwReadOnlyError() {
  throw new _exceptions.ValidationError(_error_codes.scorm12_error_codes.READ_ONLY_ELEMENT);
}
/**
 * Helper method for throwing Write Only error
 */


function throwWriteOnlyError() {
  throw new _exceptions.ValidationError(_error_codes.scorm12_error_codes.WRITE_ONLY_ELEMENT);
}
/**
 * Helper method for throwing Invalid Set error
 */


function throwInvalidValueError() {
  throw new _exceptions.ValidationError(_error_codes.scorm12_error_codes.INVALID_SET_VALUE);
}
/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} regexPattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */


function check12ValidFormat(value, regexPattern, allowEmptyString) {
  return (0, _common.checkValidFormat)(value, regexPattern, _error_codes.scorm12_error_codes.TYPE_MISMATCH, allowEmptyString);
}
/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} rangePattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */


function check12ValidRange(value, rangePattern, allowEmptyString) {
  return (0, _common.checkValidRange)(value, rangePattern, _error_codes.scorm12_error_codes.VALUE_OUT_OF_RANGE, allowEmptyString);
}
/**
 * Class representing the cmi object for SCORM 1.2
 */


var CMI =
/*#__PURE__*/
function (_BaseCMI) {
  _inherits(CMI, _BaseCMI);

  /**
   * Constructor for the SCORM 1.2 cmi object
   * @param {string} cmi_children
   * @param {(CMIStudentData|AICCCMIStudentData)} student_data
   * @param {boolean} initialized
   */
  function CMI(cmi_children, student_data, initialized) {
    var _this;

    _classCallCheck(this, CMI);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CMI).call(this));

    _children2.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
    });

    _version2.set(_assertThisInitialized(_this), {
      writable: true,
      value: '3.4'
    });

    _suspend_data.set(_assertThisInitialized(_this), {
      writable: true,
      value: ''
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

    _classPrivateFieldSet(_assertThisInitialized(_this), _children2, cmi_children ? cmi_children : constants.cmi_children);

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
      return this.core.getCurrentTotalTime();
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
      return _classPrivateFieldGet(this, _suspend_data);
    }
    /**
     * Setter for #suspend_data
     * @param {string} suspend_data
     */
    ,
    set: function set(suspend_data) {
      if (check12ValidFormat(suspend_data, regex.CMIString4096)) {
        _classPrivateFieldSet(this, _suspend_data, suspend_data);
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
      if (check12ValidFormat(comments, regex.CMIString4096)) {
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

var _children2 = new WeakMap();

var _version2 = new WeakMap();

var _suspend_data = new WeakMap();

var _launch_data = new WeakMap();

var _comments = new WeakMap();

var _comments_from_lms = new WeakMap();

var CMICore =
/*#__PURE__*/
function (_BaseCMI2) {
  _inherits(CMICore, _BaseCMI2);

  /**
   * Constructor for cmi.core
   */
  function CMICore() {
    var _this2;

    _classCallCheck(this, CMICore);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(CMICore).call(this));

    _children3.set(_assertThisInitialized(_this2), {
      writable: true,
      value: constants.core_children
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

    _this2.score = new _common.CMIScore({
      score_children: constants.score_children,
      score_range: regex.score_range,
      invalidErrorCode: _error_codes.scorm12_error_codes.INVALID_SET_VALUE,
      invalidTypeCode: _error_codes.scorm12_error_codes.TYPE_MISMATCH,
      invalidRangeCode: _error_codes.scorm12_error_codes.VALUE_OUT_OF_RANGE
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
     *
     * @return {string}
     */
    value: function getCurrentTotalTime() {
      return Utilities.addHHMMSSTimeStrings(_classPrivateFieldGet(this, _total_time), _classPrivateFieldGet(this, _session_time), new RegExp(_regex.scorm12_regex.CMITimespan));
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
     *      total_time: string,
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
        'total_time': this.total_time,
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
      if (check12ValidFormat(lesson_location, regex.CMIString256)) {
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
      if (check12ValidFormat(lesson_status, regex.CMIStatus)) {
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
      if (check12ValidFormat(exit, regex.CMIExit)) {
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
      if (check12ValidFormat(session_time, regex.CMITimespan)) {
        _classPrivateFieldSet(this, _session_time, session_time);
      }
    }
  }]);

  return CMICore;
}(_common.BaseCMI);
/**
 * Class representing SCORM 1.2's cmi.objectives object
 * @extends CMIArray
 */


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

var CMIObjectives =
/*#__PURE__*/
function (_CMIArray) {
  _inherits(CMIObjectives, _CMIArray);

  /**
   * Constructor for cmi.objectives
   */
  function CMIObjectives() {
    _classCallCheck(this, CMIObjectives);

    return _possibleConstructorReturn(this, _getPrototypeOf(CMIObjectives).call(this, {
      children: constants.objectives_children,
      errorCode: _error_codes.scorm12_error_codes.INVALID_SET_VALUE
    }));
  }

  return CMIObjectives;
}(_common.CMIArray);
/**
 * Class representing SCORM 1.2's cmi.student_data object
 * @extends BaseCMI
 */


var CMIStudentData =
/*#__PURE__*/
function (_BaseCMI3) {
  _inherits(CMIStudentData, _BaseCMI3);

  /**
   * Constructor for cmi.student_data
   * @param {string} student_data_children
   */
  function CMIStudentData(student_data_children) {
    var _this3;

    _classCallCheck(this, CMIStudentData);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(CMIStudentData).call(this));

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

    _classPrivateFieldSet(_assertThisInitialized(_this3), _children4, student_data_children ? student_data_children : constants.student_data_children);

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

var _children4 = new WeakMap();

var _mastery_score = new WeakMap();

var _max_time_allowed = new WeakMap();

var _time_limit_action = new WeakMap();

var CMIStudentPreference =
/*#__PURE__*/
function (_BaseCMI4) {
  _inherits(CMIStudentPreference, _BaseCMI4);

  /**
   * Constructor for cmi.student_preference
   */
  function CMIStudentPreference() {
    var _this4;

    _classCallCheck(this, CMIStudentPreference);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(CMIStudentPreference).call(this));

    _children5.set(_assertThisInitialized(_this4), {
      writable: true,
      value: constants.student_preference_children
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
      if (check12ValidFormat(audio, regex.CMISInteger) && check12ValidRange(audio, regex.audio_range)) {
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
      if (check12ValidFormat(language, regex.CMIString256)) {
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
      if (check12ValidFormat(speed, regex.CMISInteger) && check12ValidRange(speed, regex.speed_range)) {
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
      if (check12ValidFormat(text, regex.CMISInteger) && check12ValidRange(text, regex.text_range)) {
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


var _children5 = new WeakMap();

var _audio = new WeakMap();

var _language = new WeakMap();

var _speed = new WeakMap();

var _text = new WeakMap();

var CMIInteractions =
/*#__PURE__*/
function (_CMIArray2) {
  _inherits(CMIInteractions, _CMIArray2);

  /**
   * Constructor for cmi.interactions
   */
  function CMIInteractions() {
    _classCallCheck(this, CMIInteractions);

    return _possibleConstructorReturn(this, _getPrototypeOf(CMIInteractions).call(this, {
      children: constants.interactions_children,
      errorCode: _error_codes.scorm12_error_codes.INVALID_SET_VALUE
    }));
  }

  return CMIInteractions;
}(_common.CMIArray);
/**
 * Class representing SCORM 1.2's cmi.interactions.n object
 * @extends BaseCMI
 */


var CMIInteractionsObject =
/*#__PURE__*/
function (_BaseCMI5) {
  _inherits(CMIInteractionsObject, _BaseCMI5);

  /**
   * Constructor for cmi.interactions.n object
   */
  function CMIInteractionsObject() {
    var _this5;

    _classCallCheck(this, CMIInteractionsObject);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(CMIInteractionsObject).call(this));

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
      errorCode: _error_codes.scorm12_error_codes.INVALID_SET_VALUE,
      children: constants.objectives_children
    });
    _this5.correct_responses = new _common.CMIArray({
      errorCode: _error_codes.scorm12_error_codes.INVALID_SET_VALUE,
      children: constants.correct_responses_children
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
      if (check12ValidFormat(id, regex.CMIIdentifier)) {
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
      if (check12ValidFormat(time, regex.CMITime)) {
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
      if (check12ValidFormat(type, regex.CMIType)) {
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
      if (check12ValidFormat(weighting, regex.CMIDecimal) && check12ValidRange(weighting, regex.weighting_range)) {
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
      if (check12ValidFormat(student_response, regex.CMIFeedback, true)) {
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
      if (check12ValidFormat(result, regex.CMIResult)) {
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
      if (check12ValidFormat(latency, regex.CMITimespan)) {
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

var _id = new WeakMap();

var _time = new WeakMap();

var _type = new WeakMap();

var _weighting = new WeakMap();

var _student_response = new WeakMap();

var _result = new WeakMap();

var _latency = new WeakMap();

var CMIObjectivesObject =
/*#__PURE__*/
function (_BaseCMI6) {
  _inherits(CMIObjectivesObject, _BaseCMI6);

  /**
   * Constructor for cmi.objectives.n
   */
  function CMIObjectivesObject() {
    var _this6;

    _classCallCheck(this, CMIObjectivesObject);

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(CMIObjectivesObject).call(this));

    _id2.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _status.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    _this6.score = new _common.CMIScore({
      score_children: constants.score_children,
      score_range: regex.score_range,
      invalidErrorCode: _error_codes.scorm12_error_codes.INVALID_SET_VALUE,
      invalidTypeCode: _error_codes.scorm12_error_codes.TYPE_MISMATCH,
      invalidRangeCode: _error_codes.scorm12_error_codes.VALUE_OUT_OF_RANGE
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
      if (check12ValidFormat(id, regex.CMIIdentifier)) {
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
      if (check12ValidFormat(status, regex.CMIStatus2)) {
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

var _id2 = new WeakMap();

var _status = new WeakMap();

var CMIInteractionsObjectivesObject =
/*#__PURE__*/
function (_BaseCMI7) {
  _inherits(CMIInteractionsObjectivesObject, _BaseCMI7);

  /**
   * Constructor for cmi.interactions.n.objectives.n
   */
  function CMIInteractionsObjectivesObject() {
    var _this7;

    _classCallCheck(this, CMIInteractionsObjectivesObject);

    _this7 = _possibleConstructorReturn(this, _getPrototypeOf(CMIInteractionsObjectivesObject).call(this));

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
      if (check12ValidFormat(id, regex.CMIIdentifier)) {
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

var _id3 = new WeakMap();

var CMIInteractionsCorrectResponsesObject =
/*#__PURE__*/
function (_BaseCMI8) {
  _inherits(CMIInteractionsCorrectResponsesObject, _BaseCMI8);

  /**
   * Constructor for cmi.interactions.correct_responses.n
   */
  function CMIInteractionsCorrectResponsesObject() {
    var _this8;

    _classCallCheck(this, CMIInteractionsCorrectResponsesObject);

    _this8 = _possibleConstructorReturn(this, _getPrototypeOf(CMIInteractionsCorrectResponsesObject).call(this));

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
      if (check12ValidFormat(pattern, regex.CMIFeedback, true)) {
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

var _pattern = new WeakMap();

var NAV =
/*#__PURE__*/
function (_BaseCMI9) {
  _inherits(NAV, _BaseCMI9);

  /**
   * Constructor for NAV object
   */
  function NAV() {
    var _this9;

    _classCallCheck(this, NAV);

    _this9 = _possibleConstructorReturn(this, _getPrototypeOf(NAV).call(this));

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
      return !this.jsonString ? throwWriteOnlyError() : _classPrivateFieldGet(this, _event);
    }
    /**
     * Setter for #event
     * @param {string} event
     */
    ,
    set: function set(event) {
      if (check12ValidFormat(event, regex.NAVEvent)) {
        _classPrivateFieldSet(this, _event, event);
      }
    }
  }]);

  return NAV;
}(_common.BaseCMI);

exports.NAV = NAV;

var _event = new WeakMap();

},{"../constants/api_constants":9,"../constants/error_codes":10,"../constants/regex":13,"../exceptions":15,"../utilities":17,"./common":6}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ADL = exports.CMIInteractionsCorrectResponsesObject = exports.CMIInteractionsObjectivesObject = exports.CMICommentsObject = exports.CMIObjectivesObject = exports.CMIInteractionsObject = exports.CMI = void 0;

var _common = require("./common");

var _api_constants = require("../constants/api_constants");

var _regex = require("../constants/regex");

var _error_codes = require("../constants/error_codes");

var _response_constants = require("../constants/response_constants");

var _exceptions = require("../exceptions");

var Util = _interopRequireWildcard(require("../utilities"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

var constants = _api_constants.scorm2004_constants;
var regex = _regex.scorm2004_regex;
/**
 * Helper method for throwing Read Only error
 */

function throwReadOnlyError() {
  throw new _exceptions.ValidationError(_error_codes.scorm2004_error_codes.READ_ONLY_ELEMENT);
}
/**
 * Helper method for throwing Write Only error
 */


function throwWriteOnlyError() {
  throw new _exceptions.ValidationError(_error_codes.scorm2004_error_codes.WRITE_ONLY_ELEMENT);
}
/**
 * Helper method for throwing Type Mismatch error
 */


function throwTypeMismatchError() {
  throw new _exceptions.ValidationError(_error_codes.scorm2004_error_codes.TYPE_MISMATCH);
}
/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} regexPattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */


function check2004ValidFormat(value, regexPattern, allowEmptyString) {
  return (0, _common.checkValidFormat)(value, regexPattern, _error_codes.scorm2004_error_codes.TYPE_MISMATCH, allowEmptyString);
}
/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} rangePattern
 * @return {boolean}
 */


function check2004ValidRange(value, rangePattern) {
  return (0, _common.checkValidRange)(value, rangePattern, _error_codes.scorm2004_error_codes.VALUE_OUT_OF_RANGE);
}
/**
 * Class representing cmi object for SCORM 2004
 */


var CMI =
/*#__PURE__*/
function (_BaseCMI) {
  _inherits(CMI, _BaseCMI);

  /**
   * Constructor for the SCORM 2004 cmi object
   * @param {boolean} initialized
   */
  function CMI(initialized) {
    var _this;

    _classCallCheck(this, CMI);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CMI).call(this));

    _version2.set(_assertThisInitialized(_this), {
      writable: true,
      value: '1.0'
    });

    _children2.set(_assertThisInitialized(_this), {
      writable: true,
      value: constants.cmi_children
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
      value: '0'
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
      return Util.addTwoDurations(_classPrivateFieldGet(this, _total_time), _classPrivateFieldGet(this, _session_time), _regex.scorm2004_regex.CMITimespan);
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
     *      time_limit_action: string,
     *      total_time: string
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
        'time_limit_action': this.time_limit_action,
        'total_time': this.total_time
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
      if (check2004ValidFormat(completion_status, regex.CMICStatus)) {
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
      if (check2004ValidFormat(exit, regex.CMIExit)) {
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
      if (check2004ValidFormat(location, regex.CMIString1000)) {
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
      if (check2004ValidFormat(progress_measure, regex.CMIDecimal) && check2004ValidRange(progress_measure, regex.progress_range)) {
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
      if (check2004ValidFormat(session_time, regex.CMITimespan)) {
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
      if (check2004ValidFormat(success_status, regex.CMISStatus)) {
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
      if (check2004ValidFormat(suspend_data, regex.CMIString64000, true)) {
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

var CMILearnerPreference =
/*#__PURE__*/
function (_BaseCMI2) {
  _inherits(CMILearnerPreference, _BaseCMI2);

  /**
   * Constructor for cmi.learner_preference
   */
  function CMILearnerPreference() {
    var _this2;

    _classCallCheck(this, CMILearnerPreference);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(CMILearnerPreference).call(this));

    _children3.set(_assertThisInitialized(_this2), {
      writable: true,
      value: constants.student_preference_children
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
      if (check2004ValidFormat(audio_level, regex.CMIDecimal) && check2004ValidRange(audio_level, regex.audio_range)) {
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
      if (check2004ValidFormat(language, regex.CMILang)) {
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
      if (check2004ValidFormat(delivery_speed, regex.CMIDecimal) && check2004ValidRange(delivery_speed, regex.speed_range)) {
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
      if (check2004ValidFormat(audio_captioning, regex.CMISInteger) && check2004ValidRange(audio_captioning, regex.text_range)) {
        _classPrivateFieldSet(this, _audio_captioning, audio_captioning);
      }
    }
  }]);

  return CMILearnerPreference;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's cmi.interactions object
 */


var _children3 = new WeakMap();

var _audio_level = new WeakMap();

var _language = new WeakMap();

var _delivery_speed = new WeakMap();

var _audio_captioning = new WeakMap();

var CMIInteractions =
/*#__PURE__*/
function (_CMIArray) {
  _inherits(CMIInteractions, _CMIArray);

  /**
   * Constructor for cmi.objectives Array
   */
  function CMIInteractions() {
    _classCallCheck(this, CMIInteractions);

    return _possibleConstructorReturn(this, _getPrototypeOf(CMIInteractions).call(this, {
      children: constants.interactions_children,
      errorCode: _error_codes.scorm2004_error_codes.READ_ONLY_ELEMENT
    }));
  }

  return CMIInteractions;
}(_common.CMIArray);
/**
 * Class representing SCORM 2004's cmi.objectives object
 */


var CMIObjectives =
/*#__PURE__*/
function (_CMIArray2) {
  _inherits(CMIObjectives, _CMIArray2);

  /**
   * Constructor for cmi.objectives Array
   */
  function CMIObjectives() {
    _classCallCheck(this, CMIObjectives);

    return _possibleConstructorReturn(this, _getPrototypeOf(CMIObjectives).call(this, {
      children: constants.objectives_children,
      errorCode: _error_codes.scorm2004_error_codes.READ_ONLY_ELEMENT
    }));
  }

  return CMIObjectives;
}(_common.CMIArray);
/**
 * Class representing SCORM 2004's cmi.comments_from_lms object
 */


var CMICommentsFromLMS =
/*#__PURE__*/
function (_CMIArray3) {
  _inherits(CMICommentsFromLMS, _CMIArray3);

  /**
   * Constructor for cmi.comments_from_lms Array
   */
  function CMICommentsFromLMS() {
    _classCallCheck(this, CMICommentsFromLMS);

    return _possibleConstructorReturn(this, _getPrototypeOf(CMICommentsFromLMS).call(this, {
      children: constants.comments_children,
      errorCode: _error_codes.scorm2004_error_codes.READ_ONLY_ELEMENT
    }));
  }

  return CMICommentsFromLMS;
}(_common.CMIArray);
/**
 * Class representing SCORM 2004's cmi.comments_from_learner object
 */


var CMICommentsFromLearner =
/*#__PURE__*/
function (_CMIArray4) {
  _inherits(CMICommentsFromLearner, _CMIArray4);

  /**
   * Constructor for cmi.comments_from_learner Array
   */
  function CMICommentsFromLearner() {
    _classCallCheck(this, CMICommentsFromLearner);

    return _possibleConstructorReturn(this, _getPrototypeOf(CMICommentsFromLearner).call(this, {
      children: constants.comments_children,
      errorCode: _error_codes.scorm2004_error_codes.READ_ONLY_ELEMENT
    }));
  }

  return CMICommentsFromLearner;
}(_common.CMIArray);
/**
 * Class for SCORM 2004's cmi.interaction.n object
 */


var CMIInteractionsObject =
/*#__PURE__*/
function (_BaseCMI3) {
  _inherits(CMIInteractionsObject, _BaseCMI3);

  /**
   * Constructor for cmi.interaction.n
   */
  function CMIInteractionsObject() {
    var _this3;

    _classCallCheck(this, CMIInteractionsObject);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(CMIInteractionsObject).call(this));

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
      errorCode: _error_codes.scorm2004_error_codes.READ_ONLY_ELEMENT,
      children: constants.objectives_children
    });
    _this3.correct_responses = new _common.CMIArray({
      errorCode: _error_codes.scorm2004_error_codes.READ_ONLY_ELEMENT,
      children: constants.correct_responses_children
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
      if (check2004ValidFormat(id, regex.CMILongIdentifier)) {
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
      if (check2004ValidFormat(type, regex.CMIType)) {
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
      if (check2004ValidFormat(timestamp, regex.CMITime)) {
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
      if (check2004ValidFormat(weighting, regex.CMIDecimal)) {
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
        throw new _exceptions.ValidationError(_error_codes.scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED);
      } else {
        var nodes = [];
        var response_type = _response_constants.learner_responses[this.type];

        if (response_type.delimiter !== '') {
          nodes = learner_response.split(response_type.delimiter);
        } else {
          nodes[0] = learner_response;
        }

        if (nodes.length > 0 && nodes.length <= response_type.max) {
          var formatRegex = new RegExp(response_type.format);

          for (var i = 0; i < nodes.length; i++) {
            if (typeof response_type.delimiter2 !== 'undefined') {
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
          throw new _exceptions.ValidationError(_error_codes.scorm2004_error_codes.GENERAL_SET_FAILURE);
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
      if (check2004ValidFormat(result, regex.CMIResult)) {
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
      if (check2004ValidFormat(latency, regex.CMITimespan)) {
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
      if (check2004ValidFormat(description, regex.CMILangString250, true)) {
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

var _id = new WeakMap();

var _type = new WeakMap();

var _timestamp = new WeakMap();

var _weighting = new WeakMap();

var _learner_response = new WeakMap();

var _result = new WeakMap();

var _latency = new WeakMap();

var _description = new WeakMap();

var CMIObjectivesObject =
/*#__PURE__*/
function (_BaseCMI4) {
  _inherits(CMIObjectivesObject, _BaseCMI4);

  /**
   * Constructor for cmi.objectives.n
   */
  function CMIObjectivesObject() {
    var _this4;

    _classCallCheck(this, CMIObjectivesObject);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(CMIObjectivesObject).call(this));

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
      if (check2004ValidFormat(id, regex.CMILongIdentifier)) {
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
      if (check2004ValidFormat(success_status, regex.CMISStatus)) {
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
      if (check2004ValidFormat(completion_status, regex.CMICStatus)) {
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
      if (check2004ValidFormat(progress_measure, regex.CMIDecimal) && check2004ValidRange(progress_measure, regex.progress_range)) {
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
      if (check2004ValidFormat(description, regex.CMILangString250, true)) {
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

var _id2 = new WeakMap();

var _success_status2 = new WeakMap();

var _completion_status2 = new WeakMap();

var _progress_measure2 = new WeakMap();

var _description2 = new WeakMap();

var Scorm2004CMIScore =
/*#__PURE__*/
function (_CMIScore) {
  _inherits(Scorm2004CMIScore, _CMIScore);

  /**
   * Constructor for cmi *.score
   */
  function Scorm2004CMIScore() {
    var _this5;

    _classCallCheck(this, Scorm2004CMIScore);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(Scorm2004CMIScore).call(this, {
      score_children: constants.score_children,
      max: '',
      invalidErrorCode: _error_codes.scorm2004_error_codes.READ_ONLY_ELEMENT,
      invalidTypeCode: _error_codes.scorm2004_error_codes.TYPE_MISMATCH,
      invalidRangeCode: _error_codes.scorm2004_error_codes.VALUE_OUT_OF_RANGE,
      decimalRegex: _regex.scorm2004_regex.CMIDecimal
    }));

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
      if (check2004ValidFormat(scaled, regex.CMIDecimal) && check2004ValidRange(scaled, regex.scaled_range)) {
        _classPrivateFieldSet(this, _scaled, scaled);
      }
    }
  }]);

  return Scorm2004CMIScore;
}(_common.CMIScore);
/**
 * Class representing SCORM 2004's cmi.comments_from_learner.n and cmi.comments_from_lms.n object
 */


var _scaled = new WeakMap();

var CMICommentsObject =
/*#__PURE__*/
function (_BaseCMI5) {
  _inherits(CMICommentsObject, _BaseCMI5);

  /**
   * Constructor for cmi.comments_from_learner.n and cmi.comments_from_lms.n
   * @param {boolean} readOnlyAfterInit
   */
  function CMICommentsObject() {
    var _this6;

    var readOnlyAfterInit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    _classCallCheck(this, CMICommentsObject);

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(CMICommentsObject).call(this));

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
        if (check2004ValidFormat(comment, regex.CMILangString4000, true)) {
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
        if (check2004ValidFormat(location, regex.CMIString250)) {
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
        if (check2004ValidFormat(timestamp, regex.CMITime)) {
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

var _comment = new WeakMap();

var _location2 = new WeakMap();

var _timestamp2 = new WeakMap();

var _readOnlyAfterInit = new WeakMap();

var CMIInteractionsObjectivesObject =
/*#__PURE__*/
function (_BaseCMI6) {
  _inherits(CMIInteractionsObjectivesObject, _BaseCMI6);

  /**
   * Constructor for cmi.interactions.n.objectives.n
   */
  function CMIInteractionsObjectivesObject() {
    var _this7;

    _classCallCheck(this, CMIInteractionsObjectivesObject);

    _this7 = _possibleConstructorReturn(this, _getPrototypeOf(CMIInteractionsObjectivesObject).call(this));

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
      if (check2004ValidFormat(id, regex.CMILongIdentifier)) {
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

var _id3 = new WeakMap();

var CMIInteractionsCorrectResponsesObject =
/*#__PURE__*/
function (_BaseCMI7) {
  _inherits(CMIInteractionsCorrectResponsesObject, _BaseCMI7);

  /**
   * Constructor for cmi.interactions.n.correct_responses.n
   */
  function CMIInteractionsCorrectResponsesObject() {
    var _this8;

    _classCallCheck(this, CMIInteractionsCorrectResponsesObject);

    _this8 = _possibleConstructorReturn(this, _getPrototypeOf(CMIInteractionsCorrectResponsesObject).call(this));

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
      if (check2004ValidFormat(pattern, regex.CMIFeedback)) {
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

var _pattern = new WeakMap();

var ADL =
/*#__PURE__*/
function (_BaseCMI8) {
  _inherits(ADL, _BaseCMI8);

  /**
   * Constructor for adl
   */
  function ADL() {
    var _this9;

    _classCallCheck(this, ADL);

    _this9 = _possibleConstructorReturn(this, _getPrototypeOf(ADL).call(this));
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

var ADLNav =
/*#__PURE__*/
function (_BaseCMI9) {
  _inherits(ADLNav, _BaseCMI9);

  /**
   * Constructor for adl.nav
   */
  function ADLNav() {
    var _this10;

    _classCallCheck(this, ADLNav);

    _this10 = _possibleConstructorReturn(this, _getPrototypeOf(ADLNav).call(this));

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
      if (check2004ValidFormat(request, regex.NAVEvent)) {
        _classPrivateFieldSet(this, _request, request);
      }
    }
  }]);

  return ADLNav;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's adl.nav.request_valid object
 */


var _request = new WeakMap();

var ADLNavRequestValid =
/*#__PURE__*/
function (_BaseCMI10) {
  _inherits(ADLNavRequestValid, _BaseCMI10);

  /**
   * Constructor for adl.nav.request_valid
   */
  function ADLNavRequestValid() {
    var _temp, _temp2;

    var _this11;

    _classCallCheck(this, ADLNavRequestValid);

    _this11 = _possibleConstructorReturn(this, _getPrototypeOf(ADLNavRequestValid).call(this));

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

var _continue = new WeakMap();

var _previous = new WeakMap();

},{"../constants/api_constants":9,"../constants/error_codes":10,"../constants/regex":13,"../constants/response_constants":14,"../exceptions":15,"../utilities":17,"./common":6}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scorm2004_constants = exports.aicc_constants = exports.scorm12_constants = exports.global_constants = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var global_constants = {
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
exports.global_constants = global_constants;
var scorm12_constants = {
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
exports.scorm12_constants = scorm12_constants;

var aicc_constants = _objectSpread({}, scorm12_constants, {}, {
  cmi_children: 'core,suspend_data,launch_data,comments,objectives,student_data,student_preference,interactions,evaluation',
  student_data_children: 'attempt_number,tries,mastery_score,max_time_allowed,time_limit_action',
  tries_children: 'time,status,score'
});

exports.aicc_constants = aicc_constants;
var scorm2004_constants = {
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
exports.scorm2004_constants = scorm2004_constants;

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scorm2004_error_codes = exports.scorm12_error_codes = exports.error_codes = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var error_codes = {
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
exports.error_codes = error_codes;

var scorm12_error_codes = _objectSpread({}, error_codes, {}, {
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

exports.scorm12_error_codes = scorm12_error_codes;

var scorm2004_error_codes = _objectSpread({}, error_codes, {}, {
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

exports.scorm2004_error_codes = scorm2004_error_codes;

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scorm2004_values = exports.scorm12_values = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var common_values = {
  validResult: ['correct', 'wrong', 'unanticipated', 'neutral'],
  invalidResult: ['-10000', '10000', 'invalid'],
  valid0To1Range: ['0.0', '0.25', '0.5', '1.0'],
  invalid0To1Range: ['-1', '-0.1', '1.1', '.25'],
  valid0To100Range: ['1', '50', '100'],
  invalid0To100Range: ['invalid', 'a100', '-1'],
  validScaledRange: ['1', '0.5', '0', '-0.5', '-1'],
  invalidScaledRange: ['-101', '25.1', '50.5', '75', '100'],
  validIntegerScaledRange: ['1', '0', '-1'],
  invalidIntegerScaledRange: ['-101', '-0.5', '0.5', '25.1', '50.5', '75', '100']
};

var scorm12_values = _objectSpread({}, common_values, {}, {
  validLessonStatus: ['passed', 'completed', 'failed', 'incomplete', 'browsed'],
  invalidLessonStatus: ['Passed', 'P', 'F', 'p', 'true', 'false', 'complete'],
  validExit: ['time-out', 'suspend', 'logout'],
  invalidExit: ['close', 'exit', 'crash'],
  validType: ['true-false', 'choice', 'fill-in', 'matching', 'performance', 'sequencing', 'likert', 'numeric'],
  invalidType: ['correct', 'wrong', 'logout'],
  validSpeedRange: ['1', '50', '100', '-1', '-50', '-100'],
  invalidSpeedRange: ['invalid', 'a100', '-101', '101', '-100000', '100000'],
  validScoreRange: ['1', '50.25', '100'],
  invalidScoreRange: ['invalid', 'a100', '-1', '101', '-100000', '100000'],
  invalid0To100Range: ['invalid', 'a100', '-2'],
  validTime: ['10:06:57', '23:59:59', '00:00:00'],
  invalidTime: ['47:59:59', '00:00:01.56', '06:5:13', '23:59:59.123', 'P1DT23H59M59S'],
  validTimespan: ['10:06:57', '00:00:01.56', '23:59:59', '47:59:59'],
  invalidTimespan: ['06:5:13', '23:59:59.123', 'P1DT23H59M59S']
});

exports.scorm12_values = scorm12_values;

var scorm2004_values = _objectSpread({}, common_values, {}, {
  // valid field values
  validTimestamps: ['2019-06-25', '2019-06-25T23:59', '2019-06-25T23:59:59.99', '1970-01-01'],
  invalidTimestamps: ['2019-06-25T', '2019-06-25T23:59:59.999', '2019-06-25T25:59:59.99', '2019-13-31', '1969-12-31', '-00:00:30', '0:50:30', '23:00:30.'],
  validCStatus: ['completed', 'incomplete', 'not attempted', 'unknown'],
  invalidCStatus: ['complete', 'passed', 'failed'],
  validSStatus: ['passed', 'failed', 'unknown'],
  invalidSStatus: ['complete', 'incomplete', 'P', 'f'],
  validExit: ['time-out', 'suspend', 'logout', 'normal'],
  invalidExit: ['close', 'exit', 'crash'],
  validType: ['true-false', 'choice', 'fill-in', 'long-fill-in', 'matching', 'performance', 'sequencing', 'likert', 'numeric', 'other'],
  invalidType: ['correct', 'wrong', 'logout'],
  validScoreRange: ['1', '50', '100', '-10000', '-1', '10000'],
  invalidScoreRange: ['invalid', 'a100', '-100000', '100000'],
  validISO8601Durations: ['P1Y34DT23H45M15S', 'PT1M45S', 'P0S', 'PT75M'],
  invalidISO8601Durations: ['00:08:45', '-P1H', '1y45D', '0'],
  validComment: ['{lang=en-98} learner comment', '{lang=eng-98-9} learner comment', '{lang=eng-98-9fhgj}' + 'x'.repeat(4000), 'learner comment', 'learner comment}', '{lang=i-xx}', '{lang=i}', ''],
  invalidComment: ['{lang=i-}', '{lang=i-x}', '{lang=eng-98-9fhgj}{ learner comment', '{learner comment', '{lang=eng-98-9fhgj}' + 'x'.repeat(4001), '{lang=eng-98-9fhgj}{' + 'x'.repeat(3999)],
  validDescription: ['{lang=en-98} learner comment', '{lang=eng-98-9} learner comment', '{lang=eng-98-9fhgj}' + 'x'.repeat(250), 'learner comment', 'learner comment}', '{lang=i-xx}', '{lang=i}', ''],
  invalidDescription: ['{lang=i-}', '{lang=i-x}', '{lang=eng-98-9fhgj}{ learner comment', '{learner comment', '{lang=eng-98-9fhgj}' + 'x'.repeat(251), '{lang=eng-98-9fhgj}{' + 'x'.repeat(249)],
  validNavRequest: ['previous', 'continue', 'exit', 'exitAll', 'abandon', 'abandonAll', 'suspendAll'],
  invalidNavRequest: ['close', 'quit', 'next', 'before']
});

exports.scorm2004_values = scorm2004_values;

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.valid_languages = void 0;
var valid_languages = {
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
exports.valid_languages = valid_languages;

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scorm2004_regex = exports.aicc_regex = exports.scorm12_regex = void 0;

var _field_values = require("./field_values");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var scorm12_regex = {
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
  CMIStatus: '^(' + _field_values.scorm12_values.validLessonStatus.join('|') + ')$',
  CMIStatus2: '^(' + _field_values.scorm12_values.validLessonStatus.join('|') + '|not attempted)$',
  CMIExit: '^(' + _field_values.scorm12_values.validExit.join('|') + '|)$',
  CMIType: '^(' + _field_values.scorm12_values.validType.join('|') + ')$',
  CMIResult: '^(' + _field_values.scorm12_values.validResult.join('|') + '|([0-9]{0,3})?(\\.[0-9]*)?)$',
  // eslint-disable-line
  NAVEvent: '^(previous|continue)$',
  // Data ranges
  score_range: '0#100',
  audio_range: '-1#100',
  speed_range: '-100#100',
  weighting_range: '-100#100',
  text_range: '-1#1'
};
exports.scorm12_regex = scorm12_regex;

var aicc_regex = _objectSpread({}, scorm12_regex, {}, {
  CMIIdentifier: '^\\w{1,255}$'
});

exports.aicc_regex = aicc_regex;
var scorm2004_regex = {
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
  CMIShortIdentifier: '^[\\w\.]{1,250}$',
  // eslint-disable-line
  CMILongIdentifier: '^(?:(?!urn:)\\S{1,4000}|urn:[A-Za-z0-9-]{1,31}:\\S{1,4000})$',
  CMIFeedback: '^.*$',
  // This must be redefined
  CMIIndex: '[._](\\d+).',
  CMIIndexStore: '.N(\\d+).',
  // Vocabulary Data Type Definition
  CMICStatus: '^(' + _field_values.scorm2004_values.validCStatus.join('|') + ')$',
  CMISStatus: '^(' + _field_values.scorm2004_values.validSStatus.join('|') + ')$',
  CMIExit: '^(' + _field_values.scorm2004_values.validExit.join('|') + ')$',
  CMIType: '^(' + _field_values.scorm2004_values.validType.join('|') + ')$',
  CMIResult: '^(' + _field_values.scorm2004_values.validResult.join('|') + '|-?([0-9]{1,4})(\\.[0-9]{1,18})?)$',
  NAVEvent: '^(' + _field_values.scorm2004_values.validNavRequest.join('|') + '|\{target=\\S{0,200}[a-zA-Z0-9]\}choice|jump)$',
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
exports.scorm2004_regex = scorm2004_regex;

},{"./field_values":11}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.correct_responses = exports.learner_responses = void 0;

var _regex = require("./regex");

var learner_responses = {
  'true-false': {
    format: '^true$|^false$',
    max: 1,
    delimiter: '',
    unique: false
  },
  'choice': {
    format: _regex.scorm2004_regex.CMIShortIdentifier,
    max: 36,
    delimiter: '[,]',
    unique: true
  },
  'fill-in': {
    format: _regex.scorm2004_regex.CMILangString250,
    max: 10,
    delimiter: '[,]',
    unique: false
  },
  'long-fill-in': {
    format: _regex.scorm2004_regex.CMILangString4000,
    max: 1,
    delimiter: '',
    unique: false
  },
  'matching': {
    format: _regex.scorm2004_regex.CMIShortIdentifier,
    format2: _regex.scorm2004_regex.CMIShortIdentifier,
    max: 36,
    delimiter: '[,]',
    delimiter2: '[.]',
    unique: false
  },
  'performance': {
    format: '^$|' + _regex.scorm2004_regex.CMIShortIdentifier,
    format2: _regex.scorm2004_regex.CMIDecimal + '|^$|' + _regex.scorm2004_regex.CMIShortIdentifier,
    max: 250,
    delimiter: '[,]',
    delimiter2: '[.]',
    unique: false
  },
  'sequencing': {
    format: _regex.scorm2004_regex.CMIShortIdentifier,
    max: 36,
    delimiter: '[,]',
    unique: false
  },
  'likert': {
    format: _regex.scorm2004_regex.CMIShortIdentifier,
    max: 1,
    delimiter: '',
    unique: false
  },
  'numeric': {
    format: _regex.scorm2004_regex.CMIDecimal,
    max: 1,
    delimiter: '',
    unique: false
  },
  'other': {
    format: _regex.scorm2004_regex.CMIString4000,
    max: 1,
    delimiter: '',
    unique: false
  }
};
exports.learner_responses = learner_responses;
var correct_responses = {
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
    format: _regex.scorm2004_regex.CMIShortIdentifier
  },
  'fill-in': {
    max: 10,
    delimiter: '[,]',
    unique: false,
    duplicate: false,
    format: _regex.scorm2004_regex.CMILangString250cr
  },
  'long-fill-in': {
    max: 1,
    delimiter: '',
    unique: false,
    duplicate: true,
    format: _regex.scorm2004_regex.CMILangString4000
  },
  'matching': {
    max: 36,
    delimiter: '[,]',
    delimiter2: '[.]',
    unique: false,
    duplicate: false,
    format: _regex.scorm2004_regex.CMIShortIdentifier,
    format2: _regex.scorm2004_regex.CMIShortIdentifier
  },
  'performance': {
    max: 250,
    delimiter: '[,]',
    delimiter2: '[.]',
    unique: false,
    duplicate: false,
    format: '^$|' + _regex.scorm2004_regex.CMIShortIdentifier,
    format2: _regex.scorm2004_regex.CMIDecimal + '|^$|' + _regex.scorm2004_regex.CMIShortIdentifier
  },
  'sequencing': {
    max: 36,
    delimiter: '[,]',
    unique: false,
    duplicate: false,
    format: _regex.scorm2004_regex.CMIShortIdentifier
  },
  'likert': {
    max: 1,
    delimiter: '',
    unique: false,
    duplicate: false,
    format: _regex.scorm2004_regex.CMIShortIdentifier,
    limit: 1
  },
  'numeric': {
    max: 2,
    delimiter: '[:]',
    unique: false,
    duplicate: false,
    format: _regex.scorm2004_regex.CMIDecimal,
    limit: 1
  },
  'other': {
    max: 1,
    delimiter: '',
    unique: false,
    duplicate: false,
    format: _regex.scorm2004_regex.CMIString4000,
    limit: 1
  }
};
exports.correct_responses = correct_responses;

},{"./regex":13}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ValidationError = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

/**
 * Data Validation Exception
 */
var ValidationError =
/*#__PURE__*/
function (_Error) {
  _inherits(ValidationError, _Error);

  /**
   * Constructor to take in an error message and code
   * @param {number} errorCode
   */
  function ValidationError(errorCode) {
    var _this;

    _classCallCheck(this, ValidationError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ValidationError).call(this, errorCode));

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
}(_wrapNativeSuper(Error));

exports.ValidationError = ValidationError;

var _errorCode = new WeakMap();

},{}],16:[function(require,module,exports){
"use strict";

var _Scorm2004API = _interopRequireDefault(require("./Scorm2004API"));

var _Scorm12API = _interopRequireDefault(require("./Scorm12API"));

var _AICC = _interopRequireDefault(require("./AICC"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

window.Scorm12API = _Scorm12API["default"];
window.Scorm2004API = _Scorm2004API["default"];
window.AICC = _AICC["default"];

},{"./AICC":1,"./Scorm12API":3,"./Scorm2004API":4}],17:[function(require,module,exports){
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
exports.SECONDS_PER_DAY = exports.SECONDS_PER_HOUR = exports.SECONDS_PER_MINUTE = exports.SECONDS_PER_SECOND = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

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

  var seconds = dateObj.getSeconds() + totalSeconds % 1.0;
  return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
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
    remainder = remainder % current_seconds; // If we have anything left in the remainder, and we're currently adding
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

  var now = new Date();
  var anchor = new Date(now);
  anchor.setFullYear(anchor.getFullYear() + Number(years || 0));
  anchor.setMonth(anchor.getMonth() + Number(months || 0));
  anchor.setDate(anchor.getDate() + Number(days || 0));
  anchor.setHours(anchor.getHours() + Number(hours || 0));
  anchor.setMinutes(anchor.getMinutes() + Number(minutes || 0));
  anchor.setSeconds(anchor.getSeconds() + Number(seconds || 0));

  if (seconds && String(seconds).indexOf('.') > 0) {
    var milliseconds = Number(Number(seconds) % 1).toFixed(6) * 1000.0;
    anchor.setMilliseconds(anchor.getMilliseconds() + milliseconds);
  }

  return (anchor * 1.0 - now) / 1000.0;
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
  var firstSeconds = getDurationAsSeconds(first, durationRegex);
  var secondSeconds = getDurationAsSeconds(second, durationRegex);
  return getSecondsAsISODuration(firstSeconds + secondSeconds);
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
  var firstSeconds = getTimeAsSeconds(first, timeRegex);
  var secondSeconds = getTimeAsSeconds(second, timeRegex);
  return getSecondsAsHHMMSS(firstSeconds + secondSeconds);
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

},{}]},{},[1,2,5,6,7,8,9,10,11,12,13,14,15,16,3,4,17])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQUlDQy5qcyIsInNyYy9CYXNlQVBJLmpzIiwic3JjL1Njb3JtMTJBUEkuanMiLCJzcmMvU2Nvcm0yMDA0QVBJLmpzIiwic3JjL2NtaS9haWNjX2NtaS5qcyIsInNyYy9jbWkvY29tbW9uLmpzIiwic3JjL2NtaS9zY29ybTEyX2NtaS5qcyIsInNyYy9jbWkvc2Nvcm0yMDA0X2NtaS5qcyIsInNyYy9jb25zdGFudHMvYXBpX2NvbnN0YW50cy5qcyIsInNyYy9jb25zdGFudHMvZXJyb3JfY29kZXMuanMiLCJzcmMvY29uc3RhbnRzL2ZpZWxkX3ZhbHVlcy5qcyIsInNyYy9jb25zdGFudHMvbGFuZ3VhZ2VfY29uc3RhbnRzLmpzIiwic3JjL2NvbnN0YW50cy9yZWdleC5qcyIsInNyYy9jb25zdGFudHMvcmVzcG9uc2VfY29uc3RhbnRzLmpzIiwic3JjL2V4Y2VwdGlvbnMuanMiLCJzcmMvZXhwb3J0cy5qcyIsInNyYy91dGlsaXRpZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FDQ0E7O0FBQ0E7O0FBS0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7OztJQUdxQixJOzs7OztBQUNuQjs7OztBQUlBLGdCQUFZLFFBQVosRUFBMEI7QUFBQTs7QUFBQTs7QUFDeEIsUUFBTSxhQUFhLHFCQUNkO0FBQ0QsTUFBQSxnQkFBZ0IsRUFBRTtBQURqQixLQURjLE1BR1gsUUFIVyxDQUFuQjs7QUFNQSw4RUFBTSxhQUFOO0FBRUEsVUFBSyxHQUFMLEdBQVcsSUFBSSxhQUFKLEVBQVg7QUFDQSxVQUFLLEdBQUwsR0FBVyxJQUFJLGdCQUFKLEVBQVg7QUFWd0I7QUFXekI7QUFFRDs7Ozs7Ozs7Ozs7O29DQVFnQixVLEVBQVksSyxFQUFPLGUsRUFBaUI7QUFDbEQsVUFBSSxRQUFRLDZFQUF5QixVQUF6QixFQUFxQyxLQUFyQyxFQUE0QyxlQUE1QyxD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QTdCLENBQUosRUFBcUM7QUFDbkMsVUFBSSxHQUFHLEdBQUcsTUFBVjtBQUNBLFVBQUksSUFBSSxHQUFHLEVBQVg7QUFDQSxVQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBTixDQUFXLENBQVgsQ0FBUjs7QUFDQSxhQUFPLENBQVAsRUFBVTtBQUNSLFFBQUEsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFELENBQUgsS0FBYyxHQUFHLENBQUMsSUFBRCxDQUFILEdBQWEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPLEVBQVAsR0FBWSxFQUF2QyxDQUFOO0FBQ0EsUUFBQSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUQsQ0FBRCxJQUFRLENBQUMsQ0FBQyxDQUFELENBQWhCO0FBQ0EsUUFBQSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQU4sQ0FBVyxDQUFYLENBQUo7QUFDRDs7QUFDRCxNQUFBLEdBQUcsQ0FBQyxJQUFELENBQUgsR0FBWSxJQUFJLENBQUMsQ0FBRCxDQUFoQjtBQUNEO0FBQ0Y7O0FBQ0QsU0FBTyxNQUFNLENBQUMsRUFBRCxDQUFOLElBQWMsTUFBckI7QUFDRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8vIEBmbG93XG5pbXBvcnQgU2Nvcm0xMkFQSSBmcm9tICcuL1Njb3JtMTJBUEknO1xuaW1wb3J0IHtcbiAgQ01JLFxuICBDTUlFdmFsdWF0aW9uQ29tbWVudHNPYmplY3QsXG4gIENNSVRyaWVzT2JqZWN0LFxufSBmcm9tICcuL2NtaS9haWNjX2NtaSc7XG5pbXBvcnQge05BVn0gZnJvbSAnLi9jbWkvc2Nvcm0xMl9jbWknO1xuXG4vKipcbiAqIFRoZSBBSUNDIEFQSSBjbGFzc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBSUNDIGV4dGVuZHMgU2Nvcm0xMkFQSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciB0byBjcmVhdGUgQUlDQyBBUEkgb2JqZWN0XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M6IHt9KSB7XG4gICAgY29uc3QgZmluYWxTZXR0aW5ncyA9IHtcbiAgICAgIC4uLntcbiAgICAgICAgbWFzdGVyeV9vdmVycmlkZTogZmFsc2UsXG4gICAgICB9LCAuLi5zZXR0aW5ncyxcbiAgICB9O1xuXG4gICAgc3VwZXIoZmluYWxTZXR0aW5ncyk7XG5cbiAgICB0aGlzLmNtaSA9IG5ldyBDTUkoKTtcbiAgICB0aGlzLm5hdiA9IG5ldyBOQVYoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIG9yIGJ1aWxkcyBhIG5ldyBjaGlsZCBlbGVtZW50IHRvIGFkZCB0byB0aGUgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvdW5kRmlyc3RJbmRleFxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICBnZXRDaGlsZEVsZW1lbnQoQ01JRWxlbWVudCwgdmFsdWUsIGZvdW5kRmlyc3RJbmRleCkge1xuICAgIGxldCBuZXdDaGlsZCA9IHN1cGVyLmdldENoaWxkRWxlbWVudChDTUlFbGVtZW50LCB2YWx1ZSwgZm91bmRGaXJzdEluZGV4KTtcblxuICAgIGlmICghbmV3Q2hpbGQpIHtcbiAgICAgIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ2NtaVxcXFwuZXZhbHVhdGlvblxcXFwuY29tbWVudHNcXFxcLlxcXFxkJykpIHtcbiAgICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JRXZhbHVhdGlvbkNvbW1lbnRzT2JqZWN0KCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LCAnY21pXFxcXC5zdHVkZW50X2RhdGFcXFxcLnRyaWVzXFxcXC5cXFxcZCcpKSB7XG4gICAgICAgIG5ld0NoaWxkID0gbmV3IENNSVRyaWVzT2JqZWN0KCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0NoaWxkO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgdGhlIHdob2xlIEFQSSB3aXRoIGFub3RoZXJcbiAgICpcbiAgICogQHBhcmFtIHtBSUNDfSBuZXdBUElcbiAgICovXG4gIHJlcGxhY2VXaXRoQW5vdGhlclNjb3JtQVBJKG5ld0FQSSkge1xuICAgIC8vIERhdGEgTW9kZWxcbiAgICB0aGlzLmNtaSA9IG5ld0FQSS5jbWk7XG4gICAgdGhpcy5uYXYgPSBuZXdBUEkubmF2O1xuICB9XG59XG4iLCIvLyBAZmxvd1xuaW1wb3J0IHtDTUlBcnJheX0gZnJvbSAnLi9jbWkvY29tbW9uJztcbmltcG9ydCB7VmFsaWRhdGlvbkVycm9yfSBmcm9tICcuL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtzY29ybTEyX2Vycm9yX2NvZGVzfSBmcm9tICcuL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQge2dsb2JhbF9jb25zdGFudHN9IGZyb20gJy4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuaW1wb3J0IHt1bmZsYXR0ZW59IGZyb20gJy4vdXRpbGl0aWVzJztcblxuLyoqXG4gKiBCYXNlIEFQSSBjbGFzcyBmb3IgQUlDQywgU0NPUk0gMS4yLCBhbmQgU0NPUk0gMjAwNC4gU2hvdWxkIGJlIGNvbnNpZGVyZWRcbiAqIGFic3RyYWN0LCBhbmQgbmV2ZXIgaW5pdGlhbGl6ZWQgb24gaXQncyBvd24uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhc2VBUEkge1xuICAjdGltZW91dDtcbiAgI2Vycm9yX2NvZGVzO1xuICAjc2V0dGluZ3MgPSB7XG4gICAgYXV0b2NvbW1pdDogZmFsc2UsXG4gICAgYXV0b2NvbW1pdFNlY29uZHM6IDYwLFxuICAgIGxtc0NvbW1pdFVybDogZmFsc2UsXG4gICAgZGF0YUNvbW1pdEZvcm1hdDogJ2pzb24nLCAvLyB2YWxpZCBmb3JtYXRzIGFyZSAnanNvbicgb3IgJ2ZsYXR0ZW5lZCcsICdwYXJhbXMnXG4gICAgY29tbWl0UmVxdWVzdERhdGFUeXBlOiAnYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PVVURi04JyxcbiAgICBhdXRvUHJvZ3Jlc3M6IGZhbHNlLFxuICAgIGxvZ0xldmVsOiBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9FUlJPUixcbiAgfTtcbiAgY21pO1xuICBzdGFydGluZ0RhdGE6IHt9O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQmFzZSBBUEkgY2xhc3MuIFNldHMgc29tZSBzaGFyZWQgQVBJIGZpZWxkcywgYXMgd2VsbCBhc1xuICAgKiBzZXRzIHVwIG9wdGlvbnMgZm9yIHRoZSBBUEkuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBlcnJvcl9jb2Rlc1xuICAgKiBAcGFyYW0ge29iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKGVycm9yX2NvZGVzLCBzZXR0aW5ncykge1xuICAgIGlmIChuZXcudGFyZ2V0ID09PSBCYXNlQVBJKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29uc3RydWN0IEJhc2VBUEkgaW5zdGFuY2VzIGRpcmVjdGx5Jyk7XG4gICAgfVxuICAgIHRoaXMuY3VycmVudFN0YXRlID0gZ2xvYmFsX2NvbnN0YW50cy5TVEFURV9OT1RfSU5JVElBTElaRUQ7XG4gICAgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcbiAgICB0aGlzLmxpc3RlbmVyQXJyYXkgPSBbXTtcblxuICAgIHRoaXMuI3RpbWVvdXQgPSBudWxsO1xuICAgIHRoaXMuI2Vycm9yX2NvZGVzID0gZXJyb3JfY29kZXM7XG5cbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XG4gICAgdGhpcy5hcGlMb2dMZXZlbCA9IHRoaXMuc2V0dGluZ3MubG9nTGV2ZWw7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgQVBJXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGluaXRpYWxpemVNZXNzYWdlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXJtaW5hdGlvbk1lc3NhZ2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgaW5pdGlhbGl6ZShcbiAgICAgIGNhbGxiYWNrTmFtZTogU3RyaW5nLFxuICAgICAgaW5pdGlhbGl6ZU1lc3NhZ2U/OiBTdHJpbmcsXG4gICAgICB0ZXJtaW5hdGlvbk1lc3NhZ2U/OiBTdHJpbmcpIHtcbiAgICBsZXQgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuXG4gICAgaWYgKHRoaXMuaXNJbml0aWFsaXplZCgpKSB7XG4gICAgICB0aGlzLnRocm93U0NPUk1FcnJvcih0aGlzLiNlcnJvcl9jb2Rlcy5JTklUSUFMSVpFRCwgaW5pdGlhbGl6ZU1lc3NhZ2UpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc1Rlcm1pbmF0ZWQoKSkge1xuICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IodGhpcy4jZXJyb3JfY29kZXMuVEVSTUlOQVRFRCwgdGVybWluYXRpb25NZXNzYWdlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBnbG9iYWxfY29uc3RhbnRzLlNUQVRFX0lOSVRJQUxJWkVEO1xuICAgICAgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcbiAgICAgIHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBudWxsLCAncmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG4gICAgdGhpcy5jbGVhclNDT1JNRXJyb3IocmV0dXJuVmFsdWUpO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3NldHRpbmdzXG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIGdldCBzZXR0aW5ncygpIHtcbiAgICByZXR1cm4gdGhpcy4jc2V0dGluZ3M7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc2V0dGluZ3NcbiAgICogQHBhcmFtIHtvYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3M6IE9iamVjdCkge1xuICAgIHRoaXMuI3NldHRpbmdzID0gey4uLnRoaXMuI3NldHRpbmdzLCAuLi5zZXR0aW5nc307XG4gIH1cblxuICAvKipcbiAgICogVGVybWluYXRlcyB0aGUgY3VycmVudCBydW4gb2YgdGhlIEFQSVxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tUZXJtaW5hdGVkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHRlcm1pbmF0ZShcbiAgICAgIGNhbGxiYWNrTmFtZTogU3RyaW5nLFxuICAgICAgY2hlY2tUZXJtaW5hdGVkOiBib29sZWFuKSB7XG4gICAgbGV0IHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcblxuICAgIGlmICh0aGlzLmNoZWNrU3RhdGUoY2hlY2tUZXJtaW5hdGVkLFxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5URVJNSU5BVElPTl9CRUZPUkVfSU5JVCxcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuTVVMVElQTEVfVEVSTUlOQVRJT04pKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnN0b3JlRGF0YSh0cnVlKTtcbiAgICAgIGlmIChyZXN1bHQuZXJyb3JDb2RlICYmIHJlc3VsdC5lcnJvckNvZGUgPiAwKSB7XG4gICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHJlc3VsdC5lcnJvckNvZGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuVmFsdWUgPSByZXN1bHQucmVzdWx0ID9cbiAgICAgICAgICByZXN1bHQucmVzdWx0IDogZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcblxuICAgICAgaWYgKGNoZWNrVGVybWluYXRlZCkgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcbiAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gZ2xvYmFsX2NvbnN0YW50cy5TVEFURV9URVJNSU5BVEVEO1xuICAgICAgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUU7XG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcbiAgICB0aGlzLmNsZWFyU0NPUk1FcnJvcihyZXR1cm5WYWx1ZSk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSB2YWx1ZSBvZiB0aGUgQ01JRWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrVGVybWluYXRlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXRWYWx1ZShcbiAgICAgIGNhbGxiYWNrTmFtZTogU3RyaW5nLFxuICAgICAgY2hlY2tUZXJtaW5hdGVkOiBib29sZWFuLFxuICAgICAgQ01JRWxlbWVudDogU3RyaW5nKSB7XG4gICAgbGV0IHJldHVyblZhbHVlO1xuXG4gICAgaWYgKHRoaXMuY2hlY2tTdGF0ZShjaGVja1Rlcm1pbmF0ZWQsXG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLlJFVFJJRVZFX0JFRk9SRV9JTklULFxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5SRVRSSUVWRV9BRlRFUl9URVJNKSkge1xuICAgICAgaWYgKGNoZWNrVGVybWluYXRlZCkgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcbiAgICAgIHJldHVyblZhbHVlID0gdGhpcy5nZXRDTUlWYWx1ZShDTUlFbGVtZW50KTtcbiAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUsIENNSUVsZW1lbnQpO1xuICAgIH1cblxuICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgQ01JRWxlbWVudCwgJzogcmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG4gICAgdGhpcy5jbGVhclNDT1JNRXJyb3IocmV0dXJuVmFsdWUpO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBDTUlFbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tUZXJtaW5hdGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgc2V0VmFsdWUoXG4gICAgICBjYWxsYmFja05hbWU6IFN0cmluZyxcbiAgICAgIGNoZWNrVGVybWluYXRlZDogYm9vbGVhbixcbiAgICAgIENNSUVsZW1lbnQsXG4gICAgICB2YWx1ZSkge1xuICAgIGxldCByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG5cbiAgICBpZiAodGhpcy5jaGVja1N0YXRlKGNoZWNrVGVybWluYXRlZCwgdGhpcy4jZXJyb3JfY29kZXMuU1RPUkVfQkVGT1JFX0lOSVQsXG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLlNUT1JFX0FGVEVSX1RFUk0pKSB7XG4gICAgICBpZiAoY2hlY2tUZXJtaW5hdGVkKSB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuVmFsdWUgPSB0aGlzLnNldENNSVZhbHVlKENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBWYWxpZGF0aW9uRXJyb3IpIHtcbiAgICAgICAgICB0aGlzLmxhc3RFcnJvckNvZGUgPSBlLmVycm9yQ29kZTtcbiAgICAgICAgICByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IodGhpcy4jZXJyb3JfY29kZXMuR0VORVJBTCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUsIENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAocmV0dXJuVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuICAgIH1cblxuICAgIC8vIElmIHdlIGRpZG4ndCBoYXZlIGFueSBlcnJvcnMgd2hpbGUgc2V0dGluZyB0aGUgZGF0YSwgZ28gYWhlYWQgYW5kXG4gICAgLy8gc2NoZWR1bGUgYSBjb21taXQsIGlmIGF1dG9jb21taXQgaXMgdHVybmVkIG9uXG4gICAgaWYgKFN0cmluZyh0aGlzLmxhc3RFcnJvckNvZGUpID09PSAnMCcpIHtcbiAgICAgIGlmICh0aGlzLnNldHRpbmdzLmF1dG9jb21taXQgJiYgIXRoaXMuI3RpbWVvdXQpIHtcbiAgICAgICAgdGhpcy5zY2hlZHVsZUNvbW1pdCh0aGlzLnNldHRpbmdzLmF1dG9jb21taXRTZWNvbmRzICogMTAwMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBDTUlFbGVtZW50LFxuICAgICAgICAnOiAnICsgdmFsdWUgKyAnOiByZXN1bHQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG4gICAgdGhpcy5jbGVhclNDT1JNRXJyb3IocmV0dXJuVmFsdWUpO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIE9yZGVycyBMTVMgdG8gc3RvcmUgYWxsIGNvbnRlbnQgcGFyYW1ldGVyc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tUZXJtaW5hdGVkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGNvbW1pdChcbiAgICAgIGNhbGxiYWNrTmFtZTogU3RyaW5nLFxuICAgICAgY2hlY2tUZXJtaW5hdGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5jbGVhclNjaGVkdWxlZENvbW1pdCgpO1xuXG4gICAgbGV0IHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcblxuICAgIGlmICh0aGlzLmNoZWNrU3RhdGUoY2hlY2tUZXJtaW5hdGVkLCB0aGlzLiNlcnJvcl9jb2Rlcy5DT01NSVRfQkVGT1JFX0lOSVQsXG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLkNPTU1JVF9BRlRFUl9URVJNKSkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5zdG9yZURhdGEoZmFsc2UpO1xuICAgICAgaWYgKHJlc3VsdC5lcnJvckNvZGUgJiYgcmVzdWx0LmVycm9yQ29kZSA+IDApIHtcbiAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IocmVzdWx0LmVycm9yQ29kZSk7XG4gICAgICB9XG4gICAgICByZXR1cm5WYWx1ZSA9IHJlc3VsdC5yZXN1bHQgP1xuICAgICAgICAgIHJlc3VsdC5yZXN1bHQgOiBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuXG4gICAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsICdIdHRwUmVxdWVzdCcsICcgUmVzdWx0OiAnICsgcmV0dXJuVmFsdWUsXG4gICAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfREVCVUcpO1xuXG4gICAgICBpZiAoY2hlY2tUZXJtaW5hdGVkKSB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuXG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcbiAgICB0aGlzLmNsZWFyU0NPUk1FcnJvcihyZXR1cm5WYWx1ZSk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBsYXN0IGVycm9yIGNvZGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXRMYXN0RXJyb3IoY2FsbGJhY2tOYW1lOiBTdHJpbmcpIHtcbiAgICBjb25zdCByZXR1cm5WYWx1ZSA9IFN0cmluZyh0aGlzLmxhc3RFcnJvckNvZGUpO1xuXG4gICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSk7XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBlcnJvck51bWJlciBlcnJvciBkZXNjcmlwdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXIpfSBDTUlFcnJvckNvZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0RXJyb3JTdHJpbmcoY2FsbGJhY2tOYW1lOiBTdHJpbmcsIENNSUVycm9yQ29kZSkge1xuICAgIGxldCByZXR1cm5WYWx1ZSA9ICcnO1xuXG4gICAgaWYgKENNSUVycm9yQ29kZSAhPT0gbnVsbCAmJiBDTUlFcnJvckNvZGUgIT09ICcnKSB7XG4gICAgICByZXR1cm5WYWx1ZSA9IHRoaXMuZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhDTUlFcnJvckNvZGUpO1xuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBudWxsLCAncmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGNvbXByZWhlbnNpdmUgZGVzY3JpcHRpb24gb2YgdGhlIGVycm9yTnVtYmVyIGVycm9yLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXIpfSBDTUlFcnJvckNvZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0RGlhZ25vc3RpYyhjYWxsYmFja05hbWU6IFN0cmluZywgQ01JRXJyb3JDb2RlKSB7XG4gICAgbGV0IHJldHVyblZhbHVlID0gJyc7XG5cbiAgICBpZiAoQ01JRXJyb3JDb2RlICE9PSBudWxsICYmIENNSUVycm9yQ29kZSAhPT0gJycpIHtcbiAgICAgIHJldHVyblZhbHVlID0gdGhpcy5nZXRMbXNFcnJvck1lc3NhZ2VEZXRhaWxzKENNSUVycm9yQ29kZSwgdHJ1ZSk7XG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgdGhlIExNUyBzdGF0ZSBhbmQgZW5zdXJlcyBpdCBoYXMgYmVlbiBpbml0aWFsaXplZC5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBjaGVja1Rlcm1pbmF0ZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGJlZm9yZUluaXRFcnJvclxuICAgKiBAcGFyYW0ge251bWJlcn0gYWZ0ZXJUZXJtRXJyb3JcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGNoZWNrU3RhdGUoXG4gICAgICBjaGVja1Rlcm1pbmF0ZWQ6IGJvb2xlYW4sXG4gICAgICBiZWZvcmVJbml0RXJyb3I6IG51bWJlcixcbiAgICAgIGFmdGVyVGVybUVycm9yPzogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuaXNOb3RJbml0aWFsaXplZCgpKSB7XG4gICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihiZWZvcmVJbml0RXJyb3IpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoY2hlY2tUZXJtaW5hdGVkICYmIHRoaXMuaXNUZXJtaW5hdGVkKCkpIHtcbiAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGFmdGVyVGVybUVycm9yKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2dnaW5nIGZvciBhbGwgU0NPUk0gYWN0aW9uc1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZnVuY3Rpb25OYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2dNZXNzYWdlXG4gICAqIEBwYXJhbSB7bnVtYmVyfW1lc3NhZ2VMZXZlbFxuICAgKi9cbiAgYXBpTG9nKFxuICAgICAgZnVuY3Rpb25OYW1lOiBTdHJpbmcsXG4gICAgICBDTUlFbGVtZW50OiBTdHJpbmcsXG4gICAgICBsb2dNZXNzYWdlOiBTdHJpbmcsXG4gICAgICBtZXNzYWdlTGV2ZWw6IG51bWJlcikge1xuICAgIGxvZ01lc3NhZ2UgPSB0aGlzLmZvcm1hdE1lc3NhZ2UoZnVuY3Rpb25OYW1lLCBDTUlFbGVtZW50LCBsb2dNZXNzYWdlKTtcblxuICAgIGlmIChtZXNzYWdlTGV2ZWwgPj0gdGhpcy5hcGlMb2dMZXZlbCkge1xuICAgICAgc3dpdGNoIChtZXNzYWdlTGV2ZWwpIHtcbiAgICAgICAgY2FzZSBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9FUlJPUjpcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGxvZ01lc3NhZ2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX1dBUk5JTkc6XG4gICAgICAgICAgY29uc29sZS53YXJuKGxvZ01lc3NhZ2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk86XG4gICAgICAgICAgY29uc29sZS5pbmZvKGxvZ01lc3NhZ2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0RFQlVHOlxuICAgICAgICAgIGlmIChjb25zb2xlLmRlYnVnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKGxvZ01lc3NhZ2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhsb2dNZXNzYWdlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEZvcm1hdHMgdGhlIFNDT1JNIG1lc3NhZ2VzIGZvciBlYXN5IHJlYWRpbmdcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZ1bmN0aW9uTmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBmb3JtYXRNZXNzYWdlKGZ1bmN0aW9uTmFtZTogU3RyaW5nLCBDTUlFbGVtZW50OiBTdHJpbmcsIG1lc3NhZ2U6IFN0cmluZykge1xuICAgIGNvbnN0IGJhc2VMZW5ndGggPSAyMDtcbiAgICBsZXQgbWVzc2FnZVN0cmluZyA9ICcnO1xuXG4gICAgbWVzc2FnZVN0cmluZyArPSBmdW5jdGlvbk5hbWU7XG5cbiAgICBsZXQgZmlsbENoYXJzID0gYmFzZUxlbmd0aCAtIG1lc3NhZ2VTdHJpbmcubGVuZ3RoO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaWxsQ2hhcnM7IGkrKykge1xuICAgICAgbWVzc2FnZVN0cmluZyArPSAnICc7XG4gICAgfVxuXG4gICAgbWVzc2FnZVN0cmluZyArPSAnOiAnO1xuXG4gICAgaWYgKENNSUVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IENNSUVsZW1lbnRCYXNlTGVuZ3RoID0gNzA7XG5cbiAgICAgIG1lc3NhZ2VTdHJpbmcgKz0gQ01JRWxlbWVudDtcblxuICAgICAgZmlsbENoYXJzID0gQ01JRWxlbWVudEJhc2VMZW5ndGggLSBtZXNzYWdlU3RyaW5nLmxlbmd0aDtcblxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBmaWxsQ2hhcnM7IGorKykge1xuICAgICAgICBtZXNzYWdlU3RyaW5nICs9ICcgJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobWVzc2FnZSkge1xuICAgICAgbWVzc2FnZVN0cmluZyArPSBtZXNzYWdlO1xuICAgIH1cblxuICAgIHJldHVybiBtZXNzYWdlU3RyaW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB0byBzZWUgaWYge3N0cn0gY29udGFpbnMge3Rlc3Rlcn1cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0ciBTdHJpbmcgdG8gY2hlY2sgYWdhaW5zdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGVzdGVyIFN0cmluZyB0byBjaGVjayBmb3JcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIHN0cmluZ01hdGNoZXMoc3RyOiBTdHJpbmcsIHRlc3RlcjogU3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0ciAmJiB0ZXN0ZXIgJiYgc3RyLm1hdGNoKHRlc3Rlcik7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgdG8gc2VlIGlmIHRoZSBzcGVjaWZpYyBvYmplY3QgaGFzIHRoZSBnaXZlbiBwcm9wZXJ0eVxuICAgKiBAcGFyYW0geyp9IHJlZk9iamVjdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXR0cmlidXRlXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfY2hlY2tPYmplY3RIYXNQcm9wZXJ0eShyZWZPYmplY3QsIGF0dHJpYnV0ZTogU3RyaW5nKSB7XG4gICAgcmV0dXJuIE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlZk9iamVjdCwgYXR0cmlidXRlKSB8fFxuICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFxuICAgICAgICAgICAgT2JqZWN0LmdldFByb3RvdHlwZU9mKHJlZk9iamVjdCksIGF0dHJpYnV0ZSkgfHxcbiAgICAgICAgKGF0dHJpYnV0ZSBpbiByZWZPYmplY3QpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1lc3NhZ2UgdGhhdCBjb3JyZXNwb25kcyB0byBlcnJvck51bWJlclxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXIpfSBfZXJyb3JOdW1iZXJcbiAgICogQHBhcmFtIHtib29sZWFufSBfZGV0YWlsXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBnZXRMbXNFcnJvck1lc3NhZ2VEZXRhaWxzKF9lcnJvck51bWJlciwgX2RldGFpbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ1RoZSBnZXRMbXNFcnJvck1lc3NhZ2VEZXRhaWxzIG1ldGhvZCBoYXMgbm90IGJlZW4gaW1wbGVtZW50ZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSB2YWx1ZSBmb3IgdGhlIHNwZWNpZmljIGVsZW1lbnQuXG4gICAqIEFQSXMgdGhhdCBpbmhlcml0IEJhc2VBUEkgc2hvdWxkIG92ZXJyaWRlIHRoaXMgZnVuY3Rpb25cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IF9DTUlFbGVtZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBnZXRDTUlWYWx1ZShfQ01JRWxlbWVudCkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIGdldENNSVZhbHVlIG1ldGhvZCBoYXMgbm90IGJlZW4gaW1wbGVtZW50ZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBmb3IgdGhlIHNwZWNpZmljIGVsZW1lbnQuXG4gICAqIEFQSXMgdGhhdCBpbmhlcml0IEJhc2VBUEkgc2hvdWxkIG92ZXJyaWRlIHRoaXMgZnVuY3Rpb25cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IF9DTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7YW55fSBfdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHNldENNSVZhbHVlKF9DTUlFbGVtZW50LCBfdmFsdWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBzZXRDTUlWYWx1ZSBtZXRob2QgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogU2hhcmVkIEFQSSBtZXRob2QgdG8gc2V0IGEgdmFsaWQgZm9yIGEgZ2l2ZW4gZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZE5hbWVcbiAgICogQHBhcmFtIHtib29sZWFufSBzY29ybTIwMDRcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBfY29tbW9uU2V0Q01JVmFsdWUoXG4gICAgICBtZXRob2ROYW1lOiBTdHJpbmcsIHNjb3JtMjAwNDogYm9vbGVhbiwgQ01JRWxlbWVudCwgdmFsdWUpIHtcbiAgICBpZiAoIUNNSUVsZW1lbnQgfHwgQ01JRWxlbWVudCA9PT0gJycpIHtcbiAgICAgIHJldHVybiBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuICAgIH1cblxuICAgIGNvbnN0IHN0cnVjdHVyZSA9IENNSUVsZW1lbnQuc3BsaXQoJy4nKTtcbiAgICBsZXQgcmVmT2JqZWN0ID0gdGhpcztcbiAgICBsZXQgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuICAgIGxldCBmb3VuZEZpcnN0SW5kZXggPSBmYWxzZTtcblxuICAgIGNvbnN0IGludmFsaWRFcnJvck1lc3NhZ2UgPSBgVGhlIGRhdGEgbW9kZWwgZWxlbWVudCBwYXNzZWQgdG8gJHttZXRob2ROYW1lfSAoJHtDTUlFbGVtZW50fSkgaXMgbm90IGEgdmFsaWQgU0NPUk0gZGF0YSBtb2RlbCBlbGVtZW50LmA7XG4gICAgY29uc3QgaW52YWxpZEVycm9yQ29kZSA9IHNjb3JtMjAwNCA/XG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLlVOREVGSU5FRF9EQVRBX01PREVMIDpcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuR0VORVJBTDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RydWN0dXJlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBhdHRyaWJ1dGUgPSBzdHJ1Y3R1cmVbaV07XG5cbiAgICAgIGlmIChpID09PSBzdHJ1Y3R1cmUubGVuZ3RoIC0gMSkge1xuICAgICAgICBpZiAoc2Nvcm0yMDA0ICYmIChhdHRyaWJ1dGUuc3Vic3RyKDAsIDgpID09PSAne3RhcmdldD0nKSAmJlxuICAgICAgICAgICAgKHR5cGVvZiByZWZPYmplY3QuX2lzVGFyZ2V0VmFsaWQgPT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcih0aGlzLiNlcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX2NoZWNrT2JqZWN0SGFzUHJvcGVydHkocmVmT2JqZWN0LCBhdHRyaWJ1dGUpKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoaW52YWxpZEVycm9yQ29kZSwgaW52YWxpZEVycm9yTWVzc2FnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LCAnXFxcXC5jb3JyZWN0X3Jlc3BvbnNlc1xcXFwuXFxcXGQnKSkge1xuICAgICAgICAgICAgdGhpcy52YWxpZGF0ZUNvcnJlY3RSZXNwb25zZShDTUlFbGVtZW50LCB2YWx1ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFzY29ybTIwMDQgfHwgdGhpcy5sYXN0RXJyb3JDb2RlID09PSAwKSB7XG4gICAgICAgICAgICByZWZPYmplY3RbYXR0cmlidXRlXSA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWZPYmplY3QgPSByZWZPYmplY3RbYXR0cmlidXRlXTtcbiAgICAgICAgaWYgKCFyZWZPYmplY3QpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihpbnZhbGlkRXJyb3JDb2RlLCBpbnZhbGlkRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZWZPYmplY3QgaW5zdGFuY2VvZiBDTUlBcnJheSkge1xuICAgICAgICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoc3RydWN0dXJlW2kgKyAxXSwgMTApO1xuXG4gICAgICAgICAgLy8gU0NPIGlzIHRyeWluZyB0byBzZXQgYW4gaXRlbSBvbiBhbiBhcnJheVxuICAgICAgICAgIGlmICghaXNOYU4oaW5kZXgpKSB7XG4gICAgICAgICAgICBjb25zdCBpdGVtID0gcmVmT2JqZWN0LmNoaWxkQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgICByZWZPYmplY3QgPSBpdGVtO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc3QgbmV3Q2hpbGQgPSB0aGlzLmdldENoaWxkRWxlbWVudChDTUlFbGVtZW50LCB2YWx1ZSxcbiAgICAgICAgICAgICAgICAgIGZvdW5kRmlyc3RJbmRleCk7XG4gICAgICAgICAgICAgIGZvdW5kRmlyc3RJbmRleCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgaWYgKCFuZXdDaGlsZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChyZWZPYmplY3QuaW5pdGlhbGl6ZWQpIG5ld0NoaWxkLmluaXRpYWxpemUoKTtcblxuICAgICAgICAgICAgICAgIHJlZk9iamVjdC5jaGlsZEFycmF5LnB1c2gobmV3Q2hpbGQpO1xuICAgICAgICAgICAgICAgIHJlZk9iamVjdCA9IG5ld0NoaWxkO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEhhdmUgdG8gdXBkYXRlIGkgdmFsdWUgdG8gc2tpcCB0aGUgYXJyYXkgcG9zaXRpb25cbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocmV0dXJuVmFsdWUgPT09IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0UpIHtcbiAgICAgIHRoaXMuYXBpTG9nKG1ldGhvZE5hbWUsIG51bGwsXG4gICAgICAgICAgYFRoZXJlIHdhcyBhbiBlcnJvciBzZXR0aW5nIHRoZSB2YWx1ZSBmb3I6ICR7Q01JRWxlbWVudH0sIHZhbHVlIG9mOiAke3ZhbHVlfWAsXG4gICAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfV0FSTklORyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFic3RyYWN0IG1ldGhvZCBmb3IgdmFsaWRhdGluZyB0aGF0IGEgcmVzcG9uc2UgaXMgY29ycmVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IF9DTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gX3ZhbHVlXG4gICAqL1xuICB2YWxpZGF0ZUNvcnJlY3RSZXNwb25zZShfQ01JRWxlbWVudCwgX3ZhbHVlKSB7XG4gICAgLy8ganVzdCBhIHN0dWIgbWV0aG9kXG4gIH1cblxuICAvKipcbiAgICogR2V0cyBvciBidWlsZHMgYSBuZXcgY2hpbGQgZWxlbWVudCB0byBhZGQgdG8gdGhlIGFycmF5LlxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IF9DTUlFbGVtZW50IC0gdW51c2VkXG4gICAqIEBwYXJhbSB7Kn0gX3ZhbHVlIC0gdW51c2VkXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gX2ZvdW5kRmlyc3RJbmRleCAtIHVudXNlZFxuICAgKiBAcmV0dXJuIHsqfVxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGdldENoaWxkRWxlbWVudChfQ01JRWxlbWVudCwgX3ZhbHVlLCBfZm91bmRGaXJzdEluZGV4KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgZ2V0Q2hpbGRFbGVtZW50IG1ldGhvZCBoYXMgbm90IGJlZW4gaW1wbGVtZW50ZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgdmFsdWUgZnJvbSB0aGUgQ01JIE9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kTmFtZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHNjb3JtMjAwNFxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgX2NvbW1vbkdldENNSVZhbHVlKG1ldGhvZE5hbWU6IFN0cmluZywgc2Nvcm0yMDA0OiBib29sZWFuLCBDTUlFbGVtZW50KSB7XG4gICAgaWYgKCFDTUlFbGVtZW50IHx8IENNSUVsZW1lbnQgPT09ICcnKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RydWN0dXJlID0gQ01JRWxlbWVudC5zcGxpdCgnLicpO1xuICAgIGxldCByZWZPYmplY3QgPSB0aGlzO1xuICAgIGxldCBhdHRyaWJ1dGUgPSBudWxsO1xuXG4gICAgY29uc3QgdW5pbml0aWFsaXplZEVycm9yTWVzc2FnZSA9IGBUaGUgZGF0YSBtb2RlbCBlbGVtZW50IHBhc3NlZCB0byAke21ldGhvZE5hbWV9ICgke0NNSUVsZW1lbnR9KSBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQuYDtcbiAgICBjb25zdCBpbnZhbGlkRXJyb3JNZXNzYWdlID0gYFRoZSBkYXRhIG1vZGVsIGVsZW1lbnQgcGFzc2VkIHRvICR7bWV0aG9kTmFtZX0gKCR7Q01JRWxlbWVudH0pIGlzIG5vdCBhIHZhbGlkIFNDT1JNIGRhdGEgbW9kZWwgZWxlbWVudC5gO1xuICAgIGNvbnN0IGludmFsaWRFcnJvckNvZGUgPSBzY29ybTIwMDQgP1xuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5VTkRFRklORURfREFUQV9NT0RFTCA6XG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLkdFTkVSQUw7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0cnVjdHVyZS5sZW5ndGg7IGkrKykge1xuICAgICAgYXR0cmlidXRlID0gc3RydWN0dXJlW2ldO1xuXG4gICAgICBpZiAoIXNjb3JtMjAwNCkge1xuICAgICAgICBpZiAoaSA9PT0gc3RydWN0dXJlLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBpZiAoIXRoaXMuX2NoZWNrT2JqZWN0SGFzUHJvcGVydHkocmVmT2JqZWN0LCBhdHRyaWJ1dGUpKSB7XG4gICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihpbnZhbGlkRXJyb3JDb2RlLCBpbnZhbGlkRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICgoU3RyaW5nKGF0dHJpYnV0ZSkuc3Vic3RyKDAsIDgpID09PSAne3RhcmdldD0nKSAmJlxuICAgICAgICAgICAgKHR5cGVvZiByZWZPYmplY3QuX2lzVGFyZ2V0VmFsaWQgPT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICBjb25zdCB0YXJnZXQgPSBTdHJpbmcoYXR0cmlidXRlKS5cbiAgICAgICAgICAgICAgc3Vic3RyKDgsIFN0cmluZyhhdHRyaWJ1dGUpLmxlbmd0aCAtIDkpO1xuICAgICAgICAgIHJldHVybiByZWZPYmplY3QuX2lzVGFyZ2V0VmFsaWQodGFyZ2V0KTtcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5fY2hlY2tPYmplY3RIYXNQcm9wZXJ0eShyZWZPYmplY3QsIGF0dHJpYnV0ZSkpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihpbnZhbGlkRXJyb3JDb2RlLCBpbnZhbGlkRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmVmT2JqZWN0ID0gcmVmT2JqZWN0W2F0dHJpYnV0ZV07XG4gICAgICBpZiAocmVmT2JqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoaW52YWxpZEVycm9yQ29kZSwgaW52YWxpZEVycm9yTWVzc2FnZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVmT2JqZWN0IGluc3RhbmNlb2YgQ01JQXJyYXkpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBwYXJzZUludChzdHJ1Y3R1cmVbaSArIDFdLCAxMCk7XG5cbiAgICAgICAgLy8gU0NPIGlzIHRyeWluZyB0byBzZXQgYW4gaXRlbSBvbiBhbiBhcnJheVxuICAgICAgICBpZiAoIWlzTmFOKGluZGV4KSkge1xuICAgICAgICAgIGNvbnN0IGl0ZW0gPSByZWZPYmplY3QuY2hpbGRBcnJheVtpbmRleF07XG5cbiAgICAgICAgICBpZiAoaXRlbSkge1xuICAgICAgICAgICAgcmVmT2JqZWN0ID0gaXRlbTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IodGhpcy4jZXJyb3JfY29kZXMuVkFMVUVfTk9UX0lOSVRJQUxJWkVELFxuICAgICAgICAgICAgICAgIHVuaW5pdGlhbGl6ZWRFcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSGF2ZSB0byB1cGRhdGUgaSB2YWx1ZSB0byBza2lwIHRoZSBhcnJheSBwb3NpdGlvblxuICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyZWZPYmplY3QgPT09IG51bGwgfHwgcmVmT2JqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICghc2Nvcm0yMDA0KSB7XG4gICAgICAgIGlmIChhdHRyaWJ1dGUgPT09ICdfY2hpbGRyZW4nKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0xMl9lcnJvcl9jb2Rlcy5DSElMRFJFTl9FUlJPUik7XG4gICAgICAgIH0gZWxzZSBpZiAoYXR0cmlidXRlID09PSAnX2NvdW50Jykge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMTJfZXJyb3JfY29kZXMuQ09VTlRfRVJST1IpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZWZPYmplY3Q7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgQVBJJ3MgY3VycmVudCBzdGF0ZSBpcyBTVEFURV9JTklUSUFMSVpFRFxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgaXNJbml0aWFsaXplZCgpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUgPT09IGdsb2JhbF9jb25zdGFudHMuU1RBVEVfSU5JVElBTElaRUQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBBUEkncyBjdXJyZW50IHN0YXRlIGlzIFNUQVRFX05PVF9JTklUSUFMSVpFRFxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgaXNOb3RJbml0aWFsaXplZCgpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUgPT09IGdsb2JhbF9jb25zdGFudHMuU1RBVEVfTk9UX0lOSVRJQUxJWkVEO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgQVBJJ3MgY3VycmVudCBzdGF0ZSBpcyBTVEFURV9URVJNSU5BVEVEXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBpc1Rlcm1pbmF0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlID09PSBnbG9iYWxfY29uc3RhbnRzLlNUQVRFX1RFUk1JTkFURUQ7XG4gIH1cblxuICAvKipcbiAgICogUHJvdmlkZXMgYSBtZWNoYW5pc20gZm9yIGF0dGFjaGluZyB0byBhIHNwZWNpZmljIFNDT1JNIGV2ZW50XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsaXN0ZW5lck5hbWVcbiAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uKGxpc3RlbmVyTmFtZTogU3RyaW5nLCBjYWxsYmFjazogZnVuY3Rpb24pIHtcbiAgICBpZiAoIWNhbGxiYWNrKSByZXR1cm47XG5cbiAgICBjb25zdCBsaXN0ZW5lckZ1bmN0aW9ucyA9IGxpc3RlbmVyTmFtZS5zcGxpdCgnICcpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdGVuZXJGdW5jdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGxpc3RlbmVyU3BsaXQgPSBsaXN0ZW5lckZ1bmN0aW9uc1tpXS5zcGxpdCgnLicpO1xuICAgICAgaWYgKGxpc3RlbmVyU3BsaXQubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IGZ1bmN0aW9uTmFtZSA9IGxpc3RlbmVyU3BsaXRbMF07XG5cbiAgICAgIGxldCBDTUlFbGVtZW50ID0gbnVsbDtcbiAgICAgIGlmIChsaXN0ZW5lclNwbGl0Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgQ01JRWxlbWVudCA9IGxpc3RlbmVyTmFtZS5yZXBsYWNlKGZ1bmN0aW9uTmFtZSArICcuJywgJycpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmxpc3RlbmVyQXJyYXkucHVzaCh7XG4gICAgICAgIGZ1bmN0aW9uTmFtZTogZnVuY3Rpb25OYW1lLFxuICAgICAgICBDTUlFbGVtZW50OiBDTUlFbGVtZW50LFxuICAgICAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHJvY2Vzc2VzIGFueSAnb24nIGxpc3RlbmVycyB0aGF0IGhhdmUgYmVlbiBjcmVhdGVkXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmdW5jdGlvbk5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKi9cbiAgcHJvY2Vzc0xpc3RlbmVycyhmdW5jdGlvbk5hbWU6IFN0cmluZywgQ01JRWxlbWVudDogU3RyaW5nLCB2YWx1ZTogYW55KSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxpc3RlbmVyQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGxpc3RlbmVyID0gdGhpcy5saXN0ZW5lckFycmF5W2ldO1xuICAgICAgY29uc3QgZnVuY3Rpb25zTWF0Y2ggPSBsaXN0ZW5lci5mdW5jdGlvbk5hbWUgPT09IGZ1bmN0aW9uTmFtZTtcbiAgICAgIGNvbnN0IGxpc3RlbmVySGFzQ01JRWxlbWVudCA9ICEhbGlzdGVuZXIuQ01JRWxlbWVudDtcbiAgICAgIGNvbnN0IENNSUVsZW1lbnRzTWF0Y2ggPSBsaXN0ZW5lci5DTUlFbGVtZW50ID09PSBDTUlFbGVtZW50O1xuXG4gICAgICBpZiAoZnVuY3Rpb25zTWF0Y2ggJiYgKCFsaXN0ZW5lckhhc0NNSUVsZW1lbnQgfHwgQ01JRWxlbWVudHNNYXRjaCkpIHtcbiAgICAgICAgbGlzdGVuZXIuY2FsbGJhY2soQ01JRWxlbWVudCwgdmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaHJvd3MgYSBTQ09STSBlcnJvclxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gZXJyb3JOdW1iZXJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VcbiAgICovXG4gIHRocm93U0NPUk1FcnJvcihlcnJvck51bWJlcjogbnVtYmVyLCBtZXNzYWdlOiBTdHJpbmcpIHtcbiAgICBpZiAoIW1lc3NhZ2UpIHtcbiAgICAgIG1lc3NhZ2UgPSB0aGlzLmdldExtc0Vycm9yTWVzc2FnZURldGFpbHMoZXJyb3JOdW1iZXIpO1xuICAgIH1cblxuICAgIHRoaXMuYXBpTG9nKCd0aHJvd1NDT1JNRXJyb3InLCBudWxsLCBlcnJvck51bWJlciArICc6ICcgKyBtZXNzYWdlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9FUlJPUik7XG5cbiAgICB0aGlzLmxhc3RFcnJvckNvZGUgPSBTdHJpbmcoZXJyb3JOdW1iZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyB0aGUgbGFzdCBTQ09STSBlcnJvciBjb2RlIG9uIHN1Y2Nlc3MuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdWNjZXNzXG4gICAqL1xuICBjbGVhclNDT1JNRXJyb3Ioc3VjY2VzczogU3RyaW5nKSB7XG4gICAgaWYgKHN1Y2Nlc3MgIT09IHVuZGVmaW5lZCAmJiBzdWNjZXNzICE9PSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFKSB7XG4gICAgICB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0cyB0byBzdG9yZSB0aGUgZGF0YSB0byB0aGUgTE1TLCBsb2dzIGRhdGEgaWYgbm8gTE1TIGNvbmZpZ3VyZWRcbiAgICogQVBJcyB0aGF0IGluaGVyaXQgQmFzZUFQSSBzaG91bGQgb3ZlcnJpZGUgdGhpcyBmdW5jdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IF9jYWxjdWxhdGVUb3RhbFRpbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHN0b3JlRGF0YShfY2FsY3VsYXRlVG90YWxUaW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlIHN0b3JlRGF0YSBtZXRob2QgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZCB0aGUgQ01JIGZyb20gYSBmbGF0dGVuZWQgSlNPTiBvYmplY3RcbiAgICogQHBhcmFtIHtvYmplY3R9IGpzb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICovXG4gIGxvYWRGcm9tRmxhdHRlbmVkSlNPTihqc29uLCBDTUlFbGVtZW50KSB7XG4gICAgdGhpcy5sb2FkRnJvbUpTT04odW5mbGF0dGVuKGpzb24pLCBDTUlFbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkcyBDTUkgZGF0YSBmcm9tIGEgSlNPTiBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBqc29uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqL1xuICBsb2FkRnJvbUpTT04oanNvbiwgQ01JRWxlbWVudCkge1xuICAgIGlmICghdGhpcy5pc05vdEluaXRpYWxpemVkKCkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgJ2xvYWRGcm9tSlNPTiBjYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlIHRoZSBjYWxsIHRvIGxtc0luaXRpYWxpemUuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgQ01JRWxlbWVudCA9IENNSUVsZW1lbnQgfHwgJ2NtaSc7XG5cbiAgICB0aGlzLnN0YXJ0aW5nRGF0YSA9IGpzb247XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBqc29uKSB7XG4gICAgICBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChqc29uLCBrZXkpICYmIGpzb25ba2V5XSkge1xuICAgICAgICBjb25zdCBjdXJyZW50Q01JRWxlbWVudCA9IENNSUVsZW1lbnQgKyAnLicgKyBrZXk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0ganNvbltrZXldO1xuXG4gICAgICAgIGlmICh2YWx1ZVsnY2hpbGRBcnJheSddKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZVsnY2hpbGRBcnJheSddLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRGcm9tSlNPTih2YWx1ZVsnY2hpbGRBcnJheSddW2ldLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRDTUlFbGVtZW50ICsgJy4nICsgaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlLmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHtcbiAgICAgICAgICB0aGlzLmxvYWRGcm9tSlNPTih2YWx1ZSwgY3VycmVudENNSUVsZW1lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0Q01JVmFsdWUoY3VycmVudENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIENNSSBvYmplY3QgdG8gSlNPTiBmb3Igc2VuZGluZyB0byBhbiBMTVMuXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHJlbmRlckNNSVRvSlNPTlN0cmluZygpIHtcbiAgICBjb25zdCBjbWkgPSB0aGlzLmNtaTtcbiAgICAvLyBEbyB3ZSB3YW50L25lZWQgdG8gcmV0dXJuIGZpZWxkcyB0aGF0IGhhdmUgbm8gc2V0IHZhbHVlP1xuICAgIC8vIHJldHVybiBKU09OLnN0cmluZ2lmeSh7IGNtaSB9LCAoaywgdikgPT4gdiA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IHYsIDIpO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh7Y21pfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIEpTIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGN1cnJlbnQgY21pXG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIHJlbmRlckNNSVRvSlNPTk9iamVjdCgpIHtcbiAgICAvLyBEbyB3ZSB3YW50L25lZWQgdG8gcmV0dXJuIGZpZWxkcyB0aGF0IGhhdmUgbm8gc2V0IHZhbHVlP1xuICAgIC8vIHJldHVybiBKU09OLnN0cmluZ2lmeSh7IGNtaSB9LCAoaywgdikgPT4gdiA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IHYsIDIpO1xuICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMucmVuZGVyQ01JVG9KU09OU3RyaW5nKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgY21pIG9iamVjdCB0byB0aGUgcHJvcGVyIGZvcm1hdCBmb3IgTE1TIGNvbW1pdFxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gX3Rlcm1pbmF0ZUNvbW1pdFxuICAgKiBAcmV0dXJuIHsqfVxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHJlbmRlckNvbW1pdENNSShfdGVybWluYXRlQ29tbWl0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlIHN0b3JlRGF0YSBtZXRob2QgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCB0aGUgcmVxdWVzdCB0byB0aGUgTE1TXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHtvYmplY3R8QXJyYXl9IHBhcmFtc1xuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICBwcm9jZXNzSHR0cFJlcXVlc3QodXJsOiBTdHJpbmcsIHBhcmFtcykge1xuICAgIGNvbnN0IGdlbmVyaWNFcnJvciA9IHtcbiAgICAgICdyZXN1bHQnOiBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFLFxuICAgICAgJ2Vycm9yQ29kZSc6IHRoaXMuI2Vycm9yX2NvZGVzLkdFTkVSQUwsXG4gICAgfTtcblxuICAgIGNvbnN0IGh0dHBSZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICBodHRwUmVxLm9wZW4oJ1BPU1QnLCB1cmwsIGZhbHNlKTtcbiAgICB0cnkge1xuICAgICAgaWYgKHBhcmFtcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIGh0dHBSZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJyxcbiAgICAgICAgICAgICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcbiAgICAgICAgaHR0cFJlcS5zZW5kKHBhcmFtcy5qb2luKCcmJykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaHR0cFJlcS5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLFxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5jb21taXRSZXF1ZXN0RGF0YVR5cGUpO1xuICAgICAgICBodHRwUmVxLnNlbmQoSlNPTi5zdHJpbmdpZnkocGFyYW1zKSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGdlbmVyaWNFcnJvcjtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoaHR0cFJlcS5yZXNwb25zZVRleHQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBnZW5lcmljRXJyb3I7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRocm93cyBhIFNDT1JNIGVycm9yXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aGVuIC0gdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gd2FpdCBiZWZvcmUgY29tbWl0dGluZ1xuICAgKi9cbiAgc2NoZWR1bGVDb21taXQod2hlbjogbnVtYmVyKSB7XG4gICAgdGhpcy4jdGltZW91dCA9IG5ldyBTY2hlZHVsZWRDb21taXQodGhpcywgd2hlbik7XG4gICAgdGhpcy5hcGlMb2coJ3NjaGVkdWxlQ29tbWl0JywgbnVsbCwgbnVsbCwgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfREVCVUcpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyBhbmQgY2FuY2VscyBhbnkgY3VycmVudGx5IHNjaGVkdWxlZCBjb21taXRzXG4gICAqL1xuICBjbGVhclNjaGVkdWxlZENvbW1pdCgpIHtcbiAgICBpZiAodGhpcy4jdGltZW91dCkge1xuICAgICAgdGhpcy4jdGltZW91dC5jYW5jZWwoKTtcbiAgICAgIHRoaXMuI3RpbWVvdXQgPSBudWxsO1xuICAgICAgdGhpcy5hcGlMb2coJ2NsZWFyU2NoZWR1bGVkQ29tbWl0JywgbnVsbCwgbnVsbCxcbiAgICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9ERUJVRyk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUHJpdmF0ZSBjbGFzcyB0aGF0IHdyYXBzIGEgdGltZW91dCBjYWxsIHRvIHRoZSBjb21taXQoKSBmdW5jdGlvblxuICovXG5jbGFzcyBTY2hlZHVsZWRDb21taXQge1xuICAjQVBJO1xuICAjY2FuY2VsbGVkID0gZmFsc2U7XG4gICN0aW1lb3V0O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgU2NoZWR1bGVkQ29tbWl0XG4gICAqIEBwYXJhbSB7QmFzZUFQSX0gQVBJXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aGVuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihBUEk6IGFueSwgd2hlbjogbnVtYmVyKSB7XG4gICAgdGhpcy4jQVBJID0gQVBJO1xuICAgIHRoaXMuI3RpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMud3JhcHBlciwgd2hlbik7XG4gIH1cblxuICAvKipcbiAgICogQ2FuY2VsIGFueSBjdXJyZW50bHkgc2NoZWR1bGVkIGNvbW1pdFxuICAgKi9cbiAgY2FuY2VsKCkge1xuICAgIHRoaXMuI2NhbmNlbGxlZCA9IHRydWU7XG4gICAgaWYgKHRoaXMuI3RpbWVvdXQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLiN0aW1lb3V0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV3JhcCB0aGUgQVBJIGNvbW1pdCBjYWxsIHRvIGNoZWNrIGlmIHRoZSBjYWxsIGhhcyBhbHJlYWR5IGJlZW4gY2FuY2VsbGVkXG4gICAqL1xuICB3cmFwcGVyKCkge1xuICAgIGlmICghdGhpcy4jY2FuY2VsbGVkKSB7XG4gICAgICB0aGlzLiNBUEkuY29tbWl0KCk7XG4gICAgfVxuICB9XG59XG4iLCIvLyBAZmxvd1xuaW1wb3J0IEJhc2VBUEkgZnJvbSAnLi9CYXNlQVBJJztcbmltcG9ydCB7XG4gIENNSSxcbiAgQ01JSW50ZXJhY3Rpb25zQ29ycmVjdFJlc3BvbnNlc09iamVjdCxcbiAgQ01JSW50ZXJhY3Rpb25zT2JqZWN0LFxuICBDTUlJbnRlcmFjdGlvbnNPYmplY3RpdmVzT2JqZWN0LFxuICBDTUlPYmplY3RpdmVzT2JqZWN0LCBOQVYsXG59IGZyb20gJy4vY21pL3Njb3JtMTJfY21pJztcbmltcG9ydCAqIGFzIFV0aWxpdGllcyBmcm9tICcuL3V0aWxpdGllcyc7XG5pbXBvcnQge2dsb2JhbF9jb25zdGFudHMsIHNjb3JtMTJfY29uc3RhbnRzfSBmcm9tICcuL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCB7c2Nvcm0xMl9lcnJvcl9jb2Rlc30gZnJvbSAnLi9jb25zdGFudHMvZXJyb3JfY29kZXMnO1xuXG5jb25zdCBjb25zdGFudHMgPSBzY29ybTEyX2NvbnN0YW50cztcblxuLyoqXG4gKiBBUEkgY2xhc3MgZm9yIFNDT1JNIDEuMlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY29ybTEyQVBJIGV4dGVuZHMgQmFzZUFQSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgU0NPUk0gMS4yIEFQSVxuICAgKiBAcGFyYW0ge29iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiB7fSkge1xuICAgIGNvbnN0IGZpbmFsU2V0dGluZ3MgPSB7XG4gICAgICAuLi57XG4gICAgICAgIG1hc3Rlcnlfb3ZlcnJpZGU6IGZhbHNlLFxuICAgICAgfSwgLi4uc2V0dGluZ3MsXG4gICAgfTtcblxuICAgIHN1cGVyKHNjb3JtMTJfZXJyb3JfY29kZXMsIGZpbmFsU2V0dGluZ3MpO1xuXG4gICAgdGhpcy5jbWkgPSBuZXcgQ01JKCk7XG4gICAgdGhpcy5uYXYgPSBuZXcgTkFWKCk7XG5cbiAgICAvLyBSZW5hbWUgZnVuY3Rpb25zIHRvIG1hdGNoIDEuMiBTcGVjIGFuZCBleHBvc2UgdG8gbW9kdWxlc1xuICAgIHRoaXMuTE1TSW5pdGlhbGl6ZSA9IHRoaXMubG1zSW5pdGlhbGl6ZTtcbiAgICB0aGlzLkxNU0ZpbmlzaCA9IHRoaXMubG1zRmluaXNoO1xuICAgIHRoaXMuTE1TR2V0VmFsdWUgPSB0aGlzLmxtc0dldFZhbHVlO1xuICAgIHRoaXMuTE1TU2V0VmFsdWUgPSB0aGlzLmxtc1NldFZhbHVlO1xuICAgIHRoaXMuTE1TQ29tbWl0ID0gdGhpcy5sbXNDb21taXQ7XG4gICAgdGhpcy5MTVNHZXRMYXN0RXJyb3IgPSB0aGlzLmxtc0dldExhc3RFcnJvcjtcbiAgICB0aGlzLkxNU0dldEVycm9yU3RyaW5nID0gdGhpcy5sbXNHZXRFcnJvclN0cmluZztcbiAgICB0aGlzLkxNU0dldERpYWdub3N0aWMgPSB0aGlzLmxtc0dldERpYWdub3N0aWM7XG4gIH1cblxuICAvKipcbiAgICogbG1zSW5pdGlhbGl6ZSBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYm9vbFxuICAgKi9cbiAgbG1zSW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLmNtaS5pbml0aWFsaXplKCk7XG4gICAgcmV0dXJuIHRoaXMuaW5pdGlhbGl6ZSgnTE1TSW5pdGlhbGl6ZScsICdMTVMgd2FzIGFscmVhZHkgaW5pdGlhbGl6ZWQhJyxcbiAgICAgICAgJ0xNUyBpcyBhbHJlYWR5IGZpbmlzaGVkIScpO1xuICB9XG5cbiAgLyoqXG4gICAqIExNU0ZpbmlzaCBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYm9vbFxuICAgKi9cbiAgbG1zRmluaXNoKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMudGVybWluYXRlKCdMTVNGaW5pc2gnLCBmYWxzZSk7XG5cbiAgICBpZiAocmVzdWx0ID09PSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUUpIHtcbiAgICAgIGlmICh0aGlzLm5hdi5ldmVudCAhPT0gJycpIHtcbiAgICAgICAgaWYgKHRoaXMubmF2LmV2ZW50ID09PSAnY29udGludWUnKSB7XG4gICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZU5leHQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlUHJldmlvdXMnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLmF1dG9Qcm9ncmVzcykge1xuICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlTmV4dCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogTE1TR2V0VmFsdWUgZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXRWYWx1ZShDTUlFbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUoJ0xNU0dldFZhbHVlJywgZmFsc2UsIENNSUVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIExNU1NldFZhbHVlIGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNTZXRWYWx1ZShDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnNldFZhbHVlKCdMTVNTZXRWYWx1ZScsIGZhbHNlLCBDTUlFbGVtZW50LCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogTE1TQ29tbWl0IGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSBib29sXG4gICAqL1xuICBsbXNDb21taXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29tbWl0KCdMTVNDb21taXQnLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogTE1TR2V0TGFzdEVycm9yIGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zR2V0TGFzdEVycm9yKCkge1xuICAgIHJldHVybiB0aGlzLmdldExhc3RFcnJvcignTE1TR2V0TGFzdEVycm9yJyk7XG4gIH1cblxuICAvKipcbiAgICogTE1TR2V0RXJyb3JTdHJpbmcgZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRXJyb3JDb2RlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc0dldEVycm9yU3RyaW5nKENNSUVycm9yQ29kZSkge1xuICAgIHJldHVybiB0aGlzLmdldEVycm9yU3RyaW5nKCdMTVNHZXRFcnJvclN0cmluZycsIENNSUVycm9yQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogTE1TR2V0RGlhZ25vc3RpYyBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFcnJvckNvZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zR2V0RGlhZ25vc3RpYyhDTUlFcnJvckNvZGUpIHtcbiAgICByZXR1cm4gdGhpcy5nZXREaWFnbm9zdGljKCdMTVNHZXREaWFnbm9zdGljJywgQ01JRXJyb3JDb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGEgdmFsdWUgb24gdGhlIENNSSBPYmplY3RcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBzZXRDTUlWYWx1ZShDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9jb21tb25TZXRDTUlWYWx1ZSgnTE1TU2V0VmFsdWUnLCBmYWxzZSwgQ01JRWxlbWVudCwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSB2YWx1ZSBmcm9tIHRoZSBDTUkgT2JqZWN0XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXRDTUlWYWx1ZShDTUlFbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbW1vbkdldENNSVZhbHVlKCdnZXRDTUlWYWx1ZScsIGZhbHNlLCBDTUlFbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIG9yIGJ1aWxkcyBhIG5ldyBjaGlsZCBlbGVtZW50IHRvIGFkZCB0byB0aGUgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHBhcmFtIHtib29sZWFufSBmb3VuZEZpcnN0SW5kZXhcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cbiAgZ2V0Q2hpbGRFbGVtZW50KENNSUVsZW1lbnQsIHZhbHVlLCBmb3VuZEZpcnN0SW5kZXgpIHtcbiAgICBsZXQgbmV3Q2hpbGQ7XG5cbiAgICBpZiAodGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsICdjbWlcXFxcLm9iamVjdGl2ZXNcXFxcLlxcXFxkJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSU9iamVjdGl2ZXNPYmplY3QoKTtcbiAgICB9IGVsc2UgaWYgKGZvdW5kRmlyc3RJbmRleCAmJiB0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCxcbiAgICAgICAgJ2NtaVxcXFwuaW50ZXJhY3Rpb25zXFxcXC5cXFxcZFxcXFwuY29ycmVjdF9yZXNwb25zZXNcXFxcLlxcXFxkJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSUludGVyYWN0aW9uc0NvcnJlY3RSZXNwb25zZXNPYmplY3QoKTtcbiAgICB9IGVsc2UgaWYgKGZvdW5kRmlyc3RJbmRleCAmJiB0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCxcbiAgICAgICAgJ2NtaVxcXFwuaW50ZXJhY3Rpb25zXFxcXC5cXFxcZFxcXFwub2JqZWN0aXZlc1xcXFwuXFxcXGQnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JSW50ZXJhY3Rpb25zT2JqZWN0aXZlc09iamVjdCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsICdjbWlcXFxcLmludGVyYWN0aW9uc1xcXFwuXFxcXGQnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JSW50ZXJhY3Rpb25zT2JqZWN0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0NoaWxkO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlcyBDb3JyZWN0IFJlc3BvbnNlIHZhbHVlc1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICB2YWxpZGF0ZUNvcnJlY3RSZXNwb25zZShDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1lc3NhZ2UgdGhhdCBjb3JyZXNwb25kcyB0byBlcnJvck51bWJlci5cbiAgICpcbiAgICogQHBhcmFtIHsqfSBlcnJvck51bWJlclxuICAgKiBAcGFyYW0ge2Jvb2xlYW4gfWRldGFpbFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXRMbXNFcnJvck1lc3NhZ2VEZXRhaWxzKGVycm9yTnVtYmVyLCBkZXRhaWwpIHtcbiAgICBsZXQgYmFzaWNNZXNzYWdlID0gJ05vIEVycm9yJztcbiAgICBsZXQgZGV0YWlsTWVzc2FnZSA9ICdObyBFcnJvcic7XG5cbiAgICAvLyBTZXQgZXJyb3IgbnVtYmVyIHRvIHN0cmluZyBzaW5jZSBpbmNvbnNpc3RlbnQgZnJvbSBtb2R1bGVzIGlmIHN0cmluZyBvciBudW1iZXJcbiAgICBlcnJvck51bWJlciA9IFN0cmluZyhlcnJvck51bWJlcik7XG4gICAgaWYgKGNvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbZXJyb3JOdW1iZXJdKSB7XG4gICAgICBiYXNpY01lc3NhZ2UgPSBjb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW2Vycm9yTnVtYmVyXS5iYXNpY01lc3NhZ2U7XG4gICAgICBkZXRhaWxNZXNzYWdlID0gY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tlcnJvck51bWJlcl0uZGV0YWlsTWVzc2FnZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGV0YWlsID8gZGV0YWlsTWVzc2FnZSA6IGJhc2ljTWVzc2FnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIHRoZSB3aG9sZSBBUEkgd2l0aCBhbm90aGVyXG4gICAqXG4gICAqIEBwYXJhbSB7U2Nvcm0xMkFQSX0gbmV3QVBJXG4gICAqL1xuICByZXBsYWNlV2l0aEFub3RoZXJTY29ybUFQSShuZXdBUEkpIHtcbiAgICAvLyBEYXRhIE1vZGVsXG4gICAgdGhpcy5jbWkgPSBuZXdBUEkuY21pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgY21pIG9iamVjdCB0byB0aGUgcHJvcGVyIGZvcm1hdCBmb3IgTE1TIGNvbW1pdFxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHRlcm1pbmF0ZUNvbW1pdFxuICAgKiBAcmV0dXJuIHtvYmplY3R8QXJyYXl9XG4gICAqL1xuICByZW5kZXJDb21taXRDTUkodGVybWluYXRlQ29tbWl0OiBib29sZWFuKSB7XG4gICAgY29uc3QgY21pRXhwb3J0ID0gdGhpcy5yZW5kZXJDTUlUb0pTT05PYmplY3QoKTtcblxuICAgIGlmICh0ZXJtaW5hdGVDb21taXQpIHtcbiAgICAgIGNtaUV4cG9ydC5jbWkuY29yZS50b3RhbF90aW1lID0gdGhpcy5jbWkuZ2V0Q3VycmVudFRvdGFsVGltZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgIGNvbnN0IGZsYXR0ZW5lZCA9IFV0aWxpdGllcy5mbGF0dGVuKGNtaUV4cG9ydCk7XG4gICAgc3dpdGNoICh0aGlzLnNldHRpbmdzLmRhdGFDb21taXRGb3JtYXQpIHtcbiAgICAgIGNhc2UgJ2ZsYXR0ZW5lZCc6XG4gICAgICAgIHJldHVybiBVdGlsaXRpZXMuZmxhdHRlbihjbWlFeHBvcnQpO1xuICAgICAgY2FzZSAncGFyYW1zJzpcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIGluIGZsYXR0ZW5lZCkge1xuICAgICAgICAgIGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGZsYXR0ZW5lZCwgaXRlbSkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGAke2l0ZW19PSR7ZmxhdHRlbmVkW2l0ZW1dfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgY2FzZSAnanNvbic6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gY21pRXhwb3J0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0cyB0byBzdG9yZSB0aGUgZGF0YSB0byB0aGUgTE1TXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdGVybWluYXRlQ29tbWl0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHN0b3JlRGF0YSh0ZXJtaW5hdGVDb21taXQ6IGJvb2xlYW4pIHtcbiAgICBpZiAodGVybWluYXRlQ29tbWl0KSB7XG4gICAgICBjb25zdCBvcmlnaW5hbFN0YXR1cyA9IHRoaXMuY21pLmNvcmUubGVzc29uX3N0YXR1cztcbiAgICAgIGlmIChvcmlnaW5hbFN0YXR1cyA9PT0gJ25vdCBhdHRlbXB0ZWQnKSB7XG4gICAgICAgIHRoaXMuY21pLmNvcmUubGVzc29uX3N0YXR1cyA9ICdjb21wbGV0ZWQnO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5jbWkuY29yZS5sZXNzb25fbW9kZSA9PT0gJ25vcm1hbCcpIHtcbiAgICAgICAgaWYgKHRoaXMuY21pLmNvcmUuY3JlZGl0ID09PSAnY3JlZGl0Jykge1xuICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLm1hc3Rlcnlfb3ZlcnJpZGUgJiZcbiAgICAgICAgICAgICAgdGhpcy5jbWkuc3R1ZGVudF9kYXRhLm1hc3Rlcnlfc2NvcmUgIT09ICcnICYmXG4gICAgICAgICAgICAgIHRoaXMuY21pLmNvcmUuc2NvcmUucmF3ICE9PSAnJykge1xuICAgICAgICAgICAgaWYgKHBhcnNlRmxvYXQodGhpcy5jbWkuY29yZS5zY29yZS5yYXcpID49XG4gICAgICAgICAgICAgICAgcGFyc2VGbG9hdCh0aGlzLmNtaS5zdHVkZW50X2RhdGEubWFzdGVyeV9zY29yZSkpIHtcbiAgICAgICAgICAgICAgdGhpcy5jbWkuY29yZS5sZXNzb25fc3RhdHVzID0gJ3Bhc3NlZCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLmNtaS5jb3JlLmxlc3Nvbl9zdGF0dXMgPSAnZmFpbGVkJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jbWkuY29yZS5sZXNzb25fbW9kZSA9PT0gJ2Jyb3dzZScpIHtcbiAgICAgICAgaWYgKCh0aGlzLnN0YXJ0aW5nRGF0YT8uY21pPy5jb3JlPy5sZXNzb25fc3RhdHVzIHx8ICcnKSA9PT0gJycgJiZcbiAgICAgICAgICAgIG9yaWdpbmFsU3RhdHVzID09PSAnbm90IGF0dGVtcHRlZCcpIHtcbiAgICAgICAgICB0aGlzLmNtaS5jb3JlLmxlc3Nvbl9zdGF0dXMgPSAnYnJvd3NlZCc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBjb21taXRPYmplY3QgPSB0aGlzLnJlbmRlckNvbW1pdENNSSh0ZXJtaW5hdGVDb21taXQpO1xuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MubG1zQ29tbWl0VXJsKSB7XG4gICAgICBpZiAodGhpcy5hcGlMb2dMZXZlbCA9PT0gZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfREVCVUcpIHtcbiAgICAgICAgY29uc29sZS5kZWJ1ZygnQ29tbWl0ICh0ZXJtaW5hdGVkOiAnICtcbiAgICAgICAgICAgICh0ZXJtaW5hdGVDb21taXQgPyAneWVzJyA6ICdubycpICsgJyk6ICcpO1xuICAgICAgICBjb25zb2xlLmRlYnVnKGNvbW1pdE9iamVjdCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5wcm9jZXNzSHR0cFJlcXVlc3QodGhpcy5zZXR0aW5ncy5sbXNDb21taXRVcmwsIGNvbW1pdE9iamVjdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdDb21taXQgKHRlcm1pbmF0ZWQ6ICcgK1xuICAgICAgICAgICh0ZXJtaW5hdGVDb21taXQgPyAneWVzJyA6ICdubycpICsgJyk6ICcpO1xuICAgICAgY29uc29sZS5sb2coY29tbWl0T2JqZWN0KTtcbiAgICAgIHJldHVybiBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUU7XG4gICAgfVxuICB9XG59XG4iLCIvLyBAZmxvd1xuaW1wb3J0IEJhc2VBUEkgZnJvbSAnLi9CYXNlQVBJJztcbmltcG9ydCB7XG4gIEFETCxcbiAgQ01JLFxuICBDTUlDb21tZW50c09iamVjdCxcbiAgQ01JSW50ZXJhY3Rpb25zQ29ycmVjdFJlc3BvbnNlc09iamVjdCxcbiAgQ01JSW50ZXJhY3Rpb25zT2JqZWN0LFxuICBDTUlJbnRlcmFjdGlvbnNPYmplY3RpdmVzT2JqZWN0LFxuICBDTUlPYmplY3RpdmVzT2JqZWN0LFxufSBmcm9tICcuL2NtaS9zY29ybTIwMDRfY21pJztcbmltcG9ydCAqIGFzIFV0aWxpdGllcyBmcm9tICcuL3V0aWxpdGllcyc7XG5pbXBvcnQge2dsb2JhbF9jb25zdGFudHMsIHNjb3JtMjAwNF9jb25zdGFudHN9IGZyb20gJy4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuaW1wb3J0IHtzY29ybTIwMDRfZXJyb3JfY29kZXN9IGZyb20gJy4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJztcbmltcG9ydCB7Y29ycmVjdF9yZXNwb25zZXN9IGZyb20gJy4vY29uc3RhbnRzL3Jlc3BvbnNlX2NvbnN0YW50cyc7XG5pbXBvcnQge3ZhbGlkX2xhbmd1YWdlc30gZnJvbSAnLi9jb25zdGFudHMvbGFuZ3VhZ2VfY29uc3RhbnRzJztcbmltcG9ydCB7c2Nvcm0yMDA0X3JlZ2V4fSBmcm9tICcuL2NvbnN0YW50cy9yZWdleCc7XG5cbmNvbnN0IGNvbnN0YW50cyA9IHNjb3JtMjAwNF9jb25zdGFudHM7XG5cbi8qKlxuICogQVBJIGNsYXNzIGZvciBTQ09STSAyMDA0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjb3JtMjAwNEFQSSBleHRlbmRzIEJhc2VBUEkge1xuICAjdmVyc2lvbjogJzEuMCc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBTQ09STSAyMDA0IEFQSVxuICAgKiBAcGFyYW0ge29iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiB7fSkge1xuICAgIGNvbnN0IGZpbmFsU2V0dGluZ3MgPSB7XG4gICAgICAuLi57XG4gICAgICAgIG1hc3Rlcnlfb3ZlcnJpZGU6IGZhbHNlLFxuICAgICAgfSwgLi4uc2V0dGluZ3MsXG4gICAgfTtcblxuICAgIHN1cGVyKHNjb3JtMjAwNF9lcnJvcl9jb2RlcywgZmluYWxTZXR0aW5ncyk7XG5cbiAgICB0aGlzLmNtaSA9IG5ldyBDTUkoKTtcbiAgICB0aGlzLmFkbCA9IG5ldyBBREwoKTtcblxuICAgIC8vIFJlbmFtZSBmdW5jdGlvbnMgdG8gbWF0Y2ggMjAwNCBTcGVjIGFuZCBleHBvc2UgdG8gbW9kdWxlc1xuICAgIHRoaXMuSW5pdGlhbGl6ZSA9IHRoaXMubG1zSW5pdGlhbGl6ZTtcbiAgICB0aGlzLlRlcm1pbmF0ZSA9IHRoaXMubG1zVGVybWluYXRlO1xuICAgIHRoaXMuR2V0VmFsdWUgPSB0aGlzLmxtc0dldFZhbHVlO1xuICAgIHRoaXMuU2V0VmFsdWUgPSB0aGlzLmxtc1NldFZhbHVlO1xuICAgIHRoaXMuQ29tbWl0ID0gdGhpcy5sbXNDb21taXQ7XG4gICAgdGhpcy5HZXRMYXN0RXJyb3IgPSB0aGlzLmxtc0dldExhc3RFcnJvcjtcbiAgICB0aGlzLkdldEVycm9yU3RyaW5nID0gdGhpcy5sbXNHZXRFcnJvclN0cmluZztcbiAgICB0aGlzLkdldERpYWdub3N0aWMgPSB0aGlzLmxtc0dldERpYWdub3N0aWM7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdmVyc2lvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdmVyc2lvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jdmVyc2lvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJvb2xcbiAgICovXG4gIGxtc0luaXRpYWxpemUoKSB7XG4gICAgdGhpcy5jbWkuaW5pdGlhbGl6ZSgpO1xuICAgIHJldHVybiB0aGlzLmluaXRpYWxpemUoJ0luaXRpYWxpemUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJvb2xcbiAgICovXG4gIGxtc1Rlcm1pbmF0ZSgpIHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLnRlcm1pbmF0ZSgnVGVybWluYXRlJywgdHJ1ZSk7XG5cbiAgICBpZiAocmVzdWx0ID09PSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUUpIHtcbiAgICAgIGlmICh0aGlzLmFkbC5uYXYucmVxdWVzdCAhPT0gJ19ub25lXycpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLmFkbC5uYXYucmVxdWVzdCkge1xuICAgICAgICAgIGNhc2UgJ2NvbnRpbnVlJzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VOZXh0Jyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdwcmV2aW91cyc6XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlUHJldmlvdXMnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2Nob2ljZSc6XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlQ2hvaWNlJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdleGl0JzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VFeGl0Jyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdleGl0QWxsJzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VFeGl0QWxsJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdhYmFuZG9uJzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VBYmFuZG9uJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdhYmFuZG9uQWxsJzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VBYmFuZG9uQWxsJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLmF1dG9Qcm9ncmVzcykge1xuICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlTmV4dCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zR2V0VmFsdWUoQ01JRWxlbWVudCkge1xuICAgIHJldHVybiB0aGlzLmdldFZhbHVlKCdHZXRWYWx1ZScsIHRydWUsIENNSUVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNTZXRWYWx1ZShDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnNldFZhbHVlKCdTZXRWYWx1ZScsIHRydWUsIENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcmRlcnMgTE1TIHRvIHN0b3JlIGFsbCBjb250ZW50IHBhcmFtZXRlcnNcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSBib29sXG4gICAqL1xuICBsbXNDb21taXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29tbWl0KCdDb21taXQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGxhc3QgZXJyb3IgY29kZVxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXRMYXN0RXJyb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TGFzdEVycm9yKCdHZXRMYXN0RXJyb3InKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBlcnJvck51bWJlciBlcnJvciBkZXNjcmlwdGlvblxuICAgKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gQ01JRXJyb3JDb2RlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc0dldEVycm9yU3RyaW5nKENNSUVycm9yQ29kZSkge1xuICAgIHJldHVybiB0aGlzLmdldEVycm9yU3RyaW5nKCdHZXRFcnJvclN0cmluZycsIENNSUVycm9yQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGNvbXByZWhlbnNpdmUgZGVzY3JpcHRpb24gb2YgdGhlIGVycm9yTnVtYmVyIGVycm9yLlxuICAgKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gQ01JRXJyb3JDb2RlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc0dldERpYWdub3N0aWMoQ01JRXJyb3JDb2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RGlhZ25vc3RpYygnR2V0RGlhZ25vc3RpYycsIENNSUVycm9yQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhIHZhbHVlIG9uIHRoZSBDTUkgT2JqZWN0XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBzZXRDTUlWYWx1ZShDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9jb21tb25TZXRDTUlWYWx1ZSgnU2V0VmFsdWUnLCB0cnVlLCBDTUlFbGVtZW50LCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBvciBidWlsZHMgYSBuZXcgY2hpbGQgZWxlbWVudCB0byBhZGQgdG8gdGhlIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICogQHBhcmFtIHtib29sZWFufSBmb3VuZEZpcnN0SW5kZXhcbiAgICogQHJldHVybiB7YW55fVxuICAgKi9cbiAgZ2V0Q2hpbGRFbGVtZW50KENNSUVsZW1lbnQsIHZhbHVlLCBmb3VuZEZpcnN0SW5kZXgpIHtcbiAgICBsZXQgbmV3Q2hpbGQ7XG5cbiAgICBpZiAodGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsICdjbWlcXFxcLm9iamVjdGl2ZXNcXFxcLlxcXFxkJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSU9iamVjdGl2ZXNPYmplY3QoKTtcbiAgICB9IGVsc2UgaWYgKGZvdW5kRmlyc3RJbmRleCAmJiB0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCxcbiAgICAgICAgJ2NtaVxcXFwuaW50ZXJhY3Rpb25zXFxcXC5cXFxcZFxcXFwuY29ycmVjdF9yZXNwb25zZXNcXFxcLlxcXFxkJykpIHtcbiAgICAgIGNvbnN0IHBhcnRzID0gQ01JRWxlbWVudC5zcGxpdCgnLicpO1xuICAgICAgY29uc3QgaW5kZXggPSBOdW1iZXIocGFydHNbMl0pO1xuICAgICAgY29uc3QgaW50ZXJhY3Rpb24gPSB0aGlzLmNtaS5pbnRlcmFjdGlvbnMuY2hpbGRBcnJheVtpbmRleF07XG4gICAgICBpZiAodHlwZW9mIGludGVyYWN0aW9uLnR5cGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5ERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBpbnRlcmFjdGlvbl90eXBlID0gaW50ZXJhY3Rpb24udHlwZTtcbiAgICAgICAgY29uc3QgaW50ZXJhY3Rpb25fY291bnQgPSBpbnRlcmFjdGlvbi5jb3JyZWN0X3Jlc3BvbnNlcy5fY291bnQ7XG4gICAgICAgIGlmIChpbnRlcmFjdGlvbl90eXBlID09PSAnY2hvaWNlJykge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW50ZXJhY3Rpb25fY291bnQgJiYgdGhpcy5sYXN0RXJyb3JDb2RlID09PVxuICAgICAgICAgIDA7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBpbnRlcmFjdGlvbi5jb3JyZWN0X3Jlc3BvbnNlcy5jaGlsZEFycmF5W2ldO1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnBhdHRlcm4gPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5HRU5FUkFMX1NFVF9GQUlMVVJFKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXNwb25zZV90eXBlID0gY29ycmVjdF9yZXNwb25zZXNbaW50ZXJhY3Rpb25fdHlwZV07XG4gICAgICAgIGxldCBub2RlcyA9IFtdO1xuICAgICAgICBpZiAocmVzcG9uc2VfdHlwZS5kZWxpbWl0ZXIgIT09ICcnKSB7XG4gICAgICAgICAgbm9kZXMgPSBTdHJpbmcodmFsdWUpLnNwbGl0KHJlc3BvbnNlX3R5cGUuZGVsaW1pdGVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub2Rlc1swXSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5vZGVzLmxlbmd0aCA+IDAgJiYgbm9kZXMubGVuZ3RoIDw9IHJlc3BvbnNlX3R5cGUubWF4KSB7XG4gICAgICAgICAgdGhpcy5jaGVja0NvcnJlY3RSZXNwb25zZVZhbHVlKGludGVyYWN0aW9uX3R5cGUsIG5vZGVzLCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZXMubGVuZ3RoID4gcmVzcG9uc2VfdHlwZS5tYXgpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuR0VORVJBTF9TRVRfRkFJTFVSRSxcbiAgICAgICAgICAgICAgJ0RhdGEgTW9kZWwgRWxlbWVudCBQYXR0ZXJuIFRvbyBMb25nJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmxhc3RFcnJvckNvZGUgPT09IDApIHtcbiAgICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JSW50ZXJhY3Rpb25zQ29ycmVjdFJlc3BvbnNlc09iamVjdCgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZm91bmRGaXJzdEluZGV4ICYmIHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LFxuICAgICAgICAnY21pXFxcXC5pbnRlcmFjdGlvbnNcXFxcLlxcXFxkXFxcXC5vYmplY3RpdmVzXFxcXC5cXFxcZCcpKSB7XG4gICAgICBuZXdDaGlsZCA9IG5ldyBDTUlJbnRlcmFjdGlvbnNPYmplY3RpdmVzT2JqZWN0KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ2NtaVxcXFwuaW50ZXJhY3Rpb25zXFxcXC5cXFxcZCcpKSB7XG4gICAgICBuZXdDaGlsZCA9IG5ldyBDTUlJbnRlcmFjdGlvbnNPYmplY3QoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LFxuICAgICAgICAnY21pXFxcXC5jb21tZW50c19mcm9tX2xlYXJuZXJcXFxcLlxcXFxkJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSUNvbW1lbnRzT2JqZWN0KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCxcbiAgICAgICAgJ2NtaVxcXFwuY29tbWVudHNfZnJvbV9sbXNcXFxcLlxcXFxkJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSUNvbW1lbnRzT2JqZWN0KHRydWUpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXdDaGlsZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZSBjb3JyZWN0IHJlc3BvbnNlLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqL1xuICB2YWxpZGF0ZUNvcnJlY3RSZXNwb25zZShDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgIGNvbnN0IHBhcnRzID0gQ01JRWxlbWVudC5zcGxpdCgnLicpO1xuICAgIGNvbnN0IGluZGV4ID0gTnVtYmVyKHBhcnRzWzJdKTtcbiAgICBjb25zdCBwYXR0ZXJuX2luZGV4ID0gTnVtYmVyKHBhcnRzWzRdKTtcbiAgICBjb25zdCBpbnRlcmFjdGlvbiA9IHRoaXMuY21pLmludGVyYWN0aW9ucy5jaGlsZEFycmF5W2luZGV4XTtcblxuICAgIGNvbnN0IGludGVyYWN0aW9uX3R5cGUgPSBpbnRlcmFjdGlvbi50eXBlO1xuICAgIGNvbnN0IGludGVyYWN0aW9uX2NvdW50ID0gaW50ZXJhY3Rpb24uY29ycmVjdF9yZXNwb25zZXMuX2NvdW50O1xuICAgIGlmIChpbnRlcmFjdGlvbl90eXBlID09PSAnY2hvaWNlJykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnRlcmFjdGlvbl9jb3VudCAmJiB0aGlzLmxhc3RFcnJvckNvZGUgPT09IDA7IGkrKykge1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGludGVyYWN0aW9uLmNvcnJlY3RfcmVzcG9uc2VzLmNoaWxkQXJyYXlbaV07XG4gICAgICAgIGlmIChyZXNwb25zZS5wYXR0ZXJuID09PSB2YWx1ZSkge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5HRU5FUkFMX1NFVF9GQUlMVVJFKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHJlc3BvbnNlX3R5cGUgPSBzY29ybTIwMDRfY29uc3RhbnRzLmNvcnJlY3RfcmVzcG9uc2VzW2ludGVyYWN0aW9uX3R5cGVdO1xuICAgIGlmICh0eXBlb2YgcmVzcG9uc2VfdHlwZS5saW1pdCAhPT0gJ3VuZGVmaW5lZCcgfHwgaW50ZXJhY3Rpb25fY291bnQgPFxuICAgICAgICByZXNwb25zZV90eXBlLmxpbWl0KSB7XG4gICAgICBsZXQgbm9kZXMgPSBbXTtcbiAgICAgIGlmIChyZXNwb25zZV90eXBlLmRlbGltaXRlciAhPT0gJycpIHtcbiAgICAgICAgbm9kZXMgPSBTdHJpbmcodmFsdWUpLnNwbGl0KHJlc3BvbnNlX3R5cGUuZGVsaW1pdGVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGVzWzBdID0gdmFsdWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChub2Rlcy5sZW5ndGggPiAwICYmIG5vZGVzLmxlbmd0aCA8PSByZXNwb25zZV90eXBlLm1heCkge1xuICAgICAgICB0aGlzLmNoZWNrQ29ycmVjdFJlc3BvbnNlVmFsdWUoaW50ZXJhY3Rpb25fdHlwZSwgbm9kZXMsIHZhbHVlKTtcbiAgICAgIH0gZWxzZSBpZiAobm9kZXMubGVuZ3RoID4gcmVzcG9uc2VfdHlwZS5tYXgpIHtcbiAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUsXG4gICAgICAgICAgICAnRGF0YSBNb2RlbCBFbGVtZW50IFBhdHRlcm4gVG9vIExvbmcnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMubGFzdEVycm9yQ29kZSA9PT0gMCAmJlxuICAgICAgICAgICghcmVzcG9uc2VfdHlwZS5kdXBsaWNhdGUgfHxcbiAgICAgICAgICAgICAgIXRoaXMuY2hlY2tEdXBsaWNhdGVkUGF0dGVybihpbnRlcmFjdGlvbi5jb3JyZWN0X3Jlc3BvbnNlcyxcbiAgICAgICAgICAgICAgICAgIHBhdHRlcm5faW5kZXgsIHZhbHVlKSkgfHxcbiAgICAgICAgICAodGhpcy5sYXN0RXJyb3JDb2RlID09PSAwICYmIHZhbHVlID09PSAnJykpIHtcbiAgICAgICAgLy8gZG8gbm90aGluZywgd2Ugd2FudCB0aGUgaW52ZXJzZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMubGFzdEVycm9yQ29kZSA9PT0gMCkge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5HRU5FUkFMX1NFVF9GQUlMVVJFLFxuICAgICAgICAgICAgICAnRGF0YSBNb2RlbCBFbGVtZW50IFBhdHRlcm4gQWxyZWFkeSBFeGlzdHMnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuR0VORVJBTF9TRVRfRkFJTFVSRSxcbiAgICAgICAgICAnRGF0YSBNb2RlbCBFbGVtZW50IENvbGxlY3Rpb24gTGltaXQgUmVhY2hlZCcpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgdmFsdWUgZnJvbSB0aGUgQ01JIE9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0Q01JVmFsdWUoQ01JRWxlbWVudCkge1xuICAgIHJldHVybiB0aGlzLl9jb21tb25HZXRDTUlWYWx1ZSgnR2V0VmFsdWUnLCB0cnVlLCBDTUlFbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtZXNzYWdlIHRoYXQgY29ycmVzcG9uZHMgdG8gZXJyb3JOdW1iZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXIpfSBlcnJvck51bWJlclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGRldGFpbFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXRMbXNFcnJvck1lc3NhZ2VEZXRhaWxzKGVycm9yTnVtYmVyLCBkZXRhaWwpIHtcbiAgICBsZXQgYmFzaWNNZXNzYWdlID0gJyc7XG4gICAgbGV0IGRldGFpbE1lc3NhZ2UgPSAnJztcblxuICAgIC8vIFNldCBlcnJvciBudW1iZXIgdG8gc3RyaW5nIHNpbmNlIGluY29uc2lzdGVudCBmcm9tIG1vZHVsZXMgaWYgc3RyaW5nIG9yIG51bWJlclxuICAgIGVycm9yTnVtYmVyID0gU3RyaW5nKGVycm9yTnVtYmVyKTtcbiAgICBpZiAoY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tlcnJvck51bWJlcl0pIHtcbiAgICAgIGJhc2ljTWVzc2FnZSA9IGNvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbZXJyb3JOdW1iZXJdLmJhc2ljTWVzc2FnZTtcbiAgICAgIGRldGFpbE1lc3NhZ2UgPSBjb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW2Vycm9yTnVtYmVyXS5kZXRhaWxNZXNzYWdlO1xuICAgIH1cblxuICAgIHJldHVybiBkZXRhaWwgPyBkZXRhaWxNZXNzYWdlIDogYmFzaWNNZXNzYWdlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHRvIHNlZSBpZiBhIGNvcnJlY3RfcmVzcG9uc2UgdmFsdWUgaGFzIGJlZW4gZHVwbGljYXRlZFxuICAgKiBAcGFyYW0ge0NNSUFycmF5fSBjb3JyZWN0X3Jlc3BvbnNlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBjdXJyZW50X2luZGV4XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGNoZWNrRHVwbGljYXRlZFBhdHRlcm4gPSAoY29ycmVjdF9yZXNwb25zZSwgY3VycmVudF9pbmRleCwgdmFsdWUpID0+IHtcbiAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICBjb25zdCBjb3VudCA9IGNvcnJlY3RfcmVzcG9uc2UuX2NvdW50O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQgJiYgIWZvdW5kOyBpKyspIHtcbiAgICAgIGlmIChpICE9PSBjdXJyZW50X2luZGV4ICYmIGNvcnJlY3RfcmVzcG9uc2UuY2hpbGRBcnJheVtpXSA9PT0gdmFsdWUpIHtcbiAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZm91bmQ7XG4gIH07XG5cbiAgLyoqXG4gICAqIENoZWNrcyBmb3IgYSB2YWxpZCBjb3JyZWN0X3Jlc3BvbnNlIHZhbHVlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpbnRlcmFjdGlvbl90eXBlXG4gICAqIEBwYXJhbSB7QXJyYXl9IG5vZGVzXG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICovXG4gIGNoZWNrQ29ycmVjdFJlc3BvbnNlVmFsdWUoaW50ZXJhY3Rpb25fdHlwZSwgbm9kZXMsIHZhbHVlKSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBjb3JyZWN0X3Jlc3BvbnNlc1tpbnRlcmFjdGlvbl90eXBlXTtcbiAgICBjb25zdCBmb3JtYXRSZWdleCA9IG5ldyBSZWdFeHAocmVzcG9uc2UuZm9ybWF0KTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aCAmJiB0aGlzLmxhc3RFcnJvckNvZGUgPT09IDA7IGkrKykge1xuICAgICAgaWYgKGludGVyYWN0aW9uX3R5cGUubWF0Y2goXG4gICAgICAgICAgJ14oZmlsbC1pbnxsb25nLWZpbGwtaW58bWF0Y2hpbmd8cGVyZm9ybWFuY2V8c2VxdWVuY2luZykkJykpIHtcbiAgICAgICAgbm9kZXNbaV0gPSB0aGlzLnJlbW92ZUNvcnJlY3RSZXNwb25zZVByZWZpeGVzKG5vZGVzW2ldKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3BvbnNlLmRlbGltaXRlcjIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCB2YWx1ZXMgPSBub2Rlc1tpXS5zcGxpdChyZXNwb25zZS5kZWxpbWl0ZXIyKTtcbiAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICBjb25zdCBtYXRjaGVzID0gdmFsdWVzWzBdLm1hdGNoKGZvcm1hdFJlZ2V4KTtcbiAgICAgICAgICBpZiAoIW1hdGNoZXMpIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF2YWx1ZXNbMV0ubWF0Y2gobmV3IFJlZ0V4cChyZXNwb25zZS5mb3JtYXQyKSkpIHtcbiAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG1hdGNoZXMgPSBub2Rlc1tpXS5tYXRjaChmb3JtYXRSZWdleCk7XG4gICAgICAgIGlmICgoIW1hdGNoZXMgJiYgdmFsdWUgIT09ICcnKSB8fFxuICAgICAgICAgICAgKCFtYXRjaGVzICYmIGludGVyYWN0aW9uX3R5cGUgPT09ICd0cnVlLWZhbHNlJykpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGludGVyYWN0aW9uX3R5cGUgPT09ICdudW1lcmljJyAmJiBub2Rlcy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBpZiAoTnVtYmVyKG5vZGVzWzBdKSA+IE51bWJlcihub2Rlc1sxXSkpIHtcbiAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobm9kZXNbaV0gIT09ICcnICYmIHJlc3BvbnNlLnVuaXF1ZSkge1xuICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGkgJiYgdGhpcy5sYXN0RXJyb3JDb2RlID09PSAwOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZXNbaV0gPT09IG5vZGVzW2pdKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBwcmVmaXhlcyBmcm9tIGNvcnJlY3RfcmVzcG9uc2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5vZGVcbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIHJlbW92ZUNvcnJlY3RSZXNwb25zZVByZWZpeGVzKG5vZGUpIHtcbiAgICBsZXQgc2Vlbk9yZGVyID0gZmFsc2U7XG4gICAgbGV0IHNlZW5DYXNlID0gZmFsc2U7XG4gICAgbGV0IHNlZW5MYW5nID0gZmFsc2U7XG5cbiAgICBjb25zdCBwcmVmaXhSZWdleCA9IG5ldyBSZWdFeHAoXG4gICAgICAgICdeKHsobGFuZ3xjYXNlX21hdHRlcnN8b3JkZXJfbWF0dGVycyk9KFtefV0rKX0pJyk7XG4gICAgbGV0IG1hdGNoZXMgPSBub2RlLm1hdGNoKHByZWZpeFJlZ2V4KTtcbiAgICBsZXQgbGFuZ01hdGNoZXMgPSBudWxsO1xuICAgIHdoaWxlIChtYXRjaGVzKSB7XG4gICAgICBzd2l0Y2ggKG1hdGNoZXNbMl0pIHtcbiAgICAgICAgY2FzZSAnbGFuZyc6XG4gICAgICAgICAgbGFuZ01hdGNoZXMgPSBub2RlLm1hdGNoKHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nY3IpO1xuICAgICAgICAgIGlmIChsYW5nTWF0Y2hlcykge1xuICAgICAgICAgICAgY29uc3QgbGFuZyA9IGxhbmdNYXRjaGVzWzNdO1xuICAgICAgICAgICAgaWYgKGxhbmcgIT09IHVuZGVmaW5lZCAmJiBsYW5nLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgaWYgKHZhbGlkX2xhbmd1YWdlc1tsYW5nLnRvTG93ZXJDYXNlKCldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2VlbkxhbmcgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjYXNlX21hdHRlcnMnOlxuICAgICAgICAgIGlmICghc2VlbkxhbmcgJiYgIXNlZW5PcmRlciAmJiAhc2VlbkNhc2UpIHtcbiAgICAgICAgICAgIGlmIChtYXRjaGVzWzNdICE9PSAndHJ1ZScgJiYgbWF0Y2hlc1szXSAhPT0gJ2ZhbHNlJykge1xuICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2VlbkNhc2UgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdvcmRlcl9tYXR0ZXJzJzpcbiAgICAgICAgICBpZiAoIXNlZW5DYXNlICYmICFzZWVuTGFuZyAmJiAhc2Vlbk9yZGVyKSB7XG4gICAgICAgICAgICBpZiAobWF0Y2hlc1szXSAhPT0gJ3RydWUnICYmIG1hdGNoZXNbM10gIT09ICdmYWxzZScpIHtcbiAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHNlZW5PcmRlciA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBub2RlID0gbm9kZS5zdWJzdHIobWF0Y2hlc1sxXS5sZW5ndGgpO1xuICAgICAgbWF0Y2hlcyA9IG5vZGUubWF0Y2gocHJlZml4UmVnZXgpO1xuICAgIH1cblxuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgdGhlIHdob2xlIEFQSSB3aXRoIGFub3RoZXJcbiAgICogQHBhcmFtIHtTY29ybTIwMDRBUEl9IG5ld0FQSVxuICAgKi9cbiAgcmVwbGFjZVdpdGhBbm90aGVyU2Nvcm1BUEkobmV3QVBJKSB7XG4gICAgLy8gRGF0YSBNb2RlbFxuICAgIHRoaXMuY21pID0gbmV3QVBJLmNtaTtcbiAgICB0aGlzLmFkbCA9IG5ld0FQSS5hZGw7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBjbWkgb2JqZWN0IHRvIHRoZSBwcm9wZXIgZm9ybWF0IGZvciBMTVMgY29tbWl0XG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdGVybWluYXRlQ29tbWl0XG4gICAqIEByZXR1cm4ge29iamVjdHxBcnJheX1cbiAgICovXG4gIHJlbmRlckNvbW1pdENNSSh0ZXJtaW5hdGVDb21taXQ6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBjbWlFeHBvcnQgPSB0aGlzLnJlbmRlckNNSVRvSlNPTk9iamVjdCgpO1xuXG4gICAgaWYgKHRlcm1pbmF0ZUNvbW1pdCkge1xuICAgICAgY21pRXhwb3J0LmNtaS50b3RhbF90aW1lID0gdGhpcy5jbWkuZ2V0Q3VycmVudFRvdGFsVGltZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgIGNvbnN0IGZsYXR0ZW5lZCA9IFV0aWxpdGllcy5mbGF0dGVuKGNtaUV4cG9ydCk7XG4gICAgc3dpdGNoICh0aGlzLnNldHRpbmdzLmRhdGFDb21taXRGb3JtYXQpIHtcbiAgICAgIGNhc2UgJ2ZsYXR0ZW5lZCc6XG4gICAgICAgIHJldHVybiBVdGlsaXRpZXMuZmxhdHRlbihjbWlFeHBvcnQpO1xuICAgICAgY2FzZSAncGFyYW1zJzpcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIGluIGZsYXR0ZW5lZCkge1xuICAgICAgICAgIGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGZsYXR0ZW5lZCwgaXRlbSkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGAke2l0ZW19PSR7ZmxhdHRlbmVkW2l0ZW1dfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgY2FzZSAnanNvbic6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gY21pRXhwb3J0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0cyB0byBzdG9yZSB0aGUgZGF0YSB0byB0aGUgTE1TXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdGVybWluYXRlQ29tbWl0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHN0b3JlRGF0YSh0ZXJtaW5hdGVDb21taXQ6IGJvb2xlYW4pIHtcbiAgICBpZiAodGVybWluYXRlQ29tbWl0KSB7XG4gICAgICBpZiAodGhpcy5jbWkubW9kZSA9PT0gJ25vcm1hbCcpIHtcbiAgICAgICAgaWYgKHRoaXMuY21pLmNyZWRpdCA9PT0gJ2NyZWRpdCcpIHtcbiAgICAgICAgICBpZiAodGhpcy5jbWkuY29tcGxldGlvbl90aHJlc2hvbGQgJiYgdGhpcy5jbWkucHJvZ3Jlc3NfbWVhc3VyZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY21pLnByb2dyZXNzX21lYXN1cmUgPj0gdGhpcy5jbWkuY29tcGxldGlvbl90aHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgdGhpcy5jbWkuY29tcGxldGlvbl9zdGF0dXMgPSAnY29tcGxldGVkJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuY21pLmNvbXBsZXRpb25fc3RhdHVzID0gJ2luY29tcGxldGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5jbWkuc2NhbGVkX3Bhc3Npbmdfc2NvcmUgIT09IG51bGwgJiZcbiAgICAgICAgICAgICAgdGhpcy5jbWkuc2NvcmUuc2NhbGVkICE9PSAnJykge1xuICAgICAgICAgICAgaWYgKHRoaXMuY21pLnNjb3JlLnNjYWxlZCA+PSB0aGlzLmNtaS5zY2FsZWRfcGFzc2luZ19zY29yZSkge1xuICAgICAgICAgICAgICB0aGlzLmNtaS5zdWNjZXNzX3N0YXR1cyA9ICdwYXNzZWQnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5jbWkuc3VjY2Vzc19zdGF0dXMgPSAnZmFpbGVkJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgbmF2UmVxdWVzdCA9IGZhbHNlO1xuICAgIGlmICh0aGlzLmFkbC5uYXYucmVxdWVzdCAhPT0gKHRoaXMuc3RhcnRpbmdEYXRhPy5hZGw/Lm5hdj8ucmVxdWVzdCkgJiZcbiAgICAgICAgdGhpcy5hZGwubmF2LnJlcXVlc3QgIT09ICdfbm9uZV8nKSB7XG4gICAgICB0aGlzLmFkbC5uYXYucmVxdWVzdCA9IGVuY29kZVVSSUNvbXBvbmVudCh0aGlzLmFkbC5uYXYucmVxdWVzdCk7XG4gICAgICBuYXZSZXF1ZXN0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBjb25zdCBjb21taXRPYmplY3QgPSB0aGlzLnJlbmRlckNvbW1pdENNSSh0ZXJtaW5hdGVDb21taXQpO1xuXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MubG1zQ29tbWl0VXJsKSB7XG4gICAgICBpZiAodGhpcy5hcGlMb2dMZXZlbCA9PT0gZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfREVCVUcpIHtcbiAgICAgICAgY29uc29sZS5kZWJ1ZygnQ29tbWl0ICh0ZXJtaW5hdGVkOiAnICtcbiAgICAgICAgICAgICh0ZXJtaW5hdGVDb21taXQgPyAneWVzJyA6ICdubycpICsgJyk6ICcpO1xuICAgICAgICBjb25zb2xlLmRlYnVnKGNvbW1pdE9iamVjdCk7XG4gICAgICB9XG4gICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnByb2Nlc3NIdHRwUmVxdWVzdCh0aGlzLnNldHRpbmdzLmxtc0NvbW1pdFVybCxcbiAgICAgICAgICBjb21taXRPYmplY3QpO1xuICAgICAgLy8gY2hlY2sgaWYgdGhpcyBpcyBhIHNlcXVlbmNpbmcgY2FsbCwgYW5kIHRoZW4gY2FsbCB0aGUgbmVjZXNzYXJ5IEpTXG4gICAgICBpZiAobmF2UmVxdWVzdCAmJiByZXN1bHQubmF2UmVxdWVzdCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgcmVzdWx0Lm5hdlJlcXVlc3QgIT09ICcnKSB7XG4gICAgICAgIEZ1bmN0aW9uKGBcInVzZSBzdHJpY3RcIjsoKCkgPT4geyAke3Jlc3VsdC5uYXZSZXF1ZXN0fSB9KSgpYCkoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKCdDb21taXQgKHRlcm1pbmF0ZWQ6ICcgK1xuICAgICAgICAgICh0ZXJtaW5hdGVDb21taXQgPyAneWVzJyA6ICdubycpICsgJyk6ICcpO1xuICAgICAgY29uc29sZS5sb2coY29tbWl0T2JqZWN0KTtcbiAgICAgIHJldHVybiBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUU7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBTY29ybTEyQ01JIGZyb20gJy4vc2Nvcm0xMl9jbWknO1xuaW1wb3J0IHtCYXNlQ01JLCBDTUlBcnJheSwgQ01JU2NvcmV9IGZyb20gJy4vY29tbW9uJztcbmltcG9ydCB7YWljY19jb25zdGFudHN9IGZyb20gJy4uL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCB7YWljY19yZWdleH0gZnJvbSAnLi4vY29uc3RhbnRzL3JlZ2V4JztcbmltcG9ydCB7c2Nvcm0xMl9lcnJvcl9jb2Rlc30gZnJvbSAnLi4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJztcbmltcG9ydCB7XG4gIGNoZWNrMTJWYWxpZEZvcm1hdCxcbiAgdGhyb3dSZWFkT25seUVycm9yLFxuICB0aHJvd1dyaXRlT25seUVycm9yLFxufSBmcm9tICcuL3Njb3JtMTJfY21pJztcblxuY29uc3QgY29uc3RhbnRzID0gYWljY19jb25zdGFudHM7XG5jb25zdCByZWdleCA9IGFpY2NfcmVnZXg7XG5cbi8qKlxuICogQ01JIENsYXNzIGZvciBBSUNDXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUkgZXh0ZW5kcyBTY29ybTEyQ01JLkNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBDTUkgb2JqZWN0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5pdGlhbGl6ZWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKGluaXRpYWxpemVkOiBib29sZWFuKSB7XG4gICAgc3VwZXIoY29uc3RhbnRzLmNtaV9jaGlsZHJlbik7XG5cbiAgICBpZiAoaW5pdGlhbGl6ZWQpIHRoaXMuaW5pdGlhbGl6ZSgpO1xuXG4gICAgdGhpcy5zdHVkZW50X2RhdGEgPSBuZXcgQUlDQ0NNSVN0dWRlbnREYXRhKCk7XG4gICAgdGhpcy5ldmFsdWF0aW9uID0gbmV3IENNSUV2YWx1YXRpb24oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zdHVkZW50X2RhdGE/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmV2YWx1YXRpb24/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHN1c3BlbmRfZGF0YTogc3RyaW5nLFxuICAgKiAgICAgIGxhdW5jaF9kYXRhOiBzdHJpbmcsXG4gICAqICAgICAgY29tbWVudHM6IHN0cmluZyxcbiAgICogICAgICBjb21tZW50c19mcm9tX2xtczogc3RyaW5nLFxuICAgKiAgICAgIGNvcmU6IENNSUNvcmUsXG4gICAqICAgICAgb2JqZWN0aXZlczogQ01JT2JqZWN0aXZlcyxcbiAgICogICAgICBzdHVkZW50X2RhdGE6IENNSVN0dWRlbnREYXRhLFxuICAgKiAgICAgIHN0dWRlbnRfcHJlZmVyZW5jZTogQ01JU3R1ZGVudFByZWZlcmVuY2UsXG4gICAqICAgICAgaW50ZXJhY3Rpb25zOiBDTUlJbnRlcmFjdGlvbnNcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3N1c3BlbmRfZGF0YSc6IHRoaXMuc3VzcGVuZF9kYXRhLFxuICAgICAgJ2xhdW5jaF9kYXRhJzogdGhpcy5sYXVuY2hfZGF0YSxcbiAgICAgICdjb21tZW50cyc6IHRoaXMuY29tbWVudHMsXG4gICAgICAnY29tbWVudHNfZnJvbV9sbXMnOiB0aGlzLmNvbW1lbnRzX2Zyb21fbG1zLFxuICAgICAgJ2NvcmUnOiB0aGlzLmNvcmUsXG4gICAgICAnb2JqZWN0aXZlcyc6IHRoaXMub2JqZWN0aXZlcyxcbiAgICAgICdzdHVkZW50X2RhdGEnOiB0aGlzLnN0dWRlbnRfZGF0YSxcbiAgICAgICdzdHVkZW50X3ByZWZlcmVuY2UnOiB0aGlzLnN0dWRlbnRfcHJlZmVyZW5jZSxcbiAgICAgICdpbnRlcmFjdGlvbnMnOiB0aGlzLmludGVyYWN0aW9ucyxcbiAgICAgICdldmFsdWF0aW9uJzogdGhpcy5ldmFsdWF0aW9uLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQUlDQyBFdmFsdWF0aW9uIG9iamVjdFxuICovXG5jbGFzcyBDTUlFdmFsdWF0aW9uIGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBFdmFsdWF0aW9uIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuY29tbWVudHMgPSBuZXcgQ01JRXZhbHVhdGlvbkNvbW1lbnRzKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuY29tbWVudHM/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5ldmFsdWF0aW9uIG9iamVjdFxuICAgKiBAcmV0dXJuIHt7Y29tbWVudHM6IENNSUV2YWx1YXRpb25Db21tZW50c319XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnY29tbWVudHMnOiB0aGlzLmNvbW1lbnRzLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIEFJQ0MncyBjbWkuZXZhbHVhdGlvbi5jb21tZW50cyBvYmplY3RcbiAqL1xuY2xhc3MgQ01JRXZhbHVhdGlvbkNvbW1lbnRzIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEFJQ0MgRXZhbHVhdGlvbiBDb21tZW50cyBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKGNvbnN0YW50cy5jb21tZW50c19jaGlsZHJlbixcbiAgICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSk7XG4gIH1cbn1cblxuLyoqXG4gKiBTdHVkZW50RGF0YSBjbGFzcyBmb3IgQUlDQ1xuICovXG5jbGFzcyBBSUNDQ01JU3R1ZGVudERhdGEgZXh0ZW5kcyBTY29ybTEyQ01JLkNNSVN0dWRlbnREYXRhIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIFN0dWRlbnREYXRhIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoY29uc3RhbnRzLnN0dWRlbnRfZGF0YV9jaGlsZHJlbik7XG5cbiAgICB0aGlzLnRyaWVzID0gbmV3IENNSVRyaWVzKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMudHJpZXM/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICN0cmllc19kdXJpbmdfbGVzc29uID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgdHJpZXNfZHVyaW5nX2xlc3NvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdHJpZXNfZHVyaW5nX2xlc3NvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jdHJpZXNfZHVyaW5nX2xlc3NvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0cmllc19kdXJpbmdfbGVzc29uLiBTZXRzIGFuIGVycm9yIGlmIHRyeWluZyB0byBzZXQgYWZ0ZXJcbiAgICogIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHJpZXNfZHVyaW5nX2xlc3NvblxuICAgKi9cbiAgc2V0IHRyaWVzX2R1cmluZ19sZXNzb24odHJpZXNfZHVyaW5nX2xlc3Nvbikge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jdHJpZXNfZHVyaW5nX2xlc3NvbiA9IHRyaWVzX2R1cmluZ19sZXNzb24gOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5zdHVkZW50X2RhdGEgb2JqZWN0XG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgbWFzdGVyeV9zY29yZTogc3RyaW5nLFxuICAgKiAgICAgIG1heF90aW1lX2FsbG93ZWQ6IHN0cmluZyxcbiAgICogICAgICB0aW1lX2xpbWl0X2FjdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIHRyaWVzOiBDTUlUcmllc1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnbWFzdGVyeV9zY29yZSc6IHRoaXMubWFzdGVyeV9zY29yZSxcbiAgICAgICdtYXhfdGltZV9hbGxvd2VkJzogdGhpcy5tYXhfdGltZV9hbGxvd2VkLFxuICAgICAgJ3RpbWVfbGltaXRfYWN0aW9uJzogdGhpcy50aW1lX2xpbWl0X2FjdGlvbixcbiAgICAgICd0cmllcyc6IHRoaXMudHJpZXMsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgdGhlIEFJQ0MgY21pLnN0dWRlbnRfZGF0YS50cmllcyBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSVRyaWVzIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGlubGluZSBUcmllcyBBcnJheSBjbGFzc1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoYWljY19jb25zdGFudHMudHJpZXNfY2hpbGRyZW4pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIEFJQ0MgVHJpZXNcbiAqL1xuZXhwb3J0IGNsYXNzIENNSVRyaWVzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBUcmllcyBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnNjb3JlID0gbmV3IENNSVNjb3JlKFxuICAgICAgICB7XG4gICAgICAgICAgc2NvcmVfY2hpbGRyZW46IGNvbnN0YW50cy5zY29yZV9jaGlsZHJlbixcbiAgICAgICAgICBzY29yZV9yYW5nZTogcmVnZXguc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgaW52YWxpZEVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgICAgICBpbnZhbGlkVHlwZUNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCxcbiAgICAgICAgICBpbnZhbGlkUmFuZ2VDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRSxcbiAgICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc2NvcmU/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICNzdGF0dXMgPSAnJztcbiAgI3RpbWUgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3RhdHVzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0YXR1c1xuICAgKi9cbiAgc2V0IHN0YXR1cyhzdGF0dXMpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHN0YXR1cywgcmVnZXguQ01JU3RhdHVzMikpIHtcbiAgICAgIHRoaXMuI3N0YXR1cyA9IHN0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lXG4gICAqL1xuICBzZXQgdGltZSh0aW1lKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh0aW1lLCByZWdleC5DTUlUaW1lKSkge1xuICAgICAgdGhpcy4jdGltZSA9IHRpbWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLnN0dWRlbnRfZGF0YS50cmllcy5uIG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHN0YXR1czogc3RyaW5nLFxuICAgKiAgICAgIHRpbWU6IHN0cmluZyxcbiAgICogICAgICBzY29yZTogQ01JU2NvcmVcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3N0YXR1cyc6IHRoaXMuc3RhdHVzLFxuICAgICAgJ3RpbWUnOiB0aGlzLnRpbWUsXG4gICAgICAnc2NvcmUnOiB0aGlzLnNjb3JlLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIEFJQ0MgRXZhbHVhdGlvbiBDb21tZW50c1xuICovXG5leHBvcnQgY2xhc3MgQ01JRXZhbHVhdGlvbkNvbW1lbnRzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgRXZhbHVhdGlvbiBDb21tZW50c1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gICNjb250ZW50ID0gJyc7XG4gICNsb2NhdGlvbiA9ICcnO1xuICAjdGltZSA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb250ZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb250ZW50KCkge1xuICAgIHJldHVybiB0aGlzLiNjb250ZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbnRlbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbnRlbnRcbiAgICovXG4gIHNldCBjb250ZW50KGNvbnRlbnQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGNvbnRlbnQsIHJlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI2NvbnRlbnQgPSBjb250ZW50O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsb2NhdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xvY2F0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xvY2F0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvblxuICAgKi9cbiAgc2V0IGxvY2F0aW9uKGxvY2F0aW9uKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChsb2NhdGlvbiwgcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jbG9jYXRpb24gPSBsb2NhdGlvbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0aW5nIGZvciAjdGltZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZVxuICAgKi9cbiAgc2V0IHRpbWUodGltZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQodGltZSwgcmVnZXguQ01JVGltZSkpIHtcbiAgICAgIHRoaXMuI3RpbWUgPSB0aW1lO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5ldmF1bGF0aW9uLmNvbW1lbnRzLm4gb2JqZWN0XG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgY29udGVudDogc3RyaW5nLFxuICAgKiAgICAgIGxvY2F0aW9uOiBzdHJpbmcsXG4gICAqICAgICAgdGltZTogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdjb250ZW50JzogdGhpcy5jb250ZW50LFxuICAgICAgJ2xvY2F0aW9uJzogdGhpcy5sb2NhdGlvbixcbiAgICAgICd0aW1lJzogdGhpcy50aW1lLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iLCIvLyBAZmxvd1xuaW1wb3J0IHtzY29ybTEyX2NvbnN0YW50c30gZnJvbSAnLi4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuaW1wb3J0IHtzY29ybTEyX2Vycm9yX2NvZGVzfSBmcm9tICcuLi9jb25zdGFudHMvZXJyb3JfY29kZXMnO1xuaW1wb3J0IHtWYWxpZGF0aW9uRXJyb3J9IGZyb20gJy4uL2V4Y2VwdGlvbnMnO1xuaW1wb3J0IHtzY29ybTEyX3JlZ2V4fSBmcm9tICcuLi9jb25zdGFudHMvcmVnZXgnO1xuXG4vKipcbiAqIENoZWNrIGlmIHRoZSB2YWx1ZSBtYXRjaGVzIHRoZSBwcm9wZXIgZm9ybWF0LiBJZiBub3QsIHRocm93IHByb3BlciBlcnJvciBjb2RlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9IHJlZ2V4UGF0dGVyblxuICogQHBhcmFtIHtudW1iZXJ9IGVycm9yQ29kZVxuICogQHBhcmFtIHtib29sZWFufSBhbGxvd0VtcHR5U3RyaW5nXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tWYWxpZEZvcm1hdChcbiAgICB2YWx1ZTogU3RyaW5nLFxuICAgIHJlZ2V4UGF0dGVybjogU3RyaW5nLFxuICAgIGVycm9yQ29kZTogbnVtYmVyLFxuICAgIGFsbG93RW1wdHlTdHJpbmc/OiBib29sZWFuKSB7XG4gIGNvbnN0IGZvcm1hdFJlZ2V4ID0gbmV3IFJlZ0V4cChyZWdleFBhdHRlcm4pO1xuICBjb25zdCBtYXRjaGVzID0gdmFsdWUubWF0Y2goZm9ybWF0UmVnZXgpO1xuICBpZiAoYWxsb3dFbXB0eVN0cmluZyAmJiB2YWx1ZSA9PT0gJycpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCAhbWF0Y2hlcyB8fCBtYXRjaGVzWzBdID09PSAnJykge1xuICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoZXJyb3JDb2RlKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgdmFsdWUgbWF0Y2hlcyB0aGUgcHJvcGVyIHJhbmdlLiBJZiBub3QsIHRocm93IHByb3BlciBlcnJvciBjb2RlLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSByYW5nZVBhdHRlcm5cbiAqIEBwYXJhbSB7bnVtYmVyfSBlcnJvckNvZGVcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1ZhbGlkUmFuZ2UoXG4gICAgdmFsdWU6IGFueSwgcmFuZ2VQYXR0ZXJuOiBTdHJpbmcsIGVycm9yQ29kZTogbnVtYmVyKSB7XG4gIGNvbnN0IHJhbmdlcyA9IHJhbmdlUGF0dGVybi5zcGxpdCgnIycpO1xuICB2YWx1ZSA9IHZhbHVlICogMS4wO1xuICBpZiAodmFsdWUgPj0gcmFuZ2VzWzBdKSB7XG4gICAgaWYgKChyYW5nZXNbMV0gPT09ICcqJykgfHwgKHZhbHVlIDw9IHJhbmdlc1sxXSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKGVycm9yQ29kZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoZXJyb3JDb2RlKTtcbiAgfVxufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIEFQSSBjbWkgb2JqZWN0c1xuICovXG5leHBvcnQgY2xhc3MgQmFzZUNNSSB7XG4gIGpzb25TdHJpbmcgPSBmYWxzZTtcbiAgI2luaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBCYXNlQ01JLCBqdXN0IG1hcmtzIHRoZSBjbGFzcyBhcyBhYnN0cmFjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKG5ldy50YXJnZXQgPT09IEJhc2VDTUkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb25zdHJ1Y3QgQmFzZUNNSSBpbnN0YW5jZXMgZGlyZWN0bHknKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaW5pdGlhbGl6ZWRcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGdldCBpbml0aWFsaXplZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jaW5pdGlhbGl6ZWQ7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgdGhpcy4jaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgY21pICouc2NvcmUgb2JqZWN0c1xuICovXG5leHBvcnQgY2xhc3MgQ01JU2NvcmUgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciAqLnNjb3JlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY29yZV9jaGlsZHJlblxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NvcmVfcmFuZ2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1heFxuICAgKiBAcGFyYW0ge251bWJlcn0gaW52YWxpZEVycm9yQ29kZVxuICAgKiBAcGFyYW0ge251bWJlcn0gaW52YWxpZFR5cGVDb2RlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbnZhbGlkUmFuZ2VDb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkZWNpbWFsUmVnZXhcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgICAge1xuICAgICAgICBzY29yZV9jaGlsZHJlbixcbiAgICAgICAgc2NvcmVfcmFuZ2UsXG4gICAgICAgIG1heCxcbiAgICAgICAgaW52YWxpZEVycm9yQ29kZSxcbiAgICAgICAgaW52YWxpZFR5cGVDb2RlLFxuICAgICAgICBpbnZhbGlkUmFuZ2VDb2RlLFxuICAgICAgICBkZWNpbWFsUmVnZXgsXG4gICAgICB9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuI19jaGlsZHJlbiA9IHNjb3JlX2NoaWxkcmVuIHx8XG4gICAgICAgIHNjb3JtMTJfY29uc3RhbnRzLnNjb3JlX2NoaWxkcmVuO1xuICAgIHRoaXMuI19zY29yZV9yYW5nZSA9ICFzY29yZV9yYW5nZSA/IGZhbHNlIDogc2Nvcm0xMl9yZWdleC5zY29yZV9yYW5nZTtcbiAgICB0aGlzLiNtYXggPSAobWF4IHx8IG1heCA9PT0gJycpID8gbWF4IDogJzEwMCc7XG4gICAgdGhpcy4jX2ludmFsaWRfZXJyb3JfY29kZSA9IGludmFsaWRFcnJvckNvZGUgfHxcbiAgICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRTtcbiAgICB0aGlzLiNfaW52YWxpZF90eXBlX2NvZGUgPSBpbnZhbGlkVHlwZUNvZGUgfHxcbiAgICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIO1xuICAgIHRoaXMuI19pbnZhbGlkX3JhbmdlX2NvZGUgPSBpbnZhbGlkUmFuZ2VDb2RlIHx8XG4gICAgICAgIHNjb3JtMTJfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFO1xuICAgIHRoaXMuI19kZWNpbWFsX3JlZ2V4ID0gZGVjaW1hbFJlZ2V4IHx8XG4gICAgICAgIHNjb3JtMTJfcmVnZXguQ01JRGVjaW1hbDtcbiAgfVxuXG4gICNfY2hpbGRyZW47XG4gICNfc2NvcmVfcmFuZ2U7XG4gICNfaW52YWxpZF9lcnJvcl9jb2RlO1xuICAjX2ludmFsaWRfdHlwZV9jb2RlO1xuICAjX2ludmFsaWRfcmFuZ2VfY29kZTtcbiAgI19kZWNpbWFsX3JlZ2V4O1xuICAjcmF3ID0gJyc7XG4gICNtaW4gPSAnJztcbiAgI21heDtcblxuICAvKipcbiAgICogR2V0dGVyIGZvciBfY2hpbGRyZW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IF9jaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHRoaXMuI19pbnZhbGlkX2Vycm9yX2NvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3Jhd1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgcmF3KCkge1xuICAgIHJldHVybiB0aGlzLiNyYXc7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcmF3XG4gICAqIEBwYXJhbSB7c3RyaW5nfSByYXdcbiAgICovXG4gIHNldCByYXcocmF3KSB7XG4gICAgaWYgKGNoZWNrVmFsaWRGb3JtYXQocmF3LCB0aGlzLiNfZGVjaW1hbF9yZWdleCxcbiAgICAgICAgdGhpcy4jX2ludmFsaWRfdHlwZV9jb2RlKSAmJlxuICAgICAgICAoIXRoaXMuI19zY29yZV9yYW5nZSB8fFxuICAgICAgICAgICAgY2hlY2tWYWxpZFJhbmdlKHJhdywgdGhpcy4jX3Njb3JlX3JhbmdlLFxuICAgICAgICAgICAgICAgIHRoaXMuI19pbnZhbGlkX3JhbmdlX2NvZGUpKSkge1xuICAgICAgdGhpcy4jcmF3ID0gcmF3O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNtaW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1pbigpIHtcbiAgICByZXR1cm4gdGhpcy4jbWluO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI21pblxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWluXG4gICAqL1xuICBzZXQgbWluKG1pbikge1xuICAgIGlmIChjaGVja1ZhbGlkRm9ybWF0KG1pbiwgdGhpcy4jX2RlY2ltYWxfcmVnZXgsXG4gICAgICAgIHRoaXMuI19pbnZhbGlkX3R5cGVfY29kZSkgJiZcbiAgICAgICAgKCF0aGlzLiNfc2NvcmVfcmFuZ2UgfHxcbiAgICAgICAgICAgIGNoZWNrVmFsaWRSYW5nZShtaW4sIHRoaXMuI19zY29yZV9yYW5nZSxcbiAgICAgICAgICAgICAgICB0aGlzLiNfaW52YWxpZF9yYW5nZV9jb2RlKSkpIHtcbiAgICAgIHRoaXMuI21pbiA9IG1pbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbWF4XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBtYXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuI21heDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNtYXhcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1heFxuICAgKi9cbiAgc2V0IG1heChtYXgpIHtcbiAgICBpZiAoY2hlY2tWYWxpZEZvcm1hdChtYXgsIHRoaXMuI19kZWNpbWFsX3JlZ2V4LFxuICAgICAgICB0aGlzLiNfaW52YWxpZF90eXBlX2NvZGUpICYmXG4gICAgICAgICghdGhpcy4jX3Njb3JlX3JhbmdlIHx8XG4gICAgICAgICAgICBjaGVja1ZhbGlkUmFuZ2UobWF4LCB0aGlzLiNfc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgICAgICAgdGhpcy4jX2ludmFsaWRfcmFuZ2VfY29kZSkpKSB7XG4gICAgICB0aGlzLiNtYXggPSBtYXg7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgKi5zY29yZVxuICAgKiBAcmV0dXJuIHt7bWluOiBzdHJpbmcsIG1heDogc3RyaW5nLCByYXc6IHN0cmluZ319XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAncmF3JzogdGhpcy5yYXcsXG4gICAgICAnbWluJzogdGhpcy5taW4sXG4gICAgICAnbWF4JzogdGhpcy5tYXgsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBjbWkgKi5uIG9iamVjdHNcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUFycmF5IGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBjbWkgKi5uIGFycmF5c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY2hpbGRyZW5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGVycm9yQ29kZVxuICAgKi9cbiAgY29uc3RydWN0b3Ioe2NoaWxkcmVuLCBlcnJvckNvZGV9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLiNfY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICB0aGlzLiNlcnJvckNvZGUgPSBlcnJvckNvZGU7XG4gICAgdGhpcy5jaGlsZEFycmF5ID0gW107XG4gIH1cblxuICAjZXJyb3JDb2RlO1xuICAjX2NoaWxkcmVuO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIF9jaGlsZHJlblxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IF9jaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHRoaXMuI2Vycm9yQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBfY291bnRcbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cbiAgZ2V0IF9jb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZEFycmF5Lmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yIF9jb3VudC4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBfY291bnRcbiAgICovXG4gIHNldCBfY291bnQoX2NvdW50KSB7XG4gICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcih0aGlzLiNlcnJvckNvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgKi5uIGFycmF5c1xuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0W2kgKyAnJ10gPSB0aGlzLmNoaWxkQXJyYXlbaV07XG4gICAgfVxuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCB7XG4gIEJhc2VDTUksXG4gIGNoZWNrVmFsaWRGb3JtYXQsXG4gIGNoZWNrVmFsaWRSYW5nZSxcbiAgQ01JQXJyYXksXG4gIENNSVNjb3JlLFxufSBmcm9tICcuL2NvbW1vbic7XG5pbXBvcnQge3Njb3JtMTJfY29uc3RhbnRzfSBmcm9tICcuLi9jb25zdGFudHMvYXBpX2NvbnN0YW50cyc7XG5pbXBvcnQge3Njb3JtMTJfZXJyb3JfY29kZXN9IGZyb20gJy4uL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQge3Njb3JtMTJfcmVnZXh9IGZyb20gJy4uL2NvbnN0YW50cy9yZWdleCc7XG5pbXBvcnQge1ZhbGlkYXRpb25FcnJvcn0gZnJvbSAnLi4vZXhjZXB0aW9ucyc7XG5pbXBvcnQgKiBhcyBVdGlsaXRpZXMgZnJvbSAnLi4vdXRpbGl0aWVzJztcblxuY29uc3QgY29uc3RhbnRzID0gc2Nvcm0xMl9jb25zdGFudHM7XG5jb25zdCByZWdleCA9IHNjb3JtMTJfcmVnZXg7XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgUmVhZCBPbmx5IGVycm9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aHJvd1JlYWRPbmx5RXJyb3IoKSB7XG4gIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3Ioc2Nvcm0xMl9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgV3JpdGUgT25seSBlcnJvclxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dXcml0ZU9ubHlFcnJvcigpIHtcbiAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihzY29ybTEyX2Vycm9yX2NvZGVzLldSSVRFX09OTFlfRUxFTUVOVCk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgSW52YWxpZCBTZXQgZXJyb3JcbiAqL1xuZnVuY3Rpb24gdGhyb3dJbnZhbGlkVmFsdWVFcnJvcigpIHtcbiAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kLCBubyByZWFzb24gdG8gaGF2ZSB0byBwYXNzIHRoZSBzYW1lIGVycm9yIGNvZGVzIGV2ZXJ5IHRpbWVcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWdleFBhdHRlcm5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWxsb3dFbXB0eVN0cmluZ1xuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrMTJWYWxpZEZvcm1hdChcbiAgICB2YWx1ZTogU3RyaW5nLFxuICAgIHJlZ2V4UGF0dGVybjogU3RyaW5nLFxuICAgIGFsbG93RW1wdHlTdHJpbmc/OiBib29sZWFuKSB7XG4gIHJldHVybiBjaGVja1ZhbGlkRm9ybWF0KHZhbHVlLCByZWdleFBhdHRlcm4sXG4gICAgICBzY29ybTEyX2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gsIGFsbG93RW1wdHlTdHJpbmcpO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QsIG5vIHJlYXNvbiB0byBoYXZlIHRvIHBhc3MgdGhlIHNhbWUgZXJyb3IgY29kZXMgZXZlcnkgdGltZVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9IHJhbmdlUGF0dGVyblxuICogQHBhcmFtIHtib29sZWFufSBhbGxvd0VtcHR5U3RyaW5nXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2sxMlZhbGlkUmFuZ2UoXG4gICAgdmFsdWU6IGFueSxcbiAgICByYW5nZVBhdHRlcm46IFN0cmluZyxcbiAgICBhbGxvd0VtcHR5U3RyaW5nPzogYm9vbGVhbikge1xuICByZXR1cm4gY2hlY2tWYWxpZFJhbmdlKHZhbHVlLCByYW5nZVBhdHRlcm4sXG4gICAgICBzY29ybTEyX2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRSwgYWxsb3dFbXB0eVN0cmluZyk7XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIHRoZSBjbWkgb2JqZWN0IGZvciBTQ09STSAxLjJcbiAqL1xuZXhwb3J0IGNsYXNzIENNSSBleHRlbmRzIEJhc2VDTUkge1xuICAjX2NoaWxkcmVuID0gJyc7XG4gICNfdmVyc2lvbiA9ICczLjQnO1xuICAjc3VzcGVuZF9kYXRhID0gJyc7XG4gICNsYXVuY2hfZGF0YSA9ICcnO1xuICAjY29tbWVudHMgPSAnJztcbiAgI2NvbW1lbnRzX2Zyb21fbG1zID0gJyc7XG5cbiAgc3R1ZGVudF9kYXRhID0gbnVsbDtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIHRoZSBTQ09STSAxLjIgY21pIG9iamVjdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gY21pX2NoaWxkcmVuXG4gICAqIEBwYXJhbSB7KENNSVN0dWRlbnREYXRhfEFJQ0NDTUlTdHVkZW50RGF0YSl9IHN0dWRlbnRfZGF0YVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGluaXRpYWxpemVkXG4gICAqL1xuICBjb25zdHJ1Y3RvcihjbWlfY2hpbGRyZW4sIHN0dWRlbnRfZGF0YSwgaW5pdGlhbGl6ZWQ6IGJvb2xlYW4pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKGluaXRpYWxpemVkKSB0aGlzLmluaXRpYWxpemUoKTtcblxuICAgIHRoaXMuI19jaGlsZHJlbiA9IGNtaV9jaGlsZHJlbiA/IGNtaV9jaGlsZHJlbiA6IGNvbnN0YW50cy5jbWlfY2hpbGRyZW47XG4gICAgdGhpcy5jb3JlID0gbmV3IENNSUNvcmUoKTtcbiAgICB0aGlzLm9iamVjdGl2ZXMgPSBuZXcgQ01JT2JqZWN0aXZlcygpO1xuICAgIHRoaXMuc3R1ZGVudF9kYXRhID0gc3R1ZGVudF9kYXRhID8gc3R1ZGVudF9kYXRhIDogbmV3IENNSVN0dWRlbnREYXRhKCk7XG4gICAgdGhpcy5zdHVkZW50X3ByZWZlcmVuY2UgPSBuZXcgQ01JU3R1ZGVudFByZWZlcmVuY2UoKTtcbiAgICB0aGlzLmludGVyYWN0aW9ucyA9IG5ldyBDTUlJbnRlcmFjdGlvbnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5jb3JlPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5vYmplY3RpdmVzPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zdHVkZW50X2RhdGE/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnN0dWRlbnRfcHJlZmVyZW5jZT8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWlcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBzdXNwZW5kX2RhdGE6IHN0cmluZyxcbiAgICogICAgICBsYXVuY2hfZGF0YTogc3RyaW5nLFxuICAgKiAgICAgIGNvbW1lbnRzOiBzdHJpbmcsXG4gICAqICAgICAgY29tbWVudHNfZnJvbV9sbXM6IHN0cmluZyxcbiAgICogICAgICBjb3JlOiBDTUlDb3JlLFxuICAgKiAgICAgIG9iamVjdGl2ZXM6IENNSU9iamVjdGl2ZXMsXG4gICAqICAgICAgc3R1ZGVudF9kYXRhOiBDTUlTdHVkZW50RGF0YSxcbiAgICogICAgICBzdHVkZW50X3ByZWZlcmVuY2U6IENNSVN0dWRlbnRQcmVmZXJlbmNlLFxuICAgKiAgICAgIGludGVyYWN0aW9uczogQ01JSW50ZXJhY3Rpb25zXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdzdXNwZW5kX2RhdGEnOiB0aGlzLnN1c3BlbmRfZGF0YSxcbiAgICAgICdsYXVuY2hfZGF0YSc6IHRoaXMubGF1bmNoX2RhdGEsXG4gICAgICAnY29tbWVudHMnOiB0aGlzLmNvbW1lbnRzLFxuICAgICAgJ2NvbW1lbnRzX2Zyb21fbG1zJzogdGhpcy5jb21tZW50c19mcm9tX2xtcyxcbiAgICAgICdjb3JlJzogdGhpcy5jb3JlLFxuICAgICAgJ29iamVjdGl2ZXMnOiB0aGlzLm9iamVjdGl2ZXMsXG4gICAgICAnc3R1ZGVudF9kYXRhJzogdGhpcy5zdHVkZW50X2RhdGEsXG4gICAgICAnc3R1ZGVudF9wcmVmZXJlbmNlJzogdGhpcy5zdHVkZW50X3ByZWZlcmVuY2UsXG4gICAgICAnaW50ZXJhY3Rpb25zJzogdGhpcy5pbnRlcmFjdGlvbnMsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX3ZlcnNpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IF92ZXJzaW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNfdmVyc2lvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfdmVyc2lvbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfdmVyc2lvblxuICAgKi9cbiAgc2V0IF92ZXJzaW9uKF92ZXJzaW9uKSB7XG4gICAgdGhyb3dJbnZhbGlkVmFsdWVFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI19jaGlsZHJlblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX3ZlcnNpb24uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX2NoaWxkcmVuXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93SW52YWxpZFZhbHVlRXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdXNwZW5kX2RhdGFcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN1c3BlbmRfZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy4jc3VzcGVuZF9kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N1c3BlbmRfZGF0YVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3VzcGVuZF9kYXRhXG4gICAqL1xuICBzZXQgc3VzcGVuZF9kYXRhKHN1c3BlbmRfZGF0YSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoc3VzcGVuZF9kYXRhLCByZWdleC5DTUlTdHJpbmc0MDk2KSkge1xuICAgICAgdGhpcy4jc3VzcGVuZF9kYXRhID0gc3VzcGVuZF9kYXRhO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsYXVuY2hfZGF0YVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGF1bmNoX2RhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xhdW5jaF9kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xhdW5jaF9kYXRhLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhdW5jaF9kYXRhXG4gICAqL1xuICBzZXQgbGF1bmNoX2RhdGEobGF1bmNoX2RhdGEpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI2xhdW5jaF9kYXRhID0gbGF1bmNoX2RhdGEgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb21tZW50c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29tbWVudHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbW1lbnRzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbW1lbnRzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21tZW50c1xuICAgKi9cbiAgc2V0IGNvbW1lbnRzKGNvbW1lbnRzKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChjb21tZW50cywgcmVnZXguQ01JU3RyaW5nNDA5NikpIHtcbiAgICAgIHRoaXMuI2NvbW1lbnRzID0gY29tbWVudHM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NvbW1lbnRzX2Zyb21fbG1zXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb21tZW50c19mcm9tX2xtcygpIHtcbiAgICByZXR1cm4gdGhpcy4jY29tbWVudHNfZnJvbV9sbXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29tbWVudHNfZnJvbV9sbXMuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29tbWVudHNfZnJvbV9sbXNcbiAgICovXG4gIHNldCBjb21tZW50c19mcm9tX2xtcyhjb21tZW50c19mcm9tX2xtcykge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jY29tbWVudHNfZnJvbV9sbXMgPSBjb21tZW50c19mcm9tX2xtcyA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgdGhlIGN1cnJlbnQgc2Vzc2lvbiB0aW1lIHRvIHRoZSBleGlzdGluZyB0b3RhbCB0aW1lLlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXRDdXJyZW50VG90YWxUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLmNvcmUuZ2V0Q3VycmVudFRvdGFsVGltZSgpO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIHRoZSBjbWkuY29yZSBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuY2xhc3MgQ01JQ29yZSBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5jb3JlXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zY29yZSA9IG5ldyBDTUlTY29yZShcbiAgICAgICAge1xuICAgICAgICAgIHNjb3JlX2NoaWxkcmVuOiBjb25zdGFudHMuc2NvcmVfY2hpbGRyZW4sXG4gICAgICAgICAgc2NvcmVfcmFuZ2U6IHJlZ2V4LnNjb3JlX3JhbmdlLFxuICAgICAgICAgIGludmFsaWRFcnJvckNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUsXG4gICAgICAgICAgaW52YWxpZFR5cGVDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gsXG4gICAgICAgICAgaW52YWxpZFJhbmdlQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0UsXG4gICAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnNjb3JlPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAjX2NoaWxkcmVuID0gY29uc3RhbnRzLmNvcmVfY2hpbGRyZW47XG4gICNzdHVkZW50X2lkID0gJyc7XG4gICNzdHVkZW50X25hbWUgPSAnJztcbiAgI2xlc3Nvbl9sb2NhdGlvbiA9ICcnO1xuICAjY3JlZGl0ID0gJyc7XG4gICNsZXNzb25fc3RhdHVzID0gJ25vdCBhdHRlbXB0ZWQnO1xuICAjZW50cnkgPSAnJztcbiAgI3RvdGFsX3RpbWUgPSAnJztcbiAgI2xlc3Nvbl9tb2RlID0gJ25vcm1hbCc7XG4gICNleGl0ID0gJyc7XG4gICNzZXNzaW9uX3RpbWUgPSAnMDA6MDA6MDAnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNfY2hpbGRyZW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IF9jaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI19jaGlsZHJlbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfY2hpbGRyZW5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldCBfY2hpbGRyZW4oX2NoaWxkcmVuKSB7XG4gICAgdGhyb3dJbnZhbGlkVmFsdWVFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N0dWRlbnRfaWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN0dWRlbnRfaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0dWRlbnRfaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3R1ZGVudF9pZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHVkZW50X2lkXG4gICAqL1xuICBzZXQgc3R1ZGVudF9pZChzdHVkZW50X2lkKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNzdHVkZW50X2lkID0gc3R1ZGVudF9pZCA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N0dWRlbnRfbmFtZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3R1ZGVudF9uYW1lKCkge1xuICAgIHJldHVybiB0aGlzLiNzdHVkZW50X25hbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3R1ZGVudF9uYW1lLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0dWRlbnRfbmFtZVxuICAgKi9cbiAgc2V0IHN0dWRlbnRfbmFtZShzdHVkZW50X25hbWUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI3N0dWRlbnRfbmFtZSA9IHN0dWRlbnRfbmFtZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xlc3Nvbl9sb2NhdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVzc29uX2xvY2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNsZXNzb25fbG9jYXRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGVzc29uX2xvY2F0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZXNzb25fbG9jYXRpb25cbiAgICovXG4gIHNldCBsZXNzb25fbG9jYXRpb24obGVzc29uX2xvY2F0aW9uKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChsZXNzb25fbG9jYXRpb24sIHJlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI2xlc3Nvbl9sb2NhdGlvbiA9IGxlc3Nvbl9sb2NhdGlvbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY3JlZGl0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjcmVkaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NyZWRpdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjcmVkaXQuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY3JlZGl0XG4gICAqL1xuICBzZXQgY3JlZGl0KGNyZWRpdCkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jY3JlZGl0ID0gY3JlZGl0IDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGVzc29uX3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVzc29uX3N0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jbGVzc29uX3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsZXNzb25fc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZXNzb25fc3RhdHVzXG4gICAqL1xuICBzZXQgbGVzc29uX3N0YXR1cyhsZXNzb25fc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChsZXNzb25fc3RhdHVzLCByZWdleC5DTUlTdGF0dXMpKSB7XG4gICAgICB0aGlzLiNsZXNzb25fc3RhdHVzID0gbGVzc29uX3N0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZW50cnlcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGVudHJ5KCkge1xuICAgIHJldHVybiB0aGlzLiNlbnRyeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNlbnRyeS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlbnRyeVxuICAgKi9cbiAgc2V0IGVudHJ5KGVudHJ5KSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNlbnRyeSA9IGVudHJ5IDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdG90YWxfdGltZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdG90YWxfdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jdG90YWxfdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0b3RhbF90aW1lLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvdGFsX3RpbWVcbiAgICovXG4gIHNldCB0b3RhbF90aW1lKHRvdGFsX3RpbWUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI3RvdGFsX3RpbWUgPSB0b3RhbF90aW1lIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGVzc29uX21vZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlc3Nvbl9tb2RlKCkge1xuICAgIHJldHVybiB0aGlzLiNsZXNzb25fbW9kZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsZXNzb25fbW9kZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZXNzb25fbW9kZVxuICAgKi9cbiAgc2V0IGxlc3Nvbl9tb2RlKGxlc3Nvbl9tb2RlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNsZXNzb25fbW9kZSA9IGxlc3Nvbl9tb2RlIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZXhpdC4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCBleGl0KCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNleGl0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2V4aXRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV4aXRcbiAgICovXG4gIHNldCBleGl0KGV4aXQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGV4aXQsIHJlZ2V4LkNNSUV4aXQpKSB7XG4gICAgICB0aGlzLiNleGl0ID0gZXhpdDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc2Vzc2lvbl90aW1lLiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IHNlc3Npb25fdGltZSgpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jc2Vzc2lvbl90aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3Nlc3Npb25fdGltZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2Vzc2lvbl90aW1lXG4gICAqL1xuICBzZXQgc2Vzc2lvbl90aW1lKHNlc3Npb25fdGltZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoc2Vzc2lvbl90aW1lLCByZWdleC5DTUlUaW1lc3BhbikpIHtcbiAgICAgIHRoaXMuI3Nlc3Npb25fdGltZSA9IHNlc3Npb25fdGltZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0aGUgY3VycmVudCBzZXNzaW9uIHRpbWUgdG8gdGhlIGV4aXN0aW5nIHRvdGFsIHRpbWUuXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldEN1cnJlbnRUb3RhbFRpbWUoKSB7XG4gICAgcmV0dXJuIFV0aWxpdGllcy5hZGRISE1NU1NUaW1lU3RyaW5ncyhcbiAgICAgICAgdGhpcy4jdG90YWxfdGltZSxcbiAgICAgICAgdGhpcy4jc2Vzc2lvbl90aW1lLFxuICAgICAgICBuZXcgUmVnRXhwKHNjb3JtMTJfcmVnZXguQ01JVGltZXNwYW4pXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5jb3JlXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgc3R1ZGVudF9uYW1lOiBzdHJpbmcsXG4gICAqICAgICAgZW50cnk6IHN0cmluZyxcbiAgICogICAgICBleGl0OiBzdHJpbmcsXG4gICAqICAgICAgc2NvcmU6IENNSVNjb3JlLFxuICAgKiAgICAgIHN0dWRlbnRfaWQ6IHN0cmluZyxcbiAgICogICAgICBsZXNzb25fbW9kZTogc3RyaW5nLFxuICAgKiAgICAgIGxlc3Nvbl9sb2NhdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIGxlc3Nvbl9zdGF0dXM6IHN0cmluZyxcbiAgICogICAgICBjcmVkaXQ6IHN0cmluZyxcbiAgICogICAgICB0b3RhbF90aW1lOiBzdHJpbmcsXG4gICAqICAgICAgc2Vzc2lvbl90aW1lOiAqXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdzdHVkZW50X2lkJzogdGhpcy5zdHVkZW50X2lkLFxuICAgICAgJ3N0dWRlbnRfbmFtZSc6IHRoaXMuc3R1ZGVudF9uYW1lLFxuICAgICAgJ2xlc3Nvbl9sb2NhdGlvbic6IHRoaXMubGVzc29uX2xvY2F0aW9uLFxuICAgICAgJ2NyZWRpdCc6IHRoaXMuY3JlZGl0LFxuICAgICAgJ2xlc3Nvbl9zdGF0dXMnOiB0aGlzLmxlc3Nvbl9zdGF0dXMsXG4gICAgICAnZW50cnknOiB0aGlzLmVudHJ5LFxuICAgICAgJ3RvdGFsX3RpbWUnOiB0aGlzLnRvdGFsX3RpbWUsXG4gICAgICAnbGVzc29uX21vZGUnOiB0aGlzLmxlc3Nvbl9tb2RlLFxuICAgICAgJ2V4aXQnOiB0aGlzLmV4aXQsXG4gICAgICAnc2Vzc2lvbl90aW1lJzogdGhpcy5zZXNzaW9uX3RpbWUsXG4gICAgICAnc2NvcmUnOiB0aGlzLnNjb3JlLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5vYmplY3RpdmVzIG9iamVjdFxuICogQGV4dGVuZHMgQ01JQXJyYXlcbiAqL1xuY2xhc3MgQ01JT2JqZWN0aXZlcyBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkub2JqZWN0aXZlc1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe1xuICAgICAgY2hpbGRyZW46IGNvbnN0YW50cy5vYmplY3RpdmVzX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5zdHVkZW50X2RhdGEgb2JqZWN0XG4gKiBAZXh0ZW5kcyBCYXNlQ01JXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlTdHVkZW50RGF0YSBleHRlbmRzIEJhc2VDTUkge1xuICAjX2NoaWxkcmVuO1xuICAjbWFzdGVyeV9zY29yZSA9ICcnO1xuICAjbWF4X3RpbWVfYWxsb3dlZCA9ICcnO1xuICAjdGltZV9saW1pdF9hY3Rpb24gPSAnJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5zdHVkZW50X2RhdGFcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0dWRlbnRfZGF0YV9jaGlsZHJlblxuICAgKi9cbiAgY29uc3RydWN0b3Ioc3R1ZGVudF9kYXRhX2NoaWxkcmVuKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuI19jaGlsZHJlbiA9IHN0dWRlbnRfZGF0YV9jaGlsZHJlbiA/XG4gICAgICAgIHN0dWRlbnRfZGF0YV9jaGlsZHJlbiA6XG4gICAgICAgIGNvbnN0YW50cy5zdHVkZW50X2RhdGFfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX2NoaWxkcmVuXG4gICAqIEByZXR1cm4geyp9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvd0ludmFsaWRWYWx1ZUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbWFzdGVyX3Njb3JlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBtYXN0ZXJ5X3Njb3JlKCkge1xuICAgIHJldHVybiB0aGlzLiNtYXN0ZXJ5X3Njb3JlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI21hc3Rlcl9zY29yZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYXN0ZXJ5X3Njb3JlXG4gICAqL1xuICBzZXQgbWFzdGVyeV9zY29yZShtYXN0ZXJ5X3Njb3JlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNtYXN0ZXJ5X3Njb3JlID0gbWFzdGVyeV9zY29yZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI21heF90aW1lX2FsbG93ZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1heF90aW1lX2FsbG93ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI21heF90aW1lX2FsbG93ZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbWF4X3RpbWVfYWxsb3dlZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYXhfdGltZV9hbGxvd2VkXG4gICAqL1xuICBzZXQgbWF4X3RpbWVfYWxsb3dlZChtYXhfdGltZV9hbGxvd2VkKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNtYXhfdGltZV9hbGxvd2VkID0gbWF4X3RpbWVfYWxsb3dlZCA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWVfbGltaXRfYWN0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lX2xpbWl0X2FjdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jdGltZV9saW1pdF9hY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGltZV9saW1pdF9hY3Rpb24uIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZV9saW1pdF9hY3Rpb25cbiAgICovXG4gIHNldCB0aW1lX2xpbWl0X2FjdGlvbih0aW1lX2xpbWl0X2FjdGlvbikge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jdGltZV9saW1pdF9hY3Rpb24gPSB0aW1lX2xpbWl0X2FjdGlvbiA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLnN0dWRlbnRfZGF0YVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIG1heF90aW1lX2FsbG93ZWQ6IHN0cmluZyxcbiAgICogICAgICB0aW1lX2xpbWl0X2FjdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIG1hc3Rlcnlfc2NvcmU6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnbWFzdGVyeV9zY29yZSc6IHRoaXMubWFzdGVyeV9zY29yZSxcbiAgICAgICdtYXhfdGltZV9hbGxvd2VkJzogdGhpcy5tYXhfdGltZV9hbGxvd2VkLFxuICAgICAgJ3RpbWVfbGltaXRfYWN0aW9uJzogdGhpcy50aW1lX2xpbWl0X2FjdGlvbixcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkuc3R1ZGVudF9wcmVmZXJlbmNlIG9iamVjdFxuICogQGV4dGVuZHMgQmFzZUNNSVxuICovXG5jbGFzcyBDTUlTdHVkZW50UHJlZmVyZW5jZSBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5zdHVkZW50X3ByZWZlcmVuY2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAjX2NoaWxkcmVuID0gY29uc3RhbnRzLnN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbjtcbiAgI2F1ZGlvID0gJyc7XG4gICNsYW5ndWFnZSA9ICcnO1xuICAjc3BlZWQgPSAnJztcbiAgI3RleHQgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX2NoaWxkcmVuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX2NoaWxkcmVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93SW52YWxpZFZhbHVlRXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNhdWRpb1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgYXVkaW8oKSB7XG4gICAgcmV0dXJuIHRoaXMuI2F1ZGlvO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2F1ZGlvXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdWRpb1xuICAgKi9cbiAgc2V0IGF1ZGlvKGF1ZGlvKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChhdWRpbywgcmVnZXguQ01JU0ludGVnZXIpICYmXG4gICAgICAgIGNoZWNrMTJWYWxpZFJhbmdlKGF1ZGlvLCByZWdleC5hdWRpb19yYW5nZSkpIHtcbiAgICAgIHRoaXMuI2F1ZGlvID0gYXVkaW87XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xhbmd1YWdlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsYW5ndWFnZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGFuZ3VhZ2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGFuZ3VhZ2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhbmd1YWdlXG4gICAqL1xuICBzZXQgbGFuZ3VhZ2UobGFuZ3VhZ2UpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGxhbmd1YWdlLCByZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiNsYW5ndWFnZSA9IGxhbmd1YWdlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzcGVlZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3BlZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3NwZWVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3NwZWVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzcGVlZFxuICAgKi9cbiAgc2V0IHNwZWVkKHNwZWVkKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChzcGVlZCwgcmVnZXguQ01JU0ludGVnZXIpICYmXG4gICAgICAgIGNoZWNrMTJWYWxpZFJhbmdlKHNwZWVkLCByZWdleC5zcGVlZF9yYW5nZSkpIHtcbiAgICAgIHRoaXMuI3NwZWVkID0gc3BlZWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RleHRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RleHQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGV4dFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuICAgKi9cbiAgc2V0IHRleHQodGV4dCkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQodGV4dCwgcmVnZXguQ01JU0ludGVnZXIpICYmXG4gICAgICAgIGNoZWNrMTJWYWxpZFJhbmdlKHRleHQsIHJlZ2V4LnRleHRfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiN0ZXh0ID0gdGV4dDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuc3R1ZGVudF9wcmVmZXJlbmNlXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgYXVkaW86IHN0cmluZyxcbiAgICogICAgICBsYW5ndWFnZTogc3RyaW5nLFxuICAgKiAgICAgIHNwZWVkOiBzdHJpbmcsXG4gICAqICAgICAgdGV4dDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdhdWRpbyc6IHRoaXMuYXVkaW8sXG4gICAgICAnbGFuZ3VhZ2UnOiB0aGlzLmxhbmd1YWdlLFxuICAgICAgJ3NwZWVkJzogdGhpcy5zcGVlZCxcbiAgICAgICd0ZXh0JzogdGhpcy50ZXh0LFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5pbnRlcmFjdGlvbnMgb2JqZWN0XG4gKiBAZXh0ZW5kcyBCYXNlQ01JXG4gKi9cbmNsYXNzIENNSUludGVyYWN0aW9ucyBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogY29uc3RhbnRzLmludGVyYWN0aW9uc19jaGlsZHJlbixcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkuaW50ZXJhY3Rpb25zLm4gb2JqZWN0XG4gKiBAZXh0ZW5kcyBCYXNlQ01JXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlJbnRlcmFjdGlvbnNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4gb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5vYmplY3RpdmVzID0gbmV3IENNSUFycmF5KHtcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgIGNoaWxkcmVuOiBjb25zdGFudHMub2JqZWN0aXZlc19jaGlsZHJlbixcbiAgICB9KTtcbiAgICB0aGlzLmNvcnJlY3RfcmVzcG9uc2VzID0gbmV3IENNSUFycmF5KHtcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgIGNoaWxkcmVuOiBjb25zdGFudHMuY29ycmVjdF9yZXNwb25zZXNfY2hpbGRyZW4sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMub2JqZWN0aXZlcz8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuY29ycmVjdF9yZXNwb25zZXM/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICNpZCA9ICcnO1xuICAjdGltZSA9ICcnO1xuICAjdHlwZSA9ICcnO1xuICAjd2VpZ2h0aW5nID0gJyc7XG4gICNzdHVkZW50X3Jlc3BvbnNlID0gJyc7XG4gICNyZXN1bHQgPSAnJztcbiAgI2xhdGVuY3kgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaWQuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChpZCwgcmVnZXguQ01JSWRlbnRpZmllcikpIHtcbiAgICAgIHRoaXMuI2lkID0gaWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWUuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgdGltZSgpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lXG4gICAqL1xuICBzZXQgdGltZSh0aW1lKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh0aW1lLCByZWdleC5DTUlUaW1lKSkge1xuICAgICAgdGhpcy4jdGltZSA9IHRpbWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3R5cGUuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jdHlwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0eXBlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gICAqL1xuICBzZXQgdHlwZSh0eXBlKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh0eXBlLCByZWdleC5DTUlUeXBlKSkge1xuICAgICAgdGhpcy4jdHlwZSA9IHR5cGU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3dlaWdodGluZy4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCB3ZWlnaHRpbmcoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/XG4gICAgICAgIHRocm93V3JpdGVPbmx5RXJyb3IoKSA6XG4gICAgICAgIHRoaXMuI3dlaWdodGluZztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN3ZWlnaHRpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IHdlaWdodGluZ1xuICAgKi9cbiAgc2V0IHdlaWdodGluZyh3ZWlnaHRpbmcpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHdlaWdodGluZywgcmVnZXguQ01JRGVjaW1hbCkgJiZcbiAgICAgICAgY2hlY2sxMlZhbGlkUmFuZ2Uod2VpZ2h0aW5nLCByZWdleC53ZWlnaHRpbmdfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiN3ZWlnaHRpbmcgPSB3ZWlnaHRpbmc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N0dWRlbnRfcmVzcG9uc2UuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgc3R1ZGVudF9yZXNwb25zZSgpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jc3R1ZGVudF9yZXNwb25zZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdHVkZW50X3Jlc3BvbnNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHVkZW50X3Jlc3BvbnNlXG4gICAqL1xuICBzZXQgc3R1ZGVudF9yZXNwb25zZShzdHVkZW50X3Jlc3BvbnNlKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChzdHVkZW50X3Jlc3BvbnNlLCByZWdleC5DTUlGZWVkYmFjaywgdHJ1ZSkpIHtcbiAgICAgIHRoaXMuI3N0dWRlbnRfcmVzcG9uc2UgPSBzdHVkZW50X3Jlc3BvbnNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNyZXN1bHQuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgcmVzdWx0KCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNyZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcmVzdWx0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZXN1bHRcbiAgICovXG4gIHNldCByZXN1bHQocmVzdWx0KSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChyZXN1bHQsIHJlZ2V4LkNNSVJlc3VsdCkpIHtcbiAgICAgIHRoaXMuI3Jlc3VsdCA9IHJlc3VsdDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGF0ZW5jeS4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCBsYXRlbmN5KCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNsYXRlbmN5O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xhdGVuY3lcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhdGVuY3lcbiAgICovXG4gIHNldCBsYXRlbmN5KGxhdGVuY3kpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGxhdGVuY3ksIHJlZ2V4LkNNSVRpbWVzcGFuKSkge1xuICAgICAgdGhpcy4jbGF0ZW5jeSA9IGxhdGVuY3k7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmludGVyYWN0aW9ucy5uXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgaWQ6IHN0cmluZyxcbiAgICogICAgICB0aW1lOiBzdHJpbmcsXG4gICAqICAgICAgdHlwZTogc3RyaW5nLFxuICAgKiAgICAgIHdlaWdodGluZzogc3RyaW5nLFxuICAgKiAgICAgIHN0dWRlbnRfcmVzcG9uc2U6IHN0cmluZyxcbiAgICogICAgICByZXN1bHQ6IHN0cmluZyxcbiAgICogICAgICBsYXRlbmN5OiBzdHJpbmcsXG4gICAqICAgICAgb2JqZWN0aXZlczogQ01JQXJyYXksXG4gICAqICAgICAgY29ycmVjdF9yZXNwb25zZXM6IENNSUFycmF5XG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdpZCc6IHRoaXMuaWQsXG4gICAgICAndGltZSc6IHRoaXMudGltZSxcbiAgICAgICd0eXBlJzogdGhpcy50eXBlLFxuICAgICAgJ3dlaWdodGluZyc6IHRoaXMud2VpZ2h0aW5nLFxuICAgICAgJ3N0dWRlbnRfcmVzcG9uc2UnOiB0aGlzLnN0dWRlbnRfcmVzcG9uc2UsXG4gICAgICAncmVzdWx0JzogdGhpcy5yZXN1bHQsXG4gICAgICAnbGF0ZW5jeSc6IHRoaXMubGF0ZW5jeSxcbiAgICAgICdvYmplY3RpdmVzJzogdGhpcy5vYmplY3RpdmVzLFxuICAgICAgJ2NvcnJlY3RfcmVzcG9uc2VzJzogdGhpcy5jb3JyZWN0X3Jlc3BvbnNlcyxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkub2JqZWN0aXZlcy5uIG9iamVjdFxuICogQGV4dGVuZHMgQmFzZUNNSVxuICovXG5leHBvcnQgY2xhc3MgQ01JT2JqZWN0aXZlc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5vYmplY3RpdmVzLm5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnNjb3JlID0gbmV3IENNSVNjb3JlKFxuICAgICAgICB7XG4gICAgICAgICAgc2NvcmVfY2hpbGRyZW46IGNvbnN0YW50cy5zY29yZV9jaGlsZHJlbixcbiAgICAgICAgICBzY29yZV9yYW5nZTogcmVnZXguc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgaW52YWxpZEVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgICAgICBpbnZhbGlkVHlwZUNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCxcbiAgICAgICAgICBpbnZhbGlkUmFuZ2VDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRSxcbiAgICAgICAgfSk7XG4gIH1cblxuICAjaWQgPSAnJztcbiAgI3N0YXR1cyA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNpZFxuICAgKiBAcmV0dXJuIHtcIlwifVxuICAgKi9cbiAgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLiNpZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNpZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICovXG4gIHNldCBpZChpZCkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoaWQsIHJlZ2V4LkNNSUlkZW50aWZpZXIpKSB7XG4gICAgICB0aGlzLiNpZCA9IGlkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdGF0dXNcbiAgICogQHJldHVybiB7XCJcIn1cbiAgICovXG4gIGdldCBzdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0YXR1c1xuICAgKi9cbiAgc2V0IHN0YXR1cyhzdGF0dXMpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHN0YXR1cywgcmVnZXguQ01JU3RhdHVzMikpIHtcbiAgICAgIHRoaXMuI3N0YXR1cyA9IHN0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkub2JqZWN0aXZlcy5uXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgaWQ6IHN0cmluZyxcbiAgICogICAgICBzdGF0dXM6IHN0cmluZyxcbiAgICogICAgICBzY29yZTogQ01JU2NvcmVcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICAgICdzdGF0dXMnOiB0aGlzLnN0YXR1cyxcbiAgICAgICdzY29yZSc6IHRoaXMuc2NvcmUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLmludGVyYWN0aW9ucy5uLm9iamVjdGl2ZXMubiBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc09iamVjdGl2ZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4ub2JqZWN0aXZlcy5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgI2lkID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2lkXG4gICAqIEByZXR1cm4ge1wiXCJ9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChpZCwgcmVnZXguQ01JSWRlbnRpZmllcikpIHtcbiAgICAgIHRoaXMuI2lkID0gaWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmludGVyYWN0aW9ucy5uLm9iamVjdGl2ZXMublxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGlkOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkuaW50ZXJhY3Rpb25zLmNvcnJlY3RfcmVzcG9uc2VzLm4gb2JqZWN0XG4gKiBAZXh0ZW5kcyBCYXNlQ01JXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlJbnRlcmFjdGlvbnNDb3JyZWN0UmVzcG9uc2VzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmludGVyYWN0aW9ucy5jb3JyZWN0X3Jlc3BvbnNlcy5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgI3BhdHRlcm4gPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjcGF0dGVyblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgcGF0dGVybigpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jcGF0dGVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNwYXR0ZXJuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXR0ZXJuXG4gICAqL1xuICBzZXQgcGF0dGVybihwYXR0ZXJuKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChwYXR0ZXJuLCByZWdleC5DTUlGZWVkYmFjaywgdHJ1ZSkpIHtcbiAgICAgIHRoaXMuI3BhdHRlcm4gPSBwYXR0ZXJuO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5pbnRlcmFjdGlvbnMuY29ycmVjdF9yZXNwb25zZXMublxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHBhdHRlcm46IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAncGF0dGVybic6IHRoaXMucGF0dGVybixcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBBSUNDIE5hdmlnYXRpb24gb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBOQVYgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBOQVYgb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgI2V2ZW50ID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2V2ZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBldmVudCgpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jZXZlbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZXZlbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAqL1xuICBzZXQgZXZlbnQoZXZlbnQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGV2ZW50LCByZWdleC5OQVZFdmVudCkpIHtcbiAgICAgIHRoaXMuI2V2ZW50ID0gZXZlbnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgbmF2IG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGV2ZW50OiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2V2ZW50JzogdGhpcy5ldmVudCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCB7XG4gIEJhc2VDTUksXG4gIGNoZWNrVmFsaWRGb3JtYXQsXG4gIGNoZWNrVmFsaWRSYW5nZSxcbiAgQ01JQXJyYXksXG4gIENNSVNjb3JlLFxufSBmcm9tICcuL2NvbW1vbic7XG5pbXBvcnQge3Njb3JtMjAwNF9jb25zdGFudHN9IGZyb20gJy4uL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCB7c2Nvcm0yMDA0X3JlZ2V4fSBmcm9tICcuLi9jb25zdGFudHMvcmVnZXgnO1xuaW1wb3J0IHtzY29ybTIwMDRfZXJyb3JfY29kZXN9IGZyb20gJy4uL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQge2xlYXJuZXJfcmVzcG9uc2VzfSBmcm9tICcuLi9jb25zdGFudHMvcmVzcG9uc2VfY29uc3RhbnRzJztcbmltcG9ydCB7VmFsaWRhdGlvbkVycm9yfSBmcm9tICcuLi9leGNlcHRpb25zJztcbmltcG9ydCAqIGFzIFV0aWwgZnJvbSAnLi4vdXRpbGl0aWVzJztcblxuY29uc3QgY29uc3RhbnRzID0gc2Nvcm0yMDA0X2NvbnN0YW50cztcbmNvbnN0IHJlZ2V4ID0gc2Nvcm0yMDA0X3JlZ2V4O1xuXG4vKipcbiAqIEhlbHBlciBtZXRob2QgZm9yIHRocm93aW5nIFJlYWQgT25seSBlcnJvclxuICovXG5mdW5jdGlvbiB0aHJvd1JlYWRPbmx5RXJyb3IoKSB7XG4gIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5UKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIGZvciB0aHJvd2luZyBXcml0ZSBPbmx5IGVycm9yXG4gKi9cbmZ1bmN0aW9uIHRocm93V3JpdGVPbmx5RXJyb3IoKSB7XG4gIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLldSSVRFX09OTFlfRUxFTUVOVCk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgVHlwZSBNaXNtYXRjaCBlcnJvclxuICovXG5mdW5jdGlvbiB0aHJvd1R5cGVNaXNtYXRjaEVycm9yKCkge1xuICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kLCBubyByZWFzb24gdG8gaGF2ZSB0byBwYXNzIHRoZSBzYW1lIGVycm9yIGNvZGVzIGV2ZXJ5IHRpbWVcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWdleFBhdHRlcm5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWxsb3dFbXB0eVN0cmluZ1xuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gY2hlY2syMDA0VmFsaWRGb3JtYXQoXG4gICAgdmFsdWU6IFN0cmluZyxcbiAgICByZWdleFBhdHRlcm46IFN0cmluZyxcbiAgICBhbGxvd0VtcHR5U3RyaW5nPzogYm9vbGVhbikge1xuICByZXR1cm4gY2hlY2tWYWxpZEZvcm1hdCh2YWx1ZSwgcmVnZXhQYXR0ZXJuLFxuICAgICAgc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gsIGFsbG93RW1wdHlTdHJpbmcpO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QsIG5vIHJlYXNvbiB0byBoYXZlIHRvIHBhc3MgdGhlIHNhbWUgZXJyb3IgY29kZXMgZXZlcnkgdGltZVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9IHJhbmdlUGF0dGVyblxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gY2hlY2syMDA0VmFsaWRSYW5nZSh2YWx1ZTogYW55LCByYW5nZVBhdHRlcm46IFN0cmluZykge1xuICByZXR1cm4gY2hlY2tWYWxpZFJhbmdlKHZhbHVlLCByYW5nZVBhdHRlcm4sXG4gICAgICBzY29ybTIwMDRfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFKTtcbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgY21pIG9iamVjdCBmb3IgU0NPUk0gMjAwNFxuICovXG5leHBvcnQgY2xhc3MgQ01JIGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgdGhlIFNDT1JNIDIwMDQgY21pIG9iamVjdFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGluaXRpYWxpemVkXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihpbml0aWFsaXplZDogYm9vbGVhbikge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmxlYXJuZXJfcHJlZmVyZW5jZSA9IG5ldyBDTUlMZWFybmVyUHJlZmVyZW5jZSgpO1xuICAgIHRoaXMuc2NvcmUgPSBuZXcgU2Nvcm0yMDA0Q01JU2NvcmUoKTtcbiAgICB0aGlzLmNvbW1lbnRzX2Zyb21fbGVhcm5lciA9IG5ldyBDTUlDb21tZW50c0Zyb21MZWFybmVyKCk7XG4gICAgdGhpcy5jb21tZW50c19mcm9tX2xtcyA9IG5ldyBDTUlDb21tZW50c0Zyb21MTVMoKTtcbiAgICB0aGlzLmludGVyYWN0aW9ucyA9IG5ldyBDTUlJbnRlcmFjdGlvbnMoKTtcbiAgICB0aGlzLm9iamVjdGl2ZXMgPSBuZXcgQ01JT2JqZWN0aXZlcygpO1xuXG4gICAgaWYgKGluaXRpYWxpemVkKSB0aGlzLmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICNfdmVyc2lvbiA9ICcxLjAnO1xuICAjX2NoaWxkcmVuID0gY29uc3RhbnRzLmNtaV9jaGlsZHJlbjtcbiAgI2NvbXBsZXRpb25fc3RhdHVzID0gJ3Vua25vd24nO1xuICAjY29tcGxldGlvbl90aHJlc2hvbGQgPSAnJztcbiAgI2NyZWRpdCA9ICdjcmVkaXQnO1xuICAjZW50cnkgPSAnJztcbiAgI2V4aXQgPSAnJztcbiAgI2xhdW5jaF9kYXRhID0gJyc7XG4gICNsZWFybmVyX2lkID0gJyc7XG4gICNsZWFybmVyX25hbWUgPSAnJztcbiAgI2xvY2F0aW9uID0gJyc7XG4gICNtYXhfdGltZV9hbGxvd2VkID0gJyc7XG4gICNtb2RlID0gJ25vcm1hbCc7XG4gICNwcm9ncmVzc19tZWFzdXJlID0gJyc7XG4gICNzY2FsZWRfcGFzc2luZ19zY29yZSA9ICcnO1xuICAjc2Vzc2lvbl90aW1lID0gJ1BUMEgwTTBTJztcbiAgI3N1Y2Nlc3Nfc3RhdHVzID0gJ3Vua25vd24nO1xuICAjc3VzcGVuZF9kYXRhID0gJyc7XG4gICN0aW1lX2xpbWl0X2FjdGlvbiA9ICdjb250aW51ZSxubyBtZXNzYWdlJztcbiAgI3RvdGFsX3RpbWUgPSAnMCc7XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmxlYXJuZXJfcHJlZmVyZW5jZT8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc2NvcmU/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmNvbW1lbnRzX2Zyb21fbGVhcm5lcj8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuY29tbWVudHNfZnJvbV9sbXM/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmludGVyYWN0aW9ucz8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMub2JqZWN0aXZlcz8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI192ZXJzaW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfdmVyc2lvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX3ZlcnNpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX3ZlcnNpb24uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX3ZlcnNpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldCBfdmVyc2lvbihfdmVyc2lvbikge1xuICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI19jaGlsZHJlblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb21wbGV0aW9uX3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29tcGxldGlvbl9zdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbXBsZXRpb25fc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbXBsZXRpb25fc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21wbGV0aW9uX3N0YXR1c1xuICAgKi9cbiAgc2V0IGNvbXBsZXRpb25fc3RhdHVzKGNvbXBsZXRpb25fc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGNvbXBsZXRpb25fc3RhdHVzLCByZWdleC5DTUlDU3RhdHVzKSkge1xuICAgICAgdGhpcy4jY29tcGxldGlvbl9zdGF0dXMgPSBjb21wbGV0aW9uX3N0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29tcGxldGlvbl90aHJlc2hvbGRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbXBsZXRpb25fdGhyZXNob2xkKCkge1xuICAgIHJldHVybiB0aGlzLiNjb21wbGV0aW9uX3RocmVzaG9sZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb21wbGV0aW9uX3RocmVzaG9sZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21wbGV0aW9uX3RocmVzaG9sZFxuICAgKi9cbiAgc2V0IGNvbXBsZXRpb25fdGhyZXNob2xkKGNvbXBsZXRpb25fdGhyZXNob2xkKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNjb21wbGV0aW9uX3RocmVzaG9sZCA9IGNvbXBsZXRpb25fdGhyZXNob2xkIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY3JlZGl0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjcmVkaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NyZWRpdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjcmVkaXQuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY3JlZGl0XG4gICAqL1xuICBzZXQgY3JlZGl0KGNyZWRpdCkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jY3JlZGl0ID0gY3JlZGl0IDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZW50cnlcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGVudHJ5KCkge1xuICAgIHJldHVybiB0aGlzLiNlbnRyeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNlbnRyeS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlbnRyeVxuICAgKi9cbiAgc2V0IGVudHJ5KGVudHJ5KSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNlbnRyeSA9IGVudHJ5IDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZXhpdC4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGV4aXQoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI2V4aXQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZXhpdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXhpdFxuICAgKi9cbiAgc2V0IGV4aXQoZXhpdCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChleGl0LCByZWdleC5DTUlFeGl0KSkge1xuICAgICAgdGhpcy4jZXhpdCA9IGV4aXQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xhdW5jaF9kYXRhXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsYXVuY2hfZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGF1bmNoX2RhdGE7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGF1bmNoX2RhdGEuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGF1bmNoX2RhdGFcbiAgICovXG4gIHNldCBsYXVuY2hfZGF0YShsYXVuY2hfZGF0YSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jbGF1bmNoX2RhdGEgPSBsYXVuY2hfZGF0YSA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xlYXJuZXJfaWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlYXJuZXJfaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xlYXJuZXJfaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGVhcm5lcl9pZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZWFybmVyX2lkXG4gICAqL1xuICBzZXQgbGVhcm5lcl9pZChsZWFybmVyX2lkKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNsZWFybmVyX2lkID0gbGVhcm5lcl9pZCA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xlYXJuZXJfbmFtZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVhcm5lcl9uYW1lKCkge1xuICAgIHJldHVybiB0aGlzLiNsZWFybmVyX25hbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGVhcm5lcl9uYW1lLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlYXJuZXJfbmFtZVxuICAgKi9cbiAgc2V0IGxlYXJuZXJfbmFtZShsZWFybmVyX25hbWUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2xlYXJuZXJfbmFtZSA9IGxlYXJuZXJfbmFtZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xvY2F0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsb2NhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jbG9jYXRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbG9jYXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uXG4gICAqL1xuICBzZXQgbG9jYXRpb24obG9jYXRpb24pIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQobG9jYXRpb24sIHJlZ2V4LkNNSVN0cmluZzEwMDApKSB7XG4gICAgICB0aGlzLiNsb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNtYXhfdGltZV9hbGxvd2VkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBtYXhfdGltZV9hbGxvd2VkKCkge1xuICAgIHJldHVybiB0aGlzLiNtYXhfdGltZV9hbGxvd2VkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI21heF90aW1lX2FsbG93ZWQuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWF4X3RpbWVfYWxsb3dlZFxuICAgKi9cbiAgc2V0IG1heF90aW1lX2FsbG93ZWQobWF4X3RpbWVfYWxsb3dlZCkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jbWF4X3RpbWVfYWxsb3dlZCA9IG1heF90aW1lX2FsbG93ZWQgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNtb2RlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBtb2RlKCkge1xuICAgIHJldHVybiB0aGlzLiNtb2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI21vZGUuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kZVxuICAgKi9cbiAgc2V0IG1vZGUobW9kZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jbW9kZSA9IG1vZGUgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNwcm9ncmVzc19tZWFzdXJlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBwcm9ncmVzc19tZWFzdXJlKCkge1xuICAgIHJldHVybiB0aGlzLiNwcm9ncmVzc19tZWFzdXJlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3Byb2dyZXNzX21lYXN1cmVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb2dyZXNzX21lYXN1cmVcbiAgICovXG4gIHNldCBwcm9ncmVzc19tZWFzdXJlKHByb2dyZXNzX21lYXN1cmUpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQocHJvZ3Jlc3NfbWVhc3VyZSwgcmVnZXguQ01JRGVjaW1hbCkgJiZcbiAgICAgICAgY2hlY2syMDA0VmFsaWRSYW5nZShwcm9ncmVzc19tZWFzdXJlLCByZWdleC5wcm9ncmVzc19yYW5nZSkpIHtcbiAgICAgIHRoaXMuI3Byb2dyZXNzX21lYXN1cmUgPSBwcm9ncmVzc19tZWFzdXJlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzY2FsZWRfcGFzc2luZ19zY29yZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc2NhbGVkX3Bhc3Npbmdfc2NvcmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3NjYWxlZF9wYXNzaW5nX3Njb3JlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3NjYWxlZF9wYXNzaW5nX3Njb3JlLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjYWxlZF9wYXNzaW5nX3Njb3JlXG4gICAqL1xuICBzZXQgc2NhbGVkX3Bhc3Npbmdfc2NvcmUoc2NhbGVkX3Bhc3Npbmdfc2NvcmUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI3NjYWxlZF9wYXNzaW5nX3Njb3JlID0gc2NhbGVkX3Bhc3Npbmdfc2NvcmUgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzZXNzaW9uX3RpbWUuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzZXNzaW9uX3RpbWUoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI3Nlc3Npb25fdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzZXNzaW9uX3RpbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlc3Npb25fdGltZVxuICAgKi9cbiAgc2V0IHNlc3Npb25fdGltZShzZXNzaW9uX3RpbWUpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoc2Vzc2lvbl90aW1lLCByZWdleC5DTUlUaW1lc3BhbikpIHtcbiAgICAgIHRoaXMuI3Nlc3Npb25fdGltZSA9IHNlc3Npb25fdGltZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3VjY2Vzc19zdGF0dXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN1Y2Nlc3Nfc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNzdWNjZXNzX3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdWNjZXNzX3N0YXR1c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gc3VjY2Vzc19zdGF0dXNcbiAgICovXG4gIHNldCBzdWNjZXNzX3N0YXR1cyhzdWNjZXNzX3N0YXR1cykge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChzdWNjZXNzX3N0YXR1cywgcmVnZXguQ01JU1N0YXR1cykpIHtcbiAgICAgIHRoaXMuI3N1Y2Nlc3Nfc3RhdHVzID0gc3VjY2Vzc19zdGF0dXM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N1c3BlbmRfZGF0YVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3VzcGVuZF9kYXRhKCkge1xuICAgIHJldHVybiB0aGlzLiNzdXNwZW5kX2RhdGE7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3VzcGVuZF9kYXRhXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdXNwZW5kX2RhdGFcbiAgICovXG4gIHNldCBzdXNwZW5kX2RhdGEoc3VzcGVuZF9kYXRhKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHN1c3BlbmRfZGF0YSwgcmVnZXguQ01JU3RyaW5nNjQwMDAsIHRydWUpKSB7XG4gICAgICB0aGlzLiNzdXNwZW5kX2RhdGEgPSBzdXNwZW5kX2RhdGE7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWVfbGltaXRfYWN0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lX2xpbWl0X2FjdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jdGltZV9saW1pdF9hY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGltZV9saW1pdF9hY3Rpb24uIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZV9saW1pdF9hY3Rpb25cbiAgICovXG4gIHNldCB0aW1lX2xpbWl0X2FjdGlvbih0aW1lX2xpbWl0X2FjdGlvbikge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jdGltZV9saW1pdF9hY3Rpb24gPSB0aW1lX2xpbWl0X2FjdGlvbiA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RvdGFsX3RpbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRvdGFsX3RpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RvdGFsX3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdG90YWxfdGltZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3RhbF90aW1lXG4gICAqL1xuICBzZXQgdG90YWxfdGltZSh0b3RhbF90aW1lKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiN0b3RhbF90aW1lID0gdG90YWxfdGltZSA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgdGhlIGN1cnJlbnQgc2Vzc2lvbiB0aW1lIHRvIHRoZSBleGlzdGluZyB0b3RhbCB0aW1lLlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IElTTzg2MDEgRHVyYXRpb25cbiAgICovXG4gIGdldEN1cnJlbnRUb3RhbFRpbWUoKSB7XG4gICAgcmV0dXJuIFV0aWwuYWRkVHdvRHVyYXRpb25zKFxuICAgICAgICB0aGlzLiN0b3RhbF90aW1lLFxuICAgICAgICB0aGlzLiNzZXNzaW9uX3RpbWUsXG4gICAgICAgIHNjb3JtMjAwNF9yZWdleC5DTUlUaW1lc3BhbixcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgY29tbWVudHNfZnJvbV9sZWFybmVyOiBDTUlDb21tZW50c0Zyb21MZWFybmVyLFxuICAgKiAgICAgIGNvbW1lbnRzX2Zyb21fbG1zOiBDTUlDb21tZW50c0Zyb21MTVMsXG4gICAqICAgICAgY29tcGxldGlvbl9zdGF0dXM6IHN0cmluZyxcbiAgICogICAgICBjb21wbGV0aW9uX3RocmVzaG9sZDogc3RyaW5nLFxuICAgKiAgICAgIGNyZWRpdDogc3RyaW5nLFxuICAgKiAgICAgIGVudHJ5OiBzdHJpbmcsXG4gICAqICAgICAgZXhpdDogc3RyaW5nLFxuICAgKiAgICAgIGludGVyYWN0aW9uczogQ01JSW50ZXJhY3Rpb25zLFxuICAgKiAgICAgIGxhdW5jaF9kYXRhOiBzdHJpbmcsXG4gICAqICAgICAgbGVhcm5lcl9pZDogc3RyaW5nLFxuICAgKiAgICAgIGxlYXJuZXJfbmFtZTogc3RyaW5nLFxuICAgKiAgICAgIGxlYXJuZXJfcHJlZmVyZW5jZTogQ01JTGVhcm5lclByZWZlcmVuY2UsXG4gICAqICAgICAgbG9jYXRpb246IHN0cmluZyxcbiAgICogICAgICBtYXhfdGltZV9hbGxvd2VkOiBzdHJpbmcsXG4gICAqICAgICAgbW9kZTogc3RyaW5nLFxuICAgKiAgICAgIG9iamVjdGl2ZXM6IENNSU9iamVjdGl2ZXMsXG4gICAqICAgICAgcHJvZ3Jlc3NfbWVhc3VyZTogc3RyaW5nLFxuICAgKiAgICAgIHNjYWxlZF9wYXNzaW5nX3Njb3JlOiBzdHJpbmcsXG4gICAqICAgICAgc2NvcmU6IFNjb3JtMjAwNENNSVNjb3JlLFxuICAgKiAgICAgIHNlc3Npb25fdGltZTogc3RyaW5nLFxuICAgKiAgICAgIHN1Y2Nlc3Nfc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgc3VzcGVuZF9kYXRhOiBzdHJpbmcsXG4gICAqICAgICAgdGltZV9saW1pdF9hY3Rpb246IHN0cmluZyxcbiAgICogICAgICB0b3RhbF90aW1lOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2NvbW1lbnRzX2Zyb21fbGVhcm5lcic6IHRoaXMuY29tbWVudHNfZnJvbV9sZWFybmVyLFxuICAgICAgJ2NvbW1lbnRzX2Zyb21fbG1zJzogdGhpcy5jb21tZW50c19mcm9tX2xtcyxcbiAgICAgICdjb21wbGV0aW9uX3N0YXR1cyc6IHRoaXMuY29tcGxldGlvbl9zdGF0dXMsXG4gICAgICAnY29tcGxldGlvbl90aHJlc2hvbGQnOiB0aGlzLmNvbXBsZXRpb25fdGhyZXNob2xkLFxuICAgICAgJ2NyZWRpdCc6IHRoaXMuY3JlZGl0LFxuICAgICAgJ2VudHJ5JzogdGhpcy5lbnRyeSxcbiAgICAgICdleGl0JzogdGhpcy5leGl0LFxuICAgICAgJ2ludGVyYWN0aW9ucyc6IHRoaXMuaW50ZXJhY3Rpb25zLFxuICAgICAgJ2xhdW5jaF9kYXRhJzogdGhpcy5sYXVuY2hfZGF0YSxcbiAgICAgICdsZWFybmVyX2lkJzogdGhpcy5sZWFybmVyX2lkLFxuICAgICAgJ2xlYXJuZXJfbmFtZSc6IHRoaXMubGVhcm5lcl9uYW1lLFxuICAgICAgJ2xlYXJuZXJfcHJlZmVyZW5jZSc6IHRoaXMubGVhcm5lcl9wcmVmZXJlbmNlLFxuICAgICAgJ2xvY2F0aW9uJzogdGhpcy5sb2NhdGlvbixcbiAgICAgICdtYXhfdGltZV9hbGxvd2VkJzogdGhpcy5tYXhfdGltZV9hbGxvd2VkLFxuICAgICAgJ21vZGUnOiB0aGlzLm1vZGUsXG4gICAgICAnb2JqZWN0aXZlcyc6IHRoaXMub2JqZWN0aXZlcyxcbiAgICAgICdwcm9ncmVzc19tZWFzdXJlJzogdGhpcy5wcm9ncmVzc19tZWFzdXJlLFxuICAgICAgJ3NjYWxlZF9wYXNzaW5nX3Njb3JlJzogdGhpcy5zY2FsZWRfcGFzc2luZ19zY29yZSxcbiAgICAgICdzY29yZSc6IHRoaXMuc2NvcmUsXG4gICAgICAnc2Vzc2lvbl90aW1lJzogdGhpcy5zZXNzaW9uX3RpbWUsXG4gICAgICAnc3VjY2Vzc19zdGF0dXMnOiB0aGlzLnN1Y2Nlc3Nfc3RhdHVzLFxuICAgICAgJ3N1c3BlbmRfZGF0YSc6IHRoaXMuc3VzcGVuZF9kYXRhLFxuICAgICAgJ3RpbWVfbGltaXRfYWN0aW9uJzogdGhpcy50aW1lX2xpbWl0X2FjdGlvbixcbiAgICAgICd0b3RhbF90aW1lJzogdGhpcy50b3RhbF90aW1lLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIFNDT1JNIDIwMDQncyBjbWkubGVhcm5lcl9wcmVmZXJlbmNlIG9iamVjdFxuICovXG5jbGFzcyBDTUlMZWFybmVyUHJlZmVyZW5jZSBleHRlbmRzIEJhc2VDTUkge1xuICAjX2NoaWxkcmVuID0gY29uc3RhbnRzLnN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbjtcbiAgI2F1ZGlvX2xldmVsID0gJzEnO1xuICAjbGFuZ3VhZ2UgPSAnJztcbiAgI2RlbGl2ZXJ5X3NwZWVkID0gJzEnO1xuICAjYXVkaW9fY2FwdGlvbmluZyA9ICcwJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5sZWFybmVyX3ByZWZlcmVuY2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX2NoaWxkcmVuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX2NoaWxkcmVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2F1ZGlvX2xldmVsXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBhdWRpb19sZXZlbCgpIHtcbiAgICByZXR1cm4gdGhpcy4jYXVkaW9fbGV2ZWw7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjYXVkaW9fbGV2ZWxcbiAgICogQHBhcmFtIHtzdHJpbmd9IGF1ZGlvX2xldmVsXG4gICAqL1xuICBzZXQgYXVkaW9fbGV2ZWwoYXVkaW9fbGV2ZWwpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoYXVkaW9fbGV2ZWwsIHJlZ2V4LkNNSURlY2ltYWwpICYmXG4gICAgICAgIGNoZWNrMjAwNFZhbGlkUmFuZ2UoYXVkaW9fbGV2ZWwsIHJlZ2V4LmF1ZGlvX3JhbmdlKSkge1xuICAgICAgdGhpcy4jYXVkaW9fbGV2ZWwgPSBhdWRpb19sZXZlbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGFuZ3VhZ2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxhbmd1YWdlKCkge1xuICAgIHJldHVybiB0aGlzLiNsYW5ndWFnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsYW5ndWFnZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGFuZ3VhZ2VcbiAgICovXG4gIHNldCBsYW5ndWFnZShsYW5ndWFnZSkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChsYW5ndWFnZSwgcmVnZXguQ01JTGFuZykpIHtcbiAgICAgIHRoaXMuI2xhbmd1YWdlID0gbGFuZ3VhZ2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2RlbGl2ZXJ5X3NwZWVkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBkZWxpdmVyeV9zcGVlZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jZGVsaXZlcnlfc3BlZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZGVsaXZlcnlfc3BlZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlbGl2ZXJ5X3NwZWVkXG4gICAqL1xuICBzZXQgZGVsaXZlcnlfc3BlZWQoZGVsaXZlcnlfc3BlZWQpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoZGVsaXZlcnlfc3BlZWQsIHJlZ2V4LkNNSURlY2ltYWwpICYmXG4gICAgICAgIGNoZWNrMjAwNFZhbGlkUmFuZ2UoZGVsaXZlcnlfc3BlZWQsIHJlZ2V4LnNwZWVkX3JhbmdlKSkge1xuICAgICAgdGhpcy4jZGVsaXZlcnlfc3BlZWQgPSBkZWxpdmVyeV9zcGVlZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjYXVkaW9fY2FwdGlvbmluZ1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgYXVkaW9fY2FwdGlvbmluZygpIHtcbiAgICByZXR1cm4gdGhpcy4jYXVkaW9fY2FwdGlvbmluZztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNhdWRpb19jYXB0aW9uaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdWRpb19jYXB0aW9uaW5nXG4gICAqL1xuICBzZXQgYXVkaW9fY2FwdGlvbmluZyhhdWRpb19jYXB0aW9uaW5nKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGF1ZGlvX2NhcHRpb25pbmcsIHJlZ2V4LkNNSVNJbnRlZ2VyKSAmJlxuICAgICAgICBjaGVjazIwMDRWYWxpZFJhbmdlKGF1ZGlvX2NhcHRpb25pbmcsIHJlZ2V4LnRleHRfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiNhdWRpb19jYXB0aW9uaW5nID0gYXVkaW9fY2FwdGlvbmluZztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkubGVhcm5lcl9wcmVmZXJlbmNlXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgYXVkaW9fbGV2ZWw6IHN0cmluZyxcbiAgICogICAgICBsYW5ndWFnZTogc3RyaW5nLFxuICAgKiAgICAgIGRlbGl2ZXJ5X3NwZWVkOiBzdHJpbmcsXG4gICAqICAgICAgYXVkaW9fY2FwdGlvbmluZzogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdhdWRpb19sZXZlbCc6IHRoaXMuYXVkaW9fbGV2ZWwsXG4gICAgICAnbGFuZ3VhZ2UnOiB0aGlzLmxhbmd1YWdlLFxuICAgICAgJ2RlbGl2ZXJ5X3NwZWVkJzogdGhpcy5kZWxpdmVyeV9zcGVlZCxcbiAgICAgICdhdWRpb19jYXB0aW9uaW5nJzogdGhpcy5hdWRpb19jYXB0aW9uaW5nLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDIwMDQncyBjbWkuaW50ZXJhY3Rpb25zIG9iamVjdFxuICovXG5jbGFzcyBDTUlJbnRlcmFjdGlvbnMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLm9iamVjdGl2ZXMgQXJyYXlcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHtcbiAgICAgIGNoaWxkcmVuOiBjb25zdGFudHMuaW50ZXJhY3Rpb25zX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGNtaS5vYmplY3RpdmVzIG9iamVjdFxuICovXG5jbGFzcyBDTUlPYmplY3RpdmVzIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5vYmplY3RpdmVzIEFycmF5XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogY29uc3RhbnRzLm9iamVjdGl2ZXNfY2hpbGRyZW4sXG4gICAgICBlcnJvckNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmNvbW1lbnRzX2Zyb21fbG1zIG9iamVjdFxuICovXG5jbGFzcyBDTUlDb21tZW50c0Zyb21MTVMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmNvbW1lbnRzX2Zyb21fbG1zIEFycmF5XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogY29uc3RhbnRzLmNvbW1lbnRzX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGNtaS5jb21tZW50c19mcm9tX2xlYXJuZXIgb2JqZWN0XG4gKi9cbmNsYXNzIENNSUNvbW1lbnRzRnJvbUxlYXJuZXIgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmNvbW1lbnRzX2Zyb21fbGVhcm5lciBBcnJheVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe1xuICAgICAgY2hpbGRyZW46IGNvbnN0YW50cy5jb21tZW50c19jaGlsZHJlbixcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5ULFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIFNDT1JNIDIwMDQncyBjbWkuaW50ZXJhY3Rpb24ubiBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAjaWQgPSAnJztcbiAgI3R5cGUgPSAnJztcbiAgI3RpbWVzdGFtcCA9ICcnO1xuICAjd2VpZ2h0aW5nID0gJyc7XG4gICNsZWFybmVyX3Jlc3BvbnNlID0gJyc7XG4gICNyZXN1bHQgPSAnJztcbiAgI2xhdGVuY3kgPSAnJztcbiAgI2Rlc2NyaXB0aW9uID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb24ublxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMub2JqZWN0aXZlcyA9IG5ldyBDTUlBcnJheSh7XG4gICAgICBlcnJvckNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCxcbiAgICAgIGNoaWxkcmVuOiBjb25zdGFudHMub2JqZWN0aXZlc19jaGlsZHJlbixcbiAgICB9KTtcbiAgICB0aGlzLmNvcnJlY3RfcmVzcG9uc2VzID0gbmV3IENNSUFycmF5KHtcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5ULFxuICAgICAgY2hpbGRyZW46IGNvbnN0YW50cy5jb3JyZWN0X3Jlc3BvbnNlc19jaGlsZHJlbixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5vYmplY3RpdmVzPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5jb3JyZWN0X3Jlc3BvbnNlcz8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2lkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjaWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBzZXQgaWQoaWQpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoaWQsIHJlZ2V4LkNNSUxvbmdJZGVudGlmaWVyKSkge1xuICAgICAgdGhpcy4jaWQgPSBpZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdHlwZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jdHlwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0eXBlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gICAqL1xuICBzZXQgdHlwZSh0eXBlKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHR5cGUsIHJlZ2V4LkNNSVR5cGUpKSB7XG4gICAgICB0aGlzLiN0eXBlID0gdHlwZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZXN0YW1wXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lc3RhbXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWVzdGFtcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lc3RhbXBcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVzdGFtcFxuICAgKi9cbiAgc2V0IHRpbWVzdGFtcCh0aW1lc3RhbXApIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQodGltZXN0YW1wLCByZWdleC5DTUlUaW1lKSkge1xuICAgICAgdGhpcy4jdGltZXN0YW1wID0gdGltZXN0YW1wO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN3ZWlnaHRpbmdcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHdlaWdodGluZygpIHtcbiAgICByZXR1cm4gdGhpcy4jd2VpZ2h0aW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3dlaWdodGluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gd2VpZ2h0aW5nXG4gICAqL1xuICBzZXQgd2VpZ2h0aW5nKHdlaWdodGluZykge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdCh3ZWlnaHRpbmcsIHJlZ2V4LkNNSURlY2ltYWwpKSB7XG4gICAgICB0aGlzLiN3ZWlnaHRpbmcgPSB3ZWlnaHRpbmc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xlYXJuZXJfcmVzcG9uc2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlYXJuZXJfcmVzcG9uc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xlYXJuZXJfcmVzcG9uc2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGVhcm5lcl9yZXNwb25zZS4gRG9lcyB0eXBlIHZhbGlkYXRpb24gdG8gbWFrZSBzdXJlIHJlc3BvbnNlXG4gICAqIG1hdGNoZXMgU0NPUk0gMjAwNCdzIHNwZWNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlYXJuZXJfcmVzcG9uc2VcbiAgICovXG4gIHNldCBsZWFybmVyX3Jlc3BvbnNlKGxlYXJuZXJfcmVzcG9uc2UpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMudHlwZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoXG4gICAgICAgICAgc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkRFUEVOREVOQ1lfTk9UX0VTVEFCTElTSEVEKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG5vZGVzID0gW107XG4gICAgICBjb25zdCByZXNwb25zZV90eXBlID0gbGVhcm5lcl9yZXNwb25zZXNbdGhpcy50eXBlXTtcbiAgICAgIGlmIChyZXNwb25zZV90eXBlLmRlbGltaXRlciAhPT0gJycpIHtcbiAgICAgICAgbm9kZXMgPSBsZWFybmVyX3Jlc3BvbnNlLnNwbGl0KHJlc3BvbnNlX3R5cGUuZGVsaW1pdGVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGVzWzBdID0gbGVhcm5lcl9yZXNwb25zZTtcbiAgICAgIH1cblxuICAgICAgaWYgKChub2Rlcy5sZW5ndGggPiAwKSAmJiAobm9kZXMubGVuZ3RoIDw9IHJlc3BvbnNlX3R5cGUubWF4KSkge1xuICAgICAgICBjb25zdCBmb3JtYXRSZWdleCA9IG5ldyBSZWdFeHAocmVzcG9uc2VfdHlwZS5mb3JtYXQpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiByZXNwb25zZV90eXBlLmRlbGltaXRlcjIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBub2Rlc1tpXS5zcGxpdChyZXNwb25zZV90eXBlLmRlbGltaXRlcjIpO1xuICAgICAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgaWYgKCF2YWx1ZXNbMF0ubWF0Y2goZm9ybWF0UmVnZXgpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3dUeXBlTWlzbWF0Y2hFcnJvcigpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghdmFsdWVzWzFdLm1hdGNoKG5ldyBSZWdFeHAocmVzcG9uc2VfdHlwZS5mb3JtYXQyKSkpIHtcbiAgICAgICAgICAgICAgICAgIHRocm93VHlwZU1pc21hdGNoRXJyb3IoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93VHlwZU1pc21hdGNoRXJyb3IoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFub2Rlc1tpXS5tYXRjaChmb3JtYXRSZWdleCkpIHtcbiAgICAgICAgICAgICAgdGhyb3dUeXBlTWlzbWF0Y2hFcnJvcigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKG5vZGVzW2ldICE9PSAnJyAmJiByZXNwb25zZV90eXBlLnVuaXF1ZSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgICAgICAgICAgICBpZiAobm9kZXNbaV0gPT09IG5vZGVzW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93VHlwZU1pc21hdGNoRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNyZXN1bHRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHJlc3VsdCgpIHtcbiAgICByZXR1cm4gdGhpcy4jcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3Jlc3VsdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVzdWx0XG4gICAqL1xuICBzZXQgcmVzdWx0KHJlc3VsdCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChyZXN1bHQsIHJlZ2V4LkNNSVJlc3VsdCkpIHtcbiAgICAgIHRoaXMuI3Jlc3VsdCA9IHJlc3VsdDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGF0ZW5jeVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGF0ZW5jeSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGF0ZW5jeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsYXRlbmN5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsYXRlbmN5XG4gICAqL1xuICBzZXQgbGF0ZW5jeShsYXRlbmN5KSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGxhdGVuY3ksIHJlZ2V4LkNNSVRpbWVzcGFuKSkge1xuICAgICAgdGhpcy4jbGF0ZW5jeSA9IGxhdGVuY3k7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2Rlc2NyaXB0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBkZXNjcmlwdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jZGVzY3JpcHRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZGVzY3JpcHRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyaXB0aW9uXG4gICAqL1xuICBzZXQgZGVzY3JpcHRpb24oZGVzY3JpcHRpb24pIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoZGVzY3JpcHRpb24sIHJlZ2V4LkNNSUxhbmdTdHJpbmcyNTAsIHRydWUpKSB7XG4gICAgICB0aGlzLiNkZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5pbnRlcmFjdGlvbnMublxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGlkOiBzdHJpbmcsXG4gICAqICAgICAgdHlwZTogc3RyaW5nLFxuICAgKiAgICAgIG9iamVjdGl2ZXM6IENNSUFycmF5LFxuICAgKiAgICAgIHRpbWVzdGFtcDogc3RyaW5nLFxuICAgKiAgICAgIGNvcnJlY3RfcmVzcG9uc2VzOiBDTUlBcnJheSxcbiAgICogICAgICB3ZWlnaHRpbmc6IHN0cmluZyxcbiAgICogICAgICBsZWFybmVyX3Jlc3BvbnNlOiBzdHJpbmcsXG4gICAqICAgICAgcmVzdWx0OiBzdHJpbmcsXG4gICAqICAgICAgbGF0ZW5jeTogc3RyaW5nLFxuICAgKiAgICAgIGRlc2NyaXB0aW9uOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICAgICd0eXBlJzogdGhpcy50eXBlLFxuICAgICAgJ29iamVjdGl2ZXMnOiB0aGlzLm9iamVjdGl2ZXMsXG4gICAgICAndGltZXN0YW1wJzogdGhpcy50aW1lc3RhbXAsXG4gICAgICAnd2VpZ2h0aW5nJzogdGhpcy53ZWlnaHRpbmcsXG4gICAgICAnbGVhcm5lcl9yZXNwb25zZSc6IHRoaXMubGVhcm5lcl9yZXNwb25zZSxcbiAgICAgICdyZXN1bHQnOiB0aGlzLnJlc3VsdCxcbiAgICAgICdsYXRlbmN5JzogdGhpcy5sYXRlbmN5LFxuICAgICAgJ2Rlc2NyaXB0aW9uJzogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgICdjb3JyZWN0X3Jlc3BvbnNlcyc6IHRoaXMuY29ycmVjdF9yZXNwb25zZXMsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgU0NPUk0gMjAwNCdzIGNtaS5vYmplY3RpdmVzLm4gb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlPYmplY3RpdmVzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNpZCA9ICcnO1xuICAjc3VjY2Vzc19zdGF0dXMgPSAndW5rbm93bic7XG4gICNjb21wbGV0aW9uX3N0YXR1cyA9ICd1bmtub3duJztcbiAgI3Byb2dyZXNzX21lYXN1cmUgPSAnJztcbiAgI2Rlc2NyaXB0aW9uID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkub2JqZWN0aXZlcy5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zY29yZSA9IG5ldyBTY29ybTIwMDRDTUlTY29yZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnNjb3JlPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLiNpZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNpZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICovXG4gIHNldCBpZChpZCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChpZCwgcmVnZXguQ01JTG9uZ0lkZW50aWZpZXIpKSB7XG4gICAgICB0aGlzLiNpZCA9IGlkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdWNjZXNzX3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3VjY2Vzc19zdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N1Y2Nlc3Nfc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N1Y2Nlc3Nfc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdWNjZXNzX3N0YXR1c1xuICAgKi9cbiAgc2V0IHN1Y2Nlc3Nfc3RhdHVzKHN1Y2Nlc3Nfc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHN1Y2Nlc3Nfc3RhdHVzLCByZWdleC5DTUlTU3RhdHVzKSkge1xuICAgICAgdGhpcy4jc3VjY2Vzc19zdGF0dXMgPSBzdWNjZXNzX3N0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29tcGxldGlvbl9zdGF0dXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbXBsZXRpb25fc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNjb21wbGV0aW9uX3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb21wbGV0aW9uX3N0YXR1c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY29tcGxldGlvbl9zdGF0dXNcbiAgICovXG4gIHNldCBjb21wbGV0aW9uX3N0YXR1cyhjb21wbGV0aW9uX3N0YXR1cykge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChjb21wbGV0aW9uX3N0YXR1cywgcmVnZXguQ01JQ1N0YXR1cykpIHtcbiAgICAgIHRoaXMuI2NvbXBsZXRpb25fc3RhdHVzID0gY29tcGxldGlvbl9zdGF0dXM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3Byb2dyZXNzX21lYXN1cmVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHByb2dyZXNzX21lYXN1cmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3Byb2dyZXNzX21lYXN1cmU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcHJvZ3Jlc3NfbWVhc3VyZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvZ3Jlc3NfbWVhc3VyZVxuICAgKi9cbiAgc2V0IHByb2dyZXNzX21lYXN1cmUocHJvZ3Jlc3NfbWVhc3VyZSkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChwcm9ncmVzc19tZWFzdXJlLCByZWdleC5DTUlEZWNpbWFsKSAmJlxuICAgICAgICBjaGVjazIwMDRWYWxpZFJhbmdlKHByb2dyZXNzX21lYXN1cmUsIHJlZ2V4LnByb2dyZXNzX3JhbmdlKSkge1xuICAgICAgdGhpcy4jcHJvZ3Jlc3NfbWVhc3VyZSA9IHByb2dyZXNzX21lYXN1cmU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2Rlc2NyaXB0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBkZXNjcmlwdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jZGVzY3JpcHRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZGVzY3JpcHRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyaXB0aW9uXG4gICAqL1xuICBzZXQgZGVzY3JpcHRpb24oZGVzY3JpcHRpb24pIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoZGVzY3JpcHRpb24sIHJlZ2V4LkNNSUxhbmdTdHJpbmcyNTAsIHRydWUpKSB7XG4gICAgICB0aGlzLiNkZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5vYmplY3RpdmVzLm5cbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBpZDogc3RyaW5nLFxuICAgKiAgICAgIHN1Y2Nlc3Nfc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgY29tcGxldGlvbl9zdGF0dXM6IHN0cmluZyxcbiAgICogICAgICBwcm9ncmVzc19tZWFzdXJlOiBzdHJpbmcsXG4gICAqICAgICAgZGVzY3JpcHRpb246IHN0cmluZyxcbiAgICogICAgICBzY29yZTogU2Nvcm0yMDA0Q01JU2NvcmVcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICAgICdzdWNjZXNzX3N0YXR1cyc6IHRoaXMuc3VjY2Vzc19zdGF0dXMsXG4gICAgICAnY29tcGxldGlvbl9zdGF0dXMnOiB0aGlzLmNvbXBsZXRpb25fc3RhdHVzLFxuICAgICAgJ3Byb2dyZXNzX21lYXN1cmUnOiB0aGlzLnByb2dyZXNzX21lYXN1cmUsXG4gICAgICAnZGVzY3JpcHRpb24nOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgJ3Njb3JlJzogdGhpcy5zY29yZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBTQ09STSAyMDA0J3MgY21pICouc2NvcmUgb2JqZWN0XG4gKi9cbmNsYXNzIFNjb3JtMjAwNENNSVNjb3JlIGV4dGVuZHMgQ01JU2NvcmUge1xuICAjc2NhbGVkID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkgKi5zY29yZVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoXG4gICAgICAgIHtcbiAgICAgICAgICBzY29yZV9jaGlsZHJlbjogY29uc3RhbnRzLnNjb3JlX2NoaWxkcmVuLFxuICAgICAgICAgIG1heDogJycsXG4gICAgICAgICAgaW52YWxpZEVycm9yQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5ULFxuICAgICAgICAgIGludmFsaWRUeXBlQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gsXG4gICAgICAgICAgaW52YWxpZFJhbmdlQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRSxcbiAgICAgICAgICBkZWNpbWFsUmVnZXg6IHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsLFxuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzY2FsZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHNjYWxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jc2NhbGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3NjYWxlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NhbGVkXG4gICAqL1xuICBzZXQgc2NhbGVkKHNjYWxlZCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChzY2FsZWQsIHJlZ2V4LkNNSURlY2ltYWwpICYmXG4gICAgICAgIGNoZWNrMjAwNFZhbGlkUmFuZ2Uoc2NhbGVkLCByZWdleC5zY2FsZWRfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiNzY2FsZWQgPSBzY2FsZWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pICouc2NvcmVcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBzY2FsZWQ6IHN0cmluZyxcbiAgICogICAgICByYXc6IHN0cmluZyxcbiAgICogICAgICBtaW46IHN0cmluZyxcbiAgICogICAgICBtYXg6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnc2NhbGVkJzogdGhpcy5zY2FsZWQsXG4gICAgICAncmF3Jzogc3VwZXIucmF3LFxuICAgICAgJ21pbic6IHN1cGVyLm1pbixcbiAgICAgICdtYXgnOiBzdXBlci5tYXgsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGNtaS5jb21tZW50c19mcm9tX2xlYXJuZXIubiBhbmQgY21pLmNvbW1lbnRzX2Zyb21fbG1zLm4gb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlDb21tZW50c09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAjY29tbWVudCA9ICcnO1xuICAjbG9jYXRpb24gPSAnJztcbiAgI3RpbWVzdGFtcCA9ICcnO1xuICAjcmVhZE9ubHlBZnRlckluaXQ7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuY29tbWVudHNfZnJvbV9sZWFybmVyLm4gYW5kIGNtaS5jb21tZW50c19mcm9tX2xtcy5uXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVhZE9ubHlBZnRlckluaXRcbiAgICovXG4gIGNvbnN0cnVjdG9yKHJlYWRPbmx5QWZ0ZXJJbml0ID0gZmFsc2UpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuI2NvbW1lbnQgPSAnJztcbiAgICB0aGlzLiNsb2NhdGlvbiA9ICcnO1xuICAgIHRoaXMuI3RpbWVzdGFtcCA9ICcnO1xuICAgIHRoaXMuI3JlYWRPbmx5QWZ0ZXJJbml0ID0gcmVhZE9ubHlBZnRlckluaXQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29tbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29tbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy4jY29tbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb21tZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21tZW50XG4gICAqL1xuICBzZXQgY29tbWVudChjb21tZW50KSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQgJiYgdGhpcy4jcmVhZE9ubHlBZnRlckluaXQpIHtcbiAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoY29tbWVudCwgcmVnZXguQ01JTGFuZ1N0cmluZzQwMDAsIHRydWUpKSB7XG4gICAgICAgIHRoaXMuI2NvbW1lbnQgPSBjb21tZW50O1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsb2NhdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xvY2F0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xvY2F0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvblxuICAgKi9cbiAgc2V0IGxvY2F0aW9uKGxvY2F0aW9uKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQgJiYgdGhpcy4jcmVhZE9ubHlBZnRlckluaXQpIHtcbiAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQobG9jYXRpb24sIHJlZ2V4LkNNSVN0cmluZzI1MCkpIHtcbiAgICAgICAgdGhpcy4jbG9jYXRpb24gPSBsb2NhdGlvbjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZXN0YW1wXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lc3RhbXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWVzdGFtcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lc3RhbXBcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVzdGFtcFxuICAgKi9cbiAgc2V0IHRpbWVzdGFtcCh0aW1lc3RhbXApIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNyZWFkT25seUFmdGVySW5pdCkge1xuICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdCh0aW1lc3RhbXAsIHJlZ2V4LkNNSVRpbWUpKSB7XG4gICAgICAgIHRoaXMuI3RpbWVzdGFtcCA9IHRpbWVzdGFtcDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuY29tbWVudHNfZnJvbV9sZWFybmVyLm4gb2JqZWN0XG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgY29tbWVudDogc3RyaW5nLFxuICAgKiAgICAgIGxvY2F0aW9uOiBzdHJpbmcsXG4gICAqICAgICAgdGltZXN0YW1wOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2NvbW1lbnQnOiB0aGlzLmNvbW1lbnQsXG4gICAgICAnbG9jYXRpb24nOiB0aGlzLmxvY2F0aW9uLFxuICAgICAgJ3RpbWVzdGFtcCc6IHRoaXMudGltZXN0YW1wLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDIwMDQncyBjbWkuaW50ZXJhY3Rpb25zLm4ub2JqZWN0aXZlcy5uIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JSW50ZXJhY3Rpb25zT2JqZWN0aXZlc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAjaWQgPSAnJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5pbnRlcmFjdGlvbnMubi5vYmplY3RpdmVzLm5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLiNpZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNpZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICovXG4gIHNldCBpZChpZCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChpZCwgcmVnZXguQ01JTG9uZ0lkZW50aWZpZXIpKSB7XG4gICAgICB0aGlzLiNpZCA9IGlkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5pbnRlcmFjdGlvbnMubi5vYmplY3RpdmVzLm5cbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBpZDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdpZCc6IHRoaXMuaWQsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGNtaS5pbnRlcmFjdGlvbnMubi5jb3JyZWN0X3Jlc3BvbnNlcy5uIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JSW50ZXJhY3Rpb25zQ29ycmVjdFJlc3BvbnNlc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAjcGF0dGVybiA9ICcnO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmludGVyYWN0aW9ucy5uLmNvcnJlY3RfcmVzcG9uc2VzLm5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjcGF0dGVyblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgcGF0dGVybigpIHtcbiAgICByZXR1cm4gdGhpcy4jcGF0dGVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNwYXR0ZXJuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXR0ZXJuXG4gICAqL1xuICBzZXQgcGF0dGVybihwYXR0ZXJuKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHBhdHRlcm4sIHJlZ2V4LkNNSUZlZWRiYWNrKSkge1xuICAgICAgdGhpcy4jcGF0dGVybiA9IHBhdHRlcm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBjbWkuaW50ZXJhY3Rpb25zLm4uY29ycmVjdF9yZXNwb25zZXMubiBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBwYXR0ZXJuOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3BhdHRlcm4nOiB0aGlzLnBhdHRlcm4sXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGFkbCBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIEFETCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGFkbFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubmF2ID0gbmV3IEFETE5hdigpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLm5hdj8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgYWRsXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgbmF2OiB7XG4gICAqICAgICAgICByZXF1ZXN0OiBzdHJpbmdcbiAgICogICAgICB9XG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICduYXYnOiB0aGlzLm5hdixcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgYWRsLm5hdiBvYmplY3RcbiAqL1xuY2xhc3MgQURMTmF2IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNyZXF1ZXN0ID0gJ19ub25lXyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBhZGwubmF2XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5yZXF1ZXN0X3ZhbGlkID0gbmV3IEFETE5hdlJlcXVlc3RWYWxpZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnJlcXVlc3RfdmFsaWQ/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNyZXF1ZXN0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCByZXF1ZXN0KCkge1xuICAgIHJldHVybiB0aGlzLiNyZXF1ZXN0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3JlcXVlc3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3RcbiAgICovXG4gIHNldCByZXF1ZXN0KHJlcXVlc3QpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQocmVxdWVzdCwgcmVnZXguTkFWRXZlbnQpKSB7XG4gICAgICB0aGlzLiNyZXF1ZXN0ID0gcmVxdWVzdDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBhZGwubmF2XG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgcmVxdWVzdDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdyZXF1ZXN0JzogdGhpcy5yZXF1ZXN0LFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDIwMDQncyBhZGwubmF2LnJlcXVlc3RfdmFsaWQgb2JqZWN0XG4gKi9cbmNsYXNzIEFETE5hdlJlcXVlc3RWYWxpZCBleHRlbmRzIEJhc2VDTUkge1xuICAjY29udGludWUgPSAndW5rbm93bic7XG4gICNwcmV2aW91cyA9ICd1bmtub3duJztcbiAgY2hvaWNlID0gY2xhc3Mge1xuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRhcmdldCBpcyB2YWxpZFxuICAgICAqIEBwYXJhbSB7Kn0gX3RhcmdldFxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBfaXNUYXJnZXRWYWxpZCA9IChfdGFyZ2V0KSA9PiAndW5rbm93bic7XG4gIH07XG4gIGp1bXAgPSBjbGFzcyB7XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGFyZ2V0IGlzIHZhbGlkXG4gICAgICogQHBhcmFtIHsqfSBfdGFyZ2V0XG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIF9pc1RhcmdldFZhbGlkID0gKF90YXJnZXQpID0+ICd1bmtub3duJztcbiAgfTtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGFkbC5uYXYucmVxdWVzdF92YWxpZFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb250aW51ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29udGludWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbnRpbnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbnRpbnVlLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHsqfSBfXG4gICAqL1xuICBzZXQgY29udGludWUoXykge1xuICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3ByZXZpb3VzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBwcmV2aW91cygpIHtcbiAgICByZXR1cm4gdGhpcy4jcHJldmlvdXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcHJldmlvdXMuIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0geyp9IF9cbiAgICovXG4gIHNldCBwcmV2aW91cyhfKSB7XG4gICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBhZGwubmF2LnJlcXVlc3RfdmFsaWRcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBwcmV2aW91czogc3RyaW5nLFxuICAgKiAgICAgIGNvbnRpbnVlOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3ByZXZpb3VzJzogdGhpcy5wcmV2aW91cyxcbiAgICAgICdjb250aW51ZSc6IHRoaXMuY29udGludWUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiIsIi8vIEBmbG93XG5cbmV4cG9ydCBjb25zdCBnbG9iYWxfY29uc3RhbnRzID0ge1xuICBTQ09STV9UUlVFOiAndHJ1ZScsXG4gIFNDT1JNX0ZBTFNFOiAnZmFsc2UnLFxuICBTVEFURV9OT1RfSU5JVElBTElaRUQ6IDAsXG4gIFNUQVRFX0lOSVRJQUxJWkVEOiAxLFxuICBTVEFURV9URVJNSU5BVEVEOiAyLFxuICBMT0dfTEVWRUxfREVCVUc6IDEsXG4gIExPR19MRVZFTF9JTkZPOiAyLFxuICBMT0dfTEVWRUxfV0FSTklORzogMyxcbiAgTE9HX0xFVkVMX0VSUk9SOiA0LFxuICBMT0dfTEVWRUxfTk9ORTogNSxcbn07XG5cbmV4cG9ydCBjb25zdCBzY29ybTEyX2NvbnN0YW50cyA9IHtcbiAgLy8gQ2hpbGRyZW4gbGlzdHNcbiAgY21pX2NoaWxkcmVuOiAnY29yZSxzdXNwZW5kX2RhdGEsbGF1bmNoX2RhdGEsY29tbWVudHMsb2JqZWN0aXZlcyxzdHVkZW50X2RhdGEsc3R1ZGVudF9wcmVmZXJlbmNlLGludGVyYWN0aW9ucycsXG4gIGNvcmVfY2hpbGRyZW46ICdzdHVkZW50X2lkLHN0dWRlbnRfbmFtZSxsZXNzb25fbG9jYXRpb24sY3JlZGl0LGxlc3Nvbl9zdGF0dXMsZW50cnksc2NvcmUsdG90YWxfdGltZSxsZXNzb25fbW9kZSxleGl0LHNlc3Npb25fdGltZScsXG4gIHNjb3JlX2NoaWxkcmVuOiAncmF3LG1pbixtYXgnLFxuICBjb21tZW50c19jaGlsZHJlbjogJ2NvbnRlbnQsbG9jYXRpb24sdGltZScsXG4gIG9iamVjdGl2ZXNfY2hpbGRyZW46ICdpZCxzY29yZSxzdGF0dXMnLFxuICBjb3JyZWN0X3Jlc3BvbnNlc19jaGlsZHJlbjogJ3BhdHRlcm4nLFxuICBzdHVkZW50X2RhdGFfY2hpbGRyZW46ICdtYXN0ZXJ5X3Njb3JlLG1heF90aW1lX2FsbG93ZWQsdGltZV9saW1pdF9hY3Rpb24nLFxuICBzdHVkZW50X3ByZWZlcmVuY2VfY2hpbGRyZW46ICdhdWRpbyxsYW5ndWFnZSxzcGVlZCx0ZXh0JyxcbiAgaW50ZXJhY3Rpb25zX2NoaWxkcmVuOiAnaWQsb2JqZWN0aXZlcyx0aW1lLHR5cGUsY29ycmVjdF9yZXNwb25zZXMsd2VpZ2h0aW5nLHN0dWRlbnRfcmVzcG9uc2UscmVzdWx0LGxhdGVuY3knLFxuXG4gIGVycm9yX2Rlc2NyaXB0aW9uczoge1xuICAgICcxMDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIEV4Y2VwdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTm8gc3BlY2lmaWMgZXJyb3IgY29kZSBleGlzdHMgdG8gZGVzY3JpYmUgdGhlIGVycm9yLiBVc2UgTE1TR2V0RGlhZ25vc3RpYyBmb3IgbW9yZSBpbmZvcm1hdGlvbicsXG4gICAgfSxcbiAgICAnMjAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnSW52YWxpZCBhcmd1bWVudCBlcnJvcicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIHRoYXQgYW4gYXJndW1lbnQgcmVwcmVzZW50cyBhbiBpbnZhbGlkIGRhdGEgbW9kZWwgZWxlbWVudCBvciBpcyBvdGhlcndpc2UgaW5jb3JyZWN0LicsXG4gICAgfSxcbiAgICAnMjAyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRWxlbWVudCBjYW5ub3QgaGF2ZSBjaGlsZHJlbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIHRoYXQgTE1TR2V0VmFsdWUgd2FzIGNhbGxlZCB3aXRoIGEgZGF0YSBtb2RlbCBlbGVtZW50IG5hbWUgdGhhdCBlbmRzIGluIFwiX2NoaWxkcmVuXCIgZm9yIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgZG9lcyBub3Qgc3VwcG9ydCB0aGUgXCJfY2hpbGRyZW5cIiBzdWZmaXguJyxcbiAgICB9LFxuICAgICcyMDMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdFbGVtZW50IG5vdCBhbiBhcnJheSAtIGNhbm5vdCBoYXZlIGNvdW50JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgdGhhdCBMTVNHZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSBkYXRhIG1vZGVsIGVsZW1lbnQgbmFtZSB0aGF0IGVuZHMgaW4gXCJfY291bnRcIiBmb3IgYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBkb2VzIG5vdCBzdXBwb3J0IHRoZSBcIl9jb3VudFwiIHN1ZmZpeC4nLFxuICAgIH0sXG4gICAgJzMwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ05vdCBpbml0aWFsaXplZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIHRoYXQgYW4gQVBJIGNhbGwgd2FzIG1hZGUgYmVmb3JlIHRoZSBjYWxsIHRvIGxtc0luaXRpYWxpemUuJyxcbiAgICB9LFxuICAgICc0MDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdOb3QgaW1wbGVtZW50ZWQgZXJyb3InLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1RoZSBkYXRhIG1vZGVsIGVsZW1lbnQgaW5kaWNhdGVkIGluIGEgY2FsbCB0byBMTVNHZXRWYWx1ZSBvciBMTVNTZXRWYWx1ZSBpcyB2YWxpZCwgYnV0IHdhcyBub3QgaW1wbGVtZW50ZWQgYnkgdGhpcyBMTVMuIFNDT1JNIDEuMiBkZWZpbmVzIGEgc2V0IG9mIGRhdGEgbW9kZWwgZWxlbWVudHMgYXMgYmVpbmcgb3B0aW9uYWwgZm9yIGFuIExNUyB0byBpbXBsZW1lbnQuJyxcbiAgICB9LFxuICAgICc0MDInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdJbnZhbGlkIHNldCB2YWx1ZSwgZWxlbWVudCBpcyBhIGtleXdvcmQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyB0aGF0IExNU1NldFZhbHVlIHdhcyBjYWxsZWQgb24gYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCByZXByZXNlbnRzIGEga2V5d29yZCAoZWxlbWVudHMgdGhhdCBlbmQgaW4gXCJfY2hpbGRyZW5cIiBhbmQgXCJfY291bnRcIikuJyxcbiAgICB9LFxuICAgICc0MDMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdFbGVtZW50IGlzIHJlYWQgb25seScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTE1TU2V0VmFsdWUgd2FzIGNhbGxlZCB3aXRoIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgY2FuIG9ubHkgYmUgcmVhZC4nLFxuICAgIH0sXG4gICAgJzQwNCc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0VsZW1lbnQgaXMgd3JpdGUgb25seScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTE1TR2V0VmFsdWUgd2FzIGNhbGxlZCBvbiBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IGNhbiBvbmx5IGJlIHdyaXR0ZW4gdG8uJyxcbiAgICB9LFxuICAgICc0MDUnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdJbmNvcnJlY3QgRGF0YSBUeXBlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdMTVNTZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSB2YWx1ZSB0aGF0IGlzIG5vdCBjb25zaXN0ZW50IHdpdGggdGhlIGRhdGEgZm9ybWF0IG9mIHRoZSBzdXBwbGllZCBkYXRhIG1vZGVsIGVsZW1lbnQuJyxcbiAgICB9LFxuICB9LFxufTtcblxuZXhwb3J0IGNvbnN0IGFpY2NfY29uc3RhbnRzID0ge1xuICAuLi5zY29ybTEyX2NvbnN0YW50cywgLi4ue1xuICAgIGNtaV9jaGlsZHJlbjogJ2NvcmUsc3VzcGVuZF9kYXRhLGxhdW5jaF9kYXRhLGNvbW1lbnRzLG9iamVjdGl2ZXMsc3R1ZGVudF9kYXRhLHN0dWRlbnRfcHJlZmVyZW5jZSxpbnRlcmFjdGlvbnMsZXZhbHVhdGlvbicsXG4gICAgc3R1ZGVudF9kYXRhX2NoaWxkcmVuOiAnYXR0ZW1wdF9udW1iZXIsdHJpZXMsbWFzdGVyeV9zY29yZSxtYXhfdGltZV9hbGxvd2VkLHRpbWVfbGltaXRfYWN0aW9uJyxcbiAgICB0cmllc19jaGlsZHJlbjogJ3RpbWUsc3RhdHVzLHNjb3JlJyxcbiAgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBzY29ybTIwMDRfY29uc3RhbnRzID0ge1xuICAvLyBDaGlsZHJlbiBsaXN0c1xuICBjbWlfY2hpbGRyZW46ICdfdmVyc2lvbixjb21tZW50c19mcm9tX2xlYXJuZXIsY29tbWVudHNfZnJvbV9sbXMsY29tcGxldGlvbl9zdGF0dXMsY3JlZGl0LGVudHJ5LGV4aXQsaW50ZXJhY3Rpb25zLGxhdW5jaF9kYXRhLGxlYXJuZXJfaWQsbGVhcm5lcl9uYW1lLGxlYXJuZXJfcHJlZmVyZW5jZSxsb2NhdGlvbixtYXhfdGltZV9hbGxvd2VkLG1vZGUsb2JqZWN0aXZlcyxwcm9ncmVzc19tZWFzdXJlLHNjYWxlZF9wYXNzaW5nX3Njb3JlLHNjb3JlLHNlc3Npb25fdGltZSxzdWNjZXNzX3N0YXR1cyxzdXNwZW5kX2RhdGEsdGltZV9saW1pdF9hY3Rpb24sdG90YWxfdGltZScsXG4gIGNvbW1lbnRzX2NoaWxkcmVuOiAnY29tbWVudCx0aW1lc3RhbXAsbG9jYXRpb24nLFxuICBzY29yZV9jaGlsZHJlbjogJ21heCxyYXcsc2NhbGVkLG1pbicsXG4gIG9iamVjdGl2ZXNfY2hpbGRyZW46ICdwcm9ncmVzc19tZWFzdXJlLGNvbXBsZXRpb25fc3RhdHVzLHN1Y2Nlc3Nfc3RhdHVzLGRlc2NyaXB0aW9uLHNjb3JlLGlkJyxcbiAgY29ycmVjdF9yZXNwb25zZXNfY2hpbGRyZW46ICdwYXR0ZXJuJyxcbiAgc3R1ZGVudF9kYXRhX2NoaWxkcmVuOiAnbWFzdGVyeV9zY29yZSxtYXhfdGltZV9hbGxvd2VkLHRpbWVfbGltaXRfYWN0aW9uJyxcbiAgc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuOiAnYXVkaW9fbGV2ZWwsYXVkaW9fY2FwdGlvbmluZyxkZWxpdmVyeV9zcGVlZCxsYW5ndWFnZScsXG4gIGludGVyYWN0aW9uc19jaGlsZHJlbjogJ2lkLHR5cGUsb2JqZWN0aXZlcyx0aW1lc3RhbXAsY29ycmVjdF9yZXNwb25zZXMsd2VpZ2h0aW5nLGxlYXJuZXJfcmVzcG9uc2UscmVzdWx0LGxhdGVuY3ksZGVzY3JpcHRpb24nLFxuXG4gIGVycm9yX2Rlc2NyaXB0aW9uczoge1xuICAgICcwJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnTm8gRXJyb3InLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ05vIGVycm9yIG9jY3VycmVkLCB0aGUgcHJldmlvdXMgQVBJIGNhbGwgd2FzIHN1Y2Nlc3NmdWwuJyxcbiAgICB9LFxuICAgICcxMDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIEV4Y2VwdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTm8gc3BlY2lmaWMgZXJyb3IgY29kZSBleGlzdHMgdG8gZGVzY3JpYmUgdGhlIGVycm9yLiBVc2UgR2V0RGlhZ25vc3RpYyBmb3IgbW9yZSBpbmZvcm1hdGlvbi4nLFxuICAgIH0sXG4gICAgJzEwMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgSW5pdGlhbGl6YXRpb24gRmFpbHVyZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBJbml0aWFsaXplIGZhaWxlZCBmb3IgYW4gdW5rbm93biByZWFzb24uJyxcbiAgICB9LFxuICAgICcxMDMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdBbHJlYWR5IEluaXRpYWxpemVkJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIEluaXRpYWxpemUgZmFpbGVkIGJlY2F1c2UgSW5pdGlhbGl6ZSB3YXMgYWxyZWFkeSBjYWxsZWQuJyxcbiAgICB9LFxuICAgICcxMDQnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdDb250ZW50IEluc3RhbmNlIFRlcm1pbmF0ZWQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gSW5pdGlhbGl6ZSBmYWlsZWQgYmVjYXVzZSBUZXJtaW5hdGUgd2FzIGFscmVhZHkgY2FsbGVkLicsXG4gICAgfSxcbiAgICAnMTExJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBUZXJtaW5hdGlvbiBGYWlsdXJlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIFRlcm1pbmF0ZSBmYWlsZWQgZm9yIGFuIHVua25vd24gcmVhc29uLicsXG4gICAgfSxcbiAgICAnMTEyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnVGVybWluYXRpb24gQmVmb3JlIEluaXRpYWxpemF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIFRlcm1pbmF0ZSBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBiZWZvcmUgdGhlIGNhbGwgdG8gSW5pdGlhbGl6ZS4nLFxuICAgIH0sXG4gICAgJzExMyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1Rlcm1pbmF0aW9uIEFmdGVyIFRlcm1pbmF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIFRlcm1pbmF0ZSBmYWlsZWQgYmVjYXVzZSBUZXJtaW5hdGUgd2FzIGFscmVhZHkgY2FsbGVkLicsXG4gICAgfSxcbiAgICAnMTIyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnUmV0cmlldmUgRGF0YSBCZWZvcmUgSW5pdGlhbGl6YXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gR2V0VmFsdWUgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYmVmb3JlIHRoZSBjYWxsIHRvIEluaXRpYWxpemUuJyxcbiAgICB9LFxuICAgICcxMjMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdSZXRyaWV2ZSBEYXRhIEFmdGVyIFRlcm1pbmF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIEdldFZhbHVlIGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGFmdGVyIHRoZSBjYWxsIHRvIFRlcm1pbmF0ZS4nLFxuICAgIH0sXG4gICAgJzEzMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1N0b3JlIERhdGEgQmVmb3JlIEluaXRpYWxpemF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIFNldFZhbHVlIGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGJlZm9yZSB0aGUgY2FsbCB0byBJbml0aWFsaXplLicsXG4gICAgfSxcbiAgICAnMTMzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnU3RvcmUgRGF0YSBBZnRlciBUZXJtaW5hdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBTZXRWYWx1ZSBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBhZnRlciB0aGUgY2FsbCB0byBUZXJtaW5hdGUuJyxcbiAgICB9LFxuICAgICcxNDInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdDb21taXQgQmVmb3JlIEluaXRpYWxpemF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIENvbW1pdCBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBiZWZvcmUgdGhlIGNhbGwgdG8gSW5pdGlhbGl6ZS4nLFxuICAgIH0sXG4gICAgJzE0Myc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0NvbW1pdCBBZnRlciBUZXJtaW5hdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBDb21taXQgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYWZ0ZXIgdGhlIGNhbGwgdG8gVGVybWluYXRlLicsXG4gICAgfSxcbiAgICAnMjAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBBcmd1bWVudCBFcnJvcicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQW4gaW52YWxpZCBhcmd1bWVudCB3YXMgcGFzc2VkIHRvIGFuIEFQSSBtZXRob2QgKHVzdWFsbHkgaW5kaWNhdGVzIHRoYXQgSW5pdGlhbGl6ZSwgQ29tbWl0IG9yIFRlcm1pbmF0ZSBkaWQgbm90IHJlY2VpdmUgdGhlIGV4cGVjdGVkIGVtcHR5IHN0cmluZyBhcmd1bWVudC4nLFxuICAgIH0sXG4gICAgJzMwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgR2V0IEZhaWx1cmUnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyBhIGZhaWxlZCBHZXRWYWx1ZSBjYWxsIHdoZXJlIG5vIG90aGVyIHNwZWNpZmljIGVycm9yIGNvZGUgaXMgYXBwbGljYWJsZS4gVXNlIEdldERpYWdub3N0aWMgZm9yIG1vcmUgaW5mb3JtYXRpb24uJyxcbiAgICB9LFxuICAgICczNTEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIFNldCBGYWlsdXJlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgYSBmYWlsZWQgU2V0VmFsdWUgY2FsbCB3aGVyZSBubyBvdGhlciBzcGVjaWZpYyBlcnJvciBjb2RlIGlzIGFwcGxpY2FibGUuIFVzZSBHZXREaWFnbm9zdGljIGZvciBtb3JlIGluZm9ybWF0aW9uLicsXG4gICAgfSxcbiAgICAnMzkxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBDb21taXQgRmFpbHVyZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIGEgZmFpbGVkIENvbW1pdCBjYWxsIHdoZXJlIG5vIG90aGVyIHNwZWNpZmljIGVycm9yIGNvZGUgaXMgYXBwbGljYWJsZS4gVXNlIEdldERpYWdub3N0aWMgZm9yIG1vcmUgaW5mb3JtYXRpb24uJyxcbiAgICB9LFxuICAgICc0MDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdVbmRlZmluZWQgRGF0YSBNb2RlbCBFbGVtZW50JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdUaGUgZGF0YSBtb2RlbCBlbGVtZW50IG5hbWUgcGFzc2VkIHRvIEdldFZhbHVlIG9yIFNldFZhbHVlIGlzIG5vdCBhIHZhbGlkIFNDT1JNIGRhdGEgbW9kZWwgZWxlbWVudC4nLFxuICAgIH0sXG4gICAgJzQwMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1VuaW1wbGVtZW50ZWQgRGF0YSBNb2RlbCBFbGVtZW50JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdUaGUgZGF0YSBtb2RlbCBlbGVtZW50IGluZGljYXRlZCBpbiBhIGNhbGwgdG8gR2V0VmFsdWUgb3IgU2V0VmFsdWUgaXMgdmFsaWQsIGJ1dCB3YXMgbm90IGltcGxlbWVudGVkIGJ5IHRoaXMgTE1TLiBJbiBTQ09STSAyMDA0LCB0aGlzIGVycm9yIHdvdWxkIGluZGljYXRlIGFuIExNUyB0aGF0IGlzIG5vdCBmdWxseSBTQ09STSBjb25mb3JtYW50LicsXG4gICAgfSxcbiAgICAnNDAzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBFbGVtZW50IFZhbHVlIE5vdCBJbml0aWFsaXplZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQXR0ZW1wdCB0byByZWFkIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkIGJ5IHRoZSBMTVMgb3IgdGhyb3VnaCBhIFNldFZhbHVlIGNhbGwuIFRoaXMgZXJyb3IgY29uZGl0aW9uIGlzIG9mdGVuIHJlYWNoZWQgZHVyaW5nIG5vcm1hbCBleGVjdXRpb24gb2YgYSBTQ08uJyxcbiAgICB9LFxuICAgICc0MDQnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdEYXRhIE1vZGVsIEVsZW1lbnQgSXMgUmVhZCBPbmx5JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdTZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBjYW4gb25seSBiZSByZWFkLicsXG4gICAgfSxcbiAgICAnNDA1Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBFbGVtZW50IElzIFdyaXRlIE9ubHknLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0dldFZhbHVlIHdhcyBjYWxsZWQgb24gYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBjYW4gb25seSBiZSB3cml0dGVuIHRvLicsXG4gICAgfSxcbiAgICAnNDA2Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBFbGVtZW50IFR5cGUgTWlzbWF0Y2gnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1NldFZhbHVlIHdhcyBjYWxsZWQgd2l0aCBhIHZhbHVlIHRoYXQgaXMgbm90IGNvbnNpc3RlbnQgd2l0aCB0aGUgZGF0YSBmb3JtYXQgb2YgdGhlIHN1cHBsaWVkIGRhdGEgbW9kZWwgZWxlbWVudC4nLFxuICAgIH0sXG4gICAgJzQwNyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0RhdGEgTW9kZWwgRWxlbWVudCBWYWx1ZSBPdXQgT2YgUmFuZ2UnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1RoZSBudW1lcmljIHZhbHVlIHN1cHBsaWVkIHRvIGEgU2V0VmFsdWUgY2FsbCBpcyBvdXRzaWRlIG9mIHRoZSBudW1lcmljIHJhbmdlIGFsbG93ZWQgZm9yIHRoZSBzdXBwbGllZCBkYXRhIG1vZGVsIGVsZW1lbnQuJyxcbiAgICB9LFxuICAgICc0MDgnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdEYXRhIE1vZGVsIERlcGVuZGVuY3kgTm90IEVzdGFibGlzaGVkJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdTb21lIGRhdGEgbW9kZWwgZWxlbWVudHMgY2Fubm90IGJlIHNldCB1bnRpbCBhbm90aGVyIGRhdGEgbW9kZWwgZWxlbWVudCB3YXMgc2V0LiBUaGlzIGVycm9yIGNvbmRpdGlvbiBpbmRpY2F0ZXMgdGhhdCB0aGUgcHJlcmVxdWlzaXRlIGVsZW1lbnQgd2FzIG5vdCBzZXQgYmVmb3JlIHRoZSBkZXBlbmRlbnQgZWxlbWVudC4nLFxuICAgIH0sXG4gIH0sXG59O1xuIiwiLy8gQGZsb3dcbmV4cG9ydCBjb25zdCBlcnJvcl9jb2RlcyA9IHtcbiAgR0VORVJBTDogMTAxLFxuICBJTklUSUFMSVpBVElPTl9GQUlMRUQ6IDEwMSxcbiAgSU5JVElBTElaRUQ6IDEwMSxcbiAgVEVSTUlOQVRFRDogMTAxLFxuICBURVJNSU5BVElPTl9GQUlMVVJFOiAxMDEsXG4gIFRFUk1JTkFUSU9OX0JFRk9SRV9JTklUOiAxMDEsXG4gIE1VTFRJUExFX1RFUk1JTkFUSU9OOiAxMDEsXG4gIFJFVFJJRVZFX0JFRk9SRV9JTklUOiAxMDEsXG4gIFJFVFJJRVZFX0FGVEVSX1RFUk06IDEwMSxcbiAgU1RPUkVfQkVGT1JFX0lOSVQ6IDEwMSxcbiAgU1RPUkVfQUZURVJfVEVSTTogMTAxLFxuICBDT01NSVRfQkVGT1JFX0lOSVQ6IDEwMSxcbiAgQ09NTUlUX0FGVEVSX1RFUk06IDEwMSxcbiAgQVJHVU1FTlRfRVJST1I6IDEwMSxcbiAgQ0hJTERSRU5fRVJST1I6IDEwMSxcbiAgQ09VTlRfRVJST1I6IDEwMSxcbiAgR0VORVJBTF9HRVRfRkFJTFVSRTogMTAxLFxuICBHRU5FUkFMX1NFVF9GQUlMVVJFOiAxMDEsXG4gIEdFTkVSQUxfQ09NTUlUX0ZBSUxVUkU6IDEwMSxcbiAgVU5ERUZJTkVEX0RBVEFfTU9ERUw6IDEwMSxcbiAgVU5JTVBMRU1FTlRFRF9FTEVNRU5UOiAxMDEsXG4gIFZBTFVFX05PVF9JTklUSUFMSVpFRDogMTAxLFxuICBJTlZBTElEX1NFVF9WQUxVRTogMTAxLFxuICBSRUFEX09OTFlfRUxFTUVOVDogMTAxLFxuICBXUklURV9PTkxZX0VMRU1FTlQ6IDEwMSxcbiAgVFlQRV9NSVNNQVRDSDogMTAxLFxuICBWQUxVRV9PVVRfT0ZfUkFOR0U6IDEwMSxcbiAgREVQRU5ERU5DWV9OT1RfRVNUQUJMSVNIRUQ6IDEwMSxcbn07XG5cbmV4cG9ydCBjb25zdCBzY29ybTEyX2Vycm9yX2NvZGVzID0ge1xuICAuLi5lcnJvcl9jb2RlcywgLi4ue1xuICAgIFJFVFJJRVZFX0JFRk9SRV9JTklUOiAzMDEsXG4gICAgU1RPUkVfQkVGT1JFX0lOSVQ6IDMwMSxcbiAgICBDT01NSVRfQkVGT1JFX0lOSVQ6IDMwMSxcbiAgICBBUkdVTUVOVF9FUlJPUjogMjAxLFxuICAgIENISUxEUkVOX0VSUk9SOiAyMDIsXG4gICAgQ09VTlRfRVJST1I6IDIwMyxcbiAgICBVTkRFRklORURfREFUQV9NT0RFTDogNDAxLFxuICAgIFVOSU1QTEVNRU5URURfRUxFTUVOVDogNDAxLFxuICAgIFZBTFVFX05PVF9JTklUSUFMSVpFRDogMzAxLFxuICAgIElOVkFMSURfU0VUX1ZBTFVFOiA0MDIsXG4gICAgUkVBRF9PTkxZX0VMRU1FTlQ6IDQwMyxcbiAgICBXUklURV9PTkxZX0VMRU1FTlQ6IDQwNCxcbiAgICBUWVBFX01JU01BVENIOiA0MDUsXG4gICAgVkFMVUVfT1VUX09GX1JBTkdFOiA0MDcsXG4gICAgREVQRU5ERU5DWV9OT1RfRVNUQUJMSVNIRUQ6IDQwOCxcbiAgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBzY29ybTIwMDRfZXJyb3JfY29kZXMgPSB7XG4gIC4uLmVycm9yX2NvZGVzLCAuLi57XG4gICAgSU5JVElBTElaQVRJT05fRkFJTEVEOiAxMDIsXG4gICAgSU5JVElBTElaRUQ6IDEwMyxcbiAgICBURVJNSU5BVEVEOiAxMDQsXG4gICAgVEVSTUlOQVRJT05fRkFJTFVSRTogMTExLFxuICAgIFRFUk1JTkFUSU9OX0JFRk9SRV9JTklUOiAxMTIsXG4gICAgTVVMVElQTEVfVEVSTUlOQVRJT05TOiAxMTMsXG4gICAgUkVUUklFVkVfQkVGT1JFX0lOSVQ6IDEyMixcbiAgICBSRVRSSUVWRV9BRlRFUl9URVJNOiAxMjMsXG4gICAgU1RPUkVfQkVGT1JFX0lOSVQ6IDEzMixcbiAgICBTVE9SRV9BRlRFUl9URVJNOiAxMzMsXG4gICAgQ09NTUlUX0JFRk9SRV9JTklUOiAxNDIsXG4gICAgQ09NTUlUX0FGVEVSX1RFUk06IDE0MyxcbiAgICBBUkdVTUVOVF9FUlJPUjogMjAxLFxuICAgIEdFTkVSQUxfR0VUX0ZBSUxVUkU6IDMwMSxcbiAgICBHRU5FUkFMX1NFVF9GQUlMVVJFOiAzNTEsXG4gICAgR0VORVJBTF9DT01NSVRfRkFJTFVSRTogMzkxLFxuICAgIFVOREVGSU5FRF9EQVRBX01PREVMOiA0MDEsXG4gICAgVU5JTVBMRU1FTlRFRF9FTEVNRU5UOiA0MDIsXG4gICAgVkFMVUVfTk9UX0lOSVRJQUxJWkVEOiA0MDMsXG4gICAgUkVBRF9PTkxZX0VMRU1FTlQ6IDQwNCxcbiAgICBXUklURV9PTkxZX0VMRU1FTlQ6IDQwNSxcbiAgICBUWVBFX01JU01BVENIOiA0MDYsXG4gICAgVkFMVUVfT1VUX09GX1JBTkdFOiA0MDcsXG4gICAgREVQRU5ERU5DWV9OT1RfRVNUQUJMSVNIRUQ6IDQwOCxcbiAgfSxcbn07XG4iLCJjb25zdCBjb21tb25fdmFsdWVzID0ge1xuICB2YWxpZFJlc3VsdDogW1xuICAgICdjb3JyZWN0JyxcbiAgICAnd3JvbmcnLFxuICAgICd1bmFudGljaXBhdGVkJyxcbiAgICAnbmV1dHJhbCcsXG4gIF0sXG4gIGludmFsaWRSZXN1bHQ6IFtcbiAgICAnLTEwMDAwJyxcbiAgICAnMTAwMDAnLFxuICAgICdpbnZhbGlkJyxcbiAgXSxcblxuICB2YWxpZDBUbzFSYW5nZTogW1xuICAgICcwLjAnLFxuICAgICcwLjI1JyxcbiAgICAnMC41JyxcbiAgICAnMS4wJyxcbiAgXSxcbiAgaW52YWxpZDBUbzFSYW5nZTogW1xuICAgICctMScsXG4gICAgJy0wLjEnLFxuICAgICcxLjEnLFxuICAgICcuMjUnLFxuICBdLFxuXG4gIHZhbGlkMFRvMTAwUmFuZ2U6IFtcbiAgICAnMScsXG4gICAgJzUwJyxcbiAgICAnMTAwJyxcbiAgXSxcbiAgaW52YWxpZDBUbzEwMFJhbmdlOiBbXG4gICAgJ2ludmFsaWQnLFxuICAgICdhMTAwJyxcbiAgICAnLTEnLFxuICBdLFxuXG4gIHZhbGlkU2NhbGVkUmFuZ2U6IFtcbiAgICAnMScsXG4gICAgJzAuNScsXG4gICAgJzAnLFxuICAgICctMC41JyxcbiAgICAnLTEnLFxuICBdLFxuICBpbnZhbGlkU2NhbGVkUmFuZ2U6IFtcbiAgICAnLTEwMScsXG4gICAgJzI1LjEnLFxuICAgICc1MC41JyxcbiAgICAnNzUnLFxuICAgICcxMDAnLFxuICBdLFxuXG4gIHZhbGlkSW50ZWdlclNjYWxlZFJhbmdlOiBbXG4gICAgJzEnLFxuICAgICcwJyxcbiAgICAnLTEnLFxuICBdLFxuICBpbnZhbGlkSW50ZWdlclNjYWxlZFJhbmdlOiBbXG4gICAgJy0xMDEnLFxuICAgICctMC41JyxcbiAgICAnMC41JyxcbiAgICAnMjUuMScsXG4gICAgJzUwLjUnLFxuICAgICc3NScsXG4gICAgJzEwMCcsXG4gIF0sXG59O1xuXG5leHBvcnQgY29uc3Qgc2Nvcm0xMl92YWx1ZXMgPSB7XG4gIC4uLmNvbW1vbl92YWx1ZXMsIC4uLntcbiAgICB2YWxpZExlc3NvblN0YXR1czogW1xuICAgICAgJ3Bhc3NlZCcsXG4gICAgICAnY29tcGxldGVkJyxcbiAgICAgICdmYWlsZWQnLFxuICAgICAgJ2luY29tcGxldGUnLFxuICAgICAgJ2Jyb3dzZWQnLFxuICAgIF0sXG4gICAgaW52YWxpZExlc3NvblN0YXR1czogW1xuICAgICAgJ1Bhc3NlZCcsXG4gICAgICAnUCcsXG4gICAgICAnRicsXG4gICAgICAncCcsXG4gICAgICAndHJ1ZScsXG4gICAgICAnZmFsc2UnLFxuICAgICAgJ2NvbXBsZXRlJyxcbiAgICBdLFxuXG4gICAgdmFsaWRFeGl0OiBbXG4gICAgICAndGltZS1vdXQnLFxuICAgICAgJ3N1c3BlbmQnLFxuICAgICAgJ2xvZ291dCcsXG4gICAgXSxcbiAgICBpbnZhbGlkRXhpdDogW1xuICAgICAgJ2Nsb3NlJyxcbiAgICAgICdleGl0JyxcbiAgICAgICdjcmFzaCcsXG4gICAgXSxcblxuICAgIHZhbGlkVHlwZTogW1xuICAgICAgJ3RydWUtZmFsc2UnLFxuICAgICAgJ2Nob2ljZScsXG4gICAgICAnZmlsbC1pbicsXG4gICAgICAnbWF0Y2hpbmcnLFxuICAgICAgJ3BlcmZvcm1hbmNlJyxcbiAgICAgICdzZXF1ZW5jaW5nJyxcbiAgICAgICdsaWtlcnQnLFxuICAgICAgJ251bWVyaWMnLFxuICAgIF0sXG4gICAgaW52YWxpZFR5cGU6IFtcbiAgICAgICdjb3JyZWN0JyxcbiAgICAgICd3cm9uZycsXG4gICAgICAnbG9nb3V0JyxcbiAgICBdLFxuXG4gICAgdmFsaWRTcGVlZFJhbmdlOiBbXG4gICAgICAnMScsXG4gICAgICAnNTAnLFxuICAgICAgJzEwMCcsXG4gICAgICAnLTEnLFxuICAgICAgJy01MCcsXG4gICAgICAnLTEwMCcsXG4gICAgXSxcbiAgICBpbnZhbGlkU3BlZWRSYW5nZTogW1xuICAgICAgJ2ludmFsaWQnLFxuICAgICAgJ2ExMDAnLFxuICAgICAgJy0xMDEnLFxuICAgICAgJzEwMScsXG4gICAgICAnLTEwMDAwMCcsXG4gICAgICAnMTAwMDAwJyxcbiAgICBdLFxuXG4gICAgdmFsaWRTY29yZVJhbmdlOiBbXG4gICAgICAnMScsXG4gICAgICAnNTAuMjUnLFxuICAgICAgJzEwMCcsXG4gICAgXSxcbiAgICBpbnZhbGlkU2NvcmVSYW5nZTogW1xuICAgICAgJ2ludmFsaWQnLFxuICAgICAgJ2ExMDAnLFxuICAgICAgJy0xJyxcbiAgICAgICcxMDEnLFxuICAgICAgJy0xMDAwMDAnLFxuICAgICAgJzEwMDAwMCcsXG4gICAgXSxcbiAgICBpbnZhbGlkMFRvMTAwUmFuZ2U6IFtcbiAgICAgICdpbnZhbGlkJyxcbiAgICAgICdhMTAwJyxcbiAgICAgICctMicsXG4gICAgXSxcblxuICAgIHZhbGlkVGltZTogW1xuICAgICAgJzEwOjA2OjU3JyxcbiAgICAgICcyMzo1OTo1OScsXG4gICAgICAnMDA6MDA6MDAnLFxuICAgIF0sXG4gICAgaW52YWxpZFRpbWU6IFtcbiAgICAgICc0Nzo1OTo1OScsXG4gICAgICAnMDA6MDA6MDEuNTYnLFxuICAgICAgJzA2OjU6MTMnLFxuICAgICAgJzIzOjU5OjU5LjEyMycsXG4gICAgICAnUDFEVDIzSDU5TTU5UycsXG4gICAgXSxcblxuICAgIHZhbGlkVGltZXNwYW46IFtcbiAgICAgICcxMDowNjo1NycsXG4gICAgICAnMDA6MDA6MDEuNTYnLFxuICAgICAgJzIzOjU5OjU5JyxcbiAgICAgICc0Nzo1OTo1OScsXG4gICAgXSxcbiAgICBpbnZhbGlkVGltZXNwYW46IFtcbiAgICAgICcwNjo1OjEzJyxcbiAgICAgICcyMzo1OTo1OS4xMjMnLFxuICAgICAgJ1AxRFQyM0g1OU01OVMnLFxuICAgIF0sXG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3Qgc2Nvcm0yMDA0X3ZhbHVlcyA9IHtcbiAgLi4uY29tbW9uX3ZhbHVlcywgLi4ue1xuICAgIC8vIHZhbGlkIGZpZWxkIHZhbHVlc1xuICAgIHZhbGlkVGltZXN0YW1wczogW1xuICAgICAgJzIwMTktMDYtMjUnLFxuICAgICAgJzIwMTktMDYtMjVUMjM6NTknLFxuICAgICAgJzIwMTktMDYtMjVUMjM6NTk6NTkuOTknLFxuICAgICAgJzE5NzAtMDEtMDEnLFxuICAgIF0sXG4gICAgaW52YWxpZFRpbWVzdGFtcHM6IFtcbiAgICAgICcyMDE5LTA2LTI1VCcsXG4gICAgICAnMjAxOS0wNi0yNVQyMzo1OTo1OS45OTknLFxuICAgICAgJzIwMTktMDYtMjVUMjU6NTk6NTkuOTknLFxuICAgICAgJzIwMTktMTMtMzEnLFxuICAgICAgJzE5NjktMTItMzEnLFxuICAgICAgJy0wMDowMDozMCcsXG4gICAgICAnMDo1MDozMCcsXG4gICAgICAnMjM6MDA6MzAuJyxcbiAgICBdLFxuXG4gICAgdmFsaWRDU3RhdHVzOiBbXG4gICAgICAnY29tcGxldGVkJyxcbiAgICAgICdpbmNvbXBsZXRlJyxcbiAgICAgICdub3QgYXR0ZW1wdGVkJyxcbiAgICAgICd1bmtub3duJyxcbiAgICBdLFxuICAgIGludmFsaWRDU3RhdHVzOiBbXG4gICAgICAnY29tcGxldGUnLFxuICAgICAgJ3Bhc3NlZCcsXG4gICAgICAnZmFpbGVkJyxcbiAgICBdLFxuXG4gICAgdmFsaWRTU3RhdHVzOiBbXG4gICAgICAncGFzc2VkJyxcbiAgICAgICdmYWlsZWQnLFxuICAgICAgJ3Vua25vd24nLFxuICAgIF0sXG4gICAgaW52YWxpZFNTdGF0dXM6IFtcbiAgICAgICdjb21wbGV0ZScsXG4gICAgICAnaW5jb21wbGV0ZScsXG4gICAgICAnUCcsXG4gICAgICAnZicsXG4gICAgXSxcblxuICAgIHZhbGlkRXhpdDogW1xuICAgICAgJ3RpbWUtb3V0JyxcbiAgICAgICdzdXNwZW5kJyxcbiAgICAgICdsb2dvdXQnLFxuICAgICAgJ25vcm1hbCcsXG4gICAgXSxcbiAgICBpbnZhbGlkRXhpdDogW1xuICAgICAgJ2Nsb3NlJyxcbiAgICAgICdleGl0JyxcbiAgICAgICdjcmFzaCcsXG4gICAgXSxcblxuICAgIHZhbGlkVHlwZTogW1xuICAgICAgJ3RydWUtZmFsc2UnLFxuICAgICAgJ2Nob2ljZScsXG4gICAgICAnZmlsbC1pbicsXG4gICAgICAnbG9uZy1maWxsLWluJyxcbiAgICAgICdtYXRjaGluZycsXG4gICAgICAncGVyZm9ybWFuY2UnLFxuICAgICAgJ3NlcXVlbmNpbmcnLFxuICAgICAgJ2xpa2VydCcsXG4gICAgICAnbnVtZXJpYycsXG4gICAgICAnb3RoZXInLFxuICAgIF0sXG4gICAgaW52YWxpZFR5cGU6IFtcbiAgICAgICdjb3JyZWN0JyxcbiAgICAgICd3cm9uZycsXG4gICAgICAnbG9nb3V0JyxcbiAgICBdLFxuXG4gICAgdmFsaWRTY29yZVJhbmdlOiBbXG4gICAgICAnMScsXG4gICAgICAnNTAnLFxuICAgICAgJzEwMCcsXG4gICAgICAnLTEwMDAwJyxcbiAgICAgICctMScsXG4gICAgICAnMTAwMDAnLFxuICAgIF0sXG4gICAgaW52YWxpZFNjb3JlUmFuZ2U6IFtcbiAgICAgICdpbnZhbGlkJyxcbiAgICAgICdhMTAwJyxcbiAgICAgICctMTAwMDAwJyxcbiAgICAgICcxMDAwMDAnLFxuICAgIF0sXG5cbiAgICB2YWxpZElTTzg2MDFEdXJhdGlvbnM6IFtcbiAgICAgICdQMVkzNERUMjNINDVNMTVTJyxcbiAgICAgICdQVDFNNDVTJyxcbiAgICAgICdQMFMnLFxuICAgICAgJ1BUNzVNJyxcbiAgICBdLFxuICAgIGludmFsaWRJU084NjAxRHVyYXRpb25zOiBbXG4gICAgICAnMDA6MDg6NDUnLFxuICAgICAgJy1QMUgnLFxuICAgICAgJzF5NDVEJyxcbiAgICAgICcwJyxcbiAgICBdLFxuXG4gICAgdmFsaWRDb21tZW50OiBbXG4gICAgICAne2xhbmc9ZW4tOTh9IGxlYXJuZXIgY29tbWVudCcsXG4gICAgICAne2xhbmc9ZW5nLTk4LTl9IGxlYXJuZXIgY29tbWVudCcsXG4gICAgICAne2xhbmc9ZW5nLTk4LTlmaGdqfScgKyAneCcucmVwZWF0KDQwMDApLFxuICAgICAgJ2xlYXJuZXIgY29tbWVudCcsXG4gICAgICAnbGVhcm5lciBjb21tZW50fScsXG4gICAgICAne2xhbmc9aS14eH0nLFxuICAgICAgJ3tsYW5nPWl9JyxcbiAgICAgICcnLFxuICAgIF0sXG4gICAgaW52YWxpZENvbW1lbnQ6IFtcbiAgICAgICd7bGFuZz1pLX0nLFxuICAgICAgJ3tsYW5nPWkteH0nLFxuICAgICAgJ3tsYW5nPWVuZy05OC05Zmhnan17IGxlYXJuZXIgY29tbWVudCcsXG4gICAgICAne2xlYXJuZXIgY29tbWVudCcsXG4gICAgICAne2xhbmc9ZW5nLTk4LTlmaGdqfScgKyAneCcucmVwZWF0KDQwMDEpLFxuICAgICAgJ3tsYW5nPWVuZy05OC05Zmhnan17JyArICd4Jy5yZXBlYXQoMzk5OSksXG4gICAgXSxcblxuICAgIHZhbGlkRGVzY3JpcHRpb246IFtcbiAgICAgICd7bGFuZz1lbi05OH0gbGVhcm5lciBjb21tZW50JyxcbiAgICAgICd7bGFuZz1lbmctOTgtOX0gbGVhcm5lciBjb21tZW50JyxcbiAgICAgICd7bGFuZz1lbmctOTgtOWZoZ2p9JyArICd4Jy5yZXBlYXQoMjUwKSxcbiAgICAgICdsZWFybmVyIGNvbW1lbnQnLFxuICAgICAgJ2xlYXJuZXIgY29tbWVudH0nLFxuICAgICAgJ3tsYW5nPWkteHh9JyxcbiAgICAgICd7bGFuZz1pfScsXG4gICAgICAnJyxcbiAgICBdLFxuICAgIGludmFsaWREZXNjcmlwdGlvbjogW1xuICAgICAgJ3tsYW5nPWktfScsXG4gICAgICAne2xhbmc9aS14fScsXG4gICAgICAne2xhbmc9ZW5nLTk4LTlmaGdqfXsgbGVhcm5lciBjb21tZW50JyxcbiAgICAgICd7bGVhcm5lciBjb21tZW50JyxcbiAgICAgICd7bGFuZz1lbmctOTgtOWZoZ2p9JyArICd4Jy5yZXBlYXQoMjUxKSxcbiAgICAgICd7bGFuZz1lbmctOTgtOWZoZ2p9eycgKyAneCcucmVwZWF0KDI0OSksXG4gICAgXSxcblxuICAgIHZhbGlkTmF2UmVxdWVzdDogW1xuICAgICAgJ3ByZXZpb3VzJyxcbiAgICAgICdjb250aW51ZScsXG4gICAgICAnZXhpdCcsXG4gICAgICAnZXhpdEFsbCcsXG4gICAgICAnYWJhbmRvbicsXG4gICAgICAnYWJhbmRvbkFsbCcsXG4gICAgICAnc3VzcGVuZEFsbCcsXG4gICAgXSxcbiAgICBpbnZhbGlkTmF2UmVxdWVzdDogW1xuICAgICAgJ2Nsb3NlJyxcbiAgICAgICdxdWl0JyxcbiAgICAgICduZXh0JyxcbiAgICAgICdiZWZvcmUnLFxuICAgIF0sXG4gIH0sXG59O1xuIiwiZXhwb3J0IGNvbnN0IHZhbGlkX2xhbmd1YWdlcyA9IHtcbiAgJ2FhJzogJ2FhJywgJ2FiJzogJ2FiJywgJ2FlJzogJ2FlJywgJ2FmJzogJ2FmJywgJ2FrJzogJ2FrJywgJ2FtJzogJ2FtJyxcbiAgJ2FuJzogJ2FuJywgJ2FyJzogJ2FyJywgJ2FzJzogJ2FzJywgJ2F2JzogJ2F2JywgJ2F5JzogJ2F5JywgJ2F6JzogJ2F6JyxcbiAgJ2JhJzogJ2JhJywgJ2JlJzogJ2JlJywgJ2JnJzogJ2JnJywgJ2JoJzogJ2JoJywgJ2JpJzogJ2JpJywgJ2JtJzogJ2JtJyxcbiAgJ2JuJzogJ2JuJywgJ2JvJzogJ2JvJywgJ2JyJzogJ2JyJywgJ2JzJzogJ2JzJywgJ2NhJzogJ2NhJywgJ2NlJzogJ2NlJyxcbiAgJ2NoJzogJ2NoJywgJ2NvJzogJ2NvJywgJ2NyJzogJ2NyJywgJ2NzJzogJ2NzJywgJ2N1JzogJ2N1JywgJ2N2JzogJ2N2JyxcbiAgJ2N5JzogJ2N5JywgJ2RhJzogJ2RhJywgJ2RlJzogJ2RlJywgJ2R2JzogJ2R2JywgJ2R6JzogJ2R6JywgJ2VlJzogJ2VlJyxcbiAgJ2VsJzogJ2VsJywgJ2VuJzogJ2VuJywgJ2VvJzogJ2VvJywgJ2VzJzogJ2VzJywgJ2V0JzogJ2V0JywgJ2V1JzogJ2V1JyxcbiAgJ2ZhJzogJ2ZhJywgJ2ZmJzogJ2ZmJywgJ2ZpJzogJ2ZpJywgJ2ZqJzogJ2ZqJywgJ2ZvJzogJ2ZvJywgJ2ZyJzogJ2ZyJyxcbiAgJ2Z5JzogJ2Z5JywgJ2dhJzogJ2dhJywgJ2dkJzogJ2dkJywgJ2dsJzogJ2dsJywgJ2duJzogJ2duJywgJ2d1JzogJ2d1JyxcbiAgJ2d2JzogJ2d2JywgJ2hhJzogJ2hhJywgJ2hlJzogJ2hlJywgJ2hpJzogJ2hpJywgJ2hvJzogJ2hvJywgJ2hyJzogJ2hyJyxcbiAgJ2h0JzogJ2h0JywgJ2h1JzogJ2h1JywgJ2h5JzogJ2h5JywgJ2h6JzogJ2h6JywgJ2lhJzogJ2lhJywgJ2lkJzogJ2lkJyxcbiAgJ2llJzogJ2llJywgJ2lnJzogJ2lnJywgJ2lpJzogJ2lpJywgJ2lrJzogJ2lrJywgJ2lvJzogJ2lvJywgJ2lzJzogJ2lzJyxcbiAgJ2l0JzogJ2l0JywgJ2l1JzogJ2l1JywgJ2phJzogJ2phJywgJ2p2JzogJ2p2JywgJ2thJzogJ2thJywgJ2tnJzogJ2tnJyxcbiAgJ2tpJzogJ2tpJywgJ2tqJzogJ2tqJywgJ2trJzogJ2trJywgJ2tsJzogJ2tsJywgJ2ttJzogJ2ttJywgJ2tuJzogJ2tuJyxcbiAgJ2tvJzogJ2tvJywgJ2tyJzogJ2tyJywgJ2tzJzogJ2tzJywgJ2t1JzogJ2t1JywgJ2t2JzogJ2t2JywgJ2t3JzogJ2t3JyxcbiAgJ2t5JzogJ2t5JywgJ2xhJzogJ2xhJywgJ2xiJzogJ2xiJywgJ2xnJzogJ2xnJywgJ2xpJzogJ2xpJywgJ2xuJzogJ2xuJyxcbiAgJ2xvJzogJ2xvJywgJ2x0JzogJ2x0JywgJ2x1JzogJ2x1JywgJ2x2JzogJ2x2JywgJ21nJzogJ21nJywgJ21oJzogJ21oJyxcbiAgJ21pJzogJ21pJywgJ21rJzogJ21rJywgJ21sJzogJ21sJywgJ21uJzogJ21uJywgJ21vJzogJ21vJywgJ21yJzogJ21yJyxcbiAgJ21zJzogJ21zJywgJ210JzogJ210JywgJ215JzogJ215JywgJ25hJzogJ25hJywgJ25iJzogJ25iJywgJ25kJzogJ25kJyxcbiAgJ25lJzogJ25lJywgJ25nJzogJ25nJywgJ25sJzogJ25sJywgJ25uJzogJ25uJywgJ25vJzogJ25vJywgJ25yJzogJ25yJyxcbiAgJ252JzogJ252JywgJ255JzogJ255JywgJ29jJzogJ29jJywgJ29qJzogJ29qJywgJ29tJzogJ29tJywgJ29yJzogJ29yJyxcbiAgJ29zJzogJ29zJywgJ3BhJzogJ3BhJywgJ3BpJzogJ3BpJywgJ3BsJzogJ3BsJywgJ3BzJzogJ3BzJywgJ3B0JzogJ3B0JyxcbiAgJ3F1JzogJ3F1JywgJ3JtJzogJ3JtJywgJ3JuJzogJ3JuJywgJ3JvJzogJ3JvJywgJ3J1JzogJ3J1JywgJ3J3JzogJ3J3JyxcbiAgJ3NhJzogJ3NhJywgJ3NjJzogJ3NjJywgJ3NkJzogJ3NkJywgJ3NlJzogJ3NlJywgJ3NnJzogJ3NnJywgJ3NoJzogJ3NoJyxcbiAgJ3NpJzogJ3NpJywgJ3NrJzogJ3NrJywgJ3NsJzogJ3NsJywgJ3NtJzogJ3NtJywgJ3NuJzogJ3NuJywgJ3NvJzogJ3NvJyxcbiAgJ3NxJzogJ3NxJywgJ3NyJzogJ3NyJywgJ3NzJzogJ3NzJywgJ3N0JzogJ3N0JywgJ3N1JzogJ3N1JywgJ3N2JzogJ3N2JyxcbiAgJ3N3JzogJ3N3JywgJ3RhJzogJ3RhJywgJ3RlJzogJ3RlJywgJ3RnJzogJ3RnJywgJ3RoJzogJ3RoJywgJ3RpJzogJ3RpJyxcbiAgJ3RrJzogJ3RrJywgJ3RsJzogJ3RsJywgJ3RuJzogJ3RuJywgJ3RvJzogJ3RvJywgJ3RyJzogJ3RyJywgJ3RzJzogJ3RzJyxcbiAgJ3R0JzogJ3R0JywgJ3R3JzogJ3R3JywgJ3R5JzogJ3R5JywgJ3VnJzogJ3VnJywgJ3VrJzogJ3VrJywgJ3VyJzogJ3VyJyxcbiAgJ3V6JzogJ3V6JywgJ3ZlJzogJ3ZlJywgJ3ZpJzogJ3ZpJywgJ3ZvJzogJ3ZvJywgJ3dhJzogJ3dhJywgJ3dvJzogJ3dvJyxcbiAgJ3hoJzogJ3hoJywgJ3lpJzogJ3lpJywgJ3lvJzogJ3lvJywgJ3phJzogJ3phJywgJ3poJzogJ3poJywgJ3p1JzogJ3p1JyxcbiAgJ2Fhcic6ICdhYXInLCAnYWJrJzogJ2FiaycsICdhdmUnOiAnYXZlJywgJ2Fmcic6ICdhZnInLCAnYWthJzogJ2FrYScsXG4gICdhbWgnOiAnYW1oJywgJ2FyZyc6ICdhcmcnLCAnYXJhJzogJ2FyYScsICdhc20nOiAnYXNtJywgJ2F2YSc6ICdhdmEnLFxuICAnYXltJzogJ2F5bScsICdhemUnOiAnYXplJywgJ2Jhayc6ICdiYWsnLCAnYmVsJzogJ2JlbCcsICdidWwnOiAnYnVsJyxcbiAgJ2JpaCc6ICdiaWgnLCAnYmlzJzogJ2JpcycsICdiYW0nOiAnYmFtJywgJ2Jlbic6ICdiZW4nLCAndGliJzogJ3RpYicsXG4gICdib2QnOiAnYm9kJywgJ2JyZSc6ICdicmUnLCAnYm9zJzogJ2JvcycsICdjYXQnOiAnY2F0JywgJ2NoZSc6ICdjaGUnLFxuICAnY2hhJzogJ2NoYScsICdjb3MnOiAnY29zJywgJ2NyZSc6ICdjcmUnLCAnY3plJzogJ2N6ZScsICdjZXMnOiAnY2VzJyxcbiAgJ2NodSc6ICdjaHUnLCAnY2h2JzogJ2NodicsICd3ZWwnOiAnd2VsJywgJ2N5bSc6ICdjeW0nLCAnZGFuJzogJ2RhbicsXG4gICdnZXInOiAnZ2VyJywgJ2RldSc6ICdkZXUnLCAnZGl2JzogJ2RpdicsICdkem8nOiAnZHpvJywgJ2V3ZSc6ICdld2UnLFxuICAnZ3JlJzogJ2dyZScsICdlbGwnOiAnZWxsJywgJ2VuZyc6ICdlbmcnLCAnZXBvJzogJ2VwbycsICdzcGEnOiAnc3BhJyxcbiAgJ2VzdCc6ICdlc3QnLCAnYmFxJzogJ2JhcScsICdldXMnOiAnZXVzJywgJ3Blcic6ICdwZXInLCAnZmFzJzogJ2ZhcycsXG4gICdmdWwnOiAnZnVsJywgJ2Zpbic6ICdmaW4nLCAnZmlqJzogJ2ZpaicsICdmYW8nOiAnZmFvJywgJ2ZyZSc6ICdmcmUnLFxuICAnZnJhJzogJ2ZyYScsICdmcnknOiAnZnJ5JywgJ2dsZSc6ICdnbGUnLCAnZ2xhJzogJ2dsYScsICdnbGcnOiAnZ2xnJyxcbiAgJ2dybic6ICdncm4nLCAnZ3VqJzogJ2d1aicsICdnbHYnOiAnZ2x2JywgJ2hhdSc6ICdoYXUnLCAnaGViJzogJ2hlYicsXG4gICdoaW4nOiAnaGluJywgJ2htbyc6ICdobW8nLCAnaHJ2JzogJ2hydicsICdoYXQnOiAnaGF0JywgJ2h1bic6ICdodW4nLFxuICAnYXJtJzogJ2FybScsICdoeWUnOiAnaHllJywgJ2hlcic6ICdoZXInLCAnaW5hJzogJ2luYScsICdpbmQnOiAnaW5kJyxcbiAgJ2lsZSc6ICdpbGUnLCAnaWJvJzogJ2libycsICdpaWknOiAnaWlpJywgJ2lwayc6ICdpcGsnLCAnaWRvJzogJ2lkbycsXG4gICdpY2UnOiAnaWNlJywgJ2lzbCc6ICdpc2wnLCAnaXRhJzogJ2l0YScsICdpa3UnOiAnaWt1JywgJ2pwbic6ICdqcG4nLFxuICAnamF2JzogJ2phdicsICdnZW8nOiAnZ2VvJywgJ2thdCc6ICdrYXQnLCAna29uJzogJ2tvbicsICdraWsnOiAna2lrJyxcbiAgJ2t1YSc6ICdrdWEnLCAna2F6JzogJ2theicsICdrYWwnOiAna2FsJywgJ2tobSc6ICdraG0nLCAna2FuJzogJ2thbicsXG4gICdrb3InOiAna29yJywgJ2thdSc6ICdrYXUnLCAna2FzJzogJ2thcycsICdrdXInOiAna3VyJywgJ2tvbSc6ICdrb20nLFxuICAnY29yJzogJ2NvcicsICdraXInOiAna2lyJywgJ2xhdCc6ICdsYXQnLCAnbHR6JzogJ2x0eicsICdsdWcnOiAnbHVnJyxcbiAgJ2xpbSc6ICdsaW0nLCAnbGluJzogJ2xpbicsICdsYW8nOiAnbGFvJywgJ2xpdCc6ICdsaXQnLCAnbHViJzogJ2x1YicsXG4gICdsYXYnOiAnbGF2JywgJ21sZyc6ICdtbGcnLCAnbWFoJzogJ21haCcsICdtYW8nOiAnbWFvJywgJ21yaSc6ICdtcmknLFxuICAnbWFjJzogJ21hYycsICdta2QnOiAnbWtkJywgJ21hbCc6ICdtYWwnLCAnbW9uJzogJ21vbicsICdtb2wnOiAnbW9sJyxcbiAgJ21hcic6ICdtYXInLCAnbWF5JzogJ21heScsICdtc2EnOiAnbXNhJywgJ21sdCc6ICdtbHQnLCAnYnVyJzogJ2J1cicsXG4gICdteWEnOiAnbXlhJywgJ25hdSc6ICduYXUnLCAnbm9iJzogJ25vYicsICduZGUnOiAnbmRlJywgJ25lcCc6ICduZXAnLFxuICAnbmRvJzogJ25kbycsICdkdXQnOiAnZHV0JywgJ25sZCc6ICdubGQnLCAnbm5vJzogJ25ubycsICdub3InOiAnbm9yJyxcbiAgJ25ibCc6ICduYmwnLCAnbmF2JzogJ25hdicsICdueWEnOiAnbnlhJywgJ29jaSc6ICdvY2knLCAnb2ppJzogJ29qaScsXG4gICdvcm0nOiAnb3JtJywgJ29yaSc6ICdvcmknLCAnb3NzJzogJ29zcycsICdwYW4nOiAncGFuJywgJ3BsaSc6ICdwbGknLFxuICAncG9sJzogJ3BvbCcsICdwdXMnOiAncHVzJywgJ3Bvcic6ICdwb3InLCAncXVlJzogJ3F1ZScsICdyb2gnOiAncm9oJyxcbiAgJ3J1bic6ICdydW4nLCAncnVtJzogJ3J1bScsICdyb24nOiAncm9uJywgJ3J1cyc6ICdydXMnLCAna2luJzogJ2tpbicsXG4gICdzYW4nOiAnc2FuJywgJ3NyZCc6ICdzcmQnLCAnc25kJzogJ3NuZCcsICdzbWUnOiAnc21lJywgJ3NhZyc6ICdzYWcnLFxuICAnc2xvJzogJ3NsbycsICdzaW4nOiAnc2luJywgJ3Nsayc6ICdzbGsnLCAnc2x2JzogJ3NsdicsICdzbW8nOiAnc21vJyxcbiAgJ3NuYSc6ICdzbmEnLCAnc29tJzogJ3NvbScsICdhbGInOiAnYWxiJywgJ3NxaSc6ICdzcWknLCAnc3JwJzogJ3NycCcsXG4gICdzc3cnOiAnc3N3JywgJ3NvdCc6ICdzb3QnLCAnc3VuJzogJ3N1bicsICdzd2UnOiAnc3dlJywgJ3N3YSc6ICdzd2EnLFxuICAndGFtJzogJ3RhbScsICd0ZWwnOiAndGVsJywgJ3Rnayc6ICd0Z2snLCAndGhhJzogJ3RoYScsICd0aXInOiAndGlyJyxcbiAgJ3R1ayc6ICd0dWsnLCAndGdsJzogJ3RnbCcsICd0c24nOiAndHNuJywgJ3Rvbic6ICd0b24nLCAndHVyJzogJ3R1cicsXG4gICd0c28nOiAndHNvJywgJ3RhdCc6ICd0YXQnLCAndHdpJzogJ3R3aScsICd0YWgnOiAndGFoJywgJ3VpZyc6ICd1aWcnLFxuICAndWtyJzogJ3VrcicsICd1cmQnOiAndXJkJywgJ3V6Yic6ICd1emInLCAndmVuJzogJ3ZlbicsICd2aWUnOiAndmllJyxcbiAgJ3ZvbCc6ICd2b2wnLCAnd2xuJzogJ3dsbicsICd3b2wnOiAnd29sJywgJ3hobyc6ICd4aG8nLCAneWlkJzogJ3lpZCcsXG4gICd5b3InOiAneW9yJywgJ3poYSc6ICd6aGEnLCAnY2hpJzogJ2NoaScsICd6aG8nOiAnemhvJywgJ3p1bCc6ICd6dWwnLFxufTtcbiIsIi8vIEBmbG93XG5cbmltcG9ydCB7c2Nvcm0xMl92YWx1ZXMsIHNjb3JtMjAwNF92YWx1ZXN9IGZyb20gJy4vZmllbGRfdmFsdWVzJztcblxuZXhwb3J0IGNvbnN0IHNjb3JtMTJfcmVnZXggPSB7XG4gIENNSVN0cmluZzI1NjogJ14uezAsMjU1fSQnLFxuICBDTUlTdHJpbmc0MDk2OiAnXi57MCw0MDk2fSQnLFxuICBDTUlUaW1lOiAnXig/OlswMV1cXFxcZHwyWzAxMjNdKTooPzpbMDEyMzQ1XVxcXFxkKTooPzpbMDEyMzQ1XVxcXFxkKSQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSVRpbWVzcGFuOiAnXihbMC05XXsyLH0pOihbMC05XXsyfSk6KFswLTldezJ9KShcXC5bMC05XXsxLDJ9KT8kJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlJbnRlZ2VyOiAnXlxcXFxkKyQnLFxuICBDTUlTSW50ZWdlcjogJ14tPyhbMC05XSspJCcsXG4gIENNSURlY2ltYWw6ICdeLT8oWzAtOV17MCwzfSkoXFwuWzAtOV0qKT8kJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlJZGVudGlmaWVyOiAnXltcXFxcdTAwMjEtXFxcXHUwMDdFXXswLDI1NX0kJyxcbiAgQ01JRmVlZGJhY2s6ICdeLnswLDI1NX0kJywgLy8gVGhpcyBtdXN0IGJlIHJlZGVmaW5lZFxuICBDTUlJbmRleDogJ1suX10oXFxcXGQrKS4nLFxuXG4gIC8vIFZvY2FidWxhcnkgRGF0YSBUeXBlIERlZmluaXRpb25cbiAgQ01JU3RhdHVzOiAnXignICsgc2Nvcm0xMl92YWx1ZXMudmFsaWRMZXNzb25TdGF0dXMuam9pbignfCcpICsgJykkJyxcbiAgQ01JU3RhdHVzMjogJ14oJyArIHNjb3JtMTJfdmFsdWVzLnZhbGlkTGVzc29uU3RhdHVzLmpvaW4oJ3wnKSArICd8bm90IGF0dGVtcHRlZCkkJyxcbiAgQ01JRXhpdDogJ14oJyArIHNjb3JtMTJfdmFsdWVzLnZhbGlkRXhpdC5qb2luKCd8JykgKyAnfCkkJyxcbiAgQ01JVHlwZTogJ14oJyArIHNjb3JtMTJfdmFsdWVzLnZhbGlkVHlwZS5qb2luKCd8JykgKyAnKSQnLFxuICBDTUlSZXN1bHQ6ICdeKCcgKyBzY29ybTEyX3ZhbHVlcy52YWxpZFJlc3VsdC5qb2luKCd8JykgKyAnfChbMC05XXswLDN9KT8oXFxcXC5bMC05XSopPykkJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBOQVZFdmVudDogJ14ocHJldmlvdXN8Y29udGludWUpJCcsXG5cbiAgLy8gRGF0YSByYW5nZXNcbiAgc2NvcmVfcmFuZ2U6ICcwIzEwMCcsXG4gIGF1ZGlvX3JhbmdlOiAnLTEjMTAwJyxcbiAgc3BlZWRfcmFuZ2U6ICctMTAwIzEwMCcsXG4gIHdlaWdodGluZ19yYW5nZTogJy0xMDAjMTAwJyxcbiAgdGV4dF9yYW5nZTogJy0xIzEnLFxufTtcblxuZXhwb3J0IGNvbnN0IGFpY2NfcmVnZXggPSB7XG4gIC4uLnNjb3JtMTJfcmVnZXgsIC4uLntcbiAgICBDTUlJZGVudGlmaWVyOiAnXlxcXFx3ezEsMjU1fSQnLFxuICB9LFxufTtcblxuZXhwb3J0IGNvbnN0IHNjb3JtMjAwNF9yZWdleCA9IHtcbiAgQ01JU3RyaW5nMjAwOiAnXltcXFxcdTAwMDAtXFxcXHVGRkZGXXswLDIwMH0kJyxcbiAgQ01JU3RyaW5nMjUwOiAnXltcXFxcdTAwMDAtXFxcXHVGRkZGXXswLDI1MH0kJyxcbiAgQ01JU3RyaW5nMTAwMDogJ15bXFxcXHUwMDAwLVxcXFx1RkZGRl17MCwxMDAwfSQnLFxuICBDTUlTdHJpbmc0MDAwOiAnXltcXFxcdTAwMDAtXFxcXHVGRkZGXXswLDQwMDB9JCcsXG4gIENNSVN0cmluZzY0MDAwOiAnXltcXFxcdTAwMDAtXFxcXHVGRkZGXXswLDY0MDAwfSQnLFxuICBDTUlMYW5nOiAnXihbYS16QS1aXXsyLDN9fGl8eCkoXFwtW2EtekEtWjAtOVxcLV17Miw4fSk/JHxeJCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JTGFuZ1N0cmluZzI1MDogJ14oXFx7bGFuZz0oW2EtekEtWl17MiwzfXxpfHgpKFxcLVthLXpBLVowLTlcXC1dezIsOH0pP1xcfSk/KCg/IVxcey4qJCkuezAsMjUwfSQpPyQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUxhbmdjcjogJ14oKFxce2xhbmc9KFthLXpBLVpdezIsM318aXx4KT8oXFwtW2EtekEtWjAtOVxcLV17Miw4fSk/XFx9KSkoLio/KSQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUxhbmdTdHJpbmcyNTBjcjogJ14oKFxce2xhbmc9KFthLXpBLVpdezIsM318aXx4KT8oXFwtW2EtekEtWjAtOVxcLV17Miw4fSk/XFx9KT8oLnswLDI1MH0pPyk/JCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JTGFuZ1N0cmluZzQwMDA6ICdeKFxce2xhbmc9KFthLXpBLVpdezIsM318aXx4KShcXC1bYS16QS1aMC05XFwtXXsyLDh9KT9cXH0pPygoPyFcXHsuKiQpLnswLDQwMDB9JCk/JCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JVGltZTogJ14oMTlbNy05XXsxfVswLTldezF9fDIwWzAtMl17MX1bMC05XXsxfXwyMDNbMC04XXsxfSkoKC0oMFsxLTldezF9fDFbMC0yXXsxfSkpKCgtKDBbMS05XXsxfXxbMS0yXXsxfVswLTldezF9fDNbMC0xXXsxfSkpKFQoWzAtMV17MX1bMC05XXsxfXwyWzAtM117MX0pKCg6WzAtNV17MX1bMC05XXsxfSkoKDpbMC01XXsxfVswLTldezF9KSgoXFxcXC5bMC05XXsxLDJ9KSgoWnwoWyt8LV0oWzAtMV17MX1bMC05XXsxfXwyWzAtM117MX0pKSkoOlswLTVdezF9WzAtOV17MX0pPyk/KT8pPyk/KT8pPyk/JCcsXG4gIENNSVRpbWVzcGFuOiAnXlAoPzooWy4sXFxcXGRdKylZKT8oPzooWy4sXFxcXGRdKylNKT8oPzooWy4sXFxcXGRdKylXKT8oPzooWy4sXFxcXGRdKylEKT8oPzpUPyg/OihbLixcXFxcZF0rKUgpPyg/OihbLixcXFxcZF0rKU0pPyg/OihbLixcXFxcZF0rKVMpPyk/JCcsXG4gIENNSUludGVnZXI6ICdeXFxcXGQrJCcsXG4gIENNSVNJbnRlZ2VyOiAnXi0/KFswLTldKykkJyxcbiAgQ01JRGVjaW1hbDogJ14tPyhbMC05XXsxLDV9KShcXFxcLlswLTldezEsMTh9KT8kJyxcbiAgQ01JSWRlbnRpZmllcjogJ15cXFxcU3sxLDI1MH1bYS16QS1aMC05XSQnLFxuICBDTUlTaG9ydElkZW50aWZpZXI6ICdeW1xcXFx3XFwuXXsxLDI1MH0kJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlMb25nSWRlbnRpZmllcjogJ14oPzooPyF1cm46KVxcXFxTezEsNDAwMH18dXJuOltBLVphLXowLTktXXsxLDMxfTpcXFxcU3sxLDQwMDB9KSQnLFxuICBDTUlGZWVkYmFjazogJ14uKiQnLCAvLyBUaGlzIG11c3QgYmUgcmVkZWZpbmVkXG4gIENNSUluZGV4OiAnWy5fXShcXFxcZCspLicsXG4gIENNSUluZGV4U3RvcmU6ICcuTihcXFxcZCspLicsXG5cbiAgLy8gVm9jYWJ1bGFyeSBEYXRhIFR5cGUgRGVmaW5pdGlvblxuICBDTUlDU3RhdHVzOiAnXignICsgc2Nvcm0yMDA0X3ZhbHVlcy52YWxpZENTdGF0dXMuam9pbignfCcpICsgJykkJyxcbiAgQ01JU1N0YXR1czogJ14oJyArIHNjb3JtMjAwNF92YWx1ZXMudmFsaWRTU3RhdHVzLmpvaW4oJ3wnKSArICcpJCcsXG4gIENNSUV4aXQ6ICdeKCcgKyBzY29ybTIwMDRfdmFsdWVzLnZhbGlkRXhpdC5qb2luKCd8JykgKyAnKSQnLFxuICBDTUlUeXBlOiAnXignICsgc2Nvcm0yMDA0X3ZhbHVlcy52YWxpZFR5cGUuam9pbignfCcpICsgJykkJyxcbiAgQ01JUmVzdWx0OiAnXignICsgc2Nvcm0yMDA0X3ZhbHVlcy52YWxpZFJlc3VsdC5qb2luKCd8JykgKyAnfC0/KFswLTldezEsNH0pKFxcXFwuWzAtOV17MSwxOH0pPykkJyxcbiAgTkFWRXZlbnQ6ICdeKCcgKyBzY29ybTIwMDRfdmFsdWVzLnZhbGlkTmF2UmVxdWVzdC5qb2luKCd8JykgKyAnfFxce3RhcmdldD1cXFxcU3swLDIwMH1bYS16QS1aMC05XVxcfWNob2ljZXxqdW1wKSQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIE5BVkJvb2xlYW46ICdeKHVua25vd258dHJ1ZXxmYWxzZSQpJyxcbiAgTkFWVGFyZ2V0OiAnXihwcmV2aW91c3xjb250aW51ZXxjaG9pY2Uue3RhcmdldD1cXFxcU3swLDIwMH1bYS16QS1aMC05XX0pJCcsXG5cbiAgLy8gRGF0YSByYW5nZXNcbiAgc2NhbGVkX3JhbmdlOiAnLTEjMScsXG4gIGF1ZGlvX3JhbmdlOiAnMCMqJyxcbiAgc3BlZWRfcmFuZ2U6ICcwIyonLFxuICB0ZXh0X3JhbmdlOiAnLTEjMScsXG4gIHByb2dyZXNzX3JhbmdlOiAnMCMxJyxcbn07XG4iLCIvLyBAZmxvd1xuaW1wb3J0IHtzY29ybTIwMDRfcmVnZXh9IGZyb20gJy4vcmVnZXgnO1xuXG5leHBvcnQgY29uc3QgbGVhcm5lcl9yZXNwb25zZXMgPSB7XG4gICd0cnVlLWZhbHNlJzoge1xuICAgIGZvcm1hdDogJ150cnVlJHxeZmFsc2UkJyxcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAnY2hvaWNlJzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBtYXg6IDM2LFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgdW5pcXVlOiB0cnVlLFxuICB9LFxuICAnZmlsbC1pbic6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nU3RyaW5nMjUwLFxuICAgIG1heDogMTAsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAnbG9uZy1maWxsLWluJzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSUxhbmdTdHJpbmc0MDAwLFxuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG4gICdtYXRjaGluZyc6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgZm9ybWF0Mjogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBtYXg6IDM2LFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgZGVsaW1pdGVyMjogJ1suXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ3BlcmZvcm1hbmNlJzoge1xuICAgIGZvcm1hdDogJ14kfCcgKyBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIGZvcm1hdDI6IHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsICsgJ3xeJHwnICtcbiAgICAgICAgc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBtYXg6IDI1MCxcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIGRlbGltaXRlcjI6ICdbLl0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG4gICdzZXF1ZW5jaW5nJzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBtYXg6IDM2LFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ2xpa2VydCc6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ251bWVyaWMnOiB7XG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCxcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAnb3RoZXInOiB7XG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU3RyaW5nNDAwMCxcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxufTtcblxuZXhwb3J0IGNvbnN0IGNvcnJlY3RfcmVzcG9uc2VzID0ge1xuICAndHJ1ZS1mYWxzZSc6IHtcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiAnXnRydWUkfF5mYWxzZSQnLFxuICAgIGxpbWl0OiAxLFxuICB9LFxuICAnY2hvaWNlJzoge1xuICAgIG1heDogMzYsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICB1bmlxdWU6IHRydWUsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gIH0sXG4gICdmaWxsLWluJzoge1xuICAgIG1heDogMTAsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JTGFuZ1N0cmluZzI1MGNyLFxuICB9LFxuICAnbG9uZy1maWxsLWluJzoge1xuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiB0cnVlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSUxhbmdTdHJpbmc0MDAwLFxuICB9LFxuICAnbWF0Y2hpbmcnOiB7XG4gICAgbWF4OiAzNixcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIGRlbGltaXRlcjI6ICdbLl0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgZm9ybWF0Mjogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgfSxcbiAgJ3BlcmZvcm1hbmNlJzoge1xuICAgIG1heDogMjUwLFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgZGVsaW1pdGVyMjogJ1suXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogJ14kfCcgKyBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIGZvcm1hdDI6IHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsICsgJ3xeJHwnICtcbiAgICAgICAgc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgfSxcbiAgJ3NlcXVlbmNpbmcnOiB7XG4gICAgbWF4OiAzNixcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gIH0sXG4gICdsaWtlcnQnOiB7XG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBsaW1pdDogMSxcbiAgfSxcbiAgJ251bWVyaWMnOiB7XG4gICAgbWF4OiAyLFxuICAgIGRlbGltaXRlcjogJ1s6XScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwsXG4gICAgbGltaXQ6IDEsXG4gIH0sXG4gICdvdGhlcic6IHtcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU3RyaW5nNDAwMCxcbiAgICBsaW1pdDogMSxcbiAgfSxcbn07XG4iLCIvLyBAZmxvd1xuXG4vKipcbiAqIERhdGEgVmFsaWRhdGlvbiBFeGNlcHRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIFZhbGlkYXRpb25FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIHRvIHRha2UgaW4gYW4gZXJyb3IgbWVzc2FnZSBhbmQgY29kZVxuICAgKiBAcGFyYW0ge251bWJlcn0gZXJyb3JDb2RlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlcnJvckNvZGU6IG51bWJlcikge1xuICAgIHN1cGVyKGVycm9yQ29kZSk7XG4gICAgdGhpcy4jZXJyb3JDb2RlID0gZXJyb3JDb2RlO1xuICB9XG5cbiAgI2Vycm9yQ29kZTtcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZXJyb3JDb2RlXG4gICAqIEByZXR1cm4ge251bWJlcn1cbiAgICovXG4gIGdldCBlcnJvckNvZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2Vycm9yQ29kZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcnlpbmcgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgRXJyb3IgbWVzc2FnZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbWVzc2FnZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jZXJyb3JDb2RlICsgJyc7XG4gIH1cbn1cbiIsImltcG9ydCBTY29ybTIwMDRBUEkgZnJvbSAnLi9TY29ybTIwMDRBUEknO1xuaW1wb3J0IFNjb3JtMTJBUEkgZnJvbSAnLi9TY29ybTEyQVBJJztcbmltcG9ydCBBSUNDIGZyb20gJy4vQUlDQyc7XG5cbndpbmRvdy5TY29ybTEyQVBJID0gU2Nvcm0xMkFQSTtcbndpbmRvdy5TY29ybTIwMDRBUEkgPSBTY29ybTIwMDRBUEk7XG53aW5kb3cuQUlDQyA9IEFJQ0M7XG4iLCIvLyBAZmxvd1xuZXhwb3J0IGNvbnN0IFNFQ09ORFNfUEVSX1NFQ09ORCA9IDEuMDtcbmV4cG9ydCBjb25zdCBTRUNPTkRTX1BFUl9NSU5VVEUgPSA2MDtcbmV4cG9ydCBjb25zdCBTRUNPTkRTX1BFUl9IT1VSID0gNjAgKiBTRUNPTkRTX1BFUl9NSU5VVEU7XG5leHBvcnQgY29uc3QgU0VDT05EU19QRVJfREFZID0gMjQgKiBTRUNPTkRTX1BFUl9IT1VSO1xuXG5jb25zdCBkZXNpZ25hdGlvbnMgPSBbXG4gIFsnRCcsIFNFQ09ORFNfUEVSX0RBWV0sXG4gIFsnSCcsIFNFQ09ORFNfUEVSX0hPVVJdLFxuICBbJ00nLCBTRUNPTkRTX1BFUl9NSU5VVEVdLFxuICBbJ1MnLCBTRUNPTkRTX1BFUl9TRUNPTkRdLFxuXTtcblxuLyoqXG4gKiBDb252ZXJ0cyBhIE51bWJlciB0byBhIFN0cmluZyBvZiBISDpNTTpTU1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB0b3RhbFNlY29uZHNcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNlY29uZHNBc0hITU1TUyh0b3RhbFNlY29uZHM6IE51bWJlcikge1xuICAvLyBTQ09STSBzcGVjIGRvZXMgbm90IGRlYWwgd2l0aCBuZWdhdGl2ZSBkdXJhdGlvbnMsIGdpdmUgemVybyBiYWNrXG4gIGlmICghdG90YWxTZWNvbmRzIHx8IHRvdGFsU2Vjb25kcyA8PSAwKSB7XG4gICAgcmV0dXJuICcwMDowMDowMCc7XG4gIH1cblxuICBjb25zdCBob3VycyA9IE1hdGguZmxvb3IodG90YWxTZWNvbmRzIC8gU0VDT05EU19QRVJfSE9VUik7XG5cbiAgY29uc3QgZGF0ZU9iaiA9IG5ldyBEYXRlKHRvdGFsU2Vjb25kcyAqIDEwMDApO1xuICBjb25zdCBtaW51dGVzID0gZGF0ZU9iai5nZXRVVENNaW51dGVzKCk7XG4gIC8vIG1ha2Ugc3VyZSB3ZSBhZGQgYW55IHBvc3NpYmxlIGRlY2ltYWwgdmFsdWVcbiAgY29uc3Qgc2Vjb25kcyA9IGRhdGVPYmouZ2V0U2Vjb25kcygpICsgKHRvdGFsU2Vjb25kcyAlIDEuMCk7XG5cbiAgcmV0dXJuIGhvdXJzLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKSArICc6JyArXG4gICAgICBtaW51dGVzLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKSArICc6JyArXG4gICAgICBzZWNvbmRzLnRvU3RyaW5nKCkucGFkU3RhcnQoMiwgJzAnKTtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgdGhlIG51bWJlciBvZiBzZWNvbmRzIGZyb20gSVNPIDg2MDEgRHVyYXRpb25cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gc2Vjb25kc1xuICogQHJldHVybiB7U3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2Vjb25kc0FzSVNPRHVyYXRpb24oc2Vjb25kczogTnVtYmVyKSB7XG4gIC8vIFNDT1JNIHNwZWMgZG9lcyBub3QgZGVhbCB3aXRoIG5lZ2F0aXZlIGR1cmF0aW9ucywgZ2l2ZSB6ZXJvIGJhY2tcbiAgaWYgKCFzZWNvbmRzIHx8IHNlY29uZHMgPD0gMCkge1xuICAgIHJldHVybiAnUFQwUyc7XG4gIH1cblxuICBsZXQgZHVyYXRpb24gPSAnUCc7XG4gIGxldCByZW1haW5kZXIgPSBzZWNvbmRzO1xuXG4gIGRlc2lnbmF0aW9ucy5mb3JFYWNoKChbc2lnbiwgY3VycmVudF9zZWNvbmRzXSkgPT4ge1xuICAgIGxldCB2YWx1ZSA9IE1hdGguZmxvb3IocmVtYWluZGVyIC8gY3VycmVudF9zZWNvbmRzKTtcblxuICAgIHJlbWFpbmRlciA9IHJlbWFpbmRlciAlIGN1cnJlbnRfc2Vjb25kcztcbiAgICAvLyBJZiB3ZSBoYXZlIGFueXRoaW5nIGxlZnQgaW4gdGhlIHJlbWFpbmRlciwgYW5kIHdlJ3JlIGN1cnJlbnRseSBhZGRpbmdcbiAgICAvLyBzZWNvbmRzIHRvIHRoZSBkdXJhdGlvbiwgZ28gYWhlYWQgYW5kIGFkZCB0aGUgZGVjaW1hbCB0byB0aGUgc2Vjb25kc1xuICAgIGlmIChzaWduID09PSAnUycgJiYgcmVtYWluZGVyID4gMCkge1xuICAgICAgdmFsdWUgKz0gcmVtYWluZGVyO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgaWYgKChkdXJhdGlvbi5pbmRleE9mKCdEJykgPiAwIHx8XG4gICAgICAgICAgc2lnbiA9PT0gJ0gnIHx8IHNpZ24gPT09ICdNJyB8fCBzaWduID09PSAnUycpICYmXG4gICAgICAgICAgZHVyYXRpb24uaW5kZXhPZignVCcpID09PSAtMSkge1xuICAgICAgICBkdXJhdGlvbiArPSAnVCc7XG4gICAgICB9XG4gICAgICBkdXJhdGlvbiArPSBgJHt2YWx1ZX0ke3NpZ259YDtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBkdXJhdGlvbjtcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgdGhlIG51bWJlciBvZiBzZWNvbmRzIGZyb20gSEg6TU06U1MuREREREREXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRpbWVTdHJpbmdcbiAqIEBwYXJhbSB7UmVnRXhwfSB0aW1lUmVnZXhcbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFRpbWVBc1NlY29uZHModGltZVN0cmluZzogU3RyaW5nLCB0aW1lUmVnZXg6IFJlZ0V4cCkge1xuICBpZiAoIXRpbWVTdHJpbmcgfHwgdHlwZW9mIHRpbWVTdHJpbmcgIT09ICdzdHJpbmcnIHx8XG4gICAgICAhdGltZVN0cmluZy5tYXRjaCh0aW1lUmVnZXgpKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgY29uc3QgcGFydHMgPSB0aW1lU3RyaW5nLnNwbGl0KCc6Jyk7XG4gIGNvbnN0IGhvdXJzID0gTnVtYmVyKHBhcnRzWzBdKTtcbiAgY29uc3QgbWludXRlcyA9IE51bWJlcihwYXJ0c1sxXSk7XG4gIGNvbnN0IHNlY29uZHMgPSBOdW1iZXIocGFydHNbMl0pO1xuICByZXR1cm4gKGhvdXJzICogMzYwMCkgKyAobWludXRlcyAqIDYwKSArIHNlY29uZHM7XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlIHRoZSBudW1iZXIgb2Ygc2Vjb25kcyBmcm9tIElTTyA4NjAxIER1cmF0aW9uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGR1cmF0aW9uXG4gKiBAcGFyYW0ge1JlZ0V4cH0gZHVyYXRpb25SZWdleFxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RHVyYXRpb25Bc1NlY29uZHMoZHVyYXRpb246IFN0cmluZywgZHVyYXRpb25SZWdleDogUmVnRXhwKSB7XG4gIGlmICghZHVyYXRpb24gfHwgIWR1cmF0aW9uLm1hdGNoKGR1cmF0aW9uUmVnZXgpKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBjb25zdCBbLCB5ZWFycywgbW9udGhzLCAsIGRheXMsIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzXSA9IG5ldyBSZWdFeHAoXG4gICAgICBkdXJhdGlvblJlZ2V4KS5leGVjKGR1cmF0aW9uKSB8fCBbXTtcblxuICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICBjb25zdCBhbmNob3IgPSBuZXcgRGF0ZShub3cpO1xuICBhbmNob3Iuc2V0RnVsbFllYXIoYW5jaG9yLmdldEZ1bGxZZWFyKCkgKyBOdW1iZXIoeWVhcnMgfHwgMCkpO1xuICBhbmNob3Iuc2V0TW9udGgoYW5jaG9yLmdldE1vbnRoKCkgKyBOdW1iZXIobW9udGhzIHx8IDApKTtcbiAgYW5jaG9yLnNldERhdGUoYW5jaG9yLmdldERhdGUoKSArIE51bWJlcihkYXlzIHx8IDApKTtcbiAgYW5jaG9yLnNldEhvdXJzKGFuY2hvci5nZXRIb3VycygpICsgTnVtYmVyKGhvdXJzIHx8IDApKTtcbiAgYW5jaG9yLnNldE1pbnV0ZXMoYW5jaG9yLmdldE1pbnV0ZXMoKSArIE51bWJlcihtaW51dGVzIHx8IDApKTtcbiAgYW5jaG9yLnNldFNlY29uZHMoYW5jaG9yLmdldFNlY29uZHMoKSArIE51bWJlcihzZWNvbmRzIHx8IDApKTtcbiAgaWYgKHNlY29uZHMgJiYgU3RyaW5nKHNlY29uZHMpLmluZGV4T2YoJy4nKSA+IDApIHtcbiAgICBjb25zdCBtaWxsaXNlY29uZHMgPSBOdW1iZXIoTnVtYmVyKHNlY29uZHMpICUgMSkudG9GaXhlZCg2KSAqIDEwMDAuMDtcbiAgICBhbmNob3Iuc2V0TWlsbGlzZWNvbmRzKGFuY2hvci5nZXRNaWxsaXNlY29uZHMoKSArIG1pbGxpc2Vjb25kcyk7XG4gIH1cblxuICByZXR1cm4gKChhbmNob3IgKiAxLjApIC0gbm93KSAvIDEwMDAuMDtcbn1cblxuLyoqXG4gKiBBZGRzIHRvZ2V0aGVyIHR3byBJU084NjAxIER1cmF0aW9uIHN0cmluZ3NcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlyc3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWNvbmRcbiAqIEBwYXJhbSB7UmVnRXhwfSBkdXJhdGlvblJlZ2V4XG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRUd29EdXJhdGlvbnMoXG4gICAgZmlyc3Q6IFN0cmluZyxcbiAgICBzZWNvbmQ6IFN0cmluZyxcbiAgICBkdXJhdGlvblJlZ2V4OiBSZWdFeHApIHtcbiAgY29uc3QgZmlyc3RTZWNvbmRzID0gZ2V0RHVyYXRpb25Bc1NlY29uZHMoZmlyc3QsIGR1cmF0aW9uUmVnZXgpO1xuICBjb25zdCBzZWNvbmRTZWNvbmRzID0gZ2V0RHVyYXRpb25Bc1NlY29uZHMoc2Vjb25kLCBkdXJhdGlvblJlZ2V4KTtcblxuICByZXR1cm4gZ2V0U2Vjb25kc0FzSVNPRHVyYXRpb24oZmlyc3RTZWNvbmRzICsgc2Vjb25kU2Vjb25kcyk7XG59XG5cbi8qKlxuICogQWRkIHRvZ2V0aGVyIHR3byBISDpNTTpTUy5ERCBzdHJpbmdzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGZpcnN0XG4gKiBAcGFyYW0ge3N0cmluZ30gc2Vjb25kXG4gKiBAcGFyYW0ge1JlZ0V4cH0gdGltZVJlZ2V4XG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRISE1NU1NUaW1lU3RyaW5ncyhcbiAgICBmaXJzdDogU3RyaW5nLFxuICAgIHNlY29uZDogU3RyaW5nLFxuICAgIHRpbWVSZWdleDogUmVnRXhwKSB7XG4gIGNvbnN0IGZpcnN0U2Vjb25kcyA9IGdldFRpbWVBc1NlY29uZHMoZmlyc3QsIHRpbWVSZWdleCk7XG4gIGNvbnN0IHNlY29uZFNlY29uZHMgPSBnZXRUaW1lQXNTZWNvbmRzKHNlY29uZCwgdGltZVJlZ2V4KTtcbiAgcmV0dXJuIGdldFNlY29uZHNBc0hITU1TUyhmaXJzdFNlY29uZHMgKyBzZWNvbmRTZWNvbmRzKTtcbn1cblxuLyoqXG4gKiBGbGF0dGVuIGEgSlNPTiBvYmplY3QgZG93biB0byBzdHJpbmcgcGF0aHMgZm9yIGVhY2ggdmFsdWVzXG4gKiBAcGFyYW0ge29iamVjdH0gZGF0YVxuICogQHJldHVybiB7b2JqZWN0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmxhdHRlbihkYXRhKSB7XG4gIGNvbnN0IHJlc3VsdCA9IHt9O1xuXG4gIC8qKlxuICAgKiBSZWN1cnNlIHRocm91Z2ggdGhlIG9iamVjdFxuICAgKiBAcGFyYW0geyp9IGN1clxuICAgKiBAcGFyYW0geyp9IHByb3BcbiAgICovXG4gIGZ1bmN0aW9uIHJlY3Vyc2UoY3VyLCBwcm9wKSB7XG4gICAgaWYgKE9iamVjdChjdXIpICE9PSBjdXIpIHtcbiAgICAgIHJlc3VsdFtwcm9wXSA9IGN1cjtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoY3VyKSkge1xuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBjdXIubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHJlY3Vyc2UoY3VyW2ldLCBwcm9wICsgJ1snICsgaSArICddJyk7XG4gICAgICAgIGlmIChsID09PSAwKSByZXN1bHRbcHJvcF0gPSBbXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGlzRW1wdHkgPSB0cnVlO1xuICAgICAgZm9yIChjb25zdCBwIGluIGN1cikge1xuICAgICAgICBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChjdXIsIHApKSB7XG4gICAgICAgICAgaXNFbXB0eSA9IGZhbHNlO1xuICAgICAgICAgIHJlY3Vyc2UoY3VyW3BdLCBwcm9wID8gcHJvcCArICcuJyArIHAgOiBwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGlzRW1wdHkgJiYgcHJvcCkgcmVzdWx0W3Byb3BdID0ge307XG4gICAgfVxuICB9XG5cbiAgcmVjdXJzZShkYXRhLCAnJyk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVW4tZmxhdHRlbiBhIGZsYXQgSlNPTiBvYmplY3RcbiAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1bmZsYXR0ZW4oZGF0YSkge1xuICAndXNlIHN0cmljdCc7XG4gIGlmIChPYmplY3QoZGF0YSkgIT09IGRhdGEgfHwgQXJyYXkuaXNBcnJheShkYXRhKSkgcmV0dXJuIGRhdGE7XG4gIGNvbnN0IHJlZ2V4ID0gL1xcLj8oW14uW1xcXV0rKXxcXFsoXFxkKyldL2c7XG4gIGNvbnN0IHJlc3VsdCA9IHt9O1xuICBmb3IgKGNvbnN0IHAgaW4gZGF0YSkge1xuICAgIGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIHApKSB7XG4gICAgICBsZXQgY3VyID0gcmVzdWx0O1xuICAgICAgbGV0IHByb3AgPSAnJztcbiAgICAgIGxldCBtID0gcmVnZXguZXhlYyhwKTtcbiAgICAgIHdoaWxlIChtKSB7XG4gICAgICAgIGN1ciA9IGN1cltwcm9wXSB8fCAoY3VyW3Byb3BdID0gKG1bMl0gPyBbXSA6IHt9KSk7XG4gICAgICAgIHByb3AgPSBtWzJdIHx8IG1bMV07XG4gICAgICAgIG0gPSByZWdleC5leGVjKHApO1xuICAgICAgfVxuICAgICAgY3VyW3Byb3BdID0gZGF0YVtwXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdFsnJ10gfHwgcmVzdWx0O1xufVxuIl19
