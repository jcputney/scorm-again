import { CMI } from "../cmi/scorm2004/cmi";
import { CommitObject, ScoreObject, Settings } from "../types/api_types";
import { flatten, getDurationAsSeconds, StringKeyMap } from "../utilities";
import { CompletionStatus, SuccessStatus } from "../constants/enums";
import { scorm2004_regex } from "../constants/regex";
import { SequencingService } from "../services/SequencingService";
import { GlobalObjectiveManager } from "../objectives/global_objective_manager";

/**
 * Render CMI to JSON function type
 */
export type RenderCMIToJSONFn = () => StringKeyMap;

/**
 * Context interface for data serialization operations
 * Uses getSettings() function to always get the current settings object
 * (important for handling reset() which creates a new settings object)
 */
export interface DataSerializerContext {
  getSettings: () => Settings;
  cmi: CMI;
  sequencingService: SequencingService | null;
  renderCMIToJSONObject: RenderCMIToJSONFn;
}

/**
 * Handles data serialization for SCORM 2004 LMS commits
 *
 * This class is responsible for:
 * - Rendering CMI data for LMS commits
 * - Building commit objects with metadata
 * - Determining entry values based on previous exit state
 */
export class Scorm2004DataSerializer {
  private context: DataSerializerContext;
  private globalObjectiveManager: GlobalObjectiveManager | null;

  constructor(
    context: DataSerializerContext,
    globalObjectiveManager?: GlobalObjectiveManager | null,
  ) {
    this.context = context;
    this.globalObjectiveManager = globalObjectiveManager || null;
  }

  /**
   * Set the global objective manager (for deferred initialization)
   * @param {GlobalObjectiveManager} manager - The global objective manager
   */
  setGlobalObjectiveManager(manager: GlobalObjectiveManager): void {
    this.globalObjectiveManager = manager;
  }

  /**
   * Update the sequencing service reference
   * @param {SequencingService | null} service - The sequencing service instance
   */
  updateSequencingService(service: SequencingService | null): void {
    this.context.sequencingService = service;
  }

  /**
   * Render the cmi object to the proper format for LMS commit
   *
   * @param {boolean} terminateCommit - Whether this is a termination commit
   * @param {boolean} includeTotalTime - Whether to include total time in the commit data
   * @return {object|Array} The rendered CMI data
   */
  renderCommitCMI(
    terminateCommit: boolean,
    includeTotalTime: boolean = false,
  ): StringKeyMap | Array<any> {
    const cmiExport: StringKeyMap = this.context.renderCMIToJSONObject();

    if (terminateCommit || includeTotalTime) {
      // Add total_time to the exported cmi object
      (cmiExport.cmi as StringKeyMap).total_time = this.context.cmi.getCurrentTotalTime();
    } else {
      // Remove total_time from export when not terminating
      delete (cmiExport.cmi as StringKeyMap).total_time;
    }

    const result = [];
    const flattened: StringKeyMap = flatten(cmiExport);
    const settings = this.context.getSettings();
    switch (settings.dataCommitFormat) {
      case "flattened":
        return flatten(cmiExport);
      case "params":
        for (const item in flattened) {
          if ({}.hasOwnProperty.call(flattened, item)) {
            result.push(`${item}=${flattened[item]}`);
          }
        }
        return result;
      case "json":
      default:
        return cmiExport;
    }
  }

  /**
   * Render the cmi object to the proper format for LMS commit
   * @param {boolean} terminateCommit - Whether this is a termination commit
   * @param {boolean} includeTotalTime - Whether to include total time in the commit data
   * @return {CommitObject} The commit object
   */
  renderCommitObject(terminateCommit: boolean, includeTotalTime: boolean = false): CommitObject {
    const cmiExport = this.renderCommitCMI(terminateCommit, includeTotalTime);
    const calculateTotalTime = terminateCommit || includeTotalTime;
    const totalTimeDuration = calculateTotalTime ? this.context.cmi.getCurrentTotalTime() : "";
    const totalTimeSeconds = getDurationAsSeconds(totalTimeDuration, scorm2004_regex.CMITimespan);

    let completionStatus = CompletionStatus.UNKNOWN;
    let successStatus = SuccessStatus.UNKNOWN;
    if (this.context.cmi.completion_status) {
      if (this.context.cmi.completion_status === "completed") {
        completionStatus = CompletionStatus.COMPLETED;
      } else if (this.context.cmi.completion_status === "incomplete") {
        completionStatus = CompletionStatus.INCOMPLETE;
      }
    }
    if (this.context.cmi.success_status) {
      if (this.context.cmi.success_status === "passed") {
        successStatus = SuccessStatus.PASSED;
      } else if (this.context.cmi.success_status === "failed") {
        successStatus = SuccessStatus.FAILED;
      }
    }

    const scoreObject: ScoreObject = this.context.cmi?.score?.getScoreObject() || {};
    const commitObject: CommitObject = {
      completionStatus: completionStatus,
      successStatus: successStatus,
      totalTimeSeconds: totalTimeSeconds,
      runtimeData: cmiExport as StringKeyMap,
    };
    if (scoreObject) {
      commitObject.score = scoreObject;
    }

    // Populate metadata if enabled
    const metaSettings = this.context.getSettings();
    if (metaSettings.autoPopulateCommitMetadata) {
      if (metaSettings.courseId) {
        commitObject.courseId = metaSettings.courseId;
      }
      if (metaSettings.scoId) {
        commitObject.scoId = metaSettings.scoId;
      }
      if (this.context.cmi.learner_id) {
        commitObject.learnerId = this.context.cmi.learner_id;
      }
      if (this.context.cmi.learner_name) {
        commitObject.learnerName = this.context.cmi.learner_name;
      }
      // For SCORM 2004, also populate activityId if available from sequencing
      const sequencingState = this.context.sequencingService?.getSequencingState();
      if (sequencingState?.currentActivity?.id) {
        commitObject.activityId = sequencingState.currentActivity.id;
      }
    }

    // Update sequencing activity state based on CMI runtime data
    // This ensures that cmi.success_status updates the primary objective,
    // which then triggers mapInfo global objective writes during rollup
    if (this.globalObjectiveManager) {
      this.globalObjectiveManager.syncCmiToSequencingActivity(
        completionStatus,
        successStatus,
        scoreObject,
      );
    }

    return commitObject;
  }

  /**
   * Determines the appropriate cmi.entry value based on previous exit state.
   * Per SCORM 2004 RTE 4.2.11 (cmi.entry) and 4.2.12 (cmi.exit):
   *
   * - If previous exit was "suspend": "resume" (learner suspended, wants to continue)
   * - If previous exit was "logout": "" (deprecated, attempt ended)
   * - If previous exit was "normal": "" (attempt completed normally)
   * - If previous exit was "time-out":
   *   - With suspend data: "resume" (resuming from interrupted session)
   *   - Without suspend data: "" (session ended)
   * - If no previous exit or unrecognized: "ab-initio" (fresh start)
   *
   * @param {string} previousExit - The cmi.exit value from the previous session
   * @param {boolean} hasSuspendData - Whether suspend_data exists from previous session
   * @return {string} The appropriate cmi.entry value ("ab-initio", "resume", or "")
   */
  determineEntryValue(previousExit: string, hasSuspendData: boolean): string {
    // Trim whitespace to handle edge cases
    const trimmedExit = previousExit?.trim();

    // No previous exit or empty exit means first-time entry
    // Per SCORM 2004 spec Rule 1: ab-initio when this is the first learner session
    if (
      previousExit === "" ||
      previousExit === undefined ||
      previousExit === null ||
      trimmedExit === ""
    ) {
      return "ab-initio";
    }

    // Per SCORM 2004 spec Rule 2: resume when previous exit was "suspend"
    if (previousExit === "suspend") {
      return "resume";
    }

    // Per SCORM 2004 spec: logout and normal always mean empty string
    // (learner previously accessed SCO but didn't suspend)
    if (previousExit === "logout" || previousExit === "normal") {
      return "";
    }

    // Per SCORM 2004 spec: time-out returns "" (or possibly "resume" if suspend data exists)
    // The spec allows resume for time-out when there's suspend data from earlier
    if (previousExit === "time-out") {
      return hasSuspendData ? "resume" : "";
    }

    // Unknown/invalid exit values indicate the learner has accessed the SCO before
    // but conditions for ab-initio or resume aren't met, so return empty string
    return "";
  }
}
