import { beforeEach, describe, expect, it } from "vitest";

import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { SequencingProcess } from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import {
  NavigationRequestType,
  OverallSequencingProcess,
  SequencingRequestType
} from "../../../../src/cmi/scorm2004/sequencing/overall_sequencing_process";

/**
 * GAP-08: CONTINUE/PREVIOUS Missing Activity Active Check
 * Tests that CONTINUE and PREVIOUS navigation requests only include a termination
 * request when the current activity is active.
 * Per NB.2.1 Step 3.2.1 (CONTINUE) and Step 4.2.1.1 (PREVIOUS).
 */
describe("GAP-08: CONTINUE/PREVIOUS Activity Active Check", () => {
  let root: Activity;
  let parent: Activity;
  let activity1: Activity;
  let activity2: Activity;
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let rollupProcess: RollupProcess;
  let overall: OverallSequencingProcess;

  beforeEach(() => {
    root = new Activity("root", "Root");
    parent = new Activity("parent", "Parent");
    activity1 = new Activity("activity1", "Activity 1");
    activity2 = new Activity("activity2", "Activity 2");

    parent.addChild(activity1);
    parent.addChild(activity2);
    root.addChild(parent);

    // Enable flow control for CONTINUE/PREVIOUS
    parent.sequencingControls.flow = true;
    parent.sequencingControls.forwardOnly = false;

    root.initialize();

    activityTree = new ActivityTree(root);
    sequencingProcess = new SequencingProcess(activityTree);
    rollupProcess = new RollupProcess();
    overall = new OverallSequencingProcess(activityTree, sequencingProcess, rollupProcess);
  });

  describe("CONTINUE Navigation Request", () => {
    it("should return EXIT termination when current activity is active", () => {
      // Setup: activity1 is current and active
      activity1.isActive = true;
      activityTree.currentActivity = activity1;

      // Process CONTINUE navigation
      const result = overall.processNavigationRequest(NavigationRequestType.CONTINUE);

      // Should include EXIT termination because activity is active
      expect(result.valid).toBe(true);
      expect(result.exception).toBeNull();
    });

    it("should return null termination when current activity is not active", () => {
      // Setup: activity1 is current but NOT active (already terminated)
      activity1.isActive = false;
      activityTree.currentActivity = activity1;

      // Process CONTINUE navigation
      const result = overall.processNavigationRequest(NavigationRequestType.CONTINUE);

      // Should NOT include termination because activity is already inactive
      expect(result.valid).toBe(true);
      expect(result.exception).toBeNull();
    });

    it("should fail when current activity is null", () => {
      // Setup: no current activity
      activityTree.currentActivity = null;

      // Process CONTINUE navigation
      const result = overall.processNavigationRequest(NavigationRequestType.CONTINUE);

      // Should fail with appropriate exception
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-4");
    });

    it("should fail when parent does not allow flow", () => {
      // Setup: activity1 is current and active, but parent has flow=false
      activity1.isActive = true;
      activityTree.currentActivity = activity1;
      parent.sequencingControls.flow = false;

      // Process CONTINUE navigation
      const result = overall.processNavigationRequest(NavigationRequestType.CONTINUE);

      // Should fail with flow exception
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-5");
    });
  });

  describe("PREVIOUS Navigation Request", () => {
    it("should return EXIT termination when current activity is active", () => {
      // Setup: activity2 is current and active
      activity2.isActive = true;
      activityTree.currentActivity = activity2;

      // Process PREVIOUS navigation
      const result = overall.processNavigationRequest(NavigationRequestType.PREVIOUS);

      // Should include EXIT termination because activity is active
      expect(result.valid).toBe(true);
      expect(result.exception).toBeNull();
    });

    it("should return null termination when current activity is not active", () => {
      // Setup: activity2 is current but NOT active (already terminated)
      activity2.isActive = false;
      activityTree.currentActivity = activity2;

      // Process PREVIOUS navigation
      const result = overall.processNavigationRequest(NavigationRequestType.PREVIOUS);

      // Should NOT include termination because activity is already inactive
      expect(result.valid).toBe(true);
      expect(result.exception).toBeNull();
    });

    it("should fail when current activity is null", () => {
      // Setup: no current activity
      activityTree.currentActivity = null;

      // Process PREVIOUS navigation
      const result = overall.processNavigationRequest(NavigationRequestType.PREVIOUS);

      // Should fail with appropriate exception
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-6");
    });

    it("should fail when parent does not allow flow", () => {
      // Setup: activity2 is current and active, but parent has flow=false
      activity2.isActive = true;
      activityTree.currentActivity = activity2;
      parent.sequencingControls.flow = false;

      // Process PREVIOUS navigation
      const result = overall.processNavigationRequest(NavigationRequestType.PREVIOUS);

      // Should fail with flow exception
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-7");
    });

    it("should fail when forward-only constraint is violated", () => {
      // Setup: activity2 is current and active, but parent has forwardOnly=true
      activity2.isActive = true;
      activityTree.currentActivity = activity2;
      parent.sequencingControls.forwardOnly = true;

      // Process PREVIOUS navigation
      const result = overall.processNavigationRequest(NavigationRequestType.PREVIOUS);

      // Should fail with forward-only exception
      expect(result.valid).toBe(false);
      expect(result.exception).not.toBeNull();
    });
  });

  describe("CHOICE Navigation Request (regression test)", () => {
    it("should return EXIT termination when current activity is active", () => {
      // Setup: activity1 is current and active
      activity1.isActive = true;
      activityTree.currentActivity = activity1;
      parent.sequencingControls.choice = true;
      activity2.sequencingControls.choice = true;

      // Process CHOICE navigation to activity2
      const result = overall.processNavigationRequest(NavigationRequestType.CHOICE, activity2.id);

      // Should include EXIT termination because current is active
      expect(result.valid).toBe(true);
      expect(result.targetActivity).toBe(activity2);
    });

    it("should return null termination when current activity is not active", () => {
      // Setup: activity1 is current but NOT active
      activity1.isActive = false;
      activityTree.currentActivity = activity1;
      parent.sequencingControls.choice = true;
      activity2.sequencingControls.choice = true;

      // Process CHOICE navigation to activity2
      const result = overall.processNavigationRequest(NavigationRequestType.CHOICE, activity2.id);

      // Should NOT include termination because current is inactive
      expect(result.valid).toBe(true);
      expect(result.targetActivity).toBe(activity2);
    });

    it("should handle null current activity gracefully", () => {
      // Setup: no current activity
      activityTree.currentActivity = null;
      parent.sequencingControls.choice = true;
      activity1.sequencingControls.choice = true;

      // Process CHOICE navigation to activity1
      const result = overall.processNavigationRequest(NavigationRequestType.CHOICE, activity1.id);

      // Should succeed without requiring termination
      expect(result.valid).toBe(true);
      expect(result.targetActivity).toBe(activity1);
    });
  });

  describe("Post-Condition Scenario", () => {
    it("should not attempt double termination after post-condition", () => {
      // Simulate scenario where activity was terminated by post-condition rule
      activity1.isActive = true;
      activityTree.currentActivity = activity1;

      // Simulate post-condition termination setting isActive to false
      // (In real scenario, this would happen via terminationRequestProcess)
      activity1.isActive = false;

      // Now learner clicks CONTINUE
      const result = overall.processNavigationRequest(NavigationRequestType.CONTINUE);

      // Should NOT include termination request (activity already terminated)
      expect(result.valid).toBe(true);
      expect(result.exception).toBeNull();
    });

    it("should not attempt double termination after explicit exit", () => {
      // Simulate scenario where activity was explicitly exited
      activity2.isActive = true;
      activityTree.currentActivity = activity2;

      // Simulate explicit termination setting isActive to false
      activity2.isActive = false;

      // Now learner clicks PREVIOUS
      const result = overall.processNavigationRequest(NavigationRequestType.PREVIOUS);

      // Should NOT include termination request (activity already terminated)
      expect(result.valid).toBe(true);
      expect(result.exception).toBeNull();
    });
  });

  describe("Edge Cases", () => {
    it("should handle suspended activity correctly for CONTINUE", () => {
      // Setup: activity is suspended (isActive=false, isSuspended=true)
      activity1.isActive = false;
      activity1.isSuspended = true;
      activityTree.currentActivity = activity1;

      // Process CONTINUE navigation
      const result = overall.processNavigationRequest(NavigationRequestType.CONTINUE);

      // Should NOT include termination (suspended activities are not active)
      expect(result.valid).toBe(true);
      expect(result.exception).toBeNull();
    });

    it("should handle root activity with no parent", () => {
      // Setup: root is current (no parent)
      root.isActive = true;
      activityTree.currentActivity = root;

      // Process CONTINUE navigation
      const result = overall.processNavigationRequest(NavigationRequestType.CONTINUE);

      // Should fail because root has no parent
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-5");
    });
  });
});
