import { CMIScore } from "../common/score.js";
import { ScoreObject } from "../../types/index.js";
export declare class Scorm2004CMIScore extends CMIScore {
    private _scaled;
    constructor();
    reset(): void;
    get scaled(): string;
    set scaled(scaled: string);
    getScoreObject(): ScoreObject;
    toJSON(): {
        scaled: string;
        raw: string;
        min: string;
        max: string;
    };
}
//# sourceMappingURL=score.d.ts.map