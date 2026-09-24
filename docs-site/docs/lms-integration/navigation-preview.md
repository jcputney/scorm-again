# Preview player navigation

`Scorm2004API.previewNavigationRequest("continue" | "previous")` lets a host player
check navigation before terminating the current SCO. This extension does not change
the SCORM `adl.nav.request_valid` contract: a valid Continue request can still reach
a blocked activity after End Attempt.

```js
const preview = api.previewNavigationRequest("continue");
if (preview.outcome === "blocked") {
   showNavigationNotice(preview.exception);
   // Keep the current SCO document and runtime session alive.
   return;
}
api.SetValue("adl.nav.request", "continue");
api.Terminate("");
```

The synchronous result has these fields:

| Field                  | Meaning                                               |
| ---------------------- | ----------------------------------------------------- |
| `outcome`              | `allowed`, `blocked`, or `unknown`                    |
| `targetActivityId`     | Predicted delivered activity ID, or `null`            |
| `endSequencingSession` | Whether the request would end the sequencing session  |
| `exception`            | Sequencing diagnostic for a blocked result, or `null` |

The preview runs normal termination, objective transfer, rollup and sequencing
against an isolated copy of current tracking state. It includes CMI values already
reported by the SCO and distinguishes content writes from LMS launch seeding. It
does not terminate the live API, change attempts or bookmarks, emit host sequencing
events, commit data, save persistence, or unload/deliver content. Genuine completion
at the end of the course and authored Retry rules remain allowed.

Use the result immediately, then check again on a later click: subsequent CMI writes,
elapsed time or changed objectives can change the outcome. It cannot predict future
values that content has not yet reported. Time/elapsed-time providers must remain
read-only, as they are during ordinary rule evaluation.

`unknown` means prediction is unavailable, not that navigation is prohibited. This
includes an uninitialized/terminated runtime, missing/inactive sequencing, delivery
in progress, custom model objects/accessors/callbacks that cannot safely be copied,
and trees configured for random selection or randomization. No random draw is consumed.
Hosts can retain ordinary navigation for `unknown`; such cases can still be refused
after termination. Do not use this method to override a SCO's own Terminate request.
