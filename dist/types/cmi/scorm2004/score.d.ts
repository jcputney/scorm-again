import { CMIScore } from "../common/score";
export declare class Scorm2004CMIScore extends CMIScore {
    private _scaled;
    constructor();
    reset(): void;
    get scaled(): string;
    set scaled(scaled: string);
    toJSON(): {
        scaled: string;
        raw: string;
        min: string;
        max: string;
    };
}
