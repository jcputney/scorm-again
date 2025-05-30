import { BaseCMI } from "../common/base_cmi";
import { scorm12_constants } from "../../constants/api_constants";
import { Scorm12ValidationError } from "../../exceptions/scorm12_exceptions";
import { scorm12_errors } from "../../constants/error_codes";
import { validationService } from "../../services/ValidationService";

/**
 * Class representing the SCORM 1.2 cmi.student_preference object
 * @extends BaseCMI
 */
export class CMIStudentPreference extends BaseCMI {
  private readonly __children;

  /**
   * Constructor for cmi.student_preference
   * @param {string} student_preference_children
   */
  constructor(student_preference_children?: string) {
    super("cmi.student_preference");
    this.__children = student_preference_children
      ? student_preference_children
      : scorm12_constants.student_preference_children;
  }

  private _audio = "";
  private _language = "";
  private _speed = "";
  private _text = "";

  /**
   * Called when the API has been reset
   */
  reset(): void {
    this._initialized = false;
  }

  /**
   * Getter for __children
   * @return {string}
   * @private
   */
  get _children(): string {
    return this.__children;
  }

  /**
   * Setter for __children. Just throws an error.
   * @param {string} _children
   * @private
   */
  set _children(_children: string) {
    throw new Scorm12ValidationError(
      this._cmi_element + "._children",
      scorm12_errors.INVALID_SET_VALUE as number,
    );
  }

  /**
   * Getter for _audio
   * @return {string}
   */
  get audio(): string {
    return this._audio;
  }

  /**
   * Setter for _audio
   * @param {string} audio
   */
  set audio(audio: string) {
    if (validationService.validateScorm12Audio(this._cmi_element + ".audio", audio)) {
      this._audio = audio;
    }
  }

  /**
   * Getter for _language
   * @return {string}
   */
  get language(): string {
    return this._language;
  }

  /**
   * Setter for _language
   * @param {string} language
   */
  set language(language: string) {
    if (validationService.validateScorm12Language(this._cmi_element + ".language", language)) {
      this._language = language;
    }
  }

  /**
   * Getter for _speed
   * @return {string}
   */
  get speed(): string {
    return this._speed;
  }

  /**
   * Setter for _speed
   * @param {string} speed
   */
  set speed(speed: string) {
    if (validationService.validateScorm12Speed(this._cmi_element + ".speed", speed)) {
      this._speed = speed;
    }
  }

  /**
   * Getter for _text
   * @return {string}
   */
  get text(): string {
    return this._text;
  }

  /**
   * Setter for _text
   * @param {string} text
   */
  set text(text: string) {
    if (validationService.validateScorm12Text(this._cmi_element + ".text", text)) {
      this._text = text;
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
   *      text: string
   *    }
   *  }
   */
  toJSON(): {
    audio: string;
    language: string;
    speed: string;
    text: string;
  } {
    this.jsonString = true;
    const result = {
      audio: this.audio,
      language: this.language,
      speed: this.speed,
      text: this.text,
    };
    this.jsonString = false;
    return result;
  }
}
