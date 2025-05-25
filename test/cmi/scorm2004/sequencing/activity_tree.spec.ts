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

      expect(activityTree.getActivity("child1")).toBeUndefined();
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
      expect(activityTree.getActivity("nonexistent")).toBeUndefined();
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
});
