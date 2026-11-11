import { Caption, Heading, Label, Text } from '../ui/Typography';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { LinkCard, LinkCardGrid } from '../docs';
import { expect, within } from 'storybook/test';
import { TextField } from '../ui/TextField';
import { Search } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

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
  background: 'var(--ds-semantic-color-background-default-hover)',
  padding: '2px 6px',
  borderRadius: '4px',
  fontSize: '13px',
};

const cardBase: React.CSSProperties = {
  backgroundColor: 'var(--ds-semantic-color-background-default-base)',
  borderRadius: 'var(--ds-radii-xl)',
  boxShadow: 'var(--ds-semantic-shadow-raised-base)',
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
      A shared language of colour, spacing, typography, and shape, and the accessible components
      built from it, that keeps every FitMySpace interface consistent and easy to evolve. This guide
      explains how the design tokens work and where to find each foundation and component.
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
      Our design tokens follow a three-tier architecture. Tier 1 holds the raw values — the core
      ingredients. Tier 2 provides purpose-driven semantic aliases. Tier 3 scopes those aliases down
      to highly specific component properties.
    </Text>
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'stretch',
      }}
    >
      <TierCard
        tier="Tier 1"
        label="Core Definitions"
        description="Literal values that define the palette. Never reference these directly in component code."
        examples={['--ds-color-sage-700', '--ds-radii-md', '--ds-spacing-4']}
        accent="var(--ds-semantic-color-text-brand-base)"
      />
      <ArrowConnector />
      <TierCard
        tier="Tier 2"
        label="Semantic Aliases"
        description="Intent-based names that reference Tier 1. These are what you use globally."
        examples={[
          '--ds-semantic-color-background-brand-base',
          '--ds-semantic-radii-interactive-md',
          '--ds-semantic-spacing-inset-md',
        ]}
        accent="var(--ds-semantic-color-text-brand-base)"
      />
      <ArrowConnector />
      <TierCard
        tier="Tier 3"
        label="Component Tokens"
        description="Highly scoped aliases for specific UI components. These tie semantic tokens to specific elements."
        examples={[
          '--ds-component-button-primary-focus-ring',
          '--ds-component-input-border-focus',
          '--ds-component-text-field-hint-text',
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
      <StepCard step={1} title="Use the right token tier">
        Always reach for a Tier 2 (Semantic) or Tier 3 (Component) variable. Instead of{' '}
        <code style={codeStyle}>background: #e3efe9</code>, write{' '}
        <code style={codeStyle}>background: var(--ds-semantic-color-background-brand-base)</code>.
        Semantic names tell future readers <em>why</em> the value exists.
      </StepCard>

      <StepCard step={2} title="Never hard-code values">
        Hard-coded pixels bypass the design system and break when core tokens change. If you find
        yourself writing a raw number, search the token list first — there is almost certainly an
        alias for what you need.
      </StepCard>

      <StepCard step={3} title="Rebuild after edits">
        After editing any <code style={codeStyle}>.json</code> file inside{' '}
        <code style={codeStyle}>tokens/</code>, run{' '}
        <code style={codeStyle}>npm run tokens:build</code> to regenerate the CSS custom properties.
        The generated <code style={codeStyle}>tokens.css</code> is committed to the repo so that
        every consumer stays in sync.
      </StepCard>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Foundation Navigation Cards                                        */
/* ------------------------------------------------------------------ */

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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        height: '32px',
        justifyContent: 'space-between',
      }}
    >
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
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      height: '32px',
      justifyContent: 'center',
    }}
  >
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

/* Size, border width, shadow, focus and motion previews read the semantic tokens they illustrate. */

const SizePreview = () => {
  const controlSizes = ['xs', 'sm', 'md', 'lg'];
  return (
    <div style={{ display: 'flex', gap: '8px', height: '32px', alignItems: 'flex-end' }}>
      {controlSizes.map((controlSize) => (
        <div
          key={controlSize}
          style={{
            width: '24px',
            // Half scale, so the largest control (56px) fits the 32px preview strip.
            height: `calc(var(--ds-semantic-size-control-${controlSize}) / 2)`,
            backgroundColor: 'var(--ds-semantic-color-background-brand-base)',
            borderRadius: 'var(--ds-radii-sm)',
          }}
        />
      ))}
    </div>
  );
};

const BorderWidthPreview = () => {
  const borderWidths = [
    'var(--ds-semantic-border-width-default)',
    'var(--ds-semantic-border-width-interactive)',
    'var(--ds-semantic-border-width-halo)',
  ];
  return (
    <div style={{ display: 'flex', gap: '8px', height: '32px', alignItems: 'center' }}>
      {borderWidths.map((borderWidth) => (
        <div
          key={borderWidth}
          style={{
            width: '32px',
            height: '32px',
            boxSizing: 'border-box',
            border: `${borderWidth} solid var(--ds-semantic-color-border-brand-base)`,
            borderRadius: 'var(--ds-radii-md)',
          }}
        />
      ))}
    </div>
  );
};

const ShadowPreview = () => {
  const elevations = [
    'var(--ds-semantic-shadow-raised-base)',
    'var(--ds-semantic-shadow-floating)',
    'var(--ds-semantic-shadow-overlay)',
  ];
  return (
    <div style={{ display: 'flex', gap: '16px', height: '32px', alignItems: 'center' }}>
      {elevations.map((elevation) => (
        <div
          key={elevation}
          style={{
            width: '40px',
            height: '24px',
            borderRadius: 'var(--ds-radii-md)',
            backgroundColor: 'var(--ds-semantic-color-background-default-base)',
            boxShadow: elevation,
            border: '1px solid var(--ds-semantic-color-border-default-base)',
          }}
        />
      ))}
    </div>
  );
};

const FocusPreview = () => (
  <div style={{ display: 'flex', height: '32px', alignItems: 'center', paddingLeft: '4px' }}>
    <div
      style={{
        width: '64px',
        height: '20px',
        borderRadius: 'var(--ds-radii-full)',
        backgroundColor: 'var(--ds-semantic-color-background-brand-base)',
        outline: 'var(--ds-semantic-focus-ring-width) solid var(--ds-semantic-focus-ring-color)',
        outlineOffset: 'var(--ds-semantic-focus-ring-offset)',
      }}
    />
  </div>
);

/** The standard easing curve, drawn with time on x and progress on y. */
const MotionPreview = () => (
  <svg width="48" height="32" viewBox="0 0 48 32" focusable="false" style={{ display: 'block' }}>
    <path
      d="M 0 32 C 9.6 32, 0 0, 48 0"
      fill="none"
      stroke="var(--ds-semantic-color-border-brand-base)"
      strokeWidth="2"
    />
  </svg>
);

const sectionIntroStyle: React.CSSProperties = {
  color: 'var(--ds-semantic-color-text-subtle-base)',
  display: 'block',
  marginBottom: '24px',
};

const FoundationGrid = () => (
  <section style={{ marginBottom: '56px' }}>
    <Heading level={3} size="sm" style={{ marginBottom: '8px' }}>
      Foundation Tokens
    </Heading>
    <Text size="sm" as="span" style={sectionIntroStyle}>
      Open a category to see every token with a live preview and a copy-ready CSS variable.
    </Text>
    <LinkCardGrid>
      <LinkCard
        headingLevel={4}
        path="/story/design-system-foundation-color--semantic-colors"
        title="Color"
        description="Core palettes and semantic colour roles for backgrounds, text, borders, and utility states."
        preview={<ColorPreview />}
      />
      <LinkCard
        headingLevel={4}
        path="/story/design-system-foundation-typography--type-scale"
        title="Typography"
        description="Display, heading, body, label, and caption styles, each with a one-line font shorthand."
        preview={<TypographyPreview />}
      />
      <LinkCard
        headingLevel={4}
        path="/story/design-system-foundation-spacing--semantic-spacing"
        title="Spacing"
        description="Inset, gap, and section tokens that control padding, element spacing, and page rhythm."
        preview={<SpacingPreview />}
      />
      <LinkCard
        headingLevel={4}
        path="/story/design-system-foundation-size--semantic-size"
        title="Size"
        description="Control heights, icon sizes, click targets, image slots, and layout widths."
        preview={<SizePreview />}
      />
      <LinkCard
        headingLevel={4}
        path="/story/design-system-foundation-radii--semantic-radii"
        title="Radii"
        description="Semantic border-radius tokens for interactive elements, containers, and surfaces."
        preview={<RadiiPreview />}
      />
      <LinkCard
        headingLevel={4}
        path="/story/design-system-foundation-border-width--semantic-border-width"
        title="Border Width"
        description="Stroke roles for outlines, selected items, current-item indicators, and focus halos."
        preview={<BorderWidthPreview />}
      />
      <LinkCard
        headingLevel={4}
        path="/story/design-system-foundation-shadow--semantic-shadow"
        title="Shadow"
        description="Soft, layered elevation from a resting card to a floating menu and an overlay dialog."
        preview={<ShadowPreview />}
      />
      <LinkCard
        headingLevel={4}
        path="/story/design-system-foundation-focus--focus-ring"
        title="Focus"
        description="The colour, width, and offsets of the keyboard focus ring, outside or inside the element."
        preview={<FocusPreview />}
      />
      <LinkCard
        headingLevel={4}
        path="/story/design-system-foundation-motion--semantic-motion"
        title="Motion"
        description="Durations and easing curves for transitions that answer the user, with reduced motion respected."
        preview={<MotionPreview />}
      />
    </LinkCardGrid>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Component Navigation Cards                                         */
/* ------------------------------------------------------------------ */

/*
 * The previews render the real components, so they never drift from
 * the library. LinkCard makes them inert and hides them from assistive
 * technology: they are pictures of the component, not controls.
 */

const ComponentGrid = () => (
  <section>
    <Heading level={3} size="sm" style={{ marginBottom: '8px' }}>
      Components
    </Heading>
    <Text size="sm" as="span" style={sectionIntroStyle}>
      Accessible building blocks made from the tokens above. Each page has live controls, every
      variant and state, and recipes for composing them.
    </Text>
    <LinkCardGrid>
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-actions-button--docs"
        title="Button"
        description="Actions in six variants, three appearances, and four sizes, with icon-only and link modes."
        preview={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="primary" appearance="fill" size="xs">
              Save
            </Button>
            <Button variant="primary" appearance="outline" size="xs">
              Cancel
            </Button>
          </div>
        }
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-forms-input--docs"
        title="Input"
        description="The bare text field: icons, a unit suffix, an end action, and invalid and disabled states."
        preview={
          <Input size="sm" aria-label="Search sample" placeholder="Search" iconStart={<Search />} />
        }
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-forms-textfield--docs"
        title="TextField"
        description="An Input with its label, hint, and error message wired together for assistive technology."
        preview={<TextField size="sm" label="Width" defaultValue="80" unit="cm" />}
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-typography-heading--docs"
        title="Typography"
        description="Heading, Text, Label, and Caption: the type scale as polymorphic components."
        preview={
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <Heading level={5} size="sm">
              Aa
            </Heading>
            <Text as="span" size="sm">
              Text
            </Text>
            <Label size="sm">Label</Label>
            <Caption>Caption</Caption>
          </div>
        }
      />
    </LinkCardGrid>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Exported Story                                                     */
/* ------------------------------------------------------------------ */

export const Welcome: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Landing page: token architecture, principles, and links to every foundation and component page.',
      },
    },
  },
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
        <ComponentGrid />
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Motion' })).toHaveAttribute(
      'href',
      './?path=/story/design-system-foundation-motion--semantic-motion',
    );
    await expect(canvas.getByRole('link', { name: 'Button' })).toHaveAttribute(
      'href',
      './?path=/docs/design-system-components-actions-button--docs',
    );
    // The component previews are pictures: their controls are not exposed.
    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
  },
};
