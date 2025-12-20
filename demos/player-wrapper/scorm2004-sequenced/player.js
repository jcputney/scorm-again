/**
 * SCORM 2004 Sequenced Player
 * Uses full sequencing engine with event listeners
 */

import { Scorm2004API } from 'scorm-again/Scorm2004API';
import {
  $,
  createElement,
  formatTimeHuman,
  getNormalizedStatus,
  createLogger,
} from '../shared/player-core.js';

const log = createLogger('SCORM2004-Sequenced');

// =============================================================================
// Course Manifest with Activity Tree
// =============================================================================

const COURSE_MANIFEST = {
  id: 'scorm2004-sequenced-demo',
  title: 'SCORM 2004 Sequenced Demo',
  // Hierarchical activity tree
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
              launchUrl: './sample-course/module1/lesson1/index.html',
            },
            {
              id: 'module1-lesson2',
              title: 'Lesson 2: Basics',
              launchUrl: './sample-course/module1/lesson2/index.html',
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
              launchUrl: './sample-course/module2/lesson1/index.html',
            },
            {
              id: 'module2-quiz',
              title: 'Module Quiz',
              launchUrl: './sample-course/module2/quiz/index.html',
            },
          ],
        },
        {
          id: 'final-assessment',
          title: 'Final Assessment',
          launchUrl: './sample-course/final-assessment/index.html',
        },
      ],
    },
  ],
};

// =============================================================================
// Sequenced Player
// =============================================================================

class Scorm2004SequencedPlayer {
  constructor() {
    this.api = null;
    this.manifest = COURSE_MANIFEST;
    this.currentActivityId = null;
    this.choiceValidity = {};

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
      completionTitle: $('#completion-title'),
      completionMessage: $('#completion-message'),
      finalScore: $('#final-score'),
      finalTime: $('#final-time'),
    };
  }

  init() {
    log.info('Initializing SCORM 2004 Sequenced Player...');

    this.initApi();
    this.buildMenu();
    this.dom.title.textContent = this.manifest.title;

    this.setupUiListeners();

    // Start sequencing via the engine (not manual activity launch)
    // This triggers onActivityDelivery which loads the first activity
    this.startSequencing();

    log.info('Player initialized');
  }

  startSequencing() {
    log.info('Starting sequencing engine...');
    this.dom.loading.hidden = false;
    const started = this.api.processNavigationRequest('start');
    if (!started) {
      log.error('Failed to start sequencing, falling back to manual launch');
      this.launchFirstActivityManually();
    }
  }

  launchFirstActivityManually() {
    // Fallback: manually launch first activity if sequencing fails
    const firstLeaf = this.findFirstLeafActivity(this.manifest.activities[0]);
    if (firstLeaf) {
      log.info(`Manual fallback - launching first leaf: ${firstLeaf.id}`);
      this.currentActivityId = firstLeaf.id;
      const url = `${firstLeaf.launchUrl}?activity=${firstLeaf.id}&title=${encodeURIComponent(firstLeaf.title)}`;
      this.dom.frame.onload = () => {
        this.dom.loading.hidden = true;
      };
      this.dom.frame.src = url;
      this.highlightCurrentActivity(firstLeaf.id);
    }
  }

  // ---------------------------------------------------------------------------
  // Activity Tree Utilities
  // ---------------------------------------------------------------------------

  findFirstLeafActivity(activity) {
    if (!activity) return null;
    if (!activity.isContainer && activity.launchUrl) {
      return activity;
    }
    if (activity.children) {
      for (const child of activity.children) {
        const leaf = this.findFirstLeafActivity(child);
        if (leaf) return leaf;
      }
    }
    return null;
  }

  initApi() {
    this.api = new Scorm2004API({
      autocommit: true,
      autocommitSeconds: 30,
      logLevel: 4,
      sequencing: {
        // Enable sequencing engine
        enabled: true,
        // Activity tree from manifest (pass root activity, not array)
        activityTree: this.manifest.activities[0],
        // Event listeners for sequencing events
        eventListeners: {
          onActivityDelivery: (activity) => this.handleActivityDelivery(activity),
          onNavigationValidityUpdate: (data) => this.handleNavValidityUpdate(data),
          onRollupComplete: (activity) => this.handleRollupComplete(activity),
          onSequencingSessionEnd: (data) => this.handleSessionEnd(data),
          onSequencingError: (error, context) => this.handleSequencingError(error, context),
        },
      },
    });

    window.API_1484_11 = this.api;

    // Set up core API event listeners
    this.setupApiListeners();

    log.info('SCORM 2004 API with sequencing initialized');
  }

  setupApiListeners() {
    // Core API events
    this.api.on('Initialize', () => this.handleInitialize());
    this.api.on('SetValue', (el, val) => this.handleSetValue(el, val));
    this.api.on('Terminate', () => this.handleTerminate());
  }

  // ---------------------------------------------------------------------------
  // Sequencing Event Handlers
  // ---------------------------------------------------------------------------

  handleActivityDelivery(activity) {
    log.info(`Activity delivery: ${activity.id}`);

    this.currentActivityId = activity.id;
    this.dom.loading.hidden = false;

    // Find activity in tree to get launch URL
    const activityDef = this.findActivity(activity.id);
    if (activityDef?.launchUrl) {
      // Set up onload handler to hide loading when content loads
      this.dom.frame.onload = () => {
        this.dom.loading.hidden = true;
      };
      const url = `${activityDef.launchUrl}?activity=${activity.id}&title=${encodeURIComponent(activityDef.title)}`;
      this.dom.frame.src = url;
    }

    // Update menu highlight
    this.highlightCurrentActivity(activity.id);
  }

  handleNavValidityUpdate(data) {
    log.info('Navigation validity update:', data);

    // Event format: {continue: boolean, previous: boolean, choice: {activityId: boolean}, jump: {...}}
    const canContinue = data.continue === true;
    const canPrevious = data.previous === true;

    this.dom.btnNext.disabled = !canContinue;
    this.dom.btnNext.dataset.valid = canContinue;

    this.dom.btnPrev.disabled = !canPrevious;
    this.dom.btnPrev.dataset.valid = canPrevious;

    // Store choice validity for menu updates
    this.choiceValidity = data.choice || {};

    // Update choice navigation in menu
    this.updateMenuChoiceValidity();
  }

  handleRollupComplete(activity) {
    log.info(`Rollup complete for: ${activity.id}`);

    // Update ALL menu item statuses after rollup (including parent activities)
    this.updateAllMenuStatuses();

    // Update overall progress
    this.updateProgress();
  }

  handleSessionEnd(data) {
    log.info('Sequencing session end:', data.reason);

    this.dom.frame.src = 'about:blank';
    this.currentActivityId = null;

    // Show completion screen
    const reason = data.reason;
    if (reason === 'complete') {
      this.dom.completionTitle.textContent = 'Congratulations!';
      this.dom.completionMessage.textContent = 'You have successfully completed this course.';
    } else if (reason === 'suspend') {
      this.dom.completionTitle.textContent = 'Progress Saved';
      this.dom.completionMessage.textContent = 'Your progress has been saved. You can resume later.';
    } else {
      this.dom.completionTitle.textContent = 'Session Ended';
      this.dom.completionMessage.textContent = `Session ended: ${reason}`;
    }

    this.dom.completionOverlay.hidden = false;
  }

  handleSequencingError(error, context) {
    log.error(`Sequencing error: ${error}`, context);
  }

  // ---------------------------------------------------------------------------
  // Core API Event Handlers
  // ---------------------------------------------------------------------------

  handleInitialize() {
    log.info('Initialize called');
    this.dom.loading.hidden = true;
  }

  handleSetValue(element, value) {
    log.debug(`SetValue: ${element} = ${value}`);
    // Sequencing engine handles state tracking
  }

  handleTerminate() {
    log.info('Terminate called');
    // Sequencing engine handles navigation after terminate
  }

  // ---------------------------------------------------------------------------
  // UI Event Handlers
  // ---------------------------------------------------------------------------

  setupUiListeners() {
    this.dom.btnNext.addEventListener('click', () => {
      if (this.validRequests.includes('continue')) {
        this.api.processNavigationRequest('continue');
      }
    });

    this.dom.btnPrev.addEventListener('click', () => {
      if (this.validRequests.includes('previous')) {
        this.api.processNavigationRequest('previous');
      }
    });

    this.dom.btnExit.addEventListener('click', () => {
      this.api.processNavigationRequest('exitAll');
    });

    this.dom.menuToggle.addEventListener('click', () => {
      const expanded = this.dom.menu.getAttribute('aria-expanded') === 'true';
      this.dom.menu.setAttribute('aria-expanded', !expanded);
    });
  }

  // ---------------------------------------------------------------------------
  // Menu Building (Hierarchical)
  // ---------------------------------------------------------------------------

  buildMenu() {
    const menuList = this.dom.menuList;

    while (menuList.firstChild) {
      menuList.removeChild(menuList.firstChild);
    }

    // Build from root's children (skip root itself)
    const root = this.manifest.activities[0];
    if (root.children) {
      for (const child of root.children) {
        const item = this.createMenuItem(child);
        menuList.appendChild(item);
      }
    }
  }

  createMenuItem(activity) {
    const isContainer = activity.isContainer && activity.children?.length > 0;

    const li = createElement('li', {
      className: `menu-item ${isContainer ? 'menu-item--parent' : ''}`,
      role: 'treeitem',
      'aria-expanded': isContainer ? 'true' : undefined,
    });

    const btnContent = [
      createElement('span', { className: 'menu-item-icon', dataset: { status: 'not-attempted' } }),
      createElement('span', { className: 'menu-item-title' }, [activity.title]),
    ];

    if (isContainer) {
      // Add expand/collapse button for containers
      const expandBtn = createElement('button', {
        className: 'menu-expand',
        'aria-expanded': 'true',
        'aria-label': 'Toggle section',
        onClick: (e) => {
          e.stopPropagation();
          this.toggleMenuSection(li);
        },
      }, ['▼']);

      btnContent.unshift(expandBtn);
    }

    const btn = createElement(
      'button',
      {
        className: 'menu-item-btn',
        dataset: { activityId: activity.id },
        disabled: isContainer, // Containers not directly launchable
        onClick: () => this.handleMenuChoice(activity.id),
      },
      btnContent
    );

    li.appendChild(btn);

    // Add children for containers
    if (isContainer) {
      const childList = createElement('ol', { className: 'menu-children', role: 'group' });
      for (const child of activity.children) {
        const childItem = this.createMenuItem(child);
        childItem.classList.add('menu-item--child');
        childList.appendChild(childItem);
      }
      li.appendChild(childList);
    }

    return li;
  }

  toggleMenuSection(li) {
    const childList = li.querySelector('.menu-children');
    const expandBtn = li.querySelector('.menu-expand');

    if (childList && expandBtn) {
      const isExpanded = expandBtn.getAttribute('aria-expanded') === 'true';
      expandBtn.setAttribute('aria-expanded', !isExpanded);
      childList.hidden = isExpanded;
    }
  }

  handleMenuChoice(activityId) {
    // Check if choice navigation is valid for this activity
    // Choice validity uses string "true"/"false" not booleans
    const isValid = this.choiceValidity && this.choiceValidity[activityId] === 'true';
    if (isValid) {
      this.api.processNavigationRequest('choice', activityId);
    } else {
      log.warn(`Choice navigation not valid for: ${activityId}`);
    }
  }

  updateMenuChoiceValidity() {
    const buttons = this.dom.menuList.querySelectorAll('.menu-item-btn[data-activity-id]');

    buttons.forEach((btn) => {
      const activityId = btn.dataset.activityId;
      const activity = this.findActivity(activityId);

      // Skip containers
      if (activity?.isContainer) return;

      // Check if choice to this activity is valid (uses string "true"/"false")
      const isValid = this.choiceValidity && this.choiceValidity[activityId] === 'true';

      btn.disabled = !isValid;
    });
  }

  highlightCurrentActivity(activityId) {
    const buttons = this.dom.menuList.querySelectorAll('.menu-item-btn');
    buttons.forEach((btn) => {
      btn.setAttribute('aria-current', btn.dataset.activityId === activityId);
    });
  }

  updateMenuItemStatus(activityId) {
    const btn = this.dom.menuList.querySelector(`[data-activity-id="${activityId}"]`);
    if (!btn) return;

    const icon = btn.querySelector('.menu-item-icon');
    if (!icon) return;

    // Get status from sequencing engine's tracking data
    const trackingData = this.api.getActivityTrackingData?.(activityId);
    if (trackingData) {
      const status = getNormalizedStatus({
        completionStatus: trackingData.completionStatus,
        successStatus: trackingData.successStatus,
      });
      icon.dataset.status = status;
    }
  }

  updateAllMenuStatuses() {
    // Update status for all menu items (including parent containers)
    const buttons = this.dom.menuList.querySelectorAll('.menu-item-btn[data-activity-id]');
    buttons.forEach((btn) => {
      const activityId = btn.dataset.activityId;
      this.updateMenuItemStatus(activityId);
    });
  }

  updateProgress() {
    // Get rollup from sequencing engine
    const rootData = this.api.getActivityTrackingData?.('root');
    if (rootData) {
      const completionPct = rootData.progressMeasure
        ? Math.round(rootData.progressMeasure * 100)
        : 0;

      this.dom.progressFill.style.width = `${completionPct}%`;
      this.dom.progressText.textContent = `${completionPct}% Complete`;
    }
  }

  // ---------------------------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------------------------

  findActivity(id, activities = this.manifest.activities) {
    for (const activity of activities) {
      if (activity.id === id) return activity;
      if (activity.children) {
        const found = this.findActivity(id, activity.children);
        if (found) return found;
      }
    }
    return null;
  }
}

// =============================================================================
// Initialize
// =============================================================================

const player = new Scorm2004SequencedPlayer();
player.init();

window.scormPlayer = player;
