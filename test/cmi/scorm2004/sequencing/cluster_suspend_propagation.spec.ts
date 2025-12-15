// noinspection DuplicatedCode

import { afterEach, describe, expect, it, vi } from "vitest";

import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";

/**
 * Tests for SCORM 2004 3rd Edition compliance requirements:
 * - REQ-5.2.4: Cluster suspended if any of its children are suspended
 * - REQ-5.2.5: Suspended state propagates up the tree
 * - REQ-6.2.5: All ancestors of suspended activity must be marked suspended
 */
describe("Cluster Suspend Propagation", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("REQ-5.2.4: Cluster suspended if any child is suspended", () => {
    it("should mark parent cluster as suspended when leaf is suspended", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster = new Activity("cluster1", "Cluster 1");
      const leaf = new Activity("leaf1", "Leaf 1");

      root.addChild(cluster);
      cluster.addChild(leaf);
      activityTree.root = root;

      // Suspend the leaf
      activityTree.suspendedActivity = leaf;

      // Both the leaf and its parent cluster should be suspended
      expect(leaf.isSuspended).toBe(true);
      expect(cluster.isSuspended).toBe(true);
    });

    it("should mark root as suspended when any descendant is suspended", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster = new Activity("cluster1", "Cluster 1");
      const leaf = new Activity("leaf1", "Leaf 1");

      root.addChild(cluster);
      cluster.addChild(leaf);
      activityTree.root = root;

      activityTree.suspendedActivity = leaf;

      // Root should also be suspended
      expect(root.isSuspended).toBe(true);
    });
  });

  describe("REQ-5.2.5: Suspended state propagates up the tree", () => {
    it("should propagate suspend state through multiple levels", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root");
      const level1 = new Activity("level1", "Level 1");
      const level2 = new Activity("level2", "Level 2");
      const level3 = new Activity("level3", "Level 3");
      const leaf = new Activity("leaf", "Leaf");

      root.addChild(level1);
      level1.addChild(level2);
      level2.addChild(level3);
      level3.addChild(leaf);
      activityTree.root = root;

      activityTree.suspendedActivity = leaf;

      // All ancestors should be suspended
      expect(leaf.isSuspended).toBe(true);
      expect(level3.isSuspended).toBe(true);
      expect(level2.isSuspended).toBe(true);
      expect(level1.isSuspended).toBe(true);
      expect(root.isSuspended).toBe(true);
    });

    it("should only suspend ancestors, not siblings", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster1 = new Activity("cluster1", "Cluster 1");
      const cluster2 = new Activity("cluster2", "Cluster 2");
      const leaf1 = new Activity("leaf1", "Leaf 1");
      const leaf2 = new Activity("leaf2", "Leaf 2");

      root.addChild(cluster1);
      root.addChild(cluster2);
      cluster1.addChild(leaf1);
      cluster2.addChild(leaf2);
      activityTree.root = root;

      // Suspend leaf1
      activityTree.suspendedActivity = leaf1;

      // leaf1 and its ancestor cluster1 should be suspended
      expect(leaf1.isSuspended).toBe(true);
      expect(cluster1.isSuspended).toBe(true);
      expect(root.isSuspended).toBe(true);

      // Sibling cluster and its children should NOT be suspended
      expect(cluster2.isSuspended).toBe(false);
      expect(leaf2.isSuspended).toBe(false);
    });
  });

  describe("REQ-6.2.5: Resume clears suspended state on ancestors", () => {
    it("should clear suspended state on all ancestors when activity is resumed", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster = new Activity("cluster1", "Cluster 1");
      const leaf = new Activity("leaf1", "Leaf 1");

      root.addChild(cluster);
      cluster.addChild(leaf);
      activityTree.root = root;

      // First suspend
      activityTree.suspendedActivity = leaf;
      expect(leaf.isSuspended).toBe(true);
      expect(cluster.isSuspended).toBe(true);
      expect(root.isSuspended).toBe(true);

      // Then resume (set suspendedActivity to null)
      activityTree.suspendedActivity = null;

      // All should be unsuspended
      expect(leaf.isSuspended).toBe(false);
      expect(cluster.isSuspended).toBe(false);
      expect(root.isSuspended).toBe(false);
    });

    it("should clear previous ancestors when suspending a different activity", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster1 = new Activity("cluster1", "Cluster 1");
      const cluster2 = new Activity("cluster2", "Cluster 2");
      const leaf1 = new Activity("leaf1", "Leaf 1");
      const leaf2 = new Activity("leaf2", "Leaf 2");

      root.addChild(cluster1);
      root.addChild(cluster2);
      cluster1.addChild(leaf1);
      cluster2.addChild(leaf2);
      activityTree.root = root;

      // Suspend leaf1
      activityTree.suspendedActivity = leaf1;
      expect(leaf1.isSuspended).toBe(true);
      expect(cluster1.isSuspended).toBe(true);
      expect(cluster2.isSuspended).toBe(false);

      // Now suspend leaf2 instead
      activityTree.suspendedActivity = leaf2;

      // leaf1 and cluster1 should no longer be suspended
      expect(leaf1.isSuspended).toBe(false);
      expect(cluster1.isSuspended).toBe(false);

      // leaf2 and cluster2 should now be suspended
      expect(leaf2.isSuspended).toBe(true);
      expect(cluster2.isSuspended).toBe(true);

      // Root should still be suspended (common ancestor)
      expect(root.isSuspended).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should handle suspending root activity directly", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root");
      activityTree.root = root;

      activityTree.suspendedActivity = root;

      expect(root.isSuspended).toBe(true);
    });

    it("should handle activity with no parent (root)", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root");
      activityTree.root = root;

      // Should not throw
      activityTree.suspendedActivity = root;
      expect(root.isSuspended).toBe(true);

      activityTree.suspendedActivity = null;
      expect(root.isSuspended).toBe(false);
    });

    it("should handle deeply nested activities (10 levels)", () => {
      const activityTree = new ActivityTree();
      const activities: Activity[] = [];

      // Create 10 levels
      for (let i = 0; i < 10; i++) {
        activities.push(new Activity(`level${i}`, `Level ${i}`));
      }

      // Build tree
      for (let i = 0; i < activities.length - 1; i++) {
        activities[i].addChild(activities[i + 1]);
      }

      activityTree.root = activities[0];

      // Suspend deepest activity
      const deepestActivity = activities[activities.length - 1];
      activityTree.suspendedActivity = deepestActivity;

      // All ancestors should be suspended
      for (const activity of activities) {
        expect(activity.isSuspended).toBe(true);
      }

      // Resume
      activityTree.suspendedActivity = null;

      // All should be unsuspended
      for (const activity of activities) {
        expect(activity.isSuspended).toBe(false);
      }
    });

    it("should maintain suspendedActivity reference", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root");
      const leaf = new Activity("leaf", "Leaf");

      root.addChild(leaf);
      activityTree.root = root;

      activityTree.suspendedActivity = leaf;

      expect(activityTree.suspendedActivity).toBe(leaf);
    });
  });
});
