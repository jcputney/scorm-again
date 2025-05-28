/**
 * Class representing threshold properties for SCORM 2004's cmi object
 */
import { scorm2004_errors } from "../../constants/error_codes";
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
    } else {
      this._scaled_passing_score = scaled_passing_score;
    }
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
    } else {
      this._completion_threshold = completion_threshold;
    }
  }

  /**
   * Reset the threshold properties
   */
  reset(): void {
    this._initialized = false;
    // Don't reset these properties as they are read-only after initialization
  }
}
