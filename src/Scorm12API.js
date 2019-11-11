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
import {scorm12_regex} from './regex';

const constants = scorm12_constants;

export default class Scorm12API extends BaseAPI {
  constructor() {
    super(scorm12_error_codes);

    this.cmi = new CMI(this);
  }

  /**
     * @return {string} bool
     */
  LMSInitialize() {
    return this.initialize('LMSInitialize', 'LMS was already initialized!',
        'LMS is already finished!');
  }

  /**
     * @return {string} bool
     */
  LMSFinish() {
    return this.terminate('LMSFinish', false);
  }

  /**
     * @param CMIElement
     * @return {string}
     */
  LMSGetValue(CMIElement) {
    return this.getValue('LMSGetValue', false, CMIElement);
  }

  /**
     * @param CMIElement
     * @param value
     * @return {string}
     */
  LMSSetValue(CMIElement, value) {
    return this.setValue('LMSSetValue', false, CMIElement, value);
  }

  /**
     * Orders LMS to store all content parameters
     *
     * @return {string} bool
     */
  LMSCommit() {
    return this.commit('LMSCommit', false);
  }

  /**
     * Returns last error code
     *
     * @return {string}
     */
  LMSGetLastError() {
    return this.getLastError('LMSGetLastError');
  }

  /**
     * Returns the errorNumber error description
     *
     * @param CMIErrorCode
     * @return {string}
     */
  LMSGetErrorString(CMIErrorCode) {
    return this.getErrorString('LMSGetErrorString', CMIErrorCode);
  }

  /**
     * Returns a comprehensive description of the errorNumber error.
     *
     * @param CMIErrorCode
     * @return {string}
     */
  LMSGetDiagnostic(CMIErrorCode) {
    return this.getDiagnostic('LMSGetDiagnostic', CMIErrorCode);
  }

  /**
     * Sets a value on the CMI Object
     *
     * @param CMIElement
     * @param value
     * @return {string}
     */
  setCMIValue(CMIElement, value) {
    this._commonSetCMIValue('LMSSetValue', false, CMIElement, value);
  }

  /**
     * Gets a value from the CMI Object
     *
     * @param CMIElement
     * @return {*}
     */
  getCMIValue(CMIElement) {
    return this._commonGetCMIValue('getCMIValue', false, CMIElement);
  }

  /**
   * Gets or builds a new child element to add to the array.
   *
   * @param CMIElement
   * @param value
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

  validateCorrectResponse(CMIElement, value) {
    return true;
  }

  /**
     * Returns the message that corresponds to errorNumber.
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
