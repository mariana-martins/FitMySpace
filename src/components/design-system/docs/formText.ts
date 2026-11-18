/* ---------------------------------------------------------------
 * formText (Storybook docs helper)
 *
 * Reads a text field's value from a submitted form, for the patterns
 * that validate on submit. Not part of the public design system API.
 * --------------------------------------------------------------- */

/**
 * The value of the text field named `name`, or `''` when there is none. `FormData.get`
 * can also return a `File`, which only a file input submits.
 */
export function formText(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === 'string' ? value : '';
}
