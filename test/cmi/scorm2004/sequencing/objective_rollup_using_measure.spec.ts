import { beforeEach, describe, expect, it } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import {
  RollupActionType,
  RollupCondition,
  RollupConditionType,
  RollupRule,
  RollupRules
} from "../../../../src/cmi/scorm2004/sequencing/rollup_rules";
import { SuccessStatus } from "../../../../src/constants/enums";

describe("Objective Rollup Using Measure (RB.1.2.a)", () => {
  let parentActivity: Activity;
  let rollupRules: RollupRules;
  let child1: Activity;
  let child2: Activity;
  let child3: Activity;

  beforeEach(() => {
    // Create parent activity
    parentActivity = new Activity("parent", "Parent Activity");
    rollupRules = new RollupRules();

    // Create child activities
    child1 = new Activity("child1", "Child 1");
    child2 = new Activity("child2", "Child 2");
    child3 = new Activity("child3", "Child 3");

    // Add children to parent
    parentActivity.addChild(child1);
    parentActivity.addChild(child2);
    parentActivity.addChild(child3);

    // Set default configurations
    parentActivity.sequencingControls.rollupObjectiveSatisfied = true;
    parentActivity.sequencingControls.objectiveMeasureWeight = 1.0;
    parentActivity.scaledPassingScore = 0.7; // 70% passing score

    // Enable rollup for all children by default
    child1.sequencingControls.rollupObjectiveSatisfied = true;
    child2.sequencingControls.rollupObjectiveSatisfied = true;
    child3.sequencingControls.rollupObjectiveSatisfied = true;

    // Set default weights for children
    child1.sequencingControls.objectiveMeasureWeight = 1.0;
    child2.sequencingControls.objectiveMeasureWeight = 1.0;
    child3.sequencingControls.objectiveMeasureWeight = 1.0;
  });

  describe("Basic Measure Rollup", () => {
    it("should calculate weighted average when all children have measures", () => {
      // Set child measures
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 0.8;

      child2.objectiveMeasureStatus = true;
      child2.objectiveNormalizedMeasure = 0.9;

      child3.objectiveMeasureStatus = true;
      child3.objectiveNormalizedMeasure = 0.7;

      // Process rollup
      rollupRules.processRollup(parentActivity);

      // Check results
      expect(parentActivity.objectiveMeasureStatus).toBe(true);
      expect(parentActivity.objectiveNormalizedMeasure).toBeCloseTo(0.8); // (0.8 + 0.9 + 0.7) / 3
      expect(parentActivity.successStatus).toBe(SuccessStatus.PASSED);
      expect(parentActivity.objectiveSatisfiedStatus).toBe(true);
    });

    it("should mark as failed when average is below passing score", () => {
      // Set child measures
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 0.5;

      child2.objectiveMeasureStatus = true;
      child2.objectiveNormalizedMeasure = 0.6;

      child3.objectiveMeasureStatus = true;
      child3.objectiveNormalizedMeasure = 0.4;

      // Process rollup
      rollupRules.processRollup(parentActivity);

      // Check results
      expect(parentActivity.objectiveMeasureStatus).toBe(true);
      expect(parentActivity.objectiveNormalizedMeasure).toBeCloseTo(0.5); // (0.5 + 0.6 + 0.4) / 3
      expect(parentActivity.successStatus).toBe(SuccessStatus.FAILED);
      expect(parentActivity.objectiveSatisfiedStatus).toBe(false);
    });
  });

  describe("Weighted Measure Rollup", () => {
    it("should apply different weights to children", () => {
      // Set different weights
      child1.sequencingControls.objectiveMeasureWeight = 2.0;
      child2.sequencingControls.objectiveMeasureWeight = 1.0;
      child3.sequencingControls.objectiveMeasureWeight = 3.0;

      // Set child measures
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 0.6;

      child2.objectiveMeasureStatus = true;
      child2.objectiveNormalizedMeasure = 0.8;

      child3.objectiveMeasureStatus = true;
      child3.objectiveNormalizedMeasure = 0.9;

      // Process rollup
      rollupRules.processRollup(parentActivity);

      // Expected: (0.6*2 + 0.8*1 + 0.9*3) / (2+1+3) = (1.2 + 0.8 + 2.7) / 6 = 4.7/6 = 0.783333...
      expect(parentActivity.objectiveMeasureStatus).toBe(true);
      expect(parentActivity.objectiveNormalizedMeasure).toBeCloseTo(0.7833333, 5);
      expect(parentActivity.successStatus).toBe(SuccessStatus.PASSED);
    });

    it("should ignore children with zero weight", () => {
      // Set weights
      child1.sequencingControls.objectiveMeasureWeight = 1.0;
      child2.sequencingControls.objectiveMeasureWeight = 0.0; // Zero weight
      child3.sequencingControls.objectiveMeasureWeight = 1.0;

      // Set child measures
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 0.8;

      child2.objectiveMeasureStatus = true;
      child2.objectiveNormalizedMeasure = 0.0; // This should be ignored

      child3.objectiveMeasureStatus = true;
      child3.objectiveNormalizedMeasure = 0.8;

      // Process rollup
      rollupRules.processRollup(parentActivity);

      // Expected: (0.8*1 + 0.8*1) / (1+1) = 0.8
      expect(parentActivity.objectiveNormalizedMeasure).toBeCloseTo(0.8);
      expect(parentActivity.successStatus).toBe(SuccessStatus.PASSED);
    });
  });

  describe("Partial Measure Rollup", () => {
    it("should only include children with valid measures", () => {
      // Only set measures for some children
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 0.9;

      child2.objectiveMeasureStatus = false; // No measure

      child3.objectiveMeasureStatus = true;
      child3.objectiveNormalizedMeasure = 0.7;

      // Process rollup
      rollupRules.processRollup(parentActivity);

      // Expected: (0.9 + 0.7) / 2 = 0.8
      expect(parentActivity.objectiveNormalizedMeasure).toBeCloseTo(0.8);
      expect(parentActivity.successStatus).toBe(SuccessStatus.PASSED);
    });

    it("should exclude children with rollupObjectiveSatisfied = false", () => {
      // Disable rollup for child2
      child2.sequencingControls.rollupObjectiveSatisfied = false;

      // Set child measures
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 0.8;

      child2.objectiveMeasureStatus = true;
      child2.objectiveNormalizedMeasure = 0.0; // Should be excluded

      child3.objectiveMeasureStatus = true;
      child3.objectiveNormalizedMeasure = 0.8;

      // Process rollup
      rollupRules.processRollup(parentActivity);

      // Expected: (0.8 + 0.8) / 2 = 0.8
      expect(parentActivity.objectiveNormalizedMeasure).toBeCloseTo(0.8);
      expect(parentActivity.successStatus).toBe(SuccessStatus.PASSED);
    });
  });

  describe("Edge Cases", () => {
    it("should not use measure rollup when parent objectiveMeasureWeight is 0", () => {
      parentActivity.sequencingControls.objectiveMeasureWeight = 0.0;

      // Set child measures
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 0.8;

      child2.objectiveMeasureStatus = true;
      child2.objectiveNormalizedMeasure = 0.9;

      // Process rollup
      rollupRules.processRollup(parentActivity);

      // Should fall back to default rollup
      expect(parentActivity.objectiveMeasureStatus).toBe(false);
      expect(parentActivity.successStatus).toBe(SuccessStatus.UNKNOWN);
    });

    it("should not use measure rollup when no children have valid measures", () => {
      // No children have measures
      child1.objectiveMeasureStatus = false;
      child2.objectiveMeasureStatus = false;
      child3.objectiveMeasureStatus = false;

      // Process rollup
      rollupRules.processRollup(parentActivity);

      // Should fall back to default rollup
      expect(parentActivity.objectiveMeasureStatus).toBe(false);
    });

    it("should handle negative measures correctly", () => {
      // Set child measures with negative values
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = -0.5;

      child2.objectiveMeasureStatus = true;
      child2.objectiveNormalizedMeasure = 0.5;

      child3.objectiveMeasureStatus = true;
      child3.objectiveNormalizedMeasure = 0.0;

      // Process rollup
      rollupRules.processRollup(parentActivity);

      // Expected: (-0.5 + 0.5 + 0.0) / 3 = 0
      expect(parentActivity.objectiveNormalizedMeasure).toBeCloseTo(0);
      expect(parentActivity.successStatus).toBe(SuccessStatus.FAILED);
    });

    it("should handle scaled passing score of 1.0", () => {
      parentActivity.scaledPassingScore = 1.0;

      // Set child measures
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 1.0;

      child2.objectiveMeasureStatus = true;
      child2.objectiveNormalizedMeasure = 1.0;

      child3.objectiveMeasureStatus = true;
      child3.objectiveNormalizedMeasure = 0.99;

      // Process rollup
      rollupRules.processRollup(parentActivity);

      // Expected: (1.0 + 1.0 + 0.99) / 3 = 0.997
      expect(parentActivity.objectiveNormalizedMeasure).toBeCloseTo(0.997, 3);
      expect(parentActivity.successStatus).toBe(SuccessStatus.FAILED);
    });

    it("should handle scaled passing score of -1.0", () => {
      parentActivity.scaledPassingScore = -1.0;

      // Set child measures
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = -0.5;

      child2.objectiveMeasureStatus = true;
      child2.objectiveNormalizedMeasure = -0.8;

      child3.objectiveMeasureStatus = true;
      child3.objectiveNormalizedMeasure = -0.9;

      // Process rollup
      rollupRules.processRollup(parentActivity);

      // Expected: (-0.5 + -0.8 + -0.9) / 3 = -0.733
      expect(parentActivity.objectiveNormalizedMeasure).toBeCloseTo(-0.733, 2);
      expect(parentActivity.successStatus).toBe(SuccessStatus.PASSED); // -0.733 >= -1.0
    });
  });

  describe("Integration with Rule-based Rollup", () => {
    it("should skip rule-based rollup when measure rollup succeeds", () => {
      // Add a rule that would normally fail the activity
      const rule = new RollupRule(RollupActionType.NOT_SATISFIED);
      rule.addCondition(new RollupCondition(RollupConditionType.ALWAYS));
      rollupRules.addRule(rule);

      // Set child measures
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 0.8;

      child2.objectiveMeasureStatus = true;
      child2.objectiveNormalizedMeasure = 0.9;

      child3.objectiveMeasureStatus = true;
      child3.objectiveNormalizedMeasure = 0.8;

      // Process rollup
      rollupRules.processRollup(parentActivity);

      // Measure rollup should take precedence
      expect(parentActivity.successStatus).toBe(SuccessStatus.PASSED);
      expect(parentActivity.objectiveSatisfiedStatus).toBe(true);
    });

    it("should fall back to rule-based rollup when measure rollup is not applicable", () => {
      // Disable rollup objective satisfied
      parentActivity.sequencingControls.rollupObjectiveSatisfied = false;

      // Add a rule
      const rule = new RollupRule(RollupActionType.SATISFIED);
      rule.addCondition(new RollupCondition(RollupConditionType.ALWAYS));
      rollupRules.addRule(rule);

      // Set child measures (should be ignored)
      child1.objectiveMeasureStatus = true;
      child1.objectiveNormalizedMeasure = 0.0;

      // Process rollup
      rollupRules.processRollup(parentActivity);

      // Should use rule-based rollup
      expect(parentActivity.successStatus).toBe(SuccessStatus.PASSED);
      expect(parentActivity.objectiveMeasureStatus).toBe(false); // Measure not set
    });
  });
});
