import Scorm12API from "./Scorm12API";
import { CMI } from "./cmi/aicc/cmi";

import { BaseCMI } from "./cmi/common/base_cmi";
import { CMITriesObject } from "./cmi/aicc/tries";
import { CMIAttemptRecordsObject } from "./cmi/aicc/attempts";
import { CMIEvaluationCommentsObject } from "./cmi/aicc/evaluation";
import { NAV } from "./cmi/scorm12/nav";
import { CMIPathsObject } from "./cmi/aicc/paths";
import { Settings } from "./types/api_types";

/**
 * The AICC API class
 */
export default class AICC extends Scorm12API {
  /**
   * Constructor to create AICC API object
   * @param {Settings} settings
   */
  constructor(settings?: Settings) {
    super(settings);

    this.cmi = new CMI();
    this.nav = new NAV();
  }

  /**
   * Gets or builds a new child element to add to the array.
   *
   * @param {string} CMIElement
   * @param {any} value
   * @param {boolean} foundFirstIndex
   * @return {BaseCMI | null}
   */
  getChildElement(
    CMIElement: string,
    value: any,
    foundFirstIndex: boolean,
  ): BaseCMI | null {
    let newChild = super.getChildElement(CMIElement, value, foundFirstIndex);

    if (!newChild) {
      if (
        this.stringMatches(CMIElement, "cmi\\.evaluation\\.comments\\.\\d+")
      ) {
        newChild = new CMIEvaluationCommentsObject();
      } else if (
        this.stringMatches(CMIElement, "cmi\\.student_data\\.tries\\.\\d+")
      ) {
        newChild = new CMITriesObject();
      } else if (
        this.stringMatches(
          CMIElement,
          "cmi\\.student_data\\.attempt_records\\.\\d+",
        )
      ) {
        newChild = new CMIAttemptRecordsObject();
      } else if (this.stringMatches(CMIElement, "cmi\\.paths\\.\\d+")) {
        newChild = new CMIPathsObject();
      }
    }

    return newChild;
  }

  /**
   * Replace the whole API with another
   *
   * @param {AICC} newAPI
   */
  replaceWithAnotherScormAPI(newAPI: AICC) {
    // Data Model
    this.cmi = newAPI.cmi;
    this.nav = newAPI.nav;
  }
}
