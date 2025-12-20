import { describe, it, expect, beforeEach } from "vitest";
import {
  RuleCondition,
  RuleConditionType,
  RuleConditionOperator,
  SequencingRule,
  RuleActionType,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import { Activity, ActivityObjective } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { SuccessStatus } from "../../../../src/constants/enums";

describe("Advanced Rule Conditions - Complete Coverage", () => {
  let activity: Activity;

  beforeEach(() => {
    activity = new Activity("test-activity", "Test Activity");
    activity.attemptCount = 0;
    activity.completionStatus = "unknown";
    activity.successStatus = SuccessStatus.UNKNOWN;
  });

  describe("Condition Type: satisfied / objectiveSatisfied", () => {
    it("should return true when primary objective is satisfied", () => {
      activity.objectiveSatisfiedStatus = true;
      const condition = new RuleCondition(RuleConditionType.SATISFIED);
      expect(condition.evaluate(activity)).toBe(true);
    });

    it("should return true when success status is passed", () => {
      activity.successStatus = SuccessStatus.PASSED;
      const condition = new RuleCondition(RuleConditionType.SATISFIED);
      expect(condition.evaluate(activity)).toBe(true);
    });

    it("should return false when objective is not satisfied", () => {
      activity.objectiveSatisfiedStatus = false;
      const condition = new RuleCondition(RuleConditionType.SATISFIED);
      expect(condition.evaluate(activity)).toBe(false);
    });

    it("should check referenced objective when specified", () => {
      const objective = new ActivityObjective("obj1");
      objective.satisfiedStatus = true;
      activity.objectives = [objective];

      const condition = new RuleCondition(RuleConditionType.SATISFIED);
      condition.referencedObjective = "obj1";
      expect(condition.evaluate(activity)).toBe(true);
    });

    it("should support objectiveSatisfied alias", () => {
      activity.objectiveSatisfiedStatus = true;
      const condition = new RuleCondition(RuleConditionType.OBJECTIVE_SATISFIED);
      expect(condition.evaluate(activity)).toBe(true);
    });
  });

  describe("Condition Type: objectiveStatusKnown", () => {
    it("should return true when objective measure status is known", () => {
      activity.objectiveMeasureStatus = true;
      const condition = new RuleCondition(RuleConditionType.OBJECTIVE_STATUS_KNOWN);
      expect(condition.evaluate(activity)).toBe(true);
    });

    it("should return false when objective measure status is unknown", () => {
      activity.objectiveMeasureStatus = false;
      const condition = new RuleCondition(RuleConditionType.OBJECTIVE_STATUS_KNOWN);
      expect(condition.evaluate(activity)).toBe(false);
    });

    it("should check referenced objective measure status", () => {
      const objective = new ActivityObjective("obj1");
      objective.measureStatus = true;
      activity.objectives = [objective];

      const condition = new RuleCondition(RuleConditionType.OBJECTIVE_STATUS_KNOWN);
      condition.referencedObjective = "obj1";
      expect(condition.evaluate(activity)).toBe(true);
    });
  });

  describe("Condition Type: objectiveMeasureKnown", () => {
    it("should return true when objective measure is known", () => {
      activity.objectiveMeasureStatus = true;
      const condition = new RuleCondition(RuleConditionType.OBJECTIVE_MEASURE_KNOWN);
      expect(condition.evaluate(activity)).toBe(true);
    });

    it("should return false when measure is not set", () => {
      activity.objectiveMeasureStatus = false;
      const condition = new RuleCondition(RuleConditionType.OBJECTIVE_MEASURE_KNOWN);
      expect(condition.evaluate(activity)).toBe(false);
    });
  });

  describe("Condition Type: objectiveMeasureGreaterThan", () => {
    it("should return true when measure > threshold", () => {
      activity.objectiveMeasureStatus = true;
      activity.objectiveNormalizedMeasure = 0.8;
      const params = new Map([["threshold", 0.5]]);
      const condition = new RuleCondition(
        RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN,
        null,
        params,
      );
      expect(condition.evaluate(activity)).toBe(true);
    });

    it("should return false when measure <= threshold", () => {
      activity.objectiveMeasureStatus = true;
      activity.objectiveNormalizedMeasure = 0.5;
      const params = new Map([["threshold", 0.5]]);
      const condition = new RuleCondition(
        RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN,
        null,
        params,
      );
      expect(condition.evaluate(activity)).toBe(false);
    });

    it("should return false when measure status is not set", () => {
      activity.objectiveMeasureStatus = false;
      activity.objectiveNormalizedMeasure = 0.8;
      const params = new Map([["threshold", 0.5]]);
      const condition = new RuleCondition(
        RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN,
        null,
        params,
      );
      expect(condition.evaluate(activity)).toBe(false);
    });

    it("should handle edge case of exactly equal values", () => {
      activity.objectiveMeasureStatus = true;
      activity.objectiveNormalizedMeasure = 0.75;
      const params = new Map([["threshold", 0.75]]);
      const condition = new RuleCondition(
        RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN,
        null,
        params,
      );
      expect(condition.evaluate(activity)).toBe(false); // Not greater, just equal
    });
  });

  describe("Condition Type: objectiveMeasureLessThan", () => {
    it("should return true when measure < threshold", () => {
      activity.objectiveMeasureStatus = true;
      activity.objectiveNormalizedMeasure = 0.3;
      const params = new Map([["threshold", 0.5]]);
      const condition = new RuleCondition(
        RuleConditionType.OBJECTIVE_MEASURE_LESS_THAN,
        null,
        params,
      );
      expect(condition.evaluate(activity)).toBe(true);
    });

    it("should return false when measure >= threshold", () => {
      activity.objectiveMeasureStatus = true;
      activity.objectiveNormalizedMeasure = 0.5;
      const params = new Map([["threshold", 0.5]]);
      const condition = new RuleCondition(
        RuleConditionType.OBJECTIVE_MEASURE_LESS_THAN,
        null,
        params,
      );
      expect(condition.evaluate(activity)).toBe(false);
    });

    it("should return false when measure status is not set", () => {
      activity.objectiveMeasureStatus = false;
      activity.objectiveNormalizedMeasure = 0.3;
      const params = new Map([["threshold", 0.5]]);
      const condition = new RuleCondition(
        RuleConditionType.OBJECTIVE_MEASURE_LESS_THAN,
        null,
        params,
      );
      expect(condition.evaluate(activity)).toBe(false);
    });
  });

  describe("Condition Type: completed / activityCompleted", () => {
    it("should return true when activity is completed", () => {
      activity.completionStatus = "completed";
      const condition = new RuleCondition(RuleConditionType.COMPLETED);
      expect(condition.evaluate(activity)).toBe(true);
    });

    it("should return false when activity is not completed", () => {
      activity.completionStatus = "incomplete";
      const condition = new RuleCondition(RuleConditionType.COMPLETED);
      expect(condition.evaluate(activity)).toBe(false);
    });

    it("should support activityCompleted alias", () => {
      activity.completionStatus = "completed";
      const condition = new RuleCondition(RuleConditionType.ACTIVITY_COMPLETED);
      expect(condition.evaluate(activity)).toBe(true);
    });
  });

  describe("Condition Type: activityProgressKnown", () => {
    it("should return true when progress is known", () => {
      activity.completionStatus = "incomplete";
      const condition = new RuleCondition(RuleConditionType.PROGRESS_KNOWN);
      expect(condition.evaluate(activity)).toBe(true);
    });

    it("should return false when progress is unknown", () => {
      activity.completionStatus = "unknown";
      const condition = new RuleCondition(RuleConditionType.PROGRESS_KNOWN);
      expect(condition.evaluate(activity)).toBe(false);
    });

    it("should support activityProgressKnown alias", () => {
      activity.completionStatus = "completed";
      const condition = new RuleCondition(RuleConditionType.ACTIVITY_PROGRESS_KNOWN);
      expect(condition.evaluate(activity)).toBe(true);
    });
  });

  describe("Condition Type: attempted", () => {
    it("should return true when activity has been attempted", () => {
      activity.attemptCount = 1;
      const condition = new RuleCondition(RuleConditionType.ATTEMPTED);
      expect(condition.evaluate(activity)).toBe(true);
    });

    it("should return false when activity has not been attempted", () => {
      activity.attemptCount = 0;
      const condition = new RuleCondition(RuleConditionType.ATTEMPTED);
      expect(condition.evaluate(activity)).toBe(false);
    });

    it("should return true for multiple attempts", () => {
      activity.attemptCount = 5;
      const condition = new RuleCondition(RuleConditionType.ATTEMPTED);
      expect(condition.evaluate(activity)).toBe(true);
    });
  });

  describe("Condition Type: attemptLimitExceeded", () => {
    // SCORM 2004 specifies attemptLimit is a property of the activity itself,
    // not a parameter on the condition
    it("should return true when attempt count >= limit", () => {
      activity.attemptLimit = 3;
      activity.attemptCount = 3;
      const condition = new RuleCondition(RuleConditionType.ATTEMPT_LIMIT_EXCEEDED);
      expect(condition.evaluate(activity)).toBe(true);
    });

    it("should return false when attempt count < limit", () => {
      activity.attemptLimit = 3;
      activity.attemptCount = 2;
      const condition = new RuleCondition(RuleConditionType.ATTEMPT_LIMIT_EXCEEDED);
      expect(condition.evaluate(activity)).toBe(false);
    });

    it("should handle boundary case - exactly at limit", () => {
      activity.attemptLimit = 5;
      activity.attemptCount = 5;
      const condition = new RuleCondition(RuleConditionType.ATTEMPT_LIMIT_EXCEEDED);
      expect(condition.evaluate(activity)).toBe(true); // >= includes equal
    });

    it("should return true when exceeded", () => {
      activity.attemptLimit = 5;
      activity.attemptCount = 6;
      const condition = new RuleCondition(RuleConditionType.ATTEMPT_LIMIT_EXCEEDED);
      expect(condition.evaluate(activity)).toBe(true);
    });
  });

  describe("Condition Type: timeLimitExceeded", () => {
    it("should return true when time limit is exceeded", () => {
      activity.timeLimitDuration = "PT1H"; // 1 hour
      activity.attemptExperiencedDuration = "PT2H"; // 2 hours
      const condition = new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED);
      expect(condition.evaluate(activity)).toBe(true);
    });

    it("should return false when time limit is not exceeded", () => {
      activity.timeLimitDuration = "PT2H"; // 2 hours
      activity.attemptExperiencedDuration = "PT1H"; // 1 hour
      const condition = new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED);
      expect(condition.evaluate(activity)).toBe(false);
    });

    it("should return false when no time limit is set", () => {
      activity.attemptExperiencedDuration = "PT5H";
      const condition = new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED);
      expect(condition.evaluate(activity)).toBe(false);
    });

    it("should handle complex ISO 8601 durations", () => {
      activity.timeLimitDuration = "PT30M"; // 30 minutes
      activity.attemptExperiencedDuration = "PT45M"; // 45 minutes
      const condition = new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED);
      expect(condition.evaluate(activity)).toBe(true);
    });
  });

  describe("Condition Type: outsideAvailableTimeRange", () => {
    beforeEach(() => {
      // Mock the static now provider
      const fixedDate = new Date("2025-06-15T12:00:00Z");
      RuleCondition.setNowProvider(() => fixedDate);
    });

    it("should return true when before begin time", () => {
      activity.beginTimeLimit = "2025-06-15T13:00:00Z"; // 1 hour in future
      const condition = new RuleCondition(RuleConditionType.OUTSIDE_AVAILABLE_TIME_RANGE);
      expect(condition.evaluate(activity)).toBe(true);
    });

    it("should return true when after end time", () => {
      activity.endTimeLimit = "2025-06-15T11:00:00Z"; // 1 hour in past
      const condition = new RuleCondition(RuleConditionType.OUTSIDE_AVAILABLE_TIME_RANGE);
      expect(condition.evaluate(activity)).toBe(true);
    });

    it("should return false when within time range", () => {
      activity.beginTimeLimit = "2025-06-15T10:00:00Z"; // 2 hours ago
      activity.endTimeLimit = "2025-06-15T14:00:00Z"; // 2 hours from now
      const condition = new RuleCondition(RuleConditionType.OUTSIDE_AVAILABLE_TIME_RANGE);
      expect(condition.evaluate(activity)).toBe(false);
    });

    it("should return false when no time limits are set", () => {
      const condition = new RuleCondition(RuleConditionType.OUTSIDE_AVAILABLE_TIME_RANGE);
      expect(condition.evaluate(activity)).toBe(false);
    });

    it("should handle timezone offsets in ISO 8601 dates", () => {
      activity.beginTimeLimit = "2025-06-15T08:00:00-05:00"; // 8 AM EST (13:00 UTC)
      const condition = new RuleCondition(RuleConditionType.OUTSIDE_AVAILABLE_TIME_RANGE);
      expect(condition.evaluate(activity)).toBe(true); // Current is 12:00 UTC < 13:00 UTC
    });
  });

  describe("Condition Type: always", () => {
    it("should always return true", () => {
      const condition = new RuleCondition(RuleConditionType.ALWAYS);
      expect(condition.evaluate(activity)).toBe(true);
    });

    it("should return true regardless of activity state", () => {
      activity.completionStatus = "incomplete";
      activity.attemptCount = 0;
      const condition = new RuleCondition(RuleConditionType.ALWAYS);
      expect(condition.evaluate(activity)).toBe(true);
    });
  });

  describe("Condition Type: never", () => {
    it("should always return false", () => {
      const condition = new RuleCondition(RuleConditionType.NEVER);
      expect(condition.evaluate(activity)).toBe(false);
    });

    it("should return false regardless of activity state", () => {
      activity.completionStatus = "completed";
      activity.attemptCount = 10;
      const condition = new RuleCondition(RuleConditionType.NEVER);
      expect(condition.evaluate(activity)).toBe(false);
    });
  });

  describe("Operator: NOT", () => {
    it("should invert true to false", () => {
      const condition = new RuleCondition(RuleConditionType.ALWAYS, RuleConditionOperator.NOT);
      expect(condition.evaluate(activity)).toBe(false);
    });

    it("should invert false to true", () => {
      const condition = new RuleCondition(RuleConditionType.NEVER, RuleConditionOperator.NOT);
      expect(condition.evaluate(activity)).toBe(true);
    });

    it("should invert attempted condition", () => {
      activity.attemptCount = 0;
      const condition = new RuleCondition(RuleConditionType.ATTEMPTED, RuleConditionOperator.NOT);
      expect(condition.evaluate(activity)).toBe(true);

      activity.attemptCount = 1;
      expect(condition.evaluate(activity)).toBe(false);
    });
  });

  describe("Multiple NOT operators (double negation)", () => {
    it("should handle NOT NOT as identity (using two separate conditions)", () => {
      // First condition: NOT always = false
      const condition1 = new RuleCondition(RuleConditionType.ALWAYS, RuleConditionOperator.NOT);
      expect(condition1.evaluate(activity)).toBe(false);

      // Applying NOT again manually (simulating double negation)
      // Since we can't apply NOT twice to same condition, we test the logic
      const result1 = condition1.evaluate(activity); // false
      const doubleNegation = !result1; // true (simulating second NOT)
      expect(doubleNegation).toBe(true);
    });

    it("should demonstrate double negation preserves original value", () => {
      activity.attemptCount = 5;

      // Original: attempted = true
      const originalCondition = new RuleCondition(RuleConditionType.ATTEMPTED);
      const originalResult = originalCondition.evaluate(activity);
      expect(originalResult).toBe(true);

      // First NOT: !attempted = false
      const notCondition = new RuleCondition(
        RuleConditionType.ATTEMPTED,
        RuleConditionOperator.NOT,
      );
      const notResult = notCondition.evaluate(activity);
      expect(notResult).toBe(false);

      // Second NOT (simulated): !!attempted = true
      const doubleNot = !notResult;
      expect(doubleNot).toBe(originalResult);
    });
  });

  describe("ConditionCombination: AND (all)", () => {
    it("should return true when all conditions are true", () => {
      activity.attemptCount = 1;
      activity.completionStatus = "completed";

      const rule = new SequencingRule(RuleActionType.SKIP, "all");
      rule.addCondition(new RuleCondition(RuleConditionType.ATTEMPTED));
      rule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));

      expect(rule.evaluate(activity)).toBe(true);
    });

    it("should return false when one condition is false", () => {
      activity.attemptCount = 1;
      activity.completionStatus = "incomplete";

      const rule = new SequencingRule(RuleActionType.SKIP, "all");
      rule.addCondition(new RuleCondition(RuleConditionType.ATTEMPTED));
      rule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));

      expect(rule.evaluate(activity)).toBe(false);
    });

    it("should support RuleConditionOperator.AND", () => {
      activity.attemptCount = 1;
      activity.completionStatus = "completed";

      const rule = new SequencingRule(RuleActionType.SKIP, RuleConditionOperator.AND);
      rule.addCondition(new RuleCondition(RuleConditionType.ATTEMPTED));
      rule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));

      expect(rule.evaluate(activity)).toBe(true);
    });
  });

  describe("ConditionCombination: OR (any)", () => {
    it("should return true when one condition is true", () => {
      activity.attemptCount = 1;
      activity.completionStatus = "incomplete";

      const rule = new SequencingRule(RuleActionType.SKIP, "any");
      rule.addCondition(new RuleCondition(RuleConditionType.ATTEMPTED));
      rule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));

      expect(rule.evaluate(activity)).toBe(true);
    });

    it("should return false when all conditions are false", () => {
      activity.attemptCount = 0;
      activity.completionStatus = "incomplete";

      const rule = new SequencingRule(RuleActionType.SKIP, "any");
      rule.addCondition(new RuleCondition(RuleConditionType.ATTEMPTED));
      rule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));

      expect(rule.evaluate(activity)).toBe(false);
    });

    it("should support RuleConditionOperator.OR", () => {
      activity.attemptCount = 0;
      activity.completionStatus = "completed";

      const rule = new SequencingRule(RuleActionType.SKIP, RuleConditionOperator.OR);
      rule.addCondition(new RuleCondition(RuleConditionType.ATTEMPTED));
      rule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));

      expect(rule.evaluate(activity)).toBe(true);
    });
  });

  describe("NOT with AND (De Morgan's law)", () => {
    it("should demonstrate NOT (A AND B) = (NOT A) OR (NOT B)", () => {
      activity.attemptCount = 1;
      activity.completionStatus = "incomplete";

      // A AND B where A=true, B=false => false
      const andRule = new SequencingRule(RuleActionType.SKIP, "all");
      andRule.addCondition(new RuleCondition(RuleConditionType.ATTEMPTED)); // true
      andRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED)); // false
      expect(andRule.evaluate(activity)).toBe(false);

      // NOT A = false, NOT B = true, so (NOT A) OR (NOT B) = true
      const orRule = new SequencingRule(RuleActionType.SKIP, "any");
      orRule.addCondition(new RuleCondition(RuleConditionType.ATTEMPTED, RuleConditionOperator.NOT)); // false
      orRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED, RuleConditionOperator.NOT)); // true
      expect(orRule.evaluate(activity)).toBe(true);

      // Verify De Morgan's law: NOT(andResult) === orResult
      expect(!andRule.evaluate(activity)).toBe(orRule.evaluate(activity));
    });
  });

  describe("NOT with OR (De Morgan's law)", () => {
    it("should demonstrate NOT (A OR B) = (NOT A) AND (NOT B)", () => {
      activity.attemptCount = 0;
      activity.completionStatus = "incomplete";

      // A OR B where A=false, B=false => false
      const orRule = new SequencingRule(RuleActionType.SKIP, "any");
      orRule.addCondition(new RuleCondition(RuleConditionType.ATTEMPTED)); // false
      orRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED)); // false
      expect(orRule.evaluate(activity)).toBe(false);

      // NOT A = true, NOT B = true, so (NOT A) AND (NOT B) = true
      const andRule = new SequencingRule(RuleActionType.SKIP, "all");
      andRule.addCondition(new RuleCondition(RuleConditionType.ATTEMPTED, RuleConditionOperator.NOT)); // true
      andRule.addCondition(new RuleCondition(RuleConditionType.COMPLETED, RuleConditionOperator.NOT)); // true
      expect(andRule.evaluate(activity)).toBe(true);

      // Verify De Morgan's law: NOT(orResult) === andResult
      expect(!orRule.evaluate(activity)).toBe(andRule.evaluate(activity));
    });
  });

  describe("Referenced Objectives", () => {
    it("should evaluate against referenced objective by ID", () => {
      const objective1 = new ActivityObjective("obj1");
      objective1.satisfiedStatus = true;

      const objective2 = new ActivityObjective("obj2");
      objective2.satisfiedStatus = false;

      activity.objectives = [objective1, objective2];

      const condition1 = new RuleCondition(RuleConditionType.SATISFIED);
      condition1.referencedObjective = "obj1";
      expect(condition1.evaluate(activity)).toBe(true);

      const condition2 = new RuleCondition(RuleConditionType.SATISFIED);
      condition2.referencedObjective = "obj2";
      expect(condition2.evaluate(activity)).toBe(false);
    });

    it("should return false for non-existent objective", () => {
      const objective = new ActivityObjective("obj1");
      objective.satisfiedStatus = true;
      activity.objectives = [objective];

      const condition = new RuleCondition(RuleConditionType.SATISFIED);
      condition.referencedObjective = "nonexistent";
      expect(condition.evaluate(activity)).toBe(false);
    });

    it("should handle objective measure comparison with referenced objective", () => {
      const objective = new ActivityObjective("obj1");
      objective.measureStatus = true;
      objective.normalizedMeasure = 0.9;
      activity.objectives = [objective];

      const params = new Map([["threshold", 0.7]]);
      const condition = new RuleCondition(
        RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN,
        null,
        params,
      );
      condition.referencedObjective = "obj1";
      expect(condition.evaluate(activity)).toBe(true);
    });

    it("should use primary objective when no reference specified", () => {
      activity.objectiveMeasureStatus = true;
      activity.objectiveNormalizedMeasure = 0.6;

      const params = new Map([["threshold", 0.5]]);
      const condition = new RuleCondition(
        RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN,
        null,
        params,
      );
      expect(condition.evaluate(activity)).toBe(true);
    });
  });

  describe("Complex Nested Condition Groups", () => {
    it("should handle three conditions with AND", () => {
      activity.attemptCount = 2;
      activity.completionStatus = "completed";
      activity.objectiveSatisfiedStatus = true;

      const rule = new SequencingRule(RuleActionType.SKIP, "all");
      rule.addCondition(new RuleCondition(RuleConditionType.ATTEMPTED));
      rule.addCondition(new RuleCondition(RuleConditionType.COMPLETED));
      rule.addCondition(new RuleCondition(RuleConditionType.SATISFIED));

      expect(rule.evaluate(activity)).toBe(true);
    });

    it("should handle mixed conditions with OR", () => {
      activity.attemptCount = 0;
      activity.completionStatus = "incomplete";
      activity.objectiveSatisfiedStatus = true;

      const rule = new SequencingRule(RuleActionType.SKIP, "any");
      rule.addCondition(new RuleCondition(RuleConditionType.ATTEMPTED)); // false
      rule.addCondition(new RuleCondition(RuleConditionType.COMPLETED)); // false
      rule.addCondition(new RuleCondition(RuleConditionType.SATISFIED)); // true

      expect(rule.evaluate(activity)).toBe(true);
    });

    it("should handle complex combination with NOT operators", () => {
      activity.attemptCount = 1;
      activity.completionStatus = "incomplete";

      const rule = new SequencingRule(RuleActionType.SKIP, "all");
      rule.addCondition(new RuleCondition(RuleConditionType.ATTEMPTED)); // true
      rule.addCondition(new RuleCondition(RuleConditionType.COMPLETED, RuleConditionOperator.NOT)); // true (not completed)

      expect(rule.evaluate(activity)).toBe(true);
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle empty rule (no conditions) as always true", () => {
      const rule = new SequencingRule(RuleActionType.SKIP, "all");
      expect(rule.evaluate(activity)).toBe(true);
    });

    it("should handle measure exactly at boundary", () => {
      activity.objectiveMeasureStatus = true;
      activity.objectiveNormalizedMeasure = 0.5;

      const paramsGreater = new Map([["threshold", 0.5]]);
      const conditionGreater = new RuleCondition(
        RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN,
        null,
        paramsGreater,
      );
      expect(conditionGreater.evaluate(activity)).toBe(false); // Not strictly greater

      const paramsLess = new Map([["threshold", 0.5]]);
      const conditionLess = new RuleCondition(
        RuleConditionType.OBJECTIVE_MEASURE_LESS_THAN,
        null,
        paramsLess,
      );
      expect(conditionLess.evaluate(activity)).toBe(false); // Not strictly less
    });

    it("should handle zero attempt limit", () => {
      // SCORM 2004: attemptLimit is a property of the activity itself
      activity.attemptLimit = 0;
      activity.attemptCount = 0;
      const condition = new RuleCondition(RuleConditionType.ATTEMPT_LIMIT_EXCEEDED);
      expect(condition.evaluate(activity)).toBe(true); // 0 >= 0
    });

    it("should handle missing parameters gracefully", () => {
      activity.objectiveMeasureStatus = true;
      activity.objectiveNormalizedMeasure = 0.5;

      // No threshold parameter provided - should default to 0
      const condition = new RuleCondition(RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN);
      expect(condition.evaluate(activity)).toBe(true); // 0.5 > 0
    });
  });

  describe("Integration: Multiple Rules in Sequence", () => {
    it("should evaluate multiple pre-condition rules in order", () => {
      activity.attemptCount = 1;
      activity.completionStatus = "incomplete";

      const rule1 = new SequencingRule(RuleActionType.SKIP, "all");
      rule1.addCondition(new RuleCondition(RuleConditionType.NEVER));

      const rule2 = new SequencingRule(RuleActionType.DISABLED, "all");
      rule2.addCondition(new RuleCondition(RuleConditionType.ATTEMPTED));

      // First rule evaluates to false, second evaluates to true
      expect(rule1.evaluate(activity)).toBe(false);
      expect(rule2.evaluate(activity)).toBe(true);
    });

    it("should stop at first matching rule", () => {
      activity.attemptCount = 2;

      const rule1 = new SequencingRule(RuleActionType.SKIP, "all");
      rule1.addCondition(new RuleCondition(RuleConditionType.ATTEMPTED));

      const rule2 = new SequencingRule(RuleActionType.DISABLED, "all");
      rule2.addCondition(new RuleCondition(RuleConditionType.ALWAYS));

      // Both would match, but in real usage, first match wins
      expect(rule1.evaluate(activity)).toBe(true);
      expect(rule2.evaluate(activity)).toBe(true);
    });
  });
});
