// @flow
import {CMIArray} from './cmi/common';
import {ValidationError} from './exceptions';
import ErrorCodes from './constants/error_codes';
import APIConstants from './constants/api_constants';
import {unflatten} from './utilities';
import debounce from 'lodash.debounce';

const global_constants = APIConstants.global;
const scorm12_error_codes = ErrorCodes.scorm12;

/**
 * Base API class for AICC, SCORM 1.2, and SCORM 2004. Should be considered
 * abstract, and never initialized on it's own.
 */
export default class BaseAPI {
  #timeout;
  #error_codes;
  #settings = {
    autocommit: false,
    autocommitSeconds: 10,
    asyncCommit: false,
    sendBeaconCommit: false,
    lmsCommitUrl: false,
    dataCommitFormat: 'json', // valid formats are 'json' or 'flattened', 'params'
    commitRequestDataType: 'application/json;charset=UTF-8',
    autoProgress: false,
    logLevel: global_constants.LOG_LEVEL_ERROR,
    selfReportSessionTime: false,
    alwaysSendTotalTime: false,
    strict_errors: true,
    xhrHeaders: {},
    xhrWithCredentials: false,
    responseHandler: function(xhr) {
      let result;
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
    requestHandler: function(commitObject) {
      return commitObject;
    },
    onLogMessage: function(messageLevel, logMessage) {
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
    },
  };
  cmi;
  startingData: {};

  /**
   * Constructor for Base API class. Sets some shared API fields, as well as
   * sets up options for the API.
   * @param {object} error_codes
   * @param {object} settings
   */
  constructor(error_codes, settings) {
    if (new.target === BaseAPI) {
      throw new TypeError('Cannot construct BaseAPI instances directly');
    }
    this.currentState = global_constants.STATE_NOT_INITIALIZED;
    this.lastErrorCode = 0;
    this.listenerArray = [];

    this.#timeout = null;
    this.#error_codes = error_codes;

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
  initialize(
      callbackName: String,
      initializeMessage?: String,
      terminationMessage?: String) {
    let returnValue = global_constants.SCORM_FALSE;

    if (this.isInitialized()) {
      this.throwSCORMError(this.#error_codes.INITIALIZED, initializeMessage);
    } else if (this.isTerminated()) {
      this.throwSCORMError(this.#error_codes.TERMINATED, terminationMessage);
    } else {
      if (this.selfReportSessionTime) {
        this.cmi.setStartTime();
      }

      this.currentState = global_constants.STATE_INITIALIZED;
      this.lastErrorCode = 0;
      returnValue = global_constants.SCORM_TRUE;
      this.processListeners(callbackName);
    }

    this.apiLog(callbackName, null, 'returned: ' + returnValue,
        global_constants.LOG_LEVEL_INFO);
    this.clearSCORMError(returnValue);

    return returnValue;
  }

  /**
   * Getter for #error_codes
   * @return {object}
   */
  get error_codes() {
    return this.#error_codes;
  }

  /**
   * Getter for #settings
   * @return {object}
   */
  get settings() {
    return this.#settings;
  }

  /**
   * Setter for #settings
   * @param {object} settings
   */
  set settings(settings: Object) {
    this.#settings = {...this.#settings, ...settings};
  }

  /**
   * Terminates the current run of the API
   * @param {string} callbackName
   * @param {boolean} checkTerminated
   * @return {string}
   */
  terminate(
      callbackName: String,
      checkTerminated: boolean) {
    let returnValue = global_constants.SCORM_FALSE;

    if (this.checkState(checkTerminated,
        this.#error_codes.TERMINATION_BEFORE_INIT,
        this.#error_codes.MULTIPLE_TERMINATION)) {
      this.currentState = global_constants.STATE_TERMINATED;

      const result = this.storeData(true);
      if (!this.settings.sendBeaconCommit && !this.settings.asyncCommit &&
        typeof result.errorCode !== 'undefined' && result.errorCode > 0) {
        this.throwSCORMError(result.errorCode);
      }
      returnValue = (typeof result !== 'undefined' && result.result) ?
        result.result : global_constants.SCORM_FALSE;

      if (checkTerminated) this.lastErrorCode = 0;

      returnValue = global_constants.SCORM_TRUE;
      this.processListeners(callbackName);
    }

    this.apiLog(callbackName, null, 'returned: ' + returnValue,
        global_constants.LOG_LEVEL_INFO);
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
  getValue(
      callbackName: String,
      checkTerminated: boolean,
      CMIElement: String) {
    let returnValue;

    if (this.checkState(checkTerminated,
        this.#error_codes.RETRIEVE_BEFORE_INIT,
        this.#error_codes.RETRIEVE_AFTER_TERM)) {
      if (checkTerminated) this.lastErrorCode = 0;
      try {
        returnValue = this.getCMIValue(CMIElement);
      } catch (e) {
        if (e instanceof ValidationError) {
          this.lastErrorCode = e.errorCode;
          returnValue = global_constants.SCORM_FALSE;
        } else {
          if (e.message) {
            console.error(e.message);
          } else {
            console.error(e);
          }
          this.throwSCORMError(this.#error_codes.GENERAL);
        }
      }
      this.processListeners(callbackName, CMIElement);
    }

    this.apiLog(callbackName, CMIElement, ': returned: ' + returnValue,
        global_constants.LOG_LEVEL_INFO);
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
  setValue(
      callbackName: String,
      commitCallback: String,
      checkTerminated: boolean,
      CMIElement,
      value) {
    if (value !== undefined) {
      value = String(value);
    }
    let returnValue = global_constants.SCORM_FALSE;

    if (this.checkState(checkTerminated, this.#error_codes.STORE_BEFORE_INIT,
        this.#error_codes.STORE_AFTER_TERM)) {
      if (checkTerminated) this.lastErrorCode = 0;
      try {
        returnValue = this.setCMIValue(CMIElement, value);
      } catch (e) {
        if (e instanceof ValidationError) {
          this.lastErrorCode = e.errorCode;
          returnValue = global_constants.SCORM_FALSE;
        } else {
          if (e.message) {
            console.error(e.message);
          } else {
            console.error(e);
          }
          this.throwSCORMError(this.#error_codes.GENERAL);
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
      if (this.settings.autocommit && !this.#timeout) {
        this.scheduleCommit(this.settings.autocommitSeconds * 1000, commitCallback);
      }
    }

    this.apiLog(callbackName, CMIElement,
        ': ' + value + ': result: ' + returnValue,
        global_constants.LOG_LEVEL_INFO);
    this.clearSCORMError(returnValue);

    return returnValue;
  }

  /**
   * Orders LMS to store all content parameters
   * @param {string} callbackName
   * @param {boolean} checkTerminated
   * @return {string}
   */
  commit(
      callbackName: String,
      checkTerminated: boolean) {
    this.clearScheduledCommit();

    let returnValue = global_constants.SCORM_FALSE;

    if (this.checkState(checkTerminated, this.#error_codes.COMMIT_BEFORE_INIT,
        this.#error_codes.COMMIT_AFTER_TERM)) {
      const result = this.storeData(false);
      if (!this.settings.sendBeaconCommit && !this.settings.asyncCommit &&
        result.errorCode && result.errorCode > 0) {
        this.throwSCORMError(result.errorCode);
      }
      returnValue = (typeof result !== 'undefined' && result.result) ?
        result.result : global_constants.SCORM_FALSE;

      this.apiLog(callbackName, 'HttpRequest', ' Result: ' + returnValue,
          global_constants.LOG_LEVEL_DEBUG);

      if (checkTerminated) this.lastErrorCode = 0;

      this.processListeners(callbackName);
    }

    this.apiLog(callbackName, null, 'returned: ' + returnValue,
        global_constants.LOG_LEVEL_INFO);
    this.clearSCORMError(returnValue);

    return returnValue;
  }

  /**
   * Returns last error code
   * @param {string} callbackName
   * @return {string}
   */
  getLastError(callbackName: String) {
    const returnValue = String(this.lastErrorCode);

    this.processListeners(callbackName);

    this.apiLog(callbackName, null, 'returned: ' + returnValue,
        global_constants.LOG_LEVEL_INFO);

    return returnValue;
  }

  /**
   * Returns the errorNumber error description
   *
   * @param {string} callbackName
   * @param {(string|number)} CMIErrorCode
   * @return {string}
   */
  getErrorString(callbackName: String, CMIErrorCode) {
    let returnValue = '';

    if (CMIErrorCode !== null && CMIErrorCode !== '') {
      returnValue = this.getLmsErrorMessageDetails(CMIErrorCode);
      this.processListeners(callbackName);
    }

    this.apiLog(callbackName, null, 'returned: ' + returnValue,
        global_constants.LOG_LEVEL_INFO);

    return returnValue;
  }

  /**
   * Returns a comprehensive description of the errorNumber error.
   *
   * @param {string} callbackName
   * @param {(string|number)} CMIErrorCode
   * @return {string}
   */
  getDiagnostic(callbackName: String, CMIErrorCode) {
    let returnValue = '';

    if (CMIErrorCode !== null && CMIErrorCode !== '') {
      returnValue = this.getLmsErrorMessageDetails(CMIErrorCode, true);
      this.processListeners(callbackName);
    }

    this.apiLog(callbackName, null, 'returned: ' + returnValue,
        global_constants.LOG_LEVEL_INFO);

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
  checkState(
      checkTerminated: boolean,
      beforeInitError: number,
      afterTermError?: number) {
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
  apiLog(
      functionName: String,
      CMIElement: String,
      logMessage: String,
      messageLevel: number) {
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
  formatMessage(functionName: String, CMIElement: String, message: String) {
    const baseLength = 20;
    let messageString = '';

    messageString += functionName;

    let fillChars = baseLength - messageString.length;

    for (let i = 0; i < fillChars; i++) {
      messageString += ' ';
    }

    messageString += ': ';

    if (CMIElement) {
      const CMIElementBaseLength = 70;

      messageString += CMIElement;

      fillChars = CMIElementBaseLength - messageString.length;

      for (let j = 0; j < fillChars; j++) {
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
  stringMatches(str: String, tester: String) {
    return str && tester && str.match(tester);
  }

  /**
   * Check to see if the specific object has the given property
   * @param {*} refObject
   * @param {string} attribute
   * @return {boolean}
   * @private
   */
  _checkObjectHasProperty(refObject, attribute: String) {
    return Object.hasOwnProperty.call(refObject, attribute) ||
      Object.getOwnPropertyDescriptor(
          Object.getPrototypeOf(refObject), attribute) ||
      (attribute in refObject);
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
  getLmsErrorMessageDetails(_errorNumber, _detail) {
    throw new Error(
        'The getLmsErrorMessageDetails method has not been implemented');
  }

  /**
   * Gets the value for the specific element.
   * APIs that inherit BaseAPI should override this function
   *
   * @param {string} _CMIElement
   * @return {string}
   * @abstract
   */
  getCMIValue(_CMIElement) {
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
  setCMIValue(_CMIElement, _value) {
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
  _commonSetCMIValue(
      methodName: String, scorm2004: boolean, CMIElement, value) {
    if (!CMIElement || CMIElement === '') {
      return global_constants.SCORM_FALSE;
    }

    const structure = CMIElement.split('.');
    let refObject = this;
    let returnValue = global_constants.SCORM_FALSE;
    let foundFirstIndex = false;

    const invalidErrorMessage = `The data model element passed to ${methodName} (${CMIElement}) is not a valid SCORM data model element.`;
    const invalidErrorCode = scorm2004 ?
      this.#error_codes.UNDEFINED_DATA_MODEL :
      this.#error_codes.GENERAL;

    for (let i = 0; i < structure.length; i++) {
      const attribute = structure[i];

      if (i === structure.length - 1) {
        if (scorm2004 && (attribute.substr(0, 8) === '{target=') &&
          (typeof refObject._isTargetValid == 'function')) {
          this.throwSCORMError(this.#error_codes.READ_ONLY_ELEMENT);
        } else if (!this._checkObjectHasProperty(refObject, attribute)) {
          this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
        } else {
          if (this.isInitialized() &&
            this.stringMatches(CMIElement, '\\.correct_responses\\.\\d+')) {
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

        if (refObject instanceof CMIArray) {
          const index = parseInt(structure[i + 1], 10);

          // SCO is trying to set an item on an array
          if (!isNaN(index)) {
            const item = refObject.childArray[index];

            if (item) {
              refObject = item;
              foundFirstIndex = true;
            } else {
              const newChild = this.getChildElement(CMIElement, value,
                  foundFirstIndex);
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
      this.apiLog(methodName, null,
          `There was an error setting the value for: ${CMIElement}, value of: ${value}`,
          global_constants.LOG_LEVEL_WARNING);
    }

    return returnValue;
  }

  /**
   * Abstract method for validating that a response is correct.
   *
   * @param {string} _CMIElement
   * @param {*} _value
   */
  validateCorrectResponse(_CMIElement, _value) {
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
  getChildElement(_CMIElement, _value, _foundFirstIndex) {
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
  _commonGetCMIValue(methodName: String, scorm2004: boolean, CMIElement) {
    if (!CMIElement || CMIElement === '') {
      return '';
    }

    const structure = CMIElement.split('.');
    let refObject = this;
    let attribute = null;

    const uninitializedErrorMessage = `The data model element passed to ${methodName} (${CMIElement}) has not been initialized.`;
    const invalidErrorMessage = `The data model element passed to ${methodName} (${CMIElement}) is not a valid SCORM data model element.`;
    const invalidErrorCode = scorm2004 ?
      this.#error_codes.UNDEFINED_DATA_MODEL :
      this.#error_codes.GENERAL;

    for (let i = 0; i < structure.length; i++) {
      attribute = structure[i];

      if (!scorm2004) {
        if (i === structure.length - 1) {
          if (!this._checkObjectHasProperty(refObject, attribute)) {
            this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
            return;
          }
        }
      } else {
        if ((String(attribute).substr(0, 8) === '{target=') &&
          (typeof refObject._isTargetValid == 'function')) {
          const target = String(attribute).substr(8, String(attribute).length - 9);
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

      if (refObject instanceof CMIArray) {
        const index = parseInt(structure[i + 1], 10);

        // SCO is trying to set an item on an array
        if (!isNaN(index)) {
          const item = refObject.childArray[index];

          if (item) {
            refObject = item;
          } else {
            this.throwSCORMError(this.#error_codes.VALUE_NOT_INITIALIZED,
                uninitializedErrorMessage);
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
  isInitialized() {
    return this.currentState === global_constants.STATE_INITIALIZED;
  }

  /**
   * Returns true if the API's current state is STATE_NOT_INITIALIZED
   *
   * @return {boolean}
   */
  isNotInitialized() {
    return this.currentState === global_constants.STATE_NOT_INITIALIZED;
  }

  /**
   * Returns true if the API's current state is STATE_TERMINATED
   *
   * @return {boolean}
   */
  isTerminated() {
    return this.currentState === global_constants.STATE_TERMINATED;
  }

  /**
   * Provides a mechanism for attaching to a specific SCORM event
   *
   * @param {string} listenerName
   * @param {function} callback
   */
  on(listenerName: String, callback: function) {
    if (!callback) return;

    const listenerFunctions = listenerName.split(' ');
    for (let i = 0; i < listenerFunctions.length; i++) {
      const listenerSplit = listenerFunctions[i].split('.');
      if (listenerSplit.length === 0) return;

      const functionName = listenerSplit[0];

      let CMIElement = null;
      if (listenerSplit.length > 1) {
        CMIElement = listenerName.replace(functionName + '.', '');
      }

      this.listenerArray.push({
        functionName: functionName,
        CMIElement: CMIElement,
        callback: callback,
      });

      this.apiLog('on', functionName, `Added event listener: ${this.listenerArray.length}`, global_constants.LOG_LEVEL_INFO);
    }
  }

  /**
   * Provides a mechanism for detaching a specific SCORM event listener
   *
   * @param {string} listenerName
   * @param {function} callback
   */
  off(listenerName: String, callback: function) {
    if (!callback) return;

    const listenerFunctions = listenerName.split(' ');
    for (let i = 0; i < listenerFunctions.length; i++) {
      const listenerSplit = listenerFunctions[i].split('.');
      if (listenerSplit.length === 0) return;

      const functionName = listenerSplit[0];

      let CMIElement = null;
      if (listenerSplit.length > 1) {
        CMIElement = listenerName.replace(functionName + '.', '');
      }

      const removeIndex = this.listenerArray.findIndex((obj) =>
        obj.functionName === functionName &&
        obj.CMIElement === CMIElement &&
        obj.callback === callback,
      );
      if (removeIndex !== -1) {
        this.listenerArray.splice(removeIndex, 1);
        this.apiLog('off', functionName, `Removed event listener: ${this.listenerArray.length}`, global_constants.LOG_LEVEL_INFO);
      }
    }
  }

  /**
   * Provides a mechanism for clearing all listeners from a specific SCORM event
   *
   * @param {string} listenerName
   */
  clear(listenerName: String) {
    const listenerFunctions = listenerName.split(' ');
    for (let i = 0; i < listenerFunctions.length; i++) {
      const listenerSplit = listenerFunctions[i].split('.');
      if (listenerSplit.length === 0) return;

      const functionName = listenerSplit[0];

      let CMIElement = null;
      if (listenerSplit.length > 1) {
        CMIElement = listenerName.replace(functionName + '.', '');
      }

      this.listenerArray = this.listenerArray.filter((obj) =>
        obj.functionName !== functionName &&
        obj.CMIElement !== CMIElement,
      );
    }
  }

  /**
   * Processes any 'on' listeners that have been created
   *
   * @param {string} functionName
   * @param {string} CMIElement
   * @param {*} value
   */
  processListeners(functionName: String, CMIElement: String, value: any) {
    this.apiLog(functionName, CMIElement, value);
    for (let i = 0; i < this.listenerArray.length; i++) {
      const listener = this.listenerArray[i];
      const functionsMatch = listener.functionName === functionName;
      const listenerHasCMIElement = !!listener.CMIElement;
      let CMIElementsMatch = false;
      if (CMIElement && listener.CMIElement &&
        listener.CMIElement.substring(listener.CMIElement.length - 1) ===
        '*') {
        CMIElementsMatch = CMIElement.indexOf(listener.CMIElement.substring(0,
            listener.CMIElement.length - 1)) === 0;
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
  throwSCORMError(errorNumber: number, message: String) {
    if (!message) {
      message = this.getLmsErrorMessageDetails(errorNumber);
    }

    this.apiLog('throwSCORMError', null, errorNumber + ': ' + message,
        global_constants.LOG_LEVEL_ERROR);

    this.lastErrorCode = String(errorNumber);
  }

  /**
   * Clears the last SCORM error code on success.
   *
   * @param {string} success
   */
  clearSCORMError(success: String) {
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
  storeData(_calculateTotalTime) {
    throw new Error(
        'The storeData method has not been implemented');
  }

  /**
   * Load the CMI from a flattened JSON object
   * @param {object} json
   * @param {string} CMIElement
   */
  loadFromFlattenedJSON(json, CMIElement) {
    if (!this.isNotInitialized()) {
      console.error(
          'loadFromFlattenedJSON can only be called before the call to lmsInitialize.');
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
      const a_match = a.match(a_pattern);

      let c_match;
      if (a_match !== null && (c_match = c.match(a_pattern)) !== null) {
        const a_num = Number(a_match[2]);
        const c_num = Number(c_match[2]);
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

    const int_pattern = /^(cmi\.interactions\.)(\d+)\.(.*)$/;
    const obj_pattern = /^(cmi\.objectives\.)(\d+)\.(.*)$/;

    const result = Object.keys(json).map(function(key) {
      return [String(key), json[key]];
    });

    // CMI interactions need to have id and type loaded before any other fields
    result.sort(function([a, b], [c, d]) {
      let test;
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

    let obj;
    result.forEach((element) => {
      obj = {};
      obj[element[0]] = element[1];
      this.loadFromJSON(unflatten(obj), CMIElement);
    });
  }

  /**
   * Loads CMI data from a JSON object.
   *
   * @param {object} json
   * @param {string} CMIElement
   */
  loadFromJSON(json, CMIElement) {
    if (!this.isNotInitialized()) {
      console.error(
          'loadFromJSON can only be called before the call to lmsInitialize.');
      return;
    }

    CMIElement = CMIElement !== undefined ? CMIElement : 'cmi';

    this.startingData = json;

    // could this be refactored down to flatten(json) then setCMIValue on each?
    for (const key in json) {
      if ({}.hasOwnProperty.call(json, key) && json[key]) {
        const currentCMIElement = (CMIElement ? CMIElement + '.' : '') + key;
        const value = json[key];

        if (value['childArray']) {
          for (let i = 0; i < value['childArray'].length; i++) {
            this.loadFromJSON(value['childArray'][i],
                currentCMIElement + '.' + i);
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
  renderCMIToJSONString() {
    const cmi = this.cmi;
    // Do we want/need to return fields that have no set value?
    // return JSON.stringify({ cmi }, (k, v) => v === undefined ? null : v, 2);
    return JSON.stringify({cmi});
  }

  /**
   * Returns a JS object representing the current cmi
   * @return {object}
   */
  renderCMIToJSONObject() {
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
  renderCommitCMI(_terminateCommit) {
    throw new Error(
        'The storeData method has not been implemented');
  }

  /**
   * Send the request to the LMS
   * @param {string} url
   * @param {object|Array} params
   * @param {boolean} immediate
   * @return {object}
   */
  processHttpRequest(url: String, params, immediate = false) {
    const api = this;
    const process = function(url, params, settings, error_codes) {
      const genericError = {
        'result': global_constants.SCORM_FALSE,
        'errorCode': error_codes.GENERAL,
      };

      let result;
      if (!settings.sendBeaconCommit) {
        const httpReq = new XMLHttpRequest();
        httpReq.open('POST', url, settings.asyncCommit);

        if (Object.keys(settings.xhrHeaders).length) {
          Object.keys(settings.xhrHeaders).forEach((header) => {
            httpReq.setRequestHeader(header, settings.xhrHeaders[header]);
          });
        }

        httpReq.withCredentials = settings.xhrWithCredentials;

        if (settings.asyncCommit) {
          httpReq.onload = function(e) {
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
            httpReq.setRequestHeader('Content-Type',
                'application/x-www-form-urlencoded');
            httpReq.send(params.join('&'));
          } else {
            httpReq.setRequestHeader('Content-Type',
                settings.commitRequestDataType);
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
          const headers = {
            type: settings.commitRequestDataType,
          };
          let blob;
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

      if (result.result === true ||
        result.result === global_constants.SCORM_TRUE) {
        api.processListeners('CommitSuccess');
      } else {
        api.processListeners('CommitError');
      }

      return result;
    };

    if (typeof debounce !== 'undefined') {
      const debounced = debounce(process, 500);
      debounced(url, params, this.settings, this.error_codes);

      // if we're terminating, go ahead and commit immediately
      if (immediate) {
        debounced.flush();
      }

      return {
        result: global_constants.SCORM_TRUE,
        errorCode: 0,
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
  scheduleCommit(when: number, callback: string) {
    this.#timeout = new ScheduledCommit(this, when, callback);
    this.apiLog('scheduleCommit', '', 'scheduled',
        global_constants.LOG_LEVEL_DEBUG);
  }

  /**
   * Clears and cancels any currently scheduled commits
   */
  clearScheduledCommit() {
    if (this.#timeout) {
      this.#timeout.cancel();
      this.#timeout = null;
      this.apiLog('clearScheduledCommit', '', 'cleared',
          global_constants.LOG_LEVEL_DEBUG);
    }
  }
}

/**
 * Private class that wraps a timeout call to the commit() function
 */
class ScheduledCommit {
  #API;
  #cancelled = false;
  #timeout;
  #callback;

  /**
   * Constructor for ScheduledCommit
   * @param {BaseAPI} API
   * @param {number} when
   * @param {string} callback
   */
  constructor(API: any, when: number, callback: string) {
    this.#API = API;
    this.#timeout = setTimeout(this.wrapper.bind(this), when);
    this.#callback = callback;
  }

  /**
   * Cancel any currently scheduled commit
   */
  cancel() {
    this.#cancelled = true;
    if (this.#timeout) {
      clearTimeout(this.#timeout);
    }
  }

  /**
   * Wrap the API commit call to check if the call has already been cancelled
   */
  wrapper() {
    if (!this.#cancelled) {
      this.#API.commit(this.#callback);
    }
  }
}
