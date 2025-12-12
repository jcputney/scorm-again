import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  SequencingProcess,
  SequencingRequestType,
  DeliveryRequestType,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import {
  OverallSequencingProcess,
  NavigationRequestType,
} from "../../../../src/cmi/scorm2004/sequencing/overall_sequencing_process";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ADLNav } from "../../../../src/cmi/scorm2004/adl";

/**
 * GAP-01: EndSequencingSession Handling Tests
 *
 * These tests verify that the sequencing system properly detects and signals
 * when a sequencing session should terminate, following SCORM 2004 3rd Edition
 * reference implementation behavior.
 *
 * Key behaviors tested:
 * 1. Forward navigation at end of tree sets endSequencingSession = true
 * 2. Backward navigation at beginning does NOT set endSequencingSession = true
 * 3. Flow traversal properly detects end of tree
 * 4. Flag propagates through Continue/Previous processes
 * 5. Overall process fires onSequencingSessionEnd event
 *
 * Reference: docs/reference-analysis/gaps/01-end-sequencing-session-handling.md
 */
describe("GAP-01: EndSequencingSession Handling", () => {
  let sequencingProcess: SequencingProcess;
  let overallProcess: OverallSequencingProcess;
  let activityTree: ActivityTree;
  let rollupProcess: RollupProcess;
  let adlNav: ADLNav;
  let root: Activity;
  let sco1: Activity;
  let sco2: Activity;
  let sco3: Activity;

  let eventCallback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Create a simple sequential course with 3 SCOs
    activityTree = new ActivityTree();
    root = new Activity("root", "Course");
    sco1 = new Activity("sco1", "SCO 1");
    sco2 = new Activity("sco2", "SCO 2");
    sco3 = new Activity("sco3", "SCO 3");

    // Build tree structure
    root.addChild(sco1);
    root.addChild(sco2);
    root.addChild(sco3);
    activityTree.root = root;

    // Enable flow control
    root.sequencingControls.flow = true;

    // Initialize sequencing components
    sequencingProcess = new SequencingProcess(activityTree);
    rollupProcess = new RollupProcess();
    adlNav = new ADLNav();

    // Create event callback spy
    eventCallback = vi.fn();

    overallProcess = new OverallSequencingProcess(
      activityTree,
      sequencingProcess,
      rollupProcess,
      adlNav,
      eventCallback
    );
  });

  describe("Test 1: Forward at End of Tree", () => {
    it("should set endSequencingSession=true when continuing past last activity", () => {
      // Setup: Navigate to last SCO
      activityTree.currentActivity = sco3;
      sco3.isActive = false; // Terminate it

      // Execute: Press Continue
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CONTINUE
      );

      // Verify: Should have exception but also endSequencingSession flag
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.7-2"); // No activity available
      expect(result.endSequencingSession).toBe(true); // Session should end
      expect(result.targetActivity).toBeNull();
    });

    it("should terminate all descendent attempts when reaching end of tree", () => {
      // Setup: Last SCO is active
      activityTree.currentActivity = sco3;
      sco3.isActive = false;
      root.isActive = true; // Root should be terminated

      // Execute: Continue past end
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CONTINUE
      );

      // Verify: Root should be terminated per SB.2.1 step 3.1.1
      expect(result.endSequencingSession).toBe(true);
      expect(root.isActive).toBe(false);
    });
  });

  describe("Test 2: Backward at Beginning of Tree", () => {
    it("should NOT set endSequencingSession when going previous at first activity", () => {
      // Setup: At first SCO
      activityTree.currentActivity = sco1;
      sco1.isActive = false; // Terminate it

      // Execute: Press Previous
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.PREVIOUS
      );

      // Verify: Should fail but NOT end session
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.8-2"); // No activity available
      expect(result.endSequencingSession).toBe(false); // Session continues
      expect(result.targetActivity).toBeNull();
    });

    it("should handle backward at beginning differently than forward at end", () => {
      activityTree.currentActivity = sco1;
      sco1.isActive = false;

      const previousResult = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.PREVIOUS
      );

      activityTree.currentActivity = sco3;
      sco3.isActive = false;

      const continueResult = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CONTINUE
      );

      // Both fail, but only continue at end should set endSequencingSession
      expect(previousResult.endSequencingSession).toBe(false);
      expect(continueResult.endSequencingSession).toBe(true);
    });
  });

  describe("Test 3: Continue with More Activities Available", () => {
    it("should NOT set endSequencingSession when more activities exist forward", () => {
      // Setup: At middle SCO
      activityTree.currentActivity = sco2;
      sco2.isActive = false;

      // Execute: Continue
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CONTINUE
      );

      // Verify: Should succeed and NOT end session
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(sco3);
      expect(result.endSequencingSession).toBe(false);
      expect(result.exception).toBeNull();
    });

    it("should NOT set endSequencingSession when going previous with activities behind", () => {
      // Setup: At middle SCO
      activityTree.currentActivity = sco2;
      sco2.isActive = false;

      // Execute: Previous
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.PREVIOUS
      );

      // Verify: Should succeed and NOT end session
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(sco1);
      expect(result.endSequencingSession).toBe(false);
      expect(result.exception).toBeNull();
    });
  });

  describe("Test 4: Flow Traversal End Detection", () => {
    it("should detect last activity overall in forward traversal", () => {
      // Setup: Navigate to last activity
      activityTree.currentActivity = sco3;
      sco3.isActive = false;

      // Execute
      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CONTINUE
      );

      // Verify: flowTreeTraversalSubprocess should have set endSequencingSession
      expect(result.endSequencingSession).toBe(true);
    });

    it("should detect end of tree in nested structure", () => {
      // Create new tree with deeper nesting
      const nestedTree = new ActivityTree();
      const nestedRoot = new Activity("root", "Root");
      const module = new Activity("module", "Module");
      const lesson = new Activity("lesson", "Lesson");
      const deepSco = new Activity("deepSco", "Deep SCO");

      nestedRoot.addChild(module);
      module.addChild(lesson);
      lesson.addChild(deepSco);
      nestedTree.root = nestedRoot;

      nestedRoot.sequencingControls.flow = true;
      module.sequencingControls.flow = true;
      lesson.sequencingControls.flow = true;

      const nestedProcess = new SequencingProcess(nestedTree);

      // Navigate to deepest activity
      nestedTree.currentActivity = deepSco;
      deepSco.isActive = false;

      // Execute
      const result = nestedProcess.sequencingRequestProcess(
        SequencingRequestType.CONTINUE
      );

      // Verify: Should detect end even in nested structure
      expect(result.endSequencingSession).toBe(true);
      expect(result.exception).toBe("SB.2.7-2");
    });

    it("should handle end detection with multiple siblings", () => {
      // Verify that having siblings doesn't confuse end detection
      activityTree.currentActivity = sco3;
      sco3.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CONTINUE
      );

      expect(result.endSequencingSession).toBe(true);
    });
  });

  describe("Test 5: Event Firing on Session End", () => {
    it("should fire onSequencingSessionEnd event when session ends", () => {
      // Navigate to last activity
      overallProcess.processNavigationRequest(NavigationRequestType.START);
      activityTree.currentActivity = sco3;
      sco3.isActive = false;

      // Clear event callback from initialization
      eventCallback.mockClear();

      // Execute: Continue past end
      overallProcess.processNavigationRequest(NavigationRequestType.CONTINUE);

      // Verify: Event should fire
      expect(eventCallback).toHaveBeenCalledWith(
        "onSequencingSessionEnd",
        expect.objectContaining({
          reason: "end_of_content",
          exception: "SB.2.7-2",
        })
      );
    });

    it("should NOT fire onSequencingSessionEnd when session continues", () => {
      // Navigate to first activity
      overallProcess.processNavigationRequest(NavigationRequestType.START);
      activityTree.currentActivity = sco1;
      sco1.isActive = false;

      // Clear event callback from initialization
      eventCallback.mockClear();

      // Continue to next (not at end)
      overallProcess.processNavigationRequest(NavigationRequestType.CONTINUE);

      // Verify: onSequencingSessionEnd event should NOT fire
      const sessionEndCalls = eventCallback.mock.calls.filter(
        (call) => call[0] === "onSequencingSessionEnd"
      );
      expect(sessionEndCalls).toHaveLength(0);
    });

    it("should NOT fire event when previous fails at beginning", () => {
      // Start and go to first activity
      overallProcess.processNavigationRequest(NavigationRequestType.START);
      activityTree.currentActivity = sco1;
      sco1.isActive = false;

      // Clear event callback from initialization
      eventCallback.mockClear();

      // Try to go previous at beginning
      overallProcess.processNavigationRequest(NavigationRequestType.PREVIOUS);

      // Verify: onSequencingSessionEnd event should NOT fire (backward at beginning doesn't end session)
      const sessionEndCalls = eventCallback.mock.calls.filter(
        (call) => call[0] === "onSequencingSessionEnd"
      );
      expect(sessionEndCalls).toHaveLength(0);
    });

    it("should include navigation request in event data", () => {
      // Navigate to end
      activityTree.currentActivity = sco3;
      sco3.isActive = false;

      // Clear event callback
      eventCallback.mockClear();

      // Continue past end
      overallProcess.processNavigationRequest(NavigationRequestType.CONTINUE);

      // Verify: Event includes navigation request
      expect(eventCallback).toHaveBeenCalledWith(
        "onSequencingSessionEnd",
        expect.objectContaining({
          navigationRequest: NavigationRequestType.CONTINUE,
        })
      );
    });
  });

  describe("Edge Cases and Integration", () => {
    it("should handle flow=false without setting endSequencingSession", () => {
      // Disable flow
      root.sequencingControls.flow = false;
      activityTree.currentActivity = sco1;
      sco1.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CONTINUE
      );

      // Verify: Should fail due to flow control, not end of session
      expect(result.exception).toBe("SB.2.7-2");
      expect(result.endSequencingSession).toBe(false);
    });

    it("should handle forwardOnly=true without affecting end detection", () => {
      root.sequencingControls.forwardOnly = true;
      activityTree.currentActivity = sco3;
      sco3.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CONTINUE
      );

      // Verify: End of session still detected
      expect(result.endSequencingSession).toBe(true);
    });

    it("should propagate endSequencingSession through SequencingResult", () => {
      activityTree.currentActivity = sco3;
      sco3.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CONTINUE
      );

      // Verify: SequencingResult has the field
      expect(result).toHaveProperty("endSequencingSession");
      expect(typeof result.endSequencingSession).toBe("boolean");
      expect(result.endSequencingSession).toBe(true);
    });

    it("should work with single-activity tree", () => {
      // Create tree with single activity
      const singleTree = new ActivityTree();
      const singleRoot = new Activity("root", "Root");
      const singleSco = new Activity("sco", "Single SCO");
      singleRoot.addChild(singleSco);
      singleTree.root = singleRoot;
      singleRoot.sequencingControls.flow = true;

      const singleProcess = new SequencingProcess(singleTree);
      singleTree.currentActivity = singleSco;
      singleSco.isActive = false;

      const result = singleProcess.sequencingRequestProcess(
        SequencingRequestType.CONTINUE
      );

      expect(result.endSequencingSession).toBe(true);
    });

    it("should handle tree with no deliverable children gracefully", () => {
      // Tree with children but none are deliverable
      const emptyTree = new ActivityTree();
      const emptyRoot = new Activity("root", "Empty Course");
      const unavailableChild = new Activity("child", "Unavailable Child");
      unavailableChild.isAvailable = false;
      emptyRoot.addChild(unavailableChild);
      emptyTree.root = emptyRoot;
      emptyRoot.sequencingControls.flow = true;

      const emptyProcess = new SequencingProcess(emptyTree);

      const result = emptyProcess.sequencingRequestProcess(
        SequencingRequestType.START
      );

      // Should fail to start (no activities available)
      expect(result.exception).toBe("SB.2.5-3");
      // Note: endSequencingSession is false here because START failed before flow
      expect(result.endSequencingSession).toBe(false);
    });
  });

  describe("Sequencing Request Process Integration", () => {
    it("should preserve endSequencingSession flag through exception handling", () => {
      activityTree.currentActivity = sco3;
      sco3.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CONTINUE
      );

      // Verify: Both exception and flag are present
      expect(result.exception).toBeTruthy();
      expect(result.endSequencingSession).toBe(true);
    });

    it("should initialize endSequencingSession to false by default", () => {
      activityTree.currentActivity = sco1;
      sco1.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CONTINUE
      );

      // Verify: Default is false when session doesn't end
      expect(result.endSequencingSession).toBe(false);
    });

    it("should handle rapid navigation to end", () => {
      // Start at first
      activityTree.currentActivity = sco1;
      sco1.isActive = false;

      // Navigate through all
      let result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CONTINUE
      );
      expect(result.endSequencingSession).toBe(false);

      activityTree.currentActivity = sco2;
      sco2.isActive = false;

      result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CONTINUE
      );
      expect(result.endSequencingSession).toBe(false);

      activityTree.currentActivity = sco3;
      sco3.isActive = false;

      result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CONTINUE
      );
      expect(result.endSequencingSession).toBe(true);
    });
  });

  describe("Overall Sequencing Process Integration", () => {
    it("should return appropriate DeliveryRequest when session ends", () => {
      activityTree.currentActivity = sco3;
      sco3.isActive = false;

      const result = overallProcess.processNavigationRequest(
        NavigationRequestType.CONTINUE
      );

      // Verify: Delivery request indicates failure due to session end
      expect(result.valid).toBe(false);
      expect(result.exception).toBeTruthy();
    });

    it("should handle session end after multiple successful navigations", () => {
      // Navigate through course
      overallProcess.processNavigationRequest(NavigationRequestType.START);
      activityTree.currentActivity = sco1;
      sco1.isActive = false;

      overallProcess.processNavigationRequest(NavigationRequestType.CONTINUE);
      activityTree.currentActivity = sco2;
      sco2.isActive = false;

      overallProcess.processNavigationRequest(NavigationRequestType.CONTINUE);
      activityTree.currentActivity = sco3;
      sco3.isActive = false;

      // Clear event callback
      eventCallback.mockClear();

      // Final continue should end session
      overallProcess.processNavigationRequest(NavigationRequestType.CONTINUE);

      // Verify event was fired
      expect(eventCallback).toHaveBeenCalledWith(
        "onSequencingSessionEnd",
        expect.any(Object)
      );
    });
  });
});
