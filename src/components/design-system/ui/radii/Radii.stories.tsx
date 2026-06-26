import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Heading, Text } from '../Typography';

const meta = {
  title: 'Design System/Foundation/Radii',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Resolved pixel values for each token (mirroring tokens.css)
const resolvedValues: Record<string, string> = {
  '--ds-semantic-radii-interactive-sm': '4px',
  '--ds-semantic-radii-interactive-md': '8px',
  '--ds-semantic-radii-interactive-lg': '12px',
  '--ds-semantic-radii-interactive-full': '9999px',
  '--ds-semantic-radii-container-sm': '8px',
  '--ds-semantic-radii-container-md': '12px',
  '--ds-semantic-radii-container-lg': '16px',
  '--ds-semantic-radii-surface-sm': '4px',
  '--ds-semantic-radii-surface-md': '8px',
  '--ds-semantic-radii-surface-lg': '12px',
  '--ds-semantic-radii-surface-full': '9999px',
};

// Helper components for the Storybook display
const RadiiSwatch = ({ name, variable }: { name: string; variable: string }) => {
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
      {/* Visual square preview */}
      <div
        style={{
          width: '48px',
          height: '48px',
          backgroundColor: 'var(--ds-semantic-color-background-brand-base)',
          borderRadius: `var(${variable})`,
          flexShrink: 0,
          border: '1px solid var(--ds-semantic-color-border-subtle-base)',
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
        title={`Click to copy var(${variable})`}
        style={{
          fontSize: '11px',
          fontFamily: 'monospace',
          background: copied
            ? 'var(--ds-semantic-color-background-utility-success-base)'
            : 'var(--ds-semantic-color-background-subtle-base)',
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
        className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-(--ds-semantic-color-border-brand-base)"
      >
        {copied ? 'Copied!' : `var(${variable})`}
      </button>
    </div>
  );
};

const RadiiGroup = ({
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
        <RadiiSwatch key={t.variable} name={t.name} variable={t.variable} />
      ))}
    </div>
  </div>
);

export const SemanticRadii: Story = {
  render: () => {
    const groups = [
      {
        title: 'Interactive',
        description:
          'Applied to elements the user can directly interact with. Use these tokens for actionable items like buttons, text inputs, checkboxes, and toggle switches. Consistent rounding here signals interactivity and tactile feedback.',
        tokens: [
          { name: 'Interactive SM', variable: '--ds-semantic-radii-interactive-sm' },
          { name: 'Interactive MD', variable: '--ds-semantic-radii-interactive-md' },
          { name: 'Interactive LG', variable: '--ds-semantic-radii-interactive-lg' },
          { name: 'Interactive Full', variable: '--ds-semantic-radii-interactive-full' },
        ],
      },
      {
        title: 'Container',
        description:
          'Applied to structural elements that group content together. Use these tokens for layout building blocks like cards, list groups, sidebars, and nested panels. They help create clear visual boundaries without overpowering the content inside.',
        tokens: [
          { name: 'Container SM', variable: '--ds-semantic-radii-container-sm' },
          { name: 'Container MD', variable: '--ds-semantic-radii-container-md' },
          { name: 'Container LG', variable: '--ds-semantic-radii-container-lg' },
        ],
      },
      {
        title: 'Surface',
        description:
          'Applied to the largest floating elements and major layout surfaces that sit above the rest of the UI. Use these tokens for prominent overlay elements like dialogs, bottom sheets, and large floating menus to create a sense of elevation and separation.',
        tokens: [
          { name: 'Surface SM', variable: '--ds-semantic-radii-surface-sm' },
          { name: 'Surface MD', variable: '--ds-semantic-radii-surface-md' },
          { name: 'Surface LG', variable: '--ds-semantic-radii-surface-lg' },
          { name: 'Surface Full', variable: '--ds-semantic-radii-surface-full' },
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
            Semantic Radii
          </Heading>
          <Text
            size="md"
            style={{
              marginBottom: '48px',
              color: 'var(--ds-semantic-color-text-subtle-base)',
              display: 'block',
            }}
          >
            Semantic Radii tokens replace arbitrary pixel values with purposeful, design-led names. By defining our border radii based on the <em>type</em> of UI element — rather than just a size — we ensure that our interactive elements, structural containers, and floating surfaces maintain a consistent and unified aesthetic across the entire application. When in doubt, let the element&apos;s function dictate its radius. Instead of writing{' '}
            <code
              style={{
                fontFamily: 'monospace',
                background: 'var(--ds-semantic-color-background-subtle-base)',
                padding: '2px 4px',
                borderRadius: '4px',
              }}
            >
              border-radius: 8px
            </code>
            , you write{' '}
            <code
              style={{
                fontFamily: 'monospace',
                background: 'var(--ds-semantic-color-background-subtle-base)',
                padding: '2px 4px',
                borderRadius: '4px',
              }}
            >
              border-radius: var(--ds-semantic-radii-interactive-md)
            </code>
            .
          </Text>
          {groups.map((g) => (
            <RadiiGroup
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
