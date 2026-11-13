import styles from './Skeleton.module.css';
import type { CSSProperties } from 'react';
import { forwardRef } from 'react';
import clsx from 'clsx';

import type { SkeletonProps } from './Skeleton.types';

/* ---------------------------------------------------------------
 * Skeleton
 *
 * Presentational and hidden from assistive technology. Radix has no
 * primitive for it. No client hooks, so it renders on the server.
 * --------------------------------------------------------------- */

export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(props, ref) {
  const {
    shape = 'text',
    size = 'md',
    lines = 1,
    width,
    height,
    className,
    style,
    ...rest
  } = props;

  const dimensionStyle: CSSProperties = { inlineSize: width, blockSize: height, ...style };
  const lineCount = shape === 'text' ? Math.max(1, Math.floor(lines)) : 1;

  if (lineCount > 1) {
    return (
      <span
        ref={ref}
        className={clsx(styles.lines, styles[`size-${size}` as keyof typeof styles], className)}
        style={dimensionStyle}
        aria-hidden="true"
        {...rest}
      >
        {Array.from({ length: lineCount }, (_, lineIndex) => (
          <span
            key={lineIndex}
            className={clsx(
              styles.skeleton,
              styles.text,
              lineIndex === lineCount - 1 && styles['last-line'],
            )}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={clsx(
        styles.skeleton,
        styles[shape],
        shape === 'text' && styles[`size-${size}` as keyof typeof styles],
        className,
      )}
      style={dimensionStyle}
      aria-hidden="true"
      {...rest}
    />
  );
});

Skeleton.displayName = 'Skeleton';
