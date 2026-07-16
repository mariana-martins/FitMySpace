import type { ComponentPropsWithoutRef } from 'react';
import type { LucideIcon } from 'lucide-react';

/* ---------------------------------------------------------------
 * Types
 * --------------------------------------------------------------- */

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

export type IconColor =
  | 'default'
  | 'primary'
  | 'subtle'
  | 'inverse'
  | 'disabled'
  | 'error'
  | 'success'
  | 'warning'
  | 'information';

export interface IconProps
  extends Omit<
    ComponentPropsWithoutRef<'svg'>,
    'width' | 'height' | 'stroke' | 'fill' | 'color'
  > {
  /** Lucide icon component to render (e.g. `Home`, `Search`). */
  icon: LucideIcon;
  /** Icon size mapped to Tier 3 component tokens. */
  size: IconSize;
  /** Semantic color mapped to Tier 3 component tokens. */
  color: IconColor;
  /**
   * Accessible name for the icon.
   * When provided, the icon is exposed to assistive technology with `role="img"`.
   * When omitted, the icon is treated as decorative (`aria-hidden="true"`).
   */
  'aria-label'?: string;
  /** SVG stroke width. @default 2 */
  strokeWidth?: number;
}
