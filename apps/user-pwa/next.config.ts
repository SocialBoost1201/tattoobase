import type { NextConfig } from "next";
import { spawnSync } from "node:child_process";
import withSerwistInit from "@serwist/next";

// ビルド時のリビジョン (オフラインキャッシュのバージョン管理)
const revision =
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout?.trim() ??
  crypto.randomUUID();

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [{ url: "/~offline", revision }],
  // 開発環境では SW を無効にして HMR と干渉させない
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  output: 'standalone',
  // Next.js 16 は Turbopack がデフォルト。本番ビルドは --webpack フラグで Serwist と互換。
  // 開発時 (next dev) の Turbopack 使用を妨げないよう turbopack オブジェクトは保持しない。
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

export default withSerwist(nextConfig);
