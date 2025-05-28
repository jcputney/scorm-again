export const SECONDS_PER_SECOND = 1.0;
export const SECONDS_PER_MINUTE = 60;
export const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;
export const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;

type Designation = {
  [key: string]: number;
};

type StringKeyMap = {
  [key: string]: any;
};

const designations: Designation = {
  D: SECONDS_PER_DAY,
  H: SECONDS_PER_HOUR,
  M: SECONDS_PER_MINUTE,
  S: SECONDS_PER_SECOND,
};

/**
 * Converts a Number to a String of HH:MM:SS
 *
 * @param {number} totalSeconds
 * @return {string}
 */
export function getSecondsAsHHMMSS(totalSeconds: number | null): string {
  // SCORM spec does not deal with negative durations, give zero back
  if (!totalSeconds || totalSeconds <= 0) {
    return "00:00:00";
  }

  const hours = Math.floor(totalSeconds / SECONDS_PER_HOUR);
  const dateObj = new Date(totalSeconds * 1000);
  const minutes = dateObj.getUTCMinutes();
  // make sure we add any possible decimal value
  const seconds = dateObj.getSeconds();
  const ms = totalSeconds % 1.0;
  let msStr = "";

  if (countDecimals(ms) > 0) {
    if (countDecimals(ms) > 2) {
      msStr = ms.toFixed(2);
    } else {
      msStr = String(ms);
    }

    msStr = "." + msStr.split(".")[1];
  }

  return (
    (hours + ":" + minutes + ":" + seconds).replace(/\b\d\b/g, "0$&") + msStr
  );
}

/**
 * Calculate the number of seconds from ISO 8601 Duration
 *
 * @param {number} seconds
 * @return {string}
 */
export function getSecondsAsISODuration(seconds: number | null): string {
  // SCORM spec does not deal with negative durations, give zero back
  if (!seconds || seconds <= 0) {
    return "PT0S";
  }

  let duration = "P";
  let remainder = seconds;
  for (const designationsKey in designations) {
    const current_seconds = designations[designationsKey] || 1;
    let value = Math.floor(remainder / current_seconds);
    remainder = remainder % current_seconds;

    if (countDecimals(remainder) > 2) {
      remainder = Number(Number(remainder).toFixed(2));
    }

    // If we have anything left in the remainder, and we're currently adding
    // seconds to the duration, go ahead and add the decimal to the seconds
    if (designationsKey === "S" && remainder > 0) {
      value += remainder;
    }

    if (value) {
      if (
        (duration.indexOf("D") > 0 ||
          designationsKey === "H" ||
          designationsKey === "M" ||
          designationsKey === "S") &&
        duration.indexOf("T") === -1
      ) {
        duration += "T";
      }

      duration += `${value}${designationsKey}`;
    }
  }
  return duration;
}

/**
 * Calculate the number of seconds from HH:MM:SS.DDDDDD
 *
 * @param {string} timeString
 * @param {RegExp} timeRegex
 * @return {number}
 */
export function getTimeAsSeconds(
  timeString: string | number | boolean | null,
  timeRegex: RegExp | string,
): number {
  if (typeof timeString === "number" || typeof timeString === "boolean") {
    timeString = String(timeString);
  }
  if (typeof timeRegex === "string") {
    timeRegex = new RegExp(timeRegex);
  }
  if (!timeString || !timeString.match(timeRegex)) {
    return 0;
  }

  const parts = timeString.split(":");
  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);
  const seconds = Number(parts[2]);
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Calculate the number of seconds from ISO 8601 Duration
 *
 * @param {string} duration
 * @param {RegExp} durationRegex
 * @return {number}
 */
export function getDurationAsSeconds(
  duration: string | null,
  durationRegex: RegExp | string,
): number {
  if (typeof durationRegex === "string") {
    durationRegex = new RegExp(durationRegex);
  }

  if (!duration || !duration.match(durationRegex)) {
    return 0;
  }

  const [, years, _, , days, hours, minutes, seconds] =
    new RegExp(durationRegex).exec(duration) || [];
  let result = 0.0;
  result += Number(seconds) || 0.0;
  result += Number(minutes) * 60.0 || 0.0;
  result += Number(hours) * 3600.0 || 0.0;
  result += Number(days) * (60 * 60 * 24.0) || 0.0;
  result += Number(years) * (60 * 60 * 24 * 365.0) || 0.0;
  return result;
}

/**
 * Adds together two ISO8601 Duration strings
 *
 * @param {string} first
 * @param {string} second
 * @param {RegExp|string} durationRegex
 * @return {string}
 */
export function addTwoDurations(
  first: string,
  second: string,
  durationRegex: RegExp | string,
): string {
  const regex: RegExp =
    typeof durationRegex === "string"
      ? new RegExp(durationRegex)
      : durationRegex;
  return getSecondsAsISODuration(
    getDurationAsSeconds(first, regex) + getDurationAsSeconds(second, regex),
  );
}

/**
 * Add together two HH:MM:SS.DD strings
 *
 * @param {string} first
 * @param {string} second
 * @param {RegExp} timeRegex
 * @return {string}
 */
export function addHHMMSSTimeStrings(
  first: string,
  second: string,
  timeRegex: RegExp | string,
): string {
  if (typeof timeRegex === "string") {
    timeRegex = new RegExp(timeRegex);
  }
  return getSecondsAsHHMMSS(
    getTimeAsSeconds(first, timeRegex) + getTimeAsSeconds(second, timeRegex),
  );
}

/**
 * Flatten a JSON object down to string paths for each values
 * @param {object} data
 * @return {object}
 */
export function flatten(data: StringKeyMap): object {
  const result: StringKeyMap = {};

  /**
   * Recurse through the object
   * @param {*} cur
   * @param {*} prop
   */
  function recurse(cur: any, prop: any) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      for (let i = 0, l = cur.length; i < l; i++) {
        recurse(cur[i], prop + "[" + i + "]");
        if (l === 0) result[prop] = [];
      }
    } else {
      let isEmpty = true;

      for (const p in cur) {
        if ({}.hasOwnProperty.call(cur, p)) {
          isEmpty = false;
          recurse(cur[p], prop ? prop + "." + p : p);
        }
      }

      if (isEmpty && prop) result[prop] = {};
    }
  }

  recurse(data, "");
  return result;
}

/**
 * Un-flatten a flat JSON object
 * @param {object} data
 * @return {object}
 */
export function unflatten(data: StringKeyMap): object {
  "use strict";

  if (Object(data) !== data || Array.isArray(data)) return data;
  const regex = /\.?([^.[\]]+)|\[(\d+)]/g;
  const result: StringKeyMap = {};

  for (const p in data) {
    if ({}.hasOwnProperty.call(data, p)) {
      let cur = result;
      let prop = "";
      let m = regex.exec(p);

      while (m) {
        cur = cur[prop] || (cur[prop] = m[2] ? [] : {});
        prop = m[2] || m[1] || "";
        m = regex.exec(p);
      }

      cur[prop] = data[p];
    }
  }

  return result[""] || result;
}

/**
 * Counts the number of decimal places
 * @param {number} num
 * @return {number}
 */
export function countDecimals(num: number): number {
  if (Math.floor(num) === num || String(num).indexOf(".") < 0) return 0;
  const parts = num.toString().split(".")[1];
  return parts?.length || 0;
}

/**
 * Formats the SCORM messages for easy reading
 *
 * @param {string} functionName
 * @param {string} message
 * @param {string} CMIElement
 * @return {string}
 */
export function formatMessage(
  functionName: string,
  message: string,
  CMIElement?: string,
): string {
  const baseLength = 20;
  let messageString = "";

  messageString += functionName;

  let fillChars = baseLength - messageString.length;

  for (let i = 0; i < fillChars; i++) {
    messageString += " ";
  }

  messageString += ": ";

  if (CMIElement) {
    const CMIElementBaseLength = 70;

    messageString += CMIElement;

    fillChars = CMIElementBaseLength - messageString.length;

    for (let j = 0; j < fillChars; j++) {
      messageString += " ";
    }
  }

  if (message) {
    messageString += message;
  }

  return messageString;
}

/**
 * Checks to see if {str} contains {tester}
 *
 * @param {string} str String to check against
 * @param {string} tester String to check for
 * @return {boolean}
 */
export function stringMatches(str: string, tester: string): boolean {
  return str?.match(tester) !== null;
}
