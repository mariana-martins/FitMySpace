import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Switch } from './';

expect.extend(toHaveNoViolations);

// jsdom lacks ResizeObserver, which Radix Switch uses to size its hidden form input.
beforeAll(() => {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

/* ===============================================================
 * LABEL
 * =============================================================== */

describe('Switch — label', () => {
  it('renders a switch button named by its visible label', () => {
    render(<Switch label="Email me new storage ideas" />);
    const switchControl = screen.getByRole('switch', { name: 'Email me new storage ideas' });
    expect(switchControl.tagName).toBe('BUTTON');
    expect(switchControl).toHaveAttribute('type', 'button');
  });

  it('renders a real <label> element', () => {
    render(<Switch label="Email me new storage ideas" />);
    expect(screen.getByText('Email me new storage ideas').closest('label')).toBeInTheDocument();
  });

  it('uses the given id', () => {
    render(<Switch label="Notifications" id="notifications" />);
    expect(screen.getByRole('switch')).toHaveAttribute('id', 'notifications');
  });

  it('forwards the ref to the <button>', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Switch label="Notifications" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('switch'));
  });

  it('hides the thumb from assistive technology', () => {
    const { container } = render(<Switch label="Notifications" defaultChecked />);
    const thumb = container.querySelector('button > span');
    expect(thumb).not.toBeNull();
    expect(thumb).toHaveAttribute('aria-hidden', 'true');
  });
});

/* ===============================================================
 * VARIANTS
 * =============================================================== */

describe('Switch — variants', () => {
  it('uses the primary variant by default', () => {
    const { container } = render(<Switch label="Notifications" />);
    expect(container.firstChild).toHaveClass('variant-primary');
  });

  it.each(['primary', 'secondary'] as const)('applies variant-%s class', (variant) => {
    const { container } = render(<Switch label="Notifications" variant={variant} />);
    expect(container.firstChild).toHaveClass(`variant-${variant}`);
  });
});

/* ===============================================================
 * CHECKED STATE
 * =============================================================== */

describe('Switch — checked state', () => {
  it('toggles with a click on the track or the label', async () => {
    const user = userEvent.setup();
    render(<Switch label="Notifications" />);
    const switchControl = screen.getByRole('switch', { name: 'Notifications' });

    await user.click(switchControl);
    expect(switchControl).toBeChecked();
    await user.click(screen.getByText('Notifications'));
    expect(switchControl).not.toBeChecked();
  });

  it('toggles with the Space key and with Enter', async () => {
    const user = userEvent.setup();
    render(<Switch label="Notifications" />);
    await user.tab();
    const switchControl = screen.getByRole('switch');
    expect(switchControl).toHaveFocus();
    await user.keyboard(' ');
    expect(switchControl).toBeChecked();
    await user.keyboard('{Enter}');
    expect(switchControl).not.toBeChecked();
  });

  it('works as a controlled switch', async () => {
    const user = userEvent.setup();
    const ControlledNotifications = () => {
      const [isEnabled, setIsEnabled] = useState(true);
      return <Switch label="Notifications" checked={isEnabled} onCheckedChange={setIsEnabled} />;
    };
    render(<ControlledNotifications />);
    const switchControl = screen.getByRole('switch');
    expect(switchControl).toBeChecked();
    await user.click(switchControl);
    expect(switchControl).not.toBeChecked();
  });

  it('announces the state as on or off', () => {
    render(<Switch label="Notifications" defaultChecked />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('submits its name and value only when checked', () => {
    render(
      <form aria-label="Preferences">
        <Switch label="Newsletter" name="newsletter" value="subscribed" defaultChecked />
        <Switch label="SMS" name="sms" value="subscribed" />
      </form>,
    );
    const formData = new FormData(screen.getByRole<HTMLFormElement>('form'));
    expect(formData.getAll('newsletter')).toEqual(['subscribed']);
    expect(formData.has('sms')).toBe(false);
  });

  it('never submits the form when clicked', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn((event: FormEvent) => event.preventDefault());
    render(
      <form aria-label="Preferences" onSubmit={handleSubmit}>
        <Switch label="Newsletter" name="newsletter" value="subscribed" />
      </form>,
    );
    await user.click(screen.getByRole('switch'));
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('goes back to its default state when the form resets', async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="Preferences">
        <Switch label="Newsletter" name="newsletter" value="subscribed" />
        <button type="reset">Reset</button>
      </form>,
    );
    const switchControl = screen.getByRole('switch');
    await user.click(switchControl);
    expect(switchControl).toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(switchControl).not.toBeChecked();
  });
});

/* ===============================================================
 * REQUIRED
 * =============================================================== */

describe('Switch — required', () => {
  it('marks the switch as required and shows a hidden-from-AT asterisk', () => {
    render(<Switch label="I accept the terms" required />);
    const switchControl = screen.getByRole('switch', { name: 'I accept the terms' });
    expect(switchControl).toHaveAttribute('aria-required', 'true');
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows no asterisk when optional', () => {
    render(<Switch label="Notifications" />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });
});

/* ===============================================================
 * HINT AND ERROR
 * =============================================================== */

describe('Switch — hint and error', () => {
  it('only accepts plain text as the label', () => {
    // @ts-expect-error -- the label is the accessible name: text only, no markup
    render(<Switch label={<strong>Notifications</strong>} />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('describes the switch with the hint', () => {
    render(<Switch label="Notifications" hint="One email a week, at most" />);
    expect(screen.getByRole('switch')).toHaveAccessibleDescription('One email a week, at most');
  });

  it('requires an error message when invalid', () => {
    // @ts-expect-error -- `invalid` without `error` must not compile
    render(<Switch label="Notifications" invalid />);
    expect(screen.getByRole('switch')).not.toHaveAttribute('aria-invalid');
  });

  it('marks the switch invalid and reads hint then error', () => {
    render(
      <Switch
        label="Notifications"
        hint="One email a week, at most"
        invalid
        error="Confirm your email address to receive notifications"
      />,
    );
    const switchControl = screen.getByRole('switch');
    expect(switchControl).toHaveAttribute('aria-invalid', 'true');
    expect(switchControl).toHaveAccessibleDescription(
      'One email a week, at most Error: Confirm your email address to receive notifications',
    );
  });

  it('keeps its own aria-describedby first', () => {
    render(
      <>
        <p id="notifications-summary">Only for orders you place</p>
        <Switch label="Notifications" hint="Optional" aria-describedby="notifications-summary" />
      </>,
    );
    expect(screen.getByRole('switch')).toHaveAccessibleDescription(
      'Only for orders you place Optional',
    );
  });

  it('does not use a live region for the error', () => {
    render(<Switch label="Notifications" invalid error="Confirm your email address" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('does not mark the switch invalid when error is whitespace only', () => {
    render(<Switch label="Notifications" invalid error="   " />);
    expect(screen.getByRole('switch')).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();
  });
});

/* ===============================================================
 * DISABLED
 * =============================================================== */

describe('Switch — disabled', () => {
  it('cannot be toggled', async () => {
    const user = userEvent.setup();
    render(<Switch label="Notifications" disabled />);
    const switchControl = screen.getByRole('switch');
    expect(switchControl).toBeDisabled();
    await user.click(screen.getByText('Notifications'));
    expect(switchControl).not.toBeChecked();
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('Switch — accessibility', () => {
  it('has no axe violations across states', async () => {
    const { container } = render(
      <form>
        <Switch label="Email me new storage ideas" hint="One email a week, at most" />
        <Switch label="Order updates" defaultChecked />
        <Switch label="Price alerts" variant="secondary" defaultChecked />
        <Switch label="SMS alerts" disabled />
        <Switch
          label="Notifications"
          required
          invalid
          error="Confirm your email address to receive notifications"
        />
      </form>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
