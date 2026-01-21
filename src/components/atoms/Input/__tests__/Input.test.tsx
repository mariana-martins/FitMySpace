import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText(/enter text/i)).toBeInTheDocument();
  });

  it('handles user input', async () => {
    const user = userEvent.setup();
    render(<Input type="text" />);
    const input = screen.getByRole('textbox');

    await user.type(input, 'Hello World');
    expect(input).toHaveValue('Hello World');
  });

  it('is accessible with label', () => {
    render(
      <>
        <label htmlFor="test-input">Test Label</label>
        <Input id="test-input" type="text" />
      </>,
    );
    const input = screen.getByLabelText(/test label/i);
    expect(input).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(<Input disabled type="text" />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('shows aria-invalid when invalid', () => {
    render(<Input aria-invalid="true" type="text" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
