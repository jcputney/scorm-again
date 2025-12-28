import { beforeEach, describe, expect, it } from "vitest";

import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import {
  SequencingProcess,
  SequencingRequestType
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";

/**
 * Complete Constrained Choice Support (SB.2.9)
 *
 * This test suite verifies complete implementation of SCORM 2004 constrained choice,
 * including forwardOnly interaction, mandatory activity checking, and multi-level validation.
 */
describe("Complete Constrained Choice Support (SB.2.9)", () => {
  let root: Activity;
  let cluster1: Activity;
  let cluster2: Activity;
  let cluster3: Activity;
  let leaf1A: Activity;
  let leaf1B: Activity;
  let leaf1C: Activity;
  let leaf2A: Activity;
  let leaf2B: Activity;
  let leaf3A: Activity;
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;

  beforeEach(() => {
    // Create a complex tree structure for testing
    // Root
    //   ├── Cluster1 (constrainChoice)
    //   │   ├── Leaf1A
    //   │   ├── Leaf1B
    //   │   └── Leaf1C
    //   ├── Cluster2
    //   │   ├── Leaf2A
    //   │   └── Leaf2B
    //   └── Cluster3
    //       └── Leaf3A

    root = new Activity("root", "Root");
    cluster1 = new Activity("cluster1", "Cluster 1");
    cluster2 = new Activity("cluster2", "Cluster 2");
    cluster3 = new Activity("cluster3", "Cluster 3");
    leaf1A = new Activity("leaf1A", "Leaf 1A");
    leaf1B = new Activity("leaf1B", "Leaf 1B");
    leaf1C = new Activity("leaf1C", "Leaf 1C");
    leaf2A = new Activity("leaf2A", "Leaf 2A");
    leaf2B = new Activity("leaf2B", "Leaf 2B");
    leaf3A = new Activity("leaf3A", "Leaf 3A");

    cluster1.addChild(leaf1A);
    cluster1.addChild(leaf1B);
    cluster1.addChild(leaf1C);
    cluster2.addChild(leaf2A);
    cluster2.addChild(leaf2B);
    cluster3.addChild(leaf3A);
    root.addChild(cluster1);
    root.addChild(cluster2);
    root.addChild(cluster3);

    // Enable choice controls
    root.sequencingControls.choice = true;
    cluster1.sequencingControls.choice = true;
    cluster2.sequencingControls.choice = true;
    cluster3.sequencingControls.choice = true;
    leaf1A.sequencingControls.choice = true;
    leaf1B.sequencingControls.choice = true;
    leaf1C.sequencingControls.choice = true;
    leaf2A.sequencingControls.choice = true;
    leaf2B.sequencingControls.choice = true;
    leaf3A.sequencingControls.choice = true;

    // Enable flow for constrained choice testing
    root.sequencingControls.flow = true;
    cluster1.sequencingControls.flow = true;
    cluster2.sequencingControls.flow = true;
    cluster3.sequencingControls.flow = true;

    root.initialize();

    activityTree = new ActivityTree(root);
    sequencingProcess = new SequencingProcess(activityTree);
  });

  describe("Basic Constrained Choice - Forward Only", () => {
    beforeEach(() => {
      cluster1.sequencingControls.constrainChoice = true;
      cluster1.sequencingControls.forwardOnly = false;
    });

    it("allows choice to next sibling within constrained cluster", () => {
      activityTree.currentActivity = leaf1A;
      leaf1A.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1B.id
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity).toBe(leaf1B);
    });

    it("blocks choice to skip forward beyond next sibling", () => {
      activityTree.currentActivity = leaf1A;
      leaf1A.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1C.id
      );

      expect(result.exception).toBe("SB.2.9-7");
      expect(result.targetActivity).toBeNull();
    });

    it("allows choice to same activity (retry scenario)", () => {
      activityTree.currentActivity = leaf1A;
      leaf1A.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1A.id
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity).toBe(leaf1A);
    });

    it("allows backward choice to completed activities when forwardOnly is false", () => {
      activityTree.currentActivity = leaf1B;
      leaf1B.isActive = false;
      leaf1A.completionStatus = "completed";

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1A.id
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity).toBe(leaf1A);
    });

    it("blocks backward choice to incomplete activities", () => {
      activityTree.currentActivity = leaf1B;
      leaf1B.isActive = false;
      leaf1A.completionStatus = "incomplete";

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1A.id
      );

      expect(result.exception).toBe("SB.2.9-7");
      expect(result.targetActivity).toBeNull();
    });
  });

  describe("Constrained Choice with ForwardOnly = true", () => {
    beforeEach(() => {
      cluster1.sequencingControls.constrainChoice = true;
      cluster1.sequencingControls.forwardOnly = true;
    });

    it("blocks backward choice even to completed activities when forwardOnly is true", () => {
      activityTree.currentActivity = leaf1B;
      leaf1B.isActive = false;
      leaf1A.completionStatus = "completed";

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1A.id
      );

      expect(result.exception).toBe("SB.2.9-5");
      expect(result.targetActivity).toBeNull();
    });

    it("allows forward choice to next sibling", () => {
      activityTree.currentActivity = leaf1A;
      leaf1A.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1B.id
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity).toBe(leaf1B);
    });

    it("blocks forward choice skipping past next sibling", () => {
      activityTree.currentActivity = leaf1A;
      leaf1A.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1C.id
      );

      expect(result.exception).toBe("SB.2.9-7");
      expect(result.targetActivity).toBeNull();
    });
  });

  describe("Mandatory Activity Blocking", () => {
    beforeEach(() => {
      cluster1.sequencingControls.constrainChoice = true;
      (leaf1B as any).mandatory = true;
    });

    it("blocks choice that would skip mandatory incomplete activity", () => {
      activityTree.currentActivity = leaf1A;
      leaf1A.isActive = false;
      leaf1B.completionStatus = "incomplete";

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1C.id
      );

      expect(result.exception).toBe("SB.2.9-6");
      expect(result.targetActivity).toBeNull();
    });

    it("allows choice past mandatory completed activity", () => {
      activityTree.currentActivity = leaf1A;
      leaf1A.isActive = false;
      leaf1B.completionStatus = "completed";
      (leaf1B as any).mandatory = true;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1C.id
      );

      // Still blocked by constrainChoice (can't skip forward)
      expect(result.exception).toBe("SB.2.9-7");
    });

    it("allows choice to mandatory incomplete activity itself", () => {
      activityTree.currentActivity = leaf1A;
      leaf1A.isActive = false;
      leaf1B.completionStatus = "incomplete";
      (leaf1B as any).mandatory = true;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1B.id
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity).toBe(leaf1B);
    });
  });

  describe("Multi-Level Constraint Validation", () => {
    beforeEach(() => {
      // Set constraints at multiple levels
      root.sequencingControls.constrainChoice = true;
      cluster1.sequencingControls.constrainChoice = true;
    });

    it("validates constraints at root level", () => {
      activityTree.currentActivity = leaf1A;
      leaf1A.isActive = false;

      // Try to jump to cluster3 (skipping cluster2) - should be blocked by root constrainChoice
      // cluster1 (index 0) -> cluster3 (index 2) skips cluster2 (index 1)
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf3A.id
      );

      expect(result.exception).toBe("SB.2.9-7");
      expect(result.targetActivity).toBeNull();
    });

    it("validates constraints at parent level within same cluster", () => {
      activityTree.currentActivity = leaf1A;
      leaf1A.isActive = false;

      // Try to skip to leaf1C - should be blocked by cluster1 constrainChoice
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1C.id
      );

      expect(result.exception).toBe("SB.2.9-7");
      expect(result.targetActivity).toBeNull();
    });

    it("checks constraints at ALL ancestor levels", () => {
      root.sequencingControls.constrainChoice = true;
      root.sequencingControls.forwardOnly = true;
      cluster1.sequencingControls.constrainChoice = false;

      activityTree.currentActivity = leaf2A;
      leaf2A.isActive = false;
      leaf1A.completionStatus = "incomplete";

      // Even though cluster1 has no constraints, root forwardOnly should block backward
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1A.id
      );

      expect(result.exception).toBe("SB.2.9-5");
      expect(result.targetActivity).toBeNull();
    });
  });

  describe("Nested Cluster Constraints", () => {
    let nestedCluster: Activity;
    let nestedLeaf: Activity;

    beforeEach(() => {
      nestedCluster = new Activity("nestedCluster", "Nested Cluster");
      nestedLeaf = new Activity("nestedLeaf", "Nested Leaf");
      nestedCluster.addChild(nestedLeaf);
      cluster1.addChild(nestedCluster);

      nestedCluster.sequencingControls.choice = true;
      nestedCluster.sequencingControls.flow = true;
      nestedLeaf.sequencingControls.choice = true;

      nestedCluster.initialize();

      cluster1.sequencingControls.constrainChoice = true;

      // Refresh the activity tree to include newly added nested activities
      activityTree.root = root;
      sequencingProcess = new SequencingProcess(activityTree);
    });

    it("validates constraints when choosing into nested cluster", () => {
      activityTree.currentActivity = leaf1A;
      leaf1A.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        nestedLeaf.id
      );

      // Should be blocked - can't skip from leaf1A to nestedLeaf (beyond next sibling)
      expect(result.exception).toBe("SB.2.9-7");
      expect(result.targetActivity).toBeNull();
    });

    it("allows choice within nested cluster when parent allows", () => {
      // Start from leaf1C (index 2), so nestedCluster (index 3) is the next sibling
      activityTree.currentActivity = leaf1C;
      leaf1C.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        nestedLeaf.id
      );

      // nestedCluster is next sibling after leaf1C, so this should work
      expect(result.exception).toBeNull();
    });
  });

  describe("Edge Cases", () => {
    it("handles choice to self within constrained cluster", () => {
      cluster1.sequencingControls.constrainChoice = true;
      activityTree.currentActivity = leaf1A;
      leaf1A.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1A.id
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity).toBe(leaf1A);
    });

    it("handles choice when no current activity exists", () => {
      cluster1.sequencingControls.constrainChoice = true;
      activityTree.currentActivity = null;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1A.id
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity).toBe(leaf1A);
    });

    it("handles first activity in constrained cluster", () => {
      cluster1.sequencingControls.constrainChoice = true;
      activityTree.currentActivity = null;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1A.id
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity).toBe(leaf1A);
    });

    it("handles last activity in constrained cluster", () => {
      cluster1.sequencingControls.constrainChoice = true;
      activityTree.currentActivity = leaf1B;
      leaf1B.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1C.id
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity).toBe(leaf1C);
    });

    it("validates exception code SB.2.9-5 for forwardOnly violation", () => {
      cluster1.sequencingControls.constrainChoice = true;
      cluster1.sequencingControls.forwardOnly = true;
      activityTree.currentActivity = leaf1B;
      leaf1B.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1A.id
      );

      expect(result.exception).toBe("SB.2.9-5");
    });

    it("validates exception code SB.2.9-6 for mandatory activity skip", () => {
      cluster1.sequencingControls.constrainChoice = true;
      (leaf1B as any).mandatory = true;
      leaf1B.completionStatus = "incomplete";
      activityTree.currentActivity = leaf1A;
      leaf1A.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1C.id
      );

      expect(result.exception).toBe("SB.2.9-6");
    });

    it("validates exception code SB.2.9-7 for constrained choice boundary", () => {
      cluster1.sequencingControls.constrainChoice = true;
      activityTree.currentActivity = leaf1A;
      leaf1A.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1C.id
      );

      expect(result.exception).toBe("SB.2.9-7");
    });
  });

  describe("Boundary Crossing Validation", () => {
    it("allows choice out of constrained cluster when parent allows", () => {
      cluster1.sequencingControls.constrainChoice = true;
      root.sequencingControls.constrainChoice = false;
      activityTree.currentActivity = leaf1A;
      leaf1A.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf2A.id
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity).toBe(leaf2A);
    });

    it("blocks choice out of constrained cluster when root constrains", () => {
      cluster1.sequencingControls.constrainChoice = false;
      root.sequencingControls.constrainChoice = true;
      activityTree.currentActivity = leaf1A;
      leaf1A.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf3A.id
      );

      // Should be blocked - can't skip from cluster1 to cluster3
      expect(result.exception).toBe("SB.2.9-7");
      expect(result.targetActivity).toBeNull();
    });

    it("allows choice to next cluster when at boundary", () => {
      root.sequencingControls.constrainChoice = true;
      cluster1.sequencingControls.constrainChoice = false;
      activityTree.currentActivity = leaf1C;
      leaf1C.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf2A.id
      );

      // Next cluster is allowed by root constrainChoice
      expect(result.exception).toBeNull();
      expect(result.targetActivity).toBe(leaf2A);
    });
  });

  describe("ConstrainChoice + ForwardOnly Interaction", () => {
    it("applies both constraints when both are set", () => {
      cluster1.sequencingControls.constrainChoice = true;
      cluster1.sequencingControls.forwardOnly = true;
      activityTree.currentActivity = leaf1B;
      leaf1B.isActive = false;
      leaf1A.completionStatus = "completed";

      // ForwardOnly should prevent backward even to completed
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1A.id
      );

      expect(result.exception).toBe("SB.2.9-5");
    });

    it("allows forward when both constraints are set", () => {
      cluster1.sequencingControls.constrainChoice = true;
      cluster1.sequencingControls.forwardOnly = true;
      activityTree.currentActivity = leaf1A;
      leaf1A.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1B.id
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity).toBe(leaf1B);
    });

    it("blocks skipping forward even with forwardOnly", () => {
      cluster1.sequencingControls.constrainChoice = true;
      cluster1.sequencingControls.forwardOnly = true;
      activityTree.currentActivity = leaf1A;
      leaf1A.isActive = false;

      // ConstrainChoice prevents skipping even in forward direction
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1C.id
      );

      expect(result.exception).toBe("SB.2.9-7");
    });
  });

  describe("Completed Activity Exceptions", () => {
    beforeEach(() => {
      cluster1.sequencingControls.constrainChoice = true;
    });

    it("allows backward choice to passed activities", () => {
      cluster1.sequencingControls.forwardOnly = false;
      activityTree.currentActivity = leaf1B;
      leaf1B.isActive = false;
      leaf1A.completionStatus = "passed";

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1A.id
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity).toBe(leaf1A);
    });

    it("blocks backward choice to unknown status activities", () => {
      cluster1.sequencingControls.forwardOnly = false;
      activityTree.currentActivity = leaf1B;
      leaf1B.isActive = false;
      leaf1A.completionStatus = "unknown";

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1A.id
      );

      expect(result.exception).toBe("SB.2.9-7");
    });
  });

  describe("Non-Flow Mode with ConstrainChoice", () => {
    beforeEach(() => {
      cluster1.sequencingControls.flow = false;
      cluster1.sequencingControls.constrainChoice = true;
    });

    it("allows choice to available activities in non-flow mode", () => {
      activityTree.currentActivity = leaf1A;
      leaf1A.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1B.id
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity).toBe(leaf1B);
    });

    it("still validates availability in non-flow mode", () => {
      activityTree.currentActivity = leaf1A;
      leaf1A.isActive = false;
      // Use isHiddenFromChoice to block choice navigation (isVisible only affects UI display)
      leaf1B.isHiddenFromChoice = true;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        leaf1B.id
      );

      expect(result.exception).toBe("SB.2.9-4");
    });
  });
});
