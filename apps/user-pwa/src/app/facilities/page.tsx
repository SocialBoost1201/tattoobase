import FacilityCard, { Facility } from '@/components/cards/FacilityCard';

const API = 'http://localhost:3000';

const CATEGORIES = [
  { value: 'ONSEN', label: '温泉' },
  { value: 'SENTO', label: '銭湯' },
  { value: 'GYM', label: 'ジム・プール' },
  { value: 'HOTEL', label: 'ホテル・旅館' },
  { value: 'BEACH', label: '海水浴場' },
  { value: 'OTHER', label: 'その他' }
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

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="font-heading font-extrabold text-3xl text-white tracking-tight uppercase">
          Tattoo Friendly
        </h1>
        <p className="text-neutral-400 text-xs mt-1 font-medium leading-relaxed">
          タトゥーのある方が最も知りたい情報が豊富に掲載されています。<br className="hidden md:block" />
          タトゥーに寛容な温泉や宿泊施設の情報を検索できます。
        </p>
      </div>

      {/* フィルター (Scrollable Row) */}
      <section className="space-y-4 sticky top-16 bg-black/80 backdrop-blur-xl z-30 pt-2 pb-4 -mx-4 px-4 border-b border-neutral-900">
        <h2 className="text-neutral-500 text-[10px] font-bold tracking-widest uppercase">Select Category</h2>
        <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none] gap-2 pb-1">
          <a
            href={`/facilities?includeBanned=${includeBanned}`}
            className={`px-4 py-2 text-[11px] font-extrabold shrink-0 border transition-all rounded-full tracking-widest uppercase ${
              !type
                ? 'bg-white text-black border-white shadow-md shadow-white/10'
                : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-400 hover:text-white'
            }`}
          >
            ALL
          </a>
          {CATEGORIES.map((c) => (
            <a
              key={c.value}
              href={`/facilities?type=${c.value}&includeBanned=${includeBanned}`}
              className={`px-4 py-2 text-[11px] font-extrabold shrink-0 border transition-all rounded-full tracking-widest uppercase ${
                type === c.value
                  ? 'bg-white text-black border-white shadow-md shadow-white/10'
                  : 'bg-transparent text-neutral-400 border-neutral-700 hover:border-neutral-400 hover:text-white'
              }`}
            >
              {c.label}
            </a>
          ))}
        </div>
        
        {/* タトゥー禁止施設を含めるトグル */}
        <div className="mt-3 flex items-center gap-3">
          <span className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase">Option:</span>
          {includeBanned === 'true' ? (
            <a 
              href={`/facilities?type=${type}&includeBanned=false`}
              className="px-3 py-1.5 text-[10px] font-bold tracking-wide bg-neutral-900 text-neutral-300 rounded-full border border-neutral-800 hover:bg-neutral-800 transition-colors flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> 禁止施設を隠す
            </a>
          ) : (
            <a 
              href={`/facilities?type=${type}&includeBanned=true`}
              className="px-3 py-1.5 text-[10px] font-bold tracking-wide bg-transparent text-neutral-500 rounded-full border border-neutral-800 hover:border-neutral-600 hover:text-white transition-colors flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span> 禁止施設を含める
            </a>
          )}
        </div>
      </section>

      {/* 施設一覧グリッド */}
      <section className="pt-2">
        <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-4">
          {facilities.length} listings found
        </p>

        {facilities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {facilities.map((f: Facility) => (
              <FacilityCard key={f.id} facility={f} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-neutral-900 rounded-2xl bg-neutral-900/20">
            <p className="text-neutral-500 font-bold text-sm mb-1">施設が見つかりませんでした</p>
            <p className="text-neutral-600 text-xs mt-2">別のカテゴリを選択するか、しばらくしてからもう一度お試しください。</p>
            <a href="/facilities" className="inline-block mt-6 px-6 py-3 bg-white text-black text-xs font-bold tracking-widest uppercase rounded-full hover:bg-neutral-200 transition-colors">
              VIEW ALL
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
