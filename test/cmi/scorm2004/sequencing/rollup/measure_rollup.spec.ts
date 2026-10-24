import { beforeEach, describe, expect, it } from "vitest";
import { Activity } from "../../../../../src/cmi/scorm2004/sequencing/activity";
import { MeasureRollupProcessor } from "../../../../../src/cmi/scorm2004/sequencing/rollup/measure_rollup";
import { RollupChildFilter } from "../../../../../src/cmi/scorm2004/sequencing/rollup/rollup_child_filter";

describe("Measure rollup (RB.1.1)", () => {
  let parent: Activity;
  let x: Activity;
  let y: Activity;
  let rollup: MeasureRollupProcessor;

  beforeEach(() => {
    parent = new Activity("parent");
    x = new Activity("x");
    y = new Activity("y");
    parent.addChild(x);
    parent.addChild(y);
    for (const child of [x, y]) {
      child.sequencingControls.objectiveMeasureWeight = 1;
      child.objectiveMeasureStatus = true;
      child.completionStatus = "completed";
    }
    x.objectiveNormalizedMeasure = 1;
    y.objectiveNormalizedMeasure = 0;
    rollup = new MeasureRollupProcessor(new RollupChildFilter());
  });

  it("counts unknown measures in the denominator", () => {
    y.objectiveMeasureStatus = false;
    rollup.measureRollupProcess(parent);
    expect(parent.objectiveMeasureStatus).toBe(true);
    expect(parent.objectiveNormalizedMeasure).toBe(0.5);
  });

  it("counts score and weight when objective satisfaction rollup is disabled", () => {
    x.sequencingControls.rollupObjectiveSatisfied = false;
    x.requiredForSatisfied = "ifAttempted";
    x.requiredForNotSatisfied = "ifNotSuspended";
    rollup.measureRollupProcess(parent);
    expect(parent.objectiveMeasureStatus).toBe(true);
    expect(parent.objectiveNormalizedMeasure).toBe(0.5);
  });

  it("excludes untracked score and weight", () => {
    y.sequencingControls.tracked = false;
    y.objectiveNormalizedMeasure = 0.75;
    y.sequencingControls.objectiveMeasureWeight = 3;
    rollup.measureRollupProcess(parent);
    expect(parent.objectiveMeasureStatus).toBe(true);
    expect(parent.objectiveNormalizedMeasure).toBe(1);
  });

  it("counts an active child even when measureSatisfactionIfActive is false", () => {
    y.activityAttemptActive = true;
    rollup.measureRollupProcess(parent);
    expect(parent.objectiveNormalizedMeasure).toBe(0.5);

    parent.applyRollupConsiderations({ measureSatisfactionIfActive: false });
    rollup.measureRollupProcess(parent);
    expect(parent.objectiveNormalizedMeasure).toBe(0.5);

    y.activityAttemptActive = false;
    y.isActive = true;
    rollup.measureRollupProcess(parent);
    expect(parent.objectiveNormalizedMeasure).toBe(0.5);

    y.isActive = false;
    rollup.measureRollupProcess(parent);
    expect(parent.objectiveNormalizedMeasure).toBe(0.5);
  });

  it("counts unavailable objective info as weight only", () => {
    y.objectiveNormalizedMeasure = 1;
    y.sequencingControls.useCurrentAttemptObjectiveInfo = true;
    y.objectiveInfoAvailableInCurrentParentAttempt = false;
    rollup.measureRollupProcess(parent);
    expect(parent.objectiveMeasureStatus).toBe(true);
    expect(parent.objectiveNormalizedMeasure).toBe(0.5);
  });

  it("clears measure status when every counted child has unavailable objective info", () => {
    x.objectiveInfoAvailableInCurrentParentAttempt = false;
    y.objectiveInfoAvailableInCurrentParentAttempt = false;
    parent.objectiveMeasureStatus = true;
    rollup.measureRollupProcess(parent);
    expect(parent.objectiveMeasureStatus).toBe(false);
  });

  it.each(["incomplete", "retried", "over limit"])(
    "uses configured weights when a child is %s",
    (state) => {
      if (state === "incomplete") y.completionStatus = "incomplete";
      if (state === "retried") y.attemptCount = 3;
      if (state === "over limit") {
        y.attemptCount = 3;
        y.attemptLimit = 2;
        expect(y.hasAttemptLimitExceeded()).toBe(true);
      }
      rollup.measureRollupProcess(parent);
      expect(parent.objectiveNormalizedMeasure).toBe(0.5);
    },
  );

  it("uses the plain weighted average for unequal weights", () => {
    x.sequencingControls.objectiveMeasureWeight = 3;
    rollup.measureRollupProcess(parent);
    expect(parent.objectiveNormalizedMeasure).toBe(0.75);
  });

  it("ignores a zero-weight child's score and weight", () => {
    y.sequencingControls.objectiveMeasureWeight = 0;
    rollup.measureRollupProcess(parent);
    expect(parent.objectiveNormalizedMeasure).toBe(1);
  });

  it("clears measure status when all weights are zero", () => {
    x.sequencingControls.objectiveMeasureWeight = 0;
    y.sequencingControls.objectiveMeasureWeight = 0;
    parent.objectiveMeasureStatus = true;
    rollup.measureRollupProcess(parent);
    expect(parent.objectiveMeasureStatus).toBe(false);
  });

  it("clears measure status when no counted measure is known", () => {
    x.objectiveMeasureStatus = false;
    y.objectiveMeasureStatus = false;
    rollup.measureRollupProcess(parent);
    expect(parent.objectiveMeasureStatus).toBe(false);
  });

  it("clears a stale parent measure when no child is available", () => {
    parent.objectiveMeasureStatus = true;
    parent.objectiveNormalizedMeasure = 0.9;
    parent.setProcessedChildren([]);
    rollup.measureRollupProcess(parent);
    expect(parent.objectiveMeasureStatus).toBe(false);
  });

  it("clears a stale parent measure after the scored child starts another attempt", () => {
    y.objectiveMeasureStatus = false;
    rollup.measureRollupProcess(parent);
    expect(parent.objectiveMeasureStatus).toBe(true);
    x.reset();
    rollup.measureRollupProcess(parent);
    expect(parent.objectiveMeasureStatus).toBe(false);
  });

  it("retains unavailable progress weight in completion measure rollup (RB.1.1.b)", () => {
    x.attemptCompletionAmount = 1;
    x.attemptCompletionAmountStatus = true;
    x.sequencingControls.useCurrentAttemptProgressInfo = true;
    x.progressInfoAvailableInCurrentParentAttempt = false;
    y.attemptCompletionAmount = 0.5;
    y.attemptCompletionAmountStatus = true;
    rollup.completionMeasureRollupProcess(parent);
    expect(parent.attemptCompletionAmountStatus).toBe(true);
    expect(parent.attemptCompletionAmount).toBe(0.25);
  });
});
