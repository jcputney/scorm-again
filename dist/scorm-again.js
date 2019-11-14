(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Scorm12API2 = _interopRequireDefault(require("./Scorm12API"));

var _aicc_cmi = require("./cmi/aicc_cmi");

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

/**
 * The AICC API class
 */
var AICC =
/*#__PURE__*/
function (_Scorm12API) {
  _inherits(AICC, _Scorm12API);

  /**
   * Constructor to create AICC API object
   */
  function AICC() {
    var _this;

    _classCallCheck(this, AICC);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AICC).call(this));
    _this.cmi = new _aicc_cmi.CMI(_assertThisInitialized(_this));
    _this.nav = new _aicc_cmi.NAV(_assertThisInitialized(_this));
    return _this;
  }
  /**
   * Gets or builds a new child element to add to the array.
   *
   * @param {string} CMIElement
   * @param {any} value
   * @return {object}
   */


  _createClass(AICC, [{
    key: "getChildElement",
    value: function getChildElement(CMIElement, value) {
      var newChild = _get(_getPrototypeOf(AICC.prototype), "getChildElement", this).call(this, CMIElement);

      if (!newChild) {
        if (this.stringContains(CMIElement, 'cmi.evaluation.comments')) {
          newChild = new _aicc_cmi.CMIEvaluationCommentsObject(this);
        } else if (this.stringContains(CMIElement, 'cmi.student_data.tries')) {
          newChild = new _aicc_cmi.CMITriesObject(this);
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

},{"./Scorm12API":3,"./cmi/aicc_cmi":5}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _common = require("./cmi/common");

var _exceptions = require("./exceptions");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

var api_constants = {
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
   */
  function BaseAPI(error_codes) {
    _classCallCheck(this, BaseAPI);

    _timeout.set(this, {
      writable: true,
      value: void 0
    });

    _error_codes.set(this, {
      writable: true,
      value: void 0
    });

    _defineProperty(this, "cmi", void 0);

    this.currentState = api_constants.STATE_NOT_INITIALIZED;
    this.apiLogLevel = api_constants.LOG_LEVEL_ERROR;
    this.lastErrorCode = 0;
    this.listenerArray = [];

    _classPrivateFieldSet(this, _timeout, null);

    _classPrivateFieldSet(this, _error_codes, error_codes);
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
      var returnValue = api_constants.SCORM_FALSE;

      if (this.isInitialized()) {
        this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).INITIALIZED, initializeMessage);
      } else if (this.isTerminated()) {
        this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).TERMINATED, terminationMessage);
      } else {
        this.currentState = api_constants.STATE_INITIALIZED;
        this.lastErrorCode = 0;
        returnValue = api_constants.SCORM_TRUE;
        this.processListeners(callbackName);
      }

      this.apiLog(callbackName, null, 'returned: ' + returnValue, api_constants.LOG_LEVEL_INFO);
      this.clearSCORMError(returnValue);
      return returnValue;
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
      var returnValue = api_constants.SCORM_FALSE;

      if (this.checkState(checkTerminated, _classPrivateFieldGet(this, _error_codes).TERMINATION_BEFORE_INIT, _classPrivateFieldGet(this, _error_codes).MULTIPLE_TERMINATION)) {
        if (checkTerminated) this.lastErrorCode = 0;
        this.currentState = api_constants.STATE_TERMINATED;
        returnValue = api_constants.SCORM_TRUE;
        this.processListeners(callbackName);
      }

      this.apiLog(callbackName, null, 'returned: ' + returnValue, api_constants.LOG_LEVEL_INFO);
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
      var returnValue = '';

      if (this.checkState(checkTerminated, _classPrivateFieldGet(this, _error_codes).RETRIEVE_BEFORE_INIT, _classPrivateFieldGet(this, _error_codes).RETRIEVE_AFTER_TERM)) {
        if (checkTerminated) this.lastErrorCode = 0;
        returnValue = this.getCMIValue(CMIElement);
        this.processListeners(callbackName, CMIElement);
      }

      this.apiLog(callbackName, CMIElement, ': returned: ' + returnValue, api_constants.LOG_LEVEL_INFO);
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
      var returnValue = api_constants.SCORM_FALSE;

      if (this.checkState(checkTerminated, _classPrivateFieldGet(this, _error_codes).STORE_BEFORE_INIT, _classPrivateFieldGet(this, _error_codes).STORE_AFTER_TERM)) {
        if (checkTerminated) this.lastErrorCode = 0;

        try {
          returnValue = this.setCMIValue(CMIElement, value);
        } catch (e) {
          if (e instanceof _exceptions.ValidationError) {
            returnValue = api_constants.SCORM_FALSE;
          } else {
            this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).GENERAL);
          }
        }

        this.processListeners(callbackName, CMIElement, value);
      }

      if (returnValue === undefined) returnValue = api_constants.SCORM_FALSE;
      this.apiLog(callbackName, CMIElement, ': ' + value + ': result: ' + returnValue, api_constants.LOG_LEVEL_INFO);
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
      var returnValue = api_constants.SCORM_FALSE;

      if (this.checkState(checkTerminated, _classPrivateFieldGet(this, _error_codes).COMMIT_BEFORE_INIT, _classPrivateFieldGet(this, _error_codes).COMMIT_AFTER_TERM)) {
        if (checkTerminated) this.lastErrorCode = 0;
        returnValue = api_constants.SCORM_TRUE;
        this.processListeners(callbackName);
      }

      this.apiLog(callbackName, null, 'returned: ' + returnValue, api_constants.LOG_LEVEL_INFO);
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
      this.apiLog(callbackName, null, 'returned: ' + returnValue, api_constants.LOG_LEVEL_INFO);
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

      this.apiLog(callbackName, null, 'returned: ' + returnValue, api_constants.LOG_LEVEL_INFO);
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

      this.apiLog(callbackName, null, 'returned: ' + returnValue, api_constants.LOG_LEVEL_INFO);
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
          case api_constants.LOG_LEVEL_ERROR:
            console.error(logMessage);
            break;

          case api_constants.LOG_LEVEL_WARNING:
            console.warn(logMessage);
            break;

          case api_constants.LOG_LEVEL_INFO:
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
    key: "stringContains",
    value: function stringContains(str, tester) {
      return str.indexOf(tester) > -1;
    }
    /**
     * Returns the message that corresponds to errorNumber
     * APIs that inherit BaseAPI should override this function
     *
     * @param {(string|number)} _errorNumber
     * @param {boolean} _detail
     * @return {string}
     */

  }, {
    key: "getLmsErrorMessageDetails",
    value: function getLmsErrorMessageDetails(_errorNumber, _detail) {
      return 'No error';
    }
    /**
     * Gets the value for the specific element.
     * APIs that inherit BaseAPI should override this function
     *
     * @param {string} _CMIElement
     * @return {string}
     */

  }, {
    key: "getCMIValue",
    value: function getCMIValue(_CMIElement) {
      return '';
    }
    /**
     * Sets the value for the specific element.
     * APIs that inherit BaseAPI should override this function
     *
     * @param {string} _CMIElement
     * @param {any} _value
     * @return {string}
     */

  }, {
    key: "setCMIValue",
    value: function setCMIValue(_CMIElement, _value) {
      return api_constants.SCORM_FALSE;
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
        return api_constants.SCORM_FALSE;
      }

      var structure = CMIElement.split('.');
      var refObject = this;
      var returnValue = api_constants.SCORM_FALSE;
      var invalidErrorMessage = "The data model element passed to ".concat(methodName, " (").concat(CMIElement, ") is not a valid SCORM data model element.");
      var invalidErrorCode = scorm2004 ? _classPrivateFieldGet(this, _error_codes).UNDEFINED_DATA_MODEL : _classPrivateFieldGet(this, _error_codes).GENERAL;

      for (var i = 0; i < structure.length; i++) {
        var attribute = structure[i];

        if (i === structure.length - 1) {
          if (scorm2004 && attribute.substr(0, 8) === '{target=' && typeof refObject._isTargetValid == 'function') {
            this.throwSCORMError(_classPrivateFieldGet(this, _error_codes).READ_ONLY_ELEMENT);
          } else if (!Object.hasOwnProperty.call(refObject, attribute) && !Object.getOwnPropertyDescriptor(Object.getPrototypeOf(refObject), attribute)) {
            this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
          } else {
            if (this.stringContains(CMIElement, '.correct_responses')) {
              this.validateCorrectResponse(CMIElement, value);
            }

            if (!scorm2004 || this.lastErrorCode === 0) {
              refObject[attribute] = value;
              returnValue = api_constants.SCORM_TRUE;
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
                var newChild = this.getChildElement(CMIElement, value);

                if (!newChild) {
                  this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
                } else {
                  refObject.childArray.push(newChild);
                  refObject = newChild;
                }
              } // Have to update i value to skip the array position


              i++;
            }
          }
        }
      }

      if (returnValue === api_constants.SCORM_FALSE) {
        this.apiLog(methodName, null, "There was an error setting the value for: ".concat(CMIElement, ", value of: ").concat(value), api_constants.LOG_LEVEL_WARNING);
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
     * @return {*}
     */

  }, {
    key: "getChildElement",
    value: function getChildElement(_CMIElement, _value) {
      return null;
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

      for (var i = 0; i < structure.length; i++) {
        attribute = structure[i];

        if (!scorm2004) {
          if (i === structure.length - 1) {
            if (!{}.hasOwnProperty.call(refObject, attribute)) {
              this.throwSCORMError(101, 'getCMIValue did not find a value for: ' + CMIElement);
            }
          }
        } else {
          if (String(attribute).substr(0, 8) === '{target=' && typeof refObject._isTargetValid == 'function') {
            var target = String(attribute).substr(8, String(attribute).length - 9);
            return refObject._isTargetValid(target);
          } else if (!{}.hasOwnProperty.call(refObject, attribute)) {
            this.throwSCORMError(401, 'The data model element passed to GetValue (' + CMIElement + ') is not a valid SCORM data model element.');
            return '';
          }
        }

        refObject = refObject[attribute];
      }

      if (refObject === null || refObject === undefined) {
        if (!scorm2004) {
          if (attribute === '_children') {
            this.throwSCORMError(202);
          } else if (attribute === '_count') {
            this.throwSCORMError(203);
          }
        }

        return '';
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
      return this.currentState === api_constants.STATE_INITIALIZED;
    }
    /**
     * Returns true if the API's current state is STATE_NOT_INITIALIZED
     *
     * @return {boolean}
     */

  }, {
    key: "isNotInitialized",
    value: function isNotInitialized() {
      return this.currentState === api_constants.STATE_NOT_INITIALIZED;
    }
    /**
     * Returns true if the API's current state is STATE_TERMINATED
     *
     * @return {boolean}
     */

  }, {
    key: "isTerminated",
    value: function isTerminated() {
      return this.currentState === api_constants.STATE_TERMINATED;
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

      this.apiLog('throwSCORMError', null, errorNumber + ': ' + message, api_constants.LOG_LEVEL_ERROR);
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
      if (success !== api_constants.SCORM_FALSE) {
        this.lastErrorCode = 0;
      }
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
    key: "renderCMIToJSON",
    value: function renderCMIToJSON() {
      var cmi = this.cmi; // Do we want/need to return fields that have no set value?
      // return JSON.stringify({ cmi }, (k, v) => v === undefined ? null : v, 2);

      return JSON.stringify({
        cmi: cmi
      });
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
  }]);

  return BaseAPI;
}();
/**
 * Private class that wraps a timeout call to the commit() function
 */


exports["default"] = BaseAPI;

var _timeout = new WeakMap();

var _error_codes = new WeakMap();

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

},{"./cmi/common":6,"./exceptions":15}],3:[function(require,module,exports){
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

var _regex = require("./constants/regex");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

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
   */
  function Scorm12API() {
    var _this;

    _classCallCheck(this, Scorm12API);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Scorm12API).call(this, _error_codes.scorm12_error_codes));
    _this.cmi = new _scorm12_cmi.CMI(_assertThisInitialized(_this)); // Rename functions to match 1.2 Spec and expose to modules

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
      return this.terminate('LMSFinish', false);
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
     * @return {object}
     */

  }, {
    key: "getChildElement",
    value: function getChildElement(CMIElement, value) {
      var newChild;

      if (this.stringContains(CMIElement, 'cmi.objectives')) {
        newChild = new _scorm12_cmi.CMIObjectivesObject(this);
      } else if (this.stringContains(CMIElement, '.correct_responses')) {
        newChild = new _scorm12_cmi.CMIInteractionsCorrectResponsesObject(this);
      } else if (this.stringContains(CMIElement, '.objectives')) {
        newChild = new _scorm12_cmi.CMIInteractionsObjectivesObject(this);
      } else if (this.stringContains(CMIElement, 'cmi.interactions')) {
        newChild = new _scorm12_cmi.CMIInteractionsObject(this);
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
     * Adds the current session time to the existing total time.
     *
     * @return {string}
     */

  }, {
    key: "getCurrentTotalTime",
    value: function getCurrentTotalTime() {
      var timeRegex = new RegExp(_regex.scorm12_regex.CMITime);
      var totalTime = this.cmi.core.total_time;
      var sessionTime = this.cmi.core.session_time;
      return Utilities.addHHMMSSTimeStrings(totalTime, sessionTime, timeRegex);
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
  }]);

  return Scorm12API;
}(_BaseAPI2["default"]);

exports["default"] = Scorm12API;

},{"./BaseAPI":2,"./cmi/scorm12_cmi":7,"./constants/api_constants":9,"./constants/error_codes":10,"./constants/regex":13,"./utilities":16}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _BaseAPI2 = _interopRequireDefault(require("./BaseAPI"));

var _scorm2004_cmi = require("./cmi/scorm2004_cmi");

var Util = _interopRequireWildcard(require("./utilities"));

var _api_constants = require("./constants/api_constants");

var _error_codes = require("./constants/error_codes");

var _response_constants = require("./constants/response_constants");

var _language_constants = require("./constants/language_constants");

var _regex = require("./constants/regex");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
   */
  function Scorm2004API() {
    var _this;

    _classCallCheck(this, Scorm2004API);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Scorm2004API).call(this, _error_codes.scorm2004_error_codes));

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

    _this.cmi = new _scorm2004_cmi.CMI(_assertThisInitialized(_this));
    _this.adl = new _scorm2004_cmi.ADL(_assertThisInitialized(_this)); // Rename functions to match 2004 Spec and expose to modules

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
      return this.initialize('Initialize');
    }
    /**
     * @return {string} bool
     */

  }, {
    key: "lmsTerminate",
    value: function lmsTerminate() {
      return this.terminate('Terminate', true);
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
     */

  }, {
    key: "setCMIValue",
    value: function setCMIValue(CMIElement, value) {
      this._commonSetCMIValue('SetValue', true, CMIElement, value);
    }
    /**
     * Gets or builds a new child element to add to the array.
     *
     * @param {string} CMIElement
     * @param {any} value
     * @return {any}
     */

  }, {
    key: "getChildElement",
    value: function getChildElement(CMIElement, value) {
      var newChild;

      if (this.stringContains(CMIElement, 'cmi.objectives')) {
        newChild = new _scorm2004_cmi.CMIObjectivesObject(this);
      } else if (this.stringContains(CMIElement, '.correct_responses')) {
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
          newChild = new _scorm2004_cmi.CMIInteractionsCorrectResponsesObject(this);
        }
      } else if (this.stringContains(CMIElement, '.objectives')) {
        newChild = new _scorm2004_cmi.CMIInteractionsObjectivesObject(this);
      } else if (this.stringContains(CMIElement, 'cmi.interactions')) {
        newChild = new _scorm2004_cmi.CMIInteractionsObject(this);
      } else if (this.stringContains(CMIElement, 'cmi.comments_from_learner')) {
        newChild = new _scorm2004_cmi.CMICommentsFromLearnerObject(this);
      } else if (this.stringContains(CMIElement, 'cmi.comments_from_lms')) {
        newChild = new _scorm2004_cmi.CMICommentsFromLMSObject(this);
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
     * Adds the current session time to the existing total time.
     *
     * @return {string} ISO8601 Duration
     */

  }, {
    key: "getCurrentTotalTime",
    value: function getCurrentTotalTime() {
      var totalTime = this.cmi.total_time;
      var sessionTime = this.cmi.session_time;
      return Util.addTwoDurations(totalTime, sessionTime, _regex.scorm2004_regex.CMITimespan);
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

},{"./BaseAPI":2,"./cmi/scorm2004_cmi":8,"./constants/api_constants":9,"./constants/error_codes":10,"./constants/language_constants":12,"./constants/regex":13,"./constants/response_constants":14,"./utilities":16}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NAV = exports.CMIEvaluationCommentsObject = exports.CMITriesObject = exports.CMITries = exports.CMI = void 0;

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
/**
 * Class for AICC Navigation object
 */


exports.CMIEvaluationCommentsObject = CMIEvaluationCommentsObject;

var _content = new WeakMap();

var _location = new WeakMap();

var _time2 = new WeakMap();

var NAV =
/*#__PURE__*/
function (_BaseCMI4) {
  _inherits(NAV, _BaseCMI4);

  /**
   * Constructor for NAV object
   */
  function NAV() {
    var _this6;

    _classCallCheck(this, NAV);

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(NAV).call(this));

    _event.set(_assertThisInitialized(_this6), {
      writable: true,
      value: ''
    });

    return _this6;
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
      return !this.jsonString ? (0, Scorm12CMI.throwWriteOnlyError)() : _classPrivateFieldGet(this, _event);
    }
    /**
     * Setter for #event
     * @param {string} event
     */
    ,
    set: function set(event) {
      if ((0, Scorm12CMI.check12ValidFormat)(event, regex.NAVEvent)) {
        _classPrivateFieldSet(this, _event, event);
      }
    }
  }]);

  return NAV;
}(_common.BaseCMI);

exports.NAV = NAV;

var _event = new WeakMap();

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
  function BaseCMI() {
    _classCallCheck(this, BaseCMI);

    _defineProperty(this, "jsonString", false);

    _initialized.set(this, {
      writable: true,
      value: false
    });
  }

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

    /**
     * Getter for #initialized
     * @return {boolean}
     */
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

    _classPrivateFieldSet(_assertThisInitialized(_this), _children2, score_children ? score_children : _api_constants.scorm12_constants.score_children);

    _classPrivateFieldSet(_assertThisInitialized(_this), _score_range, !score_range ? false : _regex.scorm12_regex.score_range);

    _classPrivateFieldSet(_assertThisInitialized(_this), _max, max || max === '' ? max : '100');

    _classPrivateFieldSet(_assertThisInitialized(_this), _invalid_error_code, invalidErrorCode ? invalidErrorCode : _error_codes.scorm12_error_codes.INVALID_SET_VALUE);

    _classPrivateFieldSet(_assertThisInitialized(_this), _invalid_type_code, invalidTypeCode ? invalidTypeCode : _error_codes.scorm12_error_codes.TYPE_MISMATCH);

    _classPrivateFieldSet(_assertThisInitialized(_this), _invalid_range_code, invalidRangeCode ? invalidRangeCode : _error_codes.scorm12_error_codes.VALUE_OUT_OF_RANGE);

    _classPrivateFieldSet(_assertThisInitialized(_this), _decimal_regex, decimalRegex ? decimalRegex : _regex.scorm12_regex.CMIDecimal);

    return _this;
  }

  _createClass(CMIScore, [{
    key: "toJSON",

    /**
     * toJSON for *.score
     * @return {{min: string, max: string, raw: string}}
     */
    value: function toJSON() {
      return {
        'raw': this.raw,
        'min': this.min,
        'max': this.max
      };
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
     * @private
     */
    get: function get() {
      return _classPrivateFieldGet(this, _children3);
    }
    /**
     * Setter for _children. Just throws an error.
     * @param {string} _children
     * @private
     */
    ,
    set: function set(_children) {
      throw new _exceptions.ValidationError(_classPrivateFieldGet(this, _errorCode));
    }
    /**
     * Getter for _count
     * @return {number}
     * @private
     */

  }, {
    key: "_count",
    get: function get() {
      return this.childArray.length;
    }
    /**
     * Setter for _count. Just throws an error.
     * @param {number} _count
     * @private
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
exports.CMIInteractionsCorrectResponsesObject = exports.CMIInteractionsObjectivesObject = exports.CMIObjectivesObject = exports.CMIInteractionsObject = exports.CMIStudentData = exports.CMI = void 0;

var _common = require("./common");

var _api_constants = require("../constants/api_constants");

var _error_codes = require("../constants/error_codes");

var _regex = require("../constants/regex");

var _exceptions = require("../exceptions");

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
 * @return {boolean}
 */


function check12ValidFormat(value, regexPattern) {
  return (0, _common.checkValidFormat)(value, regexPattern, _error_codes.scorm12_error_codes.TYPE_MISMATCH);
}
/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} rangePattern
 * @return {boolean}
 */


function check12ValidRange(value, rangePattern) {
  return (0, _common.checkValidRange)(value, rangePattern, _error_codes.scorm12_error_codes.VALUE_OUT_OF_RANGE);
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
      throwInvalidValueError();
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
     * Setter for #_version. Just throws an error.
     * @param {string} _children
     * @private
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
      value: ''
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
    key: "toJSON",

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
      if (check12ValidFormat(student_response, regex.CMIFeedback)) {
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
      if (check12ValidFormat(pattern, regex.CMIFeedback)) {
        _classPrivateFieldSet(this, _pattern, pattern);
      }
    }
  }]);

  return CMIInteractionsCorrectResponsesObject;
}(_common.BaseCMI);

exports.CMIInteractionsCorrectResponsesObject = CMIInteractionsCorrectResponsesObject;

var _pattern = new WeakMap();

},{"../constants/api_constants":9,"../constants/error_codes":10,"../constants/regex":13,"../exceptions":15,"./common":6}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ADL = exports.CMIInteractionsCorrectResponsesObject = exports.CMIInteractionsObjectivesObject = exports.CMICommentsFromLMSObject = exports.CMICommentsFromLearnerObject = exports.CMIObjectivesObject = exports.CMIInteractionsObject = exports.CMI = void 0;

var _common = require("./common");

var _api_constants = require("../constants/api_constants");

var _regex = require("../constants/regex");

var _error_codes = require("../constants/error_codes");

var _response_constants = require("../constants/response_constants");

var _exceptions = require("../exceptions");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }

function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new Error('failed to set property'); } return value; }

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

    if (initialized) _this.initialize();
    _this.learner_preference = new CMILearnerPreference();
    _this.score = new Scorm2004CMIScore();
    _this.comments_from_learner = new CMICommentsFromLearner();
    _this.comments_from_lms = new CMICommentsFromLMS();
    _this.interactions = new CMIInteractions();
    _this.objectives = new CMIObjectives();
    return _this;
  }
  /**
   * Called when the API has been initialized after the CMI has been created
   */


  _createClass(CMI, [{
    key: "initialize",
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
    key: "toJSON",

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
      invalidErrorCode: _error_codes.scorm2004_error_codes.INVALID_SET_VALUE,
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
 * Class representing SCORM 2004's cmi.comments_from_learner.n object
 */


var _scaled = new WeakMap();

var CMICommentsFromLearnerObject =
/*#__PURE__*/
function (_BaseCMI5) {
  _inherits(CMICommentsFromLearnerObject, _BaseCMI5);

  /**
   * Constructor for cmi.comments_from_learner.n
   */
  function CMICommentsFromLearnerObject() {
    var _this6;

    _classCallCheck(this, CMICommentsFromLearnerObject);

    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(CMICommentsFromLearnerObject).call(this));

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

    _classPrivateFieldSet(_assertThisInitialized(_this6), _comment, '');

    _classPrivateFieldSet(_assertThisInitialized(_this6), _location2, '');

    _classPrivateFieldSet(_assertThisInitialized(_this6), _timestamp2, '');

    return _this6;
  }
  /**
   * Getter for #comment
   * @return {string}
   */


  _createClass(CMICommentsFromLearnerObject, [{
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
      if (check2004ValidFormat(comment, regex.CMILangString4000, true)) {
        _classPrivateFieldSet(this, _comment, comment);
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
      if (check2004ValidFormat(location, regex.CMIString250)) {
        _classPrivateFieldSet(this, _location2, location);
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
      if (check2004ValidFormat(timestamp, regex.CMITime)) {
        _classPrivateFieldSet(this, _timestamp2, timestamp);
      }
    }
  }]);

  return CMICommentsFromLearnerObject;
}(_common.BaseCMI);
/**
 * Class representing SCORM 2004's cmi.comments_from_lms.n object
 */


exports.CMICommentsFromLearnerObject = CMICommentsFromLearnerObject;

var _comment = new WeakMap();

var _location2 = new WeakMap();

var _timestamp2 = new WeakMap();

var CMICommentsFromLMSObject =
/*#__PURE__*/
function (_CMICommentsFromLearn) {
  _inherits(CMICommentsFromLMSObject, _CMICommentsFromLearn);

  /**
   * Constructor for cmi.comments_from_lms.n
   */
  function CMICommentsFromLMSObject() {
    _classCallCheck(this, CMICommentsFromLMSObject);

    return _possibleConstructorReturn(this, _getPrototypeOf(CMICommentsFromLMSObject).call(this));
  }
  /**
   * Getter for #comment
   * @return {string}
   */


  _createClass(CMICommentsFromLMSObject, [{
    key: "toJSON",

    /**
     * toJSON for cmi.comments_from_lms.n
     * @return {
     *    {
     *      comment: string,
     *      location: string,
     *      timestamp: string
     *    }
     *  }
     */
    value: function toJSON() {
      return _get(_getPrototypeOf(CMICommentsFromLMSObject.prototype), "toJSON", this).call(this);
    }
  }, {
    key: "comment",
    get: function get() {
      return _get(_getPrototypeOf(CMICommentsFromLMSObject.prototype), "comment", this);
    }
    /**
     * Setter for #comment. Can only be called before  initialization.
     * @param {string} comment
     */
    ,
    set: function set(comment) {
      !this.initialized ? _set(_getPrototypeOf(CMICommentsFromLMSObject.prototype), "comment", comment, this, true) : throwReadOnlyError();
    }
    /**
     * Getter for #location
     * @return {string}
     */

  }, {
    key: "location",
    get: function get() {
      return _get(_getPrototypeOf(CMICommentsFromLMSObject.prototype), "location", this);
    }
    /**
     * Setter for #location. Can only be called before  initialization.
     * @param {string} location
     */
    ,
    set: function set(location) {
      !this.initialized ? _set(_getPrototypeOf(CMICommentsFromLMSObject.prototype), "location", location, this, true) : throwReadOnlyError();
    }
    /**
     * Getter for #timestamp
     * @return {string}
     */

  }, {
    key: "timestamp",
    get: function get() {
      return _get(_getPrototypeOf(CMICommentsFromLMSObject.prototype), "timestamp", this);
    }
    /**
     * Setter for #timestamp. Can only be called before  initialization.
     * @param {string} timestamp
     */
    ,
    set: function set(timestamp) {
      !this.initialized ? _set(_getPrototypeOf(CMICommentsFromLMSObject.prototype), "timestamp", timestamp, this, true) : throwReadOnlyError();
    }
  }]);

  return CMICommentsFromLMSObject;
}(CMICommentsFromLearnerObject);
/**
 * Class representing SCORM 2004's cmi.interactions.n.objectives.n object
 */


exports.CMICommentsFromLMSObject = CMICommentsFromLMSObject;

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

},{"../constants/api_constants":9,"../constants/error_codes":10,"../constants/regex":13,"../constants/response_constants":14,"../exceptions":15,"./common":6}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scorm2004_constants = exports.aicc_constants = exports.scorm12_constants = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  validTimestamp: ['10:06:57', '00:00:01.56', '23:59:59', '47:59:59'],
  invalidTimestamp: ['06:5:13', '23:59:59.123', 'P1DT23H59M59S']
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSecondsAsHHMMSS = getSecondsAsHHMMSS;
exports.getSecondsAsISODuration = getSecondsAsISODuration;
exports.getTimeAsSeconds = getTimeAsSeconds;
exports.getDurationAsSeconds = getDurationAsSeconds;
exports.addTwoDurations = addTwoDurations;
exports.addHHMMSSTimeStrings = addHHMMSSTimeStrings;
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
    return 'P0S';
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

},{}]},{},[1,2,5,6,7,8,9,10,11,12,13,14,15,3,4,16])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvQUlDQy5qcyIsInNyYy9CYXNlQVBJLmpzIiwic3JjL1Njb3JtMTJBUEkuanMiLCJzcmMvU2Nvcm0yMDA0QVBJLmpzIiwic3JjL2NtaS9haWNjX2NtaS5qcyIsInNyYy9jbWkvY29tbW9uLmpzIiwic3JjL2NtaS9zY29ybTEyX2NtaS5qcyIsInNyYy9jbWkvc2Nvcm0yMDA0X2NtaS5qcyIsInNyYy9jb25zdGFudHMvYXBpX2NvbnN0YW50cy5qcyIsInNyYy9jb25zdGFudHMvZXJyb3JfY29kZXMuanMiLCJzcmMvY29uc3RhbnRzL2ZpZWxkX3ZhbHVlcy5qcyIsInNyYy9jb25zdGFudHMvbGFuZ3VhZ2VfY29uc3RhbnRzLmpzIiwic3JjL2NvbnN0YW50cy9yZWdleC5qcyIsInNyYy9jb25zdGFudHMvcmVzcG9uc2VfY29uc3RhbnRzLmpzIiwic3JjL2V4Y2VwdGlvbnMuanMiLCJzcmMvdXRpbGl0aWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQ0NBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9BOzs7SUFHcUIsSTs7Ozs7QUFDbkI7OztBQUdBLGtCQUFjO0FBQUE7O0FBQUE7O0FBQ1o7QUFFQSxVQUFLLEdBQUwsR0FBVyxJQUFJLGFBQUosK0JBQVg7QUFDQSxVQUFLLEdBQUwsR0FBVyxJQUFJLGFBQUosK0JBQVg7QUFKWTtBQUtiO0FBRUQ7Ozs7Ozs7Ozs7O29DQU9nQixVLEVBQVksSyxFQUFPO0FBQ2pDLFVBQUksUUFBUSw2RUFBeUIsVUFBekIsQ0FBWjs7QUFFQSxVQUFJLENBQUMsUUFBTCxFQUFlO0FBQ2IsWUFBSSxLQUFLLGNBQUwsQ0FBb0IsVUFBcEIsRUFBZ0MseUJBQWhDLENBQUosRUFBZ0U7QUFDOUQsVUFBQSxRQUFRLEdBQUcsSUFBSSxxQ0FBSixDQUFnQyxJQUFoQyxDQUFYO0FBQ0QsU0FGRCxNQUVPLElBQUksS0FB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QUVBLFNBQU8sdUJBQXVCLENBQUMsWUFBWSxHQUFHLGFBQWhCLENBQTlCO0FBQ0Q7QUFFRDs7Ozs7Ozs7OztBQVFPLFNBQVMsb0JBQVQsQ0FDSCxLQURHLEVBRUgsTUFGRyxFQUdILFNBSEcsRUFHZ0I7QUFDckIsTUFBTSxZQUFZLEdBQUcsZ0JBQWdCLENBQUMsS0FBRCxFQUFRLFNBQVIsQ0FBckM7QUFDQSxNQUFNLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFELEVBQVMsU0FBVCxDQUF0QztBQUNBLFNBQU8sa0JBQWtCLENBQUMsWUFBWSxHQUFHLGFBQWhCLENBQXpCO0FBQ0QiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBAZmxvd1xuaW1wb3J0IFNjb3JtMTJBUEkgZnJvbSAnLi9TY29ybTEyQVBJJztcbmltcG9ydCB7XG4gIENNSSxcbiAgQ01JRXZhbHVhdGlvbkNvbW1lbnRzT2JqZWN0LFxuICBDTUlUcmllc09iamVjdCxcbiAgTkFWLFxufSBmcm9tICcuL2NtaS9haWNjX2NtaSc7XG5cbi8qKlxuICogVGhlIEFJQ0MgQVBJIGNsYXNzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFJQ0MgZXh0ZW5kcyBTY29ybTEyQVBJIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIHRvIGNyZWF0ZSBBSUNDIEFQSSBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmNtaSA9IG5ldyBDTUkodGhpcyk7XG4gICAgdGhpcy5uYXYgPSBuZXcgTkFWKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgb3IgYnVpbGRzIGEgbmV3IGNoaWxkIGVsZW1lbnQgdG8gYWRkIHRvIHRoZSBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHthbnl9IHZhbHVlXG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIGdldENoaWxkRWxlbWVudChDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgIGxldCBuZXdDaGlsZCA9IHN1cGVyLmdldENoaWxkRWxlbWVudChDTUlFbGVtZW50KTtcblxuICAgIGlmICghbmV3Q2hpbGQpIHtcbiAgICAgIGlmICh0aGlzLnN0cmluZ0NvbnRhaW5zKENNSUVsZW1lbnQsICdjbWkuZXZhbHVhdGlvbi5jb21tZW50cycpKSB7XG4gICAgICAgIG5ld0NoaWxkID0gbmV3IENNSUV2YWx1YXRpb25Db21tZW50c09iamVjdCh0aGlzKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zdHJpbmdDb250YWlucyhDTUlFbGVtZW50LCAnY21pLnN0dWRlbnRfZGF0YS50cmllcycpKSB7XG4gICAgICAgIG5ld0NoaWxkID0gbmV3IENNSVRyaWVzT2JqZWN0KHRoaXMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXdDaGlsZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIHRoZSB3aG9sZSBBUEkgd2l0aCBhbm90aGVyXG4gICAqXG4gICAqIEBwYXJhbSB7QUlDQ30gbmV3QVBJXG4gICAqL1xuICByZXBsYWNlV2l0aEFub3RoZXJTY29ybUFQSShuZXdBUEkpIHtcbiAgICAvLyBEYXRhIE1vZGVsXG4gICAgdGhpcy5jbWkgPSBuZXdBUEkuY21pO1xuICAgIHRoaXMubmF2ID0gbmV3QVBJLm5hdjtcbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCB7Q01JQXJyYXl9IGZyb20gJy4vY21pL2NvbW1vbic7XG5pbXBvcnQge1ZhbGlkYXRpb25FcnJvcn0gZnJvbSAnLi9leGNlcHRpb25zJztcblxuY29uc3QgYXBpX2NvbnN0YW50cyA9IHtcbiAgU0NPUk1fVFJVRTogJ3RydWUnLFxuICBTQ09STV9GQUxTRTogJ2ZhbHNlJyxcbiAgU1RBVEVfTk9UX0lOSVRJQUxJWkVEOiAwLFxuICBTVEFURV9JTklUSUFMSVpFRDogMSxcbiAgU1RBVEVfVEVSTUlOQVRFRDogMixcbiAgTE9HX0xFVkVMX0RFQlVHOiAxLFxuICBMT0dfTEVWRUxfSU5GTzogMixcbiAgTE9HX0xFVkVMX1dBUk5JTkc6IDMsXG4gIExPR19MRVZFTF9FUlJPUjogNCxcbiAgTE9HX0xFVkVMX05PTkU6IDUsXG59O1xuXG4vKipcbiAqIEJhc2UgQVBJIGNsYXNzIGZvciBBSUNDLCBTQ09STSAxLjIsIGFuZCBTQ09STSAyMDA0LiBTaG91bGQgYmUgY29uc2lkZXJlZFxuICogYWJzdHJhY3QsIGFuZCBuZXZlciBpbml0aWFsaXplZCBvbiBpdCdzIG93bi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZUFQSSB7XG4gICN0aW1lb3V0O1xuICAjZXJyb3JfY29kZXM7XG4gIGNtaTtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEJhc2UgQVBJIGNsYXNzLiBTZXRzIHNvbWUgc2hhcmVkIEFQSSBmaWVsZHMsIGFzIHdlbGwgYXNcbiAgICogc2V0cyB1cCBvcHRpb25zIGZvciB0aGUgQVBJLlxuICAgKiBAcGFyYW0ge29iamVjdH0gZXJyb3JfY29kZXNcbiAgICovXG4gIGNvbnN0cnVjdG9yKGVycm9yX2NvZGVzKSB7XG4gICAgdGhpcy5jdXJyZW50U3RhdGUgPSBhcGlfY29uc3RhbnRzLlNUQVRFX05PVF9JTklUSUFMSVpFRDtcbiAgICB0aGlzLmFwaUxvZ0xldmVsID0gYXBpX2NvbnN0YW50cy5MT0dfTEVWRUxfRVJST1I7XG4gICAgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcbiAgICB0aGlzLmxpc3RlbmVyQXJyYXkgPSBbXTtcblxuICAgIHRoaXMuI3RpbWVvdXQgPSBudWxsO1xuICAgIHRoaXMuI2Vycm9yX2NvZGVzID0gZXJyb3JfY29kZXM7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgQVBJXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGluaXRpYWxpemVNZXNzYWdlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXJtaW5hdGlvbk1lc3NhZ2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgaW5pdGlhbGl6ZShcbiAgICAgIGNhbGxiYWNrTmFtZTogU3RyaW5nLFxuICAgICAgaW5pdGlhbGl6ZU1lc3NhZ2U/OiBTdHJpbmcsXG4gICAgICB0ZXJtaW5hdGlvbk1lc3NhZ2U/OiBTdHJpbmcpIHtcbiAgICBsZXQgcmV0dXJuVmFsdWUgPSBhcGlfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuXG4gICAgaWYgKHRoaXMuaXNJbml0aWFsaXplZCgpKSB7XG4gICAgICB0aGlzLnRocm93U0NPUk1FcnJvcih0aGlzLiNlcnJvcl9jb2Rlcy5JTklUSUFMSVpFRCwgaW5pdGlhbGl6ZU1lc3NhZ2UpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc1Rlcm1pbmF0ZWQoKSkge1xuICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IodGhpcy4jZXJyb3JfY29kZXMuVEVSTUlOQVRFRCwgdGVybWluYXRpb25NZXNzYWdlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSBhcGlfY29uc3RhbnRzLlNUQVRFX0lOSVRJQUxJWkVEO1xuICAgICAgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcbiAgICAgIHJldHVyblZhbHVlID0gYXBpX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBudWxsLCAncmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgYXBpX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG4gICAgdGhpcy5jbGVhclNDT1JNRXJyb3IocmV0dXJuVmFsdWUpO1xuXG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRlcm1pbmF0ZXMgdGhlIGN1cnJlbnQgcnVuIG9mIHRoZSBBUElcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrVGVybWluYXRlZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICB0ZXJtaW5hdGUoXG4gICAgICBjYWxsYmFja05hbWU6IFN0cmluZyxcbiAgICAgIGNoZWNrVGVybWluYXRlZDogYm9vbGVhbikge1xuICAgIGxldCByZXR1cm5WYWx1ZSA9IGFwaV9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG5cbiAgICBpZiAodGhpcy5jaGVja1N0YXRlKGNoZWNrVGVybWluYXRlZCxcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuVEVSTUlOQVRJT05fQkVGT1JFX0lOSVQsXG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLk1VTFRJUExFX1RFUk1JTkFUSU9OKSkge1xuICAgICAgaWYgKGNoZWNrVGVybWluYXRlZCkgdGhpcy5sYXN0RXJyb3JDb2RlID0gMDtcbiAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gYXBpX2NvbnN0YW50cy5TVEFURV9URVJNSU5BVEVEO1xuICAgICAgcmV0dXJuVmFsdWUgPSBhcGlfY29uc3RhbnRzLlNDT1JNX1RSVUU7XG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBhcGlfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcbiAgICB0aGlzLmNsZWFyU0NPUk1FcnJvcihyZXR1cm5WYWx1ZSk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSB2YWx1ZSBvZiB0aGUgQ01JRWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrVGVybWluYXRlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXRWYWx1ZShcbiAgICAgIGNhbGxiYWNrTmFtZTogU3RyaW5nLFxuICAgICAgY2hlY2tUZXJtaW5hdGVkOiBib29sZWFuLFxuICAgICAgQ01JRWxlbWVudDogU3RyaW5nKSB7XG4gICAgbGV0IHJldHVyblZhbHVlID0gJyc7XG5cbiAgICBpZiAodGhpcy5jaGVja1N0YXRlKGNoZWNrVGVybWluYXRlZCxcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuUkVUUklFVkVfQkVGT1JFX0lOSVQsXG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLlJFVFJJRVZFX0FGVEVSX1RFUk0pKSB7XG4gICAgICBpZiAoY2hlY2tUZXJtaW5hdGVkKSB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuICAgICAgcmV0dXJuVmFsdWUgPSB0aGlzLmdldENNSVZhbHVlKENNSUVsZW1lbnQpO1xuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSwgQ01JRWxlbWVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBDTUlFbGVtZW50LCAnOiByZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBhcGlfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcbiAgICB0aGlzLmNsZWFyU0NPUk1FcnJvcihyZXR1cm5WYWx1ZSk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIENNSUVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHBhcmFtIHtib29sZWFufSBjaGVja1Rlcm1pbmF0ZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBzZXRWYWx1ZShcbiAgICAgIGNhbGxiYWNrTmFtZTogU3RyaW5nLFxuICAgICAgY2hlY2tUZXJtaW5hdGVkOiBib29sZWFuLFxuICAgICAgQ01JRWxlbWVudCxcbiAgICAgIHZhbHVlKSB7XG4gICAgbGV0IHJldHVyblZhbHVlID0gYXBpX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcblxuICAgIGlmICh0aGlzLmNoZWNrU3RhdGUoY2hlY2tUZXJtaW5hdGVkLCB0aGlzLiNlcnJvcl9jb2Rlcy5TVE9SRV9CRUZPUkVfSU5JVCxcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuU1RPUkVfQUZURVJfVEVSTSkpIHtcbiAgICAgIGlmIChjaGVja1Rlcm1pbmF0ZWQpIHRoaXMubGFzdEVycm9yQ29kZSA9IDA7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm5WYWx1ZSA9IHRoaXMuc2V0Q01JVmFsdWUoQ01JRWxlbWVudCwgdmFsdWUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIFZhbGlkYXRpb25FcnJvcikge1xuICAgICAgICAgIHJldHVyblZhbHVlID0gYXBpX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcih0aGlzLiNlcnJvcl9jb2Rlcy5HRU5FUkFMKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSwgQ01JRWxlbWVudCwgdmFsdWUpO1xuICAgIH1cblxuICAgIGlmIChyZXR1cm5WYWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm5WYWx1ZSA9IGFwaV9jb25zdGFudHMuU0NPUk1fRkFMU0U7XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIENNSUVsZW1lbnQsXG4gICAgICAgICc6ICcgKyB2YWx1ZSArICc6IHJlc3VsdDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBhcGlfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcbiAgICB0aGlzLmNsZWFyU0NPUk1FcnJvcihyZXR1cm5WYWx1ZSk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogT3JkZXJzIExNUyB0byBzdG9yZSBhbGwgY29udGVudCBwYXJhbWV0ZXJzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjYWxsYmFja05hbWVcbiAgICogQHBhcmFtIHtib29sZWFufSBjaGVja1Rlcm1pbmF0ZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgY29tbWl0KFxuICAgICAgY2FsbGJhY2tOYW1lOiBTdHJpbmcsXG4gICAgICBjaGVja1Rlcm1pbmF0ZWQ6IGJvb2xlYW4pIHtcbiAgICBsZXQgcmV0dXJuVmFsdWUgPSBhcGlfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuXG4gICAgaWYgKHRoaXMuY2hlY2tTdGF0ZShjaGVja1Rlcm1pbmF0ZWQsIHRoaXMuI2Vycm9yX2NvZGVzLkNPTU1JVF9CRUZPUkVfSU5JVCxcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuQ09NTUlUX0FGVEVSX1RFUk0pKSB7XG4gICAgICBpZiAoY2hlY2tUZXJtaW5hdGVkKSB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuICAgICAgcmV0dXJuVmFsdWUgPSBhcGlfY29uc3RhbnRzLlNDT1JNX1RSVUU7XG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBhcGlfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcbiAgICB0aGlzLmNsZWFyU0NPUk1FcnJvcihyZXR1cm5WYWx1ZSk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBsYXN0IGVycm9yIGNvZGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNhbGxiYWNrTmFtZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXRMYXN0RXJyb3IoY2FsbGJhY2tOYW1lOiBTdHJpbmcpIHtcbiAgICBjb25zdCByZXR1cm5WYWx1ZSA9IFN0cmluZyh0aGlzLmxhc3RFcnJvckNvZGUpO1xuXG4gICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSk7XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBhcGlfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBlcnJvck51bWJlciBlcnJvciBkZXNjcmlwdGlvblxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXIpfSBDTUlFcnJvckNvZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0RXJyb3JTdHJpbmcoY2FsbGJhY2tOYW1lOiBTdHJpbmcsIENNSUVycm9yQ29kZSkge1xuICAgIGxldCByZXR1cm5WYWx1ZSA9ICcnO1xuXG4gICAgaWYgKENNSUVycm9yQ29kZSAhPT0gbnVsbCAmJiBDTUlFcnJvckNvZGUgIT09ICcnKSB7XG4gICAgICByZXR1cm5WYWx1ZSA9IHRoaXMuZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhDTUlFcnJvckNvZGUpO1xuICAgICAgdGhpcy5wcm9jZXNzTGlzdGVuZXJzKGNhbGxiYWNrTmFtZSk7XG4gICAgfVxuXG4gICAgdGhpcy5hcGlMb2coY2FsbGJhY2tOYW1lLCBudWxsLCAncmV0dXJuZWQ6ICcgKyByZXR1cm5WYWx1ZSxcbiAgICAgICAgYXBpX2NvbnN0YW50cy5MT0dfTEVWRUxfSU5GTyk7XG5cbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGNvbXByZWhlbnNpdmUgZGVzY3JpcHRpb24gb2YgdGhlIGVycm9yTnVtYmVyIGVycm9yLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY2FsbGJhY2tOYW1lXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXIpfSBDTUlFcnJvckNvZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0RGlhZ25vc3RpYyhjYWxsYmFja05hbWU6IFN0cmluZywgQ01JRXJyb3JDb2RlKSB7XG4gICAgbGV0IHJldHVyblZhbHVlID0gJyc7XG5cbiAgICBpZiAoQ01JRXJyb3JDb2RlICE9PSBudWxsICYmIENNSUVycm9yQ29kZSAhPT0gJycpIHtcbiAgICAgIHJldHVyblZhbHVlID0gdGhpcy5nZXRMbXNFcnJvck1lc3NhZ2VEZXRhaWxzKENNSUVycm9yQ29kZSwgdHJ1ZSk7XG4gICAgICB0aGlzLnByb2Nlc3NMaXN0ZW5lcnMoY2FsbGJhY2tOYW1lKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZyhjYWxsYmFja05hbWUsIG51bGwsICdyZXR1cm5lZDogJyArIHJldHVyblZhbHVlLFxuICAgICAgICBhcGlfY29uc3RhbnRzLkxPR19MRVZFTF9JTkZPKTtcblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgdGhlIExNUyBzdGF0ZSBhbmQgZW5zdXJlcyBpdCBoYXMgYmVlbiBpbml0aWFsaXplZC5cbiAgICpcbiAgICogQHBhcmFtIHtib29sZWFufSBjaGVja1Rlcm1pbmF0ZWRcbiAgICogQHBhcmFtIHtudW1iZXJ9IGJlZm9yZUluaXRFcnJvclxuICAgKiBAcGFyYW0ge251bWJlcn0gYWZ0ZXJUZXJtRXJyb3JcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGNoZWNrU3RhdGUoXG4gICAgICBjaGVja1Rlcm1pbmF0ZWQ6IGJvb2xlYW4sXG4gICAgICBiZWZvcmVJbml0RXJyb3I6IG51bWJlcixcbiAgICAgIGFmdGVyVGVybUVycm9yPzogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuaXNOb3RJbml0aWFsaXplZCgpKSB7XG4gICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihiZWZvcmVJbml0RXJyb3IpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoY2hlY2tUZXJtaW5hdGVkICYmIHRoaXMuaXNUZXJtaW5hdGVkKCkpIHtcbiAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKGFmdGVyVGVybUVycm9yKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2dnaW5nIGZvciBhbGwgU0NPUk0gYWN0aW9uc1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZnVuY3Rpb25OYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2dNZXNzYWdlXG4gICAqIEBwYXJhbSB7bnVtYmVyfW1lc3NhZ2VMZXZlbFxuICAgKi9cbiAgYXBpTG9nKFxuICAgICAgZnVuY3Rpb25OYW1lOiBTdHJpbmcsXG4gICAgICBDTUlFbGVtZW50OiBTdHJpbmcsXG4gICAgICBsb2dNZXNzYWdlOiBTdHJpbmcsXG4gICAgICBtZXNzYWdlTGV2ZWw6IG51bWJlcikge1xuICAgIGxvZ01lc3NhZ2UgPSB0aGlzLmZvcm1hdE1lc3NhZ2UoZnVuY3Rpb25OYW1lLCBDTUlFbGVtZW50LCBsb2dNZXNzYWdlKTtcblxuICAgIGlmIChtZXNzYWdlTGV2ZWwgPj0gdGhpcy5hcGlMb2dMZXZlbCkge1xuICAgICAgc3dpdGNoIChtZXNzYWdlTGV2ZWwpIHtcbiAgICAgICAgY2FzZSBhcGlfY29uc3RhbnRzLkxPR19MRVZFTF9FUlJPUjpcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGxvZ01lc3NhZ2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGFwaV9jb25zdGFudHMuTE9HX0xFVkVMX1dBUk5JTkc6XG4gICAgICAgICAgY29uc29sZS53YXJuKGxvZ01lc3NhZ2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIGFwaV9jb25zdGFudHMuTE9HX0xFVkVMX0lORk86XG4gICAgICAgICAgY29uc29sZS5pbmZvKGxvZ01lc3NhZ2UpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGb3JtYXRzIHRoZSBTQ09STSBtZXNzYWdlcyBmb3IgZWFzeSByZWFkaW5nXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmdW5jdGlvbk5hbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1lc3NhZ2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZm9ybWF0TWVzc2FnZShmdW5jdGlvbk5hbWU6IFN0cmluZywgQ01JRWxlbWVudDogU3RyaW5nLCBtZXNzYWdlOiBTdHJpbmcpIHtcbiAgICBjb25zdCBiYXNlTGVuZ3RoID0gMjA7XG4gICAgbGV0IG1lc3NhZ2VTdHJpbmcgPSAnJztcblxuICAgIG1lc3NhZ2VTdHJpbmcgKz0gZnVuY3Rpb25OYW1lO1xuXG4gICAgbGV0IGZpbGxDaGFycyA9IGJhc2VMZW5ndGggLSBtZXNzYWdlU3RyaW5nLmxlbmd0aDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsbENoYXJzOyBpKyspIHtcbiAgICAgIG1lc3NhZ2VTdHJpbmcgKz0gJyAnO1xuICAgIH1cblxuICAgIG1lc3NhZ2VTdHJpbmcgKz0gJzogJztcblxuICAgIGlmIChDTUlFbGVtZW50KSB7XG4gICAgICBjb25zdCBDTUlFbGVtZW50QmFzZUxlbmd0aCA9IDcwO1xuXG4gICAgICBtZXNzYWdlU3RyaW5nICs9IENNSUVsZW1lbnQ7XG5cbiAgICAgIGZpbGxDaGFycyA9IENNSUVsZW1lbnRCYXNlTGVuZ3RoIC0gbWVzc2FnZVN0cmluZy5sZW5ndGg7XG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgZmlsbENoYXJzOyBqKyspIHtcbiAgICAgICAgbWVzc2FnZVN0cmluZyArPSAnICc7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1lc3NhZ2UpIHtcbiAgICAgIG1lc3NhZ2VTdHJpbmcgKz0gbWVzc2FnZTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWVzc2FnZVN0cmluZztcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgdG8gc2VlIGlmIHtzdHJ9IGNvbnRhaW5zIHt0ZXN0ZXJ9XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgU3RyaW5nIHRvIGNoZWNrIGFnYWluc3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRlc3RlciBTdHJpbmcgdG8gY2hlY2sgZm9yXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59XG4gICAqL1xuICBzdHJpbmdDb250YWlucyhzdHI6IFN0cmluZywgdGVzdGVyOiBTdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyLmluZGV4T2YodGVzdGVyKSA+IC0xO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1lc3NhZ2UgdGhhdCBjb3JyZXNwb25kcyB0byBlcnJvck51bWJlclxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7KHN0cmluZ3xudW1iZXIpfSBfZXJyb3JOdW1iZXJcbiAgICogQHBhcmFtIHtib29sZWFufSBfZGV0YWlsXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldExtc0Vycm9yTWVzc2FnZURldGFpbHMoX2Vycm9yTnVtYmVyLCBfZGV0YWlsKSB7XG4gICAgcmV0dXJuICdObyBlcnJvcic7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdmFsdWUgZm9yIHRoZSBzcGVjaWZpYyBlbGVtZW50LlxuICAgKiBBUElzIHRoYXQgaW5oZXJpdCBCYXNlQVBJIHNob3VsZCBvdmVycmlkZSB0aGlzIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXRDTUlWYWx1ZShfQ01JRWxlbWVudCkge1xuICAgIHJldHVybiAnJztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSB2YWx1ZSBmb3IgdGhlIHNwZWNpZmljIGVsZW1lbnQuXG4gICAqIEFQSXMgdGhhdCBpbmhlcml0IEJhc2VBUEkgc2hvdWxkIG92ZXJyaWRlIHRoaXMgZnVuY3Rpb25cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IF9DTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7YW55fSBfdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgc2V0Q01JVmFsdWUoX0NNSUVsZW1lbnQsIF92YWx1ZSkge1xuICAgIHJldHVybiBhcGlfY29uc3RhbnRzLlNDT1JNX0ZBTFNFO1xuICB9XG5cbiAgLyoqXG4gICAqIFNoYXJlZCBBUEkgbWV0aG9kIHRvIHNldCBhIHZhbGlkIGZvciBhIGdpdmVuIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXRob2ROYW1lXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gc2Nvcm0yMDA0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgX2NvbW1vblNldENNSVZhbHVlKFxuICAgICAgbWV0aG9kTmFtZTogU3RyaW5nLCBzY29ybTIwMDQ6IGJvb2xlYW4sIENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgaWYgKCFDTUlFbGVtZW50IHx8IENNSUVsZW1lbnQgPT09ICcnKSB7XG4gICAgICByZXR1cm4gYXBpX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcbiAgICB9XG5cbiAgICBjb25zdCBzdHJ1Y3R1cmUgPSBDTUlFbGVtZW50LnNwbGl0KCcuJyk7XG4gICAgbGV0IHJlZk9iamVjdCA9IHRoaXM7XG4gICAgbGV0IHJldHVyblZhbHVlID0gYXBpX2NvbnN0YW50cy5TQ09STV9GQUxTRTtcblxuICAgIGNvbnN0IGludmFsaWRFcnJvck1lc3NhZ2UgPSBgVGhlIGRhdGEgbW9kZWwgZWxlbWVudCBwYXNzZWQgdG8gJHttZXRob2ROYW1lfSAoJHtDTUlFbGVtZW50fSkgaXMgbm90IGEgdmFsaWQgU0NPUk0gZGF0YSBtb2RlbCBlbGVtZW50LmA7XG4gICAgY29uc3QgaW52YWxpZEVycm9yQ29kZSA9IHNjb3JtMjAwNCA/XG4gICAgICAgIHRoaXMuI2Vycm9yX2NvZGVzLlVOREVGSU5FRF9EQVRBX01PREVMIDpcbiAgICAgICAgdGhpcy4jZXJyb3JfY29kZXMuR0VORVJBTDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RydWN0dXJlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBhdHRyaWJ1dGUgPSBzdHJ1Y3R1cmVbaV07XG5cbiAgICAgIGlmIChpID09PSBzdHJ1Y3R1cmUubGVuZ3RoIC0gMSkge1xuICAgICAgICBpZiAoc2Nvcm0yMDA0ICYmIChhdHRyaWJ1dGUuc3Vic3RyKDAsIDgpID09PSAne3RhcmdldD0nKSAmJlxuICAgICAgICAgICAgKHR5cGVvZiByZWZPYmplY3QuX2lzVGFyZ2V0VmFsaWQgPT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcih0aGlzLiNlcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCk7XG4gICAgICAgIH0gZWxzZSBpZiAoIU9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlZk9iamVjdCwgYXR0cmlidXRlKSAmJlxuICAgICAgICAgICAgIU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoXG4gICAgICAgICAgICAgICAgT2JqZWN0LmdldFByb3RvdHlwZU9mKHJlZk9iamVjdCksIGF0dHJpYnV0ZSkpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihpbnZhbGlkRXJyb3JDb2RlLCBpbnZhbGlkRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5zdHJpbmdDb250YWlucyhDTUlFbGVtZW50LCAnLmNvcnJlY3RfcmVzcG9uc2VzJykpIHtcbiAgICAgICAgICAgIHRoaXMudmFsaWRhdGVDb3JyZWN0UmVzcG9uc2UoQ01JRWxlbWVudCwgdmFsdWUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghc2Nvcm0yMDA0IHx8IHRoaXMubGFzdEVycm9yQ29kZSA9PT0gMCkge1xuICAgICAgICAgICAgcmVmT2JqZWN0W2F0dHJpYnV0ZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIHJldHVyblZhbHVlID0gYXBpX2NvbnN0YW50cy5TQ09STV9UUlVFO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVmT2JqZWN0ID0gcmVmT2JqZWN0W2F0dHJpYnV0ZV07XG4gICAgICAgIGlmICghcmVmT2JqZWN0KSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoaW52YWxpZEVycm9yQ29kZSwgaW52YWxpZEVycm9yTWVzc2FnZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmVmT2JqZWN0IGluc3RhbmNlb2YgQ01JQXJyYXkpIHtcbiAgICAgICAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KHN0cnVjdHVyZVtpICsgMV0sIDEwKTtcblxuICAgICAgICAgIC8vIFNDTyBpcyB0cnlpbmcgdG8gc2V0IGFuIGl0ZW0gb24gYW4gYXJyYXlcbiAgICAgICAgICBpZiAoIWlzTmFOKGluZGV4KSkge1xuICAgICAgICAgICAgY29uc3QgaXRlbSA9IHJlZk9iamVjdC5jaGlsZEFycmF5W2luZGV4XTtcblxuICAgICAgICAgICAgaWYgKGl0ZW0pIHtcbiAgICAgICAgICAgICAgcmVmT2JqZWN0ID0gaXRlbTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnN0IG5ld0NoaWxkID0gdGhpcy5nZXRDaGlsZEVsZW1lbnQoQ01JRWxlbWVudCwgdmFsdWUpO1xuXG4gICAgICAgICAgICAgIGlmICghbmV3Q2hpbGQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihpbnZhbGlkRXJyb3JDb2RlLCBpbnZhbGlkRXJyb3JNZXNzYWdlKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWZPYmplY3QuY2hpbGRBcnJheS5wdXNoKG5ld0NoaWxkKTtcbiAgICAgICAgICAgICAgICByZWZPYmplY3QgPSBuZXdDaGlsZDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBIYXZlIHRvIHVwZGF0ZSBpIHZhbHVlIHRvIHNraXAgdGhlIGFycmF5IHBvc2l0aW9uXG4gICAgICAgICAgICBpKys7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJldHVyblZhbHVlID09PSBhcGlfY29uc3RhbnRzLlNDT1JNX0ZBTFNFKSB7XG4gICAgICB0aGlzLmFwaUxvZyhtZXRob2ROYW1lLCBudWxsLFxuICAgICAgICAgIGBUaGVyZSB3YXMgYW4gZXJyb3Igc2V0dGluZyB0aGUgdmFsdWUgZm9yOiAke0NNSUVsZW1lbnR9LCB2YWx1ZSBvZjogJHt2YWx1ZX1gLFxuICAgICAgICAgIGFwaV9jb25zdGFudHMuTE9HX0xFVkVMX1dBUk5JTkcpO1xuICAgIH1cblxuICAgIHJldHVybiByZXR1cm5WYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBYnN0cmFjdCBtZXRob2QgZm9yIHZhbGlkYXRpbmcgdGhhdCBhIHJlc3BvbnNlIGlzIGNvcnJlY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfQ01JRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IF92YWx1ZVxuICAgKi9cbiAgdmFsaWRhdGVDb3JyZWN0UmVzcG9uc2UoX0NNSUVsZW1lbnQsIF92YWx1ZSkge1xuICAgIC8vIGp1c3QgYSBzdHViIG1ldGhvZFxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgb3IgYnVpbGRzIGEgbmV3IGNoaWxkIGVsZW1lbnQgdG8gYWRkIHRvIHRoZSBhcnJheS5cbiAgICogQVBJcyB0aGF0IGluaGVyaXQgQmFzZUFQSSBzaG91bGQgb3ZlcnJpZGUgdGhpcyBtZXRob2QuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfQ01JRWxlbWVudCAtIHVudXNlZFxuICAgKiBAcGFyYW0geyp9IF92YWx1ZSAtIHVudXNlZFxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0Q2hpbGRFbGVtZW50KF9DTUlFbGVtZW50LCBfdmFsdWUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgdmFsdWUgZnJvbSB0aGUgQ01JIE9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWV0aG9kTmFtZVxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHNjb3JtMjAwNFxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgX2NvbW1vbkdldENNSVZhbHVlKG1ldGhvZE5hbWU6IFN0cmluZywgc2Nvcm0yMDA0OiBib29sZWFuLCBDTUlFbGVtZW50KSB7XG4gICAgaWYgKCFDTUlFbGVtZW50IHx8IENNSUVsZW1lbnQgPT09ICcnKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RydWN0dXJlID0gQ01JRWxlbWVudC5zcGxpdCgnLicpO1xuICAgIGxldCByZWZPYmplY3QgPSB0aGlzO1xuICAgIGxldCBhdHRyaWJ1dGUgPSBudWxsO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHJ1Y3R1cmUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGF0dHJpYnV0ZSA9IHN0cnVjdHVyZVtpXTtcblxuICAgICAgaWYgKCFzY29ybTIwMDQpIHtcbiAgICAgICAgaWYgKGkgPT09IHN0cnVjdHVyZS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgaWYgKCF7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHJlZk9iamVjdCwgYXR0cmlidXRlKSkge1xuICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoMTAxLFxuICAgICAgICAgICAgICAgICdnZXRDTUlWYWx1ZSBkaWQgbm90IGZpbmQgYSB2YWx1ZSBmb3I6ICcgKyBDTUlFbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICgoU3RyaW5nKGF0dHJpYnV0ZSkuc3Vic3RyKDAsIDgpID09PSAne3RhcmdldD0nKSAmJlxuICAgICAgICAgICAgKHR5cGVvZiByZWZPYmplY3QuX2lzVGFyZ2V0VmFsaWQgPT0gJ2Z1bmN0aW9uJykpIHtcbiAgICAgICAgICBjb25zdCB0YXJnZXQgPSBTdHJpbmcoYXR0cmlidXRlKS5cbiAgICAgICAgICAgICAgc3Vic3RyKDgsIFN0cmluZyhhdHRyaWJ1dGUpLmxlbmd0aCAtIDkpO1xuICAgICAgICAgIHJldHVybiByZWZPYmplY3QuX2lzVGFyZ2V0VmFsaWQodGFyZ2V0KTtcbiAgICAgICAgfSBlbHNlIGlmICghe30uaGFzT3duUHJvcGVydHkuY2FsbChyZWZPYmplY3QsIGF0dHJpYnV0ZSkpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcig0MDEsXG4gICAgICAgICAgICAgICdUaGUgZGF0YSBtb2RlbCBlbGVtZW50IHBhc3NlZCB0byBHZXRWYWx1ZSAoJyArIENNSUVsZW1lbnQgK1xuICAgICAgICAgICAgICAnKSBpcyBub3QgYSB2YWxpZCBTQ09STSBkYXRhIG1vZGVsIGVsZW1lbnQuJyk7XG4gICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJlZk9iamVjdCA9IHJlZk9iamVjdFthdHRyaWJ1dGVdO1xuICAgIH1cblxuICAgIGlmIChyZWZPYmplY3QgPT09IG51bGwgfHwgcmVmT2JqZWN0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICghc2Nvcm0yMDA0KSB7XG4gICAgICAgIGlmIChhdHRyaWJ1dGUgPT09ICdfY2hpbGRyZW4nKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoMjAyKTtcbiAgICAgICAgfSBlbHNlIGlmIChhdHRyaWJ1dGUgPT09ICdfY291bnQnKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3IoMjAzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuICcnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVmT2JqZWN0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIEFQSSdzIGN1cnJlbnQgc3RhdGUgaXMgU1RBVEVfSU5JVElBTElaRURcbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGlzSW5pdGlhbGl6ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlID09PSBhcGlfY29uc3RhbnRzLlNUQVRFX0lOSVRJQUxJWkVEO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgQVBJJ3MgY3VycmVudCBzdGF0ZSBpcyBTVEFURV9OT1RfSU5JVElBTElaRURcbiAgICpcbiAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICovXG4gIGlzTm90SW5pdGlhbGl6ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFN0YXRlID09PSBhcGlfY29uc3RhbnRzLlNUQVRFX05PVF9JTklUSUFMSVpFRDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIEFQSSdzIGN1cnJlbnQgc3RhdGUgaXMgU1RBVEVfVEVSTUlOQVRFRFxuICAgKlxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgaXNUZXJtaW5hdGVkKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRTdGF0ZSA9PT0gYXBpX2NvbnN0YW50cy5TVEFURV9URVJNSU5BVEVEO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3ZpZGVzIGEgbWVjaGFuaXNtIGZvciBhdHRhY2hpbmcgdG8gYSBzcGVjaWZpYyBTQ09STSBldmVudFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGlzdGVuZXJOYW1lXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbihsaXN0ZW5lck5hbWU6IFN0cmluZywgY2FsbGJhY2s6IGZ1bmN0aW9uKSB7XG4gICAgaWYgKCFjYWxsYmFjaykgcmV0dXJuO1xuXG4gICAgY29uc3QgbGlzdGVuZXJGdW5jdGlvbnMgPSBsaXN0ZW5lck5hbWUuc3BsaXQoJyAnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpc3RlbmVyRnVuY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lclNwbGl0ID0gbGlzdGVuZXJGdW5jdGlvbnNbaV0uc3BsaXQoJy4nKTtcbiAgICAgIGlmIChsaXN0ZW5lclNwbGl0Lmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBmdW5jdGlvbk5hbWUgPSBsaXN0ZW5lclNwbGl0WzBdO1xuXG4gICAgICBsZXQgQ01JRWxlbWVudCA9IG51bGw7XG4gICAgICBpZiAobGlzdGVuZXJTcGxpdC5sZW5ndGggPiAxKSB7XG4gICAgICAgIENNSUVsZW1lbnQgPSBsaXN0ZW5lck5hbWUucmVwbGFjZShmdW5jdGlvbk5hbWUgKyAnLicsICcnKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5saXN0ZW5lckFycmF5LnB1c2goe1xuICAgICAgICBmdW5jdGlvbk5hbWU6IGZ1bmN0aW9uTmFtZSxcbiAgICAgICAgQ01JRWxlbWVudDogQ01JRWxlbWVudCxcbiAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByb2Nlc3NlcyBhbnkgJ29uJyBsaXN0ZW5lcnMgdGhhdCBoYXZlIGJlZW4gY3JlYXRlZFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gZnVuY3Rpb25OYW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICovXG4gIHByb2Nlc3NMaXN0ZW5lcnMoZnVuY3Rpb25OYW1lOiBTdHJpbmcsIENNSUVsZW1lbnQ6IFN0cmluZywgdmFsdWU6IGFueSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5saXN0ZW5lckFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBsaXN0ZW5lciA9IHRoaXMubGlzdGVuZXJBcnJheVtpXTtcbiAgICAgIGNvbnN0IGZ1bmN0aW9uc01hdGNoID0gbGlzdGVuZXIuZnVuY3Rpb25OYW1lID09PSBmdW5jdGlvbk5hbWU7XG4gICAgICBjb25zdCBsaXN0ZW5lckhhc0NNSUVsZW1lbnQgPSAhIWxpc3RlbmVyLkNNSUVsZW1lbnQ7XG4gICAgICBjb25zdCBDTUlFbGVtZW50c01hdGNoID0gbGlzdGVuZXIuQ01JRWxlbWVudCA9PT0gQ01JRWxlbWVudDtcblxuICAgICAgaWYgKGZ1bmN0aW9uc01hdGNoICYmICghbGlzdGVuZXJIYXNDTUlFbGVtZW50IHx8IENNSUVsZW1lbnRzTWF0Y2gpKSB7XG4gICAgICAgIGxpc3RlbmVyLmNhbGxiYWNrKENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhyb3dzIGEgU0NPUk0gZXJyb3JcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGVycm9yTnVtYmVyXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtZXNzYWdlXG4gICAqL1xuICB0aHJvd1NDT1JNRXJyb3IoZXJyb3JOdW1iZXI6IG51bWJlciwgbWVzc2FnZTogU3RyaW5nKSB7XG4gICAgaWYgKCFtZXNzYWdlKSB7XG4gICAgICBtZXNzYWdlID0gdGhpcy5nZXRMbXNFcnJvck1lc3NhZ2VEZXRhaWxzKGVycm9yTnVtYmVyKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwaUxvZygndGhyb3dTQ09STUVycm9yJywgbnVsbCwgZXJyb3JOdW1iZXIgKyAnOiAnICsgbWVzc2FnZSxcbiAgICAgICAgYXBpX2NvbnN0YW50cy5MT0dfTEVWRUxfRVJST1IpO1xuXG4gICAgdGhpcy5sYXN0RXJyb3JDb2RlID0gU3RyaW5nKGVycm9yTnVtYmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgdGhlIGxhc3QgU0NPUk0gZXJyb3IgY29kZSBvbiBzdWNjZXNzLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gc3VjY2Vzc1xuICAgKi9cbiAgY2xlYXJTQ09STUVycm9yKHN1Y2Nlc3M6IFN0cmluZykge1xuICAgIGlmIChzdWNjZXNzICE9PSBhcGlfY29uc3RhbnRzLlNDT1JNX0ZBTFNFKSB7XG4gICAgICB0aGlzLmxhc3RFcnJvckNvZGUgPSAwO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBMb2FkcyBDTUkgZGF0YSBmcm9tIGEgSlNPTiBvYmplY3QuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBqc29uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqL1xuICBsb2FkRnJvbUpTT04oanNvbiwgQ01JRWxlbWVudCkge1xuICAgIGlmICghdGhpcy5pc05vdEluaXRpYWxpemVkKCkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgJ2xvYWRGcm9tSlNPTiBjYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlIHRoZSBjYWxsIHRvIGxtc0luaXRpYWxpemUuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgQ01JRWxlbWVudCA9IENNSUVsZW1lbnQgfHwgJ2NtaSc7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBqc29uKSB7XG4gICAgICBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChqc29uLCBrZXkpICYmIGpzb25ba2V5XSkge1xuICAgICAgICBjb25zdCBjdXJyZW50Q01JRWxlbWVudCA9IENNSUVsZW1lbnQgKyAnLicgKyBrZXk7XG4gICAgICAgIGNvbnN0IHZhbHVlID0ganNvbltrZXldO1xuXG4gICAgICAgIGlmICh2YWx1ZVsnY2hpbGRBcnJheSddKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZVsnY2hpbGRBcnJheSddLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRGcm9tSlNPTih2YWx1ZVsnY2hpbGRBcnJheSddW2ldLFxuICAgICAgICAgICAgICAgIGN1cnJlbnRDTUlFbGVtZW50ICsgJy4nICsgaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlLmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHtcbiAgICAgICAgICB0aGlzLmxvYWRGcm9tSlNPTih2YWx1ZSwgY3VycmVudENNSUVsZW1lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMuc2V0Q01JVmFsdWUoY3VycmVudENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIENNSSBvYmplY3QgdG8gSlNPTiBmb3Igc2VuZGluZyB0byBhbiBMTVMuXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHJlbmRlckNNSVRvSlNPTigpIHtcbiAgICBjb25zdCBjbWkgPSB0aGlzLmNtaTtcbiAgICAvLyBEbyB3ZSB3YW50L25lZWQgdG8gcmV0dXJuIGZpZWxkcyB0aGF0IGhhdmUgbm8gc2V0IHZhbHVlP1xuICAgIC8vIHJldHVybiBKU09OLnN0cmluZ2lmeSh7IGNtaSB9LCAoaywgdikgPT4gdiA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IHYsIDIpO1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh7Y21pfSk7XG4gIH1cblxuICAvKipcbiAgICogVGhyb3dzIGEgU0NPUk0gZXJyb3JcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdoZW4gLSB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZSBjb21taXR0aW5nXG4gICAqL1xuICBzY2hlZHVsZUNvbW1pdCh3aGVuOiBudW1iZXIpIHtcbiAgICB0aGlzLiN0aW1lb3V0ID0gbmV3IFNjaGVkdWxlZENvbW1pdCh0aGlzLCB3aGVuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhcnMgYW5kIGNhbmNlbHMgYW55IGN1cnJlbnRseSBzY2hlZHVsZWQgY29tbWl0c1xuICAgKi9cbiAgY2xlYXJTY2hlZHVsZWRDb21taXQoKSB7XG4gICAgaWYgKHRoaXMuI3RpbWVvdXQpIHtcbiAgICAgIHRoaXMuI3RpbWVvdXQuY2FuY2VsKCk7XG4gICAgICB0aGlzLiN0aW1lb3V0ID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBQcml2YXRlIGNsYXNzIHRoYXQgd3JhcHMgYSB0aW1lb3V0IGNhbGwgdG8gdGhlIGNvbW1pdCgpIGZ1bmN0aW9uXG4gKi9cbmNsYXNzIFNjaGVkdWxlZENvbW1pdCB7XG4gICNBUEk7XG4gICNjYW5jZWxsZWQ6IGZhbHNlO1xuICAjdGltZW91dDtcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIFNjaGVkdWxlZENvbW1pdFxuICAgKiBAcGFyYW0ge0Jhc2VBUEl9IEFQSVxuICAgKiBAcGFyYW0ge251bWJlcn0gd2hlblxuICAgKi9cbiAgY29uc3RydWN0b3IoQVBJOiBhbnksIHdoZW46IG51bWJlcikge1xuICAgIHRoaXMuI0FQSSA9IEFQSTtcbiAgICB0aGlzLiN0aW1lb3V0ID0gc2V0VGltZW91dCh0aGlzLndyYXBwZXIsIHdoZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbmNlbCBhbnkgY3VycmVudGx5IHNjaGVkdWxlZCBjb21taXRcbiAgICovXG4gIGNhbmNlbCgpIHtcbiAgICB0aGlzLiNjYW5jZWxsZWQgPSB0cnVlO1xuICAgIGlmICh0aGlzLiN0aW1lb3V0KSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy4jdGltZW91dCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFdyYXAgdGhlIEFQSSBjb21taXQgY2FsbCB0byBjaGVjayBpZiB0aGUgY2FsbCBoYXMgYWxyZWFkeSBiZWVuIGNhbmNlbGxlZFxuICAgKi9cbiAgd3JhcHBlcigpIHtcbiAgICBpZiAoIXRoaXMuI2NhbmNlbGxlZCkge1xuICAgICAgdGhpcy4jQVBJLmNvbW1pdCgpO1xuICAgIH1cbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCBCYXNlQVBJIGZyb20gJy4vQmFzZUFQSSc7XG5pbXBvcnQge1xuICBDTUksXG4gIENNSUludGVyYWN0aW9uc0NvcnJlY3RSZXNwb25zZXNPYmplY3QsXG4gIENNSUludGVyYWN0aW9uc09iamVjdCxcbiAgQ01JSW50ZXJhY3Rpb25zT2JqZWN0aXZlc09iamVjdCxcbiAgQ01JT2JqZWN0aXZlc09iamVjdCxcbn0gZnJvbSAnLi9jbWkvc2Nvcm0xMl9jbWknO1xuaW1wb3J0ICogYXMgVXRpbGl0aWVzIGZyb20gJy4vdXRpbGl0aWVzJztcbmltcG9ydCB7c2Nvcm0xMl9jb25zdGFudHN9IGZyb20gJy4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuaW1wb3J0IHtzY29ybTEyX2Vycm9yX2NvZGVzfSBmcm9tICcuL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQge3Njb3JtMTJfcmVnZXh9IGZyb20gJy4vY29uc3RhbnRzL3JlZ2V4JztcblxuY29uc3QgY29uc3RhbnRzID0gc2Nvcm0xMl9jb25zdGFudHM7XG5cbi8qKlxuICogQVBJIGNsYXNzIGZvciBTQ09STSAxLjJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2Nvcm0xMkFQSSBleHRlbmRzIEJhc2VBUEkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIFNDT1JNIDEuMiBBUElcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHNjb3JtMTJfZXJyb3JfY29kZXMpO1xuXG4gICAgdGhpcy5jbWkgPSBuZXcgQ01JKHRoaXMpO1xuICAgIC8vIFJlbmFtZSBmdW5jdGlvbnMgdG8gbWF0Y2ggMS4yIFNwZWMgYW5kIGV4cG9zZSB0byBtb2R1bGVzXG4gICAgdGhpcy5MTVNJbml0aWFsaXplID0gdGhpcy5sbXNJbml0aWFsaXplO1xuICAgIHRoaXMuTE1TRmluaXNoID0gdGhpcy5sbXNGaW5pc2g7XG4gICAgdGhpcy5MTVNHZXRWYWx1ZSA9IHRoaXMubG1zR2V0VmFsdWU7XG4gICAgdGhpcy5MTVNTZXRWYWx1ZSA9IHRoaXMubG1zU2V0VmFsdWU7XG4gICAgdGhpcy5MTVNDb21taXQgPSB0aGlzLmxtc0NvbW1pdDtcbiAgICB0aGlzLkxNU0dldExhc3RFcnJvciA9IHRoaXMubG1zR2V0TGFzdEVycm9yO1xuICAgIHRoaXMuTE1TR2V0RXJyb3JTdHJpbmcgPSB0aGlzLmxtc0dldEVycm9yU3RyaW5nO1xuICAgIHRoaXMuTE1TR2V0RGlhZ25vc3RpYyA9IHRoaXMubG1zR2V0RGlhZ25vc3RpYztcbiAgfVxuXG4gIC8qKlxuICAgKiBsbXNJbml0aWFsaXplIGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSBib29sXG4gICAqL1xuICBsbXNJbml0aWFsaXplKCkge1xuICAgIHJldHVybiB0aGlzLmluaXRpYWxpemUoJ0xNU0luaXRpYWxpemUnLCAnTE1TIHdhcyBhbHJlYWR5IGluaXRpYWxpemVkIScsXG4gICAgICAgICdMTVMgaXMgYWxyZWFkeSBmaW5pc2hlZCEnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMTVNGaW5pc2ggZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJvb2xcbiAgICovXG4gIGxtc0ZpbmlzaCgpIHtcbiAgICByZXR1cm4gdGhpcy50ZXJtaW5hdGUoJ0xNU0ZpbmlzaCcsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMTVNHZXRWYWx1ZSBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc0dldFZhbHVlKENNSUVsZW1lbnQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRWYWx1ZSgnTE1TR2V0VmFsdWUnLCBmYWxzZSwgQ01JRWxlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogTE1TU2V0VmFsdWUgZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc1NldFZhbHVlKENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0VmFsdWUoJ0xNU1NldFZhbHVlJywgZmFsc2UsIENNSUVsZW1lbnQsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMTVNDb21taXQgZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJvb2xcbiAgICovXG4gIGxtc0NvbW1pdCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb21taXQoJ0xNU0NvbW1pdCcsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMTVNHZXRMYXN0RXJyb3IgZnVuY3Rpb24gZnJvbSBTQ09STSAxLjIgU3BlY1xuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXRMYXN0RXJyb3IoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0TGFzdEVycm9yKCdMTVNHZXRMYXN0RXJyb3InKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMTVNHZXRFcnJvclN0cmluZyBmdW5jdGlvbiBmcm9tIFNDT1JNIDEuMiBTcGVjXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFcnJvckNvZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zR2V0RXJyb3JTdHJpbmcoQ01JRXJyb3JDb2RlKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RXJyb3JTdHJpbmcoJ0xNU0dldEVycm9yU3RyaW5nJywgQ01JRXJyb3JDb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMTVNHZXREaWFnbm9zdGljIGZ1bmN0aW9uIGZyb20gU0NPUk0gMS4yIFNwZWNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVycm9yQ29kZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXREaWFnbm9zdGljKENNSUVycm9yQ29kZSkge1xuICAgIHJldHVybiB0aGlzLmdldERpYWdub3N0aWMoJ0xNU0dldERpYWdub3N0aWMnLCBDTUlFcnJvckNvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSB2YWx1ZSBvbiB0aGUgQ01JIE9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0geyp9IHZhbHVlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIHNldENNSVZhbHVlKENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbW1vblNldENNSVZhbHVlKCdMTVNTZXRWYWx1ZScsIGZhbHNlLCBDTUlFbGVtZW50LCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIHZhbHVlIGZyb20gdGhlIENNSSBPYmplY3RcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldENNSVZhbHVlKENNSUVsZW1lbnQpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tbW9uR2V0Q01JVmFsdWUoJ2dldENNSVZhbHVlJywgZmFsc2UsIENNSUVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgb3IgYnVpbGRzIGEgbmV3IGNoaWxkIGVsZW1lbnQgdG8gYWRkIHRvIHRoZSBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICBnZXRDaGlsZEVsZW1lbnQoQ01JRWxlbWVudCwgdmFsdWUpIHtcbiAgICBsZXQgbmV3Q2hpbGQ7XG5cbiAgICBpZiAodGhpcy5zdHJpbmdDb250YWlucyhDTUlFbGVtZW50LCAnY21pLm9iamVjdGl2ZXMnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JT2JqZWN0aXZlc09iamVjdCh0aGlzKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RyaW5nQ29udGFpbnMoQ01JRWxlbWVudCwgJy5jb3JyZWN0X3Jlc3BvbnNlcycpKSB7XG4gICAgICBuZXdDaGlsZCA9IG5ldyBDTUlJbnRlcmFjdGlvbnNDb3JyZWN0UmVzcG9uc2VzT2JqZWN0KHRoaXMpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdHJpbmdDb250YWlucyhDTUlFbGVtZW50LCAnLm9iamVjdGl2ZXMnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JSW50ZXJhY3Rpb25zT2JqZWN0aXZlc09iamVjdCh0aGlzKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RyaW5nQ29udGFpbnMoQ01JRWxlbWVudCwgJ2NtaS5pbnRlcmFjdGlvbnMnKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JSW50ZXJhY3Rpb25zT2JqZWN0KHRoaXMpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXdDaGlsZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZXMgQ29ycmVjdCBSZXNwb25zZSB2YWx1ZXNcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgdmFsaWRhdGVDb3JyZWN0UmVzcG9uc2UoQ01JRWxlbWVudCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBtZXNzYWdlIHRoYXQgY29ycmVzcG9uZHMgdG8gZXJyb3JOdW1iZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gZXJyb3JOdW1iZXJcbiAgICogQHBhcmFtIHtib29sZWFuIH1kZXRhaWxcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0TG1zRXJyb3JNZXNzYWdlRGV0YWlscyhlcnJvck51bWJlciwgZGV0YWlsKSB7XG4gICAgbGV0IGJhc2ljTWVzc2FnZSA9ICdObyBFcnJvcic7XG4gICAgbGV0IGRldGFpbE1lc3NhZ2UgPSAnTm8gRXJyb3InO1xuXG4gICAgLy8gU2V0IGVycm9yIG51bWJlciB0byBzdHJpbmcgc2luY2UgaW5jb25zaXN0ZW50IGZyb20gbW9kdWxlcyBpZiBzdHJpbmcgb3IgbnVtYmVyXG4gICAgZXJyb3JOdW1iZXIgPSBTdHJpbmcoZXJyb3JOdW1iZXIpO1xuICAgIGlmIChjb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW2Vycm9yTnVtYmVyXSkge1xuICAgICAgYmFzaWNNZXNzYWdlID0gY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tlcnJvck51bWJlcl0uYmFzaWNNZXNzYWdlO1xuICAgICAgZGV0YWlsTWVzc2FnZSA9IGNvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbZXJyb3JOdW1iZXJdLmRldGFpbE1lc3NhZ2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRldGFpbCA/IGRldGFpbE1lc3NhZ2UgOiBiYXNpY01lc3NhZ2U7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0aGUgY3VycmVudCBzZXNzaW9uIHRpbWUgdG8gdGhlIGV4aXN0aW5nIHRvdGFsIHRpbWUuXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldEN1cnJlbnRUb3RhbFRpbWUoKSB7XG4gICAgY29uc3QgdGltZVJlZ2V4ID0gbmV3IFJlZ0V4cChzY29ybTEyX3JlZ2V4LkNNSVRpbWUpO1xuXG4gICAgY29uc3QgdG90YWxUaW1lID0gdGhpcy5jbWkuY29yZS50b3RhbF90aW1lO1xuICAgIGNvbnN0IHNlc3Npb25UaW1lID0gdGhpcy5jbWkuY29yZS5zZXNzaW9uX3RpbWU7XG5cbiAgICByZXR1cm4gVXRpbGl0aWVzLmFkZEhITU1TU1RpbWVTdHJpbmdzKHRvdGFsVGltZSwgc2Vzc2lvblRpbWUsIHRpbWVSZWdleCk7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSB0aGUgd2hvbGUgQVBJIHdpdGggYW5vdGhlclxuICAgKlxuICAgKiBAcGFyYW0ge1Njb3JtMTJBUEl9IG5ld0FQSVxuICAgKi9cbiAgcmVwbGFjZVdpdGhBbm90aGVyU2Nvcm1BUEkobmV3QVBJKSB7XG4gICAgLy8gRGF0YSBNb2RlbFxuICAgIHRoaXMuY21pID0gbmV3QVBJLmNtaTtcbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCBCYXNlQVBJIGZyb20gJy4vQmFzZUFQSSc7XG5pbXBvcnQge1xuICBBREwsXG4gIENNSSxcbiAgQ01JQ29tbWVudHNGcm9tTGVhcm5lck9iamVjdCxcbiAgQ01JQ29tbWVudHNGcm9tTE1TT2JqZWN0LFxuICBDTUlJbnRlcmFjdGlvbnNDb3JyZWN0UmVzcG9uc2VzT2JqZWN0LFxuICBDTUlJbnRlcmFjdGlvbnNPYmplY3QsXG4gIENNSUludGVyYWN0aW9uc09iamVjdGl2ZXNPYmplY3QsXG4gIENNSU9iamVjdGl2ZXNPYmplY3QsXG59IGZyb20gJy4vY21pL3Njb3JtMjAwNF9jbWknO1xuaW1wb3J0ICogYXMgVXRpbCBmcm9tICcuL3V0aWxpdGllcyc7XG5pbXBvcnQge3Njb3JtMjAwNF9jb25zdGFudHN9IGZyb20gJy4vY29uc3RhbnRzL2FwaV9jb25zdGFudHMnO1xuaW1wb3J0IHtzY29ybTIwMDRfZXJyb3JfY29kZXN9IGZyb20gJy4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJztcbmltcG9ydCB7Y29ycmVjdF9yZXNwb25zZXN9IGZyb20gJy4vY29uc3RhbnRzL3Jlc3BvbnNlX2NvbnN0YW50cyc7XG5pbXBvcnQge3ZhbGlkX2xhbmd1YWdlc30gZnJvbSAnLi9jb25zdGFudHMvbGFuZ3VhZ2VfY29uc3RhbnRzJztcbmltcG9ydCB7c2Nvcm0yMDA0X3JlZ2V4fSBmcm9tICcuL2NvbnN0YW50cy9yZWdleCc7XG5cbmNvbnN0IGNvbnN0YW50cyA9IHNjb3JtMjAwNF9jb25zdGFudHM7XG5cbi8qKlxuICogQVBJIGNsYXNzIGZvciBTQ09STSAyMDA0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjb3JtMjAwNEFQSSBleHRlbmRzIEJhc2VBUEkge1xuICAjdmVyc2lvbjogJzEuMCc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBTQ09STSAyMDA0IEFQSVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoc2Nvcm0yMDA0X2Vycm9yX2NvZGVzKTtcblxuICAgIHRoaXMuY21pID0gbmV3IENNSSh0aGlzKTtcbiAgICB0aGlzLmFkbCA9IG5ldyBBREwodGhpcyk7XG5cbiAgICAvLyBSZW5hbWUgZnVuY3Rpb25zIHRvIG1hdGNoIDIwMDQgU3BlYyBhbmQgZXhwb3NlIHRvIG1vZHVsZXNcbiAgICB0aGlzLkluaXRpYWxpemUgPSB0aGlzLmxtc0luaXRpYWxpemU7XG4gICAgdGhpcy5UZXJtaW5hdGUgPSB0aGlzLmxtc1Rlcm1pbmF0ZTtcbiAgICB0aGlzLkdldFZhbHVlID0gdGhpcy5sbXNHZXRWYWx1ZTtcbiAgICB0aGlzLlNldFZhbHVlID0gdGhpcy5sbXNTZXRWYWx1ZTtcbiAgICB0aGlzLkNvbW1pdCA9IHRoaXMubG1zQ29tbWl0O1xuICAgIHRoaXMuR2V0TGFzdEVycm9yID0gdGhpcy5sbXNHZXRMYXN0RXJyb3I7XG4gICAgdGhpcy5HZXRFcnJvclN0cmluZyA9IHRoaXMubG1zR2V0RXJyb3JTdHJpbmc7XG4gICAgdGhpcy5HZXREaWFnbm9zdGljID0gdGhpcy5sbXNHZXREaWFnbm9zdGljO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3ZlcnNpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHZlcnNpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI3ZlcnNpb247XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybiB7c3RyaW5nfSBib29sXG4gICAqL1xuICBsbXNJbml0aWFsaXplKCkge1xuICAgIHJldHVybiB0aGlzLmluaXRpYWxpemUoJ0luaXRpYWxpemUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJvb2xcbiAgICovXG4gIGxtc1Rlcm1pbmF0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy50ZXJtaW5hdGUoJ1Rlcm1pbmF0ZScsIHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGxtc0dldFZhbHVlKENNSUVsZW1lbnQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRWYWx1ZSgnR2V0VmFsdWUnLCB0cnVlLCBDTUlFbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zU2V0VmFsdWUoQ01JRWxlbWVudCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5zZXRWYWx1ZSgnU2V0VmFsdWUnLCB0cnVlLCBDTUlFbGVtZW50LCB2YWx1ZSk7XG4gIH1cblxuICAvKipcbiAgICogT3JkZXJzIExNUyB0byBzdG9yZSBhbGwgY29udGVudCBwYXJhbWV0ZXJzXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ30gYm9vbFxuICAgKi9cbiAgbG1zQ29tbWl0KCkge1xuICAgIHJldHVybiB0aGlzLmNvbW1pdCgnQ29tbWl0Jyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBsYXN0IGVycm9yIGNvZGVcbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgbG1zR2V0TGFzdEVycm9yKCkge1xuICAgIHJldHVybiB0aGlzLmdldExhc3RFcnJvcignR2V0TGFzdEVycm9yJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZXJyb3JOdW1iZXIgZXJyb3IgZGVzY3JpcHRpb25cbiAgICpcbiAgICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcil9IENNSUVycm9yQ29kZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXRFcnJvclN0cmluZyhDTUlFcnJvckNvZGUpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRFcnJvclN0cmluZygnR2V0RXJyb3JTdHJpbmcnLCBDTUlFcnJvckNvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBjb21wcmVoZW5zaXZlIGRlc2NyaXB0aW9uIG9mIHRoZSBlcnJvck51bWJlciBlcnJvci5cbiAgICpcbiAgICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcil9IENNSUVycm9yQ29kZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBsbXNHZXREaWFnbm9zdGljKENNSUVycm9yQ29kZSkge1xuICAgIHJldHVybiB0aGlzLmdldERpYWdub3N0aWMoJ0dldERpYWdub3N0aWMnLCBDTUlFcnJvckNvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSB2YWx1ZSBvbiB0aGUgQ01JIE9iamVjdFxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gQ01JRWxlbWVudFxuICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICovXG4gIHNldENNSVZhbHVlKENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgdGhpcy5fY29tbW9uU2V0Q01JVmFsdWUoJ1NldFZhbHVlJywgdHJ1ZSwgQ01JRWxlbWVudCwgdmFsdWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgb3IgYnVpbGRzIGEgbmV3IGNoaWxkIGVsZW1lbnQgdG8gYWRkIHRvIHRoZSBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IENNSUVsZW1lbnRcbiAgICogQHBhcmFtIHthbnl9IHZhbHVlXG4gICAqIEByZXR1cm4ge2FueX1cbiAgICovXG4gIGdldENoaWxkRWxlbWVudChDTUlFbGVtZW50LCB2YWx1ZSkge1xuICAgIGxldCBuZXdDaGlsZDtcblxuICAgIGlmICh0aGlzLnN0cmluZ0NvbnRhaW5zKENNSUVsZW1lbnQsICdjbWkub2JqZWN0aXZlcycpKSB7XG4gICAgICBuZXdDaGlsZCA9IG5ldyBDTUlPYmplY3RpdmVzT2JqZWN0KHRoaXMpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5zdHJpbmdDb250YWlucyhDTUlFbGVtZW50LCAnLmNvcnJlY3RfcmVzcG9uc2VzJykpIHtcbiAgICAgIGNvbnN0IHBhcnRzID0gQ01JRWxlbWVudC5zcGxpdCgnLicpO1xuICAgICAgY29uc3QgaW5kZXggPSBOdW1iZXIocGFydHNbMl0pO1xuICAgICAgY29uc3QgaW50ZXJhY3Rpb24gPSB0aGlzLmNtaS5pbnRlcmFjdGlvbnMuY2hpbGRBcnJheVtpbmRleF07XG4gICAgICBpZiAodHlwZW9mIGludGVyYWN0aW9uLnR5cGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5ERVBFTkRFTkNZX05PVF9FU1RBQkxJU0hFRCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBpbnRlcmFjdGlvbl90eXBlID0gaW50ZXJhY3Rpb24udHlwZTtcbiAgICAgICAgY29uc3QgaW50ZXJhY3Rpb25fY291bnQgPSBpbnRlcmFjdGlvbi5jb3JyZWN0X3Jlc3BvbnNlcy5fY291bnQ7XG4gICAgICAgIGlmIChpbnRlcmFjdGlvbl90eXBlID09PSAnY2hvaWNlJykge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW50ZXJhY3Rpb25fY291bnQgJiYgdGhpcy5sYXN0RXJyb3JDb2RlID09PVxuICAgICAgICAgIDA7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBpbnRlcmFjdGlvbi5jb3JyZWN0X3Jlc3BvbnNlcy5jaGlsZEFycmF5W2ldO1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnBhdHRlcm4gPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5HRU5FUkFMX1NFVF9GQUlMVVJFKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZXNwb25zZV90eXBlID0gY29ycmVjdF9yZXNwb25zZXNbaW50ZXJhY3Rpb25fdHlwZV07XG4gICAgICAgIGxldCBub2RlcyA9IFtdO1xuICAgICAgICBpZiAocmVzcG9uc2VfdHlwZS5kZWxpbWl0ZXIgIT09ICcnKSB7XG4gICAgICAgICAgbm9kZXMgPSBTdHJpbmcodmFsdWUpLnNwbGl0KHJlc3BvbnNlX3R5cGUuZGVsaW1pdGVyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub2Rlc1swXSA9IHZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5vZGVzLmxlbmd0aCA+IDAgJiYgbm9kZXMubGVuZ3RoIDw9IHJlc3BvbnNlX3R5cGUubWF4KSB7XG4gICAgICAgICAgdGhpcy5jaGVja0NvcnJlY3RSZXNwb25zZVZhbHVlKGludGVyYWN0aW9uX3R5cGUsIG5vZGVzLCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZXMubGVuZ3RoID4gcmVzcG9uc2VfdHlwZS5tYXgpIHtcbiAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuR0VORVJBTF9TRVRfRkFJTFVSRSxcbiAgICAgICAgICAgICAgJ0RhdGEgTW9kZWwgRWxlbWVudCBQYXR0ZXJuIFRvbyBMb25nJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLmxhc3RFcnJvckNvZGUgPT09IDApIHtcbiAgICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JSW50ZXJhY3Rpb25zQ29ycmVjdFJlc3BvbnNlc09iamVjdCh0aGlzKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RyaW5nQ29udGFpbnMoQ01JRWxlbWVudCwgJy5vYmplY3RpdmVzJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSUludGVyYWN0aW9uc09iamVjdGl2ZXNPYmplY3QodGhpcyk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnN0cmluZ0NvbnRhaW5zKENNSUVsZW1lbnQsICdjbWkuaW50ZXJhY3Rpb25zJykpIHtcbiAgICAgIG5ld0NoaWxkID0gbmV3IENNSUludGVyYWN0aW9uc09iamVjdCh0aGlzKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RyaW5nQ29udGFpbnMoQ01JRWxlbWVudCwgJ2NtaS5jb21tZW50c19mcm9tX2xlYXJuZXInKSkge1xuICAgICAgbmV3Q2hpbGQgPSBuZXcgQ01JQ29tbWVudHNGcm9tTGVhcm5lck9iamVjdCh0aGlzKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RyaW5nQ29udGFpbnMoQ01JRWxlbWVudCwgJ2NtaS5jb21tZW50c19mcm9tX2xtcycpKSB7XG4gICAgICBuZXdDaGlsZCA9IG5ldyBDTUlDb21tZW50c0Zyb21MTVNPYmplY3QodGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld0NoaWxkO1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIGNvcnJlY3QgcmVzcG9uc2UuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAgICovXG4gIHZhbGlkYXRlQ29ycmVjdFJlc3BvbnNlKENNSUVsZW1lbnQsIHZhbHVlKSB7XG4gICAgY29uc3QgcGFydHMgPSBDTUlFbGVtZW50LnNwbGl0KCcuJyk7XG4gICAgY29uc3QgaW5kZXggPSBOdW1iZXIocGFydHNbMl0pO1xuICAgIGNvbnN0IHBhdHRlcm5faW5kZXggPSBOdW1iZXIocGFydHNbNF0pO1xuICAgIGNvbnN0IGludGVyYWN0aW9uID0gdGhpcy5jbWkuaW50ZXJhY3Rpb25zLmNoaWxkQXJyYXlbaW5kZXhdO1xuXG4gICAgY29uc3QgaW50ZXJhY3Rpb25fdHlwZSA9IGludGVyYWN0aW9uLnR5cGU7XG4gICAgY29uc3QgaW50ZXJhY3Rpb25fY291bnQgPSBpbnRlcmFjdGlvbi5jb3JyZWN0X3Jlc3BvbnNlcy5fY291bnQ7XG4gICAgaWYgKGludGVyYWN0aW9uX3R5cGUgPT09ICdjaG9pY2UnKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGludGVyYWN0aW9uX2NvdW50ICYmIHRoaXMubGFzdEVycm9yQ29kZSA9PT0gMDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gaW50ZXJhY3Rpb24uY29ycmVjdF9yZXNwb25zZXMuY2hpbGRBcnJheVtpXTtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnBhdHRlcm4gPT09IHZhbHVlKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcmVzcG9uc2VfdHlwZSA9IHNjb3JtMjAwNF9jb25zdGFudHMuY29ycmVjdF9yZXNwb25zZXNbaW50ZXJhY3Rpb25fdHlwZV07XG4gICAgaWYgKHR5cGVvZiByZXNwb25zZV90eXBlLmxpbWl0ICE9PSAndW5kZWZpbmVkJyB8fCBpbnRlcmFjdGlvbl9jb3VudCA8XG4gICAgICAgIHJlc3BvbnNlX3R5cGUubGltaXQpIHtcbiAgICAgIGxldCBub2RlcyA9IFtdO1xuICAgICAgaWYgKHJlc3BvbnNlX3R5cGUuZGVsaW1pdGVyICE9PSAnJykge1xuICAgICAgICBub2RlcyA9IFN0cmluZyh2YWx1ZSkuc3BsaXQocmVzcG9uc2VfdHlwZS5kZWxpbWl0ZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9kZXNbMF0gPSB2YWx1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKG5vZGVzLmxlbmd0aCA+IDAgJiYgbm9kZXMubGVuZ3RoIDw9IHJlc3BvbnNlX3R5cGUubWF4KSB7XG4gICAgICAgIHRoaXMuY2hlY2tDb3JyZWN0UmVzcG9uc2VWYWx1ZShpbnRlcmFjdGlvbl90eXBlLCBub2RlcywgdmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChub2Rlcy5sZW5ndGggPiByZXNwb25zZV90eXBlLm1heCkge1xuICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuR0VORVJBTF9TRVRfRkFJTFVSRSxcbiAgICAgICAgICAgICdEYXRhIE1vZGVsIEVsZW1lbnQgUGF0dGVybiBUb28gTG9uZycpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5sYXN0RXJyb3JDb2RlID09PSAwICYmXG4gICAgICAgICAgKCFyZXNwb25zZV90eXBlLmR1cGxpY2F0ZSB8fFxuICAgICAgICAgICAgICAhdGhpcy5jaGVja0R1cGxpY2F0ZWRQYXR0ZXJuKGludGVyYWN0aW9uLmNvcnJlY3RfcmVzcG9uc2VzLFxuICAgICAgICAgICAgICAgICAgcGF0dGVybl9pbmRleCwgdmFsdWUpKSB8fFxuICAgICAgICAgICh0aGlzLmxhc3RFcnJvckNvZGUgPT09IDAgJiYgdmFsdWUgPT09ICcnKSkge1xuICAgICAgICAvLyBkbyBub3RoaW5nLCB3ZSB3YW50IHRoZSBpbnZlcnNlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5sYXN0RXJyb3JDb2RlID09PSAwKSB7XG4gICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUsXG4gICAgICAgICAgICAgICdEYXRhIE1vZGVsIEVsZW1lbnQgUGF0dGVybiBBbHJlYWR5IEV4aXN0cycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5HRU5FUkFMX1NFVF9GQUlMVVJFLFxuICAgICAgICAgICdEYXRhIE1vZGVsIEVsZW1lbnQgQ29sbGVjdGlvbiBMaW1pdCBSZWFjaGVkJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSB2YWx1ZSBmcm9tIHRoZSBDTUkgT2JqZWN0XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBDTUlFbGVtZW50XG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXRDTUlWYWx1ZShDTUlFbGVtZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbW1vbkdldENNSVZhbHVlKCdHZXRWYWx1ZScsIHRydWUsIENNSUVsZW1lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1lc3NhZ2UgdGhhdCBjb3JyZXNwb25kcyB0byBlcnJvck51bWJlci5cbiAgICpcbiAgICogQHBhcmFtIHsoc3RyaW5nfG51bWJlcil9IGVycm9yTnVtYmVyXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZGV0YWlsXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldExtc0Vycm9yTWVzc2FnZURldGFpbHMoZXJyb3JOdW1iZXIsIGRldGFpbCkge1xuICAgIGxldCBiYXNpY01lc3NhZ2UgPSAnJztcbiAgICBsZXQgZGV0YWlsTWVzc2FnZSA9ICcnO1xuXG4gICAgLy8gU2V0IGVycm9yIG51bWJlciB0byBzdHJpbmcgc2luY2UgaW5jb25zaXN0ZW50IGZyb20gbW9kdWxlcyBpZiBzdHJpbmcgb3IgbnVtYmVyXG4gICAgZXJyb3JOdW1iZXIgPSBTdHJpbmcoZXJyb3JOdW1iZXIpO1xuICAgIGlmIChjb25zdGFudHMuZXJyb3JfZGVzY3JpcHRpb25zW2Vycm9yTnVtYmVyXSkge1xuICAgICAgYmFzaWNNZXNzYWdlID0gY29uc3RhbnRzLmVycm9yX2Rlc2NyaXB0aW9uc1tlcnJvck51bWJlcl0uYmFzaWNNZXNzYWdlO1xuICAgICAgZGV0YWlsTWVzc2FnZSA9IGNvbnN0YW50cy5lcnJvcl9kZXNjcmlwdGlvbnNbZXJyb3JOdW1iZXJdLmRldGFpbE1lc3NhZ2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRldGFpbCA/IGRldGFpbE1lc3NhZ2UgOiBiYXNpY01lc3NhZ2U7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgdG8gc2VlIGlmIGEgY29ycmVjdF9yZXNwb25zZSB2YWx1ZSBoYXMgYmVlbiBkdXBsaWNhdGVkXG4gICAqIEBwYXJhbSB7Q01JQXJyYXl9IGNvcnJlY3RfcmVzcG9uc2VcbiAgICogQHBhcmFtIHtudW1iZXJ9IGN1cnJlbnRfaW5kZXhcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgY2hlY2tEdXBsaWNhdGVkUGF0dGVybiA9IChjb3JyZWN0X3Jlc3BvbnNlLCBjdXJyZW50X2luZGV4LCB2YWx1ZSkgPT4ge1xuICAgIGxldCBmb3VuZCA9IGZhbHNlO1xuICAgIGNvbnN0IGNvdW50ID0gY29ycmVjdF9yZXNwb25zZS5fY291bnQ7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3VudCAmJiAhZm91bmQ7IGkrKykge1xuICAgICAgaWYgKGkgIT09IGN1cnJlbnRfaW5kZXggJiYgY29ycmVjdF9yZXNwb25zZS5jaGlsZEFycmF5W2ldID09PSB2YWx1ZSkge1xuICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmb3VuZDtcbiAgfTtcblxuICAvKipcbiAgICogQ2hlY2tzIGZvciBhIHZhbGlkIGNvcnJlY3RfcmVzcG9uc2UgdmFsdWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGludGVyYWN0aW9uX3R5cGVcbiAgICogQHBhcmFtIHtBcnJheX0gbm9kZXNcbiAgICogQHBhcmFtIHsqfSB2YWx1ZVxuICAgKi9cbiAgY2hlY2tDb3JyZWN0UmVzcG9uc2VWYWx1ZShpbnRlcmFjdGlvbl90eXBlLCBub2RlcywgdmFsdWUpIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGNvcnJlY3RfcmVzcG9uc2VzW2ludGVyYWN0aW9uX3R5cGVdO1xuICAgIGNvbnN0IGZvcm1hdFJlZ2V4ID0gbmV3IFJlZ0V4cChyZXNwb25zZS5mb3JtYXQpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoICYmIHRoaXMubGFzdEVycm9yQ29kZSA9PT0gMDsgaSsrKSB7XG4gICAgICBpZiAoaW50ZXJhY3Rpb25fdHlwZS5tYXRjaChcbiAgICAgICAgICAnXihmaWxsLWlufGxvbmctZmlsbC1pbnxtYXRjaGluZ3xwZXJmb3JtYW5jZXxzZXF1ZW5jaW5nKSQnKSkge1xuICAgICAgICBub2Rlc1tpXSA9IHRoaXMucmVtb3ZlQ29ycmVjdFJlc3BvbnNlUHJlZml4ZXMobm9kZXNbaV0pO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzcG9uc2UuZGVsaW1pdGVyMiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IG5vZGVzW2ldLnNwbGl0KHJlc3BvbnNlLmRlbGltaXRlcjIpO1xuICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCA9PT0gMikge1xuICAgICAgICAgIGNvbnN0IG1hdGNoZXMgPSB2YWx1ZXNbMF0ubWF0Y2goZm9ybWF0UmVnZXgpO1xuICAgICAgICAgIGlmICghbWF0Y2hlcykge1xuICAgICAgICAgICAgdGhpcy50aHJvd1NDT1JNRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXZhbHVlc1sxXS5tYXRjaChuZXcgUmVnRXhwKHJlc3BvbnNlLmZvcm1hdDIpKSkge1xuICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbWF0Y2hlcyA9IG5vZGVzW2ldLm1hdGNoKGZvcm1hdFJlZ2V4KTtcbiAgICAgICAgaWYgKCghbWF0Y2hlcyAmJiB2YWx1ZSAhPT0gJycpIHx8XG4gICAgICAgICAgICAoIW1hdGNoZXMgJiYgaW50ZXJhY3Rpb25fdHlwZSA9PT0gJ3RydWUtZmFsc2UnKSkge1xuICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoaW50ZXJhY3Rpb25fdHlwZSA9PT0gJ251bWVyaWMnICYmIG5vZGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgIGlmIChOdW1iZXIobm9kZXNbMF0pID4gTnVtYmVyKG5vZGVzWzFdKSkge1xuICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChub2Rlc1tpXSAhPT0gJycgJiYgcmVzcG9uc2UudW5pcXVlKSB7XG4gICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaSAmJiB0aGlzLmxhc3RFcnJvckNvZGUgPT09IDA7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChub2Rlc1tpXSA9PT0gbm9kZXNbal0pIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHByZWZpeGVzIGZyb20gY29ycmVjdF9yZXNwb25zZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbm9kZVxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgcmVtb3ZlQ29ycmVjdFJlc3BvbnNlUHJlZml4ZXMobm9kZSkge1xuICAgIGxldCBzZWVuT3JkZXIgPSBmYWxzZTtcbiAgICBsZXQgc2VlbkNhc2UgPSBmYWxzZTtcbiAgICBsZXQgc2VlbkxhbmcgPSBmYWxzZTtcblxuICAgIGNvbnN0IHByZWZpeFJlZ2V4ID0gbmV3IFJlZ0V4cChcbiAgICAgICAgJ14oeyhsYW5nfGNhc2VfbWF0dGVyc3xvcmRlcl9tYXR0ZXJzKT0oW159XSspfSknKTtcbiAgICBsZXQgbWF0Y2hlcyA9IG5vZGUubWF0Y2gocHJlZml4UmVnZXgpO1xuICAgIGxldCBsYW5nTWF0Y2hlcyA9IG51bGw7XG4gICAgd2hpbGUgKG1hdGNoZXMpIHtcbiAgICAgIHN3aXRjaCAobWF0Y2hlc1syXSkge1xuICAgICAgICBjYXNlICdsYW5nJzpcbiAgICAgICAgICBsYW5nTWF0Y2hlcyA9IG5vZGUubWF0Y2goc2Nvcm0yMDA0X3JlZ2V4LkNNSUxhbmdjcik7XG4gICAgICAgICAgaWYgKGxhbmdNYXRjaGVzKSB7XG4gICAgICAgICAgICBjb25zdCBsYW5nID0gbGFuZ01hdGNoZXNbM107XG4gICAgICAgICAgICBpZiAobGFuZyAhPT0gdW5kZWZpbmVkICYmIGxhbmcubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICBpZiAodmFsaWRfbGFuZ3VhZ2VzW2xhbmcudG9Mb3dlckNhc2UoKV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzZWVuTGFuZyA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2Nhc2VfbWF0dGVycyc6XG4gICAgICAgICAgaWYgKCFzZWVuTGFuZyAmJiAhc2Vlbk9yZGVyICYmICFzZWVuQ2FzZSkge1xuICAgICAgICAgICAgaWYgKG1hdGNoZXNbM10gIT09ICd0cnVlJyAmJiBtYXRjaGVzWzNdICE9PSAnZmFsc2UnKSB7XG4gICAgICAgICAgICAgIHRoaXMudGhyb3dTQ09STUVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzZWVuQ2FzZSA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ29yZGVyX21hdHRlcnMnOlxuICAgICAgICAgIGlmICghc2VlbkNhc2UgJiYgIXNlZW5MYW5nICYmICFzZWVuT3JkZXIpIHtcbiAgICAgICAgICAgIGlmIChtYXRjaGVzWzNdICE9PSAndHJ1ZScgJiYgbWF0Y2hlc1szXSAhPT0gJ2ZhbHNlJykge1xuICAgICAgICAgICAgICB0aGlzLnRocm93U0NPUk1FcnJvcihzY29ybTIwMDRfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2Vlbk9yZGVyID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIG5vZGUgPSBub2RlLnN1YnN0cihtYXRjaGVzWzFdLmxlbmd0aCk7XG4gICAgICBtYXRjaGVzID0gbm9kZS5tYXRjaChwcmVmaXhSZWdleCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGU7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSB0aGUgd2hvbGUgQVBJIHdpdGggYW5vdGhlclxuICAgKiBAcGFyYW0ge1Njb3JtMjAwNEFQSX0gbmV3QVBJXG4gICAqL1xuICByZXBsYWNlV2l0aEFub3RoZXJTY29ybUFQSShuZXdBUEkpIHtcbiAgICAvLyBEYXRhIE1vZGVsXG4gICAgdGhpcy5jbWkgPSBuZXdBUEkuY21pO1xuICAgIHRoaXMuYWRsID0gbmV3QVBJLmFkbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHRoZSBjdXJyZW50IHNlc3Npb24gdGltZSB0byB0aGUgZXhpc3RpbmcgdG90YWwgdGltZS5cbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfSBJU084NjAxIER1cmF0aW9uXG4gICAqL1xuICBnZXRDdXJyZW50VG90YWxUaW1lKCkge1xuICAgIGNvbnN0IHRvdGFsVGltZSA9IHRoaXMuY21pLnRvdGFsX3RpbWU7XG4gICAgY29uc3Qgc2Vzc2lvblRpbWUgPSB0aGlzLmNtaS5zZXNzaW9uX3RpbWU7XG5cbiAgICByZXR1cm4gVXRpbC5hZGRUd29EdXJhdGlvbnModG90YWxUaW1lLCBzZXNzaW9uVGltZSxcbiAgICAgICAgc2Nvcm0yMDA0X3JlZ2V4LkNNSVRpbWVzcGFuKTtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgU2Nvcm0xMkNNSSBmcm9tICcuL3Njb3JtMTJfY21pJztcbmltcG9ydCB7QmFzZUNNSSwgQ01JQXJyYXksIENNSVNjb3JlfSBmcm9tICcuL2NvbW1vbic7XG5pbXBvcnQge2FpY2NfY29uc3RhbnRzfSBmcm9tICcuLi9jb25zdGFudHMvYXBpX2NvbnN0YW50cyc7XG5pbXBvcnQge2FpY2NfcmVnZXh9IGZyb20gJy4uL2NvbnN0YW50cy9yZWdleCc7XG5pbXBvcnQge3Njb3JtMTJfZXJyb3JfY29kZXN9IGZyb20gJy4uL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQge1xuICBjaGVjazEyVmFsaWRGb3JtYXQsXG4gIHRocm93UmVhZE9ubHlFcnJvcixcbiAgdGhyb3dXcml0ZU9ubHlFcnJvcixcbn0gZnJvbSAnLi9zY29ybTEyX2NtaSc7XG5cbmNvbnN0IGNvbnN0YW50cyA9IGFpY2NfY29uc3RhbnRzO1xuY29uc3QgcmVnZXggPSBhaWNjX3JlZ2V4O1xuXG4vKipcbiAqIENNSSBDbGFzcyBmb3IgQUlDQ1xuICovXG5leHBvcnQgY2xhc3MgQ01JIGV4dGVuZHMgU2Nvcm0xMkNNSS5DTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEFJQ0MgQ01JIG9iamVjdFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGluaXRpYWxpemVkXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihpbml0aWFsaXplZDogYm9vbGVhbikge1xuICAgIHN1cGVyKGNvbnN0YW50cy5jbWlfY2hpbGRyZW4pO1xuXG4gICAgaWYgKGluaXRpYWxpemVkKSB0aGlzLmluaXRpYWxpemUoKTtcblxuICAgIHRoaXMuc3R1ZGVudF9kYXRhID0gbmV3IEFJQ0NDTUlTdHVkZW50RGF0YSgpO1xuICAgIHRoaXMuZXZhbHVhdGlvbiA9IG5ldyBDTUlFdmFsdWF0aW9uKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc3R1ZGVudF9kYXRhPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5ldmFsdWF0aW9uPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWlcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBzdXNwZW5kX2RhdGE6IHN0cmluZyxcbiAgICogICAgICBsYXVuY2hfZGF0YTogc3RyaW5nLFxuICAgKiAgICAgIGNvbW1lbnRzOiBzdHJpbmcsXG4gICAqICAgICAgY29tbWVudHNfZnJvbV9sbXM6IHN0cmluZyxcbiAgICogICAgICBjb3JlOiBDTUlDb3JlLFxuICAgKiAgICAgIG9iamVjdGl2ZXM6IENNSU9iamVjdGl2ZXMsXG4gICAqICAgICAgc3R1ZGVudF9kYXRhOiBDTUlTdHVkZW50RGF0YSxcbiAgICogICAgICBzdHVkZW50X3ByZWZlcmVuY2U6IENNSVN0dWRlbnRQcmVmZXJlbmNlLFxuICAgKiAgICAgIGludGVyYWN0aW9uczogQ01JSW50ZXJhY3Rpb25zXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdzdXNwZW5kX2RhdGEnOiB0aGlzLnN1c3BlbmRfZGF0YSxcbiAgICAgICdsYXVuY2hfZGF0YSc6IHRoaXMubGF1bmNoX2RhdGEsXG4gICAgICAnY29tbWVudHMnOiB0aGlzLmNvbW1lbnRzLFxuICAgICAgJ2NvbW1lbnRzX2Zyb21fbG1zJzogdGhpcy5jb21tZW50c19mcm9tX2xtcyxcbiAgICAgICdjb3JlJzogdGhpcy5jb3JlLFxuICAgICAgJ29iamVjdGl2ZXMnOiB0aGlzLm9iamVjdGl2ZXMsXG4gICAgICAnc3R1ZGVudF9kYXRhJzogdGhpcy5zdHVkZW50X2RhdGEsXG4gICAgICAnc3R1ZGVudF9wcmVmZXJlbmNlJzogdGhpcy5zdHVkZW50X3ByZWZlcmVuY2UsXG4gICAgICAnaW50ZXJhY3Rpb25zJzogdGhpcy5pbnRlcmFjdGlvbnMsXG4gICAgICAnZXZhbHVhdGlvbic6IHRoaXMuZXZhbHVhdGlvbixcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIEFJQ0MgRXZhbHVhdGlvbiBvYmplY3RcbiAqL1xuY2xhc3MgQ01JRXZhbHVhdGlvbiBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEFJQ0MgRXZhbHVhdGlvbiBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmNvbW1lbnRzID0gbmV3IENNSUV2YWx1YXRpb25Db21tZW50cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmNvbW1lbnRzPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuZXZhbHVhdGlvbiBvYmplY3RcbiAgICogQHJldHVybiB7e2NvbW1lbnRzOiBDTUlFdmFsdWF0aW9uQ29tbWVudHN9fVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2NvbW1lbnRzJzogdGhpcy5jb21tZW50cyxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBBSUNDJ3MgY21pLmV2YWx1YXRpb24uY29tbWVudHMgb2JqZWN0XG4gKi9cbmNsYXNzIENNSUV2YWx1YXRpb25Db21tZW50cyBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBBSUNDIEV2YWx1YXRpb24gQ29tbWVudHMgb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihjb25zdGFudHMuY29tbWVudHNfY2hpbGRyZW4sXG4gICAgICAgIHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUpO1xuICB9XG59XG5cbi8qKlxuICogU3R1ZGVudERhdGEgY2xhc3MgZm9yIEFJQ0NcbiAqL1xuY2xhc3MgQUlDQ0NNSVN0dWRlbnREYXRhIGV4dGVuZHMgU2Nvcm0xMkNNSS5DTUlTdHVkZW50RGF0YSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgQUlDQyBTdHVkZW50RGF0YSBvYmplY3RcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKGNvbnN0YW50cy5zdHVkZW50X2RhdGFfY2hpbGRyZW4pO1xuXG4gICAgdGhpcy50cmllcyA9IG5ldyBDTUlUcmllcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnRyaWVzPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAjdHJpZXNfZHVyaW5nX2xlc3NvbiA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIHRyaWVzX2R1cmluZ19sZXNzb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRyaWVzX2R1cmluZ19sZXNzb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RyaWVzX2R1cmluZ19sZXNzb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdHJpZXNfZHVyaW5nX2xlc3Nvbi4gU2V0cyBhbiBlcnJvciBpZiB0cnlpbmcgdG8gc2V0IGFmdGVyXG4gICAqICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRyaWVzX2R1cmluZ19sZXNzb25cbiAgICovXG4gIHNldCB0cmllc19kdXJpbmdfbGVzc29uKHRyaWVzX2R1cmluZ19sZXNzb24pIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI3RyaWVzX2R1cmluZ19sZXNzb24gPSB0cmllc19kdXJpbmdfbGVzc29uIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuc3R1ZGVudF9kYXRhIG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIG1hc3Rlcnlfc2NvcmU6IHN0cmluZyxcbiAgICogICAgICBtYXhfdGltZV9hbGxvd2VkOiBzdHJpbmcsXG4gICAqICAgICAgdGltZV9saW1pdF9hY3Rpb246IHN0cmluZyxcbiAgICogICAgICB0cmllczogQ01JVHJpZXNcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ21hc3Rlcnlfc2NvcmUnOiB0aGlzLm1hc3Rlcnlfc2NvcmUsXG4gICAgICAnbWF4X3RpbWVfYWxsb3dlZCc6IHRoaXMubWF4X3RpbWVfYWxsb3dlZCxcbiAgICAgICd0aW1lX2xpbWl0X2FjdGlvbic6IHRoaXMudGltZV9saW1pdF9hY3Rpb24sXG4gICAgICAndHJpZXMnOiB0aGlzLnRyaWVzLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIHRoZSBBSUNDIGNtaS5zdHVkZW50X2RhdGEudHJpZXMgb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlUcmllcyBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBpbmxpbmUgVHJpZXMgQXJyYXkgY2xhc3NcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKGFpY2NfY29uc3RhbnRzLnRyaWVzX2NoaWxkcmVuKTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBBSUNDIFRyaWVzXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlUcmllc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEFJQ0MgVHJpZXMgb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zY29yZSA9IG5ldyBDTUlTY29yZShcbiAgICAgICAge1xuICAgICAgICAgIHNjb3JlX2NoaWxkcmVuOiBjb25zdGFudHMuc2NvcmVfY2hpbGRyZW4sXG4gICAgICAgICAgc2NvcmVfcmFuZ2U6IHJlZ2V4LnNjb3JlX3JhbmdlLFxuICAgICAgICAgIGludmFsaWRFcnJvckNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuSU5WQUxJRF9TRVRfVkFMVUUsXG4gICAgICAgICAgaW52YWxpZFR5cGVDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gsXG4gICAgICAgICAgaW52YWxpZFJhbmdlQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0UsXG4gICAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnNjb3JlPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAjc3RhdHVzID0gJyc7XG4gICN0aW1lID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNzdGF0dXM7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0dXNcbiAgICovXG4gIHNldCBzdGF0dXMoc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChzdGF0dXMsIHJlZ2V4LkNNSVN0YXR1czIpKSB7XG4gICAgICB0aGlzLiNzdGF0dXMgPSBzdGF0dXM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGltZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZVxuICAgKi9cbiAgc2V0IHRpbWUodGltZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQodGltZSwgcmVnZXguQ01JVGltZSkpIHtcbiAgICAgIHRoaXMuI3RpbWUgPSB0aW1lO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5zdHVkZW50X2RhdGEudHJpZXMubiBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBzdGF0dXM6IHN0cmluZyxcbiAgICogICAgICB0aW1lOiBzdHJpbmcsXG4gICAqICAgICAgc2NvcmU6IENNSVNjb3JlXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdzdGF0dXMnOiB0aGlzLnN0YXR1cyxcbiAgICAgICd0aW1lJzogdGhpcy50aW1lLFxuICAgICAgJ3Njb3JlJzogdGhpcy5zY29yZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBBSUNDIEV2YWx1YXRpb24gQ29tbWVudHNcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUV2YWx1YXRpb25Db21tZW50c09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIEV2YWx1YXRpb24gQ29tbWVudHNcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAjY29udGVudCA9ICcnO1xuICAjbG9jYXRpb24gPSAnJztcbiAgI3RpbWUgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29udGVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29udGVudCgpIHtcbiAgICByZXR1cm4gdGhpcy4jY29udGVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb250ZW50XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb250ZW50XG4gICAqL1xuICBzZXQgY29udGVudChjb250ZW50KSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChjb250ZW50LCByZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiNjb250ZW50ID0gY29udGVudDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbG9jYXRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxvY2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNsb2NhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsb2NhdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb25cbiAgICovXG4gIHNldCBsb2NhdGlvbihsb2NhdGlvbikge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQobG9jYXRpb24sIHJlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI2xvY2F0aW9uID0gbG9jYXRpb247XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGluZyBmb3IgI3RpbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVcbiAgICovXG4gIHNldCB0aW1lKHRpbWUpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHRpbWUsIHJlZ2V4LkNNSVRpbWUpKSB7XG4gICAgICB0aGlzLiN0aW1lID0gdGltZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuZXZhdWxhdGlvbi5jb21tZW50cy5uIG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGNvbnRlbnQ6IHN0cmluZyxcbiAgICogICAgICBsb2NhdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIHRpbWU6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnY29udGVudCc6IHRoaXMuY29udGVudCxcbiAgICAgICdsb2NhdGlvbic6IHRoaXMubG9jYXRpb24sXG4gICAgICAndGltZSc6IHRoaXMudGltZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBBSUNDIE5hdmlnYXRpb24gb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBOQVYgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBOQVYgb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgI2V2ZW50ID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2V2ZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBldmVudCgpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jZXZlbnQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZXZlbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAqL1xuICBzZXQgZXZlbnQoZXZlbnQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGV2ZW50LCByZWdleC5OQVZFdmVudCkpIHtcbiAgICAgIHRoaXMuI2V2ZW50ID0gZXZlbnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgbmF2IG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGV2ZW50OiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2V2ZW50JzogdGhpcy5ldmVudCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCB7c2Nvcm0xMl9jb25zdGFudHN9IGZyb20gJy4uL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCB7c2Nvcm0xMl9lcnJvcl9jb2Rlc30gZnJvbSAnLi4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJztcbmltcG9ydCB7VmFsaWRhdGlvbkVycm9yfSBmcm9tICcuLi9leGNlcHRpb25zJztcbmltcG9ydCB7c2Nvcm0xMl9yZWdleH0gZnJvbSAnLi4vY29uc3RhbnRzL3JlZ2V4JztcblxuLyoqXG4gKiBDaGVjayBpZiB0aGUgdmFsdWUgbWF0Y2hlcyB0aGUgcHJvcGVyIGZvcm1hdC4gSWYgbm90LCB0aHJvdyBwcm9wZXIgZXJyb3IgY29kZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWdleFBhdHRlcm5cbiAqIEBwYXJhbSB7bnVtYmVyfSBlcnJvckNvZGVcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWxsb3dFbXB0eVN0cmluZ1xuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrVmFsaWRGb3JtYXQoXG4gICAgdmFsdWU6IFN0cmluZyxcbiAgICByZWdleFBhdHRlcm46IFN0cmluZyxcbiAgICBlcnJvckNvZGU6IG51bWJlcixcbiAgICBhbGxvd0VtcHR5U3RyaW5nPzogYm9vbGVhbikge1xuICBjb25zdCBmb3JtYXRSZWdleCA9IG5ldyBSZWdFeHAocmVnZXhQYXR0ZXJuKTtcbiAgY29uc3QgbWF0Y2hlcyA9IHZhbHVlLm1hdGNoKGZvcm1hdFJlZ2V4KTtcbiAgaWYgKGFsbG93RW1wdHlTdHJpbmcgJiYgdmFsdWUgPT09ICcnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgfHwgIW1hdGNoZXMgfHwgbWF0Y2hlc1swXSA9PT0gJycpIHtcbiAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKGVycm9yQ29kZSk7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIHZhbHVlIG1hdGNoZXMgdGhlIHByb3BlciByYW5nZS4gSWYgbm90LCB0aHJvdyBwcm9wZXIgZXJyb3IgY29kZS5cbiAqXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcmFuZ2VQYXR0ZXJuXG4gKiBAcGFyYW0ge251bWJlcn0gZXJyb3JDb2RlXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tWYWxpZFJhbmdlKFxuICAgIHZhbHVlOiBhbnksIHJhbmdlUGF0dGVybjogU3RyaW5nLCBlcnJvckNvZGU6IG51bWJlcikge1xuICBjb25zdCByYW5nZXMgPSByYW5nZVBhdHRlcm4uc3BsaXQoJyMnKTtcbiAgdmFsdWUgPSB2YWx1ZSAqIDEuMDtcbiAgaWYgKHZhbHVlID49IHJhbmdlc1swXSkge1xuICAgIGlmICgocmFuZ2VzWzFdID09PSAnKicpIHx8ICh2YWx1ZSA8PSByYW5nZXNbMV0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihlcnJvckNvZGUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKGVycm9yQ29kZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBBUEkgY21pIG9iamVjdHNcbiAqL1xuZXhwb3J0IGNsYXNzIEJhc2VDTUkge1xuICBqc29uU3RyaW5nID0gZmFsc2U7XG4gICNpbml0aWFsaXplZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNpbml0aWFsaXplZFxuICAgKiBAcmV0dXJuIHtib29sZWFufVxuICAgKi9cbiAgZ2V0IGluaXRpYWxpemVkKCkge1xuICAgIHJldHVybiB0aGlzLiNpbml0aWFsaXplZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLiNpbml0aWFsaXplZCA9IHRydWU7XG4gIH1cbn1cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciBjbWkgKi5zY29yZSBvYmplY3RzXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlTY29yZSBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yICouc2NvcmVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjb3JlX2NoaWxkcmVuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzY29yZV9yYW5nZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWF4XG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbnZhbGlkRXJyb3JDb2RlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBpbnZhbGlkVHlwZUNvZGVcbiAgICogQHBhcmFtIHtudW1iZXJ9IGludmFsaWRSYW5nZUNvZGVcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlY2ltYWxSZWdleFxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgICB7XG4gICAgICAgIHNjb3JlX2NoaWxkcmVuLFxuICAgICAgICBzY29yZV9yYW5nZSxcbiAgICAgICAgbWF4LFxuICAgICAgICBpbnZhbGlkRXJyb3JDb2RlLFxuICAgICAgICBpbnZhbGlkVHlwZUNvZGUsXG4gICAgICAgIGludmFsaWRSYW5nZUNvZGUsXG4gICAgICAgIGRlY2ltYWxSZWdleCxcbiAgICAgIH0pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy4jX2NoaWxkcmVuID0gc2NvcmVfY2hpbGRyZW4gP1xuICAgICAgICBzY29yZV9jaGlsZHJlbiA6XG4gICAgICAgIHNjb3JtMTJfY29uc3RhbnRzLnNjb3JlX2NoaWxkcmVuO1xuICAgIHRoaXMuI19zY29yZV9yYW5nZSA9ICFzY29yZV9yYW5nZSA/IGZhbHNlIDogc2Nvcm0xMl9yZWdleC5zY29yZV9yYW5nZTtcbiAgICB0aGlzLiNtYXggPSAobWF4IHx8IG1heCA9PT0gJycpID8gbWF4IDogJzEwMCc7XG4gICAgdGhpcy4jX2ludmFsaWRfZXJyb3JfY29kZSA9IGludmFsaWRFcnJvckNvZGUgP1xuICAgICAgICBpbnZhbGlkRXJyb3JDb2RlIDpcbiAgICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRTtcbiAgICB0aGlzLiNfaW52YWxpZF90eXBlX2NvZGUgPSBpbnZhbGlkVHlwZUNvZGUgP1xuICAgICAgICBpbnZhbGlkVHlwZUNvZGUgOlxuICAgICAgICBzY29ybTEyX2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0g7XG4gICAgdGhpcy4jX2ludmFsaWRfcmFuZ2VfY29kZSA9IGludmFsaWRSYW5nZUNvZGUgP1xuICAgICAgICBpbnZhbGlkUmFuZ2VDb2RlIDpcbiAgICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0U7XG4gICAgdGhpcy4jX2RlY2ltYWxfcmVnZXggPSBkZWNpbWFsUmVnZXggP1xuICAgICAgICBkZWNpbWFsUmVnZXggOlxuICAgICAgICBzY29ybTEyX3JlZ2V4LkNNSURlY2ltYWw7XG4gIH1cblxuICAjX2NoaWxkcmVuO1xuICAjX3Njb3JlX3JhbmdlO1xuICAjX2ludmFsaWRfZXJyb3JfY29kZTtcbiAgI19pbnZhbGlkX3R5cGVfY29kZTtcbiAgI19pbnZhbGlkX3JhbmdlX2NvZGU7XG4gICNfZGVjaW1hbF9yZWdleDtcbiAgI3JhdyA9ICcnO1xuICAjbWluID0gJyc7XG4gICNtYXg7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgX2NoaWxkcmVuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yIF9jaGlsZHJlbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfY2hpbGRyZW5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldCBfY2hpbGRyZW4oX2NoaWxkcmVuKSB7XG4gICAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcih0aGlzLiNfaW52YWxpZF9lcnJvcl9jb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNyYXdcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHJhdygpIHtcbiAgICByZXR1cm4gdGhpcy4jcmF3O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3Jhd1xuICAgKiBAcGFyYW0ge3N0cmluZ30gcmF3XG4gICAqL1xuICBzZXQgcmF3KHJhdykge1xuICAgIGlmIChjaGVja1ZhbGlkRm9ybWF0KHJhdywgdGhpcy4jX2RlY2ltYWxfcmVnZXgsXG4gICAgICAgIHRoaXMuI19pbnZhbGlkX3R5cGVfY29kZSkgJiZcbiAgICAgICAgKCF0aGlzLiNfc2NvcmVfcmFuZ2UgfHxcbiAgICAgICAgICAgIGNoZWNrVmFsaWRSYW5nZShyYXcsIHRoaXMuI19zY29yZV9yYW5nZSxcbiAgICAgICAgICAgICAgICB0aGlzLiNfaW52YWxpZF9yYW5nZV9jb2RlKSkpIHtcbiAgICAgIHRoaXMuI3JhdyA9IHJhdztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbWluXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBtaW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI21pbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNtaW5cbiAgICogQHBhcmFtIHtzdHJpbmd9IG1pblxuICAgKi9cbiAgc2V0IG1pbihtaW4pIHtcbiAgICBpZiAoY2hlY2tWYWxpZEZvcm1hdChtaW4sIHRoaXMuI19kZWNpbWFsX3JlZ2V4LFxuICAgICAgICB0aGlzLiNfaW52YWxpZF90eXBlX2NvZGUpICYmXG4gICAgICAgICghdGhpcy4jX3Njb3JlX3JhbmdlIHx8XG4gICAgICAgICAgICBjaGVja1ZhbGlkUmFuZ2UobWluLCB0aGlzLiNfc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgICAgICAgdGhpcy4jX2ludmFsaWRfcmFuZ2VfY29kZSkpKSB7XG4gICAgICB0aGlzLiNtaW4gPSBtaW47XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI21heFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbWF4KCkge1xuICAgIHJldHVybiB0aGlzLiNtYXg7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbWF4XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYXhcbiAgICovXG4gIHNldCBtYXgobWF4KSB7XG4gICAgaWYgKGNoZWNrVmFsaWRGb3JtYXQobWF4LCB0aGlzLiNfZGVjaW1hbF9yZWdleCxcbiAgICAgICAgdGhpcy4jX2ludmFsaWRfdHlwZV9jb2RlKSAmJlxuICAgICAgICAoIXRoaXMuI19zY29yZV9yYW5nZSB8fFxuICAgICAgICAgICAgY2hlY2tWYWxpZFJhbmdlKG1heCwgdGhpcy4jX3Njb3JlX3JhbmdlLFxuICAgICAgICAgICAgICAgIHRoaXMuI19pbnZhbGlkX3JhbmdlX2NvZGUpKSkge1xuICAgICAgdGhpcy4jbWF4ID0gbWF4O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yICouc2NvcmVcbiAgICogQHJldHVybiB7e21pbjogc3RyaW5nLCBtYXg6IHN0cmluZywgcmF3OiBzdHJpbmd9fVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHJldHVybiB7XG4gICAgICAncmF3JzogdGhpcy5yYXcsXG4gICAgICAnbWluJzogdGhpcy5taW4sXG4gICAgICAnbWF4JzogdGhpcy5tYXgsXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIGNtaSAqLm4gb2JqZWN0c1xuICovXG5leHBvcnQgY2xhc3MgQ01JQXJyYXkgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGNtaSAqLm4gYXJyYXlzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjaGlsZHJlblxuICAgKiBAcGFyYW0ge251bWJlcn0gZXJyb3JDb2RlXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih7Y2hpbGRyZW4sIGVycm9yQ29kZX0pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuI19jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgIHRoaXMuI2Vycm9yQ29kZSA9IGVycm9yQ29kZTtcbiAgICB0aGlzLmNoaWxkQXJyYXkgPSBbXTtcbiAgfVxuXG4gICNlcnJvckNvZGU7XG4gICNfY2hpbGRyZW47XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgX2NoaWxkcmVuXG4gICAqIEByZXR1cm4geyp9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciBfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX2NoaWxkcmVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IodGhpcy4jZXJyb3JDb2RlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yIF9jb3VudFxuICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXQgX2NvdW50KCkge1xuICAgIHJldHVybiB0aGlzLmNoaWxkQXJyYXkubGVuZ3RoO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgX2NvdW50LiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IF9jb3VudFxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jb3VudChfY291bnQpIHtcbiAgICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHRoaXMuI2Vycm9yQ29kZSk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciAqLm4gYXJyYXlzXG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZEFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHRbaSArICcnXSA9IHRoaXMuY2hpbGRBcnJheVtpXTtcbiAgICB9XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iLCIvLyBAZmxvd1xuaW1wb3J0IHtcbiAgQmFzZUNNSSxcbiAgY2hlY2tWYWxpZEZvcm1hdCxcbiAgY2hlY2tWYWxpZFJhbmdlLFxuICBDTUlBcnJheSxcbiAgQ01JU2NvcmUsXG59IGZyb20gJy4vY29tbW9uJztcbmltcG9ydCB7c2Nvcm0xMl9jb25zdGFudHN9IGZyb20gJy4uL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCB7c2Nvcm0xMl9lcnJvcl9jb2Rlc30gZnJvbSAnLi4vY29uc3RhbnRzL2Vycm9yX2NvZGVzJztcbmltcG9ydCB7c2Nvcm0xMl9yZWdleH0gZnJvbSAnLi4vY29uc3RhbnRzL3JlZ2V4JztcbmltcG9ydCB7VmFsaWRhdGlvbkVycm9yfSBmcm9tICcuLi9leGNlcHRpb25zJztcblxuY29uc3QgY29uc3RhbnRzID0gc2Nvcm0xMl9jb25zdGFudHM7XG5jb25zdCByZWdleCA9IHNjb3JtMTJfcmVnZXg7XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgUmVhZCBPbmx5IGVycm9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aHJvd1JlYWRPbmx5RXJyb3IoKSB7XG4gIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3Ioc2Nvcm0xMl9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgV3JpdGUgT25seSBlcnJvclxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dXcml0ZU9ubHlFcnJvcigpIHtcbiAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihzY29ybTEyX2Vycm9yX2NvZGVzLldSSVRFX09OTFlfRUxFTUVOVCk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgSW52YWxpZCBTZXQgZXJyb3JcbiAqL1xuZnVuY3Rpb24gdGhyb3dJbnZhbGlkVmFsdWVFcnJvcigpIHtcbiAgdGhyb3cgbmV3IFZhbGlkYXRpb25FcnJvcihzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kLCBubyByZWFzb24gdG8gaGF2ZSB0byBwYXNzIHRoZSBzYW1lIGVycm9yIGNvZGVzIGV2ZXJ5IHRpbWVcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWdleFBhdHRlcm5cbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaGVjazEyVmFsaWRGb3JtYXQodmFsdWU6IFN0cmluZywgcmVnZXhQYXR0ZXJuOiBTdHJpbmcpIHtcbiAgcmV0dXJuIGNoZWNrVmFsaWRGb3JtYXQodmFsdWUsIHJlZ2V4UGF0dGVybixcbiAgICAgIHNjb3JtMTJfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCwgbm8gcmVhc29uIHRvIGhhdmUgdG8gcGFzcyB0aGUgc2FtZSBlcnJvciBjb2RlcyBldmVyeSB0aW1lXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gcmFuZ2VQYXR0ZXJuXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hlY2sxMlZhbGlkUmFuZ2UodmFsdWU6IGFueSwgcmFuZ2VQYXR0ZXJuOiBTdHJpbmcpIHtcbiAgcmV0dXJuIGNoZWNrVmFsaWRSYW5nZSh2YWx1ZSwgcmFuZ2VQYXR0ZXJuLFxuICAgICAgc2Nvcm0xMl9lcnJvcl9jb2Rlcy5WQUxVRV9PVVRfT0ZfUkFOR0UpO1xufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyB0aGUgY21pIG9iamVjdCBmb3IgU0NPUk0gMS4yXG4gKi9cbmV4cG9ydCBjbGFzcyBDTUkgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI19jaGlsZHJlbiA9ICcnO1xuICAjX3ZlcnNpb24gPSAnMy40JztcbiAgI3N1c3BlbmRfZGF0YSA9ICcnO1xuICAjbGF1bmNoX2RhdGEgPSAnJztcbiAgI2NvbW1lbnRzID0gJyc7XG4gICNjb21tZW50c19mcm9tX2xtcyA9ICcnO1xuXG4gIHN0dWRlbnRfZGF0YSA9IG51bGw7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciB0aGUgU0NPUk0gMS4yIGNtaSBvYmplY3RcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNtaV9jaGlsZHJlblxuICAgKiBAcGFyYW0geyhDTUlTdHVkZW50RGF0YXxBSUNDQ01JU3R1ZGVudERhdGEpfSBzdHVkZW50X2RhdGFcbiAgICogQHBhcmFtIHtib29sZWFufSBpbml0aWFsaXplZFxuICAgKi9cbiAgY29uc3RydWN0b3IoY21pX2NoaWxkcmVuLCBzdHVkZW50X2RhdGEsIGluaXRpYWxpemVkOiBib29sZWFuKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGlmIChpbml0aWFsaXplZCkgdGhpcy5pbml0aWFsaXplKCk7XG5cbiAgICB0aGlzLiNfY2hpbGRyZW4gPSBjbWlfY2hpbGRyZW4gPyBjbWlfY2hpbGRyZW4gOiBjb25zdGFudHMuY21pX2NoaWxkcmVuO1xuICAgIHRoaXMuY29yZSA9IG5ldyBDTUlDb3JlKCk7XG4gICAgdGhpcy5vYmplY3RpdmVzID0gbmV3IENNSU9iamVjdGl2ZXMoKTtcbiAgICB0aGlzLnN0dWRlbnRfZGF0YSA9IHN0dWRlbnRfZGF0YSA/IHN0dWRlbnRfZGF0YSA6IG5ldyBDTUlTdHVkZW50RGF0YSgpO1xuICAgIHRoaXMuc3R1ZGVudF9wcmVmZXJlbmNlID0gbmV3IENNSVN0dWRlbnRQcmVmZXJlbmNlKCk7XG4gICAgdGhpcy5pbnRlcmFjdGlvbnMgPSBuZXcgQ01JSW50ZXJhY3Rpb25zKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuY29yZT8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMub2JqZWN0aXZlcz8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc3R1ZGVudF9kYXRhPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zdHVkZW50X3ByZWZlcmVuY2U/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmludGVyYWN0aW9ucz8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgc3VzcGVuZF9kYXRhOiBzdHJpbmcsXG4gICAqICAgICAgbGF1bmNoX2RhdGE6IHN0cmluZyxcbiAgICogICAgICBjb21tZW50czogc3RyaW5nLFxuICAgKiAgICAgIGNvbW1lbnRzX2Zyb21fbG1zOiBzdHJpbmcsXG4gICAqICAgICAgY29yZTogQ01JQ29yZSxcbiAgICogICAgICBvYmplY3RpdmVzOiBDTUlPYmplY3RpdmVzLFxuICAgKiAgICAgIHN0dWRlbnRfZGF0YTogQ01JU3R1ZGVudERhdGEsXG4gICAqICAgICAgc3R1ZGVudF9wcmVmZXJlbmNlOiBDTUlTdHVkZW50UHJlZmVyZW5jZSxcbiAgICogICAgICBpbnRlcmFjdGlvbnM6IENNSUludGVyYWN0aW9uc1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnc3VzcGVuZF9kYXRhJzogdGhpcy5zdXNwZW5kX2RhdGEsXG4gICAgICAnbGF1bmNoX2RhdGEnOiB0aGlzLmxhdW5jaF9kYXRhLFxuICAgICAgJ2NvbW1lbnRzJzogdGhpcy5jb21tZW50cyxcbiAgICAgICdjb21tZW50c19mcm9tX2xtcyc6IHRoaXMuY29tbWVudHNfZnJvbV9sbXMsXG4gICAgICAnY29yZSc6IHRoaXMuY29yZSxcbiAgICAgICdvYmplY3RpdmVzJzogdGhpcy5vYmplY3RpdmVzLFxuICAgICAgJ3N0dWRlbnRfZGF0YSc6IHRoaXMuc3R1ZGVudF9kYXRhLFxuICAgICAgJ3N0dWRlbnRfcHJlZmVyZW5jZSc6IHRoaXMuc3R1ZGVudF9wcmVmZXJlbmNlLFxuICAgICAgJ2ludGVyYWN0aW9ucyc6IHRoaXMuaW50ZXJhY3Rpb25zLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI192ZXJzaW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfdmVyc2lvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX3ZlcnNpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX3ZlcnNpb24uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX3ZlcnNpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldCBfdmVyc2lvbihfdmVyc2lvbikge1xuICAgIHRocm93SW52YWxpZFZhbHVlRXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNfY2hpbGRyZW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IF9jaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI192ZXJzaW9uLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvd0ludmFsaWRWYWx1ZUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3VzcGVuZF9kYXRhXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzdXNwZW5kX2RhdGEoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N1c3BlbmRfZGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdXNwZW5kX2RhdGFcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN1c3BlbmRfZGF0YVxuICAgKi9cbiAgc2V0IHN1c3BlbmRfZGF0YShzdXNwZW5kX2RhdGEpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHN1c3BlbmRfZGF0YSwgcmVnZXguQ01JU3RyaW5nNDA5NikpIHtcbiAgICAgIHRoaXMuI3N1c3BlbmRfZGF0YSA9IHN1c3BlbmRfZGF0YTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGF1bmNoX2RhdGFcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxhdW5jaF9kYXRhKCkge1xuICAgIHJldHVybiB0aGlzLiNsYXVuY2hfZGF0YTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsYXVuY2hfZGF0YS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsYXVuY2hfZGF0YVxuICAgKi9cbiAgc2V0IGxhdW5jaF9kYXRhKGxhdW5jaF9kYXRhKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNsYXVuY2hfZGF0YSA9IGxhdW5jaF9kYXRhIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29tbWVudHNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbW1lbnRzKCkge1xuICAgIHJldHVybiB0aGlzLiNjb21tZW50cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb21tZW50c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY29tbWVudHNcbiAgICovXG4gIHNldCBjb21tZW50cyhjb21tZW50cykge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoY29tbWVudHMsIHJlZ2V4LkNNSVN0cmluZzQwOTYpKSB7XG4gICAgICB0aGlzLiNjb21tZW50cyA9IGNvbW1lbnRzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb21tZW50c19mcm9tX2xtc1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29tbWVudHNfZnJvbV9sbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbW1lbnRzX2Zyb21fbG1zO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbW1lbnRzX2Zyb21fbG1zLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbW1lbnRzX2Zyb21fbG1zXG4gICAqL1xuICBzZXQgY29tbWVudHNfZnJvbV9sbXMoY29tbWVudHNfZnJvbV9sbXMpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2NvbW1lbnRzX2Zyb21fbG1zID0gY29tbWVudHNfZnJvbV9sbXMgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyB0aGUgY21pLmNvcmUgb2JqZWN0XG4gKi9cbmNsYXNzIENNSUNvcmUgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuY29yZVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc2NvcmUgPSBuZXcgQ01JU2NvcmUoXG4gICAgICAgIHtcbiAgICAgICAgICBzY29yZV9jaGlsZHJlbjogY29uc3RhbnRzLnNjb3JlX2NoaWxkcmVuLFxuICAgICAgICAgIHNjb3JlX3JhbmdlOiByZWdleC5zY29yZV9yYW5nZSxcbiAgICAgICAgICBpbnZhbGlkRXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgICAgIGludmFsaWRUeXBlQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENILFxuICAgICAgICAgIGludmFsaWRSYW5nZUNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFLFxuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5zY29yZT8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgI19jaGlsZHJlbiA9IGNvbnN0YW50cy5jb3JlX2NoaWxkcmVuO1xuICAjc3R1ZGVudF9pZCA9ICcnO1xuICAjc3R1ZGVudF9uYW1lID0gJyc7XG4gICNsZXNzb25fbG9jYXRpb24gPSAnJztcbiAgI2NyZWRpdCA9ICcnO1xuICAjbGVzc29uX3N0YXR1cyA9ICcnO1xuICAjZW50cnkgPSAnJztcbiAgI3RvdGFsX3RpbWUgPSAnJztcbiAgI2xlc3Nvbl9tb2RlID0gJ25vcm1hbCc7XG4gICNleGl0ID0gJyc7XG4gICNzZXNzaW9uX3RpbWUgPSAnMDA6MDA6MDAnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNfY2hpbGRyZW5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IF9jaGlsZHJlbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX2NoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI19jaGlsZHJlbi4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBfY2hpbGRyZW5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldCBfY2hpbGRyZW4oX2NoaWxkcmVuKSB7XG4gICAgdGhyb3dJbnZhbGlkVmFsdWVFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N0dWRlbnRfaWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN0dWRlbnRfaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0dWRlbnRfaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3R1ZGVudF9pZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHVkZW50X2lkXG4gICAqL1xuICBzZXQgc3R1ZGVudF9pZChzdHVkZW50X2lkKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNzdHVkZW50X2lkID0gc3R1ZGVudF9pZCA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N0dWRlbnRfbmFtZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3R1ZGVudF9uYW1lKCkge1xuICAgIHJldHVybiB0aGlzLiNzdHVkZW50X25hbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3R1ZGVudF9uYW1lLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0dWRlbnRfbmFtZVxuICAgKi9cbiAgc2V0IHN0dWRlbnRfbmFtZShzdHVkZW50X25hbWUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI3N0dWRlbnRfbmFtZSA9IHN0dWRlbnRfbmFtZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xlc3Nvbl9sb2NhdGlvblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVzc29uX2xvY2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNsZXNzb25fbG9jYXRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGVzc29uX2xvY2F0aW9uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZXNzb25fbG9jYXRpb25cbiAgICovXG4gIHNldCBsZXNzb25fbG9jYXRpb24obGVzc29uX2xvY2F0aW9uKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChsZXNzb25fbG9jYXRpb24sIHJlZ2V4LkNNSVN0cmluZzI1NikpIHtcbiAgICAgIHRoaXMuI2xlc3Nvbl9sb2NhdGlvbiA9IGxlc3Nvbl9sb2NhdGlvbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY3JlZGl0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjcmVkaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NyZWRpdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjcmVkaXQuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY3JlZGl0XG4gICAqL1xuICBzZXQgY3JlZGl0KGNyZWRpdCkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jY3JlZGl0ID0gY3JlZGl0IDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGVzc29uX3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVzc29uX3N0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jbGVzc29uX3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsZXNzb25fc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZXNzb25fc3RhdHVzXG4gICAqL1xuICBzZXQgbGVzc29uX3N0YXR1cyhsZXNzb25fc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChsZXNzb25fc3RhdHVzLCByZWdleC5DTUlTdGF0dXMpKSB7XG4gICAgICB0aGlzLiNsZXNzb25fc3RhdHVzID0gbGVzc29uX3N0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZW50cnlcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGVudHJ5KCkge1xuICAgIHJldHVybiB0aGlzLiNlbnRyeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNlbnRyeS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlbnRyeVxuICAgKi9cbiAgc2V0IGVudHJ5KGVudHJ5KSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNlbnRyeSA9IGVudHJ5IDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdG90YWxfdGltZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdG90YWxfdGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jdG90YWxfdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0b3RhbF90aW1lLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHRvdGFsX3RpbWVcbiAgICovXG4gIHNldCB0b3RhbF90aW1lKHRvdGFsX3RpbWUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHRoaXMuI3RvdGFsX3RpbWUgPSB0b3RhbF90aW1lIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGVzc29uX21vZGVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlc3Nvbl9tb2RlKCkge1xuICAgIHJldHVybiB0aGlzLiNsZXNzb25fbW9kZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsZXNzb25fbW9kZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZXNzb25fbW9kZVxuICAgKi9cbiAgc2V0IGxlc3Nvbl9tb2RlKGxlc3Nvbl9tb2RlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNsZXNzb25fbW9kZSA9IGxlc3Nvbl9tb2RlIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZXhpdC4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCBleGl0KCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNleGl0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2V4aXRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV4aXRcbiAgICovXG4gIHNldCBleGl0KGV4aXQpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGV4aXQsIHJlZ2V4LkNNSUV4aXQpKSB7XG4gICAgICB0aGlzLiNleGl0ID0gZXhpdDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc2Vzc2lvbl90aW1lLiBTaG91bGQgb25seSBiZSBjYWxsZWQgZHVyaW5nIEpTT04gZXhwb3J0LlxuICAgKiBAcmV0dXJuIHsqfVxuICAgKi9cbiAgZ2V0IHNlc3Npb25fdGltZSgpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jc2Vzc2lvbl90aW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3Nlc3Npb25fdGltZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2Vzc2lvbl90aW1lXG4gICAqL1xuICBzZXQgc2Vzc2lvbl90aW1lKHNlc3Npb25fdGltZSkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoc2Vzc2lvbl90aW1lLCByZWdleC5DTUlUaW1lc3BhbikpIHtcbiAgICAgIHRoaXMuI3Nlc3Npb25fdGltZSA9IHNlc3Npb25fdGltZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuY29yZVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHN0dWRlbnRfbmFtZTogc3RyaW5nLFxuICAgKiAgICAgIGVudHJ5OiBzdHJpbmcsXG4gICAqICAgICAgZXhpdDogc3RyaW5nLFxuICAgKiAgICAgIHNjb3JlOiBDTUlTY29yZSxcbiAgICogICAgICBzdHVkZW50X2lkOiBzdHJpbmcsXG4gICAqICAgICAgbGVzc29uX21vZGU6IHN0cmluZyxcbiAgICogICAgICBsZXNzb25fbG9jYXRpb246IHN0cmluZyxcbiAgICogICAgICBsZXNzb25fc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgY3JlZGl0OiBzdHJpbmcsXG4gICAqICAgICAgdG90YWxfdGltZTogc3RyaW5nLFxuICAgKiAgICAgIHNlc3Npb25fdGltZTogKlxuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnc3R1ZGVudF9pZCc6IHRoaXMuc3R1ZGVudF9pZCxcbiAgICAgICdzdHVkZW50X25hbWUnOiB0aGlzLnN0dWRlbnRfbmFtZSxcbiAgICAgICdsZXNzb25fbG9jYXRpb24nOiB0aGlzLmxlc3Nvbl9sb2NhdGlvbixcbiAgICAgICdjcmVkaXQnOiB0aGlzLmNyZWRpdCxcbiAgICAgICdsZXNzb25fc3RhdHVzJzogdGhpcy5sZXNzb25fc3RhdHVzLFxuICAgICAgJ2VudHJ5JzogdGhpcy5lbnRyeSxcbiAgICAgICd0b3RhbF90aW1lJzogdGhpcy50b3RhbF90aW1lLFxuICAgICAgJ2xlc3Nvbl9tb2RlJzogdGhpcy5sZXNzb25fbW9kZSxcbiAgICAgICdleGl0JzogdGhpcy5leGl0LFxuICAgICAgJ3Nlc3Npb25fdGltZSc6IHRoaXMuc2Vzc2lvbl90aW1lLFxuICAgICAgJ3Njb3JlJzogdGhpcy5zY29yZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkub2JqZWN0aXZlcyBvYmplY3RcbiAqL1xuY2xhc3MgQ01JT2JqZWN0aXZlcyBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkub2JqZWN0aXZlc1xuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe1xuICAgICAgY2hpbGRyZW46IGNvbnN0YW50cy5vYmplY3RpdmVzX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5zdHVkZW50X2RhdGEgb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlTdHVkZW50RGF0YSBleHRlbmRzIEJhc2VDTUkge1xuICAjX2NoaWxkcmVuO1xuICAjbWFzdGVyeV9zY29yZSA9ICcnO1xuICAjbWF4X3RpbWVfYWxsb3dlZCA9ICcnO1xuICAjdGltZV9saW1pdF9hY3Rpb24gPSAnJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5zdHVkZW50X2RhdGFcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0dWRlbnRfZGF0YV9jaGlsZHJlblxuICAgKi9cbiAgY29uc3RydWN0b3Ioc3R1ZGVudF9kYXRhX2NoaWxkcmVuKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuI19jaGlsZHJlbiA9IHN0dWRlbnRfZGF0YV9jaGlsZHJlbiA/XG4gICAgICAgIHN0dWRlbnRfZGF0YV9jaGlsZHJlbiA6XG4gICAgICAgIGNvbnN0YW50cy5zdHVkZW50X2RhdGFfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX2NoaWxkcmVuXG4gICAqIEByZXR1cm4geyp9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtzdHJpbmd9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvd0ludmFsaWRWYWx1ZUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbWFzdGVyX3Njb3JlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBtYXN0ZXJ5X3Njb3JlKCkge1xuICAgIHJldHVybiB0aGlzLiNtYXN0ZXJ5X3Njb3JlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI21hc3Rlcl9zY29yZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYXN0ZXJ5X3Njb3JlXG4gICAqL1xuICBzZXQgbWFzdGVyeV9zY29yZShtYXN0ZXJ5X3Njb3JlKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNtYXN0ZXJ5X3Njb3JlID0gbWFzdGVyeV9zY29yZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI21heF90aW1lX2FsbG93ZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IG1heF90aW1lX2FsbG93ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI21heF90aW1lX2FsbG93ZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbWF4X3RpbWVfYWxsb3dlZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtYXhfdGltZV9hbGxvd2VkXG4gICAqL1xuICBzZXQgbWF4X3RpbWVfYWxsb3dlZChtYXhfdGltZV9hbGxvd2VkKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNtYXhfdGltZV9hbGxvd2VkID0gbWF4X3RpbWVfYWxsb3dlZCA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWVfbGltaXRfYWN0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lX2xpbWl0X2FjdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jdGltZV9saW1pdF9hY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGltZV9saW1pdF9hY3Rpb24uIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZV9saW1pdF9hY3Rpb25cbiAgICovXG4gIHNldCB0aW1lX2xpbWl0X2FjdGlvbih0aW1lX2xpbWl0X2FjdGlvbikge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jdGltZV9saW1pdF9hY3Rpb24gPSB0aW1lX2xpbWl0X2FjdGlvbiA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLnN0dWRlbnRfZGF0YVxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIG1heF90aW1lX2FsbG93ZWQ6IHN0cmluZyxcbiAgICogICAgICB0aW1lX2xpbWl0X2FjdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIG1hc3Rlcnlfc2NvcmU6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnbWFzdGVyeV9zY29yZSc6IHRoaXMubWFzdGVyeV9zY29yZSxcbiAgICAgICdtYXhfdGltZV9hbGxvd2VkJzogdGhpcy5tYXhfdGltZV9hbGxvd2VkLFxuICAgICAgJ3RpbWVfbGltaXRfYWN0aW9uJzogdGhpcy50aW1lX2xpbWl0X2FjdGlvbixcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkuc3R1ZGVudF9wcmVmZXJlbmNlIG9iamVjdFxuICovXG5jbGFzcyBDTUlTdHVkZW50UHJlZmVyZW5jZSBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5zdHVkZW50X3ByZWZlcmVuY2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAjX2NoaWxkcmVuID0gY29uc3RhbnRzLnN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbjtcbiAgI2F1ZGlvID0gJyc7XG4gICNsYW5ndWFnZSA9ICcnO1xuICAjc3BlZWQgPSAnJztcbiAgI3RleHQgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX2NoaWxkcmVuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX2NoaWxkcmVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93SW52YWxpZFZhbHVlRXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNhdWRpb1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgYXVkaW8oKSB7XG4gICAgcmV0dXJuIHRoaXMuI2F1ZGlvO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2F1ZGlvXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdWRpb1xuICAgKi9cbiAgc2V0IGF1ZGlvKGF1ZGlvKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChhdWRpbywgcmVnZXguQ01JU0ludGVnZXIpICYmXG4gICAgICAgIGNoZWNrMTJWYWxpZFJhbmdlKGF1ZGlvLCByZWdleC5hdWRpb19yYW5nZSkpIHtcbiAgICAgIHRoaXMuI2F1ZGlvID0gYXVkaW87XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xhbmd1YWdlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsYW5ndWFnZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGFuZ3VhZ2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGFuZ3VhZ2VcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhbmd1YWdlXG4gICAqL1xuICBzZXQgbGFuZ3VhZ2UobGFuZ3VhZ2UpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGxhbmd1YWdlLCByZWdleC5DTUlTdHJpbmcyNTYpKSB7XG4gICAgICB0aGlzLiNsYW5ndWFnZSA9IGxhbmd1YWdlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzcGVlZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3BlZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3NwZWVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3NwZWVkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzcGVlZFxuICAgKi9cbiAgc2V0IHNwZWVkKHNwZWVkKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChzcGVlZCwgcmVnZXguQ01JU0ludGVnZXIpICYmXG4gICAgICAgIGNoZWNrMTJWYWxpZFJhbmdlKHNwZWVkLCByZWdleC5zcGVlZF9yYW5nZSkpIHtcbiAgICAgIHRoaXMuI3NwZWVkID0gc3BlZWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RleHRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RleHQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGV4dFxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dFxuICAgKi9cbiAgc2V0IHRleHQodGV4dCkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQodGV4dCwgcmVnZXguQ01JU0ludGVnZXIpICYmXG4gICAgICAgIGNoZWNrMTJWYWxpZFJhbmdlKHRleHQsIHJlZ2V4LnRleHRfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiN0ZXh0ID0gdGV4dDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuc3R1ZGVudF9wcmVmZXJlbmNlXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgYXVkaW86IHN0cmluZyxcbiAgICogICAgICBsYW5ndWFnZTogc3RyaW5nLFxuICAgKiAgICAgIHNwZWVkOiBzdHJpbmcsXG4gICAqICAgICAgdGV4dDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdhdWRpbyc6IHRoaXMuYXVkaW8sXG4gICAgICAnbGFuZ3VhZ2UnOiB0aGlzLmxhbmd1YWdlLFxuICAgICAgJ3NwZWVkJzogdGhpcy5zcGVlZCxcbiAgICAgICd0ZXh0JzogdGhpcy50ZXh0LFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDEuMidzIGNtaS5pbnRlcmFjdGlvbnMgb2JqZWN0XG4gKi9cbmNsYXNzIENNSUludGVyYWN0aW9ucyBleHRlbmRzIENNSUFycmF5IHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogY29uc3RhbnRzLmludGVyYWN0aW9uc19jaGlsZHJlbixcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkuaW50ZXJhY3Rpb25zLm4gb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlJbnRlcmFjdGlvbnNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4gb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5vYmplY3RpdmVzID0gbmV3IENNSUFycmF5KHtcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgIGNoaWxkcmVuOiBjb25zdGFudHMub2JqZWN0aXZlc19jaGlsZHJlbixcbiAgICB9KTtcbiAgICB0aGlzLmNvcnJlY3RfcmVzcG9uc2VzID0gbmV3IENNSUFycmF5KHtcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgIGNoaWxkcmVuOiBjb25zdGFudHMuY29ycmVjdF9yZXNwb25zZXNfY2hpbGRyZW4sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMub2JqZWN0aXZlcz8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuY29ycmVjdF9yZXNwb25zZXM/LmluaXRpYWxpemUoKTtcbiAgfVxuXG4gICNpZCA9ICcnO1xuICAjdGltZSA9ICcnO1xuICAjdHlwZSA9ICcnO1xuICAjd2VpZ2h0aW5nID0gJyc7XG4gICNzdHVkZW50X3Jlc3BvbnNlID0gJyc7XG4gICNyZXN1bHQgPSAnJztcbiAgI2xhdGVuY3kgPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaWQuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChpZCwgcmVnZXguQ01JSWRlbnRpZmllcikpIHtcbiAgICAgIHRoaXMuI2lkID0gaWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWUuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgdGltZSgpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lXG4gICAqL1xuICBzZXQgdGltZSh0aW1lKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh0aW1lLCByZWdleC5DTUlUaW1lKSkge1xuICAgICAgdGhpcy4jdGltZSA9IHRpbWU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3R5cGUuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jdHlwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0eXBlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gICAqL1xuICBzZXQgdHlwZSh0eXBlKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdCh0eXBlLCByZWdleC5DTUlUeXBlKSkge1xuICAgICAgdGhpcy4jdHlwZSA9IHR5cGU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3dlaWdodGluZy4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCB3ZWlnaHRpbmcoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/XG4gICAgICAgIHRocm93V3JpdGVPbmx5RXJyb3IoKSA6XG4gICAgICAgIHRoaXMuI3dlaWdodGluZztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN3ZWlnaHRpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IHdlaWdodGluZ1xuICAgKi9cbiAgc2V0IHdlaWdodGluZyh3ZWlnaHRpbmcpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHdlaWdodGluZywgcmVnZXguQ01JRGVjaW1hbCkgJiZcbiAgICAgICAgY2hlY2sxMlZhbGlkUmFuZ2Uod2VpZ2h0aW5nLCByZWdleC53ZWlnaHRpbmdfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiN3ZWlnaHRpbmcgPSB3ZWlnaHRpbmc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N0dWRlbnRfcmVzcG9uc2UuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgc3R1ZGVudF9yZXNwb25zZSgpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jc3R1ZGVudF9yZXNwb25zZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdHVkZW50X3Jlc3BvbnNlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdHVkZW50X3Jlc3BvbnNlXG4gICAqL1xuICBzZXQgc3R1ZGVudF9yZXNwb25zZShzdHVkZW50X3Jlc3BvbnNlKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChzdHVkZW50X3Jlc3BvbnNlLCByZWdleC5DTUlGZWVkYmFjaykpIHtcbiAgICAgIHRoaXMuI3N0dWRlbnRfcmVzcG9uc2UgPSBzdHVkZW50X3Jlc3BvbnNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNyZXN1bHQuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4geyp9XG4gICAqL1xuICBnZXQgcmVzdWx0KCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNyZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcmVzdWx0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZXN1bHRcbiAgICovXG4gIHNldCByZXN1bHQocmVzdWx0KSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChyZXN1bHQsIHJlZ2V4LkNNSVJlc3VsdCkpIHtcbiAgICAgIHRoaXMuI3Jlc3VsdCA9IHJlc3VsdDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGF0ZW5jeS4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7Kn1cbiAgICovXG4gIGdldCBsYXRlbmN5KCkge1xuICAgIHJldHVybiAoIXRoaXMuanNvblN0cmluZykgPyB0aHJvd1dyaXRlT25seUVycm9yKCkgOiB0aGlzLiNsYXRlbmN5O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2xhdGVuY3lcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxhdGVuY3lcbiAgICovXG4gIHNldCBsYXRlbmN5KGxhdGVuY3kpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KGxhdGVuY3ksIHJlZ2V4LkNNSVRpbWVzcGFuKSkge1xuICAgICAgdGhpcy4jbGF0ZW5jeSA9IGxhdGVuY3k7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmludGVyYWN0aW9ucy5uXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgaWQ6IHN0cmluZyxcbiAgICogICAgICB0aW1lOiBzdHJpbmcsXG4gICAqICAgICAgdHlwZTogc3RyaW5nLFxuICAgKiAgICAgIHdlaWdodGluZzogc3RyaW5nLFxuICAgKiAgICAgIHN0dWRlbnRfcmVzcG9uc2U6IHN0cmluZyxcbiAgICogICAgICByZXN1bHQ6IHN0cmluZyxcbiAgICogICAgICBsYXRlbmN5OiBzdHJpbmcsXG4gICAqICAgICAgb2JqZWN0aXZlczogQ01JQXJyYXksXG4gICAqICAgICAgY29ycmVjdF9yZXNwb25zZXM6IENNSUFycmF5XG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdpZCc6IHRoaXMuaWQsXG4gICAgICAndGltZSc6IHRoaXMudGltZSxcbiAgICAgICd0eXBlJzogdGhpcy50eXBlLFxuICAgICAgJ3dlaWdodGluZyc6IHRoaXMud2VpZ2h0aW5nLFxuICAgICAgJ3N0dWRlbnRfcmVzcG9uc2UnOiB0aGlzLnN0dWRlbnRfcmVzcG9uc2UsXG4gICAgICAncmVzdWx0JzogdGhpcy5yZXN1bHQsXG4gICAgICAnbGF0ZW5jeSc6IHRoaXMubGF0ZW5jeSxcbiAgICAgICdvYmplY3RpdmVzJzogdGhpcy5vYmplY3RpdmVzLFxuICAgICAgJ2NvcnJlY3RfcmVzcG9uc2VzJzogdGhpcy5jb3JyZWN0X3Jlc3BvbnNlcyxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkub2JqZWN0aXZlcy5uIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JT2JqZWN0aXZlc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5vYmplY3RpdmVzLm5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnNjb3JlID0gbmV3IENNSVNjb3JlKFxuICAgICAgICB7XG4gICAgICAgICAgc2NvcmVfY2hpbGRyZW46IGNvbnN0YW50cy5zY29yZV9jaGlsZHJlbixcbiAgICAgICAgICBzY29yZV9yYW5nZTogcmVnZXguc2NvcmVfcmFuZ2UsXG4gICAgICAgICAgaW52YWxpZEVycm9yQ29kZTogc2Nvcm0xMl9lcnJvcl9jb2Rlcy5JTlZBTElEX1NFVF9WQUxVRSxcbiAgICAgICAgICBpbnZhbGlkVHlwZUNvZGU6IHNjb3JtMTJfZXJyb3JfY29kZXMuVFlQRV9NSVNNQVRDSCxcbiAgICAgICAgICBpbnZhbGlkUmFuZ2VDb2RlOiBzY29ybTEyX2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRSxcbiAgICAgICAgfSk7XG4gIH1cblxuICAjaWQgPSAnJztcbiAgI3N0YXR1cyA9ICcnO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNpZFxuICAgKiBAcmV0dXJuIHtcIlwifVxuICAgKi9cbiAgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLiNpZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNpZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICovXG4gIHNldCBpZChpZCkge1xuICAgIGlmIChjaGVjazEyVmFsaWRGb3JtYXQoaWQsIHJlZ2V4LkNNSUlkZW50aWZpZXIpKSB7XG4gICAgICB0aGlzLiNpZCA9IGlkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdGF0dXNcbiAgICogQHJldHVybiB7XCJcIn1cbiAgICovXG4gIGdldCBzdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdGF0dXNcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0YXR1c1xuICAgKi9cbiAgc2V0IHN0YXR1cyhzdGF0dXMpIHtcbiAgICBpZiAoY2hlY2sxMlZhbGlkRm9ybWF0KHN0YXR1cywgcmVnZXguQ01JU3RhdHVzMikpIHtcbiAgICAgIHRoaXMuI3N0YXR1cyA9IHN0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkub2JqZWN0aXZlcy5uXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgaWQ6IHN0cmluZyxcbiAgICogICAgICBzdGF0dXM6IHN0cmluZyxcbiAgICogICAgICBzY29yZTogQ01JU2NvcmVcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICAgICdzdGF0dXMnOiB0aGlzLnN0YXR1cyxcbiAgICAgICdzY29yZSc6IHRoaXMuc2NvcmUsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMS4yJ3MgY21pLmludGVyYWN0aW9ucy5uLm9iamVjdGl2ZXMubiBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc09iamVjdGl2ZXNPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4ub2JqZWN0aXZlcy5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgI2lkID0gJyc7XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2lkXG4gICAqIEByZXR1cm4ge1wiXCJ9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChpZCwgcmVnZXguQ01JSWRlbnRpZmllcikpIHtcbiAgICAgIHRoaXMuI2lkID0gaWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmludGVyYWN0aW9ucy5uLm9iamVjdGl2ZXMublxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGlkOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAxLjIncyBjbWkuaW50ZXJhY3Rpb25zLmNvcnJlY3RfcmVzcG9uc2VzLm4gb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlJbnRlcmFjdGlvbnNDb3JyZWN0UmVzcG9uc2VzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmludGVyYWN0aW9ucy5jb3JyZWN0X3Jlc3BvbnNlcy5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgI3BhdHRlcm4gPSAnJztcblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjcGF0dGVyblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgcGF0dGVybigpIHtcbiAgICByZXR1cm4gKCF0aGlzLmpzb25TdHJpbmcpID8gdGhyb3dXcml0ZU9ubHlFcnJvcigpIDogdGhpcy4jcGF0dGVybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNwYXR0ZXJuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXR0ZXJuXG4gICAqL1xuICBzZXQgcGF0dGVybihwYXR0ZXJuKSB7XG4gICAgaWYgKGNoZWNrMTJWYWxpZEZvcm1hdChwYXR0ZXJuLCByZWdleC5DTUlGZWVkYmFjaykpIHtcbiAgICAgIHRoaXMuI3BhdHRlcm4gPSBwYXR0ZXJuO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5pbnRlcmFjdGlvbnMuY29ycmVjdF9yZXNwb25zZXMublxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHBhdHRlcm46IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAncGF0dGVybic6IHRoaXMucGF0dGVybixcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIiwiLy8gQGZsb3dcbmltcG9ydCB7XG4gIEJhc2VDTUksXG4gIGNoZWNrVmFsaWRGb3JtYXQsXG4gIGNoZWNrVmFsaWRSYW5nZSxcbiAgQ01JQXJyYXksXG4gIENNSVNjb3JlLFxufSBmcm9tICcuL2NvbW1vbic7XG5pbXBvcnQge3Njb3JtMjAwNF9jb25zdGFudHN9IGZyb20gJy4uL2NvbnN0YW50cy9hcGlfY29uc3RhbnRzJztcbmltcG9ydCB7c2Nvcm0yMDA0X3JlZ2V4fSBmcm9tICcuLi9jb25zdGFudHMvcmVnZXgnO1xuaW1wb3J0IHtzY29ybTIwMDRfZXJyb3JfY29kZXN9IGZyb20gJy4uL2NvbnN0YW50cy9lcnJvcl9jb2Rlcyc7XG5pbXBvcnQge2xlYXJuZXJfcmVzcG9uc2VzfSBmcm9tICcuLi9jb25zdGFudHMvcmVzcG9uc2VfY29uc3RhbnRzJztcbmltcG9ydCB7VmFsaWRhdGlvbkVycm9yfSBmcm9tICcuLi9leGNlcHRpb25zJztcblxuY29uc3QgY29uc3RhbnRzID0gc2Nvcm0yMDA0X2NvbnN0YW50cztcbmNvbnN0IHJlZ2V4ID0gc2Nvcm0yMDA0X3JlZ2V4O1xuXG4vKipcbiAqIEhlbHBlciBtZXRob2QgZm9yIHRocm93aW5nIFJlYWQgT25seSBlcnJvclxuICovXG5mdW5jdGlvbiB0aHJvd1JlYWRPbmx5RXJyb3IoKSB7XG4gIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5UKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kIGZvciB0aHJvd2luZyBXcml0ZSBPbmx5IGVycm9yXG4gKi9cbmZ1bmN0aW9uIHRocm93V3JpdGVPbmx5RXJyb3IoKSB7XG4gIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLldSSVRFX09OTFlfRUxFTUVOVCk7XG59XG5cbi8qKlxuICogSGVscGVyIG1ldGhvZCBmb3IgdGhyb3dpbmcgVHlwZSBNaXNtYXRjaCBlcnJvclxuICovXG5mdW5jdGlvbiB0aHJvd1R5cGVNaXNtYXRjaEVycm9yKCkge1xuICB0aHJvdyBuZXcgVmFsaWRhdGlvbkVycm9yKHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5UWVBFX01JU01BVENIKTtcbn1cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kLCBubyByZWFzb24gdG8gaGF2ZSB0byBwYXNzIHRoZSBzYW1lIGVycm9yIGNvZGVzIGV2ZXJ5IHRpbWVcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7c3RyaW5nfSByZWdleFBhdHRlcm5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYWxsb3dFbXB0eVN0cmluZ1xuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gY2hlY2syMDA0VmFsaWRGb3JtYXQoXG4gICAgdmFsdWU6IFN0cmluZyxcbiAgICByZWdleFBhdHRlcm46IFN0cmluZyxcbiAgICBhbGxvd0VtcHR5U3RyaW5nPzogYm9vbGVhbikge1xuICByZXR1cm4gY2hlY2tWYWxpZEZvcm1hdCh2YWx1ZSwgcmVnZXhQYXR0ZXJuLFxuICAgICAgc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gsIGFsbG93RW1wdHlTdHJpbmcpO1xufVxuXG4vKipcbiAqIEhlbHBlciBtZXRob2QsIG5vIHJlYXNvbiB0byBoYXZlIHRvIHBhc3MgdGhlIHNhbWUgZXJyb3IgY29kZXMgZXZlcnkgdGltZVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtzdHJpbmd9IHJhbmdlUGF0dGVyblxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuZnVuY3Rpb24gY2hlY2syMDA0VmFsaWRSYW5nZSh2YWx1ZTogYW55LCByYW5nZVBhdHRlcm46IFN0cmluZykge1xuICByZXR1cm4gY2hlY2tWYWxpZFJhbmdlKHZhbHVlLCByYW5nZVBhdHRlcm4sXG4gICAgICBzY29ybTIwMDRfZXJyb3JfY29kZXMuVkFMVUVfT1VUX09GX1JBTkdFKTtcbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgY21pIG9iamVjdCBmb3IgU0NPUk0gMjAwNFxuICovXG5leHBvcnQgY2xhc3MgQ01JIGV4dGVuZHMgQmFzZUNNSSB7XG4gICNfdmVyc2lvbiA9ICcxLjAnO1xuICAjX2NoaWxkcmVuID0gY29uc3RhbnRzLmNtaV9jaGlsZHJlbjtcbiAgI2NvbXBsZXRpb25fc3RhdHVzID0gJ3Vua25vd24nO1xuICAjY29tcGxldGlvbl90aHJlc2hvbGQgPSAnJztcbiAgI2NyZWRpdCA9ICdjcmVkaXQnO1xuICAjZW50cnkgPSAnJztcbiAgI2V4aXQgPSAnJztcbiAgI2xhdW5jaF9kYXRhID0gJyc7XG4gICNsZWFybmVyX2lkID0gJyc7XG4gICNsZWFybmVyX25hbWUgPSAnJztcbiAgI2xvY2F0aW9uID0gJyc7XG4gICNtYXhfdGltZV9hbGxvd2VkID0gJyc7XG4gICNtb2RlID0gJ25vcm1hbCc7XG4gICNwcm9ncmVzc19tZWFzdXJlID0gJyc7XG4gICNzY2FsZWRfcGFzc2luZ19zY29yZSA9ICcnO1xuICAjc2Vzc2lvbl90aW1lID0gJ1BUMEgwTTBTJztcbiAgI3N1Y2Nlc3Nfc3RhdHVzID0gJ3Vua25vd24nO1xuICAjc3VzcGVuZF9kYXRhID0gJyc7XG4gICN0aW1lX2xpbWl0X2FjdGlvbiA9ICdjb250aW51ZSxubyBtZXNzYWdlJztcbiAgI3RvdGFsX3RpbWUgPSAnMCc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciB0aGUgU0NPUk0gMjAwNCBjbWkgb2JqZWN0XG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5pdGlhbGl6ZWRcbiAgICovXG4gIGNvbnN0cnVjdG9yKGluaXRpYWxpemVkOiBib29sZWFuKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGlmIChpbml0aWFsaXplZCkgdGhpcy5pbml0aWFsaXplKCk7XG5cbiAgICB0aGlzLmxlYXJuZXJfcHJlZmVyZW5jZSA9IG5ldyBDTUlMZWFybmVyUHJlZmVyZW5jZSgpO1xuICAgIHRoaXMuc2NvcmUgPSBuZXcgU2Nvcm0yMDA0Q01JU2NvcmUoKTtcbiAgICB0aGlzLmNvbW1lbnRzX2Zyb21fbGVhcm5lciA9IG5ldyBDTUlDb21tZW50c0Zyb21MZWFybmVyKCk7XG4gICAgdGhpcy5jb21tZW50c19mcm9tX2xtcyA9IG5ldyBDTUlDb21tZW50c0Zyb21MTVMoKTtcbiAgICB0aGlzLmludGVyYWN0aW9ucyA9IG5ldyBDTUlJbnRlcmFjdGlvbnMoKTtcbiAgICB0aGlzLm9iamVjdGl2ZXMgPSBuZXcgQ01JT2JqZWN0aXZlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmxlYXJuZXJfcHJlZmVyZW5jZT8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuc2NvcmU/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmNvbW1lbnRzX2Zyb21fbGVhcm5lcj8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMuY29tbWVudHNfZnJvbV9sbXM/LmluaXRpYWxpemUoKTtcbiAgICB0aGlzLmludGVyYWN0aW9ucz8uaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMub2JqZWN0aXZlcz8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI192ZXJzaW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfdmVyc2lvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jX3ZlcnNpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX3ZlcnNpb24uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX3ZlcnNpb25cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNldCBfdmVyc2lvbihfdmVyc2lvbikge1xuICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI19jaGlsZHJlblxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXQgX2NoaWxkcmVuKCkge1xuICAgIHJldHVybiB0aGlzLiNfY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjX2NoaWxkcmVuLiBKdXN0IHRocm93cyBhbiBlcnJvci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IF9jaGlsZHJlblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2V0IF9jaGlsZHJlbihfY2hpbGRyZW4pIHtcbiAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb21wbGV0aW9uX3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29tcGxldGlvbl9zdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NvbXBsZXRpb25fc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbXBsZXRpb25fc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21wbGV0aW9uX3N0YXR1c1xuICAgKi9cbiAgc2V0IGNvbXBsZXRpb25fc3RhdHVzKGNvbXBsZXRpb25fc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGNvbXBsZXRpb25fc3RhdHVzLCByZWdleC5DTUlDU3RhdHVzKSkge1xuICAgICAgdGhpcy4jY29tcGxldGlvbl9zdGF0dXMgPSBjb21wbGV0aW9uX3N0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29tcGxldGlvbl90aHJlc2hvbGRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbXBsZXRpb25fdGhyZXNob2xkKCkge1xuICAgIHJldHVybiB0aGlzLiNjb21wbGV0aW9uX3RocmVzaG9sZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb21wbGV0aW9uX3RocmVzaG9sZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBjb21wbGV0aW9uX3RocmVzaG9sZFxuICAgKi9cbiAgc2V0IGNvbXBsZXRpb25fdGhyZXNob2xkKGNvbXBsZXRpb25fdGhyZXNob2xkKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgP1xuICAgICAgICB0aGlzLiNjb21wbGV0aW9uX3RocmVzaG9sZCA9IGNvbXBsZXRpb25fdGhyZXNob2xkIDpcbiAgICAgICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY3JlZGl0XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjcmVkaXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2NyZWRpdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjcmVkaXQuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gY3JlZGl0XG4gICAqL1xuICBzZXQgY3JlZGl0KGNyZWRpdCkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jY3JlZGl0ID0gY3JlZGl0IDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZW50cnlcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGVudHJ5KCkge1xuICAgIHJldHVybiB0aGlzLiNlbnRyeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNlbnRyeS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBlbnRyeVxuICAgKi9cbiAgc2V0IGVudHJ5KGVudHJ5KSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNlbnRyeSA9IGVudHJ5IDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZXhpdC4gU2hvdWxkIG9ubHkgYmUgY2FsbGVkIGR1cmluZyBKU09OIGV4cG9ydC5cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGV4aXQoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI2V4aXQ7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjZXhpdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gZXhpdFxuICAgKi9cbiAgc2V0IGV4aXQoZXhpdCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChleGl0LCByZWdleC5DTUlFeGl0KSkge1xuICAgICAgdGhpcy4jZXhpdCA9IGV4aXQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xhdW5jaF9kYXRhXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsYXVuY2hfZGF0YSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGF1bmNoX2RhdGE7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGF1bmNoX2RhdGEuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGF1bmNoX2RhdGFcbiAgICovXG4gIHNldCBsYXVuY2hfZGF0YShsYXVuY2hfZGF0YSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jbGF1bmNoX2RhdGEgPSBsYXVuY2hfZGF0YSA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xlYXJuZXJfaWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlYXJuZXJfaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xlYXJuZXJfaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGVhcm5lcl9pZC4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsZWFybmVyX2lkXG4gICAqL1xuICBzZXQgbGVhcm5lcl9pZChsZWFybmVyX2lkKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiNsZWFybmVyX2lkID0gbGVhcm5lcl9pZCA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xlYXJuZXJfbmFtZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGVhcm5lcl9uYW1lKCkge1xuICAgIHJldHVybiB0aGlzLiNsZWFybmVyX25hbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGVhcm5lcl9uYW1lLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlYXJuZXJfbmFtZVxuICAgKi9cbiAgc2V0IGxlYXJuZXJfbmFtZShsZWFybmVyX25hbWUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI2xlYXJuZXJfbmFtZSA9IGxlYXJuZXJfbmFtZSA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xvY2F0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBsb2NhdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jbG9jYXRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbG9jYXRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGxvY2F0aW9uXG4gICAqL1xuICBzZXQgbG9jYXRpb24obG9jYXRpb24pIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQobG9jYXRpb24sIHJlZ2V4LkNNSVN0cmluZzEwMDApKSB7XG4gICAgICB0aGlzLiNsb2NhdGlvbiA9IGxvY2F0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNtYXhfdGltZV9hbGxvd2VkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBtYXhfdGltZV9hbGxvd2VkKCkge1xuICAgIHJldHVybiB0aGlzLiNtYXhfdGltZV9hbGxvd2VkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI21heF90aW1lX2FsbG93ZWQuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWF4X3RpbWVfYWxsb3dlZFxuICAgKi9cbiAgc2V0IG1heF90aW1lX2FsbG93ZWQobWF4X3RpbWVfYWxsb3dlZCkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jbWF4X3RpbWVfYWxsb3dlZCA9IG1heF90aW1lX2FsbG93ZWQgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNtb2RlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBtb2RlKCkge1xuICAgIHJldHVybiB0aGlzLiNtb2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI21vZGUuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbW9kZVxuICAgKi9cbiAgc2V0IG1vZGUobW9kZSkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gdGhpcy4jbW9kZSA9IG1vZGUgOiB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNwcm9ncmVzc19tZWFzdXJlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBwcm9ncmVzc19tZWFzdXJlKCkge1xuICAgIHJldHVybiB0aGlzLiNwcm9ncmVzc19tZWFzdXJlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3Byb2dyZXNzX21lYXN1cmVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHByb2dyZXNzX21lYXN1cmVcbiAgICovXG4gIHNldCBwcm9ncmVzc19tZWFzdXJlKHByb2dyZXNzX21lYXN1cmUpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQocHJvZ3Jlc3NfbWVhc3VyZSwgcmVnZXguQ01JRGVjaW1hbCkgJiZcbiAgICAgICAgY2hlY2syMDA0VmFsaWRSYW5nZShwcm9ncmVzc19tZWFzdXJlLCByZWdleC5wcm9ncmVzc19yYW5nZSkpIHtcbiAgICAgIHRoaXMuI3Byb2dyZXNzX21lYXN1cmUgPSBwcm9ncmVzc19tZWFzdXJlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzY2FsZWRfcGFzc2luZ19zY29yZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc2NhbGVkX3Bhc3Npbmdfc2NvcmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3NjYWxlZF9wYXNzaW5nX3Njb3JlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3NjYWxlZF9wYXNzaW5nX3Njb3JlLiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHNjYWxlZF9wYXNzaW5nX3Njb3JlXG4gICAqL1xuICBzZXQgc2NhbGVkX3Bhc3Npbmdfc2NvcmUoc2NhbGVkX3Bhc3Npbmdfc2NvcmUpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/XG4gICAgICAgIHRoaXMuI3NjYWxlZF9wYXNzaW5nX3Njb3JlID0gc2NhbGVkX3Bhc3Npbmdfc2NvcmUgOlxuICAgICAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzZXNzaW9uX3RpbWUuIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBkdXJpbmcgSlNPTiBleHBvcnQuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBzZXNzaW9uX3RpbWUoKSB7XG4gICAgcmV0dXJuICghdGhpcy5qc29uU3RyaW5nKSA/IHRocm93V3JpdGVPbmx5RXJyb3IoKSA6IHRoaXMuI3Nlc3Npb25fdGltZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzZXNzaW9uX3RpbWVcbiAgICogQHBhcmFtIHtzdHJpbmd9IHNlc3Npb25fdGltZVxuICAgKi9cbiAgc2V0IHNlc3Npb25fdGltZShzZXNzaW9uX3RpbWUpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoc2Vzc2lvbl90aW1lLCByZWdleC5DTUlUaW1lc3BhbikpIHtcbiAgICAgIHRoaXMuI3Nlc3Npb25fdGltZSA9IHNlc3Npb25fdGltZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjc3VjY2Vzc19zdGF0dXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHN1Y2Nlc3Nfc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNzdWNjZXNzX3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNzdWNjZXNzX3N0YXR1c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gc3VjY2Vzc19zdGF0dXNcbiAgICovXG4gIHNldCBzdWNjZXNzX3N0YXR1cyhzdWNjZXNzX3N0YXR1cykge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChzdWNjZXNzX3N0YXR1cywgcmVnZXguQ01JU1N0YXR1cykpIHtcbiAgICAgIHRoaXMuI3N1Y2Nlc3Nfc3RhdHVzID0gc3VjY2Vzc19zdGF0dXM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3N1c3BlbmRfZGF0YVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3VzcGVuZF9kYXRhKCkge1xuICAgIHJldHVybiB0aGlzLiNzdXNwZW5kX2RhdGE7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjc3VzcGVuZF9kYXRhXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdXNwZW5kX2RhdGFcbiAgICovXG4gIHNldCBzdXNwZW5kX2RhdGEoc3VzcGVuZF9kYXRhKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHN1c3BlbmRfZGF0YSwgcmVnZXguQ01JU3RyaW5nNjQwMDApKSB7XG4gICAgICB0aGlzLiNzdXNwZW5kX2RhdGEgPSBzdXNwZW5kX2RhdGE7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RpbWVfbGltaXRfYWN0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lX2xpbWl0X2FjdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jdGltZV9saW1pdF9hY3Rpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdGltZV9saW1pdF9hY3Rpb24uIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZV9saW1pdF9hY3Rpb25cbiAgICovXG4gIHNldCB0aW1lX2xpbWl0X2FjdGlvbih0aW1lX2xpbWl0X2FjdGlvbikge1xuICAgICF0aGlzLmluaXRpYWxpemVkID9cbiAgICAgICAgdGhpcy4jdGltZV9saW1pdF9hY3Rpb24gPSB0aW1lX2xpbWl0X2FjdGlvbiA6XG4gICAgICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3RvdGFsX3RpbWVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHRvdGFsX3RpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RvdGFsX3RpbWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjdG90YWxfdGltZS4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3RhbF90aW1lXG4gICAqL1xuICBzZXQgdG90YWxfdGltZSh0b3RhbF90aW1lKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyB0aGlzLiN0b3RhbF90aW1lID0gdG90YWxfdGltZSA6IHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgY29tbWVudHNfZnJvbV9sZWFybmVyOiBDTUlDb21tZW50c0Zyb21MZWFybmVyLFxuICAgKiAgICAgIGNvbW1lbnRzX2Zyb21fbG1zOiBDTUlDb21tZW50c0Zyb21MTVMsXG4gICAqICAgICAgY29tcGxldGlvbl9zdGF0dXM6IHN0cmluZyxcbiAgICogICAgICBjb21wbGV0aW9uX3RocmVzaG9sZDogc3RyaW5nLFxuICAgKiAgICAgIGNyZWRpdDogc3RyaW5nLFxuICAgKiAgICAgIGVudHJ5OiBzdHJpbmcsXG4gICAqICAgICAgZXhpdDogc3RyaW5nLFxuICAgKiAgICAgIGludGVyYWN0aW9uczogQ01JSW50ZXJhY3Rpb25zLFxuICAgKiAgICAgIGxhdW5jaF9kYXRhOiBzdHJpbmcsXG4gICAqICAgICAgbGVhcm5lcl9pZDogc3RyaW5nLFxuICAgKiAgICAgIGxlYXJuZXJfbmFtZTogc3RyaW5nLFxuICAgKiAgICAgIGxlYXJuZXJfcHJlZmVyZW5jZTogQ01JTGVhcm5lclByZWZlcmVuY2UsXG4gICAqICAgICAgbG9jYXRpb246IHN0cmluZyxcbiAgICogICAgICBtYXhfdGltZV9hbGxvd2VkOiBzdHJpbmcsXG4gICAqICAgICAgbW9kZTogc3RyaW5nLFxuICAgKiAgICAgIG9iamVjdGl2ZXM6IENNSU9iamVjdGl2ZXMsXG4gICAqICAgICAgcHJvZ3Jlc3NfbWVhc3VyZTogc3RyaW5nLFxuICAgKiAgICAgIHNjYWxlZF9wYXNzaW5nX3Njb3JlOiBzdHJpbmcsXG4gICAqICAgICAgc2NvcmU6IFNjb3JtMjAwNENNSVNjb3JlLFxuICAgKiAgICAgIHNlc3Npb25fdGltZTogc3RyaW5nLFxuICAgKiAgICAgIHN1Y2Nlc3Nfc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgc3VzcGVuZF9kYXRhOiBzdHJpbmcsXG4gICAqICAgICAgdGltZV9saW1pdF9hY3Rpb246IHN0cmluZyxcbiAgICogICAgICB0b3RhbF90aW1lOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2NvbW1lbnRzX2Zyb21fbGVhcm5lcic6IHRoaXMuY29tbWVudHNfZnJvbV9sZWFybmVyLFxuICAgICAgJ2NvbW1lbnRzX2Zyb21fbG1zJzogdGhpcy5jb21tZW50c19mcm9tX2xtcyxcbiAgICAgICdjb21wbGV0aW9uX3N0YXR1cyc6IHRoaXMuY29tcGxldGlvbl9zdGF0dXMsXG4gICAgICAnY29tcGxldGlvbl90aHJlc2hvbGQnOiB0aGlzLmNvbXBsZXRpb25fdGhyZXNob2xkLFxuICAgICAgJ2NyZWRpdCc6IHRoaXMuY3JlZGl0LFxuICAgICAgJ2VudHJ5JzogdGhpcy5lbnRyeSxcbiAgICAgICdleGl0JzogdGhpcy5leGl0LFxuICAgICAgJ2ludGVyYWN0aW9ucyc6IHRoaXMuaW50ZXJhY3Rpb25zLFxuICAgICAgJ2xhdW5jaF9kYXRhJzogdGhpcy5sYXVuY2hfZGF0YSxcbiAgICAgICdsZWFybmVyX2lkJzogdGhpcy5sZWFybmVyX2lkLFxuICAgICAgJ2xlYXJuZXJfbmFtZSc6IHRoaXMubGVhcm5lcl9uYW1lLFxuICAgICAgJ2xlYXJuZXJfcHJlZmVyZW5jZSc6IHRoaXMubGVhcm5lcl9wcmVmZXJlbmNlLFxuICAgICAgJ2xvY2F0aW9uJzogdGhpcy5sb2NhdGlvbixcbiAgICAgICdtYXhfdGltZV9hbGxvd2VkJzogdGhpcy5tYXhfdGltZV9hbGxvd2VkLFxuICAgICAgJ21vZGUnOiB0aGlzLm1vZGUsXG4gICAgICAnb2JqZWN0aXZlcyc6IHRoaXMub2JqZWN0aXZlcyxcbiAgICAgICdwcm9ncmVzc19tZWFzdXJlJzogdGhpcy5wcm9ncmVzc19tZWFzdXJlLFxuICAgICAgJ3NjYWxlZF9wYXNzaW5nX3Njb3JlJzogdGhpcy5zY2FsZWRfcGFzc2luZ19zY29yZSxcbiAgICAgICdzY29yZSc6IHRoaXMuc2NvcmUsXG4gICAgICAnc2Vzc2lvbl90aW1lJzogdGhpcy5zZXNzaW9uX3RpbWUsXG4gICAgICAnc3VjY2Vzc19zdGF0dXMnOiB0aGlzLnN1Y2Nlc3Nfc3RhdHVzLFxuICAgICAgJ3N1c3BlbmRfZGF0YSc6IHRoaXMuc3VzcGVuZF9kYXRhLFxuICAgICAgJ3RpbWVfbGltaXRfYWN0aW9uJzogdGhpcy50aW1lX2xpbWl0X2FjdGlvbixcbiAgICAgICd0b3RhbF90aW1lJzogdGhpcy50b3RhbF90aW1lLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIFNDT1JNIDIwMDQncyBjbWkubGVhcm5lcl9wcmVmZXJlbmNlIG9iamVjdFxuICovXG5jbGFzcyBDTUlMZWFybmVyUHJlZmVyZW5jZSBleHRlbmRzIEJhc2VDTUkge1xuICAjX2NoaWxkcmVuID0gY29uc3RhbnRzLnN0dWRlbnRfcHJlZmVyZW5jZV9jaGlsZHJlbjtcbiAgI2F1ZGlvX2xldmVsID0gJzEnO1xuICAjbGFuZ3VhZ2UgPSAnJztcbiAgI2RlbGl2ZXJ5X3NwZWVkID0gJzEnO1xuICAjYXVkaW9fY2FwdGlvbmluZyA9ICcwJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5sZWFybmVyX3ByZWZlcmVuY2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjX2NoaWxkcmVuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGdldCBfY2hpbGRyZW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuI19jaGlsZHJlbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNfY2hpbGRyZW4uIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gX2NoaWxkcmVuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzZXQgX2NoaWxkcmVuKF9jaGlsZHJlbikge1xuICAgIHRocm93UmVhZE9ubHlFcnJvcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2F1ZGlvX2xldmVsXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBhdWRpb19sZXZlbCgpIHtcbiAgICByZXR1cm4gdGhpcy4jYXVkaW9fbGV2ZWw7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjYXVkaW9fbGV2ZWxcbiAgICogQHBhcmFtIHtzdHJpbmd9IGF1ZGlvX2xldmVsXG4gICAqL1xuICBzZXQgYXVkaW9fbGV2ZWwoYXVkaW9fbGV2ZWwpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoYXVkaW9fbGV2ZWwsIHJlZ2V4LkNNSURlY2ltYWwpICYmXG4gICAgICAgIGNoZWNrMjAwNFZhbGlkUmFuZ2UoYXVkaW9fbGV2ZWwsIHJlZ2V4LmF1ZGlvX3JhbmdlKSkge1xuICAgICAgdGhpcy4jYXVkaW9fbGV2ZWwgPSBhdWRpb19sZXZlbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGFuZ3VhZ2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxhbmd1YWdlKCkge1xuICAgIHJldHVybiB0aGlzLiNsYW5ndWFnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsYW5ndWFnZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gbGFuZ3VhZ2VcbiAgICovXG4gIHNldCBsYW5ndWFnZShsYW5ndWFnZSkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChsYW5ndWFnZSwgcmVnZXguQ01JTGFuZykpIHtcbiAgICAgIHRoaXMuI2xhbmd1YWdlID0gbGFuZ3VhZ2U7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2RlbGl2ZXJ5X3NwZWVkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBkZWxpdmVyeV9zcGVlZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jZGVsaXZlcnlfc3BlZWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZGVsaXZlcnlfc3BlZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlbGl2ZXJ5X3NwZWVkXG4gICAqL1xuICBzZXQgZGVsaXZlcnlfc3BlZWQoZGVsaXZlcnlfc3BlZWQpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoZGVsaXZlcnlfc3BlZWQsIHJlZ2V4LkNNSURlY2ltYWwpICYmXG4gICAgICAgIGNoZWNrMjAwNFZhbGlkUmFuZ2UoZGVsaXZlcnlfc3BlZWQsIHJlZ2V4LnNwZWVkX3JhbmdlKSkge1xuICAgICAgdGhpcy4jZGVsaXZlcnlfc3BlZWQgPSBkZWxpdmVyeV9zcGVlZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjYXVkaW9fY2FwdGlvbmluZ1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgYXVkaW9fY2FwdGlvbmluZygpIHtcbiAgICByZXR1cm4gdGhpcy4jYXVkaW9fY2FwdGlvbmluZztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNhdWRpb19jYXB0aW9uaW5nXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBhdWRpb19jYXB0aW9uaW5nXG4gICAqL1xuICBzZXQgYXVkaW9fY2FwdGlvbmluZyhhdWRpb19jYXB0aW9uaW5nKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGF1ZGlvX2NhcHRpb25pbmcsIHJlZ2V4LkNNSVNJbnRlZ2VyKSAmJlxuICAgICAgICBjaGVjazIwMDRWYWxpZFJhbmdlKGF1ZGlvX2NhcHRpb25pbmcsIHJlZ2V4LnRleHRfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiNhdWRpb19jYXB0aW9uaW5nID0gYXVkaW9fY2FwdGlvbmluZztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkubGVhcm5lcl9wcmVmZXJlbmNlXG4gICAqXG4gICAqIEByZXR1cm4ge1xuICAgKiAgICB7XG4gICAqICAgICAgYXVkaW9fbGV2ZWw6IHN0cmluZyxcbiAgICogICAgICBsYW5ndWFnZTogc3RyaW5nLFxuICAgKiAgICAgIGRlbGl2ZXJ5X3NwZWVkOiBzdHJpbmcsXG4gICAqICAgICAgYXVkaW9fY2FwdGlvbmluZzogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICB0aGlzLmpzb25TdHJpbmcgPSB0cnVlO1xuICAgIGNvbnN0IHJlc3VsdCA9IHtcbiAgICAgICdhdWRpb19sZXZlbCc6IHRoaXMuYXVkaW9fbGV2ZWwsXG4gICAgICAnbGFuZ3VhZ2UnOiB0aGlzLmxhbmd1YWdlLFxuICAgICAgJ2RlbGl2ZXJ5X3NwZWVkJzogdGhpcy5kZWxpdmVyeV9zcGVlZCxcbiAgICAgICdhdWRpb19jYXB0aW9uaW5nJzogdGhpcy5hdWRpb19jYXB0aW9uaW5nLFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDIwMDQncyBjbWkuaW50ZXJhY3Rpb25zIG9iamVjdFxuICovXG5jbGFzcyBDTUlJbnRlcmFjdGlvbnMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLm9iamVjdGl2ZXMgQXJyYXlcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHtcbiAgICAgIGNoaWxkcmVuOiBjb25zdGFudHMuaW50ZXJhY3Rpb25zX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGNtaS5vYmplY3RpdmVzIG9iamVjdFxuICovXG5jbGFzcyBDTUlPYmplY3RpdmVzIGV4dGVuZHMgQ01JQXJyYXkge1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5vYmplY3RpdmVzIEFycmF5XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogY29uc3RhbnRzLm9iamVjdGl2ZXNfY2hpbGRyZW4sXG4gICAgICBlcnJvckNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmNvbW1lbnRzX2Zyb21fbG1zIG9iamVjdFxuICovXG5jbGFzcyBDTUlDb21tZW50c0Zyb21MTVMgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmNvbW1lbnRzX2Zyb21fbG1zIEFycmF5XG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcih7XG4gICAgICBjaGlsZHJlbjogY29uc3RhbnRzLmNvbW1lbnRzX2NoaWxkcmVuLFxuICAgICAgZXJyb3JDb2RlOiBzY29ybTIwMDRfZXJyb3JfY29kZXMuUkVBRF9PTkxZX0VMRU1FTlQsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGNtaS5jb21tZW50c19mcm9tX2xlYXJuZXIgb2JqZWN0XG4gKi9cbmNsYXNzIENNSUNvbW1lbnRzRnJvbUxlYXJuZXIgZXh0ZW5kcyBDTUlBcnJheSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmNvbW1lbnRzX2Zyb21fbGVhcm5lciBBcnJheVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoe1xuICAgICAgY2hpbGRyZW46IGNvbnN0YW50cy5jb21tZW50c19jaGlsZHJlbixcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5ULFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgZm9yIFNDT1JNIDIwMDQncyBjbWkuaW50ZXJhY3Rpb24ubiBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUludGVyYWN0aW9uc09iamVjdCBleHRlbmRzIEJhc2VDTUkge1xuICAjaWQgPSAnJztcbiAgI3R5cGUgPSAnJztcbiAgI3RpbWVzdGFtcCA9ICcnO1xuICAjd2VpZ2h0aW5nID0gJyc7XG4gICNsZWFybmVyX3Jlc3BvbnNlID0gJyc7XG4gICNyZXN1bHQgPSAnJztcbiAgI2xhdGVuY3kgPSAnJztcbiAgI2Rlc2NyaXB0aW9uID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb24ublxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMub2JqZWN0aXZlcyA9IG5ldyBDTUlBcnJheSh7XG4gICAgICBlcnJvckNvZGU6IHNjb3JtMjAwNF9lcnJvcl9jb2Rlcy5SRUFEX09OTFlfRUxFTUVOVCxcbiAgICAgIGNoaWxkcmVuOiBjb25zdGFudHMub2JqZWN0aXZlc19jaGlsZHJlbixcbiAgICB9KTtcbiAgICB0aGlzLmNvcnJlY3RfcmVzcG9uc2VzID0gbmV3IENNSUFycmF5KHtcbiAgICAgIGVycm9yQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlJFQURfT05MWV9FTEVNRU5ULFxuICAgICAgY2hpbGRyZW46IGNvbnN0YW50cy5jb3JyZWN0X3Jlc3BvbnNlc19jaGlsZHJlbixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgQVBJIGhhcyBiZWVuIGluaXRpYWxpemVkIGFmdGVyIHRoZSBDTUkgaGFzIGJlZW4gY3JlYXRlZFxuICAgKi9cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5vYmplY3RpdmVzPy5pbml0aWFsaXplKCk7XG4gICAgdGhpcy5jb3JyZWN0X3Jlc3BvbnNlcz8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2lkXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBpZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jaWQ7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjaWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGlkXG4gICAqL1xuICBzZXQgaWQoaWQpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoaWQsIHJlZ2V4LkNNSUxvbmdJZGVudGlmaWVyKSkge1xuICAgICAgdGhpcy4jaWQgPSBpZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdHlwZVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgdHlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jdHlwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0eXBlXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gICAqL1xuICBzZXQgdHlwZSh0eXBlKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHR5cGUsIHJlZ2V4LkNNSVR5cGUpKSB7XG4gICAgICB0aGlzLiN0eXBlID0gdHlwZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZXN0YW1wXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lc3RhbXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWVzdGFtcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lc3RhbXBcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVzdGFtcFxuICAgKi9cbiAgc2V0IHRpbWVzdGFtcCh0aW1lc3RhbXApIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQodGltZXN0YW1wLCByZWdleC5DTUlUaW1lKSkge1xuICAgICAgdGhpcy4jdGltZXN0YW1wID0gdGltZXN0YW1wO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICN3ZWlnaHRpbmdcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHdlaWdodGluZygpIHtcbiAgICByZXR1cm4gdGhpcy4jd2VpZ2h0aW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3dlaWdodGluZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gd2VpZ2h0aW5nXG4gICAqL1xuICBzZXQgd2VpZ2h0aW5nKHdlaWdodGluZykge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdCh3ZWlnaHRpbmcsIHJlZ2V4LkNNSURlY2ltYWwpKSB7XG4gICAgICB0aGlzLiN3ZWlnaHRpbmcgPSB3ZWlnaHRpbmc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2xlYXJuZXJfcmVzcG9uc2VcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxlYXJuZXJfcmVzcG9uc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2xlYXJuZXJfcmVzcG9uc2U7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjbGVhcm5lcl9yZXNwb25zZS4gRG9lcyB0eXBlIHZhbGlkYXRpb24gdG8gbWFrZSBzdXJlIHJlc3BvbnNlXG4gICAqIG1hdGNoZXMgU0NPUk0gMjAwNCdzIHNwZWNcbiAgICogQHBhcmFtIHtzdHJpbmd9IGxlYXJuZXJfcmVzcG9uc2VcbiAgICovXG4gIHNldCBsZWFybmVyX3Jlc3BvbnNlKGxlYXJuZXJfcmVzcG9uc2UpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMudHlwZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3IoXG4gICAgICAgICAgc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkRFUEVOREVOQ1lfTk9UX0VTVEFCTElTSEVEKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG5vZGVzID0gW107XG4gICAgICBjb25zdCByZXNwb25zZV90eXBlID0gbGVhcm5lcl9yZXNwb25zZXNbdGhpcy50eXBlXTtcbiAgICAgIGlmIChyZXNwb25zZV90eXBlLmRlbGltaXRlciAhPT0gJycpIHtcbiAgICAgICAgbm9kZXMgPSBsZWFybmVyX3Jlc3BvbnNlLnNwbGl0KHJlc3BvbnNlX3R5cGUuZGVsaW1pdGVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGVzWzBdID0gbGVhcm5lcl9yZXNwb25zZTtcbiAgICAgIH1cblxuICAgICAgaWYgKChub2Rlcy5sZW5ndGggPiAwKSAmJiAobm9kZXMubGVuZ3RoIDw9IHJlc3BvbnNlX3R5cGUubWF4KSkge1xuICAgICAgICBjb25zdCBmb3JtYXRSZWdleCA9IG5ldyBSZWdFeHAocmVzcG9uc2VfdHlwZS5mb3JtYXQpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiByZXNwb25zZV90eXBlLmRlbGltaXRlcjIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZXMgPSBub2Rlc1tpXS5zcGxpdChyZXNwb25zZV90eXBlLmRlbGltaXRlcjIpO1xuICAgICAgICAgICAgaWYgKHZhbHVlcy5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgaWYgKCF2YWx1ZXNbMF0ubWF0Y2goZm9ybWF0UmVnZXgpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3dUeXBlTWlzbWF0Y2hFcnJvcigpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghdmFsdWVzWzFdLm1hdGNoKG5ldyBSZWdFeHAocmVzcG9uc2VfdHlwZS5mb3JtYXQyKSkpIHtcbiAgICAgICAgICAgICAgICAgIHRocm93VHlwZU1pc21hdGNoRXJyb3IoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93VHlwZU1pc21hdGNoRXJyb3IoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFub2Rlc1tpXS5tYXRjaChmb3JtYXRSZWdleCkpIHtcbiAgICAgICAgICAgICAgdGhyb3dUeXBlTWlzbWF0Y2hFcnJvcigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKG5vZGVzW2ldICE9PSAnJyAmJiByZXNwb25zZV90eXBlLnVuaXF1ZSkge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaTsgaisrKSB7XG4gICAgICAgICAgICAgICAgICBpZiAobm9kZXNbaV0gPT09IG5vZGVzW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93VHlwZU1pc21hdGNoRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBWYWxpZGF0aW9uRXJyb3Ioc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLkdFTkVSQUxfU0VUX0ZBSUxVUkUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNyZXN1bHRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHJlc3VsdCgpIHtcbiAgICByZXR1cm4gdGhpcy4jcmVzdWx0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3Jlc3VsdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVzdWx0XG4gICAqL1xuICBzZXQgcmVzdWx0KHJlc3VsdCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChyZXN1bHQsIHJlZ2V4LkNNSVJlc3VsdCkpIHtcbiAgICAgIHRoaXMuI3Jlc3VsdCA9IHJlc3VsdDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbGF0ZW5jeVxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgbGF0ZW5jeSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbGF0ZW5jeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsYXRlbmN5XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsYXRlbmN5XG4gICAqL1xuICBzZXQgbGF0ZW5jeShsYXRlbmN5KSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGxhdGVuY3ksIHJlZ2V4LkNNSVRpbWVzcGFuKSkge1xuICAgICAgdGhpcy4jbGF0ZW5jeSA9IGxhdGVuY3k7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2Rlc2NyaXB0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBkZXNjcmlwdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jZGVzY3JpcHRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZGVzY3JpcHRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyaXB0aW9uXG4gICAqL1xuICBzZXQgZGVzY3JpcHRpb24oZGVzY3JpcHRpb24pIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoZGVzY3JpcHRpb24sIHJlZ2V4LkNNSUxhbmdTdHJpbmcyNTAsIHRydWUpKSB7XG4gICAgICB0aGlzLiNkZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5pbnRlcmFjdGlvbnMublxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGlkOiBzdHJpbmcsXG4gICAqICAgICAgdHlwZTogc3RyaW5nLFxuICAgKiAgICAgIG9iamVjdGl2ZXM6IENNSUFycmF5LFxuICAgKiAgICAgIHRpbWVzdGFtcDogc3RyaW5nLFxuICAgKiAgICAgIGNvcnJlY3RfcmVzcG9uc2VzOiBDTUlBcnJheSxcbiAgICogICAgICB3ZWlnaHRpbmc6IHN0cmluZyxcbiAgICogICAgICBsZWFybmVyX3Jlc3BvbnNlOiBzdHJpbmcsXG4gICAqICAgICAgcmVzdWx0OiBzdHJpbmcsXG4gICAqICAgICAgbGF0ZW5jeTogc3RyaW5nLFxuICAgKiAgICAgIGRlc2NyaXB0aW9uOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICAgICd0eXBlJzogdGhpcy50eXBlLFxuICAgICAgJ29iamVjdGl2ZXMnOiB0aGlzLm9iamVjdGl2ZXMsXG4gICAgICAndGltZXN0YW1wJzogdGhpcy50aW1lc3RhbXAsXG4gICAgICAnd2VpZ2h0aW5nJzogdGhpcy53ZWlnaHRpbmcsXG4gICAgICAnbGVhcm5lcl9yZXNwb25zZSc6IHRoaXMubGVhcm5lcl9yZXNwb25zZSxcbiAgICAgICdyZXN1bHQnOiB0aGlzLnJlc3VsdCxcbiAgICAgICdsYXRlbmN5JzogdGhpcy5sYXRlbmN5LFxuICAgICAgJ2Rlc2NyaXB0aW9uJzogdGhpcy5kZXNjcmlwdGlvbixcbiAgICAgICdjb3JyZWN0X3Jlc3BvbnNlcyc6IHRoaXMuY29ycmVjdF9yZXNwb25zZXMsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyBmb3IgU0NPUk0gMjAwNCdzIGNtaS5vYmplY3RpdmVzLm4gb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlPYmplY3RpdmVzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNpZCA9ICcnO1xuICAjc3VjY2Vzc19zdGF0dXMgPSAndW5rbm93bic7XG4gICNjb21wbGV0aW9uX3N0YXR1cyA9ICd1bmtub3duJztcbiAgI3Byb2dyZXNzX21lYXN1cmUgPSAnJztcbiAgI2Rlc2NyaXB0aW9uID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkub2JqZWN0aXZlcy5uXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zY29yZSA9IG5ldyBTY29ybTIwMDRDTUlTY29yZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBBUEkgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYWZ0ZXIgdGhlIENNSSBoYXMgYmVlbiBjcmVhdGVkXG4gICAqL1xuICBpbml0aWFsaXplKCkge1xuICAgIHN1cGVyLmluaXRpYWxpemUoKTtcbiAgICB0aGlzLnNjb3JlPy5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjaWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGlkKCkge1xuICAgIHJldHVybiB0aGlzLiNpZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNpZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gaWRcbiAgICovXG4gIHNldCBpZChpZCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChpZCwgcmVnZXguQ01JTG9uZ0lkZW50aWZpZXIpKSB7XG4gICAgICB0aGlzLiNpZCA9IGlkO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzdWNjZXNzX3N0YXR1c1xuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgc3VjY2Vzc19zdGF0dXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3N1Y2Nlc3Nfc3RhdHVzO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3N1Y2Nlc3Nfc3RhdHVzXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBzdWNjZXNzX3N0YXR1c1xuICAgKi9cbiAgc2V0IHN1Y2Nlc3Nfc3RhdHVzKHN1Y2Nlc3Nfc3RhdHVzKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KHN1Y2Nlc3Nfc3RhdHVzLCByZWdleC5DTUlTU3RhdHVzKSkge1xuICAgICAgdGhpcy4jc3VjY2Vzc19zdGF0dXMgPSBzdWNjZXNzX3N0YXR1cztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29tcGxldGlvbl9zdGF0dXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGNvbXBsZXRpb25fc3RhdHVzKCkge1xuICAgIHJldHVybiB0aGlzLiNjb21wbGV0aW9uX3N0YXR1cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb21wbGV0aW9uX3N0YXR1c1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY29tcGxldGlvbl9zdGF0dXNcbiAgICovXG4gIHNldCBjb21wbGV0aW9uX3N0YXR1cyhjb21wbGV0aW9uX3N0YXR1cykge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChjb21wbGV0aW9uX3N0YXR1cywgcmVnZXguQ01JQ1N0YXR1cykpIHtcbiAgICAgIHRoaXMuI2NvbXBsZXRpb25fc3RhdHVzID0gY29tcGxldGlvbl9zdGF0dXM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3Byb2dyZXNzX21lYXN1cmVcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHByb2dyZXNzX21lYXN1cmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3Byb2dyZXNzX21lYXN1cmU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcHJvZ3Jlc3NfbWVhc3VyZVxuICAgKiBAcGFyYW0ge3N0cmluZ30gcHJvZ3Jlc3NfbWVhc3VyZVxuICAgKi9cbiAgc2V0IHByb2dyZXNzX21lYXN1cmUocHJvZ3Jlc3NfbWVhc3VyZSkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChwcm9ncmVzc19tZWFzdXJlLCByZWdleC5DTUlEZWNpbWFsKSAmJlxuICAgICAgICBjaGVjazIwMDRWYWxpZFJhbmdlKHByb2dyZXNzX21lYXN1cmUsIHJlZ2V4LnByb2dyZXNzX3JhbmdlKSkge1xuICAgICAgdGhpcy4jcHJvZ3Jlc3NfbWVhc3VyZSA9IHByb2dyZXNzX21lYXN1cmU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2Rlc2NyaXB0aW9uXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBkZXNjcmlwdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy4jZGVzY3JpcHRpb247XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjZGVzY3JpcHRpb25cbiAgICogQHBhcmFtIHtzdHJpbmd9IGRlc2NyaXB0aW9uXG4gICAqL1xuICBzZXQgZGVzY3JpcHRpb24oZGVzY3JpcHRpb24pIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoZGVzY3JpcHRpb24sIHJlZ2V4LkNNSUxhbmdTdHJpbmcyNTAsIHRydWUpKSB7XG4gICAgICB0aGlzLiNkZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5vYmplY3RpdmVzLm5cbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBpZDogc3RyaW5nLFxuICAgKiAgICAgIHN1Y2Nlc3Nfc3RhdHVzOiBzdHJpbmcsXG4gICAqICAgICAgY29tcGxldGlvbl9zdGF0dXM6IHN0cmluZyxcbiAgICogICAgICBwcm9ncmVzc19tZWFzdXJlOiBzdHJpbmcsXG4gICAqICAgICAgZGVzY3JpcHRpb246IHN0cmluZyxcbiAgICogICAgICBzY29yZTogU2Nvcm0yMDA0Q01JU2NvcmVcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICAgICdzdWNjZXNzX3N0YXR1cyc6IHRoaXMuc3VjY2Vzc19zdGF0dXMsXG4gICAgICAnY29tcGxldGlvbl9zdGF0dXMnOiB0aGlzLmNvbXBsZXRpb25fc3RhdHVzLFxuICAgICAgJ3Byb2dyZXNzX21lYXN1cmUnOiB0aGlzLnByb2dyZXNzX21lYXN1cmUsXG4gICAgICAnZGVzY3JpcHRpb24nOiB0aGlzLmRlc2NyaXB0aW9uLFxuICAgICAgJ3Njb3JlJzogdGhpcy5zY29yZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIGZvciBTQ09STSAyMDA0J3MgY21pICouc2NvcmUgb2JqZWN0XG4gKi9cbmNsYXNzIFNjb3JtMjAwNENNSVNjb3JlIGV4dGVuZHMgQ01JU2NvcmUge1xuICAjc2NhbGVkID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkgKi5zY29yZVxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoXG4gICAgICAgIHtcbiAgICAgICAgICBzY29yZV9jaGlsZHJlbjogY29uc3RhbnRzLnNjb3JlX2NoaWxkcmVuLFxuICAgICAgICAgIG1heDogJycsXG4gICAgICAgICAgaW52YWxpZEVycm9yQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLklOVkFMSURfU0VUX1ZBTFVFLFxuICAgICAgICAgIGludmFsaWRUeXBlQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlRZUEVfTUlTTUFUQ0gsXG4gICAgICAgICAgaW52YWxpZFJhbmdlQ29kZTogc2Nvcm0yMDA0X2Vycm9yX2NvZGVzLlZBTFVFX09VVF9PRl9SQU5HRSxcbiAgICAgICAgICBkZWNpbWFsUmVnZXg6IHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsLFxuICAgICAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNzY2FsZWRcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHNjYWxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy4jc2NhbGVkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3NjYWxlZFxuICAgKiBAcGFyYW0ge3N0cmluZ30gc2NhbGVkXG4gICAqL1xuICBzZXQgc2NhbGVkKHNjYWxlZCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChzY2FsZWQsIHJlZ2V4LkNNSURlY2ltYWwpICYmXG4gICAgICAgIGNoZWNrMjAwNFZhbGlkUmFuZ2Uoc2NhbGVkLCByZWdleC5zY2FsZWRfcmFuZ2UpKSB7XG4gICAgICB0aGlzLiNzY2FsZWQgPSBzY2FsZWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pICouc2NvcmVcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBzY2FsZWQ6IHN0cmluZyxcbiAgICogICAgICByYXc6IHN0cmluZyxcbiAgICogICAgICBtaW46IHN0cmluZyxcbiAgICogICAgICBtYXg6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnc2NhbGVkJzogdGhpcy5zY2FsZWQsXG4gICAgICAncmF3Jzogc3VwZXIucmF3LFxuICAgICAgJ21pbic6IHN1cGVyLm1pbixcbiAgICAgICdtYXgnOiBzdXBlci5tYXgsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGNtaS5jb21tZW50c19mcm9tX2xlYXJuZXIubiBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIENNSUNvbW1lbnRzRnJvbUxlYXJuZXJPYmplY3QgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI2NvbW1lbnQgPSAnJztcbiAgI2xvY2F0aW9uID0gJyc7XG4gICN0aW1lc3RhbXAgPSAnJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGNtaS5jb21tZW50c19mcm9tX2xlYXJuZXIublxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLiNjb21tZW50ID0gJyc7XG4gICAgdGhpcy4jbG9jYXRpb24gPSAnJztcbiAgICB0aGlzLiN0aW1lc3RhbXAgPSAnJztcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNjb21tZW50XG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb21tZW50KCkge1xuICAgIHJldHVybiB0aGlzLiNjb21tZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2NvbW1lbnRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbW1lbnRcbiAgICovXG4gIHNldCBjb21tZW50KGNvbW1lbnQpIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQoY29tbWVudCwgcmVnZXguQ01JTGFuZ1N0cmluZzQwMDAsIHRydWUpKSB7XG4gICAgICB0aGlzLiNjb21tZW50ID0gY29tbWVudDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbG9jYXRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxvY2F0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLiNsb2NhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsb2NhdGlvblxuICAgKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb25cbiAgICovXG4gIHNldCBsb2NhdGlvbihsb2NhdGlvbikge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChsb2NhdGlvbiwgcmVnZXguQ01JU3RyaW5nMjUwKSkge1xuICAgICAgdGhpcy4jbG9jYXRpb24gPSBsb2NhdGlvbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZXN0YW1wXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lc3RhbXAoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3RpbWVzdGFtcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lc3RhbXBcbiAgICogQHBhcmFtIHtzdHJpbmd9IHRpbWVzdGFtcFxuICAgKi9cbiAgc2V0IHRpbWVzdGFtcCh0aW1lc3RhbXApIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQodGltZXN0YW1wLCByZWdleC5DTUlUaW1lKSkge1xuICAgICAgdGhpcy4jdGltZXN0YW1wID0gdGltZXN0YW1wO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGNtaS5jb21tZW50c19mcm9tX2xlYXJuZXIubiBvYmplY3RcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBjb21tZW50OiBzdHJpbmcsXG4gICAqICAgICAgbG9jYXRpb246IHN0cmluZyxcbiAgICogICAgICB0aW1lc3RhbXA6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAnY29tbWVudCc6IHRoaXMuY29tbWVudCxcbiAgICAgICdsb2NhdGlvbic6IHRoaXMubG9jYXRpb24sXG4gICAgICAndGltZXN0YW1wJzogdGhpcy50aW1lc3RhbXAsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGNtaS5jb21tZW50c19mcm9tX2xtcy5uIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQ01JQ29tbWVudHNGcm9tTE1TT2JqZWN0IGV4dGVuZHMgQ01JQ29tbWVudHNGcm9tTGVhcm5lck9iamVjdCB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmNvbW1lbnRzX2Zyb21fbG1zLm5cbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjY29tbWVudFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgY29tbWVudCgpIHtcbiAgICByZXR1cm4gc3VwZXIuY29tbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNjb21tZW50LiBDYW4gb25seSBiZSBjYWxsZWQgYmVmb3JlICBpbml0aWFsaXphdGlvbi5cbiAgICogQHBhcmFtIHtzdHJpbmd9IGNvbW1lbnRcbiAgICovXG4gIHNldCBjb21tZW50KGNvbW1lbnQpIHtcbiAgICAhdGhpcy5pbml0aWFsaXplZCA/IHN1cGVyLmNvbW1lbnQgPSBjb21tZW50IDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjbG9jYXRpb25cbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxvY2F0aW9uKCkge1xuICAgIHJldHVybiBzdXBlci5sb2NhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNsb2NhdGlvbi4gQ2FuIG9ubHkgYmUgY2FsbGVkIGJlZm9yZSAgaW5pdGlhbGl6YXRpb24uXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBsb2NhdGlvblxuICAgKi9cbiAgc2V0IGxvY2F0aW9uKGxvY2F0aW9uKSB7XG4gICAgIXRoaXMuaW5pdGlhbGl6ZWQgPyBzdXBlci5sb2NhdGlvbiA9IGxvY2F0aW9uIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjdGltZXN0YW1wXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCB0aW1lc3RhbXAoKSB7XG4gICAgcmV0dXJuIHN1cGVyLnRpbWVzdGFtcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICN0aW1lc3RhbXAuIENhbiBvbmx5IGJlIGNhbGxlZCBiZWZvcmUgIGluaXRpYWxpemF0aW9uLlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdGltZXN0YW1wXG4gICAqL1xuICBzZXQgdGltZXN0YW1wKHRpbWVzdGFtcCkge1xuICAgICF0aGlzLmluaXRpYWxpemVkID8gc3VwZXIudGltZXN0YW1wID0gdGltZXN0YW1wIDogdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBjbWkuY29tbWVudHNfZnJvbV9sbXMublxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGNvbW1lbnQ6IHN0cmluZyxcbiAgICogICAgICBsb2NhdGlvbjogc3RyaW5nLFxuICAgKiAgICAgIHRpbWVzdGFtcDogc3RyaW5nXG4gICAqICAgIH1cbiAgICogIH1cbiAgICovXG4gIHRvSlNPTigpIHtcbiAgICByZXR1cm4gc3VwZXIudG9KU09OKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGNtaS5pbnRlcmFjdGlvbnMubi5vYmplY3RpdmVzLm4gb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlJbnRlcmFjdGlvbnNPYmplY3RpdmVzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNpZCA9ICcnO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgY21pLmludGVyYWN0aW9ucy5uLm9iamVjdGl2ZXMublxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNpZFxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAqL1xuICBnZXQgaWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI2lkXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBpZFxuICAgKi9cbiAgc2V0IGlkKGlkKSB7XG4gICAgaWYgKGNoZWNrMjAwNFZhbGlkRm9ybWF0KGlkLCByZWdleC5DTUlMb25nSWRlbnRpZmllcikpIHtcbiAgICAgIHRoaXMuI2lkID0gaWQ7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHRvSlNPTiBmb3IgY21pLmludGVyYWN0aW9ucy5uLm9iamVjdGl2ZXMublxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIGlkOiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ2lkJzogdGhpcy5pZCxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgY21pLmludGVyYWN0aW9ucy5uLmNvcnJlY3RfcmVzcG9uc2VzLm4gb2JqZWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBDTUlJbnRlcmFjdGlvbnNDb3JyZWN0UmVzcG9uc2VzT2JqZWN0IGV4dGVuZHMgQmFzZUNNSSB7XG4gICNwYXR0ZXJuID0gJyc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdG9yIGZvciBjbWkuaW50ZXJhY3Rpb25zLm4uY29ycmVjdF9yZXNwb25zZXMublxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNwYXR0ZXJuXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBwYXR0ZXJuKCkge1xuICAgIHJldHVybiB0aGlzLiNwYXR0ZXJuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHRlciBmb3IgI3BhdHRlcm5cbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdHRlcm5cbiAgICovXG4gIHNldCBwYXR0ZXJuKHBhdHRlcm4pIHtcbiAgICBpZiAoY2hlY2syMDA0VmFsaWRGb3JtYXQocGF0dGVybiwgcmVnZXguQ01JRmVlZGJhY2spKSB7XG4gICAgICB0aGlzLiNwYXR0ZXJuID0gcGF0dGVybjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGNtaS5pbnRlcmFjdGlvbnMubi5jb3JyZWN0X3Jlc3BvbnNlcy5uIG9iamVjdFxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHBhdHRlcm46IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAncGF0dGVybic6IHRoaXMucGF0dGVybixcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBTQ09STSAyMDA0J3MgYWRsIG9iamVjdFxuICovXG5leHBvcnQgY2xhc3MgQURMIGV4dGVuZHMgQmFzZUNNSSB7XG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgYWRsXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5uYXYgPSBuZXcgQURMTmF2KCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMubmF2Py5pbml0aWFsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogdG9KU09OIGZvciBhZGxcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICBuYXY6IHtcbiAgICogICAgICAgIHJlcXVlc3Q6IHN0cmluZ1xuICAgKiAgICAgIH1cbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ25hdic6IHRoaXMubmF2LFxuICAgIH07XG4gICAgZGVsZXRlIHRoaXMuanNvblN0cmluZztcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIFNDT1JNIDIwMDQncyBhZGwubmF2IG9iamVjdFxuICovXG5jbGFzcyBBRExOYXYgZXh0ZW5kcyBCYXNlQ01JIHtcbiAgI3JlcXVlc3QgPSAnX25vbmVfJztcblxuICAvKipcbiAgICogQ29uc3RydWN0b3IgZm9yIGFkbC5uYXZcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnJlcXVlc3RfdmFsaWQgPSBuZXcgQURMTmF2UmVxdWVzdFZhbGlkKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIEFQSSBoYXMgYmVlbiBpbml0aWFsaXplZCBhZnRlciB0aGUgQ01JIGhhcyBiZWVuIGNyZWF0ZWRcbiAgICovXG4gIGluaXRpYWxpemUoKSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZSgpO1xuICAgIHRoaXMucmVxdWVzdF92YWxpZD8uaW5pdGlhbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI3JlcXVlc3RcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHJlcXVlc3QoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3JlcXVlc3Q7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjcmVxdWVzdFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcmVxdWVzdFxuICAgKi9cbiAgc2V0IHJlcXVlc3QocmVxdWVzdCkge1xuICAgIGlmIChjaGVjazIwMDRWYWxpZEZvcm1hdChyZXF1ZXN0LCByZWdleC5OQVZFdmVudCkpIHtcbiAgICAgIHRoaXMuI3JlcXVlc3QgPSByZXF1ZXN0O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGFkbC5uYXZcbiAgICpcbiAgICogQHJldHVybiB7XG4gICAqICAgIHtcbiAgICogICAgICByZXF1ZXN0OiBzdHJpbmdcbiAgICogICAgfVxuICAgKiAgfVxuICAgKi9cbiAgdG9KU09OKCkge1xuICAgIHRoaXMuanNvblN0cmluZyA9IHRydWU7XG4gICAgY29uc3QgcmVzdWx0ID0ge1xuICAgICAgJ3JlcXVlc3QnOiB0aGlzLnJlcXVlc3QsXG4gICAgfTtcbiAgICBkZWxldGUgdGhpcy5qc29uU3RyaW5nO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgU0NPUk0gMjAwNCdzIGFkbC5uYXYucmVxdWVzdF92YWxpZCBvYmplY3RcbiAqL1xuY2xhc3MgQURMTmF2UmVxdWVzdFZhbGlkIGV4dGVuZHMgQmFzZUNNSSB7XG4gICNjb250aW51ZSA9ICd1bmtub3duJztcbiAgI3ByZXZpb3VzID0gJ3Vua25vd24nO1xuICBjaG9pY2UgPSBjbGFzcyB7XG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGFyZ2V0IGlzIHZhbGlkXG4gICAgICogQHBhcmFtIHsqfSBfdGFyZ2V0XG4gICAgICogQHJldHVybiB7c3RyaW5nfVxuICAgICAqL1xuICAgIF9pc1RhcmdldFZhbGlkID0gKF90YXJnZXQpID0+ICd1bmtub3duJztcbiAgfTtcbiAganVtcCA9IGNsYXNzIHtcbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0YXJnZXQgaXMgdmFsaWRcbiAgICAgKiBAcGFyYW0geyp9IF90YXJnZXRcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICovXG4gICAgX2lzVGFyZ2V0VmFsaWQgPSAoX3RhcmdldCkgPT4gJ3Vua25vd24nO1xuICB9O1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RvciBmb3IgYWRsLm5hdi5yZXF1ZXN0X3ZhbGlkXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHRlciBmb3IgI2NvbnRpbnVlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBjb250aW51ZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jY29udGludWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0dGVyIGZvciAjY29udGludWUuIEp1c3QgdGhyb3dzIGFuIGVycm9yLlxuICAgKiBAcGFyYW0geyp9IF9cbiAgICovXG4gIHNldCBjb250aW51ZShfKSB7XG4gICAgdGhyb3dSZWFkT25seUVycm9yKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0dGVyIGZvciAjcHJldmlvdXNcbiAgICogQHJldHVybiB7c3RyaW5nfVxuICAgKi9cbiAgZ2V0IHByZXZpb3VzKCkge1xuICAgIHJldHVybiB0aGlzLiNwcmV2aW91cztcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXR0ZXIgZm9yICNwcmV2aW91cy4gSnVzdCB0aHJvd3MgYW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7Kn0gX1xuICAgKi9cbiAgc2V0IHByZXZpb3VzKF8pIHtcbiAgICB0aHJvd1JlYWRPbmx5RXJyb3IoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0b0pTT04gZm9yIGFkbC5uYXYucmVxdWVzdF92YWxpZFxuICAgKlxuICAgKiBAcmV0dXJuIHtcbiAgICogICAge1xuICAgKiAgICAgIHByZXZpb3VzOiBzdHJpbmcsXG4gICAqICAgICAgY29udGludWU6IHN0cmluZ1xuICAgKiAgICB9XG4gICAqICB9XG4gICAqL1xuICB0b0pTT04oKSB7XG4gICAgdGhpcy5qc29uU3RyaW5nID0gdHJ1ZTtcbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICAncHJldmlvdXMnOiB0aGlzLnByZXZpb3VzLFxuICAgICAgJ2NvbnRpbnVlJzogdGhpcy5jb250aW51ZSxcbiAgICB9O1xuICAgIGRlbGV0ZSB0aGlzLmpzb25TdHJpbmc7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIiwiLy8gQGZsb3dcbmV4cG9ydCBjb25zdCBzY29ybTEyX2NvbnN0YW50cyA9IHtcbiAgLy8gQ2hpbGRyZW4gbGlzdHNcbiAgY21pX2NoaWxkcmVuOiAnY29yZSxzdXNwZW5kX2RhdGEsbGF1bmNoX2RhdGEsY29tbWVudHMsb2JqZWN0aXZlcyxzdHVkZW50X2RhdGEsc3R1ZGVudF9wcmVmZXJlbmNlLGludGVyYWN0aW9ucycsXG4gIGNvcmVfY2hpbGRyZW46ICdzdHVkZW50X2lkLHN0dWRlbnRfbmFtZSxsZXNzb25fbG9jYXRpb24sY3JlZGl0LGxlc3Nvbl9zdGF0dXMsZW50cnksc2NvcmUsdG90YWxfdGltZSxsZXNzb25fbW9kZSxleGl0LHNlc3Npb25fdGltZScsXG4gIHNjb3JlX2NoaWxkcmVuOiAncmF3LG1pbixtYXgnLFxuICBjb21tZW50c19jaGlsZHJlbjogJ2NvbnRlbnQsbG9jYXRpb24sdGltZScsXG4gIG9iamVjdGl2ZXNfY2hpbGRyZW46ICdpZCxzY29yZSxzdGF0dXMnLFxuICBjb3JyZWN0X3Jlc3BvbnNlc19jaGlsZHJlbjogJ3BhdHRlcm4nLFxuICBzdHVkZW50X2RhdGFfY2hpbGRyZW46ICdtYXN0ZXJ5X3Njb3JlLG1heF90aW1lX2FsbG93ZWQsdGltZV9saW1pdF9hY3Rpb24nLFxuICBzdHVkZW50X3ByZWZlcmVuY2VfY2hpbGRyZW46ICdhdWRpbyxsYW5ndWFnZSxzcGVlZCx0ZXh0JyxcbiAgaW50ZXJhY3Rpb25zX2NoaWxkcmVuOiAnaWQsb2JqZWN0aXZlcyx0aW1lLHR5cGUsY29ycmVjdF9yZXNwb25zZXMsd2VpZ2h0aW5nLHN0dWRlbnRfcmVzcG9uc2UscmVzdWx0LGxhdGVuY3knLFxuXG4gIGVycm9yX2Rlc2NyaXB0aW9uczoge1xuICAgICcxMDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIEV4Y2VwdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTm8gc3BlY2lmaWMgZXJyb3IgY29kZSBleGlzdHMgdG8gZGVzY3JpYmUgdGhlIGVycm9yLiBVc2UgTE1TR2V0RGlhZ25vc3RpYyBmb3IgbW9yZSBpbmZvcm1hdGlvbicsXG4gICAgfSxcbiAgICAnMjAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnSW52YWxpZCBhcmd1bWVudCBlcnJvcicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIHRoYXQgYW4gYXJndW1lbnQgcmVwcmVzZW50cyBhbiBpbnZhbGlkIGRhdGEgbW9kZWwgZWxlbWVudCBvciBpcyBvdGhlcndpc2UgaW5jb3JyZWN0LicsXG4gICAgfSxcbiAgICAnMjAyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRWxlbWVudCBjYW5ub3QgaGF2ZSBjaGlsZHJlbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIHRoYXQgTE1TR2V0VmFsdWUgd2FzIGNhbGxlZCB3aXRoIGEgZGF0YSBtb2RlbCBlbGVtZW50IG5hbWUgdGhhdCBlbmRzIGluIFwiX2NoaWxkcmVuXCIgZm9yIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgZG9lcyBub3Qgc3VwcG9ydCB0aGUgXCJfY2hpbGRyZW5cIiBzdWZmaXguJyxcbiAgICB9LFxuICAgICcyMDMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdFbGVtZW50IG5vdCBhbiBhcnJheSAtIGNhbm5vdCBoYXZlIGNvdW50JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgdGhhdCBMTVNHZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSBkYXRhIG1vZGVsIGVsZW1lbnQgbmFtZSB0aGF0IGVuZHMgaW4gXCJfY291bnRcIiBmb3IgYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBkb2VzIG5vdCBzdXBwb3J0IHRoZSBcIl9jb3VudFwiIHN1ZmZpeC4nLFxuICAgIH0sXG4gICAgJzMwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ05vdCBpbml0aWFsaXplZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIHRoYXQgYW4gQVBJIGNhbGwgd2FzIG1hZGUgYmVmb3JlIHRoZSBjYWxsIHRvIGxtc0luaXRpYWxpemUuJyxcbiAgICB9LFxuICAgICc0MDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdOb3QgaW1wbGVtZW50ZWQgZXJyb3InLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1RoZSBkYXRhIG1vZGVsIGVsZW1lbnQgaW5kaWNhdGVkIGluIGEgY2FsbCB0byBMTVNHZXRWYWx1ZSBvciBMTVNTZXRWYWx1ZSBpcyB2YWxpZCwgYnV0IHdhcyBub3QgaW1wbGVtZW50ZWQgYnkgdGhpcyBMTVMuIFNDT1JNIDEuMiBkZWZpbmVzIGEgc2V0IG9mIGRhdGEgbW9kZWwgZWxlbWVudHMgYXMgYmVpbmcgb3B0aW9uYWwgZm9yIGFuIExNUyB0byBpbXBsZW1lbnQuJyxcbiAgICB9LFxuICAgICc0MDInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdJbnZhbGlkIHNldCB2YWx1ZSwgZWxlbWVudCBpcyBhIGtleXdvcmQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyB0aGF0IExNU1NldFZhbHVlIHdhcyBjYWxsZWQgb24gYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCByZXByZXNlbnRzIGEga2V5d29yZCAoZWxlbWVudHMgdGhhdCBlbmQgaW4gXCJfY2hpbGRyZW5cIiBhbmQgXCJfY291bnRcIikuJyxcbiAgICB9LFxuICAgICc0MDMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdFbGVtZW50IGlzIHJlYWQgb25seScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTE1TU2V0VmFsdWUgd2FzIGNhbGxlZCB3aXRoIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgY2FuIG9ubHkgYmUgcmVhZC4nLFxuICAgIH0sXG4gICAgJzQwNCc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0VsZW1lbnQgaXMgd3JpdGUgb25seScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTE1TR2V0VmFsdWUgd2FzIGNhbGxlZCBvbiBhIGRhdGEgbW9kZWwgZWxlbWVudCB0aGF0IGNhbiBvbmx5IGJlIHdyaXR0ZW4gdG8uJyxcbiAgICB9LFxuICAgICc0MDUnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdJbmNvcnJlY3QgRGF0YSBUeXBlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdMTVNTZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSB2YWx1ZSB0aGF0IGlzIG5vdCBjb25zaXN0ZW50IHdpdGggdGhlIGRhdGEgZm9ybWF0IG9mIHRoZSBzdXBwbGllZCBkYXRhIG1vZGVsIGVsZW1lbnQuJyxcbiAgICB9LFxuICB9LFxufTtcblxuZXhwb3J0IGNvbnN0IGFpY2NfY29uc3RhbnRzID0ge1xuICAuLi5zY29ybTEyX2NvbnN0YW50cywgLi4ue1xuICAgIGNtaV9jaGlsZHJlbjogJ2NvcmUsc3VzcGVuZF9kYXRhLGxhdW5jaF9kYXRhLGNvbW1lbnRzLG9iamVjdGl2ZXMsc3R1ZGVudF9kYXRhLHN0dWRlbnRfcHJlZmVyZW5jZSxpbnRlcmFjdGlvbnMsZXZhbHVhdGlvbicsXG4gICAgc3R1ZGVudF9kYXRhX2NoaWxkcmVuOiAnYXR0ZW1wdF9udW1iZXIsdHJpZXMsbWFzdGVyeV9zY29yZSxtYXhfdGltZV9hbGxvd2VkLHRpbWVfbGltaXRfYWN0aW9uJyxcbiAgICB0cmllc19jaGlsZHJlbjogJ3RpbWUsc3RhdHVzLHNjb3JlJyxcbiAgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBzY29ybTIwMDRfY29uc3RhbnRzID0ge1xuICAvLyBDaGlsZHJlbiBsaXN0c1xuICBjbWlfY2hpbGRyZW46ICdfdmVyc2lvbixjb21tZW50c19mcm9tX2xlYXJuZXIsY29tbWVudHNfZnJvbV9sbXMsY29tcGxldGlvbl9zdGF0dXMsY3JlZGl0LGVudHJ5LGV4aXQsaW50ZXJhY3Rpb25zLGxhdW5jaF9kYXRhLGxlYXJuZXJfaWQsbGVhcm5lcl9uYW1lLGxlYXJuZXJfcHJlZmVyZW5jZSxsb2NhdGlvbixtYXhfdGltZV9hbGxvd2VkLG1vZGUsb2JqZWN0aXZlcyxwcm9ncmVzc19tZWFzdXJlLHNjYWxlZF9wYXNzaW5nX3Njb3JlLHNjb3JlLHNlc3Npb25fdGltZSxzdWNjZXNzX3N0YXR1cyxzdXNwZW5kX2RhdGEsdGltZV9saW1pdF9hY3Rpb24sdG90YWxfdGltZScsXG4gIGNvbW1lbnRzX2NoaWxkcmVuOiAnY29tbWVudCx0aW1lc3RhbXAsbG9jYXRpb24nLFxuICBzY29yZV9jaGlsZHJlbjogJ21heCxyYXcsc2NhbGVkLG1pbicsXG4gIG9iamVjdGl2ZXNfY2hpbGRyZW46ICdwcm9ncmVzc19tZWFzdXJlLGNvbXBsZXRpb25fc3RhdHVzLHN1Y2Nlc3Nfc3RhdHVzLGRlc2NyaXB0aW9uLHNjb3JlLGlkJyxcbiAgY29ycmVjdF9yZXNwb25zZXNfY2hpbGRyZW46ICdwYXR0ZXJuJyxcbiAgc3R1ZGVudF9kYXRhX2NoaWxkcmVuOiAnbWFzdGVyeV9zY29yZSxtYXhfdGltZV9hbGxvd2VkLHRpbWVfbGltaXRfYWN0aW9uJyxcbiAgc3R1ZGVudF9wcmVmZXJlbmNlX2NoaWxkcmVuOiAnYXVkaW9fbGV2ZWwsYXVkaW9fY2FwdGlvbmluZyxkZWxpdmVyeV9zcGVlZCxsYW5ndWFnZScsXG4gIGludGVyYWN0aW9uc19jaGlsZHJlbjogJ2lkLHR5cGUsb2JqZWN0aXZlcyx0aW1lc3RhbXAsY29ycmVjdF9yZXNwb25zZXMsd2VpZ2h0aW5nLGxlYXJuZXJfcmVzcG9uc2UscmVzdWx0LGxhdGVuY3ksZGVzY3JpcHRpb24nLFxuXG4gIGVycm9yX2Rlc2NyaXB0aW9uczoge1xuICAgICcwJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnTm8gRXJyb3InLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ05vIGVycm9yIG9jY3VycmVkLCB0aGUgcHJldmlvdXMgQVBJIGNhbGwgd2FzIHN1Y2Nlc3NmdWwuJyxcbiAgICB9LFxuICAgICcxMDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIEV4Y2VwdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnTm8gc3BlY2lmaWMgZXJyb3IgY29kZSBleGlzdHMgdG8gZGVzY3JpYmUgdGhlIGVycm9yLiBVc2UgR2V0RGlhZ25vc3RpYyBmb3IgbW9yZSBpbmZvcm1hdGlvbi4nLFxuICAgIH0sXG4gICAgJzEwMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgSW5pdGlhbGl6YXRpb24gRmFpbHVyZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBJbml0aWFsaXplIGZhaWxlZCBmb3IgYW4gdW5rbm93biByZWFzb24uJyxcbiAgICB9LFxuICAgICcxMDMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdBbHJlYWR5IEluaXRpYWxpemVkJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIEluaXRpYWxpemUgZmFpbGVkIGJlY2F1c2UgSW5pdGlhbGl6ZSB3YXMgYWxyZWFkeSBjYWxsZWQuJyxcbiAgICB9LFxuICAgICcxMDQnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdDb250ZW50IEluc3RhbmNlIFRlcm1pbmF0ZWQnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gSW5pdGlhbGl6ZSBmYWlsZWQgYmVjYXVzZSBUZXJtaW5hdGUgd2FzIGFscmVhZHkgY2FsbGVkLicsXG4gICAgfSxcbiAgICAnMTExJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBUZXJtaW5hdGlvbiBGYWlsdXJlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIFRlcm1pbmF0ZSBmYWlsZWQgZm9yIGFuIHVua25vd24gcmVhc29uLicsXG4gICAgfSxcbiAgICAnMTEyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnVGVybWluYXRpb24gQmVmb3JlIEluaXRpYWxpemF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIFRlcm1pbmF0ZSBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBiZWZvcmUgdGhlIGNhbGwgdG8gSW5pdGlhbGl6ZS4nLFxuICAgIH0sXG4gICAgJzExMyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1Rlcm1pbmF0aW9uIEFmdGVyIFRlcm1pbmF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIFRlcm1pbmF0ZSBmYWlsZWQgYmVjYXVzZSBUZXJtaW5hdGUgd2FzIGFscmVhZHkgY2FsbGVkLicsXG4gICAgfSxcbiAgICAnMTIyJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnUmV0cmlldmUgRGF0YSBCZWZvcmUgSW5pdGlhbGl6YXRpb24nLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0NhbGwgdG8gR2V0VmFsdWUgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYmVmb3JlIHRoZSBjYWxsIHRvIEluaXRpYWxpemUuJyxcbiAgICB9LFxuICAgICcxMjMnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdSZXRyaWV2ZSBEYXRhIEFmdGVyIFRlcm1pbmF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIEdldFZhbHVlIGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGFmdGVyIHRoZSBjYWxsIHRvIFRlcm1pbmF0ZS4nLFxuICAgIH0sXG4gICAgJzEzMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1N0b3JlIERhdGEgQmVmb3JlIEluaXRpYWxpemF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIFNldFZhbHVlIGZhaWxlZCBiZWNhdXNlIGl0IHdhcyBtYWRlIGJlZm9yZSB0aGUgY2FsbCB0byBJbml0aWFsaXplLicsXG4gICAgfSxcbiAgICAnMTMzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnU3RvcmUgRGF0YSBBZnRlciBUZXJtaW5hdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBTZXRWYWx1ZSBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBhZnRlciB0aGUgY2FsbCB0byBUZXJtaW5hdGUuJyxcbiAgICB9LFxuICAgICcxNDInOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdDb21taXQgQmVmb3JlIEluaXRpYWxpemF0aW9uJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdDYWxsIHRvIENvbW1pdCBmYWlsZWQgYmVjYXVzZSBpdCB3YXMgbWFkZSBiZWZvcmUgdGhlIGNhbGwgdG8gSW5pdGlhbGl6ZS4nLFxuICAgIH0sXG4gICAgJzE0Myc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0NvbW1pdCBBZnRlciBUZXJtaW5hdGlvbicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQ2FsbCB0byBDb21taXQgZmFpbGVkIGJlY2F1c2UgaXQgd2FzIG1hZGUgYWZ0ZXIgdGhlIGNhbGwgdG8gVGVybWluYXRlLicsXG4gICAgfSxcbiAgICAnMjAxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBBcmd1bWVudCBFcnJvcicsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQW4gaW52YWxpZCBhcmd1bWVudCB3YXMgcGFzc2VkIHRvIGFuIEFQSSBtZXRob2QgKHVzdWFsbHkgaW5kaWNhdGVzIHRoYXQgSW5pdGlhbGl6ZSwgQ29tbWl0IG9yIFRlcm1pbmF0ZSBkaWQgbm90IHJlY2VpdmUgdGhlIGV4cGVjdGVkIGVtcHR5IHN0cmluZyBhcmd1bWVudC4nLFxuICAgIH0sXG4gICAgJzMwMSc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0dlbmVyYWwgR2V0IEZhaWx1cmUnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0luZGljYXRlcyBhIGZhaWxlZCBHZXRWYWx1ZSBjYWxsIHdoZXJlIG5vIG90aGVyIHNwZWNpZmljIGVycm9yIGNvZGUgaXMgYXBwbGljYWJsZS4gVXNlIEdldERpYWdub3N0aWMgZm9yIG1vcmUgaW5mb3JtYXRpb24uJyxcbiAgICB9LFxuICAgICczNTEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdHZW5lcmFsIFNldCBGYWlsdXJlJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdJbmRpY2F0ZXMgYSBmYWlsZWQgU2V0VmFsdWUgY2FsbCB3aGVyZSBubyBvdGhlciBzcGVjaWZpYyBlcnJvciBjb2RlIGlzIGFwcGxpY2FibGUuIFVzZSBHZXREaWFnbm9zdGljIGZvciBtb3JlIGluZm9ybWF0aW9uLicsXG4gICAgfSxcbiAgICAnMzkxJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnR2VuZXJhbCBDb21taXQgRmFpbHVyZScsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnSW5kaWNhdGVzIGEgZmFpbGVkIENvbW1pdCBjYWxsIHdoZXJlIG5vIG90aGVyIHNwZWNpZmljIGVycm9yIGNvZGUgaXMgYXBwbGljYWJsZS4gVXNlIEdldERpYWdub3N0aWMgZm9yIG1vcmUgaW5mb3JtYXRpb24uJyxcbiAgICB9LFxuICAgICc0MDEnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdVbmRlZmluZWQgRGF0YSBNb2RlbCBFbGVtZW50JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdUaGUgZGF0YSBtb2RlbCBlbGVtZW50IG5hbWUgcGFzc2VkIHRvIEdldFZhbHVlIG9yIFNldFZhbHVlIGlzIG5vdCBhIHZhbGlkIFNDT1JNIGRhdGEgbW9kZWwgZWxlbWVudC4nLFxuICAgIH0sXG4gICAgJzQwMic6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ1VuaW1wbGVtZW50ZWQgRGF0YSBNb2RlbCBFbGVtZW50JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdUaGUgZGF0YSBtb2RlbCBlbGVtZW50IGluZGljYXRlZCBpbiBhIGNhbGwgdG8gR2V0VmFsdWUgb3IgU2V0VmFsdWUgaXMgdmFsaWQsIGJ1dCB3YXMgbm90IGltcGxlbWVudGVkIGJ5IHRoaXMgTE1TLiBJbiBTQ09STSAyMDA0LCB0aGlzIGVycm9yIHdvdWxkIGluZGljYXRlIGFuIExNUyB0aGF0IGlzIG5vdCBmdWxseSBTQ09STSBjb25mb3JtYW50LicsXG4gICAgfSxcbiAgICAnNDAzJzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBFbGVtZW50IFZhbHVlIE5vdCBJbml0aWFsaXplZCcsXG4gICAgICBkZXRhaWxNZXNzYWdlOiAnQXR0ZW1wdCB0byByZWFkIGEgZGF0YSBtb2RlbCBlbGVtZW50IHRoYXQgaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkIGJ5IHRoZSBMTVMgb3IgdGhyb3VnaCBhIFNldFZhbHVlIGNhbGwuIFRoaXMgZXJyb3IgY29uZGl0aW9uIGlzIG9mdGVuIHJlYWNoZWQgZHVyaW5nIG5vcm1hbCBleGVjdXRpb24gb2YgYSBTQ08uJyxcbiAgICB9LFxuICAgICc0MDQnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdEYXRhIE1vZGVsIEVsZW1lbnQgSXMgUmVhZCBPbmx5JyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdTZXRWYWx1ZSB3YXMgY2FsbGVkIHdpdGggYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBjYW4gb25seSBiZSByZWFkLicsXG4gICAgfSxcbiAgICAnNDA1Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBFbGVtZW50IElzIFdyaXRlIE9ubHknLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ0dldFZhbHVlIHdhcyBjYWxsZWQgb24gYSBkYXRhIG1vZGVsIGVsZW1lbnQgdGhhdCBjYW4gb25seSBiZSB3cml0dGVuIHRvLicsXG4gICAgfSxcbiAgICAnNDA2Jzoge1xuICAgICAgYmFzaWNNZXNzYWdlOiAnRGF0YSBNb2RlbCBFbGVtZW50IFR5cGUgTWlzbWF0Y2gnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1NldFZhbHVlIHdhcyBjYWxsZWQgd2l0aCBhIHZhbHVlIHRoYXQgaXMgbm90IGNvbnNpc3RlbnQgd2l0aCB0aGUgZGF0YSBmb3JtYXQgb2YgdGhlIHN1cHBsaWVkIGRhdGEgbW9kZWwgZWxlbWVudC4nLFxuICAgIH0sXG4gICAgJzQwNyc6IHtcbiAgICAgIGJhc2ljTWVzc2FnZTogJ0RhdGEgTW9kZWwgRWxlbWVudCBWYWx1ZSBPdXQgT2YgUmFuZ2UnLFxuICAgICAgZGV0YWlsTWVzc2FnZTogJ1RoZSBudW1lcmljIHZhbHVlIHN1cHBsaWVkIHRvIGEgU2V0VmFsdWUgY2FsbCBpcyBvdXRzaWRlIG9mIHRoZSBudW1lcmljIHJhbmdlIGFsbG93ZWQgZm9yIHRoZSBzdXBwbGllZCBkYXRhIG1vZGVsIGVsZW1lbnQuJyxcbiAgICB9LFxuICAgICc0MDgnOiB7XG4gICAgICBiYXNpY01lc3NhZ2U6ICdEYXRhIE1vZGVsIERlcGVuZGVuY3kgTm90IEVzdGFibGlzaGVkJyxcbiAgICAgIGRldGFpbE1lc3NhZ2U6ICdTb21lIGRhdGEgbW9kZWwgZWxlbWVudHMgY2Fubm90IGJlIHNldCB1bnRpbCBhbm90aGVyIGRhdGEgbW9kZWwgZWxlbWVudCB3YXMgc2V0LiBUaGlzIGVycm9yIGNvbmRpdGlvbiBpbmRpY2F0ZXMgdGhhdCB0aGUgcHJlcmVxdWlzaXRlIGVsZW1lbnQgd2FzIG5vdCBzZXQgYmVmb3JlIHRoZSBkZXBlbmRlbnQgZWxlbWVudC4nLFxuICAgIH0sXG4gIH0sXG59O1xuIiwiLy8gQGZsb3dcbmV4cG9ydCBjb25zdCBlcnJvcl9jb2RlcyA9IHtcbiAgR0VORVJBTDogMTAxLFxuICBJTklUSUFMSVpBVElPTl9GQUlMRUQ6IDEwMSxcbiAgSU5JVElBTElaRUQ6IDEwMSxcbiAgVEVSTUlOQVRFRDogMTAxLFxuICBURVJNSU5BVElPTl9GQUlMVVJFOiAxMDEsXG4gIFRFUk1JTkFUSU9OX0JFRk9SRV9JTklUOiAxMDEsXG4gIE1VTFRJUExFX1RFUk1JTkFUSU9OOiAxMDEsXG4gIFJFVFJJRVZFX0JFRk9SRV9JTklUOiAxMDEsXG4gIFJFVFJJRVZFX0FGVEVSX1RFUk06IDEwMSxcbiAgU1RPUkVfQkVGT1JFX0lOSVQ6IDEwMSxcbiAgU1RPUkVfQUZURVJfVEVSTTogMTAxLFxuICBDT01NSVRfQkVGT1JFX0lOSVQ6IDEwMSxcbiAgQ09NTUlUX0FGVEVSX1RFUk06IDEwMSxcbiAgQVJHVU1FTlRfRVJST1I6IDEwMSxcbiAgQ0hJTERSRU5fRVJST1I6IDEwMSxcbiAgQ09VTlRfRVJST1I6IDEwMSxcbiAgR0VORVJBTF9HRVRfRkFJTFVSRTogMTAxLFxuICBHRU5FUkFMX1NFVF9GQUlMVVJFOiAxMDEsXG4gIEdFTkVSQUxfQ09NTUlUX0ZBSUxVUkU6IDEwMSxcbiAgVU5ERUZJTkVEX0RBVEFfTU9ERUw6IDEwMSxcbiAgVU5JTVBMRU1FTlRFRF9FTEVNRU5UOiAxMDEsXG4gIFZBTFVFX05PVF9JTklUSUFMSVpFRDogMTAxLFxuICBJTlZBTElEX1NFVF9WQUxVRTogMTAxLFxuICBSRUFEX09OTFlfRUxFTUVOVDogMTAxLFxuICBXUklURV9PTkxZX0VMRU1FTlQ6IDEwMSxcbiAgVFlQRV9NSVNNQVRDSDogMTAxLFxuICBWQUxVRV9PVVRfT0ZfUkFOR0U6IDEwMSxcbiAgREVQRU5ERU5DWV9OT1RfRVNUQUJMSVNIRUQ6IDEwMSxcbn07XG5cbmV4cG9ydCBjb25zdCBzY29ybTEyX2Vycm9yX2NvZGVzID0ge1xuICAuLi5lcnJvcl9jb2RlcywgLi4ue1xuICAgIFJFVFJJRVZFX0JFRk9SRV9JTklUOiAzMDEsXG4gICAgU1RPUkVfQkVGT1JFX0lOSVQ6IDMwMSxcbiAgICBDT01NSVRfQkVGT1JFX0lOSVQ6IDMwMSxcbiAgICBBUkdVTUVOVF9FUlJPUjogMjAxLFxuICAgIENISUxEUkVOX0VSUk9SOiAyMDIsXG4gICAgQ09VTlRfRVJST1I6IDIwMyxcbiAgICBVTkRFRklORURfREFUQV9NT0RFTDogNDAxLFxuICAgIFVOSU1QTEVNRU5URURfRUxFTUVOVDogNDAxLFxuICAgIFZBTFVFX05PVF9JTklUSUFMSVpFRDogMzAxLFxuICAgIElOVkFMSURfU0VUX1ZBTFVFOiA0MDIsXG4gICAgUkVBRF9PTkxZX0VMRU1FTlQ6IDQwMyxcbiAgICBXUklURV9PTkxZX0VMRU1FTlQ6IDQwNCxcbiAgICBUWVBFX01JU01BVENIOiA0MDUsXG4gICAgVkFMVUVfT1VUX09GX1JBTkdFOiA0MDcsXG4gICAgREVQRU5ERU5DWV9OT1RfRVNUQUJMSVNIRUQ6IDQwOCxcbiAgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBzY29ybTIwMDRfZXJyb3JfY29kZXMgPSB7XG4gIC4uLmVycm9yX2NvZGVzLCAuLi57XG4gICAgSU5JVElBTElaQVRJT05fRkFJTEVEOiAxMDIsXG4gICAgSU5JVElBTElaRUQ6IDEwMyxcbiAgICBURVJNSU5BVEVEOiAxMDQsXG4gICAgVEVSTUlOQVRJT05fRkFJTFVSRTogMTExLFxuICAgIFRFUk1JTkFUSU9OX0JFRk9SRV9JTklUOiAxMTIsXG4gICAgTVVMVElQTEVfVEVSTUlOQVRJT05TOiAxMTMsXG4gICAgUkVUUklFVkVfQkVGT1JFX0lOSVQ6IDEyMixcbiAgICBSRVRSSUVWRV9BRlRFUl9URVJNOiAxMjMsXG4gICAgU1RPUkVfQkVGT1JFX0lOSVQ6IDEzMixcbiAgICBTVE9SRV9BRlRFUl9URVJNOiAxMzMsXG4gICAgQ09NTUlUX0JFRk9SRV9JTklUOiAxNDIsXG4gICAgQ09NTUlUX0FGVEVSX1RFUk06IDE0MyxcbiAgICBBUkdVTUVOVF9FUlJPUjogMjAxLFxuICAgIEdFTkVSQUxfR0VUX0ZBSUxVUkU6IDMwMSxcbiAgICBHRU5FUkFMX1NFVF9GQUlMVVJFOiAzNTEsXG4gICAgR0VORVJBTF9DT01NSVRfRkFJTFVSRTogMzkxLFxuICAgIFVOREVGSU5FRF9EQVRBX01PREVMOiA0MDEsXG4gICAgVU5JTVBMRU1FTlRFRF9FTEVNRU5UOiA0MDIsXG4gICAgVkFMVUVfTk9UX0lOSVRJQUxJWkVEOiA0MDMsXG4gICAgUkVBRF9PTkxZX0VMRU1FTlQ6IDQwNCxcbiAgICBXUklURV9PTkxZX0VMRU1FTlQ6IDQwNSxcbiAgICBUWVBFX01JU01BVENIOiA0MDYsXG4gICAgVkFMVUVfT1VUX09GX1JBTkdFOiA0MDcsXG4gICAgREVQRU5ERU5DWV9OT1RfRVNUQUJMSVNIRUQ6IDQwOCxcbiAgfSxcbn07XG4iLCJjb25zdCBjb21tb25fdmFsdWVzID0ge1xuICB2YWxpZFJlc3VsdDogW1xuICAgICdjb3JyZWN0JyxcbiAgICAnd3JvbmcnLFxuICAgICd1bmFudGljaXBhdGVkJyxcbiAgICAnbmV1dHJhbCcsXG4gIF0sXG4gIGludmFsaWRSZXN1bHQ6IFtcbiAgICAnLTEwMDAwJyxcbiAgICAnMTAwMDAnLFxuICAgICdpbnZhbGlkJyxcbiAgXSxcblxuICB2YWxpZDBUbzFSYW5nZTogW1xuICAgICcwLjAnLFxuICAgICcwLjI1JyxcbiAgICAnMC41JyxcbiAgICAnMS4wJyxcbiAgXSxcbiAgaW52YWxpZDBUbzFSYW5nZTogW1xuICAgICctMScsXG4gICAgJy0wLjEnLFxuICAgICcxLjEnLFxuICAgICcuMjUnLFxuICBdLFxuXG4gIHZhbGlkMFRvMTAwUmFuZ2U6IFtcbiAgICAnMScsXG4gICAgJzUwJyxcbiAgICAnMTAwJyxcbiAgXSxcbiAgaW52YWxpZDBUbzEwMFJhbmdlOiBbXG4gICAgJ2ludmFsaWQnLFxuICAgICdhMTAwJyxcbiAgICAnLTEnLFxuICBdLFxuXG4gIHZhbGlkU2NhbGVkUmFuZ2U6IFtcbiAgICAnMScsXG4gICAgJzAuNScsXG4gICAgJzAnLFxuICAgICctMC41JyxcbiAgICAnLTEnLFxuICBdLFxuICBpbnZhbGlkU2NhbGVkUmFuZ2U6IFtcbiAgICAnLTEwMScsXG4gICAgJzI1LjEnLFxuICAgICc1MC41JyxcbiAgICAnNzUnLFxuICAgICcxMDAnLFxuICBdLFxuXG4gIHZhbGlkSW50ZWdlclNjYWxlZFJhbmdlOiBbXG4gICAgJzEnLFxuICAgICcwJyxcbiAgICAnLTEnLFxuICBdLFxuICBpbnZhbGlkSW50ZWdlclNjYWxlZFJhbmdlOiBbXG4gICAgJy0xMDEnLFxuICAgICctMC41JyxcbiAgICAnMC41JyxcbiAgICAnMjUuMScsXG4gICAgJzUwLjUnLFxuICAgICc3NScsXG4gICAgJzEwMCcsXG4gIF0sXG59O1xuXG5leHBvcnQgY29uc3Qgc2Nvcm0xMl92YWx1ZXMgPSB7XG4gIC4uLmNvbW1vbl92YWx1ZXMsIC4uLntcbiAgICB2YWxpZExlc3NvblN0YXR1czogW1xuICAgICAgJ3Bhc3NlZCcsXG4gICAgICAnY29tcGxldGVkJyxcbiAgICAgICdmYWlsZWQnLFxuICAgICAgJ2luY29tcGxldGUnLFxuICAgICAgJ2Jyb3dzZWQnLFxuICAgIF0sXG4gICAgaW52YWxpZExlc3NvblN0YXR1czogW1xuICAgICAgJ1Bhc3NlZCcsXG4gICAgICAnUCcsXG4gICAgICAnRicsXG4gICAgICAncCcsXG4gICAgICAndHJ1ZScsXG4gICAgICAnZmFsc2UnLFxuICAgICAgJ2NvbXBsZXRlJyxcbiAgICBdLFxuXG4gICAgdmFsaWRFeGl0OiBbXG4gICAgICAndGltZS1vdXQnLFxuICAgICAgJ3N1c3BlbmQnLFxuICAgICAgJ2xvZ291dCcsXG4gICAgXSxcbiAgICBpbnZhbGlkRXhpdDogW1xuICAgICAgJ2Nsb3NlJyxcbiAgICAgICdleGl0JyxcbiAgICAgICdjcmFzaCcsXG4gICAgXSxcblxuICAgIHZhbGlkVHlwZTogW1xuICAgICAgJ3RydWUtZmFsc2UnLFxuICAgICAgJ2Nob2ljZScsXG4gICAgICAnZmlsbC1pbicsXG4gICAgICAnbWF0Y2hpbmcnLFxuICAgICAgJ3BlcmZvcm1hbmNlJyxcbiAgICAgICdzZXF1ZW5jaW5nJyxcbiAgICAgICdsaWtlcnQnLFxuICAgICAgJ251bWVyaWMnLFxuICAgIF0sXG4gICAgaW52YWxpZFR5cGU6IFtcbiAgICAgICdjb3JyZWN0JyxcbiAgICAgICd3cm9uZycsXG4gICAgICAnbG9nb3V0JyxcbiAgICBdLFxuXG4gICAgdmFsaWRTcGVlZFJhbmdlOiBbXG4gICAgICAnMScsXG4gICAgICAnNTAnLFxuICAgICAgJzEwMCcsXG4gICAgICAnLTEnLFxuICAgICAgJy01MCcsXG4gICAgICAnLTEwMCcsXG4gICAgXSxcbiAgICBpbnZhbGlkU3BlZWRSYW5nZTogW1xuICAgICAgJ2ludmFsaWQnLFxuICAgICAgJ2ExMDAnLFxuICAgICAgJy0xMDEnLFxuICAgICAgJzEwMScsXG4gICAgICAnLTEwMDAwMCcsXG4gICAgICAnMTAwMDAwJyxcbiAgICBdLFxuXG4gICAgdmFsaWRTY29yZVJhbmdlOiBbXG4gICAgICAnMScsXG4gICAgICAnNTAuMjUnLFxuICAgICAgJzEwMCcsXG4gICAgXSxcbiAgICBpbnZhbGlkU2NvcmVSYW5nZTogW1xuICAgICAgJ2ludmFsaWQnLFxuICAgICAgJ2ExMDAnLFxuICAgICAgJy0xJyxcbiAgICAgICcxMDEnLFxuICAgICAgJy0xMDAwMDAnLFxuICAgICAgJzEwMDAwMCcsXG4gICAgXSxcbiAgICBpbnZhbGlkMFRvMTAwUmFuZ2U6IFtcbiAgICAgICdpbnZhbGlkJyxcbiAgICAgICdhMTAwJyxcbiAgICAgICctMicsXG4gICAgXSxcblxuICAgIHZhbGlkVGltZTogW1xuICAgICAgJzEwOjA2OjU3JyxcbiAgICAgICcyMzo1OTo1OScsXG4gICAgICAnMDA6MDA6MDAnLFxuICAgIF0sXG4gICAgaW52YWxpZFRpbWU6IFtcbiAgICAgICc0Nzo1OTo1OScsXG4gICAgICAnMDA6MDA6MDEuNTYnLFxuICAgICAgJzA2OjU6MTMnLFxuICAgICAgJzIzOjU5OjU5LjEyMycsXG4gICAgICAnUDFEVDIzSDU5TTU5UycsXG4gICAgXSxcblxuICAgIHZhbGlkVGltZXN0YW1wOiBbXG4gICAgICAnMTA6MDY6NTcnLFxuICAgICAgJzAwOjAwOjAxLjU2JyxcbiAgICAgICcyMzo1OTo1OScsXG4gICAgICAnNDc6NTk6NTknLFxuICAgIF0sXG4gICAgaW52YWxpZFRpbWVzdGFtcDogW1xuICAgICAgJzA2OjU6MTMnLFxuICAgICAgJzIzOjU5OjU5LjEyMycsXG4gICAgICAnUDFEVDIzSDU5TTU5UycsXG4gICAgXSxcbiAgfSxcbn07XG5cbmV4cG9ydCBjb25zdCBzY29ybTIwMDRfdmFsdWVzID0ge1xuICAuLi5jb21tb25fdmFsdWVzLCAuLi57XG4gICAgLy8gdmFsaWQgZmllbGQgdmFsdWVzXG4gICAgdmFsaWRUaW1lc3RhbXBzOiBbXG4gICAgICAnMjAxOS0wNi0yNScsXG4gICAgICAnMjAxOS0wNi0yNVQyMzo1OScsXG4gICAgICAnMjAxOS0wNi0yNVQyMzo1OTo1OS45OScsXG4gICAgICAnMTk3MC0wMS0wMScsXG4gICAgXSxcbiAgICBpbnZhbGlkVGltZXN0YW1wczogW1xuICAgICAgJzIwMTktMDYtMjVUJyxcbiAgICAgICcyMDE5LTA2LTI1VDIzOjU5OjU5Ljk5OScsXG4gICAgICAnMjAxOS0wNi0yNVQyNTo1OTo1OS45OScsXG4gICAgICAnMjAxOS0xMy0zMScsXG4gICAgICAnMTk2OS0xMi0zMScsXG4gICAgICAnLTAwOjAwOjMwJyxcbiAgICAgICcwOjUwOjMwJyxcbiAgICAgICcyMzowMDozMC4nLFxuICAgIF0sXG5cbiAgICB2YWxpZENTdGF0dXM6IFtcbiAgICAgICdjb21wbGV0ZWQnLFxuICAgICAgJ2luY29tcGxldGUnLFxuICAgICAgJ25vdCBhdHRlbXB0ZWQnLFxuICAgICAgJ3Vua25vd24nLFxuICAgIF0sXG4gICAgaW52YWxpZENTdGF0dXM6IFtcbiAgICAgICdjb21wbGV0ZScsXG4gICAgICAncGFzc2VkJyxcbiAgICAgICdmYWlsZWQnLFxuICAgIF0sXG5cbiAgICB2YWxpZFNTdGF0dXM6IFtcbiAgICAgICdwYXNzZWQnLFxuICAgICAgJ2ZhaWxlZCcsXG4gICAgICAndW5rbm93bicsXG4gICAgXSxcbiAgICBpbnZhbGlkU1N0YXR1czogW1xuICAgICAgJ2NvbXBsZXRlJyxcbiAgICAgICdpbmNvbXBsZXRlJyxcbiAgICAgICdQJyxcbiAgICAgICdmJyxcbiAgICBdLFxuXG4gICAgdmFsaWRFeGl0OiBbXG4gICAgICAndGltZS1vdXQnLFxuICAgICAgJ3N1c3BlbmQnLFxuICAgICAgJ2xvZ291dCcsXG4gICAgICAnbm9ybWFsJyxcbiAgICBdLFxuICAgIGludmFsaWRFeGl0OiBbXG4gICAgICAnY2xvc2UnLFxuICAgICAgJ2V4aXQnLFxuICAgICAgJ2NyYXNoJyxcbiAgICBdLFxuXG4gICAgdmFsaWRUeXBlOiBbXG4gICAgICAndHJ1ZS1mYWxzZScsXG4gICAgICAnY2hvaWNlJyxcbiAgICAgICdmaWxsLWluJyxcbiAgICAgICdsb25nLWZpbGwtaW4nLFxuICAgICAgJ21hdGNoaW5nJyxcbiAgICAgICdwZXJmb3JtYW5jZScsXG4gICAgICAnc2VxdWVuY2luZycsXG4gICAgICAnbGlrZXJ0JyxcbiAgICAgICdudW1lcmljJyxcbiAgICAgICdvdGhlcicsXG4gICAgXSxcbiAgICBpbnZhbGlkVHlwZTogW1xuICAgICAgJ2NvcnJlY3QnLFxuICAgICAgJ3dyb25nJyxcbiAgICAgICdsb2dvdXQnLFxuICAgIF0sXG5cbiAgICB2YWxpZFNjb3JlUmFuZ2U6IFtcbiAgICAgICcxJyxcbiAgICAgICc1MCcsXG4gICAgICAnMTAwJyxcbiAgICAgICctMTAwMDAnLFxuICAgICAgJy0xJyxcbiAgICAgICcxMDAwMCcsXG4gICAgXSxcbiAgICBpbnZhbGlkU2NvcmVSYW5nZTogW1xuICAgICAgJ2ludmFsaWQnLFxuICAgICAgJ2ExMDAnLFxuICAgICAgJy0xMDAwMDAnLFxuICAgICAgJzEwMDAwMCcsXG4gICAgXSxcblxuICAgIHZhbGlkSVNPODYwMUR1cmF0aW9uczogW1xuICAgICAgJ1AxWTM0RFQyM0g0NU0xNVMnLFxuICAgICAgJ1BUMU00NVMnLFxuICAgICAgJ1AwUycsXG4gICAgICAnUFQ3NU0nLFxuICAgIF0sXG4gICAgaW52YWxpZElTTzg2MDFEdXJhdGlvbnM6IFtcbiAgICAgICcwMDowODo0NScsXG4gICAgICAnLVAxSCcsXG4gICAgICAnMXk0NUQnLFxuICAgICAgJzAnLFxuICAgIF0sXG5cbiAgICB2YWxpZENvbW1lbnQ6IFtcbiAgICAgICd7bGFuZz1lbi05OH0gbGVhcm5lciBjb21tZW50JyxcbiAgICAgICd7bGFuZz1lbmctOTgtOX0gbGVhcm5lciBjb21tZW50JyxcbiAgICAgICd7bGFuZz1lbmctOTgtOWZoZ2p9JyArICd4Jy5yZXBlYXQoNDAwMCksXG4gICAgICAnbGVhcm5lciBjb21tZW50JyxcbiAgICAgICdsZWFybmVyIGNvbW1lbnR9JyxcbiAgICAgICd7bGFuZz1pLXh4fScsXG4gICAgICAne2xhbmc9aX0nLFxuICAgICAgJycsXG4gICAgXSxcbiAgICBpbnZhbGlkQ29tbWVudDogW1xuICAgICAgJ3tsYW5nPWktfScsXG4gICAgICAne2xhbmc9aS14fScsXG4gICAgICAne2xhbmc9ZW5nLTk4LTlmaGdqfXsgbGVhcm5lciBjb21tZW50JyxcbiAgICAgICd7bGVhcm5lciBjb21tZW50JyxcbiAgICAgICd7bGFuZz1lbmctOTgtOWZoZ2p9JyArICd4Jy5yZXBlYXQoNDAwMSksXG4gICAgICAne2xhbmc9ZW5nLTk4LTlmaGdqfXsnICsgJ3gnLnJlcGVhdCgzOTk5KSxcbiAgICBdLFxuXG4gICAgdmFsaWREZXNjcmlwdGlvbjogW1xuICAgICAgJ3tsYW5nPWVuLTk4fSBsZWFybmVyIGNvbW1lbnQnLFxuICAgICAgJ3tsYW5nPWVuZy05OC05fSBsZWFybmVyIGNvbW1lbnQnLFxuICAgICAgJ3tsYW5nPWVuZy05OC05Zmhnan0nICsgJ3gnLnJlcGVhdCgyNTApLFxuICAgICAgJ2xlYXJuZXIgY29tbWVudCcsXG4gICAgICAnbGVhcm5lciBjb21tZW50fScsXG4gICAgICAne2xhbmc9aS14eH0nLFxuICAgICAgJ3tsYW5nPWl9JyxcbiAgICAgICcnLFxuICAgIF0sXG4gICAgaW52YWxpZERlc2NyaXB0aW9uOiBbXG4gICAgICAne2xhbmc9aS19JyxcbiAgICAgICd7bGFuZz1pLXh9JyxcbiAgICAgICd7bGFuZz1lbmctOTgtOWZoZ2p9eyBsZWFybmVyIGNvbW1lbnQnLFxuICAgICAgJ3tsZWFybmVyIGNvbW1lbnQnLFxuICAgICAgJ3tsYW5nPWVuZy05OC05Zmhnan0nICsgJ3gnLnJlcGVhdCgyNTEpLFxuICAgICAgJ3tsYW5nPWVuZy05OC05Zmhnan17JyArICd4Jy5yZXBlYXQoMjQ5KSxcbiAgICBdLFxuXG4gICAgdmFsaWROYXZSZXF1ZXN0OiBbXG4gICAgICAncHJldmlvdXMnLFxuICAgICAgJ2NvbnRpbnVlJyxcbiAgICAgICdleGl0JyxcbiAgICAgICdleGl0QWxsJyxcbiAgICAgICdhYmFuZG9uJyxcbiAgICAgICdhYmFuZG9uQWxsJyxcbiAgICAgICdzdXNwZW5kQWxsJyxcbiAgICBdLFxuICAgIGludmFsaWROYXZSZXF1ZXN0OiBbXG4gICAgICAnY2xvc2UnLFxuICAgICAgJ3F1aXQnLFxuICAgICAgJ25leHQnLFxuICAgICAgJ2JlZm9yZScsXG4gICAgXSxcbiAgfSxcbn07XG4iLCJleHBvcnQgY29uc3QgdmFsaWRfbGFuZ3VhZ2VzID0ge1xuICAnYWEnOiAnYWEnLCAnYWInOiAnYWInLCAnYWUnOiAnYWUnLCAnYWYnOiAnYWYnLCAnYWsnOiAnYWsnLCAnYW0nOiAnYW0nLFxuICAnYW4nOiAnYW4nLCAnYXInOiAnYXInLCAnYXMnOiAnYXMnLCAnYXYnOiAnYXYnLCAnYXknOiAnYXknLCAnYXonOiAnYXonLFxuICAnYmEnOiAnYmEnLCAnYmUnOiAnYmUnLCAnYmcnOiAnYmcnLCAnYmgnOiAnYmgnLCAnYmknOiAnYmknLCAnYm0nOiAnYm0nLFxuICAnYm4nOiAnYm4nLCAnYm8nOiAnYm8nLCAnYnInOiAnYnInLCAnYnMnOiAnYnMnLCAnY2EnOiAnY2EnLCAnY2UnOiAnY2UnLFxuICAnY2gnOiAnY2gnLCAnY28nOiAnY28nLCAnY3InOiAnY3InLCAnY3MnOiAnY3MnLCAnY3UnOiAnY3UnLCAnY3YnOiAnY3YnLFxuICAnY3knOiAnY3knLCAnZGEnOiAnZGEnLCAnZGUnOiAnZGUnLCAnZHYnOiAnZHYnLCAnZHonOiAnZHonLCAnZWUnOiAnZWUnLFxuICAnZWwnOiAnZWwnLCAnZW4nOiAnZW4nLCAnZW8nOiAnZW8nLCAnZXMnOiAnZXMnLCAnZXQnOiAnZXQnLCAnZXUnOiAnZXUnLFxuICAnZmEnOiAnZmEnLCAnZmYnOiAnZmYnLCAnZmknOiAnZmknLCAnZmonOiAnZmonLCAnZm8nOiAnZm8nLCAnZnInOiAnZnInLFxuICAnZnknOiAnZnknLCAnZ2EnOiAnZ2EnLCAnZ2QnOiAnZ2QnLCAnZ2wnOiAnZ2wnLCAnZ24nOiAnZ24nLCAnZ3UnOiAnZ3UnLFxuICAnZ3YnOiAnZ3YnLCAnaGEnOiAnaGEnLCAnaGUnOiAnaGUnLCAnaGknOiAnaGknLCAnaG8nOiAnaG8nLCAnaHInOiAnaHInLFxuICAnaHQnOiAnaHQnLCAnaHUnOiAnaHUnLCAnaHknOiAnaHknLCAnaHonOiAnaHonLCAnaWEnOiAnaWEnLCAnaWQnOiAnaWQnLFxuICAnaWUnOiAnaWUnLCAnaWcnOiAnaWcnLCAnaWknOiAnaWknLCAnaWsnOiAnaWsnLCAnaW8nOiAnaW8nLCAnaXMnOiAnaXMnLFxuICAnaXQnOiAnaXQnLCAnaXUnOiAnaXUnLCAnamEnOiAnamEnLCAnanYnOiAnanYnLCAna2EnOiAna2EnLCAna2cnOiAna2cnLFxuICAna2knOiAna2knLCAna2onOiAna2onLCAna2snOiAna2snLCAna2wnOiAna2wnLCAna20nOiAna20nLCAna24nOiAna24nLFxuICAna28nOiAna28nLCAna3InOiAna3InLCAna3MnOiAna3MnLCAna3UnOiAna3UnLCAna3YnOiAna3YnLCAna3cnOiAna3cnLFxuICAna3knOiAna3knLCAnbGEnOiAnbGEnLCAnbGInOiAnbGInLCAnbGcnOiAnbGcnLCAnbGknOiAnbGknLCAnbG4nOiAnbG4nLFxuICAnbG8nOiAnbG8nLCAnbHQnOiAnbHQnLCAnbHUnOiAnbHUnLCAnbHYnOiAnbHYnLCAnbWcnOiAnbWcnLCAnbWgnOiAnbWgnLFxuICAnbWknOiAnbWknLCAnbWsnOiAnbWsnLCAnbWwnOiAnbWwnLCAnbW4nOiAnbW4nLCAnbW8nOiAnbW8nLCAnbXInOiAnbXInLFxuICAnbXMnOiAnbXMnLCAnbXQnOiAnbXQnLCAnbXknOiAnbXknLCAnbmEnOiAnbmEnLCAnbmInOiAnbmInLCAnbmQnOiAnbmQnLFxuICAnbmUnOiAnbmUnLCAnbmcnOiAnbmcnLCAnbmwnOiAnbmwnLCAnbm4nOiAnbm4nLCAnbm8nOiAnbm8nLCAnbnInOiAnbnInLFxuICAnbnYnOiAnbnYnLCAnbnknOiAnbnknLCAnb2MnOiAnb2MnLCAnb2onOiAnb2onLCAnb20nOiAnb20nLCAnb3InOiAnb3InLFxuICAnb3MnOiAnb3MnLCAncGEnOiAncGEnLCAncGknOiAncGknLCAncGwnOiAncGwnLCAncHMnOiAncHMnLCAncHQnOiAncHQnLFxuICAncXUnOiAncXUnLCAncm0nOiAncm0nLCAncm4nOiAncm4nLCAncm8nOiAncm8nLCAncnUnOiAncnUnLCAncncnOiAncncnLFxuICAnc2EnOiAnc2EnLCAnc2MnOiAnc2MnLCAnc2QnOiAnc2QnLCAnc2UnOiAnc2UnLCAnc2cnOiAnc2cnLCAnc2gnOiAnc2gnLFxuICAnc2knOiAnc2knLCAnc2snOiAnc2snLCAnc2wnOiAnc2wnLCAnc20nOiAnc20nLCAnc24nOiAnc24nLCAnc28nOiAnc28nLFxuICAnc3EnOiAnc3EnLCAnc3InOiAnc3InLCAnc3MnOiAnc3MnLCAnc3QnOiAnc3QnLCAnc3UnOiAnc3UnLCAnc3YnOiAnc3YnLFxuICAnc3cnOiAnc3cnLCAndGEnOiAndGEnLCAndGUnOiAndGUnLCAndGcnOiAndGcnLCAndGgnOiAndGgnLCAndGknOiAndGknLFxuICAndGsnOiAndGsnLCAndGwnOiAndGwnLCAndG4nOiAndG4nLCAndG8nOiAndG8nLCAndHInOiAndHInLCAndHMnOiAndHMnLFxuICAndHQnOiAndHQnLCAndHcnOiAndHcnLCAndHknOiAndHknLCAndWcnOiAndWcnLCAndWsnOiAndWsnLCAndXInOiAndXInLFxuICAndXonOiAndXonLCAndmUnOiAndmUnLCAndmknOiAndmknLCAndm8nOiAndm8nLCAnd2EnOiAnd2EnLCAnd28nOiAnd28nLFxuICAneGgnOiAneGgnLCAneWknOiAneWknLCAneW8nOiAneW8nLCAnemEnOiAnemEnLCAnemgnOiAnemgnLCAnenUnOiAnenUnLFxuICAnYWFyJzogJ2FhcicsICdhYmsnOiAnYWJrJywgJ2F2ZSc6ICdhdmUnLCAnYWZyJzogJ2FmcicsICdha2EnOiAnYWthJyxcbiAgJ2FtaCc6ICdhbWgnLCAnYXJnJzogJ2FyZycsICdhcmEnOiAnYXJhJywgJ2FzbSc6ICdhc20nLCAnYXZhJzogJ2F2YScsXG4gICdheW0nOiAnYXltJywgJ2F6ZSc6ICdhemUnLCAnYmFrJzogJ2JhaycsICdiZWwnOiAnYmVsJywgJ2J1bCc6ICdidWwnLFxuICAnYmloJzogJ2JpaCcsICdiaXMnOiAnYmlzJywgJ2JhbSc6ICdiYW0nLCAnYmVuJzogJ2JlbicsICd0aWInOiAndGliJyxcbiAgJ2JvZCc6ICdib2QnLCAnYnJlJzogJ2JyZScsICdib3MnOiAnYm9zJywgJ2NhdCc6ICdjYXQnLCAnY2hlJzogJ2NoZScsXG4gICdjaGEnOiAnY2hhJywgJ2Nvcyc6ICdjb3MnLCAnY3JlJzogJ2NyZScsICdjemUnOiAnY3plJywgJ2Nlcyc6ICdjZXMnLFxuICAnY2h1JzogJ2NodScsICdjaHYnOiAnY2h2JywgJ3dlbCc6ICd3ZWwnLCAnY3ltJzogJ2N5bScsICdkYW4nOiAnZGFuJyxcbiAgJ2dlcic6ICdnZXInLCAnZGV1JzogJ2RldScsICdkaXYnOiAnZGl2JywgJ2R6byc6ICdkem8nLCAnZXdlJzogJ2V3ZScsXG4gICdncmUnOiAnZ3JlJywgJ2VsbCc6ICdlbGwnLCAnZW5nJzogJ2VuZycsICdlcG8nOiAnZXBvJywgJ3NwYSc6ICdzcGEnLFxuICAnZXN0JzogJ2VzdCcsICdiYXEnOiAnYmFxJywgJ2V1cyc6ICdldXMnLCAncGVyJzogJ3BlcicsICdmYXMnOiAnZmFzJyxcbiAgJ2Z1bCc6ICdmdWwnLCAnZmluJzogJ2ZpbicsICdmaWonOiAnZmlqJywgJ2Zhbyc6ICdmYW8nLCAnZnJlJzogJ2ZyZScsXG4gICdmcmEnOiAnZnJhJywgJ2ZyeSc6ICdmcnknLCAnZ2xlJzogJ2dsZScsICdnbGEnOiAnZ2xhJywgJ2dsZyc6ICdnbGcnLFxuICAnZ3JuJzogJ2dybicsICdndWonOiAnZ3VqJywgJ2dsdic6ICdnbHYnLCAnaGF1JzogJ2hhdScsICdoZWInOiAnaGViJyxcbiAgJ2hpbic6ICdoaW4nLCAnaG1vJzogJ2htbycsICdocnYnOiAnaHJ2JywgJ2hhdCc6ICdoYXQnLCAnaHVuJzogJ2h1bicsXG4gICdhcm0nOiAnYXJtJywgJ2h5ZSc6ICdoeWUnLCAnaGVyJzogJ2hlcicsICdpbmEnOiAnaW5hJywgJ2luZCc6ICdpbmQnLFxuICAnaWxlJzogJ2lsZScsICdpYm8nOiAnaWJvJywgJ2lpaSc6ICdpaWknLCAnaXBrJzogJ2lwaycsICdpZG8nOiAnaWRvJyxcbiAgJ2ljZSc6ICdpY2UnLCAnaXNsJzogJ2lzbCcsICdpdGEnOiAnaXRhJywgJ2lrdSc6ICdpa3UnLCAnanBuJzogJ2pwbicsXG4gICdqYXYnOiAnamF2JywgJ2dlbyc6ICdnZW8nLCAna2F0JzogJ2thdCcsICdrb24nOiAna29uJywgJ2tpayc6ICdraWsnLFxuICAna3VhJzogJ2t1YScsICdrYXonOiAna2F6JywgJ2thbCc6ICdrYWwnLCAna2htJzogJ2tobScsICdrYW4nOiAna2FuJyxcbiAgJ2tvcic6ICdrb3InLCAna2F1JzogJ2thdScsICdrYXMnOiAna2FzJywgJ2t1cic6ICdrdXInLCAna29tJzogJ2tvbScsXG4gICdjb3InOiAnY29yJywgJ2tpcic6ICdraXInLCAnbGF0JzogJ2xhdCcsICdsdHonOiAnbHR6JywgJ2x1Zyc6ICdsdWcnLFxuICAnbGltJzogJ2xpbScsICdsaW4nOiAnbGluJywgJ2xhbyc6ICdsYW8nLCAnbGl0JzogJ2xpdCcsICdsdWInOiAnbHViJyxcbiAgJ2xhdic6ICdsYXYnLCAnbWxnJzogJ21sZycsICdtYWgnOiAnbWFoJywgJ21hbyc6ICdtYW8nLCAnbXJpJzogJ21yaScsXG4gICdtYWMnOiAnbWFjJywgJ21rZCc6ICdta2QnLCAnbWFsJzogJ21hbCcsICdtb24nOiAnbW9uJywgJ21vbCc6ICdtb2wnLFxuICAnbWFyJzogJ21hcicsICdtYXknOiAnbWF5JywgJ21zYSc6ICdtc2EnLCAnbWx0JzogJ21sdCcsICdidXInOiAnYnVyJyxcbiAgJ215YSc6ICdteWEnLCAnbmF1JzogJ25hdScsICdub2InOiAnbm9iJywgJ25kZSc6ICduZGUnLCAnbmVwJzogJ25lcCcsXG4gICduZG8nOiAnbmRvJywgJ2R1dCc6ICdkdXQnLCAnbmxkJzogJ25sZCcsICdubm8nOiAnbm5vJywgJ25vcic6ICdub3InLFxuICAnbmJsJzogJ25ibCcsICduYXYnOiAnbmF2JywgJ255YSc6ICdueWEnLCAnb2NpJzogJ29jaScsICdvamknOiAnb2ppJyxcbiAgJ29ybSc6ICdvcm0nLCAnb3JpJzogJ29yaScsICdvc3MnOiAnb3NzJywgJ3Bhbic6ICdwYW4nLCAncGxpJzogJ3BsaScsXG4gICdwb2wnOiAncG9sJywgJ3B1cyc6ICdwdXMnLCAncG9yJzogJ3BvcicsICdxdWUnOiAncXVlJywgJ3JvaCc6ICdyb2gnLFxuICAncnVuJzogJ3J1bicsICdydW0nOiAncnVtJywgJ3Jvbic6ICdyb24nLCAncnVzJzogJ3J1cycsICdraW4nOiAna2luJyxcbiAgJ3Nhbic6ICdzYW4nLCAnc3JkJzogJ3NyZCcsICdzbmQnOiAnc25kJywgJ3NtZSc6ICdzbWUnLCAnc2FnJzogJ3NhZycsXG4gICdzbG8nOiAnc2xvJywgJ3Npbic6ICdzaW4nLCAnc2xrJzogJ3NsaycsICdzbHYnOiAnc2x2JywgJ3Ntbyc6ICdzbW8nLFxuICAnc25hJzogJ3NuYScsICdzb20nOiAnc29tJywgJ2FsYic6ICdhbGInLCAnc3FpJzogJ3NxaScsICdzcnAnOiAnc3JwJyxcbiAgJ3Nzdyc6ICdzc3cnLCAnc290JzogJ3NvdCcsICdzdW4nOiAnc3VuJywgJ3N3ZSc6ICdzd2UnLCAnc3dhJzogJ3N3YScsXG4gICd0YW0nOiAndGFtJywgJ3RlbCc6ICd0ZWwnLCAndGdrJzogJ3RnaycsICd0aGEnOiAndGhhJywgJ3Rpcic6ICd0aXInLFxuICAndHVrJzogJ3R1aycsICd0Z2wnOiAndGdsJywgJ3Rzbic6ICd0c24nLCAndG9uJzogJ3RvbicsICd0dXInOiAndHVyJyxcbiAgJ3Rzbyc6ICd0c28nLCAndGF0JzogJ3RhdCcsICd0d2knOiAndHdpJywgJ3RhaCc6ICd0YWgnLCAndWlnJzogJ3VpZycsXG4gICd1a3InOiAndWtyJywgJ3VyZCc6ICd1cmQnLCAndXpiJzogJ3V6YicsICd2ZW4nOiAndmVuJywgJ3ZpZSc6ICd2aWUnLFxuICAndm9sJzogJ3ZvbCcsICd3bG4nOiAnd2xuJywgJ3dvbCc6ICd3b2wnLCAneGhvJzogJ3hobycsICd5aWQnOiAneWlkJyxcbiAgJ3lvcic6ICd5b3InLCAnemhhJzogJ3poYScsICdjaGknOiAnY2hpJywgJ3pobyc6ICd6aG8nLCAnenVsJzogJ3p1bCcsXG59O1xuIiwiLy8gQGZsb3dcblxuaW1wb3J0IHtzY29ybTEyX3ZhbHVlcywgc2Nvcm0yMDA0X3ZhbHVlc30gZnJvbSAnLi9maWVsZF92YWx1ZXMnO1xuXG5leHBvcnQgY29uc3Qgc2Nvcm0xMl9yZWdleCA9IHtcbiAgQ01JU3RyaW5nMjU2OiAnXi57MCwyNTV9JCcsXG4gIENNSVN0cmluZzQwOTY6ICdeLnswLDQwOTZ9JCcsXG4gIENNSVRpbWU6ICdeKD86WzAxXVxcXFxkfDJbMDEyM10pOig/OlswMTIzNDVdXFxcXGQpOig/OlswMTIzNDVdXFxcXGQpJCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JVGltZXNwYW46ICdeKFswLTldezIsfSk6KFswLTldezJ9KTooWzAtOV17Mn0pKFxcLlswLTldezEsMn0pPyQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUludGVnZXI6ICdeXFxcXGQrJCcsXG4gIENNSVNJbnRlZ2VyOiAnXi0/KFswLTldKykkJyxcbiAgQ01JRGVjaW1hbDogJ14tPyhbMC05XXswLDN9KShcXC5bMC05XSopPyQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUlkZW50aWZpZXI6ICdeW1xcXFx1MDAyMS1cXFxcdTAwN0VdezAsMjU1fSQnLFxuICBDTUlGZWVkYmFjazogJ14uezAsMjU1fSQnLCAvLyBUaGlzIG11c3QgYmUgcmVkZWZpbmVkXG4gIENNSUluZGV4OiAnWy5fXShcXFxcZCspLicsXG5cbiAgLy8gVm9jYWJ1bGFyeSBEYXRhIFR5cGUgRGVmaW5pdGlvblxuICBDTUlTdGF0dXM6ICdeKCcgKyBzY29ybTEyX3ZhbHVlcy52YWxpZExlc3NvblN0YXR1cy5qb2luKCd8JykgKyAnKSQnLFxuICBDTUlTdGF0dXMyOiAnXignICsgc2Nvcm0xMl92YWx1ZXMudmFsaWRMZXNzb25TdGF0dXMuam9pbignfCcpICsgJ3xub3QgYXR0ZW1wdGVkKSQnLFxuICBDTUlFeGl0OiAnXignICsgc2Nvcm0xMl92YWx1ZXMudmFsaWRFeGl0LmpvaW4oJ3wnKSArICd8KSQnLFxuICBDTUlUeXBlOiAnXignICsgc2Nvcm0xMl92YWx1ZXMudmFsaWRUeXBlLmpvaW4oJ3wnKSArICcpJCcsXG4gIENNSVJlc3VsdDogJ14oJyArIHNjb3JtMTJfdmFsdWVzLnZhbGlkUmVzdWx0LmpvaW4oJ3wnKSArICd8KFswLTldezAsM30pPyhcXFxcLlswLTldKik/KSQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIE5BVkV2ZW50OiAnXihwcmV2aW91c3xjb250aW51ZSkkJyxcblxuICAvLyBEYXRhIHJhbmdlc1xuICBzY29yZV9yYW5nZTogJzAjMTAwJyxcbiAgYXVkaW9fcmFuZ2U6ICctMSMxMDAnLFxuICBzcGVlZF9yYW5nZTogJy0xMDAjMTAwJyxcbiAgd2VpZ2h0aW5nX3JhbmdlOiAnLTEwMCMxMDAnLFxuICB0ZXh0X3JhbmdlOiAnLTEjMScsXG59O1xuXG5leHBvcnQgY29uc3QgYWljY19yZWdleCA9IHtcbiAgLi4uc2Nvcm0xMl9yZWdleCwgLi4ue1xuICAgIENNSUlkZW50aWZpZXI6ICdeXFxcXHd7MSwyNTV9JCcsXG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3Qgc2Nvcm0yMDA0X3JlZ2V4ID0ge1xuICBDTUlTdHJpbmcyMDA6ICdeW1xcXFx1MDAwMC1cXFxcdUZGRkZdezAsMjAwfSQnLFxuICBDTUlTdHJpbmcyNTA6ICdeW1xcXFx1MDAwMC1cXFxcdUZGRkZdezAsMjUwfSQnLFxuICBDTUlTdHJpbmcxMDAwOiAnXltcXFxcdTAwMDAtXFxcXHVGRkZGXXswLDEwMDB9JCcsXG4gIENNSVN0cmluZzQwMDA6ICdeW1xcXFx1MDAwMC1cXFxcdUZGRkZdezAsNDAwMH0kJyxcbiAgQ01JU3RyaW5nNjQwMDA6ICdeW1xcXFx1MDAwMC1cXFxcdUZGRkZdezAsNjQwMDB9JCcsXG4gIENNSUxhbmc6ICdeKFthLXpBLVpdezIsM318aXx4KShcXC1bYS16QS1aMC05XFwtXXsyLDh9KT8kfF4kJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlMYW5nU3RyaW5nMjUwOiAnXihcXHtsYW5nPShbYS16QS1aXXsyLDN9fGl8eCkoXFwtW2EtekEtWjAtOVxcLV17Miw4fSk/XFx9KT8oKD8hXFx7LiokKS57MCwyNTB9JCk/JCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JTGFuZ2NyOiAnXigoXFx7bGFuZz0oW2EtekEtWl17MiwzfXxpfHgpPyhcXC1bYS16QS1aMC05XFwtXXsyLDh9KT9cXH0pKSguKj8pJCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgQ01JTGFuZ1N0cmluZzI1MGNyOiAnXigoXFx7bGFuZz0oW2EtekEtWl17MiwzfXxpfHgpPyhcXC1bYS16QS1aMC05XFwtXXsyLDh9KT9cXH0pPyguezAsMjUwfSk/KT8kJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlMYW5nU3RyaW5nNDAwMDogJ14oXFx7bGFuZz0oW2EtekEtWl17MiwzfXxpfHgpKFxcLVthLXpBLVowLTlcXC1dezIsOH0pP1xcfSk/KCg/IVxcey4qJCkuezAsNDAwMH0kKT8kJywgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICBDTUlUaW1lOiAnXigxOVs3LTldezF9WzAtOV17MX18MjBbMC0yXXsxfVswLTldezF9fDIwM1swLThdezF9KSgoLSgwWzEtOV17MX18MVswLTJdezF9KSkoKC0oMFsxLTldezF9fFsxLTJdezF9WzAtOV17MX18M1swLTFdezF9KSkoVChbMC0xXXsxfVswLTldezF9fDJbMC0zXXsxfSkoKDpbMC01XXsxfVswLTldezF9KSgoOlswLTVdezF9WzAtOV17MX0pKChcXFxcLlswLTldezEsMn0pKChafChbK3wtXShbMC0xXXsxfVswLTldezF9fDJbMC0zXXsxfSkpKSg6WzAtNV17MX1bMC05XXsxfSk/KT8pPyk/KT8pPyk/KT8kJyxcbiAgQ01JVGltZXNwYW46ICdeUCg/OihbLixcXFxcZF0rKVkpPyg/OihbLixcXFxcZF0rKU0pPyg/OihbLixcXFxcZF0rKVcpPyg/OihbLixcXFxcZF0rKUQpPyg/OlQ/KD86KFsuLFxcXFxkXSspSCk/KD86KFsuLFxcXFxkXSspTSk/KD86KFsuLFxcXFxkXSspUyk/KT8kJyxcbiAgQ01JSW50ZWdlcjogJ15cXFxcZCskJyxcbiAgQ01JU0ludGVnZXI6ICdeLT8oWzAtOV0rKSQnLFxuICBDTUlEZWNpbWFsOiAnXi0/KFswLTldezEsNX0pKFxcXFwuWzAtOV17MSwxOH0pPyQnLFxuICBDTUlJZGVudGlmaWVyOiAnXlxcXFxTezEsMjUwfVthLXpBLVowLTldJCcsXG4gIENNSVNob3J0SWRlbnRpZmllcjogJ15bXFxcXHdcXC5dezEsMjUwfSQnLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIENNSUxvbmdJZGVudGlmaWVyOiAnXig/Oig/IXVybjopXFxcXFN7MSw0MDAwfXx1cm46W0EtWmEtejAtOS1dezEsMzF9OlxcXFxTezEsNDAwMH0pJCcsXG4gIENNSUZlZWRiYWNrOiAnXi4qJCcsIC8vIFRoaXMgbXVzdCBiZSByZWRlZmluZWRcbiAgQ01JSW5kZXg6ICdbLl9dKFxcXFxkKykuJyxcbiAgQ01JSW5kZXhTdG9yZTogJy5OKFxcXFxkKykuJyxcblxuICAvLyBWb2NhYnVsYXJ5IERhdGEgVHlwZSBEZWZpbml0aW9uXG4gIENNSUNTdGF0dXM6ICdeKCcgKyBzY29ybTIwMDRfdmFsdWVzLnZhbGlkQ1N0YXR1cy5qb2luKCd8JykgKyAnKSQnLFxuICBDTUlTU3RhdHVzOiAnXignICsgc2Nvcm0yMDA0X3ZhbHVlcy52YWxpZFNTdGF0dXMuam9pbignfCcpICsgJykkJyxcbiAgQ01JRXhpdDogJ14oJyArIHNjb3JtMjAwNF92YWx1ZXMudmFsaWRFeGl0LmpvaW4oJ3wnKSArICcpJCcsXG4gIENNSVR5cGU6ICdeKCcgKyBzY29ybTIwMDRfdmFsdWVzLnZhbGlkVHlwZS5qb2luKCd8JykgKyAnKSQnLFxuICBDTUlSZXN1bHQ6ICdeKCcgKyBzY29ybTIwMDRfdmFsdWVzLnZhbGlkUmVzdWx0LmpvaW4oJ3wnKSArICd8LT8oWzAtOV17MSw0fSkoXFxcXC5bMC05XXsxLDE4fSk/KSQnLFxuICBOQVZFdmVudDogJ14oJyArIHNjb3JtMjAwNF92YWx1ZXMudmFsaWROYXZSZXF1ZXN0LmpvaW4oJ3wnKSArICd8XFx7dGFyZ2V0PVxcXFxTezAsMjAwfVthLXpBLVowLTldXFx9Y2hvaWNlfGp1bXApJCcsIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgTkFWQm9vbGVhbjogJ14odW5rbm93bnx0cnVlfGZhbHNlJCknLFxuICBOQVZUYXJnZXQ6ICdeKHByZXZpb3VzfGNvbnRpbnVlfGNob2ljZS57dGFyZ2V0PVxcXFxTezAsMjAwfVthLXpBLVowLTldfSkkJyxcblxuICAvLyBEYXRhIHJhbmdlc1xuICBzY2FsZWRfcmFuZ2U6ICctMSMxJyxcbiAgYXVkaW9fcmFuZ2U6ICcwIyonLFxuICBzcGVlZF9yYW5nZTogJzAjKicsXG4gIHRleHRfcmFuZ2U6ICctMSMxJyxcbiAgcHJvZ3Jlc3NfcmFuZ2U6ICcwIzEnLFxufTtcbiIsIi8vIEBmbG93XG5pbXBvcnQge3Njb3JtMjAwNF9yZWdleH0gZnJvbSAnLi9yZWdleCc7XG5cbmV4cG9ydCBjb25zdCBsZWFybmVyX3Jlc3BvbnNlcyA9IHtcbiAgJ3RydWUtZmFsc2UnOiB7XG4gICAgZm9ybWF0OiAnXnRydWUkfF5mYWxzZSQnLFxuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG4gICdjaG9pY2UnOiB7XG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIG1heDogMzYsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICB1bmlxdWU6IHRydWUsXG4gIH0sXG4gICdmaWxsLWluJzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSUxhbmdTdHJpbmcyNTAsXG4gICAgbWF4OiAxMCxcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG4gICdsb25nLWZpbGwtaW4nOiB7XG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JTGFuZ1N0cmluZzQwMDAsXG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ21hdGNoaW5nJzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBmb3JtYXQyOiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIG1heDogMzYsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICBkZWxpbWl0ZXIyOiAnWy5dJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAncGVyZm9ybWFuY2UnOiB7XG4gICAgZm9ybWF0OiAnXiR8JyArIHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgZm9ybWF0Mjogc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwgKyAnfF4kfCcgK1xuICAgICAgICBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIG1heDogMjUwLFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgZGVsaW1pdGVyMjogJ1suXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgfSxcbiAgJ3NlcXVlbmNpbmcnOiB7XG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIG1heDogMzYsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAnbGlrZXJ0Jzoge1xuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICB9LFxuICAnbnVtZXJpYyc6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlEZWNpbWFsLFxuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG4gICdvdGhlcic6IHtcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTdHJpbmc0MDAwLFxuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gIH0sXG59O1xuXG5leHBvcnQgY29uc3QgY29ycmVjdF9yZXNwb25zZXMgPSB7XG4gICd0cnVlLWZhbHNlJzoge1xuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6ICdedHJ1ZSR8XmZhbHNlJCcsXG4gICAgbGltaXQ6IDEsXG4gIH0sXG4gICdjaG9pY2UnOiB7XG4gICAgbWF4OiAzNixcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIHVuaXF1ZTogdHJ1ZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgfSxcbiAgJ2ZpbGwtaW4nOiB7XG4gICAgbWF4OiAxMCxcbiAgICBkZWxpbWl0ZXI6ICdbLF0nLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlMYW5nU3RyaW5nMjUwY3IsXG4gIH0sXG4gICdsb25nLWZpbGwtaW4nOiB7XG4gICAgbWF4OiAxLFxuICAgIGRlbGltaXRlcjogJycsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IHRydWUsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JTGFuZ1N0cmluZzQwMDAsXG4gIH0sXG4gICdtYXRjaGluZyc6IHtcbiAgICBtYXg6IDM2LFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgZGVsaW1pdGVyMjogJ1suXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgICBmb3JtYXQyOiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICB9LFxuICAncGVyZm9ybWFuY2UnOiB7XG4gICAgbWF4OiAyNTAsXG4gICAgZGVsaW1pdGVyOiAnWyxdJyxcbiAgICBkZWxpbWl0ZXIyOiAnWy5dJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiAnXiR8JyArIHNjb3JtMjAwNF9yZWdleC5DTUlTaG9ydElkZW50aWZpZXIsXG4gICAgZm9ybWF0Mjogc2Nvcm0yMDA0X3JlZ2V4LkNNSURlY2ltYWwgKyAnfF4kfCcgK1xuICAgICAgICBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICB9LFxuICAnc2VxdWVuY2luZyc6IHtcbiAgICBtYXg6IDM2LFxuICAgIGRlbGltaXRlcjogJ1ssXScsXG4gICAgdW5pcXVlOiBmYWxzZSxcbiAgICBkdXBsaWNhdGU6IGZhbHNlLFxuICAgIGZvcm1hdDogc2Nvcm0yMDA0X3JlZ2V4LkNNSVNob3J0SWRlbnRpZmllcixcbiAgfSxcbiAgJ2xpa2VydCc6IHtcbiAgICBtYXg6IDEsXG4gICAgZGVsaW1pdGVyOiAnJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JU2hvcnRJZGVudGlmaWVyLFxuICAgIGxpbWl0OiAxLFxuICB9LFxuICAnbnVtZXJpYyc6IHtcbiAgICBtYXg6IDIsXG4gICAgZGVsaW1pdGVyOiAnWzpdJyxcbiAgICB1bmlxdWU6IGZhbHNlLFxuICAgIGR1cGxpY2F0ZTogZmFsc2UsXG4gICAgZm9ybWF0OiBzY29ybTIwMDRfcmVnZXguQ01JRGVjaW1hbCxcbiAgICBsaW1pdDogMSxcbiAgfSxcbiAgJ290aGVyJzoge1xuICAgIG1heDogMSxcbiAgICBkZWxpbWl0ZXI6ICcnLFxuICAgIHVuaXF1ZTogZmFsc2UsXG4gICAgZHVwbGljYXRlOiBmYWxzZSxcbiAgICBmb3JtYXQ6IHNjb3JtMjAwNF9yZWdleC5DTUlTdHJpbmc0MDAwLFxuICAgIGxpbWl0OiAxLFxuICB9LFxufTtcbiIsIi8vIEBmbG93XG5cbi8qKlxuICogRGF0YSBWYWxpZGF0aW9uIEV4Y2VwdGlvblxuICovXG5leHBvcnQgY2xhc3MgVmFsaWRhdGlvbkVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAvKipcbiAgICogQ29uc3RydWN0b3IgdG8gdGFrZSBpbiBhbiBlcnJvciBtZXNzYWdlIGFuZCBjb2RlXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBlcnJvckNvZGVcbiAgICovXG4gIGNvbnN0cnVjdG9yKGVycm9yQ29kZTogbnVtYmVyKSB7XG4gICAgc3VwZXIoZXJyb3JDb2RlKTtcbiAgICB0aGlzLiNlcnJvckNvZGUgPSBlcnJvckNvZGU7XG4gIH1cblxuICAjZXJyb3JDb2RlO1xuXG4gIC8qKlxuICAgKiBHZXR0ZXIgZm9yICNlcnJvckNvZGVcbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cbiAgZ2V0IGVycm9yQ29kZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jZXJyb3JDb2RlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyeWluZyB0byBvdmVycmlkZSB0aGUgZGVmYXVsdCBFcnJvciBtZXNzYWdlXG4gICAqIEByZXR1cm4ge3N0cmluZ31cbiAgICovXG4gIGdldCBtZXNzYWdlKCkge1xuICAgIHJldHVybiB0aGlzLiNlcnJvckNvZGUgKyAnJztcbiAgfVxufVxuIiwiLy8gQGZsb3dcbmV4cG9ydCBjb25zdCBTRUNPTkRTX1BFUl9TRUNPTkQgPSAxLjA7XG5leHBvcnQgY29uc3QgU0VDT05EU19QRVJfTUlOVVRFID0gNjA7XG5leHBvcnQgY29uc3QgU0VDT05EU19QRVJfSE9VUiA9IDYwICogU0VDT05EU19QRVJfTUlOVVRFO1xuZXhwb3J0IGNvbnN0IFNFQ09ORFNfUEVSX0RBWSA9IDI0ICogU0VDT05EU19QRVJfSE9VUjtcblxuY29uc3QgZGVzaWduYXRpb25zID0gW1xuICBbJ0QnLCBTRUNPTkRTX1BFUl9EQVldLFxuICBbJ0gnLCBTRUNPTkRTX1BFUl9IT1VSXSxcbiAgWydNJywgU0VDT05EU19QRVJfTUlOVVRFXSxcbiAgWydTJywgU0VDT05EU19QRVJfU0VDT05EXSxcbl07XG5cbi8qKlxuICogQ29udmVydHMgYSBOdW1iZXIgdG8gYSBTdHJpbmcgb2YgSEg6TU06U1NcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gdG90YWxTZWNvbmRzXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZWNvbmRzQXNISE1NU1ModG90YWxTZWNvbmRzOiBOdW1iZXIpIHtcbiAgLy8gU0NPUk0gc3BlYyBkb2VzIG5vdCBkZWFsIHdpdGggbmVnYXRpdmUgZHVyYXRpb25zLCBnaXZlIHplcm8gYmFja1xuICBpZiAoIXRvdGFsU2Vjb25kcyB8fCB0b3RhbFNlY29uZHMgPD0gMCkge1xuICAgIHJldHVybiAnMDA6MDA6MDAnO1xuICB9XG5cbiAgY29uc3QgaG91cnMgPSBNYXRoLmZsb29yKHRvdGFsU2Vjb25kcyAvIFNFQ09ORFNfUEVSX0hPVVIpO1xuXG4gIGNvbnN0IGRhdGVPYmogPSBuZXcgRGF0ZSh0b3RhbFNlY29uZHMgKiAxMDAwKTtcbiAgY29uc3QgbWludXRlcyA9IGRhdGVPYmouZ2V0VVRDTWludXRlcygpO1xuICAvLyBtYWtlIHN1cmUgd2UgYWRkIGFueSBwb3NzaWJsZSBkZWNpbWFsIHZhbHVlXG4gIGNvbnN0IHNlY29uZHMgPSBkYXRlT2JqLmdldFNlY29uZHMoKSArICh0b3RhbFNlY29uZHMgJSAxLjApO1xuXG4gIHJldHVybiBob3Vycy50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJykgKyAnOicgK1xuICAgICAgbWludXRlcy50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJykgKyAnOicgK1xuICAgICAgc2Vjb25kcy50b1N0cmluZygpLnBhZFN0YXJ0KDIsICcwJyk7XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlIHRoZSBudW1iZXIgb2Ygc2Vjb25kcyBmcm9tIElTTyA4NjAxIER1cmF0aW9uXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHNlY29uZHNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNlY29uZHNBc0lTT0R1cmF0aW9uKHNlY29uZHM6IE51bWJlcikge1xuICAvLyBTQ09STSBzcGVjIGRvZXMgbm90IGRlYWwgd2l0aCBuZWdhdGl2ZSBkdXJhdGlvbnMsIGdpdmUgemVybyBiYWNrXG4gIGlmICghc2Vjb25kcyB8fCBzZWNvbmRzIDw9IDApIHtcbiAgICByZXR1cm4gJ1AwUyc7XG4gIH1cblxuICBsZXQgZHVyYXRpb24gPSAnUCc7XG4gIGxldCByZW1haW5kZXIgPSBzZWNvbmRzO1xuXG4gIGRlc2lnbmF0aW9ucy5mb3JFYWNoKChbc2lnbiwgY3VycmVudF9zZWNvbmRzXSkgPT4ge1xuICAgIGxldCB2YWx1ZSA9IE1hdGguZmxvb3IocmVtYWluZGVyIC8gY3VycmVudF9zZWNvbmRzKTtcblxuICAgIHJlbWFpbmRlciA9IHJlbWFpbmRlciAlIGN1cnJlbnRfc2Vjb25kcztcbiAgICAvLyBJZiB3ZSBoYXZlIGFueXRoaW5nIGxlZnQgaW4gdGhlIHJlbWFpbmRlciwgYW5kIHdlJ3JlIGN1cnJlbnRseSBhZGRpbmdcbiAgICAvLyBzZWNvbmRzIHRvIHRoZSBkdXJhdGlvbiwgZ28gYWhlYWQgYW5kIGFkZCB0aGUgZGVjaW1hbCB0byB0aGUgc2Vjb25kc1xuICAgIGlmIChzaWduID09PSAnUycgJiYgcmVtYWluZGVyID4gMCkge1xuICAgICAgdmFsdWUgKz0gcmVtYWluZGVyO1xuICAgIH1cblxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgZHVyYXRpb24gKz0gYCR7dmFsdWV9JHtzaWdufWA7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZHVyYXRpb247XG59XG5cbi8qKlxuICogQ2FsY3VsYXRlIHRoZSBudW1iZXIgb2Ygc2Vjb25kcyBmcm9tIEhIOk1NOlNTLkRERERERFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aW1lU3RyaW5nXG4gKiBAcGFyYW0ge1JlZ0V4cH0gdGltZVJlZ2V4XG4gKiBAcmV0dXJuIHtudW1iZXJ9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUaW1lQXNTZWNvbmRzKHRpbWVTdHJpbmc6IFN0cmluZywgdGltZVJlZ2V4OiBSZWdFeHApIHtcbiAgaWYgKCF0aW1lU3RyaW5nIHx8IHR5cGVvZiB0aW1lU3RyaW5nICE9PSAnc3RyaW5nJyB8fFxuICAgICAgIXRpbWVTdHJpbmcubWF0Y2godGltZVJlZ2V4KSkge1xuICAgIHJldHVybiAwO1xuICB9XG4gIGNvbnN0IHBhcnRzID0gdGltZVN0cmluZy5zcGxpdCgnOicpO1xuICBjb25zdCBob3VycyA9IE51bWJlcihwYXJ0c1swXSk7XG4gIGNvbnN0IG1pbnV0ZXMgPSBOdW1iZXIocGFydHNbMV0pO1xuICBjb25zdCBzZWNvbmRzID0gTnVtYmVyKHBhcnRzWzJdKTtcbiAgcmV0dXJuIChob3VycyAqIDM2MDApICsgKG1pbnV0ZXMgKiA2MCkgKyBzZWNvbmRzO1xufVxuXG4vKipcbiAqIENhbGN1bGF0ZSB0aGUgbnVtYmVyIG9mIHNlY29uZHMgZnJvbSBJU08gODYwMSBEdXJhdGlvblxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBkdXJhdGlvblxuICogQHBhcmFtIHtSZWdFeHB9IGR1cmF0aW9uUmVnZXhcbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldER1cmF0aW9uQXNTZWNvbmRzKGR1cmF0aW9uOiBTdHJpbmcsIGR1cmF0aW9uUmVnZXg6IFJlZ0V4cCkge1xuICBpZiAoIWR1cmF0aW9uIHx8ICFkdXJhdGlvbi5tYXRjaChkdXJhdGlvblJlZ2V4KSkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgY29uc3QgWywgeWVhcnMsIG1vbnRocywgLCBkYXlzLCBob3VycywgbWludXRlcywgc2Vjb25kc10gPSBuZXcgUmVnRXhwKFxuICAgICAgZHVyYXRpb25SZWdleCkuZXhlYyhkdXJhdGlvbikgfHwgW107XG5cbiAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgY29uc3QgYW5jaG9yID0gbmV3IERhdGUobm93KTtcbiAgYW5jaG9yLnNldEZ1bGxZZWFyKGFuY2hvci5nZXRGdWxsWWVhcigpICsgTnVtYmVyKHllYXJzIHx8IDApKTtcbiAgYW5jaG9yLnNldE1vbnRoKGFuY2hvci5nZXRNb250aCgpICsgTnVtYmVyKG1vbnRocyB8fCAwKSk7XG4gIGFuY2hvci5zZXREYXRlKGFuY2hvci5nZXREYXRlKCkgKyBOdW1iZXIoZGF5cyB8fCAwKSk7XG4gIGFuY2hvci5zZXRIb3VycyhhbmNob3IuZ2V0SG91cnMoKSArIE51bWJlcihob3VycyB8fCAwKSk7XG4gIGFuY2hvci5zZXRNaW51dGVzKGFuY2hvci5nZXRNaW51dGVzKCkgKyBOdW1iZXIobWludXRlcyB8fCAwKSk7XG4gIGFuY2hvci5zZXRTZWNvbmRzKGFuY2hvci5nZXRTZWNvbmRzKCkgKyBOdW1iZXIoc2Vjb25kcyB8fCAwKSk7XG4gIGlmIChzZWNvbmRzICYmIFN0cmluZyhzZWNvbmRzKS5pbmRleE9mKCcuJykgPiAwKSB7XG4gICAgY29uc3QgbWlsbGlzZWNvbmRzID0gTnVtYmVyKE51bWJlcihzZWNvbmRzKSAlIDEpLnRvRml4ZWQoNikgKiAxMDAwLjA7XG4gICAgYW5jaG9yLnNldE1pbGxpc2Vjb25kcyhhbmNob3IuZ2V0TWlsbGlzZWNvbmRzKCkgKyBtaWxsaXNlY29uZHMpO1xuICB9XG5cbiAgcmV0dXJuICgoYW5jaG9yICogMS4wKSAtIG5vdykgLyAxMDAwLjA7XG59XG5cbi8qKlxuICogQWRkcyB0b2dldGhlciB0d28gSVNPODYwMSBEdXJhdGlvbiBzdHJpbmdzXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGZpcnN0XG4gKiBAcGFyYW0ge3N0cmluZ30gc2Vjb25kXG4gKiBAcGFyYW0ge1JlZ0V4cH0gZHVyYXRpb25SZWdleFxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkVHdvRHVyYXRpb25zKFxuICAgIGZpcnN0OiBTdHJpbmcsXG4gICAgc2Vjb25kOiBTdHJpbmcsXG4gICAgZHVyYXRpb25SZWdleDogUmVnRXhwKSB7XG4gIGNvbnN0IGZpcnN0U2Vjb25kcyA9IGdldER1cmF0aW9uQXNTZWNvbmRzKGZpcnN0LCBkdXJhdGlvblJlZ2V4KTtcbiAgY29uc3Qgc2Vjb25kU2Vjb25kcyA9IGdldER1cmF0aW9uQXNTZWNvbmRzKHNlY29uZCwgZHVyYXRpb25SZWdleCk7XG5cbiAgcmV0dXJuIGdldFNlY29uZHNBc0lTT0R1cmF0aW9uKGZpcnN0U2Vjb25kcyArIHNlY29uZFNlY29uZHMpO1xufVxuXG4vKipcbiAqIEFkZCB0b2dldGhlciB0d28gSEg6TU06U1MuREQgc3RyaW5nc1xuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBmaXJzdFxuICogQHBhcmFtIHtzdHJpbmd9IHNlY29uZFxuICogQHBhcmFtIHtSZWdFeHB9IHRpbWVSZWdleFxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkSEhNTVNTVGltZVN0cmluZ3MoXG4gICAgZmlyc3Q6IFN0cmluZyxcbiAgICBzZWNvbmQ6IFN0cmluZyxcbiAgICB0aW1lUmVnZXg6IFJlZ0V4cCkge1xuICBjb25zdCBmaXJzdFNlY29uZHMgPSBnZXRUaW1lQXNTZWNvbmRzKGZpcnN0LCB0aW1lUmVnZXgpO1xuICBjb25zdCBzZWNvbmRTZWNvbmRzID0gZ2V0VGltZUFzU2Vjb25kcyhzZWNvbmQsIHRpbWVSZWdleCk7XG4gIHJldHVybiBnZXRTZWNvbmRzQXNISE1NU1MoZmlyc3RTZWNvbmRzICsgc2Vjb25kU2Vjb25kcyk7XG59XG4iXX0=
