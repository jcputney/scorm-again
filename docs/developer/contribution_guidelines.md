# Contribution Guidelines for scorm-again

Thank you for your interest in contributing to scorm-again! This document provides detailed
guidelines for contributing
to the project, including code standards, pull request process, and best practices.

## Table of Contents

1. [Types of Contributions](#types-of-contributions)
2. [Code Standards](#code-standards)
3. [Documentation Standards](#documentation-standards)
4. [Testing Requirements](#testing-requirements)
5. [Pull Request Process](#pull-request-process)
6. [Community Guidelines](#community-guidelines)

## Types of Contributions

We welcome various types of contributions to scorm-again:

### Code Contributions

- Bug fixes
- Performance improvements
- New features
- Refactoring for better maintainability
- Dependency updates

### Documentation Contributions

- API documentation improvements
- Usage examples
- Tutorials
- Fixing typos or clarifying existing documentation

### Testing Contributions

- Adding test cases for existing functionality
- Improving test coverage
- Creating test utilities
- Adding integration tests

### Other Contributions

- Reporting bugs
- Suggesting enhancements
- Helping with issue triage
- Answering questions in discussions or issues

## Code Standards

scorm-again follows strict coding standards to maintain a high-quality, consistent codebase:

### TypeScript Guidelines

- Follow the TypeScript style guide in `.junie/guidelines.md`
- Use TypeScript's strict mode
- Provide explicit types for all parameters and return values
- Avoid using `any` type when possible
- Use interfaces for object shapes that will be implemented by classes
- Use type aliases for union types, intersection types, and complex types

### Naming Conventions

- Use `PascalCase` for class names, interfaces, and type aliases
- Use `camelCase` for variables, functions, and method names
- Use `UPPER_SNAKE_CASE` for constants and enum values
- Prefix interfaces with `I` when they define a contract for a class (e.g., `IBaseAPI`)
- Prefix private class members with an underscore (e.g., `_checkObjectHasProperty`)

### Code Organization

- Keep files focused on a single responsibility
- Aim to keep files under 500 lines
- Organize imports as specified in the style guide
- Use barrel files (index.ts) to simplify imports from directories with multiple exports

### Error Handling

- Use custom error classes for domain-specific errors
- Throw specific error types rather than generic Error objects
- Handle errors at the appropriate level of abstraction
- Provide meaningful error messages

## Documentation Standards

Good documentation is crucial for the usability of scorm-again:

### Code Documentation

- Use JSDoc comments for all public methods and classes
- Include parameter descriptions, return types, and examples in JSDoc comments
- Document complex algorithms and business logic with clear comments
- Keep comments up-to-date with code changes

### API Documentation

- Provide clear examples for each API
- Document common use cases and patterns
- Include troubleshooting information for common issues
- Use consistent terminology throughout documentation

### README and Other Markdown Files

- Use clear, concise language
- Structure documents with appropriate headings
- Include a table of contents for longer documents
- Use code blocks with appropriate syntax highlighting

## Testing Requirements

Testing is a critical part of maintaining scorm-again's quality:

### Test Coverage

- All new code should have corresponding tests
- Aim for high test coverage, especially for critical functionality
- Test both success and error cases
- Test edge cases and boundary conditions

### Test Organization

- Organize tests to mirror the source code structure
- Use descriptive test names that explain the expected behavior
- Follow the Arrange-Act-Assert pattern in tests
- Keep tests independent of each other

### Running Tests

- Ensure all tests pass before submitting a pull request:
   ```bash
   yarn test:min
   ```
- Check test coverage when adding new features:
   ```bash
   yarn test:coverage
   ```

### Test-Only Contributions

- Test-only contributions are welcome and encouraged
- Focus on improving coverage for critical or complex code
- Add tests for edge cases and error conditions
- Improve existing tests for clarity and completeness

## Pull Request Process

Follow these steps to submit a pull request:

1. **Fork and Clone**: Fork the repository and clone it locally
2. **Branch**: Create a feature branch for your changes
3. **Develop**: Make your changes following the code standards
4. **Test**: Ensure all tests pass and add new tests as needed
5. **Document**: Update documentation to reflect your changes
6. **Format**: Run Prettier and ESLint to ensure code style compliance
7. **Commit**: Use clear, descriptive commit messages
8. **Push**: Push your changes to your fork
9. **Pull Request**: Submit a pull request with a clear description of your changes

### Pull Request Description

Include the following in your pull request description:

- What the changes do
- Why the changes are needed
- Any notable implementation details
- References to related issues
- Any manual testing you've performed
- Any potential concerns or areas for reviewer focus

### Review Process

- At least one maintainer will review your pull request
- Automated tests will run on your pull request
- You may be asked to make changes based on feedback
- Once approved, your changes will be merged

## Community Guidelines

scorm-again is a community project, and we value respectful and constructive interaction:

### Communication

- Be respectful and considerate in all communications
- Provide constructive feedback
- Be open to receiving feedback on your contributions
- Ask questions if something is unclear

### Issue Reporting

When reporting issues:

- Use a clear, descriptive title
- Provide detailed steps to reproduce the issue
- Include relevant information about your environment
- Mention any workarounds you've discovered
- Suggest a fix if you have ideas

### Feature Requests

When suggesting features:

- Clearly describe the problem the feature would solve
- Explain how the feature would benefit users
- Consider potential implementation approaches
- Be open to discussion about alternatives

By following these guidelines, you'll help maintain scorm-again as a high-quality, well-documented,
and well-tested
library that serves its users effectively.

Thank you for contributing to scorm-again!
