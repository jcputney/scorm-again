/**
 * Class representing SCORM 2004's `cmi.interactions` object
 */
import { BaseCMI } from "../common/base_cmi";
import { CMIArray } from "../common/array";
import ErrorCodes from "../../constants/error_codes";
import { Scorm2004ValidationError } from "../../exceptions";
import APIConstants from "../../constants/api_constants";
import { check2004ValidFormat } from "./validation";
import Regex from "../../constants/regex";
import { LearnerResponses } from "../../constants/response_constants";

export class CMIInteractions extends CMIArray {
  /**
   * Constructor for `cmi.objectives` Array
   */
  constructor() {
    super({
      children: APIConstants.scorm2004.interactions_children,
      errorCode: ErrorCodes.scorm2004.READ_ONLY_ELEMENT,
      errorClass: Scorm2004ValidationError,
    });
  }
}

/**
 * Class for SCORM 2004's cmi.interaction.n object
 */

export class CMIInteractionsObject extends BaseCMI {
  private _id = "";
  private _type = "";
  private _timestamp = "";
  private _weighting = "";
  private _learner_response = "";
  private _result = "";
  private _latency = "";
  private _description = "";

  /**
   * Constructor for cmi.interaction.n
   */
  constructor() {
    super();
    this.objectives = new CMIArray({
      errorCode: ErrorCodes.scorm2004.READ_ONLY_ELEMENT,
      errorClass: Scorm2004ValidationError,
      children: APIConstants.scorm2004.objectives_children,
    });
    this.correct_responses = new CMIArray({
      errorCode: ErrorCodes.scorm2004.READ_ONLY_ELEMENT,
      errorClass: Scorm2004ValidationError,
      children: APIConstants.scorm2004.correct_responses_children,
    });
  }

  public objectives: CMIArray;
  public correct_responses: CMIArray;

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  override initialize() {
    super.initialize();
    this.objectives?.initialize();
    this.correct_responses?.initialize();
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
    if (check2004ValidFormat(id, Regex.scorm2004.CMILongIdentifier)) {
      this._id = id;
    }
  }

  /**
   * Getter for _type
   * @return {string}
   */
  get type(): string {
    return this._type;
  }

  /**
   * Setter for _type
   * @param {string} type
   */
  set type(type: string) {
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        ErrorCodes.scorm2004.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      if (check2004ValidFormat(type, Regex.scorm2004.CMIType)) {
        this._type = type;
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
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        ErrorCodes.scorm2004.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      if (check2004ValidFormat(timestamp, Regex.scorm2004.CMITime)) {
        this._timestamp = timestamp;
      }
    }
  }

  /**
   * Getter for _weighting
   * @return {string}
   */
  get weighting(): string {
    return this._weighting;
  }

  /**
   * Setter for _weighting
   * @param {string} weighting
   */
  set weighting(weighting: string) {
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        ErrorCodes.scorm2004.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      if (check2004ValidFormat(weighting, Regex.scorm2004.CMIDecimal)) {
        this._weighting = weighting;
      }
    }
  }

  /**
   * Getter for _learner_response
   * @return {string}
   */
  get learner_response(): string {
    return this._learner_response;
  }

  /**
   * Setter for _learner_response. Does type validation to make sure response
   * matches SCORM 2004's spec
   * @param {string} learner_response
   */
  set learner_response(learner_response: string) {
    if (this.initialized && (this._type === "" || this._id === "")) {
      throw new Scorm2004ValidationError(
        ErrorCodes.scorm2004.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      let nodes = [];
      const response_type = LearnerResponses[this.type];

      if (response_type) {
        if (response_type?.delimiter) {
          nodes = learner_response.split(response_type.delimiter);
        } else {
          nodes[0] = learner_response;
        }

        if (nodes.length > 0 && nodes.length <= response_type.max) {
          const formatRegex = new RegExp(response_type.format);

          for (let i = 0; i < nodes.length; i++) {
            if (response_type?.delimiter2) {
              const values = nodes[i].split(response_type.delimiter2);

              if (values.length === 2) {
                if (!values[0].match(formatRegex)) {
                  throw new Scorm2004ValidationError(
                    ErrorCodes.scorm2004.TYPE_MISMATCH,
                  );
                } else {
                  if (
                    !response_type.format2 ||
                    !values[1].match(new RegExp(response_type.format2))
                  ) {
                    throw new Scorm2004ValidationError(
                      ErrorCodes.scorm2004.TYPE_MISMATCH,
                    );
                  }
                }
              } else {
                throw new Scorm2004ValidationError(
                  ErrorCodes.scorm2004.TYPE_MISMATCH,
                );
              }
            } else {
              if (!nodes[i].match(formatRegex)) {
                throw new Scorm2004ValidationError(
                  ErrorCodes.scorm2004.TYPE_MISMATCH,
                );
              } else {
                if (nodes[i] !== "" && response_type.unique) {
                  for (let j = 0; j < i; j++) {
                    if (nodes[i] === nodes[j]) {
                      throw new Scorm2004ValidationError(
                        ErrorCodes.scorm2004.TYPE_MISMATCH,
                      );
                    }
                  }
                }
              }
            }
          }
        } else {
          throw new Scorm2004ValidationError(
            ErrorCodes.scorm2004.GENERAL_SET_FAILURE,
          );
        }

        this._learner_response = learner_response;
      } else {
        throw new Scorm2004ValidationError(ErrorCodes.scorm2004.TYPE_MISMATCH);
      }
    }
  }

  /**
   * Getter for _result
   * @return {string}
   */
  get result(): string {
    return this._result;
  }

  /**
   * Setter for _result
   * @param {string} result
   */
  set result(result: string) {
    if (check2004ValidFormat(result, Regex.scorm2004.CMIResult)) {
      this._result = result;
    }
  }

  /**
   * Getter for _latency
   * @return {string}
   */
  get latency(): string {
    return this._latency;
  }

  /**
   * Setter for _latency
   * @param {string} latency
   */
  set latency(latency: string) {
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        ErrorCodes.scorm2004.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      if (check2004ValidFormat(latency, Regex.scorm2004.CMITimespan)) {
        this._latency = latency;
      }
    }
  }

  /**
   * Getter for _description
   * @return {string}
   */
  get description(): string {
    return this._description;
  }

  /**
   * Setter for _description
   * @param {string} description
   */
  set description(description: string) {
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        ErrorCodes.scorm2004.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      if (
        check2004ValidFormat(
          description,
          Regex.scorm2004.CMILangString250,
          true,
        )
      ) {
        this._description = description;
      }
    }
  }

  /**
   * toJSON for cmi.interactions.n
   *
   * @return {
   *    {
   *      id: string,
   *      type: string,
   *      objectives: CMIArray,
   *      timestamp: string,
   *      correct_responses: CMIArray,
   *      weighting: string,
   *      learner_response: string,
   *      result: string,
   *      latency: string,
   *      description: string
   *    }
   *  }
   */
  toJSON(): {
    id: string;
    type: string;
    objectives: CMIArray;
    timestamp: string;
    correct_responses: CMIArray;
    weighting: string;
    learner_response: string;
    result: string;
    latency: string;
    description: string;
  } {
    this.jsonString = true;
    const result = {
      id: this.id,
      type: this.type,
      objectives: this.objectives,
      timestamp: this.timestamp,
      weighting: this.weighting,
      learner_response: this.learner_response,
      result: this.result,
      latency: this.latency,
      description: this.description,
      correct_responses: this.correct_responses,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing SCORM 2004's cmi.interactions.n.objectives.n object
 */
export class CMIInteractionsObjectivesObject extends BaseCMI {
  private _id = "";

  /**
   * Constructor for cmi.interactions.n.objectives.n
   */
  constructor() {
    super();
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
    if (check2004ValidFormat(id, Regex.scorm2004.CMILongIdentifier)) {
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
 * Class representing SCORM 2004's cmi.interactions.n.correct_responses.n object
 */
export class CMIInteractionsCorrectResponsesObject extends BaseCMI {
  private _pattern = "";

  /**
   * Constructor for cmi.interactions.n.correct_responses.n
   */
  constructor() {
    super();
  }

  /**
   * Getter for _pattern
   * @return {string}
   */
  get pattern(): string {
    return this._pattern;
  }

  /**
   * Setter for _pattern
   * @param {string} pattern
   */
  set pattern(pattern: string) {
    if (check2004ValidFormat(pattern, Regex.scorm2004.CMIFeedback)) {
      this._pattern = pattern;
    }
  }

  /**
   * toJSON cmi.interactions.n.correct_responses.n object
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
      pattern: this.pattern,
    };
    delete this.jsonString;
    return result;
  }
}
