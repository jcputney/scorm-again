import { LogLevel } from "../types/api_types";
import { LogLevelEnum } from "../constants/enums";
import { stringMatches } from "../utilities";
import { IEventService } from "../interfaces/services";

/**
 * Interface for a listener object
 */
interface Listener {
  functionName: string;
  CMIElement: string | null;
  callback: Function;
}

/**
 * Type for parsed listener information
 */
interface ParsedListener {
  functionName: string;
  CMIElement: string | null;
}

/**
 * Service for handling event listeners and event processing
 */
export class EventService implements IEventService {
  // Map of function names to listeners for faster lookups
  private listenerMap: Map<string, Listener[]> = new Map();
  // Total count of listeners for logging
  private listenerCount = 0;
  // Function to log API messages
  private readonly apiLog: (
    functionName: string,
    message: string,
    messageLevel: LogLevel,
    CMIElement?: string,
  ) => void;

  /**
   * Constructor for EventService
   * @param {Function} apiLog - Function to log API messages
   */
  constructor(
    apiLog: (
      functionName: string,
      message: string,
      messageLevel: LogLevel,
      CMIElement?: string,
    ) => void,
  ) {
    this.apiLog = apiLog;
  }

  /**
   * Parses a listener name into its components
   *
   * @param {string} listenerName - The name of the listener
   * @returns {ParsedListener|null} - The parsed listener information or null if invalid
   */
  private parseListenerName(listenerName: string): ParsedListener | null {
    const listenerSplit = listenerName.split(".");
    if (listenerSplit.length === 0) return null;

    const functionName = listenerSplit[0];
    let CMIElement = null;

    if (listenerSplit.length > 1) {
      CMIElement = listenerName.replace(`${functionName}.`, "");
    }

    return { functionName, CMIElement };
  }

  /**
   * Provides a mechanism for attaching to a specific SCORM event
   *
   * @param {string} listenerName - The name of the listener
   * @param {Function} callback - The callback function to execute when the event occurs
   */
  on(listenerName: string, callback: Function) {
    if (!callback) return;

    const listenerFunctions = listenerName.split(" ");
    for (const listenerFunction of listenerFunctions) {
      const parsedListener = this.parseListenerName(listenerFunction);
      if (!parsedListener) continue;

      const { functionName, CMIElement } = parsedListener;

      // Get or create the array for this function name
      const listeners = this.listenerMap.get(functionName) ?? [];

      // Add the new listener
      listeners.push({
        functionName,
        CMIElement,
        callback,
      });

      // Update the map and count
      this.listenerMap.set(functionName, listeners);
      this.listenerCount++;

      this.apiLog(
        "on",
        `Added event listener: ${this.listenerCount}`,
        LogLevelEnum.INFO,
        functionName,
      );
    }
  }

  /**
   * Provides a mechanism for detaching a specific SCORM event listener
   *
   * @param {string} listenerName - The name of the listener to remove
   * @param {Function} callback - The callback function to remove
   */
  off(listenerName: string, callback: Function) {
    if (!callback) return;

    const listenerFunctions = listenerName.split(" ");
    for (const listenerFunction of listenerFunctions) {
      const parsedListener = this.parseListenerName(listenerFunction);
      if (!parsedListener) continue;

      const { functionName, CMIElement } = parsedListener;

      // Get the listeners for this function name
      const listeners = this.listenerMap.get(functionName);
      if (!listeners) continue;

      // Find the index of the listener to remove
      const removeIndex = listeners.findIndex(
        (obj) => obj.CMIElement === CMIElement && obj.callback === callback,
      );

      if (removeIndex !== -1) {
        // Remove the listener
        listeners.splice(removeIndex, 1);
        this.listenerCount--;

        // Update the map or remove the entry if empty
        if (listeners.length === 0) {
          this.listenerMap.delete(functionName);
        } else {
          this.listenerMap.set(functionName, listeners);
        }

        this.apiLog(
          "off",
          `Removed event listener: ${this.listenerCount}`,
          LogLevelEnum.INFO,
          functionName,
        );
      }
    }
  }

  /**
   * Provides a mechanism for clearing all listeners from a specific SCORM event
   *
   * @param {string} listenerName - The name of the listener to clear
   */
  clear(listenerName: string) {
    const listenerFunctions = listenerName.split(" ");
    for (const listenerFunction of listenerFunctions) {
      const parsedListener = this.parseListenerName(listenerFunction);
      if (!parsedListener) continue;

      const { functionName, CMIElement } = parsedListener;

      // If we have listeners for this function name
      if (this.listenerMap.has(functionName)) {
        const listeners = this.listenerMap.get(functionName)!;

        // Filter out listeners that match the criteria
        const newListeners = listeners.filter(
          (obj) => obj.CMIElement !== CMIElement,
        );

        // Update the count and map
        this.listenerCount -= listeners.length - newListeners.length;

        if (newListeners.length === 0) {
          this.listenerMap.delete(functionName);
        } else {
          this.listenerMap.set(functionName, newListeners);
        }
      }
    }
  }

  /**
   * Processes any 'on' listeners that have been created
   *
   * @param {string} functionName - The name of the function that triggered the event
   * @param {string} CMIElement - The CMI element that was affected
   * @param {any} value - The value that was set
   */
  processListeners(functionName: string, CMIElement?: string, value?: any) {
    this.apiLog(functionName, value, LogLevelEnum.INFO, CMIElement);

    // Get listeners for this function name
    const listeners = this.listenerMap.get(functionName);
    if (!listeners) return;

    for (const listener of listeners) {
      const listenerHasCMIElement = !!listener.CMIElement;
      let CMIElementsMatch = false;

      // Check if CMI elements match
      if (
        CMIElement &&
        listener.CMIElement &&
        listener.CMIElement.endsWith("*")
      ) {
        const prefix = listener.CMIElement.slice(0, -1);
        CMIElementsMatch = stringMatches(CMIElement, prefix);
      } else {
        CMIElementsMatch = listener.CMIElement === CMIElement;
      }

      // If the listener matches, call the callback
      if (!listenerHasCMIElement || CMIElementsMatch) {
        this.apiLog(
          "processListeners",
          `Processing listener: ${listener.functionName}`,
          LogLevelEnum.DEBUG,
          CMIElement,
        );
        listener.callback(CMIElement, value);
      }
    }
  }

  /**
   * Resets the event service by clearing all listeners
   */
  reset() {
    this.listenerMap.clear();
    this.listenerCount = 0;
  }
}
