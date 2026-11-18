'use client';

import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { useEffect, useId, useRef, useState } from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import styles from './Combobox.module.css';
import { TextField } from '../TextField';
import { DS_ICONS, Icon } from '../Icon';
import clsx from 'clsx';

import type { ChangeEvent, FocusEvent, KeyboardEvent, Ref } from 'react';
import type { ComboboxOption, ComboboxProps } from './Combobox.types';

/* ---------------------------------------------------------------
 * Combobox
 *
 * Written by hand from the APG "editable combobox with list
 * autocomplete": Radix has no combobox. The field is a `TextField`
 * whose input takes `role="combobox"`; the list is a `role="listbox"`
 * whose options never take the focus — the input keeps it, and
 * `aria-activedescendant` says which option the arrow keys are on.
 *
 * Radix Popover only places the list: it renders it in a portal
 * (so the layer is never trapped by the page), keeps it on screen,
 * and closes it on a click outside. Its dialog role and its focus
 * handling are switched off, because the list is not a dialog.
 * --------------------------------------------------------------- */

const LIST_OFFSET_PX = 4;
const COLLISION_PADDING_PX = 16;

function defaultResultCount(count: number) {
  return `${count} ${count === 1 ? 'suggestion' : 'suggestions'}`;
}

function nextEnabledIndex(options: ComboboxOption[], from: number, step: 1 | -1) {
  for (let offset = 1; offset <= options.length; offset += 1) {
    const index = (from + step * offset + options.length) % options.length;
    if (!options[index]?.disabled) return index;
  }
  return -1;
}

export function Combobox({ ref, ...props }: ComboboxProps & { ref?: Ref<HTMLInputElement> }) {
  const {
    label,
    options,
    inputValue: inputValueProp,
    defaultInputValue = '',
    onInputValueChange,
    onOptionSelect,
    emptyMessage,
    formatResultCount = defaultResultCount,
    size = 'md',
    id,
    invalid = false,
    error,
    disabled,
    className,
    onChange,
    onKeyDown,
    onBlur,
    ...fieldProps
  } = props;

  const [inputValue, setInputValue] = useControllableState({
    prop: inputValueProp,
    defaultProp: defaultInputValue,
    onChange: onInputValueChange,
    caller: 'Combobox',
  });
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listboxId = `${inputId}-listbox`;
  const optionId = (index: number) => `${inputId}-option-${index}`;

  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLElement | null>(null);
  const setInputNode = (node: HTMLInputElement | null) => {
    boxRef.current = node?.parentElement ?? null;
  };
  const composedRef = useComposedRefs(ref, inputRef, setInputNode);

  const hasOptions = options.length > 0;
  const showsEmptyMessage = !hasOptions && Boolean(emptyMessage) && inputValue.trim() !== '';
  const isListOpen = open && !disabled && (hasOptions || showsEmptyMessage);
  const isExpanded = isListOpen && hasOptions;
  const activeOption = isExpanded && activeIndex >= 0 ? options[activeIndex] : undefined;

  const activeOptionId = activeOption ? optionId(activeIndex) : undefined;

  /* A new set of options forgets the highlight: index 2 of the old list means nothing now.
     The options are compared by their values, so a list rebuilt with the same entries on
     every render of the app keeps it. */
  const optionsKey = options.map((option) => option.value).join('\u0000');
  const [previousOptionsKey, setPreviousOptionsKey] = useState(optionsKey);
  if (previousOptionsKey !== optionsKey) {
    setPreviousOptionsKey(optionsKey);
    setActiveIndex(-1);
  }

  useEffect(() => {
    if (activeOptionId)
      document.getElementById(activeOptionId)?.scrollIntoView({ block: 'nearest' });
  }, [activeOptionId]);

  function close() {
    setOpen(false);
    setActiveIndex(-1);
  }

  function selectOption(option: ComboboxOption) {
    if (option.disabled) return;
    setInputValue(option.label);
    close();
    onOptionSelect?.(option);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event);
    setInputValue(event.target.value);
    setOpen(true);
    setActiveIndex(-1);
  }

  function moveHighlight(step: 1 | -1) {
    if (!isExpanded) {
      setOpen(true);
      setActiveIndex(hasOptions ? nextEnabledIndex(options, step === 1 ? -1 : 0, step) : -1);
      return;
    }
    const from = activeIndex === -1 && step === -1 ? 0 : activeIndex;
    setActiveIndex(nextEnabledIndex(options, from, step));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (event.altKey) {
          setOpen(true);
          return;
        }
        moveHighlight(1);
        return;
      case 'ArrowUp':
        event.preventDefault();
        moveHighlight(-1);
        return;
      case 'Enter':
        /* Without a highlight, Enter belongs to the form (a search submits). */
        if (activeOption) {
          event.preventDefault();
          selectOption(activeOption);
        }
        return;
      /* An open list is closed by Radix, which marks the event as handled, so the
         early return above already caught it: here the list is closed. */
      case 'Escape':
        if (isListOpen) {
          close();
        } else if (inputValue !== '') {
          event.preventDefault();
          setInputValue('');
        }
        return;
      default:
    }
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    onBlur?.(event);
    close();
  }

  const fieldState = invalid && error ? { invalid: true as const, error } : {};

  return (
    <RadixPopover.Root open={isListOpen} onOpenChange={(nextOpen) => !nextOpen && close()}>
      <RadixPopover.Anchor virtualRef={boxRef} />

      <TextField
        ref={composedRef}
        label={label}
        id={inputId}
        size={size}
        disabled={disabled}
        className={className}
        type="text"
        autoComplete="off"
        role="combobox"
        aria-expanded={isExpanded}
        aria-controls={isExpanded ? listboxId : undefined}
        aria-autocomplete="list"
        aria-activedescendant={activeOptionId}
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        {...fieldState}
        {...fieldProps}
      />

      <VisuallyHidden role="status">
        {isListOpen ? (hasOptions ? formatResultCount(options.length) : emptyMessage) : ''}
      </VisuallyHidden>

      <RadixPopover.Portal>
        <RadixPopover.Content
          role="presentation"
          side="bottom"
          align="start"
          sideOffset={LIST_OFFSET_PX}
          collisionPadding={COLLISION_PADDING_PX}
          className={clsx(styles.content, styles[`size-${size}` as keyof typeof styles])}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          onInteractOutside={(event) => {
            if (event.target instanceof Node && boxRef.current?.contains(event.target)) {
              event.preventDefault();
            }
          }}
        >
          {hasOptions ? (
            <ul id={listboxId} role="listbox" aria-label={label} className={styles.list}>
              {options.map((option, index) => (
                /* The keyboard never reaches an option: the input keeps the focus and handles
                   the keys, and aria-activedescendant points at the option (APG combobox). */
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                <li
                  key={option.value}
                  id={optionId(index)}
                  role="option"
                  aria-selected={index === activeIndex}
                  aria-disabled={option.disabled || undefined}
                  data-active={index === activeIndex || undefined}
                  className={styles.option}
                  onMouseDown={(event) => event.preventDefault()}
                  onPointerMove={() => !option.disabled && setActiveIndex(index)}
                  onClick={() => selectOption(option)}
                >
                  {option.icon && <Icon className={styles.icon}>{DS_ICONS[option.icon].icon}</Icon>}
                  <span className={styles.text}>
                    <span className={styles.label}>{option.label}</span>
                    {option.description && (
                      <span className={styles.description}>{option.description}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty} aria-hidden="true">
              {emptyMessage}
            </p>
          )}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}
