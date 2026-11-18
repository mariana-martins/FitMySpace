import { extname, join, resolve, sep } from 'node:path';
import { createReadStream } from 'node:fs';
import { createServer } from 'node:http';
import { stat } from 'node:fs/promises';

/*
 * Serves the static Storybook build for the visual-regression run. Playwright's `webServer` needs a
 * command that owns a port, and the only servers that would fit (Vite, `serve`, `http-server`) would
 * be a dependency used by nothing else in the repo. The build output is flat and never rewritten, so
 * this is a file lookup and a content type: no caching, no directory listing, no path outside `root`.
 *
 *   node e2e/support/serve-static.mjs <root> <port>
 */
const [rootArgument, portArgument] = process.argv.slice(2);

if (!rootArgument || !portArgument) {
  console.error('usage: node e2e/support/serve-static.mjs <root> <port>');
  process.exit(1);
}

const root = resolve(rootArgument);
const port = Number(portArgument);

const CONTENT_TYPES = new Map([
  ['.avif', 'image/avif'],
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json'],
  ['.map', 'application/json'],
  ['.md', 'text/markdown; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.ttf', 'font/ttf'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml'],
]);

function contentTypeOf(filePath) {
  return CONTENT_TYPES.get(extname(filePath).toLowerCase()) ?? 'application/octet-stream';
}

/** Resolves a request path inside `root`, or returns null for anything that climbs out of it. */
function resolveInsideRoot(requestPath) {
  const decoded = decodeURIComponent(new URL(requestPath, 'http://localhost').pathname);
  const candidate = resolve(join(root, decoded));
  return candidate === root || candidate.startsWith(root + sep) ? candidate : null;
}

const server = createServer(async (request, response) => {
  const requested = resolveInsideRoot(request.url ?? '/');

  if (!requested) {
    response.writeHead(400).end('Bad request');
    return;
  }

  const fileInfo = await stat(requested).catch(() => null);
  const filePath = fileInfo?.isDirectory() ? join(requested, 'index.html') : requested;
  const file = await stat(filePath).catch(() => null);

  if (!file?.isFile()) {
    response.writeHead(404, { 'content-type': 'text/plain' }).end('Not found');
    return;
  }

  response.writeHead(200, {
    'content-type': contentTypeOf(filePath),
    'content-length': String(file.size),
    // A screenshot must never come from a cached response.
    'cache-control': 'no-store',
  });
  createReadStream(filePath).pipe(response);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`serving ${root} on http://localhost:${port}`);
});
