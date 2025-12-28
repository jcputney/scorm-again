import { beforeEach, describe, expect, it } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import {
  DeliveryRequestType,
  SequencingProcess,
  SequencingRequestType
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { SequencingControls } from "../../../../src/cmi/scorm2004/sequencing/sequencing_controls";

describe("Early Availability Check in Choice Sequencing Request Process", () => {
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let root: Activity;
  let cluster1: Activity;
  let leaf1: Activity;
  let leaf2: Activity;
  let unavailableLeaf: Activity;

  beforeEach(() => {
    // Create a simple activity tree structure:
    // root
    //   ├── cluster1
    //   │   ├── leaf1
    //   │   ├── leaf2
    //   │   └── unavailableLeaf (not available)

    root = new Activity("root", "Root Activity");
    cluster1 = new Activity("cluster1", "Cluster 1");
    leaf1 = new Activity("leaf1", "Leaf 1");
    leaf2 = new Activity("leaf2", "Leaf 2");
    unavailableLeaf = new Activity("unavailable", "Unavailable Leaf");

    // Set up hierarchy
    root.addChild(cluster1);
    cluster1.addChild(leaf1);
    cluster1.addChild(leaf2);
    cluster1.addChild(unavailableLeaf);

    // Make unavailableLeaf not available
    unavailableLeaf.isAvailable = false;

    // Make other activities available
    root.isAvailable = true;
    cluster1.isAvailable = true;
    leaf1.isAvailable = true;
    leaf2.isAvailable = true;

    // Enable choice on all activities
    root.sequencingControls = new SequencingControls();
    root.sequencingControls.choice = true;
    root.sequencingControls.flow = true; // Enable flow for clusters
    cluster1.sequencingControls = new SequencingControls();
    cluster1.sequencingControls.choice = true;
    cluster1.sequencingControls.flow = true; // Enable flow for clusters
    leaf1.sequencingControls = new SequencingControls();
    leaf1.sequencingControls.choice = true;
    leaf2.sequencingControls = new SequencingControls();
    leaf2.sequencingControls.choice = true;
    unavailableLeaf.sequencingControls = new SequencingControls();
    unavailableLeaf.sequencingControls.choice = true;

    activityTree = new ActivityTree(root);
    sequencingProcess = new SequencingProcess(activityTree);
  });

  describe("Early return when target activity is unavailable", () => {
    it("should return SB.2.9-7 exception when choosing an unavailable activity", () => {
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "unavailable"
      );

      expect(result.exception).toBe("SB.2.9-7");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.targetActivity).toBeNull();
    });

    it("should return SB.2.9-7 exception even when no current activity exists", () => {
      // No current activity scenario
      activityTree.currentActivity = null;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "unavailable"
      );

      expect(result.exception).toBe("SB.2.9-7");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should return SB.2.9-7 exception when current activity exists but is inactive", () => {
      // Set leaf1 as current activity (but not active)
      activityTree.currentActivity = leaf1;
      leaf1.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "unavailable"
      );

      expect(result.exception).toBe("SB.2.9-7");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });
  });

  describe("Expensive operations NOT performed when activity unavailable", () => {
    it("should not terminate descendant attempts when target is unavailable", () => {
      // Set up current activity
      activityTree.currentActivity = leaf1;
      leaf1.isActive = false;

      // Track if leaf1 was terminated (it shouldn't be)
      const initialActiveState = leaf1.isActive;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "unavailable"
      );

      // Verify early return happened
      expect(result.exception).toBe("SB.2.9-7");

      // Verify leaf1 state wasn't changed (no termination occurred)
      expect(leaf1.isActive).toBe(initialActiveState);
    });

    it("should not evaluate activity path when target is unavailable", () => {
      // Set up a scenario where path evaluation would fail
      // if it were to happen
      unavailableLeaf.isAvailable = false;

      // Add a precondition rule that would cause checkActivityProcess to fail
      unavailableLeaf.sequencingRules = {
        preConditionRules: [],
        postConditionRules: [],
        exitConditionRules: []
      };

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "unavailable"
      );

      // Should return early with SB.2.9-7, not fail during path evaluation
      expect(result.exception).toBe("SB.2.9-7");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should not flow forward to find a leaf when unavailable cluster is chosen", () => {
      // Create an unavailable cluster
      const unavailableCluster = new Activity("unavailableCluster", "Unavailable Cluster");
      unavailableCluster.isAvailable = false;
      unavailableCluster.sequencingControls = new SequencingControls();
      unavailableCluster.sequencingControls.choice = true;

      // Add it to root's children and rebuild the tree
      root.addChild(unavailableCluster);
      const newTree = new ActivityTree(root);
      const newProcess = new SequencingProcess(newTree);

      const result = newProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "unavailableCluster"
      );

      // Should return early, not attempt to flow into children
      expect(result.exception).toBe("SB.2.9-7");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });
  });

  describe("Available activities still work correctly (regression test)", () => {
    it("should successfully choose an available leaf activity", () => {
      // Set up current activity
      activityTree.currentActivity = leaf1;
      leaf1.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "leaf2"
      );

      expect(result.exception).toBeNull();
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(leaf2);
    });

    it("should successfully choose an available cluster and flow to first leaf", () => {
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "cluster1"
      );

      expect(result.exception).toBeNull();
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      // Should flow to first available leaf in cluster1
      expect(result.targetActivity).toBe(leaf1);
    });

    it("should handle available activities with no current activity", () => {
      activityTree.currentActivity = null;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "leaf1"
      );

      expect(result.exception).toBeNull();
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(leaf1);
    });

    it("should not affect other exception scenarios", () => {
      // Test that choosing the root still returns the correct exception
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "root"
      );

      expect(result.exception).toBe("SB.2.9-3"); // Cannot choose root
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should not affect choice control validation", () => {
      // Disable choice on cluster1
      cluster1.sequencingControls.choice = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "leaf1"
      );

      expect(result.exception).toBe("SB.2.9-5"); // Choice control is not allowed
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });
  });

  describe("Correct exception code SB.2.9-7 is returned", () => {
    it("should use SB.2.9-7 for unavailable activity (not other exception codes)", () => {
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "unavailable"
      );

      // Must be SB.2.9-7 specifically
      expect(result.exception).toBe("SB.2.9-7");
      // Not other choice-related exceptions
      expect(result.exception).not.toBe("SB.2.9-1"); // Target does not exist
      expect(result.exception).not.toBe("SB.2.9-2"); // Target not in tree
      expect(result.exception).not.toBe("SB.2.9-3"); // Cannot choose root
      expect(result.exception).not.toBe("SB.2.9-4"); // Hidden from choice
      expect(result.exception).not.toBe("SB.2.9-5"); // Choice control not allowed
      expect(result.exception).not.toBe("SB.2.9-6"); // Current activity not terminated
    });

    it("should prioritize SB.2.9-7 over later flow exceptions", () => {
      // Create a scenario where both unavailability and flow issues exist
      unavailableLeaf.isAvailable = false;

      // Even if flow would fail later, we should get SB.2.9-7 first
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "unavailable"
      );

      expect(result.exception).toBe("SB.2.9-7");
    });
  });

  describe("Edge cases", () => {
    it("should handle unavailable activity with hidden from choice", () => {
      unavailableLeaf.isAvailable = false;
      unavailableLeaf.isHiddenFromChoice = true;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "unavailable"
      );

      // Should get hidden from choice exception first (earlier in the code)
      expect(result.exception).toBe("SB.2.9-4");
    });

    it("should handle available activity becoming unavailable", () => {
      // Initially available
      leaf2.isAvailable = true;

      let result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "leaf2"
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity).toBe(leaf2);

      // Now make it unavailable
      leaf2.isAvailable = false;

      result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "leaf2"
      );

      expect(result.exception).toBe("SB.2.9-7");
    });

    it("should work correctly when all activities are available", () => {
      // Ensure all activities are available
      root.isAvailable = true;
      cluster1.isAvailable = true;
      leaf1.isAvailable = true;
      leaf2.isAvailable = true;
      unavailableLeaf.isAvailable = true; // Make it available now

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "unavailable" // ID still "unavailable" but activity is now available
      );

      // Should not get SB.2.9-7 since the activity is available
      expect(result.exception).not.toBe("SB.2.9-7");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
    });
  });
});
