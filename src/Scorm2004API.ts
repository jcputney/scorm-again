import BaseAPI from "./BaseAPI";
import { CMI } from "./cmi/scorm2004/cmi";
import * as Utilities from "./utilities";
import {
  ParsedNavigationRequest,
  StringKeyMap,
  parseNavigationRequest,
  stringMatches,
} from "./utilities";
import { global_constants, scorm2004_constants } from "./constants/api_constants";
import { scorm2004_errors } from "./constants/error_codes";
import { CMIObjectivesObject } from "./cmi/scorm2004/objectives";
import { ADL } from "./cmi/scorm2004/adl";
import {
  CommitObject,
  ResultObject,
  ScoreObject,
  SequencingStateMetadata,
  Settings,
} from "./types/api_types";
import {
  ActivitySettings,
  SequencingCollectionSettings,
  SequencingControlsSettings,
  SequencingEventListeners,
  SequencingRulesSettings,
  SequencingSettings,
  RollupRulesSettings,
} from "./types/sequencing_types";
import { scorm2004_regex } from "./constants/regex";
import { BaseCMI } from "./cmi/common/base_cmi";
import { CMIInteractionsObject } from "./cmi/scorm2004/interactions";
import { CompletionStatus, LogLevelEnum, SuccessStatus } from "./constants/enums";
import { Sequencing } from "./cmi/scorm2004/sequencing/sequencing";
import { SequencingConfiguration, SequencingService } from "./services/SequencingService";
import { IHttpService } from "./interfaces/services";

// Import extracted classes
import {
  Scorm2004ResponseValidator,
  ValidationContext,
} from "./handlers/scorm2004/response_validator";
import { Scorm2004CMIHandler, CMIHandlerContext } from "./handlers/scorm2004/cmi_handler";
import { ActivityTreeBuilder } from "./configuration/activity_tree_builder";
import { SequencingConfigurationBuilder } from "./configuration/sequencing_configuration_builder";
import {
  GlobalObjectiveManager,
  GlobalObjectiveContext,
} from "./objectives/global_objective_manager";
import {
  SequencingStatePersistence,
  PersistenceContext,
} from "./persistence/sequencing_state_persistence";
import {
  Scorm2004DataSerializer,
  DataSerializerContext,
} from "./serialization/scorm2004_data_serializer";

/**
 * API class for SCORM 2004
 */
class Scorm2004API extends BaseAPI {
  private _version: string = "1.0";
  private readonly _sequencing: Sequencing;
  private _sequencingService: SequencingService | null = null;
  private _extractedScoItemIds: string[] = [];
  private _sequencingCollections: Record<string, SequencingCollectionSettings> = {};

  // Extracted class instances
  private _responseValidator: Scorm2004ResponseValidator;
  private _cmiHandler: Scorm2004CMIHandler;
  private _activityTreeBuilder: ActivityTreeBuilder;
  private _sequencingConfigBuilder: SequencingConfigurationBuilder;
  private _globalObjectiveManager: GlobalObjectiveManager;
  private _statePersistence: SequencingStatePersistence | null = null;
  private _dataSerializer: Scorm2004DataSerializer;

  /**
   * Constructor for SCORM 2004 API
   * @param {Settings} settings
   * @param {IHttpService} httpService - Optional HTTP service instance
   */
  constructor(settings?: Settings, httpService?: IHttpService) {
    const settingsCopy = settings ? { ...settings } : undefined;
    if (settingsCopy) {
      if (settingsCopy.mastery_override === undefined) {
        settingsCopy.mastery_override = false;
      }
    }
    super(scorm2004_errors, settingsCopy, httpService);

    this.cmi = new CMI();
    this.adl = new ADL();
    this._sequencing = new Sequencing();

    // Connect the sequencing object to the ADL's sequencing property
    this.adl.sequencing = this._sequencing;

    // Initialize extracted classes
    this._sequencingConfigBuilder = new SequencingConfigurationBuilder();
    this._activityTreeBuilder = new ActivityTreeBuilder({}, this._sequencingConfigBuilder);

    // Create validation context - use arrow functions to ensure spies work correctly
    const validationContext: ValidationContext = {
      throwSCORMError: (element: string, errorCode: number, message?: string) =>
        this.throwSCORMError(element, errorCode, message),
      getLastErrorCode: () => this.lastErrorCode,
      checkCorrectResponseValue: (
        CMIElement: string,
        interaction_type: string,
        nodes: Array<any>,
        value: any,
      ) => this.checkCorrectResponseValue(CMIElement, interaction_type, nodes, value),
    };
    this._responseValidator = new Scorm2004ResponseValidator(validationContext);

    // Create CMI handler context - use arrow functions to ensure spies work correctly
    const cmiHandlerContext: CMIHandlerContext = {
      cmi: this.cmi,
      isInitialized: () => this.isInitialized(),
      throwSCORMError: (element: string, errorCode: number, message?: string) =>
        this.throwSCORMError(element, errorCode, message),
      getLastErrorCode: () => this.lastErrorCode,
    };
    this._cmiHandler = new Scorm2004CMIHandler(cmiHandlerContext, this._responseValidator);

    // Initialize global objective manager context
    const globalObjectiveContext: GlobalObjectiveContext = {
      settings: this.settings,
      cmi: this.cmi,
      sequencing: this._sequencing,
      sequencingService: this._sequencingService,
      commonSetCMIValue: this._commonSetCMIValue.bind(this),
    };
    this._globalObjectiveManager = new GlobalObjectiveManager(globalObjectiveContext);

    // Initialize data serializer - use getter to always get current settings
    const dataSerializerContext: DataSerializerContext = {
      getSettings: () => this.settings,
      cmi: this.cmi,
      sequencingService: this._sequencingService,
      renderCMIToJSONObject: this.renderCMIToJSONObject.bind(this),
    };
    this._dataSerializer = new Scorm2004DataSerializer(
      dataSerializerContext,
      this._globalObjectiveManager,
    );

    // Configure sequencing if settings are provided
    if (settingsCopy?.sequencing) {
      this.configureSequencing(settingsCopy.sequencing);
    }

    // Initialize sequencing service
    this.initializeSequencingService(settingsCopy);

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

  public Initialize: (parameter?: string) => string;
  public Terminate: (parameter?: string) => string;
  public GetValue: (CMIElement: string) => string;
  public SetValue: (CMIElement: string, value: any) => string;
  public Commit: (parameter?: string) => string;
  public GetLastError: () => string;
  public GetErrorString: (CMIErrorCode: string | number) => string;
  public GetDiagnostic: (CMIErrorCode: string | number) => string;

  /**
   * Called when the API needs to be reset
   *
   * @param {Settings} settings - Optional new settings to merge with existing settings
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
   * @return {CMIObjectivesObject[]} Array of global objective objects
   */
  get globalObjectives(): CMIObjectivesObject[] {
    return this._globalObjectiveManager.globalObjectives;
  }

  /**
   * Setter for _globalObjectives (for backward compatibility)
   * @param {CMIObjectivesObject[]} objectives - Array of global objective objects
   */
  set _globalObjectives(objectives: CMIObjectivesObject[]) {
    this._globalObjectiveManager.globalObjectives = objectives;
  }

  /**
   * Getter for _globalObjectives (for backward compatibility with tests using bracket notation)
   * @return {CMIObjectivesObject[]} Array of global objective objects
   */
  get _globalObjectives(): CMIObjectivesObject[] {
    return this._globalObjectiveManager.globalObjectives;
  }

  /**
   * Build an objective map entry from a CMI objectives object
   * @param {CMIObjectivesObject} objective - The CMI objectives object
   * @return {object} The objective map entry
   */
  buildObjectiveMapEntryFromCMI(objective: CMIObjectivesObject): any {
    return this._globalObjectiveManager.buildObjectiveMapEntryFromCMI(objective);
  }

  /**
   * Capture a snapshot of global objectives
   * @return {object} The global objectives snapshot
   */
  captureGlobalObjectiveSnapshot(): any {
    return this._globalObjectiveManager.captureGlobalObjectiveSnapshot();
  }

  /**
   * Update a global objective from CMI data
   * @param {string} objectiveId - The objective ID
   * @param {CMIObjectivesObject} objective - The CMI objectives object
   */
  updateGlobalObjectiveFromCMI(objectiveId: string, objective: CMIObjectivesObject): void {
    this._globalObjectiveManager.updateGlobalObjectiveFromCMI(objectiveId, objective);
  }

  /**
   * Parse an objective number value
   * @param {any} value - The value to parse
   * @return {number | null} The parsed number or null
   */
  parseObjectiveNumber(value: any): number | null {
    return this._globalObjectiveManager.parseObjectiveNumber(value);
  }

  /**
   * Build a CMI objectives object from JSON data
   * @param {any} data - The JSON data
   * @return {CMIObjectivesObject} The CMI objectives object
   */
  buildCMIObjectiveFromJSON(data: any): CMIObjectivesObject {
    return this._globalObjectiveManager.buildCMIObjectiveFromJSON(data);
  }

  /**
   * Build CMI objectives from a snapshot map
   * @param {Record<string, any>} snapshot - The snapshot map
   * @return {CMIObjectivesObject[]} Array of CMI objectives objects
   */
  buildCMIObjectivesFromMap(snapshot: Record<string, any>): CMIObjectivesObject[] {
    return this._globalObjectiveManager.buildCMIObjectivesFromMap(snapshot);
  }

  /**
   * Creates a correct responses object for an interaction
   * @param {string} CMIElement - The CMI element path
   * @param {any} value - The value being set
   * @return {BaseCMI|null} The correct responses object or null
   */
  createCorrectResponsesObject(CMIElement: string, value: any): BaseCMI | null {
    return this._cmiHandler.createCorrectResponsesObject(CMIElement, value);
  }

  /**
   * Compress state data (delegates to persistence class)
   * @param {string} data - Data to compress
   * @return {string} Compressed data
   */
  compressStateData(data: string): string {
    if (this._statePersistence) {
      return this._statePersistence.compressStateData(data);
    }
    // Fallback: simple base64 encoding
    if (typeof btoa !== "undefined") {
      return btoa(encodeURIComponent(data));
    }
    return data;
  }

  /**
   * Decompress state data (delegates to persistence class)
   * @param {string} data - Data to decompress
   * @return {string} Decompressed data
   */
  decompressStateData(data: string): string {
    if (this._statePersistence) {
      return this._statePersistence.decompressStateData(data);
    }
    // Fallback: simple base64 decoding
    if (typeof atob !== "undefined") {
      try {
        return decodeURIComponent(atob(data));
      } catch {
        return data;
      }
    }
    return data;
  }

  /**
   * Initialize - Begins a communication session with the LMS
   *
   * @param {string} parameter - Must be an empty string per SCORM 2004 specification
   * @return {string} "true" or "false"
   */
  lmsInitialize(parameter: string = ""): string {
    if (parameter !== "") {
      this.throwSCORMError("api", this._error_codes.ARGUMENT_ERROR);
      return global_constants.SCORM_FALSE;
    }

    this.cmi.initialize();
    const result = this.initialize(
      "Initialize",
      "LMS was already initialized!",
      "LMS is already finished!",
    );

    if (result === global_constants.SCORM_TRUE && this._sequencingService) {
      this._sequencingService.initialize();
    }

    if (result === global_constants.SCORM_TRUE) {
      this._globalObjectiveManager.restoreGlobalObjectivesToCMI();
    }

    if (result === global_constants.SCORM_TRUE && this.settings.sequencingStatePersistence) {
      this.loadSequencingState().catch(() => {
        this.apiLog("lmsInitialize", "Failed to auto-load sequencing state", LogLevelEnum.WARN);
      });
    }

    return result;
  }

  /**
   * Terminate - Ends the communication session and persists data
   *
   * @param {string} parameter - Must be an empty string per SCORM 2004 specification
   * @return {string} "true" or "false"
   */
  lmsFinish(parameter: string = ""): string {
    if (parameter !== "") {
      this.throwSCORMError("api", this._error_codes.ARGUMENT_ERROR);
      return global_constants.SCORM_FALSE;
    }

    const pendingNavRequest = this.adl?.nav?.request || "_none_";
    const exitType = this.cmi?.getExitValueInternal() || "";
    const wasAlreadyTerminated = this.isTerminated();
    const deliveryInProgress = this._sequencingService?.isDeliveryInProgress() ?? false;

    const result = this.terminate("Terminate", true);

    if (result === global_constants.SCORM_TRUE && !wasAlreadyTerminated && !deliveryInProgress) {
      let navigationHandled = false;
      let processedSequencingRequest: string | null = null;
      let normalizedRequest = pendingNavRequest;
      let normalizedTarget = "";
      const choiceJumpRegex = new RegExp(scorm2004_regex.NAVEvent);

      if (pendingNavRequest !== "_none_") {
        const matches = pendingNavRequest.match(choiceJumpRegex);
        if (matches) {
          if (matches.groups?.choice_target) {
            normalizedTarget = matches.groups?.choice_target;
            normalizedRequest = "choice";
          } else if (matches.groups?.jump_target) {
            normalizedTarget = matches.groups?.jump_target;
            normalizedRequest = "jump";
          }
        }
      }

      if (this._sequencingService) {
        try {
          let requestToProcess: string | null = null;
          let targetForProcessing: string | undefined;

          if (normalizedRequest !== "_none_") {
            requestToProcess = normalizedRequest;
            targetForProcessing = normalizedTarget || undefined;
          } else if (this._sequencing.getCurrentActivity()) {
            requestToProcess = "exit";
          }

          if (requestToProcess) {
            navigationHandled = this._sequencingService.processNavigationRequest(
              requestToProcess,
              targetForProcessing,
              exitType,
            );
            processedSequencingRequest = requestToProcess;
          }
        } catch (error) {
          navigationHandled = false;
        }
      }

      if (!navigationHandled) {
        if (pendingNavRequest !== "_none_") {
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

          const action = navActions[normalizedRequest];
          if (action) {
            this.processListeners(action, "adl.nav.request", normalizedTarget);
          }
        } else if (this.settings.autoProgress) {
          this.processListeners("SequenceNext", undefined, "next");
        }
      }

      if (
        this._sequencingService &&
        processedSequencingRequest &&
        ["exitAll", "abandonAll", "suspendAll"].includes(processedSequencingRequest)
      ) {
        this._sequencingService.terminate();
      }

      this.adl.nav.request = "_none_";
    }

    return result;
  }

  /**
   * GetValue - Retrieves a value from the CMI data model
   *
   * @param {string} CMIElement - The CMI element path
   * @return {string} The value of the element, or empty string
   */
  lmsGetValue(CMIElement: string): string {
    if (CMIElement === "adl.nav.request") {
      this.throwSCORMError(
        CMIElement,
        scorm2004_errors.WRITE_ONLY_ELEMENT,
        "adl.nav.request is write-only",
      );
      return "";
    }

    const adlNavRequestRegex =
      "^adl\\.nav\\.request_valid\\.(choice|jump)\\.{target=([a-zA-Z0-9-_]+)}$";
    if (stringMatches(CMIElement, adlNavRequestRegex)) {
      const matches = CMIElement.match(adlNavRequestRegex);
      if (matches) {
        const request = matches[1];
        const target = matches[2]?.replace(/{target=/g, "").replace(/}/g, "") || "";
        if (request === "choice" || request === "jump") {
          const overallProcess = this._sequencing?.overallSequencingProcess;

          if (this.settings.scoItemIdValidator) {
            return String(this.settings.scoItemIdValidator(target));
          }

          if (overallProcess?.predictChoiceEnabled && request === "choice") {
            return overallProcess.predictChoiceEnabled(target) ? "true" : "false";
          } else if (overallProcess?.predictJumpEnabled && request === "jump") {
            return overallProcess.predictJumpEnabled(target) ? "true" : "false";
          } else {
            if (this._extractedScoItemIds.length > 0) {
              return String(this._extractedScoItemIds.includes(target));
            }
            return String(this.settings?.scoItemIds?.includes(target));
          }
        }
      }
    }

    if (this.isTerminated()) {
      this.lastErrorCode = String(scorm2004_errors.RETRIEVE_AFTER_TERM);
      return "";
    }
    if (!this.isInitialized()) {
      this.lastErrorCode = String(scorm2004_errors.RETRIEVE_BEFORE_INIT);
      return "";
    }

    if (CMIElement === "cmi.completion_status") {
      return this._cmiHandler.evaluateCompletionStatus();
    }

    if (CMIElement === "cmi.success_status") {
      return this._cmiHandler.evaluateSuccessStatus();
    }

    return this.getValue("GetValue", true, CMIElement);
  }

  /**
   * SetValue - Sets a value in the CMI data model
   *
   * @param {string} CMIElement - The CMI element path
   * @param {any} value - The value to set
   * @return {string} "true" or "false"
   */
  lmsSetValue(CMIElement: string, value: any): string {
    let oldValue: any = null;
    try {
      oldValue = this.getCMIValue(CMIElement);
    } catch (error) {
      oldValue = null;
    }

    const result = this.setValue("SetValue", "Commit", true, CMIElement, value);

    if (result === global_constants.SCORM_TRUE && this._sequencingService) {
      try {
        this._sequencingService.triggerRollupOnCMIChange(CMIElement, oldValue, value);
      } catch (rollupError) {
        console.warn(`Sequencing rollup failed for ${CMIElement}: ${rollupError}`);
      }
    }

    if (
      result === global_constants.SCORM_TRUE &&
      this.settings.sequencingStatePersistence?.autoSaveOn === "setValue"
    ) {
      const sequencingElements = [
        "cmi.completion_status",
        "cmi.success_status",
        "cmi.score.scaled",
        "cmi.objectives",
        "adl.nav.request",
      ];

      if (sequencingElements.some((element) => CMIElement.startsWith(element))) {
        this.saveSequencingState().catch(() => {
          this.apiLog("lmsSetValue", "Failed to auto-save sequencing state", LogLevelEnum.WARN);
        });
      }
    }

    return result;
  }

  /**
   * Commit - Requests immediate persistence of data to the LMS
   *
   * @param {string} parameter - Must be an empty string per SCORM 2004 specification
   * @return {string} "true" or "false"
   */
  lmsCommit(parameter: string = ""): string {
    if (parameter !== "") {
      this.throwSCORMError("api", this._error_codes.ARGUMENT_ERROR);
      return global_constants.SCORM_FALSE;
    }

    if (this.settings.throttleCommits) {
      this.scheduleCommit(500, "Commit");
      return global_constants.SCORM_TRUE;
    } else {
      const result = this.commit("Commit", true);

      if (
        result === global_constants.SCORM_TRUE &&
        this.settings.sequencingStatePersistence?.autoSaveOn === "commit"
      ) {
        this.saveSequencingState().catch(() => {
          this.apiLog("lmsCommit", "Failed to auto-save sequencing state", LogLevelEnum.WARN);
        });
      }

      return result;
    }
  }

  /**
   * GetLastError - Returns the error code from the last API call
   * @return {string} Error code as a string
   */
  lmsGetLastError(): string {
    return this.getLastError("GetLastError");
  }

  /**
   * GetErrorString - Returns a short description for an error code
   * @param {string|number} CMIErrorCode - The error code
   * @return {string} Short error description
   */
  lmsGetErrorString(CMIErrorCode: string | number): string {
    return this.getErrorString("GetErrorString", CMIErrorCode);
  }

  /**
   * GetDiagnostic - Returns detailed diagnostic information for an error
   * @param {string|number} CMIErrorCode - The error code
   * @return {string} Detailed diagnostic information
   */
  lmsGetDiagnostic(CMIErrorCode: string | number): string {
    return this.getDiagnostic("GetDiagnostic", CMIErrorCode);
  }

  /**
   * Sets a value on the CMI Object
   * @param {string} CMIElement
   * @param {any} value
   * @return {string}
   */
  override setCMIValue(CMIElement: string, value: any): string {
    if (stringMatches(CMIElement, "cmi\\.objectives\\.\\d+")) {
      const parts = CMIElement.split(".");
      const index = Number(parts[2]);
      const element_base = `cmi.objectives.${index}`;

      let objective_id;
      const setting_id = stringMatches(CMIElement, "cmi\\.objectives\\.\\d+\\.id");

      if (setting_id) {
        objective_id = value;
      } else {
        const objective = this.cmi.objectives.findObjectiveByIndex(index);
        objective_id = objective ? objective.id : undefined;
      }

      const is_global = objective_id && this.settings.globalObjectiveIds?.includes(objective_id);

      if (is_global) {
        const { index: global_index } =
          this._globalObjectiveManager.findOrCreateGlobalObjective(objective_id);

        const global_element = CMIElement.replace(
          element_base,
          `_globalObjectives.${global_index}`,
        );
        this._commonSetCMIValue("SetGlobalObjectiveValue", true, global_element, value);

        const updatedObjective = this._globalObjectiveManager.globalObjectives[global_index];
        if (objective_id && updatedObjective) {
          this._globalObjectiveManager.updateGlobalObjectiveFromCMI(objective_id, updatedObjective);
        }
      }
    }
    return this._commonSetCMIValue("SetValue", true, CMIElement, value);
  }

  /**
   * Gets or builds a new child element to add to the array
   * @param {string} CMIElement
   * @param {any} value
   * @param {boolean} foundFirstIndex
   * @return {BaseCMI|null}
   */
  getChildElement(CMIElement: string, value: any, foundFirstIndex: boolean): BaseCMI | null {
    return this._cmiHandler.getChildElement(CMIElement, value, foundFirstIndex);
  }

  /**
   * Validate correct response
   * @param {string} CMIElement
   * @param {*} value
   */
  validateCorrectResponse(CMIElement: string, value: any) {
    const parts = CMIElement.split(".");
    const index = Number(parts[2]);
    const interaction = this.cmi.interactions.childArray[index] as
      | CMIInteractionsObject
      | undefined;

    if (!interaction) {
      this.throwSCORMError(CMIElement, scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED, CMIElement);
      return;
    }

    this._responseValidator.validateCorrectResponse(CMIElement, interaction, value);
  }

  /**
   * Checks for valid response types (delegated to response validator)
   * @param {string} CMIElement
   * @param {ResponseType} response_type
   * @param {any} value
   * @param {string} interaction_type
   */
  checkValidResponseType(
    CMIElement: string,
    response_type: any,
    value: any,
    interaction_type: string,
  ): void {
    this._responseValidator.checkValidResponseType(
      CMIElement,
      response_type,
      value,
      interaction_type,
    );
  }

  /**
   * Checks for duplicate 'choice' responses (delegated to response validator)
   * @param {string} CMIElement
   * @param {CMIInteractionsObject} interaction
   * @param {any} value
   */
  checkDuplicateChoiceResponse(
    CMIElement: string,
    interaction: CMIInteractionsObject,
    value: any,
  ): void {
    this._responseValidator.checkDuplicateChoiceResponse(CMIElement, interaction, value);
  }

  /**
   * Check to see if a correct_response value has been duplicated (delegated to response validator)
   * @param {CMIArray} correct_response
   * @param {number} current_index
   * @param {*} value
   * @return {boolean}
   */
  checkDuplicatedPattern(correct_response: any, current_index: number, value: any): boolean {
    return this._responseValidator.checkDuplicatedPattern(correct_response, current_index, value);
  }

  /**
   * Checks for a valid correct_response value (delegated to response validator)
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
  ): void {
    this._responseValidator.checkCorrectResponseValue(CMIElement, interaction_type, nodes, value);
  }

  /**
   * Remove prefixes from correct_response (delegated to response validator)
   * @param {string} CMIElement
   * @param {string} node
   * @return {any}
   */
  removeCorrectResponsePrefixes(CMIElement: string, node: string): any {
    return this._responseValidator.removeCorrectResponsePrefixes(CMIElement, node);
  }

  /**
   * Gets a value from the CMI Object
   * @param {string} CMIElement
   * @return {*}
   */
  override getCMIValue(CMIElement: string): any {
    return this._commonGetCMIValue("GetValue", true, CMIElement);
  }

  /**
   * Returns the message that corresponds to errorNumber.
   * @param {(string|number)} errorNumber
   * @param {boolean} detail
   * @return {string}
   */
  override getLmsErrorMessageDetails(errorNumber: string | number, detail: boolean): string {
    let basicMessage = "";
    let detailMessage = "";

    errorNumber = String(errorNumber);
    const errorDescription = scorm2004_constants.error_descriptions[errorNumber];
    if (errorDescription) {
      basicMessage = errorDescription.basicMessage;
      detailMessage = errorDescription.detailMessage;
    }

    return detail ? detailMessage : basicMessage;
  }

  /**
   * Replace the whole API with another
   * @param {Scorm2004API} newAPI
   */
  replaceWithAnotherScormAPI(newAPI: Scorm2004API) {
    this.cmi = newAPI.cmi;
    this.adl = newAPI.adl;
  }

  /**
   * Render the cmi object to the proper format for LMS commit
   * @param {boolean} terminateCommit
   * @param {boolean} includeTotalTime
   * @return {object|Array}
   */
  renderCommitCMI(
    terminateCommit: boolean,
    includeTotalTime: boolean = false,
  ): StringKeyMap | Array<any> {
    return this._dataSerializer.renderCommitCMI(terminateCommit, includeTotalTime);
  }

  /**
   * Render the cmi object to the proper format for LMS commit
   * @param {boolean} terminateCommit
   * @param {boolean} includeTotalTime
   * @return {CommitObject}
   */
  renderCommitObject(terminateCommit: boolean, includeTotalTime: boolean = false): CommitObject {
    return this._dataSerializer.renderCommitObject(terminateCommit, includeTotalTime);
  }

  /**
   * Attempts to store the data to the LMS
   * @param {boolean} terminateCommit
   * @return {ResultObject}
   */
  storeData(terminateCommit: boolean): ResultObject {
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
    const scoreObject = this.cmi?.score?.getScoreObject() || {};
    let completionStatusEnum = CompletionStatus.UNKNOWN;
    if (this.cmi.completion_status === "completed") {
      completionStatusEnum = CompletionStatus.COMPLETED;
    } else if (this.cmi.completion_status === "incomplete") {
      completionStatusEnum = CompletionStatus.INCOMPLETE;
    }
    let successStatusEnum = SuccessStatus.UNKNOWN;
    if (this.cmi.success_status === "passed") {
      successStatusEnum = SuccessStatus.PASSED;
    } else if (this.cmi.success_status === "failed") {
      successStatusEnum = SuccessStatus.FAILED;
    }
    this._globalObjectiveManager.syncCmiToSequencingActivity(
      completionStatusEnum,
      successStatusEnum,
      scoreObject,
    );
    if (typeof this.settings.lmsCommitUrl === "string") {
      const result = this.processHttpRequest(
        this.settings.lmsCommitUrl,
        commitObject,
        terminateCommit,
      );

      if (
        navRequest &&
        result.navRequest !== undefined &&
        result.navRequest !== "" &&
        typeof result.navRequest === "string"
      ) {
        const parsed: ParsedNavigationRequest = parseNavigationRequest(result.navRequest);

        if (!parsed.valid) {
          this.apiLog(
            "storeData",
            `Invalid navigation request from LMS: ${parsed.error}`,
            LogLevelEnum.WARN,
          );
        } else {
          const navEventMap: { [key: string]: string } = {
            start: "SequenceStart",
            resumeAll: "SequenceResumeAll",
            continue: "SequenceNext",
            previous: "SequencePrevious",
            choice: "SequenceChoice",
            jump: "SequenceJump",
            exit: "SequenceExit",
            exitAll: "SequenceExitAll",
            abandon: "SequenceAbandon",
            abandonAll: "SequenceAbandonAll",
            suspendAll: "SequenceSuspendAll",
          };

          const eventName = navEventMap[parsed.command];
          if (eventName) {
            this.processListeners(eventName, "adl.nav.request", parsed.targetActivityId);
          }
        }
      } else if (result?.navRequest && !navRequest) {
        if (
          typeof result.navRequest === "object" &&
          Object.hasOwnProperty.call(result.navRequest, "name") &&
          result.navRequest.name
        ) {
          this.processListeners(result.navRequest.name as string, result.navRequest.data as string);
        }
      }

      return result;
    }

    return {
      result: global_constants.SCORM_TRUE,
      errorCode: 0,
    };
  }

  /**
   * Configure sequencing based on provided settings
   * @param {SequencingSettings} sequencingSettings
   */
  private configureSequencing(sequencingSettings: SequencingSettings): void {
    this._sequencingCollections = this._sequencingConfigBuilder.sanitizeSequencingCollections(
      sequencingSettings.collections,
    );
    this._activityTreeBuilder.setSequencingCollections(this._sequencingCollections);

    if (sequencingSettings.activityTree) {
      this.configureActivityTree(sequencingSettings.activityTree);
    }

    if (sequencingSettings.sequencingRules) {
      this.configureSequencingRules(sequencingSettings.sequencingRules);
    }

    if (sequencingSettings.sequencingControls) {
      this.configureSequencingControls(sequencingSettings.sequencingControls);
    }

    if (sequencingSettings.rollupRules) {
      this.configureRollupRules(sequencingSettings.rollupRules);
    }

    if (sequencingSettings.hideLmsUi) {
      this._sequencing.hideLmsUi = this._sequencingConfigBuilder.sanitizeHideLmsUi(
        sequencingSettings.hideLmsUi,
      );
    } else {
      this._sequencing.hideLmsUi = [];
    }

    if (sequencingSettings.auxiliaryResources) {
      this._sequencing.auxiliaryResources =
        this._sequencingConfigBuilder.sanitizeAuxiliaryResources(
          sequencingSettings.auxiliaryResources,
        );
    } else {
      this._sequencing.auxiliaryResources = [];
    }
  }

  /**
   * Configure activity tree based on provided settings
   * @param {ActivitySettings} activityTreeSettings
   */
  private configureActivityTree(activityTreeSettings: ActivitySettings): void {
    const rootActivity = this._activityTreeBuilder.createActivity(activityTreeSettings);
    const activityTree = this._sequencing.activityTree;
    activityTree.root = rootActivity;
    this._extractedScoItemIds = this._activityTreeBuilder.extractActivityIds(rootActivity);
  }

  /**
   * Configure sequencing rules based on provided settings
   * @param {SequencingRulesSettings} sequencingRulesSettings
   */
  private configureSequencingRules(sequencingRulesSettings: SequencingRulesSettings): void {
    this._sequencingConfigBuilder.applySequencingRulesSettings(
      this._sequencing.sequencingRules,
      sequencingRulesSettings,
    );
  }

  /**
   * Configure sequencing controls based on provided settings
   * @param {SequencingControlsSettings} sequencingControlsSettings
   */
  private configureSequencingControls(
    sequencingControlsSettings: SequencingControlsSettings,
  ): void {
    this._sequencingConfigBuilder.applySequencingControlsSettings(
      this._sequencing.sequencingControls,
      sequencingControlsSettings,
    );
  }

  /**
   * Configure rollup rules based on provided settings
   * @param {RollupRulesSettings} rollupRulesSettings
   */
  private configureRollupRules(rollupRulesSettings: RollupRulesSettings): void {
    this._sequencingConfigBuilder.applyRollupRulesSettings(
      this._sequencing.rollupRules,
      rollupRulesSettings,
    );
  }

  /**
   * Initialize the sequencing service
   * @param {Settings} settings
   */
  private initializeSequencingService(settings?: Settings): void {
    try {
      const sequencingConfig: SequencingConfiguration = {
        autoRollupOnCMIChange: settings?.sequencing?.autoRollupOnCMIChange ?? true,
        autoProgressOnCompletion: settings?.sequencing?.autoProgressOnCompletion ?? false,
        validateNavigationRequests: settings?.sequencing?.validateNavigationRequests ?? true,
        enableEventSystem: settings?.sequencing?.enableEventSystem ?? true,
        logLevel: settings?.sequencing?.logLevel ?? "info",
      };

      this._sequencingService = new SequencingService(
        this._sequencing,
        this.cmi,
        this.adl,
        this.eventService || this,
        this.loggingService,
        sequencingConfig,
      );

      if (settings?.sequencing?.eventListeners) {
        this._sequencingService.setEventListeners(settings.sequencing.eventListeners);
      }

      // Update context references after sequencing service is created
      (this._globalObjectiveManager as any).context.sequencingService = this._sequencingService;
      (this._dataSerializer as any).context.sequencingService = this._sequencingService;

      // Initialize state persistence
      if (settings?.sequencingStatePersistence) {
        const persistenceContext: PersistenceContext = {
          settings: this.settings,
          apiLog: this.apiLog.bind(this),
          adl: this.adl,
          sequencing: this._sequencing,
          sequencingService: this._sequencingService,
          learnerId: this.cmi.learner_id,
        };
        this._statePersistence = new SequencingStatePersistence(
          persistenceContext,
          this._globalObjectiveManager,
        );
      }

      this._globalObjectiveManager.syncGlobalObjectiveIdsFromSequencing();
    } catch (error) {
      console.warn("Failed to initialize sequencing service:", error);
      this._sequencingService = null;
    }
  }

  /**
   * Get the sequencing service
   * @return {SequencingService | null}
   */
  public getSequencingService(): SequencingService | null {
    return this._sequencingService;
  }

  /**
   * Set sequencing event listeners
   * @param {SequencingEventListeners} listeners
   */
  public setSequencingEventListeners(listeners: SequencingEventListeners): void {
    if (this._sequencingService) {
      this._sequencingService.setEventListeners(listeners);
    }
  }

  /**
   * Update sequencing configuration
   * @param {SequencingConfiguration} config
   */
  public updateSequencingConfiguration(config: SequencingConfiguration): void {
    if (this._sequencingService) {
      this._sequencingService.updateConfiguration(config);
    }
  }

  /**
   * Get current sequencing state information
   * @return {object}
   */
  public getSequencingState(): any {
    if (this._sequencingService) {
      return this._sequencingService.getSequencingState();
    }
    return {
      isInitialized: false,
      isActive: false,
      currentActivity: null,
      rootActivity: this._sequencing.getRootActivity(),
      lastSequencingResult: null,
    };
  }

  /**
   * Process a navigation request directly
   * @param {string} request
   * @param {string} targetActivityId
   * @return {boolean}
   */
  public processNavigationRequest(request: string, targetActivityId?: string): boolean {
    if (this._sequencingService) {
      return this._sequencingService.processNavigationRequest(request, targetActivityId);
    }
    return false;
  }

  /**
   * Reset sequencing state explicitly
   */
  public resetSequencingState(): void {
    this._sequencing?.reset();
    this._sequencingService?.setEventListeners({});
  }

  /**
   * Get tracking data for a specific activity
   * @param {string} activityId
   * @return {object | null}
   */
  public getActivityTrackingData(activityId: string): {
    completionStatus: string;
    successStatus: string;
    progressMeasure: number | null;
    score: number | null;
  } | null {
    if (!this._sequencing?.activityTree) {
      return null;
    }

    const activity = this._sequencing.activityTree.getActivity(activityId);
    if (!activity) {
      return null;
    }

    return {
      completionStatus: activity.completionStatus || "unknown",
      successStatus: activity.successStatus || "unknown",
      progressMeasure: activity.progressMeasure ?? null,
      score: activity.objectiveMeasureStatus ? activity.objectiveNormalizedMeasure : null,
    };
  }

  /**
   * Save current sequencing state to persistent storage
   * @param {Partial<SequencingStateMetadata>} metadata
   * @return {Promise<boolean>}
   */
  public async saveSequencingState(metadata?: Partial<SequencingStateMetadata>): Promise<boolean> {
    if (this._statePersistence) {
      return this._statePersistence.saveSequencingState(metadata);
    }

    if (!this.settings.sequencingStatePersistence) {
      this.apiLog(
        "saveSequencingState",
        "No persistence configuration provided",
        LogLevelEnum.WARN,
      );
      return false;
    }

    // Fallback: create persistence on the fly
    const persistenceContext: PersistenceContext = {
      settings: this.settings,
      apiLog: this.apiLog.bind(this),
      adl: this.adl,
      sequencing: this._sequencing,
      sequencingService: this._sequencingService,
      learnerId: this.cmi.learner_id,
    };
    const persistence = new SequencingStatePersistence(
      persistenceContext,
      this._globalObjectiveManager,
    );
    return persistence.saveSequencingState(metadata);
  }

  /**
   * Load sequencing state from persistent storage
   * @param {Partial<SequencingStateMetadata>} metadata
   * @return {Promise<boolean>}
   */
  public async loadSequencingState(metadata?: Partial<SequencingStateMetadata>): Promise<boolean> {
    if (this._statePersistence) {
      return this._statePersistence.loadSequencingState(metadata);
    }

    if (!this.settings.sequencingStatePersistence) {
      this.apiLog(
        "loadSequencingState",
        "No persistence configuration provided",
        LogLevelEnum.WARN,
      );
      return false;
    }

    // Fallback: create persistence on the fly
    const persistenceContext: PersistenceContext = {
      settings: this.settings,
      apiLog: this.apiLog.bind(this),
      adl: this.adl,
      sequencing: this._sequencing,
      sequencingService: this._sequencingService,
      learnerId: this.cmi.learner_id,
    };
    const persistence = new SequencingStatePersistence(
      persistenceContext,
      this._globalObjectiveManager,
    );
    return persistence.loadSequencingState(metadata);
  }

  /**
   * Serialize current sequencing state to JSON string
   * @return {string} Serialized state
   */
  public serializeSequencingState(): string {
    if (this._statePersistence) {
      return this._statePersistence.serializeSequencingState();
    }

    // Fallback: create persistence on the fly
    const persistenceContext: PersistenceContext = {
      settings: this.settings,
      apiLog: this.apiLog.bind(this),
      adl: this.adl,
      sequencing: this._sequencing,
      sequencingService: this._sequencingService,
      learnerId: this.cmi.learner_id,
    };
    const persistence = new SequencingStatePersistence(
      persistenceContext,
      this._globalObjectiveManager,
    );
    return persistence.serializeSequencingState();
  }

  /**
   * Deserialize sequencing state from JSON string
   * @param {string} stateData - Serialized state data
   * @return {boolean} Success status
   */
  public deserializeSequencingState(stateData: string): boolean {
    if (this._statePersistence) {
      return this._statePersistence.deserializeSequencingState(stateData);
    }

    // Fallback: create persistence on the fly
    const persistenceContext: PersistenceContext = {
      settings: this.settings,
      apiLog: this.apiLog.bind(this),
      adl: this.adl,
      sequencing: this._sequencing,
      sequencingService: this._sequencingService,
      learnerId: this.cmi.learner_id,
    };
    const persistence = new SequencingStatePersistence(
      persistenceContext,
      this._globalObjectiveManager,
    );
    return persistence.deserializeSequencingState(stateData);
  }

  /**
   * Determines the appropriate cmi.entry value based on previous exit state.
   * @param {string} previousExit
   * @param {boolean} hasSuspendData
   * @return {string}
   */
  public determineEntryValue(previousExit: string, hasSuspendData: boolean): string {
    return this._dataSerializer.determineEntryValue(previousExit, hasSuspendData);
  }
}

export default Scorm2004API;
