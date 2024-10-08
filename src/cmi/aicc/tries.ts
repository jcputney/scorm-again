import {CMIArray} from "../common/array";
import APIConstants from "../../constants/api_constants";
import {BaseCMI} from "../common/base_cmi";
import {CMIScore} from "../common/score";
import Regex from "../../constants/regex";
import ErrorCodes from "../../constants/error_codes";
import {AICCValidationError} from "../../exceptions";
import {checkAICCValidFormat} from "./validation";

/**
 * Class representing the AICC cmi.student_data.tries object
 */
export class CMITries extends CMIArray {
  /**
   * Constructor for inline Tries Array class
   */
  constructor() {
    super({
      children: APIConstants.aicc.tries_children,
    });
  }
}

/**
 * Class for AICC Tries
 */
export class CMITriesObject extends BaseCMI {
  /**
   * Constructor for AICC Tries object
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

  private _status = "";
  private _time = "";

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
    if (checkAICCValidFormat(status, Regex.aicc.CMIStatus2)) {
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
    if (checkAICCValidFormat(time, Regex.aicc.CMITime)) {
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