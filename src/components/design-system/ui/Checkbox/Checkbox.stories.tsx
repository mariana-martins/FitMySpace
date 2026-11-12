import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import type { CheckboxCheckedState } from './';
import { Label, Text } from '../Typography';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../Button';
import { Checkbox } from './';

const meta = {
  title: 'Design System/Components/Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: {
    label: 'Waterproof',
    variant: 'primary',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Checkbox` component is built on Radix Checkbox, with a visible `label`, an optional `hint` and an `error` message required whenever `invalid` is `true`, all linked for assistive technology.\n\n' +
          '### Best Practices\n' +
          '- **Independent choices:** Use checkboxes when people can pick any number of options, including none. For exactly one choice from a list, use radio buttons; for a setting that applies at once, use a switch.\n' +
          '- **Group related boxes:** Wrap them in a `<fieldset>` whose `<legend>` asks the question ("Features"), so screen readers read it before each option.\n' +
          '- **Colour:** Keep the default `primary` (brand) colour. Use `secondary` (neutral) where many boxes sit together, such as a long filter list, so the brand colour stays for the main actions. Use one variant per group.\n' +
          '- **Short, positive labels:** "Waterproof", not "Not waterproof". Clicking the label toggles the box, so it doubles as a larger target.\n' +
          '- **Select all:** Set `checked="indeterminate"` on the parent box when only some children are checked, and recompute it on every change.\n' +
          '- **Errors:** Whenever `invalid` is `true`, pass an `error` message that says how to fix it ("Accept the terms to place the order"). Validate on submit and move focus to the box.\n\n' +
          '### Key Features\n' +
          '- **Radix Checkbox** — a `<button role="checkbox">` with `aria-checked` true, false or "mixed". Space toggles it and Enter does nothing, as on a native checkbox. Inside a `<form>`, a hidden native checkbox submits `name` and `value` and follows form reset.\n' +
          '- **Variants** — `primary` (brand) and `secondary` (neutral) colour the checked and mixed box, with the same names as `Button`.\n' +
          '- **Label** — a real `<label for>` built from the Typography `Label`, scaled with the box size.\n' +
          '- **Descriptions** — `aria-describedby` points to the hint, then the error.\n' +
          '- **Errors** — TypeScript enforces a required `error` message whenever `invalid` is `true`. Sets `aria-invalid` and prefixes the message with a screen-reader-only "Error:".\n' +
          '- **State** — the Radix API, as in `Select`: `checked` / `defaultChecked` take `true`, `false` or `"indeterminate"`, and `onCheckedChange` receives the new state.\n' +
          '- **Pass-through** — every other prop (`name`, `value`, `id`, `aria-*`…) goes to the Radix root; `ref` points to the `<button>`.',
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  args: {
    label: 'Waterproof',
    hint: 'Safe to use in bathrooms and on balconies.',
    variant: 'primary',
    size: 'md',
    invalid: false,
    required: false,
    disabled: false,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label. Clicking it toggles the checkbox.',
    },
    hint: {
      control: 'text',
      description: 'Persistent help text below the label.',
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
      description:
        'Colour of the checked and mixed box: `primary` (brand) or `secondary` (neutral). Defaults to `primary`.',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'The size of the box and its label. Defaults to `md`.',
    },
    invalid: {
      control: 'boolean',
      description:
        'Marks the checkbox invalid. Requires a descriptive `error` message (enforced by TypeScript).',
    },
    error: {
      control: 'text',
      description: 'Error message, required when `invalid` is `true`.',
    },
    required: {
      control: 'boolean',
      description:
        'Sets `aria-required` (and `required` on the hidden form input) and shows an asterisk.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the checkbox and dims the label.',
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
    const checkbox = canvas.getByRole('checkbox', { name: 'Waterproof' });
    await expect(checkbox).toHaveAccessibleDescription(
      'Safe to use in bathrooms and on balconies.',
    );
    await userEvent.click(canvas.getByText('Waterproof'));
    await expect(checkbox).toBeChecked();
  },
};

/* ---------------------------------------------------------------
 * All variants
 * --------------------------------------------------------------- */

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <Checkbox variant="primary" label="Primary" defaultChecked />
        <Checkbox variant="primary" label="Primary mixed" defaultChecked="indeterminate" />
      </div>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <Checkbox variant="secondary" label="Secondary" defaultChecked />
        <Checkbox variant="secondary" label="Secondary mixed" defaultChecked="indeterminate" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Two colour variants for the checked and mixed box. `primary` (default) uses the brand colour; `secondary` is a neutral dark fill for dense lists, such as filters, where the brand colour should stay for the main actions. The unchecked box, the error and the disabled states look the same in both.',
      },
      source: {
        code: `<Checkbox variant="primary" label="Primary" />\n<Checkbox variant="secondary" label="Secondary" />`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('checkbox', { name: 'Secondary' })).toBeChecked();
    await expect(canvas.getByRole('checkbox', { name: 'Secondary mixed' })).toBePartiallyChecked();
  },
};

/* ---------------------------------------------------------------
 * All sizes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Checkbox size="lg" label="Large" defaultChecked />
      <Checkbox size="md" label="Medium" defaultChecked />
      <Checkbox size="sm" label="Small" defaultChecked />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The checkbox comes in 3 sizes: a 24, 20 or 16px box (in rem, so it grows with the text) next to the `Label` lg / md / sm. The box stays centred on the first line of the label. Size `md` is the default standard size.',
      },
      source: {
        code: `<Checkbox size="lg" label="Large" />\n<Checkbox size="md" label="Medium" />\n<Checkbox size="sm" label="Small" />`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('checkbox', { name: 'Large' })).toBeChecked();
    await expect(canvas.getByRole('checkbox', { name: 'Small' })).toBeChecked();
  },
};

/* ---------------------------------------------------------------
 * States
 * --------------------------------------------------------------- */

export const States: Story = {
  name: 'Checked and Mixed',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Checkbox label="Unchecked" />
      <Checkbox label="Checked" defaultChecked />
      <Checkbox label="Mixed" defaultChecked="indeterminate" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The three states of a checkbox. The mixed state is set with `checked` or `defaultChecked` set to `"indeterminate"` and is announced as "mixed"; the form submits it as unchecked. Clicking a mixed box asks for `true`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('checkbox', { name: 'Unchecked' })).not.toBeChecked();
    await expect(canvas.getByRole('checkbox', { name: 'Checked' })).toBeChecked();
    await expect(canvas.getByRole('checkbox', { name: 'Mixed' })).toBePartiallyChecked();
  },
};

/* ---------------------------------------------------------------
 * Error
 * --------------------------------------------------------------- */

export const WithError: Story = {
  name: 'Error State',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '22rem' }}>
      <Checkbox
        label="I accept the terms of sale"
        hint="Returns are free within 30 days."
        required
        invalid
        error="Accept the terms to place the order."
      />
      <Checkbox
        label="Send me the assembly guide"
        defaultChecked
        invalid
        error="We cannot email a guide for this product."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'When `invalid` is `true`, TypeScript requires an `error` message. The box turns to the error colour, checked or not, and screen readers read the hint first, then the error. The icon and the text carry the error too, so it never depends on colour alone.',
      },
      source: {
        code: `<Checkbox\n  label="I accept the terms of sale"\n  hint="Returns are free within 30 days."\n  required\n  invalid\n  error="Accept the terms to place the order."\n/>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const terms = canvas.getByRole('checkbox', { name: 'I accept the terms of sale' });
    await expect(terms).toHaveAttribute('aria-invalid', 'true');
    await expect(terms).toHaveAccessibleDescription(
      'Returns are free within 30 days. Error: Accept the terms to place the order.',
    );
  },
};

/* ---------------------------------------------------------------
 * Disabled
 * --------------------------------------------------------------- */

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Checkbox label="Unavailable" disabled />
      <Checkbox label="Included in the price" defaultChecked disabled />
      <Checkbox label="Partly included" defaultChecked="indeterminate" disabled />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A `disabled` checkbox dims its box and label and cannot be focused or toggled. Explain nearby why it is unavailable, and do not combine `required` with `disabled`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const included = canvas.getByRole('checkbox', { name: 'Included in the price' });
    await expect(included).toBeDisabled();
    await expect(included).toBeChecked();
  },
};

/* ---------------------------------------------------------------
 * Interactive Pseudo States
 * --------------------------------------------------------------- */

export const PseudoStates: Story = {
  name: 'Interactive Pseudo States',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <Checkbox label="Default" />
        <Checkbox label="Hover" className="pseudo-hover" />
        <Checkbox label="Focus" className="pseudo-focus-visible" />
      </div>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <Checkbox label="Default" defaultChecked />
        <Checkbox label="Hover" defaultChecked className="pseudo-hover" />
        <Checkbox label="Focus" defaultChecked className="pseudo-focus-visible" />
      </div>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <Checkbox variant="secondary" label="Default" defaultChecked />
        <Checkbox variant="secondary" label="Hover" defaultChecked className="pseudo-hover" />
        <Checkbox
          variant="secondary"
          label="Focus"
          defaultChecked
          className="pseudo-focus-visible"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the interactive states, unchecked, checked `primary` and checked `secondary`, using the `storybook-addon-pseudo-states` plugin. Hovering the label counts as hovering the box. You can also use the toolbar above the canvas to toggle these states globally on any component.',
      },
    },
    pseudo: {
      hover: ['.pseudo-hover button', '.pseudo-hover label'],
      focusVisible: ['.pseudo-focus-visible button'],
    },
  },
};

/* ---------------------------------------------------------------
 * Select all (recipe)
 * --------------------------------------------------------------- */

const FEATURES = ['Waterproof', 'Stackable', 'Foldable'] as const;

type Feature = (typeof FEATURES)[number];

function FeatureFilter() {
  const [selectedFeatures, setSelectedFeatures] = useState<Feature[]>(['Stackable']);
  const areAllSelected = selectedFeatures.length === FEATURES.length;
  const areSomeSelected = selectedFeatures.length > 0 && !areAllSelected;

  const toggleAll = () => setSelectedFeatures(areAllSelected ? [] : [...FEATURES]);

  const toggleFeature = (feature: Feature) => (checkedState: CheckboxCheckedState) => {
    setSelectedFeatures((currentFeatures) =>
      checkedState === true
        ? [...currentFeatures, feature]
        : currentFeatures.filter((currentFeature) => currentFeature !== feature),
    );
  };

  return (
    <fieldset
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        margin: 0,
        padding: 0,
        border: 0,
      }}
    >
      <legend style={{ padding: 0, marginBottom: '0.75rem' }}>
        <Label size="md">Features</Label>
      </legend>
      <Checkbox
        label="All features"
        checked={areSomeSelected ? 'indeterminate' : areAllSelected}
        onCheckedChange={toggleAll}
      />
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1.75rem' }}
      >
        {FEATURES.map((feature) => (
          <Checkbox
            key={feature}
            label={feature}
            name="feature"
            value={feature.toLowerCase()}
            checked={selectedFeatures.includes(feature)}
            onCheckedChange={toggleFeature(feature)}
          />
        ))}
      </div>
    </fieldset>
  );
}

export const SelectAll: Story = {
  name: 'Select All Group (A11y)',
  render: () => <FeatureFilter />,
  parameters: {
    docs: {
      description: {
        story:
          'A recipe for a filter group. The `<fieldset>` and `<legend>` name the group, so screen readers read "Features" before each option. The parent box is mixed while only some children are checked; clicking it checks them all, and clicking again clears them.',
      },
      source: {
        code: `<fieldset>\n  <legend><Label size="md">Features</Label></legend>\n  <Checkbox\n    label="All features"\n    checked={areSomeSelected ? 'indeterminate' : areAllSelected}\n    onCheckedChange={toggleAll}\n  />\n  {FEATURES.map((feature) => (\n    <Checkbox\n      key={feature}\n      label={feature}\n      name="feature"\n      value={feature.toLowerCase()}\n      checked={selectedFeatures.includes(feature)}\n      onCheckedChange={toggleFeature(feature)}\n    />\n  ))}\n</fieldset>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group', { name: 'Features' })).toBeInTheDocument();
    const allFeatures = canvas.getByRole('checkbox', { name: 'All features' });
    await expect(allFeatures).toBePartiallyChecked();

    await userEvent.click(allFeatures);
    await expect(allFeatures).toBeChecked();
    await expect(canvas.getByRole('checkbox', { name: 'Foldable' })).toBeChecked();

    await userEvent.click(canvas.getByRole('checkbox', { name: 'Waterproof' }));
    await expect(allFeatures).toBePartiallyChecked();
  },
};

/* ---------------------------------------------------------------
 * Form example (recipe)
 * --------------------------------------------------------------- */

const TERMS_ERROR = 'Accept the terms of sale to place the order.';

function CheckoutConsentForm() {
  const [termsError, setTermsError] = useState<string | null>(null);
  const termsRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const hasAcceptedTerms = new FormData(event.currentTarget).get('terms') === 'accepted';
    setTermsError(hasAcceptedTerms ? null : TERMS_ERROR);
    if (!hasAcceptedTerms) termsRef.current?.focus();
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-label="Checkout"
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '22rem' }}
    >
      <Text size="sm" style={{ margin: 0 }}>
        Fields marked with an asterisk (*) are required.
      </Text>
      <Checkbox name="newsletter" value="subscribed" label="Email me new storage ideas" />
      <Checkbox
        ref={termsRef}
        name="terms"
        value="accepted"
        label="I accept the terms of sale"
        required
        {...(termsError ? { invalid: true, error: termsError } : { invalid: false })}
      />
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
  render: () => <CheckoutConsentForm />,
  parameters: {
    docs: {
      description: {
        story:
          'A recipe composing `Checkbox` and `Button`. Validation runs on submit: an unchecked required box gets an error that says how to fix it, and focus moves to it.',
      },
      source: {
        code: `<form noValidate onSubmit={handleSubmit}>\n  <Text size="sm">Fields marked with an asterisk (*) are required.</Text>\n  <Checkbox name="newsletter" value="subscribed" label="Email me new storage ideas" />\n  <Checkbox\n    ref={termsRef}\n    name="terms"\n    value="accepted"\n    label="I accept the terms of sale"\n    required\n    {...(termsError ? { invalid: true, error: termsError } : { invalid: false })}\n  />\n  <Button variant="primary" appearance="fill" size="lg" type="submit">Place order</Button>\n</form>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Place order' }));
    const terms = canvas.getByRole('checkbox', { name: 'I accept the terms of sale' });
    await expect(terms).toHaveFocus();
    await expect(terms).toHaveAttribute('aria-invalid', 'true');

    await userEvent.keyboard(' ');
    await userEvent.click(canvas.getByRole('button', { name: 'Place order' }));
    await expect(terms).not.toHaveAttribute('aria-invalid');
  },
};
