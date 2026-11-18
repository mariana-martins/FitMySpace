'use client';

import { UTILITY_VARIANT_ICONS, UTILITY_VARIANT_LABELS, joinIds } from '../../utils';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import styles from './SearchField.module.css';
import type { SubmitEvent, Ref } from 'react';
import { Label, Text } from '../Typography';
import { DS_ICONS, Icon } from '../Icon';
import { useId, useRef } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import clsx from 'clsx';

import type { SearchFieldProps } from './SearchField.types';

/* ---------------------------------------------------------------
 * SearchField
 *
 * A <form role="search"> named by its visible label, so the search
 * landmark has the same name people see. DOM order is label → field
 * (input, then Clear) → Search button → hint → error, so the hint is
 * read before the error. As in TextField, the error has no live
 * region: on submit, the page moves focus back to the field.
 *
 * The browser's own clear control of type="search" is hidden in CSS,
 * so there is a single, labelled Clear button.
 * --------------------------------------------------------------- */

export function SearchField({ ref, ...props }: SearchFieldProps & { ref?: Ref<HTMLInputElement> }) {
  const {
    label,
    hint,
    size = 'md',
    value: valueProp,
    defaultValue = '',
    onValueChange,
    onSearch,
    onClear,
    name = 'q',
    placeholder,
    submitLabel = 'Search',
    clearLabel = 'Clear search',
    disabled = false,
    invalid = false,
    error,
    id,
    className,
    onSubmit,
    ...formProps
  } = props;

  const [query, setQuery] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
    caller: 'SearchField',
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const composedInputRef = useComposedRefs(ref, inputRef);

  const generatedId = useId();
  const inputId = id ?? generatedId;
  const labelId = `${inputId}-label`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const hasError = Boolean(invalid && error && error.trim().length > 0);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    onSubmit?.(event);
    if (event.defaultPrevented || !onSearch) return;
    event.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    onClear?.();
    inputRef.current?.focus();
  };

  const clearButton =
    query && !disabled ? (
      <Button
        type="button"
        variant="secondary"
        appearance="ghost"
        size="xs"
        icon="x"
        aria-label={clearLabel}
        onClick={handleClear}
      />
    ) : undefined;

  return (
    <form
      role="search"
      aria-labelledby={labelId}
      className={clsx(styles.root, className)}
      onSubmit={handleSubmit}
      {...formProps}
    >
      <Label as="label" id={labelId} htmlFor={inputId} size={size} className={styles.label}>
        {label}
      </Label>

      <div className={styles.row}>
        <Input
          ref={composedInputRef}
          id={inputId}
          type="search"
          name={name}
          size={size}
          value={query}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          enterKeyHint="search"
          iconStart="search"
          endAction={clearButton}
          className={styles.field}
          invalid={hasError}
          aria-describedby={joinIds(hint ? hintId : undefined, hasError ? errorId : undefined)}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Button type="submit" variant="primary" appearance="fill" size={size} disabled={disabled}>
          {submitLabel}
        </Button>
      </div>

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
    </form>
  );
}
