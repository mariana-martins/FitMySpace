import {
  CopyTokenButton,
  formatTokenLabel,
  FoundationPage,
  getTokens,
  groupTokens,
  InlineCode,
  StorybookLink,
  TokenGroup,
} from '../../docs';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { CSSProperties, ReactNode } from 'react';
import type { DocumentedToken } from '../../docs';
import { Text } from '../../ui/Typography';

const meta = {
  title: 'Design System/Foundation/Typography',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SPECIMEN_TEXT = 'Find storage that fits your space';

const roleDescriptions: Record<string, ReactNode> = {
  display: (
    <>
      Oversized titles for hero areas and landing moments, one per page at most. Use{' '}
      <InlineCode>{'<Heading displaySize="lg">'}</InlineCode> (see the{' '}
      <StorybookLink path="/docs/design-system-components-typography-heading--docs">
        Heading docs
      </StorybookLink>
      ).
    </>
  ),
  heading: (
    <>
      Section and card titles. The size is independent of the heading level, so pick the level for
      the document outline and the size for the look. Use{' '}
      <InlineCode>{'<Heading level={2} size="md">'}</InlineCode> (see the{' '}
      <StorybookLink path="/docs/design-system-components-typography-heading--docs">
        Heading docs
      </StorybookLink>
      ).
    </>
  ),
  body: (
    <>
      Running text and descriptions. Use <InlineCode>{'<Text size="md">'}</InlineCode> (see the{' '}
      <StorybookLink path="/docs/design-system-components-typography-text--docs">
        Text docs
      </StorybookLink>
      ).
    </>
  ),
  control: (
    <>
      Text typed into form controls and shown in buttons. Input and Button use these tokens; you
      rarely need them directly.
    </>
  ),
  label: (
    <>
      Form labels and short UI text, slightly heavier and wider than body. Use{' '}
      <InlineCode>{'<Label size="md">'}</InlineCode> (see the{' '}
      <StorybookLink path="/docs/design-system-components-typography-label--docs">
        Label docs
      </StorybookLink>
      ).
    </>
  ),
  caption: (
    <>
      Small supporting text such as metadata and footnotes. Use{' '}
      <InlineCode>{'<Caption>'}</InlineCode> (see the{' '}
      <StorybookLink path="/docs/design-system-components-typography-caption--docs">
        Caption docs
      </StorybookLink>
      ).
    </>
  ),
};

/** The parts of a text style shown in its specification line. */
type TextStyleProperty = 'fontSize' | 'fontWeight' | 'lineHeight' | 'letterSpacing';

const ROOT_FONT_SIZE_PX = 16;
const REM_PATTERN = /^([\d.]+)rem$/;

function propertyOf(token: DocumentedToken): string {
  return token.path[4];
}

function findToken(tokens: DocumentedToken[], property: string): DocumentedToken | undefined {
  return tokens.find((token) => propertyOf(token) === property);
}

/**
 * The specimen is styled the way a consumer would style plain HTML:
 * the `font` shorthand plus letter spacing, which `font` cannot carry.
 */
function specimenStyle(tokens: DocumentedToken[]): CSSProperties {
  const shorthand = findToken(tokens, 'shorthand');
  const letterSpacing = findToken(tokens, 'letterSpacing');
  return {
    font: shorthand && `var(${shorthand.name})`,
    letterSpacing: letterSpacing && `var(${letterSpacing.name})`,
  };
}

/** `3rem` → `3rem (48px)`, so designers can match the value in Figma. */
function withPixels(value: string): string {
  const remMatch = REM_PATTERN.exec(value);
  return remMatch ? `${value} (${Number(remMatch[1]) * ROOT_FONT_SIZE_PX}px)` : value;
}

/**
 * A read-only summary of the style. The page offers no per-property
 * tokens to copy: a style is used whole, through its component or its shorthand.
 */
function specification(tokens: DocumentedToken[]): string {
  const valueOf = (property: TextStyleProperty) => findToken(tokens, property)?.value ?? '?';
  return [
    `Size ${withPixels(valueOf('fontSize'))}`,
    `weight ${valueOf('fontWeight')}`,
    `line height ${valueOf('lineHeight')}`,
    `letter spacing ${valueOf('letterSpacing')}`,
  ].join(', ');
}

/** Letter spacing only needs its own declaration when the style changes it. */
function hasCustomLetterSpacing(tokens: DocumentedToken[]): boolean {
  const letterSpacing = findToken(tokens, 'letterSpacing');
  return letterSpacing !== undefined && Number.parseFloat(letterSpacing.value) !== 0;
}

const TextStyleSpecimen = ({ label, tokens }: { label: string; tokens: DocumentedToken[] }) => {
  const shorthand = findToken(tokens, 'shorthand');
  const letterSpacing = findToken(tokens, 'letterSpacing');

  return (
    <div
      style={{
        padding: '24px 0',
        borderBottom: '1px solid var(--ds-semantic-color-border-subtle-base)',
      }}
    >
      <Text size="sm" as="span" style={{ fontWeight: 600, display: 'block', marginBottom: '8px' }}>
        {label}
      </Text>
      <p style={{ margin: '0 0 8px', ...specimenStyle(tokens) }}>{SPECIMEN_TEXT}</p>
      <Text size="sm" as="span" style={{ color: 'var(--ds-semantic-color-text-subtle-base)' }}>
        {specification(tokens)}
      </Text>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
        {shorthand && <CopyTokenButton variable={shorthand.name} />}
        {letterSpacing && hasCustomLetterSpacing(tokens) && (
          <CopyTokenButton variable={letterSpacing.name} />
        )}
      </div>
    </div>
  );
};

/* --- Type Scale --- */
export const TypeScale: Story = {
  render: () => (
    <FoundationPage
      title="Typography"
      introduction={
        <>
          Every text style is set in DM Sans and bundles a size, weight, line height and letter
          spacing. Sizes are in <InlineCode>rem</InlineCode>, so text follows the reader&apos;s
          browser font size. Apply a style through the <strong>Heading</strong>,{' '}
          <strong>Text</strong>, <strong>Label</strong> or <strong>Caption</strong> component. When
          no component fits, use the style&apos;s shorthand in one line, never its separate parts:{' '}
          <InlineCode>font: var(--ds-semantic-typography-body-md-shorthand)</InlineCode>. The CSS{' '}
          <InlineCode>font</InlineCode> property cannot carry letter spacing, so styles that change
          it (display and label) also offer their <InlineCode>letter-spacing</InlineCode> token.
        </>
      }
    >
      {[...groupTokens(getTokens('semantic', 'typography'), 2)].map(([role, roleTokens]) => (
        <TokenGroup
          key={role}
          title={formatTokenLabel([role])}
          description={roleDescriptions[role]}
        >
          {[...groupTokens(roleTokens, 3)].map(([size, styleTokens]) => (
            <TextStyleSpecimen
              key={size}
              label={formatTokenLabel([role, size])}
              tokens={styleTokens}
            />
          ))}
        </TokenGroup>
      ))}
    </FoundationPage>
  ),
};
