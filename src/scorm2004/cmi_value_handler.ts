/**
 * CMI value handling functions for SCORM 2004
 */
import { stringMatches } from "../utilities";
import { CMIObjectivesObject } from "../cmi/scorm2004/objectives";

/**
 * Sets a value on the CMI Object
 *
 * @param {string} CMIElement
 * @param {any} value
 * @param {Function} commonSetCMIValue - Function to set a CMI value
 * @param {CMIObjectivesObject[]} globalObjectives - The global objectives array
 * @param {string[]} globalObjectiveIds - The global objective IDs
 * @param {any} cmiObjectives - The CMI objectives
 * @return {string}
 */
export function setCMIValue(
  CMIElement: string,
  value: any,
  commonSetCMIValue: (method: string, scorm: boolean, CMIElement: string, value: any) => string,
  globalObjectives: CMIObjectivesObject[],
  globalObjectiveIds: string[],
  cmiObjectives: any
): string {
  // Check if we're updating a global or local objective
  if (stringMatches(CMIElement, "cmi\\.objectives\\.\\d+")) {
    const parts = CMIElement.split(".");
    const index = Number(parts[2]);
    const element_base = `cmi.objectives.${index}`;

    let objective_id;
    const setting_id = stringMatches(
      CMIElement,
      "cmi\\.objectives\\.\\d+\\.id",
    );

    if (setting_id) {
      // If we're setting the objective ID, capture it directly
      objective_id = value;
    } else {
      // Find existing objective ID if available
      const objective = cmiObjectives.findObjectiveByIndex(index);
      objective_id = objective ? objective.id : undefined;
    }

    // Check if the objective ID matches a global objective
    const is_global =
      objective_id && globalObjectiveIds.includes(objective_id);

    if (is_global) {
      // Locate or create an entry in _globalObjectives for the global objective
      let global_index = globalObjectives.findIndex(
        (obj) => obj.id === objective_id,
      );

      if (global_index === -1) {
        global_index = globalObjectives.length;
        const newGlobalObjective = new CMIObjectivesObject();
        newGlobalObjective.id = objective_id;
        globalObjectives.push(newGlobalObjective);
      }

      // Update the global objective
      const global_element = CMIElement.replace(
        element_base,
        `_globalObjectives.${global_index}`,
      );
      commonSetCMIValue(
        "SetGlobalObjectiveValue",
        true,
        global_element,
        value,
      );
    }
  }
  return commonSetCMIValue("SetValue", true, CMIElement, value);
}

/**
 * Gets a value from the CMI Object
 *
 * @param {string} CMIElement
 * @param {Function} commonGetCMIValue - Function to get a CMI value
 * @return {any}
 */
export function getCMIValue(
  CMIElement: string,
  commonGetCMIValue: (method: string, scorm: boolean, CMIElement: string) => any
): any {
  return commonGetCMIValue("GetValue", true, CMIElement);
}