/**
 * Class for SCORM 2004's cmi *.score object
 */
import { CMIScore } from "../common/score";
import { scorm2004_constants } from "../../constants/api_constants";
import { scorm2004_errors } from "../../constants/error_codes";
import { scorm2004_regex } from "../../constants/regex";
import { Scorm2004ValidationError } from "../../exceptions/scorm2004_exceptions";
import { check2004ValidFormat, check2004ValidRange } from "./validation";
import { ScoreObject } from "../../types/api_types";

export class Scorm2004CMIScore extends CMIScore {
  private _scaled = "";

  /**
   * Constructor for cmi *.score
   */
  constructor() {
    super({
      CMIElement: "cmi.score",
      score_children: scorm2004_constants.score_children,
      max: "",
      invalidErrorCode: scorm2004_errors.READ_ONLY_ELEMENT as number,
      invalidTypeCode: scorm2004_errors.TYPE_MISMATCH as number,
      invalidRangeCode: scorm2004_errors.VALUE_OUT_OF_RANGE as number,
      decimalRegex: scorm2004_regex.CMIDecimal,
      errorClass: Scorm2004ValidationError,
    });
  }

  /**
   * Called when the API has been reset
   */
  override reset(): void {
    this._initialized = false;
    this._scaled = "";
    this._raw = "";
    this._min = "";
    this._max = "";
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
      check2004ValidFormat(this._cmi_element + ".scaled", scaled, scorm2004_regex.CMIDecimal) &&
      check2004ValidRange(this._cmi_element + ".scaled", scaled, scorm2004_regex.scaled_range)
    ) {
      this._scaled = scaled;
    }
  }

  override getScoreObject(): ScoreObject {
    const scoreObject = super.getScoreObject();

    if (!Number.isNaN(Number.parseFloat(this.scaled))) {
      scoreObject.scaled = Number.parseFloat(this.scaled);
    }

    return scoreObject;
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
    this.jsonString = false;
    return result;
  }
}
