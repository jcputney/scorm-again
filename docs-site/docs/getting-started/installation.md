---
sidebar_position: 2
title: "Installation"
description: "How to install and include scorm-again in your project using npm, yarn, CDN, or script tags"
---

# Installation

scorm-again can be installed and used in multiple ways depending on your project setup. This guide covers all installation methods.

## Package Managers

### npm

```bash
npm install scorm-again
```

### yarn

```bash
yarn add scorm-again
```

## CDN Usage

For quick prototyping or simple integrations, you can include scorm-again directly from a CDN:

### jsDelivr

```html
<!-- Full library (both SCORM 1.2 and SCORM 2004) -->
<script src="https://cdn.jsdelivr.net/npm/scorm-again@latest/dist/scorm-again.min.js"></script>

<!-- SCORM 1.2 only -->
<script src="https://cdn.jsdelivr.net/npm/scorm-again@latest/dist/scorm12.min.js"></script>

<!-- SCORM 2004 only -->
<script src="https://cdn.jsdelivr.net/npm/scorm-again@latest/dist/scorm2004.min.js"></script>
```

::: tip
For production, specify an exact version instead of `@latest` to ensure stability:
```html
<script src="https://cdn.jsdelivr.net/npm/scorm-again@3.0.0/dist/scorm2004.min.js"></script>
```
:::

## Local Script Tag

If you've installed scorm-again via npm or downloaded the distribution files, you can include them directly:

```html
<!-- Full library -->
<script type="text/javascript" src="/node_modules/scorm-again/dist/scorm-again.min.js"></script>

<!-- SCORM 1.2 only -->
<script type="text/javascript" src="/node_modules/scorm-again/dist/scorm12.min.js"></script>

<!-- SCORM 2004 only -->
<script type="text/javascript" src="/node_modules/scorm-again/dist/scorm2004.min.js"></script>
```

## Module Imports

### ES Modules (ESM)

For modern JavaScript projects using ES modules:

```javascript
// Import both APIs
import { Scorm12API, Scorm2004API } from 'scorm-again';

// Import only SCORM 1.2
import { Scorm12API } from 'scorm-again/scorm12';

// Import only SCORM 2004
import { Scorm2004API } from 'scorm-again/scorm2004';

// Import minified version for smaller bundle size
import { Scorm2004API } from 'scorm-again/scorm2004/min';

// Import cross-frame components
import CrossFrameLMS from 'scorm-again/cross-frame-lms';
import CrossFrameAPI from 'scorm-again/cross-frame-api';
```

### CommonJS

For Node.js or bundlers with CommonJS support:

```javascript
// Full library
const { Scorm12API, Scorm2004API } = require('scorm-again');

// Individual APIs
const { Scorm12API } = require('scorm-again/scorm12');
const { Scorm2004API } = require('scorm-again/scorm2004');
```

## TypeScript Support

TypeScript types are included with the package and work automatically:

```typescript
import { Scorm12API, Scorm2004API, Settings } from 'scorm-again';

// Create an instance with typed settings
const settings: Settings = {
  autocommit: true,
  logLevel: 'DEBUG',
  lmsCommitUrl: 'https://your-lms.com/api/scorm/commit'
};

const api = new Scorm2004API(settings);
```

TypeScript will provide full IntelliSense and type checking for:
- API settings and configuration
- CMI data structures
- Event handlers
- Method signatures

## Bundle Size Optimization

To minimize bundle size in production:

### 1. Import Only What You Need

```javascript
// Good - imports only SCORM 2004
import { Scorm2004API } from 'scorm-again/scorm2004/min';

// Avoid - imports both SCORM 1.2 and 2004
import { Scorm2004API } from 'scorm-again';
```

### 2. Use Minified Versions

Always use the `.min.js` versions in production for smaller file sizes:

```javascript
// Development
import { Scorm2004API } from 'scorm-again/scorm2004';

// Production
import { Scorm2004API } from 'scorm-again/scorm2004/min';
```

### 3. Tree Shaking

Modern bundlers (webpack, Rollup, Vite) will automatically tree-shake unused code when using ES modules. Make sure your bundler is configured for production mode:

```javascript
// webpack.config.js
module.exports = {
  mode: 'production',
  // ... other config
};
```

### 4. Code Splitting

If you support both SCORM standards, consider lazy-loading the API based on the content type:

```javascript
// Lazy load SCORM 1.2
const loadScorm12 = () => import('scorm-again/scorm12/min');

// Lazy load SCORM 2004
const loadScorm2004 = () => import('scorm-again/scorm2004/min');

// Use based on content type
if (contentType === 'scorm12') {
  const { Scorm12API } = await loadScorm12();
  window.API = new Scorm12API(settings);
} else {
  const { Scorm2004API } = await loadScorm2004();
  window.API_1484_11 = new Scorm2004API(settings);
}
```

## Internet Explorer 11 Support

The script builds in `dist/*.js` are compiled to ES5 syntax, but they do not include polyfills.
IE11 lacks many built-ins that scorm-again uses, including `Promise`, `Symbol`, `Array.from`,
`Array.prototype.includes`, `Object.entries`, and `Object.assign`. IE11's own `Map` and `Set` also
ignore values passed to their constructors. Before scorm-again, load:

- an ES2015+ polyfill set that replaces those built-ins, such as
  [core-js](https://github.com/zloirock/core-js)
- a fetch polyfill, such as [whatwg-fetch](https://github.com/JakeChampion/fetch)

```html
<!-- Load the polyfills before scorm-again -->
<script
  src="https://cdn.jsdelivr.net/npm/core-js-bundle@3.50.0/minified.js"
  integrity="sha384-FFQ9vMUG5ncCF536DGix0yCvJeaR1Td99BfLaGw6OZDOA/jCgMOK3an7oNGZu4FJ"
  crossorigin="anonymous"></script>
<script
  src="https://cdn.jsdelivr.net/npm/whatwg-fetch@3.6.2/dist/fetch.umd.js"
  integrity="sha384-f4g84XvA2ATeKmNi2159tY4jChaN8yA/BoQycHRLIH4K3aOTU0mxvAmPqUQkWk+X"
  crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/scorm-again@latest/dist/scorm2004.min.js"></script>
```

With npm, `import` resolves to the ES2022 build, so your bundler must also compile scorm-again to
ES5 when it targets IE11:

```bash
npm install core-js whatwg-fetch
```

```javascript
import 'core-js/stable';
import 'whatwg-fetch';
import { Scorm2004API } from 'scorm-again/scorm2004';
```

When `navigator.sendBeacon` is missing, as in IE11, scorm-again sends the termination commit with a
regular request instead, so you do not need a beacon polyfill. Use the default synchronous commits
in IE11: the termination commit is then a synchronous request, which IE11 finishes before the page
closes. With `useAsynchronousCommits: true`, it goes through the fetch polyfill instead. That
polyfill cannot keep a request alive after the page closes, so the LMS may not receive the
termination commit.

Cross-frame communication does not work in IE11. `CrossFrameAPI` relies on `Proxy`, which IE11
lacks and which cannot be polyfilled.

IE11 is not part of the automated browser tests.

## Verification

To verify the installation worked correctly, you can check the version:

### Browser Console

```javascript
// After including via script tag
console.log(window.Scorm2004API);
// Should output the API constructor function
```

### Node.js/Module

```javascript
import { Scorm2004API } from 'scorm-again';
console.log(Scorm2004API);
// Should output the API constructor function
```

## Next Steps

Now that you have scorm-again installed, continue to the [Quick Start](./quick-start.md) guide to learn how to create and configure API instances.
