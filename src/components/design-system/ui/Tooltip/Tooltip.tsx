'use client';

import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import styles from './Tooltip.module.css';
import clsx from 'clsx';

import type {
  TooltipContentProps,
  TooltipProps,
  TooltipProviderProps,
  TooltipTriggerProps,
} from './Tooltip.types';

import type { RefObject, Ref } from 'react';

/* ---------------------------------------------------------------
 * Tooltip
 *
 * Built on Radix Tooltip. Only `TooltipContent` is drawn here: the
 * provider, the root and the trigger are Radix's own, passed through
 * so the app can configure the delay and render its own control.
 * --------------------------------------------------------------- */

const SIDE_OFFSET_PX = 12;
const ARROW_WIDTH_PX = 12;
const ARROW_HEIGHT_PX = 8;

/* ---------------------------------------------------------------
 * Moving from one trigger to the next
 *
 * When the pointer leaves a trigger, Radix keeps the bubble open while
 * the pointer crosses the area between the trigger and the bubble, so
 * the reader can move onto it (WCAG 1.4.13). While that area is live,
 * the provider ignores every other trigger: in a toolbar, the next
 * button's tooltip waited, sometimes for seconds, until the pointer
 * happened to leave the area. So the provider remembers the open
 * tooltip, and entering another trigger closes it, which ends the
 * crossing and lets the new one open.
 * --------------------------------------------------------------- */

type CloseTooltip = () => void;

const OpenTooltipContext = createContext<RefObject<CloseTooltip | null> | null>(null);
const TooltipCloseOthersContext = createContext<() => void>(() => undefined);

export function TooltipProvider(providerProps: TooltipProviderProps) {
  const closeOpenTooltipRef = useRef<CloseTooltip | null>(null);

  return (
    <OpenTooltipContext.Provider value={closeOpenTooltipRef}>
      <RadixTooltip.Provider {...providerProps} />
    </OpenTooltipContext.Provider>
  );
}

export function Tooltip({ open: openProp, defaultOpen, onOpenChange, ...rootProps }: TooltipProps) {
  const closeOpenTooltipRef = useContext(OpenTooltipContext);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: 'Tooltip',
  });

  const close = useCallback(() => setOpen(false), [setOpen]);

  useEffect(() => {
    if (!closeOpenTooltipRef) return;
    if (open) {
      closeOpenTooltipRef.current = close;
    } else if (closeOpenTooltipRef.current === close) {
      closeOpenTooltipRef.current = null;
    }
  }, [open, close, closeOpenTooltipRef]);

  const closeOthers = useCallback(() => {
    const closeOpenTooltip = closeOpenTooltipRef?.current;
    if (closeOpenTooltip && closeOpenTooltip !== close) closeOpenTooltip();
  }, [close, closeOpenTooltipRef]);

  return (
    <TooltipCloseOthersContext.Provider value={closeOthers}>
      <RadixTooltip.Root open={open} onOpenChange={setOpen} {...rootProps} />
    </TooltipCloseOthersContext.Provider>
  );
}

export function TooltipTrigger({
  onPointerEnter,
  ref,
  ...triggerProps
}: TooltipTriggerProps & { ref?: Ref<HTMLButtonElement> }) {
  const closeOthers = useContext(TooltipCloseOthersContext);

  return (
    <RadixTooltip.Trigger
      ref={ref}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        closeOthers();
      }}
      {...triggerProps}
    />
  );
}

export function TooltipContent({
  children,
  className,
  side = 'top',
  sideOffset = SIDE_OFFSET_PX,
  ref,
  ...contentProps
}: TooltipContentProps & { ref?: Ref<HTMLDivElement> }) {
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
}
