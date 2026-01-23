import { PageLayout } from '@/components/templates/PageLayout';
import { render, screen } from '@/__tests__/utils';

// Mock child components to isolate PageLayout testing
jest.mock('@/components/organisms/Navbar', () => ({
  Navbar: () => <nav data-testid="navbar">Navbar</nav>,
}));

jest.mock('@/components/organisms/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

jest.mock('@/components/atoms/SkipLink', () => ({
  SkipLink: () => (
    <a href="#main-content" data-testid="skip-link">
      Skip to content
    </a>
  ),
}));

describe('PageLayout', () => {
  it('renders children correctly', () => {
    render(
      <PageLayout>
        <div data-testid="content">Page Content</div>
      </PageLayout>,
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByText('Page Content')).toBeInTheDocument();
  });

  it('renders SkipLink for accessibility', () => {
    render(
      <PageLayout>
        <div>Content</div>
      </PageLayout>,
    );
    expect(screen.getByTestId('skip-link')).toBeInTheDocument();
  });

  it('renders Navbar', () => {
    render(
      <PageLayout>
        <div>Content</div>
      </PageLayout>,
    );
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
  });

  it('renders Footer', () => {
    render(
      <PageLayout>
        <div>Content</div>
      </PageLayout>,
    );
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('wraps children in main element with correct id', () => {
    render(
      <PageLayout>
        <div>Content</div>
      </PageLayout>,
    );
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('id', 'main-content');
  });

  it('main element has tabIndex for focus management', () => {
    render(
      <PageLayout>
        <div>Content</div>
      </PageLayout>,
    );
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('tabIndex', '-1');
  });

  it('merges custom className on main element', () => {
    render(
      <PageLayout className="custom-class">
        <div>Content</div>
      </PageLayout>,
    );
    const main = screen.getByRole('main');
    expect(main).toHaveClass('custom-class');
  });

  it('passes additional props to main element', () => {
    render(
      <PageLayout data-testid="main-content">
        <div>Content</div>
      </PageLayout>,
    );
    expect(screen.getByTestId('main-content')).toBeInTheDocument();
  });

  it('has correct layout structure (SkipLink, Navbar, main, Footer)', () => {
    const { container } = render(
      <PageLayout>
        <div>Content</div>
      </PageLayout>,
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('flex-col');
    expect(wrapper).toHaveClass('min-h-screen');
  });
});
