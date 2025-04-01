/**
 * Validation functions for SCORM 2004
 */
import { scorm2004_errors } from "../constants/error_codes";
import {
  CorrectResponses,
  ResponseType,
} from "../constants/response_constants";
import ValidLanguages from "../constants/language_constants";
import { scorm2004_regex } from "../constants/regex";
import { CMIArray } from "../cmi/common/array";
import { CMIInteractionsObject } from "../cmi/scorm2004/interactions";

/**
 * Checks for valid response types
 * @param {object} response_type
 * @param {any} value
 * @param {string} interaction_type
 * @param {Function} throwSCORMError - Function to throw a SCORM error
 * @param {Function} checkCorrectResponseValue - Function to check correct response value
 */
export function checkValidResponseType(
  response_type: ResponseType,
  value: any,
  interaction_type: string,
  throwSCORMError: (errorCode: string | number, message?: string) => void,
  checkCorrectResponseValue: (
    interaction_type: string,
    nodes: Array<any>,
    value: any,
  ) => void,
) {
  let nodes = [];
  if (response_type?.delimiter) {
    nodes = String(value).split(response_type.delimiter);
  } else {
    nodes[0] = value;
  }

  if (nodes.length > 0 && nodes.length <= response_type.max) {
    checkCorrectResponseValue(interaction_type, nodes, value);
  } else if (nodes.length > response_type.max) {
    throwSCORMError(
      scorm2004_errors.GENERAL_SET_FAILURE,
      "Data Model Element Pattern Too Long",
    );
  }
}

/**
 * Checks for duplicate 'choice' responses.
 * @param {CMIInteractionsObject} interaction
 * @param {any} value
 * @param {Function} throwSCORMError - Function to throw a SCORM error
 * @param {string} lastErrorCode - The last error code
 */
export function checkDuplicateChoiceResponse(
  interaction: CMIInteractionsObject,
  value: any,
  throwSCORMError: (errorCode: string | number, message?: string) => void,
  lastErrorCode: string,
) {
  const interaction_count = interaction.correct_responses._count;
  if (interaction.type === "choice") {
    for (let i = 0; i < interaction_count && lastErrorCode === "0"; i++) {
      const response = interaction.correct_responses.childArray[i];
      if (response.pattern === value) {
        throwSCORMError(scorm2004_errors.GENERAL_SET_FAILURE);
      }
    }
  }
}

/**
 * Validate correct response.
 * @param {string} CMIElement
 * @param {*} value
 * @param {CMIInteractionsObject} interaction
 * @param {Function} throwSCORMError - Function to throw a SCORM error
 * @param {string} lastErrorCode - The last error code
 * @param {Function} checkDuplicateChoiceResponseFn - Function to check for duplicate choice responses
 * @param {Function} checkValidResponseTypeFn - Function to check for valid response types
 * @param {Function} checkDuplicatedPatternFn - Function to check for duplicated patterns
 * @param {Function} checkCorrectResponseValueFn - Function to check correct response value
 */
export function validateCorrectResponse(
  CMIElement: string,
  value: any,
  interaction: CMIInteractionsObject,
  throwSCORMError: (errorCode: string | number, message?: string) => void,
  lastErrorCode: string,
  checkDuplicateChoiceResponseFn: (
    interaction: CMIInteractionsObject,
    value: any,
    throwSCORMError: (errorCode: string, message?: string) => void,
    lastErrorCode: string,
  ) => void,
  checkValidResponseTypeFn: (
    response_type: ResponseType,
    value: any,
    interaction_type: string,
    throwSCORMError: (errorCode: string, message?: string) => void,
    checkCorrectResponseValue: (
      interaction_type: string,
      nodes: Array<any>,
      value: any,
    ) => void,
  ) => void,
  checkDuplicatedPatternFn: (
    correct_response: CMIArray,
    current_index: number,
    value: any,
  ) => boolean,
  checkCorrectResponseValueFn: (
    interaction_type: string,
    nodes: Array<any>,
    value: any,
  ) => void,
) {
  const parts = CMIElement.split(".");
  const pattern_index = Number(parts[4]);

  const interaction_count = interaction.correct_responses._count;
  checkDuplicateChoiceResponseFn(
    interaction,
    value,
    throwSCORMError,
    lastErrorCode,
  );

  const response_type = CorrectResponses[interaction.type];
  if (
    typeof response_type.limit === "undefined" ||
    interaction_count <= response_type.limit
  ) {
    checkValidResponseTypeFn(
      response_type,
      value,
      interaction.type,
      throwSCORMError,
      checkCorrectResponseValueFn,
    );

    if (
      (lastErrorCode === "0" &&
        (!response_type.duplicate ||
          !checkDuplicatedPatternFn(
            interaction.correct_responses,
            pattern_index,
            value,
          ))) ||
      (lastErrorCode === "0" && value === "")
    ) {
      // do nothing, we want the inverse
    } else {
      if (lastErrorCode === "0") {
        throwSCORMError(
          scorm2004_errors.GENERAL_SET_FAILURE,
          "Data Model Element Pattern Already Exists",
        );
      }
    }
  } else {
    throwSCORMError(
      scorm2004_errors.GENERAL_SET_FAILURE,
      "Data Model Element Collection Limit Reached",
    );
  }
}

/**
 * Check to see if a correct_response value has been duplicated
 * @param {CMIArray} correct_response
 * @param {number} current_index
 * @param {*} value
 * @return {boolean}
 */
export function checkDuplicatedPattern(
  correct_response: CMIArray,
  current_index: number,
  value: any,
): boolean {
  let found = false;
  const count = correct_response._count;
  for (let i = 0; i < count && !found; i++) {
    if (i !== current_index && correct_response.childArray[i] === value) {
      found = true;
    }
  }
  return found;
}

/**
 * Checks for a valid correct_response value
 * @param {string} interaction_type
 * @param {Array} nodes
 * @param {*} value
 * @param {Function} throwSCORMError - Function to throw a SCORM error
 * @param {Function} removeCorrectResponsePrefixes - Function to remove correct response prefixes
 * @param {string} lastErrorCode - The last error code
 */
export function checkCorrectResponseValue(
  interaction_type: string,
  nodes: Array<any>,
  value: any,
  throwSCORMError: (errorCode: string | number, message?: string) => void,
  removeCorrectResponsePrefixes: (node: string) => any,
  lastErrorCode: string,
) {
  const response = CorrectResponses[interaction_type];
  const formatRegex = new RegExp(response.format);
  for (let i = 0; i < nodes.length && lastErrorCode === "0"; i++) {
    if (
      interaction_type.match(
        "^(fill-in|long-fill-in|matching|performance|sequencing)$",
      )
    ) {
      nodes[i] = removeCorrectResponsePrefixes(nodes[i]);
    }

    if (response?.delimiter2) {
      const values = nodes[i].split(response.delimiter2);
      if (values.length === 2) {
        const matches = values[0].match(formatRegex);
        if (!matches) {
          throwSCORMError(scorm2004_errors.TYPE_MISMATCH);
        } else {
          if (
            !response.format2 ||
            !values[1].match(new RegExp(response.format2))
          ) {
            throwSCORMError(scorm2004_errors.TYPE_MISMATCH);
          }
        }
      } else {
        throwSCORMError(scorm2004_errors.TYPE_MISMATCH);
      }
    } else {
      const matches = nodes[i].match(formatRegex);
      if (
        (!matches && value !== "") ||
        (!matches && interaction_type === "true-false")
      ) {
        throwSCORMError(scorm2004_errors.TYPE_MISMATCH);
      } else {
        if (interaction_type === "numeric" && nodes.length > 1) {
          if (Number(nodes[0]) > Number(nodes[1])) {
            throwSCORMError(scorm2004_errors.TYPE_MISMATCH);
          }
        } else {
          if (nodes[i] !== "" && response.unique) {
            for (let j = 0; j < i && lastErrorCode === "0"; j++) {
              if (nodes[i] === nodes[j]) {
                throwSCORMError(scorm2004_errors.TYPE_MISMATCH);
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
 * @param {string} node
 * @param {Function} throwSCORMError - Function to throw a SCORM error
 * @return {*}
 */
export function removeCorrectResponsePrefixes(
  node: string,
  throwSCORMError: (errorCode: string | number, message?: string) => void,
): any {
  let seenOrder = false;
  let seenCase = false;
  let seenLang = false;

  const prefixRegex = new RegExp(
    "^({(lang|case_matters|order_matters)=([^}]+)})",
  );
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
              throwSCORMError(scorm2004_errors.TYPE_MISMATCH);
            }
          }
        }
        seenLang = true;
        break;
      case "case_matters":
        if (!seenLang && !seenOrder && !seenCase) {
          if (matches[3] !== "true" && matches[3] !== "false") {
            throwSCORMError(scorm2004_errors.TYPE_MISMATCH);
          }
        }

        seenCase = true;
        break;
      case "order_matters":
        if (!seenCase && !seenLang && !seenOrder) {
          if (matches[3] !== "true" && matches[3] !== "false") {
            throwSCORMError(scorm2004_errors.TYPE_MISMATCH);
          }
        }

        seenOrder = true;
        break;
    }
    node = node.substring(matches[1].length);
    matches = node.match(prefixRegex);
  }

  return node;
}
