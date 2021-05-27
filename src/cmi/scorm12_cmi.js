// @flow
import {
  BaseCMI,
  checkValidFormat,
  checkValidRange,
  CMIArray,
  CMIScore,
} from './common';
import APIConstants from '../constants/api_constants';
import ErrorCodes from '../constants/error_codes';
import Regex from '../constants/regex';
import {Scorm12ValidationError} from '../exceptions';
import * as Utilities from '../utilities';
import * as Util from '../utilities';

const scorm12_constants = APIConstants.scorm12;
const scorm12_regex = Regex.scorm12;
const scorm12_error_codes = ErrorCodes.scorm12;

/**
 * Helper method for throwing Read Only error
 */
export function throwReadOnlyError() {
  throw new Scorm12ValidationError(scorm12_error_codes.READ_ONLY_ELEMENT);
}

/**
 * Helper method for throwing Write Only error
 */
export function throwWriteOnlyError() {
  throw new Scorm12ValidationError(scorm12_error_codes.WRITE_ONLY_ELEMENT);
}

/**
 * Helper method for throwing Invalid Set error
 */
function throwInvalidValueError() {
  throw new Scorm12ValidationError(scorm12_error_codes.INVALID_SET_VALUE);
}

/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} regexPattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */
export function check12ValidFormat(
    value: String,
    regexPattern: String,
    allowEmptyString?: boolean) {
  return checkValidFormat(
      value,
      regexPattern,
      scorm12_error_codes.TYPE_MISMATCH,
      Scorm12ValidationError,
      allowEmptyString
  );
}

/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} rangePattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */
export function check12ValidRange(
    value: any,
    rangePattern: String,
    allowEmptyString?: boolean) {
  return checkValidRange(
      value,
      rangePattern,
      scorm12_error_codes.VALUE_OUT_OF_RANGE,
      Scorm12ValidationError,
      allowEmptyString
  );
}

/**
 * Class representing the cmi object for SCORM 1.2
 */
export class CMI extends BaseCMI {
  #_children = '';
  #_version = '3.4';
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

    this.#_children = cmi_children ?
        cmi_children :
        scorm12_constants.cmi_children;
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
   */
  get _version() {
    return this.#_version;
  }

  /**
   * Setter for #_version. Just throws an error.
   * @param {string} _version
   */
  set _version(_version) {
    throwInvalidValueError();
  }

  /**
   * Getter for #_children
   * @return {string}
   */
  get _children() {
    return this.#_children;
  }

  /**
   * Setter for #_version. Just throws an error.
   * @param {string} _children
   */
  set _children(_children) {
    throwInvalidValueError();
  }

  /**
   * Getter for #suspend_data
   * @return {string}
   */
  get suspend_data() {
    return this.core?.suspend_data;
  }

  /**
   * Setter for #suspend_data
   * @param {string} suspend_data
   */
  set suspend_data(suspend_data) {
    if (this.core) {
      this.core.suspend_data = suspend_data;
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
    if (check12ValidFormat(comments, scorm12_regex.CMIString4096, true)) {
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
    !this.initialized ?
        this.#comments_from_lms = comments_from_lms :
        throwReadOnlyError();
  }

  /**
   * Adds the current session time to the existing total time.
   *
   * @return {string}
   */
  getCurrentTotalTime() {
    return this.core.getCurrentTotalTime(this.start_time);
  }
}

/**
 * Class representing the cmi.core object
 * @extends BaseCMI
 */
class CMICore extends BaseCMI {
  /**
   * Constructor for cmi.core
   */
  constructor() {
    super();

    this.score = new CMIScore(
        {
          score_children: scorm12_constants.score_children,
          score_range: scorm12_regex.score_range,
          invalidErrorCode: scorm12_error_codes.INVALID_SET_VALUE,
          invalidTypeCode: scorm12_error_codes.TYPE_MISMATCH,
          invalidRangeCode: scorm12_error_codes.VALUE_OUT_OF_RANGE,
          errorClass: Scorm12ValidationError,
        });
  }

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.score?.initialize();
  }

  #_children = scorm12_constants.core_children;
  #student_id = '';
  #student_name = '';
  #lesson_location = '';
  #credit = '';
  #lesson_status = 'not attempted';
  #entry = '';
  #total_time = '';
  #lesson_mode = 'normal';
  #exit = '';
  #session_time = '00:00:00';
  #suspend_data = '';

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
    !this.initialized ?
        this.#student_name = student_name :
        throwReadOnlyError();
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
    if (check12ValidFormat(lesson_location, scorm12_regex.CMIString256, true)) {
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
    if (this.initialized) {
      if (check12ValidFormat(lesson_status, scorm12_regex.CMIStatus)) {
        this.#lesson_status = lesson_status;
      }
    } else {
      if (check12ValidFormat(lesson_status, scorm12_regex.CMIStatus2)) {
        this.#lesson_status = lesson_status;
      }
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
    if (check12ValidFormat(exit, scorm12_regex.CMIExit, true)) {
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
    if (check12ValidFormat(session_time, scorm12_regex.CMITimespan)) {
      this.#session_time = session_time;
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
    if (check12ValidFormat(suspend_data, scorm12_regex.CMIString4096, true)) {
      this.#suspend_data = suspend_data;
    }
  }

  /**
   * Adds the current session time to the existing total time.
   * @param {Number} start_time
   * @return {string}
   */
  getCurrentTotalTime(start_time: Number) {
    let sessionTime = this.#session_time;
    const startTime = start_time;

    if (typeof startTime !== 'undefined' && startTime !== null) {
      const seconds = new Date().getTime() - startTime;
      sessionTime = Util.getSecondsAsHHMMSS(seconds / 1000);
    }

    return Utilities.addHHMMSSTimeStrings(
        this.#total_time,
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
 * @extends CMIArray
 */
class CMIObjectives extends CMIArray {
  /**
   * Constructor for cmi.objectives
   */
  constructor() {
    super({
      children: scorm12_constants.objectives_children,
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
      errorClass: Scorm12ValidationError,
    });
  }
}

/**
 * Class representing SCORM 1.2's cmi.student_data object
 * @extends BaseCMI
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
        scorm12_constants.student_data_children;
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
    !this.initialized ?
        this.#mastery_score = mastery_score :
        throwReadOnlyError();
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
 * @extends BaseCMI
 */
export class CMIStudentPreference extends BaseCMI {
  #_children;

  /**
   * Constructor for cmi.student_preference
   * @param {string} student_preference_children
   */
  constructor(student_preference_children) {
    super();

    this.#_children = student_preference_children ?
        student_preference_children :
        scorm12_constants.student_preference_children;
  }

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
    if (check12ValidFormat(audio, scorm12_regex.CMISInteger) &&
        check12ValidRange(audio, scorm12_regex.audio_range)) {
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
    if (check12ValidFormat(language, scorm12_regex.CMIString256)) {
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
    if (check12ValidFormat(speed, scorm12_regex.CMISInteger) &&
        check12ValidRange(speed, scorm12_regex.speed_range)) {
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
    if (check12ValidFormat(text, scorm12_regex.CMISInteger) &&
        check12ValidRange(text, scorm12_regex.text_range)) {
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
 * @extends BaseCMI
 */
class CMIInteractions extends CMIArray {
  /**
   * Constructor for cmi.interactions
   */
  constructor() {
    super({
      children: scorm12_constants.interactions_children,
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
      errorClass: Scorm12ValidationError,
    });
  }
}

/**
 * Class representing SCORM 1.2's cmi.interactions.n object
 * @extends BaseCMI
 */
export class CMIInteractionsObject extends BaseCMI {
  /**
   * Constructor for cmi.interactions.n object
   */
  constructor() {
    super();

    this.objectives = new CMIArray({
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
      errorClass: Scorm12ValidationError,
      children: scorm12_constants.objectives_children,
    });
    this.correct_responses = new CMIArray({
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
      errorClass: Scorm12ValidationError,
      children: scorm12_constants.correct_responses_children,
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

  #id = '';
  #time = '';
  #type = '';
  #weighting = '';
  #student_response = '';
  #result = '';
  #latency = '';

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
    if (check12ValidFormat(id, scorm12_regex.CMIIdentifier)) {
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
    if (check12ValidFormat(time, scorm12_regex.CMITime)) {
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
    if (check12ValidFormat(type, scorm12_regex.CMIType)) {
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
    if (check12ValidFormat(weighting, scorm12_regex.CMIDecimal) &&
        check12ValidRange(weighting, scorm12_regex.weighting_range)) {
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
    if (check12ValidFormat(student_response, scorm12_regex.CMIFeedback, true)) {
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
    if (check12ValidFormat(result, scorm12_regex.CMIResult)) {
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
    if (check12ValidFormat(latency, scorm12_regex.CMITimespan)) {
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
 * @extends BaseCMI
 */
export class CMIObjectivesObject extends BaseCMI {
  /**
   * Constructor for cmi.objectives.n
   */
  constructor() {
    super();

    this.score = new CMIScore(
        {
          score_children: scorm12_constants.score_children,
          score_range: scorm12_regex.score_range,
          invalidErrorCode: scorm12_error_codes.INVALID_SET_VALUE,
          invalidTypeCode: scorm12_error_codes.TYPE_MISMATCH,
          invalidRangeCode: scorm12_error_codes.VALUE_OUT_OF_RANGE,
          errorClass: Scorm12ValidationError,
        });
  }

  #id = '';
  #status = '';

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
    if (check12ValidFormat(id, scorm12_regex.CMIIdentifier)) {
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
    if (check12ValidFormat(status, scorm12_regex.CMIStatus2)) {
      this.#status = status;
    }
  }

  /**
   * toJSON for cmi.objectives.n
   * @return {
   *    {
   *      id: string,
   *      status: string,
   *      score: CMIScore
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
 * @extends BaseCMI
 */
export class CMIInteractionsObjectivesObject extends BaseCMI {
  /**
   * Constructor for cmi.interactions.n.objectives.n
   */
  constructor() {
    super();
  }

  #id = '';

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
    if (check12ValidFormat(id, scorm12_regex.CMIIdentifier)) {
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
 * @extends BaseCMI
 */
export class CMIInteractionsCorrectResponsesObject extends BaseCMI {
  /**
   * Constructor for cmi.interactions.correct_responses.n
   */
  constructor() {
    super();
  }

  #pattern = '';

  /**
   * Getter for #pattern
   * @return {string}
   */
  get pattern() {
    return (!this.jsonString) ? throwWriteOnlyError() : this.#pattern;
  }

  /**
   * Setter for #pattern
   * @param {string} pattern
   */
  set pattern(pattern) {
    if (check12ValidFormat(pattern, scorm12_regex.CMIFeedback, true)) {
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
 * Class for AICC Navigation object
 */
export class NAV extends BaseCMI {
  /**
   * Constructor for NAV object
   */
  constructor() {
    super();
  }

  #event = '';

  /**
   * Getter for #event
   * @return {string}
   */
  get event() {
    return this.#event;
  }

  /**
   * Setter for #event
   * @param {string} event
   */
  set event(event) {
    if (check12ValidFormat(event, scorm12_regex.NAVEvent)) {
      this.#event = event;
    }
  }

  /**
   * toJSON for nav object
   * @return {
   *    {
   *      event: string
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      'event': this.event,
    };
    delete this.jsonString;
    return result;
  }
}
