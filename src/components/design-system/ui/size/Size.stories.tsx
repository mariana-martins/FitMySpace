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
import type { DocumentedToken } from '../../docs';
import type { ReactNode } from 'react';
import { Search } from 'lucide-react';

const meta = {
  title: 'Design System/Foundation/Size',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const groupDescriptions: Record<string, string> = {
  control:
    'Minimum heights shared by every form control and button, on the 4px grid. A Button and an Input of the same size line up in a row, and the smallest step still clears the 24px minimum target size of WCAG 2.5.8.',
  icon: 'Icon sizes that sit next to text. They are set in rem, like the type scale, so icons grow with the reader’s browser font size.',
};

const previewByGroup: Record<string, (token: DocumentedToken) => ReactNode> = {
  control: (token) => (
    <div
      style={{
        width: '96px',
        height: `var(${token.name})`,
        borderRadius: 'var(--ds-radii-md)',
        backgroundColor: 'var(--ds-semantic-color-background-brand-base)',
      }}
    />
  ),
  icon: (token) => (
    <Search
      focusable="false"
      style={{
        display: 'block',
        width: `var(${token.name})`,
        height: `var(${token.name})`,
        color: 'var(--ds-semantic-color-text-brand-base)',
      }}
    />
  ),
};

/* --- Semantic Size --- */
export const SemanticSize: Story = {
  render: () => (
    <FoundationPage
      title="Size"
      introduction={
        <>
          Size tokens fix the dimensions of elements that must match across components. Instead of
          writing <InlineCode>min-height: 48px</InlineCode>, you write{' '}
          <InlineCode>min-height: var(--ds-semantic-size-control-md)</InlineCode>, so every medium
          control keeps the same height when the scale changes.
        </>
      }
    >
      {[...groupTokens(getTokens('semantic', 'size'), 2)].map(([groupName, tokens]) => (
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
    </FoundationPage>
  ),
};
