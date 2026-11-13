'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import styles from './SelectField.module.css';
import { Label, Text } from '../Typography';
import { CircleAlert } from 'lucide-react';
import { forwardRef, useId } from 'react';
import { Select } from '../Select';
import clsx from 'clsx';

import type { SelectFieldProps } from './SelectField.types';
import { joinIds } from '../../utils';

/* ---------------------------------------------------------------
 * SelectField
 *
 * Label + Select + hint + error, wired for assistive technology.
 *
 * DOM order is label → select → hint → error, so the hint is read
 * before the error. As in TextField, the error has no live region:
 * forms move focus to the first invalid field on submit.
 *
 * The ref points to the trigger <button>.
 * --------------------------------------------------------------- */

export const SelectField = forwardRef<HTMLButtonElement, SelectFieldProps>(
  function SelectField(props, ref) {
    const {
      label,
      hint,
      invalid = false,
      error,
      id,
      size = 'md',
      required,
      disabled,
      className,
      selectClassName,
      'aria-describedby': ariaDescribedBy,
      ...rest
    } = props;

    const generatedId = useId();
    const selectId = id ?? generatedId;
    const hintId = `${selectId}-hint`;
    const errorId = `${selectId}-error`;
    const hasError = Boolean(invalid && error && error.trim().length > 0);

    return (
      <div
        className={clsx(styles.root, className)}
        data-disabled={disabled || undefined}
        data-invalid={hasError || undefined}
      >
        <Label as="label" htmlFor={selectId} size={size} className={styles.label}>
          {label}
          {required && (
            <span className={styles['required-marker']} aria-hidden="true">
              *
            </span>
          )}
        </Label>

        <Select
          ref={ref}
          id={selectId}
          size={size}
          required={required}
          disabled={disabled}
          invalid={hasError}
          className={selectClassName}
          aria-describedby={joinIds(
            ariaDescribedBy,
            hint ? hintId : undefined,
            hasError ? errorId : undefined,
          )}
          {...rest}
        />

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
  },
);

SelectField.displayName = 'SelectField';
