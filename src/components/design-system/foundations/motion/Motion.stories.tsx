import {
  formatTokenLabel,
  FoundationPage,
  getTokens,
  groupTokens,
  InlineCode,
  TokenGroup,
  TokenRow,
} from '../../docs';
import { useId, useState, useSyncExternalStore } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import type { CSSProperties, ReactNode } from 'react';
import type { DocumentedToken } from '../../docs';
import { Text } from '../../ui/Typography';
import { Button } from '../../ui/Button';

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
const LINEAR_CONTROL_POINTS = [0, 0, 1, 1];
const CURVE_SIZE = 48;
/** Duration bars are drawn at 1px per 8ms, so the longest (480ms) is 60px wide. */
const MILLISECONDS_PER_PIXEL = 8;

const durationTokens = getTokens('semantic', 'motion', 'duration');
const easingTokens = getTokens('semantic', 'motion', 'easing');

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

/** The four control points of an easing value; `linear` is the straight diagonal. */
function controlPointsOf(value: string): number[] | null {
  if (value === 'linear') return LINEAR_CONTROL_POINTS;
  const controlPoints = CUBIC_BEZIER_PATTERN.exec(value)?.[1].split(',').map(Number);
  return controlPoints?.length === 4 ? controlPoints : null;
}

/** Draws an easing value as its curve: time on x, progress on y. */
const EasingCurve = ({ value }: { value: string }) => {
  const controlPoints = controlPointsOf(value);
  if (!controlPoints) return null;
  const [startX, startY, endX, endY] = controlPoints.map((point) => point * CURVE_SIZE);
  return (
    <svg
      width={CURVE_SIZE}
      height={CURVE_SIZE}
      viewBox={`0 0 ${CURVE_SIZE} ${CURVE_SIZE}`}
      focusable="false"
      style={{ display: 'block', overflow: 'visible' }}
    >
      <rect
        width={CURVE_SIZE}
        height={CURVE_SIZE}
        rx="8"
        fill="var(--ds-semantic-color-background-default-hover)"
      />
      <path
        d={`M 0 ${CURVE_SIZE} C ${startX} ${CURVE_SIZE - startY}, ${endX} ${CURVE_SIZE - endY}, ${CURVE_SIZE} 0`}
        fill="none"
        stroke="var(--ds-semantic-color-border-brand-base)"
        strokeWidth="2"
      />
    </svg>
  );
};

/** A bar whose length is proportional to the duration. */
const DurationBar = ({ value }: { value: string }) => (
  <div
    style={{
      width: '64px',
      height: '8px',
      borderRadius: 'var(--ds-radii-full)',
      backgroundColor: 'var(--ds-semantic-color-background-default-hover)',
    }}
  >
    <div
      style={{
        width: `${Number.parseFloat(value) / MILLISECONDS_PER_PIXEL}px`,
        height: '100%',
        borderRadius: 'inherit',
        backgroundColor: 'var(--ds-semantic-color-background-brand-base)',
      }}
    />
  </div>
);

const groupDescriptions: Record<string, string> = {
  duration:
    'How long a transition lasts, on steps of 80ms. The bigger the element and the further it travels, the longer it may take; small state changes stay short so the interface feels immediate.',
  easing:
    'How a transition accelerates. Elements entering decelerate into place, elements leaving accelerate away. Each curve is drawn with time on the horizontal axis and progress on the vertical one.',
};

const previewByGroup: Record<string, (token: DocumentedToken) => ReactNode> = {
  duration: (token) => <DurationBar value={token.value} />,
  easing: (token) => <EasingCurve value={token.value} />,
};

const selectStyle: CSSProperties = {
  minHeight: 'var(--ds-semantic-size-control-sm)',
  padding: '0 12px',
  borderRadius: 'var(--ds-radii-md)',
  border:
    'var(--ds-semantic-border-width-default) solid var(--ds-semantic-color-border-subtle-base)',
  backgroundColor: 'var(--ds-semantic-color-background-default-base)',
  color: 'var(--ds-semantic-color-text-default-base)',
  font: 'var(--ds-semantic-typography-body-sm-shorthand)',
};

const TokenSelect = ({
  label,
  tokens,
  value,
  onChange,
}: {
  label: string;
  tokens: DocumentedToken[];
  value: string;
  onChange: (tokenName: string) => void;
}) => {
  const selectId = useId();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label
        htmlFor={selectId}
        style={{
          font: 'var(--ds-semantic-typography-label-sm-shorthand)',
          letterSpacing: 'var(--ds-semantic-typography-label-sm-letter-spacing)',
        }}
      >
        {label}
      </label>
      <select
        id={selectId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={selectStyle}
      >
        {tokens.map((token) => (
          <option key={token.name} value={token.name}>
            {`${formatTokenLabel(token.path.slice(3))} (${token.value})`}
          </option>
        ))}
      </select>
    </div>
  );
};

const MotionDemo = () => {
  const [isMoved, setIsMoved] = useState(false);
  const [durationName, setDurationName] = useState('--ds-semantic-motion-duration-moderate');
  const [easingName, setEasingName] = useState('--ds-semantic-motion-easing-move');
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <TokenSelect
          label="Duration"
          tokens={durationTokens}
          value={durationName}
          onChange={setDurationName}
        />
        <TokenSelect
          label="Easing"
          tokens={easingTokens}
          value={easingName}
          onChange={setEasingName}
        />
      </div>
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
            transitionDuration: `var(${durationName})`,
            transitionTimingFunction: `var(${easingName})`,
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
            : 'The square slides with the duration and easing you picked.'}
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
          animate for decoration. It stays unhurried and soft, to match the calm of the interface.
          Combine a duration with an easing, e.g.{' '}
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
              label={formatTokenLabel(token.path.slice(3))}
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
    const durationSelect = canvas.getByRole('combobox', { name: 'Duration' });
    await userEvent.selectOptions(durationSelect, '--ds-semantic-motion-duration-slow');
    await expect(durationSelect).toHaveValue('--ds-semantic-motion-duration-slow');

    const toggle = canvas.getByRole('button', { name: 'Move the square' });
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  },
};
