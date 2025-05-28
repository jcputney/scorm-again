/**
 * Class for SCORM 2004's cmi.learner_preference object
 */
import { BaseCMI } from "../common/base_cmi";
import { scorm2004_constants } from "../../constants/api_constants";
import { Scorm2004ValidationError } from "../../exceptions/scorm2004_exceptions";
import { scorm2004_errors } from "../../constants/error_codes";
import { check2004ValidFormat, check2004ValidRange } from "./validation";
import { scorm2004_regex } from "../../constants/regex";

export class CMILearnerPreference extends BaseCMI {
  private __children = scorm2004_constants.student_preference_children;
  private _audio_level = "1";
  private _language = "";
  private _delivery_speed = "1";
  private _audio_captioning = "0";

  /**
   * Constructor for cmi.learner_preference
   */
  constructor() {
    super();
  }

  /**
   * Called when the API has been reset
   */
  override reset() {
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
    throw new Scorm2004ValidationError(
      scorm2004_errors.READ_ONLY_ELEMENT as number,
    );
  }

  /**
   * Getter for _audio_level
   * @return {string}
   */
  get audio_level(): string {
    return this._audio_level;
  }

  /**
   * Setter for _audio_level
   * @param {string} audio_level
   */
  set audio_level(audio_level: string) {
    if (
      check2004ValidFormat(audio_level, scorm2004_regex.CMIDecimal) &&
      check2004ValidRange(audio_level, scorm2004_regex.audio_range)
    ) {
      this._audio_level = audio_level;
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
    if (check2004ValidFormat(language, scorm2004_regex.CMILang)) {
      this._language = language;
    }
  }

  /**
   * Getter for _delivery_speed
   * @return {string}
   */
  get delivery_speed(): string {
    return this._delivery_speed;
  }

  /**
   * Setter for _delivery_speed
   * @param {string} delivery_speed
   */
  set delivery_speed(delivery_speed: string) {
    if (
      check2004ValidFormat(delivery_speed, scorm2004_regex.CMIDecimal) &&
      check2004ValidRange(delivery_speed, scorm2004_regex.speed_range)
    ) {
      this._delivery_speed = delivery_speed;
    }
  }

  /**
   * Getter for _audio_captioning
   * @return {string}
   */
  get audio_captioning(): string {
    return this._audio_captioning;
  }

  /**
   * Setter for _audio_captioning
   * @param {string} audio_captioning
   */
  set audio_captioning(audio_captioning: string) {
    if (
      check2004ValidFormat(audio_captioning, scorm2004_regex.CMISInteger) &&
      check2004ValidRange(audio_captioning, scorm2004_regex.text_range)
    ) {
      this._audio_captioning = audio_captioning;
    }
  }

  /**
   * toJSON for cmi.learner_preference
   *
   * @return {
   *    {
   *      audio_level: string,
   *      language: string,
   *      delivery_speed: string,
   *      audio_captioning: string
   *    }
   *  }
   */
  toJSON(): {
    audio_level: string;
    language: string;
    delivery_speed: string;
    audio_captioning: string;
  } {
    this.jsonString = true;
    const result = {
      audio_level: this.audio_level,
      language: this.language,
      delivery_speed: this.delivery_speed,
      audio_captioning: this.audio_captioning,
    };
    delete this.jsonString;
    return result;
  }
}
