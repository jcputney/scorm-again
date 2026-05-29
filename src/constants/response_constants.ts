import { scorm2004_regex } from "./regex";

/**
 * SCORM 2004 `performance` interaction step patterns (RTE 4.2.9.1 / 4.2.9.7).
 *
 * A record is `<step_name>[.]<step_answer>`; either side is optional (but not
 * both). The reserved bracketed tokens `[,]` `[.]` `[:]` are the delimiters, so
 * a `step_answer` characterstring may not contain them - a bare `.` `,` `:` is
 * literal data. Spaces are valid characterstring content (SPM 250).
 */
// step_name: optional short_identifier_type
const PERFORMANCE_STEP_NAME = "^$|" + scorm2004_regex.CMIShortIdentifier;
// step_answer characterstring: 1-250 chars, no reserved bracketed tokens
const PERFORMANCE_CHARACTERSTRING = "(?![\\s\\S]*(?:\\[,\\]|\\[\\.\\]|\\[:\\]))[\\s\\S]{1,250}";
// step_answer numeric range: <min>[:]<max>, with open-ended bounds allowed
const PERFORMANCE_NUMERIC_RANGE = "(?:-?\\d+(?:\\.\\d+)?)?\\[:\\](?:-?\\d+(?:\\.\\d+)?)?";
// correct_responses step_answer: empty | numeric range | characterstring
const CR_PERFORMANCE_STEP_ANSWER =
  "^(?:|" + PERFORMANCE_NUMERIC_RANGE + "|" + PERFORMANCE_CHARACTERSTRING + ")$";
// learner_response step_answer: empty | characterstring (a single real value is
// just a characterstring; learner responses have no numeric *range* per spec)
const LR_PERFORMANCE_STEP_ANSWER = "^(?:|" + PERFORMANCE_CHARACTERSTRING + ")$";

export const LearnerResponses: Responses = {
  "true-false": {
    format: "^true$|^false$",
    max: 1,
    delimiter: "",
    unique: false,
  },
  choice: {
    format: scorm2004_regex.CMILongIdentifier,
    max: 36,
    delimiter: "[,]",
    unique: true,
  },
  "fill-in": {
    format: scorm2004_regex.CMILangString250,
    max: 10,
    delimiter: "[,]",
    unique: false,
  },
  "long-fill-in": {
    format: scorm2004_regex.CMILangString4000,
    max: 1,
    delimiter: "",
    unique: false,
  },
  matching: {
    format: scorm2004_regex.CMIShortIdentifier,
    format2: scorm2004_regex.CMIShortIdentifier,
    max: 36,
    delimiter: "[,]",
    delimiter2: "[.]",
    unique: false,
  },
  performance: {
    format: PERFORMANCE_STEP_NAME,
    format2: LR_PERFORMANCE_STEP_ANSWER,
    max: 250,
    delimiter: "[,]",
    delimiter2: "[.]",
    unique: false,
  },
  sequencing: {
    format: scorm2004_regex.CMIShortIdentifier,
    max: 36,
    delimiter: "[,]",
    unique: false,
  },
  likert: {
    format: scorm2004_regex.CMIShortIdentifier,
    max: 1,
    delimiter: "",
    unique: false,
  },
  numeric: {
    format: scorm2004_regex.CMIDecimal,
    max: 1,
    delimiter: "",
    unique: false,
  },
  other: {
    format: scorm2004_regex.CMIString4000,
    max: 1,
    delimiter: "",
    unique: false,
  },
};
export const CorrectResponses: Responses = {
  "true-false": {
    max: 1,
    delimiter: "",
    unique: false,
    duplicate: false,
    format: "^true$|^false$",
    limit: 1,
  },
  choice: {
    max: 36,
    delimiter: "[,]",
    unique: true,
    duplicate: false,
    format: scorm2004_regex.CMILongIdentifier,
  },
  "fill-in": {
    max: 10,
    delimiter: "[,]",
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMILangString250cr,
  },
  "long-fill-in": {
    max: 1,
    delimiter: "",
    unique: false,
    duplicate: true,
    format: scorm2004_regex.CMILangString4000,
  },
  matching: {
    max: 36,
    delimiter: "[,]",
    delimiter2: "[.]",
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIShortIdentifier,
    format2: scorm2004_regex.CMIShortIdentifier,
  },
  performance: {
    max: 250,
    delimiter: "[,]",
    delimiter2: "[.]",
    unique: false,
    duplicate: false,
    // step_name: optional short_identifier_type
    format: PERFORMANCE_STEP_NAME,
    // step_answer: optional characterstring (spaces allowed) or numeric range
    format2: CR_PERFORMANCE_STEP_ANSWER,
  },
  sequencing: {
    max: 36,
    delimiter: "[,]",
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIShortIdentifier,
  },
  likert: {
    max: 1,
    delimiter: "",
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIShortIdentifier,
    limit: 1,
  },
  numeric: {
    max: 2,
    delimiter: "[:]",
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIDecimal,
    limit: 1,
  },
  other: {
    max: 1,
    delimiter: "",
    unique: false,
    duplicate: false,
    format: scorm2004_regex.CMIString4000,
    limit: 1,
  },
};

export type ResponseType = {
  format: string;
  max: number;
  delimiter: string;
  unique: boolean;
  duplicate?: boolean;
  format2?: string;
  delimiter2?: string;
  limit?: number;
};

export type Responses = {
  [key: string]: ResponseType;
};
