import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { SelectGroup, SelectItem } from '../Select';
import type { FormEvent } from 'react';
import { Text } from '../Typography';
import { Store } from 'lucide-react';
import { Button } from '../Button';
import { useState } from 'react';
import { SelectField } from './';

const ROOM_OPTIONS = (
  <>
    <SelectItem value="bathroom">Bathroom</SelectItem>
    <SelectItem value="bedroom">Bedroom</SelectItem>
    <SelectItem value="kitchen">Kitchen</SelectItem>
    <SelectItem value="living-room">Living room</SelectItem>
  </>
);

const meta = {
  title: 'Design System/Components/Forms/SelectField',
  component: SelectField,
  tags: ['autodocs'],
  args: {
    label: 'Room',
    hint: 'Shows products made for this room.',
    placeholder: 'Choose a room',
    size: 'md',
    children: ROOM_OPTIONS,
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `SelectField` component is the default single-choice form field: a visible `label`, the `Select`, an optional `hint` and an `error` message required whenever `invalid` is `true`, all linked for assistive technology.\n\n' +
          '### Best Practices\n' +
          '- **Always label:** The label stays visible. Never use the placeholder as the label.\n' +
          '- **Required fields:** Explain the asterisk once above the first field. Give a required field a `placeholder` so it starts empty and the person makes a real choice.\n' +
          '- **Hints:** Use them for context ("Shows products made for this room"), not to repeat the label.\n' +
          '- **Errors:** Whenever `invalid` is `true`, pass an `error` that says how to fix it ("Choose the room the product is for"). Validate on submit and move focus to the first invalid field.\n' +
          '- **Groups:** Use `SelectGroup label` to split a long list into named sections.\n\n' +
          '### Key Features\n' +
          '- **Label** — a real `<label for>` built from the Typography `Label`, scaled with the field size.\n' +
          '- **Descriptions** — `aria-describedby` points to the hint, then the error.\n' +
          '- **Errors** — TypeScript enforces a required `error` message whenever `invalid` is `true`. Sets `aria-invalid` and prefixes the message with a screen-reader-only "Error:".\n' +
          '- **Required** — `required` sets `aria-required`, shows a decorative asterisk and, inside a form, makes the hidden native select validate the value.\n' +
          '- **Pass-through** — every other prop (`name`, `value`, `onValueChange`, the `SelectItem` children…) goes to the `Select`; `ref` points to the trigger `<button>`.',
      },
    },
  },
} satisfies Meta<typeof SelectField>;

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
    label: 'Room',
    hint: 'Shows products made for this room.',
    placeholder: 'Choose a room',
    size: 'md',
    invalid: false,
    required: false,
    disabled: false,
    children: ROOM_OPTIONS,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label. Always shown, never replaced by the placeholder.',
    },
    hint: {
      control: 'text',
      description: 'Persistent help text below the field.',
    },
    placeholder: {
      control: 'text',
      description: 'Prompt shown while nothing is chosen.',
    },
    invalid: {
      control: 'boolean',
      description:
        'Marks the field invalid. Requires a descriptive `error` message (enforced by TypeScript).',
    },
    error: {
      control: 'text',
      description: 'Error message, required when `invalid` is `true`.',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'The size of the field and its label. Defaults to `md`.',
    },
    required: {
      control: 'boolean',
      description: 'Marks the field as required and shows an asterisk.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the field and dims the label.',
    },
    children: {
      control: false,
      description: 'The `SelectItem` and `SelectGroup` elements.',
    },
  },
  render: (args) => (
    <div style={{ maxWidth: '22rem' }}>
      <SelectField {...args} />
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
    const select = canvas.getByRole('combobox', { name: 'Room' });
    await expect(select).toHaveAccessibleDescription('Shows products made for this room.');
    await chooseOption(canvasElement, select, 'Kitchen');
    await expect(select).toHaveTextContent('Kitchen');
  },
};

/* ---------------------------------------------------------------
 * All sizes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '22rem' }}>
      <SelectField size="lg" label="Large" placeholder="56px field">
        {ROOM_OPTIONS}
      </SelectField>
      <SelectField size="md" label="Medium" placeholder="48px field">
        {ROOM_OPTIONS}
      </SelectField>
      <SelectField size="sm" label="Small" placeholder="40px field">
        {ROOM_OPTIONS}
      </SelectField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The select field comes in 3 sizes. The label scales with the field (`Label` sm / md / lg). Size `md` is the default standard size.',
      },
      source: {
        code: `<SelectField size="lg" label="Large">…</SelectField>\n<SelectField size="md" label="Medium">…</SelectField>\n<SelectField size="sm" label="Small">…</SelectField>`,
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
 * With icons and option groups
 * --------------------------------------------------------------- */

export const WithIcon: Story = {
  name: 'With Icons and Groups',
  render: () => (
    <div style={{ maxWidth: '22rem' }}>
      <SelectField label="Store" placeholder="Choose a store" iconStart={<Store />}>
        <SelectGroup label="Furniture">
          <SelectItem value="ikea">IKEA</SelectItem>
          <SelectItem value="habitat">Habitat</SelectItem>
        </SelectGroup>
        <SelectGroup label="Storage">
          <SelectItem value="muji">Muji</SelectItem>
          <SelectItem value="the-container-store">The Container Store</SelectItem>
        </SelectGroup>
      </SelectField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The icon is passed straight to the `Select` and hidden from screen readers. `SelectGroup` splits a long list into named sections that screen readers announce.',
      },
      source: {
        code: `<SelectField label="Store" placeholder="Choose a store" iconStart={<Store />}>\n  <SelectGroup label="Furniture">\n    <SelectItem value="ikea">IKEA</SelectItem>\n  </SelectGroup>\n  <SelectGroup label="Storage">\n    <SelectItem value="muji">Muji</SelectItem>\n  </SelectGroup>\n</SelectField>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('combobox', { name: 'Store' }));
    const page = within(canvasElement.ownerDocument.body);
    await expect(await page.findByRole('group', { name: 'Storage' })).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
  },
};

/* ---------------------------------------------------------------
 * Error
 * --------------------------------------------------------------- */

export const WithError: Story = {
  name: 'Error State',
  render: () => (
    <div style={{ maxWidth: '22rem' }}>
      <SelectField
        label="Room"
        hint="Shows products made for this room."
        placeholder="Choose a room"
        required
        invalid
        error="Choose the room the product is for."
      >
        {ROOM_OPTIONS}
      </SelectField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'When `invalid` is `true`, TypeScript requires an `error` message. The field is marked invalid and the message is linked to it; screen readers read the hint first, then the error.',
      },
      source: {
        code: `<SelectField\n  label="Room"\n  hint="Shows products made for this room."\n  placeholder="Choose a room"\n  required\n  invalid\n  error="Choose the room the product is for."\n>\n  …\n</SelectField>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const room = canvas.getByRole('combobox', { name: 'Room' });
    await expect(room).toHaveAttribute('aria-invalid', 'true');
    await expect(room).toHaveAccessibleDescription(
      'Shows products made for this room. Error: Choose the room the product is for.',
    );
  },
};

/* ---------------------------------------------------------------
 * Disabled
 * --------------------------------------------------------------- */

export const Disabled: Story = {
  render: () => (
    <div style={{ maxWidth: '22rem' }}>
      <SelectField
        label="Delivery slot"
        hint="Available after you choose a store."
        placeholder="Choose a slot"
        disabled
      >
        <SelectItem value="morning">Morning</SelectItem>
        <SelectItem value="afternoon">Afternoon</SelectItem>
      </SelectField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A `disabled` field dims its label and cannot be focused. Say in the hint what unlocks it, and do not combine `required` with `disabled`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('combobox', { name: 'Delivery slot' })).toBeDisabled();
  },
};

/* ---------------------------------------------------------------
 * Interactive Pseudo States
 * --------------------------------------------------------------- */

export const PseudoStates: Story = {
  name: 'Interactive Pseudo States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '22rem' }}>
      <SelectField label="Default" placeholder="Choose a room">
        {ROOM_OPTIONS}
      </SelectField>
      <SelectField label="Hover" placeholder="Choose a room" selectClassName="pseudo-hover">
        {ROOM_OPTIONS}
      </SelectField>
      <SelectField label="Focus" placeholder="Choose a room" selectClassName="pseudo-focus-visible">
        {ROOM_OPTIONS}
      </SelectField>
      <SelectField
        label="Invalid + focus"
        placeholder="Choose a room"
        invalid
        error="Choose the room the product is for."
        selectClassName="pseudo-focus-visible"
      >
        {ROOM_OPTIONS}
      </SelectField>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the interactive states of the field using the `storybook-addon-pseudo-states` plugin. The label, hint and error stay the same; only the edge of the select box changes:\n\n' +
          '- **Default** — a 1px neutral border.\n' +
          '- **Hover** — the border turns darker, a hint that the field can be opened. Invalid, disabled and open fields keep their own border.\n' +
          '- **Focus** — keyboard focus (`:focus-visible`) thickens the border to 2px in the brand colour, adds a pale brand halo around the field and colours the chevron. The open list uses the same look, so focus stays visible while people pick an option.\n' +
          '- **Invalid + focus** — the same 2px edge and halo in the error colour, so the field still reads as invalid while focused. The error message below keeps its icon and text, so the state never depends on colour alone.\n\n' +
          '`selectClassName` goes to the trigger `<button>`. You can also use the toolbar above the canvas to toggle these states globally on any component.',
      },
    },
    pseudo: {
      hover: ['.pseudo-hover'],
      focusVisible: ['.pseudo-focus-visible'],
    },
  },
};

/* ---------------------------------------------------------------
 * Form example (recipe)
 * --------------------------------------------------------------- */

const SAVE_FIELDS = [
  { name: 'room', label: 'Room', placeholder: 'Choose a room', error: 'Choose the room.' },
  { name: 'store', label: 'Store', placeholder: 'Choose a store', error: 'Choose a store.' },
] as const;

type SaveFieldName = (typeof SAVE_FIELDS)[number]['name'];

function SaveSearchForm() {
  const [errors, setErrors] = useState<Partial<Record<SaveFieldName, string>>>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const nextErrors: Partial<Record<SaveFieldName, string>> = {};

    for (const field of SAVE_FIELDS) {
      if (!formData.get(field.name)) nextErrors[field.name] = field.error;
    }

    setErrors(nextErrors);

    const firstInvalid = SAVE_FIELDS.find((field) => nextErrors[field.name]);
    if (firstInvalid) {
      form.querySelector<HTMLButtonElement>(`#${firstInvalid.name}-select`)?.focus();
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-label="Save search"
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '22rem' }}
    >
      <Text size="sm" style={{ margin: 0 }}>
        Fields marked with an asterisk (*) are required.
      </Text>
      <SelectField
        id="room-select"
        name="room"
        label="Room"
        placeholder="Choose a room"
        required
        {...(errors.room ? { invalid: true, error: errors.room } : { invalid: false })}
      >
        {ROOM_OPTIONS}
      </SelectField>
      <SelectField
        id="store-select"
        name="store"
        label="Store"
        placeholder="Choose a store"
        required
        {...(errors.store ? { invalid: true, error: errors.store } : { invalid: false })}
      >
        <SelectItem value="ikea">IKEA</SelectItem>
        <SelectItem value="muji">Muji</SelectItem>
      </SelectField>
      <div>
        <Button variant="primary" appearance="fill" size="lg" type="submit">
          Save search
        </Button>
      </div>
    </form>
  );
}

export const FormExample: Story = {
  name: 'Form Example (A11y)',
  render: () => <SaveSearchForm />,
  parameters: {
    docs: {
      description: {
        story:
          'A recipe composing `SelectField` and `Button`. Both fields start on their placeholder, validation runs on submit, each error says how to fix it, and focus moves to the first invalid field.',
      },
      source: {
        code: `<form noValidate onSubmit={handleSubmit}>\n  <Text size="sm">Fields marked with an asterisk (*) are required.</Text>\n  <SelectField\n    name="room"\n    label="Room"\n    placeholder="Choose a room"\n    required\n    {...(errors.room ? { invalid: true, error: errors.room } : { invalid: false })}\n  >\n    …\n  </SelectField>\n  <Button variant="primary" appearance="fill" size="lg" type="submit">Save search</Button>\n</form>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await chooseOption(canvasElement, canvas.getByRole('combobox', { name: 'Room' }), 'Kitchen');
    await userEvent.click(canvas.getByRole('button', { name: 'Save search' }));
    const store = canvas.getByRole('combobox', { name: 'Store' });
    await expect(store).toHaveFocus();
    await expect(store).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getByRole('combobox', { name: 'Room' })).not.toHaveAttribute(
      'aria-invalid',
    );
  },
};
