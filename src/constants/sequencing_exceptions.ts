/**
 * SCORM 2004 Sequencing Exception Codes
 * These constants define all possible exception codes that can be returned
 * by the sequencing and navigation processes.
 */

/**
 * Navigation Request Process (NB.2.1) Exception Codes
 */
export const NavigationExceptions = {
  "NB.2.1-1": "Sequencing session already started",
  "NB.2.1-2": "Current activity not defined / sequencing not begun",
  "NB.2.1-3": "No suspended activity to resume",
  "NB.2.1-4": "Flow not enabled / current activity is root",
  "NB.2.1-5": "Violates control mode (forward only or flow disabled)",
  "NB.2.1-6": "Cannot move backward from root",
  "NB.2.1-7": "Forward/Backward navigation not supported",
  "NB.2.1-8": "Forward-only constraint violation",
  "NB.2.1-9": "Activity path empty",
  "NB.2.1-10": "Choice control disabled on parent",
  "NB.2.1-11": "Target activity does not exist",
  "NB.2.1-12": "Activity already terminated",
  "NB.2.1-13": "Undefined navigation request",
  "NB.2.1-14": "No current activity for EXIT_ALL",
  "NB.2.1-15": "No current activity for ABANDON",
  "NB.2.1-16": "No current activity for ABANDON_ALL",
  "NB.2.1-17": "No current activity for SUSPEND_ALL",
  "NB.2.1-18": "Invalid navigation request type",
};

/**
 * Termination Request Process (TB.2.3) Exception Codes
 */
export const TerminationExceptions = {
  "TB.2.3-1": "No current activity to terminate",
  "TB.2.3-2": "Current activity already terminated",
  "TB.2.3-4": "Cannot EXIT_PARENT from root activity",
  "TB.2.3-5": "Activity path is empty during suspend",
};

/**
 * Flow Tree Traversal Subprocess (SB.2.1) Exception Codes
 */
export const FlowTreeTraversalExceptions = {
  "SB.2.1-2": "No available children to deliver",
  "SB.2.1-3": "Reached beginning of course",
};

/**
 * Flow Activity Traversal Subprocess (SB.2.2) Exception Codes
 */
export const FlowActivityTraversalExceptions = {
  "SB.2.2-1": "Flow control disabled on parent",
  "SB.2.2-2": "Activity not available",
};

/**
 * Continue Sequencing Request Process (SB.2.7) Exception Codes
 */
export const ContinueExceptions = {
  "SB.2.7-1": "Sequencing session not begun (current activity not terminated)",
  "SB.2.7-2": "Cannot continue - flow disabled or no activity available",
};

/**
 * Previous Sequencing Request Process (SB.2.8) Exception Codes
 */
export const PreviousExceptions = {
  "SB.2.8-1": "Current activity not terminated",
  "SB.2.8-2": "Cannot go previous - at beginning or forwardOnly enabled",
};

/**
 * Choice Sequencing Request Process (SB.2.9) Exception Codes
 */
export const ChoiceExceptions = {
  "SB.2.9-1": "Target activity does not exist",
  "SB.2.9-2": "Target activity not in tree",
  "SB.2.9-3": "Cannot choose root activity",
  "SB.2.9-4": "Activity hidden from choice",
  "SB.2.9-5": "Choice control is not allowed",
  "SB.2.9-6": "Current activity not terminated",
  "SB.2.9-7": "No activity available from target",
};

/**
 * Retry Sequencing Request Process (SB.2.10) Exception Codes
 */
export const RetryExceptions = {
  "SB.2.10-1": "Current activity not defined",
  "SB.2.10-2": "Activity is still active or suspended",
  "SB.2.10-3": "Flow subprocess returned false (nothing to deliver)",
};

/**
 * Exit Sequencing Request Process (SB.2.11) Exception Codes
 */
export const ExitExceptions = {
  "SB.2.11-1": "Exit not allowed - no parent",
  "SB.2.11-2": "Exit not allowed by sequencing controls",
};

/**
 * Sequencing Request Process (SB.2.12) Exception Codes
 */
export const SequencingRequestExceptions = {
  "SB.2.12-1": "No current activity",
  "SB.2.12-5": "No target activity specified",
  "SB.2.12-6": "Undefined sequencing request",
};

/**
 * Jump Sequencing Request Process (SB.2.13) Exception Codes
 */
export const JumpExceptions = {
  "SB.2.13-1": "Target activity does not exist",
  "SB.2.13-2": "Target activity not in tree",
  "SB.2.13-3": "Target not available",
};

/**
 * Start Sequencing Request Process (SB.2.5) Exception Codes
 */
export const StartExceptions = {
  "SB.2.5-1": "No activity tree",
  "SB.2.5-2": "Sequencing session already begun",
  "SB.2.5-3": "No activity available",
};

/**
 * Resume All Sequencing Request Process (SB.2.6) Exception Codes
 */
export const ResumeExceptions = {
  "SB.2.6-1": "No suspended activity",
  "SB.2.6-2": "Current activity already defined",
};

/**
 * Suspend All Sequencing Request Process (SB.2.15) Exception Codes
 */
export const SuspendExceptions = {
  "SB.2.15-1": "Cannot suspend root",
};

/**
 * All Sequencing Exception Codes
 * Combined mapping of all exception codes to their descriptions
 */
export const SequencingExceptions = {
  // Navigation exceptions
  ...NavigationExceptions,

  // Termination exceptions
  ...TerminationExceptions,

  // Flow exceptions
  ...FlowTreeTraversalExceptions,
  ...FlowActivityTraversalExceptions,

  // Sequencing request exceptions
  ...ContinueExceptions,
  ...PreviousExceptions,
  ...ChoiceExceptions,
  ...RetryExceptions,
  ...ExitExceptions,
  ...SequencingRequestExceptions,
  ...JumpExceptions,
  ...StartExceptions,
  ...ResumeExceptions,
  ...SuspendExceptions,
};

/**
 * Helper function to get exception description
 * @param code - The exception code
 * @returns The human-readable description of the exception
 */
export function getExceptionDescription(code: string): string {
  return SequencingExceptions[code as keyof typeof SequencingExceptions] || "Unknown exception";
}
