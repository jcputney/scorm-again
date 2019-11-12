import * as Scorm12CMI from './scorm12_cmi';
import {BaseCMI, CMIArray, CMIScore} from './common';
import {aicc_constants} from '../constants/api_constants';
import {aicc_regex} from '../regex';
import {scorm12_error_codes} from '../constants/error_codes';
import {ValidationError} from '../exceptions';
import {check12ValidFormat} from './scorm12_cmi';
import {throwReadOnlyError} from './scorm12_cmi';
import {throwWriteOnlyError} from './scorm12_cmi';

const constants = aicc_constants;
const regex = aicc_regex;

/**
 * CMI Class for AICC
 */
export class CMI extends Scorm12CMI.CMI {
  /**
   * Constructor for AICC CMI object
   * @param {boolean} initialized
   */
  constructor(initialized: boolean) {
    super(constants.cmi_children);

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
}

/**
 * Class representing AICC's cmi.evaluation.comments object
 */
class CMIEvaluationComments extends CMIArray {
  /**
   * Constructor for AICC Evaluation Comments object
   */
  constructor() {
    super(constants.comments_children,
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
    super(constants.student_data_children);

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

    this.score = new CMIScore();
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
    if (check12ValidFormat(status, regex.CMIStatus2)) {
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
    if (check12ValidFormat(time, regex.CMITime)) {
      this.#time = time;
    }
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
    if (check12ValidFormat(content, regex.CMIString256)) {
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
    if (check12ValidFormat(location, regex.CMIString256)) {
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
    if (check12ValidFormat(time, regex.CMITime)) {
      this.#time = time;
    }
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
    return (!this.jsonString) ? throwWriteOnlyError() : this.#event;
  }

  /**
   * Setter for #event
   * @param {string} event
   */
  set event(event) {
    if (check12ValidFormat(event, regex.NAVEvent)) {
      this.#event = event;
    }
  }
}
