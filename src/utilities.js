// @flow
export const SECONDS_PER_SECOND = 1.0;
export const SECONDS_PER_MINUTE = 60;
export const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;
export const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;

const designations = [
  ['D', SECONDS_PER_DAY],
  ['H', SECONDS_PER_HOUR],
  ['M', SECONDS_PER_MINUTE],
  ['S', SECONDS_PER_SECOND],
];

/**
 * Converts a Number to a String of HH:MM:SS
 *
 * @param {Number} totalSeconds
 * @return {string}
 */
export function getSecondsAsHHMMSS(totalSeconds: Number) {
  // SCORM spec does not deal with negative durations, give zero back
  if (!totalSeconds || totalSeconds <= 0) {
    return '00:00:00';
  }

  const hours = Math.floor(totalSeconds / SECONDS_PER_HOUR);

  const dateObj = new Date(totalSeconds * 1000);
  const minutes = dateObj.getUTCMinutes();
  // make sure we add any possible decimal value
  const seconds = dateObj.getSeconds() + (totalSeconds % 1.0);

  return hours.toString().padStart(2, '0') + ':' +
      minutes.toString().padStart(2, '0') + ':' +
      seconds.toString().padStart(2, '0');
}

/**
 * Calculate the number of seconds from ISO 8601 Duration
 *
 * @param {Number} seconds
 * @return {String}
 */
export function getSecondsAsISODuration(seconds: Number) {
  // SCORM spec does not deal with negative durations, give zero back
  if (!seconds || seconds <= 0) {
    return 'PT0S';
  }

  let duration = 'P';
  let remainder = seconds;

  designations.forEach(([sign, current_seconds]) => {
    let value = Math.floor(remainder / current_seconds);

    remainder = remainder % current_seconds;
    // If we have anything left in the remainder, and we're currently adding
    // seconds to the duration, go ahead and add the decimal to the seconds
    if (sign === 'S' && remainder > 0) {
      value += remainder;
    }

    if (value) {
      if ((duration.indexOf('D') > 0 ||
          sign === 'H' || sign === 'M' || sign === 'S') &&
          duration.indexOf('T') === -1) {
        duration += 'T';
      }
      duration += `${value}${sign}`;
    }
  });

  return duration;
}

/**
 * Calculate the number of seconds from HH:MM:SS.DDDDDD
 *
 * @param {string} timeString
 * @param {RegExp} timeRegex
 * @return {number}
 */
export function getTimeAsSeconds(timeString: String, timeRegex: RegExp) {
  if (!timeString || typeof timeString !== 'string' ||
      !timeString.match(timeRegex)) {
    return 0;
  }
  const parts = timeString.split(':');
  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);
  const seconds = Number(parts[2]);
  return (hours * 3600) + (minutes * 60) + seconds;
}

/**
 * Calculate the number of seconds from ISO 8601 Duration
 *
 * @param {string} duration
 * @param {RegExp} durationRegex
 * @return {number}
 */
export function getDurationAsSeconds(duration: String, durationRegex: RegExp) {
  if (!duration || !duration.match(durationRegex)) {
    return 0;
  }

  const [, years, months, , days, hours, minutes, seconds] = new RegExp(
      durationRegex).exec(duration) || [];

  const now = new Date();
  const anchor = new Date(now);
  anchor.setFullYear(anchor.getFullYear() + Number(years || 0));
  anchor.setMonth(anchor.getMonth() + Number(months || 0));
  anchor.setDate(anchor.getDate() + Number(days || 0));
  anchor.setHours(anchor.getHours() + Number(hours || 0));
  anchor.setMinutes(anchor.getMinutes() + Number(minutes || 0));
  anchor.setSeconds(anchor.getSeconds() + Number(seconds || 0));
  if (seconds && String(seconds).indexOf('.') > 0) {
    const milliseconds = Number(Number(seconds) % 1).toFixed(6) * 1000.0;
    anchor.setMilliseconds(anchor.getMilliseconds() + milliseconds);
  }

  return ((anchor * 1.0) - now) / 1000.0;
}

/**
 * Adds together two ISO8601 Duration strings
 *
 * @param {string} first
 * @param {string} second
 * @param {RegExp} durationRegex
 * @return {string}
 */
export function addTwoDurations(
    first: String,
    second: String,
    durationRegex: RegExp) {
  const firstSeconds = getDurationAsSeconds(first, durationRegex);
  const secondSeconds = getDurationAsSeconds(second, durationRegex);

  return getSecondsAsISODuration(firstSeconds + secondSeconds);
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
    first: String,
    second: String,
    timeRegex: RegExp) {
  const firstSeconds = getTimeAsSeconds(first, timeRegex);
  const secondSeconds = getTimeAsSeconds(second, timeRegex);
  return getSecondsAsHHMMSS(firstSeconds + secondSeconds);
}
