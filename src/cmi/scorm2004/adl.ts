import {BaseCMI} from "../common/base_cmi";
import {Scorm2004ValidationError} from "../../exceptions";
import ErrorCodes from "../../constants/error_codes";
import {check2004ValidFormat} from "./validation";
import Regex from "../../constants/regex";

/**
 * Class representing SCORM 2004's adl object
 */
export class ADL extends BaseCMI {
  /**
   * Constructor for adl
   */
  constructor() {
    super();
    this.nav = new ADLNav();
  }

  public nav: ADLNav;

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.nav?.initialize();
  }

  /**
   * toJSON for adl
   * @return {
   *    {
   *      nav: ADLNav
   *    }
   *  }
   */
  toJSON(): {
    nav: ADLNav;
  } {
    this.jsonString = true;
    const result = {
      nav: this.nav,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing SCORM 2004's `adl.nav` object
 */

class ADLNav extends BaseCMI {
  private _request = "_none_";

  /**
   * Constructor for `adl.nav`
   */
  constructor() {
    super();
    this.request_valid = new ADLNavRequestValid();
  }

  public request_valid: ADLNavRequestValid;

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize() {
    super.initialize();
    this.request_valid?.initialize();
  }

  /**
   * Getter for _request
   * @return {string}
   */
  get request(): string {
    return this._request;
  }

  /**
   * Setter for _request
   * @param {string} request
   */
  set request(request: string) {
    if (check2004ValidFormat(request, Regex.scorm2004.NAVEvent)) {
      this._request = request;
    }
  }

  /**
   * toJSON for adl.nav
   *
   * @return {
   *    {
   *      request: string
   *    }
   *  }
   */
  toJSON(): {
    request: string;
  } {
    this.jsonString = true;
    const result = {
      request: this.request,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing SCORM 2004's adl.nav.request_valid object
 */

class ADLNavRequestValid extends BaseCMI {
  private _continue = "unknown";
  private _previous = "unknown";
  choice = class {
    /**
     * Check if target is valid
     * @param {string} _target
     * @return {string}
     */
    _isTargetValid = (_target: string): string => "unknown";
  };
  jump = class {
    /**
     * Check if target is valid
     * @param {string} _target
     * @return {string}
     */
    _isTargetValid = (_target: string): string => "unknown";
  };

  /**
   * Constructor for adl.nav.request_valid
   */
  constructor() {
    super();
  }

  /**
   * Getter for _continue
   * @return {string}
   */
  get continue(): string {
    return this._continue;
  }

  /**
   * Setter for _continue. Just throws an error.
   * @param {string} _continue
   */
  set continue(_continue: string) {
    throw new Scorm2004ValidationError(ErrorCodes.scorm2004.READ_ONLY_ELEMENT);
  }

  /**
   * Getter for _previous
   * @return {string}
   */
  get previous(): string {
    return this._previous;
  }

  /**
   * Setter for _previous. Just throws an error.
   * @param {string} _previous
   */
  set previous(_previous: string) {
    throw new Scorm2004ValidationError(ErrorCodes.scorm2004.READ_ONLY_ELEMENT);
  }

  /**
   * toJSON for adl.nav.request_valid
   *
   * @return {
   *    {
   *      previous: string,
   *      continue: string
   *    }
   *  }
   */
  toJSON(): {
    previous: string;
    continue: string;
  } {
    this.jsonString = true;
    const result = {
      previous: this._previous,
      continue: this.continue,
    };
    delete this.jsonString;
    return result;
  }
}