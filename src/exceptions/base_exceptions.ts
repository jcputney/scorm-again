type APIError = {
  errorCode: number;
  errorMessage: string;
  detailedMessage: string;
};

export class BaseScormValidationError extends Error {
  constructor(CMIElement: string, errorCode: number) {
    super(`${CMIElement} : ${errorCode.toString()}`);
    this._errorCode = errorCode;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, BaseScormValidationError.prototype);
  }

  private readonly _errorCode: number;

  /**
   * Getter for _errorCode
   * @return {number}
   */
  get errorCode(): number {
    return this._errorCode;
  }
}

/**
 * Base Validation Exception
 */
export class ValidationError extends BaseScormValidationError implements APIError {
  /**
   * Constructor to take in an error message and code
   * @param {string} CMIElement
   * @param {number} errorCode
   * @param {string} errorMessage
   * @param {string} detailedMessage
   */
  constructor(
    CMIElement: string,
    errorCode: number,
    errorMessage: string,
    detailedMessage?: string,
  ) {
    super(CMIElement, errorCode);
    this.message = `${CMIElement} : ${errorMessage}`;
    this._errorMessage = errorMessage;
    if (detailedMessage) {
      this._detailedMessage = detailedMessage;
    }

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  private readonly _errorMessage: string;
  private readonly _detailedMessage: string = "";

  /**
   * Getter for _errorMessage
   * @return {string}
   */
  get errorMessage(): string {
    return this._errorMessage;
  }

  /**
   * Getter for _detailedMessage
   * @return {string}
   */
  get detailedMessage(): string {
    return this._detailedMessage;
  }
}
