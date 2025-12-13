import { describe, it, expect, beforeEach } from "vitest";
import {
  SequencingProcess,
  SequencingRequestType,
  DeliveryRequestType,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";

/**
 * GAP-21: Flow Control Check Location and Logic Tests
 *
 * Tests for SB.2.2 Flow Activity Traversal Subprocess
 * Ensures flow control is checked before availability and incorrect logic is removed
 */
describe("GAP-21: Flow Control Check Location and Logic", () => {
  let sequencingProcess: SequencingProcess;
  let activityTree: ActivityTree;
  let root: Activity;

  beforeEach(() => {
    activityTree = new ActivityTree();
    root = new Activity("root", "Course");
    activityTree.root = root;
    sequencingProcess = new SequencingProcess(activityTree);
  });

  describe("Test 1: Flow control is checked before availability (SB.2.2 Step 1 before Step 2)", () => {
    it("should reject traversal when parent flow=false, even if activity is available", () => {
      // Setup: Parent with flow=false, available child
      const parent = new Activity("parent", "Parent Module");
      const child = new Activity("child", "Child Lesson");

      parent.addChild(child);
      root.addChild(parent);

      // Enable flow on root but disable on parent
      root.sequencingControls.flow = true;
      parent.sequencingControls.flow = false; // Parent blocks flow

      // Make child available
      child.hiddenFromChoice = false;

      // Try to start - should fail because parent.flow=false
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);

      // Should not deliver because flow control check (Step 1) fails before availability check (Step 2)
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.targetActivity).toBeNull();
    });

    it("should check flow control before availability for CONTINUE request", () => {
      // Setup: Two modules, first has flow enabled, second has flow disabled
      const module1 = new Activity("module1", "Module 1");
      const module2 = new Activity("module2", "Module 2");
      const lesson1 = new Activity("lesson1", "Lesson 1");
      const lesson2 = new Activity("lesson2", "Lesson 2");

      root.addChild(module1);
      root.addChild(module2);
      module1.addChild(lesson1);
      module2.addChild(lesson2);

      // Enable flow on root and module1, disable on module2
      root.sequencingControls.flow = true;
      module1.sequencingControls.flow = true;
      module2.sequencingControls.flow = false; // Blocks traversal

      // Make all activities available
      lesson1.hiddenFromChoice = false;
      lesson2.hiddenFromChoice = false;

      // Start at lesson1
      activityTree.currentActivity = lesson1;
      lesson1.isActive = false;

      // Try to continue - should fail when trying to enter module2
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);

      // Should not deliver because module2.flow=false blocks traversal
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });
  });

  describe("Test 2: Parent flow=false rejects traversal (returns null)", () => {
    it("should return null when parent has flow=false during forward traversal", () => {
      const parent = new Activity("parent", "Parent");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      parent.addChild(child1);
      parent.addChild(child2);
      root.addChild(parent);

      // Disable flow on parent
      root.sequencingControls.flow = true;
      parent.sequencingControls.flow = false;

      // Try to start
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.targetActivity).toBeNull();
    });

    it("should return null when parent has flow=false during backward traversal", () => {
      const module1 = new Activity("module1", "Module 1");
      const module2 = new Activity("module2", "Module 2");
      const lesson1 = new Activity("lesson1", "Lesson 1");
      const lesson2 = new Activity("lesson2", "Lesson 2");

      root.addChild(module1);
      root.addChild(module2);
      module1.addChild(lesson1);
      module2.addChild(lesson2);

      // Enable flow on root and module2, disable on module1
      root.sequencingControls.flow = true;
      module1.sequencingControls.flow = false; // Blocks backward traversal
      module2.sequencingControls.flow = true;

      // Start at lesson2
      activityTree.currentActivity = lesson2;
      lesson2.isActive = false;

      // Try to go to previous - should fail when trying to enter module1
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.PREVIOUS);

      // Should not deliver because module1.flow=false blocks traversal
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });
  });

  describe("Test 3: Unavailable activity is rejected after flow check passes", () => {
    it("should check availability (Step 2) after flow control passes (Step 1)", () => {
      const parent = new Activity("parent", "Parent");
      const child = new Activity("child", "Child");

      parent.addChild(child);
      root.addChild(parent);

      // Enable flow (Step 1 passes)
      root.sequencingControls.flow = true;
      parent.sequencingControls.flow = true;

      // Make child unavailable (Step 2 should fail)
      child.isAvailable = false;

      // Try to start
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);

      // Should not deliver because availability check fails
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should skip unavailable activities and find next available one", () => {
      const parent = new Activity("parent", "Parent");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      const child3 = new Activity("child3", "Child 3");

      parent.addChild(child1);
      parent.addChild(child2);
      parent.addChild(child3);
      root.addChild(parent);

      // Enable flow
      root.sequencingControls.flow = true;
      parent.sequencingControls.flow = true;

      // Make first two children unavailable
      child1.isAvailable = false;
      child2.isAvailable = false;
      child3.isAvailable = true;

      // Try to start
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);

      // Should deliver child3 (first available after flow check passes)
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(child3);
    });
  });

  describe("Test 4: Leaf activities with flow=false still work correctly", () => {
    it("should deliver leaf activity even when it has flow=false", () => {
      const parent = new Activity("parent", "Parent");
      const leaf = new Activity("leaf", "Leaf Lesson");

      parent.addChild(leaf);
      root.addChild(parent);

      // Enable flow on parent (allows traversal to child)
      root.sequencingControls.flow = true;
      parent.sequencingControls.flow = true;

      // Leaf has flow=false (correct per GAP-15 - leaves don't flow)
      leaf.sequencingControls.flow = false;

      // Try to start
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);

      // Should deliver the leaf successfully
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(leaf);
    });

    it("should allow multiple leaf activities with flow=false in same parent", () => {
      const parent = new Activity("parent", "Parent");
      const leaf1 = new Activity("leaf1", "Leaf 1");
      const leaf2 = new Activity("leaf2", "Leaf 2");

      parent.addChild(leaf1);
      parent.addChild(leaf2);
      root.addChild(parent);

      // Enable flow on parent
      root.sequencingControls.flow = true;
      parent.sequencingControls.flow = true;

      // Both leaves have flow=false (correct)
      leaf1.sequencingControls.flow = false;
      leaf2.sequencingControls.flow = false;

      // Try to start - should get first leaf
      const result1 = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);
      expect(result1.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result1.targetActivity).toBe(leaf1);

      // Complete first leaf and continue
      activityTree.currentActivity = leaf1;
      leaf1.isActive = false;

      const result2 = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);
      expect(result2.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result2.targetActivity).toBe(leaf2);
    });

    it("should not reject leaf activities based on their own flow setting", () => {
      // This test ensures the incorrect logic at line 747 is removed
      const parent = new Activity("parent", "Parent");
      const leaf = new Activity("leaf", "Leaf");

      parent.addChild(leaf);
      root.addChild(parent);

      // Enable flow on parent (what matters for traversal)
      root.sequencingControls.flow = true;
      parent.sequencingControls.flow = true;

      // Leaf has flow=false (its own setting should not block delivery)
      leaf.sequencingControls.flow = false;

      // Try to start
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);

      // OLD BUG: Would reject because leaf.sequencingControls.flow=false
      // FIXED: Should deliver because parent flow control allows it
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(leaf);
    });
  });

  describe("Test 5: Activities with no children handled properly", () => {
    it("should handle cluster that becomes empty after selection/randomization", () => {
      const parent = new Activity("parent", "Parent");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      parent.addChild(child1);
      parent.addChild(child2);
      root.addChild(parent);

      // Enable flow
      root.sequencingControls.flow = true;
      parent.sequencingControls.flow = true;

      // Make all children unavailable
      child1.isAvailable = false;
      child2.isAvailable = false;

      // Try to start - no children are available
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);

      // Should not deliver because there are no available children
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should skip cluster with all unavailable children and find next valid activity", () => {
      const module1 = new Activity("module1", "Module 1");
      const module2 = new Activity("module2", "Module 2");
      const child1_1 = new Activity("child1_1", "Child 1.1");
      const child2_1 = new Activity("child2_1", "Child 2.1");

      root.addChild(module1);
      root.addChild(module2);
      module1.addChild(child1_1);
      module2.addChild(child2_1);

      // Enable flow
      root.sequencingControls.flow = true;
      module1.sequencingControls.flow = true;
      module2.sequencingControls.flow = true;

      // Make module1's children unavailable
      child1_1.isAvailable = false;

      // Try to start
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);

      // Should skip module1 (no available children) and deliver child2_1
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(child2_1);
    });

    it("should deliver leaf activity with flow=false when it has no children", () => {
      // This verifies we don't reject valid leaf activities
      const parent = new Activity("parent", "Parent");
      const leaf = new Activity("leaf", "Leaf");

      parent.addChild(leaf);
      root.addChild(parent);

      // Enable flow on parent
      root.sequencingControls.flow = true;
      parent.sequencingControls.flow = true;

      // Leaf has flow=false and no children (normal leaf)
      leaf.sequencingControls.flow = false;

      // Try to start
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);

      // Should deliver the valid leaf
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(leaf);
    });
  });

  describe("Test 6: Valid activities still traverse correctly (regression)", () => {
    it("should deliver first leaf when all flow controls are enabled", () => {
      const module = new Activity("module", "Module");
      const lesson1 = new Activity("lesson1", "Lesson 1");
      const lesson2 = new Activity("lesson2", "Lesson 2");

      root.addChild(module);
      module.addChild(lesson1);
      module.addChild(lesson2);

      // Enable flow on clusters
      root.sequencingControls.flow = true;
      module.sequencingControls.flow = true;

      // Leaves don't have flow
      lesson1.sequencingControls.flow = false;
      lesson2.sequencingControls.flow = false;

      // Try to start
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(lesson1);
    });

    it("should support CONTINUE navigation through multiple lessons", () => {
      const module = new Activity("module", "Module");
      const lesson1 = new Activity("lesson1", "Lesson 1");
      const lesson2 = new Activity("lesson2", "Lesson 2");
      const lesson3 = new Activity("lesson3", "Lesson 3");

      root.addChild(module);
      module.addChild(lesson1);
      module.addChild(lesson2);
      module.addChild(lesson3);

      // Enable flow
      root.sequencingControls.flow = true;
      module.sequencingControls.flow = true;

      // Start at lesson1
      const result1 = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);
      expect(result1.targetActivity).toBe(lesson1);

      // Continue to lesson2
      activityTree.currentActivity = lesson1;
      lesson1.isActive = false;
      const result2 = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);
      expect(result2.targetActivity).toBe(lesson2);

      // Continue to lesson3
      activityTree.currentActivity = lesson2;
      lesson2.isActive = false;
      const result3 = sequencingProcess.sequencingRequestProcess(SequencingRequestType.CONTINUE);
      expect(result3.targetActivity).toBe(lesson3);
    });

    it("should support nested clusters with proper flow control", () => {
      const section1 = new Activity("section1", "Section 1");
      const module1_1 = new Activity("module1_1", "Module 1.1");
      const lesson1_1_1 = new Activity("lesson1_1_1", "Lesson 1.1.1");

      root.addChild(section1);
      section1.addChild(module1_1);
      module1_1.addChild(lesson1_1_1);

      // Enable flow on all clusters
      root.sequencingControls.flow = true;
      section1.sequencingControls.flow = true;
      module1_1.sequencingControls.flow = true;

      // Try to start - should traverse through all clusters to leaf
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(lesson1_1_1);
    });

    it("should handle PREVIOUS navigation correctly", () => {
      const module = new Activity("module", "Module");
      const lesson1 = new Activity("lesson1", "Lesson 1");
      const lesson2 = new Activity("lesson2", "Lesson 2");

      root.addChild(module);
      module.addChild(lesson1);
      module.addChild(lesson2);

      // Enable flow
      root.sequencingControls.flow = true;
      module.sequencingControls.flow = true;

      // Start at lesson2
      activityTree.currentActivity = lesson2;
      lesson2.isActive = false;

      // Go to previous
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.PREVIOUS);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(lesson1);
    });

    it("should handle complex tree with mixed availability", () => {
      const module1 = new Activity("module1", "Module 1");
      const module2 = new Activity("module2", "Module 2");
      const lesson1_1 = new Activity("lesson1_1", "Lesson 1.1");
      const lesson1_2 = new Activity("lesson1_2", "Lesson 1.2");
      const lesson2_1 = new Activity("lesson2_1", "Lesson 2.1");

      root.addChild(module1);
      root.addChild(module2);
      module1.addChild(lesson1_1);
      module1.addChild(lesson1_2);
      module2.addChild(lesson2_1);

      // Enable flow on all clusters
      root.sequencingControls.flow = true;
      module1.sequencingControls.flow = true;
      module2.sequencingControls.flow = true;

      // Make lesson1_1 unavailable
      lesson1_1.isAvailable = false;
      lesson1_2.isAvailable = true;
      lesson2_1.isAvailable = true;

      // Start should skip unavailable lesson1_1 and deliver lesson1_2
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(lesson1_2);
    });
  });

  describe("Edge Cases: Flow control check order verification", () => {
    it("should not check availability if flow control already failed", () => {
      // This test verifies the order: flow check happens first
      const parent = new Activity("parent", "Parent");
      const child = new Activity("child", "Child");

      parent.addChild(child);
      root.addChild(parent);

      // Disable flow on parent (Step 1 fails)
      root.sequencingControls.flow = true;
      parent.sequencingControls.flow = false;

      // Child is available by default (Step 2 would pass if checked)
      child.isAvailable = true;

      // Try to start
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);

      // Should fail at Step 1 (flow control), never reaching Step 2 (availability)
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.targetActivity).toBeNull();
    });

    it("should check flow control on parent, not on activity itself", () => {
      const grandparent = new Activity("grandparent", "Grandparent");
      const parent = new Activity("parent", "Parent");
      const child = new Activity("child", "Child");

      grandparent.addChild(parent);
      parent.addChild(child);
      root.addChild(grandparent);

      // Enable flow on root and grandparent
      root.sequencingControls.flow = true;
      grandparent.sequencingControls.flow = true;

      // Disable flow on parent (should block traversal to child)
      parent.sequencingControls.flow = false;

      // Child's own flow setting is irrelevant for this check
      child.sequencingControls.flow = false;

      // Try to start
      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.START);

      // Should not deliver because parent.flow=false blocks traversal to child
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });
  });
});
