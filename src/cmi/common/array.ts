import { BaseCMI } from "./base_cmi";
import ErrorCodes from "../../constants/error_codes";
import { BaseScormValidationError } from "../../exceptions";

export const scorm12_error_codes = ErrorCodes.scorm12;

/**
 * Base class for cmi *.n objects
 */
export class CMIArray extends BaseCMI {
  private readonly _errorCode: number;
  private readonly _errorClass: typeof BaseScormValidationError;
  private readonly __children: string;
  childArray: any[];

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
    this._errorCode = params.errorCode || scorm12_error_codes.GENERAL;
    this._errorClass = params.errorClass || BaseScormValidationError;
    this.childArray = [];
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
