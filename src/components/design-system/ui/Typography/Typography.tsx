import type {
  HeadingLevel,
  HeadingProps,
  TextProps,
  LabelProps,
  CaptionProps,
} from './Typography.types';
import { Root as RadixLabel } from '@radix-ui/react-label';
import styles from './Typography.module.css';
import type { Ref } from 'react';
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

export function Heading({
  level = 2,
  size = 'lg',
  displaySize,
  className,
  ref,
  ...rest
}: HeadingProps & { ref?: Ref<HTMLHeadingElement> }) {
  const Tag = HEADING_TAGS[level];
  const sizeClass = displaySize ? styles[`display-${displaySize}`] : styles[`heading-${size}`];

  return <Tag ref={ref} className={clsx(styles.base, sizeClass, className)} {...rest} />;
}

/* ---------------------------------------------------------------
 * Text
 *
 * General-purpose body text. Renders <p> by default but can
 * switch to <span> via the `as` prop.
 * --------------------------------------------------------------- */

export function Text({
  as = 'p',
  size = 'md',
  className,
  ref,
  ...rest
}: TextProps & { ref?: Ref<HTMLElement> }) {
  const Tag = as as React.ElementType;

  return (
    <Tag ref={ref} className={clsx(styles.base, styles[`body-${size}`], className)} {...rest} />
  );
}

/* ---------------------------------------------------------------
 * Label
 *
 * Renders a <span> by default for visual-only label text.
 * When `as="label"` is passed, renders Radix UI's `Label` primitive
 * (a native <label> that also prevents text selection on double-click)
 * and requires `htmlFor` to maintain proper form accessibility.
 *
 * TypeScript enforces this via a discriminated union:
 *   <Label>…</Label>                      → <span>  (htmlFor not allowed)
 *   <Label as="label" htmlFor="id">…</>   → <label> (htmlFor required)
 * --------------------------------------------------------------- */

export function Label({ ref, ...props }: LabelProps & { ref?: Ref<HTMLElement> }) {
  const { as = 'span', size = 'md', className, ...rest } = props;

  const Tag: React.ElementType = as === 'label' ? RadixLabel : 'span';

  return (
    <Tag ref={ref} className={clsx(styles.base, styles[`label-${size}`], className)} {...rest} />
  );
}

/* ---------------------------------------------------------------
 * Caption
 *
 * Small, supplementary text. Renders <span> by default.
 * --------------------------------------------------------------- */

export function Caption({
  as = 'span',
  className,
  ref,
  ...rest
}: CaptionProps & { ref?: Ref<HTMLElement> }) {
  const Tag = as as React.ElementType;

  return <Tag ref={ref} className={clsx(styles.base, styles['caption-md'], className)} {...rest} />;
}
