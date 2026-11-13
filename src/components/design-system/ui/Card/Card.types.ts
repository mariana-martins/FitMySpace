import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type CardAppearance = 'raised' | 'outline';
export type CardPadding = 'sm' | 'md' | 'lg';
export type CardMediaAspectRatio = 'square' | 'landscape' | 'wide';

/* ---------------------------------------------------------------
 * Card props
 *
 * A Card is a surface that groups content about one thing, such as
 * a product. It is presentational: it renders a <div>, or with
 * `asChild` (Radix Slot) the element you pass, e.g. <article> in a
 * product grid or <li> in a list.
 *
 * Compose its content (CardMedia, Heading, Text, Badge, Link)
 * instead of passing it as props. To make the whole card a link,
 * put a `<Link stretched>` in its title.
 * --------------------------------------------------------------- */

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  /** A soft shadow (`raised`, default) or a 1px border (`outline`). */
  appearance?: CardAppearance;
  /** Inner padding and the gap between its children. Defaults to `md`. */
  padding?: CardPadding;
  /** Render as the child element (Radix Slot), e.g. `<article>` or `<li>`. */
  asChild?: boolean;
}

/* ---------------------------------------------------------------
 * CardMedia props
 *
 * A frame for the card's image or video: a fixed aspect ratio,
 * rounded corners and a placeholder colour while the image loads.
 * The child (<img>, Next.js <Image fill>, <video>) is cropped to
 * fill it.
 * --------------------------------------------------------------- */

export interface CardMediaProps extends ComponentPropsWithoutRef<'div'> {
  /** `square` (1:1), `landscape` (4:3, default) or `wide` (16:9). */
  aspectRatio?: CardMediaAspectRatio;
  /** The image or video. Give it `alt=""` when the card title already names it. */
  children: ReactNode;
}
