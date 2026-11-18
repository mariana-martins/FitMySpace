# GARAGE.md — FitMySpace

_Checked in: 2026-11-18 · Re-confirm at next inspection_
_Previous check-in: 2026-08-04 (its results were recorded in this file; they live on in git history and are compared in `reports/2026-11-18-inspection.md`)._

## Vehicle

- System: FitMySpace Design System, serving the FitMySpace app (a search engine for home organisation products across stores)
- Team: Solo — one maintainer (Mariana), design and engineering, with AI agents doing much of the build under `AGENTS.md` · Consumers: 1 product (the FitMySpace app); it does not consume the design system yet
- Age: ~5 months (v0.1.0 on 2026-06-30); rapid growth since 2026-11-11 (v0.2.0 → v0.6.0 in one week)
- Reason for service: routine re-inspection after a large build-out (27 components, 22 patterns); the August profile was outdated

## Assets

- Design library: Figma file `2vgKu1CEc6b79vwFHLYcFM`, free Starter plan (few MCP calls, no Code Connect, no upgrade possible). Pages: `Button`, `Icons`.
- Code library: Next.js 16 / React 19 / TypeScript, in-repo at `src/components/design-system/` (not a published package). CSS Modules on Style Dictionary tokens (3 tiers: 9 tier-1, 10 tier-2, 23 tier-3 files → `tokens.css`). Radix primitives.
- Docs: Storybook 10, published to GitHub Pages after green CI on `main`. Introduction, Foundation pages, a page per component, Patterns section (22 recipes in 4 groups), Changelog page.
- Process: GitHub PRs with CI (`ci.yml`), Conventional Commits (commitlint), Husky pre-commit (lint-staged, tokens:check, Jest), release-it (`.release-it.mjs`) → `CHANGELOG.md` and tags. Planning in `src/PLANNING.md` (git-ignored, local only). No issue tracker in use.
- AI surface: `AGENTS.md` (+ `CLAUDE.md`) with design-system rules; `@storybook/addon-mcp` in the dev server; Figma MCP connected; agent skills in `.agents/skills/`.

## Evidence access map

| Asset          | Access | Verified how                                                                                     |
| -------------- | ------ | ------------------------------------------------------------------------------------------------ |
| Design library | live   | Figma MCP `get_metadata` on the file listed its pages (`Button`, `Icons`); one call by agreement |
| Code library   | live   | Read components, types, CSS, tests and token files in the repo                                   |
| Docs           | live   | Storybook dev server on :6006 (index.json, Playwright screenshots) and its MCP endpoint `/mcp`   |
| Process        | live   | `gh` (PRs, branch protection, rulesets, issues), git tags, CI workflow files                     |

## Known symptoms

- The design library lags far behind code (Figma: Button and Icons only)
- The app does not use the design system yet; legacy components run in parallel
- Gaps found while building patterns: Sheet, Table, Tabs, Popover, AlertDialog, Combobox

## Probable greens

- Code craft, accessibility testing, token architecture, documentation structure

## Intentional deviations

- **No adoption yet, by design:** legacy app components are not replaced or migrated until all design-system components are finished (`AGENTS.md`). Adoption is scored with that in mind.
- **Code is canonical:** the Figma Starter plan limits MCP calls and has no Code Connect, so the design library is built after the code, by hand.
- **Breaking icon-prop change in v0.5.0 not flagged** in the changelog: accepted by the maintainer (no consumer yet).

## Scope & frame

- Stations this pass: all 10 · Scoring frame: solo / small team
- Out of scope: the legacy app components themselves
