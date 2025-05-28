import { CMIArray } from "../common/array";
import { scorm2004_constants } from "../../constants/api_constants";
import { scorm2004_errors } from "../../constants/error_codes";
import { Scorm2004ValidationError } from "../../exceptions/scorm2004_exceptions";
import { BaseCMI } from "../common/base_cmi";
import { check2004ValidFormat } from "./validation";
import { scorm2004_regex } from "../../constants/regex";

/**
 * Class representing SCORM 2004's cmi.comments_from_lms object
 * @extends CMIArray
 */
export class CMICommentsFromLMS extends CMIArray {
  /**
   * Constructor for cmi.comments_from_lms Array
   */
  constructor() {
    super({
      children: scorm2004_constants.comments_children,
      errorCode: scorm2004_errors.READ_ONLY_ELEMENT as number,
      errorClass: Scorm2004ValidationError,
    });
  }
}

/**
 * Class representing SCORM 2004's cmi.comments_from_learner object
 */

export class CMICommentsFromLearner extends CMIArray {
  /**
   * Constructor for cmi.comments_from_learner Array
   */
  constructor() {
    super({
      children: scorm2004_constants.comments_children,
      errorCode: scorm2004_errors.READ_ONLY_ELEMENT as number,
      errorClass: Scorm2004ValidationError,
    });
  }
}

/**
 * Class representing SCORM 2004's cmi.comments_from_learner.n and cmi.comments_from_lms.n object
 */

export class CMICommentsObject extends BaseCMI {
  private _comment = "";
  private _location = "";
  private _timestamp = "";
  private readonly _readOnlyAfterInit: boolean;

  /**
   * Constructor for cmi.comments_from_learner.n and cmi.comments_from_lms.n
   * @param {boolean} readOnlyAfterInit
   */
  constructor(readOnlyAfterInit: boolean = false) {
    super();
    this._comment = "";
    this._location = "";
    this._timestamp = "";
    this._readOnlyAfterInit = readOnlyAfterInit;
  }

  /**
   * Called when the API has been reset
   */
  reset(): void {
    this._initialized = false;
  }

  /**
   * Getter for _comment
   * @return {string}
   */
  get comment(): string {
    return this._comment;
  }

  /**
   * Setter for _comment
   * @param {string} comment
   */
  set comment(comment: string) {
    if (this.initialized && this._readOnlyAfterInit) {
      throw new Scorm2004ValidationError(
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    } else {
      if (
        check2004ValidFormat(comment, scorm2004_regex.CMILangString4000, true)
      ) {
        this._comment = comment;
      }
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
    if (this.initialized && this._readOnlyAfterInit) {
      throw new Scorm2004ValidationError(
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    } else {
      if (check2004ValidFormat(location, scorm2004_regex.CMIString250)) {
        this._location = location;
      }
    }
  }

  /**
   * Getter for _timestamp
   * @return {string}
   */
  get timestamp(): string {
    return this._timestamp;
  }

  /**
   * Setter for _timestamp
   * @param {string} timestamp
   */
  set timestamp(timestamp: string) {
    if (this.initialized && this._readOnlyAfterInit) {
      throw new Scorm2004ValidationError(
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    } else {
      if (check2004ValidFormat(timestamp, scorm2004_regex.CMITime)) {
        this._timestamp = timestamp;
      }
    }
  }

  /**
   * toJSON for cmi.comments_from_learner.n object
   * @return {
   *    {
   *      comment: string,
   *      location: string,
   *      timestamp: string
   *    }
   *  }
   */
  toJSON(): {
    comment: string;
    location: string;
    timestamp: string;
  } {
    this.jsonString = true;
    const result = {
      comment: this.comment,
      location: this.location,
      timestamp: this.timestamp,
    };
    delete this.jsonString;
    return result;
  }
}
