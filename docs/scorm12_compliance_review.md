# SCORM 1.2 Compliance Review

This document captures a focused audit of the SCORM 1.2 runtime implementation in `scorm-again`. It highlights where the library diverges from the specification, points out assumptions that may cause incorrect LMS behaviour, and calls out areas where slightly loosening the implementation would improve real‑world interoperability.

## Executive Summary

- The SCORM API façade currently reports success from `LMSCommit` and `LMSFinish` even when the underlying operations fail, which conflicts with the spec’s error-handling contract and risks data loss.
- Termination now defaults untouched `cmi.core.lesson_status` to `incomplete`; a legacy toggle is available for teams that still need the old automatic “completed” behaviour.
- Several data-type validators (e.g., `CMITimespan`, `CMIIdentifier`, `CMIFeedback`, launch data) either accept invalid payloads or skip length enforcement, exposing the LMS to out-of-spec content.
- Some SCORM vocabulary values are enforced exactly as written, which is correct per spec but may reject widespread “almost SCORM” packages (e.g., `cmi.interactions.n.result="incorrect"` or `cmi.core.exit="normal"`).

## High-Severity Gaps

- **Spec-mandated failure signalling must be preserved** — Immediate commits now await the keepalive transport so failures reach the SCO ([`src/services/HttpService.ts:100-214`](../src/services/HttpService.ts#L100)). Maintain regression coverage to ensure `LMSCommit`/`LMSFinish` continue returning `"false"` when persistence fails, per the RTE contract.[^rte-finish]

## Material Compliance Risks

- **`CMIIdentifier` is too permissive** — The identifier pattern `[!-\~\s]{0,255}` admits spaces and punctuation, while the spec limits identifiers to alphanumerics plus `_` and `-` (no spaces) with a maximum of 255 characters.[^identifier] This affects objective IDs, interaction IDs, etc.

- **Interaction responses ignore SPM** — `CMIFeedback` is relaxed to `^.*$`, removing the 255-character SPM defined for `cmi.interactions.n.student_response` and `correct_responses.n.pattern`.[^feedback] Oversized responses are common but technically non-compliant; consider truncation or configuration rather than removing the guard.

- **Launch data still lacks SPM enforcement** — `cmi.launch_data` is not capped to the spec’s 4 096-character limit ([`src/cmi/scorm12/cmi.ts:173-193`](../src/cmi/scorm12/cmi.ts#L173)).[^launch]
  Other pre-initialisation fields (credit, entry, lesson mode, mastery score, time limits) now validate vocabulary/ranges and normalise stored values to spec format.

- **Timespan inputs are normalized at write time** — Values such as `00:75:30` are now converted to `01:15:30` before being stored so the data model stays spec-compliant while still tolerating SCORM wrappers that send overflow minutes/seconds.
- **ISO 8601 max_time_allowed** — Legacy manifests that store `cmi.student_data.max_time_allowed` as ISO 8601 (e.g., `P1DT23H59M59S`) are accepted and normalised to HH:MM:SS so LMSs continue to receive valid values without forcing content republishing.

## Strictness vs Reality

- **Result vocabulary** — Legacy content that sends `"incorrect"` for `cmi.interactions.n.result` is now accepted and normalised to the spec keyword `"wrong"`, while emitting a warning so authors know the SCO is out of spec ([`src/cmi/scorm12/interactions.ts:200-273`](../src/cmi/scorm12/interactions.ts#L200)).[^incorrect]

- **Exit vocabulary** — Similarly, `"normal"` for `cmi.core.exit` is coerced to the empty string so commits remain spec-compliant, with a warning to aid cleanup ([`src/cmi/scorm12/core.ts:300-325`](../src/cmi/scorm12/core.ts#L300)).[^exit]

## Recommended Next Steps

1. Add regression tests that force the termination path to surface HTTP failures so the new awaited keepalive flow remains spec-compliant.
2. Document the new default of `"incomplete"` and the `autoCompleteLessonStatus` compatibility flag for legacy consumers.
3. Replace the `CMITimespan` and `CMIIdentifier` regexes with spec-compliant patterns and add targeted unit tests.
4. Reinstate SPM/vocabulary validation for launch data, credit metadata, and student data with clear error messages (optionally allow overrides via settings).
5. Offer compatibility shims for `"incorrect"` results and `"normal"` exits while surfacing warnings so integrators know when they are handling out-of-spec content.

## References

[^rte-finish]: *Sharable Content Object Reference Model (SCORM) 1.2 Run-Time Environment*, ADL, §3.3 (`LMSFinish`, `LMSCommit` return values). <https://www.drupal.org/files/issues/2019-04-11/SCORM-12-RunTimeEnv.pdf>
[^cookbook-status]: *Cooking Up A SCORM 1.2 Course*, ADL/SCORM.com, “Completion Status Defaults”. <https://scorm.com/wp-content/assets/cookbook/CookingUpASCORM_v1_2.pdf>
[^timespan]: *Courseware Management with SCORM 1.2*, EASA, Appendix B “CMITimespan data type”. <https://training.easa.europa.eu/easa/nd/fresco/help/en/WebHelp/docs/EN118%20Courseware%20Management%20with%20SCORM%201.2.pdf>
[^identifier]: *SCORM 1.2 Run-Time Environment Book*, Table 4.2, “CMIIdentifier allowed characters”. <https://www.drupal.org/files/issues/2019-04-11/SCORM-12-RunTimeEnv.pdf>
[^feedback]: *SCORM 1.2 Run-Time Reference*, SCORM.com, `CMIFeedback (SPM:255)`. <https://scorm.com/scorm-explained/technical-scorm/run-time/run-time-reference/>
[^launch]: *SCORM 1.2 Data Model Support*, Skillsoft Authoring Guide, `cmi.launch_data` (CMIString4096). <https://documentation.skillsoft.com/en_us/ccps/custom_content_authoring_guidelines/scorm_1.2_authoring_guide/pub_scorm_1.2_data_model_support.htm>
[^core-vocab]: *SCORM 1.2 Explained*, SCORM.com, `cmi.core.credit`, `entry`, `lesson_mode` vocabulary. <https://scorm.com/scorm-explained/technical-scorm/run-time/>
[^student-data]: *SCO Developer’s Documentation*, E-Learning Consulting, `cmi.student_data` element definitions. <https://e-learningconsulting.com/downloads/SCODevelopersDocumentation.pdf>
[^incorrect]: Adobe Captivate community report on `cmi.interactions.n.result` emitting “incorrect” despite 1.2 spec. <https://community.adobe.com/t5/captivate/incorrect-scorm-data-cmi-n-interactions-results/td-p/9480643>
[^exit]: Pipwerks, “cmi.core.exit / cmi.exit” discussion of common non-spec values (“normal”). <https://pipwerks.com/cmicoreexit-cmiexit/>
