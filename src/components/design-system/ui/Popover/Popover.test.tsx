import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverFooter,
  PopoverTitle,
  PopoverTrigger,
} from './';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Checkbox } from '../Checkbox';
import { Button } from '../Button';
import { createRef } from 'react';

import type { PopoverContentProps, PopoverProps } from './';
import type { Ref } from 'react';

expect.extend(toHaveNoViolations);

type FixtureOptions = {
  rootProps?: PopoverProps;
  contentProps?: Partial<PopoverContentProps>;
  contentRef?: Ref<HTMLDivElement>;
  withTitle?: boolean;
};

/** The store filter every test opens: a title, two checkboxes and a Done button. */
function StoreFilter({ rootProps, contentProps, contentRef, withTitle = true }: FixtureOptions) {
  return (
    <>
      <Popover {...rootProps}>
        <PopoverTrigger asChild>
          <Button variant="secondary" appearance="outline" size="md">
            Stores
          </Button>
        </PopoverTrigger>

        <PopoverContent ref={contentRef} {...contentProps}>
          {withTitle && <PopoverTitle>Stores</PopoverTitle>}
          <Checkbox size="md" label="The Container Store" />
          <Checkbox size="md" label="Tok&Stok" />
          <PopoverFooter>
            <PopoverClose asChild>
              <Button variant="primary" appearance="fill" size="sm">
                Done
              </Button>
            </PopoverClose>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
      <Button variant="secondary" appearance="outline" size="md">
        Sort
      </Button>
    </>
  );
}

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('Popover — rendering', () => {
  it('renders no panel until the trigger is pressed, and says it is collapsed', () => {
    render(<StoreFilter />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Stores' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('opens a dialog named by its title', () => {
    render(<StoreFilter rootProps={{ defaultOpen: true }} />);

    expect(screen.getByRole('dialog', { name: 'Stores' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Stores' })).toBeInTheDocument();
  });

  it('takes an aria-label instead of a title, without a broken reference', () => {
    render(
      <StoreFilter
        rootProps={{ defaultOpen: true }}
        withTitle={false}
        contentProps={{ 'aria-label': 'Filter by store' }}
      />,
    );
    const dialog = screen.getByRole('dialog', { name: 'Filter by store' });

    expect(dialog).not.toHaveAttribute('aria-labelledby');
  });

  it('puts the size class and the class name on the panel, sm by default', () => {
    const { unmount } = render(<StoreFilter rootProps={{ defaultOpen: true }} />);
    expect(screen.getByRole('dialog')).toHaveClass('content', 'size-sm');
    unmount();

    render(
      <StoreFilter
        rootProps={{ defaultOpen: true }}
        contentProps={{ size: 'md', className: 'x' }}
      />,
    );
    expect(screen.getByRole('dialog')).toHaveClass('content', 'size-md', 'x');
  });

  it('forwards the ref to the panel', () => {
    const ref = createRef<HTMLDivElement>();
    render(<StoreFilter rootProps={{ defaultOpen: true }} contentRef={ref} />);

    expect(ref.current).toBe(screen.getByRole('dialog'));
  });

  it('is not modal: the page behind stays in the accessibility tree', () => {
    render(<StoreFilter rootProps={{ defaultOpen: true }} />);

    expect(screen.getByRole('button', { name: 'Sort' })).toBeInTheDocument();
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-modal');
  });
});

/* ===============================================================
 * OPENING AND CLOSING
 * =============================================================== */

describe('Popover — opening and closing', () => {
  it('opens from the trigger, moves the focus in, and closes on Escape', async () => {
    const user = userEvent.setup();
    render(<StoreFilter />);
    const trigger = screen.getByRole('button', { name: 'Stores' });

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('checkbox', { name: 'The Container Store' })).toHaveFocus();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('closes with PopoverClose and reports the change', async () => {
    const user = userEvent.setup();
    const handleOpenChange = jest.fn();
    render(<StoreFilter rootProps={{ defaultOpen: true, onOpenChange: handleOpenChange }} />);

    await user.click(screen.getByRole('button', { name: 'Done' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes when the reader clicks elsewhere on the page', async () => {
    const user = userEvent.setup();
    render(<StoreFilter rootProps={{ defaultOpen: true }} />);

    await user.click(screen.getByRole('button', { name: 'Sort' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('keeps the controls inside working while it is open', async () => {
    const user = userEvent.setup();
    render(<StoreFilter rootProps={{ defaultOpen: true }} />);
    const store = screen.getByRole('checkbox', { name: 'Tok&Stok' });

    await user.click(store);
    expect(store).toBeChecked();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('Popover — accessibility', () => {
  it('has no axe violations while it is open', async () => {
    const { baseElement } = render(<StoreFilter rootProps={{ defaultOpen: true }} />);

    expect(await axe(baseElement)).toHaveNoViolations();
  });

  it('has no axe violations named by aria-label', async () => {
    const { baseElement } = render(
      <StoreFilter
        rootProps={{ defaultOpen: true }}
        withTitle={false}
        contentProps={{ 'aria-label': 'Filter by store' }}
      />,
    );

    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
