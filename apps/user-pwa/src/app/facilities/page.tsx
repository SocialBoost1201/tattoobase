import FacilityCard, { Facility } from '@/components/cards/FacilityCard';
import { API_BASE } from '@/lib/api';
import { MOCK_FACILITIES } from '@/lib/mock-data';
import Link from 'next/link';

const CATEGORIES = [
  { value: 'ONSEN', label: '温泉' },
  { value: 'SENTO', label: '銭湯' },
  { value: 'GYM', label: 'ジム・プール' },
  { value: 'HOTEL', label: 'ホテル・旅館' },
  { value: 'BEACH', label: '海水浴場' },
  { value: 'OTHER', label: 'その他' },
];

async function getFacilities(type?: string, includeBanned?: string) {
  try {
    const query = new URLSearchParams();
    if (type) query.append('type', type);
    if (includeBanned === 'true') query.append('includeBanned', 'true');
    const res = await fetch(`${API_BASE}/user-api/facilities?${query.toString()}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch {
    // API not available
  }
  let results = [...MOCK_FACILITIES];
  if (type) results = results.filter((f) => f.type === type);
  if (includeBanned !== 'true') results = results.filter((f) => f.acceptanceLevel !== 'BANNED');
  return results;
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
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">TATTOO FRIENDLY</h1>
        <p className="text-white/45 text-xs mt-1">
          タトゥーに寛容な温泉・宿泊施設を探す
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/facilities?includeBanned=${includeBanned}`}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
            !type ? 'bg-white text-black border-white' : 'glass text-white/50 hover:text-white'
          }`}
        >
          ALL
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.value}
            href={`/facilities?type=${c.value}&includeBanned=${includeBanned}`}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              type === c.value ? 'bg-white text-black border-white' : 'glass text-white/50 hover:text-white'
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {/* Banned toggle */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-semibold text-white/35">表示オプション:</span>
        {includeBanned === 'true' ? (
          <Link
            href={`/facilities?type=${type}&includeBanned=false`}
            className="px-3 py-1.5 text-[11px] font-semibold glass text-white/50 hover:text-white rounded-lg border border-white/10 transition-all flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> 禁止施設を隠す
          </Link>
        ) : (
          <Link
            href={`/facilities?type=${type}&includeBanned=true`}
            className="px-3 py-1.5 text-[11px] font-semibold glass text-white/50 hover:text-white rounded-lg border border-white/10 transition-all flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" /> 禁止施設も表示
          </Link>
        )}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-base font-extrabold text-white font-heading">
          {type ? CATEGORIES.find((c) => c.value === type)?.label : 'すべての施設'}
        </h2>
        <span className="text-white/35 text-xs">{facilities.length} listings</span>
      </div>

      {facilities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {facilities.map((f: Facility) => (
            <FacilityCard key={f.id} facility={f} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center glass rounded-2xl space-y-3">
          <p className="text-white/45 text-sm">施設が見つかりませんでした</p>
          <Link href="/facilities" className="inline-block text-xs font-semibold text-white/50 hover:text-white underline underline-offset-2">
            すべての施設を表示
          </Link>
        </div>
      )}
    </div>
  );
}
