import { SkipLink } from '@/components/atoms/SkipLink';
import { render, screen } from '@/__tests__/utils';

describe('SkipLink', () => {
  it('renders correctly', () => {
    render(<SkipLink />);
    expect(screen.getByRole('link', { name: /skip to content/i })).toBeInTheDocument();
  });

  it('has default target id', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '#main-content');
  });

  it('accepts custom target id', () => {
    render(<SkipLink targetId="custom-content" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '#custom-content');
  });

  it('is visually hidden by default (sr-only)', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('sr-only');
  });

  it('becomes visible on focus', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('focus:not-sr-only');
  });

  it('has fixed positioning when focused', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('focus:fixed');
    expect(link).toHaveClass('focus:top-2');
    expect(link).toHaveClass('focus:left-6');
  });

  it('has high z-index when focused', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('focus:z-50');
  });

  it('renders icon with aria-hidden', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link');
    const icon = link.querySelector('svg');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('merges custom className', () => {
    render(<SkipLink className="custom-class" />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('custom-class');
  });

  it('has focus ring styles for accessibility', () => {
    render(<SkipLink />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('focus:ring-2');
  });
});
