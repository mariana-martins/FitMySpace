// Base URL for API calls. Defaults to localhost if not set in env.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Public URL of the site, used to resolve relative URLs in metadata (Open Graph, canonical links).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
