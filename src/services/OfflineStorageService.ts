import { CommitObject, InternalSettings, ResultObject } from "../types/api_types";
import { global_constants } from "../constants/api_constants";
import { LogLevelEnum } from "../constants/enums";
import { ErrorCode } from "../constants/error_codes";

/**
 * Interface for sync queue item
 */
interface SyncQueueItem {
  id: string;
  courseId: string;
  timestamp: number;
  data: CommitObject;
  syncAttempts: number;
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
  ) {
    this.settings = settings;
    this.error_codes = error_codes;

    // Initialize listeners for online/offline events
    window.addEventListener("online", this.handleOnlineStatusChange.bind(this));
    window.addEventListener("offline", this.handleOnlineStatusChange.bind(this));
  }

  /**
   * Handle changes in online status
   */
  private handleOnlineStatusChange() {
    const wasOnline = this.isOnline;
    this.isOnline = navigator.onLine;

    // If we've come back online, trigger sync process
    if (!wasOnline && this.isOnline) {
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
    } else if (wasOnline && !this.isOnline) {
      this.apiLog(
        "OfflineStorageService",
        "Device is offline, data will be stored locally",
        LogLevelEnum.INFO,
      );
    }
  }

  /**
   * Store commit data offline
   * @param {string} courseId - Identifier for the course
   * @param {CommitObject} commitData - The data to store offline
   * @returns {Promise<ResultObject>} - Result of the storage operation
   */
  async storeOffline(courseId: string, commitData: CommitObject): Promise<ResultObject> {
    try {
      // Store the data in the sync queue with timestamp and unique ID
      const queueItem: SyncQueueItem = {
        id: `${courseId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        courseId,
        timestamp: Date.now(),
        data: commitData,
        syncAttempts: 0,
      };

      // Get current queue
      const currentQueue = (await this.getFromStorage<SyncQueueItem[]>(this.syncQueue)) || [];
      currentQueue.push(queueItem);

      // Save updated queue
      await this.saveToStorage(this.syncQueue, currentQueue);

      // Also update the current state in the main storage (latest known state)
      await this.saveToStorage(`${this.storeName}_${courseId}`, commitData);

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
      this.apiLog(
        "OfflineStorageService",
        `Error storing offline data: ${error}`,
        LogLevelEnum.ERROR,
      );
      return {
        result: global_constants.SCORM_FALSE,
        errorCode: this.error_codes.GENERAL,
      };
    }
  }

  /**
   * Get the stored offline data for a course
   * @param {string} courseId - Identifier for the course
   * @returns {Promise<CommitObject|null>} - The stored data or null if not found
   */
  async getOfflineData(courseId: string): Promise<CommitObject | null> {
    try {
      const data = await this.getFromStorage<CommitObject>(`${this.storeName}_${courseId}`);
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

    try {
      // Get the queue of items to sync
      const syncQueue = (await this.getFromStorage<SyncQueueItem[]>(this.syncQueue)) || [];

      if (syncQueue.length === 0) {
        this.syncInProgress = false;
        return true;
      }

      this.apiLog(
        "OfflineStorageService",
        `Found ${syncQueue.length} items to sync`,
        LogLevelEnum.INFO,
      );

      // Keep track of successful and failed sync attempts
      const remainingQueue: SyncQueueItem[] = [];

      // Process each queue item
      for (const item of syncQueue) {
        // Skip items that have been attempted too many times
        if (item.syncAttempts >= 5) {
          this.apiLog(
            "OfflineStorageService",
            `Skipping item ${item.id} after 5 failed attempts`,
            LogLevelEnum.WARN,
          );
          continue;
        }

        try {
          // Attempt to sync this item
          const syncResult = await this.sendDataToLMS(item.data);

          if (syncResult.result === global_constants.SCORM_TRUE) {
            // Sync was successful, no need to keep this item
            this.apiLog(
              "OfflineStorageService",
              `Successfully synced item ${item.id}`,
              LogLevelEnum.INFO,
            );
          } else {
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
      await this.saveToStorage(this.syncQueue, remainingQueue);

      this.apiLog(
        "OfflineStorageService",
        `Sync completed. ${syncQueue.length - remainingQueue.length} items synced, ${remainingQueue.length} items remaining`,
        LogLevelEnum.INFO,
      );

      this.syncInProgress = false;
      return true;
    } catch (error) {
      this.apiLog(
        "OfflineStorageService",
        `Error during sync process: ${error}`,
        LogLevelEnum.ERROR,
      );
      this.syncInProgress = false;
      return false;
    }
  }

  /**
   * Send data to the LMS when online
   * @param {CommitObject} data - The data to send to the LMS
   * @returns {Promise<ResultObject>} - Result of the sync operation
   */
  private async sendDataToLMS(data: CommitObject): Promise<ResultObject> {
    if (!this.settings.lmsCommitUrl) {
      return {
        result: global_constants.SCORM_FALSE,
        errorCode: this.error_codes.GENERAL,
      };
    }

    try {
      // Apply request handler if configured
      const processedData = this.settings.requestHandler(data);

      // Send the data to the LMS
      const init = {
        method: "POST",
        mode: this.settings.fetchMode,
        body: JSON.stringify(processedData),
        headers: {
          ...this.settings.xhrHeaders,
          "Content-Type": this.settings.commitRequestDataType,
        },
      } as RequestInit;

      if (this.settings.xhrWithCredentials) {
        init.credentials = "include";
      }

      const response = await fetch(this.settings.lmsCommitUrl as string, init);

      // Process the response using the configured handler
      const result =
        typeof this.settings.responseHandler === "function"
          ? await this.settings.responseHandler(response)
          : await response.json();

      if (
        response.status >= 200 &&
        response.status <= 299 &&
        (result.result === true || result.result === global_constants.SCORM_TRUE)
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
        errorCode: this.error_codes.GENERAL,
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
   * @returns {Promise<T|null>} - The retrieved data
   */
  private async getFromStorage<T>(key: string): Promise<T | null> {
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
   * @returns {Promise<void>}
   */
  private async saveToStorage(key: string, data: any): Promise<void> {
    localStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * Check if there is pending offline data for a course
   * @param {string} courseId - Identifier for the course
   * @returns {Promise<boolean>} - Whether there is pending data
   */
  async hasPendingOfflineData(courseId: string): Promise<boolean> {
    const queue = (await this.getFromStorage<SyncQueueItem[]>(this.syncQueue)) || [];
    return queue.some((item) => item.courseId === courseId);
  }

  /**
   * Update the service settings
   * @param {Settings} settings - The new settings
   */
  updateSettings(settings: InternalSettings): void {
    this.settings = settings;
  }
}
