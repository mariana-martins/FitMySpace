import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { SHELF_IMAGE } from '../../docs';
import { Checkbox } from '../Checkbox';
import { List, ListItem } from './';
import { Switch } from '../Switch';
import { Button } from '../Button';
import { Badge } from '../Badge';
import Image from 'next/image';
import { Link } from '../Link';

/* ---------------------------------------------------------------
 * List
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Components/Display/List',
  component: List,
  tags: ['autodocs'],
  args: {
    appearance: 'plain',
    size: 'md',
    dividers: true,
    // Every story renders its own rows.
    children: null,
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `List` component shows rows about one kind of thing — saved products, rooms, stores — each a `ListItem` with up to four parts: something at the start, a title, a description under it, and something at the end. It is the shape of Material lists and most design systems, so the same component carries a list of links, a list of actions or a list of choices.\n\n' +
          '### Best Practices\n' +
          '- **One kind of thing per list:** every row should answer the same question. Mixed content is a page section, not a list.\n' +
          '- **Pick the start by what helps recognition:** `icon` for a category (a room), `leading` for a picture of the actual thing (a product). Leave it out when the title says enough.\n' +
          "- **One action at the end, at most:** a `Button`, or a short fact such as a `Badge` or a price. More than one action belongs on the item's own page.\n" +
          '- **Name each action after its row:** "Remove Oak wall shelf", with the item\'s name in screen-reader-only text, so a list of buttons is not "Remove, Remove, Remove".\n' +
          '- **A whole clickable row is a stretched link:** put `<Link stretched>` in the title. A trailing button still gets its own clicks.\n' +
          "- **For choices, let the control fill the row:** a `Checkbox` or `Switch` as the item's content keeps its own label and hint.\n\n" +
          '### Key Features\n' +
          '- **2 appearances** — `plain` (on the page, rows aligned with the text around them) and `outline` (inside a bordered surface).\n' +
          '- **2 sizes** — `sm` (48px rows, label-md titles) and `md` (56px rows, label-lg titles).\n' +
          '- **Inset dividers** — a faint line between rows that starts where the text starts; turn them off with `dividers={false}`.\n' +
          '- **Clickable rows** — a stretched link title gives the row a hover fill and an inset focus ring; in a plain list the row steps out so its text stays aligned.\n' +
          '- **List semantics kept** — `role="list"` is written out, because Safari drops it from an unstyled list, and `as="ol"` gives an ordered list.\n' +
          '- **Server-rendered** — no state and no client hooks.\n\n' +
          '### Patterns\n' +
          '- [Site Header](?path=/docs/design-system-patterns-page-sections-site-header--docs) — the brand and the main sections, folding into a menu dialog on a phone.\n' +
          '- [Page Layout](?path=/docs/design-system-patterns-pages-page-layout--docs) — header, one main area and footer, one h1 and the same section rhythm.',
      },
    },
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

const ROOMS = [
  { name: 'Bathroom', icon: 'bath', saved: 12 },
  { name: 'Bedroom', icon: 'bed', saved: 18 },
  { name: 'Kitchen', icon: 'cooking-pot', saved: 7 },
] as const;

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  argTypes: {
    appearance: {
      control: { type: 'select' },
      options: ['plain', 'outline'],
      description:
        '`plain` sits on the page with rows aligned to the text around it; `outline` draws the rows inside a bordered surface.',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md'],
      description:
        'Row height and type: `sm` 48px rows with label-md titles, `md` 56px rows with label-lg titles.',
    },
    dividers: {
      control: { type: 'boolean' },
      description: 'A faint line between rows, starting where the text starts.',
    },
    as: {
      control: false,
      description: '`ol` when the order means something, such as a ranking. `ul` by default.',
    },
    children: {
      control: false,
      description: 'The `ListItem`s.',
    },
  },
  render: (args) => (
    <div style={{ width: '28rem', maxWidth: '100%' }}>
      <List {...args} aria-label="Your rooms">
        {ROOMS.map((room) => (
          <ListItem key={room.name} icon={room.icon} description={`${room.saved} saved products`}>
            {room.name}
          </ListItem>
        ))}
      </List>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use the controls below to experiment with all possible combinations of props. Three rooms, each with its icon and how many products are saved in it.',
      },
      source: {
        code: `<List aria-label="Your rooms">
  <ListItem icon="bath" description="12 saved products">Bathroom</ListItem>
  <ListItem icon="bed" description="18 saved products">Bedroom</ListItem>
  <ListItem icon="cooking-pot" description="7 saved products">Kitchen</ListItem>
</List>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole('list', { name: 'Your rooms' });
    await expect(within(list).getAllByRole('listitem')).toHaveLength(3);
  },
};

/* ---------------------------------------------------------------
 * Appearances
 * --------------------------------------------------------------- */

export const AllAppearances: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        width: '100%',
        gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
        gap: '2rem',
      }}
    >
      {(['plain', 'outline'] as const).map((appearance) => (
        <List key={appearance} appearance={appearance} aria-label={`Rooms, ${appearance}`}>
          {ROOMS.map((room) => (
            <ListItem key={room.name} icon={room.icon} description={`${room.saved} saved products`}>
              {room.name}
            </ListItem>
          ))}
        </List>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`plain` (left) belongs in a page section, its rows lined up with the heading above. `outline` (right) stands on its own, as a panel in a layout or inside a card-less settings screen.',
      },
    },
  },
};

/* ---------------------------------------------------------------
 * All sizes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        width: '100%',
        gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
        gap: '2rem',
      }}
    >
      {(['sm', 'md'] as const).map((size) => (
        <List key={size} appearance="outline" size={size} aria-label={`Rooms, size ${size}`}>
          {ROOMS.map((room) => (
            <ListItem key={room.name} icon={room.icon} description={`${room.saved} saved products`}>
              {room.name}
            </ListItem>
          ))}
        </List>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`sm` (left) for dense lists in a sidebar or a dialog: 48px rows, a 40px icon circle. `md` (right) for the main list of a page: 56px rows, a 48px circle.',
      },
    },
  },
};

/* ---------------------------------------------------------------
 * With icons and pictures
 * --------------------------------------------------------------- */

export const WithIcon: Story = {
  name: 'With Icons',
  render: () => (
    <div
      style={{
        display: 'grid',
        width: '100%',
        gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
        gap: '2rem',
      }}
    >
      <List aria-label="Rooms">
        {ROOMS.map((room) => (
          <ListItem key={room.name} icon={room.icon}>
            {room.name}
          </ListItem>
        ))}
      </List>
      <List aria-label="Recently viewed">
        {['Bamboo shower caddy', 'Oak wall shelf'].map((product) => (
          <ListItem
            key={product}
            leading={
              <span
                style={{
                  position: 'relative',
                  inlineSize: '48px',
                  blockSize: '48px',
                  overflow: 'hidden',
                  borderRadius: 'var(--ds-semantic-radii-surface-md)',
                }}
              >
                <Image src={SHELF_IMAGE} alt="" fill unoptimized sizes="48px" />
              </span>
            }
            description="IKEA · $24.99"
          >
            {product}
          </ListItem>
        ))}
      </List>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Left: `icon` names a registry icon, drawn in a soft sage circle — right for categories. Right: `leading` takes anything else, here a picture of the product. Both are decorative: the title says what the row is.',
      },
      source: {
        code: `<ListItem icon="bath">Bathroom</ListItem>

<ListItem leading={<ProductThumbnail src={product.image} alt="" />} description="IKEA · $24.99">
  Oak wall shelf
</ListItem>`,
      },
    },
  },
};

/* ---------------------------------------------------------------
 * Interactive Pseudo States
 * --------------------------------------------------------------- */

export const PseudoStates: Story = {
  name: 'Interactive Pseudo States',
  render: () => (
    <div style={{ width: '28rem', maxWidth: '100%', padding: '0.5rem 1rem' }}>
      <List aria-label="Room links">
        {[
          { ...ROOMS[0], className: undefined },
          { ...ROOMS[1], className: 'pseudo-hover' },
          { ...ROOMS[2], className: 'pseudo-focus-visible' },
        ].map((room) => (
          <ListItem
            key={room.name}
            icon={room.icon}
            description={`${room.saved} saved products`}
            className={room.className}
          >
            <Link href={`#${room.name.toLowerCase()}`} appearance="standalone" stretched>
              {room.name}
            </Link>
          </ListItem>
        ))}
      </List>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Rows whose title is a `<Link stretched>`, shown with the `storybook-addon-pseudo-states` plugin, from top to bottom:\n\n' +
          '- **Default** — the row steps out by its side padding, so its icon and text stay aligned with plain rows.\n' +
          '- **Hover** — anywhere on the row: a pale fill, and the title gains the standalone underline.\n' +
          '- **Focus** — the sage ring is drawn inside the row, so it never covers the rows next to it.',
      },
    },
    pseudo: {
      hover: ['.pseudo-hover', '.pseudo-hover a'],
      focusVisible: ['.pseudo-focus-visible a'],
    },
  },
};

/* ---------------------------------------------------------------
 * Links (recipe)
 * --------------------------------------------------------------- */

export const NavigationExample: Story = {
  name: 'Links (A11y)',
  render: () => (
    <div style={{ width: '28rem', maxWidth: '100%' }}>
      <List appearance="outline" aria-label="Your rooms">
        {ROOMS.map((room) => (
          <ListItem
            key={room.name}
            icon={room.icon}
            description={`${room.saved} saved products`}
            trailing={
              <Badge variant="secondary" appearance="soft" size="sm" shape="rounded">
                {room.saved}
              </Badge>
            }
          >
            <Link href={`#${room.name.toLowerCase()}`} appearance="standalone" stretched>
              {room.name}
            </Link>
          </ListItem>
        ))}
      </List>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Each row opens its room. The title is the link, so screen readers hear one link per row, named by the room, and the whole row is the click area.',
      },
      source: {
        code: `<ListItem icon="bath" description="12 saved products">
  <Link asChild appearance="standalone" stretched>
    <NextLink href="/rooms/bathroom">Bathroom</NextLink>
  </Link>
</ListItem>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('link')).toHaveLength(3);
    await expect(canvas.getByRole('link', { name: 'Bathroom' })).toHaveAttribute(
      'data-link-stretched',
      'true',
    );
  },
};

/* ---------------------------------------------------------------
 * Actions (recipe)
 * --------------------------------------------------------------- */

export const ActionsExample: Story = {
  name: 'Actions (A11y)',
  render: () => (
    <div style={{ width: '28rem', maxWidth: '100%' }}>
      <List aria-label="Saved products">
        {['Bamboo shower caddy', 'Oak wall shelf', 'Linen storage box'].map((product) => (
          <ListItem
            key={product}
            description="Saved yesterday"
            trailing={
              <Button variant="secondary" appearance="outline" size="sm">
                Remove<VisuallyHidden> {product}</VisuallyHidden>
              </Button>
            }
          >
            {product}
          </ListItem>
        ))}
      </List>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'One action per row, at the end. Each button is named after its row ("Remove Oak wall shelf") with screen-reader-only text, so the list of buttons makes sense on its own. See the Remove with Undo pattern for what happens after the click.',
      },
      source: {
        code: `<ListItem
  description="Saved yesterday"
  trailing={
    <Button variant="secondary" appearance="outline" size="sm">
      Remove<VisuallyHidden> {product.name}</VisuallyHidden>
    </Button>
  }
>
  {product.name}
</ListItem>`,
      },
    },
  },
};

/* ---------------------------------------------------------------
 * Choices (recipe)
 * --------------------------------------------------------------- */

export const ChoicesExample: Story = {
  name: 'Choices (A11y)',
  render: () => (
    <div style={{ width: '28rem', maxWidth: '100%' }}>
      <List appearance="outline" aria-label="Notifications">
        <ListItem>
          <Switch label="Order updates" hint="Every step of the delivery." defaultChecked />
        </ListItem>
        <ListItem>
          <Switch label="Price alerts" hint="Only for items on your saved list." />
        </ListItem>
        <ListItem>
          <Checkbox label="Show only products that fit" hint="Uses the spaces you saved." />
        </ListItem>
      </List>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A `Switch` or `Checkbox` fills the row and keeps its own label and hint, so clicking the label still toggles it. The list adds the rhythm and the dividers.',
      },
      source: {
        code: `<List appearance="outline" aria-label="Notifications">
  <ListItem>
    <Switch label="Order updates" hint="Every step of the delivery." defaultChecked />
  </ListItem>
  <ListItem>
    <Checkbox label="Show only products that fit" hint="Uses the spaces you saved." />
  </ListItem>
</List>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('switch', { name: 'Order updates' })).toBeChecked();
    await expect(
      canvas.getByRole('checkbox', { name: 'Show only products that fit' }),
    ).not.toBeChecked();
  },
};
