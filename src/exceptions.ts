type APIError = {
  errorCode: number;
  errorMessage: string;
  detailedMessage: string;
};

export class BaseScormValidationError extends Error {
  constructor(errorCode: number) {
    super(errorCode.toString());
    this._errorCode = errorCode;
    this.name = "ScormValidationError";
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
export class ValidationError
  extends BaseScormValidationError
  implements APIError
{
  /**
   * Constructor to take in an error message and code
   * @param {number} errorCode
   * @param {string} errorMessage
   * @param {string} detailedMessage
   */
  constructor(
    errorCode: number,
    errorMessage: string,
    detailedMessage?: string,
  ) {
    super(errorCode);
    this.message = errorMessage;
    this._errorMessage = errorMessage;
    if (detailedMessage) {
      this._detailedMessage = detailedMessage;
    }
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
