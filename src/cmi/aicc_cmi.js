import * as Scorm12CMI from './scorm12_cmi';
import {BaseCMI, CMIArray, CMIScore} from './common';
import APIConstants from '../constants/api_constants';
import Regex from '../constants/regex';
import ErrorCodes from '../constants/error_codes';
import {
  check12ValidFormat,
  throwReadOnlyError,
  throwWriteOnlyError,
} from './scorm12_cmi';

const aicc_constants = APIConstants.aicc;
const aicc_regex = Regex.aicc;
const scorm12_error_codes = ErrorCodes.scorm12;

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

    this.student_data = new AICCCMIStudentData();
    this.evaluation = new CMIEvaluation();
  }

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.student_data?.initialize();
    this.evaluation?.initialize();
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
      'evaluation': this.evaluation,
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
    super(aicc_constants.comments_children,
        scorm12_error_codes.INVALID_SET_VALUE);
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
 * Class representing the AICC cmi.student_data.tries object
 */
export class CMITries extends CMIArray {
  /**
   * Constructor for inline Tries Array class
   */
  constructor() {
    super(aicc_constants.tries_children);
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
    if (check12ValidFormat(status, aicc_regex.CMIStatus2)) {
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
    if (check12ValidFormat(time, aicc_regex.CMITime)) {
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
    if (check12ValidFormat(content, aicc_regex.CMIString256)) {
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
    if (check12ValidFormat(location, aicc_regex.CMIString256)) {
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
    if (check12ValidFormat(time, aicc_regex.CMITime)) {
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
