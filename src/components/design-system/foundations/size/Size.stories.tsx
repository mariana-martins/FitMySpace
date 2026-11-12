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
import { ImageIcon, Search } from 'lucide-react';
import type { ReactNode } from 'react';

const meta = {
  title: 'Design System/Foundation/Size',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Layout widths are drawn at 1/16 scale, so the widest container (1280px) is an 80px bar. */
const LAYOUT_PREVIEW_SCALE = 16;

const groupDescriptions: Record<string, string> = {
  control:
    'Minimum heights shared by every form control and button, on the 4px grid. A Button and an Input of the same size line up in a row, and the smallest step still clears the 24px minimum target size of WCAG 2.5.8.',
  icon: 'Icon sizes that sit next to text, on the 4px grid. They are set in rem, like the type scale, so icons grow with the reader’s browser font size.',
  'selection-control':
    'The box of a checkbox or radio, sized to sit on the first line of its label. Set in rem, like icons, so it grows with the text.',
  tag: 'Heights of static labels such as badges. They are not clickable, so they may sit below the 24px target size.',
  target:
    'The clickable area of anything interactive, which can be larger than what is drawn. Make a small icon button reach at least the minimum with padding; prefer the comfortable size where people tap with a finger.',
  thumbnail:
    'Square image slots for products and previews, from a list row (SM) to a featured card (XL). Images fill the slot with object-fit: cover.',
  container:
    'Maximum widths for page content, matched to common viewport widths. Centre the container and let it shrink below its maximum on smaller screens.',
  prose: 'The longest comfortable line for running text. Wider lines make the eye lose its place.',
};

const iconStyle = (token: DocumentedToken) => ({
  display: 'block',
  width: `var(${token.name})`,
  height: `var(${token.name})`,
  color: 'var(--ds-semantic-color-text-brand-base)',
});

const layoutBar = (token: DocumentedToken) => (
  <div
    style={{
      width: `calc(var(${token.name}) / ${LAYOUT_PREVIEW_SCALE})`,
      height: '24px',
      borderRadius: 'var(--ds-radii-sm)',
      backgroundColor: 'var(--ds-semantic-color-background-brand-base)',
    }}
  />
);

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
  icon: (token) => <Search focusable="false" style={iconStyle(token)} />,
  tag: (token) => (
    <div
      style={{
        width: '64px',
        height: `var(${token.name})`,
        borderRadius: 'var(--ds-semantic-radii-surface-full)',
        backgroundColor: 'var(--ds-semantic-color-background-brand-soft)',
      }}
    />
  ),
  'selection-control': (token) => (
    <div
      style={{
        width: `var(${token.name})`,
        height: `var(${token.name})`,
        boxSizing: 'border-box',
        borderRadius: 'var(--ds-semantic-radii-interactive-sm)',
        border:
          'var(--ds-semantic-border-width-interactive) solid var(--ds-semantic-color-border-default-base)',
      }}
    />
  ),
  target: (token) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `var(${token.name})`,
        height: `var(${token.name})`,
        boxSizing: 'border-box',
        borderRadius: 'var(--ds-radii-md)',
        border:
          'var(--ds-semantic-border-width-default) dashed var(--ds-semantic-color-border-brand-base)',
      }}
    >
      <div
        style={{
          width: '12px',
          height: '12px',
          borderRadius: 'var(--ds-radii-full)',
          backgroundColor: 'var(--ds-semantic-color-background-brand-base)',
        }}
      />
    </div>
  ),
  thumbnail: (token) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `var(${token.name})`,
        height: `var(${token.name})`,
        borderRadius: 'var(--ds-radii-md)',
        backgroundColor: 'var(--ds-semantic-color-background-default-hover)',
        color: 'var(--ds-semantic-color-text-subtle-base)',
      }}
    >
      <ImageIcon focusable="false" style={{ width: '40%', height: '40%' }} />
    </div>
  ),
  container: layoutBar,
  prose: layoutBar,
};

/* --- Semantic Size --- */
export const SemanticSize: Story = {
  render: () => (
    <FoundationPage
      title="Size"
      introduction={
        <>
          Size tokens fix the dimensions of elements that must match across components: controls,
          icons, click targets, image slots and layout widths. Every size is a multiple of 4.
          Instead of writing <InlineCode>min-height: 48px</InlineCode>, you write{' '}
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
