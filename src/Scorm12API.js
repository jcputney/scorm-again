// @flow
import BaseAPI from './BaseAPI';
import {
  CMI,
  CMIInteractionsCorrectResponsesObject,
  CMIInteractionsObject,
  CMIInteractionsObjectivesObject,
  CMIObjectivesObject,
} from './cmi/scorm12_cmi';
import * as Utilities from './utilities';
import {scorm12_constants} from './constants/api_constants';
import {scorm12_error_codes} from './constants/error_codes';
import {scorm12_regex} from './constants/regex';

const constants = scorm12_constants;

/**
 * API class for SCORM 1.2
 */
export default class Scorm12API extends BaseAPI {
  /**
   * Constructor for SCORM 1.2 API
   */
  constructor() {
    super(scorm12_error_codes);

    this.cmi = new CMI(this);
    // Rename functions to match 1.2 Spec and expose to modules
    this.LMSInitialize = this.lmsInitialize;
    this.LMSFinish = this.lmsFinish;
    this.LMSGetValue = this.lmsGetValue;
    this.LMSSetValue = this.lmsSetValue;
    this.LMSCommit = this.lmsCommit;
    this.LMSGetLastError = this.lmsGetLastError;
    this.LMSGetErrorString = this.lmsGetErrorString;
    this.LMSGetDiagnostic = this.lmsGetDiagnostic;
  }

  /**
   * lmsInitialize function from SCORM 1.2 Spec
   *
   * @return {string} bool
   */
  lmsInitialize() {
    return this.initialize('LMSInitialize', 'LMS was already initialized!',
        'LMS is already finished!');
  }

  /**
   * LMSFinish function from SCORM 1.2 Spec
   *
   * @return {string} bool
   */
  lmsFinish() {
    return this.terminate('LMSFinish', false);
  }

  /**
   * LMSGetValue function from SCORM 1.2 Spec
   *
   * @param {string} CMIElement
   * @return {string}
   */
  lmsGetValue(CMIElement) {
    return this.getValue('LMSGetValue', false, CMIElement);
  }

  /**
   * LMSSetValue function from SCORM 1.2 Spec
   *
   * @param {string} CMIElement
   * @param {*} value
   * @return {string}
   */
  lmsSetValue(CMIElement, value) {
    return this.setValue('LMSSetValue', false, CMIElement, value);
  }

  /**
   * LMSCommit function from SCORM 1.2 Spec
   *
   * @return {string} bool
   */
  lmsCommit() {
    return this.commit('LMSCommit', false);
  }

  /**
   * LMSGetLastError function from SCORM 1.2 Spec
   *
   * @return {string}
   */
  lmsGetLastError() {
    return this.getLastError('LMSGetLastError');
  }

  /**
   * LMSGetErrorString function from SCORM 1.2 Spec
   *
   * @param {string} CMIErrorCode
   * @return {string}
   */
  lmsGetErrorString(CMIErrorCode) {
    return this.getErrorString('LMSGetErrorString', CMIErrorCode);
  }

  /**
   * LMSGetDiagnostic function from SCORM 1.2 Spec
   *
   * @param {string} CMIErrorCode
   * @return {string}
   */
  lmsGetDiagnostic(CMIErrorCode) {
    return this.getDiagnostic('LMSGetDiagnostic', CMIErrorCode);
  }

  /**
   * Sets a value on the CMI Object
   *
   * @param {string} CMIElement
   * @param {*} value
   */
  setCMIValue(CMIElement, value) {
    this._commonSetCMIValue('LMSSetValue', false, CMIElement, value);
  }

  /**
   * Gets a value from the CMI Object
   *
   * @param {string} CMIElement
   * @return {*}
   */
  getCMIValue(CMIElement) {
    return this._commonGetCMIValue('getCMIValue', false, CMIElement);
  }

  /**
   * Gets or builds a new child element to add to the array.
   *
   * @param {string} CMIElement
   * @param {*} value
   * @return {object}
   */
  getChildElement(CMIElement, value) {
    let newChild;

    if (this.stringContains(CMIElement, 'cmi.objectives')) {
      newChild = new CMIObjectivesObject(this);
    } else if (this.stringContains(CMIElement, '.correct_responses')) {
      newChild = new CMIInteractionsCorrectResponsesObject(this);
    } else if (this.stringContains(CMIElement, '.objectives')) {
      newChild = new CMIInteractionsObjectivesObject(this);
    } else if (this.stringContains(CMIElement, 'cmi.interactions')) {
      newChild = new CMIInteractionsObject(this);
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
  validateCorrectResponse(CMIElement, value) {
    return true;
  }

  /**
   * Returns the message that corresponds to errorNumber.
   *
   * @param {*} errorNumber
   * @param {boolean }detail
   * @return {string}
   */
  getLmsErrorMessageDetails(errorNumber, detail) {
    let basicMessage = 'No Error';
    let detailMessage = 'No Error';

    // Set error number to string since inconsistent from modules if string or number
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
  getCurrentTotalTime() {
    const timeRegex = new RegExp(scorm12_regex.CMITime);

    const totalTime = this.cmi.core.total_time;
    const sessionTime = this.cmi.core.session_time;

    return Utilities.addHHMMSSTimeStrings(totalTime, sessionTime, timeRegex);
  }

  /**
   * Replace the whole API with another
   *
   * @param {Scorm12API} newAPI
   */
  replaceWithAnotherScormAPI(newAPI) {
    // Data Model
    this.cmi = newAPI.cmi;
  }
}
