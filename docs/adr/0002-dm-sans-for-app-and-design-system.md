# 0002. DM Sans for the app and the design system

- **Status:** Accepted
- **Date:** 2026-11-18

## Context

The app renders Inter; the design system is built on DM Sans, which only Storybook loads (through
`@fontsource`). The typography tokens, line heights and control sizes were tuned on DM Sans, so
design-system components in the app would render in a font they were not designed for.

## Decision

DM Sans becomes the app's font, loaded with `next/font` before the migration starts. Inter goes.

## Consequences

- The typography family token points at the CSS variable `next/font` defines, so the app and
  Storybook share one source.
- The app's text changes look on the day the font switches, before any component migrates.
