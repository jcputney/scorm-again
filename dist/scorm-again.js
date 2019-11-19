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
        auto_progress: false
      }
    });

    _defineProperty(this, "cmi", void 0);

    _defineProperty(this, "startingData", void 0);

    if ((this instanceof BaseAPI ? this.constructor : void 0) === BaseAPI) {
      throw new TypeError('Cannot construct BaseAPI instances directly');
    }

    this.currentState = _api_constants.global_constants.STATE_NOT_INITIALIZED;
    this.apiLogLevel = _api_constants.global_constants.LOG_LEVEL_ERROR;
    this.lastErrorCode = 0;
    this.listenerArray = [];

    _classPrivateFieldSet(this, _timeout, null);

    _classPrivateFieldSet(this, _error_codes, error_codes);

    this.settings = settings;
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
        if (_classPrivateFieldGet(this, _settings).autocommit && _classPrivateFieldGet(this, _timeout) === undefined) {
          this.scheduleCommit(_classPrivateFieldGet(this, _settings).autocommitSeconds * 1000);
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
          httpReq.send(params);
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
      value: void 0
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
        } else if (this.settings.auto_progress) {
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
        } else if (this.settings.auto_progress) {
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
      if (check2004ValidFormat(suspend_data, regex.CMIString64000)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQUlDQy5qcyIsInNyYy9CYXNlQVBJLmpzIiwic3JjL1Njb3JtMTJBUEkuanMiLCJzcmMvU2Nvcm0yMDA0QVBJLmpzIiwic3JjL2NtaS9haWNjX2NtaS5qcyIsInNyYy9jbWkvY29tbW9uLmpzIiwic3JjL2NtaS9zY29ybTEyX2NtaS5qcyIsInNyYy9jbWkvc2Nvcm0yMDA0X2NtaS5qcyIsInNyYy9jb25zdGFudHMvYXBpX2NvbnN0YW50cy5qcyIsInNyYy9jb25zdGFudHMvZXJyb3JfY29kZXMuanMiLCJzcmMvY29uc3RhbnRzL2ZpZWxkX3ZhbHVlcy5qcyIsInNyYy9jb25zdGFudHMvbGFuZ3VhZ2VfY29uc3RhbnRzLmpzIiwic3JjL2NvbnN0YW50cy9yZWdleC5qcyIsInNyYy9jb25zdGFudHMvcmVzcG9uc2VfY29uc3RhbnRzLmpzIiwic3JjL2V4Y2VwdGlvbnMuanMiLCJzcmMvZXhwb3J0cy5qcyIsInNyYy91dGlsaXRpZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FDQ0E7O0FBQ0E7O0FBS0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7OztJQUdxQixJOzs7OztBQUNuQjs7OztBQUlBLGdCQUFZLFFBQVosRUFBMEI7QUFBQTs7QUFBQTs7QUFDeEIsUUFBTSxhQUFhLHFCQUNkO0FBQ0QsTUFBQSxnQkFBZ0IsRUFBRTtBQURqQixLQURjLE1BR1gsUUFIVyxDQUFuQjs7QUFNQSw4RUFBTSxhQUFOO0FBRUEsVUFBSyxHQUFMLEdBQVcsSUFBSSxhQUFKLEVBQVg7QUFDQSxVQUFLLEdBQUwsR0FBVyxJQUFJLGdCQUFKLEVBQVg7QUFWd0I7QUFXekI7QUFFRDs7Ozs7Ozs7Ozs7O29DQVFnQixVLEVBQVksSyxFQUFPLGUsRUFBaUI7QUFDbEQsVUFBSSxRQUFRLDZFQUF5QixVQUF6QixFQUFxQyxLQUFyQyxFQUE0QyxlQUE1QyxD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IjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBAZmxvd1xuaW1wb3J0IFNjb3JtMTJBUEkgZnJvbSAnLi9TY29ybTEyQVBJJztcbmltcG9ydCB7XG4gIENNSSxcbiAgQ01JRXZhbHVhdGlvbkNvbW1lbnRzT2JqZWN0LFxuICBDTUlUcmllc09iamVjdCxcbn0gZnJvbSAnLi9jbWkvYWljY19jbWknO1xuaW1wb3J0IHtOQVZ9IGZyb20gJy4vY21pL3Njb3JtMTJfY21pJztcblxuLyoqXG4gKiBUaGUgQUlDQyBBUEkgY2xhc3NcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQUlDQyBleHRlbmRzIFNjb3JtMTJBUEkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgdG8gY3JlYXRlIEFJQ0MgQVBJIG9iamVjdFxuICAgKiBAcGFyYW0ge29iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiB7fSkge1xuICAgIGNvbnN0IGZpbmFsU2V0dGluZ3MgPSB7XG4gICAgICAuLi57XG4gICAgICAgIG1hc3Rlcnlfb3ZlcnJpZGU6IGZhbHNlLFxuICAgICAgfSwgLi4uc2V0dGluZ3MsXG4gICAgfTtcblxuICAgIHN1cGVyKGZpbmFsU2V0dGluZ3MpO1xuXG4gICAgdGhpcy5jbWkgPSBuZXcgQ01JKCk7XG4gICAgdGhpcy5uYXYgPSBuZXcgTkFWKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBvciBidWlsZHMgYSBuZXcgY2hpbGQgZWxlbWVudCB0byBhZGQgdG8gdGhlIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICogQHBhcmFtIHtib29sZWFufSBmb3VuZEZpcnN0SW5kZXhcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cbiAgZ2V0Q2hpbGRFbGVtZW50KENNSUVsZW1lbnQsIHZhbHVlLCBmb3VuZEZpcnN0SW5kZXgpIHtcbiAgICBsZXQgbmV3Q2hpbGQgPSBzdXBlci5nZXRDaGlsZEVsZW1lbnQoQ01JRWxlbWVudCwgdmFsdWUsIGZvdW5kRmlyc3RJbmRleCk7XG5cbiAgICBpZiAoIW5ld0NoaWxkKSB7XG4gICAgICBpZiAodGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsICdjbWlcXFxcLmV2YWx1YXRpb25cXFxcLmNvbW1lbnRzXFxcXC5cXFxcZCcpKSB7XG4gICAgICAgIG5ld0NoaWxkID0gbmV3IENNSUV2YWx1YXRpb25Db21tZW50c09iamVjdCgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ2NtaVxcXFwuc3R1ZGVudF9kYXRhXFxcXC50cmllc1xcXFwuXFxcXGQnKSkge1xuICAgICAgICBuZXdDaGlsZCA9IG5ldyBDTUlUcmllc09iamVjdCgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXdDaGlsZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIHRoZSB3aG9sZSBBUEkgd2l0aCBhbm90aGVyXG4gICAqXG4gICAqIEBwYXJhbSB7QUlDQ30gbmV3QVBJXG4gICAqL1xuICByZXBsYWNlV2l0aEFub3RoZXJTY29ybUFQSShuZXdBUEkpIHtcbiAgICAvLyBEYXRhIE1vZGVsXG4gICAgdGhpcy5jbWkgPSBuZXdBUEkuY21pO1xuICAgIHRoaXMubmF2ID0gbmV3QVBJLm5hdjtcbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCB7Q01JQXJyYXl9IGZyb20gJy4vY21pL2NvbW1vbic7XG5pbXBvcnQge1ZhbGlkYXRpb25FcnJvcn0gZnJvbSAnLi9leGNlcHRpb25zJztcbmltcG9ydCB7c2Nvcm0xMl9lcnJvcl9jb2Rlc30gZnJvbSAnLi9jb25zdGFudHMvZXJyb3JfY29kZXMnO1xuaW1wb3J0IHtnbG9iYWxfY29uc3RhbnRzfSBmcm9tICcuL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCB7dW5mbGF0dGVufSBmcm9tICcuL3V0aWxpdGllcyc7XG5cbi8qKlxuICogQmFzZSBBUEkgY2xhc3MgZm9yIEFJQ0MsIFNDT1JNIDEuMiwgYW5kIFNDT1JNIDIwMDQuIFNob3VsZCBiZSBjb25zaWRlcmVkXG4gKiBhYnN0cmFjdCwgYW5kIG5ldmVyIGluaXRpYWxpemVkIG9uIGl0J3Mgb3duLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCYXNlQVBJIHtcbiAgI3RpbWVvdXQ7XG4gICNlcnJvcl9jb2RlcztcbiAgI3NldHRpbmdzID0ge1xuICAgIGF1dG9jb21taXQ6IGZhbHNlLFxuICAgIGF1dG9jb21taXRTZWNvbmRzOiA2MCxcbiAgICBsbXNDb21taXRVcmw6IGZhbHNlLFxuICAgIGRhdGFDb21taXRGb3JtYXQ6ICdqc29uJywgLy8gdmFsaWQgZm9ybWF0cyBhcmUgJ2pzb24nIG9yICdmbGF0dGVuZWQnLCAncGFyYW1zJ1xuICAgIGF1dG9fcHJvZ3Jlc3M6IGZhbHNlLFxuICB9O1xuICBjbWk7XG4gIHN0YXJ0aW5nRGF0YToge307XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBCYXNlIEFQSSBjbGFzcy4gU2V0cyBzb21lIHNoYXJlZCBBUEkgZmllbGRzLCBhcyB3ZWxsIGFzXG4gICAqIHNldHMgdXAgb3B0aW9ucyBmb3IgdGhlIEFQSS5cbiAgICogQHBhcmFtIHtvYmplY3R9IGVycm9yX2NvZGVzXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzZXR0aW5nc1xuICAgKi9cbiAgY29uc3RydWN0b3IoZXJyb3JfY29kZXMsIHNldHRpbmdzKSB7XG4gICAgaWYgKG5ldy50YXJnZXQgPT09IEJhc2VBUEkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb25zdHJ1Y3QgQmFzZUFQSSBpbnN0YW5jZXMgZGlyZWN0bHknKTtcbiAgICB9XG4gICAgdGhpcy5jdXJyZW50U3RhdGUgPSBnbG9iYWxfY29uc3RhbnRzLlNUQVRFX05PVF9JTklUSUFMSVpFRDtcbiAgICB0aGlzLmFwaUxvZ0xldmVsID0gZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfRVJST1I7XG4gICAgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcbiAgICB0aGlzLmxpc3RlbmVyQXJyYXkgPSBbXTtcblxuICAgIHRoaXMuI3RpbWVvdXQgPSBudWxsO1xuICAgIHRoaXMuI2Vycm9yX2NvZGVzID0gZXJyb3JfY29kZXM7XG5cbiAgICB0aGlzLnNldHRpbmdzID0gc2V0dGluZ3M7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgQVBJXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGluaXRpYWxpemVNZXNzYWdlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXJtaW5hdGlvbk1lc3NhZ2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgaW5pdGlhbGl6ZShcbiAgICAgIGNhbGxiYWNrTmFtZTogU3RyaW5nLFxuICAgICAgaW5pdGlhbGl6ZU1lc3NhZ2U/OiBTdHJpbmcsXG4gICAgICB0ZXJtaW5hdGlvbk1lc3NhZ2U/OiBTdHJpbmcpIHtcbiAgICBsZXQgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuXG4gICAgaWYgKHRoaXMuaXNJbml0aWFsaXplZCgpKSB7XG4gICAgICB0aGlzLnRocm93U0NPUk1FcnJvcih0aGlzLiNlcnJvcl9jb2Rlcy5JTklUSUFMSVpFRCwgaW5pdGlhbGl6ZU1lc3NhZ2UpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc1Rlcm1pbmF0ZWQoKSkge1xuICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IodGhpcy4jZXJyb3JfY29kZXMuVEVSTUlOQVRFRCwgdGVybWluYXRpb25NZXNzYWdlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBnbG9iYWxfY29uc3RhbnRzLlNUQVRFX0lOSVRJQUxJWkVEO1xuICAgICAgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcbiAgICAgIHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBudWxsLCAncmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG4gICAgdGhpcy5jbGVhclNDT1JNRXJyb3IocmV0dXJuVmFsdWUpO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3NldHRpbmdzXG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIGdldCBzZXR0aW5ncygpIHtcbiAgICByZXR1cm4gdGhpcy4jc2V0dGluZ3M7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc2V0dGluZ3NcbiAgICogQHBhcmFtIHtvYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBzZXQgc2V0dGluZ3Moc2V0dGluZ3M6IE9iamVjdCkge1xuICAgIHRoaXMuI3NldHRpbmdzID0gey4uLnRoaXMuI3NldHRpbmdzLCAuLi5zZXR0aW5nc307XG4gIH1cblxuICAvKipcbiAgICogVGVybWluYXRlcyB0aGUgY3VycmVudCBydW4gb2YgdGhlIEFQSVxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tUZXJtaW5hdGVkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHRlcm1pbmF0ZShcbiAgICAgIGNhbGxiYWNrTmFtZTogU3RyaW5nLFxuICAgICAgY2hlY2tUZXJtaW5hdGVkOiBib29sZWFuKSB7XG4gICAgbGV0IHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcblxuICAgIGlmICh0aGlzLmNoZWNrU3RhdGUoY2hlY2tUZXJtaW5hdGVkLFxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5URVJNSU5BVElPTl9CRUZPUkVfSU5JVCxcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuTVVMVElQTEVfVEVSTUlOQVRJT04pKSB7XG4gICAgICBjb25zdCByZXN1bHQgPSB0aGlzLnN0b3JlRGF0YSh0cnVlKTtcbiAgICAgIGlmIChyZXN1bHQuZXJyb3JDb2RlICYmIHJlc3VsdC5lcnJvckNvZGUgPiAwKSB7XG4gICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHJlc3VsdC5lcnJvckNvZGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuVmFsdWUgPSByZXN1bHQucmVzdWx0ID9cbiAgICAgICAgICByZXN1bHQucmVzdWx0IDogZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcblxuICAgICAgaWYgKGNoZWNrVGVybWluYXRlZCkgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcbiAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gZ2xvYmFsX2NvbnN0YW50cy5TVEFURV9URVJNSU5BVEVEO1xuICAgICAgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUU7XG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcbiAgICB0aGlzLmNsZWFyU0NPUk1FcnJvcihyZXR1cm5WYWx1ZSk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSB2YWx1ZSBvZiB0aGUgQ01JRWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrVGVybWluYXRlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXRWYWx1ZShcbiAgICAgIGNhbGxiYWNrTmFtZTogU3RyaW5nLFxuICAgICAgY2hlY2tUZXJtaW5hdGVkOiBib29sZWFuLFxuICAgICAgQ01JRWxlbWVudDogU3RyaW5nKSB7XG4gICAgbGV0IHJldHVyblZhbHVlO1xuXG4gICAgaWYgKHRoaXMuY2hlY2tTdGF0ZShjaGVja1Rlcm1pbmF0ZWQsXG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLlJFVFJJRVZFX0JFRk9SRV9JTklULFxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5SRVRSSUVWRV9BRlRFUl9URVJNKSkge1xuICAgICAgaWYgKGNoZWNrVGVybWluYXRlZCkgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcbiAgICAgIHJldHVyblZhbHVlID0gdGhpcy5nZXRDTUlWYWx1ZShDTUlFbGVtZW50KTtcbiAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUsIENNSUVsZW1lbnQpO1xuICAgIH1cblxuICAgIHRoaXMuYXBpTG9nKGNhbGxiYWNrTmFtZSwgQ01JRWxlbWVudCwgJzogcmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG4gICAgdGhpcy5jbGVhclNDT1JNRXJyb3IocmV0dXJuVmFsdWUpO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBDTUlFbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tUZXJtaW5hdGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgc2V0VmFsdWUoXG4gICAgICBjYWxsYmFja05hbWU6IFN0cmluZyxcbiAgICAgIGNoZWNrVGVybWluYXRlZDogYm9vbGVhbixcbiAgICAgIENNSUVsZW1lbnQsXG4gICAgICB2YWx1ZSkge1xuICAgIGxldCByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG5cbiAgICBpZiAodGhpcy5jaGVja1N0YXRlKGNoZWNrVGVybWluYXRlZCwgdGhpcy4jZXJyb3JfY29kZXMuU1RPUkVfQkVGT1JFX0lOSVQsXG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLlNUT1JFX0FGVEVSX1RFUk0pKSB7XG4gICAgICBpZiAoY2hlY2tUZXJtaW5hdGVkKSB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuVmFsdWUgPSB0aGlzLnNldENNSVZhbHVlKENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBWYWxpZGF0aW9uRXJyb3IpIHtcbiAgICAgICAgICB0aGlzLmxhc3RFcnJvckNvZGUgPSBlLmVycm9yQ29kZTtcbiAgICAgICAgICByZXR1cm5WYWx1ZSA9IGdsb2JhbF9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IodGhpcy4jZXJyb3JfY29kZXMuR0VORVJBTCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycyhjYWxsYmFja05hbWUsIENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAocmV0dXJuVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuVmFsdWUgPSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuICAgIH1cblxuICAgIC8vIElmIHdlIGRpZG4ndCBoYXZlIGFueSBlcnJvcnMgd2hpbGUgc2V0dGluZyB0aGUgZGF0YSwgZ28gYWhlYWQgYW5kXG4gICAgLy8gc2NoZWR1bGUgYSBjb21taXQsIGlmIGF1dG9jb21taXQgaXMgdHVybmVkIG9uXG4gICAgaWYgKFN0cmluZyh0aGlzLmxhc3RFcnJvckNvZGUpID09PSAnMCcpIHtcbiAgICAgIGlmICh0aGlzLiNzZXR0aW5ncy5hdXRvY29tbWl0ICYmIHRoaXMuI3RpbWVvdXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnNjaGVkdWxlQ29tbWl0KHRoaXMuI3NldHRpbmdzLmF1dG9jb21taXRTZWNvbmRzICogMTAwMCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBDTUlFbGVtZW50LFxuICAgICAgICAnOiAnICsgdmFsdWUgKyAnOiByZXN1bHQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG4gICAgdGhpcy5jbGVhclNDT1JNRXJyb3IocmV0dXJuVmFsdWUpO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIE9yZGVycyBMTVMgdG8gc3RvcmUgYWxsIGNvbnRlbnQgcGFyYW1ldGVyc1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tUZXJtaW5hdGVkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGNvbW1pdChcbiAgICAgIGNhbGxiYWNrTmFtZTogU3RyaW5nLFxuICAgICAgY2hlY2tUZXJtaW5hdGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5jbGVhclNjaGVkdWxlZENvbW1pdCgpO1xuXG4gICAgbGV0IHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcblxuICAgIGlmICh0aGlzLmNoZWNrU3RhdGUoY2hlY2tUZXJtaW5hdGVkLCB0aGlzLiNlcnJvcl9jb2Rlcy5DT01NSVRfQkVGT1JFX0lOSVQsXG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLkNPTU1JVF9BRlRFUl9URVJNKSkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5zdG9yZURhdGEoZmFsc2UpO1xuICAgICAgaWYgKHJlc3VsdC5lcnJvckNvZGUgJiYgcmVzdWx0LmVycm9yQ29kZSA+IDApIHtcbiAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IocmVzdWx0LmVycm9yQ29kZSk7XG4gICAgICB9XG4gICAgICByZXR1cm5WYWx1ZSA9IHJlc3VsdC5yZXN1bHQgP1xuICAgICAgICAgIHJlc3VsdC5yZXN1bHQgOiBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuXG4gICAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsICdIdHRwUmVxdWVzdCcsICcgUmVzdWx0OiAnICsgcmV0dXJuVmFsdWUsXG4gICAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfREVCVUcpO1xuXG4gICAgICBpZiAoY2hlY2tUZXJtaW5hdGVkKSB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuXG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcbiAgICB0aGlzLmNsZWFyU0NPUk1FcnJvcihyZXR1cm5WYWx1ZSk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBsYXN0IGVycm9yIGNvZGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXRMYXN0RXJyb3IoY2FsbGJhY2tOYW1lOiBTdHJpbmcpIHtcbiAgICBjb25zdCByZXR1cm5WYWx1ZSA9IFN0cmluZyh0aGlzLmxhc3RFcnJvckNvZGUpO1xuXG4gICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSk7XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBlcnJvck51bWJlciBlcnJvciBkZXNjcmlwdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXIpfSBDTUlFcnJvckNvZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0RXJyb3JTdHJpbmcoY2FsbGJhY2tOYW1lOiBTdHJpbmcsIENNSUVycm9yQ29kZSkge1xuICAgIGxldCByZXR1cm5WYWx1ZSA9ICcnO1xuXG4gICAgaWYgKENNSUVycm9yQ29kZSAhPT0gbnVsbCAmJiBDTUlFcnJvckNvZGUgIT09ICcnKSB7XG4gICAgICByZXR1cm5WYWx1ZSA9IHRoaXMuZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhDTUlFcnJvckNvZGUpO1xuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBudWxsLCAncmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGNvbXByZWhlbnNpdmUgZGVzY3JpcHRpb24gb2YgdGhlIGVycm9yTnVtYmVyIGVycm9yLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXIpfSBDTUlFcnJvckNvZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0RGlhZ25vc3RpYyhjYWxsYmFja05hbWU6IFN0cmluZywgQ01JRXJyb3JDb2RlKSB7XG4gICAgbGV0IHJldHVyblZhbHVlID0gJyc7XG5cbiAgICBpZiAoQ01JRXJyb3JDb2RlICE9PSBudWxsICYmIENNSUVycm9yQ29kZSAhPT0gJycpIHtcbiAgICAgIHJldHVyblZhbHVlID0gdGhpcy5nZXRMbXNFcnJvck1lc3NhZ2VEZXRhaWxzKENNSUVycm9yQ29kZSwgdHJ1ZSk7XG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgdGhlIExNUyBzdGF0ZSBhbmQgZW5zdXJlcyBpdCBoYXMgYmVlbiBpbml0aWFsaXplZC5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBjaGVja1Rlcm1pbmF0ZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGJlZm9yZUluaXRFcnJvclxuICAgKiBAcGFyYW0ge251bWJlcn0gYWZ0ZXJUZXJtRXJyb3JcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGNoZWNrU3RhdGUoXG4gICAgICBjaGVja1Rlcm1pbmF0ZWQ6IGJvb2xlYW4sXG4gICAgICBiZWZvcmVJbml0RXJyb3I6IG51bWJlcixcbiAgICAgIGFmdGVyVGVybUVycm9yPzogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuaXNOb3RJbml0aWFsaXplZCgpKSB7XG4gICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihiZWZvcmVJbml0RXJyb3IpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoY2hlY2tUZXJtaW5hdGVkICYmIHRoaXMuaXNUZXJtaW5hdGVkKCkpIHtcbiAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGFmdGVyVGVybUVycm9yKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2dnaW5nIGZvciBhbGwgU0NPUk0gYWN0aW9uc1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZnVuY3Rpb25OYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2dNZXNzYWdlXG4gICAqIEBwYXJhbSB7bnVtYmVyfW1lc3NhZ2VMZXZlbFxuICAgKi9cbiAgYXBpTG9nKFxuICAgICAgZnVuY3Rpb25OYW1lOiBTdHJpbmcsXG4gICAgICBDTUlFbGVtZW50OiBTdHJpbmcsXG4gICAgICBsb2dNZXNzYWdlOiBTdHJpbmcsXG4gICAgICBtZXNzYWdlTGV2ZWw6IG51bWJlcikge1xuICAgIGxvZ01lc3NhZ2UgPSB0aGlzLmZvcm1hdE1lc3NhZ2UoZnVuY3Rpb25OYW1lLCBDTUlFbGVtZW50LCBsb2dNZXNzYWdlKTtcblxuICAgIGlmIChtZXNzYWdlTGV2ZWwgPj0gdGhpcy5hcGlMb2dMZXZlbCkge1xuICAgICAgc3dpdGNoIChtZXNzYWdlTGV2ZWwpIHtcbiAgICAgICAgY2FzZSBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9FUlJPUjpcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGxvZ01lc3NhZ2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX1dBUk5JTkc6XG4gICAgICAgICAgY29uc29sZS53YXJuKGxvZ01lc3NhZ2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0lORk86XG4gICAgICAgICAgY29uc29sZS5pbmZvKGxvZ01lc3NhZ2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGb3JtYXRzIHRoZSBTQ09STSBtZXNzYWdlcyBmb3IgZWFzeSByZWFkaW5nXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmdW5jdGlvbk5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZm9ybWF0TWVzc2FnZShmdW5jdGlvbk5hbWU6IFN0cmluZywgQ01JRWxlbWVudDogU3RyaW5nLCBtZXNzYWdlOiBTdHJpbmcpIHtcbiAgICBjb25zdCBiYXNlTGVuZ3RoID0gMjA7XG4gICAgbGV0IG1lc3NhZ2VTdHJpbmcgPSAnJztcblxuICAgIG1lc3NhZ2VTdHJpbmcgKz0gZnVuY3Rpb25OYW1lO1xuXG4gICAgbGV0IGZpbGxDaGFycyA9IGJhc2VMZW5ndGggLSBtZXNzYWdlU3RyaW5nLmxlbmd0aDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsbENoYXJzOyBpKyspIHtcbiAgICAgIG1lc3NhZ2VTdHJpbmcgKz0gJyAnO1xuICAgIH1cblxuICAgIG1lc3NhZ2VTdHJpbmcgKz0gJzogJztcblxuICAgIGlmIChDTUlFbGVtZW50KSB7XG4gICAgICBjb25zdCBDTUlFbGVtZW50QmFzZUxlbmd0aCA9IDcwO1xuXG4gICAgICBtZXNzYWdlU3RyaW5nICs9IENNSUVsZW1lbnQ7XG5cbiAgICAgIGZpbGxDaGFycyA9IENNSUVsZW1lbnRCYXNlTGVuZ3RoIC0gbWVzc2FnZVN0cmluZy5sZW5ndGg7XG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZmlsbENoYXJzOyBqKyspIHtcbiAgICAgICAgbWVzc2FnZVN0cmluZyArPSAnICc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgIG1lc3NhZ2VTdHJpbmcgKz0gbWVzc2FnZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVzc2FnZVN0cmluZztcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgdG8gc2VlIGlmIHtzdHJ9IGNvbnRhaW5zIHt0ZXN0ZXJ9XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgU3RyaW5nIHRvIGNoZWNrIGFnYWluc3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRlc3RlciBTdHJpbmcgdG8gY2hlY2sgZm9yXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBzdHJpbmdNYXRjaGVzKHN0cjogU3RyaW5nLCB0ZXN0ZXI6IFN0cmluZykge1xuICAgIHJldHVybiBzdHIgJiYgdGVzdGVyICYmIHN0ci5tYXRjaCh0ZXN0ZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIHRvIHNlZSBpZiB0aGUgc3BlY2lmaWMgb2JqZWN0IGhhcyB0aGUgZ2l2ZW4gcHJvcGVydHlcbiAgICogQHBhcmFtIHsqfSByZWZPYmplY3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IGF0dHJpYnV0ZVxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2NoZWNrT2JqZWN0SGFzUHJvcGVydHkocmVmT2JqZWN0LCBhdHRyaWJ1dGU6IFN0cmluZykge1xuICAgIHJldHVybiBPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChyZWZPYmplY3QsIGF0dHJpYnV0ZSkgfHxcbiAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihcbiAgICAgICAgICAgIE9iamVjdC5nZXRQcm90b3R5cGVPZihyZWZPYmplY3QpLCBhdHRyaWJ1dGUpIHx8XG4gICAgICAgIChhdHRyaWJ1dGUgaW4gcmVmT2JqZWN0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtZXNzYWdlIHRoYXQgY29ycmVzcG9uZHMgdG8gZXJyb3JOdW1iZXJcbiAgICogQVBJcyB0aGF0IGluaGVyaXQgQmFzZUFQSSBzaG91bGQgb3ZlcnJpZGUgdGhpcyBmdW5jdGlvblxuICAgKlxuICAgKiBAcGFyYW0geyhzdHJpbmd8bnVtYmVyKX0gX2Vycm9yTnVtYmVyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gX2RldGFpbFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhfZXJyb3JOdW1iZXIsIF9kZXRhaWwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdUaGUgZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyBtZXRob2QgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdmFsdWUgZm9yIHRoZSBzcGVjaWZpYyBlbGVtZW50LlxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBhYnN0cmFjdFxuICAgKi9cbiAgZ2V0Q01JVmFsdWUoX0NNSUVsZW1lbnQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBnZXRDTUlWYWx1ZSBtZXRob2QgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgZm9yIHRoZSBzcGVjaWZpYyBlbGVtZW50LlxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfQ01JRWxlbWVudFxuICAgKiBAcGFyYW0ge2FueX0gX3ZhbHVlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBzZXRDTUlWYWx1ZShfQ01JRWxlbWVudCwgX3ZhbHVlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgc2V0Q01JVmFsdWUgbWV0aG9kIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNoYXJlZCBBUEkgbWV0aG9kIHRvIHNldCBhIHZhbGlkIGZvciBhIGdpdmVuIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc2Nvcm0yMDA0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgX2NvbW1vblNldENNSVZhbHVlKFxuICAgICAgbWV0aG9kTmFtZTogU3RyaW5nLCBzY29ybTIwMDQ6IGJvb2xlYW4sIENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgaWYgKCFDTUlFbGVtZW50IHx8IENNSUVsZW1lbnQgPT09ICcnKSB7XG4gICAgICByZXR1cm4gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcbiAgICB9XG5cbiAgICBjb25zdCBzdHJ1Y3R1cmUgPSBDTUlFbGVtZW50LnNwbGl0KCcuJyk7XG4gICAgbGV0IHJlZk9iamVjdCA9IHRoaXM7XG4gICAgbGV0IHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcbiAgICBsZXQgZm91bmRGaXJzdEluZGV4ID0gZmFsc2U7XG5cbiAgICBjb25zdCBpbnZhbGlkRXJyb3JNZXNzYWdlID0gYFRoZSBkYXRhIG1vZGVsIGVsZW1lbnQgcGFzc2VkIHRvICR7bWV0aG9kTmFtZX0gKCR7Q01JRWxlbWVudH0pIGlzIG5vdCBhIHZhbGlkIFNDT1JNIGRhdGEgbW9kZWwgZWxlbWVudC5gO1xuICAgIGNvbnN0IGludmFsaWRFcnJvckNvZGUgPSBzY29ybTIwMDQgP1xuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5VTkRFRklORURfREFUQV9NT0RFTCA6XG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLkdFTkVSQUw7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0cnVjdHVyZS5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYXR0cmlidXRlID0gc3RydWN0dXJlW2ldO1xuXG4gICAgICBpZiAoaSA9PT0gc3RydWN0dXJlLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgaWYgKHNjb3JtMjAwNCAmJiAoYXR0cmlidXRlLnN1YnN0cigwLCA4KSA9PT0gJ3t0YXJnZXQ9JykgJiZcbiAgICAgICAgICAgICh0eXBlb2YgcmVmT2JqZWN0Ll9pc1RhcmdldFZhbGlkID09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IodGhpcy4jZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQpO1xuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9jaGVja09iamVjdEhhc1Byb3BlcnR5KHJlZk9iamVjdCwgYXR0cmlidXRlKSkge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ1xcXFwuY29ycmVjdF9yZXNwb25zZXNcXFxcLlxcXFxkJykpIHtcbiAgICAgICAgICAgIHRoaXMudmFsaWRhdGVDb3JyZWN0UmVzcG9uc2UoQ01JRWxlbWVudCwgdmFsdWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghc2Nvcm0yMDA0IHx8IHRoaXMubGFzdEVycm9yQ29kZSA9PT0gMCkge1xuICAgICAgICAgICAgcmVmT2JqZWN0W2F0dHJpYnV0ZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHJldHVyblZhbHVlID0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVmT2JqZWN0ID0gcmVmT2JqZWN0W2F0dHJpYnV0ZV07XG4gICAgICAgIGlmICghcmVmT2JqZWN0KSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoaW52YWxpZEVycm9yQ29kZSwgaW52YWxpZEVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVmT2JqZWN0IGluc3RhbmNlb2YgQ01JQXJyYXkpIHtcbiAgICAgICAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KHN0cnVjdHVyZVtpICsgMV0sIDEwKTtcblxuICAgICAgICAgIC8vIFNDTyBpcyB0cnlpbmcgdG8gc2V0IGFuIGl0ZW0gb24gYW4gYXJyYXlcbiAgICAgICAgICBpZiAoIWlzTmFOKGluZGV4KSkge1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHJlZk9iamVjdC5jaGlsZEFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgcmVmT2JqZWN0ID0gaXRlbTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnN0IG5ld0NoaWxkID0gdGhpcy5nZXRDaGlsZEVsZW1lbnQoQ01JRWxlbWVudCwgdmFsdWUsXG4gICAgICAgICAgICAgICAgICBmb3VuZEZpcnN0SW5kZXgpO1xuICAgICAgICAgICAgICBmb3VuZEZpcnN0SW5kZXggPSB0cnVlO1xuXG4gICAgICAgICAgICAgIGlmICghbmV3Q2hpbGQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihpbnZhbGlkRXJyb3JDb2RlLCBpbnZhbGlkRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocmVmT2JqZWN0LmluaXRpYWxpemVkKSBuZXdDaGlsZC5pbml0aWFsaXplKCk7XG5cbiAgICAgICAgICAgICAgICByZWZPYmplY3QuY2hpbGRBcnJheS5wdXNoKG5ld0NoaWxkKTtcbiAgICAgICAgICAgICAgICByZWZPYmplY3QgPSBuZXdDaGlsZDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBIYXZlIHRvIHVwZGF0ZSBpIHZhbHVlIHRvIHNraXAgdGhlIGFycmF5IHBvc2l0aW9uXG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJldHVyblZhbHVlID09PSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX0ZBTFNFKSB7XG4gICAgICB0aGlzLmFwaUxvZyhtZXRob2ROYW1lLCBudWxsLFxuICAgICAgICAgIGBUaGVyZSB3YXMgYW4gZXJyb3Igc2V0dGluZyB0aGUgdmFsdWUgZm9yOiAke0NNSUVsZW1lbnR9LCB2YWx1ZSBvZjogJHt2YWx1ZX1gLFxuICAgICAgICAgIGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX1dBUk5JTkcpO1xuICAgIH1cblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBYnN0cmFjdCBtZXRob2QgZm9yIHZhbGlkYXRpbmcgdGhhdCBhIHJlc3BvbnNlIGlzIGNvcnJlY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfQ01JRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IF92YWx1ZVxuICAgKi9cbiAgdmFsaWRhdGVDb3JyZWN0UmVzcG9uc2UoX0NNSUVsZW1lbnQsIF92YWx1ZSkge1xuICAgIC8vIGp1c3QgYSBzdHViIG1ldGhvZFxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgb3IgYnVpbGRzIGEgbmV3IGNoaWxkIGVsZW1lbnQgdG8gYWRkIHRvIHRoZSBhcnJheS5cbiAgICogQVBJcyB0aGF0IGluaGVyaXQgQmFzZUFQSSBzaG91bGQgb3ZlcnJpZGUgdGhpcyBtZXRob2QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfQ01JRWxlbWVudCAtIHVudXNlZFxuICAgKiBAcGFyYW0geyp9IF92YWx1ZSAtIHVudXNlZFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IF9mb3VuZEZpcnN0SW5kZXggLSB1bnVzZWRcbiAgICogQHJldHVybiB7Kn1cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBnZXRDaGlsZEVsZW1lbnQoX0NNSUVsZW1lbnQsIF92YWx1ZSwgX2ZvdW5kRmlyc3RJbmRleCkge1xuICAgIHRocm93IG5ldyBFcnJvcignVGhlIGdldENoaWxkRWxlbWVudCBtZXRob2QgaGFzIG5vdCBiZWVuIGltcGxlbWVudGVkJyk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHZhbHVlIGZyb20gdGhlIENNSSBPYmplY3RcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1ldGhvZE5hbWVcbiAgICogQHBhcmFtIHtib29sZWFufSBzY29ybTIwMDRcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIF9jb21tb25HZXRDTUlWYWx1ZShtZXRob2ROYW1lOiBTdHJpbmcsIHNjb3JtMjAwNDogYm9vbGVhbiwgQ01JRWxlbWVudCkge1xuICAgIGlmICghQ01JRWxlbWVudCB8fCBDTUlFbGVtZW50ID09PSAnJykge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIGNvbnN0IHN0cnVjdHVyZSA9IENNSUVsZW1lbnQuc3BsaXQoJy4nKTtcbiAgICBsZXQgcmVmT2JqZWN0ID0gdGhpcztcbiAgICBsZXQgYXR0cmlidXRlID0gbnVsbDtcblxuICAgIGNvbnN0IHVuaW5pdGlhbGl6ZWRFcnJvck1lc3NhZ2UgPSBgVGhlIGRhdGEgbW9kZWwgZWxlbWVudCBwYXNzZWQgdG8gJHttZXRob2ROYW1lfSAoJHtDTUlFbGVtZW50fSkgaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkLmA7XG4gICAgY29uc3QgaW52YWxpZEVycm9yTWVzc2FnZSA9IGBUaGUgZGF0YSBtb2RlbCBlbGVtZW50IHBhc3NlZCB0byAke21ldGhvZE5hbWV9ICgke0NNSUVsZW1lbnR9KSBpcyBub3QgYSB2YWxpZCBTQ09STSBkYXRhIG1vZGVsIGVsZW1lbnQuYDtcbiAgICBjb25zdCBpbnZhbGlkRXJyb3JDb2RlID0gc2Nvcm0yMDA0ID9cbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuVU5ERUZJTkVEX0RBVEFfTU9ERUwgOlxuICAgICAgICB0aGlzLiNlcnJvcl9jb2Rlcy5HRU5FUkFMO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHJ1Y3R1cmUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGF0dHJpYnV0ZSA9IHN0cnVjdHVyZVtpXTtcblxuICAgICAgaWYgKCFzY29ybTIwMDQpIHtcbiAgICAgICAgaWYgKGkgPT09IHN0cnVjdHVyZS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLl9jaGVja09iamVjdEhhc1Byb3BlcnR5KHJlZk9iamVjdCwgYXR0cmlidXRlKSkge1xuICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoaW52YWxpZEVycm9yQ29kZSwgaW52YWxpZEVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoKFN0cmluZyhhdHRyaWJ1dGUpLnN1YnN0cigwLCA4KSA9PT0gJ3t0YXJnZXQ9JykgJiZcbiAgICAgICAgICAgICh0eXBlb2YgcmVmT2JqZWN0Ll9pc1RhcmdldFZhbGlkID09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgY29uc3QgdGFyZ2V0ID0gU3RyaW5nKGF0dHJpYnV0ZSkuXG4gICAgICAgICAgICAgIHN1YnN0cig4LCBTdHJpbmcoYXR0cmlidXRlKS5sZW5ndGggLSA5KTtcbiAgICAgICAgICByZXR1cm4gcmVmT2JqZWN0Ll9pc1RhcmdldFZhbGlkKHRhcmdldCk7XG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX2NoZWNrT2JqZWN0SGFzUHJvcGVydHkocmVmT2JqZWN0LCBhdHRyaWJ1dGUpKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoaW52YWxpZEVycm9yQ29kZSwgaW52YWxpZEVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJlZk9iamVjdCA9IHJlZk9iamVjdFthdHRyaWJ1dGVdO1xuICAgICAgaWYgKHJlZk9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGludmFsaWRFcnJvckNvZGUsIGludmFsaWRFcnJvck1lc3NhZ2UpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgaWYgKHJlZk9iamVjdCBpbnN0YW5jZW9mIENNSUFycmF5KSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoc3RydWN0dXJlW2kgKyAxXSwgMTApO1xuXG4gICAgICAgIC8vIFNDTyBpcyB0cnlpbmcgdG8gc2V0IGFuIGl0ZW0gb24gYW4gYXJyYXlcbiAgICAgICAgaWYgKCFpc05hTihpbmRleCkpIHtcbiAgICAgICAgICBjb25zdCBpdGVtID0gcmVmT2JqZWN0LmNoaWxkQXJyYXlbaW5kZXhdO1xuXG4gICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgIHJlZk9iamVjdCA9IGl0ZW07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHRoaXMuI2Vycm9yX2NvZGVzLlZBTFVFX05PVF9JTklUSUFMSVpFRCxcbiAgICAgICAgICAgICAgICB1bmluaXRpYWxpemVkRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIEhhdmUgdG8gdXBkYXRlIGkgdmFsdWUgdG8gc2tpcCB0aGUgYXJyYXkgcG9zaXRpb25cbiAgICAgICAgICBpKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocmVmT2JqZWN0ID09PSBudWxsIHx8IHJlZk9iamVjdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoIXNjb3JtMjAwNCkge1xuICAgICAgICBpZiAoYXR0cmlidXRlID09PSAnX2NoaWxkcmVuJykge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMTJfZXJyb3JfY29kZXMuQ0hJTERSRU5fRVJST1IpO1xuICAgICAgICB9IGVsc2UgaWYgKGF0dHJpYnV0ZSA9PT0gJ19jb3VudCcpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTEyX2Vycm9yX2NvZGVzLkNPVU5UX0VSUk9SKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVmT2JqZWN0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIEFQSSdzIGN1cnJlbnQgc3RhdGUgaXMgU1RBVEVfSU5JVElBTElaRURcbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGlzSW5pdGlhbGl6ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlID09PSBnbG9iYWxfY29uc3RhbnRzLlNUQVRFX0lOSVRJQUxJWkVEO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgQVBJJ3MgY3VycmVudCBzdGF0ZSBpcyBTVEFURV9OT1RfSU5JVElBTElaRURcbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGlzTm90SW5pdGlhbGl6ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlID09PSBnbG9iYWxfY29uc3RhbnRzLlNUQVRFX05PVF9JTklUSUFMSVpFRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIEFQSSdzIGN1cnJlbnQgc3RhdGUgaXMgU1RBVEVfVEVSTUlOQVRFRFxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgaXNUZXJtaW5hdGVkKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9PT0gZ2xvYmFsX2NvbnN0YW50cy5TVEFURV9URVJNSU5BVEVEO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3ZpZGVzIGEgbWVjaGFuaXNtIGZvciBhdHRhY2hpbmcgdG8gYSBzcGVjaWZpYyBTQ09STSBldmVudFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGlzdGVuZXJOYW1lXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbihsaXN0ZW5lck5hbWU6IFN0cmluZywgY2FsbGJhY2s6IGZ1bmN0aW9uKSB7XG4gICAgaWYgKCFjYWxsYmFjaykgcmV0dXJuO1xuXG4gICAgY29uc3QgbGlzdGVuZXJGdW5jdGlvbnMgPSBsaXN0ZW5lck5hbWUuc3BsaXQoJyAnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3RlbmVyRnVuY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lclNwbGl0ID0gbGlzdGVuZXJGdW5jdGlvbnNbaV0uc3BsaXQoJy4nKTtcbiAgICAgIGlmIChsaXN0ZW5lclNwbGl0Lmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBmdW5jdGlvbk5hbWUgPSBsaXN0ZW5lclNwbGl0WzBdO1xuXG4gICAgICBsZXQgQ01JRWxlbWVudCA9IG51bGw7XG4gICAgICBpZiAobGlzdGVuZXJTcGxpdC5sZW5ndGggPiAxKSB7XG4gICAgICAgIENNSUVsZW1lbnQgPSBsaXN0ZW5lck5hbWUucmVwbGFjZShmdW5jdGlvbk5hbWUgKyAnLicsICcnKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5saXN0ZW5lckFycmF5LnB1c2goe1xuICAgICAgICBmdW5jdGlvbk5hbWU6IGZ1bmN0aW9uTmFtZSxcbiAgICAgICAgQ01JRWxlbWVudDogQ01JRWxlbWVudCxcbiAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByb2Nlc3NlcyBhbnkgJ29uJyBsaXN0ZW5lcnMgdGhhdCBoYXZlIGJlZW4gY3JlYXRlZFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZnVuY3Rpb25OYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICovXG4gIHByb2Nlc3NMaXN0ZW5lcnMoZnVuY3Rpb25OYW1lOiBTdHJpbmcsIENNSUVsZW1lbnQ6IFN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saXN0ZW5lckFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IHRoaXMubGlzdGVuZXJBcnJheVtpXTtcbiAgICAgIGNvbnN0IGZ1bmN0aW9uc01hdGNoID0gbGlzdGVuZXIuZnVuY3Rpb25OYW1lID09PSBmdW5jdGlvbk5hbWU7XG4gICAgICBjb25zdCBsaXN0ZW5lckhhc0NNSUVsZW1lbnQgPSAhIWxpc3RlbmVyLkNNSUVsZW1lbnQ7XG4gICAgICBjb25zdCBDTUlFbGVtZW50c01hdGNoID0gbGlzdGVuZXIuQ01JRWxlbWVudCA9PT0gQ01JRWxlbWVudDtcblxuICAgICAgaWYgKGZ1bmN0aW9uc01hdGNoICYmICghbGlzdGVuZXJIYXNDTUlFbGVtZW50IHx8IENNSUVsZW1lbnRzTWF0Y2gpKSB7XG4gICAgICAgIGxpc3RlbmVyLmNhbGxiYWNrKENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhyb3dzIGEgU0NPUk0gZXJyb3JcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGVycm9yTnVtYmVyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXG4gICAqL1xuICB0aHJvd1NDT1JNRXJyb3IoZXJyb3JOdW1iZXI6IG51bWJlciwgbWVzc2FnZTogU3RyaW5nKSB7XG4gICAgaWYgKCFtZXNzYWdlKSB7XG4gICAgICBtZXNzYWdlID0gdGhpcy5nZXRMbXNFcnJvck1lc3NhZ2VEZXRhaWxzKGVycm9yTnVtYmVyKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZygndGhyb3dTQ09STUVycm9yJywgbnVsbCwgZXJyb3JOdW1iZXIgKyAnOiAnICsgbWVzc2FnZSxcbiAgICAgICAgZ2xvYmFsX2NvbnN0YW50cy5MT0dfTEVWRUxfRVJST1IpO1xuXG4gICAgdGhpcy5sYXN0RXJyb3JDb2RlID0gU3RyaW5nKGVycm9yTnVtYmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIGxhc3QgU0NPUk0gZXJyb3IgY29kZSBvbiBzdWNjZXNzLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3VjY2Vzc1xuICAgKi9cbiAgY2xlYXJTQ09STUVycm9yKHN1Y2Nlc3M6IFN0cmluZykge1xuICAgIGlmIChzdWNjZXNzICE9PSB1bmRlZmluZWQgJiYgc3VjY2VzcyAhPT0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRSkge1xuICAgICAgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdHMgdG8gc3RvcmUgdGhlIGRhdGEgdG8gdGhlIExNUywgbG9ncyBkYXRhIGlmIG5vIExNUyBjb25maWd1cmVkXG4gICAqIEFQSXMgdGhhdCBpbmhlcml0IEJhc2VBUEkgc2hvdWxkIG92ZXJyaWRlIHRoaXMgZnVuY3Rpb25cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBfY2FsY3VsYXRlVG90YWxUaW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICBzdG9yZURhdGEoX2NhbGN1bGF0ZVRvdGFsVGltZSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ1RoZSBzdG9yZURhdGEgbWV0aG9kIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvYWQgdGhlIENNSSBmcm9tIGEgZmxhdHRlbmVkIEpTT04gb2JqZWN0XG4gICAqIEBwYXJhbSB7b2JqZWN0fSBqc29uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqL1xuICBsb2FkRnJvbUZsYXR0ZW5lZEpTT04oanNvbiwgQ01JRWxlbWVudCkge1xuICAgIHRoaXMubG9hZEZyb21KU09OKHVuZmxhdHRlbihqc29uKSwgQ01JRWxlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogTG9hZHMgQ01JIGRhdGEgZnJvbSBhIEpTT04gb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0ganNvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKi9cbiAgbG9hZEZyb21KU09OKGpzb24sIENNSUVsZW1lbnQpIHtcbiAgICBpZiAoIXRoaXMuaXNOb3RJbml0aWFsaXplZCgpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICdsb2FkRnJvbUpTT04gY2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSB0aGUgY2FsbCB0byBsbXNJbml0aWFsaXplLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIENNSUVsZW1lbnQgPSBDTUlFbGVtZW50IHx8ICdjbWknO1xuXG4gICAgdGhpcy5zdGFydGluZ0RhdGEgPSBqc29uO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4ganNvbikge1xuICAgICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoanNvbiwga2V5KSAmJiBqc29uW2tleV0pIHtcbiAgICAgICAgY29uc3QgY3VycmVudENNSUVsZW1lbnQgPSBDTUlFbGVtZW50ICsgJy4nICsga2V5O1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGpzb25ba2V5XTtcblxuICAgICAgICBpZiAodmFsdWVbJ2NoaWxkQXJyYXknXSkge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWVbJ2NoaWxkQXJyYXknXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5sb2FkRnJvbUpTT04odmFsdWVbJ2NoaWxkQXJyYXknXVtpXSxcbiAgICAgICAgICAgICAgICBjdXJyZW50Q01JRWxlbWVudCArICcuJyArIGkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB7XG4gICAgICAgICAgdGhpcy5sb2FkRnJvbUpTT04odmFsdWUsIGN1cnJlbnRDTUlFbGVtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldENNSVZhbHVlKGN1cnJlbnRDTUlFbGVtZW50LCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBDTUkgb2JqZWN0IHRvIEpTT04gZm9yIHNlbmRpbmcgdG8gYW4gTE1TLlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICByZW5kZXJDTUlUb0pTT05TdHJpbmcoKSB7XG4gICAgY29uc3QgY21pID0gdGhpcy5jbWk7XG4gICAgLy8gRG8gd2Ugd2FudC9uZWVkIHRvIHJldHVybiBmaWVsZHMgdGhhdCBoYXZlIG5vIHNldCB2YWx1ZT9cbiAgICAvLyByZXR1cm4gSlNPTi5zdHJpbmdpZnkoeyBjbWkgfSwgKGssIHYpID0+IHYgPT09IHVuZGVmaW5lZCA/IG51bGwgOiB2LCAyKTtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoe2NtaX0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBKUyBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjdXJyZW50IGNtaVxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICByZW5kZXJDTUlUb0pTT05PYmplY3QoKSB7XG4gICAgLy8gRG8gd2Ugd2FudC9uZWVkIHRvIHJldHVybiBmaWVsZHMgdGhhdCBoYXZlIG5vIHNldCB2YWx1ZT9cbiAgICAvLyByZXR1cm4gSlNPTi5zdHJpbmdpZnkoeyBjbWkgfSwgKGssIHYpID0+IHYgPT09IHVuZGVmaW5lZCA/IG51bGwgOiB2LCAyKTtcbiAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLnJlbmRlckNNSVRvSlNPTlN0cmluZygpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGNtaSBvYmplY3QgdG8gdGhlIHByb3BlciBmb3JtYXQgZm9yIExNUyBjb21taXRcbiAgICogQVBJcyB0aGF0IGluaGVyaXQgQmFzZUFQSSBzaG91bGQgb3ZlcnJpZGUgdGhpcyBmdW5jdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IF90ZXJtaW5hdGVDb21taXRcbiAgICogQHJldHVybiB7Kn1cbiAgICogQGFic3RyYWN0XG4gICAqL1xuICByZW5kZXJDb21taXRDTUkoX3Rlcm1pbmF0ZUNvbW1pdCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ1RoZSBzdG9yZURhdGEgbWV0aG9kIGhhcyBub3QgYmVlbiBpbXBsZW1lbnRlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgdGhlIHJlcXVlc3QgdG8gdGhlIExNU1xuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAqIEBwYXJhbSB7b2JqZWN0fEFycmF5fSBwYXJhbXNcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cbiAgcHJvY2Vzc0h0dHBSZXF1ZXN0KHVybDogU3RyaW5nLCBwYXJhbXMpIHtcbiAgICBjb25zdCBnZW5lcmljRXJyb3IgPSB7XG4gICAgICAncmVzdWx0JzogZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9GQUxTRSxcbiAgICAgICdlcnJvckNvZGUnOiB0aGlzLiNlcnJvcl9jb2Rlcy5HRU5FUkFMLFxuICAgIH07XG5cbiAgICBjb25zdCBodHRwUmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgaHR0cFJlcS5vcGVuKCdQT1NUJywgdXJsLCBmYWxzZSk7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChwYXJhbXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICBodHRwUmVxLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsXG4gICAgICAgICAgICAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XG4gICAgICAgIGh0dHBSZXEuc2VuZChwYXJhbXMuam9pbignJicpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGh0dHBSZXEuc2VuZChwYXJhbXMpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBnZW5lcmljRXJyb3I7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGh0dHBSZXEucmVzcG9uc2VUZXh0KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gZ2VuZXJpY0Vycm9yO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaHJvd3MgYSBTQ09STSBlcnJvclxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gd2hlbiAtIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHdhaXQgYmVmb3JlIGNvbW1pdHRpbmdcbiAgICovXG4gIHNjaGVkdWxlQ29tbWl0KHdoZW46IG51bWJlcikge1xuICAgIHRoaXMuI3RpbWVvdXQgPSBuZXcgU2NoZWR1bGVkQ29tbWl0KHRoaXMsIHdoZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFycyBhbmQgY2FuY2VscyBhbnkgY3VycmVudGx5IHNjaGVkdWxlZCBjb21taXRzXG4gICAqL1xuICBjbGVhclNjaGVkdWxlZENvbW1pdCgpIHtcbiAgICBpZiAodGhpcy4jdGltZW91dCkge1xuICAgICAgdGhpcy4jdGltZW91dC5jYW5jZWwoKTtcbiAgICAgIHRoaXMuI3RpbWVvdXQgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFByaXZhdGUgY2xhc3MgdGhhdCB3cmFwcyBhIHRpbWVvdXQgY2FsbCB0byB0aGUgY29tbWl0KCkgZnVuY3Rpb25cbiAqL1xuY2xhc3MgU2NoZWR1bGVkQ29tbWl0IHtcbiAgI0FQSTtcbiAgI2NhbmNlbGxlZDogZmFsc2U7XG4gICN0aW1lb3V0O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgU2NoZWR1bGVkQ29tbWl0XG4gICAqIEBwYXJhbSB7QmFzZUFQSX0gQVBJXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aGVuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihBUEk6IGFueSwgd2hlbjogbnVtYmVyKSB7XG4gICAgdGhpcy4jQVBJID0gQVBJO1xuICAgIHRoaXMuI3RpbWVvdXQgPSBzZXRUaW1lb3V0KHRoaXMud3JhcHBlciwgd2hlbik7XG4gIH1cblxuICAvKipcbiAgICogQ2FuY2VsIGFueSBjdXJyZW50bHkgc2NoZWR1bGVkIGNvbW1pdFxuICAgKi9cbiAgY2FuY2VsKCkge1xuICAgIHRoaXMuI2NhbmNlbGxlZCA9IHRydWU7XG4gICAgaWYgKHRoaXMuI3RpbWVvdXQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLiN0aW1lb3V0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV3JhcCB0aGUgQVBJIGNvbW1pdCBjYWxsIHRvIGNoZWNrIGlmIHRoZSBjYWxsIGhhcyBhbHJlYWR5IGJlZW4gY2FuY2VsbGVkXG4gICAqL1xuICB3cmFwcGVyKCkge1xuICAgIGlmICghdGhpcy4jY2FuY2VsbGVkKSB7XG4gICAgICB0aGlzLiNBUEkuY29tbWl0KCk7XG4gICAgfVxuICB9XG59XG4iLCIvLyBAZmxvd1xuaW1wb3J0IEJhc2VBUEkgZnJvbSAnLi9CYXNlQVBJJztcbmltcG9ydCB7XG4gIENNSSxcbiAgQ01JSW50ZXJhY3Rpb25zQ29ycmVjdFJlc3BvbnNlc09iamVjdCxcbiAgQ01JSW50ZXJhY3Rpb25zT2JqZWN0LFxuICBDTUlJbnRlcmFjdGlvbnNPYmplY3RpdmVzT2JqZWN0LFxuICBDTUlPYmplY3RpdmVzT2JqZWN0LCBOQVYsXG59IGZyb20gJy4vY21pL3Njb3JtMTJfY21pJztcbmltcG9ydCAqIGFzIFV0aWxpdGllcyBmcm9tICcuL3V0aWxpdGllcyc7XG5pbXBvcnQge2dsb2JhbF9jb25zdGFudHMsIHNjb3JtMTJfY29uc3RhbnRzfSBmcm9tICcuL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCB7c2Nvcm0xMl9lcnJvcl9jb2Rlc30gZnJvbSAnLi9jb25zdGFudHMvZXJyb3JfY29kZXMnO1xuXG5jb25zdCBjb25zdGFudHMgPSBzY29ybTEyX2NvbnN0YW50cztcblxuLyoqXG4gKiBBUEkgY2xhc3MgZm9yIFNDT1JNIDEuMlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY29ybTEyQVBJIGV4dGVuZHMgQmFzZUFQSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgU0NPUk0gMS4yIEFQSVxuICAgKiBAcGFyYW0ge29iamVjdH0gc2V0dGluZ3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNldHRpbmdzOiB7fSkge1xuICAgIGNvbnN0IGZpbmFsU2V0dGluZ3MgPSB7XG4gICAgICAuLi57XG4gICAgICAgIG1hc3Rlcnlfb3ZlcnJpZGU6IGZhbHNlLFxuICAgICAgfSwgLi4uc2V0dGluZ3MsXG4gICAgfTtcblxuICAgIHN1cGVyKHNjb3JtMTJfZXJyb3JfY29kZXMsIGZpbmFsU2V0dGluZ3MpO1xuXG4gICAgdGhpcy5jbWkgPSBuZXcgQ01JKCk7XG4gICAgdGhpcy5uYXYgPSBuZXcgTkFWKCk7XG5cbiAgICAvLyBSZW5hbWUgZnVuY3Rpb25zIHRvIG1hdGNoIDEuMiBTcGVjIGFuZCBleHBvc2UgdG8gbW9kdWxlc1xuICAgIHRoaXMuTE1TSW5pdGlhbGl6ZSA9IHRoaXMubG1zSW5pdGlhbGl6ZTtcbiAgICB0aGlzLkxNU0ZpbmlzaCA9IHRoaXMubG1zRmluaXNoO1xuICAgIHRoaXMuTE1TR2V0VmFsdWUgPSB0aGlzLmxtc0dldFZhbHVlO1xuICAgIHRoaXMuTE1TU2V0VmFsdWUgPSB0aGlzLmxtc1NldFZhbHVlO1xuICAgIHRoaXMuTE1TQ29tbWl0ID0gdGhpcy5sbXNDb21taXQ7XG4gICAgdGhpcy5MTVNHZXRMYXN0RXJyb3IgPSB0aGlzLmxtc0dldExhc3RFcnJvcjtcbiAgICB0aGlzLkxNU0dldEVycm9yU3RyaW5nID0gdGhpcy5sbXNHZXRFcnJvclN0cmluZztcbiAgICB0aGlzLkxNU0dldERpYWdub3N0aWMgPSB0aGlzLmxtc0dldERpYWdub3N0aWM7XG4gIH1cblxuICAvKipcbiAgICogbG1zSW5pdGlhbGl6ZSBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYm9vbFxuICAgKi9cbiAgbG1zSW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLmNtaS5pbml0aWFsaXplKCk7XG4gICAgcmV0dXJuIHRoaXMuaW5pdGlhbGl6ZSgnTE1TSW5pdGlhbGl6ZScsICdMTVMgd2FzIGFscmVhZHkgaW5pdGlhbGl6ZWQhJyxcbiAgICAgICAgJ0xNUyBpcyBhbHJlYWR5IGZpbmlzaGVkIScpO1xuICB9XG5cbiAgLyoqXG4gICAqIExNU0ZpbmlzaCBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYm9vbFxuICAgKi9cbiAgbG1zRmluaXNoKCkge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMudGVybWluYXRlKCdMTVNGaW5pc2gnLCBmYWxzZSk7XG5cbiAgICBpZiAocmVzdWx0ID09PSBnbG9iYWxfY29uc3RhbnRzLlNDT1JNX1RSVUUpIHtcbiAgICAgIGlmICh0aGlzLm5hdi5ldmVudCAhPT0gJycpIHtcbiAgICAgICAgaWYgKHRoaXMubmF2LmV2ZW50ID09PSAnY29udGludWUnKSB7XG4gICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZU5leHQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlUHJldmlvdXMnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNldHRpbmdzLmF1dG9fcHJvZ3Jlc3MpIHtcbiAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZU5leHQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIExNU0dldFZhbHVlIGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zR2V0VmFsdWUoQ01JRWxlbWVudCkge1xuICAgIHJldHVybiB0aGlzLmdldFZhbHVlKCdMTVNHZXRWYWx1ZScsIGZhbHNlLCBDTUlFbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMTVNTZXRWYWx1ZSBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zU2V0VmFsdWUoQ01JRWxlbWVudCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5zZXRWYWx1ZSgnTE1TU2V0VmFsdWUnLCBmYWxzZSwgQ01JRWxlbWVudCwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIExNU0NvbW1pdCBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYm9vbFxuICAgKi9cbiAgbG1zQ29tbWl0KCkge1xuICAgIHJldHVybiB0aGlzLmNvbW1pdCgnTE1TQ29tbWl0JywgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIExNU0dldExhc3RFcnJvciBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc0dldExhc3RFcnJvcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRMYXN0RXJyb3IoJ0xNU0dldExhc3RFcnJvcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIExNU0dldEVycm9yU3RyaW5nIGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVycm9yQ29kZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXRFcnJvclN0cmluZyhDTUlFcnJvckNvZGUpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRFcnJvclN0cmluZygnTE1TR2V0RXJyb3JTdHJpbmcnLCBDTUlFcnJvckNvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIExNU0dldERpYWdub3N0aWMgZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRXJyb3JDb2RlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc0dldERpYWdub3N0aWMoQ01JRXJyb3JDb2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RGlhZ25vc3RpYygnTE1TR2V0RGlhZ25vc3RpYycsIENNSUVycm9yQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhIHZhbHVlIG9uIHRoZSBDTUkgT2JqZWN0XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgc2V0Q01JVmFsdWUoQ01JRWxlbWVudCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tbW9uU2V0Q01JVmFsdWUoJ0xNU1NldFZhbHVlJywgZmFsc2UsIENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgdmFsdWUgZnJvbSB0aGUgQ01JIE9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0Q01JVmFsdWUoQ01JRWxlbWVudCkge1xuICAgIHJldHVybiB0aGlzLl9jb21tb25HZXRDTUlWYWx1ZSgnZ2V0Q01JVmFsdWUnLCBmYWxzZSwgQ01JRWxlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBvciBidWlsZHMgYSBuZXcgY2hpbGQgZWxlbWVudCB0byBhZGQgdG8gdGhlIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZm91bmRGaXJzdEluZGV4XG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIGdldENoaWxkRWxlbWVudChDTUlFbGVtZW50LCB2YWx1ZSwgZm91bmRGaXJzdEluZGV4KSB7XG4gICAgbGV0IG5ld0NoaWxkO1xuXG4gICAgaWYgKHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LCAnY21pXFxcXC5vYmplY3RpdmVzXFxcXC5cXFxcZCcpKSB7XG4gICAgICBuZXdDaGlsZCA9IG5ldyBDTUlPYmplY3RpdmVzT2JqZWN0KCk7XG4gICAgfSBlbHNlIGlmIChmb3VuZEZpcnN0SW5kZXggJiYgdGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsXG4gICAgICAgICdjbWlcXFxcLmludGVyYWN0aW9uc1xcXFwuXFxcXGRcXFxcLmNvcnJlY3RfcmVzcG9uc2VzXFxcXC5cXFxcZCcpKSB7XG4gICAgICBuZXdDaGlsZCA9IG5ldyBDTUlJbnRlcmFjdGlvbnNDb3JyZWN0UmVzcG9uc2VzT2JqZWN0KCk7XG4gICAgfSBlbHNlIGlmIChmb3VuZEZpcnN0SW5kZXggJiYgdGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsXG4gICAgICAgICdjbWlcXFxcLmludGVyYWN0aW9uc1xcXFwuXFxcXGRcXFxcLm9iamVjdGl2ZXNcXFxcLlxcXFxkJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSUludGVyYWN0aW9uc09iamVjdGl2ZXNPYmplY3QoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LCAnY21pXFxcXC5pbnRlcmFjdGlvbnNcXFxcLlxcXFxkJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSUludGVyYWN0aW9uc09iamVjdCgpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXdDaGlsZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZXMgQ29ycmVjdCBSZXNwb25zZSB2YWx1ZXNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgdmFsaWRhdGVDb3JyZWN0UmVzcG9uc2UoQ01JRWxlbWVudCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtZXNzYWdlIHRoYXQgY29ycmVzcG9uZHMgdG8gZXJyb3JOdW1iZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gZXJyb3JOdW1iZXJcbiAgICogQHBhcmFtIHtib29sZWFuIH1kZXRhaWxcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhlcnJvck51bWJlciwgZGV0YWlsKSB7XG4gICAgbGV0IGJhc2ljTWVzc2FnZSA9ICdObyBFcnJvcic7XG4gICAgbGV0IGRldGFpbE1lc3NhZ2UgPSAnTm8gRXJyb3InO1xuXG4gICAgLy8gU2V0IGVycm9yIG51bWJlciB0byBzdHJpbmcgc2luY2UgaW5jb25zaXN0ZW50IGZyb20gbW9kdWxlcyBpZiBzdHJpbmcgb3IgbnVtYmVyXG4gICAgZXJyb3JOdW1iZXIgPSBTdHJpbmcoZXJyb3JOdW1iZXIpO1xuICAgIGlmIChjb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW2Vycm9yTnVtYmVyXSkge1xuICAgICAgYmFzaWNNZXNzYWdlID0gY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tlcnJvck51bWJlcl0uYmFzaWNNZXNzYWdlO1xuICAgICAgZGV0YWlsTWVzc2FnZSA9IGNvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbZXJyb3JOdW1iZXJdLmRldGFpbE1lc3NhZ2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRldGFpbCA/IGRldGFpbE1lc3NhZ2UgOiBiYXNpY01lc3NhZ2U7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSB0aGUgd2hvbGUgQVBJIHdpdGggYW5vdGhlclxuICAgKlxuICAgKiBAcGFyYW0ge1Njb3JtMTJBUEl9IG5ld0FQSVxuICAgKi9cbiAgcmVwbGFjZVdpdGhBbm90aGVyU2Nvcm1BUEkobmV3QVBJKSB7XG4gICAgLy8gRGF0YSBNb2RlbFxuICAgIHRoaXMuY21pID0gbmV3QVBJLmNtaTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGNtaSBvYmplY3QgdG8gdGhlIHByb3BlciBmb3JtYXQgZm9yIExNUyBjb21taXRcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSB0ZXJtaW5hdGVDb21taXRcbiAgICogQHJldHVybiB7b2JqZWN0fEFycmF5fVxuICAgKi9cbiAgcmVuZGVyQ29tbWl0Q01JKHRlcm1pbmF0ZUNvbW1pdDogYm9vbGVhbikge1xuICAgIGNvbnN0IGNtaUV4cG9ydCA9IHRoaXMucmVuZGVyQ01JVG9KU09OT2JqZWN0KCk7XG5cbiAgICBpZiAodGVybWluYXRlQ29tbWl0KSB7XG4gICAgICBjbWlFeHBvcnQuY21pLmNvcmUudG90YWxfdGltZSA9IHRoaXMuY21pLmdldEN1cnJlbnRUb3RhbFRpbWUoKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQgPSBbXTtcbiAgICBjb25zdCBmbGF0dGVuZWQgPSBVdGlsaXRpZXMuZmxhdHRlbihjbWlFeHBvcnQpO1xuICAgIHN3aXRjaCAodGhpcy5zZXR0aW5ncy5kYXRhQ29tbWl0Rm9ybWF0KSB7XG4gICAgICBjYXNlICdmbGF0dGVuZWQnOlxuICAgICAgICByZXR1cm4gVXRpbGl0aWVzLmZsYXR0ZW4oY21pRXhwb3J0KTtcbiAgICAgIGNhc2UgJ3BhcmFtcyc6XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBpbiBmbGF0dGVuZWQpIHtcbiAgICAgICAgICBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChmbGF0dGVuZWQsIGl0ZW0pKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChgJHtpdGVtfT0ke2ZsYXR0ZW5lZFtpdGVtXX1gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIGNhc2UgJ2pzb24nOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGNtaUV4cG9ydDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXR0ZW1wdHMgdG8gc3RvcmUgdGhlIGRhdGEgdG8gdGhlIExNU1xuICAgKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHRlcm1pbmF0ZUNvbW1pdFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBzdG9yZURhdGEodGVybWluYXRlQ29tbWl0OiBib29sZWFuKSB7XG4gICAgaWYgKHRlcm1pbmF0ZUNvbW1pdCkge1xuICAgICAgY29uc3Qgb3JpZ2luYWxTdGF0dXMgPSB0aGlzLmNtaS5jb3JlLmxlc3Nvbl9zdGF0dXM7XG4gICAgICBpZiAob3JpZ2luYWxTdGF0dXMgPT09ICdub3QgYXR0ZW1wdGVkJykge1xuICAgICAgICB0aGlzLmNtaS5jb3JlLmxlc3Nvbl9zdGF0dXMgPSAnY29tcGxldGVkJztcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuY21pLmNvcmUubGVzc29uX21vZGUgPT09ICdub3JtYWwnKSB7XG4gICAgICAgIGlmICh0aGlzLmNtaS5jb3JlLmNyZWRpdCA9PT0gJ2NyZWRpdCcpIHtcbiAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5tYXN0ZXJ5X292ZXJyaWRlICYmXG4gICAgICAgICAgICAgIHRoaXMuY21pLnN0dWRlbnRfZGF0YS5tYXN0ZXJ5X3Njb3JlICE9PSAnJyAmJlxuICAgICAgICAgICAgICB0aGlzLmNtaS5jb3JlLnNjb3JlLnJhdyAhPT0gJycpIHtcbiAgICAgICAgICAgIGlmIChwYXJzZUZsb2F0KHRoaXMuY21pLmNvcmUuc2NvcmUucmF3KSA+PVxuICAgICAgICAgICAgICAgIHBhcnNlRmxvYXQodGhpcy5jbWkuc3R1ZGVudF9kYXRhLm1hc3Rlcnlfc2NvcmUpKSB7XG4gICAgICAgICAgICAgIHRoaXMuY21pLmNvcmUubGVzc29uX3N0YXR1cyA9ICdwYXNzZWQnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5jbWkuY29yZS5sZXNzb25fc3RhdHVzID0gJ2ZhaWxlZCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY21pLmNvcmUubGVzc29uX21vZGUgPT09ICdicm93c2UnKSB7XG4gICAgICAgIGlmICgodGhpcy5zdGFydGluZ0RhdGE/LmNtaT8uY29yZT8ubGVzc29uX3N0YXR1cyB8fCAnJykgPT09ICcnICYmXG4gICAgICAgICAgICBvcmlnaW5hbFN0YXR1cyA9PT0gJ25vdCBhdHRlbXB0ZWQnKSB7XG4gICAgICAgICAgdGhpcy5jbWkuY29yZS5sZXNzb25fc3RhdHVzID0gJ2Jyb3dzZWQnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY29tbWl0T2JqZWN0ID0gdGhpcy5yZW5kZXJDb21taXRDTUkodGVybWluYXRlQ29tbWl0KTtcblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmxtc0NvbW1pdFVybCkge1xuICAgICAgaWYgKHRoaXMuYXBpTG9nTGV2ZWwgPT09IGdsb2JhbF9jb25zdGFudHMuTE9HX0xFVkVMX0RFQlVHKSB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ0NvbW1pdCAodGVybWluYXRlZDogJyArXG4gICAgICAgICAgICAodGVybWluYXRlQ29tbWl0ID8gJ3llcycgOiAnbm8nKSArICcpOiAnKTtcbiAgICAgICAgY29uc29sZS5kZWJ1Zyhjb21taXRPYmplY3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMucHJvY2Vzc0h0dHBSZXF1ZXN0KHRoaXMuc2V0dGluZ3MubG1zQ29tbWl0VXJsLCBjb21taXRPYmplY3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZygnQ29tbWl0ICh0ZXJtaW5hdGVkOiAnICtcbiAgICAgICAgICAodGVybWluYXRlQ29tbWl0ID8gJ3llcycgOiAnbm8nKSArICcpOiAnKTtcbiAgICAgIGNvbnNvbGUubG9nKGNvbW1pdE9iamVjdCk7XG4gICAgICByZXR1cm4gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgIH1cbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCBCYXNlQVBJIGZyb20gJy4vQmFzZUFQSSc7XG5pbXBvcnQge1xuICBBREwsXG4gIENNSSxcbiAgQ01JQ29tbWVudHNPYmplY3QsXG4gIENNSUludGVyYWN0aW9uc0NvcnJlY3RSZXNwb25zZXNPYmplY3QsXG4gIENNSUludGVyYWN0aW9uc09iamVjdCxcbiAgQ01JSW50ZXJhY3Rpb25zT2JqZWN0aXZlc09iamVjdCxcbiAgQ01JT2JqZWN0aXZlc09iamVjdCxcbn0gZnJvbSAnLi9jbWkvc2Nvcm0yMDA0X2NtaSc7XG5pbXBvcnQgKiBhcyBVdGlsaXRpZXMgZnJvbSAnLi91dGlsaXRpZXMnO1xuaW1wb3J0IHtnbG9iYWxfY29uc3RhbnRzLCBzY29ybTIwMDRfY29uc3RhbnRzfSBmcm9tICcuL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCB7c2Nvcm0yMDA0X2Vycm9yX2NvZGVzfSBmcm9tICcuL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQge2NvcnJlY3RfcmVzcG9uc2VzfSBmcm9tICcuL2NvbnN0YW50cy9yZXNwb25zZV9jb25zdGFudHMnO1xuaW1wb3J0IHt2YWxpZF9sYW5ndWFnZXN9IGZyb20gJy4vY29uc3RhbnRzL2xhbmd1YWdlX2NvbnN0YW50cyc7XG5pbXBvcnQge3Njb3JtMjAwNF9yZWdleH0gZnJvbSAnLi9jb25zdGFudHMvcmVnZXgnO1xuXG5jb25zdCBjb25zdGFudHMgPSBzY29ybTIwMDRfY29uc3RhbnRzO1xuXG4vKipcbiAqIEFQSSBjbGFzcyBmb3IgU0NPUk0gMjAwNFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY29ybTIwMDRBUEkgZXh0ZW5kcyBCYXNlQVBJIHtcbiAgI3ZlcnNpb246ICcxLjAnO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgU0NPUk0gMjAwNCBBUElcbiAgICogQHBhcmFtIHtvYmplY3R9IHNldHRpbmdzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzZXR0aW5nczoge30pIHtcbiAgICBjb25zdCBmaW5hbFNldHRpbmdzID0ge1xuICAgICAgLi4ue1xuICAgICAgICBtYXN0ZXJ5X292ZXJyaWRlOiBmYWxzZSxcbiAgICAgIH0sIC4uLnNldHRpbmdzLFxuICAgIH07XG5cbiAgICBzdXBlcihzY29ybTIwMDRfZXJyb3JfY29kZXMsIGZpbmFsU2V0dGluZ3MpO1xuXG4gICAgdGhpcy5jbWkgPSBuZXcgQ01JKCk7XG4gICAgdGhpcy5hZGwgPSBuZXcgQURMKCk7XG5cbiAgICAvLyBSZW5hbWUgZnVuY3Rpb25zIHRvIG1hdGNoIDIwMDQgU3BlYyBhbmQgZXhwb3NlIHRvIG1vZHVsZXNcbiAgICB0aGlzLkluaXRpYWxpemUgPSB0aGlzLmxtc0luaXRpYWxpemU7XG4gICAgdGhpcy5UZXJtaW5hdGUgPSB0aGlzLmxtc1Rlcm1pbmF0ZTtcbiAgICB0aGlzLkdldFZhbHVlID0gdGhpcy5sbXNHZXRWYWx1ZTtcbiAgICB0aGlzLlNldFZhbHVlID0gdGhpcy5sbXNTZXRWYWx1ZTtcbiAgICB0aGlzLkNvbW1pdCA9IHRoaXMubG1zQ29tbWl0O1xuICAgIHRoaXMuR2V0TGFzdEVycm9yID0gdGhpcy5sbXNHZXRMYXN0RXJyb3I7XG4gICAgdGhpcy5HZXRFcnJvclN0cmluZyA9IHRoaXMubG1zR2V0RXJyb3JTdHJpbmc7XG4gICAgdGhpcy5HZXREaWFnbm9zdGljID0gdGhpcy5sbXNHZXREaWFnbm9zdGljO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3ZlcnNpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHZlcnNpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI3ZlcnNpb247XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7c3RyaW5nfSBib29sXG4gICAqL1xuICBsbXNJbml0aWFsaXplKCkge1xuICAgIHRoaXMuY21pLmluaXRpYWxpemUoKTtcbiAgICByZXR1cm4gdGhpcy5pbml0aWFsaXplKCdJbml0aWFsaXplJyk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7c3RyaW5nfSBib29sXG4gICAqL1xuICBsbXNUZXJtaW5hdGUoKSB7XG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy50ZXJtaW5hdGUoJ1Rlcm1pbmF0ZScsIHRydWUpO1xuXG4gICAgaWYgKHJlc3VsdCA9PT0gZ2xvYmFsX2NvbnN0YW50cy5TQ09STV9UUlVFKSB7XG4gICAgICBpZiAodGhpcy5hZGwubmF2LnJlcXVlc3QgIT09ICdfbm9uZV8nKSB7XG4gICAgICAgIHN3aXRjaCAodGhpcy5hZGwubmF2LnJlcXVlc3QpIHtcbiAgICAgICAgICBjYXNlICdjb250aW51ZSc6XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlTmV4dCcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAncHJldmlvdXMnOlxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZVByZXZpb3VzJyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICdjaG9pY2UnOlxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKCdTZXF1ZW5jZUNob2ljZScpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnZXhpdCc6XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlRXhpdCcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnZXhpdEFsbCc6XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlRXhpdEFsbCcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnYWJhbmRvbic6XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlQWJhbmRvbicpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnYWJhbmRvbkFsbCc6XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoJ1NlcXVlbmNlQWJhbmRvbkFsbCcpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zZXR0aW5ncy5hdXRvX3Byb2dyZXNzKSB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0xpc3RlbmVycygnU2VxdWVuY2VOZXh0Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXRWYWx1ZShDTUlFbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VmFsdWUoJ0dldFZhbHVlJywgdHJ1ZSwgQ01JRWxlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHthbnl9IHZhbHVlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc1NldFZhbHVlKENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0VmFsdWUoJ1NldFZhbHVlJywgdHJ1ZSwgQ01JRWxlbWVudCwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIE9yZGVycyBMTVMgdG8gc3RvcmUgYWxsIGNvbnRlbnQgcGFyYW1ldGVyc1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJvb2xcbiAgICovXG4gIGxtc0NvbW1pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb21taXQoJ0NvbW1pdCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgbGFzdCBlcnJvciBjb2RlXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc0dldExhc3RFcnJvcigpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRMYXN0RXJyb3IoJ0dldExhc3RFcnJvcicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGVycm9yTnVtYmVyIGVycm9yIGRlc2NyaXB0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXIpfSBDTUlFcnJvckNvZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zR2V0RXJyb3JTdHJpbmcoQ01JRXJyb3JDb2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RXJyb3JTdHJpbmcoJ0dldEVycm9yU3RyaW5nJywgQ01JRXJyb3JDb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgY29tcHJlaGVuc2l2ZSBkZXNjcmlwdGlvbiBvZiB0aGUgZXJyb3JOdW1iZXIgZXJyb3IuXG4gICAqXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXIpfSBDTUlFcnJvckNvZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zR2V0RGlhZ25vc3RpYyhDTUlFcnJvckNvZGUpIHtcbiAgICByZXR1cm4gdGhpcy5nZXREaWFnbm9zdGljKCdHZXREaWFnbm9zdGljJywgQ01JRXJyb3JDb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGEgdmFsdWUgb24gdGhlIENNSSBPYmplY3RcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHthbnl9IHZhbHVlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHNldENNSVZhbHVlKENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbW1vblNldENNSVZhbHVlKCdTZXRWYWx1ZScsIHRydWUsIENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIG9yIGJ1aWxkcyBhIG5ldyBjaGlsZCBlbGVtZW50IHRvIGFkZCB0byB0aGUgYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGZvdW5kRmlyc3RJbmRleFxuICAgKiBAcmV0dXJuIHthbnl9XG4gICAqL1xuICBnZXRDaGlsZEVsZW1lbnQoQ01JRWxlbWVudCwgdmFsdWUsIGZvdW5kRmlyc3RJbmRleCkge1xuICAgIGxldCBuZXdDaGlsZDtcblxuICAgIGlmICh0aGlzLnN0cmluZ01hdGNoZXMoQ01JRWxlbWVudCwgJ2NtaVxcXFwub2JqZWN0aXZlc1xcXFwuXFxcXGQnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JT2JqZWN0aXZlc09iamVjdCgpO1xuICAgIH0gZWxzZSBpZiAoZm91bmRGaXJzdEluZGV4ICYmIHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LFxuICAgICAgICAnY21pXFxcXC5pbnRlcmFjdGlvbnNcXFxcLlxcXFxkXFxcXC5jb3JyZWN0X3Jlc3BvbnNlc1xcXFwuXFxcXGQnKSkge1xuICAgICAgY29uc3QgcGFydHMgPSBDTUlFbGVtZW50LnNwbGl0KCcuJyk7XG4gICAgICBjb25zdCBpbmRleCA9IE51bWJlcihwYXJ0c1syXSk7XG4gICAgICBjb25zdCBpbnRlcmFjdGlvbiA9IHRoaXMuY21pLmludGVyYWN0aW9ucy5jaGlsZEFycmF5W2luZGV4XTtcbiAgICAgIGlmICh0eXBlb2YgaW50ZXJhY3Rpb24udHlwZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkRFUEVOREVOQ1lfTk9UX0VTVEFCTElTSEVEKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGludGVyYWN0aW9uX3R5cGUgPSBpbnRlcmFjdGlvbi50eXBlO1xuICAgICAgICBjb25zdCBpbnRlcmFjdGlvbl9jb3VudCA9IGludGVyYWN0aW9uLmNvcnJlY3RfcmVzcG9uc2VzLl9jb3VudDtcbiAgICAgICAgaWYgKGludGVyYWN0aW9uX3R5cGUgPT09ICdjaG9pY2UnKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbnRlcmFjdGlvbl9jb3VudCAmJiB0aGlzLmxhc3RFcnJvckNvZGUgPT09XG4gICAgICAgICAgMDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGludGVyYWN0aW9uLmNvcnJlY3RfcmVzcG9uc2VzLmNoaWxkQXJyYXlbaV07XG4gICAgICAgICAgICBpZiAocmVzcG9uc2UucGF0dGVybiA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlX3R5cGUgPSBjb3JyZWN0X3Jlc3BvbnNlc1tpbnRlcmFjdGlvbl90eXBlXTtcbiAgICAgICAgbGV0IG5vZGVzID0gW107XG4gICAgICAgIGlmIChyZXNwb25zZV90eXBlLmRlbGltaXRlciAhPT0gJycpIHtcbiAgICAgICAgICBub2RlcyA9IFN0cmluZyh2YWx1ZSkuc3BsaXQocmVzcG9uc2VfdHlwZS5kZWxpbWl0ZXIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5vZGVzWzBdID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobm9kZXMubGVuZ3RoID4gMCAmJiBub2Rlcy5sZW5ndGggPD0gcmVzcG9uc2VfdHlwZS5tYXgpIHtcbiAgICAgICAgICB0aGlzLmNoZWNrQ29ycmVjdFJlc3BvbnNlVmFsdWUoaW50ZXJhY3Rpb25fdHlwZSwgbm9kZXMsIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIGlmIChub2Rlcy5sZW5ndGggPiByZXNwb25zZV90eXBlLm1heCkge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5HRU5FUkFMX1NFVF9GQUlMVVJFLFxuICAgICAgICAgICAgICAnRGF0YSBNb2RlbCBFbGVtZW50IFBhdHRlcm4gVG9vIExvbmcnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMubGFzdEVycm9yQ29kZSA9PT0gMCkge1xuICAgICAgICBuZXdDaGlsZCA9IG5ldyBDTUlJbnRlcmFjdGlvbnNDb3JyZWN0UmVzcG9uc2VzT2JqZWN0KCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChmb3VuZEZpcnN0SW5kZXggJiYgdGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsXG4gICAgICAgICdjbWlcXFxcLmludGVyYWN0aW9uc1xcXFwuXFxcXGRcXFxcLm9iamVjdGl2ZXNcXFxcLlxcXFxkJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSUludGVyYWN0aW9uc09iamVjdGl2ZXNPYmplY3QoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LCAnY21pXFxcXC5pbnRlcmFjdGlvbnNcXFxcLlxcXFxkJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSUludGVyYWN0aW9uc09iamVjdCgpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdHJpbmdNYXRjaGVzKENNSUVsZW1lbnQsXG4gICAgICAgICdjbWlcXFxcLmNvbW1lbnRzX2Zyb21fbGVhcm5lclxcXFwuXFxcXGQnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JQ29tbWVudHNPYmplY3QoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RyaW5nTWF0Y2hlcyhDTUlFbGVtZW50LFxuICAgICAgICAnY21pXFxcXC5jb21tZW50c19mcm9tX2xtc1xcXFwuXFxcXGQnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JQ29tbWVudHNPYmplY3QodHJ1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0NoaWxkO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIGNvcnJlY3QgcmVzcG9uc2UuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICovXG4gIHZhbGlkYXRlQ29ycmVjdFJlc3BvbnNlKENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgY29uc3QgcGFydHMgPSBDTUlFbGVtZW50LnNwbGl0KCcuJyk7XG4gICAgY29uc3QgaW5kZXggPSBOdW1iZXIocGFydHNbMl0pO1xuICAgIGNvbnN0IHBhdHRlcm5faW5kZXggPSBOdW1iZXIocGFydHNbNF0pO1xuICAgIGNvbnN0IGludGVyYWN0aW9uID0gdGhpcy5jbWkuaW50ZXJhY3Rpb25zLmNoaWxkQXJyYXlbaW5kZXhdO1xuXG4gICAgY29uc3QgaW50ZXJhY3Rpb25fdHlwZSA9IGludGVyYWN0aW9uLnR5cGU7XG4gICAgY29uc3QgaW50ZXJhY3Rpb25fY291bnQgPSBpbnRlcmFjdGlvbi5jb3JyZWN0X3Jlc3BvbnNlcy5fY291bnQ7XG4gICAgaWYgKGludGVyYWN0aW9uX3R5cGUgPT09ICdjaG9pY2UnKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGludGVyYWN0aW9uX2NvdW50ICYmIHRoaXMubGFzdEVycm9yQ29kZSA9PT0gMDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gaW50ZXJhY3Rpb24uY29ycmVjdF9yZXNwb25zZXMuY2hpbGRBcnJheVtpXTtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnBhdHRlcm4gPT09IHZhbHVlKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2VfdHlwZSA9IHNjb3JtMjAwNF9jb25zdGFudHMuY29ycmVjdF9yZXNwb25zZXNbaW50ZXJhY3Rpb25fdHlwZV07XG4gICAgaWYgKHR5cGVvZiByZXNwb25zZV90eXBlLmxpbWl0ICE9PSAndW5kZWZpbmVkJyB8fCBpbnRlcmFjdGlvbl9jb3VudCA8XG4gICAgICAgIHJlc3BvbnNlX3R5cGUubGltaXQpIHtcbiAgICAgIGxldCBub2RlcyA9IFtdO1xuICAgICAgaWYgKHJlc3BvbnNlX3R5cGUuZGVsaW1pdGVyICE9PSAnJykge1xuICAgICAgICBub2RlcyA9IFN0cmluZyh2YWx1ZSkuc3BsaXQocmVzcG9uc2VfdHlwZS5kZWxpbWl0ZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9kZXNbMF0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5vZGVzLmxlbmd0aCA+IDAgJiYgbm9kZXMubGVuZ3RoIDw9IHJlc3BvbnNlX3R5cGUubWF4KSB7XG4gICAgICAgIHRoaXMuY2hlY2tDb3JyZWN0UmVzcG9uc2VWYWx1ZShpbnRlcmFjdGlvbl90eXBlLCBub2RlcywgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChub2Rlcy5sZW5ndGggPiByZXNwb25zZV90eXBlLm1heCkge1xuICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuR0VORVJBTF9TRVRfRkFJTFVSRSxcbiAgICAgICAgICAgICdEYXRhIE1vZGVsIEVsZW1lbnQgUGF0dGVybiBUb28gTG9uZycpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5sYXN0RXJyb3JDb2RlID09PSAwICYmXG4gICAgICAgICAgKCFyZXNwb25zZV90eXBlLmR1cGxpY2F0ZSB8fFxuICAgICAgICAgICAgICAhdGhpcy5jaGVja0R1cGxpY2F0ZWRQYXR0ZXJuKGludGVyYWN0aW9uLmNvcnJlY3RfcmVzcG9uc2VzLFxuICAgICAgICAgICAgICAgICAgcGF0dGVybl9pbmRleCwgdmFsdWUpKSB8fFxuICAgICAgICAgICh0aGlzLmxhc3RFcnJvckNvZGUgPT09IDAgJiYgdmFsdWUgPT09ICcnKSkge1xuICAgICAgICAvLyBkbyBub3RoaW5nLCB3ZSB3YW50IHRoZSBpbnZlcnNlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5sYXN0RXJyb3JDb2RlID09PSAwKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUsXG4gICAgICAgICAgICAgICdEYXRhIE1vZGVsIEVsZW1lbnQgUGF0dGVybiBBbHJlYWR5IEV4aXN0cycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5HRU5FUkFMX1NFVF9GQUlMVVJFLFxuICAgICAgICAgICdEYXRhIE1vZGVsIEVsZW1lbnQgQ29sbGVjdGlvbiBMaW1pdCBSZWFjaGVkJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSB2YWx1ZSBmcm9tIHRoZSBDTUkgT2JqZWN0XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXRDTUlWYWx1ZShDTUlFbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbW1vbkdldENNSVZhbHVlKCdHZXRWYWx1ZScsIHRydWUsIENNSUVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1lc3NhZ2UgdGhhdCBjb3JyZXNwb25kcyB0byBlcnJvck51bWJlci5cbiAgICpcbiAgICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcil9IGVycm9yTnVtYmVyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZGV0YWlsXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldExtc0Vycm9yTWVzc2FnZURldGFpbHMoZXJyb3JOdW1iZXIsIGRldGFpbCkge1xuICAgIGxldCBiYXNpY01lc3NhZ2UgPSAnJztcbiAgICBsZXQgZGV0YWlsTWVzc2FnZSA9ICcnO1xuXG4gICAgLy8gU2V0IGVycm9yIG51bWJlciB0byBzdHJpbmcgc2luY2UgaW5jb25zaXN0ZW50IGZyb20gbW9kdWxlcyBpZiBzdHJpbmcgb3IgbnVtYmVyXG4gICAgZXJyb3JOdW1iZXIgPSBTdHJpbmcoZXJyb3JOdW1iZXIpO1xuICAgIGlmIChjb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW2Vycm9yTnVtYmVyXSkge1xuICAgICAgYmFzaWNNZXNzYWdlID0gY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tlcnJvck51bWJlcl0uYmFzaWNNZXNzYWdlO1xuICAgICAgZGV0YWlsTWVzc2FnZSA9IGNvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbZXJyb3JOdW1iZXJdLmRldGFpbE1lc3NhZ2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRldGFpbCA/IGRldGFpbE1lc3NhZ2UgOiBiYXNpY01lc3NhZ2U7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgdG8gc2VlIGlmIGEgY29ycmVjdF9yZXNwb25zZSB2YWx1ZSBoYXMgYmVlbiBkdXBsaWNhdGVkXG4gICAqIEBwYXJhbSB7Q01JQXJyYXl9IGNvcnJlY3RfcmVzcG9uc2VcbiAgICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRfaW5kZXhcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgY2hlY2tEdXBsaWNhdGVkUGF0dGVybiA9IChjb3JyZWN0X3Jlc3BvbnNlLCBjdXJyZW50X2luZGV4LCB2YWx1ZSkgPT4ge1xuICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgIGNvbnN0IGNvdW50ID0gY29ycmVjdF9yZXNwb25zZS5fY291bnQ7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudCAmJiAhZm91bmQ7IGkrKykge1xuICAgICAgaWYgKGkgIT09IGN1cnJlbnRfaW5kZXggJiYgY29ycmVjdF9yZXNwb25zZS5jaGlsZEFycmF5W2ldID09PSB2YWx1ZSkge1xuICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmb3VuZDtcbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2tzIGZvciBhIHZhbGlkIGNvcnJlY3RfcmVzcG9uc2UgdmFsdWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGludGVyYWN0aW9uX3R5cGVcbiAgICogQHBhcmFtIHtBcnJheX0gbm9kZXNcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKi9cbiAgY2hlY2tDb3JyZWN0UmVzcG9uc2VWYWx1ZShpbnRlcmFjdGlvbl90eXBlLCBub2RlcywgdmFsdWUpIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGNvcnJlY3RfcmVzcG9uc2VzW2ludGVyYWN0aW9uX3R5cGVdO1xuICAgIGNvbnN0IGZvcm1hdFJlZ2V4ID0gbmV3IFJlZ0V4cChyZXNwb25zZS5mb3JtYXQpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoICYmIHRoaXMubGFzdEVycm9yQ29kZSA9PT0gMDsgaSsrKSB7XG4gICAgICBpZiAoaW50ZXJhY3Rpb25fdHlwZS5tYXRjaChcbiAgICAgICAgICAnXihmaWxsLWlufGxvbmctZmlsbC1pbnxtYXRjaGluZ3xwZXJmb3JtYW5jZXxzZXF1ZW5jaW5nKSQnKSkge1xuICAgICAgICBub2Rlc1tpXSA9IHRoaXMucmVtb3ZlQ29ycmVjdFJlc3BvbnNlUHJlZml4ZXMobm9kZXNbaV0pO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzcG9uc2UuZGVsaW1pdGVyMiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IG5vZGVzW2ldLnNwbGl0KHJlc3BvbnNlLmRlbGltaXRlcjIpO1xuICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgIGNvbnN0IG1hdGNoZXMgPSB2YWx1ZXNbMF0ubWF0Y2goZm9ybWF0UmVnZXgpO1xuICAgICAgICAgIGlmICghbWF0Y2hlcykge1xuICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXZhbHVlc1sxXS5tYXRjaChuZXcgUmVnRXhwKHJlc3BvbnNlLmZvcm1hdDIpKSkge1xuICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbWF0Y2hlcyA9IG5vZGVzW2ldLm1hdGNoKGZvcm1hdFJlZ2V4KTtcbiAgICAgICAgaWYgKCghbWF0Y2hlcyAmJiB2YWx1ZSAhPT0gJycpIHx8XG4gICAgICAgICAgICAoIW1hdGNoZXMgJiYgaW50ZXJhY3Rpb25fdHlwZSA9PT0gJ3RydWUtZmFsc2UnKSkge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoaW50ZXJhY3Rpb25fdHlwZSA9PT0gJ251bWVyaWMnICYmIG5vZGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGlmIChOdW1iZXIobm9kZXNbMF0pID4gTnVtYmVyKG5vZGVzWzFdKSkge1xuICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChub2Rlc1tpXSAhPT0gJycgJiYgcmVzcG9uc2UudW5pcXVlKSB7XG4gICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaSAmJiB0aGlzLmxhc3RFcnJvckNvZGUgPT09IDA7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChub2Rlc1tpXSA9PT0gbm9kZXNbal0pIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHByZWZpeGVzIGZyb20gY29ycmVjdF9yZXNwb25zZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbm9kZVxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgcmVtb3ZlQ29ycmVjdFJlc3BvbnNlUHJlZml4ZXMobm9kZSkge1xuICAgIGxldCBzZWVuT3JkZXIgPSBmYWxzZTtcbiAgICBsZXQgc2VlbkNhc2UgPSBmYWxzZTtcbiAgICBsZXQgc2VlbkxhbmcgPSBmYWxzZTtcblxuICAgIGNvbnN0IHByZWZpeFJlZ2V4ID0gbmV3IFJlZ0V4cChcbiAgICAgICAgJ14oeyhsYW5nfGNhc2VfbWF0dGVyc3xvcmRlcl9tYXR0ZXJzKT0oW159XSspfSknKTtcbiAgICBsZXQgbWF0Y2hlcyA9IG5vZGUubWF0Y2gocHJlZml4UmVnZXgpO1xuICAgIGxldCBsYW5nTWF0Y2hlcyA9IG51bGw7XG4gICAgd2hpbGUgKG1hdGNoZXMpIHtcbiAgICAgIHN3aXRjaCAobWF0Y2hlc1syXSkge1xuICAgICAgICBjYXNlICdsYW5nJzpcbiAgICAgICAgICBsYW5nTWF0Y2hlcyA9IG5vZGUubWF0Y2goc2Nvcm0yMDA0X3JlZ2V4LkNNSUxhbmdjcik7XG4gICAgICAgICAgaWYgKGxhbmdNYXRjaGVzKSB7XG4gICAgICAgICAgICBjb25zdCBsYW5nID0gbGFuZ01hdGNoZXNbM107XG4gICAgICAgICAgICBpZiAobGFuZyAhPT0gdW5kZWZpbmVkICYmIGxhbmcubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBpZiAodmFsaWRfbGFuZ3VhZ2VzW2xhbmcudG9Mb3dlckNhc2UoKV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzZWVuTGFuZyA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Nhc2VfbWF0dGVycyc6XG4gICAgICAgICAgaWYgKCFzZWVuTGFuZyAmJiAhc2Vlbk9yZGVyICYmICFzZWVuQ2FzZSkge1xuICAgICAgICAgICAgaWYgKG1hdGNoZXNbM10gIT09ICd0cnVlJyAmJiBtYXRjaGVzWzNdICE9PSAnZmFsc2UnKSB7XG4gICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzZWVuQ2FzZSA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ29yZGVyX21hdHRlcnMnOlxuICAgICAgICAgIGlmICghc2VlbkNhc2UgJiYgIXNlZW5MYW5nICYmICFzZWVuT3JkZXIpIHtcbiAgICAgICAgICAgIGlmIChtYXRjaGVzWzNdICE9PSAndHJ1ZScgJiYgbWF0Y2hlc1szXSAhPT0gJ2ZhbHNlJykge1xuICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2Vlbk9yZGVyID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIG5vZGUgPSBub2RlLnN1YnN0cihtYXRjaGVzWzFdLmxlbmd0aCk7XG4gICAgICBtYXRjaGVzID0gbm9kZS5tYXRjaChwcmVmaXhSZWdleCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSB0aGUgd2hvbGUgQVBJIHdpdGggYW5vdGhlclxuICAgKiBAcGFyYW0ge1Njb3JtMjAwNEFQSX0gbmV3QVBJXG4gICAqL1xuICByZXBsYWNlV2l0aEFub3RoZXJTY29ybUFQSShuZXdBUEkpIHtcbiAgICAvLyBEYXRhIE1vZGVsXG4gICAgdGhpcy5jbWkgPSBuZXdBUEkuY21pO1xuICAgIHRoaXMuYWRsID0gbmV3QVBJLmFkbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGNtaSBvYmplY3QgdG8gdGhlIHByb3BlciBmb3JtYXQgZm9yIExNUyBjb21taXRcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSB0ZXJtaW5hdGVDb21taXRcbiAgICogQHJldHVybiB7b2JqZWN0fEFycmF5fVxuICAgKi9cbiAgcmVuZGVyQ29tbWl0Q01JKHRlcm1pbmF0ZUNvbW1pdDogYm9vbGVhbikge1xuICAgIGNvbnN0IGNtaUV4cG9ydCA9IHRoaXMucmVuZGVyQ01JVG9KU09OT2JqZWN0KCk7XG5cbiAgICBpZiAodGVybWluYXRlQ29tbWl0KSB7XG4gICAgICBjbWlFeHBvcnQuY21pLnRvdGFsX3RpbWUgPSB0aGlzLmNtaS5nZXRDdXJyZW50VG90YWxUaW1lKCk7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0ID0gW107XG4gICAgY29uc3QgZmxhdHRlbmVkID0gVXRpbGl0aWVzLmZsYXR0ZW4oY21pRXhwb3J0KTtcbiAgICBzd2l0Y2ggKHRoaXMuc2V0dGluZ3MuZGF0YUNvbW1pdEZvcm1hdCkge1xuICAgICAgY2FzZSAnZmxhdHRlbmVkJzpcbiAgICAgICAgcmV0dXJuIFV0aWxpdGllcy5mbGF0dGVuKGNtaUV4cG9ydCk7XG4gICAgICBjYXNlICdwYXJhbXMnOlxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gaW4gZmxhdHRlbmVkKSB7XG4gICAgICAgICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoZmxhdHRlbmVkLCBpdGVtKSkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goYCR7aXRlbX09JHtmbGF0dGVuZWRbaXRlbV19YCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICBjYXNlICdqc29uJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBjbWlFeHBvcnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEF0dGVtcHRzIHRvIHN0b3JlIHRoZSBkYXRhIHRvIHRoZSBMTVNcbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSB0ZXJtaW5hdGVDb21taXRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgc3RvcmVEYXRhKHRlcm1pbmF0ZUNvbW1pdDogYm9vbGVhbikge1xuICAgIGlmICh0ZXJtaW5hdGVDb21taXQpIHtcbiAgICAgIGlmICh0aGlzLmNtaS5tb2RlID09PSAnbm9ybWFsJykge1xuICAgICAgICBpZiAodGhpcy5jbWkuY3JlZGl0ID09PSAnY3JlZGl0Jykge1xuICAgICAgICAgIGlmICh0aGlzLmNtaS5jb21wbGV0aW9uX3RocmVzaG9sZCAmJiB0aGlzLmNtaS5wcm9ncmVzc19tZWFzdXJlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbWkucHJvZ3Jlc3NfbWVhc3VyZSA+PSB0aGlzLmNtaS5jb21wbGV0aW9uX3RocmVzaG9sZCkge1xuICAgICAgICAgICAgICB0aGlzLmNtaS5jb21wbGV0aW9uX3N0YXR1cyA9ICdjb21wbGV0ZWQnO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy5jbWkuY29tcGxldGlvbl9zdGF0dXMgPSAnaW5jb21wbGV0ZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLmNtaS5zY2FsZWRfcGFzc2luZ19zY29yZSAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgICB0aGlzLmNtaS5zY29yZS5zY2FsZWQgIT09ICcnKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbWkuc2NvcmUuc2NhbGVkID49IHRoaXMuY21pLnNjYWxlZF9wYXNzaW5nX3Njb3JlKSB7XG4gICAgICAgICAgICAgIHRoaXMuY21pLnN1Y2Nlc3Nfc3RhdHVzID0gJ3Bhc3NlZCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLmNtaS5zdWNjZXNzX3N0YXR1cyA9ICdmYWlsZWQnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBuYXZSZXF1ZXN0ID0gZmFsc2U7XG4gICAgaWYgKHRoaXMuYWRsLm5hdi5yZXF1ZXN0ICE9PSAodGhpcy5zdGFydGluZ0RhdGE/LmFkbD8ubmF2Py5yZXF1ZXN0KSAmJlxuICAgICAgICB0aGlzLmFkbC5uYXYucmVxdWVzdCAhPT0gJ19ub25lXycpIHtcbiAgICAgIHRoaXMuYWRsLm5hdi5yZXF1ZXN0ID0gZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuYWRsLm5hdi5yZXF1ZXN0KTtcbiAgICAgIG5hdlJlcXVlc3QgPSB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbW1pdE9iamVjdCA9IHRoaXMucmVuZGVyQ29tbWl0Q01JKHRlcm1pbmF0ZUNvbW1pdCk7XG5cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5sbXNDb21taXRVcmwpIHtcbiAgICAgIGlmICh0aGlzLmFwaUxvZ0xldmVsID09PSBnbG9iYWxfY29uc3RhbnRzLkxPR19MRVZFTF9ERUJVRykge1xuICAgICAgICBjb25zb2xlLmRlYnVnKCdDb21taXQgKHRlcm1pbmF0ZWQ6ICcgK1xuICAgICAgICAgICAgKHRlcm1pbmF0ZUNvbW1pdCA/ICd5ZXMnIDogJ25vJykgKyAnKTogJyk7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoY29tbWl0T2JqZWN0KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMucHJvY2Vzc0h0dHBSZXF1ZXN0KHRoaXMuc2V0dGluZ3MubG1zQ29tbWl0VXJsLFxuICAgICAgICAgIGNvbW1pdE9iamVjdCk7XG4gICAgICAvLyBjaGVjayBpZiB0aGlzIGlzIGEgc2VxdWVuY2luZyBjYWxsLCBhbmQgdGhlbiBjYWxsIHRoZSBuZWNlc3NhcnkgSlNcbiAgICAgIGlmIChuYXZSZXF1ZXN0ICYmIHJlc3VsdC5uYXZSZXF1ZXN0ICE9PSB1bmRlZmluZWQgJiZcbiAgICAgICAgICByZXN1bHQubmF2UmVxdWVzdCAhPT0gJycpIHtcbiAgICAgICAgRnVuY3Rpb24oYFwidXNlIHN0cmljdFwiOygoKSA9PiB7ICR7cmVzdWx0Lm5hdlJlcXVlc3R9IH0pKClgKSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coJ0NvbW1pdCAodGVybWluYXRlZDogJyArXG4gICAgICAgICAgKHRlcm1pbmF0ZUNvbW1pdCA/ICd5ZXMnIDogJ25vJykgKyAnKTogJyk7XG4gICAgICBjb25zb2xlLmxvZyhjb21taXRPYmplY3QpO1xuICAgICAgcmV0dXJuIGdsb2JhbF9jb25zdGFudHMuU0NPUk1fVFJVRTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIFNjb3JtMTJDTUkgZnJvbSAnLi9zY29ybTEyX2NtaSc7XG5pbXBvcnQge0Jhc2VDTUksIENNSUFycmF5LCBDTUlTY29yZX0gZnJvbSAnLi9jb21tb24nO1xuaW1wb3J0IHthaWNjX2NvbnN0YW50c30gZnJvbSAnLi4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuaW1wb3J0IHthaWNjX3JlZ2V4fSBmcm9tICcuLi9jb25zdGFudHMvcmVnZXgnO1xuaW1wb3J0IHtzY29ybTEyX2Vycm9yX2NvZGVzfSBmcm9tICcuLi9jb25zdGFudHMvZXJyb3JfY29kZXMnO1xuaW1wb3J0IHtcbiAgY2hlY2sxMlZhbGlkRm9ybWF0LFxuICB0aHJvd1JlYWRPbmx5RXJyb3IsXG4gIHRocm93V3JpdGVPbmx5RXJyb3IsXG59IGZyb20gJy4vc2Nvcm0xMl9jbWknO1xuXG5jb25zdCBjb25zdGFudHMgPSBhaWNjX2NvbnN0YW50cztcbmNvbnN0IHJlZ2V4ID0gYWljY19yZWdleDtcblxuLyoqXG4gKiBDTUkgQ2xhc3MgZm9yIEFJQ0NcbiAqL1xuZXhwb3J0IGNsYXNzIENNSSBleHRlbmRzIFNjb3JtMTJDTUkuQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIENNSSBvYmplY3RcbiAgICogQHBhcmFtIHtib29sZWFufSBpbml0aWFsaXplZFxuICAgKi9cbiAgY29uc3RydWN0b3IoaW5pdGlhbGl6ZWQ6IGJvb2xlYW4pIHtcbiAgICBzdXBlcihjb25zdGFudHMuY21pX2NoaWxkcmVuKTtcblxuICAgIGlmIChpbml0aWFsaXplZCkgdGhpcy5pbml0aWFsaXplKCk7XG5cbiAgICB0aGlzLnN0dWRlbnRfZGF0YSA9IG5ldyBBSUNDQ01JU3R1ZGVudERhdGEoKTtcbiAgICB0aGlzLmV2YWx1YXRpb24gPSBuZXcgQ01JRXZhbHVhdGlvbigpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnN0dWRlbnRfZGF0YT8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuZXZhbHVhdGlvbj8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgc3VzcGVuZF9kYXRhOiBzdHJpbmcsXG4gICAqICAgICAgbGF1bmNoX2RhdGE6IHN0cmluZyxcbiAgICogICAgICBjb21tZW50czogc3RyaW5nLFxuICAgKiAgICAgIGNvbW1lbnRzX2Zyb21fbG1zOiBzdHJpbmcsXG4gICAqICAgICAgY29yZTogQ01JQ29yZSxcbiAgICogICAgICBvYmplY3RpdmVzOiBDTUlPYmplY3RpdmVzLFxuICAgKiAgICAgIHN0dWRlbnRfZGF0YTogQ01JU3R1ZGVudERhdGEsXG4gICAqICAgICAgc3R1ZGVudF9wcmVmZXJlbmNlOiBDTUlTdHVkZW50UHJlZmVyZW5jZSxcbiAgICogICAgICBpbnRlcmFjdGlvbnM6IENNSUludGVyYWN0aW9uc1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnc3VzcGVuZF9kYXRhJzogdGhpcy5zdXNwZW5kX2RhdGEsXG4gICAgICAnbGF1bmNoX2RhdGEnOiB0aGlzLmxhdW5jaF9kYXRhLFxuICAgICAgJ2NvbW1lbnRzJzogdGhpcy5jb21tZW50cyxcbiAgICAgICdjb21tZW50c19mcm9tX2xtcyc6IHRoaXMuY29tbWVudHNfZnJvbV9sbXMsXG4gICAgICAnY29yZSc6IHRoaXMuY29yZSxcbiAgICAgICdvYmplY3RpdmVzJzogdGhpcy5vYmplY3RpdmVzLFxuICAgICAgJ3N0dWRlbnRfZGF0YSc6IHRoaXMuc3R1ZGVudF9kYXRhLFxuICAgICAgJ3N0dWRlbnRfcHJlZmVyZW5jZSc6IHRoaXMuc3R1ZGVudF9wcmVmZXJlbmNlLFxuICAgICAgJ2ludGVyYWN0aW9ucyc6IHRoaXMuaW50ZXJhY3Rpb25zLFxuICAgICAgJ2V2YWx1YXRpb24nOiB0aGlzLmV2YWx1YXRpb24sXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBBSUNDIEV2YWx1YXRpb24gb2JqZWN0XG4gKi9cbmNsYXNzIENNSUV2YWx1YXRpb24gZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIEV2YWx1YXRpb24gb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5jb21tZW50cyA9IG5ldyBDTUlFdmFsdWF0aW9uQ29tbWVudHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5jb21tZW50cz8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmV2YWx1YXRpb24gb2JqZWN0XG4gICAqIEByZXR1cm4ge3tjb21tZW50czogQ01JRXZhbHVhdGlvbkNvbW1lbnRzfX1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdjb21tZW50cyc6IHRoaXMuY29tbWVudHMsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgQUlDQydzIGNtaS5ldmFsdWF0aW9uLmNvbW1lbnRzIG9iamVjdFxuICovXG5jbGFzcyBDTUlFdmFsdWF0aW9uQ29tbWVudHMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBFdmFsdWF0aW9uIENvbW1lbnRzIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoY29uc3RhbnRzLmNvbW1lbnRzX2NoaWxkcmVuLFxuICAgICAgICBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFKTtcbiAgfVxufVxuXG4vKipcbiAqIFN0dWRlbnREYXRhIGNsYXNzIGZvciBBSUNDXG4gKi9cbmNsYXNzIEFJQ0NDTUlTdHVkZW50RGF0YSBleHRlbmRzIFNjb3JtMTJDTUkuQ01JU3R1ZGVudERhdGEge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEFJQ0MgU3R1ZGVudERhdGEgb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihjb25zdGFudHMuc3R1ZGVudF9kYXRhX2NoaWxkcmVuKTtcblxuICAgIHRoaXMudHJpZXMgPSBuZXcgQ01JVHJpZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy50cmllcz8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgI3RyaWVzX2R1cmluZ19sZXNzb24gPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciB0cmllc19kdXJpbmdfbGVzc29uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0cmllc19kdXJpbmdfbGVzc29uKCkge1xuICAgIHJldHVybiB0aGlzLiN0cmllc19kdXJpbmdfbGVzc29uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RyaWVzX2R1cmluZ19sZXNzb24uIFNldHMgYW4gZXJyb3IgaWYgdHJ5aW5nIHRvIHNldCBhZnRlclxuICAgKiAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0cmllc19kdXJpbmdfbGVzc29uXG4gICAqL1xuICBzZXQgdHJpZXNfZHVyaW5nX2xlc3Nvbih0cmllc19kdXJpbmdfbGVzc29uKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiN0cmllc19kdXJpbmdfbGVzc29uID0gdHJpZXNfZHVyaW5nX2xlc3NvbiA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLnN0dWRlbnRfZGF0YSBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBtYXN0ZXJ5X3Njb3JlOiBzdHJpbmcsXG4gICAqICAgICAgbWF4X3RpbWVfYWxsb3dlZDogc3RyaW5nLFxuICAgKiAgICAgIHRpbWVfbGltaXRfYWN0aW9uOiBzdHJpbmcsXG4gICAqICAgICAgdHJpZXM6IENNSVRyaWVzXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdtYXN0ZXJ5X3Njb3JlJzogdGhpcy5tYXN0ZXJ5X3Njb3JlLFxuICAgICAgJ21heF90aW1lX2FsbG93ZWQnOiB0aGlzLm1heF90aW1lX2FsbG93ZWQsXG4gICAgICAndGltZV9saW1pdF9hY3Rpb24nOiB0aGlzLnRpbWVfbGltaXRfYWN0aW9uLFxuICAgICAgJ3RyaWVzJzogdGhpcy50cmllcyxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyB0aGUgQUlDQyBjbWkuc3R1ZGVudF9kYXRhLnRyaWVzIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JVHJpZXMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgaW5saW5lIFRyaWVzIEFycmF5IGNsYXNzXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihhaWNjX2NvbnN0YW50cy50cmllc19jaGlsZHJlbik7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgQUlDQyBUcmllc1xuICovXG5leHBvcnQgY2xhc3MgQ01JVHJpZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIFRyaWVzIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc2NvcmUgPSBuZXcgQ01JU2NvcmUoXG4gICAgICAgIHtcbiAgICAgICAgICBzY29yZV9jaGlsZHJlbjogY29uc3RhbnRzLnNjb3JlX2NoaWxkcmVuLFxuICAgICAgICAgIHNjb3JlX3JhbmdlOiByZWdleC5zY29yZV9yYW5nZSxcbiAgICAgICAgICBpbnZhbGlkRXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgICAgIGludmFsaWRUeXBlQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENILFxuICAgICAgICAgIGludmFsaWRSYW5nZUNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFLFxuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zY29yZT8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgI3N0YXR1cyA9ICcnO1xuICAjdGltZSA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdGF0dXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N0YXR1c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RhdHVzXG4gICAqL1xuICBzZXQgc3RhdHVzKHN0YXR1cykge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoc3RhdHVzLCByZWdleC5DTUlTdGF0dXMyKSkge1xuICAgICAgdGhpcy4jc3RhdHVzID0gc3RhdHVzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0aW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lKCkge1xuICAgIHJldHVybiB0aGlzLiN0aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVcbiAgICovXG4gIHNldCB0aW1lKHRpbWUpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHRpbWUsIHJlZ2V4LkNNSVRpbWUpKSB7XG4gICAgICB0aGlzLiN0aW1lID0gdGltZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuc3R1ZGVudF9kYXRhLnRyaWVzLm4gb2JqZWN0XG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgdGltZTogc3RyaW5nLFxuICAgKiAgICAgIHNjb3JlOiBDTUlTY29yZVxuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnc3RhdHVzJzogdGhpcy5zdGF0dXMsXG4gICAgICAndGltZSc6IHRoaXMudGltZSxcbiAgICAgICdzY29yZSc6IHRoaXMuc2NvcmUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgQUlDQyBFdmFsdWF0aW9uIENvbW1lbnRzXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlFdmFsdWF0aW9uQ29tbWVudHNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBFdmFsdWF0aW9uIENvbW1lbnRzXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgI2NvbnRlbnQgPSAnJztcbiAgI2xvY2F0aW9uID0gJyc7XG4gICN0aW1lID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NvbnRlbnRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbnRlbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29udGVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gY29udGVudFxuICAgKi9cbiAgc2V0IGNvbnRlbnQoY29udGVudCkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoY29udGVudCwgcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jY29udGVudCA9IGNvbnRlbnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xvY2F0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsb2NhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jbG9jYXRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbG9jYXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uXG4gICAqL1xuICBzZXQgbG9jYXRpb24obG9jYXRpb24pIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGxvY2F0aW9uLCByZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiNsb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0aW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lKCkge1xuICAgIHJldHVybiB0aGlzLiN0aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRpbmcgZm9yICN0aW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lXG4gICAqL1xuICBzZXQgdGltZSh0aW1lKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh0aW1lLCByZWdleC5DTUlUaW1lKSkge1xuICAgICAgdGhpcy4jdGltZSA9IHRpbWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmV2YXVsYXRpb24uY29tbWVudHMubiBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBjb250ZW50OiBzdHJpbmcsXG4gICAqICAgICAgbG9jYXRpb246IHN0cmluZyxcbiAgICogICAgICB0aW1lOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2NvbnRlbnQnOiB0aGlzLmNvbnRlbnQsXG4gICAgICAnbG9jYXRpb24nOiB0aGlzLmxvY2F0aW9uLFxuICAgICAgJ3RpbWUnOiB0aGlzLnRpbWUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiIsIi8vIEBmbG93XG5pbXBvcnQge3Njb3JtMTJfY29uc3RhbnRzfSBmcm9tICcuLi9jb25zdGFudHMvYXBpX2NvbnN0YW50cyc7XG5pbXBvcnQge3Njb3JtMTJfZXJyb3JfY29kZXN9IGZyb20gJy4uL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQge1ZhbGlkYXRpb25FcnJvcn0gZnJvbSAnLi4vZXhjZXB0aW9ucyc7XG5pbXBvcnQge3Njb3JtMTJfcmVnZXh9IGZyb20gJy4uL2NvbnN0YW50cy9yZWdleCc7XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIHZhbHVlIG1hdGNoZXMgdGhlIHByb3BlciBmb3JtYXQuIElmIG5vdCwgdGhyb3cgcHJvcGVyIGVycm9yIGNvZGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVnZXhQYXR0ZXJuXG4gKiBAcGFyYW0ge251bWJlcn0gZXJyb3JDb2RlXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGFsbG93RW1wdHlTdHJpbmdcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1ZhbGlkRm9ybWF0KFxuICAgIHZhbHVlOiBTdHJpbmcsXG4gICAgcmVnZXhQYXR0ZXJuOiBTdHJpbmcsXG4gICAgZXJyb3JDb2RlOiBudW1iZXIsXG4gICAgYWxsb3dFbXB0eVN0cmluZz86IGJvb2xlYW4pIHtcbiAgY29uc3QgZm9ybWF0UmVnZXggPSBuZXcgUmVnRXhwKHJlZ2V4UGF0dGVybik7XG4gIGNvbnN0IG1hdGNoZXMgPSB2YWx1ZS5tYXRjaChmb3JtYXRSZWdleCk7XG4gIGlmIChhbGxvd0VtcHR5U3RyaW5nICYmIHZhbHVlID09PSAnJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8ICFtYXRjaGVzIHx8IG1hdGNoZXNbMF0gPT09ICcnKSB7XG4gICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihlcnJvckNvZGUpO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoZSB2YWx1ZSBtYXRjaGVzIHRoZSBwcm9wZXIgcmFuZ2UuIElmIG5vdCwgdGhyb3cgcHJvcGVyIGVycm9yIGNvZGUuXG4gKlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9IHJhbmdlUGF0dGVyblxuICogQHBhcmFtIHtudW1iZXJ9IGVycm9yQ29kZVxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrVmFsaWRSYW5nZShcbiAgICB2YWx1ZTogYW55LCByYW5nZVBhdHRlcm46IFN0cmluZywgZXJyb3JDb2RlOiBudW1iZXIpIHtcbiAgY29uc3QgcmFuZ2VzID0gcmFuZ2VQYXR0ZXJuLnNwbGl0KCcjJyk7XG4gIHZhbHVlID0gdmFsdWUgKiAxLjA7XG4gIGlmICh2YWx1ZSA+PSByYW5nZXNbMF0pIHtcbiAgICBpZiAoKHJhbmdlc1sxXSA9PT0gJyonKSB8fCAodmFsdWUgPD0gcmFuZ2VzWzFdKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoZXJyb3JDb2RlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihlcnJvckNvZGUpO1xuICB9XG59XG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3IgQVBJIGNtaSBvYmplY3RzXG4gKi9cbmV4cG9ydCBjbGFzcyBCYXNlQ01JIHtcbiAganNvblN0cmluZyA9IGZhbHNlO1xuICAjaW5pdGlhbGl6ZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEJhc2VDTUksIGp1c3QgbWFya3MgdGhlIGNsYXNzIGFzIGFic3RyYWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAobmV3LnRhcmdldCA9PT0gQmFzZUNNSSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNvbnN0cnVjdCBCYXNlQ01JIGluc3RhbmNlcyBkaXJlY3RseScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNpbml0aWFsaXplZFxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgZ2V0IGluaXRpYWxpemVkKCkge1xuICAgIHJldHVybiB0aGlzLiNpbml0aWFsaXplZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLiNpbml0aWFsaXplZCA9IHRydWU7XG4gIH1cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBjbWkgKi5zY29yZSBvYmplY3RzXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlTY29yZSBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yICouc2NvcmVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjb3JlX2NoaWxkcmVuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY29yZV9yYW5nZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWF4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbnZhbGlkRXJyb3JDb2RlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbnZhbGlkVHlwZUNvZGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IGludmFsaWRSYW5nZUNvZGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlY2ltYWxSZWdleFxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgICB7XG4gICAgICAgIHNjb3JlX2NoaWxkcmVuLFxuICAgICAgICBzY29yZV9yYW5nZSxcbiAgICAgICAgbWF4LFxuICAgICAgICBpbnZhbGlkRXJyb3JDb2RlLFxuICAgICAgICBpbnZhbGlkVHlwZUNvZGUsXG4gICAgICAgIGludmFsaWRSYW5nZUNvZGUsXG4gICAgICAgIGRlY2ltYWxSZWdleCxcbiAgICAgIH0pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy4jX2NoaWxkcmVuID0gc2NvcmVfY2hpbGRyZW4gfHxcbiAgICAgICAgc2Nvcm0xMl9jb25zdGFudHMuc2NvcmVfY2hpbGRyZW47XG4gICAgdGhpcy4jX3Njb3JlX3JhbmdlID0gIXNjb3JlX3JhbmdlID8gZmFsc2UgOiBzY29ybTEyX3JlZ2V4LnNjb3JlX3JhbmdlO1xuICAgIHRoaXMuI21heCA9IChtYXggfHwgbWF4ID09PSAnJykgPyBtYXggOiAnMTAwJztcbiAgICB0aGlzLiNfaW52YWxpZF9lcnJvcl9jb2RlID0gaW52YWxpZEVycm9yQ29kZSB8fFxuICAgICAgICBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFO1xuICAgIHRoaXMuI19pbnZhbGlkX3R5cGVfY29kZSA9IGludmFsaWRUeXBlQ29kZSB8fFxuICAgICAgICBzY29ybTEyX2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0g7XG4gICAgdGhpcy4jX2ludmFsaWRfcmFuZ2VfY29kZSA9IGludmFsaWRSYW5nZUNvZGUgfHxcbiAgICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0U7XG4gICAgdGhpcy4jX2RlY2ltYWxfcmVnZXggPSBkZWNpbWFsUmVnZXggfHxcbiAgICAgICAgc2Nvcm0xMl9yZWdleC5DTUlEZWNpbWFsO1xuICB9XG5cbiAgI19jaGlsZHJlbjtcbiAgI19zY29yZV9yYW5nZTtcbiAgI19pbnZhbGlkX2Vycm9yX2NvZGU7XG4gICNfaW52YWxpZF90eXBlX2NvZGU7XG4gICNfaW52YWxpZF9yYW5nZV9jb2RlO1xuICAjX2RlY2ltYWxfcmVnZXg7XG4gICNyYXcgPSAnJztcbiAgI21pbiA9ICcnO1xuICAjbWF4O1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIF9jaGlsZHJlblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciBfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX2NoaWxkcmVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IodGhpcy4jX2ludmFsaWRfZXJyb3JfY29kZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjcmF3XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCByYXcoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3JhdztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNyYXdcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJhd1xuICAgKi9cbiAgc2V0IHJhdyhyYXcpIHtcbiAgICBpZiAoY2hlY2tWYWxpZEZvcm1hdChyYXcsIHRoaXMuI19kZWNpbWFsX3JlZ2V4LFxuICAgICAgICB0aGlzLiNfaW52YWxpZF90eXBlX2NvZGUpICYmXG4gICAgICAgICghdGhpcy4jX3Njb3JlX3JhbmdlIHx8XG4gICAgICAgICAgICBjaGVja1ZhbGlkUmFuZ2UocmF3LCB0aGlzLiNfc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgICAgICAgdGhpcy4jX2ludmFsaWRfcmFuZ2VfY29kZSkpKSB7XG4gICAgICB0aGlzLiNyYXcgPSByYXc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI21pblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbWluKCkge1xuICAgIHJldHVybiB0aGlzLiNtaW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbWluXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtaW5cbiAgICovXG4gIHNldCBtaW4obWluKSB7XG4gICAgaWYgKGNoZWNrVmFsaWRGb3JtYXQobWluLCB0aGlzLiNfZGVjaW1hbF9yZWdleCxcbiAgICAgICAgdGhpcy4jX2ludmFsaWRfdHlwZV9jb2RlKSAmJlxuICAgICAgICAoIXRoaXMuI19zY29yZV9yYW5nZSB8fFxuICAgICAgICAgICAgY2hlY2tWYWxpZFJhbmdlKG1pbiwgdGhpcy4jX3Njb3JlX3JhbmdlLFxuICAgICAgICAgICAgICAgIHRoaXMuI19pbnZhbGlkX3JhbmdlX2NvZGUpKSkge1xuICAgICAgdGhpcy4jbWluID0gbWluO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNtYXhcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1heCgpIHtcbiAgICByZXR1cm4gdGhpcy4jbWF4O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI21heFxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWF4XG4gICAqL1xuICBzZXQgbWF4KG1heCkge1xuICAgIGlmIChjaGVja1ZhbGlkRm9ybWF0KG1heCwgdGhpcy4jX2RlY2ltYWxfcmVnZXgsXG4gICAgICAgIHRoaXMuI19pbnZhbGlkX3R5cGVfY29kZSkgJiZcbiAgICAgICAgKCF0aGlzLiNfc2NvcmVfcmFuZ2UgfHxcbiAgICAgICAgICAgIGNoZWNrVmFsaWRSYW5nZShtYXgsIHRoaXMuI19zY29yZV9yYW5nZSxcbiAgICAgICAgICAgICAgICB0aGlzLiNfaW52YWxpZF9yYW5nZV9jb2RlKSkpIHtcbiAgICAgIHRoaXMuI21heCA9IG1heDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciAqLnNjb3JlXG4gICAqIEByZXR1cm4ge3ttaW46IHN0cmluZywgbWF4OiBzdHJpbmcsIHJhdzogc3RyaW5nfX1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdyYXcnOiB0aGlzLnJhdyxcbiAgICAgICdtaW4nOiB0aGlzLm1pbixcbiAgICAgICdtYXgnOiB0aGlzLm1heCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGNtaSAqLm4gb2JqZWN0c1xuICovXG5leHBvcnQgY2xhc3MgQ01JQXJyYXkgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGNtaSAqLm4gYXJyYXlzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjaGlsZHJlblxuICAgKiBAcGFyYW0ge251bWJlcn0gZXJyb3JDb2RlXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih7Y2hpbGRyZW4sIGVycm9yQ29kZX0pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuI19jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgIHRoaXMuI2Vycm9yQ29kZSA9IGVycm9yQ29kZTtcbiAgICB0aGlzLmNoaWxkQXJyYXkgPSBbXTtcbiAgfVxuXG4gICNlcnJvckNvZGU7XG4gICNfY2hpbGRyZW47XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgX2NoaWxkcmVuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciBfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX2NoaWxkcmVuXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IodGhpcy4jZXJyb3JDb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIF9jb3VudFxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAqL1xuICBnZXQgX2NvdW50KCkge1xuICAgIHJldHVybiB0aGlzLmNoaWxkQXJyYXkubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgX2NvdW50LiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IF9jb3VudFxuICAgKi9cbiAgc2V0IF9jb3VudChfY291bnQpIHtcbiAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHRoaXMuI2Vycm9yQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciAqLm4gYXJyYXlzXG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHRbaSArICcnXSA9IHRoaXMuY2hpbGRBcnJheVtpXTtcbiAgICB9XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iLCIvLyBAZmxvd1xuaW1wb3J0IHtcbiAgQmFzZUNNSSxcbiAgY2hlY2tWYWxpZEZvcm1hdCxcbiAgY2hlY2tWYWxpZFJhbmdlLFxuICBDTUlBcnJheSxcbiAgQ01JU2NvcmUsXG59IGZyb20gJy4vY29tbW9uJztcbmltcG9ydCB7c2Nvcm0xMl9jb25zdGFudHN9IGZyb20gJy4uL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCB7c2Nvcm0xMl9lcnJvcl9jb2Rlc30gZnJvbSAnLi4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJztcbmltcG9ydCB7c2Nvcm0xMl9yZWdleH0gZnJvbSAnLi4vY29uc3RhbnRzL3JlZ2V4JztcbmltcG9ydCB7VmFsaWRhdGlvbkVycm9yfSBmcm9tICcuLi9leGNlcHRpb25zJztcbmltcG9ydCAqIGFzIFV0aWxpdGllcyBmcm9tICcuLi91dGlsaXRpZXMnO1xuXG5jb25zdCBjb25zdGFudHMgPSBzY29ybTEyX2NvbnN0YW50cztcbmNvbnN0IHJlZ2V4ID0gc2Nvcm0xMl9yZWdleDtcblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIGZvciB0aHJvd2luZyBSZWFkIE9ubHkgZXJyb3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRocm93UmVhZE9ubHlFcnJvcigpIHtcbiAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihzY29ybTEyX2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5UKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIGZvciB0aHJvd2luZyBXcml0ZSBPbmx5IGVycm9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aHJvd1dyaXRlT25seUVycm9yKCkge1xuICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHNjb3JtMTJfZXJyb3JfY29kZXMuV1JJVEVfT05MWV9FTEVNRU5UKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIGZvciB0aHJvd2luZyBJbnZhbGlkIFNldCBlcnJvclxuICovXG5mdW5jdGlvbiB0aHJvd0ludmFsaWRWYWx1ZUVycm9yKCkge1xuICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUpO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QsIG5vIHJlYXNvbiB0byBoYXZlIHRvIHBhc3MgdGhlIHNhbWUgZXJyb3IgY29kZXMgZXZlcnkgdGltZVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9IHJlZ2V4UGF0dGVyblxuICogQHBhcmFtIHtib29sZWFufSBhbGxvd0VtcHR5U3RyaW5nXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2sxMlZhbGlkRm9ybWF0KFxuICAgIHZhbHVlOiBTdHJpbmcsXG4gICAgcmVnZXhQYXR0ZXJuOiBTdHJpbmcsXG4gICAgYWxsb3dFbXB0eVN0cmluZz86IGJvb2xlYW4pIHtcbiAgcmV0dXJuIGNoZWNrVmFsaWRGb3JtYXQodmFsdWUsIHJlZ2V4UGF0dGVybixcbiAgICAgIHNjb3JtMTJfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCwgYWxsb3dFbXB0eVN0cmluZyk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCwgbm8gcmVhc29uIHRvIGhhdmUgdG8gcGFzcyB0aGUgc2FtZSBlcnJvciBjb2RlcyBldmVyeSB0aW1lXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcmFuZ2VQYXR0ZXJuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGFsbG93RW1wdHlTdHJpbmdcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVjazEyVmFsaWRSYW5nZShcbiAgICB2YWx1ZTogYW55LFxuICAgIHJhbmdlUGF0dGVybjogU3RyaW5nLFxuICAgIGFsbG93RW1wdHlTdHJpbmc/OiBib29sZWFuKSB7XG4gIHJldHVybiBjaGVja1ZhbGlkUmFuZ2UodmFsdWUsIHJhbmdlUGF0dGVybixcbiAgICAgIHNjb3JtMTJfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFLCBhbGxvd0VtcHR5U3RyaW5nKTtcbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgdGhlIGNtaSBvYmplY3QgZm9yIFNDT1JNIDEuMlxuICovXG5leHBvcnQgY2xhc3MgQ01JIGV4dGVuZHMgQmFzZUNNSSB7XG4gICNfY2hpbGRyZW4gPSAnJztcbiAgI192ZXJzaW9uID0gJzMuNCc7XG4gICNzdXNwZW5kX2RhdGEgPSAnJztcbiAgI2xhdW5jaF9kYXRhID0gJyc7XG4gICNjb21tZW50cyA9ICcnO1xuICAjY29tbWVudHNfZnJvbV9sbXMgPSAnJztcblxuICBzdHVkZW50X2RhdGEgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgdGhlIFNDT1JNIDEuMiBjbWkgb2JqZWN0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjbWlfY2hpbGRyZW5cbiAgICogQHBhcmFtIHsoQ01JU3R1ZGVudERhdGF8QUlDQ0NNSVN0dWRlbnREYXRhKX0gc3R1ZGVudF9kYXRhXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5pdGlhbGl6ZWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNtaV9jaGlsZHJlbiwgc3R1ZGVudF9kYXRhLCBpbml0aWFsaXplZDogYm9vbGVhbikge1xuICAgIHN1cGVyKCk7XG5cbiAgICBpZiAoaW5pdGlhbGl6ZWQpIHRoaXMuaW5pdGlhbGl6ZSgpO1xuXG4gICAgdGhpcy4jX2NoaWxkcmVuID0gY21pX2NoaWxkcmVuID8gY21pX2NoaWxkcmVuIDogY29uc3RhbnRzLmNtaV9jaGlsZHJlbjtcbiAgICB0aGlzLmNvcmUgPSBuZXcgQ01JQ29yZSgpO1xuICAgIHRoaXMub2JqZWN0aXZlcyA9IG5ldyBDTUlPYmplY3RpdmVzKCk7XG4gICAgdGhpcy5zdHVkZW50X2RhdGEgPSBzdHVkZW50X2RhdGEgPyBzdHVkZW50X2RhdGEgOiBuZXcgQ01JU3R1ZGVudERhdGEoKTtcbiAgICB0aGlzLnN0dWRlbnRfcHJlZmVyZW5jZSA9IG5ldyBDTUlTdHVkZW50UHJlZmVyZW5jZSgpO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zID0gbmV3IENNSUludGVyYWN0aW9ucygpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmNvcmU/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLm9iamVjdGl2ZXM/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnN0dWRlbnRfZGF0YT8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc3R1ZGVudF9wcmVmZXJlbmNlPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5pbnRlcmFjdGlvbnM/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHN1c3BlbmRfZGF0YTogc3RyaW5nLFxuICAgKiAgICAgIGxhdW5jaF9kYXRhOiBzdHJpbmcsXG4gICAqICAgICAgY29tbWVudHM6IHN0cmluZyxcbiAgICogICAgICBjb21tZW50c19mcm9tX2xtczogc3RyaW5nLFxuICAgKiAgICAgIGNvcmU6IENNSUNvcmUsXG4gICAqICAgICAgb2JqZWN0aXZlczogQ01JT2JqZWN0aXZlcyxcbiAgICogICAgICBzdHVkZW50X2RhdGE6IENNSVN0dWRlbnREYXRhLFxuICAgKiAgICAgIHN0dWRlbnRfcHJlZmVyZW5jZTogQ01JU3R1ZGVudFByZWZlcmVuY2UsXG4gICAqICAgICAgaW50ZXJhY3Rpb25zOiBDTUlJbnRlcmFjdGlvbnNcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3N1c3BlbmRfZGF0YSc6IHRoaXMuc3VzcGVuZF9kYXRhLFxuICAgICAgJ2xhdW5jaF9kYXRhJzogdGhpcy5sYXVuY2hfZGF0YSxcbiAgICAgICdjb21tZW50cyc6IHRoaXMuY29tbWVudHMsXG4gICAgICAnY29tbWVudHNfZnJvbV9sbXMnOiB0aGlzLmNvbW1lbnRzX2Zyb21fbG1zLFxuICAgICAgJ2NvcmUnOiB0aGlzLmNvcmUsXG4gICAgICAnb2JqZWN0aXZlcyc6IHRoaXMub2JqZWN0aXZlcyxcbiAgICAgICdzdHVkZW50X2RhdGEnOiB0aGlzLnN0dWRlbnRfZGF0YSxcbiAgICAgICdzdHVkZW50X3ByZWZlcmVuY2UnOiB0aGlzLnN0dWRlbnRfcHJlZmVyZW5jZSxcbiAgICAgICdpbnRlcmFjdGlvbnMnOiB0aGlzLmludGVyYWN0aW9ucyxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNfdmVyc2lvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgX3ZlcnNpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI192ZXJzaW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI192ZXJzaW9uLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF92ZXJzaW9uXG4gICAqL1xuICBzZXQgX3ZlcnNpb24oX3ZlcnNpb24pIHtcbiAgICB0aHJvd0ludmFsaWRWYWx1ZUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX2NoaWxkcmVuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfdmVyc2lvbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfY2hpbGRyZW5cbiAgICovXG4gIHNldCBfY2hpbGRyZW4oX2NoaWxkcmVuKSB7XG4gICAgdGhyb3dJbnZhbGlkVmFsdWVFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N1c3BlbmRfZGF0YVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3VzcGVuZF9kYXRhKCkge1xuICAgIHJldHVybiB0aGlzLiNzdXNwZW5kX2RhdGE7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3VzcGVuZF9kYXRhXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdXNwZW5kX2RhdGFcbiAgICovXG4gIHNldCBzdXNwZW5kX2RhdGEoc3VzcGVuZF9kYXRhKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChzdXNwZW5kX2RhdGEsIHJlZ2V4LkNNSVN0cmluZzQwOTYpKSB7XG4gICAgICB0aGlzLiNzdXNwZW5kX2RhdGEgPSBzdXNwZW5kX2RhdGE7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xhdW5jaF9kYXRhXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsYXVuY2hfZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGF1bmNoX2RhdGE7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGF1bmNoX2RhdGEuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGF1bmNoX2RhdGFcbiAgICovXG4gIHNldCBsYXVuY2hfZGF0YShsYXVuY2hfZGF0YSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jbGF1bmNoX2RhdGEgPSBsYXVuY2hfZGF0YSA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NvbW1lbnRzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb21tZW50cygpIHtcbiAgICByZXR1cm4gdGhpcy4jY29tbWVudHM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29tbWVudHNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbW1lbnRzXG4gICAqL1xuICBzZXQgY29tbWVudHMoY29tbWVudHMpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGNvbW1lbnRzLCByZWdleC5DTUlTdHJpbmc0MDk2KSkge1xuICAgICAgdGhpcy4jY29tbWVudHMgPSBjb21tZW50cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29tbWVudHNfZnJvbV9sbXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbW1lbnRzX2Zyb21fbG1zKCkge1xuICAgIHJldHVybiB0aGlzLiNjb21tZW50c19mcm9tX2xtcztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb21tZW50c19mcm9tX2xtcy4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21tZW50c19mcm9tX2xtc1xuICAgKi9cbiAgc2V0IGNvbW1lbnRzX2Zyb21fbG1zKGNvbW1lbnRzX2Zyb21fbG1zKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNjb21tZW50c19mcm9tX2xtcyA9IGNvbW1lbnRzX2Zyb21fbG1zIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0aGUgY3VycmVudCBzZXNzaW9uIHRpbWUgdG8gdGhlIGV4aXN0aW5nIHRvdGFsIHRpbWUuXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldEN1cnJlbnRUb3RhbFRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29yZS5nZXRDdXJyZW50VG90YWxUaW1lKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgdGhlIGNtaS5jb3JlIG9iamVjdFxuICogQGV4dGVuZHMgQmFzZUNNSVxuICovXG5jbGFzcyBDTUlDb3JlIGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmNvcmVcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnNjb3JlID0gbmV3IENNSVNjb3JlKFxuICAgICAgICB7XG4gICAgICAgICAgc2NvcmVfY2hpbGRyZW46IGNvbnN0YW50cy5zY29yZV9jaGlsZHJlbixcbiAgICAgICAgICBzY29yZV9yYW5nZTogcmVnZXguc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgaW52YWxpZEVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgICAgICBpbnZhbGlkVHlwZUNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCxcbiAgICAgICAgICBpbnZhbGlkUmFuZ2VDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRSxcbiAgICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc2NvcmU/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICNfY2hpbGRyZW4gPSBjb25zdGFudHMuY29yZV9jaGlsZHJlbjtcbiAgI3N0dWRlbnRfaWQgPSAnJztcbiAgI3N0dWRlbnRfbmFtZSA9ICcnO1xuICAjbGVzc29uX2xvY2F0aW9uID0gJyc7XG4gICNjcmVkaXQgPSAnJztcbiAgI2xlc3Nvbl9zdGF0dXMgPSAnbm90IGF0dGVtcHRlZCc7XG4gICNlbnRyeSA9ICcnO1xuICAjdG90YWxfdGltZSA9ICcnO1xuICAjbGVzc29uX21vZGUgPSAnbm9ybWFsJztcbiAgI2V4aXQgPSAnJztcbiAgI3Nlc3Npb25fdGltZSA9ICcwMDowMDowMCc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI19jaGlsZHJlblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvd0ludmFsaWRWYWx1ZUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3R1ZGVudF9pZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3R1ZGVudF9pZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jc3R1ZGVudF9pZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdHVkZW50X2lkLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0dWRlbnRfaWRcbiAgICovXG4gIHNldCBzdHVkZW50X2lkKHN0dWRlbnRfaWQpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI3N0dWRlbnRfaWQgPSBzdHVkZW50X2lkIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3R1ZGVudF9uYW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdHVkZW50X25hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0dWRlbnRfbmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdHVkZW50X25hbWUuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3R1ZGVudF9uYW1lXG4gICAqL1xuICBzZXQgc3R1ZGVudF9uYW1lKHN0dWRlbnRfbmFtZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jc3R1ZGVudF9uYW1lID0gc3R1ZGVudF9uYW1lIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGVzc29uX2xvY2F0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsZXNzb25fbG9jYXRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xlc3Nvbl9sb2NhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsZXNzb25fbG9jYXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlc3Nvbl9sb2NhdGlvblxuICAgKi9cbiAgc2V0IGxlc3Nvbl9sb2NhdGlvbihsZXNzb25fbG9jYXRpb24pIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGxlc3Nvbl9sb2NhdGlvbiwgcmVnZXguQ01JU3RyaW5nMjU2KSkge1xuICAgICAgdGhpcy4jbGVzc29uX2xvY2F0aW9uID0gbGVzc29uX2xvY2F0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjcmVkaXRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNyZWRpdCgpIHtcbiAgICByZXR1cm4gdGhpcy4jY3JlZGl0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NyZWRpdC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjcmVkaXRcbiAgICovXG4gIHNldCBjcmVkaXQoY3JlZGl0KSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNjcmVkaXQgPSBjcmVkaXQgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsZXNzb25fc3RhdHVzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsZXNzb25fc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNsZXNzb25fc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xlc3Nvbl9zdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlc3Nvbl9zdGF0dXNcbiAgICovXG4gIHNldCBsZXNzb25fc3RhdHVzKGxlc3Nvbl9zdGF0dXMpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGxlc3Nvbl9zdGF0dXMsIHJlZ2V4LkNNSVN0YXR1cykpIHtcbiAgICAgIHRoaXMuI2xlc3Nvbl9zdGF0dXMgPSBsZXNzb25fc3RhdHVzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNlbnRyeVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZW50cnkoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2VudHJ5O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2VudHJ5LiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGVudHJ5XG4gICAqL1xuICBzZXQgZW50cnkoZW50cnkpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI2VudHJ5ID0gZW50cnkgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0b3RhbF90aW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0b3RhbF90aW1lKCkge1xuICAgIHJldHVybiB0aGlzLiN0b3RhbF90aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RvdGFsX3RpbWUuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdG90YWxfdGltZVxuICAgKi9cbiAgc2V0IHRvdGFsX3RpbWUodG90YWxfdGltZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jdG90YWxfdGltZSA9IHRvdGFsX3RpbWUgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsZXNzb25fbW9kZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVzc29uX21vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xlc3Nvbl9tb2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xlc3Nvbl9tb2RlLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlc3Nvbl9tb2RlXG4gICAqL1xuICBzZXQgbGVzc29uX21vZGUobGVzc29uX21vZGUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI2xlc3Nvbl9tb2RlID0gbGVzc29uX21vZGUgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNleGl0LiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IGV4aXQoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI2V4aXQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZXhpdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXhpdFxuICAgKi9cbiAgc2V0IGV4aXQoZXhpdCkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoZXhpdCwgcmVnZXguQ01JRXhpdCkpIHtcbiAgICAgIHRoaXMuI2V4aXQgPSBleGl0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzZXNzaW9uX3RpbWUuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgc2Vzc2lvbl90aW1lKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNzZXNzaW9uX3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc2Vzc2lvbl90aW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzZXNzaW9uX3RpbWVcbiAgICovXG4gIHNldCBzZXNzaW9uX3RpbWUoc2Vzc2lvbl90aW1lKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChzZXNzaW9uX3RpbWUsIHJlZ2V4LkNNSVRpbWVzcGFuKSkge1xuICAgICAgdGhpcy4jc2Vzc2lvbl90aW1lID0gc2Vzc2lvbl90aW1lO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHRoZSBjdXJyZW50IHNlc3Npb24gdGltZSB0byB0aGUgZXhpc3RpbmcgdG90YWwgdGltZS5cbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0Q3VycmVudFRvdGFsVGltZSgpIHtcbiAgICByZXR1cm4gVXRpbGl0aWVzLmFkZEhITU1TU1RpbWVTdHJpbmdzKFxuICAgICAgICB0aGlzLiN0b3RhbF90aW1lLFxuICAgICAgICB0aGlzLiNzZXNzaW9uX3RpbWUsXG4gICAgICAgIG5ldyBSZWdFeHAoc2Nvcm0xMl9yZWdleC5DTUlUaW1lc3BhbilcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmNvcmVcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBzdHVkZW50X25hbWU6IHN0cmluZyxcbiAgICogICAgICBlbnRyeTogc3RyaW5nLFxuICAgKiAgICAgIGV4aXQ6IHN0cmluZyxcbiAgICogICAgICBzY29yZTogQ01JU2NvcmUsXG4gICAqICAgICAgc3R1ZGVudF9pZDogc3RyaW5nLFxuICAgKiAgICAgIGxlc3Nvbl9tb2RlOiBzdHJpbmcsXG4gICAqICAgICAgbGVzc29uX2xvY2F0aW9uOiBzdHJpbmcsXG4gICAqICAgICAgbGVzc29uX3N0YXR1czogc3RyaW5nLFxuICAgKiAgICAgIGNyZWRpdDogc3RyaW5nLFxuICAgKiAgICAgIHRvdGFsX3RpbWU6IHN0cmluZyxcbiAgICogICAgICBzZXNzaW9uX3RpbWU6ICpcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3N0dWRlbnRfaWQnOiB0aGlzLnN0dWRlbnRfaWQsXG4gICAgICAnc3R1ZGVudF9uYW1lJzogdGhpcy5zdHVkZW50X25hbWUsXG4gICAgICAnbGVzc29uX2xvY2F0aW9uJzogdGhpcy5sZXNzb25fbG9jYXRpb24sXG4gICAgICAnY3JlZGl0JzogdGhpcy5jcmVkaXQsXG4gICAgICAnbGVzc29uX3N0YXR1cyc6IHRoaXMubGVzc29uX3N0YXR1cyxcbiAgICAgICdlbnRyeSc6IHRoaXMuZW50cnksXG4gICAgICAndG90YWxfdGltZSc6IHRoaXMudG90YWxfdGltZSxcbiAgICAgICdsZXNzb25fbW9kZSc6IHRoaXMubGVzc29uX21vZGUsXG4gICAgICAnZXhpdCc6IHRoaXMuZXhpdCxcbiAgICAgICdzZXNzaW9uX3RpbWUnOiB0aGlzLnNlc3Npb25fdGltZSxcbiAgICAgICdzY29yZSc6IHRoaXMuc2NvcmUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLm9iamVjdGl2ZXMgb2JqZWN0XG4gKiBAZXh0ZW5kcyBDTUlBcnJheVxuICovXG5jbGFzcyBDTUlPYmplY3RpdmVzIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5vYmplY3RpdmVzXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogY29uc3RhbnRzLm9iamVjdGl2ZXNfY2hpbGRyZW4sXG4gICAgICBlcnJvckNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLnN0dWRlbnRfZGF0YSBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSVN0dWRlbnREYXRhIGV4dGVuZHMgQmFzZUNNSSB7XG4gICNfY2hpbGRyZW47XG4gICNtYXN0ZXJ5X3Njb3JlID0gJyc7XG4gICNtYXhfdGltZV9hbGxvd2VkID0gJyc7XG4gICN0aW1lX2xpbWl0X2FjdGlvbiA9ICcnO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLnN0dWRlbnRfZGF0YVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3R1ZGVudF9kYXRhX2NoaWxkcmVuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzdHVkZW50X2RhdGFfY2hpbGRyZW4pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy4jX2NoaWxkcmVuID0gc3R1ZGVudF9kYXRhX2NoaWxkcmVuID9cbiAgICAgICAgc3R1ZGVudF9kYXRhX2NoaWxkcmVuIDpcbiAgICAgICAgY29uc3RhbnRzLnN0dWRlbnRfZGF0YV9jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNfY2hpbGRyZW5cbiAgICogQHJldHVybiB7Kn1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX2NoaWxkcmVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93SW52YWxpZFZhbHVlRXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNtYXN0ZXJfc2NvcmVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1hc3Rlcnlfc2NvcmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI21hc3Rlcnlfc2NvcmU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbWFzdGVyX3Njb3JlLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1hc3Rlcnlfc2NvcmVcbiAgICovXG4gIHNldCBtYXN0ZXJ5X3Njb3JlKG1hc3Rlcnlfc2NvcmUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI21hc3Rlcnlfc2NvcmUgPSBtYXN0ZXJ5X3Njb3JlIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbWF4X3RpbWVfYWxsb3dlZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbWF4X3RpbWVfYWxsb3dlZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jbWF4X3RpbWVfYWxsb3dlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNtYXhfdGltZV9hbGxvd2VkLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1heF90aW1lX2FsbG93ZWRcbiAgICovXG4gIHNldCBtYXhfdGltZV9hbGxvd2VkKG1heF90aW1lX2FsbG93ZWQpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI21heF90aW1lX2FsbG93ZWQgPSBtYXhfdGltZV9hbGxvd2VkIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZV9saW1pdF9hY3Rpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRpbWVfbGltaXRfYWN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiN0aW1lX2xpbWl0X2FjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lX2xpbWl0X2FjdGlvbi4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lX2xpbWl0X2FjdGlvblxuICAgKi9cbiAgc2V0IHRpbWVfbGltaXRfYWN0aW9uKHRpbWVfbGltaXRfYWN0aW9uKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiN0aW1lX2xpbWl0X2FjdGlvbiA9IHRpbWVfbGltaXRfYWN0aW9uIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuc3R1ZGVudF9kYXRhXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgbWF4X3RpbWVfYWxsb3dlZDogc3RyaW5nLFxuICAgKiAgICAgIHRpbWVfbGltaXRfYWN0aW9uOiBzdHJpbmcsXG4gICAqICAgICAgbWFzdGVyeV9zY29yZTogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdtYXN0ZXJ5X3Njb3JlJzogdGhpcy5tYXN0ZXJ5X3Njb3JlLFxuICAgICAgJ21heF90aW1lX2FsbG93ZWQnOiB0aGlzLm1heF90aW1lX2FsbG93ZWQsXG4gICAgICAndGltZV9saW1pdF9hY3Rpb24nOiB0aGlzLnRpbWVfbGltaXRfYWN0aW9uLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5zdHVkZW50X3ByZWZlcmVuY2Ugb2JqZWN0XG4gKiBAZXh0ZW5kcyBCYXNlQ01JXG4gKi9cbmNsYXNzIENNSVN0dWRlbnRQcmVmZXJlbmNlIGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLnN0dWRlbnRfcHJlZmVyZW5jZVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gICNfY2hpbGRyZW4gPSBjb25zdGFudHMuc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuO1xuICAjYXVkaW8gPSAnJztcbiAgI2xhbmd1YWdlID0gJyc7XG4gICNzcGVlZCA9ICcnO1xuICAjdGV4dCA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNfY2hpbGRyZW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IF9jaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI19jaGlsZHJlbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfY2hpbGRyZW5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldCBfY2hpbGRyZW4oX2NoaWxkcmVuKSB7XG4gICAgdGhyb3dJbnZhbGlkVmFsdWVFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2F1ZGlvXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBhdWRpbygpIHtcbiAgICByZXR1cm4gdGhpcy4jYXVkaW87XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjYXVkaW9cbiAgICogQHBhcmFtIHtzdHJpbmd9IGF1ZGlvXG4gICAqL1xuICBzZXQgYXVkaW8oYXVkaW8pIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGF1ZGlvLCByZWdleC5DTUlTSW50ZWdlcikgJiZcbiAgICAgICAgY2hlY2sxMlZhbGlkUmFuZ2UoYXVkaW8sIHJlZ2V4LmF1ZGlvX3JhbmdlKSkge1xuICAgICAgdGhpcy4jYXVkaW8gPSBhdWRpbztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGFuZ3VhZ2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxhbmd1YWdlKCkge1xuICAgIHJldHVybiB0aGlzLiNsYW5ndWFnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsYW5ndWFnZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGFuZ3VhZ2VcbiAgICovXG4gIHNldCBsYW5ndWFnZShsYW5ndWFnZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQobGFuZ3VhZ2UsIHJlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI2xhbmd1YWdlID0gbGFuZ3VhZ2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3NwZWVkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzcGVlZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jc3BlZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3BlZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNwZWVkXG4gICAqL1xuICBzZXQgc3BlZWQoc3BlZWQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHNwZWVkLCByZWdleC5DTUlTSW50ZWdlcikgJiZcbiAgICAgICAgY2hlY2sxMlZhbGlkUmFuZ2Uoc3BlZWQsIHJlZ2V4LnNwZWVkX3JhbmdlKSkge1xuICAgICAgdGhpcy4jc3BlZWQgPSBzcGVlZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGV4dFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdGV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy4jdGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0ZXh0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0XG4gICAqL1xuICBzZXQgdGV4dCh0ZXh0KSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh0ZXh0LCByZWdleC5DTUlTSW50ZWdlcikgJiZcbiAgICAgICAgY2hlY2sxMlZhbGlkUmFuZ2UodGV4dCwgcmVnZXgudGV4dF9yYW5nZSkpIHtcbiAgICAgIHRoaXMuI3RleHQgPSB0ZXh0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5zdHVkZW50X3ByZWZlcmVuY2VcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBhdWRpbzogc3RyaW5nLFxuICAgKiAgICAgIGxhbmd1YWdlOiBzdHJpbmcsXG4gICAqICAgICAgc3BlZWQ6IHN0cmluZyxcbiAgICogICAgICB0ZXh0OiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2F1ZGlvJzogdGhpcy5hdWRpbyxcbiAgICAgICdsYW5ndWFnZSc6IHRoaXMubGFuZ3VhZ2UsXG4gICAgICAnc3BlZWQnOiB0aGlzLnNwZWVkLFxuICAgICAgJ3RleHQnOiB0aGlzLnRleHQsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLmludGVyYWN0aW9ucyBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuY2xhc3MgQ01JSW50ZXJhY3Rpb25zIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5pbnRlcmFjdGlvbnNcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHtcbiAgICAgIGNoaWxkcmVuOiBjb25zdGFudHMuaW50ZXJhY3Rpb25zX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5pbnRlcmFjdGlvbnMubiBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5pbnRlcmFjdGlvbnMubiBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLm9iamVjdGl2ZXMgPSBuZXcgQ01JQXJyYXkoe1xuICAgICAgZXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgY2hpbGRyZW46IGNvbnN0YW50cy5vYmplY3RpdmVzX2NoaWxkcmVuLFxuICAgIH0pO1xuICAgIHRoaXMuY29ycmVjdF9yZXNwb25zZXMgPSBuZXcgQ01JQXJyYXkoe1xuICAgICAgZXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgY2hpbGRyZW46IGNvbnN0YW50cy5jb3JyZWN0X3Jlc3BvbnNlc19jaGlsZHJlbixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5vYmplY3RpdmVzPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5jb3JyZWN0X3Jlc3BvbnNlcz8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgI2lkID0gJyc7XG4gICN0aW1lID0gJyc7XG4gICN0eXBlID0gJyc7XG4gICN3ZWlnaHRpbmcgPSAnJztcbiAgI3N0dWRlbnRfcmVzcG9uc2UgPSAnJztcbiAgI3Jlc3VsdCA9ICcnO1xuICAjbGF0ZW5jeSA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNpZC4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCBpZCgpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjaWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBzZXQgaWQoaWQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGlkLCByZWdleC5DTUlJZGVudGlmaWVyKSkge1xuICAgICAgdGhpcy4jaWQgPSBpZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZS4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCB0aW1lKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiN0aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVcbiAgICovXG4gIHNldCB0aW1lKHRpbWUpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHRpbWUsIHJlZ2V4LkNNSVRpbWUpKSB7XG4gICAgICB0aGlzLiN0aW1lID0gdGltZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdHlwZS4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiN0eXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3R5cGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAgICovXG4gIHNldCB0eXBlKHR5cGUpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHR5cGUsIHJlZ2V4LkNNSVR5cGUpKSB7XG4gICAgICB0aGlzLiN0eXBlID0gdHlwZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjd2VpZ2h0aW5nLiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IHdlaWdodGluZygpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID9cbiAgICAgICAgdGhyb3dXcml0ZU9ubHlFcnJvcigpIDpcbiAgICAgICAgdGhpcy4jd2VpZ2h0aW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3dlaWdodGluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gd2VpZ2h0aW5nXG4gICAqL1xuICBzZXQgd2VpZ2h0aW5nKHdlaWdodGluZykge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQod2VpZ2h0aW5nLCByZWdleC5DTUlEZWNpbWFsKSAmJlxuICAgICAgICBjaGVjazEyVmFsaWRSYW5nZSh3ZWlnaHRpbmcsIHJlZ2V4LndlaWdodGluZ19yYW5nZSkpIHtcbiAgICAgIHRoaXMuI3dlaWdodGluZyA9IHdlaWdodGluZztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3R1ZGVudF9yZXNwb25zZS4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCBzdHVkZW50X3Jlc3BvbnNlKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNzdHVkZW50X3Jlc3BvbnNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N0dWRlbnRfcmVzcG9uc2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0dWRlbnRfcmVzcG9uc2VcbiAgICovXG4gIHNldCBzdHVkZW50X3Jlc3BvbnNlKHN0dWRlbnRfcmVzcG9uc2UpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHN0dWRlbnRfcmVzcG9uc2UsIHJlZ2V4LkNNSUZlZWRiYWNrLCB0cnVlKSkge1xuICAgICAgdGhpcy4jc3R1ZGVudF9yZXNwb25zZSA9IHN0dWRlbnRfcmVzcG9uc2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3Jlc3VsdC4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCByZXN1bHQoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI3Jlc3VsdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNyZXN1bHRcbiAgICogQHBhcmFtIHtzdHJpbmd9IHJlc3VsdFxuICAgKi9cbiAgc2V0IHJlc3VsdChyZXN1bHQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHJlc3VsdCwgcmVnZXguQ01JUmVzdWx0KSkge1xuICAgICAgdGhpcy4jcmVzdWx0ID0gcmVzdWx0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsYXRlbmN5LiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IGxhdGVuY3koKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI2xhdGVuY3k7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGF0ZW5jeVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGF0ZW5jeVxuICAgKi9cbiAgc2V0IGxhdGVuY3kobGF0ZW5jeSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQobGF0ZW5jeSwgcmVnZXguQ01JVGltZXNwYW4pKSB7XG4gICAgICB0aGlzLiNsYXRlbmN5ID0gbGF0ZW5jeTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuaW50ZXJhY3Rpb25zLm5cbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBpZDogc3RyaW5nLFxuICAgKiAgICAgIHRpbWU6IHN0cmluZyxcbiAgICogICAgICB0eXBlOiBzdHJpbmcsXG4gICAqICAgICAgd2VpZ2h0aW5nOiBzdHJpbmcsXG4gICAqICAgICAgc3R1ZGVudF9yZXNwb25zZTogc3RyaW5nLFxuICAgKiAgICAgIHJlc3VsdDogc3RyaW5nLFxuICAgKiAgICAgIGxhdGVuY3k6IHN0cmluZyxcbiAgICogICAgICBvYmplY3RpdmVzOiBDTUlBcnJheSxcbiAgICogICAgICBjb3JyZWN0X3Jlc3BvbnNlczogQ01JQXJyYXlcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICAgICd0aW1lJzogdGhpcy50aW1lLFxuICAgICAgJ3R5cGUnOiB0aGlzLnR5cGUsXG4gICAgICAnd2VpZ2h0aW5nJzogdGhpcy53ZWlnaHRpbmcsXG4gICAgICAnc3R1ZGVudF9yZXNwb25zZSc6IHRoaXMuc3R1ZGVudF9yZXNwb25zZSxcbiAgICAgICdyZXN1bHQnOiB0aGlzLnJlc3VsdCxcbiAgICAgICdsYXRlbmN5JzogdGhpcy5sYXRlbmN5LFxuICAgICAgJ29iamVjdGl2ZXMnOiB0aGlzLm9iamVjdGl2ZXMsXG4gICAgICAnY29ycmVjdF9yZXNwb25zZXMnOiB0aGlzLmNvcnJlY3RfcmVzcG9uc2VzLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5vYmplY3RpdmVzLm4gb2JqZWN0XG4gKiBAZXh0ZW5kcyBCYXNlQ01JXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlPYmplY3RpdmVzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLm9iamVjdGl2ZXMublxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc2NvcmUgPSBuZXcgQ01JU2NvcmUoXG4gICAgICAgIHtcbiAgICAgICAgICBzY29yZV9jaGlsZHJlbjogY29uc3RhbnRzLnNjb3JlX2NoaWxkcmVuLFxuICAgICAgICAgIHNjb3JlX3JhbmdlOiByZWdleC5zY29yZV9yYW5nZSxcbiAgICAgICAgICBpbnZhbGlkRXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgICAgIGludmFsaWRUeXBlQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENILFxuICAgICAgICAgIGludmFsaWRSYW5nZUNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFLFxuICAgICAgICB9KTtcbiAgfVxuXG4gICNpZCA9ICcnO1xuICAjc3RhdHVzID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2lkXG4gICAqIEByZXR1cm4ge1wiXCJ9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChpZCwgcmVnZXguQ01JSWRlbnRpZmllcikpIHtcbiAgICAgIHRoaXMuI2lkID0gaWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N0YXR1c1xuICAgKiBAcmV0dXJuIHtcIlwifVxuICAgKi9cbiAgZ2V0IHN0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N0YXR1c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gc3RhdHVzXG4gICAqL1xuICBzZXQgc3RhdHVzKHN0YXR1cykge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoc3RhdHVzLCByZWdleC5DTUlTdGF0dXMyKSkge1xuICAgICAgdGhpcy4jc3RhdHVzID0gc3RhdHVzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5vYmplY3RpdmVzLm5cbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBpZDogc3RyaW5nLFxuICAgKiAgICAgIHN0YXR1czogc3RyaW5nLFxuICAgKiAgICAgIHNjb3JlOiBDTUlTY29yZVxuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnaWQnOiB0aGlzLmlkLFxuICAgICAgJ3N0YXR1cyc6IHRoaXMuc3RhdHVzLFxuICAgICAgJ3Njb3JlJzogdGhpcy5zY29yZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkuaW50ZXJhY3Rpb25zLm4ub2JqZWN0aXZlcy5uIG9iamVjdFxuICogQGV4dGVuZHMgQmFzZUNNSVxuICovXG5leHBvcnQgY2xhc3MgQ01JSW50ZXJhY3Rpb25zT2JqZWN0aXZlc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5pbnRlcmFjdGlvbnMubi5vYmplY3RpdmVzLm5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAjaWQgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaWRcbiAgICogQHJldHVybiB7XCJcIn1cbiAgICovXG4gIGdldCBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjaWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBzZXQgaWQoaWQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGlkLCByZWdleC5DTUlJZGVudGlmaWVyKSkge1xuICAgICAgdGhpcy4jaWQgPSBpZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4ub2JqZWN0aXZlcy5uXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgaWQ6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnaWQnOiB0aGlzLmlkLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5pbnRlcmFjdGlvbnMuY29ycmVjdF9yZXNwb25zZXMubiBvYmplY3RcbiAqIEBleHRlbmRzIEJhc2VDTUlcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc0NvcnJlY3RSZXNwb25zZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLmNvcnJlY3RfcmVzcG9uc2VzLm5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAjcGF0dGVybiA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNwYXR0ZXJuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBwYXR0ZXJuKCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNwYXR0ZXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3BhdHRlcm5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdHRlcm5cbiAgICovXG4gIHNldCBwYXR0ZXJuKHBhdHRlcm4pIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHBhdHRlcm4sIHJlZ2V4LkNNSUZlZWRiYWNrLCB0cnVlKSkge1xuICAgICAgdGhpcy4jcGF0dGVybiA9IHBhdHRlcm47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmludGVyYWN0aW9ucy5jb3JyZWN0X3Jlc3BvbnNlcy5uXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgcGF0dGVybjogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdwYXR0ZXJuJzogdGhpcy5wYXR0ZXJuLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIEFJQ0MgTmF2aWdhdGlvbiBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIE5BViBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIE5BViBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAjZXZlbnQgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZXZlbnRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGV2ZW50KCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNldmVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNldmVudFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICovXG4gIHNldCBldmVudChldmVudCkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoZXZlbnQsIHJlZ2V4Lk5BVkV2ZW50KSkge1xuICAgICAgdGhpcy4jZXZlbnQgPSBldmVudDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBuYXYgb2JqZWN0XG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgZXZlbnQ6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnZXZlbnQnOiB0aGlzLmV2ZW50LFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iLCIvLyBAZmxvd1xuaW1wb3J0IHtcbiAgQmFzZUNNSSxcbiAgY2hlY2tWYWxpZEZvcm1hdCxcbiAgY2hlY2tWYWxpZFJhbmdlLFxuICBDTUlBcnJheSxcbiAgQ01JU2NvcmUsXG59IGZyb20gJy4vY29tbW9uJztcbmltcG9ydCB7c2Nvcm0yMDA0X2NvbnN0YW50c30gZnJvbSAnLi4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuaW1wb3J0IHtzY29ybTIwMDRfcmVnZXh9IGZyb20gJy4uL2NvbnN0YW50cy9yZWdleCc7XG5pbXBvcnQge3Njb3JtMjAwNF9lcnJvcl9jb2Rlc30gZnJvbSAnLi4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJztcbmltcG9ydCB7bGVhcm5lcl9yZXNwb25zZXN9IGZyb20gJy4uL2NvbnN0YW50cy9yZXNwb25zZV9jb25zdGFudHMnO1xuaW1wb3J0IHtWYWxpZGF0aW9uRXJyb3J9IGZyb20gJy4uL2V4Y2VwdGlvbnMnO1xuaW1wb3J0ICogYXMgVXRpbCBmcm9tICcuLi91dGlsaXRpZXMnO1xuXG5jb25zdCBjb25zdGFudHMgPSBzY29ybTIwMDRfY29uc3RhbnRzO1xuY29uc3QgcmVnZXggPSBzY29ybTIwMDRfcmVnZXg7XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgUmVhZCBPbmx5IGVycm9yXG4gKi9cbmZ1bmN0aW9uIHRocm93UmVhZE9ubHlFcnJvcigpIHtcbiAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQpO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QgZm9yIHRocm93aW5nIFdyaXRlIE9ubHkgZXJyb3JcbiAqL1xuZnVuY3Rpb24gdGhyb3dXcml0ZU9ubHlFcnJvcigpIHtcbiAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuV1JJVEVfT05MWV9FTEVNRU5UKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIGZvciB0aHJvd2luZyBUeXBlIE1pc21hdGNoIGVycm9yXG4gKi9cbmZ1bmN0aW9uIHRocm93VHlwZU1pc21hdGNoRXJyb3IoKSB7XG4gIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QsIG5vIHJlYXNvbiB0byBoYXZlIHRvIHBhc3MgdGhlIHNhbWUgZXJyb3IgY29kZXMgZXZlcnkgdGltZVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9IHJlZ2V4UGF0dGVyblxuICogQHBhcmFtIHtib29sZWFufSBhbGxvd0VtcHR5U3RyaW5nXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBjaGVjazIwMDRWYWxpZEZvcm1hdChcbiAgICB2YWx1ZTogU3RyaW5nLFxuICAgIHJlZ2V4UGF0dGVybjogU3RyaW5nLFxuICAgIGFsbG93RW1wdHlTdHJpbmc/OiBib29sZWFuKSB7XG4gIHJldHVybiBjaGVja1ZhbGlkRm9ybWF0KHZhbHVlLCByZWdleFBhdHRlcm4sXG4gICAgICBzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCwgYWxsb3dFbXB0eVN0cmluZyk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCwgbm8gcmVhc29uIHRvIGhhdmUgdG8gcGFzcyB0aGUgc2FtZSBlcnJvciBjb2RlcyBldmVyeSB0aW1lXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcmFuZ2VQYXR0ZXJuXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBjaGVjazIwMDRWYWxpZFJhbmdlKHZhbHVlOiBhbnksIHJhbmdlUGF0dGVybjogU3RyaW5nKSB7XG4gIHJldHVybiBjaGVja1ZhbGlkUmFuZ2UodmFsdWUsIHJhbmdlUGF0dGVybixcbiAgICAgIHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0UpO1xufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBjbWkgb2JqZWN0IGZvciBTQ09STSAyMDA0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUkgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciB0aGUgU0NPUk0gMjAwNCBjbWkgb2JqZWN0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5pdGlhbGl6ZWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKGluaXRpYWxpemVkOiBib29sZWFuKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMubGVhcm5lcl9wcmVmZXJlbmNlID0gbmV3IENNSUxlYXJuZXJQcmVmZXJlbmNlKCk7XG4gICAgdGhpcy5zY29yZSA9IG5ldyBTY29ybTIwMDRDTUlTY29yZSgpO1xuICAgIHRoaXMuY29tbWVudHNfZnJvbV9sZWFybmVyID0gbmV3IENNSUNvbW1lbnRzRnJvbUxlYXJuZXIoKTtcbiAgICB0aGlzLmNvbW1lbnRzX2Zyb21fbG1zID0gbmV3IENNSUNvbW1lbnRzRnJvbUxNUygpO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zID0gbmV3IENNSUludGVyYWN0aW9ucygpO1xuICAgIHRoaXMub2JqZWN0aXZlcyA9IG5ldyBDTUlPYmplY3RpdmVzKCk7XG5cbiAgICBpZiAoaW5pdGlhbGl6ZWQpIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgI192ZXJzaW9uID0gJzEuMCc7XG4gICNfY2hpbGRyZW4gPSBjb25zdGFudHMuY21pX2NoaWxkcmVuO1xuICAjY29tcGxldGlvbl9zdGF0dXMgPSAndW5rbm93bic7XG4gICNjb21wbGV0aW9uX3RocmVzaG9sZCA9ICcnO1xuICAjY3JlZGl0ID0gJ2NyZWRpdCc7XG4gICNlbnRyeSA9ICcnO1xuICAjZXhpdCA9ICcnO1xuICAjbGF1bmNoX2RhdGEgPSAnJztcbiAgI2xlYXJuZXJfaWQgPSAnJztcbiAgI2xlYXJuZXJfbmFtZSA9ICcnO1xuICAjbG9jYXRpb24gPSAnJztcbiAgI21heF90aW1lX2FsbG93ZWQgPSAnJztcbiAgI21vZGUgPSAnbm9ybWFsJztcbiAgI3Byb2dyZXNzX21lYXN1cmUgPSAnJztcbiAgI3NjYWxlZF9wYXNzaW5nX3Njb3JlID0gJyc7XG4gICNzZXNzaW9uX3RpbWUgPSAnUFQwSDBNMFMnO1xuICAjc3VjY2Vzc19zdGF0dXMgPSAndW5rbm93bic7XG4gICNzdXNwZW5kX2RhdGEgPSAnJztcbiAgI3RpbWVfbGltaXRfYWN0aW9uID0gJ2NvbnRpbnVlLG5vIG1lc3NhZ2UnO1xuICAjdG90YWxfdGltZSA9ICcwJztcblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMubGVhcm5lcl9wcmVmZXJlbmNlPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zY29yZT8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuY29tbWVudHNfZnJvbV9sZWFybmVyPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5jb21tZW50c19mcm9tX2xtcz8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuaW50ZXJhY3Rpb25zPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5vYmplY3RpdmVzPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX3ZlcnNpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IF92ZXJzaW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNfdmVyc2lvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfdmVyc2lvbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfdmVyc2lvblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF92ZXJzaW9uKF92ZXJzaW9uKSB7XG4gICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX2NoaWxkcmVuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge251bWJlcn0gX2NoaWxkcmVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NvbXBsZXRpb25fc3RhdHVzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb21wbGV0aW9uX3N0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jY29tcGxldGlvbl9zdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29tcGxldGlvbl9zdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbXBsZXRpb25fc3RhdHVzXG4gICAqL1xuICBzZXQgY29tcGxldGlvbl9zdGF0dXMoY29tcGxldGlvbl9zdGF0dXMpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoY29tcGxldGlvbl9zdGF0dXMsIHJlZ2V4LkNNSUNTdGF0dXMpKSB7XG4gICAgICB0aGlzLiNjb21wbGV0aW9uX3N0YXR1cyA9IGNvbXBsZXRpb25fc3RhdHVzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb21wbGV0aW9uX3RocmVzaG9sZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29tcGxldGlvbl90aHJlc2hvbGQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbXBsZXRpb25fdGhyZXNob2xkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbXBsZXRpb25fdGhyZXNob2xkLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbXBsZXRpb25fdGhyZXNob2xkXG4gICAqL1xuICBzZXQgY29tcGxldGlvbl90aHJlc2hvbGQoY29tcGxldGlvbl90aHJlc2hvbGQpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2NvbXBsZXRpb25fdGhyZXNob2xkID0gY29tcGxldGlvbl90aHJlc2hvbGQgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjcmVkaXRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNyZWRpdCgpIHtcbiAgICByZXR1cm4gdGhpcy4jY3JlZGl0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NyZWRpdC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjcmVkaXRcbiAgICovXG4gIHNldCBjcmVkaXQoY3JlZGl0KSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNjcmVkaXQgPSBjcmVkaXQgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNlbnRyeVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZW50cnkoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2VudHJ5O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2VudHJ5LiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGVudHJ5XG4gICAqL1xuICBzZXQgZW50cnkoZW50cnkpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI2VudHJ5ID0gZW50cnkgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNleGl0LiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgZXhpdCgpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jZXhpdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNleGl0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBleGl0XG4gICAqL1xuICBzZXQgZXhpdChleGl0KSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGV4aXQsIHJlZ2V4LkNNSUV4aXQpKSB7XG4gICAgICB0aGlzLiNleGl0ID0gZXhpdDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGF1bmNoX2RhdGFcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxhdW5jaF9kYXRhKCkge1xuICAgIHJldHVybiB0aGlzLiNsYXVuY2hfZGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsYXVuY2hfZGF0YS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsYXVuY2hfZGF0YVxuICAgKi9cbiAgc2V0IGxhdW5jaF9kYXRhKGxhdW5jaF9kYXRhKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNsYXVuY2hfZGF0YSA9IGxhdW5jaF9kYXRhIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGVhcm5lcl9pZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVhcm5lcl9pZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGVhcm5lcl9pZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsZWFybmVyX2lkLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlYXJuZXJfaWRcbiAgICovXG4gIHNldCBsZWFybmVyX2lkKGxlYXJuZXJfaWQpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI2xlYXJuZXJfaWQgPSBsZWFybmVyX2lkIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGVhcm5lcl9uYW1lXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsZWFybmVyX25hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xlYXJuZXJfbmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsZWFybmVyX25hbWUuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGVhcm5lcl9uYW1lXG4gICAqL1xuICBzZXQgbGVhcm5lcl9uYW1lKGxlYXJuZXJfbmFtZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jbGVhcm5lcl9uYW1lID0gbGVhcm5lcl9uYW1lIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbG9jYXRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxvY2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNsb2NhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsb2NhdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb25cbiAgICovXG4gIHNldCBsb2NhdGlvbihsb2NhdGlvbikge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChsb2NhdGlvbiwgcmVnZXguQ01JU3RyaW5nMTAwMCkpIHtcbiAgICAgIHRoaXMuI2xvY2F0aW9uID0gbG9jYXRpb247XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI21heF90aW1lX2FsbG93ZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1heF90aW1lX2FsbG93ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI21heF90aW1lX2FsbG93ZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbWF4X3RpbWVfYWxsb3dlZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYXhfdGltZV9hbGxvd2VkXG4gICAqL1xuICBzZXQgbWF4X3RpbWVfYWxsb3dlZChtYXhfdGltZV9hbGxvd2VkKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNtYXhfdGltZV9hbGxvd2VkID0gbWF4X3RpbWVfYWxsb3dlZCA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI21vZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI21vZGU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbW9kZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtb2RlXG4gICAqL1xuICBzZXQgbW9kZShtb2RlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNtb2RlID0gbW9kZSA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3Byb2dyZXNzX21lYXN1cmVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHByb2dyZXNzX21lYXN1cmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3Byb2dyZXNzX21lYXN1cmU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcHJvZ3Jlc3NfbWVhc3VyZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvZ3Jlc3NfbWVhc3VyZVxuICAgKi9cbiAgc2V0IHByb2dyZXNzX21lYXN1cmUocHJvZ3Jlc3NfbWVhc3VyZSkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChwcm9ncmVzc19tZWFzdXJlLCByZWdleC5DTUlEZWNpbWFsKSAmJlxuICAgICAgICBjaGVjazIwMDRWYWxpZFJhbmdlKHByb2dyZXNzX21lYXN1cmUsIHJlZ2V4LnByb2dyZXNzX3JhbmdlKSkge1xuICAgICAgdGhpcy4jcHJvZ3Jlc3NfbWVhc3VyZSA9IHByb2dyZXNzX21lYXN1cmU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3NjYWxlZF9wYXNzaW5nX3Njb3JlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzY2FsZWRfcGFzc2luZ19zY29yZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jc2NhbGVkX3Bhc3Npbmdfc2NvcmU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc2NhbGVkX3Bhc3Npbmdfc2NvcmUuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NhbGVkX3Bhc3Npbmdfc2NvcmVcbiAgICovXG4gIHNldCBzY2FsZWRfcGFzc2luZ19zY29yZShzY2FsZWRfcGFzc2luZ19zY29yZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jc2NhbGVkX3Bhc3Npbmdfc2NvcmUgPSBzY2FsZWRfcGFzc2luZ19zY29yZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3Nlc3Npb25fdGltZS4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHNlc3Npb25fdGltZSgpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jc2Vzc2lvbl90aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3Nlc3Npb25fdGltZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2Vzc2lvbl90aW1lXG4gICAqL1xuICBzZXQgc2Vzc2lvbl90aW1lKHNlc3Npb25fdGltZSkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChzZXNzaW9uX3RpbWUsIHJlZ2V4LkNNSVRpbWVzcGFuKSkge1xuICAgICAgdGhpcy4jc2Vzc2lvbl90aW1lID0gc2Vzc2lvbl90aW1lO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdWNjZXNzX3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3VjY2Vzc19zdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N1Y2Nlc3Nfc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N1Y2Nlc3Nfc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdWNjZXNzX3N0YXR1c1xuICAgKi9cbiAgc2V0IHN1Y2Nlc3Nfc3RhdHVzKHN1Y2Nlc3Nfc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHN1Y2Nlc3Nfc3RhdHVzLCByZWdleC5DTUlTU3RhdHVzKSkge1xuICAgICAgdGhpcy4jc3VjY2Vzc19zdGF0dXMgPSBzdWNjZXNzX3N0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3VzcGVuZF9kYXRhXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdXNwZW5kX2RhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N1c3BlbmRfZGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdXNwZW5kX2RhdGFcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN1c3BlbmRfZGF0YVxuICAgKi9cbiAgc2V0IHN1c3BlbmRfZGF0YShzdXNwZW5kX2RhdGEpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoc3VzcGVuZF9kYXRhLCByZWdleC5DTUlTdHJpbmc2NDAwMCkpIHtcbiAgICAgIHRoaXMuI3N1c3BlbmRfZGF0YSA9IHN1c3BlbmRfZGF0YTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZV9saW1pdF9hY3Rpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRpbWVfbGltaXRfYWN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiN0aW1lX2xpbWl0X2FjdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lX2xpbWl0X2FjdGlvbi4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lX2xpbWl0X2FjdGlvblxuICAgKi9cbiAgc2V0IHRpbWVfbGltaXRfYWN0aW9uKHRpbWVfbGltaXRfYWN0aW9uKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiN0aW1lX2xpbWl0X2FjdGlvbiA9IHRpbWVfbGltaXRfYWN0aW9uIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdG90YWxfdGltZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdG90YWxfdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jdG90YWxfdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0b3RhbF90aW1lLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvdGFsX3RpbWVcbiAgICovXG4gIHNldCB0b3RhbF90aW1lKHRvdGFsX3RpbWUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI3RvdGFsX3RpbWUgPSB0b3RhbF90aW1lIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0aGUgY3VycmVudCBzZXNzaW9uIHRpbWUgdG8gdGhlIGV4aXN0aW5nIHRvdGFsIHRpbWUuXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gSVNPODYwMSBEdXJhdGlvblxuICAgKi9cbiAgZ2V0Q3VycmVudFRvdGFsVGltZSgpIHtcbiAgICByZXR1cm4gVXRpbC5hZGRUd29EdXJhdGlvbnMoXG4gICAgICAgIHRoaXMuI3RvdGFsX3RpbWUsXG4gICAgICAgIHRoaXMuI3Nlc3Npb25fdGltZSxcbiAgICAgICAgc2Nvcm0yMDA0X3JlZ2V4LkNNSVRpbWVzcGFuLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWlcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBjb21tZW50c19mcm9tX2xlYXJuZXI6IENNSUNvbW1lbnRzRnJvbUxlYXJuZXIsXG4gICAqICAgICAgY29tbWVudHNfZnJvbV9sbXM6IENNSUNvbW1lbnRzRnJvbUxNUyxcbiAgICogICAgICBjb21wbGV0aW9uX3N0YXR1czogc3RyaW5nLFxuICAgKiAgICAgIGNvbXBsZXRpb25fdGhyZXNob2xkOiBzdHJpbmcsXG4gICAqICAgICAgY3JlZGl0OiBzdHJpbmcsXG4gICAqICAgICAgZW50cnk6IHN0cmluZyxcbiAgICogICAgICBleGl0OiBzdHJpbmcsXG4gICAqICAgICAgaW50ZXJhY3Rpb25zOiBDTUlJbnRlcmFjdGlvbnMsXG4gICAqICAgICAgbGF1bmNoX2RhdGE6IHN0cmluZyxcbiAgICogICAgICBsZWFybmVyX2lkOiBzdHJpbmcsXG4gICAqICAgICAgbGVhcm5lcl9uYW1lOiBzdHJpbmcsXG4gICAqICAgICAgbGVhcm5lcl9wcmVmZXJlbmNlOiBDTUlMZWFybmVyUHJlZmVyZW5jZSxcbiAgICogICAgICBsb2NhdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIG1heF90aW1lX2FsbG93ZWQ6IHN0cmluZyxcbiAgICogICAgICBtb2RlOiBzdHJpbmcsXG4gICAqICAgICAgb2JqZWN0aXZlczogQ01JT2JqZWN0aXZlcyxcbiAgICogICAgICBwcm9ncmVzc19tZWFzdXJlOiBzdHJpbmcsXG4gICAqICAgICAgc2NhbGVkX3Bhc3Npbmdfc2NvcmU6IHN0cmluZyxcbiAgICogICAgICBzY29yZTogU2Nvcm0yMDA0Q01JU2NvcmUsXG4gICAqICAgICAgc2Vzc2lvbl90aW1lOiBzdHJpbmcsXG4gICAqICAgICAgc3VjY2Vzc19zdGF0dXM6IHN0cmluZyxcbiAgICogICAgICBzdXNwZW5kX2RhdGE6IHN0cmluZyxcbiAgICogICAgICB0aW1lX2xpbWl0X2FjdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIHRvdGFsX3RpbWU6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnY29tbWVudHNfZnJvbV9sZWFybmVyJzogdGhpcy5jb21tZW50c19mcm9tX2xlYXJuZXIsXG4gICAgICAnY29tbWVudHNfZnJvbV9sbXMnOiB0aGlzLmNvbW1lbnRzX2Zyb21fbG1zLFxuICAgICAgJ2NvbXBsZXRpb25fc3RhdHVzJzogdGhpcy5jb21wbGV0aW9uX3N0YXR1cyxcbiAgICAgICdjb21wbGV0aW9uX3RocmVzaG9sZCc6IHRoaXMuY29tcGxldGlvbl90aHJlc2hvbGQsXG4gICAgICAnY3JlZGl0JzogdGhpcy5jcmVkaXQsXG4gICAgICAnZW50cnknOiB0aGlzLmVudHJ5LFxuICAgICAgJ2V4aXQnOiB0aGlzLmV4aXQsXG4gICAgICAnaW50ZXJhY3Rpb25zJzogdGhpcy5pbnRlcmFjdGlvbnMsXG4gICAgICAnbGF1bmNoX2RhdGEnOiB0aGlzLmxhdW5jaF9kYXRhLFxuICAgICAgJ2xlYXJuZXJfaWQnOiB0aGlzLmxlYXJuZXJfaWQsXG4gICAgICAnbGVhcm5lcl9uYW1lJzogdGhpcy5sZWFybmVyX25hbWUsXG4gICAgICAnbGVhcm5lcl9wcmVmZXJlbmNlJzogdGhpcy5sZWFybmVyX3ByZWZlcmVuY2UsXG4gICAgICAnbG9jYXRpb24nOiB0aGlzLmxvY2F0aW9uLFxuICAgICAgJ21heF90aW1lX2FsbG93ZWQnOiB0aGlzLm1heF90aW1lX2FsbG93ZWQsXG4gICAgICAnbW9kZSc6IHRoaXMubW9kZSxcbiAgICAgICdvYmplY3RpdmVzJzogdGhpcy5vYmplY3RpdmVzLFxuICAgICAgJ3Byb2dyZXNzX21lYXN1cmUnOiB0aGlzLnByb2dyZXNzX21lYXN1cmUsXG4gICAgICAnc2NhbGVkX3Bhc3Npbmdfc2NvcmUnOiB0aGlzLnNjYWxlZF9wYXNzaW5nX3Njb3JlLFxuICAgICAgJ3Njb3JlJzogdGhpcy5zY29yZSxcbiAgICAgICdzZXNzaW9uX3RpbWUnOiB0aGlzLnNlc3Npb25fdGltZSxcbiAgICAgICdzdWNjZXNzX3N0YXR1cyc6IHRoaXMuc3VjY2Vzc19zdGF0dXMsXG4gICAgICAnc3VzcGVuZF9kYXRhJzogdGhpcy5zdXNwZW5kX2RhdGEsXG4gICAgICAndGltZV9saW1pdF9hY3Rpb24nOiB0aGlzLnRpbWVfbGltaXRfYWN0aW9uLFxuICAgICAgJ3RvdGFsX3RpbWUnOiB0aGlzLnRvdGFsX3RpbWUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgU0NPUk0gMjAwNCdzIGNtaS5sZWFybmVyX3ByZWZlcmVuY2Ugb2JqZWN0XG4gKi9cbmNsYXNzIENNSUxlYXJuZXJQcmVmZXJlbmNlIGV4dGVuZHMgQmFzZUNNSSB7XG4gICNfY2hpbGRyZW4gPSBjb25zdGFudHMuc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuO1xuICAjYXVkaW9fbGV2ZWwgPSAnMSc7XG4gICNsYW5ndWFnZSA9ICcnO1xuICAjZGVsaXZlcnlfc3BlZWQgPSAnMSc7XG4gICNhdWRpb19jYXB0aW9uaW5nID0gJzAnO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmxlYXJuZXJfcHJlZmVyZW5jZVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNfY2hpbGRyZW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IF9jaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI19jaGlsZHJlbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfY2hpbGRyZW5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldCBfY2hpbGRyZW4oX2NoaWxkcmVuKSB7XG4gICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjYXVkaW9fbGV2ZWxcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGF1ZGlvX2xldmVsKCkge1xuICAgIHJldHVybiB0aGlzLiNhdWRpb19sZXZlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNhdWRpb19sZXZlbFxuICAgKiBAcGFyYW0ge3N0cmluZ30gYXVkaW9fbGV2ZWxcbiAgICovXG4gIHNldCBhdWRpb19sZXZlbChhdWRpb19sZXZlbCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChhdWRpb19sZXZlbCwgcmVnZXguQ01JRGVjaW1hbCkgJiZcbiAgICAgICAgY2hlY2syMDA0VmFsaWRSYW5nZShhdWRpb19sZXZlbCwgcmVnZXguYXVkaW9fcmFuZ2UpKSB7XG4gICAgICB0aGlzLiNhdWRpb19sZXZlbCA9IGF1ZGlvX2xldmVsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsYW5ndWFnZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGFuZ3VhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xhbmd1YWdlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xhbmd1YWdlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsYW5ndWFnZVxuICAgKi9cbiAgc2V0IGxhbmd1YWdlKGxhbmd1YWdlKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGxhbmd1YWdlLCByZWdleC5DTUlMYW5nKSkge1xuICAgICAgdGhpcy4jbGFuZ3VhZ2UgPSBsYW5ndWFnZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZGVsaXZlcnlfc3BlZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGRlbGl2ZXJ5X3NwZWVkKCkge1xuICAgIHJldHVybiB0aGlzLiNkZWxpdmVyeV9zcGVlZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNkZWxpdmVyeV9zcGVlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGVsaXZlcnlfc3BlZWRcbiAgICovXG4gIHNldCBkZWxpdmVyeV9zcGVlZChkZWxpdmVyeV9zcGVlZCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChkZWxpdmVyeV9zcGVlZCwgcmVnZXguQ01JRGVjaW1hbCkgJiZcbiAgICAgICAgY2hlY2syMDA0VmFsaWRSYW5nZShkZWxpdmVyeV9zcGVlZCwgcmVnZXguc3BlZWRfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiNkZWxpdmVyeV9zcGVlZCA9IGRlbGl2ZXJ5X3NwZWVkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNhdWRpb19jYXB0aW9uaW5nXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBhdWRpb19jYXB0aW9uaW5nKCkge1xuICAgIHJldHVybiB0aGlzLiNhdWRpb19jYXB0aW9uaW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2F1ZGlvX2NhcHRpb25pbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IGF1ZGlvX2NhcHRpb25pbmdcbiAgICovXG4gIHNldCBhdWRpb19jYXB0aW9uaW5nKGF1ZGlvX2NhcHRpb25pbmcpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoYXVkaW9fY2FwdGlvbmluZywgcmVnZXguQ01JU0ludGVnZXIpICYmXG4gICAgICAgIGNoZWNrMjAwNFZhbGlkUmFuZ2UoYXVkaW9fY2FwdGlvbmluZywgcmVnZXgudGV4dF9yYW5nZSkpIHtcbiAgICAgIHRoaXMuI2F1ZGlvX2NhcHRpb25pbmcgPSBhdWRpb19jYXB0aW9uaW5nO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5sZWFybmVyX3ByZWZlcmVuY2VcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBhdWRpb19sZXZlbDogc3RyaW5nLFxuICAgKiAgICAgIGxhbmd1YWdlOiBzdHJpbmcsXG4gICAqICAgICAgZGVsaXZlcnlfc3BlZWQ6IHN0cmluZyxcbiAgICogICAgICBhdWRpb19jYXB0aW9uaW5nOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2F1ZGlvX2xldmVsJzogdGhpcy5hdWRpb19sZXZlbCxcbiAgICAgICdsYW5ndWFnZSc6IHRoaXMubGFuZ3VhZ2UsXG4gICAgICAnZGVsaXZlcnlfc3BlZWQnOiB0aGlzLmRlbGl2ZXJ5X3NwZWVkLFxuICAgICAgJ2F1ZGlvX2NhcHRpb25pbmcnOiB0aGlzLmF1ZGlvX2NhcHRpb25pbmcsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGNtaS5pbnRlcmFjdGlvbnMgb2JqZWN0XG4gKi9cbmNsYXNzIENNSUludGVyYWN0aW9ucyBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkub2JqZWN0aXZlcyBBcnJheVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe1xuICAgICAgY2hpbGRyZW46IGNvbnN0YW50cy5pbnRlcmFjdGlvbnNfY2hpbGRyZW4sXG4gICAgICBlcnJvckNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLm9iamVjdGl2ZXMgb2JqZWN0XG4gKi9cbmNsYXNzIENNSU9iamVjdGl2ZXMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLm9iamVjdGl2ZXMgQXJyYXlcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHtcbiAgICAgIGNoaWxkcmVuOiBjb25zdGFudHMub2JqZWN0aXZlc19jaGlsZHJlbixcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5ULFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDIwMDQncyBjbWkuY29tbWVudHNfZnJvbV9sbXMgb2JqZWN0XG4gKi9cbmNsYXNzIENNSUNvbW1lbnRzRnJvbUxNUyBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuY29tbWVudHNfZnJvbV9sbXMgQXJyYXlcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHtcbiAgICAgIGNoaWxkcmVuOiBjb25zdGFudHMuY29tbWVudHNfY2hpbGRyZW4sXG4gICAgICBlcnJvckNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmNvbW1lbnRzX2Zyb21fbGVhcm5lciBvYmplY3RcbiAqL1xuY2xhc3MgQ01JQ29tbWVudHNGcm9tTGVhcm5lciBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuY29tbWVudHNfZnJvbV9sZWFybmVyIEFycmF5XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogY29uc3RhbnRzLmNvbW1lbnRzX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgU0NPUk0gMjAwNCdzIGNtaS5pbnRlcmFjdGlvbi5uIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JSW50ZXJhY3Rpb25zT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNpZCA9ICcnO1xuICAjdHlwZSA9ICcnO1xuICAjdGltZXN0YW1wID0gJyc7XG4gICN3ZWlnaHRpbmcgPSAnJztcbiAgI2xlYXJuZXJfcmVzcG9uc2UgPSAnJztcbiAgI3Jlc3VsdCA9ICcnO1xuICAjbGF0ZW5jeSA9ICcnO1xuICAjZGVzY3JpcHRpb24gPSAnJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5pbnRlcmFjdGlvbi5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5vYmplY3RpdmVzID0gbmV3IENNSUFycmF5KHtcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5ULFxuICAgICAgY2hpbGRyZW46IGNvbnN0YW50cy5vYmplY3RpdmVzX2NoaWxkcmVuLFxuICAgIH0pO1xuICAgIHRoaXMuY29ycmVjdF9yZXNwb25zZXMgPSBuZXcgQ01JQXJyYXkoe1xuICAgICAgZXJyb3JDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQsXG4gICAgICBjaGlsZHJlbjogY29uc3RhbnRzLmNvcnJlY3RfcmVzcG9uc2VzX2NoaWxkcmVuLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLm9iamVjdGl2ZXM/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmNvcnJlY3RfcmVzcG9uc2VzPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLiNpZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNpZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICovXG4gIHNldCBpZChpZCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChpZCwgcmVnZXguQ01JTG9uZ0lkZW50aWZpZXIpKSB7XG4gICAgICB0aGlzLiNpZCA9IGlkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0eXBlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiB0aGlzLiN0eXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3R5cGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAgICovXG4gIHNldCB0eXBlKHR5cGUpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQodHlwZSwgcmVnZXguQ01JVHlwZSkpIHtcbiAgICAgIHRoaXMuI3R5cGUgPSB0eXBlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0aW1lc3RhbXBcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRpbWVzdGFtcCgpIHtcbiAgICByZXR1cm4gdGhpcy4jdGltZXN0YW1wO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpbWVzdGFtcFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZXN0YW1wXG4gICAqL1xuICBzZXQgdGltZXN0YW1wKHRpbWVzdGFtcCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdCh0aW1lc3RhbXAsIHJlZ2V4LkNNSVRpbWUpKSB7XG4gICAgICB0aGlzLiN0aW1lc3RhbXAgPSB0aW1lc3RhbXA7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3dlaWdodGluZ1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgd2VpZ2h0aW5nKCkge1xuICAgIHJldHVybiB0aGlzLiN3ZWlnaHRpbmc7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjd2VpZ2h0aW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB3ZWlnaHRpbmdcbiAgICovXG4gIHNldCB3ZWlnaHRpbmcod2VpZ2h0aW5nKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHdlaWdodGluZywgcmVnZXguQ01JRGVjaW1hbCkpIHtcbiAgICAgIHRoaXMuI3dlaWdodGluZyA9IHdlaWdodGluZztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGVhcm5lcl9yZXNwb25zZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVhcm5lcl9yZXNwb25zZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGVhcm5lcl9yZXNwb25zZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsZWFybmVyX3Jlc3BvbnNlLiBEb2VzIHR5cGUgdmFsaWRhdGlvbiB0byBtYWtlIHN1cmUgcmVzcG9uc2VcbiAgICogbWF0Y2hlcyBTQ09STSAyMDA0J3Mgc3BlY1xuICAgKiBAcGFyYW0ge3N0cmluZ30gbGVhcm5lcl9yZXNwb25zZVxuICAgKi9cbiAgc2V0IGxlYXJuZXJfcmVzcG9uc2UobGVhcm5lcl9yZXNwb25zZSkge1xuICAgIGlmICh0eXBlb2YgdGhpcy50eXBlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihcbiAgICAgICAgICBzY29ybTIwMDRfZXJyb3JfY29kZXMuREVQRU5ERU5DWV9OT1RfRVNUQUJMSVNIRUQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbm9kZXMgPSBbXTtcbiAgICAgIGNvbnN0IHJlc3BvbnNlX3R5cGUgPSBsZWFybmVyX3Jlc3BvbnNlc1t0aGlzLnR5cGVdO1xuICAgICAgaWYgKHJlc3BvbnNlX3R5cGUuZGVsaW1pdGVyICE9PSAnJykge1xuICAgICAgICBub2RlcyA9IGxlYXJuZXJfcmVzcG9uc2Uuc3BsaXQocmVzcG9uc2VfdHlwZS5kZWxpbWl0ZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9kZXNbMF0gPSBsZWFybmVyX3Jlc3BvbnNlO1xuICAgICAgfVxuXG4gICAgICBpZiAoKG5vZGVzLmxlbmd0aCA+IDApICYmIChub2Rlcy5sZW5ndGggPD0gcmVzcG9uc2VfdHlwZS5tYXgpKSB7XG4gICAgICAgIGNvbnN0IGZvcm1hdFJlZ2V4ID0gbmV3IFJlZ0V4cChyZXNwb25zZV90eXBlLmZvcm1hdCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAodHlwZW9mIHJlc3BvbnNlX3R5cGUuZGVsaW1pdGVyMiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlcyA9IG5vZGVzW2ldLnNwbGl0KHJlc3BvbnNlX3R5cGUuZGVsaW1pdGVyMik7XG4gICAgICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgICAgICBpZiAoIXZhbHVlc1swXS5tYXRjaChmb3JtYXRSZWdleCkpIHtcbiAgICAgICAgICAgICAgICB0aHJvd1R5cGVNaXNtYXRjaEVycm9yKCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKCF2YWx1ZXNbMV0ubWF0Y2gobmV3IFJlZ0V4cChyZXNwb25zZV90eXBlLmZvcm1hdDIpKSkge1xuICAgICAgICAgICAgICAgICAgdGhyb3dUeXBlTWlzbWF0Y2hFcnJvcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3dUeXBlTWlzbWF0Y2hFcnJvcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIW5vZGVzW2ldLm1hdGNoKGZvcm1hdFJlZ2V4KSkge1xuICAgICAgICAgICAgICB0aHJvd1R5cGVNaXNtYXRjaEVycm9yKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAobm9kZXNbaV0gIT09ICcnICYmIHJlc3BvbnNlX3R5cGUudW5pcXVlKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBpOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgIGlmIChub2Rlc1tpXSA9PT0gbm9kZXNbal0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3dUeXBlTWlzbWF0Y2hFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuR0VORVJBTF9TRVRfRkFJTFVSRSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3Jlc3VsdFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgcmVzdWx0KCkge1xuICAgIHJldHVybiB0aGlzLiNyZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcmVzdWx0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZXN1bHRcbiAgICovXG4gIHNldCByZXN1bHQocmVzdWx0KSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHJlc3VsdCwgcmVnZXguQ01JUmVzdWx0KSkge1xuICAgICAgdGhpcy4jcmVzdWx0ID0gcmVzdWx0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNsYXRlbmN5XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsYXRlbmN5KCkge1xuICAgIHJldHVybiB0aGlzLiNsYXRlbmN5O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xhdGVuY3lcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhdGVuY3lcbiAgICovXG4gIHNldCBsYXRlbmN5KGxhdGVuY3kpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQobGF0ZW5jeSwgcmVnZXguQ01JVGltZXNwYW4pKSB7XG4gICAgICB0aGlzLiNsYXRlbmN5ID0gbGF0ZW5jeTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZGVzY3JpcHRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGRlc2NyaXB0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNkZXNjcmlwdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNkZXNjcmlwdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGVzY3JpcHRpb25cbiAgICovXG4gIHNldCBkZXNjcmlwdGlvbihkZXNjcmlwdGlvbikge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChkZXNjcmlwdGlvbiwgcmVnZXguQ01JTGFuZ1N0cmluZzI1MCwgdHJ1ZSkpIHtcbiAgICAgIHRoaXMuI2Rlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmludGVyYWN0aW9ucy5uXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgaWQ6IHN0cmluZyxcbiAgICogICAgICB0eXBlOiBzdHJpbmcsXG4gICAqICAgICAgb2JqZWN0aXZlczogQ01JQXJyYXksXG4gICAqICAgICAgdGltZXN0YW1wOiBzdHJpbmcsXG4gICAqICAgICAgY29ycmVjdF9yZXNwb25zZXM6IENNSUFycmF5LFxuICAgKiAgICAgIHdlaWdodGluZzogc3RyaW5nLFxuICAgKiAgICAgIGxlYXJuZXJfcmVzcG9uc2U6IHN0cmluZyxcbiAgICogICAgICByZXN1bHQ6IHN0cmluZyxcbiAgICogICAgICBsYXRlbmN5OiBzdHJpbmcsXG4gICAqICAgICAgZGVzY3JpcHRpb246IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnaWQnOiB0aGlzLmlkLFxuICAgICAgJ3R5cGUnOiB0aGlzLnR5cGUsXG4gICAgICAnb2JqZWN0aXZlcyc6IHRoaXMub2JqZWN0aXZlcyxcbiAgICAgICd0aW1lc3RhbXAnOiB0aGlzLnRpbWVzdGFtcCxcbiAgICAgICd3ZWlnaHRpbmcnOiB0aGlzLndlaWdodGluZyxcbiAgICAgICdsZWFybmVyX3Jlc3BvbnNlJzogdGhpcy5sZWFybmVyX3Jlc3BvbnNlLFxuICAgICAgJ3Jlc3VsdCc6IHRoaXMucmVzdWx0LFxuICAgICAgJ2xhdGVuY3knOiB0aGlzLmxhdGVuY3ksXG4gICAgICAnZGVzY3JpcHRpb24nOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgJ2NvcnJlY3RfcmVzcG9uc2VzJzogdGhpcy5jb3JyZWN0X3Jlc3BvbnNlcyxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBTQ09STSAyMDA0J3MgY21pLm9iamVjdGl2ZXMubiBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSU9iamVjdGl2ZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI2lkID0gJyc7XG4gICNzdWNjZXNzX3N0YXR1cyA9ICd1bmtub3duJztcbiAgI2NvbXBsZXRpb25fc3RhdHVzID0gJ3Vua25vd24nO1xuICAjcHJvZ3Jlc3NfbWVhc3VyZSA9ICcnO1xuICAjZGVzY3JpcHRpb24gPSAnJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5vYmplY3RpdmVzLm5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnNjb3JlID0gbmV3IFNjb3JtMjAwNENNSVNjb3JlKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc2NvcmU/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNpZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGlkLCByZWdleC5DTUlMb25nSWRlbnRpZmllcikpIHtcbiAgICAgIHRoaXMuI2lkID0gaWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N1Y2Nlc3Nfc3RhdHVzXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdWNjZXNzX3N0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jc3VjY2Vzc19zdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3VjY2Vzc19zdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN1Y2Nlc3Nfc3RhdHVzXG4gICAqL1xuICBzZXQgc3VjY2Vzc19zdGF0dXMoc3VjY2Vzc19zdGF0dXMpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoc3VjY2Vzc19zdGF0dXMsIHJlZ2V4LkNNSVNTdGF0dXMpKSB7XG4gICAgICB0aGlzLiNzdWNjZXNzX3N0YXR1cyA9IHN1Y2Nlc3Nfc3RhdHVzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb21wbGV0aW9uX3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29tcGxldGlvbl9zdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbXBsZXRpb25fc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbXBsZXRpb25fc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21wbGV0aW9uX3N0YXR1c1xuICAgKi9cbiAgc2V0IGNvbXBsZXRpb25fc3RhdHVzKGNvbXBsZXRpb25fc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGNvbXBsZXRpb25fc3RhdHVzLCByZWdleC5DTUlDU3RhdHVzKSkge1xuICAgICAgdGhpcy4jY29tcGxldGlvbl9zdGF0dXMgPSBjb21wbGV0aW9uX3N0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjcHJvZ3Jlc3NfbWVhc3VyZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgcHJvZ3Jlc3NfbWVhc3VyZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jcHJvZ3Jlc3NfbWVhc3VyZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNwcm9ncmVzc19tZWFzdXJlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9ncmVzc19tZWFzdXJlXG4gICAqL1xuICBzZXQgcHJvZ3Jlc3NfbWVhc3VyZShwcm9ncmVzc19tZWFzdXJlKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHByb2dyZXNzX21lYXN1cmUsIHJlZ2V4LkNNSURlY2ltYWwpICYmXG4gICAgICAgIGNoZWNrMjAwNFZhbGlkUmFuZ2UocHJvZ3Jlc3NfbWVhc3VyZSwgcmVnZXgucHJvZ3Jlc3NfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiNwcm9ncmVzc19tZWFzdXJlID0gcHJvZ3Jlc3NfbWVhc3VyZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZGVzY3JpcHRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGRlc2NyaXB0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNkZXNjcmlwdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNkZXNjcmlwdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gZGVzY3JpcHRpb25cbiAgICovXG4gIHNldCBkZXNjcmlwdGlvbihkZXNjcmlwdGlvbikge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChkZXNjcmlwdGlvbiwgcmVnZXguQ01JTGFuZ1N0cmluZzI1MCwgdHJ1ZSkpIHtcbiAgICAgIHRoaXMuI2Rlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLm9iamVjdGl2ZXMublxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGlkOiBzdHJpbmcsXG4gICAqICAgICAgc3VjY2Vzc19zdGF0dXM6IHN0cmluZyxcbiAgICogICAgICBjb21wbGV0aW9uX3N0YXR1czogc3RyaW5nLFxuICAgKiAgICAgIHByb2dyZXNzX21lYXN1cmU6IHN0cmluZyxcbiAgICogICAgICBkZXNjcmlwdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIHNjb3JlOiBTY29ybTIwMDRDTUlTY29yZVxuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnaWQnOiB0aGlzLmlkLFxuICAgICAgJ3N1Y2Nlc3Nfc3RhdHVzJzogdGhpcy5zdWNjZXNzX3N0YXR1cyxcbiAgICAgICdjb21wbGV0aW9uX3N0YXR1cyc6IHRoaXMuY29tcGxldGlvbl9zdGF0dXMsXG4gICAgICAncHJvZ3Jlc3NfbWVhc3VyZSc6IHRoaXMucHJvZ3Jlc3NfbWVhc3VyZSxcbiAgICAgICdkZXNjcmlwdGlvbic6IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICAnc2NvcmUnOiB0aGlzLnNjb3JlLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIFNDT1JNIDIwMDQncyBjbWkgKi5zY29yZSBvYmplY3RcbiAqL1xuY2xhc3MgU2Nvcm0yMDA0Q01JU2NvcmUgZXh0ZW5kcyBDTUlTY29yZSB7XG4gICNzY2FsZWQgPSAnJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaSAqLnNjb3JlXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihcbiAgICAgICAge1xuICAgICAgICAgIHNjb3JlX2NoaWxkcmVuOiBjb25zdGFudHMuc2NvcmVfY2hpbGRyZW4sXG4gICAgICAgICAgbWF4OiAnJyxcbiAgICAgICAgICBpbnZhbGlkRXJyb3JDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQsXG4gICAgICAgICAgaW52YWxpZFR5cGVDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCxcbiAgICAgICAgICBpbnZhbGlkUmFuZ2VDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFLFxuICAgICAgICAgIGRlY2ltYWxSZWdleDogc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwsXG4gICAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3NjYWxlZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc2NhbGVkKCkge1xuICAgIHJldHVybiB0aGlzLiNzY2FsZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc2NhbGVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY2FsZWRcbiAgICovXG4gIHNldCBzY2FsZWQoc2NhbGVkKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHNjYWxlZCwgcmVnZXguQ01JRGVjaW1hbCkgJiZcbiAgICAgICAgY2hlY2syMDA0VmFsaWRSYW5nZShzY2FsZWQsIHJlZ2V4LnNjYWxlZF9yYW5nZSkpIHtcbiAgICAgIHRoaXMuI3NjYWxlZCA9IHNjYWxlZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkgKi5zY29yZVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHNjYWxlZDogc3RyaW5nLFxuICAgKiAgICAgIHJhdzogc3RyaW5nLFxuICAgKiAgICAgIG1pbjogc3RyaW5nLFxuICAgKiAgICAgIG1heDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdzY2FsZWQnOiB0aGlzLnNjYWxlZCxcbiAgICAgICdyYXcnOiBzdXBlci5yYXcsXG4gICAgICAnbWluJzogc3VwZXIubWluLFxuICAgICAgJ21heCc6IHN1cGVyLm1heCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmNvbW1lbnRzX2Zyb21fbGVhcm5lci5uIGFuZCBjbWkuY29tbWVudHNfZnJvbV9sbXMubiBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUNvbW1lbnRzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNjb21tZW50ID0gJyc7XG4gICNsb2NhdGlvbiA9ICcnO1xuICAjdGltZXN0YW1wID0gJyc7XG4gICNyZWFkT25seUFmdGVySW5pdDtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5jb21tZW50c19mcm9tX2xlYXJuZXIubiBhbmQgY21pLmNvbW1lbnRzX2Zyb21fbG1zLm5cbiAgICogQHBhcmFtIHtib29sZWFufSByZWFkT25seUFmdGVySW5pdFxuICAgKi9cbiAgY29uc3RydWN0b3IocmVhZE9ubHlBZnRlckluaXQgPSBmYWxzZSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy4jY29tbWVudCA9ICcnO1xuICAgIHRoaXMuI2xvY2F0aW9uID0gJyc7XG4gICAgdGhpcy4jdGltZXN0YW1wID0gJyc7XG4gICAgdGhpcy4jcmVhZE9ubHlBZnRlckluaXQgPSByZWFkT25seUFmdGVySW5pdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb21tZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb21tZW50KCkge1xuICAgIHJldHVybiB0aGlzLiNjb21tZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbW1lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbW1lbnRcbiAgICovXG4gIHNldCBjb21tZW50KGNvbW1lbnQpIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNyZWFkT25seUFmdGVySW5pdCkge1xuICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChjb21tZW50LCByZWdleC5DTUlMYW5nU3RyaW5nNDAwMCwgdHJ1ZSkpIHtcbiAgICAgICAgdGhpcy4jY29tbWVudCA9IGNvbW1lbnQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xvY2F0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsb2NhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jbG9jYXRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbG9jYXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uXG4gICAqL1xuICBzZXQgbG9jYXRpb24obG9jYXRpb24pIHtcbiAgICBpZiAodGhpcy5pbml0aWFsaXplZCAmJiB0aGlzLiNyZWFkT25seUFmdGVySW5pdCkge1xuICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChsb2NhdGlvbiwgcmVnZXguQ01JU3RyaW5nMjUwKSkge1xuICAgICAgICB0aGlzLiNsb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN0aW1lc3RhbXBcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRpbWVzdGFtcCgpIHtcbiAgICByZXR1cm4gdGhpcy4jdGltZXN0YW1wO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3RpbWVzdGFtcFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZXN0YW1wXG4gICAqL1xuICBzZXQgdGltZXN0YW1wKHRpbWVzdGFtcCkge1xuICAgIGlmICh0aGlzLmluaXRpYWxpemVkICYmIHRoaXMuI3JlYWRPbmx5QWZ0ZXJJbml0KSB7XG4gICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHRpbWVzdGFtcCwgcmVnZXguQ01JVGltZSkpIHtcbiAgICAgICAgdGhpcy4jdGltZXN0YW1wID0gdGltZXN0YW1wO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5jb21tZW50c19mcm9tX2xlYXJuZXIubiBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBjb21tZW50OiBzdHJpbmcsXG4gICAqICAgICAgbG9jYXRpb246IHN0cmluZyxcbiAgICogICAgICB0aW1lc3RhbXA6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnY29tbWVudCc6IHRoaXMuY29tbWVudCxcbiAgICAgICdsb2NhdGlvbic6IHRoaXMubG9jYXRpb24sXG4gICAgICAndGltZXN0YW1wJzogdGhpcy50aW1lc3RhbXAsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGNtaS5pbnRlcmFjdGlvbnMubi5vYmplY3RpdmVzLm4gb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlJbnRlcmFjdGlvbnNPYmplY3RpdmVzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNpZCA9ICcnO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmludGVyYWN0aW9ucy5uLm9iamVjdGl2ZXMublxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNpZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGlkLCByZWdleC5DTUlMb25nSWRlbnRpZmllcikpIHtcbiAgICAgIHRoaXMuI2lkID0gaWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmludGVyYWN0aW9ucy5uLm9iamVjdGl2ZXMublxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGlkOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmludGVyYWN0aW9ucy5uLmNvcnJlY3RfcmVzcG9uc2VzLm4gb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlJbnRlcmFjdGlvbnNDb3JyZWN0UmVzcG9uc2VzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNwYXR0ZXJuID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4uY29ycmVjdF9yZXNwb25zZXMublxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNwYXR0ZXJuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBwYXR0ZXJuKCkge1xuICAgIHJldHVybiB0aGlzLiNwYXR0ZXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3BhdHRlcm5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdHRlcm5cbiAgICovXG4gIHNldCBwYXR0ZXJuKHBhdHRlcm4pIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQocGF0dGVybiwgcmVnZXguQ01JRmVlZGJhY2spKSB7XG4gICAgICB0aGlzLiNwYXR0ZXJuID0gcGF0dGVybjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGNtaS5pbnRlcmFjdGlvbnMubi5jb3JyZWN0X3Jlc3BvbnNlcy5uIG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHBhdHRlcm46IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAncGF0dGVybic6IHRoaXMucGF0dGVybixcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgYWRsIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQURMIGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgYWRsXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5uYXYgPSBuZXcgQURMTmF2KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMubmF2Py5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBhZGxcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBuYXY6IHtcbiAgICogICAgICAgIHJlcXVlc3Q6IHN0cmluZ1xuICAgKiAgICAgIH1cbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ25hdic6IHRoaXMubmF2LFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDIwMDQncyBhZGwubmF2IG9iamVjdFxuICovXG5jbGFzcyBBRExOYXYgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI3JlcXVlc3QgPSAnX25vbmVfJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGFkbC5uYXZcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnJlcXVlc3RfdmFsaWQgPSBuZXcgQURMTmF2UmVxdWVzdFZhbGlkKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMucmVxdWVzdF92YWxpZD8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3JlcXVlc3RcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHJlcXVlc3QoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3JlcXVlc3Q7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcmVxdWVzdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVxdWVzdFxuICAgKi9cbiAgc2V0IHJlcXVlc3QocmVxdWVzdCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChyZXF1ZXN0LCByZWdleC5OQVZFdmVudCkpIHtcbiAgICAgIHRoaXMuI3JlcXVlc3QgPSByZXF1ZXN0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGFkbC5uYXZcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICByZXF1ZXN0OiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3JlcXVlc3QnOiB0aGlzLnJlcXVlc3QsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGFkbC5uYXYucmVxdWVzdF92YWxpZCBvYmplY3RcbiAqL1xuY2xhc3MgQURMTmF2UmVxdWVzdFZhbGlkIGV4dGVuZHMgQmFzZUNNSSB7XG4gICNjb250aW51ZSA9ICd1bmtub3duJztcbiAgI3ByZXZpb3VzID0gJ3Vua25vd24nO1xuICBjaG9pY2UgPSBjbGFzcyB7XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGFyZ2V0IGlzIHZhbGlkXG4gICAgICogQHBhcmFtIHsqfSBfdGFyZ2V0XG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIF9pc1RhcmdldFZhbGlkID0gKF90YXJnZXQpID0+ICd1bmtub3duJztcbiAgfTtcbiAganVtcCA9IGNsYXNzIHtcbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0YXJnZXQgaXMgdmFsaWRcbiAgICAgKiBAcGFyYW0geyp9IF90YXJnZXRcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgX2lzVGFyZ2V0VmFsaWQgPSAoX3RhcmdldCkgPT4gJ3Vua25vd24nO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgYWRsLm5hdi5yZXF1ZXN0X3ZhbGlkXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NvbnRpbnVlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb250aW51ZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jY29udGludWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29udGludWUuIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0geyp9IF9cbiAgICovXG4gIHNldCBjb250aW51ZShfKSB7XG4gICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjcHJldmlvdXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHByZXZpb3VzKCkge1xuICAgIHJldHVybiB0aGlzLiNwcmV2aW91cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNwcmV2aW91cy4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7Kn0gX1xuICAgKi9cbiAgc2V0IHByZXZpb3VzKF8pIHtcbiAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGFkbC5uYXYucmVxdWVzdF92YWxpZFxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHByZXZpb3VzOiBzdHJpbmcsXG4gICAqICAgICAgY29udGludWU6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAncHJldmlvdXMnOiB0aGlzLnByZXZpb3VzLFxuICAgICAgJ2NvbnRpbnVlJzogdGhpcy5jb250aW51ZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIiwiLy8gQGZsb3dcblxuZXhwb3J0IGNvbnN0IGdsb2JhbF9jb25zdGFudHMgPSB7XG4gIFNDT1JNX1RSVUU6ICd0cnVlJyxcbiAgU0NPUk1fRkFMU0U6ICdmYWxzZScsXG4gIFNUQVRFX05PVF9JTklUSUFMSVpFRDogMCxcbiAgU1RBVEVfSU5JVElBTElaRUQ6IDEsXG4gIFNUQVRFX1RFUk1JTkFURUQ6IDIsXG4gIExPR19MRVZFTF9ERUJVRzogMSxcbiAgTE9HX0xFVkVMX0lORk86IDIsXG4gIExPR19MRVZFTF9XQVJOSU5HOiAzLFxuICBMT0dfTEVWRUxfRVJST1I6IDQsXG4gIExPR19MRVZFTF9OT05FOiA1LFxufTtcblxuZXhwb3J0IGNvbnN0IHNjb3JtMTJfY29uc3RhbnRzID0ge1xuICAvLyBDaGlsZHJlbiBsaXN0c1xuICBjbWlfY2hpbGRyZW46ICdjb3JlLHN1c3BlbmRfZGF0YSxsYXVuY2hfZGF0YSxjb21tZW50cyxvYmplY3RpdmVzLHN0dWRlbnRfZGF0YSxzdHVkZW50X3ByZWZlcmVuY2UsaW50ZXJhY3Rpb25zJyxcbiAgY29yZV9jaGlsZHJlbjogJ3N0dWRlbnRfaWQsc3R1ZGVudF9uYW1lLGxlc3Nvbl9sb2NhdGlvbixjcmVkaXQsbGVzc29uX3N0YXR1cyxlbnRyeSxzY29yZSx0b3RhbF90aW1lLGxlc3Nvbl9tb2RlLGV4aXQsc2Vzc2lvbl90aW1lJyxcbiAgc2NvcmVfY2hpbGRyZW46ICdyYXcsbWluLG1heCcsXG4gIGNvbW1lbnRzX2NoaWxkcmVuOiAnY29udGVudCxsb2NhdGlvbix0aW1lJyxcbiAgb2JqZWN0aXZlc19jaGlsZHJlbjogJ2lkLHNjb3JlLHN0YXR1cycsXG4gIGNvcnJlY3RfcmVzcG9uc2VzX2NoaWxkcmVuOiAncGF0dGVybicsXG4gIHN0dWRlbnRfZGF0YV9jaGlsZHJlbjogJ21hc3Rlcnlfc2NvcmUsbWF4X3RpbWVfYWxsb3dlZCx0aW1lX2xpbWl0X2FjdGlvbicsXG4gIHN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbjogJ2F1ZGlvLGxhbmd1YWdlLHNwZWVkLHRleHQnLFxuICBpbnRlcmFjdGlvbnNfY2hpbGRyZW46ICdpZCxvYmplY3RpdmVzLHRpbWUsdHlwZSxjb3JyZWN0X3Jlc3BvbnNlcyx3ZWlnaHRpbmcsc3R1ZGVudF9yZXNwb25zZSxyZXN1bHQsbGF0ZW5jeScsXG5cbiAgZXJyb3JfZGVzY3JpcHRpb25zOiB7XG4gICAgJzEwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgRXhjZXB0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdObyBzcGVjaWZpYyBlcnJvciBjb2RlIGV4aXN0cyB0byBkZXNjcmliZSB0aGUgZXJyb3IuIFVzZSBMTVNHZXREaWFnbm9zdGljIGZvciBtb3JlIGluZm9ybWF0aW9uJyxcbiAgICB9LFxuICAgICcyMDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdJbnZhbGlkIGFyZ3VtZW50IGVycm9yJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgdGhhdCBhbiBhcmd1bWVudCByZXByZXNlbnRzIGFuIGludmFsaWQgZGF0YSBtb2RlbCBlbGVtZW50IG9yIGlzIG90aGVyd2lzZSBpbmNvcnJlY3QuJyxcbiAgICB9LFxuICAgICcyMDInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdFbGVtZW50IGNhbm5vdCBoYXZlIGNoaWxkcmVuJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgdGhhdCBMTVNHZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSBkYXRhIG1vZGVsIGVsZW1lbnQgbmFtZSB0aGF0IGVuZHMgaW4gXCJfY2hpbGRyZW5cIiBmb3IgYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBkb2VzIG5vdCBzdXBwb3J0IHRoZSBcIl9jaGlsZHJlblwiIHN1ZmZpeC4nLFxuICAgIH0sXG4gICAgJzIwMyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0VsZW1lbnQgbm90IGFuIGFycmF5IC0gY2Fubm90IGhhdmUgY291bnQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyB0aGF0IExNU0dldFZhbHVlIHdhcyBjYWxsZWQgd2l0aCBhIGRhdGEgbW9kZWwgZWxlbWVudCBuYW1lIHRoYXQgZW5kcyBpbiBcIl9jb3VudFwiIGZvciBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IGRvZXMgbm90IHN1cHBvcnQgdGhlIFwiX2NvdW50XCIgc3VmZml4LicsXG4gICAgfSxcbiAgICAnMzAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnTm90IGluaXRpYWxpemVkJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgdGhhdCBhbiBBUEkgY2FsbCB3YXMgbWFkZSBiZWZvcmUgdGhlIGNhbGwgdG8gbG1zSW5pdGlhbGl6ZS4nLFxuICAgIH0sXG4gICAgJzQwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ05vdCBpbXBsZW1lbnRlZCBlcnJvcicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnVGhlIGRhdGEgbW9kZWwgZWxlbWVudCBpbmRpY2F0ZWQgaW4gYSBjYWxsIHRvIExNU0dldFZhbHVlIG9yIExNU1NldFZhbHVlIGlzIHZhbGlkLCBidXQgd2FzIG5vdCBpbXBsZW1lbnRlZCBieSB0aGlzIExNUy4gU0NPUk0gMS4yIGRlZmluZXMgYSBzZXQgb2YgZGF0YSBtb2RlbCBlbGVtZW50cyBhcyBiZWluZyBvcHRpb25hbCBmb3IgYW4gTE1TIHRvIGltcGxlbWVudC4nLFxuICAgIH0sXG4gICAgJzQwMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0ludmFsaWQgc2V0IHZhbHVlLCBlbGVtZW50IGlzIGEga2V5d29yZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIHRoYXQgTE1TU2V0VmFsdWUgd2FzIGNhbGxlZCBvbiBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IHJlcHJlc2VudHMgYSBrZXl3b3JkIChlbGVtZW50cyB0aGF0IGVuZCBpbiBcIl9jaGlsZHJlblwiIGFuZCBcIl9jb3VudFwiKS4nLFxuICAgIH0sXG4gICAgJzQwMyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0VsZW1lbnQgaXMgcmVhZCBvbmx5JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdMTVNTZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBjYW4gb25seSBiZSByZWFkLicsXG4gICAgfSxcbiAgICAnNDA0Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRWxlbWVudCBpcyB3cml0ZSBvbmx5JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdMTVNHZXRWYWx1ZSB3YXMgY2FsbGVkIG9uIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgY2FuIG9ubHkgYmUgd3JpdHRlbiB0by4nLFxuICAgIH0sXG4gICAgJzQwNSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0luY29ycmVjdCBEYXRhIFR5cGUnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0xNU1NldFZhbHVlIHdhcyBjYWxsZWQgd2l0aCBhIHZhbHVlIHRoYXQgaXMgbm90IGNvbnNpc3RlbnQgd2l0aCB0aGUgZGF0YSBmb3JtYXQgb2YgdGhlIHN1cHBsaWVkIGRhdGEgbW9kZWwgZWxlbWVudC4nLFxuICAgIH0sXG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3QgYWljY19jb25zdGFudHMgPSB7XG4gIC4uLnNjb3JtMTJfY29uc3RhbnRzLCAuLi57XG4gICAgY21pX2NoaWxkcmVuOiAnY29yZSxzdXNwZW5kX2RhdGEsbGF1bmNoX2RhdGEsY29tbWVudHMsb2JqZWN0aXZlcyxzdHVkZW50X2RhdGEsc3R1ZGVudF9wcmVmZXJlbmNlLGludGVyYWN0aW9ucyxldmFsdWF0aW9uJyxcbiAgICBzdHVkZW50X2RhdGFfY2hpbGRyZW46ICdhdHRlbXB0X251bWJlcix0cmllcyxtYXN0ZXJ5X3Njb3JlLG1heF90aW1lX2FsbG93ZWQsdGltZV9saW1pdF9hY3Rpb24nLFxuICAgIHRyaWVzX2NoaWxkcmVuOiAndGltZSxzdGF0dXMsc2NvcmUnLFxuICB9LFxufTtcblxuZXhwb3J0IGNvbnN0IHNjb3JtMjAwNF9jb25zdGFudHMgPSB7XG4gIC8vIENoaWxkcmVuIGxpc3RzXG4gIGNtaV9jaGlsZHJlbjogJ192ZXJzaW9uLGNvbW1lbnRzX2Zyb21fbGVhcm5lcixjb21tZW50c19mcm9tX2xtcyxjb21wbGV0aW9uX3N0YXR1cyxjcmVkaXQsZW50cnksZXhpdCxpbnRlcmFjdGlvbnMsbGF1bmNoX2RhdGEsbGVhcm5lcl9pZCxsZWFybmVyX25hbWUsbGVhcm5lcl9wcmVmZXJlbmNlLGxvY2F0aW9uLG1heF90aW1lX2FsbG93ZWQsbW9kZSxvYmplY3RpdmVzLHByb2dyZXNzX21lYXN1cmUsc2NhbGVkX3Bhc3Npbmdfc2NvcmUsc2NvcmUsc2Vzc2lvbl90aW1lLHN1Y2Nlc3Nfc3RhdHVzLHN1c3BlbmRfZGF0YSx0aW1lX2xpbWl0X2FjdGlvbix0b3RhbF90aW1lJyxcbiAgY29tbWVudHNfY2hpbGRyZW46ICdjb21tZW50LHRpbWVzdGFtcCxsb2NhdGlvbicsXG4gIHNjb3JlX2NoaWxkcmVuOiAnbWF4LHJhdyxzY2FsZWQsbWluJyxcbiAgb2JqZWN0aXZlc19jaGlsZHJlbjogJ3Byb2dyZXNzX21lYXN1cmUsY29tcGxldGlvbl9zdGF0dXMsc3VjY2Vzc19zdGF0dXMsZGVzY3JpcHRpb24sc2NvcmUsaWQnLFxuICBjb3JyZWN0X3Jlc3BvbnNlc19jaGlsZHJlbjogJ3BhdHRlcm4nLFxuICBzdHVkZW50X2RhdGFfY2hpbGRyZW46ICdtYXN0ZXJ5X3Njb3JlLG1heF90aW1lX2FsbG93ZWQsdGltZV9saW1pdF9hY3Rpb24nLFxuICBzdHVkZW50X3ByZWZlcmVuY2VfY2hpbGRyZW46ICdhdWRpb19sZXZlbCxhdWRpb19jYXB0aW9uaW5nLGRlbGl2ZXJ5X3NwZWVkLGxhbmd1YWdlJyxcbiAgaW50ZXJhY3Rpb25zX2NoaWxkcmVuOiAnaWQsdHlwZSxvYmplY3RpdmVzLHRpbWVzdGFtcCxjb3JyZWN0X3Jlc3BvbnNlcyx3ZWlnaHRpbmcsbGVhcm5lcl9yZXNwb25zZSxyZXN1bHQsbGF0ZW5jeSxkZXNjcmlwdGlvbicsXG5cbiAgZXJyb3JfZGVzY3JpcHRpb25zOiB7XG4gICAgJzAnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdObyBFcnJvcicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTm8gZXJyb3Igb2NjdXJyZWQsIHRoZSBwcmV2aW91cyBBUEkgY2FsbCB3YXMgc3VjY2Vzc2Z1bC4nLFxuICAgIH0sXG4gICAgJzEwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgRXhjZXB0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdObyBzcGVjaWZpYyBlcnJvciBjb2RlIGV4aXN0cyB0byBkZXNjcmliZSB0aGUgZXJyb3IuIFVzZSBHZXREaWFnbm9zdGljIGZvciBtb3JlIGluZm9ybWF0aW9uLicsXG4gICAgfSxcbiAgICAnMTAyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBJbml0aWFsaXphdGlvbiBGYWlsdXJlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIEluaXRpYWxpemUgZmFpbGVkIGZvciBhbiB1bmtub3duIHJlYXNvbi4nLFxuICAgIH0sXG4gICAgJzEwMyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0FscmVhZHkgSW5pdGlhbGl6ZWQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gSW5pdGlhbGl6ZSBmYWlsZWQgYmVjYXVzZSBJbml0aWFsaXplIHdhcyBhbHJlYWR5IGNhbGxlZC4nLFxuICAgIH0sXG4gICAgJzEwNCc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0NvbnRlbnQgSW5zdGFuY2UgVGVybWluYXRlZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBJbml0aWFsaXplIGZhaWxlZCBiZWNhdXNlIFRlcm1pbmF0ZSB3YXMgYWxyZWFkeSBjYWxsZWQuJyxcbiAgICB9LFxuICAgICcxMTEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIFRlcm1pbmF0aW9uIEZhaWx1cmUnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gVGVybWluYXRlIGZhaWxlZCBmb3IgYW4gdW5rbm93biByZWFzb24uJyxcbiAgICB9LFxuICAgICcxMTInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdUZXJtaW5hdGlvbiBCZWZvcmUgSW5pdGlhbGl6YXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gVGVybWluYXRlIGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGJlZm9yZSB0aGUgY2FsbCB0byBJbml0aWFsaXplLicsXG4gICAgfSxcbiAgICAnMTEzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnVGVybWluYXRpb24gQWZ0ZXIgVGVybWluYXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gVGVybWluYXRlIGZhaWxlZCBiZWNhdXNlIFRlcm1pbmF0ZSB3YXMgYWxyZWFkeSBjYWxsZWQuJyxcbiAgICB9LFxuICAgICcxMjInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdSZXRyaWV2ZSBEYXRhIEJlZm9yZSBJbml0aWFsaXphdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBHZXRWYWx1ZSBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBiZWZvcmUgdGhlIGNhbGwgdG8gSW5pdGlhbGl6ZS4nLFxuICAgIH0sXG4gICAgJzEyMyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1JldHJpZXZlIERhdGEgQWZ0ZXIgVGVybWluYXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gR2V0VmFsdWUgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYWZ0ZXIgdGhlIGNhbGwgdG8gVGVybWluYXRlLicsXG4gICAgfSxcbiAgICAnMTMyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnU3RvcmUgRGF0YSBCZWZvcmUgSW5pdGlhbGl6YXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gU2V0VmFsdWUgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYmVmb3JlIHRoZSBjYWxsIHRvIEluaXRpYWxpemUuJyxcbiAgICB9LFxuICAgICcxMzMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdTdG9yZSBEYXRhIEFmdGVyIFRlcm1pbmF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIFNldFZhbHVlIGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGFmdGVyIHRoZSBjYWxsIHRvIFRlcm1pbmF0ZS4nLFxuICAgIH0sXG4gICAgJzE0Mic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0NvbW1pdCBCZWZvcmUgSW5pdGlhbGl6YXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gQ29tbWl0IGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGJlZm9yZSB0aGUgY2FsbCB0byBJbml0aWFsaXplLicsXG4gICAgfSxcbiAgICAnMTQzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnQ29tbWl0IEFmdGVyIFRlcm1pbmF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIENvbW1pdCBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBhZnRlciB0aGUgY2FsbCB0byBUZXJtaW5hdGUuJyxcbiAgICB9LFxuICAgICcyMDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIEFyZ3VtZW50IEVycm9yJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdBbiBpbnZhbGlkIGFyZ3VtZW50IHdhcyBwYXNzZWQgdG8gYW4gQVBJIG1ldGhvZCAodXN1YWxseSBpbmRpY2F0ZXMgdGhhdCBJbml0aWFsaXplLCBDb21taXQgb3IgVGVybWluYXRlIGRpZCBub3QgcmVjZWl2ZSB0aGUgZXhwZWN0ZWQgZW1wdHkgc3RyaW5nIGFyZ3VtZW50LicsXG4gICAgfSxcbiAgICAnMzAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBHZXQgRmFpbHVyZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIGEgZmFpbGVkIEdldFZhbHVlIGNhbGwgd2hlcmUgbm8gb3RoZXIgc3BlY2lmaWMgZXJyb3IgY29kZSBpcyBhcHBsaWNhYmxlLiBVc2UgR2V0RGlhZ25vc3RpYyBmb3IgbW9yZSBpbmZvcm1hdGlvbi4nLFxuICAgIH0sXG4gICAgJzM1MSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgU2V0IEZhaWx1cmUnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyBhIGZhaWxlZCBTZXRWYWx1ZSBjYWxsIHdoZXJlIG5vIG90aGVyIHNwZWNpZmljIGVycm9yIGNvZGUgaXMgYXBwbGljYWJsZS4gVXNlIEdldERpYWdub3N0aWMgZm9yIG1vcmUgaW5mb3JtYXRpb24uJyxcbiAgICB9LFxuICAgICczOTEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIENvbW1pdCBGYWlsdXJlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgYSBmYWlsZWQgQ29tbWl0IGNhbGwgd2hlcmUgbm8gb3RoZXIgc3BlY2lmaWMgZXJyb3IgY29kZSBpcyBhcHBsaWNhYmxlLiBVc2UgR2V0RGlhZ25vc3RpYyBmb3IgbW9yZSBpbmZvcm1hdGlvbi4nLFxuICAgIH0sXG4gICAgJzQwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1VuZGVmaW5lZCBEYXRhIE1vZGVsIEVsZW1lbnQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1RoZSBkYXRhIG1vZGVsIGVsZW1lbnQgbmFtZSBwYXNzZWQgdG8gR2V0VmFsdWUgb3IgU2V0VmFsdWUgaXMgbm90IGEgdmFsaWQgU0NPUk0gZGF0YSBtb2RlbCBlbGVtZW50LicsXG4gICAgfSxcbiAgICAnNDAyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnVW5pbXBsZW1lbnRlZCBEYXRhIE1vZGVsIEVsZW1lbnQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1RoZSBkYXRhIG1vZGVsIGVsZW1lbnQgaW5kaWNhdGVkIGluIGEgY2FsbCB0byBHZXRWYWx1ZSBvciBTZXRWYWx1ZSBpcyB2YWxpZCwgYnV0IHdhcyBub3QgaW1wbGVtZW50ZWQgYnkgdGhpcyBMTVMuIEluIFNDT1JNIDIwMDQsIHRoaXMgZXJyb3Igd291bGQgaW5kaWNhdGUgYW4gTE1TIHRoYXQgaXMgbm90IGZ1bGx5IFNDT1JNIGNvbmZvcm1hbnQuJyxcbiAgICB9LFxuICAgICc0MDMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdEYXRhIE1vZGVsIEVsZW1lbnQgVmFsdWUgTm90IEluaXRpYWxpemVkJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdBdHRlbXB0IHRvIHJlYWQgYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBoYXMgbm90IGJlZW4gaW5pdGlhbGl6ZWQgYnkgdGhlIExNUyBvciB0aHJvdWdoIGEgU2V0VmFsdWUgY2FsbC4gVGhpcyBlcnJvciBjb25kaXRpb24gaXMgb2Z0ZW4gcmVhY2hlZCBkdXJpbmcgbm9ybWFsIGV4ZWN1dGlvbiBvZiBhIFNDTy4nLFxuICAgIH0sXG4gICAgJzQwNCc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0RhdGEgTW9kZWwgRWxlbWVudCBJcyBSZWFkIE9ubHknLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1NldFZhbHVlIHdhcyBjYWxsZWQgd2l0aCBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IGNhbiBvbmx5IGJlIHJlYWQuJyxcbiAgICB9LFxuICAgICc0MDUnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdEYXRhIE1vZGVsIEVsZW1lbnQgSXMgV3JpdGUgT25seScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnR2V0VmFsdWUgd2FzIGNhbGxlZCBvbiBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IGNhbiBvbmx5IGJlIHdyaXR0ZW4gdG8uJyxcbiAgICB9LFxuICAgICc0MDYnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdEYXRhIE1vZGVsIEVsZW1lbnQgVHlwZSBNaXNtYXRjaCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnU2V0VmFsdWUgd2FzIGNhbGxlZCB3aXRoIGEgdmFsdWUgdGhhdCBpcyBub3QgY29uc2lzdGVudCB3aXRoIHRoZSBkYXRhIGZvcm1hdCBvZiB0aGUgc3VwcGxpZWQgZGF0YSBtb2RlbCBlbGVtZW50LicsXG4gICAgfSxcbiAgICAnNDA3Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBFbGVtZW50IFZhbHVlIE91dCBPZiBSYW5nZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnVGhlIG51bWVyaWMgdmFsdWUgc3VwcGxpZWQgdG8gYSBTZXRWYWx1ZSBjYWxsIGlzIG91dHNpZGUgb2YgdGhlIG51bWVyaWMgcmFuZ2UgYWxsb3dlZCBmb3IgdGhlIHN1cHBsaWVkIGRhdGEgbW9kZWwgZWxlbWVudC4nLFxuICAgIH0sXG4gICAgJzQwOCc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0RhdGEgTW9kZWwgRGVwZW5kZW5jeSBOb3QgRXN0YWJsaXNoZWQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1NvbWUgZGF0YSBtb2RlbCBlbGVtZW50cyBjYW5ub3QgYmUgc2V0IHVudGlsIGFub3RoZXIgZGF0YSBtb2RlbCBlbGVtZW50IHdhcyBzZXQuIFRoaXMgZXJyb3IgY29uZGl0aW9uIGluZGljYXRlcyB0aGF0IHRoZSBwcmVyZXF1aXNpdGUgZWxlbWVudCB3YXMgbm90IHNldCBiZWZvcmUgdGhlIGRlcGVuZGVudCBlbGVtZW50LicsXG4gICAgfSxcbiAgfSxcbn07XG4iLCIvLyBAZmxvd1xuZXhwb3J0IGNvbnN0IGVycm9yX2NvZGVzID0ge1xuICBHRU5FUkFMOiAxMDEsXG4gIElOSVRJQUxJWkFUSU9OX0ZBSUxFRDogMTAxLFxuICBJTklUSUFMSVpFRDogMTAxLFxuICBURVJNSU5BVEVEOiAxMDEsXG4gIFRFUk1JTkFUSU9OX0ZBSUxVUkU6IDEwMSxcbiAgVEVSTUlOQVRJT05fQkVGT1JFX0lOSVQ6IDEwMSxcbiAgTVVMVElQTEVfVEVSTUlOQVRJT046IDEwMSxcbiAgUkVUUklFVkVfQkVGT1JFX0lOSVQ6IDEwMSxcbiAgUkVUUklFVkVfQUZURVJfVEVSTTogMTAxLFxuICBTVE9SRV9CRUZPUkVfSU5JVDogMTAxLFxuICBTVE9SRV9BRlRFUl9URVJNOiAxMDEsXG4gIENPTU1JVF9CRUZPUkVfSU5JVDogMTAxLFxuICBDT01NSVRfQUZURVJfVEVSTTogMTAxLFxuICBBUkdVTUVOVF9FUlJPUjogMTAxLFxuICBDSElMRFJFTl9FUlJPUjogMTAxLFxuICBDT1VOVF9FUlJPUjogMTAxLFxuICBHRU5FUkFMX0dFVF9GQUlMVVJFOiAxMDEsXG4gIEdFTkVSQUxfU0VUX0ZBSUxVUkU6IDEwMSxcbiAgR0VORVJBTF9DT01NSVRfRkFJTFVSRTogMTAxLFxuICBVTkRFRklORURfREFUQV9NT0RFTDogMTAxLFxuICBVTklNUExFTUVOVEVEX0VMRU1FTlQ6IDEwMSxcbiAgVkFMVUVfTk9UX0lOSVRJQUxJWkVEOiAxMDEsXG4gIElOVkFMSURfU0VUX1ZBTFVFOiAxMDEsXG4gIFJFQURfT05MWV9FTEVNRU5UOiAxMDEsXG4gIFdSSVRFX09OTFlfRUxFTUVOVDogMTAxLFxuICBUWVBFX01JU01BVENIOiAxMDEsXG4gIFZBTFVFX09VVF9PRl9SQU5HRTogMTAxLFxuICBERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRDogMTAxLFxufTtcblxuZXhwb3J0IGNvbnN0IHNjb3JtMTJfZXJyb3JfY29kZXMgPSB7XG4gIC4uLmVycm9yX2NvZGVzLCAuLi57XG4gICAgUkVUUklFVkVfQkVGT1JFX0lOSVQ6IDMwMSxcbiAgICBTVE9SRV9CRUZPUkVfSU5JVDogMzAxLFxuICAgIENPTU1JVF9CRUZPUkVfSU5JVDogMzAxLFxuICAgIEFSR1VNRU5UX0VSUk9SOiAyMDEsXG4gICAgQ0hJTERSRU5fRVJST1I6IDIwMixcbiAgICBDT1VOVF9FUlJPUjogMjAzLFxuICAgIFVOREVGSU5FRF9EQVRBX01PREVMOiA0MDEsXG4gICAgVU5JTVBMRU1FTlRFRF9FTEVNRU5UOiA0MDEsXG4gICAgVkFMVUVfTk9UX0lOSVRJQUxJWkVEOiAzMDEsXG4gICAgSU5WQUxJRF9TRVRfVkFMVUU6IDQwMixcbiAgICBSRUFEX09OTFlfRUxFTUVOVDogNDAzLFxuICAgIFdSSVRFX09OTFlfRUxFTUVOVDogNDA0LFxuICAgIFRZUEVfTUlTTUFUQ0g6IDQwNSxcbiAgICBWQUxVRV9PVVRfT0ZfUkFOR0U6IDQwNyxcbiAgICBERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRDogNDA4LFxuICB9LFxufTtcblxuZXhwb3J0IGNvbnN0IHNjb3JtMjAwNF9lcnJvcl9jb2RlcyA9IHtcbiAgLi4uZXJyb3JfY29kZXMsIC4uLntcbiAgICBJTklUSUFMSVpBVElPTl9GQUlMRUQ6IDEwMixcbiAgICBJTklUSUFMSVpFRDogMTAzLFxuICAgIFRFUk1JTkFURUQ6IDEwNCxcbiAgICBURVJNSU5BVElPTl9GQUlMVVJFOiAxMTEsXG4gICAgVEVSTUlOQVRJT05fQkVGT1JFX0lOSVQ6IDExMixcbiAgICBNVUxUSVBMRV9URVJNSU5BVElPTlM6IDExMyxcbiAgICBSRVRSSUVWRV9CRUZPUkVfSU5JVDogMTIyLFxuICAgIFJFVFJJRVZFX0FGVEVSX1RFUk06IDEyMyxcbiAgICBTVE9SRV9CRUZPUkVfSU5JVDogMTMyLFxuICAgIFNUT1JFX0FGVEVSX1RFUk06IDEzMyxcbiAgICBDT01NSVRfQkVGT1JFX0lOSVQ6IDE0MixcbiAgICBDT01NSVRfQUZURVJfVEVSTTogMTQzLFxuICAgIEFSR1VNRU5UX0VSUk9SOiAyMDEsXG4gICAgR0VORVJBTF9HRVRfRkFJTFVSRTogMzAxLFxuICAgIEdFTkVSQUxfU0VUX0ZBSUxVUkU6IDM1MSxcbiAgICBHRU5FUkFMX0NPTU1JVF9GQUlMVVJFOiAzOTEsXG4gICAgVU5ERUZJTkVEX0RBVEFfTU9ERUw6IDQwMSxcbiAgICBVTklNUExFTUVOVEVEX0VMRU1FTlQ6IDQwMixcbiAgICBWQUxVRV9OT1RfSU5JVElBTElaRUQ6IDQwMyxcbiAgICBSRUFEX09OTFlfRUxFTUVOVDogNDA0LFxuICAgIFdSSVRFX09OTFlfRUxFTUVOVDogNDA1LFxuICAgIFRZUEVfTUlTTUFUQ0g6IDQwNixcbiAgICBWQUxVRV9PVVRfT0ZfUkFOR0U6IDQwNyxcbiAgICBERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRDogNDA4LFxuICB9LFxufTtcbiIsImNvbnN0IGNvbW1vbl92YWx1ZXMgPSB7XG4gIHZhbGlkUmVzdWx0OiBbXG4gICAgJ2NvcnJlY3QnLFxuICAgICd3cm9uZycsXG4gICAgJ3VuYW50aWNpcGF0ZWQnLFxuICAgICduZXV0cmFsJyxcbiAgXSxcbiAgaW52YWxpZFJlc3VsdDogW1xuICAgICctMTAwMDAnLFxuICAgICcxMDAwMCcsXG4gICAgJ2ludmFsaWQnLFxuICBdLFxuXG4gIHZhbGlkMFRvMVJhbmdlOiBbXG4gICAgJzAuMCcsXG4gICAgJzAuMjUnLFxuICAgICcwLjUnLFxuICAgICcxLjAnLFxuICBdLFxuICBpbnZhbGlkMFRvMVJhbmdlOiBbXG4gICAgJy0xJyxcbiAgICAnLTAuMScsXG4gICAgJzEuMScsXG4gICAgJy4yNScsXG4gIF0sXG5cbiAgdmFsaWQwVG8xMDBSYW5nZTogW1xuICAgICcxJyxcbiAgICAnNTAnLFxuICAgICcxMDAnLFxuICBdLFxuICBpbnZhbGlkMFRvMTAwUmFuZ2U6IFtcbiAgICAnaW52YWxpZCcsXG4gICAgJ2ExMDAnLFxuICAgICctMScsXG4gIF0sXG5cbiAgdmFsaWRTY2FsZWRSYW5nZTogW1xuICAgICcxJyxcbiAgICAnMC41JyxcbiAgICAnMCcsXG4gICAgJy0wLjUnLFxuICAgICctMScsXG4gIF0sXG4gIGludmFsaWRTY2FsZWRSYW5nZTogW1xuICAgICctMTAxJyxcbiAgICAnMjUuMScsXG4gICAgJzUwLjUnLFxuICAgICc3NScsXG4gICAgJzEwMCcsXG4gIF0sXG5cbiAgdmFsaWRJbnRlZ2VyU2NhbGVkUmFuZ2U6IFtcbiAgICAnMScsXG4gICAgJzAnLFxuICAgICctMScsXG4gIF0sXG4gIGludmFsaWRJbnRlZ2VyU2NhbGVkUmFuZ2U6IFtcbiAgICAnLTEwMScsXG4gICAgJy0wLjUnLFxuICAgICcwLjUnLFxuICAgICcyNS4xJyxcbiAgICAnNTAuNScsXG4gICAgJzc1JyxcbiAgICAnMTAwJyxcbiAgXSxcbn07XG5cbmV4cG9ydCBjb25zdCBzY29ybTEyX3ZhbHVlcyA9IHtcbiAgLi4uY29tbW9uX3ZhbHVlcywgLi4ue1xuICAgIHZhbGlkTGVzc29uU3RhdHVzOiBbXG4gICAgICAncGFzc2VkJyxcbiAgICAgICdjb21wbGV0ZWQnLFxuICAgICAgJ2ZhaWxlZCcsXG4gICAgICAnaW5jb21wbGV0ZScsXG4gICAgICAnYnJvd3NlZCcsXG4gICAgXSxcbiAgICBpbnZhbGlkTGVzc29uU3RhdHVzOiBbXG4gICAgICAnUGFzc2VkJyxcbiAgICAgICdQJyxcbiAgICAgICdGJyxcbiAgICAgICdwJyxcbiAgICAgICd0cnVlJyxcbiAgICAgICdmYWxzZScsXG4gICAgICAnY29tcGxldGUnLFxuICAgIF0sXG5cbiAgICB2YWxpZEV4aXQ6IFtcbiAgICAgICd0aW1lLW91dCcsXG4gICAgICAnc3VzcGVuZCcsXG4gICAgICAnbG9nb3V0JyxcbiAgICBdLFxuICAgIGludmFsaWRFeGl0OiBbXG4gICAgICAnY2xvc2UnLFxuICAgICAgJ2V4aXQnLFxuICAgICAgJ2NyYXNoJyxcbiAgICBdLFxuXG4gICAgdmFsaWRUeXBlOiBbXG4gICAgICAndHJ1ZS1mYWxzZScsXG4gICAgICAnY2hvaWNlJyxcbiAgICAgICdmaWxsLWluJyxcbiAgICAgICdtYXRjaGluZycsXG4gICAgICAncGVyZm9ybWFuY2UnLFxuICAgICAgJ3NlcXVlbmNpbmcnLFxuICAgICAgJ2xpa2VydCcsXG4gICAgICAnbnVtZXJpYycsXG4gICAgXSxcbiAgICBpbnZhbGlkVHlwZTogW1xuICAgICAgJ2NvcnJlY3QnLFxuICAgICAgJ3dyb25nJyxcbiAgICAgICdsb2dvdXQnLFxuICAgIF0sXG5cbiAgICB2YWxpZFNwZWVkUmFuZ2U6IFtcbiAgICAgICcxJyxcbiAgICAgICc1MCcsXG4gICAgICAnMTAwJyxcbiAgICAgICctMScsXG4gICAgICAnLTUwJyxcbiAgICAgICctMTAwJyxcbiAgICBdLFxuICAgIGludmFsaWRTcGVlZFJhbmdlOiBbXG4gICAgICAnaW52YWxpZCcsXG4gICAgICAnYTEwMCcsXG4gICAgICAnLTEwMScsXG4gICAgICAnMTAxJyxcbiAgICAgICctMTAwMDAwJyxcbiAgICAgICcxMDAwMDAnLFxuICAgIF0sXG5cbiAgICB2YWxpZFNjb3JlUmFuZ2U6IFtcbiAgICAgICcxJyxcbiAgICAgICc1MC4yNScsXG4gICAgICAnMTAwJyxcbiAgICBdLFxuICAgIGludmFsaWRTY29yZVJhbmdlOiBbXG4gICAgICAnaW52YWxpZCcsXG4gICAgICAnYTEwMCcsXG4gICAgICAnLTEnLFxuICAgICAgJzEwMScsXG4gICAgICAnLTEwMDAwMCcsXG4gICAgICAnMTAwMDAwJyxcbiAgICBdLFxuICAgIGludmFsaWQwVG8xMDBSYW5nZTogW1xuICAgICAgJ2ludmFsaWQnLFxuICAgICAgJ2ExMDAnLFxuICAgICAgJy0yJyxcbiAgICBdLFxuXG4gICAgdmFsaWRUaW1lOiBbXG4gICAgICAnMTA6MDY6NTcnLFxuICAgICAgJzIzOjU5OjU5JyxcbiAgICAgICcwMDowMDowMCcsXG4gICAgXSxcbiAgICBpbnZhbGlkVGltZTogW1xuICAgICAgJzQ3OjU5OjU5JyxcbiAgICAgICcwMDowMDowMS41NicsXG4gICAgICAnMDY6NToxMycsXG4gICAgICAnMjM6NTk6NTkuMTIzJyxcbiAgICAgICdQMURUMjNINTlNNTlTJyxcbiAgICBdLFxuXG4gICAgdmFsaWRUaW1lc3BhbjogW1xuICAgICAgJzEwOjA2OjU3JyxcbiAgICAgICcwMDowMDowMS41NicsXG4gICAgICAnMjM6NTk6NTknLFxuICAgICAgJzQ3OjU5OjU5JyxcbiAgICBdLFxuICAgIGludmFsaWRUaW1lc3BhbjogW1xuICAgICAgJzA2OjU6MTMnLFxuICAgICAgJzIzOjU5OjU5LjEyMycsXG4gICAgICAnUDFEVDIzSDU5TTU5UycsXG4gICAgXSxcbiAgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBzY29ybTIwMDRfdmFsdWVzID0ge1xuICAuLi5jb21tb25fdmFsdWVzLCAuLi57XG4gICAgLy8gdmFsaWQgZmllbGQgdmFsdWVzXG4gICAgdmFsaWRUaW1lc3RhbXBzOiBbXG4gICAgICAnMjAxOS0wNi0yNScsXG4gICAgICAnMjAxOS0wNi0yNVQyMzo1OScsXG4gICAgICAnMjAxOS0wNi0yNVQyMzo1OTo1OS45OScsXG4gICAgICAnMTk3MC0wMS0wMScsXG4gICAgXSxcbiAgICBpbnZhbGlkVGltZXN0YW1wczogW1xuICAgICAgJzIwMTktMDYtMjVUJyxcbiAgICAgICcyMDE5LTA2LTI1VDIzOjU5OjU5Ljk5OScsXG4gICAgICAnMjAxOS0wNi0yNVQyNTo1OTo1OS45OScsXG4gICAgICAnMjAxOS0xMy0zMScsXG4gICAgICAnMTk2OS0xMi0zMScsXG4gICAgICAnLTAwOjAwOjMwJyxcbiAgICAgICcwOjUwOjMwJyxcbiAgICAgICcyMzowMDozMC4nLFxuICAgIF0sXG5cbiAgICB2YWxpZENTdGF0dXM6IFtcbiAgICAgICdjb21wbGV0ZWQnLFxuICAgICAgJ2luY29tcGxldGUnLFxuICAgICAgJ25vdCBhdHRlbXB0ZWQnLFxuICAgICAgJ3Vua25vd24nLFxuICAgIF0sXG4gICAgaW52YWxpZENTdGF0dXM6IFtcbiAgICAgICdjb21wbGV0ZScsXG4gICAgICAncGFzc2VkJyxcbiAgICAgICdmYWlsZWQnLFxuICAgIF0sXG5cbiAgICB2YWxpZFNTdGF0dXM6IFtcbiAgICAgICdwYXNzZWQnLFxuICAgICAgJ2ZhaWxlZCcsXG4gICAgICAndW5rbm93bicsXG4gICAgXSxcbiAgICBpbnZhbGlkU1N0YXR1czogW1xuICAgICAgJ2NvbXBsZXRlJyxcbiAgICAgICdpbmNvbXBsZXRlJyxcbiAgICAgICdQJyxcbiAgICAgICdmJyxcbiAgICBdLFxuXG4gICAgdmFsaWRFeGl0OiBbXG4gICAgICAndGltZS1vdXQnLFxuICAgICAgJ3N1c3BlbmQnLFxuICAgICAgJ2xvZ291dCcsXG4gICAgICAnbm9ybWFsJyxcbiAgICBdLFxuICAgIGludmFsaWRFeGl0OiBbXG4gICAgICAnY2xvc2UnLFxuICAgICAgJ2V4aXQnLFxuICAgICAgJ2NyYXNoJyxcbiAgICBdLFxuXG4gICAgdmFsaWRUeXBlOiBbXG4gICAgICAndHJ1ZS1mYWxzZScsXG4gICAgICAnY2hvaWNlJyxcbiAgICAgICdmaWxsLWluJyxcbiAgICAgICdsb25nLWZpbGwtaW4nLFxuICAgICAgJ21hdGNoaW5nJyxcbiAgICAgICdwZXJmb3JtYW5jZScsXG4gICAgICAnc2VxdWVuY2luZycsXG4gICAgICAnbGlrZXJ0JyxcbiAgICAgICdudW1lcmljJyxcbiAgICAgICdvdGhlcicsXG4gICAgXSxcbiAgICBpbnZhbGlkVHlwZTogW1xuICAgICAgJ2NvcnJlY3QnLFxuICAgICAgJ3dyb25nJyxcbiAgICAgICdsb2dvdXQnLFxuICAgIF0sXG5cbiAgICB2YWxpZFNjb3JlUmFuZ2U6IFtcbiAgICAgICcxJyxcbiAgICAgICc1MCcsXG4gICAgICAnMTAwJyxcbiAgICAgICctMTAwMDAnLFxuICAgICAgJy0xJyxcbiAgICAgICcxMDAwMCcsXG4gICAgXSxcbiAgICBpbnZhbGlkU2NvcmVSYW5nZTogW1xuICAgICAgJ2ludmFsaWQnLFxuICAgICAgJ2ExMDAnLFxuICAgICAgJy0xMDAwMDAnLFxuICAgICAgJzEwMDAwMCcsXG4gICAgXSxcblxuICAgIHZhbGlkSVNPODYwMUR1cmF0aW9uczogW1xuICAgICAgJ1AxWTM0RFQyM0g0NU0xNVMnLFxuICAgICAgJ1BUMU00NVMnLFxuICAgICAgJ1AwUycsXG4gICAgICAnUFQ3NU0nLFxuICAgIF0sXG4gICAgaW52YWxpZElTTzg2MDFEdXJhdGlvbnM6IFtcbiAgICAgICcwMDowODo0NScsXG4gICAgICAnLVAxSCcsXG4gICAgICAnMXk0NUQnLFxuICAgICAgJzAnLFxuICAgIF0sXG5cbiAgICB2YWxpZENvbW1lbnQ6IFtcbiAgICAgICd7bGFuZz1lbi05OH0gbGVhcm5lciBjb21tZW50JyxcbiAgICAgICd7bGFuZz1lbmctOTgtOX0gbGVhcm5lciBjb21tZW50JyxcbiAgICAgICd7bGFuZz1lbmctOTgtOWZoZ2p9JyArICd4Jy5yZXBlYXQoNDAwMCksXG4gICAgICAnbGVhcm5lciBjb21tZW50JyxcbiAgICAgICdsZWFybmVyIGNvbW1lbnR9JyxcbiAgICAgICd7bGFuZz1pLXh4fScsXG4gICAgICAne2xhbmc9aX0nLFxuICAgICAgJycsXG4gICAgXSxcbiAgICBpbnZhbGlkQ29tbWVudDogW1xuICAgICAgJ3tsYW5nPWktfScsXG4gICAgICAne2xhbmc9aS14fScsXG4gICAgICAne2xhbmc9ZW5nLTk4LTlmaGdqfXsgbGVhcm5lciBjb21tZW50JyxcbiAgICAgICd7bGVhcm5lciBjb21tZW50JyxcbiAgICAgICd7bGFuZz1lbmctOTgtOWZoZ2p9JyArICd4Jy5yZXBlYXQoNDAwMSksXG4gICAgICAne2xhbmc9ZW5nLTk4LTlmaGdqfXsnICsgJ3gnLnJlcGVhdCgzOTk5KSxcbiAgICBdLFxuXG4gICAgdmFsaWREZXNjcmlwdGlvbjogW1xuICAgICAgJ3tsYW5nPWVuLTk4fSBsZWFybmVyIGNvbW1lbnQnLFxuICAgICAgJ3tsYW5nPWVuZy05OC05fSBsZWFybmVyIGNvbW1lbnQnLFxuICAgICAgJ3tsYW5nPWVuZy05OC05Zmhnan0nICsgJ3gnLnJlcGVhdCgyNTApLFxuICAgICAgJ2xlYXJuZXIgY29tbWVudCcsXG4gICAgICAnbGVhcm5lciBjb21tZW50fScsXG4gICAgICAne2xhbmc9aS14eH0nLFxuICAgICAgJ3tsYW5nPWl9JyxcbiAgICAgICcnLFxuICAgIF0sXG4gICAgaW52YWxpZERlc2NyaXB0aW9uOiBbXG4gICAgICAne2xhbmc9aS19JyxcbiAgICAgICd7bGFuZz1pLXh9JyxcbiAgICAgICd7bGFuZz1lbmctOTgtOWZoZ2p9eyBsZWFybmVyIGNvbW1lbnQnLFxuICAgICAgJ3tsZWFybmVyIGNvbW1lbnQnLFxuICAgICAgJ3tsYW5nPWVuZy05OC05Zmhnan0nICsgJ3gnLnJlcGVhdCgyNTEpLFxuICAgICAgJ3tsYW5nPWVuZy05OC05Zmhnan17JyArICd4Jy5yZXBlYXQoMjQ5KSxcbiAgICBdLFxuXG4gICAgdmFsaWROYXZSZXF1ZXN0OiBbXG4gICAgICAncHJldmlvdXMnLFxuICAgICAgJ2NvbnRpbnVlJyxcbiAgICAgICdleGl0JyxcbiAgICAgICdleGl0QWxsJyxcbiAgICAgICdhYmFuZG9uJyxcbiAgICAgICdhYmFuZG9uQWxsJyxcbiAgICAgICdzdXNwZW5kQWxsJyxcbiAgICBdLFxuICAgIGludmFsaWROYXZSZXF1ZXN0OiBbXG4gICAgICAnY2xvc2UnLFxuICAgICAgJ3F1aXQnLFxuICAgICAgJ25leHQnLFxuICAgICAgJ2JlZm9yZScsXG4gICAgXSxcbiAgfSxcbn07XG4iLCJleHBvcnQgY29uc3QgdmFsaWRfbGFuZ3VhZ2VzID0ge1xuICAnYWEnOiAnYWEnLCAnYWInOiAnYWInLCAnYWUnOiAnYWUnLCAnYWYnOiAnYWYnLCAnYWsnOiAnYWsnLCAnYW0nOiAnYW0nLFxuICAnYW4nOiAnYW4nLCAnYXInOiAnYXInLCAnYXMnOiAnYXMnLCAnYXYnOiAnYXYnLCAnYXknOiAnYXknLCAnYXonOiAnYXonLFxuICAnYmEnOiAnYmEnLCAnYmUnOiAnYmUnLCAnYmcnOiAnYmcnLCAnYmgnOiAnYmgnLCAnYmknOiAnYmknLCAnYm0nOiAnYm0nLFxuICAnYm4nOiAnYm4nLCAnYm8nOiAnYm8nLCAnYnInOiAnYnInLCAnYnMnOiAnYnMnLCAnY2EnOiAnY2EnLCAnY2UnOiAnY2UnLFxuICAnY2gnOiAnY2gnLCAnY28nOiAnY28nLCAnY3InOiAnY3InLCAnY3MnOiAnY3MnLCAnY3UnOiAnY3UnLCAnY3YnOiAnY3YnLFxuICAnY3knOiAnY3knLCAnZGEnOiAnZGEnLCAnZGUnOiAnZGUnLCAnZHYnOiAnZHYnLCAnZHonOiAnZHonLCAnZWUnOiAnZWUnLFxuICAnZWwnOiAnZWwnLCAnZW4nOiAnZW4nLCAnZW8nOiAnZW8nLCAnZXMnOiAnZXMnLCAnZXQnOiAnZXQnLCAnZXUnOiAnZXUnLFxuICAnZmEnOiAnZmEnLCAnZmYnOiAnZmYnLCAnZmknOiAnZmknLCAnZmonOiAnZmonLCAnZm8nOiAnZm8nLCAnZnInOiAnZnInLFxuICAnZnknOiAnZnknLCAnZ2EnOiAnZ2EnLCAnZ2QnOiAnZ2QnLCAnZ2wnOiAnZ2wnLCAnZ24nOiAnZ24nLCAnZ3UnOiAnZ3UnLFxuICAnZ3YnOiAnZ3YnLCAnaGEnOiAnaGEnLCAnaGUnOiAnaGUnLCAnaGknOiAnaGknLCAnaG8nOiAnaG8nLCAnaHInOiAnaHInLFxuICAnaHQnOiAnaHQnLCAnaHUnOiAnaHUnLCAnaHknOiAnaHknLCAnaHonOiAnaHonLCAnaWEnOiAnaWEnLCAnaWQnOiAnaWQnLFxuICAnaWUnOiAnaWUnLCAnaWcnOiAnaWcnLCAnaWknOiAnaWknLCAnaWsnOiAnaWsnLCAnaW8nOiAnaW8nLCAnaXMnOiAnaXMnLFxuICAnaXQnOiAnaXQnLCAnaXUnOiAnaXUnLCAnamEnOiAnamEnLCAnanYnOiAnanYnLCAna2EnOiAna2EnLCAna2cnOiAna2cnLFxuICAna2knOiAna2knLCAna2onOiAna2onLCAna2snOiAna2snLCAna2wnOiAna2wnLCAna20nOiAna20nLCAna24nOiAna24nLFxuICAna28nOiAna28nLCAna3InOiAna3InLCAna3MnOiAna3MnLCAna3UnOiAna3UnLCAna3YnOiAna3YnLCAna3cnOiAna3cnLFxuICAna3knOiAna3knLCAnbGEnOiAnbGEnLCAnbGInOiAnbGInLCAnbGcnOiAnbGcnLCAnbGknOiAnbGknLCAnbG4nOiAnbG4nLFxuICAnbG8nOiAnbG8nLCAnbHQnOiAnbHQnLCAnbHUnOiAnbHUnLCAnbHYnOiAnbHYnLCAnbWcnOiAnbWcnLCAnbWgnOiAnbWgnLFxuICAnbWknOiAnbWknLCAnbWsnOiAnbWsnLCAnbWwnOiAnbWwnLCAnbW4nOiAnbW4nLCAnbW8nOiAnbW8nLCAnbXInOiAnbXInLFxuICAnbXMnOiAnbXMnLCAnbXQnOiAnbXQnLCAnbXknOiAnbXknLCAnbmEnOiAnbmEnLCAnbmInOiAnbmInLCAnbmQnOiAnbmQnLFxuICAnbmUnOiAnbmUnLCAnbmcnOiAnbmcnLCAnbmwnOiAnbmwnLCAnbm4nOiAnbm4nLCAnbm8nOiAnbm8nLCAnbnInOiAnbnInLFxuICAnbnYnOiAnbnYnLCAnbnknOiAnbnknLCAnb2MnOiAnb2MnLCAnb2onOiAnb2onLCAnb20nOiAnb20nLCAnb3InOiAnb3InLFxuICAnb3MnOiAnb3MnLCAncGEnOiAncGEnLCAncGknOiAncGknLCAncGwnOiAncGwnLCAncHMnOiAncHMnLCAncHQnOiAncHQnLFxuICAncXUnOiAncXUnLCAncm0nOiAncm0nLCAncm4nOiAncm4nLCAncm8nOiAncm8nLCAncnUnOiAncnUnLCAncncnOiAncncnLFxuICAnc2EnOiAnc2EnLCAnc2MnOiAnc2MnLCAnc2QnOiAnc2QnLCAnc2UnOiAnc2UnLCAnc2cnOiAnc2cnLCAnc2gnOiAnc2gnLFxuICAnc2knOiAnc2knLCAnc2snOiAnc2snLCAnc2wnOiAnc2wnLCAnc20nOiAnc20nLCAnc24nOiAnc24nLCAnc28nOiAnc28nLFxuICAnc3EnOiAnc3EnLCAnc3InOiAnc3InLCAnc3MnOiAnc3MnLCAnc3QnOiAnc3QnLCAnc3UnOiAnc3UnLCAnc3YnOiAnc3YnLFxuICAnc3cnOiAnc3cnLCAndGEnOiAndGEnLCAndGUnOiAndGUnLCAndGcnOiAndGcnLCAndGgnOiAndGgnLCAndGknOiAndGknLFxuICAndGsnOiAndGsnLCAndGwnOiAndGwnLCAndG4nOiAndG4nLCAndG8nOiAndG8nLCAndHInOiAndHInLCAndHMnOiAndHMnLFxuICAndHQnOiAndHQnLCAndHcnOiAndHcnLCAndHknOiAndHknLCAndWcnOiAndWcnLCAndWsnOiAndWsnLCAndXInOiAndXInLFxuICAndXonOiAndXonLCAndmUnOiAndmUnLCAndmknOiAndmknLCAndm8nOiAndm8nLCAnd2EnOiAnd2EnLCAnd28nOiAnd28nLFxuICAneGgnOiAneGgnLCAneWknOiAneWknLCAneW8nOiAneW8nLCAnemEnOiAnemEnLCAnemgnOiAnemgnLCAnenUnOiAnenUnLFxuICAnYWFyJzogJ2FhcicsICdhYmsnOiAnYWJrJywgJ2F2ZSc6ICdhdmUnLCAnYWZyJzogJ2FmcicsICdha2EnOiAnYWthJyxcbiAgJ2FtaCc6ICdhbWgnLCAnYXJnJzogJ2FyZycsICdhcmEnOiAnYXJhJywgJ2FzbSc6ICdhc20nLCAnYXZhJzogJ2F2YScsXG4gICdheW0nOiAnYXltJywgJ2F6ZSc6ICdhemUnLCAnYmFrJzogJ2JhaycsICdiZWwnOiAnYmVsJywgJ2J1bCc6ICdidWwnLFxuICAnYmloJzogJ2JpaCcsICdiaXMnOiAnYmlzJywgJ2JhbSc6ICdiYW0nLCAnYmVuJzogJ2JlbicsICd0aWInOiAndGliJyxcbiAgJ2JvZCc6ICdib2QnLCAnYnJlJzogJ2JyZScsICdib3MnOiAnYm9zJywgJ2NhdCc6ICdjYXQnLCAnY2hlJzogJ2NoZScsXG4gICdjaGEnOiAnY2hhJywgJ2Nvcyc6ICdjb3MnLCAnY3JlJzogJ2NyZScsICdjemUnOiAnY3plJywgJ2Nlcyc6ICdjZXMnLFxuICAnY2h1JzogJ2NodScsICdjaHYnOiAnY2h2JywgJ3dlbCc6ICd3ZWwnLCAnY3ltJzogJ2N5bScsICdkYW4nOiAnZGFuJyxcbiAgJ2dlcic6ICdnZXInLCAnZGV1JzogJ2RldScsICdkaXYnOiAnZGl2JywgJ2R6byc6ICdkem8nLCAnZXdlJzogJ2V3ZScsXG4gICdncmUnOiAnZ3JlJywgJ2VsbCc6ICdlbGwnLCAnZW5nJzogJ2VuZycsICdlcG8nOiAnZXBvJywgJ3NwYSc6ICdzcGEnLFxuICAnZXN0JzogJ2VzdCcsICdiYXEnOiAnYmFxJywgJ2V1cyc6ICdldXMnLCAncGVyJzogJ3BlcicsICdmYXMnOiAnZmFzJyxcbiAgJ2Z1bCc6ICdmdWwnLCAnZmluJzogJ2ZpbicsICdmaWonOiAnZmlqJywgJ2Zhbyc6ICdmYW8nLCAnZnJlJzogJ2ZyZScsXG4gICdmcmEnOiAnZnJhJywgJ2ZyeSc6ICdmcnknLCAnZ2xlJzogJ2dsZScsICdnbGEnOiAnZ2xhJywgJ2dsZyc6ICdnbGcnLFxuICAnZ3JuJzogJ2dybicsICdndWonOiAnZ3VqJywgJ2dsdic6ICdnbHYnLCAnaGF1JzogJ2hhdScsICdoZWInOiAnaGViJyxcbiAgJ2hpbic6ICdoaW4nLCAnaG1vJzogJ2htbycsICdocnYnOiAnaHJ2JywgJ2hhdCc6ICdoYXQnLCAnaHVuJzogJ2h1bicsXG4gICdhcm0nOiAnYXJtJywgJ2h5ZSc6ICdoeWUnLCAnaGVyJzogJ2hlcicsICdpbmEnOiAnaW5hJywgJ2luZCc6ICdpbmQnLFxuICAnaWxlJzogJ2lsZScsICdpYm8nOiAnaWJvJywgJ2lpaSc6ICdpaWknLCAnaXBrJzogJ2lwaycsICdpZG8nOiAnaWRvJyxcbiAgJ2ljZSc6ICdpY2UnLCAnaXNsJzogJ2lzbCcsICdpdGEnOiAnaXRhJywgJ2lrdSc6ICdpa3UnLCAnanBuJzogJ2pwbicsXG4gICdqYXYnOiAnamF2JywgJ2dlbyc6ICdnZW8nLCAna2F0JzogJ2thdCcsICdrb24nOiAna29uJywgJ2tpayc6ICdraWsnLFxuICAna3VhJzogJ2t1YScsICdrYXonOiAna2F6JywgJ2thbCc6ICdrYWwnLCAna2htJzogJ2tobScsICdrYW4nOiAna2FuJyxcbiAgJ2tvcic6ICdrb3InLCAna2F1JzogJ2thdScsICdrYXMnOiAna2FzJywgJ2t1cic6ICdrdXInLCAna29tJzogJ2tvbScsXG4gICdjb3InOiAnY29yJywgJ2tpcic6ICdraXInLCAnbGF0JzogJ2xhdCcsICdsdHonOiAnbHR6JywgJ2x1Zyc6ICdsdWcnLFxuICAnbGltJzogJ2xpbScsICdsaW4nOiAnbGluJywgJ2xhbyc6ICdsYW8nLCAnbGl0JzogJ2xpdCcsICdsdWInOiAnbHViJyxcbiAgJ2xhdic6ICdsYXYnLCAnbWxnJzogJ21sZycsICdtYWgnOiAnbWFoJywgJ21hbyc6ICdtYW8nLCAnbXJpJzogJ21yaScsXG4gICdtYWMnOiAnbWFjJywgJ21rZCc6ICdta2QnLCAnbWFsJzogJ21hbCcsICdtb24nOiAnbW9uJywgJ21vbCc6ICdtb2wnLFxuICAnbWFyJzogJ21hcicsICdtYXknOiAnbWF5JywgJ21zYSc6ICdtc2EnLCAnbWx0JzogJ21sdCcsICdidXInOiAnYnVyJyxcbiAgJ215YSc6ICdteWEnLCAnbmF1JzogJ25hdScsICdub2InOiAnbm9iJywgJ25kZSc6ICduZGUnLCAnbmVwJzogJ25lcCcsXG4gICduZG8nOiAnbmRvJywgJ2R1dCc6ICdkdXQnLCAnbmxkJzogJ25sZCcsICdubm8nOiAnbm5vJywgJ25vcic6ICdub3InLFxuICAnbmJsJzogJ25ibCcsICduYXYnOiAnbmF2JywgJ255YSc6ICdueWEnLCAnb2NpJzogJ29jaScsICdvamknOiAnb2ppJyxcbiAgJ29ybSc6ICdvcm0nLCAnb3JpJzogJ29yaScsICdvc3MnOiAnb3NzJywgJ3Bhbic6ICdwYW4nLCAncGxpJzogJ3BsaScsXG4gICdwb2wnOiAncG9sJywgJ3B1cyc6ICdwdXMnLCAncG9yJzogJ3BvcicsICdxdWUnOiAncXVlJywgJ3JvaCc6ICdyb2gnLFxuICAncnVuJzogJ3J1bicsICdydW0nOiAncnVtJywgJ3Jvbic6ICdyb24nLCAncnVzJzogJ3J1cycsICdraW4nOiAna2luJyxcbiAgJ3Nhbic6ICdzYW4nLCAnc3JkJzogJ3NyZCcsICdzbmQnOiAnc25kJywgJ3NtZSc6ICdzbWUnLCAnc2FnJzogJ3NhZycsXG4gICdzbG8nOiAnc2xvJywgJ3Npbic6ICdzaW4nLCAnc2xrJzogJ3NsaycsICdzbHYnOiAnc2x2JywgJ3Ntbyc6ICdzbW8nLFxuICAnc25hJzogJ3NuYScsICdzb20nOiAnc29tJywgJ2FsYic6ICdhbGInLCAnc3FpJzogJ3NxaScsICdzcnAnOiAnc3JwJyxcbiAgJ3Nzdyc6ICdzc3cnLCAnc290JzogJ3NvdCcsICdzdW4nOiAnc3VuJywgJ3N3ZSc6ICdzd2UnLCAnc3dhJzogJ3N3YScsXG4gICd0YW0nOiAndGFtJywgJ3RlbCc6ICd0ZWwnLCAndGdrJzogJ3RnaycsICd0aGEnOiAndGhhJywgJ3Rpcic6ICd0aXInLFxuICAndHVrJzogJ3R1aycsICd0Z2wnOiAndGdsJywgJ3Rzbic6ICd0c24nLCAndG9uJzogJ3RvbicsICd0dXInOiAndHVyJyxcbiAgJ3Rzbyc6ICd0c28nLCAndGF0JzogJ3RhdCcsICd0d2knOiAndHdpJywgJ3RhaCc6ICd0YWgnLCAndWlnJzogJ3VpZycsXG4gICd1a3InOiAndWtyJywgJ3VyZCc6ICd1cmQnLCAndXpiJzogJ3V6YicsICd2ZW4nOiAndmVuJywgJ3ZpZSc6ICd2aWUnLFxuICAndm9sJzogJ3ZvbCcsICd3bG4nOiAnd2xuJywgJ3dvbCc6ICd3b2wnLCAneGhvJzogJ3hobycsICd5aWQnOiAneWlkJyxcbiAgJ3lvcic6ICd5b3InLCAnemhhJzogJ3poYScsICdjaGknOiAnY2hpJywgJ3pobyc6ICd6aG8nLCAnenVsJzogJ3p1bCcsXG59O1xuIiwiLy8gQGZsb3dcblxuaW1wb3J0IHtzY29ybTEyX3ZhbHVlcywgc2Nvcm0yMDA0X3ZhbHVlc30gZnJvbSAnLi9maWVsZF92YWx1ZXMnO1xuXG5leHBvcnQgY29uc3Qgc2Nvcm0xMl9yZWdleCA9IHtcbiAgQ01JU3RyaW5nMjU2OiAnXi57MCwyNTV9JCcsXG4gIENNSVN0cmluZzQwOTY6ICdeLnswLDQwOTZ9JCcsXG4gIENNSVRpbWU6ICdeKD86WzAxXVxcXFxkfDJbMDEyM10pOig/OlswMTIzNDVdXFxcXGQpOig/OlswMTIzNDVdXFxcXGQpJCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JVGltZXNwYW46ICdeKFswLTldezIsfSk6KFswLTldezJ9KTooWzAtOV17Mn0pKFxcLlswLTldezEsMn0pPyQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUludGVnZXI6ICdeXFxcXGQrJCcsXG4gIENNSVNJbnRlZ2VyOiAnXi0/KFswLTldKykkJyxcbiAgQ01JRGVjaW1hbDogJ14tPyhbMC05XXswLDN9KShcXC5bMC05XSopPyQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUlkZW50aWZpZXI6ICdeW1xcXFx1MDAyMS1cXFxcdTAwN0VdezAsMjU1fSQnLFxuICBDTUlGZWVkYmFjazogJ14uezAsMjU1fSQnLCAvLyBUaGlzIG11c3QgYmUgcmVkZWZpbmVkXG4gIENNSUluZGV4OiAnWy5fXShcXFxcZCspLicsXG5cbiAgLy8gVm9jYWJ1bGFyeSBEYXRhIFR5cGUgRGVmaW5pdGlvblxuICBDTUlTdGF0dXM6ICdeKCcgKyBzY29ybTEyX3ZhbHVlcy52YWxpZExlc3NvblN0YXR1cy5qb2luKCd8JykgKyAnKSQnLFxuICBDTUlTdGF0dXMyOiAnXignICsgc2Nvcm0xMl92YWx1ZXMudmFsaWRMZXNzb25TdGF0dXMuam9pbignfCcpICsgJ3xub3QgYXR0ZW1wdGVkKSQnLFxuICBDTUlFeGl0OiAnXignICsgc2Nvcm0xMl92YWx1ZXMudmFsaWRFeGl0LmpvaW4oJ3wnKSArICd8KSQnLFxuICBDTUlUeXBlOiAnXignICsgc2Nvcm0xMl92YWx1ZXMudmFsaWRUeXBlLmpvaW4oJ3wnKSArICcpJCcsXG4gIENNSVJlc3VsdDogJ14oJyArIHNjb3JtMTJfdmFsdWVzLnZhbGlkUmVzdWx0LmpvaW4oJ3wnKSArICd8KFswLTldezAsM30pPyhcXFxcLlswLTldKik/KSQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIE5BVkV2ZW50OiAnXihwcmV2aW91c3xjb250aW51ZSkkJyxcblxuICAvLyBEYXRhIHJhbmdlc1xuICBzY29yZV9yYW5nZTogJzAjMTAwJyxcbiAgYXVkaW9fcmFuZ2U6ICctMSMxMDAnLFxuICBzcGVlZF9yYW5nZTogJy0xMDAjMTAwJyxcbiAgd2VpZ2h0aW5nX3JhbmdlOiAnLTEwMCMxMDAnLFxuICB0ZXh0X3JhbmdlOiAnLTEjMScsXG59O1xuXG5leHBvcnQgY29uc3QgYWljY19yZWdleCA9IHtcbiAgLi4uc2Nvcm0xMl9yZWdleCwgLi4ue1xuICAgIENNSUlkZW50aWZpZXI6ICdeXFxcXHd7MSwyNTV9JCcsXG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3Qgc2Nvcm0yMDA0X3JlZ2V4ID0ge1xuICBDTUlTdHJpbmcyMDA6ICdeW1xcXFx1MDAwMC1cXFxcdUZGRkZdezAsMjAwfSQnLFxuICBDTUlTdHJpbmcyNTA6ICdeW1xcXFx1MDAwMC1cXFxcdUZGRkZdezAsMjUwfSQnLFxuICBDTUlTdHJpbmcxMDAwOiAnXltcXFxcdTAwMDAtXFxcXHVGRkZGXXswLDEwMDB9JCcsXG4gIENNSVN0cmluZzQwMDA6ICdeW1xcXFx1MDAwMC1cXFxcdUZGRkZdezAsNDAwMH0kJyxcbiAgQ01JU3RyaW5nNjQwMDA6ICdeW1xcXFx1MDAwMC1cXFxcdUZGRkZdezAsNjQwMDB9JCcsXG4gIENNSUxhbmc6ICdeKFthLXpBLVpdezIsM318aXx4KShcXC1bYS16QS1aMC05XFwtXXsyLDh9KT8kfF4kJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlMYW5nU3RyaW5nMjUwOiAnXihcXHtsYW5nPShbYS16QS1aXXsyLDN9fGl8eCkoXFwtW2EtekEtWjAtOVxcLV17Miw4fSk/XFx9KT8oKD8hXFx7LiokKS57MCwyNTB9JCk/JCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JTGFuZ2NyOiAnXigoXFx7bGFuZz0oW2EtekEtWl17MiwzfXxpfHgpPyhcXC1bYS16QS1aMC05XFwtXXsyLDh9KT9cXH0pKSguKj8pJCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JTGFuZ1N0cmluZzI1MGNyOiAnXigoXFx7bGFuZz0oW2EtekEtWl17MiwzfXxpfHgpPyhcXC1bYS16QS1aMC05XFwtXXsyLDh9KT9cXH0pPyguezAsMjUwfSk/KT8kJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlMYW5nU3RyaW5nNDAwMDogJ14oXFx7bGFuZz0oW2EtekEtWl17MiwzfXxpfHgpKFxcLVthLXpBLVowLTlcXC1dezIsOH0pP1xcfSk/KCg/IVxcey4qJCkuezAsNDAwMH0kKT8kJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlUaW1lOiAnXigxOVs3LTldezF9WzAtOV17MX18MjBbMC0yXXsxfVswLTldezF9fDIwM1swLThdezF9KSgoLSgwWzEtOV17MX18MVswLTJdezF9KSkoKC0oMFsxLTldezF9fFsxLTJdezF9WzAtOV17MX18M1swLTFdezF9KSkoVChbMC0xXXsxfVswLTldezF9fDJbMC0zXXsxfSkoKDpbMC01XXsxfVswLTldezF9KSgoOlswLTVdezF9WzAtOV17MX0pKChcXFxcLlswLTldezEsMn0pKChafChbK3wtXShbMC0xXXsxfVswLTldezF9fDJbMC0zXXsxfSkpKSg6WzAtNV17MX1bMC05XXsxfSk/KT8pPyk/KT8pPyk/KT8kJyxcbiAgQ01JVGltZXNwYW46ICdeUCg/OihbLixcXFxcZF0rKVkpPyg/OihbLixcXFxcZF0rKU0pPyg/OihbLixcXFxcZF0rKVcpPyg/OihbLixcXFxcZF0rKUQpPyg/OlQ/KD86KFsuLFxcXFxkXSspSCk/KD86KFsuLFxcXFxkXSspTSk/KD86KFsuLFxcXFxkXSspUyk/KT8kJyxcbiAgQ01JSW50ZWdlcjogJ15cXFxcZCskJyxcbiAgQ01JU0ludGVnZXI6ICdeLT8oWzAtOV0rKSQnLFxuICBDTUlEZWNpbWFsOiAnXi0/KFswLTldezEsNX0pKFxcXFwuWzAtOV17MSwxOH0pPyQnLFxuICBDTUlJZGVudGlmaWVyOiAnXlxcXFxTezEsMjUwfVthLXpBLVowLTldJCcsXG4gIENNSVNob3J0SWRlbnRpZmllcjogJ15bXFxcXHdcXC5dezEsMjUwfSQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUxvbmdJZGVudGlmaWVyOiAnXig/Oig/IXVybjopXFxcXFN7MSw0MDAwfXx1cm46W0EtWmEtejAtOS1dezEsMzF9OlxcXFxTezEsNDAwMH0pJCcsXG4gIENNSUZlZWRiYWNrOiAnXi4qJCcsIC8vIFRoaXMgbXVzdCBiZSByZWRlZmluZWRcbiAgQ01JSW5kZXg6ICdbLl9dKFxcXFxkKykuJyxcbiAgQ01JSW5kZXhTdG9yZTogJy5OKFxcXFxkKykuJyxcblxuICAvLyBWb2NhYnVsYXJ5IERhdGEgVHlwZSBEZWZpbml0aW9uXG4gIENNSUNTdGF0dXM6ICdeKCcgKyBzY29ybTIwMDRfdmFsdWVzLnZhbGlkQ1N0YXR1cy5qb2luKCd8JykgKyAnKSQnLFxuICBDTUlTU3RhdHVzOiAnXignICsgc2Nvcm0yMDA0X3ZhbHVlcy52YWxpZFNTdGF0dXMuam9pbignfCcpICsgJykkJyxcbiAgQ01JRXhpdDogJ14oJyArIHNjb3JtMjAwNF92YWx1ZXMudmFsaWRFeGl0LmpvaW4oJ3wnKSArICcpJCcsXG4gIENNSVR5cGU6ICdeKCcgKyBzY29ybTIwMDRfdmFsdWVzLnZhbGlkVHlwZS5qb2luKCd8JykgKyAnKSQnLFxuICBDTUlSZXN1bHQ6ICdeKCcgKyBzY29ybTIwMDRfdmFsdWVzLnZhbGlkUmVzdWx0LmpvaW4oJ3wnKSArICd8LT8oWzAtOV17MSw0fSkoXFxcXC5bMC05XXsxLDE4fSk/KSQnLFxuICBOQVZFdmVudDogJ14oJyArIHNjb3JtMjAwNF92YWx1ZXMudmFsaWROYXZSZXF1ZXN0LmpvaW4oJ3wnKSArICd8XFx7dGFyZ2V0PVxcXFxTezAsMjAwfVthLXpBLVowLTldXFx9Y2hvaWNlfGp1bXApJCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgTkFWQm9vbGVhbjogJ14odW5rbm93bnx0cnVlfGZhbHNlJCknLFxuICBOQVZUYXJnZXQ6ICdeKHByZXZpb3VzfGNvbnRpbnVlfGNob2ljZS57dGFyZ2V0PVxcXFxTezAsMjAwfVthLXpBLVowLTldfSkkJyxcblxuICAvLyBEYXRhIHJhbmdlc1xuICBzY2FsZWRfcmFuZ2U6ICctMSMxJyxcbiAgYXVkaW9fcmFuZ2U6ICcwIyonLFxuICBzcGVlZF9yYW5nZTogJzAjKicsXG4gIHRleHRfcmFuZ2U6ICctMSMxJyxcbiAgcHJvZ3Jlc3NfcmFuZ2U6ICcwIzEnLFxufTtcbiIsIi8vIEBmbG93XG5pbXBvcnQge3Njb3JtMjAwNF9yZWdleH0gZnJvbSAnLi9yZWdleCc7XG5cbmV4cG9ydCBjb25zdCBsZWFybmVyX3Jlc3BvbnNlcyA9IHtcbiAgJ3RydWUtZmFsc2UnOiB7XG4gICAgZm9ybWF0OiAnXnRydWUkfF5mYWxzZSQnLFxuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG4gICdjaG9pY2UnOiB7XG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIG1heDogMzYsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICB1bmlxdWU6IHRydWUsXG4gIH0sXG4gICdmaWxsLWluJzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSUxhbmdTdHJpbmcyNTAsXG4gICAgbWF4OiAxMCxcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG4gICdsb25nLWZpbGwtaW4nOiB7XG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JTGFuZ1N0cmluZzQwMDAsXG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ21hdGNoaW5nJzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBmb3JtYXQyOiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIG1heDogMzYsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICBkZWxpbWl0ZXIyOiAnWy5dJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAncGVyZm9ybWFuY2UnOiB7XG4gICAgZm9ybWF0OiAnXiR8JyArIHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgZm9ybWF0Mjogc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwgKyAnfF4kfCcgK1xuICAgICAgICBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIG1heDogMjUwLFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgZGVsaW1pdGVyMjogJ1suXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ3NlcXVlbmNpbmcnOiB7XG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIG1heDogMzYsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAnbGlrZXJ0Jzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAnbnVtZXJpYyc6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsLFxuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG4gICdvdGhlcic6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTdHJpbmc0MDAwLFxuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3QgY29ycmVjdF9yZXNwb25zZXMgPSB7XG4gICd0cnVlLWZhbHNlJzoge1xuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6ICdedHJ1ZSR8XmZhbHNlJCcsXG4gICAgbGltaXQ6IDEsXG4gIH0sXG4gICdjaG9pY2UnOiB7XG4gICAgbWF4OiAzNixcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIHVuaXF1ZTogdHJ1ZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgfSxcbiAgJ2ZpbGwtaW4nOiB7XG4gICAgbWF4OiAxMCxcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nU3RyaW5nMjUwY3IsXG4gIH0sXG4gICdsb25nLWZpbGwtaW4nOiB7XG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IHRydWUsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JTGFuZ1N0cmluZzQwMDAsXG4gIH0sXG4gICdtYXRjaGluZyc6IHtcbiAgICBtYXg6IDM2LFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgZGVsaW1pdGVyMjogJ1suXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBmb3JtYXQyOiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICB9LFxuICAncGVyZm9ybWFuY2UnOiB7XG4gICAgbWF4OiAyNTAsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICBkZWxpbWl0ZXIyOiAnWy5dJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiAnXiR8JyArIHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgZm9ybWF0Mjogc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwgKyAnfF4kfCcgK1xuICAgICAgICBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICB9LFxuICAnc2VxdWVuY2luZyc6IHtcbiAgICBtYXg6IDM2LFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgfSxcbiAgJ2xpa2VydCc6IHtcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIGxpbWl0OiAxLFxuICB9LFxuICAnbnVtZXJpYyc6IHtcbiAgICBtYXg6IDIsXG4gICAgZGVsaW1pdGVyOiAnWzpdJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCxcbiAgICBsaW1pdDogMSxcbiAgfSxcbiAgJ290aGVyJzoge1xuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTdHJpbmc0MDAwLFxuICAgIGxpbWl0OiAxLFxuICB9LFxufTtcbiIsIi8vIEBmbG93XG5cbi8qKlxuICogRGF0YSBWYWxpZGF0aW9uIEV4Y2VwdGlvblxuICovXG5leHBvcnQgY2xhc3MgVmFsaWRhdGlvbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgdG8gdGFrZSBpbiBhbiBlcnJvciBtZXNzYWdlIGFuZCBjb2RlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBlcnJvckNvZGVcbiAgICovXG4gIGNvbnN0cnVjdG9yKGVycm9yQ29kZTogbnVtYmVyKSB7XG4gICAgc3VwZXIoZXJyb3JDb2RlKTtcbiAgICB0aGlzLiNlcnJvckNvZGUgPSBlcnJvckNvZGU7XG4gIH1cblxuICAjZXJyb3JDb2RlO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNlcnJvckNvZGVcbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cbiAgZ2V0IGVycm9yQ29kZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jZXJyb3JDb2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyeWluZyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdCBFcnJvciBtZXNzYWdlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBtZXNzYWdlKCkge1xuICAgIHJldHVybiB0aGlzLiNlcnJvckNvZGUgKyAnJztcbiAgfVxufVxuIiwiaW1wb3J0IFNjb3JtMjAwNEFQSSBmcm9tICcuL1Njb3JtMjAwNEFQSSc7XG5pbXBvcnQgU2Nvcm0xMkFQSSBmcm9tICcuL1Njb3JtMTJBUEknO1xuaW1wb3J0IEFJQ0MgZnJvbSAnLi9BSUNDJztcblxud2luZG93LlNjb3JtMTJBUEkgPSBTY29ybTEyQVBJO1xud2luZG93LlNjb3JtMjAwNEFQSSA9IFNjb3JtMjAwNEFQSTtcbndpbmRvdy5BSUNDID0gQUlDQztcbiIsIi8vIEBmbG93XG5leHBvcnQgY29uc3QgU0VDT05EU19QRVJfU0VDT05EID0gMS4wO1xuZXhwb3J0IGNvbnN0IFNFQ09ORFNfUEVSX01JTlVURSA9IDYwO1xuZXhwb3J0IGNvbnN0IFNFQ09ORFNfUEVSX0hPVVIgPSA2MCAqIFNFQ09ORFNfUEVSX01JTlVURTtcbmV4cG9ydCBjb25zdCBTRUNPTkRTX1BFUl9EQVkgPSAyNCAqIFNFQ09ORFNfUEVSX0hPVVI7XG5cbmNvbnN0IGRlc2lnbmF0aW9ucyA9IFtcbiAgWydEJywgU0VDT05EU19QRVJfREFZXSxcbiAgWydIJywgU0VDT05EU19QRVJfSE9VUl0sXG4gIFsnTScsIFNFQ09ORFNfUEVSX01JTlVURV0sXG4gIFsnUycsIFNFQ09ORFNfUEVSX1NFQ09ORF0sXG5dO1xuXG4vKipcbiAqIENvbnZlcnRzIGEgTnVtYmVyIHRvIGEgU3RyaW5nIG9mIEhIOk1NOlNTXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHRvdGFsU2Vjb25kc1xuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2Vjb25kc0FzSEhNTVNTKHRvdGFsU2Vjb25kczogTnVtYmVyKSB7XG4gIC8vIFNDT1JNIHNwZWMgZG9lcyBub3QgZGVhbCB3aXRoIG5lZ2F0aXZlIGR1cmF0aW9ucywgZ2l2ZSB6ZXJvIGJhY2tcbiAgaWYgKCF0b3RhbFNlY29uZHMgfHwgdG90YWxTZWNvbmRzIDw9IDApIHtcbiAgICByZXR1cm4gJzAwOjAwOjAwJztcbiAgfVxuXG4gIGNvbnN0IGhvdXJzID0gTWF0aC5mbG9vcih0b3RhbFNlY29uZHMgLyBTRUNPTkRTX1BFUl9IT1VSKTtcblxuICBjb25zdCBkYXRlT2JqID0gbmV3IERhdGUodG90YWxTZWNvbmRzICogMTAwMCk7XG4gIGNvbnN0IG1pbnV0ZXMgPSBkYXRlT2JqLmdldFVUQ01pbnV0ZXMoKTtcbiAgLy8gbWFrZSBzdXJlIHdlIGFkZCBhbnkgcG9zc2libGUgZGVjaW1hbCB2YWx1ZVxuICBjb25zdCBzZWNvbmRzID0gZGF0ZU9iai5nZXRTZWNvbmRzKCkgKyAodG90YWxTZWNvbmRzICUgMS4wKTtcblxuICByZXR1cm4gaG91cnMudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpICsgJzonICtcbiAgICAgIG1pbnV0ZXMudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpICsgJzonICtcbiAgICAgIHNlY29uZHMudG9TdHJpbmcoKS5wYWRTdGFydCgyLCAnMCcpO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZSB0aGUgbnVtYmVyIG9mIHNlY29uZHMgZnJvbSBJU08gODYwMSBEdXJhdGlvblxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBzZWNvbmRzXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZWNvbmRzQXNJU09EdXJhdGlvbihzZWNvbmRzOiBOdW1iZXIpIHtcbiAgLy8gU0NPUk0gc3BlYyBkb2VzIG5vdCBkZWFsIHdpdGggbmVnYXRpdmUgZHVyYXRpb25zLCBnaXZlIHplcm8gYmFja1xuICBpZiAoIXNlY29uZHMgfHwgc2Vjb25kcyA8PSAwKSB7XG4gICAgcmV0dXJuICdQVDBTJztcbiAgfVxuXG4gIGxldCBkdXJhdGlvbiA9ICdQJztcbiAgbGV0IHJlbWFpbmRlciA9IHNlY29uZHM7XG5cbiAgZGVzaWduYXRpb25zLmZvckVhY2goKFtzaWduLCBjdXJyZW50X3NlY29uZHNdKSA9PiB7XG4gICAgbGV0IHZhbHVlID0gTWF0aC5mbG9vcihyZW1haW5kZXIgLyBjdXJyZW50X3NlY29uZHMpO1xuXG4gICAgcmVtYWluZGVyID0gcmVtYWluZGVyICUgY3VycmVudF9zZWNvbmRzO1xuICAgIC8vIElmIHdlIGhhdmUgYW55dGhpbmcgbGVmdCBpbiB0aGUgcmVtYWluZGVyLCBhbmQgd2UncmUgY3VycmVudGx5IGFkZGluZ1xuICAgIC8vIHNlY29uZHMgdG8gdGhlIGR1cmF0aW9uLCBnbyBhaGVhZCBhbmQgYWRkIHRoZSBkZWNpbWFsIHRvIHRoZSBzZWNvbmRzXG4gICAgaWYgKHNpZ24gPT09ICdTJyAmJiByZW1haW5kZXIgPiAwKSB7XG4gICAgICB2YWx1ZSArPSByZW1haW5kZXI7XG4gICAgfVxuXG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBpZiAoKGR1cmF0aW9uLmluZGV4T2YoJ0QnKSA+IDAgfHxcbiAgICAgICAgICBzaWduID09PSAnSCcgfHwgc2lnbiA9PT0gJ00nIHx8IHNpZ24gPT09ICdTJykgJiZcbiAgICAgICAgICBkdXJhdGlvbi5pbmRleE9mKCdUJykgPT09IC0xKSB7XG4gICAgICAgIGR1cmF0aW9uICs9ICdUJztcbiAgICAgIH1cbiAgICAgIGR1cmF0aW9uICs9IGAke3ZhbHVlfSR7c2lnbn1gO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGR1cmF0aW9uO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZSB0aGUgbnVtYmVyIG9mIHNlY29uZHMgZnJvbSBISDpNTTpTUy5ERERERERcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGltZVN0cmluZ1xuICogQHBhcmFtIHtSZWdFeHB9IHRpbWVSZWdleFxuICogQHJldHVybiB7bnVtYmVyfVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGltZUFzU2Vjb25kcyh0aW1lU3RyaW5nOiBTdHJpbmcsIHRpbWVSZWdleDogUmVnRXhwKSB7XG4gIGlmICghdGltZVN0cmluZyB8fCB0eXBlb2YgdGltZVN0cmluZyAhPT0gJ3N0cmluZycgfHxcbiAgICAgICF0aW1lU3RyaW5nLm1hdGNoKHRpbWVSZWdleCkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICBjb25zdCBwYXJ0cyA9IHRpbWVTdHJpbmcuc3BsaXQoJzonKTtcbiAgY29uc3QgaG91cnMgPSBOdW1iZXIocGFydHNbMF0pO1xuICBjb25zdCBtaW51dGVzID0gTnVtYmVyKHBhcnRzWzFdKTtcbiAgY29uc3Qgc2Vjb25kcyA9IE51bWJlcihwYXJ0c1syXSk7XG4gIHJldHVybiAoaG91cnMgKiAzNjAwKSArIChtaW51dGVzICogNjApICsgc2Vjb25kcztcbn1cblxuLyoqXG4gKiBDYWxjdWxhdGUgdGhlIG51bWJlciBvZiBzZWNvbmRzIGZyb20gSVNPIDg2MDEgRHVyYXRpb25cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZHVyYXRpb25cbiAqIEBwYXJhbSB7UmVnRXhwfSBkdXJhdGlvblJlZ2V4XG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXREdXJhdGlvbkFzU2Vjb25kcyhkdXJhdGlvbjogU3RyaW5nLCBkdXJhdGlvblJlZ2V4OiBSZWdFeHApIHtcbiAgaWYgKCFkdXJhdGlvbiB8fCAhZHVyYXRpb24ubWF0Y2goZHVyYXRpb25SZWdleCkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGNvbnN0IFssIHllYXJzLCBtb250aHMsICwgZGF5cywgaG91cnMsIG1pbnV0ZXMsIHNlY29uZHNdID0gbmV3IFJlZ0V4cChcbiAgICAgIGR1cmF0aW9uUmVnZXgpLmV4ZWMoZHVyYXRpb24pIHx8IFtdO1xuXG4gIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gIGNvbnN0IGFuY2hvciA9IG5ldyBEYXRlKG5vdyk7XG4gIGFuY2hvci5zZXRGdWxsWWVhcihhbmNob3IuZ2V0RnVsbFllYXIoKSArIE51bWJlcih5ZWFycyB8fCAwKSk7XG4gIGFuY2hvci5zZXRNb250aChhbmNob3IuZ2V0TW9udGgoKSArIE51bWJlcihtb250aHMgfHwgMCkpO1xuICBhbmNob3Iuc2V0RGF0ZShhbmNob3IuZ2V0RGF0ZSgpICsgTnVtYmVyKGRheXMgfHwgMCkpO1xuICBhbmNob3Iuc2V0SG91cnMoYW5jaG9yLmdldEhvdXJzKCkgKyBOdW1iZXIoaG91cnMgfHwgMCkpO1xuICBhbmNob3Iuc2V0TWludXRlcyhhbmNob3IuZ2V0TWludXRlcygpICsgTnVtYmVyKG1pbnV0ZXMgfHwgMCkpO1xuICBhbmNob3Iuc2V0U2Vjb25kcyhhbmNob3IuZ2V0U2Vjb25kcygpICsgTnVtYmVyKHNlY29uZHMgfHwgMCkpO1xuICBpZiAoc2Vjb25kcyAmJiBTdHJpbmcoc2Vjb25kcykuaW5kZXhPZignLicpID4gMCkge1xuICAgIGNvbnN0IG1pbGxpc2Vjb25kcyA9IE51bWJlcihOdW1iZXIoc2Vjb25kcykgJSAxKS50b0ZpeGVkKDYpICogMTAwMC4wO1xuICAgIGFuY2hvci5zZXRNaWxsaXNlY29uZHMoYW5jaG9yLmdldE1pbGxpc2Vjb25kcygpICsgbWlsbGlzZWNvbmRzKTtcbiAgfVxuXG4gIHJldHVybiAoKGFuY2hvciAqIDEuMCkgLSBub3cpIC8gMTAwMC4wO1xufVxuXG4vKipcbiAqIEFkZHMgdG9nZXRoZXIgdHdvIElTTzg2MDEgRHVyYXRpb24gc3RyaW5nc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaXJzdFxuICogQHBhcmFtIHtzdHJpbmd9IHNlY29uZFxuICogQHBhcmFtIHtSZWdFeHB9IGR1cmF0aW9uUmVnZXhcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZFR3b0R1cmF0aW9ucyhcbiAgICBmaXJzdDogU3RyaW5nLFxuICAgIHNlY29uZDogU3RyaW5nLFxuICAgIGR1cmF0aW9uUmVnZXg6IFJlZ0V4cCkge1xuICBjb25zdCBmaXJzdFNlY29uZHMgPSBnZXREdXJhdGlvbkFzU2Vjb25kcyhmaXJzdCwgZHVyYXRpb25SZWdleCk7XG4gIGNvbnN0IHNlY29uZFNlY29uZHMgPSBnZXREdXJhdGlvbkFzU2Vjb25kcyhzZWNvbmQsIGR1cmF0aW9uUmVnZXgpO1xuXG4gIHJldHVybiBnZXRTZWNvbmRzQXNJU09EdXJhdGlvbihmaXJzdFNlY29uZHMgKyBzZWNvbmRTZWNvbmRzKTtcbn1cblxuLyoqXG4gKiBBZGQgdG9nZXRoZXIgdHdvIEhIOk1NOlNTLkREIHN0cmluZ3NcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZmlyc3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBzZWNvbmRcbiAqIEBwYXJhbSB7UmVnRXhwfSB0aW1lUmVnZXhcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZEhITU1TU1RpbWVTdHJpbmdzKFxuICAgIGZpcnN0OiBTdHJpbmcsXG4gICAgc2Vjb25kOiBTdHJpbmcsXG4gICAgdGltZVJlZ2V4OiBSZWdFeHApIHtcbiAgY29uc3QgZmlyc3RTZWNvbmRzID0gZ2V0VGltZUFzU2Vjb25kcyhmaXJzdCwgdGltZVJlZ2V4KTtcbiAgY29uc3Qgc2Vjb25kU2Vjb25kcyA9IGdldFRpbWVBc1NlY29uZHMoc2Vjb25kLCB0aW1lUmVnZXgpO1xuICByZXR1cm4gZ2V0U2Vjb25kc0FzSEhNTVNTKGZpcnN0U2Vjb25kcyArIHNlY29uZFNlY29uZHMpO1xufVxuXG4vKipcbiAqIEZsYXR0ZW4gYSBKU09OIG9iamVjdCBkb3duIHRvIHN0cmluZyBwYXRocyBmb3IgZWFjaCB2YWx1ZXNcbiAqIEBwYXJhbSB7b2JqZWN0fSBkYXRhXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuKGRhdGEpIHtcbiAgY29uc3QgcmVzdWx0ID0ge307XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2UgdGhyb3VnaCB0aGUgb2JqZWN0XG4gICAqIEBwYXJhbSB7Kn0gY3VyXG4gICAqIEBwYXJhbSB7Kn0gcHJvcFxuICAgKi9cbiAgZnVuY3Rpb24gcmVjdXJzZShjdXIsIHByb3ApIHtcbiAgICBpZiAoT2JqZWN0KGN1cikgIT09IGN1cikge1xuICAgICAgcmVzdWx0W3Byb3BdID0gY3VyO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShjdXIpKSB7XG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGN1ci5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgcmVjdXJzZShjdXJbaV0sIHByb3AgKyAnWycgKyBpICsgJ10nKTtcbiAgICAgICAgaWYgKGwgPT09IDApIHJlc3VsdFtwcm9wXSA9IFtdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgaXNFbXB0eSA9IHRydWU7XG4gICAgICBmb3IgKGNvbnN0IHAgaW4gY3VyKSB7XG4gICAgICAgIGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGN1ciwgcCkpIHtcbiAgICAgICAgICBpc0VtcHR5ID0gZmFsc2U7XG4gICAgICAgICAgcmVjdXJzZShjdXJbcF0sIHByb3AgPyBwcm9wICsgJy4nICsgcCA6IHApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaXNFbXB0eSAmJiBwcm9wKSByZXN1bHRbcHJvcF0gPSB7fTtcbiAgICB9XG4gIH1cblxuICByZWN1cnNlKGRhdGEsICcnKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBVbi1mbGF0dGVuIGEgZmxhdCBKU09OIG9iamVjdFxuICogQHBhcmFtIHtvYmplY3R9IGRhdGFcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVuZmxhdHRlbihkYXRhKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgaWYgKE9iamVjdChkYXRhKSAhPT0gZGF0YSB8fCBBcnJheS5pc0FycmF5KGRhdGEpKSByZXR1cm4gZGF0YTtcbiAgY29uc3QgcmVnZXggPSAvXFwuPyhbXi5bXFxdXSspfFxcWyhcXGQrKV0vZztcbiAgY29uc3QgcmVzdWx0ID0ge307XG4gIGZvciAoY29uc3QgcCBpbiBkYXRhKSB7XG4gICAgaWYgKHt9Lmhhc093blByb3BlcnR5LmNhbGwoZGF0YSwgcCkpIHtcbiAgICAgIGxldCBjdXIgPSByZXN1bHQ7XG4gICAgICBsZXQgcHJvcCA9ICcnO1xuICAgICAgbGV0IG0gPSByZWdleC5leGVjKHApO1xuICAgICAgd2hpbGUgKG0pIHtcbiAgICAgICAgY3VyID0gY3VyW3Byb3BdIHx8IChjdXJbcHJvcF0gPSAobVsyXSA/IFtdIDoge30pKTtcbiAgICAgICAgcHJvcCA9IG1bMl0gfHwgbVsxXTtcbiAgICAgICAgbSA9IHJlZ2V4LmV4ZWMocCk7XG4gICAgICB9XG4gICAgICBjdXJbcHJvcF0gPSBkYXRhW3BdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0WycnXSB8fCByZXN1bHQ7XG59XG4iXX0=
