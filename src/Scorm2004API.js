// @flow
import BaseAPI from './BaseAPI';
import {
  ADL,
  CMI,
  CMICommentsObject,
  CMIInteractionsCorrectResponsesObject,
  CMIInteractionsObject,
  CMIInteractionsObjectivesObject,
  CMIObjectivesObject,
} from './cmi/scorm2004_cmi';
import * as Utilities from './utilities';
import APIConstants from './constants/api_constants';
import ErrorCodes from './constants/error_codes';
import Responses from './constants/response_constants';
import ValidLanguages from './constants/language_constants';
import Regex from './constants/regex';

const scorm2004_constants = APIConstants.scorm2004;
const global_constants = APIConstants.global;
const scorm2004_error_codes = ErrorCodes.scorm2004;
const correct_responses = Responses.correct;
const scorm2004_regex = Regex.scorm2004;

/**
 * API class for SCORM 2004
 */
export default class Scorm2004API extends BaseAPI {
  #version: '1.0';

  /**
   * Constructor for SCORM 2004 API
   * @param {object} settings
   */
  constructor(settings: {}) {
    const finalSettings = {
      ...{
        mastery_override: false,
      }, ...settings,
    };

    super(scorm2004_error_codes, finalSettings);

    this.cmi = new CMI();
    this.adl = new ADL();

    // Rename functions to match 2004 Spec and expose to modules
    this.Initialize = this.lmsInitialize;
    this.Terminate = this.lmsTerminate;
    this.GetValue = this.lmsGetValue;
    this.SetValue = this.lmsSetValue;
    this.Commit = this.lmsCommit;
    this.GetLastError = this.lmsGetLastError;
    this.GetErrorString = this.lmsGetErrorString;
    this.GetDiagnostic = this.lmsGetDiagnostic;
  }

  /**
   * Getter for #version
   * @return {string}
   */
  get version() {
    return this.#version;
  }

  /**
   * @return {string} bool
   */
  lmsInitialize() {
    this.cmi.initialize();
    return this.initialize('Initialize');
  }

  /**
   * @return {string} bool
   */
  lmsTerminate() {
    const result = this.terminate('Terminate', true);

    if (result === global_constants.SCORM_TRUE) {
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
      } else if (this.settings.autoProgress) {
        this.processListeners('SequenceNext');
      }
    }

    return result;
  }

  /**
   * @param {string} CMIElement
   * @return {string}
   */
  lmsGetValue(CMIElement) {
    return this.getValue('GetValue', true, CMIElement);
  }

  /**
   * @param {string} CMIElement
   * @param {any} value
   * @return {string}
   */
  lmsSetValue(CMIElement, value) {
    return this.setValue('SetValue', 'Commit', true, CMIElement, value);
  }

  /**
   * Orders LMS to store all content parameters
   *
   * @return {string} bool
   */
  lmsCommit() {
    return this.commit('Commit');
  }

  /**
   * Returns last error code
   *
   * @return {string}
   */
  lmsGetLastError() {
    return this.getLastError('GetLastError');
  }

  /**
   * Returns the errorNumber error description
   *
   * @param {(string|number)} CMIErrorCode
   * @return {string}
   */
  lmsGetErrorString(CMIErrorCode) {
    return this.getErrorString('GetErrorString', CMIErrorCode);
  }

  /**
   * Returns a comprehensive description of the errorNumber error.
   *
   * @param {(string|number)} CMIErrorCode
   * @return {string}
   */
  lmsGetDiagnostic(CMIErrorCode) {
    return this.getDiagnostic('GetDiagnostic', CMIErrorCode);
  }

  /**
   * Sets a value on the CMI Object
   *
   * @param {string} CMIElement
   * @param {any} value
   * @return {string}
   */
  setCMIValue(CMIElement, value) {
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
  getChildElement(CMIElement, value, foundFirstIndex) {
    let newChild;

    if (this.stringMatches(CMIElement, 'cmi\\.objectives\\.\\d+')) {
      newChild = new CMIObjectivesObject();
    } else if (foundFirstIndex && this.stringMatches(CMIElement,
        'cmi\\.interactions\\.\\d+\\.correct_responses\\.\\d+')) {
      const parts = CMIElement.split('.');
      const index = Number(parts[2]);
      const interaction = this.cmi.interactions.childArray[index];
      if (this.isInitialized()) {
        if (!interaction.type) {
          this.throwSCORMError(
              scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED);
        } else {
          this.checkDuplicateChoiceResponse(interaction, value);

          const response_type = correct_responses[interaction.type];
          if (response_type) {
            this.checkValidResponseType(response_type, value, interaction.type);
          } else {
            this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE,
                'Incorrect Response Type: ' + interaction.type);
          }
        }
      }
      if (this.lastErrorCode === 0) {
        newChild = new CMIInteractionsCorrectResponsesObject();
      }
    } else if (foundFirstIndex && this.stringMatches(CMIElement,
        'cmi\\.interactions\\.\\d+\\.objectives\\.\\d+')) {
      newChild = new CMIInteractionsObjectivesObject();
    } else if (!foundFirstIndex &&
        this.stringMatches(CMIElement, 'cmi\\.interactions\\.\\d+')) {
      newChild = new CMIInteractionsObject();
    } else if (this.stringMatches(CMIElement,
        'cmi\\.comments_from_learner\\.\\d+')) {
      newChild = new CMICommentsObject();
    } else if (this.stringMatches(CMIElement,
        'cmi\\.comments_from_lms\\.\\d+')) {
      newChild = new CMICommentsObject(true);
    }

    return newChild;
  }

  /**
   * Checks for valid response types
   * @param {object} response_type
   * @param {any} value
   * @param {string} interaction_type
   */
  checkValidResponseType(response_type, value, interaction_type) {
    let nodes = [];
    if (response_type?.delimiter) {
      nodes = String(value).split(response_type.delimiter);
    } else {
      nodes[0] = value;
    }

    if (nodes.length > 0 && nodes.length <= response_type.max) {
      this.checkCorrectResponseValue(interaction_type, nodes, value);
    } else if (nodes.length > response_type.max) {
      this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE,
          'Data Model Element Pattern Too Long');
    }
  }

  /**
   * Checks for duplicate 'choice' responses.
   * @param {CMIInteractionsObject} interaction
   * @param {any} value
   */
  checkDuplicateChoiceResponse(interaction, value) {
    const interaction_count = interaction.correct_responses._count;
    if (interaction.type === 'choice') {
      for (let i = 0; i < interaction_count && this.lastErrorCode ===
      0; i++) {
        const response = interaction.correct_responses.childArray[i];
        if (response.pattern === value) {
          this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE);
        }
      }
    }
  }

  /**
   * Validate correct response.
   * @param {string} CMIElement
   * @param {*} value
   */
  validateCorrectResponse(CMIElement, value) {
    const parts = CMIElement.split('.');
    const index = Number(parts[2]);
    const pattern_index = Number(parts[4]);
    const interaction = this.cmi.interactions.childArray[index];

    const interaction_count = interaction.correct_responses._count;
    this.checkDuplicateChoiceResponse(interaction, value);

    const response_type = correct_responses[interaction.type];
    if (typeof response_type.limit === 'undefined' || interaction_count <=
        response_type.limit) {
      this.checkValidResponseType(response_type, value, interaction.type);

      if (this.lastErrorCode === 0 &&
          (!response_type.duplicate ||
              !this.checkDuplicatedPattern(interaction.correct_responses,
                  pattern_index, value)) ||
          (this.lastErrorCode === 0 && value === '')) {
        // do nothing, we want the inverse
      } else {
        if (this.lastErrorCode === 0) {
          this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE,
              'Data Model Element Pattern Already Exists');
        }
      }
    } else {
      this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE,
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
    return this._commonGetCMIValue('GetValue', true, CMIElement);
  }

  /**
   * Returns the message that corresponds to errorNumber.
   *
   * @param {(string|number)} errorNumber
   * @param {boolean} detail
   * @return {string}
   */
  getLmsErrorMessageDetails(errorNumber, detail) {
    let basicMessage = '';
    let detailMessage = '';

    // Set error number to string since inconsistent from modules if string or number
    errorNumber = String(errorNumber);
    if (scorm2004_constants.error_descriptions[errorNumber]) {
      basicMessage = scorm2004_constants.error_descriptions[errorNumber].basicMessage;
      detailMessage = scorm2004_constants.error_descriptions[errorNumber].detailMessage;
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
  checkDuplicatedPattern = (correct_response, current_index, value) => {
    let found = false;
    const count = correct_response._count;
    for (let i = 0; i < count && !found; i++) {
      if (i !== current_index && correct_response.childArray[i] === value) {
        found = true;
      }
    }
    return found;
  };

  /**
   * Checks for a valid correct_response value
   * @param {string} interaction_type
   * @param {Array} nodes
   * @param {*} value
   */
  checkCorrectResponseValue(interaction_type, nodes, value) {
    const response = correct_responses[interaction_type];
    const formatRegex = new RegExp(response.format);
    for (let i = 0; i < nodes.length && this.lastErrorCode === 0; i++) {
      if (interaction_type.match(
          '^(fill-in|long-fill-in|matching|performance|sequencing)$')) {
        nodes[i] = this.removeCorrectResponsePrefixes(nodes[i]);
      }

      if (response?.delimiter2) {
        const values = nodes[i].split(response.delimiter2);
        if (values.length === 2) {
          const matches = values[0].match(formatRegex);
          if (!matches) {
            this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
          } else {
            if (!values[1].match(new RegExp(response.format2))) {
              this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
            }
          }
        } else {
          this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
        }
      } else {
        const matches = nodes[i].match(formatRegex);
        if ((!matches && value !== '') ||
            (!matches && interaction_type === 'true-false')) {
          this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
        } else {
          if (interaction_type === 'numeric' && nodes.length > 1) {
            if (Number(nodes[0]) > Number(nodes[1])) {
              this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
            }
          } else {
            if (nodes[i] !== '' && response.unique) {
              for (let j = 0; j < i && this.lastErrorCode === 0; j++) {
                if (nodes[i] === nodes[j]) {
                  this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
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
  removeCorrectResponsePrefixes(node) {
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
              if (ValidLanguages[lang.toLowerCase()] === undefined) {
                this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
              }
            }
          }
          seenLang = true;
          break;
        case 'case_matters':
          if (!seenLang && !seenOrder && !seenCase) {
            if (matches[3] !== 'true' && matches[3] !== 'false') {
              this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
            }
          }

          seenCase = true;
          break;
        case 'order_matters':
          if (!seenCase && !seenLang && !seenOrder) {
            if (matches[3] !== 'true' && matches[3] !== 'false') {
              this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
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
  replaceWithAnotherScormAPI(newAPI) {
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
  renderCommitCMI(terminateCommit: boolean) {
    const cmiExport = this.renderCMIToJSONObject();

    if (terminateCommit) {
      cmiExport.cmi.total_time = this.cmi.getCurrentTotalTime();
    }

    const result = [];
    const flattened = Utilities.flatten(cmiExport);
    switch (this.settings.dataCommitFormat) {
      case 'flattened':
        return Utilities.flatten(cmiExport);
      case 'params':
        for (const item in flattened) {
          if ({}.hasOwnProperty.call(flattened, item)) {
            result.push(`${item}=${flattened[item]}`);
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
  storeData(terminateCommit: boolean) {
    if (terminateCommit) {
      if (this.cmi.mode === 'normal') {
        if (this.cmi.credit === 'credit') {
          if (this.cmi.completion_threshold && this.cmi.progress_measure) {
            if (this.cmi.progress_measure >= this.cmi.completion_threshold) {
              console.debug('Setting Completion Status: Completed');
              this.cmi.completion_status = 'completed';
            } else {
              console.debug('Setting Completion Status: Incomplete');
              this.cmi.completion_status = 'incomplete';
            }
          }
          if (this.cmi.scaled_passing_score && this.cmi.score.scaled) {
            if (this.cmi.score.scaled >= this.cmi.scaled_passing_score) {
              console.debug('Setting Success Status: Passed');
              this.cmi.success_status = 'passed';
            } else {
              console.debug('Setting Success Status: Failed');
              this.cmi.success_status = 'failed';
            }
          }
        }
      }
    }

    let navRequest = false;
    if (this.adl.nav.request !== (this.startingData?.adl?.nav?.request) &&
        this.adl.nav.request !== '_none_') {
      this.adl.nav.request = encodeURIComponent(this.adl.nav.request);
      navRequest = true;
    }

    const commitObject = this.renderCommitCMI(terminateCommit ||
        this.settings.alwaysSendTotalTime);

    if (this.apiLogLevel === global_constants.LOG_LEVEL_DEBUG) {
      console.debug('Commit (terminated: ' +
            (terminateCommit ? 'yes' : 'no') + '): ');
      console.debug(commitObject);
    }
    if (this.settings.lmsCommitUrl) {
      const result = this.processHttpRequest(this.settings.lmsCommitUrl,
          commitObject, terminateCommit);

      // check if this is a sequencing call, and then call the necessary JS
      {
        if (navRequest && result.navRequest !== undefined &&
            result.navRequest !== '') {
          Function(`"use strict";(() => { ${result.navRequest} })()`)();
        }
      }
      return result;
    } else {
      return global_constants.SCORM_TRUE;
    }
  }
}
