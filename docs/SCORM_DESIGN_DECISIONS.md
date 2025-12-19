# SCORM-Again Design Decisions

This document explains intentional deviations from the SCORM specifications made for practical reasons.

## ADL Data: Dynamic Store Creation

**Specification:** SCORM 2004 4th Ed requires data stores be defined via `<adlcp:data>` elements in the manifest. SCOs cannot create data stores at runtime.

**Our Approach:** We allow dynamic data store creation via the API.

**Rationale:** Most content doesn't use manifest-defined stores. Requiring manifest parsing would break backward compatibility with existing content and add complexity for simple use cases.

**Code Reference:** `src/Scorm2004API.ts:779-786`

---

## ADL Navigation: Event-Based Processing

**Specification:** The Navigation Request Process (NB.2.1) defines detailed validation rules for navigation requests during Terminate().

**Our Approach:** We validate the navigation request vocabulary and dispatch events. The actual sequencing validation is delegated to event handlers.

**Rationale:** This allows LMS implementers to provide their own sequencing engines while we handle the API layer. The library fires events like `SequenceChoice`, `SequenceNext`, etc. that can be consumed by external sequencing implementations.

**Code Reference:** `src/Scorm2004API.ts:235-354`

---

## SPM (Smallest Permitted Maximum) Limits

**Specification:** Values exceeding SPM limits should be truncated and a diagnostic message set.

**Our Approach:** We do NOT enforce SPM limits on write operations.

**Rationale:** Enforcing SPM limits breaks content that stores slightly more data than allowed. Many LMS implementations are more permissive, and truncating data silently can cause data loss issues. Content authors can implement their own limits if needed.

**Code Reference:** `src/BaseAPI.ts:1254-1257` (see comment)

---

## GetErrorString/GetDiagnostic Parameter Validation

**Specification:** Parameters should be in range 0-65536 and max 255 characters.

**Our Approach:** We accept any parameter and return empty string for unknown codes.

**Rationale:** Permissive validation is more robust. Rejecting valid-but-unknown error codes would break forward compatibility. The spec intent is to return information when available, not to validate inputs strictly.

**Code Reference:** `src/BaseAPI.ts:943-994`
