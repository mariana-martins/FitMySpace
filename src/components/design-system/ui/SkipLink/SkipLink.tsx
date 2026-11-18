import styles from './SkipLink.module.css';
import { forwardRef } from 'react';
import clsx from 'clsx';

import type { SkipLinkProps } from './SkipLink.types';

/* ---------------------------------------------------------------
 * SkipLink
 *
 * A plain `<a href="#id">`: following a fragment moves the browser's
 * focus starting point and the screen reader's reading position to
 * the target, so no script is needed and it renders on the server.
 * Put it first in the body, before the header.
 * --------------------------------------------------------------- */

export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(function SkipLink(
  { targetId = 'main-content', children = 'Skip to content', className, ...rest },
  ref,
) {
  return (
    <a ref={ref} href={`#${targetId}`} className={clsx(styles['skip-link'], className)} {...rest}>
      {children}
    </a>
  );
});

SkipLink.displayName = 'SkipLink';
