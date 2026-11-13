import { Slot, Slottable } from '@radix-ui/react-slot';
import { ChevronRight, Home } from 'lucide-react';
import styles from './Breadcrumb.module.css';
import { forwardRef } from 'react';
import clsx from 'clsx';

import type { BreadcrumbItemProps, BreadcrumbLinkProps, BreadcrumbProps } from './Breadcrumb.types';

/* ---------------------------------------------------------------
 * Breadcrumb
 *
 * A <nav> landmark containing an ordered list (<ol>) of steps in
 * the site hierarchy. Dividers sit inside each <li> as aria-hidden
 * decorative elements so screen readers announce the exact item
 * count without reading separators aloud.
 *
 * Each item renders both separators and the list's data-separator
 * attribute picks one in CSS. Without a React context there are no
 * client hooks, so the whole trail renders on the server.
 *
 * `BreadcrumbLink` uses Radix `Slot` when `asChild` is true so
 * framework links such as Next.js `<Link>` inherit its styles and
 * `aria-current="page"` state.
 * --------------------------------------------------------------- */

export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(props, ref) {
  const {
    size = 'md',
    separator = 'chevron',
    className,
    children,
    'aria-label': ariaLabel,
    ...rest
  } = props;

  const accessibleLabel = ariaLabel ?? (rest['aria-labelledby'] ? undefined : 'Breadcrumb');

  return (
    <nav
      ref={ref}
      aria-label={accessibleLabel}
      className={clsx(styles[`size-${size}` as keyof typeof styles], className)}
      {...rest}
    >
      <ol className={styles.list} data-separator={separator}>
        {children}
      </ol>
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';

/* ---------------------------------------------------------------
 * BreadcrumbItem
 * --------------------------------------------------------------- */

export const BreadcrumbItem = forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  function BreadcrumbItem({ className, children, ...rest }, ref) {
    return (
      <li ref={ref} className={clsx(styles.item, className)} {...rest}>
        {children}
        <span className={styles.separator} aria-hidden="true">
          <ChevronRight className={styles['separator-chevron']} focusable="false" />
          <span className={styles['separator-slash']}>/</span>
        </span>
      </li>
    );
  },
);

BreadcrumbItem.displayName = 'BreadcrumbItem';

/* ---------------------------------------------------------------
 * BreadcrumbLink
 * --------------------------------------------------------------- */

export const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  function BreadcrumbLink(
    { home = false, icon, asChild = false, className, children, ...rest },
    ref,
  ) {
    const Component = asChild ? Slot : 'a';
    const leadingIcon = icon ?? (home ? <Home focusable="false" /> : null);
    const iconElement = leadingIcon ? (
      <span className={styles.icon} aria-hidden="true">
        {leadingIcon}
      </span>
    ) : null;

    return (
      <Component ref={ref} className={clsx(styles.link, className)} {...rest}>
        {iconElement}
        <Slottable>{children}</Slottable>
      </Component>
    );
  },
);

BreadcrumbLink.displayName = 'BreadcrumbLink';
