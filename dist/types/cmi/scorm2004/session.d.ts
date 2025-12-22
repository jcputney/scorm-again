import { BaseCMI } from "../common/base_cmi";
export declare class CMISession extends BaseCMI {
    private _entry;
    private _exit;
    private _session_time;
    private _total_time;
    constructor();
    get entry(): string;
    set entry(entry: string);
    get exit(): string;
    getExitValueInternal(): string;
    set exit(exit: string);
    get session_time(): string;
    set session_time(session_time: string);
    get total_time(): string;
    set total_time(total_time: string);
    getCurrentTotalTime(start_time: number | undefined): string;
    reset(): void;
}
//# sourceMappingURL=session.d.ts.map