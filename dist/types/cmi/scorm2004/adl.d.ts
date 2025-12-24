import { BaseCMI } from "../common/base_cmi";
import { CMIArray } from "../common/array";
import { Sequencing } from "./sequencing/sequencing";
import { NAVBoolean } from "../../constants";
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
    private _idIsSet;
    private _storeIsSet;
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
declare class ADLNavRequestValidChoice {
    private _parentNav;
    private _staticValues;
    setParentNav(nav: ADLNav): void;
    _isTargetValid(target: string): string;
    getAll(): {
        [key: string]: NAVBoolean;
    };
    setAll(values: {
        [key: string]: NAVBoolean;
    }): void;
}
declare class ADLNavRequestValidJump {
    private _parentNav;
    private _staticValues;
    setParentNav(nav: ADLNav): void;
    _isTargetValid(target: string): string;
    getAll(): {
        [key: string]: NAVBoolean;
    };
    setAll(values: {
        [key: string]: NAVBoolean;
    }): void;
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
    private _parentNav;
    constructor();
    setParentNav(nav: ADLNav): void;
    reset(): void;
    get continue(): string;
    set continue(_continue: string);
    get previous(): string;
    set previous(_previous: string);
    get choice(): ADLNavRequestValidChoice;
    set choice(choice: {
        [key: string]: string;
    });
    get jump(): ADLNavRequestValidJump;
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
        choice: {
            [key: string]: NAVBoolean;
        };
        jump: {
            [key: string]: NAVBoolean;
        };
        exit: string;
        exitAll: string;
        abandon: string;
        abandonAll: string;
        suspendAll: string;
    };
}
export {};
//# sourceMappingURL=adl.d.ts.map