# SCORM Again - Live Demo

This directory contains interactive demos for the scorm-again library.

## Live Demo

Visit [https://jcputney.github.io/scorm-again/](https://jcputney.github.io/scorm-again/) to see the demos in action.

## What's Included

- **index.html** - Landing page with links to all demos
- **scorm12.html** - SCORM 1.2 interactive example
- **scorm2004.html** - SCORM 2004 interactive example
- **RuntimeBasicCalls_SCORM12/** - ADL SCORM 1.2 test content
- **RuntimeBasicCalls_SCORM20043rdEdition/** - ADL SCORM 2004 test content

## How It Works

The demos use [Pretender.js](https://github.com/pretenderjs/pretender) to mock LMS API endpoints, allowing you to see exactly what data would be sent to a real LMS without needing a backend.

Each demo displays:
- The current state of the CMI object
- Console log output showing all API calls
- An iframe running actual SCORM content

## Running Locally

1. Build the project from the repository root:
   ```bash
   npm run build
   ```

2. Download and extract the test modules:
   ```bash
   mkdir -p demo/modules
   curl -L -o demo/modules/AllGolfExamples.zip https://cdn.noverant.com/AllGolfExamples.zip
   cd demo/modules && unzip AllGolfExamples.zip
   # Extract nested zips (RuntimeBasicCalls_SCORM12.zip, etc.)
   for f in *.zip; do [ "$f" != "AllGolfExamples.zip" ] && unzip "$f" -d "${f%.zip}"; done
   ```

3. Copy the dist files to the demo directory:
   ```bash
   cp -r dist demo/
   ```

4. Serve the demo directory with any static file server:
   ```bash
   npx serve demo
   ```

## Deployment

The demo is automatically deployed to GitHub Pages via GitHub Actions whenever changes are pushed to the master branch.
