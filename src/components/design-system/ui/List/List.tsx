import { DS_ICONS, Icon } from '../Icon';
import type { ElementType } from 'react';
import styles from './List.module.css';
import { forwardRef } from 'react';
import clsx from 'clsx';

import type { ListItemProps, ListProps } from './List.types';

/* ---------------------------------------------------------------
 * List
 *
 * A `<ul>` (or `<ol>`) of rows. The rows take their size and look from
 * the list's classes, so no context is needed and both parts render on
 * the server.
 *
 * `role="list"` is written out on purpose: with `list-style: none`,
 * Safari stops telling VoiceOver that a list is a list, and the count
 * ("list, 4 items") is part of what the reader needs.
 * --------------------------------------------------------------- */

export const List = forwardRef<HTMLElement, ListProps>(function List(props, ref) {
  const {
    as = 'ul',
    appearance = 'plain',
    size = 'md',
    dividers = true,
    className,
    ...rest
  } = props;
  // `ul` or `ol`; typed loosely, as `Text` types its own element.
  const Component = as as ElementType;

  return (
    <Component
      ref={ref}
      role="list"
      className={clsx(
        styles.list,
        styles[appearance],
        styles[`size-${size}` as keyof typeof styles],
        dividers && styles.dividers,
        className,
      )}
      {...rest}
    />
  );
});

List.displayName = 'List';

/* ---------------------------------------------------------------
 * ListItem
 *
 * The title takes the row's title style unless it brings its own (a
 * Checkbox or Switch keeps its label). A title that is a stretched
 * Link turns the whole row into its click area; the trailing slot sits
 * above that area, so a button there still gets its own clicks.
 * --------------------------------------------------------------- */

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(function ListItem(props, ref) {
  const { icon, leading, description, trailing, children, className, ...rest } = props;

  return (
    <li ref={ref} className={clsx(styles.item, className)} {...rest}>
      {icon && (
        <span className={styles.leading}>
          <Icon className={styles['leading-icon']}>{DS_ICONS[icon].icon}</Icon>
        </span>
      )}
      {leading && <span className={styles['leading-custom']}>{leading}</span>}

      <div className={styles.text}>
        <div className={styles.title}>{children}</div>
        {description && <div className={styles.description}>{description}</div>}
      </div>

      {trailing && <div className={styles.trailing}>{trailing}</div>}
    </li>
  );
});

ListItem.displayName = 'ListItem';
