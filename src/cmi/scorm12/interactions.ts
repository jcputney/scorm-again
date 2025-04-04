import { CMIArray } from "../common/array";
import { scorm12_constants } from "../../constants/api_constants";
import { scorm12_errors } from "../../constants/error_codes";
import { Scorm12ValidationError } from "../../exceptions/scorm12_exceptions";
import { BaseCMI } from "../common/base_cmi";
import { check12ValidFormat, check12ValidRange } from "./validation";
import { scorm12_regex } from "../../constants/regex";

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
      CMIElement: "cmi.interactions",
      children: scorm12_constants.interactions_children,
      errorCode: scorm12_errors.INVALID_SET_VALUE,
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
    super("cmi.interactions.n");
    this.objectives = new CMIArray({
      CMIElement: "cmi.interactions.n.objectives",
      errorCode: scorm12_errors.INVALID_SET_VALUE,
      errorClass: Scorm12ValidationError,
      children: scorm12_constants.objectives_children,
    });
    this.correct_responses = new CMIArray({
      CMIElement: "cmi.interactions.correct_responses",
      errorCode: scorm12_errors.INVALID_SET_VALUE,
      errorClass: Scorm12ValidationError,
      children: scorm12_constants.correct_responses_children,
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
   * Called when the API has been reset
   */
  override reset(): void {
    this._initialized = false;

    this._id = "";
    this._time = "";
    this._type = "";
    this._weighting = "";
    this._student_response = "";
    this._result = "";
    this._latency = "";

    this.objectives?.reset();
    this.correct_responses?.reset();
  }

  /**
   * Getter for _id. Should only be called during JSON export.
   * @return {string}
   */
  get id(): string {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".id",
        scorm12_errors.WRITE_ONLY_ELEMENT,
      );
    }
    return this._id;
  }

  /**
   * Setter for _id
   * @param {string} id
   */
  set id(id: string) {
    if (
      check12ValidFormat(
        this._cmi_element + ".id",
        id,
        scorm12_regex.CMIIdentifier,
      )
    ) {
      this._id = id;
    }
  }

  /**
   * Getter for _time. Should only be called during JSON export.
   * @return {string}
   */
  get time(): string {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".time",
        scorm12_errors.WRITE_ONLY_ELEMENT,
      );
    }
    return this._time;
  }

  /**
   * Setter for _time
   * @param {string} time
   */
  set time(time: string) {
    if (
      check12ValidFormat(
        this._cmi_element + ".time",
        time,
        scorm12_regex.CMITime,
      )
    ) {
      this._time = time;
    }
  }

  /**
   * Getter for _type. Should only be called during JSON export.
   * @return {string}
   */
  get type(): string {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".type",
        scorm12_errors.WRITE_ONLY_ELEMENT,
      );
    }
    return this._type;
  }

  /**
   * Setter for _type
   * @param {string} type
   */
  set type(type: string) {
    if (
      check12ValidFormat(
        this._cmi_element + ".type",
        type,
        scorm12_regex.CMIType,
      )
    ) {
      this._type = type;
    }
  }

  /**
   * Getter for _weighting. Should only be called during JSON export.
   * @return {string}
   */
  get weighting(): string {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".weighting",
        scorm12_errors.WRITE_ONLY_ELEMENT,
      );
    }
    return this._weighting;
  }

  /**
   * Setter for _weighting
   * @param {string} weighting
   */
  set weighting(weighting: string) {
    if (
      check12ValidFormat(
        this._cmi_element + ".weighting",
        weighting,
        scorm12_regex.CMIDecimal,
      ) &&
      check12ValidRange(
        this._cmi_element + ".weighting",
        weighting,
        scorm12_regex.weighting_range,
      )
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
      throw new Scorm12ValidationError(
        this._cmi_element + ".student_response",
        scorm12_errors.WRITE_ONLY_ELEMENT,
      );
    }
    return this._student_response;
  }

  /**
   * Setter for _student_response
   * @param {string} student_response
   */
  set student_response(student_response: string) {
    if (
      check12ValidFormat(
        this._cmi_element + ".student_response",
        student_response,
        scorm12_regex.CMIFeedback,
        true,
      )
    ) {
      this._student_response = student_response;
    }
  }

  /**
   * Getter for _result. Should only be called during JSON export.
   * @return {string}
   */
  get result(): string {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".result",
        scorm12_errors.WRITE_ONLY_ELEMENT,
      );
    }
    return this._result;
  }

  /**
   * Setter for _result
   * @param {string} result
   */
  set result(result: string) {
    if (
      check12ValidFormat(
        this._cmi_element + ".result",
        result,
        scorm12_regex.CMIResult,
      )
    ) {
      this._result = result;
    }
  }

  /**
   * Getter for _latency. Should only be called during JSON export.
   * @return {string}
   */
  get latency(): string {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".latency",
        scorm12_errors.WRITE_ONLY_ELEMENT,
      );
    }
    return this._latency;
  }

  /**
   * Setter for _latency
   * @param {string} latency
   */
  set latency(latency: string) {
    if (
      check12ValidFormat(
        this._cmi_element + ".latency",
        latency,
        scorm12_regex.CMITimespan,
      )
    ) {
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
    super("cmi.interactions.n.objectives.n");
  }

  private _id = "";

  /**
   * Called when the API has been reset
   */
  reset(): void {
    this._initialized = false;
    this._id = "";
  }

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
    if (
      check12ValidFormat(
        this._cmi_element + ".id",
        id,
        scorm12_regex.CMIIdentifier,
      )
    ) {
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
    super("cmi.interactions.correct_responses.n");
  }

  private _pattern = "";

  /**
   * Called when the API has been reset
   */
  reset(): void {
    this._initialized = false;
    this._pattern = "";
  }

  /**
   * Getter for _pattern
   * @return {string}
   */
  get pattern(): string {
    if (!this.jsonString) {
      throw new Scorm12ValidationError(
        this._cmi_element + ".pattern",
        scorm12_errors.WRITE_ONLY_ELEMENT,
      );
    }
    return this._pattern;
  }

  /**
   * Setter for _pattern
   * @param {string} pattern
   */
  set pattern(pattern: string) {
    if (
      check12ValidFormat(
        this._cmi_element + ".pattern",
        pattern,
        scorm12_regex.CMIFeedback,
        true,
      )
    ) {
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
