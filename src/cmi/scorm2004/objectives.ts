import { CMIArray } from "../common/array";
import APIConstants from "../../constants/api_constants";
import ErrorCodes from "../../constants/error_codes";
import { Scorm2004ValidationError } from "../../exceptions";
import { BaseCMI } from "../common/base_cmi";
import { Scorm2004CMIScore } from "./score";
import { check2004ValidFormat, check2004ValidRange } from "./validation";
import Regex from "../../constants/regex";

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
      children: APIConstants.scorm2004.objectives_children,
      errorCode: ErrorCodes.scorm2004.READ_ONLY_ELEMENT,
      errorClass: Scorm2004ValidationError,
    });
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
    if (check2004ValidFormat(id, Regex.scorm2004.CMILongIdentifier)) {
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
        ErrorCodes.scorm2004.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      if (check2004ValidFormat(success_status, Regex.scorm2004.CMISStatus)) {
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
        ErrorCodes.scorm2004.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      if (check2004ValidFormat(completion_status, Regex.scorm2004.CMICStatus)) {
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
        ErrorCodes.scorm2004.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      if (
        check2004ValidFormat(progress_measure, Regex.scorm2004.CMIDecimal) &&
        check2004ValidRange(progress_measure, Regex.scorm2004.progress_range)
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
        ErrorCodes.scorm2004.DEPENDENCY_NOT_ESTABLISHED,
      );
    } else {
      if (
        check2004ValidFormat(
          description,
          Regex.scorm2004.CMILangString250,
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
