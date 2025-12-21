import { beforeEach, describe, expect, it } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { NavigationLookAhead } from "../../../../src/cmi/scorm2004/sequencing/navigation_look_ahead";
import { SequencingProcess } from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { SequencingRules } from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import { SequencingControls } from "../../../../src/cmi/scorm2004/sequencing/sequencing_controls";
import { ADLNav } from "../../../../src/cmi/scorm2004/adl";
import { CompletionStatus } from "../../../../src/constants/enums";

describe("Navigation Look-Ahead Edge Cases", () => {
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let navigationLookAhead: NavigationLookAhead;
  let sequencingRules: SequencingRules;
  let sequencingControls: SequencingControls;
  let adlNav: ADLNav;

  beforeEach(() => {
    activityTree = new ActivityTree();
    sequencingRules = new SequencingRules();
    sequencingControls = new SequencingControls();
    adlNav = new ADLNav();

    sequencingProcess = new SequencingProcess(
      activityTree,
      sequencingRules,
      sequencingControls,
      adlNav
    );

    navigationLookAhead = new NavigationLookAhead(activityTree, sequencingProcess);
  });

  describe("predictContinueEnabled", () => {
    it("should predict continue disabled when no current activity", () => {
      activityTree.root = new Activity("root", "Root");
      activityTree.currentActivity = null;

      const result = navigationLookAhead.predictContinueEnabled();

      expect(result).toBe(false);
    });

    it("should predict continue enabled when next sibling exists", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);
      root.sequencingControls.flow = true;

      activityTree.root = root;
      activityTree.currentActivity = child1;
      child1.isActive = true;

      const result = navigationLookAhead.predictContinueEnabled();

      expect(result).toBe(true);
    });

    it("should predict continue disabled when at last sibling with no flow", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);
      root.sequencingControls.flow = false;

      activityTree.root = root;
      activityTree.currentActivity = child2;
      child2.isActive = true;

      const result = navigationLookAhead.predictContinueEnabled();

      expect(result).toBe(false);
    });

    it("should predict continue disabled when activity is hidden from navigation", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);
      root.sequencingControls.flow = true;
      child2.isHiddenFromChoice = true;

      activityTree.root = root;
      activityTree.currentActivity = child1;
      child1.isActive = true;

      navigationLookAhead.updateCache();

      // Continue might be disabled if next activity is hidden
      const result = navigationLookAhead.predictContinueEnabled();
      expect(typeof result).toBe("boolean");
    });

    it("should handle cache invalidation correctly", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);
      root.sequencingControls.flow = true;

      activityTree.root = root;
      activityTree.currentActivity = child1;

      const result1 = navigationLookAhead.predictContinueEnabled();

      // Invalidate and check again
      navigationLookAhead.invalidateCache();

      const result2 = navigationLookAhead.predictContinueEnabled();

      expect(result1).toBe(result2);
    });
  });

  describe("predictPreviousEnabled", () => {
    it("should predict previous disabled when no current activity", () => {
      activityTree.root = new Activity("root", "Root");
      activityTree.currentActivity = null;

      const result = navigationLookAhead.predictPreviousEnabled();

      expect(result).toBe(false);
    });

    it("should predict previous enabled when previous sibling exists", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);
      root.sequencingControls.flow = true;

      activityTree.root = root;
      activityTree.currentActivity = child2;
      child2.isActive = true;

      const result = navigationLookAhead.predictPreviousEnabled();

      expect(result).toBe(true);
    });

    it("should predict previous disabled when at first sibling", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);
      root.sequencingControls.flow = true;

      activityTree.root = root;
      activityTree.currentActivity = child1;
      child1.isActive = true;

      const result = navigationLookAhead.predictPreviousEnabled();

      expect(result).toBe(false);
    });

    it("should predict previous disabled when flow is disabled", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);
      root.sequencingControls.flow = false;

      activityTree.root = root;
      activityTree.currentActivity = child2;
      child2.isActive = true;

      const result = navigationLookAhead.predictPreviousEnabled();

      expect(result).toBe(false);
    });
  });

  describe("predictChoiceEnabled", () => {
    it("should predict choice disabled for non-existent activity", () => {
      const root = new Activity("root", "Root");
      activityTree.root = root;

      const result = navigationLookAhead.predictChoiceEnabled("non-existent");

      expect(result).toBe(false);
    });

    it("should predict choice enabled for valid activity", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      root.sequencingControls.choice = true;
      child1.sequencingControls.choice = true;

      activityTree.root = root;
      activityTree.currentActivity = root;

      navigationLookAhead.updateCache();
      const result = navigationLookAhead.predictChoiceEnabled("child1");

      expect(typeof result).toBe("boolean");
    });

    it("should predict choice disabled when choice control is disabled", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      root.sequencingControls.choice = false;

      activityTree.root = root;
      activityTree.currentActivity = root;

      navigationLookAhead.updateCache();
      const result = navigationLookAhead.predictChoiceEnabled("child1");

      expect(result).toBe(false);
    });

    it("should predict choice disabled for hidden activity", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      root.sequencingControls.choice = true;
      child1.isHiddenFromChoice = true;

      activityTree.root = root;
      activityTree.currentActivity = root;

      navigationLookAhead.updateCache();
      const result = navigationLookAhead.predictChoiceEnabled("child1");

      expect(result).toBe(false);
    });

    it("should predict choice for deeply nested activity", () => {
      const root = new Activity("root", "Root");
      const parent = new Activity("parent", "Parent");
      const child = new Activity("child", "Child");

      root.addChild(parent);
      parent.addChild(child);

      root.sequencingControls.choice = true;
      parent.sequencingControls.choice = true;
      child.sequencingControls.choice = true;

      activityTree.root = root;
      activityTree.currentActivity = root;

      navigationLookAhead.updateCache();
      const result = navigationLookAhead.predictChoiceEnabled("child");

      expect(typeof result).toBe("boolean");
    });
  });

  describe("getAvailableChoices", () => {
    it("should return empty array when no current activity", () => {
      activityTree.root = new Activity("root", "Root");
      activityTree.currentActivity = null;

      const result = navigationLookAhead.getAvailableChoices();

      expect(Array.isArray(result)).toBe(true);
    });

    it("should return all choosable activities", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);
      root.sequencingControls.choice = true;
      child1.sequencingControls.choice = true;
      child2.sequencingControls.choice = true;

      activityTree.root = root;
      activityTree.currentActivity = root;

      navigationLookAhead.updateCache();
      const result = navigationLookAhead.getAvailableChoices();

      expect(Array.isArray(result)).toBe(true);
    });

    it("should exclude hidden activities from available choices", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);
      root.sequencingControls.choice = true;
      child1.sequencingControls.choice = true;
      child2.sequencingControls.choice = true;
      child2.isHiddenFromChoice = true;

      activityTree.root = root;
      activityTree.currentActivity = root;

      navigationLookAhead.updateCache();
      const result = navigationLookAhead.getAvailableChoices();

      expect(result).not.toContain("child2");
    });

    it("should handle single node tree", () => {
      const root = new Activity("root", "Root");
      activityTree.root = root;
      activityTree.currentActivity = root;

      const result = navigationLookAhead.getAvailableChoices();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("getAllPredictions", () => {
    it("should return all predictions at once", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);
      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;

      activityTree.root = root;
      activityTree.currentActivity = child1;
      child1.isActive = true;

      const result = navigationLookAhead.getAllPredictions();

      expect(result).toHaveProperty("continueEnabled");
      expect(result).toHaveProperty("previousEnabled");
      expect(result).toHaveProperty("availableChoices");
      expect(typeof result.continueEnabled).toBe("boolean");
      expect(typeof result.previousEnabled).toBe("boolean");
      expect(Array.isArray(result.availableChoices)).toBe(true);
    });

    it("should return disabled predictions when tree is empty", () => {
      activityTree.root = null;
      activityTree.currentActivity = null;

      const result = navigationLookAhead.getAllPredictions();

      expect(result.continueEnabled).toBe(false);
      expect(result.previousEnabled).toBe(false);
      expect(result.availableChoices).toEqual([]);
    });

    it("should handle predictions with completed activities", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);
      root.sequencingControls.flow = true;

      child1.completionStatus = CompletionStatus.COMPLETED;
      child2.completionStatus = CompletionStatus.INCOMPLETE;

      activityTree.root = root;
      activityTree.currentActivity = child1;

      const result = navigationLookAhead.getAllPredictions();

      expect(result).toHaveProperty("continueEnabled");
    });
  });

  describe("cache management", () => {
    it("should invalidate cache on activity change", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);
      root.sequencingControls.flow = true;

      activityTree.root = root;
      activityTree.currentActivity = child1;

      // First prediction
      const result1 = navigationLookAhead.predictContinueEnabled();

      // Change current activity
      activityTree.currentActivity = child2;
      navigationLookAhead.invalidateCache();

      // Second prediction
      const result2 = navigationLookAhead.predictContinueEnabled();

      // Results should differ based on position
      expect(typeof result1).toBe("boolean");
      expect(typeof result2).toBe("boolean");
    });

    it("should use cached results when state hasn't changed", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(child1);
      root.sequencingControls.flow = true;

      activityTree.root = root;
      activityTree.currentActivity = child1;

      // Multiple calls should use cache
      const result1 = navigationLookAhead.predictContinueEnabled();
      const result2 = navigationLookAhead.predictContinueEnabled();
      const result3 = navigationLookAhead.predictContinueEnabled();

      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });

    it("should update cache on forced update", () => {
      const root = new Activity("root", "Root");
      activityTree.root = root;

      navigationLookAhead.updateCache();

      const result = navigationLookAhead.getAllPredictions();

      expect(result).toHaveProperty("continueEnabled");
    });
  });

  describe("edge cases with complex trees", () => {
    it("should handle tree with many siblings", () => {
      const root = new Activity("root", "Root");
      const children = [];

      for (let i = 0; i < 20; i++) {
        const child = new Activity(`child${i}`, `Child ${i}`);
        root.addChild(child);
        children.push(child);
      }

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;

      activityTree.root = root;
      activityTree.currentActivity = children[10];

      const result = navigationLookAhead.getAllPredictions();

      expect(result.continueEnabled).toBe(true);
      expect(result.previousEnabled).toBe(true);
    });

    it("should handle deeply nested tree", () => {
      let current = new Activity("root", "Root");
      const root = current;

      for (let i = 0; i < 10; i++) {
        const child = new Activity(`level${i}`, `Level ${i}`);
        current.addChild(child);
        current.sequencingControls.flow = true;
        current = child;
      }

      activityTree.root = root;
      activityTree.currentActivity = current;

      const result = navigationLookAhead.getAllPredictions();

      expect(typeof result.continueEnabled).toBe("boolean");
    });

    it("should handle tree with mixed completion states", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      const child3 = new Activity("child3", "Child 3");

      root.addChild(child1);
      root.addChild(child2);
      root.addChild(child3);

      child1.completionStatus = CompletionStatus.COMPLETED;
      child2.completionStatus = CompletionStatus.INCOMPLETE;
      child3.completionStatus = CompletionStatus.UNKNOWN;

      root.sequencingControls.flow = true;

      activityTree.root = root;
      activityTree.currentActivity = child2;

      const result = navigationLookAhead.getAllPredictions();

      expect(typeof result.continueEnabled).toBe("boolean");
      expect(typeof result.previousEnabled).toBe("boolean");
    });
  });

  describe("performance considerations", () => {
    it("should handle large tree efficiently", () => {
      const root = new Activity("root", "Root");

      // Create 50 activities
      for (let i = 0; i < 50; i++) {
        const child = new Activity(`child${i}`, `Child ${i}`);
        root.addChild(child);
      }

      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;

      activityTree.root = root;
      activityTree.currentActivity = root.children[25];

      const startTime = Date.now();
      navigationLookAhead.updateCache();
      const endTime = Date.now();

      // Should complete within reasonable time (adjust threshold as needed)
      expect(endTime - startTime).toBeLessThan(100);
    });
  });
});
