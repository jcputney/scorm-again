export declare const SECONDS_PER_SECOND = 1;
export declare const SECONDS_PER_MINUTE = 60;
export declare const SECONDS_PER_HOUR: number;
export declare const SECONDS_PER_DAY: number;
type StringKeyMap = {
    [key: string]: any;
};
export declare function getSecondsAsHHMMSS(totalSeconds: number | null): string;
export declare function getSecondsAsISODuration(seconds: number | null): string;
export declare function getTimeAsSeconds(timeString: string | number | boolean | null, timeRegex: RegExp | string): number;
export declare function getDurationAsSeconds(duration: string | null, durationRegex: RegExp | string): number;
export declare function addTwoDurations(first: string, second: string, durationRegex: RegExp | string): string;
export declare function addHHMMSSTimeStrings(first: string, second: string, timeRegex: RegExp | string): string;
export declare function flatten(data: StringKeyMap): object;
export declare function unflatten(data: StringKeyMap): object;
export declare function countDecimals(num: number): number;
export declare function formatMessage(functionName: string, message: string, CMIElement?: string): string;
export declare function stringMatches(str: string, tester: string): boolean;
export {};
