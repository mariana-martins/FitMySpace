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
  title: 'Design System/Foundation/Radii',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const groupDescriptions: Record<string, string> = {
  interactive:
    'Applied to elements the user can directly interact with. Use these tokens for actionable items like buttons, text inputs, checkboxes, and toggle switches. Consistent rounding here signals interactivity and tactile feedback.',
  container:
    'Applied to structural elements that group content together. Use these tokens for layout building blocks like cards, list groups, sidebars, and nested panels. They help create clear visual boundaries without overpowering the content inside.',
  surface:
    'Applied to the largest floating elements and major layout surfaces that sit above the rest of the UI. Use these tokens for prominent overlay elements like dialogs, bottom sheets, and large floating menus to create a sense of elevation and separation.',
};

/* --- Semantic Radii --- */
export const SemanticRadii: Story = {
  render: () => (
    <FoundationPage
      title="Semantic Radii"
      introduction={
        <>
          Semantic Radii tokens replace arbitrary pixel values with purposeful, design-led names. By
          defining our border radii based on the <em>type</em> of UI element — rather than just a
          size — we ensure that our interactive elements, structural containers, and floating
          surfaces maintain a consistent and unified aesthetic across the entire application. When
          in doubt, let the element&apos;s function dictate its radius. Instead of writing{' '}
          <InlineCode>border-radius: 8px</InlineCode>, you write{' '}
          <InlineCode>border-radius: var(--ds-semantic-radii-interactive-md)</InlineCode>.
        </>
      }
    >
      {[...groupTokens(getTokens('semantic', 'radii'), 2)].map(([groupName, tokens]) => (
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
                    width: '48px',
                    height: '48px',
                    backgroundColor: 'var(--ds-semantic-color-background-brand-base)',
                    borderRadius: `var(${token.name})`,
                    border: '1px solid var(--ds-semantic-color-border-subtle-base)',
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
