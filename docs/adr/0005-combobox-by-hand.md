# 0005. `Combobox` written by hand on the ARIA pattern

- **Status:** Accepted
- **Date:** 2026-11-18

## Context

The design system builds on Radix whenever Radix has a primitive, and writes the behaviour by hand
when it does not (as `SearchField` does with `useControllableState`). Radix has no combobox. Headless
libraries (Downshift, React Aria) would add a second interaction model next to Radix.

## Decision

Write `Combobox` by hand on the WAI-ARIA APG combobox pattern (list autocomplete), with Radix
utilities for controlled state and refs, and the floating list on `semantic.layer.floating`.

## Consequences

- It is the last of the six missing components and the most expensive: keyboard model,
  `aria-activedescendant`, announcements of the result count.
- A screen-reader pass decides whether it holds; if it does not, a new ADR can move to a library.
