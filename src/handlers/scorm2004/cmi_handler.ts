import { CMI } from "../../cmi/scorm2004/cmi";
import { BaseCMI } from "../../cmi/common/base_cmi";
import { CMIObjectivesObject } from "../../cmi/scorm2004/objectives";
import {
  CMIInteractionsCorrectResponsesObject,
  CMIInteractionsObject,
  CMIInteractionsObjectivesObject,
} from "../../cmi/scorm2004/interactions";
import { CMICommentsObject } from "../../cmi/scorm2004/comments";
import { ADLDataObject } from "../../cmi/scorm2004/adl";
import { CorrectResponses } from "../../constants/response_constants";
import { scorm2004_errors } from "../../constants/error_codes";
import { CompletionStatus, SuccessStatus } from "../../constants/enums";
import { stringMatches } from "../../utilities";
import { Scorm2004ResponseValidator } from "./response_validator";

/**
 * Context interface for CMI handler operations
 */
export interface CMIHandlerContext {
  cmi: CMI;
  isInitialized: () => boolean;
  throwSCORMError: (element: string, errorCode: number, message?: string) => void;
  getLastErrorCode: () => string;
}

/**
 * Handles CMI data model operations for SCORM 2004
 *
 * This class is responsible for:
 * - Creating child elements for arrays (objectives, interactions, comments)
 * - Creating correct response objects for interactions
 * - Evaluating completion status based on SCORM 2004 RTE rules
 * - Evaluating success status based on SCORM 2004 RTE rules
 */
export class Scorm2004CMIHandler {
  private context: CMIHandlerContext;
  private responseValidator: Scorm2004ResponseValidator;

  constructor(context: CMIHandlerContext, responseValidator: Scorm2004ResponseValidator) {
    this.context = context;
    this.responseValidator = responseValidator;
  }

  /**
   * Gets or builds a new child element to add to the array
   *
   * @param {string} CMIElement - The CMI element path
   * @param {any} value - The value being set
   * @param {boolean} foundFirstIndex - Whether the first index was found
   * @return {BaseCMI|null} The child element or null
   */
  getChildElement(CMIElement: string, value: any, foundFirstIndex: boolean): BaseCMI | null {
    if (stringMatches(CMIElement, "cmi\\.objectives\\.\\d+")) {
      return new CMIObjectivesObject();
    }

    if (foundFirstIndex) {
      if (stringMatches(CMIElement, "cmi\\.interactions\\.\\d+\\.correct_responses\\.\\d+")) {
        return this.createCorrectResponsesObject(CMIElement, value);
      } else if (stringMatches(CMIElement, "cmi\\.interactions\\.\\d+\\.objectives\\.\\d+")) {
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
      // Note: SCORM 2004 4th Edition adl.data extension
      // Per strict spec, adl.data elements should be LMS-created and
      // SCOs should only access indices < _count. However, we intentionally
      // allow dynamic creation for backward compatibility with content that
      // creates adl.data elements on-the-fly.
      return new ADLDataObject();
    }

    return null;
  }

  /**
   * Creates a correct responses object for an interaction
   *
   * @param {string} CMIElement - The CMI element path
   * @param {any} value - The value being set
   * @return {BaseCMI|null} The correct responses object or null
   */
  createCorrectResponsesObject(CMIElement: string, value: any): BaseCMI | null {
    const parts = CMIElement.split(".");
    const index = Number(parts[2]);
    const interaction = this.context.cmi.interactions.childArray[index] as
      | CMIInteractionsObject
      | undefined;

    if (this.context.isInitialized()) {
      if (typeof interaction === "undefined" || !interaction.type) {
        this.context.throwSCORMError(
          CMIElement,
          scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED!,
          CMIElement,
        );
        return null;
      } else {
        const interaction_count = interaction.correct_responses._count;
        const response_type = CorrectResponses[interaction.type];

        // Check if limit is exceeded
        if (
          response_type &&
          typeof response_type.limit !== "undefined" &&
          interaction_count >= response_type.limit
        ) {
          this.context.throwSCORMError(
            CMIElement,
            scorm2004_errors.GENERAL_SET_FAILURE!,
            `Data Model Element Collection Limit Reached: ${CMIElement}`,
          );
          return null;
        }

        this.responseValidator.checkDuplicateChoiceResponse(CMIElement, interaction, value);
        if (response_type) {
          this.responseValidator.checkValidResponseType(
            CMIElement,
            response_type,
            value,
            interaction.type,
          );
        } else {
          this.context.throwSCORMError(
            CMIElement,
            scorm2004_errors.GENERAL_SET_FAILURE!,
            `Incorrect Response Type: ${interaction.type}`,
          );
          return null;
        }
      }
    }

    if (this.context.getLastErrorCode() === "0") {
      return new CMIInteractionsCorrectResponsesObject(interaction?.type);
    }

    return null;
  }

  /**
   * Evaluates completion_status per SCORM 2004 RTE Table 4.2.4.1a
   *
   * Rules:
   * 1. If completion_threshold is defined AND progress_measure is set:
   *    - Return "completed" if progress_measure >= completion_threshold
   *    - Return "incomplete" if progress_measure < completion_threshold
   * 2. If completion_threshold is defined but progress_measure is NOT set:
   *    - Return "unknown"
   * 3. Otherwise:
   *    - Return the SCO-set value (or "unknown" if not set)
   *
   * @returns {string} The evaluated completion status
   */
  evaluateCompletionStatus(): string {
    const threshold = this.context.cmi.completion_threshold;
    const progressMeasure = this.context.cmi.progress_measure;
    const storedStatus = this.context.cmi.completion_status;

    // If completion_threshold is defined
    if (threshold !== "" && threshold !== null && threshold !== undefined) {
      const thresholdValue = parseFloat(String(threshold));

      if (!isNaN(thresholdValue)) {
        // Check if progress_measure is set
        if (progressMeasure !== "" && progressMeasure !== null && progressMeasure !== undefined) {
          const progressValue = parseFloat(String(progressMeasure));

          if (!isNaN(progressValue)) {
            // Evaluate based on threshold comparison
            return progressValue >= thresholdValue
              ? CompletionStatus.COMPLETED
              : CompletionStatus.INCOMPLETE;
          }
        }

        // completion_threshold is defined but progress_measure is not set
        return CompletionStatus.UNKNOWN;
      }
    }

    // No completion_threshold defined - return stored value
    return storedStatus || CompletionStatus.UNKNOWN;
  }

  /**
   * Evaluates success_status per SCORM 2004 RTE Table 4.2.21.1a
   *
   * Rules:
   * 1. If scaled_passing_score is defined AND score.scaled is set:
   *    - Return "passed" if score.scaled >= scaled_passing_score
   *    - Return "failed" if score.scaled < scaled_passing_score
   * 2. If scaled_passing_score is defined but score.scaled is NOT set:
   *    - Return "unknown"
   * 3. Otherwise:
   *    - Return the SCO-set value (or "unknown" if not set)
   *
   * @returns {string} The evaluated success status
   */
  evaluateSuccessStatus(): string {
    const scaledPassingScore = this.context.cmi.scaled_passing_score;
    const scaledScore = this.context.cmi.score.scaled;
    const storedStatus = this.context.cmi.success_status;

    // If scaled_passing_score is defined
    if (
      scaledPassingScore !== "" &&
      scaledPassingScore !== null &&
      scaledPassingScore !== undefined
    ) {
      const passingScoreValue = parseFloat(String(scaledPassingScore));

      if (!isNaN(passingScoreValue)) {
        // Check if score.scaled is set
        if (scaledScore !== "" && scaledScore !== null && scaledScore !== undefined) {
          const scoreValue = parseFloat(String(scaledScore));

          if (!isNaN(scoreValue)) {
            // Evaluate based on threshold comparison
            return scoreValue >= passingScoreValue ? SuccessStatus.PASSED : SuccessStatus.FAILED;
          }
        }

        // scaled_passing_score is defined but score.scaled is not set
        return SuccessStatus.UNKNOWN;
      }
    }

    // No scaled_passing_score defined - return stored value
    return storedStatus || SuccessStatus.UNKNOWN;
  }
}
