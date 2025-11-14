import Scorm12API from "./Scorm12API";
import { CMI } from "./cmi/aicc/cmi";

import { BaseCMI } from "./cmi/common/base_cmi";
import { CMITriesObject } from "./cmi/aicc/tries";
import { CMIAttemptRecordsObject } from "./cmi/aicc/attempts";
import { CMIEvaluationCommentsObject } from "./cmi/aicc/evaluation";
import { NAV } from "./cmi/scorm12/nav";
import { CMIPathsObject } from "./cmi/aicc/paths";
import { Settings } from "./types/api_types";
import { stringMatches } from "./utilities";
import { IHttpService } from "./interfaces/services";

/**
 * The AICC API class
 */
class AICC extends Scorm12API {
  /**
   * Constructor to create AICC API object
   * @param {Settings} settings
   * @param {IHttpService} httpService - Optional HTTP service instance
   */
  constructor(settings?: Settings, httpService?: IHttpService) {
    super(settings, httpService);

    this.cmi = new CMI();
    this.nav = new NAV();
  }

  override cmi: CMI;
  override nav: NAV;

  /**
   * Gets or builds a new child element to add to the array.
   *
   * @param {string} CMIElement
   * @param {any} value
   * @param {boolean} foundFirstIndex
   * @return {BaseCMI | null}
   */
  override getChildElement(
    CMIElement: string,
    value: any,
    foundFirstIndex: boolean,
  ): BaseCMI | null {
    let newChild = super.getChildElement(CMIElement, value, foundFirstIndex);

    if (!newChild) {
      if (stringMatches(CMIElement, "cmi\\.evaluation\\.comments\\.\\d+")) {
        newChild = new CMIEvaluationCommentsObject();
      } else if (stringMatches(CMIElement, "cmi\\.student_data\\.tries\\.\\d+")) {
        newChild = new CMITriesObject();
      } else if (stringMatches(CMIElement, "cmi\\.student_data\\.attempt_records\\.\\d+")) {
        newChild = new CMIAttemptRecordsObject();
      } else if (stringMatches(CMIElement, "cmi\\.paths\\.\\d+")) {
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
  override replaceWithAnotherScormAPI(newAPI: AICC) {
    // Data Model
    this.cmi = newAPI.cmi;
    this.nav = newAPI.nav;
  }
}

export default AICC;
