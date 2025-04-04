/**
 * Class representing status properties for SCORM 2004's cmi object
 */
import { scorm2004_regex } from "../../constants/regex";
import { BaseCMI } from "../common/base_cmi";
import { check2004ValidFormat, check2004ValidRange } from "./validation";

/**
 * Class representing status properties for SCORM 2004's cmi object
 */
export class CMIStatus extends BaseCMI {
  private _completion_status = "unknown";
  private _success_status = "unknown";
  private _progress_measure = "";

  /**
   * Constructor for CMIStatus
   */
  constructor() {
    super("cmi");
  }

  /**
   * Getter for _completion_status
   * @return {string}
   */
  get completion_status(): string {
    return this._completion_status;
  }

  /**
   * Setter for _completion_status
   * @param {string} completion_status
   */
  set completion_status(completion_status: string) {
    if (
      check2004ValidFormat(
        this._cmi_element + ".completion_status",
        completion_status,
        scorm2004_regex.CMICStatus,
      )
    ) {
      this._completion_status = completion_status;
    }
  }

  /**
   * Getter for _success_status
   * @return {string}
   */
  get success_status(): string {
    return this._success_status;
  }

  /**
   * Setter for _success_status
   * @param {string} success_status
   */
  set success_status(success_status: string) {
    if (
      check2004ValidFormat(
        this._cmi_element + ".success_status",
        success_status,
        scorm2004_regex.CMISStatus,
      )
    ) {
      this._success_status = success_status;
    }
  }

  /**
   * Getter for _progress_measure
   * @return {string}
   */
  get progress_measure(): string {
    return this._progress_measure;
  }

  /**
   * Setter for _progress_measure
   * @param {string} progress_measure
   */
  set progress_measure(progress_measure: string) {
    if (
      check2004ValidFormat(
        this._cmi_element + ".progress_measure",
        progress_measure,
        scorm2004_regex.CMIDecimal,
      ) &&
      check2004ValidRange(
        this._cmi_element + ".progress_measure",
        progress_measure,
        scorm2004_regex.progress_range,
      )
    ) {
      this._progress_measure = progress_measure;
    }
  }

  /**
   * Reset the status properties
   */
  reset(): void {
    this._initialized = false;
    this._completion_status = "unknown";
    this._success_status = "unknown";
    this._progress_measure = "";
  }
}
