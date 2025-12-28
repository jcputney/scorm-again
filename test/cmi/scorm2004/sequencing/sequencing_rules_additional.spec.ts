// noinspection DuplicatedCode

import { describe, expect, it } from "vitest";
import {
  RuleCondition,
  RuleConditionOperator,
  RuleConditionType,
  SequencingRule
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { CompletionStatus } from "../../../../src/constants/enums";

describe("Additional SequencingRules Tests", () => {
  describe("RuleCondition", () => {
    describe("evaluate", () => {
      it("should evaluate OBJECTIVE_STATUS_KNOWN condition", () => {
        const condition = new RuleCondition(RuleConditionType.OBJECTIVE_STATUS_KNOWN);
        const activity = new Activity();

        activity.objectiveMeasureStatus = true;
        expect(condition.evaluate(activity)).toBe(true);

        activity.objectiveMeasureStatus = false;
        expect(condition.evaluate(activity)).toBe(false);
      });

      it("should evaluate OBJECTIVE_MEASURE_KNOWN condition", () => {
        const condition = new RuleCondition(RuleConditionType.OBJECTIVE_MEASURE_KNOWN);
        const activity = new Activity();

        activity.objectiveMeasureStatus = true;
        expect(condition.evaluate(activity)).toBe(true);

        activity.objectiveMeasureStatus = false;
        expect(condition.evaluate(activity)).toBe(false);
      });

      it("should evaluate OBJECTIVE_MEASURE_LESS_THAN condition", () => {
        const parameters = new Map([["threshold", 0.5]]);
        const condition = new RuleCondition(
          RuleConditionType.OBJECTIVE_MEASURE_LESS_THAN,
          null,
          parameters
        );
        const activity = new Activity();

        activity.objectiveMeasureStatus = true;
        activity.objectiveNormalizedMeasure = 0.3;
        expect(condition.evaluate(activity)).toBe(true);

        activity.objectiveNormalizedMeasure = 0.5;
        expect(condition.evaluate(activity)).toBe(false);

        activity.objectiveNormalizedMeasure = 0.7;
        expect(condition.evaluate(activity)).toBe(false);

        activity.objectiveMeasureStatus = false;
        activity.objectiveNormalizedMeasure = 0.3;
        expect(condition.evaluate(activity)).toBe(false);
      });

      it("should evaluate PROGRESS_KNOWN condition", () => {
        const condition = new RuleCondition(RuleConditionType.PROGRESS_KNOWN);
        const activity = new Activity();

        activity.completionStatus = CompletionStatus.COMPLETED;
        expect(condition.evaluate(activity)).toBe(true);

        activity.completionStatus = CompletionStatus.INCOMPLETE;
        expect(condition.evaluate(activity)).toBe(true);

        activity.completionStatus = CompletionStatus.UNKNOWN;
        expect(condition.evaluate(activity)).toBe(false);
      });

      it("should evaluate ATTEMPTED condition", () => {
        const condition = new RuleCondition(RuleConditionType.ATTEMPTED);
        const activity = new Activity();

        expect(condition.evaluate(activity)).toBe(false); // Default attemptCount is 0

        activity.incrementAttemptCount();
        expect(condition.evaluate(activity)).toBe(true);
      });

      it("should evaluate ATTEMPT_LIMIT_EXCEEDED condition", () => {
        // SCORM 2004 specifies that attemptLimit is a property of the activity,
        // set via <imsss:limitConditions attemptLimit="2"/> in the manifest
        const condition = new RuleCondition(RuleConditionType.ATTEMPT_LIMIT_EXCEEDED);
        const activity = new Activity();
        activity.attemptLimit = 2;

        expect(condition.evaluate(activity)).toBe(false); // Default attemptCount is 0

        activity.incrementAttemptCount();
        expect(condition.evaluate(activity)).toBe(false); // 1 < 2

        activity.incrementAttemptCount();
        expect(condition.evaluate(activity)).toBe(true); // 2 >= 2

        activity.incrementAttemptCount();
        expect(condition.evaluate(activity)).toBe(true); // 3 > 2
      });

      it("should evaluate TIME_LIMIT_EXCEEDED condition", () => {
        const condition = new RuleCondition(RuleConditionType.TIME_LIMIT_EXCEEDED);
        const activity = new Activity();

        // This condition is not implemented and always returns false
        expect(condition.evaluate(activity)).toBe(false);
      });

      it("should evaluate OUTSIDE_AVAILABLE_TIME_RANGE condition", () => {
        const condition = new RuleCondition(RuleConditionType.OUTSIDE_AVAILABLE_TIME_RANGE);
        const activity = new Activity();

        // This condition is not implemented and always returns false
        expect(condition.evaluate(activity)).toBe(false);
      });

      it("should apply NOT operator to condition result", () => {
        const condition = new RuleCondition(RuleConditionType.SATISFIED, RuleConditionOperator.NOT);
        const activity = new Activity();

        // Without NOT, this would be false
        activity.successStatus = "failed";
        expect(condition.evaluate(activity)).toBe(true);

        // Without NOT, this would be true
        activity.successStatus = "passed";
        expect(condition.evaluate(activity)).toBe(false);
      });

      it("should handle unknown condition types", () => {
        // eslint-disable-next-line
        // @ts-ignore - Testing with invalid condition type
        const condition = new RuleCondition("unknownCondition");
        const activity = new Activity();

        expect(condition.evaluate(activity)).toBe(false);
      });
    });
  });

  describe("SequencingRule", () => {
    describe("evaluate", () => {
      it("should return false if conditionCombination is neither AND nor OR", () => {
        const rule = new SequencingRule();
        const activity = new Activity();
        const condition = new RuleCondition(RuleConditionType.SATISFIED);

        rule.addCondition(condition);

        // eslint-disable-next-line
        // @ts-ignore - Setting invalid condition combination for testing
        rule.conditionCombination = "invalid";

        expect(rule.evaluate(activity)).toBe(false);
      });
    });
  });
});
