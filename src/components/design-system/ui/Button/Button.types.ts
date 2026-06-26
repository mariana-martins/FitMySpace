import type { ReactElement, ReactNode, ComponentPropsWithoutRef } from 'react';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'success'
  | 'warning'
  | 'information';

export type ButtonAppearance = 'fill' | 'outline';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
export type IconPosition = 'start' | 'end';

/* ---------------------------------------------------------------
 * Props — discriminated union for icon-only a11y enforcement
 *
 * When the button has visible text (`children`), `aria-label` is
 * optional. When the button is icon-only (no `children`), the
 * `aria-label` prop becomes required so that screen readers can
 * announce the button's purpose.
 * --------------------------------------------------------------- */

type ButtonBaseProps = {
  /** Visual color variant. */
  variant: ButtonVariant;
  /** Fill or outline appearance. */
  appearance: ButtonAppearance;
  /** Button size. */
  size: ButtonSize;
  /** Optional icon element (e.g. a Lucide icon). */
  icon?: ReactElement;
  /** Position of the icon relative to the text. */
  iconPosition?: IconPosition;
  /** Render as a child element (Radix Slot pattern). */
  asChild?: boolean;
};

/** Button with visible text — `aria-label` is optional. */
type ButtonWithChildren = ButtonBaseProps & {
  children: ReactNode;
  'aria-label'?: string;
} & Omit<ComponentPropsWithoutRef<'button'>, keyof ButtonBaseProps | 'children'>;

/** Icon-only button — `aria-label` is required (WCAG 4.1.2). */
type ButtonIconOnly = ButtonBaseProps & {
  children?: never;
  /** Required for icon-only buttons to provide an accessible name. */
  'aria-label': string;
} & Omit<ComponentPropsWithoutRef<'button'>, keyof ButtonBaseProps | 'children'>;

export type ButtonProps = ButtonWithChildren | ButtonIconOnly;
