import { ErrorCode } from "./constants/error_codes";
import { global_constants } from "./constants/api_constants";
import { formatMessage, StringKeyMap } from "./utilities";
import { BaseCMI } from "./cmi/common/base_cmi";
import {
  CommitObject,
  LogLevel,
  ResultObject,
  Settings,
} from "./types/api_types";
import { DefaultSettings } from "./constants/default_settings";
import { IBaseAPI } from "./interfaces/IBaseAPI";
import { ScheduledCommit } from "./helpers/scheduled_commit";
import { LogLevelEnum } from "./constants/enums";
import { HttpService } from "./services/HttpService";
import { EventService } from "./services/EventService";
import { SerializationService } from "./services/SerializationService";
import { CMIDataService } from "./services/CMIDataService";
import { createErrorHandlingService } from "./services/ErrorHandlingService";
import { getLoggingService } from "./services/LoggingService";
import {
  ICMIDataService,
  IErrorHandlingService,
  IEventService,
  IHttpService,
  ILoggingService,
  ISerializationService,
} from "./interfaces/services";

/**
 * Base API class for AICC, SCORM 1.2, and SCORM 2004. Should be considered
 * abstract, and never initialized on its own.
 */
export default abstract class BaseAPI implements IBaseAPI {
  private _timeout?: ScheduledCommit;
  private readonly _error_codes: ErrorCode;
  private _settings: Settings = DefaultSettings;
  private readonly _httpService: IHttpService;
  private _eventService: IEventService;
  private _serializationService: ISerializationService;
  private _cmiDataService: ICMIDataService;
  private readonly _errorHandlingService: IErrorHandlingService;
  private readonly _loggingService: ILoggingService;

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
  ) {
    if (new.target === BaseAPI) {
      throw new TypeError("Cannot construct BaseAPI instances directly");
    }
    this.currentState = global_constants.STATE_NOT_INITIALIZED;

    this._error_codes = error_codes;

    if (settings) {
      this.settings = settings;
    }
    this.apiLogLevel = this.settings.logLevel;
    this.selfReportSessionTime = this.settings.selfReportSessionTime;

    if (this.apiLogLevel === undefined) {
      this.apiLogLevel = LogLevelEnum.NONE;
    }

    // Initialize and configure LoggingService
    this._loggingService = loggingService || getLoggingService();
    this._loggingService.setLogLevel(this.apiLogLevel);

    // If settings include a custom onLogMessage function, use it as the log handler
    if (this.settings.onLogMessage) {
      this._loggingService.setLogHandler(this.settings.onLogMessage);
    }

    // Initialize HTTP service
    this._httpService =
      httpService || new HttpService(this.settings, this._error_codes);

    // Initialize Event service
    this._eventService =
      eventService || new EventService(this.apiLog.bind(this));

    // Initialize Serialization service
    this._serializationService =
      serializationService || new SerializationService();

    // Initialize Error Handling service
    this._errorHandlingService =
      errorHandlingService ||
      createErrorHandlingService(
        this._error_codes,
        this.apiLog.bind(this),
        this.getLmsErrorMessageDetails.bind(this),
      );

    // Initialize CMI Data service
    this._cmiDataService =
      cmiDataService ||
      new CMIDataService(
        this._error_codes,
        this.apiLog.bind(this),
        this.throwSCORMError.bind(this),
        this.validateCorrectResponse.bind(this),
        this.getChildElement.bind(this),
        this._checkObjectHasProperty.bind(this),
        this._errorHandlingService,
      );
  }

  public abstract cmi: BaseCMI;
  public startingData?: StringKeyMap;

  public currentState: number;
  public apiLogLevel: LogLevel;
  public selfReportSessionTime: boolean;

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
    this.startingData = undefined;
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
      this.throwSCORMError(this._error_codes.INITIALIZED, initializeMessage);
    } else if (this.isTerminated()) {
      this.throwSCORMError(this._error_codes.TERMINATED, terminationMessage);
    } else {
      if (this.selfReportSessionTime) {
        this.cmi.setStartTime();
      }

      this.currentState = global_constants.STATE_INITIALIZED;
      this.lastErrorCode = "0";
      returnValue = global_constants.SCORM_TRUE;
      this.processListeners(callbackName);
    }

    this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);
    this.clearSCORMError(returnValue);

    return returnValue;
  }

  /**
   * Initialize the LMS API
   * @return {string} "true" if successful, "false" otherwise
   */
  abstract lmsInitialize(): string;

  /**
   * Finish the current LMS API session
   * @return {string} "true" if successful, "false" otherwise
   */
  abstract lmsFinish(): string;

  /**
   * Get the value of a CMI element from the LMS
   * @param {string} CMIElement - The CMI element to get the value of
   * @return {string} The value of the CMI element
   */
  abstract lmsGetValue(CMIElement: string): string;

  /**
   * Set the value of a CMI element in the LMS
   * @param {string} CMIElement - The CMI element to set the value of
   * @param {any} value - The value to set
   * @return {string} "true" if successful, "false" otherwise
   */
  abstract lmsSetValue(CMIElement: string, value: any): string;

  /**
   * Commit the current data to the LMS
   * @return {string} "true" if successful, "false" otherwise
   */
  abstract lmsCommit(): string;

  /**
   * Get the last error code from the LMS
   * @return {string} The last error code
   */
  abstract lmsGetLastError(): string;

  /**
   * Get the error string for a specific error code
   * @param {string|number} CMIErrorCode - The error code to get the string for
   * @return {string} The error string
   */
  abstract lmsGetErrorString(CMIErrorCode: string | number): string;

  /**
   * Get diagnostic information for a specific error code
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
  abstract storeData(_calculateTotalTime: boolean): Promise<ResultObject>;

  /**
   * Render the cmi object to the proper format for LMS commit
   * APIs that inherit BaseAPI should override this function
   *
   * @param {boolean} _terminateCommit
   * @return {StringKeyMap|Array}
   * @abstract
   */
  abstract renderCommitCMI(
    _terminateCommit: boolean,
  ): StringKeyMap | Array<any>;

  /**
   * Render the commit object to the shortened format for LMS commit.
   * This method transforms the CMI data into a format suitable for sending to the LMS.
   * It is called during the commit process to prepare the data for transmission.
   *
   * @param {boolean} _terminateCommit - Whether this commit is part of the termination process
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
  abstract renderCommitObject(_terminateCommit: boolean): CommitObject;

  /**
   * Logging for all SCORM actions
   *
   * @param {string} functionName
   * @param {string} logMessage
   * @param {number} messageLevel
   * @param {string} CMIElement
   */
  apiLog(
    functionName: string,
    logMessage: string,
    messageLevel: LogLevel,
    CMIElement?: string,
  ) {
    logMessage = formatMessage(functionName, logMessage, CMIElement);

    if (messageLevel >= this.apiLogLevel) {
      // Use the injected LoggingService
      this._loggingService.log(messageLevel, logMessage);

      // For backward compatibility, also call the settings.onLogMessage if it exists
      // and is different from the LoggingService's handler
      if (
        this.settings.onLogMessage &&
        this.settings.onLogMessage !==
          (this._loggingService as any)["_logHandler"]
      ) {
        this.settings.onLogMessage(messageLevel, logMessage);
      }
    }
  }

  /**
   * Getter for _error_codes
   * @return {ErrorCode}
   */
  get error_codes(): ErrorCode {
    return this._error_codes;
  }

  /**
   * Getter for _settings
   * @return {Settings}
   */
  get settings(): Settings {
    return this._settings;
  }

  /**
   * Setter for _settings
   * @param {Settings} settings
   */
  set settings(settings: Settings) {
    const previousSettings = this._settings;
    this._settings = { ...this._settings, ...settings };

    // Update HTTP service settings
    this._httpService?.updateSettings(this._settings);

    // Update log level if it changed
    if (
      settings.logLevel !== undefined &&
      settings.logLevel !== previousSettings.logLevel
    ) {
      this.apiLogLevel = settings.logLevel;
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
  async terminate(
    callbackName: string,
    checkTerminated: boolean,
  ): Promise<string> {
    let returnValue = global_constants.SCORM_FALSE;

    if (
      this.checkState(
        checkTerminated,
        this._error_codes.TERMINATION_BEFORE_INIT,
        this._error_codes.MULTIPLE_TERMINATION,
      )
    ) {
      this.currentState = global_constants.STATE_TERMINATED;

      const result: ResultObject = await this.storeData(true);
      if ((result.errorCode ?? 0) > 0) {
        this.throwSCORMError(result.errorCode);
      }
      returnValue = result?.result ?? global_constants.SCORM_FALSE;

      if (checkTerminated) this.lastErrorCode = "0";

      returnValue = global_constants.SCORM_TRUE;
      this.processListeners(callbackName);
    }

    this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);
    this.clearSCORMError(returnValue);

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
  getValue(
    callbackName: string,
    checkTerminated: boolean,
    CMIElement: string,
  ): string {
    let returnValue: string = "";

    if (
      this.checkState(
        checkTerminated,
        this._error_codes.RETRIEVE_BEFORE_INIT,
        this._error_codes.RETRIEVE_AFTER_TERM,
      )
    ) {
      if (checkTerminated) this.lastErrorCode = "0";
      try {
        returnValue = this.getCMIValue(CMIElement);
      } catch (e) {
        returnValue = this.handleValueAccessException(e, returnValue);
      }
      this.processListeners(callbackName, CMIElement);
    }

    this.apiLog(
      callbackName,
      ": returned: " + returnValue,
      LogLevelEnum.INFO,
      CMIElement,
    );

    if (returnValue === undefined) {
      return "";
    }

    this.clearSCORMError(returnValue);

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
        this._error_codes.STORE_BEFORE_INIT,
        this._error_codes.STORE_AFTER_TERM,
      )
    ) {
      if (checkTerminated) this.lastErrorCode = "0";
      try {
        returnValue = this.setCMIValue(CMIElement, value);
      } catch (e) {
        returnValue = this.handleValueAccessException(e, returnValue);
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
        this.scheduleCommit(
          this.settings.autocommitSeconds * 1000,
          commitCallback,
        );
      }
    }

    this.apiLog(
      callbackName,
      ": " + value + ": result: " + returnValue,
      LogLevelEnum.INFO,
      CMIElement,
    );
    this.clearSCORMError(returnValue);

    return returnValue;
  }

  /**
   * Orders LMS to store all content parameters
   * @param {string} callbackName
   * @param {boolean} checkTerminated
   * @return {string}
   */
  async commit(
    callbackName: string,
    checkTerminated: boolean = false,
  ): Promise<string> {
    this.clearScheduledCommit();

    let returnValue = global_constants.SCORM_FALSE;

    if (
      this.checkState(
        checkTerminated,
        this._error_codes.COMMIT_BEFORE_INIT,
        this._error_codes.COMMIT_AFTER_TERM,
      )
    ) {
      const result = await this.storeData(false);
      if ((result.errorCode ?? 0) > 0) {
        this.throwSCORMError(result.errorCode);
      }
      returnValue = result?.result ?? global_constants.SCORM_FALSE;

      this.apiLog(
        callbackName,
        " Result: " + returnValue,
        LogLevelEnum.DEBUG,
        "HttpRequest",
      );

      if (checkTerminated) this.lastErrorCode = "0";

      this.processListeners(callbackName);
    }

    this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);
    this.clearSCORMError(returnValue);

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
   * @return {string}
   */
  getErrorString(callbackName: string, CMIErrorCode: string | number): string {
    let returnValue = "";

    if (CMIErrorCode !== null && CMIErrorCode !== "") {
      returnValue = this.getLmsErrorMessageDetails(CMIErrorCode);
      this.processListeners(callbackName);
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

    if (CMIErrorCode !== null && CMIErrorCode !== "") {
      returnValue = this.getLmsErrorMessageDetails(CMIErrorCode, true);
      this.processListeners(callbackName);
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
  checkState(
    checkTerminated: boolean,
    beforeInitError: number,
    afterTermError: number,
  ): boolean {
    if (this.isNotInitialized()) {
      this.throwSCORMError(beforeInitError);
      return false;
    } else if (checkTerminated && this.isTerminated()) {
      this.throwSCORMError(afterTermError);
      return false;
    }

    return true;
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
  getLmsErrorMessageDetails(
    _errorNumber: string | number,
    _detail: boolean = false,
  ): string {
    throw new Error(
      "The getLmsErrorMessageDetails method has not been implemented",
    );
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
    return this._cmiDataService.setCMIValue(
      this,
      methodName,
      scorm2004,
      CMIElement,
      value,
      this.isInitialized(),
    );
  }

  /**
   * Gets a value from the CMI Object
   *
   * @param {string} methodName
   * @param {boolean} scorm2004
   * @param {string} CMIElement
   * @return {any}
   */
  _commonGetCMIValue(
    methodName: string,
    scorm2004: boolean,
    CMIElement: string,
  ): any {
    return this._cmiDataService.getCMIValue(
      this,
      methodName,
      scorm2004,
      CMIElement,
    );
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
   * @param {number} errorNumber - The SCORM error code to set
   * @param {string} message - Optional custom error message to provide additional context
   * @example
   * // Throw a "not initialized" error
   * this.throwSCORMError(301, "The API must be initialized before calling GetValue");
   */
  throwSCORMError(errorNumber: number, message?: string) {
    this._errorHandlingService.throwSCORMError(errorNumber, message);
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
      this.loadFromJSON.bind(this),
      this.setCMIValue.bind(this),
      this.isNotInitialized.bind(this),
    );
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
    this._serializationService.loadFromJSON(
      json,
      CMIElement,
      this.setCMIValue.bind(this),
      this.isNotInitialized.bind(this),
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
    return this._serializationService.renderCMIToJSONString(
      this.cmi,
      this.settings.sendFullCommit,
    );
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
    return this._serializationService.renderCMIToJSONObject(
      this.cmi,
      this.settings.sendFullCommit,
    );
  }

  /**
   * Sends a request to the LMS with the specified parameters.
   * This method handles communication with the LMS server, including
   * formatting the request, handling the response, and triggering appropriate events.
   *
   * @param {string} url - The URL endpoint to send the request to
   * @param {CommitObject|StringKeyMap|Array} params - The data to send to the LMS
   * @param {boolean} immediate - Whether to send the request immediately (true) or queue it (false)
   * @return {Promise<ResultObject>} A promise that resolves with the result of the request
   * @example
   * // Send data to the LMS immediately
   * const result = await api.processHttpRequest(
   *   "https://lms.example.com/scorm/commit",
   *   { method: "POST", params: { cmi: { core: { lesson_status: "completed" } } } },
   *   true
   * );
   * console.log(result.errorCode === 0 ? "Success" : "Failed");
   */
  async processHttpRequest(
    url: string,
    params: CommitObject | StringKeyMap | Array<any>,
    immediate: boolean = false,
  ): Promise<ResultObject> {
    return this._httpService.processHttpRequest(
      url,
      params,
      immediate,
      this.apiLog.bind(this),
      this.processListeners.bind(this),
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
   * Check to see if the specific object has the given property
   * @param {StringKeyMap} StringKeyMap
   * @param {string} attribute
   * @return {boolean}
   * @private
   */
  private _checkObjectHasProperty(
    StringKeyMap: StringKeyMap,
    attribute: string,
  ): boolean {
    return (
      Object.hasOwnProperty.call(StringKeyMap, attribute) ||
      Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(StringKeyMap),
        attribute,
      ) != null ||
      attribute in StringKeyMap
    );
  }

  /**
   * Handles the error that occurs when trying to access a value
   * @param {any} e
   * @param {string} returnValue
   * @return {string}
   * @private
   */
  private handleValueAccessException(e: any, returnValue: string): string {
    return this._errorHandlingService.handleValueAccessException(
      e,
      returnValue,
    );
  }

  /**
   * Builds the commit object to be sent to the LMS
   * @param {boolean} terminateCommit
   * @return {CommitObject|StringKeyMap|Array}
   * @private
   */
  protected getCommitObject(
    terminateCommit: boolean,
  ): CommitObject | StringKeyMap | Array<any> {
    return this._serializationService.getCommitObject(
      terminateCommit,
      this.settings.alwaysSendTotalTime,
      this.settings.renderCommonCommitFields,
      this.renderCommitObject.bind(this),
      this.renderCommitCMI.bind(this),
      this.apiLogLevel,
    );
  }
}
