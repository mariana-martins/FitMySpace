import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { ArrowUpRight } from 'lucide-react';
import styles from './Link.module.css';
import { forwardRef } from 'react';
import clsx from 'clsx';

import type { LinkProps } from './Link.types';

/* ---------------------------------------------------------------
 * Link
 *
 * A native <a>, or the child element through Radix Slot when
 * `asChild` is set (e.g. Next.js <Link>). No client hooks, so it
 * renders on the server.
 *
 * The standalone underline is a background gradient, not a border:
 * it grows from the left on hover and leaves towards the right,
 * because only `background-size` is animated while the position
 * jumps between the two ends.
 * --------------------------------------------------------------- */

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(props, ref) {
  const {
    appearance = 'inline',
    size,
    opensInNewTab = false,
    stretched = false,
    asChild = false,
    className,
    children,
    rel,
    ...rest
  } = props;

  const Component = asChild ? Slot : 'a';

  return (
    <Component
      ref={ref}
      className={clsx(
        styles.link,
        styles[appearance],
        appearance === 'standalone' && size && styles[`size-${size}` as keyof typeof styles],
        stretched && styles.stretched,
        className,
      )}
      data-link-stretched={stretched || undefined}
      target={opensInNewTab ? '_blank' : undefined}
      rel={opensInNewTab ? clsx('noopener noreferrer', rel) : rel}
      {...rest}
    >
      <Slottable>{children}</Slottable>
      {opensInNewTab && (
        <>
          <ArrowUpRight className={styles['new-tab-icon']} aria-hidden="true" focusable="false" />
          <VisuallyHidden> (opens in a new tab)</VisuallyHidden>
        </>
      )}
    </Component>
  );
});

Link.displayName = 'Link';
