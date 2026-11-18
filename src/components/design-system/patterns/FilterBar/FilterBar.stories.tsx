import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '../../ui/Dialog';
import { SAMPLE_PRODUCTS, SAMPLE_ROOMS, SampleProductGrid } from '../../docs';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { SampleProduct, SampleRoom } from '../../docs';
import { Select, SelectItem } from '../../ui/Select';
import { Label, Text } from '../../ui/Typography';
import type { CSSProperties, Ref } from 'react';
import type { IconName } from '../../ui/Icon';
import { Button } from '../../ui/Button';
import { useRef, useState } from 'react';
import { Chip } from '../../ui/Chip';

/* ---------------------------------------------------------------
 * Filter bar (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Page Sections/Filter Bar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The controls that narrow and order a list of products: a row of room filters, a sort order, and a line that counts what is left.\n\n' +
          '### What It Solves\n' +
          'Filters change the list without moving the reader. Each change must be heard (the count changes), must be easy to undo (Clear filters), and must not strand the keyboard focus when the button that was pressed disappears.\n\n' +
          '### When to Use\n' +
          '- **Narrowing a list already on the page:** search results, a category. Each filter applies at once, without a Search button.\n' +
          '- **On a phone, put the same controls in a dialog** (second story): the row would push the products off the first screen.\n' +
          '- **Not for:** a value people must type (use Product Search), or a long list of options (use `Select` instead of chips).\n\n' +
          '### Anatomy\n' +
          '- The room filters — a visible `Label` naming a `role="group"`, holding one `Chip` per room.\n' +
          '- The sort order — a `Label` with `htmlFor` and a bare `Select`, which always has a value.\n' +
          '- The count — `Text` with `role="status"` ("8 products"), and a `Button` "Clear filters" while any filter is on.\n' +
          '- The products, here through the Product Card pattern.\n\n' +
          '### Accessibility\n' +
          '- **A chip says its own state** ("Kitchen, toggle button, pressed"), and the count line says the result, so nobody has to look at the grid to know a filter worked.\n' +
          '- **Clear filters gives the focus to the first chip.** The button disappears once nothing is selected; leaving the focus on it would drop it at the top of the page.\n' +
          '- **In the dialog, nothing changes until "Show products":** the button counts the products the choice would show, and closing the dialog any other way keeps the old filters.\n\n' +
          '### In the App\n' +
          '- The rooms and the sort order live in the URL (`?room=kitchen&room=bathroom&sort=price-ascending`), so a filtered list can be shared and the Back button undoes a filter. The products come from TanStack Query.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ROOM_ICONS: Record<SampleRoom, IconName> = {
  Bathroom: 'bath',
  Bedroom: 'bed',
  Kitchen: 'cooking-pot',
  'Living room': 'sofa',
};

const SORT_LABELS = {
  relevance: 'Relevance',
  'price-ascending': 'Price: low to high',
  'price-descending': 'Price: high to low',
} as const;
type SortOrder = keyof typeof SORT_LABELS;

function filterAndSort(rooms: SampleRoom[], sortOrder: SortOrder): SampleProduct[] {
  const filtered = rooms.length
    ? SAMPLE_PRODUCTS.filter((product) => rooms.includes(product.room))
    : SAMPLE_PRODUCTS;
  if (sortOrder === 'relevance') return filtered;
  const direction = sortOrder === 'price-ascending' ? 1 : -1;
  return [...filtered].sort(
    (first, second) => (first.priceInCents - second.priceInCents) * direction,
  );
}

function countProducts(count: number) {
  return `${count} ${count === 1 ? 'product' : 'products'}`;
}

function toggle(rooms: SampleRoom[], room: SampleRoom, isSelected: boolean) {
  return isSelected ? [...rooms, room] : rooms.filter((selectedRoom) => selectedRoom !== room);
}

const stackedFieldStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

/* The filter row is a two-row grid: the labels share the first row and the controls the
   second, centred on each other, so the shorter chips sit on the middle of the taller
   select while both labels stay level. Each field spans both rows through `subgrid`. */
const filterRowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto 14rem',
  gridTemplateRows: 'auto auto',
  justifyContent: 'start',
  columnGap: '1.5rem',
  rowGap: '0.5rem',
  alignItems: 'center',
};

const filterRowFieldStyle: CSSProperties = {
  display: 'grid',
  gridRow: 'span 2',
  gridTemplateRows: 'subgrid',
  alignItems: 'center',
};

interface RoomChipsProps {
  labelId: string;
  selectedRooms: SampleRoom[];
  onChange: (rooms: SampleRoom[]) => void;
  firstChipRef?: Ref<HTMLButtonElement>;
  /** Overrides the stacked label-over-chips layout, e.g. to join the filter row grid. */
  style?: CSSProperties;
}

function RoomChips({ labelId, selectedRooms, onChange, firstChipRef, style }: RoomChipsProps) {
  return (
    <div style={style ?? stackedFieldStyle}>
      <Label id={labelId} size="sm">
        Filter by room
      </Label>
      <div
        role="group"
        aria-labelledby={labelId}
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
      >
        {SAMPLE_ROOMS.map((room, index) => (
          <Chip
            key={room}
            ref={index === 0 ? firstChipRef : undefined}
            size="sm"
            icon={ROOM_ICONS[room]}
            selected={selectedRooms.includes(room)}
            onSelectedChange={(isSelected) => onChange(toggle(selectedRooms, room, isSelected))}
          >
            {room}
          </Chip>
        ))}
      </div>
    </div>
  );
}

interface SortSelectProps {
  id: string;
  value: SortOrder;
  onChange: (sortOrder: SortOrder) => void;
  style?: CSSProperties;
}

function SortSelect({ id, value, onChange, style }: SortSelectProps) {
  return (
    <div style={style ?? stackedFieldStyle}>
      <Label as="label" htmlFor={id} size="sm">
        Sort by
      </Label>
      <Select
        id={id}
        size="sm"
        iconStart="arrow-up-down"
        value={value}
        onValueChange={(nextValue) => onChange(nextValue as SortOrder)}
      >
        {(Object.keys(SORT_LABELS) as SortOrder[]).map((sortOrder) => (
          <SelectItem key={sortOrder} value={sortOrder}>
            {SORT_LABELS[sortOrder]}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}

/* ---------------------------------------------------------------
 * Filter bar
 * --------------------------------------------------------------- */

function FilterBarRecipe() {
  const [selectedRooms, setSelectedRooms] = useState<SampleRoom[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>('relevance');
  const firstChipRef = useRef<HTMLButtonElement>(null);
  const products = filterAndSort(selectedRooms, sortOrder);

  function clearFilters() {
    setSelectedRooms([]);
    // The button is about to disappear: hand the focus to the start of the filters.
    firstChipRef.current?.focus();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={filterRowStyle}>
        <RoomChips
          labelId="room-filter-label"
          selectedRooms={selectedRooms}
          onChange={setSelectedRooms}
          firstChipRef={firstChipRef}
          style={filterRowFieldStyle}
        />
        <SortSelect
          id="sort-products"
          value={sortOrder}
          onChange={setSortOrder}
          style={filterRowFieldStyle}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minBlockSize: '2rem' }}>
        <Text as="p" size="sm" role="status" style={{ margin: 0 }}>
          {countProducts(products.length)}
        </Text>
        {selectedRooms.length > 0 && (
          <Button variant="secondary" appearance="ghost" size="xs" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      <SampleProductGrid products={products} />
    </div>
  );
}

export const FilterBar: Story = {
  name: 'Filter Bar (A11y)',
  render: () => <FilterBarRecipe />,
  parameters: {
    docs: {
      description: {
        story:
          'Pick "Kitchen" and "Bathroom": the count drops to 8 and the grid follows. Sort by price, then press "Clear filters": every product comes back and the focus lands on the first chip.',
      },
      source: {
        code: `<Label id="room-filter-label" size="sm">Filter by room</Label>
<div role="group" aria-labelledby="room-filter-label">
  {rooms.map((room, index) => (
    <Chip
      key={room}
      ref={index === 0 ? firstChipRef : undefined}
      size="sm"
      icon={roomIcons[room]}
      selected={selectedRooms.includes(room)}
      onSelectedChange={(isSelected) => toggleRoom(room, isSelected)}
    >
      {room}
    </Chip>
  ))}
</div>

<Label as="label" htmlFor="sort-products" size="sm">Sort by</Label>
<Select id="sort-products" size="sm" iconStart="arrow-up-down" value={sort} onValueChange={setSort}>
  <SelectItem value="relevance">Relevance</SelectItem>
  <SelectItem value="price-ascending">Price: low to high</SelectItem>
</Select>

<Text as="p" size="sm" role="status">{products.length} products</Text>
{selectedRooms.length > 0 && (
  <Button
    variant="secondary"
    appearance="ghost"
    size="xs"
    onClick={() => {
      clearRooms();
      firstChipRef.current?.focus();
    }}
  >
    Clear filters
  </Button>
)}`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group', { name: 'Filter by room' })).toBeInTheDocument();
    await expect(canvas.getByRole('status')).toHaveTextContent('16 products');
    await expect(canvas.queryByRole('button', { name: 'Clear filters' })).not.toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * Filter Bar (A11y): interaction (test only)
 * --------------------------------------------------------------- */

export const FilterBarInteraction: Story = {
  ...FilterBar,
  name: 'Filter Bar (A11y): Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Kitchen' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Bathroom' }));
    await expect(canvas.getByRole('button', { name: 'Kitchen' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(canvas.getByRole('status')).toHaveTextContent('8 products');

    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('16 products');
    await expect(canvas.getByRole('button', { name: 'Bathroom' })).toHaveFocus();
  },
};

/* ---------------------------------------------------------------
 * Filters in a dialog (on a phone)
 * --------------------------------------------------------------- */

function FilterDialogRecipe() {
  const [appliedRooms, setAppliedRooms] = useState<SampleRoom[]>([]);
  const [appliedSort, setAppliedSort] = useState<SortOrder>('relevance');
  const [draftRooms, setDraftRooms] = useState<SampleRoom[]>([]);
  const [draftSort, setDraftSort] = useState<SortOrder>('relevance');
  const [dialogOpen, setDialogOpen] = useState(false);
  const products = filterAndSort(appliedRooms, appliedSort);
  const draftCount = filterAndSort(draftRooms, draftSort).length;

  function handleOpenChange(isOpen: boolean) {
    // Every opening starts from the filters in use, so a closed draft is thrown away.
    if (isOpen) {
      setDraftRooms(appliedRooms);
      setDraftSort(appliedSort);
    }
    setDialogOpen(isOpen);
  }

  function applyFilters() {
    setAppliedRooms(draftRooms);
    setAppliedSort(draftSort);
    setDialogOpen(false);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '22rem',
        maxWidth: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text as="p" size="sm" role="status" style={{ margin: 0 }}>
          {countProducts(products.length)}
        </Text>

        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="secondary" appearance="outline" size="sm" icon="sliders-horizontal">
              {appliedRooms.length ? `Filters (${appliedRooms.length})` : 'Filters'}
            </Button>
          </DialogTrigger>

          <DialogContent size="sm" initialFocus="first" closeLabel="Close filters">
            <DialogTitle>Filters</DialogTitle>
            <DialogDescription>Nothing changes until you show the products.</DialogDescription>
            <DialogBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <RoomChips
                  labelId="dialog-room-filter-label"
                  selectedRooms={draftRooms}
                  onChange={setDraftRooms}
                />
                <SortSelect id="dialog-sort-products" value={draftSort} onChange={setDraftSort} />
              </div>
            </DialogBody>
            <DialogFooter>
              <Button
                variant="secondary"
                appearance="ghost"
                size="md"
                disabled={draftRooms.length === 0}
                onClick={() => setDraftRooms([])}
              >
                Clear filters
              </Button>
              <Button variant="primary" appearance="fill" size="md" onClick={applyFilters}>
                {`Show ${countProducts(draftCount)}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <SampleProductGrid products={products} />
    </div>
  );
}

export const FiltersInADialog: Story = {
  name: 'Filters in a Dialog (A11y)',
  render: () => <FilterDialogRecipe />,
  parameters: {
    docs: {
      description: {
        story:
          'The same controls on a phone, behind a "Filters" button. Inside, the choices are a draft: the main button counts what they would show ("Show 8 products") and only that button applies them. The trigger then says how many filters are on, and the focus returns to it.',
      },
      source: {
        code: `<Dialog open={dialogOpen} onOpenChange={openWithFiltersInUse}>
  <DialogTrigger asChild>
    <Button variant="secondary" appearance="outline" size="sm" icon="sliders-horizontal">
      {rooms.length ? \`Filters (\${rooms.length})\` : 'Filters'}
    </Button>
  </DialogTrigger>

  <DialogContent size="sm" initialFocus="first" closeLabel="Close filters">
    <DialogTitle>Filters</DialogTitle>
    <DialogDescription>Nothing changes until you show the products.</DialogDescription>
    <DialogBody>
      {/* The same chips and sort order, bound to the draft */}
    </DialogBody>
    <DialogFooter>
      <Button variant="secondary" appearance="ghost" size="md" onClick={clearDraft}>
        Clear filters
      </Button>
      <Button variant="primary" appearance="fill" size="md" onClick={applyDraft}>
        Show {draftCount} products
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
      },
      story: { height: '640px' },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Filters' })).toBeEnabled();
    await expect(canvas.getByRole('status')).toHaveTextContent('16 products');
  },
};

/* ---------------------------------------------------------------
 * Filters in a Dialog (A11y): interaction (test only)
 * --------------------------------------------------------------- */

export const FiltersInADialogInteraction: Story = {
  ...FiltersInADialog,
  name: 'Filters in a Dialog (A11y): Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Filters' }));

    await userEvent.click(await page.findByRole('button', { name: 'Kitchen' }));
    await expect(page.getByRole('button', { name: 'Show 4 products' })).toBeInTheDocument();
    // A draft: the page behind the dialog has not changed yet. The modal hides that page from
    // assistive technology while it is open, hence `hidden: true`.
    await expect(canvas.getByRole('status', { hidden: true })).toHaveTextContent('16 products');

    await userEvent.click(page.getByRole('button', { name: 'Show 4 products' }));
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument());
    const trigger = canvas.getByRole('button', { name: 'Filters (1)' });
    await expect(trigger).toHaveFocus();
    await expect(canvas.getByRole('status')).toHaveTextContent('4 products');
  },
};
