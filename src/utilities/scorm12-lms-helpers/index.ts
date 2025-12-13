/**
 * SCORM 1.2 LMS Helper Utilities
 *
 * These utilities help LMS developers implement multi-SCO SCORM 1.2 course support.
 * They are designed to work alongside the Scorm12API, not replace it.
 *
 * Key components:
 * - ScoStateTracker: Tracks runtime state for all SCOs in a course
 * - Scorm12Sequencer: Provides navigation helpers (next/previous/choice)
 * - CourseRollupCalculator: Calculates aggregate course statistics
 *
 * @example
 * ```typescript
 * import {
 *   ScoStateTracker,
 *   Scorm12Sequencer,
 *   CourseRollupCalculator,
 * } from 'scorm-again/utilities/scorm12-lms-helpers';
 *
 * // Initialize
 * const tracker = new ScoStateTracker();
 * const sequencer = new Scorm12Sequencer(scoDefinitions, tracker);
 * const calculator = new CourseRollupCalculator(tracker);
 * ```
 *
 * @module scorm12-lms-helpers
 */

// Types
export {
  LessonStatus,
  ExitAction,
  ScoScore,
  ScoState,
  ScoDefinition,
  NavigationSuggestion,
  RollupOptions,
  CourseRollupResult,
  ScoStateChangeEvent,
  DEFAULT_ROLLUP_OPTIONS,
} from "./types";

// State Tracker
export {
  ScoStateTracker,
  StateChangeListener,
  ScormCmiData,
} from "./sco_state_tracker";

// Sequencer
export {
  Scorm12Sequencer,
  ScoAvailabilityFilter,
} from "./scorm12_sequencer";

// Rollup Calculator
export { CourseRollupCalculator } from "./course_rollup_calculator";

// Time Utilities
export {
  parseScormTime,
  formatScormTime,
  addScormTime,
  compareScormTime,
  hasExceededTimeLimit,
  formatHumanReadable,
  scormTimeToHumanReadable,
} from "./time_utilities";
