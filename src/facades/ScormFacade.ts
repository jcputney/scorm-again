/**
 * ScormFacade.ts
 *
 * This file implements the Facade pattern for the SCORM Again API.
 * It provides a simplified interface to the complex subsystem of SCORM APIs.
 */

import { Scorm2004API } from "../Scorm2004API";
import { Scorm12API } from "../Scorm12API";
import { AICC } from "../AICC";
import { Settings } from "../types/api_types";
import { CompletionStatus, SuccessStatus } from "../constants/enums";
import BaseAPI from "../BaseAPI";
import { StringKeyMap } from "../utilities";

/**
 * Interface for the ScormFacade
 * Defines the simplified API contract
 */
export interface IScormFacade {
  /**
   * Initialize the SCORM API
   * @returns True if initialization was successful
   */
  initialize(): boolean;

  /**
   * Terminate the SCORM API
   * @returns True if termination was successful
   */
  terminate(): boolean;

  /**
   * Get a value from the SCORM API
   * @param element The CMI element to get
   * @returns The value of the CMI element
   */
  getValue(element: string): string;

  /**
   * Set a value in the SCORM API
   * @param element The CMI element to set
   * @param value The value to set
   * @returns True if the value was set successfully
   */
  setValue(element: string, value: any): boolean;

  /**
   * Commit changes to the LMS
   * @returns True if the commit was successful
   */
  commit(): boolean;

  /**
   * Get the last error code
   * @returns The last error code as a string
   */
  getLastError(): string;

  /**
   * Get the error string for an error code
   * @param errorCode The error code
   * @returns The error string
   */
  getErrorString(errorCode: string | number): string;

  /**
   * Get diagnostic information for an error code
   * @param errorCode The error code
   * @returns The diagnostic information
   */
  getDiagnostic(errorCode: string | number): string;

  /**
   * Set the lesson status
   * @param status The completion status
   * @returns True if the status was set successfully
   */
  setStatus(status: CompletionStatus): boolean;

  /**
   * Set the success status
   * @param status The success status
   * @returns True if the status was set successfully
   */
  setSuccessStatus(status: SuccessStatus): boolean;

  /**
   * Set the score
   * @param score The score (0-100)
   * @returns True if the score was set successfully
   */
  setScore(score: number): boolean;

  /**
   * Check if the API is currently initialized
   * @returns True if the API is initialized
   */
  isInitialized(): boolean;

  /**
   * Register an event listener
   * @param event The event name
   * @param callback The callback function
   */
  on(event: string, callback: Function): void;

  /**
   * Remove an event listener
   * @param event The event name
   * @param callback The callback function
   */
  off(event: string, callback: Function): void;
}

/**
 * Factory function to create a ScormFacade instance
 * @param apiType The type of SCORM API to use
 * @param settings Configuration settings
 * @param startingData Initial data
 * @returns A ScormFacade instance
 */
export function createScormFacade(
  apiType: "2004" | "1.2" | "AICC" = "2004",
  settings?: Settings,
  startingData?: StringKeyMap,
): IScormFacade {
  return new ScormFacade(apiType, settings, startingData);
}

/**
 * ScormFacade class
 * Implements the IScormFacade interface
 */
class ScormFacade implements IScormFacade {
  private _api: BaseAPI;

  /**
   * Constructor
   * @param apiType The type of SCORM API to use
   * @param settings Configuration settings
   * @param startingData Initial data
   */
  constructor(
    apiType: "2004" | "1.2" | "AICC" = "2004",
    settings?: Settings,
    startingData?: StringKeyMap,
  ) {
    // Create the appropriate API instance based on the apiType
    switch (apiType) {
      case "2004":
        this._api = new Scorm2004API(settings);
        break;
      case "1.2":
        this._api = new Scorm12API(settings);
        break;
      case "AICC":
        this._api = new AICC(settings);
        break;
      default:
        this._api = new Scorm2004API(settings);
    }

    // Load starting data if provided
    if (startingData) {
      this._api.loadFromJSON(startingData, "");
    }
  }

  /**
   * Initialize the SCORM API
   * @returns True if initialization was successful
   */
  initialize(): boolean {
    return this._api.lmsInitialize() === "true";
  }

  /**
   * Terminate the SCORM API
   * @returns True if termination was successful
   */
  terminate(): boolean {
    return this._api.lmsFinish() === "true";
  }

  /**
   * Get a value from the SCORM API
   * @param element The CMI element to get
   * @returns The value of the CMI element
   */
  getValue(element: string): string {
    return this._api.lmsGetValue(element);
  }

  /**
   * Set a value in the SCORM API
   * @param element The CMI element to set
   * @param value The value to set
   * @returns True if the value was set successfully
   */
  setValue(element: string, value: any): boolean {
    return this._api.lmsSetValue(element, value) === "true";
  }

  /**
   * Commit changes to the LMS
   * @returns True if the commit was successful
   */
  commit(): boolean {
    return this._api.lmsCommit() === "true";
  }

  /**
   * Get the last error code
   * @returns The last error code as a string
   */
  getLastError(): string {
    return this._api.lmsGetLastError();
  }

  /**
   * Get the error string for an error code
   * @param errorCode The error code
   * @returns The error string
   */
  getErrorString(errorCode: string | number): string {
    return this._api.lmsGetErrorString(errorCode);
  }

  /**
   * Get diagnostic information for an error code
   * @param errorCode The error code
   * @returns The diagnostic information
   */
  getDiagnostic(errorCode: string | number): string {
    return this._api.lmsGetDiagnostic(errorCode);
  }

  /**
   * Set the lesson status
   * @param status The completion status
   * @returns True if the status was set successfully
   */
  setStatus(status: CompletionStatus): boolean {
    return this.setValue("cmi.completion_status", status);
  }

  /**
   * Set the success status
   * @param status The success status
   * @returns True if the status was set successfully
   */
  setSuccessStatus(status: SuccessStatus): boolean {
    return this.setValue("cmi.success_status", status);
  }

  /**
   * Set the score
   * @param score The score (0-100)
   * @returns True if the score was set successfully
   */
  setScore(score: number): boolean {
    // Normalize score to 0-1 range for scaled score
    const normalizedScore = Math.max(0, Math.min(score, 100)) / 100;

    // Set both raw and scaled scores
    const rawResult = this.setValue("cmi.score.raw", score);
    const scaledResult = this.setValue("cmi.score.scaled", normalizedScore);

    return rawResult && scaledResult;
  }

  /**
   * Check if the API is currently initialized
   * @returns True if the API is initialized
   */
  isInitialized(): boolean {
    return this._api.isInitialized();
  }

  /**
   * Register an event listener
   * @param event The event name
   * @param callback The callback function
   */
  on(event: string, callback: Function): void {
    this._api.on(event, callback);
  }

  /**
   * Remove an event listener
   * @param event The event name
   * @param callback The callback function
   */
  off(event: string, callback: Function): void {
    this._api.off(event, callback);
  }
}
