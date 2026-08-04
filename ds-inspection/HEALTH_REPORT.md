# Design system health report (How healthy is my design system?)

**Date:** 2026-08-04
**Assessment type:** Direct inspection (tokens, ui, package.json, git log, husky/commitlint/release-it configs)
**Library type:** Design system, early stage (3-tier tokens + semantic-release + commit linting = real process discipline, but tiny component surface)

> Note: no numeric scores are used below — status labels (🟢 Strong / 🟡 Functional / 🟠 Weak / 🔴 Absent) instead. Numeric scores invite false precision that this assessment can't actually back up.

---

## Overall health

| Dimension | Status | Key finding |
|---|---|---|
| Tokens | 🟢 Strong | Clean 3-tier architecture, semantic names encode intent not appearance |
| Components | 🟡 Functional | 1 component (Button) built to high bar; surface too small to judge distribution |
| Documentation | 🟢 Strong | Storybook autodocs, best-practice notes, foundation token docs — no separate contribution docs |
| Adoption | 🔴 Absent | Zero references to design-system components anywhere in `src/app` |
| Governance | 🟡 Functional | Commit lint + semantic-release + pre-commit test hook wired; no CI, no CONTRIBUTING/deprecation policy |
| AI readiness | 🟠 Weak | No manifest, no six-section descriptions — but token/type structure gives good extraction material |
| Platform maturity | 🟠 Weak | No CI pipeline; no components beyond Button to version/break yet, so low current risk |

**Maturity stage:** Managed — tokens and Button component already hit Systematic-level rigor (enforced a11y via types, tested, documented), but process breadth (governance, CI, adoption) lag behind token/component build quality. Next stage needs: CI pipeline enforcing lint/test/build, and first real consumer wiring in `src/app`.

---

## Summary

Foundation (tokens + Button) built to unusually high standard for solo/early-stage work — semantic token naming, discriminated-union types enforcing a11y, tested stories with play functions. Real gap: nothing in the app consumes it yet. System risk isn't quality, it's that all this investment sits unused — worth wiring Button/Typography into `src/app` soon before more components get built on an unproven foundation.

---

## Dimension findings

**🟢 Tokens** — 3 tiers (primitive/semantic/component) all present, Style Dictionary single source of truth, `tokens.css` auto-generated (not hand-edited). Semantic tier names by intent (`background.brand`, `utility-error`) not appearance — this is exactly what AI tooling and future devs need. Component tier only covers Button (expected — only component built).

**🟡 Components** — Button: discriminated union forces `aria-label` on icon-only variants (compile-time a11y), `asChild`/Radix Slot pattern, disabled-state handling, 337-line test file, stories with `play` assertions and pseudo-state coverage. Typography (Heading/Text/Label/Caption) same care, `Label` similarly enforces `htmlFor` via discriminated union when `as="label"`. Gap: nothing past text-primitives + one interactive component — no Input, Card, Modal. Not a defect at this stage, just the ceiling on usefulness right now.

**🟢 Documentation** — Storybook autodocs with best-practices, key-features, anti-pattern-adjacent guidance ("only one primary button visible at a time") baked into component descriptions. Foundation stories (Color/Radii/Spacing) render live token swatches with copy-to-clipboard. README explains structure and build commands clearly. Missing: no CONTRIBUTING.md or written contribution/decision criteria.

**🔴 Adoption** — `grep` across `src/app` and `src/components` (excluding design-system itself) found zero imports of design-system components. System exists in isolation from the product it's meant to serve. Not a quality problem — a sequencing one. Flag before building component #3.

**🟡 Governance** — Real automation present: `commitlint.config.js`, `.release-it.json`, husky `pre-commit` running `npm test`, husky `commit-msg` linting commits, scoped semantic-release (confirmed via git log: version reset to 0.0.0, scoped changelog to design-system path). No `.github` directory — none of this runs in CI, only locally, meaning it's bypassable and not visible to any future collaborator. No documented deprecation or contribution process (fine solo, becomes a gap the day a second contributor shows up).

**🟠 AI readiness** — No component manifest (JSON), no six-section AI descriptions, no Figma MCP integration found. Upside: TypeScript prop types are precise enough (discriminated unions, exact variant unions) that manifest generation later would be mostly mechanical extraction, not authoring from scratch.

**🟠 Platform maturity** — No CI enforcing the local hooks. No semver applied at component level yet (nothing to version independently — only Button exists). Low current risk since there are no external consumers to break, but this needs solving before adoption starts, not after.

---

## Prioritised action list

**Immediate (next 4 weeks)**
- Wire Button/Typography into at least one real screen in `src/app` — proves the system works under real usage before more components get built on it
- Add CI (GitHub Actions) running `npm test`, `npm run lint`, `npm run build-storybook` on PRs — hooks that only run locally aren't governance, they're a suggestion

**Near-term (next quarter)**
- Write a short CONTRIBUTING.md: what belongs in the system vs. stays local, even if it's 10 lines for an audience of one (future you, or a future collaborator)
- Build 2-3 next components (Input, Card) at the same bar as Button — validates whether the pattern (discriminated-union a11y, token-driven CSS modules) scales past one component

**Longer-term (6+ months)**
- Component manifest (JSON) once component count justifies it — Button's type precision means this will be cheap to generate later
- Six-section AI descriptions if/when Figma MCP or AI-assisted consumption becomes part of the workflow

---

**A note on context:** This assessment sees your system's artefacts — it does not see the history, constraints, or trade-offs behind them. Some findings may flag gaps your team has already considered and accepted. If any finding describes an intentional decision or a known limitation, that's worth telling future assessments to calibrate to the system's actual priorities rather than a generic ideal.

**Scope:** Inspected `tokens/`, `ui/`, README, root `package.json`, git log for the design-system path, `.husky/`, `commitlint.config.js`, `.release-it.json`. Searched `src/app` and `src/components` for design-system imports. Did not inspect Figma files, external docs (Notion/Zeroheight), or any CI config outside `.github` (none found).
