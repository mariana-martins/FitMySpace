# Design system health report (How healthy is my design system?)

Your system has grown from one component into a real design system in three and a half months, and the craft held up: tokens, components and docs are strong and CI enforces them. The risk has moved — it is no longer _what's built_ but _who uses it_: the app imports nothing from it, the Figma library covers two of 27 components, and nothing yet says how or when that changes. Here's the dimension-by-dimension picture.

**Date:** 2026-11-18
**Assessment type:** Direct inspection (repo, Storybook dev server and its MCP endpoint, GitHub via `gh`, one Figma MCP call)
**Library type:** Design system — three-tier tokens, 27 components, a documentation site with patterns, versioned releases and a changelog
**Previous assessment:** 2026-08-04 · Companion report: `ds-inspection/reports/2026-11-18-inspection.md` (10-station inspection, same day)

> Note: no numeric scores are used below — status labels (🟢 Strong / 🟡 Functional / 🟠 Weak / 🔴 Absent) instead. Numeric scores invite false precision that this assessment can't actually back up.

---

## Overall health

| Dimension         | Status        | Key finding                                                                                                     |
| ----------------- | ------------- | --------------------------------------------------------------------------------------------------------------- |
| Tokens            | 🟢 Strong     | Three tiers enforced by tests, role-based names, one source checked in CI; only breakpoints escape the tokens   |
| Components        | 🟢 Strong     | 27 components on one API contract with typed props and full state coverage; breadth gaps remain (table, tabs…)  |
| Documentation     | 🟢 Strong     | Every component and pattern documented in one structure; contribution and a11y guidance live only in AGENTS.md  |
| Adoption          | 🔴 Absent     | The app imports nothing from the system; legacy components run in parallel; Figma has 2 of 27 components        |
| Governance        | 🟡 Functional | PRs, CI, commitlint and release-it are real; no deprecation policy, no branch protection, decisions unrecorded  |
| AI readiness      | 🟡 Functional | AGENTS.md, typed APIs and token JSON are good material; the Storybook MCP serves story code with a wrong import |
| Platform maturity | 🟠 Weak       | Semver tags and a changelog exist, but no package, no version pinning and one breaking change with no migration |

**Maturity stage:** Systematic (early) — the three-tier token architecture is enforced, components follow one API contract, docs follow a standard format and releases are versioned; the contribution and deprecation processes are not yet written down. To reach **Measured**, the system needs adoption tracked (even a script counting imports), recurring reviews on a cadence (this is the second, so the habit is forming) and decisions recorded somewhere shared.

---

## Summary

The building blocks are in better shape than most systems this size: the August gaps in components, CI and agent context have all closed, and every gate (lint, tokens, a11y, contrast, tests, build) runs on every PR. What hasn't moved is adoption — still absent, by your own deliberate choice to finish components before migrating — and that choice now needs an end date and an order, because each new component makes the eventual migration bigger. The second thing to watch is that the design library and the code have become two different systems.

---

## Dimension findings

### 🟢 Tokens

- 1,284 tokens across 9 tier-1, 10 tier-2 and 23 tier-3 files, built by Style Dictionary into `tokens.css` and `tokens.docs.json`. `tokens:check` fails CI if the generated files drift from the JSON, and `tokens.tiers.test.ts` fails if tier 3 references tier 1.
- Semantic tokens are named by role (`semantic.colour.text.brand.base`, `semantic.layer.toast`), and Stylelint rejects any unknown or tier-1 token in component CSS. No hex values were found in component stylesheets.
- The one escape: breakpoints are raw pixels (`639px` / `640px` in Dialog and Toast) — there are no breakpoint tokens.
- **Action:** add breakpoint tokens before the next responsive component (Sheet) multiplies the raw values.

### 🟢 Components

- 27 components in `ui/`, mostly foundational (Button, Input, Checkbox, Link…), with field wrappers (TextField, SelectField, TextareaField) and overlays (Dialog, Tooltip, Toast) as the compound layer. Feature-level composition lives in 22 stories-only patterns rather than components — a healthy split.
- The boundary is documented (presentational only, data in through props, events out through callbacks), and every API is typed; accessibility rules are encoded as discriminated unions (`error` required when `invalid`).
- States are covered in code and docs (pseudo-state stories for hover, active, focus and disabled), and every interactive component has keyboard tests.
- Inconsistency: `Button`, `Badge` and `Chip` require `size`, `variant` and `appearance`, while the other 17 sized components default `size` to `md`.
- Breadth gaps against comparable systems: table, tabs, accordion, avatar, menu, popover, combobox, sheet, alert dialog, date picker, and a loading state on Button. The Patterns overview already tracks six of them.
- **Action:** rank the gaps by what the app renders today — Table, Tabs, Sheet and Popover cover the store comparison, product page, phone menu and desktop filters.

### 🟢 Documentation

- Every component has a Storybook page with Best Practices, Key Features, a story per variant and recipes; every pattern has What It Solves, When to Use (including what it's _not_ for), Anatomy, Accessibility and In the App. A new reader can navigate by Introduction → Foundation → Components → Patterns.
- Docs change in the same PR as the code (the convention in `AGENTS.md`), and the Changelog page renders the generated `CHANGELOG.md`.
- The contribution process, the accessibility guidance and the house rules exist only in `AGENTS.md` — written for agents, not visible in Storybook where a product engineer would look.
- Some guidance is copied between `AGENTS.md`, the design-system README and story descriptions, kept in step by hand.
- No process for flagging documentation gaps (the GitHub issue tracker is unused).
- **Action:** add a short "Contributing and accessibility" page to Storybook that links to `AGENTS.md` instead of copying it.

### 🔴 Adoption

- No file in the app imports from `src/components/design-system` (coverage exists; use does not).
- Parallel solutions: legacy `atoms/` Badge, Button, Input, Select, Skeleton and SkipLink, and legacy EmptyState, Pagination, Breadcrumbs, FilterBar, ProductCard, Footer and Navbar all render the live app.
- Design-side adoption is thin: the Figma library has pages for `Button` and `Icons` only.
- This is an intentional deviation (`AGENTS.md`: no migration until the component set is finished), and the patterns already map each legacy organism to its replacement. The gap is that "finished" has no definition and the migration has no order or date.
- **Action:** write the migration plan — the bar that starts it, the order (SkipLink and Pagination are drop-in), and how legacy components are retired rather than left beside their replacements.

### 🟡 Governance

- One clear owner. Every change in the last week went through a PR, with CI, commitlint and the pre-commit hook; release-it produces semver tags and a changelog that now includes documentation.
- `main` has no branch protection and no rulesets: the CI exists but nothing requires it to pass before a merge.
- No deprecation policy, and one breaking change (icon props became names in v0.5.0) shipped without a `BREAKING CHANGE` note — accepted with no consumer, but there is no rule for when there is one.
- Decisions are not recorded where anyone else can read them: the design-system roadmap lives in `src/PLANNING.md`, which is git-ignored, and `docs/ROADMAP.md` covers the app only.
- For a solo maintainer a full governance framework would be overhead; the gaps that matter are the gate on `main` and the breaking-change rule.
- **Action:** protect `main` (require a PR and the three CI jobs), and add a breaking-change and deprecation rule to `AGENTS.md`.

### 🟡 AI readiness

- `AGENTS.md` is a strong rules file: tiers, layers, focus, icons, patterns and testing, with anti-patterns stated as rules. Inside this repo, agents produce on-system work — this week's 22 patterns pass every lint and token gate.
- Token files are machine-readable (JSON, CSS custom properties, `tokens.docs.json`), but intent descriptions cover 65 of 252 semantic tokens and 46 of 892 component tokens.
- `@storybook/addon-mcp` is live on the dev server (8 tools; `docs-list` returns every page), but it is not registered in Claude Code, it serves story code without the component description or props, and its examples import from `'fitmyspace'` — not an importable path.
- No component manifest with purpose, anti-patterns and composition rules as data, and no `llms.txt`; component descriptions do not follow the six-section format. Figma descriptions cannot be in sync with code while the Figma file has two components.
- **Action:** register the Storybook MCP and fix its import path, then generate a manifest (purpose, when not to use, key props) from stories and types so an agent with only the MCP can pick and configure components.

### 🟠 Platform maturity

- Semantic versioning with tags (v0.1.0 → v0.6.0) and a generated changelog; releases are frequent (six in eight days) rather than on a plannable cadence.
- The system is a folder inside the app, not a package: consumers cannot pin a version, and nothing yet treats it as infrastructure.
- The last breaking change shipped with no migration path or blast-radius note.
- No support expectations — reasonable for one maintainer and one consumer.
- At this stage, platform investment would be premature; the item worth doing now is the breaking-change rule (see Governance), so the habit exists before the first migration.
- **Action:** revisit packaging and version pinning only when a second consumer appears.

---

## Health trend

| Dimension         | 2026-08-04    | 2026-11-18    | Direction                                           |
| ----------------- | ------------- | ------------- | --------------------------------------------------- |
| Tokens            | 🟢 Strong     | 🟢 Strong     | Steady                                              |
| Components        | 🟡 Functional | 🟢 Strong     | Improved — 1 → 27 components on the same bar        |
| Documentation     | 🟢 Strong     | 🟢 Strong     | Steady — now with patterns and a changelog page     |
| Adoption          | 🔴 Absent     | 🔴 Absent     | Steady — still deferred by design                   |
| Governance        | 🟡 Functional | 🟡 Functional | Steady — CI arrived; branch protection still absent |
| AI readiness      | 🟠 Weak       | 🟡 Functional | Improved — AGENTS.md exists; MCP live but unwired   |
| Platform maturity | 🟠 Weak       | 🟠 Weak       | Steady                                              |

System health is improving since 2026-08-04: two dimensions moved up, none regressed. Maturity moved from Managed to early Systematic.

---

## Prioritised action list

**Immediate (next 4 weeks)**

1. Protect `main`: require a PR and the three CI jobs — the gates exist, but nothing makes them binding.
2. Write the migration plan for the app: the "finished" bar, the order, the first two candidates, and a date.
3. Decide the role of the Figma library: catch up in a set order, or record "code is the source of truth" as a deliberate choice.
4. Register the Storybook MCP in Claude Code and fix the import path it reports.

**Near-term (next quarter)**

5. Add a breaking-change and deprecation rule to `AGENTS.md`, plus a PR template that asks "Breaking?".
6. Generate a component manifest (purpose, when not to use, key props, a11y contract) and an `llms.txt` from stories and types; add intent comments to the remaining semantic tokens.
7. Build the top staple gaps for the app: Table, Tabs, Sheet, Popover.
8. Add visual regression on a short list of stories, and breakpoint tokens.
9. Add a Storybook page for contributing and accessibility that links to `AGENTS.md`.

**Longer-term (6+ months)**

10. Run the migration: replace legacy components and delete them, tracking adoption with a script that counts design-system imports in CI.
11. Record decisions where they can be read (ADRs in the repo or GitHub issues) instead of a git-ignored planning file.
12. Package and version the system once a second consumer exists.

---

## Scope

- **Inspected:** `src/components/design-system/` (components, types, CSS, tests, stories, tokens), `.storybook/`, `.github/workflows/`, `AGENTS.md`, `CHANGELOG.md`, `.release-it.mjs`, imports across `src/`, the Storybook MCP endpoint, GitHub branch protection, rulesets and PRs, and the Figma file's page list.
- **Not inspected:** inside the Figma pages (structure, variables, descriptions); `src/PLANNING.md` contents; npm download data (not published).
- **Assumptions:** one maintainer and one consumer, as confirmed for the inspection on the same day; the 10-station inspection's findings were reused where they overlap.

> **A note on context:** This assessment sees your system's artefacts — it does not see the history, constraints, or trade-offs behind them. Some findings may flag gaps your team has already considered and accepted. If any finding describes an intentional decision or a known limitation, let me know — I'll calibrate future assessments to your system's actual priorities rather than a generic ideal. The goal is to surface blind spots, not to question choices you've already made deliberately.
