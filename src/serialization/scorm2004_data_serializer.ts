import { CMI } from "../cmi/scorm2004/cmi";
import { CommitObject, ScoreObject, Settings } from "../types/api_types";
import { flatten, getDurationAsSeconds, StringKeyMap } from "../utilities";
import { CompletionStatus, SuccessStatus } from "../constants/enums";
import { scorm2004_regex } from "../constants/regex";
import { SequencingService } from "../services/SequencingService";
import { GlobalObjectiveManager } from "../objectives/global_objective_manager";
import { ADL } from "../cmi/scorm2004/adl";

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
  adl?: ADL;
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
    const cmiExport = this.renderCMIExport(terminateCommit, includeTotalTime);
    const sharedData = this.captureSharedData();

    const flattened: StringKeyMap = flatten(cmiExport);
    switch (this.context.getSettings().dataCommitFormat) {
      case "flattened":
        return flattened;
      case "params":
        return Object.entries(flattened).map(([item, value]) => `${item}=${value}`);
      case "json":
      default:
        // Compact SCORM 2004 commits are the payload itself (rather than a
        // runtimeData wrapper), so preserve sharedData at its top level.
        if (sharedData) {
          cmiExport.sharedData = sharedData;
        }
        return cmiExport;
    }
  }

  /** Render the runtime CMI envelope without compact-commit metadata. */
  private renderCMIExport(terminateCommit: boolean, includeTotalTime: boolean): StringKeyMap {
    const cmiExport: StringKeyMap = this.context.renderCMIToJSONObject();
    // The structured commit's runtimeData includes the active CMI model and the currently mapped
    // SCORM 2004 ADL data buckets. Navigation state belongs to sequencing persistence, not the
    // per-SCO runtime envelope.
    if (this.context.adl && this.context.adl.data._count > 0) {
      cmiExport.adl = {
        data: JSON.parse(JSON.stringify(this.context.adl.data)),
      };
    }

    if (terminateCommit || includeTotalTime) {
      // Add total_time to the exported cmi object
      (cmiExport.cmi as StringKeyMap).total_time = this.context.cmi.getCurrentTotalTime();
    } else {
      // Remove total_time from export when not terminating
      delete (cmiExport.cmi as StringKeyMap).total_time;
    }
    return cmiExport;
  }

  private captureSharedData(): Record<string, string> | null {
    if (
      !this.context.adl ||
      typeof this.context.adl.captureWritableSharedDataSnapshot !== "function"
    ) {
      return null;
    }
    const sharedData = this.context.adl.captureWritableSharedDataSnapshot();
    return Object.keys(sharedData).length > 0 ? sharedData : null;
  }

  /**
   * Render the cmi object to the proper format for LMS commit
   * @param {boolean} terminateCommit - Whether this is a termination commit
   * @param {boolean} includeTotalTime - Whether to include total time in the commit data
   * @return {CommitObject} The commit object
   */
  renderCommitObject(terminateCommit: boolean, includeTotalTime: boolean = false): CommitObject {
    const cmiExport = this.renderCommitCMI(terminateCommit, includeTotalTime);
    // renderCommitCMI adds compact-only metadata at the payload root. Structured commits expose
    // that metadata beside runtimeData instead, retaining the pre-existing runtimeData format.
    if (!Array.isArray(cmiExport)) {
      delete cmiExport.sharedData;
    }
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

    // Structured top-level fields represent the LMS course result at the session boundary. The
    // CMI export remains the active SCO's runtime data. A sequenced course can roll up to complete
    // while its next/current SCO is still incomplete (for example, a successful pre-test), so a
    // terminate commit must use the root activity's tracking state.
    const sequencingRoot = terminateCommit
      ? this.context.sequencingService?.getSequencingState().rootActivity
      : null;
    if (sequencingRoot) {
      completionStatus = sequencingRoot.completionStatus ?? CompletionStatus.UNKNOWN;
      successStatus = sequencingRoot.successStatus ?? SuccessStatus.UNKNOWN;
    }

    let scoreObject: ScoreObject = this.context.cmi?.score?.getScoreObject() || {};
    if (sequencingRoot) {
      const primaryObjective = sequencingRoot.primaryObjective;
      const hasCourseScore =
        sequencingRoot.objectiveMeasureStatus ||
        primaryObjective?.rawScoreKnown === true ||
        primaryObjective?.minScoreKnown === true ||
        primaryObjective?.maxScoreKnown === true;

      if (hasCourseScore) {
        // At a sequencing boundary the active CMI model still belongs to one SCO. Report the
        // root activity's rolled-up measure as the course score, just as the structured statuses
        // above report the root rather than whichever SCO happened to terminate last.
        scoreObject = {};
        if (sequencingRoot.objectiveMeasureStatus) {
          scoreObject.scaled = sequencingRoot.objectiveNormalizedMeasure;
        }
        if (primaryObjective?.rawScoreKnown) {
          scoreObject.raw = Number(primaryObjective.rawScore);
        }
        if (primaryObjective?.minScoreKnown) {
          scoreObject.min = Number(primaryObjective.minScore);
        }
        if (primaryObjective?.maxScoreKnown) {
          scoreObject.max = Number(primaryObjective.maxScore);
        }
      }
    }
    const commitObject: CommitObject = {
      completionStatus: completionStatus,
      successStatus: successStatus,
      totalTimeSeconds: totalTimeSeconds,
      runtimeData: cmiExport as StringKeyMap,
    };
    const sharedData = this.captureSharedData();
    if (sharedData) {
      commitObject.sharedData = sharedData;
    }
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

    if (this.globalObjectiveManager) {
      // Global objective map values are LMS tracking data. Include the synchronized snapshot in
      // every structured commit so objectivesGlobalToSystem can persist them across course
      // registrations instead of limiting them to the current in-memory sequencing session.
      // A normal RTE Commit does not end the activity attempt, so it must not publish current SCO
      // values into sequencing tracking data. The End Attempt Process performs that transfer.
      // @spec SCORM 2004 4th Ed. SN TB.2.3 / UP.4 and TR SX-04a / SX-04b
      // @spec SCORM 2004 4th Ed. SN 3.10.3 - Objective Map Resolution
      commitObject.globalObjectives = this.globalObjectiveManager.captureGlobalObjectiveSnapshot();
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
