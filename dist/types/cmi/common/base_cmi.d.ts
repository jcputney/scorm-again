export declare abstract class BaseCMI {
    jsonString?: boolean | undefined;
    protected _initialized: boolean;
    private _start_time;
    get initialized(): boolean;
    get start_time(): number | undefined;
    initialize(): void;
    setStartTime(): void;
    abstract reset(): void;
}
export declare abstract class BaseRootCMI extends BaseCMI {
    abstract getCurrentTotalTime(): string;
}
