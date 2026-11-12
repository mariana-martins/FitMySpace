import type { ComponentPropsWithoutRef, CSSProperties } from 'react';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type SkeletonShape = 'text' | 'rectangle' | 'circle';
export type SkeletonSize = 'sm' | 'md' | 'lg';

/* ---------------------------------------------------------------
 * Props
 *
 * A Skeleton is a pulsing placeholder for content that is loading.
 * It is always hidden from assistive technology: announce the
 * loading on the container instead (`aria-busy="true"` plus a
 * visually hidden status message), as MDN recommends.
 *
 * `children` is omitted: a skeleton has no content.
 * --------------------------------------------------------------- */

export interface SkeletonProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  shape?: SkeletonShape;
  size?: SkeletonSize;
  lines?: number;
  width?: CSSProperties['inlineSize'];
  height?: CSSProperties['blockSize'];
}
