/**
 * SCORM 1.2 Data Type Definitions
 * Per SCORM 1.2 RTE Appendix A: Data Type Standards
 */
export const scorm12_regex = {
  /** CMIString256 - Character string, max 255 chars (RTE A.1) */
  CMIString256: "^[\\s\\S]{0,255}$",
  /** CMIString4096 - Character string, max 4096 chars (RTE A.1) */
  CMIString4096: "^[\\s\\S]{0,4096}$",
  /**
   * CMIString64000 - Extended character string, max 64000 chars
   *
   * SPEC COMPLIANCE NOTE:
   * The SCORM 1.2 specification defines cmi.suspend_data as CMIString4096 (max 4096 chars).
   * This implementation intentionally increases the limit to 64000 chars (matching SCORM 2004)
   * for the following reasons:
   *
   * 1. Modern content frequently exceeds 4096 chars due to JSON state serialization,
   *    base64 encoding, complex bookmark data, and rich interaction tracking
   * 2. The 4096 limit was set in 2001 when content was simpler; modern authoring tools
   *    routinely generate larger suspend_data
   * 3. Most LMS systems can handle larger values - the API shouldn't be the bottleneck
   * 4. Content that gets rejected has no recovery path, causing data loss
   * 5. Aligns with SCORM 2004's more practical 64000 char limit
   *
   * Used by: cmi.suspend_data (SCORM 1.2 / AICC)
   *
   * Strict spec pattern would be: ^[\s\S]{0,4096}$
   */
  CMIString64000: "^[\\s\\S]{0,64000}$",
  /**
   * CMITime - Clock time in HH:MM:SS.SS format (RTE A.2)
   * Optional centiseconds (1-2 decimal digits) per spec.
   */
  CMITime: "^(?:[01]\\d|2[0123]):(?:[012345]\\d):(?:[012345]\\d)(\\.\\d{1,2})?$",
  /**
   * CMITimespan - Time interval in HHHH:MM:SS.SS format (RTE A.3)
   * We allow more digits for the hour to support values generated
   * by getSecondsAsHHMMSS which can produce larger hour values
   * (e.g., 17496:00:00 for very long durations).
   * Changed from minimum 2 digits to 1+ digits with no upper limit.
   */
  CMITimespan: "^([0-9]+):([0-9]{2}):([0-9]{2})(\\.\\d{1,2})?$",

  /**
   * CMIInteger - Non-negative integer (RTE A.4)
   *
   * SPEC COMPLIANCE NOTE:
   * The SCORM 1.2 specification defines CMIInteger as 0-65536 range.
   * This implementation intentionally omits range validation to support
   * legacy content that may exceed this limit in _count fields or other
   * integer values. Real-world content often violates the spec by storing
   * larger values, and strict enforcement would break compatibility.
   *
   * Affected elements:
   * - cmi.objectives._count
   * - cmi.interactions._count
   * - cmi.interactions.n.objectives._count
   * - cmi.interactions.n.correct_responses._count
   */
  CMIInteger: "^\\d+$",
  /** CMISInteger - Signed integer (RTE A.5) */
  CMISInteger: "^-?([0-9]+)$",
  /**
   * CMIDecimal - Signed decimal (RTE A.6)
   * We set practical limits on decimals to prevent abuse while maintaining
   * broad compatibility with legacy content.
   * Increased from 3 to 10 digits before decimal to match SCORM 2004 behavior.
   */
  CMIDecimal: "^-?([0-9]{0,10})(\\.[0-9]*)?$",

  /**
   * CMIIdentifier - Printable ASCII characters, max 255 chars (RTE A.7)
   *
   * SPEC COMPLIANCE NOTE:
   * The SCORM 1.2 specification defines CMIIdentifier as alphanumeric only:
   * letters (a-z, A-Z), numbers (0-9), hyphens (-), and underscores (_).
   * Spaces and periods are explicitly NOT allowed per spec.
   *
   * This implementation intentionally relaxes validation to accept all
   * printable ASCII characters (0x21-0x7E) plus whitespace to support
   * legacy content. Many real-world LMS systems and content packages use
   * identifiers that violate the strict spec (e.g., student IDs with spaces,
   * objective IDs with periods or special characters).
   *
   * Strict spec pattern would be: ^[A-Za-z0-9_-]{0,255}$
   *
   * Affected elements:
   * - cmi.core.student_id
   * - cmi.objectives.n.id
   * - cmi.interactions.n.id
   * - cmi.interactions.n.objectives.n.id
   */
  CMIIdentifier: "^[\\u0021-\\u007E\\s]{0,255}$",
  /** CMICredit - Vocabulary: credit or no-credit (RTE 3.4.2.1.3) */
  CMICredit: "^(credit|no-credit)$",
  /** CMIEntry - Vocabulary: ab-initio, resume, or empty (RTE 3.4.2.1.4) */
  CMIEntry: "^(ab-initio|resume|)$",
  /** CMILessonMode - Vocabulary: normal, browse, or review (RTE 3.4.2.1.10) */
  CMILessonMode: "^(normal|browse|review)$",
  /** CMITimeLimitAction - Vocabulary: action combinations (RTE 3.4.2.1.11) */
  CMITimeLimitAction: "^(exit,message|exit,no message|continue,message|continue,no message)$",
  /**
   * CMIFeedback - Relaxed for compatibility (normally CMIString255)
   *
   * SPEC COMPLIANCE NOTE:
   * The SCORM 1.2 specification defines CMIFeedback as CMIString255 (max 255 chars)
   * with format varying by interaction type (see RTE 3.4.2.7.5, 3.4.2.7.7).
   *
   * This implementation intentionally relaxes validation for two reasons:
   *
   * 1. LENGTH: Many legacy content packages store responses exceeding 255 chars,
   *    especially for fill-in and performance interaction types. Strict enforcement
   *    would break existing content with no user-facing benefit.
   *
   * 2. FORMAT: The spec requires type-specific formats (e.g., true-false accepts
   *    only "0"/"1"/"t"/"f", choice accepts comma-separated single chars). However:
   *    - Format validation requires knowing interaction type at validation time
   *    - Legacy content often uses non-standard formats
   *    - The SCO is responsible for response evaluation, not the API
   *    - Strict format validation provides minimal benefit vs. compatibility cost
   *
   * Affected elements:
   * - cmi.interactions.n.student_response
   * - cmi.interactions.n.correct_responses.n.pattern
   *
   * Strict spec pattern would be: ^[\s\S]{0,255}$ with type-specific subpatterns
   */
  CMIFeedback: "^.*$",
  /** CMIIndex - Pattern for array index extraction */
  CMIIndex: "[._](\\d+).",
  /** CMIStatus - Lesson status vocabulary (RTE 3.4.2.2.3) */
  CMIStatus: "^(passed|completed|failed|incomplete|browsed)$",
  /** CMIStatus2 - Extended status vocabulary with "not attempted" (RTE 3.4.2.6.2) */
  CMIStatus2: "^(passed|completed|failed|incomplete|browsed|not attempted)$",
  /** CMIExit - Exit vocabulary (RTE 3.4.2.1.5) */
  CMIExit: "^(time-out|suspend|logout|)$",
  /** CMIType - Interaction type vocabulary (RTE 3.4.2.7.2) */
  CMIType: "^(true-false|choice|fill-in|matching|performance|sequencing|likert|numeric)$",
  /** CMIResult - Interaction result vocabulary (RTE 3.4.2.7.6) */
  CMIResult: "^(correct|wrong|unanticipated|neutral|([0-9]{0,3})?(\\.[0-9]*)?)$",
  /** NAVEvent - Navigation event vocabulary (SCORM 1.2 extension) */
  NAVEvent:
    "^(_?(previous|continue|start|resumeAll|exit|exitAll|abandon|abandonAll|suspendAll|retry|retryAll)|choice|jump|_none_)$",
  /** score_range - Valid score range 0-100 (RTE 3.4.2.2.2) */
  score_range: "0#100",
  /** audio_range - Audio level range -1 to 100 (RTE 3.4.2.3.1) */
  audio_range: "-1#100",
  /** speed_range - Playback speed range -100 to 100 (RTE 3.4.2.3.2) */
  speed_range: "-100#100",
  /** weighting_range - Interaction weighting range -100 to 100 (RTE 3.4.2.7.4) */
  weighting_range: "-100#100",
  /** text_range - Text display preference -1 to 1 (RTE 3.4.2.3.3) */
  text_range: "-1#1",
};
/**
 * AICC Data Type Definitions
 * Based on SCORM 1.2 with AICC-specific variations
 * Per AICC CMI001 Guidelines for Interoperability
 */
export const aicc_regex = {
  ...scorm12_regex,
  ...{
    /**
     * CMIIdentifier - AICC variation
     * AICC allows: letters, numbers, underscores, periods, hyphens
     * More restrictive than SCORM 1.2 (no spaces, limited punctuation)
     * Per AICC CMI001 Section 3.2.1
     */
    CMIIdentifier: "^[A-Za-z0-9._-]{1,255}$",
  },
};
/**
 * SCORM 2004 Data Type Definitions
 * Per SCORM 2004 4th Edition RTE Appendix C: Data Type Standards
 */
export const scorm2004_regex = {
  /** CMIString200 - Character string, max 200 chars (RTE C.1.1) */
  CMIString200: "^[\\u0000-\\uFFFF]{0,200}$",
  /** CMIString250 - Character string, max 250 chars (RTE C.1.1) */
  CMIString250: "^[\\u0000-\\uFFFF]{0,250}$",
  /** CMIString1000 - Character string, max 1000 chars (RTE C.1.1) */
  CMIString1000: "^[\\u0000-\\uFFFF]{0,1000}$",
  /** CMIString4000 - Character string, max 4000 chars (RTE C.1.1) */
  CMIString4000: "^[\\u0000-\\uFFFF]{0,4000}$",
  /** CMIString64000 - Character string, max 64000 chars (RTE C.1.1) */
  CMIString64000: "^[\\u0000-\\uFFFF]{0,64000}$",
  /**
   * CMILang - Language code per RFC 1766/RFC 3066 (RTE C.1.2)
   * Primary tag: 1-8 characters (ISO 639-1: 2, ISO 639-2: 3, or i/x for IANA/private)
   * Subtag: 2-8 alphanumeric characters
   */
  CMILang: "^([a-zA-Z]{1,8}|i|x)(-[a-zA-Z0-9-]{2,8})?$|^$",

  /** CMILangString250 - String with optional language tag, max 250 chars (RTE C.1.3) */
  CMILangString250: "^({lang=([a-zA-Z]{1,8}|i|x)(-[a-zA-Z0-9-]{2,8})?})?((?!{.*$).{0,250}$)?$",

  /** CMILangcr - Language tag pattern with content */
  CMILangcr: "^(({lang=([a-zA-Z]{1,8}|i|x)?(-[a-zA-Z0-9-]{2,8})?}))(.*?)$",

  /** CMILangString250cr - String with optional language tag (carriage return variant) */
  CMILangString250cr: "^(({lang=([a-zA-Z]{1,8}|i|x)?(-[a-zA-Z0-9-]{2,8})?})?(.{0,250})?)?$",

  /** CMILangString4000 - String with optional language tag, max 4000 chars (RTE C.1.3) */
  CMILangString4000: "^({lang=([a-zA-Z]{1,8}|i|x)(-[a-zA-Z0-9-]{2,8})?})?((?!{.*$).{0,4000}$)?$",

  /**
   * CMITime - ISO 8601 timestamp format (RTE C.1.4)
   * Year range expanded from 1970-2038 to 1970-9999 to support future dates
   */
  CMITime:
    "^(19[7-9][0-9]|[2-9][0-9]{3})((-(0[1-9]|1[0-2]))((-(0[1-9]|[1-2][0-9]|3[0-1]))(T([0-1][0-9]|2[0-3])((:[0-5][0-9])((:[0-5][0-9])((\\.[0-9]{1,6})((Z|([+|-]([0-1][0-9]|2[0-3])))(:[0-5][0-9])?)?)?)?)?)?)?)?$",
  /** CMITimespan - ISO 8601 duration format (RTE C.1.5) */
  CMITimespan:
    "^P(?:([.,\\d]+)Y)?(?:([.,\\d]+)M)?(?:([.,\\d]+)W)?(?:([.,\\d]+)D)?(?:T?(?:([.,\\d]+)H)?(?:([.,\\d]+)M)?(?:(\\d+(?:\\.\\d{1,2})?)S)?)?$",
  /** CMIInteger - Non-negative integer (RTE C.1.6) */
  CMIInteger: "^\\d+$",
  /** CMISInteger - Signed integer (RTE C.1.7) */
  CMISInteger: "^-?([0-9]+)$",
  /**
   * CMIDecimal - Signed decimal (RTE C.1.8)
   * Spec allows unlimited digits, but we set practical limits to prevent abuse
   * while maintaining broad compatibility:
   * - Up to 10 digits before decimal (supports values up to 10 billion)
   * - Up to 18 digits after decimal (maintains precision for scientific use)
   */
  CMIDecimal: "^-?([0-9]{1,10})(\\.[0-9]{1,18})?$",
  /**
   * CMIIdentifier - Identifier with alphanumeric ending, max 250 chars (RTE C.1.9)
   * Must contain at least one word character (\w) and only allow: letters,
   * numbers, - ( ) + . : = @ ; $ _ ! * ' % / #
   * URN format is validated separately if string starts with "urn:"
   */
  CMIIdentifier: "^(?=.*\\w)[\\w\\-\\(\\)\\+\\.\\:\\=\\@\\;\\$\\_\\!\\*\\'\\%\\/\\#]{1,250}$",
  /** CMIShortIdentifier - Short identifier with word chars/punctuation, max 250 chars (RTE C.1.10) */
  CMIShortIdentifier: "^[\\w\\.\\-\\_]{1,250}$",
  /** CMILongIdentifier - Long identifier supporting URN format, max 4000 chars (RTE C.1.11) */
  CMILongIdentifier: "^(?:(?!urn:)\\S{1,4000}|urn:[A-Za-z0-9-]{1,31}:\\S{1,4000}|.{1,4000})$",
  /** CMIFeedback - Unrestricted feedback text (RTE C.1.12) */
  CMIFeedback: "^.*$",
  /** CMIIndex - Pattern for array index extraction */
  CMIIndex: "[._](\\d+).",
  /** CMIIndexStore - Pattern for stored index notation */
  CMIIndexStore: ".N(\\d+).",
  /** CMICStatus - Completion status vocabulary (RTE 4.1.4) */
  CMICStatus: "^(completed|incomplete|not attempted|unknown)$",
  /** CMISStatus - Success status vocabulary (RTE 4.1.11) */
  CMISStatus: "^(passed|failed|unknown)$",
  /** CMIExit - Exit vocabulary (RTE 4.1.3) */
  CMIExit: "^(time-out|suspend|logout|normal)$",
  /** CMIType - Interaction type vocabulary (RTE 4.1.6.2) */
  CMIType:
    "^(true-false|choice|fill-in|long-fill-in|matching|performance|sequencing|likert|numeric|other)$",
  /** CMIResult - Interaction result vocabulary (RTE 4.1.6.8) */
  CMIResult: "^(correct|incorrect|unanticipated|neutral|-?([0-9]{1,4})(\\.[0-9]{1,18})?)$",
  /** NAVEvent - Navigation event vocabulary (SN Book Table 4.4.2) */
  NAVEvent:
    "^(_?(start|resumeAll|previous|continue|exit|exitAll|abandon|abandonAll|suspendAll|retry|retryAll)|_none_|(\\{target=(?<choice_target>\\S{0,}[a-zA-Z0-9-_]+)})?choice|(\\{target=(?<jump_target>\\S{0,}[a-zA-Z0-9-_]+)})?jump)$",

  /** NAVBoolean - Navigation boolean vocabulary (SN Book) */
  NAVBoolean: "^(unknown|true|false)$",
  /** NAVTarget - Navigation target pattern (SN Book) */
  NAVTarget: "^{target=\\S{0,}[a-zA-Z0-9-_]+}$",
  /** scaled_range - Scaled score range -1 to 1 (RTE 4.1.10.1) */
  scaled_range: "-1#1",
  /** audio_range - Audio level range 0 to 999.9999999 (RTE 4.1.7.1) */
  audio_range: "0#999.9999999",
  /** speed_range - Playback speed range 0 to 999.9999999 (RTE 4.1.7.4) */
  speed_range: "0#999.9999999",
  /** text_range - Text display preference -1 to 1 (RTE 4.1.7.5) */
  text_range: "-1#1",
  /** progress_range - Progress measure range 0 to 1 (RTE 4.1.8) */
  progress_range: "0#1",
};
