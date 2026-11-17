import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { HeadingLevel } from '../Typography';
import type { IconName } from '../Icon';

/* ---------------------------------------------------------------
 * Props
 *
 * EmptyState fills the space of a list or page that has nothing to
 * show, such as a search with no results: a decorative icon, a
 * heading that says what happened, a description that says what to
 * do, and optional actions passed as children.
 *
 * It is static content. To announce "no results" to screen readers,
 * update a live region that is already on the page, such as the
 * results summary; a region inserted together with its text is often
 * not read.
 * --------------------------------------------------------------- */

export interface EmptyStateProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  title: string;
  headingLevel?: HeadingLevel;
  description?: ReactNode;
  /** One of the icons the design system ships. Defaults to `search-x`. */
  icon?: IconName;
  children?: ReactNode;
}
