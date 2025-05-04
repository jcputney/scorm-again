import { describe, expect, it } from "vitest";
import {
  RuleActionType,
  RuleCondition,
  RuleConditionOperator,
  RuleConditionType,
  SequencingRule,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { SuccessStatus } from "../../../../src/constants/enums";

describe("SequencingRule Edge Cases", () => {
  describe("constructor", () => {
    it("should initialize with default values when no parameters are provided", () => {
      const rule = new SequencingRule();

      expect(rule.action).toBe(RuleActionType.SKIP);
      expect(rule.conditionCombination).toBe(RuleConditionOperator.AND);
      expect(rule.conditions.length).toBe(0);
    });

    it("should initialize with provided values", () => {
      const rule = new SequencingRule(RuleActionType.SKIP, "any");

      expect(rule.action).toBe(RuleActionType.SKIP);
      expect(rule.conditionCombination).toBe("any");
      expect(rule.conditions.length).toBe(0);
    });
  });

  describe("reset", () => {
    it("should reset all properties to their default values", () => {
      const rule = new SequencingRule(RuleActionType.SKIP, "any");
      const condition = new RuleCondition(RuleConditionType.SATISFIED);
      rule.addCondition(condition);

      rule.reset();

      expect(rule.action).toBe(RuleActionType.SKIP);
      expect(rule.conditionCombination).toBe(RuleConditionOperator.AND);
      expect(rule.conditions.length).toBe(0);
    });
  });

  describe("addCondition", () => {
    it("should add a condition to the conditions array", () => {
      const rule = new SequencingRule();
      const condition = new RuleCondition(RuleConditionType.SATISFIED);

      rule.addCondition(condition);

      expect(rule.conditions.length).toBe(1);
      expect(rule.conditions[0]).toBe(condition);
    });

    it("should throw an error if the condition is not a RuleCondition", () => {
      const rule = new SequencingRule();

      // eslint-disable-next-line
      // @ts-ignore - Testing with invalid type
      expect(() => rule.addCondition("not a condition")).toThrow();
    });

    it("should not add duplicate conditions", () => {
      const rule = new SequencingRule();
      const condition = new RuleCondition(RuleConditionType.SATISFIED);

      rule.addCondition(condition);
      rule.addCondition(condition); // Try to add the same condition again

      expect(rule.conditions.length).toBe(1);
    });
  });

  describe("removeCondition", () => {
    it("should remove a condition from the conditions array", () => {
      const rule = new SequencingRule();
      const condition = new RuleCondition(RuleConditionType.SATISFIED);

      rule.addCondition(condition);
      expect(rule.conditions.length).toBe(1);

      rule.removeCondition(condition);
      expect(rule.conditions.length).toBe(0);
    });

    it("should throw an error if the condition is not a RuleCondition", () => {
      const rule = new SequencingRule();

      // eslint-disable-next-line
      // @ts-ignore - Testing with invalid type
      expect(() => rule.removeCondition("not a condition")).toThrow();
    });

    it("should not throw an error if the condition is not in the array", () => {
      const rule = new SequencingRule();
      const condition1 = new RuleCondition(RuleConditionType.SATISFIED);
      const condition2 = new RuleCondition(RuleConditionType.ATTEMPTED);

      rule.addCondition(condition1);

      // Should not throw an error
      expect(() => rule.removeCondition(condition2)).not.toThrow();

      // The array should still contain condition1
      expect(rule.conditions.length).toBe(1);
      expect(rule.conditions[0]).toBe(condition1);
    });
  });

  describe("evaluate", () => {
    it("should return true if there are no conditions", () => {
      const rule = new SequencingRule();
      const activity = new Activity();

      expect(rule.evaluate(activity)).toBe(true);
    });

    it("should evaluate 'all' condition combination correctly", () => {
      const rule = new SequencingRule(RuleActionType.SKIP, "all");
      const activity = new Activity();

      // Add two conditions that will both be true
      const condition1 = new RuleCondition(RuleConditionType.SATISFIED);
      const condition2 = new RuleCondition(RuleConditionType.ATTEMPTED);

      activity.successStatus = SuccessStatus.PASSED;
      activity.incrementAttemptCount();

      rule.addCondition(condition1);
      rule.addCondition(condition2);

      // Both conditions are true, so the rule should evaluate to true
      expect(rule.evaluate(activity)).toBe(true);

      // Make one condition false
      activity.successStatus = SuccessStatus.FAILED;

      // One condition is false, so with 'all' the rule should evaluate to false
      expect(rule.evaluate(activity)).toBe(false);
    });

    it("should evaluate 'any' condition combination correctly", () => {
      const rule = new SequencingRule(RuleActionType.SKIP, "any");
      const activity = new Activity();

      // Add two conditions, one true and one false
      const condition1 = new RuleCondition(RuleConditionType.SATISFIED);
      const condition2 = new RuleCondition(RuleConditionType.ATTEMPTED);

      activity.successStatus = SuccessStatus.PASSED;
      // No attempt increment, so condition2 will be false

      rule.addCondition(condition1);
      rule.addCondition(condition2);

      // One condition is true, so with 'any' the rule should evaluate to true
      expect(rule.evaluate(activity)).toBe(true);

      // Make both conditions false
      activity.successStatus = SuccessStatus.FAILED;

      // Both conditions are false, so the rule should evaluate to false
      expect(rule.evaluate(activity)).toBe(false);
    });

    it("should return false for invalid condition combination", () => {
      const rule = new SequencingRule();
      const activity = new Activity();
      const condition = new RuleCondition(RuleConditionType.SATISFIED);

      activity.successStatus = SuccessStatus.PASSED;
      rule.addCondition(condition);

      // Set an invalid condition combination
      // eslint-disable-next-line
      // @ts-ignore - Testing with invalid value
      rule.conditionCombination = "invalid";

      // Should return false for invalid combination
      expect(rule.evaluate(activity)).toBe(false);
    });
  });

  describe("toJSON", () => {
    it("should return an object with the correct properties", () => {
      const rule = new SequencingRule(RuleActionType.SKIP, "any");
      const condition = new RuleCondition(RuleConditionType.SATISFIED);

      rule.addCondition(condition);

      const json = rule.toJSON() as any;

      expect(json).toHaveProperty("action");
      expect(json).toHaveProperty("conditionCombination");
      expect(json).toHaveProperty("conditions");

      expect(json.action).toBe(RuleActionType.SKIP);
      expect(json.conditionCombination).toBe("any");
      expect(Array.isArray(json.conditions)).toBe(true);
      expect(json.conditions.length).toBe(1);
    });
  });
});
