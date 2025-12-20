/**
 * SCORM 1.2 Multi-SCO Player
 * Demonstrates event-driven UI updates using scorm-again
 */

import { Scorm12API } from 'scorm-again';
import {
  $,
  $$,
  createElement,
  EventEmitter,
  formatTimeHuman,
  parseScorm12Time,
  getNormalizedStatus,
  isScorm12Completed,
  getStoredState,
  setStoredState,
  createLogger,
} from '../shared/player-core.js';

const log = createLogger('SCORM12-Player');

// =============================================================================
// Course Manifest (would come from imsmanifest.xml parsing in production)
// =============================================================================

const COURSE_MANIFEST = {
  id: 'scorm12-demo-course',
  title: 'SCORM 1.2 Demo Course',
  scos: [
    {
      id: 'sco1',
      title: 'Introduction',
      launchUrl: './sample-course/sco1/index.html',
      masteryScore: 80,
    },
    {
      id: 'sco2',
      title: 'Core Concepts',
      launchUrl: './sample-course/sco2/index.html',
      masteryScore: 80,
    },
    {
      id: 'sco3',
      title: 'Assessment',
      launchUrl: './sample-course/sco3/index.html',
      masteryScore: 70,
    },
  ],
};

// =============================================================================
// Player State
// =============================================================================

class PlayerState extends EventEmitter {
  constructor() {
    super();
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
    this.emit('scoStateChange', { scoId, state: updated, changes: updates });
    this.persist();
  }

  setCurrentSco(scoId) {
    const previous = this.currentScoId;
    this.currentScoId = scoId;
    this.emit('currentScoChange', { scoId, previous });
  }

  persist() {
    const data = {
      scoStates: Object.fromEntries(this.scoStates),
      currentScoId: this.currentScoId,
      timestamp: Date.now(),
    };
    setStoredState(this.courseId, data);
  }

  restore() {
    const data = getStoredState(this.courseId);
    if (data?.scoStates) {
      this.scoStates = new Map(Object.entries(data.scoStates));
      this.currentScoId = data.currentScoId;
      log.info('State restored from localStorage');
    }
  }

  calculateRollup() {
    const scos = COURSE_MANIFEST.scos;
    let completedCount = 0;
    let scoreSum = 0;
    let scoreCount = 0;
    let totalTimeSeconds = 0;

    for (const sco of scos) {
      const state = this.getScoState(sco.id);

      if (isScorm12Completed(state.lessonStatus)) {
        completedCount++;
      }

      if (state.score.raw !== null) {
        scoreSum += parseFloat(state.score.raw);
        scoreCount++;
      }

      totalTimeSeconds += parseScorm12Time(state.totalTime);
    }

    const completionPct = Math.round((completedCount / scos.length) * 100);
    const avgScore = scoreCount > 0 ? Math.round(scoreSum / scoreCount) : null;

    // Determine overall status
    let overallStatus = 'not attempted';
    if (completedCount > 0) {
      overallStatus = 'incomplete';
    }
    if (completedCount === scos.length) {
      overallStatus = avgScore !== null && avgScore >= 70 ? 'passed' : 'completed';
    }

    return {
      completedCount,
      totalCount: scos.length,
      completionPct,
      avgScore,
      totalTime: formatTimeHuman(totalTimeSeconds),
      overallStatus,
    };
  }
}

// =============================================================================
// SCORM 1.2 Player
// =============================================================================

class Scorm12Player {
  constructor() {
    this.state = new PlayerState();
    this.api = null;
    this.manifest = COURSE_MANIFEST;

    // DOM references
    this.dom = {
      title: $('#course-title'),
      status: $('#course-status'),
      progressFill: $('#progress-fill'),
      progressText: $('#progress-text'),
      progressScore: $('#progress-score'),
      menuList: $('#menu-list'),
      menuToggle: $('.menu-toggle'),
      menu: $('#player-menu'),
      frame: $('#sco-frame'),
      loading: $('#content-loading'),
      btnPrev: $('#btn-prev'),
      btnNext: $('#btn-next'),
      btnExit: $('#btn-exit'),
      completionOverlay: $('#completion-overlay'),
      completionIcon: $('#completion-icon'),
      completionTitle: $('#completion-title'),
      completionMessage: $('#completion-message'),
      finalScore: $('#final-score'),
      finalTime: $('#final-time'),
    };
  }

  // ---------------------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------------------

  init() {
    log.info('Initializing player...');

    // Restore previous state
    this.state.restore();

    // Initialize SCORM API
    this.initApi();

    // Build UI
    this.buildMenu();
    this.updateProgress();
    this.dom.title.textContent = this.manifest.title;

    // Set up event listeners
    this.setupStateListeners();
    this.setupUiListeners();

    // Launch first available SCO or resume
    this.autoLaunch();

    log.info('Player initialized');
  }

  initApi() {
    this.api = new Scorm12API({
      autocommit: true,
      autocommitSeconds: 30,
      logLevel: 4, // Debug
    });

    // Expose API globally for SCO discovery
    window.API = this.api;

    // Set up API event handlers
    this.setupApiListeners();

    log.info('SCORM API initialized and exposed as window.API');
  }

  setupApiListeners() {
    this.api.on('LMSInitialize', () => this.handleInitialize());
    this.api.on('LMSSetValue', (element, value) => this.handleSetValue(element, value));
    this.api.on('LMSCommit', () => this.handleCommit());
    this.api.on('LMSFinish', () => this.handleFinish());
  }

  // ---------------------------------------------------------------------------
  // State Event Handlers
  // ---------------------------------------------------------------------------

  setupStateListeners() {
    this.state.on('scoStateChange', ({ scoId, state }) => {
      this.updateMenuItem(scoId, state);
      this.updateProgress();
    });

    this.state.on('currentScoChange', ({ scoId }) => {
      this.highlightCurrentSco(scoId);
      this.updateNavButtons();
    });
  }

  // ---------------------------------------------------------------------------
  // API Event Handlers
  // ---------------------------------------------------------------------------

  handleInitialize() {
    log.info('LMSInitialize called');
    this.dom.loading.hidden = true;
  }

  handleSetValue(element, value) {
    if (!this.state.currentScoId) return;

    log.debug(`LMSSetValue: ${element} = ${value}`);

    const scoId = this.state.currentScoId;

    // Map CMI elements to state updates
    switch (element) {
      case 'cmi.core.lesson_status':
        this.state.updateScoState(scoId, { lessonStatus: value });
        break;

      case 'cmi.core.score.raw':
        const currentState = this.state.getScoState(scoId);
        this.state.updateScoState(scoId, {
          score: { ...currentState.score, raw: value },
        });
        break;

      case 'cmi.core.score.min':
        const stateMin = this.state.getScoState(scoId);
        this.state.updateScoState(scoId, {
          score: { ...stateMin.score, min: parseFloat(value) },
        });
        break;

      case 'cmi.core.score.max':
        const stateMax = this.state.getScoState(scoId);
        this.state.updateScoState(scoId, {
          score: { ...stateMax.score, max: parseFloat(value) },
        });
        break;

      case 'cmi.core.lesson_location':
        this.state.updateScoState(scoId, { lessonLocation: value });
        break;

      case 'cmi.suspend_data':
        this.state.updateScoState(scoId, { suspendData: value });
        break;

      case 'cmi.core.session_time':
        this.state.updateScoState(scoId, { sessionTime: value });
        break;
    }
  }

  handleCommit() {
    log.debug('LMSCommit called');
    // State already updated via SetValue handlers
  }

  handleFinish() {
    log.info('LMSFinish called');

    if (!this.state.currentScoId) return;

    const scoId = this.state.currentScoId;
    const scoState = this.state.getScoState(scoId);

    // Accumulate total time
    const sessionSeconds = parseScorm12Time(scoState.sessionTime);
    const totalSeconds = parseScorm12Time(scoState.totalTime) + sessionSeconds;
    const totalTimeStr = this.formatScorm12Time(totalSeconds);
    this.state.updateScoState(scoId, { totalTime: totalTimeStr });

    // Check exit action from CMI data
    // Note: cmi.core.exit is write-only in SCORM 1.2, so we wrap in try-catch
    let exit = '';
    try {
      exit = this.api.cmi?.core?.exit || '';
    } catch {
      // cmi.core.exit is write-only, default to empty
    }
    this.processExitAction(scoId, exit);
  }

  formatScorm12Time(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const centis = Math.round((totalSeconds % 1) * 100);

    return `${hours.toString().padStart(4, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centis.toString().padStart(2, '0')}`;
  }

  processExitAction(scoId, exit) {
    log.info(`Processing exit action: "${exit}" for SCO: ${scoId}`);

    // Clear current SCO
    this.state.setCurrentSco(null);
    this.dom.frame.src = 'about:blank';

    // Check if course is complete
    const rollup = this.state.calculateRollup();
    if (rollup.completedCount === rollup.totalCount) {
      this.showCompletionScreen(rollup);
      return;
    }

    // Otherwise, show menu or auto-advance
    if (exit === 'suspend' || exit === 'logout') {
      // Stay on menu
      log.info('SCO suspended, showing menu');
    } else {
      // Auto-advance to next SCO
      const nextSco = this.getNextSco(scoId);
      if (nextSco) {
        setTimeout(() => this.launchSco(nextSco.id), 500);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // UI Event Handlers
  // ---------------------------------------------------------------------------

  setupUiListeners() {
    // Navigation buttons
    this.dom.btnPrev.addEventListener('click', () => this.launchPrevious());
    this.dom.btnNext.addEventListener('click', () => this.launchNext());
    this.dom.btnExit.addEventListener('click', () => this.exitCourse());

    // Menu toggle (mobile)
    this.dom.menuToggle.addEventListener('click', () => {
      const expanded = this.dom.menu.getAttribute('aria-expanded') === 'true';
      this.dom.menu.setAttribute('aria-expanded', !expanded);
      this.dom.menuToggle.setAttribute('aria-expanded', !expanded);
    });
  }

  // ---------------------------------------------------------------------------
  // SCO Management
  // ---------------------------------------------------------------------------

  launchSco(scoId) {
    const sco = this.manifest.scos.find((s) => s.id === scoId);
    if (!sco) {
      log.error(`SCO not found: ${scoId}`);
      return;
    }

    log.info(`Launching SCO: ${scoId}`);

    // Reset API for new SCO session (clears state and listeners)
    this.api.reset();
    // Re-register event listeners after reset
    this.setupApiListeners();

    // Get existing state for resume
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

    // Mark as launched
    this.state.updateScoState(scoId, { hasBeenLaunched: true });
    this.state.setCurrentSco(scoId);

    // Show loading
    this.dom.loading.hidden = false;

    // Launch in iframe
    const launchUrl = `${sco.launchUrl}?sco=${scoId}&title=${encodeURIComponent(sco.title)}`;
    this.dom.frame.src = launchUrl;
  }

  launchNext() {
    if (!this.state.currentScoId) {
      const first = this.manifest.scos[0];
      if (first) this.launchSco(first.id);
      return;
    }

    const next = this.getNextSco(this.state.currentScoId);
    if (next) this.launchSco(next.id);
  }

  launchPrevious() {
    if (!this.state.currentScoId) return;

    const prev = this.getPrevSco(this.state.currentScoId);
    if (prev) this.launchSco(prev.id);
  }

  getNextSco(currentId) {
    const idx = this.manifest.scos.findIndex((s) => s.id === currentId);
    return idx < this.manifest.scos.length - 1 ? this.manifest.scos[idx + 1] : null;
  }

  getPrevSco(currentId) {
    const idx = this.manifest.scos.findIndex((s) => s.id === currentId);
    return idx > 0 ? this.manifest.scos[idx - 1] : null;
  }

  autoLaunch() {
    // Find first incomplete SCO or first SCO
    for (const sco of this.manifest.scos) {
      const state = this.state.getScoState(sco.id);
      if (!isScorm12Completed(state.lessonStatus)) {
        this.launchSco(sco.id);
        return;
      }
    }

    // All complete - launch first for review
    if (this.manifest.scos.length > 0) {
      this.launchSco(this.manifest.scos[0].id);
    }
  }

  exitCourse() {
    log.info('Exiting course');

    // Terminate current SCO if active
    if (this.state.currentScoId) {
      this.api.LMSFinish('');
    }

    // In a real LMS, this would close the player window or redirect
    const rollup = this.state.calculateRollup();
    this.showCompletionScreen(rollup);
  }

  // ---------------------------------------------------------------------------
  // UI Updates
  // ---------------------------------------------------------------------------

  buildMenu() {
    const menuList = this.dom.menuList;

    // Clear existing children safely
    while (menuList.firstChild) {
      menuList.removeChild(menuList.firstChild);
    }

    for (const sco of this.manifest.scos) {
      const state = this.state.getScoState(sco.id);
      const status = getNormalizedStatus({ lessonStatus: state.lessonStatus });

      const li = createElement('li', { className: 'menu-item', role: 'treeitem' });

      const btn = createElement(
        'button',
        {
          className: 'menu-item-btn',
          dataset: { scoId: sco.id },
          'aria-current': false,
          onClick: () => this.launchSco(sco.id),
        },
        [
          createElement('span', { className: 'menu-item-icon', dataset: { status } }),
          createElement('span', { className: 'menu-item-title' }, [sco.title]),
          createElement('span', { className: 'menu-item-score' }, [
            state.score.raw !== null ? `${state.score.raw}%` : '',
          ]),
        ]
      );

      li.appendChild(btn);
      menuList.appendChild(li);
    }
  }

  updateMenuItem(scoId, state) {
    const btn = this.dom.menuList.querySelector(`[data-sco-id="${scoId}"]`);
    if (!btn) return;

    const icon = btn.querySelector('.menu-item-icon');
    const scoreEl = btn.querySelector('.menu-item-score');

    const status = getNormalizedStatus({ lessonStatus: state.lessonStatus });
    icon.dataset.status = status;

    scoreEl.textContent = state.score.raw !== null ? `${state.score.raw}%` : '';
  }

  highlightCurrentSco(scoId) {
    const buttons = this.dom.menuList.querySelectorAll('.menu-item-btn');
    buttons.forEach((btn) => {
      btn.setAttribute('aria-current', btn.dataset.scoId === scoId);
    });
  }

  updateNavButtons() {
    const current = this.state.currentScoId;

    if (!current) {
      this.dom.btnPrev.disabled = true;
      this.dom.btnNext.disabled = this.manifest.scos.length === 0;
      return;
    }

    const idx = this.manifest.scos.findIndex((s) => s.id === current);
    this.dom.btnPrev.disabled = idx <= 0;
    this.dom.btnNext.disabled = idx >= this.manifest.scos.length - 1;
  }

  updateProgress() {
    const rollup = this.state.calculateRollup();

    // Update progress bar
    this.dom.progressFill.style.width = `${rollup.completionPct}%`;
    this.dom.progressText.textContent = `${rollup.completionPct}% Complete`;

    // Update progress bar ARIA
    const progressBar = this.dom.progressFill.parentElement;
    progressBar.setAttribute('aria-valuenow', rollup.completionPct);

    // Update score
    if (rollup.avgScore !== null) {
      this.dom.progressScore.textContent = `Score: ${rollup.avgScore}%`;
      this.dom.progressScore.hidden = false;
    } else {
      this.dom.progressScore.hidden = true;
    }

    // Update status badge
    this.dom.status.textContent = this.formatStatus(rollup.overallStatus);
    this.dom.status.dataset.status = rollup.overallStatus;
  }

  formatStatus(status) {
    const labels = {
      'not attempted': 'Not Started',
      incomplete: 'In Progress',
      completed: 'Completed',
      passed: 'Passed',
      failed: 'Failed',
    };
    return labels[status] || status;
  }

  showCompletionScreen(rollup) {
    this.dom.completionIcon.textContent = rollup.overallStatus === 'passed' ? '🎉' : '✅';
    this.dom.completionTitle.textContent =
      rollup.overallStatus === 'passed' ? 'Congratulations!' : 'Course Complete';
    this.dom.completionMessage.textContent =
      rollup.overallStatus === 'passed'
        ? 'You have successfully passed this course.'
        : 'You have completed this course.';

    this.dom.finalScore.textContent =
      rollup.avgScore !== null ? `${rollup.avgScore}%` : '--';
    this.dom.finalTime.textContent = rollup.totalTime;

    this.dom.completionOverlay.hidden = false;
  }
}

// =============================================================================
// Initialize
// =============================================================================

const player = new Scorm12Player();
player.init();

// Expose for debugging
window.scormPlayer = player;
