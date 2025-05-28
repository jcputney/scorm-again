import { CMI } from "./cmi/scorm12/cmi";
import * as Utilities from "./utilities";
import { stringMatches } from "./utilities";
import { global_constants, scorm12_constants } from "./constants/api_constants";
import { scorm12_errors } from "./constants/error_codes";

import { BaseCMI } from "./cmi/common/base_cmi";
import { CMIObjectivesObject } from "./cmi/scorm12/objectives";
import {
  CMIInteractionsCorrectResponsesObject,
  CMIInteractionsObject,
  CMIInteractionsObjectivesObject
} from "./cmi/scorm12/interactions";
import { NAV } from "./cmi/scorm12/nav";
import { CommitObject, RefObject, ResultObject, ScoreObject, Settings } from "./types/api_types";
import { CompletionStatus, SuccessStatus } from "./constants/enums";
import BaseAPI from "./BaseAPI";
import { scorm12_regex } from "./constants/regex";

/**
 * API class for SCORM 1.2
 */
class Scorm12Impl extends BaseAPI {
  /**
   * Constructor for SCORM 1.2 API
   * @param {object} settings
   */
  constructor(settings?: Settings) {
    if (settings) {
      if (settings.mastery_override === undefined) {
        settings.mastery_override = false;
      }
    }

    super(scorm12_errors, settings);

    this.cmi = new CMI();
    this.nav = new NAV();

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

  LMSInitialize: () => string;
  LMSFinish: () => string;
  LMSGetValue: (CMIElement: string) => string;
  LMSSetValue: (CMIElement: string, value: any) => string;
  LMSCommit: () => string;
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
   * lmsInitialize function from SCORM 1.2 Spec
   *
   * @return {string} bool
   */
  lmsInitialize(): string {
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
   * LMSFinish function from SCORM 1.2 Spec
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
    const result = await this.terminate("LMSFinish", true);

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
   * LMSGetValue function from SCORM 1.2 Spec
   *
   * @param {string} CMIElement
   * @return {string}
   */
  lmsGetValue(CMIElement: string): string {
    return this.getValue("LMSGetValue", false, CMIElement);
  }

  /**
   * LMSSetValue function from SCORM 1.2 Spec
   *
   * @param {string} CMIElement
   * @param {*} value
   * @return {string}
   */
  lmsSetValue(CMIElement: string, value: any): string {
    if (CMIElement === "cmi.core.lesson_status") {
      this.statusSetByModule = true;
    }
    return this.setValue("LMSSetValue", "LMSCommit", false, CMIElement, value);
  }

  /**
   * LMSCommit function from SCORM 1.2 Spec
   *
   * @return {string} bool
   */
  lmsCommit(): string {
    if (this.settings.asyncCommit) {
      this.scheduleCommit(500, "LMSCommit");
    } else {
      (async () => {
        await this.commit("LMSCommit", false);
      })();
    }
    return global_constants.SCORM_TRUE;
  }

  /**
   * LMSGetLastError function from SCORM 1.2 Spec
   *
   * @return {string}
   */
  lmsGetLastError(): string {
    return this.getLastError("LMSGetLastError");
  }

  /**
   * LMSGetErrorString function from SCORM 1.2 Spec
   *
   * @param {string} CMIErrorCode
   * @return {string}
   */
  lmsGetErrorString(CMIErrorCode: string): string {
    return this.getErrorString("LMSGetErrorString", CMIErrorCode);
  }

  /**
   * LMSGetDiagnostic function from SCORM 1.2 Spec
   *
   * @param {string} CMIErrorCode
   * @return {string}
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
    return this._commonSetCMIValue("LMSSetValue", false, CMIElement, value);
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
  getChildElement(
    CMIElement: string,
    _value: any,
    foundFirstIndex: boolean,
  ): BaseCMI | null {
    if (stringMatches(CMIElement, "cmi\\.objectives\\.\\d+")) {
      return new CMIObjectivesObject();
    } else if (
      foundFirstIndex &&
      stringMatches(
        CMIElement,
        "cmi\\.interactions\\.\\d+\\.correct_responses\\.\\d+",
      )
    ) {
      return new CMIInteractionsCorrectResponsesObject();
    } else if (
      foundFirstIndex &&
      stringMatches(CMIElement, "cmi\\.interactions\\.\\d+\\.objectives\\.\\d+")
    ) {
      return new CMIInteractionsObjectivesObject();
    } else if (
      !foundFirstIndex &&
      stringMatches(CMIElement, "cmi\\.interactions\\.\\d+")
    ) {
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
  override getLmsErrorMessageDetails(
    errorNumber: number | string,
    detail: boolean,
  ): string {
    let basicMessage = "No Error";
    let detailMessage = "No Error";

    // Set error number to string since inconsistent from modules if string or number
    errorNumber = String(errorNumber);
    if (scorm12_constants.error_descriptions[errorNumber]) {
      basicMessage =
        scorm12_constants.error_descriptions[errorNumber]?.basicMessage ||
        "General Error";
      detailMessage =
        scorm12_constants.error_descriptions[errorNumber]?.detailMessage || "";
    }

    return detail ? detailMessage : basicMessage;
  }

  /**
   * Replace the whole API with another
   *
   * @param {Scorm12Impl} newAPI
   */
  replaceWithAnotherScormAPI(newAPI: Scorm12Impl) {
    // Data Model
    this.cmi = newAPI.cmi;
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
      cmiExport.cmi.core.total_time = this.cmi.getCurrentTotalTime();
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
   * Render the cmi object to the proper format for LMS commit
   * @param {boolean} terminateCommit
   * @return {CommitObject}
   */
  renderCommitObject(terminateCommit: boolean): CommitObject {
    const cmiExport = this.renderCommitCMI(terminateCommit);
    const totalTimeHHMMSS = this.cmi.getCurrentTotalTime();
    const totalTimeSeconds = Utilities.getTimeAsSeconds(
      totalTimeHHMMSS,
      scorm12_regex.CMITimespan,
    );
    const lessonStatus = this.cmi.core.lesson_status;
    let completionStatus = CompletionStatus.unknown;
    let successStatus = SuccessStatus.unknown;
    if (lessonStatus) {
      completionStatus =
        lessonStatus === "completed" || lessonStatus === "passed"
          ? CompletionStatus.completed
          : CompletionStatus.incomplete;
      if (lessonStatus === "passed") {
        successStatus = SuccessStatus.passed;
      } else if (lessonStatus === "failed") {
        successStatus = SuccessStatus.failed;
      }
    }

    const score = this.cmi.core.score;
    const scoreObject: ScoreObject = {};
    if (score) {
      if (!Number.isNaN(Number.parseFloat(score.raw))) {
        scoreObject.raw = Number.parseFloat(score.raw);
      }
      if (!Number.isNaN(Number.parseFloat(score.min))) {
        scoreObject.min = Number.parseFloat(score.min);
      }
      if (!Number.isNaN(Number.parseFloat(score.max))) {
        scoreObject.max = Number.parseFloat(score.max);
      }
    }

    const commitObject: CommitObject = {
      successStatus: successStatus,
      completionStatus: completionStatus,
      runtimeData: cmiExport,
      totalTimeSeconds: totalTimeSeconds,
    };
    if (scoreObject) {
      commitObject.score = scoreObject;
    }
    return commitObject;
  }

  /**
   * Attempts to store the data to the LMS
   *
   * @param {boolean} terminateCommit
   * @return {ResultObject}
   */
  async storeData(terminateCommit: boolean): Promise<ResultObject> {
    if (terminateCommit) {
      const originalStatus = this.cmi.core.lesson_status;
      if (
        !this.cmi.core.lesson_status ||
        (!this.statusSetByModule &&
          this.cmi.core.lesson_status === "not attempted")
      ) {
        this.cmi.core.lesson_status = "completed";
      }

      if (this.cmi.core.lesson_mode === "normal") {
        if (this.cmi.core.credit === "credit") {
          if (
            this.settings.mastery_override &&
            this.cmi.student_data.mastery_score !== "" &&
            this.cmi.core.score.raw !== ""
          ) {
            this.cmi.core.lesson_status =
              parseFloat(this.cmi.core.score.raw) >=
              parseFloat(this.cmi.student_data.mastery_score)
                ? "passed"
                : "failed";
          }
        }
      } else if (this.cmi.core.lesson_mode === "browse") {
        if (
          (this.startingData?.cmi?.core?.lesson_status || "") === "" &&
          originalStatus === "not attempted"
        ) {
          this.cmi.core.lesson_status = "browsed";
        }
      }
    }

    const commitObject = this.getCommitObject(terminateCommit);
    if (typeof this.settings.lmsCommitUrl === "string") {
      return await this.processHttpRequest(
        this.settings.lmsCommitUrl,
        commitObject,
        terminateCommit,
      );
    } else {
      return {
        result: global_constants.SCORM_TRUE,
        errorCode: 0,
      };
    }
  }
}

export { Scorm12Impl as Scorm12API };
