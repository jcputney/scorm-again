import { CommitObject, InternalSettings, ResultObject } from "../types/api_types";
import { global_constants } from "../constants/api_constants";
import { LogLevelEnum } from "../constants/enums";
import { ErrorCode } from "../constants/error_codes";
import { SynchronousHttpService } from "./SynchronousHttpService";
import { IHttpService } from "../interfaces/services";
import { appendQueryParam, StringKeyMap } from "../utilities";

type OfflinePayload = CommitObject | StringKeyMap | Array<any>;

type OfflineCommitMetadata = {
  learnerId?: string;
  isTerminateCommit?: boolean;
  sequence?: number;
};

/**
 * Interface for sync queue item
 */
interface SyncQueueItem {
  id: string;
  courseId: string;
  learnerId?: string;
  timestamp: number;
  data: OfflinePayload;
  syncAttempts: number;
  isTerminateCommit?: boolean;
  sequence?: number;
}

/**
 * Service for handling offline storage and synchronization of SCORM data
 */
export class OfflineStorageService {
  private settings: InternalSettings;
  private error_codes: ErrorCode;
  private storeName: string = "scorm_again_offline_data";
  private syncQueue: string = "scorm_again_sync_queue";
  private isOnline: boolean = navigator.onLine;
  private syncInProgress: boolean = false;
  private boundOnlineStatusChangeHandler: () => void;
  private boundCustomNetworkStatusHandler: (event: Event) => void;

  /**
   * Constructor for OfflineStorageService
   * @param {Settings} settings - The settings object
   * @param {ErrorCode} error_codes - The error codes object
   * @param {Function} apiLog - The logging function
   */
  constructor(
    settings: InternalSettings,
    error_codes: ErrorCode,
    private apiLog: (
      functionName: string,
      message: any,
      messageLevel: LogLevelEnum,
      CMIElement?: string,
    ) => void,
    private httpService?: IHttpService,
    private getLearnerId: () => string = () => "",
    private processListeners: (event: string) => void = () => {},
  ) {
    this.settings = settings;
    this.error_codes = error_codes;

    // Store bound handlers for cleanup
    this.boundOnlineStatusChangeHandler = this.handleOnlineStatusChange.bind(this);
    this.boundCustomNetworkStatusHandler = this.handleCustomNetworkStatus.bind(this);

    // Initialize listeners for online/offline events
    window.addEventListener("online", this.boundOnlineStatusChangeHandler);
    window.addEventListener("offline", this.boundOnlineStatusChangeHandler);

    // Initialize listener for custom network status events
    window.addEventListener("scorm-again:network-status", this.boundCustomNetworkStatusHandler);
  }

  /**
   * Handle changes in online status
   */
  private handleOnlineStatusChange() {
    const wasOnline = this.isOnline;
    this.isOnline = navigator.onLine;

    // If we've come back online, trigger sync process
    if (!wasOnline && this.isOnline) {
      this.syncAfterReconnect();
    } else if (wasOnline && !this.isOnline) {
      this.apiLog(
        "OfflineStorageService",
        "Device is offline, data will be stored locally",
        LogLevelEnum.INFO,
      );
    }
  }

  /**
   * Handle custom network status events from external code
   * This allows mobile apps or other external code to programmatically update network status
   * @param {Event} event - The custom event containing network status
   */
  private handleCustomNetworkStatus(event: Event) {
    if (!(event instanceof CustomEvent)) {
      this.apiLog(
        "OfflineStorageService",
        "Invalid network status event received",
        LogLevelEnum.WARN,
      );
      return;
    }

    const { online } = event.detail;

    if (typeof online !== "boolean") {
      this.apiLog(
        "OfflineStorageService",
        "Invalid online status value in custom event",
        LogLevelEnum.WARN,
      );
      return;
    }

    const wasOnline = this.isOnline;
    this.isOnline = online;

    this.apiLog(
      "OfflineStorageService",
      `Network status updated via custom event: ${online ? "online" : "offline"}`,
      LogLevelEnum.INFO,
    );

    // If we've come back online, trigger sync process
    if (!wasOnline && this.isOnline) {
      this.syncAfterReconnect();
    } else if (wasOnline && !this.isOnline) {
      this.apiLog(
        "OfflineStorageService",
        "Device is offline, data will be stored locally",
        LogLevelEnum.INFO,
      );
    }
  }

  /**
   * Sync queued data when the device comes back online.
   */
  private syncAfterReconnect(): void {
    if (!this.hasQueuedData(this.settings.courseId)) {
      this.apiLog(
        "OfflineStorageService",
        "Device is back online, nothing to sync",
        LogLevelEnum.INFO,
      );
      return;
    }

    this.apiLog(
      "OfflineStorageService",
      "Device is back online, attempting to sync...",
      LogLevelEnum.INFO,
    );
    this.syncOfflineData().then(
      (success) => {
        if (success) {
          this.apiLog("OfflineStorageService", "Sync completed successfully", LogLevelEnum.INFO);
        } else {
          this.apiLog("OfflineStorageService", "Sync failed", LogLevelEnum.ERROR);
        }
      },
      (error) => {
        this.apiLog("OfflineStorageService", `Error during sync: ${error}`, LogLevelEnum.ERROR);
      },
    );
  }

  /**
   * Store commit data offline
   * @param {string} courseId - Identifier for the course
   * @param {CommitObject} commitData - The data to store offline
   * @param {OfflineCommitMetadata} metadata - Metadata captured with the original commit
   * @returns {ResultObject} - Result of the storage operation
   */
  storeOffline(
    courseId: string,
    commitData: OfflinePayload,
    metadata?: OfflineCommitMetadata,
  ): ResultObject {
    try {
      // Store the data in the sync queue with timestamp and unique ID
      const queueItem: SyncQueueItem = {
        id: `${courseId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        courseId,
        learnerId: metadata?.learnerId ?? this.getLearnerId(),
        timestamp: Date.now(),
        data: commitData,
        syncAttempts: 0,
        ...(metadata?.isTerminateCommit !== undefined
          ? { isTerminateCommit: metadata.isTerminateCommit }
          : {}),
        ...(metadata?.sequence !== undefined ? { sequence: metadata.sequence } : {}),
      };

      // Get current queue
      const currentQueue = this.getFromStorage<SyncQueueItem[]>(this.syncQueue) || [];
      currentQueue.push(queueItem);

      // Save updated queue
      this.saveToStorage(this.syncQueue, currentQueue);

      // Also update the current state in the main storage (latest known state)
      this.saveToStorage(`${this.storeName}_${courseId}`, commitData);

      this.apiLog(
        "OfflineStorageService",
        `Stored data offline for course ${courseId}`,
        LogLevelEnum.INFO,
      );

      return {
        result: global_constants.SCORM_TRUE,
        errorCode: 0,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isQuotaError = errorMessage.includes("storage quota");

      this.apiLog(
        "OfflineStorageService",
        isQuotaError
          ? `storage quota exceeded - cannot store offline data for course ${courseId}`
          : `Error storing offline data: ${error}`,
        LogLevelEnum.ERROR,
      );
      return {
        result: global_constants.SCORM_FALSE,
        errorCode: this.error_codes.GENERAL ?? 0,
      };
    }
  }

  /**
   * Get the stored offline data for a course
   * @param {string} courseId - Identifier for the course
   * @returns {Promise<CommitObject|null>} - The stored data or null if not found
   */
  async getOfflineData(courseId: string): Promise<OfflinePayload | null> {
    try {
      const data = this.getFromStorage<OfflinePayload>(`${this.storeName}_${courseId}`);
      return data || null;
    } catch (error) {
      this.apiLog(
        "OfflineStorageService",
        `Error retrieving offline data: ${error}`,
        LogLevelEnum.ERROR,
      );
      return null;
    }
  }

  getPendingOfflineData(courseId: string, learnerId: string): OfflinePayload[] {
    const queue = this.getFromStorage<SyncQueueItem[]>(this.syncQueue) || [];
    return queue
      .filter((item) => item.courseId === courseId && item.learnerId === learnerId)
      .map((item) => item.data);
  }

  /**
   * Synchronize offline data with the LMS when connection is available
   * @returns {Promise<boolean>} - Success status of synchronization
   */
  async syncOfflineData(): Promise<boolean> {
    // Don't run multiple sync processes at once
    if (this.syncInProgress || !this.isOnline) {
      return false;
    }

    this.syncInProgress = true;
    let started = false;
    let success = false;

    try {
      // Get the queue of items to sync
      const syncQueue = this.getFromStorage<SyncQueueItem[]>(this.syncQueue) || [];
      const learnerId = this.getLearnerId();
      const matches = (item: SyncQueueItem) =>
        item.courseId === this.settings.courseId &&
        (item.learnerId === undefined || item.learnerId === learnerId);
      const matchingCount = syncQueue.filter(matches).length;

      if (matchingCount === 0) {
        return false;
      }

      // An online, nonoverlapping run with items for this course and learner emits Syncing once,
      // then exactly one Synced (all items accepted) or SyncFailed (queued, dropped, or thrown).
      started = true;
      this.processListeners("OfflineDataSyncing");
      let allAccepted = true;

      this.apiLog(
        "OfflineStorageService",
        `Found ${matchingCount} items to sync`,
        LogLevelEnum.INFO,
      );

      // Keep track of successful and failed sync attempts
      const remainingQueue: SyncQueueItem[] = [];

      // Process each queue item
      for (const item of syncQueue) {
        if (!matches(item)) {
          remainingQueue.push(item);
          continue;
        }
        const maxAttempts = this.settings.maxSyncAttempts ?? 5;

        // Remove items that have exceeded max sync attempts (abandon them)
        if (item.syncAttempts >= maxAttempts) {
          this.apiLog(
            "OfflineStorageService",
            `Removing abandoned item ${item.id} after ${maxAttempts} failed sync attempts`,
            LogLevelEnum.WARN,
          );
          allAccepted = false;
          // Don't add to remainingQueue - item is abandoned
          continue;
        }

        try {
          // Attempt to sync this item
          const syncResult = await this.sendDataToLMS(item.data, {
            ...(item.isTerminateCommit !== undefined
              ? { isTerminateCommit: item.isTerminateCommit }
              : {}),
            ...(item.sequence !== undefined ? { sequence: item.sequence } : {}),
          });

          if (
            (syncResult.result as unknown) === true ||
            syncResult.result === global_constants.SCORM_TRUE
          ) {
            // Sync was successful, no need to keep this item
            this.apiLog(
              "OfflineStorageService",
              `Successfully synced item ${item.id}`,
              LogLevelEnum.INFO,
            );
          } else {
            allAccepted = false;
            // Sync failed, increment attempts and keep in queue
            item.syncAttempts++;
            remainingQueue.push(item);
            this.apiLog(
              "OfflineStorageService",
              `Failed to sync item ${item.id}, attempt #${item.syncAttempts}`,
              LogLevelEnum.WARN,
            );
          }
        } catch (error) {
          allAccepted = false;
          // On error, increment attempts and keep in queue
          item.syncAttempts++;
          remainingQueue.push(item);
          this.apiLog(
            "OfflineStorageService",
            `Error syncing item ${item.id}: ${error}`,
            LogLevelEnum.ERROR,
          );
        }
      }

      // Update the queue with remaining items
      this.saveToStorage(this.syncQueue, remainingQueue);
      for (const courseId of new Set(syncQueue.filter(matches).map((item) => item.courseId))) {
        if (!remainingQueue.some((item) => item.courseId === courseId)) {
          this.removeFromStorage(`${this.storeName}_${courseId}`);
        }
      }

      this.apiLog(
        "OfflineStorageService",
        `Sync completed. ${syncQueue.length - remainingQueue.length} items synced, ${remainingQueue.length} items remaining`,
        LogLevelEnum.INFO,
      );

      success = allAccepted;
      return success;
    } catch (error) {
      if (!started) {
        started = true;
        this.processListeners("OfflineDataSyncing");
      }
      this.apiLog(
        "OfflineStorageService",
        `Error during sync process: ${error}`,
        LogLevelEnum.ERROR,
      );
      return false;
    } finally {
      this.syncInProgress = false;
      if (started) {
        this.processListeners(success ? "OfflineDataSynced" : "OfflineDataSyncFailed");
      }
    }
  }

  /**
   * Send data to the LMS when online
   * @param {CommitObject} data - The data to send to the LMS
   * @param {OfflineCommitMetadata} metadata - Metadata captured with the original commit
   * @returns {Promise<ResultObject>} - Result of the sync operation
   */
  private async sendDataToLMS(
    data: OfflinePayload,
    metadata?: OfflineCommitMetadata,
  ): Promise<ResultObject> {
    const configuredCommitUrl = this.settings.lmsCommitUrl;
    if (!configuredCommitUrl) {
      return {
        result: global_constants.SCORM_FALSE,
        errorCode: this.error_codes.GENERAL || 101,
      };
    }

    try {
      const lmsCommitUrl = String(configuredCommitUrl);

      const requestUrl =
        metadata?.isTerminateCommit && this.settings.terminateCommitParam
          ? appendQueryParam(lmsCommitUrl, this.settings.terminateCommitParam, "true")
          : lmsCommitUrl;
      const commitMetadata = {
        isTerminateCommit: metadata?.isTerminateCommit ?? false,
        trigger: "offline-replay" as const,
        ...(metadata?.sequence !== undefined ? { sequence: metadata.sequence } : {}),
      };
      const httpService = this.httpService;
      if (
        httpService instanceof SynchronousHttpService &&
        !("reportsRequestCompletion" in httpService && httpService.reportsRequestCompletion)
      ) {
        return await httpService.performAsyncRequest(requestUrl, data, commitMetadata);
      }
      if (httpService) {
        return await new Promise<ResultObject>((resolve, reject) => {
          try {
            const result = httpService.processHttpRequest(
              requestUrl,
              data,
              false,
              this.apiLog,
              (event, _element, errorCode) => {
                if (event === "CommitSuccess") resolve({ result: "true", errorCode: 0 });
                if (event === "CommitError") resolve({ result: "false", errorCode });
              },
              commitMetadata,
              // A deferring service settles each request through this callback. If it sent
              // no commit event first, the replay counts as failed and stays queued.
              () =>
                resolve({
                  result: "false",
                  errorCode: this.error_codes.GENERAL_COMMIT_FAILURE || 391,
                }),
            );
            if (!httpService.reportsRequestCompletion) resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      }
      const processedData = this.settings.requestHandler(data, commitMetadata) ?? data;

      // Send the data to the LMS
      const init = {
        method: "POST",
        mode: this.settings.fetchMode,
        body: Array.isArray(processedData)
          ? processedData.join("&")
          : JSON.stringify(processedData),
        headers: {
          ...this.settings.xhrHeaders,
          "Content-Type": Array.isArray(processedData)
            ? "application/x-www-form-urlencoded"
            : this.settings.commitRequestDataType,
        },
      } as RequestInit;

      if (this.settings.xhrWithCredentials) {
        init.credentials = "include";
      }

      const response = await fetch(requestUrl, init);

      // Process the response using the configured handler
      const result =
        typeof this.settings.responseHandler === "function"
          ? await this.settings.responseHandler(response)
          : await response.json();

      if (
        response.status >= 200 &&
        response.status <= 299 &&
        ((result.result as unknown) === true || result.result === global_constants.SCORM_TRUE)
      ) {
        if (!Object.hasOwnProperty.call(result, "errorCode")) {
          result.errorCode = 0;
        }
        return result;
      } else {
        if (!Object.hasOwnProperty.call(result, "errorCode")) {
          result.errorCode = this.error_codes.GENERAL;
        }
        return result;
      }
    } catch (error) {
      this.apiLog(
        "OfflineStorageService",
        `Error sending data to LMS: ${error}`,
        LogLevelEnum.ERROR,
      );
      return {
        result: global_constants.SCORM_FALSE,
        errorCode: this.error_codes.GENERAL || 101,
      };
    }
  }

  /**
   * Check if the device is currently online
   * @returns {boolean} - Online status
   */
  isDeviceOnline(): boolean {
    return this.isOnline;
  }

  // noinspection JSValidateJSDoc
  /**
   * Get item from localStorage
   * @param {string} key - The key to retrieve
   * @returns {T|null} - The retrieved data
   */
  private getFromStorage<T>(key: string): T | null {
    const storedData = localStorage.getItem(key);
    if (storedData) {
      try {
        return JSON.parse(storedData) as T;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  /**
   * Save item to localStorage
   * @param {string} key - The key to store under
   * @param {any} data - The data to store
   * @returns {void}
   * @throws {Error} Re-throws QuotaExceededError for handling upstream
   */
  private saveToStorage(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        throw new Error("storage quota exceeded - localStorage is full", { cause: error });
      }
      throw error;
    }
  }

  private removeFromStorage(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      if (error instanceof DOMException && error.name === "QuotaExceededError") {
        throw new Error("storage quota exceeded - localStorage is full", { cause: error });
      }
      throw error;
    }
  }

  /**
   * Check if there is pending offline data for a course
   * @param {string} courseId - Identifier for the course
   * @returns {Promise<boolean>} - Whether there is pending data
   */
  async hasPendingOfflineData(courseId: string): Promise<boolean> {
    return this.hasQueuedData(courseId);
  }

  /**
   * Check for queued data matching the course and current learner.
   */
  private hasQueuedData(courseId: string | undefined): boolean {
    const queue = this.getFromStorage<SyncQueueItem[]>(this.syncQueue) || [];
    const learnerId = this.getLearnerId();
    // Match what syncOfflineData would send: this learner's items and legacy items without one.
    return queue.some(
      (item) =>
        item.courseId === courseId &&
        (item.learnerId === undefined || item.learnerId === learnerId),
    );
  }

  /**
   * Update the service settings
   * @param {Settings} settings - The new settings
   */
  updateSettings(settings: InternalSettings): void {
    this.settings = settings;
  }

  /**
   * Clean up event listeners
   * Should be called when the service is no longer needed
   */
  destroy(): void {
    window.removeEventListener("online", this.boundOnlineStatusChangeHandler);
    window.removeEventListener("offline", this.boundOnlineStatusChangeHandler);
    window.removeEventListener("scorm-again:network-status", this.boundCustomNetworkStatusHandler);
  }
}
