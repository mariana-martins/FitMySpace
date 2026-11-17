import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { Caption, Text } from '../Typography';
import { formatTokenLabel } from '../../docs';
import { DS_ICONS, Icon } from './';
import { Button } from '../Button';
import { Badge } from '../Badge';

import type { IconName } from './';

/* ---------------------------------------------------------------
 * Icon
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Components/Display/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: {
    size: 'md',
    label: '',
  },
  parameters: {
    docs: {
      description: {
        component:
          'An `Icon` is the box an icon is drawn in. It centres the SVG, keeps the row from squeezing it, and decides whether assistive technology sees it. It draws nothing itself and holds no state, so it renders on the server.\n\n' +
          'Icons are decoration. MDN names icons as the case for `aria-hidden="true"`: exposing an icon the visible text already names reads the same thought twice, and reads a wrong one when the icon means something else. So the box is hidden unless you name it.\n\n' +
          '### Best Practices\n' +
          '- **Leave `label` out beside text:** inside a `Button`, a `Badge`, a field or before a heading, the words already carry the meaning and the icon must stay quiet.\n' +
          '- **Name it only when it stands alone:** a column of icons with no words, a map marker with no caption. `label` makes the box one image with a name, so the SVG inside is never read out piece by piece.\n' +
          '- **Never make the box focusable:** an `aria-hidden` element that takes focus is a dead stop for a keyboard reader. The box is a `<span>`; the control that owns the icon is the focusable thing.\n' +
          '- **Pick the size by the text beside it:** `xs` with a caption, `sm` with small body text or a label, `md` with body text and any `md` control, `lg` with a heading.\n' +
          '- **Take the colour of the words:** the icons are stroked in `currentColor`, so an icon takes the colour of the text it belongs to. Giving one its own colour breaks the pair apart.\n' +
          '- **The set lives in one file:** every icon comes from `icons.tsx`, which is also what the gallery below renders. A component asks for one by name, so nothing can drift from the list.\n\n' +
          '### Key Features\n' +
          '- **One box for every component** — the `flex-shrink: 0` square and the `> svg { 100% }` rule that ten stylesheets used to repeat.\n' +
          '- **Token sizes** — `component.icon.size.*` over `semantic.size.icon.*` (12 / 16 / 20 / 24px).\n' +
          '- **Yours or theirs** — write `--icon-size` in the class you pass and the box keeps using your component token, which is how `Badge` and `Select` size their own icons.\n' +
          '- **Named when it has to be** — `label` sets `role="img"` and `aria-label`; `aria-hidden` is not in the props, because writing it beside a label would hide the name.\n' +
          '- **Server-rendered** — no state and no client hooks.',
      },
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

const ICON_NAMES = Object.keys(DS_ICONS) as IconName[];

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  args: {
    size: 'md',
    label: '',
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['xs', 'sm', 'md', 'lg'],
      description:
        'The box size, from `component.icon.size.*`. Leave it out to take `md`, or write `--icon-size` in your own class to keep a component token.',
    },
    label: {
      control: { type: 'text' },
      description:
        'The name, for when the icon is the only thing that says it. Empty keeps the icon hidden from assistive technology, which is right beside text.',
    },
    children: {
      control: false,
      description: 'The icon to draw, taken from the registry.',
    },
  },
  render: (args) => (
    <div style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Icon {...args}>{DS_ICONS['map-pin'].icon}</Icon>
      <Text size="sm">Room · Rua do Alecrim, 12</Text>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use the controls below to experiment with all possible combinations of props. The icon sits next to the words it belongs to, so it is hidden by default: type a `label` to see the box become one named image instead.',
      },
      source: {
        code: `<Icon size="md">{DS_ICONS['map-pin'].icon}</Icon>
<Text size="sm">Room · Rua do Alecrim, 12</Text>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Resting state: the icon is drawn, and the text next to it is the only name.
    await expect(canvas.getByText('Room · Rua do Alecrim, 12')).toBeVisible();
    await expect(canvas.queryByRole('img')).not.toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * All sizes
 * --------------------------------------------------------------- */

const SIZES = ['xs', 'sm', 'md', 'lg'] as const;

export const AllSizes: Story = {
  render: () => (
    <div style={{ padding: '32px', display: 'flex', alignItems: 'flex-end', gap: '32px' }}>
      {SIZES.map((size) => (
        <div key={size} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Icon size={size}>{DS_ICONS.ruler.icon}</Icon>
          <Caption>
            {size} · {size === 'xs' ? '12' : size === 'sm' ? '16' : size === 'md' ? '20' : '24'}px
          </Caption>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Four boxes on the icon scale, each one the size of the text it is meant to sit beside: `xs` with a caption, `sm` with small body text or a label, `md` with body text and a `md` control, `lg` with a heading. The box is square and the SVG fills it, so the number is both the width and the height.',
      },
      source: {
        code: `<Icon size="xs">…</Icon>
<Icon size="sm">…</Icon>
<Icon size="md">…</Icon>
<Icon size="lg">…</Icon>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('xs · 12px')).toBeVisible();
    await expect(canvas.getByText('lg · 24px')).toBeVisible();
  },
};

/* ---------------------------------------------------------------
 * Used in the design system (the registry)
 * --------------------------------------------------------------- */

export const UsedInTheDesignSystem: Story = {
  render: () => (
    <div style={{ padding: '32px' }}>
      <Text size="sm" as="span" style={{ display: 'block', marginBlockEnd: '24px' }}>
        Every icon the design system ships, read from the same registry the components draw from.
        Under each name is who draws it: a component that uses it on its own, or only the stories,
        where it is example content you can still pick by name.
      </Text>
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '24px',
        }}
      >
        {ICON_NAMES.map((name) => (
          <li key={name} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Icon size="md">{DS_ICONS[name].icon}</Icon>
            <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <Text size="sm" as="span">
                {formatTokenLabel(name.split('-'))}
              </Text>
              <Caption>{DS_ICONS[name].usedIn}</Caption>
            </span>
          </li>
        ))}
      </ul>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'This list is not written out: the story renders `DS_ICONS`, so a new icon added for a component shows up here on its own, and an icon nobody draws any more would have to be deleted from the registry to leave. It is also the whole set a component may be given by name — an icon outside it is a type error.',
      },
      source: {
        code: `const ICON_NAMES = Object.keys(DS_ICONS) as IconName[];

{ICON_NAMES.map((name) => (
  <li key={name}>
    <Icon size="md">{DS_ICONS[name].icon}</Icon>
    <Text size="sm" as="span">{formatTokenLabel(name.split('-'))}</Text>
    <Caption>{DS_ICONS[name].usedIn}</Caption>
  </li>
))}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The gallery draws exactly the registry: one box per entry, no hand-written list.
    await expect(canvas.getAllByRole('listitem')).toHaveLength(ICON_NAMES.length);
    await expect(canvas.getByText('Triangle Alert')).toBeVisible();
  },
};

/* ---------------------------------------------------------------
 * Hidden or named (recipe)
 * --------------------------------------------------------------- */

export const HiddenOrNamed: Story = {
  render: () => (
    <div style={{ padding: '32px', display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Caption>Hidden: the words already say it</Caption>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Button
            variant="secondary"
            appearance="outline"
            size="md"
            icon={DS_ICONS['arrow-up-right'].icon}
          >
            Open the listing
          </Button>
          <Badge variant="success" appearance="soft" size="md" icon={DS_ICONS['circle-check'].icon}>
            Fits the room
          </Badge>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Caption>Named: the icon is all there is</Caption>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Icon label="The room has a bath">{DS_ICONS.bath.icon}</Icon>
          <Icon label="The room has a bed">{DS_ICONS.bed.icon}</Icon>
          <Icon label="The room has a kitchen">{DS_ICONS['cooking-pot'].icon}</Icon>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The same kind of mark, read two ways. On the left the icon sits inside a control or beside a word, so it stays out of the accessibility tree — a reader hears "Open the listing", never "arrow up right". On the right the three icons are the whole row: with nothing to read, they are named, and each becomes a single image with a name of its own. A screen reader hears "The room has a bath, image", not the paths inside.',
      },
      source: {
        code: `{/* Hidden: the text carries it. */}
<Button icon={DS_ICONS['arrow-up-right'].icon}>Open the listing</Button>

{/* Named: there is nothing else to read. */}
<Icon label="The room has a bath">{DS_ICONS.bath.icon}</Icon>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('button', { name: 'Open the listing' })).toBeVisible();
    await expect(canvas.getByText('Fits the room')).toBeVisible();
    await expect(canvas.getByRole('img', { name: 'The room has a bath' })).toBeVisible();

    // The named row holds exactly three images: the icons on the left stay hidden.
    await expect(canvas.getAllByRole('img')).toHaveLength(3);
  },
};

/* ---------------------------------------------------------------
 * Beside text (recipe)
 * --------------------------------------------------------------- */

export const BesideText: Story = {
  render: () => (
    <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Icon size="xs">{DS_ICONS.clock.icon}</Icon>
        <Caption>Updated 2 hours ago</Caption>
      </span>
      <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Icon size="sm">{DS_ICONS.store.icon}</Icon>
        <Text size="sm">Casa Verde · São Paulo</Text>
      </span>
      <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Icon size="md">{DS_ICONS['map-pin'].icon}</Icon>
        <Text size="md">Rua do Alecrim, 12</Text>
      </span>
      <span style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Icon size="lg">{DS_ICONS.home.icon}</Icon>
        <Text size="lg">Living room</Text>
      </span>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The size ladder read against the text it pairs with. An icon that is smaller than its words looks like a mistake and one that is larger looks like the heading; matching the text role is what makes the pair read as one thing. Colour follows the same rule — each icon here is stroked in the colour of the text beside it, never its own.',
      },
      source: {
        code: `<Icon size="xs">{DS_ICONS.clock.icon}</Icon>
<Caption>Updated 2 hours ago</Caption>

<Icon size="md">{DS_ICONS['map-pin'].icon}</Icon>
<Text size="md">Rua do Alecrim, 12</Text>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Updated 2 hours ago')).toBeVisible();
    await expect(canvas.getByText('Living room')).toBeVisible();
    await expect(canvas.queryByRole('img')).not.toBeInTheDocument();
  },
};
