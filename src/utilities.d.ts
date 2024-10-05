export declare const SECONDS_PER_SECOND = 1;
export declare const SECONDS_PER_MINUTE = 60;
export declare const SECONDS_PER_HOUR: number;
export declare const SECONDS_PER_DAY: number;
type StringKeyMap = {
    [key: string]: any;
};
/**
 * Converts a Number to a String of HH:MM:SS
 *
 * @param {number} totalSeconds
 * @return {string}
 */
export declare function getSecondsAsHHMMSS(totalSeconds: number): string;
/**
 * Calculate the number of seconds from ISO 8601 Duration
 *
 * @param {number} seconds
 * @return {string}
 */
export declare function getSecondsAsISODuration(seconds: number): string;
/**
 * Calculate the number of seconds from HH:MM:SS.DDDDDD
 *
 * @param {string} timeString
 * @param {RegExp} timeRegex
 * @return {number}
 */
export declare function getTimeAsSeconds(timeString: string, timeRegex: RegExp): number;
/**
 * Calculate the number of seconds from ISO 8601 Duration
 *
 * @param {string} duration
 * @param {RegExp} durationRegex
 * @return {number}
 */
export declare function getDurationAsSeconds(duration: string, durationRegex: RegExp): number;
/**
 * Adds together two ISO8601 Duration strings
 *
 * @param {string} first
 * @param {string} second
 * @param {RegExp|string} durationRegex
 * @return {string}
 */
export declare function addTwoDurations(first: string, second: string, durationRegex: RegExp | string): string;
/**
 * Add together two HH:MM:SS.DD strings
 *
 * @param {string} first
 * @param {string} second
 * @param {RegExp} timeRegex
 * @return {string}
 */
export declare function addHHMMSSTimeStrings(first: string, second: string, timeRegex: RegExp): string;
/**
 * Flatten a JSON object down to string paths for each values
 * @param {object} data
 * @return {object}
 */
export declare function flatten(data: StringKeyMap): object;
/**
 * Un-flatten a flat JSON object
 * @param {object} data
 * @return {object}
 */
export declare function unflatten(data: StringKeyMap): object;
/**
 * Counts the number of decimal places
 * @param {number} num
 * @return {number}
 */
export declare function countDecimals(num: number): number;
export {};
