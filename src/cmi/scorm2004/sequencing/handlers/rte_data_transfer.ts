import { Activity } from "../activity";
import { CompletionStatus, SuccessStatus } from "../../../../constants/enums";

/**
 * Interface for CMI data provided for RTE data transfer
 */
export interface CMIDataForTransfer {
  completion_status?: string;
  success_status?: string;
  score?: {
    scaled?: string;
    raw?: string;
    min?: string;
    max?: string;
  };
  progress_measure?: string;
  objectives?: Array<{
    id: string;
    success_status?: string;
    completion_status?: string;
    score?: {
      scaled?: string;
      raw?: string;
      min?: string;
      max?: string;
    };
    progress_measure?: string;
  }>;
}

/**
 * Score data structure for normalization
 */
export interface ScoreData {
  scaled?: string;
  raw?: string;
  min?: string;
  max?: string;
}

/**
 * Event data emitted during RTE data transfer operations
 */
export interface RteTransferEventData {
  /** The activity ID that received the transferred data */
  activityId: string;
  /** ISO timestamp of when the transfer occurred */
  timestamp: string;
}

/**
 * Context interface for RTE data transfer operations.
 *
 * Provides callbacks to access CMI data and fire events during transfer.
 * All callbacks are invoked synchronously during the transfer process.
 *
 * @remarks
 * This interface enables dependency injection, making the RteDataTransferService
 * testable in isolation without requiring a full TerminationHandler instance.
 */
export interface RteDataTransferContext {
  /** Function to get CMI data from the runtime environment. May return null if no data available. */
  getCMIData: (() => CMIDataForTransfer | null) | null;

  /** Event callback for firing transfer events */
  fireEvent: (eventType: string, data?: RteTransferEventData) => void;
}

/** Valid completion status values per SCORM 2004 specification */
const VALID_COMPLETION_STATUSES: readonly string[] = [
  CompletionStatus.COMPLETED,
  CompletionStatus.INCOMPLETE,
  CompletionStatus.UNKNOWN,
];

/** Valid success status values per SCORM 2004 specification */
const VALID_SUCCESS_STATUSES: readonly string[] = [
  SuccessStatus.PASSED,
  SuccessStatus.FAILED,
  SuccessStatus.UNKNOWN,
];

/**
 * Validates and returns a CompletionStatus value, or null if invalid
 */
function validateCompletionStatus(value: string | undefined): CompletionStatus | null {
  if (value && VALID_COMPLETION_STATUSES.includes(value)) {
    return value as CompletionStatus;
  }
  return null;
}

/**
 * Validates and returns a SuccessStatus value, or null if invalid
 */
function validateSuccessStatus(value: string | undefined): SuccessStatus | null {
  if (value && VALID_SUCCESS_STATUSES.includes(value)) {
    return value as SuccessStatus;
  }
  return null;
}

/**
 * RteDataTransferService
 *
 * Handles the transfer of CMI data from the runtime environment (RTE) to activity state.
 * Extracted from TerminationHandler to follow Single Responsibility Principle.
 *
 * Responsibilities:
 * - Transfer primary objective data (cmi.completion_status, cmi.success_status, cmi.score.*)
 * - Transfer non-primary objectives (cmi.objectives[n].*)
 * - Normalize scores from raw/min/max to scaled format
 * - Set dirty flags to ensure proper global objective mapping
 *
 * @spec SN Book: RTE Data Transfer (referenced in UP.4 End Attempt Process)
 */
export class RteDataTransferService {
  private context: RteDataTransferContext;

  constructor(context: RteDataTransferContext) {
    this.context = context;
  }

  /**
   * Transfer RTE Data to Activity
   * Transfers CMI data from runtime environment to activity state
   * Called at the start of endAttemptProcess to ensure proper data transfer
   * @param {Activity} activity - The activity to transfer data to
   */
  public transferRteData(activity: Activity): void {
    if (!this.context.getCMIData) {
      // No CMI data provider, skip transfer
      return;
    }

    const cmiData = this.context.getCMIData();
    if (!cmiData) {
      return;
    }

    // Transfer primary objective data (cmi.* level)
    this.transferPrimaryObjective(activity, cmiData);

    // Transfer non-primary objectives (cmi.objectives[n])
    this.transferNonPrimaryObjectives(activity, cmiData);

    this.context.fireEvent("onRteDataTransfer", {
      activityId: activity.id,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Transfer primary objective data from CMI to activity
   * @param {Activity} activity - The activity to transfer data to
   * @param {CMIDataForTransfer} cmiData - CMI data from runtime
   */
  public transferPrimaryObjective(activity: Activity, cmiData: CMIDataForTransfer): void {
    // Transfer completion status
    const validatedCompletionStatus = validateCompletionStatus(cmiData.completion_status);
    if (validatedCompletionStatus && validatedCompletionStatus !== CompletionStatus.UNKNOWN) {
      activity.completionStatus = validatedCompletionStatus;
      activity.attemptProgressStatus = true;
    }

    // Collect values that need to be transferred
    let hasSuccessStatus = false;
    let successStatus = false;
    let hasNormalizedMeasure = false;
    let normalizedScore = 0;

    // Transfer success status
    const validatedSuccessStatus = validateSuccessStatus(cmiData.success_status);
    if (validatedSuccessStatus && validatedSuccessStatus !== SuccessStatus.UNKNOWN) {
      successStatus = validatedSuccessStatus === SuccessStatus.PASSED;
      hasSuccessStatus = true;
      activity.objectiveSatisfiedStatus = successStatus;
      activity.objectiveSatisfiedStatusKnown = true; // Mark as known when transferred from CMI
      activity.successStatus = validatedSuccessStatus;
      // Set measureStatus to true so global objective mapping can write to global map
      // Per SCORM 2004 SN Book, when success_status is known, the objective has known status
      activity.objectiveMeasureStatus = true;
    }

    // Transfer score (with normalization support)
    if (cmiData.score) {
      const normalized = this.normalizeScore(cmiData.score);
      if (normalized !== null) {
        normalizedScore = normalized;
        hasNormalizedMeasure = true;
        activity.objectiveNormalizedMeasure = normalizedScore;
        activity.objectiveMeasureStatus = true;
      }
    }

    // Use initializeFromCMI to ensure dirty flags are set for primary objective
    // This must be called after collecting both values to avoid overwriting
    if (activity.primaryObjective && (hasSuccessStatus || hasNormalizedMeasure)) {
      const finalStatus = hasSuccessStatus
        ? successStatus
        : activity.primaryObjective.satisfiedStatus;
      const finalMeasure = hasNormalizedMeasure
        ? normalizedScore
        : activity.primaryObjective.normalizedMeasure;
      const measureStatus = hasSuccessStatus || hasNormalizedMeasure;

      activity.primaryObjective.initializeFromCMI(finalStatus, finalMeasure, measureStatus);

      if (hasSuccessStatus) {
        activity.primaryObjective.satisfiedStatusKnown = true; // Mark as known
        activity.primaryObjective.progressStatus = true;
      }
    }

    // Transfer progress measure
    if (cmiData.progress_measure && cmiData.progress_measure !== "") {
      const progressMeasure = parseFloat(cmiData.progress_measure);
      if (!isNaN(progressMeasure)) {
        activity.progressMeasure = progressMeasure;
        activity.progressMeasureStatus = true;

        if (activity.primaryObjective) {
          activity.primaryObjective.progressMeasure = progressMeasure;
          activity.primaryObjective.progressMeasureStatus = true;
        }
      }
    }
  }

  /**
   * Transfer non-primary objective data from CMI to activity objectives
   * Only transfers changed values to protect global objectives
   * @param {Activity} activity - The activity to transfer data to
   * @param {CMIDataForTransfer} cmiData - CMI data from runtime
   */
  public transferNonPrimaryObjectives(activity: Activity, cmiData: CMIDataForTransfer): void {
    if (!cmiData.objectives || cmiData.objectives.length === 0) {
      return;
    }

    for (const cmiObjective of cmiData.objectives) {
      if (!cmiObjective.id) {
        continue;
      }

      // Find matching activity objective by ID
      const activityObjectiveMatch = activity.getObjectiveById(cmiObjective.id);
      if (!activityObjectiveMatch || activityObjectiveMatch.isPrimary) {
        // Skip if not found or if it's the primary objective (already handled)
        continue;
      }

      const activityObjective = activityObjectiveMatch.objective;

      // Track whether we need to initialize from CMI
      let hasSuccessStatus = false;
      let successStatus = false;
      let hasNormalizedMeasure = false;
      let normalizedScore = 0;

      // Transfer success status (only if changed during runtime)
      const validatedObjSuccessStatus = validateSuccessStatus(cmiObjective.success_status);
      if (validatedObjSuccessStatus && validatedObjSuccessStatus !== SuccessStatus.UNKNOWN) {
        successStatus = validatedObjSuccessStatus === SuccessStatus.PASSED;
        hasSuccessStatus = true;
        activityObjective.progressStatus = true;
      }

      // Transfer completion status
      const validatedObjCompletionStatus = validateCompletionStatus(cmiObjective.completion_status);
      if (validatedObjCompletionStatus && validatedObjCompletionStatus !== CompletionStatus.UNKNOWN) {
        activityObjective.completionStatus = validatedObjCompletionStatus;
      }

      // Transfer score (with normalization)
      if (cmiObjective.score) {
        const normalized = this.normalizeScore(cmiObjective.score);
        if (normalized !== null) {
          normalizedScore = normalized;
          hasNormalizedMeasure = true;
        }
      }

      // If we have either success status or normalized measure from CMI, use initializeFromCMI
      // to ensure dirty flags are set even if values match defaults
      if (hasSuccessStatus || hasNormalizedMeasure) {
        const finalStatus = hasSuccessStatus ? successStatus : activityObjective.satisfiedStatus;
        const finalMeasure = hasNormalizedMeasure
          ? normalizedScore
          : activityObjective.normalizedMeasure;
        const measureStatus = hasNormalizedMeasure;
        activityObjective.initializeFromCMI(finalStatus, finalMeasure, measureStatus);
      }

      // Transfer progress measure
      if (cmiObjective.progress_measure && cmiObjective.progress_measure !== "") {
        const progressMeasure = parseFloat(cmiObjective.progress_measure);
        if (!isNaN(progressMeasure)) {
          activityObjective.progressMeasure = progressMeasure;
          activityObjective.progressMeasureStatus = true;
        }
      }
    }
  }

  /**
   * Normalize score from raw/min/max if scaled is not available
   * Implements ScaleRawScore process
   * @param {ScoreData} score - Score object with scaled, raw, min, max
   * @return {number | null} - Normalized score or null if cannot normalize
   */
  public normalizeScore(score: ScoreData): number | null {
    // If scaled score exists, use it directly
    if (score.scaled && score.scaled !== "") {
      const scaled = parseFloat(score.scaled);
      if (!isNaN(scaled)) {
        return scaled;
      }
    }

    // If no scaled score, try to calculate from raw/min/max
    if (
      score.raw &&
      score.raw !== "" &&
      score.min &&
      score.min !== "" &&
      score.max &&
      score.max !== ""
    ) {
      const raw = parseFloat(score.raw);
      const min = parseFloat(score.min);
      const max = parseFloat(score.max);

      if (!isNaN(raw) && !isNaN(min) && !isNaN(max) && max > min) {
        // ScaleRawScore formula: scaled = (raw - min) / (max - min)
        const normalized = (raw - min) / (max - min);

        // Clamp to [-1, 1] range per SCORM spec
        return Math.max(-1, Math.min(1, normalized));
      }
    }

    return null;
  }
}
