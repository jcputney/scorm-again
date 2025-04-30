import { BaseCMI } from "../common/base_cmi";
export declare class CMISettings extends BaseCMI {
    private _credit;
    private _mode;
    private _time_limit_action;
    private _max_time_allowed;
    constructor();
    get credit(): string;
    set credit(credit: string);
    get mode(): string;
    set mode(mode: string);
    get time_limit_action(): string;
    set time_limit_action(time_limit_action: string);
    get max_time_allowed(): string;
    set max_time_allowed(max_time_allowed: string);
    reset(): void;
}
