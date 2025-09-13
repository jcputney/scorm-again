import { BaseCMI } from "../common/base_cmi";
import { NAVBoolean } from "../../constants/enums";
import { CMIArray } from "../common/array";
import { Sequencing } from "./sequencing/sequencing";
export declare class ADL extends BaseCMI {
    constructor();
    nav: ADLNav;
    data: ADLData;
    private _sequencing;
    initialize(): void;
    reset(): void;
    get sequencing(): Sequencing | null;
    set sequencing(sequencing: Sequencing | null);
    toJSON(): {
        nav: ADLNav;
        data: ADLData;
    };
}
export declare class ADLNav extends BaseCMI {
    private _request;
    private _sequencing;
    constructor();
    request_valid: ADLNavRequestValid;
    get sequencing(): Sequencing | null;
    set sequencing(sequencing: Sequencing | null);
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
    private _exit;
    private _exitAll;
    private _abandon;
    private _abandonAll;
    private _suspendAll;
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
    get exit(): string;
    set exit(_exit: string);
    get exitAll(): string;
    set exitAll(_exitAll: string);
    get abandon(): string;
    set abandon(_abandon: string);
    get abandonAll(): string;
    set abandonAll(_abandonAll: string);
    get suspendAll(): string;
    set suspendAll(_suspendAll: string);
    toJSON(): {
        previous: string;
        continue: string;
    };
}
//# sourceMappingURL=adl.d.ts.map