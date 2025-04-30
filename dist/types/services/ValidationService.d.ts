import { BaseScormValidationError } from "../exceptions";
export declare class ValidationService {
    validateScore(CMIElement: string, value: string, decimalRegex: string, scoreRange: string | false, invalidTypeCode: number, invalidRangeCode: number, errorClass: typeof BaseScormValidationError): boolean;
    validateScorm12Audio(CMIElement: string, value: string): boolean;
    validateScorm12Language(CMIElement: string, value: string): boolean;
    validateScorm12Speed(CMIElement: string, value: string): boolean;
    validateScorm12Text(CMIElement: string, value: string): boolean;
    validateReadOnly(CMIElement: string, initialized: boolean): void;
}
export declare const validationService: ValidationService;
