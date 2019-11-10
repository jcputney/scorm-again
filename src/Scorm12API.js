/*
 * Copyright (C) Noverant, Inc - All Rights Reserved Unauthorized copying of this file, via any
 * medium is strictly prohibited Proprietary and confidential
 */

// @flow
import BaseAPI from './BaseAPI';
import {
    CMI,
    CMIInteractionsCorrectResponsesObject,
    CMIInteractionsObject, CMIInteractionsObjectivesObject,
    CMIObjectivesObject
} from "./cmi/scorm12_cmi";
import * as Utilities from './utilities';
import {scorm12_constants, scorm12_error_codes} from "./constants";
import {scorm12_regex} from "./regex";

const constants = scorm12_constants;

export default class Scorm12API extends BaseAPI {
    constructor() {
        super(scorm12_error_codes);

        this.cmi = new CMI(this);
    }

    /**
     * @returns {string} bool
     */
    LMSInitialize() {
        return this.APIInitialize("LMSInitialize", "LMS was already initialized!", "LMS is already finished!");
    }

    /**
     * @returns {string} bool
     */
    LMSFinish() {
        return this.APITerminate("LMSFinish", false);
    }

    /**
     * @param CMIElement
     * @returns {string}
     */
    LMSGetValue(CMIElement) {
        return this.APIGetValue("LMSGetValue", false, CMIElement);
    }

    /**
     * @param CMIElement
     * @param value
     * @returns {string}
     */
    LMSSetValue(CMIElement, value) {
        return this.APISetValue("LMSSetValue", false, CMIElement, value);
    }

    /**
     * Orders LMS to store all content parameters
     *
     * @returns {string} bool
     */
    LMSCommit() {
        return this.APICommit("LMSCommit", false);
    }

    /**
     * Returns last error code
     *
     * @returns {string}
     */
    LMSGetLastError() {
        return this.APIGetLastError("LMSGetLastError");
    }

    /**
     * Returns the errorNumber error description
     *
     * @param CMIErrorCode
     * @returns {string}
     */
    LMSGetErrorString(CMIErrorCode) {
        return this.APIGetErrorString("LMSGetErrorString", CMIErrorCode);
    }

    /**
     * Returns a comprehensive description of the errorNumber error.
     *
     * @param CMIErrorCode
     * @returns {string}
     */
    LMSGetDiagnostic(CMIErrorCode) {
        return this.APIGetDiagnostic("LMSGetDiagnostic", CMIErrorCode);
    }

    /**
     * Sets a value on the CMI Object
     *
     * @param CMIElement
     * @param value
     * @returns {string}
     */
    setCMIValue(CMIElement, value) {
        this._commonSetCMIValue("LMSSetValue", false, CMIElement, value);
    }

    /**
     * Gets a value from the CMI Object
     *
     * @param CMIElement
     * @returns {*}
     */
    getCMIValue(CMIElement) {
        return this._commonGetCMIValue("getCMIValue", false,  CMIElement);
    }

    /**
     * Gets or builds a new child element to add to the array.
     *
     * @param CMIElement
     */
    getChildElement(CMIElement, value) {
        let newChild;

        if (this.stringContains(CMIElement, "cmi.objectives")) {
            newChild = new CMIObjectivesObject(this);
        } else if (this.stringContains(CMIElement, ".correct_responses")) {
            newChild = new CMIInteractionsCorrectResponsesObject(this);
        } else if (this.stringContains(CMIElement, ".objectives")) {
            newChild = new CMIInteractionsObjectivesObject(this);
        } else if (this.stringContains(CMIElement, "cmi.interactions")) {
            newChild = new CMIInteractionsObject(this);
        }

        return newChild;
    }

    validateCorrectResponse(CMIElement, value) {
        return true;
    }

    /**
     * Returns the message that corresponds to errorNumber.
     */
    getLmsErrorMessageDetails(errorNumber, detail) {
        let basicMessage = "No Error";
        let detailMessage = "No Error";

        // Set error number to string since inconsistent from modules if string or number
        errorNumber = String(errorNumber);
        if(constants.error_descriptions[errorNumber]) {
            basicMessage = constants.error_descriptions[errorNumber].basicMessage;
            detailMessage = constants.error_descriptions[errorNumber].detailMessage;
        }

        return detail ? detailMessage : basicMessage;
    }

    /**
     * Adds the current session time to the existing total time.
     */
    getCurrentTotalTime() {
        const timeRegex = new RegExp(scorm12_regex.CMITime);

        const totalTime = this.cmi.core.total_time;
        const sessionTime = this.cmi.core.session_time;

        const totalSeconds = Utilities.getTimeAsSeconds(totalTime, timeRegex);
        const sessionSeconds = Utilities.getTimeAsSeconds(sessionTime, timeRegex);

        return Utilities.getSecondsAsHHMMSS(totalSeconds + sessionSeconds);
    }

    /**
     * Replace the whole API with another
     */
    replaceWithAnotherScormAPI(newAPI) {
        // Data Model
        this.cmi = newAPI.cmi;
    }
}
