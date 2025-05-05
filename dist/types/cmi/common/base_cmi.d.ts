export declare abstract class BaseCMI {
    jsonString: boolean;
    protected readonly _cmi_element: string;
    protected _initialized: boolean;
    constructor(cmi_element: string);
    get initialized(): boolean;
    initialize(): void;
    abstract reset(): void;
}
export declare abstract class BaseRootCMI extends BaseCMI {
    protected _start_time: number | undefined;
    get start_time(): number | undefined;
    setStartTime(): void;
    abstract getCurrentTotalTime(): string;
}
