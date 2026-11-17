import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { IconName } from '../Icon';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type BreadcrumbSize = 'sm' | 'md';
export type BreadcrumbSeparator = 'chevron' | 'slash';

/* ---------------------------------------------------------------
 * Props
 *
 * A Breadcrumb shows where the user sits in the site hierarchy and
 * links back to every ancestor page. It renders a <nav> landmark
 * containing an ordered list (<ol>) because hierarchy order matters
 * (MDN).
 *
 * Give the current page's <BreadcrumbLink> `aria-current="page"`,
 * keeping it a link so the trail structure stays consistent.
 * --------------------------------------------------------------- */

export interface BreadcrumbProps extends ComponentPropsWithoutRef<'nav'> {
  size?: BreadcrumbSize;
  separator?: BreadcrumbSeparator;
  children: ReactNode;
}

export interface BreadcrumbItemProps extends ComponentPropsWithoutRef<'li'> {
  children: ReactNode;
}

export interface BreadcrumbLinkProps extends ComponentPropsWithoutRef<'a'> {
  home?: boolean;
  /** One of the icons the design system ships. `home` defaults it to the house. */
  icon?: IconName;
  asChild?: boolean;
}
