'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import * as RadixSwitch from '@radix-ui/react-switch';
import { Label, Text } from '../Typography';
import { CircleAlert } from 'lucide-react';
import { forwardRef, useId } from 'react';
import styles from './Switch.module.css';
import clsx from 'clsx';

import type { SwitchProps } from './Switch.types';
import { joinIds } from '../../utils';

/* ---------------------------------------------------------------
 * Switch
 *
 * Built on Radix Switch: a <button role="switch"> drawn as the
 * track, with aria-checked "true" or "false" and a decorative thumb
 * inside it. Space toggles it, as the WAI-ARIA switch pattern asks;
 * Enter does too, because Radix draws it as a <button>. Inside a
 * <form>, once hydrated, Radix renders a hidden native checkbox after
 * the button so the value submits and resets with the form.
 *
 * The state reads from the side the knob sits on and from the knob's
 * own colour, so it never rests on the track colour alone.
 *
 * DOM order is track → label → hint → error, so the hint is read
 * before the error. As in TextField, the error has no live region:
 * a switch applies its setting at once, and forms move focus to the
 * first invalid field on submit.
 *
 * The ref points to the <button>.
 * --------------------------------------------------------------- */

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(props, ref) {
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
  const switchId = id ?? generatedId;
  const hintId = `${switchId}-hint`;
  const errorId = `${switchId}-error`;
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
        <RadixSwitch.Root
          ref={ref}
          id={switchId}
          className={styles.track}
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
          <RadixSwitch.Thumb className={styles.thumb} aria-hidden="true" />
        </RadixSwitch.Root>
      </span>

      <Label as="label" htmlFor={switchId} size={size} className={styles.label}>
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

Switch.displayName = 'Switch';
