---
title: Demo
description: Interactive SCORM demos for scorm-again
---

# Interactive Demos

Try out scorm-again with real SCORM content. These demos use the Golf Examples
content package to demonstrate full API functionality.

<div class="demo-grid">

<div class="demo-card">

### SCORM 1.2 - Basic

Test the SCORM 1.2 API implementation with the Golf Examples content package.
Includes full CMI data model support and lesson tracking.

<a class="demo-launch" href="/scorm-again/demo/scorm12.html" target="_blank" rel="noreferrer">Launch demo →</a>

</div>

<div class="demo-card">

### SCORM 1.2 - Previously Launched

Simulates a learner returning to continue a previously started course.
Demonstrates how scorm-again restores CMI data from prior sessions.

<a class="demo-launch" href="/scorm-again/demo/scorm12.html?existing=true" target="_blank" rel="noreferrer">Launch demo →</a>

</div>

<div class="demo-card">

### SCORM 1.2 - Flattened Format

Uses the "flattened" data commit format where CMI elements are sent as flat
key-value pairs instead of nested JSON objects.

<a class="demo-launch" href="/scorm-again/demo/scorm12.html?dataCommitFormat=flattened" target="_blank" rel="noreferrer">Launch demo →</a>

</div>

<div class="demo-card">

### SCORM 2004 - Basic

Test the SCORM 2004 API implementation with sequencing and navigation support.
Includes the complete CMI data model for SCORM 2004 4th Edition.

<a class="demo-launch" href="/scorm-again/demo/scorm2004.html" target="_blank" rel="noreferrer">Launch demo →</a>

</div>

<div class="demo-card">

### SCORM 2004 - Previously Launched

Simulates a learner returning to continue a previously started course.
Demonstrates how scorm-again restores CMI data from prior sessions.

<a class="demo-launch" href="/scorm-again/demo/scorm2004.html?existing=true" target="_blank" rel="noreferrer">Launch demo →</a>

</div>

<div class="demo-card">

### SCORM 2004 - Flattened Format

Uses the "flattened" data commit format where CMI elements are sent as flat
key-value pairs instead of nested JSON objects.

<a class="demo-launch" href="/scorm-again/demo/scorm2004.html?dataCommitFormat=flattened" target="_blank" rel="noreferrer">Launch demo →</a>

</div>

</div>

## How It Works

Each demo launches in a new tab with a simulated LMS environment. The SCORM
content runs in an iframe and communicates with the scorm-again API. You can
view API calls and data in the debug panel.

These demos use a mock HTTP backend - no data is sent to any server. All SCORM
data is logged to the browser console and displayed in the UI.
