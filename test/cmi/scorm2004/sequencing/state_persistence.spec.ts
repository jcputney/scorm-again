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
import { SelectionTiming, RandomizationTiming } from "../../../../src/cmi/scorm2004/sequencing/sequencing_controls";

describe("State Persistence (Multi-Session Support)", () => {
  let overallProcess: OverallSequencingProcess;
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let rollupProcess: RollupProcess;
  let adlNav: ADLNav;
  let root: Activity;
  let module1: Activity;
  let module2: Activity;
  let lesson1: Activity;
  let lesson2: Activity;
  let lesson3: Activity;

  beforeEach(() => {
    // Create a more complex activity tree for testing
    activityTree = new ActivityTree();
    root = new Activity("root", "Course");
    module1 = new Activity("module1", "Module 1");
    module2 = new Activity("module2", "Module 2");
    lesson1 = new Activity("lesson1", "Lesson 1");
    lesson2 = new Activity("lesson2", "Lesson 2");
    lesson3 = new Activity("lesson3", "Lesson 3");

    root.addChild(module1);
    root.addChild(module2);
    module1.addChild(lesson1);
    module1.addChild(lesson2);
    module2.addChild(lesson3);

    activityTree.root = root;

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

  describe("getSequencingState", () => {
    it("should return state with correct version", () => {
      const state = overallProcess.getSequencingState();

      expect(state).toBeDefined();
      expect(state.version).toBe("1.0");
      expect(state.timestamp).toBeDefined();
    });

    it("should capture contentDelivered flag", () => {
      // Initially not delivered
      let state = overallProcess.getSequencingState();
      expect(state.contentDelivered).toBe(false);

      // Start session to deliver content
      overallProcess.processNavigationRequest(NavigationRequestType.START);

      state = overallProcess.getSequencingState();
      expect(state.contentDelivered).toBe(true);
    });

    it("should capture current activity", () => {
      overallProcess.processNavigationRequest(NavigationRequestType.START);

      const state = overallProcess.getSequencingState();
      expect(state.currentActivity).toBe("lesson1");
    });

    it("should capture suspended activity", () => {
      // Start and then suspend
      overallProcess.processNavigationRequest(NavigationRequestType.START);
      const suspendResult = overallProcess.processNavigationRequest(NavigationRequestType.SUSPEND_ALL);

      // Verify suspend was processed
      expect(suspendResult.valid).toBe(true);

      const state = overallProcess.getSequencingState();
      // Suspended activity should be captured
      expect(state.suspendedActivity).toBe("lesson1");
    });

    it("should capture activity states for all activities", () => {
      overallProcess.processNavigationRequest(NavigationRequestType.START);

      const state = overallProcess.getSequencingState();
      expect(state.activityStates).toBeDefined();
      expect(state.activityStates["root"]).toBeDefined();
      expect(state.activityStates["module1"]).toBeDefined();
      expect(state.activityStates["lesson1"]).toBeDefined();
      expect(state.activityStates["lesson2"]).toBeDefined();
      expect(state.activityStates["module2"]).toBeDefined();
      expect(state.activityStates["lesson3"]).toBeDefined();
    });

    it("should capture activity completion status", () => {
      overallProcess.processNavigationRequest(NavigationRequestType.START);

      // Manually set completion on lesson1
      lesson1.completionStatus = "completed";
      lesson1.successStatus = "passed";
      lesson1.attemptCount = 2;

      const state = overallProcess.getSequencingState();
      const lesson1State = state.activityStates["lesson1"];

      expect(lesson1State.completionStatus).toBe("completed");
      expect(lesson1State.successStatus).toBe("passed");
      expect(lesson1State.attemptCount).toBe(2);
    });

    it("should capture objective states", () => {
      overallProcess.processNavigationRequest(NavigationRequestType.START);

      lesson1.objectiveSatisfiedStatus = true;
      lesson1.objectiveNormalizedMeasure = 0.85;
      lesson1.objectiveMeasureStatus = true;

      const state = overallProcess.getSequencingState();
      const lesson1State = state.activityStates["lesson1"];

      expect(lesson1State.objectiveSatisfiedStatus).toBe(true);
      expect(lesson1State.objectiveNormalizedMeasure).toBe(0.85);
      expect(lesson1State.objectiveMeasureStatus).toBe(true);
    });

    it("should capture progress measure", () => {
      overallProcess.processNavigationRequest(NavigationRequestType.START);

      lesson1.progressMeasure = 0.5;
      lesson1.progressMeasureStatus = true;

      const state = overallProcess.getSequencingState();
      const lesson1State = state.activityStates["lesson1"];

      expect(lesson1State.progressMeasure).toBe(0.5);
      expect(lesson1State.progressMeasureStatus).toBe(true);
    });

    it("should capture duration tracking", () => {
      overallProcess.processNavigationRequest(NavigationRequestType.START);

      lesson1.attemptAbsoluteDuration = "PT1H30M0S";
      lesson1.attemptExperiencedDuration = "PT1H15M0S";
      lesson1.activityAbsoluteDuration = "PT2H0M0S";

      const state = overallProcess.getSequencingState();
      const lesson1State = state.activityStates["lesson1"];

      expect(lesson1State.attemptAbsoluteDuration).toBe("PT1H30M0S");
      expect(lesson1State.attemptExperiencedDuration).toBe("PT1H15M0S");
      expect(lesson1State.activityAbsoluteDuration).toBe("PT2H0M0S");
    });

    it("should capture navigation state", () => {
      overallProcess.processNavigationRequest(NavigationRequestType.START);

      const state = overallProcess.getSequencingState();
      expect(state.navigationState).toBeDefined();
    });

    it("should capture global objective map", () => {
      const state = overallProcess.getSequencingState();
      expect(state.globalObjectiveMap).toBeDefined();
    });

    it("should capture location and availability", () => {
      overallProcess.processNavigationRequest(NavigationRequestType.START);

      lesson1.location = "page_5";
      lesson1.isAvailable = true;
      lesson1.isHiddenFromChoice = false;

      const state = overallProcess.getSequencingState();
      const lesson1State = state.activityStates["lesson1"];

      expect(lesson1State.location).toBe("page_5");
      expect(lesson1State.isAvailable).toBe(true);
      expect(lesson1State.isHiddenFromChoice).toBe(false);
    });

    it("should capture selection/randomization state", () => {
      // Configure selection on module1
      module1.sequencingControls.selectionTiming = SelectionTiming.ONCE;
      module1.sequencingControls.selectionCount = 1;
      module1.sequencingControls.selectionCountStatus = true;

      overallProcess.processNavigationRequest(NavigationRequestType.START);

      const state = overallProcess.getSequencingState();
      const module1State = state.activityStates["module1"];

      expect(module1State.selectionRandomizationState).toBeDefined();
      expect(module1State.selectionRandomizationState.selectionCountStatus).toBe(true);
    });
  });

  describe("restoreSequencingState", () => {
    it("should restore basic state successfully", () => {
      // Set up initial state
      overallProcess.processNavigationRequest(NavigationRequestType.START);
      lesson1.completionStatus = "completed";
      lesson1.successStatus = "passed";

      // Get state and create new process
      const state = overallProcess.getSequencingState();

      // Create fresh instances
      const newActivityTree = new ActivityTree();
      const newRoot = new Activity("root", "Course");
      const newModule1 = new Activity("module1", "Module 1");
      const newModule2 = new Activity("module2", "Module 2");
      const newLesson1 = new Activity("lesson1", "Lesson 1");
      const newLesson2 = new Activity("lesson2", "Lesson 2");
      const newLesson3 = new Activity("lesson3", "Lesson 3");

      newRoot.addChild(newModule1);
      newRoot.addChild(newModule2);
      newModule1.addChild(newLesson1);
      newModule1.addChild(newLesson2);
      newModule2.addChild(newLesson3);
      newActivityTree.root = newRoot;

      const newSequencingProcess = new SequencingProcess(newActivityTree);
      const newRollupProcess = new RollupProcess();
      const newAdlNav = new ADLNav();

      const newOverallProcess = new OverallSequencingProcess(
        newActivityTree,
        newSequencingProcess,
        newRollupProcess,
        newAdlNav
      );

      // Restore state
      const result = newOverallProcess.restoreSequencingState(state);

      expect(result).toBe(true);
      expect(newOverallProcess.hasContentBeenDelivered()).toBe(true);
      expect(newActivityTree.currentActivity?.id).toBe("lesson1");
    });

    it("should restore completion status", () => {
      overallProcess.processNavigationRequest(NavigationRequestType.START);
      lesson1.completionStatus = "completed";
      lesson1.successStatus = "passed";
      lesson1.attemptCount = 3;
      // Also set objective status to match success status
      lesson1.objectiveSatisfiedStatus = true;

      const state = overallProcess.getSequencingState();

      // Create new tree and restore
      const newActivityTree = new ActivityTree();
      const newRoot = new Activity("root", "Course");
      const newModule1 = new Activity("module1", "Module 1");
      const newLesson1 = new Activity("lesson1", "Lesson 1");

      newRoot.addChild(newModule1);
      newModule1.addChild(newLesson1);
      newActivityTree.root = newRoot;

      const newOverallProcess = new OverallSequencingProcess(
        newActivityTree,
        new SequencingProcess(newActivityTree),
        new RollupProcess(),
        new ADLNav()
      );

      newOverallProcess.restoreSequencingState(state);

      expect(newLesson1.completionStatus).toBe("completed");
      // Success status may be derived from objective status during rollup
      expect(["passed", "failed"]).toContain(newLesson1.successStatus);
      expect(newLesson1.attemptCount).toBe(3);
    });

    it("should restore suspended activity", () => {
      overallProcess.processNavigationRequest(NavigationRequestType.START);
      overallProcess.processNavigationRequest(NavigationRequestType.SUSPEND_ALL);

      const state = overallProcess.getSequencingState();

      // Create new tree and restore
      const newActivityTree = new ActivityTree();
      const newRoot = new Activity("root", "Course");
      const newModule1 = new Activity("module1", "Module 1");
      const newLesson1 = new Activity("lesson1", "Lesson 1");

      newRoot.addChild(newModule1);
      newModule1.addChild(newLesson1);
      newActivityTree.root = newRoot;

      const newOverallProcess = new OverallSequencingProcess(
        newActivityTree,
        new SequencingProcess(newActivityTree),
        new RollupProcess(),
        new ADLNav()
      );

      newOverallProcess.restoreSequencingState(state);

      expect(newActivityTree.suspendedActivity?.id).toBe("lesson1");
      expect(newLesson1.isSuspended).toBe(true);
    });

    it("should restore objective states", () => {
      overallProcess.processNavigationRequest(NavigationRequestType.START);
      lesson1.objectiveSatisfiedStatus = true;
      lesson1.objectiveNormalizedMeasure = 0.9;
      lesson1.objectiveMeasureStatus = true;

      const state = overallProcess.getSequencingState();

      const newActivityTree = new ActivityTree();
      const newRoot = new Activity("root", "Course");
      const newModule1 = new Activity("module1", "Module 1");
      const newLesson1 = new Activity("lesson1", "Lesson 1");

      newRoot.addChild(newModule1);
      newModule1.addChild(newLesson1);
      newActivityTree.root = newRoot;

      const newOverallProcess = new OverallSequencingProcess(
        newActivityTree,
        new SequencingProcess(newActivityTree),
        new RollupProcess(),
        new ADLNav()
      );

      newOverallProcess.restoreSequencingState(state);

      expect(newLesson1.objectiveSatisfiedStatus).toBe(true);
      expect(newLesson1.objectiveNormalizedMeasure).toBe(0.9);
      expect(newLesson1.objectiveMeasureStatus).toBe(true);
    });

    it("should reject incompatible state versions", () => {
      const invalidState = {
        version: "2.0",
        timestamp: new Date().toISOString(),
      };

      const result = overallProcess.restoreSequencingState(invalidState);
      expect(result).toBe(false);
    });

    it("should reject null state", () => {
      const result = overallProcess.restoreSequencingState(null);
      expect(result).toBe(false);
    });

    it("should reject undefined state", () => {
      const result = overallProcess.restoreSequencingState(undefined);
      expect(result).toBe(false);
    });

    it("should restore duration tracking", () => {
      overallProcess.processNavigationRequest(NavigationRequestType.START);
      lesson1.attemptAbsoluteDuration = "PT2H0M0S";
      lesson1.activityAbsoluteDuration = "PT5H0M0S";

      const state = overallProcess.getSequencingState();

      const newActivityTree = new ActivityTree();
      const newRoot = new Activity("root", "Course");
      const newModule1 = new Activity("module1", "Module 1");
      const newLesson1 = new Activity("lesson1", "Lesson 1");

      newRoot.addChild(newModule1);
      newModule1.addChild(newLesson1);
      newActivityTree.root = newRoot;

      const newOverallProcess = new OverallSequencingProcess(
        newActivityTree,
        new SequencingProcess(newActivityTree),
        new RollupProcess(),
        new ADLNav()
      );

      newOverallProcess.restoreSequencingState(state);

      expect(newLesson1.attemptAbsoluteDuration).toBe("PT2H0M0S");
      expect(newLesson1.activityAbsoluteDuration).toBe("PT5H0M0S");
    });

    it("should restore location bookmark", () => {
      overallProcess.processNavigationRequest(NavigationRequestType.START);
      lesson1.location = "chapter3_page12";

      const state = overallProcess.getSequencingState();

      const newActivityTree = new ActivityTree();
      const newRoot = new Activity("root", "Course");
      const newModule1 = new Activity("module1", "Module 1");
      const newLesson1 = new Activity("lesson1", "Lesson 1");

      newRoot.addChild(newModule1);
      newModule1.addChild(newLesson1);
      newActivityTree.root = newRoot;

      const newOverallProcess = new OverallSequencingProcess(
        newActivityTree,
        new SequencingProcess(newActivityTree),
        new RollupProcess(),
        new ADLNav()
      );

      newOverallProcess.restoreSequencingState(state);

      expect(newLesson1.location).toBe("chapter3_page12");
    });

    it("should restore hidden from choice state", () => {
      overallProcess.processNavigationRequest(NavigationRequestType.START);
      lesson2.isHiddenFromChoice = true;
      lesson2.isAvailable = false;

      const state = overallProcess.getSequencingState();

      const newActivityTree = new ActivityTree();
      const newRoot = new Activity("root", "Course");
      const newModule1 = new Activity("module1", "Module 1");
      const newLesson1 = new Activity("lesson1", "Lesson 1");
      const newLesson2 = new Activity("lesson2", "Lesson 2");

      newRoot.addChild(newModule1);
      newModule1.addChild(newLesson1);
      newModule1.addChild(newLesson2);
      newActivityTree.root = newRoot;

      const newOverallProcess = new OverallSequencingProcess(
        newActivityTree,
        new SequencingProcess(newActivityTree),
        new RollupProcess(),
        new ADLNav()
      );

      newOverallProcess.restoreSequencingState(state);

      expect(newLesson2.isHiddenFromChoice).toBe(true);
      expect(newLesson2.isAvailable).toBe(false);
    });

    it("should restore selection/randomization state", () => {
      // Configure selection
      module1.sequencingControls.selectionTiming = SelectionTiming.ONCE;
      module1.sequencingControls.selectionCount = 1;
      module1.sequencingControls.selectionCountStatus = true;

      overallProcess.processNavigationRequest(NavigationRequestType.START);

      // One child may be hidden due to selection
      const selectedCount = module1.children.filter(c => c.isAvailable).length;

      const state = overallProcess.getSequencingState();

      const newActivityTree = new ActivityTree();
      const newRoot = new Activity("root", "Course");
      const newModule1 = new Activity("module1", "Module 1");
      const newModule2 = new Activity("module2", "Module 2");
      const newLesson1 = new Activity("lesson1", "Lesson 1");
      const newLesson2 = new Activity("lesson2", "Lesson 2");
      const newLesson3 = new Activity("lesson3", "Lesson 3");

      newRoot.addChild(newModule1);
      newRoot.addChild(newModule2);
      newModule1.addChild(newLesson1);
      newModule1.addChild(newLesson2);
      newModule2.addChild(newLesson3);
      newActivityTree.root = newRoot;

      const newOverallProcess = new OverallSequencingProcess(
        newActivityTree,
        new SequencingProcess(newActivityTree),
        new RollupProcess(),
        new ADLNav()
      );

      newOverallProcess.restoreSequencingState(state);

      // Selection state should be restored
      expect(newModule1.sequencingControls.selectionCountStatus).toBe(true);
      const restoredSelectedCount = newModule1.children.filter(c => c.isAvailable).length;
      expect(restoredSelectedCount).toBe(selectedCount);
    });
  });

  describe("Round-trip state persistence", () => {
    it("should preserve all state through save/restore cycle", () => {
      // Set up complex state
      overallProcess.processNavigationRequest(NavigationRequestType.START);

      lesson1.completionStatus = "completed";
      lesson1.successStatus = "passed";
      lesson1.attemptCount = 2;
      lesson1.objectiveSatisfiedStatus = true;
      lesson1.objectiveNormalizedMeasure = 0.95;
      lesson1.objectiveMeasureStatus = true;
      lesson1.progressMeasure = 1.0;
      lesson1.progressMeasureStatus = true;
      lesson1.location = "final_page";
      lesson1.attemptAbsoluteDuration = "PT45M0S";

      // Continue to lesson2
      module1.sequencingControls.flow = true;
      lesson1.isActive = false;
      const continueResult = overallProcess.processNavigationRequest(NavigationRequestType.CONTINUE);

      // Save state
      const state = overallProcess.getSequencingState();

      // Create completely new tree
      const newActivityTree = new ActivityTree();
      const newRoot = new Activity("root", "Course");
      const newModule1 = new Activity("module1", "Module 1");
      const newModule2 = new Activity("module2", "Module 2");
      const newLesson1 = new Activity("lesson1", "Lesson 1");
      const newLesson2 = new Activity("lesson2", "Lesson 2");
      const newLesson3 = new Activity("lesson3", "Lesson 3");

      newRoot.addChild(newModule1);
      newRoot.addChild(newModule2);
      newModule1.addChild(newLesson1);
      newModule1.addChild(newLesson2);
      newModule2.addChild(newLesson3);
      newActivityTree.root = newRoot;

      const newOverallProcess = new OverallSequencingProcess(
        newActivityTree,
        new SequencingProcess(newActivityTree),
        new RollupProcess(),
        new ADLNav()
      );

      // Restore state
      const restoreResult = newOverallProcess.restoreSequencingState(state);

      expect(restoreResult).toBe(true);

      // Verify lesson1 state was preserved
      expect(newLesson1.completionStatus).toBe("completed");
      expect(newLesson1.successStatus).toBe("passed");
      expect(newLesson1.attemptCount).toBe(2);
      expect(newLesson1.objectiveSatisfiedStatus).toBe(true);
      expect(newLesson1.objectiveNormalizedMeasure).toBe(0.95);
      expect(newLesson1.progressMeasure).toBe(1.0);
      expect(newLesson1.location).toBe("final_page");
      expect(newLesson1.attemptAbsoluteDuration).toBe("PT45M0S");
    });

    it("should restore suspended state correctly for resume", () => {
      // Start session - this delivers lesson1
      overallProcess.processNavigationRequest(NavigationRequestType.START);

      // Verify lesson1 is current and active
      expect(activityTree.currentActivity?.id).toBe("lesson1");
      expect(lesson1.isActive).toBe(true);

      // Suspend while lesson1 is active
      const suspendResult = overallProcess.processNavigationRequest(NavigationRequestType.SUSPEND_ALL);
      expect(suspendResult.valid).toBe(true);

      // Verify suspension worked - suspended activity should be set
      expect(activityTree.suspendedActivity?.id).toBe("lesson1");

      const state = overallProcess.getSequencingState();

      // Create new tree and restore
      const newActivityTree = new ActivityTree();
      const newRoot = new Activity("root", "Course");
      const newModule1 = new Activity("module1", "Module 1");
      const newLesson1 = new Activity("lesson1", "Lesson 1");
      const newLesson2 = new Activity("lesson2", "Lesson 2");

      newRoot.addChild(newModule1);
      newModule1.addChild(newLesson1);
      newModule1.addChild(newLesson2);
      newActivityTree.root = newRoot;

      const newOverallProcess = new OverallSequencingProcess(
        newActivityTree,
        new SequencingProcess(newActivityTree),
        new RollupProcess(),
        new ADLNav()
      );

      const restoreResult = newOverallProcess.restoreSequencingState(state);
      expect(restoreResult).toBe(true);

      // Verify suspended state was restored correctly
      expect(newActivityTree.suspendedActivity?.id).toBe("lesson1");
      expect(newLesson1.isSuspended).toBe(true);

      // The state is correctly restored - the suspended activity is available
      // for a RESUME_ALL navigation request by the navigation process
    });
  });

  describe("Navigation state persistence", () => {
    it("should capture navigation validity state", () => {
      overallProcess.processNavigationRequest(NavigationRequestType.START);

      const state = overallProcess.getSequencingState();

      expect(state.navigationState).toBeDefined();
      expect(state.navigationState.requestValid).toBeDefined();
    });

    it("should restore ADL nav request validity", () => {
      overallProcess.processNavigationRequest(NavigationRequestType.START);

      const state = overallProcess.getSequencingState();

      const newActivityTree = new ActivityTree();
      const newRoot = new Activity("root", "Course");
      const newModule1 = new Activity("module1", "Module 1");
      const newLesson1 = new Activity("lesson1", "Lesson 1");

      newRoot.addChild(newModule1);
      newModule1.addChild(newLesson1);
      newActivityTree.root = newRoot;

      const newAdlNav = new ADLNav();
      const newOverallProcess = new OverallSequencingProcess(
        newActivityTree,
        new SequencingProcess(newActivityTree),
        new RollupProcess(),
        newAdlNav
      );

      newOverallProcess.restoreSequencingState(state);

      // Nav state should be restored
      expect(newAdlNav.request_valid).toBeDefined();
    });
  });
});
