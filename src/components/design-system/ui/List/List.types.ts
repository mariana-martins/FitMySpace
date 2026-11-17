import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { IconName } from '../Icon';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type ListAppearance = 'plain' | 'outline';
export type ListSize = 'sm' | 'md';

/* ---------------------------------------------------------------
 * List
 *
 * A column of rows about one kind of thing: saved products, rooms,
 * stores. Each row is a `ListItem`. `plain` sits on the page with a
 * faint line between rows; `outline` draws the rows inside a bordered
 * surface. `as="ol"` when the order means something (a ranking).
 * --------------------------------------------------------------- */

type ListBaseProps = {
  appearance?: ListAppearance;
  size?: ListSize;
  /** Lines between rows. On by default. */
  dividers?: boolean;
  children: ReactNode;
};

type UnorderedListProps = ListBaseProps & { as?: 'ul' } & Omit<
    ComponentPropsWithoutRef<'ul'>,
    keyof ListBaseProps | 'role'
  >;

type OrderedListProps = ListBaseProps & { as: 'ol' } & Omit<
    ComponentPropsWithoutRef<'ol'>,
    keyof ListBaseProps | 'role'
  >;

export type ListProps = UnorderedListProps | OrderedListProps;

/* ---------------------------------------------------------------
 * ListItem
 *
 * One row in four slots, the shape of Material lists and most design
 * systems: something at the start, the title and its description,
 * and something at the end.
 *
 * - `children` is the title. A string or a `Link` (pass `stretched`
 *   to make the whole row its click area); or a whole `Checkbox` or
 *   `Switch`, whose own label and hint then fill the row.
 * - The start is `icon` (a registry name, drawn in a soft circle) or
 *   `leading` (anything else: a product picture, an avatar). One or
 *   the other, never both.
 * - `trailing` holds the row's action or a short fact: a `Button`, a
 *   `Badge`, a price.
 * --------------------------------------------------------------- */

type ListItemBaseProps = {
  description?: ReactNode;
  trailing?: ReactNode;
  children: ReactNode;
};

type ListItemNativeProps = Omit<ComponentPropsWithoutRef<'li'>, keyof ListItemBaseProps>;

type ListItemWithIconProps = ListItemBaseProps & {
  /** A registry icon, decorative, drawn in a soft circle at the start of the row. */
  icon?: IconName;
  leading?: never;
} & ListItemNativeProps;

type ListItemWithLeadingProps = ListItemBaseProps & {
  icon?: never;
  /** Anything else at the start of the row, such as a product picture. */
  leading: ReactNode;
} & ListItemNativeProps;

export type ListItemProps = ListItemWithIconProps | ListItemWithLeadingProps;
