import { CMIArray } from "./cmi/common/array";
import { ValidationError } from "./exceptions";
import ErrorCodes, { ErrorCode } from "./constants/error_codes";
import APIConstants from "./constants/api_constants";
import { apiLogUtil, stringMatches, unflatten } from "./utilities";
import { BaseCMI } from "./cmi/common/base_cmi";
import { debounce } from "./utilities/debounce";
import { RefObject, ResultObject, Settings } from "./types/api_types";
import { DefaultSettings } from "./constants/default_settings";
import { IBaseAPI } from "./interfaces/IBaseAPI";
import { ScheduledCommit } from "./helpers/scheduled_commit";

/**
 * Base API class for AICC, SCORM 1.2, and SCORM 2004. Should be considered
 * abstract, and never initialized on its own.
 */
export default abstract class BaseAPI implements IBaseAPI {
  private _timeout?: ScheduledCommit;
  private readonly _error_codes: ErrorCode;
  private _settings: Settings = DefaultSettings;

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
    this.currentState = APIConstants.global.STATE_NOT_INITIALIZED;
    this.lastErrorCode = "0";
    this.listenerArray = [];

    this._error_codes = error_codes;

    if (settings) {
      this.settings = settings;
    }
    this.apiLogLevel = this.settings.logLevel;
    this.selfReportSessionTime = this.settings.selfReportSessionTime;
  }

  public abstract cmi: BaseCMI;
  public startingData?: RefObject;

  public currentState: number;
  public lastErrorCode: string;
  public listenerArray: any[];
  public apiLogLevel: number;
  public selfReportSessionTime: boolean;

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
    let returnValue = APIConstants.global.SCORM_FALSE;

    if (this.isInitialized()) {
      this.throwSCORMError(this._error_codes.INITIALIZED, initializeMessage);
    } else if (this.isTerminated()) {
      this.throwSCORMError(this._error_codes.TERMINATED, terminationMessage);
    } else {
      if (this.selfReportSessionTime) {
        this.cmi.setStartTime();
      }

      this.currentState = APIConstants.global.STATE_INITIALIZED;
      this.lastErrorCode = "0";
      returnValue = APIConstants.global.SCORM_TRUE;
      this.processListeners(callbackName);
    }

    this.apiLog(
      callbackName,
      "returned: " + returnValue,
      APIConstants.global.LOG_LEVEL_INFO,
    );
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
    messageLevel: number,
    CMIElement?: string,
  ) {
    apiLogUtil(
      functionName,
      logMessage,
      messageLevel,
      this.apiLogLevel,
      CMIElement,
    );
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
    let returnValue = APIConstants.global.SCORM_FALSE;

    if (
      this.checkState(
        checkTerminated,
        this._error_codes.TERMINATION_BEFORE_INIT,
        this._error_codes.MULTIPLE_TERMINATION,
      )
    ) {
      this.currentState = APIConstants.global.STATE_TERMINATED;

      const result: ResultObject = await this.storeData(true);
      if (typeof result.errorCode !== "undefined" && result.errorCode > 0) {
        this.throwSCORMError(result.errorCode);
      }
      returnValue =
        typeof result !== "undefined" && result.result
          ? result.result
          : APIConstants.global.SCORM_FALSE;

      if (checkTerminated) this.lastErrorCode = "0";

      returnValue = APIConstants.global.SCORM_TRUE;
      this.processListeners(callbackName);
    }

    this.apiLog(
      callbackName,
      "returned: " + returnValue,
      APIConstants.global.LOG_LEVEL_INFO,
    );
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
      APIConstants.global.LOG_LEVEL_INFO,
      CMIElement,
    );
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
    let returnValue: string = APIConstants.global.SCORM_FALSE;

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
      returnValue = APIConstants.global.SCORM_FALSE;
    }

    // If we didn't have any errors while setting the data, go ahead and
    // schedule a commit, if autocommit is turned on
    if (String(this.lastErrorCode) === "0") {
      if (this.settings.autocommit && !this._timeout) {
        this.scheduleCommit(
          this.settings.autocommitSeconds * 1000,
          commitCallback,
        );
      }
    }

    this.apiLog(
      callbackName,
      ": " + value + ": result: " + returnValue,
      APIConstants.global.LOG_LEVEL_INFO,
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

    let returnValue = APIConstants.global.SCORM_FALSE;

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
          : APIConstants.global.SCORM_FALSE;

      this.apiLog(
        callbackName,
        " Result: " + returnValue,
        APIConstants.global.LOG_LEVEL_DEBUG,
        "HttpRequest",
      );

      if (checkTerminated) this.lastErrorCode = "0";

      this.processListeners(callbackName);
    }

    this.apiLog(
      callbackName,
      "returned: " + returnValue,
      APIConstants.global.LOG_LEVEL_INFO,
    );
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

    this.apiLog(
      callbackName,
      "returned: " + returnValue,
      APIConstants.global.LOG_LEVEL_INFO,
    );

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

    this.apiLog(
      callbackName,
      "returned: " + returnValue,
      APIConstants.global.LOG_LEVEL_INFO,
    );

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

    this.apiLog(
      callbackName,
      "returned: " + returnValue,
      APIConstants.global.LOG_LEVEL_INFO,
    );

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
    if (!CMIElement || CMIElement === "") {
      return APIConstants.global.SCORM_FALSE;
    }

    const structure = CMIElement.split(".");
    let refObject: RefObject = this;
    let returnValue = APIConstants.global.SCORM_FALSE;
    let foundFirstIndex = false;

    const invalidErrorMessage = `The data model element passed to ${methodName} (${CMIElement}) is not a valid SCORM data model element.`;
    const invalidErrorCode = scorm2004
      ? this._error_codes.UNDEFINED_DATA_MODEL
      : this._error_codes.GENERAL;

    for (let idx = 0; idx < structure.length; idx++) {
      const attribute = structure[idx];

      if (idx === structure.length - 1) {
        if (
          scorm2004 &&
          attribute.substring(0, 8) === "{target=" &&
          typeof refObject._isTargetValid == "function"
        ) {
          this.throwSCORMError(this._error_codes.READ_ONLY_ELEMENT);
        } else if (!this._checkObjectHasProperty(refObject, attribute)) {
          this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
        } else {
          if (
            this.isInitialized() &&
            stringMatches(CMIElement, "\\.correct_responses\\.\\d+")
          ) {
            this.validateCorrectResponse(CMIElement, value);
          }

          if (!scorm2004 || this.lastErrorCode === "0") {
            refObject[attribute] = value;
            returnValue = APIConstants.global.SCORM_TRUE;
          }
        }
      } else {
        refObject = refObject[attribute];
        if (!refObject) {
          this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
          break;
        }

        if (refObject instanceof CMIArray) {
          const index = parseInt(structure[idx + 1], 10);

          // SCO is trying to set an item on an array
          if (!isNaN(index)) {
            const item = refObject.childArray[index];

            if (item) {
              refObject = item;
              foundFirstIndex = true;
            } else {
              const newChild = this.getChildElement(
                CMIElement,
                value,
                foundFirstIndex,
              );
              foundFirstIndex = true;

              if (!newChild) {
                this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
              } else {
                if (refObject.initialized) newChild.initialize();

                refObject.childArray.push(newChild);
                refObject = newChild;
              }
            }

            // Have to update idx value to skip the array position
            idx++;
          }
        }
      }
    }

    if (returnValue === APIConstants.global.SCORM_FALSE) {
      this.apiLog(
        methodName,
        `There was an error setting the value for: ${CMIElement}, value of: ${value}`,
        APIConstants.global.LOG_LEVEL_WARNING,
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
  _commonGetCMIValue(
    methodName: string,
    scorm2004: boolean,
    CMIElement: string,
  ): any {
    if (!CMIElement || CMIElement === "") {
      return "";
    }

    const structure = CMIElement.split(".");
    let refObject: RefObject = this;
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
          if (!this._checkObjectHasProperty(refObject, attribute)) {
            this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
            return;
          }
        }
      } else {
        if (
          String(attribute).substring(0, 8) === "{target=" &&
          typeof refObject._isTargetValid == "function"
        ) {
          const target = String(attribute).substring(
            8,
            String(attribute).length - 9,
          );
          return refObject._isTargetValid(target);
        } else if (!this._checkObjectHasProperty(refObject, attribute)) {
          this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
          return;
        }
      }

      refObject = refObject[attribute];
      if (refObject === undefined) {
        this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
        break;
      }

      if (refObject instanceof CMIArray) {
        const index = parseInt(structure[idx + 1], 10);

        // SCO is trying to set an item on an array
        if (!isNaN(index)) {
          const item = refObject.childArray[index];

          if (item) {
            refObject = item;
          } else {
            this.throwSCORMError(
              this._error_codes.VALUE_NOT_INITIALIZED,
              uninitializedErrorMessage,
            );
            break;
          }

          // Have to update idx value to skip the array position
          idx++;
        }
      }
    }

    if (refObject === null || refObject === undefined) {
      if (!scorm2004) {
        if (attribute === "_children") {
          this.throwSCORMError(ErrorCodes.scorm12.CHILDREN_ERROR);
        } else if (attribute === "_count") {
          this.throwSCORMError(ErrorCodes.scorm12.COUNT_ERROR);
        }
      }
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
    return this.currentState === APIConstants.global.STATE_INITIALIZED;
  }

  /**
   * Returns true if the API's current state is STATE_NOT_INITIALIZED
   *
   * @return {boolean}
   */
  isNotInitialized(): boolean {
    return this.currentState === APIConstants.global.STATE_NOT_INITIALIZED;
  }

  /**
   * Returns true if the API's current state is STATE_TERMINATED
   *
   * @return {boolean}
   */
  isTerminated(): boolean {
    return this.currentState === APIConstants.global.STATE_TERMINATED;
  }

  /**
   * Provides a mechanism for attaching to a specific SCORM event
   *
   * @param {string} listenerName
   * @param {function} callback
   */
  on(listenerName: string, callback: Function) {
    if (!callback) return;

    const listenerFunctions = listenerName.split(" ");
    for (let i = 0; i < listenerFunctions.length; i++) {
      const listenerSplit = listenerFunctions[i].split(".");
      if (listenerSplit.length === 0) return;

      const functionName = listenerSplit[0];

      let CMIElement = null;
      if (listenerSplit.length > 1) {
        CMIElement = listenerName.replace(functionName + ".", "");
      }

      this.listenerArray.push({
        functionName: functionName,
        CMIElement: CMIElement,
        callback: callback,
      });

      this.apiLog(
        "on",
        `Added event listener: ${this.listenerArray.length}`,
        APIConstants.global.LOG_LEVEL_INFO,
        functionName,
      );
    }
  }

  /**
   * Provides a mechanism for detaching a specific SCORM event listener
   *
   * @param {string} listenerName
   * @param {function} callback
   */
  off(listenerName: string, callback: Function) {
    if (!callback) return;

    const listenerFunctions = listenerName.split(" ");
    for (let i = 0; i < listenerFunctions.length; i++) {
      const listenerSplit = listenerFunctions[i].split(".");
      if (listenerSplit.length === 0) return;

      const functionName = listenerSplit[0];

      let CMIElement = null;
      if (listenerSplit.length > 1) {
        CMIElement = listenerName.replace(functionName + ".", "");
      }

      const removeIndex = this.listenerArray.findIndex(
        (obj) =>
          obj.functionName === functionName &&
          obj.CMIElement === CMIElement &&
          obj.callback === callback,
      );
      if (removeIndex !== -1) {
        this.listenerArray.splice(removeIndex, 1);
        this.apiLog(
          "off",
          `Removed event listener: ${this.listenerArray.length}`,
          APIConstants.global.LOG_LEVEL_INFO,
          functionName,
        );
      }
    }
  }

  /**
   * Provides a mechanism for clearing all listeners from a specific SCORM event
   *
   * @param {string} listenerName
   */
  clear(listenerName: string) {
    const listenerFunctions = listenerName.split(" ");
    for (let i = 0; i < listenerFunctions.length; i++) {
      const listenerSplit = listenerFunctions[i].split(".");
      if (listenerSplit.length === 0) return;

      const functionName = listenerSplit[0];

      let CMIElement = null;
      if (listenerSplit.length > 1) {
        CMIElement = listenerName.replace(functionName + ".", "");
      }

      this.listenerArray = this.listenerArray.filter(
        (obj) =>
          obj.functionName !== functionName && obj.CMIElement !== CMIElement,
      );
    }
  }

  /**
   * Processes any 'on' listeners that have been created
   *
   * @param {string} functionName
   * @param {string} CMIElement
   * @param {any} value
   */
  processListeners(functionName: string, CMIElement?: string, value?: any) {
    this.apiLog(
      functionName,
      value,
      APIConstants.global.LOG_LEVEL_INFO,
      CMIElement,
    );
    for (let i = 0; i < this.listenerArray.length; i++) {
      const listener = this.listenerArray[i];
      const functionsMatch = listener.functionName === functionName;
      const listenerHasCMIElement = !!listener.CMIElement;
      let CMIElementsMatch = false;
      if (
        CMIElement &&
        listener.CMIElement &&
        listener.CMIElement.substring(listener.CMIElement.length - 1) === "*"
      ) {
        CMIElementsMatch =
          CMIElement.indexOf(
            listener.CMIElement.substring(0, listener.CMIElement.length - 1),
          ) === 0;
      } else {
        CMIElementsMatch = listener.CMIElement === CMIElement;
      }

      if (functionsMatch && (!listenerHasCMIElement || CMIElementsMatch)) {
        this.apiLog(
          "processListeners",
          `Processing listener: ${listener.functionName}`,
          APIConstants.global.LOG_LEVEL_INFO,
          CMIElement,
        );
        listener.callback(CMIElement, value);
      }
    }
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
      APIConstants.global.LOG_LEVEL_ERROR,
    );

    this.lastErrorCode = String(errorNumber);
  }

  /**
   * Clears the last SCORM error code on success.
   *
   * @param {string} success
   */
  clearSCORMError(success: string) {
    if (success !== undefined && success !== APIConstants.global.SCORM_FALSE) {
      this.lastErrorCode = "0";
    }
  }

  /**
   * Load the CMI from a flattened JSON object
   * @param {RefObject} json
   * @param {string} CMIElement
   */
  loadFromFlattenedJSON(json: RefObject, CMIElement: string) {
    if (!this.isNotInitialized()) {
      console.error(
        "loadFromFlattenedJSON can only be called before the call to lmsInitialize.",
      );
      return;
    }

    /**
     * Test match pattern.
     *
     * @param {string} a
     * @param {string} c
     * @param {RegExp} a_pattern
     * @return {number}
     */
    function testPattern(
      a: string,
      c: string,
      a_pattern: RegExp,
    ): number | null {
      const a_match = a.match(a_pattern);

      let c_match;
      if (a_match !== null && (c_match = c.match(a_pattern)) !== null) {
        const a_num = Number(a_match[2]);
        const c_num = Number(c_match[2]);
        if (a_num === c_num) {
          if (a_match[3] === "id") {
            return -1;
          } else if (a_match[3] === "type") {
            if (c_match[3] === "id") {
              return 1;
            } else {
              return -1;
            }
          } else {
            return 1;
          }
        }
        return a_num - c_num;
      }

      return null;
    }

    const int_pattern = /^(cmi\.interactions\.)(\d+)\.(.*)$/;
    const obj_pattern = /^(cmi\.objectives\.)(\d+)\.(.*)$/;

    const result = Object.keys(json).map(function (key) {
      return [String(key), json[key]];
    });

    // CMI interactions need to have id and type loaded before any other fields
    result.sort(function ([a, _b], [c, _d]) {
      let test;
      if ((test = testPattern(a, c, int_pattern)) !== null) {
        return test;
      }
      if ((test = testPattern(a, c, obj_pattern)) !== null) {
        return test;
      }

      if (a < c) {
        return -1;
      }
      if (a > c) {
        return 1;
      }
      return 0;
    });

    let obj: RefObject;
    result.forEach((element) => {
      obj = {};
      obj[element[0]] = element[1];
      this.loadFromJSON(unflatten(obj), CMIElement);
    });
  }

  /**
   * Loads CMI data from a JSON object.
   *
   * @param {RefObject} json
   * @param {string} CMIElement
   */
  loadFromJSON(json: RefObject, CMIElement: string) {
    if (!this.isNotInitialized()) {
      console.error(
        "loadFromJSON can only be called before the call to lmsInitialize.",
      );
      return;
    }

    CMIElement = CMIElement !== undefined ? CMIElement : "cmi";

    this.startingData = json;

    // could this be refactored down to flatten(json) then setCMIValue on each?
    for (const key in json) {
      if ({}.hasOwnProperty.call(json, key) && json[key]) {
        const currentCMIElement = (CMIElement ? CMIElement + "." : "") + key;
        const value = json[key];

        if (value["childArray"]) {
          for (let i = 0; i < value["childArray"].length; i++) {
            this.loadFromJSON(
              value["childArray"][i],
              currentCMIElement + "." + i,
            );
          }
        } else if (value.constructor === Object) {
          this.loadFromJSON(value, currentCMIElement);
        } else {
          this.setCMIValue(currentCMIElement, value);
        }
      }
    }
  }

  /**
   * Render the CMI object to JSON for sending to an LMS.
   *
   * @return {string}
   */
  renderCMIToJSONString(): string {
    const cmi = this.cmi;
    // Do we want/need to return fields that have no set value?
    // return JSON.stringify({ cmi }, (k, v) => v === undefined ? null : v, 2);
    return JSON.stringify({ cmi });
  }

  /**
   * Returns a JS object representing the current cmi
   * @return {object}
   */
  renderCMIToJSONObject(): object {
    // Do we want/need to return fields that have no set value?
    // return JSON.stringify({ cmi }, (k, v) => v === undefined ? null : v, 2);
    return JSON.parse(this.renderCMIToJSONString());
  }

  /**
   * Send the request to the LMS
   * @param {string} url
   * @param {RefObject|Array} params
   * @param {boolean} immediate
   * @return {ResultObject}
   */
  async processHttpRequest(
    url: string,
    params: RefObject | Array<any>,
    immediate: boolean = false,
  ): Promise<ResultObject> {
    const api = this;
    const genericError: ResultObject = {
      result: APIConstants.global.SCORM_FALSE,
      errorCode: this.error_codes.GENERAL,
    };

    // if we are terminating the module or closing the browser window/tab, we need to make this fetch ASAP.
    // Some browsers, especially Chrome, do not like synchronous requests to be made when the window is closing.
    if (immediate) {
      this.performFetch(url, params).then(async (response) => {
        await this.transformResponse(response);
      });
      return {
        result: APIConstants.global.SCORM_TRUE,
        errorCode: 0,
      };
    }

    const process = async (
      url: string,
      params: RefObject | Array<any>,
      settings: Settings,
    ): Promise<ResultObject> => {
      try {
        params = settings.requestHandler(params);
        const response = await this.performFetch(url, params);

        return this.transformResponse(response);
      } catch (e) {
        this.apiLog(
          "processHttpRequest",
          e,
          APIConstants.global.LOG_LEVEL_ERROR,
        );
        api.processListeners("CommitError");
        return genericError;
      }
    };

    if (this.settings.asyncCommit) {
      const debouncedProcess = debounce(process, 500, immediate);
      debouncedProcess(url, params, this.settings);

      return {
        result: APIConstants.global.SCORM_TRUE,
        errorCode: 0,
      };
    } else {
      return await process(url, params, this.settings);
    }
  }

  /**
   * Throws a SCORM error
   *
   * @param {number} when - the number of milliseconds to wait before committing
   * @param {string} callback - the name of the commit event callback
   */
  scheduleCommit(when: number, callback: string) {
    this._timeout = new ScheduledCommit(this, when, callback);
    this.apiLog(
      "scheduleCommit",
      "scheduled",
      APIConstants.global.LOG_LEVEL_DEBUG,
      "",
    );
  }

  /**
   * Clears and cancels any currently scheduled commits
   */
  clearScheduledCommit() {
    if (this._timeout) {
      this._timeout.cancel();
      this._timeout = undefined;
      this.apiLog(
        "clearScheduledCommit",
        "cleared",
        APIConstants.global.LOG_LEVEL_DEBUG,
        "",
      );
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
      returnValue = APIConstants.global.SCORM_FALSE;
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
   * Perform the fetch request to the LMS
   * @param {string} url
   * @param {RefObject|Array} params
   * @return {Promise<Response>}
   * @private
   */
  private async performFetch(
    url: string,
    params: RefObject | Array<any>,
  ): Promise<Response> {
    return fetch(url, {
      method: "POST",
      body: params instanceof Array ? params.join("&") : JSON.stringify(params),
      headers: {
        ...this.settings.xhrHeaders,
        "Content-Type": this.settings.commitRequestDataType,
      },
      credentials: this.settings.xhrWithCredentials ? "include" : undefined,
      keepalive: true,
    });
  }

  /**
   * Transforms the response from the LMS to a ResultObject
   * @param {Response} response
   * @return {Promise<ResultObject>}
   * @private
   */
  private async transformResponse(response: Response): Promise<ResultObject> {
    const result =
      typeof this.settings.responseHandler === "function"
        ? await this.settings.responseHandler(response)
        : await response.json();

    if (
      response.status >= 200 &&
      response.status <= 299 &&
      (result.result === true ||
        result.result === APIConstants.global.SCORM_TRUE)
    ) {
      this.processListeners("CommitSuccess");
    } else {
      this.processListeners("CommitError");
    }
    return result;
  }
}