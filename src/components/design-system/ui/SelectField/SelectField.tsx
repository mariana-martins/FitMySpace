'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import styles from './SelectField.module.css';
import { Label, Text } from '../Typography';
import { DS_ICONS, Icon } from '../Icon';
import { Select } from '../Select';
import { useId } from 'react';
import clsx from 'clsx';

import { UTILITY_VARIANT_ICONS, UTILITY_VARIANT_LABELS, joinIds } from '../../utils';
import type { SelectFieldProps } from './SelectField.types';
import type { Ref } from 'react';

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

export function SelectField({
  ref,
  ...props
}: SelectFieldProps & { ref?: Ref<HTMLButtonElement> }) {
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
          <Icon className={styles['error-icon']}>{DS_ICONS[UTILITY_VARIANT_ICONS.error].icon}</Icon>
          <span id={errorId}>
            <VisuallyHidden>{`${UTILITY_VARIANT_LABELS.error}: `}</VisuallyHidden>
            {error}
          </span>
        </p>
      )}
    </div>
  );
}
