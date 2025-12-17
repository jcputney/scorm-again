/**
 * Mock SCO - Minimal test SCO for demo players
 * Finds SCORM API, initializes, and provides UI for testing
 */

// =============================================================================
// API Discovery
// =============================================================================

let API = null;
let apiVersion = null; // '1.2' or '2004'

function findAPI(win) {
  let attempts = 0;
  const maxAttempts = 10;

  while (win && attempts < maxAttempts) {
    // Check for SCORM 2004 API
    if (win.API_1484_11) {
      return { api: win.API_1484_11, version: '2004' };
    }
    // Check for SCORM 1.2 API
    if (win.API) {
      return { api: win.API, version: '1.2' };
    }

    // Try parent window
    if (win.parent && win.parent !== win) {
      win = win.parent;
    } else if (win.opener) {
      win = win.opener;
    } else {
      break;
    }
    attempts++;
  }

  return { api: null, version: null };
}

// =============================================================================
// Logging
// =============================================================================

function log(message, type = 'info') {
  const logEl = document.getElementById('log');
  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;
  entry.textContent = `[${new Date().toISOString().slice(11, 19)}] ${message}`;
  logEl.insertBefore(entry, logEl.firstChild);
  console.log(`[MockSCO] ${message}`);
}

// =============================================================================
// SCORM API Wrappers
// =============================================================================

function getValue(element) {
  if (!API) return '';

  if (apiVersion === '2004') {
    return API.GetValue(element);
  } else {
    // Map 2004 elements to 1.2
    const mapped = mapElementTo12(element);
    return API.LMSGetValue(mapped);
  }
}

function setValue(element, value) {
  if (!API) return 'false';

  if (apiVersion === '2004') {
    return API.SetValue(element, value);
  } else {
    const mapped = mapElementTo12(element);
    return API.LMSSetValue(mapped, value);
  }
}

function commit() {
  if (!API) return 'false';
  return apiVersion === '2004' ? API.Commit('') : API.LMSCommit('');
}

function terminate() {
  if (!API) return 'false';
  return apiVersion === '2004' ? API.Terminate('') : API.LMSFinish('');
}

function mapElementTo12(element) {
  const map = {
    'cmi.completion_status': 'cmi.core.lesson_status',
    'cmi.success_status': 'cmi.core.lesson_status',
    'cmi.score.raw': 'cmi.core.score.raw',
    'cmi.score.min': 'cmi.core.score.min',
    'cmi.score.max': 'cmi.core.score.max',
    'cmi.location': 'cmi.core.lesson_location',
    'cmi.exit': 'cmi.core.exit',
    'adl.nav.request': null, // Not supported in 1.2
  };
  return map[element] !== undefined ? map[element] : element;
}

// =============================================================================
// UI Updates
// =============================================================================

function updateStatusDisplay() {
  const statusEl = document.getElementById('current-status');
  const scoreEl = document.getElementById('current-score');
  const locationEl = document.getElementById('current-location');

  if (apiVersion === '2004') {
    const completion = getValue('cmi.completion_status');
    const success = getValue('cmi.success_status');
    statusEl.textContent = success !== 'unknown' ? success : completion;
  } else {
    statusEl.textContent = getValue('cmi.core.lesson_status') || 'not attempted';
  }

  const score = apiVersion === '2004'
    ? getValue('cmi.score.raw')
    : getValue('cmi.core.score.raw');
  scoreEl.textContent = score || '--';

  const location = apiVersion === '2004'
    ? getValue('cmi.location')
    : getValue('cmi.core.lesson_location');
  locationEl.textContent = location || '--';
}

// =============================================================================
// SCO Actions (exposed globally for button onclick)
// =============================================================================

window.setScore = function() {
  const score = document.getElementById('score-value').value;

  if (apiVersion === '2004') {
    setValue('cmi.score.raw', score);
    setValue('cmi.score.min', '0');
    setValue('cmi.score.max', '100');
    setValue('cmi.score.scaled', (parseFloat(score) / 100).toString());
  } else {
    setValue('cmi.core.score.raw', score);
    setValue('cmi.core.score.min', '0');
    setValue('cmi.core.score.max', '100');
  }

  commit();
  updateStatusDisplay();
  log(`Score set to ${score}`);
};

window.markPassed = function() {
  const score = document.getElementById('score-value').value;

  if (apiVersion === '2004') {
    setValue('cmi.completion_status', 'completed');
    setValue('cmi.success_status', 'passed');
    setValue('cmi.score.raw', score);
    setValue('cmi.score.scaled', (parseFloat(score) / 100).toString());
  } else {
    setValue('cmi.core.lesson_status', 'passed');
    setValue('cmi.core.score.raw', score);
  }

  commit();
  updateStatusDisplay();
  log('Marked as PASSED', 'success');
};

window.markFailed = function() {
  const score = document.getElementById('score-value').value;

  if (apiVersion === '2004') {
    setValue('cmi.completion_status', 'completed');
    setValue('cmi.success_status', 'failed');
    setValue('cmi.score.raw', score);
    setValue('cmi.score.scaled', (parseFloat(score) / 100).toString());
  } else {
    setValue('cmi.core.lesson_status', 'failed');
    setValue('cmi.core.score.raw', score);
  }

  commit();
  updateStatusDisplay();
  log('Marked as FAILED', 'error');
};

window.markIncomplete = function() {
  if (apiVersion === '2004') {
    setValue('cmi.completion_status', 'incomplete');
  } else {
    setValue('cmi.core.lesson_status', 'incomplete');
  }

  commit();
  updateStatusDisplay();
  log('Marked as INCOMPLETE');
};

window.setLocation = function(location) {
  if (apiVersion === '2004') {
    setValue('cmi.location', location);
  } else {
    setValue('cmi.core.lesson_location', location);
  }

  commit();
  updateStatusDisplay();
  log(`Location set to: ${location}`);
};

window.requestNext = function() {
  if (apiVersion === '2004') {
    setValue('adl.nav.request', 'continue');
    terminate();
    log('Requested: continue (next)');
  } else {
    setValue('cmi.core.exit', '');
    terminate();
    log('Exit for next (1.2)');
  }
};

window.requestPrevious = function() {
  if (apiVersion === '2004') {
    setValue('adl.nav.request', 'previous');
    terminate();
    log('Requested: previous');
  } else {
    setValue('cmi.core.exit', '');
    terminate();
    log('Exit for previous (1.2)');
  }
};

window.exitSco = function() {
  if (apiVersion === '2004') {
    setValue('cmi.exit', 'suspend');
    setValue('adl.nav.request', 'suspendAll');
  } else {
    setValue('cmi.core.exit', 'suspend');
  }

  commit();
  terminate();
  log('SCO exited');
};

// =============================================================================
// Initialization
// =============================================================================

function init() {
  // Get SCO info from URL params
  const params = new URLSearchParams(window.location.search);
  const scoId = params.get('sco') || 'mock-sco';
  const scoTitle = params.get('title') || 'Mock SCO';

  document.getElementById('sco-id').textContent = scoId;
  document.getElementById('sco-title').textContent = scoTitle;
  document.title = scoTitle;

  // Find API
  const result = findAPI(window);
  API = result.api;
  apiVersion = result.version;

  if (!API) {
    log('SCORM API not found!', 'error');
    return;
  }

  log(`Found SCORM ${apiVersion} API`);

  // Initialize
  const initResult = apiVersion === '2004'
    ? API.Initialize('')
    : API.LMSInitialize('');

  if (initResult === 'true') {
    log('Initialized successfully', 'success');
    updateStatusDisplay();
  } else {
    log('Initialize failed!', 'error');
  }
}

// Run on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
