// @flow
import Scorm12API from './Scorm12API';
import {CMIEvaluationCommentsObject, CMITriesObject, NAV} from './cmi/aicc_cmi';

/**
 * The AICC API class
 */
class AICC extends Scorm12API {
  /**
   * Constructor to create AICC API object
   */
  constructor() {
    super();

    this.nav = new NAV(this);
  }

  /**
   * Gets or builds a new child element to add to the array.
   *
   * @param {string} CMIElement
   * @param {any} value
   * @return {object}
   */
  getChildElement(CMIElement, value) {
    let newChild = super.getChildElement(CMIElement);

    if (!newChild) {
      if (this.stringContains(CMIElement, 'cmi.evaluation.comments')) {
        newChild = new CMIEvaluationCommentsObject(this);
      } else if (this.stringContains(CMIElement, 'cmi.student_data.tries')) {
        newChild = new CMITriesObject(this);
      }
    }

    return newChild;
  }

  /**
   * Replace the whole API with another
   *
   * @param {AICC} newAPI
   */
  replaceWithAnotherScormAPI(newAPI) {
    // Data Model
    this.cmi = newAPI.cmi;
    this.nav = newAPI.nav;
  }
}
