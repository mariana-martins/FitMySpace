# 0001. Code and Storybook are the design system's source of truth

- **Status:** Accepted
- **Date:** 2026-11-18

## Context

The Figma file (`2vgKu1CEc6b79vwFHLYcFM`) has the `Button` and `Icons` pages against 27 coded
components, and it is stale on the `ghost` appearance, the success palette, the Button heights and
the token expansion. The account is on the free Starter plan: the Figma MCP allows a few calls
before it blocks, upgrading is not an option, and Code Connect is unavailable. The 2026-11-18
inspection scored Orchestration 4/10 because the gap counted as drift.

## Decision

Code and the published Storybook are the source of truth. Figma holds brand and exploration and is
not expected to mirror every component.

## Consequences

- A component missing from Figma is not drift; inspections read this as an intentional deviation.
- Catching Figma up is optional, done in batches when there is a reason, in the order Typography,
  Input / TextField / Select, Dialog, List, Card, with prop names mirrored from the code.
- Design review happens in Storybook.
