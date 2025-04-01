import { CommitObject, LogLevel } from "../types/api_types";
import { StringKeyMap, unflatten, flatten } from "../utilities";
import { LogLevelEnum } from "../constants/enums";
import { BaseCMI } from "../cmi/common/base_cmi";
import { ISerializationService } from "../interfaces/services";

/**
 * Service for handling data serialization and deserialization in SCORM Again
 */
export class SerializationService implements ISerializationService {
  /**
   * Load the CMI from a flattened JSON object
   * @param {StringKeyMap} json - The flattened JSON object
   * @param {string} CMIElement - The CMI element to start from
   * @param {Function} loadFromJSON - Function to load from JSON
   * @param {Function} setCMIValue - Function to set CMI value
   * @param {Function} isNotInitialized - Function to check if not initialized
   */
  loadFromFlattenedJSON(
    json: StringKeyMap,
    CMIElement: string = "",
    loadFromJSON: (json: StringKeyMap, CMIElement: string) => void,
    setCMIValue: (CMIElement: string, value: any) => void,
    isNotInitialized: () => boolean,
  ): void {
    if (!isNotInitialized()) {
      console.error(
        "loadFromFlattenedJSON can only be called before the call to lmsInitialize.",
      );
      return;
    }

    const int_pattern = /^(cmi\.interactions\.)(\d+)\.(.*)$/;
    const obj_pattern = /^(cmi\.objectives\.)(\d+)\.(.*)$/;

    // Extract and categorize keys for better sorting
    const interactions: { key: string; value: any; index: number; field: string }[] = [];
    const objectives: { key: string; value: any; index: number; field: string }[] = [];
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
            field: intMatch[3]
          });
          continue;
        }

        const objMatch = key.match(obj_pattern);
        if (objMatch) {
          objectives.push({
            key,
            value: json[key],
            index: Number(objMatch[2]),
            field: objMatch[3]
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
      if (a.field === 'id') return -1;
      if (b.field === 'id') return 1;
      if (a.field === 'type') return -1;
      if (b.field === 'type') return 1;

      return a.field.localeCompare(b.field);
    });

    // Sort objectives: first by index, then prioritize 'id' field
    objectives.sort((a, b) => {
      if (a.index !== b.index) {
        return a.index - b.index;
      }

      // Same index, prioritize id
      if (a.field === 'id') return -1;
      if (b.field === 'id') return 1;

      return a.field.localeCompare(b.field);
    });

    // Sort other keys alphabetically
    others.sort((a, b) => a.key.localeCompare(b.key));

    // Process all items in the correct order
    const processItems = (items: { key: string; value: any }[]) => {
      items.forEach(item => {
        const obj: StringKeyMap = {};
        obj[item.key] = item.value;
        loadFromJSON(unflatten(obj), CMIElement);
      });
    };

    // Process in order: interactions, objectives, others
    processItems(interactions);
    processItems(objectives);
    processItems(others);
  }

  /**
   * Loads CMI data from a JSON object.
   *
   * @param {{[key: string]: any}} json - The JSON object
   * @param {string} CMIElement - The CMI element to start from
   * @param {Function} setCMIValue - Function to set CMI value
   * @param {Function} isNotInitialized - Function to check if not initialized
   * @param {Function} setStartingData - Function to set starting data
   */
  loadFromJSON(
    json: { [key: string]: any },
    CMIElement: string = "",
    setCMIValue: (CMIElement: string, value: any) => void,
    isNotInitialized: () => boolean,
    setStartingData: (data: StringKeyMap) => void,
  ): void {
    if (!isNotInitialized()) {
      console.error(
        "loadFromJSON can only be called before the call to lmsInitialize.",
      );
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
  renderCMIToJSONString(
    cmi: BaseCMI | StringKeyMap,
    sendFullCommit: boolean,
  ): string {
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
  renderCMIToJSONObject(
    cmi: BaseCMI | StringKeyMap,
    sendFullCommit: boolean,
  ): StringKeyMap {
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
    renderCommonCommitFields:
      | boolean
      | ((commitObject: CommitObject) => boolean),
    renderCommitObject: (terminateCommit: boolean) => CommitObject,
    renderCommitCMI: (terminateCommit: boolean) => StringKeyMap | Array<any>,
    apiLogLevel: LogLevel,
  ): CommitObject | StringKeyMap | Array<any> {
    const shouldTerminateCommit = terminateCommit || alwaysSendTotalTime;
    const commitObject = renderCommonCommitFields
      ? renderCommitObject(shouldTerminateCommit)
      : renderCommitCMI(shouldTerminateCommit);

    if ([LogLevelEnum.DEBUG, "1", 1, "DEBUG"].includes(apiLogLevel)) {
      console.debug(
        "Commit (terminated: " + (terminateCommit ? "yes" : "no") + "): ",
      );
      console.debug(commitObject);
    }
    return commitObject;
  }
}
