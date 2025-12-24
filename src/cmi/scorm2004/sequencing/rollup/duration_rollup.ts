import { Activity } from "../activity";
import { scorm2004_regex } from "../../../../constants/regex";
import { getDurationAsSeconds, getSecondsAsISODuration } from "../../../../utilities";

/**
 * Event callback function type
 */
export type EventCallback = (eventType: string, data?: unknown) => void;

/**
 * DurationRollupProcessor - Handles duration rollup operations
 * Implements SCORM 2004 RB.1.4 (Duration Rollup Process)
 *
 * This class is responsible for aggregating duration information from
 * child activities to parent clusters, including both absolute (wall clock)
 * and experienced (actual learning time) durations.
 *
 * @spec SN Book: RB.1.4 (Duration Rollup Process)
 * @spec Reference: Overall Rollup Process [RB.1.5] - duration rollup happens before optimization check
 */
export class DurationRollupProcessor {
  private eventCallback: EventCallback | null;

  /**
   * Create a new DurationRollupProcessor
   *
   * @param eventCallback - Optional callback for firing events
   */
  constructor(eventCallback?: EventCallback) {
    this.eventCallback = eventCallback || null;
  }

  /**
   * Duration Rollup Process
   * Aggregates duration information from child activities to parent cluster
   * Called ALWAYS for cluster activities, even when other rollup is skipped due to optimization
   *
   * @spec SN Book: RB.1.4 (Duration Rollup Process)
   * @spec Reference: Overall Rollup Process [RB.1.5] - duration rollup happens before optimization check
   * @param activity - The parent cluster activity
   */
  public durationRollupProcess(activity: Activity): void {
    // Only process cluster activities (non-leaf)
    if (activity.children.length === 0) {
      return;
    }

    const children = activity.getAvailableChildren();

    // No children available, nothing to rollup
    if (children.length === 0) {
      return;
    }

    let earliestChildActivityStartTimestampUtc: string | null = null;
    let earliestChildAttemptStartTimestampUtc: string | null = null;
    let latestChildEndDate: Date | null = null;
    let latestAttemptChildEndDate: Date | null = null;

    // Aggregate experienced durations (in seconds for easier math)
    let childrenActivityExperiencedDurationSeconds = 0;
    let childrenAttemptExperiencedDurationSeconds = 0;

    // Process each child
    for (const child of children) {
      // Track earliest activity start timestamp
      if (child.activityStartTimestampUtc) {
        if (
          !earliestChildActivityStartTimestampUtc ||
          child.activityStartTimestampUtc < earliestChildActivityStartTimestampUtc
        ) {
          earliestChildActivityStartTimestampUtc = child.activityStartTimestampUtc;
        }
      }

      // Track latest activity end date
      if (child.activityEndedDate) {
        if (!latestChildEndDate || child.activityEndedDate > latestChildEndDate) {
          latestChildEndDate = child.activityEndedDate;
        }
      }

      // Aggregate activity experienced duration
      // Use Value field if available (for cluster activities), otherwise use regular field (for leaf activities)
      const activityDuration =
        child.activityExperiencedDurationValue !== "PT0H0M0S"
          ? child.activityExperiencedDurationValue
          : child.activityExperiencedDuration;

      if (activityDuration && activityDuration !== "PT0H0M0S") {
        childrenActivityExperiencedDurationSeconds += getDurationAsSeconds(
          activityDuration,
          scorm2004_regex.CMITimespan,
        );
      }

      // Check if child is in same attempt as parent
      // (child attempt started after or at same time as parent attempt start)
      const isChildInSameAttempt =
        !activity.attemptStartTimestampUtc ||
        (child.attemptStartTimestampUtc &&
          child.attemptStartTimestampUtc >= activity.attemptStartTimestampUtc);

      if (isChildInSameAttempt) {
        // Track earliest attempt start timestamp
        if (child.attemptStartTimestampUtc) {
          if (
            !earliestChildAttemptStartTimestampUtc ||
            child.attemptStartTimestampUtc < earliestChildAttemptStartTimestampUtc
          ) {
            earliestChildAttemptStartTimestampUtc = child.attemptStartTimestampUtc;
          }
        }

        // Track latest attempt end date
        if (child.activityEndedDate) {
          if (!latestAttemptChildEndDate || child.activityEndedDate > latestAttemptChildEndDate) {
            latestAttemptChildEndDate = child.activityEndedDate;
          }
        }

        // Aggregate attempt experienced duration
        // Use Value field if available (for cluster activities), otherwise use regular field (for leaf activities)
        const attemptDuration =
          child.attemptExperiencedDurationValue !== "PT0H0M0S"
            ? child.attemptExperiencedDurationValue
            : child.attemptExperiencedDuration;

        if (attemptDuration && attemptDuration !== "PT0H0M0S") {
          childrenAttemptExperiencedDurationSeconds += getDurationAsSeconds(
            attemptDuration,
            scorm2004_regex.CMITimespan,
          );
        }
      }
    }

    // Update parent activity timestamps and durations if we found any child data
    if (earliestChildActivityStartTimestampUtc !== null) {
      // Set earliest start timestamps
      activity.activityStartTimestampUtc = earliestChildActivityStartTimestampUtc;

      if (!activity.attemptStartTimestampUtc && earliestChildAttemptStartTimestampUtc) {
        activity.attemptStartTimestampUtc = earliestChildAttemptStartTimestampUtc;
      }

      // Set latest end date
      activity.activityEndedDate = latestChildEndDate;

      // Calculate absolute durations (wall clock time)
      if (latestChildEndDate && activity.activityStartTimestampUtc) {
        const startDate = new Date(activity.activityStartTimestampUtc);
        const durationMs = latestChildEndDate.getTime() - startDate.getTime();
        const durationSeconds = Math.max(0, durationMs / 1000);
        activity.activityAbsoluteDurationValue = getSecondsAsISODuration(durationSeconds);
      }

      if (latestAttemptChildEndDate && activity.attemptStartTimestampUtc) {
        const startDate = new Date(activity.attemptStartTimestampUtc);
        const durationMs = latestAttemptChildEndDate.getTime() - startDate.getTime();
        const durationSeconds = Math.max(0, durationMs / 1000);
        activity.attemptAbsoluteDurationValue = getSecondsAsISODuration(durationSeconds);
      }

      // Set aggregated experienced durations
      activity.activityExperiencedDurationValue = getSecondsAsISODuration(
        childrenActivityExperiencedDurationSeconds,
      );
      activity.attemptExperiencedDurationValue = getSecondsAsISODuration(
        childrenAttemptExperiencedDurationSeconds,
      );

      // Fire event for monitoring
      this.eventCallback?.("duration_rollup_completed", {
        activityId: activity.id,
        activityAbsoluteDuration: activity.activityAbsoluteDurationValue,
        attemptAbsoluteDuration: activity.attemptAbsoluteDurationValue,
        activityExperiencedDuration: activity.activityExperiencedDurationValue,
        attemptExperiencedDuration: activity.attemptExperiencedDurationValue,
        childCount: children.length,
      });
    }
  }
}
