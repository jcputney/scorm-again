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
import { ADL, ADLDataObject } from "./cmi/scorm2004/adl";
import {
  CommitObject,
  GlobalObjectiveMapEntry,
  ResultObject,
  ScoreObject,
  SequencingStateMetadata,
  Settings,
} from "./types/api_types";
import {
  ActivitySettings,
  AuxiliaryResource,
  AuxiliaryResourceSettings,
  HIDE_LMS_UI_TOKENS,
  HideLmsUiItem,
  ObjectiveSettings,
  RollupConditionSettings,
  RollupRuleSettings,
  RollupRulesSettings,
  RuleConditionSettings,
  SelectionRandomizationStateSettings,
  SequencingCollectionSettings,
  SequencingControlsSettings,
  SequencingEventListeners,
  SequencingRuleSettings,
  SequencingRulesSettings,
  SequencingSettings,
} from "./types/sequencing_types";
import { SequencingControls } from "./cmi/scorm2004/sequencing/sequencing_controls";
import {
  RuleCondition,
  SequencingRule,
  SequencingRules,
} from "./cmi/scorm2004/sequencing/sequencing_rules";
import { RollupCondition, RollupRule, RollupRules } from "./cmi/scorm2004/sequencing/rollup_rules";
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
import { CompletionStatus, LogLevelEnum, SuccessStatus } from "./constants/enums";
import { Sequencing } from "./cmi/scorm2004/sequencing/sequencing";
import { Activity, ActivityObjective, ObjectiveMapInfo } from "./cmi/scorm2004/sequencing/activity";
import { OverallSequencingProcess } from "./cmi/scorm2004/sequencing/overall_sequencing_process";
import { SequencingConfiguration, SequencingService } from "./services/SequencingService";
import { IHttpService } from "./interfaces/services";

/**
 * API class for SCORM 2004
 */
class Scorm2004API extends BaseAPI {
  private _version: string = "1.0";
  private _globalObjectives: CMIObjectivesObject[] = [];
  private readonly _sequencing: Sequencing;
  private _sequencingService: SequencingService | null = null;
  private _extractedScoItemIds: string[] = [];
  private _sequencingCollections: Record<string, SequencingCollectionSettings> = {};

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
    // The Sequencing object is used for both configuration and runtime navigation processing
    // It needs to be attached to the ADL object for runtime navigation requests (adl.nav.request)
    this.adl.sequencing = this._sequencing;

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
   * This method is designed for transitioning between SCOs in a sequenced course.
   * When called, it resets SCO-specific data while preserving global objectives.
   *
   * What gets reset:
   * - SCO-specific CMI data (location, entry, session time, interactions, score)
   * - Sequencing state (activity tree, current activity, etc.)
   * - ADL navigation state
   *
   * What is preserved:
   * - Global objectives (_globalObjectives array) - these persist across SCO transitions
   *   to allow activities to share objective data via mapInfo
   *
   * According to SCORM 2004 Sequencing and Navigation (SN) Book:
   * - Content Delivery Environment Process (DB.2) requires API reset between SCOs
   * - Global objectives must persist to support cross-activity objective tracking
   * - SCO-specific objectives in cmi.objectives are reset (via objectives.reset(false))
   *   but the array structure is maintained
   *
   * @param {Settings} settings - Optional new settings to merge with existing settings
   */
  reset(settings?: Settings) {
    this.commonReset(settings);

    this.cmi?.reset();
    this.adl?.reset();

    // IMPORTANT: Do not reset sequencing state when running as the LMS.
    // The sequencing service owns the activity tree and global objective
    // mappings for the entire attempt. Resetting it here would erase the learner's
    // position and make navigation requests fail (since currentActivity becomes null).
    //
    // If a full sequencing reset is needed (e.g., for tests), call resetSequencingState().
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
   *
   * Global objectives persist across SCO transitions and are used for cross-activity
   * objective tracking via mapInfo (SCORM 2004 SN Book SB.2.4).
   *
   * These objectives are NOT reset when reset() is called, allowing activities
   * to share objective data across SCO boundaries.
   *
   * @return {CMIObjectivesObject[]} Array of global objective objects
   */
  get globalObjectives(): CMIObjectivesObject[] {
    return this._globalObjectives;
  }

  /**
   * Initialize - Begins a communication session with the LMS
   *
   * Per SCORM 2004 RTE Section 3.1.2.1:
   * - Parameter must be empty string ("")
   * - Returns "true" on success, "false" on failure
   * - Sets error 103 if already initialized
   * - Sets error 104 if already terminated
   * - Sets error 101 if parameter is not an empty string
   * - Initializes the CMI data model for the current attempt
   *
   * @param {string} parameter - Must be an empty string per SCORM 2004 specification
   * @return {string} "true" or "false"
   */
  lmsInitialize(parameter: string = ""): string {
    // SCORM 2004 RTE 3.1.2.1: Parameter must be an empty string
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

    // Initialize sequencing service after successful API initialization
    if (result === global_constants.SCORM_TRUE && this._sequencingService) {
      this._sequencingService.initialize();
    }

    // Auto-load sequencing state after successful initialization if configured
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
   * Per SCORM 2004 RTE Section 3.1.2.2:
   * - Parameter must be empty string ("")
   * - Returns "true" on success, "false" on failure
   * - Commits all data to persistent storage
   * - Sets error 112 if not initialized
   * - Sets error 113 if already terminated
   * - Sets error 101 if parameter is not an empty string
   * - Processes navigation requests set via adl.nav.request
   *
   * @param {string} parameter - Must be an empty string per SCORM 2004 specification
   * @return {string} "true" or "false"
   */
  lmsFinish(parameter: string = ""): string {
    // SCORM 2004 RTE 3.1.2.2: Parameter must be an empty string
    if (parameter !== "") {
      this.throwSCORMError("api", this._error_codes.ARGUMENT_ERROR);
      return global_constants.SCORM_FALSE;
    }

    const pendingNavRequest = this.adl?.nav?.request || "_none_";

    // Capture the cmi.exit value before termination for sequencing
    // Note: cmi.exit is write-only, so we use the internal getter method
    const exitType = this.cmi?.getExitValueInternal() || "";

    // Check if we were already terminated before calling terminate
    // This handles the case where a SCO's unload handler calls Terminate after
    // we've already moved on to delivering a new activity
    const wasAlreadyTerminated = this.isTerminated();

    // Check if content delivery is in progress
    // This handles the case where the old content's unload handler fires during
    // delivery of a new activity and calls Terminate
    const deliveryInProgress = this._sequencingService?.isDeliveryInProgress() ?? false;

    const result = this.terminate("Terminate", true);

    // Only process navigation if this was a legitimate first termination
    // AND delivery is not already in progress
    // Skip navigation processing for duplicate terminations or during delivery
    // to avoid re-terminating the newly delivered activity
    if (result === global_constants.SCORM_TRUE && !wasAlreadyTerminated && !deliveryInProgress) {
      // Handle navigation requests - first try sequencing service, then fall back to legacy
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
            // No explicit navigation request, but the SCO terminated.
            // Issue an "exit" so the sequencing session records the end of the attempt.
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
          // Fall back to legacy navigation handling if sequencing fails
          navigationHandled = false;
        }
      }

      // Legacy navigation handling (fallback)
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

      // Reset nav request state
      this.adl.nav.request = "_none_";
    }

    return result;
  }

  /**
   * GetValue - Retrieves a value from the CMI data model
   *
   * Per SCORM 2004 RTE Section 3.1.2.3:
   * - Returns the value of the specified CMI element
   * - Returns empty string if element has no value
   * - Sets error 122 if not initialized
   * - Sets error 123 if already terminated
   * - Sets error 401 if element is not implemented (invalid element)
   * - Sets error 405 if element is write-only
   * - Sets error 403 if element is not readable
   *
   * @param {string} CMIElement - The CMI element path (e.g., "cmi.completion_status")
   * @return {string} The value of the element, or empty string
   */
  lmsGetValue(CMIElement: string): string {
    // Per SCORM 2004 3rd Edition: adl.nav.request is write-only
    // GetValue must return "" and set error 405 (WRITE_ONLY_ELEMENT)
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
          // If sequencing is available with navigation look-ahead, use dynamic evaluation
          const overallProcess = this._sequencing?.overallSequencingProcess;

          if (this.settings.scoItemIdValidator) {
            return String(this.settings.scoItemIdValidator(target));
          }

          if (overallProcess?.predictChoiceEnabled && request === "choice") {
            // Use dynamic sequencing evaluation
            return overallProcess.predictChoiceEnabled(target) ? "true" : "false";
          } else if (overallProcess?.predictJumpEnabled && request === "jump") {
            // Use dynamic sequencing evaluation for jump
            return overallProcess.predictJumpEnabled(target) ? "true" : "false";
          } else {
            // If we have extracted IDs from sequencing, use those exclusively
            if (this._extractedScoItemIds.length > 0) {
              return String(this._extractedScoItemIds.includes(target));
            }
            // Otherwise use the scoItemIds from settings
            return String(this.settings?.scoItemIds?.includes(target));
          }
        }
      }
    }

    // Check termination and initialization state first (must happen before any value retrieval)
    // This ensures proper error codes are set for invalid API state.
    // Check termination FIRST because after termination, isInitialized() returns false
    // (state is TERMINATED, not INITIALIZED), which would incorrectly trigger RETRIEVE_BEFORE_INIT
    if (this.isTerminated()) {
      this.lastErrorCode = String(scorm2004_errors.RETRIEVE_AFTER_TERM);
      return "";
    }
    if (!this.isInitialized()) {
      this.lastErrorCode = String(scorm2004_errors.RETRIEVE_BEFORE_INIT);
      return "";
    }

    // Per SCORM 2004 RTE Table 4.2.4.1a: Automatic evaluation of completion_status
    // When completion_threshold is defined, completion_status is evaluated dynamically
    // based on progress_measure, not just the stored value.
    if (CMIElement === "cmi.completion_status") {
      return this.evaluateCompletionStatus();
    }

    // Per SCORM 2004 RTE Table 4.2.21.1a: Automatic evaluation of success_status
    // When scaled_passing_score is defined, success_status is evaluated dynamically
    // based on score.scaled, not just the stored value.
    if (CMIElement === "cmi.success_status") {
      return this.evaluateSuccessStatus();
    }

    return this.getValue("GetValue", true, CMIElement);
  }

  /**
   * Evaluates completion_status per SCORM 2004 RTE Table 4.2.4.1a
   *
   * Rules:
   * 1. If completion_threshold is defined AND progress_measure is set:
   *    - Return "completed" if progress_measure >= completion_threshold
   *    - Return "incomplete" if progress_measure < completion_threshold
   * 2. If completion_threshold is defined but progress_measure is NOT set:
   *    - Return "unknown"
   * 3. Otherwise:
   *    - Return the SCO-set value (or "unknown" if not set)
   *
   * @returns {string} The evaluated completion status
   */
  private evaluateCompletionStatus(): string {
    const threshold = this.cmi.completion_threshold;
    const progressMeasure = this.cmi.progress_measure;
    const storedStatus = this.cmi.completion_status;

    // If completion_threshold is defined
    if (threshold !== "" && threshold !== null && threshold !== undefined) {
      const thresholdValue = parseFloat(String(threshold));

      if (!isNaN(thresholdValue)) {
        // Check if progress_measure is set
        if (progressMeasure !== "" && progressMeasure !== null && progressMeasure !== undefined) {
          const progressValue = parseFloat(String(progressMeasure));

          if (!isNaN(progressValue)) {
            // Evaluate based on threshold comparison
            return progressValue >= thresholdValue
              ? CompletionStatus.COMPLETED
              : CompletionStatus.INCOMPLETE;
          }
        }

        // completion_threshold is defined but progress_measure is not set
        return CompletionStatus.UNKNOWN;
      }
    }

    // No completion_threshold defined - return stored value
    return storedStatus || CompletionStatus.UNKNOWN;
  }

  /**
   * Evaluates success_status per SCORM 2004 RTE Table 4.2.21.1a
   *
   * Rules:
   * 1. If scaled_passing_score is defined AND score.scaled is set:
   *    - Return "passed" if score.scaled >= scaled_passing_score
   *    - Return "failed" if score.scaled < scaled_passing_score
   * 2. If scaled_passing_score is defined but score.scaled is NOT set:
   *    - Return "unknown"
   * 3. Otherwise:
   *    - Return the SCO-set value (or "unknown" if not set)
   *
   * @returns {string} The evaluated success status
   */
  private evaluateSuccessStatus(): string {
    const scaledPassingScore = this.cmi.scaled_passing_score;
    const scaledScore = this.cmi.score.scaled;
    const storedStatus = this.cmi.success_status;

    // If scaled_passing_score is defined
    if (
      scaledPassingScore !== "" &&
      scaledPassingScore !== null &&
      scaledPassingScore !== undefined
    ) {
      const passingScoreValue = parseFloat(String(scaledPassingScore));

      if (!isNaN(passingScoreValue)) {
        // Check if score.scaled is set
        if (scaledScore !== "" && scaledScore !== null && scaledScore !== undefined) {
          const scoreValue = parseFloat(String(scaledScore));

          if (!isNaN(scoreValue)) {
            // Evaluate based on threshold comparison
            return scoreValue >= passingScoreValue ? "passed" : "failed";
          }
        }

        // scaled_passing_score is defined but score.scaled is not set
        return "unknown";
      }
    }

    // No scaled_passing_score defined - return stored value
    return storedStatus || "unknown";
  }

  /**
   * SetValue - Sets a value in the CMI data model
   *
   * Per SCORM 2004 RTE Section 3.1.2.4:
   * - Sets the value of the specified CMI element
   * - Returns "true" on success, "false" on failure
   * - Sets error 132 if not initialized
   * - Sets error 133 if already terminated
   * - Sets error 401 if element is not implemented (invalid element)
   * - Sets error 403 if element is read-only
   * - Sets error 406 if incorrect data type
   * - Sets error 407 if element is a keyword and value is not valid
   * - Triggers autocommit if enabled
   *
   * @param {string} CMIElement - The CMI element path (e.g., "cmi.completion_status")
   * @param {any} value - The value to set
   * @return {string} "true" or "false"
   */
  lmsSetValue(CMIElement: string, value: any): string {
    // Get old value for change detection with error handling
    let oldValue: any = null;
    try {
      oldValue = this.getCMIValue(CMIElement);
    } catch (error) {
      // If getting the old value fails, proceed without change detection
      // This prevents errors during normal operation when CMI elements don't exist yet
      oldValue = null;
    }

    // Proceed with regular setting for non-objective elements or fallback behavior
    const result = this.setValue("SetValue", "Commit", true, CMIElement, value);

    // If successful and sequencing service is available, trigger rollup on critical CMI changes
    if (result === global_constants.SCORM_TRUE && this._sequencingService) {
      try {
        this._sequencingService.triggerRollupOnCMIChange(CMIElement, oldValue, value);
      } catch (rollupError) {
        // Log rollup error but don't fail the SetValue operation
        console.warn(`Sequencing rollup failed for ${CMIElement}: ${rollupError}`);
      }
    }

    // Auto-save sequencing state on critical CMI changes if configured
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
   * Per SCORM 2004 RTE Section 3.1.2.5:
   * - Parameter must be empty string ("")
   * - Requests persistence of all data set since last successful commit
   * - Returns "true" on success, "false" on failure
   * - Sets error 142 if not initialized
   * - Sets error 143 if already terminated
   * - Sets error 101 if parameter is not an empty string
   * - Sets error 391 if commit failed
   * - Does not terminate the communication session
   *
   * @param {string} parameter - Must be an empty string per SCORM 2004 specification
   * @return {string} "true" or "false"
   */
  lmsCommit(parameter: string = ""): string {
    // SCORM 2004 RTE 3.1.2.5: Parameter must be an empty string
    if (parameter !== "") {
      this.throwSCORMError("api", this._error_codes.ARGUMENT_ERROR);
      return global_constants.SCORM_FALSE;
    }

    if (this.settings.throttleCommits) {
      this.scheduleCommit(500, "Commit");
      return global_constants.SCORM_TRUE;
    } else {
      // Pass true to check for terminated state - error 143 per SCORM 2004 RTE 3.1.2.5
      const result = this.commit("Commit", true);

      // Auto-save sequencing state after successful commit if configured (async in background)
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
   *
   * Per SCORM 2004 RTE Section 3.1.2.6:
   * - Returns the error code that resulted from the last API call
   * - Returns "0" if no error occurred
   * - Can be called at any time (even before Initialize)
   * - Does not change the current error state
   * - Should be called after each API call to check for errors
   *
   * @return {string} Error code as a string (e.g., "0", "103", "401")
   */
  lmsGetLastError(): string {
    return this.getLastError("GetLastError");
  }

  /**
   * GetErrorString - Returns a short description for an error code
   *
   * Per SCORM 2004 RTE Section 3.1.2.7:
   * - Returns a textual description for the specified error code
   * - Returns empty string if error code is not recognized
   * - Can be called at any time (even before Initialize)
   * - Does not change the current error state
   * - Used to provide user-friendly error messages
   *
   * @param {string|number} CMIErrorCode - The error code to get the description for
   * @return {string} Short error description
   */
  lmsGetErrorString(CMIErrorCode: string | number): string {
    return this.getErrorString("GetErrorString", CMIErrorCode);
  }

  /**
   * GetDiagnostic - Returns detailed diagnostic information for an error
   *
   * Per SCORM 2004 RTE Section 3.1.2.8:
   * - Returns detailed diagnostic information for the specified error code
   * - Implementation-specific; can include additional context or debugging info
   * - Returns empty string if no diagnostic information is available
   * - Can be called at any time (even before Initialize)
   * - Does not change the current error state
   * - Used for debugging and troubleshooting
   *
   * @param {string|number} CMIErrorCode - The error code to get diagnostic information for
   * @return {string} Detailed diagnostic information
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
      // Global objectives are identified via settings.globalObjectiveIds
      // These objectives persist across SCO transitions (SCORM 2004 SN Book SB.2.4)
      const is_global = objective_id && this.settings.globalObjectiveIds?.includes(objective_id);

      if (is_global) {
        // Locate or create an entry in _globalObjectives for the global objective
        // This array persists across reset() calls, allowing cross-activity tracking
        let global_index = this._globalObjectives.findIndex((obj) => obj.id === objective_id);

        if (global_index === -1) {
          global_index = this._globalObjectives.length;
          const newGlobalObjective = new CMIObjectivesObject();
          newGlobalObjective.id = objective_id;
          this._globalObjectives.push(newGlobalObjective);
        }

        // Update the global objective in the persistent storage
        const global_element = CMIElement.replace(
          element_base,
          `_globalObjectives.${global_index}`,
        );
        this._commonSetCMIValue("SetGlobalObjectiveValue", true, global_element, value);

        // Synchronize with sequencing service global objective map
        // This ensures sequencing rules can evaluate the objective status
        const updatedObjective = this._globalObjectives[global_index];
        if (objective_id && updatedObjective) {
          this.updateGlobalObjectiveFromCMI(objective_id, updatedObjective);
        }
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
      // Note: SCORM 2004 4th Edition adl.data extension
      // Per strict spec, adl.data elements should be LMS-created and
      // SCOs should only access indices < _count. However, we intentionally
      // allow dynamic creation for backward compatibility with content that
      // creates adl.data elements on-the-fly.
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
    const interaction = this.cmi.interactions.childArray[index] as
      | CMIInteractionsObject
      | undefined;

    if (this.isInitialized()) {
      if (typeof interaction === "undefined" || !interaction.type) {
        this.throwSCORMError(CMIElement, scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED, CMIElement);
        return null;
      } else {
        const interaction_count = interaction.correct_responses._count;
        const response_type = CorrectResponses[interaction.type];

        // Check if limit is exceeded
        if (
          response_type &&
          typeof response_type.limit !== "undefined" &&
          interaction_count >= response_type.limit
        ) {
          this.throwSCORMError(
            CMIElement,
            scorm2004_errors.GENERAL_SET_FAILURE,
            `Data Model Element Collection Limit Reached: ${CMIElement}`,
          );
          return null;
        }

        this.checkDuplicateChoiceResponse(CMIElement, interaction, value);
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
      return new CMIInteractionsCorrectResponsesObject(interaction?.type);
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
        const response = interaction.correct_responses.childArray[i] as
          | CMIInteractionsCorrectResponsesObject
          | undefined;
        if (response?.pattern === value) {
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
    const interaction = this.cmi.interactions.childArray[index] as
      | CMIInteractionsObject
      | undefined;

    if (!interaction) {
      this.throwSCORMError(CMIElement, scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED, CMIElement);
      return;
    }

    const interaction_count = interaction.correct_responses._count;
    this.checkDuplicateChoiceResponse(CMIElement, interaction, value);

    const response_type = CorrectResponses[interaction.type];
    if (
      response_type &&
      (typeof response_type.limit === "undefined" || interaction_count < response_type.limit)
    ) {
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
    const errorDescription = scorm2004_constants.error_descriptions[errorNumber];
    if (errorDescription) {
      basicMessage = errorDescription.basicMessage;
      detailMessage = errorDescription.detailMessage;
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
      if (i !== current_index) {
        const existingPattern = correct_response.childArray[i]?.pattern;
        if (existingPattern === value) {
          found = true;
        }
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
      node = node.substring(matches[1]?.length || 0);
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
   * Render the cmi object to the proper format for LMS commit - delegates to DataSerializationModule
   *
   * @param {boolean} terminateCommit - Whether this is a termination commit
   * @param {boolean} includeTotalTime - Whether to include total time in the commit data
   * @return {object|Array}
   */
  renderCommitCMI(
    terminateCommit: boolean,
    includeTotalTime: boolean = false,
  ): StringKeyMap | Array<any> {
    const cmiExport: StringKeyMap = this.renderCMIToJSONObject();

    if (terminateCommit || includeTotalTime) {
      // Add total_time to the exported cmi object
      (cmiExport.cmi as StringKeyMap).total_time = this.cmi.getCurrentTotalTime();
    } else {
      // Remove total_time from export when not terminating
      delete (cmiExport.cmi as StringKeyMap).total_time;
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
   * @param {boolean} terminateCommit - Whether this is a termination commit
   * @param {boolean} includeTotalTime - Whether to include total time in the commit data
   * @return {CommitObject}
   */
  renderCommitObject(terminateCommit: boolean, includeTotalTime: boolean = false): CommitObject {
    const cmiExport = this.renderCommitCMI(terminateCommit, includeTotalTime);
    const calculateTotalTime = terminateCommit || includeTotalTime;
    const totalTimeDuration = calculateTotalTime ? this.cmi.getCurrentTotalTime() : "";
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

    const scoreObject: ScoreObject = this.cmi?.score?.getScoreObject() || {};
    const commitObject: CommitObject = {
      completionStatus: completionStatus,
      successStatus: successStatus,
      totalTimeSeconds: totalTimeSeconds,
      runtimeData: cmiExport as StringKeyMap,
    };
    if (scoreObject) {
      commitObject.score = scoreObject;
    }

    // Populate metadata if enabled
    if (this.settings.autoPopulateCommitMetadata) {
      if (this.settings.courseId) {
        commitObject.courseId = this.settings.courseId;
      }
      if (this.settings.scoId) {
        commitObject.scoId = this.settings.scoId;
      }
      if (this.cmi.learner_id) {
        commitObject.learnerId = this.cmi.learner_id;
      }
      if (this.cmi.learner_name) {
        commitObject.learnerName = this.cmi.learner_name;
      }
      // For SCORM 2004, also populate activityId if available from sequencing
      const sequencingState = this._sequencingService?.getSequencingState();
      if (sequencingState?.currentActivity?.id) {
        commitObject.activityId = sequencingState.currentActivity.id;
      }
    }

    // Update sequencing activity state based on CMI runtime data
    // This ensures that cmi.success_status updates the primary objective,
    // which then triggers mapInfo global objective writes during rollup
    this.syncCmiToSequencingActivity(completionStatus, successStatus, scoreObject);

    return commitObject;
  }

  /**
   * Synchronize CMI runtime data to the current sequencing activity
   * When cmi.success_status or cmi.completion_status are set, update the
   * current activity's primary objective accordingly
   *
   * @param {CompletionStatus} completionStatus
   * @param {SuccessStatus} successStatus
   * @param {ScoreObject} scoreObject
   * @private
   */
  private syncCmiToSequencingActivity(
    completionStatus: CompletionStatus,
    successStatus: SuccessStatus,
    scoreObject?: ScoreObject,
  ): void {
    if (!this._sequencing) {
      return;
    }

    const currentActivity = this._sequencing.getCurrentActivity();
    if (!currentActivity || !currentActivity.primaryObjective) {
      return;
    }

    const primaryObjective = currentActivity.primaryObjective;

    // Update primary objective satisfied status based on cmi.success_status
    if (successStatus !== SuccessStatus.UNKNOWN) {
      primaryObjective.satisfiedStatus = successStatus === SuccessStatus.PASSED;
      primaryObjective.measureStatus = true;
      currentActivity.objectiveMeasureStatus = true;
      currentActivity.objectiveSatisfiedStatus = successStatus === SuccessStatus.PASSED;
    }

    // Update primary objective completion status based on cmi.completion_status
    if (completionStatus !== CompletionStatus.UNKNOWN) {
      primaryObjective.completionStatus = completionStatus;
    }

    // Update normalized measure if score is provided
    if (scoreObject?.scaled !== undefined && scoreObject.scaled !== null) {
      primaryObjective.normalizedMeasure = scoreObject.scaled;
      primaryObjective.measureStatus = true;
    }
  }

  /**
   * Attempts to store the data to the LMS - delegates to DataSerializationModule
   *
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
    this.syncCmiToSequencingActivity(completionStatusEnum, successStatusEnum, scoreObject);
    if (typeof this.settings.lmsCommitUrl === "string") {
      const result = this.processHttpRequest(
        this.settings.lmsCommitUrl,
        commitObject,
        terminateCommit,
      );

      // Check if this is a sequencing call, and then process the navigation request securely
      if (
        navRequest &&
        result.navRequest !== undefined &&
        result.navRequest !== "" &&
        typeof result.navRequest === "string"
      ) {
        // Parse the navigation request using whitelist-based validation
        const parsed: ParsedNavigationRequest = parseNavigationRequest(result.navRequest);

        if (!parsed.valid) {
          // Log warning for invalid navigation requests (potential injection attempts)
          this.apiLog(
            "storeData",
            `Invalid navigation request from LMS: ${parsed.error}`,
            LogLevelEnum.WARN,
          );
        } else {
          // Dispatch valid navigation command via event system
          // Map SCORM 2004 navigation commands to event names
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
        // Support object-based custom event format (safe alternative)
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
   * @param {SequencingSettings} sequencingSettings - The sequencing settings
   */
  private configureSequencing(sequencingSettings: SequencingSettings): void {
    this._sequencingCollections = this.sanitizeSequencingCollections(
      sequencingSettings.collections,
    );

    // Configure activity tree
    if (sequencingSettings.activityTree) {
      this.configureActivityTree(sequencingSettings.activityTree);
    }

    // Configure sequencing rules
    if (sequencingSettings.sequencingRules) {
      this.configureSequencingRules(sequencingSettings.sequencingRules);
    }

    // Configure sequencing controls
    if (sequencingSettings.sequencingControls) {
      this.configureSequencingControls(sequencingSettings.sequencingControls);
    }

    // Configure rollup rules
    if (sequencingSettings.rollupRules) {
      this.configureRollupRules(sequencingSettings.rollupRules);
    }

    if (sequencingSettings.hideLmsUi) {
      this._sequencing.hideLmsUi = this.sanitizeHideLmsUi(sequencingSettings.hideLmsUi);
    } else {
      this._sequencing.hideLmsUi = [];
    }

    if (sequencingSettings.auxiliaryResources) {
      this._sequencing.auxiliaryResources = this.sanitizeAuxiliaryResources(
        sequencingSettings.auxiliaryResources,
      );
    } else {
      this._sequencing.auxiliaryResources = [];
    }
  }

  /**
   * Configure activity tree based on provided settings
   * @param {ActivitySettings} activityTreeSettings - The activity tree settings
   */
  private configureActivityTree(activityTreeSettings: ActivitySettings): void {
    // Create root activity
    const rootActivity = this.createActivity(activityTreeSettings);

    // Create activity tree
    const activityTree = this._sequencing.activityTree;
    activityTree.root = rootActivity;

    // Extract activity IDs for use as scoItemIds
    this._extractedScoItemIds = this.extractActivityIds(rootActivity);
  }

  /**
   * Extract all activity IDs from an activity and its children
   * @param {Activity} activity - The activity to extract IDs from
   * @return {string[]} - Array of activity IDs
   */
  private extractActivityIds(activity: Activity): string[] {
    const ids = [activity.id];

    // Recursively extract IDs from children
    for (const child of activity.children) {
      ids.push(...this.extractActivityIds(child));
    }

    return ids;
  }

  /**
   * Create an activity from settings
   * @param {ActivitySettings} activitySettings - The activity settings
   * @return {Activity} - The created activity
   */
  private createActivity(activitySettings: ActivitySettings): Activity {
    // Create activity
    const activity = new Activity(activitySettings.id, activitySettings.title);

    const selectionStates: SelectionRandomizationStateSettings[] = [];
    const collectionRefs = this.normalizeCollectionRefs(activitySettings.sequencingCollectionRefs);

    for (const ref of collectionRefs) {
      const collection = this._sequencingCollections[ref];
      if (collection) {
        this.applySequencingCollection(activity, collection, selectionStates);
      }
    }

    // Set activity properties
    if (activitySettings.isVisible !== undefined) {
      activity.isVisible = activitySettings.isVisible;
    }
    if (activitySettings.isActive !== undefined) {
      activity.isActive = activitySettings.isActive;
    }
    if (activitySettings.isSuspended !== undefined) {
      activity.isSuspended = activitySettings.isSuspended;
    }
    if (activitySettings.isCompleted !== undefined) {
      activity.isCompleted = activitySettings.isCompleted;
    }
    if (activitySettings.isHiddenFromChoice !== undefined) {
      activity.isHiddenFromChoice = activitySettings.isHiddenFromChoice;
    }
    if (activitySettings.isAvailable !== undefined) {
      activity.isAvailable = activitySettings.isAvailable;
    }
    if (activitySettings.attemptLimit !== undefined) {
      activity.attemptLimit = activitySettings.attemptLimit;
    }
    if (activitySettings.attemptAbsoluteDurationLimit !== undefined) {
      activity.attemptAbsoluteDurationLimit = activitySettings.attemptAbsoluteDurationLimit;
    }
    if (activitySettings.activityAbsoluteDurationLimit !== undefined) {
      activity.activityAbsoluteDurationLimit = activitySettings.activityAbsoluteDurationLimit;
    }
    if (activitySettings.timeLimitAction !== undefined) {
      activity.timeLimitAction = activitySettings.timeLimitAction;
    }
    if (activitySettings.timeLimitDuration !== undefined) {
      activity.timeLimitDuration = activitySettings.timeLimitDuration;
    }
    if (activitySettings.beginTimeLimit !== undefined) {
      activity.beginTimeLimit = activitySettings.beginTimeLimit;
    }
    if (activitySettings.endTimeLimit !== undefined) {
      activity.endTimeLimit = activitySettings.endTimeLimit;
    }

    if (activitySettings.primaryObjective) {
      const primaryObjective = this.createActivityObjectiveFromSettings(
        activitySettings.primaryObjective,
        true,
      );
      activity.primaryObjective = primaryObjective;
      if (primaryObjective.minNormalizedMeasure !== null) {
        activity.scaledPassingScore = primaryObjective.minNormalizedMeasure;
      }
    }

    if (activitySettings.objectives) {
      for (const objectiveSettings of activitySettings.objectives) {
        const isPrimary = objectiveSettings.isPrimary === true;
        const objective = this.createActivityObjectiveFromSettings(objectiveSettings, isPrimary);
        if (isPrimary) {
          activity.primaryObjective = objective;
        } else {
          activity.addObjective(objective);
        }
      }
    }

    if (activitySettings.sequencingControls) {
      this.applySequencingControlsSettings(
        activity.sequencingControls,
        activitySettings.sequencingControls,
      );
    }

    if (activitySettings.sequencingRules) {
      this.applySequencingRulesSettings(activity.sequencingRules, activitySettings.sequencingRules);
    }

    if (activitySettings.rollupRules) {
      this.applyRollupRulesSettings(activity.rollupRules, activitySettings.rollupRules);
    }

    if (activitySettings.rollupConsiderations) {
      activity.applyRollupConsiderations(activitySettings.rollupConsiderations);
    }

    if (activitySettings.hideLmsUi) {
      const mergedHide = this.mergeHideLmsUi(activity.hideLmsUi, activitySettings.hideLmsUi);
      if (mergedHide.length > 0) {
        activity.hideLmsUi = mergedHide;
      }
    }

    if (activitySettings.auxiliaryResources) {
      const sanitizedAux = this.sanitizeAuxiliaryResources(activitySettings.auxiliaryResources);
      if (sanitizedAux.length > 0) {
        activity.auxiliaryResources = this.mergeAuxiliaryResources(
          activity.auxiliaryResources,
          sanitizedAux,
        );
      }
    }

    // Create child activities
    if (activitySettings.children) {
      for (const childSettings of activitySettings.children) {
        const childActivity = this.createActivity(childSettings);
        activity.addChild(childActivity);
      }
    }

    if (activitySettings.selectionRandomizationState) {
      selectionStates.push(
        this.cloneSelectionRandomizationState(activitySettings.selectionRandomizationState),
      );
    }

    for (const state of selectionStates) {
      this.applySelectionRandomizationState(activity, state);
    }

    return activity;
  }

  /**
   * Configure sequencing rules based on provided settings
   * @param {SequencingRulesSettings} sequencingRulesSettings - The sequencing rules settings
   */
  private configureSequencingRules(sequencingRulesSettings: SequencingRulesSettings): void {
    this.applySequencingRulesSettings(this._sequencing.sequencingRules, sequencingRulesSettings);
  }

  /**
   * Create a sequencing rule from settings
   * @param {SequencingRuleSettings} ruleSettings - The sequencing rule settings
   * @return {SequencingRule} - The created sequencing rule
   */
  private createSequencingRule(ruleSettings: SequencingRuleSettings): SequencingRule {
    // Create rule
    const rule = new SequencingRule(ruleSettings.action, ruleSettings.conditionCombination);

    // Add conditions
    for (const conditionSettings of ruleSettings.conditions) {
      const condition = new RuleCondition(
        conditionSettings.condition,
        conditionSettings.operator,
        new Map(Object.entries(conditionSettings.parameters || {})),
      );
      if (conditionSettings.referencedObjective) {
        condition.referencedObjective = conditionSettings.referencedObjective;
      }
      rule.addCondition(condition);
    }

    return rule;
  }

  /**
   * Configure sequencing controls based on provided settings
   * @param {SequencingControlsSettings} sequencingControlsSettings - The sequencing controls settings
   */
  private configureSequencingControls(
    sequencingControlsSettings: SequencingControlsSettings,
  ): void {
    this.applySequencingControlsSettings(
      this._sequencing.sequencingControls,
      sequencingControlsSettings,
    );
  }

  /**
   * Applies the selection randomization state to the given activity by updating its sequencing controls
   * and configuring visibility, availability, and order of its child elements.
   *
   * @param {Activity} activity - The activity to which the selection randomization state is applied.
   * @param {SelectionRandomizationStateSettings} state - The settings object defining the selection
   * randomization state, including properties for selection count status, child order, reorder controls,
   * selected child IDs, and hidden child IDs.
   * @return {void} This method does not return a value.
   */
  private applySelectionRandomizationState(
    activity: Activity,
    state: SelectionRandomizationStateSettings,
  ): void {
    const sequencingControls = activity.sequencingControls;

    if (state.selectionCountStatus !== undefined) {
      sequencingControls.selectionCountStatus = state.selectionCountStatus;
    }

    if (state.reorderChildren !== undefined) {
      sequencingControls.reorderChildren = state.reorderChildren;
    }

    const selectedSet = state.selectedChildIds ? new Set(state.selectedChildIds) : null;
    const hiddenSet = state.hiddenFromChoiceChildIds
      ? new Set(state.hiddenFromChoiceChildIds)
      : null;

    if (state.childOrder && state.childOrder.length > 0) {
      activity.setChildOrder(state.childOrder);
    }

    let selectionTouched = false;

    if (selectedSet || hiddenSet) {
      for (const child of activity.children) {
        if (selectedSet) {
          const isSelected = selectedSet.has(child.id);
          child.isAvailable = isSelected;
          if (!hiddenSet) {
            child.isHiddenFromChoice = !isSelected;
          }
          selectionTouched = true;
        }

        if (hiddenSet) {
          child.isHiddenFromChoice = hiddenSet.has(child.id);
          selectionTouched = true;
        }
      }
    }

    const shouldSetProcessedChildren =
      selectionTouched ||
      !!selectedSet ||
      state.selectionCountStatus !== undefined ||
      state.reorderChildren !== undefined ||
      (state.childOrder && state.childOrder.length > 0);

    if (shouldSetProcessedChildren) {
      activity.setProcessedChildren(activity.children.filter((child) => child.isAvailable));
    }
  }

  /**
   * Applies the given sequencing controls settings to the specified target.
   *
   * @param {SequencingControls} target - The target object where sequencing control settings will be applied.
   * @param {SequencingControlsSettings} settings - An object containing the sequencing control settings to be applied to the target.
   * @return {void} - No return value as the method modifies the target object directly.
   */
  private applySequencingControlsSettings(
    target: SequencingControls,
    settings: SequencingControlsSettings,
  ): void {
    if (settings.enabled !== undefined) {
      target.enabled = settings.enabled;
    }
    if (settings.choice !== undefined) {
      target.choice = settings.choice;
    }
    if (settings.choiceExit !== undefined) {
      target.choiceExit = settings.choiceExit;
    }
    if (settings.flow !== undefined) {
      target.flow = settings.flow;
    }
    if (settings.forwardOnly !== undefined) {
      target.forwardOnly = settings.forwardOnly;
    }
    if (settings.useCurrentAttemptObjectiveInfo !== undefined) {
      target.useCurrentAttemptObjectiveInfo = settings.useCurrentAttemptObjectiveInfo;
    }
    if (settings.useCurrentAttemptProgressInfo !== undefined) {
      target.useCurrentAttemptProgressInfo = settings.useCurrentAttemptProgressInfo;
    }
    if (settings.preventActivation !== undefined) {
      target.preventActivation = settings.preventActivation;
    }
    if (settings.constrainChoice !== undefined) {
      target.constrainChoice = settings.constrainChoice;
    }
    if (settings.stopForwardTraversal !== undefined) {
      target.stopForwardTraversal = settings.stopForwardTraversal;
    }
    if (settings.rollupObjectiveSatisfied !== undefined) {
      target.rollupObjectiveSatisfied = settings.rollupObjectiveSatisfied;
    }
    if (settings.rollupProgressCompletion !== undefined) {
      target.rollupProgressCompletion = settings.rollupProgressCompletion;
    }
    if (settings.objectiveMeasureWeight !== undefined) {
      target.objectiveMeasureWeight = settings.objectiveMeasureWeight;
    }
    if (settings.selectionTiming !== undefined) {
      target.selectionTiming = settings.selectionTiming;
    }
    if (settings.selectCount !== undefined) {
      target.selectCount = settings.selectCount;
    }
    if (settings.randomizeChildren !== undefined) {
      target.randomizeChildren = settings.randomizeChildren;
    }
    if (settings.randomizationTiming !== undefined) {
      target.randomizationTiming = settings.randomizationTiming;
    }
    if (settings.selectionCountStatus !== undefined) {
      target.selectionCountStatus = settings.selectionCountStatus;
    }
    if (settings.reorderChildren !== undefined) {
      target.reorderChildren = settings.reorderChildren;
    }
    if (settings.completionSetByContent !== undefined) {
      target.completionSetByContent = settings.completionSetByContent;
    }
    if (settings.objectiveSetByContent !== undefined) {
      target.objectiveSetByContent = settings.objectiveSetByContent;
    }
  }

  /**
   * Applies the sequencing rules settings to the specified target object.
   *
   * @param {SequencingRules} target The target object where the sequencing rules will be applied.
   * @param {SequencingRulesSettings} settings The settings object containing the sequencing rules to be applied. If null or undefined, no rules will be applied.
   * @return {void} This method does not return a value.
   */
  private applySequencingRulesSettings(
    target: SequencingRules,
    settings: SequencingRulesSettings,
  ): void {
    if (!settings) {
      return;
    }

    if (settings.preConditionRules) {
      for (const ruleSettings of settings.preConditionRules) {
        const rule = this.createSequencingRule(ruleSettings);
        target.addPreConditionRule(rule);
      }
    }

    if (settings.exitConditionRules) {
      for (const ruleSettings of settings.exitConditionRules) {
        const rule = this.createSequencingRule(ruleSettings);
        target.addExitConditionRule(rule);
      }
    }

    if (settings.postConditionRules) {
      for (const ruleSettings of settings.postConditionRules) {
        const rule = this.createSequencingRule(ruleSettings);
        target.addPostConditionRule(rule);
      }
    }
  }

  /**
   * Applies rollup rules settings to the specified target object.
   * This method processes the provided settings and adds the corresponding
   * rollup rules to the target.
   *
   * @param {RollupRules} target - The target object where rollup rules will be applied.
   * @param {RollupRulesSettings} settings - The settings containing the rollup rules to be applied.
   * @return {void} This method does not return a value.
   */
  private applyRollupRulesSettings(target: RollupRules, settings: RollupRulesSettings): void {
    if (!settings?.rules) {
      return;
    }

    for (const ruleSettings of settings.rules) {
      const rule = this.createRollupRule(ruleSettings);
      target.addRule(rule);
    }
  }

  /**
   * Clones the given SelectionRandomizationStateSettings object, creating a new object with identical properties.
   *
   * @param {SelectionRandomizationStateSettings} state - The SelectionRandomizationStateSettings object to be cloned.
   * @return {SelectionRandomizationStateSettings} A new instance of SelectionRandomizationStateSettings with the same properties as the input object.
   */
  private cloneSelectionRandomizationState(
    state: SelectionRandomizationStateSettings,
  ): SelectionRandomizationStateSettings {
    const clone: SelectionRandomizationStateSettings = {};
    if (state.childOrder) {
      clone.childOrder = [...state.childOrder];
    }
    if (state.selectedChildIds) {
      clone.selectedChildIds = [...state.selectedChildIds];
    }
    if (state.hiddenFromChoiceChildIds) {
      clone.hiddenFromChoiceChildIds = [...state.hiddenFromChoiceChildIds];
    }
    if (state.selectionCountStatus !== undefined) {
      clone.selectionCountStatus = state.selectionCountStatus;
    }
    if (state.reorderChildren !== undefined) {
      clone.reorderChildren = state.reorderChildren;
    }
    return clone;
  }

  /**
   * Merges the current array of HideLmsUiItem objects with an optional additional array,
   * and sanitizes the combined result.
   *
   * @param {HideLmsUiItem[]} current - The current array of HideLmsUiItem objects.
   * @param {HideLmsUiItem[]} [additional] - An optional array of additional HideLmsUiItem objects to merge.
   * @return {HideLmsUiItem[]} The sanitized merged array of HideLmsUiItem objects.
   */
  private mergeHideLmsUi(current: HideLmsUiItem[], additional?: HideLmsUiItem[]): HideLmsUiItem[] {
    if (!additional || additional.length === 0) {
      return current;
    }
    return this.sanitizeHideLmsUi([...current, ...additional]);
  }

  /**
   * Sanitizes and processes a collection of sequencing settings. This involves ensuring that
   * the IDs are trimmed and non-empty, cloning objects deeply to ensure immutability,
   * and sanitizing each subset of sequencing configurations.
   *
   * @param {Record<string, SequencingCollectionSettings>} [collections] -
   *        A record of sequencing collection settings where keys are collection IDs
   *        and values are the associated configuration to be sanitized.
   *
   * @return {Record<string, SequencingCollectionSettings>}
   *         A sanitized record of sequencing collection settings, with processed and
   *         cloned settings for immutability and validity.
   */
  private sanitizeSequencingCollections(
    collections?: Record<string, SequencingCollectionSettings>,
  ): Record<string, SequencingCollectionSettings> {
    if (!collections) {
      return {};
    }

    const sanitized: Record<string, SequencingCollectionSettings> = {};
    for (const [id, collection] of Object.entries(collections)) {
      const trimmedId = id.trim();
      if (!trimmedId) {
        continue;
      }

      const sanitizedCollection: SequencingCollectionSettings = {};

      if (collection.sequencingControls) {
        sanitizedCollection.sequencingControls = { ...collection.sequencingControls };
      }
      if (collection.sequencingRules) {
        const ruleClone = (rule: SequencingRuleSettings): SequencingRuleSettings => {
          const cloned: SequencingRuleSettings = {
            action: rule.action,
            conditions: rule.conditions.map((condition) => {
              const clonedCondition: RuleConditionSettings = {
                condition: condition.condition,
              };
              if (condition.operator !== undefined) {
                clonedCondition.operator = condition.operator;
              }
              if (condition.parameters) {
                clonedCondition.parameters = { ...condition.parameters };
              }
              if (condition.referencedObjective !== undefined) {
                clonedCondition.referencedObjective = condition.referencedObjective;
              }
              return clonedCondition;
            }),
          };
          if (rule.conditionCombination !== undefined) {
            cloned.conditionCombination = rule.conditionCombination;
          }
          return cloned;
        };

        sanitizedCollection.sequencingRules = {};
        if (collection.sequencingRules.preConditionRules) {
          sanitizedCollection.sequencingRules.preConditionRules =
            collection.sequencingRules.preConditionRules.map(ruleClone);
        }
        if (collection.sequencingRules.exitConditionRules) {
          sanitizedCollection.sequencingRules.exitConditionRules =
            collection.sequencingRules.exitConditionRules.map(ruleClone);
        }
        if (collection.sequencingRules.postConditionRules) {
          sanitizedCollection.sequencingRules.postConditionRules =
            collection.sequencingRules.postConditionRules.map(ruleClone);
        }
      }

      if (collection.rollupRules) {
        sanitizedCollection.rollupRules = {
          rules: collection.rollupRules.rules?.map((rule) => {
            const clonedRule: RollupRuleSettings = {
              action: rule.action,
              conditions: rule.conditions.map((condition) => {
                const clonedCondition: RollupConditionSettings = {
                  condition: condition.condition,
                };
                if (condition.parameters) {
                  clonedCondition.parameters = { ...condition.parameters };
                }
                return clonedCondition;
              }),
            };
            if (rule.consideration !== undefined) {
              clonedRule.consideration = rule.consideration;
            }
            if (rule.minimumCount !== undefined) {
              clonedRule.minimumCount = rule.minimumCount;
            }
            if (rule.minimumPercent !== undefined) {
              clonedRule.minimumPercent = rule.minimumPercent;
            }
            return clonedRule;
          }),
        };
      }

      if (collection.rollupConsiderations) {
        sanitizedCollection.rollupConsiderations = { ...collection.rollupConsiderations };
      }

      if (collection.selectionRandomizationState) {
        sanitizedCollection.selectionRandomizationState = this.cloneSelectionRandomizationState(
          collection.selectionRandomizationState,
        );
      }

      if (collection.hideLmsUi) {
        sanitizedCollection.hideLmsUi = this.sanitizeHideLmsUi(collection.hideLmsUi);
      }

      if (collection.auxiliaryResources) {
        sanitizedCollection.auxiliaryResources = this.sanitizeAuxiliaryResources(
          collection.auxiliaryResources,
        );
      }

      sanitized[trimmedId] = sanitizedCollection;
    }

    return sanitized;
  }

  /**
   * Normalizes the provided collection references into an array of unique, trimmed strings.
   * Removes duplicates and trims whitespace from each reference.
   *
   * @param {string | string[]} [refs] - A single reference string or an array of reference strings to be normalized.
   *                                      If not provided, defaults to an empty array.
   * @return {string[]} An array of unique and trimmed strings representing normalized collection references.
   */
  private normalizeCollectionRefs(refs?: string | string[]): string[] {
    if (!refs) {
      return [];
    }

    const raw = Array.isArray(refs) ? refs : [refs];
    const seen = new Set<string>();
    const result: string[] = [];

    for (const ref of raw) {
      const trimmed = ref.trim();
      if (!trimmed || seen.has(trimmed)) {
        continue;
      }
      seen.add(trimmed);
      result.push(trimmed);
    }

    return result;
  }

  /**
   * Applies the sequencing configuration from the given collection to the specified activity.
   *
   * @param {Activity} activity - The activity to which the sequencing collection settings will be applied.
   * @param {SequencingCollectionSettings} collection - The collection of sequencing settings to apply to the activity.
   * @param {SelectionRandomizationStateSettings[]} selectionStates - The list of selection randomization state objects, which may be modified during this process.
   * @return {void} This method does not return a value.
   */
  private applySequencingCollection(
    activity: Activity,
    collection: SequencingCollectionSettings,
    selectionStates: SelectionRandomizationStateSettings[],
  ): void {
    if (!collection) {
      return;
    }

    if (collection.sequencingControls) {
      this.applySequencingControlsSettings(
        activity.sequencingControls,
        collection.sequencingControls,
      );
    }

    if (collection.sequencingRules) {
      this.applySequencingRulesSettings(activity.sequencingRules, collection.sequencingRules);
    }

    if (collection.rollupRules) {
      this.applyRollupRulesSettings(activity.rollupRules, collection.rollupRules);
    }

    if (collection.rollupConsiderations) {
      activity.applyRollupConsiderations(collection.rollupConsiderations);
    }

    if (collection.hideLmsUi) {
      const merged = this.mergeHideLmsUi(activity.hideLmsUi, collection.hideLmsUi);
      if (merged.length > 0) {
        activity.hideLmsUi = merged;
      }
    }

    if (collection.auxiliaryResources) {
      const sanitizedAux = this.sanitizeAuxiliaryResources(collection.auxiliaryResources);
      if (sanitizedAux.length > 0) {
        activity.auxiliaryResources = this.mergeAuxiliaryResources(
          activity.auxiliaryResources,
          sanitizedAux,
        );
      }
    }

    if (collection.selectionRandomizationState) {
      selectionStates.push(
        this.cloneSelectionRandomizationState(collection.selectionRandomizationState),
      );
    }
  }

  /**
   * Sanitizes and filters the given auxiliary resources by removing duplicates,
   * trimming unnecessary whitespace, and ensuring valid data integrity.
   *
   * @param {AuxiliaryResourceSettings[]} [resources] - An optional array of auxiliary resource settings
   *     that include details such as resource ID and purpose.
   * @return {AuxiliaryResource[]} - A sanitized array of auxiliary resources, each containing
   *     valid resource IDs and purposes, with duplicates and invalid entries removed.
   */
  private sanitizeAuxiliaryResources(resources?: AuxiliaryResourceSettings[]): AuxiliaryResource[] {
    if (!resources) {
      return [];
    }

    const seen = new Set<string>();
    const sanitized: AuxiliaryResource[] = [];

    for (const resource of resources) {
      if (!resource) continue;

      // Type-safe null/undefined checks before calling trim()
      if (!resource.resourceId || typeof resource.resourceId !== "string") continue;
      if (!resource.purpose || typeof resource.purpose !== "string") continue;

      const resourceId = resource.resourceId.trim();
      const purpose = resource.purpose.trim();

      if (!resourceId || !purpose) continue;

      const key = `${resourceId}::${purpose}`;
      if (!seen.has(key)) {
        seen.add(key);
        sanitized.push({ resourceId, purpose });
      }
    }

    return sanitized;
  }

  /**
   * Merges two arrays of auxiliary resources, removing duplicates based on their resource identifiers.
   *
   * @param {AuxiliaryResource[] | undefined} existing - The existing array of auxiliary resources. This can be undefined.
   * @param {AuxiliaryResource[] | undefined} additions - The array of new auxiliary resources to add. This can be undefined.
   * @return {AuxiliaryResource[]} A new array containing unique auxiliary resources from both input arrays, filtered by their resource identifiers.
   */
  private mergeAuxiliaryResources(
    existing: AuxiliaryResource[] | undefined,
    additions: AuxiliaryResource[] | undefined,
  ): AuxiliaryResource[] {
    const merged: AuxiliaryResource[] = [];
    const seen = new Set<string>();

    for (const resource of [...(existing ?? []), ...(additions ?? [])]) {
      if (!resource) {
        continue;
      }
      const resourceId = resource.resourceId;
      if (!resourceId || seen.has(resourceId)) {
        continue;
      }
      seen.add(resourceId);
      merged.push({ resourceId, purpose: resource.purpose });
    }

    return merged;
  }

  /**
   * Filters and sanitizes a list of items by removing duplicates and ensuring
   * only valid items are included according to a predefined set of valid tokens.
   *
   * @param {HideLmsUiItem[] | undefined} items - The list of items to be sanitized.
   * Can be undefined, in which case an empty array is returned.
   * @return {HideLmsUiItem[]} The sanitized list of unique and valid items.
   */
  private sanitizeHideLmsUi(items: HideLmsUiItem[] | undefined): HideLmsUiItem[] {
    if (!items) {
      return [];
    }

    const valid = new Set(HIDE_LMS_UI_TOKENS);
    const seen = new Set<HideLmsUiItem>();
    const sanitized: HideLmsUiItem[] = [];

    for (const item of items) {
      if (valid.has(item) && !seen.has(item)) {
        seen.add(item);
        sanitized.push(item);
      }
    }

    return sanitized;
  }

  /**
   * Configure rollup rules based on provided settings
   * @param {RollupRulesSettings} rollupRulesSettings - The rollup rules settings
   */
  private configureRollupRules(rollupRulesSettings: RollupRulesSettings): void {
    this.applyRollupRulesSettings(this._sequencing.rollupRules, rollupRulesSettings);
  }

  /**
   * Create a rollup rule from settings
   * @param {RollupRuleSettings} ruleSettings - The rollup rule settings
   * @return {RollupRule} - The created rollup rule
   */
  private createRollupRule(ruleSettings: RollupRuleSettings): RollupRule {
    // Create rule
    const rule = new RollupRule(
      ruleSettings.action,
      ruleSettings.consideration,
      ruleSettings.minimumCount,
      ruleSettings.minimumPercent,
    );

    // Add conditions
    for (const conditionSettings of ruleSettings.conditions) {
      const condition = new RollupCondition(
        conditionSettings.condition,
        new Map(Object.entries(conditionSettings.parameters || {})),
      );
      rule.addCondition(condition);
    }

    return rule;
  }

  /**
   * Create an activity objective from settings
   * @param {ObjectiveSettings} objectiveSettings
   * @param {boolean} isPrimary
   * @return {ActivityObjective}
   */
  private createActivityObjectiveFromSettings(
    objectiveSettings: ObjectiveSettings,
    isPrimary: boolean,
  ): ActivityObjective {
    const mapInfo: ObjectiveMapInfo[] = (objectiveSettings.mapInfo || []).map((info) => ({
      targetObjectiveID: info.targetObjectiveID,
      readSatisfiedStatus: info.readSatisfiedStatus ?? false,
      readNormalizedMeasure: info.readNormalizedMeasure ?? false,
      writeSatisfiedStatus: info.writeSatisfiedStatus ?? false,
      writeNormalizedMeasure: info.writeNormalizedMeasure ?? false,
      readCompletionStatus: info.readCompletionStatus ?? false,
      writeCompletionStatus: info.writeCompletionStatus ?? false,
      readProgressMeasure: info.readProgressMeasure ?? false,
      writeProgressMeasure: info.writeProgressMeasure ?? false,
      readRawScore: info.readRawScore ?? false,
      writeRawScore: info.writeRawScore ?? false,
      readMinScore: info.readMinScore ?? false,
      writeMinScore: info.writeMinScore ?? false,
      readMaxScore: info.readMaxScore ?? false,
      writeMaxScore: info.writeMaxScore ?? false,
      updateAttemptData: info.updateAttemptData ?? false,
    }));

    return new ActivityObjective(objectiveSettings.objectiveID, {
      description: objectiveSettings.description ?? null,
      satisfiedByMeasure: objectiveSettings.satisfiedByMeasure ?? false,
      minNormalizedMeasure: objectiveSettings.minNormalizedMeasure ?? null,
      mapInfo,
      isPrimary,
    });
  }

  /**
   * Initialize the sequencing service
   * @param {Settings} settings - API settings that may include sequencing configuration
   */
  private initializeSequencingService(settings?: Settings): void {
    try {
      // Create sequencing configuration from settings
      const sequencingConfig: SequencingConfiguration = {
        autoRollupOnCMIChange: settings?.sequencing?.autoRollupOnCMIChange ?? true,
        autoProgressOnCompletion: settings?.sequencing?.autoProgressOnCompletion ?? false,
        validateNavigationRequests: settings?.sequencing?.validateNavigationRequests ?? true,
        enableEventSystem: settings?.sequencing?.enableEventSystem ?? true,
        logLevel: settings?.sequencing?.logLevel ?? "info",
      };

      // Create the sequencing service
      this._sequencingService = new SequencingService(
        this._sequencing,
        this.cmi,
        this.adl,
        this.eventService || this, // Use eventService if available, fallback to this
        this.loggingService, // loggingService is always initialized in BaseAPI constructor
        sequencingConfig,
      );

      // Set up event listeners if provided in settings
      if (settings?.sequencing?.eventListeners) {
        this._sequencingService.setEventListeners(settings.sequencing.eventListeners);
      }
    } catch (error) {
      // If sequencing service initialization fails, log error but continue
      console.warn("Failed to initialize sequencing service:", error);
      this._sequencingService = null;
    }
  }

  /**
   * Get the sequencing service (for advanced sequencing operations)
   * @return {SequencingService | null}
   */
  public getSequencingService(): SequencingService | null {
    return this._sequencingService;
  }

  /**
   * Set sequencing event listeners
   * @param {SequencingEventListeners} listeners - Event listeners for sequencing events
   */
  public setSequencingEventListeners(listeners: SequencingEventListeners): void {
    if (this._sequencingService) {
      this._sequencingService.setEventListeners(listeners);
    }
  }

  /**
   * Update sequencing configuration
   * @param {SequencingConfiguration} config - New sequencing configuration
   */
  public updateSequencingConfiguration(config: SequencingConfiguration): void {
    if (this._sequencingService) {
      this._sequencingService.updateConfiguration(config);
    }
  }

  /**
   * Get current sequencing state information
   * @return {object} Current sequencing state
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
   * Process a navigation request directly (for advanced use)
   * @param {string} request - Navigation request
   * @param {string} targetActivityId - Target activity ID for choice/jump requests
   * @return {boolean} True if request was processed successfully
   */
  public processNavigationRequest(request: string, targetActivityId?: string): boolean {
    if (this._sequencingService) {
      return this._sequencingService.processNavigationRequest(request, targetActivityId);
    }
    return false;
  }

  /**
   * Reset sequencing state explicitly (primarily for tests/tools, not normal LMS flow)
   */
  public resetSequencingState(): void {
    this._sequencing?.reset();
    this._sequencingService?.setEventListeners({});
  }

  /**
   * Get tracking data for a specific activity
   * Useful for players to update UI based on activity status
   * @param {string} activityId - The activity ID
   * @return {object | null} Tracking data for the activity or null if not found
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
   * @param {Partial<SequencingStateMetadata>} metadata - Optional metadata override
   * @return {Promise<boolean>} Promise resolving to success status
   */
  public async saveSequencingState(metadata?: Partial<SequencingStateMetadata>): Promise<boolean> {
    if (!this.settings.sequencingStatePersistence) {
      this.apiLog(
        "saveSequencingState",
        "No persistence configuration provided",
        LogLevelEnum.WARN,
      );
      return false;
    }

    try {
      const stateData = this.serializeSequencingState();
      const fullMetadata: SequencingStateMetadata = {
        learnerId: this.cmi.learner_id || "unknown",
        courseId: this.settings.courseId || "unknown",
        attemptNumber: 1,
        lastUpdated: new Date().toISOString(),
        version: this.settings.sequencingStatePersistence.stateVersion || "1.0",
        ...metadata,
      };

      const config = this.settings.sequencingStatePersistence;
      let dataToSave = stateData;

      // Compress if enabled (using simple base64 encoding for now)
      if (config.compress !== false) {
        dataToSave = this.compressStateData(stateData);
      }

      // Check size limits
      if (config.maxStateSize && dataToSave.length > config.maxStateSize) {
        throw new Error(`State size ${dataToSave.length} exceeds limit ${config.maxStateSize}`);
      }

      const success = await config.persistence.saveState(dataToSave, fullMetadata);

      if (config.debugPersistence) {
        this.apiLog(
          "saveSequencingState",
          `State save ${success ? "succeeded" : "failed"}: size=${dataToSave.length}`,
          success ? LogLevelEnum.INFO : LogLevelEnum.WARN,
        );
      }

      return success;
    } catch (error) {
      this.apiLog(
        "saveSequencingState",
        `Error saving sequencing state: ${error instanceof Error ? error.message : String(error)}`,
        LogLevelEnum.ERROR,
      );
      return false;
    }
  }

  /**
   * Load sequencing state from persistent storage
   * @param {Partial<SequencingStateMetadata>} metadata - Optional metadata override
   * @return {Promise<boolean>} Promise resolving to success status
   */
  public async loadSequencingState(metadata?: Partial<SequencingStateMetadata>): Promise<boolean> {
    if (!this.settings.sequencingStatePersistence) {
      this.apiLog(
        "loadSequencingState",
        "No persistence configuration provided",
        LogLevelEnum.WARN,
      );
      return false;
    }

    try {
      const fullMetadata: SequencingStateMetadata = {
        learnerId: this.cmi.learner_id || "unknown",
        courseId: this.settings.courseId || "unknown",
        attemptNumber: 1,
        version: this.settings.sequencingStatePersistence.stateVersion || "1.0",
        ...metadata,
      };

      const config = this.settings.sequencingStatePersistence;
      const stateData = await config.persistence.loadState(fullMetadata);

      if (!stateData) {
        if (config.debugPersistence) {
          this.apiLog(
            "loadSequencingState",
            "No sequencing state found to load",
            LogLevelEnum.INFO,
          );
        }
        return false;
      }

      // Decompress if needed
      let dataToLoad = stateData;
      if (config.compress !== false) {
        dataToLoad = this.decompressStateData(stateData);
      }

      const success = this.deserializeSequencingState(dataToLoad);

      if (config.debugPersistence) {
        this.apiLog(
          "loadSequencingState",
          `State load ${success ? "succeeded" : "failed"}: size=${stateData.length}`,
          success ? LogLevelEnum.INFO : LogLevelEnum.WARN,
        );
      }

      return success;
    } catch (error) {
      this.apiLog(
        "loadSequencingState",
        `Error loading sequencing state: ${error instanceof Error ? error.message : String(error)}`,
        LogLevelEnum.ERROR,
      );
      return false;
    }
  }

  /**
   * Determines the appropriate cmi.entry value based on previous exit state.
   * Per SCORM 2004 RTE 4.2.11 (cmi.entry) and 4.2.12 (cmi.exit):
   *
   * - If previous exit was "suspend": "resume" (learner suspended, wants to continue)
   * - If previous exit was "logout": "" (deprecated, attempt ended)
   * - If previous exit was "normal": "" (attempt completed normally)
   * - If previous exit was "time-out":
   *   - With suspend data: "resume" (resuming from interrupted session)
   *   - Without suspend data: "" (session ended)
   * - If no previous exit or unrecognized: "ab-initio" (fresh start)
   *
   * @param {string} previousExit - The cmi.exit value from the previous session
   * @param {boolean} hasSuspendData - Whether suspend_data exists from previous session
   * @return {string} The appropriate cmi.entry value ("ab-initio", "resume", or "")
   */
  public determineEntryValue(previousExit: string, hasSuspendData: boolean): string {
    // Trim whitespace to handle edge cases
    const trimmedExit = previousExit?.trim();

    // No previous exit or empty exit means first-time entry
    // Per SCORM 2004 spec Rule 1: ab-initio when this is the first learner session
    if (
      previousExit === "" ||
      previousExit === undefined ||
      previousExit === null ||
      trimmedExit === ""
    ) {
      return "ab-initio";
    }

    // Per SCORM 2004 spec Rule 2: resume when previous exit was "suspend"
    if (previousExit === "suspend") {
      return "resume";
    }

    // Per SCORM 2004 spec: logout and normal always mean empty string
    // (learner previously accessed SCO but didn't suspend)
    if (previousExit === "logout" || previousExit === "normal") {
      return "";
    }

    // Per SCORM 2004 spec: time-out returns "" (or possibly "resume" if suspend data exists)
    // The spec allows resume for time-out when there's suspend data from earlier
    if (previousExit === "time-out") {
      return hasSuspendData ? "resume" : "";
    }

    // Unknown/invalid exit values indicate the learner has accessed the SCO before
    // but conditions for ab-initio or resume aren't met, so return empty string
    return "";
  }

  /**
   * Serialize current sequencing state to JSON string
   * @return {string} Serialized state
   */
  private serializeSequencingState(): string {
    const state: any = {
      version: this.settings.sequencingStatePersistence?.stateVersion || "1.0",
      timestamp: new Date().toISOString(),
      sequencing: null,
      currentActivityId: null,
      globalObjectives: this._globalObjectives.map((obj) => obj.toJSON()),
      globalObjectiveMap: {},
      adlNavState: {
        request: this.adl.nav.request,
        request_valid: this.adl.nav.request_valid,
      },
      contentDelivered: false,
    };

    // Get sequencing state from overall sequencing process if available
    if (this._sequencingService) {
      const overallProcess = this._sequencingService.getOverallSequencingProcess();
      if (overallProcess) {
        // Use the getSequencingState method from overall_sequencing_process
        const sequencingState = overallProcess.getSequencingState();
        state.sequencing = sequencingState;
        state.contentDelivered = overallProcess.hasContentBeenDelivered();
        state.globalObjectiveMap = this.captureGlobalObjectiveSnapshot(overallProcess);
      }

      // Get current activity
      const currentActivity = this._sequencing.getCurrentActivity();
      if (currentActivity) {
        state.currentActivityId = currentActivity.id;
      }
    }

    if (!state.globalObjectiveMap || Object.keys(state.globalObjectiveMap).length === 0) {
      state.globalObjectiveMap = this.captureGlobalObjectiveSnapshot();
    }

    return JSON.stringify(state);
  }

  /**
   * Deserialize sequencing state from JSON string
   * @param {string} stateData - Serialized state data
   * @return {boolean} Success status
   */
  private deserializeSequencingState(stateData: string): boolean {
    try {
      const state = JSON.parse(stateData);

      // Version compatibility check
      const expectedVersion = this.settings.sequencingStatePersistence?.stateVersion || "1.0";
      if (state.version !== expectedVersion) {
        this.apiLog(
          "deserializeSequencingState",
          `State version mismatch: ${state.version} vs expected ${expectedVersion}`,
          LogLevelEnum.WARN,
        );
      }

      // If persistence stored the global objective map separately, ensure it is available to the sequencing state
      if (state.globalObjectiveMap && state.sequencing && !state.sequencing.globalObjectiveMap) {
        state.sequencing.globalObjectiveMap = state.globalObjectiveMap;
      }

      // Restore sequencing state
      if (state.sequencing && this._sequencingService) {
        const overallProcess = this._sequencingService.getOverallSequencingProcess();
        if (overallProcess) {
          overallProcess.restoreSequencingState(state.sequencing);

          // Restore content delivered flag
          if (state.contentDelivered) {
            // Mark content as delivered (there's no direct setter, so we'll need to add one)
            // For now, we'll just log it
            this.apiLog(
              "deserializeSequencingState",
              "Content delivery state restored",
              LogLevelEnum.DEBUG,
            );
          }
        }
      }

      // Restore global objectives
      const restoredObjectives = new Map<string, CMIObjectivesObject>();

      if (Array.isArray(state.globalObjectives)) {
        for (const objData of state.globalObjectives) {
          const objective = this.buildCMIObjectiveFromJSON(objData);
          if (objective.id) {
            restoredObjectives.set(objective.id, objective);
          }
        }
      }

      if (state.globalObjectiveMap && typeof state.globalObjectiveMap === "object") {
        const objectivesFromMap = this.buildCMIObjectivesFromMap(state.globalObjectiveMap);
        for (const objective of objectivesFromMap) {
          if (!objective.id) {
            continue;
          }
          if (!restoredObjectives.has(objective.id)) {
            restoredObjectives.set(objective.id, objective);
          }
        }
      }

      if (restoredObjectives.size > 0) {
        this._globalObjectives = Array.from(restoredObjectives.values());
        this._globalObjectives.forEach((objective) => {
          if (objective.id) {
            this.updateGlobalObjectiveFromCMI(objective.id, objective);
          }
        });
      }

      // Restore ADL nav state
      if (state.adlNavState) {
        this.adl.nav.request = state.adlNavState.request || "_none_";
        this.adl.nav.request_valid = state.adlNavState.request_valid || {};
      }

      return true;
    } catch (error) {
      this.apiLog(
        "deserializeSequencingState",
        `Error deserializing sequencing state: ${error instanceof Error ? error.message : String(error)}`,
        LogLevelEnum.ERROR,
      );
      return false;
    }
  }

  /**
   * Captures the global objective snapshot by collecting data from the provided overall process
   * or the internally managed sequencing service if no process is provided.
   *
   * @param {OverallSequencingProcess | null} [overallProcess] - An optional parameter representing the overall sequencing process. If not provided, it attempts to use the internal sequencing service.
   * @return {Record<string, GlobalObjectiveMapEntry>} A record containing the snapshot of the global objectives, with each objective's identifier as the key and its corresponding data as the value.
   */
  private captureGlobalObjectiveSnapshot(
    overallProcess?: OverallSequencingProcess | null,
  ): Record<string, GlobalObjectiveMapEntry> {
    const snapshot: Record<string, GlobalObjectiveMapEntry> = {};

    const process =
      overallProcess ?? this._sequencingService?.getOverallSequencingProcess() ?? null;
    if (process) {
      const processSnapshot = process.getGlobalObjectiveMapSnapshot();
      for (const [id, data] of Object.entries(processSnapshot)) {
        snapshot[id] = { ...data };
      }
    }

    for (const objective of this._globalObjectives) {
      if (!objective.id || snapshot[objective.id]) {
        continue;
      }
      snapshot[objective.id] = this.buildObjectiveMapEntryFromCMI(objective);
    }

    return snapshot;
  }

  /**
   * Constructs an array of `CMIObjectivesObject` instances from a given snapshot map.
   *
   * @param {Record<string, GlobalObjectiveMapEntry>} snapshot - A map where each entry represents objective data
   *                                         with various properties that may include
   *                                         satisfied status, progress measure, completion status, etc.
   * @return {CMIObjectivesObject[]} An array of `CMIObjectivesObject` instances built
   *                                  from the provided snapshot map. Returns an empty array
   *                                  if the snapshot is invalid or no valid objectives can be created.
   */
  private buildCMIObjectivesFromMap(
    snapshot: Record<string, GlobalObjectiveMapEntry>,
  ): CMIObjectivesObject[] {
    const objectives: CMIObjectivesObject[] = [];
    if (!snapshot || typeof snapshot !== "object") {
      return objectives;
    }

    for (const [objectiveId, entry] of Object.entries(snapshot)) {
      if (!entry || typeof entry !== "object") {
        continue;
      }
      const objective = new CMIObjectivesObject();
      objective.id = entry.id ?? objectiveId;

      if (entry.satisfiedStatusKnown === true) {
        objective.success_status = entry.satisfiedStatus
          ? SuccessStatus.PASSED
          : SuccessStatus.FAILED;
      }

      const normalizedMeasure = this.parseObjectiveNumber(entry.normalizedMeasure);
      if (entry.normalizedMeasureKnown === true && normalizedMeasure !== null) {
        objective.score.scaled = String(normalizedMeasure);
      }

      const progressMeasure = this.parseObjectiveNumber(entry.progressMeasure);
      if (entry.progressMeasureKnown === true && progressMeasure !== null) {
        objective.progress_measure = String(progressMeasure);
      }

      if (entry.completionStatusKnown === true && typeof entry.completionStatus === "string") {
        objective.completion_status = entry.completionStatus;
      }

      objectives.push(objective);
    }

    return objectives;
  }

  /**
   * Constructs a `CMIObjectivesObject` instance from the provided JSON data.
   *
   * @param {any} data - The JSON data used to populate the `CMIObjectivesObject`. If the input is invalid or missing, an empty `CMIObjectivesObject` instance is returned.
   * @return {CMIObjectivesObject} A populated `CMIObjectivesObject` instance based on the input data. Returns a default object if the input does not contain valid fields.
   */
  private buildCMIObjectiveFromJSON(data: any): CMIObjectivesObject {
    const objective = new CMIObjectivesObject();
    if (!data || typeof data !== "object") {
      return objective;
    }

    if (typeof data.id === "string") {
      objective.id = data.id;
    }

    if (typeof data.success_status === "string") {
      objective.success_status = data.success_status;
    }

    if (typeof data.completion_status === "string") {
      objective.completion_status = data.completion_status;
    }

    if (typeof data.progress_measure === "string" && data.progress_measure !== "") {
      objective.progress_measure = data.progress_measure;
    }

    if (typeof data.description === "string") {
      objective.description = data.description;
    }

    const score = data.score;
    if (score && typeof score === "object") {
      if (typeof score.scaled === "string" && score.scaled !== "") {
        objective.score.scaled = score.scaled;
      } else if (typeof score.scaled === "number" && Number.isFinite(score.scaled)) {
        objective.score.scaled = String(score.scaled);
      }

      if (typeof score.raw === "string" && score.raw !== "") {
        objective.score.raw = score.raw;
      } else if (typeof score.raw === "number" && Number.isFinite(score.raw)) {
        objective.score.raw = String(score.raw);
      }

      if (typeof score.min === "string" && score.min !== "") {
        objective.score.min = score.min;
      } else if (typeof score.min === "number" && Number.isFinite(score.min)) {
        objective.score.min = String(score.min);
      }

      if (typeof score.max === "string" && score.max !== "") {
        objective.score.max = score.max;
      } else if (typeof score.max === "number" && Number.isFinite(score.max)) {
        objective.score.max = String(score.max);
      }
    }

    return objective;
  }

  /**
   * Builds a map entry from the given CMI objectives object to a standardized GlobalObjectiveMapEntry.
   *
   * @param {CMIObjectivesObject} objective - The CMI objectives object containing data about a specific learning objective.
   * @return {GlobalObjectiveMapEntry} An object containing mapped properties and their values based on the provided objective.
   */
  private buildObjectiveMapEntryFromCMI(objective: CMIObjectivesObject): GlobalObjectiveMapEntry {
    const entry: GlobalObjectiveMapEntry = {
      id: objective.id,
      satisfiedStatusKnown: false,
      normalizedMeasureKnown: false,
      progressMeasureKnown: false,
      completionStatusKnown: false,
      readSatisfiedStatus: true,
      writeSatisfiedStatus: true,
      readNormalizedMeasure: true,
      writeNormalizedMeasure: true,
      readCompletionStatus: true,
      writeCompletionStatus: true,
      readProgressMeasure: true,
      writeProgressMeasure: true,
    };

    if (objective.success_status && objective.success_status !== SuccessStatus.UNKNOWN) {
      entry.satisfiedStatus = objective.success_status === SuccessStatus.PASSED;
      entry.satisfiedStatusKnown = true;
    }

    const normalizedMeasure = this.parseObjectiveNumber(objective.score?.scaled);
    if (normalizedMeasure !== null) {
      entry.normalizedMeasure = normalizedMeasure;
      entry.normalizedMeasureKnown = true;
    }

    const progressMeasure = this.parseObjectiveNumber(objective.progress_measure);
    if (progressMeasure !== null) {
      entry.progressMeasure = progressMeasure;
      entry.progressMeasureKnown = true;
    }

    if (objective.completion_status && objective.completion_status !== CompletionStatus.UNKNOWN) {
      entry.completionStatus = objective.completion_status;
      entry.completionStatusKnown = true;
    }

    return entry;
  }

  /**
   * Updates the global objective map in the sequencing service from CMI objective data.
   *
   * This method synchronizes global objectives between:
   * - _globalObjectives array (persists across SCO transitions)
   * - Sequencing service global objective map (used for sequencing decisions)
   *
   * When a SCO writes to a global objective via SetValue, this method ensures
   * the sequencing service is updated so that sequencing rules can evaluate
   * the objective status correctly.
   *
   * According to SCORM 2004 SN Book SB.2.4, global objectives must be synchronized
   * across all activities that reference them via mapInfo.
   *
   * @param {string} objectiveId - The global objective ID
   * @param {CMIObjectivesObject} objective - The CMI objective object with updated values
   * @private
   */
  private updateGlobalObjectiveFromCMI(objectiveId: string, objective: CMIObjectivesObject): void {
    if (!objectiveId || !this._sequencingService) {
      return;
    }

    const overallProcess = this._sequencingService.getOverallSequencingProcess();
    if (!overallProcess) {
      return;
    }

    const map = overallProcess.getGlobalObjectiveMap();
    if (!map.has(objectiveId)) {
      const fallbackEntry = this.buildObjectiveMapEntryFromCMI(objective);
      overallProcess.updateGlobalObjective(objectiveId, fallbackEntry);
      return;
    }

    const updatePayload: Record<string, any> = {};

    if (objective.success_status && objective.success_status !== SuccessStatus.UNKNOWN) {
      updatePayload.satisfiedStatus = objective.success_status === SuccessStatus.PASSED;
      updatePayload.satisfiedStatusKnown = true;
    }

    const normalizedMeasure = this.parseObjectiveNumber(objective.score?.scaled);
    if (normalizedMeasure !== null) {
      updatePayload.normalizedMeasure = normalizedMeasure;
      updatePayload.normalizedMeasureKnown = true;
    }

    const progressMeasure = this.parseObjectiveNumber(objective.progress_measure);
    if (progressMeasure !== null) {
      updatePayload.progressMeasure = progressMeasure;
      updatePayload.progressMeasureKnown = true;
    }

    if (objective.completion_status && objective.completion_status !== CompletionStatus.UNKNOWN) {
      updatePayload.completionStatus = objective.completion_status;
      updatePayload.completionStatusKnown = true;
    }

    if (Object.keys(updatePayload).length === 0) {
      return;
    }

    overallProcess.updateGlobalObjective(objectiveId, updatePayload);
  }

  /**
   * Parses the given value into a finite number if possible, otherwise returns null.
   *
   * @param {any} value - The input value to be parsed into a number.
   * @return {number | null} The parsed finite number if the input is valid, otherwise null.
   */
  private parseObjectiveNumber(value: any): number | null {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    const parsed = parseFloat(String(value));
    return Number.isFinite(parsed) ? parsed : null;
  }

  /**
   * Simple compression using base64 encoding
   * @param {string} data - Data to compress
   * @return {string} Compressed data
   */
  private compressStateData(data: string): string {
    // For now, just use base64 encoding
    // In a real implementation, you might use a library like lz-string
    if (typeof btoa !== "undefined") {
      return btoa(encodeURIComponent(data));
    }
    return data;
  }

  /**
   * Simple decompression from base64
   * @param {string} data - Data to decompress
   * @return {string} Decompressed data
   */
  private decompressStateData(data: string): string {
    // For now, just use base64 decoding
    // In a real implementation, you might use a library like lz-string
    if (typeof atob !== "undefined") {
      try {
        return decodeURIComponent(atob(data));
      } catch {
        return data;
      }
    }
    return data;
  }
}

export default Scorm2004API;
