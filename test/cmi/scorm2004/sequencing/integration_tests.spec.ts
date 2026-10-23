import { describe, expect, test } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { SequencingProcess } from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import {
  OverallSequencingProcess
} from "../../../../src/cmi/scorm2004/sequencing/overall_sequencing_process";

describe("SCORM 2004 Sequencing Integration", () => {
  let rootActivity: Activity;
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let rollupProcess: RollupProcess;
  let overallSequencingProcess: OverallSequencingProcess;

  beforeEach(() => {
    // Create a simple activity tree
    rootActivity = new Activity("root", "Root Activity");
    rootActivity.initialize();

    const child1 = new Activity("child1", "Child 1");
    child1.initialize();
    child1.objectiveMeasureStatus = true;
    child1.objectiveNormalizedMeasure = 0.8;
    child1.sequencingControls.objectiveMeasureWeight = 1.0;
    child1.completionStatus = "completed";

    const child2 = new Activity("child2", "Child 2");
    child2.initialize();
    child2.objectiveMeasureStatus = true;
    child2.objectiveNormalizedMeasure = 0.6;
    child2.sequencingControls.objectiveMeasureWeight = 1.0;
    child2.completionStatus = "completed";

    rootActivity.addChild(child1);
    rootActivity.addChild(child2);
    rootActivity.initialize();

    activityTree = new ActivityTree(rootActivity);
    sequencingProcess = new SequencingProcess(activityTree);
    rollupProcess = new RollupProcess();
    overallSequencingProcess = new OverallSequencingProcess(
      activityTree,
      sequencingProcess,
      rollupProcess
    );
  });

  test("should initialize an empty global objective map without explicit maps", () => {
    const globalObjectiveMap = overallSequencingProcess.getGlobalObjectiveMap();
    expect(globalObjectiveMap).toBeDefined();
    // @spec SCORM 2004 4th Ed. SN 3.10.3 - local activity tracking does not
    // implicitly create global objectives.
    expect(globalObjectiveMap.size).toBe(0);
  });

  test("should validate rollup state consistency", () => {
    // First enable rollup on root and perform rollup to establish state
    rootActivity.sequencingControls.rollupObjectiveSatisfied = true;
    rootActivity.sequencingControls.rollupProgressCompletion = true;

    // Perform rollup to calculate root's state from children
    const child = rootActivity.children[0];
    if (child) {
      rollupProcess.overallRollupProcess(child);
    }

    // Now validate the consistency
    const isConsistent = rollupProcess.validateRollupStateConsistency(rootActivity);
    expect(isConsistent).toBe(true);
  });

  test("should process global objective mapping", () => {
    const globalObjectiveMap = new Map();
    globalObjectiveMap.set("test_objective", {
      id: "test_objective",
      satisfiedStatus: true,
      satisfiedStatusKnown: true,
      normalizedMeasure: 0.75,
      normalizedMeasureKnown: true,
      readSatisfiedStatus: true,
      writeSatisfiedStatus: true,
      readNormalizedMeasure: true,
      writeNormalizedMeasure: true,
      satisfiedByMeasure: true
    });

    expect(() => {
      rollupProcess.processGlobalObjectiveMapping(rootActivity, globalObjectiveMap);
    }).not.toThrow();
  });

  test("should calculate the configured weighted measure", () => {
    rollupProcess.overallRollupProcess(rootActivity.children[0]);

    expect(rootActivity.objectiveMeasureStatus).toBe(true);
    expect(rootActivity.objectiveNormalizedMeasure).toBeCloseTo(0.7);
  });

  test("should integrate rollup state validation in overall sequencing", () => {
    // Test that validation happens during sequencing
    const child1 = rootActivity.children[0];
    child1.isActive = true;
    child1.completionStatus = "completed";

    expect(() => {
      overallSequencingProcess.endAttemptProcess(child1);
    }).not.toThrow();

    // After ending attempt, rollup state should be validated
    const isConsistent = rollupProcess.validateRollupStateConsistency(rootActivity);
    expect(isConsistent).toBe(true);
  });

  test("should ignore completion state and attempt count when weighting measures", () => {
    const child1 = rootActivity.children[0];
    const child2 = rootActivity.children[1];

    child1.completionStatus = "completed";
    child1.attemptCount = 1;

    child2.completionStatus = "incomplete";
    child2.attemptCount = 3;

    rollupProcess.overallRollupProcess(child1);

    // RB.1.1 uses only objectiveMeasureWeight: (0.8 + 0.6) / 2
    expect(rootActivity.objectiveMeasureStatus).toBe(true);
    expect(rootActivity.objectiveNormalizedMeasure).toBeCloseTo(0.7);
  });

  test("should maintain global objective synchronization", () => {
    const initialObjectiveCount = overallSequencingProcess.getGlobalObjectiveMap().size;

    // Update a global objective
    overallSequencingProcess.updateGlobalObjective("test_sync", {
      satisfiedStatus: true,
      normalizedMeasure: 0.85
    });

    const updatedMap = overallSequencingProcess.getGlobalObjectiveMap();
    expect(updatedMap.size).toBe(initialObjectiveCount + 1);
    expect(updatedMap.get("test_sync")).toBeDefined();
    expect(updatedMap.get("test_sync").satisfiedStatus).toBe(true);
    expect(updatedMap.get("test_sync").normalizedMeasure).toBe(0.85);
  });
});
