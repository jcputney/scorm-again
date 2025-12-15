/**
 * Class representing threshold properties for SCORM 2004's cmi object
 */
import { scorm2004_errors } from "../../constants/error_codes";
import { scorm2004_regex } from "../../constants/regex";
import { Scorm2004ValidationError } from "../../exceptions/scorm2004_exceptions";
import { BaseCMI } from "../common/base_cmi";

/**
 * Class representing threshold properties for SCORM 2004's cmi object
 */
export class CMIThresholds extends BaseCMI {
  private _scaled_passing_score = "";
  private _completion_threshold = "";

  /**
   * Constructor for CMIThresholds
   */
  constructor() {
    super("cmi");
  }

  /**
   * Getter for _scaled_passing_score
   * @return {string}
   */
  get scaled_passing_score(): string {
    return this._scaled_passing_score;
  }

  /**
   * Setter for _scaled_passing_score. Can only be called before initialization.
   * @param {string} scaled_passing_score
   */
  set scaled_passing_score(scaled_passing_score: string) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".scaled_passing_score",
        scorm2004_errors.READ_ONLY_ELEMENT ?? 404,
      );
    }

    // Allow empty string (undefined value)
    if (scaled_passing_score === "") {
      this._scaled_passing_score = scaled_passing_score;
      return;
    }

    // Validate format using CMIDecimal regex
    const regex = new RegExp(scorm2004_regex.CMIDecimal);
    if (!regex.test(scaled_passing_score)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".scaled_passing_score",
        scorm2004_errors.TYPE_MISMATCH ?? 406,
      );
    }

    // Validate range: -1 to 1
    const num = parseFloat(scaled_passing_score);
    if (num < -1 || num > 1) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".scaled_passing_score",
        scorm2004_errors.VALUE_OUT_OF_RANGE ?? 407,
      );
    }

    this._scaled_passing_score = scaled_passing_score;
  }

  /**
   * Getter for _completion_threshold
   * @return {string}
   */
  get completion_threshold(): string {
    return this._completion_threshold;
  }

  /**
   * Setter for _completion_threshold. Can only be called before initialization.
   * @param {string} completion_threshold
   */
  set completion_threshold(completion_threshold: string) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".completion_threshold",
        scorm2004_errors.READ_ONLY_ELEMENT ?? 404,
      );
    }

    // Allow empty string (undefined value)
    if (completion_threshold === "") {
      this._completion_threshold = completion_threshold;
      return;
    }

    // Validate format using CMIDecimal regex
    const regex = new RegExp(scorm2004_regex.CMIDecimal);
    if (!regex.test(completion_threshold)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".completion_threshold",
        scorm2004_errors.TYPE_MISMATCH ?? 406,
      );
    }

    // Validate range: 0 to 1
    const num = parseFloat(completion_threshold);
    if (num < 0 || num > 1) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".completion_threshold",
        scorm2004_errors.VALUE_OUT_OF_RANGE ?? 407,
      );
    }

    this._completion_threshold = completion_threshold;
  }

  /**
   * Reset the threshold properties
   */
  reset(): void {
    this._initialized = false;
    // Don't reset these properties as they are read-only after initialization
  }
}
