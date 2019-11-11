// @flow
import {CMIArray} from './cmi/common';

const api_constants = {
  SCORM_TRUE: 'true',
  SCORM_FALSE: 'false',
  STATE_NOT_INITIALIZED: 0,
  STATE_INITIALIZED: 1,
  STATE_TERMINATED: 2,
  LOG_LEVEL_DEBUG: 1,
  LOG_LEVEL_INFO: 2,
  LOG_LEVEL_WARNING: 3,
  LOG_LEVEL_ERROR: 4,
  LOG_LEVEL_NONE: 5,
};

let _self;

/**
 * Base API class for AICC, SCORM 1.2, and SCORM 2004. Should be considered
 * abstract, and never initialized on it's own.
 */
export default class BaseAPI {
  #timeout;
  #error_codes;
  cmi;

  /**
   * Constructor for Base API class. Sets some shared API fields, as well as
   * sets up options for the API.
   * @param {object} error_codes
   */
  constructor(error_codes) {
    _self = this;
    _self.currentState = api_constants.STATE_NOT_INITIALIZED;
    _self.apiLogLevel = api_constants.LOG_LEVEL_ERROR;
    _self.lastErrorCode = 0;
    _self.listenerArray = [];

    _self.#timeout = null;
    _self.#error_codes = error_codes;
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
    let returnValue = api_constants.SCORM_FALSE;

    if (_self.isInitialized()) {
      _self.throwSCORMError(_self.#error_codes.INITIALIZED, initializeMessage);
    } else if (_self.isTerminated()) {
      _self.throwSCORMError(_self.#error_codes.TERMINATED, terminationMessage);
    } else {
      _self.currentState = api_constants.STATE_INITIALIZED;
      _self.lastErrorCode = 0;
      returnValue = api_constants.SCORM_TRUE;
      _self.processListeners(callbackName);
    }

    _self.apiLog(callbackName, null, 'returned: ' + returnValue,
        api_constants.LOG_LEVEL_INFO);
    _self.clearSCORMError(returnValue);

    return returnValue;
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
    let returnValue = api_constants.SCORM_FALSE;

    if (_self.checkState(checkTerminated,
        _self.#error_codes.TERMINATION_BEFORE_INIT,
        _self.#error_codes.MULTIPLE_TERMINATION)) {
      if (checkTerminated) _self.lastErrorCode = 0;
      _self.currentState = api_constants.STATE_TERMINATED;
      returnValue = api_constants.SCORM_TRUE;
      _self.processListeners(callbackName);
    }

    _self.apiLog(callbackName, null, 'returned: ' + returnValue,
        api_constants.LOG_LEVEL_INFO);
    _self.clearSCORMError(returnValue);

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
    let returnValue = '';

    if (_self.checkState(checkTerminated,
        _self.#error_codes.RETRIEVE_BEFORE_INIT,
        _self.#error_codes.RETRIEVE_AFTER_TERM)) {
      if (checkTerminated) _self.lastErrorCode = 0;
      returnValue = _self.getCMIValue(CMIElement);
      _self.processListeners(callbackName, CMIElement);
    }

    _self.apiLog(callbackName, CMIElement, ': returned: ' + returnValue,
        api_constants.LOG_LEVEL_INFO);
    _self.clearSCORMError(returnValue);

    return returnValue;
  }

  /**
   * Sets the value of the CMIElement.
   *
   * @param {string} callbackName
   * @param {boolean} checkTerminated
   * @param {string} CMIElement
   * @param {any} value
   * @return {string}
   */
  setValue(
      callbackName: String,
      checkTerminated: boolean,
      CMIElement,
      value) {
    let returnValue = '';

    if (_self.checkState(checkTerminated, _self.#error_codes.STORE_BEFORE_INIT,
        _self.#error_codes.STORE_AFTER_TERM)) {
      if (checkTerminated) _self.lastErrorCode = 0;
      returnValue = _self.setCMIValue(CMIElement, value);
      _self.processListeners(callbackName, CMIElement, value);
    }

    _self.apiLog(callbackName, CMIElement,
        ': ' + value + ': result: ' + returnValue,
        api_constants.LOG_LEVEL_INFO);
    _self.clearSCORMError(returnValue);

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
    let returnValue = api_constants.SCORM_FALSE;

    if (_self.checkState(checkTerminated, _self.#error_codes.COMMIT_BEFORE_INIT,
        _self.#error_codes.COMMIT_AFTER_TERM)) {
      if (checkTerminated) _self.lastErrorCode = 0;
      returnValue = api_constants.SCORM_TRUE;
      _self.processListeners(callbackName);
    }

    _self.apiLog(callbackName, null, 'returned: ' + returnValue,
        api_constants.LOG_LEVEL_INFO);
    _self.clearSCORMError(returnValue);

    return returnValue;
  }

  /**
   * Returns last error code
   * @param {string} callbackName
   * @return {string}
   */
  getLastError(callbackName: String) {
    const returnValue = String(_self.lastErrorCode);

    _self.processListeners(callbackName);

    _self.apiLog(callbackName, null, 'returned: ' + returnValue,
        api_constants.LOG_LEVEL_INFO);

    return returnValue;
  }

  /**
   * Returns the errorNumber error description
   *
   * @param {string} callbackName
   * @param {number} CMIErrorCode
   * @return {string}
   */
  getErrorString(callbackName: String, CMIErrorCode) {
    let returnValue = '';

    if (CMIErrorCode !== null && CMIErrorCode !== '') {
      returnValue = _self.getLmsErrorMessageDetails(CMIErrorCode);
      _self.processListeners(callbackName);
    }

    _self.apiLog(callbackName, null, 'returned: ' + returnValue,
        api_constants.LOG_LEVEL_INFO);

    return returnValue;
  }

  /**
   * Returns a comprehensive description of the errorNumber error.
   *
   * @param callbackName
   * @param CMIErrorCode
   * @return {string}
   */
  getDiagnostic(callbackName: String, CMIErrorCode) {
    let returnValue = '';

    if (CMIErrorCode !== null && CMIErrorCode !== '') {
      returnValue = _self.getLmsErrorMessageDetails(CMIErrorCode, true);
      _self.processListeners(callbackName);
    }

    _self.apiLog(callbackName, null, 'returned: ' + returnValue,
        api_constants.LOG_LEVEL_INFO);

    return returnValue;
  }

  /**
   * Checks the LMS state and ensures it has been initialized
   */
  checkState(
      checkTerminated: boolean, beforeInitError: number,
      afterTermError?: number) {
    if (_self.isNotInitialized()) {
      _self.throwSCORMError(beforeInitError);
      return false;
    } else if (checkTerminated && _self.isTerminated()) {
      _self.throwSCORMError(afterTermError);
      return false;
    }

    return true;
  }

  /**
   * Logging for all SCORM actions
   *
   * @param functionName
   * @param CMIElement
   * @param logMessage
   * @param messageLevel
   */
  apiLog(
      functionName: String, CMIElement: String, logMessage: String,
      messageLevel: number) {
    logMessage = _self.formatMessage(functionName, CMIElement, logMessage);

    if (messageLevel >= _self.apiLogLevel) {
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
   * Clears the last SCORM error code on success
   */
  clearSCORMError(success: String) {
    if (success !== api_constants.SCORM_FALSE) {
      _self.lastErrorCode = 0;
    }
  }

  /**
   * Formats the SCORM messages for easy reading
   *
   * @param functionName
   * @param CMIElement
   * @param message
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
   * @param str String to check against
   * @param tester String to check for
   */
  stringContains(str: String, tester: String) {
    return str.indexOf(tester) > -1;
  }

  /**
   * Returns the message that corresponds to errorNumber
   * APIs that inherit BaseAPI should override this function
   */
  getLmsErrorMessageDetails(_errorNumber, _detail) {
    return 'No error';
  }

  /**
   * Gets the value for the specific element.
   * APIs that inherit BaseAPI should override this function
   */
  getCMIValue(_CMIElement) {
    return '';
  }

  /**
   * Sets the value for the specific element.
   * APIs that inherit BaseAPI should override this function
   */
  setCMIValue(_CMIElement, _value) {
    return '';
  }

  _commonSetCMIValue(
      methodName: String, scorm2004: boolean, CMIElement, value) {
    if (!CMIElement || CMIElement === '') {
      return api_constants.SCORM_FALSE;
    }

    const structure = CMIElement.split('.');
    let refObject = this;
    let returnValue = api_constants.SCORM_FALSE;

    const invalidErrorMessage = `The data model element passed to ${methodName} (${CMIElement}) is not a valid SCORM data model element.`;
    const invalidErrorCode = scorm2004 ?
        _self.#error_codes.UNDEFINED_DATA_MODEL :
        _self.#error_codes.GENERAL;

    for (let i = 0; i < structure.length; i++) {
      const attribute = structure[i];

      if (i === structure.length - 1) {
        if (scorm2004 && (attribute.substr(0, 8) === '{target=') &&
            (typeof refObject._isTargetValid == 'function')) {
          _self.throwSCORMError(_self.#error_codes.READ_ONLY_ELEMENT);
        } else if (!refObject.hasOwnProperty(attribute)) {
          _self.throwSCORMError(invalidErrorCode, invalidErrorMessage);
        } else {
          if (_self.stringContains(CMIElement, '.correct_responses')) {
            _self.validateCorrectResponse(CMIElement, value);
          }

          if (!scorm2004 || _self.lastErrorCode === 0) {
            refObject[attribute] = value;
            returnValue = api_constants.SCORM_TRUE;
          }
        }
      } else {
        refObject = refObject[attribute];
        if (!refObject) {
          _self.throwSCORMError(invalidErrorCode, invalidErrorMessage);
          break;
        }

        if (refObject.prototype === CMIArray) {
          const index = parseInt(structure[i + 1], 10);

          // SCO is trying to set an item on an array
          if (!isNaN(index)) {
            const item = refObject.childArray[index];

            if (item) {
              refObject = item;
            } else {
              const newChild = _self.getChildElement(CMIElement, value);

              if (!newChild) {
                _self.throwSCORMError(invalidErrorCode, invalidErrorMessage);
              } else {
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

    if (returnValue === api_constants.SCORM_FALSE) {
      _self.apiLog(methodName, null,
          `There was an error setting the value for: ${CMIElement}, value of: ${value}`,
          api_constants.LOG_LEVEL_WARNING);
    }

    return returnValue;
  }

  validateCorrectResponse(_CMIElement, _value) {
    return false;
  }

  /**
   * Gets or builds a new child element to add to the array.
   * APIs that inherit BaseAPI should override this method
   */
  getChildElement(_CMIElement) {
    return null;
  }

  /**
   * Gets a value from the CMI Object
   *
   * @param methodName
   * @param scorm2004
   * @param CMIElement
   * @return {*}
   */
  _commonGetCMIValue(methodName: String, scorm2004: boolean, CMIElement) {
    if (!CMIElement || CMIElement === '') {
      return '';
    }

    const structure = CMIElement.split('.');
    let refObject = this;
    let attribute = null;

    for (let i = 0; i < structure.length; i++) {
      attribute = structure[i];

      if (!scorm2004) {
        if (i === structure.length - 1) {
          if (!refObject.hasOwnProperty(attribute)) {
            _self.throwSCORMError(101,
                'getCMIValue did not find a value for: ' + CMIElement);
          }
        }
      } else {
        if ((String(attribute).substr(0, 8) === '{target=') &&
            (typeof refObject._isTargetValid == 'function')) {
          const target = String(attribute).
              substr(8, String(attribute).length - 9);
          return refObject._isTargetValid(target);
        } else if (!refObject.hasOwnProperty(attribute)) {
          _self.throwSCORMError(401,
              'The data model element passed to GetValue (' + CMIElement +
              ') is not a valid SCORM data model element.');
          return '';
        }
      }

      refObject = refObject[attribute];
    }

    if (refObject === null || refObject === undefined) {
      if (!scorm2004) {
        if (attribute === '_children') {
          _self.throwSCORMError(202);
        } else if (attribute === '_count') {
          _self.throwSCORMError(203);
        }
      }
      return '';
    } else {
      return refObject;
    }
  }

  /**
   * Returns true if the API's current state is STATE_INITIALIZED
   */
  isInitialized() {
    return _self.currentState === api_constants.STATE_INITIALIZED;
  }

  /**
   * Returns true if the API's current state is STATE_NOT_INITIALIZED
   */
  isNotInitialized() {
    return _self.currentState === api_constants.STATE_NOT_INITIALIZED;
  }

  /**
   * Returns true if the API's current state is STATE_TERMINATED
   */
  isTerminated() {
    return _self.currentState === api_constants.STATE_TERMINATED;
  }

  /**
   * Provides a mechanism for attaching to a specific SCORM event
   *
   * @param listenerName
   * @param callback
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

      _self.listenerArray.push({
        functionName: functionName,
        CMIElement: CMIElement,
        callback: callback,
      });
    }
  }

  /**
   * Processes any 'on' listeners that have been created
   *
   * @param functionName
   * @param CMIElement
   * @param value
   */
  processListeners(functionName: String, CMIElement: String, value: any) {
    for (let i = 0; i < _self.listenerArray.length; i++) {
      const listener = _self.listenerArray[i];
      const functionsMatch = listener.functionName === functionName;
      const listenerHasCMIElement = !!listener.CMIElement;
      const CMIElementsMatch = listener.CMIElement === CMIElement;

      if (functionsMatch && (!listenerHasCMIElement || CMIElementsMatch)) {
        listener.callback(CMIElement, value);
      }
    }
  }

  /**
   * Throws a SCORM error
   *
   * @param errorNumber
   * @param message
   */
  throwSCORMError(errorNumber: number, message: String) {
    if (!message) {
      message = _self.getLmsErrorMessageDetails(errorNumber);
    }

    _self.apiLog('throwSCORMError', null, errorNumber + ': ' + message,
        api_constants.LOG_LEVEL_ERROR);

    _self.lastErrorCode = String(errorNumber);
  }

  /**
   * Loads CMI data from a JSON object.
   */
  loadFromJSON(json, CMIElement) {
    if (!_self.isNotInitialized()) {
      console.error(
          'loadFromJSON can only be called before the call to LMSInitialize.');
      return;
    }

    CMIElement = CMIElement || 'cmi';

    for (const key in json) {
      if (json.hasOwnProperty(key) && json[key]) {
        const currentCMIElement = CMIElement + '.' + key;
        const value = json[key];

        if (value['childArray']) {
          for (let i = 0; i < value['childArray'].length; i++) {
            _self.loadFromJSON(value['childArray'][i],
                currentCMIElement + '.' + i);
          }
        } else if (value.constructor === Object) {
          _self.loadFromJSON(value, currentCMIElement);
        } else {
          _self.setCMIValue(currentCMIElement, value);
        }
      }
    }
  }

  renderCMIToJSON() {
    const cmi = _self.cmi;
    // Do we want/need to return fields that have no set value?
    // return JSON.stringify({ cmi }, (k, v) => v === undefined ? null : v, 2);
    return JSON.stringify({cmi});
  }

  /**
   * Check if the value matches the proper format. If not, throw proper error code.
   *
   * @param value
   * @param regexPattern
   * @return {boolean}
   */
  checkValidFormat(value: String, regexPattern: String) {
    const formatRegex = new RegExp(regexPattern);
    if (!value || !value.match(formatRegex)) {
      _self.throwSCORMError(_self.#error_codes.TYPE_MISMATCH);
      return false;
    }
    return true;
  }

  /**
   * Check if the value matches the proper range. If not, throw proper error code.
   *
   * @param value
   * @param rangePattern
   * @return {boolean}
   */
  checkValidRange(value: any, rangePattern: String) {
    const ranges = rangePattern.split('#');
    value = value * 1.0;
    if (value >= ranges[0]) {
      if ((ranges[1] === '*') || (value <= ranges[1])) {
        _self.clearSCORMError(api_constants.SCORM_TRUE);
        return true;
      } else {
        _self.throwSCORMError(_self.#error_codes.VALUE_OUT_OF_RANGE);
        return false;
      }
    } else {
      _self.throwSCORMError(_self.#error_codes.VALUE_OUT_OF_RANGE);
      return false;
    }
  }

  /**
   * Throws a SCORM error
   *
   * @param when the number of milliseconds to wait before committing
   */
  scheduleCommit(when: number) {
    _self.#timeout = new ScheduledCommit(this, when);
  }

  /**
   * Clears and cancels any currently scheduled commits
   */
  clearScheduledCommit() {
    if (_self.#timeout) {
      _self.#timeout.cancel();
      _self.#timeout = null;
    }
  }
}

class ScheduledCommit {
  #API;
  #cancelled: false;
  #timeout;

  constructor(API: any, when: number) {
    _self.#API = API;
    _self.#timeout = setTimeout(_self.#wrapper, when);
  }

  cancel() {
    _self.#cancelled = true;
    if (_self.#timeout) {
      clearTimeout(_self.#timeout);
    }
  }

  #wrapper = () => {
    if (!_self.#cancelled) {
      _self.#API.LMSCommit();
    }
  };
}
