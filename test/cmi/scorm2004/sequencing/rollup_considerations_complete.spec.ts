import { beforeEach, describe, expect, it } from "vitest";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import {
  RollupActionType,
  RollupCondition,
  RollupConditionType,
  RollupConsiderationType,
  RollupRule
} from "../../../../src/cmi/scorm2004/sequencing/rollup_rules";
import { CompletionStatus, SuccessStatus } from "../../../../src/constants/enums";

/**
 * Comprehensive test suite for SCORM 2004 Rollup Considerations (RB.1.4)
 * Tests individual child activity consideration settings and their effect on rollup
 */
describe("Rollup Considerations Complete (RB.1.4)", () => {
  let rollupProcess: RollupProcess;
  let parent: Activity;
  let child1: Activity;
  let child2: Activity;
  let child3: Activity;

  beforeEach(() => {
    rollupProcess = new RollupProcess();

    // Create activity tree
    parent = new Activity("parent", "Parent Activity");
    child1 = new Activity("child1", "Child 1");
    child2 = new Activity("child2", "Child 2");
    child3 = new Activity("child3", "Child 3");

    parent.addChild(child1);
    parent.addChild(child2);
    parent.addChild(child3);

    // Enable rollup on parent
    parent.sequencingControls.rollupObjectiveSatisfied = true;
    parent.sequencingControls.rollupProgressCompletion = true;

    // Enable rollup tracking on all children
    child1.sequencingControls.rollupObjectiveSatisfied = true;
    child1.sequencingControls.rollupProgressCompletion = true;
    child2.sequencingControls.rollupObjectiveSatisfied = true;
    child2.sequencingControls.rollupProgressCompletion = true;
    child3.sequencingControls.rollupObjectiveSatisfied = true;
    child3.sequencingControls.rollupProgressCompletion = true;
  });

  describe("requiredForSatisfied consideration", () => {
    it("should include all children with 'always' (default)", () => {
      // All children default to "always"
      child1.objectiveSatisfiedStatus = true;
      child1.attemptCount = 1;
      child2.objectiveSatisfiedStatus = true;
      child2.attemptCount = 1;
      child3.objectiveSatisfiedStatus = true;
      child3.attemptCount = 1;

      rollupProcess.overallRollupProcess(child1);

      expect(parent.objectiveSatisfiedStatus).toBe(true);
    });

    it("should exclude unattempted children with 'ifAttempted'", () => {
      // Child1 and Child2 are satisfied and attempted
      child1.requiredForSatisfied = "ifAttempted";
      child1.objectiveSatisfiedStatus = true;
      child1.attemptProgressStatus = true;
      child1.attemptCount = 1;

      child2.requiredForSatisfied = "ifAttempted";
      child2.objectiveSatisfiedStatus = true;
      child2.attemptProgressStatus = true;
      child2.attemptCount = 1;

      // Child3 is satisfied but NOT attempted
      child3.requiredForSatisfied = "ifAttempted";
      child3.objectiveSatisfiedStatus = true;
      child3.attemptProgressStatus = false;
      child3.attemptCount = 0;

      rollupProcess.overallRollupProcess(child1);

      // Parent should be satisfied because child3 is excluded from rollup
      expect(parent.objectiveSatisfiedStatus).toBe(true);
    });

    it("should include unattempted child that fails 'ifAttempted' consideration", () => {
      // Child1 is satisfied and attempted
      child1.requiredForSatisfied = "ifAttempted";
      child1.objectiveSatisfiedStatus = true;
      child1.attemptProgressStatus = true;
      child1.attemptCount = 1;

      // Child2 is NOT satisfied and attempted
      child2.requiredForSatisfied = "ifAttempted";
      child2.objectiveSatisfiedStatus = false;
      child2.attemptProgressStatus = true;
      child2.attemptCount = 1;

      // Child3 is unattempted (excluded from rollup)
      child3.requiredForSatisfied = "ifAttempted";
      child3.objectiveSatisfiedStatus = true;
      child3.attemptProgressStatus = false;
      child3.attemptCount = 0;

      rollupProcess.overallRollupProcess(child1);

      // Parent should NOT be satisfied because child2 is not satisfied
      expect(parent.objectiveSatisfiedStatus).toBe(false);
    });

    it("should exclude suspended children with 'ifNotSuspended'", () => {
      // Child1 is satisfied and not suspended
      child1.requiredForSatisfied = "ifNotSuspended";
      child1.objectiveSatisfiedStatus = true;
      child1.attemptProgressStatus = true;
      child1.attemptCount = 1;
      child1.isSuspended = false;

      // Child2 is satisfied but suspended
      child2.requiredForSatisfied = "ifNotSuspended";
      child2.objectiveSatisfiedStatus = true;
      child2.attemptProgressStatus = true;
      child2.attemptCount = 1;
      child2.isSuspended = true;

      // Child3 is satisfied and not suspended
      child3.requiredForSatisfied = "ifNotSuspended";
      child3.objectiveSatisfiedStatus = true;
      child3.attemptProgressStatus = true;
      child3.attemptCount = 1;
      child3.isSuspended = false;

      rollupProcess.overallRollupProcess(child1);

      // Parent should be satisfied (child2 is excluded)
      expect(parent.objectiveSatisfiedStatus).toBe(true);
    });

    it("should exclude skipped children with 'ifNotSkipped'", () => {
      // Child1 is satisfied and not skipped
      child1.requiredForSatisfied = "ifNotSkipped";
      child1.objectiveSatisfiedStatus = true;
      child1.attemptCount = 1;
      child1.wasSkipped = false;

      // Child2 is satisfied but skipped
      child2.requiredForSatisfied = "ifNotSkipped";
      child2.objectiveSatisfiedStatus = true;
      child2.attemptCount = 1;
      child2.wasSkipped = true;

      // Child3 is satisfied and not skipped
      child3.requiredForSatisfied = "ifNotSkipped";
      child3.objectiveSatisfiedStatus = true;
      child3.attemptCount = 1;
      child3.wasSkipped = false;

      rollupProcess.overallRollupProcess(child1);

      // Parent should be satisfied (child2 is excluded)
      expect(parent.objectiveSatisfiedStatus).toBe(true);
    });
  });

  describe("requiredForNotSatisfied consideration", () => {
    it("should use 'ifAttempted' for notSatisfied evaluation", () => {
      // Child1 is satisfied
      child1.requiredForNotSatisfied = "ifAttempted";
      child1.objectiveSatisfiedStatus = true;
      child1.attemptProgressStatus = true;
      child1.attemptCount = 1;

      // Child2 is NOT satisfied and attempted
      child2.requiredForNotSatisfied = "ifAttempted";
      child2.objectiveSatisfiedStatus = false;
      child2.attemptProgressStatus = true;
      child2.attemptCount = 1;

      // Child3 is NOT satisfied but unattempted (excluded from notSatisfied check)
      child3.requiredForNotSatisfied = "ifAttempted";
      child3.objectiveSatisfiedStatus = false;
      child3.attemptProgressStatus = false;
      child3.attemptCount = 0;

      rollupProcess.overallRollupProcess(child1);

      // Parent should be NOT satisfied because child2 is not satisfied
      expect(parent.objectiveSatisfiedStatus).toBe(false);
    });

    it("should exclude suspended children from notSatisfied check with 'ifNotSuspended'", () => {
      // All children satisfied
      child1.requiredForNotSatisfied = "ifNotSuspended";
      child1.objectiveSatisfiedStatus = true;
      child1.attemptProgressStatus = true;
      child1.attemptCount = 1;

      child2.requiredForNotSatisfied = "ifNotSuspended";
      child2.objectiveSatisfiedStatus = true;
      child2.attemptProgressStatus = true;
      child2.attemptCount = 1;

      // Child3 NOT satisfied but suspended (excluded)
      child3.requiredForNotSatisfied = "ifNotSuspended";
      child3.objectiveSatisfiedStatus = false;
      child3.attemptProgressStatus = true;
      child3.attemptCount = 1;
      child3.isSuspended = true;

      rollupProcess.overallRollupProcess(child1);

      // Parent should be satisfied (child3 excluded from notSatisfied check)
      expect(parent.objectiveSatisfiedStatus).toBe(true);
    });
  });

  describe("requiredForCompleted consideration", () => {
    it("should include all children with 'always' (default)", () => {
      child1.completionStatus = CompletionStatus.COMPLETED;
      child1.attemptCount = 1;
      child2.completionStatus = CompletionStatus.COMPLETED;
      child2.attemptCount = 1;
      child3.completionStatus = CompletionStatus.COMPLETED;
      child3.attemptCount = 1;

      rollupProcess.overallRollupProcess(child1);

      expect(parent.completionStatus).toBe(CompletionStatus.COMPLETED);
    });

    it("should exclude unattempted children with 'ifAttempted'", () => {
      // Child1 and Child2 completed and attempted
      child1.requiredForCompleted = "ifAttempted";
      child1.completionStatus = CompletionStatus.COMPLETED;
      child1.attemptProgressStatus = true;
      child1.attemptCount = 1;

      child2.requiredForCompleted = "ifAttempted";
      child2.completionStatus = CompletionStatus.COMPLETED;
      child2.attemptProgressStatus = true;
      child2.attemptCount = 1;

      // Child3 completed but NOT attempted (excluded)
      child3.requiredForCompleted = "ifAttempted";
      child3.completionStatus = CompletionStatus.COMPLETED;
      child3.attemptProgressStatus = false;
      child3.attemptCount = 0;

      rollupProcess.overallRollupProcess(child1);

      // Parent should be completed (child3 excluded)
      expect(parent.completionStatus).toBe(CompletionStatus.COMPLETED);
    });

    it("should exclude suspended children with 'ifNotSuspended'", () => {
      // Child1 completed and not suspended
      child1.requiredForCompleted = "ifNotSuspended";
      child1.completionStatus = CompletionStatus.COMPLETED;
      child1.attemptProgressStatus = true;
      child1.attemptCount = 1;
      child1.isSuspended = false;

      // Child2 completed but suspended (excluded)
      child2.requiredForCompleted = "ifNotSuspended";
      child2.completionStatus = CompletionStatus.COMPLETED;
      child2.attemptProgressStatus = true;
      child2.attemptCount = 1;
      child2.isSuspended = true;

      // Child3 completed and not suspended
      child3.requiredForCompleted = "ifNotSuspended";
      child3.completionStatus = CompletionStatus.COMPLETED;
      child3.attemptProgressStatus = true;
      child3.attemptCount = 1;
      child3.isSuspended = false;

      rollupProcess.overallRollupProcess(child1);

      // Parent should be completed (child2 excluded)
      expect(parent.completionStatus).toBe(CompletionStatus.COMPLETED);
    });

    it("should exclude skipped children with 'ifNotSkipped'", () => {
      // Child1 completed and not skipped
      child1.requiredForCompleted = "ifNotSkipped";
      child1.completionStatus = CompletionStatus.COMPLETED;
      child1.attemptCount = 1;
      child1.wasSkipped = false;

      // Child2 completed but skipped (excluded)
      child2.requiredForCompleted = "ifNotSkipped";
      child2.completionStatus = CompletionStatus.COMPLETED;
      child2.attemptCount = 1;
      child2.wasSkipped = true;

      // Child3 completed and not skipped
      child3.requiredForCompleted = "ifNotSkipped";
      child3.completionStatus = CompletionStatus.COMPLETED;
      child3.attemptCount = 1;
      child3.wasSkipped = false;

      rollupProcess.overallRollupProcess(child1);

      // Parent should be completed (child2 excluded)
      expect(parent.completionStatus).toBe(CompletionStatus.COMPLETED);
    });
  });

  describe("requiredForIncomplete consideration", () => {
    it("should use 'ifAttempted' for incomplete evaluation", () => {
      // Child1 completed
      child1.requiredForIncomplete = "ifAttempted";
      child1.completionStatus = CompletionStatus.COMPLETED;
      child1.attemptProgressStatus = true;
      child1.attemptCount = 1;

      // Child2 incomplete and attempted
      child2.requiredForIncomplete = "ifAttempted";
      child2.completionStatus = CompletionStatus.INCOMPLETE;
      child2.attemptProgressStatus = true;
      child2.attemptCount = 1;

      // Child3 incomplete but unattempted (excluded from incomplete check)
      child3.requiredForIncomplete = "ifAttempted";
      child3.completionStatus = CompletionStatus.INCOMPLETE;
      child3.attemptProgressStatus = false;
      child3.attemptCount = 0;

      rollupProcess.overallRollupProcess(child1);

      // Parent should be incomplete because child2 is incomplete
      expect(parent.completionStatus).toBe(CompletionStatus.INCOMPLETE);
    });

    it("should exclude suspended children from incomplete check with 'ifNotSuspended'", () => {
      // All children completed
      child1.requiredForIncomplete = "ifNotSuspended";
      child1.completionStatus = CompletionStatus.COMPLETED;
      child1.attemptProgressStatus = true;
      child1.attemptCount = 1;

      child2.requiredForIncomplete = "ifNotSuspended";
      child2.completionStatus = CompletionStatus.COMPLETED;
      child2.attemptProgressStatus = true;
      child2.attemptCount = 1;

      // Child3 incomplete but suspended (excluded)
      child3.requiredForIncomplete = "ifNotSuspended";
      child3.completionStatus = CompletionStatus.INCOMPLETE;
      child3.attemptProgressStatus = true;
      child3.attemptCount = 1;
      child3.isSuspended = true;

      rollupProcess.overallRollupProcess(child1);

      // Parent should be completed (child3 excluded from incomplete check)
      expect(parent.completionStatus).toBe(CompletionStatus.COMPLETED);
    });
  });

  describe("Mixed consideration types", () => {
    it("should handle different considerations for each child", () => {
      // Child1: always included
      child1.requiredForSatisfied = "always";
      child1.objectiveSatisfiedStatus = true;
      child1.attemptCount = 1;

      // Child2: only if attempted (and it is attempted)
      child2.requiredForSatisfied = "ifAttempted";
      child2.objectiveSatisfiedStatus = true;
      child2.attemptProgressStatus = true;
      child2.attemptCount = 1;

      // Child3: only if not skipped (but it is skipped)
      child3.requiredForSatisfied = "ifNotSkipped";
      child3.objectiveSatisfiedStatus = false; // This won't matter - excluded
      child3.attemptCount = 1;
      child3.wasSkipped = true;

      rollupProcess.overallRollupProcess(child1);

      // Parent should be satisfied (child1 and child2 satisfied, child3 excluded)
      expect(parent.objectiveSatisfiedStatus).toBe(true);
    });

    it("should handle satisfaction and completion considerations independently", () => {
      // Child1: different considerations for objective vs completion
      child1.requiredForSatisfied = "always";
      child1.requiredForCompleted = "ifAttempted";
      child1.objectiveSatisfiedStatus = true;
      child1.completionStatus = CompletionStatus.COMPLETED;
      child1.attemptProgressStatus = true;
      child1.attemptCount = 1;

      // Child2: excluded from satisfaction but included in completion
      child2.requiredForSatisfied = "ifAttempted";
      child2.requiredForCompleted = "always";
      child2.objectiveSatisfiedStatus = true;
      child2.completionStatus = CompletionStatus.COMPLETED;
      child2.attemptProgressStatus = false;
      child2.attemptCount = 0;

      // Child3: included in both
      child3.requiredForSatisfied = "always";
      child3.requiredForCompleted = "always";
      child3.objectiveSatisfiedStatus = true;
      child3.completionStatus = CompletionStatus.COMPLETED;
      child3.attemptCount = 1;

      rollupProcess.overallRollupProcess(child1);

      // Satisfaction rollup: child1 and child3 (child2 excluded)
      expect(parent.objectiveSatisfiedStatus).toBe(true);
      // Completion rollup: all children included
      expect(parent.completionStatus).toBe(CompletionStatus.COMPLETED);
    });
  });

  describe("Edge cases", () => {
    it("should handle all children excluded from rollup", () => {
      // All children have ifAttempted but none are attempted
      child1.requiredForSatisfied = "ifAttempted";
      child1.objectiveSatisfiedStatus = true;
      child1.attemptProgressStatus = false;
      child1.attemptCount = 0;

      child2.requiredForSatisfied = "ifAttempted";
      child2.objectiveSatisfiedStatus = true;
      child2.attemptProgressStatus = false;
      child2.attemptCount = 0;

      child3.requiredForSatisfied = "ifAttempted";
      child3.objectiveSatisfiedStatus = true;
      child3.attemptProgressStatus = false;
      child3.attemptCount = 0;

      rollupProcess.overallRollupProcess(child1);

      // Parent should be not satisfied (no contributing children)
      expect(parent.objectiveSatisfiedStatus).toBe(false);
    });

    it("should handle single child with consideration", () => {
      // Remove child2 and child3
      parent = new Activity("parent", "Parent");
      child1 = new Activity("child1", "Child 1");
      parent.addChild(child1);

      parent.sequencingControls.rollupObjectiveSatisfied = true;
      child1.sequencingControls.rollupObjectiveSatisfied = true;

      child1.requiredForSatisfied = "ifAttempted";
      child1.objectiveSatisfiedStatus = true;
      child1.attemptProgressStatus = true;
      child1.attemptCount = 1;

      rollupProcess.overallRollupProcess(child1);

      expect(parent.objectiveSatisfiedStatus).toBe(true);
    });

    it("should handle zero children", () => {
      const emptyParent = new Activity("empty", "Empty Parent");
      emptyParent.sequencingControls.rollupObjectiveSatisfied = true;

      rollupProcess.overallRollupProcess(emptyParent);

      // Should not throw and parent should be not satisfied
      expect(emptyParent.objectiveSatisfiedStatus).toBe(false);
    });
  });

  describe("Rollup state consistency validation", () => {
    it("should validate consistent rollup state", () => {
      child1.objectiveSatisfiedStatus = true;
      child1.completionStatus = CompletionStatus.COMPLETED;
      child1.attemptCount = 1;

      child2.objectiveSatisfiedStatus = true;
      child2.completionStatus = CompletionStatus.COMPLETED;
      child2.attemptCount = 1;

      child3.objectiveSatisfiedStatus = true;
      child3.completionStatus = CompletionStatus.COMPLETED;
      child3.attemptCount = 1;

      rollupProcess.overallRollupProcess(child1);

      const isConsistent = rollupProcess.validateRollupStateConsistency(parent);
      expect(isConsistent).toBe(true);
    });

    it("should detect inconsistent rollup state", () => {
      // All children satisfied but parent is not (inconsistency)
      child1.objectiveSatisfiedStatus = true;
      child1.attemptCount = 1;
      child2.objectiveSatisfiedStatus = true;
      child2.attemptCount = 1;
      child3.objectiveSatisfiedStatus = true;
      child3.attemptCount = 1;

      // Manually set parent to inconsistent state
      parent.objectiveSatisfiedStatus = false;

      const isConsistent = rollupProcess.validateRollupStateConsistency(parent);
      expect(isConsistent).toBe(false);
    });
  });

  describe("Threshold-based rollup with considerations", () => {
    beforeEach(() => {
      // Add rollup rule with minimum count
      const rule = new RollupRule(RollupActionType.SATISFIED);
      rule.consideration = RollupConsiderationType.AT_LEAST_COUNT;
      rule.minimumCount = 2;
      parent.rollupRules.rules.push(rule);
    });

    it("should apply minimum count with consideration filtering", () => {
      // Child1: satisfied and included
      child1.requiredForSatisfied = "always";
      child1.objectiveSatisfiedStatus = true;
      child1.successStatus = SuccessStatus.PASSED;
      child1.attemptCount = 1;

      // Child2: satisfied and included
      child2.requiredForSatisfied = "always";
      child2.objectiveSatisfiedStatus = true;
      child2.successStatus = SuccessStatus.PASSED;
      child2.attemptCount = 1;

      // Child3: satisfied but excluded (not attempted)
      child3.requiredForSatisfied = "ifAttempted";
      child3.objectiveSatisfiedStatus = true;
      child3.successStatus = SuccessStatus.PASSED;
      child3.attemptProgressStatus = false;
      child3.attemptCount = 0;

      rollupProcess.overallRollupProcess(child1);

      // Should be satisfied: 2 children satisfy (meets minimum count of 2)
      expect(parent.objectiveSatisfiedStatus).toBe(true);
    });

    it("should fail minimum count when considerations exclude children", () => {
      // Create new parent with fresh rollup rules
      parent = new Activity("parent", "Parent Activity");
      child1 = new Activity("child1", "Child 1");
      child2 = new Activity("child2", "Child 2");
      child3 = new Activity("child3", "Child 3");
      parent.addChild(child1);
      parent.addChild(child2);
      parent.addChild(child3);
      parent.sequencingControls.rollupObjectiveSatisfied = true;
      child1.sequencingControls.rollupObjectiveSatisfied = true;
      child2.sequencingControls.rollupObjectiveSatisfied = true;
      child3.sequencingControls.rollupObjectiveSatisfied = true;

      // Add rule: Need at least 3 satisfied children
      const satisfiedRule = new RollupRule(RollupActionType.SATISFIED);
      satisfiedRule.consideration = RollupConsiderationType.AT_LEAST_COUNT;
      satisfiedRule.minimumCount = 3;
      const satisfiedCondition = new RollupCondition(RollupConditionType.SATISFIED);
      satisfiedRule.addCondition(satisfiedCondition);
      parent.rollupRules.addRule(satisfiedRule);

      // Add NOT_SATISFIED rule: If less than 3, then not satisfied
      const notSatisfiedRule = new RollupRule(RollupActionType.NOT_SATISFIED);
      notSatisfiedRule.consideration = RollupConsiderationType.ALL;
      const alwaysCondition = new RollupCondition(RollupConditionType.ALWAYS);
      notSatisfiedRule.addCondition(alwaysCondition);
      parent.rollupRules.addRule(notSatisfiedRule);

      // Child1: satisfied and included
      child1.requiredForSatisfied = "always";
      child1.objectiveSatisfiedStatus = true;
      child1.successStatus = SuccessStatus.PASSED;
      child1.attemptCount = 1;

      // Child2: satisfied and included
      child2.requiredForSatisfied = "always";
      child2.objectiveSatisfiedStatus = true;
      child2.successStatus = SuccessStatus.PASSED;
      child2.attemptCount = 1;

      // Child3: satisfied but excluded due to ifAttempted consideration
      child3.requiredForSatisfied = "ifAttempted";
      child3.requiredForNotSatisfied = "ifAttempted";
      child3.objectiveSatisfiedStatus = true;
      child3.successStatus = SuccessStatus.PASSED;
      child3.attemptProgressStatus = false;
      child3.attemptCount = 0;

      rollupProcess.overallRollupProcess(child1);

      // Should NOT be satisfied: only 2 children included (less than minimum of 3)
      // The notSatisfied rule should match because alwaysCondition is true for all
      expect(parent.objectiveSatisfiedStatus).toBe(false);
    });
  });

  describe("Percentage-based rollup with considerations", () => {
    beforeEach(() => {
      // Add rollup rule with percentage
      const rule = new RollupRule(RollupActionType.SATISFIED);
      rule.consideration = RollupConsiderationType.AT_LEAST_PERCENT;
      rule.minimumPercent = 0.67; // 67%
      parent.rollupRules.rules.push(rule);
    });

    it("should apply percentage threshold with consideration filtering", () => {
      // Child1: satisfied and included
      child1.requiredForSatisfied = "always";
      child1.objectiveSatisfiedStatus = true;
      child1.successStatus = SuccessStatus.PASSED;
      child1.attemptCount = 1;

      // Child2: satisfied and included
      child2.requiredForSatisfied = "always";
      child2.objectiveSatisfiedStatus = true;
      child2.successStatus = SuccessStatus.PASSED;
      child2.attemptCount = 1;

      // Child3: excluded from rollup (skipped)
      child3.requiredForSatisfied = "ifNotSkipped";
      child3.objectiveSatisfiedStatus = false;
      child3.successStatus = SuccessStatus.FAILED;
      child3.attemptCount = 1;
      child3.wasSkipped = true;

      rollupProcess.overallRollupProcess(child1);

      // Should be satisfied: 2 of 2 included children = 100% (exceeds 67%)
      expect(parent.objectiveSatisfiedStatus).toBe(true);
    });

    it("should calculate percentage only from included children", () => {
      // Create new parent with fresh rollup rules
      parent = new Activity("parent", "Parent Activity");
      child1 = new Activity("child1", "Child 1");
      child2 = new Activity("child2", "Child 2");
      child3 = new Activity("child3", "Child 3");
      parent.addChild(child1);
      parent.addChild(child2);
      parent.addChild(child3);
      parent.sequencingControls.rollupObjectiveSatisfied = true;
      child1.sequencingControls.rollupObjectiveSatisfied = true;
      child2.sequencingControls.rollupObjectiveSatisfied = true;
      child3.sequencingControls.rollupObjectiveSatisfied = true;

      const rule = new RollupRule(RollupActionType.SATISFIED);
      rule.consideration = RollupConsiderationType.AT_LEAST_PERCENT;
      rule.minimumPercent = 1.0; // 100%
      parent.rollupRules.addRule(rule);

      // Child1: satisfied and included
      child1.requiredForSatisfied = "always";
      child1.objectiveSatisfiedStatus = true;
      child1.successStatus = SuccessStatus.PASSED;
      child1.attemptCount = 1;

      // Child2: NOT satisfied but excluded
      child2.requiredForSatisfied = "ifAttempted";
      child2.objectiveSatisfiedStatus = false;
      child2.successStatus = SuccessStatus.FAILED;
      child2.attemptProgressStatus = false;
      child2.attemptCount = 0;

      // Child3: NOT satisfied but excluded
      child3.requiredForSatisfied = "ifAttempted";
      child3.objectiveSatisfiedStatus = false;
      child3.successStatus = SuccessStatus.FAILED;
      child3.attemptProgressStatus = false;
      child3.attemptCount = 0;

      rollupProcess.overallRollupProcess(child1);

      // Should be satisfied: 1 of 1 included child = 100%
      expect(parent.objectiveSatisfiedStatus).toBe(true);
    });
  });
});
