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
- **Folders**: components in `ui/`, Foundation pages in `foundations/`, the
  Introduction page in `introduction/`, the Changelog page in `changelog/` (renders
  `CHANGELOG.md` through a `?raw` import), the Contributing & Accessibility page in
  `contributing/` (the new-component checklist; it links to this file instead of copying
  it, so keep its links in step when a heading here changes), Storybook-only helpers in `docs/`,
  plain helpers shared by components in `utils/` (e.g. `joinIds` for
  `aria-describedby`, `UTILITY_VARIANTS` with the icon and label of each, shared by `Alert`, `Toast`, the field errors and the variant types of `Button` and `Badge`). Reuse them instead of copying a helper into a component.
  Sidebar: `Design System/Components/<Category>/<Name>` with the categories
  Actions, Forms, Navigation, Display, Feedback, Overlays, Typography and Utilities (add one in
  `.storybook/preview.tsx` when needed).
- **Folder per component** in `ui/`: `Name.tsx`, `Name.types.ts`,
  `Name.module.css`, `Name.test.tsx`, `Name.stories.tsx` and an `index.tsx`
  barrel that exports the component and its types (`export type`). `Button` is
  the reference implementation. Add one `export * from './ui/Name';` line to the
  entry point `design-system/index.ts` (`index.test.ts` fails without it).
- **Entry point**: the app imports the design system from `@/components/design-system`
  only. ESLint rejects any deeper path outside the folder, alias or relative, except
  `tokens/tokens.css`. Inside the design system, components import each other relatively
  (`../Icon`), never through the entry point.
- **Storybook-only helpers** (used by the Foundation pages, not public API) live
  in `docs/`, not `ui/`. Reuse them instead of copying markup between stories:
  `CopyTokenButton` copies a token's `var(--…)` reference, with an icon and a
  screen-reader announcement (`iconOnly` for narrow cards); `LinkCard` /
  `LinkCardGrid` link to another Storybook page with a whole-card link;
  `LabelledField` puts a visible label above a bare `Input`, `Select` or
  `Textarea` in their stories (never use `aria-label` alone in an example). Foundation pages
  never hard-code token lists or values: read them with `getTokens` from
  `docs/tokens.ts` (generated `tokens/tokens.docs.json`) and lay them out with
  `FoundationPage`, `TokenGroup` and `TokenRow`.
- **API**: extend native props with `ComponentPropsWithoutRef<'el'>`, omitting
  conflicting ones (e.g. `size` on `<input>`). Take `ref` as a prop (React 19)
  and pass it to the native element:
  `function Name({ ref, ...props }: NameProps & { ref?: Ref<HTMLElement> })`. ESLint
  rejects `forwardRef` in the design system. Add `'use client'` only to components that use client-only React
  (state, effects, refs, event handlers, or a Radix primitive with hooks).
  `useId` works on the server, and rendering a client component such as Radix
  `VisuallyHidden` does not make a component client: `Textarea`, `TextareaField`,
  `Breadcrumb` and `Skeleton` stay server components.
- **Icons**: every icon is drawn through `Icon` with an entry from `DS_ICONS`
  (`ui/Icon/icons.tsx`), the only file that imports `lucide-react`; ESLint
  rejects the import anywhere else in the design system. An `icon` prop takes a
  name (`icon="search"`), never an element. A component sizes its icon by
  writing `--icon-size` from its own token in the class it passes. A new icon
  goes into the registry, with its current Lucide name (not an old alias) and a
  `usedIn` line.
- **Screen-reader-only text**: use `VisuallyHidden` from
  `@radix-ui/react-visually-hidden` (e.g. the "Error: " prefix, a `role="status"`
  announcement). Never add a local `.visually-hidden` class or inline style. The design
  system does not wrap it: `ui/VisuallyHidden/` holds only its Storybook page
  (Components/Utilities), which explains when to use it.
- **MDN check**: for every new component, verify the ARIA attributes and DOM
  typings against MDN before writing the API.
- **Tokens**: three tiers of JSON in `tokens/` (tier 1 literal values, tier 2
  semantic, tier 3 component). Components use tier-3 (or tier-2) variables only,
  never hex values. Tier-3 JSON references tier 2, never tier 1
  (`tokens/tokens.tiers.test.ts` enforces it): add a semantic role first. Button
  and Input share `semantic.size.control.*` heights (32/40/48/56px). Every size,
  spacing, shadow offset and blur, and duration is a multiple of 4; only stroke
  widths (1px, 2px) are exempt. The typography `shorthand` tokens are generated
  by a preprocessor in `sd.config.mjs`, not written in the JSON. In colour
  tokens `subtle` means neutral, not faint: `border.subtle` is darker than
  `border.default`. After editing JSON run `npm run tokens:build`; never edit
  `tokens.css` or `tokens.docs.json` by hand. Never name a token key `value` inside a group (e.g.
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
  - recipes that show this one component in a real setting, e.g. 'Form Example (A11y)'
    (a composition of several components is a pattern, see **Patterns**);
  - every story has a `/* --- Name --- */` header comment,
    `parameters.docs.description.story`, a `play` test where it adds value, and
    `docs.source.code` when the render is complex;
  - a visible story's `play` only checks the resting state. Storybook runs it on
    every load, so a play that clicks, types, hovers or opens something leaves the
    story changed before anyone touches it (a list flashes open, an error shows up).
    Put the interaction in a copy named `NameInteraction`: spread the story
    (`...Name`), name it 'Name: Interaction (Test Only)', add
    `tags: ['!dev', '!autodocs']` and give it the interactive `play`. It is hidden
    from the sidebar and the docs page, and `npm run test:storybook` still runs it;
  - layouts use inline `style`, not meta decorators or shared style constants;
  - the global decorator in `.storybook/preview.tsx` centres every story on both axes. A
    story that should fill the width (a grid of cards) sets `width: '100%'` on its root; one
    that should stay narrow sets `width` with `maxWidth: '100%'`, not `maxWidth` alone, which
    collapses to its content. Full pages set `layout: 'fullscreen'` and are not centred.
- **Patterns** (`patterns/<Name>/<Name>.stories.tsx`, sidebar
  `Design System/Patterns/<Group>/<Name>`, folders flat as in `ui/`): recipes that compose
  several design-system components (search page, product card). Stories only: no new
  component, no CSS Module, layout in inline `style`, sample data local to the file, or shared
  from `docs/` when several patterns use it (`docs/sampleImages.ts`, `docs/sampleProducts.tsx`,
  `docs/sampleSite.tsx`), no fetch. The app owns the state (URL, queries), and the pattern says
  where it goes.
  - Groups: **Page Sections** (a piece of a page, Atomic Design's organisms), **Tasks**
    (something people do from start to finish), **Pages** (Page Layout, the template, and
    whole pages) and **Guides** (choosing between components). Add a pattern to its group in
    `.storybook/preview.tsx` and to its group's grid in `patterns/Overview.stories.tsx`.
  - The meta description has the same sections: the problem, `### What It Solves` (what goes
    wrong without it), `### When to Use` (with what it is not for), `### Anatomy`,
    `### Accessibility` and `### In the App`. A component page links to its patterns under
    `### Patterns`.
  - A pattern that needs a missing component waits for it instead of drawing its own, and
    the gap goes on the Overview's "Not in the design system yet" list.
- **CSS Modules**: kebab-case class names (`.icon-only`, `.error-icon`), read
  with bracket access (`styles['error-icon']`). Stylelint (`stylelint.config.mjs`,
  `npm run lint:css`) enforces it and fails on any unknown `--ds-*` token or any
  tier-1 token in design-system CSS; `tokens/tokens.usage.test.ts` checks the
  `--ds-*` names used in `.ts`, `.tsx` and `.mdx` files.
- **Focus**: new components draw the ring with `semantic.focus.ring.colour`,
  `width` and `offset` (or `offset-inset` inside clipped or packed containers);
  add a tier-3 `focus-ring` token only when the default colour lacks 3:1 contrast.
- **Breakpoints**: `semantic.breakpoint.*` (sm 640, md 768, lg 1024, xl 1280). A media query
  cannot read `var()`, so write the value out in range syntax, `@media (width < 640px)`, with
  the token name in a comment. `tokens/tokens.breakpoints.test.ts` fails on any other width.
- **Layers**: `z-index` only through `semantic.layer.overlay` (dialog and its scrim),
  `semantic.layer.floating` (Select list, Tooltip) and `semantic.layer.toast` — never a
  bare number. Put them only on the root of what Radix renders in a portal (a direct child
  of `<body>`); anywhere inside the page an ancestor with `transform`, `opacity` or
  `filter` traps the layer. A component with stacking of its own inside sets
  `isolation: isolate`, so its inner layers cannot leak out. The multiple-of-4 rule does
  not apply to `z-index`.
- **Typography outside components**: use the generated shorthand,
  `font: var(--ds-semantic-typography-<role>-<size>-shorthand)`, plus its
  `letter-spacing` token. Never rebuild a style from separate font tokens.
- **Tests** mirror `Button.test.tsx`: `describe('Name — area')` blocks under
  `/* === AREA === */` banners, React Testing Library queries by role and name,
  and a `jest-axe` check.
- Storybook runs a11y checks with `test: 'error'`: any violation fails the run.
  Exception: `storybook-addon-pseudo-states` only applies hover, active and
  focus styles in the Storybook UI, not in the Vitest runner, so axe never
  checks those states. Their contrast is enforced by
  `tokens/tokens.contrast.test.ts`: when you add a component or a colour token,
  add its text/background and border/focus pairs there.
- **Storybook MCP**: `.mcp.json` registers `@storybook/addon-mcp` as `storybook`
  (`http://localhost:6006/mcp`), live only while `npm run storybook` runs. Its
  `docs-show` returns the stories and the props table (`experimentalDocgenServer`
  in `.storybook/main.ts`, dev server only). Its examples import from
  `'fitmyspace'`, the package name, because Storybook rewrites every import of a
  project file to it; that is not an importable path: import from
  `@/components/design-system` instead.

## Code style

- Prettier decides formatting (`.prettierrc`: 2 spaces, single quotes,
  semicolons, trailing commas, width 100, sorted imports). Lint-staged runs
  ESLint and Prettier on commit.
- ESLint (type-checked TypeScript, React, hooks, Next, `jsx-a11y`, Storybook)
  must pass with no errors or warnings.
- Readable code: descriptive names, no one-letter variables (`(product) =>`,
  not `(p) =>`; `index`, not `i`), in source and tests. Prefer named functions
  over long chains or dense inline lambdas.
- Comments explain the non-obvious why only. Do not restate the code. Do not
  comment every item: inside a type (between its props or members) and between CSS
  declarations, add a comment only when the name or value does not already explain it.
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
- `npm run lint:css` — Stylelint (design-system CSS).
- `npm test` — Jest (app and design system).
- `npm run test:storybook` — Storybook play and a11y tests (design system).
- `npm run tokens:check` — `tokens.css` and `tokens.docs.json` match the token JSON (run
  `npm run tokens:build` if it does not).
- `npm run test:e2e` — Playwright journeys through the app (search, filters,
  pagination, the product 404 and the keyboard path, the last also in WebKit),
  against a production build. Find things by role and accessible name only, so a
  journey survives the swap from a legacy component to a design-system one.
- `npm run test:visual` — Playwright screenshots of the stories of the components
  in `e2e/visual/covered-components.ts`, against the Linux baseline in
  `e2e/visual/baselines/`. A local run on macOS differs in font rendering: trust CI.
- For visual changes, look at the result in Storybook (`npm run storybook`) or
  the app (`npm run dev`); jsdom never sees colour or layout.

When a change is meant to alter the look, the CI visual job fails and writes the
new baseline. Run `npm run visual:baseline` (it waits for CI and downloads it),
look at every PNG it changed, and commit them in the same pull request. Never
make a baseline on macOS, and never raise the screenshot tolerances to get a run
to pass.

`.github/workflows/storybook-pages.yml` publishes the Storybook (never the app)
to GitHub Pages once CI passes on `main`. Links between Storybook pages must stay
relative (`StorybookLink`, `LinkCard`) so they work under the Pages sub-path.

GitHub Actions (`.github/workflows/ci.yml`) runs all of these, plus
`npm run format:check` and `npm run build`, on every pull request and on pushes
to `main`.

## Git

- Conventional Commits, enforced by commitlint (`feat(button): ...`,
  `fix(typography): ...`). Keep the header and each body bullet on a single line
  of at most 100 characters (`header-max-length`, `body-max-line-length`).
- The pre-commit hook runs lint-staged and the full test suite.
- Versions, tags and `CHANGELOG.md` come only from `npm run release`. Never
  bump versions or edit the changelog by hand.
- `main` is protected: every change goes through a pull request, and the required CI
  jobs must pass before it merges.

### Breaking changes and deprecations

A change is breaking when code that uses the design system stops compiling or
behaves differently after it: a removed or renamed component, prop, value or
token, a prop that becomes required, a changed default, or a changed DOM or ARIA
contract that a consumer or a test relies on.

- Mark it with a `BREAKING CHANGE:` footer in the commit (release-it bumps the
  version and lists it in the changelog) and add a migration note in the same PR:
  what to change, before and after.
- Deprecate before removing: the old API keeps working for one minor version,
  marked `@deprecated` in its JSDoc with what replaces it, and is removed in the
  next one with the `BREAKING CHANGE:` footer.
- The pull request template asks "Breaking?": answer it in every PR.

### Decisions

Decisions that outlive a PR go in `docs/adr/` as short Architecture Decision
Records (`NNNN-title.md`: context, decision, consequences). Supersede an ADR
with a new one instead of rewriting it.

## Figma

- **Code and Storybook are the source of truth** for the design system; the
  Figma file holds brand and exploration (`docs/adr/0001-code-is-the-source-of-truth.md`).
  It is not expected to mirror every component, so a component missing in Figma
  is not drift. Figma catch-up is optional, in the order Typography, Input /
  TextField / Select, Dialog, List, Card, with prop names mirrored from the code.
- The design-system file is `2vgKu1CEc6b79vwFHLYcFM`. The account is on the
  free Starter plan and the Figma MCP allows very few calls before it blocks
  until the reset. Upgrading is not an option.
- Plan the whole job first, combine reading, editing and the screenshot into as
  few `use_figma` calls as possible, and save long scripts to a file before
  running them so a blocked call loses nothing.
- Code Connect needs an Organization plan and is not available.
