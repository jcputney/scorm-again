import { CommitObject, LogLevel } from "../types/api_types";
import { StringKeyMap, unflatten } from "../utilities";
import { LogLevelEnum } from "../constants/enums";
import { BaseCMI } from "../cmi/common/base_cmi";
import { ISerializationService } from "../interfaces/services";

/**
 * Service for handling data serialization and deserialization in scorm-again
 */
export class SerializationService implements ISerializationService {
  /**
   * Loads CMI data from a flattened JSON object with special handling for arrays and ordering.
   *
   * This method implements a complex algorithm for loading flattened JSON data into the CMI
   * object structure. It handles several key challenges:
   *
   * 1. Ordering dependencies: Some CMI elements (like interactions and objectives) must be
   *    loaded in a specific order to ensure proper initialization.
   *
   * 2. Array handling: Interactions and objectives are stored as arrays, and their properties
   *    must be loaded in the correct order (e.g., 'id' and 'type' must be set before other properties).
   *
   * 3. Unflattening: The method converts flattened dot notation (e.g., "cmi.objectives.0.id")
   *    back into nested objects before loading.
   *
   * The algorithm works by:
   * - Categorizing keys into interactions, objectives, and other properties
   * - Sorting interactions to prioritize 'id' and 'type' fields within each index
   * - Sorting objectives to prioritize 'id' fields within each index
   * - Processing each category in order: interactions, objectives, then other properties
   *
   * @param {StringKeyMap} json - The flattened JSON object with dot notation keys
   * @param {string} CMIElement - The CMI element to start from (usually empty or "cmi")
   * @param {Function} setCMIValue - Function to set CMI value
   * @param {Function} isNotInitialized - Function to check if API is not initialized
   *
   * @param setStartingData
   * @example
   * // Example of flattened JSON input:
   * // {
   * //   "cmi.objectives.0.id": "obj1",
   * //   "cmi.objectives.0.score.raw": "80",
   * //   "cmi.interactions.0.id": "int1",
   * //   "cmi.interactions.0.type": "choice",
   * //   "cmi.interactions.0.result": "correct"
   * // }
   */
  loadFromFlattenedJSON(
    json: StringKeyMap,
    CMIElement: string = "",
    setCMIValue: (CMIElement: string, value: any) => void,
    isNotInitialized: () => boolean,
    setStartingData: (data: StringKeyMap) => void,
  ): void {
    if (!isNotInitialized()) {
      console.error("loadFromFlattenedJSON can only be called before the call to lmsInitialize.");
      return;
    }

    const int_pattern = /^(cmi\.interactions\.)(\d+)\.(.*)$/;
    const obj_pattern = /^(cmi\.objectives\.)(\d+)\.(.*)$/;

    // Extract and categorize keys for better sorting
    const interactions: {
      key: string;
      value: any;
      index: number;
      field: string;
    }[] = [];
    const objectives: {
      key: string;
      value: any;
      index: number;
      field: string;
    }[] = [];
    const others: { key: string; value: any }[] = [];

    // Categorize keys
    for (const key in json) {
      if (Object.prototype.hasOwnProperty.call(json, key)) {
        const intMatch = key.match(int_pattern);
        if (intMatch) {
          interactions.push({
            key,
            value: json[key],
            index: Number(intMatch[2]),
            field: intMatch[3],
          });
          continue;
        }

        const objMatch = key.match(obj_pattern);
        if (objMatch) {
          objectives.push({
            key,
            value: json[key],
            index: Number(objMatch[2]),
            field: objMatch[3],
          });
          continue;
        }

        others.push({ key, value: json[key] });
      }
    }

    // Sort interactions: first by index, then prioritize 'id' and 'type' fields
    interactions.sort((a, b) => {
      if (a.index !== b.index) {
        return a.index - b.index;
      }

      // Same index, prioritize id and type
      if (a.field === "id") return -1;
      if (b.field === "id") return 1;
      if (a.field === "type") return -1;
      if (b.field === "type") return 1;

      return a.field.localeCompare(b.field);
    });

    // Sort objectives: first by index, then prioritize 'id' field
    objectives.sort((a, b) => {
      if (a.index !== b.index) {
        return a.index - b.index;
      }

      // Same index, prioritize id
      if (a.field === "id") return -1;
      if (b.field === "id") return 1;

      return a.field.localeCompare(b.field);
    });

    // Sort other keys alphabetically
    others.sort((a, b) => a.key.localeCompare(b.key));

    // Process all items in the correct order
    const processItems = (items: { key: string; value: any }[]) => {
      items.forEach((item) => {
        const obj: StringKeyMap = {};
        obj[item.key] = item.value;
        this.loadFromJSON(
          unflatten(obj) as StringKeyMap,
          CMIElement,
          setCMIValue,
          isNotInitialized,
          setStartingData,
        );
      });
    };

    // Process in order: interactions, objectives, others
    processItems(interactions);
    processItems(objectives);
    processItems(others);
  }

  /**
   * Loads CMI data from a nested JSON object with recursive traversal.
   *
   * This method implements a recursive algorithm for loading nested JSON data into the CMI
   * object structure. It handles several key aspects:
   *
   * 1. Recursive traversal: The method recursively traverses the nested JSON structure,
   *    building CMI element paths as it goes (e.g., "cmi.core.student_id").
   *
   * 2. Type-specific handling: Different data types are handled differently:
   *    - Arrays: Each array element is processed individually with its index in the path
   *    - Objects: Recursively processed with updated path
   *    - Primitives: Set directly using setCMIValue
   *
   * 3. Initialization check: Ensures the method is only called before API initialization
   *
   * 4. Starting data storage: Stores the original JSON data for potential future use
   *
   * The algorithm works by:
   * - First storing the complete JSON object via setStartingData
   * - Iterating through each property in the JSON object
   * - For each property, determining its type and handling it accordingly
   * - Building the CMI element path as it traverses the structure
   * - Setting values at the appropriate paths using setCMIValue
   *
   * @param {{[key: string]: any}} json - The nested JSON object to load
   * @param {string} CMIElement - The CMI element to start from (usually empty or "cmi")
   * @param {Function} setCMIValue - Function to set CMI value at a specific path
   * @param {Function} isNotInitialized - Function to check if API is not initialized
   * @param {Function} setStartingData - Function to store the original JSON data
   *
   * @example
   * // Example of nested JSON input:
   * // {
   * //   "core": {
   * //     "student_id": "12345",
   * //     "student_name": "John Doe"
   * //   },
   * //   "objectives": [
   * //     { "id": "obj1", "score": { "raw": 80 } },
   * //     { "id": "obj2", "score": { "raw": 90 } }
   * //   ]
   * // }
   */
  loadFromJSON(
    json: { [key: string]: any },
    CMIElement: string = "",
    setCMIValue: (CMIElement: string, value: any) => void,
    isNotInitialized: () => boolean,
    setStartingData: (data: StringKeyMap) => void,
  ): void {
    if (!isNotInitialized()) {
      console.error("loadFromJSON can only be called before the call to lmsInitialize.");
      return;
    }

    CMIElement = CMIElement !== undefined ? CMIElement : "cmi";

    setStartingData(json);

    // could this be refactored down to flatten(json) then setCMIValue on each?
    for (const key in json) {
      if (Object.prototype.hasOwnProperty.call(json, key) && json[key]) {
        const currentCMIElement = (CMIElement ? CMIElement + "." : "") + key;
        const value = json[key];

        if (value.constructor === Array) {
          for (let i = 0; i < value.length; i++) {
            if (value[i]) {
              const item = value[i];
              const tempCMIElement = `${currentCMIElement}.${i}`;

              if (item.constructor === Object) {
                this.loadFromJSON(
                  item,
                  tempCMIElement,
                  setCMIValue,
                  isNotInitialized,
                  setStartingData,
                );
              } else {
                setCMIValue(tempCMIElement, item);
              }
            }
          }
        } else if (value.constructor === Object) {
          this.loadFromJSON(
            value,
            currentCMIElement,
            setCMIValue,
            isNotInitialized,
            setStartingData,
          );
        } else {
          setCMIValue(currentCMIElement, value);
        }
      }
    }
  }

  /**
   * Render the CMI object to JSON for sending to an LMS.
   *
   * @param {BaseCMI|StringKeyMap} cmi - The CMI object
   * @param {boolean} sendFullCommit - Whether to send the full commit
   * @return {string}
   */
  renderCMIToJSONString(cmi: BaseCMI | StringKeyMap, sendFullCommit: boolean): string {
    // Do we want/need to return fields that have no set value?
    if (sendFullCommit) {
      return JSON.stringify({ cmi });
    }
    return JSON.stringify({ cmi }, (k, v) => (v === undefined ? null : v), 2);
  }

  /**
   * Returns a JS object representing the current cmi
   * @param {BaseCMI|StringKeyMap} cmi - The CMI object
   * @param {boolean} sendFullCommit - Whether to send the full commit
   * @return {object}
   */
  renderCMIToJSONObject(cmi: BaseCMI | StringKeyMap, sendFullCommit: boolean): StringKeyMap {
    // Revert to the original implementation to maintain compatibility with tests
    return JSON.parse(this.renderCMIToJSONString(cmi, sendFullCommit));
  }

  /**
   * Builds the commit object to be sent to the LMS
   * @param {boolean} terminateCommit - Whether this is a termination commit
   * @param {boolean} alwaysSendTotalTime - Whether to always send total time
   * @param {boolean|Function} renderCommonCommitFields - Whether to render common commit fields
   * @param {Function} renderCommitObject - Function to render commit object
   * @param {Function} renderCommitCMI - Function to render commit CMI
   * @param {LogLevel} apiLogLevel - The API log level
   * @return {CommitObject|StringKeyMap|Array<any>}
   */
  getCommitObject(
    terminateCommit: boolean,
    alwaysSendTotalTime: boolean,
    renderCommonCommitFields: boolean | ((commitObject: CommitObject) => boolean),
    renderCommitObject: (terminateCommit: boolean, includeTotalTime?: boolean) => CommitObject,
    renderCommitCMI: (terminateCommit: boolean, includeTotalTime?: boolean) => StringKeyMap | Array<any>,
    apiLogLevel: LogLevel,
  ): CommitObject | StringKeyMap | Array<any> {
    // Fix for issue: total time is being calculated incorrectly across multiple sessions
    // when selfReportSessionTime and alwaysSendTotalTime are enabled.
    //
    // Previously, we were using a single variable (shouldTerminateCommit) that combined
    // both concerns: whether this is a termination commit and whether to include total time.
    // This caused the total time to be calculated as if every commit was a terminate commit
    // when alwaysSendTotalTime was true, leading to incorrect time calculations.
    //
    // Now we pass the actual terminateCommit value and a separate parameter for whether
    // to include total time, allowing the rendering functions to handle these concerns separately.
    const includeTotalTime = alwaysSendTotalTime || terminateCommit;

    const commitObject = renderCommonCommitFields
      ? renderCommitObject(terminateCommit, includeTotalTime)
      : renderCommitCMI(terminateCommit, includeTotalTime);

    if ([LogLevelEnum.DEBUG, "1", 1, "DEBUG"].includes(apiLogLevel)) {
      console.debug("Commit (terminated: " + (terminateCommit ? "yes" : "no") + "): ");
      console.debug(commitObject);
    }
    return commitObject;
  }
}
