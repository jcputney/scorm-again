---
sidebar_position: 2
title: Player Wrapper Guide
description: Guide for building player UIs that respond to SCORM events using scorm-again, with production-ready patterns and working examples.
---
# Player Wrapper Guide

This guide explains how to build a player UI that responds to SCORM events using scorm-again. Whether you're building a new player from scratch or integrating with an existing system, this guide provides production-ready patterns and working examples.

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Architecture](#architecture)
4. [Part 1: Building from Scratch](#part-1-building-from-scratch)
   - [SCORM 1.2 Multi-SCO Player](#scorm-12-multi-sco-player)
   - [SCORM 2004 Simple Multi-SCO Player](#scorm-2004-simple-multi-sco-player)
   - [SCORM 2004 Sequenced Player](#scorm-2004-sequenced-player)
5. [Part 2: Integrating with Existing Players](#part-2-integrating-with-existing-players)
6. [Reference](#reference)
7. [Demo Setup](#demo-setup)

---

## Overview

A SCORM player wrapper handles:

- **Content Frame**: iframe where SCOs run
- **Navigation Controls**: prev/next/exit buttons
- **Course Menu**: TOC with status indicators
- **Progress Display**: completion %, scores
- **Event Handling**: responding to API calls

### Which Approach?

| Scenario | Recommended Approach |
|----------|---------------------|
| Building new player, SCORM 1.2 | Part 1: SCORM 1.2 Multi-SCO |
| Building new player, SCORM 2004 (no sequencing) | Part 1: SCORM 2004 Simple |
| Building new player, SCORM 2004 (with sequencing) | Part 1: SCORM 2004 Sequenced |
| Adding to existing player | Part 2: Event-Driven Integration |

---

## Quick Start

### 30-Second Integration

For existing players, use the event-driven approach:

```javascript
import Scorm12API from 'scorm-again';

const api = new Scorm12API({ autocommit: true });
window.API = api;

// Listen for status changes
api.on('LMSSetValue.cmi.core.lesson_status', (element, value) => {
  updateMenuIcon(currentScoId, value);
  updateProgressBar();
});

// Listen for score changes
api.on('LMSSetValue.cmi.core.score.raw', (element, value) => {
  updateScoreDisplay(value);
});

// Listen for finish
api.on('LMSFinish', () => {
  determineNextSco();
});
```

---

## Architecture

### Player Components

```
┌─────────────────────────────────────────────────────────────────┐
│                        Player Wrapper                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │   Header     │  │  Navigation  │  │    Progress Bar       │  │
│  │  (title,     │  │  (prev/next, │  │    (completion %,     │  │
│  │   status)    │  │   exit)      │  │     score display)    │  │
│  └──────────────┘  └──────────────┘  └───────────────────────┘  │
│  ┌──────────────────────────────────┐  ┌────────────────────┐   │
│  │                                  │  │   Course Menu      │   │
│  │        Content Frame             │  │   (TOC/outline,    │   │
│  │        (iframe for SCO)          │  │    SCO status      │   │
│  │                                  │  │    indicators)     │   │
│  └──────────────────────────────────┘  └────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Event Flow

```
SCO calls LMSSetValue('cmi.core.lesson_status', 'passed')
    │
    ▼
scorm-again fires 'LMSSetValue' event
    │
    ▼
Player listens: api.on('LMSSetValue', handler)
    │
    ▼
Handler updates state and UI
    │
    ├──► Update menu item icon
    ├──► Update progress bar
    └──► Persist state
```

### Data Flow Architecture

```
┌────────────────┐         ┌──────────────┐         ┌────────────┐
│  SCO Content   │────────►│ SCORM API    │────────►│    LMS     │
│   (iframe)     │ API     │ (window.API) │ HTTP    │  Backend   │
└────────────────┘ Calls   └──────────────┘ POST    └────────────┘
                                  │
                                  │ Events
                                  ▼
                          ┌──────────────┐
                          │    Player    │
                          │   Wrapper    │
                          │   (UI/State) │
                          └──────────────┘
                                  │
                                  ├──► Update Menu
                                  ├──► Update Progress
                                  ├──► Enable/Disable Nav
                                  └──► Persist to localStorage
```

---

## Part 1: Building from Scratch

### SCORM 1.2 Multi-SCO Player

This section demonstrates building a complete SCORM 1.2 multi-SCO player from scratch.

#### Step 1: HTML Structure

The player HTML provides the container structure for all UI components. See the complete HTML in `demos/player-wrapper/scorm12-multi-sco/index.html`.

Key elements:
- Header with title and status badge
- Progress bar showing completion percentage
- Course menu (navigation sidebar)
- Content iframe for SCO delivery
- Navigation buttons (previous, next, exit)
- Completion overlay

#### Step 2: Course Manifest

Define your course structure (in production, parse from imsmanifest.xml):

```javascript
const COURSE_MANIFEST = {
  id: 'scorm12-demo-course',
  title: 'SCORM 1.2 Demo Course',
  scos: [
    {
      id: 'sco1',
      title: 'Introduction',
      launchUrl: './content/sco1/index.html',
      masteryScore: 80,
    },
    {
      id: 'sco2',
      title: 'Core Concepts',
      launchUrl: './content/sco2/index.html',
      masteryScore: 80,
    },
    {
      id: 'sco3',
      title: 'Assessment',
      launchUrl: './content/sco3/index.html',
      masteryScore: 70,
    },
  ],
};
```

#### Step 3: State Management

Create a state manager to track SCO progress:

```javascript
class PlayerState {
  constructor() {
    this.scoStates = new Map();
    this.currentScoId = null;
    this.courseId = COURSE_MANIFEST.id;
  }

  getScoState(scoId) {
    if (!this.scoStates.has(scoId)) {
      this.scoStates.set(scoId, {
        lessonStatus: 'not attempted',
        score: { raw: null, min: 0, max: 100 },
        lessonLocation: '',
        suspendData: '',
        totalTime: '0000:00:00.00',
        sessionTime: '0000:00:00.00',
        hasBeenLaunched: false,
      });
    }
    return this.scoStates.get(scoId);
  }

  updateScoState(scoId, updates) {
    const current = this.getScoState(scoId);
    const updated = { ...current, ...updates };
    this.scoStates.set(scoId, updated);
    this.persist();
  }

  persist() {
    const data = {
      scoStates: Object.fromEntries(this.scoStates),
      currentScoId: this.currentScoId,
      timestamp: Date.now(),
    };
    localStorage.setItem(`scorm-state-${this.courseId}`, JSON.stringify(data));
  }

  restore() {
    const stored = localStorage.getItem(`scorm-state-${this.courseId}`);
    if (stored) {
      const data = JSON.parse(stored);
      this.scoStates = new Map(Object.entries(data.scoStates));
      this.currentScoId = data.currentScoId;
    }
  }

  calculateRollup() {
    let completedCount = 0;
    let scoreSum = 0;
    let scoreCount = 0;

    for (const sco of COURSE_MANIFEST.scos) {
      const state = this.getScoState(sco.id);

      if (['completed', 'passed', 'failed'].includes(state.lessonStatus)) {
        completedCount++;
      }

      if (state.score.raw !== null) {
        scoreSum += parseFloat(state.score.raw);
        scoreCount++;
      }
    }

    const completionPct = Math.round((completedCount / COURSE_MANIFEST.scos.length) * 100);
    const avgScore = scoreCount > 0 ? Math.round(scoreSum / scoreCount) : null;

    let overallStatus = 'not attempted';
    if (completedCount > 0) overallStatus = 'incomplete';
    if (completedCount === COURSE_MANIFEST.scos.length) {
      overallStatus = avgScore !== null && avgScore >= 70 ? 'passed' : 'completed';
    }

    return { completedCount, completionPct, avgScore, overallStatus };
  }
}
```

#### Step 4: Initialize SCORM API with Event Listeners

```javascript
import Scorm12API from 'scorm-again';

class Scorm12Player {
  constructor() {
    this.state = new PlayerState();
    this.api = null;
    this.manifest = COURSE_MANIFEST;
  }

  init() {
    this.state.restore();
    this.initApi();
    this.buildMenu();
    this.updateProgress();
    this.setupUiListeners();
    this.autoLaunch();
  }

  initApi() {
    this.api = new Scorm12API({
      autocommit: true,
      autocommitSeconds: 30,
      logLevel: 4,
    });

    window.API = this.api;

    // Set up API event handlers
    this.api.on('LMSInitialize', () => this.handleInitialize());
    this.api.on('LMSSetValue', (element, value) => this.handleSetValue(element, value));
    this.api.on('LMSCommit', () => this.handleCommit());
    this.api.on('LMSFinish', () => this.handleFinish());
  }

  handleSetValue(element, value) {
    if (!this.state.currentScoId) return;

    const scoId = this.state.currentScoId;

    switch (element) {
      case 'cmi.core.lesson_status':
        this.state.updateScoState(scoId, { lessonStatus: value });
        this.updateMenuItem(scoId);
        this.updateProgress();
        break;

      case 'cmi.core.score.raw':
        const currentState = this.state.getScoState(scoId);
        this.state.updateScoState(scoId, {
          score: { ...currentState.score, raw: value },
        });
        this.updateMenuItem(scoId);
        this.updateProgress();
        break;

      case 'cmi.core.lesson_location':
        this.state.updateScoState(scoId, { lessonLocation: value });
        break;

      case 'cmi.suspend_data':
        this.state.updateScoState(scoId, { suspendData: value });
        break;
    }
  }

  handleFinish() {
    if (!this.state.currentScoId) return;

    const scoId = this.state.currentScoId;
    const exit = this.api.cmi?.core?.exit || '';
    
    // Check if course is complete
    const rollup = this.state.calculateRollup();
    if (rollup.completedCount === rollup.totalCount) {
      this.showCompletionScreen(rollup);
      return;
    }

    // Auto-advance to next SCO
    if (exit !== 'suspend' && exit !== 'logout') {
      const nextSco = this.getNextSco(scoId);
      if (nextSco) {
        setTimeout(() => this.launchSco(nextSco.id), 500);
      }
    }
  }
}
```

#### Step 5: SCO Launch and Navigation

```javascript
launchSco(scoId) {
  const sco = this.manifest.scos.find((s) => s.id === scoId);
  if (!sco) return;

  const existingState = this.state.getScoState(scoId);

  // Load CMI data into API
  this.api.loadFromJSON({
    cmi: {
      core: {
        student_id: 'demo-student-001',
        student_name: 'Demo Student',
        lesson_status: existingState.lessonStatus,
        lesson_location: existingState.lessonLocation,
        score: {
          raw: existingState.score.raw?.toString() || '',
          min: existingState.score.min?.toString() || '0',
          max: existingState.score.max?.toString() || '100',
        },
        credit: 'credit',
        entry: existingState.hasBeenLaunched ? 'resume' : 'ab-initio',
      },
      suspend_data: existingState.suspendData,
      student_data: {
        mastery_score: sco.masteryScore?.toString() || '',
      },
    },
  });

  this.state.updateScoState(scoId, { hasBeenLaunched: true });
  this.state.currentScoId = scoId;

  document.getElementById('sco-frame').src = sco.launchUrl;
  this.updateNavButtons();
}
```

### SCORM 2004 Simple Multi-SCO Player

For SCORM 2004 without sequencing, the implementation is similar with key differences:

#### Key Differences from SCORM 1.2

1. **API Object Name**: Use `window.API_1484_11` instead of `window.API`
2. **Separate Completion and Success**: Track `completion_status` and `success_status` separately
3. **Scaled Scores**: Use `cmi.score.scaled` (-1 to 1) in addition to `cmi.score.raw`
4. **Time Format**: Use ISO 8601 duration (PT1H30M45S) instead of HHHH:MM:SS.CC
5. **Navigation Requests**: Handle `adl.nav.request` for SCO-initiated navigation

```javascript
import Scorm2004API from 'scorm-again/Scorm2004API';

class Scorm2004SimplePlayer {
  initApi() {
    this.api = new Scorm2004API({
      autocommit: true,
      autocommitSeconds: 30,
    });

    window.API_1484_11 = this.api;

    this.api.on('Initialize', () => this.handleInitialize());
    this.api.on('SetValue', (element, value) => this.handleSetValue(element, value));
    this.api.on('Terminate', () => this.handleTerminate());
  }

  handleSetValue(element, value) {
    if (!this.state.currentScoId) return;

    const scoId = this.state.currentScoId;

    switch (element) {
      case 'cmi.completion_status':
        this.state.updateScoState(scoId, { completionStatus: value });
        this.updateMenuItem(scoId);
        this.updateProgress();
        break;

      case 'cmi.success_status':
        this.state.updateScoState(scoId, { successStatus: value });
        this.updateMenuItem(scoId);
        break;

      case 'cmi.score.scaled':
        const state = this.state.getScoState(scoId);
        this.state.updateScoState(scoId, {
          score: { ...state.score, scaled: value },
        });
        this.updateMenuItem(scoId);
        this.updateProgress();
        break;

      case 'adl.nav.request':
        this.handleNavRequest(value);
        break;
    }
  }

  handleNavRequest(request) {
    switch (request) {
      case 'continue':
      case '_next_':
        this.launchNext();
        break;
      case 'previous':
      case '_previous_':
        this.launchPrevious();
        break;
      case 'exit':
      case 'exitAll':
        this.exitCourse();
        break;
    }
  }
}
```

### SCORM 2004 Sequenced Player

For courses with SCORM 2004 sequencing, leverage the built-in sequencing engine:

#### Sequencing Configuration

```javascript
const COURSE_MANIFEST = {
  id: 'scorm2004-sequenced-demo',
  title: 'SCORM 2004 Sequenced Course',
  activities: [
    {
      id: 'root',
      title: 'Course Root',
      isContainer: true,
      children: [
        {
          id: 'module1',
          title: 'Module 1: Fundamentals',
          isContainer: true,
          children: [
            {
              id: 'module1-lesson1',
              title: 'Lesson 1: Introduction',
              launchUrl: './content/module1/lesson1/index.html',
            },
            {
              id: 'module1-lesson2',
              title: 'Lesson 2: Basics',
              launchUrl: './content/module1/lesson2/index.html',
            },
          ],
        },
        {
          id: 'module2',
          title: 'Module 2: Advanced',
          isContainer: true,
          children: [
            {
              id: 'module2-lesson1',
              title: 'Lesson 1: Deep Dive',
              launchUrl: './content/module2/lesson1/index.html',
            },
          ],
        },
      ],
    },
  ],
};
```

#### Initialize API with Sequencing

```javascript
import Scorm2004API from 'scorm-again/Scorm2004API';

class Scorm2004SequencedPlayer {
  initApi() {
    this.api = new Scorm2004API({
      autocommit: true,
      sequencing: {
        enabled: true,
        activityTree: COURSE_MANIFEST.activities,
        eventListeners: {
          onActivityDelivery: (activity) => this.handleActivityDelivery(activity),
          onNavigationValidityUpdate: (data) => this.handleNavValidityUpdate(data),
          onRollupComplete: (activity) => this.handleRollupComplete(activity),
          onSequencingSessionEnd: (data) => this.handleSessionEnd(data),
        },
      },
    });

    window.API_1484_11 = this.api;

    this.api.on('Initialize', () => this.handleInitialize());
    this.api.on('SetValue', (el, val) => this.handleSetValue(el, val));
    this.api.on('Terminate', () => this.handleTerminate());
  }

  handleActivityDelivery(activity) {
    this.currentActivityId = activity.id;

    const activityDef = this.findActivity(activity.id);
    if (activityDef?.launchUrl) {
      document.getElementById('sco-frame').src = activityDef.launchUrl;
    }

    this.highlightCurrentActivity(activity.id);
  }

  handleNavValidityUpdate(data) {
    this.validRequests = data.validRequests || [];

    const canContinue = this.validRequests.includes('continue');
    const canPrevious = this.validRequests.includes('previous');

    document.getElementById('btn-next').disabled = !canContinue;
    document.getElementById('btn-prev').disabled = !canPrevious;
  }

  handleRollupComplete(activity) {
    this.updateMenuItemStatus(activity.id);
    this.updateProgress();
  }

  handleSessionEnd(data) {
    if (data.reason === 'satisfied') {
      this.showCompletionScreen({ completionPct: 100 });
    }
  }
}
```

---

## Part 2: Integrating with Existing Players

If you already have a player UI, use the event-driven integration pattern:

### Event-Driven Integration Pattern

```javascript
import Scorm12API from 'scorm-again';

const api = new Scorm12API({
  autocommit: true,
  lmsCommitUrl: '/api/scorm/commit',
});

window.API = api;

let currentScoId = null;

// Listen for all SetValue calls
api.on('LMSSetValue', (element, value) => {
  console.log(`SetValue: ${element} = ${value}`);

  if (element === 'cmi.core.lesson_status') {
    yourPlayer.updateStatus(currentScoId, value);
  } else if (element === 'cmi.core.score.raw') {
    yourPlayer.updateScore(currentScoId, value);
  }
});

// Listen for specific elements
api.on('LMSSetValue.cmi.core.lesson_status', (element, value) => {
  yourPlayer.updateMenuIcon(currentScoId, value);
  yourPlayer.recalculateProgress();
});

// Listen for finish
api.on('LMSFinish', () => {
  yourPlayer.onScoComplete(currentScoId);
});

function launchSco(scoId, scoData) {
  currentScoId = scoId;

  api.loadFromJSON({
    cmi: {
      core: {
        student_id: scoData.studentId,
        student_name: scoData.studentName,
        lesson_status: scoData.lessonStatus || 'not attempted',
        entry: scoData.hasBeenLaunched ? 'resume' : 'ab-initio',
      },
    },
  });

  yourPlayer.loadContentInFrame(scoData.launchUrl);
}
```

### Framework Integration Examples

#### React Integration

```jsx
import { useEffect, useRef, useState } from 'react';
import Scorm12API from 'scorm-again';

function ScormPlayer({ course }) {
  const [progress, setProgress] = useState({ completionPct: 0 });
  const [menuItems, setMenuItems] = useState([]);
  const apiRef = useRef(null);
  const currentScoId = useRef(null);

  useEffect(() => {
    apiRef.current = new Scorm12API({ autocommit: true });
    window.API = apiRef.current;

    const statusHandler = (element, value) => {
      setMenuItems(prev => prev.map(item =>
        item.id === currentScoId.current
          ? { ...item, status: value }
          : item
      ));
      recalculateProgress();
    };

    apiRef.current.on('LMSSetValue.cmi.core.lesson_status', statusHandler);

    return () => {
      apiRef.current.off('LMSSetValue.cmi.core.lesson_status', statusHandler);
    };
  }, []);

  const recalculateProgress = () => {
    const completed = menuItems.filter(item =>
      ['completed', 'passed', 'failed'].includes(item.status)
    ).length;
    const completionPct = Math.round((completed / menuItems.length) * 100);
    setProgress({ completionPct });
  };

  return (
    <div className="scorm-player">
      <div className="progress-bar">
        <div style={{ width: `${progress.completionPct}%` }} />
        <span>{progress.completionPct}% Complete</span>
      </div>
      <iframe title="SCO Content" />
    </div>
  );
}
```

#### Vue Integration

```vue
<template>
  <div class="scorm-player">
    <div class="progress-bar">
      <div :style="{ width: progress.completionPct + '%' }" />
      <span>{{ progress.completionPct }}% Complete</span>
    </div>
    <iframe ref="frame" title="SCO Content" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Scorm12API from 'scorm-again';

const progress = ref({ completionPct: 0 });
const menuItems = ref([]);
let api = null;

onMounted(() => {
  api = new Scorm12API({ autocommit: true });
  window.API = api;

  api.on('LMSSetValue.cmi.core.lesson_status', (element, value) => {
    // Update menu items and recalculate progress
    recalculateProgress();
  });
});

onUnmounted(() => {
  if (api) api.LMSFinish('');
});

const recalculateProgress = () => {
  const completed = menuItems.value.filter(item =>
    ['completed', 'passed', 'failed'].includes(item.status)
  ).length;
  progress.value.completionPct = Math.round((completed / menuItems.value.length) * 100);
};
</script>
```

---

## Reference

### Event to UI Mapping

#### SCORM 1.2 Events

| Event | CMI Element | UI Update | Example |
|-------|-------------|-----------|---------|
| `LMSInitialize` | - | Hide loading indicator | `loading.hidden = true` |
| `LMSSetValue` | `cmi.core.lesson_status` | Update menu icon, progress | `updateMenuIcon()` |
| `LMSSetValue` | `cmi.core.score.raw` | Update score display | `updateScore()` |
| `LMSCommit` | - | Recalculate rollup | `updateProgress()` |
| `LMSFinish` | - | Navigate to next SCO | `nextSco()` |

#### SCORM 2004 Events

| Event | CMI Element | UI Update |
|-------|-------------|-----------|
| `Initialize` | - | Hide loading indicator |
| `SetValue` | `cmi.completion_status` | Update menu icon, progress |
| `SetValue` | `cmi.success_status` | Update badge |
| `SetValue` | `cmi.score.scaled` | Update score (convert to %) |
| `SetValue` | `adl.nav.request` | Handle navigation request |
| `Terminate` | - | Navigate to next SCO |

#### SCORM 2004 Sequencing Events

| Event | Parameters | UI Update |
|-------|------------|-----------|
| `onActivityDelivery` | `activity` | Load SCO, highlight in menu |
| `onNavigationValidityUpdate` | `{ validRequests }` | Enable/disable nav buttons |
| `onRollupComplete` | `activity` | Update menu status, progress |
| `onSequencingSessionEnd` | `{ reason }` | Show completion screen |

### Troubleshooting

#### Issue: SCO not initializing

**Symptoms**: SCO shows blank screen, no API calls logged

**Solutions**:
- SCORM 1.2: Ensure `window.API` is set before loading content
- SCORM 2004: Ensure `window.API_1484_11` is set
- Check console for errors
- Verify iframe sandbox permissions include `allow-scripts`

#### Issue: Menu not updating

**Symptoms**: Complete SCO but menu icon stays gray

**Solutions**:
- Verify event listener is registered: `api.on('LMSSetValue.cmi.core.lesson_status', handler)`
- Check that `currentScoId` is being tracked
- Ensure DOM query selector finds the correct element
- Add console.log to verify event is firing

#### Issue: Navigation buttons always disabled

**Symptoms**: Can't navigate even after completing SCO

**Solutions**:
- Call `updateNavButtons()` after launching each SCO
- For sequencing, ensure `onNavigationValidityUpdate` listener is configured
- Check button disabled logic matches current index

#### Issue: Progress not calculating

**Symptoms**: Progress bar shows 0% after completing SCOs

**Solutions**:
- Verify state is being updated in `handleSetValue`
- Check rollup calculation logic includes all statuses: `['completed', 'passed', 'failed']`
- Call `updateProgress()` after every status change
- Add logging to `calculateRollup()` to debug

---

## Demo Setup

### Running the Demos Locally

```bash
# Clone and install
git clone https://github.com/jcputney/scorm-again.git
cd scorm-again
npm install

# Build the library
npm run build

# Navigate to demos
cd demos/player-wrapper

# Start demo server
npm start

# Open in browser
# SCORM 1.2: http://localhost:3000/scorm12-multi-sco/
# SCORM 2004 Simple: http://localhost:3000/scorm2004-simple/
# SCORM 2004 Sequenced: http://localhost:3000/scorm2004-sequenced/
```

### Demo File Structure

```
demos/player-wrapper/
├── shared/
│   ├── player-core.css        # Shared CSS
│   ├── player-core.js         # Shared utilities
│   └── mock-sco/              # Sample SCO content
├── scorm12-multi-sco/
│   ├── index.html             # Player HTML
│   ├── player.js              # SCORM 1.2 implementation
│   └── sample-course/         # Demo course
├── scorm2004-simple/
│   ├── index.html             # Player HTML
│   ├── player.js              # SCORM 2004 simple
│   └── sample-course/         # Demo course
└── scorm2004-sequenced/
    ├── index.html             # Player HTML
    ├── player.js              # SCORM 2004 sequenced
    └── sample-course/         # Demo with hierarchy
```

### Exploring the Demos

Each demo includes:

1. **Complete player implementation** - Fully functional SCORM player
2. **Sample course content** - Mock SCOs demonstrating common patterns
3. **Event logging** - Console logs showing all API calls
4. **State persistence** - localStorage-based state management
5. **Responsive design** - Works on desktop and mobile

**Key Features to Explore:**

- **SCORM 1.2 Multi-SCO**: Simple manual navigation, status rollup
- **SCORM 2004 Simple**: 2004 data model without sequencing
- **SCORM 2004 Sequenced**: Full sequencing engine with choice navigation

### Using Demos as Templates

To use a demo as a starting point:

1. Copy the demo directory to your project
2. Update the `COURSE_MANIFEST` to match your course structure
3. Modify CSS to match your design
4. Add your LMS integration (commit endpoint, etc.)
5. Customize UI components as needed

---

## Related Documentation

- [API Events Reference](./api-events-reference.md) - Complete event system documentation
- [LMS Integration Guide](./integration-guide.md) - Core LMS integration concepts
- [SCORM 1.2 Multi-SCO Guide](./multi-sco-support.md) - Multi-SCO utilities
- [Cross-Frame Communication Guide](./cross-frame-communication.md) - Sandboxed iframe integration
- [Data Requirements Quick Reference](./integration-guide.md#data-model-requirements) - Data model reference

---

## Summary

This guide covered:

1. **Architecture** - Understanding player components and event flow
2. **Building from Scratch** - Complete implementations for all SCORM versions
3. **Integrating with Existing Players** - Event-driven patterns and framework examples
4. **Reference** - Event mappings, troubleshooting, and best practices
5. **Demos** - Running and exploring working examples

**Key Takeaways:**

- Use event listeners to respond to SCORM API calls
- Track state separately from the API for UI updates
- Handle SCORM 1.2 and 2004 differences (API name, data model, time format)
- For sequencing, rely on sequencing events rather than manual logic
- Persist state to localStorage for resume capability
- Test with real SCORM content to validate compliance

For additional help, see the [troubleshooting section](#troubleshooting) or explore the [working demos](#demo-setup).
