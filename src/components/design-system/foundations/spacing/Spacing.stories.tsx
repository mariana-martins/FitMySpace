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

const meta = {
  title: 'Design System/Foundation/Spacing',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const groupDescriptions: Record<string, string> = {
  inset:
    'Internal padding applied inside a component. Use Inset tokens for the breathing room between a container’s edge and its content — buttons, cards, inputs, modals, and similar UI shells.',
  gap: 'Space between sibling elements in a layout. Use Gap tokens with CSS Flexbox or Grid gap to control the distance between items like form fields, icon + label pairs, or list entries.',
  section:
    'Vertical rhythm between major page blocks. Use Section tokens to separate hero banners, content areas, footers, and other high-level layout regions. These are the largest spacing values in the system.',
  control:
    'Horizontal padding inside form controls, one step per control size. Use Control tokens for the space between an input’s edge and its text so fields of the same size line up.',
};

/* --- Semantic Spacing --- */
export const SemanticSpacing: Story = {
  render: () => (
    <FoundationPage
      title="Semantic Spacing"
      introduction={
        <>
          Semantic Spacing tokens replace hard-coded pixel values with{' '}
          <strong>meaningful names</strong> that describe <em>where</em> and <em>why</em> a space
          exists. Instead of writing <InlineCode>padding: 16px</InlineCode>, you write{' '}
          <InlineCode>padding: var(--ds-semantic-spacing-inset-md)</InlineCode>. This makes your
          spacing consistent across every component and lets the entire system scale proportionally
          if the base values ever change.
        </>
      }
    >
      {[...groupTokens(getTokens('semantic', 'spacing'), 2)].map(([groupName, tokens]) => (
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
              preview={
                <div
                  style={{
                    width: `var(${token.name})`,
                    minWidth: '4px',
                    height: '32px',
                    backgroundColor: 'var(--ds-semantic-color-background-brand-base)',
                    borderRadius: 'var(--ds-radii-sm)',
                  }}
                />
              }
            />
          ))}
        </TokenGroup>
      ))}
    </FoundationPage>
  ),
};
