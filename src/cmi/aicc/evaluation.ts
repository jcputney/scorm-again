import { CMIArray } from "../common/array";
import { AICCValidationError } from "../../exceptions/aicc_exceptions";
import { BaseCMI } from "../common/base_cmi";
import { aicc_constants } from "../../constants/api_constants";
import { scorm12_errors } from "../../constants/error_codes";
import { checkAICCValidFormat } from "./validation";
import { aicc_regex } from "../../constants/regex";

/**
 * AICC Evaluation object
 */
export class CMIEvaluation extends BaseCMI {
  /**
   * Constructor for AICC Evaluation object
   */
  constructor() {
    super();
    this.comments = new CMIEvaluationComments();
  }

  public comments: CMIEvaluationComments;

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  override initialize() {
    super.initialize();
    this.comments?.initialize();
  }

  /**
   * Called when the API has been reset
   */
  reset(): void {
    this._initialized = false;
    this.comments?.reset();
  }

  /**
   * toJSON for cmi.evaluation object
   * @return {{comments: CMIEvaluationComments}}
   */
  toJSON(): {
    comments: CMIEvaluationComments;
  } {
    this.jsonString = true;
    const result = {
      comments: this.comments,
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
      errorCode: scorm12_errors.INVALID_SET_VALUE as number,
      errorClass: AICCValidationError,
    });
  }
}

/**
 * Class for AICC Evaluation Comments
 */
export class CMIEvaluationCommentsObject extends BaseCMI {
  private _content = "";
  private _location = "";
  private _time = "";

  /**
   * Constructor for Evaluation Comments
   */
  constructor() {
    super();
  }

  /**
   * Called when the API has been reset
   */
  reset(): void {
    this._initialized = false;

    this._content = "";
    this._location = "";
    this._time = "";
  }

  /**
   * Getter for _content
   * @return {string}
   */
  get content(): string {
    return this._content;
  }

  /**
   * Setter for _content
   * @param {string} content
   */
  set content(content: string) {
    if (checkAICCValidFormat(content, aicc_regex.CMIString256)) {
      this._content = content;
    }
  }

  /**
   * Getter for _location
   * @return {string}
   */
  get location(): string {
    return this._location;
  }

  /**
   * Setter for _location
   * @param {string} location
   */
  set location(location: string) {
    if (checkAICCValidFormat(location, aicc_regex.CMIString256)) {
      this._location = location;
    }
  }

  /**
   * Getter for _time
   * @return {string}
   */
  get time(): string {
    return this._time;
  }

  /**
   * Setting for _time
   * @param {string} time
   */
  set time(time: string) {
    if (checkAICCValidFormat(time, aicc_regex.CMITime)) {
      this._time = time;
    }
  }

  /**
   * toJSON for cmi.evaluation.comments.n object
   * @return {
   *    {
   *      content: string,
   *      location: string,
   *      time: string
   *    }
   *  }
   */
  toJSON(): {
    content: string;
    location: string;
    time: string;
  } {
    this.jsonString = true;
    const result = {
      content: this.content,
      location: this.location,
      time: this.time,
    };
    delete this.jsonString;
    return result;
  }
}
