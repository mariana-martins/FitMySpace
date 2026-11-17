import type { IconName } from '../ui/Icon';

/**
 * The four utility messages shared by `Alert` and `Toast`, in display order. Stories,
 * tests and the colour roles of `Button` and `Badge` read this list, so a new variant
 * shows up everywhere at once.
 */
export const UTILITY_VARIANTS = ['information', 'success', 'warning', 'error'] as const;

export type UtilityVariant = (typeof UTILITY_VARIANTS)[number];

/**
 * The decorative icon of each variant, named from the design system's set.
 * The colour never carries the meaning alone.
 */
export const UTILITY_VARIANT_ICONS: Record<UtilityVariant, IconName> = {
  information: 'info',
  success: 'circle-check',
  warning: 'triangle-alert',
  error: 'circle-alert',
};

/** The screen-reader-only prefix of each variant, read before the message ("Error: …"). */
export const UTILITY_VARIANT_LABELS: Record<UtilityVariant, string> = {
  information: 'Information',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
};
