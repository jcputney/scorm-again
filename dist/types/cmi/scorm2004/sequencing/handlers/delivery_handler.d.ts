import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { RollupProcess } from "../rollup_process";
import { ADLNav } from "../../adl";
import { AuxiliaryResource, HideLmsUiItem } from "../../../../types/sequencing_types";
export declare class DeliveryRequest {
    valid: boolean;
    targetActivity: Activity | null;
    exception: string | null;
    constructor(valid?: boolean, targetActivity?: Activity | null, exception?: string | null);
}
export interface ContentActivityData {
    hideLmsUi: HideLmsUiItem[];
    auxiliaryResources: AuxiliaryResource[];
    location: string;
    credit: string;
    launchData: string;
    maxTimeAllowed: string;
    completionThreshold: string;
    timeLimitAction: string;
}
export interface DeliveryHandlerOptions {
    now?: () => Date;
    defaultHideLmsUi?: HideLmsUiItem[];
    defaultAuxiliaryResources?: AuxiliaryResource[];
}
export declare class DeliveryHandler {
    private static readonly HIDE_LMS_UI_ORDER;
    private activityTree;
    private rollupProcess;
    private globalObjectiveMap;
    private adlNav;
    private eventCallback;
    private now;
    private defaultHideLmsUi;
    private defaultAuxiliaryResources;
    private _deliveryInProgress;
    private contentDelivered;
    private checkActivityCallback;
    private invalidateCacheCallback;
    private updateNavigationValidityCallback;
    private clearSuspendedActivityCallback;
    constructor(activityTree: ActivityTree, rollupProcess: RollupProcess, globalObjectiveMap: Map<string, any>, adlNav?: ADLNav | null, eventCallback?: ((eventType: string, data?: any) => void) | null, options?: DeliveryHandlerOptions);
    setCheckActivityCallback(callback: (activity: Activity) => boolean): void;
    setInvalidateCacheCallback(callback: () => void): void;
    setUpdateNavigationValidityCallback(callback: () => void): void;
    setClearSuspendedActivityCallback(callback: () => void): void;
    isDeliveryInProgress(): boolean;
    hasContentBeenDelivered(): boolean;
    resetContentDelivered(): void;
    setContentDelivered(value: boolean): void;
    processDeliveryRequest(activity: Activity): DeliveryRequest;
    contentDeliveryEnvironmentProcess(activity: Activity): void;
    private initializeForDelivery;
    private setupAttemptTracking;
    private fireDeliveryEvent;
    getEffectiveHideLmsUi(activity: Activity | null): HideLmsUiItem[];
    getEffectiveAuxiliaryResources(activity: Activity | null): AuxiliaryResource[];
    getContentActivityData(activity: Activity): ContentActivityData;
    getActivityPath(activity: Activity, includeActivity?: boolean): Activity[];
    private fireEvent;
}
//# sourceMappingURL=delivery_handler.d.ts.map