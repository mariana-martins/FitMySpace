import type { ComponentPropsWithoutRef } from 'react';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type IconSize = 'xs' | 'sm' | 'md' | 'lg';

/* ---------------------------------------------------------------
 * Props
 *
 * `Icon` is the box an icon is drawn in: it centres the SVG, keeps it
 * from being squeezed by the row it sits in, and decides whether
 * assistive technology sees it. It draws nothing itself and holds no
 * state, so it renders on the server.
 *
 * An icon is hidden by default. MDN names icons as the case for
 * `aria-hidden="true"`, because exposing an icon the visible text
 * already names reads the same thought twice, and reads a wrong one
 * when the icon means something else. So leave `label` out whenever
 * the icon sits beside its words — inside a `Button`, a `Badge`, a
 * field, or right before a heading.
 *
 * Pass `label` only when the icon *is* the information and nothing
 * else says it: a column of icons with no text, a map marker with no
 * caption. That sets `role="img"` with an `aria-label`, which MDN
 * describes as a black box — the SVG inside is never read out node by node. Where
 * a visible label already exists, MDN prefers `aria-labelledby`: pass
 * the id through the props instead of repeating the words in `label`.
 *
 * The box is `md` unless told otherwise. A component sizes its own icon
 * with its own tier-3 token, by writing `--icon-size` in the class it
 * passes through `className`; `size` is for an icon standing on its own.
 * Pass one or the other, never both: they write the same custom
 * property, and stylesheet order would decide.
 *
 * `aria-hidden` is deliberately not in these props. `label` already says
 * which case this is, and an `aria-hidden="true"` written beside a
 * `label` would hide the name the label came to give.
 * --------------------------------------------------------------- */

export interface IconProps extends Omit<ComponentPropsWithoutRef<'span'>, 'color' | 'aria-hidden'> {
  size?: IconSize;
  /**
   * The icon is the information: it is exposed as an image with this name.
   * Leave it out when the icon only decorates text that already says it.
   */
  label?: string;
}
