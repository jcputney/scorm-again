import { BaseCMI } from "../common/base_cmi";
import { NAVBoolean } from "../../constants/enums";
import { CMIArray } from "../common/array";
export declare class ADL extends BaseCMI {
    constructor();
    nav: ADLNav;
    data: ADLData;
    initialize(): void;
    reset(): void;
    toJSON(): {
        nav: ADLNav;
        data: ADLData;
    };
}
export declare class ADLNav extends BaseCMI {
    private _request;
    constructor();
    request_valid: ADLNavRequestValid;
    initialize(): void;
    reset(): void;
    get request(): string;
    set request(request: string);
    toJSON(): {
        request: string;
    };
}
export declare class ADLData extends CMIArray {
    constructor();
}
export declare class ADLDataObject extends BaseCMI {
    private _id;
    private _store;
    constructor();
    reset(): void;
    get id(): string;
    set id(id: string);
    get store(): string;
    set store(store: string);
    toJSON(): {
        id: string;
        store: string;
    };
}
export declare class ADLNavRequestValid extends BaseCMI {
    private _continue;
    private _previous;
    private _choice;
    private _jump;
    constructor();
    reset(): void;
    get continue(): string;
    set continue(_continue: string);
    get previous(): string;
    set previous(_previous: string);
    get choice(): {
        [key: string]: NAVBoolean;
    };
    set choice(choice: {
        [key: string]: string;
    });
    get jump(): {
        [key: string]: NAVBoolean;
    };
    set jump(jump: {
        [key: string]: string;
    });
    toJSON(): {
        previous: string;
        continue: string;
    };
}
