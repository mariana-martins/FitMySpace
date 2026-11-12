import { Slot } from '@radix-ui/react-slot';
import styles from './Card.module.css';
import { forwardRef } from 'react';
import clsx from 'clsx';

import type { CardMediaProps, CardProps } from './Card.types';

/* ---------------------------------------------------------------
 * Card
 *
 * A surface for one item, built for composition. With `asChild`,
 * Radix Slot merges the classes onto the child element. No client
 * hooks, so it renders on the server.
 *
 * The card is the positioned ancestor of a `<Link stretched>`, so
 * that link's click area and focus ring cover the whole card.
 * --------------------------------------------------------------- */

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(props, ref) {
  const { appearance = 'raised', padding = 'md', asChild = false, className, ...rest } = props;
  const Component = asChild ? Slot : 'div';

  return (
    <Component
      ref={ref}
      className={clsx(
        styles.card,
        styles[appearance],
        styles[`padding-${padding}` as keyof typeof styles],
        className,
      )}
      {...rest}
    />
  );
});

Card.displayName = 'Card';

/* ---------------------------------------------------------------
 * CardMedia
 * --------------------------------------------------------------- */

export const CardMedia = forwardRef<HTMLDivElement, CardMediaProps>(function CardMedia(props, ref) {
  const { aspectRatio = 'landscape', className, ...rest } = props;

  return (
    <div
      ref={ref}
      className={clsx(
        styles.media,
        styles[`ratio-${aspectRatio}` as keyof typeof styles],
        className,
      )}
      {...rest}
    />
  );
});

CardMedia.displayName = 'CardMedia';
