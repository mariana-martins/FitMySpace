import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/Tooltip';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import type { IconName } from '../../ui/Icon';
import type { KeyboardEvent } from 'react';
import { Button } from '../../ui/Button';
import { useRef, useState } from 'react';

/* ---------------------------------------------------------------
 * Icon toolbar (pattern)
 * --------------------------------------------------------------- */

const meta = {
  title: 'Design System/Patterns/Icon Toolbar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A row of icon-only buttons that act on the same thing — the results — with a tooltip that names each one, and one stop in the tab order for the whole row.\n\n' +
          '### What It Solves\n' +
          'Icon buttons save room, but an icon alone is a guess and ten of them are ten Tab stops. A toolbar fixes both: every button has a name and a tooltip, and the row is entered with Tab and walked with the arrow keys, as the W3C toolbar pattern describes.\n\n' +
          '### When to Use\n' +
          '- **A few frequent actions on one object,** where words would not fit: tools above the results, controls on a product picture.\n' +
          '- **Not for:** actions people need to understand before using (give them words), or a single icon button (no toolbar needed, see Tooltip).\n\n' +
          '### Anatomy\n' +
          '- A `role="toolbar"` with an `aria-label` that names what it acts on.\n' +
          '- Icon-only `Button`s, each with an `aria-label` and a `Tooltip` that shows the same words, and more if useful.\n' +
          '- A toggle among them carries `aria-pressed` and keeps its name.\n\n' +
          '### Accessibility\n' +
          '- **One Tab stop:** only one button is in the tab order at a time (roving `tabIndex`). The arrow keys move along the row, Home and End jump to the ends, and the row remembers where you were.\n' +
          '- **Names and tooltips agree:** the tooltip shows the `aria-label`, so what is seen and what is heard are the same words.\n' +
          '- **A toggle says its state:** "Show only what fits, toggle button, pressed".\n' +
          '- **Target size:** `md` buttons are 48px, well above the 24px minimum of WCAG 2.5.8.\n\n' +
          '### In the App\n' +
          '- Each button calls the same handler as its worded version elsewhere (the sort, the filters); the pressed state lives in the URL with the other filters.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface Tool {
  label: string;
  tip: string;
  icon: IconName;
  toggle?: boolean;
}

const TOOLS: Tool[] = [
  { label: 'Filters', tip: 'Filters: rooms, stores and price', icon: 'sliders-horizontal' },
  { label: 'Sort', tip: 'Sort: relevance or price', icon: 'arrow-up-down' },
  {
    label: 'Show only what fits',
    tip: 'Show only what fits your saved spaces',
    icon: 'ruler',
    toggle: true,
  },
  { label: 'Reset', tip: 'Reset: clear every filter', icon: 'rotate-ccw' },
];

function ResultsToolbar() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [onlyWhatFits, setOnlyWhatFits] = useState(false);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  function moveTo(index: number) {
    const next = (index + TOOLS.length) % TOOLS.length;
    setActiveIndex(next);
    buttons.current[next]?.focus();
  }

  /* The W3C toolbar keys: arrows move and wrap, Home and End jump to the ends. */
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, number> = {
      ArrowRight: activeIndex + 1,
      ArrowLeft: activeIndex - 1,
      Home: 0,
      End: TOOLS.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    moveTo(moves[event.key]);
  }

  return (
    <TooltipProvider>
      <div
        role="toolbar"
        aria-label="Results tools"
        onKeyDown={handleKeyDown}
        style={{ display: 'flex', gap: '0.5rem', inlineSize: 'fit-content' }}
      >
        {TOOLS.map((tool, index) => (
          <Tooltip key={tool.label}>
            <TooltipTrigger asChild>
              <Button
                ref={(button) => {
                  buttons.current[index] = button;
                }}
                variant="secondary"
                appearance={tool.toggle && onlyWhatFits ? 'fill' : 'ghost'}
                size="md"
                icon={tool.icon}
                aria-label={tool.label}
                aria-pressed={tool.toggle ? onlyWhatFits : undefined}
                tabIndex={index === activeIndex ? 0 : -1}
                onFocus={() => setActiveIndex(index)}
                onClick={tool.toggle ? () => setOnlyWhatFits((isOn) => !isOn) : undefined}
              />
            </TooltipTrigger>
            <TooltipContent>{tool.tip}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

/* ---------------------------------------------------------------
 * Icon toolbar
 * --------------------------------------------------------------- */

export const IconToolbar: Story = {
  name: 'Icon Toolbar (A11y)',
  render: () => <ResultsToolbar />,
  parameters: {
    docs: {
      description: {
        story:
          'Tab into the toolbar, then use the arrow keys: each button shows its tooltip as it takes the focus, and Tab leaves the row in one step. The ruler is a toggle.',
      },
      source: {
        code: `<div role="toolbar" aria-label="Results tools" onKeyDown={moveWithArrows}>
  {tools.map((tool, index) => (
    <Tooltip key={tool.label}>
      <TooltipTrigger asChild>
        <Button
          variant="secondary"
          appearance="ghost"
          size="md"
          icon={tool.icon}
          aria-label={tool.label}
          aria-pressed={tool.toggle ? isOn : undefined}
          tabIndex={index === activeIndex ? 0 : -1}
          onFocus={() => setActiveIndex(index)}
        />
      </TooltipTrigger>
      <TooltipContent>{tool.tip}</TooltipContent>
    </Tooltip>
  ))}
</div>`,
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toolbar = canvas.getByRole('toolbar', { name: 'Results tools' });
    const buttons = within(toolbar).getAllByRole('button');
    await expect(buttons).toHaveLength(4);
    // One tab stop for the whole row.
    await expect(buttons.filter((button) => button.tabIndex === 0)).toHaveLength(1);
  },
};

/* ---------------------------------------------------------------
 * Icon Toolbar (A11y): interaction (test only)
 * --------------------------------------------------------------- */

export const IconToolbarInteraction: Story = {
  ...IconToolbar,
  name: 'Icon Toolbar (A11y): Interaction (Test Only)',
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Filters' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    const fits = canvas.getByRole('button', { name: 'Show only what fits' });
    await expect(fits).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(fits).toHaveAttribute('aria-pressed', 'true');
    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('button', { name: 'Reset' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: 'Filters' })).toHaveFocus();
    await expect(canvas.getByRole('button', { name: 'Reset' })).toHaveAttribute('tabindex', '-1');
  },
};
