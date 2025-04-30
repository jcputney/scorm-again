import { CMIArray } from "../common/array";
import { BaseCMI } from "../common/base_cmi";
export declare class CMICommentsFromLMS extends CMIArray {
    constructor();
}
export declare class CMICommentsFromLearner extends CMIArray {
    constructor();
}
export declare class CMICommentsObject extends BaseCMI {
    private _comment;
    private _location;
    private _timestamp;
    private readonly _readOnlyAfterInit;
    constructor(readOnlyAfterInit?: boolean);
    reset(): void;
    get comment(): string;
    set comment(comment: string);
    get location(): string;
    set location(location: string);
    get timestamp(): string;
    set timestamp(timestamp: string);
    toJSON(): {
        comment: string;
        location: string;
        timestamp: string;
    };
}
