import { BaseCMI } from "../common/base_cmi";
import { Scorm2004ValidationError } from "../../exceptions";
import ErrorCodes from "../../constants/error_codes";
import { check2004ValidFormat } from "./validation";
import Regex from "../../constants/regex";
import { NAVBoolean } from "../../constants/enums";

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
  override initialize() {
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

export class ADLNav extends BaseCMI {
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
  override initialize() {
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

export class ADLNavRequestValid extends BaseCMI {
  private _continue = "unknown";
  private _previous = "unknown";
  private _choice: {
    [key: string]: NAVBoolean;
  } = {};
  private _jump: {
    [key: string]: NAVBoolean;
  } = {};

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
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        ErrorCodes.scorm2004.READ_ONLY_ELEMENT,
      );
    }
    if (check2004ValidFormat(_continue, Regex.scorm2004.NAVBoolean)) {
      this._continue = _continue;
    }
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
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        ErrorCodes.scorm2004.READ_ONLY_ELEMENT,
      );
    }
    if (check2004ValidFormat(_previous, Regex.scorm2004.NAVBoolean)) {
      this._previous = _previous;
    }
  }

  /**
   * Getter for _choice
   * @return {{ [key: string]: NAVBoolean }}
   */
  get choice(): { [key: string]: NAVBoolean } {
    return this._choice;
  }

  /**
   * Setter for _choice
   * @param {{ [key: string]: string }} choice
   */
  set choice(choice: { [key: string]: string }) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        ErrorCodes.scorm2004.READ_ONLY_ELEMENT,
      );
    }
    if (typeof choice !== "object") {
      throw new Scorm2004ValidationError(ErrorCodes.scorm2004.TYPE_MISMATCH);
    }
    for (const key in choice) {
      if ({}.hasOwnProperty.call(choice, key)) {
        if (
          check2004ValidFormat(choice[key], Regex.scorm2004.NAVBoolean) &&
          check2004ValidFormat(key, Regex.scorm2004.NAVTarget)
        ) {
          this._choice[key] =
            NAVBoolean[choice[key] as keyof typeof NAVBoolean];
        }
      }
    }
  }

  /**
   * Getter for _jump
   * @return {{ [key: string]: NAVBoolean }}
   */
  get jump(): { [key: string]: NAVBoolean } {
    return this._jump;
  }

  /**
   * Setter for _jump
   * @param {{ [key: string]: string }} jump
   */
  set jump(jump: { [key: string]: string }) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        ErrorCodes.scorm2004.READ_ONLY_ELEMENT,
      );
    }
    if (typeof jump !== "object") {
      throw new Scorm2004ValidationError(ErrorCodes.scorm2004.TYPE_MISMATCH);
    }
    for (const key in jump) {
      if ({}.hasOwnProperty.call(jump, key)) {
        if (
          check2004ValidFormat(jump[key], Regex.scorm2004.NAVBoolean) &&
          check2004ValidFormat(key, Regex.scorm2004.NAVTarget)
        ) {
          this._jump[key] = NAVBoolean[jump[key] as keyof typeof NAVBoolean];
        }
      }
    }
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
      continue: this._continue,
      choice: this._choice,
      jump: this._jump,
    };
    delete this.jsonString;
    return result;
  }
}
