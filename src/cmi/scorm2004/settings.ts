/**
 * Class representing settings properties for SCORM 2004's cmi object
 */
import { scorm2004_errors } from "../../constants/error_codes";
import { scorm2004_regex } from "../../constants/regex";
import { Scorm2004ValidationError } from "../../exceptions/scorm2004_exceptions";
import { BaseCMI } from "../common/base_cmi";

/**
 * Class representing settings properties for SCORM 2004's cmi object
 */
export class CMISettings extends BaseCMI {
  private _credit = "credit";
  private _mode = "normal";
  private _time_limit_action = "continue,no message";
  private _max_time_allowed = "";

  /**
   * Constructor for CMISettings
   */
  constructor() {
    super("cmi");
  }

  /**
   * Getter for _credit
   * @return {string}
   */
  get credit(): string {
    return this._credit;
  }

  /**
   * Setter for _credit. Can only be called before initialization.
   * @param {string} credit
   */
  set credit(credit: string) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".credit",
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    }
    if (!/^(credit|no-credit)$/.test(credit)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".credit",
        scorm2004_errors.TYPE_MISMATCH as number,
      );
    }
    this._credit = credit;
  }

  /**
   * Getter for _mode
   * @return {string}
   */
  get mode(): string {
    return this._mode;
  }

  /**
   * Setter for _mode. Can only be called before initialization.
   * @param {string} mode
   */
  set mode(mode: string) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".mode",
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    }
    if (!/^(browse|normal|review)$/.test(mode)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".mode",
        scorm2004_errors.TYPE_MISMATCH as number,
      );
    }
    this._mode = mode;
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
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".time_limit_action",
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    }
    if (!/^(exit,message|exit,no message|continue,message|continue,no message)$/.test(time_limit_action)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".time_limit_action",
        scorm2004_errors.TYPE_MISMATCH as number,
      );
    }
    this._time_limit_action = time_limit_action;
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
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".max_time_allowed",
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    }

    // Allow empty string (undefined value)
    if (max_time_allowed === "") {
      this._max_time_allowed = max_time_allowed;
      return;
    }

    // Validate format using CMITimespan regex (ISO 8601 duration)
    const regex = new RegExp(scorm2004_regex.CMITimespan);
    if (!regex.test(max_time_allowed)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".max_time_allowed",
        scorm2004_errors.TYPE_MISMATCH as number,
      );
    }

    this._max_time_allowed = max_time_allowed;
  }

  /**
   * Reset the settings properties
   */
  reset(): void {
    this._initialized = false;
    // Don't reset these properties as they are read-only after initialization
  }
}
