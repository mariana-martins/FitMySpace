import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Caption } from '../Typography';
import { Button } from '../Button';

import type { TooltipContentProps } from './';
import type { IconName } from '../Icon';

const meta = {
  title: 'Design System/Components/Overlays/Tooltip',
  component: TooltipContent,
  tags: ['autodocs'],
  args: {
    side: 'top',
    align: 'center',
  },
  parameters: {
    docs: {
      description: {
        component:
          'A `Tooltip` is one short thought about a control, shown while that control is hovered or focused. It is built on Radix Tooltip, which owns the delay, the `role="tooltip"` bubble, the `aria-describedby` it puts on the trigger, Escape and the flip when the bubble would leave the screen. Wrap the tooltips of a subtree in one `TooltipProvider` so they share a delay and a timer.\n\n' +
          'A tooltip is optional reading. It is hidden until it is asked for, and a touchscreen never asks for it, so anything the reader has to know belongs on the page.\n\n' +
          '### Best Practices\n' +
          '- **Never for essential information:** a limit, a consequence or a password rule goes next to the thing it describes, where it stays. A tooltip is for the nice-to-know — what an icon means, what a button will do.\n' +
          '- **The control keeps its own name:** an icon-only `Button` still needs `aria-label`. The tooltip describes the control, it does not name it, and a screen reader reads the two in one breath.\n' +
          '- **Do not repeat the label:** a tooltip that says "Clear" on a button named "Clear" is read twice and tells nobody anything. Say what happens instead: "Clears every filter in this search".\n' +
          '- **Text only:** the bubble goes away the moment the pointer leaves the control, so a link or a button inside it could never be reached.\n' +
          '- **Never on a disabled control:** a disabled control fires no pointer events, so its tooltip would never open and the reason would stay hidden. Put the reason on the page, next to it.\n' +
          '- **Keep it to a sentence:** the bubble wraps at 240px. Two sentences is the most it should hold.\n\n' +
          '### Key Features\n' +
          '- **Reversed surface** — `background.inverse` with `text.inverse` and `shadow.floating`, so it never reads as part of the page it describes.\n' +
          '- **Above everything** — `semantic.layer.floating`, so it still shows over an open dialog, next to a select list.\n' +
          '- **Points at the control** — a filled arrow, with `side`, `align` and `sideOffset` from Radix.\n' +
          '- **One shared delay** — `TooltipProvider` sets `delayDuration` (700ms by default) and `skipDelayDuration`, so the first tooltip waits and the ones after it appear at once.\n' +
          '- **`body-sm` at 240px** — the small text role and a width that keeps the lines short.\n' +
          '- **Moving along a toolbar** — entering the next trigger closes the open tooltip at once, so the next one is never held back while the pointer crosses towards the first bubble.\n' +
          "- **Reduced motion and `forced-colors`** — the bubble stops moving when it is asked to, and takes the reader's system colours with a drawn edge.\n\n" +
          '### Patterns\n' +
          '- [Icon Toolbar](?path=/docs/design-system-patterns-page-sections-icon-toolbar--docs) — icon buttons with tooltips, one Tab stop and arrow keys along the row.',
      },
    },
  },
} satisfies Meta<typeof TooltipContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The bubble is portalled to the end of <body>, outside the story's own node. */
function page() {
  return within(document.body);
}

/** Opens the bubble with the pointer, checks it, then leaves: the bubble goes with the pointer. */
async function openAndLeave(triggerName: string, tipText: string) {
  const trigger = page().getByRole('button', { name: triggerName });

  await userEvent.hover(trigger);
  const tip = await page().findByRole('tooltip');
  await waitFor(() => expect(tip).toHaveTextContent(tipText), { timeout: 3000 });
  await expect(trigger).toHaveAttribute('aria-describedby', tip.getAttribute('id'));

  await userEvent.unhover(trigger);
  await waitFor(() => expect(page().queryByRole('tooltip')).not.toBeInTheDocument());
}

/* ---------------------------------------------------------------
 * Default (with controls)
 * --------------------------------------------------------------- */

function ClearFiltersTooltip(contentProps: TooltipContentProps) {
  return (
    <div style={{ padding: '96px 32px', display: 'flex', justifyContent: 'center' }}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              appearance="outline"
              size="md"
              icon="rotate-ccw"
              aria-label="Clear filters"
            />
          </TooltipTrigger>
          <TooltipContent {...contentProps}>Clears every filter in this search.</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export const Default: Story = {
  args: {
    side: 'top',
    align: 'center',
  },
  argTypes: {
    side: {
      control: { type: 'select' },
      options: ['top', 'right', 'bottom', 'left'],
      description:
        'Preferred side of the control. Radix flips it when the bubble would leave the screen.',
    },
    align: {
      control: { type: 'select' },
      options: ['start', 'center', 'end'],
      description: 'Alignment along that side.',
    },
    children: {
      control: false,
      description: 'The thought. Text only, one sentence.',
    },
    sideOffset: {
      control: false,
      description: 'Gap between the control and the bubble. Defaults to 12px, the arrow included.',
    },
  },
  render: (args) => <ClearFiltersTooltip {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'Use the controls below to experiment with all possible combinations of props. The bubble is hidden: hover the button, or press Tab to reach it with the keyboard. The first tooltip of a group waits 700ms; the ones after it appear at once.',
      },
      source: {
        code: `<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="secondary" appearance="outline" icon="rotate-ccw" aria-label="Clear filters" />
    </TooltipTrigger>
    <TooltipContent side="top" align="center">Clears every filter in this search.</TooltipContent>
  </Tooltip>
</TooltipProvider>`,
      },
    },
  },
  play: async () => {
    await expect(page().getByRole('button', { name: 'Clear filters' })).toBeEnabled();
    await expect(page().queryByRole('tooltip')).not.toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * Default: interaction (test only)
 * --------------------------------------------------------------- */

export const DefaultInteraction: Story = {
  ...Default,
  name: 'Default: Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async () => {
    await openAndLeave('Clear filters', 'Clears every filter in this search.');
  },
};

/* ---------------------------------------------------------------
 * All sides
 * --------------------------------------------------------------- */

const SIDES = ['top', 'right', 'bottom', 'left'] as const;

export const AllSides: Story = {
  render: () => (
    <div style={{ padding: '120px 96px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
      <TooltipProvider>
        {SIDES.map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger asChild>
              <Button variant="secondary" appearance="outline" size="md">
                {side}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={side}>
              The bubble sits on the {side} of the control, and flips when the edge of the screen is
              closer than the bubble needs.
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Four sides, one arrow that always points at the control. Ask for the side the content around the control leaves free; Radix takes care of the case where that side runs out of room.',
      },
      source: {
        code: `<Tooltip>
  <TooltipTrigger asChild>…</TooltipTrigger>
  <TooltipContent side="bottom">…</TooltipContent>
</Tooltip>`,
      },
    },
  },
};

/* ---------------------------------------------------------------
 * On an icon-only button
 * --------------------------------------------------------------- */

const TOOLBAR: { icon: IconName; label: string; tip: string }[] = [
  { icon: 'search', label: 'Search', tip: 'Searches product names and rooms.' },
  { icon: 'filter', label: 'Filters', tip: 'Opens the filters for this search.' },
  {
    icon: 'sliders-horizontal',
    label: 'Sort',
    tip: 'Sorts by how well the item fits the room you picked.',
  },
];

export const OnIconButton: Story = {
  name: 'On an Icon-only Button',
  render: () => (
    <div style={{ padding: '96px 32px' }}>
      <TooltipProvider>
        <div
          role="group"
          aria-label="Search tools"
          style={{ display: 'flex', gap: '8px', inlineSize: 'fit-content' }}
        >
          {TOOLBAR.map(({ icon, label, tip }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  appearance="ghost"
                  size="md"
                  icon={icon}
                  aria-label={label}
                />
              </TooltipTrigger>
              <TooltipContent>{tip}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The button is named by `aria-label` — that name is what a screen reader reads, and what a keyboard user reaches with Tab. The tooltip then adds what the button does, which the icon alone cannot say. Nothing depends on the bubble being open: close it and every control is still named.',
      },
      source: {
        code: `<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="secondary" appearance="ghost" size="md" icon="filter" aria-label="Filters" />
  </TooltipTrigger>
  <TooltipContent>Opens the filters for this search.</TooltipContent>
</Tooltip>`,
      },
    },
  },
  play: async () => {
    await expect(page().getByRole('button', { name: 'Filters' })).toBeEnabled();
    await expect(page().queryByRole('tooltip')).not.toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * On an Icon-only Button: interaction (test only)
 * --------------------------------------------------------------- */

export const OnIconButtonInteraction: Story = {
  ...OnIconButton,
  name: 'On an Icon-only Button: Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async () => {
    await openAndLeave('Filters', 'Opens the filters for this search.');
  },
};

/* ---------------------------------------------------------------
 * Long text
 * --------------------------------------------------------------- */

export const LongText: Story = {
  name: 'Long Text (It Wraps at 240px)',
  render: () => (
    <div style={{ padding: '120px 32px', display: 'flex', justifyContent: 'center' }}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" appearance="outline" size="md">
              Why this fits
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Sizes are measured with the doors open and the drawers pulled out, so nothing is blocked
            when everything is in use.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The bubble never grows past 240px, so the lines stay short enough to read in one glance. An explanation that needs more than that is not a tooltip: it goes in the page, or in a dialog.',
      },
    },
  },
  play: async () => {
    await expect(page().getByRole('button', { name: 'Why this fits' })).toBeEnabled();
    await expect(page().queryByRole('tooltip')).not.toBeInTheDocument();
  },
};

/* ---------------------------------------------------------------
 * Long Text (It Wraps at 240px): interaction (test only)
 * --------------------------------------------------------------- */

export const LongTextInteraction: Story = {
  ...LongText,
  name: 'Long Text (It Wraps at 240px): Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async () => {
    await openAndLeave('Why this fits', 'Sizes are measured with the doors open');
  },
};

/* ---------------------------------------------------------------
 * A disabled control (recipe)
 * --------------------------------------------------------------- */

export const DisabledControl: Story = {
  name: 'A Disabled Control (No Tooltip)',
  render: () => (
    <div style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
      <Button variant="secondary" appearance="outline" size="md" disabled>
        Share room
      </Button>
      <Caption>Sharing opens once the room has an item in it.</Caption>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A disabled control takes no pointer events, so a tooltip on it would never open — the reason would stay hidden from everyone, which is the opposite of why you wrote it. The reason goes next to the button instead, where it is read the first time. The same rule holds for anything that only looks disabled: if it can be hovered or focused, it can carry a tooltip.',
      },
      source: {
        code: `<Button variant="secondary" appearance="outline" size="md" disabled>
  Share room
</Button>

{/* The reason is in the page, not in a bubble. */}
<Caption>Sharing opens once the room has an item in it.</Caption>`,
      },
    },
  },
  play: async () => {
    await expect(page().getByRole('button', { name: 'Share room' })).toBeDisabled();
    await expect(page().getByText('Sharing opens once the room has an item in it.')).toBeVisible();
    await expect(page().queryByRole('tooltip')).not.toBeInTheDocument();
  },
};
