import { BaseCMI } from "../common/base_cmi";
import { CMIArray } from "../common/array";
export declare class CMIPaths extends CMIArray {
    constructor();
}
export declare class CMIPathsObject extends BaseCMI {
    private _location_id;
    private _date;
    private _time;
    private _status;
    private _why_left;
    private _time_in_element;
    constructor();
    reset(): void;
    get location_id(): string;
    set location_id(location_id: string);
    get date(): string;
    set date(date: string);
    get time(): string;
    set time(time: string);
    get status(): string;
    set status(status: string);
    get why_left(): string;
    set why_left(why_left: string);
    get time_in_element(): string;
    set time_in_element(time_in_element: string);
    toJSON(): {
        location_id: string;
        date: string;
        time: string;
        status: string;
        why_left: string;
        time_in_element: string;
    };
}
