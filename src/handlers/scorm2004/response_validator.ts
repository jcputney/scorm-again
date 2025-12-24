import { CMIArray } from "../../cmi/common/array";
import {
  CMIInteractionsCorrectResponsesObject,
  CMIInteractionsObject,
} from "../../cmi/scorm2004/interactions";
import {
  CorrectResponses,
  ResponseType,
  scorm2004_errors,
  scorm2004_regex,
  ValidLanguages,
} from "../../constants";

/**
 * Context interface for error handling callbacks
 */
export interface ValidationContext {
  throwSCORMError: (element: string, errorCode: number, message?: string) => void;
  getLastErrorCode: () => string;
  /** Optional callback to delegate checkCorrectResponseValue to the API (for test spying) */
  checkCorrectResponseValue?: (
    CMIElement: string,
    interaction_type: string,
    nodes: Array<any>,
    value: any,
  ) => void;
}

/**
 * Handles validation of SCORM 2004 correct responses for interactions
 *
 * This class is responsible for:
 * - Validating response types against SCORM 2004 specifications
 * - Checking for duplicate choice responses
 * - Validating correct response values
 * - Removing and validating response prefixes
 */
export class Scorm2004ResponseValidator {
  private context: ValidationContext;

  constructor(context: ValidationContext) {
    this.context = context;
  }

  /**
   * Checks for valid response types
   * @param {string} CMIElement - The CMI element path
   * @param {ResponseType} response_type - The response type configuration
   * @param {any} value - The value to validate
   * @param {string} interaction_type - The type of interaction
   */
  checkValidResponseType(
    CMIElement: string,
    response_type: ResponseType,
    value: any,
    interaction_type: string,
  ): void {
    let nodes: any[] = [];
    if (response_type?.delimiter) {
      nodes = String(value).split(response_type.delimiter);
    } else {
      nodes[0] = value;
    }

    if (nodes.length > 0 && nodes.length <= response_type.max) {
      // Use context callback if available (for API integration), otherwise call directly
      if (this.context.checkCorrectResponseValue) {
        this.context.checkCorrectResponseValue(CMIElement, interaction_type, nodes, value);
      } else {
        this.checkCorrectResponseValue(CMIElement, interaction_type, nodes, value);
      }
    } else if (nodes.length > response_type.max) {
      this.context.throwSCORMError(
        CMIElement,
        scorm2004_errors.GENERAL_SET_FAILURE!,
        `Data Model Element Pattern Too Long: ${value}`,
      );
    }
  }

  /**
   * Checks for duplicate 'choice' responses
   * @param {string} CMIElement - The CMI element path
   * @param {CMIInteractionsObject} interaction - The interaction object
   * @param {any} value - The value to check for duplicates
   */
  checkDuplicateChoiceResponse(
    CMIElement: string,
    interaction: CMIInteractionsObject,
    value: any,
  ): void {
    const interaction_count = interaction.correct_responses._count;
    if (interaction.type === "choice") {
      for (let i = 0; i < interaction_count && this.context.getLastErrorCode() === "0"; i++) {
        const response = interaction.correct_responses.childArray[i] as
          | CMIInteractionsCorrectResponsesObject
          | undefined;
        if (response?.pattern === value) {
          this.context.throwSCORMError(CMIElement, scorm2004_errors.GENERAL_SET_FAILURE!, `${value}`);
        }
      }
    }
  }

  /**
   * Validate correct response
   * @param {string} CMIElement - The CMI element path
   * @param {CMIInteractionsObject} interaction - The interaction object
   * @param {*} value - The value to validate
   */
  validateCorrectResponse(CMIElement: string, interaction: CMIInteractionsObject, value: any): void {
    const parts = CMIElement.split(".");
    const pattern_index = Number(parts[4]);

    if (!interaction) {
      this.context.throwSCORMError(
        CMIElement,
        scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED!,
        CMIElement,
      );
      return;
    }

    const interaction_count = interaction.correct_responses._count;
    this.checkDuplicateChoiceResponse(CMIElement, interaction, value);

    const response_type = CorrectResponses[interaction.type];
    if (
      response_type &&
      (typeof response_type.limit === "undefined" || interaction_count < response_type.limit)
    ) {
      this.checkValidResponseType(CMIElement, response_type, value, interaction.type);

      if (
        (this.context.getLastErrorCode() === "0" &&
          (!response_type.duplicate ||
            !this.checkDuplicatedPattern(
              interaction.correct_responses,
              pattern_index,
              value,
            ))) ||
        (this.context.getLastErrorCode() === "0" && value === "")
      ) {
        // do nothing, we want the inverse
      } else {
        if (this.context.getLastErrorCode() === "0") {
          this.context.throwSCORMError(
            CMIElement,
            scorm2004_errors.GENERAL_SET_FAILURE!,
            `Data Model Element Pattern Already Exists: ${CMIElement} - ${value}`,
          );
        }
      }
    } else {
      this.context.throwSCORMError(
        CMIElement,
        scorm2004_errors.GENERAL_SET_FAILURE!,
        `Data Model Element Collection Limit Reached: ${CMIElement} - ${value}`,
      );
    }
  }

  /**
   * Check to see if a correct_response value has been duplicated
   * @param {CMIArray} correct_response - The correct responses array
   * @param {number} current_index - The current index to skip
   * @param {*} value - The value to check for duplicates
   * @return {boolean} True if pattern is duplicated
   */
  checkDuplicatedPattern(correct_response: CMIArray, current_index: number, value: any): boolean {
    let found = false;
    const count = correct_response._count;
    for (let i = 0; i < count && !found; i++) {
      if (i !== current_index) {
        const item = correct_response.childArray[i] as
          | CMIInteractionsCorrectResponsesObject
          | undefined;
        const existingPattern = item?.pattern;
        if (existingPattern === value) {
          found = true;
        }
      }
    }
    return found;
  }

  /**
   * Checks for a valid correct_response value
   * @param {string} CMIElement - The CMI element path
   * @param {string} interaction_type - The type of interaction
   * @param {Array} nodes - Array of parsed response nodes
   * @param {*} value - The original value
   */
  checkCorrectResponseValue(
    CMIElement: string,
    interaction_type: string,
    nodes: Array<any>,
    value: any,
  ): void {
    const response = CorrectResponses[interaction_type];
    if (!response) {
      this.context.throwSCORMError(
        CMIElement,
        scorm2004_errors.TYPE_MISMATCH!,
        `Incorrect Response Type: ${interaction_type}`,
      );
      return;
    }
    const formatRegex = new RegExp(response.format);
    for (let i = 0; i < nodes.length && this.context.getLastErrorCode() === "0"; i++) {
      if (interaction_type.match("^(fill-in|long-fill-in|matching|performance|sequencing)$")) {
        nodes[i] = this.removeCorrectResponsePrefixes(CMIElement, nodes[i]);
      }

      if (response?.delimiter2) {
        const values = nodes[i].split(response.delimiter2);
        if (values.length === 2) {
          const matches = values[0].match(formatRegex);
          if (!matches) {
            this.context.throwSCORMError(
              CMIElement,
              scorm2004_errors.TYPE_MISMATCH!,
              `${interaction_type}: ${value}`,
            );
          } else {
            if (!response.format2 || !values[1].match(new RegExp(response.format2))) {
              this.context.throwSCORMError(
                CMIElement,
                scorm2004_errors.TYPE_MISMATCH!,
                `${interaction_type}: ${value}`,
              );
            }
          }
        } else {
          this.context.throwSCORMError(
            CMIElement,
            scorm2004_errors.TYPE_MISMATCH!,
            `${interaction_type}: ${value}`,
          );
        }
      } else {
        const matches = nodes[i].match(formatRegex);
        if ((!matches && value !== "") || (!matches && interaction_type === "true-false")) {
          this.context.throwSCORMError(
            CMIElement,
            scorm2004_errors.TYPE_MISMATCH!,
            `${interaction_type}: ${value}`,
          );
        } else {
          if (interaction_type === "numeric" && nodes.length > 1) {
            if (Number(nodes[0]) > Number(nodes[1])) {
              this.context.throwSCORMError(
                CMIElement,
                scorm2004_errors.TYPE_MISMATCH!,
                `${interaction_type}: ${value}`,
              );
            }
          } else {
            if (nodes[i] !== "" && response.unique) {
              for (let j = 0; j < i && this.context.getLastErrorCode() === "0"; j++) {
                if (nodes[i] === nodes[j]) {
                  this.context.throwSCORMError(
                    CMIElement,
                    scorm2004_errors.TYPE_MISMATCH!,
                    `${interaction_type}: ${value}`,
                  );
                }
              }
            }
          }
        }
      }
    }
  }

  /**
   * Remove prefixes from correct_response
   * @param {string} CMIElement - The CMI element path
   * @param {string} node - The node string with potential prefixes
   * @return {*} The node with prefixes removed
   */
  removeCorrectResponsePrefixes(CMIElement: string, node: string): any {
    let seenOrder = false;
    let seenCase = false;
    let seenLang = false;

    const prefixRegex = new RegExp("^({(lang|case_matters|order_matters)=([^}]+)})");
    let matches = node.match(prefixRegex);
    let langMatches = null;
    while (matches) {
      switch (matches[2]) {
        case "lang":
          langMatches = node.match(scorm2004_regex.CMILangcr);
          if (langMatches) {
            const lang = langMatches[3];
            if (lang !== undefined && lang.length > 0) {
              if (!ValidLanguages.includes(lang.toLowerCase())) {
                this.context.throwSCORMError(CMIElement, scorm2004_errors.TYPE_MISMATCH!, `${node}`);
              }
            }
          }
          seenLang = true;
          break;
        case "case_matters":
          if (!seenLang && !seenOrder && !seenCase) {
            if (matches[3] !== "true" && matches[3] !== "false") {
              this.context.throwSCORMError(CMIElement, scorm2004_errors.TYPE_MISMATCH!, `${node}`);
            }
          }

          seenCase = true;
          break;
        case "order_matters":
          if (!seenCase && !seenLang && !seenOrder) {
            if (matches[3] !== "true" && matches[3] !== "false") {
              this.context.throwSCORMError(CMIElement, scorm2004_errors.TYPE_MISMATCH!, `${node}`);
            }
          }

          seenOrder = true;
          break;
      }
      node = node.substring(matches[1]?.length || 0);
      matches = node.match(prefixRegex);
    }

    return node;
  }
}
