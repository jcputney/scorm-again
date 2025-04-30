export declare const NAVBoolean: {
    UNKNOWN: string;
    TRUE: string;
    FALSE: string;
};
export type NAVBoolean = (typeof NAVBoolean)[keyof typeof NAVBoolean];
export declare const SuccessStatus: {
    PASSED: string;
    FAILED: string;
    UNKNOWN: string;
};
export type SuccessStatus = (typeof SuccessStatus)[keyof typeof SuccessStatus];
export declare const CompletionStatus: {
    COMPLETED: string;
    INCOMPLETE: string;
    UNKNOWN: string;
};
export type CompletionStatus = (typeof CompletionStatus)[keyof typeof CompletionStatus];
export declare const LogLevelEnum: {
    _: number;
    DEBUG: number;
    INFO: number;
    WARN: number;
    ERROR: number;
    NONE: number;
};
export type LogLevelEnum = (typeof LogLevelEnum)[keyof typeof LogLevelEnum];
