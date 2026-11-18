# Work Order — FitMySpace Design System

_From inspection: `reports/2026-11-18-inspection.md` · Written: 2026-11-18_

Reds get fixed now. Yellows get scheduled. Greens get left alone (and celebrated). Every item cites its station and evidence — no vibes-based work items. The team owns prioritization; this is the technician's recommendation.

## 🔴 Fix now (reds)

No station is red this pass. The two lowest yellows (Stations 6 and 8, both 4/10) are one bad quarter away from red, so their first moves lead the schedule below.

## 🟡 Schedule (yellows)

### 1. Protect `main` so CI actually gates merges

- **Station:** 5, Testing & validation; 7, Governance · **Evidence:** [verified] `gh api …/branches/main/protection` → 404, rulesets `[]`
- **First move:** add a ruleset (or branch protection) on `main` requiring a PR and the three CI jobs ("Format, lint, types, tokens and unit tests", "Storybook interaction and a11y tests", "Next.js production build") to pass. Allow the maintainer to bypass for emergencies, logged.
- **AI assist:** an agent can draft the `gh api` call; the maintainer applies it (it changes repository settings).
- **Done when:** a PR with a failing job cannot be merged, and a direct push to `main` is refused.
- **Effort:** S · **Suggested timing:** this week

### 2. Decide the design leg's role, then act on it

- **Station:** 6, Orchestration; 1, Coverage · **Evidence:** [verified] Figma pages `Button`, `Icons` vs 27 coded components
- **First move:** choose one, in writing (`AGENTS.md` and `GARAGE.md`):
  - **Catch up:** a Figma build order (Typography, then Input / TextField / Select, Dialog, List, Card), batched into as few `use_figma` calls as the Starter plan allows, with prop names mirrored from code; or
  - **Code-first:** record "code and Storybook are the source of truth; Figma holds brand and exploration" as an intentional deviation, so the gap stops counting as drift.
- **AI assist:** the agent prepares batched Figma scripts from the code (as was done for Button); the choice is the maintainer's.
- **Done when:** the decision is written down, and either the first catch-up batch exists in Figma or the deviation is recorded.
- **Effort:** S to decide · L to catch up · **Suggested timing:** decide this sprint

### 3. Write the migration plan for the app

- **Station:** 8, Feedback & adoption · **Evidence:** [verified] 0 imports of the design system in `src/`; legacy `atoms/`, `molecules/`, `organisms/` duplicates
- **First move:** a short plan (in `docs/` or `PLANNING.md`): the "finished" bar that starts migration, the order (SkipLink and Pagination first — drop-in; then forms; then the organisms the patterns already mirror: FilterBar, ProductCard, SearchResults, Navbar, Footer), and how a legacy component is retired (removed, not left beside its replacement).
- **AI assist:** the agent maps each legacy component to its design-system equivalent and the props that change; the bar and the order are human calls.
- **Done when:** the plan exists with a date for the first migration PR.
- **Effort:** M · **Suggested timing:** this quarter

### 4. Make the Storybook MCP a real access surface

- **Station:** 10, Agent access; 9, Machine-readable docs · **Evidence:** [verified] not in `claude mcp list`; `docs-show` imports from `'fitmyspace'`, no description or props
- **First move:**
  1. Register it: `claude mcp add --transport http storybook http://localhost:6006/mcp` (works while `npm run storybook` runs).
  2. Fix the import path the manifest reports (the real one is `@/components/design-system/ui/<Name>`), and check whether the addon can include the component description and props table (component docgen / manifest options in `@storybook/addon-mcp`).
  3. Document both in `AGENTS.md`.
- **AI assist:** the agent can make the config change and verify it with a live `docs-show` call.
- **Done when:** `claude mcp list` shows `storybook`, and `docs-show` returns a correct import, the description and the props.
- **Effort:** S–M · **Suggested timing:** this sprint

### 5. Run the generation test, then add an agent index

- **Station:** 9, Machine-readable docs · **Evidence:** [verified] no `llms.txt`, no structured component metadata; generation test not run
- **First move:** give an agent only the Storybook MCP (no repo reading) and ask for a settings form and a product grid; log every wrong component, invented prop or hardcoded value. Then add an `llms.txt` (or a generated index) that lists each component with purpose, when not to use it, and its key props — generated from stories and types, not hand-written.
- **AI assist:** the agent runs the test and drafts the generator; the maintainer judges the stumbles.
- **Done when:** the test passes with minor stumbles at most, and the index regenerates in CI.
- **Effort:** M · **Suggested timing:** this quarter

### 6. Add visual regression

- **Station:** 5, Testing & validation · **Evidence:** [verified] no Chromatic, Percy or screenshot assertions in `package.json` or CI
- **First move:** screenshot assertions on a short list of stories (Button variants, Input states, List, Dialog, Toast) with the Playwright already in CI, or Chromatic's free tier; baseline committed.
- **AI assist:** the agent writes the screenshot tests; the maintainer approves baselines.
- **Done when:** a token change that shifts a colour or a size fails CI until the baseline is accepted.
- **Effort:** M · **Suggested timing:** this quarter

### 7. Fill the staple gaps, in the app's order

- **Station:** 1, Coverage & gaps · **Evidence:** [verified] missing table, tabs, accordion, avatar, menu, popover, combobox, sheet, alert dialog, date picker, stepper, Button loading state (the Patterns overview lists six)
- **First move:** rank them by what the app renders or will render (Table for store comparison, Tabs for the product page, Sheet for the phone menu and filters, Popover for desktop filters), then build one per cycle with Radix where it has a primitive.
- **AI assist:** gap analysis and first drafts in the system's shape; the ranking is the maintainer's.
- **Done when:** the top three are shipped and removed from the Overview's gap list.
- **Effort:** L · **Suggested timing:** next two quarters

### 8. Write the deprecation and breaking-change policy

- **Station:** 7, Governance · **Evidence:** [verified] v0.5.0 icon-prop change shipped without a `BREAKING CHANGE` note; no policy
- **First move:** add to `AGENTS.md`: every breaking change carries a `BREAKING CHANGE:` footer and a migration note; deprecations warn for one minor version before removal. Add a PR template with a "Breaking?" checkbox.
- **Done when:** the policy is in `AGENTS.md` and the PR template asks the question.
- **Effort:** S · **Suggested timing:** before the first app migration (item 3)

### 9. Small API and token tidy-ups

- **Station:** 2, Best practices; 4, Shared language · **Evidence:** [verified] `Button` / `Badge` / `Chip` require `size` / `variant` / `appearance` while 17 components default `size` to `md`; breakpoints `639px` / `640px` hard-coded in Dialog and Toast
- **First move:** give the three components the same defaults (or document why they are required), and add breakpoint tokens used by Dialog, Toast and future layout CSS.
- **Done when:** sized components share a default, and no raw pixel breakpoint remains in component CSS.
- **Effort:** S · **Suggested timing:** this quarter

### 10. A screen-reader test plan

- **Station:** 3, Accessibility · **Evidence:** [verified] no VoiceOver / NVDA plan in the repo
- **First move:** a one-page checklist per interactive component (what should be announced, in what order), run with VoiceOver + Safari and NVDA + Firefox before each minor release.
- **Done when:** the plan exists and the last release has a run recorded.
- **Effort:** M · **Suggested timing:** this quarter

## 🔧 Access upgrades (sharper next inspection)

- **Share the roadmap:** `src/PLANNING.md` is git-ignored. Moving its essentials into the repo (or into GitHub issues) lets the next inspection read the roadmap instead of inferring it.
- **Connect a design-systems knowledge MCP** so Station 1's benchmark becomes `[verified]`: `claude mcp add --transport http design-systems https://design-systems-mcp.southleft.com/mcp`.
- **Budget Figma calls for the inspection:** two or three `get_metadata` calls on the pages would let Stations 2, 4 and 6 inspect structure and names instead of the page list.
- **Install WebKit for Playwright** (`npx playwright install webkit`) so keyboard and skip-link checks also run in Safari's engine.

## 🟢 Keeping the greens green

- **Station 2, Best practices:** keep `AGENTS.md` as the single house standard and keep extending the lint rules when a convention is added (as with the `lucide-react` import rule).
- **Station 3, Accessibility:** add contrast pairs to `tokens.contrast.test.ts` with every new colour token, and keep the `test: 'error'` a11y setting — it is what makes the green real.
- **Station 4, Shared language:** check new component props against the existing vocabulary (`size`, `variant`, `appearance`, `on<Thing>Change`, icon names) in review; a small lint or test for prop names would make it automatic.

## Cadence

- Re-inspect (deep, all stations): 2027-02-18
- Everyday checks to wire into CI now: branch protection (item 1), visual regression (item 6), the agent index regeneration (item 5)
- Owner of this work order: Mariana · Review: at each release PR, check which items moved
