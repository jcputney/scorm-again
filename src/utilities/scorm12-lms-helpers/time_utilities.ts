/**
 * SCORM 1.2 Time Format Utilities
 *
 * SCORM 1.2 uses the format HHHH:MM:SS.SS (hours can exceed 99)
 * These utilities help parse, add, and format SCORM time values.
 */

/**
 * Parse a SCORM 1.2 time string to total seconds
 *
 * @param timeString Time in format HHHH:MM:SS.SS or HH:MM:SS.SS
 * @returns Total seconds (with decimal)
 *
 * @example
 * parseScormTime("0001:30:45.50") // Returns 5445.5
 */
export function parseScormTime(timeString: string): number {
  if (!timeString || timeString === "") {
    return 0;
  }

  // Handle various formats: HHHH:MM:SS.SS, HH:MM:SS, etc.
  const parts = timeString.split(":");

  if (parts.length < 2) {
    return 0;
  }

  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (parts.length === 3) {
    hours = parseInt(parts[0] ?? "", 10) || 0;
    minutes = parseInt(parts[1] ?? "", 10) || 0;
    seconds = parseFloat(parts[2] ?? "") || 0;
  } else if (parts.length === 2) {
    minutes = parseInt(parts[0] ?? "", 10) || 0;
    seconds = parseFloat(parts[1] ?? "") || 0;
  }

  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Format seconds to SCORM 1.2 time string
 *
 * @param totalSeconds Total seconds to format
 * @returns Time string in format HHHH:MM:SS.SS
 *
 * @example
 * formatScormTime(5445.5) // Returns "0001:30:45.50"
 */
export function formatScormTime(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds < 0) {
    return "0000:00:00.00";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hoursStr = hours.toString().padStart(4, "0");
  const minutesStr = minutes.toString().padStart(2, "0");
  const secondsStr = seconds.toFixed(2).padStart(5, "0");

  return `${hoursStr}:${minutesStr}:${secondsStr}`;
}

/**
 * Add two SCORM 1.2 time strings together
 *
 * @param time1 First time string
 * @param time2 Second time string
 * @returns Sum as SCORM time string
 *
 * @example
 * addScormTime("0001:00:00.00", "0000:30:00.00") // Returns "0001:30:00.00"
 */
export function addScormTime(time1: string, time2: string): string {
  const seconds1 = parseScormTime(time1);
  const seconds2 = parseScormTime(time2);
  return formatScormTime(seconds1 + seconds2);
}

/**
 * Compare two SCORM time strings
 *
 * @param time1 First time string
 * @param time2 Second time string
 * @returns Negative if time1 < time2, 0 if equal, positive if time1 > time2
 */
export function compareScormTime(time1: string, time2: string): number {
  return parseScormTime(time1) - parseScormTime(time2);
}

/**
 * Check if a time has exceeded a limit
 *
 * @param currentTime Current accumulated time
 * @param maxTime Maximum allowed time
 * @returns true if currentTime >= maxTime
 */
export function hasExceededTimeLimit(
  currentTime: string,
  maxTime: string,
): boolean {
  return compareScormTime(currentTime, maxTime) >= 0;
}

/**
 * Format seconds to a human-readable string
 *
 * @param totalSeconds Total seconds
 * @returns Human-readable string like "2h 15m 30s"
 */
export function formatHumanReadable(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds < 0) {
    return "0s";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(" ");
}

/**
 * Convert SCORM time string to human-readable format
 *
 * @param timeString SCORM time string
 * @returns Human-readable string
 */
export function scormTimeToHumanReadable(timeString: string): string {
  return formatHumanReadable(parseScormTime(timeString));
}
