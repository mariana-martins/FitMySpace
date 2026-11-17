import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { UtilityVariant } from '../../utils';
import type { IconName } from '../Icon';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

/** The brand roles plus the four utility roles that `Alert` and `Toast` use. */
export type BadgeVariant = 'primary' | 'secondary' | UtilityVariant;
export type BadgeAppearance = 'fill' | 'soft';
export type BadgeShape = 'pill' | 'rounded';
export type BadgeSize = 'sm' | 'md';

/* ---------------------------------------------------------------
 * Props
 *
 * A Badge is static text: a short status or category label. It is
 * not interactive, so it renders a <span> and never takes focus.
 * For something people click to filter or remove, use a button.
 *
 * `children` is required: a badge always has visible text, so its
 * meaning never depends on colour alone.
 * --------------------------------------------------------------- */

type BadgeBaseProps = {
  variant: BadgeVariant;
  appearance: BadgeAppearance;
  size: BadgeSize;
  shape?: BadgeShape;
  /** One of the icons the design system ships, asked for by name. */
  icon?: IconName;
  children: ReactNode;
};

export type BadgeProps = BadgeBaseProps &
  Omit<ComponentPropsWithoutRef<'span'>, keyof BadgeBaseProps | 'color'>;
