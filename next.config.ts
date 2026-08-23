import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // Hide the floating "N" dev tools badge (dev-mode only, never shown in production)
  devIndicators: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // 24 hours browser cache for images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Compress responses
  compress: true,
  // Enable experimental features for faster builds & runtime
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // pdfkit must run in Node.js runtime (not bundled by webpack)
  serverExternalPackages: ['pdfkit'],
  // Aggressive HTTP caching for static assets
  async headers() {
    return [
      {
        source: '/api/payment-methods',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=300, stale-while-revalidate=60' },
        ],
      },
      {
        source: '/api/campaigns/:slug',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=60, stale-while-revalidate=30' },
        ],
      },
    ];
  },
};

export default nextConfig;
