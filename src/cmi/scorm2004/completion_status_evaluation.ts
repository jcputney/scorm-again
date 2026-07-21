import { CompletionStatus } from "../../constants/enums";

export type CompletionStatusThresholdInput = {
  completionThreshold?: number | string | null | undefined;
  progressMeasure?: number | string | null | undefined;
  storedCompletionStatus?: string | null | undefined;
};

/**
 * Evaluate cmi.completion_status from completion_threshold and progress_measure.
 *
 * @spec SCORM 2004 4th Ed. RTE 4.2.4.1a / RTE 4.2.9
 */
export function evaluateCompletionStatusFromThreshold({
  completionThreshold,
  progressMeasure,
  storedCompletionStatus,
}: CompletionStatusThresholdInput): string {
  if (
    completionThreshold !== "" &&
    completionThreshold !== null &&
    completionThreshold !== undefined
  ) {
    const thresholdValue = parseFloat(String(completionThreshold));

    if (!isNaN(thresholdValue)) {
      if (progressMeasure !== "" && progressMeasure !== null && progressMeasure !== undefined) {
        const progressValue = parseFloat(String(progressMeasure));

        if (!isNaN(progressValue)) {
          return progressValue >= thresholdValue
            ? CompletionStatus.COMPLETED
            : CompletionStatus.INCOMPLETE;
        }
      }

      return CompletionStatus.UNKNOWN;
    }
  }

  return storedCompletionStatus || CompletionStatus.UNKNOWN;
}
