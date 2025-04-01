/**
 * CMI element handling functions for SCORM 2004
 */
import { stringMatches } from "../utilities";
import { scorm2004_errors } from "../constants/error_codes";
import { CorrectResponses } from "../constants/response_constants";
import { BaseCMI } from "../cmi/common/base_cmi";
import {
  CMIInteractionsCorrectResponsesObject,
  CMIInteractionsObject,
  CMIInteractionsObjectivesObject,
} from "../cmi/scorm2004/interactions";
import { CMICommentsObject } from "../cmi/scorm2004/comments";
import { CMIObjectivesObject } from "../cmi/scorm2004/objectives";
import { ADLDataObject } from "../cmi/scorm2004/adl";

/**
 * Gets or builds a new child element to add to the array.
 *
 * @param {string} CMIElement
 * @param {any} value
 * @param {boolean} foundFirstIndex
 * @param {Function} createCorrectResponsesObject - Function to create correct responses object
 * @return {BaseCMI|null}
 */
export function getChildElement(
  CMIElement: string,
  value: any,
  foundFirstIndex: boolean,
  createCorrectResponsesObject: (
    CMIElement: string,
    value: any,
  ) => BaseCMI | null,
): BaseCMI | null {
  if (stringMatches(CMIElement, "cmi\\.objectives\\.\\d+")) {
    return new CMIObjectivesObject();
  }

  if (foundFirstIndex) {
    if (
      stringMatches(
        CMIElement,
        "cmi\\.interactions\\.\\d+\\.correct_responses\\.\\d+",
      )
    ) {
      return createCorrectResponsesObject(CMIElement, value);
    } else if (
      stringMatches(CMIElement, "cmi\\.interactions\\.\\d+\\.objectives\\.\\d+")
    ) {
      return new CMIInteractionsObjectivesObject();
    }
  } else if (stringMatches(CMIElement, "cmi\\.interactions\\.\\d+")) {
    return new CMIInteractionsObject();
  }

  if (stringMatches(CMIElement, "cmi\\.comments_from_learner\\.\\d+")) {
    return new CMICommentsObject();
  } else if (stringMatches(CMIElement, "cmi\\.comments_from_lms\\.\\d+")) {
    return new CMICommentsObject(true);
  }

  if (stringMatches(CMIElement, "adl\\.data\\.\\d+")) {
    return new ADLDataObject();
  }

  return null;
}

/**
 * Creates a correct responses object for an interaction
 *
 * @param {string} CMIElement
 * @param {any} value
 * @param {CMIInteractionsObject[]} interactions - The interactions array
 * @param {Function} throwSCORMError - Function to throw a SCORM error
 * @param {Function} checkDuplicateChoiceResponse - Function to check for duplicate choice responses
 * @param {Function} checkValidResponseType - Function to check for valid response types
 * @param {string} lastErrorCode - The last error code
 * @param {boolean} isInitialized - Whether the API is initialized
 * @param {Function} checkCorrectResponseValue - Function to check correct response value
 * @return {BaseCMI|null}
 */
export function createCorrectResponsesObject(
  CMIElement: string,
  value: any,
  interactions: CMIInteractionsObject[],
  throwSCORMError: (errorCode: string | number, message?: string) => void,
  checkDuplicateChoiceResponse: (
    interaction: CMIInteractionsObject,
    value: any,
    throwSCORMError: (errorCode: string, message?: string) => void,
    lastErrorCode: string,
  ) => void,
  checkValidResponseType: (
    response_type: any,
    value: any,
    interaction_type: string,
    throwSCORMError: (errorCode: string, message?: string) => void,
    checkCorrectResponseValue: (
      interaction_type: string,
      nodes: Array<any>,
      value: any,
    ) => void,
  ) => void,
  lastErrorCode: string,
  isInitialized: boolean,
  checkCorrectResponseValue: (
    interaction_type: string,
    nodes: Array<any>,
    value: any,
  ) => void,
): BaseCMI | null {
  const parts = CMIElement.split(".");
  const index = Number(parts[2]);
  const interaction = interactions[index];

  if (isInitialized) {
    if (typeof interaction === "undefined" || !interaction.type) {
      throwSCORMError(scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED);
      return null;
    } else {
      checkDuplicateChoiceResponse(
        interaction,
        value,
        throwSCORMError,
        lastErrorCode,
      );
      const response_type = CorrectResponses[interaction.type];
      if (response_type) {
        checkValidResponseType(
          response_type,
          value,
          interaction.type,
          throwSCORMError,
          checkCorrectResponseValue,
        );
      } else {
        throwSCORMError(
          scorm2004_errors.GENERAL_SET_FAILURE,
          "Incorrect Response Type: " + interaction.type,
        );
        return null;
      }
    }
  }

  if (lastErrorCode === "0") {
    return new CMIInteractionsCorrectResponsesObject();
  }

  return null;
}
