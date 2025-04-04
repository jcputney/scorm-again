# Testing Strategy for SCORM Again

This document outlines the testing strategy for the SCORM Again project, including the types of tests, testing tools,
test organization, and best practices for writing effective tests.

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Testing Tools](#testing-tools)
3. [Test Organization](#test-organization)
4. [Types of Tests](#types-of-tests)
5. [Writing Effective Tests](#writing-effective-tests)
6. [Running Tests](#running-tests)
7. [Test Coverage](#test-coverage)
8. [Continuous Integration](#continuous-integration)

## Testing Philosophy

SCORM Again follows these testing principles:

1. **Test-Driven Development**: Where possible, write tests before implementing features to ensure code meets
   requirements.
2. **Comprehensive Coverage**: Aim for high test coverage, especially for critical functionality.
3. **Maintainable Tests**: Tests should be easy to understand and maintain.
4. **Fast Execution**: Tests should run quickly to provide rapid feedback during development.
5. **Isolation**: Tests should be independent of each other and not rely on external services.

## Testing Tools

SCORM Again uses the following testing tools:

1. **Mocha**: The primary test runner for executing tests.
2. **Sinon**: For creating test spies, stubs, and mocks.
3. **c8**: For measuring code coverage.
4. **TypeScript**: Tests are written in TypeScript for type safety.

## Test Organization

Tests are organized to mirror the source code structure:

```
test/
├── cmi/                  # Tests for CMI data models
├── constants/            # Tests for constants
├── services/             # Tests for services
├── types/                # Tests for type definitions
├── AICC.spec.ts          # Tests for AICC API
├── BaseAPI.spec.ts       # Tests for BaseAPI
├── Scorm12API.spec.ts    # Tests for SCORM 1.2 API
├── Scorm2004API.spec.ts  # Tests for SCORM 2004 API
├── utilities.spec.ts     # Tests for utility functions
└── helpers/              # Test helper functions
```

Each test file corresponds to a source file, making it easy to locate tests for specific functionality.

## Types of Tests

SCORM Again includes several types of tests:

### Unit Tests

Unit tests verify that individual components (functions, classes, methods) work correctly in isolation:

```typescript
describe('BaseAPI', () => {
  describe('getValue', () => {
    it('should return the value when the element exists', () => {
      // Arrange
      const api = new BaseAPI();
      api.cmi.core.student_name = 'Test Student';

      // Act
      const result = api.getValue('cmi.core.student_name');

      // Assert
      expect(result).toBe('Test Student');
    });
  });
});
```

### Integration Tests

Integration tests verify that multiple components work together correctly:

#### Programmatic Integration Tests

These tests verify that different components of the API work together correctly in a programmatic context:

```typescript
describe('SCORM 1.2 API Integration', () => {
  it('should initialize, set values, and terminate correctly', () => {
    // Arrange
    const api = new Scorm12API();

    // Act & Assert
    expect(api.LMSInitialize('')).toBe('true');
    expect(api.LMSSetValue('cmi.core.lesson_status', 'completed')).toBe('true');
    expect(api.LMSCommit('')).toBe('true');
    expect(api.LMSFinish('')).toBe('true');
  });
});
```

#### Browser-Based Integration Tests

Browser-based integration tests verify that the library works correctly in an actual browser environment with real SCORM
modules. These tests use Playwright to automate browser interactions and test against real SCORM content.

##### Setup

The integration test setup:

1. Checks for locally cached test modules
2. Downloads test modules if they don't exist
3. Extracts the modules
4. Starts a lightweight web server for Playwright tests to run against

##### Running Integration Tests

To run the browser-based integration tests:

1. Ensure you have the necessary dependencies installed:
   ```
   yarn install
   ```

2. Run the integration tests:
   ```
   yarn test:integration
   ```

This will:

- Download the test modules if they don't exist locally
- Start a local web server
- Run the Playwright tests against the modules
- Generate a report of the test results

##### Test Modules

The test modules are downloaded from [SCORM.com's Golf Examples](https://cdn.noverant.com/AllGolfExamples.zip). These
modules provide various SCORM content for testing different scenarios.

The modules are stored in the `test/integration/modules` directory, which is ignored by git to avoid committing large
binary files to the repository.

##### Writing Browser-Based Integration Tests

Browser-based integration tests are written using Playwright and are located in the `test/integration` directory. These
tests:

1. Navigate to a SCORM module
2. Interact with the module
3. Verify that the SCORM API functions correctly
4. Check for proper data storage and retrieval

Example:

```typescript
test('should load a SCORM module and initialize correctly', async ({ page }) => {
  // Navigate to the module
  await page.goto('/GolfExample_SCORM12/shared/launchpage.html');

  // Verify the API is available
  const apiExists = await page.evaluate(() => {
    return typeof window.API !== 'undefined';
  });
  expect(apiExists).toBeTruthy();

  // Test API functionality
  const result = await page.evaluate(() => {
    return window.API.LMSInitialize('');
  });
  expect(result).toBe('true');
});
```

### Functional Tests

Functional tests verify that the API behaves correctly from an end-user perspective:

```typescript
describe('SCORM 1.2 Functional Tests', () => {
  it('should track completion status correctly', () => {
    // Arrange
    const api = new Scorm12API();
    api.LMSInitialize('');

    // Act
    api.LMSSetValue('cmi.core.lesson_status', 'incomplete');
    api.LMSSetValue('cmi.core.score.raw', '80');
    api.LMSSetValue('cmi.core.score.min', '0');
    api.LMSSetValue('cmi.core.score.max', '100');
    api.LMSCommit('');

    // Assert
    expect(api.LMSGetValue('cmi.core.lesson_status')).toBe('incomplete');

    // Act again
    api.LMSSetValue('cmi.core.lesson_status', 'completed');
    api.LMSCommit('');

    // Assert again
    expect(api.LMSGetValue('cmi.core.lesson_status')).toBe('completed');
  });
});
```

### Edge Case Tests

Edge case tests verify that the API handles unusual or boundary conditions correctly:

```typescript
describe('Edge Cases', () => {
  it('should handle empty values correctly', () => {
    // Arrange
    const api = new Scorm12API();
    api.LMSInitialize('');

    // Act & Assert
    expect(api.LMSSetValue('cmi.core.student_name', '')).toBe('true');
    expect(api.LMSGetValue('cmi.core.student_name')).toBe('');
  });

  it('should handle invalid CMI elements', () => {
    // Arrange
    const api = new Scorm12API();
    api.LMSInitialize('');

    // Act & Assert
    expect(api.LMSSetValue('cmi.invalid.element', 'value')).toBe('false');
    expect(api.LMSGetLastError()).not.toBe('0');
  });
});
```

## Writing Effective Tests

Follow these best practices when writing tests:

### Test Structure

Use the Arrange-Act-Assert pattern:

```typescript
it('should do something specific', () => {
  // Arrange - set up the test
  const api = new Scorm12API();
  api.LMSInitialize('');

  // Act - perform the action being tested
  const result = api.LMSSetValue('cmi.core.lesson_status', 'completed');

  // Assert - verify the expected outcome
  expect(result).toBe('true');
  expect(api.LMSGetValue('cmi.core.lesson_status')).toBe('completed');
});
```

### Test Naming

Use descriptive test names that explain the expected behavior:

```typescript
// Good
it('should return false when setting a read-only element', () => {
  // Test code
});

// Avoid
it('test read-only element', () => {
  // Test code
});
```

### Test Independence

Each test should be independent and not rely on the state from other tests:

```typescript
// Before each test, reset the API
beforeEach(() => {
  api = new Scorm12API();
  api.LMSInitialize('');
});

// After each test, terminate the API
afterEach(() => {
  api.LMSFinish('');
  api = null;
});
```

### Mocking and Stubbing

Use mocks and stubs to isolate the code being tested:

```typescript
// Mock HTTP requests
const httpServiceStub = sinon.stub(HttpService.prototype, 'processHttpRequest')
  .resolves({ result: true, errorCode: 0 });

// Test code that uses HttpService

// Restore the stub after the test
httpServiceStub.restore();
```

## Running Tests

SCORM Again provides several scripts for running tests:

### Running Unit Tests Only

To run only unit tests (excluding integration tests):

```bash
# Run unit tests with list reporter
yarn test

# Run unit tests with minimal reporter
yarn test:min

# Run unit tests with coverage reporting
yarn test:coverage
```

### Running Integration Tests Only

To run only integration tests:

```bash
# Run integration tests using Playwright
yarn test:integration
```

### Running All Tests

To run both unit and integration tests together:

```bash
# Run all tests with list reporter
yarn test:all

# Run all tests with coverage reporting
yarn test:coverage:all
```

### Running Specific Tests

You can run specific test files by providing the file path:

```bash
# Run a specific unit test file
yarn test test/Scorm12API.spec.ts

# Run a specific integration test file
npx playwright test test/integration/RuntimeBasicCalls_SCORM12.spec.ts
```

## Test Coverage

SCORM Again uses c8 to measure test coverage. The coverage report shows:

- Line coverage: Percentage of code lines executed during tests
- Branch coverage: Percentage of code branches (if/else, switch) executed during tests
- Function coverage: Percentage of functions called during tests
- Statement coverage: Percentage of statements executed during tests

To generate a coverage report:

```bash
yarn test:coverage
```

The coverage report is generated in the `coverage` directory.

### Coverage Goals

- Aim for at least 80% overall coverage
- Critical components should have closer to 100% coverage
- Focus on testing complex logic and error handling paths

## Continuous Integration

SCORM Again uses GitHub Actions for continuous integration:

1. **Automated Testing**: All tests run automatically on pull requests and commits to the main branch
2. **Coverage Reporting**: Test coverage is reported to ensure it meets the required thresholds
3. **Linting**: Code style is checked using ESLint
4. **Build Verification**: The project is built to ensure it compiles correctly

### CI Workflow

The CI workflow includes:

1. Checking out the code
2. Setting up Node.js
3. Installing dependencies
4. Running linting checks
5. Running tests
6. Building the project
7. Reporting test coverage

### Handling CI Failures

If CI fails:

1. Check the GitHub Actions logs to identify the issue
2. Fix any failing tests or linting issues
3. Ensure code coverage meets the required thresholds
4. Push the fixes to your branch
5. CI will automatically run again

By following this testing strategy, SCORM Again maintains a high level of code quality and reliability, ensuring that
the library works correctly across different environments and use cases.
