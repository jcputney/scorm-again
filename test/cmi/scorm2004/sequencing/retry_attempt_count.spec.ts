import {beforeEach, describe, expect, it} from 'vitest';
import {Activity} from '../../../../src/cmi/scorm2004/sequencing/activity';
import {ActivityTree} from '../../../../src/cmi/scorm2004/sequencing/activity_tree';
import {
  DeliveryRequestType,
  SequencingProcess,
  SequencingRequestType
} from '../../../../src/cmi/scorm2004/sequencing/sequencing_process';
import {
  OverallSequencingProcess
} from '../../../../src/cmi/scorm2004/sequencing/overall_sequencing_process';

/**
 * Fix double-increment bug on RETRY requests
 *
 * Problem: On RETRY navigation, the attempt count was incremented twice:
 * 1. In retrySequencingRequestProcess() at line 664 (REMOVED)
 * 2. In contentDeliveryEnvironmentProcess() at line 1028 (KEPT)
 *
 * This test validates that RETRY only increments the attempt count once,
 * and that the increment happens during content delivery, not during
 * retry sequencing request processing.
 */
describe('RETRY Attempt Count Single-Increment Fix', () => {
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let overallSequencingProcess: OverallSequencingProcess;
  let activity: Activity;

  beforeEach(() => {
    // Create a simple activity tree with one child
    activityTree = new ActivityTree();
    const root = new Activity('root', 'Root');
    activity = new Activity('child1', 'Child 1');

    root.addChild(activity);
    activityTree.root = root;

    // Initialize sequencing processes
    sequencingProcess = new SequencingProcess(activityTree);
    overallSequencingProcess = new OverallSequencingProcess(activityTree, sequencingProcess);
  });

  it('should NOT increment attempt count in retrySequencingRequestProcess', () => {
    // Set up: activity has been attempted once and is terminated
    activityTree.currentActivity = activity;
    // Per SB.2.10: Activity must NOT be active or suspended for retry to work
    activity.isActive = false;
    activity.isSuspended = false;
    activity.attemptCount = 1;

    // Execute RETRY request
    const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.RETRY);

    // Verify the result indicates delivery
    expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
    expect(result.targetActivity).toBe(activity);

    // FIX: Attempt count should NOT be incremented in retrySequencingRequestProcess
    // It should still be 1 (will be incremented later during content delivery)
    expect(activity.attemptCount).toBe(1);
  });

  it('should increment attempt count ONCE during content delivery for RETRY', () => {
    // Set up: activity has been attempted once and is terminated
    activityTree.currentActivity = activity;
    // Per SB.2.10: Activity must NOT be active or suspended for retry to work
    activity.isActive = false;
    activity.isSuspended = false;
    activity.attemptCount = 1;

    // First, process the RETRY request
    const retryResult = sequencingProcess.sequencingRequestProcess(SequencingRequestType.RETRY);
    expect(retryResult.deliveryRequest).toBe(DeliveryRequestType.DELIVER);

    // At this point, attempt count should still be 1
    expect(activity.attemptCount).toBe(1);

    // Now process content delivery
    overallSequencingProcess.contentDeliveryEnvironmentProcess(activity);

    // After content delivery, attempt count should be incremented ONCE to 2
    expect(activity.attemptCount).toBe(2);
  });

  it('should increment correctly across multiple RETRY cycles', () => {
    activityTree.currentActivity = activity;
    activity.isActive = false;
    activity.attemptCount = 0;

    // First delivery (attempt 1)
    overallSequencingProcess.contentDeliveryEnvironmentProcess(activity);
    expect(activity.attemptCount).toBe(1);

    // First RETRY: request processing doesn't increment
    activity.isActive = false;
    sequencingProcess.sequencingRequestProcess(SequencingRequestType.RETRY);
    expect(activity.attemptCount).toBe(1);

    // First RETRY: delivery increments to 2
    overallSequencingProcess.contentDeliveryEnvironmentProcess(activity);
    expect(activity.attemptCount).toBe(2);

    // Second RETRY: request processing doesn't increment
    activity.isActive = false;
    sequencingProcess.sequencingRequestProcess(SequencingRequestType.RETRY);
    expect(activity.attemptCount).toBe(2);

    // Second RETRY: delivery increments to 3
    overallSequencingProcess.contentDeliveryEnvironmentProcess(activity);
    expect(activity.attemptCount).toBe(3);

    // Third RETRY: request processing doesn't increment
    activity.isActive = false;
    sequencingProcess.sequencingRequestProcess(SequencingRequestType.RETRY);
    expect(activity.attemptCount).toBe(3);

    // Third RETRY: delivery increments to 4
    overallSequencingProcess.contentDeliveryEnvironmentProcess(activity);
    expect(activity.attemptCount).toBe(4);

    // The pattern should be 1, 2, 3, 4 - NOT 2, 4, 6, 8 (the bug)
  });

  it('should NOT increment attempt count on resume', () => {
    activityTree.currentActivity = activity;
    activity.isActive = false;
    activity.isSuspended = true;
    activity.attemptCount = 1;

    // Note: contentDeliveryEnvironmentProcess doesn't have a resume parameter
    // Resumption is handled by checking isSuspended flag
    overallSequencingProcess.contentDeliveryEnvironmentProcess(activity);

    // On resume, attempt count should NOT be incremented
    expect(activity.attemptCount).toBe(1);
  });

  it('should increment attempt count on new delivery', () => {
    activityTree.currentActivity = null;
    activity.isActive = false;
    activity.attemptCount = 0;

    // First delivery
    overallSequencingProcess.contentDeliveryEnvironmentProcess(activity);

    // New delivery should increment attempt count
    expect(activity.attemptCount).toBe(1);
  });
});
