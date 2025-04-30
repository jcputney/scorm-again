import { BaseCMI } from "../common/base_cmi";
export declare class CMIContent extends BaseCMI {
    private _location;
    private _launch_data;
    private _suspend_data;
    constructor();
    get location(): string;
    set location(location: string);
    get launch_data(): string;
    set launch_data(launch_data: string);
    get suspend_data(): string;
    set suspend_data(suspend_data: string);
    reset(): void;
}
