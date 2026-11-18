'use client';

import { UTILITY_VARIANT_ICONS, UTILITY_VARIANT_LABELS } from '../../utils';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import * as RadixToast from '@radix-ui/react-toast';
import { DS_ICONS, Icon } from '../Icon';
import styles from './Toast.module.css';
import { Button } from '../Button';
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
import type { Ref } from 'react';

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

export function ToastViewport({
  className,
  ref,
  ...viewportProps
}: ToastViewportProps & { ref?: Ref<HTMLOListElement> }) {
  return (
    <RadixToast.Viewport
      ref={ref}
      className={clsx(styles.viewport, className)}
      {...viewportProps}
    />
  );
}

export function Toast({
  variant = 'information',
  type,
  icon,
  className,
  children,
  ref,
  ...toastProps
}: ToastProps & { ref?: Ref<HTMLLIElement> }) {
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
}

export function ToastTitle({
  className,
  ref,
  ...titleProps
}: ToastTitleProps & { ref?: Ref<HTMLDivElement> }) {
  return <RadixToast.Title ref={ref} className={clsx(styles.title, className)} {...titleProps} />;
}

export function ToastDescription({
  className,
  ref,
  ...descriptionProps
}: ToastDescriptionProps & { ref?: Ref<HTMLDivElement> }) {
  return (
    <RadixToast.Description
      ref={ref}
      className={clsx(styles.description, className)}
      {...descriptionProps}
    />
  );
}

export function ToastAction({
  className,
  ref,
  ...actionProps
}: ToastActionProps & { ref?: Ref<HTMLButtonElement> }) {
  return (
    <RadixToast.Action ref={ref} className={clsx(styles.action, className)} {...actionProps} />
  );
}

export function ToastClose({
  className,
  ref,
  ...closeProps
}: ToastCloseProps & { ref?: Ref<HTMLButtonElement> }) {
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
}
