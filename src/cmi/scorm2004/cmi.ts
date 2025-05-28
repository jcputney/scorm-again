import { scorm2004_constants } from "../../constants/api_constants";
import { scorm2004_regex } from "../../constants/regex";
import { scorm2004_errors } from "../../constants/error_codes";
import { Scorm2004ValidationError } from "../../exceptions/scorm2004_exceptions";
import * as Util from "../../utilities";
import { BaseRootCMI } from "../common/base_cmi";
import { check2004ValidFormat, check2004ValidRange } from "./validation";
import { CMILearnerPreference } from "./learner_preference";
import { CMIInteractions } from "./interactions";
import { Scorm2004CMIScore } from "./score";
import { CMICommentsFromLearner, CMICommentsFromLMS } from "./comments";
import { CMIObjectives } from "./objectives";

/**
 * Class representing cmi object for SCORM 2004
 */
export class CMI extends BaseRootCMI {
  /**
   * Constructor for the SCORM 2004 cmi object
   * @param {boolean} initialized
   */
  constructor(initialized: boolean = false) {
    super();
    this.learner_preference = new CMILearnerPreference();
    this.score = new Scorm2004CMIScore();
    this.comments_from_learner = new CMICommentsFromLearner();
    this.comments_from_lms = new CMICommentsFromLMS();
    this.interactions = new CMIInteractions();
    this.objectives = new CMIObjectives();
    if (initialized) this.initialize();
  }

  public learner_preference: CMILearnerPreference;
  public score: Scorm2004CMIScore;
  public comments_from_learner: CMICommentsFromLearner;
  public comments_from_lms: CMICommentsFromLMS;
  public interactions: CMIInteractions;
  public objectives: CMIObjectives;

  private __version = "1.0";
  private __children = scorm2004_constants.cmi_children;
  private _completion_status = "unknown";
  private _completion_threshold = "";
  private _credit = "credit";
  private _entry = "";
  private _exit = "";
  private _launch_data = "";
  private _learner_id = "";
  private _learner_name = "";
  private _location = "";
  private _max_time_allowed = "";
  private _mode = "normal";
  private _progress_measure = "";
  private _scaled_passing_score = "";
  private _session_time = "PT0H0M0S";
  private _success_status = "unknown";
  private _suspend_data = "";
  private _time_limit_action = "continue,no message";
  private _total_time = "";

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  override initialize() {
    super.initialize();
    this.learner_preference?.initialize();
    this.score?.initialize();
    this.comments_from_learner?.initialize();
    this.comments_from_lms?.initialize();
    this.interactions?.initialize();
    this.objectives?.initialize();
  }

  /**
   * Called when API is moving to another SCO
   */
  reset() {
    this._initialized = false;

    this._completion_status = "incomplete";
    this._exit = "";
    this._session_time = "PT0H0M0S";
    this._progress_measure = "";
    this._location = "";

    this.objectives?.reset(false);
    this.interactions?.reset(true);

    this.score?.reset();
    this.comments_from_learner?.reset();
    this.comments_from_lms?.reset();
    this.learner_preference?.reset();
  }

  /**
   * Getter for __version
   * @return {string}
   * @private
   */
  get _version(): string {
    return this.__version;
  }

  /**
   * Setter for __version. Just throws an error.
   * @param {string} _version
   * @private
   */
  set _version(_version: string) {
    throw new Scorm2004ValidationError(
      scorm2004_errors.READ_ONLY_ELEMENT as number,
    );
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
   * @param {number} _children
   * @private
   */
  set _children(_children: number) {
    throw new Scorm2004ValidationError(
      scorm2004_errors.READ_ONLY_ELEMENT as number,
    );
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
    if (check2004ValidFormat(completion_status, scorm2004_regex.CMICStatus)) {
      this._completion_status = completion_status;
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
   * Setter for _completion_threshold. Can only be called before  initialization.
   * @param {string} completion_threshold
   */
  set completion_threshold(completion_threshold: string) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    } else {
      this._completion_threshold = completion_threshold;
    }
  }

  /**
   * Setter for _credit
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
      throw new Scorm2004ValidationError(
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    } else {
      this._credit = credit;
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
      throw new Scorm2004ValidationError(
        scorm2004_errors.READ_ONLY_ELEMENT as number,
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
        scorm2004_errors.WRITE_ONLY_ELEMENT as number,
      );
    }
    return this._exit;
  }

  /**
   * Getter for _exit
   * @param {string} exit
   */
  set exit(exit: string) {
    if (check2004ValidFormat(exit, scorm2004_regex.CMIExit, true)) {
      this._exit = exit;
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
      throw new Scorm2004ValidationError(
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    } else {
      this._launch_data = launch_data;
    }
  }

  /**
   * Getter for _learner_id
   * @return {string}
   */
  get learner_id(): string {
    return this._learner_id;
  }

  /**
   * Setter for _learner_id. Can only be called before  initialization.
   * @param {string} learner_id
   */
  set learner_id(learner_id: string) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    } else {
      this._learner_id = learner_id;
    }
  }

  /**
   * Getter for _learner_name
   * @return {string}
   */
  get learner_name(): string {
    return this._learner_name;
  }

  /**
   * Setter for _learner_name. Can only be called before  initialization.
   * @param {string} learner_name
   */
  set learner_name(learner_name: string) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    } else {
      this._learner_name = learner_name;
    }
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
   * Getter for _max_time_allowed
   * @return {string}
   */
  get max_time_allowed(): string {
    return this._max_time_allowed;
  }

  /**
   * Setter for _max_time_allowed. Can only be called before  initialization.
   * @param {string} max_time_allowed
   */
  set max_time_allowed(max_time_allowed: string) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    } else {
      this._max_time_allowed = max_time_allowed;
    }
  }

  /**
   * Getter for _mode
   * @return {string}
   */
  get mode(): string {
    return this._mode;
  }

  /**
   * Setter for _mode. Can only be called before  initialization.
   * @param {string} mode
   */
  set mode(mode: string) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    } else {
      this._mode = mode;
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
      check2004ValidFormat(progress_measure, scorm2004_regex.CMIDecimal) &&
      check2004ValidRange(progress_measure, scorm2004_regex.progress_range)
    ) {
      this._progress_measure = progress_measure;
    }
  }

  /**
   * Getter for _scaled_passing_score
   * @return {string}
   */
  get scaled_passing_score(): string {
    return this._scaled_passing_score;
  }

  /**
   * Setter for _scaled_passing_score. Can only be called before  initialization.
   * @param {string} scaled_passing_score
   */
  set scaled_passing_score(scaled_passing_score: string) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    } else {
      this._scaled_passing_score = scaled_passing_score;
    }
  }

  /**
   * Getter for _session_time. Should only be called during JSON export.
   * @return {string}
   */
  get session_time(): string {
    if (!this.jsonString) {
      throw new Scorm2004ValidationError(
        scorm2004_errors.WRITE_ONLY_ELEMENT as number,
      );
    }
    return this._session_time;
  }

  /**
   * Setter for _session_time
   * @param {string} session_time
   */
  set session_time(session_time: string) {
    if (check2004ValidFormat(session_time, scorm2004_regex.CMITimespan)) {
      this._session_time = session_time;
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
    if (check2004ValidFormat(success_status, scorm2004_regex.CMISStatus)) {
      this._success_status = success_status;
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
   * Getter for _time_limit_action
   * @return {string}
   */
  get time_limit_action(): string {
    return this._time_limit_action;
  }

  /**
   * Setter for _time_limit_action. Can only be called before  initialization.
   * @param {string} time_limit_action
   */
  set time_limit_action(time_limit_action: string) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    } else {
      this._time_limit_action = time_limit_action;
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
      throw new Scorm2004ValidationError(
        scorm2004_errors.READ_ONLY_ELEMENT as number,
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

    return Util.addTwoDurations(
      this._total_time,
      sessionTime,
      scorm2004_regex.CMITimespan,
    );
  }

  /**
   * toJSON for cmi
   *
   * @return {
   *    {
   *      comments_from_learner: CMICommentsFromLearner,
   *      comments_from_lms: CMICommentsFromLMS,
   *      completion_status: string,
   *      completion_threshold: string,
   *      credit: string,
   *      entry: string,
   *      exit: string,
   *      interactions: CMIInteractions,
   *      launch_data: string,
   *      learner_id: string,
   *      learner_name: string,
   *      learner_preference: CMILearnerPreference,
   *      location: string,
   *      max_time_allowed: string,
   *      mode: string,
   *      objectives: CMIObjectives,
   *      progress_measure: string,
   *      scaled_passing_score: string,
   *      score: Scorm2004CMIScore,
   *      session_time: string,
   *      success_status: string,
   *      suspend_data: string,
   *      time_limit_action: string
   *    }
   *  }
   */
  toJSON(): {
    comments_from_learner: CMICommentsFromLearner;
    comments_from_lms: CMICommentsFromLMS;
    completion_status: string;
    completion_threshold: string;
    credit: string;
    entry: string;
    exit: string;
    interactions: CMIInteractions;
    launch_data: string;
    learner_id: string;
    learner_name: string;
    learner_preference: CMILearnerPreference;
    location: string;
    max_time_allowed: string;
    mode: string;
    objectives: CMIObjectives;
    progress_measure: string;
    scaled_passing_score: string;
    score: Scorm2004CMIScore;
    session_time: string;
    success_status: string;
    suspend_data: string;
    time_limit_action: string;
  } {
    this.jsonString = true;
    const result = {
      comments_from_learner: this.comments_from_learner,
      comments_from_lms: this.comments_from_lms,
      completion_status: this.completion_status,
      completion_threshold: this.completion_threshold,
      credit: this.credit,
      entry: this.entry,
      exit: this.exit,
      interactions: this.interactions,
      launch_data: this.launch_data,
      learner_id: this.learner_id,
      learner_name: this.learner_name,
      learner_preference: this.learner_preference,
      location: this.location,
      max_time_allowed: this.max_time_allowed,
      mode: this.mode,
      objectives: this.objectives,
      progress_measure: this.progress_measure,
      scaled_passing_score: this.scaled_passing_score,
      score: this.score,
      session_time: this.session_time,
      success_status: this.success_status,
      suspend_data: this.suspend_data,
      time_limit_action: this.time_limit_action,
    };
    delete this.jsonString;
    return result;
  }
}
