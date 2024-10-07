type ValueRange = string[];

interface CommonValues {
  valid0To1Range: ValueRange;
  invalid0To1Range: ValueRange;
  valid0To100Range: ValueRange;
  invalid0To100Range: ValueRange;
  validScaledRange: ValueRange;
  invalidScaledRange: ValueRange;
  validIntegerScaledRange: ValueRange;
  invalidIntegerScaledRange: ValueRange;
}

const commonValues: CommonValues = {
  valid0To1Range: ["0.0", "0.25", "0.5", "1.0"],
  invalid0To1Range: ["-1", "-0.1", "1.1", ".25"],
  valid0To100Range: ["1", "50", "100"],
  invalid0To100Range: ["invalid", "a100", "-1"],
  validScaledRange: ["1", "0.5", "0", "-0.5", "-1"],
  invalidScaledRange: ["-101", "25.1", "50.5", "75", "100"],
  validIntegerScaledRange: ["1", "0", "-1"],
  invalidIntegerScaledRange: [
    "-101",
    "-0.5",
    "0.5",
    "25.1",
    "50.5",
    "75",
    "100",
  ],
};

interface Scorm12Values extends CommonValues {
  validResult: ValueRange;
  invalidResult: ValueRange;
  validLessonStatus: ValueRange;
  invalidLessonStatus: ValueRange;
  validExit: ValueRange;
  invalidExit: ValueRange;
  validType: ValueRange;
  invalidType: ValueRange;
  validSpeedRange: ValueRange;
  invalidSpeedRange: ValueRange;
  validScoreRange: (string | number)[];
  invalidScoreRange: ValueRange;
  validTime: ValueRange;
  invalidTime: ValueRange;
  validTimespan: ValueRange;
  invalidTimespan: ValueRange;
}

export const scorm12Values: Scorm12Values = {
  ...commonValues,
  validResult: ["correct", "wrong", "unanticipated", "neutral"],
  invalidResult: ["-10000", "10000", "invalid", "incorrect"],
  validLessonStatus: ["passed", "completed", "failed", "incomplete", "browsed"],
  invalidLessonStatus: ["Passed", "P", "F", "p", "true", "false", "complete"],
  validExit: ["time-out", "suspend", "logout", ""],
  invalidExit: ["close", "exit", "crash"],
  validType: [
    "true-false",
    "choice",
    "fill-in",
    "matching",
    "performance",
    "sequencing",
    "likert",
    "numeric",
  ],
  invalidType: ["correct", "wrong", "logout"],
  validSpeedRange: ["1", "50", "100", "-1", "-50", "-100"],
  invalidSpeedRange: ["invalid", "a100", "-101", "101", "-100000", "100000"],
  validScoreRange: ["1", "50.25", "70", "100", 1, 50.25, 70, 100],
  invalidScoreRange: ["invalid", "a100", "-1", "101", "-100000", "100000"],
  invalid0To100Range: ["invalid", "a100", "-2"],
  validTime: ["10:06:57", "23:59:59", "00:00:00"],
  invalidTime: [
    "47:59:59",
    "00:00:01.56",
    "06:5:13",
    "23:59:59.123",
    "P1DT23H59M59S",
  ],
  validTimespan: ["10:06:57", "00:00:01.56", "23:59:59", "47:59:59"],
  invalidTimespan: ["06:5:13", "23:59:59.123", "P1DT23H59M59S"],
};

interface Scorm2004Values extends CommonValues {
  validResult: ValueRange;
  invalidResult: ValueRange;
  validTimestamps: ValueRange;
  invalidTimestamps: ValueRange;
  validCStatus: ValueRange;
  invalidCStatus: ValueRange;
  validSStatus: ValueRange;
  invalidSStatus: ValueRange;
  validExit: ValueRange;
  invalidExit: ValueRange;
  validType: ValueRange;
  invalidType: ValueRange;
  validScoreRange: ValueRange;
  invalidScoreRange: ValueRange;
  validISO8601Durations: ValueRange;
  invalidISO8601Durations: ValueRange;
  validComment: ValueRange;
  invalidComment: ValueRange;
  validDescription: ValueRange;
  invalidDescription: ValueRange;
  validNavRequest: ValueRange;
  invalidNavRequest: ValueRange;
}

export const scorm2004Values: Scorm2004Values = {
  ...commonValues,
  validResult: ["correct", "incorrect", "unanticipated", "neutral"],
  invalidResult: ["-10000", "10000", "invalid", "wrong"],
  validTimestamps: [
    "2019-06-25",
    "2019-06-25T23:59",
    "2019-06-25T23:59:59.99",
    "1970-01-01",
  ],
  invalidTimestamps: [
    "2019-06-25T",
    "2019-06-25T23:59:59.999",
    "2019-06-25T25:59:59.99",
    "2019-13-31",
    "1969-12-31",
    "-00:00:30",
    "0:50:30",
    "23:00:30.",
  ],
  validCStatus: ["completed", "incomplete", "not attempted", "unknown"],
  invalidCStatus: ["complete", "passed", "failed"],
  validSStatus: ["passed", "failed", "unknown"],
  invalidSStatus: ["complete", "incomplete", "P", "f"],
  validExit: ["time-out", "suspend", "logout", "normal", ""],
  invalidExit: ["close", "exit", "crash"],
  validType: [
    "true-false",
    "choice",
    "fill-in",
    "long-fill-in",
    "matching",
    "performance",
    "sequencing",
    "likert",
    "numeric",
    "other",
  ],
  invalidType: ["correct", "wrong", "logout"],
  validScoreRange: ["1", "50", "100", "-10000", "-1", "10000"],
  invalidScoreRange: ["invalid", "a100", "-100000", "100000"],
  validISO8601Durations: ["P1Y34DT23H45M15S", "PT1M45S", "P0S", "PT75M"],
  invalidISO8601Durations: ["00:08:45", "-P1H", "1y45D", "0"],
  validComment: [
    "{lang=en-98} learner comment",
    "{lang=eng-98-9} learner comment",
    "{lang=eng-98-9fhgj}" + "x".repeat(4000),
    "learner comment",
    "learner comment}",
    "{lang=i-xx}",
    "{lang=i}",
    "",
  ],
  invalidComment: [
    "{lang=i-}",
    "{lang=i-x}",
    "{lang=eng-98-9fhgj}{ learner comment",
    "{learner comment",
    "{lang=eng-98-9fhgj}" + "x".repeat(4001),
    "{lang=eng-98-9fhgj}{" + "x".repeat(3999),
  ],
  validDescription: [
    "{lang=en-98} learner comment",
    "{lang=eng-98-9} learner comment",
    "{lang=eng-98-9fhgj}" + "x".repeat(250),
    "learner comment",
    "learner comment}",
    "{lang=i-xx}",
    "{lang=i}",
    "",
  ],
  invalidDescription: [
    "{lang=i-}",
    "{lang=i-x}",
    "{lang=eng-98-9fhgj}{ learner comment",
    "{learner comment",
    "{lang=eng-98-9fhgj}" + "x".repeat(251),
    "{lang=eng-98-9fhgj}{" + "x".repeat(249),
  ],
  validNavRequest: [
    "previous",
    "continue",
    "exit",
    "exitAll",
    "abandon",
    "abandonAll",
    "suspendAll",
  ],
  invalidNavRequest: ["close", "quit", "next", "before"],
};
