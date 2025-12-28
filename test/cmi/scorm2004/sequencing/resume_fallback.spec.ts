import { beforeEach, describe, expect, it } from "vitest";
import {
  NavigationRequestType,
  OverallSequencingProcess
} from "../../../../src/cmi/scorm2004/sequencing/overall_sequencing_process";
import { SequencingProcess } from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ADLNav } from "../../../../src/cmi/scorm2004/adl";

describe("Resume Fallback Behavior (REQ-4.2.3)", () => {
  let overallProcess: OverallSequencingProcess;
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let rollupProcess: RollupProcess;
  let adlNav: ADLNav;
  let root: Activity;
  let child1: Activity;
  let child2: Activity;
  let grandchild1: Activity;
  let grandchild2: Activity;

  beforeEach(() => {
    // Create activity tree
    activityTree = new ActivityTree();
    root = new Activity("root", "Course");
    child1 = new Activity("module1", "Module 1");
    child2 = new Activity("module2", "Module 2");
    grandchild1 = new Activity("lesson1", "Lesson 1");
    grandchild2 = new Activity("lesson2", "Lesson 2");

    root.addChild(child1);
    root.addChild(child2);
    child1.addChild(grandchild1);
    child1.addChild(grandchild2);

    activityTree.root = root;

    // Enable flow for traversal (only on clusters, not leaves)
    root.sequencingControls.flow = true;
    child1.sequencingControls.flow = true;

    // Initialize sequencing components
    sequencingProcess = new SequencingProcess(activityTree);
    rollupProcess = new RollupProcess();
    adlNav = new ADLNav();

    overallProcess = new OverallSequencingProcess(
      activityTree,
      sequencingProcess,
      rollupProcess,
      adlNav
    );
  });

  describe("RESUME_ALL fails gracefully when no suspended activity exists", () => {
    it("should return invalid result with NB.2.1-3 exception when no suspended activity", () => {
      // Arrange: No suspended activity, no current activity (fresh session)
      activityTree.suspendedActivity = null;
      activityTree.currentActivity = null;

      // Act: Attempt RESUME_ALL
      const result = overallProcess.processNavigationRequest(
        NavigationRequestType.RESUME_ALL
      );

      // Assert: Should fail gracefully with appropriate exception
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-3");
      expect(result.targetActivity).toBeNull();
    });

    it("should not modify activity tree state when RESUME_ALL fails", () => {
      // Arrange: Clean tree state
      activityTree.suspendedActivity = null;
      activityTree.currentActivity = null;
      const initialCurrentActivity = activityTree.currentActivity;
      const initialSuspendedActivity = activityTree.suspendedActivity;

      // Act: Attempt RESUME_ALL (should fail)
      overallProcess.processNavigationRequest(NavigationRequestType.RESUME_ALL);

      // Assert: Activity tree state should remain unchanged
      expect(activityTree.currentActivity).toBe(initialCurrentActivity);
      expect(activityTree.suspendedActivity).toBe(initialSuspendedActivity);
    });

    it("should allow START navigation after failed RESUME_ALL", () => {
      // Arrange: No suspended activity
      activityTree.suspendedActivity = null;
      activityTree.currentActivity = null;

      // Act: RESUME_ALL fails, then START succeeds
      const resumeResult = overallProcess.processNavigationRequest(
        NavigationRequestType.RESUME_ALL
      );
      const startResult = overallProcess.processNavigationRequest(
        NavigationRequestType.START
      );

      // Assert: RESUME_ALL should fail, START should succeed
      expect(resumeResult.valid).toBe(false);
      expect(resumeResult.exception).toBe("NB.2.1-3");
      expect(startResult.valid).toBe(true);
      expect(startResult.targetActivity).toBe(grandchild1); // Should deliver first leaf
    });

    it("should fail even if activities are available but not suspended", () => {
      // Arrange: Activities exist and are available, but none are suspended
      activityTree.suspendedActivity = null;
      activityTree.currentActivity = null;
      grandchild1.isAvailable = true;
      grandchild2.isAvailable = true;

      // Act: Attempt RESUME_ALL
      const result = overallProcess.processNavigationRequest(
        NavigationRequestType.RESUME_ALL
      );

      // Assert: Should still fail with no suspended activity
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-3");
    });
  });

  describe("RESUME_ALL succeeds when suspended activity exists", () => {
    it("should successfully resume when suspended activity is set", () => {
      // Arrange: Set up suspended activity
      grandchild1.isSuspended = true;
      activityTree.suspendedActivity = grandchild1;
      activityTree.currentActivity = null;

      // Act: Attempt RESUME_ALL
      const result = overallProcess.processNavigationRequest(
        NavigationRequestType.RESUME_ALL
      );

      // Assert: Should succeed and target the suspended activity
      expect(result.valid).toBe(true);
      expect(result.targetActivity).toBe(grandchild1);
      expect(result.exception).toBeNull();
    });

    it("should clear suspended state after successful resume", () => {
      // Arrange: Set up suspended activity with full ancestor path
      grandchild1.isSuspended = true;
      child1.isSuspended = true;
      root.isSuspended = true;
      activityTree.suspendedActivity = grandchild1;
      activityTree.currentActivity = null;

      // Act: Resume the suspended activity
      const result = overallProcess.processNavigationRequest(
        NavigationRequestType.RESUME_ALL
      );

      // Assert: Should succeed and clear suspended state from all ancestors
      expect(result.valid).toBe(true);
      expect(grandchild1.isSuspended).toBe(false);
      expect(child1.isSuspended).toBe(false);
      expect(root.isSuspended).toBe(false);
      expect(activityTree.suspendedActivity).toBeNull();
    });

    it("should resume to correct activity in multi-branch tree", () => {
      // Arrange: Suspend activity in second branch
      grandchild2.isSuspended = true;
      child1.isSuspended = true;
      root.isSuspended = true;
      activityTree.suspendedActivity = grandchild2;
      activityTree.currentActivity = null;

      // Act: Resume
      const result = overallProcess.processNavigationRequest(
        NavigationRequestType.RESUME_ALL
      );

      // Assert: Should resume to grandchild2, not grandchild1
      expect(result.valid).toBe(true);
      expect(result.targetActivity).toBe(grandchild2);
      expect(grandchild2.isSuspended).toBe(false);
    });

    it("should resume deep nested suspended activity", () => {
      // Arrange: Create deeper tree
      const deepTree = new ActivityTree();
      const level0 = new Activity("level0", "Level 0");
      const level1 = new Activity("level1", "Level 1");
      const level2 = new Activity("level2", "Level 2");
      const level3 = new Activity("level3", "Level 3");

      level0.addChild(level1);
      level1.addChild(level2);
      level2.addChild(level3);

      deepTree.root = level0;
      level0.sequencingControls.flow = true;
      level1.sequencingControls.flow = true;
      level2.sequencingControls.flow = true;

      // Suspend deep leaf
      level3.isSuspended = true;
      level2.isSuspended = true;
      level1.isSuspended = true;
      level0.isSuspended = true;
      deepTree.suspendedActivity = level3;
      deepTree.currentActivity = null;

      const deepProcess = new OverallSequencingProcess(
        deepTree,
        new SequencingProcess(deepTree),
        rollupProcess,
        adlNav
      );

      // Act: Resume
      const result = deepProcess.processNavigationRequest(
        NavigationRequestType.RESUME_ALL
      );

      // Assert: Should successfully resume deep activity
      expect(result.valid).toBe(true);
      expect(result.targetActivity).toBe(level3);
      expect(level3.isSuspended).toBe(false);
      expect(level2.isSuspended).toBe(false);
      expect(level1.isSuspended).toBe(false);
      expect(level0.isSuspended).toBe(false);
    });
  });

  describe("RESUME_ALL is rejected when current activity already exists", () => {
    it("should fail with NB.2.1-2 when current activity exists", () => {
      // Arrange: Both current and suspended activities exist
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      activityTree.suspendedActivity = grandchild2;
      grandchild2.isSuspended = true;

      // Act: Attempt RESUME_ALL
      const result = overallProcess.processNavigationRequest(
        NavigationRequestType.RESUME_ALL
      );

      // Assert: Should fail because current activity already exists
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-2");
    });

    it("should reject RESUME_ALL even if current activity is the suspended one", () => {
      // Arrange: Same activity is both current and suspended (edge case)
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      grandchild1.isSuspended = true;
      activityTree.suspendedActivity = grandchild1;

      // Act: Attempt RESUME_ALL
      const result = overallProcess.processNavigationRequest(
        NavigationRequestType.RESUME_ALL
      );

      // Assert: Should still fail - can't resume if current activity exists
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-2");
    });

    it("should not modify state when RESUME_ALL is rejected", () => {
      // Arrange: Both current and suspended activities exist
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      activityTree.suspendedActivity = grandchild2;
      grandchild2.isSuspended = true;

      const initialCurrentActivity = activityTree.currentActivity;
      const initialSuspendedActivity = activityTree.suspendedActivity;
      const initialGrandchild1Active = grandchild1.isActive;
      const initialGrandchild2Suspended = grandchild2.isSuspended;

      // Act: Attempt RESUME_ALL (should fail)
      overallProcess.processNavigationRequest(NavigationRequestType.RESUME_ALL);

      // Assert: All state should remain unchanged
      expect(activityTree.currentActivity).toBe(initialCurrentActivity);
      expect(activityTree.suspendedActivity).toBe(initialSuspendedActivity);
      expect(grandchild1.isActive).toBe(initialGrandchild1Active);
      expect(grandchild2.isSuspended).toBe(initialGrandchild2Suspended);
    });

    it("should fail even if current activity is not active", () => {
      // Arrange: Current activity exists but is not active
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = false; // Not active but still current
      activityTree.suspendedActivity = grandchild2;
      grandchild2.isSuspended = true;

      // Act: Attempt RESUME_ALL
      const result = overallProcess.processNavigationRequest(
        NavigationRequestType.RESUME_ALL
      );

      // Assert: Should still fail - presence of current activity is what matters
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-2");
    });
  });

  describe("Edge cases and error conditions", () => {
    it("should handle null currentActivity and null suspendedActivity", () => {
      // Arrange: Both are null
      activityTree.currentActivity = null;
      activityTree.suspendedActivity = null;

      // Act: Attempt RESUME_ALL
      const result = overallProcess.processNavigationRequest(
        NavigationRequestType.RESUME_ALL
      );

      // Assert: Should fail with no-suspended-activity exception
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-3");
    });

    it("should properly sequence SUSPEND_ALL followed by session restart and RESUME_ALL", () => {
      // Arrange: Start with active content
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;

      // Act: Suspend all
      const suspendResult = overallProcess.processNavigationRequest(
        NavigationRequestType.SUSPEND_ALL
      );

      // Verify suspend worked
      expect(suspendResult.valid).toBe(true);
      expect(grandchild1.isSuspended).toBe(true);
      expect(activityTree.suspendedActivity).toBe(grandchild1);

      // Simulate session termination (currentActivity cleared, but suspended remains)
      activityTree.currentActivity = null;

      // Act: Resume in new session
      const resumeResult = overallProcess.processNavigationRequest(
        NavigationRequestType.RESUME_ALL
      );

      // Assert: Should successfully resume
      expect(resumeResult.valid).toBe(true);
      expect(resumeResult.targetActivity).toBe(grandchild1);
      expect(grandchild1.isSuspended).toBe(false);
      expect(activityTree.suspendedActivity).toBeNull();
    });

    it("should maintain data integrity when switching between suspended activities", () => {
      // Arrange: Suspend first activity
      grandchild1.isSuspended = true;
      child1.isSuspended = true;
      root.isSuspended = true;
      activityTree.suspendedActivity = grandchild1;
      activityTree.currentActivity = null;

      // Act: Resume first activity
      const resume1 = overallProcess.processNavigationRequest(
        NavigationRequestType.RESUME_ALL
      );

      // Verify first resume
      expect(resume1.valid).toBe(true);
      expect(resume1.targetActivity).toBe(grandchild1);
      expect(grandchild1.isSuspended).toBe(false);

      // Now suspend second activity and verify first is not suspended
      activityTree.currentActivity = grandchild2;
      grandchild2.isActive = true;

      const suspend2 = overallProcess.processNavigationRequest(
        NavigationRequestType.SUSPEND_ALL
      );

      expect(suspend2.valid).toBe(true);
      expect(grandchild2.isSuspended).toBe(true);
      expect(grandchild1.isSuspended).toBe(false); // Should not be re-suspended
      expect(activityTree.suspendedActivity).toBe(grandchild2);

      // Simulate new session
      activityTree.currentActivity = null;

      // Resume second activity
      const resume2 = overallProcess.processNavigationRequest(
        NavigationRequestType.RESUME_ALL
      );

      expect(resume2.valid).toBe(true);
      expect(resume2.targetActivity).toBe(grandchild2);
      expect(grandchild2.isSuspended).toBe(false);
      expect(grandchild1.isSuspended).toBe(false);
    });
  });
});
