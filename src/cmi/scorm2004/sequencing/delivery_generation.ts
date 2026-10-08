import { Activity } from "./activity";

// Runtime-only delivery identity: never part of Activity or persisted sequencing state.
const deliveryGenerations = new WeakMap<Activity, number>();

/**
 * Get how many times DB.2 has delivered the activity in this runtime.
 * @param {Activity} activity - The delivered activity
 * @return {number} - The delivery generation, or 0 if it has never been delivered
 */
export function getDeliveryGeneration(activity: Activity): number {
  return deliveryGenerations.get(activity) ?? 0;
}

/**
 * Record a new DB.2 delivery of the activity.
 * @param {Activity} activity - The activity being delivered
 */
export function advanceDeliveryGeneration(activity: Activity): void {
  // @spec SCORM 2004 4th Ed. SN DB.2: each delivery launches content, including
  // a resumed attempt; SCORM 2004 4th Ed. RTE 4.2.7: that launch has entry=resume.
  deliveryGenerations.set(activity, getDeliveryGeneration(activity) + 1);
}
