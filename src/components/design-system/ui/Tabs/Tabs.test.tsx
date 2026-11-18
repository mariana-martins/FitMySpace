import { Tabs, TabsContent, TabsList, TabsTrigger } from './';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { createRef } from 'react';

import type { TabsListProps, TabsProps } from './';
import type { Ref } from 'react';

expect.extend(toHaveNoViolations);

type FixtureOptions = {
  rootProps?: Partial<TabsProps>;
  listProps?: Partial<TabsListProps>;
  triggerRef?: Ref<HTMLButtonElement>;
  storesDisabled?: boolean;
};

/** The product page tabs every test renders: details, measurements and stores. */
function ProductTabs({ rootProps, listProps, triggerRef, storesDisabled }: FixtureOptions) {
  return (
    <Tabs defaultValue="details" {...rootProps}>
      <TabsList aria-label="Product information" {...listProps}>
        <TabsTrigger ref={triggerRef} value="details">
          Details
        </TabsTrigger>
        <TabsTrigger value="measurements" icon="ruler">
          Measurements
        </TabsTrigger>
        <TabsTrigger value="stores" disabled={storesDisabled}>
          Stores
        </TabsTrigger>
      </TabsList>

      <TabsContent value="details">Three open shelves in oiled bamboo.</TabsContent>
      <TabsContent value="measurements">48 cm wide, 26 cm deep, 70 cm high.</TabsContent>
      <TabsContent value="stores">The Container Store, R$ 249.</TabsContent>
    </Tabs>
  );
}

/* ===============================================================
 * RENDERING
 * =============================================================== */

describe('Tabs — rendering', () => {
  it('renders a named tab list with one tab per trigger', () => {
    render(<ProductTabs />);

    expect(screen.getByRole('tablist', { name: 'Product information' })).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('shows only the panel of the selected tab, named by its tab', () => {
    render(<ProductTabs />);

    expect(screen.getByRole('tabpanel', { name: 'Details' })).toHaveTextContent(
      'Three open shelves in oiled bamboo.',
    );
    expect(screen.queryByText('48 cm wide, 26 cm deep, 70 cm high.')).not.toBeInTheDocument();
  });

  it('marks the selected tab and points it at its panel', () => {
    render(<ProductTabs />);
    const details = screen.getByRole('tab', { name: 'Details' });

    expect(details).toHaveAttribute('aria-selected', 'true');
    expect(details).toHaveAttribute('aria-controls', screen.getByRole('tabpanel').id);
    expect(screen.getByRole('tab', { name: 'Stores' })).toHaveAttribute('aria-selected', 'false');
  });

  it('draws the icon as decoration, so the words stay the name', () => {
    render(<ProductTabs />);
    const measurements = screen.getByRole('tab', { name: 'Measurements' });

    expect(measurements.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('puts the size class on the list, md by default', () => {
    const { rerender } = render(<ProductTabs />);
    expect(screen.getByRole('tablist')).toHaveClass('list', 'size-md');

    rerender(<ProductTabs listProps={{ size: 'sm', className: 'custom' }} />);
    expect(screen.getByRole('tablist')).toHaveClass('list', 'size-sm', 'custom');
  });

  it('forwards the ref to the tab button', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<ProductTabs triggerRef={ref} />);

    expect(ref.current).toBe(screen.getByRole('tab', { name: 'Details' }));
  });

  it('says the orientation of a vertical list', () => {
    render(<ProductTabs rootProps={{ orientation: 'vertical' }} />);

    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
  });
});

/* ===============================================================
 * KEYBOARD AND POINTER
 * =============================================================== */

describe('Tabs — keyboard and pointer', () => {
  it('shows a panel when its tab is clicked and reports the value', async () => {
    const user = userEvent.setup();
    const handleValueChange = jest.fn();
    render(<ProductTabs rootProps={{ onValueChange: handleValueChange }} />);

    await user.click(screen.getByRole('tab', { name: 'Measurements' }));

    expect(screen.getByRole('tabpanel', { name: 'Measurements' })).toBeInTheDocument();
    expect(handleValueChange).toHaveBeenCalledWith('measurements');
  });

  it('enters the list on the selected tab, then moves into the panel', async () => {
    const user = userEvent.setup();
    render(<ProductTabs rootProps={{ defaultValue: 'measurements' }} />);

    await user.tab();
    expect(screen.getByRole('tab', { name: 'Measurements' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('tabpanel', { name: 'Measurements' })).toHaveFocus();
  });

  it('moves with the arrow keys, wraps at the ends, and jumps with Home and End', async () => {
    const user = userEvent.setup();
    render(<ProductTabs />);

    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Measurements' })).toHaveFocus();
    expect(screen.getByRole('tabpanel', { name: 'Measurements' })).toBeInTheDocument();

    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Stores' })).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Details' })).toHaveFocus();

    await user.keyboard('{End}{Home}');
    expect(screen.getByRole('tab', { name: 'Details' })).toHaveFocus();
  });

  it('waits for Enter or Space in manual mode', async () => {
    const user = userEvent.setup();
    render(<ProductTabs rootProps={{ activationMode: 'manual' }} />);

    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tabpanel', { name: 'Details' })).toBeInTheDocument();

    await user.keyboard('{Enter}');
    expect(screen.getByRole('tabpanel', { name: 'Measurements' })).toBeInTheDocument();
  });

  it('skips a disabled tab', async () => {
    const user = userEvent.setup();
    render(<ProductTabs storesDisabled />);

    expect(screen.getByRole('tab', { name: 'Stores' })).toBeDisabled();

    await user.tab();
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Details' })).toHaveFocus();
  });
});

/* ===============================================================
 * ACCESSIBILITY
 * =============================================================== */

describe('Tabs — accessibility', () => {
  it('has no axe violations', async () => {
    const { container } = render(<ProductTabs />);

    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations when vertical with a disabled tab', async () => {
    const { container } = render(
      <ProductTabs rootProps={{ orientation: 'vertical' }} storesDisabled />,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
