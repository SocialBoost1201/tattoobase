import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'maps.googleapis.com' },
      { protocol: 'https', hostname: '*.cartocdn.com' },
      { protocol: 'https', hostname: 'unpkg.com' },
    ],
  },
};

// NOTE: @ducanh2912/next-pwa は Node.js v22 で SyntaxError が発生するため除外
// PWA対応: manifest.json + appleWebApp meta は layout.tsx で設定済み
// Service Worker は Node.js v20 環境で next-pwa を再度有効化すること
export default nextConfig;
