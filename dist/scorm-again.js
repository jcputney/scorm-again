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

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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

var _error_codes2 = _interopRequireDefault(require("./constants/error_codes"));

var _api_constants = _interopRequireDefault(require("./constants/api_constants"));

var _utilities = require("./utilities");

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
        logLevel: global_constants.LOG_LEVEL_ERROR
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
      var returnValue = global_constants.SCORM_FALSE;

      if (this.checkState(checkTerminated, _classPrivateFieldGet(this, _error_codes).TERMINATION_BEFORE_INIT, _classPrivateFieldGet(this, _error_codes).MULTIPLE_TERMINATION)) {
        this.currentState = global_constants.STATE_TERMINATED;
        var result = this.storeData(true);

        if (result.errorCode && result.errorCode > 0) {
          this.throwSCORMError(result.errorCode);
        }

        returnValue = result.result ? result.result : global_constants.SCORM_FALSE;
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

        if (result.errorCode && result.errorCode > 0) {
          this.throwSCORMError(result.errorCode);
        }

        returnValue = result.result ? result.result : global_constants.SCORM_FALSE;
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
            if (this.stringMatches(CMIElement, '\\.correct_responses\\.\\d')) {
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
     * @return {object}
     */

  }, {
    key: "processHttpRequest",
    value: function processHttpRequest(url, params) {
      var genericError = {
        'result': global_constants.SCORM_FALSE,
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

var _API = new WeakMap();

var _cancelled = new WeakMap();

var _timeout2 = new WeakMap();

},{"./cmi/common":6,"./constants/api_constants":9,"./constants/error_codes":10,"./exceptions":14,"./utilities":16}],3:[function(require,module,exports){
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

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var scorm12_constants = _api_constants["default"].scorm12;
var global_constants = _api_constants["default"].global;
var scorm12_error_codes = _error_codes["default"].scorm12;
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

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Scorm12API).call(this, scorm12_error_codes, finalSettings));
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

      if (this.stringMatches(CMIElement, 'cmi\\.objectives\\.\\d')) {
        newChild = new _scorm12_cmi.CMIObjectivesObject();
      } else if (foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d\\.correct_responses\\.\\d')) {
        newChild = new _scorm12_cmi.CMIInteractionsCorrectResponsesObject();
      } else if (foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d\\.objectives\\.\\d')) {
        newChild = new _scorm12_cmi.CMIInteractionsObjectivesObject();
      } else if (!foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d')) {
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

        return this.processHttpRequest(this.settings.lmsCommitUrl, commitObject);
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

},{"./BaseAPI":2,"./cmi/scorm12_cmi":7,"./constants/api_constants":9,"./constants/error_codes":10,"./utilities":16}],4:[function(require,module,exports){
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

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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

var scorm2004_constants = _api_constants["default"].scorm2004;
var global_constants = _api_constants["default"].global;
var scorm2004_error_codes = _error_codes["default"].scorm2004;
var correct_responses = _response_constants["default"].correct;
var scorm2004_regex = _regex["default"].scorm2004;
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

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Scorm2004API).call(this, scorm2004_error_codes, finalSettings));

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

      if (this.stringMatches(CMIElement, 'cmi\\.objectives\\.\\d')) {
        newChild = new _scorm2004_cmi.CMIObjectivesObject();
      } else if (foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d\\.correct_responses\\.\\d')) {
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
      } else if (foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d\\.objectives\\.\\d')) {
        newChild = new _scorm2004_cmi.CMIInteractionsObjectivesObject();
      } else if (!foundFirstIndex && this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d')) {
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
            this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE);
          }
        }
      }

      var response_type = correct_responses[interaction_type];

      if (typeof response_type.limit !== 'undefined' || interaction_count < response_type.limit) {
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

        var result = this.processHttpRequest(this.settings.lmsCommitUrl, commitObject); // check if this is a sequencing call, and then call the necessary JS

        if (navRequest && result.navRequest !== undefined && result.navRequest !== '') {
          Function("\"use strict\";(() => { ".concat(result.navRequest, " })()"))();
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

var _version = new WeakMap();

},{"./BaseAPI":2,"./cmi/scorm2004_cmi":8,"./constants/api_constants":9,"./constants/error_codes":10,"./constants/language_constants":11,"./constants/regex":12,"./constants/response_constants":13,"./utilities":16}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CMIEvaluationCommentsObject = exports.CMITriesObject = exports.CMITries = exports.CMI = void 0;

var Scorm12CMI = _interopRequireWildcard(require("./scorm12_cmi"));

var _common = require("./common");

var _api_constants = _interopRequireDefault(require("../constants/api_constants"));

var _regex = _interopRequireDefault(require("../constants/regex"));

var _error_codes = _interopRequireDefault(require("../constants/error_codes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

var aicc_constants = _api_constants["default"].aicc;
var aicc_regex = _regex["default"].aicc;
var scorm12_error_codes = _error_codes["default"].scorm12;
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

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CMI).call(this, aicc_constants.cmi_children));
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

    return _possibleConstructorReturn(this, _getPrototypeOf(CMIEvaluationComments).call(this, aicc_constants.comments_children, scorm12_error_codes.INVALID_SET_VALUE));
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

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(AICCCMIStudentData).call(this, aicc_constants.student_data_children));

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

    return _possibleConstructorReturn(this, _getPrototypeOf(CMITries).call(this, aicc_constants.tries_children));
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
      score_children: aicc_constants.score_children,
      score_range: aicc_regex.score_range,
      invalidErrorCode: scorm12_error_codes.INVALID_SET_VALUE,
      invalidTypeCode: scorm12_error_codes.TYPE_MISMATCH,
      invalidRangeCode: scorm12_error_codes.VALUE_OUT_OF_RANGE
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
      if ((0, Scorm12CMI.check12ValidFormat)(status, aicc_regex.CMIStatus2)) {
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
      if ((0, Scorm12CMI.check12ValidFormat)(time, aicc_regex.CMITime)) {
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
      return _classPrivateFieldGet(this, _time2);
    }
    /**
     * Setting for #time
     * @param {string} time
     */
    ,
    set: function set(time) {
      if ((0, Scorm12CMI.check12ValidFormat)(time, aicc_regex.CMITime)) {
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

},{"../constants/api_constants":9,"../constants/error_codes":10,"../constants/regex":12,"./common":6,"./scorm12_cmi":7}],6:[function(require,module,exports){
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

},{"../constants/api_constants":9,"../constants/error_codes":10,"../constants/regex":12,"../exceptions":14}],7:[function(require,module,exports){
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

var _api_constants = _interopRequireDefault(require("../constants/api_constants"));

var _error_codes = _interopRequireDefault(require("../constants/error_codes"));

var _regex = _interopRequireDefault(require("../constants/regex"));

var _exceptions = require("../exceptions");

var Utilities = _interopRequireWildcard(require("../utilities"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
      if (check12ValidFormat(suspend_data, scorm12_regex.CMIString4096, true)) {
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
     *
     * @return {string}
     */
    value: function getCurrentTotalTime() {
      return Utilities.addHHMMSSTimeStrings(_classPrivateFieldGet(this, _total_time), _classPrivateFieldGet(this, _session_time), new RegExp(scorm12_regex.CMITimespan));
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
      children: scorm12_constants.objectives_children,
      errorCode: scorm12_error_codes.INVALID_SET_VALUE
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
      value: scorm12_constants.student_preference_children
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
      children: scorm12_constants.interactions_children,
      errorCode: scorm12_error_codes.INVALID_SET_VALUE
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
      if (check12ValidFormat(event, scorm12_regex.NAVEvent)) {
        _classPrivateFieldSet(this, _event, event);
      }
    }
  }]);

  return NAV;
}(_common.BaseCMI);

exports.NAV = NAV;

var _event = new WeakMap();

},{"../constants/api_constants":9,"../constants/error_codes":10,"../constants/regex":12,"../exceptions":14,"../utilities":16,"./common":6}],8:[function(require,module,exports){
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
      return Util.addTwoDurations(_classPrivateFieldGet(this, _total_time), _classPrivateFieldGet(this, _session_time), scorm2004_regex.CMITimespan);
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
      children: scorm2004_constants.interactions_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT
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
      children: scorm2004_constants.objectives_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT
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
      children: scorm2004_constants.comments_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT
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
      children: scorm2004_constants.comments_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT
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
      score_children: scorm2004_constants.score_children,
      max: '',
      invalidErrorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      invalidTypeCode: scorm2004_error_codes.TYPE_MISMATCH,
      invalidRangeCode: scorm2004_error_codes.VALUE_OUT_OF_RANGE,
      decimalRegex: scorm2004_regex.CMIDecimal
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

},{"../constants/api_constants":9,"../constants/error_codes":10,"../constants/regex":12,"../constants/response_constants":13,"../exceptions":14,"../utilities":16,"./common":6}],9:[function(require,module,exports){
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

var aicc = _objectSpread({}, scorm12, {}, {
  cmi_children: 'core,suspend_data,launch_data,comments,objectives,student_data,student_preference,interactions,evaluation',
  student_data_children: 'attempt_number,tries,mastery_score,max_time_allowed,time_limit_action',
  tries_children: 'time,status,score'
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

},{}],10:[function(require,module,exports){
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

var scorm12 = _objectSpread({}, global, {}, {
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

var scorm2004 = _objectSpread({}, global, {}, {
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

var aicc = _objectSpread({}, scorm12, {}, {
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
  CMIShortIdentifier: '^[\\w\.]{1,250}$',
  // eslint-disable-line
  CMILongIdentifier: '^(?:(?!urn:)\\S{1,4000}|urn:[A-Za-z0-9-]{1,31}:\\S{1,4000})$',
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

},{}],13:[function(require,module,exports){
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

},{"./regex":12}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
"use strict";

var _Scorm2004API = _interopRequireDefault(require("./Scorm2004API"));

var _Scorm12API = _interopRequireDefault(require("./Scorm12API"));

var _AICC = _interopRequireDefault(require("./AICC"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

window.Scorm12API = _Scorm12API["default"];
window.Scorm2004API = _Scorm2004API["default"];
window.AICC = _AICC["default"];

},{"./AICC":1,"./Scorm12API":3,"./Scorm2004API":4}],16:[function(require,module,exports){
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
  if (Math.floor(num) === num) return 0;
  return num.toString().split('.')[1].length || 0;
}

},{}]},{},[1,2,5,6,7,8,9,10,11,12,13,14,15,3,4,16])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQUlDQy5qcyIsInNyYy9CYXNlQVBJLmpzIiwic3JjL1Njb3JtMTJBUEkuanMiLCJzcmMvU2Nvcm0yMDA0QVBJLmpzIiwic3JjL2NtaS9haWNjX2NtaS5qcyIsInNyYy9jbWkvY29tbW9uLmpzIiwic3JjL2NtaS9zY29ybTEyX2NtaS5qcyIsInNyYy9jbWkvc2Nvcm0yMDA0X2NtaS5qcyIsInNyYy9jb25zdGFudHMvYXBpX2NvbnN0YW50cy5qcyIsInNyYy9jb25zdGFudHMvZXJyb3JfY29kZXMuanMiLCJzcmMvY29uc3RhbnRzL2xhbmd1YWdlX2NvbnN0YW50cy5qcyIsInNyYy9jb25zdGFudHMvcmVnZXguanMiLCJzcmMvY29uc3RhbnRzL3Jlc3BvbnNlX2NvbnN0YW50cy5qcyIsInNyYy9leGNlcHRpb25zLmpzIiwic3JjL2V4cG9ydHMuanMiLCJzcmMvdXRpbGl0aWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQ0NBOztBQUNBOztBQUtBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBOzs7SUFHcUIsSTs7Ozs7QUFDbkI7Ozs7QUFJQSxnQkFBWSxRQUFaLEVBQTBCO0FBQUE7O0FBQUE7O0FBQ3hCLFFBQU0sYUFBYSxxQkFDZDtBQUNELE1BQUEsZ0JBQWdCLEVBQUU7QUFEakIsS0FEYyxNQUdYLFFBSFcsQ0FBbkI7O0FBTUEsOEVBQU0sYUFBTjtBQUVBLFVBQUssR0FBTCxHQUFXLElBQUksYUFBSixFQUFYO0FBQ0EsVUFBSyxHQUFMLEdBQVcsSUFBSSxnQkFBSixFQUFYO0FBVndCO0FBV3pCO0FBRUQ7Ozs7Ozs7Ozs7OztvQ0FRZ0IsVSxFQUFZLEssRUFBTyxlLEVBQWlCO0FBQ2xELFVBQUksUUFBUSw2RUFBeUIsVUFBekIsRUFBcUMsS0FBckMsRUFBNEMsZUFBNUMsQ0FBWjs7QUFFQSxVQUFJLENBQUMsUUFBTCxFQUFlO0FB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QUEsWUFBWSxFQUFFLG1DQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXpCVztBQTZCbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLCtCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQTdCVztBQWlDbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLHFDQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQWpDVztBQXFDbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLGlDQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXJDVztBQXlDbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLGtDQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXpDVztBQTZDbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLDhCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQTdDVztBQWlEbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLDhCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQWpEVztBQXFEbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLDBCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXJEVztBQXlEbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLHdCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXpEVztBQTZEbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLHFCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQTdEVztBQWlFbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLHFCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQWpFVztBQXFFbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLHdCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXJFVztBQXlFbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLDhCQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXpFVztBQTZFbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLGtDQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQTdFVztBQWlGbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLDBDQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQWpGVztBQXFGbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLGlDQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXJGVztBQXlGbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLGtDQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQXpGVztBQTZGbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLGtDQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQTdGVztBQWlHbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLHVDQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVixLQWpHVztBQXFHbEIsV0FBTztBQUNMLE1BQUEsWUFBWSxFQUFFLHVDQURUO0FBRUwsTUFBQSxhQUFhLEVBQUU7QUFGVjtBQXJHVztBQVhKLENBQWxCO0FBdUhBLElBQU0sWUFBWSxHQUFHO0FBQ25CLEVBQUEsTUFBTSxFQUFFLE1BRFc7QUFFbkIsRUFBQSxPQUFPLEVBQUUsT0FGVTtBQUduQixFQUFBLElBQUksRUFBRSxJQUhhO0FBSW5CLEVBQUEsU0FBUyxFQUFFO0FBSlEsQ0FBckI7ZUFPZSxZOzs7Ozs7Ozs7Ozs7Ozs7OztBQzVNZixJQUFNLE1BQU0sR0FBRztBQUNiLEVBQUEsT0FBTyxFQUFFLEdBREk7QUFFYixFQUFBLHFCQUFxQixFQUFFLEdBRlY7QUFHYixFQUFBLFdBQVcsRUFBRSxHQUhBO0FBSWIsRUFBQSxVQUFVLEVBQUUsR0FKQztBQUtiLEVBQUEsbUJBQW1CLEVBQUUsR0FMUjtBQU1iLEVBQUEsdUJBQXVCLEVBQUUsR0FOWjtBQU9iLEVBQUEsb0JBQW9CLEVBQUUsR0FQVDtBQVFiLEVBQUEsb0JBQW9CLEVBQUUsR0FSVDtBQVNiLEVBQUEsbUJBQW1CLEVBQUUsR0FUUjtBQVViLEVBQUEsaUJBQWlCLEVBQUUsR0FWTjtBQVdiLEVBQUEsZ0JBQWdCLEVBQUUsR0FYTDtBQVliLEVBQUEsa0JBQWtCLEVBQUUsR0FaUDtBQWFiLEVBQUEsaUJBQWlCLEVBQUUsR0FiTjtBQWNiLEVBQUEsY0FBYyxFQUFFLEdBZEg7QUFlYixFQUFBLGNBQWMsRUFBRSxHQWZIO0FBZ0JiLEVBQUEsV0FBVyxFQUFFLEdBaEJBO0FBaUJiLEVBQUEsbUJBQW1CLEVBQUUsR0FqQlI7QUFrQmIsRUFBQSxtQkFBbUIsRUFBRSxHQWxCUjtBQW1CYixFQUFBLHNCQUFzQixFQUFFLEdBbkJYO0FBb0JiLEVBQUEsb0JBQW9CLEVBQUUsR0FwQlQ7QUFxQmIsRUFBQSxxQkFBcUIsRUFBRSxHQXJCVjtBQXNCYixFQUFBLHFCQUFxQixFQUFFLEdBdEJWO0FBdUJiLEVBQUEsaUJBQWlCLEVBQUUsR0F2Qk47QUF3QmIsRUFBQSxpQkFBaUIsRUFBRSxHQXhCTjtBQXlCYixFQUFBLGtCQUFrQixFQUFFLEdBekJQO0FBMEJiLEVBQUEsYUFBYSxFQUFFLEdBMUJGO0FBMkJiLEVBQUEsa0JBQWtCLEVBQUUsR0EzQlA7QUE0QmIsRUFBQSwwQkFBMEIsRUFBRTtBQTVCZixDQUFmOztBQStCQSxJQUFNLE9BQU8scUJBQ1IsTUFEUSxNQUNHO0FBQ1osRUFBQSxvQkFBb0IsRUFBRSxHQURWO0FBRVosRUFBQSxpQkFBaUIsRUFBRSxHQUZQO0FBR1osRUFBQSxrQkFBa0IsRUFBRSxHQUhSO0FBSVosRUFBQSxjQUFjLEVBQUUsR0FKSjtBQUtaLEVBQUEsY0FBYyxFQUFFLEdBTEo7QUFNWixFQUFBLFdBQVcsRUFBRSxHQU5EO0FBT1osRUFBQSxvQkFBb0IsRUFBRSxHQVBWO0FBUVosRUFBQSxxQkFBcUIsRUFBRSxHQVJYO0FBU1osRUFBQSxxQkFBcUIsRUFBRSxHQVRYO0FBVVosRUFBQSxpQkFBaUIsRUFBRSxHQVZQO0FBV1osRUFBQSxpQkFBaUIsRUFBRSxHQVhQO0FBWVosRUFBQSxrQkFBa0IsRUFBRSxHQVpSO0FBYVosRUFBQSxhQUFhLEVBQUUsR0FiSDtBQWNaLEVBQUEsa0JBQWtCLEVBQUUsR0FkUjtBQWVaLEVBQUEsMEJBQTBCLEVBQUU7QUFmaEIsQ0FESCxDQUFiOztBQW9CQSxJQUFNLFNBQVMscUJBQ1YsTUFEVSxNQUNDO0FBQ1osRUFBQSxxQkFBcUIsRUFBRSxHQURYO0FBRVosRUFBQSxXQUFXLEVBQUUsR0FGRDtBQUdaLEVBQUEsVUFBVSxFQUFFLEdBSEE7QUFJWixFQUFBLG1CQUFtQixFQUFFLEdBSlQ7QUFLWixFQUFBLHVCQUF1QixFQUFFLEdBTGI7QUFNWixFQUFBLHFCQUFxQixFQUFFLEdBTlg7QUFPWixFQUFBLG9CQUFvQixFQUFFLEdBUFY7QUFRWixFQUFBLG1CQUFtQixFQUFFLEdBUlQ7QUFTWixFQUFBLGlCQUFpQixFQUFFLEdBVFA7QUFVWixFQUFBLGdCQUFnQixFQUFFLEdBVk47QUFXWixFQUFBLGtCQUFrQixFQUFFLEdBWFI7QUFZWixFQUFBLGlCQUFpQixFQUFFLEdBWlA7QUFhWixFQUFBLGNBQWMsRUFBRSxHQWJKO0FBY1osRUFBQSxtQkFBbUIsRUFBRSxHQWRUO0FBZVosRUFBQSxtQkFBbUIsRUFBRSxHQWZUO0FBZ0JaLEVBQUEsc0JBQXNCLEVBQUUsR0FoQlo7QUFpQlosRUFBQSxvQkFBb0IsRUFBRSxHQWpCVjtBQWtCWixFQUFBLHFCQUFxQixFQUFFLEdBbEJYO0FBbUJaLEVBQUEscUJBQXFCLEVBQUUsR0FuQlg7QUFvQlosRUFBQSxpQkFBaUIsRUFBRSxHQXBCUDtBQXFCWixFQUFBLGtCQUFrQixFQUFFLEdBckJSO0FBc0JaLEVBQUEsYUFBYSxFQUFFLEdBdEJIO0FBdUJaLEVBQUEsa0JBQWtCLEVBQUUsR0F2QlI7QUF3QlosRUFBQSwwQkFBMEIsRUFBRTtBQXhCaEIsQ0FERCxDQUFmOztBQTZCQSxJQUFNLFVBQVUsR0FBRztBQUNqQixFQUFBLE9BQU8sRUFBRSxPQURRO0FBRWpCLEVBQUEsU0FBUyxFQUFFO0FBRk0sQ0FBbkI7ZUFLZSxVOzs7Ozs7Ozs7O0FDdEZmLElBQU0sY0FBYyxHQUFHO0FBQ3JCLFFBQU0sSUFEZTtBQUNULFFBQU0sSUFERztBQUNHLFFBQU0sSUFEVDtBQUNlLFFBQU0sSUFEckI7QUFDMkIsUUFBTSxJQURqQztBQUN1QyxRQUFNLElBRDdDO0FBRXJCLFFBQU0sSUFGZTtBQUVULFFBQU0sSUFGRztBQUVHLFFBQU0sSUFGVDtBQUVlLFFBQU0sSUFGckI7QUFFMkIsUUFBTSxJQUZqQztBQUV1QyxRQUFNLElBRjdDO0FBR3JCLFFBQU0sSUFIZTtBQUdULFFBQU0sSUFIRztBQUdHLFFBQU0sSUFIVDtBQUdlLFFBQU0sSUFIckI7QUFHMkIsUUFBTSxJQUhqQztBQUd1QyxRQUFNLElBSDdDO0FBSXJCLFFBQU0sSUFKZTtBQUlULFFBQU0sSUFKRztBQUlHLFFBQU0sSUFKVDtBQUllLFFBQU0sSUFKckI7QUFJMkIsUUFBTSxJQUpqQztBQUl1QyxRQUFNLElBSjdDO0FBS3JCLFFBQU0sSUFMZTtBQUtULFFBQU0sSUFMRztBQUtHLFFBQU0sSUFMVDtBQUtlLFFBQU0sSUFMckI7QUFLMkIsUUFBTSxJQUxqQztBQUt1QyxRQUFNLElBTDdDO0FBTXJCLFFBQU0sSUFOZTtBQU1ULFFBQU0sSUFORztBQU1HLFFBQU0sSUFOVDtBQU1lLFFBQU0sSUFOckI7QUFNMkIsUUFBTSxJQU5qQztBQU11QyxRQUFNLElBTjdDO0FBT3JCLFFBQU0sSUFQZTtBQU9ULFFBQU0sSUFQRztBQU9HLFFBQU0sSUFQVDtBQU9lLFFBQU0sSUFQckI7QUFPMkIsUUFBTSxJQVBqQztBQU91QyxRQUFNLElBUDdDO0FBUXJCLFFBQU0sSUFSZTtBQVFULFFBQU0sSUFSRztBQVFHLFFBQU0sSUFSVDtBQVFlLFFBQU0sSUFSckI7QUFRMkIsUUFBTSxJQVJqQztBQVF1QyxRQUFNLElBUjdDO0FBU3JCLFFBQU0sSUFUZTtBQVNULFFBQU0sSUFURztBQVNHLFFBQU0sSUFUVDtBQVNlLFFBQU0sSUFUckI7QUFTMkIsUUFBTSxJQVRqQztBQVN1QyxRQUFNLElBVDdDO0FBVXJCLFFBQU0sSUFWZTtBQVVULFFBQU0sSUFWRztBQVVHLFFBQU0sSUFWVDtBQVVlLFFBQU0sSUFWckI7QUFVMkIsUUFBTSxJQVZqQztBQVV1QyxRQUFNLElBVjdDO0FBV3JCLFFBQU0sSUFYZTtBQVdULFFBQU0sSUFYRztBQVdHLFFBQU0sSUFYVDtBQVdlLFFBQU0sSUFYckI7QUFXMkIsUUFBTSxJQVhqQztBQVd1QyxRQUFNLElBWDdDO0FBWXJCLFFBQU0sSUFaZTtBQVlULFFBQU0sSUFaRztBQVlHLFFBQU0sSUFaVDtBQVllLFFBQU0sSUFackI7QUFZMkIsUUFBTSxJQVpqQztBQVl1QyxRQUFNLElBWjdDO0FBYXJCLFFBQU0sSUFiZTtBQWFULFFBQU0sSUFiRztBQWFHLFFBQU0sSUFiVDtBQWFlLFFBQU0sSUFickI7QUFhMkIsUUFBTSxJQWJqQztBQWF1QyxRQUFNLElBYjdDO0FBY3JCLFFBQU0sSUFkZTtBQWNULFFBQU0sSUFkRztBQWNHLFFBQU0sSUFkVDtBQWNlLFFBQU0sSUFkckI7QUFjMkIsUUFBTSxJQWRqQztBQWN1QyxRQUFNLElBZDdDO0FBZXJCLFFBQU0sSUFmZTtBQWVULFFBQU0sSUFmRztBQWVHLFFBQU0sSUFmVDtBQWVlLFFBQU0sSUFmckI7QUFlMkIsUUFBTSxJQWZqQztBQWV1QyxRQUFNLElBZjdDO0FBZ0JyQixRQUFNLElBaEJlO0FBZ0JULFFBQU0sSUFoQkc7QUFnQkcsUUFBTSxJQWhCVDtBQWdCZSxRQUFNLElBaEJyQjtBQWdCMkIsUUFBTSxJQWhCakM7QUFnQnVDLFFBQU0sSUFoQjdDO0FBaUJyQixRQUFNLElBakJlO0FBaUJULFFBQU0sSUFqQkc7QUFpQkcsUUFBTSxJQWpCVDtBQWlCZSxRQUFNLElBakJyQjtBQWlCMkIsUUFBTSxJQWpCakM7QUFpQnVDLFFBQU0sSUFqQjdDO0FBa0JyQixRQUFNLElBbEJlO0FBa0JULFFBQU0sSUFsQkc7QUFrQkcsUUFBTSxJQWxCVDtBQWtCZSxRQUFNLElBbEJyQjtBQWtCMkIsUUFBTSxJQWxCakM7QUFrQnVDLFFBQU0sSUFsQjdDO0FBbUJyQixRQUFNLElBbkJlO0FBbUJULFFBQU0sSUFuQkc7QUFtQkcsUUFBTSxJQW5CVDtBQW1CZSxRQUFNLElBbkJyQjtBQW1CMkIsUUFBTSxJQW5CakM7QUFtQnVDLFFBQU0sSUFuQjdDO0FBb0JyQixRQUFNLElBcEJlO0FBb0JULFFBQU0sSUFwQkc7QUFvQkcsUUFBTSxJQXBCVDtBQW9CZSxRQUFNLElBcEJyQjtBQW9CMkIsUUFBTSxJQXBCakM7QUFvQnVDLFFBQU0sSUFwQjdDO0FBcUJyQixRQUFNLElBckJlO0FBcUJULFFBQU0sSUFyQkc7QUFxQkcsUUFBTSxJQXJCVDtBQXFCZSxRQUFNLElBckJyQjtBQXFCMkIsUUFBTSxJQXJCakM7QUFxQnVDLFFBQU0sSUFyQjdDO0FBc0JyQixRQUFNLElBdEJlO0FBc0JULFFBQU0sSUF0Qkc7QUFzQkcsUUFBTSxJQXRCVDtBQXNCZSxRQUFNLElBdEJyQjtBQXNCMkIsUUFBTSxJQXRCakM7QUFzQnVDLFFBQU0sSUF0QjdDO0FBdUJyQixRQUFNLElBdkJlO0FBdUJULFFBQU0sSUF2Qkc7QUF1QkcsUUFBTSxJQXZCVDtBQXVCZSxRQUFNLElBdkJyQjtBQXVCMkIsUUFBTSxJQXZCakM7QUF1QnVDLFFBQU0sSUF2QjdDO0FBd0JyQixRQUFNLElBeEJlO0FBd0JULFFBQU0sSUF4Qkc7QUF3QkcsUUFBTSxJQXhCVDtBQXdCZSxRQUFNLElBeEJyQjtBQXdCMkIsUUFBTSxJQXhCakM7QUF3QnVDLFFBQU0sSUF4QjdDO0FBeUJyQixRQUFNLElBekJlO0FBeUJULFFBQU0sSUF6Qkc7QUF5QkcsUUFBTSxJQXpCVDtBQXlCZSxRQUFNLElBekJyQjtBQXlCMkIsUUFBTSxJQXpCakM7QUF5QnVDLFFBQU0sSUF6QjdDO0FBMEJyQixRQUFNLElBMUJlO0FBMEJULFFBQU0sSUExQkc7QUEwQkcsUUFBTSxJQTFCVDtBQTBCZSxRQUFNLElBMUJyQjtBQTBCMkIsUUFBTSxJQTFCakM7QUEwQnVDLFFBQU0sSUExQjdDO0FBMkJyQixRQUFNLElBM0JlO0FBMkJULFFBQU0sSUEzQkc7QUEyQkcsUUFBTSxJQTNCVDtBQTJCZSxRQUFNLElBM0JyQjtBQTJCMkIsUUFBTSxJQTNCakM7QUEyQnVDLFFBQU0sSUEzQjdDO0FBNEJyQixRQUFNLElBNUJlO0FBNEJULFFBQU0sSUE1Qkc7QUE0QkcsUUFBTSxJQTVCVDtBQTRCZSxRQUFNLElBNUJyQjtBQTRCMkIsUUFBTSxJQTVCakM7QUE0QnVDLFFBQU0sSUE1QjdDO0FBNkJyQixRQUFNLElBN0JlO0FBNkJULFFBQU0sSUE3Qkc7QUE2QkcsUUFBTSxJQTdCVDtBQTZCZSxRQUFNLElBN0JyQjtBQTZCMkIsUUFBTSxJQTdCakM7QUE2QnVDLFFBQU0sSUE3QjdDO0FBOEJyQixRQUFNLElBOUJlO0FBOEJULFFBQU0sSUE5Qkc7QUE4QkcsUUFBTSxJQTlCVDtBQThCZSxRQUFNLElBOUJyQjtBQThCMkIsUUFBTSxJQTlCakM7QUE4QnVDLFFBQU0sSUE5QjdDO0FBK0JyQixRQUFNLElBL0JlO0FBK0JULFFBQU0sSUEvQkc7QUErQkcsUUFBTSxJQS9CVDtBQStCZSxRQUFNLElBL0JyQjtBQStCMkIsUUFBTSxJQS9CakM7QUErQnVDLFFBQU0sSUEvQjdDO0FBZ0NyQixTQUFPLEtBaENjO0FBZ0NQLFNBQU8sS0FoQ0E7QUFnQ08sU0FBTyxLQWhDZDtBQWdDcUIsU0FBTyxLQWhDNUI7QUFnQ21DLFNBQU8sS0FoQzFDO0FBaUNyQixTQUFPLEtBakNjO0FBaUNQLFNBQU8sS0FqQ0E7QUFpQ08sU0FBTyxLQWpDZDtBQWlDcUIsU0FBTyxLQWpDNUI7QUFpQ21DLFNBQU8sS0FqQzFDO0FBa0NyQixTQUFPLEtBbENjO0FBa0NQLFNBQU8sS0FsQ0E7QUFrQ08sU0FBTyxLQWxDZDtBQWtDcUIsU0FBTyxLQWxDNUI7QUFrQ21DLFNBQU8sS0FsQzFDO0FBbUNyQixTQUFPLEtBbkNjO0FBbUNQLFNBQU8sS0FuQ0E7QUFtQ08sU0FBTyxLQW5DZDtBQW1DcUIsU0FBTyxLQW5DNUI7QUFtQ21DLFNBQU8sS0FuQzFDO0FBb0NyQixTQUFPLEtBcENjO0FBb0NQLFNBQU8sS0FwQ0E7QUFvQ08sU0FBTyxLQXBDZDtBQW9DcUIsU0FBTyxLQXBDNUI7QUFvQ21DLFNBQU8sS0FwQzFDO0FBcUNyQixTQUFPLEtBckNjO0FBcUNQLFNBQU8sS0FyQ0E7QUFxQ08sU0FBTyxLQXJDZDtBQXFDcUIsU0FBTyxLQXJDNUI7QUFxQ21DLFNBQU8sS0FyQzFDO0FBc0NyQixTQUFPLEtBdENjO0FBc0NQLFNBQU8sS0F0Q0E7QUFzQ08sU0FBTyxLQXRDZDtBQXNDcUIsU0FBTyxLQXRDNUI7QUFzQ21DLFNBQU8sS0F0QzFDO0FBdUNyQixTQUFPLEtBdkNjO0FBdUNQLFNBQU8sS0F2Q0E7QUF1Q08sU0FBTyxLQXZDZDtBQXVDcUIsU0FBTyxLQXZDNUI7QUF1Q21DLFNBQU8sS0F2QzFDO0FBd0NyQixTQUFPLEtBeENjO0FBd0NQLFNBQU8sS0F4Q0E7QUF3Q08sU0FBTyxLQXhDZDtBQXdDcUIsU0FBTyxLQXhDNUI7QUF3Q21DLFNBQU8sS0F4QzFDO0FBeUNyQixTQUFPLEtBekNjO0FBeUNQLFNBQU8sS0F6Q0E7QUF5Q08sU0FBTyxLQXpDZDtBQXlDcUIsU0FBTyxLQXpDNUI7QUF5Q21DLFNBQU8sS0F6QzFDO0FBMENyQixTQUFPLEtBMUNjO0FBMENQLFNBQU8sS0ExQ0E7QUEwQ08sU0FBTyxLQTFDZDtBQTBDcUIsU0FBTyxLQTFDNUI7QUEwQ21DLFNBQU8sS0ExQzFDO0FBMkNyQixTQUFPLEtBM0NjO0FBMkNQLFNBQU8sS0EzQ0E7QUEyQ08sU0FBTyxLQTNDZDtBQTJDcUIsU0FBTyxLQTNDNUI7QUEyQ21DLFNBQU8sS0EzQzFDO0FBNENyQixTQUFPLEtBNUNjO0FBNENQLFNBQU8sS0E1Q0E7QUE0Q08sU0FBTyxLQTVDZDtBQTRDcUIsU0FBTyxLQTVDNUI7QUE0Q21DLFNBQU8sS0E1QzFDO0FBNkNyQixTQUFPLEtBN0NjO0FBNkNQLFNBQU8sS0E3Q0E7QUE2Q08sU0FBTyxLQTdDZDtBQTZDcUIsU0FBTyxLQTdDNUI7QUE2Q21DLFNBQU8sS0E3QzFDO0FBOENyQixTQUFPLEtBOUNjO0FBOENQLFNBQU8sS0E5Q0E7QUE4Q08sU0FBTyxLQTlDZDtBQThDcUIsU0FBTyxLQTlDNUI7QUE4Q21DLFNBQU8sS0E5QzFDO0FBK0NyQixTQUFPLEtBL0NjO0FBK0NQLFNBQU8sS0EvQ0E7QUErQ08sU0FBTyxLQS9DZDtBQStDcUIsU0FBTyxLQS9DNUI7QUErQ21DLFNBQU8sS0EvQzFDO0FBZ0RyQixTQUFPLEtBaERjO0FBZ0RQLFNBQU8sS0FoREE7QUFnRE8sU0FBTyxLQWhEZDtBQWdEcUIsU0FBTyxLQWhENUI7QUFnRG1DLFNBQU8sS0FoRDFDO0FBaURyQixTQUFPLEtBakRjO0FBaURQLFNBQU8sS0FqREE7QUFpRE8sU0FBTyxLQWpEZDtBQWlEcUIsU0FBTyxLQWpENUI7QUFpRG1DLFNBQU8sS0FqRDFDO0FBa0RyQixTQUFPLEtBbERjO0FBa0RQLFNBQU8sS0FsREE7QUFrRE8sU0FBTyxLQWxEZDtBQWtEcUIsU0FBTyxLQWxENUI7QUFrRG1DLFNBQU8sS0FsRDFDO0FBbURyQixTQUFPLEtBbkRjO0FBbURQLFNBQU8sS0FuREE7QUFtRE8sU0FBTyxLQW5EZDtBQW1EcUIsU0FBTyxLQW5ENUI7QUFtRG1DLFNBQU8sS0FuRDFDO0FBb0RyQixTQUFPLEtBcERjO0FBb0RQLFNBQU8sS0FwREE7QUFvRE8sU0FBTyxLQXBEZDtBQW9EcUIsU0FBTyxLQXBENUI7QUFvRG1DLFNBQU8sS0FwRDFDO0FBcURyQixTQUFPLEtBckRjO0FBcURQLFNBQU8sS0FyREE7QUFxRE8sU0FBTyxLQXJEZDtBQXFEcUIsU0FBTyxLQXJENUI7QUFxRG1DLFNBQU8sS0FyRDFDO0FBc0RyQixTQUFPLEtBdERjO0FBc0RQLFNBQU8sS0F0REE7QUFzRE8sU0FBTyxLQXREZDtBQXNEcUIsU0FBTyxLQXRENUI7QUFzRG1DLFNBQU8sS0F0RDFDO0FBdURyQixTQUFPLEtBdkRjO0FBdURQLFNBQU8sS0F2REE7QUF1RE8sU0FBTyxLQXZEZDtBQXVEcUIsU0FBTyxLQXZENUI7QUF1RG1DLFNBQU8sS0F2RDFDO0FBd0RyQixTQUFPLEtBeERjO0FBd0RQLFNBQU8sS0F4REE7QUF3RE8sU0FBTyxLQXhEZDtBQXdEcUIsU0FBTyxLQXhENUI7QUF3RG1DLFNBQU8sS0F4RDFDO0FBeURyQixTQUFPLEtBekRjO0FBeURQLFNBQU8sS0F6REE7QUF5RE8sU0FBTyxLQXpEZDtBQXlEcUIsU0FBTyxLQXpENUI7QUF5RG1DLFNBQU8sS0F6RDFDO0FBMERyQixTQUFPLEtBMURjO0FBMERQLFNBQU8sS0ExREE7QUEwRE8sU0FBTyxLQTFEZDtBQTBEcUIsU0FBTyxLQTFENUI7QUEwRG1DLFNBQU8sS0ExRDFDO0FBMkRyQixTQUFPLEtBM0RjO0FBMkRQLFNBQU8sS0EzREE7QUEyRE8sU0FBTyxLQTNEZDtBQTJEcUIsU0FBTyxLQTNENUI7QUEyRG1DLFNBQU8sS0EzRDFDO0FBNERyQixTQUFPLEtBNURjO0FBNERQLFNBQU8sS0E1REE7QUE0RE8sU0FBTyxLQTVEZDtBQTREcUIsU0FBTyxLQTVENUI7QUE0RG1DLFNBQU8sS0E1RDFDO0FBNkRyQixTQUFPLEtBN0RjO0FBNkRQLFNBQU8sS0E3REE7QUE2RE8sU0FBTyxLQTdEZDtBQTZEcUIsU0FBTyxLQTdENUI7QUE2RG1DLFNBQU8sS0E3RDFDO0FBOERyQixTQUFPLEtBOURjO0FBOERQLFNBQU8sS0E5REE7QUE4RE8sU0FBTyxLQTlEZDtBQThEcUIsU0FBTyxLQTlENUI7QUE4RG1DLFNBQU8sS0E5RDFDO0FBK0RyQixTQUFPLEtBL0RjO0FBK0RQLFNBQU8sS0EvREE7QUErRE8sU0FBTyxLQS9EZDtBQStEcUIsU0FBTyxLQS9ENUI7QUErRG1DLFNBQU8sS0EvRDFDO0FBZ0VyQixTQUFPLEtBaEVjO0FBZ0VQLFNBQU8sS0FoRUE7QUFnRU8sU0FBTyxLQWhFZDtBQWdFcUIsU0FBTyxLQWhFNUI7QUFnRW1DLFNBQU8sS0FoRTFDO0FBaUVyQixTQUFPLEtBakVjO0FBaUVQLFNBQU8sS0FqRUE7QUFpRU8sU0FBTyxLQWpFZDtBQWlFcUIsU0FBTyxLQWpFNUI7QUFpRW1DLFNBQU8sS0FqRTFDO0FBa0VyQixTQUFPLEtBbEVjO0FBa0VQLFNBQU8sS0FsRUE7QUFrRU8sU0FBTyxLQWxFZDtBQWtFcUIsU0FBTyxLQWxFNUI7QUFrRW1DLFNBQU8sS0FsRTFDO0FBbUVyQixTQUFPLEtBbkVjO0FBbUVQLFNBQU8sS0FuRUE7QUFtRU8sU0FBTyxLQW5FZDtBQW1FcUIsU0FBTyxLQW5FNUI7QUFtRW1DLFNBQU8sS0FuRTFDO0FBb0VyQixTQUFPLEtBcEVjO0FBb0VQLFNBQU8sS0FwRUE7QUFvRU8sU0FBTyxLQXBFZDtBQW9FcUIsU0FBTyxLQXBFNUI7QUFvRW1DLFNBQU8sS0FwRTFDO0FBcUVyQixTQUFPLEtBckVjO0FBcUVQLFNBQU8sS0FyRUE7QUFxRU8sU0FBTyxLQXJFZDtBQXFFcUIsU0FBTyxLQXJFNUI7QUFxRW1DLFNBQU8sS0FyRTFDO0FBc0VyQixTQUFPLEtBdEVjO0FBc0VQLFNBQU8sS0F0RUE7QUFzRU8sU0FBTyxLQXRFZDtBQXNFcUIsU0FBTyxLQXRFNUI7QUFzRW1DLFNBQU8sS0F0RTFDO0FBdUVyQixTQUFPLEtBdkVjO0FBdUVQLFNBQU8sS0F2RUE7QUF1RU8sU0FBTyxLQXZFZDtBQXVFcUIsU0FBTyxLQXZFNUI7QUF1RW1DLFNBQU8sS0F2RTFDO0FBd0VyQixTQUFPLEtBeEVjO0FBd0VQLFNBQU8sS0F4RUE7QUF3RU8sU0FBTyxLQXhFZDtBQXdFcUIsU0FBTyxLQXhFNUI7QUF3RW1DLFNBQU87QUF4RTFDLENBQXZCO2VBMkVlLGM7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekVmLElBQU0sT0FBTyxHQUFHO0FBQ2QsRUFBQSxZQUFZLEVBQUUsWUFEQTtBQUVkLEVBQUEsYUFBYSxFQUFFLGFBRkQ7QUFHZCxFQUFBLE9BQU8sRUFBRSx1REFISztBQUdvRDtBQUNsRSxFQUFBLFdBQVcsRUFBRSxvREFKQztBQUlxRDtBQUNuRSxFQUFBLFVBQVUsRUFBRSxRQUxFO0FBTWQsRUFBQSxXQUFXLEVBQUUsY0FOQztBQU9kLEVBQUEsVUFBVSxFQUFFLDZCQVBFO0FBTzZCO0FBQzNDLEVBQUEsYUFBYSxFQUFFLDRCQVJEO0FBU2QsRUFBQSxXQUFXLEVBQUUsWUFUQztBQVNhO0FBQzNCLEVBQUEsUUFBUSxFQUFFLGFBVkk7QUFZZDtBQUNBLEVBQUEsU0FBUyxFQUFFLGdEQWJHO0FBY2QsRUFBQSxVQUFVLEVBQUUsOERBZEU7QUFlZCxFQUFBLE9BQU8sRUFBRSw4QkFmSztBQWdCZCxFQUFBLE9BQU8sRUFBRSw4RUFoQks7QUFpQmQsRUFBQSxTQUFTLEVBQUUsbUVBakJHO0FBaUJrRTtBQUNoRixFQUFBLFFBQVEsRUFBRSx1QkFsQkk7QUFvQmQ7QUFDQSxFQUFBLFdBQVcsRUFBRSxPQXJCQztBQXNCZCxFQUFBLFdBQVcsRUFBRSxRQXRCQztBQXVCZCxFQUFBLFdBQVcsRUFBRSxVQXZCQztBQXdCZCxFQUFBLGVBQWUsRUFBRSxVQXhCSDtBQXlCZCxFQUFBLFVBQVUsRUFBRTtBQXpCRSxDQUFoQjs7QUE0QkEsSUFBTSxJQUFJLHFCQUNMLE9BREssTUFDTztBQUNiLEVBQUEsYUFBYSxFQUFFO0FBREYsQ0FEUCxDQUFWOztBQU1BLElBQU0sU0FBUyxHQUFHO0FBQ2hCLEVBQUEsWUFBWSxFQUFFLDRCQURFO0FBRWhCLEVBQUEsWUFBWSxFQUFFLDRCQUZFO0FBR2hCLEVBQUEsYUFBYSxFQUFFLDZCQUhDO0FBSWhCLEVBQUEsYUFBYSxFQUFFLDZCQUpDO0FBS2hCLEVBQUEsY0FBYyxFQUFFLDhCQUxBO0FBTWhCLEVBQUEsT0FBTyxFQUFFLGlEQU5PO0FBTTRDO0FBQzVELEVBQUEsZ0JBQWdCLEVBQUUsK0VBUEY7QUFPbUY7QUFDbkcsRUFBQSxTQUFTLEVBQUUsaUVBUks7QUFROEQ7QUFDOUUsRUFBQSxrQkFBa0IsRUFBRSx5RUFUSjtBQVMrRTtBQUMvRixFQUFBLGlCQUFpQixFQUFFLGdGQVZIO0FBVXFGO0FBQ3JHLEVBQUEsT0FBTyxFQUFFLDBSQVhPO0FBWWhCLEVBQUEsV0FBVyxFQUFFLDRIQVpHO0FBYWhCLEVBQUEsVUFBVSxFQUFFLFFBYkk7QUFjaEIsRUFBQSxXQUFXLEVBQUUsY0FkRztBQWVoQixFQUFBLFVBQVUsRUFBRSxtQ0FmSTtBQWdCaEIsRUFBQSxhQUFhLEVBQUUseUJBaEJDO0FBaUJoQixFQUFBLGtCQUFrQixFQUFFLGtCQWpCSjtBQWlCd0I7QUFDeEMsRUFBQSxpQkFBaUIsRUFBRSw4REFsQkg7QUFtQmhCLEVBQUEsV0FBVyxFQUFFLE1BbkJHO0FBbUJLO0FBQ3JCLEVBQUEsUUFBUSxFQUFFLGFBcEJNO0FBcUJoQixFQUFBLGFBQWEsRUFBRSxXQXJCQztBQXVCaEI7QUFDQSxFQUFBLFVBQVUsRUFBRSxnREF4Qkk7QUF5QmhCLEVBQUEsVUFBVSxFQUFFLDJCQXpCSTtBQTBCaEIsRUFBQSxPQUFPLEVBQUUsb0NBMUJPO0FBMkJoQixFQUFBLE9BQU8sRUFBRSxpR0EzQk87QUE0QmhCLEVBQUEsU0FBUyxFQUFFLHlFQTVCSztBQTZCaEIsRUFBQSxRQUFRLEVBQUUsOEdBN0JNO0FBNkIwRztBQUMxSCxFQUFBLFVBQVUsRUFBRSx3QkE5Qkk7QUErQmhCLEVBQUEsU0FBUyxFQUFFLDZEQS9CSztBQWlDaEI7QUFDQSxFQUFBLFlBQVksRUFBRSxNQWxDRTtBQW1DaEIsRUFBQSxXQUFXLEVBQUUsS0FuQ0c7QUFvQ2hCLEVBQUEsV0FBVyxFQUFFLEtBcENHO0FBcUNoQixFQUFBLFVBQVUsRUFBRSxNQXJDSTtBQXNDaEIsRUFBQSxjQUFjLEVBQUU7QUF0Q0EsQ0FBbEI7QUF5Q0EsSUFBTSxLQUFLLEdBQUc7QUFDWixFQUFBLElBQUksRUFBRSxJQURNO0FBRVosRUFBQSxPQUFPLEVBQUUsT0FGRztBQUdaLEVBQUEsU0FBUyxFQUFFO0FBSEMsQ0FBZDtlQU1lLEs7Ozs7Ozs7Ozs7O0FDbEZmOzs7O0FBRUEsSUFBTSxlQUFlLEdBQUcsa0JBQU0sU0FBOUI7QUFFQSxJQUFNLE9BQU8sR0FBRztBQUNkLGdCQUFjO0FBQ1osSUFBQSxNQUFNLEVBQUUsZ0JBREk7QUFFWixJQUFBLEdBQUcsRUFBRSxDQUZPO0FBR1osSUFBQSxTQUFTLEVBQUUsRUFIQztBQUlaLElBQUEsTUFBTSxFQUFFO0FBSkksR0FEQTtBQU9kLFlBQVU7QUFDUixJQUFBLE1BQU0sRUFBRSxlQUFlLENBQUMsa0JBRGhCO0FBRVIsSUFBQSxHQUFHLEVBQUUsRUFGRztBQUdSLElBQUEsU0FBUyxFQUFFLEtBSEg7QUFJUixJQUFBLE1BQU0sRUFBRTtBQUpBLEdBUEk7QUFhZCxhQUFXO0FBQ1QsSUFBQSxNQUFNLEVBQUUsZUFBZSxDQUFDLGdCQURmO0FBRVQsSUFBQSxHQUFHLEVBQUUsRUFGSTtBQUdULElBQUEsU0FBUyxFQUFFLEtBSEY7QUFJVCxJQUFBLE1BQU0sRUFBRTtBQUpDLEdBYkc7QUFtQmQsa0JBQWdCO0FBQ2QsSUFBQSxNQUFNLEVBQUUsZUFBZSxDQUFDLGlCQURWO0FBRWQsSUFBQSxHQUFHLEVBQUUsQ0FGUztBQUdkLElBQUEsU0FBUyxFQUFFLEVBSEc7QUFJZCxJQUFBLE1BQU0sRUFBRTtBQUpNLEdBbkJGO0FBeUJkLGNBQVk7QUFDVixJQUFBLE1BQU0sRUFBRSxlQUFlLENBQUMsa0JBRGQ7QUFFVixJQUFBLE9BQU8sRUFBRSxlQUFlLENBQUMsa0JBRmY7QUFHVixJQUFBLEdBQUcsRUFBRSxFQUhLO0FBSVYsSUFBQSxTQUFTLEVBQUUsS0FKRDtBQUtWLElBQUEsVUFBVSxFQUFFLEtBTEY7QUFNVixJQUFBLE1BQU0sRUFBRTtBQU5FLEdBekJFO0FBaUNkLGlCQUFlO0FBQ2IsSUFBQSxNQUFNLEVBQUUsUUFBUSxlQUFlLENBQUMsa0JBRG5CO0FBRWIsSUFBQSxPQUFPLEVBQUUsZUFBZSxDQUFDLFVBQWhCLEdBQTZCLE1BQTdCLEdBQ0wsZUFBZSxDQUFDLGtCQUhQO0FBSWIsSUFBQSxHQUFHLEVBQUUsR0FKUTtBQUtiLElBQUEsU0FBUyxFQUFFLEtBTEU7QUFNYixJQUFBLFVBQVUsRUFBRSxLQU5DO0FBT2IsSUFBQSxNQUFNLEVBQUU7QUFQSyxHQWpDRDtBQTBDZCxnQkFBYztBQUNaLElBQUEsTUFBTSxFQUFFLGVBQWUsQ0FBQyxrQkFEWjtBQUVaLElBQUEsR0FBRyxFQUFFLEVBRk87QUFHWixJQUFBLFNBQVMsRUFBRSxLQUhDO0FBSVosSUFBQSxNQUFNLEVBQUU7QUFKSSxHQTFDQTtBQWdEZCxZQUFVO0FBQ1IsSUFBQSxNQUFNLEVBQUUsZUFBZSxDQUFDLGtCQURoQjtBQUVSLElBQUEsR0FBRyxFQUFFLENBRkc7QUFHUixJQUFBLFNBQVMsRUFBRSxFQUhIO0FBSVIsSUFBQSxNQUFNLEVBQUU7QUFKQSxHQWhESTtBQXNEZCxhQUFXO0FBQ1QsSUFBQSxNQUFNLEVBQUUsZUFBZSxDQUFDLFVBRGY7QUFFVCxJQUFBLEdBQUcsRUFBRSxDQUZJO0FBR1QsSUFBQSxTQUFTLEVBQUUsRUFIRjtBQUlULElBQUEsTUFBTSxFQUFFO0FBSkMsR0F0REc7QUE0RGQsV0FBUztBQUNQLElBQUEsTUFBTSxFQUFFLGVBQWUsQ0FBQyxhQURqQjtBQUVQLElBQUEsR0FBRyxFQUFFLENBRkU7QUFHUCxJQUFBLFNBQVMsRUFBRSxFQUhKO0FBSVAsSUFBQSxNQUFNLEVBQUU7QUFKRDtBQTVESyxDQUFoQjtBQW9FQSxJQUFNLE9BQU8sR0FBRztBQUNkLGdCQUFjO0FBQ1osSUFBQSxHQUFHLEVBQUUsQ0FETztBQUVaLElBQUEsU0FBUyxFQUFFLEVBRkM7QUFHWixJQUFBLE1BQU0sRUFBRSxLQUhJO0FBSVosSUFBQSxTQUFTLEVBQUUsS0FKQztBQUtaLElBQUEsTUFBTSxFQUFFLGdCQUxJO0FBTVosSUFBQSxLQUFLLEVBQUU7QUFOSyxHQURBO0FBU2QsWUFBVTtBQUNSLElBQUEsR0FBRyxFQUFFLEVBREc7QUFFUixJQUFBLFNBQVMsRUFBRSxLQUZIO0FBR1IsSUFBQSxNQUFNLEVBQUUsSUFIQTtBQUlSLElBQUEsU0FBUyxFQUFFLEtBSkg7QUFLUixJQUFBLE1BQU0sRUFBRSxlQUFlLENBQUM7QUFMaEIsR0FUSTtBQWdCZCxhQUFXO0FBQ1QsSUFBQSxHQUFHLEVBQUUsRUFESTtBQUVULElBQUEsU0FBUyxFQUFFLEtBRkY7QUFHVCxJQUFBLE1BQU0sRUFBRSxLQUhDO0FBSVQsSUFBQSxTQUFTLEVBQUUsS0FKRjtBQUtULElBQUEsTUFBTSxFQUFFLGVBQWUsQ0FBQztBQUxmLEdBaEJHO0FBdUJkLGtCQUFnQjtBQUNkLElBQUEsR0FBRyxFQUFFLENBRFM7QUFFZCxJQUFBLFNBQVMsRUFBRSxFQUZHO0FBR2QsSUFBQSxNQUFNLEVBQUUsS0FITTtBQUlkLElBQUEsU0FBUyxFQUFFLElBSkc7QUFLZCxJQUFBLE1BQU0sRUFBRSxlQUFlLENBQUM7QUFMVixHQXZCRjtBQThCZCxjQUFZO0FBQ1YsSUFBQSxHQUFHLEVBQUUsRUFESztBQUVWLElBQUEsU0FBUyxFQUFFLEtBRkQ7QUFHVixJQUFBLFVBQVUsRUFBRSxLQUhGO0FBSVYsSUFBQSxNQUFNLEVBQUUsS0FKRTtBQUtWLElBQUEsU0FBUyxFQUFFLEtBTEQ7QUFNVixJQUFBLE1BQU0sRUFBRSxlQUFlLENBQUMsa0JBTmQ7QUFPVixJQUFBLE9BQU8sRUFBRSxlQUFlLENBQUM7QUFQZixHQTlCRTtBQXVDZCxpQkFBZTtBQUNiLElBQUEsR0FBRyxFQUFFLEdBRFE7QUFFYixJQUFBLFNBQVMsRUFBRSxLQUZFO0FBR2IsSUFBQSxVQUFVLEVBQUUsS0FIQztBQUliLElBQUEsTUFBTSxFQUFFLEtBSks7QUFLYixJQUFBLFNBQVMsRUFBRSxLQUxFO0FBTWIsSUFBQSxNQUFNLEVBQUUsUUFBUSxlQUFlLENBQUMsa0JBTm5CO0FBT2IsSUFBQSxPQUFPLEVBQUUsZUFBZSxDQUFDLFVBQWhCLEdBQTZCLE1BQTdCLEdBQ0wsZUFBZSxDQUFDO0FBUlAsR0F2Q0Q7QUFpRGQsZ0JBQWM7QUFDWixJQUFBLEdBQUcsRUFBRSxFQURPO0FBRVosSUFBQSxTQUFTLEVBQUUsS0FGQztBQUdaLElBQUEsTUFBTSxFQUFFLEtBSEk7QUFJWixJQUFBLFNBQVMsRUFBRSxLQUpDO0FBS1osSUFBQSxNQUFNLEVBQUUsZUFBZSxDQUFDO0FBTFosR0FqREE7QUF3RGQsWUFBVTtBQUNSLElBQUEsR0FBRyxFQUFFLENBREc7QUFFUixJQUFBLFNBQVMsRUFBRSxFQUZIO0FBR1IsSUFBQSxNQUFNLEVBQUUsS0FIQTtBQUlSLElBQUEsU0FBUyxFQUFFLEtBSkg7QUFLUixJQUFBLE1BQU0sRUFBRSxlQUFlLENBQUMsa0JBTGhCO0FBTVIsSUFBQSxLQUFLLEVBQUU7QUFOQyxHQXhESTtBQWdFZCxhQUFXO0FBQ1QsSUFBQSxHQUFHLEVBQUUsQ0FESTtBQUVULElBQUEsU0FBUyxFQUFFLEtBRkY7QUFHVCxJQUFBLE1BQU0sRUFBRSxLQUhDO0FBSVQsSUFBQSxTQUFTLEVBQUUsS0FKRjtBQUtULElBQUEsTUFBTSxFQUFFLGVBQWUsQ0FBQyxVQUxmO0FBTVQsSUFBQSxLQUFLLEVBQUU7QUFORSxHQWhFRztBQXdFZCxXQUFTO0FBQ1AsSUFBQSxHQUFHLEVBQUUsQ0FERTtBQUVQLElBQUEsU0FBUyxFQUFFLEVBRko7QUFHUCxJQUFBLE1BQU0sRUFBRSxLQUhEO0FBSVAsSUFBQSxTQUFTLEVBQUUsS0FKSjtBQUtQLElBQUEsTUFBTSxFQUFFLGVBQWUsQ0FBQyxhQUxqQjtBQU1QLElBQUEsS0FBSyxFQUFFO0FBTkE7QUF4RUssQ0FBaEI7QUFrRkEsSUFBTSxTQUFTLEdBQUc7QUFDaEIsRUFBQSxPQUFPLEVBQUUsT0FETztBQUVoQixFQUFBLE9BQU8sRUFBRTtBQUZPLENBQWxCO2VBS2UsUzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM5SmY7OztJQUdhLGU7Ozs7O0FBQ1g7Ozs7QUFJQSwyQkFBWSxTQUFaLEVBQStCO0FBQUE7O0FBQUE7O0FBQzdCLHlGQUFNLFNBQU47O0FBRDZCO0FBQUE7QUFBQTtBQUFBOztBQUU3QixxRUFBa0IsU0FBbEI7O0FBRjZCO0FBRzlCOzs7OztBQUlEOzs7O3dCQUlnQjtBQUNkLG1DQUFPLElBQVA7QUFDRDtBQUVEOzs7Ozs7O3dCQUljO0FBQ1osYUFBTywwQ0FBa0IsRUFBekI7QUFDRDs7OzttQkExQmtDLEs7Ozs7Ozs7OztBQ0xyQzs7QUFDQTs7QUFDQTs7OztBQUVBLE1BQU0sQ0FBQyxVQUFQLEdBQW9CLHNCQUFwQjtBQUNBLE1BQU0sQ0FBQyxZQUFQLEdBQXNCLHdCQUF0QjtBQUNBLE1BQU0sQ0FBQyxJQUFQLEdBQWMsZ0JBQWQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0xPLElBQU0sa0JBQWtCLEdBQUcsR0FBM0I7O0FBQ0EsSUFBTSxrQkFBa0IsR0FBRyxFQUEzQjs7QUFDQSxJQUFNLGdCQUFnQixHQUFHLEtBQUssa0JBQTlCOztBQUNBLElBQU0sZUFBZSxHQUFHLEtBQUssZ0JBQTdCOztBQUVQLElBQU0sWUFBWSxHQUFHLENBQ25CLENBQUMsR0FBRCxFQUFNLGVBQU4sQ0FEbUIsRUFFbkIsQ0FBQyxHQUFELEVBQU0sZ0JBQU4sQ0FGbUIsRUFHbkIsQ0FBQyxHQUFELEVBQU0sa0JBQU4sQ0FIbUIsRUFJbkIsQ0FBQyxHQUFELEVBQU0sa0JBQU4sQ0FKbUIsQ0FBckI7QUFPQTs7Ozs7OztBQU1PLFNBQVMsa0JBQVQsQ0FBNEIsWUFBNUIsRUFBa0Q7QUFDdkQ7QUFDQSxNQUFJLENBQUMsWUFBRCxJQUFpQixZQUFZLElBQUksQ0FBckMsRUFBd0M7QUFDdEMsV0FBTyxVQUFQO0FBQ0Q7O0FBRUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUwsQ0FBVyxZQUFZLEdBQUcsZ0JBQTFCLENBQWQ7QUFFQSxNQUFNLE9BQU8sR0FBRyxJQUFJLElBQUosQ0FBUyxZQUFZLEdBQUcsSUFBeEIsQ0FBaEI7QUFDQSxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsYUFBUixFQUFoQixDQVR1RCxDQVV2RDs7QUFDQSxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBUixFQUFoQjtBQUNBLE1BQU0sRUFBRSxHQUFHLFlBQVksR0FBRyxHQUExQjtBQUNBLE1BQUksS0FBSyxHQUFHLEVBQVo7O0FBQ0EsTUFBSSxhQUFhLENBQUMsRUFBRCxDQUFiLEdBQW9CLENBQXhCLEVBQTJCO0FBQ3pCLFFBQUksYUFBYSxDQUFDLEVBQUQsQ0FBYixHQUFvQixDQUF4QixFQUEyQjtBQUN6QixNQUFBLEtBQUssR0FBRyxFQUFFLENBQUMsT0FBSCxDQUFXLENBQVgsQ0FBUjtBQUNELEtBRkQsTUFFTztBQUNMLE1BQUEsS0FBSyxHQUFHLE1BQU0sQ0FBQyxFQUFELENBQWQ7QUFDRDs7QUFDRCxJQUFBLEtBQUssR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFOLENBQVksR0FBWixFQUFpQixDQUFqQixDQUFkO0FBQ0Q7O0FBRUQsU0FBTyxDQUFDLEtBQUssR0FBRyxHQUFSLEdBQWMsT0FBZCxHQUF3QixHQUF4QixHQUE4QixPQUEvQixFQUF3QyxPQUF4QyxDQUFnRCxTQUFoRCxFQUNILEtBREcsSUFDTSxLQURiO0FBRUQ7QUFFRDs7Ozs7Ozs7QUFNTyxTQUFTLHVCQUFULENBQWlDLE9BQWpDLEVBQWtEO0FBQ3ZEO0FBQ0EsTUFBSSxDQUFDLE9BQUQsSUFBWSxPQUFPLElBQUksQ0FBM0IsRUFBOEI7QUFDNUIsV0FBTyxNQUFQO0FBQ0Q7O0FBRUQsTUFBSSxRQUFRLEdBQUcsR0FBZjtBQUNBLE1BQUksU0FBUyxHQUFHLE9BQWhCO0FBRUEsRUFBQSxZQUFZLENBQUMsT0FBYixDQUFxQixnQkFBNkI7QUFBQTtBQUFBLFFBQTNCLElBQTJCO0FBQUEsUUFBckIsZUFBcUI7O0FBQ2hELFFBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFMLENBQVcsU0FBUyxHQUFHLGVBQXZCLENBQVo7QUFFQSxJQUFBLFNBQVMsR0FBRyxTQUFTLEdBQUcsZUFBeEIsQ0FIZ0QsQ0FJaEQ7QUFDQTs7QUFDQSxRQUFJLElBQUksS0FBSyxHQUFULElBQWdCLFNBQVMsR0FBRyxDQUFoQyxFQUFtQztBQUNqQyxNQUFBLEtBQUssSUFBSSxTQUFUO0FBQ0Q7O0FBRUQsUUFBSSxLQUFKLEVBQVc7QUFDVCxVQUFJLENBQUMsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsR0FBakIsSUFBd0IsQ0FBeEIsSUFDRCxJQUFJLEtBQUssR0FEUixJQUNlLElBQUksS0FBSyxHQUR4QixJQUMrQixJQUFJLEtBQUssR0FEekMsS0FFQSxRQUFRLENBQUMsT0FBVCxDQUFpQixHQUFqQixNQUEwQixDQUFDLENBRi9CLEVBRWtDO0FBQ2hDLFFBQUEsUUFBUSxJQUFJLEdBQVo7QUFDRDs7QUFDRCxNQUFBLFFBQVEsY0FBTyxLQUFQLFNBQWUsSUFBZixDQUFSO0FBQ0Q7QUFDRixHQWxCRDtBQW9CQSxTQUFPLFFBQVA7QUFDRDtBQUVEOzs7Ozs7Ozs7QUFPTyxTQUFTLGdCQUFULENBQTBCLFVBQTFCLEVBQThDLFNBQTlDLEVBQWlFO0FBQ3RFLE1BQUksQ0FBQyxVQUFELElBQWUsT0FBTyxVQUFQLEtBQXNCLFFBQXJDLElBQ0EsQ0FBQyxVQUFVLENBQUMsS0FBWCxDQUFpQixTQUFqQixDQURMLEVBQ2tDO0FBQ2hDLFdBQU8sQ0FBUDtBQUNEOztBQUNELE1BQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFYLENBQWlCLEdBQWpCLENBQWQ7QUFDQSxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUQsQ0FBTixDQUFwQjtBQUNBLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBRCxDQUFOLENBQXRCO0FBQ0EsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFELENBQU4sQ0FBdEI7QUFDQSxTQUFRLEtBQUssR0FBRyxJQUFULEdBQWtCLE9BQU8sR0FBRyxFQUE1QixHQUFrQyxPQUF6QztBQUNEO0FBRUQ7Ozs7Ozs7OztBQU9PLFNBQVMsb0JBQVQsQ0FBOEIsUUFBOUIsRUFBZ0QsYUFBaEQsRUFBdUU7QUFDNUUsTUFBSSxDQUFDLFFBQUQsSUFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFULENBQWUsYUFBZixDQUFsQixFQUFpRDtBQUMvQyxXQUFPLENBQVA7QUFDRDs7QUFIMkUsY0FLakIsSUFBSSxNQUFKLENBQ3ZELGFBRHVELEVBQ3hDLElBRHdDLENBQ25DLFFBRG1DLEtBQ3RCLEVBTnVDO0FBQUE7QUFBQSxNQUtuRSxLQUxtRTtBQUFBLE1BSzVELE1BTDREO0FBQUEsTUFLbEQsSUFMa0Q7QUFBQSxNQUs1QyxLQUw0QztBQUFBLE1BS3JDLE9BTHFDO0FBQUEsTUFLNUIsT0FMNEI7O0FBUTVFLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSixFQUFaO0FBQ0EsTUFBTSxNQUFNLEdBQUcsSUFBSSxJQUFKLENBQVMsR0FBVCxDQUFmO0FBQ0EsRUFBQSxNQUFNLENBQUMsV0FBUCxDQUFtQixNQUFNLENBQUMsV0FBUCxLQUF1QixNQUFNLENBQUMsS0FBSyxJQUFJLENBQVYsQ0FBaEQ7QUFDQSxFQUFBLE1BQU0sQ0FBQyxRQUFQLENBQWdCLE1BQU0sQ0FBQyxRQUFQLEtBQW9CLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBWCxDQUExQztBQUNBLEVBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxNQUFNLENBQUMsT0FBUCxLQUFtQixNQUFNLENBQUMsSUFBSSxJQUFJLENBQVQsQ0FBeEM7QUFDQSxFQUFBLE1BQU0sQ0FBQyxRQUFQLENBQWdCLE1BQU0sQ0FBQyxRQUFQLEtBQW9CLE1BQU0sQ0FBQyxLQUFLLElBQUksQ0FBVixDQUExQztBQUNBLEVBQUEsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsTUFBTSxDQUFDLFVBQVAsS0FBc0IsTUFBTSxDQUFDLE9BQU8sSUFBSSxDQUFaLENBQTlDO0FBQ0EsRUFBQSxNQUFNLENBQUMsVUFBUCxDQUFrQixNQUFNLENBQUMsVUFBUCxLQUFzQixNQUFNLENBQUMsT0FBTyxJQUFJLENBQVosQ0FBOUM7O0FBQ0EsTUFBSSxPQUFPLElBQUksTUFBTSxDQUFDLE9BQUQsQ0FBTixDQUFnQixPQUFoQixDQUF3QixHQUF4QixJQUErQixDQUE5QyxFQUFpRDtBQUMvQyxRQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQUQsQ0FBTixHQUFrQixDQUFuQixDQUFOLENBQTRCLE9BQTVCLENBQW9DLENBQXBDLElBQXlDLE1BQTlEO0FBQ0EsSUFBQSxNQUFNLENBQUMsZUFBUCxDQUF1QixNQUFNLENBQUMsZUFBUCxLQUEyQixZQUFsRDtBQUNEOztBQUNELFNBQU8sQ0FBRSxNQUFNLEdBQUcsR0FBVixHQUFpQixHQUFsQixJQUF5QixNQUFoQztBQUNEO0FBRUQ7Ozs7Ozs7Ozs7QUFRTyxTQUFTLGVBQVQsQ0FDSCxLQURHLEVBRUgsTUFGRyxFQUdILGFBSEcsRUFHb0I7QUFDekIsU0FBTyx1QkFBdUIsQ0FDMUIsb0JBQW9CLENBQUMsS0FBRCxFQUFRLGFBQVIsQ0FBcEIsR0FDQSxvQkFBb0IsQ0FBQyxNQUFELEVBQVMsYUFBVCxDQUZNLENBQTlCO0FBSUQ7QUFFRDs7Ozs7Ozs7OztBQVFPLFNBQVMsb0JBQVQsQ0FDSCxLQURHLEVBRUgsTUFGRyxFQUdILFNBSEcsRUFHZ0I7QUFDckIsU0FBTyxrQkFBa0IsQ0FDckIsZ0JBQWdCLENBQUMsS0FBRCxFQUFRLFNBQVIsQ0FBaEIsR0FDQSxnQkFBZ0IsQ0FDWixNQURZLEVBQ0osU0FESSxDQUZLLENBQXpCO0FBS0Q7QUFFRDs7Ozs7OztBQUtPLFNBQVMsT0FBVCxDQUFpQixJQUFqQixFQUF1QjtBQUM1QixNQUFNLE1BQU0sR0FBRyxFQUFmO0FBRUE7Ozs7OztBQUtBLFdBQVMsT0FBVCxDQUFpQixHQUFqQixFQUFzQixJQUF0QixFQUE0QjtBQUMxQixRQUFJLE1BQU0sQ0FBQyxHQUFELENBQU4sS0FBZ0IsR0FBcEIsRUFBeUI7QUFDdkIsTUFBQSxNQUFNLENBQUMsSUFBRCxDQUFOLEdBQWUsR0FBZjtBQUNELEtBRkQsTUFFTyxJQUFJLEtBQUssQ0FBQyxPQUFOLENBQWMsR0FBZCxDQUFKLEVBQXdCO0FBQzdCLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBUixFQUFXLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBeEIsRUFBZ0MsQ0FBQyxHQUFHLENBQXBDLEVBQXVDLENBQUMsRUFBeEMsRUFBNEM7QUFDMUMsUUFBQSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUQsQ0FBSixFQUFTLElBQUksR0FBRyxHQUFQLEdBQWEsQ0FBYixHQUFpQixHQUExQixDQUFQO0FBQ0EsWUFBSSxDQUFDLEtBQUssQ0FBVixFQUFhLE1BQU0sQ0FBQyxJQUFELENBQU4sR0FBZSxFQUFmO0FBQ2Q7QUFDRixLQUxNLE1BS0E7QUFDTCxVQUFJLE9BQU8sR0FBRyxJQUFkOztBQUNBLFdBQUssSUFBTSxDQUFYLElBQWdCLEdBQWhCLEVBQXFCO0FBQ25CLFlBQUksR0FBRyxjQUFILENBQWtCLElBQWxCLENBQXVCLEdBQXZCLEVBQTRCLENBQTVCLENBQUosRUFBb0M7QUFDbEMsVUFBQSxPQUFPLEdBQUcsS0FBVjtBQUNBLFVBQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFELENBQUosRUFBUyxJQUFJLEdBQUcsSUFBSSxHQUFHLEdBQVAsR0FBYSxDQUFoQixHQUFvQixDQUFqQyxDQUFQO0FBQ0Q7QUFDRjs7QUFDRCxVQUFJLE9BQU8sSUFBSSxJQUFmLEVBQXFCLE1BQU0sQ0FBQyxJQUFELENBQU4sR0FBZSxFQUFmO0FBQ3RCO0FBQ0Y7O0FBRUQsRUFBQSxPQUFPLENBQUMsSUFBRCxFQUFPLEVBQVAsQ0FBUDtBQUNBLFNBQU8sTUFBUDtBQUNEO0FBRUQ7Ozs7Ozs7QUFLTyxTQUFTLFNBQVQsQ0FBbUIsSUFBbkIsRUFBeUI7QUFDOUI7O0FBQ0EsTUFBSSxNQUFNLENBQUMsSUFBRCxDQUFOLEtBQWlCLElBQWpCLElBQXlCLEtBQUssQ0FBQyxPQUFOLENBQWMsSUFBZCxDQUE3QixFQUFrRCxPQUFPLElBQVA7QUFDbEQsTUFBTSxLQUFLLEdBQUcseUJBQWQ7QUFDQSxNQUFNLE1BQU0sR0FBRyxFQUFmOztBQUNBLE9BQUssSUFBTSxDQUFYLElBQWdCLElBQWhCLEVBQXNCO0FBQ3BCLFFBQUksR0FBRyxjQUFILENBQWtCLElBQWxCLENBQXVCLElBQXZCLEVBQTZCLENBQTdCLENBQUosRUFBcUM7QUFDbkMsVUFBSSxHQUFHLEdBQUcsTUFBVjtBQUNBLFVBQUksSUFBSSxHQUFHLEVBQVg7QUFDQSxVQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBTixDQUFXLENBQVgsQ0FBUjs7QUFDQSxhQUFPLENBQVAsRUFBVTtBQUNSLFFBQUEsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFELENBQUgsS0FBYyxHQUFHLENBQUMsSUFBRCxDQUFILEdBQWEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPLEVBQVAsR0FBWSxFQUF2QyxDQUFOO0FBQ0EsUUFBQSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUQsQ0FBRCxJQUFRLENBQUMsQ0FBQyxDQUFELENBQWhCO0FBQ0EsUUFBQSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQU4sQ0FBVyxDQUFYLENBQUo7QUFDRDs7QUFDRCxNQUFBLEdBQUcsQ0FBQyxJQUFELENBQUgsR0FBWSxJQUFJLENBQUMsQ0FBRCxDQUFoQjtBQUNEO0FBQ0Y7O0FBQ0QsU0FBTyxNQUFNLENBQUMsRUFBRCxDQUFOLElBQWMsTUFBckI7QUFDRDtBQUVEOzs7Ozs7O0FBS08sU0FBUyxhQUFULENBQXVCLEdBQXZCLEVBQW9DO0FBQ3pDLE1BQUksSUFBSSxDQUFDLEtBQUwsQ0FBVyxHQUFYLE1BQW9CLEdBQXhCLEVBQTZCLE9BQU8sQ0FBUDtBQUM3QixTQUFPLEdBQUcsQ0FBQyxRQUFKLEdBQWUsS0FBZixDQUFxQixHQUFyQixFQUEwQixDQUExQixFQUE2QixNQUE3QixJQUF1QyxDQUE5QztBQUNEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gQGZsb3dcbmltcG9ydCBTY29ybTEyQVBJIGZyb20gJy4vU2Nvcm0xMkFQSSc7XG5pbXBvcnQge1xuICBDTUksXG4gIENNSUV2YWx1YXRpb25Db21tZW50c09iamVjdCxcbiAgQ01JVHJpZXNPYmplY3QsXG59IGZyb20gJy4vY21pL2FpY2NfY21pJztcbmltcG9ydCB7TkFWfSBmcm9tICcuL2NtaS9zY29ybTEyX2NtaSc7XG5cbi8qKlxuICogVGhlIEFJQ0MgQVBJIGNsYXNzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFJQ0MgZXh0ZW5kcyBTY29ybTEyQVBJIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIHRvIGNyZWF0ZSBBSUNDIEFQSSBvYmplY3RcbiAgICogQHBhcmFtIHtvYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzZXR0aW5nczoge30pIHtcbiAgICBjb25zdCBmaW5hbFNldHRpbmdzID0ge1xuICAgICAgLi4ue1xuICAgICAgICBtYXN0ZXJ5X292ZXJyaWRlOiBmYWxzZSxcbiAgICAgIH0sIC4uLnNldHRpbmdzLFxuICAgIH07XG5cbiAgICBzdXBlcihmaW5hbFNldHRpbmdzKTtcblxuICAgIHRoaXMuY21pID0gbmV3IENNSSgpO1xuICAgIHRoaXMubmF2ID0gbmV3IE5BVigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgb3IgYnVpbGRzIGEgbmV3IGNoaWxkIGVsZW1lbnQgdG8gYWRkIHRvIHRoZSBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHthbnl9IHZhbHVlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm91bmRGaXJzdEluZGV4XG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIGdldENoaWxkRWxlbWVudChDTUlFbGVtZW50LCB2YWx1ZSwgZm91bmRGaXJzdEluZGV4KSB7XG4gICAgbGV0IG5ld0NoaWxkID0gc3VwZXIuZ2V0Q2hpbGRFbGVtZW50KENNSUVsZW1lbnQsIHZhbHVlLCBmb3VuZEZpcnN0SW5kZXgpO1xuXG4gICAgaWYgKCFuZXdDaGlsZCkge1xuICAgICAgaWYgKHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LCAnY21pXFxcXC5ldmFsdWF0aW9uXFxcXC5jb21tZW50c1xcXFwuXFxcXGQnKSkge1xuICAgICAgICBuZXdDaGlsZCA9IG5ldyBDTUlFdmFsdWF0aW9uQ29tbWVudHNPYmplY3QoKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsICdjbWlcXFxcLnN0dWRlbnRfZGF0YVxcXFwudHJpZXNcXFxcLlxcXFxkJykpIHtcbiAgICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JVHJpZXNPYmplY3QoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbmV3Q2hpbGQ7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSB0aGUgd2hvbGUgQVBJIHdpdGggYW5vdGhlclxuICAgKlxuICAgKiBAcGFyYW0ge0FJQ0N9IG5ld0FQSVxuICAgKi9cbiAgcmVwbGFjZVdpdGhBbm90aGVyU2Nvcm1BUEkobmV3QVBJKSB7XG4gICAgLy8gRGF0YSBNb2RlbFxuICAgIHRoaXMuY21pID0gbmV3QVBJLmNtaTtcbiAgICB0aGlzLm5hdiA9IG5ld0FQSS5uYXY7XG4gIH1cbn1cbiIsIi8vIEBmbG93XG5pbXBvcnQge0NNSUFycmF5fSBmcm9tICcuL2NtaS9jb21tb24nO1xuaW1wb3J0IHtWYWxpZGF0aW9uRXJyb3J9IGZyb20gJy4vZXhjZXB0aW9ucyc7XG5pbXBvcnQgRXJyb3JDb2RlcyBmcm9tICcuL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuaW1wb3J0IHt1bmZsYXR0ZW59IGZyb20gJy4vdXRpbGl0aWVzJztcblxuY29uc3QgZ2xvYmFsX2NvbnN0YW50cyA9IEFQSUNvbnN0YW50cy5nbG9iYWw7XG5jb25zdCBzY29ybTEyX2Vycm9yX2NvZGVzID0gRXJyb3JDb2Rlcy5zY29ybTEyO1xuXG4vKipcbiAqIEJhc2UgQVBJIGNsYXNzIGZvciBBSUNDLCBTQ09STSAxLjIsIGFuZCBTQ09STSAyMDA0LiBTaG91bGQgYmUgY29uc2lkZXJlZFxuICogYWJzdHJhY3QsIGFuZCBuZXZlciBpbml0aWFsaXplZCBvbiBpdCdzIG93bi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUFQSSB7XG4gICN0aW1lb3V0O1xuICAjZXJyb3JfY29kZXM7XG4gICNzZXR0aW5ncyA9IHtcbiAgICBhdXRvY29tbWl0OiBmYWxzZSxcbiAgICBhdXRvY29tbWl0U2Vjb25kczogNjAsXG4gICAgbG1zQ29tbWl0VXJsOiBmYWxzZSxcbiAgICBkYXRhQ29tbWl0Rm9ybWF0OiAnanNvbicsIC8vIHZhbGlkIGZvcm1hdHMgYXJlICdqc29uJyBvciAnZmxhdHRlbmVkJywgJ3BhcmFtcydcbiAgICBjb21taXRSZXF1ZXN0RGF0YVR5cGU6ICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLTgnLFxuICAgIGF1dG9Qcm9ncmVzczogZmFsc2UsXG4gICAgbG9nTGV2ZWw6IGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0VSUk9SLFxuICB9O1xuICBjbWk7XG4gIHN0YXJ0aW5nRGF0YToge307XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBCYXNlIEFQSSBjbGFzcy4gU2V0cyBzb21lIHNoYXJlZCBBUEkgZmllbGRzLCBhcyB3ZWxsIGFzXG4gICAqIHNldHMgdXAgb3B0aW9ucyBmb3IgdGhlIEFQSS5cbiAgICogQHBhcmFtIHtvYmplY3R9IGVycm9yX2NvZGVzXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgY29uc3RydWN0b3IoZXJyb3JfY29kZXMsIHNldHRpbmdzKSB7XG4gICAgaWYgKG5ldy50YXJnZXQgPT09IEJhc2VBUEkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb25zdHJ1Y3QgQmFzZUFQSSBpbnN0YW5jZXMgZGlyZWN0bHknKTtcbiAgICB9XG4gICAgdGhpcy5jdXJyZW50U3RhdGUgPSBnbG9iYWxfY29uc3RhbnRzLlNUQVRFX05PVF9JTklUSUFMSVpFRDtcbiAgICB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuICAgIHRoaXMubGlzdGVuZXJBcnJheSA9IFtdO1xuXG4gICAgdGhpcy4jdGltZW91dCA9IG51bGw7XG4gICAgdGhpcy4jZXJyb3JfY29kZXMgPSBlcnJvcl9jb2RlcztcblxuICAgIHRoaXMuc2V0dGluZ3MgPSBzZXR0aW5ncztcbiAgICB0aGlzLmFwaUxvZ0xldmVsID0gdGhpcy5zZXR0aW5ncy5sb2dMZXZlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBBUElcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gaW5pdGlhbGl6ZU1lc3NhZ2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRlcm1pbmF0aW9uTWVzc2FnZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBpbml0aWFsaXplKFxuICAgICAgY2FsbGJhY2tOYW1lOiBTdHJpbmcsXG4gICAgICBpbml0aWFsaXplTWVzc2FnZT86IFN0cmluZyxcbiAgICAgIHRlcm1pbmF0aW9uTWVzc2FnZT86IFN0cmluZykge1xuICAgIGxldCByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG5cbiAgICBpZiAodGhpcy5pc0luaXRpYWxpemVkKCkpIHtcbiAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHRoaXMuI2Vycm9yX2NvZGVzLklOSVRJQUxJWkVELCBpbml0aWFsaXplTWVzc2FnZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzVGVybWluYXRlZCgpKSB7XG4gICAgICB0aGlzLnRocm93U0NPUk1FcnJvcih0aGlzLiNlcnJvcl9jb2Rlcy5URVJNSU5BVEVELCB0ZXJtaW5hdGlvbk1lc3NhZ2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IGdsb2JhbF9jb25zdGFudHMuU1RBVEVfSU5JVElBTElaRUQ7XG4gICAgICB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuICAgICAgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUU7XG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcbiAgICB0aGlzLmNsZWFyU0NPUk1FcnJvcihyZXR1cm5WYWx1ZSk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc2V0dGluZ3NcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cbiAgZ2V0IHNldHRpbmdzKCkge1xuICAgIHJldHVybiB0aGlzLiNzZXR0aW5ncztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzZXR0aW5nc1xuICAgKiBAcGFyYW0ge29iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIHNldCBzZXR0aW5ncyhzZXR0aW5nczogT2JqZWN0KSB7XG4gICAgdGhpcy4jc2V0dGluZ3MgPSB7Li4udGhpcy4jc2V0dGluZ3MsIC4uLnNldHRpbmdzfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUZXJtaW5hdGVzIHRoZSBjdXJyZW50IHJ1biBvZiB0aGUgQVBJXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHBhcmFtIHtib29sZWFufSBjaGVja1Rlcm1pbmF0ZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgdGVybWluYXRlKFxuICAgICAgY2FsbGJhY2tOYW1lOiBTdHJpbmcsXG4gICAgICBjaGVja1Rlcm1pbmF0ZWQ6IGJvb2xlYW4pIHtcbiAgICBsZXQgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuXG4gICAgaWYgKHRoaXMuY2hlY2tTdGF0ZShjaGVja1Rlcm1pbmF0ZWQsXG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLlRFUk1JTkFUSU9OX0JFRk9SRV9JTklULFxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5NVUxUSVBMRV9URVJNSU5BVElPTikpIHtcbiAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gZ2xvYmFsX2NvbnN0YW50cy5TVEFURV9URVJNSU5BVEVEO1xuXG4gICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnN0b3JlRGF0YSh0cnVlKTtcbiAgICAgIGlmIChyZXN1bHQuZXJyb3JDb2RlICYmIHJlc3VsdC5lcnJvckNvZGUgPiAwKSB7XG4gICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHJlc3VsdC5lcnJvckNvZGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuVmFsdWUgPSByZXN1bHQucmVzdWx0ID9cbiAgICAgICAgICByZXN1bHQucmVzdWx0IDogZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcblxuICAgICAgaWYgKGNoZWNrVGVybWluYXRlZCkgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcblxuICAgICAgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUU7XG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcbiAgICB0aGlzLmNsZWFyU0NPUk1FcnJvcihyZXR1cm5WYWx1ZSk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSB2YWx1ZSBvZiB0aGUgQ01JRWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrVGVybWluYXRlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXRWYWx1ZShcbiAgICAgIGNhbGxiYWNrTmFtZTogU3RyaW5nLFxuICAgICAgY2hlY2tUZXJtaW5hdGVkOiBib29sZWFuLFxuICAgICAgQ01JRWxlbWVudDogU3RyaW5nKSB7XG4gICAgbGV0IHJldHVyblZhbHVlO1xuXG4gICAgaWYgKHRoaXMuY2hlY2tTdGF0ZShjaGVja1Rlcm1pbmF0ZWQsXG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLlJFVFJJRVZFX0JFRk9SRV9JTklULFxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5SRVRSSUVWRV9BRlRFUl9URVJNKSkge1xuICAgICAgaWYgKGNoZWNrVGVybWluYXRlZCkgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcbiAgICAgIHJldHVyblZhbHVlID0gdGhpcy5nZXRDTUlWYWx1ZShDTUlFbGVtZW50KTtcbiAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUsIENNSUVsZW1lbnQpO1xuICAgIH1cblxuICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgQ01JRWxlbWVudCwgJzogcmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG4gICAgdGhpcy5jbGVhclNDT1JNRXJyb3IocmV0dXJuVmFsdWUpO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBDTUlFbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tUZXJtaW5hdGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgc2V0VmFsdWUoXG4gICAgICBjYWxsYmFja05hbWU6IFN0cmluZyxcbiAgICAgIGNoZWNrVGVybWluYXRlZDogYm9vbGVhbixcbiAgICAgIENNSUVsZW1lbnQsXG4gICAgICB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSk7XG4gICAgfVxuICAgIGxldCByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG5cbiAgICBpZiAodGhpcy5jaGVja1N0YXRlKGNoZWNrVGVybWluYXRlZCwgdGhpcy4jZXJyb3JfY29kZXMuU1RPUkVfQkVGT1JFX0lOSVQsXG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLlNUT1JFX0FGVEVSX1RFUk0pKSB7XG4gICAgICBpZiAoY2hlY2tUZXJtaW5hdGVkKSB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuVmFsdWUgPSB0aGlzLnNldENNSVZhbHVlKENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBWYWxpZGF0aW9uRXJyb3IpIHtcbiAgICAgICAgICB0aGlzLmxhc3RFcnJvckNvZGUgPSBlLmVycm9yQ29kZTtcbiAgICAgICAgICByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGUubWVzc2FnZSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlLm1lc3NhZ2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcih0aGlzLiNlcnJvcl9jb2Rlcy5HRU5FUkFMKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSwgQ01JRWxlbWVudCwgdmFsdWUpO1xuICAgIH1cblxuICAgIGlmIChyZXR1cm5WYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG4gICAgfVxuXG4gICAgLy8gSWYgd2UgZGlkbid0IGhhdmUgYW55IGVycm9ycyB3aGlsZSBzZXR0aW5nIHRoZSBkYXRhLCBnbyBhaGVhZCBhbmRcbiAgICAvLyBzY2hlZHVsZSBhIGNvbW1pdCwgaWYgYXV0b2NvbW1pdCBpcyB0dXJuZWQgb25cbiAgICBpZiAoU3RyaW5nKHRoaXMubGFzdEVycm9yQ29kZSkgPT09ICcwJykge1xuICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuYXV0b2NvbW1pdCAmJiAhdGhpcy4jdGltZW91dCkge1xuICAgICAgICB0aGlzLnNjaGVkdWxlQ29tbWl0KHRoaXMuc2V0dGluZ3MuYXV0b2NvbW1pdFNlY29uZHMgKiAxMDAwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIENNSUVsZW1lbnQsXG4gICAgICAgICc6ICcgKyB2YWx1ZSArICc6IHJlc3VsdDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcbiAgICB0aGlzLmNsZWFyU0NPUk1FcnJvcihyZXR1cm5WYWx1ZSk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogT3JkZXJzIExNUyB0byBzdG9yZSBhbGwgY29udGVudCBwYXJhbWV0ZXJzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHBhcmFtIHtib29sZWFufSBjaGVja1Rlcm1pbmF0ZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgY29tbWl0KFxuICAgICAgY2FsbGJhY2tOYW1lOiBTdHJpbmcsXG4gICAgICBjaGVja1Rlcm1pbmF0ZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmNsZWFyU2NoZWR1bGVkQ29tbWl0KCk7XG5cbiAgICBsZXQgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuXG4gICAgaWYgKHRoaXMuY2hlY2tTdGF0ZShjaGVja1Rlcm1pbmF0ZWQsIHRoaXMuI2Vycm9yX2NvZGVzLkNPTU1JVF9CRUZPUkVfSU5JVCxcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuQ09NTUlUX0FGVEVSX1RFUk0pKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnN0b3JlRGF0YShmYWxzZSk7XG4gICAgICBpZiAocmVzdWx0LmVycm9yQ29kZSAmJiByZXN1bHQuZXJyb3JDb2RlID4gMCkge1xuICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihyZXN1bHQuZXJyb3JDb2RlKTtcbiAgICAgIH1cbiAgICAgIHJldHVyblZhbHVlID0gcmVzdWx0LnJlc3VsdCA/XG4gICAgICAgICAgcmVzdWx0LnJlc3VsdCA6IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG5cbiAgICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgJ0h0dHBSZXF1ZXN0JywgJyBSZXN1bHQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9ERUJVRyk7XG5cbiAgICAgIGlmIChjaGVja1Rlcm1pbmF0ZWQpIHRoaXMubGFzdEVycm9yQ29kZSA9IDA7XG5cbiAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUpO1xuICAgIH1cblxuICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgbnVsbCwgJ3JldHVybmVkOiAnICsgcmV0dXJuVmFsdWUsXG4gICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pO1xuICAgIHRoaXMuY2xlYXJTQ09STUVycm9yKHJldHVyblZhbHVlKTtcblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGxhc3QgZXJyb3IgY29kZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldExhc3RFcnJvcihjYWxsYmFja05hbWU6IFN0cmluZykge1xuICAgIGNvbnN0IHJldHVyblZhbHVlID0gU3RyaW5nKHRoaXMubGFzdEVycm9yQ29kZSk7XG5cbiAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKTtcblxuICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgbnVsbCwgJ3JldHVybmVkOiAnICsgcmV0dXJuVmFsdWUsXG4gICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGVycm9yTnVtYmVyIGVycm9yIGRlc2NyaXB0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcil9IENNSUVycm9yQ29kZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXRFcnJvclN0cmluZyhjYWxsYmFja05hbWU6IFN0cmluZywgQ01JRXJyb3JDb2RlKSB7XG4gICAgbGV0IHJldHVyblZhbHVlID0gJyc7XG5cbiAgICBpZiAoQ01JRXJyb3JDb2RlICE9PSBudWxsICYmIENNSUVycm9yQ29kZSAhPT0gJycpIHtcbiAgICAgIHJldHVyblZhbHVlID0gdGhpcy5nZXRMbXNFcnJvck1lc3NhZ2VEZXRhaWxzKENNSUVycm9yQ29kZSk7XG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgY29tcHJlaGVuc2l2ZSBkZXNjcmlwdGlvbiBvZiB0aGUgZXJyb3JOdW1iZXIgZXJyb3IuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcil9IENNSUVycm9yQ29kZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXREaWFnbm9zdGljKGNhbGxiYWNrTmFtZTogU3RyaW5nLCBDTUlFcnJvckNvZGUpIHtcbiAgICBsZXQgcmV0dXJuVmFsdWUgPSAnJztcblxuICAgIGlmIChDTUlFcnJvckNvZGUgIT09IG51bGwgJiYgQ01JRXJyb3JDb2RlICE9PSAnJykge1xuICAgICAgcmV0dXJuVmFsdWUgPSB0aGlzLmdldExtc0Vycm9yTWVzc2FnZURldGFpbHMoQ01JRXJyb3JDb2RlLCB0cnVlKTtcbiAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUpO1xuICAgIH1cblxuICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgbnVsbCwgJ3JldHVybmVkOiAnICsgcmV0dXJuVmFsdWUsXG4gICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk8pO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB0aGUgTE1TIHN0YXRlIGFuZCBlbnN1cmVzIGl0IGhhcyBiZWVuIGluaXRpYWxpemVkLlxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrVGVybWluYXRlZFxuICAgKiBAcGFyYW0ge251bWJlcn0gYmVmb3JlSW5pdEVycm9yXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhZnRlclRlcm1FcnJvclxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgY2hlY2tTdGF0ZShcbiAgICAgIGNoZWNrVGVybWluYXRlZDogYm9vbGVhbixcbiAgICAgIGJlZm9yZUluaXRFcnJvcjogbnVtYmVyLFxuICAgICAgYWZ0ZXJUZXJtRXJyb3I/OiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5pc05vdEluaXRpYWxpemVkKCkpIHtcbiAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGJlZm9yZUluaXRFcnJvcik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIGlmIChjaGVja1Rlcm1pbmF0ZWQgJiYgdGhpcy5pc1Rlcm1pbmF0ZWQoKSkge1xuICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoYWZ0ZXJUZXJtRXJyb3IpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIExvZ2dpbmcgZm9yIGFsbCBTQ09STSBhY3Rpb25zXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmdW5jdGlvbk5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxvZ01lc3NhZ2VcbiAgICogQHBhcmFtIHtudW1iZXJ9bWVzc2FnZUxldmVsXG4gICAqL1xuICBhcGlMb2coXG4gICAgICBmdW5jdGlvbk5hbWU6IFN0cmluZyxcbiAgICAgIENNSUVsZW1lbnQ6IFN0cmluZyxcbiAgICAgIGxvZ01lc3NhZ2U6IFN0cmluZyxcbiAgICAgIG1lc3NhZ2VMZXZlbDogbnVtYmVyKSB7XG4gICAgbG9nTWVzc2FnZSA9IHRoaXMuZm9ybWF0TWVzc2FnZShmdW5jdGlvbk5hbWUsIENNSUVsZW1lbnQsIGxvZ01lc3NhZ2UpO1xuXG4gICAgaWYgKG1lc3NhZ2VMZXZlbCA+PSB0aGlzLmFwaUxvZ0xldmVsKSB7XG4gICAgICBzd2l0Y2ggKG1lc3NhZ2VMZXZlbCkge1xuICAgICAgICBjYXNlIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0VSUk9SOlxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IobG9nTWVzc2FnZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfV0FSTklORzpcbiAgICAgICAgICBjb25zb2xlLndhcm4obG9nTWVzc2FnZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTzpcbiAgICAgICAgICBjb25zb2xlLmluZm8obG9nTWVzc2FnZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfREVCVUc6XG4gICAgICAgICAgaWYgKGNvbnNvbGUuZGVidWcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcobG9nTWVzc2FnZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGxvZ01lc3NhZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRm9ybWF0cyB0aGUgU0NPUk0gbWVzc2FnZXMgZm9yIGVhc3kgcmVhZGluZ1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZnVuY3Rpb25OYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGZvcm1hdE1lc3NhZ2UoZnVuY3Rpb25OYW1lOiBTdHJpbmcsIENNSUVsZW1lbnQ6IFN0cmluZywgbWVzc2FnZTogU3RyaW5nKSB7XG4gICAgY29uc3QgYmFzZUxlbmd0aCA9IDIwO1xuICAgIGxldCBtZXNzYWdlU3RyaW5nID0gJyc7XG5cbiAgICBtZXNzYWdlU3RyaW5nICs9IGZ1bmN0aW9uTmFtZTtcblxuICAgIGxldCBmaWxsQ2hhcnMgPSBiYXNlTGVuZ3RoIC0gbWVzc2FnZVN0cmluZy5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbGxDaGFyczsgaSsrKSB7XG4gICAgICBtZXNzYWdlU3RyaW5nICs9ICcgJztcbiAgICB9XG5cbiAgICBtZXNzYWdlU3RyaW5nICs9ICc6ICc7XG5cbiAgICBpZiAoQ01JRWxlbWVudCkge1xuICAgICAgY29uc3QgQ01JRWxlbWVudEJhc2VMZW5ndGggPSA3MDtcblxuICAgICAgbWVzc2FnZVN0cmluZyArPSBDTUlFbGVtZW50O1xuXG4gICAgICBmaWxsQ2hhcnMgPSBDTUlFbGVtZW50QmFzZUxlbmd0aCAtIG1lc3NhZ2VTdHJpbmcubGVuZ3RoO1xuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGZpbGxDaGFyczsgaisrKSB7XG4gICAgICAgIG1lc3NhZ2VTdHJpbmcgKz0gJyAnO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtZXNzYWdlKSB7XG4gICAgICBtZXNzYWdlU3RyaW5nICs9IG1lc3NhZ2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lc3NhZ2VTdHJpbmc7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIHRvIHNlZSBpZiB7c3RyfSBjb250YWlucyB7dGVzdGVyfVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyIFN0cmluZyB0byBjaGVjayBhZ2FpbnN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXN0ZXIgU3RyaW5nIHRvIGNoZWNrIGZvclxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgc3RyaW5nTWF0Y2hlcyhzdHI6IFN0cmluZywgdGVzdGVyOiBTdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyICYmIHRlc3RlciAmJiBzdHIubWF0Y2godGVzdGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB0byBzZWUgaWYgdGhlIHNwZWNpZmljIG9iamVjdCBoYXMgdGhlIGdpdmVuIHByb3BlcnR5XG4gICAqIEBwYXJhbSB7Kn0gcmVmT2JqZWN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdHRyaWJ1dGVcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jaGVja09iamVjdEhhc1Byb3BlcnR5KHJlZk9iamVjdCwgYXR0cmlidXRlOiBTdHJpbmcpIHtcbiAgICByZXR1cm4gT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwocmVmT2JqZWN0LCBhdHRyaWJ1dGUpIHx8XG4gICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoXG4gICAgICAgICAgICBPYmplY3QuZ2V0UHJvdG90eXBlT2YocmVmT2JqZWN0KSwgYXR0cmlidXRlKSB8fFxuICAgICAgICAoYXR0cmlidXRlIGluIHJlZk9iamVjdCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWVzc2FnZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGVycm9yTnVtYmVyXG4gICAqIEFQSXMgdGhhdCBpbmhlcml0IEJhc2VBUEkgc2hvdWxkIG92ZXJyaWRlIHRoaXMgZnVuY3Rpb25cbiAgICpcbiAgICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcil9IF9lcnJvck51bWJlclxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IF9kZXRhaWxcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGdldExtc0Vycm9yTWVzc2FnZURldGFpbHMoX2Vycm9yTnVtYmVyLCBfZGV0YWlsKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlIGdldExtc0Vycm9yTWVzc2FnZURldGFpbHMgbWV0aG9kIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHZhbHVlIGZvciB0aGUgc3BlY2lmaWMgZWxlbWVudC5cbiAgICogQVBJcyB0aGF0IGluaGVyaXQgQmFzZUFQSSBzaG91bGQgb3ZlcnJpZGUgdGhpcyBmdW5jdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX0NNSUVsZW1lbnRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIGdldENNSVZhbHVlKF9DTUlFbGVtZW50KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgZ2V0Q01JVmFsdWUgbWV0aG9kIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZhbHVlIGZvciB0aGUgc3BlY2lmaWMgZWxlbWVudC5cbiAgICogQVBJcyB0aGF0IGluaGVyaXQgQmFzZUFQSSBzaG91bGQgb3ZlcnJpZGUgdGhpcyBmdW5jdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX0NNSUVsZW1lbnRcbiAgICogQHBhcmFtIHthbnl9IF92YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgc2V0Q01JVmFsdWUoX0NNSUVsZW1lbnQsIF92YWx1ZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIHNldENNSVZhbHVlIG1ldGhvZCBoYXMgbm90IGJlZW4gaW1wbGVtZW50ZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaGFyZWQgQVBJIG1ldGhvZCB0byBzZXQgYSB2YWxpZCBmb3IgYSBnaXZlbiBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kTmFtZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHNjb3JtMjAwNFxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIF9jb21tb25TZXRDTUlWYWx1ZShcbiAgICAgIG1ldGhvZE5hbWU6IFN0cmluZywgc2Nvcm0yMDA0OiBib29sZWFuLCBDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgIGlmICghQ01JRWxlbWVudCB8fCBDTUlFbGVtZW50ID09PSAnJykge1xuICAgICAgcmV0dXJuIGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RydWN0dXJlID0gQ01JRWxlbWVudC5zcGxpdCgnLicpO1xuICAgIGxldCByZWZPYmplY3QgPSB0aGlzO1xuICAgIGxldCByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG4gICAgbGV0IGZvdW5kRmlyc3RJbmRleCA9IGZhbHNlO1xuXG4gICAgY29uc3QgaW52YWxpZEVycm9yTWVzc2FnZSA9IGBUaGUgZGF0YSBtb2RlbCBlbGVtZW50IHBhc3NlZCB0byAke21ldGhvZE5hbWV9ICgke0NNSUVsZW1lbnR9KSBpcyBub3QgYSB2YWxpZCBTQ09STSBkYXRhIG1vZGVsIGVsZW1lbnQuYDtcbiAgICBjb25zdCBpbnZhbGlkRXJyb3JDb2RlID0gc2Nvcm0yMDA0ID9cbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuVU5ERUZJTkVEX0RBVEFfTU9ERUwgOlxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5HRU5FUkFMO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHJ1Y3R1cmUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGF0dHJpYnV0ZSA9IHN0cnVjdHVyZVtpXTtcblxuICAgICAgaWYgKGkgPT09IHN0cnVjdHVyZS5sZW5ndGggLSAxKSB7XG4gICAgICAgIGlmIChzY29ybTIwMDQgJiYgKGF0dHJpYnV0ZS5zdWJzdHIoMCwgOCkgPT09ICd7dGFyZ2V0PScpICYmXG4gICAgICAgICAgICAodHlwZW9mIHJlZk9iamVjdC5faXNUYXJnZXRWYWxpZCA9PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHRoaXMuI2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5UKTtcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5fY2hlY2tPYmplY3RIYXNQcm9wZXJ0eShyZWZPYmplY3QsIGF0dHJpYnV0ZSkpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihpbnZhbGlkRXJyb3JDb2RlLCBpbnZhbGlkRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsICdcXFxcLmNvcnJlY3RfcmVzcG9uc2VzXFxcXC5cXFxcZCcpKSB7XG4gICAgICAgICAgICB0aGlzLnZhbGlkYXRlQ29ycmVjdFJlc3BvbnNlKENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXNjb3JtMjAwNCB8fCB0aGlzLmxhc3RFcnJvckNvZGUgPT09IDApIHtcbiAgICAgICAgICAgIHJlZk9iamVjdFthdHRyaWJ1dGVdID0gdmFsdWU7XG4gICAgICAgICAgICByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlZk9iamVjdCA9IHJlZk9iamVjdFthdHRyaWJ1dGVdO1xuICAgICAgICBpZiAoIXJlZk9iamVjdCkge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlZk9iamVjdCBpbnN0YW5jZW9mIENNSUFycmF5KSB7XG4gICAgICAgICAgY29uc3QgaW5kZXggPSBwYXJzZUludChzdHJ1Y3R1cmVbaSArIDFdLCAxMCk7XG5cbiAgICAgICAgICAvLyBTQ08gaXMgdHJ5aW5nIHRvIHNldCBhbiBpdGVtIG9uIGFuIGFycmF5XG4gICAgICAgICAgaWYgKCFpc05hTihpbmRleCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSByZWZPYmplY3QuY2hpbGRBcnJheVtpbmRleF07XG5cbiAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgIHJlZk9iamVjdCA9IGl0ZW07XG4gICAgICAgICAgICAgIGZvdW5kRmlyc3RJbmRleCA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zdCBuZXdDaGlsZCA9IHRoaXMuZ2V0Q2hpbGRFbGVtZW50KENNSUVsZW1lbnQsIHZhbHVlLFxuICAgICAgICAgICAgICAgICAgZm91bmRGaXJzdEluZGV4KTtcbiAgICAgICAgICAgICAgZm91bmRGaXJzdEluZGV4ID0gdHJ1ZTtcblxuICAgICAgICAgICAgICBpZiAoIW5ld0NoaWxkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoaW52YWxpZEVycm9yQ29kZSwgaW52YWxpZEVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlZk9iamVjdC5pbml0aWFsaXplZCkgbmV3Q2hpbGQuaW5pdGlhbGl6ZSgpO1xuXG4gICAgICAgICAgICAgICAgcmVmT2JqZWN0LmNoaWxkQXJyYXkucHVzaChuZXdDaGlsZCk7XG4gICAgICAgICAgICAgICAgcmVmT2JqZWN0ID0gbmV3Q2hpbGQ7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSGF2ZSB0byB1cGRhdGUgaSB2YWx1ZSB0byBza2lwIHRoZSBhcnJheSBwb3NpdGlvblxuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChyZXR1cm5WYWx1ZSA9PT0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRSkge1xuICAgICAgdGhpcy5hcGlMb2cobWV0aG9kTmFtZSwgbnVsbCxcbiAgICAgICAgICBgVGhlcmUgd2FzIGFuIGVycm9yIHNldHRpbmcgdGhlIHZhbHVlIGZvcjogJHtDTUlFbGVtZW50fSwgdmFsdWUgb2Y6ICR7dmFsdWV9YCxcbiAgICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9XQVJOSU5HKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQWJzdHJhY3QgbWV0aG9kIGZvciB2YWxpZGF0aW5nIHRoYXQgYSByZXNwb25zZSBpcyBjb3JyZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX0NNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSBfdmFsdWVcbiAgICovXG4gIHZhbGlkYXRlQ29ycmVjdFJlc3BvbnNlKF9DTUlFbGVtZW50LCBfdmFsdWUpIHtcbiAgICAvLyBqdXN0IGEgc3R1YiBtZXRob2RcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIG9yIGJ1aWxkcyBhIG5ldyBjaGlsZCBlbGVtZW50IHRvIGFkZCB0byB0aGUgYXJyYXkuXG4gICAqIEFQSXMgdGhhdCBpbmhlcml0IEJhc2VBUEkgc2hvdWxkIG92ZXJyaWRlIHRoaXMgbWV0aG9kLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX0NNSUVsZW1lbnQgLSB1bnVzZWRcbiAgICogQHBhcmFtIHsqfSBfdmFsdWUgLSB1bnVzZWRcbiAgICogQHBhcmFtIHtib29sZWFufSBfZm91bmRGaXJzdEluZGV4IC0gdW51c2VkXG4gICAqIEByZXR1cm4geyp9XG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0Q2hpbGRFbGVtZW50KF9DTUlFbGVtZW50LCBfdmFsdWUsIF9mb3VuZEZpcnN0SW5kZXgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBnZXRDaGlsZEVsZW1lbnQgbWV0aG9kIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSB2YWx1ZSBmcm9tIHRoZSBDTUkgT2JqZWN0XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc2Nvcm0yMDA0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBfY29tbW9uR2V0Q01JVmFsdWUobWV0aG9kTmFtZTogU3RyaW5nLCBzY29ybTIwMDQ6IGJvb2xlYW4sIENNSUVsZW1lbnQpIHtcbiAgICBpZiAoIUNNSUVsZW1lbnQgfHwgQ01JRWxlbWVudCA9PT0gJycpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBjb25zdCBzdHJ1Y3R1cmUgPSBDTUlFbGVtZW50LnNwbGl0KCcuJyk7XG4gICAgbGV0IHJlZk9iamVjdCA9IHRoaXM7XG4gICAgbGV0IGF0dHJpYnV0ZSA9IG51bGw7XG5cbiAgICBjb25zdCB1bmluaXRpYWxpemVkRXJyb3JNZXNzYWdlID0gYFRoZSBkYXRhIG1vZGVsIGVsZW1lbnQgcGFzc2VkIHRvICR7bWV0aG9kTmFtZX0gKCR7Q01JRWxlbWVudH0pIGhhcyBub3QgYmVlbiBpbml0aWFsaXplZC5gO1xuICAgIGNvbnN0IGludmFsaWRFcnJvck1lc3NhZ2UgPSBgVGhlIGRhdGEgbW9kZWwgZWxlbWVudCBwYXNzZWQgdG8gJHttZXRob2ROYW1lfSAoJHtDTUlFbGVtZW50fSkgaXMgbm90IGEgdmFsaWQgU0NPUk0gZGF0YSBtb2RlbCBlbGVtZW50LmA7XG4gICAgY29uc3QgaW52YWxpZEVycm9yQ29kZSA9IHNjb3JtMjAwNCA/XG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLlVOREVGSU5FRF9EQVRBX01PREVMIDpcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuR0VORVJBTDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RydWN0dXJlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBhdHRyaWJ1dGUgPSBzdHJ1Y3R1cmVbaV07XG5cbiAgICAgIGlmICghc2Nvcm0yMDA0KSB7XG4gICAgICAgIGlmIChpID09PSBzdHJ1Y3R1cmUubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGlmICghdGhpcy5fY2hlY2tPYmplY3RIYXNQcm9wZXJ0eShyZWZPYmplY3QsIGF0dHJpYnV0ZSkpIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKChTdHJpbmcoYXR0cmlidXRlKS5zdWJzdHIoMCwgOCkgPT09ICd7dGFyZ2V0PScpICYmXG4gICAgICAgICAgICAodHlwZW9mIHJlZk9iamVjdC5faXNUYXJnZXRWYWxpZCA9PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICAgIGNvbnN0IHRhcmdldCA9IFN0cmluZyhhdHRyaWJ1dGUpLlxuICAgICAgICAgICAgICBzdWJzdHIoOCwgU3RyaW5nKGF0dHJpYnV0ZSkubGVuZ3RoIC0gOSk7XG4gICAgICAgICAgcmV0dXJuIHJlZk9iamVjdC5faXNUYXJnZXRWYWxpZCh0YXJnZXQpO1xuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9jaGVja09iamVjdEhhc1Byb3BlcnR5KHJlZk9iamVjdCwgYXR0cmlidXRlKSkge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZWZPYmplY3QgPSByZWZPYmplY3RbYXR0cmlidXRlXTtcbiAgICAgIGlmIChyZWZPYmplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihpbnZhbGlkRXJyb3JDb2RlLCBpbnZhbGlkRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWZPYmplY3QgaW5zdGFuY2VvZiBDTUlBcnJheSkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KHN0cnVjdHVyZVtpICsgMV0sIDEwKTtcblxuICAgICAgICAvLyBTQ08gaXMgdHJ5aW5nIHRvIHNldCBhbiBpdGVtIG9uIGFuIGFycmF5XG4gICAgICAgIGlmICghaXNOYU4oaW5kZXgpKSB7XG4gICAgICAgICAgY29uc3QgaXRlbSA9IHJlZk9iamVjdC5jaGlsZEFycmF5W2luZGV4XTtcblxuICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICByZWZPYmplY3QgPSBpdGVtO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcih0aGlzLiNlcnJvcl9jb2Rlcy5WQUxVRV9OT1RfSU5JVElBTElaRUQsXG4gICAgICAgICAgICAgICAgdW5pbml0aWFsaXplZEVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBIYXZlIHRvIHVwZGF0ZSBpIHZhbHVlIHRvIHNraXAgdGhlIGFycmF5IHBvc2l0aW9uXG4gICAgICAgICAgaSsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJlZk9iamVjdCA9PT0gbnVsbCB8fCByZWZPYmplY3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKCFzY29ybTIwMDQpIHtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZSA9PT0gJ19jaGlsZHJlbicpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTEyX2Vycm9yX2NvZGVzLkNISUxEUkVOX0VSUk9SKTtcbiAgICAgICAgfSBlbHNlIGlmIChhdHRyaWJ1dGUgPT09ICdfY291bnQnKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0xMl9lcnJvcl9jb2Rlcy5DT1VOVF9FUlJPUik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJlZk9iamVjdDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBBUEkncyBjdXJyZW50IHN0YXRlIGlzIFNUQVRFX0lOSVRJQUxJWkVEXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBpc0luaXRpYWxpemVkKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9PT0gZ2xvYmFsX2NvbnN0YW50cy5TVEFURV9JTklUSUFMSVpFRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIEFQSSdzIGN1cnJlbnQgc3RhdGUgaXMgU1RBVEVfTk9UX0lOSVRJQUxJWkVEXG4gICAqXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBpc05vdEluaXRpYWxpemVkKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9PT0gZ2xvYmFsX2NvbnN0YW50cy5TVEFURV9OT1RfSU5JVElBTElaRUQ7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBBUEkncyBjdXJyZW50IHN0YXRlIGlzIFNUQVRFX1RFUk1JTkFURURcbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGlzVGVybWluYXRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50U3RhdGUgPT09IGdsb2JhbF9jb25zdGFudHMuU1RBVEVfVEVSTUlOQVRFRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBhIG1lY2hhbmlzbSBmb3IgYXR0YWNoaW5nIHRvIGEgc3BlY2lmaWMgU0NPUk0gZXZlbnRcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxpc3RlbmVyTmFtZVxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb24obGlzdGVuZXJOYW1lOiBTdHJpbmcsIGNhbGxiYWNrOiBmdW5jdGlvbikge1xuICAgIGlmICghY2FsbGJhY2spIHJldHVybjtcblxuICAgIGNvbnN0IGxpc3RlbmVyRnVuY3Rpb25zID0gbGlzdGVuZXJOYW1lLnNwbGl0KCcgJyk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaXN0ZW5lckZ1bmN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbGlzdGVuZXJTcGxpdCA9IGxpc3RlbmVyRnVuY3Rpb25zW2ldLnNwbGl0KCcuJyk7XG4gICAgICBpZiAobGlzdGVuZXJTcGxpdC5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgICAgY29uc3QgZnVuY3Rpb25OYW1lID0gbGlzdGVuZXJTcGxpdFswXTtcblxuICAgICAgbGV0IENNSUVsZW1lbnQgPSBudWxsO1xuICAgICAgaWYgKGxpc3RlbmVyU3BsaXQubGVuZ3RoID4gMSkge1xuICAgICAgICBDTUlFbGVtZW50ID0gbGlzdGVuZXJOYW1lLnJlcGxhY2UoZnVuY3Rpb25OYW1lICsgJy4nLCAnJyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubGlzdGVuZXJBcnJheS5wdXNoKHtcbiAgICAgICAgZnVuY3Rpb25OYW1lOiBmdW5jdGlvbk5hbWUsXG4gICAgICAgIENNSUVsZW1lbnQ6IENNSUVsZW1lbnQsXG4gICAgICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9jZXNzZXMgYW55ICdvbicgbGlzdGVuZXJzIHRoYXQgaGF2ZSBiZWVuIGNyZWF0ZWRcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZ1bmN0aW9uTmFtZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqL1xuICBwcm9jZXNzTGlzdGVuZXJzKGZ1bmN0aW9uTmFtZTogU3RyaW5nLCBDTUlFbGVtZW50OiBTdHJpbmcsIHZhbHVlOiBhbnkpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGlzdGVuZXJBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgbGlzdGVuZXIgPSB0aGlzLmxpc3RlbmVyQXJyYXlbaV07XG4gICAgICBjb25zdCBmdW5jdGlvbnNNYXRjaCA9IGxpc3RlbmVyLmZ1bmN0aW9uTmFtZSA9PT0gZnVuY3Rpb25OYW1lO1xuICAgICAgY29uc3QgbGlzdGVuZXJIYXNDTUlFbGVtZW50ID0gISFsaXN0ZW5lci5DTUlFbGVtZW50O1xuICAgICAgY29uc3QgQ01JRWxlbWVudHNNYXRjaCA9IGxpc3RlbmVyLkNNSUVsZW1lbnQgPT09IENNSUVsZW1lbnQ7XG5cbiAgICAgIGlmIChmdW5jdGlvbnNNYXRjaCAmJiAoIWxpc3RlbmVySGFzQ01JRWxlbWVudCB8fCBDTUlFbGVtZW50c01hdGNoKSkge1xuICAgICAgICBsaXN0ZW5lci5jYWxsYmFjayhDTUlFbGVtZW50LCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRocm93cyBhIFNDT1JNIGVycm9yXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBlcnJvck51bWJlclxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWVzc2FnZVxuICAgKi9cbiAgdGhyb3dTQ09STUVycm9yKGVycm9yTnVtYmVyOiBudW1iZXIsIG1lc3NhZ2U6IFN0cmluZykge1xuICAgIGlmICghbWVzc2FnZSkge1xuICAgICAgbWVzc2FnZSA9IHRoaXMuZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhlcnJvck51bWJlcik7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coJ3Rocm93U0NPUk1FcnJvcicsIG51bGwsIGVycm9yTnVtYmVyICsgJzogJyArIG1lc3NhZ2UsXG4gICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0VSUk9SKTtcblxuICAgIHRoaXMubGFzdEVycm9yQ29kZSA9IFN0cmluZyhlcnJvck51bWJlcik7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIHRoZSBsYXN0IFNDT1JNIGVycm9yIGNvZGUgb24gc3VjY2Vzcy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN1Y2Nlc3NcbiAgICovXG4gIGNsZWFyU0NPUk1FcnJvcihzdWNjZXNzOiBTdHJpbmcpIHtcbiAgICBpZiAoc3VjY2VzcyAhPT0gdW5kZWZpbmVkICYmIHN1Y2Nlc3MgIT09IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0UpIHtcbiAgICAgIHRoaXMubGFzdEVycm9yQ29kZSA9IDA7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHRzIHRvIHN0b3JlIHRoZSBkYXRhIHRvIHRoZSBMTVMsIGxvZ3MgZGF0YSBpZiBubyBMTVMgY29uZmlndXJlZFxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gX2NhbGN1bGF0ZVRvdGFsVGltZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgc3RvcmVEYXRhKF9jYWxjdWxhdGVUb3RhbFRpbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdUaGUgc3RvcmVEYXRhIG1ldGhvZCBoYXMgbm90IGJlZW4gaW1wbGVtZW50ZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkIHRoZSBDTUkgZnJvbSBhIGZsYXR0ZW5lZCBKU09OIG9iamVjdFxuICAgKiBAcGFyYW0ge29iamVjdH0ganNvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKi9cbiAgbG9hZEZyb21GbGF0dGVuZWRKU09OKGpzb24sIENNSUVsZW1lbnQpIHtcbiAgICB0aGlzLmxvYWRGcm9tSlNPTih1bmZsYXR0ZW4oanNvbiksIENNSUVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWRzIENNSSBkYXRhIGZyb20gYSBKU09OIG9iamVjdC5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGpzb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICovXG4gIGxvYWRGcm9tSlNPTihqc29uLCBDTUlFbGVtZW50KSB7XG4gICAgaWYgKCF0aGlzLmlzTm90SW5pdGlhbGl6ZWQoKSkge1xuICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAnbG9hZEZyb21KU09OIGNhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgdGhlIGNhbGwgdG8gbG1zSW5pdGlhbGl6ZS4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBDTUlFbGVtZW50ID0gQ01JRWxlbWVudCAhPT0gdW5kZWZpbmVkID8gQ01JRWxlbWVudCA6ICdjbWknO1xuXG4gICAgdGhpcy5zdGFydGluZ0RhdGEgPSBqc29uO1xuXG4gICAgLy8gY291bGQgdGhpcyBiZSByZWZhY3RvcmVkIGRvd24gdG8gZmxhdHRlbihqc29uKSB0aGVuIHNldENNSVZhbHVlIG9uIGVhY2g/XG4gICAgZm9yIChjb25zdCBrZXkgaW4ganNvbikge1xuICAgICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoanNvbiwga2V5KSAmJiBqc29uW2tleV0pIHtcbiAgICAgICAgY29uc3QgY3VycmVudENNSUVsZW1lbnQgPSAoQ01JRWxlbWVudCA/IENNSUVsZW1lbnQgKyAnLicgOiAnJykgKyBrZXk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0ganNvbltrZXldO1xuXG4gICAgICAgIGlmICh2YWx1ZVsnY2hpbGRBcnJheSddKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZVsnY2hpbGRBcnJheSddLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRGcm9tSlNPTih2YWx1ZVsnY2hpbGRBcnJheSddW2ldLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRDTUlFbGVtZW50ICsgJy4nICsgaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlLmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHtcbiAgICAgICAgICB0aGlzLmxvYWRGcm9tSlNPTih2YWx1ZSwgY3VycmVudENNSUVsZW1lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0Q01JVmFsdWUoY3VycmVudENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIENNSSBvYmplY3QgdG8gSlNPTiBmb3Igc2VuZGluZyB0byBhbiBMTVMuXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHJlbmRlckNNSVRvSlNPTlN0cmluZygpIHtcbiAgICBjb25zdCBjbWkgPSB0aGlzLmNtaTtcbiAgICAvLyBEbyB3ZSB3YW50L25lZWQgdG8gcmV0dXJuIGZpZWxkcyB0aGF0IGhhdmUgbm8gc2V0IHZhbHVlP1xuICAgIC8vIHJldHVybiBKU09OLnN0cmluZ2lmeSh7IGNtaSB9LCAoaywgdikgPT4gdiA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IHYsIDIpO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh7Y21pfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIEpTIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGN1cnJlbnQgY21pXG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIHJlbmRlckNNSVRvSlNPTk9iamVjdCgpIHtcbiAgICAvLyBEbyB3ZSB3YW50L25lZWQgdG8gcmV0dXJuIGZpZWxkcyB0aGF0IGhhdmUgbm8gc2V0IHZhbHVlP1xuICAgIC8vIHJldHVybiBKU09OLnN0cmluZ2lmeSh7IGNtaSB9LCAoaywgdikgPT4gdiA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IHYsIDIpO1xuICAgIHJldHVybiBKU09OLnBhcnNlKHRoaXMucmVuZGVyQ01JVG9KU09OU3RyaW5nKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgY21pIG9iamVjdCB0byB0aGUgcHJvcGVyIGZvcm1hdCBmb3IgTE1TIGNvbW1pdFxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gX3Rlcm1pbmF0ZUNvbW1pdFxuICAgKiBAcmV0dXJuIHsqfVxuICAgKiBAYWJzdHJhY3RcbiAgICovXG4gIHJlbmRlckNvbW1pdENNSShfdGVybWluYXRlQ29tbWl0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnVGhlIHN0b3JlRGF0YSBtZXRob2QgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCB0aGUgcmVxdWVzdCB0byB0aGUgTE1TXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHtvYmplY3R8QXJyYXl9IHBhcmFtc1xuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICBwcm9jZXNzSHR0cFJlcXVlc3QodXJsOiBTdHJpbmcsIHBhcmFtcykge1xuICAgIGNvbnN0IGdlbmVyaWNFcnJvciA9IHtcbiAgICAgICdyZXN1bHQnOiBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFLFxuICAgICAgJ2Vycm9yQ29kZSc6IHRoaXMuI2Vycm9yX2NvZGVzLkdFTkVSQUwsXG4gICAgfTtcblxuICAgIGNvbnN0IGh0dHBSZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICBodHRwUmVxLm9wZW4oJ1BPU1QnLCB1cmwsIGZhbHNlKTtcbiAgICB0cnkge1xuICAgICAgaWYgKHBhcmFtcyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIGh0dHBSZXEuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJyxcbiAgICAgICAgICAgICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcbiAgICAgICAgaHR0cFJlcS5zZW5kKHBhcmFtcy5qb2luKCcmJykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaHR0cFJlcS5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLFxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5jb21taXRSZXF1ZXN0RGF0YVR5cGUpO1xuICAgICAgICBodHRwUmVxLnNlbmQoSlNPTi5zdHJpbmdpZnkocGFyYW1zKSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGdlbmVyaWNFcnJvcjtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgcmV0dXJuIEpTT04ucGFyc2UoaHR0cFJlcS5yZXNwb25zZVRleHQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBnZW5lcmljRXJyb3I7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRocm93cyBhIFNDT1JNIGVycm9yXG4gICAqXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aGVuIC0gdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gd2FpdCBiZWZvcmUgY29tbWl0dGluZ1xuICAgKi9cbiAgc2NoZWR1bGVDb21taXQod2hlbjogbnVtYmVyKSB7XG4gICAgdGhpcy4jdGltZW91dCA9IG5ldyBTY2hlZHVsZWRDb21taXQodGhpcywgd2hlbik7XG4gICAgdGhpcy5hcGlMb2coJ3NjaGVkdWxlQ29tbWl0JywgJycsICdzY2hlZHVsZWQnLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9ERUJVRyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXJzIGFuZCBjYW5jZWxzIGFueSBjdXJyZW50bHkgc2NoZWR1bGVkIGNvbW1pdHNcbiAgICovXG4gIGNsZWFyU2NoZWR1bGVkQ29tbWl0KCkge1xuICAgIGlmICh0aGlzLiN0aW1lb3V0KSB7XG4gICAgICB0aGlzLiN0aW1lb3V0LmNhbmNlbCgpO1xuICAgICAgdGhpcy4jdGltZW91dCA9IG51bGw7XG4gICAgICB0aGlzLmFwaUxvZygnY2xlYXJTY2hlZHVsZWRDb21taXQnLCAnJywgJ2NsZWFyZWQnLFxuICAgICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0RFQlVHKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBQcml2YXRlIGNsYXNzIHRoYXQgd3JhcHMgYSB0aW1lb3V0IGNhbGwgdG8gdGhlIGNvbW1pdCgpIGZ1bmN0aW9uXG4gKi9cbmNsYXNzIFNjaGVkdWxlZENvbW1pdCB7XG4gICNBUEk7XG4gICNjYW5jZWxsZWQgPSBmYWxzZTtcbiAgI3RpbWVvdXQ7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBTY2hlZHVsZWRDb21taXRcbiAgICogQHBhcmFtIHtCYXNlQVBJfSBBUElcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdoZW5cbiAgICovXG4gIGNvbnN0cnVjdG9yKEFQSTogYW55LCB3aGVuOiBudW1iZXIpIHtcbiAgICB0aGlzLiNBUEkgPSBBUEk7XG4gICAgdGhpcy4jdGltZW91dCA9IHNldFRpbWVvdXQodGhpcy53cmFwcGVyLmJpbmQodGhpcyksIHdoZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbmNlbCBhbnkgY3VycmVudGx5IHNjaGVkdWxlZCBjb21taXRcbiAgICovXG4gIGNhbmNlbCgpIHtcbiAgICB0aGlzLiNjYW5jZWxsZWQgPSB0cnVlO1xuICAgIGlmICh0aGlzLiN0aW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy4jdGltZW91dCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFdyYXAgdGhlIEFQSSBjb21taXQgY2FsbCB0byBjaGVjayBpZiB0aGUgY2FsbCBoYXMgYWxyZWFkeSBiZWVuIGNhbmNlbGxlZFxuICAgKi9cbiAgd3JhcHBlcigpIHtcbiAgICBpZiAoIXRoaXMuI2NhbmNlbGxlZCkge1xuICAgICAgdGhpcy4jQVBJLmNvbW1pdCgpO1xuICAgIH1cbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCBCYXNlQVBJIGZyb20gJy4vQmFzZUFQSSc7XG5pbXBvcnQge1xuICBDTUksXG4gIENNSUludGVyYWN0aW9uc0NvcnJlY3RSZXNwb25zZXNPYmplY3QsXG4gIENNSUludGVyYWN0aW9uc09iamVjdCxcbiAgQ01JSW50ZXJhY3Rpb25zT2JqZWN0aXZlc09iamVjdCxcbiAgQ01JT2JqZWN0aXZlc09iamVjdCwgTkFWLFxufSBmcm9tICcuL2NtaS9zY29ybTEyX2NtaSc7XG5pbXBvcnQgKiBhcyBVdGlsaXRpZXMgZnJvbSAnLi91dGlsaXRpZXMnO1xuaW1wb3J0IEFQSUNvbnN0YW50cyBmcm9tICcuL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCBFcnJvckNvZGVzIGZyb20gJy4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJztcblxuY29uc3Qgc2Nvcm0xMl9jb25zdGFudHMgPSBBUElDb25zdGFudHMuc2Nvcm0xMjtcbmNvbnN0IGdsb2JhbF9jb25zdGFudHMgPSBBUElDb25zdGFudHMuZ2xvYmFsO1xuY29uc3Qgc2Nvcm0xMl9lcnJvcl9jb2RlcyA9IEVycm9yQ29kZXMuc2Nvcm0xMjtcblxuLyoqXG4gKiBBUEkgY2xhc3MgZm9yIFNDT1JNIDEuMlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY29ybTEyQVBJIGV4dGVuZHMgQmFzZUFQSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgU0NPUk0gMS4yIEFQSVxuICAgKiBAcGFyYW0ge29iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiB7fSkge1xuICAgIGNvbnN0IGZpbmFsU2V0dGluZ3MgPSB7XG4gICAgICAuLi57XG4gICAgICAgIG1hc3Rlcnlfb3ZlcnJpZGU6IGZhbHNlLFxuICAgICAgfSwgLi4uc2V0dGluZ3MsXG4gICAgfTtcblxuICAgIHN1cGVyKHNjb3JtMTJfZXJyb3JfY29kZXMsIGZpbmFsU2V0dGluZ3MpO1xuXG4gICAgdGhpcy5jbWkgPSBuZXcgQ01JKCk7XG4gICAgdGhpcy5uYXYgPSBuZXcgTkFWKCk7XG5cbiAgICAvLyBSZW5hbWUgZnVuY3Rpb25zIHRvIG1hdGNoIDEuMiBTcGVjIGFuZCBleHBvc2UgdG8gbW9kdWxlc1xuICAgIHRoaXMuTE1TSW5pdGlhbGl6ZSA9IHRoaXMubG1zSW5pdGlhbGl6ZTtcbiAgICB0aGlzLkxNU0ZpbmlzaCA9IHRoaXMubG1zRmluaXNoO1xuICAgIHRoaXMuTE1TR2V0VmFsdWUgPSB0aGlzLmxtc0dldFZhbHVlO1xuICAgIHRoaXMuTE1TU2V0VmFsdWUgPSB0aGlzLmxtc1NldFZhbHVlO1xuICAgIHRoaXMuTE1TQ29tbWl0ID0gdGhpcy5sbXNDb21taXQ7XG4gICAgdGhpcy5MTVNHZXRMYXN0RXJyb3IgPSB0aGlzLmxtc0dldExhc3RFcnJvcjtcbiAgICB0aGlzLkxNU0dldEVycm9yU3RyaW5nID0gdGhpcy5sbXNHZXRFcnJvclN0cmluZztcbiAgICB0aGlzLkxNU0dldERpYWdub3N0aWMgPSB0aGlzLmxtc0dldERpYWdub3N0aWM7XG4gIH1cblxuICAvKipcbiAgICogbG1zSW5pdGlhbGl6ZSBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYm9vbFxuICAgKi9cbiAgbG1zSW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLmNtaS5pbml0aWFsaXplKCk7XG4gICAgcmV0dXJuIHRoaXMuaW5pdGlhbGl6ZSgnTE1TSW5pdGlhbGl6ZScsICdMTVMgd2FzIGFscmVhZHkgaW5pdGlhbGl6ZWQhJyxcbiAgICAgICAgJ0xNUyBpcyBhbHJlYWR5IGZpbmlzaGVkIScpO1xuICB9XG5cbiAgLyoqXG4gICAqIExNU0ZpbmlzaCBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYm9vbFxuICAgKi9cbiAgbG1zRmluaXNoKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMudGVybWluYXRlKCdMTVNGaW5pc2gnLCBmYWxzZSk7XG5cbiAgICBpZiAocmVzdWx0ID09PSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUUpIHtcbiAgICAgIGlmICh0aGlzLm5hdi5ldmVudCAhPT0gJycpIHtcbiAgICAgICAgaWYgKHRoaXMubmF2LmV2ZW50ID09PSAnY29udGludWUnKSB7XG4gICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZU5leHQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlUHJldmlvdXMnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLmF1dG9Qcm9ncmVzcykge1xuICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlTmV4dCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogTE1TR2V0VmFsdWUgZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXRWYWx1ZShDTUlFbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUoJ0xNU0dldFZhbHVlJywgZmFsc2UsIENNSUVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIExNU1NldFZhbHVlIGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNTZXRWYWx1ZShDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnNldFZhbHVlKCdMTVNTZXRWYWx1ZScsIGZhbHNlLCBDTUlFbGVtZW50LCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogTE1TQ29tbWl0IGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSBib29sXG4gICAqL1xuICBsbXNDb21taXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29tbWl0KCdMTVNDb21taXQnLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogTE1TR2V0TGFzdEVycm9yIGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zR2V0TGFzdEVycm9yKCkge1xuICAgIHJldHVybiB0aGlzLmdldExhc3RFcnJvcignTE1TR2V0TGFzdEVycm9yJyk7XG4gIH1cblxuICAvKipcbiAgICogTE1TR2V0RXJyb3JTdHJpbmcgZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRXJyb3JDb2RlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc0dldEVycm9yU3RyaW5nKENNSUVycm9yQ29kZSkge1xuICAgIHJldHVybiB0aGlzLmdldEVycm9yU3RyaW5nKCdMTVNHZXRFcnJvclN0cmluZycsIENNSUVycm9yQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogTE1TR2V0RGlhZ25vc3RpYyBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFcnJvckNvZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zR2V0RGlhZ25vc3RpYyhDTUlFcnJvckNvZGUpIHtcbiAgICByZXR1cm4gdGhpcy5nZXREaWFnbm9zdGljKCdMTVNHZXREaWFnbm9zdGljJywgQ01JRXJyb3JDb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGEgdmFsdWUgb24gdGhlIENNSSBPYmplY3RcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBzZXRDTUlWYWx1ZShDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9jb21tb25TZXRDTUlWYWx1ZSgnTE1TU2V0VmFsdWUnLCBmYWxzZSwgQ01JRWxlbWVudCwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSB2YWx1ZSBmcm9tIHRoZSBDTUkgT2JqZWN0XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXRDTUlWYWx1ZShDTUlFbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbW1vbkdldENNSVZhbHVlKCdnZXRDTUlWYWx1ZScsIGZhbHNlLCBDTUlFbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIG9yIGJ1aWxkcyBhIG5ldyBjaGlsZCBlbGVtZW50IHRvIGFkZCB0byB0aGUgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHBhcmFtIHtib29sZWFufSBmb3VuZEZpcnN0SW5kZXhcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cbiAgZ2V0Q2hpbGRFbGVtZW50KENNSUVsZW1lbnQsIHZhbHVlLCBmb3VuZEZpcnN0SW5kZXgpIHtcbiAgICBsZXQgbmV3Q2hpbGQ7XG5cbiAgICBpZiAodGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsICdjbWlcXFxcLm9iamVjdGl2ZXNcXFxcLlxcXFxkJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSU9iamVjdGl2ZXNPYmplY3QoKTtcbiAgICB9IGVsc2UgaWYgKGZvdW5kRmlyc3RJbmRleCAmJiB0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCxcbiAgICAgICAgJ2NtaVxcXFwuaW50ZXJhY3Rpb25zXFxcXC5cXFxcZFxcXFwuY29ycmVjdF9yZXNwb25zZXNcXFxcLlxcXFxkJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSUludGVyYWN0aW9uc0NvcnJlY3RSZXNwb25zZXNPYmplY3QoKTtcbiAgICB9IGVsc2UgaWYgKGZvdW5kRmlyc3RJbmRleCAmJiB0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCxcbiAgICAgICAgJ2NtaVxcXFwuaW50ZXJhY3Rpb25zXFxcXC5cXFxcZFxcXFwub2JqZWN0aXZlc1xcXFwuXFxcXGQnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JSW50ZXJhY3Rpb25zT2JqZWN0aXZlc09iamVjdCgpO1xuICAgIH0gZWxzZSBpZiAoIWZvdW5kRmlyc3RJbmRleCAmJlxuICAgICAgICB0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ2NtaVxcXFwuaW50ZXJhY3Rpb25zXFxcXC5cXFxcZCcpKSB7XG4gICAgICBuZXdDaGlsZCA9IG5ldyBDTUlJbnRlcmFjdGlvbnNPYmplY3QoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3Q2hpbGQ7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGVzIENvcnJlY3QgUmVzcG9uc2UgdmFsdWVzXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIHZhbGlkYXRlQ29ycmVjdFJlc3BvbnNlKENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbWVzc2FnZSB0aGF0IGNvcnJlc3BvbmRzIHRvIGVycm9yTnVtYmVyLlxuICAgKlxuICAgKiBAcGFyYW0geyp9IGVycm9yTnVtYmVyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbiB9ZGV0YWlsXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldExtc0Vycm9yTWVzc2FnZURldGFpbHMoZXJyb3JOdW1iZXIsIGRldGFpbCkge1xuICAgIGxldCBiYXNpY01lc3NhZ2UgPSAnTm8gRXJyb3InO1xuICAgIGxldCBkZXRhaWxNZXNzYWdlID0gJ05vIEVycm9yJztcblxuICAgIC8vIFNldCBlcnJvciBudW1iZXIgdG8gc3RyaW5nIHNpbmNlIGluY29uc2lzdGVudCBmcm9tIG1vZHVsZXMgaWYgc3RyaW5nIG9yIG51bWJlclxuICAgIGVycm9yTnVtYmVyID0gU3RyaW5nKGVycm9yTnVtYmVyKTtcbiAgICBpZiAoc2Nvcm0xMl9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW2Vycm9yTnVtYmVyXSkge1xuICAgICAgYmFzaWNNZXNzYWdlID0gc2Nvcm0xMl9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW2Vycm9yTnVtYmVyXS5iYXNpY01lc3NhZ2U7XG4gICAgICBkZXRhaWxNZXNzYWdlID0gc2Nvcm0xMl9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW2Vycm9yTnVtYmVyXS5kZXRhaWxNZXNzYWdlO1xuICAgIH1cblxuICAgIHJldHVybiBkZXRhaWwgPyBkZXRhaWxNZXNzYWdlIDogYmFzaWNNZXNzYWdlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgdGhlIHdob2xlIEFQSSB3aXRoIGFub3RoZXJcbiAgICpcbiAgICogQHBhcmFtIHtTY29ybTEyQVBJfSBuZXdBUElcbiAgICovXG4gIHJlcGxhY2VXaXRoQW5vdGhlclNjb3JtQVBJKG5ld0FQSSkge1xuICAgIC8vIERhdGEgTW9kZWxcbiAgICB0aGlzLmNtaSA9IG5ld0FQSS5jbWk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBjbWkgb2JqZWN0IHRvIHRoZSBwcm9wZXIgZm9ybWF0IGZvciBMTVMgY29tbWl0XG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdGVybWluYXRlQ29tbWl0XG4gICAqIEByZXR1cm4ge29iamVjdHxBcnJheX1cbiAgICovXG4gIHJlbmRlckNvbW1pdENNSSh0ZXJtaW5hdGVDb21taXQ6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBjbWlFeHBvcnQgPSB0aGlzLnJlbmRlckNNSVRvSlNPTk9iamVjdCgpO1xuXG4gICAgaWYgKHRlcm1pbmF0ZUNvbW1pdCkge1xuICAgICAgY21pRXhwb3J0LmNtaS5jb3JlLnRvdGFsX3RpbWUgPSB0aGlzLmNtaS5nZXRDdXJyZW50VG90YWxUaW1lKCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgY29uc3QgZmxhdHRlbmVkID0gVXRpbGl0aWVzLmZsYXR0ZW4oY21pRXhwb3J0KTtcbiAgICBzd2l0Y2ggKHRoaXMuc2V0dGluZ3MuZGF0YUNvbW1pdEZvcm1hdCkge1xuICAgICAgY2FzZSAnZmxhdHRlbmVkJzpcbiAgICAgICAgcmV0dXJuIFV0aWxpdGllcy5mbGF0dGVuKGNtaUV4cG9ydCk7XG4gICAgICBjYXNlICdwYXJhbXMnOlxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gaW4gZmxhdHRlbmVkKSB7XG4gICAgICAgICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoZmxhdHRlbmVkLCBpdGVtKSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goYCR7aXRlbX09JHtmbGF0dGVuZWRbaXRlbV19YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICBjYXNlICdqc29uJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBjbWlFeHBvcnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHRzIHRvIHN0b3JlIHRoZSBkYXRhIHRvIHRoZSBMTVNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSB0ZXJtaW5hdGVDb21taXRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgc3RvcmVEYXRhKHRlcm1pbmF0ZUNvbW1pdDogYm9vbGVhbikge1xuICAgIGlmICh0ZXJtaW5hdGVDb21taXQpIHtcbiAgICAgIGNvbnN0IG9yaWdpbmFsU3RhdHVzID0gdGhpcy5jbWkuY29yZS5sZXNzb25fc3RhdHVzO1xuICAgICAgaWYgKG9yaWdpbmFsU3RhdHVzID09PSAnbm90IGF0dGVtcHRlZCcpIHtcbiAgICAgICAgdGhpcy5jbWkuY29yZS5sZXNzb25fc3RhdHVzID0gJ2NvbXBsZXRlZCc7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmNtaS5jb3JlLmxlc3Nvbl9tb2RlID09PSAnbm9ybWFsJykge1xuICAgICAgICBpZiAodGhpcy5jbWkuY29yZS5jcmVkaXQgPT09ICdjcmVkaXQnKSB7XG4gICAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MubWFzdGVyeV9vdmVycmlkZSAmJlxuICAgICAgICAgICAgICB0aGlzLmNtaS5zdHVkZW50X2RhdGEubWFzdGVyeV9zY29yZSAhPT0gJycgJiZcbiAgICAgICAgICAgICAgdGhpcy5jbWkuY29yZS5zY29yZS5yYXcgIT09ICcnKSB7XG4gICAgICAgICAgICBpZiAocGFyc2VGbG9hdCh0aGlzLmNtaS5jb3JlLnNjb3JlLnJhdykgPj1cbiAgICAgICAgICAgICAgICBwYXJzZUZsb2F0KHRoaXMuY21pLnN0dWRlbnRfZGF0YS5tYXN0ZXJ5X3Njb3JlKSkge1xuICAgICAgICAgICAgICB0aGlzLmNtaS5jb3JlLmxlc3Nvbl9zdGF0dXMgPSAncGFzc2VkJztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuY21pLmNvcmUubGVzc29uX3N0YXR1cyA9ICdmYWlsZWQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNtaS5jb3JlLmxlc3Nvbl9tb2RlID09PSAnYnJvd3NlJykge1xuICAgICAgICBpZiAoKHRoaXMuc3RhcnRpbmdEYXRhPy5jbWk/LmNvcmU/Lmxlc3Nvbl9zdGF0dXMgfHwgJycpID09PSAnJyAmJlxuICAgICAgICAgICAgb3JpZ2luYWxTdGF0dXMgPT09ICdub3QgYXR0ZW1wdGVkJykge1xuICAgICAgICAgIHRoaXMuY21pLmNvcmUubGVzc29uX3N0YXR1cyA9ICdicm93c2VkJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGNvbW1pdE9iamVjdCA9IHRoaXMucmVuZGVyQ29tbWl0Q01JKHRlcm1pbmF0ZUNvbW1pdCk7XG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5sbXNDb21taXRVcmwpIHtcbiAgICAgIGlmICh0aGlzLmFwaUxvZ0xldmVsID09PSBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9ERUJVRykge1xuICAgICAgICBjb25zb2xlLmRlYnVnKCdDb21taXQgKHRlcm1pbmF0ZWQ6ICcgK1xuICAgICAgICAgICAgKHRlcm1pbmF0ZUNvbW1pdCA/ICd5ZXMnIDogJ25vJykgKyAnKTogJyk7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoY29tbWl0T2JqZWN0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NIdHRwUmVxdWVzdCh0aGlzLnNldHRpbmdzLmxtc0NvbW1pdFVybCwgY29tbWl0T2JqZWN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ0NvbW1pdCAodGVybWluYXRlZDogJyArXG4gICAgICAgICAgKHRlcm1pbmF0ZUNvbW1pdCA/ICd5ZXMnIDogJ25vJykgKyAnKTogJyk7XG4gICAgICBjb25zb2xlLmxvZyhjb21taXRPYmplY3QpO1xuICAgICAgcmV0dXJuIGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vIEBmbG93XG5pbXBvcnQgQmFzZUFQSSBmcm9tICcuL0Jhc2VBUEknO1xuaW1wb3J0IHtcbiAgQURMLFxuICBDTUksXG4gIENNSUNvbW1lbnRzT2JqZWN0LFxuICBDTUlJbnRlcmFjdGlvbnNDb3JyZWN0UmVzcG9uc2VzT2JqZWN0LFxuICBDTUlJbnRlcmFjdGlvbnNPYmplY3QsXG4gIENNSUludGVyYWN0aW9uc09iamVjdGl2ZXNPYmplY3QsXG4gIENNSU9iamVjdGl2ZXNPYmplY3QsXG59IGZyb20gJy4vY21pL3Njb3JtMjAwNF9jbWknO1xuaW1wb3J0ICogYXMgVXRpbGl0aWVzIGZyb20gJy4vdXRpbGl0aWVzJztcbmltcG9ydCBBUElDb25zdGFudHMgZnJvbSAnLi9jb25zdGFudHMvYXBpX2NvbnN0YW50cyc7XG5pbXBvcnQgRXJyb3JDb2RlcyBmcm9tICcuL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQgUmVzcG9uc2VzIGZyb20gJy4vY29uc3RhbnRzL3Jlc3BvbnNlX2NvbnN0YW50cyc7XG5pbXBvcnQgVmFsaWRMYW5ndWFnZXMgZnJvbSAnLi9jb25zdGFudHMvbGFuZ3VhZ2VfY29uc3RhbnRzJztcbmltcG9ydCBSZWdleCBmcm9tICcuL2NvbnN0YW50cy9yZWdleCc7XG5cbmNvbnN0IHNjb3JtMjAwNF9jb25zdGFudHMgPSBBUElDb25zdGFudHMuc2Nvcm0yMDA0O1xuY29uc3QgZ2xvYmFsX2NvbnN0YW50cyA9IEFQSUNvbnN0YW50cy5nbG9iYWw7XG5jb25zdCBzY29ybTIwMDRfZXJyb3JfY29kZXMgPSBFcnJvckNvZGVzLnNjb3JtMjAwNDtcbmNvbnN0IGNvcnJlY3RfcmVzcG9uc2VzID0gUmVzcG9uc2VzLmNvcnJlY3Q7XG5jb25zdCBzY29ybTIwMDRfcmVnZXggPSBSZWdleC5zY29ybTIwMDQ7XG5cbi8qKlxuICogQVBJIGNsYXNzIGZvciBTQ09STSAyMDA0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjb3JtMjAwNEFQSSBleHRlbmRzIEJhc2VBUEkge1xuICAjdmVyc2lvbjogJzEuMCc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBTQ09STSAyMDA0IEFQSVxuICAgKiBAcGFyYW0ge29iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiB7fSkge1xuICAgIGNvbnN0IGZpbmFsU2V0dGluZ3MgPSB7XG4gICAgICAuLi57XG4gICAgICAgIG1hc3Rlcnlfb3ZlcnJpZGU6IGZhbHNlLFxuICAgICAgfSwgLi4uc2V0dGluZ3MsXG4gICAgfTtcblxuICAgIHN1cGVyKHNjb3JtMjAwNF9lcnJvcl9jb2RlcywgZmluYWxTZXR0aW5ncyk7XG5cbiAgICB0aGlzLmNtaSA9IG5ldyBDTUkoKTtcbiAgICB0aGlzLmFkbCA9IG5ldyBBREwoKTtcblxuICAgIC8vIFJlbmFtZSBmdW5jdGlvbnMgdG8gbWF0Y2ggMjAwNCBTcGVjIGFuZCBleHBvc2UgdG8gbW9kdWxlc1xuICAgIHRoaXMuSW5pdGlhbGl6ZSA9IHRoaXMubG1zSW5pdGlhbGl6ZTtcbiAgICB0aGlzLlRlcm1pbmF0ZSA9IHRoaXMubG1zVGVybWluYXRlO1xuICAgIHRoaXMuR2V0VmFsdWUgPSB0aGlzLmxtc0dldFZhbHVlO1xuICAgIHRoaXMuU2V0VmFsdWUgPSB0aGlzLmxtc1NldFZhbHVlO1xuICAgIHRoaXMuQ29tbWl0ID0gdGhpcy5sbXNDb21taXQ7XG4gICAgdGhpcy5HZXRMYXN0RXJyb3IgPSB0aGlzLmxtc0dldExhc3RFcnJvcjtcbiAgICB0aGlzLkdldEVycm9yU3RyaW5nID0gdGhpcy5sbXNHZXRFcnJvclN0cmluZztcbiAgICB0aGlzLkdldERpYWdub3N0aWMgPSB0aGlzLmxtc0dldERpYWdub3N0aWM7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdmVyc2lvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdmVyc2lvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jdmVyc2lvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJvb2xcbiAgICovXG4gIGxtc0luaXRpYWxpemUoKSB7XG4gICAgdGhpcy5jbWkuaW5pdGlhbGl6ZSgpO1xuICAgIHJldHVybiB0aGlzLmluaXRpYWxpemUoJ0luaXRpYWxpemUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJvb2xcbiAgICovXG4gIGxtc1Rlcm1pbmF0ZSgpIHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLnRlcm1pbmF0ZSgnVGVybWluYXRlJywgdHJ1ZSk7XG5cbiAgICBpZiAocmVzdWx0ID09PSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUUpIHtcbiAgICAgIGlmICh0aGlzLmFkbC5uYXYucmVxdWVzdCAhPT0gJ19ub25lXycpIHtcbiAgICAgICAgc3dpdGNoICh0aGlzLmFkbC5uYXYucmVxdWVzdCkge1xuICAgICAgICAgIGNhc2UgJ2NvbnRpbnVlJzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VOZXh0Jyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdwcmV2aW91cyc6XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlUHJldmlvdXMnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ2Nob2ljZSc6XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlQ2hvaWNlJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdleGl0JzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VFeGl0Jyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdleGl0QWxsJzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VFeGl0QWxsJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdhYmFuZG9uJzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VBYmFuZG9uJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdhYmFuZG9uQWxsJzpcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VBYmFuZG9uQWxsJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLmF1dG9Qcm9ncmVzcykge1xuICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlTmV4dCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zR2V0VmFsdWUoQ01JRWxlbWVudCkge1xuICAgIHJldHVybiB0aGlzLmdldFZhbHVlKCdHZXRWYWx1ZScsIHRydWUsIENNSUVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNTZXRWYWx1ZShDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnNldFZhbHVlKCdTZXRWYWx1ZScsIHRydWUsIENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPcmRlcnMgTE1TIHRvIHN0b3JlIGFsbCBjb250ZW50IHBhcmFtZXRlcnNcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSBib29sXG4gICAqL1xuICBsbXNDb21taXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29tbWl0KCdDb21taXQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGxhc3QgZXJyb3IgY29kZVxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXRMYXN0RXJyb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TGFzdEVycm9yKCdHZXRMYXN0RXJyb3InKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBlcnJvck51bWJlciBlcnJvciBkZXNjcmlwdGlvblxuICAgKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gQ01JRXJyb3JDb2RlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc0dldEVycm9yU3RyaW5nKENNSUVycm9yQ29kZSkge1xuICAgIHJldHVybiB0aGlzLmdldEVycm9yU3RyaW5nKCdHZXRFcnJvclN0cmluZycsIENNSUVycm9yQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGNvbXByZWhlbnNpdmUgZGVzY3JpcHRpb24gb2YgdGhlIGVycm9yTnVtYmVyIGVycm9yLlxuICAgKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gQ01JRXJyb3JDb2RlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc0dldERpYWdub3N0aWMoQ01JRXJyb3JDb2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RGlhZ25vc3RpYygnR2V0RGlhZ25vc3RpYycsIENNSUVycm9yQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhIHZhbHVlIG9uIHRoZSBDTUkgT2JqZWN0XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBzZXRDTUlWYWx1ZShDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9jb21tb25TZXRDTUlWYWx1ZSgnU2V0VmFsdWUnLCB0cnVlLCBDTUlFbGVtZW50LCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBvciBidWlsZHMgYSBuZXcgY2hpbGQgZWxlbWVudCB0byBhZGQgdG8gdGhlIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICogQHBhcmFtIHtib29sZWFufSBmb3VuZEZpcnN0SW5kZXhcbiAgICogQHJldHVybiB7YW55fVxuICAgKi9cbiAgZ2V0Q2hpbGRFbGVtZW50KENNSUVsZW1lbnQsIHZhbHVlLCBmb3VuZEZpcnN0SW5kZXgpIHtcbiAgICBsZXQgbmV3Q2hpbGQ7XG5cbiAgICBpZiAodGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsICdjbWlcXFxcLm9iamVjdGl2ZXNcXFxcLlxcXFxkJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSU9iamVjdGl2ZXNPYmplY3QoKTtcbiAgICB9IGVsc2UgaWYgKGZvdW5kRmlyc3RJbmRleCAmJiB0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCxcbiAgICAgICAgJ2NtaVxcXFwuaW50ZXJhY3Rpb25zXFxcXC5cXFxcZFxcXFwuY29ycmVjdF9yZXNwb25zZXNcXFxcLlxcXFxkJykpIHtcbiAgICAgIGNvbnN0IHBhcnRzID0gQ01JRWxlbWVudC5zcGxpdCgnLicpO1xuICAgICAgY29uc3QgaW5kZXggPSBOdW1iZXIocGFydHNbMl0pO1xuICAgICAgY29uc3QgaW50ZXJhY3Rpb24gPSB0aGlzLmNtaS5pbnRlcmFjdGlvbnMuY2hpbGRBcnJheVtpbmRleF07XG4gICAgICBpZiAoIWludGVyYWN0aW9uLnR5cGUpIHtcbiAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkRFUEVOREVOQ1lfTk9UX0VTVEFCTElTSEVEKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGludGVyYWN0aW9uX3R5cGUgPSBpbnRlcmFjdGlvbi50eXBlO1xuICAgICAgICBjb25zdCBpbnRlcmFjdGlvbl9jb3VudCA9IGludGVyYWN0aW9uLmNvcnJlY3RfcmVzcG9uc2VzLl9jb3VudDtcbiAgICAgICAgaWYgKGludGVyYWN0aW9uX3R5cGUgPT09ICdjaG9pY2UnKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnRlcmFjdGlvbl9jb3VudCAmJiB0aGlzLmxhc3RFcnJvckNvZGUgPT09XG4gICAgICAgICAgMDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGludGVyYWN0aW9uLmNvcnJlY3RfcmVzcG9uc2VzLmNoaWxkQXJyYXlbaV07XG4gICAgICAgICAgICBpZiAocmVzcG9uc2UucGF0dGVybiA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlX3R5cGUgPSBjb3JyZWN0X3Jlc3BvbnNlc1tpbnRlcmFjdGlvbl90eXBlXTtcbiAgICAgICAgaWYgKHJlc3BvbnNlX3R5cGUpIHtcbiAgICAgICAgICBsZXQgbm9kZXMgPSBbXTtcbiAgICAgICAgICBpZiAocmVzcG9uc2VfdHlwZT8uZGVsaW1pdGVyKSB7XG4gICAgICAgICAgICBub2RlcyA9IFN0cmluZyh2YWx1ZSkuc3BsaXQocmVzcG9uc2VfdHlwZS5kZWxpbWl0ZXIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2Rlc1swXSA9IHZhbHVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChub2Rlcy5sZW5ndGggPiAwICYmIG5vZGVzLmxlbmd0aCA8PSByZXNwb25zZV90eXBlLm1heCkge1xuICAgICAgICAgICAgdGhpcy5jaGVja0NvcnJlY3RSZXNwb25zZVZhbHVlKGludGVyYWN0aW9uX3R5cGUsIG5vZGVzLCB2YWx1ZSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChub2Rlcy5sZW5ndGggPiByZXNwb25zZV90eXBlLm1heCkge1xuICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUsXG4gICAgICAgICAgICAgICAgJ0RhdGEgTW9kZWwgRWxlbWVudCBQYXR0ZXJuIFRvbyBMb25nJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5HRU5FUkFMX1NFVF9GQUlMVVJFLFxuICAgICAgICAgICAgICAnSW5jb3JyZWN0IFJlc3BvbnNlIFR5cGU6ICcgKyBpbnRlcmFjdGlvbl90eXBlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMubGFzdEVycm9yQ29kZSA9PT0gMCkge1xuICAgICAgICBuZXdDaGlsZCA9IG5ldyBDTUlJbnRlcmFjdGlvbnNDb3JyZWN0UmVzcG9uc2VzT2JqZWN0KCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmb3VuZEZpcnN0SW5kZXggJiYgdGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsXG4gICAgICAgICdjbWlcXFxcLmludGVyYWN0aW9uc1xcXFwuXFxcXGRcXFxcLm9iamVjdGl2ZXNcXFxcLlxcXFxkJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSUludGVyYWN0aW9uc09iamVjdGl2ZXNPYmplY3QoKTtcbiAgICB9IGVsc2UgaWYgKCFmb3VuZEZpcnN0SW5kZXggJiZcbiAgICAgICAgdGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsICdjbWlcXFxcLmludGVyYWN0aW9uc1xcXFwuXFxcXGQnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JSW50ZXJhY3Rpb25zT2JqZWN0KCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCxcbiAgICAgICAgJ2NtaVxcXFwuY29tbWVudHNfZnJvbV9sZWFybmVyXFxcXC5cXFxcZCcpKSB7XG4gICAgICBuZXdDaGlsZCA9IG5ldyBDTUlDb21tZW50c09iamVjdCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsXG4gICAgICAgICdjbWlcXFxcLmNvbW1lbnRzX2Zyb21fbG1zXFxcXC5cXFxcZCcpKSB7XG4gICAgICBuZXdDaGlsZCA9IG5ldyBDTUlDb21tZW50c09iamVjdCh0cnVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3Q2hpbGQ7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGUgY29ycmVjdCByZXNwb25zZS5cbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKi9cbiAgdmFsaWRhdGVDb3JyZWN0UmVzcG9uc2UoQ01JRWxlbWVudCwgdmFsdWUpIHtcbiAgICBjb25zdCBwYXJ0cyA9IENNSUVsZW1lbnQuc3BsaXQoJy4nKTtcbiAgICBjb25zdCBpbmRleCA9IE51bWJlcihwYXJ0c1syXSk7XG4gICAgY29uc3QgcGF0dGVybl9pbmRleCA9IE51bWJlcihwYXJ0c1s0XSk7XG4gICAgY29uc3QgaW50ZXJhY3Rpb24gPSB0aGlzLmNtaS5pbnRlcmFjdGlvbnMuY2hpbGRBcnJheVtpbmRleF07XG5cbiAgICBjb25zdCBpbnRlcmFjdGlvbl90eXBlID0gaW50ZXJhY3Rpb24udHlwZTtcbiAgICBjb25zdCBpbnRlcmFjdGlvbl9jb3VudCA9IGludGVyYWN0aW9uLmNvcnJlY3RfcmVzcG9uc2VzLl9jb3VudDtcbiAgICBpZiAoaW50ZXJhY3Rpb25fdHlwZSA9PT0gJ2Nob2ljZScpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW50ZXJhY3Rpb25fY291bnQgJiYgdGhpcy5sYXN0RXJyb3JDb2RlID09PSAwOyBpKyspIHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBpbnRlcmFjdGlvbi5jb3JyZWN0X3Jlc3BvbnNlcy5jaGlsZEFycmF5W2ldO1xuICAgICAgICBpZiAocmVzcG9uc2UucGF0dGVybiA9PT0gdmFsdWUpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuR0VORVJBTF9TRVRfRkFJTFVSRSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCByZXNwb25zZV90eXBlID0gY29ycmVjdF9yZXNwb25zZXNbaW50ZXJhY3Rpb25fdHlwZV07XG4gICAgaWYgKHR5cGVvZiByZXNwb25zZV90eXBlLmxpbWl0ICE9PSAndW5kZWZpbmVkJyB8fCBpbnRlcmFjdGlvbl9jb3VudCA8XG4gICAgICAgIHJlc3BvbnNlX3R5cGUubGltaXQpIHtcbiAgICAgIGxldCBub2RlcyA9IFtdO1xuICAgICAgaWYgKHJlc3BvbnNlX3R5cGU/LmRlbGltaXRlcikge1xuICAgICAgICBub2RlcyA9IFN0cmluZyh2YWx1ZSkuc3BsaXQocmVzcG9uc2VfdHlwZS5kZWxpbWl0ZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9kZXNbMF0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5vZGVzLmxlbmd0aCA+IDAgJiYgbm9kZXMubGVuZ3RoIDw9IHJlc3BvbnNlX3R5cGUubWF4KSB7XG4gICAgICAgIHRoaXMuY2hlY2tDb3JyZWN0UmVzcG9uc2VWYWx1ZShpbnRlcmFjdGlvbl90eXBlLCBub2RlcywgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChub2Rlcy5sZW5ndGggPiByZXNwb25zZV90eXBlLm1heCkge1xuICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuR0VORVJBTF9TRVRfRkFJTFVSRSxcbiAgICAgICAgICAgICdEYXRhIE1vZGVsIEVsZW1lbnQgUGF0dGVybiBUb28gTG9uZycpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5sYXN0RXJyb3JDb2RlID09PSAwICYmXG4gICAgICAgICAgKCFyZXNwb25zZV90eXBlLmR1cGxpY2F0ZSB8fFxuICAgICAgICAgICAgICAhdGhpcy5jaGVja0R1cGxpY2F0ZWRQYXR0ZXJuKGludGVyYWN0aW9uLmNvcnJlY3RfcmVzcG9uc2VzLFxuICAgICAgICAgICAgICAgICAgcGF0dGVybl9pbmRleCwgdmFsdWUpKSB8fFxuICAgICAgICAgICh0aGlzLmxhc3RFcnJvckNvZGUgPT09IDAgJiYgdmFsdWUgPT09ICcnKSkge1xuICAgICAgICAvLyBkbyBub3RoaW5nLCB3ZSB3YW50IHRoZSBpbnZlcnNlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5sYXN0RXJyb3JDb2RlID09PSAwKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUsXG4gICAgICAgICAgICAgICdEYXRhIE1vZGVsIEVsZW1lbnQgUGF0dGVybiBBbHJlYWR5IEV4aXN0cycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5HRU5FUkFMX1NFVF9GQUlMVVJFLFxuICAgICAgICAgICdEYXRhIE1vZGVsIEVsZW1lbnQgQ29sbGVjdGlvbiBMaW1pdCBSZWFjaGVkJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSB2YWx1ZSBmcm9tIHRoZSBDTUkgT2JqZWN0XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXRDTUlWYWx1ZShDTUlFbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbW1vbkdldENNSVZhbHVlKCdHZXRWYWx1ZScsIHRydWUsIENNSUVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1lc3NhZ2UgdGhhdCBjb3JyZXNwb25kcyB0byBlcnJvck51bWJlci5cbiAgICpcbiAgICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcil9IGVycm9yTnVtYmVyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZGV0YWlsXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldExtc0Vycm9yTWVzc2FnZURldGFpbHMoZXJyb3JOdW1iZXIsIGRldGFpbCkge1xuICAgIGxldCBiYXNpY01lc3NhZ2UgPSAnJztcbiAgICBsZXQgZGV0YWlsTWVzc2FnZSA9ICcnO1xuXG4gICAgLy8gU2V0IGVycm9yIG51bWJlciB0byBzdHJpbmcgc2luY2UgaW5jb25zaXN0ZW50IGZyb20gbW9kdWxlcyBpZiBzdHJpbmcgb3IgbnVtYmVyXG4gICAgZXJyb3JOdW1iZXIgPSBTdHJpbmcoZXJyb3JOdW1iZXIpO1xuICAgIGlmIChzY29ybTIwMDRfY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tlcnJvck51bWJlcl0pIHtcbiAgICAgIGJhc2ljTWVzc2FnZSA9IHNjb3JtMjAwNF9jb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW2Vycm9yTnVtYmVyXS5iYXNpY01lc3NhZ2U7XG4gICAgICBkZXRhaWxNZXNzYWdlID0gc2Nvcm0yMDA0X2NvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbZXJyb3JOdW1iZXJdLmRldGFpbE1lc3NhZ2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRldGFpbCA/IGRldGFpbE1lc3NhZ2UgOiBiYXNpY01lc3NhZ2U7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgdG8gc2VlIGlmIGEgY29ycmVjdF9yZXNwb25zZSB2YWx1ZSBoYXMgYmVlbiBkdXBsaWNhdGVkXG4gICAqIEBwYXJhbSB7Q01JQXJyYXl9IGNvcnJlY3RfcmVzcG9uc2VcbiAgICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRfaW5kZXhcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgY2hlY2tEdXBsaWNhdGVkUGF0dGVybiA9IChjb3JyZWN0X3Jlc3BvbnNlLCBjdXJyZW50X2luZGV4LCB2YWx1ZSkgPT4ge1xuICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgIGNvbnN0IGNvdW50ID0gY29ycmVjdF9yZXNwb25zZS5fY291bnQ7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudCAmJiAhZm91bmQ7IGkrKykge1xuICAgICAgaWYgKGkgIT09IGN1cnJlbnRfaW5kZXggJiYgY29ycmVjdF9yZXNwb25zZS5jaGlsZEFycmF5W2ldID09PSB2YWx1ZSkge1xuICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmb3VuZDtcbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2tzIGZvciBhIHZhbGlkIGNvcnJlY3RfcmVzcG9uc2UgdmFsdWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGludGVyYWN0aW9uX3R5cGVcbiAgICogQHBhcmFtIHtBcnJheX0gbm9kZXNcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKi9cbiAgY2hlY2tDb3JyZWN0UmVzcG9uc2VWYWx1ZShpbnRlcmFjdGlvbl90eXBlLCBub2RlcywgdmFsdWUpIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGNvcnJlY3RfcmVzcG9uc2VzW2ludGVyYWN0aW9uX3R5cGVdO1xuICAgIGNvbnN0IGZvcm1hdFJlZ2V4ID0gbmV3IFJlZ0V4cChyZXNwb25zZS5mb3JtYXQpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoICYmIHRoaXMubGFzdEVycm9yQ29kZSA9PT0gMDsgaSsrKSB7XG4gICAgICBpZiAoaW50ZXJhY3Rpb25fdHlwZS5tYXRjaChcbiAgICAgICAgICAnXihmaWxsLWlufGxvbmctZmlsbC1pbnxtYXRjaGluZ3xwZXJmb3JtYW5jZXxzZXF1ZW5jaW5nKSQnKSkge1xuICAgICAgICBub2Rlc1tpXSA9IHRoaXMucmVtb3ZlQ29ycmVjdFJlc3BvbnNlUHJlZml4ZXMobm9kZXNbaV0pO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzcG9uc2U/LmRlbGltaXRlcjIpIHtcbiAgICAgICAgY29uc3QgdmFsdWVzID0gbm9kZXNbaV0uc3BsaXQocmVzcG9uc2UuZGVsaW1pdGVyMik7XG4gICAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgY29uc3QgbWF0Y2hlcyA9IHZhbHVlc1swXS5tYXRjaChmb3JtYXRSZWdleCk7XG4gICAgICAgICAgaWYgKCFtYXRjaGVzKSB7XG4gICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghdmFsdWVzWzFdLm1hdGNoKG5ldyBSZWdFeHAocmVzcG9uc2UuZm9ybWF0MikpKSB7XG4gICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBtYXRjaGVzID0gbm9kZXNbaV0ubWF0Y2goZm9ybWF0UmVnZXgpO1xuICAgICAgICBpZiAoKCFtYXRjaGVzICYmIHZhbHVlICE9PSAnJykgfHxcbiAgICAgICAgICAgICghbWF0Y2hlcyAmJiBpbnRlcmFjdGlvbl90eXBlID09PSAndHJ1ZS1mYWxzZScpKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChpbnRlcmFjdGlvbl90eXBlID09PSAnbnVtZXJpYycgJiYgbm9kZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgaWYgKE51bWJlcihub2Rlc1swXSkgPiBOdW1iZXIobm9kZXNbMV0pKSB7XG4gICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG5vZGVzW2ldICE9PSAnJyAmJiByZXNwb25zZS51bmlxdWUpIHtcbiAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBpICYmIHRoaXMubGFzdEVycm9yQ29kZSA9PT0gMDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGVzW2ldID09PSBub2Rlc1tqXSkge1xuICAgICAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgcHJlZml4ZXMgZnJvbSBjb3JyZWN0X3Jlc3BvbnNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBub2RlXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICByZW1vdmVDb3JyZWN0UmVzcG9uc2VQcmVmaXhlcyhub2RlKSB7XG4gICAgbGV0IHNlZW5PcmRlciA9IGZhbHNlO1xuICAgIGxldCBzZWVuQ2FzZSA9IGZhbHNlO1xuICAgIGxldCBzZWVuTGFuZyA9IGZhbHNlO1xuXG4gICAgY29uc3QgcHJlZml4UmVnZXggPSBuZXcgUmVnRXhwKFxuICAgICAgICAnXih7KGxhbmd8Y2FzZV9tYXR0ZXJzfG9yZGVyX21hdHRlcnMpPShbXn1dKyl9KScpO1xuICAgIGxldCBtYXRjaGVzID0gbm9kZS5tYXRjaChwcmVmaXhSZWdleCk7XG4gICAgbGV0IGxhbmdNYXRjaGVzID0gbnVsbDtcbiAgICB3aGlsZSAobWF0Y2hlcykge1xuICAgICAgc3dpdGNoIChtYXRjaGVzWzJdKSB7XG4gICAgICAgIGNhc2UgJ2xhbmcnOlxuICAgICAgICAgIGxhbmdNYXRjaGVzID0gbm9kZS5tYXRjaChzY29ybTIwMDRfcmVnZXguQ01JTGFuZ2NyKTtcbiAgICAgICAgICBpZiAobGFuZ01hdGNoZXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGxhbmcgPSBsYW5nTWF0Y2hlc1szXTtcbiAgICAgICAgICAgIGlmIChsYW5nICE9PSB1bmRlZmluZWQgJiYgbGFuZy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgIGlmIChWYWxpZExhbmd1YWdlc1tsYW5nLnRvTG93ZXJDYXNlKCldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgc2VlbkxhbmcgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjYXNlX21hdHRlcnMnOlxuICAgICAgICAgIGlmICghc2VlbkxhbmcgJiYgIXNlZW5PcmRlciAmJiAhc2VlbkNhc2UpIHtcbiAgICAgICAgICAgIGlmIChtYXRjaGVzWzNdICE9PSAndHJ1ZScgJiYgbWF0Y2hlc1szXSAhPT0gJ2ZhbHNlJykge1xuICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2VlbkNhc2UgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdvcmRlcl9tYXR0ZXJzJzpcbiAgICAgICAgICBpZiAoIXNlZW5DYXNlICYmICFzZWVuTGFuZyAmJiAhc2Vlbk9yZGVyKSB7XG4gICAgICAgICAgICBpZiAobWF0Y2hlc1szXSAhPT0gJ3RydWUnICYmIG1hdGNoZXNbM10gIT09ICdmYWxzZScpIHtcbiAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHNlZW5PcmRlciA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBub2RlID0gbm9kZS5zdWJzdHIobWF0Y2hlc1sxXS5sZW5ndGgpO1xuICAgICAgbWF0Y2hlcyA9IG5vZGUubWF0Y2gocHJlZml4UmVnZXgpO1xuICAgIH1cblxuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgdGhlIHdob2xlIEFQSSB3aXRoIGFub3RoZXJcbiAgICogQHBhcmFtIHtTY29ybTIwMDRBUEl9IG5ld0FQSVxuICAgKi9cbiAgcmVwbGFjZVdpdGhBbm90aGVyU2Nvcm1BUEkobmV3QVBJKSB7XG4gICAgLy8gRGF0YSBNb2RlbFxuICAgIHRoaXMuY21pID0gbmV3QVBJLmNtaTtcbiAgICB0aGlzLmFkbCA9IG5ld0FQSS5hZGw7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBjbWkgb2JqZWN0IHRvIHRoZSBwcm9wZXIgZm9ybWF0IGZvciBMTVMgY29tbWl0XG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdGVybWluYXRlQ29tbWl0XG4gICAqIEByZXR1cm4ge29iamVjdHxBcnJheX1cbiAgICovXG4gIHJlbmRlckNvbW1pdENNSSh0ZXJtaW5hdGVDb21taXQ6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBjbWlFeHBvcnQgPSB0aGlzLnJlbmRlckNNSVRvSlNPTk9iamVjdCgpO1xuXG4gICAgaWYgKHRlcm1pbmF0ZUNvbW1pdCkge1xuICAgICAgY21pRXhwb3J0LmNtaS50b3RhbF90aW1lID0gdGhpcy5jbWkuZ2V0Q3VycmVudFRvdGFsVGltZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuICAgIGNvbnN0IGZsYXR0ZW5lZCA9IFV0aWxpdGllcy5mbGF0dGVuKGNtaUV4cG9ydCk7XG4gICAgc3dpdGNoICh0aGlzLnNldHRpbmdzLmRhdGFDb21taXRGb3JtYXQpIHtcbiAgICAgIGNhc2UgJ2ZsYXR0ZW5lZCc6XG4gICAgICAgIHJldHVybiBVdGlsaXRpZXMuZmxhdHRlbihjbWlFeHBvcnQpO1xuICAgICAgY2FzZSAncGFyYW1zJzpcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIGluIGZsYXR0ZW5lZCkge1xuICAgICAgICAgIGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGZsYXR0ZW5lZCwgaXRlbSkpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGAke2l0ZW19PSR7ZmxhdHRlbmVkW2l0ZW1dfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgY2FzZSAnanNvbic6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gY21pRXhwb3J0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBdHRlbXB0cyB0byBzdG9yZSB0aGUgZGF0YSB0byB0aGUgTE1TXG4gICAqXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gdGVybWluYXRlQ29tbWl0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHN0b3JlRGF0YSh0ZXJtaW5hdGVDb21taXQ6IGJvb2xlYW4pIHtcbiAgICBpZiAodGVybWluYXRlQ29tbWl0KSB7XG4gICAgICBpZiAodGhpcy5jbWkubW9kZSA9PT0gJ25vcm1hbCcpIHtcbiAgICAgICAgaWYgKHRoaXMuY21pLmNyZWRpdCA9PT0gJ2NyZWRpdCcpIHtcbiAgICAgICAgICBpZiAodGhpcy5jbWkuY29tcGxldGlvbl90aHJlc2hvbGQgJiYgdGhpcy5jbWkucHJvZ3Jlc3NfbWVhc3VyZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuY21pLnByb2dyZXNzX21lYXN1cmUgPj0gdGhpcy5jbWkuY29tcGxldGlvbl90aHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnU2V0dGluZyBDb21wbGV0aW9uIFN0YXR1czogQ29tcGxldGVkJyk7XG4gICAgICAgICAgICAgIHRoaXMuY21pLmNvbXBsZXRpb25fc3RhdHVzID0gJ2NvbXBsZXRlZCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdTZXR0aW5nIENvbXBsZXRpb24gU3RhdHVzOiBJbmNvbXBsZXRlJyk7XG4gICAgICAgICAgICAgIHRoaXMuY21pLmNvbXBsZXRpb25fc3RhdHVzID0gJ2luY29tcGxldGUnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5jbWkuc2NhbGVkX3Bhc3Npbmdfc2NvcmUgJiYgdGhpcy5jbWkuc2NvcmUuc2NhbGVkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbWkuc2NvcmUuc2NhbGVkID49IHRoaXMuY21pLnNjYWxlZF9wYXNzaW5nX3Njb3JlKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ1NldHRpbmcgU3VjY2VzcyBTdGF0dXM6IFBhc3NlZCcpO1xuICAgICAgICAgICAgICB0aGlzLmNtaS5zdWNjZXNzX3N0YXR1cyA9ICdwYXNzZWQnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnU2V0dGluZyBTdWNjZXNzIFN0YXR1czogRmFpbGVkJyk7XG4gICAgICAgICAgICAgIHRoaXMuY21pLnN1Y2Nlc3Nfc3RhdHVzID0gJ2ZhaWxlZCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IG5hdlJlcXVlc3QgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5hZGwubmF2LnJlcXVlc3QgIT09ICh0aGlzLnN0YXJ0aW5nRGF0YT8uYWRsPy5uYXY/LnJlcXVlc3QpICYmXG4gICAgICAgIHRoaXMuYWRsLm5hdi5yZXF1ZXN0ICE9PSAnX25vbmVfJykge1xuICAgICAgdGhpcy5hZGwubmF2LnJlcXVlc3QgPSBlbmNvZGVVUklDb21wb25lbnQodGhpcy5hZGwubmF2LnJlcXVlc3QpO1xuICAgICAgbmF2UmVxdWVzdCA9IHRydWU7XG4gICAgfVxuXG4gICAgY29uc3QgY29tbWl0T2JqZWN0ID0gdGhpcy5yZW5kZXJDb21taXRDTUkodGVybWluYXRlQ29tbWl0KTtcblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmxtc0NvbW1pdFVybCkge1xuICAgICAgaWYgKHRoaXMuYXBpTG9nTGV2ZWwgPT09IGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0RFQlVHKSB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ0NvbW1pdCAodGVybWluYXRlZDogJyArXG4gICAgICAgICAgICAodGVybWluYXRlQ29tbWl0ID8gJ3llcycgOiAnbm8nKSArICcpOiAnKTtcbiAgICAgICAgY29uc29sZS5kZWJ1Zyhjb21taXRPYmplY3QpO1xuICAgICAgfVxuICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5wcm9jZXNzSHR0cFJlcXVlc3QodGhpcy5zZXR0aW5ncy5sbXNDb21taXRVcmwsXG4gICAgICAgICAgY29tbWl0T2JqZWN0KTtcbiAgICAgIC8vIGNoZWNrIGlmIHRoaXMgaXMgYSBzZXF1ZW5jaW5nIGNhbGwsIGFuZCB0aGVuIGNhbGwgdGhlIG5lY2Vzc2FyeSBKU1xuICAgICAgaWYgKG5hdlJlcXVlc3QgJiYgcmVzdWx0Lm5hdlJlcXVlc3QgIT09IHVuZGVmaW5lZCAmJlxuICAgICAgICAgIHJlc3VsdC5uYXZSZXF1ZXN0ICE9PSAnJykge1xuICAgICAgICBGdW5jdGlvbihgXCJ1c2Ugc3RyaWN0XCI7KCgpID0+IHsgJHtyZXN1bHQubmF2UmVxdWVzdH0gfSkoKWApKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnQ29tbWl0ICh0ZXJtaW5hdGVkOiAnICtcbiAgICAgICAgICAodGVybWluYXRlQ29tbWl0ID8gJ3llcycgOiAnbm8nKSArICcpOiAnKTtcbiAgICAgIGNvbnNvbGUubG9nKGNvbW1pdE9iamVjdCk7XG4gICAgICByZXR1cm4gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgU2Nvcm0xMkNNSSBmcm9tICcuL3Njb3JtMTJfY21pJztcbmltcG9ydCB7QmFzZUNNSSwgQ01JQXJyYXksIENNSVNjb3JlfSBmcm9tICcuL2NvbW1vbic7XG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCBSZWdleCBmcm9tICcuLi9jb25zdGFudHMvcmVnZXgnO1xuaW1wb3J0IEVycm9yQ29kZXMgZnJvbSAnLi4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJztcbmltcG9ydCB7XG4gIGNoZWNrMTJWYWxpZEZvcm1hdCxcbiAgdGhyb3dSZWFkT25seUVycm9yLFxuICB0aHJvd1dyaXRlT25seUVycm9yLFxufSBmcm9tICcuL3Njb3JtMTJfY21pJztcblxuY29uc3QgYWljY19jb25zdGFudHMgPSBBUElDb25zdGFudHMuYWljYztcbmNvbnN0IGFpY2NfcmVnZXggPSBSZWdleC5haWNjO1xuY29uc3Qgc2Nvcm0xMl9lcnJvcl9jb2RlcyA9IEVycm9yQ29kZXMuc2Nvcm0xMjtcblxuLyoqXG4gKiBDTUkgQ2xhc3MgZm9yIEFJQ0NcbiAqL1xuZXhwb3J0IGNsYXNzIENNSSBleHRlbmRzIFNjb3JtMTJDTUkuQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIENNSSBvYmplY3RcbiAgICogQHBhcmFtIHtib29sZWFufSBpbml0aWFsaXplZFxuICAgKi9cbiAgY29uc3RydWN0b3IoaW5pdGlhbGl6ZWQ6IGJvb2xlYW4pIHtcbiAgICBzdXBlcihhaWNjX2NvbnN0YW50cy5jbWlfY2hpbGRyZW4pO1xuXG4gICAgaWYgKGluaXRpYWxpemVkKSB0aGlzLmluaXRpYWxpemUoKTtcblxuICAgIHRoaXMuc3R1ZGVudF9kYXRhID0gbmV3IEFJQ0NDTUlTdHVkZW50RGF0YSgpO1xuICAgIHRoaXMuZXZhbHVhdGlvbiA9IG5ldyBDTUlFdmFsdWF0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc3R1ZGVudF9kYXRhPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5ldmFsdWF0aW9uPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWlcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBzdXNwZW5kX2RhdGE6IHN0cmluZyxcbiAgICogICAgICBsYXVuY2hfZGF0YTogc3RyaW5nLFxuICAgKiAgICAgIGNvbW1lbnRzOiBzdHJpbmcsXG4gICAqICAgICAgY29tbWVudHNfZnJvbV9sbXM6IHN0cmluZyxcbiAgICogICAgICBjb3JlOiBDTUlDb3JlLFxuICAgKiAgICAgIG9iamVjdGl2ZXM6IENNSU9iamVjdGl2ZXMsXG4gICAqICAgICAgc3R1ZGVudF9kYXRhOiBDTUlTdHVkZW50RGF0YSxcbiAgICogICAgICBzdHVkZW50X3ByZWZlcmVuY2U6IENNSVN0dWRlbnRQcmVmZXJlbmNlLFxuICAgKiAgICAgIGludGVyYWN0aW9uczogQ01JSW50ZXJhY3Rpb25zXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdzdXNwZW5kX2RhdGEnOiB0aGlzLnN1c3BlbmRfZGF0YSxcbiAgICAgICdsYXVuY2hfZGF0YSc6IHRoaXMubGF1bmNoX2RhdGEsXG4gICAgICAnY29tbWVudHMnOiB0aGlzLmNvbW1lbnRzLFxuICAgICAgJ2NvbW1lbnRzX2Zyb21fbG1zJzogdGhpcy5jb21tZW50c19mcm9tX2xtcyxcbiAgICAgICdjb3JlJzogdGhpcy5jb3JlLFxuICAgICAgJ29iamVjdGl2ZXMnOiB0aGlzLm9iamVjdGl2ZXMsXG4gICAgICAnc3R1ZGVudF9kYXRhJzogdGhpcy5zdHVkZW50X2RhdGEsXG4gICAgICAnc3R1ZGVudF9wcmVmZXJlbmNlJzogdGhpcy5zdHVkZW50X3ByZWZlcmVuY2UsXG4gICAgICAnaW50ZXJhY3Rpb25zJzogdGhpcy5pbnRlcmFjdGlvbnMsXG4gICAgICAnZXZhbHVhdGlvbic6IHRoaXMuZXZhbHVhdGlvbixcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIEFJQ0MgRXZhbHVhdGlvbiBvYmplY3RcbiAqL1xuY2xhc3MgQ01JRXZhbHVhdGlvbiBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEFJQ0MgRXZhbHVhdGlvbiBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmNvbW1lbnRzID0gbmV3IENNSUV2YWx1YXRpb25Db21tZW50cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmNvbW1lbnRzPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuZXZhbHVhdGlvbiBvYmplY3RcbiAgICogQHJldHVybiB7e2NvbW1lbnRzOiBDTUlFdmFsdWF0aW9uQ29tbWVudHN9fVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2NvbW1lbnRzJzogdGhpcy5jb21tZW50cyxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBBSUNDJ3MgY21pLmV2YWx1YXRpb24uY29tbWVudHMgb2JqZWN0XG4gKi9cbmNsYXNzIENNSUV2YWx1YXRpb25Db21tZW50cyBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIEV2YWx1YXRpb24gQ29tbWVudHMgb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihhaWNjX2NvbnN0YW50cy5jb21tZW50c19jaGlsZHJlbixcbiAgICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSk7XG4gIH1cbn1cblxuLyoqXG4gKiBTdHVkZW50RGF0YSBjbGFzcyBmb3IgQUlDQ1xuICovXG5jbGFzcyBBSUNDQ01JU3R1ZGVudERhdGEgZXh0ZW5kcyBTY29ybTEyQ01JLkNNSVN0dWRlbnREYXRhIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIFN0dWRlbnREYXRhIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoYWljY19jb25zdGFudHMuc3R1ZGVudF9kYXRhX2NoaWxkcmVuKTtcblxuICAgIHRoaXMudHJpZXMgPSBuZXcgQ01JVHJpZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy50cmllcz8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgI3RyaWVzX2R1cmluZ19sZXNzb24gPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciB0cmllc19kdXJpbmdfbGVzc29uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0cmllc19kdXJpbmdfbGVzc29uKCkge1xuICAgIHJldHVybiB0aGlzLiN0cmllc19kdXJpbmdfbGVzc29uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RyaWVzX2R1cmluZ19sZXNzb24uIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0cmllc19kdXJpbmdfbGVzc29uXG4gICAqL1xuICBzZXQgdHJpZXNfZHVyaW5nX2xlc3Nvbih0cmllc19kdXJpbmdfbGVzc29uKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiN0cmllc19kdXJpbmdfbGVzc29uID0gdHJpZXNfZHVyaW5nX2xlc3NvbiA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLnN0dWRlbnRfZGF0YSBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBtYXN0ZXJ5X3Njb3JlOiBzdHJpbmcsXG4gICAqICAgICAgbWF4X3RpbWVfYWxsb3dlZDogc3RyaW5nLFxuICAgKiAgICAgIHRpbWVfbGltaXRfYWN0aW9uOiBzdHJpbmcsXG4gICAqICAgICAgdHJpZXM6IENNSVRyaWVzXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdtYXN0ZXJ5X3Njb3JlJzogdGhpcy5tYXN0ZXJ5X3Njb3JlLFxuICAgICAgJ21heF90aW1lX2FsbG93ZWQnOiB0aGlzLm1heF90aW1lX2FsbG93ZWQsXG4gICAgICAndGltZV9saW1pdF9hY3Rpb24nOiB0aGlzLnRpbWVfbGltaXRfYWN0aW9uLFxuICAgICAgJ3RyaWVzJzogdGhpcy50cmllcyxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyB0aGUgQUlDQyBjbWkuc3R1ZGVudF9kYXRhLnRyaWVzIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JVHJpZXMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgaW5saW5lIFRyaWVzIEFycmF5IGNsYXNzXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihhaWNjX2NvbnN0YW50cy50cmllc19jaGlsZHJlbik7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgQUlDQyBUcmllc1xuICovXG5leHBvcnQgY2xhc3MgQ01JVHJpZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIFRyaWVzIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc2NvcmUgPSBuZXcgQ01JU2NvcmUoXG4gICAgICAgIHtcbiAgICAgICAgICBzY29yZV9jaGlsZHJlbjogYWljY19jb25zdGFudHMuc2NvcmVfY2hpbGRyZW4sXG4gICAgICAgICAgc2NvcmVfcmFuZ2U6IGFpY2NfcmVnZXguc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgaW52YWxpZEVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgICAgICBpbnZhbGlkVHlwZUNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCxcbiAgICAgICAgICBpbnZhbGlkUmFuZ2VDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRSxcbiAgICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc2NvcmU/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICNzdGF0dXMgPSAnJztcbiAgI3RpbWUgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3RhdHVzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0YXR1c1xuICAgKi9cbiAgc2V0IHN0YXR1cyhzdGF0dXMpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHN0YXR1cywgYWljY19yZWdleC5DTUlTdGF0dXMyKSkge1xuICAgICAgdGhpcy4jc3RhdHVzID0gc3RhdHVzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0aW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lKCkge1xuICAgIHJldHVybiB0aGlzLiN0aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVcbiAgICovXG4gIHNldCB0aW1lKHRpbWUpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHRpbWUsIGFpY2NfcmVnZXguQ01JVGltZSkpIHtcbiAgICAgIHRoaXMuI3RpbWUgPSB0aW1lO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5zdHVkZW50X2RhdGEudHJpZXMubiBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBzdGF0dXM6IHN0cmluZyxcbiAgICogICAgICB0aW1lOiBzdHJpbmcsXG4gICAqICAgICAgc2NvcmU6IENNSVNjb3JlXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdzdGF0dXMnOiB0aGlzLnN0YXR1cyxcbiAgICAgICd0aW1lJzogdGhpcy50aW1lLFxuICAgICAgJ3Njb3JlJzogdGhpcy5zY29yZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBBSUNDIEV2YWx1YXRpb24gQ29tbWVudHNcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUV2YWx1YXRpb25Db21tZW50c09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEV2YWx1YXRpb24gQ29tbWVudHNcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAjY29udGVudCA9ICcnO1xuICAjbG9jYXRpb24gPSAnJztcbiAgI3RpbWUgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29udGVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29udGVudCgpIHtcbiAgICByZXR1cm4gdGhpcy4jY29udGVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb250ZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50XG4gICAqL1xuICBzZXQgY29udGVudChjb250ZW50KSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChjb250ZW50LCBhaWNjX3JlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI2NvbnRlbnQgPSBjb250ZW50O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsb2NhdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xvY2F0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xvY2F0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvblxuICAgKi9cbiAgc2V0IGxvY2F0aW9uKGxvY2F0aW9uKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChsb2NhdGlvbiwgYWljY19yZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiNsb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0aW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lKCkge1xuICAgIHJldHVybiB0aGlzLiN0aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRpbmcgZm9yICN0aW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lXG4gICAqL1xuICBzZXQgdGltZSh0aW1lKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh0aW1lLCBhaWNjX3JlZ2V4LkNNSVRpbWUpKSB7XG4gICAgICB0aGlzLiN0aW1lID0gdGltZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuZXZhdWxhdGlvbi5jb21tZW50cy5uIG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGNvbnRlbnQ6IHN0cmluZyxcbiAgICogICAgICBsb2NhdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIHRpbWU6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnY29udGVudCc6IHRoaXMuY29udGVudCxcbiAgICAgICdsb2NhdGlvbic6IHRoaXMubG9jYXRpb24sXG4gICAgICAndGltZSc6IHRoaXMudGltZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCBBUElDb25zdGFudHMgZnJvbSAnLi4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuaW1wb3J0IEVycm9yQ29kZXMgZnJvbSAnLi4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJztcbmltcG9ydCB7VmFsaWRhdGlvbkVycm9yfSBmcm9tICcuLi9leGNlcHRpb25zJztcbmltcG9ydCBSZWdleCBmcm9tICcuLi9jb25zdGFudHMvcmVnZXgnO1xuXG5jb25zdCBzY29ybTEyX2NvbnN0YW50cyA9IEFQSUNvbnN0YW50cy5zY29ybTEyO1xuY29uc3Qgc2Nvcm0xMl9yZWdleCA9IFJlZ2V4LnNjb3JtMTI7XG5jb25zdCBzY29ybTEyX2Vycm9yX2NvZGVzID0gRXJyb3JDb2Rlcy5zY29ybTEyO1xuXG4vKipcbiAqIENoZWNrIGlmIHRoZSB2YWx1ZSBtYXRjaGVzIHRoZSBwcm9wZXIgZm9ybWF0LiBJZiBub3QsIHRocm93IHByb3BlciBlcnJvciBjb2RlLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9IHJlZ2V4UGF0dGVyblxuICogQHBhcmFtIHtudW1iZXJ9IGVycm9yQ29kZVxuICogQHBhcmFtIHtib29sZWFufSBhbGxvd0VtcHR5U3RyaW5nXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tWYWxpZEZvcm1hdChcbiAgICB2YWx1ZTogU3RyaW5nLFxuICAgIHJlZ2V4UGF0dGVybjogU3RyaW5nLFxuICAgIGVycm9yQ29kZTogbnVtYmVyLFxuICAgIGFsbG93RW1wdHlTdHJpbmc/OiBib29sZWFuKSB7XG4gIGNvbnN0IGZvcm1hdFJlZ2V4ID0gbmV3IFJlZ0V4cChyZWdleFBhdHRlcm4pO1xuICBjb25zdCBtYXRjaGVzID0gdmFsdWUubWF0Y2goZm9ybWF0UmVnZXgpO1xuICBpZiAoYWxsb3dFbXB0eVN0cmluZyAmJiB2YWx1ZSA9PT0gJycpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCB8fCAhbWF0Y2hlcyB8fCBtYXRjaGVzWzBdID09PSAnJykge1xuICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoZXJyb3JDb2RlKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgdmFsdWUgbWF0Y2hlcyB0aGUgcHJvcGVyIHJhbmdlLiBJZiBub3QsIHRocm93IHByb3BlciBlcnJvciBjb2RlLlxuICpcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSByYW5nZVBhdHRlcm5cbiAqIEBwYXJhbSB7bnVtYmVyfSBlcnJvckNvZGVcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1ZhbGlkUmFuZ2UoXG4gICAgdmFsdWU6IGFueSwgcmFuZ2VQYXR0ZXJuOiBTdHJpbmcsIGVycm9yQ29kZTogbnVtYmVyKSB7XG4gIGNvbnN0IHJhbmdlcyA9IHJhbmdlUGF0dGVybi5zcGxpdCgnIycpO1xuICB2YWx1ZSA9IHZhbHVlICogMS4wO1xuICBpZiAodmFsdWUgPj0gcmFuZ2VzWzBdKSB7XG4gICAgaWYgKChyYW5nZXNbMV0gPT09ICcqJykgfHwgKHZhbHVlIDw9IHJhbmdlc1sxXSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKGVycm9yQ29kZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoZXJyb3JDb2RlKTtcbiAgfVxufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIEFQSSBjbWkgb2JqZWN0c1xuICovXG5leHBvcnQgY2xhc3MgQmFzZUNNSSB7XG4gIGpzb25TdHJpbmcgPSBmYWxzZTtcbiAgI2luaXRpYWxpemVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBCYXNlQ01JLCBqdXN0IG1hcmtzIHRoZSBjbGFzcyBhcyBhYnN0cmFjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKG5ldy50YXJnZXQgPT09IEJhc2VDTUkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb25zdHJ1Y3QgQmFzZUNNSSBpbnN0YW5jZXMgZGlyZWN0bHknKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaW5pdGlhbGl6ZWRcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGdldCBpbml0aWFsaXplZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jaW5pdGlhbGl6ZWQ7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgdGhpcy4jaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgY21pICouc2NvcmUgb2JqZWN0c1xuICovXG5leHBvcnQgY2xhc3MgQ01JU2NvcmUgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciAqLnNjb3JlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY29yZV9jaGlsZHJlblxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NvcmVfcmFuZ2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1heFxuICAgKiBAcGFyYW0ge251bWJlcn0gaW52YWxpZEVycm9yQ29kZVxuICAgKiBAcGFyYW0ge251bWJlcn0gaW52YWxpZFR5cGVDb2RlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbnZhbGlkUmFuZ2VDb2RlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBkZWNpbWFsUmVnZXhcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgICAge1xuICAgICAgICBzY29yZV9jaGlsZHJlbixcbiAgICAgICAgc2NvcmVfcmFuZ2UsXG4gICAgICAgIG1heCxcbiAgICAgICAgaW52YWxpZEVycm9yQ29kZSxcbiAgICAgICAgaW52YWxpZFR5cGVDb2RlLFxuICAgICAgICBpbnZhbGlkUmFuZ2VDb2RlLFxuICAgICAgICBkZWNpbWFsUmVnZXgsXG4gICAgICB9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuI19jaGlsZHJlbiA9IHNjb3JlX2NoaWxkcmVuIHx8XG4gICAgICAgIHNjb3JtMTJfY29uc3RhbnRzLnNjb3JlX2NoaWxkcmVuO1xuICAgIHRoaXMuI19zY29yZV9yYW5nZSA9ICFzY29yZV9yYW5nZSA/IGZhbHNlIDogc2Nvcm0xMl9yZWdleC5zY29yZV9yYW5nZTtcbiAgICB0aGlzLiNtYXggPSAobWF4IHx8IG1heCA9PT0gJycpID8gbWF4IDogJzEwMCc7XG4gICAgdGhpcy4jX2ludmFsaWRfZXJyb3JfY29kZSA9IGludmFsaWRFcnJvckNvZGUgfHxcbiAgICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRTtcbiAgICB0aGlzLiNfaW52YWxpZF90eXBlX2NvZGUgPSBpbnZhbGlkVHlwZUNvZGUgfHxcbiAgICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIO1xuICAgIHRoaXMuI19pbnZhbGlkX3JhbmdlX2NvZGUgPSBpbnZhbGlkUmFuZ2VDb2RlIHx8XG4gICAgICAgIHNjb3JtMTJfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFO1xuICAgIHRoaXMuI19kZWNpbWFsX3JlZ2V4ID0gZGVjaW1hbFJlZ2V4IHx8XG4gICAgICAgIHNjb3JtMTJfcmVnZXguQ01JRGVjaW1hbDtcbiAgfVxuXG4gICNfY2hpbGRyZW47XG4gICNfc2NvcmVfcmFuZ2U7XG4gICNfaW52YWxpZF9lcnJvcl9jb2RlO1xuICAjX2ludmFsaWRfdHlwZV9jb2RlO1xuICAjX2ludmFsaWRfcmFuZ2VfY29kZTtcbiAgI19kZWNpbWFsX3JlZ2V4O1xuICAjcmF3ID0gJyc7XG4gICNtaW4gPSAnJztcbiAgI21heDtcblxuICAvKipcbiAgICogR2V0dGVyIGZvciBfY2hpbGRyZW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IF9jaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHRoaXMuI19pbnZhbGlkX2Vycm9yX2NvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3Jhd1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgcmF3KCkge1xuICAgIHJldHVybiB0aGlzLiNyYXc7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcmF3XG4gICAqIEBwYXJhbSB7c3RyaW5nfSByYXdcbiAgICovXG4gIHNldCByYXcocmF3KSB7XG4gICAgaWYgKGNoZWNrVmFsaWRGb3JtYXQocmF3LCB0aGlzLiNfZGVjaW1hbF9yZWdleCxcbiAgICAgICAgdGhpcy4jX2ludmFsaWRfdHlwZV9jb2RlKSAmJlxuICAgICAgICAoIXRoaXMuI19zY29yZV9yYW5nZSB8fFxuICAgICAgICAgICAgY2hlY2tWYWxpZFJhbmdlKHJhdywgdGhpcy4jX3Njb3JlX3JhbmdlLFxuICAgICAgICAgICAgICAgIHRoaXMuI19pbnZhbGlkX3JhbmdlX2NvZGUpKSkge1xuICAgICAgdGhpcy4jcmF3ID0gcmF3O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNtaW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1pbigpIHtcbiAgICByZXR1cm4gdGhpcy4jbWluO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI21pblxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWluXG4gICAqL1xuICBzZXQgbWluKG1pbikge1xuICAgIGlmIChjaGVja1ZhbGlkRm9ybWF0KG1pbiwgdGhpcy4jX2RlY2ltYWxfcmVnZXgsXG4gICAgICAgIHRoaXMuI19pbnZhbGlkX3R5cGVfY29kZSkgJiZcbiAgICAgICAgKCF0aGlzLiNfc2NvcmVfcmFuZ2UgfHxcbiAgICAgICAgICAgIGNoZWNrVmFsaWRSYW5nZShtaW4sIHRoaXMuI19zY29yZV9yYW5nZSxcbiAgICAgICAgICAgICAgICB0aGlzLiNfaW52YWxpZF9yYW5nZV9jb2RlKSkpIHtcbiAgICAgIHRoaXMuI21pbiA9IG1pbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbWF4XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBtYXgoKSB7XG4gICAgcmV0dXJuIHRoaXMuI21heDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNtYXhcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1heFxuICAgKi9cbiAgc2V0IG1heChtYXgpIHtcbiAgICBpZiAoY2hlY2tWYWxpZEZvcm1hdChtYXgsIHRoaXMuI19kZWNpbWFsX3JlZ2V4LFxuICAgICAgICB0aGlzLiNfaW52YWxpZF90eXBlX2NvZGUpICYmXG4gICAgICAgICghdGhpcy4jX3Njb3JlX3JhbmdlIHx8XG4gICAgICAgICAgICBjaGVja1ZhbGlkUmFuZ2UobWF4LCB0aGlzLiNfc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgICAgICAgdGhpcy4jX2ludmFsaWRfcmFuZ2VfY29kZSkpKSB7XG4gICAgICB0aGlzLiNtYXggPSBtYXg7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgKi5zY29yZVxuICAgKiBAcmV0dXJuIHt7bWluOiBzdHJpbmcsIG1heDogc3RyaW5nLCByYXc6IHN0cmluZ319XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAncmF3JzogdGhpcy5yYXcsXG4gICAgICAnbWluJzogdGhpcy5taW4sXG4gICAgICAnbWF4JzogdGhpcy5tYXgsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBjbWkgKi5uIG9iamVjdHNcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUFycmF5IGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBjbWkgKi5uIGFycmF5c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY2hpbGRyZW5cbiAgICogQHBhcmFtIHtudW1iZXJ9IGVycm9yQ29kZVxuICAgKi9cbiAgY29uc3RydWN0b3Ioe2NoaWxkcmVuLCBlcnJvckNvZGV9KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLiNfY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICB0aGlzLiNlcnJvckNvZGUgPSBlcnJvckNvZGU7XG4gICAgdGhpcy5jaGlsZEFycmF5ID0gW107XG4gIH1cblxuICAjZXJyb3JDb2RlO1xuICAjX2NoaWxkcmVuO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIF9jaGlsZHJlblxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IF9jaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHRoaXMuI2Vycm9yQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciBfY291bnRcbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cbiAgZ2V0IF9jb3VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5jaGlsZEFycmF5Lmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yIF9jb3VudC4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBfY291bnRcbiAgICovXG4gIHNldCBfY291bnQoX2NvdW50KSB7XG4gICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcih0aGlzLiNlcnJvckNvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgKi5uIGFycmF5c1xuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7fTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0W2kgKyAnJ10gPSB0aGlzLmNoaWxkQXJyYXlbaV07XG4gICAgfVxuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCB7XG4gIEJhc2VDTUksXG4gIGNoZWNrVmFsaWRGb3JtYXQsXG4gIGNoZWNrVmFsaWRSYW5nZSxcbiAgQ01JQXJyYXksXG4gIENNSVNjb3JlLFxufSBmcm9tICcuL2NvbW1vbic7XG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCBFcnJvckNvZGVzIGZyb20gJy4uL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQgUmVnZXggZnJvbSAnLi4vY29uc3RhbnRzL3JlZ2V4JztcbmltcG9ydCB7VmFsaWRhdGlvbkVycm9yfSBmcm9tICcuLi9leGNlcHRpb25zJztcbmltcG9ydCAqIGFzIFV0aWxpdGllcyBmcm9tICcuLi91dGlsaXRpZXMnO1xuXG5jb25zdCBzY29ybTEyX2NvbnN0YW50cyA9IEFQSUNvbnN0YW50cy5zY29ybTEyO1xuY29uc3Qgc2Nvcm0xMl9yZWdleCA9IFJlZ2V4LnNjb3JtMTI7XG5jb25zdCBzY29ybTEyX2Vycm9yX2NvZGVzID0gRXJyb3JDb2Rlcy5zY29ybTEyO1xuXG4vKipcbiAqIEhlbHBlciBtZXRob2QgZm9yIHRocm93aW5nIFJlYWQgT25seSBlcnJvclxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dSZWFkT25seUVycm9yKCkge1xuICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHNjb3JtMTJfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQpO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QgZm9yIHRocm93aW5nIFdyaXRlIE9ubHkgZXJyb3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93V3JpdGVPbmx5RXJyb3IoKSB7XG4gIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3Ioc2Nvcm0xMl9lcnJvcl9jb2Rlcy5XUklURV9PTkxZX0VMRU1FTlQpO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QgZm9yIHRocm93aW5nIEludmFsaWQgU2V0IGVycm9yXG4gKi9cbmZ1bmN0aW9uIHRocm93SW52YWxpZFZhbHVlRXJyb3IoKSB7XG4gIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3Ioc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCwgbm8gcmVhc29uIHRvIGhhdmUgdG8gcGFzcyB0aGUgc2FtZSBlcnJvciBjb2RlcyBldmVyeSB0aW1lXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVnZXhQYXR0ZXJuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGFsbG93RW1wdHlTdHJpbmdcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVjazEyVmFsaWRGb3JtYXQoXG4gICAgdmFsdWU6IFN0cmluZyxcbiAgICByZWdleFBhdHRlcm46IFN0cmluZyxcbiAgICBhbGxvd0VtcHR5U3RyaW5nPzogYm9vbGVhbikge1xuICByZXR1cm4gY2hlY2tWYWxpZEZvcm1hdCh2YWx1ZSwgcmVnZXhQYXR0ZXJuLFxuICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENILCBhbGxvd0VtcHR5U3RyaW5nKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kLCBubyByZWFzb24gdG8gaGF2ZSB0byBwYXNzIHRoZSBzYW1lIGVycm9yIGNvZGVzIGV2ZXJ5IHRpbWVcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSByYW5nZVBhdHRlcm5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWxsb3dFbXB0eVN0cmluZ1xuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrMTJWYWxpZFJhbmdlKFxuICAgIHZhbHVlOiBhbnksXG4gICAgcmFuZ2VQYXR0ZXJuOiBTdHJpbmcsXG4gICAgYWxsb3dFbXB0eVN0cmluZz86IGJvb2xlYW4pIHtcbiAgcmV0dXJuIGNoZWNrVmFsaWRSYW5nZSh2YWx1ZSwgcmFuZ2VQYXR0ZXJuLFxuICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0UsIGFsbG93RW1wdHlTdHJpbmcpO1xufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyB0aGUgY21pIG9iamVjdCBmb3IgU0NPUk0gMS4yXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUkgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI19jaGlsZHJlbiA9ICcnO1xuICAjX3ZlcnNpb24gPSAnMy40JztcbiAgI3N1c3BlbmRfZGF0YSA9ICcnO1xuICAjbGF1bmNoX2RhdGEgPSAnJztcbiAgI2NvbW1lbnRzID0gJyc7XG4gICNjb21tZW50c19mcm9tX2xtcyA9ICcnO1xuXG4gIHN0dWRlbnRfZGF0YSA9IG51bGw7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciB0aGUgU0NPUk0gMS4yIGNtaSBvYmplY3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNtaV9jaGlsZHJlblxuICAgKiBAcGFyYW0geyhDTUlTdHVkZW50RGF0YXxBSUNDQ01JU3R1ZGVudERhdGEpfSBzdHVkZW50X2RhdGFcbiAgICogQHBhcmFtIHtib29sZWFufSBpbml0aWFsaXplZFxuICAgKi9cbiAgY29uc3RydWN0b3IoY21pX2NoaWxkcmVuLCBzdHVkZW50X2RhdGEsIGluaXRpYWxpemVkOiBib29sZWFuKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGlmIChpbml0aWFsaXplZCkgdGhpcy5pbml0aWFsaXplKCk7XG5cbiAgICB0aGlzLiNfY2hpbGRyZW4gPSBjbWlfY2hpbGRyZW4gPyBjbWlfY2hpbGRyZW4gOiBzY29ybTEyX2NvbnN0YW50cy5jbWlfY2hpbGRyZW47XG4gICAgdGhpcy5jb3JlID0gbmV3IENNSUNvcmUoKTtcbiAgICB0aGlzLm9iamVjdGl2ZXMgPSBuZXcgQ01JT2JqZWN0aXZlcygpO1xuICAgIHRoaXMuc3R1ZGVudF9kYXRhID0gc3R1ZGVudF9kYXRhID8gc3R1ZGVudF9kYXRhIDogbmV3IENNSVN0dWRlbnREYXRhKCk7XG4gICAgdGhpcy5zdHVkZW50X3ByZWZlcmVuY2UgPSBuZXcgQ01JU3R1ZGVudFByZWZlcmVuY2UoKTtcbiAgICB0aGlzLmludGVyYWN0aW9ucyA9IG5ldyBDTUlJbnRlcmFjdGlvbnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5jb3JlPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5vYmplY3RpdmVzPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zdHVkZW50X2RhdGE/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnN0dWRlbnRfcHJlZmVyZW5jZT8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWlcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBzdXNwZW5kX2RhdGE6IHN0cmluZyxcbiAgICogICAgICBsYXVuY2hfZGF0YTogc3RyaW5nLFxuICAgKiAgICAgIGNvbW1lbnRzOiBzdHJpbmcsXG4gICAqICAgICAgY29tbWVudHNfZnJvbV9sbXM6IHN0cmluZyxcbiAgICogICAgICBjb3JlOiBDTUlDb3JlLFxuICAgKiAgICAgIG9iamVjdGl2ZXM6IENNSU9iamVjdGl2ZXMsXG4gICAqICAgICAgc3R1ZGVudF9kYXRhOiBDTUlTdHVkZW50RGF0YSxcbiAgICogICAgICBzdHVkZW50X3ByZWZlcmVuY2U6IENNSVN0dWRlbnRQcmVmZXJlbmNlLFxuICAgKiAgICAgIGludGVyYWN0aW9uczogQ01JSW50ZXJhY3Rpb25zXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdzdXNwZW5kX2RhdGEnOiB0aGlzLnN1c3BlbmRfZGF0YSxcbiAgICAgICdsYXVuY2hfZGF0YSc6IHRoaXMubGF1bmNoX2RhdGEsXG4gICAgICAnY29tbWVudHMnOiB0aGlzLmNvbW1lbnRzLFxuICAgICAgJ2NvbW1lbnRzX2Zyb21fbG1zJzogdGhpcy5jb21tZW50c19mcm9tX2xtcyxcbiAgICAgICdjb3JlJzogdGhpcy5jb3JlLFxuICAgICAgJ29iamVjdGl2ZXMnOiB0aGlzLm9iamVjdGl2ZXMsXG4gICAgICAnc3R1ZGVudF9kYXRhJzogdGhpcy5zdHVkZW50X2RhdGEsXG4gICAgICAnc3R1ZGVudF9wcmVmZXJlbmNlJzogdGhpcy5zdHVkZW50X3ByZWZlcmVuY2UsXG4gICAgICAnaW50ZXJhY3Rpb25zJzogdGhpcy5pbnRlcmFjdGlvbnMsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX3ZlcnNpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IF92ZXJzaW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNfdmVyc2lvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfdmVyc2lvbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfdmVyc2lvblxuICAgKi9cbiAgc2V0IF92ZXJzaW9uKF92ZXJzaW9uKSB7XG4gICAgdGhyb3dJbnZhbGlkVmFsdWVFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI19jaGlsZHJlblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX3ZlcnNpb24uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX2NoaWxkcmVuXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93SW52YWxpZFZhbHVlRXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdXNwZW5kX2RhdGFcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN1c3BlbmRfZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy4jc3VzcGVuZF9kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N1c3BlbmRfZGF0YVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3VzcGVuZF9kYXRhXG4gICAqL1xuICBzZXQgc3VzcGVuZF9kYXRhKHN1c3BlbmRfZGF0YSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoc3VzcGVuZF9kYXRhLCBzY29ybTEyX3JlZ2V4LkNNSVN0cmluZzQwOTYsIHRydWUpKSB7XG4gICAgICB0aGlzLiNzdXNwZW5kX2RhdGEgPSBzdXNwZW5kX2RhdGE7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xhdW5jaF9kYXRhXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsYXVuY2hfZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGF1bmNoX2RhdGE7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGF1bmNoX2RhdGEuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGF1bmNoX2RhdGFcbiAgICovXG4gIHNldCBsYXVuY2hfZGF0YShsYXVuY2hfZGF0YSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jbGF1bmNoX2RhdGEgPSBsYXVuY2hfZGF0YSA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NvbW1lbnRzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb21tZW50cygpIHtcbiAgICByZXR1cm4gdGhpcy4jY29tbWVudHM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29tbWVudHNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbW1lbnRzXG4gICAqL1xuICBzZXQgY29tbWVudHMoY29tbWVudHMpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGNvbW1lbnRzLCBzY29ybTEyX3JlZ2V4LkNNSVN0cmluZzQwOTYpKSB7XG4gICAgICB0aGlzLiNjb21tZW50cyA9IGNvbW1lbnRzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb21tZW50c19mcm9tX2xtc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29tbWVudHNfZnJvbV9sbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbW1lbnRzX2Zyb21fbG1zO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbW1lbnRzX2Zyb21fbG1zLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbW1lbnRzX2Zyb21fbG1zXG4gICAqL1xuICBzZXQgY29tbWVudHNfZnJvbV9sbXMoY29tbWVudHNfZnJvbV9sbXMpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2NvbW1lbnRzX2Zyb21fbG1zID0gY29tbWVudHNfZnJvbV9sbXMgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHRoZSBjdXJyZW50IHNlc3Npb24gdGltZSB0byB0aGUgZXhpc3RpbmcgdG90YWwgdGltZS5cbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0Q3VycmVudFRvdGFsVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb3JlLmdldEN1cnJlbnRUb3RhbFRpbWUoKTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyB0aGUgY21pLmNvcmUgb2JqZWN0XG4gKiBAZXh0ZW5kcyBCYXNlQ01JXG4gKi9cbmNsYXNzIENNSUNvcmUgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuY29yZVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc2NvcmUgPSBuZXcgQ01JU2NvcmUoXG4gICAgICAgIHtcbiAgICAgICAgICBzY29yZV9jaGlsZHJlbjogc2Nvcm0xMl9jb25zdGFudHMuc2NvcmVfY2hpbGRyZW4sXG4gICAgICAgICAgc2NvcmVfcmFuZ2U6IHNjb3JtMTJfcmVnZXguc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgaW52YWxpZEVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgICAgICBpbnZhbGlkVHlwZUNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCxcbiAgICAgICAgICBpbnZhbGlkUmFuZ2VDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRSxcbiAgICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc2NvcmU/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICNfY2hpbGRyZW4gPSBzY29ybTEyX2NvbnN0YW50cy5jb3JlX2NoaWxkcmVuO1xuICAjc3R1ZGVudF9pZCA9ICcnO1xuICAjc3R1ZGVudF9uYW1lID0gJyc7XG4gICNsZXNzb25fbG9jYXRpb24gPSAnJztcbiAgI2NyZWRpdCA9ICcnO1xuICAjbGVzc29uX3N0YXR1cyA9ICdub3QgYXR0ZW1wdGVkJztcbiAgI2VudHJ5ID0gJyc7XG4gICN0b3RhbF90aW1lID0gJyc7XG4gICNsZXNzb25fbW9kZSA9ICdub3JtYWwnO1xuICAjZXhpdCA9ICcnO1xuICAjc2Vzc2lvbl90aW1lID0gJzAwOjAwOjAwJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX2NoaWxkcmVuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX2NoaWxkcmVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93SW52YWxpZFZhbHVlRXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdHVkZW50X2lkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdHVkZW50X2lkKCkge1xuICAgIHJldHVybiB0aGlzLiNzdHVkZW50X2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N0dWRlbnRfaWQuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3R1ZGVudF9pZFxuICAgKi9cbiAgc2V0IHN0dWRlbnRfaWQoc3R1ZGVudF9pZCkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jc3R1ZGVudF9pZCA9IHN0dWRlbnRfaWQgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdHVkZW50X25hbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN0dWRlbnRfbmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jc3R1ZGVudF9uYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N0dWRlbnRfbmFtZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHVkZW50X25hbWVcbiAgICovXG4gIHNldCBzdHVkZW50X25hbWUoc3R1ZGVudF9uYW1lKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNzdHVkZW50X25hbWUgPSBzdHVkZW50X25hbWUgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsZXNzb25fbG9jYXRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlc3Nvbl9sb2NhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jbGVzc29uX2xvY2F0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xlc3Nvbl9sb2NhdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGVzc29uX2xvY2F0aW9uXG4gICAqL1xuICBzZXQgbGVzc29uX2xvY2F0aW9uKGxlc3Nvbl9sb2NhdGlvbikge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQobGVzc29uX2xvY2F0aW9uLCBzY29ybTEyX3JlZ2V4LkNNSVN0cmluZzI1NiwgdHJ1ZSkpIHtcbiAgICAgIHRoaXMuI2xlc3Nvbl9sb2NhdGlvbiA9IGxlc3Nvbl9sb2NhdGlvbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY3JlZGl0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjcmVkaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NyZWRpdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjcmVkaXQuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY3JlZGl0XG4gICAqL1xuICBzZXQgY3JlZGl0KGNyZWRpdCkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jY3JlZGl0ID0gY3JlZGl0IDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGVzc29uX3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVzc29uX3N0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jbGVzc29uX3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsZXNzb25fc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZXNzb25fc3RhdHVzXG4gICAqL1xuICBzZXQgbGVzc29uX3N0YXR1cyhsZXNzb25fc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChsZXNzb25fc3RhdHVzLCBzY29ybTEyX3JlZ2V4LkNNSVN0YXR1cykpIHtcbiAgICAgIHRoaXMuI2xlc3Nvbl9zdGF0dXMgPSBsZXNzb25fc3RhdHVzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNlbnRyeVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZW50cnkoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2VudHJ5O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2VudHJ5LiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGVudHJ5XG4gICAqL1xuICBzZXQgZW50cnkoZW50cnkpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI2VudHJ5ID0gZW50cnkgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0b3RhbF90aW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0b3RhbF90aW1lKCkge1xuICAgIHJldHVybiB0aGlzLiN0b3RhbF90aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RvdGFsX3RpbWUuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG90YWxfdGltZVxuICAgKi9cbiAgc2V0IHRvdGFsX3RpbWUodG90YWxfdGltZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jdG90YWxfdGltZSA9IHRvdGFsX3RpbWUgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsZXNzb25fbW9kZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVzc29uX21vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xlc3Nvbl9tb2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xlc3Nvbl9tb2RlLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlc3Nvbl9tb2RlXG4gICAqL1xuICBzZXQgbGVzc29uX21vZGUobGVzc29uX21vZGUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI2xlc3Nvbl9tb2RlID0gbGVzc29uX21vZGUgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNleGl0LiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IGV4aXQoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI2V4aXQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZXhpdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXhpdFxuICAgKi9cbiAgc2V0IGV4aXQoZXhpdCkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoZXhpdCwgc2Nvcm0xMl9yZWdleC5DTUlFeGl0LCB0cnVlKSkge1xuICAgICAgdGhpcy4jZXhpdCA9IGV4aXQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3Nlc3Npb25fdGltZS4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCBzZXNzaW9uX3RpbWUoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI3Nlc3Npb25fdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzZXNzaW9uX3RpbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlc3Npb25fdGltZVxuICAgKi9cbiAgc2V0IHNlc3Npb25fdGltZShzZXNzaW9uX3RpbWUpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHNlc3Npb25fdGltZSwgc2Nvcm0xMl9yZWdleC5DTUlUaW1lc3BhbikpIHtcbiAgICAgIHRoaXMuI3Nlc3Npb25fdGltZSA9IHNlc3Npb25fdGltZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0aGUgY3VycmVudCBzZXNzaW9uIHRpbWUgdG8gdGhlIGV4aXN0aW5nIHRvdGFsIHRpbWUuXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldEN1cnJlbnRUb3RhbFRpbWUoKSB7XG4gICAgcmV0dXJuIFV0aWxpdGllcy5hZGRISE1NU1NUaW1lU3RyaW5ncyhcbiAgICAgICAgdGhpcy4jdG90YWxfdGltZSxcbiAgICAgICAgdGhpcy4jc2Vzc2lvbl90aW1lLFxuICAgICAgICBuZXcgUmVnRXhwKHNjb3JtMTJfcmVnZXguQ01JVGltZXNwYW4pLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuY29yZVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHN0dWRlbnRfbmFtZTogc3RyaW5nLFxuICAgKiAgICAgIGVudHJ5OiBzdHJpbmcsXG4gICAqICAgICAgZXhpdDogc3RyaW5nLFxuICAgKiAgICAgIHNjb3JlOiBDTUlTY29yZSxcbiAgICogICAgICBzdHVkZW50X2lkOiBzdHJpbmcsXG4gICAqICAgICAgbGVzc29uX21vZGU6IHN0cmluZyxcbiAgICogICAgICBsZXNzb25fbG9jYXRpb246IHN0cmluZyxcbiAgICogICAgICBsZXNzb25fc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgY3JlZGl0OiBzdHJpbmcsXG4gICAqICAgICAgc2Vzc2lvbl90aW1lOiAqXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdzdHVkZW50X2lkJzogdGhpcy5zdHVkZW50X2lkLFxuICAgICAgJ3N0dWRlbnRfbmFtZSc6IHRoaXMuc3R1ZGVudF9uYW1lLFxuICAgICAgJ2xlc3Nvbl9sb2NhdGlvbic6IHRoaXMubGVzc29uX2xvY2F0aW9uLFxuICAgICAgJ2NyZWRpdCc6IHRoaXMuY3JlZGl0LFxuICAgICAgJ2xlc3Nvbl9zdGF0dXMnOiB0aGlzLmxlc3Nvbl9zdGF0dXMsXG4gICAgICAnZW50cnknOiB0aGlzLmVudHJ5LFxuICAgICAgJ2xlc3Nvbl9tb2RlJzogdGhpcy5sZXNzb25fbW9kZSxcbiAgICAgICdleGl0JzogdGhpcy5leGl0LFxuICAgICAgJ3Nlc3Npb25fdGltZSc6IHRoaXMuc2Vzc2lvbl90aW1lLFxuICAgICAgJ3Njb3JlJzogdGhpcy5zY29yZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkub2JqZWN0aXZlcyBvYmplY3RcbiAqIEBleHRlbmRzIENNSUFycmF5XG4gKi9cbmNsYXNzIENNSU9iamVjdGl2ZXMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLm9iamVjdGl2ZXNcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHtcbiAgICAgIGNoaWxkcmVuOiBzY29ybTEyX2NvbnN0YW50cy5vYmplY3RpdmVzX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5zdHVkZW50X2RhdGEgb2JqZWN0XG4gKiBAZXh0ZW5kcyBCYXNlQ01JXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlTdHVkZW50RGF0YSBleHRlbmRzIEJhc2VDTUkge1xuICAjX2NoaWxkcmVuO1xuICAjbWFzdGVyeV9zY29yZSA9ICcnO1xuICAjbWF4X3RpbWVfYWxsb3dlZCA9ICcnO1xuICAjdGltZV9saW1pdF9hY3Rpb24gPSAnJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5zdHVkZW50X2RhdGFcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0dWRlbnRfZGF0YV9jaGlsZHJlblxuICAgKi9cbiAgY29uc3RydWN0b3Ioc3R1ZGVudF9kYXRhX2NoaWxkcmVuKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuI19jaGlsZHJlbiA9IHN0dWRlbnRfZGF0YV9jaGlsZHJlbiA/XG4gICAgICAgIHN0dWRlbnRfZGF0YV9jaGlsZHJlbiA6XG4gICAgICAgIHNjb3JtMTJfY29uc3RhbnRzLnN0dWRlbnRfZGF0YV9jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNfY2hpbGRyZW5cbiAgICogQHJldHVybiB7Kn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX2NoaWxkcmVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93SW52YWxpZFZhbHVlRXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNtYXN0ZXJfc2NvcmVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1hc3Rlcnlfc2NvcmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI21hc3Rlcnlfc2NvcmU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbWFzdGVyX3Njb3JlLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1hc3Rlcnlfc2NvcmVcbiAgICovXG4gIHNldCBtYXN0ZXJ5X3Njb3JlKG1hc3Rlcnlfc2NvcmUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI21hc3Rlcnlfc2NvcmUgPSBtYXN0ZXJ5X3Njb3JlIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbWF4X3RpbWVfYWxsb3dlZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbWF4X3RpbWVfYWxsb3dlZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jbWF4X3RpbWVfYWxsb3dlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNtYXhfdGltZV9hbGxvd2VkLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1heF90aW1lX2FsbG93ZWRcbiAgICovXG4gIHNldCBtYXhfdGltZV9hbGxvd2VkKG1heF90aW1lX2FsbG93ZWQpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI21heF90aW1lX2FsbG93ZWQgPSBtYXhfdGltZV9hbGxvd2VkIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZV9saW1pdF9hY3Rpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRpbWVfbGltaXRfYWN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiN0aW1lX2xpbWl0X2FjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lX2xpbWl0X2FjdGlvbi4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lX2xpbWl0X2FjdGlvblxuICAgKi9cbiAgc2V0IHRpbWVfbGltaXRfYWN0aW9uKHRpbWVfbGltaXRfYWN0aW9uKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiN0aW1lX2xpbWl0X2FjdGlvbiA9IHRpbWVfbGltaXRfYWN0aW9uIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuc3R1ZGVudF9kYXRhXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgbWF4X3RpbWVfYWxsb3dlZDogc3RyaW5nLFxuICAgKiAgICAgIHRpbWVfbGltaXRfYWN0aW9uOiBzdHJpbmcsXG4gICAqICAgICAgbWFzdGVyeV9zY29yZTogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdtYXN0ZXJ5X3Njb3JlJzogdGhpcy5tYXN0ZXJ5X3Njb3JlLFxuICAgICAgJ21heF90aW1lX2FsbG93ZWQnOiB0aGlzLm1heF90aW1lX2FsbG93ZWQsXG4gICAgICAndGltZV9saW1pdF9hY3Rpb24nOiB0aGlzLnRpbWVfbGltaXRfYWN0aW9uLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5zdHVkZW50X3ByZWZlcmVuY2Ugb2JqZWN0XG4gKiBAZXh0ZW5kcyBCYXNlQ01JXG4gKi9cbmNsYXNzIENNSVN0dWRlbnRQcmVmZXJlbmNlIGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLnN0dWRlbnRfcHJlZmVyZW5jZVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gICNfY2hpbGRyZW4gPSBzY29ybTEyX2NvbnN0YW50cy5zdHVkZW50X3ByZWZlcmVuY2VfY2hpbGRyZW47XG4gICNhdWRpbyA9ICcnO1xuICAjbGFuZ3VhZ2UgPSAnJztcbiAgI3NwZWVkID0gJyc7XG4gICN0ZXh0ID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI19jaGlsZHJlblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvd0ludmFsaWRWYWx1ZUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjYXVkaW9cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGF1ZGlvKCkge1xuICAgIHJldHVybiB0aGlzLiNhdWRpbztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNhdWRpb1xuICAgKiBAcGFyYW0ge3N0cmluZ30gYXVkaW9cbiAgICovXG4gIHNldCBhdWRpbyhhdWRpbykge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoYXVkaW8sIHNjb3JtMTJfcmVnZXguQ01JU0ludGVnZXIpICYmXG4gICAgICAgIGNoZWNrMTJWYWxpZFJhbmdlKGF1ZGlvLCBzY29ybTEyX3JlZ2V4LmF1ZGlvX3JhbmdlKSkge1xuICAgICAgdGhpcy4jYXVkaW8gPSBhdWRpbztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGFuZ3VhZ2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxhbmd1YWdlKCkge1xuICAgIHJldHVybiB0aGlzLiNsYW5ndWFnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsYW5ndWFnZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGFuZ3VhZ2VcbiAgICovXG4gIHNldCBsYW5ndWFnZShsYW5ndWFnZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQobGFuZ3VhZ2UsIHNjb3JtMTJfcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jbGFuZ3VhZ2UgPSBsYW5ndWFnZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3BlZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHNwZWVkKCkge1xuICAgIHJldHVybiB0aGlzLiNzcGVlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzcGVlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3BlZWRcbiAgICovXG4gIHNldCBzcGVlZChzcGVlZCkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoc3BlZWQsIHNjb3JtMTJfcmVnZXguQ01JU0ludGVnZXIpICYmXG4gICAgICAgIGNoZWNrMTJWYWxpZFJhbmdlKHNwZWVkLCBzY29ybTEyX3JlZ2V4LnNwZWVkX3JhbmdlKSkge1xuICAgICAgdGhpcy4jc3BlZWQgPSBzcGVlZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGV4dFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy4jdGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0ZXh0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4gICAqL1xuICBzZXQgdGV4dCh0ZXh0KSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh0ZXh0LCBzY29ybTEyX3JlZ2V4LkNNSVNJbnRlZ2VyKSAmJlxuICAgICAgICBjaGVjazEyVmFsaWRSYW5nZSh0ZXh0LCBzY29ybTEyX3JlZ2V4LnRleHRfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiN0ZXh0ID0gdGV4dDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuc3R1ZGVudF9wcmVmZXJlbmNlXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgYXVkaW86IHN0cmluZyxcbiAgICogICAgICBsYW5ndWFnZTogc3RyaW5nLFxuICAgKiAgICAgIHNwZWVkOiBzdHJpbmcsXG4gICAqICAgICAgdGV4dDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdhdWRpbyc6IHRoaXMuYXVkaW8sXG4gICAgICAnbGFuZ3VhZ2UnOiB0aGlzLmxhbmd1YWdlLFxuICAgICAgJ3NwZWVkJzogdGhpcy5zcGVlZCxcbiAgICAgICd0ZXh0JzogdGhpcy50ZXh0LFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5pbnRlcmFjdGlvbnMgb2JqZWN0XG4gKiBAZXh0ZW5kcyBCYXNlQ01JXG4gKi9cbmNsYXNzIENNSUludGVyYWN0aW9ucyBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogc2Nvcm0xMl9jb25zdGFudHMuaW50ZXJhY3Rpb25zX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5pbnRlcmFjdGlvbnMubiBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5pbnRlcmFjdGlvbnMubiBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLm9iamVjdGl2ZXMgPSBuZXcgQ01JQXJyYXkoe1xuICAgICAgZXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgY2hpbGRyZW46IHNjb3JtMTJfY29uc3RhbnRzLm9iamVjdGl2ZXNfY2hpbGRyZW4sXG4gICAgfSk7XG4gICAgdGhpcy5jb3JyZWN0X3Jlc3BvbnNlcyA9IG5ldyBDTUlBcnJheSh7XG4gICAgICBlcnJvckNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUsXG4gICAgICBjaGlsZHJlbjogc2Nvcm0xMl9jb25zdGFudHMuY29ycmVjdF9yZXNwb25zZXNfY2hpbGRyZW4sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMub2JqZWN0aXZlcz8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuY29ycmVjdF9yZXNwb25zZXM/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICNpZCA9ICcnO1xuICAjdGltZSA9ICcnO1xuICAjdHlwZSA9ICcnO1xuICAjd2VpZ2h0aW5nID0gJyc7XG4gICNzdHVkZW50X3Jlc3BvbnNlID0gJyc7XG4gICNyZXN1bHQgPSAnJztcbiAgI2xhdGVuY3kgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaWQuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChpZCwgc2Nvcm0xMl9yZWdleC5DTUlJZGVudGlmaWVyKSkge1xuICAgICAgdGhpcy4jaWQgPSBpZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZS4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCB0aW1lKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiN0aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVcbiAgICovXG4gIHNldCB0aW1lKHRpbWUpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHRpbWUsIHNjb3JtMTJfcmVnZXguQ01JVGltZSkpIHtcbiAgICAgIHRoaXMuI3RpbWUgPSB0aW1lO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0eXBlLiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI3R5cGU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICAgKi9cbiAgc2V0IHR5cGUodHlwZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQodHlwZSwgc2Nvcm0xMl9yZWdleC5DTUlUeXBlKSkge1xuICAgICAgdGhpcy4jdHlwZSA9IHR5cGU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3dlaWdodGluZy4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCB3ZWlnaHRpbmcoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/XG4gICAgICAgIHRocm93V3JpdGVPbmx5RXJyb3IoKSA6XG4gICAgICAgIHRoaXMuI3dlaWdodGluZztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN3ZWlnaHRpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IHdlaWdodGluZ1xuICAgKi9cbiAgc2V0IHdlaWdodGluZyh3ZWlnaHRpbmcpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHdlaWdodGluZywgc2Nvcm0xMl9yZWdleC5DTUlEZWNpbWFsKSAmJlxuICAgICAgICBjaGVjazEyVmFsaWRSYW5nZSh3ZWlnaHRpbmcsIHNjb3JtMTJfcmVnZXgud2VpZ2h0aW5nX3JhbmdlKSkge1xuICAgICAgdGhpcy4jd2VpZ2h0aW5nID0gd2VpZ2h0aW5nO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdHVkZW50X3Jlc3BvbnNlLiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IHN0dWRlbnRfcmVzcG9uc2UoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI3N0dWRlbnRfcmVzcG9uc2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3R1ZGVudF9yZXNwb25zZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3R1ZGVudF9yZXNwb25zZVxuICAgKi9cbiAgc2V0IHN0dWRlbnRfcmVzcG9uc2Uoc3R1ZGVudF9yZXNwb25zZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoc3R1ZGVudF9yZXNwb25zZSwgc2Nvcm0xMl9yZWdleC5DTUlGZWVkYmFjaywgdHJ1ZSkpIHtcbiAgICAgIHRoaXMuI3N0dWRlbnRfcmVzcG9uc2UgPSBzdHVkZW50X3Jlc3BvbnNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNyZXN1bHQuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgcmVzdWx0KCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNyZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcmVzdWx0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZXN1bHRcbiAgICovXG4gIHNldCByZXN1bHQocmVzdWx0KSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChyZXN1bHQsIHNjb3JtMTJfcmVnZXguQ01JUmVzdWx0KSkge1xuICAgICAgdGhpcy4jcmVzdWx0ID0gcmVzdWx0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsYXRlbmN5LiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IGxhdGVuY3koKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI2xhdGVuY3k7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGF0ZW5jeVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGF0ZW5jeVxuICAgKi9cbiAgc2V0IGxhdGVuY3kobGF0ZW5jeSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQobGF0ZW5jeSwgc2Nvcm0xMl9yZWdleC5DTUlUaW1lc3BhbikpIHtcbiAgICAgIHRoaXMuI2xhdGVuY3kgPSBsYXRlbmN5O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5pbnRlcmFjdGlvbnMublxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGlkOiBzdHJpbmcsXG4gICAqICAgICAgdGltZTogc3RyaW5nLFxuICAgKiAgICAgIHR5cGU6IHN0cmluZyxcbiAgICogICAgICB3ZWlnaHRpbmc6IHN0cmluZyxcbiAgICogICAgICBzdHVkZW50X3Jlc3BvbnNlOiBzdHJpbmcsXG4gICAqICAgICAgcmVzdWx0OiBzdHJpbmcsXG4gICAqICAgICAgbGF0ZW5jeTogc3RyaW5nLFxuICAgKiAgICAgIG9iamVjdGl2ZXM6IENNSUFycmF5LFxuICAgKiAgICAgIGNvcnJlY3RfcmVzcG9uc2VzOiBDTUlBcnJheVxuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnaWQnOiB0aGlzLmlkLFxuICAgICAgJ3RpbWUnOiB0aGlzLnRpbWUsXG4gICAgICAndHlwZSc6IHRoaXMudHlwZSxcbiAgICAgICd3ZWlnaHRpbmcnOiB0aGlzLndlaWdodGluZyxcbiAgICAgICdzdHVkZW50X3Jlc3BvbnNlJzogdGhpcy5zdHVkZW50X3Jlc3BvbnNlLFxuICAgICAgJ3Jlc3VsdCc6IHRoaXMucmVzdWx0LFxuICAgICAgJ2xhdGVuY3knOiB0aGlzLmxhdGVuY3ksXG4gICAgICAnb2JqZWN0aXZlcyc6IHRoaXMub2JqZWN0aXZlcyxcbiAgICAgICdjb3JyZWN0X3Jlc3BvbnNlcyc6IHRoaXMuY29ycmVjdF9yZXNwb25zZXMsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLm9iamVjdGl2ZXMubiBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSU9iamVjdGl2ZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkub2JqZWN0aXZlcy5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zY29yZSA9IG5ldyBDTUlTY29yZShcbiAgICAgICAge1xuICAgICAgICAgIHNjb3JlX2NoaWxkcmVuOiBzY29ybTEyX2NvbnN0YW50cy5zY29yZV9jaGlsZHJlbixcbiAgICAgICAgICBzY29yZV9yYW5nZTogc2Nvcm0xMl9yZWdleC5zY29yZV9yYW5nZSxcbiAgICAgICAgICBpbnZhbGlkRXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgICAgIGludmFsaWRUeXBlQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENILFxuICAgICAgICAgIGludmFsaWRSYW5nZUNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFLFxuICAgICAgICB9KTtcbiAgfVxuXG4gICNpZCA9ICcnO1xuICAjc3RhdHVzID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2lkXG4gICAqIEByZXR1cm4ge1wiXCJ9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChpZCwgc2Nvcm0xMl9yZWdleC5DTUlJZGVudGlmaWVyKSkge1xuICAgICAgdGhpcy4jaWQgPSBpZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3RhdHVzXG4gICAqIEByZXR1cm4ge1wiXCJ9XG4gICAqL1xuICBnZXQgc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNzdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0dXNcbiAgICovXG4gIHNldCBzdGF0dXMoc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChzdGF0dXMsIHNjb3JtMTJfcmVnZXguQ01JU3RhdHVzMikpIHtcbiAgICAgIHRoaXMuI3N0YXR1cyA9IHN0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkub2JqZWN0aXZlcy5uXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgaWQ6IHN0cmluZyxcbiAgICogICAgICBzdGF0dXM6IHN0cmluZyxcbiAgICogICAgICBzY29yZTogQ01JU2NvcmVcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICAgICdzdGF0dXMnOiB0aGlzLnN0YXR1cyxcbiAgICAgICdzY29yZSc6IHRoaXMuc2NvcmUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLmludGVyYWN0aW9ucy5uLm9iamVjdGl2ZXMubiBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc09iamVjdGl2ZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4ub2JqZWN0aXZlcy5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgI2lkID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2lkXG4gICAqIEByZXR1cm4ge1wiXCJ9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChpZCwgc2Nvcm0xMl9yZWdleC5DTUlJZGVudGlmaWVyKSkge1xuICAgICAgdGhpcy4jaWQgPSBpZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4ub2JqZWN0aXZlcy5uXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgaWQ6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnaWQnOiB0aGlzLmlkLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5pbnRlcmFjdGlvbnMuY29ycmVjdF9yZXNwb25zZXMubiBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc0NvcnJlY3RSZXNwb25zZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLmNvcnJlY3RfcmVzcG9uc2VzLm5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAjcGF0dGVybiA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNwYXR0ZXJuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBwYXR0ZXJuKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNwYXR0ZXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3BhdHRlcm5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdHRlcm5cbiAgICovXG4gIHNldCBwYXR0ZXJuKHBhdHRlcm4pIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHBhdHRlcm4sIHNjb3JtMTJfcmVnZXguQ01JRmVlZGJhY2ssIHRydWUpKSB7XG4gICAgICB0aGlzLiNwYXR0ZXJuID0gcGF0dGVybjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuaW50ZXJhY3Rpb25zLmNvcnJlY3RfcmVzcG9uc2VzLm5cbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBwYXR0ZXJuOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3BhdHRlcm4nOiB0aGlzLnBhdHRlcm4sXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgQUlDQyBOYXZpZ2F0aW9uIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgTkFWIGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgTkFWIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gICNldmVudCA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNldmVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZXZlbnQoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI2V2ZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2V2ZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgKi9cbiAgc2V0IGV2ZW50KGV2ZW50KSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChldmVudCwgc2Nvcm0xMl9yZWdleC5OQVZFdmVudCkpIHtcbiAgICAgIHRoaXMuI2V2ZW50ID0gZXZlbnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgbmF2IG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGV2ZW50OiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2V2ZW50JzogdGhpcy5ldmVudCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCB7XG4gIEJhc2VDTUksXG4gIGNoZWNrVmFsaWRGb3JtYXQsXG4gIGNoZWNrVmFsaWRSYW5nZSxcbiAgQ01JQXJyYXksXG4gIENNSVNjb3JlLFxufSBmcm9tICcuL2NvbW1vbic7XG5pbXBvcnQgQVBJQ29uc3RhbnRzIGZyb20gJy4uL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCBSZWdleCBmcm9tICcuLi9jb25zdGFudHMvcmVnZXgnO1xuaW1wb3J0IEVycm9yQ29kZXMgZnJvbSAnLi4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJztcbmltcG9ydCBSZXNwb25zZXMgZnJvbSAnLi4vY29uc3RhbnRzL3Jlc3BvbnNlX2NvbnN0YW50cyc7XG5pbXBvcnQge1ZhbGlkYXRpb25FcnJvcn0gZnJvbSAnLi4vZXhjZXB0aW9ucyc7XG5pbXBvcnQgKiBhcyBVdGlsIGZyb20gJy4uL3V0aWxpdGllcyc7XG5cbmNvbnN0IHNjb3JtMjAwNF9jb25zdGFudHMgPSBBUElDb25zdGFudHMuc2Nvcm0yMDA0O1xuY29uc3Qgc2Nvcm0yMDA0X2Vycm9yX2NvZGVzID0gRXJyb3JDb2Rlcy5zY29ybTIwMDQ7XG5jb25zdCBsZWFybmVyX3Jlc3BvbnNlcyA9IFJlc3BvbnNlcy5sZWFybmVyO1xuXG5jb25zdCBzY29ybTIwMDRfcmVnZXggPSBSZWdleC5zY29ybTIwMDQ7XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgUmVhZCBPbmx5IGVycm9yXG4gKi9cbmZ1bmN0aW9uIHRocm93UmVhZE9ubHlFcnJvcigpIHtcbiAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQpO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QgZm9yIHRocm93aW5nIFdyaXRlIE9ubHkgZXJyb3JcbiAqL1xuZnVuY3Rpb24gdGhyb3dXcml0ZU9ubHlFcnJvcigpIHtcbiAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuV1JJVEVfT05MWV9FTEVNRU5UKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIGZvciB0aHJvd2luZyBUeXBlIE1pc21hdGNoIGVycm9yXG4gKi9cbmZ1bmN0aW9uIHRocm93VHlwZU1pc21hdGNoRXJyb3IoKSB7XG4gIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QsIG5vIHJlYXNvbiB0byBoYXZlIHRvIHBhc3MgdGhlIHNhbWUgZXJyb3IgY29kZXMgZXZlcnkgdGltZVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9IHJlZ2V4UGF0dGVyblxuICogQHBhcmFtIHtib29sZWFufSBhbGxvd0VtcHR5U3RyaW5nXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBjaGVjazIwMDRWYWxpZEZvcm1hdChcbiAgICB2YWx1ZTogU3RyaW5nLFxuICAgIHJlZ2V4UGF0dGVybjogU3RyaW5nLFxuICAgIGFsbG93RW1wdHlTdHJpbmc/OiBib29sZWFuKSB7XG4gIHJldHVybiBjaGVja1ZhbGlkRm9ybWF0KHZhbHVlLCByZWdleFBhdHRlcm4sXG4gICAgICBzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCwgYWxsb3dFbXB0eVN0cmluZyk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCwgbm8gcmVhc29uIHRvIGhhdmUgdG8gcGFzcyB0aGUgc2FtZSBlcnJvciBjb2RlcyBldmVyeSB0aW1lXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcmFuZ2VQYXR0ZXJuXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBjaGVjazIwMDRWYWxpZFJhbmdlKHZhbHVlOiBhbnksIHJhbmdlUGF0dGVybjogU3RyaW5nKSB7XG4gIHJldHVybiBjaGVja1ZhbGlkUmFuZ2UodmFsdWUsIHJhbmdlUGF0dGVybixcbiAgICAgIHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0UpO1xufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBjbWkgb2JqZWN0IGZvciBTQ09STSAyMDA0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUkgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciB0aGUgU0NPUk0gMjAwNCBjbWkgb2JqZWN0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5pdGlhbGl6ZWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKGluaXRpYWxpemVkOiBib29sZWFuKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubGVhcm5lcl9wcmVmZXJlbmNlID0gbmV3IENNSUxlYXJuZXJQcmVmZXJlbmNlKCk7XG4gICAgdGhpcy5zY29yZSA9IG5ldyBTY29ybTIwMDRDTUlTY29yZSgpO1xuICAgIHRoaXMuY29tbWVudHNfZnJvbV9sZWFybmVyID0gbmV3IENNSUNvbW1lbnRzRnJvbUxlYXJuZXIoKTtcbiAgICB0aGlzLmNvbW1lbnRzX2Zyb21fbG1zID0gbmV3IENNSUNvbW1lbnRzRnJvbUxNUygpO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zID0gbmV3IENNSUludGVyYWN0aW9ucygpO1xuICAgIHRoaXMub2JqZWN0aXZlcyA9IG5ldyBDTUlPYmplY3RpdmVzKCk7XG5cbiAgICBpZiAoaW5pdGlhbGl6ZWQpIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgI192ZXJzaW9uID0gJzEuMCc7XG4gICNfY2hpbGRyZW4gPSBzY29ybTIwMDRfY29uc3RhbnRzLmNtaV9jaGlsZHJlbjtcbiAgI2NvbXBsZXRpb25fc3RhdHVzID0gJ3Vua25vd24nO1xuICAjY29tcGxldGlvbl90aHJlc2hvbGQgPSAnJztcbiAgI2NyZWRpdCA9ICdjcmVkaXQnO1xuICAjZW50cnkgPSAnJztcbiAgI2V4aXQgPSAnJztcbiAgI2xhdW5jaF9kYXRhID0gJyc7XG4gICNsZWFybmVyX2lkID0gJyc7XG4gICNsZWFybmVyX25hbWUgPSAnJztcbiAgI2xvY2F0aW9uID0gJyc7XG4gICNtYXhfdGltZV9hbGxvd2VkID0gJyc7XG4gICNtb2RlID0gJ25vcm1hbCc7XG4gICNwcm9ncmVzc19tZWFzdXJlID0gJyc7XG4gICNzY2FsZWRfcGFzc2luZ19zY29yZSA9ICcnO1xuICAjc2Vzc2lvbl90aW1lID0gJ1BUMEgwTTBTJztcbiAgI3N1Y2Nlc3Nfc3RhdHVzID0gJ3Vua25vd24nO1xuICAjc3VzcGVuZF9kYXRhID0gJyc7XG4gICN0aW1lX2xpbWl0X2FjdGlvbiA9ICdjb250aW51ZSxubyBtZXNzYWdlJztcbiAgI3RvdGFsX3RpbWUgPSAnJztcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMubGVhcm5lcl9wcmVmZXJlbmNlPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zY29yZT8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuY29tbWVudHNfZnJvbV9sZWFybmVyPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5jb21tZW50c19mcm9tX2xtcz8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5vYmplY3RpdmVzPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX3ZlcnNpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IF92ZXJzaW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNfdmVyc2lvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfdmVyc2lvbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfdmVyc2lvblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF92ZXJzaW9uKF92ZXJzaW9uKSB7XG4gICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX2NoaWxkcmVuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge251bWJlcn0gX2NoaWxkcmVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NvbXBsZXRpb25fc3RhdHVzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb21wbGV0aW9uX3N0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jY29tcGxldGlvbl9zdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29tcGxldGlvbl9zdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbXBsZXRpb25fc3RhdHVzXG4gICAqL1xuICBzZXQgY29tcGxldGlvbl9zdGF0dXMoY29tcGxldGlvbl9zdGF0dXMpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoY29tcGxldGlvbl9zdGF0dXMsIHNjb3JtMjAwNF9yZWdleC5DTUlDU3RhdHVzKSkge1xuICAgICAgdGhpcy4jY29tcGxldGlvbl9zdGF0dXMgPSBjb21wbGV0aW9uX3N0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29tcGxldGlvbl90aHJlc2hvbGRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbXBsZXRpb25fdGhyZXNob2xkKCkge1xuICAgIHJldHVybiB0aGlzLiNjb21wbGV0aW9uX3RocmVzaG9sZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb21wbGV0aW9uX3RocmVzaG9sZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21wbGV0aW9uX3RocmVzaG9sZFxuICAgKi9cbiAgc2V0IGNvbXBsZXRpb25fdGhyZXNob2xkKGNvbXBsZXRpb25fdGhyZXNob2xkKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNjb21wbGV0aW9uX3RocmVzaG9sZCA9IGNvbXBsZXRpb25fdGhyZXNob2xkIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY3JlZGl0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjcmVkaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NyZWRpdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjcmVkaXQuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY3JlZGl0XG4gICAqL1xuICBzZXQgY3JlZGl0KGNyZWRpdCkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jY3JlZGl0ID0gY3JlZGl0IDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZW50cnlcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGVudHJ5KCkge1xuICAgIHJldHVybiB0aGlzLiNlbnRyeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNlbnRyeS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlbnRyeVxuICAgKi9cbiAgc2V0IGVudHJ5KGVudHJ5KSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNlbnRyeSA9IGVudHJ5IDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZXhpdC4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGV4aXQoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI2V4aXQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZXhpdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXhpdFxuICAgKi9cbiAgc2V0IGV4aXQoZXhpdCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChleGl0LCBzY29ybTIwMDRfcmVnZXguQ01JRXhpdCwgdHJ1ZSkpIHtcbiAgICAgIHRoaXMuI2V4aXQgPSBleGl0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsYXVuY2hfZGF0YVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGF1bmNoX2RhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xhdW5jaF9kYXRhO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xhdW5jaF9kYXRhLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhdW5jaF9kYXRhXG4gICAqL1xuICBzZXQgbGF1bmNoX2RhdGEobGF1bmNoX2RhdGEpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI2xhdW5jaF9kYXRhID0gbGF1bmNoX2RhdGEgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsZWFybmVyX2lkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsZWFybmVyX2lkKCkge1xuICAgIHJldHVybiB0aGlzLiNsZWFybmVyX2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xlYXJuZXJfaWQuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGVhcm5lcl9pZFxuICAgKi9cbiAgc2V0IGxlYXJuZXJfaWQobGVhcm5lcl9pZCkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jbGVhcm5lcl9pZCA9IGxlYXJuZXJfaWQgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsZWFybmVyX25hbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlYXJuZXJfbmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGVhcm5lcl9uYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xlYXJuZXJfbmFtZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZWFybmVyX25hbWVcbiAgICovXG4gIHNldCBsZWFybmVyX25hbWUobGVhcm5lcl9uYW1lKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNsZWFybmVyX25hbWUgPSBsZWFybmVyX25hbWUgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsb2NhdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xvY2F0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xvY2F0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvblxuICAgKi9cbiAgc2V0IGxvY2F0aW9uKGxvY2F0aW9uKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGxvY2F0aW9uLCBzY29ybTIwMDRfcmVnZXguQ01JU3RyaW5nMTAwMCkpIHtcbiAgICAgIHRoaXMuI2xvY2F0aW9uID0gbG9jYXRpb247XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI21heF90aW1lX2FsbG93ZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1heF90aW1lX2FsbG93ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI21heF90aW1lX2FsbG93ZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbWF4X3RpbWVfYWxsb3dlZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYXhfdGltZV9hbGxvd2VkXG4gICAqL1xuICBzZXQgbWF4X3RpbWVfYWxsb3dlZChtYXhfdGltZV9hbGxvd2VkKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNtYXhfdGltZV9hbGxvd2VkID0gbWF4X3RpbWVfYWxsb3dlZCA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI21vZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI21vZGU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbW9kZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtb2RlXG4gICAqL1xuICBzZXQgbW9kZShtb2RlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNtb2RlID0gbW9kZSA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3Byb2dyZXNzX21lYXN1cmVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHByb2dyZXNzX21lYXN1cmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3Byb2dyZXNzX21lYXN1cmU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcHJvZ3Jlc3NfbWVhc3VyZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvZ3Jlc3NfbWVhc3VyZVxuICAgKi9cbiAgc2V0IHByb2dyZXNzX21lYXN1cmUocHJvZ3Jlc3NfbWVhc3VyZSkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChwcm9ncmVzc19tZWFzdXJlLCBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCkgJiZcbiAgICAgICAgY2hlY2syMDA0VmFsaWRSYW5nZShwcm9ncmVzc19tZWFzdXJlLCBzY29ybTIwMDRfcmVnZXgucHJvZ3Jlc3NfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiNwcm9ncmVzc19tZWFzdXJlID0gcHJvZ3Jlc3NfbWVhc3VyZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc2NhbGVkX3Bhc3Npbmdfc2NvcmVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHNjYWxlZF9wYXNzaW5nX3Njb3JlKCkge1xuICAgIHJldHVybiB0aGlzLiNzY2FsZWRfcGFzc2luZ19zY29yZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzY2FsZWRfcGFzc2luZ19zY29yZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY2FsZWRfcGFzc2luZ19zY29yZVxuICAgKi9cbiAgc2V0IHNjYWxlZF9wYXNzaW5nX3Njb3JlKHNjYWxlZF9wYXNzaW5nX3Njb3JlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNzY2FsZWRfcGFzc2luZ19zY29yZSA9IHNjYWxlZF9wYXNzaW5nX3Njb3JlIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc2Vzc2lvbl90aW1lLiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc2Vzc2lvbl90aW1lKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNzZXNzaW9uX3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc2Vzc2lvbl90aW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZXNzaW9uX3RpbWVcbiAgICovXG4gIHNldCBzZXNzaW9uX3RpbWUoc2Vzc2lvbl90aW1lKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHNlc3Npb25fdGltZSwgc2Nvcm0yMDA0X3JlZ2V4LkNNSVRpbWVzcGFuKSkge1xuICAgICAgdGhpcy4jc2Vzc2lvbl90aW1lID0gc2Vzc2lvbl90aW1lO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdWNjZXNzX3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3VjY2Vzc19zdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N1Y2Nlc3Nfc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N1Y2Nlc3Nfc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdWNjZXNzX3N0YXR1c1xuICAgKi9cbiAgc2V0IHN1Y2Nlc3Nfc3RhdHVzKHN1Y2Nlc3Nfc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHN1Y2Nlc3Nfc3RhdHVzLCBzY29ybTIwMDRfcmVnZXguQ01JU1N0YXR1cykpIHtcbiAgICAgIHRoaXMuI3N1Y2Nlc3Nfc3RhdHVzID0gc3VjY2Vzc19zdGF0dXM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N1c3BlbmRfZGF0YVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3VzcGVuZF9kYXRhKCkge1xuICAgIHJldHVybiB0aGlzLiNzdXNwZW5kX2RhdGE7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3VzcGVuZF9kYXRhXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdXNwZW5kX2RhdGFcbiAgICovXG4gIHNldCBzdXNwZW5kX2RhdGEoc3VzcGVuZF9kYXRhKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHN1c3BlbmRfZGF0YSwgc2Nvcm0yMDA0X3JlZ2V4LkNNSVN0cmluZzY0MDAwLCB0cnVlKSkge1xuICAgICAgdGhpcy4jc3VzcGVuZF9kYXRhID0gc3VzcGVuZF9kYXRhO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0aW1lX2xpbWl0X2FjdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGltZV9saW1pdF9hY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWVfbGltaXRfYWN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpbWVfbGltaXRfYWN0aW9uLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVfbGltaXRfYWN0aW9uXG4gICAqL1xuICBzZXQgdGltZV9saW1pdF9hY3Rpb24odGltZV9saW1pdF9hY3Rpb24pIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI3RpbWVfbGltaXRfYWN0aW9uID0gdGltZV9saW1pdF9hY3Rpb24gOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0b3RhbF90aW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0b3RhbF90aW1lKCkge1xuICAgIHJldHVybiB0aGlzLiN0b3RhbF90aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RvdGFsX3RpbWUuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG90YWxfdGltZVxuICAgKi9cbiAgc2V0IHRvdGFsX3RpbWUodG90YWxfdGltZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jdG90YWxfdGltZSA9IHRvdGFsX3RpbWUgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHRoZSBjdXJyZW50IHNlc3Npb24gdGltZSB0byB0aGUgZXhpc3RpbmcgdG90YWwgdGltZS5cbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSBJU084NjAxIER1cmF0aW9uXG4gICAqL1xuICBnZXRDdXJyZW50VG90YWxUaW1lKCkge1xuICAgIHJldHVybiBVdGlsLmFkZFR3b0R1cmF0aW9ucyhcbiAgICAgICAgdGhpcy4jdG90YWxfdGltZSxcbiAgICAgICAgdGhpcy4jc2Vzc2lvbl90aW1lLFxuICAgICAgICBzY29ybTIwMDRfcmVnZXguQ01JVGltZXNwYW4sXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGNvbW1lbnRzX2Zyb21fbGVhcm5lcjogQ01JQ29tbWVudHNGcm9tTGVhcm5lcixcbiAgICogICAgICBjb21tZW50c19mcm9tX2xtczogQ01JQ29tbWVudHNGcm9tTE1TLFxuICAgKiAgICAgIGNvbXBsZXRpb25fc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgY29tcGxldGlvbl90aHJlc2hvbGQ6IHN0cmluZyxcbiAgICogICAgICBjcmVkaXQ6IHN0cmluZyxcbiAgICogICAgICBlbnRyeTogc3RyaW5nLFxuICAgKiAgICAgIGV4aXQ6IHN0cmluZyxcbiAgICogICAgICBpbnRlcmFjdGlvbnM6IENNSUludGVyYWN0aW9ucyxcbiAgICogICAgICBsYXVuY2hfZGF0YTogc3RyaW5nLFxuICAgKiAgICAgIGxlYXJuZXJfaWQ6IHN0cmluZyxcbiAgICogICAgICBsZWFybmVyX25hbWU6IHN0cmluZyxcbiAgICogICAgICBsZWFybmVyX3ByZWZlcmVuY2U6IENNSUxlYXJuZXJQcmVmZXJlbmNlLFxuICAgKiAgICAgIGxvY2F0aW9uOiBzdHJpbmcsXG4gICAqICAgICAgbWF4X3RpbWVfYWxsb3dlZDogc3RyaW5nLFxuICAgKiAgICAgIG1vZGU6IHN0cmluZyxcbiAgICogICAgICBvYmplY3RpdmVzOiBDTUlPYmplY3RpdmVzLFxuICAgKiAgICAgIHByb2dyZXNzX21lYXN1cmU6IHN0cmluZyxcbiAgICogICAgICBzY2FsZWRfcGFzc2luZ19zY29yZTogc3RyaW5nLFxuICAgKiAgICAgIHNjb3JlOiBTY29ybTIwMDRDTUlTY29yZSxcbiAgICogICAgICBzZXNzaW9uX3RpbWU6IHN0cmluZyxcbiAgICogICAgICBzdWNjZXNzX3N0YXR1czogc3RyaW5nLFxuICAgKiAgICAgIHN1c3BlbmRfZGF0YTogc3RyaW5nLFxuICAgKiAgICAgIHRpbWVfbGltaXRfYWN0aW9uOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2NvbW1lbnRzX2Zyb21fbGVhcm5lcic6IHRoaXMuY29tbWVudHNfZnJvbV9sZWFybmVyLFxuICAgICAgJ2NvbW1lbnRzX2Zyb21fbG1zJzogdGhpcy5jb21tZW50c19mcm9tX2xtcyxcbiAgICAgICdjb21wbGV0aW9uX3N0YXR1cyc6IHRoaXMuY29tcGxldGlvbl9zdGF0dXMsXG4gICAgICAnY29tcGxldGlvbl90aHJlc2hvbGQnOiB0aGlzLmNvbXBsZXRpb25fdGhyZXNob2xkLFxuICAgICAgJ2NyZWRpdCc6IHRoaXMuY3JlZGl0LFxuICAgICAgJ2VudHJ5JzogdGhpcy5lbnRyeSxcbiAgICAgICdleGl0JzogdGhpcy5leGl0LFxuICAgICAgJ2ludGVyYWN0aW9ucyc6IHRoaXMuaW50ZXJhY3Rpb25zLFxuICAgICAgJ2xhdW5jaF9kYXRhJzogdGhpcy5sYXVuY2hfZGF0YSxcbiAgICAgICdsZWFybmVyX2lkJzogdGhpcy5sZWFybmVyX2lkLFxuICAgICAgJ2xlYXJuZXJfbmFtZSc6IHRoaXMubGVhcm5lcl9uYW1lLFxuICAgICAgJ2xlYXJuZXJfcHJlZmVyZW5jZSc6IHRoaXMubGVhcm5lcl9wcmVmZXJlbmNlLFxuICAgICAgJ2xvY2F0aW9uJzogdGhpcy5sb2NhdGlvbixcbiAgICAgICdtYXhfdGltZV9hbGxvd2VkJzogdGhpcy5tYXhfdGltZV9hbGxvd2VkLFxuICAgICAgJ21vZGUnOiB0aGlzLm1vZGUsXG4gICAgICAnb2JqZWN0aXZlcyc6IHRoaXMub2JqZWN0aXZlcyxcbiAgICAgICdwcm9ncmVzc19tZWFzdXJlJzogdGhpcy5wcm9ncmVzc19tZWFzdXJlLFxuICAgICAgJ3NjYWxlZF9wYXNzaW5nX3Njb3JlJzogdGhpcy5zY2FsZWRfcGFzc2luZ19zY29yZSxcbiAgICAgICdzY29yZSc6IHRoaXMuc2NvcmUsXG4gICAgICAnc2Vzc2lvbl90aW1lJzogdGhpcy5zZXNzaW9uX3RpbWUsXG4gICAgICAnc3VjY2Vzc19zdGF0dXMnOiB0aGlzLnN1Y2Nlc3Nfc3RhdHVzLFxuICAgICAgJ3N1c3BlbmRfZGF0YSc6IHRoaXMuc3VzcGVuZF9kYXRhLFxuICAgICAgJ3RpbWVfbGltaXRfYWN0aW9uJzogdGhpcy50aW1lX2xpbWl0X2FjdGlvbixcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBTQ09STSAyMDA0J3MgY21pLmxlYXJuZXJfcHJlZmVyZW5jZSBvYmplY3RcbiAqL1xuY2xhc3MgQ01JTGVhcm5lclByZWZlcmVuY2UgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI19jaGlsZHJlbiA9IHNjb3JtMjAwNF9jb25zdGFudHMuc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuO1xuICAjYXVkaW9fbGV2ZWwgPSAnMSc7XG4gICNsYW5ndWFnZSA9ICcnO1xuICAjZGVsaXZlcnlfc3BlZWQgPSAnMSc7XG4gICNhdWRpb19jYXB0aW9uaW5nID0gJzAnO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmxlYXJuZXJfcHJlZmVyZW5jZVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNfY2hpbGRyZW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IF9jaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI19jaGlsZHJlbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfY2hpbGRyZW5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldCBfY2hpbGRyZW4oX2NoaWxkcmVuKSB7XG4gICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjYXVkaW9fbGV2ZWxcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGF1ZGlvX2xldmVsKCkge1xuICAgIHJldHVybiB0aGlzLiNhdWRpb19sZXZlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNhdWRpb19sZXZlbFxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXVkaW9fbGV2ZWxcbiAgICovXG4gIHNldCBhdWRpb19sZXZlbChhdWRpb19sZXZlbCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChhdWRpb19sZXZlbCwgc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwpICYmXG4gICAgICAgIGNoZWNrMjAwNFZhbGlkUmFuZ2UoYXVkaW9fbGV2ZWwsIHNjb3JtMjAwNF9yZWdleC5hdWRpb19yYW5nZSkpIHtcbiAgICAgIHRoaXMuI2F1ZGlvX2xldmVsID0gYXVkaW9fbGV2ZWw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xhbmd1YWdlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsYW5ndWFnZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGFuZ3VhZ2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGFuZ3VhZ2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhbmd1YWdlXG4gICAqL1xuICBzZXQgbGFuZ3VhZ2UobGFuZ3VhZ2UpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQobGFuZ3VhZ2UsIHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nKSkge1xuICAgICAgdGhpcy4jbGFuZ3VhZ2UgPSBsYW5ndWFnZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZGVsaXZlcnlfc3BlZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGRlbGl2ZXJ5X3NwZWVkKCkge1xuICAgIHJldHVybiB0aGlzLiNkZWxpdmVyeV9zcGVlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNkZWxpdmVyeV9zcGVlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGVsaXZlcnlfc3BlZWRcbiAgICovXG4gIHNldCBkZWxpdmVyeV9zcGVlZChkZWxpdmVyeV9zcGVlZCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChkZWxpdmVyeV9zcGVlZCwgc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwpICYmXG4gICAgICAgIGNoZWNrMjAwNFZhbGlkUmFuZ2UoZGVsaXZlcnlfc3BlZWQsIHNjb3JtMjAwNF9yZWdleC5zcGVlZF9yYW5nZSkpIHtcbiAgICAgIHRoaXMuI2RlbGl2ZXJ5X3NwZWVkID0gZGVsaXZlcnlfc3BlZWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2F1ZGlvX2NhcHRpb25pbmdcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGF1ZGlvX2NhcHRpb25pbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2F1ZGlvX2NhcHRpb25pbmc7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjYXVkaW9fY2FwdGlvbmluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gYXVkaW9fY2FwdGlvbmluZ1xuICAgKi9cbiAgc2V0IGF1ZGlvX2NhcHRpb25pbmcoYXVkaW9fY2FwdGlvbmluZykge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChhdWRpb19jYXB0aW9uaW5nLCBzY29ybTIwMDRfcmVnZXguQ01JU0ludGVnZXIpICYmXG4gICAgICAgIGNoZWNrMjAwNFZhbGlkUmFuZ2UoYXVkaW9fY2FwdGlvbmluZywgc2Nvcm0yMDA0X3JlZ2V4LnRleHRfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiNhdWRpb19jYXB0aW9uaW5nID0gYXVkaW9fY2FwdGlvbmluZztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkubGVhcm5lcl9wcmVmZXJlbmNlXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgYXVkaW9fbGV2ZWw6IHN0cmluZyxcbiAgICogICAgICBsYW5ndWFnZTogc3RyaW5nLFxuICAgKiAgICAgIGRlbGl2ZXJ5X3NwZWVkOiBzdHJpbmcsXG4gICAqICAgICAgYXVkaW9fY2FwdGlvbmluZzogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdhdWRpb19sZXZlbCc6IHRoaXMuYXVkaW9fbGV2ZWwsXG4gICAgICAnbGFuZ3VhZ2UnOiB0aGlzLmxhbmd1YWdlLFxuICAgICAgJ2RlbGl2ZXJ5X3NwZWVkJzogdGhpcy5kZWxpdmVyeV9zcGVlZCxcbiAgICAgICdhdWRpb19jYXB0aW9uaW5nJzogdGhpcy5hdWRpb19jYXB0aW9uaW5nLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDIwMDQncyBjbWkuaW50ZXJhY3Rpb25zIG9iamVjdFxuICovXG5jbGFzcyBDTUlJbnRlcmFjdGlvbnMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLm9iamVjdGl2ZXMgQXJyYXlcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHtcbiAgICAgIGNoaWxkcmVuOiBzY29ybTIwMDRfY29uc3RhbnRzLmludGVyYWN0aW9uc19jaGlsZHJlbixcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5ULFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDIwMDQncyBjbWkub2JqZWN0aXZlcyBvYmplY3RcbiAqL1xuY2xhc3MgQ01JT2JqZWN0aXZlcyBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkub2JqZWN0aXZlcyBBcnJheVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe1xuICAgICAgY2hpbGRyZW46IHNjb3JtMjAwNF9jb25zdGFudHMub2JqZWN0aXZlc19jaGlsZHJlbixcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5ULFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDIwMDQncyBjbWkuY29tbWVudHNfZnJvbV9sbXMgb2JqZWN0XG4gKi9cbmNsYXNzIENNSUNvbW1lbnRzRnJvbUxNUyBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuY29tbWVudHNfZnJvbV9sbXMgQXJyYXlcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHtcbiAgICAgIGNoaWxkcmVuOiBzY29ybTIwMDRfY29uc3RhbnRzLmNvbW1lbnRzX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGNtaS5jb21tZW50c19mcm9tX2xlYXJuZXIgb2JqZWN0XG4gKi9cbmNsYXNzIENNSUNvbW1lbnRzRnJvbUxlYXJuZXIgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmNvbW1lbnRzX2Zyb21fbGVhcm5lciBBcnJheVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe1xuICAgICAgY2hpbGRyZW46IHNjb3JtMjAwNF9jb25zdGFudHMuY29tbWVudHNfY2hpbGRyZW4sXG4gICAgICBlcnJvckNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBTQ09STSAyMDA0J3MgY21pLmludGVyYWN0aW9uLm4gb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlJbnRlcmFjdGlvbnNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI2lkID0gJyc7XG4gICN0eXBlID0gJyc7XG4gICN0aW1lc3RhbXAgPSAnJztcbiAgI3dlaWdodGluZyA9ICcnO1xuICAjbGVhcm5lcl9yZXNwb25zZSA9ICcnO1xuICAjcmVzdWx0ID0gJyc7XG4gICNsYXRlbmN5ID0gJyc7XG4gICNkZXNjcmlwdGlvbiA9ICcnO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmludGVyYWN0aW9uLm5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLm9iamVjdGl2ZXMgPSBuZXcgQ01JQXJyYXkoe1xuICAgICAgZXJyb3JDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQsXG4gICAgICBjaGlsZHJlbjogc2Nvcm0yMDA0X2NvbnN0YW50cy5vYmplY3RpdmVzX2NoaWxkcmVuLFxuICAgIH0pO1xuICAgIHRoaXMuY29ycmVjdF9yZXNwb25zZXMgPSBuZXcgQ01JQXJyYXkoe1xuICAgICAgZXJyb3JDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQsXG4gICAgICBjaGlsZHJlbjogc2Nvcm0yMDA0X2NvbnN0YW50cy5jb3JyZWN0X3Jlc3BvbnNlc19jaGlsZHJlbixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5vYmplY3RpdmVzPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5jb3JyZWN0X3Jlc3BvbnNlcz8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2lkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjaWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBzZXQgaWQoaWQpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoaWQsIHNjb3JtMjAwNF9yZWdleC5DTUlMb25nSWRlbnRpZmllcikpIHtcbiAgICAgIHRoaXMuI2lkID0gaWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3R5cGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHR5cGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3R5cGU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdHlwZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICAgKi9cbiAgc2V0IHR5cGUodHlwZSkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdCh0eXBlLCBzY29ybTIwMDRfcmVnZXguQ01JVHlwZSkpIHtcbiAgICAgIHRoaXMuI3R5cGUgPSB0eXBlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0aW1lc3RhbXBcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRpbWVzdGFtcCgpIHtcbiAgICByZXR1cm4gdGhpcy4jdGltZXN0YW1wO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpbWVzdGFtcFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZXN0YW1wXG4gICAqL1xuICBzZXQgdGltZXN0YW1wKHRpbWVzdGFtcCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdCh0aW1lc3RhbXAsIHNjb3JtMjAwNF9yZWdleC5DTUlUaW1lKSkge1xuICAgICAgdGhpcy4jdGltZXN0YW1wID0gdGltZXN0YW1wO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN3ZWlnaHRpbmdcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHdlaWdodGluZygpIHtcbiAgICByZXR1cm4gdGhpcy4jd2VpZ2h0aW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3dlaWdodGluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gd2VpZ2h0aW5nXG4gICAqL1xuICBzZXQgd2VpZ2h0aW5nKHdlaWdodGluZykge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdCh3ZWlnaHRpbmcsIHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsKSkge1xuICAgICAgdGhpcy4jd2VpZ2h0aW5nID0gd2VpZ2h0aW5nO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsZWFybmVyX3Jlc3BvbnNlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsZWFybmVyX3Jlc3BvbnNlKCkge1xuICAgIHJldHVybiB0aGlzLiNsZWFybmVyX3Jlc3BvbnNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xlYXJuZXJfcmVzcG9uc2UuIERvZXMgdHlwZSB2YWxpZGF0aW9uIHRvIG1ha2Ugc3VyZSByZXNwb25zZVxuICAgKiBtYXRjaGVzIFNDT1JNIDIwMDQncyBzcGVjXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZWFybmVyX3Jlc3BvbnNlXG4gICAqL1xuICBzZXQgbGVhcm5lcl9yZXNwb25zZShsZWFybmVyX3Jlc3BvbnNlKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnR5cGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKFxuICAgICAgICAgIHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5ERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBub2RlcyA9IFtdO1xuICAgICAgY29uc3QgcmVzcG9uc2VfdHlwZSA9IGxlYXJuZXJfcmVzcG9uc2VzW3RoaXMudHlwZV07XG4gICAgICBpZiAocmVzcG9uc2VfdHlwZSkge1xuICAgICAgICBpZiAocmVzcG9uc2VfdHlwZT8uZGVsaW1pdGVyKSB7XG4gICAgICAgICAgbm9kZXMgPSBsZWFybmVyX3Jlc3BvbnNlLnNwbGl0KHJlc3BvbnNlX3R5cGUuZGVsaW1pdGVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub2Rlc1swXSA9IGxlYXJuZXJfcmVzcG9uc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoKG5vZGVzLmxlbmd0aCA+IDApICYmIChub2Rlcy5sZW5ndGggPD0gcmVzcG9uc2VfdHlwZS5tYXgpKSB7XG4gICAgICAgICAgY29uc3QgZm9ybWF0UmVnZXggPSBuZXcgUmVnRXhwKHJlc3BvbnNlX3R5cGUuZm9ybWF0KTtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2VfdHlwZT8uZGVsaW1pdGVyMikge1xuICAgICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBub2Rlc1tpXS5zcGxpdChyZXNwb25zZV90eXBlLmRlbGltaXRlcjIpO1xuICAgICAgICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICAgIGlmICghdmFsdWVzWzBdLm1hdGNoKGZvcm1hdFJlZ2V4KSkge1xuICAgICAgICAgICAgICAgICAgdGhyb3dUeXBlTWlzbWF0Y2hFcnJvcigpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBpZiAoIXZhbHVlc1sxXS5tYXRjaChuZXcgUmVnRXhwKHJlc3BvbnNlX3R5cGUuZm9ybWF0MikpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93VHlwZU1pc21hdGNoRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3dUeXBlTWlzbWF0Y2hFcnJvcigpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoIW5vZGVzW2ldLm1hdGNoKGZvcm1hdFJlZ2V4KSkge1xuICAgICAgICAgICAgICAgIHRocm93VHlwZU1pc21hdGNoRXJyb3IoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAobm9kZXNbaV0gIT09ICcnICYmIHJlc3BvbnNlX3R5cGUudW5pcXVlKSB7XG4gICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGk7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAobm9kZXNbaV0gPT09IG5vZGVzW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhyb3dUeXBlTWlzbWF0Y2hFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjcmVzdWx0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCByZXN1bHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3Jlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNyZXN1bHRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlc3VsdFxuICAgKi9cbiAgc2V0IHJlc3VsdChyZXN1bHQpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQocmVzdWx0LCBzY29ybTIwMDRfcmVnZXguQ01JUmVzdWx0KSkge1xuICAgICAgdGhpcy4jcmVzdWx0ID0gcmVzdWx0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsYXRlbmN5XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsYXRlbmN5KCkge1xuICAgIHJldHVybiB0aGlzLiNsYXRlbmN5O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xhdGVuY3lcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhdGVuY3lcbiAgICovXG4gIHNldCBsYXRlbmN5KGxhdGVuY3kpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQobGF0ZW5jeSwgc2Nvcm0yMDA0X3JlZ2V4LkNNSVRpbWVzcGFuKSkge1xuICAgICAgdGhpcy4jbGF0ZW5jeSA9IGxhdGVuY3k7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2Rlc2NyaXB0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBkZXNjcmlwdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jZGVzY3JpcHRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZGVzY3JpcHRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyaXB0aW9uXG4gICAqL1xuICBzZXQgZGVzY3JpcHRpb24oZGVzY3JpcHRpb24pIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoZGVzY3JpcHRpb24sIHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nU3RyaW5nMjUwLCB0cnVlKSkge1xuICAgICAgdGhpcy4jZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuaW50ZXJhY3Rpb25zLm5cbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBpZDogc3RyaW5nLFxuICAgKiAgICAgIHR5cGU6IHN0cmluZyxcbiAgICogICAgICBvYmplY3RpdmVzOiBDTUlBcnJheSxcbiAgICogICAgICB0aW1lc3RhbXA6IHN0cmluZyxcbiAgICogICAgICBjb3JyZWN0X3Jlc3BvbnNlczogQ01JQXJyYXksXG4gICAqICAgICAgd2VpZ2h0aW5nOiBzdHJpbmcsXG4gICAqICAgICAgbGVhcm5lcl9yZXNwb25zZTogc3RyaW5nLFxuICAgKiAgICAgIHJlc3VsdDogc3RyaW5nLFxuICAgKiAgICAgIGxhdGVuY3k6IHN0cmluZyxcbiAgICogICAgICBkZXNjcmlwdGlvbjogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdpZCc6IHRoaXMuaWQsXG4gICAgICAndHlwZSc6IHRoaXMudHlwZSxcbiAgICAgICdvYmplY3RpdmVzJzogdGhpcy5vYmplY3RpdmVzLFxuICAgICAgJ3RpbWVzdGFtcCc6IHRoaXMudGltZXN0YW1wLFxuICAgICAgJ3dlaWdodGluZyc6IHRoaXMud2VpZ2h0aW5nLFxuICAgICAgJ2xlYXJuZXJfcmVzcG9uc2UnOiB0aGlzLmxlYXJuZXJfcmVzcG9uc2UsXG4gICAgICAncmVzdWx0JzogdGhpcy5yZXN1bHQsXG4gICAgICAnbGF0ZW5jeSc6IHRoaXMubGF0ZW5jeSxcbiAgICAgICdkZXNjcmlwdGlvbic6IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICAnY29ycmVjdF9yZXNwb25zZXMnOiB0aGlzLmNvcnJlY3RfcmVzcG9uc2VzLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIFNDT1JNIDIwMDQncyBjbWkub2JqZWN0aXZlcy5uIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JT2JqZWN0aXZlc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAjaWQgPSAnJztcbiAgI3N1Y2Nlc3Nfc3RhdHVzID0gJ3Vua25vd24nO1xuICAjY29tcGxldGlvbl9zdGF0dXMgPSAndW5rbm93bic7XG4gICNwcm9ncmVzc19tZWFzdXJlID0gJyc7XG4gICNkZXNjcmlwdGlvbiA9ICcnO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLm9iamVjdGl2ZXMublxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc2NvcmUgPSBuZXcgU2Nvcm0yMDA0Q01JU2NvcmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zY29yZT8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2lkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjaWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBzZXQgaWQoaWQpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoaWQsIHNjb3JtMjAwNF9yZWdleC5DTUlMb25nSWRlbnRpZmllcikpIHtcbiAgICAgIHRoaXMuI2lkID0gaWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N1Y2Nlc3Nfc3RhdHVzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdWNjZXNzX3N0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jc3VjY2Vzc19zdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3VjY2Vzc19zdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN1Y2Nlc3Nfc3RhdHVzXG4gICAqL1xuICBzZXQgc3VjY2Vzc19zdGF0dXMoc3VjY2Vzc19zdGF0dXMpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoc3VjY2Vzc19zdGF0dXMsIHNjb3JtMjAwNF9yZWdleC5DTUlTU3RhdHVzKSkge1xuICAgICAgdGhpcy4jc3VjY2Vzc19zdGF0dXMgPSBzdWNjZXNzX3N0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29tcGxldGlvbl9zdGF0dXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbXBsZXRpb25fc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNjb21wbGV0aW9uX3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb21wbGV0aW9uX3N0YXR1c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY29tcGxldGlvbl9zdGF0dXNcbiAgICovXG4gIHNldCBjb21wbGV0aW9uX3N0YXR1cyhjb21wbGV0aW9uX3N0YXR1cykge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChjb21wbGV0aW9uX3N0YXR1cywgc2Nvcm0yMDA0X3JlZ2V4LkNNSUNTdGF0dXMpKSB7XG4gICAgICB0aGlzLiNjb21wbGV0aW9uX3N0YXR1cyA9IGNvbXBsZXRpb25fc3RhdHVzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNwcm9ncmVzc19tZWFzdXJlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBwcm9ncmVzc19tZWFzdXJlKCkge1xuICAgIHJldHVybiB0aGlzLiNwcm9ncmVzc19tZWFzdXJlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3Byb2dyZXNzX21lYXN1cmVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb2dyZXNzX21lYXN1cmVcbiAgICovXG4gIHNldCBwcm9ncmVzc19tZWFzdXJlKHByb2dyZXNzX21lYXN1cmUpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQocHJvZ3Jlc3NfbWVhc3VyZSwgc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwpICYmXG4gICAgICAgIGNoZWNrMjAwNFZhbGlkUmFuZ2UocHJvZ3Jlc3NfbWVhc3VyZSwgc2Nvcm0yMDA0X3JlZ2V4LnByb2dyZXNzX3JhbmdlKSkge1xuICAgICAgdGhpcy4jcHJvZ3Jlc3NfbWVhc3VyZSA9IHByb2dyZXNzX21lYXN1cmU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2Rlc2NyaXB0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBkZXNjcmlwdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jZGVzY3JpcHRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZGVzY3JpcHRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyaXB0aW9uXG4gICAqL1xuICBzZXQgZGVzY3JpcHRpb24oZGVzY3JpcHRpb24pIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoZGVzY3JpcHRpb24sIHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nU3RyaW5nMjUwLCB0cnVlKSkge1xuICAgICAgdGhpcy4jZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkub2JqZWN0aXZlcy5uXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgaWQ6IHN0cmluZyxcbiAgICogICAgICBzdWNjZXNzX3N0YXR1czogc3RyaW5nLFxuICAgKiAgICAgIGNvbXBsZXRpb25fc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgcHJvZ3Jlc3NfbWVhc3VyZTogc3RyaW5nLFxuICAgKiAgICAgIGRlc2NyaXB0aW9uOiBzdHJpbmcsXG4gICAqICAgICAgc2NvcmU6IFNjb3JtMjAwNENNSVNjb3JlXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdpZCc6IHRoaXMuaWQsXG4gICAgICAnc3VjY2Vzc19zdGF0dXMnOiB0aGlzLnN1Y2Nlc3Nfc3RhdHVzLFxuICAgICAgJ2NvbXBsZXRpb25fc3RhdHVzJzogdGhpcy5jb21wbGV0aW9uX3N0YXR1cyxcbiAgICAgICdwcm9ncmVzc19tZWFzdXJlJzogdGhpcy5wcm9ncmVzc19tZWFzdXJlLFxuICAgICAgJ2Rlc2NyaXB0aW9uJzogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgICdzY29yZSc6IHRoaXMuc2NvcmUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgU0NPUk0gMjAwNCdzIGNtaSAqLnNjb3JlIG9iamVjdFxuICovXG5jbGFzcyBTY29ybTIwMDRDTUlTY29yZSBleHRlbmRzIENNSVNjb3JlIHtcbiAgI3NjYWxlZCA9ICcnO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pICouc2NvcmVcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFxuICAgICAgICB7XG4gICAgICAgICAgc2NvcmVfY2hpbGRyZW46IHNjb3JtMjAwNF9jb25zdGFudHMuc2NvcmVfY2hpbGRyZW4sXG4gICAgICAgICAgbWF4OiAnJyxcbiAgICAgICAgICBpbnZhbGlkRXJyb3JDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQsXG4gICAgICAgICAgaW52YWxpZFR5cGVDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCxcbiAgICAgICAgICBpbnZhbGlkUmFuZ2VDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFLFxuICAgICAgICAgIGRlY2ltYWxSZWdleDogc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwsXG4gICAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3NjYWxlZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc2NhbGVkKCkge1xuICAgIHJldHVybiB0aGlzLiNzY2FsZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc2NhbGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY2FsZWRcbiAgICovXG4gIHNldCBzY2FsZWQoc2NhbGVkKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHNjYWxlZCwgc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwpICYmXG4gICAgICAgIGNoZWNrMjAwNFZhbGlkUmFuZ2Uoc2NhbGVkLCBzY29ybTIwMDRfcmVnZXguc2NhbGVkX3JhbmdlKSkge1xuICAgICAgdGhpcy4jc2NhbGVkID0gc2NhbGVkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaSAqLnNjb3JlXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgc2NhbGVkOiBzdHJpbmcsXG4gICAqICAgICAgcmF3OiBzdHJpbmcsXG4gICAqICAgICAgbWluOiBzdHJpbmcsXG4gICAqICAgICAgbWF4OiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3NjYWxlZCc6IHRoaXMuc2NhbGVkLFxuICAgICAgJ3Jhdyc6IHN1cGVyLnJhdyxcbiAgICAgICdtaW4nOiBzdXBlci5taW4sXG4gICAgICAnbWF4Jzogc3VwZXIubWF4LFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDIwMDQncyBjbWkuY29tbWVudHNfZnJvbV9sZWFybmVyLm4gYW5kIGNtaS5jb21tZW50c19mcm9tX2xtcy5uIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JQ29tbWVudHNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI2NvbW1lbnQgPSAnJztcbiAgI2xvY2F0aW9uID0gJyc7XG4gICN0aW1lc3RhbXAgPSAnJztcbiAgI3JlYWRPbmx5QWZ0ZXJJbml0O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmNvbW1lbnRzX2Zyb21fbGVhcm5lci5uIGFuZCBjbWkuY29tbWVudHNfZnJvbV9sbXMublxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHJlYWRPbmx5QWZ0ZXJJbml0XG4gICAqL1xuICBjb25zdHJ1Y3RvcihyZWFkT25seUFmdGVySW5pdCA9IGZhbHNlKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLiNjb21tZW50ID0gJyc7XG4gICAgdGhpcy4jbG9jYXRpb24gPSAnJztcbiAgICB0aGlzLiN0aW1lc3RhbXAgPSAnJztcbiAgICB0aGlzLiNyZWFkT25seUFmdGVySW5pdCA9IHJlYWRPbmx5QWZ0ZXJJbml0O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NvbW1lbnRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbW1lbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29tbWVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29tbWVudFxuICAgKi9cbiAgc2V0IGNvbW1lbnQoY29tbWVudCkge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkICYmIHRoaXMuI3JlYWRPbmx5QWZ0ZXJJbml0KSB7XG4gICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGNvbW1lbnQsIHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nU3RyaW5nNDAwMCwgdHJ1ZSkpIHtcbiAgICAgICAgdGhpcy4jY29tbWVudCA9IGNvbW1lbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xvY2F0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsb2NhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jbG9jYXRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbG9jYXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uXG4gICAqL1xuICBzZXQgbG9jYXRpb24obG9jYXRpb24pIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNyZWFkT25seUFmdGVySW5pdCkge1xuICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChsb2NhdGlvbiwgc2Nvcm0yMDA0X3JlZ2V4LkNNSVN0cmluZzI1MCkpIHtcbiAgICAgICAgdGhpcy4jbG9jYXRpb24gPSBsb2NhdGlvbjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZXN0YW1wXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lc3RhbXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWVzdGFtcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lc3RhbXBcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVzdGFtcFxuICAgKi9cbiAgc2V0IHRpbWVzdGFtcCh0aW1lc3RhbXApIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNyZWFkT25seUFmdGVySW5pdCkge1xuICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdCh0aW1lc3RhbXAsIHNjb3JtMjAwNF9yZWdleC5DTUlUaW1lKSkge1xuICAgICAgICB0aGlzLiN0aW1lc3RhbXAgPSB0aW1lc3RhbXA7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmNvbW1lbnRzX2Zyb21fbGVhcm5lci5uIG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGNvbW1lbnQ6IHN0cmluZyxcbiAgICogICAgICBsb2NhdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIHRpbWVzdGFtcDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdjb21tZW50JzogdGhpcy5jb21tZW50LFxuICAgICAgJ2xvY2F0aW9uJzogdGhpcy5sb2NhdGlvbixcbiAgICAgICd0aW1lc3RhbXAnOiB0aGlzLnRpbWVzdGFtcCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmludGVyYWN0aW9ucy5uLm9iamVjdGl2ZXMubiBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc09iamVjdGl2ZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI2lkID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4ub2JqZWN0aXZlcy5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2lkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjaWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBzZXQgaWQoaWQpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoaWQsIHNjb3JtMjAwNF9yZWdleC5DTUlMb25nSWRlbnRpZmllcikpIHtcbiAgICAgIHRoaXMuI2lkID0gaWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmludGVyYWN0aW9ucy5uLm9iamVjdGl2ZXMublxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGlkOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmludGVyYWN0aW9ucy5uLmNvcnJlY3RfcmVzcG9uc2VzLm4gb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlJbnRlcmFjdGlvbnNDb3JyZWN0UmVzcG9uc2VzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNwYXR0ZXJuID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4uY29ycmVjdF9yZXNwb25zZXMublxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNwYXR0ZXJuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBwYXR0ZXJuKCkge1xuICAgIHJldHVybiB0aGlzLiNwYXR0ZXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3BhdHRlcm5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdHRlcm5cbiAgICovXG4gIHNldCBwYXR0ZXJuKHBhdHRlcm4pIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQocGF0dGVybiwgc2Nvcm0yMDA0X3JlZ2V4LkNNSUZlZWRiYWNrKSkge1xuICAgICAgdGhpcy4jcGF0dGVybiA9IHBhdHRlcm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBjbWkuaW50ZXJhY3Rpb25zLm4uY29ycmVjdF9yZXNwb25zZXMubiBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBwYXR0ZXJuOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3BhdHRlcm4nOiB0aGlzLnBhdHRlcm4sXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGFkbCBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIEFETCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGFkbFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubmF2ID0gbmV3IEFETE5hdigpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLm5hdj8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgYWRsXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgbmF2OiB7XG4gICAqICAgICAgICByZXF1ZXN0OiBzdHJpbmdcbiAgICogICAgICB9XG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICduYXYnOiB0aGlzLm5hdixcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgYWRsLm5hdiBvYmplY3RcbiAqL1xuY2xhc3MgQURMTmF2IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNyZXF1ZXN0ID0gJ19ub25lXyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBhZGwubmF2XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5yZXF1ZXN0X3ZhbGlkID0gbmV3IEFETE5hdlJlcXVlc3RWYWxpZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnJlcXVlc3RfdmFsaWQ/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNyZXF1ZXN0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCByZXF1ZXN0KCkge1xuICAgIHJldHVybiB0aGlzLiNyZXF1ZXN0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3JlcXVlc3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlcXVlc3RcbiAgICovXG4gIHNldCByZXF1ZXN0KHJlcXVlc3QpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQocmVxdWVzdCwgc2Nvcm0yMDA0X3JlZ2V4Lk5BVkV2ZW50KSkge1xuICAgICAgdGhpcy4jcmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgYWRsLm5hdlxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHJlcXVlc3Q6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAncmVxdWVzdCc6IHRoaXMucmVxdWVzdCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgYWRsLm5hdi5yZXF1ZXN0X3ZhbGlkIG9iamVjdFxuICovXG5jbGFzcyBBRExOYXZSZXF1ZXN0VmFsaWQgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI2NvbnRpbnVlID0gJ3Vua25vd24nO1xuICAjcHJldmlvdXMgPSAndW5rbm93bic7XG4gIGNob2ljZSA9IGNsYXNzIHtcbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0YXJnZXQgaXMgdmFsaWRcbiAgICAgKiBAcGFyYW0geyp9IF90YXJnZXRcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgX2lzVGFyZ2V0VmFsaWQgPSAoX3RhcmdldCkgPT4gJ3Vua25vd24nO1xuICB9O1xuICBqdW1wID0gY2xhc3Mge1xuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRhcmdldCBpcyB2YWxpZFxuICAgICAqIEBwYXJhbSB7Kn0gX3RhcmdldFxuICAgICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICAgKi9cbiAgICBfaXNUYXJnZXRWYWxpZCA9IChfdGFyZ2V0KSA9PiAndW5rbm93bic7XG4gIH07XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBhZGwubmF2LnJlcXVlc3RfdmFsaWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29udGludWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbnRpbnVlKCkge1xuICAgIHJldHVybiB0aGlzLiNjb250aW51ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb250aW51ZS4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7Kn0gX1xuICAgKi9cbiAgc2V0IGNvbnRpbnVlKF8pIHtcbiAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNwcmV2aW91c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgcHJldmlvdXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3ByZXZpb3VzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3ByZXZpb3VzLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHsqfSBfXG4gICAqL1xuICBzZXQgcHJldmlvdXMoXykge1xuICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgYWRsLm5hdi5yZXF1ZXN0X3ZhbGlkXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgcHJldmlvdXM6IHN0cmluZyxcbiAgICogICAgICBjb250aW51ZTogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdwcmV2aW91cyc6IHRoaXMucHJldmlvdXMsXG4gICAgICAnY29udGludWUnOiB0aGlzLmNvbnRpbnVlLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iLCIvLyBAZmxvd1xuXG5jb25zdCBnbG9iYWwgPSB7XG4gIFNDT1JNX1RSVUU6ICd0cnVlJyxcbiAgU0NPUk1fRkFMU0U6ICdmYWxzZScsXG4gIFNUQVRFX05PVF9JTklUSUFMSVpFRDogMCxcbiAgU1RBVEVfSU5JVElBTElaRUQ6IDEsXG4gIFNUQVRFX1RFUk1JTkFURUQ6IDIsXG4gIExPR19MRVZFTF9ERUJVRzogMSxcbiAgTE9HX0xFVkVMX0lORk86IDIsXG4gIExPR19MRVZFTF9XQVJOSU5HOiAzLFxuICBMT0dfTEVWRUxfRVJST1I6IDQsXG4gIExPR19MRVZFTF9OT05FOiA1LFxufTtcblxuY29uc3Qgc2Nvcm0xMiA9IHtcbiAgLy8gQ2hpbGRyZW4gbGlzdHNcbiAgY21pX2NoaWxkcmVuOiAnY29yZSxzdXNwZW5kX2RhdGEsbGF1bmNoX2RhdGEsY29tbWVudHMsb2JqZWN0aXZlcyxzdHVkZW50X2RhdGEsc3R1ZGVudF9wcmVmZXJlbmNlLGludGVyYWN0aW9ucycsXG4gIGNvcmVfY2hpbGRyZW46ICdzdHVkZW50X2lkLHN0dWRlbnRfbmFtZSxsZXNzb25fbG9jYXRpb24sY3JlZGl0LGxlc3Nvbl9zdGF0dXMsZW50cnksc2NvcmUsdG90YWxfdGltZSxsZXNzb25fbW9kZSxleGl0LHNlc3Npb25fdGltZScsXG4gIHNjb3JlX2NoaWxkcmVuOiAncmF3LG1pbixtYXgnLFxuICBjb21tZW50c19jaGlsZHJlbjogJ2NvbnRlbnQsbG9jYXRpb24sdGltZScsXG4gIG9iamVjdGl2ZXNfY2hpbGRyZW46ICdpZCxzY29yZSxzdGF0dXMnLFxuICBjb3JyZWN0X3Jlc3BvbnNlc19jaGlsZHJlbjogJ3BhdHRlcm4nLFxuICBzdHVkZW50X2RhdGFfY2hpbGRyZW46ICdtYXN0ZXJ5X3Njb3JlLG1heF90aW1lX2FsbG93ZWQsdGltZV9saW1pdF9hY3Rpb24nLFxuICBzdHVkZW50X3ByZWZlcmVuY2VfY2hpbGRyZW46ICdhdWRpbyxsYW5ndWFnZSxzcGVlZCx0ZXh0JyxcbiAgaW50ZXJhY3Rpb25zX2NoaWxkcmVuOiAnaWQsb2JqZWN0aXZlcyx0aW1lLHR5cGUsY29ycmVjdF9yZXNwb25zZXMsd2VpZ2h0aW5nLHN0dWRlbnRfcmVzcG9uc2UscmVzdWx0LGxhdGVuY3knLFxuXG4gIGVycm9yX2Rlc2NyaXB0aW9uczoge1xuICAgICcxMDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIEV4Y2VwdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTm8gc3BlY2lmaWMgZXJyb3IgY29kZSBleGlzdHMgdG8gZGVzY3JpYmUgdGhlIGVycm9yLiBVc2UgTE1TR2V0RGlhZ25vc3RpYyBmb3IgbW9yZSBpbmZvcm1hdGlvbicsXG4gICAgfSxcbiAgICAnMjAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnSW52YWxpZCBhcmd1bWVudCBlcnJvcicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIHRoYXQgYW4gYXJndW1lbnQgcmVwcmVzZW50cyBhbiBpbnZhbGlkIGRhdGEgbW9kZWwgZWxlbWVudCBvciBpcyBvdGhlcndpc2UgaW5jb3JyZWN0LicsXG4gICAgfSxcbiAgICAnMjAyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRWxlbWVudCBjYW5ub3QgaGF2ZSBjaGlsZHJlbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIHRoYXQgTE1TR2V0VmFsdWUgd2FzIGNhbGxlZCB3aXRoIGEgZGF0YSBtb2RlbCBlbGVtZW50IG5hbWUgdGhhdCBlbmRzIGluIFwiX2NoaWxkcmVuXCIgZm9yIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgZG9lcyBub3Qgc3VwcG9ydCB0aGUgXCJfY2hpbGRyZW5cIiBzdWZmaXguJyxcbiAgICB9LFxuICAgICcyMDMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdFbGVtZW50IG5vdCBhbiBhcnJheSAtIGNhbm5vdCBoYXZlIGNvdW50JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgdGhhdCBMTVNHZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSBkYXRhIG1vZGVsIGVsZW1lbnQgbmFtZSB0aGF0IGVuZHMgaW4gXCJfY291bnRcIiBmb3IgYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBkb2VzIG5vdCBzdXBwb3J0IHRoZSBcIl9jb3VudFwiIHN1ZmZpeC4nLFxuICAgIH0sXG4gICAgJzMwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ05vdCBpbml0aWFsaXplZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIHRoYXQgYW4gQVBJIGNhbGwgd2FzIG1hZGUgYmVmb3JlIHRoZSBjYWxsIHRvIGxtc0luaXRpYWxpemUuJyxcbiAgICB9LFxuICAgICc0MDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdOb3QgaW1wbGVtZW50ZWQgZXJyb3InLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1RoZSBkYXRhIG1vZGVsIGVsZW1lbnQgaW5kaWNhdGVkIGluIGEgY2FsbCB0byBMTVNHZXRWYWx1ZSBvciBMTVNTZXRWYWx1ZSBpcyB2YWxpZCwgYnV0IHdhcyBub3QgaW1wbGVtZW50ZWQgYnkgdGhpcyBMTVMuIFNDT1JNIDEuMiBkZWZpbmVzIGEgc2V0IG9mIGRhdGEgbW9kZWwgZWxlbWVudHMgYXMgYmVpbmcgb3B0aW9uYWwgZm9yIGFuIExNUyB0byBpbXBsZW1lbnQuJyxcbiAgICB9LFxuICAgICc0MDInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdJbnZhbGlkIHNldCB2YWx1ZSwgZWxlbWVudCBpcyBhIGtleXdvcmQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyB0aGF0IExNU1NldFZhbHVlIHdhcyBjYWxsZWQgb24gYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCByZXByZXNlbnRzIGEga2V5d29yZCAoZWxlbWVudHMgdGhhdCBlbmQgaW4gXCJfY2hpbGRyZW5cIiBhbmQgXCJfY291bnRcIikuJyxcbiAgICB9LFxuICAgICc0MDMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdFbGVtZW50IGlzIHJlYWQgb25seScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTE1TU2V0VmFsdWUgd2FzIGNhbGxlZCB3aXRoIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgY2FuIG9ubHkgYmUgcmVhZC4nLFxuICAgIH0sXG4gICAgJzQwNCc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0VsZW1lbnQgaXMgd3JpdGUgb25seScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTE1TR2V0VmFsdWUgd2FzIGNhbGxlZCBvbiBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IGNhbiBvbmx5IGJlIHdyaXR0ZW4gdG8uJyxcbiAgICB9LFxuICAgICc0MDUnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdJbmNvcnJlY3QgRGF0YSBUeXBlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdMTVNTZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSB2YWx1ZSB0aGF0IGlzIG5vdCBjb25zaXN0ZW50IHdpdGggdGhlIGRhdGEgZm9ybWF0IG9mIHRoZSBzdXBwbGllZCBkYXRhIG1vZGVsIGVsZW1lbnQuJyxcbiAgICB9LFxuICB9LFxufTtcblxuY29uc3QgYWljYyA9IHtcbiAgLi4uc2Nvcm0xMiwgLi4ue1xuICAgIGNtaV9jaGlsZHJlbjogJ2NvcmUsc3VzcGVuZF9kYXRhLGxhdW5jaF9kYXRhLGNvbW1lbnRzLG9iamVjdGl2ZXMsc3R1ZGVudF9kYXRhLHN0dWRlbnRfcHJlZmVyZW5jZSxpbnRlcmFjdGlvbnMsZXZhbHVhdGlvbicsXG4gICAgc3R1ZGVudF9kYXRhX2NoaWxkcmVuOiAnYXR0ZW1wdF9udW1iZXIsdHJpZXMsbWFzdGVyeV9zY29yZSxtYXhfdGltZV9hbGxvd2VkLHRpbWVfbGltaXRfYWN0aW9uJyxcbiAgICB0cmllc19jaGlsZHJlbjogJ3RpbWUsc3RhdHVzLHNjb3JlJyxcbiAgfSxcbn07XG5cbmNvbnN0IHNjb3JtMjAwNCA9IHtcbiAgLy8gQ2hpbGRyZW4gbGlzdHNcbiAgY21pX2NoaWxkcmVuOiAnX3ZlcnNpb24sY29tbWVudHNfZnJvbV9sZWFybmVyLGNvbW1lbnRzX2Zyb21fbG1zLGNvbXBsZXRpb25fc3RhdHVzLGNyZWRpdCxlbnRyeSxleGl0LGludGVyYWN0aW9ucyxsYXVuY2hfZGF0YSxsZWFybmVyX2lkLGxlYXJuZXJfbmFtZSxsZWFybmVyX3ByZWZlcmVuY2UsbG9jYXRpb24sbWF4X3RpbWVfYWxsb3dlZCxtb2RlLG9iamVjdGl2ZXMscHJvZ3Jlc3NfbWVhc3VyZSxzY2FsZWRfcGFzc2luZ19zY29yZSxzY29yZSxzZXNzaW9uX3RpbWUsc3VjY2Vzc19zdGF0dXMsc3VzcGVuZF9kYXRhLHRpbWVfbGltaXRfYWN0aW9uLHRvdGFsX3RpbWUnLFxuICBjb21tZW50c19jaGlsZHJlbjogJ2NvbW1lbnQsdGltZXN0YW1wLGxvY2F0aW9uJyxcbiAgc2NvcmVfY2hpbGRyZW46ICdtYXgscmF3LHNjYWxlZCxtaW4nLFxuICBvYmplY3RpdmVzX2NoaWxkcmVuOiAncHJvZ3Jlc3NfbWVhc3VyZSxjb21wbGV0aW9uX3N0YXR1cyxzdWNjZXNzX3N0YXR1cyxkZXNjcmlwdGlvbixzY29yZSxpZCcsXG4gIGNvcnJlY3RfcmVzcG9uc2VzX2NoaWxkcmVuOiAncGF0dGVybicsXG4gIHN0dWRlbnRfZGF0YV9jaGlsZHJlbjogJ21hc3Rlcnlfc2NvcmUsbWF4X3RpbWVfYWxsb3dlZCx0aW1lX2xpbWl0X2FjdGlvbicsXG4gIHN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbjogJ2F1ZGlvX2xldmVsLGF1ZGlvX2NhcHRpb25pbmcsZGVsaXZlcnlfc3BlZWQsbGFuZ3VhZ2UnLFxuICBpbnRlcmFjdGlvbnNfY2hpbGRyZW46ICdpZCx0eXBlLG9iamVjdGl2ZXMsdGltZXN0YW1wLGNvcnJlY3RfcmVzcG9uc2VzLHdlaWdodGluZyxsZWFybmVyX3Jlc3BvbnNlLHJlc3VsdCxsYXRlbmN5LGRlc2NyaXB0aW9uJyxcblxuICBlcnJvcl9kZXNjcmlwdGlvbnM6IHtcbiAgICAnMCc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ05vIEVycm9yJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdObyBlcnJvciBvY2N1cnJlZCwgdGhlIHByZXZpb3VzIEFQSSBjYWxsIHdhcyBzdWNjZXNzZnVsLicsXG4gICAgfSxcbiAgICAnMTAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBFeGNlcHRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ05vIHNwZWNpZmljIGVycm9yIGNvZGUgZXhpc3RzIHRvIGRlc2NyaWJlIHRoZSBlcnJvci4gVXNlIEdldERpYWdub3N0aWMgZm9yIG1vcmUgaW5mb3JtYXRpb24uJyxcbiAgICB9LFxuICAgICcxMDInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIEluaXRpYWxpemF0aW9uIEZhaWx1cmUnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gSW5pdGlhbGl6ZSBmYWlsZWQgZm9yIGFuIHVua25vd24gcmVhc29uLicsXG4gICAgfSxcbiAgICAnMTAzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnQWxyZWFkeSBJbml0aWFsaXplZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBJbml0aWFsaXplIGZhaWxlZCBiZWNhdXNlIEluaXRpYWxpemUgd2FzIGFscmVhZHkgY2FsbGVkLicsXG4gICAgfSxcbiAgICAnMTA0Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnQ29udGVudCBJbnN0YW5jZSBUZXJtaW5hdGVkJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIEluaXRpYWxpemUgZmFpbGVkIGJlY2F1c2UgVGVybWluYXRlIHdhcyBhbHJlYWR5IGNhbGxlZC4nLFxuICAgIH0sXG4gICAgJzExMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgVGVybWluYXRpb24gRmFpbHVyZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBUZXJtaW5hdGUgZmFpbGVkIGZvciBhbiB1bmtub3duIHJlYXNvbi4nLFxuICAgIH0sXG4gICAgJzExMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1Rlcm1pbmF0aW9uIEJlZm9yZSBJbml0aWFsaXphdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBUZXJtaW5hdGUgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYmVmb3JlIHRoZSBjYWxsIHRvIEluaXRpYWxpemUuJyxcbiAgICB9LFxuICAgICcxMTMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdUZXJtaW5hdGlvbiBBZnRlciBUZXJtaW5hdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBUZXJtaW5hdGUgZmFpbGVkIGJlY2F1c2UgVGVybWluYXRlIHdhcyBhbHJlYWR5IGNhbGxlZC4nLFxuICAgIH0sXG4gICAgJzEyMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1JldHJpZXZlIERhdGEgQmVmb3JlIEluaXRpYWxpemF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIEdldFZhbHVlIGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGJlZm9yZSB0aGUgY2FsbCB0byBJbml0aWFsaXplLicsXG4gICAgfSxcbiAgICAnMTIzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnUmV0cmlldmUgRGF0YSBBZnRlciBUZXJtaW5hdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBHZXRWYWx1ZSBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBhZnRlciB0aGUgY2FsbCB0byBUZXJtaW5hdGUuJyxcbiAgICB9LFxuICAgICcxMzInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdTdG9yZSBEYXRhIEJlZm9yZSBJbml0aWFsaXphdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBTZXRWYWx1ZSBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBiZWZvcmUgdGhlIGNhbGwgdG8gSW5pdGlhbGl6ZS4nLFxuICAgIH0sXG4gICAgJzEzMyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1N0b3JlIERhdGEgQWZ0ZXIgVGVybWluYXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gU2V0VmFsdWUgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYWZ0ZXIgdGhlIGNhbGwgdG8gVGVybWluYXRlLicsXG4gICAgfSxcbiAgICAnMTQyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnQ29tbWl0IEJlZm9yZSBJbml0aWFsaXphdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBDb21taXQgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYmVmb3JlIHRoZSBjYWxsIHRvIEluaXRpYWxpemUuJyxcbiAgICB9LFxuICAgICcxNDMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdDb21taXQgQWZ0ZXIgVGVybWluYXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gQ29tbWl0IGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGFmdGVyIHRoZSBjYWxsIHRvIFRlcm1pbmF0ZS4nLFxuICAgIH0sXG4gICAgJzIwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgQXJndW1lbnQgRXJyb3InLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0FuIGludmFsaWQgYXJndW1lbnQgd2FzIHBhc3NlZCB0byBhbiBBUEkgbWV0aG9kICh1c3VhbGx5IGluZGljYXRlcyB0aGF0IEluaXRpYWxpemUsIENvbW1pdCBvciBUZXJtaW5hdGUgZGlkIG5vdCByZWNlaXZlIHRoZSBleHBlY3RlZCBlbXB0eSBzdHJpbmcgYXJndW1lbnQuJyxcbiAgICB9LFxuICAgICczMDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIEdldCBGYWlsdXJlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgYSBmYWlsZWQgR2V0VmFsdWUgY2FsbCB3aGVyZSBubyBvdGhlciBzcGVjaWZpYyBlcnJvciBjb2RlIGlzIGFwcGxpY2FibGUuIFVzZSBHZXREaWFnbm9zdGljIGZvciBtb3JlIGluZm9ybWF0aW9uLicsXG4gICAgfSxcbiAgICAnMzUxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBTZXQgRmFpbHVyZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIGEgZmFpbGVkIFNldFZhbHVlIGNhbGwgd2hlcmUgbm8gb3RoZXIgc3BlY2lmaWMgZXJyb3IgY29kZSBpcyBhcHBsaWNhYmxlLiBVc2UgR2V0RGlhZ25vc3RpYyBmb3IgbW9yZSBpbmZvcm1hdGlvbi4nLFxuICAgIH0sXG4gICAgJzM5MSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgQ29tbWl0IEZhaWx1cmUnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyBhIGZhaWxlZCBDb21taXQgY2FsbCB3aGVyZSBubyBvdGhlciBzcGVjaWZpYyBlcnJvciBjb2RlIGlzIGFwcGxpY2FibGUuIFVzZSBHZXREaWFnbm9zdGljIGZvciBtb3JlIGluZm9ybWF0aW9uLicsXG4gICAgfSxcbiAgICAnNDAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnVW5kZWZpbmVkIERhdGEgTW9kZWwgRWxlbWVudCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnVGhlIGRhdGEgbW9kZWwgZWxlbWVudCBuYW1lIHBhc3NlZCB0byBHZXRWYWx1ZSBvciBTZXRWYWx1ZSBpcyBub3QgYSB2YWxpZCBTQ09STSBkYXRhIG1vZGVsIGVsZW1lbnQuJyxcbiAgICB9LFxuICAgICc0MDInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdVbmltcGxlbWVudGVkIERhdGEgTW9kZWwgRWxlbWVudCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnVGhlIGRhdGEgbW9kZWwgZWxlbWVudCBpbmRpY2F0ZWQgaW4gYSBjYWxsIHRvIEdldFZhbHVlIG9yIFNldFZhbHVlIGlzIHZhbGlkLCBidXQgd2FzIG5vdCBpbXBsZW1lbnRlZCBieSB0aGlzIExNUy4gSW4gU0NPUk0gMjAwNCwgdGhpcyBlcnJvciB3b3VsZCBpbmRpY2F0ZSBhbiBMTVMgdGhhdCBpcyBub3QgZnVsbHkgU0NPUk0gY29uZm9ybWFudC4nLFxuICAgIH0sXG4gICAgJzQwMyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0RhdGEgTW9kZWwgRWxlbWVudCBWYWx1ZSBOb3QgSW5pdGlhbGl6ZWQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0F0dGVtcHQgdG8gcmVhZCBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IGhhcyBub3QgYmVlbiBpbml0aWFsaXplZCBieSB0aGUgTE1TIG9yIHRocm91Z2ggYSBTZXRWYWx1ZSBjYWxsLiBUaGlzIGVycm9yIGNvbmRpdGlvbiBpcyBvZnRlbiByZWFjaGVkIGR1cmluZyBub3JtYWwgZXhlY3V0aW9uIG9mIGEgU0NPLicsXG4gICAgfSxcbiAgICAnNDA0Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBFbGVtZW50IElzIFJlYWQgT25seScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnU2V0VmFsdWUgd2FzIGNhbGxlZCB3aXRoIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgY2FuIG9ubHkgYmUgcmVhZC4nLFxuICAgIH0sXG4gICAgJzQwNSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0RhdGEgTW9kZWwgRWxlbWVudCBJcyBXcml0ZSBPbmx5JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdHZXRWYWx1ZSB3YXMgY2FsbGVkIG9uIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgY2FuIG9ubHkgYmUgd3JpdHRlbiB0by4nLFxuICAgIH0sXG4gICAgJzQwNic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0RhdGEgTW9kZWwgRWxlbWVudCBUeXBlIE1pc21hdGNoJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdTZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSB2YWx1ZSB0aGF0IGlzIG5vdCBjb25zaXN0ZW50IHdpdGggdGhlIGRhdGEgZm9ybWF0IG9mIHRoZSBzdXBwbGllZCBkYXRhIG1vZGVsIGVsZW1lbnQuJyxcbiAgICB9LFxuICAgICc0MDcnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdEYXRhIE1vZGVsIEVsZW1lbnQgVmFsdWUgT3V0IE9mIFJhbmdlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdUaGUgbnVtZXJpYyB2YWx1ZSBzdXBwbGllZCB0byBhIFNldFZhbHVlIGNhbGwgaXMgb3V0c2lkZSBvZiB0aGUgbnVtZXJpYyByYW5nZSBhbGxvd2VkIGZvciB0aGUgc3VwcGxpZWQgZGF0YSBtb2RlbCBlbGVtZW50LicsXG4gICAgfSxcbiAgICAnNDA4Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBEZXBlbmRlbmN5IE5vdCBFc3RhYmxpc2hlZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnU29tZSBkYXRhIG1vZGVsIGVsZW1lbnRzIGNhbm5vdCBiZSBzZXQgdW50aWwgYW5vdGhlciBkYXRhIG1vZGVsIGVsZW1lbnQgd2FzIHNldC4gVGhpcyBlcnJvciBjb25kaXRpb24gaW5kaWNhdGVzIHRoYXQgdGhlIHByZXJlcXVpc2l0ZSBlbGVtZW50IHdhcyBub3Qgc2V0IGJlZm9yZSB0aGUgZGVwZW5kZW50IGVsZW1lbnQuJyxcbiAgICB9LFxuICB9LFxufTtcblxuY29uc3QgQVBJQ29uc3RhbnRzID0ge1xuICBnbG9iYWw6IGdsb2JhbCxcbiAgc2Nvcm0xMjogc2Nvcm0xMixcbiAgYWljYzogYWljYyxcbiAgc2Nvcm0yMDA0OiBzY29ybTIwMDQsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBUElDb25zdGFudHM7XG4iLCIvLyBAZmxvd1xuY29uc3QgZ2xvYmFsID0ge1xuICBHRU5FUkFMOiAxMDEsXG4gIElOSVRJQUxJWkFUSU9OX0ZBSUxFRDogMTAxLFxuICBJTklUSUFMSVpFRDogMTAxLFxuICBURVJNSU5BVEVEOiAxMDEsXG4gIFRFUk1JTkFUSU9OX0ZBSUxVUkU6IDEwMSxcbiAgVEVSTUlOQVRJT05fQkVGT1JFX0lOSVQ6IDEwMSxcbiAgTVVMVElQTEVfVEVSTUlOQVRJT046IDEwMSxcbiAgUkVUUklFVkVfQkVGT1JFX0lOSVQ6IDEwMSxcbiAgUkVUUklFVkVfQUZURVJfVEVSTTogMTAxLFxuICBTVE9SRV9CRUZPUkVfSU5JVDogMTAxLFxuICBTVE9SRV9BRlRFUl9URVJNOiAxMDEsXG4gIENPTU1JVF9CRUZPUkVfSU5JVDogMTAxLFxuICBDT01NSVRfQUZURVJfVEVSTTogMTAxLFxuICBBUkdVTUVOVF9FUlJPUjogMTAxLFxuICBDSElMRFJFTl9FUlJPUjogMTAxLFxuICBDT1VOVF9FUlJPUjogMTAxLFxuICBHRU5FUkFMX0dFVF9GQUlMVVJFOiAxMDEsXG4gIEdFTkVSQUxfU0VUX0ZBSUxVUkU6IDEwMSxcbiAgR0VORVJBTF9DT01NSVRfRkFJTFVSRTogMTAxLFxuICBVTkRFRklORURfREFUQV9NT0RFTDogMTAxLFxuICBVTklNUExFTUVOVEVEX0VMRU1FTlQ6IDEwMSxcbiAgVkFMVUVfTk9UX0lOSVRJQUxJWkVEOiAxMDEsXG4gIElOVkFMSURfU0VUX1ZBTFVFOiAxMDEsXG4gIFJFQURfT05MWV9FTEVNRU5UOiAxMDEsXG4gIFdSSVRFX09OTFlfRUxFTUVOVDogMTAxLFxuICBUWVBFX01JU01BVENIOiAxMDEsXG4gIFZBTFVFX09VVF9PRl9SQU5HRTogMTAxLFxuICBERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRDogMTAxLFxufTtcblxuY29uc3Qgc2Nvcm0xMiA9IHtcbiAgLi4uZ2xvYmFsLCAuLi57XG4gICAgUkVUUklFVkVfQkVGT1JFX0lOSVQ6IDMwMSxcbiAgICBTVE9SRV9CRUZPUkVfSU5JVDogMzAxLFxuICAgIENPTU1JVF9CRUZPUkVfSU5JVDogMzAxLFxuICAgIEFSR1VNRU5UX0VSUk9SOiAyMDEsXG4gICAgQ0hJTERSRU5fRVJST1I6IDIwMixcbiAgICBDT1VOVF9FUlJPUjogMjAzLFxuICAgIFVOREVGSU5FRF9EQVRBX01PREVMOiA0MDEsXG4gICAgVU5JTVBMRU1FTlRFRF9FTEVNRU5UOiA0MDEsXG4gICAgVkFMVUVfTk9UX0lOSVRJQUxJWkVEOiAzMDEsXG4gICAgSU5WQUxJRF9TRVRfVkFMVUU6IDQwMixcbiAgICBSRUFEX09OTFlfRUxFTUVOVDogNDAzLFxuICAgIFdSSVRFX09OTFlfRUxFTUVOVDogNDA0LFxuICAgIFRZUEVfTUlTTUFUQ0g6IDQwNSxcbiAgICBWQUxVRV9PVVRfT0ZfUkFOR0U6IDQwNyxcbiAgICBERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRDogNDA4LFxuICB9LFxufTtcblxuY29uc3Qgc2Nvcm0yMDA0ID0ge1xuICAuLi5nbG9iYWwsIC4uLntcbiAgICBJTklUSUFMSVpBVElPTl9GQUlMRUQ6IDEwMixcbiAgICBJTklUSUFMSVpFRDogMTAzLFxuICAgIFRFUk1JTkFURUQ6IDEwNCxcbiAgICBURVJNSU5BVElPTl9GQUlMVVJFOiAxMTEsXG4gICAgVEVSTUlOQVRJT05fQkVGT1JFX0lOSVQ6IDExMixcbiAgICBNVUxUSVBMRV9URVJNSU5BVElPTlM6IDExMyxcbiAgICBSRVRSSUVWRV9CRUZPUkVfSU5JVDogMTIyLFxuICAgIFJFVFJJRVZFX0FGVEVSX1RFUk06IDEyMyxcbiAgICBTVE9SRV9CRUZPUkVfSU5JVDogMTMyLFxuICAgIFNUT1JFX0FGVEVSX1RFUk06IDEzMyxcbiAgICBDT01NSVRfQkVGT1JFX0lOSVQ6IDE0MixcbiAgICBDT01NSVRfQUZURVJfVEVSTTogMTQzLFxuICAgIEFSR1VNRU5UX0VSUk9SOiAyMDEsXG4gICAgR0VORVJBTF9HRVRfRkFJTFVSRTogMzAxLFxuICAgIEdFTkVSQUxfU0VUX0ZBSUxVUkU6IDM1MSxcbiAgICBHRU5FUkFMX0NPTU1JVF9GQUlMVVJFOiAzOTEsXG4gICAgVU5ERUZJTkVEX0RBVEFfTU9ERUw6IDQwMSxcbiAgICBVTklNUExFTUVOVEVEX0VMRU1FTlQ6IDQwMixcbiAgICBWQUxVRV9OT1RfSU5JVElBTElaRUQ6IDQwMyxcbiAgICBSRUFEX09OTFlfRUxFTUVOVDogNDA0LFxuICAgIFdSSVRFX09OTFlfRUxFTUVOVDogNDA1LFxuICAgIFRZUEVfTUlTTUFUQ0g6IDQwNixcbiAgICBWQUxVRV9PVVRfT0ZfUkFOR0U6IDQwNyxcbiAgICBERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRDogNDA4LFxuICB9LFxufTtcblxuY29uc3QgRXJyb3JDb2RlcyA9IHtcbiAgc2Nvcm0xMjogc2Nvcm0xMixcbiAgc2Nvcm0yMDA0OiBzY29ybTIwMDQsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBFcnJvckNvZGVzO1xuIiwiY29uc3QgVmFsaWRMYW5ndWFnZXMgPSB7XG4gICdhYSc6ICdhYScsICdhYic6ICdhYicsICdhZSc6ICdhZScsICdhZic6ICdhZicsICdhayc6ICdhaycsICdhbSc6ICdhbScsXG4gICdhbic6ICdhbicsICdhcic6ICdhcicsICdhcyc6ICdhcycsICdhdic6ICdhdicsICdheSc6ICdheScsICdheic6ICdheicsXG4gICdiYSc6ICdiYScsICdiZSc6ICdiZScsICdiZyc6ICdiZycsICdiaCc6ICdiaCcsICdiaSc6ICdiaScsICdibSc6ICdibScsXG4gICdibic6ICdibicsICdibyc6ICdibycsICdicic6ICdicicsICdicyc6ICdicycsICdjYSc6ICdjYScsICdjZSc6ICdjZScsXG4gICdjaCc6ICdjaCcsICdjbyc6ICdjbycsICdjcic6ICdjcicsICdjcyc6ICdjcycsICdjdSc6ICdjdScsICdjdic6ICdjdicsXG4gICdjeSc6ICdjeScsICdkYSc6ICdkYScsICdkZSc6ICdkZScsICdkdic6ICdkdicsICdkeic6ICdkeicsICdlZSc6ICdlZScsXG4gICdlbCc6ICdlbCcsICdlbic6ICdlbicsICdlbyc6ICdlbycsICdlcyc6ICdlcycsICdldCc6ICdldCcsICdldSc6ICdldScsXG4gICdmYSc6ICdmYScsICdmZic6ICdmZicsICdmaSc6ICdmaScsICdmaic6ICdmaicsICdmbyc6ICdmbycsICdmcic6ICdmcicsXG4gICdmeSc6ICdmeScsICdnYSc6ICdnYScsICdnZCc6ICdnZCcsICdnbCc6ICdnbCcsICdnbic6ICdnbicsICdndSc6ICdndScsXG4gICdndic6ICdndicsICdoYSc6ICdoYScsICdoZSc6ICdoZScsICdoaSc6ICdoaScsICdobyc6ICdobycsICdocic6ICdocicsXG4gICdodCc6ICdodCcsICdodSc6ICdodScsICdoeSc6ICdoeScsICdoeic6ICdoeicsICdpYSc6ICdpYScsICdpZCc6ICdpZCcsXG4gICdpZSc6ICdpZScsICdpZyc6ICdpZycsICdpaSc6ICdpaScsICdpayc6ICdpaycsICdpbyc6ICdpbycsICdpcyc6ICdpcycsXG4gICdpdCc6ICdpdCcsICdpdSc6ICdpdScsICdqYSc6ICdqYScsICdqdic6ICdqdicsICdrYSc6ICdrYScsICdrZyc6ICdrZycsXG4gICdraSc6ICdraScsICdraic6ICdraicsICdrayc6ICdraycsICdrbCc6ICdrbCcsICdrbSc6ICdrbScsICdrbic6ICdrbicsXG4gICdrbyc6ICdrbycsICdrcic6ICdrcicsICdrcyc6ICdrcycsICdrdSc6ICdrdScsICdrdic6ICdrdicsICdrdyc6ICdrdycsXG4gICdreSc6ICdreScsICdsYSc6ICdsYScsICdsYic6ICdsYicsICdsZyc6ICdsZycsICdsaSc6ICdsaScsICdsbic6ICdsbicsXG4gICdsbyc6ICdsbycsICdsdCc6ICdsdCcsICdsdSc6ICdsdScsICdsdic6ICdsdicsICdtZyc6ICdtZycsICdtaCc6ICdtaCcsXG4gICdtaSc6ICdtaScsICdtayc6ICdtaycsICdtbCc6ICdtbCcsICdtbic6ICdtbicsICdtbyc6ICdtbycsICdtcic6ICdtcicsXG4gICdtcyc6ICdtcycsICdtdCc6ICdtdCcsICdteSc6ICdteScsICduYSc6ICduYScsICduYic6ICduYicsICduZCc6ICduZCcsXG4gICduZSc6ICduZScsICduZyc6ICduZycsICdubCc6ICdubCcsICdubic6ICdubicsICdubyc6ICdubycsICducic6ICducicsXG4gICdudic6ICdudicsICdueSc6ICdueScsICdvYyc6ICdvYycsICdvaic6ICdvaicsICdvbSc6ICdvbScsICdvcic6ICdvcicsXG4gICdvcyc6ICdvcycsICdwYSc6ICdwYScsICdwaSc6ICdwaScsICdwbCc6ICdwbCcsICdwcyc6ICdwcycsICdwdCc6ICdwdCcsXG4gICdxdSc6ICdxdScsICdybSc6ICdybScsICdybic6ICdybicsICdybyc6ICdybycsICdydSc6ICdydScsICdydyc6ICdydycsXG4gICdzYSc6ICdzYScsICdzYyc6ICdzYycsICdzZCc6ICdzZCcsICdzZSc6ICdzZScsICdzZyc6ICdzZycsICdzaCc6ICdzaCcsXG4gICdzaSc6ICdzaScsICdzayc6ICdzaycsICdzbCc6ICdzbCcsICdzbSc6ICdzbScsICdzbic6ICdzbicsICdzbyc6ICdzbycsXG4gICdzcSc6ICdzcScsICdzcic6ICdzcicsICdzcyc6ICdzcycsICdzdCc6ICdzdCcsICdzdSc6ICdzdScsICdzdic6ICdzdicsXG4gICdzdyc6ICdzdycsICd0YSc6ICd0YScsICd0ZSc6ICd0ZScsICd0Zyc6ICd0ZycsICd0aCc6ICd0aCcsICd0aSc6ICd0aScsXG4gICd0ayc6ICd0aycsICd0bCc6ICd0bCcsICd0bic6ICd0bicsICd0byc6ICd0bycsICd0cic6ICd0cicsICd0cyc6ICd0cycsXG4gICd0dCc6ICd0dCcsICd0dyc6ICd0dycsICd0eSc6ICd0eScsICd1Zyc6ICd1ZycsICd1ayc6ICd1aycsICd1cic6ICd1cicsXG4gICd1eic6ICd1eicsICd2ZSc6ICd2ZScsICd2aSc6ICd2aScsICd2byc6ICd2bycsICd3YSc6ICd3YScsICd3byc6ICd3bycsXG4gICd4aCc6ICd4aCcsICd5aSc6ICd5aScsICd5byc6ICd5bycsICd6YSc6ICd6YScsICd6aCc6ICd6aCcsICd6dSc6ICd6dScsXG4gICdhYXInOiAnYWFyJywgJ2Fiayc6ICdhYmsnLCAnYXZlJzogJ2F2ZScsICdhZnInOiAnYWZyJywgJ2FrYSc6ICdha2EnLFxuICAnYW1oJzogJ2FtaCcsICdhcmcnOiAnYXJnJywgJ2FyYSc6ICdhcmEnLCAnYXNtJzogJ2FzbScsICdhdmEnOiAnYXZhJyxcbiAgJ2F5bSc6ICdheW0nLCAnYXplJzogJ2F6ZScsICdiYWsnOiAnYmFrJywgJ2JlbCc6ICdiZWwnLCAnYnVsJzogJ2J1bCcsXG4gICdiaWgnOiAnYmloJywgJ2Jpcyc6ICdiaXMnLCAnYmFtJzogJ2JhbScsICdiZW4nOiAnYmVuJywgJ3RpYic6ICd0aWInLFxuICAnYm9kJzogJ2JvZCcsICdicmUnOiAnYnJlJywgJ2Jvcyc6ICdib3MnLCAnY2F0JzogJ2NhdCcsICdjaGUnOiAnY2hlJyxcbiAgJ2NoYSc6ICdjaGEnLCAnY29zJzogJ2NvcycsICdjcmUnOiAnY3JlJywgJ2N6ZSc6ICdjemUnLCAnY2VzJzogJ2NlcycsXG4gICdjaHUnOiAnY2h1JywgJ2Nodic6ICdjaHYnLCAnd2VsJzogJ3dlbCcsICdjeW0nOiAnY3ltJywgJ2Rhbic6ICdkYW4nLFxuICAnZ2VyJzogJ2dlcicsICdkZXUnOiAnZGV1JywgJ2Rpdic6ICdkaXYnLCAnZHpvJzogJ2R6bycsICdld2UnOiAnZXdlJyxcbiAgJ2dyZSc6ICdncmUnLCAnZWxsJzogJ2VsbCcsICdlbmcnOiAnZW5nJywgJ2Vwbyc6ICdlcG8nLCAnc3BhJzogJ3NwYScsXG4gICdlc3QnOiAnZXN0JywgJ2JhcSc6ICdiYXEnLCAnZXVzJzogJ2V1cycsICdwZXInOiAncGVyJywgJ2Zhcyc6ICdmYXMnLFxuICAnZnVsJzogJ2Z1bCcsICdmaW4nOiAnZmluJywgJ2Zpaic6ICdmaWonLCAnZmFvJzogJ2ZhbycsICdmcmUnOiAnZnJlJyxcbiAgJ2ZyYSc6ICdmcmEnLCAnZnJ5JzogJ2ZyeScsICdnbGUnOiAnZ2xlJywgJ2dsYSc6ICdnbGEnLCAnZ2xnJzogJ2dsZycsXG4gICdncm4nOiAnZ3JuJywgJ2d1aic6ICdndWonLCAnZ2x2JzogJ2dsdicsICdoYXUnOiAnaGF1JywgJ2hlYic6ICdoZWInLFxuICAnaGluJzogJ2hpbicsICdobW8nOiAnaG1vJywgJ2hydic6ICdocnYnLCAnaGF0JzogJ2hhdCcsICdodW4nOiAnaHVuJyxcbiAgJ2FybSc6ICdhcm0nLCAnaHllJzogJ2h5ZScsICdoZXInOiAnaGVyJywgJ2luYSc6ICdpbmEnLCAnaW5kJzogJ2luZCcsXG4gICdpbGUnOiAnaWxlJywgJ2libyc6ICdpYm8nLCAnaWlpJzogJ2lpaScsICdpcGsnOiAnaXBrJywgJ2lkbyc6ICdpZG8nLFxuICAnaWNlJzogJ2ljZScsICdpc2wnOiAnaXNsJywgJ2l0YSc6ICdpdGEnLCAnaWt1JzogJ2lrdScsICdqcG4nOiAnanBuJyxcbiAgJ2phdic6ICdqYXYnLCAnZ2VvJzogJ2dlbycsICdrYXQnOiAna2F0JywgJ2tvbic6ICdrb24nLCAna2lrJzogJ2tpaycsXG4gICdrdWEnOiAna3VhJywgJ2theic6ICdrYXonLCAna2FsJzogJ2thbCcsICdraG0nOiAna2htJywgJ2thbic6ICdrYW4nLFxuICAna29yJzogJ2tvcicsICdrYXUnOiAna2F1JywgJ2thcyc6ICdrYXMnLCAna3VyJzogJ2t1cicsICdrb20nOiAna29tJyxcbiAgJ2Nvcic6ICdjb3InLCAna2lyJzogJ2tpcicsICdsYXQnOiAnbGF0JywgJ2x0eic6ICdsdHonLCAnbHVnJzogJ2x1ZycsXG4gICdsaW0nOiAnbGltJywgJ2xpbic6ICdsaW4nLCAnbGFvJzogJ2xhbycsICdsaXQnOiAnbGl0JywgJ2x1Yic6ICdsdWInLFxuICAnbGF2JzogJ2xhdicsICdtbGcnOiAnbWxnJywgJ21haCc6ICdtYWgnLCAnbWFvJzogJ21hbycsICdtcmknOiAnbXJpJyxcbiAgJ21hYyc6ICdtYWMnLCAnbWtkJzogJ21rZCcsICdtYWwnOiAnbWFsJywgJ21vbic6ICdtb24nLCAnbW9sJzogJ21vbCcsXG4gICdtYXInOiAnbWFyJywgJ21heSc6ICdtYXknLCAnbXNhJzogJ21zYScsICdtbHQnOiAnbWx0JywgJ2J1cic6ICdidXInLFxuICAnbXlhJzogJ215YScsICduYXUnOiAnbmF1JywgJ25vYic6ICdub2InLCAnbmRlJzogJ25kZScsICduZXAnOiAnbmVwJyxcbiAgJ25kbyc6ICduZG8nLCAnZHV0JzogJ2R1dCcsICdubGQnOiAnbmxkJywgJ25ubyc6ICdubm8nLCAnbm9yJzogJ25vcicsXG4gICduYmwnOiAnbmJsJywgJ25hdic6ICduYXYnLCAnbnlhJzogJ255YScsICdvY2knOiAnb2NpJywgJ29qaSc6ICdvamknLFxuICAnb3JtJzogJ29ybScsICdvcmknOiAnb3JpJywgJ29zcyc6ICdvc3MnLCAncGFuJzogJ3BhbicsICdwbGknOiAncGxpJyxcbiAgJ3BvbCc6ICdwb2wnLCAncHVzJzogJ3B1cycsICdwb3InOiAncG9yJywgJ3F1ZSc6ICdxdWUnLCAncm9oJzogJ3JvaCcsXG4gICdydW4nOiAncnVuJywgJ3J1bSc6ICdydW0nLCAncm9uJzogJ3JvbicsICdydXMnOiAncnVzJywgJ2tpbic6ICdraW4nLFxuICAnc2FuJzogJ3NhbicsICdzcmQnOiAnc3JkJywgJ3NuZCc6ICdzbmQnLCAnc21lJzogJ3NtZScsICdzYWcnOiAnc2FnJyxcbiAgJ3Nsbyc6ICdzbG8nLCAnc2luJzogJ3NpbicsICdzbGsnOiAnc2xrJywgJ3Nsdic6ICdzbHYnLCAnc21vJzogJ3NtbycsXG4gICdzbmEnOiAnc25hJywgJ3NvbSc6ICdzb20nLCAnYWxiJzogJ2FsYicsICdzcWknOiAnc3FpJywgJ3NycCc6ICdzcnAnLFxuICAnc3N3JzogJ3NzdycsICdzb3QnOiAnc290JywgJ3N1bic6ICdzdW4nLCAnc3dlJzogJ3N3ZScsICdzd2EnOiAnc3dhJyxcbiAgJ3RhbSc6ICd0YW0nLCAndGVsJzogJ3RlbCcsICd0Z2snOiAndGdrJywgJ3RoYSc6ICd0aGEnLCAndGlyJzogJ3RpcicsXG4gICd0dWsnOiAndHVrJywgJ3RnbCc6ICd0Z2wnLCAndHNuJzogJ3RzbicsICd0b24nOiAndG9uJywgJ3R1cic6ICd0dXInLFxuICAndHNvJzogJ3RzbycsICd0YXQnOiAndGF0JywgJ3R3aSc6ICd0d2knLCAndGFoJzogJ3RhaCcsICd1aWcnOiAndWlnJyxcbiAgJ3Vrcic6ICd1a3InLCAndXJkJzogJ3VyZCcsICd1emInOiAndXpiJywgJ3Zlbic6ICd2ZW4nLCAndmllJzogJ3ZpZScsXG4gICd2b2wnOiAndm9sJywgJ3dsbic6ICd3bG4nLCAnd29sJzogJ3dvbCcsICd4aG8nOiAneGhvJywgJ3lpZCc6ICd5aWQnLFxuICAneW9yJzogJ3lvcicsICd6aGEnOiAnemhhJywgJ2NoaSc6ICdjaGknLCAnemhvJzogJ3pobycsICd6dWwnOiAnenVsJyxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFZhbGlkTGFuZ3VhZ2VzO1xuIiwiLy8gQGZsb3dcblxuY29uc3Qgc2Nvcm0xMiA9IHtcbiAgQ01JU3RyaW5nMjU2OiAnXi57MCwyNTV9JCcsXG4gIENNSVN0cmluZzQwOTY6ICdeLnswLDQwOTZ9JCcsXG4gIENNSVRpbWU6ICdeKD86WzAxXVxcXFxkfDJbMDEyM10pOig/OlswMTIzNDVdXFxcXGQpOig/OlswMTIzNDVdXFxcXGQpJCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JVGltZXNwYW46ICdeKFswLTldezIsfSk6KFswLTldezJ9KTooWzAtOV17Mn0pKFxcLlswLTldezEsMn0pPyQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUludGVnZXI6ICdeXFxcXGQrJCcsXG4gIENNSVNJbnRlZ2VyOiAnXi0/KFswLTldKykkJyxcbiAgQ01JRGVjaW1hbDogJ14tPyhbMC05XXswLDN9KShcXC5bMC05XSopPyQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUlkZW50aWZpZXI6ICdeW1xcXFx1MDAyMS1cXFxcdTAwN0VdezAsMjU1fSQnLFxuICBDTUlGZWVkYmFjazogJ14uezAsMjU1fSQnLCAvLyBUaGlzIG11c3QgYmUgcmVkZWZpbmVkXG4gIENNSUluZGV4OiAnWy5fXShcXFxcZCspLicsXG5cbiAgLy8gVm9jYWJ1bGFyeSBEYXRhIFR5cGUgRGVmaW5pdGlvblxuICBDTUlTdGF0dXM6ICdeKHBhc3NlZHxjb21wbGV0ZWR8ZmFpbGVkfGluY29tcGxldGV8YnJvd3NlZCkkJyxcbiAgQ01JU3RhdHVzMjogJ14ocGFzc2VkfGNvbXBsZXRlZHxmYWlsZWR8aW5jb21wbGV0ZXxicm93c2VkfG5vdCBhdHRlbXB0ZWQpJCcsXG4gIENNSUV4aXQ6ICdeKHRpbWUtb3V0fHN1c3BlbmR8bG9nb3V0fCkkJyxcbiAgQ01JVHlwZTogJ14odHJ1ZS1mYWxzZXxjaG9pY2V8ZmlsbC1pbnxtYXRjaGluZ3xwZXJmb3JtYW5jZXxzZXF1ZW5jaW5nfGxpa2VydHxudW1lcmljKSQnLFxuICBDTUlSZXN1bHQ6ICdeKGNvcnJlY3R8d3Jvbmd8dW5hbnRpY2lwYXRlZHxuZXV0cmFsfChbMC05XXswLDN9KT8oXFxcXC5bMC05XSopPykkJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBOQVZFdmVudDogJ14ocHJldmlvdXN8Y29udGludWUpJCcsXG5cbiAgLy8gRGF0YSByYW5nZXNcbiAgc2NvcmVfcmFuZ2U6ICcwIzEwMCcsXG4gIGF1ZGlvX3JhbmdlOiAnLTEjMTAwJyxcbiAgc3BlZWRfcmFuZ2U6ICctMTAwIzEwMCcsXG4gIHdlaWdodGluZ19yYW5nZTogJy0xMDAjMTAwJyxcbiAgdGV4dF9yYW5nZTogJy0xIzEnLFxufTtcblxuY29uc3QgYWljYyA9IHtcbiAgLi4uc2Nvcm0xMiwgLi4ue1xuICAgIENNSUlkZW50aWZpZXI6ICdeXFxcXHd7MSwyNTV9JCcsXG4gIH0sXG59O1xuXG5jb25zdCBzY29ybTIwMDQgPSB7XG4gIENNSVN0cmluZzIwMDogJ15bXFxcXHUwMDAwLVxcXFx1RkZGRl17MCwyMDB9JCcsXG4gIENNSVN0cmluZzI1MDogJ15bXFxcXHUwMDAwLVxcXFx1RkZGRl17MCwyNTB9JCcsXG4gIENNSVN0cmluZzEwMDA6ICdeW1xcXFx1MDAwMC1cXFxcdUZGRkZdezAsMTAwMH0kJyxcbiAgQ01JU3RyaW5nNDAwMDogJ15bXFxcXHUwMDAwLVxcXFx1RkZGRl17MCw0MDAwfSQnLFxuICBDTUlTdHJpbmc2NDAwMDogJ15bXFxcXHUwMDAwLVxcXFx1RkZGRl17MCw2NDAwMH0kJyxcbiAgQ01JTGFuZzogJ14oW2EtekEtWl17MiwzfXxpfHgpKFxcLVthLXpBLVowLTlcXC1dezIsOH0pPyR8XiQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUxhbmdTdHJpbmcyNTA6ICdeKFxce2xhbmc9KFthLXpBLVpdezIsM318aXx4KShcXC1bYS16QS1aMC05XFwtXXsyLDh9KT9cXH0pPygoPyFcXHsuKiQpLnswLDI1MH0kKT8kJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlMYW5nY3I6ICdeKChcXHtsYW5nPShbYS16QS1aXXsyLDN9fGl8eCk/KFxcLVthLXpBLVowLTlcXC1dezIsOH0pP1xcfSkpKC4qPykkJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlMYW5nU3RyaW5nMjUwY3I6ICdeKChcXHtsYW5nPShbYS16QS1aXXsyLDN9fGl8eCk/KFxcLVthLXpBLVowLTlcXC1dezIsOH0pP1xcfSk/KC57MCwyNTB9KT8pPyQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUxhbmdTdHJpbmc0MDAwOiAnXihcXHtsYW5nPShbYS16QS1aXXsyLDN9fGl8eCkoXFwtW2EtekEtWjAtOVxcLV17Miw4fSk/XFx9KT8oKD8hXFx7LiokKS57MCw0MDAwfSQpPyQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSVRpbWU6ICdeKDE5WzctOV17MX1bMC05XXsxfXwyMFswLTJdezF9WzAtOV17MX18MjAzWzAtOF17MX0pKCgtKDBbMS05XXsxfXwxWzAtMl17MX0pKSgoLSgwWzEtOV17MX18WzEtMl17MX1bMC05XXsxfXwzWzAtMV17MX0pKShUKFswLTFdezF9WzAtOV17MX18MlswLTNdezF9KSgoOlswLTVdezF9WzAtOV17MX0pKCg6WzAtNV17MX1bMC05XXsxfSkoKFxcXFwuWzAtOV17MSwyfSkoKFp8KFsrfC1dKFswLTFdezF9WzAtOV17MX18MlswLTNdezF9KSkpKDpbMC01XXsxfVswLTldezF9KT8pPyk/KT8pPyk/KT8pPyQnLFxuICBDTUlUaW1lc3BhbjogJ15QKD86KFsuLFxcXFxkXSspWSk/KD86KFsuLFxcXFxkXSspTSk/KD86KFsuLFxcXFxkXSspVyk/KD86KFsuLFxcXFxkXSspRCk/KD86VD8oPzooWy4sXFxcXGRdKylIKT8oPzooWy4sXFxcXGRdKylNKT8oPzooWy4sXFxcXGRdKylTKT8pPyQnLFxuICBDTUlJbnRlZ2VyOiAnXlxcXFxkKyQnLFxuICBDTUlTSW50ZWdlcjogJ14tPyhbMC05XSspJCcsXG4gIENNSURlY2ltYWw6ICdeLT8oWzAtOV17MSw1fSkoXFxcXC5bMC05XXsxLDE4fSk/JCcsXG4gIENNSUlkZW50aWZpZXI6ICdeXFxcXFN7MSwyNTB9W2EtekEtWjAtOV0kJyxcbiAgQ01JU2hvcnRJZGVudGlmaWVyOiAnXltcXFxcd1xcLl17MSwyNTB9JCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JTG9uZ0lkZW50aWZpZXI6ICdeKD86KD8hdXJuOilcXFxcU3sxLDQwMDB9fHVybjpbQS1aYS16MC05LV17MSwzMX06XFxcXFN7MSw0MDAwfSkkJyxcbiAgQ01JRmVlZGJhY2s6ICdeLiokJywgLy8gVGhpcyBtdXN0IGJlIHJlZGVmaW5lZFxuICBDTUlJbmRleDogJ1suX10oXFxcXGQrKS4nLFxuICBDTUlJbmRleFN0b3JlOiAnLk4oXFxcXGQrKS4nLFxuXG4gIC8vIFZvY2FidWxhcnkgRGF0YSBUeXBlIERlZmluaXRpb25cbiAgQ01JQ1N0YXR1czogJ14oY29tcGxldGVkfGluY29tcGxldGV8bm90IGF0dGVtcHRlZHx1bmtub3duKSQnLFxuICBDTUlTU3RhdHVzOiAnXihwYXNzZWR8ZmFpbGVkfHVua25vd24pJCcsXG4gIENNSUV4aXQ6ICdeKHRpbWUtb3V0fHN1c3BlbmR8bG9nb3V0fG5vcm1hbCkkJyxcbiAgQ01JVHlwZTogJ14odHJ1ZS1mYWxzZXxjaG9pY2V8ZmlsbC1pbnxsb25nLWZpbGwtaW58bWF0Y2hpbmd8cGVyZm9ybWFuY2V8c2VxdWVuY2luZ3xsaWtlcnR8bnVtZXJpY3xvdGhlcikkJyxcbiAgQ01JUmVzdWx0OiAnXihjb3JyZWN0fHdyb25nfHVuYW50aWNpcGF0ZWR8bmV1dHJhbHwtPyhbMC05XXsxLDR9KShcXFxcLlswLTldezEsMTh9KT8pJCcsXG4gIE5BVkV2ZW50OiAnXihwcmV2aW91c3xjb250aW51ZXxleGl0fGV4aXRBbGx8YWJhbmRvbnxhYmFuZG9uQWxsfHN1c3BlbmRBbGx8XFx7dGFyZ2V0PVxcXFxTezAsMjAwfVthLXpBLVowLTldXFx9Y2hvaWNlfGp1bXApJCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgTkFWQm9vbGVhbjogJ14odW5rbm93bnx0cnVlfGZhbHNlJCknLFxuICBOQVZUYXJnZXQ6ICdeKHByZXZpb3VzfGNvbnRpbnVlfGNob2ljZS57dGFyZ2V0PVxcXFxTezAsMjAwfVthLXpBLVowLTldfSkkJyxcblxuICAvLyBEYXRhIHJhbmdlc1xuICBzY2FsZWRfcmFuZ2U6ICctMSMxJyxcbiAgYXVkaW9fcmFuZ2U6ICcwIyonLFxuICBzcGVlZF9yYW5nZTogJzAjKicsXG4gIHRleHRfcmFuZ2U6ICctMSMxJyxcbiAgcHJvZ3Jlc3NfcmFuZ2U6ICcwIzEnLFxufTtcblxuY29uc3QgUmVnZXggPSB7XG4gIGFpY2M6IGFpY2MsXG4gIHNjb3JtMTI6IHNjb3JtMTIsXG4gIHNjb3JtMjAwNDogc2Nvcm0yMDA0LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgUmVnZXg7XG4iLCIvLyBAZmxvd1xuaW1wb3J0IFJlZ2V4IGZyb20gJy4vcmVnZXgnO1xuXG5jb25zdCBzY29ybTIwMDRfcmVnZXggPSBSZWdleC5zY29ybTIwMDQ7XG5cbmNvbnN0IGxlYXJuZXIgPSB7XG4gICd0cnVlLWZhbHNlJzoge1xuICAgIGZvcm1hdDogJ150cnVlJHxeZmFsc2UkJyxcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAnY2hvaWNlJzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBtYXg6IDM2LFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgdW5pcXVlOiB0cnVlLFxuICB9LFxuICAnZmlsbC1pbic6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nU3RyaW5nMjUwLFxuICAgIG1heDogMTAsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAnbG9uZy1maWxsLWluJzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSUxhbmdTdHJpbmc0MDAwLFxuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG4gICdtYXRjaGluZyc6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgZm9ybWF0Mjogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBtYXg6IDM2LFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgZGVsaW1pdGVyMjogJ1suXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ3BlcmZvcm1hbmNlJzoge1xuICAgIGZvcm1hdDogJ14kfCcgKyBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIGZvcm1hdDI6IHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsICsgJ3xeJHwnICtcbiAgICAgICAgc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBtYXg6IDI1MCxcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIGRlbGltaXRlcjI6ICdbLl0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG4gICdzZXF1ZW5jaW5nJzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBtYXg6IDM2LFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ2xpa2VydCc6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ251bWVyaWMnOiB7XG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCxcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAnb3RoZXInOiB7XG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU3RyaW5nNDAwMCxcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxufTtcblxuY29uc3QgY29ycmVjdCA9IHtcbiAgJ3RydWUtZmFsc2UnOiB7XG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogJ150cnVlJHxeZmFsc2UkJyxcbiAgICBsaW1pdDogMSxcbiAgfSxcbiAgJ2Nob2ljZSc6IHtcbiAgICBtYXg6IDM2LFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgdW5pcXVlOiB0cnVlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICB9LFxuICAnZmlsbC1pbic6IHtcbiAgICBtYXg6IDEwLFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSUxhbmdTdHJpbmcyNTBjcixcbiAgfSxcbiAgJ2xvbmctZmlsbC1pbic6IHtcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogdHJ1ZSxcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nU3RyaW5nNDAwMCxcbiAgfSxcbiAgJ21hdGNoaW5nJzoge1xuICAgIG1heDogMzYsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICBkZWxpbWl0ZXIyOiAnWy5dJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIGZvcm1hdDI6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gIH0sXG4gICdwZXJmb3JtYW5jZSc6IHtcbiAgICBtYXg6IDI1MCxcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIGRlbGltaXRlcjI6ICdbLl0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6ICdeJHwnICsgc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBmb3JtYXQyOiBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCArICd8XiR8JyArXG4gICAgICAgIHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gIH0sXG4gICdzZXF1ZW5jaW5nJzoge1xuICAgIG1heDogMzYsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICB9LFxuICAnbGlrZXJ0Jzoge1xuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgbGltaXQ6IDEsXG4gIH0sXG4gICdudW1lcmljJzoge1xuICAgIG1heDogMixcbiAgICBkZWxpbWl0ZXI6ICdbOl0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsLFxuICAgIGxpbWl0OiAxLFxuICB9LFxuICAnb3RoZXInOiB7XG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVN0cmluZzQwMDAsXG4gICAgbGltaXQ6IDEsXG4gIH0sXG59O1xuXG5jb25zdCBSZXNwb25zZXMgPSB7XG4gIGxlYXJuZXI6IGxlYXJuZXIsXG4gIGNvcnJlY3Q6IGNvcnJlY3QsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBSZXNwb25zZXM7XG4iLCIvLyBAZmxvd1xuXG4vKipcbiAqIERhdGEgVmFsaWRhdGlvbiBFeGNlcHRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIFZhbGlkYXRpb25FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIHRvIHRha2UgaW4gYW4gZXJyb3IgbWVzc2FnZSBhbmQgY29kZVxuICAgKiBAcGFyYW0ge251bWJlcn0gZXJyb3JDb2RlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlcnJvckNvZGU6IG51bWJlcikge1xuICAgIHN1cGVyKGVycm9yQ29kZSk7XG4gICAgdGhpcy4jZXJyb3JDb2RlID0gZXJyb3JDb2RlO1xuICB9XG5cbiAgI2Vycm9yQ29kZTtcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZXJyb3JDb2RlXG4gICAqIEByZXR1cm4ge251bWJlcn1cbiAgICovXG4gIGdldCBlcnJvckNvZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2Vycm9yQ29kZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcnlpbmcgdG8gb3ZlcnJpZGUgdGhlIGRlZmF1bHQgRXJyb3IgbWVzc2FnZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbWVzc2FnZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jZXJyb3JDb2RlICsgJyc7XG4gIH1cbn1cbiIsImltcG9ydCBTY29ybTIwMDRBUEkgZnJvbSAnLi9TY29ybTIwMDRBUEknO1xuaW1wb3J0IFNjb3JtMTJBUEkgZnJvbSAnLi9TY29ybTEyQVBJJztcbmltcG9ydCBBSUNDIGZyb20gJy4vQUlDQyc7XG5cbndpbmRvdy5TY29ybTEyQVBJID0gU2Nvcm0xMkFQSTtcbndpbmRvdy5TY29ybTIwMDRBUEkgPSBTY29ybTIwMDRBUEk7XG53aW5kb3cuQUlDQyA9IEFJQ0M7XG4iLCIvLyBAZmxvd1xuZXhwb3J0IGNvbnN0IFNFQ09ORFNfUEVSX1NFQ09ORCA9IDEuMDtcbmV4cG9ydCBjb25zdCBTRUNPTkRTX1BFUl9NSU5VVEUgPSA2MDtcbmV4cG9ydCBjb25zdCBTRUNPTkRTX1BFUl9IT1VSID0gNjAgKiBTRUNPTkRTX1BFUl9NSU5VVEU7XG5leHBvcnQgY29uc3QgU0VDT05EU19QRVJfREFZID0gMjQgKiBTRUNPTkRTX1BFUl9IT1VSO1xuXG5jb25zdCBkZXNpZ25hdGlvbnMgPSBbXG4gIFsnRCcsIFNFQ09ORFNfUEVSX0RBWV0sXG4gIFsnSCcsIFNFQ09ORFNfUEVSX0hPVVJdLFxuICBbJ00nLCBTRUNPTkRTX1BFUl9NSU5VVEVdLFxuICBbJ1MnLCBTRUNPTkRTX1BFUl9TRUNPTkRdLFxuXTtcblxuLyoqXG4gKiBDb252ZXJ0cyBhIE51bWJlciB0byBhIFN0cmluZyBvZiBISDpNTTpTU1xuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSB0b3RhbFNlY29uZHNcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNlY29uZHNBc0hITU1TUyh0b3RhbFNlY29uZHM6IE51bWJlcikge1xuICAvLyBTQ09STSBzcGVjIGRvZXMgbm90IGRlYWwgd2l0aCBuZWdhdGl2ZSBkdXJhdGlvbnMsIGdpdmUgemVybyBiYWNrXG4gIGlmICghdG90YWxTZWNvbmRzIHx8IHRvdGFsU2Vjb25kcyA8PSAwKSB7XG4gICAgcmV0dXJuICcwMDowMDowMCc7XG4gIH1cblxuICBjb25zdCBob3VycyA9IE1hdGguZmxvb3IodG90YWxTZWNvbmRzIC8gU0VDT05EU19QRVJfSE9VUik7XG5cbiAgY29uc3QgZGF0ZU9iaiA9IG5ldyBEYXRlKHRvdGFsU2Vjb25kcyAqIDEwMDApO1xuICBjb25zdCBtaW51dGVzID0gZGF0ZU9iai5nZXRVVENNaW51dGVzKCk7XG4gIC8vIG1ha2Ugc3VyZSB3ZSBhZGQgYW55IHBvc3NpYmxlIGRlY2ltYWwgdmFsdWVcbiAgY29uc3Qgc2Vjb25kcyA9IGRhdGVPYmouZ2V0U2Vjb25kcygpO1xuICBjb25zdCBtcyA9IHRvdGFsU2Vjb25kcyAlIDEuMDtcbiAgbGV0IG1zU3RyID0gJyc7XG4gIGlmIChjb3VudERlY2ltYWxzKG1zKSA+IDApIHtcbiAgICBpZiAoY291bnREZWNpbWFscyhtcykgPiAyKSB7XG4gICAgICBtc1N0ciA9IG1zLnRvRml4ZWQoMik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1zU3RyID0gU3RyaW5nKG1zKTtcbiAgICB9XG4gICAgbXNTdHIgPSAnLicgKyBtc1N0ci5zcGxpdCgnLicpWzFdO1xuICB9XG5cbiAgcmV0dXJuIChob3VycyArICc6JyArIG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzKS5yZXBsYWNlKC9cXGJcXGRcXGIvZyxcbiAgICAgICcwJCYnKSArIG1zU3RyO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZSB0aGUgbnVtYmVyIG9mIHNlY29uZHMgZnJvbSBJU08gODYwMSBEdXJhdGlvblxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBzZWNvbmRzXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZWNvbmRzQXNJU09EdXJhdGlvbihzZWNvbmRzOiBOdW1iZXIpIHtcbiAgLy8gU0NPUk0gc3BlYyBkb2VzIG5vdCBkZWFsIHdpdGggbmVnYXRpdmUgZHVyYXRpb25zLCBnaXZlIHplcm8gYmFja1xuICBpZiAoIXNlY29uZHMgfHwgc2Vjb25kcyA8PSAwKSB7XG4gICAgcmV0dXJuICdQVDBTJztcbiAgfVxuXG4gIGxldCBkdXJhdGlvbiA9ICdQJztcbiAgbGV0IHJlbWFpbmRlciA9IHNlY29uZHM7XG5cbiAgZGVzaWduYXRpb25zLmZvckVhY2goKFtzaWduLCBjdXJyZW50X3NlY29uZHNdKSA9PiB7XG4gICAgbGV0IHZhbHVlID0gTWF0aC5mbG9vcihyZW1haW5kZXIgLyBjdXJyZW50X3NlY29uZHMpO1xuXG4gICAgcmVtYWluZGVyID0gcmVtYWluZGVyICUgY3VycmVudF9zZWNvbmRzO1xuICAgIC8vIElmIHdlIGhhdmUgYW55dGhpbmcgbGVmdCBpbiB0aGUgcmVtYWluZGVyLCBhbmQgd2UncmUgY3VycmVudGx5IGFkZGluZ1xuICAgIC8vIHNlY29uZHMgdG8gdGhlIGR1cmF0aW9uLCBnbyBhaGVhZCBhbmQgYWRkIHRoZSBkZWNpbWFsIHRvIHRoZSBzZWNvbmRzXG4gICAgaWYgKHNpZ24gPT09ICdTJyAmJiByZW1haW5kZXIgPiAwKSB7XG4gICAgICB2YWx1ZSArPSByZW1haW5kZXI7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBpZiAoKGR1cmF0aW9uLmluZGV4T2YoJ0QnKSA+IDAgfHxcbiAgICAgICAgICBzaWduID09PSAnSCcgfHwgc2lnbiA9PT0gJ00nIHx8IHNpZ24gPT09ICdTJykgJiZcbiAgICAgICAgICBkdXJhdGlvbi5pbmRleE9mKCdUJykgPT09IC0xKSB7XG4gICAgICAgIGR1cmF0aW9uICs9ICdUJztcbiAgICAgIH1cbiAgICAgIGR1cmF0aW9uICs9IGAke3ZhbHVlfSR7c2lnbn1gO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGR1cmF0aW9uO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZSB0aGUgbnVtYmVyIG9mIHNlY29uZHMgZnJvbSBISDpNTTpTUy5ERERERERcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGltZVN0cmluZ1xuICogQHBhcmFtIHtSZWdFeHB9IHRpbWVSZWdleFxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGltZUFzU2Vjb25kcyh0aW1lU3RyaW5nOiBTdHJpbmcsIHRpbWVSZWdleDogUmVnRXhwKSB7XG4gIGlmICghdGltZVN0cmluZyB8fCB0eXBlb2YgdGltZVN0cmluZyAhPT0gJ3N0cmluZycgfHxcbiAgICAgICF0aW1lU3RyaW5nLm1hdGNoKHRpbWVSZWdleCkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICBjb25zdCBwYXJ0cyA9IHRpbWVTdHJpbmcuc3BsaXQoJzonKTtcbiAgY29uc3QgaG91cnMgPSBOdW1iZXIocGFydHNbMF0pO1xuICBjb25zdCBtaW51dGVzID0gTnVtYmVyKHBhcnRzWzFdKTtcbiAgY29uc3Qgc2Vjb25kcyA9IE51bWJlcihwYXJ0c1syXSk7XG4gIHJldHVybiAoaG91cnMgKiAzNjAwKSArIChtaW51dGVzICogNjApICsgc2Vjb25kcztcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgdGhlIG51bWJlciBvZiBzZWNvbmRzIGZyb20gSVNPIDg2MDEgRHVyYXRpb25cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZHVyYXRpb25cbiAqIEBwYXJhbSB7UmVnRXhwfSBkdXJhdGlvblJlZ2V4XG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXREdXJhdGlvbkFzU2Vjb25kcyhkdXJhdGlvbjogU3RyaW5nLCBkdXJhdGlvblJlZ2V4OiBSZWdFeHApIHtcbiAgaWYgKCFkdXJhdGlvbiB8fCAhZHVyYXRpb24ubWF0Y2goZHVyYXRpb25SZWdleCkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGNvbnN0IFssIHllYXJzLCBtb250aHMsICwgZGF5cywgaG91cnMsIG1pbnV0ZXMsIHNlY29uZHNdID0gbmV3IFJlZ0V4cChcbiAgICAgIGR1cmF0aW9uUmVnZXgpLmV4ZWMoZHVyYXRpb24pIHx8IFtdO1xuXG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gIGNvbnN0IGFuY2hvciA9IG5ldyBEYXRlKG5vdyk7XG4gIGFuY2hvci5zZXRGdWxsWWVhcihhbmNob3IuZ2V0RnVsbFllYXIoKSArIE51bWJlcih5ZWFycyB8fCAwKSk7XG4gIGFuY2hvci5zZXRNb250aChhbmNob3IuZ2V0TW9udGgoKSArIE51bWJlcihtb250aHMgfHwgMCkpO1xuICBhbmNob3Iuc2V0RGF0ZShhbmNob3IuZ2V0RGF0ZSgpICsgTnVtYmVyKGRheXMgfHwgMCkpO1xuICBhbmNob3Iuc2V0SG91cnMoYW5jaG9yLmdldEhvdXJzKCkgKyBOdW1iZXIoaG91cnMgfHwgMCkpO1xuICBhbmNob3Iuc2V0TWludXRlcyhhbmNob3IuZ2V0TWludXRlcygpICsgTnVtYmVyKG1pbnV0ZXMgfHwgMCkpO1xuICBhbmNob3Iuc2V0U2Vjb25kcyhhbmNob3IuZ2V0U2Vjb25kcygpICsgTnVtYmVyKHNlY29uZHMgfHwgMCkpO1xuICBpZiAoc2Vjb25kcyAmJiBTdHJpbmcoc2Vjb25kcykuaW5kZXhPZignLicpID4gMCkge1xuICAgIGNvbnN0IG1pbGxpc2Vjb25kcyA9IE51bWJlcihOdW1iZXIoc2Vjb25kcykgJSAxKS50b0ZpeGVkKDYpICogMTAwMC4wO1xuICAgIGFuY2hvci5zZXRNaWxsaXNlY29uZHMoYW5jaG9yLmdldE1pbGxpc2Vjb25kcygpICsgbWlsbGlzZWNvbmRzKTtcbiAgfVxuICByZXR1cm4gKChhbmNob3IgKiAxLjApIC0gbm93KSAvIDEwMDAuMDtcbn1cblxuLyoqXG4gKiBBZGRzIHRvZ2V0aGVyIHR3byBJU084NjAxIER1cmF0aW9uIHN0cmluZ3NcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlyc3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWNvbmRcbiAqIEBwYXJhbSB7UmVnRXhwfSBkdXJhdGlvblJlZ2V4XG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRUd29EdXJhdGlvbnMoXG4gICAgZmlyc3Q6IFN0cmluZyxcbiAgICBzZWNvbmQ6IFN0cmluZyxcbiAgICBkdXJhdGlvblJlZ2V4OiBSZWdFeHApIHtcbiAgcmV0dXJuIGdldFNlY29uZHNBc0lTT0R1cmF0aW9uKFxuICAgICAgZ2V0RHVyYXRpb25Bc1NlY29uZHMoZmlyc3QsIGR1cmF0aW9uUmVnZXgpICtcbiAgICAgIGdldER1cmF0aW9uQXNTZWNvbmRzKHNlY29uZCwgZHVyYXRpb25SZWdleCksXG4gICk7XG59XG5cbi8qKlxuICogQWRkIHRvZ2V0aGVyIHR3byBISDpNTTpTUy5ERCBzdHJpbmdzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGZpcnN0XG4gKiBAcGFyYW0ge3N0cmluZ30gc2Vjb25kXG4gKiBAcGFyYW0ge1JlZ0V4cH0gdGltZVJlZ2V4XG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhZGRISE1NU1NUaW1lU3RyaW5ncyhcbiAgICBmaXJzdDogU3RyaW5nLFxuICAgIHNlY29uZDogU3RyaW5nLFxuICAgIHRpbWVSZWdleDogUmVnRXhwKSB7XG4gIHJldHVybiBnZXRTZWNvbmRzQXNISE1NU1MoXG4gICAgICBnZXRUaW1lQXNTZWNvbmRzKGZpcnN0LCB0aW1lUmVnZXgpICtcbiAgICAgIGdldFRpbWVBc1NlY29uZHMoXG4gICAgICAgICAgc2Vjb25kLCB0aW1lUmVnZXgpLFxuICApO1xufVxuXG4vKipcbiAqIEZsYXR0ZW4gYSBKU09OIG9iamVjdCBkb3duIHRvIHN0cmluZyBwYXRocyBmb3IgZWFjaCB2YWx1ZXNcbiAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuKGRhdGEpIHtcbiAgY29uc3QgcmVzdWx0ID0ge307XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2UgdGhyb3VnaCB0aGUgb2JqZWN0XG4gICAqIEBwYXJhbSB7Kn0gY3VyXG4gICAqIEBwYXJhbSB7Kn0gcHJvcFxuICAgKi9cbiAgZnVuY3Rpb24gcmVjdXJzZShjdXIsIHByb3ApIHtcbiAgICBpZiAoT2JqZWN0KGN1cikgIT09IGN1cikge1xuICAgICAgcmVzdWx0W3Byb3BdID0gY3VyO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShjdXIpKSB7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGN1ci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgcmVjdXJzZShjdXJbaV0sIHByb3AgKyAnWycgKyBpICsgJ10nKTtcbiAgICAgICAgaWYgKGwgPT09IDApIHJlc3VsdFtwcm9wXSA9IFtdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgaXNFbXB0eSA9IHRydWU7XG4gICAgICBmb3IgKGNvbnN0IHAgaW4gY3VyKSB7XG4gICAgICAgIGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGN1ciwgcCkpIHtcbiAgICAgICAgICBpc0VtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgcmVjdXJzZShjdXJbcF0sIHByb3AgPyBwcm9wICsgJy4nICsgcCA6IHApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNFbXB0eSAmJiBwcm9wKSByZXN1bHRbcHJvcF0gPSB7fTtcbiAgICB9XG4gIH1cblxuICByZWN1cnNlKGRhdGEsICcnKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBVbi1mbGF0dGVuIGEgZmxhdCBKU09OIG9iamVjdFxuICogQHBhcmFtIHtvYmplY3R9IGRhdGFcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuZmxhdHRlbihkYXRhKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgaWYgKE9iamVjdChkYXRhKSAhPT0gZGF0YSB8fCBBcnJheS5pc0FycmF5KGRhdGEpKSByZXR1cm4gZGF0YTtcbiAgY29uc3QgcmVnZXggPSAvXFwuPyhbXi5bXFxdXSspfFxcWyhcXGQrKV0vZztcbiAgY29uc3QgcmVzdWx0ID0ge307XG4gIGZvciAoY29uc3QgcCBpbiBkYXRhKSB7XG4gICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoZGF0YSwgcCkpIHtcbiAgICAgIGxldCBjdXIgPSByZXN1bHQ7XG4gICAgICBsZXQgcHJvcCA9ICcnO1xuICAgICAgbGV0IG0gPSByZWdleC5leGVjKHApO1xuICAgICAgd2hpbGUgKG0pIHtcbiAgICAgICAgY3VyID0gY3VyW3Byb3BdIHx8IChjdXJbcHJvcF0gPSAobVsyXSA/IFtdIDoge30pKTtcbiAgICAgICAgcHJvcCA9IG1bMl0gfHwgbVsxXTtcbiAgICAgICAgbSA9IHJlZ2V4LmV4ZWMocCk7XG4gICAgICB9XG4gICAgICBjdXJbcHJvcF0gPSBkYXRhW3BdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0WycnXSB8fCByZXN1bHQ7XG59XG5cbi8qKlxuICogQ291bnRzIHRoZSBudW1iZXIgb2YgZGVjaW1hbCBwbGFjZXNcbiAqIEBwYXJhbSB7bnVtYmVyfSBudW1cbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvdW50RGVjaW1hbHMobnVtOiBudW1iZXIpIHtcbiAgaWYgKE1hdGguZmxvb3IobnVtKSA9PT0gbnVtKSByZXR1cm4gMDtcbiAgcmV0dXJuIG51bS50b1N0cmluZygpLnNwbGl0KCcuJylbMV0ubGVuZ3RoIHx8IDA7XG59XG4iXX0=
