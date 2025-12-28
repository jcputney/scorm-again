import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ScormCmiData,
  ScoStateTracker
} from "../../../src/utilities/scorm12-lms-helpers/sco_state_tracker";
import { ScoState } from "../../../src/utilities/scorm12-lms-helpers/types";

describe("ScoStateTracker", () => {
  let tracker: ScoStateTracker;

  beforeEach(() => {
    tracker = new ScoStateTracker();
  });

  describe("initialization", () => {
    it("should initialize with no states", () => {
      expect(tracker.getAllStates()).toHaveLength(0);
    });

    it("should initialize with provided states", () => {
      const initialStates: ScoState[] = [
        {
          id: "sco1",
          title: "SCO 1",
          lessonStatus: "completed",
          score: { raw: 85 },
          totalTime: "0000:30:00.00",
          sessionTime: "0000:00:00.00",
          exitAction: "",
          suspendData: "",
          lessonLocation: "",
          attemptCount: 1,
          hasBeenLaunched: true
        }
      ];

      const trackerWithState = new ScoStateTracker(initialStates);
      expect(trackerWithState.getAllStates()).toHaveLength(1);
      expect(trackerWithState.getScoState("sco1")?.lessonStatus).toBe(
        "completed"
      );
    });
  });

  describe("initializeSco", () => {
    it("should initialize a new SCO with default state", () => {
      tracker.initializeSco("sco1", "Test SCO");

      const state = tracker.getScoState("sco1");
      expect(state).toBeDefined();
      expect(state?.lessonStatus).toBe("not attempted");
      expect(state?.hasBeenLaunched).toBe(false);
      expect(state?.attemptCount).toBe(0);
    });

    it("should not overwrite existing SCO state", () => {
      tracker.initializeSco("sco1", "Test SCO");

      const cmiData: ScormCmiData = {
        core: { lesson_status: "completed" }
      };
      tracker.updateFromCmiData("sco1", cmiData);

      tracker.initializeSco("sco1", "Test SCO");
      expect(tracker.getScoState("sco1")?.lessonStatus).toBe("completed");
    });

    it("should set mastery score if provided", () => {
      tracker.initializeSco("sco1", "Test SCO", 80);
      expect(tracker.getScoState("sco1")?.masteryScore).toBe(80);
    });
  });

  describe("updateFromCmiData", () => {
    beforeEach(() => {
      tracker.initializeSco("sco1", "Test SCO");
    });

    it("should update lesson status", () => {
      tracker.updateFromCmiData("sco1", {
        core: { lesson_status: "passed" }
      });

      expect(tracker.getScoState("sco1")?.lessonStatus).toBe("passed");
    });

    it("should update score data", () => {
      tracker.updateFromCmiData("sco1", {
        core: {
          score: { raw: 85, min: 0, max: 100 }
        }
      });

      const state = tracker.getScoState("sco1");
      expect(state?.score.raw).toBe(85);
      expect(state?.score.min).toBe(0);
      expect(state?.score.max).toBe(100);
      expect(state?.score.scaled).toBe(0.85);
    });

    it("should calculate scaled score correctly", () => {
      tracker.updateFromCmiData("sco1", {
        core: {
          score: { raw: 75, min: 50, max: 100 }
        }
      });

      const state = tracker.getScoState("sco1");
      expect(state?.score.scaled).toBe(0.5); // (75-50)/(100-50) = 0.5
    });

    it("should accumulate session time to total time", () => {
      tracker.updateFromCmiData("sco1", {
        core: { session_time: "0000:30:00.00" }
      });

      expect(tracker.getScoState("sco1")?.totalTime).toBe("0000:30:00.00");

      tracker.updateFromCmiData("sco1", {
        core: { session_time: "0000:15:00.00" }
      });

      expect(tracker.getScoState("sco1")?.totalTime).toBe("0000:45:00.00");
    });

    it("should update exit action", () => {
      tracker.updateFromCmiData("sco1", {
        core: { exit: "suspend" }
      });

      expect(tracker.getScoState("sco1")?.exitAction).toBe("suspend");
    });

    it("should update suspend data", () => {
      tracker.updateFromCmiData("sco1", {
        suspend_data: "bookmark=page5;score=85"
      });

      expect(tracker.getScoState("sco1")?.suspendData).toBe(
        "bookmark=page5;score=85"
      );
    });

    it("should update lesson location", () => {
      tracker.updateFromCmiData("sco1", {
        core: { lesson_location: "module2/page3" }
      });

      expect(tracker.getScoState("sco1")?.lessonLocation).toBe("module2/page3");
    });

    it("should create SCO if it doesn't exist", () => {
      tracker.updateFromCmiData("new_sco", {
        core: { lesson_status: "incomplete" }
      });

      expect(tracker.getScoState("new_sco")).toBeDefined();
      expect(tracker.getScoState("new_sco")?.lessonStatus).toBe("incomplete");
    });
  });

  describe("markLaunched", () => {
    beforeEach(() => {
      tracker.initializeSco("sco1", "Test SCO");
    });

    it("should increment attempt count", () => {
      tracker.markLaunched("sco1");
      expect(tracker.getScoState("sco1")?.attemptCount).toBe(1);

      tracker.markLaunched("sco1");
      expect(tracker.getScoState("sco1")?.attemptCount).toBe(2);
    });

    it("should set hasBeenLaunched to true", () => {
      expect(tracker.getScoState("sco1")?.hasBeenLaunched).toBe(false);

      tracker.markLaunched("sco1");
      expect(tracker.getScoState("sco1")?.hasBeenLaunched).toBe(true);
    });

    it("should set firstLaunchTime on first launch", () => {
      tracker.markLaunched("sco1");
      expect(tracker.getScoState("sco1")?.firstLaunchTime).toBeDefined();
    });

    it("should set lastAccessTime", () => {
      tracker.markLaunched("sco1");
      expect(tracker.getScoState("sco1")?.lastAccessTime).toBeDefined();
    });
  });

  describe("status checks", () => {
    beforeEach(() => {
      tracker.initializeSco("sco1", "Test SCO");
    });

    it("should check if completed (passed)", () => {
      tracker.updateFromCmiData("sco1", {
        core: { lesson_status: "passed" }
      });
      expect(tracker.isCompleted("sco1")).toBe(true);
    });

    it("should check if completed (completed status)", () => {
      tracker.updateFromCmiData("sco1", {
        core: { lesson_status: "completed" }
      });
      expect(tracker.isCompleted("sco1")).toBe(true);
    });

    it("should check if completed (failed)", () => {
      tracker.updateFromCmiData("sco1", {
        core: { lesson_status: "failed" }
      });
      expect(tracker.isCompleted("sco1")).toBe(true);
    });

    it("should return false for incomplete", () => {
      tracker.updateFromCmiData("sco1", {
        core: { lesson_status: "incomplete" }
      });
      expect(tracker.isCompleted("sco1")).toBe(false);
    });

    it("should check isPassed", () => {
      tracker.updateFromCmiData("sco1", {
        core: { lesson_status: "passed" }
      });
      expect(tracker.isPassed("sco1")).toBe(true);
    });

    it("should check isFailed", () => {
      tracker.updateFromCmiData("sco1", {
        core: { lesson_status: "failed" }
      });
      expect(tracker.isFailed("sco1")).toBe(true);
    });

    it("should check hasBeenAttempted", () => {
      expect(tracker.hasBeenAttempted("sco1")).toBe(false);
      tracker.markLaunched("sco1");
      expect(tracker.hasBeenAttempted("sco1")).toBe(true);
    });
  });

  describe("getNormalizedScore", () => {
    beforeEach(() => {
      tracker.initializeSco("sco1", "Test SCO");
    });

    it("should return scaled score when available", () => {
      tracker.updateFromCmiData("sco1", {
        core: { score: { raw: 80, min: 0, max: 100 } }
      });
      expect(tracker.getNormalizedScore("sco1")).toBe(0.8);
    });

    it("should return undefined when no score", () => {
      expect(tracker.getNormalizedScore("sco1")).toBeUndefined();
    });
  });

  describe("event handling", () => {
    it("should emit state change events", () => {
      const listener = vi.fn();
      tracker.onStateChange(listener);
      tracker.initializeSco("sco1", "Test SCO");

      tracker.updateFromCmiData("sco1", {
        core: { lesson_status: "completed" }
      });

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          scoId: "sco1",
          changedFields: expect.arrayContaining(["lessonStatus"])
        })
      );
    });

    it("should allow unsubscribing from events", () => {
      const listener = vi.fn();
      const unsubscribe = tracker.onStateChange(listener);
      tracker.initializeSco("sco1", "Test SCO");

      unsubscribe();

      tracker.updateFromCmiData("sco1", {
        core: { lesson_status: "completed" }
      });

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe("export/import", () => {
    it("should export all states", () => {
      tracker.initializeSco("sco1", "SCO 1");
      tracker.initializeSco("sco2", "SCO 2");
      tracker.updateFromCmiData("sco1", {
        core: { lesson_status: "completed" }
      });

      const exported = tracker.exportState();
      expect(exported).toHaveLength(2);
      expect(exported.find((s) => s.id === "sco1")?.lessonStatus).toBe(
        "completed"
      );
    });

    it("should import states", () => {
      const states: ScoState[] = [
        {
          id: "sco1",
          title: "SCO 1",
          lessonStatus: "passed",
          score: { raw: 90, scaled: 0.9 },
          totalTime: "0001:00:00.00",
          sessionTime: "0000:00:00.00",
          exitAction: "",
          suspendData: "test",
          lessonLocation: "page5",
          attemptCount: 2,
          hasBeenLaunched: true
        }
      ];

      tracker.importState(states);

      expect(tracker.getScoState("sco1")?.lessonStatus).toBe("passed");
      expect(tracker.getScoState("sco1")?.score.raw).toBe(90);
    });

    it("should clear existing states on import", () => {
      tracker.initializeSco("old_sco", "Old SCO");

      tracker.importState([
        {
          id: "new_sco",
          title: "New SCO",
          lessonStatus: "not attempted",
          score: {},
          totalTime: "0000:00:00.00",
          sessionTime: "0000:00:00.00",
          exitAction: "",
          suspendData: "",
          lessonLocation: "",
          attemptCount: 0,
          hasBeenLaunched: false
        }
      ]);

      expect(tracker.getScoState("old_sco")).toBeUndefined();
      expect(tracker.getScoState("new_sco")).toBeDefined();
    });
  });

  describe("clear", () => {
    it("should remove all states", () => {
      tracker.initializeSco("sco1", "SCO 1");
      tracker.initializeSco("sco2", "SCO 2");

      tracker.clear();

      expect(tracker.getAllStates()).toHaveLength(0);
    });
  });
});
