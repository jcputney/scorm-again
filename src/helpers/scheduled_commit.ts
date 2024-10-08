import BaseAPI from "../BaseAPI";

/**
 * Private class that wraps a timeout call to the commit() function
 */
export class ScheduledCommit {
  private _API;
  private _cancelled = false;
  private readonly _timeout;
  private readonly _callback;

  /**
   * Constructor for ScheduledCommit
   * @param {BaseAPI} API
   * @param {number} when
   * @param {string} callback
   */
  constructor(API: BaseAPI, when: number, callback: string) {
    this._API = API;
    this._timeout = setTimeout(this.wrapper.bind(this), when);
    this._callback = callback;
  }

  /**
   * Cancel any currently scheduled commit
   */
  cancel() {
    this._cancelled = true;
    if (this._timeout) {
      clearTimeout(this._timeout);
    }
  }

  /**
   * Wrap the API commit call to check if the call has already been cancelled
   */
  wrapper() {
    if (!this._cancelled) {
      (async () => await this._API.commit(this._callback))();
    }
  }
}
