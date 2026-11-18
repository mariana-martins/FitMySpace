# 0008. A small app E2E suite before the migration

- **Status:** Accepted
- **Date:** 2026-11-18

## Context

Step 9 (E2E) was planned after the migration. But the migration is what most needs a check that the
app's journeys still work, and jsdom never sees real focus, layout or URL state.

## Decision

Before the first migration PR, add Playwright E2E tests for four journeys: search, filter,
pagination, and the 404 of an unknown `/products/[id]`. Selectors use roles and accessible names,
so they survive the swap from a legacy component to a design-system one.

## Consequences

- Every migration PR runs the journeys in CI.
- The full E2E suite (Step 9) still comes after the migration.
