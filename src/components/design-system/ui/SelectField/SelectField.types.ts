import type { SelectProps } from '../Select/Select.types';

/* ---------------------------------------------------------------
 * Props — discriminated union for error-message a11y enforcement
 *
 * `SelectField` = visible label + `Select` + optional hint + optional
 * error message, with every id wired for assistive technology:
 *   - label `for` → select `id`
 *   - select `aria-describedby` → hint, then error (hint is read first)
 *   - `aria-invalid` is set when `invalid` is `true`
 *
 * When `invalid` is `true`, `error` becomes required (WCAG 3.3.1),
 * as in `TextField`.
 *
 * All other props go to the `Select`, so `name`, `value`,
 * `placeholder`, `onChange`, `required`, `autoComplete`, the options
 * (`children`), etc. work as usual.
 * --------------------------------------------------------------- */

type SelectFieldBaseProps = {
  label: string;
  hint?: string;
  id?: string;
  required?: boolean;
  className?: string;
  selectClassName?: string;
};

type SelectFieldNativeProps = Omit<
  SelectProps,
  keyof SelectFieldBaseProps | 'invalid' | 'aria-invalid'
>;

type SelectFieldValidProps = SelectFieldBaseProps & {
  invalid?: false;
  error?: never;
} & SelectFieldNativeProps;

type SelectFieldInvalidProps = SelectFieldBaseProps & {
  invalid: true;
  error: string;
} & SelectFieldNativeProps;

export type SelectFieldProps = SelectFieldValidProps | SelectFieldInvalidProps;
