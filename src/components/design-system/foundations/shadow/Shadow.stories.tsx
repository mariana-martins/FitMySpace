import {
  formatTokenLabel,
  FoundationPage,
  getTokens,
  InlineCode,
  TokenGroup,
  TokenRow,
} from '../../docs';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { DocumentedToken } from '../../docs';
import type { CSSProperties } from 'react';

const meta = {
  title: 'Design System/Foundation/Shadow',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const surfaceStyle: CSSProperties = {
  borderRadius: 'var(--ds-radii-lg)',
  border: 'var(--ds-semantic-border-width-default) solid var(--ds-semantic-color-border-disabled)',
  backgroundColor: 'var(--ds-semantic-color-background-default-base)',
};

/** A sunken shadow falls inside the element, so it is drawn on a tinted well instead of a card. */
function isInset(token: DocumentedToken): boolean {
  return token.value.startsWith('inset');
}

const ShadowSample = ({ token }: { token: DocumentedToken }) => (
  <div
    style={{
      ...surfaceStyle,
      width: '96px',
      height: '64px',
      backgroundColor: isInset(token)
        ? 'var(--ds-semantic-color-background-default-hover)'
        : 'var(--ds-semantic-color-background-default-base)',
      boxShadow: `var(${token.name})`,
    }}
  />
);

/** Three surfaces stacked the way an interface uses them: a card, a menu over it, a dialog on top. */
const LayeredScene = () => (
  <div
    aria-hidden="true"
    style={{
      position: 'relative',
      height: '240px',
      borderRadius: 'var(--ds-radii-lg)',
      backgroundColor: 'var(--ds-semantic-color-background-default-hover)',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        ...surfaceStyle,
        position: 'absolute',
        top: '24px',
        left: '24px',
        width: '200px',
        height: '144px',
        boxShadow: 'var(--ds-semantic-shadow-card-base)',
      }}
    />
    <div
      style={{
        ...surfaceStyle,
        position: 'absolute',
        top: '96px',
        left: '160px',
        width: '160px',
        height: '96px',
        borderRadius: 'var(--ds-radii-md)',
        boxShadow: 'var(--ds-semantic-shadow-floating)',
      }}
    />
    <div
      style={{
        ...surfaceStyle,
        position: 'absolute',
        top: '40px',
        left: '360px',
        width: '240px',
        height: '160px',
        borderRadius: 'var(--ds-radii-xl)',
        boxShadow: 'var(--ds-semantic-shadow-overlay)',
      }}
    />
  </div>
);

/* --- Semantic Shadow --- */
export const SemanticShadow: Story = {
  render: () => (
    <FoundationPage
      title="Shadow"
      introduction={
        <>
          Shadows say how far a surface sits above the page. They stay soft and faint, tinted with
          the charcoal of the text instead of pure black, so the interface feels calm: each one
          pairs a tight contact shadow with a wide ambient one, and every offset and blur sits on
          the 4px grid. Pick the role, not the size: write{' '}
          <InlineCode>box-shadow: var(--ds-semantic-shadow-floating)</InlineCode> for a menu. Always
          pair a shadow with a border, because forced-colors mode removes shadows.
        </>
      }
    >
      <TokenGroup
        title="Elevation"
        description="From lowest to highest. A surface only rises when it needs to sit above something else."
      >
        {getTokens('semantic', 'shadow').map((token) => (
          <TokenRow
            key={token.name}
            token={token}
            label={formatTokenLabel(token.path.slice(2))}
            preview={<ShadowSample token={token} />}
          />
        ))}
      </TokenGroup>
      <TokenGroup
        title="In context"
        description="A raised card, a floating menu over it and an overlay dialog on top: each layer casts a longer, softer shadow than the one below."
      >
        <LayeredScene />
      </TokenGroup>
    </FoundationPage>
  ),
};
