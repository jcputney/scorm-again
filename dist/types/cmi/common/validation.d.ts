import { BaseScormValidationError } from "../../exceptions";
export declare function checkValidFormat(value: string, regexPattern: string, errorCode: number, errorClass: typeof BaseScormValidationError, allowEmptyString?: boolean): boolean;
export declare function checkValidRange(value: any, rangePattern: string, errorCode: number, errorClass: typeof BaseScormValidationError): boolean;
