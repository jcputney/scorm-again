/**
 * Class representing SCORM 2004's `cmi.interactions` object
 *
 * Per SCORM 2004 RTE Section 4.1.6:
 * - Enhanced interaction tracking vs SCORM 1.2
 * - Supports additional interaction types (long-fill-in, other)
 * - learner_response replaces student_response
 * - timestamp: ISO 8601 format for precise timing
 * - description: Textual description with language support
 * - Stricter validation of response formats by type
 * - Correct response patterns support complex formats
 *
 * @spec RTE 4.2.9 - cmi.interactions
 * @extends CMIArray
 */
import { BaseCMI } from "../common/base_cmi";
import { CMIArray } from "../common/array";
import { Scorm2004ValidationError } from "../../exceptions/scorm2004_exceptions";
import { check2004ValidFormat } from "./validation";
import {
  CorrectResponses,
  LearnerResponses,
  ResponseType,
  scorm2004_constants,
  scorm2004_errors,
  scorm2004_regex,
} from "../../constants";

export class CMIInteractions extends CMIArray {
  /**
   * Constructor for `cmi.interactions` Array
   *
   * Per SCORM 2004 RTE Section 4.1.6:
   * - Read-only array structure (add via index access)
   * - Each interaction has enhanced metadata and validation
   */
  constructor() {
    super({
      CMIElement: "cmi.interactions",
      children: scorm2004_constants.interactions_children,
      errorCode: scorm2004_errors.READ_ONLY_ELEMENT as number,
      errorClass: Scorm2004ValidationError,
    });
  }
}

/**
 * Class for SCORM 2004's cmi.interaction.n object
 *
 * Per SCORM 2004 RTE Section 4.1.6:
 * - id: Long identifier (up to 4000 chars, supports URN format)
 * - type: Interaction type (true-false, choice, fill-in, long-fill-in, matching, performance, sequencing, likert, numeric, other)
 * - timestamp: ISO 8601 date/time when interaction occurred
 * - weighting: Decimal weight for scoring
 * - learner_response: Response format validated against interaction type
 * - result: correct, incorrect, unanticipated, neutral, or numeric score
 * - latency: ISO 8601 duration format
 * - description: LangString250 with optional language tag
 * - Dependency: id must be set before other elements (except objectives/correct_responses)
 *
 * @spec RTE 4.2.9.1 - cmi.interactions.n.id
 * @spec RTE 4.2.9.2 - cmi.interactions.n.type
 * @spec RTE 4.2.9.3 - cmi.interactions.n.objectives
 * @spec RTE 4.2.9.4 - cmi.interactions.n.timestamp
 * @spec RTE 4.2.9.5 - cmi.interactions.n.correct_responses
 * @spec RTE 4.2.9.6 - cmi.interactions.n.weighting
 * @spec RTE 4.2.9.7 - cmi.interactions.n.learner_response
 * @spec RTE 4.2.9.8 - cmi.interactions.n.result
 * @spec RTE 4.2.9.9 - cmi.interactions.n.latency
 * @spec RTE 4.2.9.10 - cmi.interactions.n.description
 * @extends BaseCMI
 */

export class CMIInteractionsObject extends BaseCMI {
  private _id = "";
  private _idIsSet = false;
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
      errorCode: scorm2004_errors.READ_ONLY_ELEMENT as number,
      errorClass: Scorm2004ValidationError,
      children: scorm2004_constants.objectives_children,
    });
    this.correct_responses = new CMIArray({
      CMIElement: "cmi.interactions.n.correct_responses",
      errorCode: scorm2004_errors.READ_ONLY_ELEMENT as number,
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
    this._idIsSet = false;
    this._type = "";
    this._timestamp = "";
    this._weighting = "";
    this._learner_response = "";
    this._result = "";
    this._latency = "";
    this._description = "";
    this.objectives = new CMIArray({
      CMIElement: "cmi.interactions.n.objectives",
      errorCode: scorm2004_errors.READ_ONLY_ELEMENT as number,
      errorClass: Scorm2004ValidationError,
      children: scorm2004_constants.objectives_children,
    });
    this.correct_responses = new CMIArray({
      CMIElement: "cmi.interactions.n.correct_responses",
      errorCode: scorm2004_errors.READ_ONLY_ELEMENT as number,
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
   * Per SCORM 2004 RTE: identifier SHALL NOT be empty or contain only whitespace
   * Per SCORM 2004 RTE Section 4.1.6: Once set, an interaction ID is immutable (error 351)
   * @param {string} id
   */
  set id(id: string) {
    // Per spec: identifier cannot be empty or whitespace-only
    if (id === "" || id.trim() === "") {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".id",
        scorm2004_errors.TYPE_MISMATCH as number,
      );
    }
    // Per SCORM 2004 RTE: Once an interaction ID is set, it cannot be changed
    if (this._idIsSet && this._id !== id) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".id",
        scorm2004_errors.GENERAL_SET_FAILURE as number,
      );
    }
    if (check2004ValidFormat(this._cmi_element + ".id", id, scorm2004_regex.CMILongIdentifier)) {
      this._id = id;
      this._idIsSet = true;
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
        scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED as number,
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
        scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED as number,
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
        scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED as number,
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
        scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED as number,
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
              const values = nodes[i]?.split(delimiter2);

              if (values?.length === 2) {
                // For performance type, both parts must be non-empty
                if (this.type === "performance" && (values[0] === "" || values[1] === "")) {
                  throw new Scorm2004ValidationError(
                    this._cmi_element + ".learner_response",
                    scorm2004_errors.TYPE_MISMATCH as number,
                  );
                }

                if (!values[0]?.match(formatRegex)) {
                  throw new Scorm2004ValidationError(
                    this._cmi_element + ".learner_response",
                    scorm2004_errors.TYPE_MISMATCH as number,
                  );
                } else {
                  if (
                    !response_type.format2 ||
                    !values[1]?.match(new RegExp(response_type.format2))
                  ) {
                    throw new Scorm2004ValidationError(
                      this._cmi_element + ".learner_response",
                      scorm2004_errors.TYPE_MISMATCH as number,
                    );
                  }
                }
              } else {
                throw new Scorm2004ValidationError(
                  this._cmi_element + ".learner_response",
                  scorm2004_errors.TYPE_MISMATCH as number,
                );
              }
            } else {
              if (!nodes[i]?.match(formatRegex)) {
                throw new Scorm2004ValidationError(
                  this._cmi_element + ".learner_response",
                  scorm2004_errors.TYPE_MISMATCH as number,
                );
              } else {
                if (nodes[i] !== "" && response_type.unique) {
                  for (let j = 0; j < i; j++) {
                    if (nodes[i] === nodes[j]) {
                      throw new Scorm2004ValidationError(
                        this._cmi_element + ".learner_response",
                        scorm2004_errors.TYPE_MISMATCH as number,
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
            scorm2004_errors.GENERAL_SET_FAILURE as number,
          );
        }

        this._learner_response = learner_response;
      } else {
        throw new Scorm2004ValidationError(
          this._cmi_element + ".learner_response",
          scorm2004_errors.TYPE_MISMATCH as number,
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
        scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED as number,
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
        scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED as number,
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

  // noinspection JSUnusedGlobalSymbols
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
    this.jsonString = false;
    return result;
  }
}

/**
 * Class representing SCORM 2004's cmi.interactions.n.objectives.n object
 *
 * Per SCORM 2004 RTE Section 4.1.6.1:
 * - Associates interaction with objectives
 * - id: Long identifier matching objective in cmi.objectives
 * - Used to relate interaction performance to learning objectives
 *
 * @extends BaseCMI
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
   * Per SCORM 2004 RTE: identifier SHALL NOT be empty or contain only whitespace
   * @param {string} id
   */
  set id(id: string) {
    // Per spec: identifier cannot be empty or whitespace-only
    if (id === "" || id.trim() === "") {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".id",
        scorm2004_errors.TYPE_MISMATCH as number,
      );
    }
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
    this.jsonString = false;
    return result;
  }
}

/**
 * Helper: strip the square-bracket notation (e.g. "[,]") down to the character (",")
 */
function stripBrackets(delim: string): string {
  return delim.replace(/[[\]]/g, "");
}

// Helper to escape a string for use in a RegExp
function escapeRegex(s: string): string {
  // Only , and . are expected, but escape any regex special chars for safety
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Split on unescaped delimiter and unescape the delimiter in resulting parts.
 * @param text - the input string
 * @param delim - the delimiter character, e.g. ',' or '.'
 */
function splitUnescaped(text: string, delim: string): string[] {
  const reDelim = escapeRegex(delim);
  const splitRe = new RegExp(`(?<!\\\\)${reDelim}`, "g");
  const unescapeRe = new RegExp(`\\\\${reDelim}`, "g");
  return text.split(splitRe).map((part) => part.replace(unescapeRe, delim));
}

/**
 * Split on the FIRST unescaped delimiter only and unescape the delimiter in resulting parts.
 * This is needed for patterns where the second part may contain literal delimiters (e.g., decimal numbers with dots).
 * @param text - the input string
 * @param delim - the delimiter character, e.g. ',' or '.'
 * @returns array with exactly 2 parts, or array with 1 part if no unescaped delimiter found
 */
function splitFirstUnescaped(text: string, delim: string): string[] {
  const reDelim = escapeRegex(delim);
  const splitRe = new RegExp(`(?<!\\\\)${reDelim}`);
  const unescapeRe = new RegExp(`\\\\${reDelim}`, "g");
  const parts = text.split(splitRe);
  const firstPart = parts[0] ?? "";
  if (parts.length === 1) {
    return [firstPart.replace(unescapeRe, delim)];
  }
  // Join everything after the first split back together
  const part1 = firstPart.replace(unescapeRe, delim);
  const part2 = parts.slice(1).join(delim).replace(unescapeRe, delim);
  return [part1, part2];
}

/**
 * Helper: validate a `pattern` string against its SCORM definition
 */
function validatePattern(type: string, pattern: string, responseDef: ResponseType) {
  // Reject patterns with leading or trailing whitespace
  if (pattern.trim() !== pattern) {
    throw new Scorm2004ValidationError(
      "cmi.interactions.n.correct_responses.n.pattern",
      scorm2004_errors.TYPE_MISMATCH as number,
    );
  }

  // Reject any nodes with leading/trailing whitespace around tokens
  const subDelim1 = responseDef.delimiter ? stripBrackets(responseDef.delimiter) : null;
  const rawNodes = subDelim1 ? splitUnescaped(pattern, subDelim1) : [pattern];
  for (const raw of rawNodes) {
    if (raw.trim() !== raw) {
      throw new Scorm2004ValidationError(
        "cmi.interactions.n.correct_responses.n.pattern",
        scorm2004_errors.TYPE_MISMATCH as number,
      );
    }
  }

  // Allow empty fill-in patterns
  if (type === "fill-in" && pattern === "") {
    return;
  }
  // Split into nodes on the primary delimiter (if any)
  const delim1 = responseDef.delimiter ? stripBrackets(responseDef.delimiter) : null;
  let nodes: string[];
  if (delim1) {
    nodes = splitUnescaped(pattern, delim1);
  } else {
    nodes = [pattern];
  }

  // If no primary delimiter but pattern contains comma, reject multiple entries
  if (!responseDef.delimiter && pattern.includes(",")) {
    throw new Scorm2004ValidationError(
      "cmi.interactions.n.correct_responses.n.pattern",
      scorm2004_errors.TYPE_MISMATCH as number,
    );
  }

  // Enforce uniqueness or disallow duplicates if required
  if (responseDef.unique || responseDef.duplicate === false) {
    const seen = new Set(nodes);
    if (seen.size !== nodes.length) {
      throw new Scorm2004ValidationError(
        "cmi.interactions.n.correct_responses.n.pattern",
        scorm2004_errors.TYPE_MISMATCH as number,
      );
    }
  }

  // Must have at least 1 node, and no more than max
  if (nodes.length === 0 || nodes.length > responseDef.max) {
    throw new Scorm2004ValidationError(
      "cmi.interactions.n.correct_responses.n.pattern",
      scorm2004_errors.GENERAL_SET_FAILURE as number,
    );
  }

  const fmt1 = new RegExp(responseDef.format);
  const fmt2 = responseDef.format2 ? new RegExp(responseDef.format2) : null;

  const checkSingle = (value: string) => {
    if (!fmt1.test(value)) {
      throw new Scorm2004ValidationError(
        "cmi.interactions.n.correct_responses.n.pattern",
        scorm2004_errors.TYPE_MISMATCH as number,
      );
    }
  };

  const checkPair = (value: string, delimBracketed?: string) => {
    if (!delimBracketed) {
      throw new Scorm2004ValidationError(
        "cmi.interactions.n.correct_responses.n.pattern",
        scorm2004_errors.TYPE_MISMATCH as number,
      );
    }
    const delim = stripBrackets(delimBracketed);
    const parts = value
      .split(new RegExp(`(?<!\\\\)${escapeRegex(delim)}`, "g"))
      .map((n) => n.replace(new RegExp(`\\\\${escapeRegex(delim)}`, "g"), delim));
    if (parts.length !== 2 || parts[0] === "" || parts[1] === "") {
      throw new Scorm2004ValidationError(
        "cmi.interactions.n.correct_responses.n.pattern",
        scorm2004_errors.TYPE_MISMATCH as number,
      );
    }
    // test both parts
    if (
      (parts[0] !== undefined && !fmt1.test(parts[0])) ||
      (fmt2 && parts[1] !== undefined && !fmt2.test(parts[1]))
    ) {
      throw new Scorm2004ValidationError(
        "cmi.interactions.n.correct_responses.n.pattern",
        scorm2004_errors.TYPE_MISMATCH as number,
      );
    }
  };

  for (const node of nodes) {
    switch (type) {
      case "numeric": {
        // 1 or 2 numeric values separated by ":"
        const numDelim = responseDef.delimiter ? stripBrackets(responseDef.delimiter) : ":";
        const nums = node.split(numDelim);
        if (nums.length < 1 || nums.length > 2) {
          throw new Scorm2004ValidationError(
            "cmi.interactions.n.correct_responses.n.pattern",
            scorm2004_errors.TYPE_MISMATCH as number,
          );
        }
        nums.forEach(checkSingle);
        break;
      }

      case "performance": {
        // Performance pattern: step_name.step_answer
        // - step_name must match format (CMIShortIdentifier)
        // - step_answer can be:
        //   1. A CMIShortIdentifier (e.g., "answer1")
        //   2. A decimal number (e.g., "3.14") - contains literal dots!
        //   3. A numeric range (e.g., "3.5:4.2") - contains literal dots and colon!
        //
        // CRITICAL: Must split on FIRST unescaped dot only, because step_answer
        // may contain literal dots (for decimal numbers like "3.14")
        const delimBracketed = responseDef.delimiter2;
        if (!delimBracketed) {
          throw new Scorm2004ValidationError(
            "cmi.interactions.n.correct_responses.n.pattern",
            scorm2004_errors.TYPE_MISMATCH as number,
          );
        }
        const delim = stripBrackets(delimBracketed);

        // Split on the FIRST unescaped delimiter only
        const parts = splitFirstUnescaped(node, delim);

        // Must have exactly 2 parts (step_name and step_answer)
        if (parts.length !== 2) {
          throw new Scorm2004ValidationError(
            "cmi.interactions.n.correct_responses.n.pattern",
            scorm2004_errors.TYPE_MISMATCH as number,
          );
        }

        const [part1, part2] = parts;

        // Validate non-empty and not identical
        if (part1 === "" || part2 === "" || part1 === part2) {
          throw new Scorm2004ValidationError(
            "cmi.interactions.n.correct_responses.n.pattern",
            scorm2004_errors.TYPE_MISMATCH as number,
          );
        }

        // Validate part1 (step_name) against format (CMIShortIdentifier)
        if (part1 === undefined || !fmt1.test(part1)) {
          throw new Scorm2004ValidationError(
            "cmi.interactions.n.correct_responses.n.pattern",
            scorm2004_errors.TYPE_MISMATCH as number,
          );
        }

        // Validate part2 (step_answer) against format2
        // format2 allows: CMIShortIdentifier | decimal | decimal:decimal
        if (fmt2 && part2 !== undefined && !fmt2.test(part2)) {
          throw new Scorm2004ValidationError(
            "cmi.interactions.n.correct_responses.n.pattern",
            scorm2004_errors.TYPE_MISMATCH as number,
          );
        }
        break;
      }

      default:
        if (responseDef.delimiter2) {
          // matching and other two-part types
          checkPair(node, responseDef.delimiter2);
        } else {
          // simple single-value types (true-false, choice, fill-in, etc.)
          checkSingle(node);
        }
    }
  }
}

/**
 * Class representing SCORM 2004's cmi.interactions.n.correct_responses.n object
 *
 * Per SCORM 2004 RTE Section 4.1.6.2 and Appendix D:
 * - Defines correct response patterns for interactions
 * - pattern: Format depends on interaction type (see Appendix D)
 * - Validates pattern against type-specific rules
 * - Supports escaped delimiters in patterns
 * - Multiple correct responses allowed for some types
 * - Type-specific validation ensures data integrity
 *
 * @extends BaseCMI
 */
export class CMIInteractionsCorrectResponsesObject extends BaseCMI {
  private _pattern = "";
  private readonly _interactionType?: string | undefined;

  /**
   * Constructor for cmi.interactions.n.correct_responses.n
   * @param interactionType The type of interaction (e.g. "numeric", "choice", etc.)
   */
  constructor(interactionType?: string) {
    super("cmi.interactions.n.correct_responses.n");
    this._interactionType = interactionType;
  }

  override reset() {
    this._initialized = false;
    this._pattern = "";
  }

  get pattern(): string {
    return this._pattern;
  }

  set pattern(pattern: string) {
    // Allow empty fill-in patterns
    if (this._interactionType === "fill-in" && pattern === "") {
      this._pattern = "";
      return;
    }
    // 1) Basic SCORM‐pattern format check
    if (
      !check2004ValidFormat(this._cmi_element + ".pattern", pattern, scorm2004_regex.CMIFeedback)
    ) {
      return;
    }

    // 2) If we know the interaction type, run the detailed validator
    if (this._interactionType) {
      const responseDef = CorrectResponses[this._interactionType];
      if (responseDef) {
        // Skip detailed validation for matching when pattern contains escaped comma or dot
        if (this._interactionType === "matching" && /\\[.,]/.test(pattern)) {
          // accept escaped comma or dot patterns without further validation
        } else {
          validatePattern(this._interactionType, pattern, responseDef);
        }
      }
    }

    // 3) Finally, set
    this._pattern = pattern;
  }

  toJSON(): { pattern: string } {
    this.jsonString = true;
    const result = { pattern: this.pattern };
    this.jsonString = false;
    return result;
  }
}
