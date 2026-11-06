'use client';

import { forwardRef, useId, useRef } from 'react';
import type { MouseEvent, Ref } from 'react';
import styles from './Input.module.css';
import clsx from 'clsx';

import type { InputProps } from './Input.types';

/* ---------------------------------------------------------------
 * Input
 *
 * Renders a native <input> inside a wrapper that draws the visible
 * box. The wrapper carries the border, halo and adornments (icons,
 * unit), so the native input stays unstyled and fully native:
 * autofill, IME, spellcheck and mobile keyboards keep working.
 *
 * The ref points to the <input>, not the wrapper.
 * --------------------------------------------------------------- */

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

function joinIds(...ids: Array<string | undefined>) {
  const joined = ids.filter(Boolean).join(' ');
  return joined || undefined;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  const {
    size = 'md',
    invalid = false,
    iconStart,
    iconEnd,
    unit,
    className,
    disabled,
    readOnly,
    type = 'text',
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    ...rest
  } = props;

  const unitId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const setInputRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    assignRef(ref, node);
  };

  const handleFieldMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (disabled || event.target === inputRef.current) return;
    event.preventDefault();
    inputRef.current?.focus();
  };

  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true';

  return (
    /*
     * role="presentation": the wrapper's mouse handler is a pointer convenience only.
     * Keyboard and assistive-technology users interact with the native <input> directly.
     */
    <div
      role="presentation"
      className={clsx(styles.field, styles[`size-${size}` as keyof typeof styles], className)}
      data-invalid={isInvalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      onMouseDown={handleFieldMouseDown}
    >
      {iconStart && (
        <span className={styles.icon} aria-hidden="true">
          {iconStart}
        </span>
      )}

      <input
        ref={setInputRef}
        type={type}
        className={styles.input}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={isInvalid || undefined}
        aria-describedby={joinIds(ariaDescribedBy, unit ? unitId : undefined)}
        {...rest}
      />

      {iconEnd && (
        <span className={styles.icon} aria-hidden="true">
          {iconEnd}
        </span>
      )}

      {unit && (
        <span id={unitId} className={styles.unit}>
          {unit}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
