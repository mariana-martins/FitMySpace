/**
 * Accessibility (a11y) tests using jest-axe
 *
 * These tests verify that components meet WCAG accessibility standards.
 * Components are tested in isolation with representative props.
 */

import { axe, toHaveNoViolations } from 'jest-axe';
import { render } from '@/__tests__/utils';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Import components
import { SkipLink } from '@/components/atoms/SkipLink';
import { Skeleton } from '@/components/atoms/Skeleton';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Badge } from '@/components/atoms/Badge';

describe('Atoms Accessibility', () => {
  describe('Badge', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Badge variant="rounded">New Product</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with square variant', async () => {
      const { container } = render(<Badge variant="square">Sale</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Button', () => {
    it('should have no accessibility violations with default variant', async () => {
      const { container } = render(<Button>Click me</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations when disabled', async () => {
      const { container } = render(<Button disabled>Disabled Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with all variants', async () => {
      const { container } = render(
        <div>
          <Button variant="default">Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Input', () => {
    it('should have no accessibility violations with aria-label', async () => {
      const { container } = render(<Input aria-label="Enter your name" placeholder="Name" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations with associated label', async () => {
      const { container } = render(
        <div>
          <label htmlFor="email-input">Email</label>
          <Input id="email-input" type="email" />
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have no violations in invalid state', async () => {
      const { container } = render(
        <div>
          <label htmlFor="invalid-input">Required Field</label>
          <Input id="invalid-input" aria-invalid="true" aria-describedby="error-msg" />
          <span id="error-msg">This field is required</span>
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Skeleton', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<Skeleton className="h-10 w-full" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('SkipLink', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(
        <div>
          <SkipLink />
          <main id="main-content">Main content</main>
        </div>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
