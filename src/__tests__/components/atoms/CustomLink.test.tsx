import { CustomLink } from '@/components/atoms/CustomLink';
import { render, screen } from '@/__tests__/utils';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

describe('CustomLink', () => {
  it('renders children correctly', () => {
    render(<CustomLink href="/test">Test Link</CustomLink>);
    expect(screen.getByRole('link', { name: 'Test Link' })).toBeInTheDocument();
  });

  it('has correct href attribute', () => {
    render(<CustomLink href="/about">About</CustomLink>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/about');
  });

  it('applies active state styles and aria-current', () => {
    render(
      <CustomLink href="/current" isActive>
        Current Page
      </CustomLink>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass('text-brand-secondary');
  });

  it('does not have aria-current when not active', () => {
    render(<CustomLink href="/other">Other Page</CustomLink>);
    const link = screen.getByRole('link');
    expect(link).not.toHaveAttribute('aria-current');
  });

  it('merges custom className', () => {
    render(
      <CustomLink href="/test" className="custom-class">
        Custom
      </CustomLink>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveClass('custom-class');
  });

  it('renders decorative underline span', () => {
    render(<CustomLink href="/test">With Underline</CustomLink>);
    const link = screen.getByRole('link');
    const underline = link.querySelector('span[aria-hidden="true"]');
    expect(underline).toBeInTheDocument();
  });

  it('has focus styles for accessibility', () => {
    render(<CustomLink href="/test">Focusable</CustomLink>);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('focus-visible:outline-none');
    expect(link).toHaveClass('focus-visible:ring-2');
  });
});
