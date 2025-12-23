import { Scorm2004ValidationError } from "../../../../exceptions/scorm2004_exceptions";
import { scorm2004_errors } from "../../../../constants/error_codes";
import { CompletionStatus } from "../../../../constants/enums";

export type RollupConsiderationRequirement =
  | "always"
  | "ifAttempted"
  | "ifNotSkipped"
  | "ifNotSuspended";

export interface RollupConsiderationsConfig {
  requiredForSatisfied: RollupConsiderationRequirement;
  requiredForNotSatisfied: RollupConsiderationRequirement;
  requiredForCompleted: RollupConsiderationRequirement;
  requiredForIncomplete: RollupConsiderationRequirement;
  measureSatisfactionIfActive: boolean;
}

/**
 * Snapshot of rollup status for optimization comparison
 * Used by Overall Rollup Process (RB.1.5) to detect when status stops changing
 */
export interface RollupStatusSnapshot {
  measureStatus: boolean;
  normalizedMeasure: number;
  objectiveProgressStatus: boolean;
  objectiveSatisfiedStatus: boolean;
  attemptProgressStatus: boolean;
  attemptCompletionStatus: boolean;
}

/**
 * State for all rollup-related fields
 */
export interface RollupState {
  rollupConsiderations: RollupConsiderationsConfig;
  requiredForSatisfied: RollupConsiderationRequirement;
  requiredForNotSatisfied: RollupConsiderationRequirement;
  requiredForCompleted: RollupConsiderationRequirement;
  requiredForIncomplete: RollupConsiderationRequirement;
  wasSkipped: boolean;
  attemptProgressStatus: boolean;
  wasAutoCompleted: boolean;
  wasAutoSatisfied: boolean;
  completedByMeasure: boolean;
  minProgressMeasure: number;
  progressWeight: number;
  attemptCompletionAmountStatus: boolean;
}

/**
 * Interface for activity-like object that provides values for rollup status snapshots
 */
export interface RollupActivityContext {
  objectiveMeasureStatus: boolean;
  objectiveNormalizedMeasure: number;
  objectiveSatisfiedStatusKnown: boolean;
  objectiveSatisfiedStatus: boolean;
  completionStatus: CompletionStatus;
  isCompleted: boolean;
}

/**
 * Manages rollup-related state for an Activity
 * Handles rollup considerations, progress tracking, and status snapshots
 */
export class ActivityRollupStatus {
  private _cmiElement: string;

  private _rollupConsiderations: RollupConsiderationsConfig = {
    requiredForSatisfied: "always",
    requiredForNotSatisfied: "always",
    requiredForCompleted: "always",
    requiredForIncomplete: "always",
    measureSatisfactionIfActive: true,
  };

  // Individual rollup consideration properties for this activity (RB.1.4.2)
  // These determine when THIS activity is included in parent rollup calculations
  private _requiredForSatisfied: RollupConsiderationRequirement = "always";
  private _requiredForNotSatisfied: RollupConsiderationRequirement = "always";
  private _requiredForCompleted: RollupConsiderationRequirement = "always";
  private _requiredForIncomplete: RollupConsiderationRequirement = "always";

  private _wasSkipped: boolean = false;
  private _attemptProgressStatus: boolean = false;
  private _wasAutoCompleted: boolean = false;
  private _wasAutoSatisfied: boolean = false;
  private _completedByMeasure: boolean = false;
  private _minProgressMeasure: number = 1.0;
  private _progressWeight: number = 1.0;
  private _attemptCompletionAmountStatus: boolean = false;

  constructor(cmiElement: string = "activity") {
    this._cmiElement = cmiElement;
  }

  // ============================================================================
  // Rollup Considerations
  // ============================================================================

  get rollupConsiderations(): RollupConsiderationsConfig {
    return { ...this._rollupConsiderations };
  }

  set rollupConsiderations(config: RollupConsiderationsConfig) {
    this._rollupConsiderations = { ...config };
  }

  applyRollupConsiderations(settings: Partial<RollupConsiderationsConfig>): void {
    this._rollupConsiderations = {
      ...this._rollupConsiderations,
      ...settings,
    };
  }

  // ============================================================================
  // Individual Rollup Consideration Properties
  // ============================================================================

  get requiredForSatisfied(): RollupConsiderationRequirement {
    return this._requiredForSatisfied;
  }

  set requiredForSatisfied(value: RollupConsiderationRequirement) {
    this._requiredForSatisfied = value;
  }

  get requiredForNotSatisfied(): RollupConsiderationRequirement {
    return this._requiredForNotSatisfied;
  }

  set requiredForNotSatisfied(value: RollupConsiderationRequirement) {
    this._requiredForNotSatisfied = value;
  }

  get requiredForCompleted(): RollupConsiderationRequirement {
    return this._requiredForCompleted;
  }

  set requiredForCompleted(value: RollupConsiderationRequirement) {
    this._requiredForCompleted = value;
  }

  get requiredForIncomplete(): RollupConsiderationRequirement {
    return this._requiredForIncomplete;
  }

  set requiredForIncomplete(value: RollupConsiderationRequirement) {
    this._requiredForIncomplete = value;
  }

  // ============================================================================
  // Tracking State Properties
  // ============================================================================

  get wasSkipped(): boolean {
    return this._wasSkipped;
  }

  set wasSkipped(value: boolean) {
    this._wasSkipped = value;
  }

  get attemptProgressStatus(): boolean {
    return this._attemptProgressStatus;
  }

  set attemptProgressStatus(value: boolean) {
    this._attemptProgressStatus = value;
  }

  get wasAutoCompleted(): boolean {
    return this._wasAutoCompleted;
  }

  set wasAutoCompleted(value: boolean) {
    this._wasAutoCompleted = value;
  }

  get wasAutoSatisfied(): boolean {
    return this._wasAutoSatisfied;
  }

  set wasAutoSatisfied(value: boolean) {
    this._wasAutoSatisfied = value;
  }

  get completedByMeasure(): boolean {
    return this._completedByMeasure;
  }

  set completedByMeasure(value: boolean) {
    this._completedByMeasure = value;
  }

  get minProgressMeasure(): number {
    return this._minProgressMeasure;
  }

  set minProgressMeasure(value: number) {
    if (value < 0 || value > 1) {
      throw new Scorm2004ValidationError(
        this._cmiElement + ".minProgressMeasure",
        scorm2004_errors.VALUE_OUT_OF_RANGE as number
      );
    }
    this._minProgressMeasure = value;
  }

  get progressWeight(): number {
    return this._progressWeight;
  }

  set progressWeight(value: number) {
    if (value < 0) {
      throw new Scorm2004ValidationError(
        this._cmiElement + ".progressWeight",
        scorm2004_errors.VALUE_OUT_OF_RANGE as number
      );
    }
    this._progressWeight = value;
  }

  get attemptCompletionAmountStatus(): boolean {
    return this._attemptCompletionAmountStatus;
  }

  set attemptCompletionAmountStatus(value: boolean) {
    this._attemptCompletionAmountStatus = value;
  }

  // ============================================================================
  // State Management
  // ============================================================================

  reset(): void {
    this._wasSkipped = false;
    this._attemptProgressStatus = false;
    this._wasAutoCompleted = false;
    this._wasAutoSatisfied = false;
    this._completedByMeasure = false;
    this._minProgressMeasure = 1.0;
    this._progressWeight = 1.0;
    this._attemptCompletionAmountStatus = false;
  }

  getState(): RollupState {
    return {
      rollupConsiderations: { ...this._rollupConsiderations },
      requiredForSatisfied: this._requiredForSatisfied,
      requiredForNotSatisfied: this._requiredForNotSatisfied,
      requiredForCompleted: this._requiredForCompleted,
      requiredForIncomplete: this._requiredForIncomplete,
      wasSkipped: this._wasSkipped,
      attemptProgressStatus: this._attemptProgressStatus,
      wasAutoCompleted: this._wasAutoCompleted,
      wasAutoSatisfied: this._wasAutoSatisfied,
      completedByMeasure: this._completedByMeasure,
      minProgressMeasure: this._minProgressMeasure,
      progressWeight: this._progressWeight,
      attemptCompletionAmountStatus: this._attemptCompletionAmountStatus,
    };
  }

  setState(state: Partial<RollupState>): void {
    if (state.rollupConsiderations) {
      this._rollupConsiderations = { ...state.rollupConsiderations };
    }
    if (state.requiredForSatisfied !== undefined) {
      this._requiredForSatisfied = state.requiredForSatisfied;
    }
    if (state.requiredForNotSatisfied !== undefined) {
      this._requiredForNotSatisfied = state.requiredForNotSatisfied;
    }
    if (state.requiredForCompleted !== undefined) {
      this._requiredForCompleted = state.requiredForCompleted;
    }
    if (state.requiredForIncomplete !== undefined) {
      this._requiredForIncomplete = state.requiredForIncomplete;
    }
    if (state.wasSkipped !== undefined) {
      this._wasSkipped = state.wasSkipped;
    }
    if (state.attemptProgressStatus !== undefined) {
      this._attemptProgressStatus = state.attemptProgressStatus;
    }
    if (state.wasAutoCompleted !== undefined) {
      this._wasAutoCompleted = state.wasAutoCompleted;
    }
    if (state.wasAutoSatisfied !== undefined) {
      this._wasAutoSatisfied = state.wasAutoSatisfied;
    }
    if (state.completedByMeasure !== undefined) {
      this._completedByMeasure = state.completedByMeasure;
    }
    if (state.minProgressMeasure !== undefined) {
      this._minProgressMeasure = state.minProgressMeasure;
    }
    if (state.progressWeight !== undefined) {
      this._progressWeight = state.progressWeight;
    }
    if (state.attemptCompletionAmountStatus !== undefined) {
      this._attemptCompletionAmountStatus = state.attemptCompletionAmountStatus;
    }
  }

  // ============================================================================
  // Rollup Status Capture and Compare
  // ============================================================================

  /**
   * Capture current rollup status for comparison
   * @param context - The activity context providing values
   * @returns RollupStatusSnapshot
   */
  captureRollupStatus(context: RollupActivityContext): RollupStatusSnapshot {
    return {
      measureStatus: context.objectiveMeasureStatus,
      normalizedMeasure: context.objectiveNormalizedMeasure,
      objectiveProgressStatus: context.objectiveSatisfiedStatusKnown,
      objectiveSatisfiedStatus: context.objectiveSatisfiedStatus,
      attemptProgressStatus: context.completionStatus !== CompletionStatus.UNKNOWN,
      attemptCompletionStatus: context.isCompleted,
    };
  }

  /**
   * Compare two rollup status snapshots
   * Uses epsilon comparison for floating point normalizedMeasure
   * @param prior - Previous snapshot
   * @param current - Current snapshot
   * @returns true if snapshots are equal (no change), false if different
   */
  static compareRollupStatus(
    prior: RollupStatusSnapshot,
    current: RollupStatusSnapshot
  ): boolean {
    const EPSILON = 0.0001; // Floating point comparison tolerance

    return (
      prior.measureStatus === current.measureStatus &&
      Math.abs(prior.normalizedMeasure - current.normalizedMeasure) < EPSILON &&
      prior.objectiveProgressStatus === current.objectiveProgressStatus &&
      prior.objectiveSatisfiedStatus === current.objectiveSatisfiedStatus &&
      prior.attemptProgressStatus === current.attemptProgressStatus &&
      prior.attemptCompletionStatus === current.attemptCompletionStatus
    );
  }
}
