import { beforeEach, describe, expect, it } from "vitest";
import { FlowTraversalService } from "../../../../../src/cmi/scorm2004/sequencing/traversal/flow_traversal_service";
import { RuleEvaluationEngine } from "../../../../../src/cmi/scorm2004/sequencing/rules/rule_evaluation_engine";
import { FlowSubprocessMode } from "../../../../../src/cmi/scorm2004/sequencing/rules/sequencing_request_types";
import {
  RuleActionType,
  RuleCondition,
  RuleConditionType,
  SequencingRule,
} from "../../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import { Activity } from "../../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../../src/cmi/scorm2004/sequencing/activity_tree";

describe("FlowTraversalService", () => {
  let activityTree: ActivityTree;
  let ruleEngine: RuleEvaluationEngine;
  let service: FlowTraversalService;
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
    ruleEngine = new RuleEvaluationEngine();
    service = new FlowTraversalService(activityTree, ruleEngine);
  });

  describe("flowTreeTraversalSubprocess", () => {
    describe("forward traversal", () => {
      it("should return first child when not skipping children", () => {
        const result = service.flowTreeTraversalSubprocess(root, FlowSubprocessMode.FORWARD, false);
        expect(result.activity).toBe(chapter1);
        expect(result.endSequencingSession).toBe(false);
      });

      it("should return next sibling when skipping children", () => {
        const result = service.flowTreeTraversalSubprocess(
          chapter1,
          FlowSubprocessMode.FORWARD,
          true,
        );
        expect(result.activity).toBe(chapter2);
        expect(result.endSequencingSession).toBe(false);
      });

      it("should go to parent's next sibling when no next sibling", () => {
        const result = service.flowTreeTraversalSubprocess(
          lesson2,
          FlowSubprocessMode.FORWARD,
          true,
        );
        expect(result.activity).toBe(chapter2);
        expect(result.endSequencingSession).toBe(false);
      });

      it("should preserve an active cluster while returning its next sibling", () => {
        chapter1.isActive = true;

        const result = service.flowTreeTraversalSubprocess(
          lesson2,
          FlowSubprocessMode.FORWARD,
          true,
        );

        expect(result.activity).toBe(chapter2);
        expect(chapter1.isActive).toBe(true);
      });

      it("should set endSequencingSession when at last activity", () => {
        const result = service.flowTreeTraversalSubprocess(
          lesson3,
          FlowSubprocessMode.FORWARD,
          true,
        );
        expect(result.activity).toBeNull();
        expect(result.endSequencingSession).toBe(true);
      });
    });

    describe("backward traversal", () => {
      it("should return previous sibling leaf", () => {
        const result = service.flowTreeTraversalSubprocess(lesson2, FlowSubprocessMode.BACKWARD);
        expect(result.activity).toBe(lesson1);
        expect(result.endSequencingSession).toBe(false);
      });

      it("should return null when at first activity", () => {
        const result = service.flowTreeTraversalSubprocess(lesson1, FlowSubprocessMode.BACKWARD);
        expect(result.activity).toBeNull();
        expect(result.endSequencingSession).toBe(false);
      });

      it("should return exception when forwardOnly is set", () => {
        chapter1.sequencingControls.forwardOnly = true;

        const result = service.flowTreeTraversalSubprocess(lesson2, FlowSubprocessMode.BACKWARD);
        expect(result.activity).toBeNull();
        expect(result.exception).toBe("SB.2.1-4");
      });

      it("should return previous sibling cluster for SB.2.2 backward descent", () => {
        const result = service.flowTreeTraversalSubprocess(lesson3, FlowSubprocessMode.BACKWARD);
        expect(result.activity).toBe(chapter1);
      });
    });
  });

  describe("flowActivityTraversalSubprocess", () => {
    it("should return null when flow is disabled on parent", () => {
      chapter1.sequencingControls.flow = false;

      const result = service.flowActivityTraversalSubprocess(
        lesson1,
        true,
        true,
        FlowSubprocessMode.FORWARD,
      );
      expect(result).toBeNull();
    });

    it("should return null when activity is not available", () => {
      lesson1.isAvailable = false;

      const result = service.flowActivityTraversalSubprocess(
        lesson1,
        true,
        true,
        FlowSubprocessMode.FORWARD,
      );
      expect(result).toBeNull();
    });

    it("should return null when stopForwardTraversal is set in forward mode", () => {
      lesson1.sequencingControls.stopForwardTraversal = true;

      const result = service.flowActivityTraversalSubprocess(
        lesson1,
        true,
        true,
        FlowSubprocessMode.FORWARD,
      );
      expect(result).toBeNull();
    });

    it("should return leaf activity that can be delivered", () => {
      const result = service.flowActivityTraversalSubprocess(
        lesson1,
        true,
        true,
        FlowSubprocessMode.FORWARD,
      );
      expect(result).toBe(lesson1);
    });

    it("should flow into cluster and find first deliverable child", () => {
      const result = service.flowActivityTraversalSubprocess(
        chapter1,
        true,
        true,
        FlowSubprocessMode.FORWARD,
      );
      expect(result).toBe(lesson1);
    });

    it("should enter cluster from the last child in backward mode", () => {
      const result = service.flowActivityTraversalSubprocess(
        chapter1,
        false,
        true,
        FlowSubprocessMode.BACKWARD,
      );
      expect(result).toBe(lesson2);
    });

    it("should bypass a skipped cluster subtree in forward mode", () => {
      const skipRule = new SequencingRule(RuleActionType.SKIP);
      skipRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      chapter2.sequencingRules.addPreConditionRule(skipRule);

      const chapter3 = new Activity("chapter3", "Chapter 3");
      const lesson4 = new Activity("lesson4", "Lesson 4");
      root.addChild(chapter3);
      chapter3.addChild(lesson4);
      chapter3.sequencingControls.flow = true;

      const result = service.flowSubprocess(lesson2, FlowSubprocessMode.FORWARD);

      expect(result.deliverable).toBe(true);
      expect(result.identifiedActivity).toBe(lesson4);
      expect(chapter2.wasSkipped).toBe(true);
    });

    it("should bypass a skipped cluster subtree in backward mode", () => {
      const localRoot = new Activity("localRoot", "Local Root");
      const activity1 = new Activity("activity_1", "Activity 1");
      const activity2 = new Activity("activity_2", "Activity 2");
      const activity3 = new Activity("activity_3", "Activity 3");
      const activity4 = new Activity("activity_4", "Activity 4");
      const activity6 = new Activity("activity_6", "Activity 6");

      localRoot.addChild(activity1);
      localRoot.addChild(activity2);
      localRoot.addChild(activity6);
      activity2.addChild(activity3);
      activity2.addChild(activity4);

      localRoot.sequencingControls.flow = true;
      activity2.sequencingControls.flow = true;

      const skipRule = new SequencingRule(RuleActionType.SKIP);
      skipRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      activity2.sequencingRules.addPreConditionRule(skipRule);

      const localService = new FlowTraversalService(
        new ActivityTree(localRoot),
        new RuleEvaluationEngine(),
      );

      const result = localService.flowSubprocess(activity6, FlowSubprocessMode.BACKWARD);

      expect(result.deliverable).toBe(true);
      expect(result.identifiedActivity).toBe(activity1);
      expect(activity2.wasSkipped).toBe(true);
    });

    it("should deliver an invisible leaf through flow navigation", () => {
      lesson1.isVisible = false;

      const result = service.flowActivityTraversalSubprocess(
        lesson1,
        true,
        true,
        FlowSubprocessMode.FORWARD,
      );
      expect(result).toBe(lesson1);
    });
  });

  describe("flowSubprocess", () => {
    it("should find deliverable activity in forward direction", () => {
      const result = service.flowSubprocess(lesson1, FlowSubprocessMode.FORWARD);
      expect(result.deliverable).toBe(true);
      expect(result.identifiedActivity).toBe(lesson2);
    });

    it("should find deliverable activity in backward direction", () => {
      const result = service.flowSubprocess(lesson2, FlowSubprocessMode.BACKWARD);
      expect(result.deliverable).toBe(true);
      expect(result.identifiedActivity).toBe(lesson1);
    });

    it("should descend into previous sibling cluster in backward direction", () => {
      const result = service.flowSubprocess(lesson3, FlowSubprocessMode.BACKWARD);
      expect(result.deliverable).toBe(true);
      expect(result.identifiedActivity).toBe(lesson2);
    });

    it("should return exception when at end of course", () => {
      const result = service.flowSubprocess(lesson3, FlowSubprocessMode.FORWARD);
      expect(result.deliverable).toBe(false);
      expect(result.endSequencingSession).toBe(true);
    });

    it("should return exception when at beginning of course", () => {
      const result = service.flowSubprocess(lesson1, FlowSubprocessMode.BACKWARD);
      expect(result.deliverable).toBe(false);
      expect(result.exception).toBe("SB.2.1-3");
    });
  });

  describe("blocked flow candidates", () => {
    /** @spec SN Book: SB.2.2 step 5.1 - disabled and limit-violated candidates stop flow. */
    it.each(["disabled", "attempt limit"])("should stop at a sibling blocked by %s", (reason) => {
      if (reason === "disabled") {
        const rule = new SequencingRule(RuleActionType.DISABLED);
        rule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
        lesson2.sequencingRules.addPreConditionRule(rule);
      } else {
        lesson2.attemptLimit = 1;
        lesson2.attemptCount = 1;
      }
      activityTree.currentActivity = lesson1;

      const result = service.flowSubprocess(lesson1, FlowSubprocessMode.FORWARD);

      expect(result).toMatchObject({
        identifiedActivity: lesson2,
        deliverable: false,
        exception: "SB.2.2-2",
        endSequencingSession: false,
      });
      expect(activityTree.currentActivity).toBe(lesson1);
      expect(root.isActive).toBe(true);
    });

    /** @spec SN Book: SB.2.2 steps 5.1, 6.3.3 - propagate a blocked descendant without retrying. */
    it.each(["disabled", "attempt limit"])(
      "should stop cluster descent at a child blocked by %s",
      (reason) => {
        const laterChild = new Activity("laterChild", "Later Child");
        chapter2.addChild(laterChild);
        if (reason === "disabled") {
          const rule = new SequencingRule(RuleActionType.DISABLED);
          rule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
          lesson3.sequencingRules.addPreConditionRule(rule);
        } else {
          lesson3.attemptLimit = 1;
          lesson3.attemptCount = 1;
        }

        const result = service.flowSubprocess(lesson2, FlowSubprocessMode.FORWARD);

        expect(result).toMatchObject({
          identifiedActivity: lesson3,
          deliverable: false,
          exception: "SB.2.2-2",
          endSequencingSession: false,
        });
      },
    );

    /** @spec SN Book: SB.2.2 step 5 precedes step 6 - check clusters before descending. */
    it("should stop at a disabled cluster before entering its available child", () => {
      const rule = new SequencingRule(RuleActionType.DISABLED);
      rule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      chapter2.sequencingRules.addPreConditionRule(rule);

      expect(service.flowSubprocess(lesson2, FlowSubprocessMode.FORWARD)).toMatchObject({
        identifiedActivity: chapter2,
        deliverable: false,
        exception: "SB.2.2-2",
        endSequencingSession: false,
      });
    });

    /** @spec SN Book: SB.2.2 steps 3, 5.1 - skip onward, then stop on a disabled candidate. */
    it("should preserve a blocked candidate after a skipped sibling", () => {
      const skip = new SequencingRule(RuleActionType.SKIP);
      skip.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      lesson2.sequencingRules.addPreConditionRule(skip);
      const disabled = new SequencingRule(RuleActionType.DISABLED);
      disabled.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      lesson3.sequencingRules.addPreConditionRule(disabled);

      expect(service.flowSubprocess(lesson1, FlowSubprocessMode.FORWARD)).toMatchObject({
        identifiedActivity: lesson3,
        deliverable: false,
        exception: "SB.2.2-2",
        endSequencingSession: false,
      });
    });

    /** @spec SN Book: SB.2.2 step 3 - only skip rules traverse onward past a candidate. */
    it("should skip a limit-violated sibling when its skip rule applies", () => {
      const skip = new SequencingRule(RuleActionType.SKIP);
      skip.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      lesson2.sequencingRules.addPreConditionRule(skip);
      lesson2.attemptLimit = 1;
      lesson2.attemptCount = 1;

      expect(service.flowSubprocess(lesson1, FlowSubprocessMode.FORWARD)).toMatchObject({
        identifiedActivity: lesson3,
        deliverable: true,
        exception: null,
        endSequencingSession: false,
      });
    });

    /** @spec SN Book: SB.2.2 step 5.1 - backward flow also stops at disabled candidates. */
    it("should preserve a blocked candidate in backward flow", () => {
      const disabled = new SequencingRule(RuleActionType.DISABLED);
      disabled.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      lesson2.sequencingRules.addPreConditionRule(disabled);

      expect(service.flowSubprocess(lesson3, FlowSubprocessMode.BACKWARD)).toMatchObject({
        identifiedActivity: lesson2,
        deliverable: false,
        exception: "SB.2.2-2",
        endSequencingSession: false,
      });
    });
  });

  describe("checkActivityProcess", () => {
    it("should return true for available, visible leaf activity", () => {
      expect(service.checkActivityProcess(lesson1)).toBe(true);
    });

    it("should return false for unavailable activity", () => {
      lesson1.isAvailable = false;
      expect(service.checkActivityProcess(lesson1)).toBe(false);
    });

    it("should allow an invisible leaf through flow navigation", () => {
      lesson1.isVisible = false;
      expect(service.checkActivityProcess(lesson1)).toBe(true);
    });

    it("should return false when attempt limit exceeded", () => {
      lesson1.attemptLimit = 1;
      lesson1.attemptCount = 1;
      expect(service.checkActivityProcess(lesson1)).toBe(false);
    });
  });

  describe("findFirstDeliverableActivity", () => {
    it("should find first deliverable child", () => {
      const result = service.findFirstDeliverableActivity(root);
      expect(result).toBe(lesson1);
    });

    /** @spec SN Book: SB.2.5 step 3.2; SB.2.2 steps 3, 5.1 - unavailability blocks; only Skip advances to another child. */
    it("should stop at an unavailable first child (SB.2.5 / SB.2.2)", () => {
      lesson1.isAvailable = false;

      const result = service.findFirstDeliverableActivity(chapter1);
      // @spec SN Book: SB.2.5 step 3.2; SB.2.2 step 3 - the old lesson2 expectation incorrectly walked past a blocked candidate.
      expect(result).toBeNull();
    });

    it("should return null when no deliverable children", () => {
      lesson1.isAvailable = false;
      lesson2.isAvailable = false;
      lesson3.isAvailable = false;

      const result = service.findFirstDeliverableActivity(root);
      expect(result).toBeNull();
    });
  });

  describe("canDeliver", () => {
    it("should return true for deliverable activity", () => {
      expect(service.canDeliver(lesson1)).toBe(true);
    });

    it("should return false for non-deliverable activity", () => {
      lesson1.isAvailable = false;
      expect(service.canDeliver(lesson1)).toBe(false);
    });
  });

  describe("ensureSelectionAndRandomization", () => {
    it("should not throw for activity without selection/randomization", () => {
      expect(() => service.ensureSelectionAndRandomization(chapter1)).not.toThrow();
    });
  });
});
