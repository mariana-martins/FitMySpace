import type {
  TooltipContentProps as RadixTooltipContentProps,
  TooltipProps as RadixTooltipProps,
  TooltipProviderProps as RadixTooltipProviderProps,
  TooltipTriggerProps as RadixTooltipTriggerProps,
} from '@radix-ui/react-tooltip';

import type { ReactNode } from 'react';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

/* ---------------------------------------------------------------
 * Props
 *
 * A `Tooltip` is one short thought about a control, shown while the
 * control is hovered or focused:
 *
 *   <TooltipProvider>
 *     <Tooltip>
 *       <TooltipTrigger asChild><Button aria-label="Clear">…</Button></TooltipTrigger>
 *       <TooltipContent>Clears every filter in this search</TooltipContent>
 *     </Tooltip>
 *   </TooltipProvider>
 *
 * Radix owns the behaviour: the delay, the `role="tooltip"` bubble, the
 * `aria-describedby` it puts on the trigger, Escape, and keeping the
 * bubble on screen when the edge is close.
 *
 * A tooltip is optional reading. Anything the reader has to know — a
 * limit, a consequence, a password rule — belongs on the page, next to
 * the thing it describes, because a tooltip is hidden by default and
 * cannot be read on a touchscreen.
 * --------------------------------------------------------------- */

/**
 * Wraps the tooltips of a subtree so they share one delay and one timer:
 * the first takes `delayDuration` (700ms by default), the ones after it
 * appear at once until `skipDelayDuration` passes.
 */
export type TooltipProviderProps = RadixTooltipProviderProps;

/** `open`, `defaultOpen` and `onOpenChange` for the state, and `delayDuration` for this one tooltip. */
export type TooltipProps = RadixTooltipProps;

/** The control the thought is about. Pass `asChild` to render your own `Button`. */
export type TooltipTriggerProps = RadixTooltipTriggerProps;

/**
 * The bubble itself: text only. It never takes focus and closes as soon as
 * the pointer leaves the trigger, so a link or a button inside it could
 * never be reached. It does not name the trigger either — the trigger
 * needs its own name, and a screen reader reads the tooltip as a
 * description of it.
 */
export type TooltipContentProps = RadixTooltipContentProps & {
  children?: ReactNode;
};
