import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { Icon } from './';
import { Heading, Text } from '../Typography';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleArrowDown,
  Clock,
  Download,
  ExternalLink,
  Heart,
  Home,
  Menu,
  Plus,
  Ruler,
  Search,
  SearchAlert,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Tag,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const meta = {
  title: 'Design System/Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: {
    icon: Home,
    size: 'md',
    color: 'default',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Icon` component is a **mandatory wrapper** for rendering icons from `lucide-react`. ' +
          'It enforces our Design System\'s Tier 3 tokens for consistent sizing and color, and handles ' +
          'accessibility automatically.\n\n' +
          '### Why Use This Wrapper?\n' +
          '- **Token Enforcement:** Sizes and colors are strictly controlled by Design System tokens — ' +
          'no raw pixels or hex values leak into your components.\n' +
          '- **Smart Accessibility:** When `aria-label` is omitted, the icon is automatically marked as ' +
          'decorative (`aria-hidden="true"`). When provided, it becomes meaningful (`role="img"`).\n' +
          '- **Consistency:** All icons across the application share the same visual language.\n\n' +
          '> ⚠️ **Rule:** Never import Lucide icons directly into your components. ' +
          'Always use `<Icon icon={IconName} size="..." color="..." />`.',
      },
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  args: {
    icon: Home,
    size: 'md',
    color: 'default',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'Maps to Tier 3 icon size tokens.',
    },
    color: {
      control: { type: 'select' },
      options: [
        'default',
        'primary',
        'subtle',
        'inverse',
        'disabled',
        'error',
        'success',
        'warning',
        'information',
      ],
      description: 'Maps to Tier 3 semantic color tokens.',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the controls below to experiment with all possible combinations of props.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const icon = canvas.getByRole('presentation', { hidden: true });
    await expect(icon).toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * All Sizes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  name: 'All Sizes',
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <div
          key={size}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Icon icon={Home} size={size} color="default" />
          <Text size="sm" as="span" style={{ fontFamily: 'monospace' }}>
            {size}
          </Text>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The four size tokens: `sm` (16px), `md` (20px), `lg` (24px), and `xl` (30px). ' +
          'Values are driven by `--ds-component-icon-size-*` CSS variables.',
      },
    },
  },
};

/* ---------------------------------------------------------------
 * All Colors
 * --------------------------------------------------------------- */

export const AllColors: Story = {
  name: 'All Colors',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center' }}>
      {(
        [
          'default',
          'primary',
          'subtle',
          'disabled',
          'error',
          'success',
          'warning',
          'information',
        ] as const
      ).map((color) => (
        <div
          key={color}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Icon icon={Heart} size="lg" color={color} />
          <Text size="sm" as="span" style={{ fontFamily: 'monospace' }}>
            {color}
          </Text>
        </div>
      ))}
      {/* Inverse on dark background */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'var(--ds-semantic-color-background-brand-base)',
          padding: '0.75rem',
          borderRadius: 'var(--ds-radii-md)',
        }}
      >
        <Icon icon={Heart} size="lg" color="inverse" />
        <Text
          size="sm"
          as="span"
          style={{
            fontFamily: 'monospace',
            color: 'var(--ds-semantic-color-text-inverse)',
          }}
        >
          inverse
        </Text>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'All 9 semantic color variants. The `inverse` variant is shown on a dark background ' +
          'to demonstrate proper contrast. Colors are driven by `--ds-component-icon-color-*` CSS variables.',
      },
    },
  },
};

/* ---------------------------------------------------------------
 * Accessible Icon (meaningful)
 * --------------------------------------------------------------- */

export const AccessibleIcon: Story = {
  name: 'Accessibility: Meaningful Icon',
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon icon={Search} size="lg" color="default" aria-label="Search products" />
        <Text size="sm" as="span" style={{ fontFamily: 'monospace' }}>
          aria-label ✓
        </Text>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <Icon icon={Home} size="lg" color="default" />
        <Text size="sm" as="span" style={{ fontFamily: 'monospace' }}>
          decorative (hidden)
        </Text>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'When `aria-label` is provided, the icon receives `role="img"` and becomes visible to ' +
          'screen readers. When omitted, `aria-hidden="true"` is applied automatically, treating it as decorative.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const meaningfulIcon = canvas.getByRole('img', { name: 'Search products' });
    await expect(meaningfulIcon).toHaveAttribute('aria-label', 'Search products');
  },
};

/* ---------------------------------------------------------------
 * Icon Gallery — Click to Copy
 * --------------------------------------------------------------- */

const APPROVED_ICONS: { name: string; component: LucideIcon }[] = [
  { name: 'ArrowLeft', component: ArrowLeft },
  { name: 'ArrowRight', component: ArrowRight },
  { name: 'ChevronDown', component: ChevronDown },
  { name: 'ChevronLeft', component: ChevronLeft },
  { name: 'ChevronRight', component: ChevronRight },
  { name: 'CircleArrowDown', component: CircleArrowDown },
  { name: 'Clock', component: Clock },
  { name: 'Download', component: Download },
  { name: 'ExternalLink', component: ExternalLink },
  { name: 'Heart', component: Heart },
  { name: 'Home', component: Home },
  { name: 'Menu', component: Menu },
  { name: 'Plus', component: Plus },
  { name: 'Ruler', component: Ruler },
  { name: 'Search', component: Search },
  { name: 'SearchAlert', component: SearchAlert },
  { name: 'ShoppingBag', component: ShoppingBag },
  { name: 'Sparkles', component: Sparkles },
  { name: 'Star', component: Star },
  { name: 'Store', component: Store },
  { name: 'Tag', component: Tag },
  { name: 'Trash2', component: Trash2 },
  { name: 'X', component: X },
  { name: 'Zap', component: Zap },
];

const IconCard = ({ name, component: LucideComp }: { name: string; component: LucideIcon }) => {
  const { copied, copy } = useCopyToClipboard();
  const snippet = `<Icon icon={${name}} />`;

  const handleCopy = () => copy(snippet);

  return (
    <button
      onClick={handleCopy}
      title={`Copy ${snippet}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '20px 12px',
        border: '1px solid var(--ds-semantic-color-border-subtle-base)',
        borderRadius: 'var(--ds-radii-md)',
        backgroundColor: copied
          ? 'var(--ds-semantic-color-background-utility-success-base)'
          : 'var(--ds-semantic-color-background-default-base)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        minWidth: '120px',
      }}
    >
      <Icon icon={LucideComp} size="lg" color={copied ? 'inverse' : 'default'} />
      <span
        style={{
          fontSize: '12px',
          fontFamily: 'monospace',
          fontWeight: 600,
          color: copied
            ? 'var(--ds-semantic-color-text-inverse)'
            : 'var(--ds-semantic-color-text-default-base)',
          transition: 'color 0.2s ease',
        }}
      >
        {copied ? 'Copied!' : name}
      </span>
    </button>
  );
};

export const IconGallery: Story = {
  name: 'Gallery & Click to Copy',
  render: () => (
    <div
      style={{
        backgroundColor: 'var(--ds-semantic-color-background-default-base)',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '64px 24px' }}>
        <Heading level={2} size="md" style={{ marginBottom: '16px' }}>
          Icon Gallery
        </Heading>
        <Text
          size="md"
          style={{
            marginBottom: '48px',
            color: 'var(--ds-semantic-color-text-subtle-base)',
            display: 'block',
          }}
        >
          These are the{' '}
          <strong>{APPROVED_ICONS.length} approved icons</strong> from{' '}
          <code
            style={{
              fontFamily: 'monospace',
              background: 'var(--ds-semantic-color-background-default-hover)',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            lucide-react
          </code>{' '}
          used in FitMySpace. Click any card to copy its{' '}
          <code
            style={{
              fontFamily: 'monospace',
              background: 'var(--ds-semantic-color-background-default-hover)',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            {'<Icon />'}
          </code>{' '}
          usage snippet to your clipboard. Never import Lucide icons directly — always use the{' '}
          <strong>Icon wrapper</strong> to guarantee token compliance and accessibility.
        </Text>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '16px',
          }}
        >
          {APPROVED_ICONS.map(({ name, component }) => (
            <IconCard key={name} name={name} component={component} />
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'A visual catalog of every approved Lucide icon in the project. ' +
          'Click on any card to copy the `<Icon icon={Name} />` snippet to your clipboard.',
      },
    },
  },
};
