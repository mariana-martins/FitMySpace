import { render, screen } from '@testing-library/react';
import { Select, SelectGroup, SelectItem } from './';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Store } from 'lucide-react';
import { createRef } from 'react';

expect.extend(toHaveNoViolations);

// jsdom lacks the pointer-capture and scrolling APIs Radix Select calls.
beforeAll(() => {
  Element.prototype.hasPointerCapture = jest.fn().mockReturnValue(false);
  Element.prototype.setPointerCapture = jest.fn();
  Element.prototype.releasePointerCapture = jest.fn();
  Element.prototype.scrollIntoView = jest.fn();
});

const STORE_ITEMS = [
  <SelectItem key="ikea" value="ikea">
    IKEA
  </SelectItem>,
  <SelectItem key="muji" value="muji">
    Muji
  </SelectItem>,
  <SelectItem key="the-container-store" value="the-container-store" disabled>
    The Container Store
  </SelectItem>,
];

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('Select — rendering', () => {
  it('renders a closed combobox button named by its label', () => {
    render(<Select aria-label="Store">{STORE_ITEMS}</Select>);
    const trigger = screen.getByRole('combobox', { name: 'Store' });
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('forwards the ref to the trigger <button>', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Select ref={ref} aria-label="Store">
        {STORE_ITEMS}
      </Select>,
    );
    expect(ref.current).toBe(screen.getByRole('combobox'));
  });

  it('puts the size class and the class name on the trigger', () => {
    render(
      <Select aria-label="Store" size="lg" className="custom">
        {STORE_ITEMS}
      </Select>,
    );
    expect(screen.getByRole('combobox')).toHaveClass('trigger', 'size-lg', 'custom');
  });

  it('shows the placeholder while nothing is chosen', () => {
    render(
      <Select aria-label="Store" placeholder="Choose a store">
        {STORE_ITEMS}
      </Select>,
    );
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveTextContent('Choose a store');
    expect(trigger).toHaveAttribute('data-placeholder');
  });

  it('shows the chosen option in the trigger', () => {
    render(
      <Select aria-label="Store" defaultValue="muji">
        {STORE_ITEMS}
      </Select>,
    );
    expect(screen.getByRole('combobox')).toHaveTextContent('Muji');
  });

  it('hides the start icon and the chevron from assistive technology', () => {
    render(
      <Select aria-label="Store" iconStart={<Store />}>
        {STORE_ITEMS}
      </Select>,
    );
    const svgs = screen.getByRole('combobox').querySelectorAll('svg');
    expect(svgs).toHaveLength(2);
    svgs.forEach((svg) => expect(svg.closest('[aria-hidden="true"]')).not.toBeNull());
  });
});

/* ===============================================================
 * CHOOSING
 * =============================================================== */

describe('Select — choosing', () => {
  it('opens with the keyboard and chooses with Enter', async () => {
    const user = userEvent.setup();
    const handleValueChange = jest.fn();
    render(
      <Select aria-label="Store" placeholder="Choose a store" onValueChange={handleValueChange}>
        {STORE_ITEMS}
      </Select>,
    );
    await user.tab();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{ArrowDown}{Enter}');
    expect(handleValueChange).toHaveBeenCalledWith('muji');
    expect(screen.getByRole('combobox')).toHaveTextContent('Muji');
    expect(screen.getByRole('combobox')).toHaveFocus();
  });

  it('chooses an option with a click', async () => {
    const user = userEvent.setup();
    render(
      <Select aria-label="Store" placeholder="Choose a store">
        {STORE_ITEMS}
      </Select>,
    );
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: 'IKEA' }));
    expect(screen.getByRole('combobox')).toHaveTextContent('IKEA');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('marks the chosen option as selected', async () => {
    const user = userEvent.setup();
    render(
      <Select aria-label="Store" defaultValue="muji">
        {STORE_ITEMS}
      </Select>,
    );
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'Muji' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('option', { name: 'IKEA' })).toHaveAttribute('aria-selected', 'false');
  });

  it('keeps disabled options out of reach', async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Store">{STORE_ITEMS}</Select>);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('option', { name: 'The Container Store' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('names option groups with their label', async () => {
    const user = userEvent.setup();
    render(
      <Select aria-label="Store">
        <SelectGroup label="Furniture">
          <SelectItem value="ikea">IKEA</SelectItem>
        </SelectGroup>
      </Select>,
    );
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('group', { name: 'Furniture' })).toBeInTheDocument();
  });
});

/* ===============================================================
 * STATES AND FORMS
 * =============================================================== */

describe('Select — states and forms', () => {
  it('marks the trigger as required and invalid', () => {
    render(
      <Select aria-label="Store" required invalid>
        {STORE_ITEMS}
      </Select>,
    );
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-required', 'true');
    expect(trigger).toHaveAttribute('aria-invalid', 'true');
  });

  it('cannot be opened when disabled', async () => {
    const user = userEvent.setup();
    render(
      <Select aria-label="Store" disabled>
        {STORE_ITEMS}
      </Select>,
    );
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('submits the chosen value with its name inside a form', () => {
    render(
      <form aria-label="Filters">
        <Select aria-label="Store" name="store" defaultValue="muji">
          {STORE_ITEMS}
        </Select>
      </form>,
    );
    const formData = new FormData(screen.getByRole<HTMLFormElement>('form'));
    expect(formData.get('store')).toBe('muji');
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('Select — accessibility', () => {
  it('has no axe violations across states', async () => {
    const { container } = render(
      <form>
        <Select aria-label="Store" placeholder="Choose a store" iconStart={<Store />}>
          {STORE_ITEMS}
        </Select>
        <Select aria-label="Pickup store" defaultValue="muji" invalid>
          {STORE_ITEMS}
        </Select>
        <Select aria-label="Delivery store" disabled>
          {STORE_ITEMS}
        </Select>
      </form>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
