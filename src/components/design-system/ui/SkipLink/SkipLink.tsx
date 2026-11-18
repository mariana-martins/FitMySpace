import styles from './SkipLink.module.css';
import clsx from 'clsx';

import type { SkipLinkProps } from './SkipLink.types';
import type { Ref } from 'react';

/* ---------------------------------------------------------------
 * SkipLink
 *
 * A plain `<a href="#id">`: following a fragment moves the browser's
 * focus starting point and the screen reader's reading position to
 * the target, so no script is needed and it renders on the server.
 * Put it first in the body, before the header.
 * --------------------------------------------------------------- */

export function SkipLink({
  targetId = 'main-content',
  children = 'Skip to content',
  className,
  ref,
  ...rest
}: SkipLinkProps & { ref?: Ref<HTMLAnchorElement> }) {
  return (
    <a ref={ref} href={`#${targetId}`} className={clsx(styles['skip-link'], className)} {...rest}>
      {children}
    </a>
  );
}
