import { ErrorCode } from "../constants/error_codes";
import { global_constants } from "../constants/api_constants";
import { StringKeyMap, stringMatches } from "../utilities";
import { LogLevel } from "../types/api_types";
import { LogLevelEnum } from "../constants/enums";
import { ICMIDataService, IErrorHandlingService } from "../interfaces/services";
import { isCMIArray } from "../utils/type_guards";

/**
 * Service for accessing and manipulating CMI data
 */
export class CMIDataService implements ICMIDataService {
  private _error_codes: ErrorCode;
  private readonly _apiLog: (
    functionName: string,
    message: string,
    logLevel?: LogLevel,
    CMIElement?: string,
  ) => void;
  private readonly _throwSCORMError: (
    errorNumber: number,
    message?: string,
  ) => void;
  private readonly _validateCorrectResponse: (
    CMIElement: string,
    value: any,
  ) => void;
  private readonly _getChildElement: (
    CMIElement: string,
    value: any,
    foundFirstIndex: boolean,
  ) => any;
  private readonly _checkObjectHasProperty: (
    refObject: StringKeyMap,
    attribute: string,
  ) => boolean;
  private readonly _errorHandlingService: IErrorHandlingService;

  /**
   * Constructor for CMIDataService
   *
   * @param {ErrorCode} error_codes - Error codes
   * @param {Function} apiLog - Function for logging API calls
   * @param {Function} throwSCORMError - Function for throwing SCORM errors
   * @param {Function} validateCorrectResponse - Function for validating correct responses
   * @param {Function} getChildElement - Function for getting child elements
   * @param {Function} checkObjectHasProperty - Function for checking if an object has a property
   * @param {IErrorHandlingService} errorHandlingService - The error handling service
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
      refObject: StringKeyMap,
      attribute: string,
    ) => boolean,
    errorHandlingService: IErrorHandlingService,
  ) {
    this._error_codes = error_codes;
    this._apiLog = apiLog;
    this._throwSCORMError = throwSCORMError;
    this._validateCorrectResponse = validateCorrectResponse;
    this._getChildElement = getChildElement;
    this._checkObjectHasProperty = checkObjectHasProperty;
    this._errorHandlingService = errorHandlingService;
  }

  /**
   * Updates the last error code
   *
   * @param {string} errorCode - The error code
   */
  updateLastErrorCode(errorCode: string): void {
    this._errorHandlingService.lastErrorCode = errorCode;
  }

  /**
   * Throws a SCORM error and updates the last error code
   *
   * @param {number} errorNumber - The error number
   * @param {string} message - The error message
   */
  throwSCORMError(errorNumber: number, message?: string): void {
    this._throwSCORMError(errorNumber, message);
  }

  /**
   * Shared API method to set a value for a given CMI element.
   *
   * This method implements the core algorithm for navigating the CMI data model
   * and setting values at the specified path. It handles complex scenarios including:
   *
   * 1. Dot notation traversal: Parses the CMIElement string (e.g., "cmi.core.student_id")
   *    and traverses the nested CMI object structure accordingly.
   *
   * 2. Array handling: Detects array elements (e.g., "cmi.objectives.0.id") and
   *    either accesses existing array items or creates new ones as needed.
   *
   * 3. SCORM 2004 specific features: Handles special syntax like {target=} for
   *    interaction targets.
   *
   * 4. Validation: Performs validation for specific elements like correct_responses
   *    to ensure data integrity.
   *
   * 5. Error handling: Validates that the CMI path exists and is writable,
   *    throwing appropriate SCORM errors when issues are encountered.
   *
   * @param {StringKeyMap} cmi - The CMI object to modify
   * @param {string} methodName - The method name (for error reporting)
   * @param {boolean} scorm2004 - Whether this is SCORM 2004 (affects error codes and behavior)
   * @param {string} CMIElement - The dot-notation path to the CMI element to set
   * @param {any} value - The value to set at the specified path
   * @param {boolean} isInitialized - Whether the API is initialized (affects write permissions)
   * @return {string} "true" if successful, "false" if an error occurred
   */
  setCMIValue(
    cmi: StringKeyMap,
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
    let refObject: StringKeyMap = cmi;
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

          if (!scorm2004 || this._errorHandlingService.lastErrorCode === "0") {
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

        if (isCMIArray(refObject)) {
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
   * Gets a value from the CMI Object at the specified path.
   *
   * This method implements the core algorithm for navigating the CMI data model
   * and retrieving values from the specified path. It handles complex scenarios including:
   *
   * 1. Dot notation traversal: Parses the CMIElement string (e.g., "cmi.core.student_id")
   *    and traverses the nested CMI object structure accordingly.
   *
   * 2. Array handling: Detects array elements (e.g., "cmi.objectives.0.id") and
   *    accesses the appropriate array item, throwing errors if the index doesn't exist.
   *
   * 3. SCORM version differences: Implements different error handling and validation
   *    logic for SCORM 1.2 vs SCORM 2004.
   *
   * 4. Special attributes: Handles special cases like _children and _count attributes
   *    in SCORM 1.2, which provide metadata about the CMI structure.
   *
   * 5. SCORM 2004 target validation: Processes special {target=} syntax for
   *    interaction targets and validates them using the _isTargetValid method.
   *
   * 6. Error handling: Validates that the CMI path exists and is readable,
   *    throwing appropriate SCORM errors when issues are encountered.
   *
   * @param {StringKeyMap} cmi - The CMI object to read from
   * @param {string} methodName - The method name (for error reporting)
   * @param {boolean} scorm2004 - Whether this is SCORM 2004 (affects error codes and behavior)
   * @param {string} CMIElement - The dot-notation path to the CMI element to retrieve
   * @return {any} The value at the specified path, or undefined if an error occurred
   */
  getCMIValue(
    cmi: StringKeyMap,
    methodName: string,
    scorm2004: boolean,
    CMIElement: string,
  ): any {
    if (!CMIElement || CMIElement === "") {
      return "";
    }

    const structure = CMIElement.split(".");
    let refObject: StringKeyMap = cmi;
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

      if (isCMIArray(refObject)) {
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
