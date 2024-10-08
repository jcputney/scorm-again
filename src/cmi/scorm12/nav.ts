import {BaseCMI} from "../common/base_cmi";
import {check12ValidFormat} from "./validation";
import Regex from "../../constants/regex";

/**
 * Class for AICC Navigation object
 */
export class NAV extends BaseCMI {
  /**
   * Constructor for NAV object
   */
  constructor() {
    super();
  }

  private _event = "";

  /**
   * Getter for _event
   * @return {string}
   */
  get event(): string {
    return this._event;
  }

  /**
   * Setter for _event
   * @param {string} event
   */
  set event(event: string) {
    if (check12ValidFormat(event, Regex.scorm12.NAVEvent)) {
      this._event = event;
    }
  }

  /**
   * toJSON for nav object
   * @return {
   *    {
   *      event: string
   *    }
   *  }
   */
  toJSON(): {
    event: string;
  } {
    this.jsonString = true;
    const result = {
      event: this.event,
    };
    delete this.jsonString;
    return result;
  }
}