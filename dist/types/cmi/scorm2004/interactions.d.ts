import { BaseCMI } from "../common/base_cmi";
import { CMIArray } from "../common/array";
export declare class CMIInteractions extends CMIArray {
    constructor();
}
export declare class CMIInteractionsObject extends BaseCMI {
    private _id;
    private _type;
    private _timestamp;
    private _weighting;
    private _learner_response;
    private _result;
    private _latency;
    private _description;
    constructor();
    objectives: CMIArray;
    correct_responses: CMIArray;
    initialize(): void;
    reset(): void;
    get id(): string;
    set id(id: string);
    get type(): string;
    set type(type: string);
    get timestamp(): string;
    set timestamp(timestamp: string);
    get weighting(): string;
    set weighting(weighting: string);
    get learner_response(): string;
    set learner_response(learner_response: string);
    get result(): string;
    set result(result: string);
    get latency(): string;
    set latency(latency: string);
    get description(): string;
    set description(description: string);
    toJSON(): {
        id: string;
        type: string;
        objectives: CMIArray;
        timestamp: string;
        correct_responses: CMIArray;
        weighting: string;
        learner_response: string;
        result: string;
        latency: string;
        description: string;
    };
}
export declare class CMIInteractionsObjectivesObject extends BaseCMI {
    private _id;
    constructor();
    reset(): void;
    get id(): string;
    set id(id: string);
    toJSON(): {
        id: string;
    };
}
export declare class CMIInteractionsCorrectResponsesObject extends BaseCMI {
    private _pattern;
    constructor();
    reset(): void;
    get pattern(): string;
    set pattern(pattern: string);
    toJSON(): {
        pattern: string;
    };
}
