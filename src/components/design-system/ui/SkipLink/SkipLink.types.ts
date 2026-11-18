import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/* ---------------------------------------------------------------
 * Props
 *
 * A link to the page's main content, the first focusable thing on
 * every page. It is out of sight until it takes the focus, then it
 * slides in at the top of the window, so a keyboard user can pass
 * the header and its navigation in one key press (WCAG 2.4.1).
 *
 * `href` is not a prop: the link always points at an id on the page,
 * so `targetId` names that id (`main-content` unless told otherwise),
 * and the element with it is usually `<main>`.
 * --------------------------------------------------------------- */

export interface SkipLinkProps extends Omit<ComponentPropsWithoutRef<'a'>, 'href'> {
  /** The id of the element the link skips to. Defaults to `main-content`. */
  targetId?: string;
  /** The words of the link. Defaults to "Skip to content". */
  children?: ReactNode;
}
