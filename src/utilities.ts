export const SECONDS_PER_SECOND = 1.0;
export const SECONDS_PER_MINUTE = 60;
export const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;
export const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;

type Designation = {
  [key: string]: number;
};

export type StringKeyMap = {
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
export const getSecondsAsHHMMSS = memoize(
  (totalSeconds: number | null): string => {
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
);

/**
 * Calculate the number of seconds from ISO 8601 Duration
 *
 * @param {number} seconds
 * @return {string}
 */
export const getSecondsAsISODuration = memoize(
  (seconds: number | null): string => {
    // SCORM spec does not deal with negative durations, give zero back
    if (!seconds || seconds <= 0) {
      return "PT0S";
    }

    let duration = "P";
    let remainder = seconds;

    // Convert to array of entries and use functional methods
    const designationEntries = Object.entries(designations);

    // Process each time designation
    designationEntries.forEach(([designationsKey, current_seconds]) => {
      let value = Math.floor(remainder / current_seconds);
      remainder = remainder % current_seconds;

      // Limit decimal places
      if (countDecimals(remainder) > 2) {
        remainder = Number(Number(remainder).toFixed(2));
      }

      // If we have anything left in the remainder, and we're currently adding
      // seconds to the duration, go ahead and add the decimal to the seconds
      if (designationsKey === "S" && remainder > 0) {
        value += remainder;
      }

      if (value) {
        // Add the 'T' separator for time components if needed
        const needsTimeSeparator =
          (duration.indexOf("D") > 0 ||
           ["H", "M", "S"].includes(designationsKey)) &&
          duration.indexOf("T") === -1;

        if (needsTimeSeparator) {
          duration += "T";
        }

        duration += `${value}${designationsKey}`;
      }
    });

    return duration;
  }
);

/**
 * Calculate the number of seconds from HH:MM:SS.DDDDDD
 *
 * @param {string} timeString
 * @param {RegExp} timeRegex
 * @return {number}
 */
export const getTimeAsSeconds = memoize(
  (
    timeString: string | number | boolean | null,
    timeRegex: RegExp | string,
  ): number => {
    if (typeof timeString === "number" || typeof timeString === "boolean") {
      timeString = String(timeString);
    }
    if (typeof timeRegex === "string") {
      timeRegex = new RegExp(timeRegex);
    }
    if (!timeString || !timeString?.match?.(timeRegex)) {
      return 0;
    }

    const parts = timeString.split(":");
    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);
    const seconds = Number(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
  },
  // Custom key function to handle RegExp objects which can't be stringified
  (timeString, timeRegex) => {
    const timeStr = typeof timeString === "string"
      ? timeString
      : String(timeString ?? "");
    const regexStr = typeof timeRegex === "string"
      ? timeRegex
      : timeRegex?.toString() ?? "";
    return `${timeStr}:${regexStr}`;
  }
);

/**
 * Calculate the number of seconds from ISO 8601 Duration
 *
 * @param {string} duration
 * @param {RegExp} durationRegex
 * @return {number}
 */
export const getDurationAsSeconds = memoize(
  (
    duration: string | null,
    durationRegex: RegExp | string,
  ): number => {
    if (typeof durationRegex === "string") {
      durationRegex = new RegExp(durationRegex);
    }

    if (!duration || !duration?.match?.(durationRegex)) {
      return 0;
    }

    const [, years, _, , days, hours, minutes, seconds] =
      new RegExp(durationRegex).exec?.(duration) ?? [];
    let result = 0.0;
    result += Number(seconds) || 0.0;
    result += Number(minutes) * 60.0 || 0.0;
    result += Number(hours) * 3600.0 || 0.0;
    result += Number(days) * (60 * 60 * 24.0) || 0.0;
    result += Number(years) * (60 * 60 * 24 * 365.0) || 0.0;
    return result;
  },
  // Custom key function to handle RegExp objects which can't be stringified
  (duration, durationRegex) => {
    const durationStr = duration ?? "";
    const regexStr = typeof durationRegex === "string"
      ? durationRegex
      : durationRegex?.toString() ?? "";
    return `${durationStr}:${regexStr}`;
  }
);

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
export function flatten(data: StringKeyMap): StringKeyMap {
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
      // Use forEach instead of for loop
      cur.forEach((item, i) => {
        recurse(item, `${prop}[${i}]`);
      });

      if (cur.length === 0) result[prop] = [];
    } else {
      const keys = Object.keys(cur).filter(p =>
        Object.prototype.hasOwnProperty.call(cur, p)
      );

      const isEmpty = keys.length === 0;

      // Use forEach instead of for...in loop
      keys.forEach(p => {
        recurse(cur[p], prop ? `${prop}.${p}` : p);
      });

      if (isEmpty && prop) result[prop] = {};
    }
  }

  recurse(data, "");
  return result;
}

/**
 * Un-flatten a flat JSON object
 * @param {StringKeyMap} data
 * @return {object}
 */
export function unflatten(data: StringKeyMap): object {
  "use strict";

  if (Object(data) !== data || Array.isArray(data)) return data;
  const result: StringKeyMap = {};

  // Regex pattern for parsing property paths
  const pattern = /\.?([^.[\]]+)|\[(\d+)]/g;

  // Get all own properties and process them
  Object.keys(data)
    .filter(p => Object.prototype.hasOwnProperty.call(data, p))
    .forEach(p => {
      let cur = result;
      let prop = "";

      // Create a new regex instance for each property to reset lastIndex
      const regex = new RegExp(pattern);

      // Process all matches in the property path
      Array.from(
        { length: p.match(new RegExp(pattern, 'g'))?.length ?? 0 },
        () => regex.exec(p)
      ).forEach(m => {
        if (m) {
          // Create array or object as needed
          cur = cur[prop] ?? (cur[prop] = m[2] ? [] : {});
          prop = m[2] || m[1];
        }
      });

      cur[prop] = data[p];
    });

  return result[""] ?? result;
}

/**
 * Counts the number of decimal places
 * @param {number} num
 * @return {number}
 */
export function countDecimals(num: number): number {
  if (Math.floor(num) === num || String(num)?.indexOf?.(".") < 0) return 0;
  const parts = num.toString().split(".")?.[1];
  return parts?.length ?? 0;
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

  // Use string padding instead of loops
  const paddedFunction = functionName.padEnd(baseLength);
  let messageString = `${paddedFunction}: `;

  if (CMIElement) {
    const CMIElementBaseLength = 70;
    // Add CMIElement and pad to the required length
    messageString += CMIElement;
    messageString = messageString.padEnd(CMIElementBaseLength);
  }

  // Add the message (or empty string if null/undefined)
  messageString += message ?? "";

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

/**
 * Creates a memoized version of a function
 * @param {Function} fn - The function to memoize
 * @param {Function} [keyFn] - Optional function to generate a custom cache key
 * @return {Function} - The memoized function
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  keyFn?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyFn ? keyFn(...args) : JSON.stringify(args);

    return cache.has(key)
      ? cache.get(key) as ReturnType<T>
      : (() => {
          const result = fn(...args);
          cache.set(key, result);
          return result;
        })();
  }) as T;
}
