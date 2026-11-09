'use client';

import { Check, CircleAlert, Copy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

/* ---------------------------------------------------------------
 * CopyTokenButton (Storybook docs helper)
 *
 * Copies a token's `var(--…)` reference to the clipboard. Used by the
 * Foundation stories (Color, Spacing, Radii); not part of the public
 * design system API.
 *
 * The result is announced through a polite live region, because a
 * change to the focused button's own text is not reliably read out.
 * The icon (copy → check / alert) is decorative and hidden from
 * assistive technology; the text and the live region carry the meaning.
 * --------------------------------------------------------------- */

type CopyStatus = 'idle' | 'copied' | 'failed';

const STATUS_RESET_DELAY_MS = 2000;

const visuallyHiddenStyle: CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  border: 0,
};

const backgroundByStatus: Record<CopyStatus, string> = {
  idle: 'var(--ds-semantic-color-background-default-hover)',
  copied: 'var(--ds-semantic-color-background-utility-success-base)',
  failed: 'var(--ds-semantic-color-background-utility-error-base)',
};

const iconByStatus: Record<CopyStatus, LucideIcon> = {
  idle: Copy,
  copied: Check,
  failed: CircleAlert,
};

const ICON_SIZE_PX = 12;
const ICON_ONLY_ICON_SIZE_PX = 14;
/** Square hit area for the icon-only button: above the 24×24 minimum of WCAG 2.5.8. */
const ICON_ONLY_BUTTON_SIZE = '28px';

const textColourByStatus: Record<CopyStatus, string> = {
  idle: 'var(--ds-semantic-color-text-subtle-base)',
  copied: 'var(--ds-semantic-color-text-inverse)',
  failed: 'var(--ds-semantic-color-text-inverse)',
};

export interface CopyTokenButtonProps {
  /** The CSS custom property name, e.g. `--ds-semantic-radii-interactive-md`. */
  variable: string;
  /**
   * Shows only the icon, for narrow layouts. Render the token name as text
   * next to it; the button's accessible name becomes "Copy var(--…)".
   */
  iconOnly?: boolean;
  /** Layout overrides for the button (e.g. a top margin). */
  style?: CSSProperties;
}

export function CopyTokenButton({ variable, iconOnly = false, style }: CopyTokenButtonProps) {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const reference = `var(${variable})`;

  useEffect(() => {
    if (status === 'idle') return;
    const resetTimer = setTimeout(() => setStatus('idle'), STATUS_RESET_DELAY_MS);
    return () => clearTimeout(resetTimer);
  }, [status]);

  const handleCopy = () => {
    navigator.clipboard.writeText(reference).then(
      () => setStatus('copied'),
      () => setStatus('failed'),
    );
  };

  const buttonLabel = { idle: reference, copied: 'Copied!', failed: 'Copy failed' }[status];
  const StatusIcon = iconByStatus[status];
  const iconSize = iconOnly ? ICON_ONLY_ICON_SIZE_PX : ICON_SIZE_PX;

  const iconOnlyStyle: CSSProperties = {
    justifyContent: 'center',
    width: ICON_ONLY_BUTTON_SIZE,
    height: ICON_ONLY_BUTTON_SIZE,
    padding: 0,
  };

  const statusMessage = {
    idle: '',
    copied: `Copied ${reference} to the clipboard.`,
    failed: `Could not copy ${reference}. Select the text and copy it instead.`,
  }[status];

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        title="Copy to clipboard"
        aria-label={iconOnly ? `Copy ${reference}` : undefined}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          fontFamily: 'monospace',
          background: backgroundByStatus[status],
          color: textColourByStatus[status],
          padding: '4px 8px',
          borderRadius: 'var(--ds-radii-sm)',
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease, color 0.2s ease',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          ...(iconOnly ? iconOnlyStyle : {}),
          ...style,
        }}
      >
        <StatusIcon
          aria-hidden="true"
          focusable="false"
          width={iconSize}
          height={iconSize}
          style={{ flexShrink: 0 }}
        />
        {!iconOnly && buttonLabel}
      </button>
      <span role="status" style={visuallyHiddenStyle}>
        {statusMessage}
      </span>
    </>
  );
}
