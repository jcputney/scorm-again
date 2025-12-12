import { BaseCMI } from "../../common/base_cmi";
import { scorm2004_regex } from "../../../constants/regex";
import { check2004ValidFormat } from "../validation";
import { Scorm2004ValidationError } from "../../../exceptions/scorm2004_exceptions";
import { scorm2004_errors } from "../../../constants/error_codes";
import { CompletionStatus, SuccessStatus } from "../../../constants/enums";
import { SequencingControls } from "./sequencing_controls";
import { SequencingRules } from "./sequencing_rules";
import { RollupRules } from "./rollup_rules";
import { validateISO8601Duration } from "../../../utilities";
import { AuxiliaryResource, HideLmsUiItem, HIDE_LMS_UI_TOKENS } from "../../../types/sequencing_types";

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

export class ActivityObjective {
  private _id: string;
  private _description: string | null;
  private _satisfiedByMeasure: boolean;
  private _minNormalizedMeasure: number | null;
  private _mapInfo: ObjectiveMapInfo[];
  private _isPrimary: boolean;

  private _satisfiedStatus: boolean = false;
  private _measureStatus: boolean = false;
  private _normalizedMeasure: number = 0;
  private _progressMeasure: number = 0;
  private _progressMeasureStatus: boolean = false;
  private _completionStatus: CompletionStatus = CompletionStatus.UNKNOWN;
  private _progressStatus: boolean = false;

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
    this._satisfiedStatus = value;
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
    this._normalizedMeasure = value;
  }

  get progressMeasure(): number {
    return this._progressMeasure;
  }

  set progressMeasure(value: number) {
    this._progressMeasure = value;
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
    this._completionStatus = value;
  }

  get progressStatus(): boolean {
    return this._progressStatus;
  }

  set progressStatus(value: boolean) {
    this._progressStatus = value;
  }

  resetState(): void {
    this._satisfiedStatus = false;
    this._measureStatus = false;
    this._normalizedMeasure = 0;
    this._progressMeasure = 0;
    this._progressMeasureStatus = false;
    this._completionStatus = CompletionStatus.UNKNOWN;
    this._progressStatus = false;
  }

  updateFromActivity(activity: Activity): void {
    this._satisfiedStatus = activity.objectiveSatisfiedStatus;
    this._measureStatus = activity.objectiveMeasureStatus;
    this._normalizedMeasure = activity.objectiveNormalizedMeasure;
    this._progressMeasure = activity.progressMeasure;
    this._progressMeasureStatus = activity.progressMeasureStatus;
    this._completionStatus = activity.completionStatus;
  }

  applyToActivity(activity: Activity): void {
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

/**
 * Class representing a single activity in the SCORM 2004 activity tree
 */
export class Activity extends BaseCMI {
  private _id: string = "";
  private _title: string = "";
  private _children: Activity[] = [];
  private _parent: Activity | null = null;
  private _isVisible: boolean = true;
  private _isActive: boolean = false;
  private _isSuspended: boolean = false;
  private _isCompleted: boolean = false;
  private _completionStatus: CompletionStatus = CompletionStatus.UNKNOWN;
  private _successStatus: SuccessStatus = SuccessStatus.UNKNOWN;
  private _attemptCount: number = 0;
  private _attemptCompletionAmount: number = 0;
  private _attemptAbsoluteDuration: string = "PT0H0M0S";
  private _attemptExperiencedDuration: string = "PT0H0M0S";
  private _activityAbsoluteDuration: string = "PT0H0M0S";
  private _activityExperiencedDuration: string = "PT0H0M0S";
  private _objectiveSatisfiedStatus: boolean = false;
  private _objectiveMeasureStatus: boolean = false;
  private _objectiveNormalizedMeasure: number = 0;
  private _scaledPassingScore: number = 0.7; // Default passing score
  private _progressMeasure: number = 0;
  private _progressMeasureStatus: boolean = false;
  private _location: string = "";
  private _attemptAbsoluteStartTime: string = "";
  private _learnerPrefs: any = null;
  private _activityAttemptActive: boolean = false;
  private _isHiddenFromChoice: boolean = false;
  private _isAvailable: boolean = true;
  private _hideLmsUi: HideLmsUiItem[] = [];
  private _auxiliaryResources: AuxiliaryResource[] = [];
  private _attemptLimit: number | null = null;
  private _attemptAbsoluteDurationLimit: string | null = null;
  private _activityAbsoluteDurationLimit: string | null = null;
  private _timeLimitAction: string | null = null;
  private _timeLimitDuration: string | null = null;
  private _beginTimeLimit: string | null = null;
  private _endTimeLimit: string | null = null;
  private _sequencingControls: SequencingControls;
  private _sequencingRules: SequencingRules;
  private _rollupRules: RollupRules;
  private _processedChildren: Activity[] | null = null;
  private _isNewAttempt: boolean = false;
  private _primaryObjective: ActivityObjective | null = null;
  private _objectives: ActivityObjective[] = [];
  private _rollupConsiderations: RollupConsiderationsConfig = {
    requiredForSatisfied: "always",
    requiredForNotSatisfied: "always",
    requiredForCompleted: "always",
    requiredForIncomplete: "always",
    measureSatisfactionIfActive: true
  };
  private _wasSkipped: boolean = false;
  private _attemptProgressStatus: boolean = false;
  private _wasAutoCompleted: boolean = false;
  private _wasAutoSatisfied: boolean = false;

  /**
   * Constructor for Activity
   * @param {string} id - The unique identifier for this activity
   * @param {string} title - The title of this activity
   */
  constructor(id: string = "", title: string = "") {
    super("activity");
    this._id = id;
    this._title = title;
    this._sequencingControls = new SequencingControls();
    this._sequencingRules = new SequencingRules();
    this._rollupRules = new RollupRules();
    this._primaryObjective = null;
    this._objectives = [];
  }

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  override initialize() {
    super.initialize();
    // Initialize children
    for (const child of this._children) {
      child.initialize();
    }
  }

  /**
   * Called when the API needs to be reset
   */
  reset() {
    this._initialized = false;
    this._isActive = false;
    this._isSuspended = false;
    this._isCompleted = false;
    this._completionStatus = CompletionStatus.UNKNOWN;
    this._successStatus = SuccessStatus.UNKNOWN;
    this._attemptCount = 0;
    this._attemptCompletionAmount = 0;
    this._attemptAbsoluteDuration = "PT0H0M0S";
    this._attemptExperiencedDuration = "PT0H0M0S";
    this._activityAbsoluteDuration = "PT0H0M0S";
    this._activityExperiencedDuration = "PT0H0M0S";
    this._objectiveSatisfiedStatus = false;
    this._objectiveMeasureStatus = false;
    this._objectiveNormalizedMeasure = 0;
    this._progressMeasure = 0;
    this._progressMeasureStatus = false;
    this._location = "";
    this._attemptAbsoluteStartTime = "";
    this._learnerPrefs = null;
    this._activityAttemptActive = false;

    if (this._primaryObjective) {
      this._primaryObjective.resetState();
      this._primaryObjective.updateFromActivity(this);
    }

    for (const objective of this._objectives) {
      objective.resetState();
    }

    // Reset children
    for (const child of this._children) {
      child.reset();
    }

    this._wasSkipped = false;
    this._attemptProgressStatus = false;
    this._wasAutoCompleted = false;
    this._wasAutoSatisfied = false;
  }

  /**
   * Getter for id
   * @return {string}
   */
  get id(): string {
    return this._id;
  }

  /**
   * Setter for id
   * @param {string} id
   */
  set id(id: string) {
    if (check2004ValidFormat(this._cmi_element + ".id", id, scorm2004_regex.CMILongIdentifier)) {
      this._id = id;
    }
  }

  /**
   * Getter for title
   * @return {string}
   */
  get title(): string {
    return this._title;
  }

  /**
   * Setter for title
   * @param {string} title
   */
  set title(title: string) {
    if (
      check2004ValidFormat(this._cmi_element + ".title", title, scorm2004_regex.CMILangString250)
    ) {
      this._title = title;
    }
  }

  /**
   * Getter for children
   * @return {Activity[]}
   */
  get children(): Activity[] {
    return this._children;
  }

  /**
   * Add a child activity to this activity
   * @param {Activity} child - The child activity to add
   */
  addChild(child: Activity): void {
    // noinspection SuspiciousTypeOfGuard
    if (!(child instanceof Activity)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".children",
        scorm2004_errors.TYPE_MISMATCH as number
      );
    }
    child._parent = this;
    this._children.push(child);
  }

  /**
   * Reorder child activities based on provided identifier order
   * @param {string[]} order - Ordered list of child activity IDs
   */
  setChildOrder(order: string[]): void {
    if (order.length === 0) {
      return;
    }

    const childMap = new Map(this._children.map((child) => [child.id, child] as const));
    const reordered: Activity[] = [];

    for (const id of order) {
      const child = childMap.get(id);
      if (child) {
        reordered.push(child);
        childMap.delete(id);
      }
    }

    if (childMap.size > 0) {
      for (const child of this._children) {
        if (childMap.has(child.id)) {
          reordered.push(child);
          childMap.delete(child.id);
        }
      }
    }

    if (reordered.length === this._children.length) {
      this._children.splice(0, this._children.length, ...reordered);
    }
  }

  /**
   * Remove a child activity from this activity
   * @param {Activity} child - The child activity to remove
   * @return {boolean} - True if the child was removed, false otherwise
   */
  removeChild(child: Activity): boolean {
    const index = this._children.indexOf(child);
    if (index !== -1) {
      this._children.splice(index, 1);
      child._parent = null;
      return true;
    }
    return false;
  }

  /**
   * Getter for parent
   * @return {Activity | null}
   */
  get parent(): Activity | null {
    return this._parent;
  }

  /**
   * Getter for isVisible
   * @return {boolean}
   */
  get isVisible(): boolean {
    return this._isVisible;
  }

  /**
   * Setter for isVisible
   * @param {boolean} isVisible
   */
  set isVisible(isVisible: boolean) {
    this._isVisible = isVisible;
  }

  /**
   * Getter for isActive
   * @return {boolean}
   */
  get isActive(): boolean {
    return this._isActive;
  }

  /**
   * Setter for isActive
   * @param {boolean} isActive
   */
  set isActive(isActive: boolean) {
    this._isActive = isActive;
  }

  /**
   * Getter for isSuspended
   * @return {boolean}
   */
  get isSuspended(): boolean {
    return this._isSuspended;
  }

  /**
   * Setter for isSuspended
   * @param {boolean} isSuspended
   */
  set isSuspended(isSuspended: boolean) {
    this._isSuspended = isSuspended;
  }

  /**
   * Getter for isCompleted
   * @return {boolean}
   */
  get isCompleted(): boolean {
    return this._isCompleted;
  }

  /**
   * Setter for isCompleted
   * @param {boolean} isCompleted
   */
  set isCompleted(isCompleted: boolean) {
    this._isCompleted = isCompleted;
    // Update completion status based on boolean value
    if (isCompleted) {
      this._completionStatus = CompletionStatus.COMPLETED;
    } else {
      this._completionStatus = CompletionStatus.INCOMPLETE;
    }
  }

  /**
   * Getter for completionStatus
   * @return {CompletionStatus}
   */
  get completionStatus(): CompletionStatus {
    return this._completionStatus;
  }

  /**
   * Setter for completionStatus
   * @param {CompletionStatus} completionStatus
   */
  set completionStatus(completionStatus: CompletionStatus) {
    this._completionStatus = completionStatus;
    this._isCompleted = completionStatus === CompletionStatus.COMPLETED;
    this.updatePrimaryObjectiveFromActivity();
  }

  /**
   * Getter for successStatus
   * @return {SuccessStatus}
   */
  get successStatus(): SuccessStatus {
    return this._successStatus;
  }

  /**
   * Setter for successStatus
   * @param {SuccessStatus} successStatus
   */
  set successStatus(successStatus: SuccessStatus) {
    this._successStatus = successStatus;
  }

  /**
   * Getter for attemptCount
   * @return {number}
   */
  get attemptCount(): number {
    return this._attemptCount;
  }

  /**
   * Setter for attemptCount
   * @param {number} value
   */
  set attemptCount(value: number) {
    this._attemptCount = value;
  }

  /**
   * Getter for attemptCompletionAmount
   * @return {number}
   */
  get attemptCompletionAmount(): number {
    return this._attemptCompletionAmount;
  }

  /**
   * Setter for attemptCompletionAmount
   * @param {number} value
   */
  set attemptCompletionAmount(value: number) {
    this._attemptCompletionAmount = value;
  }

  /**
   * Increment the attempt count
   */
  incrementAttemptCount(): void {
    this._attemptCount++;
    this._isNewAttempt = true;
    // Reset processed children on new attempt if needed
    const controls = this._sequencingControls;
    if (
      controls.selectionTiming === "onEachNewAttempt" ||
      controls.randomizationTiming === "onEachNewAttempt"
    ) {
      this._processedChildren = null;
    }
  }

  /**
   * Getter for objectiveSatisfiedStatus
   * @return {boolean}
   */
  get objectiveSatisfiedStatus(): boolean {
    return this._objectiveSatisfiedStatus;
  }

  /**
   * Setter for objectiveSatisfiedStatus
   * @param {boolean} objectiveSatisfiedStatus
   */
  set objectiveSatisfiedStatus(objectiveSatisfiedStatus: boolean) {
    this._objectiveSatisfiedStatus = objectiveSatisfiedStatus;
    // Update success status based on objective satisfaction
    if (objectiveSatisfiedStatus) {
      this._successStatus = SuccessStatus.PASSED;
    } else {
      this._successStatus = SuccessStatus.FAILED;
    }
    this.updatePrimaryObjectiveFromActivity();
  }

  /**
   * Getter for objectiveMeasureStatus
   * @return {boolean}
   */
  get objectiveMeasureStatus(): boolean {
    return this._objectiveMeasureStatus;
  }

  /**
   * Setter for objectiveMeasureStatus
   * @param {boolean} objectiveMeasureStatus
   */
  set objectiveMeasureStatus(objectiveMeasureStatus: boolean) {
    this._objectiveMeasureStatus = objectiveMeasureStatus;
    this.updatePrimaryObjectiveFromActivity();
  }

  /**
   * Getter for objectiveNormalizedMeasure
   * @return {number}
   */
  get objectiveNormalizedMeasure(): number {
    return this._objectiveNormalizedMeasure;
  }

  /**
   * Setter for objectiveNormalizedMeasure
   * @param {number} objectiveNormalizedMeasure
   */
  set objectiveNormalizedMeasure(objectiveNormalizedMeasure: number) {
    this._objectiveNormalizedMeasure = objectiveNormalizedMeasure;
    this.updatePrimaryObjectiveFromActivity();
  }

  /**
   * Getter for scaledPassingScore
   * @return {number}
   */
  get scaledPassingScore(): number {
    return this._scaledPassingScore;
  }

  /**
   * Setter for scaledPassingScore
   * @param {number} scaledPassingScore
   */
  set scaledPassingScore(scaledPassingScore: number) {
    if (scaledPassingScore >= -1 && scaledPassingScore <= 1) {
      this._scaledPassingScore = scaledPassingScore;
    }
  }

  /**
   * Getter for progressMeasure
   * @return {number}
   */
  get progressMeasure(): number {
    return this._progressMeasure;
  }

  /**
   * Setter for progressMeasure
   * @param {number} progressMeasure
   */
  set progressMeasure(progressMeasure: number) {
    this._progressMeasure = progressMeasure;
    this.updatePrimaryObjectiveFromActivity();
  }

  /**
   * Getter for progressMeasureStatus
   * @return {boolean}
   */
  get progressMeasureStatus(): boolean {
    return this._progressMeasureStatus;
  }

  /**
   * Setter for progressMeasureStatus
   * @param {boolean} progressMeasureStatus
   */
  set progressMeasureStatus(progressMeasureStatus: boolean) {
    this._progressMeasureStatus = progressMeasureStatus;
    this.updatePrimaryObjectiveFromActivity();
  }

  /**
   * Getter for location
   * @return {string}
   */
  get location(): string {
    return this._location;
  }

  /**
   * Setter for location
   * @param {string} location
   */
  set location(location: string) {
    this._location = location;
  }

  /**
   * Getter for attemptAbsoluteStartTime
   * @return {string}
   */
  get attemptAbsoluteStartTime(): string {
    return this._attemptAbsoluteStartTime;
  }

  /**
   * Setter for attemptAbsoluteStartTime
   * @param {string} attemptAbsoluteStartTime
   */
  set attemptAbsoluteStartTime(attemptAbsoluteStartTime: string) {
    this._attemptAbsoluteStartTime = attemptAbsoluteStartTime;
  }

  /**
   * Getter for learnerPrefs
   * @return {any}
   */
  get learnerPrefs(): any {
    return this._learnerPrefs;
  }

  /**
   * Setter for learnerPrefs
   * @param {any} learnerPrefs
   */
  set learnerPrefs(learnerPrefs: any) {
    this._learnerPrefs = learnerPrefs;
  }

  /**
   * Getter for activityAttemptActive
   * @return {boolean}
   */
  get activityAttemptActive(): boolean {
    return this._activityAttemptActive;
  }

  /**
   * Setter for activityAttemptActive
   * @param {boolean} activityAttemptActive
   */
  set activityAttemptActive(activityAttemptActive: boolean) {
    this._activityAttemptActive = activityAttemptActive;
  }

  /**
   * Getter for isHiddenFromChoice
   * @return {boolean}
   */
  get isHiddenFromChoice(): boolean {
    return this._isHiddenFromChoice;
  }

  /**
   * Setter for isHiddenFromChoice
   * @param {boolean} isHiddenFromChoice
   */
  set isHiddenFromChoice(isHiddenFromChoice: boolean) {
    this._isHiddenFromChoice = isHiddenFromChoice;
  }

  /**
   * Getter for isAvailable
   * @return {boolean}
   */
  get isAvailable(): boolean {
    return this._isAvailable;
  }

  /**
   * Setter for isAvailable
   * @param {boolean} isAvailable
   */
  set isAvailable(isAvailable: boolean) {
    this._isAvailable = isAvailable;
  }

  /**
   * Getter for attemptLimit
   * @return {number | null}
   */
  get attemptLimit(): number | null {
    return this._attemptLimit;
  }

  /**
   * Setter for attemptLimit
   * @param {number | null} attemptLimit
   */
  set attemptLimit(attemptLimit: number | null) {
    this._attemptLimit = attemptLimit;
  }

  /**
   * Check if attempt limit has been exceeded
   * @return {boolean}
   */
  hasAttemptLimitExceeded(): boolean {
    if (this._attemptLimit === null) {
      return false;
    }
    return this._attemptCount >= this._attemptLimit;
  }

  /**
   * Getter for timeLimitDuration
   * @return {string | null}
   */
  get timeLimitDuration(): string | null {
    return this._timeLimitDuration;
  }

  /**
   * Setter for timeLimitDuration
   * @param {string | null} timeLimitDuration
   */
  set timeLimitDuration(timeLimitDuration: string | null) {
    this._timeLimitDuration = timeLimitDuration;
  }

  /**
   * Getter for timeLimitAction
   * @return {string | null}
   */
  get timeLimitAction(): string | null {
    return this._timeLimitAction;
  }

  /**
   * Setter for timeLimitAction
   * @param {string | null} timeLimitAction
   */
  set timeLimitAction(timeLimitAction: string | null) {
    this._timeLimitAction = timeLimitAction;
  }

  /**
   * Getter for beginTimeLimit
   * @return {string | null}
   */
  get beginTimeLimit(): string | null {
    return this._beginTimeLimit;
  }

  /**
   * Setter for beginTimeLimit
   * @param {string | null} beginTimeLimit
   */
  set beginTimeLimit(beginTimeLimit: string | null) {
    this._beginTimeLimit = beginTimeLimit;
  }

  /**
   * Getter for endTimeLimit
   * @return {string | null}
   */
  get endTimeLimit(): string | null {
    return this._endTimeLimit;
  }

  /**
   * Setter for endTimeLimit
   * @param {string | null} endTimeLimit
   */
  set endTimeLimit(endTimeLimit: string | null) {
    this._endTimeLimit = endTimeLimit;
  }


  /**
   * Getter for attemptAbsoluteDurationLimit
   * @return {string | null}
   */
  get attemptAbsoluteDurationLimit(): string | null {
    return this._attemptAbsoluteDurationLimit;
  }

  /**
   * Setter for attemptAbsoluteDurationLimit
   * @param {string | null} attemptAbsoluteDurationLimit
   */
  set attemptAbsoluteDurationLimit(attemptAbsoluteDurationLimit: string | null) {
    if (attemptAbsoluteDurationLimit !== null) {
      if (!validateISO8601Duration(attemptAbsoluteDurationLimit, scorm2004_regex.CMITimespan)) {
        throw new Scorm2004ValidationError(
          this._cmi_element + ".attemptAbsoluteDurationLimit",
          scorm2004_errors.TYPE_MISMATCH as number
        );
      }
    }
    this._attemptAbsoluteDurationLimit = attemptAbsoluteDurationLimit;
  }

  /**
   * Getter for attemptExperiencedDuration
   * @return {string}
   */
  get attemptExperiencedDuration(): string {
    return this._attemptExperiencedDuration;
  }

  /**
   * Setter for attemptExperiencedDuration
   * @param {string} attemptExperiencedDuration
   */
  set attemptExperiencedDuration(attemptExperiencedDuration: string) {
    if (!validateISO8601Duration(attemptExperiencedDuration, scorm2004_regex.CMITimespan)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".attemptExperiencedDuration",
        scorm2004_errors.TYPE_MISMATCH as number
      );
    }
    this._attemptExperiencedDuration = attemptExperiencedDuration;
  }

  /**
   * Getter for activityAbsoluteDurationLimit
   * @return {string | null}
   */
  get activityAbsoluteDurationLimit(): string | null {
    return this._activityAbsoluteDurationLimit;
  }

  /**
   * Setter for activityAbsoluteDurationLimit
   * @param {string | null} activityAbsoluteDurationLimit
   */
  set activityAbsoluteDurationLimit(activityAbsoluteDurationLimit: string | null) {
    if (activityAbsoluteDurationLimit !== null) {
      if (!validateISO8601Duration(activityAbsoluteDurationLimit, scorm2004_regex.CMITimespan)) {
        throw new Scorm2004ValidationError(
          this._cmi_element + ".activityAbsoluteDurationLimit",
          scorm2004_errors.TYPE_MISMATCH as number
        );
      }
    }
    this._activityAbsoluteDurationLimit = activityAbsoluteDurationLimit;
  }

  /**
   * Getter for activityExperiencedDuration
   * @return {string}
   */
  get activityExperiencedDuration(): string {
    return this._activityExperiencedDuration;
  }

  /**
   * Setter for activityExperiencedDuration
   * @param {string} activityExperiencedDuration
   */
  set activityExperiencedDuration(activityExperiencedDuration: string) {
    if (!validateISO8601Duration(activityExperiencedDuration, scorm2004_regex.CMITimespan)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".activityExperiencedDuration",
        scorm2004_errors.TYPE_MISMATCH as number
      );
    }
    this._activityExperiencedDuration = activityExperiencedDuration;
  }

  /**
   * Getter for attemptAbsoluteDuration (alias for limit)
   * @return {string}
   */
  get attemptAbsoluteDuration(): string {
    return this._attemptAbsoluteDurationLimit || "PT0H0M0S";
  }

  /**
   * Setter for attemptAbsoluteDuration
   * @param {string} duration
   */
  set attemptAbsoluteDuration(duration: string) {
    this._attemptAbsoluteDurationLimit = duration;
  }

  /**
   * Getter for activityAbsoluteDuration (alias for limit)
   * @return {string}
   */
  get activityAbsoluteDuration(): string {
    return this._activityAbsoluteDurationLimit || "PT0H0M0S";
  }

  /**
   * Setter for activityAbsoluteDuration
   * @param {string} duration
   */
  set activityAbsoluteDuration(duration: string) {
    this._activityAbsoluteDurationLimit = duration;
  }


  /**
   * Getter for sequencingControls
   * @return {SequencingControls}
   */
  get sequencingControls(): SequencingControls {
    return this._sequencingControls;
  }

  /**
   * Setter for sequencingControls
   * @param {SequencingControls} sequencingControls
   */
  set sequencingControls(sequencingControls: SequencingControls) {
    this._sequencingControls = sequencingControls;
  }

  /**
   * Getter for sequencingRules
   * @return {SequencingRules}
   */
  get sequencingRules(): SequencingRules {
    return this._sequencingRules;
  }

  /**
   * Setter for sequencingRules
   * @param {SequencingRules} sequencingRules
   */
  set sequencingRules(sequencingRules: SequencingRules) {
    this._sequencingRules = sequencingRules;
  }

  /**
   * Getter for rollupRules
   * @return {RollupRules}
   */
  get rollupRules(): RollupRules {
    return this._rollupRules;
  }

  /**
   * Setter for rollupRules
   * @param {RollupRules} rollupRules
   */
  set rollupRules(rollupRules: RollupRules) {
    this._rollupRules = rollupRules;
  }

  get rollupConsiderations(): RollupConsiderationsConfig {
    return { ...this._rollupConsiderations };
  }

  set rollupConsiderations(config: RollupConsiderationsConfig) {
    this._rollupConsiderations = { ...config };
  }

  applyRollupConsiderations(settings: Partial<RollupConsiderationsConfig>): void {
    this._rollupConsiderations = {
      ...this._rollupConsiderations,
      ...settings
    };
  }

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
      if (this._primaryObjective.minNormalizedMeasure !== null) {
        this._scaledPassingScore = this._primaryObjective.minNormalizedMeasure ?? this._scaledPassingScore;
      }
      this._primaryObjective.updateFromActivity(this);
    }
    this.syncPrimaryObjectiveCollection();
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
   * Get objective by ID
   * @param {string} objectiveId
   * @return {{ objective: ActivityObjective, isPrimary: boolean } | null}
   */
  getObjectiveById(objectiveId: string): {
    objective: ActivityObjective;
    isPrimary: boolean
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
    return objectives.concat(this._objectives);
  }

  private updatePrimaryObjectiveFromActivity(): void {
    if (this._primaryObjective) {
      this._primaryObjective.updateFromActivity(this);
    }
  }

  public setPrimaryObjectiveState(
    satisfiedStatus: boolean,
    measureStatus: boolean,
    normalizedMeasure: number,
    progressMeasure: number,
    progressMeasureStatus: boolean,
    completionStatus: CompletionStatus
  ): void {
    this._objectiveSatisfiedStatus = satisfiedStatus;
    this._objectiveMeasureStatus = measureStatus;
    this._objectiveNormalizedMeasure = normalizedMeasure;
    this._progressMeasure = progressMeasure;
    this._progressMeasureStatus = progressMeasureStatus;
    this._completionStatus = completionStatus;

    if (this._primaryObjective) {
      this._primaryObjective.satisfiedStatus = satisfiedStatus;
      this._primaryObjective.measureStatus = measureStatus;
      this._primaryObjective.normalizedMeasure = normalizedMeasure;
      this._primaryObjective.progressMeasure = progressMeasure;
      this._primaryObjective.progressMeasureStatus = progressMeasureStatus;
      this._primaryObjective.completionStatus = completionStatus;
    }
  }

  public getObjectiveStateSnapshot(): {
    primary: ActivityObjectiveState | null;
    objectives: ActivityObjectiveState[];
  } {
    const primarySnapshot: ActivityObjectiveState | null = this._primaryObjective
      ? {
        id: this._primaryObjective.id,
        satisfiedStatus: this.objectiveSatisfiedStatus,
        measureStatus: this.objectiveMeasureStatus,
        normalizedMeasure: this.objectiveNormalizedMeasure,
        progressMeasure: this.progressMeasure ?? 0,
        progressMeasureStatus: this.progressMeasureStatus,
        completionStatus: this.completionStatus,
        satisfiedByMeasure: this._primaryObjective.satisfiedByMeasure,
        minNormalizedMeasure: this._primaryObjective.minNormalizedMeasure
      }
      : null;

    const additionalSnapshots: ActivityObjectiveState[] = this._objectives.map((objective) => ({
      id: objective.id,
      satisfiedStatus: objective.satisfiedStatus,
      measureStatus: objective.measureStatus,
      normalizedMeasure: objective.normalizedMeasure,
      progressMeasure: objective.progressMeasure,
      progressMeasureStatus: objective.progressMeasureStatus,
      completionStatus: objective.completionStatus,
      satisfiedByMeasure: objective.satisfiedByMeasure,
      minNormalizedMeasure: objective.minNormalizedMeasure
    }));

    return {
      primary: primarySnapshot,
      objectives: additionalSnapshots
    };
  }

  public applyObjectiveStateSnapshot(snapshot: {
    primary: ActivityObjectiveState | null;
    objectives: ActivityObjectiveState[];
  }): void {
    if (snapshot.primary) {
      const primary = this.getObjectiveById(snapshot.primary.id);
      if (primary && primary.isPrimary) {
        const state = snapshot.primary;
        primary.objective.satisfiedByMeasure = state.satisfiedByMeasure ?? primary.objective.satisfiedByMeasure;
        primary.objective.minNormalizedMeasure =
          state.minNormalizedMeasure !== undefined ? state.minNormalizedMeasure : primary.objective.minNormalizedMeasure;
        this.setPrimaryObjectiveState(
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
          state.minNormalizedMeasure !== undefined ? state.minNormalizedMeasure : objective.minNormalizedMeasure;
      }
    }
  }

  /**
   * Get available children with selection and randomization applied
   * @return {Activity[]}
   */
  getAvailableChildren(): Activity[] {
    // If no children, return empty array
    if (this._children.length === 0) {
      return [];
    }

    // If processed children already exist and no new attempt, return them
    if (this._processedChildren !== null) {
      return this._processedChildren;
    }

    // If no processing has been done yet, return all children
    // The sequencing process will call applySelectionAndRandomization when needed
    return this._children;
  }

  /**
   * Set the processed children (called by SelectionRandomization)
   * @param {Activity[]} processedChildren
   */
  setProcessedChildren(processedChildren: Activity[]): void {
    this._processedChildren = processedChildren;
  }

  /**
   * Reset processed children (used when configuration changes)
   */
  resetProcessedChildren(): void {
    this._processedChildren = null;
  }

  /**
   * Get whether this is a new attempt
   * @return {boolean}
   */
  get isNewAttempt(): boolean {
    return this._isNewAttempt;
  }

  /**
   * Set whether this is a new attempt
   * @param {boolean} isNewAttempt
   */
  set isNewAttempt(isNewAttempt: boolean) {
    this._isNewAttempt = isNewAttempt;
  }

  /**
   * toJSON for Activity
   * @return {object}
   */
  toJSON(): object {
    this.jsonString = true;
    const result = {
      id: this._id,
      title: this._title,
      isVisible: this._isVisible,
      isActive: this._isActive,
      isSuspended: this._isSuspended,
      isCompleted: this._isCompleted,
      completionStatus: this._completionStatus,
      successStatus: this._successStatus,
      attemptCount: this._attemptCount,
      attemptCompletionAmount: this._attemptCompletionAmount,
      attemptAbsoluteDuration: this._attemptAbsoluteDuration,
      attemptExperiencedDuration: this._attemptExperiencedDuration,
      activityAbsoluteDuration: this._activityAbsoluteDuration,
      activityExperiencedDuration: this._activityExperiencedDuration,
      objectiveSatisfiedStatus: this._objectiveSatisfiedStatus,
      objectiveMeasureStatus: this._objectiveMeasureStatus,
      objectiveNormalizedMeasure: this._objectiveNormalizedMeasure,
      rollupConsiderations: { ...this._rollupConsiderations },
      wasSkipped: this._wasSkipped,
      hideLmsUi: [...this._hideLmsUi],
      auxiliaryResources: this._auxiliaryResources.map((resource) => ({ ...resource })),
      children: this._children.map((child) => child.toJSON())
    };
    this.jsonString = false;
    return result;
 }

  get auxiliaryResources(): AuxiliaryResource[] {
    return this._auxiliaryResources.map((resource) => ({ ...resource }));
  }

  set auxiliaryResources(resources: AuxiliaryResource[]) {
    const sanitized: AuxiliaryResource[] = [];
    const seen = new Set<string>();
    for (const resource of resources || []) {
      if (!resource) continue;
      const resourceId = typeof resource.resourceId === 'string' ? resource.resourceId.trim() : '';
      const purpose = typeof resource.purpose === 'string' ? resource.purpose.trim() : '';
      if (!resourceId || seen.has(resourceId)) {
        continue;
      }
      seen.add(resourceId);
      sanitized.push({ resourceId, purpose });
    }
    this._auxiliaryResources = sanitized;
  }

  addAuxiliaryResource(resource: AuxiliaryResource): void {
    this.auxiliaryResources = [...this._auxiliaryResources, resource];
  }

  /**
   * Capture current rollup status for optimization comparison
   * Used by Overall Rollup Process (RB.1.5) to detect when status stops changing
   * @return {RollupStatusSnapshot} - Snapshot of current rollup-relevant status
   */
  captureRollupStatus(): RollupStatusSnapshot {
    return {
      measureStatus: this._objectiveMeasureStatus,
      normalizedMeasure: this._objectiveNormalizedMeasure,
      objectiveProgressStatus: this._objectiveSatisfiedStatus !== null &&
                                this._objectiveSatisfiedStatus !== undefined,
      objectiveSatisfiedStatus: this._objectiveSatisfiedStatus,
      attemptProgressStatus: this._completionStatus !== CompletionStatus.UNKNOWN,
      attemptCompletionStatus: this._completionStatus === CompletionStatus.COMPLETED,
    };
  }

  /**
   * Compare two rollup status snapshots for equality
   * Uses epsilon comparison for floating point normalizedMeasure
   * @param {RollupStatusSnapshot} prior - Previous status snapshot
   * @param {RollupStatusSnapshot} current - Current status snapshot
   * @return {boolean} - True if statuses are equal (no change), false if different
   */
  static compareRollupStatus(
    prior: RollupStatusSnapshot,
    current: RollupStatusSnapshot
  ): boolean {
    const EPSILON = 0.0001; // Floating point comparison tolerance

    return prior.measureStatus === current.measureStatus &&
           Math.abs(prior.normalizedMeasure - current.normalizedMeasure) < EPSILON &&
           prior.objectiveProgressStatus === current.objectiveProgressStatus &&
           prior.objectiveSatisfiedStatus === current.objectiveSatisfiedStatus &&
           prior.attemptProgressStatus === current.attemptProgressStatus &&
           prior.attemptCompletionStatus === current.attemptCompletionStatus;
  }

  /**
   * Getter for hideLmsUi directives
   * @return {HideLmsUiItem[]}
   */
  get hideLmsUi(): HideLmsUiItem[] {
    return [...this._hideLmsUi];
  }

  /**
   * Setter for hideLmsUi directives
   * @param {HideLmsUiItem[]} hideLmsUi
   */
  set hideLmsUi(hideLmsUi: HideLmsUiItem[]) {
    const valid = new Set(HIDE_LMS_UI_TOKENS);
    const seen = new Set<HideLmsUiItem>();
    const sanitized: HideLmsUiItem[] = [];
    for (const directive of hideLmsUi) {
      if (valid.has(directive) && !seen.has(directive)) {
        seen.add(directive);
        sanitized.push(directive);
      }
    }
    this._hideLmsUi = sanitized;
  }
}
