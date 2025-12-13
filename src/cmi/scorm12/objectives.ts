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
 *
 * Per SCORM 1.2 RTE Section 3.4.2.6:
 * - Array of objective records for tracking learning goals
 * - Each objective contains: id, score (raw, min, max), status
 * - Indices must be sequential starting at 0
 * - SCO can define multiple objectives to track sub-goals
 *
 * @extends CMIArray
 */
export class CMIObjectives extends CMIArray {
  /**
   * Constructor for `cmi.objectives`
   */
  constructor() {
    super({
      CMIElement: "cmi.objectives",
      children: scorm12_constants.objectives_children,
      errorCode: scorm12_errors.INVALID_SET_VALUE as number,
      errorClass: Scorm12ValidationError,
    });
  }
}

/**
 * Class representing SCORM 1.2's cmi.objectives.n object
 *
 * Per SCORM 1.2 RTE Section 3.4.2.6:
 * - Individual objective record
 * - id: Unique identifier for the objective (CMIIdentifier)
 * - score: Learner's score for this objective (raw, min, max)
 * - status: Achievement status (passed, completed, failed, incomplete, browsed, not attempted)
 * - Used to track progress toward specific learning goals
 *
 * @extends BaseCMI
 */
export class CMIObjectivesObject extends BaseCMI {
  /**
   * Constructor for cmi.objectives.n
   */
  constructor() {
    super("cmi.objectives.n");
    this.score = new CMIScore({
      CMIElement: "cmi.objectives.n.score",
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
    if (check12ValidFormat(this._cmi_element + ".id", id, scorm12_regex.CMIIdentifier)) {
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
    if (check12ValidFormat(this._cmi_element + ".status", status, scorm12_regex.CMIStatus2)) {
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
    this.jsonString = false;
    return result;
  }
}
