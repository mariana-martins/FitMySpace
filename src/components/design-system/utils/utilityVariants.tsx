import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';

import type { ReactElement } from 'react';

/** The four utility messages shared by `Alert` and `Toast`. */
export type UtilityVariant = 'information' | 'success' | 'warning' | 'error';

/** The decorative icon of each variant. The colour never carries the meaning alone. */
export const UTILITY_VARIANT_ICONS: Record<UtilityVariant, ReactElement> = {
  information: <Info focusable="false" />,
  success: <CircleCheck focusable="false" />,
  warning: <TriangleAlert focusable="false" />,
  error: <CircleAlert focusable="false" />,
};

/** The screen-reader-only prefix of each variant, read before the message ("Error: …"). */
export const UTILITY_VARIANT_LABELS: Record<UtilityVariant, string> = {
  information: 'Information',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
};
