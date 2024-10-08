import BaseAPI from "./BaseAPI";
import { CMI } from "./cmi/scorm12/cmi";
import * as Utilities from "./utilities";
import APIConstants from "./constants/api_constants";
import ErrorCodes from "./constants/error_codes";

import { BaseCMI } from "./cmi/common/base_cmi";
import { CMIObjectivesObject } from "./cmi/scorm12/objectives";
import {
  CMIInteractionsCorrectResponsesObject,
  CMIInteractionsObject,
  CMIInteractionsObjectivesObject,
} from "./cmi/scorm12/interactions";
import { NAV } from "./cmi/scorm12/nav";
import { RefObject, ResultObject, Settings } from "./types/api_types";
import { stringMatches } from "./utilities";

/**
 * API class for SCORM 1.2
 */
export default class Scorm12API extends BaseAPI {
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

    super(ErrorCodes.scorm12, settings);

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

  public cmi: CMI;
  public nav: NAV;

  public LMSInitialize: () => string;
  public LMSFinish: () => string;
  public LMSGetValue: (CMIElement: string) => string;
  public LMSSetValue: (CMIElement: string, value: any) => string;
  public LMSCommit: () => string;
  public LMSGetLastError: () => string;
  public LMSGetErrorString: (CMIErrorCode: string) => string;
  public LMSGetDiagnostic: (CMIErrorCode: string) => string;

  /**
   * lmsInitialize function from SCORM 1.2 Spec
   *
   * @return {string} bool
   */
  lmsInitialize(): string {
    this.cmi.initialize();
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
    return APIConstants.global.SCORM_TRUE;
  }

  async internalFinish(): Promise<string> {
    const result = await this.terminate("LMSFinish", true);

    if (result === APIConstants.global.SCORM_TRUE) {
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
    return this.setValue("LMSSetValue", "LMSCommit", false, CMIElement, value);
  }

  /**
   * LMSCommit function from SCORM 1.2 Spec
   *
   * @return {string} bool
   */
  lmsCommit(): string {
    (async () => {
      await this.commit("LMSCommit", false);
    })();
    return APIConstants.global.SCORM_TRUE;
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
  setCMIValue(CMIElement: string, value: any): string {
    return this._commonSetCMIValue("LMSSetValue", false, CMIElement, value);
  }

  /**
   * Gets a value from the CMI Object
   *
   * @param {string} CMIElement
   * @return {*}
   */
  getCMIValue(CMIElement: string): any {
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
  getLmsErrorMessageDetails(
    errorNumber: number | string,
    detail: boolean,
  ): string {
    let basicMessage = "No Error";
    let detailMessage = "No Error";

    // Set error number to string since inconsistent from modules if string or number
    errorNumber = String(errorNumber);
    if (APIConstants.scorm12.error_descriptions[errorNumber]) {
      basicMessage =
        APIConstants.scorm12.error_descriptions[errorNumber].basicMessage;
      detailMessage =
        APIConstants.scorm12.error_descriptions[errorNumber].detailMessage;
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
   * Attempts to store the data to the LMS
   *
   * @param {boolean} terminateCommit
   * @return {ResultObject}
   */
  async storeData(terminateCommit: boolean): Promise<ResultObject> {
    if (terminateCommit) {
      const originalStatus = this.cmi.core.lesson_status;
      if (originalStatus === "not attempted") {
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
      return await this.processHttpRequest(
        this.settings.lmsCommitUrl,
        commitObject,
        terminateCommit,
      );
    } else {
      return {
        result: APIConstants.global.SCORM_TRUE,
        errorCode: 0,
      };
    }
  }
}