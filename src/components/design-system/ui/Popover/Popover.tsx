'use client';

import { createContext, useContext, useId } from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import styles from './Popover.module.css';
import { Heading } from '../Typography';
import clsx from 'clsx';

import type {
  PopoverContentProps,
  PopoverFooterProps,
  PopoverSize,
  PopoverTitleProps,
} from './Popover.types';
import type { Ref } from 'react';

/* ---------------------------------------------------------------
 * Popover
 *
 * Built on Radix Popover. Radix gives the panel `role="dialog"` but
 * leaves its name to the author, so `PopoverContent` points
 * `aria-labelledby` at the `PopoverTitle` through this context.
 * --------------------------------------------------------------- */

const SIDE_OFFSET_PX = 8;
const COLLISION_PADDING_PX = 16;

const PopoverTitleIdContext = createContext<string | undefined>(undefined);

export const Popover = RadixPopover.Root;

/* ---------------------------------------------------------------
 * PopoverTrigger and PopoverClose
 *
 * Deliberately unstyled: both take `asChild`, so the app's own `Button`
 * stays the thing you see.
 * --------------------------------------------------------------- */

export const PopoverTrigger = RadixPopover.Trigger;
export const PopoverClose = RadixPopover.Close;

/* ---------------------------------------------------------------
 * PopoverContent
 *
 * The panel, in a portal so no `overflow` on the page can clip it.
 * It has no arrow: the gap and the shadow already tie it to its
 * trigger, and the panel stays a plain card like the Select list.
 * --------------------------------------------------------------- */

function sizeClass(size: PopoverSize) {
  return styles[`size-${size}` as keyof typeof styles];
}

export function PopoverContent({
  ref,
  ...props
}: PopoverContentProps & { ref?: Ref<HTMLDivElement> }) {
  const {
    size = 'sm',
    side = 'bottom',
    align = 'start',
    sideOffset = SIDE_OFFSET_PX,
    collisionPadding = COLLISION_PADDING_PX,
    className,
    children,
    ...contentProps
  } = props;

  const titleId = useId();
  const isNamedByAuthor = Boolean(contentProps['aria-label'] ?? contentProps['aria-labelledby']);

  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        ref={ref}
        side={side}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        aria-labelledby={isNamedByAuthor ? undefined : titleId}
        className={clsx(styles.content, sizeClass(size), className)}
        {...contentProps}
      >
        <PopoverTitleIdContext.Provider value={titleId}>{children}</PopoverTitleIdContext.Provider>
      </RadixPopover.Content>
    </RadixPopover.Portal>
  );
}

/* ---------------------------------------------------------------
 * PopoverTitle
 * --------------------------------------------------------------- */

export function PopoverTitle({
  children,
  className,
  ref,
  ...titleProps
}: PopoverTitleProps & { ref?: Ref<HTMLHeadingElement> }) {
  const titleId = useContext(PopoverTitleIdContext);

  return (
    <Heading
      ref={ref}
      id={titleId}
      level={2}
      size="sm"
      className={clsx(styles.title, className)}
      {...titleProps}
    >
      {children}
    </Heading>
  );
}

/* ---------------------------------------------------------------
 * PopoverFooter
 * --------------------------------------------------------------- */

export function PopoverFooter({
  children,
  className,
  ref,
  ...footerProps
}: PopoverFooterProps & { ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className={clsx(styles.footer, className)} {...footerProps}>
      {children}
    </div>
  );
}
