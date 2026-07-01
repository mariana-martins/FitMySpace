import { forwardRef } from 'react';
import * as RadixVisuallyHidden from '@radix-ui/react-visually-hidden';

import type { VisuallyHiddenProps } from './VisuallyHidden.types';

/* ---------------------------------------------------------------
 * VisuallyHidden
 *
 * Renders content that is visually hidden but remains accessible
 * to assistive technologies (screen readers). This is a thin
 * wrapper around Radix UI's VisuallyHidden primitive.
 *
 * Use this component to provide accessible labels, descriptions,
 * or announcements that should not be visible on screen.
 * --------------------------------------------------------------- */

export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  function VisuallyHidden(props, ref) {
    return <RadixVisuallyHidden.Root ref={ref} {...props} />;
  },
);

VisuallyHidden.displayName = 'VisuallyHidden';
