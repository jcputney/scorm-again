// noinspection DuplicatedCode

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  OverallSequencingProcess,
  NavigationRequestType,
} from "../../../../src/cmi/scorm2004/sequencing/overall_sequencing_process";
import {
  SequencingProcess,
  SequencingRequestType,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ADLNav } from "../../../../src/cmi/scorm2004/adl";

/**
 * Tests for SCORM 2004 3rd Edition compliance requirement:
 * - REQ-NAV-025: Logout exit handling - treat cmi.exit="logout" as exitAll navigation request
 */
describe("Logout Exit Handling (REQ-NAV-025)", () => {
  let overallProcess: OverallSequencingProcess;
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let rollupProcess: RollupProcess;
  let adlNav: ADLNav;
  let root: Activity;
  let module1: Activity;
  let lesson1: Activity;
  let lesson2: Activity;

  beforeEach(() => {
    // Create activity tree
    activityTree = new ActivityTree();
    root = new Activity("root", "Course");
    module1 = new Activity("module1", "Module 1");
    lesson1 = new Activity("lesson1", "Lesson 1");
    lesson2 = new Activity("lesson2", "Lesson 2");

    root.addChild(module1);
    module1.addChild(lesson1);
    module1.addChild(lesson2);

    activityTree.root = root;

    // Enable flow for clusters
    root.sequencingControls.flow = true;
    module1.sequencingControls.flow = true;

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

  describe("cmi.exit='logout' triggers session end", () => {
    it("should treat logout exit as exitAll termination", () => {
      // Start session
      overallProcess.processNavigationRequest(NavigationRequestType.START);

      // Verify we have a current activity
      expect(activityTree.currentActivity).toBe(lesson1);

      // Process termination with logout exit
      const result = overallProcess.terminationRequestProcess(
        SequencingRequestType.EXIT,
        false,
        "logout"
      );

      // Should be treated as EXIT_ALL
      expect(result.valid).toBe(true);
      // Current activity should be cleared after exitAll
      expect(activityTree.currentActivity).toBe(null);
    });

    it("should clear current activity when logout is received", () => {
      // Set current activity to a leaf
      activityTree.currentActivity = lesson1;
      lesson1.isActive = true;

      // Process termination with logout
      overallProcess.terminationRequestProcess(
        SequencingRequestType.EXIT,
        false,
        "logout"
      );

      // Should have exited all - no current activity
      expect(activityTree.currentActivity).toBe(null);
    });

    it("should end session completely on logout", () => {
      activityTree.currentActivity = lesson1;
      lesson1.isActive = true;

      const result = overallProcess.terminationRequestProcess(
        SequencingRequestType.EXIT,
        false,
        "logout"
      );

      // Session should be completely ended
      expect(result.valid).toBe(true);
      expect(activityTree.currentActivity).toBe(null);
      // No suspended activity (unlike suspend)
      expect(activityTree.suspendedActivity).toBe(null);
    });
  });

  describe("logout vs other exit types", () => {
    it("should handle logout differently from normal exit", () => {
      activityTree.currentActivity = lesson1;
      lesson1.isActive = true;

      // Normal exit should not clear current activity (unless at root)
      const normalResult = overallProcess.terminationRequestProcess(
        SequencingRequestType.EXIT,
        false,
        "normal"
      );
      expect(normalResult.valid).toBe(true);

      // Reset for logout test
      activityTree.currentActivity = lesson1;
      lesson1.isActive = true;

      // Logout should clear everything
      const logoutResult = overallProcess.terminationRequestProcess(
        SequencingRequestType.EXIT,
        false,
        "logout"
      );
      expect(logoutResult.valid).toBe(true);
      expect(activityTree.currentActivity).toBe(null);
    });

    it("should handle logout differently from suspend", () => {
      activityTree.currentActivity = lesson1;
      lesson1.isActive = true;

      // Suspend should preserve state for resume
      overallProcess.terminationRequestProcess(
        SequencingRequestType.SUSPEND_ALL,
        false,
        "suspend"
      );

      const suspendedAfterSuspend = activityTree.suspendedActivity;
      expect(suspendedAfterSuspend).toBe(lesson1);

      // Reset for logout test
      activityTree.suspendedActivity = null;
      activityTree.currentActivity = lesson1;
      lesson1.isActive = true;

      // Logout should end session completely
      overallProcess.terminationRequestProcess(
        SequencingRequestType.EXIT,
        false,
        "logout"
      );

      expect(activityTree.currentActivity).toBe(null);
    });

    it("should handle empty exit type (normal termination)", () => {
      activityTree.currentActivity = lesson1;
      lesson1.isActive = true;

      // Empty exit type is normal exit
      const result = overallProcess.terminationRequestProcess(
        SequencingRequestType.EXIT,
        false,
        ""
      );

      expect(result.valid).toBe(true);
    });

    it("should handle time-out exit type", () => {
      activityTree.currentActivity = lesson1;
      lesson1.isActive = true;

      const result = overallProcess.terminationRequestProcess(
        SequencingRequestType.EXIT,
        false,
        "time-out"
      );

      expect(result.valid).toBe(true);
    });
  });

  describe("logout from different positions in tree", () => {
    it("should handle logout from first activity", () => {
      activityTree.currentActivity = lesson1;
      lesson1.isActive = true;

      overallProcess.terminationRequestProcess(
        SequencingRequestType.EXIT,
        false,
        "logout"
      );

      expect(activityTree.currentActivity).toBe(null);
    });

    it("should handle logout from middle activity", () => {
      // Navigate to second lesson
      activityTree.currentActivity = lesson2;
      lesson2.isActive = true;

      overallProcess.terminationRequestProcess(
        SequencingRequestType.EXIT,
        false,
        "logout"
      );

      expect(activityTree.currentActivity).toBe(null);
    });

    it("should handle logout from deeply nested activity", () => {
      // Create a deeper tree
      const subLesson = new Activity("sublesson1", "Sub Lesson 1");
      lesson1.addChild(subLesson);
      activityTree.root = root; // Refresh tree

      activityTree.currentActivity = subLesson;
      subLesson.isActive = true;

      overallProcess.terminationRequestProcess(
        SequencingRequestType.EXIT,
        false,
        "logout"
      );

      expect(activityTree.currentActivity).toBe(null);
    });
  });

  describe("data handling on logout", () => {
    it("should trigger rollup before logout exit", () => {
      const rollupSpy = vi.spyOn(rollupProcess, "overallRollupProcess");

      activityTree.currentActivity = lesson1;
      lesson1.isActive = true;

      overallProcess.terminationRequestProcess(
        SequencingRequestType.EXIT,
        false,
        "logout"
      );

      // Rollup should have been called
      expect(rollupSpy).toHaveBeenCalled();
    });

    it("should preserve completion status on logout", () => {
      activityTree.currentActivity = lesson1;
      lesson1.isActive = true;
      lesson1.completionStatus = "completed";

      overallProcess.terminationRequestProcess(
        SequencingRequestType.EXIT,
        false,
        "logout"
      );

      // Completion status should be preserved
      expect(lesson1.completionStatus).toBe("completed");
    });

    it("should preserve success status on logout", () => {
      activityTree.currentActivity = lesson1;
      lesson1.isActive = true;
      lesson1.successStatus = "passed";

      overallProcess.terminationRequestProcess(
        SequencingRequestType.EXIT,
        false,
        "logout"
      );

      // Success status should be preserved
      expect(lesson1.successStatus).toBe("passed");
    });
  });
});
