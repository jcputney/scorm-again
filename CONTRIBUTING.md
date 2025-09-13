# How to contribute

I'm really glad you're reading this, because this project could definitely benefit from having some more eyes on it. I welcome any and all feedback and contributions to this project! I'm sure it would do with some cleanup and refactoring, and could definitely use some more test cases.

## Testing

I have written 1700+ test cases for the project, but testing is nowhere near what it should be. I try to add test cases as I have time or as an issue comes up. For pull requests, please create test cases for any new code that gets added.

If you would like to contribute, but don't know where to get started, we could absolutely use more test cases. The CMI test cases are pretty well covered, but there are always edge cases to think of, and the API test cases are definitely lacking. They are more difficult to create and setup, but obviously cover the bulk of the functionality as well.

## Submitting changes

Please send a [GitHub Pull Request to scorm-again](https://github.com/jcputney/scorm-again/pull/new/master) with a clear list of what you've done (read more about [pull requests](http://help.github.com/pull-requests/)). We can always use more test coverage, so test-only pull requests are always more than welcome. Please follow the coding conventions (below) and make sure all of your commits are atomic (one feature per commit).

Always write a clear log message for your commits. One-line messages are fine for small changes, but bigger changes should look like this:

    $ git commit -m "A brief summary of the commit
    >
    > A paragraph describing what changed and its impact."

## Coding conventions

Start reading our code, and you'll get the hang of it. I try to optimize for readability:

- We indent using two spaces (soft tabs)
- We ALWAYS put spaces after list items and method parameters (`[1, 2, 3]`, not `[1,2,3]`), around operators (`x += 1`, not `x+=1`), and around hash arrows.
- `eslint ./src --fix` should always be run before submitting a pull request. Otherwise, the build could fail if you have issues with the formatting of your code.

## dist/ policy and local development

This repository treats `dist/` as a build artifact that is only updated by CI on pushes to the `master` branch. Please do not include `dist/` changes in pull requests — they will be rejected by CI.

During local development, if you build and end up with modified files under `dist/`, you can tell Git to ignore local edits to that folder to keep your working tree clean:

```
npm run dev:dist:ignore   # ignore local changes to dist/
npm run dev:dist:track    # re-enable tracking of dist/
```

Notes:
- These commands use `git update-index --(no-)skip-worktree` and only affect your local clone.
- CI will always build `dist/` fresh and commit the results back to `master`.

### Optional: pre-commit hook to block dist/

You can opt in to a local Git pre-commit hook that prevents accidentally committing `dist/` changes:

```
npm run hooks:install   # sets core.hooksPath to .githooks
```

Override once (if truly needed):

```
ALLOW_DIST_COMMIT=1 git commit -m "…"
```
