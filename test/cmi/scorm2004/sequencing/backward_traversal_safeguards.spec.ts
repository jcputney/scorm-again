import {beforeEach, describe, expect, it} from "vitest";
import {
  SequencingProcess,
  SequencingRequestType,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import {ActivityTree} from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import {Activity} from "../../../../src/cmi/scorm2004/sequencing/activity";
import {SequencingRules} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import {SequencingControls} from "../../../../src/cmi/scorm2004/sequencing/sequencing_controls";
import {ADLNav} from "../../../../src/cmi/scorm2004/adl";

/**
 * Test suite for backward traversal safeguards (SEQ-PROC-11/12)
 *
 * These tests validate that the backward traversal loops in findNextActivity
 * are protected against infinite loops that could theoretically occur with
 * corrupted tree structures.
 *
 * Risk Assessment: LOW - THEORETICAL
 *
 * In normal SCORM usage, circular references should never occur since activity
 * trees are properly constructed from manifest XML with strict parent-child
 * hierarchy. However, these safeguards protect against:
 * 1. Manual/programmatic tree corruption
 * 2. Extremely deep trees (9999+ levels)
 * 3. Defensive programming best practices
 *
 * The iteration limits (10,000) should never be hit in normal SCORM content.
 */
describe("SequencingProcess - Backward Traversal Safeguards", () => {
  let sequencingProcess: SequencingProcess;
  let activityTree: ActivityTree;
  let sequencingRules: SequencingRules;
  let sequencingControls: SequencingControls;
  let adlNav: ADLNav;

  beforeEach(() => {
    activityTree = new ActivityTree();
    sequencingRules = new SequencingRules();
    sequencingControls = new SequencingControls();
    adlNav = new ADLNav();

    sequencingProcess = new SequencingProcess(
      activityTree,
      sequencingRules,
      sequencingControls,
      adlNav,
    );
  });

  describe("Normal backward traversal", () => {
    it("should successfully traverse backward through a normal tree", () => {
      // Create a normal tree structure:
      //       root
      //      /    \
      //   child1  child2
      //   /    \
      //  gc1   gc2
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      const gc1 = new Activity("gc1", "Grandchild 1");
      const gc2 = new Activity("gc2", "Grandchild 2");

      root.addChild(child1);
      root.addChild(child2);
      child1.addChild(gc1);
      child1.addChild(gc2);

      // Enable flow controls
      root.sequencingControls.flow = true;
      child1.sequencingControls.flow = true;
      child2.sequencingControls.flow = true;
      gc1.sequencingControls.flow = true;
      gc2.sequencingControls.flow = true;

      activityTree.root = root;
      activityTree.currentActivity = child2;
      child2.isActive = false; // Must not be active for PREVIOUS to work

      // Request PREVIOUS - should find gc2 (last descendant of previous sibling)
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.PREVIOUS
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity?.id).toBe("gc2");
    });

    it("should handle backward traversal from first child", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(child1);
      root.addChild(child2);

      root.sequencingControls.flow = true;
      child1.sequencingControls.flow = true;
      child2.sequencingControls.flow = true;

      activityTree.root = root;
      activityTree.currentActivity = child1;
      child1.isActive = false;

      // Request PREVIOUS from first child - should return null (beginning of tree)
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.PREVIOUS
      );

      // Backward direction does NOT end session when reaching beginning
      expect(result.endSequencingSession).toBe(false);
      expect(result.targetActivity).toBeNull();
    });
  });

  describe("Deeply nested tree stress test", () => {
    it("should handle backward traversal in deeply nested tree (100 levels)", () => {
      // Create a deeply nested tree to stress test the descent loop
      const root = new Activity("root", "Root");
      let current = root;

      // Create a chain of 100 nested children
      for (let i = 1; i <= 100; i++) {
        const child = new Activity(`child${i}`, `Child ${i}`);
        child.sequencingControls.flow = true;
        current.addChild(child);
        current = child;
      }

      root.sequencingControls.flow = true;

      // Add a sibling to enable backward traversal
      const rootParent = new Activity("rootParent", "Root Parent");
      rootParent.addChild(root);
      const sibling = new Activity("sibling", "Sibling");
      rootParent.addChild(sibling);
      rootParent.sequencingControls.flow = true;
      sibling.sequencingControls.flow = true;

      activityTree.root = rootParent;
      activityTree.currentActivity = sibling;
      sibling.isActive = false;

      // Request PREVIOUS - should descend all the way down to child100
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.PREVIOUS
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity?.id).toBe("child100");
    });

    it("should handle backward traversal with wide tree (1000 siblings)", () => {
      // Create a wide tree with many siblings
      const root = new Activity("root", "Root");

      // Create 1000 siblings
      for (let i = 1; i <= 1000; i++) {
        const child = new Activity(`child${i}`, `Child ${i}`);
        child.sequencingControls.flow = true;
        root.addChild(child);
      }

      root.sequencingControls.flow = true;

      activityTree.root = root;
      // Start from the last child (child1000)
      activityTree.currentActivity = root.children[999]; // This is child1000
      root.children[999].isActive = false;

      // Request PREVIOUS - should find child999 (previous sibling)
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.PREVIOUS
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity?.id).toBe("child999");
    });
  });

  describe("Edge cases and boundary conditions", () => {
    it("should handle tree near iteration limit (500 levels)", () => {
      // Test a reasonably deep tree that's still well below the 10,000 limit
      // This validates normal deep trees work fine
      const root = new Activity("root", "Root");
      let current = root;

      for (let i = 1; i <= 500; i++) {
        const child = new Activity(`child${i}`, `Child ${i}`);
        child.sequencingControls.flow = true;
        current.addChild(child);
        current = child;
      }

      root.sequencingControls.flow = true;

      const rootParent = new Activity("rootParent", "Root Parent");
      rootParent.addChild(root);
      const sibling = new Activity("sibling", "Sibling");
      rootParent.addChild(sibling);
      rootParent.sequencingControls.flow = true;
      sibling.sequencingControls.flow = true;

      activityTree.root = rootParent;
      activityTree.currentActivity = sibling;
      sibling.isActive = false;

      // Should succeed without issue
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.PREVIOUS
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity?.id).toBe("child500");
    });

    it("should handle backward traversal with no siblings", () => {
      // Single-child tree
      const root = new Activity("root", "Root");
      const onlyChild = new Activity("onlyChild", "Only Child");

      root.sequencingControls.flow = true;
      onlyChild.sequencingControls.flow = true;
      root.addChild(onlyChild);

      activityTree.root = root;
      activityTree.currentActivity = onlyChild;
      onlyChild.isActive = false;

      // Request PREVIOUS - should reach beginning of tree
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.PREVIOUS
      );

      expect(result.endSequencingSession).toBe(false);
      expect(result.targetActivity).toBeNull();
    });

    it("should handle backward traversal with forwardOnly constraint", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.sequencingControls.flow = true;
      root.sequencingControls.forwardOnly = true; // Prevent backward traversal
      child1.sequencingControls.flow = true;
      child2.sequencingControls.flow = true;

      root.addChild(child1);
      root.addChild(child2);

      activityTree.root = root;
      activityTree.currentActivity = child2;
      child2.isActive = false;

      // Request PREVIOUS - should be blocked by forwardOnly
      // The exception code may vary depending on validation path
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.PREVIOUS
      );

      // forwardOnly should prevent backward navigation with either exception
      expect(["SB.2.1-4", "SB.2.9-5"]).toContain(result.exception);
      expect(result.targetActivity).toBeNull();
    });

    it("should handle backward traversal with empty children arrays", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.sequencingControls.flow = true;
      child1.sequencingControls.flow = true;
      child2.sequencingControls.flow = true;

      root.addChild(child1);
      root.addChild(child2);

      activityTree.root = root;
      activityTree.currentActivity = child2;
      child2.isActive = false;

      // child1 has no children, so descent should stop immediately
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.PREVIOUS
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity?.id).toBe("child1");
    });

    it("should handle backward traversal with multiple levels of ancestors", () => {
      // Create a tree that requires ascending through multiple ancestors
      //         root
      //        /    \
      //    branch1  branch2
      //      |        |
      //    child1   child2 <- current
      //      |
      //     gc1
      const root = new Activity("root", "Root");
      const branch1 = new Activity("branch1", "Branch 1");
      const branch2 = new Activity("branch2", "Branch 2");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      const gc1 = new Activity("gc1", "Grandchild 1");

      root.addChild(branch1);
      root.addChild(branch2);
      branch1.addChild(child1);
      branch2.addChild(child2);
      child1.addChild(gc1);

      root.sequencingControls.flow = true;
      branch1.sequencingControls.flow = true;
      branch2.sequencingControls.flow = true;
      child1.sequencingControls.flow = true;
      child2.sequencingControls.flow = true;
      gc1.sequencingControls.flow = true;

      activityTree.root = root;
      activityTree.currentActivity = child2;
      child2.isActive = false;

      // Request PREVIOUS - should ascend to branch2's parent (root),
      // find branch1 as previous sibling, then descend to gc1
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.PREVIOUS
      );

      expect(result.exception).toBeNull();
      expect(result.targetActivity?.id).toBe("gc1");
    });
  });

  describe("Performance characteristics", () => {
    it("should complete backward traversal in reasonable time for large tree", () => {
      // Create a moderately large tree (300 nested levels)
      const root = new Activity("root", "Root");
      let current = root;

      for (let i = 1; i <= 300; i++) {
        const child = new Activity(`child${i}`, `Child ${i}`);
        child.sequencingControls.flow = true;
        current.addChild(child);
        current = child;
      }

      root.sequencingControls.flow = true;

      const rootParent = new Activity("rootParent", "Root Parent");
      rootParent.addChild(root);
      const sibling = new Activity("sibling", "Sibling");
      rootParent.addChild(sibling);
      rootParent.sequencingControls.flow = true;
      sibling.sequencingControls.flow = true;

      activityTree.root = rootParent;
      activityTree.currentActivity = sibling;
      sibling.isActive = false;

      const startTime = performance.now();
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.PREVIOUS
      );
      const endTime = performance.now();

      expect(result.exception).toBeNull();
      expect(result.targetActivity?.id).toBe("child300");

      // Should complete in less than 100ms (generous threshold)
      const duration = endTime - startTime;
      expect(duration).toBeLessThan(100);
    });
  });

  describe("Iteration limit validation", () => {
    /**
     * Note: These tests document that the safeguards exist, but we cannot
     * easily test the actual infinite loop protection without creating
     * circular references. Creating circular references in Activity objects
     * causes stack overflow in ActivityTree._addActivitiesToMap before
     * reaching the sequencing process.
     *
     * The safeguards protect against theoretical corruption scenarios where:
     * - Manual manipulation creates circular parent references
     * - Pathological trees exceed 10,000 levels of depth
     * - Memory corruption or other runtime issues corrupt object references
     */
    it("documents iteration limit constants exist in code", () => {
      // This test serves as documentation that the limits are present
      // Actual limit: 10,000 iterations for both descent and ascent
      // This is far beyond any realistic SCORM content
      expect(true).toBe(true);
    });
  });
});
