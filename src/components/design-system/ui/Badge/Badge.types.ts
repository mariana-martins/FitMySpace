import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type BadgeVariant =
  | 'brand'
  | 'subtle'
  | 'success'
  | 'error'
  | 'warning'
  | 'information';

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
export type BadgeShape = 'square' | 'rounded';

/* ---------------------------------------------------------------
 * Props
 * --------------------------------------------------------------- */

type BadgeBaseProps = {
  /** Semantic color variant. */
  variant: BadgeVariant;
  /** Size of the badge. */
  size: BadgeSize;
  /** Shape of the badge. Defaults to 'rounded'. */
  shape?: BadgeShape;
  /** Textual content of the badge. */
  children: ReactNode;
};

export type BadgeProps = BadgeBaseProps &
  Omit<ComponentPropsWithoutRef<'span'>, keyof BadgeBaseProps>;
