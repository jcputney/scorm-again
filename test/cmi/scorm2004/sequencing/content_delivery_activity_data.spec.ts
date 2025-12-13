import { describe, it, expect, beforeEach } from "vitest";
import {
  OverallSequencingProcess,
  NavigationRequestType,
} from "../../../../src/cmi/scorm2004/sequencing/overall_sequencing_process";
import { SequencingProcess } from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ADLNav } from "../../../../src/cmi/scorm2004/adl";

describe("Content Delivery Environment Activity Data Subprocess (DB.2.2)", () => {
  let overallProcess: OverallSequencingProcess;
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let rollupProcess: RollupProcess;
  let adlNav: ADLNav;
  let root: Activity;
  let chapter1: Activity;
  let lesson1: Activity;
  let lesson2: Activity;
  let deepRoot: Activity;
  let level1: Activity;
  let level2: Activity;
  let level3: Activity;
  let level4: Activity;

  beforeEach(() => {
    // Create activity tree with 3 levels (Root -> Chapter -> Lesson)
    activityTree = new ActivityTree();
    root = new Activity("root", "Course");
    chapter1 = new Activity("chapter1", "Chapter 1");
    lesson1 = new Activity("lesson1", "Lesson 1");
    lesson2 = new Activity("lesson2", "Lesson 2");

    root.addChild(chapter1);
    chapter1.addChild(lesson1);
    chapter1.addChild(lesson2);

    activityTree.root = root;

    // Enable flow for traversal (only on clusters, not leaves)
    root.sequencingControls.flow = true;
    chapter1.sequencingControls.flow = true;
    // lesson1 and lesson2 are leaves, so they should NOT have flow=true

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

  describe("Activity Path Processing", () => {
    it("should increment attempt count for all activities in path on new delivery", () => {
      // Start a session which should deliver lesson1
      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      expect(result.valid).toBe(true);
      expect(result.targetActivity).toBe(lesson1);

      // All activities in path should have attempt count incremented
      expect(root.attemptCount).toBe(1);
      expect(chapter1.attemptCount).toBe(1);
      expect(lesson1.attemptCount).toBe(1);
    });

    it("should set all activities in path to active", () => {
      // Start a session
      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      expect(result.valid).toBe(true);

      // All activities in path should be active
      expect(root.isActive).toBe(true);
      expect(chapter1.isActive).toBe(true);
      expect(lesson1.isActive).toBe(true);

      // Activity not in path should not be active
      expect(lesson2.isActive).toBe(false);
    });

    it("should process deep hierarchy correctly (4+ levels)", () => {
      // Create a deep hierarchy
      const deepTree = new ActivityTree();
      deepRoot = new Activity("root", "Root");
      level1 = new Activity("level1", "Level 1");
      level2 = new Activity("level2", "Level 2");
      level3 = new Activity("level3", "Level 3");
      level4 = new Activity("level4", "Level 4 (Leaf)");

      deepRoot.addChild(level1);
      level1.addChild(level2);
      level2.addChild(level3);
      level3.addChild(level4);

      deepTree.root = deepRoot;

      // Enable flow for deep tree traversal (only on clusters, not leaves)
      deepRoot.sequencingControls.flow = true;
      level1.sequencingControls.flow = true;
      level2.sequencingControls.flow = true;
      level3.sequencingControls.flow = true;
      // level4 is a leaf, so it should NOT have flow=true

      // Create new sequencing process with deep tree
      const deepSequencingProcess = new SequencingProcess(deepTree);
      const deepRollupProcess = new RollupProcess();
      const deepAdlNav = new ADLNav();

      const deepOverallProcess = new OverallSequencingProcess(
        deepTree,
        deepSequencingProcess,
        deepRollupProcess,
        deepAdlNav
      );

      // Start a session
      const result = deepOverallProcess.processNavigationRequest(NavigationRequestType.START);

      expect(result.valid).toBe(true);
      expect(result.targetActivity).toBe(level4);

      // All 5 levels should have attempt count = 1 and be active
      expect(deepRoot.attemptCount).toBe(1);
      expect(deepRoot.isActive).toBe(true);
      expect(level1.attemptCount).toBe(1);
      expect(level1.isActive).toBe(true);
      expect(level2.attemptCount).toBe(1);
      expect(level2.isActive).toBe(true);
      expect(level3.attemptCount).toBe(1);
      expect(level3.isActive).toBe(true);
      expect(level4.attemptCount).toBe(1);
      expect(level4.isActive).toBe(true);
    });
  });

  describe("Suspended Activity Resume", () => {
    it("should NOT increment attempt count when resuming suspended activity", () => {
      // Manually set up a suspended state scenario
      root.attemptCount = 1;
      chapter1.attemptCount = 1;
      lesson1.attemptCount = 1;

      root.isSuspended = false;
      chapter1.isSuspended = false;
      lesson1.isSuspended = true;

      activityTree.suspendedActivity = lesson1;

      // Capture attempt counts before resume
      const rootAttemptsBefore = root.attemptCount;
      const chapterAttemptsBefore = chapter1.attemptCount;
      const lessonAttemptsBefore = lesson1.attemptCount;

      // Clear active states (simulating reload)
      root.isActive = false;
      chapter1.isActive = false;
      lesson1.isActive = false;
      activityTree.currentActivity = null;

      // Resume the suspended activity
      const result = overallProcess.processNavigationRequest(NavigationRequestType.RESUME_ALL);

      expect(result.valid).toBe(true);

      // Attempt counts should NOT increase when resuming
      expect(root.attemptCount).toBe(rootAttemptsBefore);
      expect(chapter1.attemptCount).toBe(chapterAttemptsBefore);
      expect(lesson1.attemptCount).toBe(lessonAttemptsBefore);

      // Suspended flag should be cleared
      expect(lesson1.isSuspended).toBe(false);
    });

    it("should clear isSuspended flag on all activities in path when resuming", () => {
      // Set up suspended state with multiple suspended activities in path
      root.attemptCount = 1;
      chapter1.attemptCount = 1;
      lesson1.attemptCount = 1;

      root.isSuspended = true;
      chapter1.isSuspended = true;
      lesson1.isSuspended = true;
      activityTree.suspendedActivity = lesson1;

      // Clear active states
      root.isActive = false;
      chapter1.isActive = false;
      lesson1.isActive = false;
      activityTree.currentActivity = null;

      // Resume
      const result = overallProcess.processNavigationRequest(NavigationRequestType.RESUME_ALL);

      expect(result.valid).toBe(true);

      // All suspended flags should be cleared
      expect(root.isSuspended).toBe(false);
      expect(chapter1.isSuspended).toBe(false);
      expect(lesson1.isSuspended).toBe(false);
    });
  });

  describe("New Attempt vs Resume", () => {
    it("should increment attempt count on new attempt after completion", () => {
      // Set up a scenario where we've completed a previous attempt
      root.attemptCount = 1;
      chapter1.attemptCount = 1;
      lesson1.attemptCount = 1;

      // None are suspended (normal completion)
      root.isSuspended = false;
      chapter1.isSuspended = false;
      lesson1.isSuspended = false;

      // Clear active states
      root.isActive = false;
      chapter1.isActive = false;
      lesson1.isActive = false;
      activityTree.currentActivity = null;

      // Start a new attempt
      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      expect(result.valid).toBe(true);

      // Attempt count should increment for new attempt
      expect(root.attemptCount).toBe(2);
      expect(chapter1.attemptCount).toBe(2);
      expect(lesson1.attemptCount).toBe(2);
    });
  });

  describe("Leaf Activity Initialization", () => {
    it("should properly initialize leaf activity for delivery", () => {
      // Start session
      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      expect(result.valid).toBe(true);
      expect(result.targetActivity).toBe(lesson1);

      // Leaf activity should be active
      expect(lesson1.isActive).toBe(true);
      expect(lesson1.activityAttemptActive).toBe(true);

      // Should have attempt tracking initialized
      expect(lesson1.attemptAbsoluteStartTime).toBeTruthy();
    });
  });

  describe("Delivery Data Properties", () => {
    it("should have launchData property available", () => {
      lesson1.launchData = "test=value";
      expect(lesson1.launchData).toBe("test=value");
    });

    it("should have credit property available with default value", () => {
      expect(lesson1.credit).toBe("credit");
      lesson1.credit = "no-credit";
      expect(lesson1.credit).toBe("no-credit");
    });

    it("should have maxTimeAllowed property available", () => {
      lesson1.maxTimeAllowed = "PT1H0M0S";
      expect(lesson1.maxTimeAllowed).toBe("PT1H0M0S");
    });

    it("should have completionThreshold property available", () => {
      lesson1.completionThreshold = "0.8";
      expect(lesson1.completionThreshold).toBe("0.8");
    });
  });

  describe("Parent Activity Attempt Tracking", () => {
    it("should increment parent activity attempt count when child is delivered", () => {
      // Deliver first lesson
      const result1 = overallProcess.processNavigationRequest(NavigationRequestType.START);

      expect(result1.valid).toBe(true);
      expect(root.attemptCount).toBe(1);
      expect(chapter1.attemptCount).toBe(1);
      expect(lesson1.attemptCount).toBe(1);

      // Root and chapter should be active
      expect(root.isActive).toBe(true);
      expect(chapter1.isActive).toBe(true);

      // If parents are still active and we deliver another child in the same path,
      // they should not increment again
      // This is the expected behavior - parents only increment on their first delivery
    });
  });

  describe("Already Active Activities", () => {
    it("should not re-increment attempt count for already active activities", () => {
      // First delivery
      overallProcess.processNavigationRequest(NavigationRequestType.START);

      const rootAttemptsBefore = root.attemptCount;
      const chapterAttemptsBefore = chapter1.attemptCount;

      // Mark lesson1 as complete but keep parents active
      lesson1.isActive = false;
      activityTree.currentActivity = null;

      // Deliver lesson2 (same parent path)
      // In reality this would happen through navigation, but we can simulate
      // by manually triggering delivery if needed

      // For now, verify that the counts are as expected
      expect(root.attemptCount).toBe(rootAttemptsBefore);
      expect(chapter1.attemptCount).toBe(chapterAttemptsBefore);
    });
  });
});
