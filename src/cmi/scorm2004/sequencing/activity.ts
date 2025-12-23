import { BaseCMI } from "../../common/base_cmi";
import { scorm2004_regex } from "../../../constants/regex";
import { check2004ValidFormat } from "../validation";
import { Scorm2004ValidationError } from "../../../exceptions/scorm2004_exceptions";
import { scorm2004_errors } from "../../../constants/error_codes";
import { CompletionStatus, SuccessStatus } from "../../../constants/enums";
import { SequencingControls } from "./sequencing_controls";
import { SequencingRules } from "./sequencing_rules";
import { RollupRules } from "./rollup_rules";
import { AuxiliaryResource, HideLmsUiItem, HIDE_LMS_UI_TOKENS } from "../../../types/sequencing_types";
import {
  ActivityObjective,
  ActivityObjectiveState,
  ObjectiveMapInfo,
  ActivityObjectiveOptions,
} from "./activity_objective";
import { ActivityDurationTracker } from "./duration/activity_duration_tracker";
import { ActivityObjectiveManager, ObjectiveStateSnapshot } from "./objectives/activity_objective_manager";
import {
  ActivityRollupStatus,
  RollupConsiderationsConfig,
  RollupConsiderationRequirement,
  RollupStatusSnapshot,
} from "./rollup/activity_rollup_status";

// Re-export types from activity_objective for backwards compatibility
export {
  ActivityObjective,
  ActivityObjectiveState,
  ObjectiveMapInfo,
  ActivityObjectiveOptions,
} from "./activity_objective";

// Re-export types from activity_rollup_status for backwards compatibility
export {
  RollupConsiderationRequirement,
  RollupConsiderationsConfig,
  RollupStatusSnapshot,
} from "./rollup/activity_rollup_status";

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

  // Duration tracking delegated to ActivityDurationTracker
  private _durationTracker: ActivityDurationTracker;

  private _objectiveSatisfiedStatus: boolean = false;
  private _objectiveSatisfiedStatusKnown: boolean = false;
  private _objectiveMeasureStatus: boolean = false;
  private _objectiveNormalizedMeasure: number = 0;
  private _scaledPassingScore: number = 0.7; // Default passing score

  // Dirty flags for tracking which activity-level objective properties have been modified locally
  private _objectiveSatisfiedStatusDirty: boolean = false;
  private _objectiveNormalizedMeasureDirty: boolean = false;
  private _objectiveMeasureStatusDirty: boolean = false;
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
  private _timeLimitAction: string | null = null;
  private _timeLimitDuration: string | null = null;
  private _beginTimeLimit: string | null = null;
  private _endTimeLimit: string | null = null;
  private _launchData: string = "";
  private _credit: string = "credit";
  private _maxTimeAllowed: string = "";
  private _completionThreshold: string = "";
  private _sequencingControls: SequencingControls;
  private _sequencingRules: SequencingRules;
  private _rollupRules: RollupRules;
  private _processedChildren: Activity[] | null = null;
  private _isNewAttempt: boolean = false;
  // Objective management delegated to ActivityObjectiveManager
  private _objectiveManager: ActivityObjectiveManager;
  // Rollup status delegated to ActivityRollupStatus
  private _rollupStatus: ActivityRollupStatus;

  /**
   * Constructor for Activity
   * @param {string} id - The unique identifier for this activity
   * @param {string} title - The title of this activity
   */
  constructor(id: string = "", title: string = "") {
    super("activity");
    this._id = id;
    this._title = title;
    this._durationTracker = new ActivityDurationTracker("activity");
    this._objectiveManager = new ActivityObjectiveManager();
    this._objectiveManager.setOnPrimaryObjectiveSet((objective) => {
      if (objective?.minNormalizedMeasure !== null && objective?.minNormalizedMeasure !== undefined) {
        this._scaledPassingScore = objective.minNormalizedMeasure;
      }
      objective?.updateFromActivity(this);
    });
    this._rollupStatus = new ActivityRollupStatus("activity");
    this._sequencingControls = new SequencingControls();
    this._sequencingRules = new SequencingRules();
    this._rollupRules = new RollupRules();
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
    this._durationTracker.reset();
    this._objectiveSatisfiedStatus = false;
    this._objectiveSatisfiedStatusKnown = false;
    this._objectiveMeasureStatus = false;
    this._objectiveNormalizedMeasure = 0;
    this._progressMeasure = 0;
    this._progressMeasureStatus = false;
    this._location = "";
    this._attemptAbsoluteStartTime = "";
    this._learnerPrefs = null;
    this._activityAttemptActive = false;

    this._objectiveManager.reset();
    this._objectiveManager.updatePrimaryObjectiveFromActivity(this);

    // Reset children
    for (const child of this._children) {
      child.reset();
    }

    this._rollupStatus.reset();
    this.clearAllObjectiveDirty();
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
    if (this._objectiveSatisfiedStatus !== objectiveSatisfiedStatus) {
      this._objectiveSatisfiedStatus = objectiveSatisfiedStatus;
      this._objectiveSatisfiedStatusDirty = true;
    }
    this._objectiveSatisfiedStatusKnown = true;  // Mark as known when explicitly set
    // Update success status based on objective satisfaction
    if (objectiveSatisfiedStatus) {
      this._successStatus = SuccessStatus.PASSED;
    } else {
      this._successStatus = SuccessStatus.FAILED;
    }
    this.updatePrimaryObjectiveFromActivity();
  }

  /**
   * Getter for objectiveSatisfiedStatusKnown
   * Indicates whether the objective satisfied status has been explicitly set
   * @return {boolean}
   */
  get objectiveSatisfiedStatusKnown(): boolean {
    return this._objectiveSatisfiedStatusKnown;
  }

  /**
   * Setter for objectiveSatisfiedStatusKnown
   * @param {boolean} value
   */
  set objectiveSatisfiedStatusKnown(value: boolean) {
    this._objectiveSatisfiedStatusKnown = value;
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
    if (this._objectiveMeasureStatus !== objectiveMeasureStatus) {
      this._objectiveMeasureStatus = objectiveMeasureStatus;
      this._objectiveMeasureStatusDirty = true;
    }
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
    if (this._objectiveNormalizedMeasure !== objectiveNormalizedMeasure) {
      this._objectiveNormalizedMeasure = objectiveNormalizedMeasure;
      this._objectiveNormalizedMeasureDirty = true;
    }
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
    return this._durationTracker.attemptAbsoluteDurationLimit;
  }

  /**
   * Setter for attemptAbsoluteDurationLimit
   * @param {string | null} attemptAbsoluteDurationLimit
   */
  set attemptAbsoluteDurationLimit(attemptAbsoluteDurationLimit: string | null) {
    this._durationTracker.attemptAbsoluteDurationLimit = attemptAbsoluteDurationLimit;
  }

  /**
   * Getter for attemptExperiencedDuration
   * @return {string}
   */
  get attemptExperiencedDuration(): string {
    return this._durationTracker.attemptExperiencedDuration;
  }

  /**
   * Setter for attemptExperiencedDuration
   * @param {string} attemptExperiencedDuration
   */
  set attemptExperiencedDuration(attemptExperiencedDuration: string) {
    this._durationTracker.attemptExperiencedDuration = attemptExperiencedDuration;
  }

  /**
   * Getter for activityAbsoluteDurationLimit
   * @return {string | null}
   */
  get activityAbsoluteDurationLimit(): string | null {
    return this._durationTracker.activityAbsoluteDurationLimit;
  }

  /**
   * Setter for activityAbsoluteDurationLimit
   * @param {string | null} activityAbsoluteDurationLimit
   */
  set activityAbsoluteDurationLimit(activityAbsoluteDurationLimit: string | null) {
    this._durationTracker.activityAbsoluteDurationLimit = activityAbsoluteDurationLimit;
  }

  /**
   * Getter for activityExperiencedDuration
   * @return {string}
   */
  get activityExperiencedDuration(): string {
    return this._durationTracker.activityExperiencedDuration;
  }

  /**
   * Setter for activityExperiencedDuration
   * @param {string} activityExperiencedDuration
   */
  set activityExperiencedDuration(activityExperiencedDuration: string) {
    this._durationTracker.activityExperiencedDuration = activityExperiencedDuration;
  }

  /**
   * Getter for attemptAbsoluteDuration (alias for limit)
   * @return {string}
   */
  get attemptAbsoluteDuration(): string {
    return this._durationTracker.attemptAbsoluteDuration;
  }

  /**
   * Setter for attemptAbsoluteDuration
   * @param {string} duration
   */
  set attemptAbsoluteDuration(duration: string) {
    this._durationTracker.attemptAbsoluteDuration = duration;
  }

  /**
   * Getter for activityAbsoluteDuration (alias for limit)
   * @return {string}
   */
  get activityAbsoluteDuration(): string {
    return this._durationTracker.activityAbsoluteDuration;
  }

  /**
   * Setter for activityAbsoluteDuration
   * @param {string} duration
   */
  set activityAbsoluteDuration(duration: string) {
    this._durationTracker.activityAbsoluteDuration = duration;
  }

  /**
   * Getter for attemptAbsoluteDurationValue (actual calculated duration)
   * @return {string}
   */
  get attemptAbsoluteDurationValue(): string {
    return this._durationTracker.attemptAbsoluteDurationValue;
  }

  /**
   * Setter for attemptAbsoluteDurationValue
   * @param {string} duration
   */
  set attemptAbsoluteDurationValue(duration: string) {
    this._durationTracker.attemptAbsoluteDurationValue = duration;
  }

  /**
   * Getter for attemptExperiencedDurationValue (actual calculated duration)
   * @return {string}
   */
  get attemptExperiencedDurationValue(): string {
    return this._durationTracker.attemptExperiencedDurationValue;
  }

  /**
   * Setter for attemptExperiencedDurationValue
   * @param {string} duration
   */
  set attemptExperiencedDurationValue(duration: string) {
    this._durationTracker.attemptExperiencedDurationValue = duration;
  }

  /**
   * Getter for activityAbsoluteDurationValue (actual calculated duration)
   * @return {string}
   */
  get activityAbsoluteDurationValue(): string {
    return this._durationTracker.activityAbsoluteDurationValue;
  }

  /**
   * Setter for activityAbsoluteDurationValue
   * @param {string} duration
   */
  set activityAbsoluteDurationValue(duration: string) {
    this._durationTracker.activityAbsoluteDurationValue = duration;
  }

  /**
   * Getter for activityExperiencedDurationValue (actual calculated duration)
   * @return {string}
   */
  get activityExperiencedDurationValue(): string {
    return this._durationTracker.activityExperiencedDurationValue;
  }

  /**
   * Setter for activityExperiencedDurationValue
   * @param {string} duration
   */
  set activityExperiencedDurationValue(duration: string) {
    this._durationTracker.activityExperiencedDurationValue = duration;
  }

  /**
   * Getter for activityStartTimestampUtc
   * @return {string | null}
   */
  get activityStartTimestampUtc(): string | null {
    return this._durationTracker.activityStartTimestampUtc;
  }

  /**
   * Setter for activityStartTimestampUtc
   * @param {string | null} timestamp
   */
  set activityStartTimestampUtc(timestamp: string | null) {
    this._durationTracker.activityStartTimestampUtc = timestamp;
  }

  /**
   * Getter for attemptStartTimestampUtc
   * @return {string | null}
   */
  get attemptStartTimestampUtc(): string | null {
    return this._durationTracker.attemptStartTimestampUtc;
  }

  /**
   * Setter for attemptStartTimestampUtc
   * @param {string | null} timestamp
   */
  set attemptStartTimestampUtc(timestamp: string | null) {
    this._durationTracker.attemptStartTimestampUtc = timestamp;
  }

  /**
   * Getter for activityEndedDate
   * @return {Date | null}
   */
  get activityEndedDate(): Date | null {
    return this._durationTracker.activityEndedDate;
  }

  /**
   * Setter for activityEndedDate
   * @param {Date | null} date
   */
  set activityEndedDate(date: Date | null) {
    this._durationTracker.activityEndedDate = date;
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
    return this._rollupStatus.rollupConsiderations;
  }

  set rollupConsiderations(config: RollupConsiderationsConfig) {
    this._rollupStatus.rollupConsiderations = config;
  }

  applyRollupConsiderations(settings: Partial<RollupConsiderationsConfig>): void {
    this._rollupStatus.applyRollupConsiderations(settings);
  }

  /**
   * Individual rollup consideration getters/setters (RB.1.4.2)
   * These control when THIS activity is included in parent rollup
   */
  get requiredForSatisfied(): RollupConsiderationRequirement {
    return this._rollupStatus.requiredForSatisfied;
  }

  set requiredForSatisfied(value: RollupConsiderationRequirement) {
    this._rollupStatus.requiredForSatisfied = value;
  }

  get requiredForNotSatisfied(): RollupConsiderationRequirement {
    return this._rollupStatus.requiredForNotSatisfied;
  }

  set requiredForNotSatisfied(value: RollupConsiderationRequirement) {
    this._rollupStatus.requiredForNotSatisfied = value;
  }

  get requiredForCompleted(): RollupConsiderationRequirement {
    return this._rollupStatus.requiredForCompleted;
  }

  set requiredForCompleted(value: RollupConsiderationRequirement) {
    this._rollupStatus.requiredForCompleted = value;
  }

  get requiredForIncomplete(): RollupConsiderationRequirement {
    return this._rollupStatus.requiredForIncomplete;
  }

  set requiredForIncomplete(value: RollupConsiderationRequirement) {
    this._rollupStatus.requiredForIncomplete = value;
  }

  get wasSkipped(): boolean {
    return this._rollupStatus.wasSkipped;
  }

  set wasSkipped(value: boolean) {
    this._rollupStatus.wasSkipped = value;
  }

  get attemptProgressStatus(): boolean {
    return this._rollupStatus.attemptProgressStatus;
  }

  set attemptProgressStatus(value: boolean) {
    this._rollupStatus.attemptProgressStatus = value;
  }

  get wasAutoCompleted(): boolean {
    return this._rollupStatus.wasAutoCompleted;
  }

  set wasAutoCompleted(value: boolean) {
    this._rollupStatus.wasAutoCompleted = value;
  }

  get wasAutoSatisfied(): boolean {
    return this._rollupStatus.wasAutoSatisfied;
  }

  set wasAutoSatisfied(value: boolean) {
    this._rollupStatus.wasAutoSatisfied = value;
  }

  get completedByMeasure(): boolean {
    return this._rollupStatus.completedByMeasure;
  }

  set completedByMeasure(value: boolean) {
    this._rollupStatus.completedByMeasure = value;
  }

  get minProgressMeasure(): number {
    return this._rollupStatus.minProgressMeasure;
  }

  set minProgressMeasure(value: number) {
    this._rollupStatus.minProgressMeasure = value;
  }

  get progressWeight(): number {
    return this._rollupStatus.progressWeight;
  }

  set progressWeight(value: number) {
    this._rollupStatus.progressWeight = value;
  }

  get attemptCompletionAmountStatus(): boolean {
    return this._rollupStatus.attemptCompletionAmountStatus;
  }

  set attemptCompletionAmountStatus(value: boolean) {
    this._rollupStatus.attemptCompletionAmountStatus = value;
  }

  /**
   * Getter for primary objective
   * @return {ActivityObjective | null}
   */
  get primaryObjective(): ActivityObjective | null {
    return this._objectiveManager.primaryObjective;
  }

  /**
   * Setter for primary objective
   * @param {ActivityObjective | null} objective
  */
  set primaryObjective(objective: ActivityObjective | null) {
    this._objectiveManager.primaryObjective = objective;
  }

  /**
   * Get additional objectives (excludes primary objective)
   * @return {ActivityObjective[]}
   */
  get objectives(): ActivityObjective[] {
    return this._objectiveManager.objectives;
  }

  /**
   * Replace objectives collection
   * @param {ActivityObjective[]} objectives
  */
  set objectives(objectives: ActivityObjective[]) {
    this._objectiveManager.objectives = objectives;
  }

  /**
   * Add an objective
   * @param {ActivityObjective} objective
   */
  addObjective(objective: ActivityObjective): void {
    this._objectiveManager.addObjective(objective);
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
    return this._objectiveManager.getObjectiveById(objectiveId);
  }

  /**
   * Get all objectives including primary
   * @return {ActivityObjective[]}
   */
  getAllObjectives(): ActivityObjective[] {
    return this._objectiveManager.getAllObjectives();
  }

  private updatePrimaryObjectiveFromActivity(): void {
    this._objectiveManager.updatePrimaryObjectiveFromActivity(this);
  }

  public isObjectiveDirty(property: 'satisfiedStatus' | 'normalizedMeasure' | 'measureStatus'): boolean {
    switch (property) {
      case 'satisfiedStatus': return this._objectiveSatisfiedStatusDirty;
      case 'normalizedMeasure': return this._objectiveNormalizedMeasureDirty;
      case 'measureStatus': return this._objectiveMeasureStatusDirty;
    }
  }

  public clearObjectiveDirty(property: 'satisfiedStatus' | 'normalizedMeasure' | 'measureStatus'): void {
    switch (property) {
      case 'satisfiedStatus': this._objectiveSatisfiedStatusDirty = false; break;
      case 'normalizedMeasure': this._objectiveNormalizedMeasureDirty = false; break;
      case 'measureStatus': this._objectiveMeasureStatusDirty = false; break;
    }
  }

  public clearAllObjectiveDirty(): void {
    this._objectiveSatisfiedStatusDirty = false;
    this._objectiveNormalizedMeasureDirty = false;
    this._objectiveMeasureStatusDirty = false;
  }

  public setPrimaryObjectiveState(
    satisfiedStatus: boolean,
    measureStatus: boolean,
    normalizedMeasure: number,
    progressMeasure: number,
    progressMeasureStatus: boolean,
    completionStatus: CompletionStatus
  ): void {
    if (this._objectiveSatisfiedStatus !== satisfiedStatus) {
      this._objectiveSatisfiedStatus = satisfiedStatus;
      this._objectiveSatisfiedStatusDirty = true;
    }
    this._objectiveSatisfiedStatusKnown = true;  // Mark as known when state is explicitly set
    if (this._objectiveMeasureStatus !== measureStatus) {
      this._objectiveMeasureStatus = measureStatus;
      this._objectiveMeasureStatusDirty = true;
    }
    if (this._objectiveNormalizedMeasure !== normalizedMeasure) {
      this._objectiveNormalizedMeasure = normalizedMeasure;
      this._objectiveNormalizedMeasureDirty = true;
    }
    this._progressMeasure = progressMeasure;
    this._progressMeasureStatus = progressMeasureStatus;
    this._completionStatus = completionStatus;

    const primaryObj = this.primaryObjective;
    if (primaryObj) {
      primaryObj.satisfiedStatus = satisfiedStatus;
      primaryObj.measureStatus = measureStatus;
      primaryObj.normalizedMeasure = normalizedMeasure;
      primaryObj.progressMeasure = progressMeasure;
      primaryObj.progressMeasureStatus = progressMeasureStatus;
      primaryObj.completionStatus = completionStatus;
    }
  }

  public getObjectiveStateSnapshot(): ObjectiveStateSnapshot {
    return this._objectiveManager.getObjectiveStateSnapshot(this);
  }

  public applyObjectiveStateSnapshot(snapshot: ObjectiveStateSnapshot): void {
    this._objectiveManager.applyObjectiveStateSnapshot(snapshot, this);
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
   * Getter for launchData
   * @return {string}
   */
  get launchData(): string {
    return this._launchData;
  }

  /**
   * Setter for launchData
   * @param {string} launchData
   */
  set launchData(launchData: string) {
    this._launchData = launchData;
  }

  /**
   * Getter for credit
   * @return {string}
   */
  get credit(): string {
    return this._credit;
  }

  /**
   * Setter for credit
   * @param {string} credit
   */
  set credit(credit: string) {
    this._credit = credit;
  }

  /**
   * Getter for maxTimeAllowed
   * @return {string}
   */
  get maxTimeAllowed(): string {
    return this._maxTimeAllowed;
  }

  /**
   * Setter for maxTimeAllowed
   * @param {string} maxTimeAllowed
   */
  set maxTimeAllowed(maxTimeAllowed: string) {
    this._maxTimeAllowed = maxTimeAllowed;
  }

  /**
   * Getter for completionThreshold
   * @return {string}
   */
  get completionThreshold(): string {
    return this._completionThreshold;
  }

  /**
   * Setter for completionThreshold
   * @param {string} completionThreshold
   */
  set completionThreshold(completionThreshold: string) {
    this._completionThreshold = completionThreshold;
  }

  /**
   * Get suspension state for this activity and its descendants
   * Captures all state needed to restore activity tree after suspend/resume
   * @return {object} - Complete suspension state
   */
  getSuspensionState(): object {
    const durationState = this._durationTracker.getState();
    return {
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
      attemptAbsoluteDuration: durationState.attemptAbsoluteDuration,
      attemptExperiencedDuration: durationState.attemptExperiencedDuration,
      activityAbsoluteDuration: durationState.activityAbsoluteDuration,
      activityExperiencedDuration: durationState.activityExperiencedDuration,
      attemptAbsoluteDurationValue: durationState.attemptAbsoluteDurationValue,
      attemptExperiencedDurationValue: durationState.attemptExperiencedDurationValue,
      activityAbsoluteDurationValue: durationState.activityAbsoluteDurationValue,
      activityExperiencedDurationValue: durationState.activityExperiencedDurationValue,
      activityStartTimestampUtc: durationState.activityStartTimestampUtc,
      attemptStartTimestampUtc: durationState.attemptStartTimestampUtc,
      objectiveSatisfiedStatus: this._objectiveSatisfiedStatus,
      objectiveSatisfiedStatusKnown: this._objectiveSatisfiedStatusKnown,
      objectiveMeasureStatus: this._objectiveMeasureStatus,
      objectiveNormalizedMeasure: this._objectiveNormalizedMeasure,
      scaledPassingScore: this._scaledPassingScore,
      progressMeasure: this._progressMeasure,
      progressMeasureStatus: this._progressMeasureStatus,
      location: this._location,
      attemptAbsoluteStartTime: this._attemptAbsoluteStartTime,
      activityAttemptActive: this._activityAttemptActive,
      isHiddenFromChoice: this._isHiddenFromChoice,
      isAvailable: this._isAvailable,
      rollupConsiderations: this._rollupStatus.rollupConsiderations,
      wasSkipped: this._rollupStatus.wasSkipped,
      attemptProgressStatus: this._rollupStatus.attemptProgressStatus,
      wasAutoCompleted: this._rollupStatus.wasAutoCompleted,
      wasAutoSatisfied: this._rollupStatus.wasAutoSatisfied,
      completedByMeasure: this._rollupStatus.completedByMeasure,
      minProgressMeasure: this._rollupStatus.minProgressMeasure,
      progressWeight: this._rollupStatus.progressWeight,
      attemptCompletionAmountStatus: this._rollupStatus.attemptCompletionAmountStatus,
      // Selection/randomization state preservation
      processedChildren: this._processedChildren ? this._processedChildren.map(c => c.id) : null,
      isNewAttempt: this._isNewAttempt,
      selectionCountStatus: this._sequencingControls.selectionCountStatus,
      reorderChildren: this._sequencingControls.reorderChildren,
      // Objective state preservation
      primaryObjective: this.primaryObjective ? {
        id: this.primaryObjective.id,
        satisfiedStatus: this.primaryObjective.satisfiedStatus,
        measureStatus: this.primaryObjective.measureStatus,
        normalizedMeasure: this.primaryObjective.normalizedMeasure,
        progressMeasure: this.primaryObjective.progressMeasure,
        progressMeasureStatus: this.primaryObjective.progressMeasureStatus,
        completionStatus: this.primaryObjective.completionStatus,
        satisfiedByMeasure: this.primaryObjective.satisfiedByMeasure,
        minNormalizedMeasure: this.primaryObjective.minNormalizedMeasure,
        progressStatus: this.primaryObjective.progressStatus,
        mapInfo: this.primaryObjective.mapInfo
      } : null,
      objectives: this.getAllObjectives().map(obj => ({
        id: obj.id,
        satisfiedStatus: obj.satisfiedStatus,
        measureStatus: obj.measureStatus,
        normalizedMeasure: obj.normalizedMeasure,
        progressMeasure: obj.progressMeasure,
        progressMeasureStatus: obj.progressMeasureStatus,
        completionStatus: obj.completionStatus,
        satisfiedByMeasure: obj.satisfiedByMeasure,
        minNormalizedMeasure: obj.minNormalizedMeasure,
        progressStatus: obj.progressStatus,
        mapInfo: obj.mapInfo
      })),
      // Recursively save children state
      children: this._children.map(child => child.getSuspensionState())
    };
  }

  /**
   * Restore suspension state for this activity and its descendants
   * Restores all state needed to resume from suspended state
   * @param {any} state - Suspension state to restore
   */
  restoreSuspensionState(state: any): void {
    if (!state) return;

    // Restore basic activity state
    this._isVisible = state.isVisible ?? this._isVisible;
    this._isActive = state.isActive ?? this._isActive;
    this._isSuspended = state.isSuspended ?? this._isSuspended;
    this._isCompleted = state.isCompleted ?? this._isCompleted;
    this._completionStatus = state.completionStatus ?? this._completionStatus;
    this._successStatus = state.successStatus ?? this._successStatus;
    this._attemptCount = state.attemptCount ?? this._attemptCount;
    this._attemptCompletionAmount = state.attemptCompletionAmount ?? this._attemptCompletionAmount;

    // Restore duration state via tracker
    const currentDuration = this._durationTracker.getState();
    this._durationTracker.setState({
      attemptAbsoluteDuration: state.attemptAbsoluteDuration ?? currentDuration.attemptAbsoluteDuration,
      attemptExperiencedDuration: state.attemptExperiencedDuration ?? currentDuration.attemptExperiencedDuration,
      activityAbsoluteDuration: state.activityAbsoluteDuration ?? currentDuration.activityAbsoluteDuration,
      activityExperiencedDuration: state.activityExperiencedDuration ?? currentDuration.activityExperiencedDuration,
      attemptAbsoluteDurationValue: state.attemptAbsoluteDurationValue ?? currentDuration.attemptAbsoluteDurationValue,
      attemptExperiencedDurationValue: state.attemptExperiencedDurationValue ?? currentDuration.attemptExperiencedDurationValue,
      activityAbsoluteDurationValue: state.activityAbsoluteDurationValue ?? currentDuration.activityAbsoluteDurationValue,
      activityExperiencedDurationValue: state.activityExperiencedDurationValue ?? currentDuration.activityExperiencedDurationValue,
      activityStartTimestampUtc: state.activityStartTimestampUtc ?? currentDuration.activityStartTimestampUtc,
      attemptStartTimestampUtc: state.attemptStartTimestampUtc ?? currentDuration.attemptStartTimestampUtc,
    });

    // Restore tracking data
    this._objectiveSatisfiedStatus = state.objectiveSatisfiedStatus ?? this._objectiveSatisfiedStatus;
    this._objectiveSatisfiedStatusKnown = state.objectiveSatisfiedStatusKnown ?? this._objectiveSatisfiedStatusKnown;
    this._objectiveMeasureStatus = state.objectiveMeasureStatus ?? this._objectiveMeasureStatus;
    this._objectiveNormalizedMeasure = state.objectiveNormalizedMeasure ?? this._objectiveNormalizedMeasure;
    this._scaledPassingScore = state.scaledPassingScore ?? this._scaledPassingScore;
    this._progressMeasure = state.progressMeasure ?? this._progressMeasure;
    this._progressMeasureStatus = state.progressMeasureStatus ?? this._progressMeasureStatus;
    this._location = state.location ?? this._location;
    this._attemptAbsoluteStartTime = state.attemptAbsoluteStartTime ?? this._attemptAbsoluteStartTime;
    this._activityAttemptActive = state.activityAttemptActive ?? this._activityAttemptActive;
    this._isHiddenFromChoice = state.isHiddenFromChoice ?? this._isHiddenFromChoice;
    this._isAvailable = state.isAvailable ?? this._isAvailable;

    // Restore rollup state via tracker
    const currentRollupState = this._rollupStatus.getState();
    this._rollupStatus.setState({
      rollupConsiderations: state.rollupConsiderations ?? currentRollupState.rollupConsiderations,
      wasSkipped: state.wasSkipped ?? currentRollupState.wasSkipped,
      attemptProgressStatus: state.attemptProgressStatus ?? currentRollupState.attemptProgressStatus,
      wasAutoCompleted: state.wasAutoCompleted ?? currentRollupState.wasAutoCompleted,
      wasAutoSatisfied: state.wasAutoSatisfied ?? currentRollupState.wasAutoSatisfied,
      completedByMeasure: state.completedByMeasure ?? currentRollupState.completedByMeasure,
      minProgressMeasure: state.minProgressMeasure ?? currentRollupState.minProgressMeasure,
      progressWeight: state.progressWeight ?? currentRollupState.progressWeight,
      attemptCompletionAmountStatus: state.attemptCompletionAmountStatus ?? currentRollupState.attemptCompletionAmountStatus,
    });

    // Restore selection/randomization state
    this._isNewAttempt = state.isNewAttempt ?? this._isNewAttempt;
    if (state.selectionCountStatus !== undefined) {
      this._sequencingControls.selectionCountStatus = state.selectionCountStatus;
    }
    if (state.reorderChildren !== undefined) {
      this._sequencingControls.reorderChildren = state.reorderChildren;
    }

    // Restore processedChildren - map IDs back to actual children
    if (state.processedChildren) {
      const childMap = new Map(this._children.map(c => [c.id, c]));
      this._processedChildren = state.processedChildren
        .map((id: string) => childMap.get(id))
        .filter((c: Activity | undefined) => c !== undefined) as Activity[];
    } else {
      this._processedChildren = null;
    }

    // Restore objective state
    const primaryObj = this.primaryObjective;
    if (state.primaryObjective && primaryObj) {
      primaryObj.satisfiedStatus = state.primaryObjective.satisfiedStatus ?? primaryObj.satisfiedStatus;
      primaryObj.measureStatus = state.primaryObjective.measureStatus ?? primaryObj.measureStatus;
      primaryObj.normalizedMeasure = state.primaryObjective.normalizedMeasure ?? primaryObj.normalizedMeasure;
      primaryObj.progressMeasure = state.primaryObjective.progressMeasure ?? primaryObj.progressMeasure;
      primaryObj.progressMeasureStatus = state.primaryObjective.progressMeasureStatus ?? primaryObj.progressMeasureStatus;
      primaryObj.completionStatus = state.primaryObjective.completionStatus ?? primaryObj.completionStatus;
      primaryObj.progressStatus = state.primaryObjective.progressStatus ?? primaryObj.progressStatus;
    }

    if (state.objectives) {
      for (const objState of state.objectives) {
        const match = this.getObjectiveById(objState.id);
        if (match) {
          const objective = match.objective;
          objective.satisfiedStatus = objState.satisfiedStatus ?? objective.satisfiedStatus;
          objective.measureStatus = objState.measureStatus ?? objective.measureStatus;
          objective.normalizedMeasure = objState.normalizedMeasure ?? objective.normalizedMeasure;
          objective.progressMeasure = objState.progressMeasure ?? objective.progressMeasure;
          objective.progressMeasureStatus = objState.progressMeasureStatus ?? objective.progressMeasureStatus;
          objective.completionStatus = objState.completionStatus ?? objective.completionStatus;
          objective.progressStatus = objState.progressStatus ?? objective.progressStatus;
        }
      }
    }

    // Recursively restore children state
    if (state.children && Array.isArray(state.children)) {
      for (let i = 0; i < state.children.length && i < this._children.length; i++) {
        const childState = state.children[i];
        const child = this._children.find(c => c.id === childState.id);
        if (child) {
          child.restoreSuspensionState(childState);
        }
      }
    }
  }

  /**
   * toJSON for Activity
   * @return {object}
   */
  toJSON(): object {
    this.jsonString = true;
    const durationState = this._durationTracker.getState();
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
      attemptAbsoluteDuration: durationState.attemptAbsoluteDuration,
      attemptExperiencedDuration: durationState.attemptExperiencedDuration,
      activityAbsoluteDuration: durationState.activityAbsoluteDuration,
      activityExperiencedDuration: durationState.activityExperiencedDuration,
      objectiveSatisfiedStatus: this._objectiveSatisfiedStatus,
      objectiveSatisfiedStatusKnown: this._objectiveSatisfiedStatusKnown,
      objectiveMeasureStatus: this._objectiveMeasureStatus,
      objectiveNormalizedMeasure: this._objectiveNormalizedMeasure,
      rollupConsiderations: this._rollupStatus.rollupConsiderations,
      wasSkipped: this._rollupStatus.wasSkipped,
      completedByMeasure: this._rollupStatus.completedByMeasure,
      minProgressMeasure: this._rollupStatus.minProgressMeasure,
      progressWeight: this._rollupStatus.progressWeight,
      attemptCompletionAmountStatus: this._rollupStatus.attemptCompletionAmountStatus,
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
    return ActivityRollupStatus.compareRollupStatus(prior, current);
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
