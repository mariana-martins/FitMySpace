import type { ComponentPropsWithoutRef } from 'react';
import type { InputSize } from '../Input';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type SearchFieldSize = InputSize;

/* ---------------------------------------------------------------
 * Props
 *
 * SearchField is a search form: a <form role="search"> named by its
 * visible label, an Input of type "search", a Clear button while
 * there is text, and a Search submit button.
 *
 * Without `onSearch`, the form submits natively (`action`, `method`),
 * e.g. a GET to the results page with `?q=`, which works without
 * JavaScript. With `onSearch`, the submit is handled in JavaScript.
 *
 * When `invalid` is `true`, `error` becomes required (WCAG 3.3.1), as
 * in `TextField`: the message says how to fix the query, such as
 * "Enter at least 2 characters". Results problems (no matches, a
 * failed request) belong in the results area, not here.
 *
 * Every prop not listed below goes to the <form>. The ref points to
 * the <input>, so the page can focus it.
 * --------------------------------------------------------------- */

type SearchFieldOwnProps = {
  label: string;
  hint?: string;
  size?: SearchFieldSize;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  name?: string;
  placeholder?: string;
  submitLabel?: string;
  clearLabel?: string;
  disabled?: boolean;
  id?: string;
};

type SearchFieldFormProps = Omit<
  ComponentPropsWithoutRef<'form'>,
  keyof SearchFieldOwnProps | 'role' | 'children'
>;

type SearchFieldValidProps = SearchFieldOwnProps & {
  invalid?: false;
  error?: never;
} & SearchFieldFormProps;

type SearchFieldInvalidProps = SearchFieldOwnProps & {
  invalid: true;
  error: string;
} & SearchFieldFormProps;

export type SearchFieldProps = SearchFieldValidProps | SearchFieldInvalidProps;
