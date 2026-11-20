import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Slot, Slottable } from '@radix-ui/react-slot';
import styles from './Pagination.module.css';
import { DS_ICONS, Icon } from '../Icon';
import clsx from 'clsx';

import type {
  PaginationDirectionProps,
  PaginationEllipsisProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationProps,
} from './Pagination.types';
import type { Ref } from 'react';

/* ---------------------------------------------------------------
 * Pagination
 *
 * A <nav> landmark with an ordered list of page links. The current
 * page is a link with aria-current="page", like the Breadcrumb.
 * Radix has no pagination primitive; Slot gives the links asChild.
 * No client hooks, so it renders on the server.
 * --------------------------------------------------------------- */

export function Pagination({ ref, ...props }: PaginationProps & { ref?: Ref<HTMLElement> }) {
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
}

export function PaginationItem({
  className,
  ref,
  ...rest
}: PaginationItemProps & { ref?: Ref<HTMLLIElement> }) {
  return <li ref={ref} className={clsx(styles.item, className)} {...rest} />;
}

/* ---------------------------------------------------------------
 * PaginationLink
 *
 * Shows the number and reads as "Page 3", so a screen reader list
 * of links makes sense out of context.
 * --------------------------------------------------------------- */

export function PaginationLink({
  page,
  asChild = false,
  className,
  children,
  ref,
  ...rest
}: PaginationLinkProps & { ref?: Ref<HTMLAnchorElement> }) {
  const Component = asChild ? Slot : 'a';

  return (
    <Component ref={ref} className={clsx(styles.control, styles.page, className)} {...rest}>
      <Slottable>{children}</Slottable>
      <VisuallyHidden>Page </VisuallyHidden>
      {page}
    </Component>
  );
}

/* ---------------------------------------------------------------
 * PaginationPrevious and PaginationNext
 * --------------------------------------------------------------- */

function PaginationDirection({
  ref,
  ...props
}: PaginationDirectionProps & { direction: 'previous' | 'next' } & {
  ref?: Ref<HTMLAnchorElement>;
}) {
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
  const chevron = direction === 'previous' ? 'chevron-left' : 'chevron-right';
  const icon = <Icon className={styles.icon}>{DS_ICONS[chevron].icon}</Icon>;
  const content = (
    <>
      {direction === 'previous' && icon}
      {/* The visible word goes on narrow screens; the hidden name keeps it in every width. */}
      <span className={styles['direction-text']} aria-hidden="true">
        {text}
      </span>
      <VisuallyHidden>{text} page</VisuallyHidden>
      {direction === 'next' && icon}
    </>
  );
  const classNames = clsx(styles.control, styles.direction, className);

  /* At either end the direction stays on screen, greyed, so the centred row keeps its width
     and the page numbers do not shift. It is a disabled link, the W3C way: no `href`, so it
     takes no focus, with `role="link"` and `aria-disabled`, so screen readers say it is
     there but unavailable, and the contrast minimum does not apply to it. */
  if (disabled) {
    return (
      <span className={classNames} data-disabled="" role="link" aria-disabled="true">
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
}

export function PaginationPrevious({
  ref,
  ...props
}: PaginationDirectionProps & { ref?: Ref<HTMLAnchorElement> }) {
  return <PaginationDirection ref={ref} direction="previous" {...props} />;
}

export function PaginationNext({
  ref,
  ...props
}: PaginationDirectionProps & { ref?: Ref<HTMLAnchorElement> }) {
  return <PaginationDirection ref={ref} direction="next" {...props} />;
}

/* ---------------------------------------------------------------
 * PaginationEllipsis
 *
 * The glyph is hidden; screen readers hear "More pages" instead of
 * "horizontal ellipsis".
 * --------------------------------------------------------------- */

export function PaginationEllipsis({
  className,
  ref,
  ...rest
}: PaginationEllipsisProps & { ref?: Ref<HTMLSpanElement> }) {
  return (
    <span ref={ref} className={clsx(styles.control, styles.ellipsis, className)} {...rest}>
      <span aria-hidden="true">…</span>
      <VisuallyHidden>More pages</VisuallyHidden>
    </span>
  );
}
