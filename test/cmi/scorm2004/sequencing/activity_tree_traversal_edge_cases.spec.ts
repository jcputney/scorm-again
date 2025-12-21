import { beforeEach, describe, expect, it } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";

describe("Activity Tree Traversal Edge Cases", () => {
  let activityTree: ActivityTree;

  beforeEach(() => {
    activityTree = new ActivityTree();
  });

  describe("single node tree", () => {
    it("should handle getNextSibling on single root node", () => {
      const root = new Activity("root", "Root");
      activityTree.root = root;

      const nextSibling = activityTree.getNextSibling(root);

      expect(nextSibling).toBe(null);
    });

    it("should handle getPreviousSibling on single root node", () => {
      const root = new Activity("root", "Root");
      activityTree.root = root;

      const previousSibling = activityTree.getPreviousSibling(root);

      expect(previousSibling).toBe(null);
    });

    it("should handle getFirstChild on leaf node", () => {
      const root = new Activity("root", "Root");
      activityTree.root = root;

      const firstChild = activityTree.getFirstChild(root);

      expect(firstChild).toBe(null);
    });

    it("should handle getLastChild on leaf node", () => {
      const root = new Activity("root", "Root");
      activityTree.root = root;

      const lastChild = activityTree.getLastChild(root);

      expect(lastChild).toBe(null);
    });

    it("should handle getSiblings on single root node", () => {
      const root = new Activity("root", "Root");
      activityTree.root = root;

      const siblings = activityTree.getSiblings(root);

      expect(siblings).toEqual([]);
    });

    it("should handle getCommonAncestor with itself", () => {
      const root = new Activity("root", "Root");
      activityTree.root = root;

      const commonAncestor = activityTree.getCommonAncestor(root, root);

      expect(commonAncestor).toBe(root);
    });
  });

  describe("deeply nested tree", () => {
    it("should traverse deeply nested tree correctly", () => {
      let current = new Activity("root", "Root");
      const root = current;
      const levels: Activity[] = [root];

      // Create 10 levels deep
      for (let i = 1; i <= 10; i++) {
        const child = new Activity(`level${i}`, `Level ${i}`);
        current.addChild(child);
        levels.push(child);
        current = child;
      }

      activityTree.root = root;

      // Test parent traversal from deepest node
      let parent = activityTree.getParent(levels[10]);
      expect(parent).toBe(levels[9]);

      parent = activityTree.getParent(levels[5]);
      expect(parent).toBe(levels[4]);
    });

    it("should find common ancestor in deeply nested tree", () => {
      const root = new Activity("root", "Root");
      const branch1 = new Activity("branch1", "Branch 1");
      const branch2 = new Activity("branch2", "Branch 2");

      root.addChild(branch1);
      root.addChild(branch2);

      let current1 = branch1;
      for (let i = 0; i < 5; i++) {
        const child = new Activity(`b1-${i}`, `Branch 1 Level ${i}`);
        current1.addChild(child);
        current1 = child;
      }

      let current2 = branch2;
      for (let i = 0; i < 5; i++) {
        const child = new Activity(`b2-${i}`, `Branch 2 Level ${i}`);
        current2.addChild(child);
        current2 = child;
      }

      activityTree.root = root;

      const commonAncestor = activityTree.getCommonAncestor(current1, current2);

      expect(commonAncestor).toBe(root);
    });

    it("should handle getCommonAncestor when one is ancestor of the other", () => {
      const root = new Activity("root", "Root");
      const child = new Activity("child", "Child");
      const grandchild = new Activity("grandchild", "Grandchild");

      root.addChild(child);
      child.addChild(grandchild);

      activityTree.root = root;

      const commonAncestor = activityTree.getCommonAncestor(root, grandchild);

      expect(commonAncestor).toBe(root);
    });
  });

  describe("wide tree (many siblings)", () => {
    it("should handle getNextSibling with many siblings", () => {
      const root = new Activity("root", "Root");
      const children: Activity[] = [];

      for (let i = 0; i < 20; i++) {
        const child = new Activity(`child${i}`, `Child ${i}`);
        root.addChild(child);
        children.push(child);
      }

      activityTree.root = root;

      // Test middle sibling
      const nextSibling = activityTree.getNextSibling(children[10]);
      expect(nextSibling).toBe(children[11]);

      // Test first sibling
      const nextOfFirst = activityTree.getNextSibling(children[0]);
      expect(nextOfFirst).toBe(children[1]);

      // Test last sibling
      const nextOfLast = activityTree.getNextSibling(children[19]);
      expect(nextOfLast).toBe(null);
    });

    it("should handle getPreviousSibling with many siblings", () => {
      const root = new Activity("root", "Root");
      const children: Activity[] = [];

      for (let i = 0; i < 20; i++) {
        const child = new Activity(`child${i}`, `Child ${i}`);
        root.addChild(child);
        children.push(child);
      }

      activityTree.root = root;

      // Test middle sibling
      const prevSibling = activityTree.getPreviousSibling(children[10]);
      expect(prevSibling).toBe(children[9]);

      // Test last sibling
      const prevOfLast = activityTree.getPreviousSibling(children[19]);
      expect(prevOfLast).toBe(children[18]);

      // Test first sibling
      const prevOfFirst = activityTree.getPreviousSibling(children[0]);
      expect(prevOfFirst).toBe(null);
    });

    it("should handle getSiblings with many siblings", () => {
      const root = new Activity("root", "Root");
      const children: Activity[] = [];

      for (let i = 0; i < 10; i++) {
        const child = new Activity(`child${i}`, `Child ${i}`);
        root.addChild(child);
        children.push(child);
      }

      activityTree.root = root;

      const siblings = activityTree.getSiblings(children[5]);

      expect(siblings.length).toBe(9); // All except the queried child
      expect(siblings).not.toContain(children[5]);
      expect(siblings).toContain(children[0]);
      expect(siblings).toContain(children[9]);
    });
  });

  describe("with available children (selection/randomization)", () => {
    it("should use available children when requested", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      const child3 = new Activity("child3", "Child 3");

      root.addChild(child1);
      root.addChild(child2);
      root.addChild(child3);

      activityTree.root = root;

      const availableChildren = activityTree.getChildren(root, true);
      const allChildren = activityTree.getChildren(root, false);

      expect(allChildren.length).toBe(3);
      expect(availableChildren.length).toBe(3);
    });

    it("should handle getNextSibling with fallback to raw children", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      const child3 = new Activity("child3", "Child 3");

      root.addChild(child1);
      root.addChild(child2);
      root.addChild(child3);

      activityTree.root = root;

      const nextSibling = activityTree.getNextSibling(child1, true);

      expect(nextSibling).toBe(child2);
    });

    it("should fallback to raw children if not found in available children", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      activityTree.root = root;

      // Try to get next sibling
      const nextSibling = activityTree.getNextSibling(child1, true);

      // Should fallback to raw children and find child2
      expect(nextSibling).toBe(child2);
    });

    it("should handle getFirstChild with available children", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      activityTree.root = root;

      const firstChild = activityTree.getFirstChild(root, true);

      expect(firstChild).toBe(child1);
    });

    it("should handle getLastChild with available children", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      const child3 = new Activity("child3", "Child 3");

      root.addChild(child1);
      root.addChild(child2);
      root.addChild(child3);

      activityTree.root = root;

      const lastChild = activityTree.getLastChild(root, true);

      expect(lastChild).toBe(child3);
    });
  });

  describe("edge cases with null/empty", () => {
    it("should handle getParent on root node", () => {
      const root = new Activity("root", "Root");
      activityTree.root = root;

      const parent = activityTree.getParent(root);

      expect(parent).toBe(null);
    });

    it("should handle getChildren on empty tree", () => {
      activityTree.root = null;

      expect(() => {
        if (activityTree.root) {
          activityTree.getChildren(activityTree.root);
        }
      }).not.toThrow();
    });

    it("should handle getCommonAncestor with disconnected activities", () => {
      const tree1Root = new Activity("tree1", "Tree 1");
      const tree2Root = new Activity("tree2", "Tree 2");

      activityTree.root = tree1Root;

      const commonAncestor = activityTree.getCommonAncestor(tree1Root, tree2Root);

      expect(commonAncestor).toBe(null);
    });

    it("should handle all traversal methods on null tree", () => {
      activityTree.root = null;

      expect(activityTree.root).toBe(null);
      expect(activityTree.currentActivity).toBe(null);
    });
  });

  describe("boundary conditions", () => {
    it("should handle getNextSibling on last child", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      activityTree.root = root;

      const nextSibling = activityTree.getNextSibling(child2);

      expect(nextSibling).toBe(null);
    });

    it("should handle getPreviousSibling on first child", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      activityTree.root = root;

      const previousSibling = activityTree.getPreviousSibling(child1);

      expect(previousSibling).toBe(null);
    });

    it("should handle getFirstChild when only one child", () => {
      const root = new Activity("root", "Root");
      const onlyChild = new Activity("onlyChild", "Only Child");

      root.addChild(onlyChild);

      activityTree.root = root;

      const firstChild = activityTree.getFirstChild(root);

      expect(firstChild).toBe(onlyChild);
    });

    it("should handle getLastChild when only one child", () => {
      const root = new Activity("root", "Root");
      const onlyChild = new Activity("onlyChild", "Only Child");

      root.addChild(onlyChild);

      activityTree.root = root;

      const lastChild = activityTree.getLastChild(root);

      expect(lastChild).toBe(onlyChild);
    });
  });

  describe("complex tree structures", () => {
    it("should handle unbalanced tree", () => {
      const root = new Activity("root", "Root");
      const leftBranch = new Activity("left", "Left");
      const rightBranch = new Activity("right", "Right");

      root.addChild(leftBranch);
      root.addChild(rightBranch);

      // Left branch goes deep
      let current = leftBranch;
      for (let i = 0; i < 10; i++) {
        const child = new Activity(`left-${i}`, `Left ${i}`);
        current.addChild(child);
        current = child;
      }

      // Right branch is shallow
      const rightChild = new Activity("right-child", "Right Child");
      rightBranch.addChild(rightChild);

      activityTree.root = root;

      const commonAncestor = activityTree.getCommonAncestor(current, rightChild);

      expect(commonAncestor).toBe(root);
    });

    it("should handle tree with mixed leaf and cluster nodes", () => {
      const root = new Activity("root", "Root");
      const cluster = new Activity("cluster", "Cluster");
      const leaf1 = new Activity("leaf1", "Leaf 1");
      const leaf2 = new Activity("leaf2", "Leaf 2");

      root.addChild(cluster);
      root.addChild(leaf1);
      cluster.addChild(leaf2);

      activityTree.root = root;

      expect(activityTree.getFirstChild(root)).toBe(cluster);
      expect(activityTree.getLastChild(root)).toBe(leaf1);
      expect(activityTree.getFirstChild(cluster)).toBe(leaf2);
      expect(activityTree.getFirstChild(leaf1)).toBe(null);
    });

    it("should handle getCommonAncestor in same branch", () => {
      const root = new Activity("root", "Root");
      const branch = new Activity("branch", "Branch");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(branch);
      branch.addChild(child1);
      branch.addChild(child2);

      activityTree.root = root;

      const commonAncestor = activityTree.getCommonAncestor(child1, child2);

      expect(commonAncestor).toBe(branch);
    });

    it("should handle siblings at different levels", () => {
      const root = new Activity("root", "Root");
      const parent1 = new Activity("parent1", "Parent 1");
      const parent2 = new Activity("parent2", "Parent 2");
      const child1 = new Activity("child1", "Child 1");
      const grandchild1 = new Activity("grandchild1", "Grandchild 1");

      root.addChild(parent1);
      root.addChild(parent2);
      parent1.addChild(child1);
      child1.addChild(grandchild1);

      activityTree.root = root;

      const commonAncestor = activityTree.getCommonAncestor(grandchild1, parent2);

      expect(commonAncestor).toBe(root);
    });
  });

  describe("getAllActivities", () => {
    it("should return all activities in tree", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      const grandchild = new Activity("grandchild", "Grandchild");

      root.addChild(child1);
      root.addChild(child2);
      child1.addChild(grandchild);

      activityTree.root = root;

      const allActivities = activityTree.getAllActivities();

      expect(allActivities.length).toBe(4);
      expect(allActivities).toContain(root);
      expect(allActivities).toContain(child1);
      expect(allActivities).toContain(child2);
      expect(allActivities).toContain(grandchild);
    });

    it("should return single activity for single node tree", () => {
      const root = new Activity("root", "Root");
      activityTree.root = root;

      const allActivities = activityTree.getAllActivities();

      expect(allActivities.length).toBe(1);
      expect(allActivities[0]).toBe(root);
    });

    it("should return empty array for null tree", () => {
      activityTree.root = null;

      const allActivities = activityTree.getAllActivities();

      expect(allActivities).toEqual([]);
    });
  });

  describe("getActivity", () => {
    it("should retrieve activity by ID", () => {
      const root = new Activity("root", "Root");
      const child = new Activity("child1", "Child 1");
      root.addChild(child);

      activityTree.root = root;

      const retrieved = activityTree.getActivity("child1");

      expect(retrieved).toBe(child);
    });

    it("should return null for non-existent ID", () => {
      const root = new Activity("root", "Root");
      activityTree.root = root;

      const retrieved = activityTree.getActivity("non-existent");

      expect(retrieved).toBe(null);
    });

    it("should retrieve deeply nested activity by ID", () => {
      const root = new Activity("root", "Root");
      let current = root;

      for (let i = 0; i < 5; i++) {
        const child = new Activity(`level${i}`, `Level ${i}`);
        current.addChild(child);
        current = child;
      }

      activityTree.root = root;

      const retrieved = activityTree.getActivity("level4");

      expect(retrieved).not.toBe(null);
      expect(retrieved?.id).toBe("level4");
    });
  });
});
