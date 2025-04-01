/**
 * This file contains interfaces for all services used in the SCORM Again project.
 * These interfaces are used for dependency injection to improve testability.
 */

import {
  CommitObject,
  LogLevel,
  RefValue,
  ResultObject,
  Settings,
} from "../types/api_types";
import { ErrorCode } from "../constants/error_codes";
import { LogLevelEnum } from "../constants/enums";
import { BaseCMI } from "../cmi/common/base_cmi";
import { ValidationError } from "../exceptions";
import { StringKeyMap } from "../utilities";

/**
 * Interface for HTTP service
 */
export interface IHttpService {
  /**
   * Send the request to the LMS
   * @param {string} url - The URL to send the request to
   * @param {CommitObject|StringKeyMap|Array} params - The parameters to include in the request
   * @param {boolean} immediate - Whether to send the request immediately
   * @param {Function} apiLog - Function to log API messages
   * @param {Function} processListeners - Function to process event listeners
   * @return {ResultObject} - The result of the request
   */
  processHttpRequest(
    url: string,
    params: CommitObject | StringKeyMap | Array<any>,
    immediate: boolean,
    apiLog: (
      functionName: string,
      message: any,
      messageLevel: LogLevelEnum,
      CMIElement?: string,
    ) => void,
    processListeners: (
      functionName: string,
      CMIElement?: string,
      value?: any,
    ) => void,
  ): Promise<ResultObject>;

  /**
   * Updates the service settings
   * @param {Settings} settings - The new settings
   */
  updateSettings(settings: Settings): void;
}

/**
 * Interface for Event service
 */
export interface IEventService {
  /**
   * Provides a mechanism for attaching to a specific SCORM event
   *
   * @param {string} listenerName - The name of the listener
   * @param {Function} callback - The callback function to execute when the event occurs
   */
  on(listenerName: string, callback: Function): void;

  /**
   * Provides a mechanism for detaching a specific SCORM event listener
   *
   * @param {string} listenerName - The name of the listener to remove
   * @param {Function} callback - The callback function to remove
   */
  off(listenerName: string, callback: Function): void;

  /**
   * Provides a mechanism for clearing all listeners from a specific SCORM event
   *
   * @param {string} listenerName - The name of the listener to clear
   */
  clear(listenerName: string): void;

  /**
   * Processes any 'on' listeners that have been created
   *
   * @param {string} functionName - The name of the function that triggered the event
   * @param {string} CMIElement - The CMI element that was affected
   * @param {any} value - The value that was set
   */
  processListeners(
    functionName: string,
    CMIElement?: string,
    value?: any,
  ): void;

  /**
   * Resets the event service by clearing all listeners
   */
  reset(): void;
}

/**
 * Interface for Serialization service
 */
export interface ISerializationService {
  /**
   * Loads data from a flattened JSON object
   *
   * @param {object} json - The flattened JSON object
   * @param {string} CMIElement - The CMI element to load data into
   * @param {Function} loadFromJSON - Function to load from JSON
   * @param {Function} setCMIValue - Function to set CMI values
   * @param {Function} isNotInitialized - Function to check if not initialized
   */
  loadFromFlattenedJSON(
    json: object,
    CMIElement: string,
    loadFromJSON: (json: object, CMIElement: string) => void,
    setCMIValue: (CMIElement: string, value: any) => void,
    isNotInitialized: () => boolean,
  ): void;

  /**
   * Loads data from a JSON object
   *
   * @param {StringKeyMap|RefValue} json - The JSON object
   * @param {string} CMIElement - The CMI element to load data into
   * @param {Function} setCMIValue - Function to set CMI values
   * @param {Function} isNotInitialized - Function to check if not initialized
   * @param {Function} setStartingData - Function to set starting data
   */
  loadFromJSON(
    json: object,
    CMIElement: string,
    setCMIValue: (CMIElement: string, value: any) => void,
    isNotInitialized: () => boolean,
    setStartingData: (data: StringKeyMap) => void,
  ): void;

  /**
   * Renders CMI data to a JSON string
   *
   * @param {BaseCMI|StringKeyMap} cmi - The CMI object
   * @param {boolean} sendFullCommit - Whether to send the full commit
   * @return {string} - The JSON string
   */
  renderCMIToJSONString(
    cmi: BaseCMI | StringKeyMap,
    sendFullCommit: boolean,
  ): string;

  /**
   * Renders CMI data to a JSON object
   *
   * @param {BaseCMI|StringKeyMap} cmi - The CMI object
   * @param {boolean} sendFullCommit - Whether to send the full commit
   * @return {object} - The JSON object
   */
  renderCMIToJSONObject(
    cmi: BaseCMI | StringKeyMap,
    sendFullCommit: boolean,
  ): StringKeyMap;

  /**
   * Gets a commit object for sending to the LMS
   *
   * @param {boolean} terminateCommit - Whether this is a termination commit
   * @param {boolean} alwaysSendTotalTime - Whether to always send total time
   * @param {Function|boolean} renderCommonCommitFields - Function to render common commit fields
   * @param {Function} renderCommitObject - Function to render the commit object
   * @param {Function} renderCommitCMI - Function to render the commit CMI
   * @param {LogLevel} apiLogLevel - The API log level
   * @return {CommitObject|StringKeyMap|Array<any>} - The commit object
   */
  getCommitObject(
    terminateCommit: boolean,
    alwaysSendTotalTime: boolean,
    renderCommonCommitFields:
      | boolean
      | ((commitObject: CommitObject) => boolean),
    renderCommitObject: (terminateCommit: boolean) => CommitObject,
    renderCommitCMI: (terminateCommit: boolean) => StringKeyMap | Array<any>,
    apiLogLevel: LogLevel,
  ): CommitObject | StringKeyMap | Array<any>;
}

/**
 * Interface for CMI Data service
 */
export interface ICMIDataService {
  /**
   * Updates the last error code
   *
   * @param {string} errorCode - The error code to set
   */
  updateLastErrorCode(errorCode: string): void;

  /**
   * Throws a SCORM error
   *
   * @param {number} errorNumber - The error number
   * @param {string} message - The error message
   */
  throwSCORMError(errorNumber: number, message?: string): void;

  /**
   * Sets a CMI value
   *
   * @param {StringKeyMap} cmi - The CMI object
   * @param {string} methodName - The method name
   * @param {boolean} scorm2004 - Whether this is SCORM 2004
   * @param {string} CMIElement - The CMI element
   * @param {any} value - The value to set
   * @param {boolean} isInitialized - Whether the API is initialized
   * @return {string} - The result of the operation
   */
  setCMIValue(
    cmi: StringKeyMap,
    methodName: string,
    scorm2004: boolean,
    CMIElement: string,
    value: any,
    isInitialized: boolean,
  ): string;

  /**
   * Gets a CMI value
   *
   * @param {StringKeyMap} cmi - The CMI object
   * @param {string} methodName - The method name
   * @param {boolean} scorm2004 - Whether this is SCORM 2004
   * @param {string} CMIElement - The CMI element
   * @return {string} - The CMI value
   */
  getCMIValue(
    cmi: StringKeyMap,
    methodName: string,
    scorm2004: boolean,
    CMIElement: string,
  ): string;
}

/**
 * Interface for Error Handling service
 */
export interface IErrorHandlingService {
  /**
   * Get the last error code
   *
   * @return {string} - The last error code
   */
  get lastErrorCode(): string;

  /**
   * Set the last error code
   *
   * @param {string} errorCode - The error code to set
   */
  set lastErrorCode(errorCode: string);

  /**
   * Throws a SCORM error
   *
   * @param {number} errorNumber - The error number
   * @param {string} message - The error message
   */
  throwSCORMError(errorNumber: number, message?: string): void;

  /**
   * Clears the last SCORM error code on success.
   *
   * @param {string} success - Whether the operation was successful
   */
  clearSCORMError(success: string): void;

  /**
   * Handles the error that occurs when trying to access a value
   *
   * @param {ValidationError|Error|unknown} e - The exception that was thrown
   * @param {string} returnValue - The default return value
   * @return {string} - The return value after handling the exception
   */
  handleValueAccessException(
    e: ValidationError | Error | unknown,
    returnValue: string,
  ): string;

  /**
   * Get the error codes object
   *
   * @return {ErrorCode} - The error codes object
   */
  get errorCodes(): ErrorCode;
}

/**
 * Interface for Logging service
 */
export interface ILoggingService {
  /**
   * Sets the log level
   *
   * @param {LogLevel} level - The log level to set
   */
  setLogLevel(level: LogLevel): void;

  /**
   * Gets the current log level
   *
   * @returns {LogLevel} The current log level
   */
  getLogLevel(): LogLevel;

  /**
   * Sets the log handler function
   *
   * @param {Function} handler - The function to handle log messages
   */
  setLogHandler(
    handler: (messageLevel: LogLevel, logMessage: string) => void,
  ): void;

  /**
   * Logs a message if the message level is greater than or equal to the current log level
   *
   * @param {LogLevel} messageLevel - The level of the message
   * @param {string} logMessage - The message to log
   */
  log(messageLevel: LogLevel, logMessage: string): void;

  /**
   * Log a message at ERROR level
   *
   * @param {string} logMessage - The message to log
   */
  error(logMessage: string): void;

  /**
   * Log a message at WARN level
   *
   * @param {string} logMessage - The message to log
   */
  warn(logMessage: string): void;

  /**
   * Log a message at INFO level
   *
   * @param {string} logMessage - The message to log
   */
  info(logMessage: string): void;

  /**
   * Log a message at DEBUG level
   *
   * @param {string} logMessage - The message to log
   */
  debug(logMessage: string): void;
}
