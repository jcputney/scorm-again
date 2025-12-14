import { expect, test, describe } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { SequencingProcess } from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import { OverallSequencingProcess } from "../../../../src/cmi/scorm2004/sequencing/overall_sequencing_process";

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

  test("should initialize global objective map", () => {
    const globalObjectiveMap = overallSequencingProcess.getGlobalObjectiveMap();
    expect(globalObjectiveMap).toBeDefined();
    expect(globalObjectiveMap.size).toBeGreaterThan(0);
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

  test("should calculate complex weighted measures", () => {
    const children = rootActivity.children;
    const complexMeasure = rollupProcess.calculateComplexWeightedMeasure(rootActivity, children);
    
    expect(complexMeasure).toBeGreaterThan(0);
    expect(complexMeasure).toBeLessThanOrEqual(1);
    // Should be different from simple average due to complex weighting
    const simpleAverage = (0.8 + 0.6) / 2;
    expect(complexMeasure).not.toBe(simpleAverage);
  });

  test("should handle cross-cluster dependencies", () => {
    // Create clusters (activities with children and flow control)
    const cluster1 = new Activity("cluster1", "Cluster 1");
    cluster1.sequencingControls.flow = true;
    cluster1.addChild(new Activity("leaf1", "Leaf 1"));
    
    const cluster2 = new Activity("cluster2", "Cluster 2");
    cluster2.sequencingControls.flow = true;
    cluster2.addChild(new Activity("leaf2", "Leaf 2"));
    
    const clusters = [cluster1, cluster2];
    
    expect(() => {
      rollupProcess.processCrossClusterDependencies(rootActivity, clusters);
    }).not.toThrow();
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

  test("should properly wire measure rollup with complex weighting", () => {
    // Set up children with different completion states to test complex weighting
    const child1 = rootActivity.children[0];
    const child2 = rootActivity.children[1];
    
    child1.completionStatus = "completed";
    child1.attemptCount = 1;
    
    child2.completionStatus = "incomplete";
    child2.attemptCount = 3; // Multiple attempts should affect weighting
    
    // Process rollup
    rollupProcess.overallRollupProcess(child1);
    
    // Root should have a calculated measure that reflects complex weighting
    expect(rootActivity.objectiveMeasureStatus).toBe(true);
    expect(rootActivity.objectiveNormalizedMeasure).toBeGreaterThan(0);
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