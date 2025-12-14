import { describe, it, expect, beforeEach } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { SequencingProcess } from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import {
  OverallSequencingProcess,
  NavigationRequestType,
} from "../../../../src/cmi/scorm2004/sequencing/overall_sequencing_process";

/**
 * Comprehensive tests for choiceExit enforcement and hiddenFromChoice validation
 * Tests all aspects of SB.2.9-8 (choiceExit violation) and SB.2.9-4 (hidden from choice)
 */
describe("ChoiceExit and HiddenFromChoice Validation", () => {
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let rollupProcess: RollupProcess;
  let overall: OverallSequencingProcess;
  let root: Activity;
  let cluster1: Activity;
  let cluster2: Activity;
  let activity1_1: Activity;
  let activity1_2: Activity;
  let activity1_3: Activity;
  let activity2_1: Activity;
  let activity2_2: Activity;
  let deepCluster: Activity;
  let deepActivity: Activity;

  /**
   * Create a comprehensive activity tree for testing choiceExit and hiddenFromChoice
   * Structure:
   *   Root
   *   ├── Cluster1 (choiceExit can be toggled)
   *   │   ├── Activity1_1
   *   │   ├── Activity1_2
   *   │   ├── Activity1_3
   *   │   └── DeepCluster
   *   │       └── DeepActivity
   *   └── Cluster2
   *       ├── Activity2_1
   *       └── Activity2_2
   */
  beforeEach(() => {
    // Create root
    root = new Activity("root", "Root");
    root.sequencingControls.choice = true;
    root.sequencingControls.choiceExit = true;

    // Create Cluster1
    cluster1 = new Activity("cluster1", "Cluster 1");
    cluster1.sequencingControls.choice = true;
    cluster1.sequencingControls.choiceExit = true;
    root.addChild(cluster1);

    // Create activities under Cluster1
    activity1_1 = new Activity("activity1_1", "Activity 1.1");
    activity1_1.sequencingControls.choice = true;
    cluster1.addChild(activity1_1);

    activity1_2 = new Activity("activity1_2", "Activity 1.2");
    activity1_2.sequencingControls.choice = true;
    cluster1.addChild(activity1_2);

    activity1_3 = new Activity("activity1_3", "Activity 1.3");
    activity1_3.sequencingControls.choice = true;
    cluster1.addChild(activity1_3);

    // Create deep cluster under Cluster1
    deepCluster = new Activity("deepCluster", "Deep Cluster");
    deepCluster.sequencingControls.choice = true;
    deepCluster.sequencingControls.choiceExit = true;
    cluster1.addChild(deepCluster);

    deepActivity = new Activity("deepActivity", "Deep Activity");
    deepActivity.sequencingControls.choice = true;
    deepCluster.addChild(deepActivity);

    // Create Cluster2
    cluster2 = new Activity("cluster2", "Cluster 2");
    cluster2.sequencingControls.choice = true;
    cluster2.sequencingControls.choiceExit = true;
    root.addChild(cluster2);

    // Create activities under Cluster2
    activity2_1 = new Activity("activity2_1", "Activity 2.1");
    activity2_1.sequencingControls.choice = true;
    cluster2.addChild(activity2_1);

    activity2_2 = new Activity("activity2_2", "Activity 2.2");
    activity2_2.sequencingControls.choice = true;
    cluster2.addChild(activity2_2);

    // Initialize root before creating activity tree
    root.initialize();

    // Create activity tree and processes
    activityTree = new ActivityTree(root);
    sequencingProcess = new SequencingProcess(activityTree);
    rollupProcess = new RollupProcess();
    overall = new OverallSequencingProcess(activityTree, sequencingProcess, rollupProcess);
  });

  describe("choiceExit=false enforcement", () => {
    it("should allow navigation within same cluster when choiceExit=true", () => {
      // Set current activity and make it active
      activityTree.currentActivity = activity1_1;
      activity1_1.isActive = true;

      // Try to navigate to sibling within same cluster
      const result = overall.processNavigationRequest(
        NavigationRequestType.CHOICE,
        activity1_2.id,
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity).toBe(activity1_2);
    });

    it("should block exit to sibling of parent when parent has choiceExit=false (NB.2.1-11)", () => {
      // Set choiceExit=false on cluster1 and mark it active
      cluster1.sequencingControls.choiceExit = false;
      cluster1.isActive = true;

      // Set current activity inside cluster1
      activityTree.currentActivity = activity1_1;
      activity1_1.isActive = true;

      // Try to navigate to activity2_1 (child of cluster2, sibling of cluster1)
      const result = overall.processNavigationRequest(
        NavigationRequestType.CHOICE,
        activity2_1.id,
      );

      // Navigation Request Process returns NB.2.1-11 for choiceExit violations
      expect(result.exception).toBe("NB.2.1-11");
      expect(result.targetActivity).toBeNull();
    });

    it("should block exit to cousin when parent has choiceExit=false (NB.2.1-11)", () => {
      // Set choiceExit=false on cluster1 and mark it active
      cluster1.sequencingControls.choiceExit = false;
      cluster1.isActive = true;

      // Set current activity inside cluster1
      activityTree.currentActivity = activity1_1;
      activity1_1.isActive = true;

      // Try to navigate to activity2_2 (cousin - child of parent's sibling)
      const result = overall.processNavigationRequest(
        NavigationRequestType.CHOICE,
        activity2_2.id,
      );

      // Navigation Request Process returns NB.2.1-11 for choiceExit violations
      expect(result.exception).toBe("NB.2.1-11");
      expect(result.targetActivity).toBeNull();
    });

    it("should allow navigation within subtree when choiceExit=false (not exiting)", () => {
      // Set choiceExit=false on cluster1 and mark it active
      cluster1.sequencingControls.choiceExit = false;
      cluster1.isActive = true;

      // Set current activity inside cluster1
      activityTree.currentActivity = activity1_1;
      activity1_1.isActive = true;

      // Navigate to another activity within same cluster (not exiting)
      const result = overall.processNavigationRequest(
        NavigationRequestType.CHOICE,
        activity1_2.id,
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity).toBe(activity1_2);
    });

    it("should allow all navigation when choiceExit=true at all levels", () => {
      // All activities have choiceExit=true by default
      activityTree.currentActivity = activity1_1;
      activity1_1.isActive = true;

      // Navigate to cousin activity
      const result = overall.processNavigationRequest(
        NavigationRequestType.CHOICE,
        activity2_1.id,
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity).toBe(activity2_1);
    });

    it("should respect choiceExit at multiple levels with mixed settings", () => {
      // Set choiceExit=false on cluster1, true on root
      cluster1.sequencingControls.choiceExit = false;
      cluster1.isActive = true;
      root.sequencingControls.choiceExit = true;

      // Set current activity deep in cluster1
      activityTree.currentActivity = activity1_2;
      activity1_2.isActive = true;

      // Try to exit to cluster2's child - should be blocked by cluster1's choiceExit=false
      const result = overall.processNavigationRequest(
        NavigationRequestType.CHOICE,
        activity2_1.id,
      );

      // Navigation Request Process returns NB.2.1-11 for choiceExit violations
      expect(result.exception).toBe("NB.2.1-11");
    });

    it("should NOT block navigation within subtree when choiceExit=false", () => {
      // Set choiceExit=false on cluster1 and mark it active
      cluster1.sequencingControls.choiceExit = false;
      cluster1.isActive = true;

      // Set current activity
      activityTree.currentActivity = activity1_1;
      activity1_1.isActive = true;

      // Navigate to sibling within same cluster (not to deepActivity which requires
      // skipping mandatory intermediate activities)
      const result = overall.processNavigationRequest(
        NavigationRequestType.CHOICE,
        activity1_2.id,
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity).toBe(activity1_2);
    });

    it("should block exit from deeply nested activity when intermediate has choiceExit=false", () => {
      // Set choiceExit=false on cluster1 and mark it active
      cluster1.sequencingControls.choiceExit = false;
      cluster1.isActive = true;

      // Set current activity to deepActivity (nested 3 levels deep)
      activityTree.currentActivity = deepActivity;
      deepActivity.isActive = true;

      // Try to exit to activity2_1 (outside cluster1)
      const result = overall.processNavigationRequest(
        NavigationRequestType.CHOICE,
        activity2_1.id,
      );

      // Navigation Request Process returns NB.2.1-11 for choiceExit violations
      expect(result.exception).toBe("NB.2.1-11");
    });

    it("should allow exit when choiceExit constraint is only at lower level", () => {
      // Set choiceExit=false on deepCluster only
      deepCluster.sequencingControls.choiceExit = false;
      cluster1.sequencingControls.choiceExit = true;

      // Set current activity in cluster1 but not in deepCluster
      activityTree.currentActivity = activity1_1;
      activity1_1.isActive = true;

      // Should be able to exit to cluster2
      const result = overall.processNavigationRequest(
        NavigationRequestType.CHOICE,
        activity2_1.id,
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity).toBe(activity2_1);
    });
  });

  describe("hiddenFromChoice validation", () => {
    it("should block direct choice to hidden activity (NB.2.1-11)", () => {
      // Hide activity1_2 from choice
      activity1_2.isHiddenFromChoice = true;

      activityTree.currentActivity = activity1_1;
      activity1_1.isActive = true;

      // Try to choose hidden activity
      const result = overall.processNavigationRequest(
        NavigationRequestType.CHOICE,
        activity1_2.id,
      );

      // Navigation Request Process returns NB.2.1-11 for hidden activities
      expect(result.exception).toBe("NB.2.1-11");
      expect(result.targetActivity).toBeNull();
    });

    it("should allow Continue/Previous to reach hidden activity (not choice)", () => {
      // Hide activity1_2 from choice
      activity1_2.isHiddenFromChoice = true;
      activity1_2.isAvailable = true;

      // Set up flow mode to allow Continue
      cluster1.sequencingControls.flow = true;

      activityTree.currentActivity = activity1_1;
      activity1_1.isActive = true;

      // Continue should work even though activity1_2 is hidden from choice
      const result = overall.processNavigationRequest(NavigationRequestType.CONTINUE);

      // Continue uses flow traversal, not choice, so should succeed
      expect(result.exception).toBeNull();
      expect(result.targetActivity).toBe(activity1_2);
    });

    it("should block choice when ancestor is hidden from choice", () => {
      // Hide cluster1 from choice
      cluster1.isHiddenFromChoice = true;
      activity1_1.isHiddenFromChoice = false;

      activityTree.currentActivity = activity2_1;
      activity2_1.isActive = true;

      // Should NOT be able to choose child because parent is hidden
      const result = overall.processNavigationRequest(
        NavigationRequestType.CHOICE,
        activity1_1.id,
      );

      // Navigation Request Process returns NB.2.1-11 for hidden ancestors
      expect(result.exception).toBe("NB.2.1-11");
    });

    it("should exclude hidden activities from getAvailableChoices", () => {
      // Hide some activities
      activity1_2.isHiddenFromChoice = true;
      activity2_1.isHiddenFromChoice = true;

      activityTree.currentActivity = activity1_1;
      activity1_1.isActive = true;

      // Get available choices
      const availableChoices = sequencingProcess.getAvailableChoices();

      // Should not include hidden activities
      expect(availableChoices).not.toContain(activity1_2);
      expect(availableChoices).not.toContain(activity2_1);

      // Should include visible activities
      expect(availableChoices).toContain(activity1_3);
      expect(availableChoices).toContain(activity2_2);
    });

    it("should return correct exception code for hiddenFromChoice (NB.2.1-11)", () => {
      activity1_2.isHiddenFromChoice = true;

      activityTree.currentActivity = activity1_1;
      activity1_1.isActive = true;

      const result = overall.processNavigationRequest(
        NavigationRequestType.CHOICE,
        activity1_2.id,
      );

      // Navigation Request Process returns NB.2.1-11 for hidden activities
      expect(result.exception).toBe("NB.2.1-11");
    });
  });

  describe("Combination: choiceExit + hiddenFromChoice", () => {
    it("should handle both choiceExit=false and hiddenFromChoice constraints", () => {
      // Set choiceExit=false on cluster1 and mark it active
      cluster1.sequencingControls.choiceExit = false;
      cluster1.isActive = true;

      // Hide activity1_2
      activity1_2.isHiddenFromChoice = true;

      activityTree.currentActivity = activity1_1;
      activity1_1.isActive = true;

      // Try to choose hidden activity within same cluster
      const result1 = overall.processNavigationRequest(
        NavigationRequestType.CHOICE,
        activity1_2.id,
      );
      // Navigation Request Process returns NB.2.1-11 for hidden activities
      expect(result1.exception).toBe("NB.2.1-11");

      // Try to choose activity outside cluster
      const result2 = overall.processNavigationRequest(
        NavigationRequestType.CHOICE,
        activity2_1.id,
      );
      // Navigation Request Process returns NB.2.1-11 for choiceExit violations
      expect(result2.exception).toBe("NB.2.1-11");

      // Try to choose non-hidden activity within cluster
      const result3 = overall.processNavigationRequest(
        NavigationRequestType.CHOICE,
        activity1_3.id,
      );
      expect(result3.exception).toBeNull(); // Should succeed
    });

    it("should properly filter getAvailableChoices with hiddenFromChoice constraint", () => {
      // Hide some activities
      activity1_2.isHiddenFromChoice = true;
      activity2_1.isHiddenFromChoice = true;

      activityTree.currentActivity = activity1_1;
      activity1_1.isActive = true;

      const availableChoices = sequencingProcess.getAvailableChoices();

      // Should not include hidden activities
      expect(availableChoices).not.toContain(activity1_2);
      expect(availableChoices).not.toContain(activity2_1);

      // Should include visible activities
      expect(availableChoices).toContain(activity1_3);
      expect(availableChoices).toContain(activity2_2);
    });
  });

  describe("Edge cases", () => {
    it("should handle root activity choice (should return NB.2.1-11)", () => {
      activityTree.currentActivity = activity1_1;
      activity1_1.isActive = true;

      // Root should not be choosable
      const result = overall.processNavigationRequest(
        NavigationRequestType.CHOICE,
        root.id,
      );

      // Navigation Request Process returns NB.2.1-11 for invalid choice targets
      expect(result.exception).toBe("NB.2.1-11");
    });

    it("should handle all siblings hidden", () => {
      // Hide all siblings in cluster1
      activity1_1.isHiddenFromChoice = true;
      activity1_2.isHiddenFromChoice = true;
      activity1_3.isHiddenFromChoice = true;

      activityTree.currentActivity = activity2_1;
      activity2_1.isActive = true;

      const availableChoices = sequencingProcess.getAvailableChoices();

      // None of the cluster1 leaf children should be available
      expect(availableChoices).not.toContain(activity1_1);
      expect(availableChoices).not.toContain(activity1_2);
      expect(availableChoices).not.toContain(activity1_3);

      // cluster2 activities should still be available
      expect(availableChoices).toContain(activity2_2);
    });

    it("should handle exit from deeply nested with multiple choiceExit constraints", () => {
      // Set choiceExit=false at multiple levels and mark them active
      deepCluster.sequencingControls.choiceExit = false;
      deepCluster.isActive = true;
      cluster1.sequencingControls.choiceExit = false;
      cluster1.isActive = true;

      activityTree.currentActivity = deepActivity;
      deepActivity.isActive = true;

      // Try to exit to activity2_1 (outside both constraints)
      const result = overall.processNavigationRequest(
        NavigationRequestType.CHOICE,
        activity2_1.id,
      );

      // Navigation Request Process returns NB.2.1-11 for choiceExit violations
      expect(result.exception).toBe("NB.2.1-11");
    });

    it("should handle choiceExit=false at root level (allows all within tree)", () => {
      root.sequencingControls.choiceExit = false;
      root.isActive = true;

      activityTree.currentActivity = activity1_1;
      activity1_1.isActive = true;

      // All activities are in root's subtree, so should be reachable
      const result = overall.processNavigationRequest(
        NavigationRequestType.CHOICE,
        activity2_1.id,
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity).toBe(activity2_1);
    });

    it("should correctly identify descendants when checking choiceExit boundaries", () => {
      cluster1.sequencingControls.choiceExit = false;
      cluster1.isActive = true;

      // Start from deepCluster so we're already past the mandatory siblings
      activityTree.currentActivity = deepActivity;
      deepActivity.isActive = true;

      // Should be able to navigate to sibling within same cluster
      // (navigating back to activity1_1 which is before deepCluster, no mandatory skipping)
      const result = overall.processNavigationRequest(
        NavigationRequestType.CHOICE,
        activity1_1.id,
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity).toBe(activity1_1);
    });

    it("should return empty array from getAvailableChoices when nothing is available", () => {
      // Hide everything
      activity1_1.isHiddenFromChoice = true;
      activity1_2.isHiddenFromChoice = true;
      activity1_3.isHiddenFromChoice = true;
      activity2_1.isHiddenFromChoice = true;
      activity2_2.isHiddenFromChoice = true;
      deepActivity.isHiddenFromChoice = true;
      cluster1.isHiddenFromChoice = true;
      cluster2.isHiddenFromChoice = true;
      deepCluster.isHiddenFromChoice = true;

      activityTree.currentActivity = activity1_1;
      activity1_1.isActive = true;

      const availableChoices = sequencingProcess.getAvailableChoices();

      expect(availableChoices.length).toBe(0);
    });

    it("should handle no current activity when getting available choices", () => {
      // No current activity
      activityTree.currentActivity = null;

      activity1_2.isHiddenFromChoice = true;

      const availableChoices = sequencingProcess.getAvailableChoices();

      // Should still filter hidden activities
      expect(availableChoices).not.toContain(activity1_2);

      // But should include visible ones
      expect(availableChoices).toContain(activity1_1);
      expect(availableChoices).toContain(activity1_3);
    });
  });
});
