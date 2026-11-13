import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type PaginationSize = 'sm' | 'md';

export type PaginationRangeItem = number | 'start-ellipsis' | 'end-ellipsis';

/* ---------------------------------------------------------------
 * Props
 *
 * Pagination is a <nav> landmark holding an ordered list of links,
 * one per page, because each page has its own URL (the page lives in
 * the search params). Build the list with `getPaginationRange`.
 *
 * The page links and Previous / Next take `asChild` (Radix Slot) for
 * Next.js `<Link>`: the child is the router link and the component
 * fills in its content.
 * --------------------------------------------------------------- */

export interface PaginationProps extends ComponentPropsWithoutRef<'nav'> {
  size?: PaginationSize;
  children: ReactNode;
}

export type PaginationItemProps = ComponentPropsWithoutRef<'li'>;

type PaginationAnchorProps = Omit<ComponentPropsWithoutRef<'a'>, 'children'> & {
  asChild?: boolean;
  children?: ReactElement;
};

export type PaginationLinkProps = PaginationAnchorProps & {
  page: number;
};

export type PaginationDirectionProps = PaginationAnchorProps & {
  label?: string;
  disabled?: boolean;
};

export type PaginationEllipsisProps = ComponentPropsWithoutRef<'span'>;
