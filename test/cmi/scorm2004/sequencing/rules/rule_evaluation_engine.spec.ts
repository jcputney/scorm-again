import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  RuleEvaluationEngine
} from "../../../../../src/cmi/scorm2004/sequencing/rules/rule_evaluation_engine";
import {
  SequencingRequestType
} from "../../../../../src/cmi/scorm2004/sequencing/rules/sequencing_request_types";
import { Activity } from "../../../../../src/cmi/scorm2004/sequencing/activity";
import {
  RuleActionType,
  RuleCondition,
  RuleConditionType,
  SequencingRule
} from "../../../../../src/cmi/scorm2004/sequencing/sequencing_rules";

describe("RuleEvaluationEngine", () => {
  let engine: RuleEvaluationEngine;
  let activity: Activity;

  beforeEach(() => {
    engine = new RuleEvaluationEngine();
    activity = new Activity("test", "Test Activity");
  });

  describe("checkSequencingRules", () => {
    it("should return null when no rules provided", () => {
      const result = engine.checkSequencingRules(activity, []);
      expect(result).toBeNull();
    });

    it("should return action when rule conditions are met", () => {
      const rule = new SequencingRule(RuleActionType.SKIP);
      const condition = new RuleCondition(RuleConditionType.ALWAYS);
      rule.addCondition(condition);

      const result = engine.checkSequencingRules(activity, [rule]);
      expect(result).toBe(RuleActionType.SKIP);
    });

    it("should return null when rule conditions are not met", () => {
      const rule = new SequencingRule(RuleActionType.SKIP);
      const condition = new RuleCondition(RuleConditionType.ATTEMPTED);
      rule.addCondition(condition);

      // Activity has not been attempted
      activity.attemptCount = 0;

      const result = engine.checkSequencingRules(activity, [rule]);
      expect(result).toBeNull();
    });

    it("should return first matching rule action", () => {
      const rule1 = new SequencingRule(RuleActionType.SKIP);
      const condition1 = new RuleCondition(RuleConditionType.NEVER);
      rule1.addCondition(condition1);

      const rule2 = new SequencingRule(RuleActionType.DISABLED);
      const condition2 = new RuleCondition(RuleConditionType.ALWAYS);
      rule2.addCondition(condition2);

      const result = engine.checkSequencingRules(activity, [rule1, rule2]);
      expect(result).toBe(RuleActionType.DISABLED);
    });
  });

  describe("checkRuleSubprocess", () => {
    it("should return true for rule with no conditions", () => {
      const rule = new SequencingRule(RuleActionType.SKIP);
      expect(engine.checkRuleSubprocess(activity, rule)).toBe(true);
    });

    it("should evaluate AND conditions correctly", () => {
      const rule = new SequencingRule(RuleActionType.SKIP, "all");
      rule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      rule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));

      expect(engine.checkRuleSubprocess(activity, rule)).toBe(true);
    });

    it("should fail AND when one condition is false", () => {
      const rule = new SequencingRule(RuleActionType.SKIP, "all");
      rule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      rule.addCondition(new RuleCondition(RuleConditionType.NEVER));

      expect(engine.checkRuleSubprocess(activity, rule)).toBe(false);
    });

    it("should evaluate OR conditions correctly", () => {
      const rule = new SequencingRule(RuleActionType.SKIP, "any");
      rule.addCondition(new RuleCondition(RuleConditionType.NEVER));
      rule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));

      expect(engine.checkRuleSubprocess(activity, rule)).toBe(true);
    });

    it("should fail OR when all conditions are false", () => {
      const rule = new SequencingRule(RuleActionType.SKIP, "any");
      rule.addCondition(new RuleCondition(RuleConditionType.NEVER));
      rule.addCondition(new RuleCondition(RuleConditionType.NEVER));

      expect(engine.checkRuleSubprocess(activity, rule)).toBe(false);
    });
  });

  describe("evaluateExitRules", () => {
    it("should return null when no exit rules", () => {
      expect(engine.evaluateExitRules(activity)).toBeNull();
    });

    it("should return EXIT action when exit rule matches", () => {
      const rule = new SequencingRule(RuleActionType.EXIT);
      const condition = new RuleCondition(RuleConditionType.ALWAYS);
      rule.addCondition(condition);
      activity.sequencingRules.addExitConditionRule(rule);

      expect(engine.evaluateExitRules(activity)).toBe(RuleActionType.EXIT);
    });

    it("should return EXIT_PARENT action", () => {
      const rule = new SequencingRule(RuleActionType.EXIT_PARENT);
      rule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      activity.sequencingRules.addExitConditionRule(rule);

      expect(engine.evaluateExitRules(activity)).toBe(RuleActionType.EXIT_PARENT);
    });

    it("should return EXIT_ALL action", () => {
      const rule = new SequencingRule(RuleActionType.EXIT_ALL);
      rule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      activity.sequencingRules.addExitConditionRule(rule);

      expect(engine.evaluateExitRules(activity)).toBe(RuleActionType.EXIT_ALL);
    });

    it("should return null for invalid exit action types", () => {
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      activity.sequencingRules.addExitConditionRule(rule);

      expect(engine.evaluateExitRules(activity)).toBeNull();
    });
  });

  describe("evaluatePostConditions", () => {
    it("should return null requests when no post-condition rules", () => {
      const result = engine.evaluatePostConditions(activity);
      expect(result.sequencingRequest).toBeNull();
      expect(result.terminationRequest).toBeNull();
    });

    it("should handle EXIT_PARENT action", () => {
      const rule = new SequencingRule(RuleActionType.EXIT_PARENT);
      rule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      activity.sequencingRules.addPostConditionRule(rule);

      const result = engine.evaluatePostConditions(activity);
      expect(result.sequencingRequest).toBeNull();
      expect(result.terminationRequest).toBe(SequencingRequestType.EXIT_PARENT);
    });

    it("should handle EXIT_ALL action", () => {
      const rule = new SequencingRule(RuleActionType.EXIT_ALL);
      rule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      activity.sequencingRules.addPostConditionRule(rule);

      const result = engine.evaluatePostConditions(activity);
      expect(result.terminationRequest).toBe(SequencingRequestType.EXIT_ALL);
    });

    it("should handle RETRY action", () => {
      const rule = new SequencingRule(RuleActionType.RETRY);
      rule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      activity.sequencingRules.addPostConditionRule(rule);

      const result = engine.evaluatePostConditions(activity);
      expect(result.sequencingRequest).toBe(SequencingRequestType.RETRY);
      expect(result.terminationRequest).toBeNull();
    });

    it("should handle RETRY_ALL action", () => {
      const rule = new SequencingRule(RuleActionType.RETRY_ALL);
      rule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      activity.sequencingRules.addPostConditionRule(rule);

      const result = engine.evaluatePostConditions(activity);
      expect(result.sequencingRequest).toBe(SequencingRequestType.RETRY);
      expect(result.terminationRequest).toBe(SequencingRequestType.EXIT_ALL);
    });

    it("should handle CONTINUE action", () => {
      const rule = new SequencingRule(RuleActionType.CONTINUE);
      rule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      activity.sequencingRules.addPostConditionRule(rule);

      const result = engine.evaluatePostConditions(activity);
      expect(result.sequencingRequest).toBe(SequencingRequestType.CONTINUE);
    });

    it("should handle PREVIOUS action", () => {
      const rule = new SequencingRule(RuleActionType.PREVIOUS);
      rule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      activity.sequencingRules.addPostConditionRule(rule);

      const result = engine.evaluatePostConditions(activity);
      expect(result.sequencingRequest).toBe(SequencingRequestType.PREVIOUS);
    });

    it("should handle STOP_FORWARD_TRAVERSAL action", () => {
      const rule = new SequencingRule(RuleActionType.STOP_FORWARD_TRAVERSAL);
      rule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      activity.sequencingRules.addPostConditionRule(rule);

      const result = engine.evaluatePostConditions(activity);
      expect(result.sequencingRequest).toBeNull();
      expect(result.terminationRequest).toBeNull();
      expect(activity.sequencingControls.stopForwardTraversal).toBe(true);
    });
  });

  describe("checkLimitConditions", () => {
    it("should return false when no limits are set", () => {
      expect(engine.checkLimitConditions(activity)).toBe(false);
    });

    it("should return true when attempt limit is exceeded", () => {
      activity.attemptLimit = 3;
      activity.attemptCount = 3;

      expect(engine.checkLimitConditions(activity)).toBe(true);
    });

    it("should return false when attempt count is below limit", () => {
      activity.attemptLimit = 3;
      activity.attemptCount = 2;

      expect(engine.checkLimitConditions(activity)).toBe(false);
    });

    it("should return true when attempt duration limit is exceeded", () => {
      activity.attemptAbsoluteDurationLimit = "PT1H"; // 1 hour
      activity.attemptExperiencedDuration = "PT2H";   // 2 hours

      expect(engine.checkLimitConditions(activity)).toBe(true);
    });

    it("should return true when activity duration limit is exceeded", () => {
      activity.activityAbsoluteDurationLimit = "PT1H";
      activity.activityExperiencedDuration = "PT2H";

      expect(engine.checkLimitConditions(activity)).toBe(true);
    });

    it("should return false when durations are below limits", () => {
      activity.attemptAbsoluteDurationLimit = "PT2H";
      activity.attemptExperiencedDuration = "PT1H";

      expect(engine.checkLimitConditions(activity)).toBe(false);
    });
  });

  describe("parseDuration", () => {
    it("should parse hours correctly", () => {
      const ms = engine.parseDuration("PT1H");
      expect(ms).toBe(3600 * 1000);
    });

    it("should parse minutes correctly", () => {
      const ms = engine.parseDuration("PT30M");
      expect(ms).toBe(30 * 60 * 1000);
    });

    it("should parse seconds correctly", () => {
      const ms = engine.parseDuration("PT45S");
      expect(ms).toBe(45 * 1000);
    });

    it("should parse combined time correctly", () => {
      const ms = engine.parseDuration("PT1H30M45S");
      expect(ms).toBe((1 * 3600 + 30 * 60 + 45) * 1000);
    });

    it("should parse days correctly", () => {
      const ms = engine.parseDuration("P1D");
      expect(ms).toBe(24 * 3600 * 1000);
    });

    it("should parse weeks correctly", () => {
      const ms = engine.parseDuration("P1W");
      expect(ms).toBe(7 * 24 * 3600 * 1000);
    });

    it("should return 0 for invalid duration", () => {
      expect(engine.parseDuration("invalid")).toBe(0);
      expect(engine.parseDuration("")).toBe(0);
      expect(engine.parseDuration("P")).toBe(0);
      expect(engine.parseDuration("PT")).toBe(0);
    });

    it("should handle null/undefined", () => {
      expect(engine.parseDuration(null as any)).toBe(0);
      expect(engine.parseDuration(undefined as any)).toBe(0);
    });
  });

  describe("getElapsedSeconds", () => {
    it("should use hook when provided", () => {
      const hook = vi.fn().mockReturnValue(120);
      const engineWithHook = new RuleEvaluationEngine({
        getAttemptElapsedSecondsHook: hook
      });

      const result = engineWithHook.getElapsedSeconds(activity);
      expect(result).toBe(120);
      expect(hook).toHaveBeenCalledWith(activity);
    });

    it("should calculate from start time when hook not provided", () => {
      const now = new Date("2024-01-01T10:10:00Z");
      const start = new Date("2024-01-01T10:00:00Z");

      activity.attemptAbsoluteStartTime = start.toISOString();

      const engineWithTime = new RuleEvaluationEngine({
        now: () => now
      });

      const result = engineWithTime.getElapsedSeconds(activity);
      expect(result).toBe(600); // 10 minutes
    });

    it("should return 0 when no start time and no hook", () => {
      expect(engine.getElapsedSeconds(activity)).toBe(0);
    });

    it("should return 0 when hook throws error", () => {
      const engineWithBadHook = new RuleEvaluationEngine({
        getAttemptElapsedSecondsHook: () => {
          throw new Error("oops");
        }
      });

      expect(engineWithBadHook.getElapsedSeconds(activity)).toBe(0);
    });
  });

  describe("isTimeLimitExceeded", () => {
    it("should return false when no time limit set", () => {
      expect(engine.isTimeLimitExceeded(activity)).toBe(false);
    });

    it("should return true when time limit exceeded", () => {
      activity.timeLimitDuration = "PT10M"; // 10 minutes
      activity.attemptAbsoluteStartTime = new Date(Date.now() - 15 * 60 * 1000).toISOString();

      expect(engine.isTimeLimitExceeded(activity)).toBe(true);
    });

    it("should return false when within time limit", () => {
      activity.timeLimitDuration = "PT10M";
      activity.attemptAbsoluteStartTime = new Date(Date.now() - 5 * 60 * 1000).toISOString();

      expect(engine.isTimeLimitExceeded(activity)).toBe(false);
    });
  });

  describe("isOutsideAvailableTimeRange", () => {
    it("should return false when no time limits set", () => {
      expect(engine.isOutsideAvailableTimeRange(activity)).toBe(false);
    });

    it("should return true when before begin time", () => {
      const now = new Date("2024-01-01T10:00:00Z");
      const engineWithTime = new RuleEvaluationEngine({ now: () => now });

      activity.beginTimeLimit = "2024-01-01T12:00:00Z";

      expect(engineWithTime.isOutsideAvailableTimeRange(activity)).toBe(true);
    });

    it("should return true when after end time", () => {
      const now = new Date("2024-01-01T14:00:00Z");
      const engineWithTime = new RuleEvaluationEngine({ now: () => now });

      activity.endTimeLimit = "2024-01-01T12:00:00Z";

      expect(engineWithTime.isOutsideAvailableTimeRange(activity)).toBe(true);
    });

    it("should return false when within time range", () => {
      const now = new Date("2024-01-01T11:00:00Z");
      const engineWithTime = new RuleEvaluationEngine({ now: () => now });

      activity.beginTimeLimit = "2024-01-01T10:00:00Z";
      activity.endTimeLimit = "2024-01-01T12:00:00Z";

      expect(engineWithTime.isOutsideAvailableTimeRange(activity)).toBe(false);
    });
  });

  describe("canDeliverActivity", () => {
    it("should return canDeliver=true for activity with no limits or rules", () => {
      const result = engine.canDeliverActivity(activity);
      expect(result.canDeliver).toBe(true);
      expect(result.wasSkipped).toBe(false);
    });

    it("should return canDeliver=false when limit conditions violated", () => {
      activity.attemptLimit = 1;
      activity.attemptCount = 1;

      const result = engine.canDeliverActivity(activity);
      expect(result.canDeliver).toBe(false);
    });

    it("should return wasSkipped=true when SKIP rule applies", () => {
      const rule = new SequencingRule(RuleActionType.SKIP);
      rule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      activity.sequencingRules.addPreConditionRule(rule);

      const result = engine.canDeliverActivity(activity);
      expect(result.canDeliver).toBe(false);
      expect(result.wasSkipped).toBe(true);
    });

    it("should return canDeliver=false when DISABLED rule applies", () => {
      const rule = new SequencingRule(RuleActionType.DISABLED);
      rule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      activity.sequencingRules.addPreConditionRule(rule);

      const result = engine.canDeliverActivity(activity);
      expect(result.canDeliver).toBe(false);
      expect(result.wasSkipped).toBe(false);
    });
  });
});
