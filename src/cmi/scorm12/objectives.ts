import {BaseCMI} from "../common/base_cmi";
import {CMIScore} from "../common/score";
import APIConstants from "../../constants/api_constants";
import Regex from "../../constants/regex";
import ErrorCodes from "../../constants/error_codes";
import {Scorm12ValidationError} from "../../exceptions";
import {check12ValidFormat} from "./validation";
import {CMIArray} from "../common/array";

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
      children: APIConstants.scorm12.objectives_children,
      errorCode: ErrorCodes.scorm12.INVALID_SET_VALUE,
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
      score_children: APIConstants.scorm12.score_children,
      score_range: Regex.scorm12.score_range,
      invalidErrorCode: ErrorCodes.scorm12.INVALID_SET_VALUE,
      invalidTypeCode: ErrorCodes.scorm12.TYPE_MISMATCH,
      invalidRangeCode: ErrorCodes.scorm12.VALUE_OUT_OF_RANGE,
      errorClass: Scorm12ValidationError,
    });
  }

  public readonly score: CMIScore;

  private _id = "";
  private _status = "";

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
    if (check12ValidFormat(id, Regex.scorm12.CMIIdentifier)) {
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
    if (check12ValidFormat(status, Regex.scorm12.CMIStatus2)) {
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