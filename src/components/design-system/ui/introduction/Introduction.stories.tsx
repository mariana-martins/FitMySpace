import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Heading, Text } from '../Typography';

const meta = {
  title: 'Design System/Introduction',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/*  Shared inline styles                                               */
/* ------------------------------------------------------------------ */

const codeStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  background: 'var(--ds-semantic-color-background-subtle-base)',
  padding: '2px 6px',
  borderRadius: '4px',
  fontSize: '13px',
};

const cardBase: React.CSSProperties = {
  backgroundColor: 'var(--ds-semantic-color-background-default-base)',
  borderRadius: 'var(--ds-radii-xl)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.02)',
  border: '1px solid var(--ds-semantic-color-border-subtle-base)',
  padding: '32px',
};

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

const Hero = () => (
  <header
    style={{
      marginBottom: '56px',
      position: 'relative',
    }}
  >
    {/* Brand accent bar */}
    <div
      style={{
        width: '48px',
        height: '4px',
        borderRadius: 'var(--ds-radii-full)',
        backgroundColor: 'var(--ds-semantic-color-background-brand-base)',
        marginBottom: '24px',
      }}
      aria-hidden="true"
    />

    <Heading
      level={2}
      size="lg"
      style={{
        marginBottom: '16px',
        textWrap: 'balance',
      }}
    >
      FitMySpace Design System
    </Heading>

    <Text
      size="md"
      style={{
        color: 'var(--ds-semantic-color-text-subtle-base)',
        display: 'block',
        maxWidth: '640px',
        textWrap: 'pretty',
      }}
    >
      A shared language of colour, spacing, typography, and shape that keeps
      every FitMySpace interface consistent, accessible, and easy to evolve.
      This guide will help you understand how our design tokens work and how to
      use them in your components.
    </Text>
  </header>
);

/* ------------------------------------------------------------------ */
/*  Token Architecture Diagram                                         */
/* ------------------------------------------------------------------ */

const TierCard = ({
  tier,
  label,
  description,
  examples,
  accent,
}: {
  tier: string;
  label: string;
  description: string;
  examples: string[];
  accent: string;
}) => (
  <div
    style={{
      flex: '1 1 0%',
      minWidth: '260px',
      ...cardBase,
      borderTop: `3px solid ${accent}`,
    }}
  >
    <Text
      size="sm"
      as="span"
      style={{
        fontWeight: 600,
        color: accent,
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
        display: 'block',
        marginBottom: '4px',
      }}
    >
      {tier}
    </Text>
    <Heading level={3} size="sm" style={{ marginBottom: '8px' }}>
      {label}
    </Heading>
    <Text
      size="sm"
      as="span"
      style={{
        color: 'var(--ds-semantic-color-text-subtle-base)',
        display: 'block',
        marginBottom: '16px',
        textWrap: 'pretty',
      }}
    >
      {description}
    </Text>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      {examples.map((ex) => (
        <code key={ex} style={{ ...codeStyle, display: 'block', width: 'fit-content' }}>
          {ex}
        </code>
      ))}
    </div>
  </div>
);

const ArrowConnector = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      padding: '8px 0',
    }}
    aria-hidden="true"
  >
    {/* Horizontal arrow on wide screens, vertical on narrow */}
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      style={{
        color: 'var(--ds-semantic-color-text-subtle-base)',
        opacity: 0.5,
      }}
    >
      {/* Right arrow */}
      <path
        d="M8 20h24M24 12l8 8-8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const TokenArchitecture = () => (
  <section style={{ marginBottom: '56px' }}>
    <Heading level={3} size="sm" style={{ marginBottom: '8px' }}>
      Token Architecture
    </Heading>
    <Text
      size="sm"
      as="span"
      style={{
        color: 'var(--ds-semantic-color-text-subtle-base)',
        display: 'block',
        marginBottom: '24px',
        textWrap: 'pretty',
      }}
    >
      Our design tokens follow a two-tier architecture. Tier 1 holds the raw
      values — think of them as the raw ingredients. Tier 2 creates
      purpose-driven aliases that your components actually consume.
    </Text>
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
      }}
    >
      <TierCard
        tier="Tier 1"
        label="Core Definitions"
        description="Literal values that define the palette. Never reference these directly in component code."
        examples={[
          '--ds-color-sage-700',
          '--ds-radii-md',
          '--ds-spacing-4',
        ]}
        accent="var(--ds-semantic-color-text-subtle-base)"
      />
      <ArrowConnector />
      <TierCard
        tier="Tier 2"
        label="Semantic Aliases"
        description="Intent-based names that reference Tier 1. These are what you use in your components."
        examples={[
          '--ds-semantic-color-background-brand-base',
          '--ds-semantic-radii-interactive-md',
          '--ds-semantic-spacing-inset-md',
        ]}
        accent="var(--ds-semantic-color-text-brand-base)"
      />
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Quick-start Guide                                                  */
/* ------------------------------------------------------------------ */

const StepCard = ({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) => (
  <div
    style={{
      flex: '1 1 280px',
      ...cardBase,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}
  >
    <div
      style={{
        width: '32px',
        height: '32px',
        borderRadius: 'var(--ds-radii-full)',
        backgroundColor: 'var(--ds-semantic-color-background-brand-base)',
        color: 'var(--ds-semantic-color-text-inverse)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: '14px',
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      {step}
    </div>
    <Heading level={4} size="sm">
      {title}
    </Heading>
    <Text
      size="sm"
      as="span"
      style={{
        color: 'var(--ds-semantic-color-text-subtle-base)',
        display: 'block',
        textWrap: 'pretty',
      }}
    >
      {children}
    </Text>
  </div>
);

const QuickStart = () => (
  <section style={{ marginBottom: '56px' }}>
    <Heading level={3} size="sm" style={{ marginBottom: '8px' }}>
      Quick Start
    </Heading>
    <Text
      size="sm"
      as="span"
      style={{
        color: 'var(--ds-semantic-color-text-subtle-base)',
        display: 'block',
        marginBottom: '24px',
      }}
    >
      Three principles to keep in mind when working with the design system.
    </Text>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      <StepCard step={1} title="Use semantic tokens">
        Always reach for a Tier 2 variable. Instead of{' '}
        <code style={codeStyle}>border-radius: 8px</code>, write{' '}
        <code style={codeStyle}>
          border-radius: var(--ds-semantic-radii-interactive-md)
        </code>
        . The semantic name tells future readers <em>why</em> the value exists.
      </StepCard>

      <StepCard step={2} title="Never hard-code values">
        Hard-coded pixels bypass the design system and break when tokens change.
        If you find yourself writing a raw number, search the token list first —
        there is almost certainly a semantic variable for what you need.
      </StepCard>

      <StepCard step={3} title="Rebuild after edits">
        After editing any <code style={codeStyle}>.json</code> file inside{' '}
        <code style={codeStyle}>tokens/</code>, run{' '}
        <code style={codeStyle}>npm run tokens:build</code> to regenerate the
        CSS custom properties. The generated{' '}
        <code style={codeStyle}>tokens.css</code> is committed to the repo so
        that every consumer stays in sync.
      </StepCard>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Foundation Navigation Cards                                        */
/* ------------------------------------------------------------------ */

const FoundationCard = ({
  title,
  description,
  preview,
}: {
  title: string;
  description: string;
  preview: React.ReactNode;
}) => (
  <div
    style={{
      ...cardBase,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      transition: 'box-shadow 0.2s ease, transform 0.2s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow =
        '0 8px 30px rgba(0,0,0,0.06), 0 2px 6px rgba(0,0,0,0.04)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow =
        '0 4px 20px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.02)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    {/* Decorative preview */}
    <div aria-hidden="true">{preview}</div>

    <div>
      <Heading level={4} size="sm" style={{ marginBottom: '4px' }}>
        {title}
      </Heading>
      <Text
        size="sm"
        as="span"
        style={{
          color: 'var(--ds-semantic-color-text-subtle-base)',
          display: 'block',
          textWrap: 'pretty',
        }}
      >
        {description}
      </Text>
    </div>
  </div>
);

/* Decorative preview strips for each foundation category */

const ColorPreview = () => {
  const colors = [
    'var(--ds-color-sage-400)',
    'var(--ds-color-sage-600)',
    'var(--ds-color-sage-800)',
    'var(--ds-color-charcoal-300)',
    'var(--ds-color-ocean-500)',
    'var(--ds-color-honey-400)',
    'var(--ds-color-berry-500)',
  ];
  return (
    <div style={{ display: 'flex', gap: '4px', height: '32px' }}>
      {colors.map((c) => (
        <div
          key={c}
          style={{
            flex: 1,
            backgroundColor: c,
            borderRadius: 'var(--ds-radii-sm)',
          }}
        />
      ))}
    </div>
  );
};

const SpacingPreview = () => {
  const widths = ['20%', '35%', '55%', '75%'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', height: '32px', justifyContent: 'space-between' }}>
      {widths.map((w) => (
        <div
          key={w}
          style={{
            width: w,
            height: '5px',
            backgroundColor: 'var(--ds-semantic-color-background-brand-base)',
            borderRadius: 'var(--ds-radii-sm)',
          }}
        />
      ))}
    </div>
  );
};

const RadiiPreview = () => {
  const radii = [
    'var(--ds-radii-sm)',
    'var(--ds-radii-md)',
    'var(--ds-radii-lg)',
    'var(--ds-radii-full)',
  ];
  return (
    <div style={{ display: 'flex', gap: '8px', height: '32px', alignItems: 'center' }}>
      {radii.map((r) => (
        <div
          key={r}
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'var(--ds-semantic-color-background-brand-base)',
            borderRadius: r,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
};

const TypographyPreview = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', height: '32px', justifyContent: 'center' }}>
    <div
      style={{
        fontSize: '18px',
        fontWeight: 700,
        color: 'var(--ds-semantic-color-text-default-base)',
        lineHeight: 1,
      }}
    >
      Aa
    </div>
    <div
      style={{
        fontSize: '11px',
        color: 'var(--ds-semantic-color-text-subtle-base)',
        fontFamily: 'var(--ds-font-family-sans)',
      }}
    >
      DM Sans · 400 · 500 · 600 · 700
    </div>
  </div>
);

const FoundationGrid = () => (
  <section>
    <Heading level={3} size="sm" style={{ marginBottom: '8px' }}>
      Foundation Tokens
    </Heading>
    <Text
      size="sm"
      as="span"
      style={{
        color: 'var(--ds-semantic-color-text-subtle-base)',
        display: 'block',
        marginBottom: '24px',
      }}
    >
      Explore each category in the sidebar to see every token with live
      previews and copy-ready CSS variables.
    </Text>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '16px',
      }}
    >
      <FoundationCard
        title="Color"
        description="Core palettes and semantic colour roles for backgrounds, text, borders, and utility states."
        preview={<ColorPreview />}
      />
      <FoundationCard
        title="Spacing"
        description="Inset, gap, and section tokens that control padding, element spacing, and page rhythm."
        preview={<SpacingPreview />}
      />
      <FoundationCard
        title="Radii"
        description="Semantic border-radius tokens for interactive elements, containers, and surfaces."
        preview={<RadiiPreview />}
      />
      <FoundationCard
        title="Typography"
        description="Type scale, font weights, and line heights for display, heading, body, label, and caption styles."
        preview={<TypographyPreview />}
      />
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Exported Story                                                     */
/* ------------------------------------------------------------------ */

export const Welcome: Story = {
  render: () => (
    <div
      style={{
        backgroundColor: 'var(--ds-semantic-color-background-default-base)',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '64px 24px' }}>
        <Hero />
        <TokenArchitecture />
        <QuickStart />
        <FoundationGrid />
      </div>
    </div>
  ),
};
