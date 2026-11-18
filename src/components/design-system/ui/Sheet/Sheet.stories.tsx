import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from './';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Checkbox } from '../Checkbox';
import { Text } from '../Typography';
import { Button } from '../Button';

import type { SheetContentProps } from './';

const meta = {
  title: 'Design System/Components/Overlays/Sheet',
  component: SheetContent,
  tags: ['autodocs'],
  args: {
    side: 'end',
    size: 'sm',
    initialFocus: 'first',
    closeLabel: 'Close',
  },
  parameters: {
    docs: {
      description: {
        component:
          'A `Sheet` is a modal dialog that slides in from an edge of the screen instead of floating in the middle: the menu on a phone, the filters on a phone, the details of one item beside a list. It is built on Radix Dialog, so it behaves exactly like `Dialog` — scrim, focus trap, Escape, a click on the scrim, scroll lock, focus back to the trigger — and it is composed from the same parts: `SheetTrigger`, then `SheetContent` with `SheetTitle`, the optional `SheetDescription`, `SheetBody` and `SheetFooter`.\n\n' +
          '### Best Practices\n' +
          '- **Reach for it when the content is a place, not a question:** a menu, a set of filters, a long list. A short question wants a `Dialog`; one that must be answered wants an `AlertDialog`; a few controls that leave the page usable want a `Popover`.\n' +
          '- **Pick the side by what it holds:** `start` for the menu (where the menu button sits), `end` for filters and details, `bottom` for a few actions on a phone, within reach of the thumb.\n' +
          '- **Always give it a title** — it names the sheet — and keep the actions in the footer, which stays at the bottom while the body scrolls.\n' +
          '- **A sheet always leaves a strip of the page in sight,** so it reads as something on top of the page, not a new page. Never open one from another.\n\n' +
          '### Key Features\n' +
          '- **Three sides** — `start` and `end` (logical: they swap in a right-to-left page) take the full height; `bottom` takes the full width and only the height it needs.\n' +
          '- **Two widths** for side sheets — `sm` 384px and `md` 560px, always leaving a 32px strip of scrim.\n' +
          '- **`initialFocus`** — `first` (the first control, the default) or `title` (for a menu of links).\n' +
          '- **A Close button** in the corner, named by `closeLabel`, so a sheet cannot be built without a way out.\n' +
          '- **Modal, always** — `aria-modal` is ours to add, as in `Dialog`; there is no `modal` prop.\n' +
          '- **Reduced motion and `forced-colors`** — the sheet stops sliding when asked, and draws a solid edge when the system drops shadows.\n\n' +
          '### Patterns\n' +
          '- [Site Header](?path=/docs/design-system-patterns-page-sections-site-header--docs) — the phone menu, from the start edge.\n' +
          '- [Filter Bar](?path=/docs/design-system-patterns-page-sections-filter-bar--docs) — the phone filters, from the end edge, applied with one button.',
      },
    },
  },
} satisfies Meta<typeof SheetContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/* The sheet opens in a portal at the end of <body>, outside the story's own
   node, so the queries for it go through the document. */
function page() {
  return within(document.body);
}

const ROOMS = ['Bathroom', 'Bedroom', 'Kitchen', 'Living room'];

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

function FilterSheet({
  triggerLabel = 'Filters',
  ...contentProps
}: SheetContentProps & {
  triggerLabel?: string;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" appearance="outline" size="md" icon="sliders-horizontal">
          {triggerLabel}
        </Button>
      </SheetTrigger>

      <SheetContent {...contentProps}>
        <SheetTitle>Filters</SheetTitle>
        <SheetDescription>Nothing changes until you show the products.</SheetDescription>
        <SheetBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {ROOMS.map((room) => (
              <Checkbox key={room} size="md" label={room} />
            ))}
          </div>
        </SheetBody>
        <SheetFooter>
          <Button variant="secondary" appearance="ghost" size="md">
            Clear filters
          </Button>
          <SheetClose asChild>
            <Button variant="primary" appearance="fill" size="md">
              Show 16 products
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export const Default: Story = {
  args: {
    side: 'end',
    size: 'sm',
    initialFocus: 'first',
    closeLabel: 'Close filters',
  },
  argTypes: {
    side: {
      control: { type: 'inline-radio' },
      options: ['start', 'end', 'bottom'],
      description: 'The edge it slides in from.',
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md'],
      description: 'Width of a side sheet: 384px or 560px. A bottom sheet takes the full width.',
    },
    initialFocus: {
      control: { type: 'inline-radio' },
      options: ['first', 'title'],
      description: 'Where the focus goes on open: the first control, or the title.',
    },
    closeLabel: {
      control: 'text',
      description: 'Accessible name of the icon-only Close button.',
    },
    children: {
      control: false,
      description:
        'The parts: `SheetTitle`, then the optional `SheetDescription`, `SheetBody`, `SheetFooter`.',
    },
  },
  render: (args) => <FilterSheet {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'Use the controls below to experiment with all possible combinations of props. The sheet starts closed: press **Filters** to open it. Escape, the Close button, a click on the scrim or **Show 16 products** closes it, and the focus goes back to **Filters**.',
      },
      source: {
        code: `<Sheet>
  <SheetTrigger asChild>
    <Button variant="secondary" appearance="outline" size="md" icon="sliders-horizontal">Filters</Button>
  </SheetTrigger>

  <SheetContent side="end" size="sm" closeLabel="Close filters">
    <SheetTitle>Filters</SheetTitle>
    <SheetDescription>Nothing changes until you show the products.</SheetDescription>
    <SheetBody>…</SheetBody>
    <SheetFooter>
      <Button variant="secondary" appearance="ghost" size="md">Clear filters</Button>
      <SheetClose asChild>
        <Button variant="primary" appearance="fill" size="md">Show 16 products</Button>
      </SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>`,
      },
    },
  },
  play: async () => {
    await expect(page().getByRole('button', { name: 'Filters' })).toBeEnabled();
    await expect(page().queryByRole('dialog')).not.toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * Default: interaction (test only)
 *
 * Hidden from the sidebar and the docs page (`!dev`, `!autodocs`), but
 * `npm run test:storybook` still plays it: a visible story may not open
 * its own sheet on load.
 * --------------------------------------------------------------- */

export const DefaultInteraction: Story = {
  ...Default,
  name: 'Default: Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async () => {
    const trigger = page().getByRole('button', { name: 'Filters' });
    await userEvent.click(trigger);

    const sheet = await page().findByRole('dialog', { name: 'Filters' });
    await expect(sheet).toHaveAttribute('aria-modal', 'true');
    await expect(page().getByRole('checkbox', { name: 'Bathroom' })).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(page().queryByRole('dialog')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};

/* ---------------------------------------------------------------
 * All sides
 * --------------------------------------------------------------- */

const SIDES = [
  { side: 'start', label: 'From the start' },
  { side: 'end', label: 'From the end' },
  { side: 'bottom', label: 'From the bottom' },
] as const;

export const AllSides: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {SIDES.map(({ side, label }) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="secondary" appearance="outline" size="md">
              {label}
            </Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetTitle>{label}</SheetTitle>
            <SheetDescription>
              {side === 'start' && 'For the menu: it opens on the side of the menu button.'}
              {side === 'end' && 'For filters and details: it leaves the content in its place.'}
              {side === 'bottom' && 'For a few actions on a phone, within reach of the thumb.'}
            </SheetDescription>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="primary" appearance="fill" size="md">
                  Done
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`start` and `end` run the full height, with the corners that face the page rounded; `bottom` runs the full width and grows only as tall as its content, up to the screen minus a 32px strip. `start` and `end` are logical, so in a right-to-left page they swap sides, and so does the slide.',
      },
      source: {
        code: `<SheetContent side="start">…</SheetContent>
<SheetContent side="end">…</SheetContent>
<SheetContent side="bottom">…</SheetContent>`,
      },
    },
  },
  play: async () => {
    await expect(page().getByRole('button', { name: 'From the start' })).toBeEnabled();
    await expect(page().getByRole('button', { name: 'From the bottom' })).toBeEnabled();
  },
};

/* ---------------------------------------------------------------
 * All sizes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {(['sm', 'md'] as const).map((size) => (
        <Sheet key={size}>
          <SheetTrigger asChild>
            <Button variant="secondary" appearance="outline" size="md">
              {size === 'sm' ? 'Small sheet' : 'Medium sheet'}
            </Button>
          </SheetTrigger>
          <SheetContent size={size}>
            <SheetTitle>{size === 'sm' ? 'Small sheet' : 'Medium sheet'}</SheetTitle>
            <SheetBody>
              <Text as="p" size="md">
                {size === 'sm'
                  ? '384px: a menu or a list of filters, the width of a phone.'
                  : '560px: the details of one product beside the list it came from.'}
              </Text>
            </SheetBody>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`sm` for a menu or filters, `md` for the details of one item. On a phone both stop 32px short of the far edge, so the page stays in sight.',
      },
      source: {
        code: `<SheetContent size="sm">…</SheetContent>
<SheetContent size="md">…</SheetContent>`,
      },
    },
  },
  play: async () => {
    await expect(page().getByRole('button', { name: 'Small sheet' })).toBeEnabled();
    await expect(page().getByRole('button', { name: 'Medium sheet' })).toBeEnabled();
  },
};

/* ---------------------------------------------------------------
 * Long body
 * --------------------------------------------------------------- */

const STORES = Array.from({ length: 18 }, (_store, index) => `Store ${index + 1}`);

function FilterSheetWithStores() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary" appearance="outline" size="md">
          Stores
        </Button>
      </SheetTrigger>
      <SheetContent closeLabel="Close stores">
        <SheetTitle>Stores</SheetTitle>
        <SheetBody>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {STORES.map((store) => (
              <Checkbox key={store} size="md" label={store} />
            ))}
          </div>
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="primary" appearance="fill" size="md">
              Show products
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export const LongBody: Story = {
  name: 'Long Body (Only the Body Scrolls)',
  render: () => <FilterSheetWithStores />,
  parameters: {
    docs: {
      description: {
        story:
          'When the body holds more than fits, only the body scrolls: the title stays at the top, the Close button in its corner, and the actions at the bottom, so **Show products** is always one press away.',
      },
    },
  },
  play: async () => {
    await expect(page().getByRole('button', { name: 'Stores' })).toBeEnabled();
  },
};
