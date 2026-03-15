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
    case 'ALLOWED': return { label: '全面許可', color: 'bg-green-100 text-green-800 border-green-200' };
    case 'COVERED_ONLY': return { label: '隠して許可', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    case 'PARTIAL_ONLY': return { label: '一部のみ可', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'BANNED': return { label: '一切禁止', color: 'bg-red-100 text-red-800 border-red-200' };
    default: return { label: '要確認', color: 'bg-gray-100 text-gray-800 border-gray-200' };
  }
};

export default function FacilityCard({ facility }: { facility: Facility }) {
  const imageUrl = facility.mediaUrls?.[0] || '';
  const area = [facility.prefecture, facility.city].filter(Boolean).join(' ') || 'エリア未設定';

  return (
    <Link href={`/facilities/${facility.slug || facility.id}`} className="group block h-full">
      <div className="bg-white rounded-md overflow-hidden border border-[#e0e0e0] hover:border-[#0a0a0a] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full flex flex-col cursor-pointer">
        {/* サムネイル画像（ない場合はグレー背景） */}
        <div className="aspect-[4/3] bg-[#f5f5f5] relative overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={facility.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-3xl font-extrabold text-[#d0d0d0] tracking-tighter">TF</span>
            </div>
          )}
          {/* カテゴリバッジ */}
          <div className="absolute top-2 left-2 bg-[#0a0a0a] text-white text-[10px] font-bold px-2 py-1 rounded-sm tracking-wider">
            {getTypeName(facility.type)}
          </div>
          {/* 受け入れレベルバッジ */}
          <div className={`absolute bottom-2 right-2 text-[10px] font-bold px-2 py-1 rounded-sm tracking-widest border ${getAcceptanceInfo(facility.acceptanceLevel).color}`}>
            {getAcceptanceInfo(facility.acceptanceLevel).label}
          </div>
        </div>
        
        {/* テキスト情報 */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-[#0a0a0a] font-bold text-sm leading-tight mb-1 group-hover:text-amber-700 transition-colors line-clamp-2">
            {facility.name}
          </h3>
          <p className="text-[#6b6b6b] text-xs mb-3 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            {area}
          </p>
          
          <div className="mt-auto pt-3 border-t border-[#f0f0f0]">
            <p className="text-[#3b3b3b] text-xs font-medium line-clamp-2">
              <span className="text-amber-700 font-bold mr-1">Tattoo Policy:</span>
              {facility.tattooPolicy || 'ポリシー未設定（要確認）'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
