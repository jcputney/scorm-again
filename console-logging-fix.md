# Console Logging Fix

## Issue

Console messages were no longer being logged in the minified versions of the scorm-again library.

## Cause

The issue was caused by the `drop_console: true` setting in the TerserPlugin configuration in
webpack.config.js. This setting removes all console.log statements from the minified code, which is
why console messages were not being logged.

## Fix

The fix was to change the setting to `drop_console: false` in the TerserPlugin configuration. This
preserves console messages in the minified code.

```javascript
// Before
compress: {
  passes: 3,
  drop_console: true,
  // other settings...
},

// After
compress: {
  passes: 3,
  drop_console: false, // Changed from true to preserve console messages
  // other settings...
},
```

## Why This Happened

As part of the optimization efforts to reduce the file size of the scorm-again library, we enabled
aggressive minification settings, including `drop_console: true`. While this helps reduce the file
size, it also removes all console messages, which can make debugging more difficult.

## When to Use Each Setting

- `drop_console: true`: Use in production builds where file size is critical and console messages
  are not needed.
- `drop_console: false`: Use during development or when debugging is important, as it preserves
  console messages.

## File Size Impact

Preserving console messages will slightly increase the size of the minified files, but the impact is
minimal compared to the benefits of having console messages available for debugging.
