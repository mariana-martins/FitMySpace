'use client';

import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import * as RadixToast from '@radix-ui/react-toast';
import styles from './Toast.module.css';
import { Button } from '../Button';
import { forwardRef } from 'react';
import clsx from 'clsx';

import type {
  ToastActionProps,
  ToastCloseProps,
  ToastDescriptionProps,
  ToastProps,
  ToastTitleProps,
  ToastVariant,
  ToastViewportProps,
} from './Toast.types';

import type { ReactElement } from 'react';

/* ---------------------------------------------------------------
 * Toast
 *
 * Built on Radix Toast, which is the W3C toast pattern: a labelled
 * region that holds the cards, one hidden live region per card for the
 * announcement, and a hotkey that moves focus into the region instead
 * of the toast stealing focus from whatever the reader was doing.
 *
 * The visible card is not the live region, which is what lets it hold a
 * button: MDN says `role="alert"` holds text only. Radix announces the
 * card through a separate region it fills on the next frame, because a
 * region created already holding its message is often read by nobody.
 *
 * The type of message is spoken, not only coloured, exactly as in
 * `Alert`: the icon is decorative and a screen-reader-only prefix says
 * "Error:" and so on.
 * --------------------------------------------------------------- */

const VARIANT_ICONS: Record<ToastVariant, ReactElement> = {
  information: <Info focusable="false" />,
  success: <CircleCheck focusable="false" />,
  warning: <TriangleAlert focusable="false" />,
  error: <CircleAlert focusable="false" />,
};

const VARIANT_LABELS: Record<ToastVariant, string> = {
  information: 'Information',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
};

/**
 * Only a wrong turn is worth interrupting the reader for; a confirmation
 * can wait for the pause between two sentences. MDN: `alert` "must be used
 * sparingly and only in situations where the user's immediate attention is
 * required".
 */
const VARIANT_LIVENESS: Record<ToastVariant, 'foreground' | 'background'> = {
  information: 'background',
  success: 'background',
  warning: 'foreground',
  error: 'foreground',
};

/**
 * Radix counts down from `duration`; `Infinity` is its own signal to never
 * start the timer. A card that vanishes mid-sentence is a card nobody read,
 * so the design keeps the timer off unless the app asks for one.
 */
const DISMISS_NEVER = Number.POSITIVE_INFINITY;

/** One per app, around everything that can raise a toast: it holds the shared label and default duration. */
export const ToastProvider = RadixToast.Provider;

/**
 * The stack the cards appear in, bottom-right on a desktop and bottom-centre
 * on a phone. Render it once, inside `ToastProvider`; Radix names the region
 * "Notifications (F8)" and the hotkey moves focus into it.
 */
export const ToastViewport = forwardRef<HTMLOListElement, ToastViewportProps>(
  function ToastViewport({ className, ...viewportProps }, ref) {
    return (
      <RadixToast.Viewport
        ref={ref}
        className={clsx(styles.viewport, className)}
        {...viewportProps}
      />
    );
  },
);

/** One card in the stack. Its text is announced; it never takes focus by itself. */
export const Toast = forwardRef<HTMLLIElement, ToastProps>(function Toast(
  {
    variant = 'information',
    type,
    icon,
    duration = DISMISS_NEVER,
    className,
    children,
    ...toastProps
  },
  ref,
) {
  return (
    <RadixToast.Root
      ref={ref}
      type={type ?? VARIANT_LIVENESS[variant]}
      duration={duration}
      className={clsx(styles.toast, styles[`variant-${variant}` as keyof typeof styles], className)}
      {...toastProps}
    >
      <span className={styles.icon} aria-hidden="true">
        {icon ?? VARIANT_ICONS[variant]}
      </span>

      <div className={styles.body}>
        <VisuallyHidden>{`${VARIANT_LABELS[variant]}: `}</VisuallyHidden>
        {children}
      </div>
    </RadixToast.Root>
  );
});

Toast.displayName = 'Toast';

/** The first line: what happened. */
export const ToastTitle = forwardRef<HTMLDivElement, ToastTitleProps>(function ToastTitle(
  { className, ...titleProps },
  ref,
) {
  return <RadixToast.Title ref={ref} className={clsx(styles.title, className)} {...titleProps} />;
});

ToastTitle.displayName = 'ToastTitle';

/** The second line: the detail, if the title cannot carry it alone. */
export const ToastDescription = forwardRef<HTMLDivElement, ToastDescriptionProps>(
  function ToastDescription({ className, ...descriptionProps }, ref) {
    return (
      <RadixToast.Description
        ref={ref}
        className={clsx(styles.description, className)}
        {...descriptionProps}
      />
    );
  },
);

ToastDescription.displayName = 'ToastDescription';

/**
 * The one thing the reader can do about it, and it closes the card.
 * `altText` says in one phrase what the button does, because the reader
 * hears the announcement long before they can reach the button.
 */
export const ToastAction = forwardRef<HTMLButtonElement, ToastActionProps>(function ToastAction(
  { className, ...actionProps },
  ref,
) {
  return (
    <RadixToast.Action ref={ref} className={clsx(styles.action, className)} {...actionProps} />
  );
});

ToastAction.displayName = 'ToastAction';

/** Dismiss without acting: the X in the corner. Pass `aria-label` to name it otherwise. */
export const ToastClose = forwardRef<HTMLButtonElement, ToastCloseProps>(function ToastClose(
  { className, ...closeProps },
  ref,
) {
  return (
    <RadixToast.Close asChild>
      <Button
        ref={ref}
        variant="secondary"
        appearance="ghost"
        size="sm"
        icon={<X focusable="false" />}
        aria-label="Close"
        className={clsx(styles.close, className)}
        {...closeProps}
      />
    </RadixToast.Close>
  );
});

ToastClose.displayName = 'ToastClose';
