import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Heading, Text } from '../Typography/Typography';

const meta = {
  title: 'Design System/Foundation/Color',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const isDarkColor = (variable: string) => {
  // Check for 600-900 weights (Core palettes)
  if (/(600|700|800|900)$/.test(variable)) return true;

  // Fallback for absolute black
  if (/black$/.test(variable)) return true;

  return false;
};

// Helper components for the Storybook display
const ColorSwatch = ({ name, variable, isCore = false }: { name: string; variable: string; isCore?: boolean }) => {
  const [copied, setCopied] = useState(false);
  const isDark = isCore ? isDarkColor(variable) : false;

  const handleCopy = () => {
    void navigator.clipboard.writeText(`var(${variable})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div
        style={{
          width: '100%',
          height: '60px',
          backgroundColor: `var(${variable})`,
          borderRadius: 'var(--ds-radii-md)',
          border: '1px solid var(--ds-semantic-color-border-subtle-base)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isDark ? 'var(--ds-semantic-color-text-inverse)' : 'var(--ds-semantic-color-text-default-base)',
          fontWeight: 500,
          fontSize: '1.25rem',
        }}
      >
        {isCore && 'Aa'}
      </div>
      <div>
        <Text size="sm" as="span" style={{ fontWeight: 600, display: 'block' }}>
          {name}
        </Text>
        <button
          onClick={handleCopy}
          title="Click to copy"
          style={{
            fontSize: '11px',
            fontFamily: 'monospace',
            background: copied ? 'var(--ds-semantic-color-background-utility-success-base)' : 'var(--ds-semantic-color-background-subtle-base)',
            color: copied ? 'var(--ds-semantic-color-text-inverse)' : 'var(--ds-semantic-color-text-subtle-base)',
            padding: '4px 8px',
            borderRadius: '4px',
            marginTop: '4px',
            display: 'inline-block',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {copied ? 'Copied!' : `var(${variable})`}
        </button>
      </div>
    </div>
  );
};

const ColorGroup = ({ title, colors, isCore = false }: { title: string; colors: { name: string; variable: string }[]; isCore?: boolean }) => (
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
        marginBottom: '24px',
        paddingBottom: '12px',
        borderBottom: '1px solid var(--ds-semantic-color-border-subtle-base)',
      }}
    >
      {title}
    </Heading>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '24px' }}>
      {colors.map((c) => (
        <ColorSwatch key={c.variable} name={c.name} variable={c.variable} isCore={isCore} />
      ))}
    </div>
  </div>
);

// Scale generator for core palettes
const generateScale = (name: string, prefix: string) =>
  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((weight) => ({
    name: `${name} ${weight}`,
    variable: `--ds-color-${prefix}-${weight}`,
  }));

export const CorePalettes: Story = {
  render: () => {
    const palettes = [
      { title: 'Sage (Brand / Primary)', colors: generateScale('Sage', 'sage') },
      { title: 'Charcoal (Neutral / Base)', colors: generateScale('Charcoal', 'charcoal') },
      { title: 'Ocean (Information)', colors: generateScale('Ocean', 'ocean') },
      { title: 'Honey (Warning)', colors: generateScale('Honey', 'honey') },
      { title: 'Berry (Error / Destructive)', colors: generateScale('Berry', 'berry') },
    ];

    return (
      <div style={{ backgroundColor: 'var(--ds-semantic-color-background-subtle-base)', minHeight: '100vh', width: '100%' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '64px 24px' }}>
          <Heading level={2} size="md" style={{ marginBottom: '16px' }}>
            Core Palettes
          </Heading>
          <Text size="md" style={{ marginBottom: '48px', color: 'var(--ds-semantic-color-text-subtle-base)', display: 'block' }}>
            Core Palettes are the primitive building blocks of the design system (the absolute hex values). Think of them as the raw paint tubes in an artist&apos;s palette. You should <strong>almost never</strong> use these variables directly in your application code. Instead, rely on the <strong>Semantic Colors</strong> below, which act as smart aliases to these core values, ensuring your components automatically adapt to dark mode and theme changes without requiring complex media queries.
          </Text>
          {palettes.map((p) => (
            <ColorGroup key={p.title} title={p.title} colors={p.colors} isCore={true} />
          ))}
        </div>
      </div>
    );
  },
};

export const SemanticColors: Story = {
  render: () => {
    const semanticGroups = [
      {
        title: 'Backgrounds',
        colors: [
          { name: 'Default Base', variable: '--ds-semantic-color-background-default-base' },
          { name: 'Default Hover', variable: '--ds-semantic-color-background-default-hover' },
          { name: 'Brand Base', variable: '--ds-semantic-color-background-brand-base' },
          { name: 'Subtle Base', variable: '--ds-semantic-color-background-subtle-base' },
          { name: 'Disabled', variable: '--ds-semantic-color-background-disabled' },
        ],
      },
      {
        title: 'Text',
        colors: [
          { name: 'Default Base', variable: '--ds-semantic-color-text-default-base' },
          { name: 'Subtle Base', variable: '--ds-semantic-color-text-subtle-base' },
          { name: 'Brand Base', variable: '--ds-semantic-color-text-brand-base' },
          { name: 'Inverse', variable: '--ds-semantic-color-text-inverse' },
          { name: 'Disabled', variable: '--ds-semantic-color-text-disabled' },
        ],
      },
      {
        title: 'Borders',
        colors: [
          { name: 'Default Base', variable: '--ds-semantic-color-border-default-base' },
          { name: 'Subtle Base', variable: '--ds-semantic-color-border-subtle-base' },
          { name: 'Brand Base', variable: '--ds-semantic-color-border-brand-base' },
          { name: 'Disabled', variable: '--ds-semantic-color-border-disabled' },
        ],
      },
      {
        title: 'Utility Backgrounds',
        colors: [
          { name: 'Success Base', variable: '--ds-semantic-color-background-utility-success-base' },
          { name: 'Warning Base', variable: '--ds-semantic-color-background-utility-warning-base' },
          { name: 'Error Base', variable: '--ds-semantic-color-background-utility-error-base' },
          { name: 'Info Base', variable: '--ds-semantic-color-background-utility-information-base' },
        ],
      },
      {
        title: 'Utility Text',
        colors: [
          { name: 'Success Base', variable: '--ds-semantic-color-text-utility-success-base' },
          { name: 'Warning Base', variable: '--ds-semantic-color-text-utility-warning-base' },
          { name: 'Error Base', variable: '--ds-semantic-color-text-utility-error-base' },
          { name: 'Info Base', variable: '--ds-semantic-color-text-utility-information-base' },
        ],
      },
      {
        title: 'Utility Borders',
        colors: [
          { name: 'Success Base', variable: '--ds-semantic-color-border-utility-success-base' },
          { name: 'Warning Base', variable: '--ds-semantic-color-border-utility-warning-base' },
          { name: 'Error Base', variable: '--ds-semantic-color-border-utility-error-base' },
          { name: 'Info Base', variable: '--ds-semantic-color-border-utility-information-base' },
        ],
      },
    ];

    return (
      <div style={{ backgroundColor: 'var(--ds-semantic-color-background-subtle-base)', minHeight: '100vh', width: '100%' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '64px 24px' }}>
          <Heading level={2} size="md" style={{ marginBottom: '16px' }}>
            Semantic Colors
          </Heading>
          <Text size="md" style={{ marginBottom: '48px', color: 'var(--ds-semantic-color-text-subtle-base)', display: 'block' }}>
            Semantic Colors express the <strong>intent</strong> of an element rather than its actual hue. For example, <code style={{ fontFamily: 'monospace', background: 'var(--ds-semantic-color-background-default-base)', padding: '2px 4px', borderRadius: '4px' }}>background-brand-base</code> tells you <em>why</em> the color is used, not <em>what</em> color it is. By exclusively using Semantic Colors in your CSS, you guarantee that your components will seamlessly invert during Dark Mode and automatically inherit any future rebranding efforts (like changing the primary brand color) without modifying a single line of component code.
          </Text>
          {semanticGroups.map((p) => (
            <ColorGroup key={p.title} title={p.title} colors={p.colors} />
          ))}
        </div>
      </div>
    );
  },
};
