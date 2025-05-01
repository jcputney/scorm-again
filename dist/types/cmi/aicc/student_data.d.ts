import { CMITries } from "./tries";
import { CMIStudentData } from "../scorm12/student_data";
import { CMIAttemptRecords } from "./attempts";
export declare class AICCCMIStudentData extends CMIStudentData {
    constructor();
    tries: CMITries;
    attempt_records: CMIAttemptRecords;
    initialize(): void;
    reset(): void;
    private _tries_during_lesson;
    get tries_during_lesson(): string;
    set tries_during_lesson(tries_during_lesson: string);
    toJSON(): {
        mastery_score: string;
        max_time_allowed: string;
        time_limit_action: string;
        tries: CMITries;
        attempt_records: CMIAttemptRecords;
    };
}
