import { describe, it, expect, beforeEach } from "vitest";
import {
  SequencingProcess,
  SequencingRequestType,
  DeliveryRequestType,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { 
  RuleConditionType,
  RuleActionType,
  SequencingRule,
  RuleCondition,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";

describe("Flow Processes (SB.2.1, SB.2.2, SB.2.3)", () => {
  let sequencingProcess: SequencingProcess;
  let activityTree: ActivityTree;
  let root: Activity;
  let module1: Activity;
  let module2: Activity;
  let module3: Activity;
  let lesson1_1: Activity;
  let lesson1_2: Activity;
  let lesson2_1: Activity;
  let lesson2_2: Activity;
  let lesson3_1: Activity;

  beforeEach(() => {
    // Create a comprehensive activity tree
    activityTree = new ActivityTree();
    root = new Activity("root", "Course");
    module1 = new Activity("module1", "Module 1");
    module2 = new Activity("module2", "Module 2");
    module3 = new Activity("module3", "Module 3");
    lesson1_1 = new Activity("lesson1_1", "Lesson 1.1");
    lesson1_2 = new Activity("lesson1_2", "Lesson 1.2");
    lesson2_1 = new Activity("lesson2_1", "Lesson 2.1");
    lesson2_2 = new Activity("lesson2_2", "Lesson 2.2");
    lesson3_1 = new Activity("lesson3_1", "Lesson 3.1");

    // Build tree structure
    root.addChild(module1);
    root.addChild(module2);
    root.addChild(module3);
    module1.addChild(lesson1_1);
    module1.addChild(lesson1_2);
    module2.addChild(lesson2_1);
    module2.addChild(lesson2_2);
    module3.addChild(lesson3_1);
    
    activityTree.root = root;

    // Enable flow by default (only on clusters, not leaves)
    root.sequencingControls.flow = true;
    root.sequencingControls.choice = true;
    module1.sequencingControls.flow = true;
    module2.sequencingControls.flow = true;
    module3.sequencingControls.flow = true;
    // Leaves should NOT have flow=true (GAP-15)

    sequencingProcess = new SequencingProcess(activityTree);
  });

  describe("Flow Tree Traversal Subprocess (SB.2.1)", () => {
    describe("Forward traversal", () => {
      it("should traverse to first child when entering cluster", () => {
        const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);
        
        expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
        expect(result.targetActivity).toBe(lesson1_1);
      });

      it("should traverse to next sibling", () => {
        activityTree.currentActivity = lesson1_1;
        lesson1_1.isActive = false;
        
        const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);
        
        expect(result.targetActivity).toBe(lesson1_2);
      });

      it("should traverse from last child to parent's sibling", () => {
        activityTree.currentActivity = lesson1_2;
        lesson1_2.isActive = false;
        
        const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);
        
        expect(result.targetActivity).toBe(lesson2_1); // First child of next module
      });

      it("should traverse to end of tree", () => {
        activityTree.currentActivity = lesson3_1;
        lesson3_1.isActive = false;
        
        const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);
        
        expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
        expect(result.exception).toBe("SB.2.7-2"); // No activity available
      });
    });

    describe("Backward traversal", () => {
      it("should traverse to previous sibling", () => {
        activityTree.currentActivity = lesson1_2;
        lesson1_2.isActive = false;
        
        const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.PREVIOUS);
        
        expect(result.targetActivity).toBe(lesson1_1);
      });

      it("should traverse to last child of previous parent sibling", () => {
        activityTree.currentActivity = lesson2_1;
        lesson2_1.isActive = false;
        
        const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.PREVIOUS);
        
        expect(result.targetActivity).toBe(lesson1_2); // Last child of previous module
      });

      it("should traverse to beginning of tree", () => {
        activityTree.currentActivity = lesson1_1;
        lesson1_1.isActive = false;

        const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.PREVIOUS);

        expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
        // GAP-22: More specific exception code SB.2.1-3 (reached beginning) takes precedence over SB.2.8-2
        expect(result.exception).toBe("SB.2.1-3"); // Reached beginning of course
      });

      it("should respect forwardOnly control", () => {
        module1.sequencingControls.forwardOnly = true;
        activityTree.currentActivity = lesson1_2;
        lesson1_2.isActive = false;

        const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.PREVIOUS);

        expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
        // Enhanced multi-level forwardOnly validation returns SB.2.9-5 (correct per SCORM spec)
        expect(result.exception).toBe("SB.2.9-5");
      });
    });
  });

  describe("Flow Activity Traversal Subprocess (SB.2.2)", () => {
    it("should check activity availability", () => {
      lesson1_2.isAvailable = false;
      activityTree.currentActivity = lesson1_1;
      lesson1_1.isActive = false;
      
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);
      
      // Should skip unavailable activity
      expect(result.targetActivity).toBe(lesson2_1);
    });

    it("should check flow control", () => {
      module1.sequencingControls.flow = false;
      activityTree.currentActivity = lesson1_1;
      lesson1_1.isActive = false;
      
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);
      
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should check limit conditions", () => {
      lesson1_2.attemptLimit = 1;
      lesson1_2.attemptCount = 1; // Limit exceeded
      activityTree.currentActivity = lesson1_1;
      lesson1_1.isActive = false;
      
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);
      
      // Should skip activity with exceeded limits
      expect(result.targetActivity).toBe(lesson2_1);
    });

    it("should check pre-condition rules", () => {
      // Add skip pre-condition rule
      const skipRule = new SequencingRule(RuleActionType.SKIP);
      skipRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      lesson1_2.sequencingRules.addPreConditionRule(skipRule);
      
      activityTree.currentActivity = lesson1_1;
      lesson1_1.isActive = false;
      
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);
      
      // Should skip activity with skip rule
      expect(result.targetActivity).toBe(lesson2_1);
    });

    it("should handle disabled activities", () => {
      // Add disabled pre-condition rule
      const disabledRule = new SequencingRule(RuleActionType.DISABLED);
      disabledRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));
      lesson1_2.sequencingRules.addPreConditionRule(disabledRule);
      
      activityTree.currentActivity = lesson1_1;
      lesson1_1.isActive = false;
      
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);
      
      // Should skip disabled activity
      expect(result.targetActivity).toBe(lesson2_1);
    });

    it("should flow into clusters to find deliverable leaf", () => {
      // Start should flow through root → module1 → lesson1_1
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);
      
      expect(result.targetActivity).toBe(lesson1_1);
      expect(result.targetActivity?.children.length).toBe(0); // Confirm it's a leaf
    });
  });

  describe("Flow Subprocess (SB.2.3)", () => {
    it("should coordinate tree and activity traversal forward", () => {
      // Test complete forward flow through multiple activities
      activityTree.currentActivity = lesson1_1;
      lesson1_1.isActive = false;
      
      // First continue
      let result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);
      expect(result.targetActivity).toBe(lesson1_2);
      
      // Second continue (cross module boundary)
      activityTree.currentActivity = lesson1_2;
      lesson1_2.isActive = false;
      result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);
      expect(result.targetActivity).toBe(lesson2_1);
    });

    it("should coordinate tree and activity traversal backward", () => {
      // Test complete backward flow
      activityTree.currentActivity = lesson2_1;
      lesson2_1.isActive = false;
      
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.PREVIOUS);
      expect(result.targetActivity).toBe(lesson1_2);
    });

    it("should handle complex skip patterns", () => {
      // Skip multiple activities
      lesson1_2.isAvailable = false;
      lesson2_1.isAvailable = false;
      
      activityTree.currentActivity = lesson1_1;
      lesson1_1.isActive = false;
      
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);
      expect(result.targetActivity).toBe(lesson2_2);
    });

    it("should handle all activities unavailable", () => {
      // Make all activities unavailable
      lesson1_1.isAvailable = false;
      lesson1_2.isAvailable = false;
      lesson2_1.isAvailable = false;
      lesson2_2.isAvailable = false;
      lesson3_1.isAvailable = false;
      
      activityTree.currentActivity = null;
      
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.5-3");
    });
  });

  describe("Selection and Randomization during flow", () => {
    beforeEach(() => {
      // Enable selection for module1
      module1.sequencingControls.selectCount = 1; // Only select 1 child
      module1.sequencingControls.selectionTiming = "onEachNewAttempt";
    });

    it("should respect selection during flow", () => {
      // This should trigger selection when flowing into module1
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);
      
      // Should deliver one of the module1 children
      expect([lesson1_1, lesson1_2]).toContain(result.targetActivity);
    });

    it("should respect randomization during flow", () => {
      // Enable randomization
      module1.sequencingControls.randomizeChildren = true;
      module1.sequencingControls.randomizationTiming = "onEachNewAttempt";
      
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);
      
      // Should deliver one of the randomized children
      expect([lesson1_1, lesson1_2]).toContain(result.targetActivity);
    });
  });

  describe("Edge cases and error conditions", () => {
    it("should deliver leaf activities regardless of flow control setting", () => {
      // Create a leaf activity (no children) - per SCORM 2004, the 'flow' control
      // is only relevant for controlling navigation through a parent's children.
      // For leaf activities, the 'flow' setting is meaningless.
      const leafModule = new Activity("leaf", "Leaf Module");
      root.addChild(leafModule);
      // Even with flow=true, this is still a leaf since it has no children
      leafModule.sequencingControls.flow = true;

      // Try to flow into the leaf module
      activityTree.currentActivity = lesson3_1;
      lesson3_1.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);

      // Leaf activities should be deliverable regardless of flow setting
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("leaf");
    });

    it("should handle circular references gracefully", () => {
      // This shouldn't happen in valid trees, but test defensive coding
      activityTree.currentActivity = lesson3_1;
      lesson3_1.isActive = false;
      
      // Continue from last activity
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);
      
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBeDefined();
    });

    it("should handle deeply nested structures", () => {
      // Create deeper nesting
      const subLesson = new Activity("sub1", "Sub Lesson");
      const subSubLesson = new Activity("sub2", "Sub Sub Lesson");
      // When we add children to lesson1_1, it becomes a cluster and needs flow
      lesson1_1.sequencingControls.flow = true; // Now a cluster
      subLesson.sequencingControls.flow = true; // Cluster
      // subSubLesson is a leaf, should NOT have flow=true
      lesson1_1.addChild(subLesson);
      subLesson.addChild(subSubLesson);

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);

      // Should flow all the way down to leaf
      expect(result.targetActivity).toBe(subSubLesson);
    });
  });

  describe("Flow control modes", () => {
    it("should respect flow=false at different levels", () => {
      // Disable flow at root
      root.sequencingControls.flow = false;
      activityTree.currentActivity = lesson1_1;
      
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);
      
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.7-1"); // Current activity not terminated
    });

    it("should handle mixed flow controls", () => {
      // Disable flow for module2 only
      module2.sequencingControls.flow = false;
      
      activityTree.currentActivity = lesson1_2;
      lesson1_2.isActive = false;
      
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);
      
      // Should skip module2 entirely and go to module3
      expect(result.targetActivity).toBe(lesson3_1);
    });

    it("should handle forwardOnly at different levels", () => {
      // Set forwardOnly at module level
      module2.sequencingControls.forwardOnly = true;
      
      activityTree.currentActivity = lesson2_2;
      lesson2_2.isActive = false;
      
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.PREVIOUS);
      
      // Should not be able to go back within module2
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });
  });
});