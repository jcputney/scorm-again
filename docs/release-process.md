# Release Process

This document outlines the release process for SCORM Again.

## Automated Release Process

SCORM Again uses an automated release process to ensure consistent and reliable releases. The process is built around [standard-version](https://github.com/conventional-changelog/standard-version) for versioning and changelog generation, and GitHub Actions for CI/CD.

## Release Types

There are several types of releases that can be created:

- **Regular Release**: A standard release with a version number following semver (e.g., 1.2.3)
- **Alpha Release**: A prerelease with an alpha tag (e.g., 1.2.3-alpha.0)
- **Beta Release**: A prerelease with a beta tag (e.g., 1.2.3-beta.0)

## Release Commands

The following commands are available for creating releases:

- `yarn release`: Creates a regular release, runs tests, builds the project, and publishes to npm
- `yarn release:prepare`: Bumps the version and generates a changelog without publishing
- `yarn release:alpha`: Creates an alpha prerelease
- `yarn release:beta`: Creates a beta prerelease
- `yarn release:publish`: Pushes the release to GitHub and publishes to npm

## Release Process Steps

### Automated Process

1. Run `yarn release` to create a new release
   - This will:
     - Run tests to ensure everything is working
     - Bump the version based on commit messages
     - Generate a changelog
     - Create a git tag
     - Build the project
     - Push to GitHub
     - Publish to npm

### Manual Process

If you need more control over the release process, you can follow these steps:

1. Ensure all changes are committed and pushed to the master branch
2. Run `yarn test:min` and `yarn test:integration:ci` to ensure all tests pass
3. Run one of the following commands:
   - `yarn release:prepare` for a regular release
   - `yarn release:alpha` for an alpha release
   - `yarn release:beta` for a beta release
4. Review the changes to package.json and CHANGELOG.md
5. Run `yarn compile` and `yarn compile:modern` to build the project
6. Run `yarn release:publish` to push the release to GitHub and publish to npm

## GitHub Releases

When a new release is created on GitHub:

1. A GitHub Actions workflow is triggered
2. The workflow runs tests, builds the project, and publishes to npm
3. The GitHub release is updated with the changelog information

## Commit Message Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages. This enables automatic version bumping and changelog generation.

The commit message should be structured as follows:

```
<type>(<scope>): <subject>
```

Where `<type>` is one of:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts

The `<scope>` is optional and can be anything specifying the place of the commit change.

The `<subject>` contains a succinct description of the change.

Examples:

- `feat(api): add ability to specify custom error messages`
- `fix: correct handling of null values in CMI data`
- `docs: update README with new API examples`

## Version Bumping

The version is automatically bumped based on the commit messages:

- `feat`: Bumps the minor version (1.0.0 -> 1.1.0)
- `fix`, `refactor`, `perf`: Bumps the patch version (1.0.0 -> 1.0.1)
- `BREAKING CHANGE` in the commit body: Bumps the major version (1.0.0 -> 2.0.0)

## Troubleshooting

If you encounter issues with the release process:

1. Ensure all tests are passing
2. Check that you have the necessary permissions to push to the repository and publish to npm
3. Verify that the NPM_TOKEN secret is set up in the GitHub repository settings
4. If the automatic process fails, you can perform the steps manually