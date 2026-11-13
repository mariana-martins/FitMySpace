'use client';

import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import * as RadixSelect from '@radix-ui/react-select';
import styles from './Select.module.css';
import { forwardRef } from 'react';
import clsx from 'clsx';

import type { SelectGroupProps, SelectItemProps, SelectProps } from './Select.types';

/* ---------------------------------------------------------------
 * Select
 *
 * Built on Radix Select. The trigger is a <button role="combobox">
 * drawn as the Input box; the list opens in a portal below it
 * (position "popper"), as wide as the trigger. Radix handles the
 * keyboard (arrows, Home/End, type-ahead, Escape), focus and the
 * hidden native <select> that submits the value inside a <form>.
 *
 * The ref points to the trigger <button>.
 * --------------------------------------------------------------- */

// Gap between trigger and list: 4px, the semantic gap.xs, as Radix takes a number.
const LIST_OFFSET_PX = 4;

function sizeClass(size: SelectProps['size']) {
  return styles[`size-${size ?? 'md'}` as keyof typeof styles];
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(props, ref) {
  const {
    size = 'md',
    invalid = false,
    placeholder,
    iconStart,
    children,
    className,
    value,
    defaultValue,
    onValueChange,
    open,
    defaultOpen,
    onOpenChange,
    name,
    required,
    disabled,
    autoComplete,
    form,
    'aria-invalid': ariaInvalid,
    ...triggerProps
  } = props;

  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true';

  return (
    <RadixSelect.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      name={name}
      required={required}
      disabled={disabled}
      autoComplete={autoComplete}
      form={form}
    >
      <RadixSelect.Trigger
        ref={ref}
        className={clsx(styles.trigger, sizeClass(size), className)}
        aria-invalid={isInvalid || undefined}
        data-invalid={isInvalid || undefined}
        {...triggerProps}
      >
        {iconStart && (
          <span className={styles.icon} aria-hidden="true">
            {iconStart}
          </span>
        )}
        <span className={styles.value}>
          <RadixSelect.Value placeholder={placeholder} />
        </span>
        <RadixSelect.Icon className={clsx(styles.icon, styles.chevron)}>
          <ChevronDown aria-hidden="true" focusable="false" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          className={clsx(styles.content, sizeClass(size))}
          position="popper"
          sideOffset={LIST_OFFSET_PX}
        >
          <RadixSelect.ScrollUpButton className={styles['scroll-button']}>
            <ChevronUp aria-hidden="true" focusable="false" />
          </RadixSelect.ScrollUpButton>
          <RadixSelect.Viewport className={styles.viewport}>{children}</RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton className={styles['scroll-button']}>
            <ChevronDown aria-hidden="true" focusable="false" />
          </RadixSelect.ScrollDownButton>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
});

Select.displayName = 'Select';

/* ---------------------------------------------------------------
 * SelectItem — one option, with a check mark when chosen
 * --------------------------------------------------------------- */

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(function SelectItem(
  { children, className, ...itemProps },
  ref,
) {
  return (
    <RadixSelect.Item ref={ref} className={clsx(styles.item, className)} {...itemProps}>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
      <RadixSelect.ItemIndicator className={styles.indicator}>
        <Check aria-hidden="true" focusable="false" />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  );
});

SelectItem.displayName = 'SelectItem';

/* ---------------------------------------------------------------
 * SelectGroup — options under a visible heading
 * --------------------------------------------------------------- */

export const SelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>(function SelectGroup(
  { label, children, className, ...groupProps },
  ref,
) {
  return (
    <RadixSelect.Group ref={ref} className={clsx(styles.group, className)} {...groupProps}>
      <RadixSelect.Label className={styles['group-label']}>{label}</RadixSelect.Label>
      {children}
    </RadixSelect.Group>
  );
});

SelectGroup.displayName = 'SelectGroup';
