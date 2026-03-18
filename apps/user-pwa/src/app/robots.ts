import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tattoobase.jp';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/account/',
          '/booking/',
          '/login/',
          '/admin/',
        ],
      },
      {
        // AI クローラーはポートフォリオ画像のスクレイピングを禁止
        userAgent: ['GPTBot', 'CCBot', 'anthropic-ai', 'Google-Extended'],
        disallow: ['/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
