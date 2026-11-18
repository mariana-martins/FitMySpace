# Multi-Point Inspection Report — FitMySpace Design System

_Inspected: 2026-11-18 · Technician: Claude Code (Claude Opus 5.5) · Previous inspection: 2026-08-04_
_Vehicle profile: `ds-inspection/GARAGE.md` (checked in 2026-11-18)_

## The short version

The engine is in very good shape: 27 components and 22 patterns built to a high, consistent standard, with accessibility, token and docs checks running in CI on every pull request. The two warning lights that matter are about the other two legs of the stool: the Figma library has only `Button` and `Icons` against 27 coded components, and the app itself does not use the design system yet (by design, but every week without a migration plan widens the gap). Agents can reach the system, but the Storybook MCP is not registered in Claude Code and hands agents story code with a wrong import path and no usage rules. **The single most important next move: decide and write down how the design library and the app will catch up with the code — then protect `main` so the CI you already have actually gates merges.**

**Overall: 65/100** — a conversation starter, not a grade. Fix the reds, schedule the yellows, re-run on a cadence.

## Inspection sheet

|   # | Station                         | Quality      | Light |      Score |
| --: | :------------------------------ | :----------- | :---: | ---------: |
|   1 | Coverage & gaps                 | Complete     |  🟡   |       6/10 |
|   2 | Best practices                  | Sound        |  🟢   |       8/10 |
|   3 | Accessibility                   | Sound        |  🟢   |       8/10 |
|   4 | Shared language                 | Sound        |  🟢   |       8/10 |
|   5 | Testing & validation            | Sound        |  🟡   |       7/10 |
|   6 | Orchestration                   | Synchronized |  🟡   |       4/10 |
|   7 | Governance & version control    | Extensible   |  🟡   |       7/10 |
|   8 | Feedback & adoption             | Extensible   |  🟡   |       4/10 |
|   9 | Machine-readable docs & context | AI-Ready     |  🟡   |       7/10 |
|  10 | Agent access                    | AI-Ready     |  🟡   |       6/10 |
|     | **Overall**                     |              |       | **65/100** |

**Lights:** 🟢 3 green · 🟡 7 yellow · 🔴 0 red · 0 not inspected

**Key:** 🔴 Red (0–3) — broken or missing; the light is ON · 🟡 Yellow (4–7) — drift or gaps; schedule a fix · 🟢 Green (8–10) — healthy, no action needed · **N/I** — not inspected (no evidence access; never guessed)

## Evidence basis

- Access used this pass: design library **live** (one Figma MCP call: page list), code **live** (repo), docs **live** (Storybook dev server, its MCP endpoint, Playwright), process **live** (`gh`, git, CI files).
- Findings tagged `[verified]`: 57 · `[reported]`: 2
- The Figma side was read at page level only (one call, by agreement with the maintainer): component structure, variables and naming inside the file were not inspected.
- Stations 9 and 10 ran without the full agent generation test through the MCP; neither is scored green.
- The previous scores were visible in `GARAGE.md` before this pass started, so evidence gathering was not fully blind to them.

## Station records

### Station 1 — Coverage & gaps: YELLOW (6/10)

- Inventory: 2 in design · 27 in code · 27 documented, plus 22 patterns (sampled: whole library)
- Evidence level: design live (page list), code live, docs live
- Findings:
  - [verified] Code and docs are even: every component in `ui/` has a Storybook page; 26 of 27 have a test file (`VisuallyHidden` is docs-only on purpose).
  - [verified] The design leg is badly uneven: Figma has pages for `Button` and `Icons` only — 25 coded components have no design counterpart.
  - [verified] Staples present: button, link, input set (text, select, checkbox, radio, switch, textarea, search), form validation pattern, card, dialog, alert, toast, tooltip, badge, chip, pagination, breadcrumb, navigation pattern, skeleton, empty and error states, list, skip link.
  - [verified] Staples missing against the core set and comparable systems (benchmarked from the agent's own knowledge of Material, Carbon, Polaris, Primer — no design-systems MCP connected): table, tabs, accordion, avatar, menu / dropdown action, popover, combobox, sheet, alert dialog, date picker, stepper, and a loading state on `Button`. The Patterns overview already lists six of these.
  - [verified] Tokens complete and tiered: colour, typography, spacing, size, radii, shadow, border width, motion, layer, focus; tier 1 → 2 → 3 enforced by `tokens.tiers.test.ts`; no hex values in component CSS.
  - [verified] No distributed artifact: the system is a folder inside the app repo, not a package. Fine for one consumer, but the app does not import it yet (see Station 8).
- Not inspected: states and variants inside the Figma file.
- Deviations noted: code is canonical; Figma follows by hand on the Starter plan.
- First move: rank the missing staples by what the app actually renders (Table, Tabs, Sheet, Popover first), and decide the Figma plan (Station 6).

### Station 2 — Best practices: GREEN (8/10)

- Sampled: `Button`, `List`, `SkipLink`, `Dialog`, `Select` (source, CSS, stories); docs pages for List, SkipLink, VisuallyHidden; `AGENTS.md` as the house standard.
- Evidence level: code live, docs live, design not inspected
- Findings:
  - [verified] [industry] Semantic elements throughout (`<button>`, `<a>`, `<ul role="list">`, Radix primitives for complex widgets); server components wherever no client React is needed.
  - [verified] [format] Logical properties are the rule: 147 logical declarations vs 8 physical ones, all 8 in `Button.module.css` (`min-height` / `min-width`).
  - [verified] [org] No magic numbers: component CSS reads tier-2/3 tokens only; Stylelint fails on unknown or tier-1 tokens. The only raw pixel values outside comments are breakpoints (`639px` / `640px` in Dialog and Toast) — there are no breakpoint tokens.
  - [verified] [format] Docs follow one structure per component (description, Best Practices, Key Features, a story per variant, recipes) and per pattern (What It Solves, When to Use, Anatomy, Accessibility, In the App).
  - [verified] [org] House conventions are written down (`AGENTS.md`) and largely machine-enforced (ESLint, Stylelint, token tests, commitlint).
  - [verified] [industry] API drift: `Button`, `Badge` and `Chip` require `size`, `variant` and `appearance`, while the other 17 sized components default `size` to `md`.
- Not inspected: Figma craft (auto layout, layer names, variable binding).
- Deviations noted: none.
- First move: add breakpoint tokens, and give `Button` / `Badge` / `Chip` the same defaults as the rest (or document why they are required).

### Station 3 — Accessibility: GREEN (8/10)

- Sampled: all 27 component test files, `tokens.contrast.test.ts`, `.storybook/preview.tsx`, CI workflow; keyboard checks in the browser for SkipLink, Icon Toolbar, Dialog-based patterns.
- Evidence level: code live, docs live
- Findings:
  - [verified] Every component test file runs `jest-axe`; Storybook runs axe on every story with `test: 'error'`, in CI.
  - [verified] Contrast is validated from tokens in 22 groups, including hover, disabled and focus states (WCAG 1.4.3, 1.4.11). There is one theme, so there is no dark-mode gap to miss.
  - [verified] Keyboard behaviour is asserted in 11 component test suites and in hidden interaction stories (focus return after dialogs, roving focus in the toolbar, skip link).
  - [verified] `forced-colors` handled in 19 stylesheets and `prefers-reduced-motion` in 18.
  - [verified] Per-component accessibility notes in docs, and every pattern has an Accessibility section.
  - [verified] No screen-reader test plan anywhere in the repo (VoiceOver / NVDA checklists).
  - [verified] Org-level accessibility guidance lives in `AGENTS.md` (WCAG 2.2 AA rules) but has no Storybook page a product engineer would find.
- Not inspected: real screen-reader runs; Safari (WebKit is not installed for Playwright here).
- Deviations noted: none.
- First move: write a short screen-reader test plan for the interactive components (VoiceOver + Safari, NVDA + Firefox) and run it once per release.

### Station 4 — Shared language: GREEN (8/10)

- Sampled: every `*.types.ts` in `ui/` (full sweep), token file names and tiers.
- Evidence level: code live, design not inspected
- Findings:
  - [verified] One size scale everywhere (`sm` / `md` / `lg`, with `xs` only on Button and Icon); one variant vocabulary (`primary`, `secondary` and the four utility variants from `UTILITY_VARIANTS`).
  - [verified] One change-callback convention (`onValueChange`, `onCheckedChange`, `onSelectedChange` — Radix style); one icon convention (registry names through `icon` / `iconStart` / `iconEnd`).
  - [verified] Tokens are named by role at the semantic tier (`semantic.colour.text.brand.base`, not `sage-700`), with a single scheme across 42 token files.
  - [verified] Guardrails exist for tokens (Stylelint, `tokens.tiers.test.ts`, `tokens.usage.test.ts`) but not for prop names — consistency there depends on review and `AGENTS.md`.
  - [verified] Mild overloading: `appearance` means fill/outline/ghost on Button, raised/outline on Card, plain/outline on List and inline/standalone on Link — the same word, consistent intent (look), different value sets.
- Not inspected: design ↔ code name tracing (Figma read at page level only).
- Deviations noted: none.
- First move: when the Figma components are built, mirror the code prop names and values exactly, and record the mapping (Station 6).

### Station 5 — Testing & validation: YELLOW (7/10)

- Sampled: `.github/workflows/ci.yml`, `.husky/pre-commit`, tests of List, Dialog, SkipLink, Select.
- Evidence level: code live, process live
- Findings:
  - [verified] CI runs on every PR and push to `main`: Prettier, ESLint, Stylelint, `tsc`, `tokens:check`, Jest (1184 tests), Storybook interaction + a11y tests (270), and the production build.
  - [verified] Tests assert behaviour, not just rendering: focus movement, keyboard paths, live-region text, accessible names and descriptions.
  - [verified] `main` has no branch protection and no rulesets (`gh api …/branches/main/protection` → 404, rulesets `[]`): CI can be bypassed by merging a red PR or pushing to `main`.
  - [verified] No visual regression: no Chromatic, Percy or screenshot assertions. The August record mentioned Chromatic; it is not in `package.json` today.
  - [verified] AI writes much of the system, but there are no evals: quality rests on the lint and test gates plus human review.
- Not inspected: test coverage percentages.
- Deviations noted: none.
- First move: protect `main` — require the three CI jobs to pass and changes to arrive through a PR.

### Station 6 — Orchestration: YELLOW (4/10)

- Sampled: token pipeline, Storybook autodocs vs component types, Figma page list, `AGENTS.md` / README / Storybook copy.
- Evidence level: design live (page level), code live, docs live
- Findings:
  - [verified] Tokens have one source of truth: JSON → Style Dictionary → `tokens.css` and `tokens.docs.json`, checked in CI (`tokens:check`) and by the pre-commit hook.
  - [verified] Code and docs are coupled: Storybook pages are written next to each component and render the real component; Foundation pages read `tokens.docs.json` instead of copying values.
  - [verified] Design and code describe different systems in breadth: Figma has `Button` and `Icons`; code has 27 components and 22 patterns. Nobody would build a new screen from the Figma file today.
  - [reported] Design variables are not generated from the token JSON; the Figma file is built by hand when MCP calls allow (memory of earlier sessions, not re-checked this pass).
  - [verified] No sync mechanism between design and code: Code Connect is not available on the plan; no drift check.
  - [verified] Some guidance is copied rather than linked: the same rules appear in `AGENTS.md`, the design-system README and Storybook descriptions, kept in step by hand.
- Not inspected: Figma variables and component properties.
- Deviations noted: code is canonical by decision (Starter plan limits).
- First move: decide the design leg's role. Either commit to a Figma catch-up order (Typography, inputs, Dialog first), or record "code is the source of truth; Figma holds brand and exploration only" as a documented deviation so the gap stops being drift.

### Station 7 — Governance & version control: YELLOW (7/10)

- Sampled: last 14 PRs, git tags, `CHANGELOG.md`, `.release-it.mjs`, `AGENTS.md` Git rules, repository settings.
- Evidence level: process live
- Findings:
  - [verified] Every change of the last week went through a PR; Conventional Commits are enforced by commitlint; release-it writes versions, tags and the changelog (6 releases, v0.1.0 → v0.6.0).
  - [verified] The changelog now lists documentation as well as features and fixes (`.release-it.mjs`, 2026-11-18).
  - [verified] One breaking change shipped without a `BREAKING CHANGE` note (icon props become names, v0.5.0); accepted with no consumer, but there is no written deprecation or migration policy for when there is one.
  - [verified] No CONTRIBUTING guide, PR template or issue templates; the issue tracker is unused.
  - [verified] The roadmap lives in `src/PLANNING.md`, which is git-ignored: nobody but the maintainer (and agents on that machine) can see it.
  - [verified] Ownership is clear: one maintainer, with working agreements in `AGENTS.md`.
  - [verified] No branch protection (see Station 5).
- Not inspected: —
- Deviations noted: solo team — contribution docs matter less today than they will.
- First move: protect `main`, then add a short deprecation and breaking-change policy to `AGENTS.md`.

### Station 8 — Feedback & adoption: YELLOW (4/10)

- Sampled: imports of `design-system` across `src/` outside the design system; legacy component folders.
- Evidence level: code live
- Findings:
  - [verified] Adoption is zero: no file in the app imports from the design system.
  - [verified] Parallel implementations exist: legacy `atoms/` Badge, Button, Input, Select, Skeleton, SkipLink, and `molecules/` / `organisms/` versions of EmptyState, Pagination, Breadcrumbs, FilterBar, ProductCard, Footer, Navbar.
  - [verified] The system is not detached from the product: the patterns were built from the app's own organisms (FilterBar, SearchResults, ProductCard, ProductDetail, Navbar, Footer), so the migration targets are already mapped.
  - [verified] No usage analytics and no feedback channel — expected for one maintainer and one consumer.
  - [verified] The inspection is not on a schedule yet: this is the second one, 3.5 months after the first.
- Not inspected: —
- Deviations noted: adoption is deferred on purpose until the component set is finished (`AGENTS.md`). The score reflects the risk of that plan having no end date, not the deferral itself.
- First move: write the migration plan — the order in which legacy components are replaced, the "finished" bar that starts it, and the first candidates (SkipLink and Pagination are drop-in).

### Station 9 — Machine-readable docs & context: YELLOW (7/10, provisional)

- Sampled: token outputs, `*.types.ts`, `AGENTS.md`, story descriptions, Storybook MCP `docs-show` output for List.
- Evidence level: code live, docs live
- Findings:
  - [verified] Tokens are machine-consumable (JSON source, CSS custom properties, `tokens.docs.json`).
  - [verified] Component APIs are typed with JSDoc, and accessibility rules are encoded as TypeScript discriminated unions (an `error` is required when `invalid`).
  - [verified] `AGENTS.md` is a real rules file: tiers, focus, layers, icons, patterns, testing, with anti-patterns stated as rules ("never use `aria-label` alone").
  - [verified] Docs follow a fixed structure per component and per pattern, which an agent can navigate.
  - [verified] No index for agents: no `llms.txt`, no component metadata as data (purpose, anti-patterns, composition) — that knowledge lives in prose inside stories.
  - [verified] The Storybook MCP's docs output carries story code only: no component description, no Best Practices, no props table.
- Not inspected: the generation test through the MCP alone.
- Deviations noted: none.
- First move: run the generation test — have an agent with only the MCP build a small settings form — and note every stumble.

### Station 10 — Agent access: YELLOW (6/10, provisional)

- Sampled: `claude mcp list`, `.storybook/main.ts`, live calls to `http://localhost:6006/mcp`.
- Evidence level: docs live, process live
- Findings:
  - [verified] `@storybook/addon-mcp` is live on the dev server with 8 tools (`docs-list`, `docs-show`, `stories-preview`, `test-run`…); `docs-list` returned every component and page.
  - [verified] It is not registered in Claude Code (`claude mcp list` shows Figma and claude.ai servers only), and it only exists while `npm run storybook` is running.
  - [verified] Its examples import from `'fitmyspace'` — the package name, which is not an importable path; the real path is `@/components/design-system/ui/<Name>`. An agent following it writes broken imports.
  - [verified] Inside this repo, agents do produce on-system work through `AGENTS.md` (this week's 22 patterns pass every lint and token gate) — but that path depends on reading source files, not on a designed access surface.
  - [reported] Figma MCP is connected, but the plan's call budget and the missing Code Connect keep design-to-code flows off the system.
  - [verified] Repeatable AI workflows are informal: the inspection skill lives in a git-ignored `.agents/` folder, and there is no shared list of tasks agents are trusted with.
- Not inspected: an end-to-end page rebuild through the MCP alone.
- Deviations noted: Figma Organization plan is not an option.
- First move: register the Storybook MCP in Claude Code and fix the import path it reports, then run the live rebuild test.

## What changed since last inspection

|   # | Station                         | 2026-08-04 | 2026-11-18 | Move |
| --: | :------------------------------ | ---------: | ---------: | ---: |
|   1 | Coverage & gaps                 |       2/10 |       6/10 |   +4 |
|   2 | Best practices                  |       9/10 |       8/10 |   −1 |
|   3 | Accessibility                   |       9/10 |       8/10 |   −1 |
|   4 | Shared language                 |      10/10 |       8/10 |   −2 |
|   5 | Testing & validation            |       6/10 |       7/10 |   +1 |
|   6 | Orchestration                   |       8/10 |       4/10 |   −4 |
|   7 | Governance & version control    |       5/10 |       7/10 |   +2 |
|   8 | Feedback & adoption             |       2/10 |       4/10 |   +2 |
|   9 | Machine-readable docs & context |       5/10 |       7/10 |   +2 |
|  10 | Agent access                    |       7/10 |       6/10 |   −1 |
|     | **Overall**                     | **63/100** | **65/100** |   +2 |

- **Lights turned off:** Station 1 (red → yellow: 2 → 27 components); Station 8 (red → yellow, with the deferral recorded as intentional and the migration targets mapped).
- **CI arrived:** the August "no remote CI" finding is closed — CI now runs every gate on every PR. The new finding is that nothing _requires_ it (no branch protection).
- **Agent context arrived:** `AGENTS.md` now exists (an August first move); `llms.txt` and structured metadata are still open.
- **Why some scores fell:** the frame changed (August assumed 20 product teams; it is one product) and this pass verified things August could not: the Figma file was read live (Station 6 falls from an unverified 8 to a verified 4), and the Storybook MCP was called live (Station 10 found the broken import path). Stations 2–4 fell by small margins on newly sampled drift (required props, breakpoints, no prop-name guardrail), not on regressions in the code.
- **Still open from August:** CONTRIBUTING / PR templates, feedback loop, Storybook MCP wiring, `llms.txt`.

## Next service

- Work order: `ds-inspection/work-orders/2026-11-18-work-order.md`
- Recommended cadence: deep inspection quarterly; everyday checks already in CI (lint, tokens, a11y, tests) — add branch protection and visual regression
- Re-inspect by: 2027-02-18
