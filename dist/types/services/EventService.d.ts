import { LogLevel } from "../types/api_types";
import { IEventService } from "../interfaces/services";
export declare class EventService implements IEventService {
    private listenerMap;
    private listenerCount;
    private readonly apiLog;
    constructor(apiLog: (functionName: string, message: string, messageLevel: LogLevel, CMIElement?: string) => void);
    private parseListenerName;
    on(listenerName: string, callback: Function): void;
    off(listenerName: string, callback: Function): void;
    clear(listenerName: string): void;
    processListeners(functionName: string, CMIElement?: string, value?: any): void;
    reset(): void;
}
