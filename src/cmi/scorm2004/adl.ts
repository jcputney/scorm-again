import { BaseCMI } from "../common/base_cmi";
import { CMIArray } from "../common/array";
import { Scorm2004ValidationError } from "../../exceptions/scorm2004_exceptions";
import { check2004ValidFormat } from "./validation";
import { Sequencing } from "./sequencing/sequencing";
import {
  NAVBoolean,
  scorm2004_constants,
  scorm2004_errors,
  scorm2004_regex,
} from "../../constants";

/**
 * Class representing SCORM 2004's adl object
 */
export class ADL extends BaseCMI {
  /**
   * Constructor for adl
   */
  constructor() {
    super("adl");
    this.nav = new ADLNav();
    this.data = new ADLData();
  }

  public nav: ADLNav;
  public data = new ADLData();
  private _sequencing: Sequencing | null = null;

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
   * Getter for sequencing
   * @return {Sequencing | null}
   */
  get sequencing(): Sequencing | null {
    return this._sequencing;
  }

  /**
   * Setter for sequencing
   * @param {Sequencing | null} sequencing
   */
  set sequencing(sequencing: Sequencing | null) {
    this._sequencing = sequencing;
    if (sequencing) {
      sequencing.adlNav = this.nav;
      this.nav.sequencing = sequencing;
    }
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
    this.jsonString = false;
    return result;
  }
}

/**
 * Class representing SCORM 2004's `adl.nav` object
 * @spec SN 3 - Navigation Data Model
 */

export class ADLNav extends BaseCMI {
  private _request = "_none_";
  private _sequencing: Sequencing | null = null;

  /**
   * Constructor for `adl.nav`
   */
  constructor() {
    super("adl.nav");
    this.request_valid = new ADLNavRequestValid();
    this.request_valid.setParentNav(this);
  }

  public request_valid: ADLNavRequestValid;

  /**
   * Getter for sequencing
   * @return {Sequencing | null}
   */
  get sequencing(): Sequencing | null {
    return this._sequencing;
  }

  /**
   * Setter for sequencing
   * @param {Sequencing | null} sequencing
   */
  set sequencing(sequencing: Sequencing | null) {
    this._sequencing = sequencing;
  }

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
    if (this._sequencing) {
      this._sequencing.adlNav = null;
    }
    this._sequencing = null;
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
    if (check2004ValidFormat(this._cmi_element + ".request", request, scorm2004_regex.NAVEvent)) {
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
    this.jsonString = false;
    return result;
  }
}

/**
 * Class representing SCORM 2004's `adl.data` object
 */
export class ADLData extends CMIArray {
  constructor() {
    super({
      CMIElement: "adl.data",
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
  private _idIsSet = false;
  private _storeIsSet = false;

  constructor() {
    super("adl.data.n");
  }

  /**
   * Called when the API has been reset
   */
  reset() {
    this._initialized = false;
    this._idIsSet = false;
    this._storeIsSet = false;
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
   * Per SCORM 2004 4th Ed: id is read-only after initialization (error 404)
   * @param {string} id
   */
  set id(id: string) {
    // REQ-ADL-015: id is read-only after initialization
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".id",
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    }
    if (check2004ValidFormat(this._cmi_element + ".id", id, scorm2004_regex.CMILongIdentifier)) {
      this._id = id;
      this._idIsSet = true;
    }
  }

  /**
   * Getter for _store
   * Per SCORM 2004 4th Ed: returns error 403 if store not initialized
   * @return {string}
   */
  get store(): string {
    // REQ-ADL-020: GetValue on uninitialized store returns error 403
    if (this.initialized && !this._storeIsSet) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".store",
        scorm2004_errors.VALUE_NOT_INITIALIZED as number,
      );
    }
    return this._store;
  }

  /**
   * Setter for _store
   * Per SCORM 2004 4th Ed: store requires id to be set first (error 408)
   * Per SCORM 2004 4th Ed SPM: store max length is 64000 characters
   * @param {string} store
   */
  set store(store: string) {
    // REQ-ADL-025: Dependency check - id must be set before store
    if (this.initialized && !this._idIsSet) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".store",
        scorm2004_errors.DEPENDENCY_NOT_ESTABLISHED as number,
      );
    }
    // REQ-ADL-017: store SPM is 64000 characters (was incorrectly 4000)
    if (
      check2004ValidFormat(this._cmi_element + ".store", store, scorm2004_regex.CMIString64000)
    ) {
      this._store = store;
      this._storeIsSet = true;
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
    this.jsonString = false;
    return result;
  }
}

/**
 * Helper class for adl.nav.request_valid.choice to support target validation
 */
class ADLNavRequestValidChoice {
  private _parentNav: ADLNav | null = null;
  private _staticValues: { [key: string]: NAVBoolean } = {};

  setParentNav(nav: ADLNav): void {
    this._parentNav = nav;
  }

  /**
   * Validate if a target can be chosen
   * Called by BaseAPI when accessing adl.nav.request_valid.choice.{target=...}
   */
  _isTargetValid(target: string): string {
    // If sequencing is available, evaluate dynamically
    if (this._parentNav?.sequencing?.overallSequencingProcess) {
      const process = this._parentNav.sequencing.overallSequencingProcess;
      if (process.predictChoiceEnabled) {
        const result = process.predictChoiceEnabled(target) ? "true" : "false";
        return result;
      }
    }
    // Fall back to static value if sequencing not available
    const value = this._staticValues[target];
    if (value === NAVBoolean.TRUE) {
      return "true";
    }
    if (value === NAVBoolean.FALSE) {
      return "false";
    }
    return "unknown";
  }

  /**
   * Get all static values
   */
  getAll(): { [key: string]: NAVBoolean } {
    return { ...this._staticValues };
  }

  /**
   * Set static values (used during initialization)
   */
  setAll(values: { [key: string]: NAVBoolean }): void {
    this._staticValues = { ...values };
  }
}

/**
 * Helper class for adl.nav.request_valid.jump to support target validation
 */
class ADLNavRequestValidJump {
  private _parentNav: ADLNav | null = null;
  private _staticValues: { [key: string]: NAVBoolean } = {};

  setParentNav(nav: ADLNav): void {
    this._parentNav = nav;
  }

  /**
   * Validate if a target can be jumped to
   * Called by BaseAPI when accessing adl.nav.request_valid.jump.{target=...}
   */
  _isTargetValid(target: string): string {
    // If sequencing is available, evaluate dynamically
    // Note: Jump validation checks if target exists and is in the tree
    if (this._parentNav?.sequencing?.activityTree) {
      const activity = this._parentNav.sequencing.activityTree.getActivity(target);
      return activity ? "true" : "false";
    }
    // Fall back to static value if sequencing not available
    const value = this._staticValues[target];
    if (value === NAVBoolean.TRUE) return "true";
    if (value === NAVBoolean.FALSE) return "false";
    return "unknown";
  }

  /**
   * Get all static values
   */
  getAll(): { [key: string]: NAVBoolean } {
    return { ...this._staticValues };
  }

  /**
   * Set static values (used during initialization)
   */
  setAll(values: { [key: string]: NAVBoolean }): void {
    this._staticValues = { ...values };
  }
}

/**
 * Class representing SCORM 2004's adl.nav.request_valid object
 * @spec SN 3.1 - Navigation Request Validity Data Model
 */

export class ADLNavRequestValid extends BaseCMI {
  private _continue = "unknown";
  private _previous = "unknown";
  private _choice: ADLNavRequestValidChoice;
  private _jump: ADLNavRequestValidJump;
  private _exit = "unknown";
  private _exitAll = "unknown";
  private _abandon = "unknown";
  private _abandonAll = "unknown";
  private _suspendAll = "unknown";
  private _parentNav: ADLNav | null = null;

  /**
   * Constructor for adl.nav.request_valid
   */
  constructor() {
    super("adl.nav.request_valid");
    this._choice = new ADLNavRequestValidChoice();
    this._jump = new ADLNavRequestValidJump();
  }

  /**
   * Set parent nav reference for sequencing access
   * @param {ADLNav} nav - Parent ADLNav instance
   */
  setParentNav(nav: ADLNav): void {
    this._parentNav = nav;
    this._choice.setParentNav(nav);
    this._jump.setParentNav(nav);
  }

  /**
   * Called when the API has been reset
   */
  override reset() {
    this._initialized = false;
    this._continue = "unknown";
    this._previous = "unknown";
    this._choice.setAll({});
    this._jump.setAll({});
    this._exit = "unknown";
    this._exitAll = "unknown";
    this._abandon = "unknown";
    this._abandonAll = "unknown";
    this._suspendAll = "unknown";
  }

  /**
   * Getter for _continue
   * Dynamically evaluates whether continue navigation is valid using sequencing
   * @return {string}
   */
  get continue(): string {
    // If sequencing is available, evaluate dynamically
    if (this._parentNav?.sequencing?.overallSequencingProcess) {
      const process = this._parentNav.sequencing.overallSequencingProcess;
      if (process.predictContinueEnabled) {
        return process.predictContinueEnabled() ? "true" : "false";
      }
    }
    // Fall back to static value if sequencing not available
    return this._continue;
  }

  /**
   * Setter for _continue. Just throws an error.
   * @param {string} _continue
   */
  set continue(_continue: string) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".continue",
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    }
    if (
      check2004ValidFormat(this._cmi_element + ".continue", _continue, scorm2004_regex.NAVBoolean)
    ) {
      this._continue = _continue;
    }
  }

  /**
   * Getter for _previous
   * Dynamically evaluates whether previous navigation is valid using sequencing
   * @return {string}
   */
  get previous(): string {
    // If sequencing is available, evaluate dynamically
    if (this._parentNav?.sequencing?.overallSequencingProcess) {
      const process = this._parentNav.sequencing.overallSequencingProcess;
      if (process.predictPreviousEnabled) {
        return process.predictPreviousEnabled() ? "true" : "false";
      }
    }
    // Fall back to static value if sequencing not available
    return this._previous;
  }

  /**
   * Setter for _previous. Just throws an error.
   * @param {string} _previous
   */
  set previous(_previous: string) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".previous",
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    }
    if (
      check2004ValidFormat(this._cmi_element + ".previous", _previous, scorm2004_regex.NAVBoolean)
    ) {
      this._previous = _previous;
    }
  }

  /**
   * Getter for _choice
   * @return {ADLNavRequestValidChoice}
   */
  get choice(): ADLNavRequestValidChoice {
    return this._choice;
  }

  /**
   * Setter for _choice
   * @param {{ [key: string]: string }} choice
   */
  set choice(choice: { [key: string]: string }) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".choice",
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    }
    if (typeof choice !== "object") {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".choice",
        scorm2004_errors.TYPE_MISMATCH as number,
      );
    }
    const converted: { [key: string]: NAVBoolean } = {};
    for (const key in choice) {
      if ({}.hasOwnProperty.call(choice, key)) {
        if (
          check2004ValidFormat(
            this._cmi_element + ".choice." + key,
            choice[key] || "",
            scorm2004_regex.NAVBoolean,
          ) &&
          check2004ValidFormat(this._cmi_element + ".choice." + key, key, scorm2004_regex.NAVTarget)
        ) {
          // Convert string value to NAVBoolean enum value
          const value = choice[key];
          if (value === "true") {
            converted[key] = NAVBoolean.TRUE;
          } else if (value === "false") {
            converted[key] = NAVBoolean.FALSE;
          } else if (value === "unknown") {
            converted[key] = NAVBoolean.UNKNOWN;
          }
        }
      }
    }
    this._choice.setAll(converted);
  }

  /**
   * Getter for _jump
   * @return {ADLNavRequestValidJump}
   */
  get jump(): ADLNavRequestValidJump {
    return this._jump;
  }

  /**
   * Setter for _jump
   * @param {{ [key: string]: string }} jump
   */
  set jump(jump: { [key: string]: string }) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".jump",
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    }
    if (typeof jump !== "object") {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".jump",
        scorm2004_errors.TYPE_MISMATCH as number,
      );
    }
    const converted: { [key: string]: NAVBoolean } = {};
    for (const key in jump) {
      if ({}.hasOwnProperty.call(jump, key)) {
        if (
          check2004ValidFormat(
            this._cmi_element + ".jump." + key,
            jump[key] || "",
            scorm2004_regex.NAVBoolean,
          ) &&
          check2004ValidFormat(this._cmi_element + ".jump." + key, key, scorm2004_regex.NAVTarget)
        ) {
          // Convert string value to NAVBoolean enum value
          const value = jump[key];
          if (value === "true") {
            converted[key] = NAVBoolean.TRUE;
          } else if (value === "false") {
            converted[key] = NAVBoolean.FALSE;
          } else if (value === "unknown") {
            converted[key] = NAVBoolean.UNKNOWN;
          }
        }
      }
    }
    this._jump.setAll(converted);
  }

  /**
   * Getter for _exit
   * @return {string}
   */
  get exit(): string {
    return this._exit;
  }

  /**
   * Setter for _exit. Just throws an error.
   * @param {string} _exit
   */
  set exit(_exit: string) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".exit",
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    }
    if (
      check2004ValidFormat(this._cmi_element + ".exit", _exit, scorm2004_regex.NAVBoolean)
    ) {
      this._exit = _exit;
    }
  }

  /**
   * Getter for _exitAll
   * @return {string}
   */
  get exitAll(): string {
    return this._exitAll;
  }

  /**
   * Setter for _exitAll. Just throws an error.
   * @param {string} _exitAll
   */
  set exitAll(_exitAll: string) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".exitAll",
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    }
    if (
      check2004ValidFormat(this._cmi_element + ".exitAll", _exitAll, scorm2004_regex.NAVBoolean)
    ) {
      this._exitAll = _exitAll;
    }
  }

  /**
   * Getter for _abandon
   * @return {string}
   */
  get abandon(): string {
    return this._abandon;
  }

  /**
   * Setter for _abandon. Just throws an error.
   * @param {string} _abandon
   */
  set abandon(_abandon: string) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".abandon",
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    }
    if (
      check2004ValidFormat(this._cmi_element + ".abandon", _abandon, scorm2004_regex.NAVBoolean)
    ) {
      this._abandon = _abandon;
    }
  }

  /**
   * Getter for _abandonAll
   * @return {string}
   */
  get abandonAll(): string {
    return this._abandonAll;
  }

  /**
   * Setter for _abandonAll. Just throws an error.
   * @param {string} _abandonAll
   */
  set abandonAll(_abandonAll: string) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".abandonAll",
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    }
    if (
      check2004ValidFormat(this._cmi_element + ".abandonAll", _abandonAll, scorm2004_regex.NAVBoolean)
    ) {
      this._abandonAll = _abandonAll;
    }
  }

  /**
   * Getter for _suspendAll
   * @return {string}
   */
  get suspendAll(): string {
    return this._suspendAll;
  }

  /**
   * Setter for _suspendAll. Just throws an error.
   * @param {string} _suspendAll
   */
  set suspendAll(_suspendAll: string) {
    if (this.initialized) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".suspendAll",
        scorm2004_errors.READ_ONLY_ELEMENT as number,
      );
    }
    if (
      check2004ValidFormat(this._cmi_element + ".suspendAll", _suspendAll, scorm2004_regex.NAVBoolean)
    ) {
      this._suspendAll = _suspendAll;
    }
  }

  /**
   * toJSON for adl.nav.request_valid
   *
   * @return {
   *    {
   *      previous: string,
   *      continue: string,
   *      choice: { [key: string]: NAVBoolean },
   *      jump: { [key: string]: NAVBoolean },
   *      exit: string,
   *      exitAll: string,
   *      abandon: string,
   *      abandonAll: string,
   *      suspendAll: string
   *    }
   *  }
   */
  toJSON(): {
    previous: string;
    continue: string;
    choice: { [key: string]: NAVBoolean };
    jump: { [key: string]: NAVBoolean };
    exit: string;
    exitAll: string;
    abandon: string;
    abandonAll: string;
    suspendAll: string;
  } {
    this.jsonString = true;
    const result = {
      previous: this.previous,
      continue: this.continue,
      choice: this._choice.getAll(),
      jump: this._jump.getAll(),
      exit: this.exit,
      exitAll: this.exitAll,
      abandon: this.abandon,
      abandonAll: this.abandonAll,
      suspendAll: this.suspendAll,
    };
    this.jsonString = false;
    return result;
  }
}
