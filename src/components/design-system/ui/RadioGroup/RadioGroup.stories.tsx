import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { RadioGroup, RadioGroupItem } from './';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Text } from '../Typography';
import { Button } from '../Button';

const DELIVERY_OPTIONS = (
  <>
    <RadioGroupItem value="standard" label="Standard" />
    <RadioGroupItem value="express" label="Express" />
    <RadioGroupItem value="pickup" label="Store pickup" />
  </>
);

const meta = {
  title: 'Design System/Components/Forms/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs'],
  args: {
    label: 'Delivery',
    variant: 'primary',
    size: 'md',
    children: DELIVERY_OPTIONS,
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `RadioGroup` component asks one question with a few mutually exclusive answers. It is built on Radix RadioGroup: a visible group `label`, one `RadioGroupItem` per option, an optional `hint` and an `error` message required whenever `invalid` is `true`, all linked for assistive technology.\n\n' +
          '### Best Practices\n' +
          '- **When to use:** Exactly one choice from 2 to about 5 options, all visible at once. For more options use a `Select`; for independent choices use Checkboxes; for an on/off setting use a single Checkbox.\n' +
          '- **Ask a question:** The group `label` names what is chosen ("Delivery"), and each option label answers it ("Express").\n' +
          '- **Order and default:** Order options logically (cheapest first, smallest first). Preselect a sensible default with `defaultValue` unless the choice must be deliberate; then add `required` and validate on submit.\n' +
          '- **Layout:** Keep options stacked (`vertical`). Use `horizontal` only for 2 or 3 short options, such as "Yes" and "No".\n' +
          '- **Errors:** Whenever `invalid` is `true`, pass an `error` that says how to fix it ("Choose how to receive the order"). Move focus to the group on submit.\n\n' +
          '### Key Features\n' +
          '- **Radix RadioGroup** — `role="radiogroup"` with one `<button role="radio">` per option. Tab enters on the checked option, the arrow keys move and check (skipping disabled options), and Space checks. Inside a `<form>`, hidden native radios submit `name` and the value and follow form reset.\n' +
          '- **State** — the Radix API, as in `Select`: `value` / `defaultValue` and `onValueChange`.\n' +
          '- **Labels** — the group is named by its visible label (`aria-labelledby`); each option has a real `<label for>`, and an optional `hint` per option is linked with `aria-describedby`.\n' +
          '- **Required and errors** — `aria-required` and `aria-invalid` sit on the group, as MDN asks. TypeScript enforces the `error` message, prefixed with a screen-reader-only "Error:".\n' +
          '- **Variants and sizes** — `primary` (brand) and `secondary` (neutral) checked colours, and 3 sizes, both shared with `Checkbox`.',
      },
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  args: {
    label: 'Delivery',
    hint: 'Free delivery on orders over €50.',
    variant: 'primary',
    size: 'md',
    orientation: 'vertical',
    defaultValue: 'standard',
    invalid: false,
    required: false,
    disabled: false,
    children: DELIVERY_OPTIONS,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible group label: the question the options answer.',
    },
    hint: {
      control: 'text',
      description: 'Persistent help text below the options.',
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
      description:
        'Colour of the checked radio: `primary` (brand) or `secondary` (neutral). Defaults to `primary`.',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'The size of the radios and labels. Defaults to `md`.',
    },
    orientation: {
      control: { type: 'inline-radio' },
      options: ['vertical', 'horizontal'],
      description:
        'Stack the options or set them in a row. Layout only: every arrow key still moves between options.',
    },
    defaultValue: {
      control: { type: 'select' },
      options: ['standard', 'express', 'pickup'],
      description: 'The option checked at first, when the group is uncontrolled.',
    },
    invalid: {
      control: 'boolean',
      description:
        'Marks the group invalid. Requires a descriptive `error` message (enforced by TypeScript).',
    },
    error: {
      control: 'text',
      description: 'Error message, required when `invalid` is `true`.',
    },
    required: {
      control: 'boolean',
      description: 'Sets `aria-required` on the group and shows an asterisk.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables every option and dims their labels. The group label stays readable.',
    },
    children: {
      control: false,
      description: 'The `RadioGroupItem` elements.',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the controls below to experiment with all possible combinations of props.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('radiogroup', { name: 'Delivery' });
    await expect(group).toHaveAccessibleDescription('Free delivery on orders over €50.');
    await userEvent.click(canvas.getByText('Express'));
    await expect(canvas.getByRole('radio', { name: 'Express' })).toBeChecked();
  },
};

/* ---------------------------------------------------------------
 * All variants
 * --------------------------------------------------------------- */

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '3rem' }}>
      <RadioGroup label="Primary" variant="primary" defaultValue="express">
        {DELIVERY_OPTIONS}
      </RadioGroup>
      <RadioGroup label="Secondary" variant="secondary" defaultValue="express">
        {DELIVERY_OPTIONS}
      </RadioGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Two colours for the checked radio, the same as `Checkbox`. `primary` (default) uses the brand colour; `secondary` is a neutral dark fill for dense forms and filter panels, where the brand colour should stay for the main actions. Use one variant per form.',
      },
      source: {
        code: `<RadioGroup label="Delivery" variant="secondary" defaultValue="express">\n  <RadioGroupItem value="standard" label="Standard" />\n  …\n</RadioGroup>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const secondary = canvas.getByRole('radiogroup', { name: 'Secondary' });
    await expect(within(secondary).getByRole('radio', { name: 'Express' })).toBeChecked();
  },
};

/* ---------------------------------------------------------------
 * All sizes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
      <RadioGroup label="Large" size="lg" defaultValue="standard">
        {DELIVERY_OPTIONS}
      </RadioGroup>
      <RadioGroup label="Medium" size="md" defaultValue="standard">
        {DELIVERY_OPTIONS}
      </RadioGroup>
      <RadioGroup label="Small" size="sm" defaultValue="standard">
        {DELIVERY_OPTIONS}
      </RadioGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Three sizes, the same as `Checkbox`: a 24, 20 or 16px circle (in rem, so it grows with the text) next to the `Label` lg / md / sm, with a 12, 12 or 8px dot. Size `md` is the default standard size; the group label scales with it.',
      },
      source: {
        code: `<RadioGroup label="Delivery" size="lg">…</RadioGroup>\n<RadioGroup label="Delivery" size="md">…</RadioGroup>\n<RadioGroup label="Delivery" size="sm">…</RadioGroup>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('radiogroup', { name: 'Large' })).toBeInTheDocument();
    await expect(canvas.getByRole('radiogroup', { name: 'Small' })).toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * Hints and horizontal layout
 * --------------------------------------------------------------- */

export const WithHints: Story = {
  name: 'Option Hints and Horizontal Layout',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <RadioGroup label="Delivery" defaultValue="standard">
        <RadioGroupItem value="standard" label="Standard" hint="3 to 5 working days. Free." />
        <RadioGroupItem value="express" label="Express" hint="Next working day. €9." />
        <RadioGroupItem value="pickup" label="Store pickup" hint="Ready in 2 hours." />
      </RadioGroup>
      <RadioGroup label="Gift wrap" orientation="horizontal" defaultValue="no">
        <RadioGroupItem value="yes" label="Yes" />
        <RadioGroupItem value="no" label="No" />
      </RadioGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'An option `hint` adds a short detail under its label and is read after the option name. Use `orientation="horizontal"` only for 2 or 3 short options; the arrow keys work the same way in both layouts.',
      },
      source: {
        code: `<RadioGroup label="Delivery" defaultValue="standard">\n  <RadioGroupItem value="standard" label="Standard" hint="3 to 5 working days. Free." />\n  <RadioGroupItem value="express" label="Express" hint="Next working day. €9." />\n</RadioGroup>\n<RadioGroup label="Gift wrap" orientation="horizontal">…</RadioGroup>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('radio', { name: 'Express' })).toHaveAccessibleDescription(
      'Next working day. €9.',
    );
  },
};

/* ---------------------------------------------------------------
 * Error
 * --------------------------------------------------------------- */

export const WithError: Story = {
  name: 'Error State',
  render: () => (
    <RadioGroup
      label="Delivery"
      hint="Free delivery on orders over €50."
      required
      invalid
      error="Choose how to receive the order."
    >
      {DELIVERY_OPTIONS}
    </RadioGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'When `invalid` is `true`, TypeScript requires an `error` message. Every circle turns to the error colour, and screen readers read the hint first, then the error. The icon and the text carry the error too, so it never depends on colour alone.',
      },
      source: {
        code: `<RadioGroup\n  label="Delivery"\n  hint="Free delivery on orders over €50."\n  required\n  invalid\n  error="Choose how to receive the order."\n>\n  …\n</RadioGroup>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole('radiogroup', { name: 'Delivery' });
    await expect(group).toHaveAttribute('aria-invalid', 'true');
    await expect(group).toHaveAccessibleDescription(
      'Free delivery on orders over €50. Error: Choose how to receive the order.',
    );
  },
};

/* ---------------------------------------------------------------
 * Disabled
 * --------------------------------------------------------------- */

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
      <RadioGroup label="Delivery" defaultValue="standard">
        <RadioGroupItem value="standard" label="Standard" />
        <RadioGroupItem value="express" label="Express" />
        <RadioGroupItem
          value="pickup"
          label="Store pickup"
          hint="No store near this address."
          disabled
        />
      </RadioGroup>
      <RadioGroup label="Payment" defaultValue="card" disabled>
        <RadioGroupItem value="card" label="Card" />
        <RadioGroupItem value="transfer" label="Bank transfer" />
      </RadioGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Disable one option with `disabled` on the item, and say why in its hint; the arrow keys skip it. Disable the whole group with `disabled` on the group: every option dims, but the group label stays readable, so people still see the question. Disabled radios cannot be focused or checked.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('radio', { name: 'Store pickup' })).toBeDisabled();
    await expect(canvas.getByRole('radio', { name: 'Card' })).toBeDisabled();
  },
};

/* ---------------------------------------------------------------
 * Interactive Pseudo States
 * --------------------------------------------------------------- */

export const PseudoStates: Story = {
  name: 'Interactive Pseudo States',
  render: () => (
    <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
      <RadioGroup label="Primary" defaultValue="hover">
        <RadioGroupItem value="default" label="Default" />
        <RadioGroupItem value="hover" label="Checked + hover" className="pseudo-hover" />
        <RadioGroupItem value="unchecked-hover" label="Hover" className="pseudo-hover" />
        <RadioGroupItem value="focus" label="Focus" className="pseudo-focus-visible" />
      </RadioGroup>
      <RadioGroup label="Secondary" variant="secondary" defaultValue="hover">
        <RadioGroupItem value="default" label="Default" />
        <RadioGroupItem value="hover" label="Checked + hover" className="pseudo-hover" />
        <RadioGroupItem value="unchecked-hover" label="Hover" className="pseudo-hover" />
        <RadioGroupItem value="focus" label="Focus" className="pseudo-focus-visible" />
      </RadioGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the interactive states with the `storybook-addon-pseudo-states` plugin. Hovering the label counts as hovering the radio:\n\n' +
          '- **Hover** — the circle border turns darker; a checked radio takes the darker step of its fill.\n' +
          '- **Focus** — keyboard focus draws the shared sage focus ring around the circle.\n\n' +
          '`className` goes to the option wrapper. You can also use the toolbar above the canvas to toggle these states globally on any component.',
      },
    },
    pseudo: {
      hover: ['.pseudo-hover button', '.pseudo-hover label'],
      focusVisible: ['.pseudo-focus-visible button'],
    },
  },
};

/* ---------------------------------------------------------------
 * Form example (recipe)
 * --------------------------------------------------------------- */

const DELIVERY_ERROR = 'Choose how to receive the order.';

function DeliveryForm() {
  const [deliveryError, setDeliveryError] = useState<string | null>(null);
  const firstOptionRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const hasDelivery = Boolean(new FormData(event.currentTarget).get('delivery'));
    setDeliveryError(hasDelivery ? null : DELIVERY_ERROR);
    if (!hasDelivery) firstOptionRef.current?.focus();
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-label="Checkout"
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '22rem' }}
    >
      <Text size="sm" style={{ margin: 0 }}>
        Fields marked with an asterisk (*) are required.
      </Text>
      <RadioGroup
        name="delivery"
        label="Delivery"
        required
        {...(deliveryError ? { invalid: true, error: deliveryError } : { invalid: false })}
      >
        <RadioGroupItem ref={firstOptionRef} value="standard" label="Standard" />
        <RadioGroupItem value="express" label="Express" />
      </RadioGroup>
      <div>
        <Button variant="primary" appearance="fill" size="lg" type="submit">
          Place order
        </Button>
      </div>
    </form>
  );
}

export const FormExample: Story = {
  name: 'Form Example (A11y)',
  render: () => <DeliveryForm />,
  parameters: {
    docs: {
      description: {
        story:
          'A recipe composing `RadioGroup` and `Button`. The choice must be deliberate, so nothing is preselected and the group is `required`. Validation runs on submit: the error says how to fix it, and focus moves to the first option.',
      },
      source: {
        code: `<form noValidate onSubmit={handleSubmit}>\n  <Text size="sm">Fields marked with an asterisk (*) are required.</Text>\n  <RadioGroup\n    name="delivery"\n    label="Delivery"\n    required\n    {...(deliveryError ? { invalid: true, error: deliveryError } : { invalid: false })}\n  >\n    <RadioGroupItem ref={firstOptionRef} value="standard" label="Standard" />\n    <RadioGroupItem value="express" label="Express" />\n  </RadioGroup>\n  <Button variant="primary" appearance="fill" size="lg" type="submit">Place order</Button>\n</form>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Place order' }));
    const group = canvas.getByRole('radiogroup', { name: 'Delivery' });
    await expect(group).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getByRole('radio', { name: 'Standard' })).toHaveFocus();

    await userEvent.keyboard(' ');
    await userEvent.click(canvas.getByRole('button', { name: 'Place order' }));
    await expect(group).not.toHaveAttribute('aria-invalid');
  },
};
