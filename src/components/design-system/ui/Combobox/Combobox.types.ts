import type { InputProps, InputSize } from '../Input/Input.types';
import type { IconName } from '../Icon';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type ComboboxSize = InputSize;

/** One suggestion in the list. */
export interface ComboboxOption {
  /** Stable id of the option, unique in the list. */
  value: string;
  /** The words shown, read out, and written into the field when it is picked. */
  label: string;
  /** A second, quieter line: where it comes from, how many results. */
  description?: string;
  /** Decorative icon before the label, by name. */
  icon?: IconName;
  disabled?: boolean;
}

/* ---------------------------------------------------------------
 * Props — discriminated union for error-message a11y enforcement
 *
 * `Combobox` = a `TextField` whose input is an ARIA combobox with a
 * list of suggestions, written by hand from the APG "combobox with
 * list autocomplete" pattern (Radix has no combobox):
 *   - the input keeps the focus; the arrow keys move a highlight
 *     through the options, read out through `aria-activedescendant`;
 *   - Enter picks the highlighted option, Escape closes the list
 *     (and empties the field when the list is already closed);
 *   - a `role="status"` line says how many suggestions there are.
 *
 * It is presentational: the app owns the suggestions and passes the
 * ones to show in `options`, already filtered (locally or by a
 * request), and hears the typing through `onInputValueChange`.
 * --------------------------------------------------------------- */

type ComboboxBaseProps = {
  label: string;
  hint?: string;
  id?: string;
  required?: boolean;
  size?: ComboboxSize;
  /** Class name for the field's root (label, box, hint and error). */
  className?: string;
  /** Class name for the visible box around the input. */
  inputClassName?: string;
  /** The suggestions to show for what is typed now, already filtered by the app. */
  options: ComboboxOption[];
  /** The text in the field, controlled. */
  inputValue?: string;
  /** The text in the field at first, uncontrolled. */
  defaultInputValue?: string;
  /** Called on every change of the text, typed or picked. */
  onInputValueChange?: (value: string) => void;
  /** Called when an option is picked, after its label is written into the field. */
  onOptionSelect?: (option: ComboboxOption) => void;
  /**
   * Shown in place of the list when the field has text and there is no option,
   * e.g. "No rooms match". Without it, the list simply stays closed.
   */
  emptyMessage?: string;
  /** The words of the status line. Defaults to "1 suggestion" / "5 suggestions". */
  formatResultCount?: (count: number) => string;
};

type ComboboxNativeProps = Omit<
  InputProps,
  | keyof ComboboxBaseProps
  | 'invalid'
  | 'aria-invalid'
  | 'value'
  | 'defaultValue'
  | 'role'
  | 'aria-expanded'
  | 'aria-controls'
  | 'aria-autocomplete'
  | 'aria-activedescendant'
>;

type ComboboxValidProps = ComboboxBaseProps & {
  invalid?: false;
  error?: never;
} & ComboboxNativeProps;

type ComboboxInvalidProps = ComboboxBaseProps & {
  invalid: true;
  error: string;
} & ComboboxNativeProps;

export type ComboboxProps = ComboboxValidProps | ComboboxInvalidProps;
