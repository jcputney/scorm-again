/**
 * Course Rollup Calculator
 *
 * Calculates aggregate course-level statistics from individual SCO data.
 * Useful for determining overall course completion, scores, and status.
 *
 * @example
 * ```typescript
 * const calculator = new CourseRollupCalculator(stateTracker, {
 *   scoreMethod: 'average',
 *   completionMethod: 'all',
 *   statusMethod: 'all_passed'
 * });
 *
 * const result = calculator.calculate();
 * console.log(`Course score: ${result.score}%`);
 * console.log(`Completion: ${result.completionPercentage}%`);
 * console.log(`Status: ${result.status}`);
 * ```
 */

import {
  RollupOptions,
  CourseRollupResult,
  LessonStatus,
  DEFAULT_ROLLUP_OPTIONS,
} from "./types";
import { ScoStateTracker } from "./sco_state_tracker";
import { addScormTime } from "./time_utilities";

/**
 * Calculates course-level rollup from individual SCO states
 */
export class CourseRollupCalculator {
  private _stateTracker: ScoStateTracker;
  private _options: RollupOptions;

  /**
   * Create a new rollup calculator
   *
   * @param stateTracker The state tracker containing SCO states
   * @param options Rollup calculation options
   */
  constructor(
    stateTracker: ScoStateTracker,
    options: Partial<RollupOptions> = {},
  ) {
    this._stateTracker = stateTracker;
    this._options = { ...DEFAULT_ROLLUP_OPTIONS, ...options };
  }

  /**
   * Update rollup options
   */
  setOptions(options: Partial<RollupOptions>): void {
    this._options = { ...this._options, ...options };
  }

  /**
   * Calculate course rollup from current SCO states
   */
  calculate(): CourseRollupResult {
    const states = this._stateTracker.getAllStates();

    if (states.length === 0) {
      return {
        completionPercentage: 0,
        status: "not attempted",
        totalTime: "0000:00:00.00",
        completedCount: 0,
        totalCount: 0,
        scoResults: [],
      };
    }

    // Calculate completion
    const completedStatuses = this._options.completedStatuses ?? [
      "passed",
      "completed",
      "failed",
    ];
    const completedScos = states.filter((s) =>
      completedStatuses.includes(s.lessonStatus),
    );
    const completedCount = completedScos.length;
    const completionPercentage = Math.round(
      (completedCount / states.length) * 100,
    );

    // Calculate score
    const score = this._calculateScore(states);

    // Calculate total time
    const totalTime = this._calculateTotalTime(states);

    // Determine overall status
    const status = this._determineStatus(states, score);

    // Build detailed results
    const scoResults = states.map((state) => ({
      id: state.id,
      title: state.title,
      status: state.lessonStatus,
      score:
        state.score.raw !== undefined
          ? state.score.raw
          : state.score.scaled !== undefined
            ? state.score.scaled * 100
            : undefined,
      contributedToCompletion: completedStatuses.includes(state.lessonStatus),
    }));

    return {
      score,
      completionPercentage,
      status,
      totalTime,
      completedCount,
      totalCount: states.length,
      scoResults,
    };
  }

  /**
   * Calculate just the course score
   */
  calculateScore(): number | undefined {
    return this._calculateScore(this._stateTracker.getAllStates());
  }

  /**
   * Calculate just the completion percentage
   */
  calculateCompletionPercentage(): number {
    const states = this._stateTracker.getAllStates();
    if (states.length === 0) return 0;

    const completedStatuses = this._options.completedStatuses ?? [
      "passed",
      "completed",
      "failed",
    ];
    const completedCount = states.filter((s) =>
      completedStatuses.includes(s.lessonStatus),
    ).length;

    return Math.round((completedCount / states.length) * 100);
  }

  /**
   * Check if course is complete based on completion method
   */
  isCourseComplete(): boolean {
    const states = this._stateTracker.getAllStates();
    if (states.length === 0) return false;

    const completedStatuses = this._options.completedStatuses ?? [
      "passed",
      "completed",
      "failed",
    ];
    const completedCount = states.filter((s) =>
      completedStatuses.includes(s.lessonStatus),
    ).length;

    switch (this._options.completionMethod) {
      case "all":
        return completedCount === states.length;
      case "any":
        return completedCount > 0;
      case "percentage": {
        const threshold = this._options.completionThreshold ?? 100;
        return (completedCount / states.length) * 100 >= threshold;
      }
      default:
        return completedCount === states.length;
    }
  }

  /**
   * Check if course is passed based on status method
   */
  isCoursePassed(): boolean {
    const states = this._stateTracker.getAllStates();
    if (states.length === 0) return false;

    switch (this._options.statusMethod) {
      case "all_passed":
        return states.every((s) => s.lessonStatus === "passed");

      case "any_passed":
        return states.some((s) => s.lessonStatus === "passed");

      case "score_threshold": {
        const score = this._calculateScore(states);
        const threshold = this._options.passingScore ?? 80;
        return score !== undefined && score >= threshold;
      }

      case "completion_only":
        return this.isCourseComplete();

      default:
        return states.every((s) => s.lessonStatus === "passed");
    }
  }

  // Private calculation methods

  private _calculateScore(
    states: ReturnType<ScoStateTracker["getAllStates"]>,
  ): number | undefined {
    // Get SCOs with valid scores
    const scosWithScores = states.filter(
      (s) => s.score.scaled !== undefined || s.score.raw !== undefined,
    );

    if (scosWithScores.length === 0) {
      return undefined;
    }

    // Normalize all scores to 0-100 scale
    const normalizedScores = scosWithScores.map((s) => {
      if (s.score.scaled !== undefined) {
        return { id: s.id, score: s.score.scaled * 100 };
      }
      // Use raw score, assuming 0-100 if no min/max
      const min = s.score.min ?? 0;
      const max = s.score.max ?? 100;
      const raw = s.score.raw ?? 0;
      if (max === min) return { id: s.id, score: 0 };
      return { id: s.id, score: ((raw - min) / (max - min)) * 100 };
    });

    switch (this._options.scoreMethod) {
      case "average":
        return (
          normalizedScores.reduce((sum, s) => sum + s.score, 0) /
          normalizedScores.length
        );

      case "weighted": {
        const weights = this._options.weights ?? new Map();
        let totalWeight = 0;
        let weightedSum = 0;

        for (const { id, score } of normalizedScores) {
          const weight = weights.get(id) ?? 1;
          totalWeight += weight;
          weightedSum += score * weight;
        }

        return totalWeight > 0 ? weightedSum / totalWeight : undefined;
      }

      case "highest":
        return Math.max(...normalizedScores.map((s) => s.score));

      case "lowest":
        return Math.min(...normalizedScores.map((s) => s.score));

      case "sum":
        // Cap at 100
        return Math.min(
          100,
          normalizedScores.reduce((sum, s) => sum + s.score, 0),
        );

      case "last": {
        // Return score of last completed SCO
        const lastCompleted = states
          .filter(
            (s) =>
              (s.score.scaled !== undefined || s.score.raw !== undefined) &&
              s.lastAccessTime,
          )
          .sort(
            (a, b) =>
              (b.lastAccessTime?.getTime() ?? 0) -
              (a.lastAccessTime?.getTime() ?? 0),
          )[0];

        if (lastCompleted) {
          const found = normalizedScores.find((s) => s.id === lastCompleted.id);
          return found?.score;
        }
        return undefined;
      }

      default:
        return (
          normalizedScores.reduce((sum, s) => sum + s.score, 0) /
          normalizedScores.length
        );
    }
  }

  private _calculateTotalTime(
    states: ReturnType<ScoStateTracker["getAllStates"]>,
  ): string {
    let totalTime = "0000:00:00.00";

    for (const state of states) {
      if (state.totalTime && state.totalTime !== "0000:00:00.00") {
        totalTime = addScormTime(totalTime, state.totalTime);
      }
    }

    return totalTime;
  }

  private _determineStatus(
    states: ReturnType<ScoStateTracker["getAllStates"]>,
    score: number | undefined,
  ): LessonStatus {
    if (states.length === 0) {
      return "not attempted";
    }

    // Check if any have been attempted
    const anyAttempted = states.some(
      (s) => s.lessonStatus !== "not attempted" && s.hasBeenLaunched,
    );
    if (!anyAttempted) {
      return "not attempted";
    }

    // Check for any failures
    const anyFailed = states.some((s) => s.lessonStatus === "failed");

    // Check completion
    const isComplete = this.isCourseComplete();

    // Determine based on status method
    switch (this._options.statusMethod) {
      case "all_passed":
        if (states.every((s) => s.lessonStatus === "passed")) {
          return "passed";
        }
        if (anyFailed) {
          return "failed";
        }
        return isComplete ? "completed" : "incomplete";

      case "any_passed":
        if (states.some((s) => s.lessonStatus === "passed")) {
          return "passed";
        }
        if (anyFailed && !states.some((s) => s.lessonStatus === "incomplete")) {
          return "failed";
        }
        return isComplete ? "completed" : "incomplete";

      case "score_threshold": {
        const threshold = this._options.passingScore ?? 80;
        if (score !== undefined) {
          if (score >= threshold) {
            return "passed";
          }
          // Only mark failed if complete
          if (isComplete) {
            return "failed";
          }
        }
        return isComplete ? "completed" : "incomplete";
      }

      case "completion_only":
        return isComplete ? "completed" : "incomplete";

      default:
        if (isComplete) {
          return states.every((s) => s.lessonStatus === "passed")
            ? "passed"
            : anyFailed
              ? "failed"
              : "completed";
        }
        return "incomplete";
    }
  }
}
