import styles from './Icon.module.css';
import { forwardRef } from 'react';
import clsx from 'clsx';

import type { IconProps } from './Icon.types';

/* ---------------------------------------------------------------
 * Icon
 *
 * The box every icon is drawn in, so the components stop repeating the
 * same span and the same two CSS rules. The ref points to the box, not
 * to the SVG: the box is what the row lays out and what assistive
 * technology sees.
 *
 * The accessibility decision lives here rather than at each call site,
 * because it is the same decision every time and the wrong answer is
 * invisible: an icon that should have been hidden gets read again after
 * its own label, and an icon that should have been named says nothing
 * at all. The props decide which, so nothing has to remember it:
 * `aria-hidden` is not part of the API, because writing it by hand next
 * to a `label` would hide the very name the label came for.
 * --------------------------------------------------------------- */

export const Icon = forwardRef<HTMLSpanElement, IconProps>(function Icon(props, ref) {
  const { size, label, className, ...rest } = props;

  return (
    <span
      ref={ref}
      {...rest}
      className={clsx(
        styles.icon,
        size && styles[`size-${size}` as keyof typeof styles],
        className,
      )}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true })}
    />
  );
});

Icon.displayName = 'Icon';
