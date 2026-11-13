import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import styles from './Pagination.module.css';
import { forwardRef } from 'react';
import clsx from 'clsx';

import type {
  PaginationDirectionProps,
  PaginationEllipsisProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationProps,
} from './Pagination.types';

/* ---------------------------------------------------------------
 * Pagination
 *
 * A <nav> landmark with an ordered list of page links. The current
 * page is a link with aria-current="page", like the Breadcrumb.
 * Radix has no pagination primitive; Slot gives the links asChild.
 * No client hooks, so it renders on the server.
 * --------------------------------------------------------------- */

export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(props, ref) {
  const { size = 'md', className, children, 'aria-label': ariaLabel, ...rest } = props;
  const accessibleLabel = ariaLabel ?? (rest['aria-labelledby'] ? undefined : 'Pagination');

  return (
    <nav
      ref={ref}
      aria-label={accessibleLabel}
      className={clsx(styles[`size-${size}` as keyof typeof styles], className)}
      {...rest}
    >
      <ol className={styles.list}>{children}</ol>
    </nav>
  );
});

Pagination.displayName = 'Pagination';

export const PaginationItem = forwardRef<HTMLLIElement, PaginationItemProps>(
  function PaginationItem({ className, ...rest }, ref) {
    return <li ref={ref} className={clsx(styles.item, className)} {...rest} />;
  },
);

PaginationItem.displayName = 'PaginationItem';

/* ---------------------------------------------------------------
 * PaginationLink
 *
 * Shows the number and reads as "Page 3", so a screen reader list
 * of links makes sense out of context.
 * --------------------------------------------------------------- */

export const PaginationLink = forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  function PaginationLink({ page, asChild = false, className, children, ...rest }, ref) {
    const Component = asChild ? Slot : 'a';

    return (
      <Component ref={ref} className={clsx(styles.control, styles.page, className)} {...rest}>
        <Slottable>{children}</Slottable>
        <VisuallyHidden>Page </VisuallyHidden>
        {page}
      </Component>
    );
  },
);

PaginationLink.displayName = 'PaginationLink';

/* ---------------------------------------------------------------
 * PaginationPrevious and PaginationNext
 * --------------------------------------------------------------- */

const PaginationDirection = forwardRef<
  HTMLAnchorElement,
  PaginationDirectionProps & { direction: 'previous' | 'next' }
>(function PaginationDirection(props, ref) {
  const {
    direction,
    label,
    disabled = false,
    asChild = false,
    className,
    children,
    ...rest
  } = props;
  const text = label ?? (direction === 'previous' ? 'Previous' : 'Next');
  const Icon = direction === 'previous' ? ChevronLeft : ChevronRight;
  const icon = <Icon className={styles.icon} aria-hidden="true" focusable="false" />;
  const content = (
    <>
      {direction === 'previous' && icon}
      <span>
        {text}
        <VisuallyHidden> page</VisuallyHidden>
      </span>
      {direction === 'next' && icon}
    </>
  );
  const classNames = clsx(styles.control, styles.direction, className);

  if (disabled) {
    return (
      <span className={classNames} data-disabled="" aria-hidden="true">
        {content}
      </span>
    );
  }

  const Component = asChild ? Slot : 'a';

  return (
    <Component
      ref={ref}
      className={classNames}
      rel={direction === 'previous' ? 'prev' : 'next'}
      {...rest}
    >
      <Slottable>{children}</Slottable>
      {content}
    </Component>
  );
});

export const PaginationPrevious = forwardRef<HTMLAnchorElement, PaginationDirectionProps>(
  function PaginationPrevious(props, ref) {
    return <PaginationDirection ref={ref} direction="previous" {...props} />;
  },
);

PaginationPrevious.displayName = 'PaginationPrevious';

export const PaginationNext = forwardRef<HTMLAnchorElement, PaginationDirectionProps>(
  function PaginationNext(props, ref) {
    return <PaginationDirection ref={ref} direction="next" {...props} />;
  },
);

PaginationNext.displayName = 'PaginationNext';

/* ---------------------------------------------------------------
 * PaginationEllipsis
 *
 * The glyph is hidden; screen readers hear "More pages" instead of
 * "horizontal ellipsis".
 * --------------------------------------------------------------- */

export const PaginationEllipsis = forwardRef<HTMLSpanElement, PaginationEllipsisProps>(
  function PaginationEllipsis({ className, ...rest }, ref) {
    return (
      <span ref={ref} className={clsx(styles.control, styles.ellipsis, className)} {...rest}>
        <span aria-hidden="true">…</span>
        <VisuallyHidden>More pages</VisuallyHidden>
      </span>
    );
  },
);

PaginationEllipsis.displayName = 'PaginationEllipsis';
