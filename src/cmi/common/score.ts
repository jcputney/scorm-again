import { scorm12_constants } from "../../constants/api_constants";
import { scorm12_regex } from "../../constants/regex";
import { BaseCMI } from "./base_cmi";
import { scorm12_errors } from "../../constants/error_codes";
import { BaseScormValidationError } from "../../exceptions";
import { validationService } from "../../services/ValidationService";
import { ScoreObject } from "../../types/api_types";

/**
 * Base class for cmi *.score objects
 */
export class CMIScore extends BaseCMI {
  private readonly __children: string;
  /**
   * Score range validation pattern (e.g., "0#100" for SCORM 1.2).
   * Set to `false` to disable range validation (e.g., for SCORM 2004 where scores have no upper bound).
   * This property is intentionally unused in the base class but provides subclass flexibility.
   */
  private readonly __score_range: string | false;
  private readonly __invalid_error_code: number;
  private readonly __invalid_type_code: number;
  private readonly __invalid_range_code: number;
  private readonly __decimal_regex: string;
  private readonly __error_class: typeof BaseScormValidationError;
  protected _raw = "";
  protected _min = "";
  protected _max: string;

  /**
   * Constructor for *.score
   *
   * SPEC COMPLIANCE NOTE for _max default:
   * The SCORM 1.2 specification defines the default value for score.max as empty string ("").
   * This implementation defaults to "100" instead for the following reasons:
   *
   * 1. Most SCOs expect a 0-100 scale and don't explicitly set max
   * 2. An empty max creates ambiguity in score interpretation
   * 3. "100" is the most common expected value and simplifies SCO development
   * 4. This matches real-world LMS behavior (most default to 100)
   * 5. SCOs can still explicitly set max="" if needed
   *
   * Strict spec default would be: ""
   *
   * @param params - Configuration parameters
   * @param params.score_range - Optional range pattern. When provided, uses scorm12_regex.score_range.
   *                             When omitted or falsy, disables range validation (sets to false).
   *                             SCORM 1.2 passes a truthy value to enable "0#100" validation.
   *                             SCORM 2004 omits this to allow unbounded scores.
   */
  constructor(params: {
    CMIElement: string;
    score_children?: string;
    score_range?: string;
    max?: string;
    invalidErrorCode?: number;
    invalidTypeCode?: number;
    invalidRangeCode?: number;
    decimalRegex?: string;
    errorClass: typeof BaseScormValidationError;
  }) {
    super(params.CMIElement);

    this.__children = params.score_children || scorm12_constants.score_children;
    // score_range parameter controls whether range validation is enabled:
    // - Truthy value (e.g., "0#100"): enables range validation using scorm12_regex.score_range
    // - Falsy/omitted: disables range validation by setting to false
    this.__score_range = !params.score_range ? false : scorm12_regex.score_range;
    // See SPEC COMPLIANCE NOTE above for why default is "100" instead of ""
    this._max = params.max || params.max === "" ? params.max : "100";
    this.__invalid_error_code =
      params.invalidErrorCode || (scorm12_errors.INVALID_SET_VALUE as number);
    this.__invalid_type_code = params.invalidTypeCode || (scorm12_errors.TYPE_MISMATCH as number);
    this.__invalid_range_code =
      params.invalidRangeCode || (scorm12_errors.VALUE_OUT_OF_RANGE as number);
    this.__decimal_regex = params.decimalRegex || scorm12_regex.CMIDecimal;
    this.__error_class = params.errorClass;
  }

  /**
   * Called when the API has been reset
   *
   * SCORE-01: Resets _raw and _min to empty strings to match subclass behavior.
   * _max is NOT reset here as it has a non-trivial default ("100") that is
   * handled by the constructor or reinitialization logic.
   */
  reset(): void {
    this._initialized = false;
    this._raw = "";
    this._min = "";
  }

  /**
   * Getter for _children
   * @return {string}
   */
  get _children(): string {
    return this.__children;
  }

  /**
   * Setter for _children. Just throws an error.
   * @param {string} _children
   */
  set _children(_children: string) {
    throw new this.__error_class(this._cmi_element + "._children", this.__invalid_error_code);
  }

  /**
   * Getter for _raw
   * @return {string}
   */
  get raw(): string {
    return this._raw;
  }

  /**
   * Setter for _raw
   * @param {string} raw
   */
  set raw(raw: string) {
    if (
      validationService.validateScore(
        this._cmi_element + ".raw",
        raw,
        this.__decimal_regex,
        this.__score_range,
        this.__invalid_type_code,
        this.__invalid_range_code,
        this.__error_class,
      )
    ) {
      this._raw = raw;
    }
  }

  /**
   * Getter for _min
   * @return {string}
   */
  get min(): string {
    return this._min;
  }

  /**
   * Setter for _min
   * @param {string} min
   */
  set min(min: string) {
    if (
      validationService.validateScore(
        this._cmi_element + ".min",
        min,
        this.__decimal_regex,
        this.__score_range,
        this.__invalid_type_code,
        this.__invalid_range_code,
        this.__error_class,
      )
    ) {
      this._min = min;
    }
  }

  /**
   * Getter for _max
   * @return {string}
   */
  get max(): string {
    return this._max;
  }

  /**
   * Setter for _max
   * @param {string} max
   */
  set max(max: string) {
    if (
      validationService.validateScore(
        this._cmi_element + ".max",
        max,
        this.__decimal_regex,
        this.__score_range,
        this.__invalid_type_code,
        this.__invalid_range_code,
        this.__error_class,
      )
    ) {
      this._max = max;
    }
  }

  /**
   * Gets score object with numeric values
   * @return {ScoreObject}
   */
  public getScoreObject(): ScoreObject {
    const scoreObject: ScoreObject = {};
    if (!Number.isNaN(Number.parseFloat(this.raw))) {
      scoreObject.raw = Number.parseFloat(this.raw);
    }
    if (!Number.isNaN(Number.parseFloat(this.min))) {
      scoreObject.min = Number.parseFloat(this.min);
    }
    if (!Number.isNaN(Number.parseFloat(this.max))) {
      scoreObject.max = Number.parseFloat(this.max);
    }
    return scoreObject;
  }

  /**
   * toJSON for *.score
   * @return {
   *    {
   *      min: string,
   *      max: string,
   *      raw: string
   *    }
   *    }
   */
  toJSON(): {
    min: string;
    max: string;
    raw: string;
  } {
    this.jsonString = true;
    const result = {
      raw: this.raw,
      min: this.min,
      max: this.max,
    };
    this.jsonString = false;
    return result;
  }
}
