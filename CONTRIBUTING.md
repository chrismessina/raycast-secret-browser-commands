# Contributing to Secret Browser Commands

Thanks for helping. This guide covers running Secret Browser Commands locally and sending a change.

## Where changes go

Secret Browser Commands is published in the [Raycast Store](https://www.raycast.com/chrismessina/secret-browser-commands).
Open pull requests against [`raycast/extensions`](https://github.com/raycast/extensions/tree/main/extensions/secret-browser-commands),
not this repository: Raycast reviews every change there, and merged changes sync back here
automatically. Open [issues](https://github.com/chrismessina/raycast-secret-browser-commands/issues) here or in
`raycast/extensions`, whichever you prefer.

## Run it locally

You need [Raycast](https://www.raycast.com/) and Node.js 22 or later.

1. In Raycast, find Secret Browser Commands in the Store and choose **Fork Extension** from the action panel.
   Raycast checks out only this extension's folder from `raycast/extensions`.
2. In that folder, run `npm ci`, then `npm run dev`. Raycast opens the development version, and
   saving a file reloads it.

Opening a command shells out to macOS `open`, so testing the open actions needs a Mac with at least
one of the supported Chromium browsers installed.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Run the extension in Raycast and reload on save |
| `npm run build` | Run `check-paths`, then build the distribution bundle |
| `npm run lint` | Run Raycast's ESLint and Prettier checks, then `check-paths` |
| `npm run fix-lint` | Fix what the linter can fix |
| `npm run check-paths` | Check the invariants of the command catalog in `src/data/paths.ts` |

## How it works

- `src/listCommands.tsx` is the one command: the searchable list, browser dropdown, stars and
  detail pane.
- `src/data/paths.ts` is the catalog of internal commands. Each entry's browser support comes from
  the 2026-09-09 census of every browser's own `chrome://chrome-urls` page, recorded in
  `docs/paths.md`. Treat that census as the source when you change support sets, and note in
  `docs/paths.md` any entry that was not measured that way.
- `src/utils/check-paths.mjs` checks the catalog for the mistakes a regenerated file makes: a
  duplicate id (which breaks starring), a browser key that matches no browser, or a flag
  combination the UI cannot render. `build` and `lint` both run it.
- `src/types/browsers.ts` lists the supported browsers with their scheme, the macOS app name
  used to launch it, and, where known, the bundle id used to find the installed app's icon.
- `src/utils/browserUrl.ts` builds every URL that is shown, copied or opened, so those three never
  disagree. Paths are bare (`settings`) and take the browser's scheme, except `chrome-untrusted://`
  URLs, which are used as-is.
- `src/utils/browserApps.ts` finds installed browsers, `src/utils/openUrlInBrowser.ts` opens a URL
  with `open -a`, preferring the installed app's path, and `src/components/OpenInActions.tsx` builds the Open in… submenu from the
  browsers that serve a URL and are installed.
- `src/utils/sort-urls.js` sorts `paths.ts` by path, after writing a backup to
  `src/data/paths.ts.bak`. Run it with `node src/utils/sort-urls.js` from the repo root.

## Before you open a pull request

- `npm run build`, `npx tsc --noEmit` and `npm run lint` all pass.
- You tried the change in Raycast, including its error and empty states.
- `CHANGELOG.md` has a new entry at the top, dated `{PR_MERGE_DATE}`. Raycast fills in the date
  when the pull request merges.
- New or changed screenshots go in `metadata/`, taken with Raycast's Window Capture.
