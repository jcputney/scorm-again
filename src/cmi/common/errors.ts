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

  setMessage(message: string) {
    this.message = message;
  }
}

export class BaseScorm12ValidationError extends BaseScormValidationError {
  constructor(errorCode: number) {
    super(errorCode);
    this.name = "Scorm12ValidationError";
  }
}

export class BaseScorm2004ValidationError extends BaseScormValidationError {
  constructor(errorCode: number) {
    super(errorCode);
    this.name = "Scorm2004ValidationError";
  }
}
