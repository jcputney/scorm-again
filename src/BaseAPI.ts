import { CMIArray } from "./cmi/common/array";
import { ValidationError } from "./exceptions";
import { ErrorCode } from "./constants/error_codes";
import { global_constants } from "./constants/api_constants";
import { formatMessage, stringMatches, unflatten } from "./utilities";
import { BaseCMI } from "./cmi/common/base_cmi";
import {
  CommitObject,
  LogLevel,
  RefObject,
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

/**
 * Base API class for AICC, SCORM 1.2, and SCORM 2004. Should be considered
 * abstract, and never initialized on its own.
 */
export default abstract class BaseAPI implements IBaseAPI {
  private _timeout?: ScheduledCommit;
  private readonly _error_codes: ErrorCode;
  private _settings: Settings = DefaultSettings;
  private readonly _httpService: HttpService;
  private _eventService: EventService;
  private _serializationService: SerializationService;
  private _cmiDataService: CMIDataService;

  /**
   * Constructor for Base API class. Sets some shared API fields, as well as
   * sets up options for the API.
   * @param {ErrorCode} error_codes
   * @param {Settings} settings
   */
  protected constructor(error_codes: ErrorCode, settings?: Settings) {
    if (new.target === BaseAPI) {
      throw new TypeError("Cannot construct BaseAPI instances directly");
    }
    this.currentState = global_constants.STATE_NOT_INITIALIZED;
    this.lastErrorCode = "0";

    this._error_codes = error_codes;

    if (settings) {
      this.settings = settings;
    }
    this.apiLogLevel = this.settings.logLevel;
    this.selfReportSessionTime = this.settings.selfReportSessionTime;

    if (this.apiLogLevel === undefined) {
      this.apiLogLevel = LogLevelEnum.NONE;
    }

    // Initialize HTTP service
    this._httpService = new HttpService(
      this.settings,
      this.apiLogLevel,
      this._error_codes,
    );

    // Initialize Event service
    this._eventService = new EventService(this.apiLog.bind(this));

    // Initialize Serialization service
    this._serializationService = new SerializationService();

    // Initialize CMI Data service
    this._cmiDataService = new CMIDataService(
      this._error_codes,
      this.apiLog.bind(this),
      this.throwSCORMError.bind(this),
      this.validateCorrectResponse.bind(this),
      this.getChildElement.bind(this),
      this._checkObjectHasProperty.bind(this),
      this.lastErrorCode,
    );
  }

  public abstract cmi: BaseCMI;
  public startingData?: RefObject;

  public currentState: number;
  public lastErrorCode: string;
  public apiLogLevel: LogLevel;
  public selfReportSessionTime: boolean;

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

  abstract lmsInitialize(): string;

  abstract lmsFinish(): string;

  abstract lmsGetValue(CMIElement: string): string;

  abstract lmsSetValue(CMIElement: string, value: any): string;

  abstract lmsCommit(): string;

  abstract lmsGetLastError(): string;

  abstract lmsGetErrorString(CMIErrorCode: string | number): string;

  abstract lmsGetDiagnostic(CMIErrorCode: string | number): string;

  /**
   * Abstract method for validating that a response is correct.
   *
   * @param {string} _CMIElement
   * @param {any} _value
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
   * @return {RefObject|Array}
   * @abstract
   */
  abstract renderCommitCMI(_terminateCommit: boolean): RefObject | Array<any>;

  /**
   * Render the commit object to the shortened format for LMS commit
   * @param {boolean} _terminateCommit
   * @return {CommitObject}
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
      this.settings.onLogMessage(messageLevel, logMessage);
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
    this._settings = { ...this._settings, ...settings };

    // Update HTTP service settings
    if (this._httpService) {
      this._httpService.updateSettings(this._settings);
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
      if (typeof result.errorCode !== "undefined" && result.errorCode > 0) {
        this.throwSCORMError(result.errorCode);
      }
      returnValue =
        typeof result !== "undefined" && result.result
          ? result.result
          : global_constants.SCORM_FALSE;

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
        this.handleValueAccessException(e, returnValue);
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
      if (result.errorCode && result.errorCode > 0) {
        this.throwSCORMError(result.errorCode);
      }
      returnValue =
        typeof result !== "undefined" && result.result
          ? result.result
          : global_constants.SCORM_FALSE;

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
   * Provides a mechanism for attaching to a specific SCORM event
   *
   * @param {string} listenerName
   * @param {function} callback
   */
  on(listenerName: string, callback: Function) {
    this._eventService.on(listenerName, callback);
  }

  /**
   * Provides a mechanism for detaching a specific SCORM event listener
   *
   * @param {string} listenerName
   * @param {function} callback
   */
  off(listenerName: string, callback: Function) {
    this._eventService.off(listenerName, callback);
  }

  /**
   * Provides a mechanism for clearing all listeners from a specific SCORM event
   *
   * @param {string} listenerName
   */
  clear(listenerName: string) {
    this._eventService.clear(listenerName);
  }

  /**
   * Processes any 'on' listeners that have been created
   *
   * @param {string} functionName
   * @param {string} CMIElement
   * @param {any} value
   */
  processListeners(functionName: string, CMIElement?: string, value?: any) {
    this._eventService.processListeners(functionName, CMIElement, value);
  }

  /**
   * Throws a SCORM error
   *
   * @param {number} errorNumber
   * @param {string} message
   */
  throwSCORMError(errorNumber: number, message?: string) {
    if (!message) {
      message = this.getLmsErrorMessageDetails(errorNumber);
    }

    this.apiLog(
      "throwSCORMError",
      errorNumber + ": " + message,
      LogLevelEnum.ERROR,
    );

    this.lastErrorCode = String(errorNumber);
  }

  /**
   * Clears the last SCORM error code on success.
   *
   * @param {string} success
   */
  clearSCORMError(success: string) {
    if (success !== undefined && success !== global_constants.SCORM_FALSE) {
      this.lastErrorCode = "0";
    }
  }

  /**
   * Load the CMI from a flattened JSON object
   * @param {RefObject} json
   * @param {string} CMIElement
   */
  loadFromFlattenedJSON(json: RefObject, CMIElement?: string) {
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
   * Loads CMI data from a JSON object.
   *
   * @param {RefObject} json
   * @param {string} CMIElement
   */
  loadFromJSON(json: RefObject, CMIElement: string = "") {
    this._serializationService.loadFromJSON(
      json,
      CMIElement,
      this.setCMIValue.bind(this),
      this.isNotInitialized.bind(this),
      (data: RefObject) => {
        this.startingData = data;
      },
    );
  }

  /**
   * Render the CMI object to JSON for sending to an LMS.
   *
   * @return {string}
   */
  renderCMIToJSONString(): string {
    return this._serializationService.renderCMIToJSONString(
      this.cmi,
      this.settings.sendFullCommit,
    );
  }

  /**
   * Returns a JS object representing the current cmi
   * @return {object}
   */
  renderCMIToJSONObject(): object {
    return this._serializationService.renderCMIToJSONObject(
      this.cmi,
      this.settings.sendFullCommit,
    );
  }

  /**
   * Send the request to the LMS
   * @param {string} url
   * @param {CommitObject|RefObject|Array} params
   * @param {boolean} immediate
   * @return {ResultObject}
   */
  async processHttpRequest(
    url: string,
    params: CommitObject | RefObject | Array<any>,
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
   * Throws a SCORM error
   *
   * @param {number} when - the number of milliseconds to wait before committing
   * @param {string} callback - the name of the commit event callback
   */
  scheduleCommit(when: number, callback: string) {
    if (!this._timeout) {
      this._timeout = new ScheduledCommit(this, when, callback);
      this.apiLog("scheduleCommit", "scheduled", LogLevelEnum.DEBUG, "");
    }
  }

  /**
   * Clears and cancels any currently scheduled commits
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
   * @param {RefObject} refObject
   * @param {string} attribute
   * @return {boolean}
   * @private
   */
  private _checkObjectHasProperty(
    refObject: RefObject,
    attribute: string,
  ): boolean {
    return (
      Object.hasOwnProperty.call(refObject, attribute) ||
      Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(refObject),
        attribute,
      ) != null ||
      attribute in refObject
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
    if (e instanceof ValidationError) {
      this.lastErrorCode = String(e.errorCode);
      returnValue = global_constants.SCORM_FALSE;
    } else {
      if (e instanceof Error && e.message) {
        console.error(e.message);
      } else {
        console.error(e);
      }
      this.throwSCORMError(this._error_codes.GENERAL);
    }
    return returnValue;
  }

  /**
   * Builds the commit object to be sent to the LMS
   * @param {boolean} terminateCommit
   * @return {CommitObject|RefObject|Array}
   * @private
   */
  protected getCommitObject(
    terminateCommit: boolean,
  ): CommitObject | RefObject | Array<any> {
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
