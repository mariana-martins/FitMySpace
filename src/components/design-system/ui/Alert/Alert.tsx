import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Heading, Text } from '../Typography';
import styles from './Alert.module.css';
import { forwardRef } from 'react';
import clsx from 'clsx';

import type { AlertLive, AlertProps, AlertVariant } from './Alert.types';

import type { ReactElement, ReactNode } from 'react';

/* ---------------------------------------------------------------
 * Alert
 *
 * A live region: `role="status"` by default, `role="alert"` with
 * `live="assertive"`, none with `live="off"`. Both roles carry an
 * implicit `aria-live` and `aria-atomic`, so neither is set here.
 *
 * The live region has to be in the page before its text changes, so
 * the app keeps the `Alert` mounted and swaps its content: a region
 * inserted already filled with its message is often not announced.
 * With no message, the region stays but draws nothing, so the app
 * never has to hide it (`hidden` would take it out of the
 * accessibility tree, and the next message would be missed).
 *
 * The type of message is spoken, not only coloured: the icon is
 * decorative and a screen-reader-only prefix says "Error:" and so
 * on. The title is deliberately not wired with `aria-labelledby`:
 * some screen readers read a status's name before its content, and
 * the title is already inside that content.
 *
 * No client hooks, so it renders on the server.
 * --------------------------------------------------------------- */

const VARIANT_ICONS: Record<AlertVariant, ReactElement> = {
  information: <Info focusable="false" />,
  success: <CircleCheck focusable="false" />,
  warning: <TriangleAlert focusable="false" />,
  error: <CircleAlert focusable="false" />,
};

const LIVE_ROLES: Record<AlertLive, 'status' | 'alert' | undefined> = {
  polite: 'status',
  assertive: 'alert',
  off: undefined,
};

function hasMessage(children: ReactNode): boolean {
  if (typeof children === 'string') return children.trim() !== '';
  return children != null && typeof children !== 'boolean';
}

const VARIANT_LABELS: Record<AlertVariant, string> = {
  information: 'Information',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  const {
    variant = 'information',
    appearance = 'soft',
    title,
    headingLevel = 3,
    icon,
    live = 'polite',
    children,
    className,
    ...rest
  } = props;

  const role = LIVE_ROLES[live];

  if (!hasMessage(children)) {
    return <div ref={ref} role={role} className={className} {...rest} />;
  }

  return (
    <div
      ref={ref}
      role={role}
      className={clsx(
        styles.root,
        styles[`variant-${variant}` as keyof typeof styles],
        styles[`appearance-${appearance}` as keyof typeof styles],
        className,
      )}
      {...rest}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon ?? VARIANT_ICONS[variant]}
      </span>

      <div className={styles.content}>
        <VisuallyHidden>{`${VARIANT_LABELS[variant]}: `}</VisuallyHidden>

        {title && (
          <Heading level={headingLevel} size="sm" className={styles.title}>
            {title}
          </Heading>
        )}

        {typeof children === 'string' || typeof children === 'number' ? (
          <Text as="p" size="md" className={styles.body}>
            {children}
          </Text>
        ) : (
          <div className={styles.body}>{children}</div>
        )}
      </div>
    </div>
  );
});

Alert.displayName = 'Alert';
