export type LessonStatus = "passed" | "completed" | "failed" | "incomplete" | "browsed" | "not attempted";
export type ExitAction = "time-out" | "suspend" | "logout" | "";
export interface ScoScore {
    raw?: number;
    min?: number;
    max?: number;
    scaled?: number;
}
export interface ScoState {
    id: string;
    title: string;
    lessonStatus: LessonStatus;
    score: ScoScore;
    totalTime: string;
    sessionTime: string;
    masteryScore?: number | undefined;
    exitAction: ExitAction;
    suspendData: string;
    lessonLocation: string;
    attemptCount: number;
    firstLaunchTime?: Date | undefined;
    lastAccessTime?: Date | undefined;
    hasBeenLaunched: boolean;
}
export interface ScoDefinition {
    id: string;
    title: string;
    launchUrl: string;
    masteryScore?: number;
    maxTimeAllowed?: string;
    timeLimitAction?: "exit,message" | "exit,no message" | "continue,message" | "continue,no message";
    sequenceIndex: number;
    metadata?: Record<string, unknown>;
}
export interface NavigationSuggestion {
    action: "continue" | "previous" | "choice" | "suspend" | "exit" | "retry";
    targetScoId?: string;
    reason: string;
}
export interface RollupOptions {
    scoreMethod: "average" | "weighted" | "highest" | "lowest" | "sum" | "last";
    weights?: Map<string, number>;
    completionMethod: "all" | "any" | "percentage";
    completionThreshold?: number;
    statusMethod: "all_passed" | "any_passed" | "score_threshold" | "completion_only";
    passingScore?: number;
    completedStatuses?: LessonStatus[];
}
export interface CourseRollupResult {
    score?: number | undefined;
    completionPercentage: number;
    status: LessonStatus;
    totalTime: string;
    completedCount: number;
    totalCount: number;
    scoResults: Array<{
        id: string;
        title: string;
        status: LessonStatus;
        score?: number | undefined;
        contributedToCompletion: boolean;
    }>;
}
export interface ScoStateChangeEvent {
    scoId: string;
    previousState: ScoState | null;
    currentState: ScoState;
    changedFields: Array<keyof ScoState>;
}
export declare const DEFAULT_ROLLUP_OPTIONS: RollupOptions;
//# sourceMappingURL=types.d.ts.map