// @flow
import Scorm12API from './Scorm12API';
import {
  CMI,
  CMIAttemptRecordsObject,
  CMIEvaluationCommentsObject,
  CMITriesObject,
} from './cmi/aicc_cmi';
import {NAV} from './cmi/scorm12_cmi';

/**
 * The AICC API class
 */
export default class AICC extends Scorm12API {
  /**
   * Constructor to create AICC API object
   * @param {object} settings
   */
  constructor(settings: {}) {
    const finalSettings = {
      ...{
        mastery_override: false,
      }, ...settings,
    };

    super(finalSettings);

    this.cmi = new CMI();
    this.nav = new NAV();
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
      if (this.stringMatches(CMIElement, 'cmi\\.evaluation\\.comments\\.\\d+')) {
        newChild = new CMIEvaluationCommentsObject();
      } else if (this.stringMatches(CMIElement,
          'cmi\\.student_data\\.tries\\.\\d+')) {
        newChild = new CMITriesObject();
      } else if (this.stringMatches(CMIElement,
          'cmi\\.student_data\\.attempt_records\\.\\d+')) {
        newChild = new CMIAttemptRecordsObject();
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
