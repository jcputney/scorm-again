import { BaseCMI } from "../common/base_cmi";
import { checkAICCValidFormat } from "./validation";
import { CMIArray } from "../common/array";
import { aicc_regex } from "../../constants/regex";
import { aicc_constants } from "../../constants/api_constants";

/**
 * Class representing the AICC `cmi.paths` object
 */
export class CMIPaths extends CMIArray {
  /**
   * Constructor for inline Paths Array class
   */
  constructor() {
    super({
      children: aicc_constants.paths_children,
    });
  }
}

/**
 * Class for AICC Paths
 */
export class CMIPathsObject extends BaseCMI {
  private _location_id = "";
  private _date = "";
  private _time = "";
  private _status = "";
  private _why_left = "";
  private _time_in_element = "";

  /**
   * Constructor for AICC Paths objects
   */
  constructor() {
    super();
  }

  /**
   * Called when the API has been reset
   */
  reset(): void {
    this._initialized = false;

    this._location_id = "";
    this._date = "";
    this._time = "";
    this._status = "";
    this._why_left = "";
    this._time_in_element = "";
  }

  /**
   * Getter for _location_id
   * @return {string}
   */
  get location_id(): string {
    return this._location_id;
  }

  /**
   * Setter for _location_id
   * @param {string} location_id
   */
  set location_id(location_id: string) {
    if (checkAICCValidFormat(location_id, aicc_regex.CMIString256)) {
      this._location_id = location_id;
    }
  }

  /**
   * Getter for _date
   * @return {string}
   */
  get date(): string {
    return this._date;
  }

  /**
   * Setter for _date
   * @param {string} date
   */
  set date(date: string) {
    if (checkAICCValidFormat(date, aicc_regex.CMIString256)) {
      this._date = date;
    }
  }

  /**
   * Getter for _time
   * @return {string}
   */
  get time(): string {
    return this._time;
  }

  /**
   * Setter for _time
   * @param {string} time
   */
  set time(time: string) {
    if (checkAICCValidFormat(time, aicc_regex.CMITime)) {
      this._time = time;
    }
  }

  /**
   * Getter for _status
   * @return {string}
   */
  get status(): string {
    return this._status;
  }

  /**
   * Setter for _status
   * @param {string} status
   */
  set status(status: string) {
    if (checkAICCValidFormat(status, aicc_regex.CMIStatus2)) {
      this._status = status;
    }
  }

  /**
   * Getter for _why_left
   * @return {string}
   */
  get why_left(): string {
    return this._why_left;
  }

  /**
   * Setter for _why_left
   * @param {string} why_left
   */
  set why_left(why_left: string) {
    if (checkAICCValidFormat(why_left, aicc_regex.CMIString256)) {
      this._why_left = why_left;
    }
  }

  /**
   * Getter for _time_in_element
   * @return {string}
   */
  get time_in_element(): string {
    return this._time_in_element;
  }

  /**
   * Setter for _time_in_element
   * @param {string} time_in_element
   */
  set time_in_element(time_in_element: string) {
    if (checkAICCValidFormat(time_in_element, aicc_regex.CMITime)) {
      this._time_in_element = time_in_element;
    }
  }

  /**
   * toJSON for cmi.paths.n object
   * @return {
   *    {
   *      location_id: string,
   *      date: string,
   *      time: string,
   *      status: string,
   *      why_left: string,
   *      time_in_element: string
   *    }
   *  }
   */
  toJSON(): {
    location_id: string;
    date: string;
    time: string;
    status: string;
    why_left: string;
    time_in_element: string;
  } {
    this.jsonString = true;
    const result = {
      location_id: this.location_id,
      date: this.date,
      time: this.time,
      status: this.status,
      why_left: this.why_left,
      time_in_element: this.time_in_element,
    };
    delete this.jsonString;
    return result;
  }
}
