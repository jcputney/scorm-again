import { BaseCMI } from "./base_cmi";
import { BaseScormValidationError } from "../../exceptions";
import { scorm12_errors } from "../../constants/error_codes";

/**
 * Base class for cmi *.n objects
 */
export class CMIArray extends BaseCMI {
  private readonly _errorCode: number;
  private readonly _errorClass: typeof BaseScormValidationError;
  private readonly __children: string;
  public childArray: any[];

  /**
   * Constructor cmi *.n arrays
   * @param {object} params
   */
  constructor(params: {
    children: string;
    errorCode?: number;
    errorClass?: typeof BaseScormValidationError;
  }) {
    super();
    this.__children = params.children;
    this._errorCode = params.errorCode || (scorm12_errors.GENERAL as number);
    this._errorClass = params.errorClass || BaseScormValidationError;
    this.childArray = [];
  }

  /**
   * Called when the API has been reset
   */
  reset(wipe: boolean = false): void {
    this._initialized = false;
    if (wipe) {
      this.childArray = [];
    } else {
      // Reset all children
      for (let i = 0; i < this.childArray.length; i++) {
        this.childArray[i].reset();
      }
    }
  }
  /**
   * Getter for _children
   * @return {string}
   */
  get _children(): string {
    return this.__children;
  }

  /**
   * Setter for _children. Just throws an error.
   * @param {string} _children
   */
  set _children(_children: string) {
    throw new this._errorClass(this._errorCode);
  }

  /**
   * Getter for _count
   * @return {number}
   */
  get _count(): number {
    return this.childArray.length;
  }

  /**
   * Setter for _count. Just throws an error.
   * @param {number} _count
   */
  set _count(_count: number) {
    throw new this._errorClass(this._errorCode);
  }

  /**
   * toJSON for *.n arrays
   * @return {object}
   */
  toJSON(): object {
    this.jsonString = true;
    const result: { [key: string]: any } = {};
    for (let i = 0; i < this.childArray.length; i++) {
      result[i + ""] = this.childArray[i];
    }
    delete this.jsonString;
    return result;
  }
}
