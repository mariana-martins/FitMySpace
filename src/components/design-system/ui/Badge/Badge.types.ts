import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type BadgeVariant =
  'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'information';
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
  icon?: ReactElement;
  children: ReactNode;
};

export type BadgeProps = BadgeBaseProps &
  Omit<ComponentPropsWithoutRef<'span'>, keyof BadgeBaseProps | 'color'>;
