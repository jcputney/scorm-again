import { LogLevel } from "../types/api_types";
import { IEventService, ScormEventCallback } from "../interfaces/services";
export declare class EventService implements IEventService {
    private listenerMap;
    private listenerCount;
    private readonly apiLog;
    constructor(apiLog: (functionName: string, message: string, messageLevel: LogLevel, CMIElement?: string) => void);
    private parseListenerName;
    on(listenerName: string, callback: ScormEventCallback): void;
    off(listenerName: string, callback: ScormEventCallback): void;
    clear(listenerName: string): void;
    processListeners(functionName: string, CMIElement?: string, value?: any): void;
    reset(): void;
}
//# sourceMappingURL=EventService.d.ts.map