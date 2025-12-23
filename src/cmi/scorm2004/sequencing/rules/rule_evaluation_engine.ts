import { Activity } from "../activity";
import {
  SequencingRule,
  RuleActionType,
  RuleConditionOperator
} from "../sequencing_rules";
import { SequencingRequestType } from "./sequencing_request_types";
import { getDurationAsSeconds } from "../../../../utilities";
import { scorm2004_regex } from "../../../../constants/regex";

// Re-export for convenience
export { SequencingRequestType };

/**
 * Result of post-condition rule evaluation
 */
export interface PostConditionResult {
  sequencingRequest: SequencingRequestType | null;
  terminationRequest: SequencingRequestType | null;
}

/**
 * Options for RuleEvaluationEngine
 */
export interface RuleEvaluationOptions {
  now?: () => Date;
  getAttemptElapsedSecondsHook?: (activity: Activity) => number;
}

/**
 * RuleEvaluationEngine - Centralized rule evaluation for SCORM 2004 sequencing
 *
 * This class extracts and consolidates all rule evaluation logic from SequencingProcess:
 * - Pre-condition rule evaluation (UP.2)
 * - Exit condition rule evaluation (TB.2.1)
 * - Post-condition rule evaluation (TB.2.2)
 * - Limit conditions checking (UP.1)
 * - Individual condition evaluation
 *
 * Key SCORM 2004 processes implemented:
 * - UP.1: Limit Conditions Check Process
 * - UP.2: Sequencing Rules Check Process
 * - UP.2.1: Sequencing Rules Check Subprocess
 * - TB.2.1: Exit Action Rules Subprocess
 * - TB.2.2: Post Condition Rules Subprocess
 */
export class RuleEvaluationEngine {
  private now: () => Date;
  private getAttemptElapsedSecondsHook: ((activity: Activity) => number) | null;

  constructor(options: RuleEvaluationOptions = {}) {
    this.now = options.now || (() => new Date());
    this.getAttemptElapsedSecondsHook = options.getAttemptElapsedSecondsHook || null;
  }

  /**
   * Sequencing Rules Check Process (UP.2)
   * General process for evaluating a set of sequencing rules
   * @param {Activity} activity - The activity to evaluate rules for
   * @param {SequencingRule[]} rules - The rules to evaluate
   * @return {RuleActionType | null} - The action to take, or null if no rules apply
   */
  public checkSequencingRules(
    activity: Activity,
    rules: SequencingRule[]
  ): RuleActionType | null {
    for (const rule of rules) {
      if (this.checkRuleSubprocess(activity, rule)) {
        return rule.action;
      }
    }
    return null;
  }

  /**
   * Sequencing Rules Check Subprocess (UP.2.1)
   * Evaluates individual sequencing rule conditions
   * @param {Activity} activity - The activity to evaluate the rule for
   * @param {SequencingRule} rule - The rule to evaluate
   * @return {boolean} - True if all rule conditions are met
   */
  public checkRuleSubprocess(activity: Activity, rule: SequencingRule): boolean {
    // If no conditions, the rule always applies
    if (rule.conditions.length === 0) {
      return true;
    }

    const conditionCombination = rule.conditionCombination;

    if (conditionCombination === "all" || conditionCombination === RuleConditionOperator.AND) {
      return rule.conditions.every((condition) => condition.evaluate(activity));
    } else if (conditionCombination === "any" || conditionCombination === RuleConditionOperator.OR) {
      return rule.conditions.some((condition) => condition.evaluate(activity));
    }

    return false;
  }

  /**
   * Exit Action Rules Subprocess (TB.2.1)
   * Evaluates the exit condition rules for an activity
   * @param {Activity} activity - The activity to evaluate exit rules for
   * @return {RuleActionType | null} - The exit action to process, if any
   */
  public evaluateExitRules(activity: Activity): RuleActionType | null {
    const exitAction = this.checkSequencingRules(
      activity,
      activity.sequencingRules.exitConditionRules
    );

    // Only certain actions are valid for exit condition rules
    if (
      exitAction === RuleActionType.EXIT ||
      exitAction === RuleActionType.EXIT_PARENT ||
      exitAction === RuleActionType.EXIT_ALL
    ) {
      return exitAction;
    }

    return null;
  }

  /**
   * Post Condition Rules Subprocess (TB.2.2)
   * Evaluates the post-condition rules for an activity after delivery
   * @param {Activity} activity - The activity to evaluate post-condition rules for
   * @return {RuleActionType | null} - The action to take, if any
   */
  public evaluatePostConditionAction(activity: Activity): RuleActionType | null {
    const postAction = this.checkSequencingRules(
      activity,
      activity.sequencingRules.postConditionRules
    );

    // Only certain actions are valid for post-condition rules
    const validActions = [
      RuleActionType.EXIT_PARENT,
      RuleActionType.EXIT_ALL,
      RuleActionType.RETRY,
      RuleActionType.RETRY_ALL,
      RuleActionType.CONTINUE,
      RuleActionType.PREVIOUS,
      RuleActionType.STOP_FORWARD_TRAVERSAL
    ];

    if (postAction && validActions.includes(postAction)) {
      return postAction;
    }

    return null;
  }

  /**
   * Evaluate post-condition rules and map to sequencing/termination requests
   * @param {Activity} activity - The activity to evaluate
   * @return {PostConditionResult} - The post-condition result with sequencing and termination requests
   */
  public evaluatePostConditions(activity: Activity): PostConditionResult {
    const postAction = this.evaluatePostConditionAction(activity);

    if (!postAction) {
      return {
        sequencingRequest: null,
        terminationRequest: null
      };
    }

    switch (postAction) {
      case RuleActionType.EXIT_PARENT:
        return {
          sequencingRequest: null,
          terminationRequest: SequencingRequestType.EXIT_PARENT
        };

      case RuleActionType.EXIT_ALL:
        return {
          sequencingRequest: null,
          terminationRequest: SequencingRequestType.EXIT_ALL
        };

      case RuleActionType.RETRY:
        return {
          sequencingRequest: SequencingRequestType.RETRY,
          terminationRequest: null
        };

      case RuleActionType.RETRY_ALL:
        return {
          sequencingRequest: SequencingRequestType.RETRY,
          terminationRequest: SequencingRequestType.EXIT_ALL
        };

      case RuleActionType.CONTINUE:
        return {
          sequencingRequest: SequencingRequestType.CONTINUE,
          terminationRequest: null
        };

      case RuleActionType.PREVIOUS:
        return {
          sequencingRequest: SequencingRequestType.PREVIOUS,
          terminationRequest: null
        };

      case RuleActionType.STOP_FORWARD_TRAVERSAL:
        // Set traversal limiter on controls; not a navigation request
        activity.sequencingControls.stopForwardTraversal = true;
        return {
          sequencingRequest: null,
          terminationRequest: null
        };

      default:
        return {
          sequencingRequest: null,
          terminationRequest: null
        };
    }
  }

  /**
   * Limit Conditions Check Process (UP.1)
   * Checks if an activity has exceeded its limit conditions
   * @param {Activity} activity - The activity to check
   * @return {boolean} - True if limit conditions are violated
   */
  public checkLimitConditions(activity: Activity): boolean {
    // Check attempt limit
    if (activity.attemptLimit !== null && activity.attemptCount >= activity.attemptLimit) {
      return true;
    }

    // Check attempt absolute duration limit
    if (activity.attemptAbsoluteDurationLimit !== null) {
      const attemptLimitMs = this.parseDuration(activity.attemptAbsoluteDurationLimit);
      if (attemptLimitMs > 0) {
        const attemptDurationMs = this.parseDuration(activity.attemptExperiencedDuration);
        if (attemptDurationMs >= attemptLimitMs) {
          return true;
        }
      }
    }

    // Check activity absolute duration limit
    if (activity.activityAbsoluteDurationLimit !== null) {
      const activityLimitMs = this.parseDuration(activity.activityAbsoluteDurationLimit);
      if (activityLimitMs > 0) {
        const activityDurationMs = this.parseDuration(activity.activityExperiencedDuration);
        if (activityDurationMs >= activityLimitMs) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Parse ISO 8601 duration to milliseconds
   * @param {string} duration - ISO 8601 duration string
   * @return {number} - Duration in milliseconds
   */
  public parseDuration(duration: string): number {
    if (!duration || typeof duration !== "string") {
      return 0;
    }

    // Full ISO 8601 duration regex
    const regex =
      /^P(?:(\d+(?:\.\d+)?)Y)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)W)?(?:(\d+(?:\.\d+)?)D)?(?:T(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;

    const matches = duration.match(regex);
    if (!matches || duration === "P" || duration.endsWith("T")) {
      return 0;
    }

    const years = parseFloat(matches[1] || "0");
    const months = parseFloat(matches[2] || "0");
    const weeks = parseFloat(matches[3] || "0");
    const days = parseFloat(matches[4] || "0");
    const hours = parseFloat(matches[5] || "0");
    const minutes = parseFloat(matches[6] || "0");
    const seconds = parseFloat(matches[7] || "0");

    let totalMs = 0;
    totalMs += years * 365.25 * 24 * 3600 * 1000;
    totalMs += months * 30.44 * 24 * 3600 * 1000;
    totalMs += weeks * 7 * 24 * 3600 * 1000;
    totalMs += days * 24 * 3600 * 1000;
    totalMs += hours * 3600 * 1000;
    totalMs += minutes * 60 * 1000;
    totalMs += seconds * 1000;

    return totalMs;
  }

  /**
   * Get elapsed attempt seconds for an activity
   * @param {Activity} activity - The activity
   * @return {number} - Elapsed seconds
   */
  public getElapsedSeconds(activity: Activity): number {
    if (this.getAttemptElapsedSecondsHook) {
      try {
        return this.getAttemptElapsedSecondsHook(activity) || 0;
      } catch {
        return 0;
      }
    }

    if (activity.attemptAbsoluteStartTime) {
      const start = new Date(activity.attemptAbsoluteStartTime).getTime();
      const nowMs = this.now().getTime();
      if (!Number.isNaN(start) && nowMs > start) {
        return Math.max(0, (nowMs - start) / 1000);
      }
    }

    return 0;
  }

  /**
   * Check if time limit has been exceeded
   * @param {Activity} activity - The activity to check
   * @return {boolean} - True if time limit exceeded
   */
  public isTimeLimitExceeded(activity: Activity): boolean {
    let limit = activity.timeLimitDuration;
    if (!limit && activity.attemptAbsoluteDurationLimit) {
      limit = activity.attemptAbsoluteDurationLimit;
    }

    if (!limit) {
      return false;
    }

    const limitSeconds = getDurationAsSeconds(limit, scorm2004_regex.CMITimespan);
    if (limitSeconds <= 0) {
      return false;
    }

    const elapsedSeconds = this.getElapsedSeconds(activity);
    return elapsedSeconds > limitSeconds;
  }

  /**
   * Check if activity is outside available time range
   * @param {Activity} activity - The activity to check
   * @return {boolean} - True if outside time range
   */
  public isOutsideAvailableTimeRange(activity: Activity): boolean {
    const now = this.now();

    if (activity.beginTimeLimit) {
      try {
        const beginDate = new Date(activity.beginTimeLimit);
        if (!Number.isNaN(beginDate.getTime()) && now < beginDate) {
          return true;
        }
      } catch {
        // Invalid date format
      }
    }

    if (activity.endTimeLimit) {
      try {
        const endDate = new Date(activity.endTimeLimit);
        if (!Number.isNaN(endDate.getTime()) && now > endDate) {
          return true;
        }
      } catch {
        // Invalid date format
      }
    }

    return false;
  }

  /**
   * Evaluate pre-condition rules and check if activity can be delivered
   * @param {Activity} activity - The activity to check
   * @return {{ canDeliver: boolean; wasSkipped: boolean }} - Delivery check result
   */
  public canDeliverActivity(activity: Activity): { canDeliver: boolean; wasSkipped: boolean } {
    // Check limit conditions first
    if (this.checkLimitConditions(activity)) {
      return { canDeliver: false, wasSkipped: false };
    }

    // Check pre-condition rules
    const preConditionResult = this.checkSequencingRules(
      activity,
      activity.sequencingRules.preConditionRules
    );

    const wasSkipped = preConditionResult === RuleActionType.SKIP;

    return {
      canDeliver: preConditionResult !== RuleActionType.SKIP &&
                  preConditionResult !== RuleActionType.DISABLED,
      wasSkipped
    };
  }
}
