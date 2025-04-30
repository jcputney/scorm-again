import { BaseScormValidationError } from "../../exceptions";
export declare const checkValidFormat: (CMIElement: string, value: string, regexPattern: string, errorCode: number, errorClass: typeof BaseScormValidationError, allowEmptyString?: boolean) => boolean;
export declare const checkValidRange: (CMIElement: string, value: any, rangePattern: string, errorCode: number, errorClass: typeof BaseScormValidationError) => boolean;
