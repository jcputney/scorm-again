import { LogLevel } from "../types/api_types";
import { LogLevelEnum } from "../constants/enums";

/**
 * Centralized logging service implemented as a singleton
 * Provides methods for logging at different levels and configuring the log level
 */
export class LoggingService {
  private static _instance: LoggingService;
  private _logLevel: LogLevel = LogLevelEnum.ERROR;
  private _logHandler: (messageLevel: LogLevel, logMessage: string) => void;

  /**
   * Private constructor to prevent direct instantiation
   */
  private constructor() {
    // Default log handler uses console methods based on log level
    this._logHandler = (messageLevel: LogLevel, logMessage: string) => {
      switch (messageLevel) {
        case "4":
        case 4:
        case "ERROR":
        case LogLevelEnum.ERROR:
          console.error(logMessage);
          break;
        case "3":
        case 3:
        case "WARN":
        case LogLevelEnum.WARN:
          console.warn(logMessage);
          break;
        case "2":
        case 2:
        case "INFO":
        case LogLevelEnum.INFO:
          console.info(logMessage);
          break;
        case "1":
        case 1:
        case "DEBUG":
        case LogLevelEnum.DEBUG:
          if (console.debug) {
            console.debug(logMessage);
          } else {
            console.log(logMessage);
          }
          break;
      }
    };
  }

  /**
   * Get the singleton instance of LoggingService
   *
   * @returns {LoggingService} The singleton instance
   */
  public static getInstance(): LoggingService {
    if (!LoggingService._instance) {
      LoggingService._instance = new LoggingService();
    }
    return LoggingService._instance;
  }

  /**
   * Set the log level
   *
   * @param {LogLevel} level - The log level to set
   */
  public setLogLevel(level: LogLevel): void {
    this._logLevel = level;
  }

  /**
   * Get the current log level
   *
   * @returns {LogLevel} The current log level
   */
  public getLogLevel(): LogLevel {
    return this._logLevel;
  }

  /**
   * Set a custom log handler
   *
   * @param {Function} handler - The function to handle log messages
   */
  public setLogHandler(
    handler: (messageLevel: LogLevel, logMessage: string) => void,
  ): void {
    this._logHandler = handler;
  }

  /**
   * Log a message if the message level is greater than or equal to the current log level
   *
   * @param {LogLevel} messageLevel - The level of the message
   * @param {string} logMessage - The message to log
   */
  public log(messageLevel: LogLevel, logMessage: string): void {
    if (this.shouldLog(messageLevel)) {
      this._logHandler(messageLevel, logMessage);
    }
  }

  /**
   * Log a message at ERROR level
   *
   * @param {string} logMessage - The message to log
   */
  public error(logMessage: string): void {
    this.log(LogLevelEnum.ERROR, logMessage);
  }

  /**
   * Log a message at WARN level
   *
   * @param {string} logMessage - The message to log
   */
  public warn(logMessage: string): void {
    this.log(LogLevelEnum.WARN, logMessage);
  }

  /**
   * Log a message at INFO level
   *
   * @param {string} logMessage - The message to log
   */
  public info(logMessage: string): void {
    this.log(LogLevelEnum.INFO, logMessage);
  }

  /**
   * Log a message at DEBUG level
   *
   * @param {string} logMessage - The message to log
   */
  public debug(logMessage: string): void {
    this.log(LogLevelEnum.DEBUG, logMessage);
  }

  /**
   * Determine if a message should be logged based on its level and the current log level
   *
   * @param {LogLevel} messageLevel - The level of the message
   * @returns {boolean} Whether the message should be logged
   */
  private shouldLog(messageLevel: LogLevel): boolean {
    // Convert string levels to numbers for comparison
    const numericMessageLevel = this.getNumericLevel(messageLevel);
    const numericLogLevel = this.getNumericLevel(this._logLevel);

    return numericMessageLevel >= numericLogLevel;
  }

  /**
   * Convert a log level to its numeric value
   *
   * @param {LogLevel} level - The log level to convert
   * @returns {number} The numeric value of the log level
   */
  private getNumericLevel(level: LogLevel): number {
    if (level === undefined) return LogLevelEnum.NONE;

    if (typeof level === "number") return level;

    switch (level) {
      case "1":
      case "DEBUG":
        return LogLevelEnum.DEBUG;
      case "2":
      case "INFO":
        return LogLevelEnum.INFO;
      case "3":
      case "WARN":
        return LogLevelEnum.WARN;
      case "4":
      case "ERROR":
        return LogLevelEnum.ERROR;
      case "5":
      case "NONE":
        return LogLevelEnum.NONE;
      default:
        return LogLevelEnum.ERROR; // Default to ERROR if unknown
    }
  }
}

// Export a function to get the singleton instance
export function getLoggingService(): LoggingService {
  return LoggingService.getInstance();
}
