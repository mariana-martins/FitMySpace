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
  title: 'Design System/Foundation/Border Width',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* --- Semantic Border Width --- */
export const SemanticBorderWidth: Story = {
  render: () => (
    <FoundationPage
      title="Border Width"
      introduction={
        <>
          Border width tokens name the job of a stroke instead of its pixel count. Use{' '}
          <strong>Default</strong> for quiet outlines such as an input&apos;s edge,{' '}
          <strong>Interactive</strong> for the stronger outline of buttons, and{' '}
          <strong>Heavy</strong> for the soft halo around a focused input. Instead of writing{' '}
          <InlineCode>border: 1px solid</InlineCode>, you write{' '}
          <InlineCode>border: var(--ds-semantic-border-width-default) solid</InlineCode>.
        </>
      }
    >
      <TokenGroup title="Widths">
        {getTokens('semantic', 'border-width').map((token) => (
          <TokenRow
            key={token.name}
            token={token}
            label={formatTokenLabel(token.path.slice(2))}
            preview={
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  boxSizing: 'border-box',
                  borderRadius: 'var(--ds-radii-md)',
                  border: `var(${token.name}) solid var(--ds-semantic-color-border-brand-base)`,
                  backgroundColor: 'var(--ds-semantic-color-background-default-hover)',
                }}
              />
            }
          />
        ))}
      </TokenGroup>
    </FoundationPage>
  ),
};
