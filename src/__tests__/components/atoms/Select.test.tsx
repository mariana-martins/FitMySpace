import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/Select';
import { render, screen } from '@/__tests__/utils';

// Mock pointer capture methods that jsdom doesn't support
beforeAll(() => {
  Element.prototype.hasPointerCapture = jest.fn().mockReturnValue(false);
  Element.prototype.setPointerCapture = jest.fn();
  Element.prototype.releasePointerCapture = jest.fn();
});

describe('Select', () => {
  const renderSelect = (defaultValue?: string) => {
    return render(
      <Select defaultValue={defaultValue}>
        <SelectTrigger aria-label="Select an option">
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>,
    );
  };

  it('renders the trigger button', () => {
    renderSelect();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays placeholder when no value selected', () => {
    renderSelect();
    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  it('displays default value when provided', () => {
    renderSelect('option2');
    expect(screen.getByRole('combobox')).toHaveTextContent('Option 2');
  });

  it('has accessible focus styles on trigger', () => {
    renderSelect();
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveClass('focus:ring-2');
  });

  it('has hover styles on trigger', () => {
    renderSelect();
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveClass('hover:border-slate-400');
  });

  it('renders chevron icon', () => {
    renderSelect();
    const trigger = screen.getByRole('combobox');
    const svg = trigger.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has aria-label on trigger', () => {
    renderSelect();
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAccessibleName('Select an option');
  });
});
