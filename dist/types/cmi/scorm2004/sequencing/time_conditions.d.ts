import { Activity } from "./activity.js";
export type AttemptElapsedSecondsHook = (activity: Activity) => number;
export declare function isTimeLimitExceeded(activity: Activity, now: () => Date, getElapsedSeconds?: AttemptElapsedSecondsHook | null): boolean;
export declare function isOutsideAvailableTimeRange(activity: Activity, clock: () => Date): boolean;
//# sourceMappingURL=time_conditions.d.ts.map