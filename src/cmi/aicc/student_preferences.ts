import { CMIArray } from "../common/array";
import { AICCValidationError } from "../../exceptions/aicc_exceptions";
import { checkAICCValidFormat } from "./validation";
import { scorm12_errors } from "../../constants/error_codes";
import { aicc_regex } from "../../constants/regex";
import { aicc_constants } from "../../constants/api_constants";
import { CMIStudentPreference } from "../scorm12/student_preference";

/**
 * StudentPreferences class for AICC
 */
export class AICCStudentPreferences extends CMIStudentPreference {
  /**
   * Constructor for AICC Student Preferences object
   */
  constructor() {
    super(aicc_constants.student_preference_children);
    this.windows = new CMIArray({
      errorCode: scorm12_errors.INVALID_SET_VALUE as number,
      errorClass: AICCValidationError,
      children: "",
    });
  }

  public windows: CMIArray;

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  override initialize() {
    super.initialize();
    this.windows?.initialize();
  }

  private _lesson_type = "";
  private _text_color = "";
  private _text_location = "";
  private _text_size = "";
  private _video = "";

  /**
   * Getter for _lesson_type
   * @return {string}
   */
  get lesson_type(): string {
    return this._lesson_type;
  }

  /**
   * Setter for _lesson_type
   * @param {string} lesson_type
   */
  set lesson_type(lesson_type: string) {
    if (checkAICCValidFormat(lesson_type, aicc_regex.CMIString256)) {
      this._lesson_type = lesson_type;
    }
  }

  /**
   * Getter for _text_color
   * @return {string}
   */
  get text_color(): string {
    return this._text_color;
  }

  /**
   * Setter for _text_color
   * @param {string} text_color
   */
  set text_color(text_color: string) {
    if (checkAICCValidFormat(text_color, aicc_regex.CMIString256)) {
      this._text_color = text_color;
    }
  }

  /**
   * Getter for _text_location
   * @return {string}
   */
  get text_location(): string {
    return this._text_location;
  }

  /**
   * Setter for _text_location
   * @param {string} text_location
   */
  set text_location(text_location: string) {
    if (checkAICCValidFormat(text_location, aicc_regex.CMIString256)) {
      this._text_location = text_location;
    }
  }

  /**
   * Getter for _text_size
   * @return {string}
   */
  get text_size(): string {
    return this._text_size;
  }

  /**
   * Setter for _text_size
   * @param {string} text_size
   */
  set text_size(text_size: string) {
    if (checkAICCValidFormat(text_size, aicc_regex.CMIString256)) {
      this._text_size = text_size;
    }
  }

  /**
   * Getter for _video
   * @return {string}
   */
  get video(): string {
    return this._video;
  }

  /**
   * Setter for _video
   * @param {string} video
   */
  set video(video: string) {
    if (checkAICCValidFormat(video, aicc_regex.CMIString256)) {
      this._video = video;
    }
  }

  /**
   * toJSON for cmi.student_preference
   *
   * @return {
   *    {
   *      audio: string,
   *      language: string,
   *      speed: string,
   *      text: string,
   *      text_color: string,
   *      text_location: string,
   *      text_size: string,
   *      video: string,
   *      windows: CMIArray
   *    }
   *  }
   */
  override toJSON(): {
    audio: string;
    language: string;
    lesson_type: string;
    speed: string;
    text: string;
    text_color: string;
    text_location: string;
    text_size: string;
    video: string;
    windows: CMIArray;
  } {
    this.jsonString = true;
    const result = {
      audio: this.audio,
      language: this.language,
      lesson_type: this.lesson_type,
      speed: this.speed,
      text: this.text,
      text_color: this.text_color,
      text_location: this.text_location,
      text_size: this.text_size,
      video: this.video,
      windows: this.windows,
    };
    delete this.jsonString;
    return result;
  }
}
