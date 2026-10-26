import { CommitObject, InternalSettings, ResultObject } from "../types/api_types.js";
import { LogLevelEnum } from "../constants/enums.js";
import { ErrorCode } from "../constants/error_codes.js";
import { IHttpService } from "../interfaces/services.js";
import { StringKeyMap } from "../utilities/index.js";
type OfflinePayload = CommitObject | StringKeyMap | Array<any>;
type OfflineCommitMetadata = {
    learnerId?: string;
    isTerminateCommit?: boolean;
    sequence?: number;
};
export declare class OfflineStorageService {
    private apiLog;
    private httpService?;
    private getLearnerId;
    private processListeners;
    private settings;
    private error_codes;
    private storeName;
    private syncQueue;
    private isOnline;
    private syncInProgress;
    private boundOnlineStatusChangeHandler;
    private boundCustomNetworkStatusHandler;
    constructor(settings: InternalSettings, error_codes: ErrorCode, apiLog: (functionName: string, message: any, messageLevel: LogLevelEnum, CMIElement?: string) => void, httpService?: IHttpService | undefined, getLearnerId?: () => string, processListeners?: (event: string) => void);
    private handleOnlineStatusChange;
    private handleCustomNetworkStatus;
    private syncAfterReconnect;
    storeOffline(courseId: string, commitData: OfflinePayload, metadata?: OfflineCommitMetadata): ResultObject;
    getOfflineData(courseId: string): Promise<OfflinePayload | null>;
    getPendingOfflineData(courseId: string, learnerId: string): OfflinePayload[];
    syncOfflineData(): Promise<boolean>;
    private sendDataToLMS;
    isDeviceOnline(): boolean;
    private getFromStorage;
    private saveToStorage;
    private removeFromStorage;
    hasPendingOfflineData(courseId: string): Promise<boolean>;
    private hasQueuedData;
    updateSettings(settings: InternalSettings): void;
    destroy(): void;
}
export {};
//# sourceMappingURL=OfflineStorageService.d.ts.map