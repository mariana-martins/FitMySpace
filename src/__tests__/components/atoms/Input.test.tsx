import userEvent from '@testing-library/user-event';
import { render, screen } from '@/__tests__/utils';
import { Input } from '@/components/atoms/Input';

describe('Input', () => {
  it('renders correctly', () => {
    render(<Input aria-label="Test input" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('accepts and displays user input', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Text input" />);
    const input = screen.getByRole('textbox');

    await user.type(input, 'Hello World');
    expect(input).toHaveValue('Hello World');
  });

  it('applies correct type attribute', () => {
    render(<Input type="email" aria-label="Email input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('renders password type input', () => {
    render(<Input type="password" data-testid="password-input" />);
    const input = screen.getByTestId('password-input');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('can be disabled', () => {
    render(<Input disabled aria-label="Disabled input" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:opacity-50');
  });

  it('displays placeholder text', () => {
    render(<Input placeholder="Enter text..." aria-label="Placeholder input" />);
    expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
  });

  it('merges custom className', () => {
    render(<Input className="custom-class" aria-label="Custom input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Input ref={ref} aria-label="Ref input" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('has accessible focus styles', () => {
    render(<Input aria-label="Focus input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('focus:ring-2');
  });

  it('accepts aria-invalid for error states', () => {
    render(<Input aria-invalid="true" aria-label="Invalid input" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveClass('aria-invalid:border-red-500');
  });

  it('calls onChange handler', async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} aria-label="Change input" />);

    await user.type(screen.getByRole('textbox'), 'a');
    expect(handleChange).toHaveBeenCalled();
  });
});
