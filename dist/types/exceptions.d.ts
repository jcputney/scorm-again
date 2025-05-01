type APIError = {
    errorCode: number;
    errorMessage: string;
    detailedMessage: string;
};
export declare class BaseScormValidationError extends Error {
    constructor(errorCode: number);
    private readonly _errorCode;
    get errorCode(): number;
}
export declare class ValidationError extends BaseScormValidationError implements APIError {
    constructor(errorCode: number, errorMessage: string, detailedMessage?: string);
    private readonly _errorMessage;
    private readonly _detailedMessage;
    get errorMessage(): string;
    get detailedMessage(): string;
}
export {};
