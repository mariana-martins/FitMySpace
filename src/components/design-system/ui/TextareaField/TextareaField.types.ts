import type { TextareaProps } from '../Textarea/Textarea.types';

/* ---------------------------------------------------------------
 * Props — discriminated union for error-message a11y enforcement
 *
 * `TextareaField` = visible label + `Textarea` + optional hint +
 * optional error message, with every id wired for assistive
 * technology:
 *   - label `for` → textarea `id`
 *   - textarea `aria-describedby` → hint, then error (hint is read first)
 *   - `aria-invalid` is set when `invalid` is `true`
 *
 * When `invalid` is `true`, `error` becomes required (WCAG 3.3.1):
 * a field cannot be marked invalid without a visible, descriptive
 * error message explaining what went wrong and how to fix it.
 *
 * All other props go to the native <textarea>, so `name`, `rows`,
 * `maxLength`, `required`, `onChange`, etc. work as usual.
 * --------------------------------------------------------------- */

type TextareaFieldBaseProps = {
  label: string;
  hint?: string;
  id?: string;
  required?: boolean;
  className?: string;
  textareaClassName?: string;
};

type TextareaFieldNativeProps = Omit<
  TextareaProps,
  keyof TextareaFieldBaseProps | 'invalid' | 'aria-invalid'
>;

type TextareaFieldValidProps = TextareaFieldBaseProps & {
  invalid?: false;
  error?: never;
} & TextareaFieldNativeProps;

type TextareaFieldInvalidProps = TextareaFieldBaseProps & {
  invalid: true;
  error: string;
} & TextareaFieldNativeProps;

export type TextareaFieldProps = TextareaFieldValidProps | TextareaFieldInvalidProps;
