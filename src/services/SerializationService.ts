import { CommitObject, LogLevel, RefObject } from "../types/api_types";
import { unflatten } from "../utilities";
import { LogLevelEnum } from "../constants/enums";

/**
 * Service for handling data serialization and deserialization in SCORM Again
 */
export class SerializationService {
  /**
   * Load the CMI from a flattened JSON object
   * @param {RefObject} json - The flattened JSON object
   * @param {string} CMIElement - The CMI element to start from
   * @param {Function} loadFromJSON - Function to load from JSON
   * @param {Function} setCMIValue - Function to set CMI value
   * @param {Function} isNotInitialized - Function to check if not initialized
   */
  loadFromFlattenedJSON(
    json: RefObject,
    CMIElement: string = "",
    loadFromJSON: (json: RefObject, CMIElement: string) => void,
    setCMIValue: (CMIElement: string, value: any) => void,
    isNotInitialized: () => boolean,
  ): void {
    if (!isNotInitialized()) {
      console.error(
        "loadFromFlattenedJSON can only be called before the call to lmsInitialize.",
      );
      return;
    }

    /**
     * Tests two strings against a given regular expression pattern and determines a numeric or null result based on the matching criterion.
     *
     * @param {string} a - The first string to be tested against the pattern.
     * @param {string} c - The second string to be tested against the pattern.
     * @param {RegExp} a_pattern - The regular expression pattern to test the strings against.
     * @return {number | null} A numeric result based on the matching criterion, or null if the strings do not match the pattern.
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
      loadFromJSON(unflatten(obj), CMIElement);
    });
  }

  /**
   * Loads CMI data from a JSON object.
   *
   * @param {RefObject} json - The JSON object
   * @param {string} CMIElement - The CMI element to start from
   * @param {Function} setCMIValue - Function to set CMI value
   * @param {Function} isNotInitialized - Function to check if not initialized
   * @param {Function} setStartingData - Function to set starting data
   */
  loadFromJSON(
    json: RefObject,
    CMIElement: string = "",
    setCMIValue: (CMIElement: string, value: any) => void,
    isNotInitialized: () => boolean,
    setStartingData: (data: RefObject) => void,
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
      if ({}.hasOwnProperty.call(json, key) && json[key]) {
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
   * @param {any} cmi - The CMI object
   * @param {boolean} sendFullCommit - Whether to send the full commit
   * @return {string}
   */
  renderCMIToJSONString(cmi: any, sendFullCommit: boolean): string {
    // Do we want/need to return fields that have no set value?
    if (sendFullCommit) {
      return JSON.stringify({ cmi });
    }
    return JSON.stringify({ cmi }, (k, v) => (v === undefined ? null : v), 2);
  }

  /**
   * Returns a JS object representing the current cmi
   * @param {any} cmi - The CMI object
   * @param {boolean} sendFullCommit - Whether to send the full commit
   * @return {object}
   */
  renderCMIToJSONObject(cmi: any, sendFullCommit: boolean): object {
    return JSON.parse(this.renderCMIToJSONString(cmi, sendFullCommit));
  }

  /**
   * Builds the commit object to be sent to the LMS
   * @param {boolean} terminateCommit - Whether this is a termination commit
   * @param {boolean} alwaysSendTotalTime - Whether to always send total time
   * @param {boolean} renderCommonCommitFields - Whether to render common commit fields
   * @param {Function} renderCommitObject - Function to render commit object
   * @param {Function} renderCommitCMI - Function to render commit CMI
   * @param {LogLevel} apiLogLevel - The API log level
   * @return {CommitObject|RefObject|Array}
   */
  getCommitObject(
    terminateCommit: boolean,
    alwaysSendTotalTime: boolean,
    renderCommonCommitFields: boolean,
    renderCommitObject: (terminateCommit: boolean) => CommitObject,
    renderCommitCMI: (terminateCommit: boolean) => RefObject | Array<any>,
    apiLogLevel: LogLevel,
  ): CommitObject | RefObject | Array<any> {
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
