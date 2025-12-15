// noinspection DuplicatedCode

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { Scorm2004ValidationError } from "../../../../src/exceptions/scorm2004_exceptions";

describe("ActivityTree", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("constructor", () => {
    it("should initialize with default values", () => {
      const activityTree = new ActivityTree();
      expect(activityTree.root).toBe(null);
      expect(activityTree.currentActivity).toBe(null);
      expect(activityTree.suspendedActivity).toBe(null);
    });
  });

  describe("initialize", () => {
    it("should set initialized flag", () => {
      const activityTree = new ActivityTree();
      activityTree.initialize();
      expect(activityTree.initialized).toBe(true);
    });

    it("should initialize root activity", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root Activity");
      activityTree.root = root;

      const rootInitializeSpy = vi.spyOn(root, "initialize");

      activityTree.initialize();

      expect(rootInitializeSpy).toHaveBeenCalled();
    });
  });

  describe("reset", () => {
    it("should reset properties to default values", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root Activity");
      const activity = new Activity("activity1", "Activity 1");

      activityTree.root = root;
      activityTree.currentActivity = activity;
      activityTree.suspendedActivity = activity;

      activityTree.reset();

      expect(activityTree.initialized).toBe(false);
      expect(activityTree.currentActivity).toBe(null);
      expect(activityTree.suspendedActivity).toBe(null);
    });

    it("should reset root activity", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root Activity");
      activityTree.root = root;

      const rootResetSpy = vi.spyOn(root, "reset");

      activityTree.reset();

      expect(rootResetSpy).toHaveBeenCalled();
    });

    it("should rebuild activities map after reset", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root Activity");
      const child = new Activity("child1", "Child 1");
      root.addChild(child);

      activityTree.root = root;
      expect(activityTree.getAllActivities().length).toBe(2);

      activityTree.reset();

      // Activities map should still contain root and child after reset
      expect(activityTree.getAllActivities().length).toBe(2);
      expect(activityTree.getActivity("child1")).toBe(child);
    });
  });

  describe("root", () => {
    it("should set and get root activity", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root Activity");

      activityTree.root = root;

      expect(activityTree.root).toBe(root);
    });

    it("should throw error if root is not an Activity", () => {
      const activityTree = new ActivityTree();

      expect(() => {
        activityTree.root = "not an activity" as any;
      }).toThrow(Scorm2004ValidationError);
    });

    it("should add root and its children to activities map", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root Activity");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      activityTree.root = root;

      expect(activityTree.getActivity("root")).toBe(root);
      expect(activityTree.getActivity("child1")).toBe(child1);
      expect(activityTree.getActivity("child2")).toBe(child2);
    });

    it("should replace activities map when setting new root", () => {
      const activityTree = new ActivityTree();

      const root1 = new Activity("root1", "Root 1");
      const child1 = new Activity("child1", "Child 1");
      root1.addChild(child1);
      activityTree.root = root1;

      expect(activityTree.getActivity("child1")).toBe(child1);

      const root2 = new Activity("root2", "Root 2");
      const child2 = new Activity("child2", "Child 2");
      root2.addChild(child2);
      activityTree.root = root2;

      expect(activityTree.getActivity("child1")).toBeNull();
      expect(activityTree.getActivity("child2")).toBe(child2);
      expect(activityTree.root).toBe(root2);
      expect(activityTree.getAllActivities().length).toBe(2);
    });
  });

  describe("currentActivity", () => {
    it("should set and get current activity", () => {
      const activityTree = new ActivityTree();
      const activity = new Activity("activity1", "Activity 1");

      activityTree.currentActivity = activity;

      expect(activityTree.currentActivity).toBe(activity);
      expect(activity.isActive).toBe(true);
    });

    it("should deactivate previous current activity", () => {
      const activityTree = new ActivityTree();
      const activity1 = new Activity("activity1", "Activity 1");
      const activity2 = new Activity("activity2", "Activity 2");

      activityTree.currentActivity = activity1;
      expect(activity1.isActive).toBe(true);

      activityTree.currentActivity = activity2;
      expect(activity1.isActive).toBe(false);
      expect(activity2.isActive).toBe(true);
    });

    it("should throw error if activity is not an Activity", () => {
      const activityTree = new ActivityTree();

      expect(() => {
        activityTree.currentActivity = "not an activity" as any;
      }).toThrow(Scorm2004ValidationError);
    });
  });

  describe("suspendedActivity", () => {
    it("should set and get suspended activity", () => {
      const activityTree = new ActivityTree();
      const activity = new Activity("activity1", "Activity 1");

      activityTree.suspendedActivity = activity;

      expect(activityTree.suspendedActivity).toBe(activity);
      expect(activity.isSuspended).toBe(true);
    });

    it("should unsuspend previous suspended activity", () => {
      const activityTree = new ActivityTree();
      const activity1 = new Activity("activity1", "Activity 1");
      const activity2 = new Activity("activity2", "Activity 2");

      activityTree.suspendedActivity = activity1;
      expect(activity1.isSuspended).toBe(true);

      activityTree.suspendedActivity = activity2;
      expect(activity1.isSuspended).toBe(false);
      expect(activity2.isSuspended).toBe(true);
    });

    it("should throw error if activity is not an Activity", () => {
      const activityTree = new ActivityTree();

      expect(() => {
        activityTree.suspendedActivity = "not an activity" as any;
      }).toThrow(Scorm2004ValidationError);
    });
  });

  describe("getActivity", () => {
    it("should return activity by id", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root Activity");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      activityTree.root = root;

      expect(activityTree.getActivity("root")).toBe(root);
      expect(activityTree.getActivity("child1")).toBe(child1);
      expect(activityTree.getActivity("child2")).toBe(child2);
      expect(activityTree.getActivity("nonexistent")).toBeNull();
    });
  });

  describe("getAllActivities", () => {
    it("should return all activities in the tree", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root Activity");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      activityTree.root = root;

      const allActivities = activityTree.getAllActivities();
      expect(allActivities.length).toBe(3);
      expect(allActivities).toContain(root);
      expect(allActivities).toContain(child1);
      expect(allActivities).toContain(child2);
    });
  });

  describe("navigation methods", () => {
    let activityTree: ActivityTree;
    let root: Activity;
    let child1: Activity;
    let child2: Activity;
    let grandchild1: Activity;
    let grandchild2: Activity;

    beforeEach(() => {
      activityTree = new ActivityTree();
      root = new Activity("root", "Root Activity");
      child1 = new Activity("child1", "Child 1");
      child2 = new Activity("child2", "Child 2");
      grandchild1 = new Activity("grandchild1", "Grandchild 1");
      grandchild2 = new Activity("grandchild2", "Grandchild 2");

      root.addChild(child1);
      root.addChild(child2);
      child1.addChild(grandchild1);
      child1.addChild(grandchild2);

      activityTree.root = root;
    });

    it("getParent should return parent activity", () => {
      expect(activityTree.getParent(root)).toBe(null);
      expect(activityTree.getParent(child1)).toBe(root);
      expect(activityTree.getParent(grandchild1)).toBe(child1);
    });

    it("getChildren should return child activities", () => {
      const rootChildren = activityTree.getChildren(root);
      expect(rootChildren.length).toBe(2);
      expect(rootChildren).toContain(child1);
      expect(rootChildren).toContain(child2);

      const child1Children = activityTree.getChildren(child1);
      expect(child1Children.length).toBe(2);
      expect(child1Children).toContain(grandchild1);
      expect(child1Children).toContain(grandchild2);

      const child2Children = activityTree.getChildren(child2);
      expect(child2Children.length).toBe(0);
    });

    it("getSiblings should return sibling activities", () => {
      const rootSiblings = activityTree.getSiblings(root);
      expect(rootSiblings.length).toBe(0);

      const child1Siblings = activityTree.getSiblings(child1);
      expect(child1Siblings.length).toBe(1);
      expect(child1Siblings).toContain(child2);

      const grandchild1Siblings = activityTree.getSiblings(grandchild1);
      expect(grandchild1Siblings.length).toBe(1);
      expect(grandchild1Siblings).toContain(grandchild2);
    });

    it("getNextSibling should return next sibling activity", () => {
      expect(activityTree.getNextSibling(root)).toBe(null);
      expect(activityTree.getNextSibling(child1)).toBe(child2);
      expect(activityTree.getNextSibling(child2)).toBe(null);
      expect(activityTree.getNextSibling(grandchild1)).toBe(grandchild2);
      expect(activityTree.getNextSibling(grandchild2)).toBe(null);
    });

    it("getPreviousSibling should return previous sibling activity", () => {
      expect(activityTree.getPreviousSibling(root)).toBe(null);
      expect(activityTree.getPreviousSibling(child1)).toBe(null);
      expect(activityTree.getPreviousSibling(child2)).toBe(child1);
      expect(activityTree.getPreviousSibling(grandchild1)).toBe(null);
      expect(activityTree.getPreviousSibling(grandchild2)).toBe(grandchild1);
    });

    it("getFirstChild should return first child activity", () => {
      expect(activityTree.getFirstChild(root)).toBe(child1);
      expect(activityTree.getFirstChild(child1)).toBe(grandchild1);
      expect(activityTree.getFirstChild(child2)).toBe(null);
    });

    it("getLastChild should return last child activity", () => {
      expect(activityTree.getLastChild(root)).toBe(child2);
      expect(activityTree.getLastChild(child1)).toBe(grandchild2);
      expect(activityTree.getLastChild(child2)).toBe(null);
    });

    it("getCommonAncestor should return common ancestor activity", () => {
      expect(activityTree.getCommonAncestor(grandchild1, grandchild2)).toBe(child1);
      expect(activityTree.getCommonAncestor(grandchild1, child2)).toBe(root);
      expect(activityTree.getCommonAncestor(child1, child2)).toBe(root);
      expect(activityTree.getCommonAncestor(root, child1)).toBe(root);
      expect(activityTree.getCommonAncestor(root, root)).toBe(root);
    });
  });

  describe("toJSON", () => {
    it("should return a JSON representation of the activity tree", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root Activity");
      const child = new Activity("child1", "Child 1");

      root.addChild(child);

      activityTree.root = root;
      activityTree.currentActivity = child;

      const result = activityTree.toJSON();

      expect(result).toHaveProperty("root");
      expect(result).toHaveProperty("currentActivity", "child1");
      expect(result).toHaveProperty("suspendedActivity", null);
    });
  });

  describe("Cluster Suspend Propagation", () => {
    it("should mark all ancestors as suspended when a leaf is suspended", () => {
      const tree = new ActivityTree();
      const root = new Activity({ id: "root", title: "Root" });
      const cluster = new Activity({ id: "cluster", title: "Cluster" });
      const leaf = new Activity({ id: "leaf", title: "Leaf" });

      tree.root = root;
      root.addChild(cluster);
      cluster.addChild(leaf);

      // Suspend the leaf
      tree.suspendedActivity = leaf;

      // Verify all ancestors are also suspended
      expect(leaf.isSuspended).toBe(true);
      expect(cluster.isSuspended).toBe(true);
      expect(root.isSuspended).toBe(true);
    });

    it("should unsuspend all ancestors when suspended activity is cleared", () => {
      const tree = new ActivityTree();
      const root = new Activity({ id: "root", title: "Root" });
      const cluster = new Activity({ id: "cluster", title: "Cluster" });
      const leaf = new Activity({ id: "leaf", title: "Leaf" });

      tree.root = root;
      root.addChild(cluster);
      cluster.addChild(leaf);

      // Suspend then unsuspend
      tree.suspendedActivity = leaf;
      tree.suspendedActivity = null;

      // Verify all are no longer suspended
      expect(leaf.isSuspended).toBe(false);
      expect(cluster.isSuspended).toBe(false);
      expect(root.isSuspended).toBe(false);
    });

    it("should handle switching suspended activity to different branch", () => {
      const tree = new ActivityTree();
      const root = new Activity({ id: "root", title: "Root" });
      const cluster1 = new Activity({ id: "cluster1", title: "Cluster1" });
      const cluster2 = new Activity({ id: "cluster2", title: "Cluster2" });
      const leaf1 = new Activity({ id: "leaf1", title: "Leaf1" });
      const leaf2 = new Activity({ id: "leaf2", title: "Leaf2" });

      tree.root = root;
      root.addChild(cluster1);
      root.addChild(cluster2);
      cluster1.addChild(leaf1);
      cluster2.addChild(leaf2);

      // Suspend leaf1
      tree.suspendedActivity = leaf1;
      expect(cluster1.isSuspended).toBe(true);
      expect(cluster2.isSuspended).toBe(false);

      // Switch to leaf2
      tree.suspendedActivity = leaf2;
      expect(leaf1.isSuspended).toBe(false);
      expect(cluster1.isSuspended).toBe(false);
      expect(leaf2.isSuspended).toBe(true);
      expect(cluster2.isSuspended).toBe(true);
      expect(root.isSuspended).toBe(true);
    });
  });

  describe("Active Path Validation (REQ-5.1.5, REQ-6.1.3)", () => {
    it("should mark all ancestors as active when an activity becomes current", () => {
      const tree = new ActivityTree();
      const root = new Activity({ id: "root", title: "Root" });
      const cluster = new Activity({ id: "cluster", title: "Cluster" });
      const leaf = new Activity({ id: "leaf", title: "Leaf" });

      tree.root = root;
      root.addChild(cluster);
      cluster.addChild(leaf);

      // Set leaf as current
      tree.currentActivity = leaf;

      // Verify the leaf and all ancestors are active
      expect(leaf.isActive).toBe(true);
      expect(cluster.isActive).toBe(true);
      expect(root.isActive).toBe(true);
    });

    it("should deactivate all ancestors when current activity is cleared", () => {
      const tree = new ActivityTree();
      const root = new Activity({ id: "root", title: "Root" });
      const cluster = new Activity({ id: "cluster", title: "Cluster" });
      const leaf = new Activity({ id: "leaf", title: "Leaf" });

      tree.root = root;
      root.addChild(cluster);
      cluster.addChild(leaf);

      // Set and then clear current activity
      tree.currentActivity = leaf;
      tree.currentActivity = null;

      // Verify all are no longer active
      expect(leaf.isActive).toBe(false);
      expect(cluster.isActive).toBe(false);
      expect(root.isActive).toBe(false);
    });

    it("should handle switching current activity to different branch", () => {
      const tree = new ActivityTree();
      const root = new Activity({ id: "root", title: "Root" });
      const cluster1 = new Activity({ id: "cluster1", title: "Cluster1" });
      const cluster2 = new Activity({ id: "cluster2", title: "Cluster2" });
      const leaf1 = new Activity({ id: "leaf1", title: "Leaf1" });
      const leaf2 = new Activity({ id: "leaf2", title: "Leaf2" });

      tree.root = root;
      root.addChild(cluster1);
      root.addChild(cluster2);
      cluster1.addChild(leaf1);
      cluster2.addChild(leaf2);

      // Set leaf1 as current
      tree.currentActivity = leaf1;
      expect(leaf1.isActive).toBe(true);
      expect(cluster1.isActive).toBe(true);
      expect(cluster2.isActive).toBe(false);
      expect(leaf2.isActive).toBe(false);

      // Switch to leaf2
      tree.currentActivity = leaf2;

      // Old path should be deactivated
      expect(leaf1.isActive).toBe(false);
      expect(cluster1.isActive).toBe(false);

      // New path should be activated
      expect(leaf2.isActive).toBe(true);
      expect(cluster2.isActive).toBe(true);
      expect(root.isActive).toBe(true);
    });

    it("should handle switching current activity within same parent", () => {
      const tree = new ActivityTree();
      const root = new Activity({ id: "root", title: "Root" });
      const cluster = new Activity({ id: "cluster", title: "Cluster" });
      const leaf1 = new Activity({ id: "leaf1", title: "Leaf1" });
      const leaf2 = new Activity({ id: "leaf2", title: "Leaf2" });

      tree.root = root;
      root.addChild(cluster);
      cluster.addChild(leaf1);
      cluster.addChild(leaf2);

      // Set leaf1 as current
      tree.currentActivity = leaf1;
      expect(leaf1.isActive).toBe(true);
      expect(cluster.isActive).toBe(true);
      expect(root.isActive).toBe(true);

      // Switch to leaf2 (same parent)
      tree.currentActivity = leaf2;

      // Leaf1 should be deactivated
      expect(leaf1.isActive).toBe(false);

      // Leaf2 and shared ancestors should be active
      expect(leaf2.isActive).toBe(true);
      expect(cluster.isActive).toBe(true);
      expect(root.isActive).toBe(true);
    });

    it("should handle setting cluster as current activity", () => {
      const tree = new ActivityTree();
      const root = new Activity({ id: "root", title: "Root" });
      const cluster = new Activity({ id: "cluster", title: "Cluster" });
      const leaf = new Activity({ id: "leaf", title: "Leaf" });

      tree.root = root;
      root.addChild(cluster);
      cluster.addChild(leaf);

      // Set cluster as current (not just a leaf)
      tree.currentActivity = cluster;

      // Verify cluster and its ancestors are active, but not children
      expect(cluster.isActive).toBe(true);
      expect(root.isActive).toBe(true);
      expect(leaf.isActive).toBe(false);
    });

    it("should handle deep nesting with multiple levels", () => {
      const tree = new ActivityTree();
      const root = new Activity({ id: "root", title: "Root" });
      const level1 = new Activity({ id: "level1", title: "Level1" });
      const level2 = new Activity({ id: "level2", title: "Level2" });
      const level3 = new Activity({ id: "level3", title: "Level3" });
      const leaf = new Activity({ id: "leaf", title: "Leaf" });

      tree.root = root;
      root.addChild(level1);
      level1.addChild(level2);
      level2.addChild(level3);
      level3.addChild(leaf);

      // Set deeply nested leaf as current
      tree.currentActivity = leaf;

      // Verify entire path is active
      expect(leaf.isActive).toBe(true);
      expect(level3.isActive).toBe(true);
      expect(level2.isActive).toBe(true);
      expect(level1.isActive).toBe(true);
      expect(root.isActive).toBe(true);
    });
  });
});
