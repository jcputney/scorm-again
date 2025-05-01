import { BaseCMI } from "./base_cmi";
import { BaseScormValidationError } from "../../exceptions";
export declare class CMIScore extends BaseCMI {
    private readonly __children;
    private readonly __score_range;
    private readonly __invalid_error_code;
    private readonly __invalid_type_code;
    private readonly __invalid_range_code;
    private readonly __decimal_regex;
    private readonly __error_class;
    protected _raw: string;
    protected _min: string;
    protected _max: string;
    constructor(params: {
        score_children?: string;
        score_range?: string;
        max?: string;
        invalidErrorCode?: number;
        invalidTypeCode?: number;
        invalidRangeCode?: number;
        decimalRegex?: string;
        errorClass: typeof BaseScormValidationError;
    });
    reset(): void;
    get _children(): string;
    set _children(_children: string);
    get raw(): string;
    set raw(raw: string);
    get min(): string;
    set min(min: string);
    get max(): string;
    set max(max: string);
    toJSON(): {
        min: string;
        max: string;
        raw: string;
    };
}
