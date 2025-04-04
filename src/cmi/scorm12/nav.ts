import { BaseCMI } from "../common/base_cmi";
import { check12ValidFormat } from "./validation";
import { scorm12_regex } from "../../constants/regex";

/**
 * Class for AICC Navigation object
 */
export class NAV extends BaseCMI {
  /**
   * Constructor for NAV object
   */
  constructor() {
    super("cmi.nav");
  }

  /**
   * Called when the API has been reset
   */
  reset(): void {
    this._event = "";
    this._initialized = false;
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
    if (
      event === "" ||
      check12ValidFormat(
        this._cmi_element + ".event",
        event,
        scorm12_regex.NAVEvent,
      )
    ) {
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
