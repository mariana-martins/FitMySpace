'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { Check, CircleAlert, Minus } from 'lucide-react';
import { Label, Text } from '../Typography';
import styles from './Checkbox.module.css';
import { forwardRef, useId } from 'react';
import clsx from 'clsx';

import type { CheckboxProps } from './Checkbox.types';
import { joinIds } from '../../utils';

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

const MARK_STROKE_WIDTH = 3;

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
            <Check
              className={styles['check-icon']}
              strokeWidth={MARK_STROKE_WIDTH}
              focusable="false"
            />
            <Minus
              className={styles['mixed-icon']}
              strokeWidth={MARK_STROKE_WIDTH}
              focusable="false"
            />
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
          <CircleAlert className={styles['error-icon']} aria-hidden="true" focusable="false" />
          <span id={errorId}>
            <VisuallyHidden>Error: </VisuallyHidden>
            {error}
          </span>
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
