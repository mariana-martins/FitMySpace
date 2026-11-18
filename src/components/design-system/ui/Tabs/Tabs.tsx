'use client';

import * as RadixTabs from '@radix-ui/react-tabs';
import { DS_ICONS, Icon } from '../Icon';
import styles from './Tabs.module.css';
import clsx from 'clsx';

import type { TabsContentProps, TabsListProps, TabsProps, TabsTriggerProps } from './Tabs.types';
import type { Ref } from 'react';

/* ---------------------------------------------------------------
 * Tabs
 *
 * Built on Radix Tabs, which owns the ARIA tabs pattern: the roles,
 * `aria-selected`, `aria-controls` and `aria-labelledby` between each
 * tab and its panel, and the roving focus with the arrow keys, Home
 * and End. This file only draws it.
 * --------------------------------------------------------------- */

export function Tabs({ className, ref, ...rootProps }: TabsProps & { ref?: Ref<HTMLDivElement> }) {
  return <RadixTabs.Root ref={ref} className={clsx(styles.root, className)} {...rootProps} />;
}

/* ---------------------------------------------------------------
 * TabsList
 *
 * The row of tabs. On a narrow screen it scrolls sideways instead of
 * wrapping, so the tabs stay one line in the order they were written.
 * --------------------------------------------------------------- */

function sizeClass(size: NonNullable<TabsListProps['size']>) {
  return styles[`size-${size}` as keyof typeof styles];
}

export function TabsList({
  size = 'md',
  className,
  ref,
  ...listProps
}: TabsListProps & { ref?: Ref<HTMLDivElement> }) {
  return (
    <RadixTabs.List
      ref={ref}
      className={clsx(styles.list, sizeClass(size), className)}
      {...listProps}
    />
  );
}

/* ---------------------------------------------------------------
 * TabsTrigger
 *
 * A tab. The selected one takes the darker text and the indicator bar,
 * so the selection never rests on colour alone.
 * --------------------------------------------------------------- */

export function TabsTrigger({
  icon,
  children,
  className,
  ref,
  ...triggerProps
}: TabsTriggerProps & { ref?: Ref<HTMLButtonElement> }) {
  return (
    <RadixTabs.Trigger ref={ref} className={clsx(styles.trigger, className)} {...triggerProps}>
      {icon && <Icon className={styles.icon}>{DS_ICONS[icon].icon}</Icon>}
      {children}
    </RadixTabs.Trigger>
  );
}

/* ---------------------------------------------------------------
 * TabsContent
 * --------------------------------------------------------------- */

export function TabsContent({
  className,
  ref,
  ...contentProps
}: TabsContentProps & { ref?: Ref<HTMLDivElement> }) {
  return (
    <RadixTabs.Content ref={ref} className={clsx(styles.content, className)} {...contentProps} />
  );
}
