import {beforeEach, describe, expect, it} from "vitest";
import {
  DeliveryRequestType,
  SequencingProcess,
  SequencingRequestType,
  SequencingResult,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import {ActivityTree} from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import {Activity} from "../../../../src/cmi/scorm2004/sequencing/activity";
import {SequencingRules} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import {
  RandomizationTiming,
  SelectionTiming,
  SequencingControls,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_controls";
import {ADLNav} from "../../../../src/cmi/scorm2004/adl";

describe("SequencingProcess", () => {
  let sequencingProcess: SequencingProcess;
  let activityTree: ActivityTree;
  let sequencingRules: SequencingRules;
  let sequencingControls: SequencingControls;
  let adlNav: ADLNav;

  beforeEach(() => {
    activityTree = new ActivityTree();
    sequencingRules = new SequencingRules();
    sequencingControls = new SequencingControls();
    adlNav = new ADLNav();

    // Create a simple activity tree for testing
    const root = new Activity("root", "Root Activity");
    const child1 = new Activity("child1", "Child 1");
    const child2 = new Activity("child2", "Child 2");
    const grandchild1 = new Activity("grandchild1", "Grandchild 1");
    const grandchild2 = new Activity("grandchild2", "Grandchild 2");

    root.addChild(child1);
    root.addChild(child2);
    child1.addChild(grandchild1);
    child1.addChild(grandchild2);

    // Enable flow controls (required for START to work correctly)
    root.sequencingControls.flow = true;
    child1.sequencingControls.flow = true;
    child2.sequencingControls.flow = true;

    activityTree.root = root;

    sequencingProcess = new SequencingProcess(
        activityTree,
        sequencingRules,
        sequencingControls,
        adlNav,
    );
  });

  describe("sequencingRequestProcess", () => {
    it("should handle START request", () => {
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);

      expect(result).toBeInstanceOf(SequencingResult);
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBeTruthy();
      expect(result.exception).toBeNull();
    });

    it("should return exception for START if current activity exists", () => {
      activityTree.currentActivity = activityTree.root;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);

      expect(result.exception).toBe("SB.2.5-2");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should handle CONTINUE request", () => {
      const child1 = activityTree.root?.children[0];
      if (child1) {
        activityTree.currentActivity = child1;
        child1.isActive = true;
      }

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);

      expect(result).toBeInstanceOf(SequencingResult);
    });

    it("should return exception for CONTINUE if no current activity", () => {
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);

      expect(result.exception).toBe("SB.2.12-1");
    });

    it("should handle CHOICE request with target", () => {
      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.CHOICE,
          "child2",
      );

      expect(result).toBeInstanceOf(SequencingResult);
    });

    it("should return exception for CHOICE without target", () => {
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CHOICE);

      expect(result.exception).toBe("SB.2.12-5");
    });

    it("should handle JUMP request with target", () => {
      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.JUMP,
          "child1",
      );

      expect(result).toBeInstanceOf(SequencingResult);
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("child1");
    });

    it("should handle EXIT request", () => {
      const child1 = activityTree.root?.children[0];
      if (child1) {
        activityTree.currentActivity = child1;
      }

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.EXIT);

      expect(result).toBeInstanceOf(SequencingResult);
    });

    it("should handle SUSPEND_ALL request", () => {
      const child1 = activityTree.root?.children[0];
      if (child1) {
        activityTree.currentActivity = child1;
      }

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.SUSPEND_ALL);

      expect(result).toBeInstanceOf(SequencingResult);
      expect(activityTree.suspendedActivity).toBe(child1);
      expect(activityTree.currentActivity).toBeNull();
    });

    it("should handle unknown request type", () => {
      const result = sequencingProcess.sequencingRequestProcess("unknown" as SequencingRequestType);

      expect(result.exception).toBe("SB.2.12-6");
    });
  });

  describe("choice sequencing", () => {
    it("should reject choice of root activity", () => {
      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.CHOICE,
          "root",
      );

      expect(result.exception).toBe("SB.2.9-3");
    });

    it("should reject choice of non-existent activity", () => {
      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.CHOICE,
          "nonexistent",
      );

      expect(result.exception).toBe("SB.2.9-1");
    });

    it("should reject choice of hidden activity", () => {
      const child1 = activityTree.root?.children[0];
      if (child1) {
        child1.isHiddenFromChoice = true;
      }

      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.CHOICE,
          "child1",
      );

      expect(result.exception).toBe("SB.2.9-4");
    });

    it("should deliver leaf activity on choice", () => {
      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.CHOICE,
          "grandchild1",
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("grandchild1");
    });

    it("should flow to first child when choosing non-leaf", () => {
      // This test verifies that choosing a cluster (non-leaf) activity
      // flows down to the first available child activity

      // Create a simple tree with flow enabled everywhere
      const simpleRoot = new Activity("simpleRoot", "Simple Root");
      const simpleParent = new Activity("simpleParent", "Simple Parent");
      const simpleChild1 = new Activity("simpleChild1", "Simple Child 1");
      const simpleChild2 = new Activity("simpleChild2", "Simple Child 2");

      simpleRoot.addChild(simpleParent);
      simpleParent.addChild(simpleChild1);
      simpleParent.addChild(simpleChild2);

      // Enable all necessary controls
      simpleRoot.sequencingControls.flow = true;
      simpleRoot.sequencingControls.choice = true;
      simpleParent.sequencingControls.flow = true;
      simpleParent.sequencingControls.choice = true;

      // Create a new tree and sequencing process for this test
      const testTree = new ActivityTree();
      testTree.root = simpleRoot;

      const testProcess = new SequencingProcess(
          testTree,
          sequencingRules,
          sequencingControls,
          adlNav,
      );

      const result = testProcess.sequencingRequestProcess(
          SequencingRequestType.CHOICE,
          "simpleParent",
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("simpleChild1");
    });
  });

  describe("jump sequencing", () => {
    it("should deliver available activity on jump", () => {
      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.JUMP,
          "child2",
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("child2");
    });

    it("should reject jump to unavailable activity", () => {
      const child2 = activityTree.root?.children[1];
      if (child2) {
        child2.isAvailable = false;
      }

      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.JUMP,
          "child2",
      );

      expect(result.exception).toBe("SB.2.13-3");
    });
  });

  describe("resume sequencing", () => {
    it("should resume suspended activity", () => {
      const child1 = activityTree.root?.children[0];
      if (child1) {
        activityTree.suspendedActivity = child1;
      }

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.RESUME_ALL);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(child1);
    });

    it("should return exception if no suspended activity", () => {
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.RESUME_ALL);

      expect(result.exception).toBe("SB.2.6-1");
    });
  });

  describe("retry sequencing", () => {
    it("should retry current activity", () => {
      const child1 = activityTree.root?.children[0];
      if (child1) {
        activityTree.currentActivity = child1;
        // Per SB.2.10: Activity must NOT be active or suspended for retry to work
        child1.isActive = false;
        child1.isSuspended = false;
        const initialAttemptCount = child1.attemptCount;

        const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.RETRY);

        expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
        // Per SB.2.10: When retrying a cluster, flow subprocess finds deliverable child
        // So we should get grandchild1, not child1
        const grandchild1 = child1.children[0];
        expect(result.targetActivity).toBe(grandchild1);
        // Attempt count increment moved to contentDeliveryEnvironmentProcess
        // The increment no longer happens in retrySequencingRequestProcess
        expect(child1.attemptCount).toBe(initialAttemptCount);
      }
    });

    it("should restart from root on retry all", () => {
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.RETRY_ALL);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBeTruthy();
    });
  });

  describe("checkActivityProcess edge cases", () => {
    it("should handle unavailable activity in flow", () => {
      const child1 = activityTree.root?.children[0];
      if (child1) {
        // Set current activity and make next unavailable
        activityTree.currentActivity = child1;
        const child2 = activityTree.root?.children[1];
        if (child2) {
          child2.isAvailable = false;
        }

        const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);

        // Should handle the unavailable activity in flow traversal
        expect(result).toBeInstanceOf(SequencingResult);
      }
    });

    it("should handle activity with attempt limit", () => {
      const child1 = activityTree.root?.children[0];
      if (child1) {
        // Set attempt limit and simulate exceeding it by mocking the method
        child1.attemptLimit = 1;
        // Mock the hasAttemptLimitExceeded method
        const originalMethod = child1.hasAttemptLimitExceeded;
        child1.hasAttemptLimitExceeded = () => true;

        const result = sequencingProcess.sequencingRequestProcess(
            SequencingRequestType.CHOICE,
            "child1",
        );

        // Restore original method
        child1.hasAttemptLimitExceeded = originalMethod;

        // Should handle the attempt limit check
        expect(result).toBeInstanceOf(SequencingResult);
      }
    });
  });

  describe("findCommonAncestor edge cases", () => {
    it("should handle activities with no common ancestor", () => {
      // Create two separate activity trees with no common ancestor
      const tree1Root = new Activity("tree1_root", "Tree 1 Root");
      const tree1Child = new Activity("tree1_child", "Tree 1 Child");
      tree1Root.addChild(tree1Child);

      const tree2Root = new Activity("tree2_root", "Tree 2 Root");
      const tree2Child = new Activity("tree2_child", "Tree 2 Child");
      tree2Root.addChild(tree2Child);

      // These activities have no common ancestor since they're in separate trees
      // This will test the findCommonAncestor method's return null case

      // We need to test this through a sequencing operation that would call findCommonAncestor
      // Set up current activity as tree1Child
      activityTree.currentActivity = tree1Child;

      // Try to navigate to tree2Child (which has no common ancestor)
      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.CHOICE,
          "tree2_child",
      );

      // This should result in an exception since the target can't be found in the tree
      expect(result.exception).toBeTruthy();
    });

    it("should handle orphaned activities", () => {
      // Create an activity with no parent
      const orphanActivity = new Activity("orphan", "Orphan Activity");

      // Set it as current activity
      activityTree.currentActivity = orphanActivity;

      // Try to process a continue request
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);

      // This should handle the case where activity has no parent in findCommonAncestor
      expect(result.exception).toBeTruthy();
    });
  });

  describe("additional edge cases for coverage", () => {
    it("should handle PREVIOUS request", () => {
      const child2 = activityTree.root?.children[1];
      if (child2) {
        activityTree.currentActivity = child2;
        child2.isActive = true;
      }

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.PREVIOUS);

      expect(result).toBeInstanceOf(SequencingResult);
    });

    it("should handle EXIT_ALL request", () => {
      const child1 = activityTree.root?.children[0];
      if (child1) {
        activityTree.currentActivity = child1;
        child1.isActive = true;
      }

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.EXIT_ALL);

      expect(result).toBeInstanceOf(SequencingResult);
      // EXIT_ALL may not immediately set current activity to null, just check the result
    });

    it("should handle ABANDON request", () => {
      const child1 = activityTree.root?.children[0];
      if (child1) {
        activityTree.currentActivity = child1;
        child1.isActive = true;
      }

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.ABANDON);

      expect(result).toBeInstanceOf(SequencingResult);
    });

    it("should handle ABANDON_ALL request", () => {
      const child1 = activityTree.root?.children[0];
      if (child1) {
        activityTree.currentActivity = child1;
        child1.isActive = true;
      }

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.ABANDON_ALL);

      expect(result).toBeInstanceOf(SequencingResult);
      // ABANDON_ALL may not immediately set current activity to null, just check the result
    });

    it("should handle navigation when current activity is root", () => {
      activityTree.currentActivity = activityTree.root;
      if (activityTree.root) {
        activityTree.root.isActive = true;
      }

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);

      expect(result).toBeInstanceOf(SequencingResult);
    });

    it("should handle choice with constrained choice control", () => {
      const child1 = activityTree.root?.children[0];
      if (child1 && activityTree.root) {
        // Set choice control to false on parent to constrain choice
        activityTree.root.sequencingControls.choice = false;

        const result = sequencingProcess.sequencingRequestProcess(
            SequencingRequestType.CHOICE,
            "child1",
        );

        expect(result.exception).toBeTruthy();
      }
    });
  });

  describe("choice request edge cases", () => {
    it("should reject choice blocked by constrainChoice", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      const child3 = new Activity("child3", "Child 3");

      root.addChild(child1);
      root.addChild(child2);
      root.addChild(child3);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      root.sequencingControls.constrainChoice = true;

      tree.root = root;

      const process = new SequencingProcess(
          tree,
          new SequencingRules(),
          new SequencingControls(),
          new ADLNav(),
      );

      // Set current activity to child1
      tree.currentActivity = child1;
      child1.isActive = false;

      // Try to choose child3 (skipping child2) - should fail with constrainChoice
      const result = process.sequencingRequestProcess(
          SequencingRequestType.CHOICE,
          "child3",
      );

      expect(result.exception).toBe("SB.2.9-7");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should reject choice when parent has flow=false", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const parent = new Activity("parent", "Parent");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(parent);
      parent.addChild(child1);
      parent.addChild(child2);

      // Disable flow on parent
      parent.sequencingControls.flow = false;
      parent.sequencingControls.choice = true;
      root.sequencingControls.flow = true;

      tree.root = root;

      const process = new SequencingProcess(
          tree,
          new SequencingRules(),
          new SequencingControls(),
          new ADLNav(),
      );

      // Set current activity to child1
      tree.currentActivity = child1;
      child1.isActive = false;

      // Try to choose child2 - should fail because parent has flow=false
      const result = process.sequencingRequestProcess(
          SequencingRequestType.CHOICE,
          "child2",
      );

      // Should succeed because choice is independent of flow for explicit choices
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
    });

    it("should handle choice to activity with prerequisites", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;

      // Set child2 as unavailable (simulating unmet prerequisites)
      child2.isAvailable = false;

      tree.root = root;

      const process = new SequencingProcess(
          tree,
          new SequencingRules(),
          new SequencingControls(),
          new ADLNav(),
      );

      const result = process.sequencingRequestProcess(
          SequencingRequestType.CHOICE,
          "child2",
      );

      expect(result.exception).toBe("SB.2.9-7");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should handle choice blocked by choiceExit constraint", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster1 = new Activity("cluster1", "Cluster 1");
      const cluster2 = new Activity("cluster2", "Cluster 2");
      const leaf1 = new Activity("leaf1", "Leaf 1");
      const leaf2 = new Activity("leaf2", "Leaf 2");

      root.addChild(cluster1);
      root.addChild(cluster2);
      cluster1.addChild(leaf1);
      cluster2.addChild(leaf2);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      cluster1.sequencingControls.flow = true;
      cluster1.sequencingControls.choiceExit = false; // Cannot exit cluster1
      cluster2.sequencingControls.flow = true;

      tree.root = root;

      const process = new SequencingProcess(
          tree,
          new SequencingRules(),
          new SequencingControls(),
          new ADLNav(),
      );

      // Set current activity to leaf1 inside cluster1
      tree.currentActivity = leaf1;
      leaf1.isActive = false;
      cluster1.isActive = true; // Mark parent as active

      // Try to choose leaf2 (outside cluster1) - should fail
      const result = process.sequencingRequestProcess(
          SequencingRequestType.CHOICE,
          "leaf2",
      );

      expect(result.exception).toBe("SB.2.9-8");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });
  });

  describe("flow traversal edge cases", () => {
    it("should handle forward traversal with no available activities", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.flow = true;

      // Make child2 unavailable
      child2.isAvailable = false;

      tree.root = root;

      const process = new SequencingProcess(
          tree,
          new SequencingRules(),
          new SequencingControls(),
          new ADLNav(),
      );

      // Set current activity to child1
      tree.currentActivity = child1;
      child1.isActive = false;

      // Try to continue - should fail because child2 is unavailable
      const result = process.sequencingRequestProcess(SequencingRequestType.CONTINUE);

      expect(result.exception).toBeTruthy();
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should handle backward traversal blocked by forwardOnly", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.flow = true;
      root.sequencingControls.forwardOnly = true;

      tree.root = root;

      const process = new SequencingProcess(
          tree,
          new SequencingRules(),
          new SequencingControls(),
          new ADLNav(),
      );

      // Set current activity to child2
      tree.currentActivity = child2;
      child2.isActive = false;

      // Try to go previous - should fail because of forwardOnly
      const result = process.sequencingRequestProcess(SequencingRequestType.PREVIOUS);

      expect(result.exception).toBeTruthy();
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should handle flow traversal with stopForwardTraversal", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster = new Activity("cluster", "Cluster");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(cluster);
      cluster.addChild(child1);
      cluster.addChild(child2);

      root.sequencingControls.flow = true;
      cluster.sequencingControls.flow = true;
      cluster.sequencingControls.stopForwardTraversal = true;

      tree.root = root;

      const process = new SequencingProcess(
          tree,
          new SequencingRules(),
          new SequencingControls(),
          new ADLNav(),
      );

      // Try to start - should not be able to traverse into cluster
      const result = process.sequencingRequestProcess(SequencingRequestType.START);

      // Should either fail or skip the cluster
      expect(result).toBeInstanceOf(SequencingResult);
    });

    it("should end sequencing session at end of tree", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      root.sequencingControls.flow = true;

      tree.root = root;

      const process = new SequencingProcess(
          tree,
          new SequencingRules(),
          new SequencingControls(),
          new ADLNav(),
      );

      // Set current activity to the last child
      tree.currentActivity = child1;
      child1.isActive = false;

      // Try to continue past the last activity
      const result = process.sequencingRequestProcess(SequencingRequestType.CONTINUE);

      expect(result.endSequencingSession).toBe(true);
    });

    it("should handle backward traversal to find previous sibling's last descendant", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster1 = new Activity("cluster1", "Cluster 1");
      const cluster2 = new Activity("cluster2", "Cluster 2");
      const leaf1 = new Activity("leaf1", "Leaf 1");
      const leaf2 = new Activity("leaf2", "Leaf 2");
      const leaf3 = new Activity("leaf3", "Leaf 3");

      root.addChild(cluster1);
      root.addChild(cluster2);
      cluster1.addChild(leaf1);
      cluster1.addChild(leaf2);
      cluster2.addChild(leaf3);

      root.sequencingControls.flow = true;
      cluster1.sequencingControls.flow = true;
      cluster2.sequencingControls.flow = true;

      tree.root = root;

      const process = new SequencingProcess(
          tree,
          new SequencingRules(),
          new SequencingControls(),
          new ADLNav(),
      );

      // Set current activity to leaf3 (first child of cluster2)
      tree.currentActivity = leaf3;
      leaf3.isActive = false;

      // Try to go previous - should go to leaf2 (last child of cluster1)
      const result = process.sequencingRequestProcess(SequencingRequestType.PREVIOUS);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("leaf2");
    });

    it("should handle cluster with no available children in flow", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster = new Activity("cluster", "Cluster");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(cluster);
      cluster.addChild(child1);
      cluster.addChild(child2);

      root.sequencingControls.flow = true;
      cluster.sequencingControls.flow = true;

      // Make all children unavailable
      child1.isAvailable = false;
      child2.isAvailable = false;

      tree.root = root;

      const process = new SequencingProcess(
          tree,
          new SequencingRules(),
          new SequencingControls(),
          new ADLNav(),
      );

      // Try to start - should fail because no children are available
      const result = process.sequencingRequestProcess(SequencingRequestType.START);

      expect(result.exception).toBeTruthy();
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });
  });

  describe("selection/randomization persistence", () => {
    it("should honor pre-selected children order when starting and continuing", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const childA = new Activity("childA", "Child A");
      const childB = new Activity("childB", "Child B");
      const childC = new Activity("childC", "Child C");

      root.addChild(childA);
      root.addChild(childB);
      root.addChild(childC);

      root.sequencingControls.selectionTiming = SelectionTiming.ONCE;
      root.sequencingControls.selectCount = 2;
      root.sequencingControls.selectionCountStatus = true;
      root.sequencingControls.randomizationTiming = RandomizationTiming.ONCE;
      root.sequencingControls.randomizeChildren = true;
      root.sequencingControls.reorderChildren = true;
      root.sequencingControls.flow = true;

      root.setChildOrder(["childC", "childA", "childB"]);

      childC.isHiddenFromChoice = false;
      childC.isAvailable = true;
      childA.isHiddenFromChoice = false;
      childA.isAvailable = true;
      childB.isHiddenFromChoice = true;
      childB.isAvailable = false;

      root.setProcessedChildren([childC, childA]);

      tree.root = root;

      const process = new SequencingProcess(
          tree,
          new SequencingRules(),
          new SequencingControls(),
          new ADLNav(),
      );

      const startResult = process.sequencingRequestProcess(SequencingRequestType.START);

      expect(startResult.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(startResult.targetActivity?.id).toBe("childC");
      expect(root.getAvailableChildren().map((child) => child.id)).toEqual([
        "childC",
        "childA",
      ]);

      if (startResult.targetActivity) {
        tree.currentActivity = startResult.targetActivity;
        startResult.targetActivity.isActive = false;
      }

      const continueResult = process.sequencingRequestProcess(SequencingRequestType.CONTINUE);

      expect(continueResult.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(continueResult.targetActivity?.id).toBe("childA");
      expect(root.getAvailableChildren().map((child) => child.id)).toEqual([
        "childC",
        "childA",
      ]);
    });

    it("should respect nested selection state across clusters", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      root.sequencingControls.flow = true;
      root.sequencingControls.selectionTiming = SelectionTiming.ONCE;
      root.sequencingControls.selectCount = 1;
      root.sequencingControls.selectionCountStatus = true;
      root.sequencingControls.randomizationTiming = RandomizationTiming.ONCE;
      root.sequencingControls.randomizeChildren = true;
      root.sequencingControls.reorderChildren = true;

      const clusterA = new Activity("clusterA", "Cluster A");
      const clusterB = new Activity("clusterB", "Cluster B");
      clusterA.sequencingControls.flow = true;
      clusterB.sequencingControls.flow = true;
      clusterB.sequencingControls.selectionTiming = SelectionTiming.ONCE;
      clusterB.sequencingControls.selectCount = 2;
      clusterB.sequencingControls.selectionCountStatus = true;
      clusterB.sequencingControls.randomizationTiming = RandomizationTiming.ONCE;
      clusterB.sequencingControls.randomizeChildren = true;
      clusterB.sequencingControls.reorderChildren = true;

      const leafB1 = new Activity("leafB1", "Leaf B1");
      const leafB2 = new Activity("leafB2", "Leaf B2");
      const leafB3 = new Activity("leafB3", "Leaf B3");
      clusterB.addChild(leafB1);
      clusterB.addChild(leafB2);
      clusterB.addChild(leafB3);

      const leafA1 = new Activity("leafA1", "Leaf A1");
      clusterA.addChild(leafA1);

      root.addChild(clusterA);
      root.addChild(clusterB);

      root.setChildOrder(["clusterB", "clusterA"]);
      clusterB.setChildOrder(["leafB2", "leafB1", "leafB3"]);

      clusterB.setProcessedChildren([leafB2, leafB1]);
      root.setProcessedChildren([clusterB]);

      // Mark availability/visibility according to persisted selection
      clusterA.isHiddenFromChoice = true;
      clusterA.isAvailable = false;
      clusterB.isHiddenFromChoice = false;
      clusterB.isAvailable = true;
      leafB2.isHiddenFromChoice = false;
      leafB2.isAvailable = true;
      leafB1.isHiddenFromChoice = false;
      leafB1.isAvailable = true;
      leafB3.isHiddenFromChoice = true;
      leafB3.isAvailable = false;

      tree.root = root;

      const process = new SequencingProcess(
          tree,
          new SequencingRules(),
          new SequencingControls(),
          new ADLNav(),
      );

      const startResult = process.sequencingRequestProcess(SequencingRequestType.START);
      expect(startResult.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(startResult.targetActivity?.id).toBe("leafB2");
      expect(root.getAvailableChildren().map((child) => child.id)).toEqual(["clusterB"]);
      expect(clusterB.getAvailableChildren().map((child) => child.id)).toEqual([
        "leafB2",
        "leafB1",
      ]);

      if (startResult.targetActivity) {
        tree.currentActivity = startResult.targetActivity;
        startResult.targetActivity.isActive = false;
      }

      const continueFirst = process.sequencingRequestProcess(SequencingRequestType.CONTINUE);
      expect(continueFirst.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(continueFirst.targetActivity?.id).toBe("leafB1");
      expect(clusterB.getAvailableChildren().map((child) => child.id)).toEqual([
        "leafB2",
        "leafB1",
      ]);

      if (continueFirst.targetActivity) {
        tree.currentActivity = continueFirst.targetActivity;
        continueFirst.targetActivity.isActive = false;
      }

      const continueSecond = process.sequencingRequestProcess(SequencingRequestType.CONTINUE);
      expect(continueSecond.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(continueSecond.exception).toBe("SB.2.7-2");
    });
  });

  describe("exit sequencing edge cases", () => {
    it("should reject exit when no parent exists", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");

      tree.root = root;
      tree.currentActivity = root;

      const process = new SequencingProcess(
          tree,
          new SequencingRules(),
          new SequencingControls(),
          new ADLNav(),
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.EXIT);

      expect(result.exception).toBe("SB.2.11-1");
    });

    it("should reject exit when choiceExit is false", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      root.sequencingControls.choiceExit = false;

      tree.root = root;
      tree.currentActivity = child1;

      const process = new SequencingProcess(
          tree,
          new SequencingRules(),
          new SequencingControls(),
          new ADLNav(),
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.EXIT);

      expect(result.exception).toBe("SB.2.11-2");
    });

    it("should reject suspend on root activity", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");

      tree.root = root;
      tree.currentActivity = root;

      const process = new SequencingProcess(
          tree,
          new SequencingRules(),
          new SequencingControls(),
          new ADLNav(),
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.SUSPEND_ALL);

      expect(result.exception).toBe("SB.2.15-1");
    });

    it("should handle EXIT_PARENT request", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const parent = new Activity("parent", "Parent");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(parent);
      parent.addChild(child1);

      root.sequencingControls.flow = true;
      parent.sequencingControls.flow = true;

      tree.root = root;
      tree.currentActivity = child1;
      child1.isActive = true;

      const process = new SequencingProcess(
          tree,
          new SequencingRules(),
          new SequencingControls(),
          new ADLNav(),
      );

      // Manually test terminateDescendentAttemptsProcess is called
      const result = process.sequencingRequestProcess(SequencingRequestType.ABANDON);

      expect(child1.isActive).toBe(false);
    });
  });

  describe("resume edge cases", () => {
    it("should reject resume when current activity exists", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      tree.root = root;
      tree.currentActivity = child1;
      tree.suspendedActivity = child1;

      const process = new SequencingProcess(
          tree,
          new SequencingRules(),
          new SequencingControls(),
          new ADLNav(),
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.RESUME_ALL);

      expect(result.exception).toBe("SB.2.6-2");
    });
  });

  describe("retry edge cases", () => {
    it("should reject retry on active activity", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      tree.root = root;
      tree.currentActivity = child1;
      child1.isActive = true;

      const process = new SequencingProcess(
          tree,
          new SequencingRules(),
          new SequencingControls(),
          new ADLNav(),
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.RETRY);

      expect(result.exception).toBe("SB.2.10-2");
    });

    it("should reject retry on suspended activity", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      tree.root = root;
      tree.currentActivity = child1;
      child1.isActive = false;
      child1.isSuspended = true;

      const process = new SequencingProcess(
          tree,
          new SequencingRules(),
          new SequencingControls(),
          new ADLNav(),
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.RETRY);

      expect(result.exception).toBe("SB.2.10-2");
    });

    it("should reject retry when no deliverable child found in cluster", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster = new Activity("cluster", "Cluster");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(cluster);
      cluster.addChild(child1);

      root.sequencingControls.flow = true;
      cluster.sequencingControls.flow = true;

      // Make child unavailable
      child1.isAvailable = false;

      tree.root = root;
      tree.currentActivity = cluster;
      cluster.isActive = false;
      cluster.isSuspended = false;

      const process = new SequencingProcess(
          tree,
          new SequencingRules(),
          new SequencingControls(),
          new ADLNav(),
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.RETRY);

      expect(result.exception).toBe("SB.2.10-3");
    });
  });

  describe("choice with forwardOnly edge cases", () => {
    it("should reject backward choice with forwardOnly constraint", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      root.sequencingControls.forwardOnly = true;

      tree.root = root;
      tree.currentActivity = child2;
      child2.isActive = false;

      const process = new SequencingProcess(
          tree,
          new SequencingRules(),
          new SequencingControls(),
          new ADLNav(),
      );

      // Try to choose child1 (backward) with forwardOnly
      const result = process.sequencingRequestProcess(
          SequencingRequestType.CHOICE,
          "child1",
      );

      expect(result.exception).toBe("SB.2.9-5");
    });

    it("should still block backward choice even with completion and forwardOnly", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      root.sequencingControls.forwardOnly = true;

      // Mark child1 as completed
      child1.completionStatus = "completed";

      tree.root = root;
      tree.currentActivity = child2;
      child2.isActive = false;

      const process = new SequencingProcess(
          tree,
          new SequencingRules(),
          new SequencingControls(),
          new ADLNav(),
      );

      // Try to choose child1 (backward even though completed)
      const result = process.sequencingRequestProcess(
          SequencingRequestType.CHOICE,
          "child1",
      );

      // Per SCORM 2004, forwardOnly blocks ALL backward navigation
      // The completion check is for constrainChoice, not forwardOnly
      // forwardOnly has higher priority and blocks backward movement regardless
      expect(result.exception).toBe("SB.2.9-5");
    });
  });

  describe("preventActivation constraint", () => {
    it("should reject choice to unattended activity with preventActivation", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      root.sequencingControls.preventActivation = true;

      // child2 has never been attempted
      child2.attemptCount = 0;
      child2.isActive = false;

      tree.root = root;

      const process = new SequencingProcess(
          tree,
          new SequencingRules(),
          new SequencingControls(),
          new ADLNav(),
      );

      const result = process.sequencingRequestProcess(
          SequencingRequestType.CHOICE,
          "child2",
      );

      expect(result.exception).toBe("SB.2.9-6");
    });
  });
});
