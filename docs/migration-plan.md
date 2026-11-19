# Migrating the app onto the design system

How the app's legacy components (`src/components/atoms`, `molecules`, `organisms`, `templates`)
are replaced by the design system (`src/components/design-system`). The decisions behind it are in
[ADR 0006](adr/0006-migration-order.md) (one component across the whole app at a time) and
[ADR 0008](adr/0008-e2e-before-migration.md) (the journeys run on every migration PR).

## When it starts

When the pre-migration work (phase 5) is on `main`. There is no date: this is a personal project,
and the order below matters more than the calendar.

## What "finished" means for the component set

The set is finished when every step below has a design-system component or pattern to move onto.
That is true today: 32 components and 22 patterns. `Table` is not part of it. Store Offers is laid
out with `List` until a page needs columns, and `Table` waits for that page.

## Before the first PR

These are already in place:

- The app loads `tokens.css` before `globals.css` (`src/app/layout.tsx`).
- DM Sans comes from `next/font` (`src/app/fonts.ts`), in the app and in Storybook. The
  `font.family.sans` token reads the `--font-dm-sans` variable it defines, and Tailwind's
  `font-sans` reads the token, so legacy and design-system text share one font.
- `/design-system` renders design-system components inside the app, and
  `e2e/app/design-system.spec.ts` checks their brand colour, text colour and font. The page is
  linked from nowhere and marked `noindex`. Delete it with the last legacy component.
- `npm run adoption` counts what the app imports from each side, in CI on every PR (in the job
  summary of "Format, lint, types, tokens and unit tests"). Today: 0 of 32 design-system
  components, 22 of 22 legacy components.

## Step 0: the page's text colour

Design-system text (`Heading`, `Text`, `Label`, `Caption`, and the components built on them)
inherits its colour, like the canvas in Storybook does. The legacy `body` in `globals.css` is
indigo (`--color-brand-secondary`). A design-system heading dropped into a legacy page would turn
indigo.

The first PR sets the `body` colour to `var(--ds-semantic-colour-text-default-base)`, on its own.
Every legacy element that inherits the indigo turns charcoal at the same time. Look through the
pages in that PR, and give an element its own legacy class if it has to stay indigo until its
component migrates.

## The order

One legacy component per PR, replaced everywhere it is used, then deleted in the same PR (ADR 0006).
The adoption report's "nothing imports" line is the check that it can go.

1. **Drop-in:** SkipLink, Pagination, Breadcrumbs, EmptyState, Skeleton (with SkeletonCard and
   ProductGridSkeleton), Badge.
2. **Forms and actions:** Button, Input, Select, SearchInput with SearchBar, CustomLink.
3. **Organisms the patterns mirror:** RoomFilter with FilterBar, ProductCard, ProductGrid with
   SearchResults, Navbar, Footer, ProductDetail, and PageLayout last, because every page uses it.

## Every migration PR

- `npm run test:e2e` passes. The journeys find things by role and accessible name. When a
  migration changes a role or a name on purpose (Pagination does), update the selector in the
  same PR and say why in its description.
- The visual job does not change: migrating the app touches no story.
- `npm run adoption` goes the right way: one more design-system component in use, one fewer
  legacy component.
- The design system is not changed to fit a legacy call site. If the app needs something the
  component cannot do, that is a design-system PR of its own, first.

## Legacy to design system

What each legacy component becomes, and the props that change. "Pattern" means a recipe under
Storybook → Patterns that already composes the replacement.

### Drop-in

| Legacy                                                                | Design system                                                                                                                        | What changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `atoms/SkipLink`                                                      | `SkipLink`                                                                                                                           | Nothing to change: `targetId` defaults to `main-content` and the text to "Skip to content" in both.                                                                                                                                                                                                                                                                                                                                                                           |
| `molecules/Pagination`                                                | `Pagination`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis`, `getPaginationRange` | Buttons with `onPageChange(page)` become links: each page needs an `href` (the URL with `?page=`), and `currentPage` / `totalPages` go through `getPaginationRange`. Accessible names change from "Go to page 3" / "Go to previous page" to "Page 3" and "Previous" / "Next", and the ends become disabled links (`aria-disabled`), not disabled buttons. Update `e2e/app/pagination.spec.ts` with it. The Paginated Results pattern moves focus to the top of each new page. |
| `molecules/Breadcrumbs`                                               | `Breadcrumb`, `BreadcrumbItem`, `BreadcrumbLink`                                                                                     | `items={[{ label, href }]}` becomes children: a `BreadcrumbItem` per step and a `BreadcrumbLink` for each one with an `href`. The last item, without one, is the current page. Pattern: Product Page Header.                                                                                                                                                                                                                                                                  |
| `molecules/EmptyState`                                                | `EmptyState`                                                                                                                         | `title` and `description` stay. Add `headingLevel` to fit the page's outline, an `icon` by name, and the actions as children. Pattern: Results States.                                                                                                                                                                                                                                                                                                                        |
| `atoms/Skeleton`                                                      | `Skeleton`                                                                                                                           | A `div` sized by Tailwind classes becomes a `span` with `shape` (`text`, `rectangle`, `circle`), `size`, `lines`, `width` and `height`.                                                                                                                                                                                                                                                                                                                                       |
| `molecules/SkeletonCard`, `organisms/ProductGrid/ProductGridSkeleton` | `Card` with `Skeleton`                                                                                                               | No component of their own: the loading card is composed. Pattern: Results States.                                                                                                                                                                                                                                                                                                                                                                                             |
| `atoms/Badge`                                                         | `Badge`                                                                                                                              | `variant` was the shape: `square` becomes `shape="rounded"`, `rounded` becomes `shape="pill"`. `variant` is now the colour role (`primary`, `secondary`, the utility roles), with `appearance` `soft` (default) or `fill`.                                                                                                                                                                                                                                                    |

### Forms and actions

| Legacy                                         | Design system                                  | What changes                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `atoms/Button`                                 | `Button` (and `Link`)                          | `variant="default"` becomes the default (`primary`, `fill`); `outline` becomes `appearance="outline"`; `ghost` becomes `appearance="ghost"`. `link` is not a button: use `Link`. Sizes `sm` / `md` / `lg` keep their names. Icons are names from the registry (`icon="trash-2"`), never elements. An icon-only button must have `aria-label`, and the types enforce it. |
| `atoms/Input`                                  | `TextField` (or `Input` inside a custom label) | `error` + `errorId` become `invalid` + `error`, which go together: `invalid` without `error` does not compile. `TextField` needs a visible `label` and wires the hint and the error to the input.                                                                                                                                                                       |
| `atoms/Select`                                 | `SelectField` (or `Select` with `SelectItem`)  | The Radix parts (`SelectTrigger`, `SelectContent`, …) become `Select` + `SelectItem` / `SelectGroup`. `SelectField` adds the visible label, hint and error like `TextField`.                                                                                                                                                                                            |
| `molecules/SearchInput`, `organisms/SearchBar` | `SearchField`                                  | `label` and `onSearch` stay. `searchButtonLabel` becomes `submitLabel`, a controlled `value` pairs with `onValueChange`, and Clear is built in (`onClear`, `clearLabel`). Pattern: Product Search.                                                                                                                                                                      |
| `atoms/CustomLink`                             | `Link`                                         | `isActive` becomes `aria-current="page"`. `appearance="standalone"` for navigation, `inline` inside text. Pattern: Main Navigation.                                                                                                                                                                                                                                     |

### Organisms (each one is a pattern)

| Legacy                                               | Pattern                                                | Built from                                                                                                                                                    |
| ---------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `molecules/RoomFilter`, `organisms/FilterBar`        | Filter Bar                                             | `Chip` per room (`selected`, `onSelectedChange`), `Select` for the store and the sort order, and the same controls in a `Sheet` on a phone, with `Checkbox`es |
| `organisms/ProductCard`                              | Product Card                                           | `Card`, `CardMedia`, `Badge`, and a stretched `Link` so the whole card is one link                                                                            |
| `organisms/ProductGrid`, `organisms/SearchResults`   | Search Results Page, Results States, Paginated Results | The grid, its loading, empty and error states (`Skeleton`, `EmptyState`, `Alert`) and `Pagination`                                                            |
| `organisms/SearchResults/SearchResultsErrorBoundary` | Page Errors                                            | `EmptyState` with its actions (`Button`, `Link`)                                                                                                              |
| `organisms/Navbar`                                   | Site Header, Main Navigation                           | `Link` with `aria-current`, and the menu in a `Sheet` on a phone                                                                                              |
| `organisms/Footer`                                   | Footer                                                 | Named groups of `Link`s and the small print                                                                                                                   |
| `organisms/ProductDetail`                            | Product Details, Product Page Header                   | `Breadcrumb`, `Heading`, `Badge`, `Card`, `Tabs` for details and measurements, `Button`                                                                       |
| `templates/PageLayout`                               | Page Layout                                            | `SkipLink`, Site Header, `main#main-content`, Footer                                                                                                          |

## When it is done

`npm run adoption` reports no legacy component imported, the legacy folders are gone, and the
`/design-system` check page goes with them.
