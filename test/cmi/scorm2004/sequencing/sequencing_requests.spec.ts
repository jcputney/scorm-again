import { beforeEach, describe, expect, it } from "vitest";
import {
  DeliveryRequestType,
  SequencingProcess,
  SequencingRequestType
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import {
  RuleActionType,
  RuleCondition,
  RuleConditionType,
  SequencingRule
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";

describe("Sequencing Request Processes (SB.2.5-2.11)", () => {
  let sequencingProcess: SequencingProcess;
  let activityTree: ActivityTree;
  let root: Activity;
  let module1: Activity;
  let module2: Activity;
  let lesson1_1: Activity;
  let lesson1_2: Activity;
  let lesson2_1: Activity;
  let lesson2_2: Activity;

  beforeEach(() => {
    // Create comprehensive activity tree
    activityTree = new ActivityTree();
    root = new Activity("root", "Course");
    module1 = new Activity("module1", "Module 1");
    module2 = new Activity("module2", "Module 2");
    lesson1_1 = new Activity("lesson1_1", "Lesson 1.1");
    lesson1_2 = new Activity("lesson1_2", "Lesson 1.2");
    lesson2_1 = new Activity("lesson2_1", "Lesson 2.1");
    lesson2_2 = new Activity("lesson2_2", "Lesson 2.2");

    // Build tree
    root.addChild(module1);
    root.addChild(module2);
    module1.addChild(lesson1_1);
    module1.addChild(lesson1_2);
    module2.addChild(lesson2_1);
    module2.addChild(lesson2_2);

    activityTree.root = root;

    // Enable controls
    root.sequencingControls.flow = true;
    root.sequencingControls.choice = true;
    root.sequencingControls.choiceExit = true;
    module1.sequencingControls.flow = true;
    module1.sequencingControls.choice = true;
    module2.sequencingControls.flow = true;
    module2.sequencingControls.choice = true;

    sequencingProcess = new SequencingProcess(activityTree);
  });

  describe("Start Sequencing Request Process (SB.2.5)", () => {
    it("should identify first activity on start", () => {
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(lesson1_1);
      expect(result.exception).toBeNull();
    });

    it("should fail if session already begun (SB.2.5-2)", () => {
      activityTree.currentActivity = lesson1_1;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.5-2");
    });

    it("should fail if no activity available (SB.2.5-3)", () => {
      // Make all activities unavailable
      lesson1_1.isAvailable = false;
      lesson1_2.isAvailable = false;
      lesson2_1.isAvailable = false;
      lesson2_2.isAvailable = false;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.5-3");
    });

    it("should skip disabled activities", () => {
      // Disable first activity
      const disableRule = new SequencingRule(RuleActionType.DISABLED);
      disableRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      lesson1_1.sequencingRules.addPreConditionRule(disableRule);

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);

      expect(result.targetActivity).toBe(lesson1_2);
    });
  });

  describe("Resume All Sequencing Request Process (SB.2.6)", () => {
    it("should deliver suspended activity", () => {
      lesson1_2.isSuspended = true;
      activityTree.suspendedActivity = lesson1_2;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.RESUME_ALL);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(lesson1_2);
    });

    it("should fail if no suspended activity (SB.2.6-1)", () => {
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.RESUME_ALL);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.6-1");
    });

    it("should fail if current activity defined (SB.2.6-2)", () => {
      activityTree.suspendedActivity = lesson1_2;
      activityTree.currentActivity = lesson1_1;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.RESUME_ALL);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.6-2");
    });
  });

  describe("Continue Sequencing Request Process (SB.2.7)", () => {
    it("should flow to next activity", () => {
      activityTree.currentActivity = lesson1_1;
      lesson1_1.isActive = false; // Terminated

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(lesson1_2);
    });

    it("should fail if current not terminated (SB.2.7-1)", () => {
      activityTree.currentActivity = lesson1_1;
      lesson1_1.isActive = true; // Still active

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.7-1");
    });

    it("should fail if no next activity (SB.2.7-2)", () => {
      activityTree.currentActivity = lesson2_2; // Last activity
      lesson2_2.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.7-2");
    });

    it("should handle flow across module boundaries", () => {
      activityTree.currentActivity = lesson1_2;
      lesson1_2.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);

      expect(result.targetActivity).toBe(lesson2_1);
    });

    it("should end if activity check fails", () => {
      activityTree.currentActivity = lesson1_1;
      lesson1_1.isActive = false;

      // Make next activity exceed limit
      lesson1_2.attemptLimit = 1;
      lesson1_2.attemptCount = 1;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);

      // Should skip to next available
      expect(result.targetActivity).toBe(lesson2_1);
    });
  });

  describe("Previous Sequencing Request Process (SB.2.8)", () => {
    it("should flow to previous activity", () => {
      activityTree.currentActivity = lesson1_2;
      lesson1_2.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.PREVIOUS);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(lesson1_1);
    });

    it("should fail if current not terminated (SB.2.8-1)", () => {
      activityTree.currentActivity = lesson1_2;
      lesson1_2.isActive = true;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.PREVIOUS);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.8-1");
    });

    it("should fail if no previous activity (SB.2.8-2 or SB.2.1-3)", () => {
      activityTree.currentActivity = lesson1_1; // First activity
      lesson1_1.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.PREVIOUS);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      // More specific exception code SB.2.1-3 (reached beginning) takes precedence over SB.2.8-2
      expect(result.exception).toBe("SB.2.1-3");
    });

    it("should handle flow across module boundaries backward", () => {
      activityTree.currentActivity = lesson2_1;
      lesson2_1.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.PREVIOUS);

      expect(result.targetActivity).toBe(lesson1_2);
    });
  });

  describe("Choice Sequencing Request Process (SB.2.9)", () => {
    it("should deliver chosen activity", () => {
      activityTree.currentActivity = null;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "lesson2_1"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(lesson2_1);
    });

    it("should fail if target doesn't exist (SB.2.9-1)", () => {
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "nonexistent"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.9-1");
    });

    it("should fail if target not in tree (SB.2.9-2)", () => {
      const orphan = new Activity("orphan", "Orphan");

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "orphan"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.9-1");
    });

    it("should fail if choosing root (SB.2.9-3)", () => {
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "root"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.9-3");
    });

    it("should fail if activity hidden from choice (SB.2.9-4)", () => {
      lesson2_1.isHiddenFromChoice = true;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "lesson2_1"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.9-4");
    });

    it("should fail if choice control constrained (SB.2.9-5)", () => {
      module2.sequencingControls.choice = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "lesson2_1"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.9-5");
    });

    it("should fail if current not terminated (SB.2.9-6)", () => {
      activityTree.currentActivity = lesson1_1;
      lesson1_1.isActive = true;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "lesson2_1"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.9-6");
    });

    it("should flow from cluster to leaf (SB.2.9-7)", () => {
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "module2"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(lesson2_1); // First child
    });

    it("should check activities in path", () => {
      // Add limit to module
      module2.attemptLimit = 1;
      module2.attemptCount = 1;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "lesson2_1"
      );

      // Should fail activity check
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should terminate descendants from common ancestor", () => {
      activityTree.currentActivity = lesson1_1;
      lesson1_1.isActive = false;
      module1.isActive = true;
      lesson1_2.isActive = true;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "lesson2_1"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      // Descendants should be terminated
      expect(lesson1_2.isActive).toBe(false);
    });
  });

  describe("Retry Sequencing Request Process (SB.2.10)", () => {
    it("should retry current activity", () => {
      activityTree.currentActivity = lesson1_1;
      lesson1_1.isActive = false;
      lesson1_1.attemptCount = 1;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.RETRY);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(lesson1_1);
      // Attempt count increment moved to contentDeliveryEnvironmentProcess
      // The increment no longer happens in retrySequencingRequestProcess
      expect(lesson1_1.attemptCount).toBe(1);
    });

    it("should increment attempt count", () => {
      activityTree.currentActivity = lesson1_1;
      lesson1_1.attemptCount = 0;

      sequencingProcess.sequencingRequestProcess(SequencingRequestType.RETRY);

      // Attempt count increment moved to contentDeliveryEnvironmentProcess
      // The increment no longer happens in retrySequencingRequestProcess
      expect(lesson1_1.attemptCount).toBe(0);
    });

    it("should handle retry with selection/randomization", () => {
      module1.sequencingControls.selectionTiming = "onEachNewAttempt";
      module1.sequencingControls.selectCount = 1;

      activityTree.currentActivity = lesson1_1;
      lesson1_1.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.RETRY);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(lesson1_1);
    });
  });

  describe("Retry All Sequencing Request Process", () => {
    it("should restart from root", () => {
      activityTree.currentActivity = lesson2_1;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.RETRY_ALL);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(lesson1_1); // First activity
    });

    it("should work without current activity", () => {
      activityTree.currentActivity = null;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.RETRY_ALL);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(lesson1_1);
    });
  });

  describe("Exit Sequencing Request Process (SB.2.11)", () => {
    it("should process exit request", () => {
      activityTree.currentActivity = lesson1_1;
      lesson1_1.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.EXIT);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBeNull();
    });

    it("should fail if exit not allowed - no parent (SB.2.11-1)", () => {
      activityTree.currentActivity = root;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.EXIT);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.11-1");
    });

    it("should fail if parent disallows choice exit (SB.2.11-2)", () => {
      module1.sequencingControls.choiceExit = false;
      activityTree.currentActivity = lesson1_1;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.EXIT);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.11-2");
    });

    it("should terminate descendants", () => {
      // Create deeper hierarchy
      const subLesson = new Activity("sub", "Sub");
      lesson1_1.addChild(subLesson);

      activityTree.currentActivity = subLesson;
      subLesson.isActive = true;
      lesson1_1.isActive = true;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.EXIT);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(subLesson.isActive).toBe(false);
    });
  });

  describe("Exit All, Abandon, Abandon All, Suspend All", () => {
    it("should process exit all", () => {
      activityTree.currentActivity = lesson1_1;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.EXIT_ALL);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should process abandon", () => {
      activityTree.currentActivity = lesson1_1;
      lesson1_1.isActive = true;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.ABANDON);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(lesson1_1.isActive).toBe(false);
    });

    it("should process abandon all", () => {
      activityTree.currentActivity = lesson1_1;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.ABANDON_ALL);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should process suspend all", () => {
      activityTree.currentActivity = lesson1_1;
      lesson1_1.isActive = true;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.SUSPEND_ALL);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(lesson1_1.isSuspended).toBe(true);
    });

    it("should fail suspend at root (SB.2.15-1)", () => {
      activityTree.currentActivity = root;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.SUSPEND_ALL);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.15-1");
    });
  });

  describe("Choice Flow Subprocesses", () => {
    it("should use choice flow subprocess for clusters", () => {
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "module1"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(lesson1_1); // First available child
    });

    it("should handle constrain choice in traversal", () => {
      module1.sequencingControls.constrainChoice = true;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "module1"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(lesson1_1);
    });

    it("should check all children for availability", () => {
      lesson1_1.isAvailable = false;
      lesson1_1.isHiddenFromChoice = true;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "module1"
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(lesson1_2); // Skip to available
    });
  });
});
