/**
 * SCORM 2004 Simple Multi-SCO Player
 * Uses SCORM 2004 API without full sequencing engine
 * Demonstrates manual navigation control with 2004 events
 */

import Scorm2004API from 'scorm-again/Scorm2004API';
import {
  $,
  createElement,
  EventEmitter,
  formatTimeHuman,
  parseScorm2004Time,
  getNormalizedStatus,
  isScorm2004Completed,
  getStoredState,
  setStoredState,
  createLogger,
} from '../shared/player-core.js';

const log = createLogger('SCORM2004-Simple');

// =============================================================================
// Course Manifest
// =============================================================================

const COURSE_MANIFEST = {
  id: 'scorm2004-simple-demo',
  title: 'SCORM 2004 Simple Demo Course',
  scos: [
    {
      id: 'sco1',
      title: 'Getting Started',
      launchUrl: './sample-course/sco1/index.html',
      scaledPassingScore: 0.8,
    },
    {
      id: 'sco2',
      title: 'Main Content',
      launchUrl: './sample-course/sco2/index.html',
      scaledPassingScore: 0.8,
    },
    {
      id: 'sco3',
      title: 'Final Quiz',
      launchUrl: './sample-course/sco3/index.html',
      scaledPassingScore: 0.7,
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
        completionStatus: 'not attempted',
        successStatus: 'unknown',
        score: { scaled: null, raw: null, min: null, max: null },
        location: '',
        suspendData: '',
        totalTime: 'PT0S',
        hasBeenLaunched: false,
      });
    }
    return this.scoStates.get(scoId);
  }

  updateScoState(scoId, updates) {
    const current = this.getScoState(scoId);
    const updated = { ...current, ...updates };
    this.scoStates.set(scoId, updated);
    this.emit('scoStateChange', { scoId, state: updated });
    this.persist();
  }

  setCurrentSco(scoId) {
    const previous = this.currentScoId;
    this.currentScoId = scoId;
    this.emit('currentScoChange', { scoId, previous });
  }

  persist() {
    setStoredState(this.courseId, {
      scoStates: Object.fromEntries(this.scoStates),
      currentScoId: this.currentScoId,
    });
  }

  restore() {
    const data = getStoredState(this.courseId);
    if (data?.scoStates) {
      this.scoStates = new Map(Object.entries(data.scoStates));
      log.info('State restored');
    }
  }

  calculateRollup() {
    const scos = COURSE_MANIFEST.scos;
    let completedCount = 0;
    let passedCount = 0;
    let scoreSum = 0;
    let scoreCount = 0;
    let totalTimeSeconds = 0;

    for (const sco of scos) {
      const state = this.getScoState(sco.id);

      if (isScorm2004Completed(state.completionStatus)) {
        completedCount++;
      }

      if (state.successStatus === 'passed') {
        passedCount++;
      }

      if (state.score.scaled !== null) {
        scoreSum += parseFloat(state.score.scaled);
        scoreCount++;
      }

      totalTimeSeconds += parseScorm2004Time(state.totalTime);
    }

    const completionPct = Math.round((completedCount / scos.length) * 100);
    const avgScore = scoreCount > 0 ? Math.round((scoreSum / scoreCount) * 100) : null;

    let overallStatus = 'not attempted';
    if (completedCount > 0) overallStatus = 'incomplete';
    if (completedCount === scos.length) {
      overallStatus = passedCount === scos.length ? 'passed' : 'completed';
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
// SCORM 2004 Simple Player
// =============================================================================

class Scorm2004SimplePlayer {
  constructor() {
    this.state = new PlayerState();
    this.api = null;
    this.manifest = COURSE_MANIFEST;

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
      finalScore: $('#final-score'),
      finalTime: $('#final-time'),
    };
  }

  init() {
    log.info('Initializing SCORM 2004 Simple Player...');

    this.state.restore();
    this.initApi();
    this.buildMenu();
    this.updateProgress();
    this.dom.title.textContent = this.manifest.title;

    this.setupStateListeners();
    this.setupUiListeners();
    this.autoLaunch();

    log.info('Player initialized');
  }

  initApi() {
    // Initialize without sequencing
    this.api = new Scorm2004API({
      autocommit: true,
      autocommitSeconds: 30,
      logLevel: 4,
      // No sequencing configuration - we handle navigation manually
    });

    // Expose for SCO discovery
    window.API_1484_11 = this.api;

    // Core API events
    this.api.on('Initialize', () => this.handleInitialize());
    this.api.on('SetValue', (element, value) => this.handleSetValue(element, value));
    this.api.on('Commit', () => this.handleCommit());
    this.api.on('Terminate', () => this.handleTerminate());

    // Navigation request events (from SCO setting adl.nav.request)
    this.api.on('SequenceNext', () => this.handleSequenceNext());
    this.api.on('SequencePrevious', () => this.handleSequencePrevious());

    log.info('SCORM 2004 API initialized as window.API_1484_11');
  }

  // ---------------------------------------------------------------------------
  // API Event Handlers
  // ---------------------------------------------------------------------------

  handleInitialize() {
    log.info('Initialize called');
    this.dom.loading.hidden = true;
  }

  handleSetValue(element, value) {
    if (!this.state.currentScoId) return;

    const scoId = this.state.currentScoId;
    log.debug(`SetValue: ${element} = ${value}`);

    switch (element) {
      case 'cmi.completion_status':
        this.state.updateScoState(scoId, { completionStatus: value });
        break;

      case 'cmi.success_status':
        this.state.updateScoState(scoId, { successStatus: value });
        break;

      case 'cmi.score.scaled':
        const stateScaled = this.state.getScoState(scoId);
        this.state.updateScoState(scoId, {
          score: { ...stateScaled.score, scaled: parseFloat(value) },
        });
        break;

      case 'cmi.score.raw':
        const stateRaw = this.state.getScoState(scoId);
        this.state.updateScoState(scoId, {
          score: { ...stateRaw.score, raw: parseFloat(value) },
        });
        break;

      case 'cmi.location':
        this.state.updateScoState(scoId, { location: value });
        break;

      case 'cmi.suspend_data':
        this.state.updateScoState(scoId, { suspendData: value });
        break;
    }
  }

  handleCommit() {
    log.debug('Commit called');
  }

  handleTerminate() {
    log.info('Terminate called');

    if (!this.state.currentScoId) return;

    const scoId = this.state.currentScoId;

    // Accumulate time
    const sessionTime = this.api.cmi?.session_time || 'PT0S';
    const currentState = this.state.getScoState(scoId);
    const totalSeconds =
      parseScorm2004Time(currentState.totalTime) + parseScorm2004Time(sessionTime);
    this.state.updateScoState(scoId, {
      totalTime: `PT${Math.floor(totalSeconds)}S`,
    });

    // Process exit
    const exit = this.api.cmi?.exit || '';
    const navRequest = this.api.adl?.nav?.request || '_none_';

    this.processTermination(scoId, exit, navRequest);
  }

  handleSequenceNext() {
    log.info('SequenceNext requested');
    // Will be handled after Terminate
  }

  handleSequencePrevious() {
    log.info('SequencePrevious requested');
    // Will be handled after Terminate
  }

  processTermination(scoId, exit, navRequest) {
    log.info(`Processing termination: exit=${exit}, navRequest=${navRequest}`);

    this.state.setCurrentSco(null);
    this.dom.frame.src = 'about:blank';

    // Check course completion
    const rollup = this.state.calculateRollup();
    if (rollup.completedCount === rollup.totalCount) {
      this.showCompletionScreen(rollup);
      return;
    }

    // Handle navigation requests
    if (navRequest === 'continue' || navRequest === '{target=_none_}continue') {
      const next = this.getNextSco(scoId);
      if (next) {
        setTimeout(() => this.launchSco(next.id), 300);
        return;
      }
    }

    if (navRequest === 'previous') {
      const prev = this.getPrevSco(scoId);
      if (prev) {
        setTimeout(() => this.launchSco(prev.id), 300);
        return;
      }
    }

    // Default: stay on menu (suspend case)
    log.info('Staying on menu');
  }

  // ---------------------------------------------------------------------------
  // State & UI Listeners
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

  setupUiListeners() {
    this.dom.btnPrev.addEventListener('click', () => this.launchPrevious());
    this.dom.btnNext.addEventListener('click', () => this.launchNext());
    this.dom.btnExit.addEventListener('click', () => this.exitCourse());

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
    if (!sco) return;

    log.info(`Launching SCO: ${scoId}`);

    const existingState = this.state.getScoState(scoId);

    // Load CMI data
    this.api.loadFromJSON({
      cmi: {
        learner_id: 'demo-learner-001',
        learner_name: 'Demo Learner',
        completion_status: existingState.completionStatus,
        success_status: existingState.successStatus,
        location: existingState.location,
        suspend_data: existingState.suspendData,
        score: {
          scaled: existingState.score.scaled?.toString() || '',
          raw: existingState.score.raw?.toString() || '',
        },
        entry: existingState.hasBeenLaunched ? 'resume' : 'ab-initio',
        scaled_passing_score: sco.scaledPassingScore?.toString() || '',
      },
    });

    this.state.updateScoState(scoId, { hasBeenLaunched: true });
    this.state.setCurrentSco(scoId);

    this.dom.loading.hidden = false;
    this.dom.frame.src = `${sco.launchUrl}?sco=${scoId}&title=${encodeURIComponent(sco.title)}`;
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
    for (const sco of this.manifest.scos) {
      const state = this.state.getScoState(sco.id);
      if (!isScorm2004Completed(state.completionStatus)) {
        this.launchSco(sco.id);
        return;
      }
    }
    if (this.manifest.scos.length > 0) {
      this.launchSco(this.manifest.scos[0].id);
    }
  }

  exitCourse() {
    if (this.state.currentScoId) {
      this.api.Terminate('');
    }
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
      const status = getNormalizedStatus({
        completionStatus: state.completionStatus,
        successStatus: state.successStatus,
      });

      const li = createElement('li', { className: 'menu-item', role: 'treeitem' });
      const btn = createElement(
        'button',
        {
          className: 'menu-item-btn',
          dataset: { scoId: sco.id },
          onClick: () => this.launchSco(sco.id),
        },
        [
          createElement('span', { className: 'menu-item-icon', dataset: { status } }),
          createElement('span', { className: 'menu-item-title' }, [sco.title]),
          createElement('span', { className: 'menu-item-score' }, [
            state.score.scaled !== null ? `${Math.round(state.score.scaled * 100)}%` : '',
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

    const status = getNormalizedStatus({
      completionStatus: state.completionStatus,
      successStatus: state.successStatus,
    });
    icon.dataset.status = status;

    scoreEl.textContent =
      state.score.scaled !== null ? `${Math.round(state.score.scaled * 100)}%` : '';
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
      this.dom.btnNext.disabled = false;
      return;
    }

    const idx = this.manifest.scos.findIndex((s) => s.id === current);
    this.dom.btnPrev.disabled = idx <= 0;
    this.dom.btnNext.disabled = idx >= this.manifest.scos.length - 1;
  }

  updateProgress() {
    const rollup = this.state.calculateRollup();

    this.dom.progressFill.style.width = `${rollup.completionPct}%`;
    this.dom.progressText.textContent = `${rollup.completionPct}% Complete`;

    if (rollup.avgScore !== null) {
      this.dom.progressScore.textContent = `Score: ${rollup.avgScore}%`;
      this.dom.progressScore.hidden = false;
    } else {
      this.dom.progressScore.hidden = true;
    }

    const statusLabels = {
      'not attempted': 'Not Started',
      incomplete: 'In Progress',
      completed: 'Completed',
      passed: 'Passed',
    };
    this.dom.status.textContent = statusLabels[rollup.overallStatus] || rollup.overallStatus;
    this.dom.status.dataset.status = rollup.overallStatus;
  }

  showCompletionScreen(rollup) {
    this.dom.finalScore.textContent = rollup.avgScore !== null ? `${rollup.avgScore}%` : '--';
    this.dom.finalTime.textContent = rollup.totalTime;
    this.dom.completionOverlay.hidden = false;
  }
}

// =============================================================================
// Initialize
// =============================================================================

const player = new Scorm2004SimplePlayer();
player.init();

window.scormPlayer = player;
