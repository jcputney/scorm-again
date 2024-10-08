import { AICCValidationError } from "../../exceptions";
import ErrorCodes from "../../constants/error_codes";
import APIConstants from "../../constants/api_constants";
import { CMITries } from "./tries";
import { CMIStudentData } from "../scorm12/student_data";
import { CMIAttemptRecords } from "./attempts";

/**
 * StudentData class for AICC
 */
export class AICCCMIStudentData extends CMIStudentData {
  /**
   * Constructor for AICC StudentData object
   */
  constructor() {
    super(APIConstants.aicc.student_data_children);
    this.tries = new CMITries();
    this.attempt_records = new CMIAttemptRecords();
  }

  public tries: CMITries;
  public attempt_records: CMIAttemptRecords;

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.tries?.initialize();
    this.attempt_records?.initialize();
  }

  private _tries_during_lesson = "";

  /**
   * Getter for tries_during_lesson
   * @return {string}
   */
  get tries_during_lesson(): string {
    return this._tries_during_lesson;
  }

  /**
   * Setter for _tries_during_lesson. Sets an error if trying to set after
   *  initialization.
   * @param {string} tries_during_lesson
   */
  set tries_during_lesson(tries_during_lesson: string) {
    if (this.initialized) {
      throw new AICCValidationError(ErrorCodes.scorm12.READ_ONLY_ELEMENT);
    } else {
      this._tries_during_lesson = tries_during_lesson;
    }
  }

  /**
   * toJSON for cmi.student_data object
   * @return {
   *    {
   *      mastery_score: string,
   *      max_time_allowed: string,
   *      time_limit_action: string,
   *      tries: CMITries,
   *      attempt_records: CMIAttemptRecords
   *    }
   *  }
   */
  toJSON(): {
    mastery_score: string;
    max_time_allowed: string;
    time_limit_action: string;
    tries: CMITries;
    attempt_records: CMIAttemptRecords;
  } {
    this.jsonString = true;
    const result = {
      mastery_score: this.mastery_score,
      max_time_allowed: this.max_time_allowed,
      time_limit_action: this.time_limit_action,
      tries: this.tries,
      attempt_records: this.attempt_records,
    };
    delete this.jsonString;
    return result;
  }
}
