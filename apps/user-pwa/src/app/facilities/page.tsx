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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* ページヘッダー */}
      <div className="text-center space-y-3">
        <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-[#0a0a0a] tracking-tight uppercase">
          Tattoo Friendly
        </h1>
        <p className="text-[#4b4b4b] text-sm md:text-base max-w-2xl mx-auto">
          タトゥーのある方がもっとも知りたい情報が豊富に掲載されています。<br className="hidden md:block" />
          タトゥーに寛容な温泉や宿泊施設の情報を検索できます。
        </p>
      </div>

      {/* カテゴリフィルター */}
      <section className="bg-[#fcfcfc] border border-[#e8e8e8] p-4 md:p-6 rounded-lg">
        <h2 className="text-[#0a0a0a] text-xs font-bold mb-3 tracking-widest uppercase">Filter by Category</h2>
        <div className="flex flex-wrap gap-2">
          <a
            href={`/facilities?includeBanned=${includeBanned}`}
            className={`px-4 py-2 text-xs font-bold border transition-all rounded-md tracking-wide ${
              !type
                ? 'bg-[#0a0a0a] text-white border-[#0a0a0a] shadow-md shadow-black/10'
                : 'bg-white text-[#6b6b6b] border-[#d0d0d0] hover:border-[#0a0a0a] hover:text-[#0a0a0a]'
            }`}
          >
            ALL
          </a>
          {CATEGORIES.map((c) => (
            <a
              key={c.value}
              href={`/facilities?type=${c.value}&includeBanned=${includeBanned}`}
              className={`px-4 py-2 text-xs font-bold border transition-all rounded-md tracking-wide ${
                type === c.value
                  ? 'bg-[#0a0a0a] text-white border-[#0a0a0a] shadow-md shadow-black/10'
                  : 'bg-white text-[#6b6b6b] border-[#d0d0d0] hover:border-[#0a0a0a] hover:text-[#0a0a0a]'
              }`}
            >
              {c.label}
            </a>
          ))}
        </div>
        
        {/* タトゥー禁止施設を含めるトグル設定 */}
        <div className="mt-4 pt-4 border-t border-[#e8e8e8] flex items-center gap-3">
          <span className="text-xs font-bold text-[#6b6b6b]">オプション:</span>
          {includeBanned === 'true' ? (
            <a 
              href={`/facilities?type=${type}&includeBanned=false`}
              className="px-3 py-1.5 text-xs font-bold bg-[#f5f5f5] text-[#3b3b3b] rounded border border-[#d0d0d0] hover:bg-white transition-colors flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-red-500"></span> 禁止施設を隠す
            </a>
          ) : (
            <a 
              href={`/facilities?type=${type}&includeBanned=true`}
              className="px-3 py-1.5 text-xs font-bold bg-white text-[#6b6b6b] rounded border border-[#e0e0e0] hover:border-[#d0d0d0] transition-colors flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-gray-300"></span> 禁止施設も含めて表示
            </a>
          )}
        </div>
      </section>

      {/* 施設一覧グリッド */}
      <section>
        <div className="flex items-center justify-between mb-4 mt-2">
          <h2 className="text-xl font-extrabold text-[#0a0a0a] font-heading">
            {type ? CATEGORIES.find(c => c.value === type)?.label : 'すべての施設'}
          </h2>
          <span className="text-[#6b6b6b] text-xs font-bold bg-[#f0f0f0] px-3 py-1 rounded-full">
            {facilities.length} LISTINGS
          </span>
        </div>

        {facilities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((f: Facility) => (
              <FacilityCard key={f.id} facility={f} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-[#e0e0e0] rounded-xl bg-gray-50/50">
            <svg className="w-12 h-12 text-[#b0b0b0] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-[#3b3b3b] font-bold text-lg mb-1">施設が見つかりませんでした</p>
            <p className="text-[#6b6b6b] text-sm">別のカテゴリを選択するか、しばらくしてからもう一度お試しください。</p>
            <a href="/facilities" className="inline-block mt-6 text-sm font-bold text-[#0a0a0a] hover:underline underline-offset-4">
              &larr; すべての施設を表示
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
