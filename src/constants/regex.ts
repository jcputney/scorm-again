export const scorm12_regex = {
  CMIString256: "^.{0,255}$",
  CMIString4096: "^.{0,4096}$",
  CMITime: "^(?:[01]\\d|2[0123]):(?:[012345]\\d):(?:[012345]\\d)$",
  CMITimespan: "^([0-9]{2,}):([0-9]{2}):([0-9]{2})(.[0-9]{1,2})?$",

  CMIInteger: "^\\d+$",
  CMISInteger: "^-?([0-9]+)$",
  CMIDecimal: "^-?([0-9]{0,3})(.[0-9]*)?$",

  CMIIdentifier: "^[\\u0021-\\u007E\\s]{0,255}$",
  // Allow storing larger responses for interactions
  // Some content packages may exceed the 255 character limit
  // defined in the SCORM 1.2 specification.  The previous
  // expression truncated these values which resulted in
  // a "101: General Exception" being thrown when long
  // answers were supplied.  To support these packages we
  // relax the limitation and accept any length string.
  CMIFeedback: "^.*$",
  // This must be redefined
  CMIIndex: "[._](\\d+).",
  // Vocabulary Data Type Definition
  CMIStatus: "^(passed|completed|failed|incomplete|browsed)$",
  CMIStatus2: "^(passed|completed|failed|incomplete|browsed|not attempted)$",
  CMIExit: "^(time-out|suspend|logout|)$",
  CMIType:
    "^(true-false|choice|fill-in|matching|performance|sequencing|likert|numeric)$",
  CMIResult:
    "^(correct|wrong|unanticipated|neutral|([0-9]{0,3})?(\\.[0-9]*)?)$",
  NAVEvent: "^(previous|continue)$",
  // Data ranges
  score_range: "0#100",
  audio_range: "-1#100",
  speed_range: "-100#100",
  weighting_range: "-100#100",
  text_range: "-1#1",
};
export const aicc_regex = {
  ...scorm12_regex,
  ...{
    CMIIdentifier: "^\\w{1,255}$",
  },
};
export const scorm2004_regex = {
  CMIString200: "^[\\u0000-\\uFFFF]{0,200}$",
  CMIString250: "^[\\u0000-\\uFFFF]{0,250}$",
  CMIString1000: "^[\\u0000-\\uFFFF]{0,1000}$",
  CMIString4000: "^[\\u0000-\\uFFFF]{0,4000}$",
  CMIString64000: "^[\\u0000-\\uFFFF]{0,64000}$",
  CMILang: "^([a-zA-Z]{2,3}|i|x)(-[a-zA-Z0-9-]{2,8})?$|^$",

  CMILangString250:
    "^({lang=([a-zA-Z]{2,3}|i|x)(-[a-zA-Z0-9-]{2,8})?})?((?!{.*$).{0,250}$)?$",

  CMILangcr: "^(({lang=([a-zA-Z]{2,3}|i|x)?(-[a-zA-Z0-9-]{2,8})?}))(.*?)$",

  CMILangString250cr:
    "^(({lang=([a-zA-Z]{2,3}|i|x)?(-[a-zA-Z0-9-]{2,8})?})?(.{0,250})?)?$",

  CMILangString4000:
    "^({lang=([a-zA-Z]{2,3}|i|x)(-[a-zA-Z0-9-]{2,8})?})?((?!{.*$).{0,4000}$)?$",

  CMITime:
    "^(19[7-9]{1}[0-9]{1}|20[0-2]{1}[0-9]{1}|203[0-8]{1})((-(0[1-9]{1}|1[0-2]{1}))((-(0[1-9]{1}|[1-2]{1}[0-9]{1}|3[0-1]{1}))(T([0-1]{1}[0-9]{1}|2[0-3]{1})((:[0-5]{1}[0-9]{1})((:[0-5]{1}[0-9]{1})((\\.[0-9]{1,2})((Z|([+|-]([0-1]{1}[0-9]{1}|2[0-3]{1})))(:[0-5]{1}[0-9]{1})?)?)?)?)?)?)?)?$",
  CMITimespan:
    "^P(?:([.,\\d]+)Y)?(?:([.,\\d]+)M)?(?:([.,\\d]+)W)?(?:([.,\\d]+)D)?(?:T?(?:([.,\\d]+)H)?(?:([.,\\d]+)M)?(?:([.,\\d]+)S)?)?$",
  CMIInteger: "^\\d+$",
  CMISInteger: "^-?([0-9]+)$",
  CMIDecimal: "^-?([0-9]{1,5})(\\.[0-9]{1,18})?$",
  CMIIdentifier: "^\\S{1,250}[a-zA-Z0-9]$",
  CMIShortIdentifier: "^[\\w\\.\\-\\_]{1,250}$",
  CMILongIdentifier:
    "^(?:(?!urn:)\\S{1,4000}|urn:[A-Za-z0-9-]{1,31}:\\S{1,4000}|.{1,4000})$",
  // need to re-examine this
  CMIFeedback: "^.*$",
  // This must be redefined
  CMIIndex: "[._](\\d+).",
  CMIIndexStore: ".N(\\d+).",
  // Vocabulary Data Type Definition
  CMICStatus: "^(completed|incomplete|not attempted|unknown)$",
  CMISStatus: "^(passed|failed|unknown)$",
  CMIExit: "^(time-out|suspend|logout|normal)$",
  CMIType:
    "^(true-false|choice|fill-in|long-fill-in|matching|performance|sequencing|likert|numeric|other)$",
  CMIResult:
    "^(correct|incorrect|unanticipated|neutral|-?([0-9]{1,4})(\\.[0-9]{1,18})?)$",
  NAVEvent:
    "^(previous|continue|exit|exitAll|abandon|abandonAll|suspendAll|_none_|(\\{target=(?<choice_target>\\S{0,}[a-zA-Z0-9-_]+)})?choice|(\\{target=(?<jump_target>\\S{0,}[a-zA-Z0-9-_]+)})?jump)$",

  NAVBoolean: "^(unknown|true|false$)",
  NAVTarget: "^{target=\\S{0,}[a-zA-Z0-9-_]+}$",
  // Data ranges
  scaled_range: "-1#1",
  audio_range: "0#*",
  speed_range: "0#*",
  text_range: "-1#1",
  progress_range: "0#1",
};
