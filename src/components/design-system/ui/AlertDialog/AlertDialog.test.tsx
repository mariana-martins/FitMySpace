import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from '../Button';
import { createRef } from 'react';

import type { AlertDialogContentProps, AlertDialogProps } from './';
import type { MouseEvent, Ref } from 'react';

expect.extend(toHaveNoViolations);

type FixtureOptions = {
  rootProps?: AlertDialogProps;
  contentProps?: AlertDialogContentProps;
  contentRef?: Ref<HTMLDivElement>;
  onAction?: () => void;
  answersFirst?: boolean;
};

/** The alert dialog every test opens: a delete, the safe answer, the destructive one. */
function AlertDialogFixture({
  rootProps,
  contentProps,
  contentRef,
  onAction = () => {},
  answersFirst = true,
}: FixtureOptions) {
  const cancel = (
    <AlertDialogCancel asChild>
      <Button variant="secondary" appearance="outline" size="md">
        Keep room
      </Button>
    </AlertDialogCancel>
  );
  const action = (
    <AlertDialogAction asChild>
      <Button variant="error" appearance="fill" size="md" onClick={onAction}>
        Delete room
      </Button>
    </AlertDialogAction>
  );

  return (
    <AlertDialog defaultOpen {...rootProps}>
      <AlertDialogTrigger asChild>
        <Button variant="error" appearance="outline" size="md">
          Delete Bedroom
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent ref={contentRef} {...contentProps}>
        <AlertDialogTitle>Delete “Bedroom”?</AlertDialogTitle>
        <AlertDialogDescription>
          This removes 12 saved items from the room. The items themselves stay in your list.
        </AlertDialogDescription>

        <AlertDialogFooter>
          {answersFirst ? (
            <>
              {cancel}
              {action}
            </>
          ) : (
            <>
              {action}
              {cancel}
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('AlertDialog — rendering', () => {
  it('renders no dialog until the trigger is pressed', () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="error" appearance="outline" size="md">
            Delete Bedroom
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Delete “Bedroom”?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>,
    );

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });

  it('opens as a modal alert dialog named by its title', () => {
    render(AlertDialogFixture({}));
    const dialog = screen.getByRole('alertdialog', { name: 'Delete “Bedroom”?' });

    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('links the description to the dialog', () => {
    render(AlertDialogFixture({}));
    const dialog = screen.getByRole('alertdialog');
    const describedBy = dialog.getAttribute('aria-describedby');

    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy ?? '')).toHaveTextContent(
      'This removes 12 saved items from the room.',
    );
  });

  it('puts the size class and the class name on the dialog box', () => {
    render(AlertDialogFixture({ contentProps: { size: 'md', className: 'custom' } }));

    expect(screen.getByRole('alertdialog')).toHaveClass('content', 'size-md', 'custom');
  });

  it('forwards the ref to the dialog box', () => {
    const ref = createRef<HTMLDivElement>();
    render(AlertDialogFixture({ contentRef: ref }));

    expect(ref.current).toBe(screen.getByRole('alertdialog'));
  });

  it('renders no close button, because the two answers are the way out', () => {
    render(AlertDialogFixture({}));

    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  it('marks the two answers, wherever the app puts them', () => {
    render(AlertDialogFixture({}));

    expect(screen.getByRole('button', { name: 'Keep room' })).toHaveAttribute(
      'data-alert-dialog-cancel',
    );
    expect(screen.getByRole('button', { name: 'Delete room' })).toHaveAttribute(
      'data-alert-dialog-action',
    );
  });
});

/* ===============================================================
 * OPENING AND CLOSING
 * =============================================================== */

describe('AlertDialog — opening and closing', () => {
  it('opens from the trigger and cancels on Escape, giving focus back', async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="error" appearance="outline" size="md">
            Delete Bedroom
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Delete “Bedroom”?</AlertDialogTitle>
          <AlertDialogDescription>This removes 12 saved items.</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="secondary" appearance="outline" size="md">
                Keep room
              </Button>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );

    const trigger = screen.getByRole('button', { name: 'Delete Bedroom' });
    await user.click(trigger);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('closes with the cancel answer and runs nothing', async () => {
    const user = userEvent.setup();
    const onAction = jest.fn();
    render(AlertDialogFixture({ onAction }));

    await user.click(screen.getByRole('button', { name: 'Keep room' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(onAction).not.toHaveBeenCalled();
  });

  it('closes with the action answer and runs it', async () => {
    const user = userEvent.setup();
    const onAction = jest.fn();
    render(AlertDialogFixture({ onAction }));

    await user.click(screen.getByRole('button', { name: 'Delete room' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('stays open when the action prevents the default, e.g. while a request runs', async () => {
    const user = userEvent.setup();
    const onAction = jest.fn((event: MouseEvent<HTMLButtonElement>) => event.preventDefault());
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Delete “Bedroom”?</AlertDialogTitle>
          <AlertDialogDescription>This removes 12 saved items.</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogAction asChild>
              <Button variant="error" appearance="fill" size="md" onClick={onAction}>
                Delete room
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
    );

    await user.click(screen.getByRole('button', { name: 'Delete room' }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('does not close when the scrim is clicked: the reader owes it an answer', async () => {
    const user = userEvent.setup();
    render(AlertDialogFixture({}));
    const scrim = document.querySelector('.overlay');
    expect(scrim).not.toBeNull();

    await user.click(scrim as Element);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('reports the change to the app', async () => {
    const user = userEvent.setup();
    const handleOpenChange = jest.fn();
    render(AlertDialogFixture({ rootProps: { onOpenChange: handleOpenChange } }));

    await user.click(screen.getByRole('button', { name: 'Keep room' }));
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it('keeps the page behind out of the accessibility tree while it is open', () => {
    render(AlertDialogFixture({}));

    // The trigger is hidden from assistive technology by now, so it takes
    // `hidden: true` to find it at all.
    const trigger = screen.getByRole('button', { name: 'Delete Bedroom', hidden: true });
    expect(trigger.closest('[aria-hidden="true"]')).not.toBeNull();
  });
});

/* ===============================================================
 * FOCUS
 * =============================================================== */

describe('AlertDialog — focus', () => {
  it('starts on the safe answer even when the destructive one is written first', () => {
    render(AlertDialogFixture({ answersFirst: false }));

    expect(screen.getByRole('button', { name: 'Keep room' })).toHaveFocus();
  });

  it('starts on the action when the action is the expected one', () => {
    render(AlertDialogFixture({ contentProps: { initialFocus: 'action' } }));

    expect(screen.getByRole('button', { name: 'Delete room' })).toHaveFocus();
  });

  it('starts on the title when the dialog only tells the reader something', () => {
    render(AlertDialogFixture({ contentProps: { initialFocus: 'title' } }));

    expect(screen.getByRole('heading', { name: 'Delete “Bedroom”?' })).toHaveFocus();
  });

  it('keeps the keyboard inside the dialog', async () => {
    const user = userEvent.setup();
    render(AlertDialogFixture({}));

    await user.tab();
    expect(screen.getByRole('button', { name: 'Delete room' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('button', { name: 'Keep room' })).toHaveFocus();
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('AlertDialog — accessibility', () => {
  it('has no axe violations while it is open', async () => {
    render(AlertDialogFixture({}));
    const dialog = screen.getByRole('alertdialog');

    expect(await axe(dialog)).toHaveNoViolations();
  });

  it('has no axe violations focused on its title', async () => {
    render(AlertDialogFixture({ contentProps: { initialFocus: 'title' } }));
    const dialog = screen.getByRole('alertdialog');

    expect(await axe(dialog)).toHaveNoViolations();
  });
});
