import { BaseCMI } from "../common/base_cmi";
import { CMIScore } from "../common/score";
import { aicc_constants } from "../../constants/api_constants";
import { aicc_regex } from "../../constants/regex";
import { scorm12_errors } from "../../constants/error_codes";
import { AICCValidationError } from "../../exceptions/aicc_exceptions";
import { checkAICCValidFormat } from "./validation";
import { CMIArray } from "../common/array";

/**
 * Class for cmi.student_data.attempt_records array
 */
export class CMIAttemptRecords extends CMIArray {
  /**
   * Constructor for inline Tries Array class
   */
  constructor() {
    super({
      children: aicc_constants.attempt_records_children,
    });
  }
}

/**
 * Class for AICC Attempt Records
 */
export class CMIAttemptRecordsObject extends BaseCMI {
  private _lesson_status = "";

  /**
   * Constructor for AICC Attempt Records object
   */
  constructor() {
    super();
    this.score = new CMIScore({
      score_children: aicc_constants.score_children,
      score_range: aicc_regex.score_range,
      invalidErrorCode: scorm12_errors.INVALID_SET_VALUE as number,
      invalidTypeCode: scorm12_errors.TYPE_MISMATCH as number,
      invalidRangeCode: scorm12_errors.VALUE_OUT_OF_RANGE as number,
      errorClass: AICCValidationError,
    });
  }

  public score: CMIScore;

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  override initialize() {
    super.initialize();

    this._lesson_status = "";
    this.score?.initialize();
  }

  /**
   * Called when the API has been reset
   */
  reset(): void {
    this._initialized = false;
    this.score?.reset();
  }

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
    if (checkAICCValidFormat(lesson_status, aicc_regex.CMIStatus2)) {
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
