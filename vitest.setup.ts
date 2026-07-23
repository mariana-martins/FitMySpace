import '@testing-library/jest-dom/vitest';
import { vi, beforeAll, afterEach, afterAll, expect } from 'vitest';
import * as matchers from 'vitest-axe/matchers';
import 'vitest-axe/extend-expect';
import { TextEncoder, TextDecoder } from 'util';
import 'whatwg-fetch';

expect.extend(matchers);

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { TransformStream } = await import('stream/web');
global.TransformStream = TransformStream;

vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

try {
  const { server } = await import('./src/mocks/server');
  beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
} catch (e) {
  console.warn('MSW server not available in test environment');
}
