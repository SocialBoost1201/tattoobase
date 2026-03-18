import FacilityCard, { Facility } from '@/components/cards/FacilityCard';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const CATEGORIES = [
  { value: 'ONSEN', label: '温泉', icon: '♨️' },
  { value: 'SENTO', label: '銭湯', icon: '🛁' },
  { value: 'GYM', label: 'ジム・プール', icon: '🏊' },
  { value: 'HOTEL', label: 'ホテル・旅館', icon: '🏨' },
  { value: 'BEACH', label: '海水浴場', icon: '🏖️' },
  { value: 'OTHER', label: 'その他', icon: '📍' },
];

async function getFacilities(type?: string, includeBanned?: string) {
  try {
    const query = new URLSearchParams();
    if (type) query.append('type', type);
    if (includeBanned === 'true') query.append('includeBanned', 'true');
    const res = await fetch(`${API}/user-api/facilities?${query.toString()}`, { cache: 'no-store' });
    return res.ok ? res.json() : [];
  } catch (e) {
    console.warn('Backend API not available:', e);
    return [];
  }
}

export default async function FacilitiesSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const type = (params.type as string) ?? '';
  const includeBanned = (params.includeBanned as string) ?? 'false';
  const facilities = await getFacilities(type, includeBanned);
  const currentCategory = CATEGORIES.find(c => c.value === type);

  const crumbs = [
    { label: 'Tattoo Friendly施設', href: '/facilities' },
    ...(currentCategory ? [{ label: currentCategory.label }] : []),
  ];

  return (
    <div className="pb-20 md:pb-8">
      {/* パンくず */}
      <Breadcrumbs items={crumbs} />

      {/* PC: 2カラム / モバイル: 1カラム */}
      <div className="md:grid md:grid-cols-[240px_1fr] md:gap-8 md:items-start">

        {/* ===== PC 左サイドバー ===== */}
        <aside className="hidden md:block sticky top-24 space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-1">
            <p className="text-[9px] font-extrabold text-neutral-600 uppercase tracking-widest mb-3">カテゴリ</p>

            <Link href={`/facilities?includeBanned=${includeBanned}`}
              className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                !type ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}>
              <span className="text-base">🗾</span> すべて
              {!type && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
            </Link>

            {CATEGORIES.map(c => (
              <Link key={c.value} href={`/facilities?type=${c.value}&includeBanned=${includeBanned}`}
                className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  type === c.value ? 'bg-white/10 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}>
                <span className="text-base">{c.icon}</span> {c.label}
                {type === c.value && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
              </Link>
            ))}
          </div>

          {/* オプション：禁止施設トグル */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-2">
            <p className="text-[9px] font-extrabold text-neutral-600 uppercase tracking-widest mb-2">表示オプション</p>
            {includeBanned === 'true' ? (
              <Link href={`/facilities?type=${type}&includeBanned=false`}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold text-white bg-white/10 transition-all">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  禁止施設を含む
                </span>
                <span className="text-[10px] text-neutral-400">ON</span>
              </Link>
            ) : (
              <Link href={`/facilities?type=${type}&includeBanned=true`}
                className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neutral-600" />
                  禁止施設を含む
                </span>
                <span className="text-[10px]">OFF</span>
              </Link>
            )}
          </div>
        </aside>

        {/* ===== メインコンテンツ ===== */}
        <div className="space-y-5">
          {/* ページタイトル */}
          <div>
            <h1 className="font-heading font-extrabold text-3xl text-white tracking-tight uppercase">
              Tattoo Friendly
            </h1>
            <p className="text-neutral-400 text-xs mt-1 font-medium leading-relaxed">
              タトゥーに寛容な{currentCategory ? currentCategory.label : '温泉・ホテル・施設'}の情報を検索できます。
            </p>
          </div>

          {/* モバイル専用フィルター（横スクロールチップ） */}
          <section className="md:hidden space-y-3 sticky top-16 bg-black/80 backdrop-blur-xl z-30 pt-2 pb-4 -mx-4 px-4 border-b border-neutral-900">
            <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden =[scrollbar-width:none] gap-2 pb-1">
              <a href={`/facilities?includeBanned=${includeBanned}`}
                className={`px-4 py-2 text-[11px] font-extrabold shrink-0 border transition-all rounded-full uppercase ${
                  !type ? 'bg-white text-black border-white' : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-400 hover:text-white'
                }`}>
                ALL
              </a>
              {CATEGORIES.map(c => (
                <a key={c.value} href={`/facilities?type=${c.value}&includeBanned=${includeBanned}`}
                  className={`px-4 py-2 text-[11px] font-extrabold shrink-0 border transition-all rounded-full ${
                    type === c.value ? 'bg-white text-black border-white' : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-400 hover:text-white'
                  }`}>
                  {c.icon} {c.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {includeBanned === 'true' ? (
                <a href={`/facilities?type=${type}&includeBanned=false`}
                  className="px-3 py-1.5 text-[10px] font-bold bg-neutral-900 text-neutral-300 rounded-full border border-neutral-800 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> 禁止施設を隠す
                </a>
              ) : (
                <a href={`/facilities?type=${type}&includeBanned=true`}
                  className="px-3 py-1.5 text-[10px] font-bold bg-transparent text-neutral-500 rounded-full border border-neutral-800 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" /> 禁止施設を含める
                </a>
              )}
            </div>
          </section>

          {/* 施設一覧 */}
          <section className="pt-2">
            <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-4">
              {facilities.length} listings found
            </p>
            {facilities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {facilities.map((f: Facility) => (
                  <FacilityCard key={f.id} facility={f} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center border border-neutral-900 rounded-2xl bg-neutral-900/20">
                <p className="text-neutral-500 font-bold text-sm mb-1">施設が見つかりませんでした</p>
                <p className="text-neutral-600 text-xs mt-2">別のカテゴリを選択してください。</p>
                <a href="/facilities" className="inline-block mt-6 px-6 py-3 bg-white text-black text-xs font-bold tracking-widest uppercase rounded-full hover:bg-neutral-200 transition-colors">
                  VIEW ALL
                </a>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
