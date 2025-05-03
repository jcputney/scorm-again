// noinspection DuplicatedCode

import { describe, expect, it } from "vitest";
import {
  RollupActionType,
  RollupCondition,
  RollupConditionType,
  RollupConsiderationType,
  RollupRule,
  RollupRules,
} from "../../../../src/cmi/scorm2004/sequencing/rollup_rules";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { CompletionStatus, SuccessStatus } from "../../../../src/constants/enums";
import { Scorm2004ValidationError } from "../../../../src/exceptions/scorm2004_exceptions";

describe("RollupRules", () => {
  describe("RollupCondition", () => {
    describe("constructor", () => {
      it("should initialize with default values", () => {
        const condition = new RollupCondition();
        expect(condition.condition).toBe(RollupConditionType.ALWAYS);
        expect(condition.parameters.size).toBe(0);
      });

      it("should initialize with provided values", () => {
        const parameters = new Map([["threshold", 0.8]]);
        const condition = new RollupCondition(
          RollupConditionType.OBJECTIVE_MEASURE_GREATER_THAN,
          parameters,
        );
        expect(condition.condition).toBe(RollupConditionType.OBJECTIVE_MEASURE_GREATER_THAN);
        expect(condition.parameters).toBe(parameters);
        expect(condition.parameters.get("threshold")).toBe(0.8);
      });
    });

    describe("reset", () => {
      it("should reset initialized flag", () => {
        const condition = new RollupCondition();
        condition.initialize();
        expect(condition.initialized).toBe(true);

        condition.reset();
        expect(condition.initialized).toBe(false);
      });
    });

    describe("evaluate", () => {
      it("should evaluate SATISFIED condition", () => {
        const condition = new RollupCondition(RollupConditionType.SATISFIED);
        const activity = new Activity();

        activity.successStatus = SuccessStatus.PASSED;
        expect(condition.evaluate(activity)).toBe(true);

        activity.successStatus = SuccessStatus.FAILED;
        expect(condition.evaluate(activity)).toBe(false);

        activity.successStatus = SuccessStatus.UNKNOWN;
        expect(condition.evaluate(activity)).toBe(false);
      });

      it("should evaluate OBJECTIVE_MEASURE_GREATER_THAN condition", () => {
        const parameters = new Map([["threshold", 0.5]]);
        const condition = new RollupCondition(
          RollupConditionType.OBJECTIVE_MEASURE_GREATER_THAN,
          parameters,
        );
        const activity = new Activity();

        activity.objectiveMeasureStatus = true;
        activity.objectiveNormalizedMeasure = 0.8;
        expect(condition.evaluate(activity)).toBe(true);

        activity.objectiveNormalizedMeasure = 0.5;
        expect(condition.evaluate(activity)).toBe(false);

        activity.objectiveNormalizedMeasure = 0.4;
        expect(condition.evaluate(activity)).toBe(false);

        activity.objectiveMeasureStatus = false;
        activity.objectiveNormalizedMeasure = 0.8;
        expect(condition.evaluate(activity)).toBe(false);
      });

      it("should evaluate COMPLETED condition", () => {
        const condition = new RollupCondition(RollupConditionType.COMPLETED);
        const activity = new Activity();

        activity.isCompleted = true;
        expect(condition.evaluate(activity)).toBe(true);

        activity.isCompleted = false;
        expect(condition.evaluate(activity)).toBe(false);
      });

      it("should evaluate ATTEMPTED condition", () => {
        const condition = new RollupCondition(RollupConditionType.ATTEMPTED);
        const activity = new Activity();

        expect(condition.evaluate(activity)).toBe(false); // Default attemptCount is 0

        activity.incrementAttemptCount();
        expect(condition.evaluate(activity)).toBe(true);
      });

      it("should evaluate NOT_ATTEMPTED condition", () => {
        const condition = new RollupCondition(RollupConditionType.NOT_ATTEMPTED);
        const activity = new Activity();

        expect(condition.evaluate(activity)).toBe(true); // Default attemptCount is 0

        activity.incrementAttemptCount();
        expect(condition.evaluate(activity)).toBe(false);
      });

      it("should evaluate ALWAYS condition", () => {
        const condition = new RollupCondition(RollupConditionType.ALWAYS);
        const activity = new Activity();

        expect(condition.evaluate(activity)).toBe(true);
      });
    });

    describe("toJSON", () => {
      it("should return a JSON representation of the condition", () => {
        const parameters = new Map([["threshold", 0.8]]);
        const condition = new RollupCondition(
          RollupConditionType.OBJECTIVE_MEASURE_GREATER_THAN,
          parameters,
        );

        const result = condition.toJSON();

        expect(result).toHaveProperty(
          "condition",
          RollupConditionType.OBJECTIVE_MEASURE_GREATER_THAN,
        );
        expect(result).toHaveProperty("parameters");
        expect((result as any).parameters).toEqual({ threshold: 0.8 });
      });
    });
  });

  describe("RollupRule", () => {
    describe("constructor", () => {
      it("should initialize with default values", () => {
        const rule = new RollupRule();
        expect(rule.action).toBe(RollupActionType.SATISFIED);
        expect(rule.consideration).toBe(RollupConsiderationType.ALL);
        expect(rule.minimumCount).toBe(0);
        expect(rule.minimumPercent).toBe(0);
        expect(rule.conditions).toEqual([]);
      });

      it("should initialize with provided values", () => {
        const rule = new RollupRule(
          RollupActionType.NOT_SATISFIED,
          RollupConsiderationType.AT_LEAST_COUNT,
          2,
          0,
        );
        expect(rule.action).toBe(RollupActionType.NOT_SATISFIED);
        expect(rule.consideration).toBe(RollupConsiderationType.AT_LEAST_COUNT);
        expect(rule.minimumCount).toBe(2);
        expect(rule.minimumPercent).toBe(0);
        expect(rule.conditions).toEqual([]);
      });
    });

    describe("reset", () => {
      it("should reset initialized flag and conditions", () => {
        const rule = new RollupRule();
        rule.initialize();
        rule.addCondition(new RollupCondition());

        expect(rule.initialized).toBe(true);
        expect(rule.conditions.length).toBe(1);

        rule.reset();

        expect(rule.initialized).toBe(false);
        expect(rule.conditions.length).toBe(0);
      });
    });

    describe("addCondition", () => {
      it("should add a condition to the rule", () => {
        const rule = new RollupRule();
        const condition = new RollupCondition();

        rule.addCondition(condition);

        expect(rule.conditions).toContain(condition);
      });

      it("should throw an error if condition is not a RollupCondition", () => {
        const rule = new RollupRule();

        expect(() => {
          rule.addCondition("not a condition" as any);
        }).toThrow(Scorm2004ValidationError);
      });
    });

    describe("removeCondition", () => {
      it("should remove a condition from the rule", () => {
        const rule = new RollupRule();
        const condition = new RollupCondition();

        rule.addCondition(condition);
        const result = rule.removeCondition(condition);

        expect(result).toBe(true);
        expect(rule.conditions).not.toContain(condition);
      });

      it("should return false if condition is not found", () => {
        const rule = new RollupRule();
        const condition = new RollupCondition();

        const result = rule.removeCondition(condition);

        expect(result).toBe(false);
      });
    });

    describe("evaluate", () => {
      it("should return false if there are no children", () => {
        const rule = new RollupRule();
        const children: Activity[] = [];

        expect(rule.evaluate(children)).toBe(false);
      });

      it("should evaluate with ALL consideration", () => {
        const rule = new RollupRule(RollupActionType.SATISFIED, RollupConsiderationType.ALL);
        const condition = new RollupCondition(RollupConditionType.COMPLETED);
        rule.addCondition(condition);

        const child1 = new Activity("child1", "Child 1");
        const child2 = new Activity("child2", "Child 2");
        const child3 = new Activity("child3", "Child 3");

        // No children completed
        child1.isCompleted = false;
        child2.isCompleted = false;
        child3.isCompleted = false;
        expect(rule.evaluate([child1, child2, child3])).toBe(false);

        // Some children completed
        child1.isCompleted = true;
        child2.isCompleted = false;
        child3.isCompleted = true;
        expect(rule.evaluate([child1, child2, child3])).toBe(false);

        // All children completed
        child1.isCompleted = true;
        child2.isCompleted = true;
        child3.isCompleted = true;
        expect(rule.evaluate([child1, child2, child3])).toBe(true);
      });

      it("should evaluate with ANY consideration", () => {
        const rule = new RollupRule(RollupActionType.SATISFIED, RollupConsiderationType.ANY);
        const condition = new RollupCondition(RollupConditionType.COMPLETED);
        rule.addCondition(condition);

        const child1 = new Activity("child1", "Child 1");
        const child2 = new Activity("child2", "Child 2");
        const child3 = new Activity("child3", "Child 3");

        // No children completed
        child1.isCompleted = false;
        child2.isCompleted = false;
        child3.isCompleted = false;
        expect(rule.evaluate([child1, child2, child3])).toBe(false);

        // Some children completed
        child1.isCompleted = true;
        child2.isCompleted = false;
        child3.isCompleted = false;
        expect(rule.evaluate([child1, child2, child3])).toBe(true);

        // All children completed
        child1.isCompleted = true;
        child2.isCompleted = true;
        child3.isCompleted = true;
        expect(rule.evaluate([child1, child2, child3])).toBe(true);
      });

      it("should evaluate with NONE consideration", () => {
        const rule = new RollupRule(RollupActionType.SATISFIED, RollupConsiderationType.NONE);
        const condition = new RollupCondition(RollupConditionType.COMPLETED);
        rule.addCondition(condition);

        const child1 = new Activity("child1", "Child 1");
        const child2 = new Activity("child2", "Child 2");
        const child3 = new Activity("child3", "Child 3");

        // No children completed
        child1.isCompleted = false;
        child2.isCompleted = false;
        child3.isCompleted = false;
        expect(rule.evaluate([child1, child2, child3])).toBe(true);

        // Some children completed
        child1.isCompleted = true;
        child2.isCompleted = false;
        child3.isCompleted = false;
        expect(rule.evaluate([child1, child2, child3])).toBe(false);

        // All children completed
        child1.isCompleted = true;
        child2.isCompleted = true;
        child3.isCompleted = true;
        expect(rule.evaluate([child1, child2, child3])).toBe(false);
      });

      it("should evaluate with AT_LEAST_COUNT consideration", () => {
        const rule = new RollupRule(
          RollupActionType.SATISFIED,
          RollupConsiderationType.AT_LEAST_COUNT,
          2,
          0,
        );
        const condition = new RollupCondition(RollupConditionType.COMPLETED);
        rule.addCondition(condition);

        const child1 = new Activity("child1", "Child 1");
        const child2 = new Activity("child2", "Child 2");
        const child3 = new Activity("child3", "Child 3");

        // No children completed
        child1.isCompleted = false;
        child2.isCompleted = false;
        child3.isCompleted = false;
        expect(rule.evaluate([child1, child2, child3])).toBe(false);

        // One child completed
        child1.isCompleted = true;
        child2.isCompleted = false;
        child3.isCompleted = false;
        expect(rule.evaluate([child1, child2, child3])).toBe(false);

        // Two children completed
        child1.isCompleted = true;
        child2.isCompleted = true;
        child3.isCompleted = false;
        expect(rule.evaluate([child1, child2, child3])).toBe(true);

        // All children completed
        child1.isCompleted = true;
        child2.isCompleted = true;
        child3.isCompleted = true;
        expect(rule.evaluate([child1, child2, child3])).toBe(true);
      });

      it("should evaluate with AT_LEAST_PERCENT consideration", () => {
        const rule = new RollupRule(
          RollupActionType.SATISFIED,
          RollupConsiderationType.AT_LEAST_PERCENT,
          0,
          60,
        );
        const condition = new RollupCondition(RollupConditionType.COMPLETED);
        rule.addCondition(condition);

        const child1 = new Activity("child1", "Child 1");
        const child2 = new Activity("child2", "Child 2");
        const child3 = new Activity("child3", "Child 3");
        const child4 = new Activity("child4", "Child 4");
        const child5 = new Activity("child5", "Child 5");

        // No children completed (0%)
        child1.isCompleted = false;
        child2.isCompleted = false;
        child3.isCompleted = false;
        child4.isCompleted = false;
        child5.isCompleted = false;
        expect(rule.evaluate([child1, child2, child3, child4, child5])).toBe(false);

        // Two children completed (40%)
        child1.isCompleted = true;
        child2.isCompleted = true;
        child3.isCompleted = false;
        child4.isCompleted = false;
        child5.isCompleted = false;
        expect(rule.evaluate([child1, child2, child3, child4, child5])).toBe(false);

        // Three children completed (60%)
        child1.isCompleted = true;
        child2.isCompleted = true;
        child3.isCompleted = true;
        child4.isCompleted = false;
        child5.isCompleted = false;
        expect(rule.evaluate([child1, child2, child3, child4, child5])).toBe(true);

        // All children completed (100%)
        child1.isCompleted = true;
        child2.isCompleted = true;
        child3.isCompleted = true;
        child4.isCompleted = true;
        child5.isCompleted = true;
        expect(rule.evaluate([child1, child2, child3, child4, child5])).toBe(true);
      });
    });

    describe("toJSON", () => {
      it("should return a JSON representation of the rule", () => {
        const rule = new RollupRule(
          RollupActionType.NOT_SATISFIED,
          RollupConsiderationType.AT_LEAST_COUNT,
          2,
          0,
        );
        const condition = new RollupCondition(RollupConditionType.COMPLETED);

        rule.addCondition(condition);

        const result = rule.toJSON();

        expect(result).toHaveProperty("action", RollupActionType.NOT_SATISFIED);
        expect(result).toHaveProperty("consideration", RollupConsiderationType.AT_LEAST_COUNT);
        expect(result).toHaveProperty("minimumCount", 2);
        expect(result).toHaveProperty("minimumPercent", 0);
        expect(result).toHaveProperty("conditions");
        expect(Array.isArray((result as any).conditions)).toBe(true);
        expect((result as any).conditions.length).toBe(1);
        expect((result as any).conditions[0]).toBe(condition);
      });
    });
  });

  describe("RollupRules", () => {
    describe("constructor", () => {
      it("should initialize with empty rules array", () => {
        const rules = new RollupRules();
        expect(rules.rules).toEqual([]);
      });
    });

    describe("reset", () => {
      it("should reset initialized flag and rules array", () => {
        const rules = new RollupRules();
        rules.initialize();
        rules.addRule(new RollupRule());

        expect(rules.initialized).toBe(true);
        expect(rules.rules.length).toBe(1);

        rules.reset();

        expect(rules.initialized).toBe(false);
        expect(rules.rules.length).toBe(0);
      });
    });

    describe("addRule", () => {
      it("should add a rule to rules", () => {
        const rules = new RollupRules();
        const rule = new RollupRule();

        rules.addRule(rule);

        expect(rules.rules).toContain(rule);
      });

      it("should throw an error if rule is not a RollupRule", () => {
        const rules = new RollupRules();

        expect(() => {
          rules.addRule("not a rule" as any);
        }).toThrow(Scorm2004ValidationError);
      });
    });

    describe("removeRule", () => {
      it("should remove a rule from rules", () => {
        const rules = new RollupRules();
        const rule = new RollupRule();

        rules.addRule(rule);
        const result = rules.removeRule(rule);

        expect(result).toBe(true);
        expect(rules.rules).not.toContain(rule);
      });

      it("should return false if rule is not found", () => {
        const rules = new RollupRules();
        const rule = new RollupRule();

        const result = rules.removeRule(rule);

        expect(result).toBe(false);
      });
    });

    describe("processRollup", () => {
      it("should do nothing if activity has no children", () => {
        const rules = new RollupRules();
        const activity = new Activity("activity", "Activity");

        // Set some initial values
        activity.completionStatus = CompletionStatus.UNKNOWN;
        activity.successStatus = SuccessStatus.UNKNOWN;

        // Process rollup
        rules.processRollup(activity);

        // Values should remain unchanged
        expect(activity.completionStatus).toBe(CompletionStatus.UNKNOWN);
        expect(activity.successStatus).toBe(SuccessStatus.UNKNOWN);
      });

      it("should apply matching rules to set activity status", () => {
        const rules = new RollupRules();
        const activity = new Activity("activity", "Activity");
        const child1 = new Activity("child1", "Child 1");
        const child2 = new Activity("child2", "Child 2");

        activity.addChild(child1);
        activity.addChild(child2);

        // Add a rule for completion
        const completionRule = new RollupRule(
          RollupActionType.COMPLETED,
          RollupConsiderationType.ALL,
        );
        const completionCondition = new RollupCondition(RollupConditionType.COMPLETED);
        completionRule.addCondition(completionCondition);
        rules.addRule(completionRule);

        // Add a rule for success
        const successRule = new RollupRule(RollupActionType.SATISFIED, RollupConsiderationType.ALL);
        const successCondition = new RollupCondition(RollupConditionType.SATISFIED);
        successRule.addCondition(successCondition);
        rules.addRule(successRule);

        // Set child statuses
        child1.isCompleted = true;
        child1.completionStatus = CompletionStatus.COMPLETED;
        child1.successStatus = SuccessStatus.PASSED;

        child2.isCompleted = true;
        child2.completionStatus = CompletionStatus.COMPLETED;
        child2.successStatus = SuccessStatus.PASSED;

        // Process rollup
        rules.processRollup(activity);

        // Activity should be completed and satisfied
        expect(activity.isCompleted).toBe(true);
        expect(activity.completionStatus).toBe(CompletionStatus.COMPLETED);
        expect(activity.successStatus).toBe(SuccessStatus.PASSED);
      });

      it("should use default rollup if no rules match", () => {
        const rules = new RollupRules();
        const activity = new Activity("activity", "Activity");
        const child1 = new Activity("child1", "Child 1");
        const child2 = new Activity("child2", "Child 2");

        activity.addChild(child1);
        activity.addChild(child2);

        // Set child statuses
        child1.isCompleted = true;
        child1.completionStatus = CompletionStatus.COMPLETED;
        child1.successStatus = SuccessStatus.PASSED;

        child2.isCompleted = true;
        child2.completionStatus = CompletionStatus.COMPLETED;
        child2.successStatus = SuccessStatus.PASSED;

        // Process rollup
        rules.processRollup(activity);

        // Activity should be completed and satisfied by default rollup
        expect(activity.isCompleted).toBe(true);
        expect(activity.completionStatus).toBe(CompletionStatus.COMPLETED);
        expect(activity.successStatus).toBe(SuccessStatus.PASSED);
      });
    });

    describe("toJSON", () => {
      it("should return a JSON representation of the rules", () => {
        const rules = new RollupRules();
        const rule = new RollupRule();

        rules.addRule(rule);

        const result = rules.toJSON();

        expect(result).toHaveProperty("rules");
        expect(Array.isArray((result as any).rules)).toBe(true);
        expect((result as any).rules.length).toBe(1);
        expect((result as any).rules[0]).toBe(rule);
      });
    });
  });
});
