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

const meta = {
  title: 'Design System/Foundation/Focus',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ring = 'var(--ds-semantic-focus-ring-width) solid var(--ds-semantic-focus-ring-color)';

const pillStyle: CSSProperties = {
  width: '48px',
  height: '32px',
  margin: '8px',
  borderRadius: 'var(--ds-radii-md)',
  backgroundColor: 'var(--ds-semantic-color-background-brand-base)',
};

/** The outset ring: a gap between the element and the ring. */
const OutsetSample = () => (
  <div
    style={{
      ...pillStyle,
      outline: ring,
      outlineOffset: 'var(--ds-semantic-focus-ring-offset)',
    }}
  />
);

/**
 * The inset ring on the middle item of a clipped list: an outset ring
 * would be cut off by the container and overlap the items next to it.
 */
const InsetSample = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      width: '96px',
      overflow: 'hidden',
      borderRadius: 'var(--ds-radii-md)',
      border:
        'var(--ds-semantic-border-width-default) solid var(--ds-semantic-color-border-disabled)',
    }}
  >
    {['first', 'focused', 'last'].map((item) => (
      <div
        key={item}
        style={{
          height: '20px',
          backgroundColor:
            item === 'focused'
              ? 'var(--ds-semantic-color-background-default-hover)'
              : 'var(--ds-semantic-color-background-default-base)',
          outline: item === 'focused' ? ring : 'none',
          outlineOffset: 'var(--ds-semantic-focus-ring-offset-inset)',
        }}
      />
    ))}
  </div>
);

const previewByToken: Record<string, ReactNode> = {
  color: (
    <div
      style={{
        width: '32px',
        height: '32px',
        margin: '8px',
        borderRadius: 'var(--ds-radii-full)',
        backgroundColor: 'var(--ds-semantic-focus-ring-color)',
      }}
    />
  ),
  width: <OutsetSample />,
  offset: <OutsetSample />,
  'offset-inset': <InsetSample />,
};

/* --- Focus Ring --- */
export const FocusRing: Story = {
  render: () => (
    <FoundationPage
      title="Focus"
      introduction={
        <>
          Every interactive element shows a visible ring when it receives keyboard focus (WCAG
          2.4.7). The ring is an <InlineCode>outline</InlineCode> drawn on{' '}
          <InlineCode>:focus-visible</InlineCode>, so it does not shift the layout and survives
          forced-colors mode. Like border widths, the 2px ring is a stroke and stays off the 4px
          grid. A new component starts from the shared colour:
          <br />
          <InlineCode>
            outline: var(--ds-semantic-focus-ring-width) solid var(--ds-semantic-focus-ring-color);
          </InlineCode>
          <br />
          <InlineCode>outline-offset: var(--ds-semantic-focus-ring-offset);</InlineCode>
          <br />
          When its background is too close to that colour, it defines its own{' '}
          <InlineCode>focus-ring</InlineCode> token in tier 3 (as Button does) to keep 3:1 contrast.
          Items inside a clipped or tightly packed container, such as menu options and tabs, use{' '}
          <InlineCode>var(--ds-semantic-focus-ring-offset-inset)</InlineCode> so the ring is drawn
          inside them.
        </>
      }
    >
      <TokenGroup title="Ring">
        {getTokens('semantic', 'focus').map((token) => (
          <TokenRow
            key={token.name}
            token={token}
            label={formatTokenLabel(token.path.slice(2))}
            preview={previewByToken[token.path[3]]}
          />
        ))}
      </TokenGroup>
    </FoundationPage>
  ),
};
