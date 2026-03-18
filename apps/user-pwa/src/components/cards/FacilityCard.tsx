import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

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
    case 'ALLOWED': return { label: '全面許可', color: 'bg-green-950/60 text-green-400 border-green-800' };
    case 'COVERED_ONLY': return { label: '隠して許可', color: 'bg-yellow-950/60 text-yellow-400 border-yellow-800' };
    case 'PARTIAL_ONLY': return { label: '一部可', color: 'bg-blue-950/60 text-blue-400 border-blue-800' };
    case 'BANNED': return { label: '一切禁止', color: 'bg-red-950/60 text-red-400 border-red-800' };
    default: return { label: '要確認', color: 'bg-neutral-800/60 text-neutral-300 border-neutral-700' };
  }
};

export default function FacilityCard({ facility }: { facility: Facility }) {
  const imageUrl = facility.mediaUrls?.[0] || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop';
  const area = [facility.prefecture, facility.city].filter(Boolean).join(' ') || 'エリア未設定';

  return (
    <Link href={`/facilities/${facility.slug || facility.id}`} className="group block h-full">
      <div className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-neutral-600 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl h-full flex flex-col cursor-pointer">
        {/* サムネイル画像 */}
        <div className="aspect-[4/3] bg-neutral-950 relative overflow-hidden">
          <Image 
            src={imageUrl} 
            alt={facility.name} 
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          {/* カテゴリバッジ */}
          <div className="absolute top-3 left-3 bg-white text-black text-[10px] font-extrabold px-3 py-1.5 rounded-full tracking-widest leading-none shadow-md">
            {getTypeName(facility.type)}
          </div>
          {/* 受け入れレベルバッジ */}
          <div className={`absolute bottom-3 right-3 text-[10px] font-bold px-2 py-1.5 rounded-sm tracking-widest border backdrop-blur-sm ${getAcceptanceInfo(facility.acceptanceLevel).color}`}>
            {getAcceptanceInfo(facility.acceptanceLevel).label}
          </div>
        </div>
        
        {/* テキスト情報 */}
        <div className="p-5 flex flex-col flex-grow bg-neutral-900 group-hover:bg-neutral-800/50 transition-colors duration-500">
          <h3 className="text-white font-extrabold text-base leading-tight mb-2 group-hover:text-brand-300 transition-colors line-clamp-2">
            {facility.name}
          </h3>
          <p className="text-neutral-400 text-xs mb-4 flex items-center gap-1.5 font-medium">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="line-clamp-1">{area}</span>
          </p>
          
          <div className="mt-auto pt-4 border-t border-neutral-800">
            <p className="text-neutral-300 text-[11px] font-semibold line-clamp-2 leading-relaxed">
              <span className="text-brand-400 font-extrabold mr-1.5 uppercase tracking-widest">Policy:</span>
              {facility.tattooPolicy || 'ポリシー未設定（要確認）'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
