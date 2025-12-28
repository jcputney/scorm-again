import { beforeEach, describe, expect, it } from "vitest";
import {
  FlowTraversalService
} from "../../../../../src/cmi/scorm2004/sequencing/traversal/flow_traversal_service";
import {
  RuleEvaluationEngine
} from "../../../../../src/cmi/scorm2004/sequencing/rules/rule_evaluation_engine";
import {
  FlowSubprocessMode
} from "../../../../../src/cmi/scorm2004/sequencing/rules/sequencing_request_types";
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
        const result = service.flowTreeTraversalSubprocess(
          root,
          FlowSubprocessMode.FORWARD,
          false
        );
        expect(result.activity).toBe(chapter1);
        expect(result.endSequencingSession).toBe(false);
      });

      it("should return next sibling when skipping children", () => {
        const result = service.flowTreeTraversalSubprocess(
          chapter1,
          FlowSubprocessMode.FORWARD,
          true
        );
        expect(result.activity).toBe(chapter2);
        expect(result.endSequencingSession).toBe(false);
      });

      it("should go to parent's next sibling when no next sibling", () => {
        const result = service.flowTreeTraversalSubprocess(
          lesson2,
          FlowSubprocessMode.FORWARD,
          true
        );
        expect(result.activity).toBe(chapter2);
        expect(result.endSequencingSession).toBe(false);
      });

      it("should set endSequencingSession when at last activity", () => {
        const result = service.flowTreeTraversalSubprocess(
          lesson3,
          FlowSubprocessMode.FORWARD,
          true
        );
        expect(result.activity).toBeNull();
        expect(result.endSequencingSession).toBe(true);
      });
    });

    describe("backward traversal", () => {
      it("should return previous sibling's last descendant", () => {
        const result = service.flowTreeTraversalSubprocess(
          lesson2,
          FlowSubprocessMode.BACKWARD
        );
        expect(result.activity).toBe(lesson1);
        expect(result.endSequencingSession).toBe(false);
      });

      it("should return null when at first activity", () => {
        const result = service.flowTreeTraversalSubprocess(
          lesson1,
          FlowSubprocessMode.BACKWARD
        );
        expect(result.activity).toBeNull();
        expect(result.endSequencingSession).toBe(false);
      });

      it("should return exception when forwardOnly is set", () => {
        chapter1.sequencingControls.forwardOnly = true;

        const result = service.flowTreeTraversalSubprocess(
          lesson2,
          FlowSubprocessMode.BACKWARD
        );
        expect(result.activity).toBeNull();
        expect(result.exception).toBe("SB.2.1-4");
      });

      it("should traverse from second chapter to last leaf of first chapter", () => {
        const result = service.flowTreeTraversalSubprocess(
          lesson3,
          FlowSubprocessMode.BACKWARD
        );
        expect(result.activity).toBe(lesson2);
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
        FlowSubprocessMode.FORWARD
      );
      expect(result).toBeNull();
    });

    it("should return null when activity is not available", () => {
      lesson1.isAvailable = false;

      const result = service.flowActivityTraversalSubprocess(
        lesson1,
        true,
        true,
        FlowSubprocessMode.FORWARD
      );
      expect(result).toBeNull();
    });

    it("should return null when stopForwardTraversal is set in forward mode", () => {
      lesson1.sequencingControls.stopForwardTraversal = true;

      const result = service.flowActivityTraversalSubprocess(
        lesson1,
        true,
        true,
        FlowSubprocessMode.FORWARD
      );
      expect(result).toBeNull();
    });

    it("should return leaf activity that can be delivered", () => {
      const result = service.flowActivityTraversalSubprocess(
        lesson1,
        true,
        true,
        FlowSubprocessMode.FORWARD
      );
      expect(result).toBe(lesson1);
    });

    it("should flow into cluster and find first deliverable child", () => {
      const result = service.flowActivityTraversalSubprocess(
        chapter1,
        true,
        true,
        FlowSubprocessMode.FORWARD
      );
      expect(result).toBe(lesson1);
    });

    it("should return null for invisible leaf activity", () => {
      lesson1.isVisible = false;

      const result = service.flowActivityTraversalSubprocess(
        lesson1,
        true,
        true,
        FlowSubprocessMode.FORWARD
      );
      expect(result).toBeNull();
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

  describe("checkActivityProcess", () => {
    it("should return true for available, visible leaf activity", () => {
      expect(service.checkActivityProcess(lesson1)).toBe(true);
    });

    it("should return false for unavailable activity", () => {
      lesson1.isAvailable = false;
      expect(service.checkActivityProcess(lesson1)).toBe(false);
    });

    it("should return false for invisible leaf activity", () => {
      lesson1.isVisible = false;
      expect(service.checkActivityProcess(lesson1)).toBe(false);
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

    it("should skip unavailable children", () => {
      lesson1.isAvailable = false;

      const result = service.findFirstDeliverableActivity(chapter1);
      expect(result).toBe(lesson2);
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
