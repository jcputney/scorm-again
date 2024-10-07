import {
  BaseCMI,
  BaseRootCMI,
  checkValidFormat,
  checkValidRange,
  CMIArray,
  CMIScore,
} from "./common";
import APIConstants from "../constants/api_constants";
import Regex from "../constants/regex";
import ErrorCodes from "../constants/error_codes";
import { Scorm2004ValidationError } from "../exceptions";
import * as Util from "../utilities";
import { LearnerResponses } from "../constants/response_constants";

const scorm2004_constants = APIConstants.scorm2004;
const scorm2004_error_codes = ErrorCodes.scorm2004;
const learner_responses = LearnerResponses;
const scorm2004_regex = Regex.scorm2004;

/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {string} value
 * @param {string} regexPattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */
function check2004ValidFormat(
  value: string,
  regexPattern: string,
  allowEmptyString?: boolean,
): boolean {
  return checkValidFormat(
    value,
    regexPattern,
    scorm2004_error_codes.TYPE_MISMATCH,
    Scorm2004ValidationError,
    allowEmptyString,
  );
}

/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {string} value
 * @param {string} rangePattern
 * @return {boolean}
 */
function check2004ValidRange(value: string, rangePattern: string): boolean {
  return checkValidRange(
    value,
    rangePattern,
    scorm2004_error_codes.VALUE_OUT_OF_RANGE,
    Scorm2004ValidationError,
  );
}

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
  initialize() {
    super.initialize();
    this.learner_preference?.initialize();
    this.score?.initialize();
    this.comments_from_learner?.initialize();
    this.comments_from_lms?.initialize();
    this.interactions?.initialize();
    this.objectives?.initialize();
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
    throw new Scorm2004ValidationError(scorm2004_error_codes.READ_ONLY_ELEMENT);
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
    throw new Scorm2004ValidationError(scorm2004_error_codes.READ_ONLY_ELEMENT);
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
        scorm2004_error_codes.READ_ONLY_ELEMENT,
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
        scorm2004_error_codes.READ_ONLY_ELEMENT,
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
        scorm2004_error_codes.READ_ONLY_ELEMENT,
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
        scorm2004_error_codes.WRITE_ONLY_ELEMENT,
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
        scorm2004_error_codes.READ_ONLY_ELEMENT,
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
        scorm2004_error_codes.READ_ONLY_ELEMENT,
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
        scorm2004_error_codes.READ_ONLY_ELEMENT,
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
        scorm2004_error_codes.READ_ONLY_ELEMENT,
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
        scorm2004_error_codes.READ_ONLY_ELEMENT,
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
        scorm2004_error_codes.READ_ONLY_ELEMENT,
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
        scorm2004_error_codes.WRITE_ONLY_ELEMENT,
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
        scorm2004_error_codes.READ_ONLY_ELEMENT,
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
        scorm2004_error_codes.READ_ONLY_ELEMENT,
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

/**
 * Class for SCORM 2004's cmi.learner_preference object
 */

class CMILearnerPreference extends BaseCMI {
  private __children = scorm2004_constants.student_preference_children;
  private _audio_level = "1";
  private _language = "";
  private _delivery_speed = "1";
  private _audio_captioning = "0";

  /**
   * Constructor for cmi.learner_preference
   */
  constructor() {
    super();
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
    throw new Scorm2004ValidationError(scorm2004_error_codes.READ_ONLY_ELEMENT);
  }

  /**
   * Getter for _audio_level
   * @return {string}
   */
  get audio_level(): string {
    return this._audio_level;
  }

  /**
   * Setter for _audio_level
   * @param {string} audio_level
   */
  set audio_level(audio_level: string) {
    if (
      check2004ValidFormat(audio_level, scorm2004_regex.CMIDecimal) &&
      check2004ValidRange(audio_level, scorm2004_regex.audio_range)
    ) {
      this._audio_level = audio_level;
    }
  }

  /**
   * Getter for _language
   * @return {string}
   */
  get language(): string {
    return this._language;
  }

  /**
   * Setter for _language
   * @param {string} language
   */
  set language(language: string) {
    if (check2004ValidFormat(language, scorm2004_regex.CMILang)) {
      this._language = language;
    }
  }

  /**
   * Getter for _delivery_speed
   * @return {string}
   */
  get delivery_speed(): string {
    return this._delivery_speed;
  }

  /**
   * Setter for _delivery_speed
   * @param {string} delivery_speed
   */
  set delivery_speed(delivery_speed: string) {
    if (
      check2004ValidFormat(delivery_speed, scorm2004_regex.CMIDecimal) &&
      check2004ValidRange(delivery_speed, scorm2004_regex.speed_range)
    ) {
      this._delivery_speed = delivery_speed;
    }
  }

  /**
   * Getter for _audio_captioning
   * @return {string}
   */
  get audio_captioning(): string {
    return this._audio_captioning;
  }

  /**
   * Setter for _audio_captioning
   * @param {string} audio_captioning
   */
  set audio_captioning(audio_captioning: string) {
    if (
      check2004ValidFormat(audio_captioning, scorm2004_regex.CMISInteger) &&
      check2004ValidRange(audio_captioning, scorm2004_regex.text_range)
    ) {
      this._audio_captioning = audio_captioning;
    }
  }

  /**
   * toJSON for cmi.learner_preference
   *
   * @return {
   *    {
   *      audio_level: string,
   *      language: string,
   *      delivery_speed: string,
   *      audio_captioning: string
   *    }
   *  }
   */
  toJSON(): {
    audio_level: string;
    language: string;
    delivery_speed: string;
    audio_captioning: string;
  } {
    this.jsonString = true;
    const result = {
      audio_level: this.audio_level,
      language: this.language,
      delivery_speed: this.delivery_speed,
      audio_captioning: this.audio_captioning,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing SCORM 2004's `cmi.interactions` object
 */

class CMIInteractions extends CMIArray {
  /**
   * Constructor for `cmi.objectives` Array
   */
  constructor() {
    super({
      children: scorm2004_constants.interactions_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      errorClass: Scorm2004ValidationError,
    });
  }
}

/**
 * Class representing SCORM 2004's `cmi.objectives` object
 */

class CMIObjectives extends CMIArray {
  /**
   * Constructor for `cmi.objectives` Array
   */
  constructor() {
    super({
      children: scorm2004_constants.objectives_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      errorClass: Scorm2004ValidationError,
    });
  }
}

/**
 * Class representing SCORM 2004's cmi.comments_from_lms object
 */

class CMICommentsFromLMS extends CMIArray {
  /**
   * Constructor for cmi.comments_from_lms Array
   */
  constructor() {
    super({
      children: scorm2004_constants.comments_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      errorClass: Scorm2004ValidationError,
    });
  }
}

/**
 * Class representing SCORM 2004's cmi.comments_from_learner object
 */

class CMICommentsFromLearner extends CMIArray {
  /**
   * Constructor for cmi.comments_from_learner Array
   */
  constructor() {
    super({
      children: scorm2004_constants.comments_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      errorClass: Scorm2004ValidationError,
    });
  }
}

/**
 * Class for SCORM 2004's cmi.interaction.n object
 */

export class CMIInteractionsObject extends BaseCMI {
  private _id = "";
  private _type = "";
  private _timestamp = "";
  private _weighting = "";
  private _learner_response = "";
  private _result = "";
  private _latency = "";
  private _description = "";

  /**
   * Constructor for cmi.interaction.n
   */
  constructor() {
    super();
    this.objectives = new CMIArray({
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      errorClass: Scorm2004ValidationError,
      children: scorm2004_constants.objectives_children,
    });
    this.correct_responses = new CMIArray({
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      errorClass: Scorm2004ValidationError,
      children: scorm2004_constants.correct_responses_children,
    });
  }

  public objectives: CMIArray;
  public correct_responses: CMIArray;

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.objectives?.initialize();
    this.correct_responses?.initialize();
  }

  /**
   * Getter for _id
   * @return {string}
   */
  get id(): string {
    return this._id;
  }

  /**
   * Setter for _id
   * @param {string} id
   */
  set id(id: string) {
    if (check2004ValidFormat(id, scorm2004_regex.CMILongIdentifier)) {
      this._id = id;
    }
  }

  /**
   * Getter for _type
   * @return {string}
   */
  get type(): string {
    return this._type;
  }

  /**
   * Setter for _type
   * @param {string} type
   */
  set type(type: string) {
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      if (check2004ValidFormat(type, scorm2004_regex.CMIType)) {
        this._type = type;
      }
    }
  }

  /**
   * Getter for _timestamp
   * @return {string}
   */
  get timestamp(): string {
    return this._timestamp;
  }

  /**
   * Setter for _timestamp
   * @param {string} timestamp
   */
  set timestamp(timestamp: string) {
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      if (check2004ValidFormat(timestamp, scorm2004_regex.CMITime)) {
        this._timestamp = timestamp;
      }
    }
  }

  /**
   * Getter for _weighting
   * @return {string}
   */
  get weighting(): string {
    return this._weighting;
  }

  /**
   * Setter for _weighting
   * @param {string} weighting
   */
  set weighting(weighting: string) {
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      if (check2004ValidFormat(weighting, scorm2004_regex.CMIDecimal)) {
        this._weighting = weighting;
      }
    }
  }

  /**
   * Getter for _learner_response
   * @return {string}
   */
  get learner_response(): string {
    return this._learner_response;
  }

  /**
   * Setter for _learner_response. Does type validation to make sure response
   * matches SCORM 2004's spec
   * @param {string} learner_response
   */
  set learner_response(learner_response: string) {
    if (this.initialized && (this._type === "" || this._id === "")) {
      throw new Scorm2004ValidationError(
        scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      let nodes = [];
      const response_type = learner_responses[this.type];

      if (response_type) {
        if (response_type?.delimiter) {
          nodes = learner_response.split(response_type.delimiter);
        } else {
          nodes[0] = learner_response;
        }

        if (nodes.length > 0 && nodes.length <= response_type.max) {
          const formatRegex = new RegExp(response_type.format);

          for (let i = 0; i < nodes.length; i++) {
            if (response_type?.delimiter2) {
              const values = nodes[i].split(response_type.delimiter2);

              if (values.length === 2) {
                if (!values[0].match(formatRegex)) {
                  throw new Scorm2004ValidationError(
                    scorm2004_error_codes.TYPE_MISMATCH,
                  );
                } else {
                  if (
                    !response_type.format2 ||
                    !values[1].match(new RegExp(response_type.format2))
                  ) {
                    throw new Scorm2004ValidationError(
                      scorm2004_error_codes.TYPE_MISMATCH,
                    );
                  }
                }
              } else {
                throw new Scorm2004ValidationError(
                  scorm2004_error_codes.TYPE_MISMATCH,
                );
              }
            } else {
              if (!nodes[i].match(formatRegex)) {
                throw new Scorm2004ValidationError(
                  scorm2004_error_codes.TYPE_MISMATCH,
                );
              } else {
                if (nodes[i] !== "" && response_type.unique) {
                  for (let j = 0; j < i; j++) {
                    if (nodes[i] === nodes[j]) {
                      throw new Scorm2004ValidationError(
                        scorm2004_error_codes.TYPE_MISMATCH,
                      );
                    }
                  }
                }
              }
            }
          }
        } else {
          throw new Scorm2004ValidationError(
            scorm2004_error_codes.GENERAL_SET_FAILURE,
          );
        }

        this._learner_response = learner_response;
      } else {
        throw new Scorm2004ValidationError(scorm2004_error_codes.TYPE_MISMATCH);
      }
    }
  }

  /**
   * Getter for _result
   * @return {string}
   */
  get result(): string {
    return this._result;
  }

  /**
   * Setter for _result
   * @param {string} result
   */
  set result(result: string) {
    if (check2004ValidFormat(result, scorm2004_regex.CMIResult)) {
      this._result = result;
    }
  }

  /**
   * Getter for _latency
   * @return {string}
   */
  get latency(): string {
    return this._latency;
  }

  /**
   * Setter for _latency
   * @param {string} latency
   */
  set latency(latency: string) {
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      if (check2004ValidFormat(latency, scorm2004_regex.CMITimespan)) {
        this._latency = latency;
      }
    }
  }

  /**
   * Getter for _description
   * @return {string}
   */
  get description(): string {
    return this._description;
  }

  /**
   * Setter for _description
   * @param {string} description
   */
  set description(description: string) {
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      if (
        check2004ValidFormat(
          description,
          scorm2004_regex.CMILangString250,
          true,
        )
      ) {
        this._description = description;
      }
    }
  }

  /**
   * toJSON for cmi.interactions.n
   *
   * @return {
   *    {
   *      id: string,
   *      type: string,
   *      objectives: CMIArray,
   *      timestamp: string,
   *      correct_responses: CMIArray,
   *      weighting: string,
   *      learner_response: string,
   *      result: string,
   *      latency: string,
   *      description: string
   *    }
   *  }
   */
  toJSON(): {
    id: string;
    type: string;
    objectives: CMIArray;
    timestamp: string;
    correct_responses: CMIArray;
    weighting: string;
    learner_response: string;
    result: string;
    latency: string;
    description: string;
  } {
    this.jsonString = true;
    const result = {
      id: this.id,
      type: this.type,
      objectives: this.objectives,
      timestamp: this.timestamp,
      weighting: this.weighting,
      learner_response: this.learner_response,
      result: this.result,
      latency: this.latency,
      description: this.description,
      correct_responses: this.correct_responses,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class for SCORM 2004's cmi.objectives.n object
 */
export class CMIObjectivesObject extends BaseCMI {
  private _id = "";
  private _success_status = "unknown";
  private _completion_status = "unknown";
  private _progress_measure = "";
  private _description = "";

  /**
   * Constructor for cmi.objectives.n
   */
  constructor() {
    super();
    this.score = new Scorm2004CMIScore();
  }

  public score: Scorm2004CMIScore;

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.score?.initialize();
  }

  /**
   * Getter for _id
   * @return {string}
   */
  get id(): string {
    return this._id;
  }

  /**
   * Setter for _id
   * @param {string} id
   */
  set id(id: string) {
    if (check2004ValidFormat(id, scorm2004_regex.CMILongIdentifier)) {
      this._id = id;
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
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      if (check2004ValidFormat(success_status, scorm2004_regex.CMISStatus)) {
        this._success_status = success_status;
      }
    }
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
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      if (check2004ValidFormat(completion_status, scorm2004_regex.CMICStatus)) {
        this._completion_status = completion_status;
      }
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
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      if (
        check2004ValidFormat(progress_measure, scorm2004_regex.CMIDecimal) &&
        check2004ValidRange(progress_measure, scorm2004_regex.progress_range)
      ) {
        this._progress_measure = progress_measure;
      }
    }
  }

  /**
   * Getter for _description
   * @return {string}
   */
  get description(): string {
    return this._description;
  }

  /**
   * Setter for _description
   * @param {string} description
   */
  set description(description: string) {
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      if (
        check2004ValidFormat(
          description,
          scorm2004_regex.CMILangString250,
          true,
        )
      ) {
        this._description = description;
      }
    }
  }

  /**
   * toJSON for cmi.objectives.n
   *
   * @return {
   *    {
   *      id: string,
   *      success_status: string,
   *      completion_status: string,
   *      progress_measure: string,
   *      description: string,
   *      score: Scorm2004CMIScore
   *    }
   *  }
   */
  toJSON(): {
    id: string;
    success_status: string;
    completion_status: string;
    progress_measure: string;
    description: string;
    score: Scorm2004CMIScore;
  } {
    this.jsonString = true;
    const result = {
      id: this.id,
      success_status: this.success_status,
      completion_status: this.completion_status,
      progress_measure: this.progress_measure,
      description: this.description,
      score: this.score,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class for SCORM 2004's cmi *.score object
 */

class Scorm2004CMIScore extends CMIScore {
  private _scaled = "";

  /**
   * Constructor for cmi *.score
   */
  constructor() {
    super({
      score_children: scorm2004_constants.score_children,
      max: "",
      invalidErrorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      invalidTypeCode: scorm2004_error_codes.TYPE_MISMATCH,
      invalidRangeCode: scorm2004_error_codes.VALUE_OUT_OF_RANGE,
      decimalRegex: scorm2004_regex.CMIDecimal,
      errorClass: Scorm2004ValidationError,
    });
  }

  /**
   * Getter for _scaled
   * @return {string}
   */
  get scaled(): string {
    return this._scaled;
  }

  /**
   * Setter for _scaled
   * @param {string} scaled
   */
  set scaled(scaled: string) {
    if (
      check2004ValidFormat(scaled, scorm2004_regex.CMIDecimal) &&
      check2004ValidRange(scaled, scorm2004_regex.scaled_range)
    ) {
      this._scaled = scaled;
    }
  }

  /**
   * toJSON for cmi *.score
   *
   * @return {
   *    {
   *      scaled: string,
   *      raw: string,
   *      min: string,
   *      max: string
   *    }
   *  }
   */
  toJSON(): {
    scaled: string;
    raw: string;
    min: string;
    max: string;
  } {
    this.jsonString = true;
    const result = {
      scaled: this.scaled,
      raw: this.raw,
      min: this.min,
      max: this.max,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing SCORM 2004's cmi.comments_from_learner.n and cmi.comments_from_lms.n object
 */

export class CMICommentsObject extends BaseCMI {
  private _comment = "";
  private _location = "";
  private _timestamp = "";
  private readonly _readOnlyAfterInit: boolean;

  /**
   * Constructor for cmi.comments_from_learner.n and cmi.comments_from_lms.n
   * @param {boolean} readOnlyAfterInit
   */
  constructor(readOnlyAfterInit: boolean = false) {
    super();
    this._comment = "";
    this._location = "";
    this._timestamp = "";
    this._readOnlyAfterInit = readOnlyAfterInit;
  }

  /**
   * Getter for _comment
   * @return {string}
   */
  get comment(): string {
    return this._comment;
  }

  /**
   * Setter for _comment
   * @param {string} comment
   */
  set comment(comment: string) {
    if (this.initialized && this._readOnlyAfterInit) {
      throw new Scorm2004ValidationError(
        scorm2004_error_codes.READ_ONLY_ELEMENT,
      );
    } else {
      if (
        check2004ValidFormat(comment, scorm2004_regex.CMILangString4000, true)
      ) {
        this._comment = comment;
      }
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
    if (this.initialized && this._readOnlyAfterInit) {
      throw new Scorm2004ValidationError(
        scorm2004_error_codes.READ_ONLY_ELEMENT,
      );
    } else {
      if (check2004ValidFormat(location, scorm2004_regex.CMIString250)) {
        this._location = location;
      }
    }
  }

  /**
   * Getter for _timestamp
   * @return {string}
   */
  get timestamp(): string {
    return this._timestamp;
  }

  /**
   * Setter for _timestamp
   * @param {string} timestamp
   */
  set timestamp(timestamp: string) {
    if (this.initialized && this._readOnlyAfterInit) {
      throw new Scorm2004ValidationError(
        scorm2004_error_codes.READ_ONLY_ELEMENT,
      );
    } else {
      if (check2004ValidFormat(timestamp, scorm2004_regex.CMITime)) {
        this._timestamp = timestamp;
      }
    }
  }

  /**
   * toJSON for cmi.comments_from_learner.n object
   * @return {
   *    {
   *      comment: string,
   *      location: string,
   *      timestamp: string
   *    }
   *  }
   */
  toJSON(): {
    comment: string;
    location: string;
    timestamp: string;
  } {
    this.jsonString = true;
    const result = {
      comment: this.comment,
      location: this.location,
      timestamp: this.timestamp,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing SCORM 2004's cmi.interactions.n.objectives.n object
 */
export class CMIInteractionsObjectivesObject extends BaseCMI {
  private _id = "";

  /**
   * Constructor for cmi.interactions.n.objectives.n
   */
  constructor() {
    super();
  }

  /**
   * Getter for _id
   * @return {string}
   */
  get id(): string {
    return this._id;
  }

  /**
   * Setter for _id
   * @param {string} id
   */
  set id(id: string) {
    if (check2004ValidFormat(id, scorm2004_regex.CMILongIdentifier)) {
      this._id = id;
    }
  }

  /**
   * toJSON for cmi.interactions.n.objectives.n
   * @return {
   *    {
   *      id: string
   *    }
   *  }
   */
  toJSON(): {
    id: string;
  } {
    this.jsonString = true;
    const result = {
      id: this.id,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing SCORM 2004's cmi.interactions.n.correct_responses.n object
 */
export class CMIInteractionsCorrectResponsesObject extends BaseCMI {
  private _pattern = "";

  /**
   * Constructor for cmi.interactions.n.correct_responses.n
   */
  constructor() {
    super();
  }

  /**
   * Getter for _pattern
   * @return {string}
   */
  get pattern(): string {
    return this._pattern;
  }

  /**
   * Setter for _pattern
   * @param {string} pattern
   */
  set pattern(pattern: string) {
    if (check2004ValidFormat(pattern, scorm2004_regex.CMIFeedback)) {
      this._pattern = pattern;
    }
  }

  /**
   * toJSON cmi.interactions.n.correct_responses.n object
   * @return {
   *    {
   *      pattern: string
   *    }
   *  }
   */
  toJSON(): {
    pattern: string;
  } {
    this.jsonString = true;
    const result = {
      pattern: this.pattern,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing SCORM 2004's adl object
 */
export class ADL extends BaseCMI {
  /**
   * Constructor for adl
   */
  constructor() {
    super();
    this.nav = new ADLNav();
  }

  public nav: ADLNav;

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.nav?.initialize();
  }

  /**
   * toJSON for adl
   * @return {
   *    {
   *      nav: ADLNav
   *    }
   *  }
   */
  toJSON(): {
    nav: ADLNav;
  } {
    this.jsonString = true;
    const result = {
      nav: this.nav,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing SCORM 2004's `adl.nav` object
 */

class ADLNav extends BaseCMI {
  private _request = "_none_";

  /**
   * Constructor for `adl.nav`
   */
  constructor() {
    super();
    this.request_valid = new ADLNavRequestValid();
  }

  public request_valid: ADLNavRequestValid;

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.request_valid?.initialize();
  }

  /**
   * Getter for _request
   * @return {string}
   */
  get request(): string {
    return this._request;
  }

  /**
   * Setter for _request
   * @param {string} request
   */
  set request(request: string) {
    if (check2004ValidFormat(request, scorm2004_regex.NAVEvent)) {
      this._request = request;
    }
  }

  /**
   * toJSON for adl.nav
   *
   * @return {
   *    {
   *      request: string
   *    }
   *  }
   */
  toJSON(): {
    request: string;
  } {
    this.jsonString = true;
    const result = {
      request: this.request,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing SCORM 2004's adl.nav.request_valid object
 */

class ADLNavRequestValid extends BaseCMI {
  private _continue = "unknown";
  private _previous = "unknown";
  choice = class {
    /**
     * Check if target is valid
     * @param {string} _target
     * @return {string}
     */
    _isTargetValid = (_target: string): string => "unknown";
  };
  jump = class {
    /**
     * Check if target is valid
     * @param {string} _target
     * @return {string}
     */
    _isTargetValid = (_target: string): string => "unknown";
  };

  /**
   * Constructor for adl.nav.request_valid
   */
  constructor() {
    super();
  }

  /**
   * Getter for _continue
   * @return {string}
   */
  get continue(): string {
    return this._continue;
  }

  /**
   * Setter for _continue. Just throws an error.
   * @param {string} _continue
   */
  set continue(_continue: string) {
    throw new Scorm2004ValidationError(scorm2004_error_codes.READ_ONLY_ELEMENT);
  }

  /**
   * Getter for _previous
   * @return {string}
   */
  get previous(): string {
    return this._previous;
  }

  /**
   * Setter for _previous. Just throws an error.
   * @param {string} _previous
   */
  set previous(_previous: string) {
    throw new Scorm2004ValidationError(scorm2004_error_codes.READ_ONLY_ELEMENT);
  }

  /**
   * toJSON for adl.nav.request_valid
   *
   * @return {
   *    {
   *      previous: string,
   *      continue: string
   *    }
   *  }
   */
  toJSON(): {
    previous: string;
    continue: string;
  } {
    this.jsonString = true;
    const result = {
      previous: this._previous,
      continue: this.continue,
    };
    delete this.jsonString;
    return result;
  }
}
