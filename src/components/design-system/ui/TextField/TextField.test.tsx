import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef } from 'react';
import { TextField } from './';

expect.extend(toHaveNoViolations);

/* ===============================================================
 * LABEL
 * =============================================================== */

describe('TextField — label', () => {
  it('links the visible label to the input', () => {
    render(<TextField label="Room width" />);
    const input = screen.getByLabelText('Room width');
    expect(input.tagName).toBe('INPUT');
  });

  it('renders a real <label> element', () => {
    render(<TextField label="Room width" />);
    expect(screen.getByText('Room width').closest('label')).toBeInTheDocument();
  });

  it('uses the given id', () => {
    render(<TextField label="Room width" id="room-width" />);
    expect(screen.getByLabelText('Room width')).toHaveAttribute('id', 'room-width');
  });

  it('forwards the ref to the <input>', () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextField label="Room width" ref={ref} />);
    expect(ref.current).toBe(screen.getByLabelText('Room width'));
  });
});

/* ===============================================================
 * REQUIRED
 * =============================================================== */

describe('TextField — required', () => {
  it('marks the input as required and shows a hidden-from-AT asterisk', () => {
    render(<TextField label="Room width" required />);
    const input = screen.getByRole('textbox', { name: 'Room width' });
    expect(input).toBeRequired();
    expect(input).not.toHaveAttribute('aria-required');
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows no asterisk when optional', () => {
    render(<TextField label="Room width" />);
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });
});

/* ===============================================================
 * HINT AND ERROR
 * =============================================================== */

describe('TextField — hint and error', () => {
  it('only accepts plain text as the hint', () => {
    // @ts-expect-error -- the hint is the accessible description: text only, no markup
    render(<TextField label="Room width" hint={<strong>Measure wall to wall</strong>} />);
    expect(screen.getByLabelText('Room width')).toBeInTheDocument();
  });

  it('describes the input with the hint', () => {
    render(<TextField label="Room width" hint="Measure wall to wall" />);
    expect(screen.getByLabelText('Room width')).toHaveAccessibleDescription('Measure wall to wall');
  });

  it('marks the input invalid and reads hint then error', () => {
    render(
      <TextField
        label="Room width"
        hint="Measure wall to wall"
        invalid
        error="Enter the room width in centimetres"
      />,
    );
    const input = screen.getByLabelText('Room width');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(
      'Measure wall to wall Error: Enter the room width in centimetres',
    );
  });

  it('includes the unit after the hint and error', () => {
    render(<TextField label="Room width" hint="Measure wall to wall" unit="cm" />);
    expect(screen.getByLabelText('Room width')).toHaveAccessibleDescription(
      'Measure wall to wall cm',
    );
  });

  it('does not use a live region for the error', () => {
    render(<TextField label="Room width" invalid error="Enter the room width" />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('is valid when there is no error', () => {
    render(<TextField label="Room width" />);
    expect(screen.getByLabelText('Room width')).not.toHaveAttribute('aria-invalid');
  });

  it('does not mark the input invalid when error is whitespace only', () => {
    render(<TextField label="Room width" invalid error="   " />);
    expect(screen.getByLabelText('Room width')).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByText(/Error:/)).not.toBeInTheDocument();
  });
});

/* ===============================================================
 * PASS-THROUGH
 * =============================================================== */

describe('TextField — native props', () => {
  it('passes native attributes to the input', () => {
    render(<TextField label="Email" type="email" name="email" autoComplete="email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('autocomplete', 'email');
  });

  it('disables the input', () => {
    render(<TextField label="Room width" disabled />);
    expect(screen.getByLabelText('Room width')).toBeDisabled();
  });

  it('accepts typed text', async () => {
    const user = userEvent.setup();
    render(<TextField label="Room name" />);
    const input = screen.getByLabelText('Room name');
    await user.type(input, 'Studio');
    expect(input).toHaveValue('Studio');
  });

  it('focuses the input when the label is clicked', async () => {
    const user = userEvent.setup();
    render(<TextField label="Room name" />);
    await user.click(screen.getByText('Room name'));
    expect(screen.getByLabelText('Room name')).toHaveFocus();
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('TextField — accessibility', () => {
  it('has no axe violations across states', async () => {
    const { container } = render(
      <form>
        <TextField label="Room name" hint="Shown on your saved rooms" />
        <TextField label="Room width" unit="cm" required />
        <TextField
          label="Room depth"
          unit="cm"
          invalid
          error="Enter the room depth in centimetres"
        />
        <TextField label="Ceiling height" disabled />
      </form>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
