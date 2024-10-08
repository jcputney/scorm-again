import {BaseCMI} from "../common/base_cmi";
import {CMIScore} from "../common/score";
import APIConstants from "../../constants/api_constants";
import Regex from "../../constants/regex";
import ErrorCodes from "../../constants/error_codes";
import {AICCValidationError} from "../../exceptions";
import {checkAICCValidFormat} from "./validation";
import {CMIArray} from "../common/array";

/**
 * Class for cmi.student_data.attempt_records array
 */
export class CMIAttemptRecords extends CMIArray {
  /**
   * Constructor for inline Tries Array class
   */
  constructor() {
    super({
      children: APIConstants.aicc.attempt_records_children,
    });
  }
}

/**
 * Class for AICC Attempt Records
 */
export class CMIAttemptRecordsObject extends BaseCMI {
  /**
   * Constructor for AICC Attempt Records object
   */
  constructor() {
    super();
    this.score = new CMIScore({
      score_children: APIConstants.aicc.score_children,
      score_range: Regex.aicc.score_range,
      invalidErrorCode: ErrorCodes.scorm12.INVALID_SET_VALUE,
      invalidTypeCode: ErrorCodes.scorm12.TYPE_MISMATCH,
      invalidRangeCode: ErrorCodes.scorm12.VALUE_OUT_OF_RANGE,
      errorClass: AICCValidationError,
    });
  }

  public score: CMIScore;

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.score?.initialize();
  }

  private _lesson_status = "";

  /**
   * Getter for _lesson_status
   * @return {string}
   */
  get lesson_status(): string {
    return this._lesson_status;
  }

  /**
   * Setter for _lesson_status
   * @param {string} lesson_status
   */
  set lesson_status(lesson_status: string) {
    if (checkAICCValidFormat(lesson_status, Regex.aicc.CMIStatus2)) {
      this._lesson_status = lesson_status;
    }
  }

  /**
   * toJSON for cmi.student_data.attempt_records.n object
   * @return {
   *    {
   *         lesson_status: string,
   *         score: CMIScore
   *     }
   *  }
   */
  toJSON(): {
    lesson_status: string;
    score: CMIScore;
  } {
    this.jsonString = true;
    const result = {
      lesson_status: this.lesson_status,
      score: this.score,
    };
    delete this.jsonString;
    return result;
  }
}