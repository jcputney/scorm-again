import { ErrorCode } from "./constants/error_codes";
import { global_constants } from "./constants/api_constants";
import * as Utilities from "./utilities";
import { formatMessage, StringKeyMap, stringMatches } from "./utilities";
import { BaseCMI, BaseRootCMI } from "./cmi/common/base_cmi";
import {
  CommitObject,
  InternalSettings,
  LogLevel,
  ResultObject,
  Settings,
} from "./types/api_types";
import { defaultLogHandler, DefaultSettings } from "./constants/default_settings";
import { IBaseAPI } from "./interfaces/IBaseAPI";
import { ScheduledCommit } from "./types/scheduled_commit";
import { LogLevelEnum } from "./constants/enums";
import { AsynchronousHttpService } from "./services/AsynchronousHttpService";
import { SynchronousHttpService } from "./services/SynchronousHttpService";
import { EventService } from "./services/EventService";
import { SerializationService } from "./services/SerializationService";
import { createErrorHandlingService } from "./services/ErrorHandlingService";
import { getLoggingService } from "./services/LoggingService";
import { OfflineStorageService } from "./services/OfflineStorageService";
import {
  ICMIDataService,
  IErrorHandlingService,
  IEventService,
  IHttpService,
  ILoggingService,
  IOfflineStorageService,
  ISerializationService,
} from "./interfaces/services";
import { CMIArray } from "./cmi/common/array";
import { ValidationError } from "./exceptions";

/**
 * Base API class for SCORM 1.2 and SCORM 2004. Should be considered
 * abstract, and never initialized on its own.
 */
export default abstract class BaseAPI implements IBaseAPI {
  private _timeout?: ScheduledCommit | undefined;
  protected readonly _error_codes: ErrorCode;
  private _settings: InternalSettings = DefaultSettings;
  private readonly _httpService: IHttpService;
  private _eventService: IEventService;
  private _serializationService: ISerializationService;
  private readonly _errorHandlingService: IErrorHandlingService;
  private readonly _loggingService: ILoggingService;
  private readonly _offlineStorageService?: IOfflineStorageService;
  private _courseId: string = "";

  /**
   * Constructor for Base API class. Sets some shared API fields, as well as
   * sets up options for the API.
   * @param {ErrorCode} error_codes - The error codes object
   * @param {Settings} settings - Optional settings for the API
   * @param {IHttpService} httpService - Optional HTTP service instance
   * @param {IEventService} eventService - Optional Event service instance
   * @param {ISerializationService} serializationService - Optional Serialization service instance
   * @param {ICMIDataService} cmiDataService - Optional CMI Data service instance
   * @param {IErrorHandlingService} errorHandlingService - Optional Error Handling service instance
   * @param {ILoggingService} loggingService - Optional Logging service instance
   * @param {IOfflineStorageService} offlineStorageService - Optional Offline Storage service instance
   */
  protected constructor(
    error_codes: ErrorCode,
    settings?: Settings,
    httpService?: IHttpService,
    eventService?: IEventService,
    serializationService?: ISerializationService,
    cmiDataService?: ICMIDataService,
    errorHandlingService?: IErrorHandlingService,
    loggingService?: ILoggingService,
    offlineStorageService?: IOfflineStorageService,
  ) {
    if (new.target === BaseAPI) {
      throw new TypeError("Cannot construct BaseAPI instances directly");
    }
    this.currentState = global_constants.STATE_NOT_INITIALIZED;

    this._error_codes = error_codes;

    if (settings) {
      this.settings = {
        ...DefaultSettings,
        ...settings,
      } as InternalSettings;
    }

    // BACKWARDS COMPATIBILITY: Handle deprecated asyncCommit setting
    if (
      settings?.asyncCommit !== undefined &&
      settings.useAsynchronousCommits === undefined &&
      settings.throttleCommits === undefined
    ) {
      console.warn(
        "DEPRECATED: 'asyncCommit' setting is deprecated and will be removed in a future version. " +
          "Use 'useAsynchronousCommits: true' and 'throttleCommits: true' instead.",
      );
      if (settings.asyncCommit) {
        this.settings.useAsynchronousCommits = true;
        this.settings.throttleCommits = true;
      }
    }

    // VALIDATION: Enforce throttleCommits incompatibility with sync commits
    if (!this.settings.useAsynchronousCommits && this.settings.throttleCommits) {
      console.warn(
        "throttleCommits cannot be used with synchronous commits. Setting throttleCommits to false.",
      );
      this.settings.throttleCommits = false;
    }

    // Initialize and configure LoggingService
    this._loggingService = loggingService || getLoggingService();
    this._loggingService.setLogLevel(this.settings.logLevel);

    // If settings include a custom onLogMessage function, use it as the log handler
    if (this.settings.onLogMessage) {
      this._loggingService.setLogHandler(this.settings.onLogMessage);
    } else {
      this._loggingService.setLogHandler(defaultLogHandler);
    }

    // HTTP SERVICE SELECTION
    if (httpService) {
      // Constructor injection (for tests)
      this._httpService = httpService;
    } else if (this.settings.httpService) {
      // Settings injection (advanced users)
      this._httpService = this.settings.httpService;
    } else {
      // Auto-select based on useAsynchronousCommits
      if (this.settings.useAsynchronousCommits) {
        console.warn(
          "WARNING: useAsynchronousCommits=true is not SCORM compliant. " +
            "Commit failures will not be reported to the SCO, which may cause data loss. " +
            "This setting should only be used for specific legacy compatibility cases.",
        );
        this._httpService = new AsynchronousHttpService(this.settings, this._error_codes);
      } else {
        this._httpService = new SynchronousHttpService(this.settings, this._error_codes);
      }
    }

    // Initialize Event service
    this._eventService =
      eventService ||
      new EventService((functionName, message, level, element) =>
        this.apiLog(functionName, message, level, element),
      );

    // Initialize Serialization service
    this._serializationService = serializationService || new SerializationService();

    // Initialize Error Handling service
    this._errorHandlingService =
      errorHandlingService ||
      createErrorHandlingService(
        this._error_codes,
        (functionName, message, level, element) =>
          this.apiLog(functionName, message, level || LogLevelEnum.ERROR, element),
        (errorNumber, detail) => this.getLmsErrorMessageDetails(errorNumber, detail),
      );

    // Initialize Offline Storage service if enabled
    if (this.settings.enableOfflineSupport) {
      this._offlineStorageService =
        offlineStorageService ||
        new OfflineStorageService(
          this.settings,
          this._error_codes,
          (functionName, message, level, element) =>
            this.apiLog(functionName, message, level, element),
        );

      if (this.settings.courseId) {
        this._courseId = this.settings.courseId;
      }

      // Set up offline sync on BeforeTerminate event
      if (this.settings.syncOnTerminate) {
        this._eventService.on("BeforeTerminate", () => {
          if (this._offlineStorageService?.isDeviceOnline() && this._courseId) {
            this._offlineStorageService
              .hasPendingOfflineData(this._courseId)
              .then((hasPendingData) => {
                if (hasPendingData) {
                  this.apiLog(
                    "BeforeTerminate",
                    "Syncing pending offline data before termination",
                    LogLevelEnum.INFO,
                  );
                  return this._offlineStorageService?.syncOfflineData();
                }
              })
              .then((syncSuccess) => {
                if (syncSuccess) {
                  this.processListeners("OfflineDataSynced");
                } else if (syncSuccess === false) {
                  this.processListeners("OfflineDataSyncFailed");
                }
              })
              .catch((error) => {
                this.apiLog(
                  "BeforeTerminate",
                  `Error syncing offline data: ${error}`,
                  LogLevelEnum.ERROR,
                );
                this.processListeners("OfflineDataSyncFailed");
              });
          }
        });
      }

      // Check for offline data to restore on initialization
      if (this._offlineStorageService && this._courseId) {
        this._offlineStorageService
          .getOfflineData(this._courseId)
          .then((offlineData) => {
            if (offlineData) {
              this.apiLog("constructor", "Found offline data to restore", LogLevelEnum.INFO);
              // Restore data from offline storage
              this.loadFromJSON(offlineData.runtimeData);
            }
          })
          .catch((error) => {
            this.apiLog(
              "constructor",
              `Error retrieving offline data: ${error}`,
              LogLevelEnum.ERROR,
            );
          });
      }
    }
  }

  public abstract cmi: BaseCMI;
  public startingData?: StringKeyMap;

  public currentState: number;

  /**
   * Get the last error code
   * @return {string}
   */
  get lastErrorCode(): string {
    return this._errorHandlingService?.lastErrorCode ?? "0";
  }

  /**
   * Set the last error code
   * @param {string} errorCode
   */
  set lastErrorCode(errorCode: string) {
    if (this._errorHandlingService) {
      this._errorHandlingService.lastErrorCode = errorCode;
    }
  }

  /**
   * Protected getter for eventService
   * @return {IEventService}
   */
  protected get eventService(): IEventService {
    return this._eventService;
  }

  /**
   * Protected getter for loggingService
   * @return {ILoggingService}
   */
  protected get loggingService(): ILoggingService {
    return this._loggingService;
  }

  /**
   * Reset the API to its initial state.
   * This method clears all current data and resets the API to an uninitialized state.
   * It can optionally accept new settings to configure the API after reset.
   *
   * @param {Settings} settings - Optional new settings to apply after reset
   */
  abstract reset(settings?: Settings): void;

  /**
   * Common reset method for all APIs. New settings are merged with the existing settings.
   * @param {Settings} settings
   * @protected
   */
  commonReset(settings?: Settings): void {
    this.apiLog("reset", "Called", LogLevelEnum.INFO);

    this.settings = { ...this.settings, ...settings };

    this.clearScheduledCommit();
    this.currentState = global_constants.STATE_NOT_INITIALIZED;
    this.lastErrorCode = "0";
    this._eventService.reset();
    this.startingData = {};

    // Update offline storage service with new settings if it exists
    if (this._offlineStorageService) {
      this._offlineStorageService.updateSettings(this.settings);

      if (settings?.courseId) {
        this._courseId = settings.courseId;
      }
    }
  }

  /**
   * Initialize the API
   * @param {string} callbackName
   * @param {string} initializeMessage
   * @param {string} terminationMessage
   * @return {string}
   */
  initialize(
    callbackName: string,
    initializeMessage?: string,
    terminationMessage?: string,
  ): string {
    let returnValue = global_constants.SCORM_FALSE;

    if (this.isInitialized()) {
      this.throwSCORMError("api", this._error_codes.INITIALIZED, initializeMessage);
    } else if (this.isTerminated()) {
      this.throwSCORMError("api", this._error_codes.TERMINATED, terminationMessage);
    } else {
      if (this.settings.selfReportSessionTime) {
        (this.cmi as BaseRootCMI).setStartTime();
      }

      this.currentState = global_constants.STATE_INITIALIZED;
      this.lastErrorCode = "0";
      returnValue = global_constants.SCORM_TRUE;
      this.processListeners(callbackName);

      // If enabled, attempt to sync offline data on initialization
      if (
        this.settings.enableOfflineSupport &&
        this._offlineStorageService &&
        this._courseId &&
        this.settings.syncOnInitialize &&
        this._offlineStorageService.isDeviceOnline()
      ) {
        this._offlineStorageService.hasPendingOfflineData(this._courseId).then((hasPendingData) => {
          if (hasPendingData) {
            this.apiLog(
              callbackName,
              "Syncing pending offline data on initialization",
              LogLevelEnum.INFO,
            );
            this._offlineStorageService?.syncOfflineData().then((syncSuccess) => {
              if (syncSuccess) {
                this.apiLog(callbackName, "Successfully synced offline data", LogLevelEnum.INFO);
                this.processListeners("OfflineDataSynced");
              }
            });
          }
        });
      }
    }

    this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);
    this.clearSCORMError(returnValue);

    return returnValue;
  }

  /**
   * Initialize the LMS API - Begins a communication session
   *
   * SCORM 1.2 per RTE Section 3.4.3.1 (LMSInitialize):
   * - Parameter must be empty string ("")
   * - Returns "true" on success, "false" on failure
   * - Sets error 101 if already initialized
   * - Sets error 101 if already terminated
   *
   * SCORM 2004 per RTE Section 3.1.2.1 (Initialize):
   * - Parameter must be empty string ("")
   * - Returns "true" on success, "false" on failure
   * - Sets error 103 if already initialized
   * - Sets error 104 if already terminated
   *
   * @param {string} parameter - Must be an empty string per SCORM specification
   * @return {string} "true" if successful, "false" otherwise
   */
  abstract lmsInitialize(parameter?: string): string;

  /**
   * Finish the current LMS API session - Ends a communication session
   *
   * SCORM 1.2 per RTE Section 3.4.3.2 (LMSFinish):
   * - Parameter must be empty string ("")
   * - Returns "true" on success, "false" on failure
   * - Commits all data to persistent storage
   * - Sets error 101 if not initialized
   * - Sets error 101 if already terminated
   *
   * SCORM 2004 per RTE Section 3.1.2.2 (Terminate):
   * - Parameter must be empty string ("")
   * - Returns "true" on success, "false" on failure
   * - Commits all data to persistent storage
   * - Sets error 112 if not initialized
   * - Sets error 113 if already terminated
   *
   * @param {string} parameter - Must be an empty string per SCORM specification
   * @return {string} "true" if successful, "false" otherwise
   */
  abstract lmsFinish(parameter?: string): string;

  /**
   * Get the value of a CMI element from the LMS
   *
   * SCORM 1.2 per RTE Section 3.4.3.3 (LMSGetValue):
   * - Returns the value of the specified CMI data model element
   * - Returns empty string if element has no value
   * - Sets error 101 if not initialized
   * - Sets error 301 if invalid element specified
   * - Sets error 201 if element is write-only
   *
   * SCORM 2004 per RTE Section 3.1.2.3 (GetValue):
   * - Returns the value of the specified CMI data model element
   * - Returns empty string if element has no value
   * - Sets error 122 if not initialized
   * - Sets error 123 if terminated
   * - Sets error 401 if invalid element specified
   * - Sets error 405 if element is write-only
   *
   * @param {string} CMIElement - The CMI element to get the value of
   * @return {string} The value of the CMI element
   */
  abstract lmsGetValue(CMIElement: string): string;

  /**
   * Set the value of a CMI element in the LMS
   *
   * SCORM 1.2 per RTE Section 3.4.3.4 (LMSSetValue):
   * - Sets the value of the specified CMI data model element
   * - Returns "true" on success, "false" on failure
   * - Sets error 101 if not initialized
   * - Sets error 301 if invalid element specified
   * - Sets error 351 if element exceeds maximum length
   * - Sets error 201 if element is read-only
   * - Sets error 405 if incorrect data type
   *
   * SCORM 2004 per RTE Section 3.1.2.4 (SetValue):
   * - Sets the value of the specified CMI data model element
   * - Returns "true" on success, "false" on failure
   * - Sets error 132 if not initialized
   * - Sets error 133 if terminated
   * - Sets error 401 if invalid element specified
   * - Sets error 403 if element is read-only
   * - Sets error 406 if incorrect data type
   *
   * @param {string} CMIElement - The CMI element to set the value of
   * @param {any} value - The value to set
   * @return {string} "true" if successful, "false" otherwise
   */
  abstract lmsSetValue(CMIElement: string, value: any): string;

  /**
   * Commit the current data to the LMS - Persists data to storage
   *
   * SCORM 1.2 per RTE Section 3.4.4.1 (LMSCommit):
   * - Parameter must be empty string ("")
   * - Requests immediate persistence of all data since last commit
   * - Returns "true" on success, "false" on failure
   * - Sets error 101 if not initialized
   * - Sets error 391 if commit failed
   *
   * SCORM 2004 per RTE Section 3.1.2.5 (Commit):
   * - Parameter must be empty string ("")
   * - Requests immediate persistence of all data since last commit
   * - Returns "true" on success, "false" on failure
   * - Sets error 142 if not initialized
   * - Sets error 143 if terminated
   * - Sets error 391 if commit failed
   *
   * @param {string} parameter - Must be an empty string per SCORM specification
   * @return {string} "true" if successful, "false" otherwise
   */
  abstract lmsCommit(parameter?: string): string;

  /**
   * Get the last error code from the LMS
   *
   * SCORM 1.2 per RTE Section 3.4.4.2 (LMSGetLastError):
   * - Returns the error code from the last API call
   * - Returns "0" if no error occurred
   * - Can be called at any time (even before initialization)
   * - Does not change the current error state
   *
   * SCORM 2004 per RTE Section 3.1.2.6 (GetLastError):
   * - Returns the error code from the last API call
   * - Returns "0" if no error occurred
   * - Can be called at any time (even before initialization)
   * - Does not change the current error state
   *
   * @return {string} The last error code
   */
  abstract lmsGetLastError(): string;

  /**
   * Get the error string for a specific error code
   *
   * SCORM 1.2 per RTE Section 3.4.4.3 (LMSGetErrorString):
   * - Returns a short textual description for the specified error code
   * - Returns empty string if error code is not recognized
   * - Can be called at any time (even before initialization)
   * - Does not change the current error state
   *
   * SCORM 2004 per RTE Section 3.1.2.7 (GetErrorString):
   * - Returns a short textual description for the specified error code
   * - Returns empty string if error code is not recognized
   * - Can be called at any time (even before initialization)
   * - Does not change the current error state
   *
   * @param {string|number} CMIErrorCode - The error code to get the string for
   * @return {string} The error string
   */
  abstract lmsGetErrorString(CMIErrorCode: string | number): string;

  /**
   * Get diagnostic information for a specific error code
   *
   * SCORM 1.2 per RTE Section 3.4.4.4 (LMSGetDiagnostic):
   * - Returns detailed diagnostic information for the specified error code
   * - Implementation-specific; can include additional context or debugging info
   * - Returns empty string if no diagnostic information is available
   * - Can be called at any time (even before initialization)
   * - Does not change the current error state
   *
   * SCORM 2004 per RTE Section 3.1.2.8 (GetDiagnostic):
   * - Returns detailed diagnostic information for the specified error code
   * - Implementation-specific; can include additional context or debugging info
   * - Returns empty string if no diagnostic information is available
   * - Can be called at any time (even before initialization)
   * - Does not change the current error state
   *
   * @param {string|number} CMIErrorCode - The error code to get diagnostic information for
   * @return {string} The diagnostic information
   */
  abstract lmsGetDiagnostic(CMIErrorCode: string | number): string;

  /**
   * Abstract method for validating that a response is correct.
   * This method is used to validate the format and content of a response
   * before it is set in the CMI data model.
   *
   * @param {string} _CMIElement - The CMI element path to validate
   * @param {any} _value - The value to validate
   * @throws {Error} If the response format is invalid
   */
  abstract validateCorrectResponse(_CMIElement: string, _value: any): void;

  /**
   * Gets or builds a new child element to add to the array.
   * APIs that inherit BaseAPI should override this method.
   *
   * @param {string} _CMIElement - unused
   * @param {*} _value - unused
   * @param {boolean} _foundFirstIndex - unused
   * @return {BaseCMI|null}
   * @abstract
   */
  abstract getChildElement(
    _CMIElement: string,
    _value: any,
    _foundFirstIndex: boolean,
  ): BaseCMI | null;

  /**
   * Attempts to store the data to the LMS, logs data if no LMS configured
   * APIs that inherit BaseAPI should override this function
   *
   * @param {boolean} _calculateTotalTime
   * @return {ResultObject}
   * @abstract
   */
  abstract storeData(_calculateTotalTime: boolean): ResultObject;

  /**
   * Render the cmi object to the proper format for LMS commit
   *
   * @param {boolean} _terminateCommit - Whether this commit is part of the termination process
   * @param {boolean} [_includeTotalTime] - Whether to include total time in the commit data
   * @return {StringKeyMap|Array}
   * @abstract
   */
  abstract renderCommitCMI(
    _terminateCommit: boolean,
    _includeTotalTime?: boolean,
  ): StringKeyMap | Array<string>;

  /**
   * Render the commit object to the shortened format for LMS commit.
   * This method transforms the CMI data into a format suitable for sending to the LMS.
   * It is called during the commit process to prepare the data for transmission.
   *
   * @param {boolean} _terminateCommit - Whether this commit is part of the termination process
   * @param {boolean} [_includeTotalTime] - Whether to include total time in the commit data
   * @return {CommitObject} A formatted object containing the data to be sent to the LMS
   * @example
   * // Example of a commit object structure
   * {
   *   method: "POST",
   *   params: {
   *     cmi: { ... },
   *     finishState: "COMPLETED"
   *   }
   * }
   */
  abstract renderCommitObject(_terminateCommit: boolean, _includeTotalTime?: boolean): CommitObject;

  /**
   * Logging for all SCORM actions
   *
   * @param {string} functionName
   * @param {string} logMessage
   * @param {number} messageLevel
   * @param {string} CMIElement
   */
  apiLog(functionName: string, logMessage: string, messageLevel: LogLevel, CMIElement?: string) {
    logMessage = formatMessage(functionName, logMessage, CMIElement);

    // Delegate to LoggingService which handles log level comparison properly
    this._loggingService.log(messageLevel, logMessage);
  }

  /**
   * Getter for _settings
   * @return {InternalSettings}
   */
  get settings(): InternalSettings {
    return this._settings;
  }

  /**
   * Setter for _settings
   * @param {Settings} settings
   */
  set settings(settings: Settings) {
    const previousSettings = this._settings;
    // Merge the incoming settings with the existing settings
    this._settings = { ...this._settings, ...settings } as InternalSettings;

    // Update HTTP service settings
    this._httpService?.updateSettings(this._settings);

    // The following properties are duplicated as class properties for easier access
    // and need to be manually updated to stay in sync with the settings object

    // Update log level if it changed
    if (settings.logLevel !== undefined && settings.logLevel !== previousSettings.logLevel) {
      this._loggingService?.setLogLevel(settings.logLevel);
    }

    // Update log handler if onLogMessage changed
    if (
      settings.onLogMessage !== undefined &&
      settings.onLogMessage !== previousSettings.onLogMessage
    ) {
      this._loggingService?.setLogHandler(settings.onLogMessage);
    }
  }

  /**
   * Terminates the current run of the API
   * @param {string} callbackName
   * @param {boolean} checkTerminated
   * @return {string}
   */
  terminate(callbackName: string, checkTerminated: boolean): string {
    // Per SCORM 2004 3rd Edition RTE Section 3.1.3.2:
    // Return "false" for all error conditions (112, 113, 111, 201)
    let returnValue = global_constants.SCORM_TRUE;
    let stateCheckPassed = false;

    // Check if not initialized first
    if (this.isNotInitialized()) {
      const errorCode = this._error_codes.TERMINATION_BEFORE_INIT ?? 0;
      this.throwSCORMError("api", errorCode);
      // Per SCORM 2004 3rd Ed RTE 3.1.3.2: return "false" for error 112
      // SCORM 1.2 (error 101) returns "true" for error conditions
      if (errorCode === 112) returnValue = global_constants.SCORM_FALSE;
    } else if (checkTerminated && this.isTerminated()) {
      const errorCode = this._error_codes.MULTIPLE_TERMINATION ?? 0;
      this.throwSCORMError("api", errorCode);
      // Per SCORM 2004 3rd Ed RTE 3.1.3.2: return "false" for error 113
      // SCORM 1.2 (error 101) returns "true" for error conditions
      if (errorCode === 113) returnValue = global_constants.SCORM_FALSE;
    } else {
      stateCheckPassed = true;

      // Fire BeforeTerminate event for offline sync
      this.processListeners("BeforeTerminate");

      const result: ResultObject = this.storeData(true);
      if ((result.errorCode ?? 0) > 0) {
        // Log detailed error information before throwing SCORM error
        if (result.errorMessage) {
          this.apiLog(
            "terminate",
            `Terminate failed with error: ${result.errorMessage}`,
            LogLevelEnum.ERROR,
          );
        }
        if (result.errorDetails) {
          this.apiLog(
            "terminate",
            `Error details: ${JSON.stringify(result.errorDetails)}`,
            LogLevelEnum.DEBUG,
          );
        }
        // Per SCORM spec: on error 111, state remains "Running" and return "false"
        this.throwSCORMError("api", result.errorCode ?? 0);
        returnValue = global_constants.SCORM_FALSE;
      } else {
        // Only transition to Terminated state after successful storeData
        // Per SCORM 2004 3rd Edition RTE Section 3.1.3.2
        this.currentState = global_constants.STATE_TERMINATED;
        // Only clear error if there was no error
        if (checkTerminated) this.lastErrorCode = "0";
        returnValue = result?.result ?? global_constants.SCORM_TRUE;
      }

      this.processListeners(callbackName);
    }

    this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);

    // Only clear error if state check passed
    if (stateCheckPassed) {
      this.clearSCORMError(returnValue);
    }

    return returnValue;
  }

  /**
   * Get the value of the CMIElement.
   *
   * @param {string} callbackName
   * @param {boolean} checkTerminated
   * @param {string} CMIElement
   * @return {string}
   */
  getValue(callbackName: string, checkTerminated: boolean, CMIElement: string): string {
    let returnValue: string = "";

    if (
      this.checkState(
        checkTerminated,
        this._error_codes.RETRIEVE_BEFORE_INIT ?? 0,
        this._error_codes.RETRIEVE_AFTER_TERM ?? 0,
      )
    ) {
      // Only reset the error code if there's no error and checkTerminated is true
      // This is a no-op if lastErrorCode is already "0"
      try {
        returnValue = this.getCMIValue(CMIElement);
      } catch (e) {
        returnValue = this.handleValueAccessException(CMIElement, e, returnValue);
      }
      this.processListeners(callbackName, CMIElement);
    }

    this.apiLog(callbackName, ": returned: " + returnValue, LogLevelEnum.INFO, CMIElement);

    if (returnValue === undefined) {
      return "";
    }

    // Only clear the error code if there's no error
    if (this.lastErrorCode === "0") {
      this.clearSCORMError(returnValue);
    }

    return returnValue;
  }

  /**
   * Sets the value of the CMIElement.
   *
   * @param {string} callbackName
   * @param {string} commitCallback
   * @param {boolean} checkTerminated
   * @param {string} CMIElement
   * @param {*} value
   * @return {string}
   */
  setValue(
    callbackName: string,
    commitCallback: string,
    checkTerminated: boolean,
    CMIElement: string,
    value: any,
  ): string {
    if (value !== undefined) {
      value = String(value);
    }
    let returnValue: string = global_constants.SCORM_FALSE;

    if (
      this.checkState(
        checkTerminated,
        this._error_codes.STORE_BEFORE_INIT ?? 0,
        this._error_codes.STORE_AFTER_TERM ?? 0,
      )
    ) {
      // Only reset the error code if there's no error and checkTerminated is true
      // This is a no-op if lastErrorCode is already "0"
      try {
        returnValue = this.setCMIValue(CMIElement, value);
      } catch (e) {
        returnValue = this.handleValueAccessException(CMIElement, e, returnValue);
      }
      this.processListeners(callbackName, CMIElement, value);
    }

    if (returnValue === undefined) {
      returnValue = global_constants.SCORM_FALSE;
    }

    // If we didn't have any errors while setting the data, go ahead and
    // schedule a commit, if autocommit is turned on
    if (String(this.lastErrorCode) === "0") {
      if (this.settings.autocommit) {
        this.scheduleCommit(this.settings.autocommitSeconds * 1000, commitCallback);
      }
    }

    this.apiLog(
      callbackName,
      ": " + value + ": result: " + returnValue,
      LogLevelEnum.INFO,
      CMIElement,
    );

    // Only clear the error code if there's no error
    if (this.lastErrorCode === "0") {
      this.clearSCORMError(returnValue);
    }

    return returnValue;
  }

  /**
   * Orders LMS to store all content parameters
   * @param {string} callbackName
   * @param {boolean} checkTerminated
   * @return {string}
   */
  commit(callbackName: string, checkTerminated: boolean = false): string {
    this.clearScheduledCommit();

    // Per SCORM 2004 3rd Edition RTE Section 3.1.4.3:
    // Return "false" for all error conditions (142, 143, 391, 201)
    let returnValue = global_constants.SCORM_TRUE;

    // Check if not initialized first
    if (this.isNotInitialized()) {
      const errorCode = this._error_codes.COMMIT_BEFORE_INIT ?? 0;
      this.throwSCORMError("api", errorCode);
      // Per SCORM 2004 3rd Ed RTE 3.1.4.3: return "false" for error 142
      // SCORM 1.2 (error 301) returns "true" for error conditions
      if (errorCode === 142) returnValue = global_constants.SCORM_FALSE;
    } else if (checkTerminated && this.isTerminated()) {
      const errorCode = this._error_codes.COMMIT_AFTER_TERM ?? 0;
      this.throwSCORMError("api", errorCode);
      // Per SCORM 2004 3rd Ed RTE 3.1.4.3: return "false" for error 143
      if (errorCode === 143) returnValue = global_constants.SCORM_FALSE;
    } else {
      const result = this.storeData(false);
      if ((result.errorCode ?? 0) > 0) {
        // Log detailed error information before throwing SCORM error
        if (result.errorMessage) {
          this.apiLog(
            "commit",
            `Commit failed with error: ${result.errorMessage}`,
            LogLevelEnum.ERROR,
          );
        }
        if (result.errorDetails) {
          this.apiLog(
            "commit",
            `Error details: ${JSON.stringify(result.errorDetails)}`,
            LogLevelEnum.DEBUG,
          );
        }
        this.throwSCORMError("api", result.errorCode);
      }
      returnValue = result?.result ?? global_constants.SCORM_FALSE;

      this.apiLog(callbackName, " Result: " + returnValue, LogLevelEnum.DEBUG, "HttpRequest");

      if (checkTerminated) this.lastErrorCode = "0";

      this.processListeners(callbackName);

      // Fire async offline sync in background if needed
      if (
        this.settings.enableOfflineSupport &&
        this._offlineStorageService &&
        this._offlineStorageService.isDeviceOnline() &&
        this._courseId
      ) {
        this._offlineStorageService.hasPendingOfflineData(this._courseId).then((hasPendingData) => {
          if (hasPendingData) {
            this.apiLog(callbackName, "Syncing pending offline data", LogLevelEnum.INFO);
            this._offlineStorageService?.syncOfflineData().then((syncSuccess) => {
              if (syncSuccess) {
                this.apiLog(callbackName, "Successfully synced offline data", LogLevelEnum.INFO);
                this.processListeners("OfflineDataSynced");
              } else {
                this.apiLog(callbackName, "Failed to sync some offline data", LogLevelEnum.WARN);
              }
            });
          }
        });
      }
    }

    this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);

    // Only clear error if we actually performed a commit (not a state error)
    if (!this.isNotInitialized() && !(checkTerminated && this.isTerminated())) {
      this.clearSCORMError(returnValue);
    }

    return returnValue;
  }

  /**
   * Returns last error code
   * @param {string} callbackName
   * @return {string}
   */
  getLastError(callbackName: string): string {
    const returnValue = String(this.lastErrorCode);

    this.processListeners(callbackName);

    this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);

    return returnValue;
  }

  /**
   * Returns the errorNumber error description
   *
   * @param {string} callbackName
   * @param {(string|number)} CMIErrorCode
   * @return {string} - Error description string (max 255 chars per spec)
   */
  getErrorString(callbackName: string, CMIErrorCode: string | number): string {
    let returnValue = "";

    if (CMIErrorCode !== null && CMIErrorCode !== "") {
      returnValue = this.getLmsErrorMessageDetails(CMIErrorCode);
      this.processListeners(callbackName);
    }

    // Per SCORM spec: GetErrorString return value max length is 255 characters
    if (returnValue.length > 255) {
      returnValue = returnValue.substring(0, 255);
    }

    this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);

    return returnValue;
  }

  /**
   * Returns a comprehensive description of the errorNumber error.
   *
   * @param {string} callbackName
   * @param {(string|number)} CMIErrorCode
   * @return {string}
   */
  getDiagnostic(callbackName: string, CMIErrorCode: string | number): string {
    let returnValue = "";

    // Per SCORM spec: empty string requests diagnostic for the last error
    const errorCode = CMIErrorCode === "" ? String(this.lastErrorCode) : CMIErrorCode;

    if (errorCode !== null && errorCode !== "") {
      // Check for custom diagnostic message first (set by throwSCORMError)
      // Only use custom diagnostic if requesting info about the last error
      const customDiagnostic = this._errorHandlingService.lastDiagnostic;
      if (customDiagnostic && String(errorCode) === String(this.lastErrorCode)) {
        returnValue = customDiagnostic;
      } else {
        returnValue = this.getLmsErrorMessageDetails(errorCode, true);
      }
      this.processListeners(callbackName);
    }

    // Per SCORM spec: GetDiagnostic return value max length is 255 characters
    if (returnValue.length > 255) {
      returnValue = returnValue.substring(0, 255);
    }

    this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);

    return returnValue;
  }

  /**
   * Checks the LMS state and ensures it has been initialized.
   *
   * @param {boolean} checkTerminated
   * @param {number} beforeInitError
   * @param {number} afterTermError
   * @return {boolean}
   */
  checkState(checkTerminated: boolean, beforeInitError: number, afterTermError: number): boolean {
    if (this.isNotInitialized()) {
      this.throwSCORMError("api", beforeInitError);
      return false;
    } else if (checkTerminated && this.isTerminated()) {
      this.throwSCORMError("api", afterTermError);
      return false;
    }

    return true;
  }

  /**
   * Checks if setting an ID would create a duplicate in the objectives or interactions array.
   * Per SCORM 2004 RTE Section 4.1.5/4.1.6: IDs must be unique within their respective arrays.
   *
   * @param {string} CMIElement - The element path (e.g., "cmi.objectives.0.id")
   * @param {string} value - The ID value being set
   * @return {boolean} - True if a duplicate would be created, false otherwise
   * @protected
   */
  protected _checkForDuplicateId(CMIElement: string, value: string): boolean {
    // Match objectives: cmi.objectives.n.id
    const objectivesMatch = CMIElement.match(/^cmi\.objectives\.(\d+)\.id$/);
    if (objectivesMatch && objectivesMatch[1]) {
      const currentIndex = parseInt(objectivesMatch[1], 10);
      const cmiObj = (this as any).cmi;
      if (cmiObj?.objectives?.childArray) {
        for (let i = 0; i < cmiObj.objectives.childArray.length; i++) {
          if (i !== currentIndex && cmiObj.objectives.childArray[i]?.id === value) {
            return true; // Duplicate found
          }
        }
      }
      return false;
    }

    // Match interactions: cmi.interactions.n.id
    const interactionsMatch = CMIElement.match(/^cmi\.interactions\.(\d+)\.id$/);
    if (interactionsMatch && interactionsMatch[1]) {
      const currentIndex = parseInt(interactionsMatch[1], 10);
      const cmiObj = (this as any).cmi;
      if (cmiObj?.interactions?.childArray) {
        for (let i = 0; i < cmiObj.interactions.childArray.length; i++) {
          if (i !== currentIndex && cmiObj.interactions.childArray[i]?.id === value) {
            return true; // Duplicate found
          }
        }
      }
      return false;
    }

    // Match interaction objectives: cmi.interactions.n.objectives.m.id
    const interactionObjectivesMatch = CMIElement.match(
      /^cmi\.interactions\.(\d+)\.objectives\.(\d+)\.id$/,
    );
    if (
      interactionObjectivesMatch &&
      interactionObjectivesMatch[1] &&
      interactionObjectivesMatch[2]
    ) {
      const interactionIndex = parseInt(interactionObjectivesMatch[1], 10);
      const currentObjIndex = parseInt(interactionObjectivesMatch[2], 10);
      const cmiObj = (this as any).cmi;
      const interaction = cmiObj?.interactions?.childArray?.[interactionIndex];
      if (interaction?.objectives?.childArray) {
        for (let i = 0; i < interaction.objectives.childArray.length; i++) {
          if (i !== currentObjIndex && interaction.objectives.childArray[i]?.id === value) {
            return true; // Duplicate found
          }
        }
      }
      return false;
    }

    return false;
  }

  /**
   * Returns the message that corresponds to errorNumber
   * APIs that inherit BaseAPI should override this function
   *
   * @param {(string|number)} _errorNumber
   * @param {boolean} _detail
   * @return {string}
   * @abstract
   */
  getLmsErrorMessageDetails(_errorNumber: string | number, _detail: boolean = false): string {
    throw new Error("The getLmsErrorMessageDetails method has not been implemented");
  }

  /**
   * Gets the value for the specific element.
   * APIs that inherit BaseAPI should override this function
   *
   * @param {string} _CMIElement
   * @return {string}
   * @abstract
   */
  getCMIValue(_CMIElement: string): string {
    throw new Error("The getCMIValue method has not been implemented");
  }

  /**
   * Sets the value for the specific element.
   * APIs that inherit BaseAPI should override this function
   *
   * @param {string} _CMIElement
   * @param {any} _value
   * @return {string}
   * @abstract
   */
  setCMIValue(_CMIElement: string, _value: any): string {
    throw new Error("The setCMIValue method has not been implemented");
  }

  /**
   * Shared API method to set a valid for a given element.
   *
   * @param {string} methodName
   * @param {boolean} scorm2004
   * @param {string} CMIElement
   * @param {any} value
   * @return {string}
   */
  _commonSetCMIValue(
    methodName: string,
    scorm2004: boolean,
    CMIElement: string,
    value: any,
  ): string {
    if (!CMIElement || CMIElement === "") {
      if (scorm2004) {
        this.throwSCORMError(
          CMIElement,
          this._error_codes.GENERAL_SET_FAILURE,
          "The data model element was not specified",
        );
      }
      return global_constants.SCORM_FALSE;
    }

    this.lastErrorCode = "0";

    const structure = CMIElement.split(".");
    let refObject: StringKeyMap | BaseCMI = this as StringKeyMap;
    let returnValue = global_constants.SCORM_FALSE;
    let foundFirstIndex = false;

    const invalidErrorMessage = `The data model element passed to ${methodName} (${CMIElement}) is not a valid SCORM data model element.`;
    const invalidErrorCode = scorm2004
      ? this._error_codes.UNDEFINED_DATA_MODEL
      : this._error_codes.GENERAL;

    for (let idx = 0; idx < structure.length; idx++) {
      const attribute = structure[idx];

      if (idx === structure.length - 1) {
        if (scorm2004 && attribute && attribute.substring(0, 8) === "{target=") {
          if (this.isInitialized()) {
            this.throwSCORMError(CMIElement, this._error_codes.READ_ONLY_ELEMENT);
            break;
          } else {
            refObject = {
              ...refObject,
              attribute: value,
            };
          }
        } else if (
          typeof attribute === "undefined" ||
          !this._checkObjectHasProperty(refObject as StringKeyMap, attribute)
        ) {
          this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
          break;
        } else {
          if (
            stringMatches(CMIElement, "\\.correct_responses\\.\\d+$") &&
            this.isInitialized() &&
            attribute !== "pattern"
          ) {
            this.validateCorrectResponse(CMIElement, value);
            if (this.lastErrorCode !== "0") {
              this.throwSCORMError(CMIElement, this._error_codes.TYPE_MISMATCH);
              break;
            }
          }

          if (!scorm2004 || this._errorHandlingService.lastErrorCode === "0") {
            if (
              typeof attribute === "undefined" ||
              attribute === "__proto__" ||
              attribute === "constructor"
            ) {
              this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
              break;
            }

            // SCORM 2004: Check for duplicate IDs in objectives and interactions arrays
            // Per SCORM 2004 RTE Section 4.1.5/4.1.6: IDs must be unique within their respective arrays
            if (scorm2004 && attribute === "id" && this.isInitialized()) {
              const duplicateError = this._checkForDuplicateId(CMIElement, value);
              if (duplicateError) {
                this.throwSCORMError(CMIElement, this._error_codes.GENERAL_SET_FAILURE);
                break;
              }
            }

            (refObject as StringKeyMap)[attribute] = value;
            returnValue = global_constants.SCORM_TRUE;
          }
        }
      } else {
        if (
          typeof attribute === "undefined" ||
          !this._checkObjectHasProperty(refObject as StringKeyMap, attribute)
        ) {
          this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
          break;
        }
        refObject = (refObject as StringKeyMap)[attribute] as StringKeyMap;
        if (!refObject) {
          this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
          break;
        }

        if (refObject instanceof CMIArray) {
          const index = parseInt(structure[idx + 1] || "0", 10);

          // SCO is trying to set an item on an array
          if (!isNaN(index)) {
            const item = refObject.childArray[index];

            if (item) {
              refObject = item;
              foundFirstIndex = true;
            } else {
              // SCORM spec requires sequential array indices (0, 1, 2, ...)
              // Cannot skip indices when adding to arrays
              if (index > refObject.childArray.length) {
                const errorCode = scorm2004
                  ? this._error_codes.GENERAL_SET_FAILURE
                  : this._error_codes.INVALID_SET_VALUE || this._error_codes.GENERAL_SET_FAILURE;
                this.throwSCORMError(
                  CMIElement,
                  errorCode,
                  `Cannot set array element at index ${index}. Array indices must be sequential. Current array length is ${refObject.childArray.length}, expected index ${refObject.childArray.length}.`,
                );
                break;
              }

              // Note: SCORM 2004 3rd Edition specifies SPM limits for arrays
              // (objectives: 100, interactions: 250, comments: 250)
              // We intentionally do NOT enforce these limits to maximize
              // content compatibility. Real-world content may exceed these limits.

              const newChild = this.getChildElement(CMIElement, value, foundFirstIndex);
              foundFirstIndex = true;

              if (!newChild) {
                if (this.lastErrorCode === "0") {
                  this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
                }
                break;
              } else {
                if (refObject.initialized) newChild.initialize();
                refObject.childArray[index] = newChild;
                refObject = newChild;
              }
            }

            // Have to update idx value to skip the array position
            idx++;
          }
        }
      }
    }

    if (returnValue === global_constants.SCORM_FALSE) {
      this.apiLog(
        methodName,
        `There was an error setting the value for: ${CMIElement}, value of: ${value}`,
        LogLevelEnum.WARN,
      );
    }

    return returnValue;
  }

  /**
   * Gets a value from the CMI Object
   *
   * @param {string} methodName
   * @param {boolean} scorm2004
   * @param {string} CMIElement
   * @return {any}
   */
  _commonGetCMIValue(methodName: string, scorm2004: boolean, CMIElement: string): any {
    if (!CMIElement || CMIElement === "") {
      if (scorm2004) {
        this.throwSCORMError(
          CMIElement,
          this._error_codes.GENERAL_GET_FAILURE,
          "The data model element was not specified",
        );
      }
      return "";
    }

    // SCORM 2004: Validate ._version keyword usage - only valid on cmi._version
    if (scorm2004 && CMIElement.endsWith("._version") && CMIElement !== "cmi._version") {
      this.throwSCORMError(
        CMIElement,
        this._error_codes.GENERAL_GET_FAILURE,
        "The _version keyword was used incorrectly",
      );
      return "";
    }

    const structure = CMIElement.split(".");
    let refObject: StringKeyMap = this as StringKeyMap;
    let attribute = null;

    const uninitializedErrorMessage = `The data model element passed to ${methodName} (${CMIElement}) has not been initialized.`;
    const invalidErrorMessage = `The data model element passed to ${methodName} (${CMIElement}) is not a valid SCORM data model element.`;
    const invalidErrorCode = scorm2004
      ? this._error_codes.UNDEFINED_DATA_MODEL
      : this._error_codes.GENERAL;

    for (let idx = 0; idx < structure.length; idx++) {
      attribute = structure[idx];

      if (!scorm2004) {
        if (idx === structure.length - 1) {
          if (
            typeof attribute === "undefined" ||
            !this._checkObjectHasProperty(refObject, attribute)
          ) {
            this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
            return;
          }
        }
      } else {
        if (
          String(attribute).substring(0, 8) === "{target=" &&
          typeof refObject._isTargetValid == "function"
        ) {
          // Extract target from {target=X} format: skip "{target=" (8 chars) and "}" (1 char at end)
          const target = String(attribute).substring(8, String(attribute).length - 1);
          return refObject._isTargetValid(target);
        } else if (
          typeof attribute === "undefined" ||
          !this._checkObjectHasProperty(refObject, attribute)
        ) {
          // SCORM 2004: Check for keyword errors with specific diagnostics
          if (attribute === "_children") {
            this.throwSCORMError(
              CMIElement,
              this._error_codes.GENERAL_GET_FAILURE,
              "The data model element does not have children",
            );
            return;
          } else if (attribute === "_count") {
            this.throwSCORMError(
              CMIElement,
              this._error_codes.GENERAL_GET_FAILURE,
              "The data model element is not a collection and therefore does not have a count",
            );
            return;
          }
          this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
          return;
        }
      }

      if (attribute !== undefined && attribute !== null) {
        refObject = refObject[attribute] as StringKeyMap;
        if (refObject === undefined) {
          this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
          break;
        }
      } else {
        this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
        break;
      }

      if (refObject instanceof CMIArray) {
        const index = parseInt(structure[idx + 1] || "", 10);

        // SCO is trying to set an item on an array
        if (!isNaN(index)) {
          const item = refObject.childArray[index];

          if (item) {
            refObject = item;
          } else {
            this.throwSCORMError(
              CMIElement,
              this._error_codes.VALUE_NOT_INITIALIZED,
              uninitializedErrorMessage,
            );
            return;
          }

          // Have to update idx value to skip the array position
          idx++;
        }
      }
    }

    if (refObject === null || refObject === undefined) {
      if (!scorm2004) {
        // SCORM 1.2: Use specific keyword error codes
        if (attribute === "_children") {
          this.throwSCORMError(CMIElement, this._error_codes.CHILDREN_ERROR, undefined);
        } else if (attribute === "_count") {
          this.throwSCORMError(CMIElement, this._error_codes.COUNT_ERROR, undefined);
        }
      }
      // SCORM 2004 keyword errors are handled during traversal (lines 1318-1333)
    } else {
      return refObject;
    }
  }

  /**
   * Returns true if the API's current state is STATE_INITIALIZED
   *
   * @return {boolean}
   */
  isInitialized(): boolean {
    return this.currentState === global_constants.STATE_INITIALIZED;
  }

  /**
   * Returns true if the API's current state is STATE_NOT_INITIALIZED
   *
   * @return {boolean}
   */
  isNotInitialized(): boolean {
    return this.currentState === global_constants.STATE_NOT_INITIALIZED;
  }

  /**
   * Returns true if the API's current state is STATE_TERMINATED
   *
   * @return {boolean}
   */
  isTerminated(): boolean {
    return this.currentState === global_constants.STATE_TERMINATED;
  }

  /**
   * Provides a mechanism for attaching to a specific SCORM event.
   * This method allows you to register a callback function that will be executed
   * when the specified event occurs.
   *
   * @param {string} listenerName - The name of the event to listen for (e.g., "Initialize", "Terminate", "GetValue", "SetValue", "Commit")
   * @param {function} callback - The function to execute when the event occurs. The callback will receive relevant event data.
   * @example
   * // Listen for Initialize events
   * api.on("Initialize", function() {
   *   console.log("API has been initialized");
   * });
   *
   * // Listen for SetValue events
   * api.on("SetValue", function(element, value) {
   *   console.log("Setting " + element + " to " + value);
   * });
   */
  on(listenerName: string, callback: Function) {
    this._eventService.on(listenerName, callback);
  }

  /**
   * Provides a mechanism for detaching a specific SCORM event listener.
   * This method removes a previously registered callback for an event.
   * Both the event name and the callback reference must match what was used in the 'on' method.
   *
   * @param {string} listenerName - The name of the event to stop listening for
   * @param {function} callback - The callback function to remove
   * @example
   * // Remove a specific listener
   * const myCallback = function() { console.log("API initialized"); };
   * api.on("Initialize", myCallback);
   * // Later, when you want to remove it:
   * api.off("Initialize", myCallback);
   */
  off(listenerName: string, callback: Function) {
    this._eventService.off(listenerName, callback);
  }

  /**
   * Provides a mechanism for clearing all listeners from a specific SCORM event.
   * This method removes all callbacks registered for the specified event.
   *
   * @param {string} listenerName - The name of the event to clear all listeners for
   * @example
   * // Remove all listeners for the Initialize event
   * api.clear("Initialize");
   */
  clear(listenerName: string) {
    this._eventService.clear(listenerName);
  }

  /**
   * Processes any 'on' listeners that have been created for a specific event.
   * This method is called internally when SCORM events occur to notify all registered listeners.
   * It triggers all callback functions registered for the specified event.
   *
   * @param {string} functionName - The name of the function/event that occurred
   * @param {string} CMIElement - Optional CMI element involved in the event
   * @param {any} value - Optional value associated with the event
   */
  processListeners(functionName: string, CMIElement?: string, value?: any) {
    this._eventService.processListeners(functionName, CMIElement, value);
  }

  /**
   * Throws a SCORM error with the specified error number and optional message.
   * This method sets the last error code and can be used to indicate that an operation failed.
   * The error number should correspond to one of the standard SCORM error codes.
   *
   * @param {string} CMIElement
   * @param {number} errorNumber - The SCORM error code to set
   * @param {string} message - Optional custom error message to provide additional context
   * @example
   * // Throw a "not initialized" error
   * this.throwSCORMError(301, "The API must be initialized before calling GetValue");
   */
  throwSCORMError(
    CMIElement: string | undefined,
    errorNumber: number | undefined,
    message?: string,
  ) {
    this._errorHandlingService.throwSCORMError(CMIElement, errorNumber ?? 0, message);
  }

  /**
   * Clears the last SCORM error code when an operation succeeds.
   * This method is typically called after successful API operations to reset the error state.
   * It only clears the error if the success parameter is "true".
   *
   * @param {string} success - A string indicating whether the operation succeeded ("true" or "false")
   * @example
   * // Clear error after successful operation
   * this.clearSCORMError("true");
   */
  clearSCORMError(success: string) {
    this._errorHandlingService.clearSCORMError(success);
  }

  /**
   * Load the CMI from a flattened JSON object.
   * This method populates the CMI data model from a flattened JSON structure
   * where keys represent CMI element paths (e.g., "cmi.core.student_id").
   *
   * @param {StringKeyMap} json - The flattened JSON object containing CMI data
   * @param {string} CMIElement - Optional base CMI element path to prepend to all keys
   * @example
   * // Load data from a flattened JSON structure
   * api.loadFromFlattenedJSON({
   *   "cmi.core.student_id": "12345",
   *   "cmi.core.student_name": "John Doe",
   *   "cmi.core.lesson_status": "incomplete"
   * });
   */
  loadFromFlattenedJSON(json: StringKeyMap, CMIElement?: string) {
    if (!CMIElement) {
      // by default, we start from a blank string because we're expecting each element to start with `cmi`
      CMIElement = "";
    }

    this._serializationService.loadFromFlattenedJSON(
      json,
      CMIElement,
      (CMIElement, value) => this.setCMIValue(CMIElement, value),
      () => this.isNotInitialized(),
      (data: StringKeyMap) => {
        this.startingData = data;
      },
    );
  }

  /**
   * Returns a flattened JSON object representing the current CMI data.
   */
  getFlattenedCMI(): StringKeyMap {
    return Utilities.flatten(this.renderCMIToJSONObject());
  }

  /**
   * Loads CMI data from a hierarchical JSON object.
   * This method populates the CMI data model from a nested JSON structure
   * that mirrors the CMI object hierarchy.
   *
   * @param {StringKeyMap} json - The hierarchical JSON object containing CMI data
   * @param {string} CMIElement - Optional base CMI element path to prepend to all keys
   * @example
   * // Load data from a hierarchical JSON structure
   * api.loadFromJSON({
   *   core: {
   *     student_id: "12345",
   *     student_name: "John Doe",
   *     lesson_status: "incomplete"
   *   },
   *   objectives: [
   *     { id: "obj1", score: { raw: 85 } }
   *   ]
   * });
   */
  loadFromJSON(json: StringKeyMap, CMIElement: string = "") {
    if (
      (!CMIElement || CMIElement === "") &&
      !Object.hasOwnProperty.call(json, "cmi") &&
      !Object.hasOwnProperty.call(json, "adl")
    ) {
      // providing a backward compatibility for the old v1 API
      CMIElement = "cmi";
    }
    this._serializationService.loadFromJSON(
      json,
      CMIElement,
      (CMIElement, value) => this.setCMIValue(CMIElement, value),
      () => this.isNotInitialized(),
      (data: StringKeyMap) => {
        this.startingData = data;
      },
    );
  }

  /**
   * Render the CMI object to a JSON string for sending to an LMS.
   * This method serializes the current CMI data model to a JSON string.
   * The output format is controlled by the sendFullCommit setting.
   *
   * @return {string} A JSON string representation of the CMI data
   * @example
   * // Get the current CMI data as a JSON string
   * const jsonString = api.renderCMIToJSONString();
   * console.log(jsonString); // '{"core":{"student_id":"12345",...}}'
   */
  renderCMIToJSONString(): string {
    return this._serializationService.renderCMIToJSONString(this.cmi, this.settings.sendFullCommit);
  }

  /**
   * Returns a JavaScript object representing the current CMI data.
   * This method creates a plain JavaScript object that mirrors the
   * structure of the CMI data model, suitable for further processing.
   *
   * @return {StringKeyMap} A JavaScript object representing the CMI data
   * @example
   * // Get the current CMI data as a JavaScript object
   * const cmiObject = api.renderCMIToJSONObject();
   * console.log(cmiObject.core.student_id); // "12345"
   */
  renderCMIToJSONObject(): StringKeyMap {
    return this._serializationService.renderCMIToJSONObject(this.cmi, this.settings.sendFullCommit);
  }

  /**
   * Process an HTTP request
   *
   * @param {string} url - The URL to send the request to
   * @param {CommitObject | StringKeyMap | Array<any>} params - The parameters to send
   * @param {boolean} immediate - Whether to send the request immediately without waiting
   * @returns {ResultObject} - The result of the request
   */
  processHttpRequest(
    url: string,
    params: CommitObject | StringKeyMap | Array<any>,
    immediate: boolean = false,
  ): ResultObject {
    // If offline support is enabled and device is offline, store data locally instead of sending
    if (
      this.settings.enableOfflineSupport &&
      this._offlineStorageService &&
      !this._offlineStorageService.isDeviceOnline() &&
      this._courseId
    ) {
      this.apiLog(
        "processHttpRequest",
        "Device is offline, storing data locally",
        LogLevelEnum.INFO,
      );

      if (params && typeof params === "object" && "cmi" in params) {
        // Store offline and return actual storage result (localStorage is synchronous)
        return this._offlineStorageService.storeOffline(this._courseId, params as CommitObject);
      } else {
        this.apiLog(
          "processHttpRequest",
          "Invalid commit data format for offline storage",
          LogLevelEnum.ERROR,
        );
        return {
          result: global_constants.SCORM_FALSE,
          errorCode: this._error_codes.GENERAL ?? 101,
        };
      }
    }

    // Otherwise, proceed with HTTP request (synchronous or async based on service)
    return this._httpService.processHttpRequest(
      url,
      params,
      immediate,
      (functionName, message, level, element) => this.apiLog(functionName, message, level, element),
      (functionName, CMIElement, value) => this.processListeners(functionName, CMIElement, value),
    );
  }

  /**
   * Schedules a commit operation to occur after a specified delay.
   * This method is used to implement auto-commit functionality, where data
   * is periodically sent to the LMS without requiring explicit commit calls.
   *
   * @param {number} when - The number of milliseconds to wait before committing
   * @param {string} callback - The name of the commit event callback
   * @example
   * // Schedule a commit to happen in 60 seconds
   * api.scheduleCommit(60000, "commit");
   */
  scheduleCommit(when: number, callback: string) {
    if (!this._timeout) {
      this._timeout = new ScheduledCommit(this, when, callback);
      this.apiLog("scheduleCommit", "scheduled", LogLevelEnum.DEBUG, "");
    }
  }

  /**
   * Clears and cancels any currently scheduled commits.
   * This method is typically called when an explicit commit is performed
   * or when the API is terminated, to prevent redundant commits.
   *
   * @example
   * // Cancel any pending scheduled commits
   * api.clearScheduledCommit();
   */
  clearScheduledCommit() {
    if (this._timeout) {
      this._timeout.cancel();
      this._timeout = undefined;
      this.apiLog("clearScheduledCommit", "cleared", LogLevelEnum.DEBUG, "");
    }
  }

  /**
   * Checks if an object has a specific property, using multiple detection methods.
   * This method performs a thorough check for property existence by:
   * 1. Checking if it's an own property using Object.hasOwnProperty
   * 2. Checking if it's defined in the prototype with a property descriptor
   * 3. Checking if it's accessible via the 'in' operator (includes inherited properties)
   *
   * @param {StringKeyMap} StringKeyMap - The object to check for the property
   * @param {string} attribute - The property name to look for
   * @return {boolean} True if the property exists on the object or its prototype chain
   * @private
   *
   * @example
   * // Check for an own property
   * const obj = { name: "John" };
   * this._checkObjectHasProperty(obj, "name"); // Returns true
   *
   * @example
   * // Check for an inherited property
   * class Parent { get type() { return "parent"; } }
   * const child = Object.create(new Parent());
   * this._checkObjectHasProperty(child, "type"); // Returns true
   *
   * @example
   * // Check for a non-existent property
   * const obj = { name: "John" };
   * this._checkObjectHasProperty(obj, "age"); // Returns false
   */
  private _checkObjectHasProperty(obj: StringKeyMap, attribute: string): boolean {
    // Handle primitives - they don't have custom properties and 'in' operator throws on them
    if (obj === null || obj === undefined || typeof obj !== "object") {
      return false;
    }
    return (
      Object.hasOwnProperty.call(obj, attribute) ||
      Object.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), attribute) != null ||
      attribute in obj
    );
  }

  /**
   * Handles exceptions that occur when accessing CMI values.
   * This method delegates to the ErrorHandlingService to process exceptions
   * that occur during CMI data operations, ensuring consistent error handling
   * throughout the API.
   *
   * @param {string} CMIElement
   * @param {any} e - The exception that was thrown
   * @param {string} returnValue - The default return value to use if an error occurs
   * @return {string} Either the original returnValue or SCORM_FALSE if an error occurred
   * @private
   *
   * @example
   * // Handle a validation error when getting a CMI value
   * try {
   *   return this.getCMIValue("cmi.core.score.raw");
   * } catch (e) {
   *   return this.handleValueAccessException(e, "");
   * }
   *
   * @example
   * // Handle a general error when setting a CMI value
   * try {
   *   this.setCMIValue("cmi.core.lesson_status", "completed");
   *   return "true";
   * } catch (e) {
   *   return this.handleValueAccessException(e, "false");
   * }
   */
  private handleValueAccessException(CMIElement: string, e: any, returnValue: string): string {
    if (e instanceof ValidationError) {
      this.lastErrorCode = String(e.errorCode);
      // Per SCORM spec: GetValue returns "" on error, SetValue returns "false"
      // The caller passes the appropriate default, so we preserve it
      // Only override to "false" if returnValue wasn't already set to ""
      if (returnValue !== "") {
        returnValue = global_constants.SCORM_FALSE;
      }
      this.throwSCORMError(CMIElement, e.errorCode, e.errorMessage);
    } else {
      if (e instanceof Error && e.message) {
        this.throwSCORMError(CMIElement, this._error_codes.GENERAL, e.message);
      } else {
        this.throwSCORMError(CMIElement, this._error_codes.GENERAL, "Unknown error");
      }
    }
    return returnValue;
  }

  /**
   * Builds the commit object to be sent to the LMS.
   * This method delegates to the SerializationService to create a properly
   * formatted object containing the CMI data that needs to be sent to the LMS.
   * The format and content of the commit object depend on whether this is a
   * regular commit or a termination commit.
   *
   * @param {boolean} terminateCommit - Whether this is a termination commit
   * @return {CommitObject|StringKeyMap|Array} The formatted commit object
   * @protected
   *
   * @example
   * // Create a regular commit object
   * const regularCommit = this.getCommitObject(false);
   * // Result might be: { cmi: { core: { lesson_status: "incomplete" } } }
   *
   * @example
   * // Create a termination commit object (includes total_time)
   * const terminationCommit = this.getCommitObject(true);
   * // Result might be: { cmi: { core: { lesson_status: "completed", total_time: "PT1H30M" } } }
   */
  protected getCommitObject(terminateCommit: boolean): CommitObject | StringKeyMap | Array<any> {
    return this._serializationService.getCommitObject(
      terminateCommit,
      this.settings.alwaysSendTotalTime,
      this.settings.renderCommonCommitFields,
      (terminateCommit: boolean, includeTotalTime?: boolean) =>
        this.renderCommitObject(terminateCommit, includeTotalTime),
      (terminateCommit: boolean, includeTotalTime?: boolean) =>
        this.renderCommitCMI(terminateCommit, includeTotalTime),
      this.settings.logLevel,
    );
  }
}
