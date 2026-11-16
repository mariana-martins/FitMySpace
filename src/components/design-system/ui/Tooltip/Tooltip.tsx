'use client';

import * as RadixTooltip from '@radix-ui/react-tooltip';
import styles from './Tooltip.module.css';
import { forwardRef } from 'react';
import clsx from 'clsx';

import type { TooltipContentProps } from './Tooltip.types';

/* ---------------------------------------------------------------
 * Tooltip
 *
 * Built on Radix Tooltip. Only `TooltipContent` is drawn here: the
 * provider, the root and the trigger are Radix's own, passed through
 * so the app can configure the delay and render its own control.
 * --------------------------------------------------------------- */

// Gap between the control and the bubble: the arrow is 8px of it, so 4px of air
// is left, which is the semantic gap.xs.
const SIDE_OFFSET_PX = 12;
const ARROW_WIDTH_PX = 12;
const ARROW_HEIGHT_PX = 8;

/** Delays every tooltip inside it with one shared timer. Usually once, at the app root. */
export const TooltipProvider = RadixTooltip.Provider;

/** The state of one tooltip: `open`, `defaultOpen`, `onOpenChange`, and its own `delayDuration`. */
export const Tooltip = RadixTooltip.Root;

/** The control the thought is about. Pass `asChild` so your own control stays the thing you see. */
export const TooltipTrigger = RadixTooltip.Trigger;

/**
 * The bubble, in a portal above everything the page can open, on
 * `semantic.layer.floating` so it still shows over an open dialog.
 */
export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  function TooltipContent(
    { children, className, side = 'top', sideOffset = SIDE_OFFSET_PX, ...contentProps },
    ref,
  ) {
    return (
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          ref={ref}
          side={side}
          sideOffset={sideOffset}
          className={clsx(styles.content, className)}
          {...contentProps}
        >
          {children}
          <RadixTooltip.Arrow
            className={styles.arrow}
            width={ARROW_WIDTH_PX}
            height={ARROW_HEIGHT_PX}
          />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    );
  },
);

TooltipContent.displayName = 'TooltipContent';
