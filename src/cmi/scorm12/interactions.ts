import { CMIArray } from "../common/array";
import APIConstants from "../../constants/api_constants";
import ErrorCodes from "../../constants/error_codes";
import { Scorm12ValidationError } from "../../exceptions";
import { BaseCMI } from "../common/base_cmi";
import { check12ValidFormat, check12ValidRange } from "./validation";
import Regex from "../../constants/regex";

/**
 * Class representing the SCORM 1.2 `cmi.interactions`
 * @extends CMIArray
 */
export class CMIInteractions extends CMIArray {
  /**
   * Constructor for `cmi.interactions`
   */
  constructor() {
    super({
      children: APIConstants.scorm12.interactions_children,
      errorCode: ErrorCodes.scorm12.INVALID_SET_VALUE,
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
      errorCode: ErrorCodes.scorm12.INVALID_SET_VALUE,
      errorClass: Scorm12ValidationError,
      children: APIConstants.scorm12.objectives_children,
    });
    this.correct_responses = new CMIArray({
      errorCode: ErrorCodes.scorm12.INVALID_SET_VALUE,
      errorClass: Scorm12ValidationError,
      children: APIConstants.scorm12.correct_responses_children,
    });
  }

  public readonly objectives: CMIArray;
  public readonly correct_responses: CMIArray;

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  override initialize() {
    super.initialize();
    this.objectives?.initialize();
    this.correct_responses?.initialize();
  }

  private _id = "";
  private _time = "";
  private _type = "";
  private _weighting = "";
  private _student_response = "";
  private _result = "";
  private _latency = "";

  /**
   * Getter for _id. Should only be called during JSON export.
   * @return {string}
   */
  get id(): string {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(ErrorCodes.scorm12.WRITE_ONLY_ELEMENT);
    }
    return this._id;
  }

  /**
   * Setter for _id
   * @param {string} id
   */
  set id(id: string) {
    if (check12ValidFormat(id, Regex.scorm12.CMIIdentifier)) {
      this._id = id;
    }
  }

  /**
   * Getter for _time. Should only be called during JSON export.
   * @return {string}
   */
  get time(): string {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(ErrorCodes.scorm12.WRITE_ONLY_ELEMENT);
    }
    return this._time;
  }

  /**
   * Setter for _time
   * @param {string} time
   */
  set time(time: string) {
    if (check12ValidFormat(time, Regex.scorm12.CMITime)) {
      this._time = time;
    }
  }

  /**
   * Getter for _type. Should only be called during JSON export.
   * @return {string}
   */
  get type(): string {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(ErrorCodes.scorm12.WRITE_ONLY_ELEMENT);
    }
    return this._type;
  }

  /**
   * Setter for _type
   * @param {string} type
   */
  set type(type: string) {
    if (check12ValidFormat(type, Regex.scorm12.CMIType)) {
      this._type = type;
    }
  }

  /**
   * Getter for _weighting. Should only be called during JSON export.
   * @return {string}
   */
  get weighting(): string {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(ErrorCodes.scorm12.WRITE_ONLY_ELEMENT);
    }
    return this._weighting;
  }

  /**
   * Setter for _weighting
   * @param {string} weighting
   */
  set weighting(weighting: string) {
    if (
      check12ValidFormat(weighting, Regex.scorm12.CMIDecimal) &&
      check12ValidRange(weighting, Regex.scorm12.weighting_range)
    ) {
      this._weighting = weighting;
    }
  }

  /**
   * Getter for _student_response. Should only be called during JSON export.
   * @return {string}
   */
  get student_response(): string {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(ErrorCodes.scorm12.WRITE_ONLY_ELEMENT);
    }
    return this._student_response;
  }

  /**
   * Setter for _student_response
   * @param {string} student_response
   */
  set student_response(student_response: string) {
    if (check12ValidFormat(student_response, Regex.scorm12.CMIFeedback, true)) {
      this._student_response = student_response;
    }
  }

  /**
   * Getter for _result. Should only be called during JSON export.
   * @return {string}
   */
  get result(): string {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(ErrorCodes.scorm12.WRITE_ONLY_ELEMENT);
    }
    return this._result;
  }

  /**
   * Setter for _result
   * @param {string} result
   */
  set result(result: string) {
    if (check12ValidFormat(result, Regex.scorm12.CMIResult)) {
      this._result = result;
    }
  }

  /**
   * Getter for _latency. Should only be called during JSON export.
   * @return {string}
   */
  get latency(): string {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(ErrorCodes.scorm12.WRITE_ONLY_ELEMENT);
    }
    return this._latency;
  }

  /**
   * Setter for _latency
   * @param {string} latency
   */
  set latency(latency: string) {
    if (check12ValidFormat(latency, Regex.scorm12.CMITimespan)) {
      this._latency = latency;
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
  toJSON(): {
    id: string;
    time: string;
    type: string;
    weighting: string;
    student_response: string;
    result: string;
    latency: string;
    objectives: CMIArray;
    correct_responses: CMIArray;
  } {
    this.jsonString = true;
    const result = {
      id: this.id,
      time: this.time,
      type: this.type,
      weighting: this.weighting,
      student_response: this.student_response,
      result: this.result,
      latency: this.latency,
      objectives: this.objectives,
      correct_responses: this.correct_responses,
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

  private _id = "";

  /**
   * Getter for _id
   * @return {string}
   */
  get id(): string {
    return this._id;
  }

  /**
   * Setter for _id
   * @param {string} id
   */
  set id(id: string) {
    if (check12ValidFormat(id, Regex.scorm12.CMIIdentifier)) {
      this._id = id;
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
  toJSON(): {
    id: string;
  } {
    this.jsonString = true;
    const result = {
      id: this.id,
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

  private _pattern = "";

  /**
   * Getter for _pattern
   * @return {string}
   */
  get pattern(): string {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(ErrorCodes.scorm12.WRITE_ONLY_ELEMENT);
    }
    return this._pattern;
  }

  /**
   * Setter for _pattern
   * @param {string} pattern
   */
  set pattern(pattern: string) {
    if (check12ValidFormat(pattern, Regex.scorm12.CMIFeedback, true)) {
      this._pattern = pattern;
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
  toJSON(): {
    pattern: string;
  } {
    this.jsonString = true;
    const result = {
      pattern: this._pattern,
    };
    delete this.jsonString;
    return result;
  }
}
