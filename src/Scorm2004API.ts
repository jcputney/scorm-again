import BaseAPI from "./BaseAPI";
import { CMI } from "./cmi/scorm2004/cmi";
import * as Utilities from "./utilities";
import { StringKeyMap, stringMatches } from "./utilities";
import { global_constants, scorm2004_constants } from "./constants/api_constants";
import { scorm2004_errors } from "./constants/error_codes";
import { CMIObjectivesObject } from "./cmi/scorm2004/objectives";
import { ADL, ADLDataObject } from "./cmi/scorm2004/adl";
import { CommitObject, ResultObject, ScoreObject, Settings } from "./types/api_types";
import { scorm2004_regex } from "./constants/regex"; // Import functions from extracted modules
import { BaseCMI } from "./cmi/common/base_cmi";
import {
  CMIInteractionsCorrectResponsesObject,
  CMIInteractionsObject,
  CMIInteractionsObjectivesObject,
} from "./cmi/scorm2004/interactions";
import { CMIArray } from "./cmi/common/array";
import { CorrectResponses, ResponseType } from "./constants/response_constants";
import { CMICommentsObject } from "./cmi/scorm2004/comments";
import ValidLanguages from "./constants/language_constants";
import { CompletionStatus, SuccessStatus } from "./constants/enums";

/**
 * API class for SCORM 2004
 */
class Scorm2004Impl extends BaseAPI {
  private _version: string = "1.0";
  private _globalObjectives: CMIObjectivesObject[] = [];

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

    super(scorm2004_errors, settings);

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

    this.cmi?.reset();
    this.adl?.reset();
  }

  /**
   * Getter for _version
   * @return {string}
   */
  get version(): string {
    return this._version;
  }

  /**
   * Getter for _globalObjectives
   */
  get globalObjectives(): CMIObjectivesObject[] {
    return this._globalObjectives;
  }

  /**
   * Initialize function from SCORM 2004 Spec
   *
   * @return {string} bool
   */
  lmsInitialize(): string {
    this.cmi.initialize();
    return this.initialize(
      "Initialize",
      "LMS was already initialized!",
      "LMS is already finished!",
    );
  }

  /**
   * Terminate function from SCORM 2004 Spec
   *
   * @return {string} bool
   */
  lmsFinish(): string {
    (async () => {
      await this.internalFinish();
    })();
    return global_constants.SCORM_TRUE;
  }

  async internalFinish(): Promise<string> {
    const result = await this.terminate("Terminate", true);

    if (result === global_constants.SCORM_TRUE) {
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
        const choiceJumpRegex = new RegExp(scorm2004_regex.NAVEvent);
        const matches = request.match(choiceJumpRegex);
        let target = "";
        if (matches) {
          if (matches.groups?.choice_target) {
            target = matches.groups?.choice_target;
            request = "choice";
          } else if (matches.groups?.jump_target) {
            target = matches.groups?.jump_target;
            request = "jump";
          }
        }
        const action = navActions[request];
        if (action) {
          this.processListeners(action, "adl.nav.request", target);
        }
      } else if (this.settings.autoProgress) {
        this.processListeners("SequenceNext", null, "next");
      }
    }

    return result;
  }

  /**
   * GetValue function from SCORM 2004 Spec
   *
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
   * SetValue function from SCORM 2004 Spec
   *
   * @param {string} CMIElement
   * @param {any} value
   * @return {string}
   */
  lmsSetValue(CMIElement: string, value: any): string {
    // Proceed with regular setting for non-objective elements or fallback behavior
    return this.setValue("SetValue", "Commit", true, CMIElement, value);
  }

  /**
   * Commit function from SCORM 2004 Spec
   *
   * @return {string} bool
   */
  lmsCommit(): string {
    if (this.settings.asyncCommit) {
      this.scheduleCommit(500, "Commit");
    } else {
      (async () => {
        await this.commit("Commit", false);
      })();
    }
    return global_constants.SCORM_TRUE;
  }

  /**
   * GetLastError function from SCORM 2004 Spec
   *
   * @return {string}
   */
  lmsGetLastError(): string {
    return this.getLastError("GetLastError");
  }

  /**
   * GetErrorString function from SCORM 2004 Spec
   *
   * @param {(string|number)} CMIErrorCode
   * @return {string}
   */
  lmsGetErrorString(CMIErrorCode: string | number): string {
    return this.getErrorString("GetErrorString", CMIErrorCode);
  }

  /**
   * GetDiagnostic function from SCORM 2004 Spec
   *
   * @param {(string|number)} CMIErrorCode
   * @return {string}
   */
  lmsGetDiagnostic(CMIErrorCode: string | number): string {
    return this.getDiagnostic("GetDiagnostic", CMIErrorCode);
  }

  /**
   * Sets a value on the CMI Object - delegates to CMIValueHandlerModule
   *
   * @param {string} CMIElement
   * @param {any} value
   * @return {string}
   */
  override setCMIValue(CMIElement: string, value: any): string {
    // Check if we're updating a global or local objective
    if (stringMatches(CMIElement, "cmi\\.objectives\\.\\d+")) {
      const parts = CMIElement.split(".");
      const index = Number(parts[2]);
      const element_base = `cmi.objectives.${index}`;

      let objective_id;
      const setting_id = stringMatches(CMIElement, "cmi\\.objectives\\.\\d+\\.id");

      if (setting_id) {
        // If we're setting the objective ID, capture it directly
        objective_id = value;
      } else {
        // Find existing objective ID if available
        const objective = this.cmi.objectives.findObjectiveByIndex(index);
        objective_id = objective ? objective.id : undefined;
      }

      // Check if the objective ID matches a global objective
      const is_global = objective_id && this.settings.globalObjectiveIds.includes(objective_id);

      if (is_global) {
        // Locate or create an entry in _globalObjectives for the global objective
        let global_index = this._globalObjectives.findIndex((obj) => obj.id === objective_id);

        if (global_index === -1) {
          global_index = this._globalObjectives.length;
          const newGlobalObjective = new CMIObjectivesObject();
          newGlobalObjective.id = objective_id;
          this._globalObjectives.push(newGlobalObjective);
        }

        // Update the global objective
        const global_element = CMIElement.replace(
          element_base,
          `_globalObjectives.${global_index}`,
        );
        this._commonSetCMIValue("SetGlobalObjectiveValue", true, global_element, value);
      }
    }
    return this._commonSetCMIValue("SetValue", true, CMIElement, value);
  }

  /**
   * Gets or builds a new child element to add to the array - delegates to CMIElementHandlerModule
   *
   * @param {string} CMIElement
   * @param {any} value
   * @param {boolean} foundFirstIndex
   * @return {BaseCMI|null}
   */
  getChildElement(CMIElement: string, value: any, foundFirstIndex: boolean): BaseCMI | null {
    if (stringMatches(CMIElement, "cmi\\.objectives\\.\\d+")) {
      return new CMIObjectivesObject();
    }

    if (foundFirstIndex) {
      if (stringMatches(CMIElement, "cmi\\.interactions\\.\\d+\\.correct_responses\\.\\d+")) {
        return this.createCorrectResponsesObject(CMIElement, value);
      } else if (stringMatches(CMIElement, "cmi\\.interactions\\.\\d+\\.objectives\\.\\d+")) {
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

    if (stringMatches(CMIElement, "adl\\.data\\.\\d+")) {
      return new ADLDataObject();
    }

    return null;
  }

  /**
   * Creates a correct responses object for an interaction - delegates to CMIElementHandlerModule
   *
   * @param {string} CMIElement
   * @param {any} value
   * @return {BaseCMI|null}
   */
  private createCorrectResponsesObject(CMIElement: string, value: any): BaseCMI | null {
    const parts = CMIElement.split(".");
    const index = Number(parts[2]);
    const interaction = this.cmi.interactions.childArray[index];

    if (this.isInitialized()) {
      if (typeof interaction === "undefined" || !interaction.type) {
        this.throwSCORMError(CMIElement, scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED, CMIElement);
        return null;
      } else {
        this.checkDuplicateChoiceResponse(CMIElement, interaction, value);
        const response_type = CorrectResponses[interaction.type];
        if (response_type) {
          this.checkValidResponseType(CMIElement, response_type, value, interaction.type);
        } else {
          this.throwSCORMError(
            CMIElement,
            scorm2004_errors.GENERAL_SET_FAILURE,
            `Incorrect Response Type: ${interaction.type}`,
          );
          return null;
        }
      }
    }

    if (this.lastErrorCode === "0") {
      return new CMIInteractionsCorrectResponsesObject(interaction);
    }

    return null;
  }

  /**
   * Checks for valid response types - delegates to ValidationModule
   * @param {string} CMIElement
   * @param {ResponseType} response_type
   * @param {any} value
   * @param {string} interaction_type
   */
  checkValidResponseType(
    CMIElement: string,
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
      this.checkCorrectResponseValue(CMIElement, interaction_type, nodes, value);
    } else if (nodes.length > response_type.max) {
      this.throwSCORMError(
        CMIElement,
        scorm2004_errors.GENERAL_SET_FAILURE,
        `Data Model Element Pattern Too Long: ${value}`,
      );
    }
  }

  /**
   * Checks for duplicate 'choice' responses - delegates to ValidationModule
   * @param {string} CMIElement
   * @param {CMIInteractionsObject} interaction
   * @param {any} value
   */
  checkDuplicateChoiceResponse(CMIElement: string, interaction: CMIInteractionsObject, value: any) {
    const interaction_count = interaction.correct_responses._count;
    if (interaction.type === "choice") {
      for (let i = 0; i < interaction_count && this.lastErrorCode === "0"; i++) {
        const response = interaction.correct_responses.childArray[i];
        if (response.pattern === value) {
          this.throwSCORMError(CMIElement, scorm2004_errors.GENERAL_SET_FAILURE, `${value}`);
        }
      }
    }
  }

  /**
   * Validate correct response - delegates to ValidationModule
   * @param {string} CMIElement
   * @param {*} value
   */
  validateCorrectResponse(CMIElement: string, value: any) {
    const parts = CMIElement.split(".");
    const index = Number(parts[2]);
    const pattern_index = Number(parts[4]);
    const interaction = this.cmi.interactions.childArray[index];

    const interaction_count = interaction.correct_responses._count;
    this.checkDuplicateChoiceResponse(CMIElement, interaction, value);

    const response_type = CorrectResponses[interaction.type];
    if (typeof response_type.limit === "undefined" || interaction_count <= response_type.limit) {
      this.checkValidResponseType(CMIElement, response_type, value, interaction.type);

      if (
        (this.lastErrorCode === "0" &&
          (!response_type.duplicate ||
            !this.checkDuplicatedPattern(interaction.correct_responses, pattern_index, value))) ||
        (this.lastErrorCode === "0" && value === "")
      ) {
        // do nothing, we want the inverse
      } else {
        if (this.lastErrorCode === "0") {
          this.throwSCORMError(
            CMIElement,
            scorm2004_errors.GENERAL_SET_FAILURE,
            `Data Model Element Pattern Already Exists: ${CMIElement} - ${value}`,
          );
        }
      }
    } else {
      this.throwSCORMError(
        CMIElement,
        scorm2004_errors.GENERAL_SET_FAILURE,
        `Data Model Element Collection Limit Reached: ${CMIElement} - ${value}`,
      );
    }
  }

  /**
   * Gets a value from the CMI Object - delegates to CMIValueHandlerModule
   *
   * @param {string} CMIElement
   * @return {*}
   */
  override getCMIValue(CMIElement: string): any {
    return this._commonGetCMIValue("GetValue", true, CMIElement);
  }

  /**
   * Returns the message that corresponds to errorNumber.
   *
   * @param {(string|number)} errorNumber
   * @param {boolean} detail
   * @return {string}
   */
  override getLmsErrorMessageDetails(errorNumber: string | number, detail: boolean): string {
    let basicMessage = "";
    let detailMessage = "";

    // Set error number to string since inconsistent from modules if string or number
    errorNumber = String(errorNumber);
    if (scorm2004_constants.error_descriptions[errorNumber]) {
      basicMessage = scorm2004_constants.error_descriptions[errorNumber].basicMessage;
      detailMessage = scorm2004_constants.error_descriptions[errorNumber].detailMessage;
    }

    return detail ? detailMessage : basicMessage;
  }

  /**
   * Check to see if a correct_response value has been duplicated - delegates to ValidationModule
   * @param {CMIArray} correct_response
   * @param {number} current_index
   * @param {*} value
   * @return {boolean}
   */
  checkDuplicatedPattern(correct_response: CMIArray, current_index: number, value: any): boolean {
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
   * Checks for a valid correct_response value - delegates to ValidationModule
   * @param {string} CMIElement
   * @param {string} interaction_type
   * @param {Array} nodes
   * @param {*} value
   */
  checkCorrectResponseValue(
    CMIElement: string,
    interaction_type: string,
    nodes: Array<any>,
    value: any,
  ) {
    const response = CorrectResponses[interaction_type];
    if (!response) {
      this.throwSCORMError(
        CMIElement,
        scorm2004_errors.TYPE_MISMATCH,
        `Incorrect Response Type: ${interaction_type}`,
      );
      return;
    }
    const formatRegex = new RegExp(response.format);
    for (let i = 0; i < nodes.length && this.lastErrorCode === "0"; i++) {
      if (interaction_type.match("^(fill-in|long-fill-in|matching|performance|sequencing)$")) {
        nodes[i] = this.removeCorrectResponsePrefixes(CMIElement, nodes[i]);
      }

      if (response?.delimiter2) {
        const values = nodes[i].split(response.delimiter2);
        if (values.length === 2) {
          const matches = values[0].match(formatRegex);
          if (!matches) {
            this.throwSCORMError(
              CMIElement,
              scorm2004_errors.TYPE_MISMATCH,
              `${interaction_type}: ${value}`,
            );
          } else {
            if (!response.format2 || !values[1].match(new RegExp(response.format2))) {
              this.throwSCORMError(
                CMIElement,
                scorm2004_errors.TYPE_MISMATCH,
                `${interaction_type}: ${value}`,
              );
            }
          }
        } else {
          this.throwSCORMError(
            CMIElement,
            scorm2004_errors.TYPE_MISMATCH,
            `${interaction_type}: ${value}`,
          );
        }
      } else {
        const matches = nodes[i].match(formatRegex);
        if ((!matches && value !== "") || (!matches && interaction_type === "true-false")) {
          this.throwSCORMError(
            CMIElement,
            scorm2004_errors.TYPE_MISMATCH,
            `${interaction_type}: ${value}`,
          );
        } else {
          if (interaction_type === "numeric" && nodes.length > 1) {
            if (Number(nodes[0]) > Number(nodes[1])) {
              this.throwSCORMError(
                CMIElement,
                scorm2004_errors.TYPE_MISMATCH,
                `${interaction_type}: ${value}`,
              );
            }
          } else {
            if (nodes[i] !== "" && response.unique) {
              for (let j = 0; j < i && this.lastErrorCode === "0"; j++) {
                if (nodes[i] === nodes[j]) {
                  this.throwSCORMError(
                    CMIElement,
                    scorm2004_errors.TYPE_MISMATCH,
                    `${interaction_type}: ${value}`,
                  );
                }
              }
            }
          }
        }
      }
    }
  }

  /**
   * Remove prefixes from correct_response - delegates to ValidationModule
   * @param {string} CMIElement
   * @param {string} node
   * @return {*}
   */
  removeCorrectResponsePrefixes(CMIElement: string, node: string): any {
    let seenOrder = false;
    let seenCase = false;
    let seenLang = false;

    const prefixRegex = new RegExp("^({(lang|case_matters|order_matters)=([^}]+)})");
    let matches = node.match(prefixRegex);
    let langMatches = null;
    while (matches) {
      switch (matches[2]) {
        case "lang":
          langMatches = node.match(scorm2004_regex.CMILangcr);
          if (langMatches) {
            const lang = langMatches[3];
            if (lang !== undefined && lang.length > 0) {
              if (!ValidLanguages.includes(lang.toLowerCase())) {
                this.throwSCORMError(CMIElement, scorm2004_errors.TYPE_MISMATCH, `${node}`);
              }
            }
          }
          seenLang = true;
          break;
        case "case_matters":
          if (!seenLang && !seenOrder && !seenCase) {
            if (matches[3] !== "true" && matches[3] !== "false") {
              this.throwSCORMError(CMIElement, scorm2004_errors.TYPE_MISMATCH, `${node}`);
            }
          }

          seenCase = true;
          break;
        case "order_matters":
          if (!seenCase && !seenLang && !seenOrder) {
            if (matches[3] !== "true" && matches[3] !== "false") {
              this.throwSCORMError(CMIElement, scorm2004_errors.TYPE_MISMATCH, `${node}`);
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
   * @param {Scorm2004Impl} newAPI
   */
  replaceWithAnotherScormAPI(newAPI: Scorm2004Impl) {
    // Data Model
    this.cmi = newAPI.cmi;
    this.adl = newAPI.adl;
  }

  /**
   * Render the cmi object to the proper format for LMS commit - delegates to DataSerializationModule
   *
   * @param {boolean} terminateCommit
   * @return {object|Array}
   */
  renderCommitCMI(terminateCommit: boolean): StringKeyMap | Array<any> {
    const cmiExport: StringKeyMap = this.renderCMIToJSONObject();

    if (terminateCommit) {
      (cmiExport.cmi as any).total_time = (this.cmi as any).getCurrentTotalTime();
    }

    const result = [];
    const flattened: StringKeyMap = Utilities.flatten(cmiExport);
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
   * Render the cmi object to the proper format for LMS commit - delegates to DataSerializationModule
   * @param {boolean} terminateCommit
   * @return {CommitObject}
   */
  renderCommitObject(terminateCommit: boolean): CommitObject {
    const cmiExport = this.renderCommitCMI(terminateCommit);
    const totalTimeDuration = this.cmi.getCurrentTotalTime();
    const totalTimeSeconds = Utilities.getDurationAsSeconds(
      totalTimeDuration,
      scorm2004_regex.CMITimespan,
    );

    let completionStatus = CompletionStatus.UNKNOWN;
    let successStatus = SuccessStatus.UNKNOWN;
    if (this.cmi.completion_status) {
      if (this.cmi.completion_status === "completed") {
        completionStatus = CompletionStatus.COMPLETED;
      } else if (this.cmi.completion_status === "incomplete") {
        completionStatus = CompletionStatus.INCOMPLETE;
      }
    }
    if (this.cmi.success_status) {
      if (this.cmi.success_status === "passed") {
        successStatus = SuccessStatus.PASSED;
      } else if (this.cmi.success_status === "failed") {
        successStatus = SuccessStatus.FAILED;
      }
    }

    const score = this.cmi.score;
    let scoreObject: ScoreObject = null;
    if (score) {
      scoreObject = {};

      if (!Number.isNaN(Number.parseFloat(score.raw))) {
        scoreObject.raw = Number.parseFloat(score.raw);
      }
      if (!Number.isNaN(Number.parseFloat(score.min))) {
        scoreObject.min = Number.parseFloat(score.min);
      }
      if (!Number.isNaN(Number.parseFloat(score.max))) {
        scoreObject.max = Number.parseFloat(score.max);
      }
      if (!Number.isNaN(Number.parseFloat(score.scaled))) {
        scoreObject.scaled = Number.parseFloat(score.scaled);
      }
    }

    const commitObject: CommitObject = {
      completionStatus: completionStatus,
      successStatus: successStatus,
      totalTimeSeconds: totalTimeSeconds,
      runtimeData: cmiExport as StringKeyMap,
    };
    if (scoreObject) {
      commitObject.score = scoreObject;
    }
    return commitObject;
  }

  /**
   * Attempts to store the data to the LMS - delegates to DataSerializationModule
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
      this.adl.nav.request !==
        ((this.startingData?.adl as StringKeyMap)?.nav as StringKeyMap)?.request &&
      this.adl.nav.request !== "_none_"
    ) {
      navRequest = true;
    }

    const commitObject = this.getCommitObject(terminateCommit);
    if (typeof this.settings.lmsCommitUrl === "string") {
      const result = await this.processHttpRequest(
        this.settings.lmsCommitUrl,
        {
          commitObject: commitObject,
        },
        terminateCommit,
      );

      // Check if this is a sequencing call, and then call the necessary JS
      if (
        navRequest &&
        result.navRequest !== undefined &&
        result.navRequest !== "" &&
        typeof result.navRequest === "string"
      ) {
        Function(`"use strict";(() => { ${result.navRequest} })()`)();
      } else if (result?.navRequest && !navRequest) {
        if (
          typeof result.navRequest === "object" &&
          Object.hasOwnProperty.call(result.navRequest, "name")
        ) {
          this.processListeners(result.navRequest.name as string, result.navRequest.data as string);
        }
      }

      return result;
    }

    return {
      result: "true",
      errorCode: 0,
    };
  }
}

export { Scorm2004Impl as Scorm2004API };
