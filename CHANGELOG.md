# Secret Browser Commands Changelog

## [1.2.0] - {PR_MERGE_DATE}

* Feature: Browser compatibility for every URL is now taken from a live census of each browser's own `chrome://chrome-urls` page (Chrome 152, Brave 152, Edge 152, Vivaldi 8.2, Opera 135, Comet 145, Arc, Dia) instead of a shared-Chromium guess
* Feature: Add 129 URLs found in that census, including vendor-specific pages for Brave, Opera, Edge, Comet, Arc, and Dia, and the twelve `crash/{browser,gpu,renderer}/*` variants
* Feature: URLs removed from every browser are kept searchable, tagged **Removed**, and carry a note on what replaced them — hidden by default behind the new Hide Removed URLs preference
* Feature: Separate the two things Chromium itself keeps separate — harmless *Internal Debugging Page URLs*, which now say how to enable them, and *Command URLs for Debug*, which crash or hang the browser. The Hide Crash Commands preference (formerly Hide Debug URLs) governs only the latter, matching what it always claimed to do; 62 harmless diagnostics pages are no longer hidden with them
* Feature: URLs that exist but are gated behind a Chromium feature flag are tagged **Flag** and name the flag to enable
* Feature: 22 URLs that Chrome advertises but will not open in a tab — embedded panels and flag-gated pages — are tagged **Won't Open**, so a click that was always going to fail is labelled before you make it
* Enhancement: Add a Toggle Sidebar action (⌘⇧D) to show or hide the detail pane, remembered between launches
* Feature: Windows now works as a reference. Launching a browser shells out to macOS `open`, which does not exist on Windows, so on Windows the extension drops the Open actions and makes Copy URL the primary action instead of offering something that always fails. Everything else — search, the browser filter, the detail pane, stars — is unchanged
* Enhancement: "Open in…" lists only browsers you actually have installed, and the Open action is hidden for a browser that is not installed. The picker still lists all eight, since the list is useful as reference whether or not you have the browser
* Enhancement: Show each browser's real application icon in the picker, the Open action, the Open in… submenu, and the Supported Browsers row — which now lists browsers as tags rather than a comma-joined string. A browser you do not have installed shows a muted globe instead
* Enhancement: The detail pane says why Open is unavailable — not installed, or not supported on Windows — rather than the action silently disappearing
* Enhancement: Add an empty state that names the selected browser and the search that matched nothing
* Enhancement: Failure toasts now carry a Copy Error action
* Enhancement: Star/Unstar and Copy URL use Raycast's common shortcuts (⌘. and ⌘⇧C)
* Fix: Opening an absolute `chrome-untrusted://` URL built `chrome://chrome-untrusted://…` and failed — the primary action now uses the same URL it displays and copies
* Fix: Drop `open -F` from the launcher. It means *fresh*, not *foreground*, and was discarding the target browser's restored windows on every launch
* Fix: Detect a missing browser correctly. macOS says "Unable to find application named", not "Application not found", so the Reveal in Finder recovery never appeared
* Fix: Reveal in Finder passed two operands to `open -R` and resolved the app against the working directory, so it revealed nothing
* Fix: Launch through `execFile` instead of a shell command string, removing the quoting boundary entirely
* Fix: Show a toast rather than a HUD while opening — a HUD closes Raycast, leaving a failure with nowhere to render its Copy Error action
* Fix: "Open in…" no longer offers browsers that do not serve the selected URL
* Fix: Starring before local storage finished loading could overwrite your saved stars with the defaults, and two quick stars could drop the first
* Fix: Perplexity Comet now uses its own `comet://` scheme, which it serves directly
* Chore: Retire ChatGPT Atlas, which is no longer a going concern
* Chore: Add `src/utils/check-paths.mjs`, an invariant check for the generated URL data (duplicate ids, unknown browser keys, contradictory flags, undeclared preferences)
* Chore: Update dependencies, including `@raycast/api` v2

## [1.1.0] - 2025-10-28

* Feature: Add support for ChatGPT Atlas
* Enhancement: Update dependencies
* Enhancement: Add browser compatibility for each URL
* Enhancement: Allow selecting browser from dropdown menu to filter list of compatible URLs
* Enhancement: Add details sidebar for each path, including description, browser and platform compatibility, stability, and whether it's a debug URL
* Enhancement: Add actions to pin/unpin paths and ship with the most useful paths Starred by default
* Documentation: Expand README with compatible browsers list and Chromium source references

## [1.0.1] - 2025-07-15

* Chore: update ESLint integration

## [Initial Version] - 2025-05-26
