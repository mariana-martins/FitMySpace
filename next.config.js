/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure PostCSS is used for CSS processing
  experimental: {
    optimizePackageImports: ['@tailwindcss/postcss'],
  },
};

module.exports = nextConfig;
