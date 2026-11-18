import type { ReactNode, ComponentPropsWithoutRef } from 'react';
import type { UtilityVariant } from '../../utils';
import type { IconName } from '../Icon';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

/** The brand roles plus the four utility roles that `Alert` and `Toast` use. */
export type ButtonVariant = 'primary' | 'secondary' | UtilityVariant;

export type ButtonAppearance = 'fill' | 'outline' | 'ghost';
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
  /** Visual colour variant. Defaults to `primary`. */
  variant?: ButtonVariant;
  /** Fill, outline or ghost appearance. Defaults to `fill`. */
  appearance?: ButtonAppearance;
  /** Button size. Defaults to `md`. */
  size?: ButtonSize;
  /** One of the icons the design system ships, asked for by name. */
  icon?: IconName;
  /** Position of the icon relative to the text. */
  iconPosition?: IconPosition;
  /** Render as a child element (Radix Slot pattern). */
  asChild?: boolean;
  /**
   * Native button type. Defaults to `"button"` so a button inside a form
   * never submits by accident. Use `"submit"` for the form's main action.
   * Ignored when `asChild` is true.
   */
  type?: 'button' | 'submit' | 'reset';
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
