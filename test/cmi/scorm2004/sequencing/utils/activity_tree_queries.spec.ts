import { describe, it, expect, beforeEach } from "vitest";
import { ActivityTreeQueries } from "../../../../../src/cmi/scorm2004/sequencing/utils/activity_tree_queries";
import { Activity } from "../../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../../src/cmi/scorm2004/sequencing/activity_tree";

describe("ActivityTreeQueries", () => {
  let activityTree: ActivityTree;
  let queries: ActivityTreeQueries;
  let root: Activity;
  let chapter1: Activity;
  let chapter2: Activity;
  let lesson1: Activity;
  let lesson2: Activity;
  let lesson3: Activity;

  beforeEach(() => {
    // Build a tree structure:
    // root
    // ├── chapter1
    // │   ├── lesson1
    // │   └── lesson2
    // └── chapter2
    //     └── lesson3

    root = new Activity("root", "Root");
    chapter1 = new Activity("chapter1", "Chapter 1");
    chapter2 = new Activity("chapter2", "Chapter 2");
    lesson1 = new Activity("lesson1", "Lesson 1");
    lesson2 = new Activity("lesson2", "Lesson 2");
    lesson3 = new Activity("lesson3", "Lesson 3");

    root.addChild(chapter1);
    root.addChild(chapter2);
    chapter1.addChild(lesson1);
    chapter1.addChild(lesson2);
    chapter2.addChild(lesson3);

    activityTree = new ActivityTree(root);
    queries = new ActivityTreeQueries(activityTree);
  });

  describe("isInTree", () => {
    it("should return true for activities in the tree", () => {
      expect(queries.isInTree(root)).toBe(true);
      expect(queries.isInTree(chapter1)).toBe(true);
      expect(queries.isInTree(lesson1)).toBe(true);
      expect(queries.isInTree(lesson3)).toBe(true);
    });

    it("should return false for activities not in the tree", () => {
      const orphan = new Activity("orphan", "Orphan");
      expect(queries.isInTree(orphan)).toBe(false);
    });
  });

  describe("isAncestorOf", () => {
    it("should return true when first activity is ancestor of second", () => {
      expect(queries.isAncestorOf(root, chapter1)).toBe(true);
      expect(queries.isAncestorOf(root, lesson1)).toBe(true);
      expect(queries.isAncestorOf(chapter1, lesson1)).toBe(true);
      expect(queries.isAncestorOf(chapter1, lesson2)).toBe(true);
    });

    it("should return false when first activity is not ancestor of second", () => {
      expect(queries.isAncestorOf(chapter1, root)).toBe(false);
      expect(queries.isAncestorOf(lesson1, chapter1)).toBe(false);
      expect(queries.isAncestorOf(chapter1, lesson3)).toBe(false);
      expect(queries.isAncestorOf(lesson1, lesson2)).toBe(false);
    });

    it("should return true when activity is compared to itself", () => {
      // Activity is technically in its own path
      expect(queries.isAncestorOf(lesson1, lesson1)).toBe(true);
    });
  });

  describe("findCommonAncestor", () => {
    it("should find common ancestor of siblings", () => {
      expect(queries.findCommonAncestor(lesson1, lesson2)).toBe(chapter1);
      expect(queries.findCommonAncestor(chapter1, chapter2)).toBe(root);
    });

    it("should find common ancestor of cousins", () => {
      expect(queries.findCommonAncestor(lesson1, lesson3)).toBe(root);
      expect(queries.findCommonAncestor(lesson2, lesson3)).toBe(root);
    });

    it("should return the ancestor when one is ancestor of the other", () => {
      expect(queries.findCommonAncestor(chapter1, lesson1)).toBe(chapter1);
      expect(queries.findCommonAncestor(root, lesson1)).toBe(root);
    });

    it("should return null when either activity is null", () => {
      expect(queries.findCommonAncestor(null, lesson1)).toBeNull();
      expect(queries.findCommonAncestor(lesson1, null)).toBeNull();
      expect(queries.findCommonAncestor(null, null)).toBeNull();
    });
  });

  describe("findChildInPath", () => {
    it("should find the immediate child in path to target", () => {
      expect(queries.findChildInPath(root, lesson1)).toBe(chapter1);
      expect(queries.findChildInPath(root, lesson3)).toBe(chapter2);
      expect(queries.findChildInPath(chapter1, lesson2)).toBe(lesson2);
    });

    it("should return the target if it is an immediate child", () => {
      expect(queries.findChildInPath(chapter1, lesson1)).toBe(lesson1);
      expect(queries.findChildInPath(root, chapter1)).toBe(chapter1);
    });

    it("should return null if target is not a descendant", () => {
      expect(queries.findChildInPath(chapter1, lesson3)).toBeNull();
      expect(queries.findChildInPath(chapter2, lesson1)).toBeNull();
    });

    it("should return null for orphan activities", () => {
      const orphan = new Activity("orphan", "Orphan");
      expect(queries.findChildInPath(root, orphan)).toBeNull();
    });
  });

  describe("isLastInTree", () => {
    it("should return true for the last leaf activity", () => {
      expect(queries.isLastInTree(lesson3)).toBe(true);
    });

    it("should return false for non-last leaf activities", () => {
      expect(queries.isLastInTree(lesson1)).toBe(false);
      expect(queries.isLastInTree(lesson2)).toBe(false);
    });

    it("should return false for cluster activities", () => {
      expect(queries.isLastInTree(root)).toBe(false);
      expect(queries.isLastInTree(chapter1)).toBe(false);
      expect(queries.isLastInTree(chapter2)).toBe(false);
    });
  });

  describe("getCurrentInParent", () => {
    it("should return the active child", () => {
      lesson1.isActive = true;
      expect(queries.getCurrentInParent(chapter1)).toBe(lesson1);
    });

    it("should return null when no child is active", () => {
      expect(queries.getCurrentInParent(chapter1)).toBeNull();
    });

    it("should return the first active child if multiple are active", () => {
      lesson1.isActive = true;
      lesson2.isActive = true;
      // Should return the first one it finds
      expect(queries.getCurrentInParent(chapter1)).toBe(lesson1);
    });
  });

  describe("isMandatory", () => {
    it("should return false for activities without mandatory flag", () => {
      expect(queries.isMandatory(lesson1)).toBe(false);
    });

    it("should return true for activities with mandatory=true", () => {
      (lesson1 as any).mandatory = true;
      expect(queries.isMandatory(lesson1)).toBe(true);
    });

    it("should return false for activities with unconditional skip rule", () => {
      lesson1.sequencingRules.preConditionRules.push({
        action: "skip" as any,
        conditions: []
      } as any);
      expect(queries.isMandatory(lesson1)).toBe(false);
    });
  });

  describe("isCompleted", () => {
    it("should return false for unknown completion status", () => {
      expect(queries.isCompleted(lesson1)).toBe(false);
    });

    it("should return true for completed activities", () => {
      lesson1.completionStatus = "completed" as any;
      expect(queries.isCompleted(lesson1)).toBe(true);
    });

    it("should return true for passed activities", () => {
      lesson1.completionStatus = "passed" as any;
      expect(queries.isCompleted(lesson1)).toBe(true);
    });

    it("should return true for activities with passed success status", () => {
      lesson1.successStatus = "passed" as any;
      expect(queries.isCompleted(lesson1)).toBe(true);
    });
  });

  describe("isAvailableForChoice", () => {
    it("should return true for visible, available, unhidden activities", () => {
      expect(queries.isAvailableForChoice(lesson1)).toBe(true);
    });

    it("should return false for invisible activities", () => {
      lesson1.isVisible = false;
      expect(queries.isAvailableForChoice(lesson1)).toBe(false);
    });

    it("should return false for activities hidden from choice", () => {
      lesson1.isHiddenFromChoice = true;
      expect(queries.isAvailableForChoice(lesson1)).toBe(false);
    });

    it("should return false for unavailable activities", () => {
      lesson1.isAvailable = false;
      expect(queries.isAvailableForChoice(lesson1)).toBe(false);
    });

    it("should return false when choice is disabled in sequencing controls", () => {
      lesson1.sequencingControls.choice = false;
      expect(queries.isAvailableForChoice(lesson1)).toBe(false);
    });
  });

  describe("getAncestors", () => {
    it("should return all ancestors from parent to root", () => {
      const ancestors = queries.getAncestors(lesson1);
      expect(ancestors).toHaveLength(2);
      expect(ancestors[0]).toBe(chapter1);
      expect(ancestors[1]).toBe(root);
    });

    it("should return empty array for root", () => {
      expect(queries.getAncestors(root)).toEqual([]);
    });
  });

  describe("getPathToRoot", () => {
    it("should return path from activity to root inclusive", () => {
      const path = queries.getPathToRoot(lesson1);
      expect(path).toHaveLength(3);
      expect(path[0]).toBe(lesson1);
      expect(path[1]).toBe(chapter1);
      expect(path[2]).toBe(root);
    });

    it("should return just root for root activity", () => {
      const path = queries.getPathToRoot(root);
      expect(path).toEqual([root]);
    });
  });

  describe("isLeaf", () => {
    it("should return true for activities with no children", () => {
      expect(queries.isLeaf(lesson1)).toBe(true);
      expect(queries.isLeaf(lesson2)).toBe(true);
      expect(queries.isLeaf(lesson3)).toBe(true);
    });

    it("should return false for activities with children", () => {
      expect(queries.isLeaf(root)).toBe(false);
      expect(queries.isLeaf(chapter1)).toBe(false);
      expect(queries.isLeaf(chapter2)).toBe(false);
    });
  });

  describe("isCluster", () => {
    it("should return true for activities with children", () => {
      expect(queries.isCluster(root)).toBe(true);
      expect(queries.isCluster(chapter1)).toBe(true);
      expect(queries.isCluster(chapter2)).toBe(true);
    });

    it("should return false for activities without children", () => {
      expect(queries.isCluster(lesson1)).toBe(false);
      expect(queries.isCluster(lesson2)).toBe(false);
      expect(queries.isCluster(lesson3)).toBe(false);
    });
  });

  describe("getDepth", () => {
    it("should return 0 for root", () => {
      expect(queries.getDepth(root)).toBe(0);
    });

    it("should return 1 for immediate children of root", () => {
      expect(queries.getDepth(chapter1)).toBe(1);
      expect(queries.getDepth(chapter2)).toBe(1);
    });

    it("should return 2 for grandchildren of root", () => {
      expect(queries.getDepth(lesson1)).toBe(2);
      expect(queries.getDepth(lesson2)).toBe(2);
      expect(queries.getDepth(lesson3)).toBe(2);
    });
  });
});
