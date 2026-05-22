import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tattoobase.jp';

const PREF_SLUGS = [
  'tokyo', 'osaka', 'aichi', 'fukuoka',
  'hokkaido', 'kanagawa', 'kyoto', 'hyogo',
  'saitama', 'chiba',
];

const STYLES = [
  '和彫', 'ブラックアンドグレー', 'トラディショナル',
  'ニュースクール', 'ミニマル', 'レタリング', 'アニメ', 'ワンポイント',
];

const GUIDE_SLUGS = ['beginner', 'pricing', 'aftercare', 'how-to-choose'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/facilities`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/guide`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  // エリア別ページ
  const areaPages: MetadataRoute.Sitemap = PREF_SLUGS.map(slug => ({
    url: `${BASE_URL}/area/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // スタイル別検索（検索ページ）
  const stylePages: MetadataRoute.Sitemap = STYLES.map(style => ({
    url: `${BASE_URL}/search?type=artist&genre=${encodeURIComponent(style)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // ガイドページ
  const guidePages: MetadataRoute.Sitemap = GUIDE_SLUGS.map(slug => ({
    url: `${BASE_URL}/guide/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // アーティストページ（DBから取得、失敗時はスキップ）
  let artistPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'}/user-api/artists`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000), // ビルド時に API 未起動でも 5 秒でフォールバック
    });
    if (res.ok) {
      const artists: { id: string; updatedAt?: string }[] = await res.json();
      artistPages = artists.map(a => ({
        url: `${BASE_URL}/artist/${a.id}`,
        lastModified: a.updatedAt ? new Date(a.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }
  } catch {
    // ビルド時にAPIが起動していない場合は空配列で続行
  }

  return [...staticPages, ...areaPages, ...stylePages, ...guidePages, ...artistPages];
}
