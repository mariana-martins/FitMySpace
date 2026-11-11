import {
  CopyTokenButton,
  formatTokenLabel,
  FoundationPage,
  getTokens,
  groupTokens,
  InlineCode,
  TokenGroup,
} from '../../docs';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { DocumentedToken } from '../../docs';
import { Text } from '../../ui/Typography';

const meta = {
  title: 'Design System/Foundation/Color',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const HEX_PATTERN = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;

/** WCAG relative luminance of a `#rrggbb` colour, or `null` for anything else. */
function relativeLuminance(colour: string): number | null {
  const channels = HEX_PATTERN.exec(colour)?.slice(1);
  if (!channels) return null;
  const [red, green, blue] = channels.map((channel) => {
    const intensity = parseInt(channel, 16) / 255;
    return intensity <= 0.04045 ? intensity / 12.92 : ((intensity + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(firstLuminance: number, secondLuminance: number): number {
  const [lighter, darker] = [firstLuminance, secondLuminance].sort(
    (first, second) => second - first,
  );
  return (lighter + 0.05) / (darker + 0.05);
}

const [defaultTextToken] = getTokens('semantic', 'color', 'text', 'default', 'base');
const [inverseTextToken] = getTokens('semantic', 'color', 'text', 'inverse');

/** The text token (default or inverse) with the higher contrast on the swatch. */
function sampleTextVariable(swatchColour: string): string {
  const swatchLuminance = relativeLuminance(swatchColour);
  const defaultLuminance = relativeLuminance(defaultTextToken.value);
  const inverseLuminance = relativeLuminance(inverseTextToken.value);
  if (swatchLuminance === null || defaultLuminance === null || inverseLuminance === null) {
    return defaultTextToken.name;
  }
  return contrastRatio(swatchLuminance, inverseLuminance) >
    contrastRatio(swatchLuminance, defaultLuminance)
    ? inverseTextToken.name
    : defaultTextToken.name;
}

// Helper components for the Storybook display
const ColorSwatch = ({
  token,
  label,
  showSample = false,
}: {
  token: DocumentedToken;
  label: string;
  showSample?: boolean;
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div
      style={{
        width: '100%',
        height: '60px',
        backgroundColor: `var(${token.name})`,
        borderRadius: 'var(--ds-radii-md)',
        border: '1px solid var(--ds-semantic-color-border-subtle-base)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: `var(${sampleTextVariable(token.value)})`,
        fontWeight: 500,
        fontSize: '1.25rem',
      }}
    >
      {showSample && 'Aa'}
    </div>
    <div>
      <Text size="sm" as="span" style={{ fontWeight: 600, display: 'block' }}>
        {label}
      </Text>
      <Text
        size="sm"
        as="span"
        style={{ color: 'var(--ds-semantic-color-text-subtle-base)', display: 'block' }}
      >
        {token.value}
      </Text>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '6px' }}>
        <code
          style={{
            flex: 1,
            minWidth: 0,
            paddingTop: '5px',
            fontFamily: 'monospace',
            fontSize: '12px',
            lineHeight: 1.5,
            color: 'var(--ds-semantic-color-text-subtle-base)',
            overflowWrap: 'anywhere',
          }}
        >
          var({token.name})
        </code>
        <CopyTokenButton variable={token.name} iconOnly />
      </div>
      {token.comment && (
        <Text
          size="sm"
          as="span"
          style={{
            color: 'var(--ds-semantic-color-text-subtle-base)',
            display: 'block',
            marginTop: '6px',
          }}
        >
          {token.comment}
        </Text>
      )}
    </div>
  </div>
);

const SwatchGrid = ({
  tokens,
  getLabel,
  showSample = false,
}: {
  tokens: DocumentedToken[];
  getLabel: (token: DocumentedToken) => string;
  showSample?: boolean;
}) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: '24px',
    }}
  >
    {tokens.map((token) => (
      <ColorSwatch key={token.name} token={token} label={getLabel(token)} showSample={showSample} />
    ))}
  </div>
);

/* --- Core Palettes --- */

const paletteRoles: Record<string, string> = {
  sage: 'Brand / Primary',
  charcoal: 'Neutral / Base',
  ocean: 'Information',
  honey: 'Warning',
  berry: 'Error / Destructive',
  jade: 'Success',
};

/** Single values such as white and black share one "Base" group instead of a palette each. */
function paletteKey(token: DocumentedToken): string {
  return token.path.length > 2 ? token.path[1] : 'base';
}

export const CorePalettes: Story = {
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
  render: () => (
    <FoundationPage
      title="Core Palettes"
      introduction={
        <>
          Core Palettes are the primitive building blocks of the design system (the absolute hex
          values). Think of them as the raw paint tubes in an artist&apos;s palette. You should{' '}
          <strong>almost never</strong> use these variables directly in your application code.
          Instead, rely on the <strong>Semantic Colors</strong> below, which act as smart aliases to
          these core values, ensuring your components automatically adapt to dark mode and theme
          changes without requiring complex media queries.
        </>
      }
    >
      {[...groupTokens(getTokens('color'), paletteKey)].map(([palette, tokens]) => (
        <TokenGroup
          key={palette}
          title={
            paletteRoles[palette]
              ? `${formatTokenLabel([palette])} (${paletteRoles[palette]})`
              : formatTokenLabel([palette])
          }
        >
          <SwatchGrid
            tokens={tokens}
            getLabel={(token) => formatTokenLabel(token.path.slice(1))}
            showSample
          />
        </TokenGroup>
      ))}
    </FoundationPage>
  ),
};

/* --- Semantic Colors --- */

const UTILITY_PREFIX = 'utility-';

const semanticGroupTitles: Record<string, string> = {
  background: 'Backgrounds',
  'background-utility': 'Utility Backgrounds',
  text: 'Text',
  'text-utility': 'Utility Text',
  border: 'Borders',
  'border-utility': 'Utility Borders',
  halo: 'Halo',
};

function isUtilityToken(token: DocumentedToken): boolean {
  return token.path[3].startsWith(UTILITY_PREFIX);
}

/** Splits each role (background, text, border) into its neutral and utility tokens. */
function semanticGroupKey(token: DocumentedToken): string {
  const role = token.path[2];
  return isUtilityToken(token) && role !== 'halo' ? `${role}-utility` : role;
}

function semanticLabel(token: DocumentedToken): string {
  const [variant, ...state] = token.path.slice(3);
  const isUtilityGroup = isUtilityToken(token) && token.path[2] !== 'halo';
  return formatTokenLabel([
    isUtilityGroup ? variant.slice(UTILITY_PREFIX.length) : variant,
    ...state,
  ]);
}

export const SemanticColors: Story = {
  render: () => (
    <FoundationPage
      title="Semantic Colors"
      introduction={
        <>
          Semantic Colors express the <strong>intent</strong> of an element rather than its actual
          hue. For example, <InlineCode>background-brand-base</InlineCode> tells you <em>why</em>{' '}
          the color is used, not <em>what</em> color it is. By exclusively using Semantic Colors in
          your CSS, you guarantee that your components will seamlessly invert during Dark Mode (when
          available) and automatically inherit any future rebranding efforts (like changing the
          primary brand color) without modifying a single line of component code.
        </>
      }
    >
      {[...groupTokens(getTokens('semantic', 'color'), semanticGroupKey)].map(
        ([groupKey, tokens]) => (
          <TokenGroup key={groupKey} title={semanticGroupTitles[groupKey] ?? groupKey}>
            <SwatchGrid tokens={tokens} getLabel={semanticLabel} />
          </TokenGroup>
        ),
      )}
    </FoundationPage>
  ),
};
