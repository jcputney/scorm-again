import { BaseCMI } from "../common/base_cmi";
import { scorm12_constants } from "../../constants/api_constants";
import { Scorm12ValidationError } from "../../exceptions/scorm12_exceptions";
import { scorm12_errors } from "../../constants/error_codes";
import { validationService } from "../../services/ValidationService";
import { check12ValidFormat, check12ValidRange } from "./validation";
import { scorm12_regex, scorm2004_regex } from "../../constants/regex";
import * as Util from "../../utilities";

/**
 * Parses time values in either SCORM 1.2 (HH:MM:SS) or ISO 8601 (PT...) format
 * and converts them to normalized SCORM 1.2 format.
 *
 * @param {string} value - The time value to parse
 * @param {string} fieldName - The CMI element name for error messages
 * @returns {string} Normalized time in HH:MM:SS format
 * @throws {Scorm12ValidationError} If value doesn't match either format
 */
function parseTimeAllowed(value: string, fieldName: string): string {
  // @spec RTE 3.4.2.2.3 - cmi.student_data.max_time_allowed
  // Spec requires CMITimespan format (HH:MM:SS.cc), but some LMS implementations
  // use ISO 8601 durations in manifests. We support both for interoperability.

  // First try SCORM 1.2 HH:MM:SS(.cc) format
  try {
    check12ValidFormat(fieldName, value, scorm12_regex.CMITimespan, true);
    const totalSeconds = Util.getTimeAsSeconds(value, scorm12_regex.CMITimespan);
    return Util.getSecondsAsHHMMSS(totalSeconds);
  } catch (e) {
    // fall through and attempt other encodings
  }

  // Next try ISO 8601 durations (common in legacy manifests)
  try {
    check12ValidFormat(fieldName, value, scorm2004_regex.CMITimespan, true);
    const totalSeconds = Util.getDurationAsSeconds(value, scorm2004_regex.CMITimespan);
    return Util.getSecondsAsHHMMSS(totalSeconds);
  } catch (e) {
    // fall through to error
  }

  throw new Scorm12ValidationError(fieldName, scorm12_errors.TYPE_MISMATCH as number);
}

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
    super("cmi.student_data");
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
    throw new Scorm12ValidationError(
      this._cmi_element + "._children",
      scorm12_errors.INVALID_SET_VALUE as number,
    );
  }

  /**
   * Getter for _mastery_score
   * @return {string}
   */
  get mastery_score(): string {
    return this._mastery_score;
  }

  /**
   * Setter for _mastery_score. Can only be called before initialization.
   * @param {string} mastery_score
   */
  set mastery_score(mastery_score: string) {
    validationService.validateReadOnly(this._cmi_element + ".mastery_score", this.initialized);
    if (mastery_score === undefined || mastery_score === null) {
      return;
    }

    let normalizedMasteryScore = mastery_score;
    if (typeof normalizedMasteryScore !== "string") {
      normalizedMasteryScore = String(normalizedMasteryScore);
    }

    if (normalizedMasteryScore === "") {
      this._mastery_score = mastery_score;
      return;
    }

    if (
      check12ValidFormat(
        this._cmi_element + ".mastery_score",
        normalizedMasteryScore,
        scorm12_regex.CMIDecimal,
      ) &&
      check12ValidRange(
        this._cmi_element + ".mastery_score",
        normalizedMasteryScore,
        scorm12_regex.score_range,
      )
    ) {
      this._mastery_score = normalizedMasteryScore;
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
   * Setter for _max_time_allowed. Can only be called before initialization.
   * @param {string} max_time_allowed
   */
  set max_time_allowed(max_time_allowed: string) {
    validationService.validateReadOnly(this._cmi_element + ".max_time_allowed", this.initialized);
    if (max_time_allowed === undefined || max_time_allowed === null) {
      return;
    }

    const normalizedValue =
      typeof max_time_allowed === "string" ? max_time_allowed : String(max_time_allowed);

    if (normalizedValue === "") {
      this._max_time_allowed = "";
      return;
    }

    this._max_time_allowed = parseTimeAllowed(
      normalizedValue,
      this._cmi_element + ".max_time_allowed",
    );
  }

  /**
   * Getter for _time_limit_action
   * @return {string}
   */
  get time_limit_action(): string {
    return this._time_limit_action;
  }

  /**
   * Setter for _time_limit_action. Can only be called before initialization.
   * @param {string} time_limit_action
   */
  set time_limit_action(time_limit_action: string) {
    validationService.validateReadOnly(this._cmi_element + ".time_limit_action", this.initialized);
    if (time_limit_action === undefined || time_limit_action === null) {
      return;
    }

    const normalizedValue =
      typeof time_limit_action === "string" ? time_limit_action : String(time_limit_action);

    if (
      check12ValidFormat(
        this._cmi_element + ".time_limit_action",
        normalizedValue,
        scorm12_regex.CMITimeLimitAction,
        true,
      )
    ) {
      this._time_limit_action = normalizedValue;
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
    this.jsonString = false;
    return result;
  }
}
