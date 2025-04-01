import BaseAPI from "./BaseAPI";
import { CMI } from "./cmi/scorm2004/cmi";
import { StringKeyMap, stringMatches } from "./utilities";
import {
  global_constants,
  scorm2004_constants,
} from "./constants/api_constants";
import { scorm2004_errors } from "./constants/error_codes";
import { CMIObjectivesObject } from "./cmi/scorm2004/objectives";
import { ADL } from "./cmi/scorm2004/adl";
import { CommitObject, ResultObject, Settings } from "./types/api_types";
import { scorm2004_regex } from "./constants/regex";

// Import functions from extracted modules
import * as ValidationModule from "./scorm2004/validation";
import * as CMIElementHandlerModule from "./scorm2004/cmi_element_handler";
import * as CMIValueHandlerModule from "./scorm2004/cmi_value_handler";
import * as DataSerializationModule from "./scorm2004/data_serialization";
import { BaseCMI } from "./cmi/common/base_cmi";
import { CMIInteractionsObject } from "./cmi/scorm2004/interactions";
import { CMIArray } from "./cmi/common/array";
import { ResponseType } from "./constants/response_constants";

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
        this.processListeners("SequenceNext");
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
    return CMIValueHandlerModule.setCMIValue(
      CMIElement,
      value,
      this._commonSetCMIValue.bind(this),
      this._globalObjectives,
      this.settings.globalObjectiveIds,
      this.cmi.objectives,
    );
  }

  /**
   * Gets or builds a new child element to add to the array - delegates to CMIElementHandlerModule
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
    return CMIElementHandlerModule.getChildElement(
      CMIElement,
      value,
      foundFirstIndex,
      this.createCorrectResponsesObject.bind(this),
    );
  }

  /**
   * Creates a correct responses object for an interaction - delegates to CMIElementHandlerModule
   *
   * @param {string} CMIElement
   * @param {any} value
   * @return {BaseCMI|null}
   */
  private createCorrectResponsesObject(
    CMIElement: string,
    value: any,
  ): BaseCMI | null {
    return CMIElementHandlerModule.createCorrectResponsesObject(
      CMIElement,
      value,
      this.cmi.interactions.childArray,
      this.throwSCORMError.bind(this),
      this.checkDuplicateChoiceResponse.bind(this),
      this.checkValidResponseType.bind(this),
      this.lastErrorCode,
      this.isInitialized(),
      this.checkCorrectResponseValue.bind(this),
    );
  }

  /**
   * Checks for valid response types - delegates to ValidationModule
   * @param {ResponseType} response_type
   * @param {any} value
   * @param {string} interaction_type
   */
  checkValidResponseType(
    response_type: ResponseType,
    value: any,
    interaction_type: string,
  ) {
    ValidationModule.checkValidResponseType(
      response_type,
      value,
      interaction_type,
      this.throwSCORMError.bind(this),
      this.checkCorrectResponseValue.bind(this),
    );
  }

  /**
   * Checks for duplicate 'choice' responses - delegates to ValidationModule
   * @param {CMIInteractionsObject} interaction
   * @param {any} value
   */
  checkDuplicateChoiceResponse(interaction: CMIInteractionsObject, value: any) {
    ValidationModule.checkDuplicateChoiceResponse(
      interaction,
      value,
      this.throwSCORMError.bind(this),
      this.lastErrorCode,
    );
  }

  /**
   * Validate correct response - delegates to ValidationModule
   * @param {string} CMIElement
   * @param {*} value
   */
  validateCorrectResponse(CMIElement: string, value: any) {
    const parts = CMIElement.split(".");
    const index = Number(parts[2]);
    const interaction = this.cmi.interactions.childArray[index];

    ValidationModule.validateCorrectResponse(
      CMIElement,
      value,
      interaction,
      this.throwSCORMError.bind(this),
      this.lastErrorCode,
      this.checkDuplicateChoiceResponse.bind(this),
      this.checkValidResponseType.bind(this),
      this.checkDuplicatedPattern.bind(this),
      this.checkCorrectResponseValue.bind(this),
    );
  }

  /**
   * Gets a value from the CMI Object - delegates to CMIValueHandlerModule
   *
   * @param {string} CMIElement
   * @return {*}
   */
  override getCMIValue(CMIElement: string): any {
    return CMIValueHandlerModule.getCMIValue(
      CMIElement,
      this._commonGetCMIValue.bind(this),
    );
  }

  /**
   * Returns the message that corresponds to errorNumber.
   *
   * @param {(string|number)} errorNumber
   * @param {boolean} detail
   * @return {string}
   */
  override getLmsErrorMessageDetails(
    errorNumber: string | number,
    detail: boolean,
  ): string {
    let basicMessage = "";
    let detailMessage = "";

    // Set error number to string since inconsistent from modules if string or number
    errorNumber = String(errorNumber);
    if (scorm2004_constants.error_descriptions[errorNumber]) {
      basicMessage =
        scorm2004_constants.error_descriptions[errorNumber].basicMessage;
      detailMessage =
        scorm2004_constants.error_descriptions[errorNumber].detailMessage;
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
  checkDuplicatedPattern(
    correct_response: CMIArray,
    current_index: number,
    value: any,
  ): boolean {
    return ValidationModule.checkDuplicatedPattern(
      correct_response,
      current_index,
      value,
    );
  }

  /**
   * Checks for a valid correct_response value - delegates to ValidationModule
   * @param {string} interaction_type
   * @param {Array} nodes
   * @param {*} value
   */
  checkCorrectResponseValue(
    interaction_type: string,
    nodes: Array<any>,
    value: any,
  ) {
    ValidationModule.checkCorrectResponseValue(
      interaction_type,
      nodes,
      value,
      this.throwSCORMError.bind(this),
      this.removeCorrectResponsePrefixes.bind(this),
      this.lastErrorCode,
    );
  }

  /**
   * Remove prefixes from correct_response - delegates to ValidationModule
   * @param {string} node
   * @return {*}
   */
  removeCorrectResponsePrefixes(node: string): any {
    return ValidationModule.removeCorrectResponsePrefixes(
      node,
      this.throwSCORMError.bind(this),
    );
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
    return DataSerializationModule.renderCommitCMI(
      terminateCommit,
      this.cmi,
      this.settings,
      this.renderCMIToJSONObject.bind(this),
    );
  }

  /**
   * Render the cmi object to the proper format for LMS commit - delegates to DataSerializationModule
   * @param {boolean} terminateCommit
   * @return {CommitObject}
   */
  renderCommitObject(terminateCommit: boolean): CommitObject {
    return DataSerializationModule.renderCommitObject(
      terminateCommit,
      this.cmi,
      this.renderCommitCMI.bind(this),
    );
  }

  /**
   * Attempts to store the data to the LMS - delegates to DataSerializationModule
   *
   * @param {boolean} terminateCommit
   * @return {ResultObject}
   */
  async storeData(terminateCommit: boolean): Promise<ResultObject> {
    return DataSerializationModule.storeData(
      terminateCommit,
      this.cmi,
      this.adl,
      this.startingData,
      this.settings,
      this.getCommitObject.bind(this),
      this.processHttpRequest.bind(this),
      this.processListeners.bind(this),
    );
  }
}

export { Scorm2004Impl };
