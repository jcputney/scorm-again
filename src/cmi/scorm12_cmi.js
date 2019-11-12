// @flow
import {
  BaseCMI,
  checkValidFormat,
  checkValidRange,
  CMIArray,
  CMIScore,
} from './common';
import {scorm12_constants} from '../constants/api_constants';
import {scorm12_error_codes} from '../constants/error_codes';
import {scorm12_regex} from '../regex';
import {ValidationError} from '../exceptions';

const constants = scorm12_constants;
const regex = scorm12_regex;

/**
 * Helper method for throwing Read Only error
 */
export function throwReadOnlyError() {
  throw new ValidationError(scorm12_error_codes.READ_ONLY_ELEMENT);
}

/**
 * Helper method for throwing Write Only error
 */
export function throwWriteOnlyError() {
  throw new ValidationError(scorm12_error_codes.WRITE_ONLY_ELEMENT);
}

/**
 * Helper method for throwing Invalid Set error
 */
function throwInvalidValueError() {
  throw new ValidationError(scorm12_error_codes.INVALID_SET_VALUE);
}

/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} regexPattern
 * @return {boolean}
 */
export function check12ValidFormat(value: String, regexPattern: String) {
  return checkValidFormat(value, regexPattern,
      scorm12_error_codes.TYPE_MISMATCH);
}

/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} rangePattern
 * @return {boolean}
 */
export function check12ValidRange(value: any, rangePattern: String) {
  return checkValidRange(value, rangePattern,
      scorm12_error_codes.VALUE_OUT_OF_RANGE);
}

/**
 * Class representing the cmi object for SCORM 1.2
 */
export class CMI extends BaseCMI {
  #_children = '';
  #_version = '3.4';
  #suspend_data = '';
  #launch_data = '';
  #comments = '';
  #comments_from_lms = '';

  student_data = null;

  /**
   * Constructor for the SCORM 1.2 cmi object
   * @param {string} cmi_children
   * @param {(CMIStudentData|AICCCMIStudentData)} student_data
   * @param {boolean} initialized
   */
  constructor(cmi_children, student_data, initialized: boolean) {
    super();

    if (initialized) this.initialize();

    this.#_children = cmi_children ? cmi_children : constants.cmi_children;
    this.core = new CMICore();
    this.objectives = new CMIObjectives();
    this.student_data = student_data ? student_data : new CMIStudentData();
    this.student_preference = new CMIStudentPreference();
    this.interactions = new CMIInteractions();
  }

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
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
  toJSON() {
    this.jsonString = true;
    const result = {
      'suspend_data': this.suspend_data,
      'launch_data': this.launch_data,
      'comments': this.comments,
      'comments_from_lms': this.comments_from_lms,
      'core': this.core,
      'objectives': this.objectives,
      'student_data': this.student_data,
      'student_preference': this.student_preference,
      'interactions': this.interactions,
    };
    delete this.jsonString;
    return result;
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
    throwInvalidValueError();
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
   * Setter for #_version. Just throws an error.
   * @param {string} _children
   * @private
   */
  set _children(_children) {
    throwInvalidValueError();
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
    if (check12ValidFormat(suspend_data, regex.CMIString4096)) {
      this.#suspend_data = suspend_data;
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
   * Getter for #comments
   * @return {string}
   */
  get comments() {
    return this.#comments;
  }

  /**
   * Setter for #comments
   * @param {string} comments
   */
  set comments(comments) {
    if (check12ValidFormat(comments, regex.CMIString4096)) {
      this.#comments = comments;
    }
  }

  /**
   * Getter for #comments_from_lms
   * @return {string}
   */
  get comments_from_lms() {
    return this.#comments_from_lms;
  }

  /**
   * Setter for #comments_from_lms. Can only be called before  initialization.
   * @param {string} comments_from_lms
   */
  set comments_from_lms(comments_from_lms) {
    !this.initialized ? this.#comments_from_lms = comments_from_lms : throwReadOnlyError();
  }
}

/**
 * Class representing the cmi.core object
 */
class CMICore extends BaseCMI {
  /**
   * Constructor for cmi.core
   */
  constructor() {
    super();

    this.score = new Scorm12CMIScore(
        {
          score_children: constants.score_children,
          score_range: regex.score_range,
          invalidErrorCode: scorm12_error_codes.INVALID_SET_VALUE,
          invalidTypeCode: scorm12_error_codes.TYPE_MISMATCH,
          invalidRangeCode: scorm12_error_codes.VALUE_OUT_OF_RANGE,
        });
  }

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.score?.initialize();
  }

  #_children = constants.core_children;
  #student_id = '';
  #student_name = '';
  #lesson_location = '';
  #credit = '';
  #lesson_status = '';
  #entry = '';
  #total_time = '';
  #lesson_mode = 'normal';
  #exit = '';
  #session_time = '00:00:00';

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
    throwInvalidValueError();
  }

  /**
   * Getter for #student_id
   * @return {string}
   */
  get student_id() {
    return this.#student_id;
  }

  /**
   * Setter for #student_id. Can only be called before  initialization.
   * @param {string} student_id
   */
  set student_id(student_id) {
    !this.initialized ? this.#student_id = student_id : throwReadOnlyError();
  }

  /**
   * Getter for #student_name
   * @return {string}
   */
  get student_name() {
    return this.#student_name;
  }

  /**
   * Setter for #student_name. Can only be called before  initialization.
   * @param {string} student_name
   */
  set student_name(student_name) {
    !this.initialized ? this.#student_name = student_name : throwReadOnlyError();
  }

  /**
   * Getter for #lesson_location
   * @return {string}
   */
  get lesson_location() {
    return this.#lesson_location;
  }

  /**
   * Setter for #lesson_location
   * @param {string} lesson_location
   */
  set lesson_location(lesson_location) {
    if (check12ValidFormat(lesson_location, regex.CMIString256)) {
      this.#lesson_location = lesson_location;
    }
  }

  /**
   * Getter for #credit
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
   * Getter for #lesson_status
   * @return {string}
   */
  get lesson_status() {
    return this.#lesson_status;
  }

  /**
   * Setter for #lesson_status
   * @param {string} lesson_status
   */
  set lesson_status(lesson_status) {
    if (check12ValidFormat(lesson_status, regex.CMIStatus)) {
      this.#lesson_status = lesson_status;
    }
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
   * Getter for #lesson_mode
   * @return {string}
   */
  get lesson_mode() {
    return this.#lesson_mode;
  }

  /**
   * Setter for #lesson_mode. Can only be called before  initialization.
   * @param {string} lesson_mode
   */
  set lesson_mode(lesson_mode) {
    !this.initialized ? this.#lesson_mode = lesson_mode : throwReadOnlyError();
  }

  /**
   * Getter for #exit. Should only be called during JSON export.
   * @return {*}
   */
  get exit() {
    return (!this.jsonString) ? throwWriteOnlyError() : this.#exit;
  }

  /**
   * Setter for #exit
   * @param {string} exit
   */
  set exit(exit) {
    if (check12ValidFormat(exit, regex.CMIExit)) {
      this.#exit = exit;
    }
  }

  /**
   * Getter for #session_time. Should only be called during JSON export.
   * @return {*}
   */
  get session_time() {
    return (!this.jsonString) ? throwWriteOnlyError() : this.#session_time;
  }

  /**
   * Setter for #session_time
   * @param {string} session_time
   */
  set session_time(session_time) {
    if (check12ValidFormat(session_time, regex.CMITimespan)) {
      this.#session_time = session_time;
    }
  }

  /**
   * toJSON for cmi.core
   *
   * @return {
   *    {
   *      student_name: string,
   *      entry: string,
   *      exit: string,
   *      score: Scorm12CMIScore,
   *      student_id: string,
   *      lesson_mode: string,
   *      lesson_location: string,
   *      lesson_status: string,
   *      credit: string,
   *      total_time: string,
   *      session_time: *
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      'student_id': this.student_id,
      'student_name': this.student_name,
      'lesson_location': this.lesson_location,
      'credit': this.credit,
      'lesson_status': this.lesson_status,
      'entry': this.entry,
      'total_time': this.total_time,
      'lesson_mode': this.lesson_mode,
      'exit': this.exit,
      'session_time': this.session_time,
      'score': this.score,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing SCORM 1.2's cmi.objectives object
 */
class CMIObjectives extends CMIArray {
  /**
   * Constructor for cmi.objectives
   */
  constructor() {
    super({
      children: constants.objectives_children,
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
    });
  }
}

/**
 * Class representing SCORM 1.2's cmi.student_data object
 */
export class CMIStudentData extends BaseCMI {
  #_children;
  #mastery_score = '';
  #max_time_allowed = '';
  #time_limit_action = '';

  /**
   * Constructor for cmi.student_data
   * @param {string} student_data_children
   */
  constructor(student_data_children) {
    super();

    this.#_children = student_data_children ?
        student_data_children :
        constants.student_data_children;
  }

  /**
   * Getter for #_children
   * @return {*}
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
    throwInvalidValueError();
  }

  /**
   * Getter for #master_score
   * @return {string}
   */
  get mastery_score() {
    return this.#mastery_score;
  }

  /**
   * Setter for #master_score. Can only be called before  initialization.
   * @param {string} mastery_score
   */
  set mastery_score(mastery_score) {
    !this.initialized ? this.#mastery_score = mastery_score : throwReadOnlyError();
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
    !this.initialized ? this.#max_time_allowed = max_time_allowed : throwReadOnlyError();
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
    !this.initialized ? this.#time_limit_action = time_limit_action : throwReadOnlyError();
  }

  /**
   * toJSON for cmi.student_data
   *
   * @return {
   *    {
   *      max_time_allowed: string,
   *      time_limit_action: string,
   *      mastery_score: string
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      'mastery_score': this.mastery_score,
      'max_time_allowed': this.max_time_allowed,
      'time_limit_action': this.time_limit_action,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing SCORM 1.2's cmi.student_preference object
 */
class CMIStudentPreference extends BaseCMI {
  /**
   * Constructor for cmi.student_preference
   */
  constructor() {
    super();
  }

  #_children = constants.student_preference_children;
  #audio = '';
  #language = '';
  #speed = '';
  #text = '';

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
    throwInvalidValueError();
  }

  /**
   * Getter for #audio
   * @return {string}
   */
  get audio() {
    return this.#audio;
  }

  /**
   * Setter for #audio
   * @param {string} audio
   */
  set audio(audio) {
    if (check12ValidFormat(audio, regex.CMISInteger) &&
        check12ValidRange(audio, regex.audio_range)) {
      this.#audio = audio;
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
    if (check12ValidFormat(language, regex.CMIString256)) {
      this.#language = language;
    }
  }

  /**
   * Getter for #speed
   * @return {string}
   */
  get speed() {
    return this.#speed;
  }

  /**
   * Setter for #speed
   * @param {string} speed
   */
  set speed(speed) {
    if (check12ValidFormat(speed, regex.CMISInteger) &&
        check12ValidRange(speed, regex.speed_range)) {
      this.#speed = speed;
    }
  }

  /**
   * Getter for #text
   * @return {string}
   */
  get text() {
    return this.#text;
  }

  /**
   * Setter for #text
   * @param {string} text
   */
  set text(text) {
    if (check12ValidFormat(text, regex.CMISInteger) &&
        check12ValidRange(text, regex.text_range)) {
      this.#text = text;
    }
  }

  /**
   * toJSON for cmi.student_preference
   *
   * @return {
   *    {
   *      audio: string,
   *      language: string,
   *      speed: string,
   *      text: string
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      'audio': this.audio,
      'language': this.language,
      'speed': this.speed,
      'text': this.text,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing SCORM 1.2's cmi.interactions object
 */
class CMIInteractions extends CMIArray {
  /**
   * Constructor for cmi.interactions
   */
  constructor() {
    super({
      children: constants.interactions_children,
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
    });
  }
}

/**
 * Class representing SCORM 1.2's cmi.interactions.n object
 */
export class CMIInteractionsObject extends BaseCMI {
  /**
   * Constructor for cmi.interactions.n object
   */
  constructor() {
    super();

    this.objectives = new CMIArray({
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
      children: constants.objectives_children,
    });
    this.correct_responses = new CMIArray({
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
      children: constants.correct_responses_children,
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

  #id: '';
  #time: '';
  #type: '';
  #weighting: '';
  #student_response: '';
  #result: '';
  #latency: '';

  /**
   * Getter for #id. Should only be called during JSON export.
   * @return {*}
   */
  get id() {
    return (!this.jsonString) ? throwWriteOnlyError() : this.#id;
  }

  /**
   * Setter for #id
   * @param {string} id
   */
  set id(id) {
    if (check12ValidFormat(id, regex.CMIIdentifier)) {
      this.#id = id;
    }
  }

  /**
   * Getter for #time. Should only be called during JSON export.
   * @return {*}
   */
  get time() {
    return (!this.jsonString) ? throwWriteOnlyError() : this.#time;
  }

  /**
   * Setter for #time
   * @param {string} time
   */
  set time(time) {
    if (check12ValidFormat(time, regex.CMITime)) {
      this.#time = time;
    }
  }

  /**
   * Getter for #type. Should only be called during JSON export.
   * @return {*}
   */
  get type() {
    return (!this.jsonString) ? throwWriteOnlyError() : this.#type;
  }

  /**
   * Setter for #type
   * @param {string} type
   */
  set type(type) {
    if (check12ValidFormat(type, regex.CMIType)) {
      this.#type = type;
    }
  }

  /**
   * Getter for #weighting. Should only be called during JSON export.
   * @return {*}
   */
  get weighting() {
    return (!this.jsonString) ?
        throwWriteOnlyError() :
        this.#weighting;
  }

  /**
   * Setter for #weighting
   * @param {string} weighting
   */
  set weighting(weighting) {
    if (check12ValidFormat(weighting, regex.CMIDecimal) &&
        check12ValidRange(weighting, regex.weighting_range)) {
      this.#weighting = weighting;
    }
  }

  /**
   * Getter for #student_response. Should only be called during JSON export.
   * @return {*}
   */
  get student_response() {
    return (!this.jsonString) ? throwWriteOnlyError() : this.#student_response;
  }

  /**
   * Setter for #student_response
   * @param {string} student_response
   */
  set student_response(student_response) {
    if (check12ValidFormat(student_response, regex.CMIFeedback)) {
      this.#student_response = student_response;
    }
  }

  /**
   * Getter for #result. Should only be called during JSON export.
   * @return {*}
   */
  get result() {
    return (!this.jsonString) ? throwWriteOnlyError() : this.#result;
  }

  /**
   * Setter for #result
   * @param {string} result
   */
  set result(result) {
    if (check12ValidFormat(result, regex.CMIResult)) {
      this.#result = result;
    }
  }

  /**
   * Getter for #latency. Should only be called during JSON export.
   * @return {*}
   */
  get latency() {
    return (!this.jsonString) ? throwWriteOnlyError() : this.#latency;
  }

  /**
   * Setter for #latency
   * @param {string} latency
   */
  set latency(latency) {
    if (check12ValidFormat(latency, regex.CMITimespan)) {
      this.#latency = latency;
    }
  }

  /**
   * toJSON for cmi.interactions.n
   *
   * @return {
   *    {
   *      id: string,
   *      time: string,
   *      type: string,
   *      weighting: string,
   *      student_response: string,
   *      result: string,
   *      latency: string,
   *      objectives: CMIArray,
   *      correct_responses: CMIArray
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      'id': this.id,
      'time': this.time,
      'type': this.type,
      'weighting': this.weighting,
      'student_response': this.student_response,
      'result': this.result,
      'latency': this.latency,
      'objectives': this.objectives,
      'correct_responses': this.correct_responses,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing SCORM 1.2's cmi.objectives.n object
 */
export class CMIObjectivesObject extends BaseCMI {
  /**
   * Constructor for cmi.objectives.n
   */
  constructor() {
    super();

    this.score = new Scorm12CMIScore();
  }

  #id: '';
  #status: '';

  /**
   * Getter for #id
   * @return {""}
   */
  get id() {
    return this.#id;
  }

  /**
   * Setter for #id
   * @param {string} id
   */
  set id(id) {
    if (check12ValidFormat(id, regex.CMIIdentifier)) {
      this.#id = id;
    }
  }

  /**
   * Getter for #status
   * @return {""}
   */
  get status() {
    return this.#status;
  }

  /**
   * Setter for #status
   * @param {string} status
   */
  set status(status) {
    if (check12ValidFormat(status, regex.CMIStatus2)) {
      this.#status = status;
    }
  }

  /**
   * toJSON for cmi.objectives.n
   * @return {
   *    {
   *      id: string,
   *      status: string,
   *      score: Scorm12CMIScore
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      'id': this.id,
      'status': this.status,
      'score': this.score,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing SCORM 1.2's cmi.interactions.n.objectives.n object
 */
export class CMIInteractionsObjectivesObject extends BaseCMI {
  /**
   * Constructor for cmi.interactions.n.objectives.n
   */
  constructor() {
    super();
  }

  #id: '';

  /**
   * Getter for #id
   * @return {""}
   */
  get id() {
    return this.#id;
  }

  /**
   * Setter for #id
   * @param {string} id
   */
  set id(id) {
    if (check12ValidFormat(id, regex.CMIIdentifier)) {
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
 * Class representing SCORM 1.2's cmi.interactions.correct_responses.n object
 */
export class CMIInteractionsCorrectResponsesObject extends BaseCMI {
  /**
   * Constructor for cmi.interactions.correct_responses.n
   */
  constructor() {
    super();
  }

  #pattern: '';

  /**
   * Getter for #pattern
   * @return {""}
   */
  get pattern() {
    return this.#pattern;
  }

  /**
   * Setter for #pattern
   * @param {string} pattern
   */
  set pattern(pattern) {
    if (check12ValidFormat(pattern, regex.CMIFeedback)) {
      this.#pattern = pattern;
    }
  }

  /**
   * toJSON for cmi.interactions.correct_responses.n
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
 * Basic extension of CMIScore
 */
class Scorm12CMIScore extends CMIScore {
  toJSON = super.toJSON;
}
