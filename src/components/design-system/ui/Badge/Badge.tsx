import { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './Badge.module.css';

import type { BadgeProps } from './Badge.types';

/* ---------------------------------------------------------------
 * Badge
 * --------------------------------------------------------------- */

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(props, ref) {
  const {
    variant,
    size,
    shape = 'rounded',
    className,
    children,
    ...rest
  } = props;

  const variantClass = styles[`variant-${variant}` as keyof typeof styles];
  const sizeClass = styles[`size-${size}` as keyof typeof styles];
  const shapeClass = styles[`shape-${shape}` as keyof typeof styles];

  const composedClassName = clsx(
    styles.badge,
    variantClass,
    sizeClass,
    shapeClass,
    className,
  );

  return (
    <span ref={ref} className={composedClassName} {...rest}>
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';
