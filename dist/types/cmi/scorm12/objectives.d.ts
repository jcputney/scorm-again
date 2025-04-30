import { BaseCMI } from "../common/base_cmi";
import { CMIScore } from "../common/score";
import { CMIArray } from "../common/array";
export declare class CMIObjectives extends CMIArray {
    constructor();
}
export declare class CMIObjectivesObject extends BaseCMI {
    constructor();
    readonly score: CMIScore;
    private _id;
    private _status;
    reset(): void;
    get id(): string;
    set id(id: string);
    get status(): string;
    set status(status: string);
    toJSON(): {
        id: string;
        status: string;
        score: CMIScore;
    };
}
