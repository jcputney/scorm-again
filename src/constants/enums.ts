// Using plain objects instead of enums for better compatibility with strip-only mode
// This approach avoids TypeScript enum runtime code while maintaining the same API

// NAVBoolean values
export const NAVBoolean = {
  UNKNOWN: "unknown",
  TRUE: "true",
  FALSE: "false",
};

// Type for NAVBoolean values
export type NAVBoolean = (typeof NAVBoolean)[keyof typeof NAVBoolean];

// SuccessStatus values
export const SuccessStatus = {
  PASSED: "passed",
  FAILED: "failed",
  UNKNOWN: "unknown",
};

// Type for SuccessStatus values
export type SuccessStatus = (typeof SuccessStatus)[keyof typeof SuccessStatus];

// CompletionStatus values
export const CompletionStatus = {
  COMPLETED: "completed",
  INCOMPLETE: "incomplete",
  UNKNOWN: "unknown",
};

// Type for CompletionStatus values
export type CompletionStatus =
  (typeof CompletionStatus)[keyof typeof CompletionStatus];

// LogLevelEnum values
export const LogLevelEnum = {
  _: 0,
  DEBUG: 1,
  INFO: 2,
  WARN: 3,
  ERROR: 4,
  NONE: 5,
};

// Type for LogLevelEnum values
export type LogLevelEnum = (typeof LogLevelEnum)[keyof typeof LogLevelEnum];
