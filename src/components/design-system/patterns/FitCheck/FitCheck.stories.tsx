import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Heading, Label, Text } from '../../ui/Typography';
import { expect, userEvent, within } from 'storybook/test';
import { SelectField } from '../../ui/SelectField';
import type { AlertVariant } from '../../ui/Alert';
import { SelectItem } from '../../ui/Select';
import type { CSSProperties } from 'react';
import { Alert } from '../../ui/Alert';
import { useState } from 'react';

/* ---------------------------------------------------------------
 * Fit check (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Fit Check',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Does this product fit the space people saved? The product page compares the two, gives a clear answer, and shows the numbers behind it.\n\n' +
          '### What It Solves\n' +
          'Product sizes are hard to compare in your head, and "it fits" is only useful with the margin: a shelf that fits with 1 cm to spare may not go in at all. The answer has three steps — fits, fits only just, does not fit — and each says which measurement decided it.\n\n' +
          '### When to Use\n' +
          '- **A product page, once people have saved at least one space.** With no saved space, offer to add one instead of showing an answer.\n' +
          '- **Not for:** the product grid (a short `Badge` such as "Fits your bathroom" belongs there), or measurements people are still typing (see Form Validation).\n\n' +
          '### Anatomy\n' +
          '- A `Heading`, then a `SelectField` to pick the saved space.\n' +
          '- The answer — an `Alert`: `success` (fits), `warning` (less than 2 cm to spare) or `error` (does not fit), with a title that answers and a line that names the deciding measurement.\n' +
          '- The numbers — a description list (`<dl>`) with the product, the space and the margin for width, depth and height.\n\n' +
          '### Accessibility\n' +
          '- **The answer is said in words**, with the icon and the colour as extras: "Does not fit: 8 cm too wide", never a red box alone.\n' +
          '- **Changing the space announces the new answer:** the alert is a polite live region that stays on the page, so the answer is read after the choice, without moving the focus.\n' +
          '- **The numbers are text in a description list**, so screen readers can go through them pair by pair; a minus sign is written as a word ("8 cm short"), not left to a colour.\n\n' +
          '### In the App\n' +
          '- The saved spaces come from the user; the product sizes come from the store data, in centimetres. Do the comparison in a plain function in `src/lib/` with its own tests, and keep the 2 cm threshold in one place.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const DIMENSIONS = ['width', 'depth', 'height'] as const;
type Dimension = (typeof DIMENSIONS)[number];
type Size = Record<Dimension, number>;

const DIMENSION_LABELS: Record<Dimension, string> = {
  width: 'Width',
  depth: 'Depth',
  height: 'Height',
};

/** Less spare room than this, in any dimension, is "only just". */
const TIGHT_FIT_CM = 2;

const PRODUCT = { name: 'Bamboo shower caddy', size: { width: 48, depth: 26, height: 70 } };

const SPACES: Record<string, { label: string; size: Size }> = {
  'bathroom-niche': { label: 'Bathroom niche', size: { width: 60, depth: 30, height: 90 } },
  'laundry-gap': {
    label: 'Gap beside the washing machine',
    size: { width: 49, depth: 40, height: 85 },
  },
  'cupboard-shelf': {
    label: 'Bathroom cupboard shelf',
    size: { width: 40, depth: 28, height: 64 },
  },
};

interface FitResult {
  variant: AlertVariant;
  title: string;
  detail: string;
}

function checkFit(product: Size, space: Size): FitResult {
  const margins = DIMENSIONS.map((dimension) => ({
    dimension,
    margin: space[dimension] - product[dimension],
  }));
  const tooBig = margins.filter(({ margin }) => margin < 0);
  if (tooBig.length > 0) {
    const reasons = tooBig.map(
      ({ dimension, margin }) => `${-margin} cm too ${sizeWord(dimension)}`,
    );
    return {
      variant: 'error',
      title: `Does not fit: ${reasons.join(', ')}`,
      detail: 'Look for a smaller size, or choose another space.',
    };
  }
  const tightest = margins.reduce((smallest, current) =>
    current.margin < smallest.margin ? current : smallest,
  );
  if (tightest.margin < TIGHT_FIT_CM) {
    return {
      variant: 'warning',
      title: `Fits, only just: ${tightest.margin} cm to spare in ${tightest.dimension}`,
      detail: 'Measure the space again before you buy, and allow for skirting boards and handles.',
    };
  }
  return {
    variant: 'success',
    title: `Fits, with ${tightest.margin} cm to spare in ${tightest.dimension}`,
    detail: 'That is the tightest measurement; the others have more room.',
  };
}

function sizeWord(dimension: Dimension) {
  return { width: 'wide', depth: 'deep', height: 'tall' }[dimension];
}

function describeMargin(margin: number) {
  if (margin < 0) return `${-margin} cm short`;
  return `${margin} cm to spare`;
}

const rowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '6rem 1fr',
  gap: '0.25rem 1rem',
  margin: 0,
};

function FitCheckRecipe() {
  const [spaceKey, setSpaceKey] = useState('bathroom-niche');
  const space = SPACES[spaceKey];
  const result = checkFit(PRODUCT.size, space.size);

  return (
    <section
      aria-labelledby="fit-check-heading"
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '32rem' }}
    >
      <Heading id="fit-check-heading" level={2} size="sm" style={{ margin: 0 }}>
        Will it fit?
      </Heading>
      <SelectField
        label="Your space"
        hint="From the spaces you saved."
        value={spaceKey}
        onValueChange={setSpaceKey}
      >
        {Object.entries(SPACES).map(([key, savedSpace]) => (
          <SelectItem key={key} value={key}>
            {savedSpace.label}
          </SelectItem>
        ))}
      </SelectField>

      <Alert variant={result.variant} live="polite" headingLevel={3} title={result.title}>
        {result.detail}
      </Alert>

      <dl style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: 0 }}>
        {DIMENSIONS.map((dimension) => {
          const margin = space.size[dimension] - PRODUCT.size[dimension];
          return (
            <div key={dimension} style={rowStyle}>
              <dt>
                <Label size="sm">{DIMENSION_LABELS[dimension]}</Label>
              </dt>
              <dd style={{ margin: 0 }}>
                <Text as="span" size="sm">
                  Product {PRODUCT.size[dimension]} cm · space {space.size[dimension]} cm ·{' '}
                  {describeMargin(margin)}
                </Text>
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}

/* ---------------------------------------------------------------
 * Fit check
 * --------------------------------------------------------------- */

export const FitCheck: Story = {
  name: 'Fit Check (A11y)',
  render: () => <FitCheckRecipe />,
  parameters: {
    docs: {
      description: {
        story:
          'A 48 × 26 × 70 cm shower caddy against three saved spaces. "Bathroom niche": it fits with room to spare. "Gap beside the washing machine": it fits with 1 cm to spare. "Bathroom cupboard shelf": it is too wide and too tall.',
      },
      source: {
        code: `const result = checkFit(product.size, space.size); // { variant, title, detail }

<section aria-labelledby="fit-check-heading">
  <Heading id="fit-check-heading" level={2} size="sm">Will it fit?</Heading>
  <SelectField label="Your space" value={spaceId} onValueChange={setSpaceId}>
    {spaces.map((space) => (
      <SelectItem key={space.id} value={space.id}>{space.label}</SelectItem>
    ))}
  </SelectField>

  <Alert variant={result.variant} live="polite" headingLevel={3} title={result.title}>
    {result.detail}
  </Alert>

  <dl>
    {dimensions.map((dimension) => (
      <div key={dimension}>
        <dt><Label size="sm">{dimensionLabels[dimension]}</Label></dt>
        <dd>
          <Text as="span" size="sm">
            Product {product.size[dimension]} cm · space {space.size[dimension]} cm · {describeMargin(…)}
          </Text>
        </dd>
      </div>
    ))}
  </dl>
</section>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status')).toHaveTextContent('Fits, with 4 cm to spare in depth');
    await expect(canvas.getByRole('combobox', { name: 'Your space' })).toHaveTextContent(
      'Bathroom niche',
    );
  },
};

/* ---------------------------------------------------------------
 * Fit Check (A11y): interaction (test only)
 * --------------------------------------------------------------- */

export const FitCheckInteraction: Story = {
  ...FitCheck,
  name: 'Fit Check (A11y): Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(document.body);
    const spacePicker = canvas.getByRole('combobox', { name: 'Your space' });

    await userEvent.click(spacePicker);
    await userEvent.click(
      await page.findByRole('option', { name: 'Gap beside the washing machine' }),
    );
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Fits, only just: 1 cm to spare in width',
    );

    await userEvent.click(spacePicker);
    await userEvent.click(await page.findByRole('option', { name: 'Bathroom cupboard shelf' }));
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Does not fit: 8 cm too wide, 6 cm too tall',
    );
    await expect(canvas.getByText(/Product 48 cm · space 40 cm · 8 cm short/)).toBeVisible();
  },
};
