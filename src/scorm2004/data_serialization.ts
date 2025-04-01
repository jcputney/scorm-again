/**
 * Data serialization functions for SCORM 2004
 */
import * as Utilities from "../utilities";
import { CompletionStatus, SuccessStatus } from "../constants/enums";
import {
  CommitObject,
  ResultObject,
  ScoreObject,
  Settings,
} from "../types/api_types";
import { scorm2004_regex } from "../constants/regex";
import { StringKeyMap } from "../utilities";

/**
 * Render the cmi object to the proper format for LMS commit
 *
 * @param {boolean} terminateCommit
 * @param {any} cmi - The CMI object
 * @param {Settings} settings - The settings object
 * @param {Function} renderCMIToJSONObject - Function to render CMI to JSON object
 * @return {object|Array}
 */
export function renderCommitCMI(
  terminateCommit: boolean,
  cmi: StringKeyMap,
  settings: Settings,
  renderCMIToJSONObject: () => StringKeyMap,
): StringKeyMap | Array<any> {
  const cmiExport: StringKeyMap = renderCMIToJSONObject();

  if (terminateCommit) {
    cmiExport.cmi.total_time = cmi.getCurrentTotalTime();
  }

  const result = [];
  const flattened: StringKeyMap = Utilities.flatten(cmiExport);
  switch (settings.dataCommitFormat) {
    case "flattened":
      return Utilities.flatten(cmiExport);
    case "params":
      for (const item in flattened) {
        if ({}.hasOwnProperty.call(flattened, item)) {
          result.push(`${item}=${flattened[item]}`);
        }
      }
      return result;
    case "json":
    default:
      return cmiExport;
  }
}

/**
 * Render the cmi object to the proper format for LMS commit
 * @param {boolean} terminateCommit
 * @param {any} cmi - The CMI object
 * @param {Function} renderCommitCMIFn - Function to render CMI for commit
 * @return {CommitObject}
 */
export function renderCommitObject(
  terminateCommit: boolean,
  cmi: any,
  renderCommitCMIFn: (terminateCommit: boolean) => StringKeyMap | Array<any>,
): CommitObject {
  const cmiExport = renderCommitCMIFn(terminateCommit);
  const totalTimeDuration = cmi.getCurrentTotalTime();
  const totalTimeSeconds = Utilities.getDurationAsSeconds(
    totalTimeDuration,
    scorm2004_regex.CMITimespan,
  );

  let completionStatus = CompletionStatus.UNKNOWN;
  let successStatus = SuccessStatus.UNKNOWN;
  if (cmi.completion_status) {
    if (cmi.completion_status === "completed") {
      completionStatus = CompletionStatus.COMPLETED;
    } else if (cmi.completion_status === "incomplete") {
      completionStatus = CompletionStatus.INCOMPLETE;
    }
  }
  if (cmi.success_status) {
    if (cmi.success_status === "passed") {
      successStatus = SuccessStatus.PASSED;
    } else if (cmi.success_status === "failed") {
      successStatus = SuccessStatus.FAILED;
    }
  }

  const score = cmi.score;
  let scoreObject: ScoreObject = null;
  if (score) {
    scoreObject = {};

    if (!Number.isNaN(Number.parseFloat(score.raw))) {
      scoreObject.raw = Number.parseFloat(score.raw);
    }
    if (!Number.isNaN(Number.parseFloat(score.min))) {
      scoreObject.min = Number.parseFloat(score.min);
    }
    if (!Number.isNaN(Number.parseFloat(score.max))) {
      scoreObject.max = Number.parseFloat(score.max);
    }
    if (!Number.isNaN(Number.parseFloat(score.scaled))) {
      scoreObject.scaled = Number.parseFloat(score.scaled);
    }
  }

  const commitObject: CommitObject = {
    completionStatus: completionStatus,
    successStatus: successStatus,
    totalTimeSeconds: totalTimeSeconds,
    runtimeData: cmiExport,
  };
  if (scoreObject) {
    commitObject.score = scoreObject;
  }
  return commitObject;
}

/**
 * Attempts to store the data to the LMS
 *
 * @param {boolean} terminateCommit
 * @param {any} cmi - The CMI object
 * @param {any} adl - The ADL object
 * @param {any} startingData - The starting data
 * @param {Settings} settings - The settings object
 * @param {Function} getCommitObject - Function to get the commit object
 * @param {Function} processHttpRequest - Function to process HTTP request
 * @param {Function} processListeners - Function to process listeners
 * @return {ResultObject}
 */
export async function storeData(
  terminateCommit: boolean,
  cmi: any,
  adl: any,
  startingData: any,
  settings: Settings,
  getCommitObject: (terminateCommit: boolean) => CommitObject,
  processHttpRequest: (
    url: string,
    params: any,
    immediate: boolean,
  ) => Promise<any>,
  processListeners: (
    eventName: string,
    data?: string,
    specificTarget?: string,
  ) => void,
): Promise<ResultObject> {
  if (terminateCommit) {
    if (cmi.mode === "normal") {
      if (cmi.credit === "credit") {
        if (cmi.completion_threshold && cmi.progress_measure) {
          if (cmi.progress_measure >= cmi.completion_threshold) {
            cmi.completion_status = "completed";
          } else {
            cmi.completion_status = "incomplete";
          }
        }
        if (cmi.scaled_passing_score && cmi.score.scaled) {
          if (cmi.score.scaled >= cmi.scaled_passing_score) {
            cmi.success_status = "passed";
          } else {
            cmi.success_status = "failed";
          }
        }
      }
    }
  }

  let navRequest = false;
  if (
    adl.nav.request !== startingData?.adl?.nav?.request &&
    adl.nav.request !== "_none_"
  ) {
    navRequest = true;
  }

  const commitObject = getCommitObject(terminateCommit);
  if (typeof settings.lmsCommitUrl === "string") {
    const result = await processHttpRequest(
      settings.lmsCommitUrl,
      {
        commitObject: commitObject,
      },
      terminateCommit,
    );

    // Check if this is a sequencing call, and then call the necessary JS
    if (
      navRequest &&
      result.navRequest !== undefined &&
      result.navRequest !== ""
    ) {
      Function(`"use strict";(() => { ${result.navRequest} })()`)();
    } else if (result?.navRequest && !navRequest) {
      if (result.navRequest.name) {
        processListeners(result.navRequest.name, result.navRequest.data);
      }
    }

    return result;
  }

  return {
    result: "true",
    errorCode: 0,
  };
}
