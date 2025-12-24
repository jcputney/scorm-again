import { CMIArray } from "../common/array";
import { BaseCMI } from "../common/base_cmi";
import { Scorm2004ValidationError } from "../../exceptions/scorm2004_exceptions";
import { Scorm2004CMIScore } from "./score";
import { check2004ValidFormat, check2004ValidRange } from "./validation";
import {
  scorm2004_constants,
  scorm2004_errors,
  scorm2004_regex,
} from "../../constants";

/**
 * Class representing SCORM 2004's `cmi.objectives` object
 *
 * Per SCORM 2004 RTE Section 4.1.5:
 * - Enhanced objectives with separate success and completion tracking
 * - Supports global objectives for cross-SCO state sharing
 * - progress_measure: Decimal (0-1) indicating objective completion
 * - description: LangString250 with optional language tag
 * - Objectives can be mapped to sequencing objectives via manifest
 * - Global objectives persist across SCO sessions
 *
 * @spec RTE 4.2.6 - cmi.objectives
 * @extends CMIArray
 */
export class CMIObjectives extends CMIArray {
  /**
   * Constructor for `cmi.objectives` Array
   */
  constructor() {
    super({
      CMIElement: "cmi.objectives",
      children: scorm2004_constants.objectives_children,
      errorCode: scorm2004_errors.READ_ONLY_ELEMENT as number,
      errorClass: Scorm2004ValidationError,
    });
  }

  /**
   * Find an objective by its ID
   */
  public findObjectiveById(id: string): CMIObjectivesObject | undefined {
    return (this.childArray as CMIObjectivesObject[]).find(
      (objective) => objective.id === id,
    );
  }

  /**
   * Find objective by its index
   */
  public findObjectiveByIndex(index: number): CMIObjectivesObject | undefined {
    return (this.childArray as CMIObjectivesObject[])[index];
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
 *
 * Per SCORM 2004 RTE Section 4.1.5:
 * - id: Long identifier (up to 4000 chars, supports URN format)
 * - success_status: Separate from completion (passed, failed, unknown)
 * - completion_status: Completion state (completed, incomplete, not attempted, unknown)
 * - progress_measure: Decimal (0-1) for objective completion percentage
 * - description: LangString250 with optional language tag
 * - score: Scaled score (-1 to 1) and raw/min/max values
 * - Dependency: id must be set before other elements
 * - Global objectives: Persist across SCOs when mapped via manifest
 *
 * @spec RTE 4.2.6.1 - cmi.objectives.n.id
 * @spec RTE 4.2.6.2 - cmi.objectives.n.score
 * @spec RTE 4.2.6.3 - cmi.objectives.n.success_status
 * @spec RTE 4.2.6.4 - cmi.objectives.n.completion_status
 * @spec RTE 4.2.6.5 - cmi.objectives.n.progress_measure
 * @spec RTE 4.2.6.6 - cmi.objectives.n.description
 * @extends BaseCMI
 */
export class CMIObjectivesObject extends BaseCMI {
  private _id = "";
  private _idIsSet = false;
  private _success_status = "unknown";
  private _completion_status = "unknown";
  private _progress_measure = "";
  private _description = "";

  /**
   * Constructor for cmi.objectives.n
   */
  constructor() {
    super("cmi.objectives.n");
    this.score = new Scorm2004CMIScore();
  }

  override reset() {
    this._initialized = false;
    this._id = "";
    this._idIsSet = false;
    this._success_status = "unknown";
    this._completion_status = "unknown";
    this._progress_measure = "";
    this._description = "";
    this.score?.reset();
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
   * Per SCORM 2004 RTE: identifier SHALL NOT be empty or contain only whitespace
   * Per SCORM 2004 RTE Section 4.1.5: Once set, an objective ID is immutable (error 351)
   * @param {string} id
   */
  set id(id: string) {
    // Per spec: identifier cannot be empty or whitespace-only
    if (id === "" || id.trim() === "") {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".id",
        scorm2004_errors.TYPE_MISMATCH as number,
      );
    }
    // Per SCORM 2004 RTE: Once an objective ID is set, it cannot be changed
    if (this._idIsSet && this._id !== id) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".id",
        scorm2004_errors.GENERAL_SET_FAILURE as number,
      );
    }
    if (check2004ValidFormat(this._cmi_element + ".id", id, scorm2004_regex.CMILongIdentifier)) {
      this._id = id;
      this._idIsSet = true;
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
        this._cmi_element + ".success_status",
        scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED as number,
      );
    } else {
      if (
        check2004ValidFormat(
          this._cmi_element + ".success_status",
          success_status,
          scorm2004_regex.CMISStatus,
        )
      ) {
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
        this._cmi_element + ".completion_status",
        scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED as number,
      );
    } else {
      if (
        check2004ValidFormat(
          this._cmi_element + ".completion_status",
          completion_status,
          scorm2004_regex.CMICStatus,
        )
      ) {
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
        this._cmi_element + ".progress_measure",
        scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED as number,
      );
    } else {
      if (
        check2004ValidFormat(
          this._cmi_element + ".progress_measure",
          progress_measure,
          scorm2004_regex.CMIDecimal,
        ) &&
        check2004ValidRange(
          this._cmi_element + ".progress_measure",
          progress_measure,
          scorm2004_regex.progress_range,
        )
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
        this._cmi_element + ".description",
        scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED as number,
      );
    } else {
      if (
        check2004ValidFormat(
          this._cmi_element + ".description",
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
    this.jsonString = false;
    return result;
  }

  /**
   * Populate this objective from a plain object
   * @param {any} data
   */
  fromJSON(data: any): void {
    if (!data || typeof data !== "object") return;
    if (typeof data.id === "string") this.id = data.id;
    if (typeof data.success_status === "string") this.success_status = data.success_status;
    if (typeof data.completion_status === "string") this.completion_status = data.completion_status;
    if (typeof data.progress_measure !== "undefined") this.progress_measure = String(data.progress_measure);
    if (typeof data.description === "string") this.description = data.description;
    if (data.score && typeof data.score === "object") {
      if (typeof data.score.scaled !== "undefined") this.score.scaled = String(data.score.scaled);
      if (typeof data.score.raw !== "undefined") this.score.raw = String(data.score.raw);
      if (typeof data.score.min !== "undefined") this.score.min = String(data.score.min);
      if (typeof data.score.max !== "undefined") this.score.max = String(data.score.max);
    }
  }
}
