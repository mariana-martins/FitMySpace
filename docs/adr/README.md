# Architecture Decision Records

Decisions that outlive a pull request. Each record says what was decided, why, and what follows.
A decision that changes gets a new record that supersedes the old one; the old one stays, marked
`Superseded by NNNN`.

| #                                                 | Decision                                                   | Status   |
| ------------------------------------------------- | ---------------------------------------------------------- | -------- |
| [0001](0001-code-is-the-source-of-truth.md)       | Code and Storybook are the design system's source of truth | Accepted |
| [0002](0002-dm-sans-for-app-and-design-system.md) | DM Sans for the app and the design system                  | Accepted |
| [0003](0003-ref-as-prop-and-one-entry-point.md)   | `ref` as a prop and one entry point, before new components | Accepted |
| [0004](0004-breakpoint-tokens.md)                 | Breakpoint tokens checked against the CSS                  | Accepted |
| [0005](0005-combobox-by-hand.md)                  | `Combobox` written by hand on the ARIA pattern             | Accepted |
| [0006](0006-migration-order.md)                   | Migrate one component across the whole app at a time       | Accepted |
| [0007](0007-visual-regression-with-playwright.md) | Visual regression with Playwright                          | Accepted |
| [0008](0008-e2e-before-migration.md)              | A small app E2E suite before the migration                 | Accepted |

New record: copy the shape of an existing one (Status, Context, Decision, Consequences) and add
it to the table.
