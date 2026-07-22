export type CompletionStatusThresholdInput = {
    completionThreshold?: number | string | null | undefined;
    progressMeasure?: number | string | null | undefined;
    storedCompletionStatus?: string | null | undefined;
};
export declare function evaluateCompletionStatusFromThreshold({ completionThreshold, progressMeasure, storedCompletionStatus, }: CompletionStatusThresholdInput): string;
//# sourceMappingURL=completion_status_evaluation.d.ts.map