import { describe, it, expect, beforeEach } from "vitest";
import { CourseRollupCalculator } from "../../../src/utilities/scorm12-lms-helpers/course_rollup_calculator";
import { ScoStateTracker } from "../../../src/utilities/scorm12-lms-helpers/sco_state_tracker";

describe("CourseRollupCalculator", () => {
  let tracker: ScoStateTracker;
  let calculator: CourseRollupCalculator;

  beforeEach(() => {
    tracker = new ScoStateTracker();
    tracker.initializeSco("sco1", "SCO 1");
    tracker.initializeSco("sco2", "SCO 2");
    tracker.initializeSco("sco3", "SCO 3");

    calculator = new CourseRollupCalculator(tracker);
  });

  describe("calculate - basic", () => {
    it("should return not attempted when no SCOs have data", () => {
      const result = calculator.calculate();

      expect(result.status).toBe("not attempted");
      expect(result.completionPercentage).toBe(0);
      expect(result.completedCount).toBe(0);
      expect(result.totalCount).toBe(3);
    });

    it("should return correct counts for mixed completion", () => {
      tracker.updateFromCmiData("sco1", {
        core: { lesson_status: "completed" },
      });
      tracker.updateFromCmiData("sco2", {
        core: { lesson_status: "passed" },
      });

      const result = calculator.calculate();

      expect(result.completedCount).toBe(2);
      expect(result.completionPercentage).toBe(67); // 2/3 rounded
    });

    it("should calculate total time correctly", () => {
      tracker.updateFromCmiData("sco1", {
        core: { session_time: "0000:30:00.00" },
      });
      tracker.updateFromCmiData("sco2", {
        core: { session_time: "0000:45:00.00" },
      });

      const result = calculator.calculate();

      expect(result.totalTime).toBe("0001:15:00.00");
    });
  });

  describe("score calculation methods", () => {
    beforeEach(() => {
      tracker.updateFromCmiData("sco1", {
        core: { score: { raw: 80, min: 0, max: 100 } },
      });
      tracker.updateFromCmiData("sco2", {
        core: { score: { raw: 90, min: 0, max: 100 } },
      });
      tracker.updateFromCmiData("sco3", {
        core: { score: { raw: 70, min: 0, max: 100 } },
      });
    });

    it("should calculate average score", () => {
      calculator.setOptions({ scoreMethod: "average" });
      const result = calculator.calculate();

      expect(result.score).toBe(80); // (80+90+70)/3
    });

    it("should calculate highest score", () => {
      calculator.setOptions({ scoreMethod: "highest" });
      const result = calculator.calculate();

      expect(result.score).toBe(90);
    });

    it("should calculate lowest score", () => {
      calculator.setOptions({ scoreMethod: "lowest" });
      const result = calculator.calculate();

      expect(result.score).toBe(70);
    });

    it("should calculate weighted score", () => {
      const weights = new Map([
        ["sco1", 0.2],
        ["sco2", 0.3],
        ["sco3", 0.5],
      ]);

      calculator.setOptions({ scoreMethod: "weighted", weights });
      const result = calculator.calculate();

      // (80*0.2 + 90*0.3 + 70*0.5) / 1.0 = 16 + 27 + 35 = 78
      expect(result.score).toBe(78);
    });

    it("should calculate sum score (capped at 100)", () => {
      calculator.setOptions({ scoreMethod: "sum" });
      const result = calculator.calculate();

      expect(result.score).toBe(100); // Capped at 100
    });

    it("should handle normalized scores", () => {
      // Reset and use non-standard min/max
      tracker = new ScoStateTracker();
      tracker.initializeSco("sco1", "SCO 1");
      tracker.updateFromCmiData("sco1", {
        core: { score: { raw: 75, min: 50, max: 100 } },
      });

      calculator = new CourseRollupCalculator(tracker);
      const result = calculator.calculate();

      // Normalized: (75-50)/(100-50) = 0.5, which is 50%
      expect(result.score).toBe(50);
    });
  });

  describe("completion methods", () => {
    it("should use 'all' completion method by default", () => {
      tracker.updateFromCmiData("sco1", {
        core: { lesson_status: "completed" },
      });
      tracker.updateFromCmiData("sco2", {
        core: { lesson_status: "completed" },
      });
      // sco3 not completed

      expect(calculator.isCourseComplete()).toBe(false);
    });

    it("should complete with 'any' method", () => {
      calculator.setOptions({ completionMethod: "any" });

      tracker.updateFromCmiData("sco1", {
        core: { lesson_status: "completed" },
      });

      expect(calculator.isCourseComplete()).toBe(true);
    });

    it("should use percentage threshold", () => {
      calculator.setOptions({
        completionMethod: "percentage",
        completionThreshold: 66,
      });

      tracker.updateFromCmiData("sco1", {
        core: { lesson_status: "completed" },
      });
      tracker.updateFromCmiData("sco2", {
        core: { lesson_status: "completed" },
      });

      expect(calculator.isCourseComplete()).toBe(true); // 67% > 66%
    });
  });

  describe("status methods", () => {
    describe("all_passed", () => {
      beforeEach(() => {
        calculator.setOptions({ statusMethod: "all_passed" });
      });

      it("should return passed when all passed", () => {
        tracker.updateFromCmiData("sco1", {
          core: { lesson_status: "passed" },
        });
        tracker.updateFromCmiData("sco2", {
          core: { lesson_status: "passed" },
        });
        tracker.updateFromCmiData("sco3", {
          core: { lesson_status: "passed" },
        });

        const result = calculator.calculate();
        expect(result.status).toBe("passed");
      });

      it("should return failed when any failed", () => {
        tracker.updateFromCmiData("sco1", {
          core: { lesson_status: "passed" },
        });
        tracker.updateFromCmiData("sco2", {
          core: { lesson_status: "failed" },
        });
        tracker.updateFromCmiData("sco3", {
          core: { lesson_status: "passed" },
        });

        const result = calculator.calculate();
        expect(result.status).toBe("failed");
      });
    });

    describe("any_passed", () => {
      beforeEach(() => {
        calculator.setOptions({ statusMethod: "any_passed" });
      });

      it("should return passed when any passed", () => {
        tracker.updateFromCmiData("sco1", {
          core: { lesson_status: "passed" },
        });
        tracker.updateFromCmiData("sco2", {
          core: { lesson_status: "incomplete" },
        });
        tracker.markLaunched("sco1");

        const result = calculator.calculate();
        expect(result.status).toBe("passed");
      });
    });

    describe("score_threshold", () => {
      beforeEach(() => {
        calculator.setOptions({
          statusMethod: "score_threshold",
          passingScore: 80,
        });
      });

      it("should return passed when score meets threshold", () => {
        tracker.updateFromCmiData("sco1", {
          core: { lesson_status: "completed", score: { raw: 85 } },
        });
        tracker.updateFromCmiData("sco2", {
          core: { lesson_status: "completed", score: { raw: 90 } },
        });
        tracker.updateFromCmiData("sco3", {
          core: { lesson_status: "completed", score: { raw: 80 } },
        });
        tracker.markLaunched("sco1");

        const result = calculator.calculate();
        expect(result.status).toBe("passed");
        expect(result.score).toBeGreaterThanOrEqual(80);
      });

      it("should return failed when complete but score below threshold", () => {
        tracker.updateFromCmiData("sco1", {
          core: { lesson_status: "completed", score: { raw: 60 } },
        });
        tracker.updateFromCmiData("sco2", {
          core: { lesson_status: "completed", score: { raw: 70 } },
        });
        tracker.updateFromCmiData("sco3", {
          core: { lesson_status: "completed", score: { raw: 65 } },
        });
        tracker.markLaunched("sco1");

        const result = calculator.calculate();
        expect(result.status).toBe("failed");
      });
    });

    describe("completion_only", () => {
      beforeEach(() => {
        calculator.setOptions({ statusMethod: "completion_only" });
      });

      it("should return completed when all complete regardless of pass/fail", () => {
        tracker.updateFromCmiData("sco1", {
          core: { lesson_status: "passed" },
        });
        tracker.updateFromCmiData("sco2", {
          core: { lesson_status: "failed" },
        });
        tracker.updateFromCmiData("sco3", {
          core: { lesson_status: "completed" },
        });

        const result = calculator.calculate();
        expect(result.status).toBe("completed");
      });
    });
  });

  describe("isCoursePassed", () => {
    it("should return true when passing criteria met", () => {
      calculator.setOptions({ statusMethod: "all_passed" });

      tracker.updateFromCmiData("sco1", {
        core: { lesson_status: "passed" },
      });
      tracker.updateFromCmiData("sco2", {
        core: { lesson_status: "passed" },
      });
      tracker.updateFromCmiData("sco3", {
        core: { lesson_status: "passed" },
      });

      expect(calculator.isCoursePassed()).toBe(true);
    });

    it("should return false when not passed", () => {
      calculator.setOptions({ statusMethod: "all_passed" });

      tracker.updateFromCmiData("sco1", {
        core: { lesson_status: "passed" },
      });
      tracker.updateFromCmiData("sco2", {
        core: { lesson_status: "incomplete" },
      });

      expect(calculator.isCoursePassed()).toBe(false);
    });
  });

  describe("calculateCompletionPercentage", () => {
    it("should calculate percentage correctly", () => {
      tracker.updateFromCmiData("sco1", {
        core: { lesson_status: "completed" },
      });

      expect(calculator.calculateCompletionPercentage()).toBe(33); // 1/3 rounded
    });

    it("should return 0 for empty tracker", () => {
      const emptyTracker = new ScoStateTracker();
      const emptyCalc = new CourseRollupCalculator(emptyTracker);

      expect(emptyCalc.calculateCompletionPercentage()).toBe(0);
    });
  });

  describe("calculateScore", () => {
    it("should return undefined when no scores", () => {
      expect(calculator.calculateScore()).toBeUndefined();
    });

    it("should calculate score from available SCOs", () => {
      tracker.updateFromCmiData("sco1", {
        core: { score: { raw: 80 } },
      });
      tracker.updateFromCmiData("sco2", {
        core: { score: { raw: 100 } },
      });
      // sco3 has no score

      expect(calculator.calculateScore()).toBe(90); // (80+100)/2
    });
  });

  describe("scoResults in rollup", () => {
    it("should include detailed SCO results", () => {
      tracker.updateFromCmiData("sco1", {
        core: { lesson_status: "passed", score: { raw: 85 } },
      });

      const result = calculator.calculate();

      expect(result.scoResults).toHaveLength(3);

      const sco1Result = result.scoResults.find((r) => r.id === "sco1");
      expect(sco1Result?.status).toBe("passed");
      expect(sco1Result?.score).toBe(85);
      expect(sco1Result?.contributedToCompletion).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle empty state tracker", () => {
      const emptyTracker = new ScoStateTracker();
      const emptyCalc = new CourseRollupCalculator(emptyTracker);

      const result = emptyCalc.calculate();

      expect(result.status).toBe("not attempted");
      expect(result.totalCount).toBe(0);
      expect(result.completedCount).toBe(0);
    });

    it("should handle all SCOs with same score", () => {
      tracker.updateFromCmiData("sco1", {
        core: { score: { raw: 75 } },
      });
      tracker.updateFromCmiData("sco2", {
        core: { score: { raw: 75 } },
      });
      tracker.updateFromCmiData("sco3", {
        core: { score: { raw: 75 } },
      });

      calculator.setOptions({ scoreMethod: "average" });
      expect(calculator.calculateScore()).toBe(75);

      calculator.setOptions({ scoreMethod: "highest" });
      expect(calculator.calculateScore()).toBe(75);

      calculator.setOptions({ scoreMethod: "lowest" });
      expect(calculator.calculateScore()).toBe(75);
    });
  });
});
