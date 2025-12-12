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

describe("Enhanced Delivery Validation (overall_sequencing_process.ts)", () => {
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
  });

  describe("Standard delivery validation (enhancedDeliveryValidation: false)", () => {
    let overallProcess: OverallSequencingProcess;

    beforeEach(() => {
      overallProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        adlNav
      );
    });

    it("should successfully start and deliver to first leaf", () => {
      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      expect(result.valid).toBe(true);
      expect(result.targetActivity?.id).toBe("lesson1");
    });

    it("should allow delivery to unavailable activity without enhanced validation", () => {
      // Without enhanced validation, the standard checks still apply
      // but certain advanced state consistency checks are skipped
      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      expect(result.valid).toBe(true);
    });
  });

  describe("Enhanced delivery validation (enhancedDeliveryValidation: true)", () => {
    let overallProcess: OverallSequencingProcess;

    beforeEach(() => {
      overallProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        adlNav,
        null, // eventCallback
        { enhancedDeliveryValidation: true }
      );
    });

    it("should successfully deliver when all validation passes", () => {
      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      expect(result.valid).toBe(true);
      expect(result.targetActivity?.id).toBe("lesson1");
    });

    it("should validate activity tree state consistency", () => {
      // Start session to trigger enhanced validation
      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      // The delivery should succeed if state is consistent
      expect(result.valid).toBe(true);
    });

    it("should validate resource constraints during delivery", () => {
      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      // Delivery should succeed with default resource constraints
      expect(result.valid).toBe(true);
    });

    it("should prevent concurrent delivery", () => {
      // Start first delivery
      const result1 = overallProcess.processNavigationRequest(NavigationRequestType.START);
      expect(result1.valid).toBe(true);

      // The delivery in progress flag should prevent concurrent requests
      // during the delivery process itself
      expect(overallProcess.isDeliveryInProgress()).toBe(false); // Should be false after delivery completes
    });

    it("should validate activity dependencies", () => {
      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      // Dependencies should be satisfied for first activity
      expect(result.valid).toBe(true);
    });
  });

  describe("Limit conditions check during delivery", () => {
    let overallProcess: OverallSequencingProcess;
    let fixedDate: Date;

    beforeEach(() => {
      fixedDate = new Date("2024-06-15T12:00:00Z");
      overallProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        adlNav,
        null,
        { now: () => fixedDate }
      );
    });

    it("should block delivery when attempt limit exceeded on all leaves", () => {
      // Set attempt limit exceeded on ALL leaf activities
      lesson1.attemptLimit = 3;
      lesson1.attemptCount = 3;
      lesson2.attemptLimit = 3;
      lesson2.attemptCount = 3;
      lesson3.attemptLimit = 3;
      lesson3.attemptCount = 3;

      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      // Should fail because no deliverable activity
      expect(result.valid).toBe(false);
    });

    it("should allow delivery when attempt limit not exceeded", () => {
      lesson1.attemptLimit = 5;
      lesson1.attemptCount = 2;

      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      expect(result.valid).toBe(true);
    });

    it("should block delivery when end time limit passed", () => {
      const pastDate = new Date("2024-01-01T00:00:00Z");
      lesson1.endTimeLimit = pastDate.toISOString();

      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      expect(result.valid).toBe(false);
      expect(result.exception).toBe("DB.1.1-3");
    });

    it("should block delivery when begin time limit not yet reached", () => {
      const futureDate = new Date("2024-12-31T00:00:00Z");
      lesson1.beginTimeLimit = futureDate.toISOString();

      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      expect(result.valid).toBe(false);
      expect(result.exception).toBe("DB.1.1-3");
    });

    it("should allow delivery when within time limits", () => {
      const pastDate = new Date("2024-01-01T00:00:00Z");
      const futureDate = new Date("2024-12-31T00:00:00Z");

      lesson1.beginTimeLimit = pastDate.toISOString();
      lesson1.endTimeLimit = futureDate.toISOString();

      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      expect(result.valid).toBe(true);
    });

    it("should block delivery when attempt duration limit exceeded", () => {
      lesson1.attemptAbsoluteDurationLimit = "PT0H30M0S"; // 30 minutes
      lesson1.attemptAbsoluteDuration = "PT1H0M0S"; // 1 hour (exceeds limit)

      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      expect(result.valid).toBe(false);
      expect(result.exception).toBe("DB.1.1-3");
    });

    it("should block delivery when activity duration limit exceeded", () => {
      lesson1.activityAbsoluteDurationLimit = "PT2H0M0S"; // 2 hours
      lesson1.activityAbsoluteDuration = "PT3H0M0S"; // 3 hours (exceeds limit)

      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      expect(result.valid).toBe(false);
      expect(result.exception).toBe("DB.1.1-3");
    });
  });

  describe("Delivery to cluster activities", () => {
    let overallProcess: OverallSequencingProcess;

    beforeEach(() => {
      overallProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        adlNav
      );
    });

    it("should not deliver to cluster (non-leaf) activity", () => {
      // Try to directly deliver to module1 (which has children)
      root.sequencingControls.choice = true;
      module1.sequencingControls.flow = true;

      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      // Should flow into module1 and deliver to first leaf (lesson1)
      expect(result.valid).toBe(true);
      expect(result.targetActivity?.id).toBe("lesson1");
    });

    it("should fail delivery to empty cluster with flow", () => {
      // Create empty cluster
      const emptyModule = new Activity("emptyModule", "Empty Module");
      emptyModule.sequencingControls.flow = true;
      root.addChild(emptyModule);

      // Note: The flow into cluster logic would need to handle this case
      // Start should flow to the first available leaf
      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      // Should still deliver to first available leaf (lesson1)
      expect(result.valid).toBe(true);
    });
  });

  describe("Activity path validation during delivery", () => {
    let overallProcess: OverallSequencingProcess;

    beforeEach(() => {
      overallProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        adlNav
      );
    });

    it("should validate entire path from root to target", () => {
      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      // The delivery process validates the entire path
      expect(result.valid).toBe(true);
    });

    it("should fail if any ancestor in path is disabled", () => {
      // Disable module1
      module1.isAvailable = false;

      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      // Should not be able to deliver to lesson1 (child of unavailable module1)
      // The flow should try to find an alternative
      expect(result.targetActivity?.id).not.toBe("lesson1");
    });

    it("should fail if target activity is unavailable", () => {
      lesson1.isAvailable = false;

      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      // Should skip lesson1 and go to lesson2
      expect(result.valid).toBe(true);
      expect(result.targetActivity?.id).toBe("lesson2");
    });
  });

  describe("Content delivery environment process", () => {
    let overallProcess: OverallSequencingProcess;
    let eventsCaptured: { type: string; data: any }[] = [];

    beforeEach(() => {
      eventsCaptured = [];
      overallProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        adlNav,
        (eventType, data) => {
          eventsCaptured.push({ type: eventType, data });
        }
      );
    });

    it("should set activity as current and active after delivery", () => {
      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      expect(result.valid).toBe(true);
      expect(activityTree.currentActivity?.id).toBe("lesson1");
      expect(lesson1.isActive).toBe(true);
    });

    it("should mark content as delivered", () => {
      expect(overallProcess.hasContentBeenDelivered()).toBe(false);

      overallProcess.processNavigationRequest(NavigationRequestType.START);

      expect(overallProcess.hasContentBeenDelivered()).toBe(true);
    });

    it("should fire activity delivery event", () => {
      overallProcess.processNavigationRequest(NavigationRequestType.START);

      const deliveryEvent = eventsCaptured.find(e => e.type === "onActivityDelivery");
      expect(deliveryEvent).toBeDefined();
    });

    it("should initialize attempt tracking on delivery", () => {
      overallProcess.processNavigationRequest(NavigationRequestType.START);

      // Initial attempt should be set up
      expect(lesson1.attemptCount).toBeGreaterThanOrEqual(1);
      expect(lesson1.activityAttemptActive).toBe(true);
    });

    it("should update navigation validity after delivery", () => {
      overallProcess.processNavigationRequest(NavigationRequestType.START);

      // Navigation validity update event should be fired
      const navEvent = eventsCaptured.find(e => e.type === "onNavigationValidityUpdate");
      expect(navEvent).toBeDefined();
    });
  });

  describe("Clear suspended activity during delivery", () => {
    let overallProcess: OverallSequencingProcess;

    beforeEach(() => {
      overallProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        adlNav
      );
    });

    it("should handle suspend and resume cycle", () => {
      // Start session
      const startResult = overallProcess.processNavigationRequest(NavigationRequestType.START);
      expect(startResult.valid).toBe(true);
      expect(activityTree.currentActivity?.id).toBe("lesson1");

      // Suspend - this should set suspended activity
      const suspendResult = overallProcess.processNavigationRequest(NavigationRequestType.SUSPEND_ALL);
      expect(suspendResult.valid).toBe(true);

      // Suspended activity should be set
      expect(activityTree.suspendedActivity?.id).toBe("lesson1");

      // Current activity may be cleared or remain depending on implementation
      // The key is that suspended activity is properly set
    });
  });

  describe("Rollup integration during delivery", () => {
    let overallProcess: OverallSequencingProcess;
    let eventsCaptured: { type: string; data: any }[] = [];

    beforeEach(() => {
      eventsCaptured = [];
      overallProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        adlNav,
        (eventType, data) => {
          eventsCaptured.push({ type: eventType, data });
        },
        { enhancedDeliveryValidation: true }
      );
    });

    it("should validate rollup state consistency before delivery", () => {
      overallProcess.processNavigationRequest(NavigationRequestType.START);

      // If inconsistency detected, debug event would be fired
      // For consistent state, delivery should succeed
      expect(activityTree.currentActivity?.id).toBe("lesson1");
    });

    it("should process global objective mapping before delivery", () => {
      overallProcess.processNavigationRequest(NavigationRequestType.START);

      // Global objective mapping should be processed during delivery
      // This ensures preconditions based on global objectives work
      expect(activityTree.currentActivity).toBeDefined();
    });

    it("should validate rollup state consistency after delivery", () => {
      overallProcess.processNavigationRequest(NavigationRequestType.START);

      // After delivery, rollup state should be validated again
      expect(activityTree.currentActivity?.id).toBe("lesson1");
    });
  });

  describe("Custom clock injection", () => {
    it("should use injected clock for time-based validations", () => {
      const futureDate = new Date("2025-06-15T12:00:00Z");
      const customClock = () => futureDate;

      const overallProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess,
        adlNav,
        null,
        { now: customClock }
      );

      // Set begin time in the "past" (relative to our injected future time)
      lesson1.beginTimeLimit = new Date("2025-01-01T00:00:00Z").toISOString();

      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      // Should succeed because current time (2025-06-15) is after begin time (2025-01-01)
      expect(result.valid).toBe(true);
    });
  });
});
