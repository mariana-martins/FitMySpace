import type * as RadixSwitch from '@radix-ui/react-switch';
import type { ComponentPropsWithoutRef } from 'react';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type SwitchVariant = 'primary' | 'secondary';
export type SwitchSize = 'sm' | 'md' | 'lg';

/* ---------------------------------------------------------------
 * Props — discriminated union for error-message a11y enforcement
 *
 * `Switch` = a Radix Switch (a <button role="switch">) + visible
 * label + optional hint + optional error message, with every id
 * wired for assistive technology:
 *   - label `for` → button `id`
 *   - button `aria-describedby` → hint, then error (hint is read first)
 *   - `aria-invalid` is set when `invalid` is `true`
 *
 * When `invalid` is `true`, `error` becomes required (WCAG 3.3.1),
 * as in `TextField` and `Checkbox`.
 *
 * State props follow Radix: `checked` / `defaultChecked` take a
 * boolean and `onCheckedChange` receives the new one. A switch has
 * no mixed state, so unlike `Checkbox` there is no `'indeterminate'`.
 * Inside a <form>, Radix adds a hidden native checkbox, so `name`,
 * `value`, `required` and `form` submit and reset as usual.
 *
 * Omitted button props:
 *   - `asChild`: the Switch always renders its own track;
 *   - `children`: the text goes in `label`;
 *   - `onChange`: a button never fires it; use `onCheckedChange`;
 *   - `type`: always "button", so a click never submits the form.
 * --------------------------------------------------------------- */

type SwitchBaseProps = {
  label: string;
  hint?: string;
  variant?: SwitchVariant;
  size?: SwitchSize;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  id?: string;
  required?: boolean;
  className?: string;
};

type SwitchButtonProps = Omit<
  ComponentPropsWithoutRef<typeof RadixSwitch.Root>,
  keyof SwitchBaseProps | 'asChild' | 'children' | 'onChange' | 'type' | 'aria-invalid'
>;

type SwitchValidProps = SwitchBaseProps & {
  invalid?: false;
  error?: never;
} & SwitchButtonProps;

type SwitchInvalidProps = SwitchBaseProps & {
  invalid: true;
  error: string;
} & SwitchButtonProps;

export type SwitchProps = SwitchValidProps | SwitchInvalidProps;
