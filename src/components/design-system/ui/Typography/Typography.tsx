import type {
  HeadingLevel,
  HeadingProps,
  TextProps,
  LabelProps,
  CaptionProps,
} from './Typography.types';
import styles from './Typography.module.css';
import { forwardRef } from 'react';
import clsx from 'clsx';

/* ---------------------------------------------------------------
 * Heading
 *
 * Renders a native <h1>–<h6> element based on the `level` prop.
 * The `size` prop controls visual scale independently of semantic
 * level, allowing e.g. an h3 to look like an h2.
 * --------------------------------------------------------------- */

const HEADING_TAGS: Record<HeadingLevel, React.ElementType> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { level = 2, size = 'lg', displaySize, className, ...rest },
  ref,
) {
  const Tag = HEADING_TAGS[level];
  const sizeClass = displaySize ? styles[`display-${displaySize}`] : styles[`heading-${size}`];

  return <Tag ref={ref} className={clsx(styles.base, sizeClass, className)} {...rest} />;
});

Heading.displayName = 'Heading';

/* ---------------------------------------------------------------
 * Text
 *
 * General-purpose body text. Renders <p> by default but can
 * switch to <span> via the `as` prop.
 * --------------------------------------------------------------- */

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { as = 'p', size = 'md', className, ...rest },
  ref,
) {
  const Tag = as as React.ElementType;

  return (
    <Tag ref={ref} className={clsx(styles.base, styles[`body-${size}`], className)} {...rest} />
  );
});

Text.displayName = 'Text';

/* ---------------------------------------------------------------
 * Label
 *
 * Renders a <span> by default for visual-only label text.
 * When `as="label"` is passed, renders a <label> element and
 * requires `htmlFor` to maintain proper form accessibility.
 *
 * TypeScript enforces this via a discriminated union:
 *   <Label>…</Label>                      → <span>  (htmlFor not allowed)
 *   <Label as="label" htmlFor="id">…</>   → <label> (htmlFor required)
 * --------------------------------------------------------------- */

export const Label = forwardRef<HTMLElement, LabelProps>(function Label(props, ref) {
  const { as = 'span', size = 'md', className, ...rest } = props;

  const Tag = as as React.ElementType;

  return (
    <Tag ref={ref} className={clsx(styles.base, styles[`label-${size}`], className)} {...rest} />
  );
});

Label.displayName = 'Label';

/* ---------------------------------------------------------------
 * Caption
 *
 * Small, supplementary text. Renders <span> by default.
 * --------------------------------------------------------------- */

export const Caption = forwardRef<HTMLElement, CaptionProps>(function Caption(
  { as = 'span', className, ...rest },
  ref,
) {
  const Tag = as as React.ElementType;

  return <Tag ref={ref} className={clsx(styles.base, styles['caption-md'], className)} {...rest} />;
});

Caption.displayName = 'Caption';
