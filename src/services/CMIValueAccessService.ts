import { BaseCMI } from "../cmi/common/base_cmi";
import { CMIArray } from "../cmi/common/array";
import { global_constants, LogLevelEnum } from "../constants";
import { StringKeyMap, stringMatches } from "../utilities";
import { ErrorCode } from "../constants/error_codes";

/** Prefix for SCORM 2004 target attribute syntax */
const TARGET_ATTRIBUTE_PREFIX = "{target=";

/**
 * Helper function to safely get an error code with validation.
 * Returns the error code value, or falls back to GENERAL error code if key is missing.
 * Logs a warning for unknown keys to help catch typos during development.
 */
function getErrorCode(errorCodes: ErrorCode, key: string): number {
  const code = errorCodes[key];
  if (code === undefined) {
    // Log warning in development to catch typos in error code keys
    if (typeof console !== "undefined" && console.warn) {
      console.warn(`CMIValueAccessService: Unknown error code key: ${key}`);
    }
    return errorCodes["GENERAL"] ?? 0;
  }
  return code;
}

/**
 * Context interface for CMI value access operations.
 *
 * Provides callbacks to the API for error handling, validation, and data model access.
 * All callbacks are invoked synchronously during CMI path traversal.
 * Error states should be communicated through the API's error handling mechanism
 * (throwSCORMError and setLastErrorCode).
 *
 * @remarks
 * This interface enables dependency injection, making the CMIValueAccessService
 * testable in isolation without requiring a full API instance.
 */
export interface CMIValueAccessContext {
  /** Error codes for the API (SCORM 1.2 or 2004) */
  readonly errorCodes: ErrorCode;

  /** Get the last error code as a string */
  getLastErrorCode: () => string;

  /** Set the last error code */
  setLastErrorCode: (errorCode: string) => void;

  /** Throw a SCORM error - sets error code and optionally logs diagnostic info */
  throwSCORMError: (element: string, errorCode: number, message?: string) => void;

  /** Check if the API is initialized (LMSInitialize/Initialize called) */
  isInitialized: () => boolean;

  /** Validate a correct response value for SCORM 2004 interactions */
  validateCorrectResponse: (CMIElement: string, value: string) => void;

  /** Check for duplicate ID in objectives/interactions arrays */
  checkForDuplicateId: (CMIElement: string, value: string) => boolean;

  /** Get or create a child element for array operations */
  getChildElement: (CMIElement: string, value: string, foundFirstIndex: boolean) => BaseCMI | null;

  /** Log an API message at the specified level */
  apiLog: (methodName: string, message: string, level: LogLevelEnum) => void;

  /** Check if an object has a property (safe prototype-aware check) */
  checkObjectHasProperty: (obj: StringKeyMap, attr: string) => boolean;

  /** Get the CMI/ADL data model root object */
  getDataModel: () => StringKeyMap;
}

/**
 * CMIValueAccessService
 *
 * Handles the complex traversal logic for getting and setting CMI values.
 * Extracted from BaseAPI to reduce god class complexity.
 *
 * Responsibilities:
 * - Navigate CMI element paths (e.g., "cmi.objectives.0.id")
 * - Handle array indexing and dynamic child creation
 * - Validate element paths and handle errors
 * - Support both SCORM 1.2 and SCORM 2004 data models
 */
export class CMIValueAccessService {
  private context: CMIValueAccessContext;

  constructor(context: CMIValueAccessContext) {
    this.context = context;
  }

  /**
   * Gets the appropriate error code for undefined data model elements.
   * SCORM 2004 uses UNDEFINED_DATA_MODEL, SCORM 1.2 uses GENERAL.
   */
  private getUndefinedDataModelErrorCode(scorm2004: boolean): number {
    return scorm2004
      ? getErrorCode(this.context.errorCodes, "UNDEFINED_DATA_MODEL")
      : getErrorCode(this.context.errorCodes, "GENERAL");
  }

  /**
   * Sets a value on a CMI element path
   *
   * @param {string} methodName - The API method name for logging
   * @param {boolean} scorm2004 - Whether this is SCORM 2004
   * @param {string} CMIElement - The CMI element path
   * @param {string} value - The value to set (all SCORM values are strings)
   * @return {string} "true" or "false"
   */
  setCMIValue(methodName: string, scorm2004: boolean, CMIElement: string, value: string): string {
    if (!CMIElement || CMIElement === "") {
      if (scorm2004) {
        this.context.throwSCORMError(
          CMIElement,
          getErrorCode(this.context.errorCodes, "GENERAL_SET_FAILURE"),
          "The data model element was not specified",
        );
      }
      return global_constants.SCORM_FALSE;
    }

    this.context.setLastErrorCode("0");

    const structure = CMIElement.split(".");
    let refObject: StringKeyMap | BaseCMI = this.context.getDataModel();
    let returnValue = global_constants.SCORM_FALSE;
    let foundFirstIndex = false;

    const invalidErrorMessage = `The data model element passed to ${methodName} (${CMIElement}) is not a valid SCORM data model element.`;
    const invalidErrorCode = this.getUndefinedDataModelErrorCode(scorm2004);

    for (let idx = 0; idx < structure.length; idx++) {
      const attribute = structure[idx]!;

      if (idx === structure.length - 1) {
        // Final attribute - set the value
        returnValue = this.setFinalAttribute(
          refObject,
          attribute,
          value,
          CMIElement,
          scorm2004,
          invalidErrorCode,
          invalidErrorMessage,
        );
        break;
      } else {
        // Intermediate attribute - traverse
        const traverseResult = this.traverseToNextLevel(
          refObject,
          structure,
          idx,
          value,
          CMIElement,
          scorm2004,
          foundFirstIndex,
          invalidErrorCode,
          invalidErrorMessage,
        );

        if (traverseResult.error) {
          break;
        }

        refObject = traverseResult.refObject;
        idx = traverseResult.idx;
        foundFirstIndex = traverseResult.foundFirstIndex;
      }
    }

    if (returnValue === global_constants.SCORM_FALSE) {
      this.context.apiLog(
        methodName,
        `There was an error setting the value for: ${CMIElement}, value of: ${value}`,
        LogLevelEnum.WARN,
      );
    }

    return returnValue;
  }

  /**
   * Gets a value from a CMI element path
   *
   * @param {string} methodName - The API method name for logging
   * @param {boolean} scorm2004 - Whether this is SCORM 2004
   * @param {string} CMIElement - The CMI element path
   * @return The value at the element path, or empty string on error (per SCORM spec)
   */
  getCMIValue(
    methodName: string,
    scorm2004: boolean,
    CMIElement: string,
  ): string | StringKeyMap | BaseCMI {
    if (!CMIElement || CMIElement === "") {
      if (scorm2004) {
        this.context.throwSCORMError(
          CMIElement,
          getErrorCode(this.context.errorCodes, "GENERAL_GET_FAILURE"),
          "The data model element was not specified",
        );
      }
      return "";
    }

    // SCORM 2004: Validate ._version keyword usage - only valid on cmi._version
    if (scorm2004 && CMIElement.endsWith("._version") && CMIElement !== "cmi._version") {
      this.context.throwSCORMError(
        CMIElement,
        getErrorCode(this.context.errorCodes, "GENERAL_GET_FAILURE"),
        "The _version keyword was used incorrectly",
      );
      return "";
    }

    const structure = CMIElement.split(".");
    let refObject: StringKeyMap = this.context.getDataModel();
    let attribute: string | null = null;

    const uninitializedErrorMessage = `The data model element passed to ${methodName} (${CMIElement}) has not been initialized.`;
    const invalidErrorMessage = `The data model element passed to ${methodName} (${CMIElement}) is not a valid SCORM data model element.`;
    const invalidErrorCode = this.getUndefinedDataModelErrorCode(scorm2004);

    for (let idx = 0; idx < structure.length; idx++) {
      attribute = structure[idx]!;

      // Validate attribute existence
      const validationResult = this.validateGetAttribute(
        refObject,
        attribute,
        CMIElement,
        scorm2004,
        invalidErrorCode,
        invalidErrorMessage,
        idx === structure.length - 1,
      );

      if (validationResult.returnValue !== undefined) {
        return validationResult.returnValue;
      }

      if (validationResult.error) {
        return "";
      }

      // Traverse to the next level
      if (attribute !== undefined && attribute !== null) {
        refObject = refObject[attribute] as StringKeyMap;
        if (refObject === undefined) {
          this.context.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
          break;
        }
      } else {
        this.context.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
        break;
      }

      // Handle array access
      if (refObject instanceof CMIArray) {
        const arrayResult = this.handleGetArrayAccess(
          refObject,
          structure,
          idx,
          CMIElement,
          uninitializedErrorMessage,
        );

        if (arrayResult.error) {
          return "";
        }

        refObject = arrayResult.refObject;
        idx = arrayResult.idx;
      }
    }

    if (refObject === null || refObject === undefined) {
      if (!scorm2004) {
        // SCORM 1.2: Use specific keyword error codes
        if (attribute === "_children") {
          this.context.throwSCORMError(
            CMIElement,
            getErrorCode(this.context.errorCodes, "CHILDREN_ERROR"),
            undefined,
          );
        } else if (attribute === "_count") {
          this.context.throwSCORMError(
            CMIElement,
            getErrorCode(this.context.errorCodes, "COUNT_ERROR"),
            undefined,
          );
        }
      }
      // SCORM 2004 keyword errors are handled during traversal
      return "";
    }

    return refObject;
  }

  /**
   * Sets the final attribute value in the CMI path
   */
  private setFinalAttribute(
    refObject: StringKeyMap | BaseCMI,
    attribute: string,
    value: string,
    CMIElement: string,
    scorm2004: boolean,
    invalidErrorCode: number,
    invalidErrorMessage: string,
  ): string {
    // Handle SCORM 2004 target attribute syntax: {target=identifier}
    // Target attributes are used for global objective mapping and are read-only after initialization
    if (scorm2004 && attribute?.startsWith(TARGET_ATTRIBUTE_PREFIX)) {
      if (this.context.isInitialized()) {
        this.context.throwSCORMError(
          CMIElement,
          getErrorCode(this.context.errorCodes, "READ_ONLY_ELEMENT"),
        );
        return global_constants.SCORM_FALSE;
      }
      // Before initialization, target writes are allowed but no-op (targets are resolved during read)
      return global_constants.SCORM_TRUE;
    }

    // Validate attribute exists
    if (
      typeof attribute === "undefined" ||
      !this.context.checkObjectHasProperty(refObject as StringKeyMap, attribute)
    ) {
      this.context.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
      return global_constants.SCORM_FALSE;
    }

    // Validate correct response
    if (
      stringMatches(CMIElement, "\\.correct_responses\\.\\d+$") &&
      this.context.isInitialized() &&
      attribute !== "pattern"
    ) {
      this.context.validateCorrectResponse(CMIElement, value);
      if (this.context.getLastErrorCode() !== "0") {
        this.context.throwSCORMError(
          CMIElement,
          getErrorCode(this.context.errorCodes, "TYPE_MISMATCH"),
        );
        return global_constants.SCORM_FALSE;
      }
    }

    // Check for errors before setting
    if (!scorm2004 || this.context.getLastErrorCode() === "0") {
      // Validate attribute is safe
      if (
        typeof attribute === "undefined" ||
        attribute === "__proto__" ||
        attribute === "constructor"
      ) {
        this.context.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
        return global_constants.SCORM_FALSE;
      }

      // SCORM 2004: Check for duplicate IDs in objectives and interactions arrays
      if (scorm2004 && attribute === "id" && this.context.isInitialized()) {
        const duplicateError = this.context.checkForDuplicateId(CMIElement, value);
        if (duplicateError) {
          this.context.throwSCORMError(
            CMIElement,
            getErrorCode(this.context.errorCodes, "GENERAL_SET_FAILURE"),
          );
          return global_constants.SCORM_FALSE;
        }
      }

      // Set the value
      (refObject as StringKeyMap)[attribute] = value;
      return global_constants.SCORM_TRUE;
    }

    return global_constants.SCORM_FALSE;
  }

  /**
   * Traverses to the next level in the CMI path
   */
  private traverseToNextLevel(
    refObject: StringKeyMap | BaseCMI,
    structure: string[],
    idx: number,
    value: string,
    CMIElement: string,
    scorm2004: boolean,
    foundFirstIndex: boolean,
    invalidErrorCode: number,
    invalidErrorMessage: string,
  ): { refObject: StringKeyMap | BaseCMI; idx: number; foundFirstIndex: boolean; error: boolean } {
    const attribute = structure[idx];

    if (
      typeof attribute === "undefined" ||
      !this.context.checkObjectHasProperty(refObject as StringKeyMap, attribute)
    ) {
      this.context.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
      return { refObject, idx, foundFirstIndex, error: true };
    }

    refObject = (refObject as StringKeyMap)[attribute] as StringKeyMap;
    if (!refObject) {
      this.context.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
      return { refObject, idx, foundFirstIndex, error: true };
    }

    // Handle array access
    if (refObject instanceof CMIArray) {
      const arrayResult = this.handleSetArrayAccess(
        refObject,
        structure,
        idx,
        value,
        CMIElement,
        scorm2004,
        foundFirstIndex,
        invalidErrorCode,
        invalidErrorMessage,
      );

      if (arrayResult.error) {
        return { refObject, idx, foundFirstIndex, error: true };
      }

      return arrayResult;
    }

    return { refObject, idx, foundFirstIndex, error: false };
  }

  /**
   * Handles array access during set operations
   */
  private handleSetArrayAccess(
    refObject: CMIArray,
    structure: string[],
    idx: number,
    value: string,
    CMIElement: string,
    scorm2004: boolean,
    foundFirstIndex: boolean,
    invalidErrorCode: number,
    invalidErrorMessage: string,
  ): { refObject: StringKeyMap | BaseCMI; idx: number; foundFirstIndex: boolean; error: boolean } {
    const index = parseInt(structure[idx + 1] || "0", 10);

    if (!isNaN(index)) {
      const item = refObject.childArray[index];

      if (item) {
        return {
          refObject: item,
          idx: idx + 1,
          foundFirstIndex: true,
          error: false,
        };
      } else {
        // SCORM spec requires sequential array indices
        if (index > refObject.childArray.length) {
          const errorCode = scorm2004
            ? getErrorCode(this.context.errorCodes, "GENERAL_SET_FAILURE")
            : getErrorCode(this.context.errorCodes, "INVALID_SET_VALUE") ||
              getErrorCode(this.context.errorCodes, "GENERAL_SET_FAILURE");
          this.context.throwSCORMError(
            CMIElement,
            errorCode,
            `Cannot set array element at index ${index}. Array indices must be sequential. Current array length is ${refObject.childArray.length}, expected index ${refObject.childArray.length}.`,
          );
          return { refObject, idx, foundFirstIndex, error: true };
        }

        // Create new child element
        const newChild = this.context.getChildElement(CMIElement, value, foundFirstIndex);

        if (!newChild) {
          if (this.context.getLastErrorCode() === "0") {
            this.context.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
          }
          return { refObject, idx, foundFirstIndex, error: true };
        } else {
          if (refObject.initialized) newChild.initialize();
          refObject.childArray[index] = newChild;
          return {
            refObject: newChild,
            idx: idx + 1,
            foundFirstIndex: true,
            error: false,
          };
        }
      }
    }

    return { refObject, idx, foundFirstIndex, error: false };
  }

  /**
   * Validates an attribute during get operations
   */
  private validateGetAttribute(
    refObject: StringKeyMap,
    attribute: string,
    CMIElement: string,
    scorm2004: boolean,
    invalidErrorCode: number,
    invalidErrorMessage: string,
    isFinalAttribute: boolean,
  ): { error: boolean; returnValue?: any } {
    if (!scorm2004) {
      if (isFinalAttribute) {
        if (
          typeof attribute === "undefined" ||
          !this.context.checkObjectHasProperty(refObject, attribute)
        ) {
          this.context.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
          return { error: true };
        }
      }
    } else {
      // Handle SCORM 2004 target validation
      const attrStr = String(attribute);
      if (
        attrStr.startsWith(TARGET_ATTRIBUTE_PREFIX) &&
        typeof refObject._isTargetValid == "function"
      ) {
        const target = attrStr.substring(TARGET_ATTRIBUTE_PREFIX.length, attrStr.length - 1);
        return { error: false, returnValue: refObject._isTargetValid(target) };
      } else if (
        typeof attribute === "undefined" ||
        !this.context.checkObjectHasProperty(refObject, attribute)
      ) {
        // Check for keyword errors with specific diagnostics
        if (attribute === "_children") {
          this.context.throwSCORMError(
            CMIElement,
            getErrorCode(this.context.errorCodes, "GENERAL_GET_FAILURE"),
            "The data model element does not have children",
          );
          return { error: true };
        } else if (attribute === "_count") {
          this.context.throwSCORMError(
            CMIElement,
            getErrorCode(this.context.errorCodes, "GENERAL_GET_FAILURE"),
            "The data model element is not a collection and therefore does not have a count",
          );
          return { error: true };
        }
        this.context.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
        return { error: true };
      }
    }

    return { error: false };
  }

  /**
   * Handles array access during get operations
   */
  private handleGetArrayAccess(
    refObject: CMIArray,
    structure: string[],
    idx: number,
    CMIElement: string,
    uninitializedErrorMessage: string,
  ): { refObject: StringKeyMap; idx: number; error: boolean } {
    const index = parseInt(structure[idx + 1] || "", 10);

    if (!isNaN(index)) {
      const item = refObject.childArray[index];

      if (item) {
        return {
          refObject: item as unknown as StringKeyMap,
          idx: idx + 1,
          error: false,
        };
      } else {
        this.context.throwSCORMError(
          CMIElement,
          getErrorCode(this.context.errorCodes, "VALUE_NOT_INITIALIZED"),
          uninitializedErrorMessage,
        );
        return { refObject: refObject as unknown as StringKeyMap, idx, error: true };
      }
    }

    return { refObject: refObject as unknown as StringKeyMap, idx, error: false };
  }
}
