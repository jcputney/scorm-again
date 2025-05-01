import BaseAPI from "../BaseAPI";
export declare class ScheduledCommit {
    private _API;
    private _cancelled;
    private readonly _timeout;
    private readonly _callback;
    constructor(API: BaseAPI, when: number, callback: string);
    cancel(): void;
    wrapper(): void;
}
