import { scorm12_constants } from "../../constants/api_constants";
import { scorm12_errors } from "../../constants/error_codes";
import { scorm12_regex } from "../../constants/regex";
import { Scorm12ValidationError } from "../../exceptions/scorm12_exceptions";
import { BaseRootCMI } from "../common/base_cmi";
import { check12ValidFormat } from "./validation";
import { CMICore } from "../aicc/core";
import { CMIObjectives } from "./objectives";
import { CMIStudentData } from "./student_data";
import { CMIStudentPreference } from "./student_preference";
import { CMIInteractions } from "./interactions";

/**
 * Class representing the cmi object for SCORM 1.2
 */
export class CMI extends BaseRootCMI {
  private readonly __children: string = "";
  private __version: string = "3.4";
  private _launch_data: string = "";
  private _comments: string = "";
  private _comments_from_lms: string = "";

  /**
   * Constructor for the SCORM 1.2 cmi object
   * @param {string} cmi_children
   * @param {(CMIStudentData|AICCCMIStudentData)} student_data
   * @param {boolean} initialized
   */
  constructor(
    cmi_children?: string,
    student_data?: CMIStudentData,
    initialized?: boolean,
  ) {
    super();
    if (initialized) this.initialize();
    this.__children = cmi_children
      ? cmi_children
      : scorm12_constants.cmi_children;
    this.core = new CMICore();
    this.objectives = new CMIObjectives();
    this.student_data = student_data ? student_data : new CMIStudentData();
    this.student_preference = new CMIStudentPreference();
    this.interactions = new CMIInteractions();
  }

  public core: CMICore;
  public objectives: CMIObjectives;
  public student_data: CMIStudentData;
  public student_preference: CMIStudentPreference;
  public interactions: CMIInteractions;

  /**
   * Called when the API has been reset
   */
  reset(): void {
    this._initialized = false;

    this._launch_data = "";
    this._comments = "";
    this.core?.reset();
    this.objectives = new CMIObjectives();
    this.interactions = new CMIInteractions();
    this.student_data?.reset();
    this.student_preference?.reset();
  }

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  override initialize() {
    super.initialize();
    this.core?.initialize();
    this.objectives?.initialize();
    this.student_data?.initialize();
    this.student_preference?.initialize();
    this.interactions?.initialize();
  }

  /**
   * toJSON for cmi
   *
   * @return {
   *    {
   *      suspend_data: string,
   *      launch_data: string,
   *      comments: string,
   *      comments_from_lms: string,
   *      core: CMICore,
   *      objectives: CMIObjectives,
   *      student_data: CMIStudentData,
   *      student_preference: CMIStudentPreference,
   *      interactions: CMIInteractions
   *    }
   *  }
   */
  toJSON(): {
    suspend_data: string;
    launch_data: string;
    comments: string;
    comments_from_lms: string;
    core: CMICore;
    objectives: CMIObjectives;
    student_data: CMIStudentData;
    student_preference: CMIStudentPreference;
    interactions: CMIInteractions;
  } {
    this.jsonString = true;
    const result = {
      suspend_data: this.suspend_data,
      launch_data: this.launch_data,
      comments: this.comments,
      comments_from_lms: this.comments_from_lms,
      core: this.core,
      objectives: this.objectives,
      student_data: this.student_data,
      student_preference: this.student_preference,
      interactions: this.interactions,
    };
    delete this.jsonString;
    return result;
  }

  /**
   * Getter for __version
   * @return {string}
   */
  get _version(): string {
    return this.__version;
  }

  /**
   * Setter for __version. Just throws an error.
   * @param {string} _version
   */
  set _version(_version: string) {
    throw new Scorm12ValidationError(
      scorm12_errors.INVALID_SET_VALUE as number,
    );
  }

  /**
   * Getter for __children
   * @return {string}
   */
  get _children(): string {
    return this.__children;
  }

  /**
   * Setter for __version. Just throws an error.
   * @param {string} _children
   */
  set _children(_children: string) {
    throw new Scorm12ValidationError(
      scorm12_errors.INVALID_SET_VALUE as number,
    );
  }

  /**
   * Getter for _suspend_data
   * @return {string}
   */
  get suspend_data(): string {
    return this.core?.suspend_data;
  }

  /**
   * Setter for _suspend_data
   * @param {string} suspend_data
   */
  set suspend_data(suspend_data: string) {
    if (this.core) {
      this.core.suspend_data = suspend_data;
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
   * Setter for _launch_data. Can only be called before  initialization.
   * @param {string} launch_data
   */
  set launch_data(launch_data: string) {
    if (this.initialized) {
      throw new Scorm12ValidationError(
        scorm12_errors.READ_ONLY_ELEMENT as number,
      );
    } else {
      this._launch_data = launch_data;
    }
  }

  /**
   * Getter for _comments
   * @return {string}
   */
  get comments(): string {
    return this._comments;
  }

  /**
   * Setter for _comments
   * @param {string} comments
   */
  set comments(comments: string) {
    if (check12ValidFormat(comments, scorm12_regex.CMIString4096, true)) {
      this._comments = comments;
    }
  }

  /**
   * Getter for _comments_from_lms
   * @return {string}
   */
  get comments_from_lms(): string {
    return this._comments_from_lms;
  }

  /**
   * Setter for _comments_from_lms. Can only be called before  initialization.
   * @param {string} comments_from_lms
   */
  set comments_from_lms(comments_from_lms: string) {
    if (this.initialized) {
      throw new Scorm12ValidationError(
        scorm12_errors.READ_ONLY_ELEMENT as number,
      );
    } else {
      this._comments_from_lms = comments_from_lms;
    }
  }

  /**
   * Adds the current session time to the existing total time.
   *
   * @return {string}
   */
  getCurrentTotalTime(): string {
    return this.core.getCurrentTotalTime(this.start_time);
  }
}
