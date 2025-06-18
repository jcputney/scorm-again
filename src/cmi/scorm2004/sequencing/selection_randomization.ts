import { Activity } from "./activity";
import { SelectionTiming, RandomizationTiming } from "./sequencing_controls";

/**
 * Class implementing SCORM 2004 Selection and Randomization processes (SR.1 and SR.2)
 */
export class SelectionRandomization {
  /**
   * Select Children Process (SR.1)
   * Selects a subset of child activities based on selection controls
   * @param {Activity} activity - The parent activity whose children need to be selected
   * @return {Activity[]} - The selected child activities
   */
  public static selectChildrenProcess(activity: Activity): Activity[] {
    const controls = activity.sequencingControls;
    const children = [...activity.children]; // Create a copy to avoid mutating original

    // Check if selection should occur
    if (controls.selectionTiming === SelectionTiming.NEVER) {
      return children;
    }

    // Check if selection has already been done (for ONCE timing)
    if (
      controls.selectionTiming === SelectionTiming.ONCE &&
      controls.selectionCountStatus
    ) {
      return children;
    }

    // Check if we need to select children
    const selectCount = controls.selectCount;
    if (selectCount === null || selectCount >= children.length) {
      // Mark selection as done if timing is ONCE
      if (controls.selectionTiming === SelectionTiming.ONCE) {
        controls.selectionCountStatus = true;
      }
      return children;
    }

    // Perform selection
    const selectedChildren: Activity[] = [];
    const availableIndices = children.map((_, index) => index);

    // Randomly select children
    for (let i = 0; i < selectCount; i++) {
      if (availableIndices.length === 0) break;
      
      const randomIndex = Math.floor(Math.random() * availableIndices.length);
      const childIndex = availableIndices[randomIndex];
      if (childIndex !== undefined && children[childIndex]) {
        selectedChildren.push(children[childIndex]);
      }
      
      // Remove selected index from available indices
      availableIndices.splice(randomIndex, 1);
    }

    // Mark selection as done only if timing is ONCE
    if (controls.selectionTiming === SelectionTiming.ONCE) {
      controls.selectionCountStatus = true;
    }

    // Hide non-selected children from choice
    for (const child of children) {
      if (!selectedChildren.includes(child)) {
        child.isHiddenFromChoice = true;
        child.isAvailable = false;
      }
    }

    return selectedChildren;
  }

  /**
   * Randomize Children Process (SR.2)
   * Randomizes the order of child activities based on randomization controls
   * @param {Activity} activity - The parent activity whose children need to be randomized
   * @return {Activity[]} - The randomized child activities
   */
  public static randomizeChildrenProcess(activity: Activity): Activity[] {
    const controls = activity.sequencingControls;
    const children = [...activity.children]; // Create a copy to avoid mutating original

    // Check if randomization should occur
    if (controls.randomizationTiming === RandomizationTiming.NEVER) {
      return children;
    }

    // Check if randomization has already been done (for ONCE timing)
    if (
      controls.randomizationTiming === RandomizationTiming.ONCE &&
      controls.reorderChildren
    ) {
      return children;
    }

    // Check if we need to randomize
    if (!controls.randomizeChildren) {
      return children;
    }

    // Perform Fisher-Yates shuffle
    const randomizedChildren = [...children];
    for (let i = randomizedChildren.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tempI = randomizedChildren[i];
      const tempJ = randomizedChildren[j];
      if (tempI && tempJ) {
        randomizedChildren[i] = tempJ;
        randomizedChildren[j] = tempI;
      }
    }

    // Mark randomization as done only if timing is ONCE
    if (controls.randomizationTiming === RandomizationTiming.ONCE) {
      controls.reorderChildren = true;
    }

    // Update the activity's children array with the new order
    activity.children.length = 0;
    activity.children.push(...randomizedChildren);

    return randomizedChildren;
  }

  /**
   * Apply selection and randomization to an activity
   * This combines both SR.1 and SR.2 processes
   * @param {Activity} activity - The parent activity
   * @param {boolean} isNewAttempt - Whether this is a new attempt on the activity
   * @return {Activity[]} - The processed child activities
   */
  public static applySelectionAndRandomization(
    activity: Activity,
    isNewAttempt: boolean = false,
  ): Activity[] {
    const controls = activity.sequencingControls;

    // Check if we should apply selection/randomization
    let shouldApplySelection = false;
    let shouldApplyRandomization = false;

    // For ON_EACH_NEW_ATTEMPT timing, only apply on new attempts
    if (controls.selectionTiming === SelectionTiming.ON_EACH_NEW_ATTEMPT) {
      shouldApplySelection = isNewAttempt;
      if (isNewAttempt) {
        controls.selectionCountStatus = false;
      }
    } else if (controls.selectionTiming === SelectionTiming.ONCE) {
      shouldApplySelection = !controls.selectionCountStatus;
    }

    if (controls.randomizationTiming === RandomizationTiming.ON_EACH_NEW_ATTEMPT) {
      shouldApplyRandomization = isNewAttempt;
      if (isNewAttempt) {
        controls.reorderChildren = false;
      }
    } else if (controls.randomizationTiming === RandomizationTiming.ONCE) {
      shouldApplyRandomization = !controls.reorderChildren;
    }

    // Apply selection first if needed
    if (shouldApplySelection) {
      this.selectChildrenProcess(activity);
    }

    // Then apply randomization if needed
    if (shouldApplyRandomization) {
      this.randomizeChildrenProcess(activity);
    }

    // Get the final processed children
    const processedChildren = activity.children.filter(child => child.isAvailable);
    
    // Store the processed children on the activity
    activity.setProcessedChildren(processedChildren);
    
    return processedChildren;
  }

  /**
   * Check if selection is needed for an activity
   * @param {Activity} activity - The activity to check
   * @return {boolean} - True if selection is needed
   */
  public static isSelectionNeeded(activity: Activity): boolean {
    const controls = activity.sequencingControls;
    
    if (controls.selectionTiming === SelectionTiming.NEVER) {
      return false;
    }

    if (
      controls.selectionTiming === SelectionTiming.ONCE &&
      controls.selectionCountStatus
    ) {
      return false;
    }

    return controls.selectCount !== null && controls.selectCount < activity.children.length;
  }

  /**
   * Check if randomization is needed for an activity
   * @param {Activity} activity - The activity to check
   * @return {boolean} - True if randomization is needed
   */
  public static isRandomizationNeeded(activity: Activity): boolean {
    const controls = activity.sequencingControls;
    
    if (controls.randomizationTiming === RandomizationTiming.NEVER) {
      return false;
    }

    if (
      controls.randomizationTiming === RandomizationTiming.ONCE &&
      controls.reorderChildren
    ) {
      return false;
    }

    return controls.randomizeChildren;
  }
}