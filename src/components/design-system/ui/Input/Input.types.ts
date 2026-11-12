import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type InputSize = 'sm' | 'md' | 'lg';

/* ---------------------------------------------------------------
 * Props
 *
 * `Input` is the bare field: no label, hint or error text. For form
 * fields, use `TextField`, which wires the label, hint and error
 * message for you. Use `Input` directly only in layouts TextField
 * does not cover, and still tie it to visible text: a `<label for>`
 * you render yourself, or `aria-labelledby` pointing at a visible
 * heading. `aria-label` or the placeholder alone is not enough.
 *
 * `size` is omitted from the native props because the HTML `size`
 * attribute (character width) conflicts with the visual size scale.
 * --------------------------------------------------------------- */

export interface InputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  /** Visual size. Controls height, padding, font size and icon size. Defaults to `md`. */
  size?: InputSize;
  /**
   * Marks the value as invalid. Sets `aria-invalid` and shows the error style.
   * Pair it with a visible error message linked through `aria-describedby`
   * (`TextField` does this for you).
   */
  invalid?: boolean;
  /** Decorative icon before the value (e.g. a Lucide icon). Hidden from assistive technology. */
  iconStart?: ReactElement;
  /** Decorative icon after the value. Hidden from assistive technology. */
  iconEnd?: ReactElement;
  /**
   * Unit shown after the value, e.g. `"cm"`. It is visible and also added to the
   * field's accessible description, so screen readers announce it.
   */
  unit?: string;
  /**
   * Interactive control at the end of the field, e.g. a "Clear search" or
   * "Show password" button. Unlike the icons it stays visible to assistive
   * technology, receives its own clicks and comes right after the input in the
   * Tab order. It must have its own accessible name.
   */
  endAction?: ReactNode;
  /** Class name for the outer field wrapper (the visible box). */
  className?: string;
}
