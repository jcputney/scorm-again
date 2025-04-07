/**
 * Class representing SCORM 2004's `cmi.interactions` object
 */
import { BaseCMI } from "../common/base_cmi";
import { CMIArray } from "../common/array";
import { scorm2004_errors } from "../../constants/error_codes";
import { Scorm2004ValidationError } from "../../exceptions/scorm2004_exceptions";
import { scorm2004_constants } from "../../constants/api_constants";
import { check2004ValidFormat } from "./validation";
import { scorm2004_regex } from "../../constants/regex";
import { CorrectResponses, LearnerResponses } from "../../constants/response_constants";

export class CMIInteractions extends CMIArray {
  /**
   * Constructor for `cmi.objectives` Array
   */
  constructor() {
    super({
      CMIElement: "cmi.interactions",
      children: scorm2004_constants.interactions_children,
      errorCode: scorm2004_errors.READ_ONLY_ELEMENT,
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
    super("cmi.interactions.n");
    this.objectives = new CMIArray({
      CMIElement: "cmi.interactions.n.objectives",
      errorCode: scorm2004_errors.READ_ONLY_ELEMENT,
      errorClass: Scorm2004ValidationError,
      children: scorm2004_constants.objectives_children,
    });
    this.correct_responses = new CMIArray({
      CMIElement: "cmi.interactions.n.correct_responses",
      errorCode: scorm2004_errors.READ_ONLY_ELEMENT,
      errorClass: Scorm2004ValidationError,
      children: scorm2004_constants.correct_responses_children,
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
   * Called when the API has been reset
   */
  override reset() {
    this._initialized = false;
    this._id = "";
    this._type = "";
    this._timestamp = "";
    this._weighting = "";
    this._learner_response = "";
    this._result = "";
    this._latency = "";
    this._description = "";
    this.objectives = new CMIArray({
      CMIElement: "cmi.interactions.n.objectives",
      errorCode: scorm2004_errors.READ_ONLY_ELEMENT,
      errorClass: Scorm2004ValidationError,
      children: scorm2004_constants.objectives_children,
    });
    this.correct_responses = new CMIArray({
      CMIElement: "cmi.interactions.n.correct_responses",
      errorCode: scorm2004_errors.READ_ONLY_ELEMENT,
      errorClass: Scorm2004ValidationError,
      children: scorm2004_constants.correct_responses_children,
    });
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
    if (check2004ValidFormat(this._cmi_element + ".id", id, scorm2004_regex.CMILongIdentifier)) {
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
        this._cmi_element + ".type",
        scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      if (check2004ValidFormat(this._cmi_element + ".type", type, scorm2004_regex.CMIType)) {
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
        this._cmi_element + ".timestamp",
        scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      if (
        check2004ValidFormat(this._cmi_element + ".timestamp", timestamp, scorm2004_regex.CMITime)
      ) {
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
        this._cmi_element + ".weighting",
        scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      if (
        check2004ValidFormat(
          this._cmi_element + ".weighting",
          weighting,
          scorm2004_regex.CMIDecimal,
        )
      ) {
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
        this._cmi_element + ".learner_response",
        scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      let nodes = [];
      const response_type = LearnerResponses[this.type];

      if (response_type) {
        if (response_type?.delimiter) {
          // Convert regex-style delimiter to actual character
          const delimiter = response_type.delimiter === "[,]" ? "," : response_type.delimiter;
          nodes = learner_response.split(delimiter);
        } else {
          nodes[0] = learner_response;
        }

        if (nodes.length > 0 && nodes.length <= response_type.max) {
          const formatRegex = new RegExp(response_type.format);

          for (let i = 0; i < nodes.length; i++) {
            if (response_type?.delimiter2) {
              // Convert regex-style delimiter to actual character
              const delimiter2 =
                response_type.delimiter2 === "[.]" ? "." : response_type.delimiter2;
              const values = nodes[i].split(delimiter2);

              if (values.length === 2) {
                if (!values[0].match(formatRegex)) {
                  throw new Scorm2004ValidationError(
                    this._cmi_element + ".learner_response",
                    scorm2004_errors.TYPE_MISMATCH,
                  );
                } else {
                  if (
                    !response_type.format2 ||
                    !values[1].match(new RegExp(response_type.format2))
                  ) {
                    throw new Scorm2004ValidationError(
                      this._cmi_element + ".learner_response",
                      scorm2004_errors.TYPE_MISMATCH,
                    );
                  }
                }
              } else {
                throw new Scorm2004ValidationError(
                  this._cmi_element + ".learner_response",
                  scorm2004_errors.TYPE_MISMATCH,
                );
              }
            } else {
              if (!nodes[i].match(formatRegex)) {
                throw new Scorm2004ValidationError(
                  this._cmi_element + ".learner_response",
                  scorm2004_errors.TYPE_MISMATCH,
                );
              } else {
                if (nodes[i] !== "" && response_type.unique) {
                  for (let j = 0; j < i; j++) {
                    if (nodes[i] === nodes[j]) {
                      throw new Scorm2004ValidationError(
                        this._cmi_element + ".learner_response",
                        scorm2004_errors.TYPE_MISMATCH,
                      );
                    }
                  }
                }
              }
            }
          }
        } else {
          throw new Scorm2004ValidationError(
            this._cmi_element + ".learner_response",
            scorm2004_errors.GENERAL_SET_FAILURE,
          );
        }

        this._learner_response = learner_response;
      } else {
        throw new Scorm2004ValidationError(
          this._cmi_element + ".learner_response",
          scorm2004_errors.TYPE_MISMATCH,
        );
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
    if (check2004ValidFormat(this._cmi_element + ".result", result, scorm2004_regex.CMIResult)) {
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
        this._cmi_element + ".latency",
        scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      if (
        check2004ValidFormat(this._cmi_element + ".latency", latency, scorm2004_regex.CMITimespan)
      ) {
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
        this._cmi_element + ".description",
        scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      if (
        check2004ValidFormat(
          this._cmi_element + ".description",
          description,
          scorm2004_regex.CMILangString250,
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
    super("cmi.interactions.n.objectives.n");
  }

  /**
   * Called when the API has been reset
   */
  override reset() {
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
    if (check2004ValidFormat(this._cmi_element + ".id", id, scorm2004_regex.CMILongIdentifier)) {
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
  private _parent?: CMIInteractionsObject;

  /**
   * Constructor for cmi.interactions.n.correct_responses.n
   * @param {CMIInteractionsObject} parent - The parent interaction object
   */
  constructor(parent?: CMIInteractionsObject) {
    super("cmi.interactions.n.correct_responses.n");
    this._parent = parent;
  }

  /**
   * Called when the API has been reset
   */
  override reset() {
    this._initialized = false;
    this._pattern = "";
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
    // First do basic format validation
    if (
      check2004ValidFormat(this._cmi_element + ".pattern", pattern, scorm2004_regex.CMIFeedback)
    ) {
      // If we have a parent interaction, validate the pattern against the interaction type
      if (this._parent && this._parent.type) {
        const interactionType = this._parent.type;
        const response = CorrectResponses[interactionType];

        if (response) {
          // Validate the pattern against the interaction type
          let isValid = true;
          let nodes = [];

          if (response?.delimiter) {
            nodes = String(pattern).split(response.delimiter);
          } else {
            nodes[0] = pattern;
          }

          if (nodes.length > 0 && nodes.length <= response.max) {
            const formatRegex = new RegExp(response.format);

            for (let i = 0; i < nodes.length && isValid; i++) {
              if (response?.delimiter2) {
                const values = nodes[i].split(response.delimiter2);
                if (values.length === 2) {
                  const matches = values[0].match(formatRegex);
                  if (!matches) {
                    isValid = false;
                  } else if (!response.format2 || !values[1].match(new RegExp(response.format2))) {
                    isValid = false;
                  }
                } else {
                  isValid = false;
                }
              } else {
                const matches = nodes[i].match(formatRegex);
                if (
                  (!matches && pattern !== "") ||
                  (!matches && interactionType === "true-false")
                ) {
                  isValid = false;
                }
              }
            }
          } else if (nodes.length > response.max) {
            isValid = false;
          }

          if (!isValid) {
            throw new Scorm2004ValidationError(
              this._cmi_element + ".pattern",
              scorm2004_errors.TYPE_MISMATCH,
            );
          }
        }
      }

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
