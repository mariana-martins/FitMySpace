import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { IconName } from '../Icon';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type ChipSize = 'sm' | 'md';

/* ---------------------------------------------------------------
 * Props
 *
 * A Chip is a toggle button: a native <button> with `aria-pressed`,
 * so screen readers announce "pressed" or "not pressed". Use it to
 * switch filters on and off, e.g. one chip per room.
 *
 * `selected` is required and controlled: the parent owns the state
 * (often in the URL) and updates it from `onSelectedChange`.
 * `aria-pressed` and `type` are omitted because the component sets them.
 * --------------------------------------------------------------- */

type ChipBaseProps = {
  selected: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** Defaults to `md`. */
  size?: ChipSize;
  /** One of the icons the design system ships, asked for by name. */
  icon?: IconName;
  children: ReactNode;
};

export type ChipProps = ChipBaseProps &
  Omit<ComponentPropsWithoutRef<'button'>, keyof ChipBaseProps | 'type' | 'aria-pressed'>;
