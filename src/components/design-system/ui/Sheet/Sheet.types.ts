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

export type SheetSide = 'start' | 'end' | 'bottom';
export type SheetSize = 'sm' | 'md';
export type SheetInitialFocus = 'first' | 'title';

/* ---------------------------------------------------------------
 * Props
 *
 * A `Sheet` is a modal dialog that slides in from an edge of the
 * screen instead of floating in the middle: the phone menu, the
 * filters on a phone. It is composed exactly like `Dialog`:
 *
 *   <Sheet>
 *     <SheetTrigger asChild><Button>…</Button></SheetTrigger>
 *     <SheetContent side="start">
 *       <SheetTitle>…</SheetTitle>
 *       <SheetDescription>…</SheetDescription>
 *       <SheetBody>…</SheetBody>
 *       <SheetFooter>…</SheetFooter>
 *     </SheetContent>
 *   </Sheet>
 *
 * Radix Dialog owns the behaviour: the scrim, the focus trap, Escape,
 * a click on the scrim, the scroll lock, the return of focus to the
 * trigger, and the `aria-hidden` on the rest of the page.
 * --------------------------------------------------------------- */

/**
 * Radix's root: `open`, `defaultOpen` and `onOpenChange` for the state. There is
 * no `modal` prop: a sheet covers the page it slides over, so it is always modal.
 */
export type SheetProps = Omit<RadixDialogProps, 'modal'>;

/** The control that opens the sheet. Pass `asChild` to render your own `Button`. */
export type SheetTriggerProps = RadixDialogTriggerProps;

/** A control that closes the sheet. Pass `asChild` to render your own `Button`. */
export type SheetCloseProps = RadixDialogCloseProps;

/**
 * The heading that names the sheet (`aria-labelledby`): a sheet without a title
 * has no accessible name, so always render one.
 */
export type SheetTitleProps = RadixDialogTitleProps;

/** One line on what the sheet is for, wired as `aria-describedby`. Optional. */
export type SheetDescriptionProps = RadixDialogDescriptionProps;

/** The scrolling part: the header and the footer stay put while this moves. */
export type SheetBodyProps = ComponentPropsWithoutRef<'div'>;

/** The actions, pinned to the bottom of the sheet. */
export type SheetFooterProps = ComponentPropsWithoutRef<'div'>;

export interface SheetContentProps extends Omit<RadixDialogContentProps, 'aria-modal'> {
  /**
   * The edge it slides in from. `start` (the left in a left-to-right page) for a
   * menu, `end` for filters and details, `bottom` for a few actions on a phone.
   */
  side?: SheetSide;
  /** Width of a `start` or `end` sheet: `sm` 384px, `md` 560px. A `bottom` sheet takes the full width. */
  size?: SheetSize;
  /**
   * Where the focus goes when the sheet opens: the first control, which is right
   * for filters, or the title, which is right for a menu of links.
   */
  initialFocus?: SheetInitialFocus;
  /** Accessible name of the icon-only Close button. Defaults to `Close`. */
  closeLabel?: string;
  /** The parts: `SheetTitle`, then the optional `SheetDescription`, `SheetBody`, `SheetFooter`. */
  children?: ReactNode;
}
