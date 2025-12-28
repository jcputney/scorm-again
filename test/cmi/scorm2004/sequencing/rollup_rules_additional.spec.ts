// noinspection DuplicatedCode

import { describe, expect, it } from "vitest";
import {
  RollupActionType,
  RollupCondition,
  RollupConditionType,
  RollupConsiderationType,
  RollupRule,
  RollupRules
} from "../../../../src/cmi/scorm2004/sequencing/rollup_rules";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { CompletionStatus, SuccessStatus } from "../../../../src/constants/enums";

describe("Additional RollupRules Tests", () => {
  describe("RollupCondition", () => {
    describe("evaluate", () => {
      it("should evaluate OBJECTIVE_STATUS_KNOWN condition based on satisfaction status being known", () => {
        const condition = new RollupCondition(RollupConditionType.OBJECTIVE_STATUS_KNOWN);
        const activity = new Activity({ id: "test" });

        // Initially, satisfaction status is not known
        expect(condition.evaluate(activity)).toBe(false);

        // Setting satisfied status marks it as known
        activity.objectiveSatisfiedStatus = true;
        expect(condition.evaluate(activity)).toBe(true);

        // Even if satisfaction is false, if it's known, condition is true
        const activity2 = new Activity({ id: "test2" });
        activity2.objectiveSatisfiedStatus = false;
        expect(condition.evaluate(activity2)).toBe(true);
      });

      it("should evaluate OBJECTIVE_MEASURE_KNOWN condition based on measure status", () => {
        const condition = new RollupCondition(RollupConditionType.OBJECTIVE_MEASURE_KNOWN);
        const activity = new Activity({ id: "test" });

        // Measure not known initially
        expect(condition.evaluate(activity)).toBe(false);

        // Setting measure status marks it as known
        activity.objectiveMeasureStatus = true;
        expect(condition.evaluate(activity)).toBe(true);
      });

      it("should distinguish between OBJECTIVE_STATUS_KNOWN and OBJECTIVE_MEASURE_KNOWN", () => {
        const statusCondition = new RollupCondition(RollupConditionType.OBJECTIVE_STATUS_KNOWN);
        const measureCondition = new RollupCondition(RollupConditionType.OBJECTIVE_MEASURE_KNOWN);
        const activity = new Activity({ id: "test" });

        // Set satisfaction status but not measure status
        activity.objectiveSatisfiedStatus = true;
        expect(statusCondition.evaluate(activity)).toBe(true);  // Status IS known
        expect(measureCondition.evaluate(activity)).toBe(false); // Measure NOT known

        // Now set measure status
        activity.objectiveMeasureStatus = true;
        expect(statusCondition.evaluate(activity)).toBe(true);  // Status still known
        expect(measureCondition.evaluate(activity)).toBe(true); // Measure now known
      });

      it("should evaluate OBJECTIVE_MEASURE_LESS_THAN condition", () => {
        const parameters = new Map([["threshold", 0.5]]);
        const condition = new RollupCondition(
          RollupConditionType.OBJECTIVE_MEASURE_LESS_THAN,
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
        const condition = new RollupCondition(RollupConditionType.PROGRESS_KNOWN);
        const activity = new Activity();

        activity.completionStatus = CompletionStatus.COMPLETED;
        expect(condition.evaluate(activity)).toBe(true);

        activity.completionStatus = CompletionStatus.INCOMPLETE;
        expect(condition.evaluate(activity)).toBe(true);

        activity.completionStatus = CompletionStatus.UNKNOWN;
        expect(condition.evaluate(activity)).toBe(false);
      });
    });
  });

  describe("RollupRule", () => {
    describe("setters", () => {
      it("should set action", () => {
        const rule = new RollupRule();

        rule.action = RollupActionType.NOT_SATISFIED;
        expect(rule.action).toBe(RollupActionType.NOT_SATISFIED);

        rule.action = RollupActionType.COMPLETED;
        expect(rule.action).toBe(RollupActionType.COMPLETED);

        rule.action = RollupActionType.INCOMPLETE;
        expect(rule.action).toBe(RollupActionType.INCOMPLETE);
      });

      it("should set consideration", () => {
        const rule = new RollupRule();

        rule.consideration = RollupConsiderationType.ANY;
        expect(rule.consideration).toBe(RollupConsiderationType.ANY);

        rule.consideration = RollupConsiderationType.NONE;
        expect(rule.consideration).toBe(RollupConsiderationType.NONE);

        rule.consideration = RollupConsiderationType.AT_LEAST_COUNT;
        expect(rule.consideration).toBe(RollupConsiderationType.AT_LEAST_COUNT);

        rule.consideration = RollupConsiderationType.AT_LEAST_PERCENT;
        expect(rule.consideration).toBe(RollupConsiderationType.AT_LEAST_PERCENT);
      });

      it("should set minimumCount with validation", () => {
        const rule = new RollupRule();

        rule.minimumCount = 5;
        expect(rule.minimumCount).toBe(5);

        rule.minimumCount = 0;
        expect(rule.minimumCount).toBe(0);

        // Negative values should be ignored
        rule.minimumCount = -1;
        expect(rule.minimumCount).toBe(0); // Should remain at previous value
      });

      it("should set minimumPercent with validation", () => {
        const rule = new RollupRule();

        rule.minimumPercent = 50;
        expect(rule.minimumPercent).toBe(50);

        rule.minimumPercent = 0;
        expect(rule.minimumPercent).toBe(0);

        rule.minimumPercent = 100;
        expect(rule.minimumPercent).toBe(100);

        // Values outside 0-100 range should be ignored
        rule.minimumPercent = -1;
        expect(rule.minimumPercent).toBe(100); // Should remain at previous value

        rule.minimumPercent = 101;
        expect(rule.minimumPercent).toBe(100); // Should remain at previous value
      });
    });
  });

  describe("RollupRules", () => {
    describe("default rollup behavior", () => {
      it("should handle partial completion in default rollup", () => {
        const rules = new RollupRules();
        const activity = new Activity("activity", "Activity");
        const child1 = new Activity("child1", "Child 1");
        const child2 = new Activity("child2", "Child 2");
        const child3 = new Activity("child3", "Child 3");

        activity.addChild(child1);
        activity.addChild(child2);
        activity.addChild(child3);

        // Set some children as completed, some as incomplete
        child1.isCompleted = true;
        child1.completionStatus = CompletionStatus.COMPLETED;

        child2.isCompleted = false;
        child2.completionStatus = CompletionStatus.INCOMPLETE;

        child3.isCompleted = true;
        child3.completionStatus = CompletionStatus.COMPLETED;

        // Process rollup
        rules.processRollup(activity);

        // Activity should be marked as incomplete because at least one child is incomplete
        expect(activity.isCompleted).toBe(false);
        expect(activity.completionStatus).toBe(CompletionStatus.INCOMPLETE);
      });

      it("should handle partial success in default rollup", () => {
        const rules = new RollupRules();
        const activity = new Activity("activity", "Activity");
        const child1 = new Activity("child1", "Child 1");
        const child2 = new Activity("child2", "Child 2");
        const child3 = new Activity("child3", "Child 3");

        activity.addChild(child1);
        activity.addChild(child2);
        activity.addChild(child3);

        // Set some children as passed, some as failed
        child1.successStatus = SuccessStatus.PASSED;
        child2.successStatus = SuccessStatus.FAILED;
        child3.successStatus = SuccessStatus.PASSED;

        // Process rollup
        rules.processRollup(activity);

        // Activity should be marked as failed because at least one child is failed
        expect(activity.successStatus).toBe(SuccessStatus.FAILED);
      });

      it("should not change status if no children have definitive status", () => {
        const rules = new RollupRules();
        const activity = new Activity("activity", "Activity");
        const child1 = new Activity("child1", "Child 1");
        const child2 = new Activity("child2", "Child 2");

        activity.addChild(child1);
        activity.addChild(child2);

        // Set initial activity status
        activity.completionStatus = CompletionStatus.UNKNOWN;
        activity.successStatus = SuccessStatus.UNKNOWN;

        // Children have unknown status
        child1.completionStatus = CompletionStatus.UNKNOWN;
        child1.successStatus = SuccessStatus.UNKNOWN;

        child2.completionStatus = CompletionStatus.UNKNOWN;
        child2.successStatus = SuccessStatus.UNKNOWN;

        // Process rollup
        rules.processRollup(activity);

        // Activity status should remain unchanged
        expect(activity.completionStatus).toBe(CompletionStatus.UNKNOWN);
        expect(activity.successStatus).toBe(SuccessStatus.UNKNOWN);
      });

      it("should mark activity as completed when all children are completed", () => {
        const rules = new RollupRules();
        const activity = new Activity("activity", "Activity");
        const child1 = new Activity("child1", "Child 1");
        const child2 = new Activity("child2", "Child 2");
        const child3 = new Activity("child3", "Child 3");

        activity.addChild(child1);
        activity.addChild(child2);
        activity.addChild(child3);

        // Set all children as completed
        child1.isCompleted = true;
        child1.completionStatus = CompletionStatus.COMPLETED;

        child2.isCompleted = true;
        child2.completionStatus = CompletionStatus.COMPLETED;

        child3.isCompleted = true;
        child3.completionStatus = CompletionStatus.COMPLETED;

        // Process rollup
        rules.processRollup(activity);

        // Activity should be marked as completed because all children are completed
        expect(activity.isCompleted).toBe(true);
        expect(activity.completionStatus).toBe(CompletionStatus.COMPLETED);
      });

      it("should mark activity as passed when all children are passed", () => {
        const rules = new RollupRules();
        const activity = new Activity("activity", "Activity");
        const child1 = new Activity("child1", "Child 1");
        const child2 = new Activity("child2", "Child 2");
        const child3 = new Activity("child3", "Child 3");

        activity.addChild(child1);
        activity.addChild(child2);
        activity.addChild(child3);

        // Set all children as passed
        child1.successStatus = SuccessStatus.PASSED;
        child2.successStatus = SuccessStatus.PASSED;
        child3.successStatus = SuccessStatus.PASSED;

        // Process rollup
        rules.processRollup(activity);

        // Activity should be marked as passed because all children are passed
        expect(activity.successStatus).toBe(SuccessStatus.PASSED);
      });
    });
  });
});
