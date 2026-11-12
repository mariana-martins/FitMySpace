import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import type { CheckboxCheckedState } from './';
import { createRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Checkbox } from './';

expect.extend(toHaveNoViolations);

// jsdom lacks ResizeObserver, which Radix Checkbox uses to size its hidden form input.
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

describe('Checkbox — label', () => {
  it('renders a checkbox button named by its visible label', () => {
    render(<Checkbox label="Waterproof" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Waterproof' });
    expect(checkbox.tagName).toBe('BUTTON');
    expect(checkbox).toHaveAttribute('type', 'button');
  });

  it('renders a real <label> element', () => {
    render(<Checkbox label="Waterproof" />);
    expect(screen.getByText('Waterproof').closest('label')).toBeInTheDocument();
  });

  it('uses the given id', () => {
    render(<Checkbox label="Waterproof" id="waterproof" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('id', 'waterproof');
  });

  it('forwards the ref to the <button>', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Checkbox label="Waterproof" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('checkbox'));
  });

  it('hides the check and mixed marks from assistive technology', () => {
    const { container } = render(<Checkbox label="Waterproof" defaultChecked />);
    const svgs = container.querySelectorAll('svg');
    expect(svgs).toHaveLength(2);
    svgs.forEach((svg) => expect(svg.closest('[aria-hidden="true"]')).not.toBeNull());
  });
});

/* ===============================================================
 * VARIANTS
 * =============================================================== */

describe('Checkbox — variants', () => {
  it('uses the primary variant by default', () => {
    const { container } = render(<Checkbox label="Waterproof" />);
    expect(container.firstChild).toHaveClass('variant-primary');
  });

  it.each(['primary', 'secondary'] as const)('applies variant-%s class', (variant) => {
    const { container } = render(<Checkbox label="Waterproof" variant={variant} />);
    expect(container.firstChild).toHaveClass(`variant-${variant}`);
  });
});

/* ===============================================================
 * CHECKED STATE
 * =============================================================== */

describe('Checkbox — checked state', () => {
  it('toggles with a click on the box or the label', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Waterproof" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Waterproof' });

    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    await user.click(screen.getByText('Waterproof'));
    expect(checkbox).not.toBeChecked();
  });

  it('toggles with the Space key but not with Enter', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Waterproof" />);
    await user.tab();
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(checkbox).not.toBeChecked();
    await user.keyboard(' ');
    expect(checkbox).toBeChecked();
  });

  it('works as a controlled checkbox', async () => {
    const user = userEvent.setup();
    const ControlledCheckbox = () => {
      const [checkedState, setCheckedState] = useState<CheckboxCheckedState>(true);
      return (
        <Checkbox label="Waterproof" checked={checkedState} onCheckedChange={setCheckedState} />
      );
    };
    render(<ControlledCheckbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('announces the mixed state', () => {
    render(<Checkbox label="Select all" checked="indeterminate" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBePartiallyChecked();
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
  });

  it('asks for checked when a mixed box is clicked', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = jest.fn();
    render(
      <Checkbox label="Select all" checked="indeterminate" onCheckedChange={handleCheckedChange} />,
    );
    await user.click(screen.getByRole('checkbox'));
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it('submits its name and value only when checked', () => {
    render(
      <form aria-label="Filters">
        <Checkbox label="Waterproof" name="feature" value="waterproof" defaultChecked />
        <Checkbox label="Stackable" name="feature" value="stackable" />
      </form>,
    );
    const formData = new FormData(screen.getByRole<HTMLFormElement>('form'));
    expect(formData.getAll('feature')).toEqual(['waterproof']);
  });

  it('never submits the form when clicked', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn((event: FormEvent) => event.preventDefault());
    render(
      <form aria-label="Filters" onSubmit={handleSubmit}>
        <Checkbox label="Waterproof" name="feature" value="waterproof" />
      </form>,
    );
    await user.click(screen.getByRole('checkbox'));
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('goes back to its default state when the form resets', async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="Filters">
        <Checkbox label="Waterproof" name="feature" value="waterproof" />
        <button type="reset">Reset</button>
      </form>,
    );
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(checkbox).not.toBeChecked();
  });
});

/* ===============================================================
 * REQUIRED
 * =============================================================== */

describe('Checkbox — required', () => {
  it('marks the checkbox as required and shows a hidden-from-AT asterisk', () => {
    render(<Checkbox label="I accept the terms" required />);
    const checkbox = screen.getByRole('checkbox', { name: 'I accept the terms' });
    expect(checkbox).toBeRequired();
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows no asterisk when optional', () => {
    render(<Checkbox label="Waterproof" />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });
});

/* ===============================================================
 * HINT AND ERROR
 * =============================================================== */

describe('Checkbox — hint and error', () => {
  it('only accepts plain text as the label', () => {
    // @ts-expect-error -- the label is the accessible name: text only, no markup
    render(<Checkbox label={<strong>Waterproof</strong>} />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('describes the checkbox with the hint', () => {
    render(<Checkbox label="Waterproof" hint="Safe for bathrooms" />);
    expect(screen.getByRole('checkbox')).toHaveAccessibleDescription('Safe for bathrooms');
  });

  it('requires an error message when invalid', () => {
    // @ts-expect-error -- `invalid` without `error` must not compile
    render(<Checkbox label="I accept the terms" invalid />);
    expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-invalid');
  });

  it('marks the checkbox invalid and reads hint then error', () => {
    render(
      <Checkbox
        label="I accept the terms"
        hint="You can read them before ordering"
        invalid
        error="Accept the terms to place the order"
      />,
    );
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAccessibleDescription(
      'You can read them before ordering Error: Accept the terms to place the order',
    );
  });

  it('keeps its own aria-describedby first', () => {
    render(
      <>
        <p id="terms-summary">Returns within 30 days</p>
        <Checkbox label="I accept the terms" hint="Required" aria-describedby="terms-summary" />
      </>,
    );
    expect(screen.getByRole('checkbox')).toHaveAccessibleDescription(
      'Returns within 30 days Required',
    );
  });

  it('does not use a live region for the error', () => {
    render(<Checkbox label="I accept the terms" invalid error="Accept the terms" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('does not mark the checkbox invalid when error is whitespace only', () => {
    render(<Checkbox label="I accept the terms" invalid error="   " />);
    expect(screen.getByRole('checkbox')).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();
  });
});

/* ===============================================================
 * DISABLED
 * =============================================================== */

describe('Checkbox — disabled', () => {
  it('cannot be toggled', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Waterproof" disabled />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
    await user.click(screen.getByText('Waterproof'));
    expect(checkbox).not.toBeChecked();
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('Checkbox — accessibility', () => {
  it('has no axe violations across states', async () => {
    const { container } = render(
      <form>
        <fieldset>
          <legend>Features</legend>
          <Checkbox label="Waterproof" hint="Safe for bathrooms" />
          <Checkbox label="Stackable" defaultChecked />
          <Checkbox label="Foldable frame" variant="secondary" defaultChecked />
          <Checkbox label="Select all" checked="indeterminate" />
          <Checkbox label="Foldable" disabled />
        </fieldset>
        <Checkbox label="I accept the terms" required invalid error="Accept the terms" />
      </form>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
