import { BaseCMI } from "../common/base_cmi";
import { check12ValidFormat } from "./validation";
import { scorm12_regex } from "../../constants/regex";

/**
 * Class for SCORM 1.2 Navigation object
 *
 * @spec NON-STANDARD EXTENSION - cmi.nav is not part of the official SCORM 1.2 specification.
 * This is a common extension supported by some LMS implementations to provide
 * navigation control. It is not guaranteed to work across all SCORM 1.2 platforms.
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
   *
   * This method is invoked during the following session lifecycle events:
   * - When the API is reset via LMSFinish() followed by a new LMSInitialize()
   * - Between SCO transitions in multi-SCO courses (when one SCO ends and another begins)
   * - When the LMS explicitly resets the API instance
   * - During API cleanup and reinitialization cycles
   *
   * Resets all navigation state to prepare for a new session.
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
      check12ValidFormat(this._cmi_element + ".event", event, scorm12_regex.NAVEvent)
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
    this.jsonString = false;
    return result;
  }
}
