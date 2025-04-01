/**
 * Constants for time conversion calculations.
 * These are used throughout the codebase for converting between different time formats.
 */
export const SECONDS_PER_SECOND = 1.0;
export const SECONDS_PER_MINUTE = 60;
export const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;
export const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;

type Designation = {
  [key: string]: number;
};

/**
 * A record with string keys and unknown values.
 * This is a more type-safe alternative to using `any`.
 */
export type StringKeyMap = Record<string, unknown>;

const designations: Designation = {
  D: SECONDS_PER_DAY,
  H: SECONDS_PER_HOUR,
  M: SECONDS_PER_MINUTE,
  S: SECONDS_PER_SECOND,
};

/**
 * Converts a number of seconds to a formatted time string in HH:MM:SS format.
 * This function handles decimal seconds and ensures proper formatting with leading zeros.
 *
 * @param {number|null} totalSeconds - The total number of seconds to convert. If null or negative, returns "00:00:00".
 * @return {string} A formatted time string in HH:MM:SS format, with up to 2 decimal places for seconds if applicable.
 *
 * @example
 * // Returns "01:30:45"
 * getSecondsAsHHMMSS(5445);
 *
 * @example
 * // Returns "00:00:30.5"
 * getSecondsAsHHMMSS(30.5);
 *
 * @example
 * // Returns "00:00:00"
 * getSecondsAsHHMMSS(null);
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
 * Converts a number of seconds to an ISO 8601 duration string (e.g., "PT1H30M45S").
 * This function handles the complexity of formatting according to the ISO 8601 standard,
 * including the proper placement of the "T" separator for time components.
 *
 * @param {number|null} seconds - The number of seconds to convert. If null or negative, returns "PT0S".
 * @return {string} An ISO 8601 formatted duration string.
 *
 * @example
 * // Returns "PT1H30M45S" (1 hour, 30 minutes, 45 seconds)
 * getSecondsAsISODuration(5445);
 *
 * @example
 * // Returns "PT30.5S" (30.5 seconds)
 * getSecondsAsISODuration(30.5);
 *
 * @example
 * // Returns "P1DT1H" (1 day, 1 hour)
 * getSecondsAsISODuration(90000);
 *
 * @example
 * // Returns "PT0S" (0 seconds)
 * getSecondsAsISODuration(null);
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
 * Converts a time string in HH:MM:SS format to the equivalent number of seconds.
 * This function is flexible and can handle various input types, converting them to strings as needed.
 *
 * @param {string|number|boolean|null} timeString - The time string to convert, typically in HH:MM:SS format.
 *                                                 If not a string, it will be converted to one.
 *                                                 If null, invalid, or doesn't match the regex, returns 0.
 * @param {RegExp|string} timeRegex - The regular expression used to validate the time string format.
 *                                    If a string is provided, it will be converted to a RegExp.
 * @return {number} The total number of seconds represented by the time string.
 *
 * @example
 * // Returns 5445 (1 hour, 30 minutes, 45 seconds)
 * getTimeAsSeconds("01:30:45", /^(\d+):(\d+):(\d+)$/);
 *
 * @example
 * // Returns 0 (invalid format)
 * getTimeAsSeconds("invalid", /^(\d+):(\d+):(\d+)$/);
 *
 * @example
 * // Returns 30 (converts number to string "30" then parses as 0:0:30)
 * getTimeAsSeconds(30, /^(\d+):(\d+):(\d+)$/);
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
 * Converts an ISO 8601 duration string (e.g., "PT1H30M45S") to the equivalent number of seconds.
 * This function parses the duration string using a regular expression to extract years, days,
 * hours, minutes, and seconds components.
 *
 * @param {string|null} duration - The ISO 8601 duration string to convert.
 *                                If null, invalid, or doesn't match the regex, returns 0.
 * @param {RegExp|string} durationRegex - The regular expression used to parse the duration components.
 *                                       If a string is provided, it will be converted to a RegExp.
 *                                       The regex should have capture groups for years, days, hours, minutes, and seconds.
 * @return {number} The total number of seconds represented by the duration string.
 *
 * @example
 * // Returns 5445 (1 hour, 30 minutes, 45 seconds)
 * getDurationAsSeconds("PT1H30M45S", /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/);
 *
 * @example
 * // Returns 90000 (1 day, 1 hour)
 * getDurationAsSeconds("P1DT1H", /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/);
 *
 * @example
 * // Returns 0 (invalid format)
 * getDurationAsSeconds("invalid", /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/);
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
 * Adds together two ISO 8601 duration strings and returns the result as a new ISO 8601 duration string.
 * This function works by converting both durations to seconds, adding them together, and then
 * converting the result back to an ISO 8601 duration string.
 *
 * @param {string} first - The first ISO 8601 duration string.
 * @param {string} second - The second ISO 8601 duration string.
 * @param {RegExp|string} durationRegex - The regular expression used to parse the duration components.
 *                                       If a string is provided, it will be converted to a RegExp.
 * @return {string} A new ISO 8601 duration string representing the sum of the two input durations.
 *
 * @example
 * // Returns "PT2H" (1 hour + 1 hour = 2 hours)
 * addTwoDurations("PT1H", "PT1H", /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/);
 *
 * @example
 * // Returns "PT1H30M" (1 hour + 30 minutes = 1 hour and 30 minutes)
 * addTwoDurations("PT1H", "PT30M", /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/);
 *
 * @example
 * // Returns "P1DT1H30M" (1 day + 1 hour and 30 minutes = 1 day, 1 hour, and 30 minutes)
 * addTwoDurations("P1D", "PT1H30M", /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/);
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
 * Adds together two time strings in HH:MM:SS format and returns the result as a new time string.
 * This function works by converting both time strings to seconds, adding them together, and then
 * converting the result back to an HH:MM:SS format.
 *
 * @param {string} first - The first time string in HH:MM:SS format.
 * @param {string} second - The second time string in HH:MM:SS format.
 * @param {RegExp|string} timeRegex - The regular expression used to validate and parse the time strings.
 *                                   If a string is provided, it will be converted to a RegExp.
 * @return {string} A new time string in HH:MM:SS format representing the sum of the two input times.
 *
 * @example
 * // Returns "02:00:00" (1 hour + 1 hour = 2 hours)
 * addHHMMSSTimeStrings("01:00:00", "01:00:00", /^(\d+):(\d+):(\d+)$/);
 *
 * @example
 * // Returns "01:30:00" (1 hour + 30 minutes = 1 hour and 30 minutes)
 * addHHMMSSTimeStrings("01:00:00", "00:30:00", /^(\d+):(\d+):(\d+)$/);
 *
 * @example
 * // Returns "01:30:45" (1 hour + 30 minutes and 45 seconds = 1 hour, 30 minutes, and 45 seconds)
 * addHHMMSSTimeStrings("01:00:00", "00:30:45", /^(\d+):(\d+):(\d+)$/);
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
 * Flattens a nested JSON object into a flat object with dot notation for nested properties.
 * This function recursively traverses the object and creates new keys using dot notation
 * for nested objects and bracket notation for arrays.
 *
 * @param {StringKeyMap} data - The nested object to flatten.
 * @return {StringKeyMap} A flattened object where nested properties are represented with dot notation.
 *
 * @example
 * // Returns { "a": 1, "b.c": 2, "b.d": 3, "e[0]": 4, "e[1]": 5 }
 * flatten({
 *   a: 1,
 *   b: { c: 2, d: 3 },
 *   e: [4, 5]
 * });
 *
 * @example
 * // Returns { "": [] } for an empty array
 * flatten([]);
 *
 * @example
 * // Returns { "": {} } for an empty object
 * flatten({});
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
 * Converts a flattened object back into a nested object structure.
 * This function is the inverse of `flatten()`. It parses dot notation and bracket notation
 * in property names to recreate the original nested structure.
 *
 * @param {StringKeyMap} data - The flattened object to unflatten.
 * @return {object} A nested object recreated from the flattened structure.
 *
 * @example
 * // Returns { a: 1, b: { c: 2, d: 3 }, e: [4, 5] }
 * unflatten({
 *   "a": 1,
 *   "b.c": 2,
 *   "b.d": 3,
 *   "e[0]": 4,
 *   "e[1]": 5
 * });
 *
 * @example
 * // Handles array indices correctly
 * unflatten({
 *   "users[0].name": "John",
 *   "users[0].email": "john@example.com",
 *   "users[1].name": "Jane",
 *   "users[1].email": "jane@example.com"
 * });
 * // Returns:
 * // {
 * //   users: [
 * //     { name: "John", email: "john@example.com" },
 * //     { name: "Jane", email: "jane@example.com" }
 * //   ]
 * // }
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
 * Counts the number of decimal places in a number.
 * This function handles both integer and floating-point numbers.
 *
 * @param {number} num - The number to analyze.
 * @return {number} The number of decimal places. Returns 0 for integers or if the number doesn't have a decimal point.
 *
 * @example
 * // Returns 0
 * countDecimals(42);
 *
 * @example
 * // Returns 2
 * countDecimals(3.14);
 *
 * @example
 * // Returns 5
 * countDecimals(1.23456);
 */
export function countDecimals(num: number): number {
  if (Math.floor(num) === num || String(num)?.indexOf?.(".") < 0) return 0;
  const parts = num.toString().split(".")?.[1];
  return parts?.length ?? 0;
}

/**
 * Formats SCORM messages for consistent and readable logging.
 * This function pads the function name and CMI element to create aligned log messages
 * that are easier to read in log files or console output.
 *
 * @param {string} functionName - The name of the function that generated the message.
 * @param {string} message - The message content to be logged.
 * @param {string} [CMIElement] - Optional. The CMI element related to the message.
 * @return {string} A formatted message string with consistent padding.
 *
 * @example
 * // Returns "initialize          : Successfully initialized"
 * formatMessage("initialize", "Successfully initialized");
 *
 * @example
 * // Returns "getValue            : cmi.core.student_id                                             : 12345"
 * formatMessage("getValue", "12345", "cmi.core.student_id");
 *
 * @example
 * // Returns "setValue            : cmi.core.lesson_status                                          : completed"
 * formatMessage("setValue", "completed", "cmi.core.lesson_status");
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
 * Checks if a string contains a specific pattern using regular expression matching.
 * This function is a wrapper around JavaScript's String.match() method that handles
 * null/undefined values gracefully.
 *
 * @param {string} str - The string to search within. If null or undefined, returns false.
 * @param {string} tester - The pattern to search for. Can be a regular expression pattern.
 * @return {boolean} True if the pattern is found in the string, false otherwise.
 *
 * @example
 * // Returns true
 * stringMatches("Hello, world!", "world");
 *
 * @example
 * // Returns true
 * stringMatches("The quick brown fox", "\\w+\\s+\\w+");
 *
 * @example
 * // Returns false
 * stringMatches("Hello, world!", "universe");
 *
 * @example
 * // Returns false (handles null gracefully)
 * stringMatches(null, "test");
 */
export function stringMatches(str: string, tester: string): boolean {
  return str?.match(tester) !== null;
}

/**
 * Creates a memoized (cached) version of a function for performance optimization.
 * This function caches the results of previous calls with the same arguments,
 * avoiding redundant calculations for repeated calls with the same input.
 *
 * @template T - The type of the function to memoize
 * @param {T} fn - The function to memoize
 * @param {Function} [keyFn] - Optional function to generate a custom cache key.
 *                           Useful for functions with complex arguments that can't be serialized.
 * @return {T} A memoized version of the input function with the same signature
 *
 * @example
 * // Basic usage with a simple function
 * const memoizedAdd = memoize((a, b) => {
 *   console.log('Calculating...');
 *   return a + b;
 * });
 *
 * memoizedAdd(1, 2); // Logs "Calculating..." and returns 3
 * memoizedAdd(1, 2); // Returns 3 without logging (uses cached result)
 *
 * @example
 * // Using a custom key function for objects that can't be serialized
 * const memoizedProcessUser = memoize(
 *   (user) => {
 *     console.log('Processing user...');
 *     return { ...user, processed: true };
 *   },
 *   (user) => user.id // Use user.id as the cache key
 * );
 *
 * memoizedProcessUser({ id: 123, name: 'John' }); // Logs and processes
 * memoizedProcessUser({ id: 123, name: 'John' }); // Uses cached result
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
