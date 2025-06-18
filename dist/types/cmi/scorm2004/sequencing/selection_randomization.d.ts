import { Activity } from "./activity";
export declare class SelectionRandomization {
    static selectChildrenProcess(activity: Activity): Activity[];
    static randomizeChildrenProcess(activity: Activity): Activity[];
    static applySelectionAndRandomization(activity: Activity, isNewAttempt?: boolean): Activity[];
    static isSelectionNeeded(activity: Activity): boolean;
    static isRandomizationNeeded(activity: Activity): boolean;
}
