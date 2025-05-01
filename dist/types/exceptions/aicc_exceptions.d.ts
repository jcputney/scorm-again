import { ValidationError } from "../exceptions";
export declare class AICCValidationError extends ValidationError {
    constructor(errorCode: number);
}
