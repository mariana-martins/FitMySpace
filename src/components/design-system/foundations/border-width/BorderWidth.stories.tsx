import {
  formatTokenLabel,
  FoundationPage,
  getTokens,
  InlineCode,
  TokenGroup,
  TokenRow,
} from '../../docs';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { CSSProperties, ReactNode } from 'react';
import type { DocumentedToken } from '../../docs';

const meta = {
  title: 'Design System/Foundation/Border Width',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleStyle: CSSProperties = {
  width: '64px',
  height: '48px',
  boxSizing: 'border-box',
  borderRadius: 'var(--ds-radii-md)',
  backgroundColor: 'var(--ds-semantic-color-background-default-base)',
};

const outlined = (token: DocumentedToken): CSSProperties => ({
  ...sampleStyle,
  border: `var(${token.name}) solid var(--ds-semantic-color-border-brand-base)`,
});

/** Each role is drawn the way it is used: an outline, a selected card, a tab marker, a halo. */
const previewByRole: Record<string, (token: DocumentedToken) => ReactNode> = {
  none: () => (
    <div
      style={{
        ...sampleStyle,
        backgroundColor: 'var(--ds-semantic-color-background-default-hover)',
      }}
    />
  ),
  default: (token) => (
    <div
      style={{
        ...sampleStyle,
        border: `var(${token.name}) solid var(--ds-semantic-color-border-subtle-base)`,
      }}
    />
  ),
  interactive: (token) => (
    <div style={{ ...outlined(token), height: '32px', borderRadius: 'var(--ds-radii-full)' }} />
  ),
  selected: (token) => <div style={outlined(token)} />,
  indicator: (token) => (
    <div
      style={{
        ...sampleStyle,
        height: '32px',
        borderRadius: 0,
        borderBottom: `var(${token.name}) solid var(--ds-semantic-color-border-brand-base)`,
      }}
    />
  ),
  halo: (token) => (
    <div
      style={{
        ...sampleStyle,
        height: '32px',
        margin: '4px',
        border:
          'var(--ds-semantic-border-width-default) solid var(--ds-semantic-color-border-brand-base)',
        boxShadow: `0 0 0 var(${token.name}) var(--ds-semantic-color-halo-brand)`,
      }}
    />
  ),
};

/* --- Semantic Border Width --- */
export const SemanticBorderWidth: Story = {
  render: () => (
    <FoundationPage
      title="Border Width"
      introduction={
        <>
          Border width tokens name the job of a stroke instead of its pixel count, so two roles can
          share a width today and part ways later. Strokes are the one exception to the 4px grid:
          hairlines are 1px and 2px. Instead of writing <InlineCode>border: 1px solid</InlineCode>,
          you write <InlineCode>border: var(--ds-semantic-border-width-default) solid</InlineCode>.
          A thicker stroke must never be the only sign of a state: pair it with a colour, an icon or
          text.
        </>
      }
    >
      <TokenGroup title="Roles">
        {getTokens('semantic', 'border-width').map((token) => (
          <TokenRow
            key={token.name}
            token={token}
            label={formatTokenLabel(token.path.slice(2))}
            preview={previewByRole[token.path[2]]?.(token)}
          />
        ))}
      </TokenGroup>
    </FoundationPage>
  ),
};
