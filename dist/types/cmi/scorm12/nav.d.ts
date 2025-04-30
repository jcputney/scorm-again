import { BaseCMI } from "../common/base_cmi";
export declare class NAV extends BaseCMI {
    constructor();
    reset(): void;
    private _event;
    get event(): string;
    set event(event: string);
    toJSON(): {
        event: string;
    };
}
