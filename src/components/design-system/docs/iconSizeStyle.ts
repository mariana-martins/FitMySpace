import type { CSSProperties } from 'react';

/* ---------------------------------------------------------------
 * iconSizeStyle (Storybook docs helper)
 *
 * Sizes an `Icon` box to any CSS length, for pages that show a size
 * token or a percentage rather than one of the four `size` steps.
 * `--icon-size` is the variable `Icon` reads, so the box, the stroke
 * and the centring all keep working.
 *
 * React's `CSSProperties` has no custom properties, hence the cast.
 * Not part of the public design system API.
 * --------------------------------------------------------------- */

export function iconSizeStyle(size: string): CSSProperties {
  return { '--icon-size': size } as CSSProperties;
}
