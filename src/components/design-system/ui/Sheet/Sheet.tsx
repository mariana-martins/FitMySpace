'use client';

import { useComposedRefs } from '@radix-ui/react-compose-refs';
import * as RadixDialog from '@radix-ui/react-dialog';
import { Heading, Text } from '../Typography';
import styles from './Sheet.module.css';
import { Button } from '../Button';
import { useRef } from 'react';
import clsx from 'clsx';

import type {
  SheetBodyProps,
  SheetContentProps,
  SheetDescriptionProps,
  SheetFooterProps,
  SheetProps,
  SheetTitleProps,
} from './Sheet.types';
import type { Ref } from 'react';

/* ---------------------------------------------------------------
 * Sheet
 *
 * Built on Radix Dialog, like `Dialog`: the same behaviour and the
 * same parts, drawn against an edge of the screen. The sheet is the
 * Radix content itself, with no centring box around it, so Radix's
 * own `data-state` drives the slide in and out. `aria-modal` is added
 * here, because Radix leaves it to the author.
 * --------------------------------------------------------------- */

export function Sheet(rootProps: SheetProps) {
  return <RadixDialog.Root modal {...rootProps} />;
}

/* ---------------------------------------------------------------
 * SheetTrigger and SheetClose
 *
 * Deliberately unstyled: both take `asChild`, so the app's own `Button`
 * stays the thing you see.
 * --------------------------------------------------------------- */

export const SheetTrigger = RadixDialog.Trigger;
export const SheetClose = RadixDialog.Close;

/* ---------------------------------------------------------------
 * SheetContent
 *
 * Renders the portal, the scrim and the icon-only Close button, so a
 * sheet cannot be assembled without one of the three.
 * --------------------------------------------------------------- */

export function SheetContent({ ref, ...props }: SheetContentProps & { ref?: Ref<HTMLDivElement> }) {
  const {
    side = 'end',
    size = 'sm',
    initialFocus = 'first',
    closeLabel = 'Close',
    children,
    className,
    onOpenAutoFocus,
    ...contentProps
  } = props;

  const sheetRef = useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs(ref, sheetRef);

  function handleOpenAutoFocus(event: Event) {
    onOpenAutoFocus?.(event);
    if (initialFocus !== 'title' || event.defaultPrevented) return;

    event.preventDefault();
    const title = sheetRef.current?.querySelector<HTMLElement>('[data-sheet-title]');
    (title ?? sheetRef.current)?.focus();
  }

  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className={styles.overlay} />
      <RadixDialog.Content
        ref={composedRef}
        aria-modal
        data-side={side}
        onOpenAutoFocus={handleOpenAutoFocus}
        className={clsx(styles.content, styles[`size-${size}` as keyof typeof styles], className)}
        {...contentProps}
      >
        {children}

        <RadixDialog.Close asChild>
          <Button
            variant="secondary"
            appearance="ghost"
            size="sm"
            icon="x"
            aria-label={closeLabel}
            className={styles.close}
          />
        </RadixDialog.Close>
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

/* ---------------------------------------------------------------
 * SheetTitle
 *
 * `tabindex="-1"` is what lets `initialFocus="title"` land on it.
 * --------------------------------------------------------------- */

export function SheetTitle({
  children,
  className,
  ref,
  ...titleProps
}: SheetTitleProps & { ref?: Ref<HTMLHeadingElement> }) {
  return (
    <RadixDialog.Title asChild>
      <Heading
        ref={ref}
        level={2}
        size="md"
        tabIndex={-1}
        data-sheet-title=""
        className={clsx(styles.title, className)}
        {...titleProps}
      >
        {children}
      </Heading>
    </RadixDialog.Title>
  );
}

/* ---------------------------------------------------------------
 * SheetDescription
 * --------------------------------------------------------------- */

/* The ref is the paragraph `Text` renders, so it is typed as loosely as `Text`
   itself rather than as the `<p>` Radix would have rendered. */
export function SheetDescription({
  children,
  className,
  ref,
  ...descriptionProps
}: SheetDescriptionProps & { ref?: Ref<HTMLElement> }) {
  return (
    <RadixDialog.Description asChild>
      <Text
        ref={ref}
        as="p"
        size="md"
        className={clsx(styles.description, className)}
        {...descriptionProps}
      >
        {children}
      </Text>
    </RadixDialog.Description>
  );
}

/* ---------------------------------------------------------------
 * SheetBody and SheetFooter
 * --------------------------------------------------------------- */

export function SheetBody({
  children,
  className,
  ref,
  ...bodyProps
}: SheetBodyProps & { ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className={clsx(styles.body, className)} {...bodyProps}>
      {children}
    </div>
  );
}

export function SheetFooter({
  children,
  className,
  ref,
  ...footerProps
}: SheetFooterProps & { ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className={clsx(styles.footer, className)} {...footerProps}>
      {children}
    </div>
  );
}
