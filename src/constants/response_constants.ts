import { scorm2004_regex } from "./regex";

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
    format: "^$|" + scorm2004_regex.CMIShortIdentifier,
    format2:
      scorm2004_regex.CMIDecimal + "|^$|" + scorm2004_regex.CMIShortIdentifier,
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
    delimiter3: "[:]",
    unique: false,
    duplicate: false,
    format: "^$|" + scorm2004_regex.CMIShortIdentifier,
    format2:
      scorm2004_regex.CMIDecimal + "|^$|" + scorm2004_regex.CMIShortIdentifier,
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
  delimiter3?: string;
};

export type Responses = {
  [key: string]: ResponseType;
};
