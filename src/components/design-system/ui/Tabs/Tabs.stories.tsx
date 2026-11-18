import { Tabs, TabsContent, TabsList, TabsTrigger } from './';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Label, Text } from '../Typography';

import type { TabsListProps } from './';

const meta = {
  title: 'Design System/Components/Navigation/Tabs',
  component: TabsList,
  tags: ['autodocs'],
  args: {
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        component:
          '`Tabs` split one subject into a few views of the same weight and show one at a time: the details, the measurements and the stores of one product. It is built on Radix Tabs, which owns the ARIA tabs pattern — the roles, `aria-selected` and the link between each tab and its panel — and the keyboard: Tab enters the list on the selected tab, the arrow keys move along it, Home and End jump to either end, and the next Tab goes into the panel.\n\n' +
          'You compose it from four parts: `Tabs` holds the state, `TabsList` the row of tabs, each `TabsTrigger` is one tab, and each `TabsContent` is the panel of the tab with the same `value`.\n\n' +
          '### Best Practices\n' +
          '- **Reach for it when the views are siblings** and people need only one at a time. If people need to compare them, put them on the page one after another; if each view is a step, use a sequence of pages, not tabs.\n' +
          '- **Two to six short tabs,** a word or two each. A list that scrolls sideways on a phone is allowed, but nobody sees the tabs past the edge.\n' +
          '- **Name the list** with `aria-label` ("Product information"), or with `aria-labelledby` pointing at the heading above it.\n' +
          '- **Tabs are not navigation:** each tab changes what this page shows, not the URL of another page. Links to other pages are a `nav` with links. When a tab should survive a reload or be shared, keep its `value` in the URL and pass it in as `value`.\n' +
          '- **Use `activationMode="manual"`** when a panel is slow to show (it loads something), so the arrow keys move without loading every panel they pass.\n' +
          '- **Disable a tab only for a moment;** a tab that never has anything to show should not be there.\n\n' +
          '### Key Features\n' +
          '- **Two sizes** — `sm` 40px and `md` 48px, the heights of the `Button` and the `Input`.\n' +
          '- **No box, just words and a line** — a tab has no background of its own. A neutral bar slides in under a hovered tab, the way a standalone `Link` underlines; the selected tab keeps the darker text and a sage bar, so the selection never rests on colour alone. `forced-colors` paints it in the highlight colour.\n' +
          '- **`icon`** — one of the design-system icons, by name, before the words; a tab is never an icon alone.\n' +
          '- **Vertical** — `orientation="vertical"` stands the tabs on the side, with the arrow keys turned to Up and Down.\n' +
          '- **Narrow screens** — the row scrolls sideways instead of wrapping, so the tabs keep their order.\n' +
          '- **Controlled or not** — `defaultValue`, or `value` with `onValueChange` when the app owns it.\n\n' +
          '### Patterns\n' +
          '- [Product Details](?path=/docs/design-system-patterns-page-sections-product-details--docs) — the description and the measurements of one product, one tab each.',
      },
    },
  },
} satisfies Meta<typeof TabsList>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

const MEASUREMENTS = [
  { label: 'Width', value: '48 cm' },
  { label: 'Depth', value: '26 cm' },
  { label: 'Height', value: '70 cm' },
];

function ProductTabs(listProps: TabsListProps) {
  return (
    <Tabs defaultValue="details" style={{ width: '36rem', maxWidth: '100%' }}>
      <TabsList aria-label="Product information" {...listProps}>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="measurements">Measurements</TabsTrigger>
        <TabsTrigger value="stores">Stores</TabsTrigger>
      </TabsList>

      <TabsContent value="details">
        <Text as="p" size="md" style={{ margin: 0 }}>
          Three open shelves in oiled bamboo for bottles and towels. Water drains through the slats,
          and the feet keep it off a wet floor.
        </Text>
      </TabsContent>
      <TabsContent value="measurements">
        <dl
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '0.5rem 1.5rem',
            margin: 0,
          }}
        >
          {MEASUREMENTS.map((measurement) => (
            <div key={measurement.label} style={{ display: 'contents' }}>
              <dt>
                <Label size="sm">{measurement.label}</Label>
              </dt>
              <dd style={{ margin: 0 }}>
                <Text as="span" size="sm">
                  {measurement.value}
                </Text>
              </dd>
            </div>
          ))}
        </dl>
      </TabsContent>
      <TabsContent value="stores">
        <Text as="p" size="md" style={{ margin: 0 }}>
          Sold by The Container Store and Tok&Stok.
        </Text>
      </TabsContent>
    </Tabs>
  );
}

export const Default: Story = {
  args: {
    size: 'md',
  },
  argTypes: {
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md'],
      description: 'Height and type of the tabs: 40px or 48px, set on `TabsList`.',
    },
    children: {
      control: false,
      description: 'The `TabsTrigger`s, one per panel, in the order people should read them.',
    },
  },
  render: (args) => <ProductTabs {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'Use the controls below to experiment with all possible combinations of props. Click a tab, or press Tab to reach the list and the arrow keys to move along it: the panel changes as the focus moves.',
      },
      source: {
        code: `<Tabs defaultValue="details">
  <TabsList aria-label="Product information" size="md">
    <TabsTrigger value="details">Details</TabsTrigger>
    <TabsTrigger value="measurements">Measurements</TabsTrigger>
    <TabsTrigger value="stores">Stores</TabsTrigger>
  </TabsList>

  <TabsContent value="details">…</TabsContent>
  <TabsContent value="measurements">…</TabsContent>
  <TabsContent value="stores">…</TabsContent>
</Tabs>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('tablist', { name: 'Product information' })).toBeVisible();
    await expect(canvas.getByRole('tab', { name: 'Details' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(canvas.getByRole('tabpanel', { name: 'Details' })).toBeVisible();
  },
};

/* ---------------------------------------------------------------
 * Default: interaction (test only)
 *
 * Hidden from the sidebar and the docs page (`!dev`, `!autodocs`), but
 * `npm run test:storybook` still plays it: a visible story may not change
 * its own selection on load.
 * --------------------------------------------------------------- */

export const DefaultInteraction: Story = {
  ...Default,
  name: 'Default: Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('tab', { name: 'Measurements' }));
    await expect(canvas.getByRole('tabpanel', { name: 'Measurements' })).toBeVisible();

    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: 'Stores' })).toHaveFocus();
    await expect(canvas.getByRole('tabpanel', { name: 'Stores' })).toBeVisible();

    await userEvent.tab();
    await expect(canvas.getByRole('tabpanel', { name: 'Stores' })).toHaveFocus();
  },
};

/* ---------------------------------------------------------------
 * All sizes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        width: '36rem',
        maxWidth: '100%',
      }}
    >
      {(['sm', 'md'] as const).map((size) => (
        <Tabs key={size} defaultValue="details">
          <TabsList aria-label={`Product information, size ${size}`} size={size}>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="measurements">Measurements</TabsTrigger>
            <TabsTrigger value="stores">Stores</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <Text as="p" size="sm" style={{ margin: 0 }}>
              Size {size}: {size === 'sm' ? '40px' : '48px'} tall.
            </Text>
          </TabsContent>
          <TabsContent value="measurements">
            <Text as="p" size="sm" style={{ margin: 0 }}>
              48 × 26 × 70 cm.
            </Text>
          </TabsContent>
          <TabsContent value="stores">
            <Text as="p" size="sm" style={{ margin: 0 }}>
              Two stores.
            </Text>
          </TabsContent>
        </Tabs>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`sm` (40px, 14px label) for tabs inside a card or a side panel, `md` (48px, 16px label) for the tabs of a page section. Both share the control heights of the `Button` and the `Input`.',
      },
      source: {
        code: `<TabsList aria-label="Product information" size="sm">…</TabsList>
<TabsList aria-label="Product information" size="md">…</TabsList>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('tablist')).toHaveLength(2);
  },
};

/* ---------------------------------------------------------------
 * With icons
 * --------------------------------------------------------------- */

export const WithIcon: Story = {
  name: 'With Icons',
  render: () => (
    <Tabs defaultValue="details" style={{ width: '36rem', maxWidth: '100%' }}>
      <TabsList aria-label="Product information">
        <TabsTrigger value="details" icon="info">
          Details
        </TabsTrigger>
        <TabsTrigger value="measurements" icon="ruler">
          Measurements
        </TabsTrigger>
        <TabsTrigger value="stores" icon="store">
          Stores
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <Text as="p" size="md" style={{ margin: 0 }}>
          Three open shelves in oiled bamboo.
        </Text>
      </TabsContent>
      <TabsContent value="measurements">
        <Text as="p" size="md" style={{ margin: 0 }}>
          48 × 26 × 70 cm.
        </Text>
      </TabsContent>
      <TabsContent value="stores">
        <Text as="p" size="md" style={{ margin: 0 }}>
          Sold by The Container Store and Tok&Stok.
        </Text>
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The `icon` prop takes a design-system icon by name and draws it before the words, hidden from screen readers: the words are the name of the tab. Give every tab an icon or none, so the row stays even.',
      },
      source: {
        code: `<TabsTrigger value="measurements" icon="ruler">Measurements</TabsTrigger>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('tab', { name: 'Measurements' })).toBeVisible();
  },
};

/* ---------------------------------------------------------------
 * Disabled
 * --------------------------------------------------------------- */

export const Disabled: Story = {
  render: () => (
    <Tabs defaultValue="details" style={{ width: '36rem', maxWidth: '100%' }}>
      <TabsList aria-label="Product information">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="measurements">Measurements</TabsTrigger>
        <TabsTrigger value="stores" disabled>
          Stores
        </TabsTrigger>
      </TabsList>
      <TabsContent value="details">
        <Text as="p" size="md" style={{ margin: 0 }}>
          Store prices are being checked; the Stores tab opens when they are back.
        </Text>
      </TabsContent>
      <TabsContent value="measurements">
        <Text as="p" size="md" style={{ margin: 0 }}>
          48 × 26 × 70 cm.
        </Text>
      </TabsContent>
      <TabsContent value="stores">
        <Text as="p" size="md" style={{ margin: 0 }}>
          Sold by The Container Store.
        </Text>
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A disabled tab stays in its place, in the disabled colour, and the arrow keys pass over it. Say why in the page, as the panel does here: a greyed tab on its own does not explain itself.',
      },
      source: {
        code: `<TabsTrigger value="stores" disabled>Stores</TabsTrigger>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('tab', { name: 'Stores' })).toBeDisabled();
  },
};

/* ---------------------------------------------------------------
 * Vertical
 * --------------------------------------------------------------- */

export const Vertical: Story = {
  name: 'Vertical (Tabs on the Side)',
  render: () => (
    <Tabs
      defaultValue="bathroom"
      orientation="vertical"
      style={{ width: '40rem', maxWidth: '100%' }}
    >
      <TabsList aria-label="Rooms" size="sm">
        <TabsTrigger value="bathroom" icon="bath">
          Bathroom
        </TabsTrigger>
        <TabsTrigger value="bedroom" icon="bed">
          Bedroom
        </TabsTrigger>
        <TabsTrigger value="kitchen" icon="cooking-pot">
          Kitchen
        </TabsTrigger>
      </TabsList>
      <TabsContent value="bathroom">
        <Text as="p" size="md" style={{ margin: 0 }}>
          4 saved products, R$ 312 in total.
        </Text>
      </TabsContent>
      <TabsContent value="bedroom">
        <Text as="p" size="md" style={{ margin: 0 }}>
          12 saved products, R$ 1.480 in total.
        </Text>
      </TabsContent>
      <TabsContent value="kitchen">
        <Text as="p" size="md" style={{ margin: 0 }}>
          7 saved products, R$ 655 in total.
        </Text>
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`orientation="vertical"` on `Tabs` stands the list on the side, with the indicator on its inner edge. The arrow keys turn with it, to Up and Down, and the list says so with `aria-orientation`. Use it on a wide screen when there are more tabs than fit in a row; on a phone, the row is the better choice.',
      },
      source: {
        code: `<Tabs defaultValue="bathroom" orientation="vertical">
  <TabsList aria-label="Rooms" size="sm">
    <TabsTrigger value="bathroom" icon="bath">Bathroom</TabsTrigger>
    …
  </TabsList>
  <TabsContent value="bathroom">…</TabsContent>
</Tabs>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('tablist', { name: 'Rooms' })).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
  },
};

/* ---------------------------------------------------------------
 * Interactive pseudo states
 * --------------------------------------------------------------- */

export const PseudoStates: Story = {
  name: 'Interactive Pseudo States',
  render: () => (
    <Tabs defaultValue="selected" style={{ width: '40rem', maxWidth: '100%' }}>
      <TabsList aria-label="Tab states">
        <TabsTrigger value="selected">Selected</TabsTrigger>
        <TabsTrigger value="default">Default</TabsTrigger>
        <TabsTrigger value="hover" className="pseudo-hover">
          Hover
        </TabsTrigger>
        <TabsTrigger value="pressed" className="pseudo-active">
          Pressed
        </TabsTrigger>
        <TabsTrigger value="focus" className="pseudo-focus-visible">
          Focus
        </TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
      </TabsList>
      <TabsContent value="selected">
        <Text as="p" size="sm" style={{ margin: 0 }}>
          The panel of the selected tab.
        </Text>
      </TabsContent>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the states with the `storybook-addon-pseudo-states` plugin, from left to right:\n\n' +
          '- **Selected** — the darker text and the sage bar on the line.\n' +
          '- **Default** — the quieter text and nothing else.\n' +
          '- **Hover** — the text darkens and a neutral bar slides in from the start, as under a standalone `Link`.\n' +
          '- **Pressed** — the bar darkens one step.\n' +
          '- **Focus** — the shared sage focus ring, drawn inside the tab because the row can scroll.\n' +
          '- **Disabled** — the disabled colour, skipped by the arrow keys.',
      },
    },
    pseudo: {
      hover: ['.pseudo-hover'],
      active: ['.pseudo-active'],
      focusVisible: ['.pseudo-focus-visible'],
    },
  },
};

/* ---------------------------------------------------------------
 * Many tabs on a narrow screen (recipe)
 * --------------------------------------------------------------- */

const ROOMS = [
  { id: 'living-room', name: 'Living room' },
  { id: 'bedroom', name: 'Bedroom' },
  { id: 'kitchen', name: 'Kitchen' },
  { id: 'bathroom', name: 'Bathroom' },
  { id: 'office', name: 'Office' },
  { id: 'laundry', name: 'Laundry' },
];

export const ScrollingList: Story = {
  name: 'Narrow Screen (The Row Scrolls)',
  render: () => (
    <Tabs defaultValue="living-room" style={{ width: '20rem', maxWidth: '100%' }}>
      <TabsList aria-label="Rooms" size="sm">
        {ROOMS.map((room) => (
          <TabsTrigger key={room.id} value={room.id}>
            {room.name}
          </TabsTrigger>
        ))}
      </TabsList>
      {ROOMS.map((room) => (
        <TabsContent key={room.id} value={room.id}>
          <Text as="p" size="sm" style={{ margin: 0 }}>
            Products saved for the {room.name.toLowerCase()}.
          </Text>
        </TabsContent>
      ))}
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Six rooms in 320px. The row keeps one line and scrolls sideways, so the tabs stay in the order they were written, and the arrow keys bring each tab into view as they reach it. Past six tabs, or when most of the row is out of sight, a `Select` is the better choice. Give each tab an id-like `value` (`living-room`): Radix builds the ids that tie a tab to its panel from it, and a space breaks them.',
      },
      source: {
        code: `<TabsList aria-label="Rooms" size="sm">
  {rooms.map((room) => (
    <TabsTrigger key={room.id} value={room.id}>{room.name}</TabsTrigger>
  ))}
</TabsList>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('tab')).toHaveLength(6);
  },
};
