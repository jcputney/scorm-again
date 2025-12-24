/**
 * Interface representing a SCORM 2004 Activity for use in event listeners and type declarations.
 * This interface breaks the circular dependency between sequencing_types.ts and activity.ts
 * by defining the public API surface that event listeners need.
 */

import { CompletionStatus, SuccessStatus } from "../constants/enums";

/**
 * Interface for Activity objects passed to sequencing event listeners.
 * Defines the read-only public properties that event handlers typically need.
 */
export interface IActivity {
  /** Unique identifier for the activity */
  readonly id: string;

  /** Display title of the activity */
  readonly title: string;

  /** Whether the activity is currently visible in navigation */
  readonly isVisible: boolean;

  /** Whether the activity is currently active (being delivered) */
  readonly isActive: boolean;

  /** Whether the activity is in a suspended state */
  readonly isSuspended: boolean;

  /** Whether the activity has been completed */
  readonly isCompleted: boolean;

  /** The completion status of the activity */
  readonly completionStatus: CompletionStatus;

  /** The success status of the activity */
  readonly successStatus: SuccessStatus;

  /** Number of attempts made on this activity */
  readonly attemptCount: number;

  /** Whether the objective satisfied status is known */
  readonly objectiveSatisfiedStatus: boolean;

  /** Whether the objective measure status is valid */
  readonly objectiveMeasureStatus: boolean;

  /** The normalized measure (score) for the objective */
  readonly objectiveNormalizedMeasure: number;

  /** Parent activity in the activity tree (null if root) */
  readonly parent: IActivity | null;

  /** Child activities in the activity tree */
  readonly children: IActivity[];

  /** Whether this activity is hidden from choice navigation */
  readonly isHiddenFromChoice: boolean;

  /** Whether this activity is available for delivery */
  readonly isAvailable: boolean;

  /** Location bookmark within the activity */
  readonly location: string;

  /** Progress measure for the activity */
  readonly progressMeasure: number;

  /** Whether progress measure status is valid */
  readonly progressMeasureStatus: boolean;
}
