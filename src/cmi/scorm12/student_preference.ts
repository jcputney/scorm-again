import { BaseCMI } from "../common/base_cmi";
import APIConstants from "../../constants/api_constants";
import { Scorm12ValidationError } from "../../exceptions";
import ErrorCodes from "../../constants/error_codes";
import { check12ValidFormat, check12ValidRange } from "./validation";
import Regex from "../../constants/regex";

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
      : APIConstants.scorm12.student_preference_children;
  }

  private _audio = "";
  private _language = "";
  private _speed = "";
  private _text = "";

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
    throw new Scorm12ValidationError(ErrorCodes.scorm12.INVALID_SET_VALUE);
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
      check12ValidFormat(audio, Regex.scorm12.CMISInteger) &&
      check12ValidRange(audio, Regex.scorm12.audio_range)
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
    if (check12ValidFormat(language, Regex.scorm12.CMIString256)) {
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
      check12ValidFormat(speed, Regex.scorm12.CMISInteger) &&
      check12ValidRange(speed, Regex.scorm12.speed_range)
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
      check12ValidFormat(text, Regex.scorm12.CMISInteger) &&
      check12ValidRange(text, Regex.scorm12.text_range)
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
