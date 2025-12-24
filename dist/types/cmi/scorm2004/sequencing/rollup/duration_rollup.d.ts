import { Activity } from "../activity";
export type EventCallback = (eventType: string, data?: unknown) => void;
export declare class DurationRollupProcessor {
    private eventCallback;
    constructor(eventCallback?: EventCallback);
    durationRollupProcess(activity: Activity): void;
}
//# sourceMappingURL=duration_rollup.d.ts.map