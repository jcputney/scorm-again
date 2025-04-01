/**
 * Class representing content properties for SCORM 2004's cmi object
 */
import { scorm2004_regex } from "../../constants/regex";
import { scorm2004_errors } from "../../constants/error_codes";
import { Scorm2004ValidationError } from "../../exceptions/scorm2004_exceptions";
import { BaseCMI } from "../common/base_cmi";
import { check2004ValidFormat } from "./validation";

/**
 * Class representing content properties for SCORM 2004's cmi object
 */
export class CMIContent extends BaseCMI {
  private _location = "";
  private _launch_data = "";
  private _suspend_data = "";

  /**
   * Constructor for CMIContent
   */
  constructor() {
    super();
  }

  /**
   * Getter for _location
   * @return {string}
   */
  get location(): string {
    return this._location;
  }

  /**
   * Setter for _location
   * @param {string} location
   */
  set location(location: string) {
    if (check2004ValidFormat(location, scorm2004_regex.CMIString1000)) {
      this._location = location;
    }
  }

  /**
   * Getter for _launch_data
   * @return {string}
   */
  get launch_data(): string {
    return this._launch_data;
  }

  /**
   * Setter for _launch_data. Can only be called before initialization.
   * @param {string} launch_data
   */
  set launch_data(launch_data: string) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(scorm2004_errors.READ_ONLY_ELEMENT);
    } else {
      this._launch_data = launch_data;
    }
  }

  /**
   * Getter for _suspend_data
   * @return {string}
   */
  get suspend_data(): string {
    return this._suspend_data;
  }

  /**
   * Setter for _suspend_data
   * @param {string} suspend_data
   */
  set suspend_data(suspend_data: string) {
    if (
      check2004ValidFormat(suspend_data, scorm2004_regex.CMIString64000, true)
    ) {
      this._suspend_data = suspend_data;
    }
  }

  /**
   * Reset the content properties
   */
  reset(): void {
    this._initialized = false;
    this._location = "";
    // Don't reset launch_data as it's read-only after initialization
    this._suspend_data = "";
  }
}