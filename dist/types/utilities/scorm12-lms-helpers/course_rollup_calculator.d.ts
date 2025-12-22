import { RollupOptions, CourseRollupResult } from "./types";
import { ScoStateTracker } from "./sco_state_tracker";
export declare class CourseRollupCalculator {
    private _stateTracker;
    private _options;
    constructor(stateTracker: ScoStateTracker, options?: Partial<RollupOptions>);
    setOptions(options: Partial<RollupOptions>): void;
    calculate(): CourseRollupResult;
    calculateScore(): number | undefined;
    calculateCompletionPercentage(): number;
    isCourseComplete(): boolean;
    isCoursePassed(): boolean;
    private _calculateScore;
    private _calculateTotalTime;
    private _determineStatus;
}
//# sourceMappingURL=course_rollup_calculator.d.ts.map