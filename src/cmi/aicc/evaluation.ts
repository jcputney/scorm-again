import { CMIArray } from "../common/array";
import { AICCValidationError } from "../../exceptions";
import { BaseCMI } from "../common/base_cmi";
import APIConstants from "../../constants/api_constants";
import ErrorCodes from "../../constants/error_codes";
import { checkAICCValidFormat } from "./validation";
import Regex from "../../constants/regex";

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
      children: APIConstants.aicc.comments_children,
      errorCode: ErrorCodes.scorm12.INVALID_SET_VALUE,
      errorClass: AICCValidationError,
    });
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

  private _content = "";
  private _location = "";
  private _time = "";

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
    if (checkAICCValidFormat(content, Regex.aicc.CMIString256)) {
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
    if (checkAICCValidFormat(location, Regex.aicc.CMIString256)) {
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
    if (checkAICCValidFormat(time, Regex.aicc.CMITime)) {
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
