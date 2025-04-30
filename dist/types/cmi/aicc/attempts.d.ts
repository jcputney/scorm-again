import { BaseCMI } from "../common/base_cmi";
import { CMIScore } from "../common/score";
import { CMIArray } from "../common/array";
export declare class CMIAttemptRecords extends CMIArray {
    constructor();
}
export declare class CMIAttemptRecordsObject extends BaseCMI {
    private _lesson_status;
    constructor();
    score: CMIScore;
    initialize(): void;
    reset(): void;
    get lesson_status(): string;
    set lesson_status(lesson_status: string);
    toJSON(): {
        lesson_status: string;
        score: CMIScore;
    };
}
