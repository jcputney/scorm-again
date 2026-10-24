import { beforeEach, describe, expect, it } from "vitest";
import { Activity, ActivityObjective } from "../../../../src/cmi/scorm2004/sequencing/activity";
import {
  RollupActionType,
  RollupCondition,
  RollupConditionType,
  RollupConditionOperator,
  RollupConsiderationType,
  RollupRule,
  RollupRules,
} from "../../../../src/cmi/scorm2004/sequencing/rollup_rules";
import { RollupChildFilter } from "../../../../src/cmi/scorm2004/sequencing/rollup/rollup_child_filter";
import { RollupRuleEvaluator } from "../../../../src/cmi/scorm2004/sequencing/rollup/rollup_rule_evaluator";
import { ObjectiveRollupProcessor } from "../../../../src/cmi/scorm2004/sequencing/rollup/objective_rollup";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
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
    parentActivity.primaryObjective = new ActivityObjective("primary", {
      isPrimary: true,
      satisfiedByMeasure: true,
      minNormalizedMeasure: 0.7,
    });
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

  it("ignores a stale passing measure when the measure status is unknown", () => {
    parentActivity.objectiveNormalizedMeasure = 0.9;
    parentActivity.objectiveMeasureStatus = false;

    const filter = new RollupChildFilter();
    const evaluator = new RollupRuleEvaluator(filter);
    new ObjectiveRollupProcessor(filter, evaluator).objectiveRollupProcess(parentActivity);

    expect(parentActivity.objectiveSatisfiedStatusKnown).toBe(false);
    expect(parentActivity.objectiveSatisfiedStatus).toBe(false);
  });
});

describe("Objective rollup method selection", () => {
  function cluster(byMeasure = true, threshold = 0.8) {
    const parent = new Activity("parent", "Parent");
    parent.primaryObjective = new ActivityObjective("primary", {
      isPrimary: true,
      satisfiedByMeasure: byMeasure,
      minNormalizedMeasure: threshold,
    });
    parent.scaledPassingScore = threshold;
    const children = [new Activity("c1", "Child 1"), new Activity("c2", "Child 2")];
    for (const child of children) parent.addChild(child);
    return { parent, children };
  }

  function notSatisfiedRule(parent: Activity) {
    const rule = new RollupRule(RollupActionType.NOT_SATISFIED, RollupConsiderationType.ANY);
    rule.addCondition(
      new RollupCondition(RollupConditionType.SATISFIED, new Map(), RollupConditionOperator.NOT),
    );
    parent.rollupRules.addRule(rule);
  }

  it.each([true, false])("uses the passing measure with explicit rules: %s", (withRules) => {
    const { parent, children } = cluster();
    children[0].objectiveNormalizedMeasure = 1.0;
    children[1].objectiveNormalizedMeasure = 0.8;
    children.forEach((child) => {
      child.objectiveMeasureStatus = true;
    });
    children[0].objectiveSatisfiedStatus = true;
    children[1].objectiveSatisfiedStatus = false;
    if (withRules) notSatisfiedRule(parent);

    new RollupProcess().overallRollupProcess(children[0]);

    expect(parent.objectiveNormalizedMeasure).toBeCloseTo(0.9);
    expect(parent.objectiveSatisfiedStatusKnown).toBe(true);
    expect(parent.objectiveSatisfiedStatus).toBe(true);
    expect(parent.primaryObjective?.satisfiedStatus).toBe(true);
  });

  it.each([true, false])(
    "clears a previously known status when the measure is unknown: %s",
    (previous) => {
      const { parent, children } = cluster(true, 0.6);
      parent.objectiveSatisfiedStatus = previous;
      children.forEach((child) => {
        child.objectiveSatisfiedStatus = true;
      });
      notSatisfiedRule(parent);

      new RollupProcess().overallRollupProcess(children[0]);

      expect(parent.objectiveMeasureStatus).toBe(false);
      expect(parent.objectiveSatisfiedStatusKnown).toBe(false);
      expect(parent.successStatus).toBe(SuccessStatus.UNKNOWN);
      expect(parent.primaryObjective?.satisfiedStatusKnown).toBe(false);
    },
  );

  it("carries a cluster's change to unknown satisfaction up to the root", () => {
    // Only the middle cluster's Known flag changes. Its measure and satisfaction
    // value stay the same, and rollup must still reach the course.
    const { parent: middle, children } = cluster(true, 0.6);
    const course = new Activity("course", "Course");
    course.addChild(middle);
    const leaf = new Activity("leaf", "Leaf");
    children[0].addChild(leaf);
    const rule = new RollupRule(RollupActionType.NOT_SATISFIED, RollupConsiderationType.ANY);
    rule.addCondition(
      new RollupCondition(
        RollupConditionType.OBJECTIVE_STATUS_KNOWN,
        new Map(),
        RollupConditionOperator.NOT,
      ),
    );
    course.rollupRules.addRule(rule);
    middle.objectiveSatisfiedStatus = true;
    course.objectiveSatisfiedStatus = true;

    new RollupProcess().overallRollupProcess(leaf);

    expect(middle.objectiveSatisfiedStatusKnown).toBe(false);
    expect(course.objectiveSatisfiedStatusKnown).toBe(true);
    expect(course.objectiveSatisfiedStatus).toBe(false);
  });

  it.each([undefined, true, false])(
    "preserves status when the only satisfaction rule does not fire: %s",
    (previous) => {
      const { parent, children } = cluster(false);
      if (previous !== undefined) parent.objectiveSatisfiedStatus = previous;
      const rule = new RollupRule(RollupActionType.SATISFIED, RollupConsiderationType.ALL);
      rule.addCondition(new RollupCondition(RollupConditionType.SATISFIED));
      parent.rollupRules.addRule(rule);
      children[0].objectiveSatisfiedStatus = true;
      children[1].objectiveSatisfiedStatus = false;

      new RollupProcess().overallRollupProcess(children[1]);

      expect(parent.objectiveSatisfiedStatusKnown).toBe(previous !== undefined);
      expect(parent.objectiveSatisfiedStatus).toBe(previous ?? false);
    },
  );

  it("uses a firing notSatisfied rule without measure-based satisfaction", () => {
    const { parent, children } = cluster(false);
    children[0].objectiveSatisfiedStatus = true;
    children[1].objectiveSatisfiedStatus = false;
    notSatisfiedRule(parent);

    new RollupProcess().overallRollupProcess(children[1]);

    expect(parent.objectiveSatisfiedStatusKnown).toBe(true);
    expect(parent.objectiveSatisfiedStatus).toBe(false);
  });

  it("lets a firing satisfied rule override a firing notSatisfied rule", () => {
    const { parent, children } = cluster(false);
    children[0].objectiveSatisfiedStatus = true;
    children[1].objectiveSatisfiedStatus = false;
    notSatisfiedRule(parent);
    const rule = new RollupRule(RollupActionType.SATISFIED, RollupConsiderationType.ANY);
    rule.addCondition(new RollupCondition(RollupConditionType.SATISFIED));
    parent.rollupRules.addRule(rule);

    new RollupProcess().overallRollupProcess(children[1]);

    expect(parent.objectiveSatisfiedStatusKnown).toBe(true);
    expect(parent.objectiveSatisfiedStatus).toBe(true);
  });
});
