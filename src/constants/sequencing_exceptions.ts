/**
 * SCORM 2004 Sequencing Exception Codes
 * These constants define all possible exception codes that can be returned
 * by the sequencing and navigation processes.
 */

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
  // Termination exceptions
  ...TerminationExceptions,

  // Flow exceptions
  ...FlowTreeTraversalExceptions,
  ...FlowActivityTraversalExceptions,

  // Navigation request exceptions
  ...ContinueExceptions,
  ...PreviousExceptions,
  ...ChoiceExceptions,
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
