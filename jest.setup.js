import '@testing-library/jest-dom';

// Polyfill for fetch API in Node.js environment
import { TextEncoder, TextDecoder } from 'util';
import 'whatwg-fetch';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { TransformStream } = require('stream/web');
global.TransformStream = TransformStream;

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Setup MSW (only if server is available)
try {
  const { server } = require('./src/mocks/server');
  beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
} catch (e) {
  // MSW server not available, skip setup
  console.warn('MSW server not available in test environment');
}
