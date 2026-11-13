import type * as RadixRadioGroup from '@radix-ui/react-radio-group';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type RadioGroupVariant = 'primary' | 'secondary';
export type RadioGroupSize = 'sm' | 'md' | 'lg';
export type RadioGroupOrientation = 'vertical' | 'horizontal';

/* ---------------------------------------------------------------
 * RadioGroup props — discriminated union for error-message a11y
 *
 * `RadioGroup` = a visible group label + a Radix RadioGroup
 * (role "radiogroup") + optional hint + optional error message:
 *   - the group's `aria-labelledby` → the visible label
 *   - the group's `aria-describedby` → hint, then error
 *   - `aria-invalid` on the group when `invalid` is `true`
 *   - `aria-required` on the group when `required` (Radix sets it),
 *     as MDN asks: on the group, never on each radio
 *
 * When `invalid` is `true`, `error` becomes required (WCAG 3.3.1),
 * as in `TextField` and `Checkbox`.
 *
 * State props follow Radix, as in `Select`: `value` /
 * `defaultValue` and `onValueChange`. Inside a <form>, Radix adds a
 * hidden native radio per item, so `name`, `required` and `form`
 * submit and reset as usual.
 *
 * `orientation` only lays the items out. It is not passed to Radix,
 * so every arrow key moves between options, as MDN describes.
 *
 * Omitted root props: `asChild` (the group renders its own layout),
 * `children` is narrowed to the items, and `dir` / `loop` keep the
 * Radix defaults.
 * --------------------------------------------------------------- */

type RadioGroupBaseProps = {
  label: string;
  hint?: string;
  variant?: RadioGroupVariant;
  size?: RadioGroupSize;
  orientation?: RadioGroupOrientation;
  children: ReactNode;
  id?: string;
  required?: boolean;
  className?: string;
};

type RadioGroupRootProps = Omit<
  ComponentPropsWithoutRef<typeof RadixRadioGroup.Root>,
  | keyof RadioGroupBaseProps
  | 'asChild'
  | 'dir'
  | 'loop'
  | 'aria-invalid'
  | 'aria-labelledby'
  | 'aria-label'
>;

type RadioGroupValidProps = RadioGroupBaseProps & {
  invalid?: false;
  error?: never;
} & RadioGroupRootProps;

type RadioGroupInvalidProps = RadioGroupBaseProps & {
  invalid: true;
  error: string;
} & RadioGroupRootProps;

export type RadioGroupProps = RadioGroupValidProps | RadioGroupInvalidProps;

/* ---------------------------------------------------------------
 * RadioGroupItem props
 *
 * One option: a Radix radio (a <button role="radio">) drawn as the
 * circle, with a visible <label for> and an optional hint that is
 * linked through `aria-describedby`. The ref points to the button.
 * --------------------------------------------------------------- */

export interface RadioGroupItemProps extends Omit<
  ComponentPropsWithoutRef<typeof RadixRadioGroup.Item>,
  'asChild' | 'children' | 'type'
> {
  value: string;
  label: string;
  hint?: string;
}
