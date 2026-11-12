import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { RadioGroup, RadioGroupItem } from './';
import { createRef, useState } from 'react';

expect.extend(toHaveNoViolations);

// jsdom lacks ResizeObserver, which Radix uses to size the hidden form inputs.
beforeAll(() => {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

function DeliveryGroup(props: Partial<React.ComponentProps<typeof RadioGroup>>) {
  return (
    <RadioGroup label="Delivery" {...(props as object)}>
      <RadioGroupItem value="standard" label="Standard" hint="3 to 5 working days" />
      <RadioGroupItem value="express" label="Express" />
      <RadioGroupItem value="pickup" label="Store pickup" disabled />
    </RadioGroup>
  );
}

/* ===============================================================
 * LABEL
 * =============================================================== */

describe('RadioGroup — label', () => {
  it('renders a radiogroup named by its visible label', () => {
    render(<DeliveryGroup />);
    expect(screen.getByRole('radiogroup', { name: 'Delivery' })).toBeInTheDocument();
    expect(screen.getByText('Delivery')).toBeVisible();
  });

  it('names each radio by its visible label', () => {
    render(<DeliveryGroup />);
    expect(screen.getByRole('radio', { name: 'Standard' })).toBeInTheDocument();
    expect(screen.getByText('Express').closest('label')).toBeInTheDocument();
  });

  it('describes an option with its hint', () => {
    render(<DeliveryGroup />);
    expect(screen.getByRole('radio', { name: 'Standard' })).toHaveAccessibleDescription(
      '3 to 5 working days',
    );
  });

  it('forwards the refs to the radiogroup and the radio', () => {
    const groupRef = createRef<HTMLDivElement>();
    const radioRef = createRef<HTMLButtonElement>();
    render(
      <RadioGroup label="Delivery" ref={groupRef}>
        <RadioGroupItem value="standard" label="Standard" ref={radioRef} />
      </RadioGroup>,
    );
    expect(groupRef.current).toBe(screen.getByRole('radiogroup'));
    expect(radioRef.current).toBe(screen.getByRole('radio'));
  });
});

/* ===============================================================
 * VARIANTS AND LAYOUT
 * =============================================================== */

describe('RadioGroup — variants and layout', () => {
  it('uses the primary variant and medium size by default', () => {
    const { container } = render(<DeliveryGroup />);
    expect(container.firstChild).toHaveClass('variant-primary', 'size-md');
  });

  it.each(['primary', 'secondary'] as const)('applies variant-%s class', (variant) => {
    const { container } = render(<DeliveryGroup variant={variant} />);
    expect(container.firstChild).toHaveClass(`variant-${variant}`);
  });

  it('lays the options out without limiting the arrow keys to one axis', () => {
    render(<DeliveryGroup orientation="horizontal" />);
    const group = screen.getByRole('radiogroup');
    expect(group).toHaveAttribute('data-orientation', 'horizontal');
    expect(group).not.toHaveAttribute('aria-orientation');
  });
});

/* ===============================================================
 * SELECTION AND KEYBOARD
 * =============================================================== */

describe('RadioGroup — selection and keyboard', () => {
  it('checks an option with a click on the radio or its label', async () => {
    const user = userEvent.setup();
    render(<DeliveryGroup />);
    await user.click(screen.getByRole('radio', { name: 'Standard' }));
    expect(screen.getByRole('radio', { name: 'Standard' })).toBeChecked();
    await user.click(screen.getByText('Express'));
    expect(screen.getByRole('radio', { name: 'Express' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Standard' })).not.toBeChecked();
  });

  it('enters on the checked option and moves with the arrow keys, skipping disabled ones', async () => {
    const user = userEvent.setup();
    render(<DeliveryGroup defaultValue="express" />);
    await user.tab();
    expect(screen.getByRole('radio', { name: 'Express' })).toHaveFocus();
    // Radix moves focus on the next tick and checks the radio while the arrow is still down.
    await user.keyboard('{ArrowDown>}');
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Standard' })).toHaveFocus());
    expect(screen.getByRole('radio', { name: 'Standard' })).toBeChecked();
    await user.keyboard('{/ArrowDown}{ArrowRight>}');
    await waitFor(() => expect(screen.getByRole('radio', { name: 'Express' })).toBeChecked());
    await user.keyboard('{/ArrowRight}');
  });

  it('works as a controlled group', async () => {
    const user = userEvent.setup();
    const ControlledGroup = () => {
      const [delivery, setDelivery] = useState('standard');
      return <DeliveryGroup value={delivery} onValueChange={setDelivery} />;
    };
    render(<ControlledGroup />);
    await user.click(screen.getByRole('radio', { name: 'Express' }));
    expect(screen.getByRole('radio', { name: 'Express' })).toBeChecked();
  });

  it('submits the checked value with the form', async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="Checkout">
        <DeliveryGroup name="delivery" />
      </form>,
    );
    await user.click(screen.getByRole('radio', { name: 'Express' }));
    const formData = new FormData(screen.getByRole<HTMLFormElement>('form'));
    expect(formData.get('delivery')).toBe('express');
  });
});

/* ===============================================================
 * REQUIRED, HINT AND ERROR
 * =============================================================== */

describe('RadioGroup — required, hint and error', () => {
  it('marks the group, not each radio, as required and shows a hidden-from-AT asterisk', () => {
    render(<DeliveryGroup required />);
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-required', 'true');
    expect(screen.getByRole('radio', { name: 'Standard' })).not.toHaveAttribute('aria-required');
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('describes the group with its hint', () => {
    render(<DeliveryGroup hint="Free over €50." />);
    expect(screen.getByRole('radiogroup')).toHaveAccessibleDescription('Free over €50.');
  });

  it('requires an error message when invalid', () => {
    render(
      // @ts-expect-error -- `invalid` without `error` must not compile
      <RadioGroup label="Delivery" invalid>
        <RadioGroupItem value="standard" label="Standard" />
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-invalid');
  });

  it('marks the group invalid and reads hint then error', () => {
    render(
      <DeliveryGroup hint="Free over €50." invalid error="Choose how to receive the order." />,
    );
    const group = screen.getByRole('radiogroup');
    expect(group).toHaveAttribute('aria-invalid', 'true');
    expect(group).toHaveAccessibleDescription(
      'Free over €50. Error: Choose how to receive the order.',
    );
  });
});

/* ===============================================================
 * DISABLED
 * =============================================================== */

describe('RadioGroup — disabled', () => {
  it('disables one option', async () => {
    const user = userEvent.setup();
    render(<DeliveryGroup />);
    const pickup = screen.getByRole('radio', { name: 'Store pickup' });
    expect(pickup).toBeDisabled();
    await user.click(screen.getByText('Store pickup'));
    expect(pickup).not.toBeChecked();
  });

  it('disables the whole group', () => {
    render(<DeliveryGroup disabled />);
    screen.getAllByRole('radio').forEach((radio) => expect(radio).toBeDisabled());
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('RadioGroup — accessibility', () => {
  it('has no axe violations across states', async () => {
    const { container } = render(
      <form>
        <DeliveryGroup defaultValue="standard" hint="Free over €50." />
        <RadioGroup label="Gift wrap" variant="secondary" required invalid error="Choose one.">
          <RadioGroupItem value="yes" label="Yes" />
          <RadioGroupItem value="no" label="No" />
        </RadioGroup>
      </form>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
