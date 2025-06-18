import { describe, it, expect, beforeEach } from "vitest";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { 
  RollupRule,
  RollupCondition,
  RollupConditionType,
  RollupActionType,
  RollupConsiderationType,
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
});