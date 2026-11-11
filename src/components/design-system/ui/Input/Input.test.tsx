import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Search } from 'lucide-react';
import { createRef } from 'react';
import { Input } from './';

expect.extend(toHaveNoViolations);

function getFieldWrapper(input: HTMLElement) {
  return input.parentElement as HTMLElement;
}

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('Input — rendering', () => {
  it('renders a native text input by default', () => {
    render(<Input aria-label="Room name" />);
    const input = screen.getByRole('textbox', { name: 'Room name' });
    expect(input.tagName).toBe('INPUT');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('passes the type through', () => {
    render(<Input aria-label="Email" type="email" />);
    expect(screen.getByRole('textbox', { name: 'Email' })).toHaveAttribute('type', 'email');
  });

  it('forwards the ref to the <input>', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input aria-label="Room name" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('applies className to the wrapper, not the input', () => {
    render(<Input aria-label="Room name" className="custom" />);
    const input = screen.getByRole('textbox');
    expect(getFieldWrapper(input)).toHaveClass('custom');
    expect(input).not.toHaveClass('custom');
  });
});

/* ===============================================================
 * SIZES
 * =============================================================== */

describe('Input — sizes', () => {
  it('uses size-md by default', () => {
    render(<Input aria-label="Room name" />);
    expect(getFieldWrapper(screen.getByRole('textbox'))).toHaveClass('size-md');
  });

  it.each(['sm', 'md', 'lg'] as const)('applies size-%s', (size) => {
    render(<Input aria-label="Room name" size={size} />);
    expect(getFieldWrapper(screen.getByRole('textbox'))).toHaveClass(`size-${size}`);
  });
});

/* ===============================================================
 * STATES
 * =============================================================== */

describe('Input — states', () => {
  it('sets aria-invalid and data-invalid when invalid', () => {
    render(<Input aria-label="Width" invalid />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(getFieldWrapper(input)).toHaveAttribute('data-invalid', 'true');
  });

  it('honours aria-invalid passed directly', () => {
    render(<Input aria-label="Width" aria-invalid="true" />);
    expect(getFieldWrapper(screen.getByRole('textbox'))).toHaveAttribute('data-invalid', 'true');
  });

  it('omits aria-invalid when valid', () => {
    render(<Input aria-label="Width" />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });

  it('disables the native input', () => {
    render(<Input aria-label="Width" disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(getFieldWrapper(input)).toHaveAttribute('data-disabled', 'true');
  });

  it('marks read-only fields', () => {
    render(<Input aria-label="Width" readOnly value="320" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('readonly');
    expect(getFieldWrapper(input)).toHaveAttribute('data-readonly', 'true');
  });
});

/* ===============================================================
 * ADORNMENTS
 * =============================================================== */

describe('Input — adornments', () => {
  it('hides icons from assistive technology', () => {
    render(<Input aria-label="Search" iconStart={<Search data-testid="icon" />} />);
    expect(screen.getByTestId('icon').parentElement).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('textbox')).not.toHaveAccessibleDescription();
  });

  it('shows the unit and adds it to the accessible description', () => {
    render(<Input aria-label="Width" unit="cm" />);
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('cm');
  });

  it('keeps an existing aria-describedby alongside the unit', () => {
    render(
      <>
        <p id="width-hint">Measure wall to wall</p>
        <Input aria-label="Width" unit="cm" aria-describedby="width-hint" />
      </>,
    );
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Measure wall to wall cm');
  });
});

/* ===============================================================
 * INTERACTION
 * =============================================================== */

describe('Input — interaction', () => {
  it('accepts typed text', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Room name" />);
    const input = screen.getByRole('textbox');
    await user.type(input, 'Living room');
    expect(input).toHaveValue('Living room');
  });

  it('focuses the input when the unit is clicked', () => {
    render(<Input aria-label="Width" unit="cm" />);
    fireEvent.mouseDown(screen.getByText('cm'));
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('does not focus a disabled input when the box is clicked', () => {
    render(<Input aria-label="Width" unit="cm" disabled />);
    fireEvent.mouseDown(screen.getByText('cm'));
    expect(screen.getByRole('textbox')).not.toHaveFocus();
  });
});

/* ===============================================================
 * END ACTION
 * =============================================================== */

describe('Input — end action', () => {
  function renderSearchWithClearButton(handleClear = jest.fn()) {
    render(
      <Input
        aria-label="Search furniture"
        type="search"
        endAction={
          <button type="button" onClick={handleClear}>
            Clear search
          </button>
        }
      />,
    );
    return handleClear;
  }

  it('keeps the action visible to assistive technology', () => {
    renderSearchWithClearButton();
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument();
  });

  it('runs the action when it is clicked', async () => {
    const user = userEvent.setup();
    const handleClear = renderSearchWithClearButton();
    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('does not hijack a mousedown on the action to focus the input', () => {
    renderSearchWithClearButton();
    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    const isNotPrevented = fireEvent.mouseDown(clearButton);
    expect(isNotPrevented).toBe(true);
    expect(screen.getByRole('searchbox')).not.toHaveFocus();
  });

  it('is reached with Tab right after the input', async () => {
    const user = userEvent.setup();
    renderSearchWithClearButton();
    await user.tab();
    expect(screen.getByRole('searchbox')).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Clear search' })).toHaveFocus();
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('Input — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <>
        <label htmlFor="room-width">Room width</label>
        <Input id="room-width" unit="cm" iconStart={<Search />} />
        <Input aria-label="Disabled field" disabled />
        <Input aria-label="Invalid field" invalid />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
