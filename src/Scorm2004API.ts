import BaseAPI from "./BaseAPI";
import { CMI } from "./cmi/scorm2004/cmi";
import * as Utilities from "./utilities";
import { stringMatches } from "./utilities";
import APIConstants from "./constants/api_constants";
import ErrorCodes from "./constants/error_codes";
import { CorrectResponses, ResponseType } from "./constants/response_constants";
import ValidLanguages from "./constants/language_constants";
import Regex from "./constants/regex";
import regex from "./constants/regex";
import { CMIArray } from "./cmi/common/array";
import { BaseCMI } from "./cmi/common/base_cmi";
import {
  CMIInteractionsCorrectResponsesObject,
  CMIInteractionsObject,
  CMIInteractionsObjectivesObject,
} from "./cmi/scorm2004/interactions";
import { CMICommentsObject } from "./cmi/scorm2004/comments";
import { CMIObjectivesObject } from "./cmi/scorm2004/objectives";
import { ADL } from "./cmi/scorm2004/adl";
import { RefObject, ResultObject, Settings } from "./types/api_types";

/**
 * API class for SCORM 2004
 */
export default class Scorm2004API extends BaseAPI {
  private _version: string = "1.0";

  /**
   * Constructor for SCORM 2004 API
   * @param {Settings} settings
   */
  constructor(settings?: Settings) {
    if (settings) {
      if (settings.mastery_override === undefined) {
        settings.mastery_override = false;
      }
    }

    super(ErrorCodes.scorm2004, settings);

    this.cmi = new CMI();
    this.adl = new ADL();

    // Rename functions to match 2004 Spec and expose to modules
    this.Initialize = this.lmsInitialize;
    this.Terminate = this.lmsFinish;
    this.GetValue = this.lmsGetValue;
    this.SetValue = this.lmsSetValue;
    this.Commit = this.lmsCommit;
    this.GetLastError = this.lmsGetLastError;
    this.GetErrorString = this.lmsGetErrorString;
    this.GetDiagnostic = this.lmsGetDiagnostic;
  }

  public cmi: CMI;
  public adl: ADL;

  public Initialize: () => string;
  public Terminate: () => string;
  public GetValue: (CMIElement: string) => string;
  public SetValue: (CMIElement: string, value: any) => string;
  public Commit: () => string;
  public GetLastError: () => string;
  public GetErrorString: (CMIErrorCode: string | number) => string;
  public GetDiagnostic: (CMIErrorCode: string | number) => string;

  /**
   * Called when the API needs to be reset
   */
  reset(settings?: Settings) {
    this.commonReset(settings);

    this.cmi = new CMI();
    this.adl = new ADL();
  }

  /**
   * Getter for _version
   * @return {string}
   */
  get version(): string {
    return this._version;
  }

  /**
   * @return {string} bool
   */
  lmsInitialize(): string {
    this.cmi.initialize();
    return this.initialize("Initialize");
  }

  /**
   * @return {string} bool
   */
  lmsFinish(): string {
    (async () => {
      await this.internalFinish();
    })();
    return APIConstants.global.SCORM_TRUE;
  }

  async internalFinish(): Promise<string> {
    const result = await this.terminate("Terminate", true);

    if (result === APIConstants.global.SCORM_TRUE) {
      if (this.adl.nav.request !== "_none_") {
        const navActions: { [key: string]: string } = {
          continue: "SequenceNext",
          previous: "SequencePrevious",
          choice: "SequenceChoice",
          jump: "SequenceJump",
          exit: "SequenceExit",
          exitAll: "SequenceExitAll",
          abandon: "SequenceAbandon",
          abandonAll: "SequenceAbandonAll",
        };

        let request = this.adl.nav.request;
        const choiceJumpRegex = new RegExp(regex.scorm2004.NAVEvent);
        const matches = request.match(choiceJumpRegex);
        let target = "";
        if (matches && matches.length > 2) {
          target = matches[2];
          request = matches[1].replace(target, "");
        }
        const action = navActions[request];
        if (action) {
          this.processListeners(action, "adl.nav.request", target);
        }
      } else if (this.settings.autoProgress) {
        this.processListeners("SequenceNext");
      }
    }

    return result;
  }

  /**
   * @param {string} CMIElement
   * @return {string}
   */
  lmsGetValue(CMIElement: string): string {
    const adlNavRequestRegex =
      "^adl\\.nav\\.request_valid\\.(choice|jump)\\.{target=\\S{0,}([a-zA-Z0-9-_]+)}$";
    if (stringMatches(CMIElement, adlNavRequestRegex)) {
      const matches = CMIElement.match(adlNavRequestRegex);
      const request = matches[1];
      const target = matches[2].replace("{target=", "").replace("}", "");
      if (request === "choice" || request === "jump") {
        if (this.settings.scoItemIdValidator) {
          return String(this.settings.scoItemIdValidator(target));
        }
        return String(this.settings.scoItemIds.includes(target));
      }
    }
    return this.getValue("GetValue", true, CMIElement);
  }

  /**
   * @param {string} CMIElement
   * @param {any} value
   * @return {string}
   */
  lmsSetValue(CMIElement: string, value: any): string {
    return this.setValue("SetValue", "Commit", true, CMIElement, value);
  }

  /**
   * Orders LMS to store all content parameters
   *
   * @return {string} bool
   */
  lmsCommit(): string {
    (async () => {
      await this.commit("Commit");
    })();
    return APIConstants.global.SCORM_TRUE;
  }

  /**
   * Returns last error code
   *
   * @return {string}
   */
  lmsGetLastError(): string {
    return this.getLastError("GetLastError");
  }

  /**
   * Returns the errorNumber error description
   *
   * @param {(string|number)} CMIErrorCode
   * @return {string}
   */
  lmsGetErrorString(CMIErrorCode: string | number): string {
    return this.getErrorString("GetErrorString", CMIErrorCode);
  }

  /**
   * Returns a comprehensive description of the errorNumber error.
   *
   * @param {(string|number)} CMIErrorCode
   * @return {string}
   */
  lmsGetDiagnostic(CMIErrorCode: string | number): string {
    return this.getDiagnostic("GetDiagnostic", CMIErrorCode);
  }

  /**
   * Sets a value on the CMI Object
   *
   * @param {string} CMIElement
   * @param {any} value
   * @return {string}
   */
  setCMIValue(CMIElement: string, value: any): string {
    return this._commonSetCMIValue("SetValue", true, CMIElement, value);
  }

  /**
   * Gets or builds a new child element to add to the array.
   *
   * @param {string} CMIElement
   * @param {any} value
   * @param {boolean} foundFirstIndex
   * @return {BaseCMI|null}
   */
  getChildElement(
    CMIElement: string,
    value: any,
    foundFirstIndex: boolean,
  ): BaseCMI | null {
    if (stringMatches(CMIElement, "cmi\\.objectives\\.\\d+")) {
      return new CMIObjectivesObject();
    }

    if (foundFirstIndex) {
      if (
        stringMatches(
          CMIElement,
          "cmi\\.interactions\\.\\d+\\.correct_responses\\.\\d+",
        )
      ) {
        return this.createCorrectResponsesObject(CMIElement, value);
      } else if (
        stringMatches(
          CMIElement,
          "cmi\\.interactions\\.\\d+\\.objectives\\.\\d+",
        )
      ) {
        return new CMIInteractionsObjectivesObject();
      }
    } else if (stringMatches(CMIElement, "cmi\\.interactions\\.\\d+")) {
      return new CMIInteractionsObject();
    }

    if (stringMatches(CMIElement, "cmi\\.comments_from_learner\\.\\d+")) {
      return new CMICommentsObject();
    } else if (stringMatches(CMIElement, "cmi\\.comments_from_lms\\.\\d+")) {
      return new CMICommentsObject(true);
    }

    return null;
  }

  private createCorrectResponsesObject(
    CMIElement: string,
    value: any,
  ): BaseCMI | null {
    const parts = CMIElement.split(".");
    const index = Number(parts[2]);
    const interaction = this.cmi.interactions.childArray[index];

    if (this.isInitialized()) {
      if (!interaction.type) {
        this.throwSCORMError(ErrorCodes.scorm2004.DEPENDENCY_NOT_ESTABLISHED);
      } else {
        this.checkDuplicateChoiceResponse(interaction, value);
        const response_type = CorrectResponses[interaction.type];
        if (response_type) {
          this.checkValidResponseType(response_type, value, interaction.type);
        } else {
          this.throwSCORMError(
            ErrorCodes.scorm2004.GENERAL_SET_FAILURE,
            "Incorrect Response Type: " + interaction.type,
          );
        }
      }
    }

    if (this.lastErrorCode === "0") {
      return new CMIInteractionsCorrectResponsesObject();
    }

    return null;
  }

  /**
   * Checks for valid response types
   * @param {object} response_type
   * @param {any} value
   * @param {string} interaction_type
   */
  checkValidResponseType(
    response_type: ResponseType,
    value: any,
    interaction_type: string,
  ) {
    let nodes = [];
    if (response_type?.delimiter) {
      nodes = String(value).split(response_type.delimiter);
    } else {
      nodes[0] = value;
    }

    if (nodes.length > 0 && nodes.length <= response_type.max) {
      this.checkCorrectResponseValue(interaction_type, nodes, value);
    } else if (nodes.length > response_type.max) {
      this.throwSCORMError(
        ErrorCodes.scorm2004.GENERAL_SET_FAILURE,
        "Data Model Element Pattern Too Long",
      );
    }
  }

  /**
   * Checks for duplicate 'choice' responses.
   * @param {CMIInteractionsObject} interaction
   * @param {any} value
   */
  checkDuplicateChoiceResponse(interaction: CMIInteractionsObject, value: any) {
    const interaction_count = interaction.correct_responses._count;
    if (interaction.type === "choice") {
      for (
        let i = 0;
        i < interaction_count && this.lastErrorCode === "0";
        i++
      ) {
        const response = interaction.correct_responses.childArray[i];
        if (response.pattern === value) {
          this.throwSCORMError(ErrorCodes.scorm2004.GENERAL_SET_FAILURE);
        }
      }
    }
  }

  /**
   * Validate correct response.
   * @param {string} CMIElement
   * @param {*} value
   */
  validateCorrectResponse(CMIElement: string, value: any) {
    const parts = CMIElement.split(".");
    const index = Number(parts[2]);
    const pattern_index = Number(parts[4]);
    const interaction = this.cmi.interactions.childArray[index];

    const interaction_count = interaction.correct_responses._count;
    this.checkDuplicateChoiceResponse(interaction, value);

    const response_type = CorrectResponses[interaction.type];
    if (
      typeof response_type.limit === "undefined" ||
      interaction_count <= response_type.limit
    ) {
      this.checkValidResponseType(response_type, value, interaction.type);

      if (
        (this.lastErrorCode === "0" &&
          (!response_type.duplicate ||
            !this.checkDuplicatedPattern(
              interaction.correct_responses,
              pattern_index,
              value,
            ))) ||
        (this.lastErrorCode === "0" && value === "")
      ) {
        // do nothing, we want the inverse
      } else {
        if (this.lastErrorCode === "0") {
          this.throwSCORMError(
            ErrorCodes.scorm2004.GENERAL_SET_FAILURE,
            "Data Model Element Pattern Already Exists",
          );
        }
      }
    } else {
      this.throwSCORMError(
        ErrorCodes.scorm2004.GENERAL_SET_FAILURE,
        "Data Model Element Collection Limit Reached",
      );
    }
  }

  /**
   * Gets a value from the CMI Object
   *
   * @param {string} CMIElement
   * @return {*}
   */
  getCMIValue(CMIElement: string): any {
    return this._commonGetCMIValue("GetValue", true, CMIElement);
  }

  /**
   * Returns the message that corresponds to errorNumber.
   *
   * @param {(string|number)} errorNumber
   * @param {boolean} detail
   * @return {string}
   */
  getLmsErrorMessageDetails(
    errorNumber: string | number,
    detail: boolean,
  ): string {
    let basicMessage = "";
    let detailMessage = "";

    // Set error number to string since inconsistent from modules if string or number
    errorNumber = String(errorNumber);
    if (APIConstants.scorm2004.error_descriptions[errorNumber]) {
      basicMessage =
        APIConstants.scorm2004.error_descriptions[errorNumber].basicMessage;
      detailMessage =
        APIConstants.scorm2004.error_descriptions[errorNumber].detailMessage;
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
  checkDuplicatedPattern(
    correct_response: CMIArray,
    current_index: number,
    value: any,
  ): boolean {
    let found = false;
    const count = correct_response._count;
    for (let i = 0; i < count && !found; i++) {
      if (i !== current_index && correct_response.childArray[i] === value) {
        found = true;
      }
    }
    return found;
  }

  /**
   * Checks for a valid correct_response value
   * @param {string} interaction_type
   * @param {Array} nodes
   * @param {*} value
   */
  checkCorrectResponseValue(
    interaction_type: string,
    nodes: Array<any>,
    value: any,
  ) {
    const response = CorrectResponses[interaction_type];
    const formatRegex = new RegExp(response.format);
    for (let i = 0; i < nodes.length && this.lastErrorCode === "0"; i++) {
      if (
        interaction_type.match(
          "^(fill-in|long-fill-in|matching|performance|sequencing)$",
        )
      ) {
        nodes[i] = this.removeCorrectResponsePrefixes(nodes[i]);
      }

      if (response?.delimiter2) {
        const values = nodes[i].split(response.delimiter2);
        if (values.length === 2) {
          const matches = values[0].match(formatRegex);
          if (!matches) {
            this.throwSCORMError(ErrorCodes.scorm2004.TYPE_MISMATCH);
          } else {
            if (
              !response.format2 ||
              !values[1].match(new RegExp(response.format2))
            ) {
              this.throwSCORMError(ErrorCodes.scorm2004.TYPE_MISMATCH);
            }
          }
        } else {
          this.throwSCORMError(ErrorCodes.scorm2004.TYPE_MISMATCH);
        }
      } else {
        const matches = nodes[i].match(formatRegex);
        if (
          (!matches && value !== "") ||
          (!matches && interaction_type === "true-false")
        ) {
          this.throwSCORMError(ErrorCodes.scorm2004.TYPE_MISMATCH);
        } else {
          if (interaction_type === "numeric" && nodes.length > 1) {
            if (Number(nodes[0]) > Number(nodes[1])) {
              this.throwSCORMError(ErrorCodes.scorm2004.TYPE_MISMATCH);
            }
          } else {
            if (nodes[i] !== "" && response.unique) {
              for (let j = 0; j < i && this.lastErrorCode === "0"; j++) {
                if (nodes[i] === nodes[j]) {
                  this.throwSCORMError(ErrorCodes.scorm2004.TYPE_MISMATCH);
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
  removeCorrectResponsePrefixes(node: string): any {
    let seenOrder = false;
    let seenCase = false;
    let seenLang = false;

    const prefixRegex = new RegExp(
      "^({(lang|case_matters|order_matters)=([^}]+)})",
    );
    let matches = node.match(prefixRegex);
    let langMatches = null;
    while (matches) {
      switch (matches[2]) {
        case "lang":
          langMatches = node.match(Regex.scorm2004.CMILangcr);
          if (langMatches) {
            const lang = langMatches[3];
            if (lang !== undefined && lang.length > 0) {
              if (!ValidLanguages.includes(lang.toLowerCase())) {
                this.throwSCORMError(ErrorCodes.scorm2004.TYPE_MISMATCH);
              }
            }
          }
          seenLang = true;
          break;
        case "case_matters":
          if (!seenLang && !seenOrder && !seenCase) {
            if (matches[3] !== "true" && matches[3] !== "false") {
              this.throwSCORMError(ErrorCodes.scorm2004.TYPE_MISMATCH);
            }
          }

          seenCase = true;
          break;
        case "order_matters":
          if (!seenCase && !seenLang && !seenOrder) {
            if (matches[3] !== "true" && matches[3] !== "false") {
              this.throwSCORMError(ErrorCodes.scorm2004.TYPE_MISMATCH);
            }
          }

          seenOrder = true;
          break;
      }
      node = node.substring(matches[1].length);
      matches = node.match(prefixRegex);
    }

    return node;
  }

  /**
   * Replace the whole API with another
   * @param {Scorm2004API} newAPI
   */
  replaceWithAnotherScormAPI(newAPI: Scorm2004API) {
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
  renderCommitCMI(terminateCommit: boolean): object | Array<any> {
    const cmiExport: RefObject = this.renderCMIToJSONObject();

    if (terminateCommit) {
      cmiExport.cmi.total_time = this.cmi.getCurrentTotalTime();
    }

    const result = [];
    const flattened: RefObject = Utilities.flatten(cmiExport);
    switch (this.settings.dataCommitFormat) {
      case "flattened":
        return Utilities.flatten(cmiExport);
      case "params":
        for (const item in flattened) {
          if ({}.hasOwnProperty.call(flattened, item)) {
            result.push(`${item}=${flattened[item]}`);
          }
        }
        return result;
      case "json":
      default:
        return cmiExport;
    }
  }

  /**
   * Attempts to store the data to the LMS
   *
   * @param {boolean} terminateCommit
   * @return {ResultObject}
   */
  async storeData(terminateCommit: boolean): Promise<ResultObject> {
    if (terminateCommit) {
      if (this.cmi.mode === "normal") {
        if (this.cmi.credit === "credit") {
          if (this.cmi.completion_threshold && this.cmi.progress_measure) {
            if (this.cmi.progress_measure >= this.cmi.completion_threshold) {
              this.cmi.completion_status = "completed";
            } else {
              this.cmi.completion_status = "incomplete";
            }
          }
          if (this.cmi.scaled_passing_score && this.cmi.score.scaled) {
            if (this.cmi.score.scaled >= this.cmi.scaled_passing_score) {
              this.cmi.success_status = "passed";
            } else {
              this.cmi.success_status = "failed";
            }
          }
        }
      }
    }

    let navRequest = false;
    if (
      this.adl.nav.request !== this.startingData?.adl?.nav?.request &&
      this.adl.nav.request !== "_none_"
    ) {
      this.adl.nav.request = encodeURIComponent(this.adl.nav.request);
      navRequest = true;
    }

    const commitObject = this.renderCommitCMI(
      terminateCommit || this.settings.alwaysSendTotalTime,
    );

    if (this.apiLogLevel === APIConstants.global.LOG_LEVEL_DEBUG) {
      console.debug(
        "Commit (terminated: " + (terminateCommit ? "yes" : "no") + "): ",
      );
      console.debug(commitObject);
    }
    if (typeof this.settings.lmsCommitUrl === "string") {
      const result = await this.processHttpRequest(
        this.settings.lmsCommitUrl,
        commitObject,
        terminateCommit,
      );

      // check if this is a sequencing call, and then call the necessary JS
      {
        if (
          navRequest &&
          result.navRequest !== undefined &&
          result.navRequest !== ""
        ) {
          Function(`"use strict";(() => { ${result.navRequest} })()`)();
        }
      }
      return result;
    } else {
      return {
        result: APIConstants.global.SCORM_TRUE,
        errorCode: 0,
      };
    }
  }
}
