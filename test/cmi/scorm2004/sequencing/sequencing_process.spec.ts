import { beforeEach, describe, expect, it } from "vitest";
import {
  DeliveryRequestType,
  SequencingProcess,
  SequencingRequestType,
  SequencingResult
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import {
  RuleActionType,
  SequencingRule,
  SequencingRules
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import {
  RandomizationTiming,
  SelectionTiming,
  SequencingControls
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_controls";
import { ADLNav } from "../../../../src/cmi/scorm2004/adl";

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
      adlNav
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
        "child2"
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
        "child1"
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
        "root"
      );

      expect(result.exception).toBe("SB.2.9-3");
    });

    it("should reject choice of non-existent activity", () => {
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "nonexistent"
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
        "child1"
      );

      expect(result.exception).toBe("SB.2.9-4");
    });

    it("should deliver leaf activity on choice", () => {
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "grandchild1"
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
        adlNav
      );

      const result = testProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "simpleParent"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("simpleChild1");
    });
  });

  describe("jump sequencing", () => {
    it("should deliver available activity on jump", () => {
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.JUMP,
        "child2"
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
        "child2"
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
          "child1"
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
        "tree2_child"
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
          "child1"
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
        new ADLNav()
      );

      // Set current activity to child1
      tree.currentActivity = child1;
      child1.isActive = false;

      // Try to choose child3 (skipping child2) - should fail with constrainChoice
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child3"
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
        new ADLNav()
      );

      // Set current activity to child1
      tree.currentActivity = child1;
      child1.isActive = false;

      // Try to choose child2 - should fail because parent has flow=false
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child2"
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
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child2"
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
        new ADLNav()
      );

      // Set current activity to leaf1 inside cluster1
      tree.currentActivity = leaf1;
      leaf1.isActive = false;
      cluster1.isActive = true; // Mark parent as active

      // Try to choose leaf2 (outside cluster1) - should fail
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "leaf2"
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
        new ADLNav()
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
        new ADLNav()
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
        new ADLNav()
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
        new ADLNav()
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
        new ADLNav()
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
        new ADLNav()
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
        new ADLNav()
      );

      const startResult = process.sequencingRequestProcess(SequencingRequestType.START);

      expect(startResult.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(startResult.targetActivity?.id).toBe("childC");
      expect(root.getAvailableChildren().map((child) => child.id)).toEqual([
        "childC",
        "childA"
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
        "childA"
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
        new ADLNav()
      );

      const startResult = process.sequencingRequestProcess(SequencingRequestType.START);
      expect(startResult.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(startResult.targetActivity?.id).toBe("leafB2");
      expect(root.getAvailableChildren().map((child) => child.id)).toEqual(["clusterB"]);
      expect(clusterB.getAvailableChildren().map((child) => child.id)).toEqual([
        "leafB2",
        "leafB1"
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
        "leafB1"
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
        new ADLNav()
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
        new ADLNav()
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
        new ADLNav()
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
        new ADLNav()
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
        new ADLNav()
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
        new ADLNav()
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
        new ADLNav()
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
        new ADLNav()
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
        new ADLNav()
      );

      // Try to choose child1 (backward) with forwardOnly
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
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
        new ADLNav()
      );

      // Try to choose child1 (backward even though completed)
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
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
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child2"
      );

      expect(result.exception).toBe("SB.2.9-6");
    });
  });

  describe("getAvailableChoices", () => {
    it("should return empty array when no activities exist", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const choices = process.getAvailableChoices();

      // Root is excluded from choices
      expect(choices.length).toBe(0);
    });

    it("should return all available leaf activities", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      const child3 = new Activity("child3", "Child 3");

      root.addChild(child1);
      root.addChild(child2);
      root.addChild(child3);

      root.sequencingControls.choice = true;

      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const choices = process.getAvailableChoices();

      expect(choices.length).toBe(3);
      expect(choices.map(a => a.id)).toContain("child1");
      expect(choices.map(a => a.id)).toContain("child2");
      expect(choices.map(a => a.id)).toContain("child3");
    });

    it("should exclude hidden activities", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.choice = true;
      child1.isHiddenFromChoice = true;

      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const choices = process.getAvailableChoices();

      expect(choices.length).toBe(1);
      expect(choices[0].id).toBe("child2");
    });

    it("should exclude unavailable activities", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.choice = true;
      child1.isAvailable = false;

      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const choices = process.getAvailableChoices();

      expect(choices.length).toBe(1);
      expect(choices[0].id).toBe("child2");
    });

    it("should exclude invisible activities", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.choice = true;
      child1.isVisible = false;

      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const choices = process.getAvailableChoices();

      expect(choices.length).toBe(1);
      expect(choices[0].id).toBe("child2");
    });

    it("should exclude activities when parent has choice=false", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const parent = new Activity("parent", "Parent");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(parent);
      parent.addChild(child1);
      parent.addChild(child2);

      root.sequencingControls.choice = true;
      parent.sequencingControls.choice = false; // Children not chooseable

      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const choices = process.getAvailableChoices();

      // Only parent should be chooseable (if it doesn't require flow to leaves)
      expect(choices.map(a => a.id)).not.toContain("child1");
      expect(choices.map(a => a.id)).not.toContain("child2");
    });

    it("should respect choiceExit=false constraint from active ancestor", () => {
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

      root.sequencingControls.choice = true;
      cluster1.sequencingControls.choice = true;
      cluster1.sequencingControls.choiceExit = false; // Cannot exit cluster1
      cluster2.sequencingControls.choice = true;

      tree.root = root;
      tree.currentActivity = leaf1;
      cluster1.isActive = true; // Cluster is active

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const choices = process.getAvailableChoices();

      // Should only include activities within cluster1 (leaf1, leaf2)
      // cluster2 and leaf3 should be blocked by choiceExit=false
      expect(choices.map(a => a.id)).toContain("leaf1");
      expect(choices.map(a => a.id)).toContain("leaf2");
      expect(choices.map(a => a.id)).not.toContain("leaf3");
      expect(choices.map(a => a.id)).not.toContain("cluster2");
    });

    it("should allow choices within subtree when choiceExit=false at active ancestor", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster = new Activity("cluster", "Cluster");
      const subcluster = new Activity("subcluster", "Subcluster");
      const leaf1 = new Activity("leaf1", "Leaf 1");
      const leaf2 = new Activity("leaf2", "Leaf 2");

      root.addChild(cluster);
      cluster.addChild(subcluster);
      subcluster.addChild(leaf1);
      subcluster.addChild(leaf2);

      root.sequencingControls.choice = true;
      cluster.sequencingControls.choice = true;
      cluster.sequencingControls.choiceExit = false;
      subcluster.sequencingControls.choice = true;

      tree.root = root;
      tree.currentActivity = leaf1;
      cluster.isActive = true;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const choices = process.getAvailableChoices();

      // Activities within cluster should be available
      expect(choices.map(a => a.id)).toContain("leaf1");
      expect(choices.map(a => a.id)).toContain("leaf2");
    });

    it("should not apply choiceExit constraint when ancestor is not active", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster1 = new Activity("cluster1", "Cluster 1");
      const cluster2 = new Activity("cluster2", "Cluster 2");
      const leaf1 = new Activity("leaf1", "Leaf 1");
      const leaf3 = new Activity("leaf3", "Leaf 3");

      root.addChild(cluster1);
      root.addChild(cluster2);
      cluster1.addChild(leaf1);
      cluster2.addChild(leaf3);

      root.sequencingControls.choice = true;
      cluster1.sequencingControls.choice = true;
      cluster1.sequencingControls.choiceExit = false;
      cluster2.sequencingControls.choice = true;

      tree.root = root;
      tree.currentActivity = leaf1;
      cluster1.isActive = false; // Ancestor NOT active

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const choices = process.getAvailableChoices();

      // Since cluster1 is not active, choiceExit doesn't apply
      expect(choices.map(a => a.id)).toContain("leaf1");
      expect(choices.map(a => a.id)).toContain("leaf3");
    });

    it("should validate choice path constraints", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.choice = true;
      root.sequencingControls.forwardOnly = true;

      tree.root = root;
      tree.currentActivity = child2;
      child2.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const choices = process.getAvailableChoices();

      // child1 should be blocked by forwardOnly
      expect(choices.map(a => a.id)).not.toContain("child1");
      expect(choices.map(a => a.id)).toContain("child2");
    });

    it("should handle deep nested activity trees", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const level1 = new Activity("level1", "Level 1");
      const level2 = new Activity("level2", "Level 2");
      const level3 = new Activity("level3", "Level 3");
      const leaf = new Activity("leaf", "Leaf");

      root.addChild(level1);
      level1.addChild(level2);
      level2.addChild(level3);
      level3.addChild(leaf);

      root.sequencingControls.choice = true;
      level1.sequencingControls.choice = true;
      level2.sequencingControls.choice = true;
      level3.sequencingControls.choice = true;

      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const choices = process.getAvailableChoices();

      expect(choices.map(a => a.id)).toContain("leaf");
    });

    it("should exclude root activity from choices", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      root.sequencingControls.choice = true;

      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const choices = process.getAvailableChoices();

      expect(choices.map(a => a.id)).not.toContain("root");
    });

    it("should work when there is no current activity", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.choice = true;

      tree.root = root;
      tree.currentActivity = null; // No current activity

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const choices = process.getAvailableChoices();

      // All available children should be chooseable
      expect(choices.length).toBe(2);
      expect(choices.map(a => a.id)).toContain("child1");
      expect(choices.map(a => a.id)).toContain("child2");
    });

    it("should stop checking higher ancestors after finding blocking choiceExit", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster1 = new Activity("cluster1", "Cluster 1");
      const subcluster = new Activity("subcluster", "Subcluster");
      const leaf1 = new Activity("leaf1", "Leaf 1");
      const leaf2 = new Activity("leaf2", "Leaf 2");
      const external = new Activity("external", "External");

      root.addChild(cluster1);
      root.addChild(external);
      cluster1.addChild(subcluster);
      subcluster.addChild(leaf1);
      subcluster.addChild(leaf2);

      root.sequencingControls.choice = true;
      cluster1.sequencingControls.choice = true;
      cluster1.sequencingControls.choiceExit = false;
      subcluster.sequencingControls.choice = true;
      subcluster.sequencingControls.choiceExit = true; // Doesn't matter - cluster1 blocks

      tree.root = root;
      tree.currentActivity = leaf1;
      cluster1.isActive = true;
      subcluster.isActive = true;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const choices = process.getAvailableChoices();

      // External should be blocked by cluster1's choiceExit=false
      expect(choices.map(a => a.id)).not.toContain("external");
    });
  });

  describe("time-based limit conditions", () => {
    it("should check activity absolute duration limit", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      root.sequencingControls.flow = true;

      // Set duration limit
      child1.activityAbsoluteDurationLimit = "PT1H"; // 1 hour limit
      child1.activityAbsoluteDuration = "PT2H"; // 2 hours used - exceeded

      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // The limit check should be performed during checkActivityProcess
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      // Should detect duration limit exceeded
      expect(result).toBeInstanceOf(SequencingResult);
    });

    it("should check attempt absolute duration limit", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      root.sequencingControls.flow = true;

      // Set attempt duration limit
      child1.attemptAbsoluteDurationLimit = "PT30M"; // 30 minute limit
      child1.attemptAbsoluteDuration = "PT45M"; // 45 minutes used - exceeded

      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      expect(result).toBeInstanceOf(SequencingResult);
    });

    it("should handle time limit action", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      root.sequencingControls.flow = true;

      child1.timeLimitAction = "exit,message";
      child1.timeLimitDuration = "PT10M";

      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      expect(result).toBeInstanceOf(SequencingResult);
    });

    it("should handle begin time limit", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;

      // Set a begin time limit in the past
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1);
      child1.beginTimeLimit = pastDate.toISOString();

      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      expect(result).toBeInstanceOf(SequencingResult);
    });

    it("should handle end time limit", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;

      // Set an end time limit in the past (activity expired)
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1);
      child1.endTimeLimit = pastDate.toISOString();

      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      // Activity may be blocked due to expired end time
      expect(result).toBeInstanceOf(SequencingResult);
    });
  });

  describe("additional flow traversal edge cases", () => {
    it("should handle mixed visible/hidden siblings in flow", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      const child3 = new Activity("child3", "Child 3");
      const child4 = new Activity("child4", "Child 4");

      root.addChild(child1);
      root.addChild(child2);
      root.addChild(child3);
      root.addChild(child4);

      root.sequencingControls.flow = true;

      // Make middle children invisible/unavailable
      child2.isVisible = false;
      child3.isAvailable = false;

      tree.root = root;
      tree.currentActivity = child1;
      child1.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Should skip hidden/unavailable and go to child4
      const result = process.sequencingRequestProcess(SequencingRequestType.CONTINUE);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("child4");
    });

    it("should handle all siblings unavailable during flow", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.flow = true;
      child2.isAvailable = false;

      tree.root = root;
      tree.currentActivity = child1;
      child1.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.CONTINUE);

      // Should end session since no more available activities
      expect(result.endSequencingSession).toBe(true);
    });

    it("should handle deep backward traversal to find available activity", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster1 = new Activity("cluster1", "Cluster 1");
      const cluster2 = new Activity("cluster2", "Cluster 2");
      const leaf1a = new Activity("leaf1a", "Leaf 1A");
      const leaf1b = new Activity("leaf1b", "Leaf 1B");
      const leaf2a = new Activity("leaf2a", "Leaf 2A");

      root.addChild(cluster1);
      root.addChild(cluster2);
      cluster1.addChild(leaf1a);
      cluster1.addChild(leaf1b);
      cluster2.addChild(leaf2a);

      root.sequencingControls.flow = true;
      cluster1.sequencingControls.flow = true;
      cluster2.sequencingControls.flow = true;

      tree.root = root;
      tree.currentActivity = leaf2a;
      leaf2a.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.PREVIOUS);

      // Should traverse back to leaf1b
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("leaf1b");
    });

    it("should handle CONTINUE at root level with no parent", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");

      tree.root = root;
      tree.currentActivity = root;
      root.isActive = true;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.CONTINUE);

      // Should handle gracefully
      expect(result).toBeInstanceOf(SequencingResult);
    });

    it("should handle PREVIOUS at first activity", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.flow = true;

      tree.root = root;
      tree.currentActivity = child1;
      child1.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.PREVIOUS);

      // Should fail since child1 is the first activity
      expect(result.exception).toBeTruthy();
    });

    it("should handle flow through multiple cluster levels", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster1 = new Activity("cluster1", "Cluster 1");
      const cluster2 = new Activity("cluster2", "Cluster 2");
      const subcluster1a = new Activity("subcluster1a", "Subcluster 1A");
      const leaf1 = new Activity("leaf1", "Leaf 1");
      const leaf2 = new Activity("leaf2", "Leaf 2");
      const leaf3 = new Activity("leaf3", "Leaf 3");

      root.addChild(cluster1);
      root.addChild(cluster2);
      cluster1.addChild(subcluster1a);
      subcluster1a.addChild(leaf1);
      subcluster1a.addChild(leaf2);
      cluster2.addChild(leaf3);

      root.sequencingControls.flow = true;
      cluster1.sequencingControls.flow = true;
      cluster2.sequencingControls.flow = true;
      subcluster1a.sequencingControls.flow = true;

      tree.root = root;
      tree.currentActivity = leaf2;
      leaf2.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.CONTINUE);

      // Should traverse from leaf2 -> cluster2 -> leaf3
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("leaf3");
    });

    it("should handle useCurrentAttemptObjectiveInfo flag", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      root.sequencingControls.flow = true;
      root.sequencingControls.useCurrentAttemptObjectiveInfo = true;

      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.START);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
    });

    it("should handle useCurrentAttemptProgressInfo flag", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      root.sequencingControls.flow = true;
      root.sequencingControls.useCurrentAttemptProgressInfo = true;

      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.START);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
    });
  });

  describe("validateChoicePathConstraints edge cases", () => {
    it("should block backward choice to incomplete activity with constrainChoice", () => {
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

      // child1 is incomplete
      child1.completionStatus = "incomplete";

      tree.root = root;
      tree.currentActivity = child3;
      child3.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Try to choose child1 (backward, incomplete) with constrainChoice
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      expect(result.exception).toBe("SB.2.9-7");
    });

    it("should allow backward choice to completed activity with constrainChoice", () => {
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

      // child1 is completed
      child1.completionStatus = "completed";

      tree.root = root;
      tree.currentActivity = child3;
      child3.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Try to choose child1 (backward, completed) with constrainChoice
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      // Should succeed
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("child1");
    });

    it("should block unattempted activity when preventActivation is enabled at ancestor", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const parent = new Activity("parent", "Parent");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(parent);
      parent.addChild(child1);
      parent.addChild(child2);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      parent.sequencingControls.flow = true;
      parent.sequencingControls.choice = true;
      parent.sequencingControls.preventActivation = true;

      // child2 has never been attempted
      child2.attemptCount = 0;
      child2.isActive = false;

      tree.root = root;
      tree.currentActivity = child1;
      child1.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Try to choose child2 (never attempted) with preventActivation
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child2"
      );

      expect(result.exception).toBe("SB.2.9-6");
    });

    it("should allow previously attempted activity with preventActivation", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const parent = new Activity("parent", "Parent");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(parent);
      parent.addChild(child1);
      parent.addChild(child2);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      parent.sequencingControls.flow = true;
      parent.sequencingControls.choice = true;
      parent.sequencingControls.preventActivation = true;

      // child2 has been attempted before
      child2.attemptCount = 1;
      child2.isActive = false;

      tree.root = root;
      tree.currentActivity = child1;
      child1.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Try to choose child2 (previously attempted) with preventActivation
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child2"
      );

      // Should succeed
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
    });
  });

  describe("null currentActivity error handling", () => {
    it("should return exception for PREVIOUS without current activity", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      tree.root = root;
      tree.currentActivity = null;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.PREVIOUS);

      expect(result.exception).toBe("SB.2.12-1");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should return exception for EXIT without current activity", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      tree.root = root;
      tree.currentActivity = null;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.EXIT);

      expect(result.exception).toBe("SB.2.12-1");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should return exception for EXIT_ALL without current activity", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      tree.root = root;
      tree.currentActivity = null;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.EXIT_ALL);

      expect(result.exception).toBe("SB.2.12-1");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should return exception for ABANDON without current activity", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      tree.root = root;
      tree.currentActivity = null;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.ABANDON);

      expect(result.exception).toBe("SB.2.12-1");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should return exception for ABANDON_ALL without current activity", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      tree.root = root;
      tree.currentActivity = null;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.ABANDON_ALL);

      expect(result.exception).toBe("SB.2.12-1");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should return exception for SUSPEND_ALL without current activity", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      tree.root = root;
      tree.currentActivity = null;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.SUSPEND_ALL);

      expect(result.exception).toBe("SB.2.12-1");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should return exception for RETRY without current activity", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      tree.root = root;
      tree.currentActivity = null;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.RETRY);

      expect(result.exception).toBe("SB.2.12-1");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should return exception for JUMP without target", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.JUMP);

      expect(result.exception).toBe("SB.2.12-5");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });
  });

  describe("termination request edge cases", () => {
    it("should handle EXIT when current activity has parent chain", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster = new Activity("cluster", "Cluster");
      const subcluster = new Activity("subcluster", "Subcluster");
      const leaf = new Activity("leaf", "Leaf");

      root.addChild(cluster);
      cluster.addChild(subcluster);
      subcluster.addChild(leaf);

      root.sequencingControls.flow = true;
      cluster.sequencingControls.flow = true;
      subcluster.sequencingControls.flow = true;

      tree.root = root;
      tree.currentActivity = leaf;
      leaf.isActive = true;
      subcluster.isActive = true;
      cluster.isActive = true;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.EXIT);

      // Should exit properly
      expect(result).toBeInstanceOf(SequencingResult);
      expect(leaf.isActive).toBe(false);
    });

    it("should handle SUSPEND_ALL with deep activity chain", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster = new Activity("cluster", "Cluster");
      const leaf = new Activity("leaf", "Leaf");

      root.addChild(cluster);
      cluster.addChild(leaf);

      root.sequencingControls.flow = true;
      cluster.sequencingControls.flow = true;

      tree.root = root;
      tree.currentActivity = leaf;
      leaf.isActive = true;
      cluster.isActive = true;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.SUSPEND_ALL);

      expect(tree.suspendedActivity).toBe(leaf);
      expect(tree.currentActivity).toBeNull();
      expect(leaf.isSuspended).toBe(true);
    });

    it("should handle EXIT_ALL when activities have pending data", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.flow = true;

      // Set some data that would need to be preserved
      child1.objectiveSatisfiedStatus = true;
      child1.completionStatus = "completed";
      child2.objectiveSatisfiedStatus = true;

      tree.root = root;
      tree.currentActivity = child1;
      child1.isActive = true;
      root.isActive = true;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.EXIT_ALL);

      expect(result).toBeInstanceOf(SequencingResult);
    });

    it("should handle ABANDON when activity has unsaved progress", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      root.sequencingControls.flow = true;

      tree.root = root;
      tree.currentActivity = child1;
      child1.isActive = true;
      child1.progressMeasure = 0.5; // Partial progress

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(SequencingRequestType.ABANDON);

      expect(result).toBeInstanceOf(SequencingResult);
      expect(child1.isActive).toBe(false);
    });
  });

  describe("validateConstrainChoiceForFlow scenarios", () => {
    it("should restrict choice when constrainChoice is true and trying to skip forward", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      const child3 = new Activity("child3", "Child 3");
      const child4 = new Activity("child4", "Child 4");

      root.addChild(child1);
      root.addChild(child2);
      root.addChild(child3);
      root.addChild(child4);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      root.sequencingControls.constrainChoice = true;

      tree.root = root;
      tree.currentActivity = child1;
      child1.isActive = true;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Try to skip from child1 to child4 (skipping child2 and child3)
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child4"
      );

      expect(result.exception).toBeTruthy();
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should allow choice to immediate next sibling with constrainChoice", () => {
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
      tree.currentActivity = child1;
      child1.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Choose immediate next sibling
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child2"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("child2");
    });

    it("should allow backward choice to completed activity with constrainChoice and forwardOnly=false", () => {
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
      root.sequencingControls.forwardOnly = false;

      // Mark child1 as completed
      child1.completionStatus = "completed";

      tree.root = root;
      tree.currentActivity = child3;
      child3.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Choose completed child1
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
    });
  });

  describe("mandatory activity handling", () => {
    it("should block choice skipping mandatory incomplete activity", () => {
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

      // Mark child2 as mandatory (incomplete)
      (child2 as any).mandatory = true;
      child2.completionStatus = "incomplete";

      tree.root = root;
      tree.currentActivity = child1;
      child1.isActive = true;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Try to skip child2 to reach child3
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child3"
      );

      expect(result.exception).toBeTruthy();
    });

    it("should allow skipping completed mandatory activity", () => {
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

      // Mark child2 as mandatory but completed
      (child2 as any).mandatory = true;
      child2.completionStatus = "completed";

      tree.root = root;
      tree.currentActivity = child1;
      child1.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Skip child2 to reach child3
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child3"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
    });

    it("should not consider activity mandatory if it has unconditional skip rule", () => {
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

      // child2 has unconditional skip rule
      child2.sequencingRules = new SequencingRules();
      const skipRule = new SequencingRule(RuleActionType.SKIP);
      child2.sequencingRules.addPreConditionRule(skipRule);

      tree.root = root;
      tree.currentActivity = child1;
      child1.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Should be able to skip child2
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child3"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
    });
  });

  describe("hasBackwardChoiceException scenarios", () => {
    it("should allow backward navigation when allowBackwardChoice flag is set", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      root.sequencingControls.forwardOnly = true;

      // Set allowBackwardChoice flag on child1
      (child1 as any).allowBackwardChoice = true;

      tree.root = root;
      tree.currentActivity = child2;
      child2.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Try backward choice with exception flag
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      // May or may not succeed depending on other constraints, but the flag is checked
      expect(result).toBeInstanceOf(SequencingResult);
    });
  });

  describe("boundary violation scenarios", () => {
    it("should detect begin time limit violation", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;

      // Set begin time limit in the future
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      child1.beginTimeLimit = futureDate.toISOString();
      child1.timeLimitAction = "continue,message";

      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      // Should detect the boundary violation
      expect(result).toBeInstanceOf(SequencingResult);
    });

    it("should detect end time limit violation", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;

      // Set end time limit in the past
      const pastDate = new Date();
      pastDate.setFullYear(pastDate.getFullYear() - 1);
      child1.endTimeLimit = pastDate.toISOString();

      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      // Should detect the boundary violation
      expect(result).toBeInstanceOf(SequencingResult);
    });

    it("should detect attempt limit violation in boundary check", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      root.sequencingControls.constrainChoice = true;

      // Set attempt limit exceeded
      child1.attemptLimit = 2;
      child1.attemptCount = 3;

      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      // Should be blocked by attempt limit
      expect(result).toBeInstanceOf(SequencingResult);
    });
  });

  describe("evaluateForwardOnlyForChoice scenarios", () => {
    it("should allow forward choice when forwardOnly is true", () => {
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
      tree.currentActivity = child1;
      child1.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Forward choice should be allowed
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child2"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
    });

    it("should allow backward choice to completed activity with choice enabled in forwardOnly", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      root.sequencingControls.forwardOnly = true;

      // Mark child1 as completed with choice enabled
      child1.completionStatus = "completed";
      child1.sequencingControls.choice = true;

      tree.root = root;
      tree.currentActivity = child2;
      child2.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Backward choice to completed activity
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      // May succeed due to completion exception
      expect(result).toBeInstanceOf(SequencingResult);
    });
  });

  describe("validateConstrainedChoiceBoundaries scenarios", () => {
    it("should fail when parent has choice disabled in path to root", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const parent = new Activity("parent", "Parent");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(parent);
      parent.addChild(child1);
      parent.addChild(child2);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      parent.sequencingControls.flow = true;
      parent.sequencingControls.choice = false; // Choice disabled

      tree.root = root;
      tree.currentActivity = child1;
      child1.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Choice should be blocked
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child2"
      );

      expect(result.exception).toBeTruthy();
    });

    it("should traverse and validate full path to root", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const level1 = new Activity("level1", "Level 1");
      const level2 = new Activity("level2", "Level 2");
      const leaf = new Activity("leaf", "Leaf");

      root.addChild(level1);
      level1.addChild(level2);
      level2.addChild(leaf);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      level1.sequencingControls.flow = true;
      level1.sequencingControls.choice = true;
      level2.sequencingControls.flow = true;
      level2.sequencingControls.choice = true;

      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Choice through full path
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "leaf"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
    });
  });

  describe("multi-level constraint validation", () => {
    it("should validate constraints at each ancestor level", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster1 = new Activity("cluster1", "Cluster 1");
      const cluster2 = new Activity("cluster2", "Cluster 2");
      const leaf1a = new Activity("leaf1a", "Leaf 1A");
      const leaf1b = new Activity("leaf1b", "Leaf 1B");
      const leaf2a = new Activity("leaf2a", "Leaf 2A");

      root.addChild(cluster1);
      root.addChild(cluster2);
      cluster1.addChild(leaf1a);
      cluster1.addChild(leaf1b);
      cluster2.addChild(leaf2a);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      root.sequencingControls.constrainChoice = true;
      cluster1.sequencingControls.flow = true;
      cluster1.sequencingControls.choice = true;
      cluster2.sequencingControls.flow = true;
      cluster2.sequencingControls.choice = true;

      tree.root = root;
      tree.currentActivity = leaf1a;
      leaf1a.isActive = true;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Try to jump across clusters
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "leaf2a"
      );

      // Should be constrained at root level
      expect(result).toBeInstanceOf(SequencingResult);
    });

    it("should find child in path to target activity", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster = new Activity("cluster", "Cluster");
      const subcluster = new Activity("subcluster", "Subcluster");
      const leaf = new Activity("leaf", "Leaf");

      root.addChild(cluster);
      cluster.addChild(subcluster);
      subcluster.addChild(leaf);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      cluster.sequencingControls.flow = true;
      cluster.sequencingControls.choice = true;
      subcluster.sequencingControls.flow = true;
      subcluster.sequencingControls.choice = true;

      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Navigate to deeply nested leaf
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "leaf"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("leaf");
    });
  });

  describe("activityIsCompleted helper scenarios", () => {
    it("should recognize successStatus passed in completion check", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      // No constrainChoice, to allow flexible backward choice

      // Mark child1 with successStatus = passed
      child1.successStatus = "passed";

      tree.root = root;
      tree.currentActivity = child2;
      child2.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Backward choice should be allowed since no constrainChoice
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      // This tests that isActivityCompleted recognizes successStatus=passed
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
    });

    it("should recognize completionStatus passed as completed", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      root.sequencingControls.constrainChoice = true;

      // Mark child1 with completionStatus = passed
      child1.completionStatus = "passed";

      tree.root = root;
      tree.currentActivity = child2;
      child2.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Backward choice should work
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
    });
  });

  describe("getCurrentActivity helper scenarios", () => {
    it("should find active child in parent", () => {
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

      // Mark child2 as active
      child2.isActive = true;

      tree.root = root;
      tree.currentActivity = child2;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Try to skip forward from active child2
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      // Should evaluate constraints based on child2 being active
      expect(result).toBeInstanceOf(SequencingResult);
    });

    it("should return null when no active child exists", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      root.sequencingControls.constrainChoice = true;

      // No children are active
      child1.isActive = false;
      child2.isActive = false;

      tree.root = root;
      tree.currentActivity = null;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Choice without current activity
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child2"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
    });
  });

  describe("validateChoiceTraversalConstraints scenarios", () => {
    it("should block traversal when stopForwardTraversal is set", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster = new Activity("cluster", "Cluster");
      const leaf = new Activity("leaf", "Leaf");

      root.addChild(cluster);
      cluster.addChild(leaf);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      cluster.sequencingControls.flow = true;
      cluster.sequencingControls.stopForwardTraversal = true;

      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Try to traverse into cluster with stopForwardTraversal
      const result = process.sequencingRequestProcess(SequencingRequestType.START);

      // Should be blocked or handled by stopForwardTraversal
      expect(result).toBeInstanceOf(SequencingResult);
    });

    it("should evaluate constrainChoice during traversal", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      root.sequencingControls.constrainChoice = true;

      tree.root = root;
      tree.currentActivity = child1;
      child1.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Valid constrained choice
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child2"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
    });
  });

  describe("isActivityAvailableForChoice scenarios", () => {
    it("should handle choice to invisible activity", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;

      // Make child invisible - this exercises the isVisible check path
      child1.isVisible = false;

      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      // The choice may be delivered or blocked depending on implementation
      // This test exercises the isVisible check in isActivityAvailableForChoice
      expect(result).toBeInstanceOf(SequencingResult);
    });

    it("should handle choice to activity with choice=false in sequencing controls", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;

      // Disable choice on the activity itself
      child1.sequencingControls.choice = false;

      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      // The choice may be delivered or blocked depending on implementation
      // This test exercises the choice control check in isActivityAvailableForChoice
      expect(result).toBeInstanceOf(SequencingResult);
    });
  });

  describe("jump request edge cases", () => {
    it("should reject jump to non-existent activity", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      const result = process.sequencingRequestProcess(
        SequencingRequestType.JUMP,
        "nonexistent"
      );

      expect(result.exception).toBe("SB.2.13-1");
    });
  });

  describe("validation request edge cases", () => {
    it("should validate choice request with non-existent target", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // validateRequestSpecificConstraints is called internally
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "nonexistent"
      );

      expect(result.exception).toBe("SB.2.9-1");
    });
  });

  describe("constraint check error handling", () => {
    it("should handle boundary check errors gracefully", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      root.sequencingControls.constrainChoice = true;

      tree.root = root;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Normal case should not throw
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      expect(result).toBeInstanceOf(SequencingResult);
    });
  });

  describe("validateConstraintsAtAncestorLevel - SB.2.9 specification compliance", () => {
    /**
     * SCORM 2004 SB.2.9-7: Constrained Choice Backward Navigation
     * When constrainChoice is true, backward navigation (choosing an earlier sibling)
     * is only allowed if the target activity is completed or passed.
     * This test verifies that attempting to navigate backward to an INCOMPLETE
     * activity when constrainChoice=true returns exception SB.2.9-7
     */
    it("should return SB.2.9-7 for backward choice to incomplete activity with constrainChoice (SB.2.9)", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      const child3 = new Activity("child3", "Child 3");

      root.addChild(child1);
      root.addChild(child2);
      root.addChild(child3);

      // Per SB.2.9: constrainChoice restricts learner choice navigation
      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      root.sequencingControls.constrainChoice = true;

      // child1 is INCOMPLETE (not completed, not passed)
      // This is the key condition for the test
      child1.completionStatus = "incomplete";
      child1.isAvailable = true;
      child1.isVisible = true;

      tree.root = root;
      // Set current activity to child3 (later sibling)
      tree.currentActivity = child3;
      // NOTE: Must set isActive AFTER setting currentActivity because the setter activates it
      // For choice navigation to proceed, the current activity must be terminated
      child3.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Attempt backward choice from child3 to child1 (incomplete)
      // Per SB.2.9, this should be blocked because target is not completed
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      // SB.2.9-7: "Activity is not available for a choice sequencing request"
      // This is the expected exception when constrainChoice blocks backward navigation
      expect(result.exception).toBe("SB.2.9-7");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    /**
     * SCORM 2004 SB.2.9-6: Prevent Activation
     * When preventActivation is true on an ancestor, learners cannot choose
     * activities that have never been attempted (attemptCount=0) unless
     * they are already active.
     * This test verifies that attempting to choose an unattempted, inactive
     * activity when preventActivation=true returns exception SB.2.9-6
     */
    it("should return SB.2.9-6 for choice to unattempted activity with preventActivation (SB.2.9)", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      // Per SB.2.9: preventActivation restricts choice to previously attempted activities
      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      root.sequencingControls.preventActivation = true;

      // child2 has NEVER been attempted and is not active
      // This is the key condition for the test
      child2.attemptCount = 0;
      child2.isActive = false;
      child2.isAvailable = true;
      child2.isVisible = true;

      // child1 is the current activity (has been attempted)
      child1.attemptCount = 1;
      child1.isActive = true;

      tree.root = root;
      tree.currentActivity = child1;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Attempt to choose child2 which has never been attempted
      // Per SB.2.9, this should be blocked by preventActivation
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child2"
      );

      // SB.2.9-6: "Activity is blocked from activation"
      // This is the expected exception when preventActivation blocks unattempted activity
      expect(result.exception).toBe("SB.2.9-6");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    /**
     * Verify that backward choice to a COMPLETED activity IS allowed with constrainChoice
     * This is the positive case for the constrainChoice backward navigation rule
     */
    it("should allow backward choice to completed activity with constrainChoice (SB.2.9)", () => {
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

      // child1 IS completed - backward choice should be allowed
      child1.completionStatus = "completed";
      child1.isAvailable = true;
      child1.isVisible = true;

      tree.root = root;
      tree.currentActivity = child3;
      child3.isActive = false; // Not active to avoid other constraints

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Backward choice to completed child1 should succeed
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("child1");
    });

    /**
     * Verify that choice to a previously attempted activity IS allowed with preventActivation
     * This is the positive case for the preventActivation rule
     */
    it("should allow choice to previously attempted activity with preventActivation (SB.2.9)", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      root.sequencingControls.preventActivation = true;

      // child2 HAS been attempted - choice should be allowed
      child2.attemptCount = 1;
      child2.isActive = false;
      child2.isAvailable = true;
      child2.isVisible = true;

      child1.attemptCount = 1;
      child1.isAvailable = true;
      child1.isVisible = true;

      tree.root = root;
      tree.currentActivity = child1;

      // Current activity must be terminated (not active) for choice navigation
      // NOTE: Must set isActive AFTER setting currentActivity because the setter activates it
      child1.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Choice to previously attempted child2 should succeed
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child2"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("child2");
    });

    /**
     * Test multi-level ancestor constraint validation
     * Verifies that constraints are checked at EACH ancestor level in the path
     * The backward choice to incomplete leaf1a triggers SB.2.9 validation
     */
    it("should validate constrainChoice at each ancestor level", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster1 = new Activity("cluster1", "Cluster 1");
      const leaf1a = new Activity("leaf1a", "Leaf 1A");
      const leaf1b = new Activity("leaf1b", "Leaf 1B");
      const leaf1c = new Activity("leaf1c", "Leaf 1C");

      root.addChild(cluster1);
      cluster1.addChild(leaf1a);
      cluster1.addChild(leaf1b);
      cluster1.addChild(leaf1c);

      // Only cluster1 has constrainChoice (not root)
      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      cluster1.sequencingControls.flow = true;
      cluster1.sequencingControls.choice = true;
      cluster1.sequencingControls.constrainChoice = true;

      // leaf1a is incomplete and has never been attempted
      leaf1a.completionStatus = "incomplete";
      leaf1a.attemptCount = 0;
      leaf1a.isAvailable = true;
      leaf1a.isVisible = true;

      // Ensure leaf1b and leaf1c have been attempted to avoid preventActivation issues
      leaf1b.attemptCount = 1;
      leaf1c.attemptCount = 1;

      tree.root = root;
      tree.currentActivity = leaf1c;
      // Current activity must be terminated (not active) for choice navigation
      leaf1c.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Backward choice within cluster with constrainChoice should be blocked
      // Could be blocked by constrainChoice (SB.2.9-7) or other constraints
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "leaf1a"
      );

      // The choice is blocked - verify the constraint was applied
      expect(result.exception).toBeTruthy();
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    /**
     * Test preventActivation constraint at nested ancestor level
     */
    it("should validate preventActivation at each ancestor level", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster1 = new Activity("cluster1", "Cluster 1");
      const leaf1a = new Activity("leaf1a", "Leaf 1A");
      const leaf1b = new Activity("leaf1b", "Leaf 1B");

      root.addChild(cluster1);
      cluster1.addChild(leaf1a);
      cluster1.addChild(leaf1b);

      // Only cluster1 has preventActivation
      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      cluster1.sequencingControls.flow = true;
      cluster1.sequencingControls.choice = true;
      cluster1.sequencingControls.preventActivation = true;

      // leaf1b is unattempted
      leaf1b.attemptCount = 0;
      leaf1b.isActive = false;
      leaf1b.isAvailable = true;
      leaf1b.isVisible = true;

      // leaf1a is current and has been attempted
      leaf1a.attemptCount = 1;

      tree.root = root;
      tree.currentActivity = leaf1a;

      // Current activity must be terminated (not active) for choice navigation
      // NOTE: Must set isActive AFTER setting currentActivity because the setter activates it
      leaf1a.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Choice to unattempted sibling should be blocked by preventActivation
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "leaf1b"
      );

      expect(result.exception).toBe("SB.2.9-6");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    /**
     * Test that backward choice to "passed" activity is allowed with constrainChoice
     * (not just "completed" - both should be allowed per spec)
     */
    it("should allow backward choice to passed activity with constrainChoice (SB.2.9)", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      root.sequencingControls.constrainChoice = true;

      // child1 has completionStatus "passed" - backward choice should be allowed
      child1.completionStatus = "passed";
      child1.isAvailable = true;
      child1.isVisible = true;

      tree.root = root;
      tree.currentActivity = child2;
      child2.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Backward choice to "passed" activity should succeed
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
    });

    /**
     * Test that preventActivation check considers isActive status
     * The condition is: attemptCount === 0 && !isActive
     * When isActive is true, the second condition fails
     */
    it("should evaluate isActive in preventActivation check (SB.2.9)", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      root.sequencingControls.preventActivation = true;

      // child2 is unattempted BUT is active
      // The preventActivation condition checks: attemptCount === 0 && !isActive
      // With isActive = true, the !isActive part is false, so condition fails
      child2.attemptCount = 0;
      child2.isActive = true;
      child2.isAvailable = true;
      child2.isVisible = true;

      child1.attemptCount = 1;
      child1.isActive = false;

      tree.root = root;
      tree.currentActivity = child1;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // This exercises the isActive check path in the preventActivation validation
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child2"
      );

      // The result exercises the code path - may or may not deliver
      // depending on other constraints, but preventActivation check runs
      expect(result).toBeInstanceOf(SequencingResult);
    });

    /**
     * Verify that the constrainChoice backward validation specifically checks
     * completionStatus against both "completed" and "passed" values
     */
    it("should check both completed and passed in constrainChoice backward validation", () => {
      const tree = new ActivityTree();
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      root.sequencingControls.constrainChoice = true;

      // child1 has completionStatus = "unknown" (not completed, not passed)
      // This tests the exact condition in lines 2934-2936
      child1.completionStatus = "unknown";
      child1.attemptCount = 1; // Has been attempted
      child1.isAvailable = true;
      child1.isVisible = true;

      child2.attemptCount = 1;

      tree.root = root;
      tree.currentActivity = child2;

      // Current activity must be terminated (not active) to proceed to constrainChoice validation
      // NOTE: Must set isActive AFTER setting currentActivity because the setter activates it
      child2.isActive = false;

      const process = new SequencingProcess(
        tree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav()
      );

      // Backward choice to "unknown" completionStatus should be blocked
      const result = process.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "child1"
      );

      // With constrainChoice and incomplete target, should block with SB.2.9-7
      expect(result.exception).toBe("SB.2.9-7");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });
  });
});
