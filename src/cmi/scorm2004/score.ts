/**
 * Class for SCORM 2004's cmi *.score object
 */
import { CMIScore } from "../common/score";
import APIConstants from "../../constants/api_constants";
import ErrorCodes from "../../constants/error_codes";
import Regex from "../../constants/regex";
import { Scorm2004ValidationError } from "../../exceptions";
import { check2004ValidFormat, check2004ValidRange } from "./validation";

export class Scorm2004CMIScore extends CMIScore {
  private _scaled = "";

  /**
   * Constructor for cmi *.score
   */
  constructor() {
    super({
      score_children: APIConstants.scorm2004.score_children,
      max: "",
      invalidErrorCode: ErrorCodes.scorm2004.READ_ONLY_ELEMENT,
      invalidTypeCode: ErrorCodes.scorm2004.TYPE_MISMATCH,
      invalidRangeCode: ErrorCodes.scorm2004.VALUE_OUT_OF_RANGE,
      decimalRegex: Regex.scorm2004.CMIDecimal,
      errorClass: Scorm2004ValidationError,
    });
  }

  /**
   * Getter for _scaled
   * @return {string}
   */
  get scaled(): string {
    return this._scaled;
  }

  /**
   * Setter for _scaled
   * @param {string} scaled
   */
  set scaled(scaled: string) {
    if (
      check2004ValidFormat(scaled, Regex.scorm2004.CMIDecimal) &&
      check2004ValidRange(scaled, Regex.scorm2004.scaled_range)
    ) {
      this._scaled = scaled;
    }
  }

  /**
   * toJSON for cmi *.score
   *
   * @return {
   *    {
   *      scaled: string,
   *      raw: string,
   *      min: string,
   *      max: string
   *    }
   *  }
   */
  override toJSON(): {
    scaled: string;
    raw: string;
    min: string;
    max: string;
  } {
    this.jsonString = true;
    const result = {
      scaled: this.scaled,
      raw: this.raw,
      min: this.min,
      max: this.max,
    };
    delete this.jsonString;
    return result;
  }
}
