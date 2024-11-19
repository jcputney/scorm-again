/**
 * Base class for API cmi objects
 */
export abstract class BaseCMI {
  jsonString? = false;
  protected _initialized = false;
  private _start_time: number | undefined;

  /**
   * Getter for _initialized
   * @return {boolean}
   */
  get initialized(): boolean {
    return this._initialized;
  }

  /**
   * Getter for _start_time
   * @return {number | undefined}
   */
  get start_time(): number | undefined {
    return this._start_time;
  }

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  initialize(): void {
    this._initialized = true;
  }

  /**
   * Called when the player should override the 'session_time' provided by
   * the module
   */
  setStartTime(): void {
    this._start_time = new Date().getTime();
  }

  abstract reset(): void;
}

/**
 * Base class for cmi root objects
 */
export abstract class BaseRootCMI extends BaseCMI {
  abstract getCurrentTotalTime(): string;
}
