/**
 * SCORM Player Core Utilities
 * Shared utilities for all demo player implementations
 */

// =============================================================================
// Time Utilities
// =============================================================================

/**
 * Parse SCORM 1.2 time format (HHHH:MM:SS.SS) to seconds
 * @param {string} timeString - SCORM 1.2 formatted time
 * @returns {number} Total seconds
 */
export function parseScorm12Time(timeString) {
  if (!timeString || typeof timeString !== 'string') return 0;

  const match = timeString.match(/^(\d{2,4}):(\d{2}):(\d{2})(?:\.(\d{1,2}))?$/);
  if (!match) return 0;

  const [, hours, minutes, seconds, centiseconds = '0'] = match;
  return (
    parseInt(hours, 10) * 3600 +
    parseInt(minutes, 10) * 60 +
    parseInt(seconds, 10) +
    parseInt(centiseconds.padEnd(2, '0'), 10) / 100
  );
}

/**
 * Parse SCORM 2004 time format (ISO 8601 duration) to seconds
 * @param {string} duration - ISO 8601 duration (PT1H30M45S)
 * @returns {number} Total seconds
 */
export function parseScorm2004Time(duration) {
  if (!duration || typeof duration !== 'string') return 0;

  const match = duration.match(/^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/);
  if (!match) return 0;

  const [, days = 0, hours = 0, minutes = 0, seconds = 0] = match;
  return (
    parseFloat(days) * 86400 +
    parseFloat(hours) * 3600 +
    parseFloat(minutes) * 60 +
    parseFloat(seconds)
  );
}

/**
 * Format seconds to human-readable string
 * @param {number} totalSeconds
 * @returns {string} e.g., "1h 30m 45s"
 */
export function formatTimeHuman(totalSeconds) {
  if (!totalSeconds || totalSeconds < 0) return '0s';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
}

// =============================================================================
// Status Utilities
// =============================================================================

/**
 * Determine if a SCORM 1.2 status counts as "completed"
 * @param {string} status - lesson_status value
 * @returns {boolean}
 */
export function isScorm12Completed(status) {
  return ['completed', 'passed', 'failed'].includes(status);
}

/**
 * Determine if a SCORM 2004 completion_status counts as "completed"
 * @param {string} status - completion_status value
 * @returns {boolean}
 */
export function isScorm2004Completed(status) {
  return status === 'completed';
}

/**
 * Get a normalized status for UI display
 * @param {object} options
 * @param {string} [options.lessonStatus] - SCORM 1.2 lesson_status
 * @param {string} [options.completionStatus] - SCORM 2004 completion_status
 * @param {string} [options.successStatus] - SCORM 2004 success_status
 * @returns {string} Normalized status for CSS class
 */
export function getNormalizedStatus({ lessonStatus, completionStatus, successStatus }) {
  // SCORM 2004
  if (completionStatus !== undefined) {
    if (successStatus === 'passed') return 'passed';
    if (successStatus === 'failed') return 'failed';
    if (completionStatus === 'completed') return 'completed';
    if (completionStatus === 'incomplete') return 'incomplete';
    return 'not-attempted';
  }

  // SCORM 1.2
  if (lessonStatus) {
    if (lessonStatus === 'not attempted') return 'not-attempted';
    return lessonStatus;
  }

  return 'not-attempted';
}

// =============================================================================
// DOM Utilities
// =============================================================================

/**
 * Safely query an element, throwing if not found
 * @param {string} selector
 * @param {Element} [parent=document]
 * @returns {Element}
 */
export function $(selector, parent = document) {
  const el = parent.querySelector(selector);
  if (!el) throw new Error(`Element not found: ${selector}`);
  return el;
}

/**
 * Query all elements matching selector
 * @param {string} selector
 * @param {Element} [parent=document]
 * @returns {Element[]}
 */
export function $$(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

/**
 * Create an element with attributes and children
 * @param {string} tag
 * @param {object} [attrs={}]
 * @param {(string|Element)[]} [children=[]]
 * @returns {Element}
 */
export function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'className') {
      el.className = value;
    } else if (key === 'dataset') {
      Object.assign(el.dataset, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      el.setAttribute(key, value);
    }
  }

  for (const child of children) {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Element) {
      el.appendChild(child);
    }
  }

  return el;
}

// =============================================================================
// Event Utilities
// =============================================================================

/**
 * Simple event emitter for player state changes
 */
export class EventEmitter {
  constructor() {
    this._listeners = new Map();
  }

  on(event, callback) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event).add(callback);
    return () => this.off(event, callback);
  }

  off(event, callback) {
    const listeners = this._listeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  emit(event, ...args) {
    const listeners = this._listeners.get(event);
    if (listeners) {
      for (const callback of listeners) {
        try {
          callback(...args);
        } catch (err) {
          console.error(`Error in ${event} listener:`, err);
        }
      }
    }
  }

  removeAllListeners() {
    this._listeners.clear();
  }
}

// =============================================================================
// Storage Utilities
// =============================================================================

/**
 * Get player state from localStorage
 * @param {string} courseId
 * @returns {object|null}
 */
export function getStoredState(courseId) {
  try {
    const key = `scorm-player-state-${courseId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.warn('Failed to load stored state:', err);
    return null;
  }
}

/**
 * Save player state to localStorage
 * @param {string} courseId
 * @param {object} state
 */
export function setStoredState(courseId, state) {
  try {
    const key = `scorm-player-state-${courseId}`;
    localStorage.setItem(key, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save state:', err);
  }
}

/**
 * Clear player state from localStorage
 * @param {string} courseId
 */
export function clearStoredState(courseId) {
  try {
    const key = `scorm-player-state-${courseId}`;
    localStorage.removeItem(key);
  } catch (err) {
    console.warn('Failed to clear state:', err);
  }
}

// =============================================================================
// Logging Utility
// =============================================================================

/**
 * Create a namespaced logger
 * @param {string} namespace
 * @returns {object}
 */
export function createLogger(namespace) {
  const prefix = `[${namespace}]`;
  return {
    log: (...args) => console.log(prefix, ...args),
    info: (...args) => console.info(prefix, ...args),
    warn: (...args) => console.warn(prefix, ...args),
    error: (...args) => console.error(prefix, ...args),
    debug: (...args) => {
      if (localStorage.getItem('scorm-player-debug') === 'true') {
        console.debug(prefix, ...args);
      }
    },
  };
}
