import { CMIArray } from "../common/array";
import { aicc_constants } from "../../constants/api_constants";
import { BaseCMI } from "../common/base_cmi";
import { CMIScore } from "../common/score";
import { aicc_regex } from "../../constants/regex";
import { scorm12_errors } from "../../constants/error_codes";
import { AICCValidationError } from "../../exceptions/aicc_exceptions";
import { checkAICCValidFormat } from "./validation";

/**
 * Class representing the AICC cmi.student_data.tries object
 */
export class CMITries extends CMIArray {
  /**
   * Constructor for inline Tries Array class
   */
  constructor() {
    super({
      children: aicc_constants.tries_children,
    });
  }
}

/**
 * Class for AICC Tries
 */
export class CMITriesObject extends BaseCMI {
  private _status = "";
  private _time = "";

  /**
   * Constructor for AICC Tries object
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
    this.score?.initialize();
  }

  /**
   * Called when the API has been reset
   */
  reset(): void {
    this._initialized = false;
    this._status = "";
    this._time = "";
    this.score?.reset();
  }

  /**
   * Getter for _status
   * @return {string}
   */
  get status(): string {
    return this._status;
  }

  /**
   * Setter for _status
   * @param {string} status
   */
  set status(status: string) {
    if (checkAICCValidFormat(status, aicc_regex.CMIStatus2)) {
      this._status = status;
    }
  }

  /**
   * Getter for _time
   * @return {string}
   */
  get time(): string {
    return this._time;
  }

  /**
   * Setter for _time
   * @param {string} time
   */
  set time(time: string) {
    if (checkAICCValidFormat(time, aicc_regex.CMITime)) {
      this._time = time;
    }
  }

  /**
   * toJSON for cmi.student_data.tries.n object
   * @return {
   *    {
   *      status: string,
   *      time: string,
   *      score: CMIScore
   *    }
   *  }
   */
  toJSON(): {
    status: string;
    time: string;
    score: CMIScore;
  } {
    this.jsonString = true;
    const result = {
      status: this.status,
      time: this.time,
      score: this.score,
    };
    delete this.jsonString;
    return result;
  }
}
