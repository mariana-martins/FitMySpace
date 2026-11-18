import type {
  AlertDialogActionProps as RadixAlertDialogActionProps,
  AlertDialogCancelProps as RadixAlertDialogCancelProps,
  AlertDialogContentProps as RadixAlertDialogContentProps,
  AlertDialogDescriptionProps as RadixAlertDialogDescriptionProps,
  AlertDialogProps as RadixAlertDialogProps,
  AlertDialogTitleProps as RadixAlertDialogTitleProps,
  AlertDialogTriggerProps as RadixAlertDialogTriggerProps,
} from '@radix-ui/react-alert-dialog';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type AlertDialogSize = 'sm' | 'md';
export type AlertDialogInitialFocus = 'cancel' | 'action' | 'title';

/* ---------------------------------------------------------------
 * Props
 *
 * `AlertDialog` is composed exactly like `Dialog`, with the parts
 * named for the decision the reader has to make:
 *
 *   <AlertDialog>
 *     <AlertDialogTrigger asChild><Button>…</Button></AlertDialogTrigger>
 *     <AlertDialogContent>
 *       <AlertDialogTitle>…</AlertDialogTitle>
 *       <AlertDialogDescription>…</AlertDialogDescription>
 *       <AlertDialogBody>…</AlertDialogBody>
 *       <AlertDialogFooter>
 *         <AlertDialogCancel asChild><Button>…</Button></AlertDialogCancel>
 *         <AlertDialogAction asChild><Button>…</Button></AlertDialogAction>
 *       </AlertDialogFooter>
 *     </AlertDialogContent>
 *   </AlertDialog>
 *
 * Radix owns the behaviour, and it is the behaviour of an alert
 * dialog: the scrim, the focus trap, Escape (which cancels), the
 * scroll lock, the return of focus to the trigger, and the
 * `aria-hidden` on everything else. Unlike `Dialog`, an alert dialog
 * cannot be dismissed by clicking the scrim or by clicking outside,
 * and it is always modal — Radix leaves `modal` out of its props
 * because there is no non-modal alert dialog.
 * --------------------------------------------------------------- */

/**
 * Radix's root: `open`, `defaultOpen` and `onOpenChange` for the state.
 * There is no `modal` prop: an alert dialog is always modal.
 */
export type AlertDialogProps = RadixAlertDialogProps;

/** The control that opens the alert dialog. Pass `asChild` to render your own `Button`. */
export type AlertDialogTriggerProps = RadixAlertDialogTriggerProps;

/**
 * The way out that changes nothing. Pass `asChild` to render your own `Button`, and
 * give it the words of the safe answer ("Keep room"), not just "Close".
 */
export type AlertDialogCancelProps = RadixAlertDialogCancelProps;

/**
 * The way out that does the thing. Pass `asChild` to render your own `Button` and put the
 * work in its `onClick`: Radix runs it, then closes the dialog. Call `event.preventDefault()`
 * there to keep the dialog open, e.g. while the request runs or to show why it failed.
 */
export type AlertDialogActionProps = RadixAlertDialogActionProps;

/**
 * The heading that states the question. Radix names the dialog with `aria-labelledby`
 * from it, so a dialog without a title has no accessible name: always render one.
 */
export type AlertDialogTitleProps = RadixAlertDialogTitleProps;

/**
 * What happens if the reader goes ahead, in one or two lines. Unlike
 * `DialogDescription`, this one is not optional: the ARIA alert dialog
 * pattern asks for `aria-describedby` pointing at the message, because
 * the reader is being asked to decide and needs the consequence read out
 * with the question. Radix leaves the attribute off when no description
 * is rendered, so leaving it out is a broken alert dialog, not a shorter one.
 */
export type AlertDialogDescriptionProps = RadixAlertDialogDescriptionProps;

/** The scrolling part, for the rare alert dialog with more to read than one line. */
export type AlertDialogBodyProps = ComponentPropsWithoutRef<'div'>;

/**
 * The two ways out: `AlertDialogCancel` first, then `AlertDialogAction`. On a
 * narrow screen they stack, one under the other, full width, so the destructive
 * action is never the one a thumb hits by accident.
 */
export type AlertDialogFooterProps = ComponentPropsWithoutRef<'div'>;

export interface AlertDialogContentProps extends Omit<RadixAlertDialogContentProps, 'aria-modal'> {
  size?: AlertDialogSize;
  /**
   * Where the focus goes when the dialog opens. Defaults to `cancel`, which is
   * what the alert dialog pattern asks for before an irreversible action: the
   * reader can always leave safely with the key already on a button. Use `action`
   * when the action is the expected one (sign in again, continue) and `title`
   * when the dialog only tells the reader something.
   */
  initialFocus?: AlertDialogInitialFocus;
  /** The parts: `AlertDialogTitle`, `AlertDialogDescription`, then the optional `AlertDialogBody` and the `AlertDialogFooter`. */
  children?: ReactNode;
}
