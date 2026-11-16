import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { act } from 'react';

import type { ToastProps } from './';

expect.extend(toHaveNoViolations);

// jsdom implements no pointer capture, which Radix uses to follow a swipe.
beforeAll(() => {
  Element.prototype.hasPointerCapture = jest.fn().mockReturnValue(false);
  Element.prototype.setPointerCapture = jest.fn();
  Element.prototype.releasePointerCapture = jest.fn();
});

/**
 * Radix renders the card in the viewport's list and the announcement in a
 * hidden region of its own, so every check runs on the whole document.
 */
function ToastFixture({
  rootProps,
  withAction = false,
  variant = 'success',
}: {
  rootProps?: ToastProps;
  withAction?: boolean;
  variant?: 'success' | 'error';
}) {
  return (
    <ToastProvider>
      <ToastViewport />
      <Toast defaultOpen variant={variant} {...rootProps}>
        <ToastTitle>Room saved</ToastTitle>
        <ToastDescription>The name shows up in your list of rooms.</ToastDescription>
        {withAction && <ToastAction altText="Undo saving the room">Keep</ToastAction>}
        <ToastClose />
      </Toast>
    </ToastProvider>
  );
}

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('Toast — rendering', () => {
  it('stacks the card in the notifications region', () => {
    render(ToastFixture({}));

    const region = screen.getByRole('region', { name: /Notifications/ });
    const card = within(region).getByRole('listitem');
    expect(within(card).getByText('Room saved')).toBeInTheDocument();
    expect(within(card).getByText('The name shows up in your list of rooms.')).toBeInTheDocument();
  });

  it('draws the variant icon without saying it twice', () => {
    render(ToastFixture({}));

    const icon = screen.getByRole('listitem').querySelector('svg');
    expect(icon?.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('shows no card before the app opens one', () => {
    render(ToastFixture({ rootProps: { defaultOpen: false } }));

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('names the action by its own word and the close by its job', () => {
    render(ToastFixture({ withAction: true }));

    expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });
});

/* ===============================================================
 * ANNOUNCING
 * =============================================================== */

describe('Toast — announcing', () => {
  it('waits its turn for a confirmation', async () => {
    render(ToastFixture({ variant: 'success' }));

    const announcer = screen.getByRole('status');
    expect(announcer).toHaveAttribute('aria-live', 'polite');
    await waitFor(() => expect(announcer).toHaveTextContent('Room saved'));
  });

  it('interrupts for an error', async () => {
    render(ToastFixture({ variant: 'error' }));

    const announcer = screen.getByRole('status');
    expect(announcer).toHaveAttribute('aria-live', 'assertive');
    await waitFor(() => expect(announcer).toHaveTextContent('Room saved'));
  });

  it('says what kind of message it is, not only its colour', async () => {
    render(ToastFixture({ variant: 'error' }));

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Error:'));
  });

  it('announces what the action does instead of its short word', async () => {
    render(ToastFixture({ withAction: true }));

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Undo saving the room'),
    );
    expect(screen.getByRole('status')).not.toHaveTextContent('Keep');
  });

  it('keeps the button out of the region that is read aloud', () => {
    render(ToastFixture({ withAction: true }));

    // MDN: `role="alert"` is for text, not for controls. The card can hold a
    // button because the announcement happens in a region of its own.
    const announcer = screen.getByRole('status');
    expect(announcer.contains(screen.getByRole('button', { name: 'Keep' }))).toBe(false);
  });

  it('stops announcing a card that has gone', async () => {
    render(ToastFixture({}));

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Room saved'));
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
  });
});

/* ===============================================================
 * OPENING AND CLOSING
 * =============================================================== */

describe('Toast — opening and closing', () => {
  it('stays until the reader dismisses it', () => {
    jest.useFakeTimers();
    render(ToastFixture({}));

    // Radix would count down from 5s; the design does not, because a card that
    // vanishes mid-sentence is a card nobody read.
    act(() => {
      jest.advanceTimersByTime(60_000);
    });
    expect(screen.getByRole('listitem')).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('goes away after the time the app asks for', () => {
    jest.useFakeTimers();
    render(ToastFixture({ rootProps: { duration: 7_000 } }));

    act(() => {
      jest.advanceTimersByTime(7_000);
    });
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it('closes when the action is taken', async () => {
    const handleOpenChange = jest.fn();
    render(ToastFixture({ withAction: true, rootProps: { onOpenChange: handleOpenChange } }));

    await userEvent.click(screen.getByRole('button', { name: 'Keep' }));

    expect(handleOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('closes when the corner button is pressed', async () => {
    render(ToastFixture({}));

    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('closes on Escape while the card has focus', async () => {
    const user = userEvent.setup();
    render(ToastFixture({}));

    screen.getByRole('listitem').focus();
    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('listitem')).not.toBeInTheDocument());
  });

  it('leaves the page alone while a card arrives', () => {
    render(ToastFixture({}));

    // Nothing is focused for the reader: the region is reached by its hotkey.
    expect(document.body).toHaveFocus();
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('Toast — accessibility', () => {
  it('has no axe violations while a card is open', async () => {
    render(ToastFixture({ withAction: true }));

    // `region` is off because a test container is no landmark.
    expect(
      await axe(document.body, { rules: { region: { enabled: false } } }),
    ).toHaveNoViolations();
  });
});
