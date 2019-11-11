// @flow
import BaseAPI from './BaseAPI';
import {
  ADL,
  CMI,
  CMICommentsFromLearnerObject,
  CMICommentsFromLMSObject,
  CMIInteractionsCorrectResponsesObject,
  CMIInteractionsObject,
  CMIInteractionsObjectivesObject,
  CMIObjectivesObject,
} from './cmi/scorm2004_cmi';
import * as Util from './utilities';
import {scorm2004_constants} from './constants/api_constants';
import {scorm2004_error_codes} from './constants/error_codes';
import {correct_responses} from './constants/response_constants';
import {valid_languages} from './constants/language_constants';
import {scorm2004_regex} from './regex';

const constants = scorm2004_constants;
let _self;

/**
 * API class for SCORM 2004
 */
class Scorm2004API extends BaseAPI {
  version: '1.0';

  /**
   * Constructor for SCORM 2004 API
   */
  constructor() {
    super(scorm2004_error_codes);

    _self = this;
    _self.cmi = new CMI(_self);
    _self.adl = new ADL(_self);

    // Rename functions to match 2004 Spec
    _self.Initialize = _self.LMSInitialize;
    _self.Terminate = _self.LMSTerminate;
    _self.GetValue = _self.LMSGetValue;
    _self.SetValue = _self.LMSSetValue;
    _self.Commit = _self.LMSCommit;
    _self.GetLastError = _self.LMSGetLastError;
    _self.GetErrorString = _self.LMSGetErrorString;
    _self.GetDiagnostic = _self.LMSGetDiagnostic;
  }

  /**
   * @return {string} bool
   */
  LMSInitialize() {
    return _self.initialize('Initialize');
  }

  /**
   * @return {string} bool
   */
  LMSTerminate() {
    return _self.terminate('Terminate', true);
  }

  /**
   * @param {string} CMIElement
   * @return {string}
   */
  LMSGetValue(CMIElement) {
    return _self.getValue('GetValue', true, CMIElement);
  }

  /**
   * @param {string} CMIElement
   * @param {any} value
   * @return {string}
   */
  LMSSetValue(CMIElement, value) {
    return _self.setValue('SetValue', true, CMIElement, value);
  }

  /**
   * Orders LMS to store all content parameters
   *
   * @return {string} bool
   */
  LMSCommit() {
    return _self.commit('Commit');
  }

  /**
   * Returns last error code
   *
   * @return {string}
   */
  LMSGetLastError() {
    return _self.getLastError('GetLastError');
  }

  /**
   * Returns the errorNumber error description
   *
   * @param CMIErrorCode
   * @return {string}
   */
  LMSGetErrorString(CMIErrorCode) {
    return _self.getErrorString('GetErrorString', CMIErrorCode);
  }

  /**
   * Returns a comprehensive description of the errorNumber error.
   *
   * @param CMIErrorCode
   * @return {string}
   */
  LMSGetDiagnostic(CMIErrorCode) {
    return _self.getDiagnostic('GetDiagnostic', CMIErrorCode);
  }

  /**
   * Sets a value on the CMI Object
   *
   * @param {string} CMIElement
   * @param {any} value
   */
  setCMIValue(CMIElement, value) {
    _self._commonSetCMIValue('SetValue', true, CMIElement, value);
  }

  /**
   * Gets or builds a new child element to add to the array.
   *
   * @param {string} CMIElement
   * @param {any} value
   * @return {any}
   */
  getChildElement(CMIElement, value) {
    let newChild;

    if (_self.stringContains(CMIElement, 'cmi.objectives')) {
      newChild = new CMIObjectivesObject(this);
    } else if (_self.stringContains(CMIElement, '.correct_responses')) {
      const parts = CMIElement.split('.');
      const index = Number(parts[2]);
      const interaction = _self.cmi.interactions.childArray[index];
      if (typeof interaction.type === 'undefined') {
        _self.throwSCORMError(scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED);
      } else {
        const interaction_type = interaction.type;
        const interaction_count = interaction.correct_responses._count;
        if (interaction_type === 'choice') {
          for (let i = 0; i < interaction_count && _self.lastErrorCode ===
          0; i++) {
            const response = interaction.correct_responses.childArray[i];
            if (response.pattern === value) {
              _self.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE);
            }
          }
        }

        const response_type = correct_responses[interaction_type];
        let nodes = [];
        if (response_type.delimiter !== '') {
          nodes = value.split(response_type.delimiter);
        } else {
          nodes[0] = value;
        }

        if (nodes.length > 0 && nodes.length <= response_type.max) {
          _self.#checkCorrectResponseValue(interaction_type, nodes, value);
        } else if (nodes.length > response_type.max) {
          _self.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE,
              'Data Model Element Pattern Too Long');
        }
      }
      if (_self.lastErrorCode === 0) {
        newChild = new CMIInteractionsCorrectResponsesObject(this);
      }
    } else if (_self.stringContains(CMIElement, '.objectives')) {
      newChild = new CMIInteractionsObjectivesObject(this);
    } else if (_self.stringContains(CMIElement, 'cmi.interactions')) {
      newChild = new CMIInteractionsObject(this);
    } else if (_self.stringContains(CMIElement, 'cmi.comments_from_learner')) {
      newChild = new CMICommentsFromLearnerObject(this);
    } else if (_self.stringContains(CMIElement, 'cmi.comments_from_lms')) {
      newChild = new CMICommentsFromLMSObject(this);
    }

    return newChild;
  }

  /**
   * Validate correct response.
   * @param {string} CMIElement
   * @param {any} value
   */
  validateCorrectResponse(CMIElement, value) {
    const parts = CMIElement.split('.');
    const index = Number(parts[2]);
    const pattern_index = Number(parts[4]);
    const interaction = _self.cmi.interactions.childArray[index];

    const interaction_type = interaction.type;
    const interaction_count = interaction.correct_responses._count;
    if (interaction_type === 'choice') {
      for (let i = 0; i < interaction_count && _self.lastErrorCode === 0; i++) {
        const response = interaction.correct_responses.childArray[i];
        if (response.pattern === value) {
          _self.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE);
        }
      }
    }

    const response_type = scorm2004_constants.correct_responses[interaction_type];
    if (typeof response_type.limit !== 'undefined' || interaction_count <
        response_type.limit) {
      let nodes = [];
      if (response_type.delimiter !== '') {
        nodes = value.split(response_type.delimiter);
      } else {
        nodes[0] = value;
      }

      if (nodes.length > 0 && nodes.length <= response_type.max) {
        _self.#checkCorrectResponseValue(interaction_type, nodes, value);
      } else if (nodes.length > response_type.max) {
        _self.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE,
            'Data Model Element Pattern Too Long');
      }

      if (_self.lastErrorCode === 0 &&
          (!response_type.duplicate ||
              !_self.#checkDuplicatedPattern(interaction.correct_responses,
                  pattern_index, value)) ||
          (_self.lastErrorCode === 0 && value === '')) {
        // do nothing, we want the inverse
      } else {
        if (_self.lastErrorCode === 0) {
          _self.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE,
              'Data Model Element Pattern Already Exists');
        }
      }
    } else {
      _self.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE,
          'Data Model Element Collection Limit Reached');
    }
  }

  /**
   * Gets a value from the CMI Object
   *
   * @param {string} CMIElement
   * @return {*}
   */
  getCMIValue(CMIElement) {
    return _self._commonGetCMIValue('GetValue', true, CMIElement);
  }

  /**
   * Returns the message that corresponds to errorNumber.
   *
   * @param {string,number} errorNumber
   * @param {string} detail
   * @return {string}
   */
  getLmsErrorMessageDetails(errorNumber, detail) {
    let basicMessage = '';
    let detailMessage = '';

    // Set error number to string since inconsistent from modules if string or number
    errorNumber = String(errorNumber);
    if (constants.error_descriptions[errorNumber]) {
      basicMessage = constants.error_descriptions[errorNumber].basicMessage;
      detailMessage = constants.error_descriptions[errorNumber].detailMessage;
    }

    return detail ? detailMessage : basicMessage;
  }

  #checkDuplicatedPattern = (correct_response, current_index, value) => {
    let found = false;
    const count = correct_response._count;
    for (let i = 0; i < count && !found; i++) {
      if (i !== current_index && correct_response.childArray[i] === value) {
        found = true;
      }
    }
    return found;
  };

  #checkCorrectResponseValue = (interaction_type, nodes, value) => {
    const response = correct_responses[interaction_type];
    const formatRegex = new RegExp(response.format);
    for (let i = 0; i < nodes.length && _self.lastErrorCode === 0; i++) {
      if (interaction_type.match(
          '^(fill-in|long-fill-in|matching|performance|sequencing)$')) {
        nodes[i] = _self.#removeCorrectResponsePrefixes(nodes[i]);
      }

      if (response.delimiter2 !== undefined) {
        const values = nodes[i].split(response.delimiter2);
        if (values.length === 2) {
          const matches = values[0].match(formatRegex);
          if (!matches) {
            _self.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
          } else {
            if (!values[1].match(new RegExp(response.format2))) {
              _self.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
            }
          }
        } else {
          _self.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
        }
      } else {
        const matches = nodes[i].match(formatRegex);
        if ((!matches && value !== '') ||
            (!matches && interaction_type === 'true-false')) {
          _self.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
        } else {
          if (interaction_type === 'numeric' && nodes.length > 1) {
            if (Number(nodes[0]) > Number(nodes[1])) {
              _self.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
            }
          } else {
            if (nodes[i] !== '' && response.unique) {
              for (let j = 0; j < i && _self.lastErrorCode === 0; j++) {
                if (nodes[i] === nodes[j]) {
                  _self.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
                }
              }
            }
          }
        }
      }
    }
  };

  #removeCorrectResponsePrefixes = (node) => {
    let seenOrder = false;
    let seenCase = false;
    let seenLang = false;

    const prefixRegex = new RegExp(
        '^({(lang|case_matters|order_matters)=([^}]+)})');
    let matches = node.match(prefixRegex);
    let langMatches = null;
    while (matches) {
      switch (matches[2]) {
        case 'lang':
          langMatches = node.match(scorm2004_regex.CMILangcr);
          if (langMatches) {
            const lang = langMatches[3];
            if (lang !== undefined && lang.length > 0) {
              if (valid_languages[lang.toLowerCase()] === undefined) {
                _self.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
              }
            }
          }
          seenLang = true;
          break;
        case 'case_matters':
          if (!seenLang && !seenOrder && !seenCase) {
            if (matches[3] !== 'true' && matches[3] !== 'false') {
              _self.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
            }
          }

          seenCase = true;
          break;
        case 'order_matters':
          if (!seenCase && !seenLang && !seenOrder) {
            if (matches[3] !== 'true' && matches[3] !== 'false') {
              _self.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
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
  };

  /**
   * Replace the whole API with another
   * @param {Scorm2004API} newAPI
   */
  replaceWithAnotherScormAPI(newAPI) {
    // Data Model
    _self.cmi = newAPI.cmi;
    _self.adl = newAPI.adl;
  }

  /**
   * Adds the current session time to the existing total time.
   *
   * @return {string} ISO8601 Duration
   */
  getCurrentTotalTime() {
    const totalTime = _self.cmi.total_time;
    const sessionTime = _self.cmi.session_time;

    const durationRegex = scorm2004_regex.CMITimespan;
    const totalSeconds = Util.getDurationAsSeconds(totalTime, durationRegex);
    const sessionSeconds = Util.getDurationAsSeconds(sessionTime,
        durationRegex);

    return Util.getSecondsAsISODuration(totalSeconds + sessionSeconds);
  }
}
