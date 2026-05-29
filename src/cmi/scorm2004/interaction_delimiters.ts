/**
 * Helpers for splitting SCORM 2004 interaction `correct_responses` /
 * `learner_response` pattern strings on the spec's reserved separator
 * delimiters.
 *
 * Per the SCORM 2004 4th Edition RTE (sec 4.1.1.6, Table 4.1.1.6b) the
 * separator delimiters are the *bracketed* tokens "[,]", "[.]" and "[:]":
 *
 *     delimiter ::= "[" + reserved_character + "]"   // reserved_character ∈ { . , : }
 *
 * and the spec is explicit that the brackets are required: "The absence of
 * these required characters will cause the delimiter to not be recognized by
 * the system; instead, the set of characters will be treated as part of the
 * underlying characterstring." So a bare ".", "," or ":" is literal data.
 *
 * scorm-again historically split on the *bare* character instead, which both
 * rejected spec-compliant bracketed patterns (issue #1571) and could not
 * represent values that legitimately contain a literal "." or ":". To accept
 * the spec form without breaking legacy plain content, we split on the
 * bracketed token when the value contains it, and otherwise fall back to the
 * bare character.
 */

/** Remove the square brackets from a reserved token: "[,]" -> "," */
export function stripBrackets(delim: string): string {
  return delim.replace(/[[\]]/g, "");
}

/** Escape a string for use inside a RegExp. */
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Split `value` on a reserved separator delimiter token such as "[,]".
 *
 * - If `value` contains the bracketed token, split on the literal token
 *   (the spec form). Every occurrence is a separator.
 * - Otherwise split on the bare character, treating "\<char>" as an escaped
 *   literal (the legacy/back-compat form).
 *
 * @param value - the characterstring to split
 * @param bracketed - the bracketed delimiter token, e.g. "[,]" / "[.]" / "[:]"
 */
export function splitDelimited(value: string, bracketed: string): string[] {
  if (!bracketed) {
    return [value];
  }
  if (value.includes(bracketed)) {
    return value.split(bracketed);
  }
  const bare = stripBrackets(bracketed);
  if (!bare) {
    return [value];
  }
  const splitRe = new RegExp(`(?<!\\\\)${escapeRegex(bare)}`, "g");
  const unescapeRe = new RegExp(`\\\\${escapeRegex(bare)}`, "g");
  return value.split(splitRe).map((part) => part.replace(unescapeRe, bare));
}

/**
 * Split `value` on the FIRST occurrence of a reserved separator delimiter only.
 *
 * Used for `performance` patterns (`step_name[.]step_answer`) where the
 * step_answer may itself contain literal dots (decimals like "3.14") or colons
 * (ranges). Returns a single element when no delimiter is present, otherwise
 * exactly two elements.
 *
 * @param value - the characterstring to split
 * @param bracketed - the bracketed delimiter token, e.g. "[.]"
 */
export function splitFirstDelimited(value: string, bracketed: string): string[] {
  if (!bracketed) {
    return [value];
  }
  if (value.includes(bracketed)) {
    const idx = value.indexOf(bracketed);
    return [value.slice(0, idx), value.slice(idx + bracketed.length)];
  }
  const bare = stripBrackets(bracketed);
  if (!bare) {
    return [value];
  }
  const splitRe = new RegExp(`(?<!\\\\)${escapeRegex(bare)}`);
  const unescapeRe = new RegExp(`\\\\${escapeRegex(bare)}`, "g");
  const parts = value.split(splitRe);
  const first = (parts[0] ?? "").replace(unescapeRe, bare);
  if (parts.length === 1) {
    return [first];
  }
  return [first, parts.slice(1).join(bare).replace(unescapeRe, bare)];
}
