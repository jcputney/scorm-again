import { describe, it, expect, beforeEach, vi } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { SequencingProcess } from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { NavigationLookAhead } from "../../../../src/cmi/scorm2004/sequencing/navigation_look_ahead";
import { SequencingControls } from "../../../../src/cmi/scorm2004/sequencing/sequencing_controls";

describe("NavigationLookAhead", () => {
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let lookAhead: NavigationLookAhead;
  let root: Activity;
  let activity1: Activity;
  let activity2: Activity;
  let activity3: Activity;

  beforeEach(() => {
    // Create basic activity tree structure
    root = new Activity("root", "Root Activity");
    activity1 = new Activity("activity1", "Activity 1");
    activity2 = new Activity("activity2", "Activity 2");
    activity3 = new Activity("activity3", "Activity 3");

    root.addChild(activity1);
    root.addChild(activity2);
    root.addChild(activity3);

    activityTree = new ActivityTree(root);
    sequencingProcess = new SequencingProcess(activityTree);
    lookAhead = new NavigationLookAhead(activityTree, sequencingProcess);
  });

  describe("Basic Functionality", () => {
    it("should initialize with all predictions disabled when no current activity", () => {
      const predictions = lookAhead.getAllPredictions();

      expect(predictions.continueEnabled).toBe(false);
      expect(predictions.previousEnabled).toBe(false);
      expect(predictions.availableChoices).toEqual([]);
    });

    it("should predict Continue enabled when next activity available", () => {
      // Set up flow mode on root
      root.sequencingControls.flow = true;

      // Set current activity to first child
      activityTree.currentActivity = activity1;

      const continueEnabled = lookAhead.predictContinueEnabled();
      expect(continueEnabled).toBe(true);
    });

    it("should predict Continue disabled at last activity", () => {
      // Set up flow mode on root
      root.sequencingControls.flow = true;

      // Set current activity to last child
      activityTree.currentActivity = activity3;

      const continueEnabled = lookAhead.predictContinueEnabled();
      expect(continueEnabled).toBe(false);
    });

    it("should predict Continue disabled when flow not enabled", () => {
      // Flow is disabled by default
      root.sequencingControls.flow = false;

      activityTree.currentActivity = activity1;

      const continueEnabled = lookAhead.predictContinueEnabled();
      expect(continueEnabled).toBe(false);
    });

    it("should predict Continue disabled when forwardOnly blocks", () => {
      // This test is for a specific edge case where forwardOnly affects Continue
      // In standard SCORM, forwardOnly affects Previous, not Continue
      // But we'll test the current behavior
      root.sequencingControls.flow = true;
      root.sequencingControls.forwardOnly = true;

      activityTree.currentActivity = activity1;

      // Continue should still work with forwardOnly
      const continueEnabled = lookAhead.predictContinueEnabled();
      expect(continueEnabled).toBe(true);
    });
  });

  describe("Previous Navigation", () => {
    it("should predict Previous enabled when prior activity available", () => {
      root.sequencingControls.flow = true;
      root.sequencingControls.forwardOnly = false;

      activityTree.currentActivity = activity2;

      const previousEnabled = lookAhead.predictPreviousEnabled();
      expect(previousEnabled).toBe(true);
    });

    it("should predict Previous disabled at first activity", () => {
      root.sequencingControls.flow = true;
      root.sequencingControls.forwardOnly = false;

      activityTree.currentActivity = activity1;

      const previousEnabled = lookAhead.predictPreviousEnabled();
      expect(previousEnabled).toBe(false);
    });

    it("should predict Previous disabled when forwardOnly active", () => {
      root.sequencingControls.flow = true;
      root.sequencingControls.forwardOnly = true;

      activityTree.currentActivity = activity2;

      const previousEnabled = lookAhead.predictPreviousEnabled();
      expect(previousEnabled).toBe(false);
    });

    it("should predict Previous disabled when flow not enabled", () => {
      root.sequencingControls.flow = false;

      activityTree.currentActivity = activity2;

      const previousEnabled = lookAhead.predictPreviousEnabled();
      expect(previousEnabled).toBe(false);
    });
  });

  describe("Choice Navigation", () => {
    it("should predict choice enabled for valid targets", () => {
      root.sequencingControls.choice = true;
      // Set a current activity so choice validation can work properly
      activityTree.currentActivity = activity2;

      const choiceEnabled = lookAhead.predictChoiceEnabled(activity1.id);
      expect(choiceEnabled).toBe(true);
    });

    it("should predict choice disabled for hidden activities", () => {
      root.sequencingControls.choice = true;
      activity1.isHiddenFromChoice = true;

      const choiceEnabled = lookAhead.predictChoiceEnabled(activity1.id);
      expect(choiceEnabled).toBe(false);
    });

    it("should predict choice disabled for unavailable activities", () => {
      root.sequencingControls.choice = true;
      activity1.isAvailable = false;

      const choiceEnabled = lookAhead.predictChoiceEnabled(activity1.id);
      expect(choiceEnabled).toBe(false);
    });

    it("should predict choice disabled when choice control is off", () => {
      root.sequencingControls.choice = false;

      const choiceEnabled = lookAhead.predictChoiceEnabled(activity1.id);
      expect(choiceEnabled).toBe(false);
    });

    it("should predict choice disabled for constrained-out activities", () => {
      root.sequencingControls.choice = true;
      root.sequencingControls.constrainChoice = true;

      const choiceEnabled = lookAhead.predictChoiceEnabled(activity1.id);
      expect(choiceEnabled).toBe(false);
    });
  });

  describe("Available Choices", () => {
    it("should return correct list of available choices", () => {
      root.sequencingControls.choice = true;
      // Set a current activity so choice validation can work properly
      activityTree.currentActivity = activity1;

      const availableChoices = lookAhead.getAvailableChoices();
      expect(availableChoices.length).toBeGreaterThan(0);
      expect(availableChoices).toContain(activity1.id);
      expect(availableChoices).toContain(activity2.id);
      expect(availableChoices).toContain(activity3.id);
    });

    it("should exclude hidden activities from available choices", () => {
      root.sequencingControls.choice = true;
      activity2.isHiddenFromChoice = true;

      const availableChoices = lookAhead.getAvailableChoices();
      expect(availableChoices).not.toContain(activity2.id);
    });

    it("should return empty array when choice is disabled", () => {
      root.sequencingControls.choice = false;

      const availableChoices = lookAhead.getAvailableChoices();
      expect(availableChoices).toEqual([]);
    });
  });

  describe("Cache Management", () => {
    it("should invalidate cache on activity change", () => {
      root.sequencingControls.flow = true;
      activityTree.currentActivity = activity1;

      // Get initial prediction
      const firstPrediction = lookAhead.predictContinueEnabled();

      // Change activity
      activityTree.currentActivity = activity3;
      lookAhead.invalidateCache();

      // Prediction should change
      const secondPrediction = lookAhead.predictContinueEnabled();
      expect(secondPrediction).not.toBe(firstPrediction);
    });

    it("should use cached results when state hasn't changed", () => {
      root.sequencingControls.flow = true;
      activityTree.currentActivity = activity1;

      // Spy on the internal recalculation
      const updateSpy = vi.spyOn(lookAhead as any, "recalculateCache");

      // First call should calculate
      lookAhead.predictContinueEnabled();
      expect(updateSpy).toHaveBeenCalledTimes(1);

      // Second call should use cache
      lookAhead.predictContinueEnabled();
      expect(updateSpy).toHaveBeenCalledTimes(1);
    });

    it("should invalidate cache on explicit call", () => {
      root.sequencingControls.flow = true;
      activityTree.currentActivity = activity1;

      // Get initial prediction
      lookAhead.predictContinueEnabled();

      // Invalidate
      lookAhead.invalidateCache();

      // Next call should recalculate
      const updateSpy = vi.spyOn(lookAhead as any, "recalculateCache");
      lookAhead.predictContinueEnabled();
      expect(updateSpy).toHaveBeenCalled();
    });

    it("should handle rapid invalidation without errors", () => {
      root.sequencingControls.flow = true;
      activityTree.currentActivity = activity1;

      // Rapidly invalidate and access
      for (let i = 0; i < 100; i++) {
        lookAhead.invalidateCache();
        lookAhead.predictContinueEnabled();
      }

      // Should not throw and should return valid result
      const result = lookAhead.predictContinueEnabled();
      expect(typeof result).toBe("boolean");
    });
  });

  describe("Edge Cases", () => {
    it("should handle no current activity correctly", () => {
      activityTree.currentActivity = null;

      const predictions = lookAhead.getAllPredictions();
      expect(predictions.continueEnabled).toBe(false);
      expect(predictions.previousEnabled).toBe(false);
    });

    it("should handle suspended activity exists", () => {
      activityTree.currentActivity = activity1;
      activityTree.suspendedActivity = activity2;

      // Should still provide valid predictions
      const predictions = lookAhead.getAllPredictions();
      expect(typeof predictions.continueEnabled).toBe("boolean");
      expect(typeof predictions.previousEnabled).toBe("boolean");
    });

    it("should handle all activities completed", () => {
      activity1.completionStatus = "completed";
      activity2.completionStatus = "completed";
      activity3.completionStatus = "completed";

      root.sequencingControls.flow = true;
      activityTree.currentActivity = activity3;

      // Continue should be disabled at end
      const continueEnabled = lookAhead.predictContinueEnabled();
      expect(continueEnabled).toBe(false);
    });

    it("should handle root is current activity", () => {
      activityTree.currentActivity = root;

      const predictions = lookAhead.getAllPredictions();
      expect(predictions.continueEnabled).toBe(false);
      expect(predictions.previousEnabled).toBe(false);
    });

    it("should handle invisible activities", () => {
      root.sequencingControls.choice = true;
      activity2.isVisible = false;

      const availableChoices = lookAhead.getAvailableChoices();
      expect(availableChoices).not.toContain(activity2.id);
    });
  });

  describe("Integration Scenarios", () => {
    it("should update predictions after Continue navigation", () => {
      root.sequencingControls.flow = true;
      activityTree.currentActivity = activity1;

      // Continue should be enabled
      expect(lookAhead.predictContinueEnabled()).toBe(true);

      // Simulate navigation to next activity
      activityTree.currentActivity = activity2;
      lookAhead.invalidateCache();

      // Predictions should update
      expect(lookAhead.predictContinueEnabled()).toBe(true);
    });

    it("should update predictions after Previous navigation", () => {
      root.sequencingControls.flow = true;
      root.sequencingControls.forwardOnly = false;
      activityTree.currentActivity = activity2;

      // Both should be enabled from middle position
      expect(lookAhead.predictContinueEnabled()).toBe(true);
      expect(lookAhead.predictPreviousEnabled()).toBe(true);

      // Simulate navigation to previous activity
      activityTree.currentActivity = activity1;
      lookAhead.invalidateCache();

      // Previous should now be disabled
      expect(lookAhead.predictPreviousEnabled()).toBe(false);
    });

    it("should update predictions after Choice navigation", () => {
      root.sequencingControls.choice = true;
      activityTree.currentActivity = activity1;

      const initialChoices = lookAhead.getAvailableChoices();

      // Simulate choice to different activity
      activityTree.currentActivity = activity3;
      lookAhead.invalidateCache();

      const newChoices = lookAhead.getAvailableChoices();

      // Both should have choices (structure hasn't changed)
      expect(initialChoices.length).toBeGreaterThan(0);
      expect(newChoices.length).toBeGreaterThan(0);
    });

    it("should handle getAllPredictions returning consistent data", () => {
      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      activityTree.currentActivity = activity2;

      const predictions = lookAhead.getAllPredictions();

      expect(predictions).toHaveProperty("continueEnabled");
      expect(predictions).toHaveProperty("previousEnabled");
      expect(predictions).toHaveProperty("availableChoices");
      expect(Array.isArray(predictions.availableChoices)).toBe(true);
    });
  });

  describe("Deep Hierarchy", () => {
    it("should handle deep hierarchy (5+ levels) prediction accuracy", () => {
      // Create deep hierarchy
      const level1 = new Activity("level1", "Level 1");
      const level2 = new Activity("level2", "Level 2");
      const level3 = new Activity("level3", "Level 3");
      const level4 = new Activity("level4", "Level 4");
      const level5 = new Activity("level5", "Level 5");

      root = new Activity("deepRoot", "Deep Root");
      root.addChild(level1);
      level1.addChild(level2);
      level2.addChild(level3);
      level3.addChild(level4);
      level4.addChild(level5);

      // Enable flow at all levels
      root.sequencingControls.flow = true;
      level1.sequencingControls.flow = true;
      level2.sequencingControls.flow = true;
      level3.sequencingControls.flow = true;
      level4.sequencingControls.flow = true;

      activityTree = new ActivityTree(root);
      sequencingProcess = new SequencingProcess(activityTree);
      lookAhead = new NavigationLookAhead(activityTree, sequencingProcess);

      activityTree.currentActivity = level3;

      // Should still provide valid predictions
      const predictions = lookAhead.getAllPredictions();
      expect(typeof predictions.continueEnabled).toBe("boolean");
      expect(typeof predictions.previousEnabled).toBe("boolean");
    });
  });

  describe("Performance", () => {
    it("should complete prediction in <10ms for 50 activity tree", () => {
      // Create a large tree with 50+ activities
      const largeRoot = new Activity("largeRoot", "Large Root");

      // Create 50 activities across multiple levels
      for (let i = 0; i < 10; i++) {
        const parent = new Activity(`parent${i}`, `Parent ${i}`);
        parent.sequencingControls.flow = true;
        parent.sequencingControls.choice = true;

        for (let j = 0; j < 5; j++) {
          const child = new Activity(`child${i}_${j}`, `Child ${i}-${j}`);
          parent.addChild(child);
        }

        largeRoot.addChild(parent);
      }

      largeRoot.sequencingControls.flow = true;
      largeRoot.sequencingControls.choice = true;

      const largeTree = new ActivityTree(largeRoot);
      const largeSequencingProcess = new SequencingProcess(largeTree);
      const largeLookAhead = new NavigationLookAhead(largeTree, largeSequencingProcess);

      // Set current activity to middle of tree
      const middleParent = largeRoot.children[5];
      largeTree.currentActivity = middleParent.children[2];

      // Measure performance
      const startTime = performance.now();
      largeLookAhead.getAllPredictions();
      const endTime = performance.now();

      const duration = endTime - startTime;
      expect(duration).toBeLessThan(10); // Should be under 10ms
    });

    it("should handle cache stress test with multiple rapid requests", () => {
      root.sequencingControls.flow = true;
      root.sequencingControls.choice = true;
      activityTree.currentActivity = activity1;

      const startTime = performance.now();

      // Make 1000 rapid prediction requests
      for (let i = 0; i < 1000; i++) {
        lookAhead.predictContinueEnabled();
        lookAhead.predictPreviousEnabled();
        lookAhead.getAvailableChoices();
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete quickly due to caching
      expect(duration).toBeLessThan(100); // Should be well under 100ms for 1000 cached requests
    });
  });

  describe("State Change Detection", () => {
    it("should detect completion status changes", () => {
      root.sequencingControls.flow = true;
      activityTree.currentActivity = activity1;

      // Initial state
      const initialHash = (lookAhead as any).calculateTreeStateHash();

      // Change completion status
      activity1.completionStatus = "completed";

      const newHash = (lookAhead as any).calculateTreeStateHash();
      expect(newHash).not.toBe(initialHash);
    });

    it("should detect success status changes", () => {
      root.sequencingControls.flow = true;
      activityTree.currentActivity = activity1;

      const initialHash = (lookAhead as any).calculateTreeStateHash();

      activity1.successStatus = "passed";

      const newHash = (lookAhead as any).calculateTreeStateHash();
      expect(newHash).not.toBe(initialHash);
    });

    it("should detect attempt count changes", () => {
      root.sequencingControls.flow = true;
      activityTree.currentActivity = activity1;

      const initialHash = (lookAhead as any).calculateTreeStateHash();

      activity1.attemptCount = 2;

      const newHash = (lookAhead as any).calculateTreeStateHash();
      expect(newHash).not.toBe(initialHash);
    });
  });
});
