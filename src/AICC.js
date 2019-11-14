// @flow
import Scorm12API from './Scorm12API';
import {
  CMI,
  CMIEvaluationCommentsObject,
  CMITriesObject,
  NAV,
} from './cmi/aicc_cmi';

/**
 * The AICC API class
 */
export default class AICC extends Scorm12API {
  /**
   * Constructor to create AICC API object
   */
  constructor() {
    super();

    this.cmi = new CMI(this);
    this.nav = new NAV(this);
  }

  /**
   * Gets or builds a new child element to add to the array.
   *
   * @param {string} CMIElement
   * @param {any} value
   * @param {boolean} foundFirstIndex
   * @return {object}
   */
  getChildElement(CMIElement, value, foundFirstIndex) {
    let newChild = super.getChildElement(CMIElement, value, foundFirstIndex);

    if (!newChild) {
      if (this.stringMatches(CMIElement, 'cmi\\.evaluation\\.comments\\.\\d')) {
        newChild = new CMIEvaluationCommentsObject(this);
      } else if (this.stringMatches(CMIElement, 'cmi\\.student_data\\.tries\\.\\d')) {
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
