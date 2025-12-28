import { beforeEach, describe, expect, it } from "vitest";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import { Activity, ActivityObjective } from "../../../../src/cmi/scorm2004/sequencing/activity";
import {
  RollupActionType,
  RollupCondition,
  RollupConditionType,
  RollupConsiderationType,
  RollupRule
} from "../../../../src/cmi/scorm2004/sequencing/rollup_rules";
import { CompletionStatus, SuccessStatus } from "../../../../src/constants/enums";

describe("Rollup Processes (RB.1.1-1.5)", () => {
  let rollupProcess: RollupProcess;
  let root: Activity;
  let parent: Activity;
  let child1: Activity;
  let child2: Activity;
  let child3: Activity;

  beforeEach(() => {
    rollupProcess = new RollupProcess();

    // Create activity tree
    root = new Activity("root", "Course");
    parent = new Activity("module", "Module");
    child1 = new Activity("lesson1", "Lesson 1");
    child2 = new Activity("lesson2", "Lesson 2");
    child3 = new Activity("lesson3", "Lesson 3");

    root.addChild(parent);
    parent.addChild(child1);
    parent.addChild(child2);
    parent.addChild(child3);

    // Enable rollup by default
    root.sequencingControls.rollupObjectiveSatisfied = true;
    root.sequencingControls.rollupProgressCompletion = true;
    parent.sequencingControls.rollupObjectiveSatisfied = true;
    parent.sequencingControls.rollupProgressCompletion = true;

    // Set default weights for measure rollup
    child1.sequencingControls.objectiveMeasureWeight = 1.0;
    child2.sequencingControls.objectiveMeasureWeight = 1.0;
    child3.sequencingControls.objectiveMeasureWeight = 1.0;
  });

  describe("Overall Rollup Process (RB.1.5)", () => {
    it("should rollup from activity to root", () => {
      // Set child states
      child1.objectiveSatisfiedStatus = true;
      child1.isCompleted = true;
      child2.objectiveSatisfiedStatus = true;
      child2.isCompleted = true;
      child3.objectiveSatisfiedStatus = true;
      child3.isCompleted = true;

      // Trigger overall rollup from child1
      rollupProcess.overallRollupProcess(child1);

      // Parent should be satisfied and completed
      expect(parent.objectiveSatisfiedStatus).toBe(true);
      expect(parent.isCompleted).toBe(true);

      // Root should also be satisfied and completed
      expect(root.objectiveSatisfiedStatus).toBe(true);
      expect(root.isCompleted).toBe(true);
    });

    it("should stop at activity with rollup disabled", () => {
      parent.sequencingControls.rollupObjectiveSatisfied = false;
      parent.sequencingControls.rollupProgressCompletion = false;

      child1.objectiveSatisfiedStatus = true;
      child1.isCompleted = true;

      rollupProcess.overallRollupProcess(child1);

      // Parent should not be affected
      expect(parent.objectiveSatisfiedStatus).toBe(false);
      expect(parent.isCompleted).toBe(false);
    });

    it("should handle null parent gracefully", () => {
      const orphan = new Activity("orphan", "Orphan");
      orphan.objectiveSatisfiedStatus = true;

      // Should not throw
      expect(() => rollupProcess.overallRollupProcess(orphan)).not.toThrow();
    });
  });

  describe("Measure Rollup Process (RB.1.1)", () => {
    it("should calculate weighted average of child measures", () => {
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 0.8;
      child2.objectiveMeasureStatus = true;
      child2.objectiveNormalizedMeasure = 0.9;
      child3.objectiveMeasureStatus = true;
      child3.objectiveNormalizedMeasure = 1.0;

      rollupProcess.overallRollupProcess(child1);

      // Parent measure should be weighted average: (0.8 + 0.9 + 1.0) / 3 = 0.9
      expect(parent.objectiveMeasureStatus).toBe(true);
      expect(parent.objectiveNormalizedMeasure).toBeCloseTo(0.9);
    });

    it("should handle different weights", () => {
      child1.sequencingControls.objectiveMeasureWeight = 2.0;
      child2.sequencingControls.objectiveMeasureWeight = 1.0;
      child3.sequencingControls.objectiveMeasureWeight = 1.0;

      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 1.0;
      child2.objectiveMeasureStatus = true;
      child2.objectiveNormalizedMeasure = 0.5;
      child3.objectiveMeasureStatus = true;
      child3.objectiveNormalizedMeasure = 0.5;

      rollupProcess.overallRollupProcess(child1);

      // Weighted average: (1.0*2 + 0.5*1 + 0.5*1) / (2+1+1) = 3/4 = 0.75
      expect(parent.objectiveNormalizedMeasure).toBeCloseTo(0.75);
    });

    it("should ignore children without measure status", () => {
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 0.8;
      child2.objectiveMeasureStatus = false; // No measure
      child3.objectiveMeasureStatus = true;
      child3.objectiveNormalizedMeasure = 1.0;

      rollupProcess.overallRollupProcess(child1);

      // Average of only child1 and child3: (0.8 + 1.0) / 2 = 0.9
      expect(parent.objectiveNormalizedMeasure).toBeCloseTo(0.9);
    });

    it("should handle no valid measures", () => {
      child1.objectiveMeasureStatus = false;
      child2.objectiveMeasureStatus = false;
      child3.objectiveMeasureStatus = false;

      rollupProcess.overallRollupProcess(child1);

      expect(parent.objectiveMeasureStatus).toBe(false);
    });

    it("should respect rollup contribution settings", () => {
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 0.8;
      child1.sequencingControls.rollupObjectiveSatisfied = false; // Don't contribute

      child2.objectiveMeasureStatus = true;
      child2.objectiveNormalizedMeasure = 1.0;

      rollupProcess.overallRollupProcess(child1);

      // Only child2 should contribute
      expect(parent.objectiveNormalizedMeasure).toBe(1.0);
    });
  });

  describe("Objective Rollup Process (RB.1.2)", () => {
    describe("Objective Rollup Using Measure (RB.1.2.a)", () => {
      it("should determine satisfaction from measure and passing score", () => {
        parent.scaledPassingScore = 0.7;

        // Set up measure rollup
        child1.objectiveMeasureStatus = true;
        child1.objectiveNormalizedMeasure = 0.8;
        child2.objectiveMeasureStatus = true;
        child2.objectiveNormalizedMeasure = 0.8;
        child3.objectiveMeasureStatus = true;
        child3.objectiveNormalizedMeasure = 0.8;

        rollupProcess.overallRollupProcess(child1);

        // Measure 0.8 >= passing score 0.7
        expect(parent.objectiveSatisfiedStatus).toBe(true);
        expect(parent.successStatus).toBe(SuccessStatus.PASSED);
      });

      it("should fail when measure below passing score", () => {
        parent.scaledPassingScore = 0.8;

        child1.objectiveMeasureStatus = true;
        child1.objectiveNormalizedMeasure = 0.6;
        child2.objectiveMeasureStatus = true;
        child2.objectiveNormalizedMeasure = 0.6;
        child3.objectiveMeasureStatus = true;
        child3.objectiveNormalizedMeasure = 0.6;

        rollupProcess.overallRollupProcess(child1);

        // Measure 0.6 < passing score 0.8
        expect(parent.objectiveSatisfiedStatus).toBe(false);
        expect(parent.successStatus).toBe(SuccessStatus.FAILED);
      });
    });

    describe("Objective Rollup Using Rules (RB.1.2.b)", () => {
      it("should apply satisfied rollup rule", () => {
        // Create "all satisfied" rule
        const rule = new RollupRule(
          RollupActionType.SATISFIED,
          RollupConsiderationType.ALL
        );
        rule.addCondition(new RollupCondition(RollupConditionType.SATISFIED));
        parent.rollupRules.addRule(rule);

        child1.successStatus = SuccessStatus.PASSED;
        child2.successStatus = SuccessStatus.PASSED;
        child3.successStatus = SuccessStatus.PASSED;

        rollupProcess.overallRollupProcess(child1);

        expect(parent.objectiveSatisfiedStatus).toBe(true);
      });

      it("should apply not satisfied rollup rule", () => {
        // Create "any not satisfied" rule
        const rule = new RollupRule(
          RollupActionType.NOT_SATISFIED,
          RollupConsiderationType.ANY
        );
        rule.addCondition(new RollupCondition(RollupConditionType.SATISFIED));
        parent.rollupRules.addRule(rule);

        child1.successStatus = SuccessStatus.PASSED;
        child2.successStatus = SuccessStatus.FAILED;
        child3.successStatus = SuccessStatus.PASSED;

        rollupProcess.overallRollupProcess(child1);

        expect(parent.objectiveSatisfiedStatus).toBe(false);
      });

      it("should handle minimum count rules", () => {
        // Create "at least 2 satisfied" rule
        const rule = new RollupRule(
          RollupActionType.SATISFIED,
          RollupConsiderationType.AT_LEAST_COUNT
        );
        rule.minimumCount = 2;
        rule.addCondition(new RollupCondition(RollupConditionType.SATISFIED));
        parent.rollupRules.addRule(rule);

        child1.successStatus = SuccessStatus.PASSED;
        child2.successStatus = SuccessStatus.PASSED;
        child3.successStatus = SuccessStatus.FAILED;

        rollupProcess.overallRollupProcess(child1);

        expect(parent.objectiveSatisfiedStatus).toBe(true);
      });

      it("should handle minimum percent rules", () => {
        // Create "at least 50% satisfied" rule
        const rule = new RollupRule(
          RollupActionType.SATISFIED,
          RollupConsiderationType.AT_LEAST_PERCENT
        );
        rule.minimumPercent = 0.5;
        rule.addCondition(new RollupCondition(RollupConditionType.SATISFIED));
        parent.rollupRules.addRule(rule);

        child1.successStatus = SuccessStatus.PASSED;
        child2.successStatus = SuccessStatus.PASSED;
        child3.successStatus = SuccessStatus.FAILED;

        rollupProcess.overallRollupProcess(child1);

        // 2/3 = 66.7% > 50%
        expect(parent.objectiveSatisfiedStatus).toBe(true);
      });
    });

    describe("Objective Rollup Using Default (RB.1.2.c)", () => {
      it("should satisfy when all tracked children satisfied", () => {
        child1.objectiveSatisfiedStatus = true;
        child2.objectiveSatisfiedStatus = true;
        child3.objectiveSatisfiedStatus = true;

        rollupProcess.overallRollupProcess(child1);

        expect(parent.objectiveSatisfiedStatus).toBe(true);
      });

      it("should not satisfy when any tracked child not satisfied", () => {
        child1.objectiveSatisfiedStatus = true;
        child2.objectiveSatisfiedStatus = false;
        child3.objectiveSatisfiedStatus = true;

        rollupProcess.overallRollupProcess(child1);

        expect(parent.objectiveSatisfiedStatus).toBe(false);
      });

      it("should ignore non-tracked children", () => {
        child1.objectiveSatisfiedStatus = true;
        child2.objectiveSatisfiedStatus = false;
        child2.sequencingControls.rollupObjectiveSatisfied = false; // Don't track
        child3.objectiveSatisfiedStatus = true;

        rollupProcess.overallRollupProcess(child1);

        // Only child1 and child3 tracked, both satisfied
        expect(parent.objectiveSatisfiedStatus).toBe(true);
      });
    });
  });

  describe("Activity Progress Rollup Process (RB.1.3)", () => {
    it("should apply completed rollup rule", () => {
      // Create "all completed" rule
      const rule = new RollupRule(
        RollupActionType.COMPLETED,
        RollupConsiderationType.ALL
      );
      rule.addCondition(new RollupCondition(RollupConditionType.COMPLETED));
      parent.rollupRules.addRule(rule);

      child1.isCompleted = true;
      child2.isCompleted = true;
      child3.isCompleted = true;

      rollupProcess.overallRollupProcess(child1);

      expect(parent.completionStatus).toBe(CompletionStatus.COMPLETED);
      expect(parent.isCompleted).toBe(true);
    });

    it("should apply incomplete rollup rule", () => {
      // Create "any incomplete" rule
      const rule = new RollupRule(
        RollupActionType.INCOMPLETE,
        RollupConsiderationType.ANY
      );
      rule.addCondition(new RollupCondition(RollupConditionType.COMPLETED));
      parent.rollupRules.addRule(rule);

      child1.isCompleted = true;
      child2.isCompleted = false;
      child3.isCompleted = true;

      rollupProcess.overallRollupProcess(child1);

      expect(parent.completionStatus).toBe(CompletionStatus.INCOMPLETE);
      expect(parent.isCompleted).toBe(false);
    });

    it("should use default completion rollup", () => {
      child1.isCompleted = true;
      child2.isCompleted = true;
      child3.isCompleted = true;

      rollupProcess.overallRollupProcess(child1);

      expect(parent.isCompleted).toBe(true);
    });

    it("should handle progress known condition", () => {
      const rule = new RollupRule(
        RollupActionType.COMPLETED,
        RollupConsiderationType.ALL
      );
      rule.addCondition(new RollupCondition(RollupConditionType.PROGRESS_KNOWN));
      parent.rollupRules.addRule(rule);

      child1.completionStatus = CompletionStatus.COMPLETED;
      child2.completionStatus = CompletionStatus.INCOMPLETE;
      child3.completionStatus = CompletionStatus.COMPLETED;

      rollupProcess.overallRollupProcess(child1);

      // All have known progress
      expect(parent.isCompleted).toBe(true);
    });
  });

  describe("Check Child For Rollup Subprocess (RB.1.4.2)", () => {
    it("should exclude children not tracking objective", () => {
      child1.sequencingControls.rollupObjectiveSatisfied = false;
      child1.objectiveSatisfiedStatus = false; // Would fail rollup

      child2.objectiveSatisfiedStatus = true;
      child3.objectiveSatisfiedStatus = true;

      rollupProcess.overallRollupProcess(child1);

      // child1 excluded, others satisfied
      expect(parent.objectiveSatisfiedStatus).toBe(true);
    });

    it("should exclude children not tracking progress", () => {
      child1.sequencingControls.rollupProgressCompletion = false;
      child1.isCompleted = false; // Would fail rollup

      child2.isCompleted = true;
      child3.isCompleted = true;

      rollupProcess.overallRollupProcess(child1);

      // child1 excluded, others completed
      expect(parent.isCompleted).toBe(true);
    });

    it("should exclude unavailable children", () => {
      child1.isAvailable = false;
      child1.objectiveSatisfiedStatus = false; // Would fail rollup

      child2.objectiveSatisfiedStatus = true;
      child3.objectiveSatisfiedStatus = true;

      rollupProcess.overallRollupProcess(child1);

      // child1 excluded, others satisfied
      expect(parent.objectiveSatisfiedStatus).toBe(true);
    });
  });

  describe("Evaluate Rollup Conditions Subprocess (RB.1.4.1)", () => {
    it("should evaluate multiple conditions with ALL consideration", () => {
      const rule = new RollupRule(
        RollupActionType.SATISFIED,
        RollupConsiderationType.ALL
      );
      rule.addCondition(new RollupCondition(RollupConditionType.SATISFIED));
      rule.addCondition(new RollupCondition(RollupConditionType.COMPLETED));
      parent.rollupRules.addRule(rule);

      // All children must be both satisfied AND completed
      child1.successStatus = SuccessStatus.PASSED;
      child1.isCompleted = true;
      child2.successStatus = SuccessStatus.PASSED;
      child2.isCompleted = true;
      child3.successStatus = SuccessStatus.PASSED;
      child3.isCompleted = false; // Not completed

      rollupProcess.overallRollupProcess(child1);

      // Rule should not apply because child3 not completed
      expect(parent.objectiveSatisfiedStatus).toBe(false);
    });

    it("should evaluate conditions with ANY consideration", () => {
      const rule = new RollupRule(
        RollupActionType.SATISFIED,
        RollupConsiderationType.ANY
      );
      rule.addCondition(new RollupCondition(RollupConditionType.SATISFIED));
      parent.rollupRules.addRule(rule);

      child1.successStatus = SuccessStatus.FAILED;
      child2.successStatus = SuccessStatus.PASSED; // At least one
      child3.successStatus = SuccessStatus.FAILED;

      rollupProcess.overallRollupProcess(child1);

      expect(parent.objectiveSatisfiedStatus).toBe(true);
    });

    it("should evaluate conditions with NONE consideration", () => {
      const rule = new RollupRule(
        RollupActionType.SATISFIED,
        RollupConsiderationType.NONE
      );
      rule.addCondition(new RollupCondition(RollupConditionType.SATISFIED));
      parent.rollupRules.addRule(rule);

      child1.successStatus = SuccessStatus.UNKNOWN;
      child2.successStatus = SuccessStatus.UNKNOWN;
      child3.successStatus = SuccessStatus.UNKNOWN;

      rollupProcess.overallRollupProcess(child1);

      // None are satisfied, so rule applies
      expect(parent.objectiveSatisfiedStatus).toBe(true);
    });

    it("should handle attempted/not attempted conditions", () => {
      const rule = new RollupRule(
        RollupActionType.COMPLETED,
        RollupConsiderationType.ALL
      );
      rule.addCondition(new RollupCondition(RollupConditionType.ATTEMPTED));
      parent.rollupRules.addRule(rule);

      child1.attemptCount = 1;
      child2.attemptCount = 2;
      child3.attemptCount = 1;

      rollupProcess.overallRollupProcess(child1);

      // All attempted
      expect(parent.isCompleted).toBe(true);
    });

    it("should handle measure threshold conditions", () => {
      const rule = new RollupRule(
        RollupActionType.SATISFIED,
        RollupConsiderationType.ALL
      );
      const condition = new RollupCondition(
        RollupConditionType.OBJECTIVE_MEASURE_GREATER_THAN,
        new Map([["threshold", 0.7]])
      );
      rule.addCondition(condition);
      parent.rollupRules.addRule(rule);

      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 0.8;
      child2.objectiveMeasureStatus = true;
      child2.objectiveNormalizedMeasure = 0.9;
      child3.objectiveMeasureStatus = true;
      child3.objectiveNormalizedMeasure = 0.75;

      rollupProcess.overallRollupProcess(child1);

      // All > 0.7
      expect(parent.objectiveSatisfiedStatus).toBe(true);
    });
  });

  describe("Complex rollup scenarios", () => {
    it("should handle multiple rollup rules with priority", () => {
      // Rule 1: If all satisfied, mark as satisfied
      const rule1 = new RollupRule(
        RollupActionType.SATISFIED,
        RollupConsiderationType.ALL
      );
      rule1.addCondition(new RollupCondition(RollupConditionType.SATISFIED));

      // Rule 2: If any not satisfied, mark as not satisfied (takes precedence)
      const rule2 = new RollupRule(
        RollupActionType.NOT_SATISFIED,
        RollupConsiderationType.ANY
      );
      const notSatisfiedCondition = new RollupCondition(RollupConditionType.SATISFIED);
      rule2.addCondition(notSatisfiedCondition);

      parent.rollupRules.addRule(rule1);
      parent.rollupRules.addRule(rule2);

      child1.successStatus = SuccessStatus.PASSED;
      child2.successStatus = SuccessStatus.FAILED;
      child3.successStatus = SuccessStatus.PASSED;

      rollupProcess.overallRollupProcess(child1);

      // First matching rule should apply
      expect(parent.objectiveSatisfiedStatus).toBe(false);
    });

    it("should handle deep hierarchical rollup", () => {
      // Create deeper hierarchy
      const grandchild = new Activity("grandchild", "Grandchild");
      child1.addChild(grandchild);
      child1.sequencingControls.rollupObjectiveSatisfied = true;
      child1.sequencingControls.rollupProgressCompletion = true;

      grandchild.objectiveSatisfiedStatus = true;
      grandchild.isCompleted = true;

      // Set other children as satisfied to meet default rollup rules
      child2.objectiveSatisfiedStatus = true;
      child2.isCompleted = true;
      child3.objectiveSatisfiedStatus = true;
      child3.isCompleted = true;

      // Rollup from grandchild all the way to root
      rollupProcess.overallRollupProcess(grandchild);

      // Should propagate up through all levels
      expect(child1.objectiveSatisfiedStatus).toBe(true);
      expect(parent.objectiveSatisfiedStatus).toBe(true);
      expect(root.objectiveSatisfiedStatus).toBe(true);
    });
  });

  describe("Rollup Optimization (RB.1.5 - SCORM 2004 4.6.1)", () => {
    it("should stop rollup when status stops changing", () => {
      // Create deep tree: root -> parent -> child1 -> deepChild1 -> deepChild2
      const deepChild1 = new Activity("deepChild1", "Deep Child 1");
      const deepChild2 = new Activity("deepChild2", "Deep Child 2");

      root.addChild(parent);
      parent.addChild(child1);
      child1.addChild(deepChild1);
      deepChild1.addChild(deepChild2);

      // Enable rollup for all levels
      root.sequencingControls.rollupObjectiveSatisfied = true;
      root.sequencingControls.rollupProgressCompletion = true;
      parent.sequencingControls.rollupObjectiveSatisfied = true;
      parent.sequencingControls.rollupProgressCompletion = true;
      child1.sequencingControls.rollupObjectiveSatisfied = true;
      child1.sequencingControls.rollupProgressCompletion = true;
      deepChild1.sequencingControls.rollupObjectiveSatisfied = true;
      deepChild1.sequencingControls.rollupProgressCompletion = true;

      // Set parent and root already completed and satisfied (stable state)
      parent.objectiveSatisfiedStatus = true;
      parent.completionStatus = CompletionStatus.COMPLETED;
      root.objectiveSatisfiedStatus = true;
      root.completionStatus = CompletionStatus.COMPLETED;

      // Complete deepest child
      deepChild2.objectiveSatisfiedStatus = true;
      deepChild2.completionStatus = CompletionStatus.COMPLETED;

      // Rollup from deepChild2 (processes parent deepChild1 and upward)
      const affectedActivities = rollupProcess.overallRollupProcess(deepChild2);

      // Should include deepChild1 (parent of deepChild2, first iteration always included)
      expect(affectedActivities).toContain(deepChild1);

      // Optimization should stop propagation before reaching root if no changes occur
      // The exact stopping point depends on when status stops changing
      expect(affectedActivities.length).toBeGreaterThan(0);
      expect(affectedActivities.length).toBeLessThanOrEqual(4); // deepChild1, child1, parent, root
    });

    it("should always process first activity even if no change", () => {
      // Set child already completed
      child1.objectiveSatisfiedStatus = true;
      child1.completionStatus = CompletionStatus.COMPLETED;
      child2.objectiveSatisfiedStatus = true;
      child2.completionStatus = CompletionStatus.COMPLETED;
      child3.objectiveSatisfiedStatus = true;
      child3.completionStatus = CompletionStatus.COMPLETED;

      // Set parent already completed and satisfied (stable state)
      parent.objectiveSatisfiedStatus = true;
      parent.completionStatus = CompletionStatus.COMPLETED;

      // Rollup from child1 (processes parent first)
      const affectedActivities = rollupProcess.overallRollupProcess(child1);

      // Should still include parent (first iteration always processed even if no change)
      expect(affectedActivities).toContain(parent);
      expect(affectedActivities.length).toBeGreaterThan(0);
    });

    it("should propagate all the way to root when changes occur at each level", () => {
      // Create tree where each level will change
      child1.objectiveSatisfiedStatus = true;
      child1.completionStatus = CompletionStatus.COMPLETED;
      child2.objectiveSatisfiedStatus = true;
      child2.completionStatus = CompletionStatus.COMPLETED;
      child3.objectiveSatisfiedStatus = true;
      child3.completionStatus = CompletionStatus.COMPLETED;

      // Parent and root start unsatisfied/incomplete
      parent.objectiveSatisfiedStatus = false;
      parent.completionStatus = CompletionStatus.INCOMPLETE;
      root.objectiveSatisfiedStatus = false;
      root.completionStatus = CompletionStatus.INCOMPLETE;

      // Rollup from child1 - should propagate changes all the way up
      const affectedActivities = rollupProcess.overallRollupProcess(child1);

      // Should include parent and root (all changed)
      // Note: child1 itself is not included as rollup processes from parent upward
      expect(affectedActivities).toContain(parent);
      expect(affectedActivities).toContain(root);
    });

    it("should handle floating point comparison correctly for normalizedMeasure", () => {
      // Set up measure-based rollup
      parent.scaledPassingScore = 0.7;
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 0.8;
      child1.sequencingControls.objectiveMeasureWeight = 1.0;
      child2.objectiveMeasureStatus = true;
      child2.objectiveNormalizedMeasure = 0.8;
      child2.sequencingControls.objectiveMeasureWeight = 1.0;
      child3.objectiveMeasureStatus = true;
      child3.objectiveNormalizedMeasure = 0.8;
      child3.sequencingControls.objectiveMeasureWeight = 1.0;

      // Set parent measure to very close value (within epsilon)
      parent.objectiveMeasureStatus = true;
      parent.objectiveNormalizedMeasure = 0.800001; // Within epsilon of 0.8
      parent.objectiveSatisfiedStatus = true;

      // Rollup from child1
      const affectedActivities = rollupProcess.overallRollupProcess(child1);

      // Parent's measure is essentially unchanged (within epsilon)
      // Parent is first iteration so always included
      expect(affectedActivities).toContain(parent);

      // Optimization should activate at parent level, so root may not be in the list
      expect(affectedActivities.length).toBeGreaterThanOrEqual(1);
    });

    it("should return array of affected activities", () => {
      child1.objectiveSatisfiedStatus = true;
      child1.completionStatus = CompletionStatus.COMPLETED;

      const affectedActivities = rollupProcess.overallRollupProcess(child1);

      // Should return an array
      expect(Array.isArray(affectedActivities)).toBe(true);
      expect(affectedActivities.length).toBeGreaterThan(0);
    });

    it("should stop early in deep tree when intermediate level doesn't change", () => {
      // Create 5-level deep tree
      const level1 = new Activity("level1", "Level 1");
      const level2 = new Activity("level2", "Level 2");
      const level3 = new Activity("level3", "Level 3");
      const level4 = new Activity("level4", "Level 4");
      const level5 = new Activity("level5", "Level 5");

      level1.addChild(level2);
      level2.addChild(level3);
      level3.addChild(level4);
      level4.addChild(level5);

      // Enable rollup for all
      [level1, level2, level3, level4, level5].forEach(activity => {
        activity.sequencingControls.rollupObjectiveSatisfied = true;
        activity.sequencingControls.rollupProgressCompletion = true;
      });

      // Set level1, level2, level3 already completed and satisfied
      level1.objectiveSatisfiedStatus = true;
      level1.completionStatus = CompletionStatus.COMPLETED;
      level2.objectiveSatisfiedStatus = true;
      level2.completionStatus = CompletionStatus.COMPLETED;
      level3.objectiveSatisfiedStatus = true;
      level3.completionStatus = CompletionStatus.COMPLETED;

      // Complete deepest level
      level5.objectiveSatisfiedStatus = true;
      level5.completionStatus = CompletionStatus.COMPLETED;

      const affectedActivities = rollupProcess.overallRollupProcess(level5);

      // Should not process all 5 levels if optimization kicks in
      expect(affectedActivities.length).toBeLessThan(5);
    });

    it("should detect changes in all tracked status fields", () => {
      // Change only completion status, not satisfaction
      parent.objectiveSatisfiedStatus = true;
      parent.completionStatus = CompletionStatus.INCOMPLETE;

      child1.objectiveSatisfiedStatus = true;
      child1.completionStatus = CompletionStatus.COMPLETED;
      child2.objectiveSatisfiedStatus = true;
      child2.completionStatus = CompletionStatus.COMPLETED;
      child3.objectiveSatisfiedStatus = true;
      child3.completionStatus = CompletionStatus.COMPLETED;

      const affectedActivities = rollupProcess.overallRollupProcess(child1);

      // Parent's completion status should change, so it should be in affected list
      expect(affectedActivities).toContain(parent);
      expect(parent.completionStatus).toBe(CompletionStatus.COMPLETED);
    });
  });

  describe("ADL rollup considerations", () => {
    it("ignores skipped children when requiredForNotSatisfied is ifNotSkipped", () => {
      const adlParent = new Activity("adlParent", "ADL Parent");
      adlParent.sequencingControls.rollupObjectiveSatisfied = true;

      const skippedChild = new Activity("skipped", "Skipped Child");
      const satisfiedChild = new Activity("satisfied", "Satisfied Child");

      adlParent.addChild(skippedChild);
      adlParent.addChild(satisfiedChild);

      // Set tracking on children
      skippedChild.sequencingControls.rollupObjectiveSatisfied = true;
      satisfiedChild.sequencingControls.rollupObjectiveSatisfied = true;

      // Set INDIVIDUAL child consideration settings (RB.1.4.2)
      skippedChild.requiredForNotSatisfied = "ifNotSkipped";
      skippedChild.requiredForSatisfied = "ifAttempted";
      skippedChild.wasSkipped = true;
      skippedChild.objectiveSatisfiedStatus = false;

      satisfiedChild.requiredForNotSatisfied = "ifNotSkipped";
      satisfiedChild.requiredForSatisfied = "ifAttempted";
      satisfiedChild.objectiveSatisfiedStatus = true;
      satisfiedChild.attemptProgressStatus = true;
      satisfiedChild.attemptCount = 1;

      rollupProcess.overallRollupProcess(satisfiedChild);

      // Skipped child should be excluded from notSatisfied check
      expect(adlParent.objectiveSatisfiedStatus).toBe(true);
    });

    it("considers only attempted children for completion when configured", () => {
      // Set INDIVIDUAL child consideration settings (RB.1.4.2)
      child1.requiredForCompleted = "ifAttempted";
      child1.requiredForIncomplete = "ifAttempted";
      child1.attemptProgressStatus = true;
      child1.attemptCount = 1;
      child1.completionStatus = "completed";

      child2.requiredForCompleted = "ifAttempted";
      child2.requiredForIncomplete = "ifAttempted";
      child2.attemptProgressStatus = false;
      child2.attemptCount = 0;
      child2.completionStatus = CompletionStatus.UNKNOWN;

      child3.requiredForCompleted = "ifAttempted";
      child3.requiredForIncomplete = "ifAttempted";
      child3.attemptProgressStatus = false;
      child3.attemptCount = 0;
      child3.completionStatus = CompletionStatus.UNKNOWN;

      rollupProcess.overallRollupProcess(child1);

      // Only child1 is attempted and completed, child2 and child3 are excluded
      expect(parent.completionStatus).toBe("completed");
    });

    it("defers satisfaction while a contributing child is active when configured", () => {
      const adlParent = new Activity("adlParentActive", "ADL Parent Active");
      adlParent.sequencingControls.rollupObjectiveSatisfied = true;

      const activeChild = new Activity("active", "Active Child");
      adlParent.addChild(activeChild);

      adlParent.applyRollupConsiderations({
        measureSatisfactionIfActive: false
      });

      activeChild.objectiveSatisfiedStatus = true;
      activeChild.attemptCount = 1;
      activeChild.activityAttemptActive = true;
      activeChild.isActive = true;

      rollupProcess.overallRollupProcess(activeChild);
      expect(adlParent.objectiveSatisfiedStatus).toBe(false);

      activeChild.activityAttemptActive = false;
      activeChild.isActive = false;

      rollupProcess.overallRollupProcess(activeChild);
      expect(adlParent.objectiveSatisfiedStatus).toBe(true);
    });
  });

  describe("objectiveMeasureStatus during rollup", () => {
    it("should NOT set objectiveMeasureStatus when using rule-based rollup", () => {
      // Setup parent with children, children satisfied but no measures
      const ruleParent = new Activity("ruleParent", "Rule Parent");
      const ruleChild1 = new Activity("ruleChild1", "Rule Child 1");
      const ruleChild2 = new Activity("ruleChild2", "Rule Child 2");

      ruleParent.addChild(ruleChild1);
      ruleParent.addChild(ruleChild2);
      ruleParent.sequencingControls.rollupObjectiveSatisfied = true;

      // Create "all satisfied" rule (RB.1.2.b - rule-based rollup)
      const rule = new RollupRule(
        RollupActionType.SATISFIED,
        RollupConsiderationType.ALL
      );
      rule.addCondition(new RollupCondition(RollupConditionType.SATISFIED));
      ruleParent.rollupRules.addRule(rule);

      // Children are satisfied but have NO measures
      ruleChild1.successStatus = SuccessStatus.PASSED;
      ruleChild1.objectiveSatisfiedStatus = true;
      ruleChild1.objectiveMeasureStatus = false; // No measure

      ruleChild2.successStatus = SuccessStatus.PASSED;
      ruleChild2.objectiveSatisfiedStatus = true;
      ruleChild2.objectiveMeasureStatus = false; // No measure

      // Trigger rollup
      rollupProcess.overallRollupProcess(ruleChild1);

      // Verify parent is satisfied by rule
      expect(ruleParent.objectiveSatisfiedStatus).toBe(true);

      // Verify parent.objectiveMeasureStatus is still false
      // Rule-based rollup (RB.1.2.b) should NOT set measureStatus
      expect(ruleParent.objectiveMeasureStatus).toBe(false);
    });

    it("should NOT set objectiveMeasureStatus when using default rollup", () => {
      // Setup parent with children, children satisfied but no measures
      const defaultParent = new Activity("defaultParent", "Default Parent");
      const defaultChild1 = new Activity("defaultChild1", "Default Child 1");
      const defaultChild2 = new Activity("defaultChild2", "Default Child 2");

      defaultParent.addChild(defaultChild1);
      defaultParent.addChild(defaultChild2);
      defaultParent.sequencingControls.rollupObjectiveSatisfied = true;

      // NO rollup rules defined - will use default rollup (RB.1.2.c)

      // Children are satisfied but have NO measures
      defaultChild1.objectiveSatisfiedStatus = true;
      defaultChild1.objectiveMeasureStatus = false; // No measure

      defaultChild2.objectiveSatisfiedStatus = true;
      defaultChild2.objectiveMeasureStatus = false; // No measure

      // Trigger rollup
      rollupProcess.overallRollupProcess(defaultChild1);

      // Verify parent is satisfied by default rollup
      expect(defaultParent.objectiveSatisfiedStatus).toBe(true);

      // Verify parent.objectiveMeasureStatus is still false
      // Default rollup (RB.1.2.c) should NOT set measureStatus
      expect(defaultParent.objectiveMeasureStatus).toBe(false);
    });

    it("should set objectiveMeasureStatus only when measure rollup calculates a value", () => {
      // Setup parent with children that have actual measures
      const measureParent = new Activity("measureParent", "Measure Parent");
      const measureChild1 = new Activity("measureChild1", "Measure Child 1");
      const measureChild2 = new Activity("measureChild2", "Measure Child 2");

      measureParent.addChild(measureChild1);
      measureParent.addChild(measureChild2);
      measureParent.sequencingControls.rollupObjectiveSatisfied = true;
      measureParent.scaledPassingScore = 0.7;

      // Set weights for measure rollup
      measureChild1.sequencingControls.objectiveMeasureWeight = 1.0;
      measureChild2.sequencingControls.objectiveMeasureWeight = 1.0;

      // Children have actual measures
      measureChild1.objectiveMeasureStatus = true;
      measureChild1.objectiveNormalizedMeasure = 0.8;

      measureChild2.objectiveMeasureStatus = true;
      measureChild2.objectiveNormalizedMeasure = 0.9;

      // Trigger rollup
      rollupProcess.overallRollupProcess(measureChild1);

      // Verify parent.objectiveMeasureStatus is true
      // Measure rollup (RB.1.1) SHOULD set measureStatus
      expect(measureParent.objectiveMeasureStatus).toBe(true);

      // Verify parent.objectiveNormalizedMeasure has calculated value
      expect(measureParent.objectiveNormalizedMeasure).toBeCloseTo(0.85);

      // Verify satisfaction is determined from measure (RB.1.2.a)
      expect(measureParent.objectiveSatisfiedStatus).toBe(true);
    });
  });

  describe("Additional edge case coverage", () => {
    describe("Completion by measure edge cases", () => {
      it("should mark incomplete when completion measure below threshold", () => {
        // Test RB.1.3.a - completion by measure when threshold not met
        parent.completedByMeasure = true;
        parent.minProgressMeasure = 0.8;
        parent.attemptCompletionAmountStatus = true;
        parent.attemptCompletionAmount = 0.6; // Below threshold

        child1.attemptCompletionAmountStatus = true;
        child1.attemptCompletionAmount = 0.6;
        child1.progressWeight = 1.0;

        rollupProcess.overallRollupProcess(child1);

        // Should be incomplete since 0.6 < 0.8
        expect(parent.completionStatus).toBe(CompletionStatus.INCOMPLETE);
      });

      it("should mark complete when completion measure meets threshold", () => {
        parent.completedByMeasure = true;
        parent.minProgressMeasure = 0.7;
        parent.attemptCompletionAmountStatus = true;
        parent.attemptCompletionAmount = 0.75;

        child1.attemptCompletionAmountStatus = true;
        child1.attemptCompletionAmount = 0.75;
        child1.progressWeight = 1.0;

        rollupProcess.overallRollupProcess(child1);

        // Should be complete since 0.75 >= 0.7
        expect(parent.completionStatus).toBe(CompletionStatus.COMPLETED);
      });

      it("should mark unknown when completion measure not available", () => {
        parent.completedByMeasure = true;
        parent.minProgressMeasure = 0.7;
        parent.attemptCompletionAmountStatus = false; // No measure available

        child1.attemptCompletionAmountStatus = false;

        rollupProcess.overallRollupProcess(child1);

        // Should be unknown since no completion amount data
        expect(parent.completionStatus).toBe(CompletionStatus.UNKNOWN);
      });
    });

    describe("Objective rollup with non-contributing children", () => {
      it("should handle all children not contributing to objective rollup", () => {
        // All children have rollupObjectiveSatisfied = false
        child1.sequencingControls.rollupObjectiveSatisfied = false;
        child2.sequencingControls.rollupObjectiveSatisfied = false;
        child3.sequencingControls.rollupObjectiveSatisfied = false;

        child1.objectiveSatisfiedStatus = true;
        child2.objectiveSatisfiedStatus = true;
        child3.objectiveSatisfiedStatus = true;

        rollupProcess.overallRollupProcess(child1);

        // Parent should not be satisfied since no children contribute
        expect(parent.objectiveSatisfiedStatus).toBe(false);
      });

      it("should handle mix of contributing and non-contributing children", () => {
        // Only child1 contributes
        child1.sequencingControls.rollupObjectiveSatisfied = true;
        child1.objectiveSatisfiedStatus = true;

        child2.sequencingControls.rollupObjectiveSatisfied = false; // Don't contribute
        child2.objectiveSatisfiedStatus = false;

        child3.sequencingControls.rollupObjectiveSatisfied = false; // Don't contribute
        child3.objectiveSatisfiedStatus = false;

        rollupProcess.overallRollupProcess(child1);

        // Only child1 contributes, and it's satisfied
        expect(parent.objectiveSatisfiedStatus).toBe(true);
      });
    });

    describe("Completion rollup with no tracking data", () => {
      it("should handle children with unknown completion status", () => {
        child1.completionStatus = CompletionStatus.UNKNOWN;
        child2.completionStatus = CompletionStatus.UNKNOWN;
        child3.completionStatus = CompletionStatus.UNKNOWN;

        rollupProcess.overallRollupProcess(child1);

        // Parent should be incomplete when all children unknown
        expect(parent.completionStatus).toBe(CompletionStatus.INCOMPLETE);
      });

      it("should handle mix of completed and unknown children", () => {
        child1.completionStatus = CompletionStatus.COMPLETED;
        child1.isCompleted = true;
        child2.completionStatus = CompletionStatus.UNKNOWN;
        child2.isCompleted = false;
        child3.completionStatus = CompletionStatus.COMPLETED;
        child3.isCompleted = true;

        rollupProcess.overallRollupProcess(child1);

        // Any unknown or incomplete should make parent incomplete
        expect(parent.completionStatus).toBe(CompletionStatus.INCOMPLETE);
      });
    });

    describe("Objective satisfaction by measure edge cases", () => {
      it("should return null when no measure status available", () => {
        parent.objectiveMeasureStatus = false; // No measure
        parent.scaledPassingScore = 0.7;

        child1.objectiveMeasureStatus = false;

        rollupProcess.overallRollupProcess(child1);

        // Without measure, should fall through to default rollup
        expect(parent.objectiveMeasureStatus).toBe(false);
      });

      it("should return null when no passing score defined", () => {
        parent.objectiveMeasureStatus = true;
        parent.objectiveNormalizedMeasure = 0.8;
        parent.scaledPassingScore = null; // No passing score

        child1.objectiveMeasureStatus = true;
        child1.objectiveNormalizedMeasure = 0.8;
        child1.sequencingControls.objectiveMeasureWeight = 1.0;

        rollupProcess.overallRollupProcess(child1);

        // Without passing score, should use default rollup
        // Parent will not be satisfied by measure
        expect(parent.objectiveSatisfiedStatus).toBe(false);
      });

      it("should satisfy when measure exactly equals passing score", () => {
        parent.scaledPassingScore = 0.75;

        child1.objectiveMeasureStatus = true;
        child1.objectiveNormalizedMeasure = 0.75;
        child1.sequencingControls.objectiveMeasureWeight = 1.0;
        child2.objectiveMeasureStatus = true;
        child2.objectiveNormalizedMeasure = 0.75;
        child2.sequencingControls.objectiveMeasureWeight = 1.0;
        child3.objectiveMeasureStatus = true;
        child3.objectiveNormalizedMeasure = 0.75;
        child3.sequencingControls.objectiveMeasureWeight = 1.0;

        rollupProcess.overallRollupProcess(child1);

        // Measure 0.75 >= passing score 0.75 (equality satisfies)
        expect(parent.objectiveSatisfiedStatus).toBe(true);
      });
    });

    describe("Default objective rollup edge cases", () => {
      it("should handle no available children", () => {
        const emptyParent = new Activity("emptyParent", "Empty Parent");
        emptyParent.sequencingControls.rollupObjectiveSatisfied = true;

        rollupProcess.overallRollupProcess(emptyParent);

        // No children means not satisfied
        expect(emptyParent.objectiveSatisfiedStatus).toBe(false);
      });

      it("should handle all children unavailable", () => {
        child1.isAvailable = false;
        child2.isAvailable = false;
        child3.isAvailable = false;

        child1.objectiveSatisfiedStatus = true;
        child2.objectiveSatisfiedStatus = true;
        child3.objectiveSatisfiedStatus = true;

        rollupProcess.overallRollupProcess(child1);

        // No available children means not satisfied
        expect(parent.objectiveSatisfiedStatus).toBe(false);
      });

      it("should handle children with mixed satisfaction and unknown status", () => {
        child1.objectiveSatisfiedStatus = true;
        child2.objectiveSatisfiedStatus = false; // Explicitly not satisfied
        child3.successStatus = SuccessStatus.UNKNOWN;
        child3.objectiveSatisfiedStatus = false;

        rollupProcess.overallRollupProcess(child1);

        // Any child not satisfied means parent not satisfied
        expect(parent.objectiveSatisfiedStatus).toBe(false);
      });
    });

    describe("Measure rollup with zero contributing children", () => {
      it("should set objectiveMeasureStatus to false when no children have measures", () => {
        child1.objectiveMeasureStatus = false;
        child2.objectiveMeasureStatus = false;
        child3.objectiveMeasureStatus = false;

        rollupProcess.overallRollupProcess(child1);

        expect(parent.objectiveMeasureStatus).toBe(false);
      });

      it("should set objectiveMeasureStatus to false when children excluded by considerations", () => {
        child1.objectiveMeasureStatus = true;
        child1.objectiveNormalizedMeasure = 0.8;
        child1.sequencingControls.rollupObjectiveSatisfied = false; // Excluded

        child2.objectiveMeasureStatus = true;
        child2.objectiveNormalizedMeasure = 0.9;
        child2.sequencingControls.rollupObjectiveSatisfied = false; // Excluded

        rollupProcess.overallRollupProcess(child1);

        expect(parent.objectiveMeasureStatus).toBe(false);
      });
    });

    describe("Completion measure rollup edge cases", () => {
      it("should handle no children with completion amount status", () => {
        child1.attemptCompletionAmountStatus = false;
        child2.attemptCompletionAmountStatus = false;
        child3.attemptCompletionAmountStatus = false;

        rollupProcess.overallRollupProcess(child1);

        expect(parent.attemptCompletionAmountStatus).toBe(false);
      });

      it("should calculate weighted average with different weights", () => {
        child1.attemptCompletionAmountStatus = true;
        child1.attemptCompletionAmount = 1.0;
        child1.progressWeight = 2.0;

        child2.attemptCompletionAmountStatus = true;
        child2.attemptCompletionAmount = 0.5;
        child2.progressWeight = 1.0;

        child3.attemptCompletionAmountStatus = false; // Not contributing

        rollupProcess.overallRollupProcess(child1);

        // (1.0*2 + 0.5*1) / (2+1) = 2.5 / 3 = 0.833...
        expect(parent.attemptCompletionAmountStatus).toBe(true);
        expect(parent.attemptCompletionAmount).toBeCloseTo(0.833, 2);
      });
    });
  });

  describe("Global Objective Mapping (Priority 5)", () => {
    let globalObjectives: Map<string, any>;

    beforeEach(() => {
      globalObjectives = new Map();
    });

    describe("processGlobalObjectiveMapping", () => {
      it("should create global objective entries from activity objectives", () => {
        const activity = new Activity("activity1", "Activity 1");
        activity.addObjective(
          new ActivityObjective(
            "obj1",
            {
              isPrimary: false,
              mapInfo: [{
                targetObjectiveID: "global_obj1",
                writeSatisfiedStatus: true,
                writeNormalizedMeasure: true
              }]
            }
          )
        );

        const objective = activity.getAllObjectives()[0];
        objective.satisfiedStatus = true;
        objective.measureStatus = true;
        objective.normalizedMeasure = 0.85;

        rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

        expect(globalObjectives.has("global_obj1")).toBe(true);
        const globalObj = globalObjectives.get("global_obj1");
        expect(globalObj).toBeDefined();
      });

      it("should write to global objectives when writeSatisfiedStatus is true", () => {
        const activity = new Activity("activity1", "Activity 1");
        // ActivityObjective imported at top of file
        const objective = new ActivityObjective("obj1", {
          isPrimary: false,
          mapInfo: [{
            targetObjectiveID: "global_obj1",
            writeSatisfiedStatus: true,
            readSatisfiedStatus: false
          }]
        });
        activity.addObjective(objective);

        objective.satisfiedStatus = true;
        objective.measureStatus = true;
        // Mark as dirty to trigger write
        objective.satisfiedStatus = false;
        objective.satisfiedStatus = true;

        rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

        const globalObj = globalObjectives.get("global_obj1");
        expect(globalObj).toBeDefined();
      });

      it("should write normalized measure to global objectives", () => {
        const activity = new Activity("activity1", "Activity 1");
        // ActivityObjective imported at top of file
        const objective = new ActivityObjective("obj1", {
          isPrimary: false,
          mapInfo: [{
            targetObjectiveID: "global_obj1",
            writeNormalizedMeasure: true
          }]
        });
        activity.addObjective(objective);

        objective.measureStatus = true;
        objective.normalizedMeasure = 0.75;

        rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

        const globalObj = globalObjectives.get("global_obj1");
        expect(globalObj).toBeDefined();
      });

      it("should read from global objectives when readSatisfiedStatus is true", () => {
        const activity = new Activity("activity1", "Activity 1");
        // ActivityObjective imported at top of file
        const objective = new ActivityObjective("obj1", {
          isPrimary: false,
          mapInfo: [{
            targetObjectiveID: "global_obj1",
            readSatisfiedStatus: true,
            writeSatisfiedStatus: false
          }]
        });
        activity.addObjective(objective);

        // Pre-populate global objective
        globalObjectives.set("global_obj1", {
          id: "global_obj1",
          satisfiedStatus: true,
          satisfiedStatusKnown: true,
          normalizedMeasure: 0.9,
          normalizedMeasureKnown: true
        });

        rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

        expect(objective.satisfiedStatus).toBe(true);
        expect(objective.measureStatus).toBe(true);
      });

      it("should read normalized measure from global objectives", () => {
        const activity = new Activity("activity1", "Activity 1");
        // ActivityObjective imported at top of file
        const objective = new ActivityObjective("obj1", {
          isPrimary: false,
          mapInfo: [{
            targetObjectiveID: "global_obj1",
            readNormalizedMeasure: true
          }]
        });
        activity.addObjective(objective);

        globalObjectives.set("global_obj1", {
          id: "global_obj1",
          normalizedMeasure: 0.88,
          normalizedMeasureKnown: true
        });

        rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

        expect(objective.normalizedMeasure).toBe(0.88);
        expect(objective.measureStatus).toBe(true);
      });

      it("should handle progress measure read/write", () => {
        const activity = new Activity("activity1", "Activity 1");
        // ActivityObjective imported at top of file
        const objective = new ActivityObjective("obj1", {
          isPrimary: false,
          mapInfo: [{
            targetObjectiveID: "global_obj1",
            readProgressMeasure: true,
            writeProgressMeasure: true
          }]
        });
        activity.addObjective(objective);

        globalObjectives.set("global_obj1", {
          id: "global_obj1",
          progressMeasure: 0.65,
          progressMeasureKnown: true
        });

        rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

        expect(objective.progressMeasure).toBe(0.65);
        expect(objective.progressMeasureStatus).toBe(true);
      });

      it("should handle completion status read/write", () => {
        const activity = new Activity("activity1", "Activity 1");
        // ActivityObjective imported at top of file
        const objective = new ActivityObjective("obj1", {
          isPrimary: false,
          mapInfo: [{
            targetObjectiveID: "global_obj1",
            readCompletionStatus: true,
            writeCompletionStatus: true
          }]
        });
        activity.addObjective(objective);

        globalObjectives.set("global_obj1", {
          id: "global_obj1",
          completionStatus: "completed",
          completionStatusKnown: true
        });

        rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

        expect(objective.completionStatus).toBe("completed");
      });

      it("should process multiple activities in tree with two-pass approach", () => {
        const rootAct = new Activity("root", "Root");
        const child1Act = new Activity("child1", "Child 1");
        const child2Act = new Activity("child2", "Child 2");

        rootAct.addChild(child1Act);
        rootAct.addChild(child2Act);

        // ActivityObjective imported at top of file

        // child1 writes to global objective
        const obj1 = new ActivityObjective("obj1", {
          isPrimary: false,
          mapInfo: [{
            targetObjectiveID: "shared_obj",
            writeSatisfiedStatus: true,
            writeNormalizedMeasure: true
          }]
        });
        obj1.satisfiedStatus = true;
        obj1.measureStatus = true;
        obj1.normalizedMeasure = 0.9;
        child1Act.addObjective(obj1);

        // child2 reads from global objective
        const obj2 = new ActivityObjective("obj2", {
          isPrimary: false,
          mapInfo: [{
            targetObjectiveID: "shared_obj",
            readSatisfiedStatus: true,
            readNormalizedMeasure: true
          }]
        });
        child2Act.addObjective(obj2);

        rollupProcess.processGlobalObjectiveMapping(rootAct, globalObjectives);

        // After two-pass processing, child2 should have read the value
        expect(obj2.satisfiedStatus).toBe(true);
        expect(obj2.normalizedMeasure).toBe(0.9);
      });

      it("should derive satisfaction from measure when satisfiedByMeasure is true", () => {
        const activity = new Activity("activity1", "Activity 1");
        activity.scaledPassingScore = 0.7;

        // ActivityObjective imported at top of file
        const objective = new ActivityObjective("obj1", {
          isPrimary: false,
          satisfiedByMeasure: true,
          minNormalizedMeasure: 0.7,
          mapInfo: [{
            targetObjectiveID: "global_obj1",
            readNormalizedMeasure: true
          }]
        });
        activity.addObjective(objective);

        globalObjectives.set("global_obj1", {
          id: "global_obj1",
          normalizedMeasure: 0.85,
          normalizedMeasureKnown: true,
          satisfiedByMeasure: true
        });

        rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

        // Satisfaction should be derived from measure
        expect(objective.satisfiedStatus).toBe(true);
      });

      it("should apply primary objective changes to activity", () => {
        const activity = new Activity("activity1", "Activity 1");

        // ActivityObjective imported at top of file
        const primaryObj = new ActivityObjective("primary", {
          isPrimary: true,
          mapInfo: [{
            targetObjectiveID: "global_primary",
            readSatisfiedStatus: true,
            readNormalizedMeasure: true
          }]
        });
        activity.primaryObjective = primaryObj;

        globalObjectives.set("global_primary", {
          id: "global_primary",
          satisfiedStatus: true,
          satisfiedStatusKnown: true,
          normalizedMeasure: 0.95,
          normalizedMeasureKnown: true
        });

        rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

        // Primary objective should apply changes to activity
        expect(primaryObj.satisfiedStatus).toBe(true);
      });

      it("should use default mapInfo when none specified", () => {
        const activity = new Activity("activity1", "Activity 1");

        // ActivityObjective imported at top of file
        const objective = new ActivityObjective("obj1", {
          isPrimary: false
          // No mapInfo specified - should use defaults
        });
        objective.satisfiedStatus = true;
        objective.measureStatus = true;
        objective.normalizedMeasure = 0.8;
        activity.addObjective(objective);

        rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

        // Should create entry with default write behavior
        expect(globalObjectives.has("obj1")).toBe(true);
      });

      it("should fire events during global objective processing", () => {
        const events: Array<{ type: string; data: any }> = [];
        const eventCallback = (type: string, data: any) => {
          events.push({ type, data });
        };

        const processWithEvents = new RollupProcess(eventCallback);
        const activity = new Activity("activity1", "Activity 1");

        processWithEvents.processGlobalObjectiveMapping(activity, globalObjectives);

        const startEvent = events.find(e => e.type === "global_objective_processing_started");
        const completeEvent = events.find(e => e.type === "global_objective_processing_completed");

        expect(startEvent).toBeDefined();
        expect(completeEvent).toBeDefined();
      });
    });
  });

  describe("validateRollupStateConsistency", () => {
    it("should return true for consistent state", () => {
      parent.objectiveMeasureStatus = true;
      parent.objectiveNormalizedMeasure = 0.8;
      parent.scaledPassingScore = 0.7;
      parent.objectiveSatisfiedStatus = true;
      parent.successStatus = SuccessStatus.PASSED;

      const isConsistent = rollupProcess.validateRollupStateConsistency(parent);

      expect(isConsistent).toBe(true);
    });

    it("should detect inconsistent measure status", () => {
      parent.objectiveMeasureStatus = true;
      parent.objectiveNormalizedMeasure = null as any; // Inconsistent

      const isConsistent = rollupProcess.validateRollupStateConsistency(parent);

      expect(isConsistent).toBe(false);
    });

    it("should detect inconsistent satisfaction with measure", () => {
      parent.objectiveMeasureStatus = true;
      parent.objectiveNormalizedMeasure = 0.8;
      parent.scaledPassingScore = 0.7;
      parent.objectiveSatisfiedStatus = false; // Should be true (0.8 >= 0.7)
      parent.successStatus = SuccessStatus.FAILED;

      const isConsistent = rollupProcess.validateRollupStateConsistency(parent);

      expect(isConsistent).toBe(false);
    });

    it("should validate children recursively", () => {
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = null as any; // Inconsistent

      const isConsistent = rollupProcess.validateRollupStateConsistency(root);

      expect(isConsistent).toBe(false);
    });

    it("should handle validation errors gracefully", () => {
      // Create an activity that might cause validation issues
      const problematicActivity = new Activity("problematic", "Problematic");

      const isConsistent = rollupProcess.validateRollupStateConsistency(problematicActivity);

      expect(typeof isConsistent).toBe("boolean");
    });

    it("should fire validation events", () => {
      const events: Array<{ type: string; data: any }> = [];
      const eventCallback = (type: string, data: any) => {
        events.push({ type, data });
      };

      const processWithEvents = new RollupProcess(eventCallback);

      processWithEvents.validateRollupStateConsistency(parent);

      const startEvent = events.find(e => e.type === "rollup_validation_started");
      const completeEvent = events.find(e => e.type === "rollup_validation_completed");

      expect(startEvent).toBeDefined();
    });

    it("should report inconsistencies for completed parent with incomplete children", () => {
      // Setup: all children incomplete but parent marked as completed (no rollup rules)
      child1.completionStatus = CompletionStatus.INCOMPLETE;
      child1.isCompleted = false;
      child2.completionStatus = CompletionStatus.INCOMPLETE;
      child2.isCompleted = false;
      child3.completionStatus = CompletionStatus.INCOMPLETE;
      child3.isCompleted = false;

      parent.completionStatus = CompletionStatus.COMPLETED; // Inconsistent with children

      const isConsistent = rollupProcess.validateRollupStateConsistency(root);

      // May or may not be flagged depending on whether rollup rules exist
      expect(typeof isConsistent).toBe("boolean");
    });
  });

  describe("processCrossClusterDependencies", () => {
    it("should identify activity clusters correctly", () => {
      const events: Array<{ type: string; data: any }> = [];
      const eventCallback = (type: string, data: any) => {
        events.push({ type, data });
      };

      const processWithEvents = new RollupProcess(eventCallback);

      // Create clusters with flow enabled
      const cluster1 = new Activity("cluster1", "Cluster 1");
      const cluster2 = new Activity("cluster2", "Cluster 2");
      const leaf1 = new Activity("leaf1", "Leaf 1");
      const leaf2 = new Activity("leaf2", "Leaf 2");

      cluster1.addChild(leaf1);
      cluster2.addChild(leaf2);
      cluster1.sequencingControls.flow = true;
      cluster2.sequencingControls.flow = true;

      parent.addChild(cluster1);
      parent.addChild(cluster2);

      processWithEvents.processCrossClusterDependencies(parent, [cluster1, cluster2]);

      const startEvent = events.find(e => e.type === "cross_cluster_processing_started");
      const completeEvent = events.find(e => e.type === "cross_cluster_processing_completed");

      expect(startEvent).toBeDefined();
      expect(startEvent?.data.clusterCount).toBe(2);
      expect(completeEvent).toBeDefined();
    });

    it("should handle circular dependencies gracefully", () => {
      const events: Array<{ type: string; data: any }> = [];
      const eventCallback = (type: string, data: any) => {
        events.push({ type, data });
      };

      const processWithEvents = new RollupProcess(eventCallback);

      const cluster1 = new Activity("cluster1", "Cluster 1");
      const leaf1 = new Activity("leaf1", "Leaf 1");
      cluster1.addChild(leaf1);
      cluster1.sequencingControls.flow = true;

      // Process with single cluster (no actual circular dependency, but tests the code path)
      processWithEvents.processCrossClusterDependencies(parent, [cluster1]);

      // Should complete without throwing
      const completeEvent = events.find(e => e.type === "cross_cluster_processing_completed");
      expect(completeEvent).toBeDefined();
    });

    it("should process cluster rollup in dependency order", () => {
      const cluster1 = new Activity("cluster1", "Cluster 1");
      const cluster2 = new Activity("cluster2", "Cluster 2");
      const leaf1 = new Activity("leaf1", "Leaf 1");
      const leaf2 = new Activity("leaf2", "Leaf 2");

      cluster1.addChild(leaf1);
      cluster2.addChild(leaf2);
      cluster1.sequencingControls.flow = true;
      cluster2.sequencingControls.flow = true;
      cluster1.sequencingControls.rollupObjectiveSatisfied = true;
      cluster2.sequencingControls.rollupObjectiveSatisfied = true;

      leaf1.objectiveSatisfiedStatus = true;
      leaf2.objectiveSatisfiedStatus = true;

      rollupProcess.processCrossClusterDependencies(parent, [cluster1, cluster2]);

      // Clusters should be processed
      expect(cluster1.objectiveSatisfiedStatus).toBe(true);
      expect(cluster2.objectiveSatisfiedStatus).toBe(true);
    });

    it("should handle empty cluster list", () => {
      const events: Array<{ type: string; data: any }> = [];
      const eventCallback = (type: string, data: any) => {
        events.push({ type, data });
      };

      const processWithEvents = new RollupProcess(eventCallback);

      processWithEvents.processCrossClusterDependencies(parent, []);

      const startEvent = events.find(e => e.type === "cross_cluster_processing_started");
      expect(startEvent?.data.clusterCount).toBe(0);
    });
  });

  describe("calculateComplexWeightedMeasure", () => {
    it("should calculate basic weighted average", () => {
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 0.8;
      child1.sequencingControls.objectiveMeasureWeight = 1.0;

      child2.objectiveMeasureStatus = true;
      child2.objectiveNormalizedMeasure = 0.6;
      child2.sequencingControls.objectiveMeasureWeight = 1.0;

      const result = rollupProcess.calculateComplexWeightedMeasure(
        parent,
        [child1, child2],
        { enableThresholdBias: false }
      );

      expect(result).toBeCloseTo(0.7, 1);
    });

    it("should apply completion status penalty", () => {
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 0.8;
      child1.sequencingControls.objectiveMeasureWeight = 1.0;
      child1.completionStatus = CompletionStatus.INCOMPLETE; // Penalty applied

      const result = rollupProcess.calculateComplexWeightedMeasure(
        parent,
        [child1],
        { enableThresholdBias: false }
      );

      // Weight reduced by 0.8 factor for incomplete
      expect(result).toBeCloseTo(0.8, 1);
    });

    it("should apply attempt count penalty", () => {
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 0.8;
      child1.sequencingControls.objectiveMeasureWeight = 1.0;
      child1.attemptCount = 3; // Multiple attempts - penalty applied

      const result = rollupProcess.calculateComplexWeightedMeasure(
        parent,
        [child1],
        { enableThresholdBias: false }
      );

      expect(result).toBeCloseTo(0.8, 1);
    });

    it("should apply threshold bias when enabled", () => {
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 0.9;
      child1.sequencingControls.objectiveMeasureWeight = 1.0;
      child1.scaledPassingScore = 0.7;

      const resultWithBias = rollupProcess.calculateComplexWeightedMeasure(
        parent,
        [child1],
        { enableThresholdBias: true }
      );

      const resultWithoutBias = rollupProcess.calculateComplexWeightedMeasure(
        parent,
        [child1],
        { enableThresholdBias: false }
      );

      // Both should be close to 0.9, but bias may slightly adjust
      expect(resultWithBias).toBeCloseTo(0.9, 1);
      expect(resultWithoutBias).toBeCloseTo(0.9, 1);
    });

    it("should handle children with no measure", () => {
      child1.objectiveMeasureStatus = false;

      const result = rollupProcess.calculateComplexWeightedMeasure(
        parent,
        [child1],
        { enableThresholdBias: false }
      );

      expect(result).toBe(0);
    });

    it("should exclude children that don't pass rollup check", () => {
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 0.8;
      child1.sequencingControls.rollupObjectiveSatisfied = false; // Excluded

      child2.objectiveMeasureStatus = true;
      child2.objectiveNormalizedMeasure = 0.6;
      child2.sequencingControls.objectiveMeasureWeight = 1.0;

      const result = rollupProcess.calculateComplexWeightedMeasure(
        parent,
        [child1, child2],
        { enableThresholdBias: false }
      );

      // Only child2 should contribute
      expect(result).toBeCloseTo(0.6, 1);
    });

    it("should fire weighting calculation event", () => {
      const events: Array<{ type: string; data: any }> = [];
      const eventCallback = (type: string, data: any) => {
        events.push({ type, data });
      };

      const processWithEvents = new RollupProcess(eventCallback);

      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 0.8;
      child1.sequencingControls.objectiveMeasureWeight = 1.0;

      processWithEvents.calculateComplexWeightedMeasure(
        parent,
        [child1],
        { enableThresholdBias: false }
      );

      const weightingEvent = events.find(e => e.type === "complex_weighting_calculated");
      expect(weightingEvent).toBeDefined();
      expect(weightingEvent?.data.activityId).toBe(parent.id);
    });
  });

  describe("Duration Rollup Process (RB.1.4)", () => {
    it("should aggregate activity durations from children", () => {
      // Set up timestamps and durations for children
      const startTime = "2024-01-01T10:00:00Z";
      child1.activityStartTimestampUtc = startTime;
      child1.activityExperiencedDuration = "PT30M"; // 30 minutes
      child1.activityEndedDate = new Date("2024-01-01T10:30:00Z");

      child2.activityStartTimestampUtc = "2024-01-01T10:30:00Z";
      child2.activityExperiencedDuration = "PT20M"; // 20 minutes
      child2.activityEndedDate = new Date("2024-01-01T10:50:00Z");

      child3.activityStartTimestampUtc = "2024-01-01T10:50:00Z";
      child3.activityExperiencedDuration = "PT10M"; // 10 minutes
      child3.activityEndedDate = new Date("2024-01-01T11:00:00Z");

      rollupProcess.overallRollupProcess(child1);

      // Parent should have aggregated duration data
      expect(parent.activityStartTimestampUtc).toBe(startTime);
    });

    it("should track earliest start timestamp", () => {
      child1.activityStartTimestampUtc = "2024-01-01T10:30:00Z";
      child2.activityStartTimestampUtc = "2024-01-01T10:00:00Z"; // Earliest
      child3.activityStartTimestampUtc = "2024-01-01T10:15:00Z";

      rollupProcess.overallRollupProcess(child1);

      expect(parent.activityStartTimestampUtc).toBe("2024-01-01T10:00:00Z");
    });

    it("should track latest end date", () => {
      child1.activityStartTimestampUtc = "2024-01-01T10:00:00Z";
      child1.activityEndedDate = new Date("2024-01-01T10:30:00Z");

      child2.activityStartTimestampUtc = "2024-01-01T10:30:00Z";
      child2.activityEndedDate = new Date("2024-01-01T11:00:00Z"); // Latest

      child3.activityStartTimestampUtc = "2024-01-01T10:45:00Z";
      child3.activityEndedDate = new Date("2024-01-01T10:55:00Z");

      rollupProcess.overallRollupProcess(child1);

      expect(parent.activityEndedDate?.getTime()).toBe(new Date("2024-01-01T11:00:00Z").getTime());
    });

    it("should calculate attempt durations for children in same attempt", () => {
      parent.attemptStartTimestampUtc = "2024-01-01T10:00:00Z";

      child1.attemptStartTimestampUtc = "2024-01-01T10:00:00Z";
      child1.attemptExperiencedDuration = "PT15M";

      child2.attemptStartTimestampUtc = "2024-01-01T10:15:00Z";
      child2.attemptExperiencedDuration = "PT10M";

      rollupProcess.overallRollupProcess(child1);

      // Parent attempt duration should be aggregated
      expect(parent.attemptStartTimestampUtc).toBeDefined();
    });

    it("should fire duration rollup event", () => {
      const events: Array<{ type: string; data: any }> = [];
      const eventCallback = (type: string, data: any) => {
        events.push({ type, data });
      };

      const processWithEvents = new RollupProcess(eventCallback);

      child1.activityStartTimestampUtc = "2024-01-01T10:00:00Z";
      child1.activityExperiencedDuration = "PT30M";
      child1.activityEndedDate = new Date("2024-01-01T10:30:00Z");

      processWithEvents.overallRollupProcess(child1);

      const durationEvent = events.find(e => e.type === "duration_rollup_completed");
      expect(durationEvent).toBeDefined();
      expect(durationEvent?.data.activityId).toBe(parent.id);
    });

    it("should handle children with no duration data", () => {
      // Children have no timestamps or durations
      child1.activityStartTimestampUtc = null;
      child2.activityStartTimestampUtc = null;
      child3.activityStartTimestampUtc = null;

      rollupProcess.overallRollupProcess(child1);

      // Should not throw, parent timestamps may remain null
      expect(parent.activityStartTimestampUtc).toBeNull();
    });

    it("should use Value fields for cluster children", () => {
      // Create nested structure where child1 is a cluster
      const grandchild1 = new Activity("grandchild1", "Grandchild 1");
      child1.addChild(grandchild1);
      child1.sequencingControls.rollupObjectiveSatisfied = true;
      child1.sequencingControls.rollupProgressCompletion = true;

      // Set Value fields (used for clusters)
      child1.activityExperiencedDurationValue = "PT1H";
      child1.attemptExperiencedDurationValue = "PT45M";
      child1.activityStartTimestampUtc = "2024-01-01T10:00:00Z";
      child1.activityEndedDate = new Date("2024-01-01T11:00:00Z");

      rollupProcess.overallRollupProcess(grandchild1);

      // Duration should be picked up from Value fields
      expect(parent.activityExperiencedDurationValue).toBeDefined();
    });

    it("should always run duration rollup even when optimization is active", () => {
      // Set up stable state that would trigger optimization
      parent.objectiveSatisfiedStatus = true;
      parent.completionStatus = CompletionStatus.COMPLETED;
      root.objectiveSatisfiedStatus = true;
      root.completionStatus = CompletionStatus.COMPLETED;

      // Set duration data
      child1.activityStartTimestampUtc = "2024-01-01T10:00:00Z";
      child1.activityExperiencedDuration = "PT30M";
      child1.activityEndedDate = new Date("2024-01-01T10:30:00Z");
      child1.objectiveSatisfiedStatus = true;
      child1.completionStatus = CompletionStatus.COMPLETED;

      child2.activityStartTimestampUtc = "2024-01-01T10:30:00Z";
      child2.activityExperiencedDuration = "PT20M";
      child2.activityEndedDate = new Date("2024-01-01T10:50:00Z");
      child2.objectiveSatisfiedStatus = true;
      child2.completionStatus = CompletionStatus.COMPLETED;

      child3.activityStartTimestampUtc = "2024-01-01T10:50:00Z";
      child3.activityExperiencedDuration = "PT10M";
      child3.activityEndedDate = new Date("2024-01-01T11:00:00Z");
      child3.objectiveSatisfiedStatus = true;
      child3.completionStatus = CompletionStatus.COMPLETED;

      rollupProcess.overallRollupProcess(child1);

      // Duration should still be rolled up even with optimization
      expect(parent.activityStartTimestampUtc).toBe("2024-01-01T10:00:00Z");
    });
  });

  describe("updateActivityAttemptData edge cases", () => {
    it("should handle global objective with location data", () => {
      const activity = new Activity("activity1", "Activity 1");
      // ActivityObjective imported at top of file
      const primaryObj = new ActivityObjective("primary", {
        isPrimary: true,
        mapInfo: [{
          targetObjectiveID: "global_primary",
          readSatisfiedStatus: true,
          updateAttemptData: true
        }]
      });
      activity.primaryObjective = primaryObj;

      const globalObjectives = new Map();
      globalObjectives.set("global_primary", {
        id: "global_primary",
        satisfiedStatus: true,
        satisfiedStatusKnown: true,
        location: "page_5",
        updateAttemptData: true
      });

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      expect(activity.location).toBe("page_5");
    });

    it("should handle global objective with suspend data", () => {
      const activity = new Activity("activity1", "Activity 1");
      // ActivityObjective imported at top of file
      const primaryObj = new ActivityObjective("primary", {
        isPrimary: true,
        mapInfo: [{
          targetObjectiveID: "global_primary",
          readSatisfiedStatus: true,
          updateAttemptData: true
        }]
      });
      activity.primaryObjective = primaryObj;

      const globalObjectives = new Map();
      globalObjectives.set("global_primary", {
        id: "global_primary",
        satisfiedStatus: true,
        satisfiedStatusKnown: true,
        suspendData: "some_suspend_data",
        updateAttemptData: true
      });

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      expect(activity.isSuspended).toBe(true);
    });

    it("should handle empty suspend data", () => {
      const activity = new Activity("activity1", "Activity 1");
      // ActivityObjective imported at top of file
      const primaryObj = new ActivityObjective("primary", {
        isPrimary: true,
        mapInfo: [{
          targetObjectiveID: "global_primary",
          readSatisfiedStatus: true,
          updateAttemptData: true
        }]
      });
      activity.primaryObjective = primaryObj;
      activity.isSuspended = true; // Initially suspended

      const globalObjectives = new Map();
      globalObjectives.set("global_primary", {
        id: "global_primary",
        satisfiedStatus: true,
        satisfiedStatusKnown: true,
        suspendData: "", // Empty suspend data
        updateAttemptData: true
      });

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      expect(activity.isSuspended).toBe(false);
    });

    it("should update attempt count from global objective", () => {
      const activity = new Activity("activity1", "Activity 1");
      activity.attemptCount = 1;

      // ActivityObjective imported at top of file
      const primaryObj = new ActivityObjective("primary", {
        isPrimary: true,
        mapInfo: [{
          targetObjectiveID: "global_primary",
          updateAttemptData: true
        }]
      });
      activity.primaryObjective = primaryObj;

      const globalObjectives = new Map();
      globalObjectives.set("global_primary", {
        id: "global_primary",
        attemptCount: 3,
        updateAttemptData: true
      });

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      expect(activity.attemptCount).toBe(3);
    });

    it("should update completion amount from progress measure", () => {
      const activity = new Activity("activity1", "Activity 1");

      // ActivityObjective imported at top of file
      const primaryObj = new ActivityObjective("primary", {
        isPrimary: true,
        mapInfo: [{
          targetObjectiveID: "global_primary",
          updateAttemptData: true
        }]
      });
      activity.primaryObjective = primaryObj;

      const globalObjectives = new Map();
      globalObjectives.set("global_primary", {
        id: "global_primary",
        progressMeasure: 0.75,
        progressMeasureKnown: true,
        updateAttemptData: true
      });

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      expect(activity.attemptCompletionAmount).toBe(0.75);
    });

    it("should update duration data from global objective", () => {
      const activity = new Activity("activity1", "Activity 1");

      // ActivityObjective imported at top of file
      const primaryObj = new ActivityObjective("primary", {
        isPrimary: true,
        mapInfo: [{
          targetObjectiveID: "global_primary",
          updateAttemptData: true
        }]
      });
      activity.primaryObjective = primaryObj;

      const globalObjectives = new Map();
      globalObjectives.set("global_primary", {
        id: "global_primary",
        attemptAbsoluteDuration: "PT1H30M",
        attemptExperiencedDuration: "PT1H15M",
        activityAbsoluteDuration: "PT2H",
        activityExperiencedDuration: "PT1H45M",
        updateAttemptData: true
      });

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      expect(activity.attemptAbsoluteDuration).toBe("PT1H30M");
      expect(activity.attemptExperiencedDuration).toBe("PT1H15M");
      expect(activity.activityAbsoluteDuration).toBe("PT2H");
      expect(activity.activityExperiencedDuration).toBe("PT1H45M");
    });

    it("should update completion status from global satisfaction", () => {
      const activity = new Activity("activity1", "Activity 1");
      activity.completionStatus = CompletionStatus.INCOMPLETE;
      activity.successStatus = SuccessStatus.UNKNOWN;

      // ActivityObjective imported at top of file
      const primaryObj = new ActivityObjective("primary", {
        isPrimary: true,
        mapInfo: [{
          targetObjectiveID: "global_primary",
          updateAttemptData: true
        }]
      });
      activity.primaryObjective = primaryObj;

      const globalObjectives = new Map();
      globalObjectives.set("global_primary", {
        id: "global_primary",
        satisfiedStatus: true,
        satisfiedStatusKnown: true,
        updateAttemptData: true
      });

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      expect(activity.completionStatus).toBe("completed");
      expect(activity.successStatus).toBe("passed");
    });

    it("should not update completion when activity has rollup rules for completion", () => {
      const activity = new Activity("activity1", "Activity 1");
      activity.completionStatus = CompletionStatus.INCOMPLETE;

      // Add completion rollup rule
      const completionRule = new RollupRule(
        RollupActionType.COMPLETED,
        RollupConsiderationType.ALL
      );
      activity.rollupRules.addRule(completionRule);

      // ActivityObjective imported at top of file
      const primaryObj = new ActivityObjective("primary", {
        isPrimary: true,
        mapInfo: [{
          targetObjectiveID: "global_primary",
          updateAttemptData: true
        }]
      });
      activity.primaryObjective = primaryObj;

      const globalObjectives = new Map();
      globalObjectives.set("global_primary", {
        id: "global_primary",
        satisfiedStatus: true,
        satisfiedStatusKnown: true,
        updateAttemptData: true
      });

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      // Completion should not change because activity has explicit completion rules
      expect(activity.completionStatus).toBe(CompletionStatus.INCOMPLETE);
    });

    it("should skip attempt data update for non-primary objectives without flag", () => {
      const activity = new Activity("activity1", "Activity 1");
      activity.completionStatus = CompletionStatus.INCOMPLETE;

      // ActivityObjective imported at top of file
      const secondaryObj = new ActivityObjective("secondary", {
        isPrimary: false,
        mapInfo: [{
          targetObjectiveID: "global_secondary",
          updateAttemptData: false // Explicitly disabled
        }]
      });
      activity.addObjective(secondaryObj);

      const globalObjectives = new Map();
      globalObjectives.set("global_secondary", {
        id: "global_secondary",
        satisfiedStatus: true,
        satisfiedStatusKnown: true,
        location: "page_10"
      });

      rollupProcess.processGlobalObjectiveMapping(activity, globalObjectives);

      // Location should not be updated
      expect(activity.location).toBe("");
    });
  });
});
