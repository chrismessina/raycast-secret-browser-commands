# Secret Browser Commands

<div align="center">
  <a href="https://github.com/chrismessina">
    <img src="https://img.shields.io/github/followers/chrismessina?label=Follow%20chrismessina&style=social" alt="Follow @chrismessina">
  </a>
  <a href="https://github.com/chrismessina/raycast-secret-browser-commands/stargazers">
    <img src="https://img.shields.io/github/stars/chrismessina/raycast-secret-browser-commands?style=social" alt="Stars">
  </a>
  <a href="https://www.raycast.com/chrismessina/secret-browser-commands">
    <img src="https://img.shields.io/badge/Raycast-Store-red.svg" alt="Secret Browser Commands on Raycast store.">
  </a>
</div>

Quickly access hidden internal URLs for Chromium-based browsers (like `chrome://`, `edge://`, etc.).

Note that not all URLs are supported by all browsers.

## Compatible Browsers

This extension supports the following Chromium-based browsers:

| Browser | Scheme | Version censused |
| --- | --- | --- |
| Arc | `arc://` | 1.161.1 (Chromium 152) |
| Brave | `brave://` | 152.1.94.121 |
| Dia | `dia://` | 1.48.0 (Chromium 152) |
| Google Chrome | `chrome://` | 152.0.7977.83 |
| Microsoft Edge | `edge://` | 152.0.4191.66 |
| Opera | `opera://` | 135.0 (Chromium 151) |
| Perplexity Comet | `comet://` | 145.2.7632.5934 |
| Vivaldi | `vivaldi://` | 8.2.4133.47 |

Each browser uses its own URL scheme to access internal pages, though they share many common paths due to their Chromium foundation.

ChatGPT Atlas was dropped in 1.2.0. It is no longer a going concern, and its URLs could not be verified.

## Features

* Search and filter a comprehensive list of secret browser URLs.
* Toggle the detail sidebar with ⌘⇧D.
* Browsers appear with their real application icons, so you can see at a glance which ones you have installed.
* Only browsers you actually have installed are offered as places to open a URL.
* Open URLs in any supported Chromium browser.
* Per-URL browser compatibility taken from a live census of each browser, not guessed.
* Access debugging tools, internal settings, and diagnostic pages.
* Browser-specific pages: Brave Wallet and Shields, Opera's sidebar panels, Comet's Spotlight, Arc's Boost, Dia's organizer.
* URLs removed from every browser are kept searchable, tagged **Removed**, with a note on what replaced them.
* URLs that exist but sit behind a Chromium feature flag are tagged **Flag** and name the flag to enable.
* URLs Chrome advertises but will not open in a tab — embedded panels, flag-gated pages — are tagged **Won't Open**.
* Filter crash commands, untrusted URLs, and removed URLs via preferences (all three hidden by default).
* Internal debugging pages say what to enable before they will load.

## Windows

The extension is a reference on Windows. Every URL, description and compatibility note is there, and
Copy URL is the primary action — but launching a browser is macOS only, because it shells out to
macOS `open`. Rather than offer actions that always fail, Windows hides them; the detail pane says so.

## How the browser compatibility is determined

Every browser's own `chrome://chrome-urls` page (with *Internal debugging pages* enabled) was
scraped over the DevTools Protocol on 2026-09-09, and each browser's list became that browser's
support set. Where a URL is not advertised but still resolves — `chrome://about`, `chrome://help`,
`chrome://interstitials/ssl` — it was verified by navigating to it directly. Nothing in the
compatibility data is inferred from a shared Chromium version.

Every URL was then navigated to in Chrome 152 to separate three cases that a listing alone
cannot tell apart: pages that open, pages that no longer exist, and the 22 pages Chrome
advertises but refuses to open in a tab.

## ⚠️ Important Warnings

### Debug URLs

This extension includes **debug commands** that are intended exclusively for browser developers testing crash reporting and stability. These commands can:

* **Crash your browser** immediately (e.g., `chrome://crash`, `chrome://gpucrash`)
* **Hang your browser** indefinitely (e.g., `chrome://hang`, `chrome://gpuhang`)
* **Terminate browser processes** (e.g., `chrome://kill`, `chrome://quit`)
* **Cause data loss** if you have unsaved work

**These URLs are hidden by default** behind the *Hide Crash Commands* preference. Only enable them if you are a developer who understands their purpose and accepts the risks.

Chromium lists these separately from *Internal Debugging Page URLs* — pages like `chrome://actor-internals` and `chrome://omnibox`, which are harmless diagnostics that simply need **Enable internal debugging pages** turned on at `chrome://chrome-urls` first. This extension keeps that distinction: the preference above hides only the ones that crash the browser.

### Chrome-Untrusted URLs

The extension also includes **chrome-untrusted://** URLs, which run in isolated security contexts with restricted privileges. These URLs:

* Are designed for internal browser features that handle untrusted content
* Run in heavily sandboxed environments separate from normal browser pages
* **May cause unexpected behavior, errors, or crashes** when accessed directly
* Are not intended for direct user interaction

Examples include `chrome-untrusted://compose`, `chrome-untrusted://print`, and `chrome-untrusted://lens-overlay`.

**These URLs are also hidden by default.** Only enable them if you understand the security implications and are troubleshooting specific browser features.

## Sources

The secret browser URLs in this extension come from, in order of authority:

* Each browser's own `chrome://chrome-urls` page — the authoritative, per-build list, and the primary source since 1.2.0
* [webui_url_constants.cc](https://source.chromium.org/chromium/chromium/src/+/main:chrome/common/webui_url_constants.cc) - `ChromeURLHosts()` and `ChromeDebugURLs()`, the arrays that generate that page
* [chrome_url_data_manager_browsertest.cc](https://source.chromium.org/chromium/chromium/src/+/main:chrome/browser/ui/webui/chrome_url_data_manager_browsertest.cc) - internal Chrome URLs exercised by tests

These URLs provide access to internal browser pages for debugging, diagnostics, configuration, and feature management. Vendor-specific pages (Brave, Opera, Edge, Comet, Arc, Dia) do not appear in Chromium source at all and come only from the live census.
