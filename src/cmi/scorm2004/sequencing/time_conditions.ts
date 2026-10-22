import { Activity } from "./activity";
import { getDurationAsSeconds } from "../../../utilities";
import { scorm2004_regex } from "../../../constants/regex";

/**
 * Reports how many seconds of an activity's current attempt have elapsed,
 * as configured through the `getAttemptElapsedSeconds` sequencing option.
 */
export type AttemptElapsedSecondsHook = (activity: Activity) => number;

/**
 * Time-based condition evaluation shared by sequencing rule conditions and
 * rollup conditions, so both read the same limits the same way.
 *
 * @spec SCORM 2004 4th Ed. SN UP.2.1 (Sequencing Rule Check), RB.1.4.1
 * (Evaluate Rollup Conditions) — timeLimitExceeded, outsideAvailableTimeRange
 */

/**
 * Whether the activity's time limit has been exceeded.
 *
 * The limit is `timeLimitDuration`, falling back to
 * `attemptAbsoluteDurationLimit`. The elapsed time comes from the hook when it
 * reports a valid value, otherwise from `attemptExperiencedDuration`, otherwise
 * from `attemptAbsoluteStartTime` measured against the clock.
 *
 * @param {Activity} activity - The activity to evaluate
 * @param {() => Date} now - The clock of the evaluating process
 * @param {AttemptElapsedSecondsHook | null} [getElapsedSeconds] - Elapsed-time hook
 * @return {boolean} True when the elapsed time is strictly greater than the limit
 */
export function isTimeLimitExceeded(
  activity: Activity,
  now: () => Date,
  getElapsedSeconds?: AttemptElapsedSecondsHook | null,
): boolean {
  // Check timeLimitDuration (primary time limit)
  let limit = activity.timeLimitDuration;

  // Fallback to attemptAbsoluteDurationLimit if timeLimitDuration is not set
  if (!limit && activity.attemptAbsoluteDurationLimit) {
    limit = activity.attemptAbsoluteDurationLimit;
  }

  // No limit means condition is false
  if (!limit) {
    return false;
  }

  // Parse limit to seconds
  const limitSeconds = getDurationAsSeconds(limit, scorm2004_regex.CMITimespan);

  // Invalid or zero limit means condition is false
  if (limitSeconds <= 0) {
    return false;
  }

  let elapsedSeconds = 0;
  let hasHookValue = false;

  // Strategy 1: Use hook if available (preferred for LMS integration)
  if (getElapsedSeconds) {
    try {
      const hookResult = getElapsedSeconds(activity);
      if (typeof hookResult === "number" && !Number.isNaN(hookResult) && hookResult >= 0) {
        elapsedSeconds = hookResult;
        hasHookValue = true;
      }
    } catch {
      elapsedSeconds = 0;
    }
  }

  // Strategy 2: Try to use attemptExperiencedDuration if hook not available
  if (!hasHookValue && elapsedSeconds === 0 && activity.attemptExperiencedDuration) {
    const attemptDurationSeconds = getDurationAsSeconds(
      activity.attemptExperiencedDuration,
      scorm2004_regex.CMITimespan,
    );
    if (attemptDurationSeconds > 0) {
      elapsedSeconds = attemptDurationSeconds;
    }
  }

  // Strategy 3: Calculate from attemptAbsoluteStartTime if duration not available
  if (!hasHookValue && elapsedSeconds === 0 && activity.attemptAbsoluteStartTime) {
    try {
      const start = new Date(activity.attemptAbsoluteStartTime).getTime();
      const nowMs = now().getTime();

      // Validate timestamps before calculating
      if (!Number.isNaN(start) && !Number.isNaN(nowMs) && nowMs >= start) {
        elapsedSeconds = (nowMs - start) / 1000;
      }
    } catch {
      elapsedSeconds = 0;
    }
  }

  // Time limit is exceeded if elapsed time is strictly greater than limit
  return elapsedSeconds > limitSeconds;
}

/**
 * Whether the clock is before the activity's `beginTimeLimit` or after its
 * `endTimeLimit`.
 *
 * @param {Activity} activity - The activity to evaluate
 * @param {() => Date} clock - The clock of the evaluating process
 * @return {boolean}
 */
export function isOutsideAvailableTimeRange(activity: Activity, clock: () => Date): boolean {
  const beginTime = activity.beginTimeLimit;
  const endTime = activity.endTimeLimit;

  if (!beginTime && !endTime) {
    return false;
  }

  const now = clock();

  if (beginTime) {
    const beginDate = new Date(beginTime);
    if (now < beginDate) {
      return true;
    }
  }

  if (endTime) {
    const endDate = new Date(endTime);
    if (now > endDate) {
      return true;
    }
  }

  return false;
}
