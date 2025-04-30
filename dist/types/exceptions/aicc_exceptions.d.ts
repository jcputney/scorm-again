import { ValidationError } from "../exceptions";
export declare class AICCValidationError extends ValidationError {
    constructor(CMIElement: string, errorCode: number);
}
