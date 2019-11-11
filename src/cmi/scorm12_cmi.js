import {BaseCMI, CMIArray, CMIScore} from './common';
import {scorm12_constants, scorm12_error_codes} from '../constants';
import {scorm12_regex} from '../regex';

const constants = scorm12_constants;
const regex = scorm12_regex;

function throwReadOnlyError(API) {
  API.throwSCORMError(scorm12_error_codes.READ_ONLY_ELEMENT);
}

function throwWriteOnlyError(API) {
  API.throwSCORMError(scorm12_error_codes.WRITE_ONLY_ELEMENT);
}

function throwInvalidValueError(API) {
  API.throwSCORMError(scorm12_error_codes.INVALID_SET_VALUE);
}

export class CMI extends BaseCMI {
    #_children = '';
    #_version = '3.4';
    #suspend_data = '';
    #launch_data = '';
    #comments = '';
    #comments_from_lms = '';

    student_data = null;

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

    toJSON = () => {
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
    };

    get _version() {
      return this.#_version;
    }

    set _version(_version) {
      throwInvalidValueError(this.API);
    }

    get _children() {
      return this.#_children;
    }

    set _children(_children) {
      throwInvalidValueError(this.API);
    }

    get suspend_data() {
      return this.#suspend_data;
    }
    set suspend_data(suspend_data) {
      if (this.API.checkValidFormat(suspend_data, regex.CMIString4096)) {
        this.#suspend_data = suspend_data;
      }
    }

    get launch_data() {
      return this.#launch_data;
    }

    set launch_data(launch_data) {
        this.API.isNotInitialized() ?
            this.#launch_data = launch_data :
            throwReadOnlyError(this.API);
    }

    get comments() {
      return this.#comments;
    }
    set comments(comments) {
      if (this.API.checkValidFormat(comments, regex.CMIString4096)) {
        this.#comments = comments;
      }
    }

    get comments_from_lms() {
      return this.#comments_from_lms;
    }

    set comments_from_lms(comments_from_lms) {
        this.API.isNotInitialized() ?
            this.#comments_from_lms = comments_from_lms :
            throwReadOnlyError(this.API);
    }
}

class CMICore extends BaseCMI {
  constructor(API) {
    super(API);

    this.score = new CMIScore(API, constants.score_children,
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

    get _children() {
      return this.#_children;
    }

    set _children(_children) {
      throwInvalidValueError(this.API);
    }

    get student_id() {
      return this.#student_id;
    }

    set student_id(student_id) {
        this.API.isNotInitialized() ?
            this.#student_id = student_id :
            throwReadOnlyError(this.API);
    }

    get student_name() {
      return this.#student_name;
    }

    set student_name(student_name) {
        this.API.isNotInitialized() ?
            this.#student_name = student_name :
            throwReadOnlyError(this.API);
    }

    get lesson_location() {
      return this.#lesson_location;
    }
    set lesson_location(lesson_location) {
      if (this.API.checkValidFormat(lesson_location, regex.CMIString256)) {
        this.#lesson_location = lesson_location;
      }
    }

    get credit() {
      return this.#credit;
    }

    set credit(credit) {
        this.API.isNotInitialized() ?
            this.#credit = credit :
            throwReadOnlyError(this.API);
    }

    get lesson_status() {
      return this.#lesson_status;
    }
    set lesson_status(lesson_status) {
      if (this.API.checkValidFormat(lesson_status, regex.CMIStatus)) {
        this.#lesson_status = lesson_status;
      }
    }

    get entry() {
      return this.#entry;
    }

    set entry(entry) {
        this.API.isNotInitialized() ?
            this.#entry = entry :
            throwReadOnlyError(this.API);
    }

    get total_time() {
      return this.#total_time;
    }

    set total_time(total_time) {
        this.API.isNotInitialized() ?
            this.#total_time = total_time :
            throwReadOnlyError(this.API);
    }

    get lesson_mode() {
      return this.#lesson_mode;
    }

    set lesson_mode(lesson_mode) {
        this.API.isNotInitialized() ?
            this.#lesson_mode = lesson_mode :
            throwReadOnlyError(this.API);
    }

    get exit() {
      return (!this.jsonString) ? throwWriteOnlyError(this.API) : this.#exit;
    }
    set exit(exit) {
      if (this.API.checkValidFormat(exit, regex.CMIExit)) {
        this.#exit = exit;
      }
    }

    get session_time() {
      return (!this.jsonString) ?
            throwWriteOnlyError(this.API) :
            this.#session_time;
    }
    set session_time(session_time) {
      if (this.API.checkValidFormat(session_time, regex.CMITimespan)) {
        this.#session_time = session_time;
      }
    }

    toJSON = () => {
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

class CMIObjectives extends CMIArray {
  constructor(API) {
    super({
      API: API,
      children: constants.objectives_children,
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
    });
  }
}


export class CMIStudentData extends BaseCMI {
    #_children;
    #mastery_score = '';
    #max_time_allowed = '';
    #time_limit_action = '';

    constructor(API, student_data_children) {
      super(API);

      this.#_children = student_data_children ?
            student_data_children :
            constants.student_data_children;
    }

    get _children() {
      return this.#_children;
    }

    set _children(_children) {
      throwInvalidValueError(this.API);
    }

    get mastery_score() {
      return this.#mastery_score;
    }

    set mastery_score(mastery_score) {
        this.API.isNotInitialized() ?
            this.#mastery_score = mastery_score :
            throwReadOnlyError(this.API);
    }

    get max_time_allowed() {
      return this.#max_time_allowed;
    }

    set max_time_allowed(max_time_allowed) {
        this.API.isNotInitialized() ?
            this.#max_time_allowed = max_time_allowed :
            throwReadOnlyError(this.API);
    }

    get time_limit_action() {
      return this.#time_limit_action;
    }

    set time_limit_action(time_limit_action) {
        this.API.isNotInitialized() ?
            this.#time_limit_action = time_limit_action :
            throwReadOnlyError(this.API);
    }

    toJSON = () => {
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

class CMIStudentPreference extends BaseCMI {
  constructor(API) {
    super(API);
  }

    #_children = constants.student_preference_children;
    #audio = '';
    #language = '';
    #speed = '';
    #text = '';

    get _children() {
      return this.#_children;
    }

    set _children(_children) {
      throwInvalidValueError(this.API);
    }

    get audio() {
      return this.#audio;
    }
    set audio(audio) {
      if (this.API.checkValidFormat(audio, regex.CMISInteger) &&
            this.API.checkValidRange(audio, regex.audio_range)) {
        this.#audio = audio;
      }
    }

    get language() {
      return this.#language;
    }
    set language(language) {
      if (this.API.checkValidFormat(language, regex.CMIString256)) {
        this.#language = language;
      }
    }

    get speed() {
      return this.#speed;
    }
    set speed(speed) {
      if (this.API.checkValidFormat(speed, regex.CMISInteger) &&
            this.API.checkValidRange(speed, regex.speed_range)) {
        this.#speed = speed;
      }
    }

    get text() {
      return this.#text;
    }
    set text(text) {
      if (this.API.checkValidFormat(text, regex.CMISInteger) &&
            this.API.checkValidRange(text, regex.text_range)) {
        this.#text = text;
      }
    }

    toJSON = () => {
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

class CMIInteractions extends CMIArray {
  constructor(API) {
    super({
      API: API,
      children: constants.interactions_children,
      errorCode: scorm12_error_codes.INVALID_SET_VALUE,
    });
  }
}

export class CMIInteractionsObject extends BaseCMI {
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

    #id: "";
    #time: "";
    #type: "";
    #weighting: "";
    #student_response: "";
    #result: "";
    #latency: "";

    get id() {
      return (!this.jsonString) ? throwWriteOnlyError(this.API) : this.#id;
    }
    set id(id) {
      if (this.API.checkValidFormat(id, regex.CMIIdentifier)) {
        this.#id = id;
      }
    }

    get time() {
      return (!this.jsonString) ? throwWriteOnlyError(this.API) : this.#time;
    }
    set time(time) {
      if (this.API.checkValidFormat(time, regex.CMITime)) {
        this.#time = time;
      }
    }

    get type() {
      return (!this.jsonString) ? throwWriteOnlyError(this.API) : this.#type;
    }
    set type(type) {
      if (this.API.checkValidFormat(type, regex.CMIType)) {
        this.#type = type;
      }
    }

    get weighting() {
      return (!this.jsonString) ?
            throwWriteOnlyError(this.API) :
            this.#weighting;
    }
    set weighting(weighting) {
      if (this.API.checkValidFormat(weighting, regex.CMIDecimal) &&
            this.API.checkValidRange(weighting, regex.weighting_range)) {
        this.#weighting = weighting;
      }
    }

    get student_response() {
      return (!this.jsonString) ?
            throwWriteOnlyError(this.API) :
            this.#student_response;
    }
    set student_response(student_response) {
      if (this.API.checkValidFormat(student_response, regex.CMIFeedback)) {
        this.#student_response = student_response;
      }
    }

    get result() {
      return (!this.jsonString) ?
            throwWriteOnlyError(this.API) :
            this.#result;
    }
    set result(result) {
      if (this.API.checkValidFormat(result, regex.CMIResult)) {
        this.#result = result;
      }
    }

    get latency() {
      return (!this.jsonString) ?
            throwWriteOnlyError(this.API) :
            this.#latency;
    }
    set latency(latency) {
      if (this.API.checkValidFormat(latency, regex.CMITimespan)) {
        this.#latency = latency;
      }
    }

    toJSON = () => {
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

export class CMIObjectivesObject extends BaseCMI {
  constructor(API) {
    super(API);

    this.score = new CMIScore(API);
  }

    #id: "";
    #status: "";

    get id() {
      return this.#id;
    }
    set id(id) {
      if (this.API.checkValidFormat(id, regex.CMIIdentifier)) {
        this.#id = id;
      }
    }

    get status() {
      return this.#status;
    }
    set status(status) {
      if (this.API.checkValidFormat(status, regex.CMIStatus2)) {
        this.#status = status;
      }
    }

    toJSON = () => {
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

export class CMIInteractionsObjectivesObject extends BaseCMI {
  constructor(API) {
    super(API);
  }

    #id: "";

    get id() {
      return this.#id;
    }
    set id(id) {
      if (this.API.checkValidFormat(id, regex.CMIIdentifier)) {
        this.#id = id;
      }
    }

    toJSON = () => {
      this.jsonString = true;
      const result = {
        'id': this.id,
      };
      delete this.jsonString;
      return result;
    }
}

export class CMIInteractionsCorrectResponsesObject extends BaseCMI {
  constructor(API) {
    super(API);
  }

    #pattern: "";

    get pattern() {
      return this.#pattern;
    }
    set pattern(pattern) {
      if (this.API.checkValidFormat(pattern, regex.CMIFeedback)) {
        this.#pattern = pattern;
      }
    }

    toJSON = () => {
      this.jsonString = true;
      const result = {
        'pattern': this.pattern,
      };
      delete this.jsonString;
      return result;
    }
}
