import { render, screen } from '@/__tests__/utils';
import NotFound from '@/app/not-found';

// Mock PageLayout to isolate NotFound testing
jest.mock('@/components/templates/PageLayout', () => ({
  PageLayout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('NotFound Page', () => {
  it('renders 404 heading', () => {
    render(<NotFound />);
    expect(
      screen.getByRole('heading', { name: /oops! we couldn't find that page/i }),
    ).toBeInTheDocument();
  });

  it('displays helpful message', () => {
    render(<NotFound />);
    expect(
      screen.getByText(/the page you are looking for might have been removed/i),
    ).toBeInTheDocument();
  });

  it('renders go back home link', () => {
    render(<NotFound />);
    expect(screen.getByRole('link', { name: /go back home/i })).toBeInTheDocument();
  });

  it('home link points to root', () => {
    render(<NotFound />);
    expect(screen.getByRole('link', { name: /go back home/i })).toHaveAttribute('href', '/');
  });

  it('renders button inside link', () => {
    render(<NotFound />);
    const link = screen.getByRole('link', { name: /go back home/i });
    const button = link.querySelector('button');
    expect(button).toBeInTheDocument();
  });

  it('has centered layout', () => {
    const { container } = render(<NotFound />);
    const innerDiv = container.querySelector('.flex');
    expect(innerDiv).toHaveClass('items-center');
    expect(innerDiv).toHaveClass('justify-center');
  });
});
