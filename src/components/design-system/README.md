# FitMySpace Design System

This directory houses the foundational design system components, tokens, and utilities for the FitMySpace project. It acts as an internal monorepo to ensure architectural control and separation of concerns.

## Structure

```
design-system/
├── lib/             # Shared utilities (cn.ts)
├── tokens/          # Tier 1 JSON token files + Style Dictionary config
│   ├── color.json
│   ├── typography.json
│   ├── spacing.json
│   ├── radii.json
│   ├── sd.config.mjs  # Style Dictionary build config
│   └── tokens.css     # AUTO-GENERATED — do not edit manually
└── ui/              # Component folders (colocated with stories)
    └── Typography/
        ├── Typography.tsx
        └── Typography.stories.tsx
```

- Components are built on top of Tailwind CSS and Radix UI primitives.
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

---

### Style Dictionary (Token Pipeline)

Style Dictionary processes the JSON token files in `tokens/` and generates `tokens.css` — a single CSS file with all design tokens as CSS custom properties.

**How to run:**

```bash
npm run tokens:build
```

**Where the output goes:** `src/components/design-system/tokens/tokens.css`

**When to run:** After editing **any** `.json` file inside the `tokens/` directory. The generated `tokens.css` is committed to the repository so that downstream consumers (Tailwind, Storybook, components) can use the tokens without needing to run the build step first.

> ⚠️ **Important:** Never edit `tokens.css` manually — it will be overwritten on the next build. Always edit the source `.json` files instead.
