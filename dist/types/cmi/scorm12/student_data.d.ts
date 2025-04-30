import { BaseCMI } from "../common/base_cmi";
export declare class CMIStudentData extends BaseCMI {
    private readonly __children;
    private _mastery_score;
    private _max_time_allowed;
    private _time_limit_action;
    constructor(student_data_children?: string);
    reset(): void;
    get _children(): string;
    set _children(_children: string);
    get mastery_score(): string;
    set mastery_score(mastery_score: string);
    get max_time_allowed(): string;
    set max_time_allowed(max_time_allowed: string);
    get time_limit_action(): string;
    set time_limit_action(time_limit_action: string);
    toJSON(): {
        mastery_score: string;
        max_time_allowed: string;
        time_limit_action: string;
    };
}
