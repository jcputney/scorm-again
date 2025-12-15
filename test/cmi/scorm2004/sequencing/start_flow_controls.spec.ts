import { describe, it, expect, beforeEach } from "vitest";
import {
  SequencingProcess,
  SequencingRequestType,
  DeliveryRequestType,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";

/**
 * Tests for GAP-15: START Sequencing Request Process Flow Control
 *
 * The START request should use flowActivityTraversalSubprocess() which respects
 * flow controls like:
 * - sequencingControls.flow = false (prevents traversal into children)
 * - sequencingControls.stopForwardTraversal = true (prevents forward traversal)
 */
describe("START Sequencing Request Process - Flow Controls (GAP-15)", () => {
  let sequencingProcess: SequencingProcess;
  let activityTree: ActivityTree;

  describe("Root with Flow Disabled", () => {
    it("should fail when root has flow=false (cannot traverse into children)", () => {
      // Setup
      activityTree = new ActivityTree();
      const root = new Activity("root", "Course");
      const lesson1 = new Activity("lesson1", "Lesson 1");

      root.addChild(lesson1);
      root.sequencingControls.flow = false; // Flow disabled at root
      activityTree.root = root;

      sequencingProcess = new SequencingProcess(activityTree);

      // Execute
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.START
      );

      // Verify - should fail because flow is disabled, cannot traverse into children
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.5-3"); // No activity available
      expect(result.targetActivity).toBeNull();
    });

    it("should succeed when root is a leaf with flow=false", () => {
      // Setup - single activity course where root is deliverable
      activityTree = new ActivityTree();
      const root = new Activity("root", "Single Activity");

      root.sequencingControls.flow = false; // Flow setting doesn't matter for leaf
      activityTree.root = root;

      sequencingProcess = new SequencingProcess(activityTree);

      // Execute
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.START
      );

      // Verify - should succeed because root itself is deliverable (leaf)
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(root);
      expect(result.exception).toBeNull();
    });
  });

  describe("Nested Clusters with Mixed Flow Settings", () => {
    it("should skip cluster when child cluster has flow=false", () => {
      // Setup
      activityTree = new ActivityTree();
      const root = new Activity("root", "Course");
      const module1 = new Activity("module1", "Module 1");
      const lesson1_1 = new Activity("lesson1_1", "Lesson 1.1");
      const module2 = new Activity("module2", "Module 2");
      const lesson2_1 = new Activity("lesson2_1", "Lesson 2.1");

      root.addChild(module1);
      root.addChild(module2);
      module1.addChild(lesson1_1);
      module2.addChild(lesson2_1);

      root.sequencingControls.flow = true;
      module1.sequencingControls.flow = false; // Disabled at module1
      module2.sequencingControls.flow = true;

      activityTree.root = root;

      sequencingProcess = new SequencingProcess(activityTree);

      // Execute
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.START
      );

      // Verify - should skip module1 (flow=false) and deliver lesson2_1
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("lesson2_1");
      expect(result.exception).toBeNull();
    });

    it("should fail when all modules have flow=false", () => {
      // Setup
      activityTree = new ActivityTree();
      const root = new Activity("root", "Course");
      const module1 = new Activity("module1", "Module 1");
      const lesson1_1 = new Activity("lesson1_1", "Lesson 1.1");
      const module2 = new Activity("module2", "Module 2");
      const lesson2_1 = new Activity("lesson2_1", "Lesson 2.1");

      root.addChild(module1);
      root.addChild(module2);
      module1.addChild(lesson1_1);
      module2.addChild(lesson2_1);

      root.sequencingControls.flow = true;
      module1.sequencingControls.flow = false; // Both modules disabled
      module2.sequencingControls.flow = false;

      activityTree.root = root;

      sequencingProcess = new SequencingProcess(activityTree);

      // Execute
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.START
      );

      // Verify - should fail because no deliverable activity available
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.5-3");
      expect(result.targetActivity).toBeNull();
    });

    it("should handle deeply nested flow control correctly", () => {
      // Setup - three levels deep
      activityTree = new ActivityTree();
      const root = new Activity("root", "Course");
      const module1 = new Activity("module1", "Module 1");
      const section1_1 = new Activity("section1_1", "Section 1.1");
      const lesson1_1_1 = new Activity("lesson1_1_1", "Lesson 1.1.1");
      const section1_2 = new Activity("section1_2", "Section 1.2");
      const lesson1_2_1 = new Activity("lesson1_2_1", "Lesson 1.2.1");

      root.addChild(module1);
      module1.addChild(section1_1);
      module1.addChild(section1_2);
      section1_1.addChild(lesson1_1_1);
      section1_2.addChild(lesson1_2_1);

      root.sequencingControls.flow = true;
      module1.sequencingControls.flow = true;
      section1_1.sequencingControls.flow = false; // Disabled at section level
      section1_2.sequencingControls.flow = true;

      activityTree.root = root;

      sequencingProcess = new SequencingProcess(activityTree);

      // Execute
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.START
      );

      // Verify - should skip section1_1 and deliver lesson1_2_1
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("lesson1_2_1");
      expect(result.exception).toBeNull();
    });
  });

  describe("stopForwardTraversal Flag", () => {
    it("should respect stopForwardTraversal on cluster activities", () => {
      // Setup
      activityTree = new ActivityTree();
      const root = new Activity("root", "Course");
      const module1 = new Activity("module1", "Module 1");
      const lesson1_1 = new Activity("lesson1_1", "Lesson 1.1");
      const module2 = new Activity("module2", "Module 2");
      const lesson2_1 = new Activity("lesson2_1", "Lesson 2.1");

      root.addChild(module1);
      root.addChild(module2);
      module1.addChild(lesson1_1);
      module2.addChild(lesson2_1);

      root.sequencingControls.flow = true;
      module1.sequencingControls.flow = true;
      module1.sequencingControls.stopForwardTraversal = true; // Stop at module1
      module2.sequencingControls.flow = true;

      activityTree.root = root;

      sequencingProcess = new SequencingProcess(activityTree);

      // Execute
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.START
      );

      // Verify - stopForwardTraversal should prevent traversal into module1's children
      // So it should skip module1 and go to module2
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("lesson2_1");
      expect(result.exception).toBeNull();
    });

    it("should fail when stopForwardTraversal blocks all activities", () => {
      // Setup
      activityTree = new ActivityTree();
      const root = new Activity("root", "Course");
      const module1 = new Activity("module1", "Module 1");
      const lesson1_1 = new Activity("lesson1_1", "Lesson 1.1");

      root.addChild(module1);
      module1.addChild(lesson1_1);

      root.sequencingControls.flow = true;
      module1.sequencingControls.flow = true;
      module1.sequencingControls.stopForwardTraversal = true; // Blocks traversal

      activityTree.root = root;

      sequencingProcess = new SequencingProcess(activityTree);

      // Execute
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.START
      );

      // Verify - should fail because stopForwardTraversal blocks access
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.5-3");
      expect(result.targetActivity).toBeNull();
    });
  });

  describe("Normal Flow (Baseline - Ensure Backward Compatibility)", () => {
    it("should work normally with default flow settings (flow=true)", () => {
      // Setup
      activityTree = new ActivityTree();
      const root = new Activity("root", "Course");
      const module1 = new Activity("module1", "Module 1");
      const lesson1_1 = new Activity("lesson1_1", "Lesson 1.1");

      root.addChild(module1);
      module1.addChild(lesson1_1);

      root.sequencingControls.flow = true;
      module1.sequencingControls.flow = true;

      activityTree.root = root;

      sequencingProcess = new SequencingProcess(activityTree);

      // Execute
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.START
      );

      // Verify - should traverse to lesson1_1 as normal
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("lesson1_1");
      expect(result.exception).toBeNull();
    });

    it("should handle multiple children with flow=true", () => {
      // Setup
      activityTree = new ActivityTree();
      const root = new Activity("root", "Course");
      const lesson1 = new Activity("lesson1", "Lesson 1");
      const lesson2 = new Activity("lesson2", "Lesson 2");
      const lesson3 = new Activity("lesson3", "Lesson 3");

      root.addChild(lesson1);
      root.addChild(lesson2);
      root.addChild(lesson3);

      root.sequencingControls.flow = true;

      activityTree.root = root;

      sequencingProcess = new SequencingProcess(activityTree);

      // Execute
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.START
      );

      // Verify - should deliver first available lesson
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("lesson1");
      expect(result.exception).toBeNull();
    });
  });

  describe("Selection and Randomization Still Works", () => {
    it("should still apply randomization when enabled", () => {
      // Setup
      activityTree = new ActivityTree();
      const root = new Activity("root", "Course");
      const lesson1 = new Activity("lesson1", "Lesson 1");
      const lesson2 = new Activity("lesson2", "Lesson 2");
      const lesson3 = new Activity("lesson3", "Lesson 3");

      root.addChild(lesson1);
      root.addChild(lesson2);
      root.addChild(lesson3);

      root.sequencingControls.flow = true;
      root.sequencingControls.randomizeChildren = true;

      activityTree.root = root;

      sequencingProcess = new SequencingProcess(activityTree);

      // Execute
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.START
      );

      // Verify - should deliver one of the lessons (may be randomized)
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBeTruthy();
      expect([lesson1, lesson2, lesson3]).toContain(result.targetActivity);
      expect(result.exception).toBeNull();
    });

    it("should work with normal sequential children", () => {
      // Setup - just verify sequential works (selection/randomization is complex)
      activityTree = new ActivityTree();
      const root = new Activity("root", "Course");
      const lesson1 = new Activity("lesson1", "Lesson 1");
      const lesson2 = new Activity("lesson2", "Lesson 2");
      const lesson3 = new Activity("lesson3", "Lesson 3");
      const lesson4 = new Activity("lesson4", "Lesson 4");

      root.addChild(lesson1);
      root.addChild(lesson2);
      root.addChild(lesson3);
      root.addChild(lesson4);

      root.sequencingControls.flow = true;

      activityTree.root = root;

      sequencingProcess = new SequencingProcess(activityTree);

      // Execute
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.START
      );

      // Verify - should deliver one of the lessons
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBeTruthy();
      expect([lesson1, lesson2, lesson3, lesson4]).toContain(result.targetActivity);
      expect(result.exception).toBeNull();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty cluster (cluster with no available children)", () => {
      // Setup
      activityTree = new ActivityTree();
      const root = new Activity("root", "Course");
      const module1 = new Activity("module1", "Module 1");
      const lesson1_1 = new Activity("lesson1_1", "Lesson 1.1");

      root.addChild(module1);
      module1.addChild(lesson1_1);

      root.sequencingControls.flow = true;
      module1.sequencingControls.flow = true;
      lesson1_1.isAvailable = false; // Only child unavailable

      activityTree.root = root;

      sequencingProcess = new SequencingProcess(activityTree);

      // Execute
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.START
      );

      // Verify - should fail because no available activity
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.5-3");
      expect(result.targetActivity).toBeNull();
    });

    it("should deliver leaf activity regardless of flow control setting", () => {
      // Setup - a leaf activity that has flow control enabled
      // Per SCORM 2004, the 'flow' control is only relevant for controlling navigation
      // through a parent's children. For leaf activities, 'flow' is meaningless.
      activityTree = new ActivityTree();
      const root = new Activity("root", "Course");
      const leafActivity = new Activity("leafActivity", "Leaf Module");

      root.addChild(leafActivity);
      // leafActivity has no children - flow control is irrelevant for leaves
      leafActivity.sequencingControls.flow = true;

      root.sequencingControls.flow = true;

      activityTree.root = root;

      sequencingProcess = new SequencingProcess(activityTree);

      // Execute
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.START
      );

      // Verify - leaf activity should be deliverable regardless of flow setting
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("leafActivity");
    });

    it("should find first available when some activities are unavailable", () => {
      // Setup
      activityTree = new ActivityTree();
      const root = new Activity("root", "Course");
      const lesson1 = new Activity("lesson1", "Lesson 1");
      const lesson2 = new Activity("lesson2", "Lesson 2");
      const lesson3 = new Activity("lesson3", "Lesson 3");

      root.addChild(lesson1);
      root.addChild(lesson2);
      root.addChild(lesson3);

      root.sequencingControls.flow = true;
      lesson1.isAvailable = false;
      lesson2.isAvailable = false;
      // Only lesson3 is available

      activityTree.root = root;

      sequencingProcess = new SequencingProcess(activityTree);

      // Execute
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.START
      );

      // Verify - should deliver lesson3 (first available)
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("lesson3");
      expect(result.exception).toBeNull();
    });
  });
});
