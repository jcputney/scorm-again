import { CMI } from "./cmi/scorm12/cmi";
import * as Utilities from "./utilities";
import { StringKeyMap, stringMatches } from "./utilities";
import { global_constants, scorm12_constants } from "./constants/api_constants";
import { scorm12_errors } from "./constants/error_codes";

import { BaseCMI } from "./cmi/common/base_cmi";
import { CMIObjectivesObject } from "./cmi/scorm12/objectives";
import {
  CMIInteractionsCorrectResponsesObject,
  CMIInteractionsObject,
  CMIInteractionsObjectivesObject,
} from "./cmi/scorm12/interactions";
import { NAV } from "./cmi/scorm12/nav";
import { CommitObject, ResultObject, ScoreObject, Settings } from "./types/api_types";
import { CompletionStatus, SuccessStatus } from "./constants/enums";
import BaseAPI from "./BaseAPI";
import { scorm12_regex } from "./constants/regex";
import { IHttpService } from "./interfaces/services";

/**
 * API class for SCORM 1.2
 */
class Scorm12API extends BaseAPI {
  /**
   * Static global storage for learner preferences
   * When globalStudentPreferences is enabled, preferences persist across SCO instances
   * @private
   */
  private static _globalLearnerPrefs: {
    audio: string;
    language: string;
    speed: string;
    text: string;
  } | null = null;

  /**
   * Clear the global learner preferences storage
   * @public
   */
  public static clearGlobalPreferences(): void {
    Scorm12API._globalLearnerPrefs = null;
  }

  /**
   * Constructor for SCORM 1.2 API
   * @param {object} settings
   * @param {IHttpService} httpService - Optional HTTP service instance
   */
  constructor(settings?: Settings, httpService?: IHttpService) {
    if (settings) {
      // Per SCORM 1.2 spec, LMS may override lesson_status based on mastery score
      // Default to true for spec compliance; set to false for conservative behavior
      if (settings.mastery_override === undefined) {
        settings.mastery_override = true;
      }
    }

    super(scorm12_errors, settings, httpService);

    this.cmi = new CMI();
    this.nav = new NAV();

    // Initialize preferences from global storage if enabled
    // Only set non-empty values to avoid validation errors
    if (this.settings.globalStudentPreferences && Scorm12API._globalLearnerPrefs) {
      if (Scorm12API._globalLearnerPrefs.audio !== "") {
        this.cmi.student_preference.audio = Scorm12API._globalLearnerPrefs.audio;
      }
      if (Scorm12API._globalLearnerPrefs.language !== "") {
        this.cmi.student_preference.language = Scorm12API._globalLearnerPrefs.language;
      }
      if (Scorm12API._globalLearnerPrefs.speed !== "") {
        this.cmi.student_preference.speed = Scorm12API._globalLearnerPrefs.speed;
      }
      if (Scorm12API._globalLearnerPrefs.text !== "") {
        this.cmi.student_preference.text = Scorm12API._globalLearnerPrefs.text;
      }
    }

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

  public statusSetByModule = false;

  cmi: CMI;
  nav: NAV;

  LMSInitialize: (parameter?: string) => string;
  LMSFinish: (parameter?: string) => string;
  LMSGetValue: (CMIElement: string) => string;
  LMSSetValue: (CMIElement: string, value: any) => string;
  LMSCommit: (parameter?: string) => string;
  LMSGetLastError: () => string;
  LMSGetErrorString: (CMIErrorCode: string) => string;
  LMSGetDiagnostic: (CMIErrorCode: string) => string;

  /**
   * Called when the API needs to be reset
   */
  reset(settings?: Settings) {
    this.commonReset(settings);

    this.cmi?.reset();
    this.nav?.reset();
  }

  /**
   * LMSInitialize - Begins a communication session with the LMS
   *
   * Per SCORM 1.2 RTE Section 3.4.3.1:
   * - Parameter must be empty string ("")
   * - Returns "true" on success, "false" on failure
   * - Sets error 101 if already initialized
   * - Sets error 101 if already terminated
   * - Initializes cmi.core.lesson_status to "not attempted" if not already set
   *
   * @param {string} parameter - Must be an empty string per SCORM 1.2 specification
   * @return {string} "true" or "false"
   */
  lmsInitialize(parameter: string = ""): string {
    // SCORM 1.2 RTE 3.4.3.1: Parameter must be an empty string
    if (parameter !== "") {
      this.throwSCORMError("api", this._error_codes.ARGUMENT_ERROR);
      return global_constants.SCORM_FALSE;
    }

    this.cmi.initialize();
    if (this.cmi.core.lesson_status) {
      this.statusSetByModule = true;
    } else {
      this.cmi.core.lesson_status = "not attempted";
    }
    return this.initialize(
      "LMSInitialize",
      "LMS was already initialized!",
      "LMS is already finished!",
    );
  }

  /**
   * LMSFinish - Ends the communication session and persists data
   *
   * Per SCORM 1.2 RTE Section 3.4.3.2:
   * - Parameter must be empty string ("")
   * - Returns "true" on success, "false" on failure
   * - Commits all data to persistent storage
   * - Sets error 101 if not initialized
   * - Sets error 101 if already terminated
   * - Processes navigation events (continue/previous) if nav.event is set
   *
   * @param {string} parameter - Must be an empty string per SCORM 1.2 specification
   * @return {string} "true" or "false"
   */
  lmsFinish(parameter: string = ""): string {
    // SCORM 1.2 RTE 3.4.3.2: Parameter must be an empty string
    if (parameter !== "") {
      this.throwSCORMError("api", this._error_codes.ARGUMENT_ERROR);
      return global_constants.SCORM_FALSE;
    }

    const result = this.terminate("LMSFinish", true);

    if (result === global_constants.SCORM_TRUE) {
      if (this.nav.event !== "") {
        if (this.nav.event === "continue") {
          this.processListeners("SequenceNext");
        } else {
          this.processListeners("SequencePrevious");
        }
      } else if (this.settings.autoProgress) {
        this.processListeners("SequenceNext");
      }
    }

    return result;
  }

  /**
   * LMSGetValue - Retrieves a value from the CMI data model
   *
   * Per SCORM 1.2 RTE Section 3.4.3.3:
   * - Returns the value of the specified CMI element
   * - Returns empty string if element has no value
   * - Sets error 101 if not initialized
   * - Sets error 301 if element is not implemented (invalid element)
   * - Sets error 201 if element is write-only
   * - Sets error 202 if element is not initialized
   *
   * @param {string} CMIElement - The CMI element path (e.g., "cmi.core.score.raw")
   * @return {string} The value of the element, or empty string
   */
  lmsGetValue(CMIElement: string): string {
    return this.getValue("LMSGetValue", false, CMIElement);
  }

  /**
   * LMSSetValue - Sets a value in the CMI data model
   *
   * Per SCORM 1.2 RTE Section 3.4.3.4:
   * - Sets the value of the specified CMI element
   * - Returns "true" on success, "false" on failure
   * - Sets error 101 if not initialized
   * - Sets error 301 if element is not implemented (invalid element)
   * - Sets error 351 if element exceeds maximum length
   * - Sets error 201 if element is read-only
   * - Sets error 405 if incorrect data type
   * - Triggers autocommit if enabled
   *
   * @param {string} CMIElement - The CMI element path (e.g., "cmi.core.lesson_status")
   * @param {any} value - The value to set
   * @return {string} "true" or "false"
   */
  lmsSetValue(CMIElement: string, value: any): string {
    if (CMIElement === "cmi.core.lesson_status") {
      this.statusSetByModule = true;
    }
    return this.setValue("LMSSetValue", "LMSCommit", false, CMIElement, value);
  }

  /**
   * LMSCommit - Requests immediate persistence of data to the LMS
   *
   * Per SCORM 1.2 RTE Section 3.4.4.1:
   * - Parameter must be empty string ("")
   * - Requests persistence of all data set since last successful commit
   * - Returns "true" on success, "false" on failure
   * - Sets error 101 if not initialized
   * - Sets error 391 if commit failed
   * - Does not terminate the communication session
   *
   * @param {string} parameter - Must be an empty string per SCORM 1.2 specification
   * @return {string} "true" or "false"
   */
  lmsCommit(parameter: string = ""): string {
    // SCORM 1.2 RTE 3.4.4.1: Parameter must be an empty string
    if (parameter !== "") {
      this.throwSCORMError("api", this._error_codes.ARGUMENT_ERROR);
      return global_constants.SCORM_FALSE;
    }

    if (this.settings.throttleCommits) {
      this.scheduleCommit(500, "LMSCommit");
      return global_constants.SCORM_TRUE;
    } else {
      return this.commit("LMSCommit", false);
    }
  }

  /**
   * LMSGetLastError - Returns the error code from the last API call
   *
   * Per SCORM 1.2 RTE Section 3.4.4.2:
   * - Returns the error code that resulted from the last API call
   * - Returns "0" if no error occurred
   * - Can be called at any time (even before LMSInitialize)
   * - Does not change the current error state
   * - Should be called after each API call to check for errors
   *
   * @return {string} Error code as a string (e.g., "0", "101", "301")
   */
  lmsGetLastError(): string {
    return this.getLastError("LMSGetLastError");
  }

  /**
   * LMSGetErrorString - Returns a short description for an error code
   *
   * Per SCORM 1.2 RTE Section 3.4.4.3:
   * - Returns a textual description for the specified error code
   * - Returns empty string if error code is not recognized
   * - Can be called at any time (even before LMSInitialize)
   * - Does not change the current error state
   * - Used to provide user-friendly error messages
   *
   * @param {string} CMIErrorCode - The error code to get the description for
   * @return {string} Short error description
   */
  lmsGetErrorString(CMIErrorCode: string): string {
    return this.getErrorString("LMSGetErrorString", CMIErrorCode);
  }

  /**
   * LMSGetDiagnostic - Returns detailed diagnostic information for an error
   *
   * Per SCORM 1.2 RTE Section 3.4.4.4:
   * - Returns detailed diagnostic information for the specified error code
   * - Implementation-specific; can include additional context or debugging info
   * - Returns empty string if no diagnostic information is available
   * - Can be called at any time (even before LMSInitialize)
   * - Does not change the current error state
   * - Used for debugging and troubleshooting
   *
   * @param {string} CMIErrorCode - The error code to get diagnostic information for
   * @return {string} Detailed diagnostic information
   */
  lmsGetDiagnostic(CMIErrorCode: string): string {
    return this.getDiagnostic("LMSGetDiagnostic", CMIErrorCode);
  }

  /**
   * Sets a value on the CMI Object
   *
   * @param {string} CMIElement
   * @param {*} value
   * @return {string}
   */
  override setCMIValue(CMIElement: string, value: any): string {
    const result = this._commonSetCMIValue("LMSSetValue", false, CMIElement, value);

    // Update global learner preferences if enabled
    if (this.settings.globalStudentPreferences) {
      if (CMIElement === "cmi.student_preference.audio") {
        this._updateGlobalPreference("audio", value);
      } else if (CMIElement === "cmi.student_preference.language") {
        this._updateGlobalPreference("language", value);
      } else if (CMIElement === "cmi.student_preference.speed") {
        this._updateGlobalPreference("speed", value);
      } else if (CMIElement === "cmi.student_preference.text") {
        this._updateGlobalPreference("text", value);
      }
    }

    return result;
  }

  /**
   * Updates a specific field in the global learner preferences storage
   * @param {string} field - The preference field to update
   * @param {string} value - The value to set
   * @private
   */
  private _updateGlobalPreference(
    field: "audio" | "language" | "speed" | "text",
    value: string,
  ): void {
    if (!Scorm12API._globalLearnerPrefs) {
      Scorm12API._globalLearnerPrefs = { audio: "", language: "", speed: "", text: "" };
    }
    Scorm12API._globalLearnerPrefs[field] = value;
  }

  /**
   * Gets a value from the CMI Object
   *
   * @param {string} CMIElement
   * @return {*}
   */
  override getCMIValue(CMIElement: string): any {
    return this._commonGetCMIValue("getCMIValue", false, CMIElement);
  }

  /**
   * Gets or builds a new child element to add to the array.
   *
   * @param {string} CMIElement
   * @param {*} _value
   * @param {boolean} foundFirstIndex
   * @return {BaseCMI|null}
   */
  getChildElement(CMIElement: string, _value: any, foundFirstIndex: boolean): BaseCMI | null {
    if (stringMatches(CMIElement, "cmi\\.objectives\\.\\d+")) {
      return new CMIObjectivesObject();
    } else if (
      foundFirstIndex &&
      stringMatches(CMIElement, "cmi\\.interactions\\.\\d+\\.correct_responses\\.\\d+")
    ) {
      return new CMIInteractionsCorrectResponsesObject();
    } else if (
      foundFirstIndex &&
      stringMatches(CMIElement, "cmi\\.interactions\\.\\d+\\.objectives\\.\\d+")
    ) {
      return new CMIInteractionsObjectivesObject();
    } else if (!foundFirstIndex && stringMatches(CMIElement, "cmi\\.interactions\\.\\d+")) {
      return new CMIInteractionsObject();
    }

    return null;
  }

  /**
   * Validates Correct Response values
   *
   * @param {string} _CMIElement
   * @param {*} _value
   */
  validateCorrectResponse(_CMIElement: string, _value: any) {
    // do nothing
  }

  /**
   * Returns the message that corresponds to errorNumber.
   *
   * @param {number|string} errorNumber
   * @param {boolean} detail
   * @return {string}
   */
  override getLmsErrorMessageDetails(errorNumber: number | string, detail: boolean): string {
    let basicMessage = "No Error";
    let detailMessage = "No Error";

    // Set error number to string since inconsistent from modules if string or number
    errorNumber = String(errorNumber);
    if (scorm12_constants.error_descriptions[errorNumber]) {
      basicMessage =
        scorm12_constants.error_descriptions[errorNumber]?.basicMessage || basicMessage;
      detailMessage =
        scorm12_constants.error_descriptions[errorNumber]?.detailMessage || detailMessage;
    }

    return detail ? detailMessage : basicMessage;
  }

  /**
   * Replace the whole API with another
   *
   * @param {Scorm12API} newAPI
   */
  replaceWithAnotherScormAPI(newAPI: Scorm12API) {
    // Data Model
    this.cmi = newAPI.cmi;
  }

  /**
   * Render the cmi object to the proper format for LMS commit
   *
   * @param {boolean} terminateCommit - Whether this is a termination commit
   * @param {boolean} includeTotalTime - Whether to include total time in the commit data
   * @return {object|Array}
   */
  renderCommitCMI(
    terminateCommit: boolean,
    includeTotalTime: boolean = false,
  ): StringKeyMap | Array<string> {
    const cmiExport: StringKeyMap = this.renderCMIToJSONObject();

    if (terminateCommit || includeTotalTime) {
      (cmiExport.cmi as any).core.total_time = this.cmi.getCurrentTotalTime();
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
   * Render the cmi object to the proper format for LMS commit
   * @param {boolean} terminateCommit - Whether this is a termination commit
   * @param {boolean} includeTotalTime - Whether to include total time in the commit data
   * @return {CommitObject}
   */
  renderCommitObject(terminateCommit: boolean, includeTotalTime: boolean = false): CommitObject {
    const cmiExport = this.renderCommitCMI(terminateCommit, includeTotalTime);
    const calculateTotalTime = terminateCommit || includeTotalTime;
    const totalTimeHHMMSS = calculateTotalTime ? this.cmi.getCurrentTotalTime() : "";
    const totalTimeSeconds = Utilities.getTimeAsSeconds(totalTimeHHMMSS, scorm12_regex.CMITimespan);
    const lessonStatus = this.cmi.core.lesson_status;
    let completionStatus = CompletionStatus.UNKNOWN;
    let successStatus = SuccessStatus.UNKNOWN;
    if (lessonStatus) {
      completionStatus =
        lessonStatus === "completed" || lessonStatus === "passed"
          ? CompletionStatus.COMPLETED
          : CompletionStatus.INCOMPLETE;
      if (lessonStatus === "passed") {
        successStatus = SuccessStatus.PASSED;
      } else if (lessonStatus === "failed") {
        successStatus = SuccessStatus.FAILED;
      }
    }

    const scoreObject: ScoreObject = this.cmi?.core?.score?.getScoreObject() || {};
    const commitObject: CommitObject = {
      successStatus: successStatus,
      completionStatus: completionStatus,
      runtimeData: cmiExport as StringKeyMap,
      totalTimeSeconds: totalTimeSeconds,
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
      if (this.cmi.core.student_id) {
        commitObject.learnerId = this.cmi.core.student_id;
      }
      if (this.cmi.core.student_name) {
        commitObject.learnerName = this.cmi.core.student_name;
      }
    }

    return commitObject;
  }

  /**
   * Attempts to store the data to the LMS
   *
   * @param {boolean} terminateCommit
   * @return {ResultObject}
   */
  storeData(terminateCommit: boolean): ResultObject {
    if (terminateCommit) {
      const originalStatus = this.cmi.core.lesson_status;

      // Stage 1: Apply mastery when status is unset/not-attempted
      if (
        !this.cmi.core.lesson_status ||
        (!this.statusSetByModule && this.cmi.core.lesson_status === "not attempted")
      ) {
        this.cmi.core.lesson_status = this.settings.autoCompleteLessonStatus
          ? "completed"
          : "incomplete";
      }

      if (this.cmi.core.lesson_mode === "normal") {
        if (this.cmi.core.credit === "credit") {
          if (
            this.settings.mastery_override &&
            this.cmi.student_data.mastery_score !== "" &&
            this.cmi.core.score.raw !== ""
          ) {
            this.cmi.core.lesson_status =
              parseFloat(this.cmi.core.score.raw) >= parseFloat(this.cmi.student_data.mastery_score)
                ? "passed"
                : "failed";
          }
        }
      } else if (this.cmi.core.lesson_mode === "browse") {
        if (
          ((this.startingData?.cmi as any)?.core?.lesson_status || "") === "" &&
          originalStatus === "not attempted"
        ) {
          this.cmi.core.lesson_status = "browsed";
        }
      }

      // Stage 2: Override SCO-set status if score_overrides_status is enabled
      if (
        this.settings.score_overrides_status &&
        this.statusSetByModule &&
        this.cmi.core.lesson_mode === "normal" &&
        this.cmi.core.credit === "credit" &&
        this.cmi.student_data.mastery_score !== "" &&
        this.cmi.core.score.raw !== ""
      ) {
        if (
          parseFloat(this.cmi.core.score.raw) >= parseFloat(this.cmi.student_data.mastery_score)
        ) {
          this.cmi.core.lesson_status = "passed";
        } else {
          this.cmi.core.lesson_status = "failed";
        }
      }
    }

    const commitObject = this.getCommitObject(terminateCommit);
    if (typeof this.settings.lmsCommitUrl === "string") {
      return this.processHttpRequest(this.settings.lmsCommitUrl, commitObject, terminateCommit);
    } else {
      return {
        result: global_constants.SCORM_TRUE,
        errorCode: 0,
      };
    }
  }
}

export default Scorm12API;
