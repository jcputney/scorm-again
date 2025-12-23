---
sidebar_position: 2
title: "Development Workflow"
description: "Step-by-step guide for developing and contributing to scorm-again"
---

# Development Workflow for scorm-again

This document outlines the recommended development workflow for contributing to the scorm-again
project. It covers
setting up your development environment, making changes, testing, and submitting pull requests.

## Table of Contents

1. [Setting Up Your Development Environment](#setting-up-your-development-environment)
2. [Development Workflow](#development-workflow)
3. [Code Style and Formatting](#code-style-and-formatting)
4. [Building the Project](#building-the-project)
5. [Submitting Changes](#submitting-changes)

## Setting Up Your Development Environment

### Prerequisites

- Node.js (LTS version recommended)
- npm
- git

### Initial Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/scorm-again.git
   cd scorm-again
   ```
3. Add the original repository as a remote to keep your fork in sync:
   ```bash
   git remote add upstream https://github.com/jcputney/scorm-again.git
   ```
4. Install dependencies:
   ```bash
   npm install
   ```

### Keeping Your Fork Updated

Regularly sync your fork with the upstream repository:

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

## Development Workflow

### Creating a Feature Branch

Always create a new branch for your changes:

```bash
git checkout -b feature/your-feature-name
```

Use a descriptive branch name that reflects the changes you're making. Common prefixes include:

- `feature/` for new features
- `bugfix/` for bug fixes
- `docs/` for documentation changes
- `test/` for test-only changes

### Making Changes

1. Make your code changes following the project's coding standards
2. Write or update tests for your changes
3. Run tests locally to ensure they pass:
   ```bash
   npm run test:min
   ```
4. Format your code:
   ```bash
   npm run prettier
   ```
5. Fix any linting issues:
   ```bash
   npm run fix
   ```

### Committing Changes

1. Stage your changes:
   ```bash
   git add .
   ```
2. Commit your changes with a descriptive message:

   ```bash
   git commit -m "A brief summary of the commit"
   ```

   For larger changes, use a multi-line commit message:

   ```bash
   git commit -m "A brief summary of the commit

   A paragraph describing what changed and its impact."
   ```

3. Push your changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Style and Formatting

scorm-again follows specific coding conventions to maintain consistency across the codebase:

1. Use the TypeScript style guide in `typescript_guidelines.md`
2. Run Prettier to automatically format your code:
   ```bash
   npm run prettier
   ```
3. Run ESLint to check for and fix code style issues:
   ```bash
   npm run fix
   ```

Key style points:

- Use 2 spaces for indentation (soft tabs)
- Always put spaces after list items and method parameters
- Use spaces around operators and hash arrows
- Follow the naming conventions in the style guide

## Building the Project

### Development Build

To build the project during development:

```bash
npm run build:all
```

This will create the following files in the `dist` directory:

- `scorm-again.js` - The full library
- `scorm-again.min.js` - Minified version of the full library
- `scorm12.js` - SCORM 1.2 API only
- `scorm2004.js` - SCORM 2004 API only

### Testing Your Build

After building, you can test the library by:

1. Including it in an HTML file:
   ```html
   <script src="dist/scorm-again.js"></script>
   ```
2. Creating a simple SCORM content package that uses the library
3. Testing the package in a SCORM-compatible LMS or SCORM Cloud

## Submitting Changes

### Creating a Pull Request

1. Ensure all tests pass:
   ```bash
   npm run test:min
   ```
2. Push your changes to your fork if you haven't already:
   ```bash
   git push origin feature/your-feature-name
   ```
3. Go to the [scorm-again repository](https://github.com/jcputney/scorm-again) on GitHub
4. Click "New Pull Request"
5. Select "compare across forks"
6. Select your fork and branch as the source
7. Add a clear title and description for your pull request:
   - Describe what the changes do
   - Reference any related issues using the GitHub issue number (e.g., "Fixes #123")
   - Mention any notable implementation details or design decisions
   - List any manual testing you've performed

### Pull Request Review Process

1. Maintainers will review your code
2. Automated tests will run on your pull request
3. You may be asked to make changes based on feedback
4. Once approved, your changes will be merged into the main branch

### After Your Pull Request is Merged

1. Update your local main branch:
   ```bash
   git checkout main
   git pull upstream main
   ```
2. Delete your feature branch (optional):
   ```bash
   git branch -d feature/your-feature-name
   ```
3. Update your fork on GitHub:
   ```bash
   git push origin main
   ```

By following this workflow, you'll help maintain a high-quality codebase and make the review process
smoother for
everyone involved.
