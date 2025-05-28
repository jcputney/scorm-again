import { BaseCMI } from "../common/base_cmi";
import { scorm12_constants } from "../../constants/api_constants";
import { Scorm12ValidationError } from "../../exceptions/scorm12_exceptions";
import { check12ValidFormat, check12ValidRange } from "./validation";
import { scorm12_regex } from "../../constants/regex";
import { scorm12_errors } from "../../constants/error_codes";

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
    super();
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
    if (
      check12ValidFormat(audio, scorm12_regex.CMISInteger) &&
      check12ValidRange(audio, scorm12_regex.audio_range)
    ) {
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
    if (check12ValidFormat(language, scorm12_regex.CMIString256)) {
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
    if (
      check12ValidFormat(speed, scorm12_regex.CMISInteger) &&
      check12ValidRange(speed, scorm12_regex.speed_range)
    ) {
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
    if (
      check12ValidFormat(text, scorm12_regex.CMISInteger) &&
      check12ValidRange(text, scorm12_regex.text_range)
    ) {
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
    delete this.jsonString;
    return result;
  }
}
