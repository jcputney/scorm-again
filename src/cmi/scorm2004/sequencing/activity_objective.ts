import { CompletionStatus } from "../../../constants/enums";

export interface ObjectiveMapInfo {
  targetObjectiveID: string;
  readSatisfiedStatus?: boolean;
  readNormalizedMeasure?: boolean;
  writeSatisfiedStatus?: boolean;
  writeNormalizedMeasure?: boolean;
  readCompletionStatus?: boolean;
  writeCompletionStatus?: boolean;
  readProgressMeasure?: boolean;
  writeProgressMeasure?: boolean;
  readRawScore?: boolean;
  writeRawScore?: boolean;
  readMinScore?: boolean;
  writeMinScore?: boolean;
  readMaxScore?: boolean;
  writeMaxScore?: boolean;
  updateAttemptData?: boolean;
}

export interface ActivityObjectiveOptions {
  description?: string | null;
  satisfiedByMeasure?: boolean;
  minNormalizedMeasure?: number | null;
  mapInfo?: ObjectiveMapInfo[];
  isPrimary?: boolean;
}

export interface ActivityObjectiveState {
  id: string;
  satisfiedStatus: boolean;
  measureStatus: boolean;
  normalizedMeasure: number;
  progressMeasure: number;
  progressMeasureStatus: boolean;
  completionStatus: CompletionStatus;
  satisfiedByMeasure?: boolean;
  minNormalizedMeasure?: number | null;
  progressStatus: boolean;
}

// Forward declaration for Activity type to avoid circular dependency
// The actual Activity import is not needed since we only use it as a parameter type
export interface ActivityLike {
  objectiveSatisfiedStatus: boolean;
  objectiveSatisfiedStatusKnown: boolean;
  objectiveMeasureStatus: boolean;
  objectiveNormalizedMeasure: number;
  progressMeasure: number;
  progressMeasureStatus: boolean;
  completionStatus: CompletionStatus;
  setPrimaryObjectiveState(
    satisfiedStatus: boolean,
    measureStatus: boolean,
    normalizedMeasure: number,
    progressMeasure: number,
    progressMeasureStatus: boolean,
    completionStatus: CompletionStatus
  ): void;
}

export class ActivityObjective {
  private _id: string;
  private _description: string | null;
  private _satisfiedByMeasure: boolean;
  private _minNormalizedMeasure: number | null;
  private _mapInfo: ObjectiveMapInfo[];
  private _isPrimary: boolean;

  private _satisfiedStatus: boolean = false;
  private _satisfiedStatusKnown: boolean = false;
  // Note: measureStatus has no dirty flag because it is not synchronized to global
  // objectives. It serves as a validity gate for other synced properties.
  private _measureStatus: boolean = false;
  private _normalizedMeasure: number = 0;
  private _progressMeasure: number = 0;
  private _progressMeasureStatus: boolean = false;
  private _completionStatus: CompletionStatus = CompletionStatus.UNKNOWN;
  private _progressStatus: boolean = false;

  // Dirty flags for tracking which properties have been modified locally
  private _satisfiedStatusDirty: boolean = false;
  private _normalizedMeasureDirty: boolean = false;
  private _completionStatusDirty: boolean = false;
  private _progressMeasureDirty: boolean = false;

  constructor(id: string, options: ActivityObjectiveOptions = {}) {
    this._id = id;
    this._description = options.description ?? null;
    this._satisfiedByMeasure = options.satisfiedByMeasure ?? false;
    this._minNormalizedMeasure = options.minNormalizedMeasure ?? null;
    this._mapInfo = options.mapInfo ? [...options.mapInfo] : [];
    this._isPrimary = options.isPrimary ?? false;
  }

  get id(): string {
    return this._id;
  }

  get description(): string | null {
    return this._description;
  }

  get satisfiedByMeasure(): boolean {
    return this._satisfiedByMeasure;
  }

  set satisfiedByMeasure(value: boolean) {
    this._satisfiedByMeasure = value;
  }

  get minNormalizedMeasure(): number | null {
    return this._minNormalizedMeasure;
  }

  set minNormalizedMeasure(value: number | null) {
    this._minNormalizedMeasure = value;
  }

  get mapInfo(): ObjectiveMapInfo[] {
    return this._mapInfo;
  }

  set mapInfo(mapInfo: ObjectiveMapInfo[]) {
    this._mapInfo = [...mapInfo];
  }

  get isPrimary(): boolean {
    return this._isPrimary;
  }

  set isPrimary(value: boolean) {
    this._isPrimary = value;
  }

  get satisfiedStatus(): boolean {
    return this._satisfiedStatus;
  }

  set satisfiedStatus(value: boolean) {
    if (this._satisfiedStatus !== value) {
      this._satisfiedStatus = value;
      this._satisfiedStatusDirty = true;
    }
  }

  get satisfiedStatusKnown(): boolean {
    return this._satisfiedStatusKnown;
  }

  set satisfiedStatusKnown(value: boolean) {
    this._satisfiedStatusKnown = value;
  }

  get measureStatus(): boolean {
    return this._measureStatus;
  }

  set measureStatus(value: boolean) {
    this._measureStatus = value;
  }

  get normalizedMeasure(): number {
    return this._normalizedMeasure;
  }

  set normalizedMeasure(value: number) {
    if (this._normalizedMeasure !== value) {
      this._normalizedMeasure = value;
      this._normalizedMeasureDirty = true;
    }
  }

  get progressMeasure(): number {
    return this._progressMeasure;
  }

  set progressMeasure(value: number) {
    if (this._progressMeasure !== value) {
      this._progressMeasure = value;
      this._progressMeasureDirty = true;
    }
  }

  get progressMeasureStatus(): boolean {
    return this._progressMeasureStatus;
  }

  set progressMeasureStatus(value: boolean) {
    this._progressMeasureStatus = value;
  }

  get completionStatus(): CompletionStatus {
    return this._completionStatus;
  }

  set completionStatus(value: CompletionStatus) {
    if (this._completionStatus !== value) {
      this._completionStatus = value;
      this._completionStatusDirty = true;
    }
  }

  get progressStatus(): boolean {
    return this._progressStatus;
  }

  set progressStatus(value: boolean) {
    this._progressStatus = value;
  }

  public isDirty(property: 'satisfiedStatus' | 'normalizedMeasure' | 'completionStatus' | 'progressMeasure'): boolean {
    switch (property) {
      case 'satisfiedStatus': return this._satisfiedStatusDirty;
      case 'normalizedMeasure': return this._normalizedMeasureDirty;
      case 'completionStatus': return this._completionStatusDirty;
      case 'progressMeasure': return this._progressMeasureDirty;
    }
  }

  public clearDirty(property: 'satisfiedStatus' | 'normalizedMeasure' | 'completionStatus' | 'progressMeasure'): void {
    switch (property) {
      case 'satisfiedStatus': this._satisfiedStatusDirty = false; break;
      case 'normalizedMeasure': this._normalizedMeasureDirty = false; break;
      case 'completionStatus': this._completionStatusDirty = false; break;
      case 'progressMeasure': this._progressMeasureDirty = false; break;
    }
  }

  public clearAllDirty(): void {
    this._satisfiedStatusDirty = false;
    this._normalizedMeasureDirty = false;
    this._completionStatusDirty = false;
    this._progressMeasureDirty = false;
  }

  /**
   * Initialize objective values from CMI data transfer
   * This method always marks values as dirty since CMI data should be written to global objectives,
   * even if the values match the current defaults (e.g., satisfiedStatus = false, normalizedMeasure = 0)
   * Note: Callers must separately set satisfiedStatusKnown based on CMI data availability.
   * @param satisfiedStatus - The satisfied status from CMI
   * @param normalizedMeasure - The normalized measure from CMI
   * @param measureStatus - Whether measure is valid
   */
  public initializeFromCMI(
    satisfiedStatus: boolean,
    normalizedMeasure: number,
    measureStatus: boolean
  ): void {
    this._satisfiedStatus = satisfiedStatus;
    this._satisfiedStatusDirty = true;
    this._normalizedMeasure = normalizedMeasure;
    this._normalizedMeasureDirty = true;
    this._measureStatus = measureStatus;
  }

  resetState(): void {
    this._satisfiedStatus = false;
    this._satisfiedStatusKnown = false;
    this._measureStatus = false;
    this._normalizedMeasure = 0;
    this._progressMeasure = 0;
    this._progressMeasureStatus = false;
    this._completionStatus = CompletionStatus.UNKNOWN;
    this._progressStatus = false;
    this.clearAllDirty();
  }

  updateFromActivity(activity: ActivityLike): void {
    if (this._satisfiedStatus !== activity.objectiveSatisfiedStatus) {
      this._satisfiedStatus = activity.objectiveSatisfiedStatus;
      this._satisfiedStatusDirty = true;
    }
    this._satisfiedStatusKnown = activity.objectiveSatisfiedStatusKnown;
    this._measureStatus = activity.objectiveMeasureStatus;
    if (this._normalizedMeasure !== activity.objectiveNormalizedMeasure) {
      this._normalizedMeasure = activity.objectiveNormalizedMeasure;
      this._normalizedMeasureDirty = true;
    }
    if (this._progressMeasure !== activity.progressMeasure) {
      this._progressMeasure = activity.progressMeasure;
      this._progressMeasureDirty = true;
    }
    this._progressMeasureStatus = activity.progressMeasureStatus;
    if (this._completionStatus !== activity.completionStatus) {
      this._completionStatus = activity.completionStatus as CompletionStatus;
      this._completionStatusDirty = true;
    }
  }

  applyToActivity(activity: ActivityLike): void {
    if (!this._isPrimary) {
      return;
    }

    activity.setPrimaryObjectiveState(
      this._satisfiedStatus,
      this._measureStatus,
      this._normalizedMeasure,
      this._progressMeasure,
      this._progressMeasureStatus,
      this._completionStatus
    );
  }
}
