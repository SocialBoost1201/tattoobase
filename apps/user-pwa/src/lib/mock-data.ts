export const MOCK_ARTISTS = [
  {
    id: 'mock-artist-1',
    displayName: 'HORI SHIN',
    bio: '和彫り・日本伝統刺青を専門とする彫師。15年のキャリアを持ち、龍・般若・花魁など伝統的な題材を現代的な感覚で昇華させる。',
    specialties: ['和彫り', '龍', '般若', '花魁'],
    yearsOfExperience: 15,
    studio: { id: 'mock-studio-1', name: 'IREZUMI TOKYO' },
    avgRating: 4.9,
    reviewCount: 42,
  },
  {
    id: 'mock-artist-2',
    displayName: 'Yuki Tanaka',
    bio: 'ブラックアンドグレーとリアリズムを中心に活動するアーティスト。ポートレートや自然をモチーフにした繊細な作風が人気。',
    specialties: ['ブラックアンドグレー', 'リアリズム', 'ポートレート'],
    yearsOfExperience: 8,
    studio: { id: 'mock-studio-2', name: 'INK COLLECTIVE OSAKA' },
    avgRating: 4.7,
    reviewCount: 28,
  },
  {
    id: 'mock-artist-3',
    displayName: 'SAKURA',
    bio: '韓国スタイルのミニマルタトゥーを得意とするアーティスト。繊細な線とフラワーモチーフで人気急上昇中。',
    specialties: ['韓国風', 'ミニマル', 'フラワー', 'ラインワーク'],
    yearsOfExperience: 5,
    studio: { id: 'mock-studio-3', name: 'SEOUL STYLE TOKYO' },
    avgRating: 4.8,
    reviewCount: 19,
  },
  {
    id: 'mock-artist-4',
    displayName: 'DRAGON RYU',
    bio: 'アメリカントラディショナルを現代的に解釈する彫師。大胆な配色と力強いラインが特徴。',
    specialties: ['トラディショナル', 'ネオトラッド', 'オールドスクール'],
    yearsOfExperience: 12,
    studio: { id: 'mock-studio-1', name: 'IREZUMI TOKYO' },
    avgRating: 4.6,
    reviewCount: 31,
  },
];

export const MOCK_PORTFOLIOS = [
  {
    id: 'mock-p-1',
    mediaUrls: ['https://placehold.co/400x400/111827/f3f4f6?text=和彫り'],
    artistId: 'mock-artist-1',
    styleCategory: '和彫り',
    title: '龍・桜吹雪',
  },
  {
    id: 'mock-p-2',
    mediaUrls: ['https://placehold.co/400x400/1f2937/e5e7eb?text=B%26G'],
    artistId: 'mock-artist-2',
    styleCategory: 'ブラックアンドグレー',
    title: 'ポートレート',
  },
  {
    id: 'mock-p-3',
    mediaUrls: ['https://placehold.co/400x400/111827/fce7f3?text=韓国風'],
    artistId: 'mock-artist-3',
    styleCategory: '韓国風',
    title: 'ミニフラワー',
  },
  {
    id: 'mock-p-4',
    mediaUrls: ['https://placehold.co/400x400/0f172a/fbbf24?text=TRAD'],
    artistId: 'mock-artist-4',
    styleCategory: 'トラディショナル',
    title: 'イーグル',
  },
  {
    id: 'mock-p-5',
    mediaUrls: ['https://placehold.co/400x400/111827/a78bfa?text=般若'],
    artistId: 'mock-artist-1',
    styleCategory: '和彫り',
    title: '般若・炎',
  },
  {
    id: 'mock-p-6',
    mediaUrls: ['https://placehold.co/400x400/1c1917/fafaf9?text=リアリズム'],
    artistId: 'mock-artist-2',
    styleCategory: 'リアリズム',
    title: '薔薇',
  },
];

export const MOCK_FACILITIES = [
  {
    id: 'mock-f-1',
    name: '湯の里 草津温泉 山翠楼',
    slug: 'kusatsu-sanseiro',
    type: 'ONSEN',
    acceptanceLevel: 'COVERED_ONLY',
    prefecture: '群馬県',
    city: '吾妻郡草津町',
    address: '草津温泉 湯畑周辺',
    tattooPolicy:
      'ラッシュガード・タトゥーシールで隠せばご利用いただけます。大浴場・露天風呂ともに対応可能です。',
    description:
      '草津温泉の湯畑そばに立地する老舗旅館。タトゥーのあるお客様も条件付きでご入浴いただけます。',
    mediaUrls: ['https://placehold.co/800x600/f5f0e8/78350f?text=草津温泉'],
    websiteUrl: null,
  },
  {
    id: 'mock-f-2',
    name: 'AQUA WELLNESS SPA 渋谷',
    slug: 'aqua-wellness-shibuya',
    type: 'GYM',
    acceptanceLevel: 'ALLOWED',
    prefecture: '東京都',
    city: '渋谷区',
    address: '渋谷区道玄坂',
    tattooPolicy:
      'タトゥーのあるお客様も全面的に歓迎いたします。プール・ジャグジー・サウナすべてご利用いただけます。',
    description:
      '渋谷道玄坂に位置するモダンなウェルネス施設。タトゥーに対して非常にオープンなポリシーを掲げています。',
    mediaUrls: ['https://placehold.co/800x600/0c4a6e/e0f2fe?text=AQUA+SPA'],
    websiteUrl: null,
  },
  {
    id: 'mock-f-3',
    name: 'THE URBAN HOTEL 新宿',
    slug: 'the-urban-hotel-shinjuku',
    type: 'HOTEL',
    acceptanceLevel: 'ALLOWED',
    prefecture: '東京都',
    city: '新宿区',
    address: '新宿区歌舞伎町',
    tattooPolicy:
      'タトゥーの有無に関わらず全てのゲストを歓迎いたします。大浴場・プールともにご利用いただけます。',
    description:
      '新宿歌舞伎町の中心にあるデザインホテル。多様性を重視し、タトゥーのあるゲストも気兼ねなくご滞在いただけます。',
    mediaUrls: ['https://placehold.co/800x600/1e1b4b/e0e7ff?text=THE+URBAN'],
    websiteUrl: null,
  },
];
