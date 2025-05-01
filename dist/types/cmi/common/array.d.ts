import { BaseCMI } from "./base_cmi";
import { BaseScormValidationError } from "../../exceptions";
export declare class CMIArray extends BaseCMI {
    private readonly _errorCode;
    private readonly _errorClass;
    private readonly __children;
    childArray: any[];
    constructor(params: {
        children: string;
        errorCode?: number;
        errorClass?: typeof BaseScormValidationError;
    });
    reset(wipe?: boolean): void;
    get _children(): string;
    set _children(_children: string);
    get _count(): number;
    set _count(_count: number);
    toJSON(): object;
}
