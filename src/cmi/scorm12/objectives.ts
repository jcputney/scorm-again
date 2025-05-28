import { BaseCMI } from "../common/base_cmi";
import { CMIScore } from "../common/score";
import { scorm12_constants } from "../../constants/api_constants";
import { scorm12_regex } from "../../constants/regex";
import { scorm12_errors } from "../../constants/error_codes";
import { Scorm12ValidationError } from "../../exceptions/scorm12_exceptions";
import { check12ValidFormat } from "./validation";
import { CMIArray } from "../common/array";

/**
 * Class representing SCORM 1.2's `cmi.objectives` object
 * @extends CMIArray
 */
export class CMIObjectives extends CMIArray {
  /**
   * Constructor for `cmi.objectives`
   */
  constructor() {
    super({
      children: scorm12_constants.objectives_children,
      errorCode: scorm12_errors.INVALID_SET_VALUE as number,
      errorClass: Scorm12ValidationError,
    });
  }
}

/**
 * Class representing SCORM 1.2's cmi.objectives.n object
 * @extends BaseCMI
 */
export class CMIObjectivesObject extends BaseCMI {
  /**
   * Constructor for cmi.objectives.n
   */
  constructor() {
    super();
    this.score = new CMIScore({
      score_children: scorm12_constants.score_children,
      score_range: scorm12_regex.score_range,
      invalidErrorCode: scorm12_errors.INVALID_SET_VALUE as number,
      invalidTypeCode: scorm12_errors.TYPE_MISMATCH as number,
      invalidRangeCode: scorm12_errors.VALUE_OUT_OF_RANGE as number,
      errorClass: Scorm12ValidationError,
    });
  }

  public readonly score: CMIScore;

  private _id = "";
  private _status = "";

  /**
   * Called when the API has been reset
   */
  reset(): void {
    this._initialized = false;
    this._id = "";
    this._status = "";
    this.score?.reset();
  }

  /**
   * Getter for _id
   * @return {string}
   */
  get id(): string {
    return this._id;
  }

  /**
   * Setter for _id
   * @param {string} id
   */
  set id(id: string) {
    if (check12ValidFormat(id, scorm12_regex.CMIIdentifier)) {
      this._id = id;
    }
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
    if (check12ValidFormat(status, scorm12_regex.CMIStatus2)) {
      this._status = status;
    }
  }

  /**
   * toJSON for cmi.objectives.n
   * @return {
   *    {
   *      id: string,
   *      status: string,
   *      score: CMIScore
   *    }
   *  }
   */
  toJSON(): {
    id: string;
    status: string;
    score: CMIScore;
  } {
    this.jsonString = true;
    const result = {
      id: this.id,
      status: this.status,
      score: this.score,
    };
    delete this.jsonString;
    return result;
  }
}
