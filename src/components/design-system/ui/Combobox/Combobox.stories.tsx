import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Text } from '../Typography';
import { useState } from 'react';
import { Combobox } from './';

import type { ComboboxOption, ComboboxProps } from './';

const meta = {
  title: 'Design System/Components/Forms/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  args: {
    label: 'Room',
    size: 'md',
    options: [],
  },
  parameters: {
    docs: {
      description: {
        component:
          'A `Combobox` is a text field that suggests while you type: rooms, stores, past searches. It is written by hand from the ARIA Authoring Practices "editable combobox with list autocomplete", because Radix has no combobox. The field is a `TextField` — the same label, hint, error and sizes — whose input takes `role="combobox"`; the suggestions are a `role="listbox"` below it.\n\n' +
          'The input keeps the focus the whole time. The arrow keys move a highlight through the suggestions, and `aria-activedescendant` tells a screen reader which one it is on; Enter picks it, Escape closes the list (and empties the field when the list is already closed), and a `role="status"` line says how many suggestions there are.\n\n' +
          '### Best Practices\n' +
          '- **The app owns the suggestions:** pass the ones to show in `options`, already filtered — locally, or by a request — and listen to `onInputValueChange`. The component never filters or fetches.\n' +
          '- **Suggest, do not force:** what people type stays theirs. Picking a suggestion writes its label into the field and calls `onOptionSelect`; Enter with nothing highlighted still submits the form.\n' +
          '- **Keep the list short:** eight or so suggestions, the best first. The list scrolls past 384px, but nobody reads that far.\n' +
          '- **Give an `emptyMessage`** ("No rooms match") when an empty list would leave people wondering whether anything happened.\n' +
          '- **Pick from a fixed, short list with `Select`** instead: a combobox is for when typing is faster than scrolling.\n\n' +
          '### Key Features\n' +
          '- **Three sizes** — `sm`, `md` and `lg`, the heights of `Input` and `Button`; the list follows the field.\n' +
          '- **Options with more** — an `icon` by name, a quieter `description` line, and `disabled`.\n' +
          '- **Keyboard** — ArrowDown and ArrowUp move and wrap, skipping disabled options; Alt+ArrowDown opens without moving; Enter picks; Escape closes, then clears.\n' +
          '- **Announced** — the number of suggestions, or the empty message, through a `role="status"` line (`formatResultCount` for other words).\n' +
          '- **Positioned by Radix Popover** — in a portal on the floating layer, as wide as the field, kept on screen; a click outside closes it.\n\n' +
          '### Patterns\n' +
          '- [Product Search](?path=/docs/design-system-patterns-tasks-product-search--docs) — suggestions while typing in the search box.',
      },
    },
  },
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

const ROOMS: ComboboxOption[] = [
  { value: 'bathroom', label: 'Bathroom', icon: 'bath' },
  { value: 'bedroom', label: 'Bedroom', icon: 'bed' },
  { value: 'kitchen', label: 'Kitchen', icon: 'cooking-pot' },
  { value: 'living-room', label: 'Living room', icon: 'sofa' },
];

function matching(options: ComboboxOption[], query: string) {
  const normalisedQuery = query.trim().toLowerCase();
  return options.filter((option) => option.label.toLowerCase().includes(normalisedQuery));
}

/* The list opens in a portal at the end of <body>, outside the story's own
   node, so the queries for it go through the document. */
function page() {
  return within(document.body);
}

/** A combobox that filters a fixed list by what is typed, as the app would. */
function FilteredCombobox({
  allOptions = ROOMS,
  ...props
}: Omit<ComboboxProps, 'options' | 'invalid' | 'error'> & { allOptions?: ComboboxOption[] }) {
  const [query, setQuery] = useState(props.defaultInputValue ?? '');

  return (
    <div style={{ width: '22rem', maxWidth: '100%' }}>
      <Combobox
        {...props}
        options={matching(allOptions, query)}
        inputValue={query}
        onInputValueChange={setQuery}
      />
    </div>
  );
}

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  args: {
    label: 'Room',
    hint: 'Type to see the rooms you saved.',
    size: 'md',
    placeholder: 'e.g. Kitchen',
    emptyMessage: 'No rooms match',
    disabled: false,
    options: [],
  },
  argTypes: {
    label: { control: 'text', description: 'Visible label, tied to the input.' },
    hint: { control: 'text', description: 'Help under the field, read after the label.' },
    size: {
      control: { type: 'inline-radio' },
      options: ['sm', 'md', 'lg'],
      description: 'Height of the field and of the options: 40px, 48px or 56px.',
    },
    placeholder: { control: 'text', description: 'An example, never the label.' },
    emptyMessage: {
      control: 'text',
      description: 'Shown, and announced, when the field has text and nothing matches.',
    },
    disabled: { control: 'boolean', description: 'Turns the field off; the list never opens.' },
    options: {
      control: false,
      description: 'The suggestions to show now, already filtered by the app.',
    },
  },
  render: ({ options: _options, ...args }) => <FilteredCombobox {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'Use the controls below to experiment with all possible combinations of props. Type in the field: the rooms that match appear below it. ArrowDown and ArrowUp move through them, Enter picks one, Escape closes the list.',
      },
      source: {
        code: `const [query, setQuery] = useState('');
const options = rooms.filter((room) => room.label.toLowerCase().includes(query.toLowerCase()));

<Combobox
  label="Room"
  hint="Type to see the rooms you saved."
  size="md"
  placeholder="e.g. Kitchen"
  emptyMessage="No rooms match"
  options={options}
  inputValue={query}
  onInputValueChange={setQuery}
  onOptionSelect={(room) => goToRoom(room.value)}
/>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'Room' });
    await expect(input).toHaveAttribute('aria-expanded', 'false');
    await expect(input).toHaveAccessibleDescription('Type to see the rooms you saved.');
  },
};

/* ---------------------------------------------------------------
 * Default: interaction (test only)
 *
 * Hidden from the sidebar and the docs page (`!dev`, `!autodocs`), but
 * `npm run test:storybook` still plays it: a visible story may not open
 * its own list on load.
 * --------------------------------------------------------------- */

export const DefaultInteraction: Story = {
  ...Default,
  name: 'Default: Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'Room' });

    await userEvent.type(input, 'room');
    const listbox = await page().findByRole('listbox', { name: 'Room' });
    await expect(within(listbox).getAllByRole('option')).toHaveLength(3);
    await expect(input).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(page().getByRole('option', { name: 'Bedroom' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(page().queryByRole('listbox')).not.toBeInTheDocument());
    await expect(input).toHaveValue('Bedroom');
  },
};

/* ---------------------------------------------------------------
 * All sizes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <FilteredCombobox
          key={size}
          label={`Room (${size})`}
          size={size}
          placeholder="e.g. Kitchen"
        />
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`sm` 40px, `md` 48px and `lg` 56px, the heights of `Input` and `Button`. The options in the list take the size of their field, so a small field never opens a list of big rows.',
      },
      source: {
        code: `<Combobox label="Room" size="sm" … />
<Combobox label="Room" size="md" … />
<Combobox label="Room" size="lg" … />`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('combobox')).toHaveLength(3);
  },
};

/* ---------------------------------------------------------------
 * With icons
 * --------------------------------------------------------------- */

const STORES: ComboboxOption[] = [
  { value: 'ikea', label: 'IKEA', icon: 'store', description: '214 products' },
  { value: 'kmart', label: 'Kmart', icon: 'store', description: '96 products' },
  { value: 'bunnings', label: 'Bunnings', icon: 'store', description: '58 products' },
  {
    value: 'howards',
    label: 'Howards Storage World',
    icon: 'store',
    description: 'Not delivering to your area',
    disabled: true,
  },
];

export const WithIcon: Story = {
  name: 'With Icons',
  render: () => (
    <FilteredCombobox
      label="Store"
      iconStart="search"
      placeholder="e.g. IKEA"
      allOptions={STORES}
      defaultInputValue=""
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`iconStart` puts a decorative icon in the field, and each option can take an `icon` and a quieter `description`. A disabled option stays in the list, in the disabled colour, says why in its description, and is skipped by the arrow keys.',
      },
      source: {
        code: `<Combobox
  label="Store"
  iconStart="search"
  options={[
    { value: 'ikea', label: 'IKEA', icon: 'store', description: '214 products' },
    { value: 'howards', label: 'Howards Storage World', icon: 'store',
      description: 'Not delivering to your area', disabled: true },
  ]}
  …
/>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('combobox', { name: 'Store' })).toBeEnabled();
  },
};

/* ---------------------------------------------------------------
 * Disabled
 * --------------------------------------------------------------- */

export const Disabled: Story = {
  render: () => <FilteredCombobox label="Room" defaultInputValue="Kitchen" disabled />,
  parameters: {
    docs: {
      description: {
        story:
          'A disabled combobox looks and behaves like a disabled `TextField`: it takes no focus and its list never opens.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('combobox', { name: 'Room' })).toBeDisabled();
  },
};

/* ---------------------------------------------------------------
 * With an error
 * --------------------------------------------------------------- */

export const WithError: Story = {
  name: 'With an Error',
  render: () => (
    <div style={{ width: '22rem', maxWidth: '100%' }}>
      <Combobox
        label="Room"
        options={[]}
        defaultInputValue="Garage"
        invalid
        error="Pick one of your rooms, or add Garage first."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`invalid` requires an `error`, exactly as in `TextField`: the message names the problem and the way out, is tied to the input with `aria-describedby`, and starts with a hidden "Error: ".',
      },
      source: {
        code: `<Combobox
  label="Room"
  options={options}
  invalid
  error="Pick one of your rooms, or add Garage first."
/>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('combobox', { name: 'Room' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  },
};

/* ---------------------------------------------------------------
 * Interactive pseudo states
 * --------------------------------------------------------------- */

export const PseudoStates: Story = {
  name: 'Interactive Pseudo States',
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        width: '22rem',
        maxWidth: '100%',
      }}
    >
      <Combobox label="Default" options={[]} placeholder="e.g. Kitchen" />
      <Combobox
        label="Hover"
        options={[]}
        placeholder="e.g. Kitchen"
        inputClassName="pseudo-hover"
      />
      <Combobox
        label="Focus"
        options={[]}
        placeholder="e.g. Kitchen"
        inputClassName="pseudo-focus-within"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The field takes the states of `TextField` through `inputClassName`, shown with the `storybook-addon-pseudo-states` plugin. The highlighted option in the open list uses the soft sage of a highlighted `Select` option.',
      },
    },
    pseudo: {
      hover: ['.pseudo-hover'],
      focusWithin: ['.pseudo-focus-within'],
    },
  },
};

/* ---------------------------------------------------------------
 * Room search (recipe)
 * --------------------------------------------------------------- */

function RoomSearchRecipe() {
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState('');

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
      <Combobox
        label="Go to a room"
        iconStart="search"
        placeholder="e.g. Bedroom"
        options={matching(ROOMS, query)}
        inputValue={query}
        onInputValueChange={setQuery}
        onOptionSelect={(room) => setPicked(`Showing ${room.label}.`)}
        emptyMessage="No rooms match"
      />
      <Text as="p" size="sm" style={{ margin: 0, minBlockSize: '1lh' }}>
        {picked}
      </Text>
    </div>
  );
}

export const RoomSearch: Story = {
  name: 'Room Search (A11y)',
  render: () => <RoomSearchRecipe />,
  parameters: {
    docs: {
      description: {
        story:
          'Type "be": a screen reader hears "1 suggestion" from the status line. ArrowDown highlights **Bedroom** without moving the focus out of the field — the input says which option through `aria-activedescendant` — and Enter picks it, writes it into the field and tells the app, which shows what it did on the page. Type "garage" to hear "No rooms match".',
      },
      source: {
        code: `<Combobox
  label="Go to a room"
  iconStart="search"
  options={matching(rooms, query)}
  inputValue={query}
  onInputValueChange={setQuery}
  onOptionSelect={(room) => router.push(\`/rooms/\${room.value}\`)}
  emptyMessage="No rooms match"
/>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('combobox', { name: 'Go to a room' })).toHaveValue('');
  },
};

export const RoomSearchInteraction: Story = {
  ...RoomSearch,
  name: 'Room Search (A11y): Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'Go to a room' });

    await userEvent.type(input, 'garage');
    await expect(canvas.getByRole('status')).toHaveTextContent('No rooms match');

    await userEvent.clear(input);
    await userEvent.type(input, 'be');
    await expect(canvas.getByRole('status')).toHaveTextContent('1 suggestion');

    await userEvent.keyboard('{ArrowDown}');
    await expect(input).toHaveAttribute(
      'aria-activedescendant',
      page().getByRole('option', { name: 'Bedroom' }).id,
    );
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByText('Showing Bedroom.')).toBeVisible();
  },
};
