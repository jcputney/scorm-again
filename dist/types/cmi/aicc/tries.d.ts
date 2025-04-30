import { CMIArray } from "../common/array";
import { BaseCMI } from "../common/base_cmi";
import { CMIScore } from "../common/score";
export declare class CMITries extends CMIArray {
    constructor();
}
export declare class CMITriesObject extends BaseCMI {
    private _status;
    private _time;
    constructor();
    score: CMIScore;
    initialize(): void;
    reset(): void;
    get status(): string;
    set status(status: string);
    get time(): string;
    set time(time: string);
    toJSON(): {
        status: string;
        time: string;
        score: CMIScore;
    };
}
