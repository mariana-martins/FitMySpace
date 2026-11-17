import type { IconName } from '../ui/Icon';

/** The four utility messages shared by `Alert` and `Toast`. */
export type UtilityVariant = 'information' | 'success' | 'warning' | 'error';

/** The decorative icon of each variant, named from the design system's set. The colour never carries the meaning alone. */
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
