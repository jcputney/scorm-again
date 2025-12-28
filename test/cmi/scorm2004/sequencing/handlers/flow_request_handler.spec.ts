import { beforeEach, describe, expect, it } from "vitest";
import {
  FlowRequestHandler
} from "../../../../../src/cmi/scorm2004/sequencing/handlers/flow_request_handler";
import {
  FlowTraversalService
} from "../../../../../src/cmi/scorm2004/sequencing/traversal/flow_traversal_service";
import {
  RuleEvaluationEngine
} from "../../../../../src/cmi/scorm2004/sequencing/rules/rule_evaluation_engine";
import {
  DeliveryRequestType
} from "../../../../../src/cmi/scorm2004/sequencing/rules/sequencing_request_types";
import { Activity } from "../../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../../src/cmi/scorm2004/sequencing/activity_tree";

describe("FlowRequestHandler", () => {
  let activityTree: ActivityTree;
  let ruleEngine: RuleEvaluationEngine;
  let traversalService: FlowTraversalService;
  let handler: FlowRequestHandler;
  let root: Activity;
  let chapter1: Activity;
  let lesson1: Activity;
  let lesson2: Activity;

  beforeEach(() => {
    root = new Activity("root", "Root");
    chapter1 = new Activity("chapter1", "Chapter 1");
    lesson1 = new Activity("lesson1", "Lesson 1");
    lesson2 = new Activity("lesson2", "Lesson 2");

    root.addChild(chapter1);
    chapter1.addChild(lesson1);
    chapter1.addChild(lesson2);

    activityTree = new ActivityTree(root);
    ruleEngine = new RuleEvaluationEngine();
    traversalService = new FlowTraversalService(activityTree, ruleEngine);
    handler = new FlowRequestHandler(activityTree, traversalService);
  });

  describe("handleStart", () => {
    it("should return first deliverable activity", () => {
      const result = handler.handleStart();
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(lesson1);
    });

    it("should return exception when current activity exists", () => {
      activityTree.currentActivity = lesson1;
      const result = handler.handleStart();
      expect(result.exception).toBe("SB.2.5-2"); // SB.2.5-2: Session already begun
    });

    it("should return exception when no root", () => {
      activityTree.root = null;
      const result = handler.handleStart();
      expect(result.exception).toBe("SB.2.5-1"); // SB.2.5-1: No activity tree
    });

    it("should return exception when no deliverable activity", () => {
      lesson1.isAvailable = false;
      lesson2.isAvailable = false;
      const result = handler.handleStart();
      expect(result.exception).toBe("SB.2.5-3");
    });
  });

  describe("handleResumeAll", () => {
    it("should return suspended activity", () => {
      activityTree.suspendedActivity = lesson1;
      const result = handler.handleResumeAll();
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(lesson1);
    });

    it("should return exception when no suspended activity", () => {
      const result = handler.handleResumeAll();
      expect(result.exception).toBe("SB.2.6-1");
    });

    it("should return exception when current activity exists", () => {
      activityTree.suspendedActivity = lesson1;
      activityTree.currentActivity = lesson2;
      const result = handler.handleResumeAll();
      expect(result.exception).toBe("SB.2.6-2");
    });
  });

  describe("handleContinue", () => {
    it("should return next deliverable activity", () => {
      lesson1.isActive = false;
      const result = handler.handleContinue(lesson1);
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(lesson2);
    });

    it("should return exception when activity is still active", () => {
      lesson1.isActive = true;
      const result = handler.handleContinue(lesson1);
      expect(result.exception).toBe("SB.2.7-1");
    });

    it("should return exception when flow is disabled", () => {
      chapter1.sequencingControls.flow = false;
      lesson1.isActive = false;
      const result = handler.handleContinue(lesson1);
      expect(result.exception).toBe("SB.2.7-2");
    });

    it("should set endSequencingSession at end of course", () => {
      lesson2.isActive = false;
      const result = handler.handleContinue(lesson2);
      expect(result.endSequencingSession).toBe(true);
    });
  });

  describe("handlePrevious", () => {
    it("should return previous deliverable activity", () => {
      lesson2.isActive = false;
      const result = handler.handlePrevious(lesson2);
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(lesson1);
    });

    it("should return exception when activity is still active", () => {
      lesson2.isActive = true;
      const result = handler.handlePrevious(lesson2);
      expect(result.exception).toBe("SB.2.8-1");
    });

    it("should return exception when flow is disabled", () => {
      chapter1.sequencingControls.flow = false;
      lesson2.isActive = false;
      const result = handler.handlePrevious(lesson2);
      expect(result.exception).toBe("SB.2.8-2");
    });

    it("should return exception when forwardOnly is set", () => {
      chapter1.sequencingControls.forwardOnly = true;
      lesson2.isActive = false;
      const result = handler.handlePrevious(lesson2);
      expect(result.exception).toBe("SB.2.9-5");
    });

    it("should return exception when at beginning of course", () => {
      lesson1.isActive = false;
      const result = handler.handlePrevious(lesson1);
      expect(result.exception).toBe("SB.2.1-3");
    });
  });
});
