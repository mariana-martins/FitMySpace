import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ArrowUpDown, Store } from 'lucide-react';
import { LabelledField } from '../../docs';
import { Select, SelectItem } from './';
import { Label } from '../Typography';

const STORE_OPTIONS = (
  <>
    <SelectItem value="ikea">IKEA</SelectItem>
    <SelectItem value="muji">Muji</SelectItem>
    <SelectItem value="the-container-store">The Container Store</SelectItem>
  </>
);

const meta = {
  title: 'Design System/Components/Forms/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    placeholder: 'Choose a store',
    size: 'md',
    children: STORE_OPTIONS,
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Select` component is the bare single-choice field, built on Radix Select: a trigger drawn as the field box, with a chevron and an optional start icon, and a styled list of `SelectItem` options. It has no label of its own; for form fields use `SelectField`. Every example below gives it one, because a form control always needs a visible label.\n\n' +
          '### Best Practices\n' +
          '- **Visible label:** Use `SelectField` for form fields. Use the bare `Select` only for layouts it does not cover, such as an inline "Sort by", and still tie it to visible text: a `<Label as="label" htmlFor>` or `aria-labelledby` pointing at a visible heading. Never rely on `aria-label` or the placeholder alone: the placeholder disappears once an option is chosen.\n' +
          '- **When to use:** One choice from about 5 to 15 options. For 2 to 4 options, radio buttons show every choice at once; for very long lists, a searchable field works better.\n' +
          '- **Placeholder:** Use `placeholder` for the prompt ("Choose a store"). It is not an option and cannot be picked again, so a filter that can mean "everything" needs an explicit "All stores" item.\n' +
          '- **Short options:** Keep option text short and sorted in a predictable order (alphabetical, or by size).\n' +
          '- **No multiple:** For several choices, use Checkboxes or Chips; `multiple` is not supported.\n\n' +
          '### Key Features\n' +
          '- **Radix Select** — arrows, Home/End, type-ahead and Escape work in the list; focus returns to the trigger, and a hidden native `<select>` submits the value inside a `<form>`.\n' +
          '- **Styled list** — the list opens below the trigger, as wide as it, with a check mark on the chosen option and a pale brand highlight.\n' +
          '- **Same box as Input** — border, focus halo, sizes (40/48/56px) and colours match `Input`, so the two line up in a form.\n' +
          '- **Placeholder** — shown in the placeholder colour until a value is chosen.\n' +
          '- **Decorative icons** — the chevron and `iconStart` are hidden from screen readers.\n' +
          '- **Pass-through** — state props (`value`, `onValueChange`, `name`, `required`…) go to the Radix root and the rest (`id`, `aria-*`…) to the trigger; `ref` points to the trigger `<button>`.',
      },
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Opens a select and clicks an option. The list renders in a portal, outside the canvas. */
async function chooseOption(canvasElement: HTMLElement, trigger: HTMLElement, optionName: string) {
  await userEvent.click(trigger);
  const page = within(canvasElement.ownerDocument.body);
  await userEvent.click(await page.findByRole('option', { name: optionName }));
}

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  args: {
    placeholder: 'Choose a store',
    size: 'md',
    invalid: false,
    disabled: false,
    required: false,
    children: STORE_OPTIONS,
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Prompt shown while nothing is chosen. It is not an option.',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Visual size: height, padding, font size and icon size. Defaults to `md`.',
    },
    invalid: {
      control: 'boolean',
      description:
        'Marks the value invalid. Pair it with a visible error message (`SelectField` does this).',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the select.',
    },
    required: {
      control: 'boolean',
      description:
        'Marks the select as required (`aria-required`); inside a form, the hidden native select validates it.',
    },
    iconStart: {
      control: false,
      description: 'Decorative icon before the value. Hidden from screen readers.',
    },
    children: {
      control: false,
      description: 'The `SelectItem` and `SelectGroup` elements.',
    },
  },
  render: (args) => (
    <div style={{ maxWidth: '22rem' }}>
      <LabelledField label="Store" size={args.size}>
        {(fieldId) => <Select {...args} id={fieldId} />}
      </LabelledField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use the controls below to experiment with all possible combinations of props.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const select = canvas.getByRole('combobox', { name: 'Store' });
    await expect(select).toHaveTextContent('Choose a store');
    await chooseOption(canvasElement, select, 'Muji');
    await expect(select).toHaveTextContent('Muji');
  },
};

/* ---------------------------------------------------------------
 * All sizes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '22rem' }}>
      <LabelledField label="Large" size="lg">
        {(fieldId) => (
          <Select id={fieldId} size="lg" placeholder="56px field">
            {STORE_OPTIONS}
          </Select>
        )}
      </LabelledField>
      <LabelledField label="Medium" size="md">
        {(fieldId) => (
          <Select id={fieldId} size="md" placeholder="48px field">
            {STORE_OPTIONS}
          </Select>
        )}
      </LabelledField>
      <LabelledField label="Small" size="sm">
        {(fieldId) => (
          <Select id={fieldId} size="sm" placeholder="40px field">
            {STORE_OPTIONS}
          </Select>
        )}
      </LabelledField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The select comes in 3 sizes with the same heights as `Input`, so a select and a text field of the same size line up. Size `md` is the default standard size. Match the `Label` size to the field.',
      },
      source: {
        code: `<Label as="label" htmlFor="store" size="lg">Store</Label>\n<Select id="store" size="lg">…</Select>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('combobox', { name: 'Large' })).toBeInTheDocument();
    await expect(canvas.getByRole('combobox', { name: 'Small' })).toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * With icons
 * --------------------------------------------------------------- */

export const WithIcon: Story = {
  name: 'With Icons',
  render: () => (
    <div style={{ maxWidth: '22rem' }}>
      <LabelledField label="Store">
        {(fieldId) => (
          <Select id={fieldId} placeholder="Choose a store" iconStart={<Store />}>
            {STORE_OPTIONS}
          </Select>
        )}
      </LabelledField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'An icon before the value hints at what the list holds. It is decorative and hidden from screen readers; the visible label gives the select its name.',
      },
      source: {
        code: `<Label as="label" htmlFor="store">Store</Label>\n<Select id="store" placeholder="Choose a store" iconStart={<Store />}>\n  <SelectItem value="ikea">IKEA</SelectItem>\n  …\n</Select>`,
      },
    },
  },
};

/* ---------------------------------------------------------------
 * Disabled and invalid
 * --------------------------------------------------------------- */

export const Disabled: Story = {
  name: 'Disabled and Invalid',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '22rem' }}>
      <LabelledField label="Delivery store">
        {(fieldId) => (
          <Select id={fieldId} defaultValue="ikea" disabled>
            {STORE_OPTIONS}
          </Select>
        )}
      </LabelledField>
      <LabelledField label="Pickup store">
        {(fieldId) => (
          <Select id={fieldId} placeholder="Choose a store" invalid>
            {STORE_OPTIONS}
          </Select>
        )}
      </LabelledField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A `disabled` select cannot be focused or opened. An `invalid` select shows the error colour; on its own it needs a visible message linked with `aria-describedby`, which `SelectField` wires for you.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('combobox', { name: 'Delivery store' })).toBeDisabled();
    await expect(canvas.getByRole('combobox', { name: 'Pickup store' })).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  },
};

/* ---------------------------------------------------------------
 * Interactive Pseudo States
 * --------------------------------------------------------------- */

export const PseudoStates: Story = {
  name: 'Interactive Pseudo States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '22rem' }}>
      <LabelledField label="Default">
        {(fieldId) => (
          <Select id={fieldId} placeholder="Choose a store">
            {STORE_OPTIONS}
          </Select>
        )}
      </LabelledField>
      <LabelledField label="Hover">
        {(fieldId) => (
          <Select id={fieldId} placeholder="Choose a store" className="pseudo-hover">
            {STORE_OPTIONS}
          </Select>
        )}
      </LabelledField>
      <LabelledField label="Focus">
        {(fieldId) => (
          <Select id={fieldId} placeholder="Choose a store" className="pseudo-focus-visible">
            {STORE_OPTIONS}
          </Select>
        )}
      </LabelledField>
      <LabelledField label="Invalid + focus">
        {(fieldId) => (
          <Select
            id={fieldId}
            placeholder="Choose a store"
            invalid
            className="pseudo-focus-visible"
          >
            {STORE_OPTIONS}
          </Select>
        )}
      </LabelledField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the interactive states of the trigger using the `storybook-addon-pseudo-states` plugin. Only the edge of the field changes:\n\n' +
          '- **Default** — a 1px neutral border.\n' +
          '- **Hover** — the border turns darker, a hint that the field can be opened. Invalid, disabled and open fields keep their own border.\n' +
          '- **Focus** — keyboard focus (`:focus-visible`) thickens the border to 2px in the brand colour, adds a pale brand halo around the field and colours the chevron. The open list uses the same look, so focus stays visible while people pick an option.\n' +
          '- **Invalid + focus** — the same 2px edge and halo in the error colour, so the field still reads as invalid while focused.\n\n' +
          '`className` goes to the trigger `<button>`. You can also use the toolbar above the canvas to toggle these states globally on any component.',
      },
    },
    pseudo: {
      hover: ['.pseudo-hover'],
      focusVisible: ['.pseudo-focus-visible'],
    },
  },
};

/* ---------------------------------------------------------------
 * Sort menu (recipe)
 * --------------------------------------------------------------- */

export const SortMenu: Story = {
  name: 'Sort Menu (A11y)',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', maxWidth: '24rem' }}>
      <Label as="label" htmlFor="sort-results" size="sm" style={{ whiteSpace: 'nowrap' }}>
        Sort by
      </Label>
      <Select id="sort-results" size="sm" defaultValue="relevance" iconStart={<ArrowUpDown />}>
        <SelectItem value="relevance">Relevance</SelectItem>
        <SelectItem value="price-ascending">Price: low to high</SelectItem>
        <SelectItem value="price-descending">Price: high to low</SelectItem>
        <SelectItem value="newest">Newest</SelectItem>
      </Select>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A recipe for a results toolbar: the bare `Select` next to a short inline label. The `Label` uses `htmlFor`, so the select is named "Sort by" and clicking the label focuses it. No placeholder: a sort order always has a value.',
      },
      source: {
        code: `<Label as="label" htmlFor="sort-results" size="sm">Sort by</Label>\n<Select id="sort-results" size="sm" defaultValue="relevance" iconStart={<ArrowUpDown />}>\n  <SelectItem value="relevance">Relevance</SelectItem>\n  <SelectItem value="price-ascending">Price: low to high</SelectItem>\n  …\n</Select>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sort = canvas.getByRole('combobox', { name: 'Sort by' });
    await expect(sort).toHaveTextContent('Relevance');
    await chooseOption(canvasElement, sort, 'Newest');
    await expect(sort).toHaveTextContent('Newest');
  },
};
