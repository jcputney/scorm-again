import { describe, expect, it } from "vitest";
import {
  RuleCondition,
  RuleConditionOperator,
  RuleConditionType,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";

describe("RuleCondition Edge Cases", () => {
  describe("constructor", () => {
    it("should initialize with default values when no parameters are provided", () => {
      const condition = new RuleCondition(RuleConditionType.SATISFIED);

      expect(condition.condition).toBe(RuleConditionType.SATISFIED);
      expect(condition.operator).toBe(null);
      expect(condition.parameters.size).toBe(0);
    });

    it("should initialize with provided values", () => {
      const parameters = new Map([["threshold", 0.5]]);
      const condition = new RuleCondition(
        RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN,
        RuleConditionOperator.NOT,
        parameters,
      );

      expect(condition.condition).toBe(RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN);
      expect(condition.operator).toBe(RuleConditionOperator.NOT);
      expect(condition.parameters).toBe(parameters);
      expect(condition.parameters.get("threshold")).toBe(0.5);
    });
  });

  describe("reset", () => {
    it("should reset all properties to their default values", () => {
      const parameters = new Map([["threshold", 0.5]]);
      const condition = new RuleCondition(
        RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN,
        RuleConditionOperator.NOT,
        parameters,
      );

      condition.reset();

      expect(condition.condition).toBe(RuleConditionType.ALWAYS);
      expect(condition.operator).toBe(null);
      expect(condition.parameters.size).toBe(0);
    });
  });

  describe("evaluate", () => {
    it("should handle OBJECTIVE_MEASURE_GREATER_THAN with edge case values", () => {
      const parameters = new Map([["threshold", 0]]);
      const condition = new RuleCondition(
        RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN,
        null,
        parameters,
      );
      const activity = new Activity();

      // Test with measure equal to threshold (should be false)
      activity.objectiveMeasureStatus = true;
      activity.objectiveNormalizedMeasure = 0;
      expect(condition.evaluate(activity)).toBe(false);

      // Test with measure slightly greater than threshold
      activity.objectiveNormalizedMeasure = 0.0001;
      expect(condition.evaluate(activity)).toBe(true);

      // Test with negative threshold
      const negativeParams = new Map([["threshold", -0.5]]);
      const negativeCondition = new RuleCondition(
        RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN,
        null,
        negativeParams,
      );

      activity.objectiveNormalizedMeasure = -0.4;
      expect(negativeCondition.evaluate(activity)).toBe(true);

      activity.objectiveNormalizedMeasure = -0.6;
      expect(negativeCondition.evaluate(activity)).toBe(false);
    });

    it("should handle OBJECTIVE_MEASURE_LESS_THAN with edge case values", () => {
      const parameters = new Map([["threshold", 0]]);
      const condition = new RuleCondition(
        RuleConditionType.OBJECTIVE_MEASURE_LESS_THAN,
        null,
        parameters,
      );
      const activity = new Activity();

      // Test with measure equal to threshold (should be false)
      activity.objectiveMeasureStatus = true;
      activity.objectiveNormalizedMeasure = 0;
      expect(condition.evaluate(activity)).toBe(false);

      // Test with measure slightly less than threshold
      activity.objectiveNormalizedMeasure = -0.0001;
      expect(condition.evaluate(activity)).toBe(true);

      // Test with negative threshold
      const negativeParams = new Map([["threshold", -0.5]]);
      const negativeCondition = new RuleCondition(
        RuleConditionType.OBJECTIVE_MEASURE_LESS_THAN,
        null,
        negativeParams,
      );

      activity.objectiveNormalizedMeasure = -0.6;
      expect(negativeCondition.evaluate(activity)).toBe(true);

      activity.objectiveNormalizedMeasure = -0.4;
      expect(negativeCondition.evaluate(activity)).toBe(false);
    });

    it("should handle ATTEMPT_LIMIT_EXCEEDED with edge case values", () => {
      // SCORM 2004 specifies attemptLimit is a property of the activity itself
      const condition = new RuleCondition(RuleConditionType.ATTEMPT_LIMIT_EXCEEDED);
      const activity = new Activity();
      activity.attemptLimit = 0;

      // Test with attemptCount equal to 0 (should be true since 0 >= 0)
      expect(condition.evaluate(activity)).toBe(true);

      // Test with negative attemptLimit (invalid but should be handled)
      activity.attemptLimit = -1;

      // Any attempt count should exceed a negative limit
      expect(condition.evaluate(activity)).toBe(true);

      activity.incrementAttemptCount();
      expect(condition.evaluate(activity)).toBe(true);
    });

    it("should handle missing parameters for conditions that require them", () => {
      // Test OBJECTIVE_MEASURE_GREATER_THAN without threshold parameter
      const greaterThanCondition = new RuleCondition(
        RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN,
      );
      const activity = new Activity();

      activity.objectiveMeasureStatus = true;
      activity.objectiveNormalizedMeasure = 0.5;

      // Should use default threshold of 0
      expect(greaterThanCondition.evaluate(activity)).toBe(true);

      // Test OBJECTIVE_MEASURE_LESS_THAN without threshold parameter
      const lessThanCondition = new RuleCondition(RuleConditionType.OBJECTIVE_MEASURE_LESS_THAN);

      activity.objectiveNormalizedMeasure = -0.5;

      // Should use default threshold of 0
      expect(lessThanCondition.evaluate(activity)).toBe(true);

      // Test ATTEMPT_LIMIT_EXCEEDED without attemptLimit on activity
      const attemptLimitCondition = new RuleCondition(RuleConditionType.ATTEMPT_LIMIT_EXCEEDED);

      // SCORM 2004: When no attemptLimit is set on activity, condition returns false
      // (Activity.hasAttemptLimitExceeded() returns false when _attemptLimit is null)
      expect(attemptLimitCondition.evaluate(activity)).toBe(false);
    });

    it("should handle non-boolean objectiveMeasureStatus values", () => {
      const condition = new RuleCondition(RuleConditionType.OBJECTIVE_MEASURE_KNOWN);
      const activity = new Activity();

      // Test with undefined
      // eslint-disable-next-line
      // @ts-ignore
      activity.objectiveMeasureStatus = undefined;
      expect(condition.evaluate(activity)).toBe(false);

      // Test with null
      // eslint-disable-next-line
      // @ts-ignore
      activity.objectiveMeasureStatus = null;
      expect(condition.evaluate(activity)).toBe(false);

      // Test with truthy non-boolean
      // eslint-disable-next-line
      // @ts-ignore - Testing with invalid type
      activity.objectiveMeasureStatus = 1;
      expect(condition.evaluate(activity)).toBe(true);

      // Test with falsy non-boolean
      // eslint-disable-next-line
      // @ts-ignore - Testing with invalid type
      activity.objectiveMeasureStatus = 0;
      expect(condition.evaluate(activity)).toBe(false);
    });
  });

  describe("toJSON", () => {
    it("should return an object with the correct properties", () => {
      const parameters = new Map([["threshold", 0.5]]);
      const condition = new RuleCondition(
        RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN,
        RuleConditionOperator.NOT,
        parameters,
      );

      const json = condition.toJSON() as any;

      expect(json).toHaveProperty("condition");
      expect(json).toHaveProperty("operator");
      expect(json).toHaveProperty("parameters");

      expect(json.condition).toBe(RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN);
      expect(json.operator).toBe(RuleConditionOperator.NOT);
      expect(json.parameters).toEqual({ threshold: 0.5 });
    });

    it("should handle empty parameters", () => {
      const condition = new RuleCondition(RuleConditionType.SATISFIED);

      const json = condition.toJSON() as any;

      expect(json).toHaveProperty("parameters");
      expect(json.parameters).toEqual({});
    });
  });
});
