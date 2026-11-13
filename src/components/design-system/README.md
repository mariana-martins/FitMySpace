# FitMySpace Design System

This directory houses the foundational design system components, tokens, and utilities for the FitMySpace project. It acts as an internal monorepo to ensure architectural control and separation of concerns.

## Structure

```
design-system/
├── tokens/          # Tier 1, 2, and 3 JSON token files + Style Dictionary config
│   ├── tier-1-definitions/    # Core literal values (do not use directly in components)
│   │   ├── color.json         # Hex codes and raw color palettes
│   │   ├── typography.json    # Font families, raw sizes, weights, and letter-spacing
│   │   ├── spacing.json       # Base 4px scale (4–128px), also used by sizes
│   │   ├── size.json          # Layout widths (640/768/1024/1280px)
│   │   ├── border-width.json  # Raw stroke widths (0/1/2/4px)
│   │   ├── radii.json         # Raw border-radius pixel values
│   │   ├── motion.json        # Durations on 80ms steps and easing curves
│   │   └── shadow.json        # Layered box-shadows tinted with charcoal.900
│   ├── tier-2-definitions/    # Intent-based semantic aliases (use these in components)
│   │   ├── color.json         # Semantic backgrounds, text, borders and focus halos (e.g. brand, utility)
│   │   ├── typography.json    # Display, heading, body, control, label, and caption roles (+ generated shorthand)
│   │   ├── spacing.json       # Inset (padding), control padding, gap, and section layout spacing
│   │   ├── size.json          # Control heights, icons, checkbox/radio boxes, switch tracks and knobs, badge heights, click targets, thumbnails, containers, prose width
│   │   ├── border-width.json  # Stroke roles (default, interactive, selected, indicator, halo)
│   │   ├── radii.json         # Interactive, container, and surface border radiuses
│   │   ├── focus.json         # Focus ring colour, width, offset and inset offset
│   │   ├── motion.json        # Duration (instant → deliberate) and easing (standard, enter, exit, move, linear) roles
│   │   └── shadow.json        # Elevation roles (raised, floating, overlay, sunken)
│   ├── tier-3-definitions/    # Component-level token mappings
│   │   ├── badge.json         # Badge fill and soft colors, sizes, and shapes
│   │   ├── card.json          # Card surface, border, shadow, media frame, padding and gap
│   │   ├── breadcrumb.json    # Breadcrumb link, current page and separator colors, sizes, target height
│   │   ├── button.json        # Button variant colors, sizes, shapes, and icon sizing
│   │   ├── checkbox.json      # Checkbox box, mark, label, hint and error colors and sizes
│   │   ├── chip.json          # Chip resting, hover, selected and disabled colors, sizes, edge
│   │   ├── empty-state.json   # EmptyState icon circle, title and description colors, spacing
│   │   ├── input.json         # Input + TextField colors, states, halo, sizes, and unit styling
│   │   ├── link.json          # Link colors, underline widths and offset, motion, standalone sizes
│   │   ├── pagination.json    # Pagination page, current page and ellipsis colors, sizes, shape
│   │   ├── radio-group.json   # RadioGroup circle, dot, label, hint and error colors and sizes
│   │   ├── search-field.json  # SearchField label and hint colors, spacing
│   │   ├── select.json        # Select + SelectField trigger, list, option, and group-label styling
│   │   ├── skeleton.json      # Skeleton pulse colors, shape radii, motion, and text sizes
│   │   ├── switch.json        # Switch track edge and fill, knob, label, hint and error colors and sizes
│   │   └── textarea.json      # Textarea + TextareaField colors, states, halo, and sizes
│   ├── sd.config.mjs              # Style Dictionary build config (+ typography shorthand preprocessor)
│   ├── tokens.contrast.test.ts    # WCAG contrast checks for every colour pair and state
│   ├── tokens.tiers.test.ts       # Each tier references only the tier below it
│   ├── tokens.usage.test.ts       # Every --ds-* name used in .ts/.tsx/.mdx exists
│   ├── tokens.css                 # AUTO-GENERATED — do not edit manually
│   └── tokens.docs.json           # AUTO-GENERATED — token list for the Foundation pages
├── docs/            # Storybook-only helpers (not public API)
│   ├── index.tsx
│   ├── CopyTokenButton.tsx        # Copy-to-clipboard button with icon and status announcement
│   ├── CopyTokenButton.test.tsx
│   ├── FoundationPage.tsx         # Page shell, token group card, token row, inline code, StorybookLink
│   ├── LabelledField.tsx          # Visible label above a bare Input, Select or Textarea in their stories
│   ├── LabelledField.test.tsx
│   ├── LinkCard.tsx               # LinkCard + LinkCardGrid: whole-card links to other Storybook pages
│   ├── LinkCard.module.css
│   ├── LinkCard.test.tsx
│   ├── tokens.ts                  # Reads tokens.docs.json: getTokens, groupTokens, labels
│   └── tokens.test.ts
├── introduction/    # Storybook landing page: token architecture, linked foundation and component cards
│   └── Introduction.stories.tsx
├── foundations/     # One Storybook page per tier-2 token file
│   ├── border-width/BorderWidth.stories.tsx
│   ├── color/Colors.stories.tsx
│   ├── focus/Focus.stories.tsx
│   ├── motion/Motion.stories.tsx
│   ├── radii/Radii.stories.tsx
│   ├── shadow/Shadow.stories.tsx
│   ├── size/Size.stories.tsx
│   ├── spacing/Spacing.stories.tsx
│   └── typography/Typography.stories.tsx
├── ui/              # Components only (colocated with stories)
│   ├── Badge/       # Sidebar: Components/Display/Badge
│   │   └── … (same files as Button)
│   ├── Breadcrumb/  # Sidebar: Components/Navigation/Breadcrumb (Breadcrumb, BreadcrumbItem, BreadcrumbLink)
│   │   └── … (same files as Button)
│   ├── Button/      # Sidebar: Components/Actions/Button
│   │   ├── index.tsx
│   │   ├── Button.types.ts
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   ├── Button.test.tsx
│   │   └── Button.stories.tsx
│   ├── Checkbox/    # Sidebar: Components/Forms/Checkbox (Radix Checkbox)
│   │   └── … (same files as Button)
│   ├── Chip/        # Sidebar: Components/Actions/Chip (toggle button, aria-pressed)
│   │   └── … (same files as Button)
│   ├── Card/        # Sidebar: Components/Display/Card (Card + CardMedia, asChild via Radix Slot)
│   │   └── … (same files as Button)
│   ├── EmptyState/  # Sidebar: Components/Display/EmptyState (icon, heading, description, actions)
│   │   └── … (same files as Button)
│   ├── Input/       # Sidebar: Components/Forms/Input
│   │   └── … (same files as Button)
│   ├── Link/        # Sidebar: Components/Navigation/Link (inline or standalone, asChild via Radix Slot)
│   │   └── … (same files as Button)
│   ├── Pagination/  # Sidebar: Components/Navigation/Pagination (Pagination, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis, getPaginationRange)
│   │   └── … (same files as Button, plus getPaginationRange.ts)
│   ├── RadioGroup/  # Sidebar: Components/Forms/RadioGroup (Radix RadioGroup: RadioGroup, RadioGroupItem)
│   │   └── … (same files as Button)
│   ├── SearchField/ # Sidebar: Components/Forms/SearchField (form role="search", Clear and Search buttons)
│   │   └── … (same files as Button)
│   ├── Select/      # Sidebar: Components/Forms/Select (Radix Select: Select, SelectItem, SelectGroup)
│   │   └── … (same files as Button)
│   ├── SelectField/ # Sidebar: Components/Forms/SelectField
│   │   └── … (same files as Button)
│   ├── Skeleton/    # Sidebar: Components/Display/Skeleton (loading placeholder, aria-hidden)
│   │   └── … (same files as Button)
│   ├── Switch/      # Sidebar: Components/Forms/Switch (Radix Switch)
│   │   └── … (same files as Button)
│   ├── TextField/   # Sidebar: Components/Forms/TextField
│   │   └── … (same files as Button)
│   ├── Textarea/    # Sidebar: Components/Forms/Textarea (native <textarea>, no client hooks)
│   │   └── … (same files as Button)
│   ├── TextareaField/ # Sidebar: Components/Forms/TextareaField
│   │   └── … (same files as Button)
│   └── Typography/  # Sidebar: Components/Typography/{Heading,Text,Label,Caption}
│       ├── index.tsx
│       ├── Typography.types.ts
│       ├── Typography.tsx
│       ├── Typography.module.css
│       ├── Typography.test.tsx
│       ├── Heading.stories.tsx
│       ├── Text.stories.tsx
│       ├── Label.stories.tsx
│       └── Caption.stories.tsx
└── utils/           # Plain helpers shared by components (no React, no styles)
    ├── index.ts
    ├── joinIds.ts   # Joins ids for aria-describedby / aria-labelledby
    └── joinIds.test.ts
```

- Components are built using CSS Modules with native CSS custom properties (generated by Style Dictionary) and Radix UI primitives (`@radix-ui/react-slot`, `@radix-ui/react-label`, `@radix-ui/react-checkbox`, `@radix-ui/react-radio-group`, `@radix-ui/react-select`, `@radix-ui/react-switch`, `@radix-ui/react-visually-hidden`, and the `@radix-ui/react-use-controllable-state` and `@radix-ui/react-compose-refs` utilities). Interactive form controls with a custom look (`Checkbox`, `RadioGroup`, `Select`, `Switch`) use Radix, which keeps a hidden native input for form submission; text fields stay native `<input>` and `<textarea>`.
- **Server rendering:** anything without client-only React renders on the server — no `'use client'`, no JavaScript to show it: `Textarea`, `TextareaField`, `Breadcrumb`, `Pagination`, `Link`, `Card`, `EmptyState`, `Skeleton`, `Typography`. `useId` works on the server, and a server component may render a client one (such as Radix `VisuallyHidden`) without becoming one. `Input` and `TextField` are client components because of a ref and a click handler, `SearchField` because of its state, and every Radix control (`Checkbox`, `RadioGroup`, `Select`, `SelectField`, `Switch`) because of its hooks.
- Accessibility rules (such as `aria-label` on icon-only `Button`, `htmlFor` on `Label as="label"`, and a required `error` message when `TextField`, `TextareaField`, `SelectField`, `Checkbox` or `Switch` is `invalid`) are enforced at compile time via TypeScript discriminated unions.
- Design tokens are managed using Style Dictionary.

Refer to the root `src/PLANNING.md` for architectural guidelines and implementation details.

---

## Operations

### Storybook

Storybook is used to develop, test, and document Design System components in isolation.

**How to run:**

```bash
npm run storybook
```

**Where it serves:** `http://localhost:6006`

**When to run:** During component development. Open Storybook whenever you are building, reviewing, or testing a Design System component. It hot-reloads on file changes.

**Building for production:**

```bash
npm run build-storybook
```

This generates a static Storybook site in `storybook-static/` (already in `.gitignore`).

**Publishing (GitHub Pages):** `.github/workflows/storybook-pages.yml` publishes the static Storybook, and only the Storybook, to GitHub Pages after the CI workflow passes on `main` (it builds the exact commit CI tested). A static build has no dev server, so `.storybook/main.ts` leaves out the panels that would do nothing there (Vitest test runner, MCP server, onboarding checklist), the app's `public/` folder and `project.json`. It is live at https://mariana-martins.github.io/FitMySpace/ (the path follows the repository name and is case-sensitive). Links between pages are relative, so they work under that sub-path.

**Running Storybook interaction and accessibility tests:**

```bash
npm run test:storybook
```

Runs all story `play` functions and automated WCAG accessibility checks (`@storybook/addon-a11y` configured with `test: 'error'`) in a headless Chromium browser via Vitest and Playwright.

> ℹ️ **Interactive states:** `storybook-addon-pseudo-states` only applies hover, active and focus styles in the Storybook UI, not in the test runner, so axe checks every story in its default state only. Colour contrast in every state is covered by `tokens/tokens.contrast.test.ts` (run with `npm test`).

---

### Style Dictionary (Token Pipeline)

Style Dictionary processes the JSON token files in `tokens/` and generates two files: `tokens.css` — a single CSS file with all design tokens as CSS custom properties — and `tokens.docs.json`, one entry per token (CSS variable, JSON path, resolved value and `comment`; the tier-1 alias is left out so the pages never point consumers at tier 1) that the Storybook Foundation pages read.

**How to run:**

```bash
npm run tokens:build
```

**Where the output goes:** `src/components/design-system/tokens/tokens.css` and `tokens.docs.json`

**When to run:** After editing **any** `.json` file inside the `tokens/` directory. `npm run tokens:check` rebuilds in memory and fails if the committed `tokens.css` or `tokens.docs.json` differs; the pre-commit hook and CI both run it. The generated `tokens.css` is committed to the repository so that downstream consumers (Storybook, CSS Modules, components) can use the tokens without needing to run the build step first.

> ⚠️ **Important:** Never edit `tokens.css` or `tokens.docs.json` manually — it will be overwritten on the next build. Always edit the source `.json` files instead.

**Tier rule:** tier-2 tokens reference tier-1 literals; tier-3 tokens reference tier-2 (or other tier-3) tokens, never tier-1 directly. `tokens/tokens.tiers.test.ts` fails the build if a reference skips a tier. If a component needs a value with no semantic role yet, add the role to tier 2 first.

**The 4px rule:** every size, spacing step, shadow offset and blur, and motion duration (80ms steps) is a multiple of 4. Only stroke widths are exempt: hairlines are 1px and 2px.

**Typography shorthand:** `sd.config.mjs` generates a `shorthand` token for every text style, e.g. `--ds-semantic-typography-heading-lg-shorthand` = `600 1.875rem/1.25 'DM Sans', sans-serif`, built from references to the style's own tokens so it can never drift. Outside a component, style text with `font: var(--…-shorthand)` and, for display and label styles, `letter-spacing: var(--…-letter-spacing)` (the CSS `font` property cannot carry letter spacing). Never rebuild a style from its separate font tokens.

**Control sizes:** Button and Input share the `semantic.size.control.*` heights (`xs` 32, `sm` 40, `md` 48, `lg` 56px, all multiples of 4), so a button lines up with the field next to it. `Textarea` takes the same heights as its `min-height`, so even a one-row field matches the button beside it. Checkboxes and radios use `semantic.size.selection-control.*`, and switches their own `semantic.size.switch.{height,width,thumb}.*` (the track is always 8px taller than its knob, so the knob sits 4px inside the edge).

**About `subtle`:** in colour tokens, `subtle` means neutral (low-chroma), not faint. `background.subtle` is a dark charcoal fill (the secondary Button) and `border.subtle` is darker than `border.default`. For a faint divider use `border.disabled`.

**Contrast checks:** `tokens/tokens.contrast.test.ts` resolves every token to its hex value and checks text (4.5:1) and UI/focus (3:1) contrast for each component variant and state. When you add a component or a colour token, add its text/background and border/focus pairs there, then run:

```bash
npm test -- tokens.contrast
```

---

### Linting CSS (Stylelint)

```bash
npm run lint:css
```

`stylelint.config.mjs` extends `stylelint-config-recommended` (rules that catch errors, no formatting: Prettier owns that) and adds the design-system rules:

- `selector-class-pattern`: CSS Module class names are kebab-case, read with `styles['error-icon']`;
- `csstools/value-no-unknown-custom-properties`: every `var(--ds-*)` exists in `tokens.css`;
- `declaration-property-value-disallowed-list`: no tier-1 token (`--ds-*` that is not `--ds-semantic-*` or `--ds-component-*`) in design-system CSS.

`tokens.css` (generated) and `src/app/globals.css` (legacy Tailwind, until the app migrates) are ignored. Lint-staged runs `stylelint --fix` on staged CSS, and CI runs `npm run lint:css`.

---

### Foundation docs helpers

Each tier-2 token file has a Foundation page in `foundations/` (Color, Typography, Spacing, Size, Radii, Border Width, Shadow, Focus, Motion). The pages never keep their own token lists: they read `tokens.docs.json` through `docs/tokens.ts` (`getTokens('semantic', 'spacing')`, `groupTokens(tokens, 2)`, `formatTokenLabel`) and render it with `docs/FoundationPage` (`FoundationPage`, `TokenGroup`, `TokenRow`, `InlineCode`). To link from a story to another Storybook page use `StorybookLink` (a story renders in an iframe, so a plain link would open inside it); in a `docs.description` Markdown string a plain `[text](?path=/docs/...)` link already works. A new token shows up on its page after `npm run tokens:build`; only the prose (group descriptions) is written by hand.

The Introduction page uses `docs/LinkCard` inside a `LinkCardGrid` (a list) to link to each foundation and component page. The title's link stretches over the whole card with `::after`, so the link's name stays the title; the preview is `aria-hidden` and `inert`, so real components can be rendered in it without taking focus.

They use `docs/CopyTokenButton` to copy a token's `var(--…)` reference. It shows a copy icon, switches to a check (copied) or alert (failed) icon, and announces the result to screen readers through a `role="status"` live region. In narrow layouts (the Color swatch cards) use `iconOnly`: render the token name as wrapping text next to a square icon button whose accessible name is "Copy var(--…)". These helpers exist only for Storybook and are not part of the public design-system API.

---

### Versioning and Commits

This Design System enforces the **Conventional Commits** standard to automatically generate version bumps and changelog updates.

- **Commit Validation:** All commits are linted using Husky and Commitlint. You must follow the Conventional Commits format (e.g., `feat(button): add new variant`, `fix(typography): correct font-size`).
- **Release Process:** Do not manually bump versions or edit `CHANGELOG.md`. Instead, run:
  ```bash
  npm run release
  ```
  This command will automatically determine the next semantic version, generate the changelog, and create the Git tag.
