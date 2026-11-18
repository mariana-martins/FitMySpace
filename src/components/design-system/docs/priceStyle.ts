import type { CSSProperties } from 'react';

/* ---------------------------------------------------------------
 * priceStyle (Storybook docs helper)
 *
 * The look of a price in the patterns (Product Details, Store
 * Offers). Not part of the public design system API.
 * --------------------------------------------------------------- */

/**
 * A price is the figure people decide on, so it takes the `heading-md` type role through
 * its generated shorthand: larger and bold, on a paragraph rather than a heading. Tabular
 * figures keep the digits the same width, so prices in a list line up.
 */
export const priceStyle: CSSProperties = {
  margin: 0,
  font: 'var(--ds-semantic-typography-heading-md-shorthand)',
  letterSpacing: 'var(--ds-semantic-typography-heading-md-letter-spacing)',
  fontVariantNumeric: 'tabular-nums',
};
