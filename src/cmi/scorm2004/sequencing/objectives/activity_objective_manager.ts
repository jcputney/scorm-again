import {
  ActivityObjective,
  ActivityObjectiveState,
} from "../activity_objective";
import { CompletionStatus } from "../../../../constants/enums";

/**
 * Interface for the objective state snapshot
 */
export interface ObjectiveStateSnapshot {
  primary: ActivityObjectiveState | null;
  objectives: ActivityObjectiveState[];
}

/**
 * Interface for activity-like object that has objective-related properties
 * Used to break circular dependency with Activity
 */
export interface ActivityObjectiveContext {
  objectiveSatisfiedStatus: boolean;
  objectiveSatisfiedStatusKnown: boolean;
  objectiveMeasureStatus: boolean;
  objectiveNormalizedMeasure: number;
  progressMeasure: number;
  progressMeasureStatus: boolean;
  completionStatus: CompletionStatus;
  scaledPassingScore: number;
  setPrimaryObjectiveState(
    satisfiedStatus: boolean,
    measureStatus: boolean,
    normalizedMeasure: number,
    progressMeasure: number,
    progressMeasureStatus: boolean,
    completionStatus: CompletionStatus
  ): void;
}

/**
 * Manages objectives for an Activity
 * Handles primary objective, additional objectives, and objective state snapshots
 */
export class ActivityObjectiveManager {
  private _primaryObjective: ActivityObjective | null = null;
  private _objectives: ActivityObjective[] = [];

  /**
   * Callback to notify parent when primary objective is set
   * Used to update scaledPassingScore on the Activity
   */
  private _onPrimaryObjectiveSet: ((objective: ActivityObjective | null) => void) | null = null;

  constructor() {
    this._primaryObjective = null;
    this._objectives = [];
  }

  /**
   * Set callback for when primary objective is set
   */
  setOnPrimaryObjectiveSet(callback: (objective: ActivityObjective | null) => void): void {
    this._onPrimaryObjectiveSet = callback;
  }

  /**
   * Getter for primary objective
   * @return {ActivityObjective | null}
   */
  get primaryObjective(): ActivityObjective | null {
    return this._primaryObjective;
  }

  /**
   * Setter for primary objective
   * @param {ActivityObjective | null} objective
   */
  set primaryObjective(objective: ActivityObjective | null) {
    this._primaryObjective = objective;
    if (this._primaryObjective) {
      this._primaryObjective.isPrimary = true;
    }
    this.syncPrimaryObjectiveCollection();
    if (this._onPrimaryObjectiveSet) {
      this._onPrimaryObjectiveSet(objective);
    }
  }

  /**
   * Get additional objectives (excludes primary objective)
   * @return {ActivityObjective[]}
   */
  get objectives(): ActivityObjective[] {
    return this._objectives.filter((obj) => obj.id !== this._primaryObjective?.id);
  }

  /**
   * Replace objectives collection
   * @param {ActivityObjective[]} objectives
   */
  set objectives(objectives: ActivityObjective[]) {
    this._objectives = [...objectives];
    this.syncPrimaryObjectiveCollection();
  }

  /**
   * Add an objective
   * @param {ActivityObjective} objective
   */
  addObjective(objective: ActivityObjective): void {
    if (!this._objectives.find((obj) => obj.id === objective.id)) {
      this._objectives.push(objective);
    }
  }

  /**
   * Get objective by ID
   * @param {string} objectiveId
   * @return {{ objective: ActivityObjective, isPrimary: boolean } | null}
   */
  getObjectiveById(objectiveId: string): {
    objective: ActivityObjective;
    isPrimary: boolean;
  } | null {
    if (this._primaryObjective?.id === objectiveId) {
      return { objective: this._primaryObjective, isPrimary: true };
    }
    const additional = this._objectives.find((obj) => obj.id === objectiveId);
    if (additional) {
      return { objective: additional, isPrimary: false };
    }
    return null;
  }

  /**
   * Get all objectives including primary
   * @return {ActivityObjective[]}
   */
  getAllObjectives(): ActivityObjective[] {
    const objectives: ActivityObjective[] = [];
    if (this._primaryObjective) {
      objectives.push(this._primaryObjective);
    }
    // Filter out the primary objective from _objectives to avoid duplicates
    // since syncPrimaryObjectiveCollection() adds it to _objectives
    const additionalObjectives = this._objectives.filter(
      (obj) => obj !== this._primaryObjective && obj.id !== this._primaryObjective?.id
    );
    return objectives.concat(additionalObjectives);
  }

  /**
   * Ensure the primary objective is represented within the objectives collection.
   */
  private syncPrimaryObjectiveCollection(): void {
    if (!this._primaryObjective) {
      this._objectives = this._objectives.filter((objective) => !objective.isPrimary);
      return;
    }

    const existingIndex = this._objectives.findIndex(
      (objective) => objective.id === this._primaryObjective?.id
    );

    if (existingIndex >= 0) {
      this._objectives[existingIndex] = this._primaryObjective;
      return;
    }

    this._objectives = [this._primaryObjective, ...this._objectives];
  }

  /**
   * Get snapshot of all objective states
   * @param {ActivityObjectiveContext} activityContext - The activity context for primary objective values
   * @return {ObjectiveStateSnapshot}
   */
  getObjectiveStateSnapshot(activityContext: ActivityObjectiveContext): ObjectiveStateSnapshot {
    const primarySnapshot: ActivityObjectiveState | null = this._primaryObjective
      ? {
          id: this._primaryObjective.id,
          satisfiedStatus: activityContext.objectiveSatisfiedStatus,
          measureStatus: activityContext.objectiveMeasureStatus,
          normalizedMeasure: activityContext.objectiveNormalizedMeasure,
          progressMeasure: activityContext.progressMeasure ?? 0,
          progressMeasureStatus: activityContext.progressMeasureStatus,
          progressStatus: this._primaryObjective.progressStatus,
          completionStatus: activityContext.completionStatus as CompletionStatus,
          satisfiedByMeasure: this._primaryObjective.satisfiedByMeasure,
          minNormalizedMeasure: this._primaryObjective.minNormalizedMeasure,
        }
      : null;

    const additionalSnapshots: ActivityObjectiveState[] = this._objectives.map((objective) => ({
      id: objective.id,
      satisfiedStatus: objective.satisfiedStatus,
      measureStatus: objective.measureStatus,
      normalizedMeasure: objective.normalizedMeasure,
      progressMeasure: objective.progressMeasure,
      progressMeasureStatus: objective.progressMeasureStatus,
      progressStatus: objective.progressStatus,
      completionStatus: objective.completionStatus as CompletionStatus,
      satisfiedByMeasure: objective.satisfiedByMeasure,
      minNormalizedMeasure: objective.minNormalizedMeasure,
    }));

    return {
      primary: primarySnapshot,
      objectives: additionalSnapshots,
    };
  }

  /**
   * Apply objective state from a snapshot
   * @param {ObjectiveStateSnapshot} snapshot - The snapshot to apply
   * @param {ActivityObjectiveContext} activityContext - The activity context to update
   */
  applyObjectiveStateSnapshot(
    snapshot: ObjectiveStateSnapshot,
    activityContext: ActivityObjectiveContext
  ): void {
    if (snapshot.primary) {
      const primary = this.getObjectiveById(snapshot.primary.id);
      if (primary && primary.isPrimary) {
        const state = snapshot.primary;
        primary.objective.satisfiedByMeasure =
          state.satisfiedByMeasure ?? primary.objective.satisfiedByMeasure;
        primary.objective.minNormalizedMeasure =
          state.minNormalizedMeasure !== undefined
            ? state.minNormalizedMeasure
            : primary.objective.minNormalizedMeasure;
        activityContext.setPrimaryObjectiveState(
          state.satisfiedStatus,
          state.measureStatus,
          state.normalizedMeasure,
          state.progressMeasure,
          state.progressMeasureStatus,
          state.completionStatus
        );
      }
    }

    for (const state of snapshot.objectives) {
      const match = this.getObjectiveById(state.id);
      if (match && !match.isPrimary) {
        const objective = match.objective;
        objective.satisfiedStatus = state.satisfiedStatus;
        objective.measureStatus = state.measureStatus;
        objective.normalizedMeasure = state.normalizedMeasure;
        objective.progressMeasure = state.progressMeasure;
        objective.progressMeasureStatus = state.progressMeasureStatus;
        objective.completionStatus = state.completionStatus;
        objective.satisfiedByMeasure = state.satisfiedByMeasure ?? objective.satisfiedByMeasure;
        objective.minNormalizedMeasure =
          state.minNormalizedMeasure !== undefined
            ? state.minNormalizedMeasure
            : objective.minNormalizedMeasure;
      }
    }
  }

  /**
   * Reset all objectives
   */
  reset(): void {
    if (this._primaryObjective) {
      this._primaryObjective.resetState();
    }
    for (const objective of this._objectives) {
      objective.resetState();
    }
  }

  /**
   * Update primary objective from activity state
   * @param {ActivityObjectiveContext} activityContext
   */
  updatePrimaryObjectiveFromActivity(activityContext: ActivityObjectiveContext): void {
    if (this._primaryObjective) {
      this._primaryObjective.updateFromActivity(activityContext);
    }
  }
}
