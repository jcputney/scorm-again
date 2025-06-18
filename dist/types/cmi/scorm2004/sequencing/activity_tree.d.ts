import { BaseCMI } from "../../common/base_cmi";
import { Activity } from "./activity";
export declare class ActivityTree extends BaseCMI {
    private _root;
    private _currentActivity;
    private _suspendedActivity;
    private _activities;
    constructor();
    initialize(): void;
    reset(): void;
    get root(): Activity | null;
    set root(root: Activity | null);
    private _addActivitiesToMap;
    get currentActivity(): Activity | null;
    set currentActivity(activity: Activity | null);
    get suspendedActivity(): Activity | null;
    set suspendedActivity(activity: Activity | null);
    getActivity(id: string): Activity | null;
    getAllActivities(): Activity[];
    getParent(activity: Activity): Activity | null;
    getChildren(activity: Activity, useAvailableChildren?: boolean): Activity[];
    getSiblings(activity: Activity): Activity[];
    getNextSibling(activity: Activity, useAvailableChildren?: boolean): Activity | null;
    getPreviousSibling(activity: Activity, useAvailableChildren?: boolean): Activity | null;
    getFirstChild(activity: Activity, useAvailableChildren?: boolean): Activity | null;
    getLastChild(activity: Activity, useAvailableChildren?: boolean): Activity | null;
    getCommonAncestor(activity1: Activity, activity2: Activity): Activity | null;
    toJSON(): object;
}
