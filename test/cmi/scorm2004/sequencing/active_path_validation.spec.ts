// noinspection DuplicatedCode

import { afterEach, describe, expect, it, vi } from "vitest";

import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";

/**
 * Tests for SCORM 2004 3rd Edition compliance requirements:
 * - REQ-5.1.5: Active path from root to current activity
 * - REQ-6.1.3: All ancestors of current activity must be active
 */
describe("Active Path Validation", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("REQ-5.1.5: Active path from root to current activity", () => {
    it("should mark all ancestors as active when setting current activity", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster = new Activity("cluster1", "Cluster 1");
      const leaf = new Activity("leaf1", "Leaf 1");

      root.addChild(cluster);
      cluster.addChild(leaf);
      activityTree.root = root;

      // Set current activity to leaf
      activityTree.currentActivity = leaf;

      // All ancestors should be active
      expect(leaf.isActive).toBe(true);
      expect(cluster.isActive).toBe(true);
      expect(root.isActive).toBe(true);
    });

    it("should mark all ancestors as active through multiple levels", () => {
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

      activityTree.currentActivity = leaf;

      // All ancestors in the path should be active
      expect(leaf.isActive).toBe(true);
      expect(level3.isActive).toBe(true);
      expect(level2.isActive).toBe(true);
      expect(level1.isActive).toBe(true);
      expect(root.isActive).toBe(true);
    });

    it("should NOT mark siblings as active", () => {
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

      activityTree.currentActivity = leaf1;

      // leaf1 and its ancestors should be active
      expect(leaf1.isActive).toBe(true);
      expect(cluster1.isActive).toBe(true);
      expect(root.isActive).toBe(true);

      // Sibling cluster and its descendants should NOT be active
      expect(cluster2.isActive).toBe(false);
      expect(leaf2.isActive).toBe(false);
    });
  });

  describe("REQ-6.1.3: Clearing active path when changing current activity", () => {
    it("should deactivate previous path when current activity changes", () => {
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

      // First set current to leaf1
      activityTree.currentActivity = leaf1;
      expect(leaf1.isActive).toBe(true);
      expect(cluster1.isActive).toBe(true);

      // Now change to leaf2
      activityTree.currentActivity = leaf2;

      // Previous path should be deactivated
      expect(leaf1.isActive).toBe(false);
      expect(cluster1.isActive).toBe(false);

      // New path should be active
      expect(leaf2.isActive).toBe(true);
      expect(cluster2.isActive).toBe(true);
      expect(root.isActive).toBe(true); // Root stays active as common ancestor
    });

    it("should deactivate all activities when current activity is set to null", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root");
      const cluster = new Activity("cluster1", "Cluster 1");
      const leaf = new Activity("leaf1", "Leaf 1");

      root.addChild(cluster);
      cluster.addChild(leaf);
      activityTree.root = root;

      // Set current activity
      activityTree.currentActivity = leaf;
      expect(leaf.isActive).toBe(true);
      expect(cluster.isActive).toBe(true);
      expect(root.isActive).toBe(true);

      // Clear current activity
      activityTree.currentActivity = null;

      // All should be deactivated
      expect(leaf.isActive).toBe(false);
      expect(cluster.isActive).toBe(false);
      expect(root.isActive).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("should handle setting root as current activity", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root");
      activityTree.root = root;

      activityTree.currentActivity = root;

      expect(root.isActive).toBe(true);
    });

    it("should handle deep trees (10 levels)", () => {
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

      // Set deepest as current
      const deepest = activities[activities.length - 1];
      activityTree.currentActivity = deepest;

      // All should be active
      for (const activity of activities) {
        expect(activity.isActive).toBe(true);
      }

      // Clear
      activityTree.currentActivity = null;

      // All should be inactive
      for (const activity of activities) {
        expect(activity.isActive).toBe(false);
      }
    });

    it("should maintain currentActivity reference", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root");
      const leaf = new Activity("leaf", "Leaf");

      root.addChild(leaf);
      activityTree.root = root;

      activityTree.currentActivity = leaf;

      expect(activityTree.currentActivity).toBe(leaf);
    });

    it("should handle switching between siblings at same level", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root");
      const leaf1 = new Activity("leaf1", "Leaf 1");
      const leaf2 = new Activity("leaf2", "Leaf 2");
      const leaf3 = new Activity("leaf3", "Leaf 3");

      root.addChild(leaf1);
      root.addChild(leaf2);
      root.addChild(leaf3);
      activityTree.root = root;

      // Cycle through siblings
      activityTree.currentActivity = leaf1;
      expect(leaf1.isActive).toBe(true);
      expect(leaf2.isActive).toBe(false);
      expect(leaf3.isActive).toBe(false);

      activityTree.currentActivity = leaf2;
      expect(leaf1.isActive).toBe(false);
      expect(leaf2.isActive).toBe(true);
      expect(leaf3.isActive).toBe(false);

      activityTree.currentActivity = leaf3;
      expect(leaf1.isActive).toBe(false);
      expect(leaf2.isActive).toBe(false);
      expect(leaf3.isActive).toBe(true);

      // Root always active when any child is current
      expect(root.isActive).toBe(true);
    });
  });

  describe("Integration with navigation", () => {
    it("should properly track active state during forward navigation simulation", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root");
      const module = new Activity("module", "Module");
      const lesson1 = new Activity("lesson1", "Lesson 1");
      const lesson2 = new Activity("lesson2", "Lesson 2");

      root.addChild(module);
      module.addChild(lesson1);
      module.addChild(lesson2);
      activityTree.root = root;

      // Start at lesson1
      activityTree.currentActivity = lesson1;
      expect(lesson1.isActive).toBe(true);
      expect(module.isActive).toBe(true);
      expect(root.isActive).toBe(true);

      // Navigate to lesson2
      activityTree.currentActivity = lesson2;
      expect(lesson1.isActive).toBe(false);
      expect(lesson2.isActive).toBe(true);
      expect(module.isActive).toBe(true); // Still on active path
      expect(root.isActive).toBe(true); // Still on active path
    });

    it("should properly track active state during backward navigation simulation", () => {
      const activityTree = new ActivityTree();
      const root = new Activity("root", "Root");
      const module = new Activity("module", "Module");
      const lesson1 = new Activity("lesson1", "Lesson 1");
      const lesson2 = new Activity("lesson2", "Lesson 2");

      root.addChild(module);
      module.addChild(lesson1);
      module.addChild(lesson2);
      activityTree.root = root;

      // Start at lesson2
      activityTree.currentActivity = lesson2;
      expect(lesson2.isActive).toBe(true);

      // Navigate back to lesson1
      activityTree.currentActivity = lesson1;
      expect(lesson2.isActive).toBe(false);
      expect(lesson1.isActive).toBe(true);
    });
  });
});
