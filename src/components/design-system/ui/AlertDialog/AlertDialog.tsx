'use client';

import { useControllableState } from '@radix-ui/react-use-controllable-state';
import * as RadixAlertDialog from '@radix-ui/react-alert-dialog';
import { useComposedRefs } from '@radix-ui/react-compose-refs';
import { createContext, useContext, useRef } from 'react';
import styles from './AlertDialog.module.css';
import { Heading, Text } from '../Typography';
import clsx from 'clsx';

import type {
  AlertDialogActionProps,
  AlertDialogBodyProps,
  AlertDialogCancelProps,
  AlertDialogContentProps,
  AlertDialogDescriptionProps,
  AlertDialogFooterProps,
  AlertDialogInitialFocus,
  AlertDialogProps,
  AlertDialogSize,
  AlertDialogTitleProps,
} from './AlertDialog.types';
import type { Ref } from 'react';

/* ---------------------------------------------------------------
 * AlertDialog
 *
 * Built on Radix AlertDialog, which is Radix Dialog with the rules of
 * `role="alertdialog"` applied: always modal, Escape cancels, and
 * clicking the scrim or outside does nothing, because the reader owes
 * the dialog an answer. Radix also owns the focus trap, the scroll
 * lock, the return of focus to the trigger and the `aria-hidden` on
 * the rest of the page. `role="alertdialog"`, `aria-labelledby` and
 * `aria-describedby` come from Radix; this file adds `aria-modal`,
 * which Radix leaves to the author, exactly as `Dialog` does.
 * --------------------------------------------------------------- */

/* Radix keeps `open` to itself, and `AlertDialogContent` needs it to put
   `data-state` on the centring box, so this context carries it down. */
const AlertDialogStateContext = createContext(false);

export function AlertDialog({
  open: openProp,
  defaultOpen,
  onOpenChange,
  ...rootProps
}: AlertDialogProps) {
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: 'AlertDialog',
  });

  return (
    <AlertDialogStateContext.Provider value={open}>
      <RadixAlertDialog.Root open={open} onOpenChange={setOpen} {...rootProps} />
    </AlertDialogStateContext.Provider>
  );
}

/* ---------------------------------------------------------------
 * AlertDialogTrigger
 *
 * Deliberately unstyled: it takes `asChild`, so the app's own `Button`
 * stays the thing you see.
 * --------------------------------------------------------------- */

export const AlertDialogTrigger = RadixAlertDialog.Trigger;

/* ---------------------------------------------------------------
 * AlertDialogAction and AlertDialogCancel
 *
 * Unstyled too, for the same reason. Each one leaves a data attribute
 * behind, on the app's `Button` when it is used with `asChild`, so the
 * content can aim the initial focus at either answer without the app
 * passing a ref.
 * --------------------------------------------------------------- */

export function AlertDialogCancel({
  ref,
  ...cancelProps
}: AlertDialogCancelProps & { ref?: Ref<HTMLButtonElement> }) {
  return <RadixAlertDialog.Cancel ref={ref} data-alert-dialog-cancel="" {...cancelProps} />;
}

export function AlertDialogAction({
  ref,
  ...actionProps
}: AlertDialogActionProps & { ref?: Ref<HTMLButtonElement> }) {
  return <RadixAlertDialog.Action ref={ref} data-alert-dialog-action="" {...actionProps} />;
}

/* ---------------------------------------------------------------
 * AlertDialogContent
 *
 * Renders the portal and the scrim. There is no Close button here, on
 * purpose: an alert dialog has two answers and a corner cross would be
 * a third one that says nothing. The way out is `AlertDialogCancel`,
 * and Escape takes the same path.
 * --------------------------------------------------------------- */

const FOCUS_TARGETS: Record<AlertDialogInitialFocus, string> = {
  cancel: '[data-alert-dialog-cancel]',
  action: '[data-alert-dialog-action]',
  title: '[data-alert-dialog-title]',
};

function sizeClass(size: AlertDialogSize) {
  return styles[`size-${size}` as keyof typeof styles];
}

export function AlertDialogContent({
  ref,
  ...props
}: AlertDialogContentProps & { ref?: Ref<HTMLDivElement> }) {
  const {
    size = 'sm',
    initialFocus = 'cancel',
    children,
    className,
    onOpenAutoFocus,
    ...contentProps
  } = props;

  const open = useContext(AlertDialogStateContext);
  const frameRef = useRef<HTMLDivElement>(null);
  const composedRef = useComposedRefs(ref, frameRef);

  function handleOpenAutoFocus(event: Event) {
    onOpenAutoFocus?.(event);
    if (event.defaultPrevented) return;

    /* Radix would focus the first control in the footer, which is the destructive
       one whenever the app writes the answers the other way round. */
    event.preventDefault();
    const target = frameRef.current?.querySelector<HTMLElement>(FOCUS_TARGETS[initialFocus]);
    (target ?? frameRef.current)?.focus();
  }

  return (
    <RadixAlertDialog.Portal>
      <RadixAlertDialog.Overlay className={styles.overlay} />
      <div className={styles.viewport} data-state={open ? 'open' : 'closed'}>
        <RadixAlertDialog.Content
          asChild
          aria-modal
          onOpenAutoFocus={handleOpenAutoFocus}
          {...contentProps}
        >
          <div ref={composedRef} className={clsx(styles.content, sizeClass(size), className)}>
            {children}
          </div>
        </RadixAlertDialog.Content>
      </div>
    </RadixAlertDialog.Portal>
  );
}

/* ---------------------------------------------------------------
 * AlertDialogTitle
 *
 * The heading that states the question. `tabindex="-1"` is what lets
 * `initialFocus="title"` land on it; a screen reader reads the dialog's
 * name either way, so the heading needs no other help.
 * --------------------------------------------------------------- */

export function AlertDialogTitle({
  children,
  className,
  ref,
  ...titleProps
}: AlertDialogTitleProps & { ref?: Ref<HTMLHeadingElement> }) {
  return (
    <RadixAlertDialog.Title asChild>
      <Heading
        ref={ref}
        level={2}
        size="md"
        tabIndex={-1}
        data-alert-dialog-title=""
        className={clsx(styles.title, className)}
        {...titleProps}
      >
        {children}
      </Heading>
    </RadixAlertDialog.Title>
  );
}

/* ---------------------------------------------------------------
 * AlertDialogDescription
 * --------------------------------------------------------------- */

/* The ref is the paragraph `Text` renders, so it is typed as loosely as `Text`
   itself rather than as the `<p>` Radix would have rendered. */
export function AlertDialogDescription({
  children,
  className,
  ref,
  ...descriptionProps
}: AlertDialogDescriptionProps & { ref?: Ref<HTMLElement> }) {
  return (
    <RadixAlertDialog.Description asChild>
      <Text
        ref={ref}
        as="p"
        size="md"
        className={clsx(styles.description, className)}
        {...descriptionProps}
      >
        {children}
      </Text>
    </RadixAlertDialog.Description>
  );
}

/* ---------------------------------------------------------------
 * AlertDialogBody
 * --------------------------------------------------------------- */

export function AlertDialogBody({
  children,
  className,
  ref,
  ...bodyProps
}: AlertDialogBodyProps & { ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className={clsx(styles.body, className)} {...bodyProps}>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------
 * AlertDialogFooter
 * --------------------------------------------------------------- */

export function AlertDialogFooter({
  children,
  className,
  ref,
  ...footerProps
}: AlertDialogFooterProps & { ref?: Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} className={clsx(styles.footer, className)} {...footerProps}>
      {children}
    </div>
  );
}
