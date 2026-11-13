import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import styles from './TextareaField.module.css';
import { Label, Text } from '../Typography';
import { CircleAlert } from 'lucide-react';
import { forwardRef, useId } from 'react';
import { Textarea } from '../Textarea';
import clsx from 'clsx';

import type { TextareaFieldProps } from './TextareaField.types';
import { joinIds } from '../../utils';

/* ---------------------------------------------------------------
 * TextareaField
 *
 * Label + Textarea + hint + error, wired for assistive technology.
 *
 * DOM order is label → textarea → hint → error, so the hint is read
 * before the error. The error has no live region on purpose: forms
 * should move focus to the first invalid field (or an error summary)
 * on submit, and a live region would announce the message twice.
 *
 * No 'use client': useId works in Server Components, and Textarea has
 * no hooks, so the whole field renders on the server.
 *
 * The ref points to the <textarea>.
 * --------------------------------------------------------------- */

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  function TextareaField(props, ref) {
    const {
      label,
      hint,
      invalid = false,
      error,
      id,
      size = 'md',
      resize = 'vertical',
      rows,
      required,
      disabled,
      className,
      textareaClassName,
      'aria-describedby': ariaDescribedBy,
      ...rest
    } = props;

    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const hintId = `${textareaId}-hint`;
    const errorId = `${textareaId}-error`;
    const hasError = Boolean(invalid && error && error.trim().length > 0);

    return (
      <div
        className={clsx(styles.root, className)}
        data-disabled={disabled || undefined}
        data-invalid={hasError || undefined}
      >
        <Label as="label" htmlFor={textareaId} size={size} className={styles.label}>
          {label}
          {required && (
            <span className={styles['required-marker']} aria-hidden="true">
              *
            </span>
          )}
        </Label>

        <Textarea
          ref={ref}
          id={textareaId}
          size={size}
          resize={resize}
          rows={rows}
          required={required}
          disabled={disabled}
          invalid={hasError}
          className={textareaClassName}
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

TextareaField.displayName = 'TextareaField';
