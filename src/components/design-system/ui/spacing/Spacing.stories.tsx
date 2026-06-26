import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Heading, Text } from '../Typography';

const meta = {
  title: 'Design System/Foundation/Spacing',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Resolved pixel values for each token (mirroring tokens.css)
const resolvedValues: Record<string, string> = {
  '--ds-semantic-spacing-inset-xs': '4px',
  '--ds-semantic-spacing-inset-sm': '8px',
  '--ds-semantic-spacing-inset-md': '16px',
  '--ds-semantic-spacing-inset-lg': '24px',
  '--ds-semantic-spacing-inset-xl': '32px',
  '--ds-semantic-spacing-gap-xs': '4px',
  '--ds-semantic-spacing-gap-sm': '8px',
  '--ds-semantic-spacing-gap-md': '12px',
  '--ds-semantic-spacing-gap-lg': '16px',
  '--ds-semantic-spacing-gap-xl': '24px',
  '--ds-semantic-spacing-section-sm': '24px',
  '--ds-semantic-spacing-section-md': '40px',
  '--ds-semantic-spacing-section-lg': '64px',
  '--ds-semantic-spacing-section-xl': '80px',
};

// Helper components for the Storybook display
const SpacingSwatch = ({ name, variable }: { name: string; variable: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(`var(${variable})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pixelValue = resolvedValues[variable] ?? '?';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '12px 0',
        borderBottom: '1px solid var(--ds-semantic-color-border-subtle-base)',
      }}
    >
      {/* Visual bar */}
      <div
        style={{
          width: `var(${variable})`,
          minWidth: '4px',
          height: '32px',
          backgroundColor: 'var(--ds-semantic-color-background-brand-base)',
          borderRadius: 'var(--ds-radii-sm)',
          flexShrink: 0,
          transition: 'width 0.3s ease',
        }}
        aria-hidden="true"
      />

      {/* Token info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Text size="sm" as="span" style={{ fontWeight: 600, display: 'block' }}>
          {name}
        </Text>
        <Text
          size="sm"
          as="span"
          style={{
            color: 'var(--ds-semantic-color-text-subtle-base)',
            display: 'block',
            marginTop: '2px',
          }}
        >
          {pixelValue}
        </Text>
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        title="Click to copy"
        style={{
          fontSize: '11px',
          fontFamily: 'monospace',
          background: copied
            ? 'var(--ds-semantic-color-background-utility-success-base)'
            : 'var(--ds-semantic-color-background-default-hover)',
          color: copied
            ? 'var(--ds-semantic-color-text-inverse)'
            : 'var(--ds-semantic-color-text-subtle-base)',
          padding: '4px 8px',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {copied ? 'Copied!' : `var(${variable})`}
      </button>
    </div>
  );
};

const SpacingGroup = ({
  title,
  description,
  tokens,
}: {
  title: string;
  description: string;
  tokens: { name: string; variable: string }[];
}) => (
  <div
    style={{
      marginBottom: '40px',
      backgroundColor: 'var(--ds-semantic-color-background-default-base)',
      padding: '32px',
      borderRadius: 'var(--ds-radii-xl)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.02)',
      border: '1px solid var(--ds-semantic-color-border-subtle-base)',
    }}
  >
    <Heading
      level={3}
      size="sm"
      style={{
        marginBottom: '8px',
      }}
    >
      {title}
    </Heading>
    <Text
      size="sm"
      as="span"
      style={{
        color: 'var(--ds-semantic-color-text-subtle-base)',
        display: 'block',
        marginBottom: '16px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--ds-semantic-color-border-subtle-base)',
      }}
    >
      {description}
    </Text>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {tokens.map((t) => (
        <SpacingSwatch key={t.variable} name={t.name} variable={t.variable} />
      ))}
    </div>
  </div>
);

export const SemanticSpacing: Story = {
  render: () => {
    const groups = [
      {
        title: 'Inset',
        description:
          'Internal padding applied inside a component. Use Inset tokens for the breathing room between a container\u2019s edge and its content \u2014 buttons, cards, inputs, modals, and similar UI shells.',
        tokens: [
          { name: 'Inset XS', variable: '--ds-semantic-spacing-inset-xs' },
          { name: 'Inset SM', variable: '--ds-semantic-spacing-inset-sm' },
          { name: 'Inset MD', variable: '--ds-semantic-spacing-inset-md' },
          { name: 'Inset LG', variable: '--ds-semantic-spacing-inset-lg' },
          { name: 'Inset XL', variable: '--ds-semantic-spacing-inset-xl' },
        ],
      },
      {
        title: 'Gap',
        description:
          'Space between sibling elements in a layout. Use Gap tokens with CSS Flexbox or Grid gap to control the distance between items like form fields, icon + label pairs, or list entries.',
        tokens: [
          { name: 'Gap XS', variable: '--ds-semantic-spacing-gap-xs' },
          { name: 'Gap SM', variable: '--ds-semantic-spacing-gap-sm' },
          { name: 'Gap MD', variable: '--ds-semantic-spacing-gap-md' },
          { name: 'Gap LG', variable: '--ds-semantic-spacing-gap-lg' },
          { name: 'Gap XL', variable: '--ds-semantic-spacing-gap-xl' },
        ],
      },
      {
        title: 'Section',
        description:
          'Vertical rhythm between major page blocks. Use Section tokens to separate hero banners, content areas, footers, and other high-level layout regions. These are the largest spacing values in the system.',
        tokens: [
          { name: 'Section SM', variable: '--ds-semantic-spacing-section-sm' },
          { name: 'Section MD', variable: '--ds-semantic-spacing-section-md' },
          { name: 'Section LG', variable: '--ds-semantic-spacing-section-lg' },
          { name: 'Section XL', variable: '--ds-semantic-spacing-section-xl' },
        ],
      },
    ];

    return (
      <div
        style={{
          backgroundColor: 'var(--ds-semantic-color-background-default-base)',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '64px 24px' }}>
          <Heading level={2} size="md" style={{ marginBottom: '16px' }}>
            Semantic Spacing
          </Heading>
          <Text
            size="md"
            style={{
              marginBottom: '48px',
              color: 'var(--ds-semantic-color-text-subtle-base)',
              display: 'block',
            }}
          >
            Semantic Spacing tokens replace hard-coded pixel values with <strong>meaningful names</strong> that describe <em>where</em> and <em>why</em> a space exists. Instead of writing{' '}
            <code
              style={{
                fontFamily: 'monospace',
                background: 'var(--ds-semantic-color-background-default-hover)',
                padding: '2px 4px',
                borderRadius: '4px',
              }}
            >
              padding: 16px
            </code>
            , you write{' '}
            <code
              style={{
                fontFamily: 'monospace',
                background: 'var(--ds-semantic-color-background-default-hover)',
                padding: '2px 4px',
                borderRadius: '4px',
              }}
            >
              padding: var(--ds-semantic-spacing-inset-md)
            </code>
            . This makes your spacing consistent across every component and lets the entire system scale proportionally if the base values ever change.
          </Text>
          {groups.map((g) => (
            <SpacingGroup
              key={g.title}
              title={g.title}
              description={g.description}
              tokens={g.tokens}
            />
          ))}
        </div>
      </div>
    );
  },
};
