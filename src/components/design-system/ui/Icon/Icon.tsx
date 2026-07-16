import { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './Icon.module.css';

import type { IconProps } from './Icon.types';

/* ---------------------------------------------------------------
 * Icon
 * --------------------------------------------------------------- */

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(props, ref) {
  const {
    icon: LucideComponent,
    size,
    color,
    strokeWidth = 2,
    className,
    'aria-label': ariaLabel,
    'aria-hidden': ariaHiddenProp,
    ...rest
  } = props;

  /*
   * Accessibility heuristic (WCAG 1.1.1 / 4.1.2):
   * - When `aria-label` is provided, the icon is meaningful:
   *   expose it with `role="img"` and the accessible name.
   * - When omitted, the icon is decorative:
   *   hide it from assistive technology via `aria-hidden="true"`.
   * - An explicit `aria-hidden` prop always takes precedence.
   */
  const isDecorative = !ariaLabel;
  const ariaHidden = ariaHiddenProp ?? (isDecorative ? true : undefined);

  const sizeClass = styles[`size-${size}` as keyof typeof styles];
  const colorClass = styles[`color-${color}` as keyof typeof styles];

  return (
    <LucideComponent
      ref={ref}
      className={clsx(styles.icon, sizeClass, colorClass, className)}
      strokeWidth={strokeWidth}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      {...rest}
    />
  );
});

Icon.displayName = 'Icon';
