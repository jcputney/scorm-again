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

  describe("edge cases", () => {
    it("should handle getNextSco with invalid current ID", () => {
      const next = sequencer.getNextSco("invalid-id");
      expect(next).toBeNull();
    });

    it("should handle getPreviousSco with invalid current ID", () => {
      const prev = sequencer.getPreviousSco("invalid-id");
      expect(prev).toBeNull();
    });

    it("should handle processExitAction with unknown SCO", () => {
      const suggestion = sequencer.processExitAction("unknown-sco", "");
      expect(suggestion.action).toBe("exit");
      expect(suggestion.reason).toBe("Unknown SCO");
    });

    it("should handle normal exit with incomplete status", () => {
      tracker.updateFromCmiData("module1", {
        core: { lesson_status: "incomplete" },
      });

      const suggestion = sequencer.processExitAction("module1", "");
      expect(suggestion.action).toBe("exit");
      expect(suggestion.reason).toContain("incomplete");
    });

    it("should handle time-out with continue action", () => {
      // Create SCO with continue action
      const continueTracker = new ScoStateTracker();
      const continueDefs: ScoDefinition[] = [
        {
          id: "quiz",
          title: "Quiz",
          launchUrl: "quiz.html",
          timeLimitAction: "continue,message",
          sequenceIndex: 0,
        },
      ];

      const continueSequencer = new Scorm12Sequencer(
        continueDefs,
        continueTracker,
      );

      continueTracker.updateFromCmiData("quiz", {
        core: { lesson_status: "incomplete" },
      });

      const suggestion = continueSequencer.processExitAction("quiz", "time-out");
      expect(suggestion.action).toBe("continue");
      expect(suggestion.targetScoId).toBe("quiz");
      expect(suggestion.reason).toContain("continue allowed");
    });

    it("should handle time-out with exit action when completed and has next", () => {
      tracker.updateFromCmiData("assessment", {
        core: { lesson_status: "passed" },
      });

      // Add another SCO after assessment
      const extendedDefs: ScoDefinition[] = [
        ...scoDefinitions,
        {
          id: "final",
          title: "Final",
          launchUrl: "final.html",
          sequenceIndex: 4,
        },
      ];

      const extendedSequencer = new Scorm12Sequencer(
        extendedDefs,
        new ScoStateTracker(),
      );

      // Update with exit,message on assessment
      const assessmentWithExit = extendedDefs.find(
        (s) => s.id === "assessment",
      )!;
      extendedSequencer["_stateTracker"].updateFromCmiData("assessment", {
        core: { lesson_status: "passed" },
      });

      const suggestion = extendedSequencer.processExitAction(
        "assessment",
        "time-out",
      );
      expect(suggestion.action).toBe("continue");
      expect(suggestion.targetScoId).toBe("final");
      expect(suggestion.reason).toContain("moving to next SCO");
    });

    it("should handle completed status in normal exit", () => {
      tracker.updateFromCmiData("module1", {
        core: { lesson_status: "completed" },
      });

      const suggestion = sequencer.processExitAction("module1", "");
      expect(suggestion.action).toBe("continue");
      expect(suggestion.targetScoId).toBe("module2");
    });

    it("should return null when no SCOs available with filter", () => {
      sequencer.setAvailabilityFilter(() => false);
      const next = sequencer.getNextSco(null);
      expect(next).toBeNull();
    });

    it("should skip all unavailable SCOs in getNextSco", () => {
      // Make module1 and module2 unavailable
      sequencer.setAvailabilityFilter(
        (sco) => sco.id !== "module1" && sco.id !== "module2",
      );

      const next = sequencer.getNextSco("intro");
      expect(next?.id).toBe("assessment");
    });

    it("should skip all unavailable SCOs in getPreviousSco", () => {
      // Make intro and module1 unavailable
      sequencer.setAvailabilityFilter(
        (sco) => sco.id !== "intro" && sco.id !== "module1",
      );

      const prev = sequencer.getPreviousSco("assessment");
      expect(prev?.id).toBe("module2");
    });

    it("should return null from getPreviousSco when all previous are unavailable", () => {
      // Make all SCOs before module2 unavailable
      sequencer.setAvailabilityFilter(
        (sco) => sco.id === "module2" || sco.id === "assessment",
      );

      const prev = sequencer.getPreviousSco("module2");
      expect(prev).toBeNull();
    });

    it("should return null from getNextSco when all next are unavailable", () => {
      // Make all SCOs after intro unavailable
      sequencer.setAvailabilityFilter((sco) => sco.id === "intro");

      const next = sequencer.getNextSco("intro");
      expect(next).toBeNull();
    });

    it("should handle suspended SCO that is not available", () => {
      tracker.updateFromCmiData("module1", {
        core: { lesson_status: "incomplete", exit: "suspend" },
      });

      // Make suspended SCO unavailable
      sequencer.setAvailabilityFilter((sco) => sco.id !== "module1");

      const starting = sequencer.getStartingSco();
      // Should fall back to first incomplete
      expect(starting?.id).not.toBe("module1");
    });

    it("should handle default case in processExitAction", () => {
      tracker.updateFromCmiData("module1", {
        core: { lesson_status: "browsed" },
      });

      const suggestion = sequencer.processExitAction("module1", "custom-exit");
      expect(suggestion.action).toBe("exit");
      expect(suggestion.reason).toContain("incomplete");
    });

    it("should handle getProgress with empty course", () => {
      const emptySequencer = new Scorm12Sequencer([], new ScoStateTracker());
      const progress = emptySequencer.getProgress();

      expect(progress.completed).toBe(0);
      expect(progress.total).toBe(0);
      expect(progress.percentage).toBe(0);
    });

    it("should use default timeLimitAction when not specified", () => {
      // Create SCO without timeLimitAction
      const noActionTracker = new ScoStateTracker();
      const noActionDefs: ScoDefinition[] = [
        {
          id: "quiz",
          title: "Quiz",
          launchUrl: "quiz.html",
          sequenceIndex: 0,
          // timeLimitAction not specified
        },
      ];

      const noActionSequencer = new Scorm12Sequencer(
        noActionDefs,
        noActionTracker,
      );

      noActionTracker.updateFromCmiData("quiz", {
        core: { lesson_status: "incomplete" },
      });

      const suggestion = noActionSequencer.processExitAction("quiz", "time-out");
      expect(suggestion.action).toBe("continue");
      expect(suggestion.reason).toContain("continue allowed");
    });

    it("should handle time-out with exit action when incomplete and no next", () => {
      // Create single SCO with exit action
      const singleTracker = new ScoStateTracker();
      const singleDefs: ScoDefinition[] = [
        {
          id: "final",
          title: "Final",
          launchUrl: "final.html",
          timeLimitAction: "exit,message",
          sequenceIndex: 0,
        },
      ];

      const singleSequencer = new Scorm12Sequencer(singleDefs, singleTracker);

      singleTracker.updateFromCmiData("final", {
        core: { lesson_status: "incomplete" },
      });

      const suggestion = singleSequencer.processExitAction("final", "time-out");
      expect(suggestion.action).toBe("exit");
      expect(suggestion.reason).toContain("Time limit exceeded");
    });

    it("should handle time-out with exit action when completed but no next SCO", () => {
      // Create single SCO with exit action
      const singleTracker = new ScoStateTracker();
      const singleDefs: ScoDefinition[] = [
        {
          id: "only",
          title: "Only SCO",
          launchUrl: "only.html",
          timeLimitAction: "exit,message",
          sequenceIndex: 0,
        },
      ];

      const singleSequencer = new Scorm12Sequencer(singleDefs, singleTracker);

      singleTracker.updateFromCmiData("only", {
        core: { lesson_status: "completed" },
      });

      const suggestion = singleSequencer.processExitAction("only", "time-out");
      expect(suggestion.action).toBe("exit");
      expect(suggestion.reason).toContain("Time limit exceeded");
    });
  });
});
