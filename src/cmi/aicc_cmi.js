import * as Scorm12CMI from './scorm12_cmi';
import {BaseCMI, CMIArray, CMIScore} from './common';
import {aicc_constants, scorm12_error_codes} from '../constants';
import {aicc_regex} from '../regex';

const constants = aicc_constants;
const regex = aicc_regex;

/**
 * Sets a READ_ONLY error on the API
 * @param {AICC} API
 */
function throwReadOnlyError(API) {
  API.throwSCORMError(scorm12_error_codes.READ_ONLY_ELEMENT);
}

/**
 * CMI Class for AICC
 */
export class CMI extends Scorm12CMI.CMI {
  /**
   * Constructor for AICC CMI object
   * @param {AICC} API
   */
  constructor(API) {
    super(API, constants.cmi_children, new AICCCMIStudentData(API));

    this.evaluation = new CMIEvaluation(API);
  }
}

/**
 * AICC Evaluation object
 */
class CMIEvaluation extends BaseCMI {
  /**
   * Constructor for AICC Evaluation object
   * @param {AICC} API
   */
  constructor(API) {
    super(API);
  }

  comments = new class extends CMIArray {
    /**
     * Constructor for AICC Evaluation Comments object
     * @param {AICC} API
     */
    constructor(API) {
      super(API, constants.comments_children, 402);
    }
  };
}

/**
 * StudentData class for AICC
 */
class AICCCMIStudentData extends Scorm12CMI.CMIStudentData {
  /**
   * Constructor for AICC StudentData object
   * @param {AICC} API
   */
  constructor(API) {
    super(API, constants.student_data_children);
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
   * API initialization.
   * @param {string} tries_during_lesson
   */
  set tries_during_lesson(tries_during_lesson) {
    this.API.isNotInitialized() ?
        this.#tries_during_lesson = tries_during_lesson :
        throwReadOnlyError();
  }

  tries = new class extends CMIArray {
    /**
     * Constructor for inline Tries Array class
     * @param {AICC} API
     */
    constructor(API) {
      super(API, aicc_constants.tries_children);
    }
  };
}

let _self;

/**
 * Class for AICC Tries
 */
export class CMITriesObject extends BaseCMI {
  #API;

  /**
   * Constructor for AICC Tries object
   * @param {AICC} API
   */
  constructor(API) {
    super(API);
    this.#API = API;
    _self = this;
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
    if (this.API.checkValidFormat(status, regex.CMIStatus2)) {
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
    if (this.API.checkValidFormat(time, regex.CMITime)) {
      this.#time = time;
    }
  }

  score = new CMIScore(_self.#API);
}

/**
 * Class for AICC Evaluation Comments
 */
export class CMIEvaluationCommentsObject extends BaseCMI {
  /**
   * Constructor for Evaluation Comments
   * @param {AICC} API
   */
  constructor(API) {
    super(API);
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
    if (this.API.checkValidFormat(content, regex.CMIString256)) {
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
    if (this.API.checkValidFormat(location, regex.CMIString256)) {
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
    if (this.API.checkValidFormat(time, regex.CMITime)) {
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
   * @param {AICC} API
   */
  constructor(API) {
    super(API);
  }

  #event = '';

  /**
   * Getter for #event
   * @return {string}
   */
  get event() {
    return (!this.jsonString) ? this.API.throwSCORMError(404) : this.#event;
  }

  /**
   * Setter for #event
   * @param {string} event
   */
  set event(event) {
    if (this.API.checkValidFormat(event, regex.NAVEvent)) {
      this.#event = event;
    }
  }
}
