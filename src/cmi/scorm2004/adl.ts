import { BaseCMI } from "../common/base_cmi";
import { Scorm2004ValidationError } from "../../exceptions/scorm2004_exceptions";
import { check2004ValidFormat } from "./validation";
import { scorm2004_regex } from "../../constants/regex";
import { NAVBoolean } from "../../constants/enums";
import { CMIArray } from "../common/array";
import { scorm2004_constants } from "../../constants/api_constants";
import { scorm2004_errors } from "../../constants/error_codes";

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
    this.data = new ADLData();
  }

  public nav: ADLNav;
  public data = new ADLData();

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  override initialize() {
    super.initialize();
    this.nav?.initialize();
  }

  /**
   * Called when the API needs to be reset
   */
  reset() {
    this._initialized = false;
    this.nav?.reset();
  }

  /**
   * toJSON for adl
   * @return {
   *    {
   *      nav: ADLNav,
   *      data: ADLData
   *    }
   *  }
   */
  toJSON(): {
    nav: ADLNav;
    data: ADLData;
  } {
    this.jsonString = true;
    const result = {
      nav: this.nav,
      data: this.data,
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
   * Called when the API needs to be reset
   */
  reset() {
    this._initialized = false;
    this._request = "_none_";
    this.request_valid?.reset();
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
    if (check2004ValidFormat(request, scorm2004_regex.NAVEvent)) {
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
 * Class representing SCORM 2004's `adl.data` object
 */
export class ADLData extends CMIArray {
  constructor() {
    super({
      children: scorm2004_constants.adl_data_children,
      errorCode: scorm2004_errors.READ_ONLY_ELEMENT as number,
      errorClass: Scorm2004ValidationError,
    });
  }
}

/**
 * Class for SCORM 2004's adl.data.n object
 */
export class ADLDataObject extends BaseCMI {
  private _id = "";
  private _store = "";

  constructor() {
    super();
  }

  /**
   * Called when the API has been reset
   */
  reset() {
    this._initialized = false;
  }

  /**
   * Getter for _id
   * @return {string}
   */
  get id(): string {
    return this._id;
  }

  /**
   * Setter for _id
   * @param {string} id
   */
  set id(id: string) {
    if (check2004ValidFormat(id, scorm2004_regex.CMILongIdentifier)) {
      this._id = id;
    }
  }

  /**
   * Getter for _store
   * @return {string}
   */
  get store(): string {
    return this._store;
  }

  /**
   * Setter for _store
   * @param {string} store
   */
  set store(store: string) {
    if (check2004ValidFormat(store, scorm2004_regex.CMILangString4000)) {
      this._store = store;
    }
  }

  /**
   * toJSON for adl.data.n
   *
   * @return {
   *    {
   *      id: string,
   *      store: string
   *    }
   *  }
   */
  toJSON(): {
    id: string;
    store: string;
  } {
    this.jsonString = true;
    const result = {
      id: this._id,
      store: this._store,
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
   * Called when the API has been reset
   */
  override reset() {
    this._initialized = false;
    this._continue = "unknown";
    this._previous = "unknown";
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
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    }
    if (check2004ValidFormat(_continue, scorm2004_regex.NAVBoolean)) {
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
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    }
    if (check2004ValidFormat(_previous, scorm2004_regex.NAVBoolean)) {
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
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    }
    if (typeof choice !== "object") {
      throw new Scorm2004ValidationError(
        scorm2004_errors.TYPE_MISMATCH as number,
      );
    }
    for (const key in choice) {
      if ({}.hasOwnProperty.call(choice, key)) {
        if (
          choice[key] !== undefined &&
          check2004ValidFormat(choice[key], scorm2004_regex.NAVBoolean) &&
          check2004ValidFormat(key, scorm2004_regex.NAVTarget)
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
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    }
    if (typeof jump !== "object") {
      throw new Scorm2004ValidationError(
        scorm2004_errors.TYPE_MISMATCH as number,
      );
    }
    for (const key in jump) {
      if ({}.hasOwnProperty.call(jump, key)) {
        if (
          jump[key] !== undefined &&
          check2004ValidFormat(jump[key], scorm2004_regex.NAVBoolean) &&
          check2004ValidFormat(key, scorm2004_regex.NAVTarget)
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
