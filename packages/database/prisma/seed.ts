import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ── ヘルパー ──────────────────────────────────────────────────
async function upsertStudio(id: string, data: any) {
  return prisma.studio.upsert({
    where: { slug: data.slug },
    update: {},
    create: { id, ...data },
  });
}

async function upsertArtist(id: string, data: any) {
  return prisma.artistProfile.upsert({
    where: { id },
    update: {
      rating: data.rating,
      savedCount: data.savedCount,
    },
    create: { id, ...data },
  });
}

async function main() {
  console.log("🌱 TattooBase データベース初期化開始...");

  // ─────────────────────────────────────────
  // STUDIOS （全国5スタジオ）
  // ─────────────────────────────────────────
  const studio_tokyo1 = await upsertStudio("studio-tokyo-1", {
    name: "INKCRAFT TOKYO",
    slug: "inkcraft-tokyo",
    accountType: "EXPRESS",
    prefecture: "東京都",
    city: "渋谷区",
    address: "渋谷2-15-1",
  });

  const studio_tokyo2 = await upsertStudio("studio-tokyo-2", {
    name: "BLACK MOON TATTOO TOKYO",
    slug: "black-moon-tokyo",
    accountType: "EXPRESS",
    prefecture: "東京都",
    city: "新宿区",
    address: "歌舞伎町1-22-3",
  });

  const studio_osaka = await upsertStudio("studio-osaka-1", {
    name: "OSAKA INK COLLECTIVE",
    slug: "osaka-ink-collective",
    accountType: "EXPRESS",
    prefecture: "大阪府",
    city: "北区",
    address: "梅田1-5-10",
  });

  const studio_kyoto = await upsertStudio("studio-kyoto-1", {
    name: "KYOTO TATTOO STUDIO 彫刻",
    slug: "kyoto-choukoku",
    accountType: "EXPRESS",
    prefecture: "京都府",
    city: "中京区",
    address: "御池通西洞院",
  });

  const studio_fukuoka = await upsertStudio("studio-fukuoka-1", {
    name: "HAKATA TATTOO WORKS",
    slug: "hakata-tattoo-works",
    accountType: "EXPRESS",
    prefecture: "福岡県",
    city: "博多区",
    address: "博多駅前3-4-5",
  });

  console.log("✅ Studios: 5件作成");

  // ─────────────────────────────────────────
  // STAFF
  // ─────────────────────────────────────────
  const staffList = [
    { id: "staff-001", studioId: studio_tokyo1.id, displayName: "Sato Kenta" },
    { id: "staff-002", studioId: studio_tokyo1.id, displayName: "Tanaka Misaki" },
    { id: "staff-003", studioId: studio_tokyo2.id, displayName: "Yamamoto Ryo" },
    { id: "staff-004", studioId: studio_tokyo2.id, displayName: "Suzuki Hana" },
    { id: "staff-005", studioId: studio_osaka.id, displayName: "Kimura Taro" },
    { id: "staff-006", studioId: studio_osaka.id, displayName: "Nakamura Yuki" },
    { id: "staff-007", studioId: studio_kyoto.id, displayName: "Inoue Kenji" },
    { id: "staff-008", studioId: studio_kyoto.id, displayName: "Watanabe Akiko" },
    { id: "staff-009", studioId: studio_fukuoka.id, displayName: "Ito Shota" },
    { id: "staff-010", studioId: studio_fukuoka.id, displayName: "Kobayashi Nana" },
  ];

  for (const s of staffList) {
    await prisma.staff.upsert({
      where: { id: s.id },
      update: {},
      create: s,
    });
  }
  console.log("✅ Staff: 10件作成");

  // ─────────────────────────────────────────
  // ARTIST PROFILES（20名）
  // ─────────────────────────────────────────
  const PICSUMS = [
    "https://picsum.photos/seed/tattoo1/400/400",
    "https://picsum.photos/seed/tattoo2/400/400",
    "https://picsum.photos/seed/tattoo3/400/400",
    "https://picsum.photos/seed/tattoo4/400/400",
    "https://picsum.photos/seed/tattoo5/400/400",
    "https://picsum.photos/seed/tattoo6/400/400",
    "https://picsum.photos/seed/tattoo7/400/400",
    "https://picsum.photos/seed/tattoo8/400/400",
    "https://picsum.photos/seed/tattoo9/400/400",
    "https://picsum.photos/seed/tattoo10/400/400",
    "https://picsum.photos/seed/tattoo11/400/400",
    "https://picsum.photos/seed/tattoo12/400/400",
    "https://picsum.photos/seed/tattoo13/400/400",
    "https://picsum.photos/seed/tattoo14/400/400",
    "https://picsum.photos/seed/tattoo15/400/400",
    "https://picsum.photos/seed/tattoo16/400/400",
    "https://picsum.photos/seed/tattoo17/400/400",
    "https://picsum.photos/seed/tattoo18/400/400",
    "https://picsum.photos/seed/tattoo19/400/400",
    "https://picsum.photos/seed/tattoo20/400/400",
  ];

  const artistsData = [
    // 東京 INKCRAFT
    {
      id: "artist-001",
      studioId: studio_tokyo1.id, staffId: "staff-001",
      displayName: "KENTA / 和彫・ブラックアンドグレー",
      bio: "東京・渋谷を拠点に活動。和彫りとブラックアンドグレーを専門とし、繊細なグラデーションと迫力ある構図が得意。キャリア12年。",
      prefecture: "東京都", city: "渋谷区",
      specialties: ["和彫", "ブラックアンドグレー", "カバーアップ"],
      gender: "male", yearsOfExperience: 12,
      rating: 4.8, reviewCount: 43, priceMin: 20000, priceMax: 100000,
      savedCount: 312, isVerified: true,
      profileImageUrl: PICSUMS[0], instagramHandle: "@kenta_ink",
    },
    {
      id: "artist-002",
      studioId: studio_tokyo1.id, staffId: "staff-002",
      displayName: "MISAKI / トラディショナル・ネオトラッド",
      bio: "渋谷のタトゥーアーティスト。アメリカントラディショナルをベースに、色鮮やかなネオトラッドが評判。女性のお客様も多い。",
      prefecture: "東京都", city: "渋谷区",
      specialties: ["トラディショナル", "ネオトラッド", "ワンポイント"],
      gender: "female", yearsOfExperience: 7,
      rating: 4.9, reviewCount: 78, priceMin: 15000, priceMax: 80000,
      savedCount: 526, isVerified: true,
      profileImageUrl: PICSUMS[1], instagramHandle: "@misaki_tattoo",
    },
    // 東京 BLACK MOON
    {
      id: "artist-003",
      studioId: studio_tokyo2.id, staffId: "staff-003",
      displayName: "RYO / ブラックワーク・ジオメトリック",
      bio: "新宿歌舞伎町発。ブラックワークとジオメトリックデザインを専門。精密な幾何学模様と大胆なソリッドブラックの融合が得意。",
      prefecture: "東京都", city: "新宿区",
      specialties: ["ブラックワーク", "ジオメトリック", "トライバル"],
      gender: "male", yearsOfExperience: 9,
      rating: 4.7, reviewCount: 55, priceMin: 25000, priceMax: 150000,
      savedCount: 418, isVerified: true,
      profileImageUrl: PICSUMS[2], instagramHandle: "@ryo_blackwork",
    },
    {
      id: "artist-004",
      studioId: studio_tokyo2.id, staffId: "staff-004",
      displayName: "HANA / ファインライン・ミニマル",
      bio: "繊細なラインとミニマルなデザインで人気の女性アーティスト。レタリングと植物モチーフが得意。",
      prefecture: "東京都", city: "新宿区",
      specialties: ["ファインライン", "ミニマル", "レタリング"],
      gender: "female", yearsOfExperience: 5,
      rating: 4.9, reviewCount: 102, priceMin: 10000, priceMax: 60000,
      savedCount: 743, isVerified: true,
      profileImageUrl: PICSUMS[3], instagramHandle: "@hana_fineline",
    },
    // 大阪
    {
      id: "artist-005",
      studioId: studio_osaka.id, staffId: "staff-005",
      displayName: "TARO / リアリズム・ポートレート",
      bio: "大阪・梅田でリアリズムを中心に活動。ポートレートと動物のリアリスティックな描写に特化。グレースケールの圧倒的なディテール感が強み。",
      prefecture: "大阪府", city: "北区",
      specialties: ["リアリズム", "ポートレート", "ブラックアンドグレー"],
      gender: "male", yearsOfExperience: 14,
      rating: 4.9, reviewCount: 89, priceMin: 30000, priceMax: 200000,
      savedCount: 601, isVerified: true,
      profileImageUrl: PICSUMS[4], instagramHandle: "@taro_realism",
    },
    {
      id: "artist-006",
      studioId: studio_osaka.id, staffId: "staff-006",
      displayName: "YUKI / 和彫・龍・鯉",
      bio: "大阪の和彫師。龍、鯉、般若を得意とし、背中一面や腕の額彫りなど大型作品の実績が豊富。",
      prefecture: "大阪府", city: "北区",
      specialties: ["和彫", "龍", "鯉", "般若"],
      gender: "female", yearsOfExperience: 10,
      rating: 4.8, reviewCount: 36, priceMin: 20000, priceMax: 300000,
      savedCount: 289, isVerified: true,
      profileImageUrl: PICSUMS[5], instagramHandle: "@yuki_wabori",
    },
    // 京都
    {
      id: "artist-007",
      studioId: studio_kyoto.id, staffId: "staff-007",
      displayName: "KENJI / ニュースクール・グラフィティ",
      bio: "京都を拠点に活動するニュースクールアーティスト。カラフルで大胆なポップアートスタイルと、グラフィティをミックスした独自のスタイルが特長。",
      prefecture: "京都府", city: "中京区",
      specialties: ["ニュースクール", "カラー", "グラフィティ"],
      gender: "male", yearsOfExperience: 8,
      rating: 4.7, reviewCount: 47, priceMin: 18000, priceMax: 120000,
      savedCount: 376, isVerified: true,
      profileImageUrl: PICSUMS[6], instagramHandle: "@kenji_newschool",
    },
    {
      id: "artist-008",
      studioId: studio_kyoto.id, staffId: "staff-008",
      displayName: "AKIKO / オルネメンタル・マンダラ",
      bio: "京都発。オルネメンタルとマンダラを専門とした女性アーティスト。繊細な装飾模様と左右対称のシンメトリーデザインが得意。",
      prefecture: "京都府", city: "中京区",
      specialties: ["オルネメンタル", "マンダラ", "ジオメトリック"],
      gender: "female", yearsOfExperience: 6,
      rating: 4.8, reviewCount: 61, priceMin: 15000, priceMax: 90000,
      savedCount: 432, isVerified: true,
      profileImageUrl: PICSUMS[7], instagramHandle: "@akiko_ornamental",
    },
    // 福岡
    {
      id: "artist-009",
      studioId: studio_fukuoka.id, staffId: "staff-009",
      displayName: "SHOTA / スニーカーヘッズ・アニメ",
      bio: "博多発。アニメ・漫画からインスピレーションを受けたイラストスタイルと、スニーカーやポップカルチャーをテーマにした作品で若い世代に圧倒的支持。",
      prefecture: "福岡県", city: "博多区",
      specialties: ["アニメ", "イラスト", "ポップアート"],
      gender: "male", yearsOfExperience: 4,
      rating: 4.9, reviewCount: 134, priceMin: 12000, priceMax: 70000,
      savedCount: 891, isVerified: true,
      profileImageUrl: PICSUMS[8], instagramHandle: "@shota_anime_ink",
    },
    {
      id: "artist-010",
      studioId: studio_fukuoka.id, staffId: "staff-010",
      displayName: "NANA / ウォーターカラー・フラワー",
      bio: "福岡のウォーターカラーアーティスト。水彩画のような透明感ある色使いと、花や蝶などのナチュラルモチーフが得意。繊細かつ柔らかなテイストが好評。",
      prefecture: "福岡県", city: "博多区",
      specialties: ["ウォーターカラー", "フラワー", "カラー"],
      gender: "female", yearsOfExperience: 5,
      rating: 4.8, reviewCount: 98, priceMin: 13000, priceMax: 75000,
      savedCount: 567, isVerified: true,
      profileImageUrl: PICSUMS[9], instagramHandle: "@nana_watercolor",
    },
    // 東京 追加（スタジオ共通）
    {
      id: "artist-011",
      studioId: studio_tokyo1.id, staffId: null,
      displayName: "DAIKI / スリーブ・ブラックアンドグレー",
      bio: "スリーブ（袖全体）を専門とし、細密なブラックアンドグレーで圧倒的な世界観を構築。渡航歴あり。",
      prefecture: "東京都", city: "渋谷区",
      specialties: ["ブラックアンドグレー", "スリーブ", "ダークアート"],
      gender: "male", yearsOfExperience: 15,
      rating: 4.8, reviewCount: 28, priceMin: 50000, priceMax: 500000,
      savedCount: 203, isVerified: true,
      profileImageUrl: PICSUMS[10], instagramHandle: "@daiki_sleeve",
    },
    {
      id: "artist-012",
      studioId: studio_tokyo2.id, staffId: null,
      displayName: "SORA / スクリプト・カリグラフィー",
      bio: "文字入れの専門家。漢字、英文、アラビア語のカリグラフィーまで幅広く対応。正確な文字組みと芸術的なレタリングが評判。",
      prefecture: "東京都", city: "新宿区",
      specialties: ["レタリング", "カリグラフィー", "スクリプト", "ワンポイント"],
      gender: "other", yearsOfExperience: 7,
      rating: 4.7, reviewCount: 67, priceMin: 8000, priceMax: 50000,
      savedCount: 389, isVerified: false,
      profileImageUrl: PICSUMS[11], instagramHandle: "@sora_script",
    },
    {
      id: "artist-013",
      studioId: studio_osaka.id, staffId: null,
      displayName: "REN / ホラー・ダークアート",
      bio: "大阪発。ホラーとダークアートを専門とするアーティスト。血・骨・頭蓋骨などのゴシックモチーフから、スティッチやフランケンシュタインまで。",
      prefecture: "大阪府", city: "北区",
      specialties: ["ホラー", "ダークアート", "ブラックワーク"],
      gender: "male", yearsOfExperience: 11,
      rating: 4.6, reviewCount: 42, priceMin: 20000, priceMax: 150000,
      savedCount: 312, isVerified: true,
      profileImageUrl: PICSUMS[12], instagramHandle: "@ren_horror",
    },
    {
      id: "artist-014",
      studioId: studio_kyoto.id, staffId: null,
      displayName: "AOI / ハンドポーク・デリケート",
      bio: "機械を使わない「ハンドポーク」技法を専門とする京都のアーティスト。シンプルで優しいタッチが好まれており、特に女性客に支持が高い。",
      prefecture: "京都府", city: "中京区",
      specialties: ["ハンドポーク", "ミニマル", "ファインライン"],
      gender: "female", yearsOfExperience: 4,
      rating: 4.9, reviewCount: 56, priceMin: 8000, priceMax: 40000,
      savedCount: 487, isVerified: false,
      profileImageUrl: PICSUMS[13], instagramHandle: "@aoi_handpoke",
    },
    {
      id: "artist-015",
      studioId: studio_fukuoka.id, staffId: null,
      displayName: "KAI / バイオメカニカル・スリーブ",
      bio: "機械と生物が融合するバイオメカニカルタトゥーを専門とする福岡のアーティスト。立体感と複雑な構造をブラックアンドグレーで表現する。",
      prefecture: "福岡県", city: "博多区",
      specialties: ["バイオメカニカル", "ブラックアンドグレー", "スリーブ"],
      gender: "male", yearsOfExperience: 9,
      rating: 4.7, reviewCount: 39, priceMin: 30000, priceMax: 200000,
      savedCount: 284, isVerified: true,
      profileImageUrl: PICSUMS[14], instagramHandle: "@kai_biomech",
    },
    {
      id: "artist-016",
      studioId: studio_tokyo1.id, staffId: null,
      displayName: "MEI / 蝶・昆虫・植物",
      bio: "蝶や昆虫、植物のミクロな世界を精密に描く東京のアーティスト。ナチュラルヒストリーをテーマにした繊細な作品が人気。",
      prefecture: "東京都", city: "渋谷区",
      specialties: ["ミニマル", "ファインライン", "ネイチャー"],
      gender: "female", yearsOfExperience: 6,
      rating: 4.8, reviewCount: 73, priceMin: 10000, priceMax: 60000,
      savedCount: 621, isVerified: true,
      profileImageUrl: PICSUMS[15], instagramHandle: "@mei_nature_ink",
    },
    {
      id: "artist-017",
      studioId: studio_osaka.id, staffId: null,
      displayName: "HARUTO / チカーノ・ロカビリー",
      bio: "チカーノスタイルとロカビリーをミックスした大阪のアーティスト。太いブラックラインとポルカドットや薔薇などのモチーフを組み合わせる。",
      prefecture: "大阪府", city: "北区",
      specialties: ["チカーノ", "ブラックワーク", "トラディショナル"],
      gender: "male", yearsOfExperience: 8,
      rating: 4.5, reviewCount: 33, priceMin: 15000, priceMax: 100000,
      savedCount: 198, isVerified: false,
      profileImageUrl: PICSUMS[16], instagramHandle: "@haruto_chicano",
    },
    {
      id: "artist-018",
      studioId: studio_tokyo2.id, staffId: null,
      displayName: "YUI / テキスタイル・パターン",
      bio: "刺繍やテキスタイルの模様をタトゥーで表現する新宿のアーティスト。パッチワークスタイルや花の刺繍タトゥーが人気を呼んでいる。",
      prefecture: "東京都", city: "新宿区",
      specialties: ["刺繍スタイル", "カラー", "フラワー"],
      gender: "female", yearsOfExperience: 3,
      rating: 4.9, reviewCount: 88, priceMin: 12000, priceMax: 65000,
      savedCount: 748, isVerified: true,
      profileImageUrl: PICSUMS[17], instagramHandle: "@yui_embroidery",
    },
    {
      id: "artist-019",
      studioId: studio_kyoto.id, staffId: null,
      displayName: "SOJIRO / 伝統木版画・浮世絵",
      bio: "浮世絵と日本の伝統木版画をモチーフにした京都の和彫師。葛飾北斎の波や歌川広重の風景など、アート作品をタトゥーで再現することを得意とする。",
      prefecture: "京都府", city: "中京区",
      specialties: ["和彫", "浮世絵", "カラー"],
      gender: "male", yearsOfExperience: 18,
      rating: 4.9, reviewCount: 22, priceMin: 40000, priceMax: 500000,
      savedCount: 445, isVerified: true,
      profileImageUrl: PICSUMS[18], instagramHandle: "@sojiro_ukiyo",
    },
    {
      id: "artist-020",
      studioId: studio_fukuoka.id, staffId: null,
      displayName: "RINA / スティッチ・ドール",
      bio: "人形が縫い合わされたような「スティッチスタイル」で話題の福岡のアーティスト。独自の世界観でSNSでも注目を集めている。",
      prefecture: "福岡県", city: "博多区",
      specialties: ["スティッチ", "ドール", "ホラー", "カラー"],
      gender: "female", yearsOfExperience: 3,
      rating: 4.8, reviewCount: 112, priceMin: 10000, priceMax: 80000,
      savedCount: 934, isVerified: false,
      profileImageUrl: PICSUMS[19], instagramHandle: "@rina_stitch",
    },
  ];

  for (const a of artistsData) {
    await upsertArtist(a.id, a);
  }
  console.log("✅ Artists: 20件作成");

  // ─────────────────────────────────────────
  // PORTFOLIO WORKS（各アーティスト3〜5作品）
  // ─────────────────────────────────────────
  // picsum.photos をシード値つきで使用し各種スタイルのプレースホルダーを生成

  const portfolioData: {
    id: string;
    artistId: string;
    studioId: string;
    title?: string;
    description?: string;
    mediaUrls: string[];
    tags: string[];
    styleCategory?: string;
  }[] = [];

  const buildPortfolios = (
    artistId: string,
    studioId: string,
    styles: string[],
    texts: { title: string; style: string }[]
  ) => {
    texts.forEach((t, i) => {
      portfolioData.push({
        id: `${artistId}-p${i + 1}`,
        artistId,
        studioId,
        title: t.title,
        mediaUrls: [
          `https://picsum.photos/seed/${artistId}-${i}/600/800`,
          `https://picsum.photos/seed/${artistId}-${i}-2/600/800`,
        ],
        tags: styles,
        styleCategory: t.style,
      });
    });
  };

  buildPortfolios("artist-001", studio_tokyo1.id, ["和彫", "ブラックアンドグレー"], [
    { title: "龍の和彫り – 左腕スリーブ", style: "和彫" },
    { title: "牡丹と波 – 胸から背中へ", style: "和彫" },
    { title: "鷹 – ブラックアンドグレー", style: "ブラックアンドグレー" },
  ]);

  buildPortfolios("artist-002", studio_tokyo1.id, ["トラディショナル", "ネオトラッド"], [
    { title: "ローズ & ドラゴン – ネオトラッド", style: "ネオトラッド" },
    { title: "ラスウォルフ – アメリカントラッド", style: "トラディショナル" },
    { title: "スワロウ – ネオトラッド", style: "ネオトラッド" },
    { title: "ホースシュー – ワンポイント", style: "トラディショナル" },
  ]);

  buildPortfolios("artist-003", studio_tokyo2.id, ["ブラックワーク", "ジオメトリック"], [
    { title: "マンダラ – 背中フルピース", style: "ジオメトリック" },
    { title: "ヘクサゴン – ブラックワーク", style: "ブラックワーク" },
    { title: "トライバルスリーブ", style: "トライバル" },
  ]);

  buildPortfolios("artist-004", studio_tokyo2.id, ["ファインライン", "ミニマル"], [
    { title: "植物 & ライン – 内側手首", style: "ファインライン" },
    { title: "星座 – 肩", style: "ミニマル" },
    { title: "単一ライン猫 – 足首", style: "ミニマル" },
    { title: "レタリング – 鎖骨", style: "レタリング" },
  ]);

  buildPortfolios("artist-005", studio_osaka.id, ["リアリズム", "ポートレート"], [
    { title: "オオカミ – リアリズム", style: "リアリズム" },
    { title: "人物ポートレート – 腕", style: "ポートレート" },
    { title: "虎 – リアリスティック", style: "リアリズム" },
    { title: "薔薇 – ブラックアンドグレーリアル", style: "リアリズム" },
  ]);

  buildPortfolios("artist-006", studio_osaka.id, ["和彫", "龍"], [
    { title: "昇り龍 – 右腕スリーブ", style: "和彫" },
    { title: "緋鯉 – 背中", style: "和彫" },
    { title: "般若と桜 – 腕", style: "和彫" },
  ]);

  buildPortfolios("artist-007", studio_kyoto.id, ["ニュースクール", "カラー"], [
    { title: "ポップアート – ニュースクールキャラ", style: "ニュースクール" },
    { title: "カラフルハロウィン – ニュースクール", style: "ニュースクール" },
    { title: "スケートカルチャー – グラフィティスタイル", style: "グラフィティ" },
  ]);

  buildPortfolios("artist-008", studio_kyoto.id, ["オルネメンタル", "マンダラ"], [
    { title: "マンダラ – 胸元シンメトリー", style: "マンダラ" },
    { title: "オルネメンタル – 肩・肩甲骨", style: "オルネメンタル" },
    { title: "ジオメトリックマンダラ – 手の甲", style: "ジオメトリック" },
  ]);

  buildPortfolios("artist-009", studio_fukuoka.id, ["アニメ", "イラスト"], [
    { title: "鬼滅キャラ – 腕ワンポイント", style: "アニメ" },
    { title: "ONE PIECE – スリーブ", style: "アニメ" },
    { title: "ポケモン – 足首", style: "アニメ" },
    { title: "ゲームコントローラー – 手首", style: "ポップアート" },
  ]);

  buildPortfolios("artist-010", studio_fukuoka.id, ["ウォーターカラー", "フラワー"], [
    { title: "水彩薔薇 – 肩", style: "ウォーターカラー" },
    { title: "蝶 & 花 – ウォーターカラー", style: "ウォーターカラー" },
    { title: "チューリップ – 繊細な彩色", style: "ウォーターカラー" },
  ]);

  buildPortfolios("artist-016", studio_tokyo1.id, ["ファインライン", "ネイチャー"], [
    { title: "モルフォ蝶 – 精密描写", style: "ファインライン" },
    { title: "ハーバリウム – 植物標本スタイル", style: "ファインライン" },
    { title: "甲虫標本 – 内側の腕", style: "ファインライン" },
  ]);

  buildPortfolios("artist-017", studio_osaka.id, ["チカーノ", "ブラックワーク"], [
    { title: "チカーノ薔薇 – 手首", style: "チカーノ" },
    { title: "聖母マリア – ブラックインク", style: "チカーノ" },
  ]);

  buildPortfolios("artist-018", studio_tokyo2.id, ["刺繍スタイル", "カラー"], [
    { title: "刺繍スタイル桜 – 肩", style: "刺繍スタイル" },
    { title: "パッチワーク – 腕コレクション", style: "刺繍スタイル" },
    { title: "刺繍蝶 – 肩甲骨", style: "刺繍スタイル" },
  ]);

  buildPortfolios("artist-019", studio_kyoto.id, ["和彫", "浮世絵"], [
    { title: "神奈川沖浪裏（北斎） – 背中", style: "和彫" },
    { title: "東海道五十三次（広重） –腕", style: "和彫" },
    { title: "夕立（北斎） – 胸", style: "和彫" },
  ]);

  buildPortfolios("artist-020", studio_fukuoka.id, ["スティッチ", "ホラー"], [
    { title: "スティッチドール – 腿", style: "スティッチ" },
    { title: "ぬいぐるみホラー – 腕内側", style: "スティッチ" },
    { title: "縫い目カボチャ – 足首", style: "ホラー" },
  ]);

  await prisma.portfolioWork.createMany({
    skipDuplicates: true,
    data: portfolioData,
  });
  console.log(`✅ PortfolioWorks: ${portfolioData.length}件作成`);

  // ─────────────────────────────────────────
  // TEST USER
  // ─────────────────────────────────────────
  const user = await prisma.user.upsert({
    where: { email: "testuser@tattoobase.dev" },
    update: {},
    create: {
      email: "testuser@tattoobase.dev",
      name: "テストユーザー",
    },
  });
  console.log(`✅ Test User: ${user.email}`);

  // ─────────────────────────────────────────
  // SUBSCRIPTIONS
  // ─────────────────────────────────────────
  for (const studioId of [
    studio_tokyo1.id,
    studio_tokyo2.id,
    studio_osaka.id,
    studio_kyoto.id,
    studio_fukuoka.id,
  ]) {
    await prisma.subscription.upsert({
      where: { studioId },
      update: {},
      create: { studioId, status: "active" },
    });
  }
  console.log("✅ Subscriptions: 5件作成");

  console.log("\n🎉 TattooBase シード完了！");
  console.log(`  - スタジオ: 5件`);
  console.log(`  - アーティスト: ${artistsData.length}件`);
  console.log(`  - ポートフォリオ: ${portfolioData.length}件`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
