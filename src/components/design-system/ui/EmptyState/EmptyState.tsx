import { Heading, Text } from '../Typography';
import styles from './EmptyState.module.css';
import { SearchX } from 'lucide-react';
import { forwardRef } from 'react';
import clsx from 'clsx';

import type { EmptyStateProps } from './EmptyState.types';

/* ---------------------------------------------------------------
 * EmptyState
 *
 * Presentational and static: no live region and no client hooks,
 * so it renders on the server. The icon is hidden from assistive
 * technology; the heading carries the message.
 * --------------------------------------------------------------- */

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  function EmptyState(props, ref) {
    const { title, headingLevel = 2, description, icon, className, children, ...rest } = props;

    return (
      <div ref={ref} className={clsx(styles.root, className)} {...rest}>
        <span className={styles.icon} aria-hidden="true">
          {icon ?? <SearchX focusable="false" />}
        </span>
        <Heading level={headingLevel} size="sm" className={styles.title}>
          {title}
        </Heading>
        {description && (
          <Text as="p" size="md" className={styles.description}>
            {description}
          </Text>
        )}
        {children && <div className={styles.actions}>{children}</div>}
      </div>
    );
  },
);

EmptyState.displayName = 'EmptyState';
