import { CMIArray } from "../common/array";
import { BaseCMI } from "../common/base_cmi";
export declare class CMIInteractions extends CMIArray {
    constructor();
}
export declare class CMIInteractionsObject extends BaseCMI {
    constructor();
    readonly objectives: CMIArray;
    readonly correct_responses: CMIArray;
    initialize(): void;
    private _id;
    private _time;
    private _type;
    private _weighting;
    private _student_response;
    private _result;
    private _latency;
    reset(): void;
    get id(): string;
    set id(id: string);
    get time(): string;
    set time(time: string);
    get type(): string;
    set type(type: string);
    get weighting(): string;
    set weighting(weighting: string);
    get student_response(): string;
    set student_response(student_response: string);
    get result(): string;
    set result(result: string);
    get latency(): string;
    set latency(latency: string);
    toJSON(): {
        id: string;
        time: string;
        type: string;
        weighting: string;
        student_response: string;
        result: string;
        latency: string;
        objectives: CMIArray;
        correct_responses: CMIArray;
    };
}
export declare class CMIInteractionsObjectivesObject extends BaseCMI {
    constructor();
    private _id;
    reset(): void;
    get id(): string;
    set id(id: string);
    toJSON(): {
        id: string;
    };
}
export declare class CMIInteractionsCorrectResponsesObject extends BaseCMI {
    constructor();
    private _pattern;
    reset(): void;
    get pattern(): string;
    set pattern(pattern: string);
    toJSON(): {
        pattern: string;
    };
}
