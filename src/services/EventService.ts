import { LogLevel } from "../types/api_types";
import { LogLevelEnum } from "../constants/enums";
import { stringMatches } from "../utilities";

/**
 * Interface for a listener object
 */
interface Listener {
  functionName: string;
  CMIElement: string | null;
  callback: Function;
}

/**
 * Service for handling event listeners and event processing
 */
export class EventService {
  private listenerArray: Listener[] = [];

  /**
   * Constructor for EventService
   * @param {Function} apiLog - Function to log API messages
   */
  constructor(
    private apiLog: (
      functionName: string,
      message: string,
      messageLevel: LogLevel,
      CMIElement?: string,
    ) => void,
  ) {}

  /**
   * Provides a mechanism for attaching to a specific SCORM event
   *
   * @param {string} listenerName - The name of the listener
   * @param {Function} callback - The callback function to execute when the event occurs
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
   * @param {string} functionName - The name of the function that triggered the event
   * @param {string} CMIElement - The CMI element that was affected
   * @param {any} value - The value that was set
   */
  processListeners(functionName: string, CMIElement?: string, value?: any) {
    this.apiLog(functionName, value, LogLevelEnum.INFO, CMIElement);
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
        CMIElementsMatch = stringMatches(
          CMIElement,
          listener.CMIElement.substring(0, listener.CMIElement.length - 1),
        );
      } else {
        CMIElementsMatch = listener.CMIElement === CMIElement;
      }

      if (functionsMatch && (!listenerHasCMIElement || CMIElementsMatch)) {
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
    this.listenerArray = [];
  }
}
