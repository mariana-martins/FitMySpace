'use client';

import { createContext, forwardRef, useContext, useId } from 'react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import * as RadixRadioGroup from '@radix-ui/react-radio-group';
import styles from './RadioGroup.module.css';
import { Label, Text } from '../Typography';
import { CircleAlert } from 'lucide-react';
import { joinIds } from '../../utils';
import clsx from 'clsx';

import type { RadioGroupItemProps, RadioGroupProps, RadioGroupSize } from './RadioGroup.types';

/* ---------------------------------------------------------------
 * RadioGroup
 *
 * Built on Radix RadioGroup: a <div role="radiogroup"> holding one
 * <button role="radio"> per option. Radix handles the keyboard as
 * MDN describes (Tab enters on the checked option, arrows move and
 * check, Space checks) and, inside a <form>, a hidden native radio
 * per option so the value submits and resets with the form.
 *
 * DOM order is group label → options → hint → error, as in
 * SelectField. As in TextField, the error has no live region: forms
 * move focus to the first invalid field on submit.
 *
 * The group's ref points to the radiogroup <div>; each item's ref
 * points to its <button>.
 * --------------------------------------------------------------- */

/** The items size their label from the group, so the size is set once. */
const RadioGroupSizeContext = createContext<RadioGroupSize>('md');

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup(props, ref) {
    const {
      label,
      hint,
      variant = 'primary',
      size = 'md',
      orientation = 'vertical',
      invalid = false,
      error,
      id,
      required,
      disabled,
      className,
      children,
      'aria-describedby': ariaDescribedBy,
      ...rest
    } = props;

    const generatedId = useId();
    const groupId = id ?? generatedId;
    const labelId = `${groupId}-label`;
    const hintId = `${groupId}-hint`;
    const errorId = `${groupId}-error`;
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
        <Label id={labelId} size={size} className={styles['group-label']}>
          {label}
          {required && (
            <span className={styles['required-marker']} aria-hidden="true">
              *
            </span>
          )}
        </Label>

        <RadioGroupSizeContext.Provider value={size}>
          <RadixRadioGroup.Root
            ref={ref}
            id={groupId}
            className={styles.options}
            data-orientation={orientation}
            required={required}
            disabled={disabled}
            aria-labelledby={labelId}
            aria-invalid={hasError || undefined}
            aria-describedby={joinIds(
              ariaDescribedBy,
              hint ? hintId : undefined,
              hasError ? errorId : undefined,
            )}
            {...rest}
          >
            {children}
          </RadixRadioGroup.Root>
        </RadioGroupSizeContext.Provider>

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

RadioGroup.displayName = 'RadioGroup';

/* ---------------------------------------------------------------
 * RadioGroupItem
 *
 * The dot is always mounted (forceMount) and shown by the
 * indicator's data-state, so it can scale in and out.
 * --------------------------------------------------------------- */

export const RadioGroupItem = forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  function RadioGroupItem(props, ref) {
    const { label, hint, id, className, 'aria-describedby': ariaDescribedBy, ...rest } = props;
    const size = useContext(RadioGroupSizeContext);

    const generatedId = useId();
    const radioId = id ?? generatedId;
    const hintId = `${radioId}-hint`;

    return (
      <div className={clsx(styles.item, className)}>
        <span className={styles.control}>
          <RadixRadioGroup.Item
            ref={ref}
            id={radioId}
            className={styles.radio}
            aria-describedby={joinIds(ariaDescribedBy, hint ? hintId : undefined)}
            {...rest}
          >
            <RadixRadioGroup.Indicator forceMount className={styles.dot} aria-hidden="true" />
          </RadixRadioGroup.Item>
        </span>

        <Label as="label" htmlFor={radioId} size={size} className={styles.label}>
          {label}
        </Label>

        {hint && (
          <Text as="p" size="sm" id={hintId} className={styles['item-hint']}>
            {hint}
          </Text>
        )}
      </div>
    );
  },
);

RadioGroupItem.displayName = 'RadioGroupItem';
