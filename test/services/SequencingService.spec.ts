import { describe, it, expect, beforeEach } from "vitest";
import { SequencingService, SequencingConfiguration } from "../../src/services/SequencingService";
import { Sequencing } from "../../src/cmi/scorm2004/sequencing/sequencing";
import { Activity } from "../../src/cmi/scorm2004/sequencing/activity";
import { CMI } from "../../src/cmi/scorm2004/cmi";
import { ADL } from "../../src/cmi/scorm2004/adl";
import { EventService } from "../../src/services/EventService";
import { LoggingService } from "../../src/services/LoggingService";
import { global_constants } from "../../src/constants/api_constants";

describe("SequencingService", () => {
  let sequencingService: SequencingService;
  let sequencing: Sequencing;
  let cmi: CMI;
  let adl: ADL;
  let eventService: EventService;
  let loggingService: LoggingService;
  let configuration: SequencingConfiguration;

  beforeEach(() => {
    // Create mock instances
    sequencing = new Sequencing();
    cmi = new CMI();
    adl = new ADL();
    eventService = new EventService();
    loggingService = new LoggingService();

    configuration = {
      autoRollupOnCMIChange: true,
      autoProgressOnCompletion: false,
      validateNavigationRequests: true,
      enableEventSystem: true,
      logLevel: "info",
    };

    // Set up basic activity tree
    const rootActivity = new Activity("root", "Root Activity");
    const childActivity1 = new Activity("child1", "Child 1");
    const childActivity2 = new Activity("child2", "Child 2");
    rootActivity.addChild(childActivity1);
    rootActivity.addChild(childActivity2);
    sequencing.activityTree.root = rootActivity;

    sequencingService = new SequencingService(
      sequencing,
      cmi,
      adl,
      eventService,
      loggingService,
      configuration,
    );
  });

  describe("initialization", () => {
    it("should initialize successfully", () => {
      const result = sequencingService.initialize();
      expect(result).toBe(global_constants.SCORM_TRUE);

      const state = sequencingService.getSequencingState();
      expect(state.isInitialized).toBe(true);
    });

    it("should set up sequencing processes when activity tree exists", () => {
      const result = sequencingService.initialize();
      expect(result).toBe(global_constants.SCORM_TRUE);

      const state = sequencingService.getSequencingState();
      expect(state.rootActivity).toBeDefined();
      expect(state.rootActivity?.id).toBe("root");
    });
  });

  describe("termination", () => {
    it("should terminate successfully after initialization", () => {
      sequencingService.initialize();
      const result = sequencingService.terminate();
      expect(result).toBe(global_constants.SCORM_TRUE);

      const state = sequencingService.getSequencingState();
      expect(state.isInitialized).toBe(false);
    });
  });

  describe("CMI change tracking", () => {
    beforeEach(() => {
      sequencingService.initialize();
      // Set up a current activity
      const rootActivity = sequencing.activityTree.root;
      if (rootActivity) {
        sequencing.activityTree.currentActivity = rootActivity.children[0];
      }
    });

    it("should trigger rollup on completion status change", () => {
      const oldValue = "unknown";
      const newValue = "completed";

      // This should not throw and should trigger rollup internally
      expect(() => {
        sequencingService.triggerRollupOnCMIChange("cmi.completion_status", oldValue, newValue);
      }).not.toThrow();
    });

    it("should trigger rollup on success status change", () => {
      const oldValue = "unknown";
      const newValue = "passed";

      expect(() => {
        sequencingService.triggerRollupOnCMIChange("cmi.success_status", oldValue, newValue);
      }).not.toThrow();
    });

    it("should trigger rollup on score change", () => {
      const oldValue = "";
      const newValue = "0.85";

      expect(() => {
        sequencingService.triggerRollupOnCMIChange("cmi.score.scaled", oldValue, newValue);
      }).not.toThrow();
    });

    it("should not trigger rollup on irrelevant CMI changes", () => {
      const oldValue = "";
      const newValue = "some value";

      // Should not trigger rollup for non-tracked elements
      expect(() => {
        sequencingService.triggerRollupOnCMIChange("cmi.location", oldValue, newValue);
      }).not.toThrow();
    });

    it("should not trigger rollup when disabled", () => {
      sequencingService.updateConfiguration({ autoRollupOnCMIChange: false });

      expect(() => {
        sequencingService.triggerRollupOnCMIChange("cmi.completion_status", "unknown", "completed");
      }).not.toThrow();
    });
  });

  describe("navigation request processing", () => {
    beforeEach(() => {
      sequencingService.initialize();
    });

    it("should handle invalid navigation requests gracefully", () => {
      const result = sequencingService.processNavigationRequest("invalid_request");
      expect(result).toBe(false);
    });

    it("should reject navigation requests when not initialized", () => {
      const uninitializedService = new SequencingService(
        sequencing,
        cmi,
        adl,
        eventService,
        loggingService,
        configuration,
      );

      const result = uninitializedService.processNavigationRequest("continue");
      expect(result).toBe(false);
    });
  });

  describe("event system", () => {
    it("should allow setting event listeners", () => {
      let eventFired = false;

      sequencingService.setEventListeners({
        onSequencingStart: () => {
          eventFired = true;
        },
      });

      sequencingService.initialize();
      expect(eventFired).toBe(true);
    });

    it("should respect event system configuration", () => {
      const disabledService = new SequencingService(
        sequencing,
        cmi,
        adl,
        eventService,
        loggingService,
        { ...configuration, enableEventSystem: false },
      );

      let eventFired = false;
      disabledService.setEventListeners({
        onSequencingStart: () => {
          eventFired = true;
        },
      });

      disabledService.initialize();
      // Event should not fire when system is disabled
      expect(eventFired).toBe(false);
    });
  });

  describe("configuration updates", () => {
    it("should allow configuration updates", () => {
      const initialState = sequencingService.getSequencingState();

      sequencingService.updateConfiguration({
        autoRollupOnCMIChange: false,
        logLevel: "debug",
      });

      // Configuration should be updated (we can't easily test this directly,
      // but we can verify it doesn't throw)
      expect(() => {
        sequencingService.triggerRollupOnCMIChange("cmi.completion_status", "unknown", "completed");
      }).not.toThrow();
    });
  });

  describe("state management", () => {
    it("should return correct initial state", () => {
      const state = sequencingService.getSequencingState();

      expect(state.isInitialized).toBe(false);
      expect(state.isActive).toBe(false);
      expect(state.currentActivity).toBeNull();
      expect(state.rootActivity).toBeDefined();
      expect(state.rootActivity?.id).toBe("root");
    });

    it("should update state after initialization", () => {
      sequencingService.initialize();
      const state = sequencingService.getSequencingState();

      expect(state.isInitialized).toBe(true);
    });
  });
});
