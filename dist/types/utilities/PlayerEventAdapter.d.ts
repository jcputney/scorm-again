import Scorm12API from "../Scorm12API";
import Scorm2004API from "../Scorm2004API";
export interface NavigationState {
    canPrevious: boolean;
    canNext: boolean;
    canExit: boolean;
    choices: string[];
    validRequests: string[];
}
export interface ScoStatus {
    completion: "not attempted" | "incomplete" | "completed" | "unknown";
    success: "passed" | "failed" | "unknown";
    score: number | null;
    scaledScore: number | null;
    location: string;
    timeSpent: number;
}
export interface CourseProgress {
    completionPct: number;
    avgScore: number | null;
    totalTime: number;
    overallStatus: "not attempted" | "incomplete" | "completed" | "passed" | "failed";
    completedCount: number;
    totalCount: number;
}
export interface ScoDelivery {
    id: string;
    title: string;
    launchUrl: string;
    parameters: string;
}
export type SessionEndReason = "complete" | "suspend" | "exit" | "timeout" | "abandon";
export interface SessionEndData {
    exception?: string | undefined;
    navigationRequest?: string | undefined;
    progress: CourseProgress;
}
export interface PlayerEventAdapterCallbacks {
    onNavigationStateChange?: (state: NavigationState) => void;
    onScoStatusChange?: (scoId: string, status: ScoStatus) => void;
    onCourseProgressChange?: (progress: CourseProgress) => void;
    onScoDelivery?: (sco: ScoDelivery) => void;
    onSessionEnd?: (reason: SessionEndReason, data: SessionEndData) => void;
}
export interface PlayerEventAdapterConfig {
    scoDefinitions?: Array<{
        id: string;
        title: string;
        launchUrl: string;
    }>;
    getCurrentScoId?: () => string | null;
}
export declare class PlayerEventAdapter {
    private api;
    private callbacks;
    private config;
    private isScorm2004;
    private cleanupFns;
    constructor(api: Scorm12API | Scorm2004API, callbacks: PlayerEventAdapterCallbacks, config?: PlayerEventAdapterConfig);
    private setupEventListeners;
    private setupScorm12Listeners;
    private setupScorm2004Listeners;
    handleNavigationValidityUpdate(data: {
        validRequests: string[];
    }): void;
    handleActivityDelivery(activity: {
        id: string;
        title?: string;
        resourceIdentifier?: string;
        parameters?: string;
    }): void;
    handleRollupComplete(activity: {
        id: string;
    }): void;
    handleSequencingSessionEnd(data: {
        reason: string;
        exception?: string;
        navigationRequest?: string;
    }): void;
    private emitNavigationStateChange;
    private emitScoStatusChange;
    private emitCourseProgressChange;
    private getScoStatus;
    private mapLessonStatusToCompletion;
    private mapLessonStatusToSuccess;
    private calculateCourseProgress;
    private parseTime12;
    private parseTime2004;
    destroy(): void;
}
export default PlayerEventAdapter;
//# sourceMappingURL=PlayerEventAdapter.d.ts.map