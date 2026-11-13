import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type LinkAppearance = 'inline' | 'standalone';
export type LinkSize = 'sm' | 'md' | 'lg';

/* ---------------------------------------------------------------
 * Props — discriminated union on `appearance`
 *
 * `Link` is a native <a> for navigation (MDN: use a <button> for
 * actions). Two appearances:
 *   - `inline` (default): a link inside running text. It takes the
 *     text's font and stays underlined, so it never relies on colour
 *     alone (WCAG 1.4.1). `size` does not apply.
 *   - `standalone`: a link on its own, such as a navigation, footer
 *     or "See all" link, or a card title. No resting underline: one
 *     slides in on hover and stays on the current page
 *     (`aria-current="page"`). With `size` it takes a Label style;
 *     without it, the font of its parent (e.g. a Heading).
 *
 * `asChild` (Radix Slot) renders the child instead of an <a>, e.g.
 * Next.js `<Link>`, and merges the styles and props onto it.
 * --------------------------------------------------------------- */

type LinkBaseProps = {
  opensInNewTab?: boolean;
  stretched?: boolean;
  asChild?: boolean;
  children: ReactNode;
};

type LinkNativeProps = Omit<ComponentPropsWithoutRef<'a'>, keyof LinkBaseProps | 'target'>;

type LinkInlineProps = LinkBaseProps & {
  appearance?: 'inline';
  size?: never;
} & LinkNativeProps;

type LinkStandaloneProps = LinkBaseProps & {
  appearance: 'standalone';
  size?: LinkSize;
} & LinkNativeProps;

export type LinkProps = LinkInlineProps | LinkStandaloneProps;
