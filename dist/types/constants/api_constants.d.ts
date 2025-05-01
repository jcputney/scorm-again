interface ErrorDescription {
    basicMessage: string;
    detailMessage: string;
}
interface ErrorDescriptions {
    [key: string]: ErrorDescription;
}
interface ScormConstants {
    cmi_children: string;
    core_children: string;
    score_children: string;
    comments_children: string;
    objectives_children: string;
    correct_responses_children: string;
    student_data_children: string;
    student_preference_children: string;
    interactions_children: string;
    error_descriptions: ErrorDescriptions;
}
interface AiccConstants extends ScormConstants {
    student_demographics_children: string;
    tries_children: string;
    attempt_records_children: string;
    paths_children: string;
}
interface Scorm2004Constants {
    cmi_children: string;
    comments_children: string;
    score_children: string;
    objectives_children: string;
    correct_responses_children: string;
    student_data_children: string;
    student_preference_children: string;
    interactions_children: string;
    adl_data_children: string;
    error_descriptions: ErrorDescriptions;
}
interface GlobalConstants {
    SCORM_TRUE: string;
    SCORM_FALSE: string;
    STATE_NOT_INITIALIZED: number;
    STATE_INITIALIZED: number;
    STATE_TERMINATED: number;
}
export declare const global_constants: GlobalConstants;
export declare const scorm12_constants: ScormConstants;
export declare const aicc_constants: AiccConstants;
export declare const scorm2004_constants: Scorm2004Constants;
export {};
