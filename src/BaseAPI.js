/*
 * Copyright (C) Noverant, Inc - All Rights Reserved Unauthorized copying of this file, via any
 * medium is strictly prohibited Proprietary and confidential
 */

// @flow
import {CMIArray} from "./cmi/common";
import {base_error_codes} from "./constants";

const api_constants = {
    SCORM_TRUE: "true",
    SCORM_FALSE: "false",
    STATE_NOT_INITIALIZED: 0,
    STATE_INITIALIZED: 1,
    STATE_TERMINATED: 2,
    LOG_LEVEL_DEBUG: 1,
    LOG_LEVEL_INFO: 2,
    LOG_LEVEL_WARNING: 3,
    LOG_LEVEL_ERROR: 4,
    LOG_LEVEL_NONE: 5
};

export default class BaseAPI {
    #timeout;
    #error_codes;
    cmi;

    constructor(error_codes) {
        this.currentState = api_constants.STATE_NOT_INITIALIZED;
        this.apiLogLevel = api_constants.LOG_LEVEL_ERROR;
        this.lastErrorCode = 0;
        this.listenerArray = [];

        this.#timeout = null;
        this.#error_codes = error_codes;
    }

    /**
     * @returns {string} bool
     */
    APIInitialize(callbackName: String, initializeMessage?: String, terminationMessage?: String) {
        let returnValue = api_constants.SCORM_FALSE;

        if (this.isInitialized()) {
            this.throwSCORMError(this.#error_codes.INITIALIZED, initializeMessage);
        } else if (this.isTerminated()) {
            this.throwSCORMError(this.#error_codes.TERMINATED, terminationMessage);
        } else {
            this.currentState = api_constants.STATE_INITIALIZED;
            this.lastErrorCode = 0;
            returnValue = api_constants.SCORM_TRUE;
            this.processListeners(callbackName);
        }

        this.apiLog(callbackName, null, "returned: " + returnValue, api_constants.LOG_LEVEL_INFO);
        this.clearSCORMError(returnValue);

        return returnValue;
    }

    /**
     * @returns {string} bool
     */
    APITerminate(callbackName: String, checkTerminated: boolean) {
        let returnValue = api_constants.SCORM_FALSE;

        if (this.checkState(checkTerminated, this.#error_codes.TERMINATION_BEFORE_INIT, this.#error_codes.MULTIPLE_TERMINATION)) {
            if (checkTerminated) this.lastErrorCode = 0;
            this.currentState = api_constants.STATE_TERMINATED;
            returnValue = api_constants.SCORM_TRUE;
            this.processListeners(callbackName);
        }

        this.apiLog(callbackName, null, "returned: " + returnValue, api_constants.LOG_LEVEL_INFO);
        this.clearSCORMError(returnValue);

        return returnValue;
    }

    /**
     * @param callbackName
     * @param checkTerminated
     * @param CMIElement
     * @returns {string}
     */
    APIGetValue(callbackName: String, checkTerminated: boolean, CMIElement) {
        let returnValue = "";

        if (this.checkState(checkTerminated, this.#error_codes.RETRIEVE_BEFORE_INIT, this.#error_codes.RETRIEVE_AFTER_TERM)) {
            if (checkTerminated) this.lastErrorCode = 0;
            returnValue = this.getCMIValue(CMIElement);
            this.processListeners(callbackName, CMIElement);
        }

        this.apiLog(callbackName, CMIElement, ": returned: " + returnValue, api_constants.LOG_LEVEL_INFO);
        this.clearSCORMError(returnValue);

        return returnValue;
    }

    /**
     * @param callbackName
     * @param checkTerminated
     * @param CMIElement
     * @param value
     * @returns {string}
     */
    APISetValue(callbackName: String, checkTerminated: boolean, CMIElement, value) {
        let returnValue = "";

        if (this.checkState(checkTerminated, this.#error_codes.STORE_BEFORE_INIT, this.#error_codes.STORE_AFTER_TERM)) {
            if (checkTerminated) this.lastErrorCode = 0;
            returnValue = this.setCMIValue(CMIElement, value);
            this.processListeners(callbackName, CMIElement, value);
        }

        this.apiLog(callbackName, CMIElement, ": " + value + ": result: " + returnValue, api_constants.LOG_LEVEL_INFO);
        this.clearSCORMError(returnValue);

        return returnValue;
    }

    /**
     * Orders LMS to store all content parameters
     *
     * @returns {string} bool
     */
    APICommit(callbackName: String, checkTerminated: boolean) {
        let returnValue = api_constants.SCORM_FALSE;

        if (this.checkState(checkTerminated, this.#error_codes.COMMIT_BEFORE_INIT, this.#error_codes.COMMIT_AFTER_TERM)) {
            if (checkTerminated) this.lastErrorCode = 0;
            returnValue = api_constants.SCORM_TRUE;
            this.processListeners(callbackName);
        }

        this.apiLog(callbackName, null, "returned: " + returnValue, api_constants.LOG_LEVEL_INFO);
        this.clearSCORMError(returnValue);

        return returnValue;
    }

    /**
     * Returns last error code
     *
     * @returns {string}
     */
    APIGetLastError(callbackName: String) {
        let returnValue = String(this.lastErrorCode);

        this.processListeners(callbackName);

        this.apiLog(callbackName, null, "returned: " + returnValue, api_constants.LOG_LEVEL_INFO);

        return returnValue;
    }

    /**
     * Returns the errorNumber error description
     *
     * @param callbackName
     * @param CMIErrorCode
     * @returns {string}
     */
    APIGetErrorString(callbackName: String, CMIErrorCode) {
        let returnValue = "";

        if (CMIErrorCode !== null && CMIErrorCode !== "") {
            returnValue = this.getLmsErrorMessageDetails(CMIErrorCode);
            this.processListeners(callbackName);
        }

        this.apiLog(callbackName, null, "returned: " + returnValue, api_constants.LOG_LEVEL_INFO);

        return returnValue;
    }

    /**
     * Returns a comprehensive description of the errorNumber error.
     *
     * @param callbackName
     * @param CMIErrorCode
     * @returns {string}
     */
    APIGetDiagnostic(callbackName: String, CMIErrorCode) {
        let returnValue = "";

        if (CMIErrorCode !== null && CMIErrorCode !== "") {
            returnValue = this.getLmsErrorMessageDetails(CMIErrorCode, true);
            this.processListeners(callbackName);
        }

        this.apiLog(callbackName, null, "returned: " + returnValue, api_constants.LOG_LEVEL_INFO);

        return returnValue;
    }

    /**
     * Checks the LMS state and ensures it has been initialized
     */
    checkState(checkTerminated: boolean, beforeInitError: number, afterTermError?: number) {
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
     * @param functionName
     * @param CMIElement
     * @param logMessage
     * @param messageLevel
     */
    apiLog(functionName: String, CMIElement: String, logMessage: String, messageLevel: number) {
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
    };

    /**
     * Clears the last SCORM error code on success
     */
    clearSCORMError(success: String) {
        if (success !== api_constants.SCORM_FALSE) {
            this.lastErrorCode = 0;
        }
    };

    /**
     * Formats the SCORM messages for easy reading
     *
     * @param functionName
     * @param CMIElement
     * @param message
     * @returns {string}
     */
    formatMessage(functionName: String, CMIElement: String, message: String) {
        let baseLength = 20;
        let messageString = "";

        messageString += functionName;

        let fillChars = baseLength - messageString.length;

        for (let i = 0; i < fillChars; i++) {
            messageString += " ";
        }

        messageString += ": ";

        if (CMIElement) {
            let CMIElementBaseLength = 70;

            messageString += CMIElement;

            fillChars = CMIElementBaseLength - messageString.length;

            for (let j = 0; j < fillChars; j++) {
                messageString += " ";
            }
        }

        if (message) {
            messageString += message;
        }

        return messageString;
    };

    /**
     * Checks to see if {str} contains {tester}
     *
     * @param str String to check against
     * @param tester String to check for
     */
    stringContains(str: String, tester: String) {
        return str.indexOf(tester) > -1;
    };

    /**
     * Returns the message that corresponds to errorNumber
     * APIs that inherit BaseAPI should override this function
     */
    getLmsErrorMessageDetails(_errorNumber, _detail) {
        return "No error";
    }

    /**
     * Gets the value for the specific element.
     * APIs that inherit BaseAPI should override this function
     */
    getCMIValue(_CMIElement) {
        return "";
    }

    /**
     * Sets the value for the specific element.
     * APIs that inherit BaseAPI should override this function
     */
    setCMIValue(_CMIElement, _value) {
        return "";
    }

    _commonSetCMIValue(methodName: String, scorm2004: boolean, CMIElement, value) {
        if (!CMIElement || CMIElement === "") {
            return api_constants.SCORM_FALSE;
        }

        let structure = CMIElement.split(".");
        let refObject = this;
        let returnValue = api_constants.SCORM_FALSE;

        const invalidErrorMessage = `The data model element passed to ${methodName} (${CMIElement}) is not a valid SCORM data model element.`;
        const invalidErrorCode = scorm2004 ? this.#error_codes.UNDEFINED_DATA_MODEL: this.#error_codes.GENERAL;

        for (let i = 0; i < structure.length; i++) {
            let attribute = structure[i];

            if (i === structure.length - 1) {
                if (scorm2004 && (attribute.substr(0, 8) === "{target=") && (typeof refObject._isTargetValid == "function")) {
                    this.throwSCORMError(this.#error_codes.READ_ONLY_ELEMENT);
                } else if (!refObject.hasOwnProperty(attribute)) {
                    this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
                } else {
                    if (this.stringContains(CMIElement, ".correct_responses")){
                        this.validateCorrectResponse(CMIElement, value)
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

                if (refObject.prototype === CMIArray) {
                    let index = parseInt(structure[i + 1], 10);

                    // SCO is trying to set an item on an array
                    if (!isNaN(index)) {
                        let item = refObject.childArray[index];

                        if (item) {
                            refObject = item;
                        } else {
                            let newChild = this.getChildElement(CMIElement, value);

                            if (!newChild) {
                                this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
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
            this.apiLog(methodName, null, `There was an error setting the value for: ${CMIElement}, value of: ${value}`, api_constants.LOG_LEVEL_WARNING);
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
        return null
    }

    /**
     * Gets a value from the CMI Object
     *
     * @param methodName
     * @param scorm2004
     * @param CMIElement
     * @returns {*}
     */
    _commonGetCMIValue(methodName: String, scorm2004: boolean, CMIElement) {
        if (!CMIElement || CMIElement === "") {
            return "";
        }

        let structure = CMIElement.split(".");
        let refObject = this;
        let attribute = null;

        for (let i = 0; i < structure.length; i++) {
            attribute = structure[i];

            if(!scorm2004) {
                if (i === structure.length - 1) {
                    if (!refObject.hasOwnProperty(attribute)) {
                        this.throwSCORMError(101, "getCMIValue did not find a value for: " + CMIElement);
                    }
                }
            } else {
                if ((String(attribute).substr(0, 8) === "{target=") && (typeof refObject._isTargetValid == "function")) {
                    let target = String(attribute).substr(8, String(attribute).length - 9);
                    return refObject._isTargetValid(target);
                } else if (!refObject.hasOwnProperty(attribute)) {
                    this.throwSCORMError(401, "The data model element passed to GetValue (" + CMIElement + ") is not a valid SCORM data model element.");
                    return "";
                }
            }

            refObject = refObject[attribute];
        }

        if (refObject === null || refObject === undefined) {
            if(!scorm2004) {
                if (attribute === "_children") {
                    this.throwSCORMError(202);
                } else if (attribute === "_count") {
                    this.throwSCORMError(203);
                }
            }
            return "";
        } else {
            return refObject;
        }
    }

    /**
     * Returns true if the API's current state is STATE_INITIALIZED
     */
    isInitialized() {
        return this.currentState === api_constants.STATE_INITIALIZED;
    }

    /**
     * Returns true if the API's current state is STATE_NOT_INITIALIZED
     */
    isNotInitialized() {
        return this.currentState === api_constants.STATE_NOT_INITIALIZED;
    }

    /**
     * Returns true if the API's current state is STATE_TERMINATED
     */
    isTerminated() {
        return this.currentState === api_constants.STATE_TERMINATED;
    }

    /**
     * Provides a mechanism for attaching to a specific SCORM event
     *
     * @param listenerName
     * @param callback
     */
    on(listenerName: String, callback: function) {
        if (!callback) return;

        let listenerFunctions = listenerName.split(" ");
        for (let i = 0; i < listenerFunctions.length; i++) {
            let listenerSplit = listenerFunctions[i].split(".");
            if (listenerSplit.length === 0) return;

            let functionName = listenerSplit[0];

            let CMIElement = null;
            if (listenerSplit.length > 1) {
                CMIElement = listenerName.replace(functionName + ".", "");
            }

            this.listenerArray.push({
                functionName: functionName,
                CMIElement: CMIElement,
                callback: callback
            });
        }
    };

    /**
     * Processes any 'on' listeners that have been created
     *
     * @param functionName
     * @param CMIElement
     * @param value
     */
    processListeners(functionName: String, CMIElement: String, value: any) {
        for (let i = 0; i < this.listenerArray.length; i++) {
            let listener = this.listenerArray[i];
            let functionsMatch = listener.functionName === functionName;
            let listenerHasCMIElement = !!listener.CMIElement;
            let CMIElementsMatch = listener.CMIElement === CMIElement;

            if (functionsMatch && (!listenerHasCMIElement || CMIElementsMatch)) {
                listener.callback(CMIElement, value);
            }
        }
    };

    /**
     * Throws a SCORM error
     *
     * @param errorNumber
     * @param message
     */
    throwSCORMError(errorNumber: number, message: String) {
        if (!message) {
            message = this.getLmsErrorMessageDetails(errorNumber);
        }

        this.apiLog("throwSCORMError", null, errorNumber + ": " + message, api_constants.LOG_LEVEL_ERROR);

        this.lastErrorCode = String(errorNumber);
    }

    /**
     * Loads CMI data from a JSON object.
     */
    loadFromJSON(json, CMIElement) {
        if (!this.isNotInitialized()) {
            console.error("loadFromJSON can only be called before the call to LMSInitialize.");
            return;
        }

        CMIElement = CMIElement || "cmi";

        for (let key in json) {
            if (json.hasOwnProperty(key) && json[key]) {
                let currentCMIElement = CMIElement + "." + key;
                let value = json[key];

                if (value["childArray"]) {
                    for (let i = 0; i < value["childArray"].length; i++) {
                        this.loadFromJSON(value["childArray"][i], currentCMIElement + "." + i);
                    }
                } else if (value.constructor === Object) {
                    this.loadFromJSON(value, currentCMIElement);
                } else {
                    this.setCMIValue(currentCMIElement, value);
                }
            }
        }
    }

    renderCMIToJSON() {
        let cmi = this.cmi;
        // Do we want/need to return fields that have no set value?
        // return JSON.stringify({ cmi }, (k, v) => v === undefined ? null : v, 2);
        return JSON.stringify({ cmi });
    }

    /**
     * Check if the value matches the proper format. If not, throw proper error code.
     *
     * @param value
     * @param regexPattern
     * @returns {boolean}
     */
    checkValidFormat(value: String, regexPattern: String) {
        const formatRegex = new RegExp(regexPattern);
        if(!value || !value.match(formatRegex)) {
            this.throwSCORMError(this.#error_codes.TYPE_MISMATCH);
            return false;
        }
        return true;
    }



    /**
     * Check if the value matches the proper range. If not, throw proper error code.
     *
     * @param value
     * @param rangePattern
     * @returns {boolean}
     */
    checkValidRange(value: any, rangePattern: String) {
        const ranges = rangePattern.split('#');
        value = value * 1.0;
        if(value >= ranges[0]) {
            if((ranges[1] === '*') || (value <= ranges[1])) {
                this.clearSCORMError(api_constants.SCORM_TRUE);
                return true;
            } else {
                this.throwSCORMError(this.#error_codes.VALUE_OUT_OF_RANGE);
                return false;
            }
        } else {
            this.throwSCORMError(this.#error_codes.VALUE_OUT_OF_RANGE);
            return false;
        }
    }

    /**
     * Throws a SCORM error
     *
     * @param when the number of milliseconds to wait before committing
     */
    scheduleCommit(when: number) {
        this.#timeout = new ScheduledCommit(this, when);
    }

    /**
     * Clears and cancels any currently scheduled commits
     */
    clearScheduledCommit() {
        if (this.#timeout) {
            this.#timeout.cancel();
            this.#timeout = null;
        }
    }
}

class ScheduledCommit {
    #API;
    #cancelled: false;
    #timeout;

    constructor(API: any, when: number) {
        this.#API = API;
        this.#timeout = setTimeout(this.#wrapper, when);
    }

    cancel() {
        this.#cancelled = true;
        if (this.#timeout) {
            clearTimeout(this.#timeout);
        }
    }

    #wrapper() {
        if (!this.#cancelled) {
            this.#API.LMSCommit();
        }
    }
}
