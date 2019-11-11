// @flow
import {BaseCMI, CMIArray, CMIScore} from './common';
import {scorm12_constants} from '../constants/api_constants';
import {scorm12_error_codes} from '../constants/error_codes';
import {scorm12_regex} from '../regex';

const constants = scorm12_constants;
const regex = scorm12_regex;

/**
 * Helper method for throwing Read Only error
 * @param {Scorm12API} API
 */
function throwReadOnlyError(API) {
  API.throwSCORMError(scorm12_error_codes.READ_ONLY_ELEMENT);
}

/**
 * Helper method for throwing Write Only error
 * @param {Scorm12API} API
 */
function throwWriteOnlyError(API) {
  API.throwSCORMError(scorm12_error_codes.WRITE_ONLY_ELEMENT);
}

/**
 * Helper method for throwing Invalid Set error
 * @param {Scorm12API} API
 */
function throwInvalidValueError(API) {
  API.throwSCORMError(scorm12_error_codes.INVALID_SET_VALUE);
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
   * @param {Scorm12API} API
   * @param {string} cmi_children
   * @param {string} student_data
   */
  constructor(API, cmi_children, student_data) {
    super(API);

    this.#_children = cmi_children ? cmi_children : constants.cmi_children;
    this.core = new CMICore(API);
    this.objectives = new CMIObjectives(API);
    this.student_data = student_data ?
        student_data :
        new CMIStudentData(API);
    this.student_preference = new CMIStudentPreference(API);
    this.interactions = new CMIInteractions(API);
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
    throwInvalidValueError(this.API);
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
    throwInvalidValueError(this.API);
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
    if (this.API.checkValidFormat(suspend_data, regex.CMIString4096)) {
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
   * Setter for #launch_data. Can only be called before API initialization.
   * @param {string} launch_data
   */
  set launch_data(launch_data) {
    this.API.isNotInitialized() ?
        this.#launch_data = launch_data :
        throwReadOnlyError(this.API);
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
    if (this.API.checkValidFormat(comments, regex.CMIString4096)) {
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
   * Setter for #comments_from_lms. Can only be called before API initialization.
   * @param {string} comments_from_lms
   */
  set comments_from_lms(comments_from_lms) {
    this.API.isNotInitialized() ?
        this.#comments_from_lms = comments_from_lms :
        throwReadOnlyError(this.API);
  }
}

/**
 * Class representing the cmi.core object
 */
class CMICore extends BaseCMI {
  /**
   * Constructor for cmi.core
   * @param {Scorm12API} API
   */
  constructor(API) {
    super(API);

    this.score = new Scorm12CMIScore(API, constants.score_children,
        regex.score_range);
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
    throwInvalidValueError(this.API);
  }

  /**
   * Getter for #student_id
   * @return {string}
   */
  get student_id() {
    return this.#student_id;
  }

  /**
   * Setter for #student_id. Can only be called before API initialization.
   * @param {string} student_id
   */
  set student_id(student_id) {
    this.API.isNotInitialized() ?
        this.#student_id = student_id :
        throwReadOnlyError(this.API);
  }

  /**
   * Getter for #student_name
   * @return {string}
   */
  get student_name() {
    return this.#student_name;
  }

  /**
   * Setter for #student_name. Can only be called before API initialization.
   * @param {string} student_name
   */
  set student_name(student_name) {
    this.API.isNotInitialized() ?
        this.#student_name = student_name :
        throwReadOnlyError(this.API);
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
    if (this.API.checkValidFormat(lesson_location, regex.CMIString256)) {
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
   * Setter for #credit. Can only be called before API initialization.
   * @param {string} credit
   */
  set credit(credit) {
    this.API.isNotInitialized() ?
        this.#credit = credit :
        throwReadOnlyError(this.API);
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
    if (this.API.checkValidFormat(lesson_status, regex.CMIStatus)) {
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
   * Setter for #entry. Can only be called before API initialization.
   * @param {string} entry
   */
  set entry(entry) {
    this.API.isNotInitialized() ?
        this.#entry = entry :
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
   * Getter for #lesson_mode
   * @return {string}
   */
  get lesson_mode() {
    return this.#lesson_mode;
  }

  /**
   * Setter for #lesson_mode. Can only be called before API initialization.
   * @param {string} lesson_mode
   */
  set lesson_mode(lesson_mode) {
    this.API.isNotInitialized() ?
        this.#lesson_mode = lesson_mode :
        throwReadOnlyError(this.API);
  }

  /**
   * Getter for #exit. Should only be called during JSON export.
   * @return {*}
   */
  get exit() {
    return (!this.jsonString) ? throwWriteOnlyError(this.API) : this.#exit;
  }

  /**
   * Setter for #exit
   * @param {string} exit
   */
  set exit(exit) {
    if (this.API.checkValidFormat(exit, regex.CMIExit)) {
      this.#exit = exit;
    }
  }

  /**
   * Getter for #session_time. Should only be called during JSON export.
   * @return {*}
   */
  get session_time() {
    return (!this.jsonString) ?
        throwWriteOnlyError(this.API) :
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
   * @param {Scorm12API} API
   */
  constructor(API) {
    super({
      API: API,
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
   * @param {Scorm12API} API
   * @param {string} student_data_children
   */
  constructor(API, student_data_children) {
    super(API);

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
    throwInvalidValueError(this.API);
  }

  /**
   * Getter for #master_score
   * @return {string}
   */
  get mastery_score() {
    return this.#mastery_score;
  }

  /**
   * Setter for #master_score. Can only be called before API initialization.
   * @param {string} mastery_score
   */
  set mastery_score(mastery_score) {
    this.API.isNotInitialized() ?
        this.#mastery_score = mastery_score :
        throwReadOnlyError(this.API);
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
   * @param {Scorm12API} API
   */
  constructor(API) {
    super(API);
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
    throwInvalidValueError(this.API);
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
    if (this.API.checkValidFormat(audio, regex.CMISInteger) &&
        this.API.checkValidRange(audio, regex.audio_range)) {
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
    if (this.API.checkValidFormat(language, regex.CMIString256)) {
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
    if (this.API.checkValidFormat(speed, regex.CMISInteger) &&
        this.API.checkValidRange(speed, regex.speed_range)) {
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
    if (this.API.checkValidFormat(text, regex.CMISInteger) &&
        this.API.checkValidRange(text, regex.text_range)) {
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
   * @param {Scorm12API} API
   */
  constructor(API) {
    super({
      API: API,
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
   * @param {Scorm12API} API
   */
  constructor(API) {
    super(API);

    this.objectives = new CMIArray({
      API: API,
      errorCode: 402,
      children: constants.objectives_children,
    });
    this.correct_responses = new CMIArray({
      API: API,
      errorCode: 402,
      children: constants.correct_responses_children,
    });
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
    return (!this.jsonString) ? throwWriteOnlyError(this.API) : this.#id;
  }

  /**
   * Setter for #id
   * @param {string} id
   */
  set id(id) {
    if (this.API.checkValidFormat(id, regex.CMIIdentifier)) {
      this.#id = id;
    }
  }

  /**
   * Getter for #time. Should only be called during JSON export.
   * @return {*}
   */
  get time() {
    return (!this.jsonString) ? throwWriteOnlyError(this.API) : this.#time;
  }

  /**
   * Setter for #time
   * @param {string} time
   */
  set time(time) {
    if (this.API.checkValidFormat(time, regex.CMITime)) {
      this.#time = time;
    }
  }

  /**
   * Getter for #type. Should only be called during JSON export.
   * @return {*}
   */
  get type() {
    return (!this.jsonString) ? throwWriteOnlyError(this.API) : this.#type;
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
   * Getter for #weighting. Should only be called during JSON export.
   * @return {*}
   */
  get weighting() {
    return (!this.jsonString) ?
        throwWriteOnlyError(this.API) :
        this.#weighting;
  }

  /**
   * Setter for #weighting
   * @param {string} weighting
   */
  set weighting(weighting) {
    if (this.API.checkValidFormat(weighting, regex.CMIDecimal) &&
        this.API.checkValidRange(weighting, regex.weighting_range)) {
      this.#weighting = weighting;
    }
  }

  /**
   * Getter for #student_response. Should only be called during JSON export.
   * @return {*}
   */
  get student_response() {
    return (!this.jsonString) ?
        throwWriteOnlyError(this.API) :
        this.#student_response;
  }

  /**
   * Setter for #student_response
   * @param {string} student_response
   */
  set student_response(student_response) {
    if (this.API.checkValidFormat(student_response, regex.CMIFeedback)) {
      this.#student_response = student_response;
    }
  }

  /**
   * Getter for #result. Should only be called during JSON export.
   * @return {*}
   */
  get result() {
    return (!this.jsonString) ?
        throwWriteOnlyError(this.API) :
        this.#result;
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
   * Getter for #latency. Should only be called during JSON export.
   * @return {*}
   */
  get latency() {
    return (!this.jsonString) ?
        throwWriteOnlyError(this.API) :
        this.#latency;
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
   * @param {Scorm12API} API
   */
  constructor(API) {
    super(API);

    this.score = new Scorm12CMIScore(API);
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
    if (this.API.checkValidFormat(id, regex.CMIIdentifier)) {
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
    if (this.API.checkValidFormat(status, regex.CMIStatus2)) {
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
   * @param {Scorm12API} API
   */
  constructor(API) {
    super(API);
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
    if (this.API.checkValidFormat(id, regex.CMIIdentifier)) {
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
   * @param {Scorm12API} API
   */
  constructor(API) {
    super(API);
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
    if (this.API.checkValidFormat(pattern, regex.CMIFeedback)) {
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
