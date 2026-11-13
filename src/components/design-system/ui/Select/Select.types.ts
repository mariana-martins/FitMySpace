import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import type * as RadixSelect from '@radix-ui/react-select';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type SelectSize = 'sm' | 'md' | 'lg';

/* ---------------------------------------------------------------
 * Props
 *
 * `Select` is the bare field, built on Radix Select: a trigger
 * button (role "combobox") drawn as the Input box, and a styled
 * list of options. It has no label of its own. For form fields,
 * use `SelectField`. Use `Select` directly only in layouts
 * SelectField does not cover, and still tie it to visible text:
 * a `<label for>` you render yourself, or `aria-labelledby`
 * pointing at a visible heading. `aria-label` or the placeholder
 * alone is not enough.
 *
 * State props (`value`, `onValueChange`, `name`, `required`…) go to
 * the Radix root; every other prop goes to the trigger button.
 * Options are `SelectItem` (and `SelectGroup`) children.
 * --------------------------------------------------------------- */

type SelectRootProps = Pick<
  RadixSelect.SelectProps,
  | 'value'
  | 'defaultValue'
  | 'onValueChange'
  | 'open'
  | 'defaultOpen'
  | 'onOpenChange'
  | 'name'
  | 'required'
  | 'disabled'
  | 'autoComplete'
  | 'form'
>;

type SelectTriggerProps = Omit<
  ComponentPropsWithoutRef<typeof RadixSelect.Trigger>,
  keyof SelectRootProps | 'asChild' | 'children' | 'dir'
>;

export interface SelectProps extends SelectTriggerProps, SelectRootProps {
  size?: SelectSize;
  invalid?: boolean;
  placeholder?: string;
  iconStart?: ReactElement;
  children: ReactNode;
  className?: string;
}

export interface SelectItemProps extends Omit<
  ComponentPropsWithoutRef<typeof RadixSelect.Item>,
  'asChild'
> {
  value: string;
  children: ReactNode;
}

export interface SelectGroupProps extends Omit<
  ComponentPropsWithoutRef<typeof RadixSelect.Group>,
  'asChild'
> {
  label: string;
  children: ReactNode;
}
