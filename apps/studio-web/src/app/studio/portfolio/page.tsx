import Image from 'next/image';
import { Plus, Filter, LayoutGrid, MoreVertical, Search, Heart, Eye } from 'lucide-react';

const mockPortfolios = [
  { id: 'w1', title: '虎の和彫', style: '和彫', imageUrl: 'https://images.unsplash.com/photo-1598371839696-5e5bb00b0e59?q=80&w=400&auto=format&fit=crop', views: 124, likes: 45, status: 'PUBLISHED' },
  { id: 'w2', title: 'バラのワンポイント', style: 'ミニマル', imageUrl: 'https://images.unsplash.com/photo-1621374523924-f72596ab8bf2?q=80&w=400&auto=format&fit=crop', views: 89, likes: 22, status: 'PUBLISHED' },
  { id: 'w3', title: 'フクロウと月', style: 'ブラックアンドグレー', imageUrl: 'https://images.unsplash.com/photo-1643916295551-40eebb40dbbe?q=80&w=400&auto=format&fit=crop', views: 256, likes: 98, status: 'PUBLISHED' },
  { id: 'w4', title: '幾何学模様', style: 'ジオメトリック', imageUrl: 'https://images.unsplash.com/photo-1588636952865-f481ad1e0a29?q=80&w=400&auto=format&fit=crop', views: 45, likes: 12, status: 'DRAFT' },
  { id: 'w5', title: 'トラディショナル・パンサー', style: 'トラディショナル', imageUrl: 'https://images.unsplash.com/photo-1589178233405-b0d3bbba1c17?q=80&w=400&auto=format&fit=crop', views: 312, likes: 145, status: 'PUBLISHED' },
  { id: 'w6', title: '蝶のレタリング', style: 'レタリング', imageUrl: 'https://images.unsplash.com/photo-1562916174-a0f12da31888?q=80&w=400&auto=format&fit=crop', views: 67, likes: 18, status: 'PUBLISHED' },
];

export default function PortfolioPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Portfolio</h1>
          <p className="text-sm text-neutral-500 mt-1">作品のアップロードと公開設定・管理</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors shadow-sm shadow-brand-600/20">
          <Plus className="w-4 h-4" /> Upload Work
        </button>
      </div>

      {/* ツールバー */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search artworks..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 focus:border-brand-400 focus:ring-1 focus:ring-brand-400 rounded-lg text-sm outline-none transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 text-neutral-700 text-sm font-semibold rounded-lg hover:bg-neutral-50 transition-colors shrink-0 shadow-sm">
            <Filter className="w-4 h-4" /> Style
          </button>
        </div>
        
        {/* ビュー・トグル */}
        <div className="bg-white p-1 rounded-lg border border-neutral-200 flex text-sm shadow-sm w-full sm:w-auto">
           <button className="px-3 py-1.5 bg-neutral-100 text-neutral-900 rounded-md font-semibold flex items-center gap-2"><LayoutGrid className="w-4 h-4"/> Grid</button>
           <button className="px-3 py-1.5 text-neutral-500 hover:text-neutral-700 flex items-center gap-2"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg> List</button>
        </div>
      </div>

      {/* 作品ギャラリー・グリッド */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockPortfolios.map((work) => (
          <div key={work.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            {/* サムネイル */}
            <div className="aspect-4/5 relative bg-neutral-100 overflow-hidden">
              <Image 
                src={work.imageUrl} 
                alt={work.title} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              
              {/* ステータスバッジ */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`px-2 py-1 text-[10px] font-extrabold rounded-md uppercase tracking-wider backdrop-blur-md ${
                  work.status === 'PUBLISHED' ? 'bg-black/60 text-white' : 'bg-neutral-200/90 text-neutral-700'
                }`}>
                  {work.status}
                </span>
              </div>

              {/* クイックアクション (Hover) */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                 <button className="px-4 py-2 bg-white text-black font-bold text-xs rounded-full hover:bg-neutral-200 transition-colors">Edit</button>
                 <button className="w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"><MoreVertical className="w-4 h-4"/></button>
              </div>
            </div>

            {/* 情報カード下部 */}
            <div className="p-4">
              <h3 className="font-bold text-neutral-900 text-sm truncate">{work.title}</h3>
              <p className="text-xs text-neutral-500 mt-1">{work.style}</p>
              
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-400">
                <div className="flex gap-3">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5"/> {work.views}</span>
                  <span className="flex items-center gap-1 text-pink-500/80"><Heart className="w-3.5 h-3.5"/> {work.likes}</span>
                </div>
                <span>12 days ago</span>
              </div>
            </div>
          </div>
        ))}
        
        {/* 新規アップロード・プレースホルダ */}
        <button className="bg-neutral-50 rounded-xl border-2 border-dashed border-neutral-200 hover:border-brand-300 hover:bg-neutral-100 transition-colors flex flex-col items-center justify-center gap-3 aspect-4/5 text-neutral-500 hover:text-brand-600">
           <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
             <Plus className="w-6 h-6" />
           </div>
           <span className="font-bold text-sm">Upload New Work</span>
        </button>
      </div>
    </div>
  );
}
