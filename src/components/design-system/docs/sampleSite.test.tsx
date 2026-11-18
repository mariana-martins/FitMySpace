import { SAMPLE_NAVIGATION, SampleFooter, SampleSiteHeader } from './';
import { render, screen, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

/* ===============================================================
 * HEADER
 * =============================================================== */

describe('SampleSiteHeader — layouts', () => {
  it('shows the main navigation in a row on a wide screen, the first page current', () => {
    render(<SampleSiteHeader layout="wide" />);
    const navigation = within(screen.getByRole('banner')).getByRole('navigation', {
      name: 'Main navigation',
    });

    expect(within(navigation).getAllByRole('link')).toHaveLength(SAMPLE_NAVIGATION.length);
    expect(within(navigation).getByRole('link', { name: 'Recent arrivals' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('folds the navigation behind a menu button on a narrow screen', () => {
    render(<SampleSiteHeader layout="narrow" />);

    expect(screen.getByRole('button', { name: 'Open the menu' })).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<SampleSiteHeader layout="wide" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

/* ===============================================================
 * FOOTER
 * =============================================================== */

describe('SampleFooter — groups', () => {
  it('names each group of links by its heading', () => {
    render(<SampleFooter />);

    expect(within(screen.getByRole('contentinfo')).getAllByRole('navigation')).toHaveLength(2);
    expect(screen.getByRole('navigation', { name: 'Shop by room' })).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<SampleFooter />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
