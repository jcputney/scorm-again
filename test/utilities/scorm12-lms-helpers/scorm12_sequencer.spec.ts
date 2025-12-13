import { describe, it, expect, beforeEach } from "vitest";
import { Scorm12Sequencer } from "../../../src/utilities/scorm12-lms-helpers/scorm12_sequencer";
import { ScoStateTracker } from "../../../src/utilities/scorm12-lms-helpers/sco_state_tracker";
import { ScoDefinition } from "../../../src/utilities/scorm12-lms-helpers/types";

describe("Scorm12Sequencer", () => {
  let tracker: ScoStateTracker;
  let sequencer: Scorm12Sequencer;
  let scoDefinitions: ScoDefinition[];

  beforeEach(() => {
    tracker = new ScoStateTracker();

    scoDefinitions = [
      {
        id: "intro",
        title: "Introduction",
        launchUrl: "intro/index.html",
        sequenceIndex: 0,
      },
      {
        id: "module1",
        title: "Module 1",
        launchUrl: "module1/index.html",
        masteryScore: 80,
        sequenceIndex: 1,
      },
      {
        id: "module2",
        title: "Module 2",
        launchUrl: "module2/index.html",
        masteryScore: 80,
        sequenceIndex: 2,
      },
      {
        id: "assessment",
        title: "Assessment",
        launchUrl: "assessment/index.html",
        masteryScore: 70,
        maxTimeAllowed: "0001:00:00.00",
        timeLimitAction: "exit,message",
        sequenceIndex: 3,
      },
    ];

    sequencer = new Scorm12Sequencer(scoDefinitions, tracker);
  });

  describe("initialization", () => {
    it("should initialize state tracker with all SCOs", () => {
      const states = tracker.getAllStates();
      expect(states).toHaveLength(4);
    });

    it("should sort SCOs by sequence index", () => {
      const unorderedDefs: ScoDefinition[] = [
        { id: "b", title: "B", launchUrl: "b.html", sequenceIndex: 2 },
        { id: "a", title: "A", launchUrl: "a.html", sequenceIndex: 0 },
        { id: "c", title: "C", launchUrl: "c.html", sequenceIndex: 1 },
      ];

      const seq = new Scorm12Sequencer(unorderedDefs, new ScoStateTracker());
      const scos = seq.getAllScos();

      expect(scos[0].id).toBe("a");
      expect(scos[1].id).toBe("c");
      expect(scos[2].id).toBe("b");
    });
  });

  describe("getNextSco", () => {
    it("should return first SCO when current is null", () => {
      const next = sequencer.getNextSco(null);
      expect(next?.id).toBe("intro");
    });

    it("should return next SCO in sequence", () => {
      const next = sequencer.getNextSco("intro");
      expect(next?.id).toBe("module1");
    });

    it("should return null at end of sequence", () => {
      const next = sequencer.getNextSco("assessment");
      expect(next).toBeNull();
    });

    it("should skip unavailable SCOs", () => {
      sequencer.setAvailabilityFilter((sco) => sco.id !== "module1");

      const next = sequencer.getNextSco("intro");
      expect(next?.id).toBe("module2");
    });
  });

  describe("getPreviousSco", () => {
    it("should return previous SCO in sequence", () => {
      const prev = sequencer.getPreviousSco("module1");
      expect(prev?.id).toBe("intro");
    });

    it("should return null at beginning of sequence", () => {
      const prev = sequencer.getPreviousSco("intro");
      expect(prev).toBeNull();
    });

    it("should skip unavailable SCOs going backward", () => {
      sequencer.setAvailabilityFilter((sco) => sco.id !== "module1");

      const prev = sequencer.getPreviousSco("module2");
      expect(prev?.id).toBe("intro");
    });
  });

  describe("getSco", () => {
    it("should return SCO by ID", () => {
      const sco = sequencer.getSco("module1");
      expect(sco?.title).toBe("Module 1");
    });

    it("should return undefined for unknown ID", () => {
      const sco = sequencer.getSco("unknown");
      expect(sco).toBeUndefined();
    });
  });

  describe("getAvailableScos", () => {
    it("should return all SCOs by default", () => {
      const available = sequencer.getAvailableScos();
      expect(available).toHaveLength(4);
    });

    it("should respect availability filter", () => {
      sequencer.setAvailabilityFilter((sco) => sco.id !== "assessment");

      const available = sequencer.getAvailableScos();
      expect(available).toHaveLength(3);
      expect(available.find((s) => s.id === "assessment")).toBeUndefined();
    });
  });

  describe("getIncompleteScos", () => {
    it("should return all SCOs when none completed", () => {
      const incomplete = sequencer.getIncompleteScos();
      expect(incomplete).toHaveLength(4);
    });

    it("should exclude completed SCOs", () => {
      tracker.updateFromCmiData("intro", {
        core: { lesson_status: "completed" },
      });
      tracker.updateFromCmiData("module1", {
        core: { lesson_status: "passed" },
      });

      const incomplete = sequencer.getIncompleteScos();
      expect(incomplete).toHaveLength(2);
    });
  });

  describe("hasNext / hasPrevious", () => {
    it("should return true when next exists", () => {
      expect(sequencer.hasNext("intro")).toBe(true);
    });

    it("should return false at end", () => {
      expect(sequencer.hasNext("assessment")).toBe(false);
    });

    it("should return true when previous exists", () => {
      expect(sequencer.hasPrevious("module1")).toBe(true);
    });

    it("should return false at beginning", () => {
      expect(sequencer.hasPrevious("intro")).toBe(false);
    });
  });

  describe("isScoAvailable", () => {
    it("should return true by default", () => {
      expect(sequencer.isScoAvailable("module1")).toBe(true);
    });

    it("should respect availability filter", () => {
      sequencer.setAvailabilityFilter((sco) => sco.id !== "module2");

      expect(sequencer.isScoAvailable("module1")).toBe(true);
      expect(sequencer.isScoAvailable("module2")).toBe(false);
    });

    it("should return false for unknown SCO", () => {
      expect(sequencer.isScoAvailable("unknown")).toBe(false);
    });
  });

  describe("processExitAction", () => {
    it("should suggest suspend for suspend exit", () => {
      const suggestion = sequencer.processExitAction("module1", "suspend");

      expect(suggestion.action).toBe("suspend");
      expect(suggestion.targetScoId).toBe("module1");
    });

    it("should suggest exit for logout", () => {
      const suggestion = sequencer.processExitAction("module1", "logout");

      expect(suggestion.action).toBe("exit");
    });

    it("should suggest continue after passed", () => {
      tracker.updateFromCmiData("module1", {
        core: { lesson_status: "passed" },
      });

      const suggestion = sequencer.processExitAction("module1", "");

      expect(suggestion.action).toBe("continue");
      expect(suggestion.targetScoId).toBe("module2");
    });

    it("should suggest retry after failed", () => {
      tracker.updateFromCmiData("module1", {
        core: { lesson_status: "failed" },
      });

      const suggestion = sequencer.processExitAction("module1", "");

      expect(suggestion.action).toBe("retry");
      expect(suggestion.targetScoId).toBe("module1");
    });

    it("should suggest exit at end of course after completion", () => {
      tracker.updateFromCmiData("assessment", {
        core: { lesson_status: "passed" },
      });

      const suggestion = sequencer.processExitAction("assessment", "");

      expect(suggestion.action).toBe("exit");
      expect(suggestion.reason).toContain("no more SCOs");
    });

    it("should handle time-out with exit action", () => {
      tracker.updateFromCmiData("assessment", {
        core: { lesson_status: "incomplete" },
      });

      const suggestion = sequencer.processExitAction("assessment", "time-out");

      expect(suggestion.action).toBe("exit");
      expect(suggestion.reason).toContain("Time limit");
    });
  });

  describe("getStartingSco", () => {
    it("should return first incomplete SCO", () => {
      tracker.updateFromCmiData("intro", {
        core: { lesson_status: "completed" },
      });

      const starting = sequencer.getStartingSco();
      expect(starting?.id).toBe("module1");
    });

    it("should return suspended SCO if exists", () => {
      tracker.updateFromCmiData("module1", {
        core: { lesson_status: "incomplete", exit: "suspend" },
      });

      const starting = sequencer.getStartingSco();
      expect(starting?.id).toBe("module1");
    });

    it("should return first SCO when none started", () => {
      const starting = sequencer.getStartingSco();
      expect(starting?.id).toBe("intro");
    });

    it("should return first available when all completed", () => {
      for (const sco of scoDefinitions) {
        tracker.updateFromCmiData(sco.id, {
          core: { lesson_status: "completed" },
        });
      }

      const starting = sequencer.getStartingSco();
      expect(starting?.id).toBe("intro");
    });
  });

  describe("getProgress", () => {
    it("should return correct progress", () => {
      tracker.updateFromCmiData("intro", {
        core: { lesson_status: "completed" },
      });
      tracker.updateFromCmiData("module1", {
        core: { lesson_status: "passed" },
      });

      const progress = sequencer.getProgress();

      expect(progress.completed).toBe(2);
      expect(progress.total).toBe(4);
      expect(progress.percentage).toBe(50);
    });

    it("should return 0 when nothing completed", () => {
      const progress = sequencer.getProgress();

      expect(progress.completed).toBe(0);
      expect(progress.percentage).toBe(0);
    });
  });

  describe("availability filter integration", () => {
    it("should integrate with prerequisite systems", () => {
      // Simulate prerequisite: module1 requires intro completed
      sequencer.setAvailabilityFilter((sco, stateTracker) => {
        if (sco.id === "intro") return true;
        if (sco.id === "module1") return stateTracker.isCompleted("intro");
        if (sco.id === "module2") return stateTracker.isCompleted("module1");
        if (sco.id === "assessment") return stateTracker.isCompleted("module2");
        return true;
      });

      // Initially only intro available
      expect(sequencer.isScoAvailable("intro")).toBe(true);
      expect(sequencer.isScoAvailable("module1")).toBe(false);

      // Complete intro
      tracker.updateFromCmiData("intro", {
        core: { lesson_status: "completed" },
      });

      expect(sequencer.isScoAvailable("module1")).toBe(true);
      expect(sequencer.isScoAvailable("module2")).toBe(false);
    });
  });
});
