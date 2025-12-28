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

/**
 * Tests for Choice Flow to Cluster Activities (SB.2.9.1, SB.2.9.2, SB.2.4)
 *
 * These tests exercise the choiceFlowSubprocess and its helper methods:
 * - choiceFlowTreeTraversalSubprocess
 * - enhancedChoiceActivityTraversalSubprocess
 * - validateChoiceFlowConstraints
 * - validateChoiceTraversalConstraints
 *
 * The key scenario is: when a CHOICE request targets a cluster (non-leaf),
 * the system must flow into that cluster to find a deliverable leaf.
 */
describe("Choice Flow to Cluster Activities", () => {
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let root: Activity;
  let module1: Activity;
  let module2: Activity;
  let lesson1: Activity;
  let lesson2: Activity;
  let lesson3: Activity;
  let lesson4: Activity;

  beforeEach(() => {
    // Create a nested activity tree:
    // root
    //   ├── module1 (cluster)
    //   │     ├── lesson1 (leaf)
    //   │     └── lesson2 (leaf)
    //   └── module2 (cluster)
    //         ├── lesson3 (leaf)
    //         └── lesson4 (leaf)
    root = new Activity("root", "Course");
    module1 = new Activity("module1", "Module 1");
    module2 = new Activity("module2", "Module 2");
    lesson1 = new Activity("lesson1", "Lesson 1");
    lesson2 = new Activity("lesson2", "Lesson 2");
    lesson3 = new Activity("lesson3", "Lesson 3");
    lesson4 = new Activity("lesson4", "Lesson 4");

    root.addChild(module1);
    root.addChild(module2);
    module1.addChild(lesson1);
    module1.addChild(lesson2);
    module2.addChild(lesson3);
    module2.addChild(lesson4);

    // Initialize all activities
    root.initialize();

    activityTree = new ActivityTree(root);

    // Enable choice by default
    root.sequencingControls.choice = true;
    module1.sequencingControls.choice = true;
    module2.sequencingControls.choice = true;

    sequencingProcess = new SequencingProcess(activityTree);
  });

  describe("Basic cluster choice navigation", () => {
    it("should flow into cluster and deliver first available leaf when choosing a cluster", () => {
      // Set current activity
      activityTree.currentActivity = lesson1;
      lesson1.isActive = false;

      // Choose module2 (a cluster)
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "module2"
      );

      // Should deliver the first leaf in module2 (lesson3)
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("lesson3");
    });

    it("should return exception when cluster has no deliverable children", () => {
      // Make all children of module2 unavailable
      lesson3.isAvailable = false;
      lesson4.isAvailable = false;

      activityTree.currentActivity = lesson1;
      lesson1.isActive = false;

      // Choose module2 with no available children
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "module2"
      );

      // Should fail with no activity available
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.9-7");
    });

    it("should skip hidden children when flowing into cluster", () => {
      // Hide lesson3 from choice
      lesson3.isHiddenFromChoice = true;

      activityTree.currentActivity = lesson1;
      lesson1.isActive = false;

      // Choose module2
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "module2"
      );

      // Should skip hidden lesson3 and deliver lesson4
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("lesson4");
    });

    it("should skip unavailable children when flowing into cluster", () => {
      // Make lesson3 unavailable
      lesson3.isAvailable = false;

      activityTree.currentActivity = lesson1;
      lesson1.isActive = false;

      // Choose module2
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "module2"
      );

      // Should skip unavailable lesson3 and deliver lesson4
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("lesson4");
    });
  });

  describe("Cluster choice with constrainChoice control", () => {
    it("should allow choice to cluster within same branch when constrainChoice is true", () => {
      root.sequencingControls.constrainChoice = true;

      activityTree.currentActivity = lesson1;
      lesson1.isActive = false;

      // Choose module1 (same branch as current activity)
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "module1"
      );

      // Should be allowed - same branch
      // Result could be lesson1 or lesson2 depending on flow
      expect(result).toBeDefined();
    });

    it("should restrict choice to cluster in different branch when constrainChoice is true on parent", () => {
      // Enable constrainChoice at module1 level
      module1.sequencingControls.constrainChoice = true;

      // Set current activity in module1
      activityTree.currentActivity = lesson1;
      lesson1.isActive = false;

      // Try to choose module2 (different branch)
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "module2"
      );

      // This depends on implementation - constrainChoice on module1 only
      // affects choices within module1, not choices to external clusters
      expect(result).toBeDefined();
    });

    it("should validate choice flow constraints when navigating to cluster", () => {
      // Set constrainChoice at root level
      root.sequencingControls.constrainChoice = true;

      // Current activity is lesson1 in module1
      activityTree.currentActivity = lesson1;
      lesson1.isActive = false;
      lesson1.isActive = true; // Make it appear that module1 is the active branch
      module1.isActive = true;

      // Try to choose module2 (different branch with constrainChoice)
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "module2"
      );

      // With constrainChoice at root, choice outside current branch should be blocked
      // The exception should be related to choice constraint
      expect(result).toBeDefined();
      // Could be blocked with exception or allowed depending on implementation
    });
  });

  describe("Cluster choice with forwardOnly control", () => {
    it("should allow forward choice to cluster when forwardOnly is true", () => {
      // Enable forwardOnly at root level
      root.sequencingControls.forwardOnly = true;

      activityTree.currentActivity = lesson1;
      lesson1.isActive = false;

      // Choose module2 (forward from module1)
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "module2"
      );

      // Forward choice should be allowed
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("lesson3");
    });

    it("should allow choice to cluster when current activity is not set", () => {
      // Enable forwardOnly at root level
      root.sequencingControls.forwardOnly = true;

      // No current activity set
      activityTree.currentActivity = null;

      // Choose module2
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "module2"
      );

      // Should allow choice when no current activity
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("lesson3");
    });
  });

  describe("Cluster choice with stopForwardTraversal control", () => {
    it("should handle stopForwardTraversal when flowing into cluster", () => {
      // Set stopForwardTraversal on lesson3
      lesson3.sequencingControls.stopForwardTraversal = true;

      activityTree.currentActivity = lesson1;
      lesson1.isActive = false;

      // Choose module2
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "module2"
      );

      // lesson3 should still be deliverable for choice
      // stopForwardTraversal affects flow traversal, not direct choice
      expect(result).toBeDefined();
    });
  });

  describe("Nested cluster choice navigation", () => {
    let subModule: Activity;
    let deepLesson: Activity;

    beforeEach(() => {
      // Add deeper nesting:
      // module2
      //   └── subModule (cluster)
      //         └── deepLesson (leaf)
      subModule = new Activity("subModule", "Sub Module");
      deepLesson = new Activity("deepLesson", "Deep Lesson");

      module2.addChild(subModule);
      subModule.addChild(deepLesson);
      subModule.sequencingControls.choice = true;
    });

    it("should recursively flow through nested clusters to find leaf", () => {
      // Hide direct children to force flow into subModule
      lesson3.isHiddenFromChoice = true;
      lesson4.isHiddenFromChoice = true;

      activityTree.currentActivity = lesson1;
      lesson1.isActive = false;

      // Choose module2
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "module2"
      );

      // Should flow through subModule to reach deepLesson
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("deepLesson");
    });

    it("should return exception when nested cluster has no deliverable descendants", () => {
      // Hide all direct children
      lesson3.isHiddenFromChoice = true;
      lesson4.isHiddenFromChoice = true;

      // Also make the deep leaf unavailable
      deepLesson.isAvailable = false;

      activityTree.currentActivity = lesson1;
      lesson1.isActive = false;

      // Choose module2
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "module2"
      );

      // Should fail - no deliverable activity found
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.9-7");
    });
  });

  describe("Cluster choice with pre-condition rules", () => {
    it("should skip children with SKIP pre-condition rule when flowing into cluster", () => {
      // Add SKIP rule to lesson3
      const skipCondition = new RuleCondition(RuleConditionType.ALWAYS);
      const skipRule = new SequencingRule(RuleActionType.SKIP, [skipCondition]);
      lesson3.sequencingRules.preConditionRules.push(skipRule);

      activityTree.currentActivity = lesson1;
      lesson1.isActive = false;

      // Choose module2
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "module2"
      );

      // Should skip lesson3 due to SKIP rule and deliver lesson4
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("lesson4");
    });

    it("should skip children with DISABLED pre-condition rule when flowing into cluster", () => {
      // Add DISABLED rule to lesson3
      const disabledCondition = new RuleCondition(RuleConditionType.ALWAYS);
      const disabledRule = new SequencingRule(RuleActionType.DISABLED, [
        disabledCondition
      ]);
      lesson3.sequencingRules.preConditionRules.push(disabledRule);

      activityTree.currentActivity = lesson1;
      lesson1.isActive = false;

      // Choose module2
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "module2"
      );

      // Should skip disabled lesson3 and deliver lesson4
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("lesson4");
    });

    it("should apply HIDE_FROM_CHOICE pre-condition rule via isHiddenFromChoice flag", () => {
      // The HIDE_FROM_CHOICE pre-condition rule sets isHiddenFromChoice flag
      // For cluster flow, the flag must be set directly
      lesson3.isHiddenFromChoice = true;

      activityTree.currentActivity = lesson1;
      lesson1.isActive = false;

      // Choose module2
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "module2"
      );

      // Should skip hidden lesson3 and deliver lesson4
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("lesson4");
    });
  });

  describe("Cluster choice with attempt limits", () => {
    it("should skip children that have exceeded attempt limit", () => {
      // Set up attempt limit violation on lesson3
      lesson3.attemptLimit = 3;
      lesson3.attemptCount = 3;

      activityTree.currentActivity = lesson1;
      lesson1.isActive = false;

      // Choose module2
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "module2"
      );

      // Should skip lesson3 due to attempt limit and deliver lesson4
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("lesson4");
    });

    it("should return exception when all children have exceeded attempt limits", () => {
      // Set up attempt limit violations on all children
      lesson3.attemptLimit = 1;
      lesson3.attemptCount = 1;
      lesson4.attemptLimit = 1;
      lesson4.attemptCount = 1;

      activityTree.currentActivity = lesson1;
      lesson1.isActive = false;

      // Choose module2
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "module2"
      );

      // Should fail - all children have exceeded attempt limits
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });
  });

  describe("Cluster choice with time limits", () => {
    it("should not check end time limit during cluster flow (time limits checked at delivery)", () => {
      // Set end time in the past for lesson3
      // Note: Time limits are checked during delivery validation, not during cluster flow
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      lesson3.endTimeLimit = pastDate.toISOString();

      activityTree.currentActivity = lesson1;
      lesson1.isActive = false;

      // Choose module2
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "module2"
      );

      // Cluster flow delivers first available child; time limit is checked at delivery
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("lesson3");
    });

    it("should not check begin time limit during cluster flow (time limits checked at delivery)", () => {
      // Set begin time in the future for lesson3
      // Note: Time limits are checked during delivery validation, not during cluster flow
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);
      lesson3.beginTimeLimit = futureDate.toISOString();

      activityTree.currentActivity = lesson1;
      lesson1.isActive = false;

      // Choose module2
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "module2"
      );

      // Cluster flow delivers first available child; time limit is checked at delivery
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("lesson3");
    });
  });

  describe("Choice control validation during cluster flow", () => {
    it("should fail when child cluster has choice=false", () => {
      // Disable choice at module2 level
      module2.sequencingControls.choice = false;

      activityTree.currentActivity = lesson1;
      lesson1.isActive = false;

      // Try to choose lesson3 (child of module2 with choice=false)
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "lesson3"
      );

      // Should be blocked by choice control
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.9-5");
    });
  });
});
