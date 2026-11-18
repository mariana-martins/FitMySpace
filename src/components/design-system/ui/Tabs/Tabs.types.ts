import type {
  TabsContentProps as RadixTabsContentProps,
  TabsListProps as RadixTabsListProps,
  TabsProps as RadixTabsProps,
  TabsTriggerProps as RadixTabsTriggerProps,
} from '@radix-ui/react-tabs';

import type { IconName } from '../Icon';
import type { ReactNode } from 'react';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type TabsSize = 'sm' | 'md';

/* ---------------------------------------------------------------
 * Props
 *
 * `Tabs` is composed like `Dialog`: the app writes the parts, and
 * each `TabsTrigger` is paired with the `TabsContent` of the same
 * `value`.
 *
 *   <Tabs defaultValue="details">
 *     <TabsList aria-label="Product information">
 *       <TabsTrigger value="details">Details</TabsTrigger>
 *       <TabsTrigger value="measurements">Measurements</TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="details">…</TabsContent>
 *     <TabsContent value="measurements">…</TabsContent>
 *   </Tabs>
 *
 * Radix owns the behaviour of the ARIA tabs pattern: `role="tablist"`,
 * `role="tab"` with `aria-selected` and `aria-controls`,
 * `role="tabpanel"` with `aria-labelledby`, `aria-orientation`, and
 * the roving focus — Tab enters the list on the selected tab, the
 * arrow keys move between tabs, Home and End jump to either end.
 * --------------------------------------------------------------- */

/**
 * Radix's root: `value`, `defaultValue` and `onValueChange` for the selected
 * tab, `orientation` (`horizontal` by default) and `activationMode`
 * (`automatic`: a tab is shown as soon as the arrow keys reach it; use
 * `manual` when a panel is slow to show, so Enter or Space picks it).
 */
export type TabsProps = RadixTabsProps;

export interface TabsListProps extends RadixTabsListProps {
  /** Height and type of the tabs: `sm` 40px, `md` 48px. */
  size?: TabsSize;
}

/**
 * A tab. Its `value` names the `TabsContent` it shows; keep it id-like (`living-room`,
 * not `Living room`), because Radix builds the ids behind `aria-controls` and
 * `aria-labelledby` from it, and a space makes them invalid.
 */
export interface TabsTriggerProps extends RadixTabsTriggerProps {
  /**
   * One of the icons the design system ships, asked for by name, drawn before the
   * words. It is decoration: the words are the tab's name.
   */
  icon?: IconName;
  /** The tab's visible name. Required: a tab is never an icon alone. */
  children: ReactNode;
}

/**
 * The panel a tab shows. Radix makes it focusable (`tabindex="0"`), so a panel with
 * nothing to focus inside it can still be reached and read after its tab.
 */
export type TabsContentProps = RadixTabsContentProps;
