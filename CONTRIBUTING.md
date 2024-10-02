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

  * We indent using two spaces (soft tabs)
  * We ALWAYS put spaces after list items and method parameters (`[1, 2, 3]`, not `[1,2,3]`), around operators (`x += 1`, not `x+=1`), and around hash arrows.
  * `eslint ./src --fix` should always be run before submitting a pull request. Otherwise, the build could fail if you have issues with the formatting of your code.
