import { beforeEach, describe, expect, it } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { RollupChildFilter } from "../../../../src/cmi/scorm2004/sequencing/rollup/rollup_child_filter";
import { RollupRuleEvaluator } from "../../../../src/cmi/scorm2004/sequencing/rollup/rollup_rule_evaluator";
import { ObjectiveRollupProcessor } from "../../../../src/cmi/scorm2004/sequencing/rollup/objective_rollup";

/**
 * Regression coverage for the default objective rollup subprocess (RB.1.2.c)
 * collapsing "unknown" and "known not satisfied" contributors into the same
 * "not satisfied" result.
 *
 * Reproduction shape mirrors the ADL "Golf Explained - Simple Remediation"
 * sample: a cluster with content leaves (rollupObjectiveSatisfied=false,
 * objectiveMeasureWeight=0, excluded from objective rollup entirely) and test
 * leaves (rollupObjectiveSatisfied=true, contribute to objective rollup). The
 * learner attempts only one test leaf; the rest are never attempted this
 * parent attempt, so their objective status must stay unknown rather than
 * being read as "failed".
 */
describe("Objective Rollup Using Default (RB.1.2.c)", () => {
  let processor: ObjectiveRollupProcessor;
  let contentWrapper: Activity;
  let contentLeaves: Activity[];
  let testLeaves: Activity[];

  beforeEach(() => {
    const childFilter = new RollupChildFilter();
    const ruleEvaluator = new RollupRuleEvaluator(childFilter);
    processor = new ObjectiveRollupProcessor(childFilter, ruleEvaluator);

    contentWrapper = new Activity("content_wrapper", "Content Wrapper");
    contentWrapper.sequencingControls.rollupObjectiveSatisfied = true;

    // Content leaves: excluded from objective rollup entirely (rollupObjectiveSatisfied=false),
    // exactly like the ADL Golf Explained sample's content SCOs.
    contentLeaves = [1, 2, 3, 4].map((n) => {
      const leaf = new Activity(`content_${n}`, `Content ${n}`);
      leaf.sequencingControls.rollupObjectiveSatisfied = false;
      leaf.sequencingControls.objectiveMeasureWeight = 0;
      contentWrapper.addChild(leaf);
      return leaf;
    });

    // Test leaves: contribute to objective rollup, per the sample's remediation tests.
    testLeaves = [1, 2, 3, 4].map((n) => {
      const leaf = new Activity(`test_${n}`, `Test ${n}`);
      leaf.sequencingControls.rollupObjectiveSatisfied = true;
      contentWrapper.addChild(leaf);
      return leaf;
    });
  });

  it("leaves objectiveSatisfiedStatusKnown false when the only attempted sibling is a content leaf that never contributes", () => {
    // Learner attempts only the first content leaf; it stays incomplete/unknown and does not
    // contribute to objective rollup regardless (rollupObjectiveSatisfied=false). No test leaf
    // has been attempted, so every contributor to content_wrapper's objective rollup is unknown.
    contentLeaves[0].attemptCount = 1;

    processor.objectiveRollupProcess(contentWrapper);

    expect(contentWrapper.objectiveSatisfiedStatusKnown).toBe(false);
    expect(contentWrapper.successStatus).toBe("unknown");
  });

  it("returns null (no information) when there are zero contributors", () => {
    const empty = new Activity("empty", "Empty Cluster");
    const untracked = new Activity("untracked", "Untracked Child");
    untracked.sequencingControls.rollupObjectiveSatisfied = false;
    empty.addChild(untracked);

    const result = processor.objectiveRollupUsingDefault(empty);

    expect(result).toBeNull();
  });

  it("returns null and leaves the activity's status untouched when default rollup has no information", () => {
    const priorKnown = contentWrapper.objectiveSatisfiedStatusKnown;
    const priorStatus = contentWrapper.objectiveSatisfiedStatus;

    processor.objectiveRollupProcess(contentWrapper);

    // No contributor has been attempted at all, so nothing should change.
    expect(contentWrapper.objectiveSatisfiedStatusKnown).toBe(priorKnown);
    expect(contentWrapper.objectiveSatisfiedStatus).toBe(priorStatus);
  });

  it("returns false when one contributor is known-not-satisfied even though others are unknown", () => {
    testLeaves[0].objectiveSatisfiedStatus = false; // known, explicitly failed
    // testLeaves[1..3] are untouched: unknown.

    const result = processor.objectiveRollupUsingDefault(contentWrapper);

    expect(result).toBe(false);
  });

  it("propagates known-not-satisfied to the activity even amid unknown siblings", () => {
    testLeaves[0].objectiveSatisfiedStatus = false;

    processor.objectiveRollupProcess(contentWrapper);

    expect(contentWrapper.objectiveSatisfiedStatus).toBe(false);
    expect(contentWrapper.objectiveSatisfiedStatusKnown).toBe(true);
    expect(contentWrapper.successStatus).toBe("failed");
  });

  it("returns true when all contributors are known and satisfied", () => {
    for (const leaf of testLeaves) {
      leaf.objectiveSatisfiedStatus = true;
    }

    const result = processor.objectiveRollupUsingDefault(contentWrapper);

    expect(result).toBe(true);
  });

  it("sets known-satisfied status on the activity when all contributors are known and satisfied", () => {
    for (const leaf of testLeaves) {
      leaf.objectiveSatisfiedStatus = true;
    }

    processor.objectiveRollupProcess(contentWrapper);

    expect(contentWrapper.objectiveSatisfiedStatus).toBe(true);
    expect(contentWrapper.objectiveSatisfiedStatusKnown).toBe(true);
    expect(contentWrapper.successStatus).toBe("passed");
  });

  it("returns null when some contributors are known-satisfied and the rest are unknown (no known-false)", () => {
    testLeaves[0].objectiveSatisfiedStatus = true;
    // testLeaves[1..3] remain unattempted/unknown.

    const result = processor.objectiveRollupUsingDefault(contentWrapper);

    expect(result).toBeNull();
  });
});
