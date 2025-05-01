import { CMIArray } from "../common/array";
import { BaseCMI } from "../common/base_cmi";
export declare class CMIEvaluation extends BaseCMI {
    constructor();
    comments: CMIEvaluationComments;
    initialize(): void;
    reset(): void;
    toJSON(): {
        comments: CMIEvaluationComments;
    };
}
declare class CMIEvaluationComments extends CMIArray {
    constructor();
}
export declare class CMIEvaluationCommentsObject extends BaseCMI {
    private _content;
    private _location;
    private _time;
    constructor();
    reset(): void;
    get content(): string;
    set content(content: string);
    get location(): string;
    set location(location: string);
    get time(): string;
    set time(time: string);
    toJSON(): {
        content: string;
        location: string;
        time: string;
    };
}
export {};
