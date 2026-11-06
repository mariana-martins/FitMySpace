# FitMySpace conventions

FitMySpace is a search engine for home organisation products across stores:
Next.js 16 (App Router), React 19, TypeScript, TanStack Query, Zod and Tailwind
CSS 4, with an in-repo design system built on CSS Modules and Style Dictionary
tokens. See README.md and `docs/` for the architecture.

## Working with Mariana

- She writes in Portuguese: answer in Portuguese. Code, comments, stories,
  commit messages and docs stay in English.
- Do not commit or push until she asks. She reviews every change first; leave
  the work uncommitted and list what changed.
- Stay inside the requested scope. If you find a problem outside it (a bug in
  another component, an outdated doc), report it and ask before fixing it.
- Before deciding how something should look or work, check how the codebase
  already does it and follow that pattern. Consistency beats novelty.

## Architecture

- **App (`src/app/`, `src/components/{atoms,molecules,organisms,templates}`)**:
  atomic design. Smart components (data, state, business rules) live here.
  App tests live in `src/__tests__/`, mirroring the source folders.
- **Data**: TanStack Query hooks in `src/hooks/`, API helpers and Zod schemas in
  `src/lib/`. Validate external data and search params with Zod.
- **State**: filters and pagination live in the URL (search params), not in
  React state.
- Do not add a `loading.tsx` above `/products/[id]`: it makes unknown products
  return 200 instead of 404.

## Design system (`src/components/design-system/`)

Read `src/PLANNING.md` and the design system README before any design-system
work. PLANNING.md is git-ignored and exists only on Mariana's machine; the
rules below are its essentials.

- **Strict boundary**: presentational components only. No app state, business
  logic, API calls or data fetching. Data comes in through props, events go out
  through callbacks.
- **Do not replace or migrate legacy components** (`atoms/Input`,
  `SearchInput`, `atoms/Button`...) with design-system ones. Migration happens
  only after ALL design-system components are finished.
- **Look**: modern, luxurious, serene. Do not copy how the legacy component was
  designed.
- **Folder per component** in `ui/`: `Name.tsx`, `Name.types.ts`,
  `Name.module.css`, `Name.test.tsx`, `Name.stories.tsx` and an `index.tsx`
  barrel that exports the component and its types (`export type`). `Button` is
  the reference implementation.
- **API**: extend native props with `ComponentPropsWithoutRef<'el'>`, omitting
  conflicting ones (e.g. `size` on `<input>`). Forward refs to the native
  element. Add `'use client'` to interactive components.
- **MDN check**: for every new component, verify the ARIA attributes and DOM
  typings against MDN before writing the API.
- **Tokens**: three tiers of JSON in `tokens/` (tier 1 literal values, tier 2
  semantic, tier 3 component). Components use tier-3 (or tier-2) variables only,
  never hex values. After editing JSON run `npm run tokens:build`; never edit
  `tokens.css` by hand. Never name a token key `value` inside a group (e.g.
  `text.value`): Style Dictionary reads it as the token's value and outputs
  `[object Object]`. Use `default`.
- **Stories** mirror `Button.stories.tsx`:
  - title `Design System/Components/Name`, `tags: ['autodocs']`;
  - meta `docs.description.component` with `### Best Practices` and
    `### Key Features`;
  - `Default` with explicit `args`, an `argTypes` `description` for every
    control, and "Use the controls below to experiment...";
  - then `AllSizes`, `WithIcon` (named 'With Icons'), `Disabled`, and
    `PseudoStates` (named 'Interactive Pseudo States', using
    `storybook-addon-pseudo-states`);
  - compositions as recipes, e.g. 'Form Example (A11y)';
  - every story has a `/* --- Name --- */` header comment,
    `parameters.docs.description.story`, a `play` test where it adds value, and
    `docs.source.code` when the render is complex;
  - layouts use inline `style`, not meta decorators or shared style constants.
- **Tests** mirror `Button.test.tsx`: `describe('Name — area')` blocks under
  `/* === AREA === */` banners, React Testing Library queries by role and name,
  and a `jest-axe` check.
- Storybook runs a11y checks with `test: 'error'`: any violation fails the run.
  Exception: `storybook-addon-pseudo-states` only applies hover, active and
  focus styles in the Storybook UI, not in the Vitest runner, so axe never
  checks those states. Their contrast is enforced by
  `tokens/tokens.contrast.test.ts`: when you add a component or a colour token,
  add its text/background and border/focus pairs there.

## Code style

- Prettier decides formatting (`.prettierrc`: 2 spaces, single quotes,
  semicolons, trailing commas, width 100, sorted imports). Lint-staged runs
  ESLint and Prettier on commit.
- ESLint (type-checked TypeScript, React, hooks, Next, `jsx-a11y`, Storybook)
  must pass with no errors or warnings.
- Readable code: descriptive names, no one-letter variables (`(product) =>`,
  not `(p) =>`; `index`, not `i`), in source and tests. Prefer named functions
  over long chains or dense inline lambdas.
- Comments explain the non-obvious why only. Do not restate the code.
- Use the `@/` path alias for imports from `src/`.

## Accessibility (WCAG 2.2 AA)

- Semantic HTML first; ARIA only when no native element fits.
- Text contrast 4.5:1; UI parts, borders and focus indicators 3:1. Check the
  real hex values, including states (hover, disabled, placeholder).
- Every form control has a visible label tied to it. Errors name the field and
  say how to fix it, are linked with `aria-describedby`, and never rely on
  colour alone.
- Visible keyboard focus everywhere; respect `prefers-reduced-motion` and
  `forced-colors`.

## Checks

Run what applies before saying a change is done, and report failures honestly:

- `npx tsc --noEmit -p .` — types.
- `npm run lint` — ESLint.
- `npm test` — Jest (app and design system).
- `npm run test:storybook` — Storybook play and a11y tests (design system).
- For visual changes, look at the result in Storybook (`npm run storybook`) or
  the app (`npm run dev`); jsdom never sees colour or layout.

## Git

- Conventional Commits, enforced by commitlint (`feat(button): ...`,
  `fix(typography): ...`).
- The pre-commit hook runs lint-staged and the full test suite.
- Versions, tags and `CHANGELOG.md` come only from `npm run release`. Never
  bump versions or edit the changelog by hand.

## Figma

- The design-system file is `2vgKu1CEc6b79vwFHLYcFM`. The account is on the
  free Starter plan and the Figma MCP allows very few calls before it blocks
  until the reset. Upgrading is not an option.
- Plan the whole job first, combine reading, editing and the screenshot into as
  few `use_figma` calls as possible, and save long scripts to a file before
  running them so a blocked call loses nothing.
- Code Connect needs an Organization plan and is not available.
