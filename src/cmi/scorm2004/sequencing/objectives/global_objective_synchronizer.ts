import { Activity, ActivityObjective, ObjectiveMapInfo } from "../activity";
import { CompletionStatus } from "../../../../constants/enums";

/**
 * Event callback function type
 */
export type EventCallback = (eventType: string, data?: unknown) => void;

/**
 * Global objective state structure
 */
export interface GlobalObjective {
  id: string;
  satisfiedStatus: boolean;
  satisfiedStatusKnown: boolean;
  normalizedMeasure: number;
  normalizedMeasureKnown: boolean;
  progressMeasure: number;
  progressMeasureKnown: boolean;
  completionStatus: CompletionStatus;
  completionStatusKnown: boolean;
  satisfiedByMeasure: boolean;
  minNormalizedMeasure: number | null;
  attemptCount?: number;
  attemptAbsoluteDuration?: string;
  attemptExperiencedDuration?: string;
  activityAbsoluteDuration?: string;
  activityExperiencedDuration?: string;
  location?: string;
  suspendData?: string;
  updateAttemptData?: boolean;
}

/**
 * Local objective state for synchronization
 */
export interface LocalObjectiveState {
  id: string;
  satisfiedStatus: boolean;
  measureStatus: boolean;
  normalizedMeasure: number;
  progressMeasure: number;
  progressMeasureStatus: boolean;
  completionStatus: CompletionStatus;
  scaledPassingScore: number | null;
}

/**
 * GlobalObjectiveSynchronizer - Handles cross-activity global objective synchronization
 * Implements SCORM 2004 global objective mapping and shared objectives
 *
 * This class is responsible for synchronizing objective state between local
 * activity objectives and shared global objectives using a two-pass approach:
 * 1. WRITE pass: All activities write their local state TO global objectives
 * 2. READ pass: All activities read FROM global objectives into local state
 *
 * This ensures correct synchronization regardless of tree traversal order.
 *
 * @spec Priority 5 Gap: Comprehensive rollup with global objective mapping
 */
export class GlobalObjectiveSynchronizer {
  private eventCallback: EventCallback | null;

  /**
   * Create a new GlobalObjectiveSynchronizer
   *
   * @param eventCallback - Optional callback for firing events
   */
  constructor(eventCallback?: EventCallback) {
    this.eventCallback = eventCallback || null;
  }

  /**
   * Process global objective mapping for shared objectives
   * Handles cross-activity objective synchronization and global state management
   *
   * IMPORTANT: Uses two-pass approach to ensure correct synchronization order:
   * 1. WRITE pass: All activities write their local state TO global objectives
   * 2. READ pass: All activities read FROM global objectives into local state
   *
   * This ensures that when activity A writes to a global and activity B reads from it,
   * B will see A's data regardless of tree traversal order.
   *
   * @param activity - The root activity to start processing from
   * @param globalObjectives - Global objective map
   */
  public processGlobalObjectiveMapping(
    activity: Activity,
    globalObjectives: Map<string, GlobalObjective>,
  ): void {
    try {
      this.eventCallback?.("global_objective_processing_started", {
        activityId: activity.id,
        globalObjectiveCount: globalObjectives.size,
      });

      // Collect all activities in the tree for two-pass processing
      const allActivities: Activity[] = [];
      this.collectActivitiesRecursive(activity, allActivities);

      // Pass 1: WRITE - All activities write their local state to global objectives
      // This ensures all writes happen before any reads
      for (const act of allActivities) {
        this.syncGlobalObjectivesWritePhase(act, globalObjectives);
      }

      // Pass 2: READ - All activities read from global objectives into local state
      // Now reads can see all writes from all activities
      for (const act of allActivities) {
        this.syncGlobalObjectivesReadPhase(act, globalObjectives);
      }

      this.eventCallback?.("global_objective_processing_completed", {
        activityId: activity.id,
        processedObjectives: globalObjectives.size,
      });
    } catch (error) {
      this.eventCallback?.("global_objective_processing_error", {
        activityId: activity.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  /**
   * Collect all activities in the tree recursively
   *
   * @param activity - Current activity
   * @param result - Array to collect activities into
   */
  public collectActivitiesRecursive(activity: Activity, result: Activity[]): void {
    result.push(activity);
    for (const child of activity.children) {
      this.collectActivitiesRecursive(child, result);
    }
  }

  /**
   * Write phase: Write local objective state TO global objectives
   *
   * @param activity - The activity to process
   * @param globalObjectives - Global objective map
   */
  public syncGlobalObjectivesWritePhase(
    activity: Activity,
    globalObjectives: Map<string, GlobalObjective>,
  ): void {
    const objectives = activity.getAllObjectives();

    for (const objective of objectives) {
      const mapInfos =
        objective.mapInfo.length > 0
          ? objective.mapInfo
          : [this.createDefaultMapInfo(objective)];

      for (const mapInfo of mapInfos) {
        const targetId = mapInfo.targetObjectiveID || objective.id;
        const globalObjective = this.ensureGlobalObjectiveEntry(
          globalObjectives,
          targetId,
          objective,
          mapInfo,
        );

        // Only do WRITE operations in this phase
        // Only write if the objective property has been modified (dirty flag set)
        if (
          mapInfo.writeSatisfiedStatus &&
          objective.measureStatus &&
          objective.isDirty("satisfiedStatus")
        ) {
          globalObjective.satisfiedStatus = objective.satisfiedStatus;
          globalObjective.satisfiedStatusKnown = true;
          objective.clearDirty("satisfiedStatus");
        }

        if (
          mapInfo.writeNormalizedMeasure &&
          objective.measureStatus &&
          objective.isDirty("normalizedMeasure")
        ) {
          globalObjective.normalizedMeasure = objective.normalizedMeasure;
          globalObjective.normalizedMeasureKnown = true;
          objective.clearDirty("normalizedMeasure");

          if (globalObjective.satisfiedByMeasure || objective.satisfiedByMeasure) {
            const threshold =
              objective.minNormalizedMeasure ?? activity.scaledPassingScore ?? 0.7;
            globalObjective.satisfiedStatus = objective.normalizedMeasure >= threshold;
            globalObjective.satisfiedStatusKnown = true;
            // Clear satisfiedStatus dirty flag since we've just synchronized the derived value.
            // When satisfaction is derived from measure, it should always update when measure changes.
            objective.clearDirty("satisfiedStatus");
          }
        }

        if (
          mapInfo.writeCompletionStatus &&
          objective.completionStatus !== CompletionStatus.UNKNOWN &&
          objective.isDirty("completionStatus")
        ) {
          globalObjective.completionStatus = objective.completionStatus;
          globalObjective.completionStatusKnown = true;
          objective.clearDirty("completionStatus");
        }

        if (
          mapInfo.writeProgressMeasure &&
          objective.progressMeasureStatus &&
          objective.isDirty("progressMeasure")
        ) {
          globalObjective.progressMeasure = objective.progressMeasure;
          globalObjective.progressMeasureKnown = true;
          objective.clearDirty("progressMeasure");
        }

        if (mapInfo.updateAttemptData) {
          this.updateActivityAttemptData(activity, globalObjective, objective);
        }
      }
    }
  }

  /**
   * Read phase: Read FROM global objectives into local state
   *
   * @param activity - The activity to process
   * @param globalObjectives - Global objective map
   */
  public syncGlobalObjectivesReadPhase(
    activity: Activity,
    globalObjectives: Map<string, GlobalObjective>,
  ): void {
    const objectives = activity.getAllObjectives();

    for (const objective of objectives) {
      const mapInfos =
        objective.mapInfo.length > 0
          ? objective.mapInfo
          : [this.createDefaultMapInfo(objective)];

      for (const mapInfo of mapInfos) {
        const targetId = mapInfo.targetObjectiveID || objective.id;
        const globalObjective = globalObjectives.get(targetId);

        if (!globalObjective) continue;

        const isPrimary = objective.isPrimary;

        // Only do READ operations in this phase
        if (mapInfo.readSatisfiedStatus && globalObjective.satisfiedStatusKnown) {
          objective.satisfiedStatus = globalObjective.satisfiedStatus;
          objective.measureStatus = true;
        }

        if (mapInfo.readNormalizedMeasure && globalObjective.normalizedMeasureKnown) {
          objective.normalizedMeasure = globalObjective.normalizedMeasure;
          objective.measureStatus = true;

          if (globalObjective.satisfiedByMeasure || objective.satisfiedByMeasure) {
            const threshold =
              objective.minNormalizedMeasure ?? activity.scaledPassingScore ?? 0.7;
            objective.satisfiedStatus = globalObjective.normalizedMeasure >= threshold;
          }
        }

        if (mapInfo.readProgressMeasure && globalObjective.progressMeasureKnown) {
          objective.progressMeasure = globalObjective.progressMeasure;
          objective.progressMeasureStatus = true;
        }

        if (mapInfo.readCompletionStatus && globalObjective.completionStatusKnown) {
          objective.completionStatus = globalObjective.completionStatus as CompletionStatus;
        }

        // Apply primary objective changes to activity
        if (isPrimary) {
          objective.applyToActivity(activity);
        }

        // Fire synchronization event for monitoring/logging
        this.eventCallback?.("objective_synchronized", {
          activityId: activity.id,
          objectiveId: objective.id,
          globalState: globalObjective,
          synchronizationTime: new Date().toISOString(),
        });
      }
    }
  }

  /**
   * Synchronize global objectives with activity-specific objectives
   * Combined read/write operation for backward compatibility
   *
   * @param activity - The activity to synchronize
   * @param globalObjectives - Global objective map
   */
  public synchronizeGlobalObjectives(
    activity: Activity,
    globalObjectives: Map<string, GlobalObjective>,
  ): void {
    const objectives = activity.getAllObjectives();

    for (const objective of objectives) {
      const mapInfos =
        objective.mapInfo.length > 0
          ? objective.mapInfo
          : [this.createDefaultMapInfo(objective)];

      for (const mapInfo of mapInfos) {
        const targetId = mapInfo.targetObjectiveID || objective.id;
        const globalObjective = this.ensureGlobalObjectiveEntry(
          globalObjectives,
          targetId,
          objective,
          mapInfo,
        );
        this.syncObjectiveState(activity, objective, mapInfo, globalObjective);
      }
    }
  }

  /**
   * Synchronize objective state between local and global
   * Full sync operation with both read and write
   *
   * @param activity - The activity
   * @param objective - The objective to sync
   * @param mapInfo - Map info for this objective
   * @param globalObjective - The global objective
   */
  public syncObjectiveState(
    activity: Activity,
    objective: ActivityObjective,
    mapInfo: ObjectiveMapInfo,
    globalObjective: GlobalObjective,
  ): void {
    try {
      const isPrimary = objective.isPrimary;
      const localObjective = this.getLocalObjectiveState(activity, objective, isPrimary);

      // Read from global to local using THIS ACTIVITY'S mapInfo directives
      // Each activity has its own read permissions for the global objective
      if (mapInfo.readSatisfiedStatus && globalObjective.satisfiedStatusKnown) {
        objective.satisfiedStatus = globalObjective.satisfiedStatus;
        objective.measureStatus = true;
      }

      // Read normalized measure
      if (mapInfo.readNormalizedMeasure && globalObjective.normalizedMeasureKnown) {
        objective.normalizedMeasure = globalObjective.normalizedMeasure;
        objective.measureStatus = true;

        if (globalObjective.satisfiedByMeasure || objective.satisfiedByMeasure) {
          const threshold =
            objective.minNormalizedMeasure ?? activity.scaledPassingScore ?? 0.7;
          objective.satisfiedStatus = globalObjective.normalizedMeasure >= threshold;
        }
      }

      if (mapInfo.readProgressMeasure && globalObjective.progressMeasureKnown) {
        objective.progressMeasure = globalObjective.progressMeasure;
        objective.progressMeasureStatus = true;
      }

      if (mapInfo.readCompletionStatus && globalObjective.completionStatusKnown) {
        objective.completionStatus = globalObjective.completionStatus as CompletionStatus;
      }

      if (objective.isPrimary) {
        objective.applyToActivity(activity);
      }

      // Write from local to global using THIS ACTIVITY'S mapInfo directives
      // Each activity has its own write permissions for the global objective
      if (mapInfo.writeSatisfiedStatus && objective.measureStatus) {
        globalObjective.satisfiedStatus = objective.satisfiedStatus;
        globalObjective.satisfiedStatusKnown = true;
      }

      if (mapInfo.writeNormalizedMeasure && objective.measureStatus) {
        globalObjective.normalizedMeasure = objective.normalizedMeasure;
        globalObjective.normalizedMeasureKnown = true;

        if (globalObjective.satisfiedByMeasure || objective.satisfiedByMeasure) {
          const threshold =
            objective.minNormalizedMeasure ?? activity.scaledPassingScore ?? 0.7;
          globalObjective.satisfiedStatus = objective.normalizedMeasure >= threshold;
          globalObjective.satisfiedStatusKnown = true;
        }
      }

      if (
        mapInfo.writeCompletionStatus &&
        objective.completionStatus !== CompletionStatus.UNKNOWN
      ) {
        globalObjective.completionStatus = objective.completionStatus;
        globalObjective.completionStatusKnown = true;
      }

      if (mapInfo.writeProgressMeasure && objective.progressMeasureStatus) {
        globalObjective.progressMeasure = objective.progressMeasure;
        globalObjective.progressMeasureKnown = true;
      }

      if (mapInfo.updateAttemptData) {
        this.updateActivityAttemptData(activity, globalObjective, objective);
      }

      // Fire synchronization event for monitoring/logging
      this.eventCallback?.("objective_synchronized", {
        activityId: activity.id,
        objectiveId: objective.id,
        localState: localObjective,
        globalState: globalObjective,
        synchronizationTime: new Date().toISOString(),
      });
    } catch (error) {
      // Log synchronization error but don't fail the rollup process
      this.eventCallback?.("objective_sync_error", {
        activityId: activity.id,
        objectiveId: objective.id,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Ensure global objective entry exists
   *
   * @param globalObjectives - Global objectives map
   * @param targetId - Target objective ID
   * @param objective - Source objective
   * @param _mapInfo - Map info (unused but kept for API compatibility)
   * @returns The global objective entry
   */
  public ensureGlobalObjectiveEntry(
    globalObjectives: Map<string, GlobalObjective>,
    targetId: string,
    objective: ActivityObjective,
    _mapInfo: ObjectiveMapInfo,
  ): GlobalObjective {
    if (!globalObjectives.has(targetId)) {
      // Create new entry if global objective doesn't exist
      // NOTE: The read/write flags stored here are for reference only.
      // Each activity uses its OWN mapInfo for read/write decisions in syncObjectiveState.
      globalObjectives.set(targetId, {
        id: targetId,
        satisfiedStatus: objective.satisfiedStatus,
        satisfiedStatusKnown: objective.satisfiedStatusKnown,
        normalizedMeasure: objective.normalizedMeasure,
        normalizedMeasureKnown: objective.measureStatus,
        progressMeasure: objective.progressMeasure,
        progressMeasureKnown: objective.progressMeasureStatus,
        completionStatus: objective.completionStatus,
        completionStatusKnown: objective.completionStatus !== CompletionStatus.UNKNOWN,
        satisfiedByMeasure: objective.satisfiedByMeasure,
        minNormalizedMeasure: objective.minNormalizedMeasure,
      });
    }

    return globalObjectives.get(targetId)!;
  }

  /**
   * Create default map info for an objective
   * Default map info should only WRITE to global objectives, not READ
   * Reading should only happen when explicitly configured via mapInfo
   * This prevents unintended overwrites of RTE-transferred data
   *
   * @param objective - The objective to create default map info for
   * @returns Default map info
   */
  public createDefaultMapInfo(objective: ActivityObjective): ObjectiveMapInfo {
    return {
      targetObjectiveID: objective.id,
      readSatisfiedStatus: false,
      writeSatisfiedStatus: true,
      readNormalizedMeasure: false,
      writeNormalizedMeasure: true,
      readCompletionStatus: false,
      writeCompletionStatus: true,
      readProgressMeasure: false,
      writeProgressMeasure: true,
      updateAttemptData: objective.isPrimary,
    };
  }

  /**
   * Get local objective state
   *
   * @param activity - The activity
   * @param objective - The objective
   * @param isPrimary - Whether this is the primary objective
   * @returns Local objective state
   */
  public getLocalObjectiveState(
    activity: Activity,
    objective: ActivityObjective,
    isPrimary: boolean,
  ): LocalObjectiveState {
    if (isPrimary) {
      return {
        id: objective.id,
        satisfiedStatus: activity.objectiveSatisfiedStatus,
        measureStatus: activity.objectiveMeasureStatus,
        normalizedMeasure: activity.objectiveNormalizedMeasure,
        progressMeasure: activity.progressMeasure,
        progressMeasureStatus: activity.progressMeasureStatus,
        completionStatus: activity.completionStatus,
        scaledPassingScore: activity.scaledPassingScore,
      };
    }

    return {
      id: objective.id,
      satisfiedStatus: objective.satisfiedStatus,
      measureStatus: objective.measureStatus,
      normalizedMeasure: objective.normalizedMeasure,
      progressMeasure: objective.progressMeasure,
      progressMeasureStatus: objective.progressMeasureStatus,
      completionStatus: objective.completionStatus,
      scaledPassingScore: objective.minNormalizedMeasure,
    };
  }

  /**
   * Update activity attempt data based on global objective state
   *
   * @param activity - The activity to update
   * @param globalObjective - Global objective state
   * @param objective - The local objective
   */
  public updateActivityAttemptData(
    activity: Activity,
    globalObjective: GlobalObjective,
    objective: ActivityObjective,
  ): void {
    try {
      if (!objective.isPrimary && !globalObjective.updateAttemptData) {
        return;
      }

      // Update attempt completion based on global objective satisfaction
      // Only if completion is NOT controlled by rollup rules
      const hasCompletionRollupRules = activity.rollupRules.rules.some(
        (rule) => rule.action === "completed" || rule.action === "incomplete",
      );

      if (globalObjective.satisfiedStatusKnown && globalObjective.satisfiedStatus) {
        // If global objective is satisfied, update local completion data
        // UNLESS the activity has explicit rollup rules for completion
        if (
          !hasCompletionRollupRules &&
          (activity.completionStatus === CompletionStatus.UNKNOWN ||
            activity.completionStatus === CompletionStatus.INCOMPLETE)
        ) {
          activity.completionStatus = CompletionStatus.COMPLETED;
        }

        // Update success status based on objective satisfaction
        if (activity.successStatus === "unknown") {
          activity.successStatus = "passed";
        }
      }

      // Update attempt count if global objective indicates new attempt
      if (globalObjective.attemptCount && globalObjective.attemptCount > activity.attemptCount) {
        activity.attemptCount = globalObjective.attemptCount;
      }

      // Update completion amount based on progress measure
      if (
        globalObjective.progressMeasureKnown &&
        globalObjective.progressMeasure !== undefined
      ) {
        activity.attemptCompletionAmount = globalObjective.progressMeasure;
      }

      // Update absolute duration from global timing data
      if (globalObjective.attemptAbsoluteDuration) {
        activity.attemptAbsoluteDuration = globalObjective.attemptAbsoluteDuration;
      }

      if (globalObjective.attemptExperiencedDuration) {
        activity.attemptExperiencedDuration = globalObjective.attemptExperiencedDuration;
      }

      // Update activity-level durations
      if (globalObjective.activityAbsoluteDuration) {
        activity.activityAbsoluteDuration = globalObjective.activityAbsoluteDuration;
      }

      if (globalObjective.activityExperiencedDuration) {
        activity.activityExperiencedDuration = globalObjective.activityExperiencedDuration;
      }

      // Update location if provided by global state
      if (globalObjective.location !== undefined) {
        activity.location = globalObjective.location;
      }

      // Update suspension state based on global objective
      if (globalObjective.suspendData !== undefined) {
        activity.isSuspended = globalObjective.suspendData.length > 0;
      }
    } catch (error) {
      // Log attempt data update error
      this.eventCallback?.("attempt_data_update_error", {
        activityId: activity.id,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      });
    }
  }
}
