import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Bath, Bed, CookingPot, Sofa } from 'lucide-react';
import type { ComponentProps, ReactElement } from 'react';
import { Label, Text } from '../Typography';
import { Button } from '../Button';
import { useState } from 'react';
import { Chip } from './';

const meta = {
  title: 'Design System/Components/Actions/Chip',
  component: Chip,
  tags: ['autodocs'],
  args: {
    children: 'Bathroom',
    selected: false,
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Chip` component is a toggle button for filters: a native `<button>` with `aria-pressed`, pill-shaped, that people switch on and off. Its state is controlled by the parent through `selected` and `onSelectedChange`.\n\n' +
          '### Best Practices\n' +
          '- **Filters, not actions:** Use chips to narrow a list ("Bathroom", "Under €50"). For a one-off action, use a Button; for a static label, use a Badge.\n' +
          '- **Name the group:** Wrap related chips in an element with `role="group"` and an `aria-labelledby` that points to a visible heading or label, so screen readers say what the chips filter.\n' +
          '- **Keep the text:** The label must not change between states ("Bathroom", never "Remove Bathroom"); screen readers announce "pressed" instead.\n' +
          '- **Inside forms:** For a choice that is submitted with a form, use a Checkbox or radio buttons instead.\n' +
          '- **Show the result:** Update the list right away and say how many items match, e.g. in a live region near the results.\n\n' +
          '### Key Features\n' +
          '- **Native toggle** — `<button type="button" aria-pressed>`: Enter and Space work, and screen readers announce the state.\n' +
          '- **Not colour alone** — a selected chip gains a check mark and a 2px brand edge, drawn with an inset shadow so the layout never shifts.\n' +
          '- **2 sizes** — `sm` (32px) and `md` (40px), the Button heights, so chips and buttons line up.\n' +
          '- **Decorative icon** — `icon` is hidden from screen readers and swaps for the check mark while selected.\n' +
          '- **High contrast** — a selected chip uses the system highlight colours in Windows High Contrast.',
      },
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

/** Holds the state the parent would own, so clicking the chip toggles it. */
function ChipPlayground({ selected, onSelectedChange, ...chipProps }: ComponentProps<typeof Chip>) {
  const [isSelected, setIsSelected] = useState(selected);

  const handleSelectedChange = (nextSelected: boolean) => {
    setIsSelected(nextSelected);
    onSelectedChange?.(nextSelected);
  };

  return <Chip {...chipProps} selected={isSelected} onSelectedChange={handleSelectedChange} />;
}

export const Default: Story = {
  args: {
    children: 'Bathroom',
    selected: false,
    size: 'md',
    disabled: false,
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'The visible text. It names the chip and stays the same in both states.',
    },
    selected: {
      control: 'boolean',
      description: 'Whether the chip is on. Sets `aria-pressed` and the selected style.',
    },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md'],
      description: 'Chip size: 32px (`sm`) or 40px (`md`) tall, the Button heights.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the chip. Prefer hiding a filter that cannot apply.',
    },
    icon: {
      control: false,
      description: 'Decorative icon before the text. A check mark replaces it while selected.',
    },
    onSelectedChange: {
      description: 'Called with the next state when the chip is clicked.',
    },
  },
  // Keyed by the control, so changing `selected` in the panel starts the chip in that state.
  render: (args) => <ChipPlayground key={String(args.selected)} {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Use the controls below to experiment with all possible combinations of props.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chip = canvas.getByRole('button', { name: 'Bathroom' });
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(chip);
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(chip);
  },
};

/* ---------------------------------------------------------------
 * All sizes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Chip size="md" selected={false}>
          Medium
        </Chip>
        <Chip size="md" selected>
          Medium selected
        </Chip>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Chip size="sm" selected={false}>
          Small
        </Chip>
        <Chip size="sm" selected>
          Small selected
        </Chip>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Two sizes with the Button heights: `md` (40px) and `sm` (32px). Each is shown off and on: the selected chip adds a check mark, a pale brand fill and a thicker edge.',
      },
      source: {
        code: `<Chip size="md" selected={false}>Medium</Chip>\n<Chip size="md" selected>Medium selected</Chip>\n<Chip size="sm" selected={false}>Small</Chip>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Medium selected' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  },
};

/* ---------------------------------------------------------------
 * With icons
 * --------------------------------------------------------------- */

export const WithIcon: Story = {
  name: 'With Icons',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      <Chip size="md" selected={false} icon={<Bath />}>
        Bathroom
      </Chip>
      <Chip size="md" selected icon={<CookingPot />}>
        Kitchen
      </Chip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'An icon helps people scan a long row of filters. It is decorative and hidden from screen readers, and the check mark takes its place while the chip is selected (Kitchen).',
      },
      source: {
        code: `<Chip size="md" selected={false} icon={<Bath />}>Bathroom</Chip>`,
      },
    },
  },
};

/* ---------------------------------------------------------------
 * Disabled
 * --------------------------------------------------------------- */

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Chip size="md" selected={false} disabled>
        Garage
      </Chip>
      <Chip size="md" selected disabled>
        Garden
      </Chip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A `disabled` chip cannot be focused or toggled. Prefer hiding a filter that matches nothing; when you keep it, explain nearby why it is unavailable.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Garage' })).toBeDisabled();
  },
};

/* ---------------------------------------------------------------
 * Interactive Pseudo States
 * --------------------------------------------------------------- */

export const PseudoStates: Story = {
  name: 'Interactive Pseudo States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {[false, true].map((isSelected) => (
        <div key={String(isSelected)} style={{ display: 'flex', gap: '0.5rem' }}>
          <Chip size="md" selected={isSelected}>
            Default
          </Chip>
          <Chip size="md" selected={isSelected} className="pseudo-hover">
            Hover
          </Chip>
          <Chip size="md" selected={isSelected} className="pseudo-active">
            Active
          </Chip>
          <Chip size="md" selected={isSelected} className="pseudo-focus-visible">
            Focus
          </Chip>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the interactive states, off (top) and on (bottom), using the `storybook-addon-pseudo-states` plugin. You can also use the toolbar above the canvas to toggle these states globally on any component.',
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
 * Room filter (recipe)
 * --------------------------------------------------------------- */

const ROOMS: { name: string; icon: ReactElement }[] = [
  { name: 'Bathroom', icon: <Bath /> },
  { name: 'Bedroom', icon: <Bed /> },
  { name: 'Kitchen', icon: <CookingPot /> },
  { name: 'Living room', icon: <Sofa /> },
];

const PRODUCT_COUNT_BY_ROOM: Record<string, number> = {
  Bathroom: 12,
  Bedroom: 18,
  Kitchen: 24,
  'Living room': 9,
};

function RoomFilter() {
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  const toggleRoom = (roomName: string) => (isSelected: boolean) => {
    setSelectedRooms((currentRooms) =>
      isSelected
        ? [...currentRooms, roomName]
        : currentRooms.filter((currentRoom) => currentRoom !== roomName),
    );
  };

  const matchingProducts = (
    selectedRooms.length ? selectedRooms : Object.keys(PRODUCT_COUNT_BY_ROOM)
  )
    .map((roomName) => PRODUCT_COUNT_BY_ROOM[roomName])
    .reduce((total, count) => total + count, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Label id="room-filter-label" size="md">
        Filter by room
      </Label>
      <div
        role="group"
        aria-labelledby="room-filter-label"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
      >
        {ROOMS.map((room) => (
          <Chip
            key={room.name}
            size="md"
            icon={room.icon}
            selected={selectedRooms.includes(room.name)}
            onSelectedChange={toggleRoom(room.name)}
          >
            {room.name}
          </Chip>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Text as="p" size="sm" role="status" style={{ margin: 0 }}>
          {matchingProducts} products
        </Text>
        {selectedRooms.length > 0 && (
          <Button
            variant="secondary"
            appearance="ghost"
            size="xs"
            onClick={() => setSelectedRooms([])}
          >
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}

export const RoomFilterExample: Story = {
  name: 'Room Filter (A11y)',
  render: () => <RoomFilter />,
  parameters: {
    docs: {
      description: {
        story:
          'A recipe for a filter bar. `role="group"` with `aria-labelledby` names the chips "Filter by room", any number can be on, and a `role="status"` line announces the new product count after each change. In the app, keep the selected rooms in the URL and pass them in as `selected`.',
      },
      source: {
        code: `<Label id="room-filter-label" size="md">Filter by room</Label>\n<div role="group" aria-labelledby="room-filter-label">\n  {ROOMS.map((room) => (\n    <Chip\n      key={room.name}\n      size="md"\n      icon={room.icon}\n      selected={selectedRooms.includes(room.name)}\n      onSelectedChange={toggleRoom(room.name)}\n    >\n      {room.name}\n    </Chip>\n  ))}\n</div>\n<Text as="p" size="sm" role="status">{matchingProducts} products</Text>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('group', { name: 'Filter by room' });
    await userEvent.click(within(group).getByRole('button', { name: 'Kitchen' }));
    await userEvent.click(within(group).getByRole('button', { name: 'Bathroom' }));
    await expect(within(group).getByRole('button', { name: 'Kitchen' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(canvas.getByRole('status')).toHaveTextContent('36 products');

    await userEvent.click(canvas.getByRole('button', { name: 'Clear filters' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('63 products');
  },
};
