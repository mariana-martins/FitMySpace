/**
 * Joins element ids into one space-separated IDREF list, for attributes such
 * as `aria-describedby` or `aria-labelledby`, skipping missing ids.
 *
 * Returns `undefined` when nothing is left, so React omits the attribute
 * instead of rendering an empty one that points to nothing.
 */
export function joinIds(...ids: Array<string | undefined>): string | undefined {
  const joined = ids.filter(Boolean).join(' ');
  return joined || undefined;
}
