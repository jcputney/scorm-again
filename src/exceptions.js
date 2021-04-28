// @flow

/**
 * Data Validation Exception
 */
export class ValidationError extends Error {
  /**
   * Constructor to take in an error message and code
   * @param {number} errorCode
   */
  constructor(errorCode: number, ...rest) {
    super(...rest);
    this.#errorCode = errorCode;
  }

  #errorCode;

  /**
   * Getter for #errorCode
   * @return {number}
   */
  get errorCode() {
    return this.#errorCode;
  }
}
