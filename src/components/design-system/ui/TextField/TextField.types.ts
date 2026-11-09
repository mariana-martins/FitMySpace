import type { InputProps } from '../Input/Input.types';

/* ---------------------------------------------------------------
 * Props — discriminated union for error-message a11y enforcement
 *
 * `TextField` = visible label + `Input` + optional hint + optional
 * error message, with every id wired for assistive technology:
 *   - label `for` → input `id`
 *   - input `aria-describedby` → hint, then error (hint is read first)
 *   - `aria-invalid` is set when `invalid` is `true`
 *
 * When `invalid` is `true`, `error` becomes required (WCAG 3.3.1):
 * a field cannot be marked invalid without a visible, descriptive
 * error message explaining what went wrong and how to fix it.
 *
 * All other props go to the native <input>, so `name`, `type`,
 * `autoComplete`, `inputMode`, `required`, `onChange`, etc. work as usual.
 * --------------------------------------------------------------- */

type TextFieldBaseProps = {
  label: string;
  hint?: string;
  id?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
};

type TextFieldNativeProps = Omit<InputProps, keyof TextFieldBaseProps | 'invalid' | 'aria-invalid'>;

type TextFieldValidProps = TextFieldBaseProps & {
  invalid?: false;
  error?: never;
} & TextFieldNativeProps;

type TextFieldInvalidProps = TextFieldBaseProps & {
  invalid: true;
  error: string;
} & TextFieldNativeProps;

export type TextFieldProps = TextFieldValidProps | TextFieldInvalidProps;
