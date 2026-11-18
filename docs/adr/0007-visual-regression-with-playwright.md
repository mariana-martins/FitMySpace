# 0007. Visual regression with Playwright

- **Status:** Accepted
- **Date:** 2026-11-18

## Context

No check fails when a token change shifts a colour or a size. Chromatic was removed in the
2026-11-06 audit's tooling phase; Playwright is already installed and runs the Storybook tests in CI.

## Decision

Screenshot assertions with Playwright on a short list of stories, with the baseline images
generated on the CI's Linux runner, so font rendering on macOS never fails the run.

## Consequences

- No external service or account; the baseline lives in the repo.
- Updating a baseline is a deliberate step in the PR that changes the look.
