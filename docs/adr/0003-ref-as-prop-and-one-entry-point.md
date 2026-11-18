# 0003. `ref` as a prop and one entry point, before the new components

- **Status:** Accepted
- **Date:** 2026-11-18

## Context

The 2026-11-06 audit left two pre-migration refactors for the very end: replacing `forwardRef` with
`ref` as a prop (React 19), and a root `index.ts` with a lint rule against deep imports. Six
components are still to be built; left for the end, each of them would be written with
`forwardRef` and then rewritten.

## Decision

Do both now, before the six components: every component takes `ref` as a regular prop, and the app
imports the design system only through `src/components/design-system/index.ts`.

## Consequences

- New components are born on the React 19 pattern and add one line to the root barrel.
- `AGENTS.md` changes its "Forward refs" rule to `ref` as a prop.
- The app imports nothing yet, so the deep-import rule breaks nothing today.
