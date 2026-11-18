import { Slot, Slottable } from '@radix-ui/react-slot';
import styles from './Breadcrumb.module.css';
import { DS_ICONS, Icon } from '../Icon';
import clsx from 'clsx';

import type { BreadcrumbItemProps, BreadcrumbLinkProps, BreadcrumbProps } from './Breadcrumb.types';
import type { Ref } from 'react';

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

export function Breadcrumb({ ref, ...props }: BreadcrumbProps & { ref?: Ref<HTMLElement> }) {
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
}

/* ---------------------------------------------------------------
 * BreadcrumbItem
 * --------------------------------------------------------------- */

export function BreadcrumbItem({
  className,
  children,
  ref,
  ...rest
}: BreadcrumbItemProps & { ref?: Ref<HTMLLIElement> }) {
  return (
    <li ref={ref} className={clsx(styles.item, className)} {...rest}>
      {children}
      <span className={styles.separator} aria-hidden="true">
        <Icon className={styles['separator-chevron']}>{DS_ICONS['chevron-right'].icon}</Icon>
        <span className={styles['separator-slash']}>/</span>
      </span>
    </li>
  );
}

/* ---------------------------------------------------------------
 * BreadcrumbLink
 * --------------------------------------------------------------- */

export function BreadcrumbLink({
  home = false,
  icon,
  asChild = false,
  className,
  children,
  ref,
  ...rest
}: BreadcrumbLinkProps & { ref?: Ref<HTMLAnchorElement> }) {
  const Component = asChild ? Slot : 'a';
  const leadingIcon = icon ?? (home ? 'home' : null);
  const iconElement = leadingIcon ? (
    <Icon className={styles.icon}>{DS_ICONS[leadingIcon].icon}</Icon>
  ) : null;

  return (
    <Component ref={ref} className={clsx(styles.link, className)} {...rest}>
      {iconElement}
      <Slottable>{children}</Slottable>
    </Component>
  );
}
