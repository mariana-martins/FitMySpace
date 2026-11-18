import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverFooter,
  PopoverTitle,
  PopoverTrigger,
} from './';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Checkbox } from '../Checkbox';
import { Text } from '../Typography';
import { Switch } from '../Switch';
import { Button } from '../Button';
import { useState } from 'react';

import type { PopoverContentProps } from './';

const meta = {
  title: 'Design System/Components/Overlays/Popover',
  component: PopoverContent,
  tags: ['autodocs'],
  args: {
    size: 'sm',
    side: 'bottom',
    align: 'start',
  },
  parameters: {
    docs: {
      description: {
        component:
          'A `Popover` is a small panel of controls that belongs to the button that opened it: the stores to filter by, a few display options. It is built on Radix Popover. The panel is a `role="dialog"` that is **not modal** — the page stays usable, there is no scrim, and a click anywhere else closes it — which is what tells it apart from a `Dialog`.\n\n' +
          'You compose it like `Dialog`: `PopoverTrigger`, then `PopoverContent` with a `PopoverTitle`, the controls, and an optional `PopoverFooter` with a `PopoverClose`.\n\n' +
          '### Best Practices\n' +
          '- **Reach for it for a few controls about one thing,** next to the button that names it. A form with a Save step, or anything that must be answered, wants a `Dialog`; one short thought about a control wants a `Tooltip`.\n' +
          '- **Always give it a title,** the same word as the trigger ("Stores"): it names the panel, so a screen reader says "Stores, dialog" when the focus moves in. When the panel needs no visible heading, pass `aria-label` to `PopoverContent` instead.\n' +
          '- **Apply each change at once,** as the filter bar does, and say the result on the page (a `role="status"` count). A "Done" in the footer only closes the panel.\n' +
          '- **Keep it short:** it is capped by the space on screen and scrolls past it, but a popover that scrolls is a page squeezed into a corner. On a phone, put the same controls in a `Dialog`.\n' +
          '- **Never nest one popover in another.**\n\n' +
          '### Key Features\n' +
          '- **Two widths** — `sm` 288px and `md` 384px, each capped by the space on screen.\n' +
          '- **Placed by Radix** — `side` (`bottom` by default) and `align` (`start`), flipped and shifted to stay 16px inside the window.\n' +
          '- **Focus** — moves to the first control on open and back to the trigger on Escape or Done; the trigger says `aria-expanded`.\n' +
          '- **Named** — `PopoverContent` points `aria-labelledby` at its `PopoverTitle`, or uses your `aria-label`.\n' +
          '- **Reduced motion and `forced-colors`** — the panel stops scaling in when asked, and draws a solid edge when the system drops shadows.\n\n' +
          '### Patterns\n' +
          '- [Filter Bar](?path=/docs/design-system-patterns-page-sections-filter-bar--docs) — the store filter in a popover on a wide screen, beside the room chips.',
      },
    },
  },
} satisfies Meta<typeof PopoverContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/* The panel opens in a portal at the end of <body>, outside the story's own
   node, so the queries for it go through the document. */
function page() {
  return within(document.body);
}

const STORES = ['The Container Store', 'Tok&Stok', 'Etna', 'Leroy Merlin'];

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

function StorePopover(contentProps: PopoverContentProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          appearance="outline"
          size="md"
          icon="chevron-down"
          iconPosition="end"
        >
          Stores
        </Button>
      </PopoverTrigger>

      <PopoverContent {...contentProps}>
        <PopoverTitle>Stores</PopoverTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {STORES.map((store) => (
            <Checkbox key={store} size="md" label={store} />
          ))}
        </div>
        <PopoverFooter>
          <PopoverClose asChild>
            <Button variant="primary" appearance="fill" size="sm">
              Done
            </Button>
          </PopoverClose>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}

export const Default: Story = {
  args: {
    size: 'sm',
    side: 'bottom',
    align: 'start',
    avoidCollisions: true,
  },
  argTypes: {
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md'],
      description: 'Width: 288px or 384px, capped by the space on screen.',
    },
    side: {
      control: { type: 'inline-radio' },
      options: ['top', 'right', 'bottom', 'left'],
      description:
        'The side of the trigger it prefers. When the window has no room for the panel on that side, Radix opens it on the opposite one.',
    },
    align: {
      control: { type: 'inline-radio' },
      options: ['start', 'center', 'end'],
      description: 'Which edge of the trigger it lines up with.',
    },
    avoidCollisions: {
      control: 'boolean',
      description:
        'Flip and shift the panel to keep it inside the window (the default). Turn it off only to see `side` as asked: the panel can then run off the screen.',
    },
    children: {
      control: false,
      description: 'The parts: `PopoverTitle`, the controls, then the optional `PopoverFooter`.',
    },
  },
  /* The room around the trigger lets `side` show: Radix measures against the window, and
     a trigger near its top edge has no room above, so "top" would open below. */
  render: (args) => (
    <div style={{ display: 'grid', placeItems: 'center', width: '100%', minBlockSize: '40rem' }}>
      <StorePopover {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use the controls below to experiment with all possible combinations of props. The popover starts closed: press **Stores** to open it. The focus moves to the first store; Escape or **Done** closes it and gives the focus back to the button, and a click anywhere else closes it too.\n\n' +
          '`side` is a preference, not an order: when the window has no room on that side — "top" with the button near the top of the window — Radix opens the panel on the other side, and shrinks it to the room left, with the panel scrolling.',
      },
      story: { height: '40rem' },
      source: {
        code: `<Popover>
  <PopoverTrigger asChild>
    <Button variant="secondary" appearance="outline" size="md" icon="chevron-down" iconPosition="end">
      Stores
    </Button>
  </PopoverTrigger>

  <PopoverContent size="sm" side="bottom" align="start">
    <PopoverTitle>Stores</PopoverTitle>
    <Checkbox size="md" label="The Container Store" />
    <Checkbox size="md" label="Tok&Stok" />
    <PopoverFooter>
      <PopoverClose asChild>
        <Button variant="primary" appearance="fill" size="sm">Done</Button>
      </PopoverClose>
    </PopoverFooter>
  </PopoverContent>
</Popover>`,
      },
    },
  },
  play: async () => {
    await expect(page().getByRole('button', { name: 'Stores' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await expect(page().queryByRole('dialog')).not.toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * Default: interaction (test only)
 *
 * Hidden from the sidebar and the docs page (`!dev`, `!autodocs`), but
 * `npm run test:storybook` still plays it: a visible story may not open
 * its own panel on load.
 * --------------------------------------------------------------- */

export const DefaultInteraction: Story = {
  ...Default,
  name: 'Default: Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async () => {
    const trigger = page().getByRole('button', { name: 'Stores' });
    await userEvent.click(trigger);

    const panel = await page().findByRole('dialog', { name: 'Stores' });
    await expect(page().getByRole('checkbox', { name: 'The Container Store' })).toHaveFocus();

    await userEvent.click(page().getByRole('checkbox', { name: 'Etna' }));
    await expect(page().getByRole('checkbox', { name: 'Etna' })).toBeChecked();
    await expect(panel).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(page().queryByRole('dialog')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};

/* ---------------------------------------------------------------
 * All sizes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {(['sm', 'md'] as const).map((size) => (
        <Popover key={size}>
          <PopoverTrigger asChild>
            <Button variant="secondary" appearance="outline" size="md">
              {size === 'sm' ? 'Small popover' : 'Medium popover'}
            </Button>
          </PopoverTrigger>
          <PopoverContent size={size}>
            <PopoverTitle>{size === 'sm' ? 'Small popover' : 'Medium popover'}</PopoverTitle>
            <Text as="p" size="sm" style={{ margin: 0 }}>
              {size === 'sm'
                ? '288px: a list of options, one per line.'
                : '384px: options with a line of help each, or two short columns.'}
            </Text>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`sm` for a list of options, `md` when each option needs a line of help. Both are capped by the space on screen, so a popover never runs off a phone.',
      },
      source: {
        code: `<PopoverContent size="sm">…</PopoverContent>
<PopoverContent size="md">…</PopoverContent>`,
      },
    },
  },
  play: async () => {
    await expect(page().getByRole('button', { name: 'Small popover' })).toBeEnabled();
    await expect(page().getByRole('button', { name: 'Medium popover' })).toBeEnabled();
  },
};

/* ---------------------------------------------------------------
 * Without a footer
 * --------------------------------------------------------------- */

export const WithoutFooter: Story = {
  name: 'Without a Footer (Display Options)',
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          appearance="ghost"
          size="md"
          icon="sliders-horizontal"
          iconPosition="start"
        >
          Display
        </Button>
      </PopoverTrigger>
      <PopoverContent size="md" align="end">
        <PopoverTitle>Display</PopoverTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Switch size="md" label="Show prices in each card" defaultChecked />
          <Switch size="md" label="Show items out of stock" />
        </div>
      </PopoverContent>
    </Popover>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Switches change the page as soon as they are flipped, so there is nothing to confirm and no footer: Escape, a click outside or a second press of **Display** closes it. `align="end"` lines the panel up with the right edge of a button at the end of a toolbar.',
      },
      source: {
        code: `<PopoverContent size="md" align="end">
  <PopoverTitle>Display</PopoverTitle>
  <Switch size="md" label="Show prices in each card" defaultChecked />
  <Switch size="md" label="Show items out of stock" />
</PopoverContent>`,
      },
    },
  },
  play: async () => {
    await expect(page().getByRole('button', { name: 'Display' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  },
};

/* ---------------------------------------------------------------
 * Store filter (recipe)
 * --------------------------------------------------------------- */

function StoreFilterRecipe() {
  const [selectedStores, setSelectedStores] = useState<string[]>([]);

  function toggleStore(store: string, checked: boolean) {
    setSelectedStores((current) =>
      checked ? [...current, store] : current.filter((selected) => selected !== store),
    );
  }

  const triggerLabel = selectedStores.length === 0 ? 'Stores' : `Stores (${selectedStores.length})`;
  const productCount = selectedStores.length === 0 ? 24 : selectedStores.length * 5;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '24rem',
        maxWidth: '100%',
      }}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            appearance={selectedStores.length === 0 ? 'outline' : 'fill'}
            size="md"
            icon="chevron-down"
            iconPosition="end"
            style={{ alignSelf: 'flex-start' }}
          >
            {triggerLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Stores</PopoverTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {STORES.map((store) => (
              <Checkbox
                key={store}
                size="md"
                label={store}
                checked={selectedStores.includes(store)}
                onCheckedChange={(checked) => toggleStore(store, checked === true)}
              />
            ))}
          </div>
          <PopoverFooter>
            <Button
              variant="secondary"
              appearance="ghost"
              size="sm"
              disabled={selectedStores.length === 0}
              onClick={() => setSelectedStores([])}
            >
              Clear
            </Button>
            <PopoverClose asChild>
              <Button variant="primary" appearance="fill" size="sm">
                Done
              </Button>
            </PopoverClose>
          </PopoverFooter>
        </PopoverContent>
      </Popover>

      <Text as="p" size="sm" role="status" style={{ margin: 0 }}>
        {productCount} products
      </Text>
    </div>
  );
}

export const StoreFilter: Story = {
  name: 'Store Filter (A11y)',
  render: () => <StoreFilterRecipe />,
  parameters: {
    docs: {
      description: {
        story:
          'Each store applies as soon as it is ticked, and the count below says the result through `role="status"` while the panel is still open. The trigger keeps its name and adds the number chosen ("Stores (2)"), and fills in, so the filter is visible when the panel is closed. **Clear** empties the choice without closing; **Done** only closes.',
      },
      source: {
        code: `const [stores, setStores] = useState<string[]>([]);

<Popover>
  <PopoverTrigger asChild>
    <Button variant="secondary" appearance={stores.length ? 'fill' : 'outline'} size="md"
      icon="chevron-down" iconPosition="end">
      {stores.length ? \`Stores (\${stores.length})\` : 'Stores'}
    </Button>
  </PopoverTrigger>
  <PopoverContent>
    <PopoverTitle>Stores</PopoverTitle>
    {STORES.map((store) => (
      <Checkbox key={store} size="md" label={store}
        checked={stores.includes(store)}
        onCheckedChange={(checked) => toggleStore(store, checked === true)} />
    ))}
    <PopoverFooter>
      <Button variant="secondary" appearance="ghost" size="sm" onClick={clearStores}>Clear</Button>
      <PopoverClose asChild>
        <Button variant="primary" appearance="fill" size="sm">Done</Button>
      </PopoverClose>
    </PopoverFooter>
  </PopoverContent>
</Popover>

<Text as="p" size="sm" role="status">{count} products</Text>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Stores' })).toBeEnabled();
    await expect(canvas.getByRole('status')).toHaveTextContent('24 products');
  },
};

export const StoreFilterInteraction: Story = {
  ...StoreFilter,
  name: 'Store Filter (A11y): Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Stores' }));
    await userEvent.click(await page().findByRole('checkbox', { name: 'Tok&Stok' }));
    await userEvent.click(page().getByRole('checkbox', { name: 'Etna' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('10 products');

    await userEvent.click(page().getByRole('button', { name: 'Done' }));
    await waitFor(() => expect(page().queryByRole('dialog')).not.toBeInTheDocument());
    await expect(canvas.getByRole('button', { name: 'Stores (2)' })).toHaveFocus();
  },
};
