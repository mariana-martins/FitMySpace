'use client';

import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { CircleAlert, Search, X } from 'lucide-react';
import { forwardRef, useId, useRef } from 'react';
import styles from './SearchField.module.css';
import { Label, Text } from '../Typography';
import type { SubmitEvent } from 'react';
import { joinIds } from '../../utils';
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

export const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  function SearchField(props, ref) {
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
          icon={<X />}
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
            iconStart={<Search />}
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
            <CircleAlert className={styles['error-icon']} aria-hidden="true" focusable="false" />
            <span id={errorId}>
              <VisuallyHidden>Error: </VisuallyHidden>
              {error}
            </span>
          </p>
        )}
      </form>
    );
  },
);

SearchField.displayName = 'SearchField';
