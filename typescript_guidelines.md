# TypeScript Style Guide for scorm-again

This style guide outlines the conventions and best practices for TypeScript development in the SCORM
Again project.
Following these guidelines will ensure code consistency, maintainability, and quality across the
codebase.

## Table of Contents

1. [TypeScript Configuration](#typescript-configuration)
2. [Code Organization](#code-organization)
3. [Naming Conventions](#naming-conventions)
4. [Types and Interfaces](#types-and-interfaces)
5. [Classes and OOP](#classes-and-oop)
6. [Functions](#functions)
7. [Error Handling](#error-handling)
8. [Comments and Documentation](#comments-and-documentation)
9. [Common Pitfalls to Avoid](#common-pitfalls-to-avoid)
10. [Testing](#testing)

## TypeScript Configuration

- Use the project's `tsconfig.json` settings, which enforce strict type checking with
  `noImplicitAny` and
  `noImplicitOverride`.
- Target ES5 for compatibility but use ES2015 modules.
- Enforce consistent casing in file names with `forceConsistentCasingInFileNames`.

## Code Organization

### File Structure

- Organize code by feature or domain rather than by type.
- Keep files focused on a single responsibility.
- Aim to keep files under 500 lines; consider refactoring larger files into smaller, more focused
  modules.
- Use barrel files (index.ts) to simplify imports from directories with multiple exports.

### Imports

- Use ES6 import syntax.
- Group imports in the following order, separated by blank lines:
   1. External libraries
   2. Project modules
   3. Relative imports
- Sort imports alphabetically within each group.
- Use named imports rather than namespace imports.

```typescript
// Good
import {useState, useEffect} from "react";
import {ErrorCode} from "./constants/error_codes";
import {formatMessage} from "./utilities";

// Avoid
import * as React from "react";
```

## Naming Conventions

- Use `PascalCase` for class names, interfaces, and type aliases.
- Use `camelCase` for variables, functions, and method names.
- Use `UPPER_SNAKE_CASE` for constants and enum values.
- Use descriptive names that clearly communicate purpose.
- Prefix interfaces with `I` when they define a contract for a class (e.g., `IBaseAPI`).
- Prefix private class members with an underscore (e.g., `_checkObjectHasProperty`).

## Types and Interfaces

- Define explicit types for all variables, parameters, and return values.
- Use interfaces for object shapes that will be implemented by classes.
- Use type aliases for union types, intersection types, and complex types.
- Prefer union types over enums when possible.
- Use optional properties (with `?`) rather than properties that can be undefined.
- Export types and interfaces that are used across multiple files.

```typescript
// Good
export type Settings = {
   autocommit?: boolean;
   logLevel?: LogLevel;
};

// Avoid
export type Settings = {
   autocommit: boolean | undefined;
   logLevel: LogLevel | undefined;
};
```

## Classes and OOP

- Follow the single responsibility principle; each class should have one reason to change.
- Use inheritance sparingly; prefer composition over inheritance.
- Implement interfaces to define contracts.
- Make properties private or protected unless they need to be public.
- Use getters and setters for properties that require validation or transformation.
- Override methods explicitly with the `override` keyword.
- Initialize class properties in the constructor when possible.

```typescript
class BaseAPI implements IBaseAPI {
   private _settings: Settings;

   constructor(settings: Settings) {
      this._settings = {...DefaultSettings, ...settings};
   }

   // Methods...
}
```

## Functions

- Keep functions small and focused on a single task.
- Use arrow functions for callbacks and anonymous functions.
- Avoid using `any` as a parameter or return type.
- Use function overloading for functions that can accept different parameter types.
- Use default parameters instead of conditional logic to assign default values.
- Return early from functions to avoid deep nesting.

```typescript
// Good
function getValue(element: string, defaultValue = ''): string {
   if (!element) return defaultValue;
   // Rest of the function...
}

// Avoid
function getValue(element: string, defaultValue: string): string {
   let result;
   if (element) {
      // Complex logic...
      result = // ...
   } else {
      result = defaultValue;
   }
   return result;
}
```

## Error Handling

- Use custom error classes for domain-specific errors.
- Throw specific error types rather than generic Error objects.
- Handle errors at the appropriate level of abstraction.
- Use try/catch blocks for error handling, not for control flow.
- Log errors with appropriate context for debugging.
- Provide meaningful error messages.

```typescript
try {
   const value = this.getCMIValue(CMIElement);
   // Process value...
} catch (e) {
   return this.handleValueAccessException(e, "");
}
```

## Comments and Documentation

- Use JSDoc comments for public APIs and complex functions.
- Include parameter descriptions, return types, and examples in JSDoc comments.
- Write comments that explain "why" rather than "what" when the code is not self-explanatory.
- Keep comments up-to-date with code changes.
- Use TODO comments for temporary solutions or incomplete implementations.

```typescript
/**
 * Processes an HTTP request to the LMS.
 *
 * @param url - The URL to send the request to
 * @param params - The parameters to include in the request
 * @param immediate - Whether to send the request immediately
 * @returns A promise that resolves with the response
 */
function processHttpRequest(url: string, params: any, immediate: boolean): Promise<any> {
   // Implementation...
}
```

## Common Pitfalls to Avoid

- **Type Assertions**: Avoid using type assertions (`as Type`) when possible. Use type guards
  instead.
- **any Type**: Minimize the use of `any`. Use `unknown` if the type is truly unknown.
- **Callback Hell**: Use promises or async/await instead of nested callbacks.
- **Large Files**: Break down large files into smaller, more focused modules.
- **Complex Conditionals**: Simplify complex conditionals with helper functions or variables.
- **Magic Numbers/Strings**: Use constants for magic numbers and strings.
- **Mutable State**: Minimize mutable state. Use immutable data structures when possible.
- **Tight Coupling**: Avoid tight coupling between modules. Use dependency injection or service
  locators.
- **Use of `bind`**: Avoid using `bind` to set the context of `this`, especially when refactoring
  code.

## Testing

- Write unit tests for all public APIs.
- Use descriptive test names that explain the expected behavior.
- Follow the Arrange-Act-Assert pattern in tests.
- Mock external dependencies in unit tests.
- Test edge cases and error conditions.
- Keep tests independent of each other.
- Use test coverage tools to identify untested code.
- All codes changes should be verified by running `npx vitest --coverage --run --reporter=dot`

```typescript
describe('BaseAPI', () => {
   describe('getValue', () => {
      it('should return the value when the element exists', () => {
         // Arrange
         const api = new BaseAPI();
         // Act
         const result = api.getValue('element');
         // Assert
         expect(result).toBe('expected value');
      });

      it('should throw an error when the element does not exist', () => {
         // Arrange
         const api = new BaseAPI();
         // Act & Assert
         expect(() => api.getValue('nonexistent')).toThrow();
      });
   });
});
````

By following these guidelines, we can maintain a consistent, high-quality codebase that is easy to
understand, extend,
and maintain.
