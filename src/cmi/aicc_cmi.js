import * as Scorm12CMI from './scorm12_cmi';
import {BaseCMI, checkValidFormat, CMIArray, CMIScore} from './common';
import APIConstants from '../constants/api_constants';
import Regex from '../constants/regex';
import ErrorCodes from '../constants/error_codes';
import {AICCValidationError} from '../exceptions';

const aicc_constants = APIConstants.aicc;
const aicc_regex = Regex.aicc;
const aicc_error_codes = ErrorCodes.scorm12;

/**
 * Helper method for throwing Read Only error
 */
function throwReadOnlyError() {
  throw new AICCValidationError(aicc_error_codes.READ_ONLY_ELEMENT);
}

/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {*} value
 * @param {string} regexPattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */
function checkAICCValidFormat(
    value: String,
    regexPattern: String,
    allowEmptyString?: boolean) {
  return checkValidFormat(
      value,
      regexPattern,
      aicc_error_codes.TYPE_MISMATCH,
      AICCValidationError,
      allowEmptyString
  );
}

/**
 * CMI Class for AICC
 */
export class CMI extends Scorm12CMI.CMI {
  /**
   * Constructor for AICC CMI object
   * @param {boolean} initialized
   */
  constructor(initialized: boolean) {
    super(aicc_constants.cmi_children);

    if (initialized) this.initialize();

    this.student_preference = new AICCStudentPreferences();
    this.student_data = new AICCCMIStudentData();
    this.student_demographics = new CMIStudentDemographics();
    this.evaluation = new CMIEvaluation();
    this.paths = new CMIPaths();
  }

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.student_preference?.initialize();
    this.student_data?.initialize();
    this.student_demographics?.initialize();
    this.evaluation?.initialize();
    this.paths?.initialize();
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
   *      interactions: CMIInteractions,
   *      paths: CMIPaths
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
      'student_demographics': this.student_demographics,
      'interactions': this.interactions,
      'evaluation': this.evaluation,
      'paths': this.paths,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * AICC Evaluation object
 */
class CMIEvaluation extends BaseCMI {
  /**
   * Constructor for AICC Evaluation object
   */
  constructor() {
    super();

    this.comments = new CMIEvaluationComments();
  }

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.comments?.initialize();
  }

  /**
   * toJSON for cmi.evaluation object
   * @return {{comments: CMIEvaluationComments}}
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      'comments': this.comments,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing AICC's cmi.evaluation.comments object
 */
class CMIEvaluationComments extends CMIArray {
  /**
   * Constructor for AICC Evaluation Comments object
   */
  constructor() {
    super({
      children: aicc_constants.comments_children,
      errorCode: aicc_error_codes.INVALID_SET_VALUE,
      errorClass: AICCValidationError,
    });
  }
}

/**
 * StudentPreferences class for AICC
 */
class AICCStudentPreferences extends Scorm12CMI.CMIStudentPreference {
  /**
   * Constructor for AICC Student Preferences object
   */
  constructor() {
    super(aicc_constants.student_preference_children);

    this.windows = new CMIArray({
      errorCode: aicc_error_codes.INVALID_SET_VALUE,
      errorClass: AICCValidationError,
      children: '',
    });
  }

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.windows?.initialize();
  }

  #lesson_type = '';
  #text_color = '';
  #text_location = '';
  #text_size = '';
  #video = '';

  /**
   * Getter for #lesson_type
   * @return {string}
   */
  get lesson_type(): string {
    return this.#lesson_type;
  }

  /**
   * Setter for #lesson_type
   * @param {string} lesson_type
   */
  set lesson_type(lesson_type: string) {
    if (checkAICCValidFormat(lesson_type, aicc_regex.CMIString256)) {
      this.#lesson_type = lesson_type;
    }
  }

  /**
   * Getter for #text_color
   * @return {string}
   */
  get text_color(): string {
    return this.#text_color;
  }

  /**
   * Setter for #text_color
   * @param {string} text_color
   */
  set text_color(text_color: string) {
    if (checkAICCValidFormat(text_color, aicc_regex.CMIString256)) {
      this.#text_color = text_color;
    }
  }

  /**
   * Getter for #text_location
   * @return {string}
   */
  get text_location(): string {
    return this.#text_location;
  }

  /**
   * Setter for #text_location
   * @param {string} text_location
   */
  set text_location(text_location: string) {
    if (checkAICCValidFormat(text_location, aicc_regex.CMIString256)) {
      this.#text_location = text_location;
    }
  }

  /**
   * Getter for #text_size
   * @return {string}
   */
  get text_size(): string {
    return this.#text_size;
  }

  /**
   * Setter for #text_size
   * @param {string} text_size
   */
  set text_size(text_size: string) {
    if (checkAICCValidFormat(text_size, aicc_regex.CMIString256)) {
      this.#text_size = text_size;
    }
  }

  /**
   * Getter for #video
   * @return {string}
   */
  get video(): string {
    return this.#video;
  }

  /**
   * Setter for #video
   * @param {string} video
   */
  set video(video: string) {
    if (checkAICCValidFormat(video, aicc_regex.CMIString256)) {
      this.#video = video;
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
      'lesson_type': this.lesson_type,
      'speed': this.speed,
      'text': this.text,
      'text_color': this.text_color,
      'text_location': this.text_location,
      'text_size': this.text_size,
      'video': this.video,
      'windows': this.windows,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * StudentData class for AICC
 */
class AICCCMIStudentData extends Scorm12CMI.CMIStudentData {
  /**
   * Constructor for AICC StudentData object
   */
  constructor() {
    super(aicc_constants.student_data_children);

    this.tries = new CMITries();
  }

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.tries?.initialize();
  }

  #tries_during_lesson = '';

  /**
   * Getter for tries_during_lesson
   * @return {string}
   */
  get tries_during_lesson() {
    return this.#tries_during_lesson;
  }

  /**
   * Setter for #tries_during_lesson. Sets an error if trying to set after
   *  initialization.
   * @param {string} tries_during_lesson
   */
  set tries_during_lesson(tries_during_lesson) {
    !this.initialized ?
        this.#tries_during_lesson = tries_during_lesson :
        throwReadOnlyError();
  }

  /**
   * toJSON for cmi.student_data object
   * @return {
   *    {
   *      mastery_score: string,
   *      max_time_allowed: string,
   *      time_limit_action: string,
   *      tries: CMITries
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      'mastery_score': this.mastery_score,
      'max_time_allowed': this.max_time_allowed,
      'time_limit_action': this.time_limit_action,
      'tries': this.tries,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing the AICC cmi.student_demographics object
 */
export class CMIStudentDemographics extends BaseCMI {
  /**
   * Constructor for AICC StudentDemographics object
   */
  constructor() {
    super();
  }

  #_children = aicc_constants.student_demographics_children;
  #city = '';
  #class = '';
  #company = '';
  #country = '';
  #experience = '';
  #familiar_name = '';
  #instructor_name = '';
  #title = '';
  #native_language = '';
  #state = '';
  #street_address = '';
  #telephone = '';
  #years_experience = '';

  /**
   * Getter for _children
   * @return {string}
   */
  get _children() {
    return this.#_children;
  }

  /**
   * Getter for city
   * @return {string}
   */
  get city() {
    return this.#city;
  }

  /**
   * Setter for #city. Sets an error if trying to set after
   *  initialization.
   * @param {string} city
   */
  set city(city) {
    !this.initialized ?
        this.#city = city :
        throwReadOnlyError();
  }

  /**
   * Getter for class
   * @return {string}
   */
  get class() {
    return this.#class;
  }

  /**
   * Setter for #class. Sets an error if trying to set after
   *  initialization.
   * @param {string} clazz
   */
  set class(clazz) {
    !this.initialized ?
        this.#class = clazz :
        throwReadOnlyError();
  }

  /**
   * Getter for company
   * @return {string}
   */
  get company() {
    return this.#company;
  }

  /**
   * Setter for #company. Sets an error if trying to set after
   *  initialization.
   * @param {string} company
   */
  set company(company) {
    !this.initialized ?
        this.#company = company :
        throwReadOnlyError();
  }

  /**
   * Getter for country
   * @return {string}
   */
  get country() {
    return this.#country;
  }

  /**
   * Setter for #country. Sets an error if trying to set after
   *  initialization.
   * @param {string} country
   */
  set country(country) {
    !this.initialized ?
        this.#country = country :
        throwReadOnlyError();
  }

  /**
   * Getter for experience
   * @return {string}
   */
  get experience() {
    return this.#experience;
  }

  /**
   * Setter for #experience. Sets an error if trying to set after
   *  initialization.
   * @param {string} experience
   */
  set experience(experience) {
    !this.initialized ?
        this.#experience = experience :
        throwReadOnlyError();
  }

  /**
   * Getter for familiar_name
   * @return {string}
   */
  get familiar_name() {
    return this.#familiar_name;
  }

  /**
   * Setter for #familiar_name. Sets an error if trying to set after
   *  initialization.
   * @param {string} familiar_name
   */
  set familiar_name(familiar_name) {
    !this.initialized ?
        this.#familiar_name = familiar_name :
        throwReadOnlyError();
  }

  /**
   * Getter for instructor_name
   * @return {string}
   */
  get instructor_name() {
    return this.#instructor_name;
  }

  /**
   * Setter for #instructor_name. Sets an error if trying to set after
   *  initialization.
   * @param {string} instructor_name
   */
  set instructor_name(instructor_name) {
    !this.initialized ?
        this.#instructor_name = instructor_name :
        throwReadOnlyError();
  }

  /**
   * Getter for title
   * @return {string}
   */
  get title() {
    return this.#title;
  }

  /**
   * Setter for #title. Sets an error if trying to set after
   *  initialization.
   * @param {string} title
   */
  set title(title) {
    !this.initialized ?
        this.#title = title :
        throwReadOnlyError();
  }

  /**
   * Getter for native_language
   * @return {string}
   */
  get native_language() {
    return this.#native_language;
  }

  /**
   * Setter for #native_language. Sets an error if trying to set after
   *  initialization.
   * @param {string} native_language
   */
  set native_language(native_language) {
    !this.initialized ?
        this.#native_language = native_language :
        throwReadOnlyError();
  }

  /**
   * Getter for state
   * @return {string}
   */
  get state() {
    return this.#state;
  }

  /**
   * Setter for #state. Sets an error if trying to set after
   *  initialization.
   * @param {string} state
   */
  set state(state) {
    !this.initialized ?
        this.#state = state :
        throwReadOnlyError();
  }

  /**
   * Getter for street_address
   * @return {string}
   */
  get street_address() {
    return this.#street_address;
  }

  /**
   * Setter for #street_address. Sets an error if trying to set after
   *  initialization.
   * @param {string} street_address
   */
  set street_address(street_address) {
    !this.initialized ?
        this.#street_address = street_address :
        throwReadOnlyError();
  }

  /**
   * Getter for telephone
   * @return {string}
   */
  get telephone() {
    return this.#telephone;
  }

  /**
   * Setter for #telephone. Sets an error if trying to set after
   *  initialization.
   * @param {string} telephone
   */
  set telephone(telephone) {
    !this.initialized ?
        this.#telephone = telephone :
        throwReadOnlyError();
  }

  /**
   * Getter for years_experience
   * @return {string}
   */
  get years_experience() {
    return this.#years_experience;
  }

  /**
   * Setter for #years_experience. Sets an error if trying to set after
   *  initialization.
   * @param {string} years_experience
   */
  set years_experience(years_experience) {
    !this.initialized ?
        this.#years_experience = years_experience :
        throwReadOnlyError();
  }

  /**
   * toJSON for cmi.student_demographics object
   * @return {
   *      {
   *        city: string,
   *        class: string,
   *        company: string,
   *        country: string,
   *        experience: string,
   *        familiar_name: string,
   *        instructor_name: string,
   *        title: string,
   *        native_language: string,
   *        state: string,
   *        street_address: string,
   *        telephone: string,
   *        years_experience: string
   *      }
   *    }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      'city': this.city,
      'class': this.class,
      'company': this.company,
      'country': this.country,
      'experience': this.experience,
      'familiar_name': this.familiar_name,
      'instructor_name': this.instructor_name,
      'title': this.title,
      'native_language': this.native_language,
      'state': this.state,
      'street_address': this.street_address,
      'telephone': this.telephone,
      'years_experience': this.years_experience,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing the AICC cmi.paths object
 */
export class CMIPaths extends CMIArray {
  /**
   * Constructor for inline Paths Array class
   */
  constructor() {
    super({children: aicc_constants.paths_children});
  }
}

/**
 * Class for AICC Paths
 */
export class CMIPathsObject extends BaseCMI {
  /**
   * Constructor for AICC Paths objects
   */
  constructor() {
    super();
  }

  #location_id = '';
  #date = '';
  #time = '';
  #status = '';
  #why_left = '';
  #time_in_element = '';

  /**
   * Getter for #location_id
   * @return {string}
   */
  get location_id() {
    return this.#location_id;
  }

  /**
   * Setter for #location_id
   * @param {string} location_id
   */
  set location_id(location_id) {
    if (checkAICCValidFormat(location_id, aicc_regex.CMIString256)) {
      this.#location_id = location_id;
    }
  }

  /**
   * Getter for #date
   * @return {string}
   */
  get date() {
    return this.#date;
  }

  /**
   * Setter for #date
   * @param {string} date
   */
  set date(date) {
    if (checkAICCValidFormat(date, aicc_regex.CMIString256)) {
      this.#date = date;
    }
  }

  /**
   * Getter for #time
   * @return {string}
   */
  get time() {
    return this.#time;
  }

  /**
   * Setter for #time
   * @param {string} time
   */
  set time(time) {
    if (checkAICCValidFormat(time, aicc_regex.CMITime)) {
      this.#time = time;
    }
  }

  /**
   * Getter for #status
   * @return {string}
   */
  get status() {
    return this.#status;
  }

  /**
   * Setter for #status
   * @param {string} status
   */
  set status(status) {
    if (checkAICCValidFormat(status, aicc_regex.CMIStatus2)) {
      this.#status = status;
    }
  }

  /**
   * Getter for #why_left
   * @return {string}
   */
  get why_left() {
    return this.#why_left;
  }

  /**
   * Setter for #why_left
   * @param {string} why_left
   */
  set why_left(why_left) {
    if (checkAICCValidFormat(why_left, aicc_regex.CMIString256)) {
      this.#why_left = why_left;
    }
  }

  /**
   * Getter for #time_in_element
   * @return {string}
   */
  get time_in_element() {
    return this.#time_in_element;
  }

  /**
   * Setter for #time_in_element
   * @param {string} time_in_element
   */
  set time_in_element(time_in_element) {
    if (checkAICCValidFormat(time_in_element, aicc_regex.CMITime)) {
      this.#time_in_element = time_in_element;
    }
  }

  /**
   * toJSON for cmi.paths.n object
   * @return {
   *    {
   *      location_id: string,
   *      date: string,
   *      time: string,
   *      status: string,
   *      why_left: string,
   *      time_in_element: string
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      'location_id': this.location_id,
      'date': this.date,
      'time': this.time,
      'status': this.status,
      'why_left': this.why_left,
      'time_in_element': this.time_in_element,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing the AICC cmi.student_data.tries object
 */
export class CMITries extends CMIArray {
  /**
   * Constructor for inline Tries Array class
   */
  constructor() {
    super({children: aicc_constants.tries_children});
  }
}

/**
 * Class for AICC Tries
 */
export class CMITriesObject extends BaseCMI {
  /**
   * Constructor for AICC Tries object
   */
  constructor() {
    super();

    this.score = new CMIScore(
        {
          score_children: aicc_constants.score_children,
          score_range: aicc_regex.score_range,
          invalidErrorCode: aicc_error_codes.INVALID_SET_VALUE,
          invalidTypeCode: aicc_error_codes.TYPE_MISMATCH,
          invalidRangeCode: aicc_error_codes.VALUE_OUT_OF_RANGE,
          errorClass: AICCValidationError,
        });
  }

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.score?.initialize();
  }

  #status = '';
  #time = '';

  /**
   * Getter for #status
   * @return {string}
   */
  get status() {
    return this.#status;
  }

  /**
   * Setter for #status
   * @param {string} status
   */
  set status(status) {
    if (checkAICCValidFormat(status, aicc_regex.CMIStatus2)) {
      this.#status = status;
    }
  }

  /**
   * Getter for #time
   * @return {string}
   */
  get time() {
    return this.#time;
  }

  /**
   * Setter for #time
   * @param {string} time
   */
  set time(time) {
    if (checkAICCValidFormat(time, aicc_regex.CMITime)) {
      this.#time = time;
    }
  }

  /**
   * toJSON for cmi.student_data.tries.n object
   * @return {
   *    {
   *      status: string,
   *      time: string,
   *      score: CMIScore
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      'status': this.status,
      'time': this.time,
      'score': this.score,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class for cmi.student_data.attempt_records array
 */
export class CMIAttemptRecords extends CMIArray {
  /**
   * Constructor for inline Tries Array class
   */
  constructor() {
    super({children: aicc_constants.attempt_records_children});
  }
}

/**
 * Class for AICC Attempt Records
 */
export class CMIAttemptRecordsObject extends BaseCMI {
  /**
   * Constructor for AICC Attempt Records object
   */
  constructor() {
    super();

    this.score = new CMIScore(
        {
          score_children: aicc_constants.score_children,
          score_range: aicc_regex.score_range,
          invalidErrorCode: aicc_error_codes.INVALID_SET_VALUE,
          invalidTypeCode: aicc_error_codes.TYPE_MISMATCH,
          invalidRangeCode: aicc_error_codes.VALUE_OUT_OF_RANGE,
          errorClass: AICCValidationError,
        });
  }

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.score?.initialize();
  }

  #lesson_status = '';

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
    if (checkAICCValidFormat(lesson_status, aicc_regex.CMIStatus2)) {
      this.#lesson_status = lesson_status;
    }
  }

  /**
   * toJSON for cmi.student_data.attempt_records.n object
   * @return {
   *    {
   *      status: string,
   *      time: string,
   *      score: CMIScore
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      'lesson_status': this.lesson_status,
      'score': this.score,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class for AICC Evaluation Comments
 */
export class CMIEvaluationCommentsObject extends BaseCMI {
  /**
   * Constructor for Evaluation Comments
   */
  constructor() {
    super();
  }

  #content = '';
  #location = '';
  #time = '';

  /**
   * Getter for #content
   * @return {string}
   */
  get content() {
    return this.#content;
  }

  /**
   * Setter for #content
   * @param {string} content
   */
  set content(content) {
    if (checkAICCValidFormat(content, aicc_regex.CMIString256)) {
      this.#content = content;
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
    if (checkAICCValidFormat(location, aicc_regex.CMIString256)) {
      this.#location = location;
    }
  }

  /**
   * Getter for #time
   * @return {string}
   */
  get time() {
    return this.#time;
  }

  /**
   * Setting for #time
   * @param {string} time
   */
  set time(time) {
    if (checkAICCValidFormat(time, aicc_regex.CMITime)) {
      this.#time = time;
    }
  }

  /**
   * toJSON for cmi.evaulation.comments.n object
   * @return {
   *    {
   *      content: string,
   *      location: string,
   *      time: string
   *    }
   *  }
   */
  toJSON() {
    this.jsonString = true;
    const result = {
      'content': this.content,
      'location': this.location,
      'time': this.time,
    };
    delete this.jsonString;
    return result;
  }
}
