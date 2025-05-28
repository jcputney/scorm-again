import { BaseCMI } from "../common/base_cmi";
import { CMIScore } from "../common/score";
import { scorm12_constants } from "../../constants/api_constants";
import { scorm12_regex } from "../../constants/regex";
import { scorm12_errors } from "../../constants/error_codes";
import { Scorm12ValidationError } from "../../exceptions/scorm12_exceptions";
import { check12ValidFormat } from "../scorm12/validation";
import * as Util from "../../utilities";

/**
 * Class representing the `cmi.core` object
 * @extends BaseCMI
 */
export class CMICore extends BaseCMI {
  /**
   * Constructor for `cmi.core`
   */
  constructor() {
    super();
    this.score = new CMIScore({
      score_children: scorm12_constants.score_children,
      score_range: scorm12_regex.score_range,
      invalidErrorCode: scorm12_errors.INVALID_SET_VALUE as number,
      invalidTypeCode: scorm12_errors.TYPE_MISMATCH as number,
      invalidRangeCode: scorm12_errors.VALUE_OUT_OF_RANGE as number,
      errorClass: Scorm12ValidationError,
    });
  }

  public readonly score: CMIScore;

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  override initialize() {
    super.initialize();
    this.score?.initialize();
  }

  private __children = scorm12_constants.core_children;
  private _student_id = "";
  private _student_name = "";
  private _lesson_location = "";
  private _credit = "";
  private _lesson_status = "not attempted";
  private _entry = "";
  private _total_time = "";
  private _lesson_mode = "normal";
  private _exit = "";
  private _session_time = "00:00:00";
  private _suspend_data = "";

  /**
   * Called when the API has been reset
   */
  reset(): void {
    this._initialized = false;

    this._exit = "";
    this._entry = "";

    /**
     * Resetting ensures we accurately track the time spent on each individual SCO session independently. Each new
     * session should start from zero, so we can reset cmi.core.session_time at the beginning of each session.
     */
    this._session_time = "00:00:00";

    this.score?.reset();
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
      scorm12_errors.INVALID_SET_VALUE as number,
    );
  }

  /**
   * Getter for _student_id
   * @return {string}
   */
  get student_id(): string {
    return this._student_id;
  }

  /**
   * Setter for _student_id. Can only be called before  initialization.
   * @param {string} student_id
   */
  set student_id(student_id: string) {
    if (this.initialized) {
      throw new Scorm12ValidationError(
        scorm12_errors.READ_ONLY_ELEMENT as number,
      );
    } else {
      this._student_id = student_id;
    }
  }

  /**
   * Getter for _student_name
   * @return {string}
   */
  get student_name(): string {
    return this._student_name;
  }

  /**
   * Setter for _student_name. Can only be called before  initialization.
   * @param {string} student_name
   */
  set student_name(student_name: string) {
    if (this.initialized) {
      throw new Scorm12ValidationError(
        scorm12_errors.READ_ONLY_ELEMENT as number,
      );
    } else {
      this._student_name = student_name;
    }
  }

  /**
   * Getter for _lesson_location
   * @return {string}
   */
  get lesson_location(): string {
    return this._lesson_location;
  }

  /**
   * Setter for _lesson_location
   * @param {string} lesson_location
   */
  set lesson_location(lesson_location: string) {
    if (check12ValidFormat(lesson_location, scorm12_regex.CMIString256, true)) {
      this._lesson_location = lesson_location;
    }
  }

  /**
   * Getter for _credit
   * @return {string}
   */
  get credit(): string {
    return this._credit;
  }

  /**
   * Setter for _credit. Can only be called before  initialization.
   * @param {string} credit
   */
  set credit(credit: string) {
    if (this.initialized) {
      throw new Scorm12ValidationError(
        scorm12_errors.READ_ONLY_ELEMENT as number,
      );
    } else {
      this._credit = credit;
    }
  }

  /**
   * Getter for _lesson_status
   * @return {string}
   */
  get lesson_status(): string {
    return this._lesson_status;
  }

  /**
   * Setter for _lesson_status
   * @param {string} lesson_status
   */
  set lesson_status(lesson_status: string) {
    if (this.initialized) {
      if (check12ValidFormat(lesson_status, scorm12_regex.CMIStatus)) {
        this._lesson_status = lesson_status;
      }
    } else {
      if (check12ValidFormat(lesson_status, scorm12_regex.CMIStatus2)) {
        this._lesson_status = lesson_status;
      }
    }
  }

  /**
   * Getter for _entry
   * @return {string}
   */
  get entry(): string {
    return this._entry;
  }

  /**
   * Setter for _entry. Can only be called before  initialization.
   * @param {string} entry
   */
  set entry(entry: string) {
    if (this.initialized) {
      throw new Scorm12ValidationError(
        scorm12_errors.READ_ONLY_ELEMENT as number,
      );
    } else {
      this._entry = entry;
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
   * Setter for _total_time. Can only be called before  initialization.
   * @param {string} total_time
   */
  set total_time(total_time: string) {
    if (this.initialized) {
      throw new Scorm12ValidationError(
        scorm12_errors.READ_ONLY_ELEMENT as number,
      );
    } else {
      this._total_time = total_time;
    }
  }

  /**
   * Getter for _lesson_mode
   * @return {string}
   */
  get lesson_mode(): string {
    return this._lesson_mode;
  }

  /**
   * Setter for _lesson_mode. Can only be called before  initialization.
   * @param {string} lesson_mode
   */
  set lesson_mode(lesson_mode: string) {
    if (this.initialized) {
      throw new Scorm12ValidationError(
        scorm12_errors.READ_ONLY_ELEMENT as number,
      );
    } else {
      this._lesson_mode = lesson_mode;
    }
  }

  /**
   * Getter for _exit. Should only be called during JSON export.
   * @return {string}
   */
  get exit(): string {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(
        scorm12_errors.WRITE_ONLY_ELEMENT as number,
      );
    }
    return this._exit;
  }

  /**
   * Setter for _exit
   * @param {string} exit
   */
  set exit(exit: string) {
    if (check12ValidFormat(exit, scorm12_regex.CMIExit, true)) {
      this._exit = exit;
    }
  }

  /**
   * Getter for _session_time. Should only be called during JSON export.
   * @return {string}
   */
  get session_time(): string {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(
        scorm12_errors.WRITE_ONLY_ELEMENT as number,
      );
    }
    return this._session_time;
  }

  /**
   * Setter for _session_time
   * @param {string} session_time
   */
  set session_time(session_time: string) {
    if (check12ValidFormat(session_time, scorm12_regex.CMITimespan)) {
      this._session_time = session_time;
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
    if (check12ValidFormat(suspend_data, scorm12_regex.CMIString4096, true)) {
      this._suspend_data = suspend_data;
    }
  }

  /**
   * Adds the current session time to the existing total time.
   * @param {number} start_time
   * @return {string}
   */
  getCurrentTotalTime(start_time: number | undefined): string {
    let sessionTime = this._session_time;
    const startTime = start_time;

    if (typeof startTime !== "undefined" && startTime !== null) {
      const seconds = new Date().getTime() - startTime;
      sessionTime = Util.getSecondsAsHHMMSS(seconds / 1000);
    }

    return Util.addHHMMSSTimeStrings(
      this._total_time,
      sessionTime,
      new RegExp(scorm12_regex.CMITimespan),
    );
  }

  /**
   * toJSON for cmi.core
   *
   * @return {
   *    {
   *      student_name: string,
   *      entry: string,
   *      exit: string,
   *      score: CMIScore,
   *      student_id: string,
   *      lesson_mode: string,
   *      lesson_location: string,
   *      lesson_status: string,
   *      credit: string,
   *      session_time: string
   *    }
   *  }
   */
  toJSON(): {
    student_name: string;
    entry: string;
    exit: string;
    score: CMIScore;
    student_id: string;
    lesson_mode: string;
    lesson_location: string;
    lesson_status: string;
    credit: string;
    session_time: string;
  } {
    this.jsonString = true;
    const result = {
      student_id: this.student_id,
      student_name: this.student_name,
      lesson_location: this.lesson_location,
      credit: this.credit,
      lesson_status: this.lesson_status,
      entry: this.entry,
      lesson_mode: this.lesson_mode,
      exit: this.exit,
      session_time: this.session_time,
      score: this.score,
    };
    delete this.jsonString;
    return result;
  }
}
