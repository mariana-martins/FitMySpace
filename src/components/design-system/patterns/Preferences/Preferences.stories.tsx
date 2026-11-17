import { RadioGroup, RadioGroupItem } from '../../ui/RadioGroup';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Heading, Text } from '../../ui/Typography';
import { SelectField } from '../../ui/SelectField';
import { List, ListItem } from '../../ui/List';
import { SelectItem } from '../../ui/Select';
import type { CSSProperties } from 'react';
import { Switch } from '../../ui/Switch';
import { useState } from 'react';

/* ---------------------------------------------------------------
 * Preferences (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Preferences',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A settings page where each choice applies the moment it changes: no Save button, and one quiet line that confirms what was just saved.\n\n' +
          '### When to Use\n' +
          '- **Settings that are safe to apply one by one:** notifications, the unit for measurements, the store region.\n' +
          '- **Not for:** choices that only make sense together, or that cost something (a delivery address, a payment). Those are a form with a submit button — see Form Validation.\n\n' +
          '### Anatomy\n' +
          '- A page `Heading`, then one `<section>` per topic, each with its own `Heading`.\n' +
          '- `Switch` for on/off settings, each a row of an outline `List`; `RadioGroup` for two to five options people should see at once; `SelectField` for a longer list.\n' +
          '- A status line — `Text` with `role="status"` — under the page heading, always on the page.\n\n' +
          '### Accessibility\n' +
          '- **Each control says its state itself:** a switch is announced "on" or "off", a radio "selected". The status line only adds that it was saved.\n' +
          '- **The status line is polite and short** ("Units saved: inches"). It exists before the first change, so the first change is announced too.\n' +
          '- **Sections are named by their headings**, so screen readers can jump between them; a `Switch` group inside a section needs no `<fieldset>` of its own when the heading already names it.\n' +
          '- **Nothing moves the focus:** people keep their place and carry on down the page.\n\n' +
          '### In the App\n' +
          '- Save each change as it happens (an optimistic TanStack Query mutation). If a save fails, put the control back and say so in the status line, in words that say what to do.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const sectionStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '1rem' };

const UNIT_LABELS = { cm: 'centimetres', in: 'inches' } as const;
type Unit = keyof typeof UNIT_LABELS;

const REGION_LABELS = {
  nsw: 'New South Wales',
  vic: 'Victoria',
  qld: 'Queensland',
  wa: 'Western Australia',
} as const;
type Region = keyof typeof REGION_LABELS;

function PreferencesPage() {
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(false);
  const [unit, setUnit] = useState<Unit>('cm');
  const [region, setRegion] = useState<Region>('nsw');
  const [lastSaved, setLastSaved] = useState('');

  function onOff(isOn: boolean) {
    return isOn ? 'on' : 'off';
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        width: '28rem',
        maxWidth: '100%',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Heading level={2} size="md" style={{ margin: 0 }}>
          Preferences
        </Heading>
        <Text as="p" size="sm" role="status" style={{ margin: 0, minBlockSize: '1lh' }}>
          {lastSaved}
        </Text>
      </div>

      <section aria-labelledby="notifications-heading" style={sectionStyle}>
        <Heading id="notifications-heading" level={3} size="sm" style={{ margin: 0 }}>
          Notifications
        </Heading>
        <List appearance="outline">
          <ListItem>
            <Switch
              label="Order updates"
              hint="Every step of the delivery."
              checked={orderUpdates}
              onCheckedChange={(isOn) => {
                setOrderUpdates(isOn);
                setLastSaved(`Order updates saved: ${onOff(isOn)}.`);
              }}
            />
          </ListItem>
          <ListItem>
            <Switch
              label="Price alerts"
              hint="Only for items on your saved list."
              checked={priceAlerts}
              onCheckedChange={(isOn) => {
                setPriceAlerts(isOn);
                setLastSaved(`Price alerts saved: ${onOff(isOn)}.`);
              }}
            />
          </ListItem>
        </List>
      </section>

      <section aria-labelledby="measurements-heading" style={sectionStyle}>
        <Heading id="measurements-heading" level={3} size="sm" style={{ margin: 0 }}>
          Measurements
        </Heading>
        <RadioGroup
          label="Show sizes in"
          orientation="horizontal"
          value={unit}
          onValueChange={(nextUnit) => {
            setUnit(nextUnit as Unit);
            setLastSaved(`Units saved: ${UNIT_LABELS[nextUnit as Unit]}.`);
          }}
        >
          <RadioGroupItem value="cm" label="Centimetres" />
          <RadioGroupItem value="in" label="Inches" />
        </RadioGroup>
      </section>

      <section aria-labelledby="stores-heading" style={sectionStyle}>
        <Heading id="stores-heading" level={3} size="sm" style={{ margin: 0 }}>
          Stores
        </Heading>
        <SelectField
          label="Your region"
          hint="Prices and delivery times follow the stores that deliver there."
          value={region}
          onValueChange={(nextRegion) => {
            setRegion(nextRegion as Region);
            setLastSaved(`Region saved: ${REGION_LABELS[nextRegion as Region]}.`);
          }}
        >
          {(Object.keys(REGION_LABELS) as Region[]).map((regionKey) => (
            <SelectItem key={regionKey} value={regionKey}>
              {REGION_LABELS[regionKey]}
            </SelectItem>
          ))}
        </SelectField>
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------
 * Preferences
 * --------------------------------------------------------------- */

export const Preferences: Story = {
  name: 'Preferences (A11y)',
  render: () => <PreferencesPage />,
  parameters: {
    docs: {
      description: {
        story:
          'Flip a switch, pick a unit or change the region: the line under the heading confirms each save, and the focus stays on the control you used.',
      },
      source: {
        code: `<Heading level={1} size="md">Preferences</Heading>
<Text as="p" size="sm" role="status">{lastSaved}</Text>

<section aria-labelledby="notifications-heading">
  <Heading id="notifications-heading" level={2} size="sm">Notifications</Heading>
  <Switch
    label="Price alerts"
    hint="Only for items on your saved list."
    checked={preferences.priceAlerts}
    onCheckedChange={(isOn) => savePreference('priceAlerts', isOn)}
  />
</section>

<section aria-labelledby="measurements-heading">
  <Heading id="measurements-heading" level={2} size="sm">Measurements</Heading>
  <RadioGroup label="Show sizes in" orientation="horizontal" value={unit} onValueChange={saveUnit}>
    <RadioGroupItem value="cm" label="Centimetres" />
    <RadioGroupItem value="in" label="Inches" />
  </RadioGroup>
</section>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('switch', { name: 'Order updates' })).toBeChecked();
    await expect(canvas.getByRole('status')).toBeEmptyDOMElement();
  },
};

/* ---------------------------------------------------------------
 * Preferences (A11y): interaction (test only)
 * --------------------------------------------------------------- */

export const PreferencesInteraction: Story = {
  ...Preferences,
  name: 'Preferences (A11y): Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const priceAlerts = canvas.getByRole('switch', { name: 'Price alerts' });
    await userEvent.click(priceAlerts);
    await expect(priceAlerts).toBeChecked();
    await expect(priceAlerts).toHaveFocus();
    await expect(canvas.getByRole('status')).toHaveTextContent('Price alerts saved: on.');

    await userEvent.click(canvas.getByRole('radio', { name: 'Inches' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Units saved: inches.');
    await expect(canvas.getByRole('region', { name: 'Notifications' })).toBeInTheDocument();
  },
};
