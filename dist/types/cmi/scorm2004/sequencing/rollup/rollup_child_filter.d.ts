import { Activity, RollupConsiderationsConfig } from "../activity";
export type RollupType = "measure" | "objective" | "progress";
export type RollupAction = "satisfied" | "notSatisfied" | "completed" | "incomplete";
export declare class RollupChildFilter {
    checkChildForRollupSubprocess(child: Activity, rollupType: RollupType, rollupAction?: RollupAction): boolean;
    filterChildrenForRequirement(children: Activity[], rollupType: "objective" | "progress", mode: RollupAction, considerations: RollupConsiderationsConfig): Activity[];
    shouldIncludeChildForRollup(child: Activity, rollupType: "objective" | "progress", mode: RollupAction, considerations: RollupConsiderationsConfig): boolean;
    isChildSatisfiedForRollup(child: Activity): boolean;
    isChildCompletedForRollup(child: Activity): boolean;
    getTrackableChildren(activity: Activity): Activity[];
}
//# sourceMappingURL=rollup_child_filter.d.ts.map