import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Label } from '../Typography';
import { useState } from 'react';
import { Switch } from './';

const meta = {
  title: 'Design System/Components/Forms/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: {
    label: 'Email me new storage ideas',
    variant: 'primary',
    size: 'md',
  },
  parameters: {
    docs: {
      description: {
        component:
          'The `Switch` component is built on Radix Switch, with a visible `label`, an optional `hint` and an `error` message required whenever `invalid` is `true`, all linked for assistive technology. It represents **one setting that takes effect the moment it is flipped**.\n\n' +
          '### Best Practices\n' +
          '- **Immediate settings only:** A switch says "this is on now". Where the change only applies once the form is submitted, or where the option is one of several independent choices, use `Checkbox` instead.\n' +
          '- **Name the setting, not the state:** "Notifications", not "Enable notifications?". Screen readers announce the state themselves ("on", "off"), so a label that repeats it reads as "Enable notifications, on".\n' +
          '- **Group related switches:** Wrap them in a `<fieldset>` whose `<legend>` names the group ("Notifications"), so screen readers read it before each switch.\n' +
          '- **Colour:** Keep the default `primary` (brand) colour. Use `secondary` (neutral) where many switches sit together, so the brand colour stays for the main actions. Use one variant per group.\n' +
          '- **Explain what it changes:** The `hint` is where "One email a week, at most" belongs, next to the switch that turns it on.\n' +
          '- **Errors:** Whenever `invalid` is `true`, pass an `error` message that says how to fix it ("Confirm your email address to receive notifications").\n\n' +
          '### Key Features\n' +
          '- **Radix Switch** — a `<button role="switch">` with `aria-checked` true or false. Space and Enter both toggle it. Once the page is hydrated, Radix adds a hidden native checkbox inside a `<form>`, so `name` and `value` submit and follow form reset; without JavaScript the switch does not submit.\n' +
          '- **State in the shape** — the knob sits left for off and right for on, and it changes colour with the track, so the state never rests on colour alone.\n' +
          '- **Variants** — `primary` (brand) and `secondary` (neutral) colour the checked track, with the same names as `Button` and `Checkbox`.\n' +
          '- **Sizes** — `sm`, `md`, `lg` track and knob sizes next to the `Label` lg / md / sm, with the shared focus ring.\n' +
          '- **Descriptions** — `aria-describedby` points to the hint, then the error.\n' +
          '- **Errors** — TypeScript enforces a required `error` message whenever `invalid` is `true`. Sets `aria-invalid` and prefixes the message with a screen-reader-only "Error:".\n' +
          '- **State** — the Radix API: `checked` / `defaultChecked` take a boolean and `onCheckedChange` receives the new one. A switch has no mixed state, so unlike `Checkbox` there is no `"indeterminate"`.\n' +
          '- **Pass-through** — every other prop (`name`, `value`, `id`, `aria-*`…) goes to the Radix root; `ref` points to the `<button>`.',
      },
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

export const Default: Story = {
  args: {
    label: 'Email me new storage ideas',
    hint: 'One email a week, at most.',
    variant: 'primary',
    size: 'md',
    invalid: false,
    required: false,
    disabled: false,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible label, naming the setting. Clicking it toggles the switch.',
    },
    hint: {
      control: 'text',
      description: 'Persistent help text below the label.',
    },
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary'],
      description:
        'Colour of the checked track: `primary` (brand) or `secondary` (neutral). Defaults to `primary`.',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'The size of the track and its label. Defaults to `md`.',
    },
    invalid: {
      control: 'boolean',
      description:
        'Marks the switch invalid. Requires a descriptive `error` message (enforced by TypeScript).',
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
      description: 'Disables the switch and dims the label.',
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
    const switchControl = canvas.getByRole('switch', { name: 'Email me new storage ideas' });
    await expect(switchControl).toHaveAccessibleDescription('One email a week, at most.');
    await userEvent.click(canvas.getByText('Email me new storage ideas'));
    await expect(switchControl).toBeChecked();
  },
};

/* ---------------------------------------------------------------
 * All variants
 * --------------------------------------------------------------- */

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Switch variant="primary" label="Primary" defaultChecked />
      <Switch variant="secondary" label="Secondary" defaultChecked />
      <Switch variant="primary" label="Primary off" />
      <Switch variant="secondary" label="Secondary off" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Two colour variants for the checked track. `primary` (default) uses the brand colour; `secondary` is a neutral dark fill for screens with many switches, where the brand colour should stay for the main actions. The unchecked track, the error and the disabled states look the same in both.',
      },
      source: {
        code: `<Switch variant="primary" label="Primary" defaultChecked />\n<Switch variant="secondary" label="Secondary" defaultChecked />`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('switch', { name: 'Secondary' })).toBeChecked();
    await expect(canvas.getByRole('switch', { name: 'Secondary off' })).not.toBeChecked();
  },
};

/* ---------------------------------------------------------------
 * All sizes
 * --------------------------------------------------------------- */

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Switch size="lg" label="Large" defaultChecked />
      <Switch size="md" label="Medium" defaultChecked />
      <Switch size="sm" label="Small" defaultChecked />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The switch comes in 3 sizes: a 40, 32 or 24px track next to the `Label` lg / md / sm. The label sits centred on the track. Size `md` is the default standard size, and every size keeps the knob at least 24px away from the edge it rests on.',
      },
      source: {
        code: `<Switch size="lg" label="Large" defaultChecked />\n<Switch size="md" label="Medium" defaultChecked />\n<Switch size="sm" label="Small" defaultChecked />`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('switch', { name: 'Large' })).toBeChecked();
    await expect(canvas.getByRole('switch', { name: 'Small' })).toBeChecked();
  },
};

/* ---------------------------------------------------------------
 * States
 * --------------------------------------------------------------- */

export const States: Story = {
  name: 'On and Off',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Switch label="Off" />
      <Switch label="On" defaultChecked />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The two states of a switch, announced as "off" and "on". The knob rests on the left when off and on the right when on, so the state reads without colour. A switch has no mixed state: use `Checkbox` for a select-all box.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('switch', { name: 'Off' })).not.toBeChecked();
    await expect(canvas.getByRole('switch', { name: 'On' })).toBeChecked();
  },
};

/* ---------------------------------------------------------------
 * Error
 * --------------------------------------------------------------- */

export const WithError: Story = {
  name: 'Error State',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '24rem' }}>
      <Switch
        label="Send me order updates by SMS"
        hint="Message and data rates may apply."
        invalid
        error="Confirm your phone number to receive text messages."
      />
      <Switch
        label="Email me new storage ideas"
        defaultChecked
        invalid
        error="We could not reach your email provider. Update your address."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'When `invalid` is `true`, TypeScript requires an `error` message. The track turns to the error colour, on or off, and screen readers read the hint first, then the error. The icon and the text carry the error too, so it never depends on colour alone. Prefer a `hint` when the switch simply cannot be used yet, and reserve an error for something the person has to fix.',
      },
      source: {
        code: `<Switch\n  label="Send me order updates by SMS"\n  hint="Message and data rates may apply."\n  invalid\n  error="Confirm your phone number to receive text messages."\n/>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sms = canvas.getByRole('switch', { name: 'Send me order updates by SMS' });
    await expect(sms).toHaveAttribute('aria-invalid', 'true');
    await expect(sms).toHaveAccessibleDescription(
      'Message and data rates may apply. Error: Confirm your phone number to receive text messages.',
    );
  },
};

/* ---------------------------------------------------------------
 * Disabled
 * --------------------------------------------------------------- */

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '24rem' }}>
      <Switch label="Price alerts" disabled hint="Available once you sign in." />
      <Switch label="Order updates" defaultChecked disabled />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A `disabled` switch dims its track and label and cannot be focused or toggled. Say nearby why it is unavailable — here in the `hint` — and do not combine `required` with `disabled`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const orderUpdates = canvas.getByRole('switch', { name: 'Order updates' });
    await expect(orderUpdates).toBeDisabled();
    await expect(orderUpdates).toBeChecked();
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
        <Switch label="Default" />
        <Switch label="Hover" className="pseudo-hover" />
        <Switch label="Focus" className="pseudo-focus-visible" />
      </div>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <Switch label="Default" defaultChecked />
        <Switch label="Hover" defaultChecked className="pseudo-hover" />
        <Switch label="Focus" defaultChecked className="pseudo-focus-visible" />
      </div>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <Switch variant="secondary" label="Default" defaultChecked />
        <Switch variant="secondary" label="Hover" defaultChecked className="pseudo-hover" />
        <Switch variant="secondary" label="Focus" defaultChecked className="pseudo-focus-visible" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the interactive states, off, checked `primary` and checked `secondary`, using the `storybook-addon-pseudo-states` plugin. Hovering the label counts as hovering the track. You can also use the toolbar above the canvas to toggle these states globally on any component.',
      },
    },
    pseudo: {
      hover: ['.pseudo-hover button', '.pseudo-hover label'],
      focusVisible: ['.pseudo-focus-visible button'],
    },
  },
};

/* ---------------------------------------------------------------
 * Settings group (recipe)
 * --------------------------------------------------------------- */

function NotificationSettings() {
  const [enabledSettings, setEnabledSettings] = useState<string[]>(['order-updates']);

  const toggleSetting = (setting: string) => (isEnabled: boolean) => {
    setEnabledSettings((currentSettings) =>
      isEnabled
        ? [...currentSettings, setting]
        : currentSettings.filter((currentSetting) => currentSetting !== setting),
    );
  };

  return (
    <fieldset
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        margin: 0,
        padding: 0,
        border: 0,
      }}
    >
      <legend style={{ padding: 0, marginBottom: '0.5rem' }}>
        <Label size="md">Notifications</Label>
      </legend>
      <Switch
        label="Order updates"
        hint="Every step of the delivery."
        checked={enabledSettings.includes('order-updates')}
        onCheckedChange={toggleSetting('order-updates')}
      />
      <Switch
        label="Price alerts"
        hint="Only for items on your saved list."
        checked={enabledSettings.includes('price-alerts')}
        onCheckedChange={toggleSetting('price-alerts')}
      />
      <Switch label="SMS alerts" disabled hint="Available once you add a phone number." />
    </fieldset>
  );
}

export const SettingsGroup: Story = {
  name: 'Settings Group (A11y)',
  render: () => <NotificationSettings />,
  parameters: {
    docs: {
      description: {
        story:
          'A recipe for a preferences screen. The `<fieldset>` and `<legend>` name the group, so screen readers read "Notifications" before each switch. Each switch is controlled and applies its setting at once — there is no Save button, because a switch that needs one should be a checkbox.',
      },
      source: {
        code: `<fieldset>\n  <legend><Label size="md">Notifications</Label></legend>\n  <Switch\n    label="Order updates"\n    hint="Every step of the delivery."\n    checked={enabledSettings.includes('order-updates')}\n    onCheckedChange={toggleSetting('order-updates')}\n  />\n  <Switch label="SMS alerts" disabled hint="Available once you add a phone number." />\n</fieldset>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group', { name: 'Notifications' })).toBeInTheDocument();
    const priceAlerts = canvas.getByRole('switch', { name: 'Price alerts' });
    await userEvent.click(priceAlerts);
    await expect(priceAlerts).toBeChecked();
    await expect(canvas.getByRole('switch', { name: 'SMS alerts' })).toBeDisabled();
  },
};
