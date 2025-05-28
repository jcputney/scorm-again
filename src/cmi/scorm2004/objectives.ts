import { CMIArray } from "../common/array";
import { scorm2004_errors } from "../../constants/error_codes";
import { Scorm2004ValidationError } from "../../exceptions/scorm2004_exceptions";
import { BaseCMI } from "../common/base_cmi";
import { Scorm2004CMIScore } from "./score";
import { check2004ValidFormat, check2004ValidRange } from "./validation";
import { scorm2004_regex } from "../../constants/regex";
import { scorm2004_constants } from "../../constants/api_constants";

/**
 * Class representing SCORM 2004's `cmi.objectives` object
 * @extends CMIArray
 */
export class CMIObjectives extends CMIArray {
  /**
   * Constructor for `cmi.objectives` Array
   */
  constructor() {
    super({
      children: scorm2004_constants.objectives_children,
      errorCode: scorm2004_errors.READ_ONLY_ELEMENT as number,
      errorClass: Scorm2004ValidationError,
    });
  }

  /**
   * Find an objective by its ID
   */
  public findObjectiveById(id: string): CMIObjectivesObject | undefined {
    return this.childArray.find((objective) => objective.id === id);
  }

  /**
   * Find objective by its index
   */
  public findObjectiveByIndex(index: number): CMIObjectivesObject {
    return this.childArray[index];
  }

  /**
   * Set an objective at the given index
   */
  public setObjectiveByIndex(index: number, objective: CMIObjectivesObject) {
    this.childArray[index] = objective;
  }
}

/**
 * Class for SCORM 2004's cmi.objectives.n object
 */
export class CMIObjectivesObject extends BaseCMI {
  private _id = "";
  private _success_status = "unknown";
  private _completion_status = "unknown";
  private _progress_measure = "";
  private _description = "";

  /**
   * Constructor for cmi.objectives.n
   */
  constructor() {
    super();
    this.score = new Scorm2004CMIScore();
  }

  override reset() {
    this._initialized = false;
  }

  public score: Scorm2004CMIScore;

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  override initialize() {
    super.initialize();
    this.score?.initialize();
  }

  /**
   * Getter for _id
   * @return {string}
   */
  get id(): string {
    return this._id;
  }

  /**
   * Setter for _id
   * @param {string} id
   */
  set id(id: string) {
    if (check2004ValidFormat(id, scorm2004_regex.CMILongIdentifier)) {
      this._id = id;
    }
  }

  /**
   * Getter for _success_status
   * @return {string}
   */
  get success_status(): string {
    return this._success_status;
  }

  /**
   * Setter for _success_status
   * @param {string} success_status
   */
  set success_status(success_status: string) {
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED as number,
      );
    } else {
      if (check2004ValidFormat(success_status, scorm2004_regex.CMISStatus)) {
        this._success_status = success_status;
      }
    }
  }

  /**
   * Getter for _completion_status
   * @return {string}
   */
  get completion_status(): string {
    return this._completion_status;
  }

  /**
   * Setter for _completion_status
   * @param {string} completion_status
   */
  set completion_status(completion_status: string) {
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED as number,
      );
    } else {
      if (check2004ValidFormat(completion_status, scorm2004_regex.CMICStatus)) {
        this._completion_status = completion_status;
      }
    }
  }

  /**
   * Getter for _progress_measure
   * @return {string}
   */
  get progress_measure(): string {
    return this._progress_measure;
  }

  /**
   * Setter for _progress_measure
   * @param {string} progress_measure
   */
  set progress_measure(progress_measure: string) {
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED as number,
      );
    } else {
      if (
        check2004ValidFormat(progress_measure, scorm2004_regex.CMIDecimal) &&
        check2004ValidRange(progress_measure, scorm2004_regex.progress_range)
      ) {
        this._progress_measure = progress_measure;
      }
    }
  }

  /**
   * Getter for _description
   * @return {string}
   */
  get description(): string {
    return this._description;
  }

  /**
   * Setter for _description
   * @param {string} description
   */
  set description(description: string) {
    if (this.initialized && this._id === "") {
      throw new Scorm2004ValidationError(
        scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED as number,
      );
    } else {
      if (
        check2004ValidFormat(
          description,
          scorm2004_regex.CMILangString250,
          true,
        )
      ) {
        this._description = description;
      }
    }
  }

  /**
   * toJSON for cmi.objectives.n
   *
   * @return {
   *    {
   *      id: string,
   *      success_status: string,
   *      completion_status: string,
   *      progress_measure: string,
   *      description: string,
   *      score: Scorm2004CMIScore
   *    }
   *  }
   */
  toJSON(): {
    id: string;
    success_status: string;
    completion_status: string;
    progress_measure: string;
    description: string;
    score: Scorm2004CMIScore;
  } {
    this.jsonString = true;
    const result = {
      id: this.id,
      success_status: this.success_status,
      completion_status: this.completion_status,
      progress_measure: this.progress_measure,
      description: this.description,
      score: this.score,
    };
    delete this.jsonString;
    return result;
  }
}
