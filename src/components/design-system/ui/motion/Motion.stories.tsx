import {
  formatTokenLabel,
  FoundationPage,
  getTokens,
  groupTokens,
  InlineCode,
  TokenGroup,
  TokenRow,
} from '../../docs';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState, useSyncExternalStore } from 'react';
import type { DocumentedToken } from '../../docs';
import type { ReactNode } from 'react';
import { Text } from '../Typography';
import { Timer } from 'lucide-react';
import { Button } from '../Button';

const meta = {
  title: 'Design System/Foundation/Motion',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const CUBIC_BEZIER_PATTERN = /^cubic-bezier\(([^)]+)\)$/;

function subscribeToReducedMotion(onChange: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

/** Draws a `cubic-bezier()` value as its curve: time on x, progress on y. */
const EasingCurve = ({ value }: { value: string }) => {
  const controlPoints = CUBIC_BEZIER_PATTERN.exec(value)?.[1].split(',').map(Number);
  if (!controlPoints || controlPoints.length !== 4) return null;
  const [startX, startY, endX, endY] = controlPoints.map((point) => point * 48);
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" focusable="false" style={{ display: 'block' }}>
      <rect
        width="48"
        height="48"
        rx="6"
        fill="var(--ds-semantic-color-background-default-hover)"
      />
      <path
        d={`M 0 48 C ${startX} ${48 - startY}, ${endX} ${48 - endY}, 48 0`}
        fill="none"
        stroke="var(--ds-semantic-color-border-brand-base)"
        strokeWidth="2"
      />
    </svg>
  );
};

const groupDescriptions: Record<string, string> = {
  duration:
    'How long a transition lasts. Small state changes (hover, focus, pressed) stay short so the interface feels immediate.',
  easing:
    'How a transition accelerates. Each curve is drawn with time on the horizontal axis and progress on the vertical one.',
};

const previewByGroup: Record<string, (token: DocumentedToken) => ReactNode> = {
  duration: () => (
    <Timer
      focusable="false"
      style={{
        display: 'block',
        width: '24px',
        height: '24px',
        color: 'var(--ds-semantic-color-text-brand-base)',
      }}
    />
  ),
  easing: (token) => <EasingCurve value={token.value} />,
};

const MotionDemo = () => {
  const [isMoved, setIsMoved] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div
        style={{
          position: 'relative',
          height: '48px',
          borderRadius: 'var(--ds-radii-md)',
          backgroundColor: 'var(--ds-semantic-color-background-default-hover)',
        }}
        aria-hidden="true"
      >
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: isMoved ? 'calc(100% - 40px)' : '8px',
            width: '32px',
            height: '32px',
            borderRadius: 'var(--ds-radii-sm)',
            backgroundColor: 'var(--ds-semantic-color-background-brand-base)',
            transitionProperty: prefersReducedMotion ? 'none' : 'left',
            transitionDuration: 'var(--ds-semantic-motion-duration-fast)',
            transitionTimingFunction: 'var(--ds-semantic-motion-easing-standard)',
          }}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Button
          variant="primary"
          appearance="outline"
          size="sm"
          aria-pressed={isMoved}
          onClick={() => setIsMoved((moved) => !moved)}
        >
          Move the square
        </Button>
        <Text size="sm" as="span" style={{ color: 'var(--ds-semantic-color-text-subtle-base)' }}>
          {prefersReducedMotion
            ? 'Your system asks for reduced motion, so the square jumps instead of sliding.'
            : 'The square slides with the fast duration and the standard easing.'}
        </Text>
      </div>
    </div>
  );
};

/* --- Semantic Motion --- */
export const SemanticMotion: Story = {
  render: () => (
    <FoundationPage
      title="Motion"
      introduction={
        <>
          Motion shows what changed in response to the user, and nothing else: the system does not
          animate for decoration. Combine a duration with an easing, e.g.{' '}
          <InlineCode>
            transition: background-color var(--ds-semantic-motion-duration-fast)
            var(--ds-semantic-motion-easing-standard)
          </InlineCode>
          . Respect <InlineCode>prefers-reduced-motion</InlineCode>: Button and Input switch their
          transitions off when the reader asks for less motion.
        </>
      }
    >
      {[...groupTokens(getTokens('semantic', 'motion'), 2)].map(([groupName, tokens]) => (
        <TokenGroup
          key={groupName}
          title={formatTokenLabel([groupName])}
          description={groupDescriptions[groupName]}
        >
          {tokens.map((token) => (
            <TokenRow
              key={token.name}
              token={token}
              label={formatTokenLabel(token.path.slice(2))}
              preview={previewByGroup[groupName]?.(token)}
            />
          ))}
        </TokenGroup>
      ))}
      <TokenGroup title="Try it">
        <MotionDemo />
      </TokenGroup>
    </FoundationPage>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole('button', { name: 'Move the square' });
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  },
};
