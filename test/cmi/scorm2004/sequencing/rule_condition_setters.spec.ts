import { describe, expect, it } from "vitest";
import {
  RuleCondition,
  RuleConditionOperator,
  RuleConditionType
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";

describe("RuleCondition Setters", () => {
  describe("condition setter", () => {
    it("should set the condition property", () => {
      const condition = new RuleCondition();

      // Initial value should be ALWAYS (default)
      expect(condition.condition).toBe(RuleConditionType.ALWAYS);

      // Set to a new value
      condition.condition = RuleConditionType.SATISFIED;
      expect(condition.condition).toBe(RuleConditionType.SATISFIED);

      // Set to another value
      condition.condition = RuleConditionType.COMPLETED;
      expect(condition.condition).toBe(RuleConditionType.COMPLETED);
    });
  });

  describe("operator setter", () => {
    it("should set the operator property", () => {
      const condition = new RuleCondition();

      // Initial value should be null (default)
      expect(condition.operator).toBe(null);

      // Set to a new value
      condition.operator = RuleConditionOperator.NOT;
      expect(condition.operator).toBe(RuleConditionOperator.NOT);

      // Set to another value
      condition.operator = RuleConditionOperator.AND;
      expect(condition.operator).toBe(RuleConditionOperator.AND);

      // Set back to null
      condition.operator = null;
      expect(condition.operator).toBe(null);
    });
  });

  describe("parameters setter", () => {
    it("should set the parameters property", () => {
      const condition = new RuleCondition();

      // Initial value should be an empty Map (default)
      expect(condition.parameters.size).toBe(0);

      // Set to a new Map with values
      const params1 = new Map([["threshold", 0.5]]);
      condition.parameters = params1;
      expect(condition.parameters).toBe(params1);
      expect(condition.parameters.get("threshold")).toBe(0.5);

      // Set to another Map with different values
      const params2 = new Map([["attemptLimit", 3]]);
      condition.parameters = params2;
      expect(condition.parameters).toBe(params2);
      expect(condition.parameters.get("attemptLimit")).toBe(3);
      expect(condition.parameters.has("threshold")).toBe(false);

      // Set to an empty Map
      const emptyParams = new Map();
      condition.parameters = emptyParams;
      expect(condition.parameters).toBe(emptyParams);
      expect(condition.parameters.size).toBe(0);
    });
  });

  describe("interaction between setters and evaluate", () => {
    it("should use updated condition in evaluate", () => {
      const condition = new RuleCondition(RuleConditionType.ALWAYS);
      const activity = {
        successStatus: "passed",
        isCompleted: false
      } as any;

      // With ALWAYS, evaluate should return true
      expect(condition.evaluate(activity)).toBe(true);

      // Change to COMPLETED, evaluate should return false
      condition.condition = RuleConditionType.COMPLETED;
      expect(condition.evaluate(activity)).toBe(false);

      // Change activity to be completed
      activity.isCompleted = true;
      expect(condition.evaluate(activity)).toBe(true);
    });

    it("should use updated operator in evaluate", () => {
      const condition = new RuleCondition(RuleConditionType.COMPLETED);
      const activity = {
        isCompleted: true
      } as any;

      // Without operator, evaluate should return true for completed activity
      expect(condition.evaluate(activity)).toBe(true);

      // With NOT operator, evaluate should return false
      condition.operator = RuleConditionOperator.NOT;
      expect(condition.evaluate(activity)).toBe(false);
    });

    it("should use updated parameters in evaluate", () => {
      const condition = new RuleCondition(
        RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN,
        null,
        new Map([["threshold", 0.5]])
      );
      const activity = {
        objectiveMeasureStatus: true,
        objectiveNormalizedMeasure: 0.4
      } as any;

      // With threshold 0.5, evaluate should return false for measure 0.4
      expect(condition.evaluate(activity)).toBe(false);

      // Update threshold to 0.3
      condition.parameters = new Map([["threshold", 0.3]]);

      // Now evaluate should return true
      expect(condition.evaluate(activity)).toBe(true);
    });
  });
});
