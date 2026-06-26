import { forwardRef, type ReactElement, type ReactNode } from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import clsx from 'clsx';
import styles from './Button.module.css';

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
} & Omit<React.ComponentPropsWithoutRef<'button'>, keyof ButtonBaseProps | 'children'>;

/** Icon-only button — `aria-label` is required (WCAG 4.1.2). */
type ButtonIconOnly = ButtonBaseProps & {
  children?: never;
  /** Required for icon-only buttons to provide an accessible name. */
  'aria-label': string;
} & Omit<React.ComponentPropsWithoutRef<'button'>, keyof ButtonBaseProps | 'children'>;

export type ButtonProps = ButtonWithChildren | ButtonIconOnly;

/* ---------------------------------------------------------------
 * Button
 * --------------------------------------------------------------- */

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    const {
      variant,
      appearance,
      size,
      icon,
      iconPosition = 'start',
      asChild = false,
      disabled,
      className,
      children,
      onClick,
      ...rest
    } = props;

    const isIconOnly = !children && !!icon;

    const variantClass =
      styles[`${appearance}-${variant}` as keyof typeof styles];
    const sizeClass = styles[`size-${size}` as keyof typeof styles];

    const composedClassName = clsx(
      styles.button,
      variantClass,
      sizeClass,
      isIconOnly && styles['icon-only'],
      className,
    );

    const iconElement = icon ? (
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
    ) : null;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      if (onClick) {
        onClick(e);
      }
    };

    const sharedProps = {
      ref,
      className: composedClassName,
      onClick: handleClick,
      ...rest,
    };

    /*
     * When asChild is true, Radix Slot replaces the wrapper element
     * with the child element (e.g. <a>), merging all props/classes.
     * Slottable marks which part of children is the "slot target".
     */
    if (asChild) {
      return (
        <Slot
          {...sharedProps}
          aria-disabled={disabled ? true : undefined}
        >
          {iconElement && iconPosition === 'start' && iconElement}
          <Slottable>{children}</Slottable>
          {iconElement && iconPosition === 'end' && iconElement}
        </Slot>
      );
    }

    return (
      <button
        {...sharedProps}
        type="button"
        disabled={disabled}
      >
        {iconElement && iconPosition === 'start' && iconElement}
        {children}
        {iconElement && iconPosition === 'end' && iconElement}
      </button>
    );
  },
);

Button.displayName = 'Button';
