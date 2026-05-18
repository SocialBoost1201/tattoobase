import Link from 'next/link';

export type Facility = {
  id: string;
  name: string;
  slug: string;
  type: string;
  acceptanceLevel: string;
  prefecture?: string;
  city?: string;
  tattooPolicy?: string;
  mediaUrls: string[];
};

const getTypeName = (type: string) => {
  switch (type) {
    case 'ONSEN': return '温泉';
    case 'SENTO': return '銭湯';
    case 'GYM': return 'ジム・プール';
    case 'HOTEL': return 'ホテル・旅館';
    case 'BEACH': return '海水浴場';
    default: return 'その他';
  }
};

const getAcceptanceInfo = (level: string) => {
  switch (level) {
    case 'ALLOWED': return { label: '全面許可', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    case 'COVERED_ONLY': return { label: '隠して許可', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
    case 'PARTIAL_ONLY': return { label: '一部のみ可', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
    case 'BANNED': return { label: '一切禁止', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
    default: return { label: '要確認', color: 'bg-white/10 text-white/60 border-white/20' };
  }
};

export default function FacilityCard({ facility }: { facility: Facility }) {
  const imageUrl = facility.mediaUrls?.[0] || '';
  const area = [facility.prefecture, facility.city].filter(Boolean).join(' ') || 'エリア未設定';

  return (
    <Link href={`/facilities/${facility.slug || facility.id}`} className="group block h-full">
      <div className="glass glass-hover rounded-2xl overflow-hidden h-full flex flex-col cursor-pointer glow-white">
        <div className="aspect-[4/3] relative overflow-hidden bg-white/4">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={facility.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl font-extrabold text-white/15 tracking-tighter">TF</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg tracking-wider border border-white/10">
            {getTypeName(facility.type)}
          </div>
          <div className={`absolute bottom-2 right-2 text-[10px] font-bold px-2 py-1 rounded-lg tracking-widest border backdrop-blur-sm ${getAcceptanceInfo(facility.acceptanceLevel).color}`}>
            {getAcceptanceInfo(facility.acceptanceLevel).label}
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-white font-bold text-sm leading-tight mb-1 group-hover:text-white/80 transition-colors line-clamp-2">
            {facility.name}
          </h3>
          <p className="text-white/40 text-xs mb-3 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            {area}
          </p>

          <div className="mt-auto pt-3 border-t border-white/6">
            <p className="text-white/50 text-xs font-medium line-clamp-2">
              <span className="text-amber-400/80 font-bold mr-1">Tattoo Policy:</span>
              {facility.tattooPolicy || 'ポリシー未設定（要確認）'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
