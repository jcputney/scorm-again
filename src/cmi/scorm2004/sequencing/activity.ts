import { BaseCMI } from "../../common/base_cmi";
import { scorm2004_regex } from "../../../constants/regex";
import { check2004ValidFormat } from "../validation";
import { Scorm2004ValidationError } from "../../../exceptions/scorm2004_exceptions";
import { scorm2004_errors } from "../../../constants/error_codes";
import { CompletionStatus, SuccessStatus } from "../../../constants/enums";
import { SequencingControls } from "./sequencing_controls";

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
  private _isHiddenFromChoice: boolean = false;
  private _isAvailable: boolean = true;
  private _attemptLimit: number | null = null;
  private _timeLimitAction: string | null = null;
  private _timeLimitDuration: string | null = null;
  private _beginTimeLimit: string | null = null;
  private _endTimeLimit: string | null = null;
  private _sequencingControls: SequencingControls;

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

    // Reset children
    for (const child of this._children) {
      child.reset();
    }
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
        scorm2004_errors.TYPE_MISMATCH as number,
      );
    }
    child._parent = this;
    this._children.push(child);
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
   * Increment the attempt count
   */
  incrementAttemptCount(): void {
    this._attemptCount++;
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
    this._attemptExperiencedDuration = attemptExperiencedDuration;
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
      children: this._children.map((child) => child.toJSON()),
    };
    this.jsonString = false;
    return result;
  }
}
