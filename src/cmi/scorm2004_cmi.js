// @flow
import {BaseCMI, CMIArray, CMIScore} from './common';
import {scorm2004_constants} from '../constants/api_constants';
import {scorm2004_regex} from '../regex';
import {scorm2004_error_codes} from '../constants/error_codes';
import {learner_responses} from '../constants/response_constants';

const constants = scorm2004_constants;
const regex = scorm2004_regex;

/**
 * Helper method for throwing Read Only error
 * @param {Scorm2004API} API
 */
function throwReadOnlyError(API) {
  API.throwSCORMError(scorm2004_error_codes.READ_ONLY_ELEMENT);
}

/**
 * Helper method for throwing Write Only error
 * @param {Scorm2004API} API
 */
function throwWriteOnlyError(API) {
  API.throwSCORMError(scorm2004_error_codes.WRITE_ONLY_ELEMENT);
}

/**
 * Helper method for throwing Type Mismatch error
 * @param {Scorm2004API} API
 */
function throwTypeMismatchError(API) {
  API.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
}

/**
 * Class representing cmi object for SCORM 2004
 */
export class CMI extends BaseCMI {
  /**
   * Constructor for the SCORM 2004 cmi object
   * @param {Scorm2004API} API
   */
  constructor(API) {
    super(API);

    this.learner_preference = new CMILearnerPreference(API);
    this.score = new Scorm2004CMIScore(API);
    this.comments_from_learner = new CMICommentsFromLearner(API);
    this.comments_from_lms = new CMICommentsFromLMS(API);
    this.interactions = new CMIInteractions(API);
    this.objectives = new CMIObjectives(API);
  }

  #_version = '1.0';
  #_children = constants.cmi_children;
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
  #total_time = '0';

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
    throwReadOnlyError(this.API);
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
    throwReadOnlyError(this.API);
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
    if (this.API.checkValidFormat(completion_status, regex.CMICStatus)) {
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
   * Setter for #completion_threshold. Can only be called before API initialization.
   * @param {string} completion_threshold
   */
  set completion_threshold(completion_threshold) {
    this.API.isNotInitialized() ?
        this.#completion_threshold = completion_threshold :
        throwReadOnlyError(this.API);
  }

  /**
   * Setter for #credit
   * @return {string}
   */
  get credit() {
    return this.#credit;
  }

  /**
   * Setter for #credit. Can only be called before API initialization.
   * @param {string} credit
   */
  set credit(credit) {
    this.API.isNotInitialized() ?
        this.#credit = credit :
        throwReadOnlyError(this.API);
  }

  /**
   * Getter for #entry
   * @return {string}
   */
  get entry() {
    return this.#entry;
  }

  /**
   * Setter for #entry. Can only be called before API initialization.
   * @param {string} entry
   */
  set entry(entry) {
    this.API.isNotInitialized() ?
        this.#entry = entry :
        throwReadOnlyError(this.API);
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
    if (this.API.checkValidFormat(exit, regex.CMIExit)) {
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
   * Setter for #launch_data. Can only be called before API initialization.
   * @param {string} launch_data
   */
  set launch_data(launch_data) {
    this.API.isNotInitialized() ?
        this.#launch_data = launch_data :
        throwReadOnlyError(this.API);
  }

  /**
   * Getter for #learner_id
   * @return {string}
   */
  get learner_id() {
    return this.#learner_id;
  }

  /**
   * Setter for #learner_id. Can only be called before API initialization.
   * @param {string} learner_id
   */
  set learner_id(learner_id) {
    this.API.isNotInitialized() ?
        this.#learner_id = learner_id :
        throwReadOnlyError(this.API);
  }

  /**
   * Getter for #learner_name
   * @return {string}
   */
  get learner_name() {
    return this.#learner_name;
  }

  /**
   * Setter for #learner_name. Can only be called before API initialization.
   * @param {string} learner_name
   */
  set learner_name(learner_name) {
    this.API.isNotInitialized() ?
        this.#learner_name = learner_name :
        throwReadOnlyError(this.API);
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
    if (this.API.checkValidFormat(location, regex.CMIString1000)) {
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
   * Setter for #max_time_allowed. Can only be called before API initialization.
   * @param {string} max_time_allowed
   */
  set max_time_allowed(max_time_allowed) {
    this.API.isNotInitialized() ?
        this.#max_time_allowed = max_time_allowed :
        throwReadOnlyError(this.API);
  }

  /**
   * Getter for #mode
   * @return {string}
   */
  get mode() {
    return this.#mode;
  }

  /**
   * Setter for #mode. Can only be called before API initialization.
   * @param {string} mode
   */
  set mode(mode) {
    this.API.isNotInitialized() ?
        this.#mode = mode :
        throwReadOnlyError(this.API);
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
    if (this.API.checkValidFormat(progress_measure, regex.CMIDecimal) &&
        this.API.checkValidRange(progress_measure, regex.progress_range)) {
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
   * Setter for #scaled_passing_score. Can only be called before API initialization.
   * @param {string} scaled_passing_score
   */
  set scaled_passing_score(scaled_passing_score) {
    this.API.isNotInitialized() ?
        this.#scaled_passing_score = scaled_passing_score :
        throwReadOnlyError(this.API);
  }

  /**
   * Getter for #session_time. Should only be called during JSON export.
   * @return {string}
   */
  get session_time() {
    return (!this.jsonString) ?
        this.API.throwSCORMError(405) :
        this.#session_time;
  }

  /**
   * Setter for #session_time
   * @param {string} session_time
   */
  set session_time(session_time) {
    if (this.API.checkValidFormat(session_time, regex.CMITimespan)) {
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
    if (this.API.checkValidFormat(success_status, regex.CMISStatus)) {
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
    if (this.API.checkValidFormat(suspend_data, regex.CMIString64000)) {
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
   * Setter for #time_limit_action. Can only be called before API initialization.
   * @param {string} time_limit_action
   */
  set time_limit_action(time_limit_action) {
    this.API.isNotInitialized() ?
        this.#time_limit_action = time_limit_action :
        throwReadOnlyError(this.API);
  }

  /**
   * Getter for #total_time
   * @return {string}
   */
  get total_time() {
    return this.#total_time;
  }

  /**
   * Setter for #total_time. Can only be called before API initialization.
   * @param {string} total_time
   */
  set total_time(total_time) {
    this.API.isNotInitialized() ?
        this.#total_time = total_time :
        throwReadOnlyError(this.API);
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
   *      time_limit_action: string,
   *      total_time: string
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
      'total_time': this.total_time,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class for SCORM 2004's cmi.learner_preference object
 */
class CMILearnerPreference extends BaseCMI {
  /**
   * Constructor for cmi.learner_preference
   * @param {Scorm2004API} API
   */
  constructor(API) {
    super(API);
  }

  #_children = constants.student_preference_children;
  #audio_level = '1';
  #language = '';
  #delivery_speed = '1';
  #audio_captioning = '0';

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
    throwReadOnlyError(this.API);
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
    if (this.API.checkValidFormat(audio_level, regex.CMIDecimal) &&
        this.API.checkValidRange(audio_level, regex.audio_range)) {
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
    if (this.API.checkValidFormat(language, regex.CMILang)) {
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
    if (this.API.checkValidFormat(delivery_speed, regex.CMIDecimal) &&
        this.API.checkValidRange(delivery_speed, regex.speed_range)) {
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
    if (this.API.checkValidFormat(audio_captioning, regex.CMISInteger) &&
        this.API.checkValidRange(audio_captioning, regex.text_range)) {
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
   * @param {Scorm2004API} API
   */
  constructor(API) {
    super({
      API: API,
      children: constants.objectives_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
    });
  }
}

/**
 * Class representing SCORM 2004's cmi.objectives object
 */
class CMIObjectives extends CMIArray {
  /**
   * Constructor for cmi.objectives Array
   * @param {Scorm2004API} API
   */
  constructor(API) {
    super({
      API: API,
      children: constants.objectives_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
    });
  }
}

/**
 * Class representing SCORM 2004's cmi.comments_from_lms object
 */
class CMICommentsFromLMS extends CMIArray {
  /**
   * Constructor for cmi.comments_from_lms Array
   * @param {Scorm2004API} API
   */
  constructor(API) {
    super({
      API: API,
      children: constants.comments_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
    });
  }
}

/**
 * Class representing SCORM 2004's cmi.comments_from_learner object
 */
class CMICommentsFromLearner extends CMIArray {
  /**
   * Constructor for cmi.comments_from_learner Array
   * @param {Scorm2004API} API
   */
  constructor(API) {
    super({
      API: API,
      children: constants.comments_children,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
    });
  }
}

/**
 * Class for SCORM 2004's cmi.interaction.n object
 */
export class CMIInteractionsObject extends BaseCMI {
  /**
   * Constructor for cmi.interaction.n
   * @param {Scorm2004API} API
   */
  constructor(API) {
    super(API);

    this.objectives = new CMIArray({
      API: API,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      children: constants.objectives_children,
    });
    this.correct_responses = new CMIArray({
      API: API,
      errorCode: scorm2004_error_codes.READ_ONLY_ELEMENT,
      children: constants.correct_responses_children,
    });
  }

  #id = '';
  #type = '';
  #timestamp = '';
  #weighting = '';
  #learner_response = '';
  #result = '';
  #latency = '';
  #description = '';

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
    if (this.API.checkValidFormat(id, regex.CMILongIdentifier)) {
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
    if (this.API.checkValidFormat(type, regex.CMIType)) {
      this.#type = type;
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
    if (this.API.checkValidFormat(timestamp, regex.CMITime)) {
      this.#timestamp = timestamp;
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
    if (this.API.checkValidFormat(weighting, regex.CMIDecimal)) {
      this.#weighting = weighting;
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
    if (typeof this.type === 'undefined') {
      this.API.throwSCORMError(this.API.error.DEPENDENCY_NOT_ESTABLISHED);
    } else {
      let nodes = [];
      const response_type = learner_responses[this.type];
      if (response_type.delimiter !== '') {
        nodes = learner_response.split(response_type.delimiter);
      } else {
        nodes[0] = learner_response;
      }

      if ((nodes.length > 0) && (nodes.length <= response_type.max)) {
        const formatRegex = new RegExp(response_type.format);
        for (let i = 0; (i < nodes.length) &&
        (this.API.lastErrorCode === 0); i++) {
          if (typeof response_type.delimiter2 !== 'undefined') {
            const values = nodes[i].split(response_type.delimiter2);
            if (values.length === 2) {
              if (!values[0].match(formatRegex)) {
                throwTypeMismatchError(this.API);
              } else {
                if (!values[1].match(new RegExp(response_type.format2))) {
                  throwTypeMismatchError(this.API);
                }
              }
            } else {
              throwTypeMismatchError(this.API);
            }
          } else {
            if (!nodes[i].match(formatRegex)) {
              throwTypeMismatchError(this.API);
            } else {
              if (nodes[i] !== '' && response_type.unique) {
                for (let j = 0; (j < i) && this.API.lastErrorCode === 0; j++) {
                  if (nodes[i] === nodes[j]) {
                    throwTypeMismatchError(this.API);
                  }
                }
              }
            }
          }
        }
      } else {
        this.API.throwSCORMError(this.API.error.GENERAL_SET_FAILURE);
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
    if (this.API.checkValidFormat(result, regex.CMIResult)) {
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
    if (this.API.checkValidFormat(latency, regex.CMITimespan)) {
      this.#latency = latency;
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
    if (this.API.checkValidFormat(description, regex.CMILangString250)) {
      this.#description = description;
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
  /**
   * Constructor for cmi.objectives.n
   * @param {Scorm2004API} API
   */
  constructor(API) {
    super(API);

    this.score = new Scorm2004CMIScore(API);
  }

  #id = '';
  #success_status = 'unknown';
  #completion_status = 'unknown';
  #progress_measure = '';
  #description = '';

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
    if (this.API.checkValidFormat(id, regex.CMILongIdentifier)) {
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
    if (this.API.checkValidFormat(success_status, regex.CMISStatus)) {
      this.#success_status = success_status;
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
    if (this.API.checkValidFormat(completion_status, regex.CMICStatus)) {
      this.#completion_status = completion_status;
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
    if (this.API.checkValidFormat(progress_measure, regex.CMIDecimal) &&
        this.API.checkValidRange(progress_measure, regex.progress_range)) {
      this.#progress_measure = progress_measure;
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
    if (this.API.checkValidFormat(description, regex.CMILangString250)) {
      this.#description = description;
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
   *      description: string
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
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class for SCORM 2004's cmi *.score object
 */
class Scorm2004CMIScore extends CMIScore {
  /**
   * Constructor for cmi *.score
   * @param {Scorm2004API} API
   */
  constructor(API) {
    super(API, constants.score_children);

    this.max = '';
  }

  #scaled = '';

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
    if (this.API.checkValidFormat(scaled, regex.CMIDecimal) &&
        this.API.checkValidRange(scaled, regex.scaled_range)) {
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
      'raw': this.raw,
      'min': this.min,
      'max': this.max,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing SCORM 2004's cmi.comments_from_learner.n object
 */
export class CMICommentsFromLearnerObject extends BaseCMI {
  /**
   * Constructor for cmi.comments_from_learner.n
   * @param {Scorm2004API} API
   */
  constructor(API) {
    super(API);
  }

  #comment = '';
  #location = '';
  #timestamp = '';

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
    if (this.API.checkValidFormat(comment, regex.CMILangString4000)) {
      this.#comment = comment;
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
    if (this.API.checkValidFormat(location, regex.CMIString250)) {
      this.#location = location;
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
    if (this.API.checkValidFormat(timestamp, regex.CMITime)) {
      this.#timestamp = timestamp;
    }
  }
}

/**
 * Class representing SCORM 2004's cmi.comments_from_lms.n object
 */
export class CMICommentsFromLMSObject extends CMICommentsFromLearnerObject {
  /**
   * Constructor for cmi.comments_from_lms.n
   * @param {Scorm2004API} API
   */
  constructor(API) {
    super(API);
  }

  /**
   * Setter for #comment. Can only be called before API initialization.
   * @param {string} comment
   */
  set comment(comment) {
    this.API.isNotInitialized() ?
        this.comment = comment :
        throwReadOnlyError(this.API);
  }

  /**
   * Setter for #location. Can only be called before API initialization.
   * @param {string} location
   */
  set location(location) {
    this.API.isNotInitialized() ?
        this.location = location :
        throwReadOnlyError(this.API);
  }

  /**
   * Setter for #timestamp. Can only be called before API initialization.
   * @param {string} timestamp
   */
  set timestamp(timestamp) {
    this.API.isNotInitialized() ?
        this.timestamp = timestamp :
        throwReadOnlyError(this.API);
  }
}

/**
 * Class representing SCORM 2004's cmi.interactions.n.objectives.n object
 */
export class CMIInteractionsObjectivesObject extends BaseCMI {
  /**
   * Constructor for cmi.interactions.n.objectives.n
   * @param {Scorm2004API} API
   */
  constructor(API) {
    super(API);
  }

  #id = '';

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
    if (this.API.checkValidFormat(id, regex.CMILongIdentifier)) {
      this.#id = id;
    }
  }
}

/**
 * Class representing SCORM 2004's cmi.interactions.n.correct_responses.n object
 */
export class CMIInteractionsCorrectResponsesObject extends BaseCMI {
  /**
   * Constructor for cmi.interactions.n.correct_responses.n
   * @param {Scorm2004API} API
   */
  constructor(API) {
    super(API);
  }

  #pattern = '';

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
    if (this.API.checkValidFormat(pattern, regex.CMIFeedback)) {
      this.#pattern = pattern;
    }
  }
}

/**
 * Class representing SCORM 2004's adl object
 */
export class ADL extends BaseCMI {
  /**
   * Constructor for adl
   * @param {Scorm2004API} API
   */
  constructor(API) {
    super(API);

    this.nav = new class extends BaseCMI {
      /**
       * Constructor for adl.nav
       * @param {Scorm2004API} API
       */
      constructor(API) {
        super(API);

        this.request_valid = new class extends BaseCMI {
          /**
           * Constructor for adl.nav.request_valid
           * @param {Scorm2004API} API
           */
          constructor(API) {
            super(API);
          }

          #continue = 'unknown';
          #previous = 'unknown';

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
            throwReadOnlyError(this.API);
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
            throwReadOnlyError(this.API);
          }

          choice = class {
            _isTargetValid = (_target) => 'unknown';
          }();

          jump = class {
            _isTargetValid = (_target) => 'unknown';
          }();

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
        }(API);
      }

      #request = '_none_';

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
        if (this.API.checkValidFormat(request, regex.NAVEvent)) {
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
    }(API);
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
