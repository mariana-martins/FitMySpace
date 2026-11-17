'use client';

import { DS_ICONS, Icon } from '../Icon';
import styles from './Chip.module.css';
import { forwardRef } from 'react';
import clsx from 'clsx';

import type { MouseEvent } from 'react';

import type { ChipProps } from './Chip.types';

/* ---------------------------------------------------------------
 * Chip
 *
 * A toggle button for filters. The text never changes with the
 * state (MDN: a toggle's label stays the same); `aria-pressed`
 * carries the state, and a check mark plus a thicker brand edge
 * show it, so it never relies on colour alone.
 *
 * The ref points to the <button>.
 * --------------------------------------------------------------- */

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(props, ref) {
  const { selected, onSelectedChange, size, icon, children, className, onClick, ...rest } = props;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) onSelectedChange?.(!selected);
  };

  const leadingIcon = selected ? 'check' : icon;

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      className={clsx(styles.chip, styles[`size-${size}` as keyof typeof styles], className)}
      onClick={handleClick}
      {...rest}
    >
      {leadingIcon && <Icon className={styles.icon}>{DS_ICONS[leadingIcon].icon}</Icon>}
      {children}
    </button>
  );
});

Chip.displayName = 'Chip';
