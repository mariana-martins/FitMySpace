import type {
  ToastActionProps as RadixToastActionProps,
  ToastCloseProps as RadixToastCloseProps,
  ToastDescriptionProps as RadixToastDescriptionProps,
  ToastProps as RadixToastProps,
  ToastProviderProps as RadixToastProviderProps,
  ToastTitleProps as RadixToastTitleProps,
  ToastViewportProps as RadixToastViewportProps,
} from '@radix-ui/react-toast';

import type { ReactElement } from 'react';

/* ---------------------------------------------------------------
 * Toast
 *
 * The parts are Radix's own, so their props are aliased rather than
 * copied: the app can reach every one of Radix's options.
 * --------------------------------------------------------------- */

/** The four utility messages, the same four as `Alert`. */
export type ToastVariant = 'information' | 'success' | 'warning' | 'error';

/**
 * How loudly the toast is announced. `foreground` interrupts whatever the
 * screen reader is saying (an error, a warning); `background` waits for the
 * reader's next pause (a confirmation). Radix sets `aria-live` from it, so
 * neither role nor `aria-live` is ours to write.
 */
export type ToastType = 'foreground' | 'background';

export type ToastProviderProps = RadixToastProviderProps;
export type ToastViewportProps = RadixToastViewportProps;
export type ToastTitleProps = RadixToastTitleProps;
export type ToastDescriptionProps = RadixToastDescriptionProps;

/** `altText` is required by Radix: it says what the button does in the announcement. */
export type ToastActionProps = RadixToastActionProps;
export type ToastCloseProps = RadixToastCloseProps;

export interface ToastProps extends RadixToastProps {
  variant?: ToastVariant;
  /** Defaults to the variant's own icon: `information`, `success`, `warning` or `error`. */
  icon?: ReactElement;
}
