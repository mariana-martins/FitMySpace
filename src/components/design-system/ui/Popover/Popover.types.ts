import type {
  PopoverCloseProps as RadixPopoverCloseProps,
  PopoverContentProps as RadixPopoverContentProps,
  PopoverProps as RadixPopoverProps,
  PopoverTriggerProps as RadixPopoverTriggerProps,
} from '@radix-ui/react-popover';

import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type PopoverSize = 'sm' | 'md';

/* ---------------------------------------------------------------
 * Props
 *
 * A `Popover` is a small panel of controls that belongs to the button
 * that opened it, and leaves the rest of the page usable:
 *
 *   <Popover>
 *     <PopoverTrigger asChild><Button>Stores</Button></PopoverTrigger>
 *     <PopoverContent>
 *       <PopoverTitle>Stores</PopoverTitle>
 *       …controls…
 *       <PopoverFooter>
 *         <PopoverClose asChild><Button>Done</Button></PopoverClose>
 *       </PopoverFooter>
 *     </PopoverContent>
 *   </Popover>
 *
 * Radix owns the behaviour: `role="dialog"` on the panel,
 * `aria-expanded` and `aria-controls` on the trigger, the focus moving
 * in on open and back to the trigger on close, Escape, a click outside,
 * and keeping the panel on screen when the edge is close.
 * --------------------------------------------------------------- */

/**
 * Radix's root: `open`, `defaultOpen` and `onOpenChange` for the state, and
 * `modal` (default `false`): the page stays usable, which is what tells a
 * popover apart from a `Dialog`.
 */
export type PopoverProps = RadixPopoverProps;

/** The button that opens the panel. Pass `asChild` to render your own `Button`. */
export type PopoverTriggerProps = RadixPopoverTriggerProps;

/** A control that closes the panel. Pass `asChild` to render your own `Button`. */
export type PopoverCloseProps = RadixPopoverCloseProps;

export interface PopoverContentProps extends RadixPopoverContentProps {
  /** Width: `sm` 288px, `md` 384px, each capped by the space on screen. */
  size?: PopoverSize;
  /**
   * The parts: a `PopoverTitle` first, then the controls, then the optional
   * `PopoverFooter`. The panel is named by its title; without one, pass `aria-label`.
   */
  children?: ReactNode;
}

/**
 * The heading that names the panel (`aria-labelledby`), so a screen reader says
 * "Stores, dialog" when the focus moves in. Always render one, or give
 * `PopoverContent` an `aria-label` instead.
 */
export type PopoverTitleProps = Omit<ComponentPropsWithoutRef<'h2'>, 'id' | 'color'>;

/** The actions at the bottom, usually a `PopoverClose` ("Done") and a reset. */
export type PopoverFooterProps = ComponentPropsWithoutRef<'div'>;
