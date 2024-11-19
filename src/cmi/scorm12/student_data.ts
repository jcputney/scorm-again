import { BaseCMI } from "../common/base_cmi";
import { scorm12_constants } from "../../constants/api_constants";
import { Scorm12ValidationError } from "../../exceptions/scorm12_exceptions";
import { scorm12_errors } from "../../constants/error_codes";

/**
 * Class representing the SCORM 1.2 cmi.student_data object
 * @extends BaseCMI
 */
export class CMIStudentData extends BaseCMI {
  private readonly __children;
  private _mastery_score = "";
  private _max_time_allowed = "";
  private _time_limit_action = "";

  /**
   * Constructor for cmi.student_data
   * @param {string} student_data_children
   */
  constructor(student_data_children?: string) {
    super();
    this.__children = student_data_children
      ? student_data_children
      : scorm12_constants.student_data_children;
  }

  /**
   * Called when the API has been reset
   */
  reset(): void {
    this._initialized = false;
  }

  /**
   * Getter for __children
   * @return {string}
   * @private
   */
  get _children(): string {
    return this.__children;
  }

  /**
   * Setter for __children. Just throws an error.
   * @param {string} _children
   * @private
   */
  set _children(_children: string) {
    throw new Scorm12ValidationError(scorm12_errors.INVALID_SET_VALUE);
  }

  /**
   * Getter for _master_score
   * @return {string}
   */
  get mastery_score(): string {
    return this._mastery_score;
  }

  /**
   * Setter for _master_score. Can only be called before  initialization.
   * @param {string} mastery_score
   */
  set mastery_score(mastery_score: string) {
    if (this.initialized) {
      throw new Scorm12ValidationError(scorm12_errors.READ_ONLY_ELEMENT);
    } else {
      this._mastery_score = mastery_score;
    }
  }

  /**
   * Getter for _max_time_allowed
   * @return {string}
   */
  get max_time_allowed(): string {
    return this._max_time_allowed;
  }

  /**
   * Setter for _max_time_allowed. Can only be called before  initialization.
   * @param {string} max_time_allowed
   */
  set max_time_allowed(max_time_allowed: string) {
    if (this.initialized) {
      throw new Scorm12ValidationError(scorm12_errors.READ_ONLY_ELEMENT);
    } else {
      this._max_time_allowed = max_time_allowed;
    }
  }

  /**
   * Getter for _time_limit_action
   * @return {string}
   */
  get time_limit_action(): string {
    return this._time_limit_action;
  }

  /**
   * Setter for _time_limit_action. Can only be called before  initialization.
   * @param {string} time_limit_action
   */
  set time_limit_action(time_limit_action: string) {
    if (this.initialized) {
      throw new Scorm12ValidationError(scorm12_errors.READ_ONLY_ELEMENT);
    } else {
      this._time_limit_action = time_limit_action;
    }
  }

  /**
   * toJSON for cmi.student_data
   *
   * @return {
   *    {
   *      max_time_allowed: string,
   *      time_limit_action: string,
   *      mastery_score: string
   *    }
   *  }
   */
  toJSON(): {
    mastery_score: string;
    max_time_allowed: string;
    time_limit_action: string;
  } {
    this.jsonString = true;
    const result = {
      mastery_score: this.mastery_score,
      max_time_allowed: this.max_time_allowed,
      time_limit_action: this.time_limit_action,
    };
    delete this.jsonString;
    return result;
  }
}
