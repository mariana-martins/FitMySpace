import { forwardRef} from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import styles from './Button.module.css';
import clsx from 'clsx';

import type { ButtonProps } from './Button.types';

/* ---------------------------------------------------------------
 * Button
 * --------------------------------------------------------------- */

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
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

  const variantClass = styles[`${appearance}-${variant}` as keyof typeof styles];
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
      <Slot {...sharedProps} aria-disabled={disabled ? true : undefined}>
        {iconElement && iconPosition === 'start' && iconElement}
        <Slottable>{children}</Slottable>
        {iconElement && iconPosition === 'end' && iconElement}
      </Slot>
    );
  }

  return (
    <button {...sharedProps} type="button" disabled={disabled}>
      {iconElement && iconPosition === 'start' && iconElement}
      {children}
      {iconElement && iconPosition === 'end' && iconElement}
    </button>
  );
});

Button.displayName = 'Button';
