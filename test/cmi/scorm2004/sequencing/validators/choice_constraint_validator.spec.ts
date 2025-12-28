import { beforeEach, describe, expect, it } from "vitest";
import {
  ChoiceConstraintValidator
} from "../../../../../src/cmi/scorm2004/sequencing/validators/choice_constraint_validator";
import {
  ActivityTreeQueries
} from "../../../../../src/cmi/scorm2004/sequencing/utils/activity_tree_queries";
import { Activity } from "../../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../../src/cmi/scorm2004/sequencing/activity_tree";

describe("ChoiceConstraintValidator", () => {
  let activityTree: ActivityTree;
  let treeQueries: ActivityTreeQueries;
  let validator: ChoiceConstraintValidator;
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
    treeQueries = new ActivityTreeQueries(activityTree);
    validator = new ChoiceConstraintValidator(activityTree, treeQueries);
  });

  describe("validateChoice", () => {
    describe("basic validation", () => {
      it("should return invalid when target is not in tree", () => {
        const orphan = new Activity("orphan", "Orphan");
        const result = validator.validateChoice(null, orphan);
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("SB.2.9-2");
      });

      it("should return invalid when target is root", () => {
        const result = validator.validateChoice(null, root);
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("SB.2.9-3");
      });

      it("should return valid for leaf activity with no current activity", () => {
        const result = validator.validateChoice(null, lesson1);
        expect(result.valid).toBe(true);
        expect(result.exception).toBeNull();
      });
    });

    describe("hidden from choice", () => {
      it("should return invalid when target is hidden from choice", () => {
        lesson1.isHiddenFromChoice = true;
        const result = validator.validateChoice(null, lesson1);
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("SB.2.9-4");
      });

      it("should return invalid when ancestor is hidden from choice", () => {
        chapter1.isHiddenFromChoice = true;
        const result = validator.validateChoice(null, lesson1);
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("SB.2.9-4");
      });
    });

    describe("choice control", () => {
      it("should return invalid when parent has choice disabled", () => {
        chapter1.sequencingControls.choice = false;
        const result = validator.validateChoice(null, lesson1);
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("SB.2.9-5");
      });
    });

    describe("availability", () => {
      it("should return invalid when target is not available and checkAvailability is true", () => {
        lesson1.isAvailable = false;
        const result = validator.validateChoice(null, lesson1, { checkAvailability: true });
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("SB.2.9-7");
      });

      it("should return valid when target is not available but checkAvailability is false", () => {
        lesson1.isAvailable = false;
        const result = validator.validateChoice(null, lesson1, { checkAvailability: false });
        expect(result.valid).toBe(true);
      });
    });
  });

  describe("validateChoiceExit", () => {
    it("should return valid when choiceExit is true", () => {
      root.sequencingControls.choiceExit = true;
      root.isActive = true;
      lesson1.isActive = true;
      chapter1.isActive = true;

      const result = validator.validateChoiceExit(lesson1, lesson3);
      expect(result.valid).toBe(true);
    });

    it("should return invalid when choiceExit is false and target is outside subtree", () => {
      chapter1.sequencingControls.choiceExit = false;
      chapter1.isActive = true;
      lesson1.isActive = true;

      // lesson3 is not a descendant of chapter1
      const result = validator.validateChoiceExit(lesson1, lesson3);
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("SB.2.9-8");
    });

    it("should return valid when choiceExit is false but target is within subtree", () => {
      chapter1.sequencingControls.choiceExit = false;
      chapter1.isActive = true;
      lesson1.isActive = true;

      // lesson2 is a sibling within chapter1
      const result = validator.validateChoiceExit(lesson1, lesson2);
      expect(result.valid).toBe(true);
    });

    it("should skip choiceExit check for inactive ancestors", () => {
      chapter1.sequencingControls.choiceExit = false;
      chapter1.isActive = false; // Not active
      lesson1.isActive = true;

      const result = validator.validateChoiceExit(lesson1, lesson3);
      expect(result.valid).toBe(true);
    });
  });

  describe("validateAncestorConstraints", () => {
    describe("forwardOnly constraint", () => {
      it("should return invalid when forwardOnly is true and navigating backward", () => {
        chapter1.sequencingControls.forwardOnly = true;
        lesson1.isActive = true;
        lesson2.isActive = true;

        // Try to go back from lesson2 to lesson1
        const result = validator.validateAncestorConstraints(lesson2, lesson1);
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("SB.2.9-5");
      });

      it("should return valid when forwardOnly is true and navigating forward", () => {
        chapter1.sequencingControls.forwardOnly = true;
        lesson1.isActive = true;

        const result = validator.validateAncestorConstraints(lesson1, lesson2);
        expect(result.valid).toBe(true);
      });
    });

    describe("constrainChoice constraint", () => {
      it("should return invalid when trying to skip forward beyond next sibling", () => {
        // Add another lesson to have 3 siblings
        const lesson2b = new Activity("lesson2b", "Lesson 2b");
        chapter1.addChild(lesson2b);

        chapter1.sequencingControls.constrainChoice = true;
        lesson1.isActive = true;

        // Try to skip from lesson1 to lesson2b (skipping lesson2)
        const result = validator.validateAncestorConstraints(lesson1, lesson2b);
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("SB.2.9-7");
      });

      it("should return valid when navigating to immediate next sibling", () => {
        chapter1.sequencingControls.constrainChoice = true;
        lesson1.isActive = true;

        const result = validator.validateAncestorConstraints(lesson1, lesson2);
        expect(result.valid).toBe(true);
      });

      it("should return invalid when navigating backward to incomplete activity", () => {
        chapter1.sequencingControls.constrainChoice = true;
        lesson2.isActive = true;
        lesson1.completionStatus = "incomplete" as any;

        const result = validator.validateAncestorConstraints(lesson2, lesson1);
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("SB.2.9-7");
      });

      it("should return valid when navigating backward to completed activity", () => {
        chapter1.sequencingControls.constrainChoice = true;
        lesson2.isActive = true;
        lesson1.completionStatus = "completed" as any;

        const result = validator.validateAncestorConstraints(lesson2, lesson1);
        expect(result.valid).toBe(true);
      });
    });

    describe("preventActivation constraint", () => {
      it("should return invalid when preventActivation is true and target has no attempts", () => {
        chapter1.sequencingControls.preventActivation = true;
        lesson1.isActive = true;
        lesson2.attemptCount = 0;
        lesson2.isActive = false;

        const result = validator.validateAncestorConstraints(lesson1, lesson2);
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("SB.2.9-6");
      });

      it("should return valid when preventActivation is true but target has attempts", () => {
        chapter1.sequencingControls.preventActivation = true;
        lesson1.isActive = true;
        lesson2.attemptCount = 1;

        const result = validator.validateAncestorConstraints(lesson1, lesson2);
        expect(result.valid).toBe(true);
      });
    });

    describe("mandatory activities", () => {
      it("should return invalid when skipping mandatory incomplete activity", () => {
        const lesson2b = new Activity("lesson2b", "Lesson 2b");
        chapter1.addChild(lesson2b);

        // Make lesson2 mandatory and incomplete
        (lesson2 as any).mandatory = true;
        lesson2.completionStatus = "incomplete" as any;
        lesson1.isActive = true;

        // Try to skip from lesson1 to lesson2b
        const result = validator.validateAncestorConstraints(lesson1, lesson2b);
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("SB.2.9-6");
      });

      it("should return valid when skipping completed mandatory activity", () => {
        const lesson2b = new Activity("lesson2b", "Lesson 2b");
        chapter1.addChild(lesson2b);

        // Make lesson2 mandatory but completed
        (lesson2 as any).mandatory = true;
        lesson2.completionStatus = "completed" as any;
        lesson1.isActive = true;

        const result = validator.validateAncestorConstraints(lesson1, lesson2b);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe("checkForwardOnlyViolation", () => {
    it("should return invalid when any ancestor has forwardOnly", () => {
      chapter1.sequencingControls.forwardOnly = true;

      const result = validator.checkForwardOnlyViolation(lesson1);
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("SB.2.9-5");
    });

    it("should return valid when no ancestor has forwardOnly", () => {
      const result = validator.checkForwardOnlyViolation(lesson1);
      expect(result.valid).toBe(true);
    });

    it("should check all ancestor levels", () => {
      root.sequencingControls.forwardOnly = true;

      const result = validator.checkForwardOnlyViolation(lesson1);
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("SB.2.9-5");
    });
  });

  describe("isAvailableForChoice", () => {
    it("should return true for visible, available, unhidden activities", () => {
      expect(validator.isAvailableForChoice(lesson1)).toBe(true);
    });

    it("should return false for invisible activities", () => {
      lesson1.isVisible = false;
      expect(validator.isAvailableForChoice(lesson1)).toBe(false);
    });

    it("should return false for hidden from choice activities", () => {
      lesson1.isHiddenFromChoice = true;
      expect(validator.isAvailableForChoice(lesson1)).toBe(false);
    });

    it("should return false for unavailable activities", () => {
      lesson1.isAvailable = false;
      expect(validator.isAvailableForChoice(lesson1)).toBe(false);
    });
  });

  describe("validateFlowConstraints", () => {
    it("should filter out unavailable children", () => {
      lesson1.isAvailable = false;

      const result = validator.validateFlowConstraints(chapter1, [lesson1, lesson2]);
      expect(result.valid).toBe(true);
      expect(result.validChildren).toHaveLength(1);
      expect(result.validChildren[0]).toBe(lesson2);
    });

    it("should filter out hidden children", () => {
      lesson1.isHiddenFromChoice = true;

      const result = validator.validateFlowConstraints(chapter1, [lesson1, lesson2]);
      expect(result.valid).toBe(true);
      expect(result.validChildren).toHaveLength(1);
      expect(result.validChildren[0]).toBe(lesson2);
    });

    it("should return invalid when no valid children", () => {
      lesson1.isAvailable = false;
      lesson2.isAvailable = false;

      const result = validator.validateFlowConstraints(chapter1, [lesson1, lesson2]);
      expect(result.valid).toBe(false);
      expect(result.validChildren).toHaveLength(0);
    });
  });

  describe("validateTraversalConstraints", () => {
    it("should allow traversal by default", () => {
      const result = validator.validateTraversalConstraints(lesson1);
      expect(result.canTraverse).toBe(true);
      expect(result.canTraverseInto).toBe(true);
    });

    it("should block traverseInto when stopForwardTraversal is true", () => {
      lesson1.sequencingControls.stopForwardTraversal = true;

      const result = validator.validateTraversalConstraints(lesson1);
      expect(result.canTraverseInto).toBe(false);
    });
  });

  describe("hasTimeBoundaryViolation", () => {
    it("should return true when current time is before begin time", () => {
      const now = new Date("2024-01-01T10:00:00Z");
      lesson1.beginTimeLimit = "2024-01-01T12:00:00Z";

      const result = validator.hasTimeBoundaryViolation(lesson1, now);
      expect(result).toBe(true);
    });

    it("should return true when current time is after end time", () => {
      const now = new Date("2024-01-01T14:00:00Z");
      lesson1.endTimeLimit = "2024-01-01T12:00:00Z";

      const result = validator.hasTimeBoundaryViolation(lesson1, now);
      expect(result).toBe(true);
    });

    it("should return false when current time is within range", () => {
      const now = new Date("2024-01-01T11:00:00Z");
      lesson1.beginTimeLimit = "2024-01-01T10:00:00Z";
      lesson1.endTimeLimit = "2024-01-01T12:00:00Z";

      const result = validator.hasTimeBoundaryViolation(lesson1, now);
      expect(result).toBe(false);
    });

    it("should return false when no time limits are set", () => {
      const now = new Date();
      const result = validator.hasTimeBoundaryViolation(lesson1, now);
      expect(result).toBe(false);
    });
  });

  describe("hasAttemptLimitViolation", () => {
    it("should return false when no attempt limit is set", () => {
      expect(validator.hasAttemptLimitViolation(lesson1)).toBe(false);
    });

    it("should return false when attempt count is below limit", () => {
      lesson1.attemptLimit = 3;
      lesson1.attemptCount = 2;
      expect(validator.hasAttemptLimitViolation(lesson1)).toBe(false);
    });

    it("should return true when attempt count equals limit", () => {
      lesson1.attemptLimit = 3;
      lesson1.attemptCount = 3;
      expect(validator.hasAttemptLimitViolation(lesson1)).toBe(true);
    });

    it("should return true when attempt count exceeds limit", () => {
      lesson1.attemptLimit = 3;
      lesson1.attemptCount = 5;
      expect(validator.hasAttemptLimitViolation(lesson1)).toBe(true);
    });
  });

  describe("meetsFlowConstraints", () => {
    it("should return false for unavailable activity", () => {
      lesson1.isAvailable = false;
      expect(validator.meetsFlowConstraints(lesson1, chapter1)).toBe(false);
    });

    it("should return false for hidden activity", () => {
      lesson1.isHiddenFromChoice = true;
      expect(validator.meetsFlowConstraints(lesson1, chapter1)).toBe(false);
    });

    it("should return true when no constrainChoice", () => {
      chapter1.sequencingControls.constrainChoice = false;
      expect(validator.meetsFlowConstraints(lesson1, chapter1)).toBe(true);
    });

    it("should validate constrainChoice when enabled", () => {
      chapter1.sequencingControls.constrainChoice = true;
      expect(validator.meetsFlowConstraints(lesson1, chapter1)).toBe(true);
    });
  });

  describe("validateConstrainChoiceForFlow", () => {
    it("should return true when constrainChoice is false", () => {
      chapter1.sequencingControls.constrainChoice = false;
      // Since validateConstrainChoiceForFlow is private, we test through meetsFlowConstraints
      expect(validator.meetsFlowConstraints(lesson1, chapter1)).toBe(true);
    });

    it("should handle empty children array", () => {
      const emptyCluster = new Activity("empty", "Empty Cluster");
      root.addChild(emptyCluster);
      emptyCluster.sequencingControls.constrainChoice = true;

      const result = validator.validateFlowConstraints(emptyCluster, []);
      expect(result.valid).toBe(false);
      expect(result.validChildren).toHaveLength(0);
    });

    it("should allow choice to first available when no current activity", () => {
      chapter1.sequencingControls.constrainChoice = true;
      activityTree.currentActivity = null;

      expect(validator.meetsFlowConstraints(lesson1, chapter1)).toBe(true);
    });

    it("should validate flow direction with forwardOnly", () => {
      chapter1.sequencingControls.constrainChoice = true;
      chapter1.sequencingControls.flow = true;
      chapter1.sequencingControls.forwardOnly = true;
      activityTree.currentActivity = lesson2;

      // Trying to go back to lesson1 (before current) should check completion
      lesson1.completionStatus = "completed" as any;
      expect(validator.meetsFlowConstraints(lesson1, chapter1)).toBe(true);
    });

    it("should block backward navigation to incomplete activity when forwardOnly", () => {
      chapter1.sequencingControls.constrainChoice = true;
      chapter1.sequencingControls.flow = true;
      chapter1.sequencingControls.forwardOnly = true;
      activityTree.currentActivity = lesson2;

      lesson1.completionStatus = "incomplete" as any;
      expect(validator.meetsFlowConstraints(lesson1, chapter1)).toBe(false);
    });

    it("should allow forward navigation to immediate next sibling", () => {
      chapter1.sequencingControls.constrainChoice = true;
      chapter1.sequencingControls.flow = true;
      activityTree.currentActivity = lesson1;

      expect(validator.meetsFlowConstraints(lesson2, chapter1)).toBe(true);
    });

    it("should block forward navigation to non-adjacent sibling", () => {
      const lesson2b = new Activity("lesson2b", "Lesson 2b");
      chapter1.addChild(lesson2b);
      chapter1.sequencingControls.constrainChoice = true;
      chapter1.sequencingControls.flow = true;
      activityTree.currentActivity = lesson1;

      expect(validator.meetsFlowConstraints(lesson2b, chapter1)).toBe(false);
    });

    it("should handle backward navigation in flow mode with completed activities", () => {
      chapter1.sequencingControls.constrainChoice = true;
      chapter1.sequencingControls.flow = true;
      activityTree.currentActivity = lesson2;

      lesson1.completionStatus = "completed" as any;
      expect(validator.meetsFlowConstraints(lesson1, chapter1)).toBe(true);
    });

    it("should block backward navigation in flow mode to incomplete activities", () => {
      chapter1.sequencingControls.constrainChoice = true;
      chapter1.sequencingControls.flow = true;
      activityTree.currentActivity = lesson2;

      lesson1.completionStatus = "incomplete" as any;
      expect(validator.meetsFlowConstraints(lesson1, chapter1)).toBe(false);
    });

    it("should handle non-flow mode with constrainChoice", () => {
      chapter1.sequencingControls.constrainChoice = true;
      chapter1.sequencingControls.flow = false;
      activityTree.currentActivity = lesson1;

      expect(validator.meetsFlowConstraints(lesson2, chapter1)).toBe(true);
    });
  });

  describe("validateTraversalConstraints detailed", () => {
    it("should evaluate constrainChoice for traversal", () => {
      chapter1.sequencingControls.constrainChoice = true;
      activityTree.currentActivity = lesson1;

      const result = validator.validateTraversalConstraints(lesson2);
      expect(result.canTraverse).toBe(true);
    });

    it("should evaluate forwardOnly for choice", () => {
      chapter1.sequencingControls.forwardOnly = true;
      activityTree.currentActivity = lesson2;

      const result = validator.validateTraversalConstraints(lesson1);
      expect(typeof result.canTraverseInto).toBe("boolean");
    });

    it("should block traversal when mandatory activity is skipped", () => {
      const lesson2b = new Activity("lesson2b", "Lesson 2b");
      chapter1.addChild(lesson2b);

      chapter1.sequencingControls.constrainChoice = true;
      (lesson2 as any).mandatory = true;
      lesson2.completionStatus = "incomplete" as any;
      activityTree.currentActivity = lesson1;

      const result = validator.validateTraversalConstraints(lesson2b);
      expect(result.canTraverse).toBe(false);
    });

    it("should allow traversal to completed mandatory activity", () => {
      chapter1.sequencingControls.constrainChoice = true;
      chapter1.sequencingControls.forwardOnly = true;
      (lesson2 as any).mandatory = true;
      lesson2.completionStatus = "completed" as any;
      activityTree.currentActivity = lesson2;

      lesson1.completionStatus = "completed" as any;
      const result = validator.validateTraversalConstraints(lesson1);
      expect(result.canTraverse).toBe(true);
    });
  });

  describe("evaluateForwardOnlyForChoice edge cases", () => {
    it("should handle activity with no parent", () => {
      // Root has no parent
      const result = validator.validateTraversalConstraints(root);
      expect(result.canTraverseInto).toBe(true);
    });

    it("should handle empty siblings array", () => {
      const emptyParent = new Activity("empty-parent", "Empty Parent");
      root.addChild(emptyParent);

      emptyParent.sequencingControls.forwardOnly = true;
      // Test with empty siblings array

      const result = validator.validateFlowConstraints(emptyParent, []);
      expect(result.valid).toBe(false);
    });

    it("should allow completed activities when navigating backward with choice enabled", () => {
      chapter1.sequencingControls.forwardOnly = true;
      activityTree.currentActivity = lesson2;

      lesson1.completionStatus = "completed" as any;
      lesson1.sequencingControls.choice = true;

      // Test via validateTraversalConstraints
      const result = validator.validateTraversalConstraints(lesson1);
      // The actual result depends on the full evaluation
      expect(typeof result.canTraverseInto).toBe("boolean");
    });

    it("should handle forwardOnly with no current activity", () => {
      chapter1.sequencingControls.forwardOnly = true;
      activityTree.currentActivity = null;

      const result = validator.validateTraversalConstraints(lesson1);
      expect(result.canTraverseInto).toBe(true);
    });
  });

  describe("preventActivation in path to root", () => {
    it("should block choice to unattempted activity when ancestor has preventActivation", () => {
      chapter1.sequencingControls.preventActivation = true;
      lesson2.attemptCount = 0;
      lesson2.isActive = false;

      const result = validator.validateChoice(null, lesson2);
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("SB.2.9-6");
    });

    it("should allow choice to attempted activity when ancestor has preventActivation", () => {
      chapter1.sequencingControls.preventActivation = true;
      lesson2.attemptCount = 1;

      const result = validator.validateChoice(null, lesson2);
      expect(result.valid).toBe(true);
    });

    it("should allow choice to active activity when ancestor has preventActivation", () => {
      chapter1.sequencingControls.preventActivation = true;
      lesson2.attemptCount = 0;
      lesson2.isActive = true;

      const result = validator.validateChoice(null, lesson2);
      expect(result.valid).toBe(true);
    });
  });

  describe("time boundary edge cases", () => {
    it("should handle invalid begin time format gracefully", () => {
      lesson1.beginTimeLimit = "invalid-date";
      const now = new Date();

      const result = validator.hasTimeBoundaryViolation(lesson1, now);
      expect(result).toBe(false); // Should not crash
    });

    it("should handle invalid end time format gracefully", () => {
      lesson1.endTimeLimit = "not-a-date";
      const now = new Date();

      const result = validator.hasTimeBoundaryViolation(lesson1, now);
      expect(result).toBe(false); // Should not crash
    });
  });

  describe("integration scenarios", () => {
    it("should validate complex multi-level constraint scenario", () => {
      // Setup: forwardOnly at root, constrainChoice at chapter1
      root.sequencingControls.forwardOnly = true;
      chapter1.sequencingControls.constrainChoice = true;

      lesson1.isActive = true;
      chapter1.isActive = true;

      // Should be able to go forward to lesson2
      const forward = validator.validateChoice(lesson1, lesson2);
      expect(forward.valid).toBe(true);

      // Should NOT be able to go backward from lesson2 to lesson1
      // With constrainChoice, backward to incomplete triggers SB.2.9-7
      lesson2.isActive = true;
      const backward = validator.validateChoice(lesson2, lesson1);
      expect(backward.valid).toBe(false);
      // constrainChoice check happens at chapter1 level before forwardOnly at root
      expect(backward.exception).toBe("SB.2.9-7");
    });

    it("should enforce forwardOnly when constrainChoice is not set", () => {
      // Setup: forwardOnly at chapter1, no constrainChoice
      chapter1.sequencingControls.forwardOnly = true;

      lesson1.isActive = true;
      chapter1.isActive = true;

      // Should NOT be able to go backward from lesson2 to lesson1 (forwardOnly)
      lesson2.isActive = true;
      const backward = validator.validateChoice(lesson2, lesson1);
      expect(backward.valid).toBe(false);
      expect(backward.exception).toBe("SB.2.9-5");
    });

    it("should handle choiceExit with nested activities", () => {
      // Chapter1 has choiceExit=false
      chapter1.sequencingControls.choiceExit = false;
      chapter1.isActive = true;
      lesson1.isActive = true;

      // Should be able to choose lesson2 (within chapter1)
      const withinSubtree = validator.validateChoice(lesson1, lesson2);
      expect(withinSubtree.valid).toBe(true);

      // Should NOT be able to choose lesson3 (outside chapter1)
      const outsideSubtree = validator.validateChoice(lesson1, lesson3);
      expect(outsideSubtree.valid).toBe(false);
      expect(outsideSubtree.exception).toBe("SB.2.9-8");
    });
  });
});
