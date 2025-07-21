import { BaseCMI } from "../common/base_cmi";
export declare class CMIStatus extends BaseCMI {
    private _completion_status;
    private _success_status;
    private _progress_measure;
    constructor();
    get completion_status(): string;
    set completion_status(completion_status: string);
    get success_status(): string;
    set success_status(success_status: string);
    get progress_measure(): string;
    set progress_measure(progress_measure: string);
    reset(): void;
}
//# sourceMappingURL=status.d.ts.map