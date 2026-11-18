import { Pagination, PaginationEllipsis, PaginationItem, PaginationLink } from '../ui/Pagination';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '../ui/Breadcrumb';
import { Caption, Heading, Label, Text } from '../ui/Typography';
import { LinkCard, LinkCardGrid, StorybookLink } from '../docs';
import { RadioGroup, RadioGroupItem } from '../ui/RadioGroup';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Tabs, TabsList, TabsTrigger } from '../ui/Tabs';
import { TextareaField } from '../ui/TextareaField';
import { version } from '../../../../package.json';
import { SelectField } from '../ui/SelectField';
import { SearchField } from '../ui/SearchField';
import { expect, within } from 'storybook/test';
import { EmptyState } from '../ui/EmptyState';
import { TextField } from '../ui/TextField';
import { List, ListItem } from '../ui/List';
import { DS_ICONS, Icon } from '../ui/Icon';
import { Skeleton } from '../ui/Skeleton';
import { Checkbox } from '../ui/Checkbox';
import { SelectItem } from '../ui/Select';
import { Switch } from '../ui/Switch';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Alert } from '../ui/Alert';
import { Link } from '../ui/Link';
import { Chip } from '../ui/Chip';
import { Card } from '../ui/Card';

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
  background: 'var(--ds-semantic-colour-background-default-hover)',
  padding: '0 4px',
  borderRadius: '4px',
  fontSize: '12px',
};

const cardBase: React.CSSProperties = {
  backgroundColor: 'var(--ds-semantic-colour-background-default-base)',
  borderRadius: 'var(--ds-radii-xl)',
  boxShadow: 'var(--ds-semantic-shadow-card-base)',
  border: '1px solid var(--ds-semantic-colour-border-subtle-base)',
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
        backgroundColor: 'var(--ds-semantic-colour-background-brand-base)',
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
        color: 'var(--ds-semantic-colour-text-subtle-base)',
        display: 'block',
        maxWidth: '640px',
        textWrap: 'pretty',
      }}
    >
      A shared language of colour, spacing, typography, and shape, and the accessible components
      built from it, that keeps every FitMySpace interface consistent and easy to evolve. This guide
      explains how the design tokens work and where to find each foundation and component.
    </Text>

    <Text
      size="sm"
      style={{
        color: 'var(--ds-semantic-colour-text-subtle-base)',
        display: 'block',
        marginTop: '16px',
      }}
    >
      Version {version}
      {' · '}
      <StorybookLink path="/docs/design-system-changelog--docs">See what&apos;s new</StorybookLink>
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
        color: 'var(--ds-semantic-colour-text-subtle-base)',
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
        gap: '4px',
      }}
    >
      {examples.map((ex) => (
        <code
          key={ex}
          style={{ ...codeStyle, display: 'block', width: 'fit-content', padding: '4px 8px' }}
        >
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
        color: 'var(--ds-semantic-colour-text-subtle-base)',
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
        color: 'var(--ds-semantic-colour-text-subtle-base)',
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
        examples={['--ds-colour-sage-700', '--ds-radii-md', '--ds-spacing-4']}
        accent="var(--ds-semantic-colour-text-brand-base)"
      />
      <ArrowConnector />
      <TierCard
        tier="Tier 2"
        label="Semantic Aliases"
        description="Intent-based names that reference Tier 1. These are what you use globally."
        examples={[
          '--ds-semantic-colour-background-brand-base',
          '--ds-semantic-radii-interactive-md',
          '--ds-semantic-spacing-inset-md',
        ]}
        accent="var(--ds-semantic-colour-text-brand-base)"
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
        accent="var(--ds-semantic-colour-text-brand-base)"
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
        backgroundColor: 'var(--ds-semantic-colour-background-brand-base)',
        color: 'var(--ds-semantic-colour-text-inverse)',
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
        color: 'var(--ds-semantic-colour-text-subtle-base)',
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
        color: 'var(--ds-semantic-colour-text-subtle-base)',
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
        <code style={codeStyle}>background: var(--ds-semantic-colour-background-brand-base)</code>.
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

const ColourPreview = () => {
  const colours = [
    'var(--ds-colour-sage-400)',
    'var(--ds-colour-sage-600)',
    'var(--ds-colour-sage-800)',
    'var(--ds-colour-charcoal-300)',
    'var(--ds-colour-ocean-500)',
    'var(--ds-colour-honey-400)',
    'var(--ds-colour-berry-500)',
  ];
  return (
    <div style={{ display: 'flex', gap: '4px', height: '32px' }}>
      {colours.map((colour) => (
        <div
          key={colour}
          style={{
            flex: 1,
            backgroundColor: colour,
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
            height: '4px',
            backgroundColor: 'var(--ds-semantic-colour-background-brand-base)',
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
            backgroundColor: 'var(--ds-semantic-colour-background-brand-base)',
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
      height: '32px',
      justifyContent: 'center',
    }}
  >
    <div
      style={{
        fontSize: '18px',
        fontWeight: 700,
        color: 'var(--ds-semantic-colour-text-default-base)',
        lineHeight: 1,
      }}
    >
      Aa
    </div>
    <div
      style={{
        font: 'var(--ds-semantic-typography-caption-md-shorthand)',
        letterSpacing: 'var(--ds-semantic-typography-caption-md-letter-spacing)',
        color: 'var(--ds-semantic-colour-text-subtle-base)',
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
            backgroundColor: 'var(--ds-semantic-colour-background-brand-base)',
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
            border: `${borderWidth} solid var(--ds-semantic-colour-border-brand-base)`,
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
            backgroundColor: 'var(--ds-semantic-colour-background-default-base)',
            boxShadow: elevation,
            border: '1px solid var(--ds-semantic-colour-border-default-base)',
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
        backgroundColor: 'var(--ds-semantic-colour-background-brand-base)',
        outline: 'var(--ds-semantic-focus-ring-width) solid var(--ds-semantic-focus-ring-colour)',
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
      stroke="var(--ds-semantic-colour-border-brand-base)"
      strokeWidth="2"
    />
  </svg>
);

const sectionIntroStyle: React.CSSProperties = {
  color: 'var(--ds-semantic-colour-text-subtle-base)',
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
        path="/story/design-system-foundation-colour--semantic-colours"
        title="Colour"
        description="Core palettes and semantic colour roles for backgrounds, text, borders, and utility states."
        preview={<ColourPreview />}
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
        path="/docs/design-system-components-actions-chip--docs"
        title="Chip"
        description="Toggle buttons for filters, announced as pressed, with a check mark when selected."
        preview={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Chip size="sm" selected>
              Kitchen
            </Chip>
            <Chip size="sm" selected={false}>
              Bathroom
            </Chip>
          </div>
        }
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-forms-input--docs"
        title="Input"
        description="The bare text field: icons, a unit suffix, an end action, and invalid and disabled states."
        preview={
          <Input size="sm" aria-label="Search sample" placeholder="Search" iconStart="search" />
        }
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-forms-selectfield--docs"
        title="Select"
        description="A single-choice field with a styled list of options, alone or with its label, hint, and error."
        preview={
          <SelectField size="sm" label="Room" defaultValue="kitchen">
            <SelectItem value="kitchen">Kitchen</SelectItem>
          </SelectField>
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
        path="/docs/design-system-components-forms-textareafield--docs"
        title="Textarea"
        description="The same box for long answers, with its label, hint, and error message wired together."
        preview={
          <TextareaField size="sm" label="Assembly notes" rows={2} defaultValue="Two people" />
        }
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-forms-checkbox--docs"
        title="Checkbox"
        description="A Radix checkbox with its label, hint, and error, plus a mixed state for select-all groups."
        preview={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Checkbox size="sm" label="Waterproof" defaultChecked />
            <Checkbox size="sm" label="Stackable" />
          </div>
        }
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-forms-switch--docs"
        title="Switch"
        description="A Radix switch for settings that apply the moment they are flipped, with label, hint, and error."
        preview={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Switch size="sm" label="Order updates" defaultChecked />
            <Switch size="sm" label="Price alerts" />
          </div>
        }
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-forms-radiogroup--docs"
        title="RadioGroup"
        description="One choice from a few options, with a visible group label, option hints, and an error message."
        preview={
          <RadioGroup size="sm" label="Delivery" defaultValue="standard">
            <RadioGroupItem value="standard" label="Standard" />
            <RadioGroupItem value="express" label="Express" />
          </RadioGroup>
        }
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-forms-searchfield--docs"
        title="SearchField"
        description="A search form with a visible label, a Clear button, and a Search button, named as a search landmark."
        preview={<SearchField size="sm" label="Search products" defaultValue="basket" />}
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-navigation-link--docs"
        title="Link"
        description="Inline links inside text, and standalone links with an underline that slides in on hover."
        preview={
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link href="#recent" appearance="standalone" aria-current="page">
              Recent arrivals
            </Link>
            <Link href="#about" appearance="standalone">
              About us
            </Link>
          </div>
        }
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-navigation-skiplink--docs"
        title="SkipLink"
        description="The first link of every page: out of sight until focused, it jumps past the header to the content."
        preview={
          <span
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--ds-component-skip-link-shape-radii)',
              backgroundColor: 'var(--ds-component-skip-link-background)',
              color: 'var(--ds-component-skip-link-text)',
              font: 'var(--ds-semantic-typography-control-md-shorthand)',
            }}
          >
            Skip to content
          </span>
        }
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-navigation-breadcrumb--docs"
        title="Breadcrumb"
        description="The trail of ancestor pages, from Home to the page people are on."
        preview={
          <Breadcrumb size="sm">
            <BreadcrumbItem>
              <BreadcrumbLink href="#home" home>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="#bathroom" aria-current="page">
                Bathroom
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        }
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-navigation-pagination--docs"
        title="Pagination"
        description="Links to every page of a long list, with the current page marked and the rest folded into ellipses."
        preview={
          <Pagination size="sm">
            <PaginationItem>
              <PaginationLink page={1} href="#page-1" aria-current="page" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink page={2} href="#page-2" />
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink page={9} href="#page-9" />
            </PaginationItem>
          </Pagination>
        }
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-navigation-tabs--docs"
        title="Tabs"
        description="A few views of one subject, one at a time: the selected tab marked by darker text and a sage bar, the arrow keys moving along the row."
        preview={
          <Tabs defaultValue="details">
            <TabsList aria-label="Product information" size="sm">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="measurements">Measurements</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-display-badge--docs"
        title="Badge"
        description="Short status and category labels in six variants, soft or filled, as pills or rounded tags."
        preview={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Badge variant="success" appearance="soft" size="sm">
              In stock
            </Badge>
            <Badge variant="secondary" appearance="soft" size="sm" shape="rounded">
              IKEA
            </Badge>
          </div>
        }
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-display-card--docs"
        title="Card"
        description="A surface for one item, composed with media, text, and a link that makes the whole card clickable."
        preview={
          <Card padding="sm" style={{ width: '120px' }}>
            <Skeleton shape="rectangle" height="40px" />
            <Text size="sm" style={{ margin: 0 }}>
              Oak shelf
            </Text>
          </Card>
        }
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-display-list--docs"
        title="List"
        description="Rows about one kind of thing, each with an icon or picture, a title, a description, and an action."
        preview={
          <List size="sm" appearance="outline" style={{ width: '200px' }}>
            <ListItem icon="bath">Bathroom</ListItem>
            <ListItem icon="bed">Bedroom</ListItem>
          </List>
        }
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-display-skeleton--docs"
        title="Skeleton"
        description="Calm, pulsing placeholders that hold the shape of content while it loads."
        preview={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '160px' }}>
            <Skeleton shape="circle" width="32px" />
            <Skeleton lines={2} size="sm" />
          </div>
        }
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-display-emptystate--docs"
        title="EmptyState"
        description="What to show when a list has nothing in it: what happened and what to do next."
        preview={<EmptyState title="No products found" headingLevel={5} style={{ padding: 0 }} />}
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-display-icon--docs"
        title="Icon"
        description="The box every icon is drawn in: centred, never squeezed, and quiet unless the icon is the only thing that says it."
        preview={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Icon size="md">{DS_ICONS['map-pin'].icon}</Icon>
            <Icon size="md">{DS_ICONS.home.icon}</Icon>
            <Icon size="lg">{DS_ICONS.ruler.icon}</Icon>
          </div>
        }
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-feedback-alert--docs"
        title="Alert"
        description="Status messages in the four utility colours, announced through a live region."
        preview={<Alert variant="success">Room saved.</Alert>}
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-feedback-toast--docs"
        title="Toast"
        description="What happened while the reader was elsewhere, in a card that waits to be dismissed."
        preview={
          /* Drawn by hand: the real card appears in the viewport fixed to the
             corner of the screen, never inside a card on the page. */
          <div
            style={{
              width: '220px',
              display: 'flex',
              gap: 'var(--ds-component-toast-spacing-icon-gap)',
              padding: 'var(--ds-component-toast-spacing-padding)',
              borderRadius: 'var(--ds-component-toast-shape-radii)',
              border:
                'var(--ds-component-toast-shape-border-width) solid var(--ds-component-toast-success-border)',
              backgroundColor: 'var(--ds-component-toast-success-background)',
              color: 'var(--ds-component-toast-success-text)',
              boxShadow: 'var(--ds-component-toast-shadow)',
              font: 'var(--ds-semantic-typography-body-md-shorthand)',
              letterSpacing: 'var(--ds-semantic-typography-body-md-letter-spacing)',
            }}
          >
            <Icon>{DS_ICONS['circle-check'].icon}</Icon>
            <div>
              <div
                style={{
                  font: 'var(--ds-semantic-typography-heading-sm-shorthand)',
                  letterSpacing: 'var(--ds-semantic-typography-heading-sm-letter-spacing)',
                }}
              >
                Room saved
              </div>
              <div>The name shows up in your list of rooms.</div>
            </div>
          </div>
        }
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-overlays-dialog--docs"
        title="Dialog"
        description="A form or a confirmation that interrupts the page, with the header and actions fixed and only the body scrolling."
        preview={
          /* Drawn by hand: the real dialog opens in a portal at the end of <body>,
             so it cannot sit inside a card. */
          <div
            style={{
              width: '160px',
              padding: '12px',
              borderRadius: 'var(--ds-semantic-radii-container-lg)',
              border: '1px solid var(--ds-semantic-colour-border-default-base)',
              backgroundColor: 'var(--ds-component-dialog-background)',
              boxShadow: 'var(--ds-semantic-shadow-overlay)',
            }}
          >
            <Heading level={5} size="sm">
              Edit room
            </Heading>
            <Text as="p" size="sm">
              The name shows up in your list of rooms.
            </Text>
          </div>
        }
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-overlays-alertdialog--docs"
        title="AlertDialog"
        description="A question that must be answered before going back: the safe answer starts focused, and clicking past it does not dismiss it."
        preview={
          /* Drawn by hand: the real alert dialog opens in a portal at the end of
             <body>, and it only appears where a click would cost something. */
          <div
            style={{
              width: '160px',
              padding: '12px',
              borderRadius: 'var(--ds-semantic-radii-container-lg)',
              border: '1px solid var(--ds-semantic-colour-border-default-base)',
              backgroundColor: 'var(--ds-component-alert-dialog-background)',
              boxShadow: 'var(--ds-semantic-shadow-overlay)',
            }}
          >
            <Heading level={5} size="sm">
              Delete “Bedroom”?
            </Heading>
            <Text as="p" size="sm">
              This removes 12 saved items.
            </Text>
          </div>
        }
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-overlays-popover--docs"
        title="Popover"
        description="A small panel of controls under the button that opened it, with the page still usable behind it."
        preview={
          /* Drawn by hand: the real popover opens in a portal at the end of <body>. */
          <div
            style={{
              width: '160px',
              padding: '12px',
              borderRadius: 'var(--ds-component-popover-shape-radii)',
              border: '1px solid var(--ds-component-popover-border)',
              backgroundColor: 'var(--ds-component-popover-background)',
              boxShadow: 'var(--ds-component-popover-shadow)',
            }}
          >
            <Heading level={5} size="sm">
              Stores
            </Heading>
            <Text as="p" size="sm">
              IKEA, Kmart, Etna
            </Text>
          </div>
        }
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-overlays-sheet--docs"
        title="Sheet"
        description="A modal panel that slides in from an edge: the menu and the filters on a phone, a strip of the page always in sight."
        preview={
          /* Drawn by hand: the real sheet opens in a portal at the end of <body>. */
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '160px',
              height: '96px',
              borderRadius: 'var(--ds-semantic-radii-container-md)',
              backgroundColor: 'var(--ds-semantic-colour-background-scrim)',
            }}
          >
            <div
              style={{
                width: '112px',
                padding: '12px',
                borderStartStartRadius: 'var(--ds-component-sheet-shape-radii)',
                borderEndStartRadius: 'var(--ds-component-sheet-shape-radii)',
                backgroundColor: 'var(--ds-component-sheet-background)',
                boxShadow: 'var(--ds-component-sheet-shadow)',
              }}
            >
              <Heading level={5} size="sm">
                Filters
              </Heading>
            </div>
          </div>
        }
      />
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-overlays-tooltip--docs"
        title="Tooltip"
        description="One short thought on a control, shown on hover or focus — never for information the reader needs."
        preview={
          /* Drawn by hand: the real bubble opens in a portal at the end of <body>,
             and only while its control is hovered or focused. */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <div
              style={{
                maxWidth: '160px',
                padding: '8px 12px',
                borderRadius: 'var(--ds-component-tooltip-shape-radii)',
                backgroundColor: 'var(--ds-component-tooltip-background)',
                color: 'var(--ds-component-tooltip-text)',
                boxShadow: 'var(--ds-component-tooltip-shadow)',
                font: 'var(--ds-semantic-typography-body-sm-shorthand)',
                letterSpacing: 'var(--ds-semantic-typography-body-sm-letter-spacing)',
              }}
            >
              Opens the filters for this search.
            </div>
            <Button variant="secondary" appearance="outline" size="sm">
              Filters
            </Button>
          </div>
        }
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
      <LinkCard
        headingLevel={4}
        path="/docs/design-system-components-utilities-visuallyhidden--docs"
        title="VisuallyHidden"
        description="Words only screen readers need: when to add them, and how they differ from aria-hidden and hidden."
        preview={
          <Text size="sm" as="span">
            Remove <span style={{ opacity: 0.4 }}>Oak wall shelf</span>
          </Text>
        }
      />
    </LinkCardGrid>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Patterns                                                           */
/* ------------------------------------------------------------------ */

const PatternsSection = () => (
  <section style={{ marginTop: '56px' }}>
    <Heading level={3} size="sm" style={{ marginBottom: '8px' }}>
      Patterns
    </Heading>
    <Text size="sm" as="span" style={sectionIntroStyle}>
      Recipes that put several components together into a piece of a page, such as a search page or
      a product grid, with the code to copy.{' '}
      <StorybookLink path="/story/design-system-patterns-overview--overview">
        See all patterns
      </StorybookLink>
    </Text>
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
          'Landing page: token architecture, principles, and links to every foundation and component page, and to the patterns.',
      },
    },
  },
  render: () => (
    <div
      style={{
        backgroundColor: 'var(--ds-semantic-colour-background-default-base)',
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
        <PatternsSection />
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
    await expect(canvas.getByRole('link', { name: 'See all patterns' })).toHaveAttribute(
      'href',
      './?path=/story/design-system-patterns-overview--overview',
    );
    // The version comes from package.json, so only the link is checked here.
    await expect(canvas.getByRole('link', { name: "See what's new" })).toHaveAttribute(
      'href',
      './?path=/docs/design-system-changelog--docs',
    );
    // The component previews are pictures: their controls are not exposed.
    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('checkbox')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('radiogroup')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('combobox')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: 'Kitchen' })).not.toBeInTheDocument();
  },
};
