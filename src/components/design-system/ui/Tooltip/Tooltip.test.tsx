import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Search } from 'lucide-react';
import { Button } from '../Button';

import type { TooltipContentProps, TooltipProps } from './';

expect.extend(toHaveNoViolations);

// jsdom lacks ResizeObserver, which Radix uses to place the bubble.
beforeAll(() => {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

const TIP = 'Clears every filter in this search.';

/** An icon-only button — the case a tooltip is for — with the delay off for the tests. */
function SearchTooltip({
  rootProps,
  contentProps,
}: {
  rootProps?: TooltipProps;
  contentProps?: TooltipContentProps;
}) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip {...rootProps}>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            appearance="outline"
            size="md"
            icon={<Search />}
            aria-label="Clear filters"
          />
        </TooltipTrigger>
        <TooltipContent {...contentProps}>{TIP}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('Tooltip — rendering', () => {
  it('renders the control with its own name and no bubble', () => {
    render(SearchTooltip({}));

    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows the bubble while the control is hovered', async () => {
    const user = userEvent.setup();
    render(SearchTooltip({}));

    await user.hover(screen.getByRole('button', { name: 'Clear filters' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent(TIP);
  });

  it('shows the bubble when the control is reached with the keyboard', async () => {
    const user = userEvent.setup();
    render(SearchTooltip({}));

    await user.tab();
    expect(await screen.findByRole('tooltip')).toHaveTextContent(TIP);
  });

  it('describes the control with the bubble', async () => {
    const user = userEvent.setup();
    render(SearchTooltip({}));
    const trigger = screen.getByRole('button', { name: 'Clear filters' });

    await user.hover(trigger);
    const tip = await screen.findByRole('tooltip');

    expect(trigger).toHaveAttribute('aria-describedby', tip.getAttribute('id'));
  });

  it('does not rename the control', async () => {
    const user = userEvent.setup();
    render(SearchTooltip({}));
    await user.hover(screen.getByRole('button', { name: 'Clear filters' }));
    await screen.findByRole('tooltip');

    // An exact name query: the bubble's text would break it.
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();
  });

  it('keeps the bubble out of the tab order', async () => {
    const user = userEvent.setup();
    render(SearchTooltip({}));
    await user.hover(screen.getByRole('button', { name: 'Clear filters' }));

    const tip = await screen.findByRole('tooltip');
    expect(tip).not.toHaveAttribute('tabindex');
    expect(tip.querySelector('button, a, input')).toBeNull();
  });

  it('carries the state the enter animation is keyed on', async () => {
    const user = userEvent.setup();
    render(SearchTooltip({}));
    await user.hover(screen.getByRole('button', { name: 'Clear filters' }));

    // The stylesheet animates `delayed-open` and `instantly-open`, never a plain
    // `open`: were those names to change, the bubble would stop moving in silence.
    const tip = await screen.findByRole('tooltip');
    expect(tip.getAttribute('data-state')).toMatch(/(?:delayed|instantly)-open/);
  });

  it('puts the bubble on the side the app asks for', async () => {
    const user = userEvent.setup();
    render(SearchTooltip({ contentProps: { side: 'bottom' } }));
    await user.hover(screen.getByRole('button', { name: 'Clear filters' }));

    expect(await screen.findByRole('tooltip')).toHaveAttribute('data-side', 'bottom');
  });
});

/* ===============================================================
 * OPENING AND CLOSING
 * =============================================================== */

describe('Tooltip — opening and closing', () => {
  it('goes away when the control loses focus', async () => {
    const user = userEvent.setup();
    render(SearchTooltip({}));

    await user.tab();
    await screen.findByRole('tooltip');

    // jsdom has no layout, so a pointer leaving cannot be shown honestly: every
    // box sits at 0,0 and Radix reads the pointer as still inside the bubble.
    await user.tab();
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    render(SearchTooltip({}));

    await user.tab();
    await screen.findByRole('tooltip');

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('shows a bubble the app holds open', () => {
    render(SearchTooltip({ rootProps: { open: true } }));

    expect(screen.getByRole('tooltip')).toHaveTextContent(TIP);
  });

  it('opens the next tooltip when the pointer moves to another trigger', async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Search</TooltipTrigger>
          <TooltipContent>Searches every store.</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger>Sort</TooltipTrigger>
          <TooltipContent>Changes the order of the results.</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    await user.hover(screen.getByRole('button', { name: 'Search' }));
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Searches every store.');

    // jsdom puts every box at 0,0, so the pointer never leaves the area Radix keeps
    // open towards the first bubble: without the provider closing it, the second
    // trigger would be ignored, as it was in a toolbar.
    await user.hover(screen.getByRole('button', { name: 'Sort' }));
    await waitFor(() =>
      expect(screen.getByRole('tooltip')).toHaveTextContent('Changes the order of the results.'),
    );
  });

  it('tells the app when it closes', async () => {
    const user = userEvent.setup();
    const handleOpenChange = jest.fn();
    render(SearchTooltip({ rootProps: { open: true, onOpenChange: handleOpenChange } }));

    await user.keyboard('{Escape}');
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('Tooltip — accessibility', () => {
  it('has no axe violations while the bubble is open', async () => {
    const user = userEvent.setup();
    render(SearchTooltip({}));

    await user.hover(screen.getByRole('button', { name: 'Clear filters' }));
    await screen.findByRole('tooltip');

    // The bubble lives in a portal at the end of <body>, so the check runs on the
    // whole document; `region` is off because a test container is no landmark.
    expect(
      await axe(document.body, { rules: { region: { enabled: false } } }),
    ).toHaveNoViolations();
  });
});
