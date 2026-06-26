import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/* ---------------------------------------------------------------
 * Heading
 * --------------------------------------------------------------- */

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'sm' | 'md' | 'lg';
export type DisplaySize = 'md' | 'lg';

export interface HeadingProps
  extends Omit<ComponentPropsWithoutRef<'h1'>, 'color'> {
  /** Semantic heading level (1–6). Controls the rendered HTML tag. */
  level?: HeadingLevel;
  /** Typography scale variant. Independent of `level`. */
  size?: HeadingSize;
  /** When set, uses the larger display scale instead of heading scale. */
  displaySize?: DisplaySize;
}

/* ---------------------------------------------------------------
 * Text
 * --------------------------------------------------------------- */

export type TextElement = 'p' | 'span';
export type TextSize = 'sm' | 'md' | 'lg';

export interface TextProps
  extends Omit<ComponentPropsWithoutRef<'p'>, 'color'> {
  /** Rendered HTML element. */
  as?: TextElement;
  /** Typography scale variant. */
  size?: TextSize;
}

/* ---------------------------------------------------------------
 * Label
 * --------------------------------------------------------------- */

export type LabelSize = 'sm' | 'md' | 'lg';

export type LabelBaseProps = {
  /** Typography scale variant. */
  size?: LabelSize;
  className?: string;
  children?: ReactNode;
};

export type LabelAsSpanProps = LabelBaseProps & {
  as?: 'span';
} & Omit<ComponentPropsWithoutRef<'span'>, keyof LabelBaseProps | 'color'>;

export type LabelAsLabelProps = LabelBaseProps & {
  as: 'label';
  /** Associates this label with a form input. Required when `as="label"`. */
  htmlFor: string;
} & Omit<
  ComponentPropsWithoutRef<'label'>,
  keyof LabelBaseProps | 'color' | 'htmlFor'
>;

export type LabelProps = LabelAsSpanProps | LabelAsLabelProps;

/* ---------------------------------------------------------------
 * Caption
 * --------------------------------------------------------------- */

export type CaptionElement = 'span' | 'p';

export interface CaptionProps
  extends Omit<ComponentPropsWithoutRef<'span'>, 'color'> {
  /** Rendered HTML element. */
  as?: CaptionElement;
}
