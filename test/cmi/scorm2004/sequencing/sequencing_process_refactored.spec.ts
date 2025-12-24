import { describe, it, expect, beforeEach } from "vitest";
import { SequencingProcess } from "../../../../src/cmi/scorm2004/sequencing/sequencing_process_refactored";
import {
  SequencingRequestType,
  DeliveryRequestType
} from "../../../../src/cmi/scorm2004/sequencing/rules/sequencing_request_types";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import {
  SequencingRule,
  RuleActionType,
  RuleCondition,
  RuleConditionType
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";

describe("SequencingProcess (Refactored)", () => {
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
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
    sequencingProcess = new SequencingProcess(activityTree);
  });

  describe("sequencingRequestProcess", () => {
    describe("START request", () => {
      it("should deliver first activity on START", () => {
        const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.START
        );
        expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
        expect(result.targetActivity).toBe(lesson1);
      });

      it("should return exception when current activity exists", () => {
        activityTree.currentActivity = lesson1;
        const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.START
        );
        expect(result.exception).toBe("SB.2.5-2"); // SB.2.5-2: Session already begun
      });
    });

    describe("RESUME_ALL request", () => {
      it("should resume suspended activity", () => {
        activityTree.suspendedActivity = lesson2;
        const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.RESUME_ALL
        );
        expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
        expect(result.targetActivity).toBe(lesson2);
      });

      it("should return exception when no suspended activity", () => {
        const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.RESUME_ALL
        );
        expect(result.exception).toBe("SB.2.6-1");
      });
    });

    describe("CONTINUE request", () => {
      it("should navigate to next activity", () => {
        activityTree.currentActivity = lesson1;
        lesson1.isActive = false;

        const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.CONTINUE
        );
        expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
        expect(result.targetActivity).toBe(lesson2);
      });

      it("should return exception when no current activity", () => {
        const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.CONTINUE
        );
        expect(result.exception).toBe("SB.2.12-1");
      });

      it("should end session at last activity", () => {
        activityTree.currentActivity = lesson3;
        lesson3.isActive = false;

        const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.CONTINUE
        );
        expect(result.endSequencingSession).toBe(true);
      });
    });

    describe("PREVIOUS request", () => {
      it("should navigate to previous activity", () => {
        activityTree.currentActivity = lesson2;
        lesson2.isActive = false;

        const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.PREVIOUS
        );
        expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
        expect(result.targetActivity).toBe(lesson1);
      });

      it("should return exception when forwardOnly is set", () => {
        chapter1.sequencingControls.forwardOnly = true;
        activityTree.currentActivity = lesson2;
        lesson2.isActive = false;

        const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.PREVIOUS
        );
        expect(result.exception).toBe("SB.2.9-5");
      });
    });

    describe("CHOICE request", () => {
      it("should navigate to chosen activity", () => {
        activityTree.currentActivity = lesson1;
        lesson1.isActive = false; // Activity must be terminated for CHOICE
        chapter1.isActive = false;

        const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.CHOICE,
          "lesson2"
        );
        expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
        expect(result.targetActivity).toBe(lesson2);
      });

      it("should return exception when target not found", () => {
        const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.CHOICE,
          "nonexistent"
        );
        expect(result.exception).toBe("SB.2.9-1");
      });

      it("should return exception when target is hidden", () => {
        lesson2.isHiddenFromChoice = true;
        const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.CHOICE,
          "lesson2"
        );
        expect(result.exception).toBe("SB.2.9-4");
      });

      it("should navigate to cluster and find first deliverable", () => {
        const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.CHOICE,
          "chapter2"
        );
        expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
        expect(result.targetActivity).toBe(lesson3);
      });
    });

    describe("JUMP request", () => {
      it("should jump to target activity", () => {
        const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.JUMP,
          "lesson3"
        );
        expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
        expect(result.targetActivity).toBe(lesson3);
      });

      it("should return exception when target not found", () => {
        const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.JUMP,
          "nonexistent"
        );
        expect(result.exception).toBe("SB.2.13-1");
      });

      it("should return exception when target is unavailable", () => {
        lesson3.isAvailable = false;
        const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.JUMP,
          "lesson3"
        );
        expect(result.exception).toBe("SB.2.13-3");
      });
    });

    describe("EXIT request", () => {
      it("should exit current activity", () => {
        activityTree.currentActivity = lesson1;
        lesson1.isActive = true;

        const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.EXIT
        );
        expect(result.exception).toBeNull();
        expect(lesson1.isActive).toBe(false);
      });
    });

    describe("EXIT_ALL request", () => {
      it("should exit all activities", () => {
        activityTree.currentActivity = lesson1;
        lesson1.isActive = true;
        chapter1.isActive = true;

        const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.EXIT_ALL
        );
        expect(result.exception).toBeNull();
      });
    });

    describe("SUSPEND_ALL request", () => {
      it("should suspend current activity", () => {
        activityTree.currentActivity = lesson1;

        const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.SUSPEND_ALL
        );
        expect(result.exception).toBeNull();
        expect(activityTree.suspendedActivity).toBe(lesson1);
        expect(activityTree.currentActivity).toBeNull();
      });
    });

    describe("RETRY request", () => {
      it("should retry leaf activity", () => {
        activityTree.currentActivity = lesson1;
        lesson1.isActive = false;
        lesson1.isSuspended = false;

        const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.RETRY
        );
        expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
        expect(result.targetActivity).toBe(lesson1);
      });

      it("should return exception when activity is still active", () => {
        activityTree.currentActivity = lesson1;
        lesson1.isActive = true;

        const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.RETRY
        );
        expect(result.exception).toBe("SB.2.10-2");
      });
    });

    describe("RETRY_ALL request", () => {
      it("should restart from root", () => {
        activityTree.currentActivity = lesson2;

        const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.RETRY_ALL
        );
        expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
        expect(result.targetActivity).toBe(lesson1);
        expect(activityTree.currentActivity).toBeNull();
      });
    });

    describe("unknown request", () => {
      it("should return exception for unknown request type", () => {
        const result = sequencingProcess.sequencingRequestProcess(
          "unknown" as SequencingRequestType
        );
        expect(result.exception).toBe("SB.2.12-6");
      });
    });
  });

  describe("evaluatePostConditionRules", () => {
    it("should return null requests when no rules", () => {
      const result = sequencingProcess.evaluatePostConditionRules(lesson1);
      expect(result.sequencingRequest).toBeNull();
      expect(result.terminationRequest).toBeNull();
    });

    it("should handle CONTINUE post-condition", () => {
      const rule = new SequencingRule(RuleActionType.CONTINUE);
      rule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      lesson1.sequencingRules.addPostConditionRule(rule);

      const result = sequencingProcess.evaluatePostConditionRules(lesson1);
      expect(result.sequencingRequest).toBe(SequencingRequestType.CONTINUE);
    });
  });

  describe("canActivityBeDelivered", () => {
    it("should return true for available activity", () => {
      expect(sequencingProcess.canActivityBeDelivered(lesson1)).toBe(true);
    });

    it("should return false for unavailable activity", () => {
      lesson1.isAvailable = false;
      expect(sequencingProcess.canActivityBeDelivered(lesson1)).toBe(false);
    });

    it("should return false for invisible leaf", () => {
      lesson1.isVisible = false;
      expect(sequencingProcess.canActivityBeDelivered(lesson1)).toBe(false);
    });
  });

  describe("validateNavigationRequest", () => {
    it("should validate CHOICE request", () => {
      const result = sequencingProcess.validateNavigationRequest(
        SequencingRequestType.CHOICE,
        "lesson1",
        null
      );
      expect(result.valid).toBe(true);
    });

    it("should reject CHOICE without target", () => {
      const result = sequencingProcess.validateNavigationRequest(
        SequencingRequestType.CHOICE,
        null,
        null
      );
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("SB.2.12-5");
    });

    it("should reject unknown request type", () => {
      const result = sequencingProcess.validateNavigationRequest(
        "unknown" as SequencingRequestType,
        null,
        null
      );
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("SB.2.12-6");
    });
  });

  describe("getAvailableChoices", () => {
    it("should return all available activities", () => {
      const choices = sequencingProcess.getAvailableChoices();
      expect(choices).toContain(lesson1);
      expect(choices).toContain(lesson2);
      expect(choices).toContain(lesson3);
      expect(choices).toContain(chapter1);
      expect(choices).toContain(chapter2);
      expect(choices).not.toContain(root); // Root should not be included
    });

    it("should exclude hidden activities", () => {
      lesson2.isHiddenFromChoice = true;
      const choices = sequencingProcess.getAvailableChoices();
      expect(choices).not.toContain(lesson2);
    });

    it("should exclude unavailable activities", () => {
      lesson3.isAvailable = false;
      const choices = sequencingProcess.getAvailableChoices();
      expect(choices).not.toContain(lesson3);
    });
  });

  describe("service accessors", () => {
    it("should expose tree queries", () => {
      expect(sequencingProcess.getTreeQueries()).toBeDefined();
    });

    it("should expose constraint validator", () => {
      expect(sequencingProcess.getConstraintValidator()).toBeDefined();
    });

    it("should expose rule engine", () => {
      expect(sequencingProcess.getRuleEngine()).toBeDefined();
    });

    it("should expose traversal service", () => {
      expect(sequencingProcess.getTraversalService()).toBeDefined();
    });
  });

  describe("complex scenarios", () => {
    it("should handle forward-only navigation", () => {
      chapter1.sequencingControls.forwardOnly = true;
      activityTree.currentActivity = lesson1;
      lesson1.isActive = false;

      // Forward should work
      const forwardResult = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CONTINUE
      );
      expect(forwardResult.deliveryRequest).toBe(DeliveryRequestType.DELIVER);

      // Backward should fail
      activityTree.currentActivity = lesson2;
      lesson2.isActive = false;
      const backwardResult = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.PREVIOUS
      );
      expect(backwardResult.exception).toBe("SB.2.9-5");
    });

    it("should handle choiceExit constraints", () => {
      chapter1.sequencingControls.choiceExit = false;
      chapter1.isActive = true; // Ancestor must be active for choiceExit to apply
      lesson1.isActive = false; // Current must be terminated for CHOICE to proceed
      activityTree.currentActivity = lesson1;

      // Choice within chapter1 should work
      const withinResult = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "lesson2"
      );
      expect(withinResult.deliveryRequest).toBe(DeliveryRequestType.DELIVER);

      // Reset state for next test
      lesson1.isActive = false; // Current must be terminated
      chapter1.isActive = true;
      activityTree.currentActivity = lesson1;

      // Choice outside chapter1 should fail with SB.2.9-8
      const outsideResult = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "lesson3"
      );
      expect(outsideResult.exception).toBe("SB.2.9-8");
    });

    it("should handle constrainChoice constraints", () => {
      // Build a fresh tree with 3 lessons for this test
      const testRoot = new Activity("test-root", "Test Root");
      const testChapter = new Activity("test-chapter", "Test Chapter");
      const testLesson1 = new Activity("test-lesson1", "Test Lesson 1");
      const testLesson2 = new Activity("test-lesson2", "Test Lesson 2");
      const testLesson3 = new Activity("test-lesson3", "Test Lesson 3");

      testRoot.addChild(testChapter);
      testChapter.addChild(testLesson1);
      testChapter.addChild(testLesson2);
      testChapter.addChild(testLesson3);

      const testTree = new ActivityTree(testRoot);
      const testProcess = new SequencingProcess(testTree);

      testChapter.sequencingControls.constrainChoice = true;
      testLesson1.isActive = false; // Current must be terminated for CHOICE
      testTree.currentActivity = testLesson1;

      // Choice to immediate next should work
      const nextResult = testProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test-lesson2"
      );
      expect(nextResult.deliveryRequest).toBe(DeliveryRequestType.DELIVER);

      // Refresh current activity
      testTree.currentActivity = testLesson1;
      testLesson1.isActive = false; // Current must be terminated for CHOICE

      // Choice skipping test-lesson2 should fail
      const skipResult = testProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "test-lesson3"
      );
      expect(skipResult.exception).toBe("SB.2.9-7");
    });
  });
});
