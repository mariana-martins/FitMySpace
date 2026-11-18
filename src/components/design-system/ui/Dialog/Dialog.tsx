'use client';

import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContext, useContext, useRef } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { Heading, Text } from '../Typography';
import styles from './Dialog.module.css';
import { Button } from '../Button';
import clsx from 'clsx';

import type {
  DialogBodyProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogProps,
  DialogSize,
  DialogTitleProps,
} from './Dialog.types';
import type { Ref } from 'react';

/* ---------------------------------------------------------------
 * Dialog
 *
 * Built on Radix Dialog. Radix owns the behaviour: the scrim, the
 * focus trap, Escape, the scroll lock, the return of focus to the
 * trigger, and the `aria-hidden` it puts on the rest of the page
 * while the dialog is open. `role="dialog"` and `aria-labelledby`
 * come from Radix too, from the `DialogTitle`; this file adds
 * `aria-modal`, which Radix leaves to the author.
 *
 * The parts are composed by the app, so one component carries a form,
 * a confirmation and a wall of text alike.
 * --------------------------------------------------------------- */

/* Radix keeps `modal` and `open` to itself. `DialogContent` needs `modal` to
   claim `aria-modal`, and `open` to put `data-state` on the centring box, so
   this context carries both down. */
const DialogStateContext = createContext({ modal: true, open: false });

export function Dialog({
  modal = true,
  open: openProp,
  defaultOpen,
  onOpenChange,
  ...rootProps
}: DialogProps) {
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: 'Dialog',
  });

  return (
    <DialogStateContext.Provider value={{ modal, open }}>
      <RadixDialog.Root modal={modal} open={open} onOpenChange={setOpen} {...rootProps} />
    </DialogStateContext.Provider>
  );
}

/* ---------------------------------------------------------------
 * DialogTrigger and DialogClose
 *
 * Deliberately unstyled: both take `asChild`, so the app's own `Button`
 * stays the thing you see.
 * --------------------------------------------------------------- */

export const DialogTrigger = RadixDialog.Trigger;
export const DialogClose = RadixDialog.Close;

/* ---------------------------------------------------------------
 * DialogContent
 *
 * Renders the portal, the scrim and the icon-only Close button, so a
 * dialog cannot be assembled without one of the three. The ref points
 * at the dialog box itself.
 * --------------------------------------------------------------- */

function sizeClass(size: DialogSize) {
  return styles[`size-${size}` as keyof typeof styles];
}

export function DialogContent({
  ref,
  ...props
}: DialogContentProps & { ref?: Ref<HTMLDivElement> }) {
  const {
    size = 'md',
    initialFocus = 'first',
    closeLabel = 'Close',
    children,
    className,
    onOpenAutoFocus,
    ...contentProps
  } = props;

  const { modal: isModal, open } = useContext(DialogStateContext);
  const frameRef = useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs(ref, frameRef);

  function handleOpenAutoFocus(event: Event) {
    onOpenAutoFocus?.(event);
    if (initialFocus !== 'title' || event.defaultPrevented) return;

    event.preventDefault();
    const title = frameRef.current?.querySelector<HTMLElement>('[data-dialog-title]');
    (title ?? frameRef.current)?.focus();
  }

  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className={styles.overlay} />
      <div className={styles.viewport} data-state={open ? 'open' : 'closed'}>
        <RadixDialog.Content
          asChild
          aria-modal={isModal ? true : undefined}
          onOpenAutoFocus={handleOpenAutoFocus}
          {...contentProps}
        >
          <div ref={composedRef} className={clsx(styles.content, sizeClass(size), className)}>
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
          </div>
        </RadixDialog.Content>
      </div>
    </RadixDialog.Portal>
  );
}

/* ---------------------------------------------------------------
 * DialogTitle
 *
 * The heading that names the dialog. `tabindex="-1"` is what lets
 * `initialFocus="title"` land on it; a screen reader still reads the
 * dialog's name, so the heading needs no other help.
 * --------------------------------------------------------------- */

export function DialogTitle({
  children,
  className,
  ref,
  ...titleProps
}: DialogTitleProps & { ref?: Ref<HTMLHeadingElement> }) {
  return (
    <RadixDialog.Title asChild>
      <Heading
        ref={ref}
        level={2}
        size="md"
        tabIndex={-1}
        data-dialog-title=""
        className={clsx(styles.title, className)}
        {...titleProps}
      >
        {children}
      </Heading>
    </RadixDialog.Title>
  );
}

/* ---------------------------------------------------------------
 * DialogDescription
 * --------------------------------------------------------------- */

/* The ref is the paragraph `Text` renders, so it is typed as loosely as `Text`
   itself rather than as the `<p>` Radix would have rendered. */
export function DialogDescription({
  children,
  className,
  ref,
  ...descriptionProps
}: DialogDescriptionProps & { ref?: Ref<HTMLElement> }) {
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
 * DialogBody
 * --------------------------------------------------------------- */

export function DialogBody({
  children,
  className,
  ref,
  ...bodyProps
}: DialogBodyProps & { ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className={clsx(styles.body, className)} {...bodyProps}>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------
 * DialogFooter
 * --------------------------------------------------------------- */

export function DialogFooter({
  children,
  className,
  ref,
  ...footerProps
}: DialogFooterProps & { ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className={clsx(styles.footer, className)} {...footerProps}>
      {children}
    </div>
  );
}
