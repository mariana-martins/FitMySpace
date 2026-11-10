import {
  formatTokenLabel,
  FoundationPage,
  getTokens,
  InlineCode,
  TokenGroup,
  TokenRow,
} from '../../docs';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const meta = {
  title: 'Design System/Foundation/Focus',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

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
          forced-colors mode. The width and offset are shared; the colour comes from each
          component&apos;s own <InlineCode>focus-ring</InlineCode> token so it keeps 3:1 contrast
          against the page:
          <br />
          <InlineCode>
            outline: var(--ds-semantic-focus-ring-width) solid
            var(--ds-component-button-primary-focus-ring);
          </InlineCode>
          <br />
          <InlineCode>outline-offset: var(--ds-semantic-focus-ring-offset);</InlineCode>
        </>
      }
    >
      <TokenGroup title="Ring">
        {getTokens('semantic', 'focus').map((token) => (
          <TokenRow
            key={token.name}
            token={token}
            label={formatTokenLabel(token.path.slice(2))}
            preview={
              <div
                style={{
                  width: '48px',
                  height: '32px',
                  margin: '8px',
                  borderRadius: 'var(--ds-radii-md)',
                  backgroundColor: 'var(--ds-semantic-color-background-brand-base)',
                  outline:
                    'var(--ds-semantic-focus-ring-width) solid var(--ds-semantic-color-border-brand-base)',
                  outlineOffset: 'var(--ds-semantic-focus-ring-offset)',
                }}
              />
            }
          />
        ))}
      </TokenGroup>
    </FoundationPage>
  ),
};
