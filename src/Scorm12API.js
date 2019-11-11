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
let _self;

/**
 * API class for SCORM 1.2
 */
export default class Scorm12API extends BaseAPI {
  /**
   * Constructor for SCORM 1.2 API
   */
  constructor() {
    super(scorm12_error_codes);
    _self = this;

    _self.cmi = new CMI(this);
    // Rename functions to match 1.2 Spec and expose to modules
    _self.LMSInitialize = _self.lmsInitialize;
    _self.LMSFinish = _self.lmsFinish;
    _self.LMSGetValue = _self.lmsGetValue;
    _self.LMSSetValue = _self.lmsSetValue;
    _self.LMSCommit = _self.lmsCommit;
    _self.LMSGetLastError = _self.lmsGetLastError;
    _self.LMSGetErrorString = _self.lmsGetErrorString;
    _self.LMSGetDiagnostic = _self.lmsGetDiagnostic;
  }

  /**
   * lmsInitialize function from SCORM 1.2 Spec
   *
   * @return {string} bool
   */
  lmsInitialize() {
    return _self.initialize('LMSInitialize', 'LMS was already initialized!',
        'LMS is already finished!');
  }

  /**
   * LMSFinish function from SCORM 1.2 Spec
   *
   * @return {string} bool
   */
  lmsFinish() {
    return _self.terminate('LMSFinish', false);
  }

  /**
   * LMSGetValue function from SCORM 1.2 Spec
   *
   * @param {string} CMIElement
   * @return {string}
   */
  lmsGetValue(CMIElement) {
    return _self.getValue('LMSGetValue', false, CMIElement);
  }

  /**
   * LMSSetValue function from SCORM 1.2 Spec
   *
   * @param {string} CMIElement
   * @param {*} value
   * @return {string}
   */
  lmsSetValue(CMIElement, value) {
    return _self.setValue('LMSSetValue', false, CMIElement, value);
  }

  /**
   * LMSCommit function from SCORM 1.2 Spec
   *
   * @return {string} bool
   */
  lmsCommit() {
    return _self.commit('LMSCommit', false);
  }

  /**
   * LMSGetLastError function from SCORM 1.2 Spec
   *
   * @return {string}
   */
  lmsGetLastError() {
    return _self.getLastError('LMSGetLastError');
  }

  /**
   * LMSGetErrorString function from SCORM 1.2 Spec
   *
   * @param {string} CMIErrorCode
   * @return {string}
   */
  lmsGetErrorString(CMIErrorCode) {
    return _self.getErrorString('LMSGetErrorString', CMIErrorCode);
  }

  /**
   * LMSGetDiagnostic function from SCORM 1.2 Spec
   *
   * @param {string} CMIErrorCode
   * @return {string}
   */
  lmsGetDiagnostic(CMIErrorCode) {
    return _self.getDiagnostic('LMSGetDiagnostic', CMIErrorCode);
  }

  /**
   * Sets a value on the CMI Object
   *
   * @param {string} CMIElement
   * @param {*} value
   */
  setCMIValue(CMIElement, value) {
    _self._commonSetCMIValue('LMSSetValue', false, CMIElement, value);
  }

  /**
   * Gets a value from the CMI Object
   *
   * @param {string} CMIElement
   * @return {*}
   */
  getCMIValue(CMIElement) {
    return _self._commonGetCMIValue('getCMIValue', false, CMIElement);
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

    if (_self.stringContains(CMIElement, 'cmi.objectives')) {
      newChild = new CMIObjectivesObject(this);
    } else if (_self.stringContains(CMIElement, '.correct_responses')) {
      newChild = new CMIInteractionsCorrectResponsesObject(this);
    } else if (_self.stringContains(CMIElement, '.objectives')) {
      newChild = new CMIInteractionsObjectivesObject(this);
    } else if (_self.stringContains(CMIElement, 'cmi.interactions')) {
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

    const totalTime = _self.cmi.core.total_time;
    const sessionTime = _self.cmi.core.session_time;

    return Utilities.addHHMMSSTimeStrings(totalTime, sessionTime, timeRegex);
  }

  /**
   * Replace the whole API with another
   *
   * @param {Scorm12API} newAPI
   */
  replaceWithAnotherScormAPI(newAPI) {
    // Data Model
    _self.cmi = newAPI.cmi;
  }
}
