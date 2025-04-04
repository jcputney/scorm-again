# Testing in SCORM Again

This document explains how to run different types of tests in the SCORM Again project.

## Test Types

The project has two types of tests:

1. **Unit Tests**: These test individual components in isolation. They are located in the `test` directory (excluding
   the `integration` subdirectory).
2. **Integration Tests**: These test how components work together, often involving browser interactions. They are
   located in the `test/integration` directory.

## Running Tests

The project provides several scripts for running tests:

### Unit Tests Only

To run only unit tests (excluding integration tests):

```bash
# Run unit tests with list reporter
yarn test

# Run unit tests with minimal reporter
yarn test:min

# Run unit tests with coverage reporting
yarn test:coverage
```

### Integration Tests Only

To run only integration tests:

```bash
# Run integration tests using Playwright
yarn test:integration
```

### All Tests

To run both unit and integration tests together:

```bash
# Run all tests with list reporter
yarn test:all

# Run all tests with coverage reporting
yarn test:coverage:all
```

## Test Configuration

The test configuration is managed through several files:

- `.mocharc.json`: Configuration for running unit tests only (excludes integration tests)
- `.mocharc.all.json`: Configuration for running all tests (both unit and integration)
- `playwright.config.ts`: Configuration for running integration tests with Playwright

## Adding New Tests

### Unit Tests

Unit tests should be placed in the `test` directory (not in the `integration` subdirectory) and should have the
`.spec.ts` extension.

### Integration Tests

Integration tests should be placed in the `test/integration` directory and should also have the `.spec.ts` extension.
