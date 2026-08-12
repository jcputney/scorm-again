import {
  Activity,
  ActivityObjective,
  ActivityObjectiveDirtyProperty,
  ActivityObjectiveReadState,
  ObjectiveMapInfo,
} from "../activity";
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
  rawScore: string;
  rawScoreKnown: boolean;
  minScore: string;
  minScoreKnown: boolean;
  maxScore: string;
  maxScoreKnown: boolean;
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

/** Objective-map fields written by a terminating activity, grouped by target objective. */
export interface GlobalObjectiveWriteTargets {
  satisfiedStatus: Set<string>;
  normalizedMeasure: Set<string>;
}

interface GlobalObjectiveReadOptions {
  restrictToFreshWrites: boolean;
  allowSatisfiedStatus: boolean;
  allowNormalizedMeasure: boolean;
}

/**
 * Local objective state for synchronization
 */
export interface LocalObjectiveState {
  id: string;
  satisfiedStatus: boolean;
  measureStatus: boolean;
  normalizedMeasure: number;
  rawScore: string;
  rawScoreKnown: boolean;
  minScore: string;
  minScoreKnown: boolean;
  maxScore: string;
  maxScoreKnown: boolean;
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
  ): Activity[] {
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
      const changedActivities: Activity[] = [];
      for (const act of allActivities) {
        if (this.syncGlobalObjectivesReadPhase(act, globalObjectives)) {
          changedActivities.push(act);
        }
      }

      this.eventCallback?.("global_objective_processing_completed", {
        activityId: activity.id,
        processedObjectives: globalObjectives.size,
        changedActivityCount: changedActivities.length,
      });
      return changedActivities;
    } catch (error) {
      this.eventCallback?.("global_objective_processing_error", {
        activityId: activity.id,
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
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
   *
   * @spec SCORM 2004 4th Ed. SN 3.10.3 - write mapInfo transfers local objective state to global objectives
   * @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - raw/min/max score write maps
   */
  public syncGlobalObjectivesWritePhase(
    activity: Activity,
    globalObjectives: Map<string, GlobalObjective>,
  ): void {
    // Objective maps write when an attempt terminates. An active cluster may
    // already contain intermediate rollup state, but it is not yet a source
    // for its mapped global objective.
    // @spec SCORM 2004 SN 4th Ed. SM.7 Objective Map write timing
    if (activity.isActive || !this.canWriteGlobalObjectives(activity)) {
      return;
    }

    const objectives = activity.getAllObjectives();

    for (const objective of objectives) {
      const dirtyFieldsToClear = new Set<ActivityObjectiveDirtyProperty>();

      // @spec SCORM 2004 4th Ed. SN 3.10.3: objectives without mapInfo are local
      // and must not create or overwrite global objective state.
      for (const mapInfo of objective.mapInfo) {
        const targetId = mapInfo.targetObjectiveID || objective.id;
        const globalObjective = this.ensureGlobalObjectiveEntry(
          globalObjectives,
          targetId,
          objective,
        );

        // Only do WRITE operations in this phase
        // Only write if the objective property has been modified (dirty flag set)
        if (
          mapInfo.writeSatisfiedStatus &&
          this.hasKnownSatisfiedStatus(objective) &&
          objective.isDirty("satisfiedStatus")
        ) {
          globalObjective.satisfiedStatus = objective.satisfiedStatus;
          globalObjective.satisfiedStatusKnown = true;
          dirtyFieldsToClear.add("satisfiedStatus");
        }

        if (
          mapInfo.writeNormalizedMeasure &&
          objective.measureStatus &&
          objective.isDirty("normalizedMeasure")
        ) {
          globalObjective.normalizedMeasure = objective.normalizedMeasure;
          globalObjective.normalizedMeasureKnown = true;
          dirtyFieldsToClear.add("normalizedMeasure");

          // @spec SCORM 2004 4th Ed. SN 3.10.3 Table 3.10.3a - Write Normalized Measure
          // and Write Objective Satisfied Status are independent mapInfo controls.
          // @spec SCORM 2004 4th Ed. SN 3.10 Objective Description - Objective
          // Satisfied By Measure derives satisfaction only for objectives that declare it.
          if (mapInfo.writeSatisfiedStatus && objective.satisfiedByMeasure) {
            const threshold = objective.minNormalizedMeasure ?? 1.0;
            globalObjective.satisfiedStatus = objective.normalizedMeasure >= threshold;
            globalObjective.satisfiedStatusKnown = true;
            dirtyFieldsToClear.add("satisfiedStatus");
          }
        }

        if (mapInfo.writeCompletionStatus && objective.isDirty("completionStatus")) {
          // @spec SCORM 2004 4th Ed. SN 3.10.3 Table 3.10.3a - a local
          // completion-status change is written through its map. Unknown clears
          // the global status knowledge; default unknown is not dirty and does not write.
          globalObjective.completionStatus = objective.completionStatus;
          globalObjective.completionStatusKnown =
            objective.completionStatus !== CompletionStatus.UNKNOWN;
          dirtyFieldsToClear.add("completionStatus");
        }

        // @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - Write Raw Score
        // only updates the mapped global objective when the corresponding map is true.
        if (mapInfo.writeRawScore && objective.rawScoreKnown && objective.isDirty("rawScore")) {
          globalObjective.rawScore = objective.rawScore;
          globalObjective.rawScoreKnown = true;
          dirtyFieldsToClear.add("rawScore");
        }

        // @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - Write Min Score
        // only updates the mapped global objective when the corresponding map is true.
        if (mapInfo.writeMinScore && objective.minScoreKnown && objective.isDirty("minScore")) {
          globalObjective.minScore = objective.minScore;
          globalObjective.minScoreKnown = true;
          dirtyFieldsToClear.add("minScore");
        }

        // @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - Write Max Score
        // only updates the mapped global objective when the corresponding map is true.
        if (mapInfo.writeMaxScore && objective.maxScoreKnown && objective.isDirty("maxScore")) {
          globalObjective.maxScore = objective.maxScore;
          globalObjective.maxScoreKnown = true;
          dirtyFieldsToClear.add("maxScore");
        }

        if (
          mapInfo.writeProgressMeasure &&
          objective.progressMeasureStatus &&
          objective.isDirty("progressMeasure")
        ) {
          globalObjective.progressMeasure = objective.progressMeasure;
          globalObjective.progressMeasureKnown = true;
          dirtyFieldsToClear.add("progressMeasure");
        }

        if (mapInfo.updateAttemptData) {
          this.updateActivityAttemptData(activity, globalObjective, objective);
        }
      }

      for (const property of dirtyFieldsToClear) {
        objective.clearDirty(property);
      }
    }
  }

  /**
   * Transfer the terminating activity's final local objective state to its
   * write-mapped globals. Unknown local state clears the corresponding global
   * status instead of leaving a value from the prior attempt visible.
   *
   * @spec SCORM 2004 SN 4th Ed. SM.7 Objective Map
   * @spec SCORM 2004 SN 4th Ed. TM.1.1 Objective Progress Information
   */
  public syncTerminatedActivityWritePhase(
    activity: Activity,
    globalObjectives: Map<string, GlobalObjective>,
  ): GlobalObjectiveWriteTargets {
    const writeTargets: GlobalObjectiveWriteTargets = {
      satisfiedStatus: new Set<string>(),
      normalizedMeasure: new Set<string>(),
    };

    if (!this.canWriteGlobalObjectives(activity)) {
      return writeTargets;
    }

    for (const objective of activity.getAllObjectives()) {
      for (const mapInfo of objective.mapInfo) {
        const targetId = mapInfo.targetObjectiveID || objective.id;
        const globalObjective = this.ensureGlobalObjectiveEntry(
          globalObjectives,
          targetId,
          objective,
        );

        if (mapInfo.writeSatisfiedStatus) {
          writeTargets.satisfiedStatus.add(targetId);
          if (this.hasKnownSatisfiedStatus(objective)) {
            globalObjective.satisfiedStatus = objective.satisfiedStatus;
            globalObjective.satisfiedStatusKnown = true;
          } else {
            globalObjective.satisfiedStatus = false;
            globalObjective.satisfiedStatusKnown = false;
          }
          objective.clearDirty("satisfiedStatus");
        }

        if (mapInfo.writeNormalizedMeasure) {
          writeTargets.normalizedMeasure.add(targetId);
          if (objective.measureStatus) {
            globalObjective.normalizedMeasure = objective.normalizedMeasure;
            globalObjective.normalizedMeasureKnown = true;
          } else {
            globalObjective.normalizedMeasure = 0;
            globalObjective.normalizedMeasureKnown = false;
          }
          objective.clearDirty("normalizedMeasure");
        }
      }
    }

    return writeTargets;
  }

  /**
   * Read phase: Read FROM global objectives into local state
   *
   * @param activity - The activity to process
   * @param globalObjectives - Global objective map
   *
   * @spec SCORM 2004 4th Ed. SN 3.10.3 - read mapInfo transfers global objective state into the local view
   * @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - raw/min/max score read maps
   */
  public syncGlobalObjectivesReadPhase(
    activity: Activity,
    globalObjectives: Map<string, GlobalObjective>,
  ): boolean {
    return this.syncGlobalObjectivesReadPhaseInternal(activity, globalObjectives);
  }

  /**
   * Read only objective fields freshly written by a terminating descendant.
   *
   * Active write-mapped objectives normally suppress reads so a new attempt cannot revive its
   * predecessor's state. A descendant write is different: active ancestors need that new state
   * before their own post-condition rules are evaluated.
   *
   * @spec SCORM 2004 SN 4th Ed. SM.7 Objective Map write timing
   */
  public syncFreshlyWrittenGlobalObjectivesReadPhase(
    activity: Activity,
    globalObjectives: Map<string, GlobalObjective>,
    writeTargets: GlobalObjectiveWriteTargets,
  ): boolean {
    return this.syncGlobalObjectivesReadPhaseInternal(activity, globalObjectives, writeTargets);
  }

  private syncGlobalObjectivesReadPhaseInternal(
    activity: Activity,
    globalObjectives: Map<string, GlobalObjective>,
    writeTargets?: GlobalObjectiveWriteTargets,
  ): boolean {
    const beforeStatus = activity.captureRollupStatus();
    const beforeObjectiveSatisfiedStatusKnown = activity.objectiveSatisfiedStatusKnown;
    const objectives = activity.getAllObjectives();

    for (const objective of objectives) {
      // @spec SCORM 2004 4th Ed. SN 3.10.3: only explicitly mapped objectives
      // participate in the global read phase.
      for (const mapInfo of objective.mapInfo) {
        const targetId = mapInfo.targetObjectiveID || objective.id;
        const freshlyWroteSatisfiedStatus = writeTargets?.satisfiedStatus.has(targetId) ?? false;
        const freshlyWroteNormalizedMeasure =
          writeTargets?.normalizedMeasure.has(targetId) ?? false;
        if (writeTargets && !freshlyWroteSatisfiedStatus && !freshlyWroteNormalizedMeasure) {
          continue;
        }
        const globalObjective = globalObjectives.get(targetId);

        if (!globalObjective) continue;

        const isPrimary = objective.isPrimary;

        const readState = GlobalObjectiveSynchronizer.getGlobalObjectiveReadState(
          activity,
          objective,
          mapInfo,
          globalObjective,
          writeTargets
            ? {
                restrictToFreshWrites: true,
                allowSatisfiedStatus: freshlyWroteSatisfiedStatus,
                allowNormalizedMeasure: freshlyWroteNormalizedMeasure,
              }
            : undefined,
        );
        this.applyGlobalObjectiveReadState(objective, readState);

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

    // @spec SCORM 2004 4th Ed. SN 3.10.3 and RB.1.5 - a read-mapped primary
    // objective changes the activity state that participates in ancestor rollup.
    return (
      !Activity.compareRollupStatus(beforeStatus, activity.captureRollupStatus()) ||
      beforeObjectiveSatisfiedStatusKnown !== activity.objectiveSatisfiedStatusKnown
    );
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
      // @spec SCORM 2004 4th Ed. SN 3.10.3: combined synchronization follows
      // the same explicit-map boundary as the two-pass implementation.
      for (const mapInfo of objective.mapInfo) {
        const targetId = mapInfo.targetObjectiveID || objective.id;
        const globalObjective = this.ensureGlobalObjectiveEntry(
          globalObjectives,
          targetId,
          objective,
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
   *
   * @spec SCORM 2004 4th Ed. SN 3.10.3 - objective mapInfo read/write synchronization
   * @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - score mapInfo synchronization
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

      const readState = GlobalObjectiveSynchronizer.getGlobalObjectiveReadState(
        activity,
        objective,
        mapInfo,
        globalObjective,
      );
      this.applyGlobalObjectiveReadState(objective, readState);

      if (objective.isPrimary) {
        objective.applyToActivity(activity);
      }

      if (this.canWriteGlobalObjectives(activity)) {
        // Write from local to global using THIS ACTIVITY'S mapInfo directives
        // Each activity has its own write permissions for the global objective
        if (mapInfo.writeSatisfiedStatus && this.hasKnownSatisfiedStatus(objective)) {
          globalObjective.satisfiedStatus = objective.satisfiedStatus;
          globalObjective.satisfiedStatusKnown = true;
        }

        if (mapInfo.writeNormalizedMeasure && objective.measureStatus) {
          globalObjective.normalizedMeasure = objective.normalizedMeasure;
          globalObjective.normalizedMeasureKnown = true;

          // @spec SCORM 2004 4th Ed. SN 3.10.3 Table 3.10.3a - Write Normalized Measure
          // and Write Objective Satisfied Status are independent mapInfo controls.
          // @spec SCORM 2004 4th Ed. SN 3.10 Objective Description - Objective
          // Satisfied By Measure derives satisfaction only for objectives that declare it.
          if (mapInfo.writeSatisfiedStatus && objective.satisfiedByMeasure) {
            const threshold = objective.minNormalizedMeasure ?? 1.0;
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

        // @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - Write Raw Score
        // only updates the mapped global objective when the corresponding map is true.
        if (mapInfo.writeRawScore && objective.rawScoreKnown) {
          globalObjective.rawScore = objective.rawScore;
          globalObjective.rawScoreKnown = true;
        }

        // @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - Write Min Score
        // only updates the mapped global objective when the corresponding map is true.
        if (mapInfo.writeMinScore && objective.minScoreKnown) {
          globalObjective.minScore = objective.minScore;
          globalObjective.minScoreKnown = true;
        }

        // @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - Write Max Score
        // only updates the mapped global objective when the corresponding map is true.
        if (mapInfo.writeMaxScore && objective.maxScoreKnown) {
          globalObjective.maxScore = objective.maxScore;
          globalObjective.maxScoreKnown = true;
        }

        if (mapInfo.writeProgressMeasure && objective.progressMeasureStatus) {
          globalObjective.progressMeasure = objective.progressMeasure;
          globalObjective.progressMeasureKnown = true;
        }

        if (mapInfo.updateAttemptData) {
          this.updateActivityAttemptData(activity, globalObjective, objective);
        }
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
   * Project a global objective through one local objective's read mapInfo.
   *
   * @spec SCORM 2004 4th Ed. SN 3.10.3 - read maps provide access to mapped global objective fields
   * @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - raw/min/max score read maps are independent fields
   */
  public static getGlobalObjectiveReadState(
    activity: Activity,
    objective: ActivityObjective,
    mapInfo: ObjectiveMapInfo,
    globalObjective: GlobalObjective,
    options?: GlobalObjectiveReadOptions,
  ): ActivityObjectiveReadState {
    const readState: ActivityObjectiveReadState = {};

    // A write-mapped objective in an active attempt is the source of the next
    // global value. Reading that same field back would revive the prior
    // attempt's state and overwrite the freshly initialized local attempt.
    // @spec SCORM 2004 SN 4th Ed. DB.2 and SM.7
    const suppressSatisfiedRead =
      activity.isActive && mapInfo.writeSatisfiedStatus && !options?.allowSatisfiedStatus;
    const suppressMeasureRead =
      activity.isActive && mapInfo.writeNormalizedMeasure && !options?.allowNormalizedMeasure;

    // @spec SCORM 2004 4th Ed. SN 3.10.3 Table 3.10.3a - Read Objective
    // Satisfied Status exposes the mapped global status, including unknown.
    if (
      mapInfo.readSatisfiedStatus &&
      (!options?.restrictToFreshWrites || options.allowSatisfiedStatus) &&
      !suppressSatisfiedRead &&
      !objective.satisfiedByMeasure
    ) {
      readState.satisfiedStatusKnown = globalObjective.satisfiedStatusKnown;
      if (globalObjective.satisfiedStatusKnown) {
        readState.satisfiedStatus = globalObjective.satisfiedStatus;
      }
    }

    // @spec SCORM 2004 4th Ed. SN 3.10.3 Table 3.10.3a - Read Normalized
    // Measure exposes the mapped global measure, including unknown, and does
    // not require Read Objective Satisfied Status.
    if (
      mapInfo.readNormalizedMeasure &&
      (!options?.restrictToFreshWrites || options.allowNormalizedMeasure) &&
      !suppressMeasureRead
    ) {
      readState.normalizedMeasureKnown = globalObjective.normalizedMeasureKnown;
      if (globalObjective.normalizedMeasureKnown) {
        readState.normalizedMeasure = globalObjective.normalizedMeasure;
      }

      // @spec SCORM 2004 4th Ed. SN 3.10 Objective Description - local
      // satisfiedByMeasure derives a local satisfied status from the read measure.
      if (objective.satisfiedByMeasure) {
        readState.satisfiedStatusKnown = globalObjective.normalizedMeasureKnown;
        if (globalObjective.normalizedMeasureKnown) {
          const threshold = objective.minNormalizedMeasure ?? 1.0;
          readState.satisfiedStatus = globalObjective.normalizedMeasure >= threshold;
        }
      }
    }

    // @spec SCORM 2004 4th Ed. SN 3.10.3 Table 3.10.3a - Read Completion
    // Status applies only when the mapped global completion status is known.
    if (
      !options?.restrictToFreshWrites &&
      mapInfo.readCompletionStatus &&
      globalObjective.completionStatusKnown
    ) {
      readState.completionStatus = globalObjective.completionStatus as CompletionStatus;
    }

    // @spec SCORM 2004 4th Ed. SN 3.10.3 Table 3.10.3a - Read Progress
    // Measure applies only when the mapped global progress measure is known.
    if (
      !options?.restrictToFreshWrites &&
      mapInfo.readProgressMeasure &&
      globalObjective.progressMeasureKnown
    ) {
      readState.progressMeasure = globalObjective.progressMeasure;
    }

    // @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - Read Raw Score
    // applies only when the mapped global raw score is known.
    if (!options?.restrictToFreshWrites && mapInfo.readRawScore && globalObjective.rawScoreKnown) {
      readState.rawScore = globalObjective.rawScore;
    }

    // @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - Read Min Score
    // applies only when the mapped global min score is known.
    if (!options?.restrictToFreshWrites && mapInfo.readMinScore && globalObjective.minScoreKnown) {
      readState.minScore = globalObjective.minScore;
    }

    // @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - Read Max Score
    // applies only when the mapped global max score is known.
    if (!options?.restrictToFreshWrites && mapInfo.readMaxScore && globalObjective.maxScoreKnown) {
      readState.maxScore = globalObjective.maxScore;
    }

    return readState;
  }

  /**
   * Apply read-mapped state to an objective without marking those fields dirty.
   *
   * @spec SCORM 2004 4th Ed. SN 3.10.3 - read maps are access to global state, not local writes
   * @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - score read maps do not imply score writes
   */
  private applyGlobalObjectiveReadState(
    objective: ActivityObjective,
    readState: ActivityObjectiveReadState,
  ): void {
    objective.applyReadMappedState(readState);
  }

  /**
   * Ensure global objective entry exists
   *
   * @param globalObjectives - Global objectives map
   * @param targetId - Target objective ID
   * @param objective - Source objective
   * @returns The global objective entry
   *
   * @spec SCORM 2004 4th Ed. SN 3.10.3 - global objective entries hold mapped objective state
   * @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - global entries hold score-map state
   */
  public ensureGlobalObjectiveEntry(
    globalObjectives: Map<string, GlobalObjective>,
    targetId: string,
    objective: ActivityObjective,
  ): GlobalObjective {
    if (!globalObjectives.has(targetId)) {
      // Create new entry if global objective doesn't exist
      // NOTE: The read/write flags stored here are for reference only.
      // Each activity uses its OWN mapInfo for read/write decisions in syncObjectiveState.
      globalObjectives.set(targetId, {
        id: targetId,
        satisfiedStatus: false,
        satisfiedStatusKnown: false,
        normalizedMeasure: 0,
        normalizedMeasureKnown: false,
        // @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - score fields
        // remain unknown until their corresponding write map explicitly writes them.
        rawScore: "",
        rawScoreKnown: false,
        minScore: "",
        minScoreKnown: false,
        maxScore: "",
        maxScoreKnown: false,
        progressMeasure: 0,
        progressMeasureKnown: false,
        completionStatus: CompletionStatus.UNKNOWN,
        completionStatusKnown: false,
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
   *
   * @spec SCORM 2004 4th Ed. SN 3.10.3 - mapInfo defaults are applied before objective synchronization
   * @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - score maps require explicit read/write flags
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
      readRawScore: false,
      writeRawScore: false,
      readMinScore: false,
      writeMinScore: false,
      readMaxScore: false,
      writeMaxScore: false,
      updateAttemptData: objective.isPrimary,
    };
  }

  /**
   * Return whether the local objective has known satisfaction state to write.
   *
   * @spec SCORM 2004 4th Ed. SN 4.2.1 Tracking Model - Objective Progress
   * Status identifies whether Objective Satisfied Status is known; Objective
   * Measure Status is independent measure knowledge.
   */
  private hasKnownSatisfiedStatus(objective: ActivityObjective): boolean {
    if (objective.satisfiedByMeasure) {
      // @spec SCORM 2004 4th Ed. SN 3.10 Objective Description / 3.10.3
      // Objective Map - a measure-controlled objective has a known satisfied
      // status only when its normalized measure is known. End-attempt defaults
      // must not publish satisfaction in place of a missing measure.
      return objective.measureStatus;
    }
    return objective.progressStatus || objective.satisfiedStatusKnown;
  }

  /**
   * Return whether this activity is allowed to write tracked state to globals.
   *
   * @spec SCORM 2004 4th Ed. SN 3.13.1 Tracked - when False, the LMS
   * "does not initialize, manage or access any tracking status information".
   */
  private canWriteGlobalObjectives(activity: Activity): boolean {
    return activity.sequencingControls.tracked !== false;
  }

  /**
   * Get local objective state
   *
   * @param activity - The activity
   * @param objective - The objective
   * @param isPrimary - Whether this is the primary objective
   * @returns Local objective state
   *
   * @spec SCORM 2004 4th Ed. SN 3.10 Objective Description - local objective state used for synchronization
   * @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - local score fields are part of mapped objective state
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
        rawScore: objective.rawScore,
        rawScoreKnown: objective.rawScoreKnown,
        minScore: objective.minScore,
        minScoreKnown: objective.minScoreKnown,
        maxScore: objective.maxScore,
        maxScoreKnown: objective.maxScoreKnown,
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
      rawScore: objective.rawScore,
      rawScoreKnown: objective.rawScoreKnown,
      minScore: objective.minScore,
      minScoreKnown: objective.minScoreKnown,
      maxScore: objective.maxScore,
      maxScoreKnown: objective.maxScoreKnown,
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
          !activity.sequencingControls.completionSetByContent &&
          !activity.attemptProgressStatus &&
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
      if (globalObjective.progressMeasureKnown && globalObjective.progressMeasure !== undefined) {
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
