/**
 * Class representing learner properties for SCORM 2004's cmi object
 */
import { scorm2004_errors } from "../../constants/error_codes";
import { Scorm2004ValidationError } from "../../exceptions/scorm2004_exceptions";
import { BaseCMI } from "../common/base_cmi";

/**
 * Class representing learner properties for SCORM 2004's cmi object
 */
export class CMILearner extends BaseCMI {
  private _learner_id = "";
  private _learner_name = "";

  /**
   * Constructor for CMILearner
   */
  constructor() {
    super("cmi");
  }

  /**
   * Getter for _learner_id
   * @return {string}
   */
  get learner_id(): string {
    return this._learner_id;
  }

  /**
   * Setter for _learner_id. Can only be called before initialization.
   * @param {string} learner_id
   */
  set learner_id(learner_id: string) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".learner_id",
        scorm2004_errors.READ_ONLY_ELEMENT,
      );
    } else {
      this._learner_id = learner_id;
    }
  }

  /**
   * Getter for _learner_name
   * @return {string}
   */
  get learner_name(): string {
    return this._learner_name;
  }

  /**
   * Setter for _learner_name. Can only be called before initialization.
   * @param {string} learner_name
   */
  set learner_name(learner_name: string) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".learner_name",
        scorm2004_errors.READ_ONLY_ELEMENT,
      );
    } else {
      this._learner_name = learner_name;
    }
  }

  /**
   * Reset the learner properties
   */
  reset(): void {
    this._initialized = false;
    // Don't reset learner_id and learner_name as they are read-only after initialization
  }
}
