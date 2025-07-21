import { LogLevel } from "../types/api_types";
import { ILoggingService } from "../interfaces/services";
export declare class LoggingService implements ILoggingService {
    private static _instance;
    private _logLevel;
    private _logHandler;
    private constructor();
    static getInstance(): LoggingService;
    setLogLevel(level: LogLevel): void;
    getLogLevel(): LogLevel;
    setLogHandler(handler: (messageLevel: LogLevel, logMessage: string) => void): void;
    log(messageLevel: LogLevel, logMessage: string): void;
    error(logMessage: string): void;
    warn(logMessage: string): void;
    info(logMessage: string): void;
    debug(logMessage: string): void;
    private shouldLog;
    private getNumericLevel;
}
export declare function getLoggingService(): LoggingService;
//# sourceMappingURL=LoggingService.d.ts.map