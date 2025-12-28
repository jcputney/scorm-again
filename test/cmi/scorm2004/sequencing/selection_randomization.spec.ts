import { beforeEach, describe, expect, it } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import {
  SelectionRandomization
} from "../../../../src/cmi/scorm2004/sequencing/selection_randomization";
import {
  RandomizationTiming,
  SelectionTiming
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_controls";

describe("SelectionRandomization", () => {
  let parentActivity: Activity;
  let child1: Activity;
  let child2: Activity;
  let child3: Activity;
  let child4: Activity;
  let child5: Activity;

  beforeEach(() => {
    // Create a parent activity with 5 children
    parentActivity = new Activity("parent", "Parent Activity");
    child1 = new Activity("child1", "Child 1");
    child2 = new Activity("child2", "Child 2");
    child3 = new Activity("child3", "Child 3");
    child4 = new Activity("child4", "Child 4");
    child5 = new Activity("child5", "Child 5");

    parentActivity.addChild(child1);
    parentActivity.addChild(child2);
    parentActivity.addChild(child3);
    parentActivity.addChild(child4);
    parentActivity.addChild(child5);
  });

  describe("selectChildrenProcess", () => {
    it("should return all children when selection timing is NEVER", () => {
      parentActivity.sequencingControls.selectionTiming = SelectionTiming.NEVER;
      parentActivity.sequencingControls.selectCount = 2;

      const selected = SelectionRandomization.selectChildrenProcess(parentActivity);

      expect(selected).toHaveLength(5);
      expect(selected).toEqual([child1, child2, child3, child4, child5]);
    });

    it("should return all children when selectCount is null", () => {
      parentActivity.sequencingControls.selectionTiming = SelectionTiming.ONCE;
      parentActivity.sequencingControls.selectCount = null;

      const selected = SelectionRandomization.selectChildrenProcess(parentActivity);

      expect(selected).toHaveLength(5);
      expect(selected).toEqual([child1, child2, child3, child4, child5]);
    });

    it("should return all children when selectCount >= children length", () => {
      parentActivity.sequencingControls.selectionTiming = SelectionTiming.ONCE;
      parentActivity.sequencingControls.selectCount = 10;

      const selected = SelectionRandomization.selectChildrenProcess(parentActivity);

      expect(selected).toHaveLength(5);
      expect(selected).toEqual([child1, child2, child3, child4, child5]);
    });

    it("should select correct number of children when selectCount < children length", () => {
      parentActivity.sequencingControls.selectionTiming = SelectionTiming.ONCE;
      parentActivity.sequencingControls.selectCount = 3;

      const selected = SelectionRandomization.selectChildrenProcess(parentActivity);

      expect(selected).toHaveLength(3);
      // Verify selected children are from the original set
      selected.forEach(child => {
        expect([child1, child2, child3, child4, child5]).toContain(child);
      });
    });

    it("should hide non-selected children from choice", () => {
      parentActivity.sequencingControls.selectionTiming = SelectionTiming.ONCE;
      parentActivity.sequencingControls.selectCount = 2;

      const selected = SelectionRandomization.selectChildrenProcess(parentActivity);

      let hiddenCount = 0;
      let availableCount = 0;

      [child1, child2, child3, child4, child5].forEach(child => {
        if (selected.includes(child)) {
          expect(child.isHiddenFromChoice).toBe(false);
          expect(child.isAvailable).toBe(true);
          availableCount++;
        } else {
          expect(child.isHiddenFromChoice).toBe(true);
          expect(child.isAvailable).toBe(false);
          hiddenCount++;
        }
      });

      expect(availableCount).toBe(2);
      expect(hiddenCount).toBe(3);
    });

    it("should mark selection as done when timing is ONCE", () => {
      parentActivity.sequencingControls.selectionTiming = SelectionTiming.ONCE;
      parentActivity.sequencingControls.selectCount = 3;
      parentActivity.sequencingControls.selectionCountStatus = false;

      SelectionRandomization.selectChildrenProcess(parentActivity);

      // After selection, status should be set to true
      expect(parentActivity.sequencingControls.selectionCountStatus).toBe(true);
    });

    it("should not re-select when timing is ONCE and already done", () => {
      parentActivity.sequencingControls.selectionTiming = SelectionTiming.ONCE;
      parentActivity.sequencingControls.selectCount = 2;
      parentActivity.sequencingControls.selectionCountStatus = true;

      // Mark some children as hidden (from previous selection)
      child3.isHiddenFromChoice = true;
      child3.isAvailable = false;
      child4.isHiddenFromChoice = true;
      child4.isAvailable = false;
      child5.isHiddenFromChoice = true;
      child5.isAvailable = false;

      const selected = SelectionRandomization.selectChildrenProcess(parentActivity);

      // Should return all children without changing their status
      expect(selected).toHaveLength(5);
      expect(child3.isHiddenFromChoice).toBe(true);
      expect(child4.isHiddenFromChoice).toBe(true);
      expect(child5.isHiddenFromChoice).toBe(true);
    });

    it("should not mark selection as done when timing is ON_EACH_NEW_ATTEMPT", () => {
      parentActivity.sequencingControls.selectionTiming = SelectionTiming.ON_EACH_NEW_ATTEMPT;
      parentActivity.sequencingControls.selectCount = 3;
      parentActivity.sequencingControls.selectionCountStatus = false;

      SelectionRandomization.selectChildrenProcess(parentActivity);

      expect(parentActivity.sequencingControls.selectionCountStatus).toBe(false);
    });
  });

  describe("randomizeChildrenProcess", () => {
    it("should return children in original order when randomization timing is NEVER", () => {
      parentActivity.sequencingControls.randomizationTiming = RandomizationTiming.NEVER;
      parentActivity.sequencingControls.randomizeChildren = true;

      const randomized = SelectionRandomization.randomizeChildrenProcess(parentActivity);

      expect(randomized).toEqual([child1, child2, child3, child4, child5]);
    });

    it("should return children in original order when randomizeChildren is false", () => {
      parentActivity.sequencingControls.randomizationTiming = RandomizationTiming.ONCE;
      parentActivity.sequencingControls.randomizeChildren = false;

      const randomized = SelectionRandomization.randomizeChildrenProcess(parentActivity);

      expect(randomized).toEqual([child1, child2, child3, child4, child5]);
    });

    it("should randomize children when conditions are met", () => {
      parentActivity.sequencingControls.randomizationTiming = RandomizationTiming.ONCE;
      parentActivity.sequencingControls.randomizeChildren = true;

      // Run randomization multiple times to verify it's actually random
      const results = new Set<string>();
      for (let i = 0; i < 10; i++) {
        // Reset for each iteration
        parentActivity.sequencingControls.reorderChildren = false;
        const randomized = SelectionRandomization.randomizeChildrenProcess(parentActivity);
        results.add(randomized.map(a => a.id).join(","));
      }

      // With 5 children, we should get different orders (very unlikely to get same order 10 times)
      expect(results.size).toBeGreaterThan(1);
    });

    it("should update the activity's children array", () => {
      parentActivity.sequencingControls.randomizationTiming = RandomizationTiming.ONCE;
      parentActivity.sequencingControls.randomizeChildren = true;

      const originalOrder = [...parentActivity.children];
      SelectionRandomization.randomizeChildrenProcess(parentActivity);

      // Children array should be updated
      expect(parentActivity.children).toHaveLength(5);
      // All original children should still be present
      originalOrder.forEach(child => {
        expect(parentActivity.children).toContain(child);
      });
    });

    it("should mark randomization as done when timing is ONCE", () => {
      parentActivity.sequencingControls.randomizationTiming = RandomizationTiming.ONCE;
      parentActivity.sequencingControls.randomizeChildren = true;
      parentActivity.sequencingControls.reorderChildren = false;

      SelectionRandomization.randomizeChildrenProcess(parentActivity);

      expect(parentActivity.sequencingControls.reorderChildren).toBe(true);
    });

    it("should not re-randomize when timing is ONCE and already done", () => {
      parentActivity.sequencingControls.randomizationTiming = RandomizationTiming.ONCE;
      parentActivity.sequencingControls.randomizeChildren = true;
      parentActivity.sequencingControls.reorderChildren = true;

      const originalOrder = [...parentActivity.children];
      const randomized = SelectionRandomization.randomizeChildrenProcess(parentActivity);

      expect(randomized).toEqual(originalOrder);
      expect(parentActivity.children).toEqual(originalOrder);
    });
  });

  describe("applySelectionAndRandomization", () => {
    it("should apply both selection and randomization", () => {
      parentActivity.sequencingControls.selectionTiming = SelectionTiming.ON_EACH_NEW_ATTEMPT;
      parentActivity.sequencingControls.selectCount = 3;
      parentActivity.sequencingControls.randomizationTiming = RandomizationTiming.ON_EACH_NEW_ATTEMPT;
      parentActivity.sequencingControls.randomizeChildren = true;

      const processed = SelectionRandomization.applySelectionAndRandomization(
        parentActivity,
        true
      );

      expect(processed).toHaveLength(3);
      // Verify hidden status
      let hiddenCount = 0;
      [child1, child2, child3, child4, child5].forEach(child => {
        if (child.isHiddenFromChoice) hiddenCount++;
      });
      expect(hiddenCount).toBe(2);
    });

    it("should apply selection/randomization and update status flags when isNewAttempt is true", () => {
      parentActivity.sequencingControls.selectionTiming = SelectionTiming.ON_EACH_NEW_ATTEMPT;
      parentActivity.sequencingControls.selectCount = 3;
      parentActivity.sequencingControls.selectionCountStatus = false; // Start disabled
      parentActivity.sequencingControls.randomizationTiming = RandomizationTiming.ON_EACH_NEW_ATTEMPT;
      parentActivity.sequencingControls.randomizeChildren = true;
      parentActivity.sequencingControls.reorderChildren = false;

      const processed = SelectionRandomization.applySelectionAndRandomization(parentActivity, true);

      // Should have selected 3 children
      expect(processed).toHaveLength(3);
      // For ON_EACH_NEW_ATTEMPT timing, selectionCountStatus should be enabled (true) after processing
      expect(parentActivity.sequencingControls.selectionCountStatus).toBe(true);
      // reorderChildren is not used for randomization tracking in the same way
    });

    it("should not apply when isNewAttempt is false and timing is ON_EACH_NEW_ATTEMPT", () => {
      parentActivity.sequencingControls.selectionTiming = SelectionTiming.ON_EACH_NEW_ATTEMPT;
      parentActivity.sequencingControls.selectCount = 3;
      parentActivity.sequencingControls.randomizationTiming = RandomizationTiming.ON_EACH_NEW_ATTEMPT;
      parentActivity.sequencingControls.randomizeChildren = true;

      const processed = SelectionRandomization.applySelectionAndRandomization(
        parentActivity,
        false
      );

      // Should return all children unchanged
      expect(processed).toHaveLength(5);
      expect(processed).toEqual([child1, child2, child3, child4, child5]);
    });
  });

  describe("isSelectionNeeded", () => {
    it("should return false when timing is NEVER", () => {
      parentActivity.sequencingControls.selectionTiming = SelectionTiming.NEVER;
      parentActivity.sequencingControls.selectCount = 3;

      expect(SelectionRandomization.isSelectionNeeded(parentActivity)).toBe(false);
    });

    it("should return false when timing is ONCE and already done", () => {
      parentActivity.sequencingControls.selectionTiming = SelectionTiming.ONCE;
      parentActivity.sequencingControls.selectCount = 3;
      parentActivity.sequencingControls.selectionCountStatus = true;

      expect(SelectionRandomization.isSelectionNeeded(parentActivity)).toBe(false);
    });

    it("should return false when selectCount is null", () => {
      parentActivity.sequencingControls.selectionTiming = SelectionTiming.ONCE;
      parentActivity.sequencingControls.selectCount = null;

      expect(SelectionRandomization.isSelectionNeeded(parentActivity)).toBe(false);
    });

    it("should return false when selectCount >= children length", () => {
      parentActivity.sequencingControls.selectionTiming = SelectionTiming.ONCE;
      parentActivity.sequencingControls.selectCount = 5;

      expect(SelectionRandomization.isSelectionNeeded(parentActivity)).toBe(false);
    });

    it("should return true when selection is needed", () => {
      parentActivity.sequencingControls.selectionTiming = SelectionTiming.ONCE;
      parentActivity.sequencingControls.selectCount = 3;
      parentActivity.sequencingControls.selectionCountStatus = false;

      expect(SelectionRandomization.isSelectionNeeded(parentActivity)).toBe(true);
    });
  });

  describe("isRandomizationNeeded", () => {
    it("should return false when timing is NEVER", () => {
      parentActivity.sequencingControls.randomizationTiming = RandomizationTiming.NEVER;
      parentActivity.sequencingControls.randomizeChildren = true;

      expect(SelectionRandomization.isRandomizationNeeded(parentActivity)).toBe(false);
    });

    it("should return false when timing is ONCE and already done", () => {
      parentActivity.sequencingControls.randomizationTiming = RandomizationTiming.ONCE;
      parentActivity.sequencingControls.randomizeChildren = true;
      parentActivity.sequencingControls.reorderChildren = true;

      expect(SelectionRandomization.isRandomizationNeeded(parentActivity)).toBe(false);
    });

    it("should return false when randomizeChildren is false", () => {
      parentActivity.sequencingControls.randomizationTiming = RandomizationTiming.ONCE;
      parentActivity.sequencingControls.randomizeChildren = false;

      expect(SelectionRandomization.isRandomizationNeeded(parentActivity)).toBe(false);
    });

    it("should return true when randomization is needed", () => {
      parentActivity.sequencingControls.randomizationTiming = RandomizationTiming.ONCE;
      parentActivity.sequencingControls.randomizeChildren = true;
      parentActivity.sequencingControls.reorderChildren = false;

      expect(SelectionRandomization.isRandomizationNeeded(parentActivity)).toBe(true);
    });
  });

  describe("Activity State Validation", () => {
    it("should not apply selection to active activity when isNewAttempt is false", () => {
      parentActivity.isActive = true;
      parentActivity.sequencingControls.selectionTiming = SelectionTiming.ON_EACH_NEW_ATTEMPT;
      parentActivity.sequencingControls.selectCount = 2;
      parentActivity.sequencingControls.selectionCountStatus = true;

      const result = SelectionRandomization.applySelectionAndRandomization(parentActivity, false);

      // Should return all children unchanged (selection not applied)
      expect(result).toHaveLength(5);
      // All children should remain available
      expect(child1.isAvailable).toBe(true);
      expect(child2.isAvailable).toBe(true);
      expect(child3.isAvailable).toBe(true);
      expect(child4.isAvailable).toBe(true);
      expect(child5.isAvailable).toBe(true);
    });

    it("should not apply selection to suspended activity when isNewAttempt is false", () => {
      parentActivity.isSuspended = true;
      parentActivity.sequencingControls.selectionTiming = SelectionTiming.ON_EACH_NEW_ATTEMPT;
      parentActivity.sequencingControls.selectCount = 2;
      parentActivity.sequencingControls.selectionCountStatus = true;

      const result = SelectionRandomization.applySelectionAndRandomization(parentActivity, false);

      // Should return all children unchanged
      expect(result).toHaveLength(5);
      expect(child1.isAvailable).toBe(true);
      expect(child2.isAvailable).toBe(true);
      expect(child3.isAvailable).toBe(true);
      expect(child4.isAvailable).toBe(true);
      expect(child5.isAvailable).toBe(true);
    });

    it("should not apply randomization to active activity when isNewAttempt is false", () => {
      parentActivity.isActive = true;
      parentActivity.sequencingControls.randomizationTiming = RandomizationTiming.ON_EACH_NEW_ATTEMPT;
      parentActivity.sequencingControls.randomizeChildren = true;

      const originalOrder = parentActivity.children.map(c => c.id);
      SelectionRandomization.applySelectionAndRandomization(parentActivity, false);
      const newOrder = parentActivity.children.map(c => c.id);

      // Order should be unchanged
      expect(newOrder).toEqual(originalOrder);
    });

    it("should not apply randomization to suspended activity when isNewAttempt is false", () => {
      parentActivity.isSuspended = true;
      parentActivity.sequencingControls.randomizationTiming = RandomizationTiming.ON_EACH_NEW_ATTEMPT;
      parentActivity.sequencingControls.randomizeChildren = true;

      const originalOrder = parentActivity.children.map(c => c.id);
      SelectionRandomization.applySelectionAndRandomization(parentActivity, false);
      const newOrder = parentActivity.children.map(c => c.id);

      // Order should be unchanged
      expect(newOrder).toEqual(originalOrder);
    });
  });

  describe("Selection Count Status Enforcement", () => {
    it("should not apply selection when selectionCountStatus is false for ON_EACH_NEW_ATTEMPT timing", () => {
      parentActivity.sequencingControls.selectionTiming = SelectionTiming.ON_EACH_NEW_ATTEMPT;
      parentActivity.sequencingControls.selectCount = 2;
      parentActivity.sequencingControls.selectionCountStatus = false;

      const result = SelectionRandomization.selectChildrenProcess(parentActivity);

      // Should return all children (selection not applied)
      expect(result).toHaveLength(5);
      // All children should remain available
      expect(child1.isAvailable).toBe(true);
      expect(child2.isAvailable).toBe(true);
      expect(child3.isAvailable).toBe(true);
      expect(child4.isAvailable).toBe(true);
      expect(child5.isAvailable).toBe(true);
    });

    it("should apply selection when selectionCountStatus is true for ON_EACH_NEW_ATTEMPT timing", () => {
      parentActivity.sequencingControls.selectionTiming = SelectionTiming.ON_EACH_NEW_ATTEMPT;
      parentActivity.sequencingControls.selectCount = 2;
      parentActivity.sequencingControls.selectionCountStatus = true;

      const result = SelectionRandomization.selectChildrenProcess(parentActivity);

      // Should select only 2 children
      expect(result).toHaveLength(2);
    });
  });
});
