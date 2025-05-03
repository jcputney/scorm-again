import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { OfflineStorageService } from "../../src/services/OfflineStorageService";
import { CommitObject, InternalSettings } from "../../src/types/api_types";
import { DefaultSettings } from "../../src/constants/default_settings";
import { ErrorCode, global_constants } from "../../src";
import { LogLevelEnum } from "../../src/constants/enums";

describe("OfflineStorageService Tests", () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => {
        return store[key] || null;
      }),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
    };
  })();

  // Mock navigator.onLine
  let isOnline = true;
  Object.defineProperty(navigator, "onLine", {
    get: vi.fn(() => isOnline),
    configurable: true,
  });

  // Mock settings and error codes
  const settings = {
    ...DefaultSettings,
    lmsCommitUrl: "https://example.com/commit",
    enableOfflineSupport: true,
  } as InternalSettings;
  const errorCodes: ErrorCode = {
    GENERAL: 101,
    INITIALIZATION_FAILED: 301,
    INITIALIZED: 101,
    TERMINATION_FAILURE: 111,
    TERMINATED: 112,
    INVALID_ARGUMENT: 201,
    ELEMENT_CANNOT_HAVE_CHILDREN: 202,
    ELEMENT_NOT_AN_ARRAY: 203,
    NOT_INITIALIZED: 301,
    NOT_IMPLEMENTED_ERROR: 401,
    INVALID_SET_VALUE: 402,
    ELEMENT_IS_KEYWORD: 402,
    ELEMENT_IS_READ_ONLY: 403,
    ELEMENT_IS_WRITE_ONLY: 404,
    INCORRECT_DATA_TYPE: 405,
  };

  // Mock apiLog function
  const apiLog = vi.fn();

  // Helper to create a service instance
  const createService = () => {
    return new OfflineStorageService(settings, errorCodes, apiLog);
  };

  // Helper to create a sample commit object
  const createSampleCommitObject = (): CommitObject => {
    return {
      courseId: "course123",
      sessionId: "session456",
      activityId: "activity789",
      attempt: 1,
      learnerName: "Test Learner",
      learnerId: "learner123",
      completionStatus: "completed",
      successStatus: "passed",
      score: {
        raw: 85,
        min: 0,
        max: 100,
      },
      runtimeData: {
        cmi: {
          core: {
            student_id: "learner123",
            student_name: "Test Learner",
            lesson_status: "completed",
            score: {
              raw: "85",
              min: "0",
              max: "100",
            },
          },
        },
      },
      totalTimeSeconds: 300,
    };
  };

  beforeAll(() => {
    // Mock fetch
    vi.stubGlobal("fetch", vi.fn());
    (fetch as ReturnType<typeof vi.fn>).mockImplementation((url) => {
      if (url.toString().includes("/error")) {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ result: global_constants.SCORM_FALSE, errorCode: 101 }),
        } as Response);
      }

      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
      } as Response);
    });
  });

  beforeEach(() => {
    // Setup localStorage mock
    vi.stubGlobal("localStorage", localStorageMock);
    localStorageMock.clear();

    // Reset online status
    isOnline = true;

    // Clear all mocks
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("constructor", () => {
    it("should initialize with the provided settings and error codes", () => {
      const service = createService();
      expect(service).toBeDefined();
      expect(apiLog).not.toHaveBeenCalled(); // No logs during initialization
    });

    it("should set up event listeners for online/offline events", () => {
      const addEventListenerSpy = vi.spyOn(window, "addEventListener");
      createService();

      expect(addEventListenerSpy).toHaveBeenCalledTimes(2);
      expect(addEventListenerSpy).toHaveBeenCalledWith("online", expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith("offline", expect.any(Function));
    });
  });

  describe("isDeviceOnline", () => {
    it("should return true when device is online", () => {
      isOnline = true;
      const service = createService();
      expect(service.isDeviceOnline()).toBe(true);
    });

    it("should return false when device is offline", () => {
      isOnline = false;
      const service = createService();
      expect(service.isDeviceOnline()).toBe(false);
    });
  });

  describe("storeOffline", () => {
    it("should store data offline and return success", async () => {
      const service = createService();
      const commitData = createSampleCommitObject();
      const courseId = "course123";

      const result = await service.storeOffline(courseId, commitData);

      // Verify result
      expect(result.result).toBe(global_constants.SCORM_TRUE);
      expect(result.errorCode).toBe(0);

      // Verify localStorage was called
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(2); // Once for queue, once for current state

      // Verify log was called
      expect(apiLog).toHaveBeenCalledWith(
        "OfflineStorageService",
        expect.stringContaining(`Stored data offline for course ${courseId}`),
        LogLevelEnum.INFO,
      );
    });

    it("should handle errors during storage", async () => {
      const service = createService();
      const commitData = createSampleCommitObject();
      const courseId = "course123";

      // Simulate localStorage error
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error("Storage error");
      });

      const result = await service.storeOffline(courseId, commitData);

      // Verify result indicates failure
      expect(result.result).toBe(global_constants.SCORM_FALSE);
      expect(result.errorCode).toBe(errorCodes.GENERAL);

      // Verify error was logged
      expect(apiLog).toHaveBeenCalledWith(
        "OfflineStorageService",
        expect.stringContaining("Error storing offline data"),
        LogLevelEnum.ERROR,
      );
    });
  });

  describe("getOfflineData", () => {
    it("should retrieve stored offline data", async () => {
      const service = createService();
      const commitData = createSampleCommitObject();
      const courseId = "course123";

      // Store data first
      await service.storeOffline(courseId, commitData);

      // Clear mocks to isolate the get operation
      vi.clearAllMocks();

      // Retrieve the data
      const retrievedData = await service.getOfflineData(courseId);

      // Verify data was retrieved correctly
      expect(retrievedData).toEqual(commitData);

      // Verify localStorage was called
      expect(localStorageMock.getItem).toHaveBeenCalledWith(`scorm_again_offline_data_${courseId}`);
    });

    it("should return null when no data exists", async () => {
      const service = createService();
      const courseId = "nonexistent_course";

      const retrievedData = await service.getOfflineData(courseId);

      // Verify null is returned
      expect(retrievedData).toBeNull();

      // Verify localStorage was called
      expect(localStorageMock.getItem).toHaveBeenCalledWith(`scorm_again_offline_data_${courseId}`);
    });

    it("should handle errors during retrieval", async () => {
      const service = createService();
      const courseId = "course123";

      // Simulate localStorage error
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error("Storage error");
      });

      const retrievedData = await service.getOfflineData(courseId);

      // Verify null is returned on error
      expect(retrievedData).toBeNull();

      // Verify error was logged
      expect(apiLog).toHaveBeenCalledWith(
        "OfflineStorageService",
        expect.stringContaining("Error retrieving offline data"),
        LogLevelEnum.ERROR,
      );
    });
  });

  describe("hasPendingOfflineData", () => {
    it("should return true when there is pending data for the course", async () => {
      const service = createService();
      const commitData = createSampleCommitObject();
      const courseId = "course123";

      // Store data first
      await service.storeOffline(courseId, commitData);

      // Clear mocks to isolate the check operation
      vi.clearAllMocks();

      // Check for pending data
      const hasPending = await service.hasPendingOfflineData(courseId);

      // Verify result
      expect(hasPending).toBe(true);

      // Verify localStorage was called
      expect(localStorageMock.getItem).toHaveBeenCalledWith("scorm_again_sync_queue");
    });

    it("should return false when there is no pending data for the course", async () => {
      const service = createService();
      const courseId = "nonexistent_course";

      // Check for pending data
      const hasPending = await service.hasPendingOfflineData(courseId);

      // Verify result
      expect(hasPending).toBe(false);

      // Verify localStorage was called
      expect(localStorageMock.getItem).toHaveBeenCalledWith("scorm_again_sync_queue");
    });
  });

  describe("syncOfflineData", () => {
    it("should not sync when already in progress", async () => {
      const service = createService();

      // Set up private property to indicate sync in progress
      // eslint-disable-next-line
      // @ts-ignore - Accessing private property for testing
      service.syncInProgress = true;

      const result = await service.syncOfflineData();

      // Verify sync was not performed
      expect(result).toBe(false);
      expect(localStorageMock.getItem).not.toHaveBeenCalled();
    });

    it("should not sync when offline", async () => {
      isOnline = false;
      const service = createService();

      const result = await service.syncOfflineData();

      // Verify sync was not performed
      expect(result).toBe(false);
      expect(localStorageMock.getItem).not.toHaveBeenCalled();
    });

    it("should return true when there is no data to sync", async () => {
      const service = createService();

      // Ensure queue is empty
      localStorageMock.getItem.mockReturnValueOnce(null);

      const result = await service.syncOfflineData();

      // Verify result
      expect(result).toBe(true);
      expect(localStorageMock.getItem).toHaveBeenCalledWith("scorm_again_sync_queue");
    });

    it("should successfully sync offline data", async () => {
      const service = createService();
      const commitData = createSampleCommitObject();
      const courseId = "course123";

      // Store data first
      await service.storeOffline(courseId, commitData);

      // Clear mocks to isolate the sync operation
      vi.clearAllMocks();

      // Perform sync
      const result = await service.syncOfflineData();

      // Verify result
      expect(result).toBe(true);

      // Verify fetch was called
      expect(fetch).toHaveBeenCalledWith(
        settings.lmsCommitUrl,
        expect.objectContaining({
          method: "POST",
          body: expect.any(String),
        }),
      );

      // Verify queue was updated (all items removed on successful sync)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "scorm_again_sync_queue",
        expect.any(String),
      );

      // Verify logs
      expect(apiLog).toHaveBeenCalledWith(
        "OfflineStorageService",
        expect.stringContaining("Found"),
        LogLevelEnum.INFO,
      );
      expect(apiLog).toHaveBeenCalledWith(
        "OfflineStorageService",
        expect.stringContaining("Successfully synced item"),
        LogLevelEnum.INFO,
      );
    });

    it("should handle sync failures and increment attempt count", async () => {
      const service = createService();
      const commitData = createSampleCommitObject();
      const courseId = "error_course"; // This will trigger the error response in fetch mock

      // Modify commitData to trigger error response
      const errorCommitData = { ...commitData, courseId };

      // Store data first
      await service.storeOffline(courseId, errorCommitData);

      // Update fetch mock to return error for this specific case
      (fetch as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ result: global_constants.SCORM_FALSE, errorCode: 101 }),
        } as Response);
      });

      // Clear mocks to isolate the sync operation
      vi.clearAllMocks();

      // Perform sync
      const result = await service.syncOfflineData();

      // Verify result
      expect(result).toBe(true); // Overall sync process succeeded even though item sync failed

      // Verify fetch was called
      expect(fetch).toHaveBeenCalled();

      // Verify queue was updated (item kept with incremented attempt count)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "scorm_again_sync_queue",
        expect.stringContaining(courseId), // Queue still contains the item
      );

      // Verify warning log
      expect(apiLog).toHaveBeenCalledWith(
        "OfflineStorageService",
        expect.stringContaining("Failed to sync item"),
        LogLevelEnum.WARN,
      );
    });

    it("should skip items that have been attempted too many times", async () => {
      const service = createService();
      const courseId = "course123";

      // Create a queue with an item that has been attempted 5 times
      const queueItem = {
        id: `${courseId}_${Date.now()}_test`,
        courseId,
        timestamp: Date.now(),
        data: createSampleCommitObject(),
        syncAttempts: 5,
      };

      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify([queueItem]));

      // Perform sync
      const result = await service.syncOfflineData();

      // Verify result
      expect(result).toBe(true);

      // Verify fetch was not called for this item
      expect(fetch).not.toHaveBeenCalled();

      // Verify warning log about skipping
      expect(apiLog).toHaveBeenCalledWith(
        "OfflineStorageService",
        expect.stringContaining("Skipping item"),
        LogLevelEnum.WARN,
      );
    });

    it("should handle errors during the sync process", async () => {
      const service = createService();

      // Simulate error during getFromStorage
      localStorageMock.getItem.mockImplementationOnce(() => {
        throw new Error("Storage error");
      });

      // Perform sync
      const result = await service.syncOfflineData();

      // Verify result
      expect(result).toBe(false);

      // Verify error was logged
      expect(apiLog).toHaveBeenCalledWith(
        "OfflineStorageService",
        expect.stringContaining("Error during sync process"),
        LogLevelEnum.ERROR,
      );
    });
  });

  describe("updateSettings", () => {
    it("should update the service settings", () => {
      const service = createService();
      const newSettings = {
        ...settings,
        lmsCommitUrl: "https://example.com/new-commit-url",
      } as InternalSettings;

      service.updateSettings(newSettings);

      // We can't directly test the private settings property, but we can test
      // the behavior by making a request that uses the settings

      // Store and sync data to use the new URL
      service
        .storeOffline("course123", createSampleCommitObject())
        .then(() => service.syncOfflineData())
        .then(() => {
          // Verify fetch was called with the new URL
          expect(fetch).toHaveBeenCalledWith(newSettings.lmsCommitUrl, expect.any(Object));
        });
    });
  });

  describe("handleOnlineStatusChange", () => {
    it("should trigger sync when coming back online", () => {
      const service = createService();
      const syncSpy = vi.spyOn(service, "syncOfflineData");

      // Simulate going offline
      isOnline = false;
      window.dispatchEvent(new Event("offline"));

      // Simulate coming back online
      isOnline = true;
      window.dispatchEvent(new Event("online"));

      // Verify sync was triggered
      expect(syncSpy).toHaveBeenCalled();

      // Verify log
      expect(apiLog).toHaveBeenCalledWith(
        "OfflineStorageService",
        expect.stringContaining("Device is back online"),
        LogLevelEnum.INFO,
      );
    });

    it("should log when going offline", () => {
      createService();

      // Simulate going offline
      isOnline = false;
      window.dispatchEvent(new Event("offline"));

      // Verify log
      expect(apiLog).toHaveBeenCalledWith(
        "OfflineStorageService",
        expect.stringContaining("Device is offline"),
        LogLevelEnum.INFO,
      );
    });
  });

  describe("private methods", () => {
    describe("sendDataToLMS", () => {
      it("should fail when lmsCommitUrl is not set", async () => {
        const service = createService();

        // Create service with no commit URL
        const noUrlSettings = {
          ...settings,
          lmsCommitUrl: undefined,
        } as unknown as InternalSettings;
        service.updateSettings(noUrlSettings);

        // eslint-disable-next-line
        // @ts-ignore - Accessing private method for testing
        const result = await service["sendDataToLMS"](createSampleCommitObject());

        // Verify result
        expect(result.result).toBe(global_constants.SCORM_FALSE);
        expect(result.errorCode).toBe(errorCodes.GENERAL);
      });

      it("should handle network errors", async () => {
        const service = createService();

        // Make fetch throw an error
        (fetch as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
          throw new Error("Network error");
        });

        // eslint-disable-next-line
        // @ts-ignore - Accessing private method for testing
        const result = await service["sendDataToLMS"](createSampleCommitObject());

        // Verify result
        expect(result.result).toBe(global_constants.SCORM_FALSE);
        expect(result.errorCode).toBe(errorCodes.GENERAL);

        // Verify error was logged
        expect(apiLog).toHaveBeenCalledWith(
          "OfflineStorageService",
          expect.stringContaining("Error sending data to LMS"),
          LogLevelEnum.ERROR,
        );
      });

      it("should apply request handler if configured", async () => {
        const service = createService();
        const requestHandler = vi.fn((data) => data);

        // Update settings with request handler
        service.updateSettings({
          ...settings,
          requestHandler,
        } as InternalSettings);

        const commitData = createSampleCommitObject();

        // eslint-disable-next-line
        // @ts-ignore - Accessing private method for testing
        await service["sendDataToLMS"](commitData);

        // Verify request handler was called
        expect(requestHandler).toHaveBeenCalledWith(commitData);
      });

      it("should use response handler if configured", async () => {
        const service = createService();
        const responseHandler = vi.fn((_response: Response) =>
          Promise.resolve({
            result: global_constants.SCORM_TRUE,
            errorCode: 0,
          }),
        );

        // Update settings with response handler
        service.updateSettings({
          ...settings,
          responseHandler: responseHandler,
        } as InternalSettings);

        // eslint-disable-next-line
        // @ts-ignore - Accessing private method for testing
        const result = await service["sendDataToLMS"](createSampleCommitObject());

        // Verify response handler was called
        expect(responseHandler).toHaveBeenCalled();

        // Verify result
        expect(result.result).toBe(global_constants.SCORM_TRUE);
        expect(result.errorCode).toBe(0);
      });
    });

    describe("getFromStorage and saveToStorage", () => {
      it("should save and retrieve data from localStorage", async () => {
        const service = createService();
        const testKey = "test_key";
        const testData = { test: "data" };

        // eslint-disable-next-line
        // @ts-ignore - Accessing private method for testing
        await service["saveToStorage"](testKey, testData);

        // Verify localStorage was called
        expect(localStorageMock.setItem).toHaveBeenCalledWith(testKey, JSON.stringify(testData));

        // eslint-disable-next-line
        // @ts-ignore - Accessing private method for testing
        const retrievedData = await service["getFromStorage"](testKey);

        // Verify data was retrieved correctly
        expect(retrievedData).toEqual(testData);
      });

      it("should handle JSON parse errors in getFromStorage", async () => {
        const service = createService();
        const testKey = "test_key";

        // Set invalid JSON in localStorage
        localStorageMock.getItem.mockReturnValueOnce("invalid json");

        // eslint-disable-next-line
        // @ts-ignore - Accessing private method for testing
        const result = await service["getFromStorage"](testKey);

        // Verify null is returned on parse error
        expect(result).toBeNull();
      });
    });
  });
});
