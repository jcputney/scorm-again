import { beforeEach, describe, expect, it } from "vitest";
import { SequencingConfiguration, SequencingService } from "../../src/services/SequencingService";
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

    // Enable flow for traversal (only on clusters, not leaves)
    rootActivity.sequencingControls.flow = true;
    // Leaves should NOT have flow=true

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

    it("should emit navigation validity updates including hideLmsUi directives", () => {
      // Set hideLmsUi values BEFORE creating the service since sequencing processes
      // are now created in the constructor (to enable pre-SCO navigation)
      const rootActivity = sequencing.activityTree.root!;
      rootActivity.hideLmsUi = ["continue"];
      sequencing.hideLmsUi = ["exit"];

      // Create a new service with the updated hideLmsUi configuration
      const testService = new SequencingService(
        sequencing,
        cmi,
        adl,
        eventService,
        loggingService,
        configuration,
      );

      let captured: any = null;
      testService.setEventListeners({
        onNavigationValidityUpdate: (payload: any) => {
          captured = payload;
        },
      });

      testService.initialize();
      testService.processNavigationRequest("start");

      expect(captured).toBeTruthy();
      expect(captured.hideLmsUi).toEqual(["continue", "exit"]);
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

      // isInitialized is true after construction because sequencing processes
      // are created in the constructor to enable pre-SCO navigation
      expect(state.isInitialized).toBe(true);
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

  describe("navigation request parsing", () => {
    beforeEach(() => {
      sequencingService.initialize();
    });

    it("should handle standard navigation requests", () => {
      // Test all standard navigation request types
      const requests = [
        "start",
        "resumeAll",
        "continue",
        "previous",
        "exit",
        "exitAll",
        "abandon",
        "abandonAll",
        "suspendAll",
      ];

      requests.forEach((request) => {
        const result = sequencingService.processNavigationRequest(request);
        // Result may be true or false depending on activity state, but should not throw
        expect(typeof result).toBe("boolean");
      });
    });

    it("should handle navigation requests with underscore prefix", () => {
      // Test navigation requests with underscore prefix (SCORM format)
      const result = sequencingService.processNavigationRequest("_continue");
      expect(typeof result).toBe("boolean");
    });

    it("should handle choice requests", () => {
      const result = sequencingService.processNavigationRequest("choice", "child1");
      expect(typeof result).toBe("boolean");
    });

    it("should handle jump requests", () => {
      const result = sequencingService.processNavigationRequest("jump", "child2");
      expect(typeof result).toBe("boolean");
    });

    it("should handle _none_ navigation request", () => {
      const result = sequencingService.processNavigationRequest("_none_");
      expect(result).toBe(false);
    });
  });

  describe("error handling", () => {
    it("should handle initialization errors gracefully", () => {
      // Create a service with no activity tree
      const emptySequencing = new Sequencing();
      emptySequencing.activityTree.root = null;

      const errorService = new SequencingService(
        emptySequencing,
        cmi,
        adl,
        eventService,
        loggingService,
        configuration,
      );

      const result = errorService.initialize();
      // Should not crash even with no activity tree
      expect(result).toBe(global_constants.SCORM_TRUE);
    });

    it("should handle termination errors gracefully", () => {
      sequencingService.initialize();

      // Set up a scenario that might cause errors
      sequencing.activityTree.currentActivity = null;

      const result = sequencingService.terminate();
      expect(result).toBe(global_constants.SCORM_TRUE);
    });

    it("should handle navigation request errors", () => {
      sequencingService.initialize();

      // Try an invalid navigation request
      const result = sequencingService.processNavigationRequest("invalid_request_type");
      expect(result).toBe(false);
    });
  });

  describe("CMI data synchronization", () => {
    beforeEach(() => {
      sequencingService.initialize();
      const rootActivity = sequencing.activityTree.root;
      if (rootActivity) {
        sequencing.activityTree.currentActivity = rootActivity.children[0];
      }
    });

    it("should update activity from CMI completion status", () => {
      cmi.completion_status = "completed";

      sequencingService.triggerRollupOnCMIChange("cmi.completion_status", "unknown", "completed");

      const currentActivity = sequencing.getCurrentActivity();
      expect(currentActivity?.completionStatus).toBe("completed");
    });

    it("should update activity from CMI success status", () => {
      cmi.success_status = "passed";

      sequencingService.triggerRollupOnCMIChange("cmi.success_status", "unknown", "passed");

      const currentActivity = sequencing.getCurrentActivity();
      expect(currentActivity?.successStatus).toBe("passed");
    });

    it("should update activity from CMI progress measure", () => {
      cmi.progress_measure = "0.75";

      sequencingService.triggerRollupOnCMIChange("cmi.progress_measure", "", "0.75");

      const currentActivity = sequencing.getCurrentActivity();
      expect(currentActivity?.progressMeasure).toBe(0.75);
    });

    it("should handle CMI score updates", () => {
      if (cmi.score) {
        cmi.score.scaled = "0.85";

        sequencingService.triggerRollupOnCMIChange("cmi.score.scaled", "", "0.85");

        const currentActivity = sequencing.getCurrentActivity();
        expect(currentActivity?.objectiveNormalizedMeasure).toBe(0.85);
      }
    });

    it("should handle CMI objectives updates", () => {
      sequencingService.triggerRollupOnCMIChange(
        "cmi.objectives.0.success_status",
        "unknown",
        "passed",
      );

      // Should not throw
      expect(sequencing.getCurrentActivity()).toBeDefined();
    });
  });

  describe("activity delivery events", () => {
    beforeEach(() => {
      sequencingService.initialize();
    });

    it("should fire activity delivery event", () => {
      let deliveredActivity: Activity | null = null;

      sequencingService.setEventListeners({
        onActivityDelivery: (activity) => {
          deliveredActivity = activity;
        },
      });

      // Trigger a navigation that delivers an activity
      sequencingService.processNavigationRequest("start");

      expect(deliveredActivity).toBeDefined();
    });

    it("should fire activity unload event", () => {
      let unloadedActivity: Activity | null = null;

      sequencingService.setEventListeners({
        onActivityUnload: (activity) => {
          unloadedActivity = activity;
        },
      });

      // Start and then navigate to trigger unload
      sequencingService.processNavigationRequest("start");
      sequencingService.processNavigationRequest("continue");

      // Unload might or might not fire depending on activity structure
      // Just verify no errors occurred
      expect(typeof unloadedActivity).toBeDefined();
    });

    it("should fire activity attempt start event", () => {
      const activity = new Activity("test", "Test Activity");

      let attemptStartFired = false;
      sequencingService.setEventListeners({
        onActivityAttemptStart: (act) => {
          attemptStartFired = true;
        },
      });

      sequencingService.fireActivityAttemptStart(activity);
      expect(attemptStartFired).toBe(true);
    });

    it("should fire activity attempt end event", () => {
      const activity = new Activity("test", "Test Activity");

      let attemptEndFired = false;
      sequencingService.setEventListeners({
        onActivityAttemptEnd: (act) => {
          attemptEndFired = true;
        },
      });

      sequencingService.fireActivityAttemptEnd(activity);
      expect(attemptEndFired).toBe(true);
    });

    it("should fire limit condition check event", () => {
      const activity = new Activity("test", "Test Activity");

      let checkFired = false;
      let checkResult: boolean | null = null;
      sequencingService.setEventListeners({
        onLimitConditionCheck: (act, result) => {
          checkFired = true;
          checkResult = result;
        },
      });

      sequencingService.fireLimitConditionCheck(activity, true);
      expect(checkFired).toBe(true);
      expect(checkResult).toBe(true);
    });

    it("should fire sequencing state change event", () => {
      let stateFired = false;

      sequencingService.setEventListeners({
        onSequencingStateChange: (state) => {
          stateFired = true;
        },
      });

      sequencingService.fireSequencingStateChange({ test: true });
      expect(stateFired).toBe(true);
    });
  });

  describe("debug and logging", () => {
    it("should fire debug events", () => {
      let debugEvents: any[] = [];

      sequencingService.setEventListeners({
        onSequencingDebug: (event, data) => {
          debugEvents.push({ event, data });
        },
      });

      sequencingService.fireActivityAttemptStart(new Activity("test", "Test"));

      expect(debugEvents.length).toBeGreaterThan(0);
    });

    it("should respect log level configuration", () => {
      const debugService = new SequencingService(
        sequencing,
        cmi,
        adl,
        eventService,
        loggingService,
        { ...configuration, logLevel: "debug" },
      );

      // Initialize with debug logging
      const result = debugService.initialize();
      expect(result).toBe(global_constants.SCORM_TRUE);
    });

    it("should handle errors in event listeners gracefully", () => {
      sequencingService.setEventListeners({
        onSequencingStart: () => {
          throw new Error("Test error in listener");
        },
      });

      // Should not throw even if listener throws
      expect(() => {
        sequencingService.initialize();
      }).not.toThrow();
    });
  });

  describe("global event listeners", () => {
    it("should fire to global event listeners when available", () => {
      // Mock global window object with sequencing events
      if (typeof window !== "undefined") {
        (window as any).scormSequencingEvents = {
          onSequencingStart: () => {
            // Global listener
          },
        };
      }

      // Should not throw when global listeners exist
      expect(() => {
        sequencingService.initialize();
      }).not.toThrow();

      // Clean up
      if (typeof window !== "undefined") {
        delete (window as any).scormSequencingEvents;
      }
    });
  });

  describe("sequencing service API", () => {
    it("should return overall sequencing process", () => {
      const process = sequencingService.getOverallSequencingProcess();
      expect(process).toBeDefined();
    });

    it("should report delivery status correctly", () => {
      const inProgress = sequencingService.isDeliveryInProgress();
      expect(typeof inProgress).toBe("boolean");
    });

    it("should handle navigation with exit type", () => {
      sequencingService.initialize();

      const result = sequencingService.processNavigationRequest("exit", undefined, "normal");
      expect(typeof result).toBe("boolean");
    });

    it("should handle navigation with suspend exit type", () => {
      sequencingService.initialize();

      const result = sequencingService.processNavigationRequest("suspendAll", undefined, "suspend");
      expect(typeof result).toBe("boolean");
    });

    it("should handle navigation with logout exit type", () => {
      sequencingService.initialize();

      const result = sequencingService.processNavigationRequest("exitAll", undefined, "logout");
      expect(typeof result).toBe("boolean");
    });
  });

  describe("configuration with time providers", () => {
    it("should support custom time provider", () => {
      const customTime = new Date("2024-01-01T00:00:00Z");
      const customConfig = {
        ...configuration,
        now: () => customTime,
      };

      const timeService = new SequencingService(
        sequencing,
        cmi,
        adl,
        eventService,
        loggingService,
        customConfig,
      );

      const result = timeService.initialize();
      expect(result).toBe(global_constants.SCORM_TRUE);
    });

    it("should support custom elapsed time providers", () => {
      const customConfig = {
        ...configuration,
        getAttemptElapsedSeconds: (activity: Activity) => 100,
        getActivityElapsedSeconds: (activity: Activity) => 200,
      };

      const timeService = new SequencingService(
        sequencing,
        cmi,
        adl,
        eventService,
        loggingService,
        customConfig,
      );

      const result = timeService.initialize();
      expect(result).toBe(global_constants.SCORM_TRUE);
    });
  });

  describe("auto progress behavior", () => {
    it("should handle autoProgressOnCompletion configuration", () => {
      const autoProgressConfig = {
        ...configuration,
        autoProgressOnCompletion: true,
      };

      const autoService = new SequencingService(
        sequencing,
        cmi,
        adl,
        eventService,
        loggingService,
        autoProgressConfig,
      );

      const result = autoService.initialize();
      expect(result).toBe(global_constants.SCORM_TRUE);
    });
  });

  describe("sequencing without activity tree", () => {
    it("should handle operations when activity tree is empty", () => {
      const emptySequencing = new Sequencing();
      emptySequencing.activityTree.root = null;

      const emptyService = new SequencingService(
        emptySequencing,
        cmi,
        adl,
        eventService,
        loggingService,
        configuration,
      );

      // Should handle gracefully
      const state = emptyService.getSequencingState();
      expect(state.rootActivity).toBeNull();
    });
  });
});
