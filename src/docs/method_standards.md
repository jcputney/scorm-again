# Method Signature and Return Type Standards

This document defines standard patterns for method signatures and return types in the SCORM Again project. Following
these standards will ensure consistency across the codebase and make it easier for developers to understand and use the
API.

## Table of Contents

1. [Naming Conventions](#naming-conventions)
2. [Return Types](#return-types)
3. [Parameter Types](#parameter-types)
4. [Method Overloading](#method-overloading)
5. [Error Handling](#error-handling)
6. [Common Method Patterns](#common-method-patterns)

## Naming Conventions

### General Rules

- Use camelCase for method names (e.g., `getValue`, `setCMIValue`)
- Use descriptive names that clearly communicate purpose
- Be consistent with verb tense (e.g., use `get` not `fetch` or `retrieve`)
- Prefix private methods with an underscore (e.g., `_checkObjectHasProperty`)

### Getter Methods

- Start with `get` (e.g., `getValue`, `getCMIValue`)
- For boolean properties, use `is` or `has` (e.g., `isInitialized`, `hasChildren`)
- Use the same name as the property being accessed (e.g., `getLogLevel` for `logLevel`)

### Setter Methods

- Start with `set` (e.g., `setValue`, `setCMIValue`)
- Use the same name as the property being set (e.g., `setLogLevel` for `logLevel`)

### Update Methods

- Start with `update` for methods that modify existing values (e.g., `updateSettings`)

### Reset/Clear Methods

- Use `reset` for methods that reset state to initial values
- Use `clear` for methods that remove all items from a collection

### Event Methods

- Use `on` for adding event listeners
- Use `off` for removing event listeners
- Use `process` for processing events (e.g., `processListeners`)

### SCORM-Specific Methods

- Use `lms` prefix for SCORM API methods (e.g., `lmsGetValue`, `lmsSetValue`)
- Use consistent naming across SCORM versions

## Return Types

### General Rules

- Always specify explicit return types
- Be consistent with return types for similar methods
- Avoid using `any` as a return type; use more specific types
- Use `void` for methods that don't return a value
- Use `Promise<T>` for asynchronous methods

### SCORM API Methods

- SCORM API methods should return `string` as per the SCORM specification
- Use `"true"` and `"false"` (as strings) for success/failure indicators
- For internal methods that don't need to follow the SCORM specification, use `boolean` instead of string booleans

### Getter Methods

- Return the type of the property being accessed
- For collection getters, return the appropriate collection type (e.g., `Array<T>`, `Map<K, V>`)
- For optional properties, return the type or `undefined` (e.g., `string | undefined`)

### Setter Methods

- Return `void` if the method doesn't need to indicate success/failure
- Return `boolean` or `string` for methods that need to indicate success/failure
- Be consistent with return types for all setter methods

## Parameter Types

### General Rules

- Always specify explicit parameter types
- Use optional parameters (with `?`) rather than parameters that can be undefined
- Use default parameter values instead of conditional logic to assign default values
- Be consistent with parameter types for similar methods

### SCORM API Methods

- Follow the SCORM specification for parameter types
- Use `string` for CMI element names
- Use appropriate types for values (e.g., `string`, `number`, `boolean`)

### Callback Parameters

- Use function types for callbacks (e.g., `(param: Type) => ReturnType`)
- Specify parameter and return types for callback functions

## Method Overloading

- Use function overloading for methods that can accept different parameter types
- Provide clear documentation for each overload
- Ensure that overloads are compatible with each other

## Error Handling

- Use custom error classes for domain-specific errors
- Throw specific error types rather than generic Error objects
- Document the errors that a method can throw
- Be consistent with error handling across similar methods

## Common Method Patterns

### API Layer Methods

```typescript
// Getter method
getValue(element: string): string;

// Setter method
setValue(element: string, value: any): string;

// Event methods
on(event: string, callback: Function): void;
off(event: string, callback: Function): void;
```

### Business Logic Layer Methods

```typescript
// Getter method
getValue(callbackName: string, checkTerminated: () => boolean, CMIElement: string): string;

// Setter method
setValue(callbackName: string, commitCallback: () => string, checkTerminated: () => boolean, CMIElement: string, value: any): string;

// State check methods
isInitialized(): boolean;
isTerminated(): boolean;
```

### Data Access Layer Methods

```typescript
// Getter method
getCMIValue(CMIElement: string): string;

// Setter method
setCMIValue(CMIElement: string, value: any): string;

// Data serialization methods
renderCMIToJSONString(sendFullCommit: boolean): string;
renderCMIToJSONObject(sendFullCommit: boolean): object;
```

### Infrastructure Layer Methods

```typescript
// HTTP method
processHttpRequest(url: string, params: CommitObject | StringKeyMap | Array<any>, immediate: boolean): Promise<ResultObject>;

// Logging methods
log(functionName: string, message: any, messageLevel: LogLevelEnum, CMIElement?: string): void;
setLogLevel(level: LogLevel): void;

// Error handling methods
throwSCORMError(errorNumber: number, message?: string): void;
handleValueAccessException(e: Error, returnValue: string): string;
```

By following these standards, we can ensure consistency across the codebase and make it easier for developers to
understand and use the API.
