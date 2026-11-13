import type { ComponentPropsWithoutRef } from 'react';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type TextareaSize = 'sm' | 'md' | 'lg';
export type TextareaResize = 'none' | 'vertical' | 'both';

/* ---------------------------------------------------------------
 * Props
 *
 * `Textarea` is the bare multi-line field: no label, hint or error
 * text. For form fields, use `TextareaField`, which wires the label,
 * hint and error message for you. Use `Textarea` directly only in
 * layouts `TextareaField` does not cover, and still tie it to visible
 * text: a `<label for>` you render yourself, or `aria-labelledby`
 * pointing at a visible heading. `aria-label` or the placeholder
 * alone is not enough.
 *
 * Unlike `Input` there are no adornments: an icon, a unit or a button
 * has nowhere to sit beside text that wraps over lines. The height
 * comes from `rows`; `min-height` keeps the field as tall as the
 * `Button` next to it even with `rows={1}`.
 * --------------------------------------------------------------- */

export interface TextareaProps extends ComponentPropsWithoutRef<'textarea'> {
  size?: TextareaSize;
  invalid?: boolean;
  resize?: TextareaResize;
}
