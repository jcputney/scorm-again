import { CommitObject, InternalSettings, ResultObject } from "../types/api_types";
import { LogLevelEnum } from "../constants/enums";
import { ErrorCode } from "../constants/error_codes";
export declare class OfflineStorageService {
    private apiLog;
    private settings;
    private error_codes;
    private storeName;
    private syncQueue;
    private isOnline;
    private syncInProgress;
    private boundOnlineStatusChangeHandler;
    private boundCustomNetworkStatusHandler;
    constructor(settings: InternalSettings, error_codes: ErrorCode, apiLog: (functionName: string, message: any, messageLevel: LogLevelEnum, CMIElement?: string) => void);
    private handleOnlineStatusChange;
    private handleCustomNetworkStatus;
    storeOffline(courseId: string, commitData: CommitObject): ResultObject;
    getOfflineData(courseId: string): Promise<CommitObject | null>;
    syncOfflineData(): Promise<boolean>;
    private sendDataToLMS;
    isDeviceOnline(): boolean;
    private getFromStorage;
    private saveToStorage;
    hasPendingOfflineData(courseId: string): Promise<boolean>;
    updateSettings(settings: InternalSettings): void;
    destroy(): void;
}
//# sourceMappingURL=OfflineStorageService.d.ts.map