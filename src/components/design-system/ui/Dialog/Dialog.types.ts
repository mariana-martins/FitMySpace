import type {
  DialogCloseProps as RadixDialogCloseProps,
  DialogContentProps as RadixDialogContentProps,
  DialogDescriptionProps as RadixDialogDescriptionProps,
  DialogProps as RadixDialogProps,
  DialogTitleProps as RadixDialogTitleProps,
  DialogTriggerProps as RadixDialogTriggerProps,
} from '@radix-ui/react-dialog';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type DialogSize = 'sm' | 'md' | 'lg';
export type DialogInitialFocus = 'first' | 'title';

/* ---------------------------------------------------------------
 * Props
 *
 * `Dialog` is composed, not configured: the app writes the parts in
 * order inside `DialogContent`, so a dialog can hold a form, a table
 * or a paragraph without the component knowing the difference.
 *
 *   <Dialog>
 *     <DialogTrigger asChild><Button>…</Button></DialogTrigger>
 *     <DialogContent>
 *       <DialogTitle>…</DialogTitle>
 *       <DialogDescription>…</DialogDescription>
 *       <DialogBody>…</DialogBody>
 *       <DialogFooter>…</DialogFooter>
 *     </DialogContent>
 *   </Dialog>
 *
 * Radix owns the behaviour: the scrim, the focus trap, Escape, the
 * scroll lock, the return of focus to the trigger, and the
 * `aria-hidden` it puts on everything else while the dialog is open.
 * --------------------------------------------------------------- */

/**
 * Radix's root: `open`, `defaultOpen` and `onOpenChange` for the state,
 * and `modal` (default `true`) for whether the page behind can be used.
 */
export type DialogProps = RadixDialogProps;

/** The control that opens the dialog. Pass `asChild` to render your own `Button`. */
export type DialogTriggerProps = RadixDialogTriggerProps;

/** A control that closes the dialog. Pass `asChild` to render your own `Button`. */
export type DialogCloseProps = RadixDialogCloseProps;

/**
 * The heading that names the dialog. Radix wires it as `aria-labelledby`,
 * so a dialog without a title has no accessible name: always render one.
 */
export type DialogTitleProps = RadixDialogTitleProps;

/**
 * The one line that says what the dialog is for, wired as
 * `aria-describedby`. Leave it out entirely when there is nothing to
 * add: Radix then drops the attribute, and a screen reader does not
 * need a description repeated for a dialog whose title already says it.
 */
export type DialogDescriptionProps = RadixDialogDescriptionProps;

/** The scrolling part: the header and the footer stay put while this moves. */
export type DialogBodyProps = ComponentPropsWithoutRef<'div'>;

/**
 * The actions, usually a `DialogClose` beside the confirming `Button`.
 * On a narrow screen they stack, one under the other, full width.
 */
export type DialogFooterProps = ComponentPropsWithoutRef<'div'>;

export interface DialogContentProps extends Omit<RadixDialogContentProps, 'aria-modal'> {
  size?: DialogSize;
  /**
   * Where the focus goes when the dialog opens: the first control, which
   * is right for a form, or the title, which is right for a dialog with
   * nothing to fill in.
   */
  initialFocus?: DialogInitialFocus;
  /** Accessible name of the icon-only Close button. Defaults to `Close`. */
  closeLabel?: string;
  /** The parts: `DialogTitle`, then the optional `DialogDescription`, `DialogBody`, `DialogFooter`. */
  children?: ReactNode;
}
