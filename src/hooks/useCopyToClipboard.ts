import { useState, useCallback, useRef, useEffect } from 'react';

interface UseCopyToClipboardOptions {
  /** Duration in ms before `copied` resets to `false`. @default 2000 */
  resetMs?: number;
}

interface UseCopyToClipboardReturn {
  /** Whether the most recent copy succeeded and the feedback window is still open. */
  copied: boolean;
  /** Copy `text` to the clipboard and trigger the `copied` feedback state. */
  copy: (text: string) => void;
}

/**
 * Encapsulates the "copy → show feedback → auto‑reset" pattern
 * used across Storybook gallery cards and token swatches.
 *
 * Properly clears the reset timer on unmount to avoid React
 * state‑update‑on‑unmounted‑component warnings.
 */
export function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {},
): UseCopyToClipboardReturn {
  const { resetMs = 2000 } = options;
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    (text: string) => {
      void navigator.clipboard.writeText(text);
      setCopied(true);

      // Clear any existing timer before setting a new one
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setCopied(false);
        timerRef.current = null;
      }, resetMs);
    },
    [resetMs],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { copied, copy };
}
