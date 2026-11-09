import { act, fireEvent, render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CopyTokenButton } from './';

expect.extend(toHaveNoViolations);

const TOKEN_VARIABLE = '--ds-semantic-radii-interactive-md';

function mockClipboard(writeText: jest.Mock) {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  });
}

async function clickCopyButton() {
  await act(async () => {
    fireEvent.click(screen.getByRole('button'));
  });
}

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('CopyTokenButton — rendering', () => {
  it('shows the CSS variable as a button that does not submit forms', () => {
    render(<CopyTokenButton variable={TOKEN_VARIABLE} />);
    const button = screen.getByRole('button', { name: `var(${TOKEN_VARIABLE})` });
    expect(button).toHaveAttribute('type', 'button');
  });

  it('shows a decorative copy icon that is not part of the accessible name', () => {
    render(<CopyTokenButton variable={TOKEN_VARIABLE} />);
    const button = screen.getByRole('button', { name: `var(${TOKEN_VARIABLE})` });
    const icon = button.querySelector('svg');
    expect(icon).toHaveClass('lucide-copy');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('starts with an empty status message', () => {
    render(<CopyTokenButton variable={TOKEN_VARIABLE} />);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });
});

/* ===============================================================
 * COPYING
 * =============================================================== */

describe('CopyTokenButton — copying', () => {
  it('copies the var() reference and announces it', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    mockClipboard(writeText);
    render(<CopyTokenButton variable={TOKEN_VARIABLE} />);

    await clickCopyButton();

    expect(writeText).toHaveBeenCalledWith(`var(${TOKEN_VARIABLE})`);
    expect(screen.getByRole('button')).toHaveTextContent('Copied!');
    expect(screen.getByRole('button').querySelector('svg')).toHaveClass('lucide-check');
    expect(screen.getByRole('status')).toHaveTextContent(
      `Copied var(${TOKEN_VARIABLE}) to the clipboard.`,
    );
  });

  it('says so when the clipboard is not available', async () => {
    mockClipboard(jest.fn().mockRejectedValue(new Error('Permission denied')));
    render(<CopyTokenButton variable={TOKEN_VARIABLE} />);

    await clickCopyButton();

    expect(screen.getByRole('button')).toHaveTextContent('Copy failed');
    expect(screen.getByRole('button').querySelector('svg')).toHaveClass('lucide-circle-alert');
    expect(screen.getByRole('status')).toHaveTextContent(
      `Could not copy var(${TOKEN_VARIABLE}). Select the text and copy it instead.`,
    );
  });

  it('returns to the variable name after 2 seconds', async () => {
    mockClipboard(jest.fn().mockResolvedValue(undefined));
    render(<CopyTokenButton variable={TOKEN_VARIABLE} />);

    await clickCopyButton();
    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.getByRole('button')).toHaveTextContent(`var(${TOKEN_VARIABLE})`);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('cancels the reset timer when it unmounts', async () => {
    mockClipboard(jest.fn().mockResolvedValue(undefined));
    const { unmount } = render(<CopyTokenButton variable={TOKEN_VARIABLE} />);

    await clickCopyButton();
    // Other timers may be pending (React, Testing Library); the reset timer is the one removed.
    const timersWhileCopied = jest.getTimerCount();
    unmount();

    expect(jest.getTimerCount()).toBe(timersWhileCopied - 1);
  });
});

/* ===============================================================
 * ICON ONLY
 * =============================================================== */

describe('CopyTokenButton — icon only', () => {
  it('shows only the icon and names the button after the action', () => {
    render(<CopyTokenButton variable={TOKEN_VARIABLE} iconOnly />);
    const button = screen.getByRole('button', { name: `Copy var(${TOKEN_VARIABLE})` });
    expect(button).toHaveTextContent('');
    expect(button.querySelector('svg')).toHaveClass('lucide-copy');
  });

  it('switches to the check icon and still announces the result', async () => {
    mockClipboard(jest.fn().mockResolvedValue(undefined));
    render(<CopyTokenButton variable={TOKEN_VARIABLE} iconOnly />);

    await clickCopyButton();

    expect(screen.getByRole('button').querySelector('svg')).toHaveClass('lucide-check');
    expect(screen.getByRole('status')).toHaveTextContent(
      `Copied var(${TOKEN_VARIABLE}) to the clipboard.`,
    );
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('CopyTokenButton — accessibility', () => {
  it('has no axe violations', async () => {
    jest.useRealTimers();
    const { container } = render(<CopyTokenButton variable={TOKEN_VARIABLE} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
