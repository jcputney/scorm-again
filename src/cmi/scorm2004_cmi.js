// @flow
import {
  BaseCMI,
  checkValidFormat,
  checkValidRange,
  CMIArray,
  CMIScore,
} from './common';
import APIConstants from '../constants/api_constants';
import Regex from '../constants/regex';
import ErrorCodes from '../constants/error_codes';
import Responses from '../constants/response_constants';
import {Scorm2004ValidationError} from '../exceptions';
import * as Util from '../utilities';

const scorm2004_constants = APIConstants.scorm2004;
const scorm2004_error_codes = ErrorCodes.scorm2004;
const learner_responses = Responses.learner;

const scorm2004_regex = Regex.scorm2004;

/**
 * Helper method for throwing Read Only error
 */
function throwReadOnlyError() {
  throw new Scorm2004ValidationError(scorm2004_error_codes.READ_ONLY_ELEMENT);
}

/**
 * Helper method for throwing Write Only error
 */
function throwWriteOnlyError() {
  throw new Scorm2004ValidationError(scorm2004_error_codes.WRITE_ONLY_ELEMENT);
}

/**
 * Helper method for throwing Type Mismatch error
 */
function throwTypeMismatchError() {
  throw new Scorm2004ValidationError(scorm2004_error_codes.TYPE_MISMATCH);
}

/**
 * Helper method for throwing Dependency Not Established error
 */
function throwDependencyNotEstablishedError() {
  throw new Scorm2004ValidationError(scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED);
}

/**
 * Helper method for throwing Dependency Not Established error
 */
function throwGeneralSetError() {
  throw new Scorm2004ValidationError(scorm2004_error_codes.GENERAL_SET_FAILURE);
}

/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} regexPattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */
function check2004ValidFormat(
    value: String,
    regexPattern: String,
    allowEmptyString?: boolean) {
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
 * @param {*} value
 * @param {string} rangePattern
 * @return {boolean}
 */
function check2004ValidRange(value: any, rangePattern: String) {
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
export class CMI extends BaseCMI {
  /**
   * Constructor for the SCORM 2004 cmi object
   * @param {boolean} initialized
   */
  constructor(initialized: boolean) {
    super();

    this.learner_preference = new CMILearnerPreference();
    this.score = new Scorm2004CMIScore();
    this.comments_from_learner = new CMICommentsFromLearner();
    this.comments_from_lms = new CMICommentsFromLMS();
    this.interactions = new CMIInteractions();
    this.objectives = new CMIObjectives();

    if (initialized) this.initialize();
  }

  #_version = '1.0';
  #_children = scorm2004_constants.cmi_children;
  #completion_status = 'unknown';
  #completion_threshold = '';
  #credit = 'credit';
  #entry = '';
  #exit = '';
  #launch_data = '';
  #learner_id = '';
  #learner_name = '';
  #location = '';
  #max_time_allowed = '';
  #mode = 'normal';
  #progress_measure = '';
  #scaled_passing_score = '';
  #session_time = 'PT0H0M0S';
  #success_status = 'unknown';
  #suspend_data = '';
  #time_limit_action = 'continue,no message';
  #total_time = '';

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
   * Getter for #_version
   * @return {string}
   * @private
   */
  get _version() {
    return this.#_version;
  }

  /**
   * Setter for #_version. Just throws an error.
   * @param {string} _version
   * @private
   */
  set _version(_version) {
    throwReadOnlyError();
  }

  /**
   * Getter for #_children
   * @return {string}
   * @private
   */
  get _children() {
    return this.#_children;
  }

  /**
   * Setter for #_children. Just throws an error.
   * @param {number} _children
   * @private
   */
  set _children(_children) {
    throwReadOnlyError();
  }

  /**
   * Getter for #completion_status
   * @return {string}
   */
  get completion_status() {
    return this.#completion_status;
  }

  /**
   * Setter for #completion_status
   * @param {string} completion_status
   */
  set completion_status(completion_status) {
    if (check2004ValidFormat(completion_status, scorm2004_regex.CMICStatus)) {
      this.#completion_status = completion_status;
    }
  }

  /**
   * Getter for #completion_threshold
   * @return {string}
   */
  get completion_threshold() {
    return this.#completion_threshold;
  }

  /**
   * Setter for #completion_threshold. Can only be called before  initialization.
   * @param {string} completion_threshold
   */
  set completion_threshold(completion_threshold) {
    !this.initialized ?
      this.#completion_threshold = completion_threshold :
      throwReadOnlyError();
  }

  /**
   * Setter for #credit
   * @return {string}
   */
  get credit() {
    return this.#credit;
  }

  /**
   * Setter for #credit. Can only be called before  initialization.
   * @param {string} credit
   */
  set credit(credit) {
    !this.initialized ? this.#credit = credit : throwReadOnlyError();
  }

  /**
   * Getter for #entry
   * @return {string}
   */
  get entry() {
    return this.#entry;
  }

  /**
   * Setter for #entry. Can only be called before  initialization.
   * @param {string} entry
   */
  set entry(entry) {
    !this.initialized ? this.#entry = entry : throwReadOnlyError();
  }

  /**
   * Getter for #exit. Should only be called during JSON export.
   * @return {string}
   */
  get exit() {
    return (!this.jsonString) ? throwWriteOnlyError() : this.#exit;
  }

  /**
   * Getter for #exit
   * @param {string} exit
   */
  set exit(exit) {
    if (check2004ValidFormat(exit, scorm2004_regex.CMIExit, true)) {
      this.#exit = exit;
    }
  }

  /**
   * Getter for #launch_data
   * @return {string}
   */
  get launch_data() {
    return this.#launch_data;
  }

  /**
   * Setter for #launch_data. Can only be called before  initialization.
   * @param {string} launch_data
   */
  set launch_data(launch_data) {
    !this.initialized ? this.#launch_data = launch_data : throwReadOnlyError();
  }

  /**
   * Getter for #learner_id
   * @return {string}
   */
  get learner_id() {
    return this.#learner_id;
  }

  /**
   * Setter for #learner_id. Can only be called before  initialization.
   * @param {string} learner_id
   */
  set learner_id(learner_id) {
    !this.initialized ? this.#learner_id = learner_id : throwReadOnlyError();
  }

  /**
   * Getter for #learner_name
   * @return {string}
   */
  get learner_name() {
    return this.#learner_name;
  }

  /**
   * Setter for #learner_name. Can only be called before  initialization.
   * @param {string} learner_name
   */
  set learner_name(learner_name) {
    !this.initialized ?
      this.#learner_name = learner_name :
      throwReadOnlyError();
  }

  /**
   * Getter for #location
   * @return {string}
   */
  get location() {
    return this.#location;
  }

  /**
   * Setter for #location
   * @param {string} location
   */
  set location(location) {
    if (check2004ValidFormat(location, scorm2004_regex.CMIString1000)) {
      this.#location = location;
    }
  }

  /**
   * Getter for #max_time_allowed
   * @return {string}
   */
  get max_time_allowed() {
    return this.#max_time_allowed;
  }

  /**
   * Setter for #max_time_allowed. Can only be called before  initialization.
   * @param {string} max_time_allowed
   */
  set max_time_allowed(max_time_allowed) {
    !this.initialized ?
      this.#max_time_allowed = max_time_allowed :
      throwReadOnlyError();
  }

  /**
   * Getter for #mode
   * @return {string}
   */
  get mode() {
    return this.#mode;
  }

  /**
   * Setter for #mode. Can only be called before  initialization.
   * @param {string} mode
   */
  set mode(mode) {
    !this.initialized ? this.#mode = mode : throwReadOnlyError();
  }

  /**
   * Getter for #progress_measure
   * @return {string}
   */
  get progress_measure() {
    return this.#progress_measure;
  }

  /**
   * Setter for #progress_measure
   * @param {string} progress_measure
   */
  set progress_measure(progress_measure) {
    if (check2004ValidFormat(progress_measure, scorm2004_regex.CMIDecimal) &&
      check2004ValidRange(progress_measure, scorm2004_regex.progress_range)) {
      this.#progress_measure = progress_measure;
    }
  }

  /**
   * Getter for #scaled_passing_score
   * @return {string}
   */
  get scaled_passing_score() {
    return this.#scaled_passing_score;
  }

  /**
   * Setter for #scaled_passing_score. Can only be called before  initialization.
   * @param {string} scaled_passing_score
   */
  set scaled_passing_score(scaled_passing_score) {
    !this.initialized ?
      this.#scaled_passing_score = scaled_passing_score :
      throwReadOnlyError();
  }

  /**
   * Getter for #session_time. Should only be called during JSON export.
   * @return {string}
   */
  get session_time() {
    return (!this.jsonString) ? throwWriteOnlyError() : this.#session_time;
  }

  /**
   * Setter for #session_time
   * @param {string} session_time
   */
  set session_time(session_time) {
    if (check2004ValidFormat(session_time, scorm2004_regex.CMITimespan)) {
      this.#session_time = session_time;
    }
  }

  /**
   * Getter for #success_status
   * @return {string}
   */
  get success_status() {
    return this.#success_status;
  }

  /**
   * Setter for #success_status
   * @param {string} success_status
   */
  set success_status(success_status) {
    if (check2004ValidFormat(success_status, scorm2004_regex.CMISStatus)) {
      this.#success_status = success_status;
    }
  }

  /**
   * Getter for #suspend_data
   * @return {string}
   */
  get suspend_data() {
    return this.#suspend_data;
  }

  /**
   * Setter for #suspend_data
   * @param {string} suspend_data
   */
  set suspend_data(suspend_data) {
    if (check2004ValidFormat(suspend_data, scorm2004_regex.CMIString64000,
        true)) {
      this.#suspend_data = suspend_data;
    }
  }

  /**
   * Getter for #time_limit_action
   * @return {string}
   */
  get time_limit_action() {
    return this.#time_limit_action;
  }

  /**
   * Setter for #time_limit_action. Can only be called before  initialization.
   * @param {string} time_limit_action
   */
  set time_limit_action(time_limit_action) {
    !this.initialized ?
      this.#time_limit_action = time_limit_action :
      throwReadOnlyError();
  }

  /**
   * Getter for #total_time
   * @return {string}
   */
  get total_time() {
    return this.#total_time;
  }

  /**
   * Setter for #total_time. Can only be called before  initialization.
   * @param {string} total_time
   */
  set total_time(total_time) {
    !this.initialized ? this.#total_time = total_time : throwReadOnlyError();
  }

  /**
   * Adds the current session time to the existing total time.
   *
   * @return {string} ISO8601 Duration
   */
  getCurrentTotalTime() {
    let sessionTime = this.#session_time;
    const startTime = this.start_time;

    if (typeof startTime !== 'undefined' && startTime !== null) {
      const seconds = new Date().getTime() - startTime;
      sessionTime = Util.getSecondsAsISODuration(seconds / 1000);
    }

    return Util.addTwoDurations(
        this.#total_time,
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
  toJSON() {
    this.jsonString = true;
    const result = {
      'comments_from_learner': this.comments_from_learner,
      'comments_from_lms': this.comments_from_lms,
      'completion_status': this.completion_status,
      'completion_threshold': this.completion_threshold,
      'credit': this.credit,
      'entry': this.entry,
      'exit': this.exit,
      'interactions': this.interactions,
      'launch_data': this.launch_data,
      'learner_id': this.learner_id,
      'learner_name': this.learner_name,
      'learner_preference': this.learner_preference,
      'location': this.location,
      'max_time_allowed': this.max_time_allowed,
      'mode': this.mode,
      'objectives': this.objectives,
      'progress_measure': this.progress_measure,
      'scaled_passing_score': this.scaled_passing_score,
      'score': this.score,
      'session_time': this.session_time,
      'success_status': this.success_status,
      'suspend_data': this.suspend_data,
      'time_limit_action': this.time_limit_action,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class for SCORM 2004's cmi.learner_preference object
 */
class CMILearnerPreference extends BaseCMI {
  #_children = scorm2004_constants.student_preference_children;
  #audio_level = '1';
  #language = '';
  #delivery_speed = '1';
  #audio_captioning = '0';

  /**
   * Constructor for cmi.learner_preference
   */
  constructor() {
    super();
  }

  /**
   * Getter for #_children
   * @return {string}
   * @private
   */
  get _children() {
    return this.#_children;
  }

  /**
   * Setter for #_children. Just throws an error.
   * @param {string} _children
   * @private
   */
  set _children(_children) {
    throwReadOnlyError();
  }

  /**
   * Getter for #audio_level
   * @return {string}
   */
  get audio_level() {
    return this.#audio_level;
  }

  /**
   * Setter for #audio_level
   * @param {string} audio_level
   */
  set audio_level(audio_level) {
    if (check2004ValidFormat(audio_level, scorm2004_regex.CMIDecimal) &&
      check2004ValidRange(audio_level, scorm2004_regex.audio_range)) {
      this.#audio_level = audio_level;
    }
  }

  /**
   * Getter for #language
   * @return {string}
   */
  get language() {
    return this.#language;
  }

  /**
   * Setter for #language
   * @param {string} language
   */
  set language(language) {
    if (check2004ValidFormat(language, scorm2004_regex.CMILang)) {
      this.#language = language;
    }
  }

  /**
   * Getter for #delivery_speed
   * @return {string}
   */
  get delivery_speed() {
    return this.#delivery_speed;
  }

  /**
   * Setter for #delivery_speed
   * @param {string} delivery_speed
   */
  set delivery_speed(delivery_speed) {
    if (check2004ValidFormat(delivery_speed, scorm2004_regex.CMIDecimal) &&
      check2004ValidRange(delivery_speed, scorm2004_regex.speed_range)) {
      this.#delivery_speed = delivery_speed;
    }
  }

  /**
   * Getter for #audio_captioning
   * @return {string}
   */
  get audio_captioning() {
    return this.#audio_captioning;
  }

  /**
   * Setter for #audio_captioning
   * @param {string} audio_captioning
   */
  set audio_captioning(audio_captioning) {
    if (check2004ValidFormat(audio_captioning, scorm2004_regex.CMISInteger) &&
      check2004ValidRange(audio_captioning, scorm2004_regex.text_range)) {
      this.#audio_captioning = audio_captioning;
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
  toJSON() {
    this.jsonString = true;
    const result = {
      'audio_level': this.audio_level,
      'language': this.language,
      'delivery_speed': this.delivery_speed,
      'audio_captioning': this.audio_captioning,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing SCORM 2004's cmi.interactions object
 */
class CMIInteractions extends CMIArray {
  /**
   * Constructor for cmi.objectives Array
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
 * Class representing SCORM 2004's cmi.objectives object
 */
class CMIObjectives extends CMIArray {
  /**
   * Constructor for cmi.objectives Array
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
  #id = '';
  #type = '';
  #timestamp = '';
  #weighting = '';
  #learner_response = '';
  #result = '';
  #latency = '';
  #description = '';

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

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.objectives?.initialize();
    this.correct_responses?.initialize();
  }

  /**
   * Getter for #id
   * @return {string}
   */
  get id() {
    return this.#id;
  }

  /**
   * Setter for #id
   * @param {string} id
   */
  set id(id) {
    if (check2004ValidFormat(id, scorm2004_regex.CMILongIdentifier)) {
      this.#id = id;
    }
  }

  /**
   * Getter for #type
   * @return {string}
   */
  get type() {
    return this.#type;
  }

  /**
   * Setter for #type
   * @param {string} type
   */
  set type(type) {
    if (this.initialized && this.#id === '') {
      throwDependencyNotEstablishedError();
    } else {
      if (check2004ValidFormat(type, scorm2004_regex.CMIType)) {
        this.#type = type;
      }
    }
  }

  /**
   * Getter for #timestamp
   * @return {string}
   */
  get timestamp() {
    return this.#timestamp;
  }

  /**
   * Setter for #timestamp
   * @param {string} timestamp
   */
  set timestamp(timestamp) {
    if (this.initialized && this.#id === '') {
      throwDependencyNotEstablishedError();
    } else {
      if (check2004ValidFormat(timestamp, scorm2004_regex.CMITime)) {
        this.#timestamp = timestamp;
      }
    }
  }

  /**
   * Getter for #weighting
   * @return {string}
   */
  get weighting() {
    return this.#weighting;
  }

  /**
   * Setter for #weighting
   * @param {string} weighting
   */
  set weighting(weighting) {
    if (this.initialized && this.#id === '') {
      throwDependencyNotEstablishedError();
    } else {
      if (check2004ValidFormat(weighting, scorm2004_regex.CMIDecimal)) {
        this.#weighting = weighting;
      }
    }
  }

  /**
   * Getter for #learner_response
   * @return {string}
   */
  get learner_response() {
    return this.#learner_response;
  }

  /**
   * Setter for #learner_response. Does type validation to make sure response
   * matches SCORM 2004's spec
   * @param {string} learner_response
   */
  set learner_response(learner_response) {
    if (this.initialized && (this.#type === '' || this.#id === '')) {
      throwDependencyNotEstablishedError();
    } else {
      let nodes = [];
      const response_type = learner_responses[this.type];
      if (response_type) {
        if (response_type?.delimiter) {
          nodes = learner_response.split(response_type.delimiter);
        } else {
          nodes[0] = learner_response;
        }

        if ((nodes.length > 0) && (nodes.length <= response_type.max)) {
          const formatRegex = new RegExp(response_type.format);
          for (let i = 0; i < nodes.length; i++) {
            if (response_type?.delimiter2) {
              const values = nodes[i].split(response_type.delimiter2);
              if (values.length === 2) {
                if (!values[0].match(formatRegex)) {
                  throwTypeMismatchError();
                } else {
                  if (!values[1].match(new RegExp(response_type.format2))) {
                    throwTypeMismatchError();
                  }
                }
              } else {
                throwTypeMismatchError();
              }
            } else {
              if (!nodes[i].match(formatRegex)) {
                throwTypeMismatchError();
              } else {
                if (nodes[i] !== '' && response_type.unique) {
                  for (let j = 0; j < i; j++) {
                    if (nodes[i] === nodes[j]) {
                      throwTypeMismatchError();
                    }
                  }
                }
              }
            }
          }
        } else {
          throwGeneralSetError();
        }

        this.#learner_response = learner_response;
      } else {
        throwTypeMismatchError();
      }
    }
  }

  /**
   * Getter for #result
   * @return {string}
   */
  get result() {
    return this.#result;
  }

  /**
   * Setter for #result
   * @param {string} result
   */
  set result(result) {
    if (check2004ValidFormat(result, scorm2004_regex.CMIResult)) {
      this.#result = result;
    }
  }

  /**
   * Getter for #latency
   * @return {string}
   */
  get latency() {
    return this.#latency;
  }

  /**
   * Setter for #latency
   * @param {string} latency
   */
  set latency(latency) {
    if (this.initialized && this.#id === '') {
      throwDependencyNotEstablishedError();
    } else {
      if (check2004ValidFormat(latency, scorm2004_regex.CMITimespan)) {
        this.#latency = latency;
      }
    }
  }

  /**
   * Getter for #description
   * @return {string}
   */
  get description() {
    return this.#description;
  }

  /**
   * Setter for #description
   * @param {string} description
   */
  set description(description) {
    if (this.initialized && this.#id === '') {
      throwDependencyNotEstablishedError();
    } else {
      if (check2004ValidFormat(description, scorm2004_regex.CMILangString250,
          true)) {
        this.#description = description;
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
  toJSON() {
    this.jsonString = true;
    const result = {
      'id': this.id,
      'type': this.type,
      'objectives': this.objectives,
      'timestamp': this.timestamp,
      'weighting': this.weighting,
      'learner_response': this.learner_response,
      'result': this.result,
      'latency': this.latency,
      'description': this.description,
      'correct_responses': this.correct_responses,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class for SCORM 2004's cmi.objectives.n object
 */
export class CMIObjectivesObject extends BaseCMI {
  #id = '';
  #success_status = 'unknown';
  #completion_status = 'unknown';
  #progress_measure = '';
  #description = '';

  /**
   * Constructor for cmi.objectives.n
   */
  constructor() {
    super();

    this.score = new Scorm2004CMIScore();
  }

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.score?.initialize();
  }

  /**
   * Getter for #id
   * @return {string}
   */
  get id() {
    return this.#id;
  }

  /**
   * Setter for #id
   * @param {string} id
   */
  set id(id) {
    if (check2004ValidFormat(id, scorm2004_regex.CMILongIdentifier)) {
      this.#id = id;
    }
  }

  /**
   * Getter for #success_status
   * @return {string}
   */
  get success_status() {
    return this.#success_status;
  }

  /**
   * Setter for #success_status
   * @param {string} success_status
   */
  set success_status(success_status) {
    if (this.initialized && this.#id === '') {
      throwDependencyNotEstablishedError();
    } else {
      if (check2004ValidFormat(success_status, scorm2004_regex.CMISStatus)) {
        this.#success_status = success_status;
      }
    }
  }

  /**
   * Getter for #completion_status
   * @return {string}
   */
  get completion_status() {
    return this.#completion_status;
  }

  /**
   * Setter for #completion_status
   * @param {string} completion_status
   */
  set completion_status(completion_status) {
    if (this.initialized && this.#id === '') {
      throwDependencyNotEstablishedError();
    } else {
      if (check2004ValidFormat(completion_status, scorm2004_regex.CMICStatus)) {
        this.#completion_status = completion_status;
      }
    }
  }

  /**
   * Getter for #progress_measure
   * @return {string}
   */
  get progress_measure() {
    return this.#progress_measure;
  }

  /**
   * Setter for #progress_measure
   * @param {string} progress_measure
   */
  set progress_measure(progress_measure) {
    if (this.initialized && this.#id === '') {
      throwDependencyNotEstablishedError();
    } else {
      if (check2004ValidFormat(progress_measure, scorm2004_regex.CMIDecimal) &&
        check2004ValidRange(progress_measure,
            scorm2004_regex.progress_range)) {
        this.#progress_measure = progress_measure;
      }
    }
  }

  /**
   * Getter for #description
   * @return {string}
   */
  get description() {
    return this.#description;
  }

  /**
   * Setter for #description
   * @param {string} description
   */
  set description(description) {
    if (this.initialized && this.#id === '') {
      throwDependencyNotEstablishedError();
    } else {
      if (check2004ValidFormat(description, scorm2004_regex.CMILangString250,
          true)) {
        this.#description = description;
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
  toJSON() {
    this.jsonString = true;
    const result = {
      'id': this.id,
      'success_status': this.success_status,
      'completion_status': this.completion_status,
      'progress_measure': this.progress_measure,
      'description': this.description,
      'score': this.score,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class for SCORM 2004's cmi *.score object
 */
class Scorm2004CMIScore extends CMIScore {
  #scaled = '';

  /**
   * Constructor for cmi *.score
   */
  constructor() {
    super(
        {
          score_children: scorm2004_constants.score_children,
          max: '',
          invalidErrorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
          invalidTypeCode: scorm2004_error_codes.TYPE_MISMATCH,
          invalidRangeCode: scorm2004_error_codes.VALUE_OUT_OF_RANGE,
          decimalRegex: scorm2004_regex.CMIDecimal,
          errorClass: Scorm2004ValidationError,
        });
  }

  /**
   * Getter for #scaled
   * @return {string}
   */
  get scaled() {
    return this.#scaled;
  }

  /**
   * Setter for #scaled
   * @param {string} scaled
   */
  set scaled(scaled) {
    if (check2004ValidFormat(scaled, scorm2004_regex.CMIDecimal) &&
      check2004ValidRange(scaled, scorm2004_regex.scaled_range)) {
      this.#scaled = scaled;
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
  toJSON() {
    this.jsonString = true;
    const result = {
      'scaled': this.scaled,
      'raw': super.raw,
      'min': super.min,
      'max': super.max,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing SCORM 2004's cmi.comments_from_learner.n and cmi.comments_from_lms.n object
 */
export class CMICommentsObject extends BaseCMI {
  #comment = '';
  #location = '';
  #timestamp = '';
  #readOnlyAfterInit;

  /**
   * Constructor for cmi.comments_from_learner.n and cmi.comments_from_lms.n
   * @param {boolean} readOnlyAfterInit
   */
  constructor(readOnlyAfterInit = false) {
    super();
    this.#comment = '';
    this.#location = '';
    this.#timestamp = '';
    this.#readOnlyAfterInit = readOnlyAfterInit;
  }

  /**
   * Getter for #comment
   * @return {string}
   */
  get comment() {
    return this.#comment;
  }

  /**
   * Setter for #comment
   * @param {string} comment
   */
  set comment(comment) {
    if (this.initialized && this.#readOnlyAfterInit) {
      throwReadOnlyError();
    } else {
      if (check2004ValidFormat(comment, scorm2004_regex.CMILangString4000,
          true)) {
        this.#comment = comment;
      }
    }
  }

  /**
   * Getter for #location
   * @return {string}
   */
  get location() {
    return this.#location;
  }

  /**
   * Setter for #location
   * @param {string} location
   */
  set location(location) {
    if (this.initialized && this.#readOnlyAfterInit) {
      throwReadOnlyError();
    } else {
      if (check2004ValidFormat(location, scorm2004_regex.CMIString250)) {
        this.#location = location;
      }
    }
  }

  /**
   * Getter for #timestamp
   * @return {string}
   */
  get timestamp() {
    return this.#timestamp;
  }

  /**
   * Setter for #timestamp
   * @param {string} timestamp
   */
  set timestamp(timestamp) {
    if (this.initialized && this.#readOnlyAfterInit) {
      throwReadOnlyError();
    } else {
      if (check2004ValidFormat(timestamp, scorm2004_regex.CMITime)) {
        this.#timestamp = timestamp;
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
  toJSON() {
    this.jsonString = true;
    const result = {
      'comment': this.comment,
      'location': this.location,
      'timestamp': this.timestamp,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing SCORM 2004's cmi.interactions.n.objectives.n object
 */
export class CMIInteractionsObjectivesObject extends BaseCMI {
  #id = '';

  /**
   * Constructor for cmi.interactions.n.objectives.n
   */
  constructor() {
    super();
  }

  /**
   * Getter for #id
   * @return {string}
   */
  get id() {
    return this.#id;
  }

  /**
   * Setter for #id
   * @param {string} id
   */
  set id(id) {
    if (check2004ValidFormat(id, scorm2004_regex.CMILongIdentifier)) {
      this.#id = id;
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
  toJSON() {
    this.jsonString = true;
    const result = {
      'id': this.id,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing SCORM 2004's cmi.interactions.n.correct_responses.n object
 */
export class CMIInteractionsCorrectResponsesObject extends BaseCMI {
  #pattern = '';

  /**
   * Constructor for cmi.interactions.n.correct_responses.n
   */
  constructor() {
    super();
  }

  /**
   * Getter for #pattern
   * @return {string}
   */
  get pattern() {
    return this.#pattern;
  }

  /**
   * Setter for #pattern
   * @param {string} pattern
   */
  set pattern(pattern) {
    if (check2004ValidFormat(pattern, scorm2004_regex.CMIFeedback)) {
      this.#pattern = pattern;
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
  toJSON() {
    this.jsonString = true;
    const result = {
      'pattern': this.pattern,
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
   *      nav: {
   *        request: string
   *      }
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      'nav': this.nav,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing SCORM 2004's adl.nav object
 */
class ADLNav extends BaseCMI {
  #request = '_none_';

  /**
   * Constructor for adl.nav
   */
  constructor() {
    super();

    this.request_valid = new ADLNavRequestValid();
  }

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.request_valid?.initialize();
  }

  /**
   * Getter for #request
   * @return {string}
   */
  get request() {
    return this.#request;
  }

  /**
   * Setter for #request
   * @param {string} request
   */
  set request(request) {
    if (check2004ValidFormat(request, scorm2004_regex.NAVEvent)) {
      this.#request = request;
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
  toJSON() {
    this.jsonString = true;
    const result = {
      'request': this.request,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing SCORM 2004's adl.nav.request_valid object
 */
class ADLNavRequestValid extends BaseCMI {
  #continue = 'unknown';
  #previous = 'unknown';
  choice = class {
    /**
     * Check if target is valid
     * @param {*} _target
     * @return {string}
     */
    _isTargetValid = (_target) => 'unknown';
  };
  jump = class {
    /**
     * Check if target is valid
     * @param {*} _target
     * @return {string}
     */
    _isTargetValid = (_target) => 'unknown';
  };

  /**
   * Constructor for adl.nav.request_valid
   */
  constructor() {
    super();
  }

  /**
   * Getter for #continue
   * @return {string}
   */
  get continue() {
    return this.#continue;
  }

  /**
   * Setter for #continue. Just throws an error.
   * @param {*} _
   */
  set continue(_) {
    throwReadOnlyError();
  }

  /**
   * Getter for #previous
   * @return {string}
   */
  get previous() {
    return this.#previous;
  }

  /**
   * Setter for #previous. Just throws an error.
   * @param {*} _
   */
  set previous(_) {
    throwReadOnlyError();
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
  toJSON() {
    this.jsonString = true;
    const result = {
      'previous': this.previous,
      'continue': this.continue,
    };
    delete this.jsonString;
    return result;
  }
}
