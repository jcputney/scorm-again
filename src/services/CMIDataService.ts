import { CMIArray } from "../cmi/common/array";
import { ErrorCode } from "../constants/error_codes";
import { global_constants } from "../constants/api_constants";
import { stringMatches } from "../utilities";
import { LogLevel, RefObject } from "../types/api_types";
import { LogLevelEnum } from "../constants/enums";

/**
 * Service for accessing and manipulating CMI data
 */
export class CMIDataService {
  private _error_codes: ErrorCode;
  private _apiLog: (
    functionName: string,
    message: string,
    logLevel?: LogLevel,
    CMIElement?: string,
  ) => void;
  private _throwSCORMError: (errorNumber: number, message?: string) => void;
  private _validateCorrectResponse: (CMIElement: string, value: any) => void;
  private _getChildElement: (
    CMIElement: string,
    value: any,
    foundFirstIndex: boolean,
  ) => any;
  private _checkObjectHasProperty: (
    refObject: RefObject,
    attribute: string,
  ) => boolean;
  private _lastErrorCode: string;

  /**
   * Constructor for CMIDataService
   *
   * @param {ErrorCode} error_codes - Error codes
   * @param {Function} apiLog - Function for logging API calls
   * @param {Function} throwSCORMError - Function for throwing SCORM errors
   * @param {Function} validateCorrectResponse - Function for validating correct responses
   * @param {Function} getChildElement - Function for getting child elements
   * @param {Function} checkObjectHasProperty - Function for checking if an object has a property
   * @param {string} lastErrorCode - The last error code
   */
  constructor(
    error_codes: ErrorCode,
    apiLog: (
      functionName: string,
      message: string,
      logLevel?: LogLevel,
      CMIElement?: string,
    ) => void,
    throwSCORMError: (errorNumber: number, message?: string) => void,
    validateCorrectResponse: (CMIElement: string, value: any) => void,
    getChildElement: (
      CMIElement: string,
      value: any,
      foundFirstIndex: boolean,
    ) => any,
    checkObjectHasProperty: (
      refObject: RefObject,
      attribute: string,
    ) => boolean,
    lastErrorCode: string = "0",
  ) {
    this._error_codes = error_codes;
    this._apiLog = apiLog;
    this._throwSCORMError = throwSCORMError;
    this._validateCorrectResponse = validateCorrectResponse;
    this._getChildElement = getChildElement;
    this._checkObjectHasProperty = checkObjectHasProperty;
    this._lastErrorCode = lastErrorCode;
  }

  /**
   * Updates the last error code
   *
   * @param {string} errorCode - The error code
   */
  updateLastErrorCode(errorCode: string): void {
    this._lastErrorCode = errorCode;
  }

  /**
   * Throws a SCORM error and updates the last error code
   *
   * @param {number} errorNumber - The error number
   * @param {string} message - The error message
   */
  throwSCORMError(errorNumber: number, message?: string): void {
    this.updateLastErrorCode(String(errorNumber));
    this._throwSCORMError(errorNumber, message);
  }

  /**
   * Shared API method to set a valid for a given element.
   *
   * @param {RefObject} cmi - The CMI object
   * @param {string} methodName - The method name
   * @param {boolean} scorm2004 - Whether this is SCORM 2004
   * @param {string} CMIElement - The CMI element
   * @param {any} value - The value to set
   * @param {boolean} isInitialized - Whether the API is initialized
   * @return {string}
   */
  setCMIValue(
    cmi: RefObject,
    methodName: string,
    scorm2004: boolean,
    CMIElement: string,
    value: any,
    isInitialized: boolean,
  ): string {
    if (!CMIElement || CMIElement === "") {
      return global_constants.SCORM_FALSE;
    }

    const structure = CMIElement.split(".");
    let refObject: RefObject = cmi;
    let returnValue = global_constants.SCORM_FALSE;
    let foundFirstIndex = false;

    const invalidErrorMessage = `The data model element passed to ${methodName} (${CMIElement}) is not a valid SCORM data model element.`;
    const invalidErrorCode = scorm2004
      ? this._error_codes.UNDEFINED_DATA_MODEL
      : this._error_codes.GENERAL;

    for (let idx = 0; idx < structure.length; idx++) {
      const attribute = structure[idx];

      if (idx === structure.length - 1) {
        if (scorm2004 && attribute.substring(0, 8) === "{target=") {
          if (isInitialized) {
            this.throwSCORMError(this._error_codes.READ_ONLY_ELEMENT);
          } else {
            refObject = {
              ...refObject,
              attribute: value,
            };
          }
        } else if (!this._checkObjectHasProperty(refObject, attribute)) {
          this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
        } else {
          if (
            stringMatches(CMIElement, "\\.correct_responses\\.\\d+") &&
            isInitialized
          ) {
            this._validateCorrectResponse(CMIElement, value);
          }

          if (!scorm2004 || this._lastErrorCode === "0") {
            refObject[attribute] = value;
            returnValue = global_constants.SCORM_TRUE;
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
              const newChild = this._getChildElement(
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

    if (returnValue === global_constants.SCORM_FALSE) {
      this._apiLog(
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
   * @param {RefObject} cmi - The CMI object
   * @param {string} methodName - The method name
   * @param {boolean} scorm2004 - Whether this is SCORM 2004
   * @param {string} CMIElement - The CMI element
   * @return {any}
   */
  getCMIValue(
    cmi: RefObject,
    methodName: string,
    scorm2004: boolean,
    CMIElement: string,
  ): any {
    if (!CMIElement || CMIElement === "") {
      return "";
    }

    const structure = CMIElement.split(".");
    let refObject: RefObject = cmi;
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
          this.throwSCORMError(this._error_codes.CHILDREN_ERROR);
        } else if (attribute === "_count") {
          this.throwSCORMError(this._error_codes.COUNT_ERROR);
        }
      }
    } else {
      return refObject;
    }
  }
}
