import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year for static images
    qualities: [75, 80],
  },
  // Compression and performance
  compress: true,
  productionBrowserSourceMaps: false,
  // Turbopack configuration (Next.js 16 default)
  turbopack: {},
  headers: async () => [
    {
      // Cache static assets (images, fonts) for 1 year
      source: "/:path*\\.(webp|jpg|jpeg|png|gif|svg|woff2|woff|ico|mp4)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      // HTML pages — always revalidate
      source: "/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        // Security headers
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
      ],
    },
  ],
};

export default nextConfig;
