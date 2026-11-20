# TODO

- [X] Add support for ChatGPT Atlas
- [X] Update dependencies
- [X] Update README to reference source of secret URLs
- [X] Add browser compatibility for each URL
- [X] Allow selecting browser from dropdown menu to filter list of compatible URLs
- [X] Add details sidebar for each path, including description, browser and platform compatibility, stability, and whether it's a debug URL
- [X] Add actions to pin/unpin paths and ship with the most useful paths Starred by default
- [X] Replace guessed browser compatibility with a live census of each browser's own `chrome://chrome-urls`
- [X] Mark URLs removed from every browser as deprecated instead of silently listing them
- [X] Retire ChatGPT Atlas (app bundle is an empty stub; no longer a going concern)
- [ ] Re-run the census on each Chromium major and diff it into `docs/paths.md`
- [ ] Identify more flag-gated URLs — `chrome://tab-group-home` is advertised but only resolves with `--enable-features=TabGroupHome`, and there are likely others
- [ ] Convert `src/utils/sort-urls.js` to ES modules. It uses `require` and `__dirname`, but `package.json` sets `"type": "module"`, so `node src/utils/sort-urls.js` fails before it writes the `src/data/paths.ts.bak` backup or sorts anything (found by Codex, 2026-11-20). Use `import` and `fileURLToPath(import.meta.url)` (or rename it to `.cjs`), run it once against a copy of `paths.ts`, then drop the "currently fails" note from `CONTRIBUTING.md`
