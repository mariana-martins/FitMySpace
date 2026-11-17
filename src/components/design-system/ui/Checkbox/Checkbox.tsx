'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { Label, Text } from '../Typography';
import styles from './Checkbox.module.css';
import { forwardRef, useId } from 'react';
import { DS_ICONS, Icon } from '../Icon';
import clsx from 'clsx';

import { UTILITY_VARIANT_ICONS, UTILITY_VARIANT_LABELS, joinIds } from '../../utils';
import type { CheckboxProps } from './Checkbox.types';

/* ---------------------------------------------------------------
 * Checkbox
 *
 * Built on Radix Checkbox: a <button role="checkbox"> drawn as the
 * box, with aria-checked "true", "false" or "mixed". Radix handles
 * the Space key (Enter does nothing, as on a native checkbox) and,
 * inside a <form>, renders a hidden native checkbox after the
 * button so the value submits and resets with the form.
 *
 * The check and mixed marks are both always mounted (forceMount) and
 * shown by the indicator's data-state, so they can fade in and out.
 *
 * DOM order is box → label → hint → error, so the hint is read
 * before the error. As in TextField, the error has no live region:
 * forms move focus to the first invalid field on submit.
 *
 * The ref points to the <button>.
 * --------------------------------------------------------------- */

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(props, ref) {
  const {
    label,
    hint,
    variant = 'primary',
    size = 'md',
    invalid = false,
    error,
    id,
    required,
    disabled,
    className,
    'aria-describedby': ariaDescribedBy,
    ...rest
  } = props;

  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  const hintId = `${checkboxId}-hint`;
  const errorId = `${checkboxId}-error`;
  const hasError = Boolean(invalid && error && error.trim().length > 0);

  return (
    <div
      className={clsx(
        styles.root,
        styles[`variant-${variant}` as keyof typeof styles],
        styles[`size-${size}` as keyof typeof styles],
        className,
      )}
      data-disabled={disabled || undefined}
      data-invalid={hasError || undefined}
    >
      <span className={styles.control}>
        <RadixCheckbox.Root
          ref={ref}
          id={checkboxId}
          className={styles.box}
          required={required}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={joinIds(
            ariaDescribedBy,
            hint ? hintId : undefined,
            hasError ? errorId : undefined,
          )}
          {...rest}
        >
          <RadixCheckbox.Indicator forceMount className={styles.mark} aria-hidden="true">
            <Icon className={styles['check-icon']}>{DS_ICONS.check.icon}</Icon>
            <Icon className={styles['mixed-icon']}>{DS_ICONS.minus.icon}</Icon>
          </RadixCheckbox.Indicator>
        </RadixCheckbox.Root>
      </span>

      <Label as="label" htmlFor={checkboxId} size={size} className={styles.label}>
        {label}
        {required && (
          <span className={styles['required-marker']} aria-hidden="true">
            *
          </span>
        )}
      </Label>

      {hint && (
        <Text as="p" size="sm" id={hintId} className={styles.hint}>
          {hint}
        </Text>
      )}

      {hasError && (
        <p className={styles.error}>
          <Icon className={styles['error-icon']}>{DS_ICONS[UTILITY_VARIANT_ICONS.error].icon}</Icon>
          <span id={errorId}>
            <VisuallyHidden>{`${UTILITY_VARIANT_LABELS.error}: `}</VisuallyHidden>
            {error}
          </span>
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
