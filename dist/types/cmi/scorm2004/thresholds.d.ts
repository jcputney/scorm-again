import { BaseCMI } from "../common/base_cmi";
export declare class CMIThresholds extends BaseCMI {
    private _scaled_passing_score;
    private _completion_threshold;
    constructor();
    get scaled_passing_score(): string;
    set scaled_passing_score(scaled_passing_score: string);
    get completion_threshold(): string;
    set completion_threshold(completion_threshold: string);
    reset(): void;
}
//# sourceMappingURL=thresholds.d.ts.map