import styles from './Badge.module.css';
import { forwardRef } from 'react';
import clsx from 'clsx';

import type { BadgeProps } from './Badge.types';

/* ---------------------------------------------------------------
 * Badge
 *
 * A short, static label for a status or category: "In stock",
 * "Bathroom", "New". Renders a <span> with no role, so screen
 * readers read it as plain text in the flow of its container.
 *
 * The ref points to the <span>.
 * --------------------------------------------------------------- */

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(props, ref) {
  const { variant, appearance, size, shape = 'pill', icon, children, className, ...rest } = props;

  return (
    <span
      ref={ref}
      className={clsx(
        styles.badge,
        styles[`${appearance}-${variant}` as keyof typeof styles],
        styles[`size-${size}` as keyof typeof styles],
        styles[`shape-${shape}` as keyof typeof styles],
        className,
      )}
      {...rest}
    >
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';
