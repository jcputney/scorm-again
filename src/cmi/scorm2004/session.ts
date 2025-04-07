/**
 * Class representing session properties for SCORM 2004's cmi object
 */
import { scorm2004_regex } from "../../constants/regex";
import { scorm2004_errors } from "../../constants/error_codes";
import { Scorm2004ValidationError } from "../../exceptions/scorm2004_exceptions";
import { BaseCMI } from "../common/base_cmi";
import { check2004ValidFormat } from "./validation";
import * as Util from "../../utilities";

/**
 * Class representing session properties for SCORM 2004's cmi object
 */
export class CMISession extends BaseCMI {
  private _entry = "";
  private _exit = "";
  private _session_time = "PT0H0M0S";
  private _total_time = "";

  /**
   * Constructor for CMISession
   */
  constructor() {
    super("cmi");
  }

  /**
   * Getter for _entry
   * @return {string}
   */
  get entry(): string {
    return this._entry;
  }

  /**
   * Setter for _entry. Can only be called before initialization.
   * @param {string} entry
   */
  set entry(entry: string) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".entry",
        scorm2004_errors.READ_ONLY_ELEMENT,
      );
    } else {
      this._entry = entry;
    }
  }

  /**
   * Getter for _exit. Should only be called during JSON export.
   * @return {string}
   */
  get exit(): string {
    if (!this.jsonString) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".exit",
        scorm2004_errors.WRITE_ONLY_ELEMENT,
      );
    }
    return this._exit;
  }

  /**
   * Setter for _exit
   * @param {string} exit
   */
  set exit(exit: string) {
    if (check2004ValidFormat(this._cmi_element + ".exit", exit, scorm2004_regex.CMIExit, true)) {
      this._exit = exit;
    }
  }

  /**
   * Getter for _session_time. Should only be called during JSON export.
   * @return {string}
   */
  get session_time(): string {
    if (!this.jsonString) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".session_time",
        scorm2004_errors.WRITE_ONLY_ELEMENT,
      );
    }
    return this._session_time;
  }

  /**
   * Setter for _session_time
   * @param {string} session_time
   */
  set session_time(session_time: string) {
    if (
      check2004ValidFormat(
        this._cmi_element + ".session_time",
        session_time,
        scorm2004_regex.CMITimespan,
      )
    ) {
      this._session_time = session_time;
    }
  }

  /**
   * Getter for _total_time
   * @return {string}
   */
  get total_time(): string {
    return this._total_time;
  }

  /**
   * Setter for _total_time. Can only be called before initialization.
   * @param {string} total_time
   */
  set total_time(total_time: string) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".total_time",
        scorm2004_errors.READ_ONLY_ELEMENT,
      );
    } else {
      this._total_time = total_time;
    }
  }

  /**
   * Adds the current session time to the existing total time.
   *
   * @return {string} ISO8601 Duration
   */
  getCurrentTotalTime(): string {
    let sessionTime = this._session_time;
    const startTime = this.start_time;

    if (typeof startTime !== "undefined" && startTime !== null) {
      const seconds = new Date().getTime() - startTime;
      sessionTime = Util.getSecondsAsISODuration(seconds / 1000);
    }

    return Util.addTwoDurations(this._total_time, sessionTime, scorm2004_regex.CMITimespan);
  }

  /**
   * Reset the session properties
   */
  reset(): void {
    this._initialized = false;
    this._entry = "";
    this._exit = "";
    this._session_time = "PT0H0M0S";
    // Don't reset total_time as it's read-only after initialization
  }
}
