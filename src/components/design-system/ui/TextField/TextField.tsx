'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import styles from './TextField.module.css';
import { Label, Text } from '../Typography';
import { CircleAlert } from 'lucide-react';
import { forwardRef, useId } from 'react';
import { Input } from '../Input';
import clsx from 'clsx';

import type { TextFieldProps } from './TextField.types';
import { joinIds } from '../../utils';

/* ---------------------------------------------------------------
 * TextField
 *
 * Label + Input + hint + error, wired for assistive technology.
 *
 * DOM order is label → input → hint → error, so the hint is read
 * before the error. The error has no live region on purpose: forms
 * should move focus to the first invalid field (or an error summary)
 * on submit, and a live region would announce the message twice.
 *
 * The ref points to the <input>.
 * --------------------------------------------------------------- */

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(props, ref) {
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
      inputClassName,
      'aria-describedby': ariaDescribedBy,
      ...rest
    } = props;

    const generatedId = useId();
    const inputId = id ?? generatedId;
    const hintId = `${inputId}-hint`;
    const errorId = `${inputId}-error`;
    const hasError = Boolean(invalid && error && error.trim().length > 0);

    return (
      <div
        className={clsx(styles.root, className)}
        data-disabled={disabled || undefined}
        data-invalid={hasError || undefined}
      >
        <Label as="label" htmlFor={inputId} size={size} className={styles.label}>
          {label}
          {required && (
            <span className={styles['required-marker']} aria-hidden="true">
              *
            </span>
          )}
        </Label>

        <Input
          ref={ref}
          id={inputId}
          size={size}
          required={required}
          disabled={disabled}
          invalid={hasError}
          className={inputClassName}
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

TextField.displayName = 'TextField';
