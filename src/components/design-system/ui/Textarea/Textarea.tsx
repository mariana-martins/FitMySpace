import styles from './Textarea.module.css';
import { forwardRef } from 'react';
import clsx from 'clsx';

import type { TextareaProps } from './Textarea.types';

/* ---------------------------------------------------------------
 * Textarea
 *
 * Renders a single native <textarea> that draws its own box. There is
 * no wrapper here, unlike `Input`: with no adornments to position, the
 * box can live on the element itself, so the padding stays part of the
 * field (a click anywhere in it focuses the field natively) and there
 * are no client hooks, which lets the field render on the server.
 *
 * The ref points to the <textarea>.
 * --------------------------------------------------------------- */

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(props, ref) {
    const {
      size = 'md',
      resize = 'vertical',
      invalid = false,
      rows = 4,
      className,
      disabled,
      readOnly,
      'aria-invalid': ariaInvalid,
      ...rest
    } = props;

    const isInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true';

    return (
      <textarea
        ref={ref}
        rows={rows}
        className={clsx(
          styles.textarea,
          styles[`size-${size}` as keyof typeof styles],
          styles[`resize-${resize}` as keyof typeof styles],
          className,
        )}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={isInvalid || undefined}
        data-invalid={isInvalid || undefined}
        data-disabled={disabled || undefined}
        data-readonly={readOnly || undefined}
        {...rest}
      />
    );
  },
);

Textarea.displayName = 'Textarea';
