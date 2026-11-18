import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from './';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Checkbox } from '../Checkbox';
import { Button } from '../Button';
import { createRef } from 'react';

import type { SheetContentProps, SheetProps } from './';
import type { Ref } from 'react';

expect.extend(toHaveNoViolations);

type FixtureOptions = {
  rootProps?: SheetProps;
  contentProps?: Partial<SheetContentProps>;
  contentRef?: Ref<HTMLDivElement>;
};

/** The phone filters every test opens: a title, a line, two filters and two actions. */
function FilterSheet({ rootProps, contentProps, contentRef }: FixtureOptions) {
  return (
    <Sheet {...rootProps}>
      <SheetTrigger asChild>
        <Button variant="secondary" appearance="outline" size="md">
          Filters
        </Button>
      </SheetTrigger>

      <SheetContent ref={contentRef} closeLabel="Close filters" {...contentProps}>
        <SheetTitle>Filters</SheetTitle>
        <SheetDescription>Nothing changes until you show the products.</SheetDescription>
        <SheetBody>
          <Checkbox size="md" label="Kitchen" />
          <Checkbox size="md" label="Bathroom" />
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="primary" appearance="fill" size="md">
              Show 8 products
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('Sheet — rendering', () => {
  it('renders no sheet until the trigger is pressed', () => {
    render(<FilterSheet />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens as a modal dialog named by its title and described by its description', () => {
    render(<FilterSheet rootProps={{ defaultOpen: true }} />);

    expect(screen.getByRole('dialog', { name: 'Filters' })).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('dialog')).toHaveAccessibleDescription(
      'Nothing changes until you show the products.',
    );
  });

  it('slides in from the end by default, and from any side it is given', () => {
    const { unmount } = render(<FilterSheet rootProps={{ defaultOpen: true }} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('data-side', 'end');
    unmount();

    render(<FilterSheet rootProps={{ defaultOpen: true }} contentProps={{ side: 'bottom' }} />);
    expect(screen.getByRole('dialog')).toHaveAttribute('data-side', 'bottom');
  });

  it('puts the size class and the class name on the sheet, sm by default', () => {
    render(
      <FilterSheet
        rootProps={{ defaultOpen: true }}
        contentProps={{ size: 'md', className: 'custom' }}
      />,
    );

    expect(screen.getByRole('dialog')).toHaveClass('content', 'size-md', 'custom');
  });

  it('forwards the ref to the sheet', () => {
    const ref = createRef<HTMLDivElement>();
    render(<FilterSheet rootProps={{ defaultOpen: true }} contentRef={ref} />);

    expect(ref.current).toBe(screen.getByRole('dialog'));
  });

  it('renders a named Close button', () => {
    render(<FilterSheet rootProps={{ defaultOpen: true }} />);

    expect(screen.getByRole('button', { name: 'Close filters' })).toBeInTheDocument();
  });
});

/* ===============================================================
 * OPENING AND CLOSING
 * =============================================================== */

describe('Sheet — opening and closing', () => {
  it('opens from the trigger, starts on the first control and closes on Escape', async () => {
    const user = userEvent.setup();
    render(<FilterSheet />);
    const trigger = screen.getByRole('button', { name: 'Filters' });

    await user.click(trigger);
    expect(screen.getByRole('checkbox', { name: 'Kitchen' })).toHaveFocus();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('starts on the title when asked', () => {
    render(
      <FilterSheet rootProps={{ defaultOpen: true }} contentProps={{ initialFocus: 'title' }} />,
    );

    expect(screen.getByRole('heading', { name: 'Filters' })).toHaveFocus();
  });

  it('closes with the Close button and with SheetClose, and reports it', async () => {
    const user = userEvent.setup();
    const handleOpenChange = jest.fn();
    render(<FilterSheet rootProps={{ defaultOpen: true, onOpenChange: handleOpenChange }} />);

    await user.click(screen.getByRole('button', { name: 'Show 8 products' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(handleOpenChange).toHaveBeenCalledWith(false);

    await user.click(screen.getByRole('button', { name: 'Filters' }));
    await user.click(screen.getByRole('button', { name: 'Close filters' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes when the scrim is clicked', async () => {
    const user = userEvent.setup();
    render(<FilterSheet rootProps={{ defaultOpen: true }} />);
    const scrim = document.querySelector('.overlay');
    expect(scrim).not.toBeNull();

    await user.click(scrim as Element);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('keeps the page behind out of the accessibility tree while it is open', () => {
    render(<FilterSheet rootProps={{ defaultOpen: true }} />);
    const trigger = screen.getByRole('button', { name: 'Filters', hidden: true });

    expect(trigger.closest('[aria-hidden="true"]')).not.toBeNull();
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('Sheet — accessibility', () => {
  it.each(['start', 'end', 'bottom'] as const)(
    'has no axe violations from the %s side',
    async (side) => {
      render(<FilterSheet rootProps={{ defaultOpen: true }} contentProps={{ side }} />);

      expect(await axe(screen.getByRole('dialog'))).toHaveNoViolations();
    },
  );
});
