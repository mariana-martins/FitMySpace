import type * as RadixCheckbox from '@radix-ui/react-checkbox';
import type { ComponentPropsWithoutRef } from 'react';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type CheckboxVariant = 'primary' | 'secondary';
export type CheckboxSize = 'sm' | 'md' | 'lg';

/** `true`, `false`, or `'indeterminate'` for the mixed state. */
export type CheckboxCheckedState = RadixCheckbox.CheckedState;

/* ---------------------------------------------------------------
 * Props — discriminated union for error-message a11y enforcement
 *
 * `Checkbox` = a Radix Checkbox (a <button role="checkbox">) +
 * visible label + optional hint + optional error message, with
 * every id wired for assistive technology:
 *   - label `for` → button `id`
 *   - button `aria-describedby` → hint, then error (hint is read first)
 *   - `aria-invalid` is set when `invalid` is `true`
 *
 * When `invalid` is `true`, `error` becomes required (WCAG 3.3.1),
 * as in `TextField`.
 *
 * State props follow Radix, as in `Select`: `checked` /
 * `defaultChecked` take `true`, `false` or `'indeterminate'`, and
 * `onCheckedChange` receives the new state. Inside a <form>, Radix
 * adds a hidden native checkbox, so `name`, `value`, `required` and
 * `form` submit and reset as usual.
 *
 * Omitted button props:
 *   - `asChild`: the Checkbox always renders its own box;
 *   - `children`: the text goes in `label`;
 *   - `onChange`: a button never fires it; use `onCheckedChange`;
 *   - `type`: always "button", so a click never submits the form.
 * --------------------------------------------------------------- */

type CheckboxBaseProps = {
  label: string;
  hint?: string;
  variant?: CheckboxVariant;
  size?: CheckboxSize;
  checked?: CheckboxCheckedState;
  defaultChecked?: CheckboxCheckedState;
  onCheckedChange?: (checked: CheckboxCheckedState) => void;
  id?: string;
  required?: boolean;
  className?: string;
};

type CheckboxButtonProps = Omit<
  ComponentPropsWithoutRef<typeof RadixCheckbox.Root>,
  keyof CheckboxBaseProps | 'asChild' | 'children' | 'onChange' | 'type' | 'aria-invalid'
>;

type CheckboxValidProps = CheckboxBaseProps & {
  invalid?: false;
  error?: never;
} & CheckboxButtonProps;

type CheckboxInvalidProps = CheckboxBaseProps & {
  invalid: true;
  error: string;
} & CheckboxButtonProps;

export type CheckboxProps = CheckboxValidProps | CheckboxInvalidProps;
