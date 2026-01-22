/**
 * Generate a temporary placeholder image URL for products
 * Uses a simple SVG data URI instead of external service
 * Works in both server and client environments
 */
export function getPlaceholderImage(productId: string, productName: string): string {
  // Escape HTML entities in product name
  const escapedName = productName
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  // Truncate name if too long
  const displayName = escapedName.substring(0, 25);

  // Create a simple SVG placeholder with product info
  const svg = `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="#f3f4f6"/>
  <text x="50%" y="45%" font-family="system-ui, sans-serif" font-size="20" font-weight="600" text-anchor="middle" fill="#6b7280">${displayName}</text>
  <text x="50%" y="60%" font-family="system-ui, sans-serif" font-size="14" text-anchor="middle" fill="#9ca3af">#${productId}</text>
</svg>`;

  // Use encodeURIComponent for better compatibility (works in both Node.js and browser)
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
