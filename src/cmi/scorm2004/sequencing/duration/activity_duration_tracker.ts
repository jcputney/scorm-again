import { scorm2004_regex } from "../../../../constants/regex";
import { validateISO8601Duration } from "../../../../utilities";
import { Scorm2004ValidationError } from "../../../../exceptions/scorm2004_exceptions";
import { scorm2004_errors } from "../../../../constants/error_codes";

/**
 * State for all duration-related fields on an Activity
 */
export interface DurationState {
  attemptAbsoluteDuration: string;
  attemptExperiencedDuration: string;
  activityAbsoluteDuration: string;
  activityExperiencedDuration: string;
  attemptAbsoluteDurationValue: string;
  attemptExperiencedDurationValue: string;
  activityAbsoluteDurationValue: string;
  activityExperiencedDurationValue: string;
  activityStartTimestampUtc: string | null;
  attemptStartTimestampUtc: string | null;
  activityEndedDate: Date | null;
  attemptAbsoluteDurationLimit: string | null;
  activityAbsoluteDurationLimit: string | null;
}

/**
 * Manages all duration-related state for an Activity
 * Handles both duration limits and actual calculated duration values
 */
export class ActivityDurationTracker {
  private _cmiElement: string;

  // Duration limits (constraints)
  private _attemptAbsoluteDuration: string = "PT0H0M0S";
  private _attemptExperiencedDuration: string = "PT0H0M0S";
  private _activityAbsoluteDuration: string = "PT0H0M0S";
  private _activityExperiencedDuration: string = "PT0H0M0S";

  // Duration tracking fields (separate from limits) - actual calculated values
  private _attemptAbsoluteDurationValue: string = "PT0H0M0S";
  private _attemptExperiencedDurationValue: string = "PT0H0M0S";
  private _activityAbsoluteDurationValue: string = "PT0H0M0S";
  private _activityExperiencedDurationValue: string = "PT0H0M0S";

  // Timestamp tracking for duration calculation
  private _activityStartTimestampUtc: string | null = null;
  private _attemptStartTimestampUtc: string | null = null;
  private _activityEndedDate: Date | null = null;

  // Duration limit settings
  private _attemptAbsoluteDurationLimit: string | null = null;
  private _activityAbsoluteDurationLimit: string | null = null;

  /**
   * Constructor
   * @param cmiElement - The CMI element path for error messages
   */
  constructor(cmiElement: string = "activity") {
    this._cmiElement = cmiElement;
  }

  /**
   * Validate an ISO 8601 duration string
   * @throws {Scorm2004ValidationError} if duration is invalid
   */
  private validateDuration(value: string, fieldName: string): void {
    if (!validateISO8601Duration(value, scorm2004_regex.CMITimespan)) {
      throw new Scorm2004ValidationError(
        `${this._cmiElement}.${fieldName}`,
        scorm2004_errors.TYPE_MISMATCH as number
      );
    }
  }

  // ============================================================================
  // Duration Limit Getters/Setters
  // ============================================================================

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
      this.validateDuration(attemptAbsoluteDurationLimit, "attemptAbsoluteDurationLimit");
    }
    this._attemptAbsoluteDurationLimit = attemptAbsoluteDurationLimit;
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
      this.validateDuration(activityAbsoluteDurationLimit, "activityAbsoluteDurationLimit");
    }
    this._activityAbsoluteDurationLimit = activityAbsoluteDurationLimit;
  }

  // ============================================================================
  // Experienced Duration Getters/Setters (with validation)
  // ============================================================================

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
    this.validateDuration(attemptExperiencedDuration, "attemptExperiencedDuration");
    this._attemptExperiencedDuration = attemptExperiencedDuration;
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
    this.validateDuration(activityExperiencedDuration, "activityExperiencedDuration");
    this._activityExperiencedDuration = activityExperiencedDuration;
  }

  // ============================================================================
  // Absolute Duration Aliases (delegate to limits)
  // ============================================================================

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

  // ============================================================================
  // Duration Value Getters/Setters (actual calculated values, with validation)
  // ============================================================================

  /**
   * Getter for attemptAbsoluteDurationValue (actual calculated duration)
   * @return {string}
   */
  get attemptAbsoluteDurationValue(): string {
    return this._attemptAbsoluteDurationValue;
  }

  /**
   * Setter for attemptAbsoluteDurationValue
   * @param {string} duration
   */
  set attemptAbsoluteDurationValue(duration: string) {
    this.validateDuration(duration, "attemptAbsoluteDurationValue");
    this._attemptAbsoluteDurationValue = duration;
  }

  /**
   * Getter for attemptExperiencedDurationValue (actual calculated duration)
   * @return {string}
   */
  get attemptExperiencedDurationValue(): string {
    return this._attemptExperiencedDurationValue;
  }

  /**
   * Setter for attemptExperiencedDurationValue
   * @param {string} duration
   */
  set attemptExperiencedDurationValue(duration: string) {
    this.validateDuration(duration, "attemptExperiencedDurationValue");
    this._attemptExperiencedDurationValue = duration;
  }

  /**
   * Getter for activityAbsoluteDurationValue (actual calculated duration)
   * @return {string}
   */
  get activityAbsoluteDurationValue(): string {
    return this._activityAbsoluteDurationValue;
  }

  /**
   * Setter for activityAbsoluteDurationValue
   * @param {string} duration
   */
  set activityAbsoluteDurationValue(duration: string) {
    this.validateDuration(duration, "activityAbsoluteDurationValue");
    this._activityAbsoluteDurationValue = duration;
  }

  /**
   * Getter for activityExperiencedDurationValue (actual calculated duration)
   * @return {string}
   */
  get activityExperiencedDurationValue(): string {
    return this._activityExperiencedDurationValue;
  }

  /**
   * Setter for activityExperiencedDurationValue
   * @param {string} duration
   */
  set activityExperiencedDurationValue(duration: string) {
    this.validateDuration(duration, "activityExperiencedDurationValue");
    this._activityExperiencedDurationValue = duration;
  }

  // ============================================================================
  // Timestamp Getters/Setters
  // ============================================================================

  /**
   * Getter for activityStartTimestampUtc
   * @return {string | null}
   */
  get activityStartTimestampUtc(): string | null {
    return this._activityStartTimestampUtc;
  }

  /**
   * Setter for activityStartTimestampUtc
   * @param {string | null} timestamp
   */
  set activityStartTimestampUtc(timestamp: string | null) {
    this._activityStartTimestampUtc = timestamp;
  }

  /**
   * Getter for attemptStartTimestampUtc
   * @return {string | null}
   */
  get attemptStartTimestampUtc(): string | null {
    return this._attemptStartTimestampUtc;
  }

  /**
   * Setter for attemptStartTimestampUtc
   * @param {string | null} timestamp
   */
  set attemptStartTimestampUtc(timestamp: string | null) {
    this._attemptStartTimestampUtc = timestamp;
  }

  /**
   * Getter for activityEndedDate
   * @return {Date | null}
   */
  get activityEndedDate(): Date | null {
    return this._activityEndedDate;
  }

  /**
   * Setter for activityEndedDate
   * @param {Date | null} date
   */
  set activityEndedDate(date: Date | null) {
    this._activityEndedDate = date;
  }

  // ============================================================================
  // State Management Methods
  // ============================================================================

  /**
   * Reset all duration fields to their default values
   */
  reset(): void {
    this._attemptAbsoluteDuration = "PT0H0M0S";
    this._attemptExperiencedDuration = "PT0H0M0S";
    this._activityAbsoluteDuration = "PT0H0M0S";
    this._activityExperiencedDuration = "PT0H0M0S";
    this._attemptAbsoluteDurationValue = "PT0H0M0S";
    this._attemptExperiencedDurationValue = "PT0H0M0S";
    this._activityAbsoluteDurationValue = "PT0H0M0S";
    this._activityExperiencedDurationValue = "PT0H0M0S";
    this._activityStartTimestampUtc = null;
    this._attemptStartTimestampUtc = null;
    this._activityEndedDate = null;
  }

  /**
   * Get the current state of all duration fields
   * @return {DurationState}
   */
  getState(): DurationState {
    return {
      attemptAbsoluteDuration: this._attemptAbsoluteDuration,
      attemptExperiencedDuration: this._attemptExperiencedDuration,
      activityAbsoluteDuration: this._activityAbsoluteDuration,
      activityExperiencedDuration: this._activityExperiencedDuration,
      attemptAbsoluteDurationValue: this._attemptAbsoluteDurationValue,
      attemptExperiencedDurationValue: this._attemptExperiencedDurationValue,
      activityAbsoluteDurationValue: this._activityAbsoluteDurationValue,
      activityExperiencedDurationValue: this._activityExperiencedDurationValue,
      activityStartTimestampUtc: this._activityStartTimestampUtc,
      attemptStartTimestampUtc: this._attemptStartTimestampUtc,
      activityEndedDate: this._activityEndedDate,
      attemptAbsoluteDurationLimit: this._attemptAbsoluteDurationLimit,
      activityAbsoluteDurationLimit: this._activityAbsoluteDurationLimit,
    };
  }

  /**
   * Set state from a partial state object
   * @param {Partial<DurationState>} state
   */
  setState(state: Partial<DurationState>): void {
    if (state.attemptAbsoluteDuration !== undefined) {
      this._attemptAbsoluteDuration = state.attemptAbsoluteDuration;
    }
    if (state.attemptExperiencedDuration !== undefined) {
      this._attemptExperiencedDuration = state.attemptExperiencedDuration;
    }
    if (state.activityAbsoluteDuration !== undefined) {
      this._activityAbsoluteDuration = state.activityAbsoluteDuration;
    }
    if (state.activityExperiencedDuration !== undefined) {
      this._activityExperiencedDuration = state.activityExperiencedDuration;
    }
    if (state.attemptAbsoluteDurationValue !== undefined) {
      this._attemptAbsoluteDurationValue = state.attemptAbsoluteDurationValue;
    }
    if (state.attemptExperiencedDurationValue !== undefined) {
      this._attemptExperiencedDurationValue = state.attemptExperiencedDurationValue;
    }
    if (state.activityAbsoluteDurationValue !== undefined) {
      this._activityAbsoluteDurationValue = state.activityAbsoluteDurationValue;
    }
    if (state.activityExperiencedDurationValue !== undefined) {
      this._activityExperiencedDurationValue = state.activityExperiencedDurationValue;
    }
    if (state.activityStartTimestampUtc !== undefined) {
      this._activityStartTimestampUtc = state.activityStartTimestampUtc;
    }
    if (state.attemptStartTimestampUtc !== undefined) {
      this._attemptStartTimestampUtc = state.attemptStartTimestampUtc;
    }
    if (state.activityEndedDate !== undefined) {
      this._activityEndedDate = state.activityEndedDate;
    }
    if (state.attemptAbsoluteDurationLimit !== undefined) {
      this._attemptAbsoluteDurationLimit = state.attemptAbsoluteDurationLimit;
    }
    if (state.activityAbsoluteDurationLimit !== undefined) {
      this._activityAbsoluteDurationLimit = state.activityAbsoluteDurationLimit;
    }
  }
}
