import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from './';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../Button';
import { createRef } from 'react';

import type { DialogContentProps, DialogProps } from './';
import type { Ref } from 'react';

expect.extend(toHaveNoViolations);

type FixtureOptions = {
  rootProps?: DialogProps;
  contentProps?: DialogContentProps;
  contentRef?: Ref<HTMLDivElement>;
  withDescription?: boolean;
  withField?: boolean;
};

/** The dialog every test opens: a field to fill, a cancel and a confirming action. */
function DialogFixture({
  rootProps,
  contentProps,
  contentRef,
  withDescription = true,
  withField = true,
}: FixtureOptions) {
  return (
    <Dialog defaultOpen {...rootProps}>
      <DialogTrigger asChild>
        <Button variant="primary" appearance="fill" size="md">
          Edit room
        </Button>
      </DialogTrigger>

      <DialogContent ref={contentRef} {...contentProps}>
        <DialogTitle>Move the shelf</DialogTitle>

        {withDescription && (
          <DialogDescription>Pick the room this shelf goes into.</DialogDescription>
        )}

        <DialogBody>
          {withField ? (
            <>
              <label htmlFor="room-name">Room name</label>
              <input id="room-name" defaultValue="Bedroom" />
            </>
          ) : (
            <p>The shelf fits the bedroom with 4cm to spare.</p>
          )}
        </DialogBody>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" appearance="outline" size="md">
              Cancel
            </Button>
          </DialogClose>
          <Button variant="primary" appearance="fill" size="md">
            Move shelf
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('Dialog — rendering', () => {
  it('renders no dialog until the trigger is pressed', () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="primary" appearance="fill" size="md">
            Edit room
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Move the shelf</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens as a modal dialog named by its title', () => {
    render(DialogFixture({}));
    const dialog = screen.getByRole('dialog', { name: 'Move the shelf' });

    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('leaves aria-modal off for a dialog that is not modal', () => {
    render(DialogFixture({ rootProps: { modal: false } }));

    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-modal');
  });

  it('links the description to the dialog', () => {
    render(DialogFixture({}));
    const dialog = screen.getByRole('dialog');
    const describedBy = dialog.getAttribute('aria-describedby');

    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy ?? '')).toHaveTextContent(
      'Pick the room this shelf goes into.',
    );
  });

  it('leaves aria-describedby off when there is no description', () => {
    render(DialogFixture({ withDescription: false }));

    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-describedby');
  });

  it('puts the size class and the class name on the dialog box', () => {
    render(DialogFixture({ contentProps: { size: 'lg', className: 'custom' } }));

    expect(screen.getByRole('dialog')).toHaveClass('content', 'size-lg', 'custom');
  });

  it('forwards the ref to the dialog box', () => {
    const ref = createRef<HTMLDivElement>();
    render(DialogFixture({ contentRef: ref }));

    expect(ref.current).toBe(screen.getByRole('dialog'));
  });

  it('renders an icon-only close button, named Close', () => {
    render(DialogFixture({}));

    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('names the close button whatever the app asks for', () => {
    render(DialogFixture({ contentProps: { closeLabel: 'Fechar' } }));

    expect(screen.getByRole('button', { name: 'Fechar' })).toBeInTheDocument();
  });
});

/* ===============================================================
 * OPENING AND CLOSING
 * =============================================================== */

describe('Dialog — opening and closing', () => {
  it('opens from the trigger and closes on Escape, giving focus back', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="primary" appearance="fill" size="md">
            Edit room
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Move the shelf</DialogTitle>
          <DialogBody>
            <p>The shelf fits the bedroom with 4cm to spare.</p>
          </DialogBody>
        </DialogContent>
      </Dialog>,
    );

    const trigger = screen.getByRole('button', { name: 'Edit room' });
    await user.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('closes with the close button in the corner', async () => {
    const user = userEvent.setup();
    render(DialogFixture({}));

    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes with a DialogClose in the footer', async () => {
    const user = userEvent.setup();
    render(DialogFixture({}));

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes when the scrim is clicked', async () => {
    const user = userEvent.setup();
    render(DialogFixture({}));
    const scrim = document.querySelector('.overlay');
    expect(scrim).not.toBeNull();

    await user.click(scrim as Element);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('reports the change to the app', async () => {
    const user = userEvent.setup();
    const handleOpenChange = jest.fn();
    render(DialogFixture({ rootProps: { onOpenChange: handleOpenChange } }));

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('keeps the page behind out of the accessibility tree while it is open', () => {
    render(DialogFixture({}));

    // The trigger is hidden from assistive technology by now, so it takes
    // `hidden: true` to find it at all.
    const trigger = screen.getByRole('button', { name: 'Edit room', hidden: true });
    expect(trigger.closest('[aria-hidden="true"]')).not.toBeNull();
  });
});

/* ===============================================================
 * FOCUS
 * =============================================================== */

describe('Dialog — focus', () => {
  it('puts the focus on the first control, which is right for a form', () => {
    render(DialogFixture({}));

    expect(screen.getByLabelText('Room name')).toHaveFocus();
  });

  it('puts the focus on the title when there is nothing to fill in', () => {
    render(DialogFixture({ withField: false, contentProps: { initialFocus: 'title' } }));

    expect(screen.getByRole('heading', { name: 'Move the shelf' })).toHaveFocus();
  });

  it('keeps the keyboard inside the dialog', async () => {
    const user = userEvent.setup();
    render(DialogFixture({}));

    await user.tab();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Move shelf' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('Dialog — accessibility', () => {
  it('has no axe violations while it is open', async () => {
    render(DialogFixture({}));
    const dialog = screen.getByRole('dialog');

    expect(await axe(dialog)).toHaveNoViolations();
  });

  it('has no axe violations for a read-only dialog focused on its title', async () => {
    render(DialogFixture({ withField: false, contentProps: { initialFocus: 'title' } }));
    const dialog = screen.getByRole('dialog');

    expect(await axe(dialog)).toHaveNoViolations();
  });
});
