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
  title: 'Design System/Foundation/Shadow',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* --- Semantic Shadow --- */
export const SemanticShadow: Story = {
  render: () => (
    <FoundationPage
      title="Shadow"
      introduction={
        <>
          Shadows lift an element off the page. The system keeps them faint, so the interface stays
          calm and borders do most of the separating. Instead of writing a raw{' '}
          <InlineCode>box-shadow</InlineCode>, you write{' '}
          <InlineCode>box-shadow: var(--ds-semantic-shadow-raised)</InlineCode>. Never rely on a
          shadow alone to mark a boundary: forced-colors mode removes it.
        </>
      }
    >
      <TokenGroup title="Elevation">
        {getTokens('semantic', 'shadow').map((token) => (
          <TokenRow
            key={token.name}
            token={token}
            label={formatTokenLabel(token.path.slice(2))}
            preview={
              <div
                style={{
                  width: '64px',
                  height: '48px',
                  borderRadius: 'var(--ds-radii-md)',
                  backgroundColor: 'var(--ds-semantic-color-background-default-base)',
                  boxShadow: `var(${token.name})`,
                }}
              />
            }
          />
        ))}
      </TokenGroup>
    </FoundationPage>
  ),
};
