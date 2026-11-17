'use client';

import { UTILITY_VARIANT_ICONS, UTILITY_VARIANT_LABELS } from '../../utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import * as RadixToast from '@radix-ui/react-toast';
import { DS_ICONS, Icon } from '../Icon';
import styles from './Toast.module.css';
import { Button } from '../Button';
import { forwardRef } from 'react';
import clsx from 'clsx';

import type {
  ToastActionProps,
  ToastCloseProps,
  ToastDescriptionProps,
  ToastProps,
  ToastProviderProps,
  ToastTitleProps,
  ToastVariant,
  ToastViewportProps,
} from './Toast.types';

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

const DISMISS_NEVER = Number.POSITIVE_INFINITY;

export function ToastProvider({ duration = DISMISS_NEVER, ...providerProps }: ToastProviderProps) {
  return <RadixToast.Provider duration={duration} {...providerProps} />;
}

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

export const Toast = forwardRef<HTMLLIElement, ToastProps>(function Toast(
  { variant = 'information', type, icon, className, children, ...toastProps },
  ref,
) {
  return (
    <RadixToast.Root
      ref={ref}
      type={type ?? VARIANT_LIVENESS[variant]}
      className={clsx(styles.toast, styles[`variant-${variant}` as keyof typeof styles], className)}
      {...toastProps}
    >
      <Icon className={styles.icon}>{DS_ICONS[icon ?? UTILITY_VARIANT_ICONS[variant]].icon}</Icon>

      <div className={styles.body}>
        <VisuallyHidden>{`${UTILITY_VARIANT_LABELS[variant]}: `}</VisuallyHidden>
        {children}
      </div>
    </RadixToast.Root>
  );
});

Toast.displayName = 'Toast';

export const ToastTitle = forwardRef<HTMLDivElement, ToastTitleProps>(function ToastTitle(
  { className, ...titleProps },
  ref,
) {
  return <RadixToast.Title ref={ref} className={clsx(styles.title, className)} {...titleProps} />;
});

ToastTitle.displayName = 'ToastTitle';

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

export const ToastAction = forwardRef<HTMLButtonElement, ToastActionProps>(function ToastAction(
  { className, ...actionProps },
  ref,
) {
  return (
    <RadixToast.Action ref={ref} className={clsx(styles.action, className)} {...actionProps} />
  );
});

ToastAction.displayName = 'ToastAction';

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
        icon="x"
        aria-label="Close"
        className={clsx(styles.close, className)}
        {...closeProps}
      />
    </RadixToast.Close>
  );
});

ToastClose.displayName = 'ToastClose';
