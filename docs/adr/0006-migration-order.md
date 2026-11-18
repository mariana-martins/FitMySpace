# 0006. Migrate one component across the whole app at a time

- **Status:** Accepted
- **Date:** 2026-11-18

## Context

The app does not consume the design system yet, and the migration starts only once every planned
component exists. The legacy components overlap one by one with the design system's, and the
Patterns already mirror the app's organisms.

## Decision

Replace one legacy component across the whole app per pull request, in this order: the drop-in ones
(SkipLink, Pagination, Breadcrumbs, EmptyState, Skeleton, Badge), then the forms (Button, Input,
Select, SearchInput / SearchBar, CustomLink), then the organisms the Patterns mirror (FilterBar,
ProductCard, SearchResults, Navbar, Footer, ProductDetail, PageLayout). A legacy component is deleted
in the PR where nothing imports it any more, never left beside its replacement.

## Consequences

- Each PR is small and reversible, and the app is never half on two versions of one component.
- The date of the first migration PR is set in the migration plan, written before it starts.
