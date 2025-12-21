/**
 * Base class for API cmi objects
 */
export abstract class BaseCMI {
  /**
   * Flag used during JSON serialization to allow getter access without initialization checks.
   * When true, getters can be accessed before the API is initialized, which is necessary
   * for serializing the CMI data structure to JSON format.
   */
  jsonString = false;
  protected readonly _cmi_element: string;
  protected _initialized = false;

  /**
   * Constructor for BaseCMI
   * @param {string} cmi_element
   */
  constructor(cmi_element: string) {
    this._cmi_element = cmi_element;
  }

  /**
   * Getter for _initialized
   * @return {boolean}
   */
  get initialized(): boolean {
    return this._initialized;
  }

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize(): void {
    this._initialized = true;
  }

  abstract reset(): void;
}

/**
 * Base class for cmi root objects
 */
export abstract class BaseRootCMI extends BaseCMI {
  protected _start_time: number | undefined;

  /**
   * Start time of the session
   * @type {number | undefined}
   * @protected
   */
  get start_time(): number | undefined {
    return this._start_time;
  }

  /**
   * Setter for start_time. Can only be called once.
   */
  setStartTime(): void {
    if (this._start_time === undefined) {
      this._start_time = new Date().getTime();
    } else {
      throw new Error("Start time has already been set.");
    }
  }

  abstract getCurrentTotalTime(): string;
}
