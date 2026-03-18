import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ChevronRight, Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: '全国のタトゥースタジオ・彫り師を探す | TattooBase',
  description: '日本全国のタトゥースタジオやアーティストを都道府県・エリアから検索。あなたのお住まいの地域で理想のタトゥーを見つけましょう。',
};

const REGIONS = [
  {
    name: '北海道・東北',
    prefectures: [
      { id: 'hokkaido', name: '北海道' },
      { id: 'aomori', name: '青森県' },
      { id: 'iwate', name: '岩手県' },
      { id: 'miyagi', name: '宮城県' },
      { id: 'akita', name: '秋田県' },
      { id: 'yamagata', name: '山形県' },
      { id: 'fukushima', name: '福島県' },
    ]
  },
  {
    name: '関東',
    prefectures: [
      { id: 'tokyo', name: '東京都' },
      { id: 'kanagawa', name: '神奈川県' },
      { id: 'saitama', name: '埼玉県' },
      { id: 'chiba', name: '千葉県' },
      { id: 'ibaraki', name: '茨城県' },
      { id: 'tochigi', name: '栃木県' },
      { id: 'gunma', name: '群馬県' },
    ]
  },
  {
    name: '北陸・甲信越',
    prefectures: [
      { id: 'niigata', name: '新潟県' },
      { id: 'toyama', name: '富山県' },
      { id: 'ishikawa', name: '石川県' },
      { id: 'fukui', name: '福井県' },
      { id: 'yamanashi', name: '山梨県' },
      { id: 'nagano', name: '長野県' },
    ]
  },
  {
    name: '東海',
    prefectures: [
      { id: 'aichi', name: '愛知県' },
      { id: 'gifu', name: '岐阜県' },
      { id: 'shizuoka', name: '静岡県' },
      { id: 'mie', name: '三重県' },
    ]
  },
  {
    name: '関西',
    prefectures: [
      { id: 'osaka', name: '大阪府' },
      { id: 'hyogo', name: '兵庫県' },
      { id: 'kyoto', name: '京都府' },
      { id: 'shiga', name: '滋賀県' },
      { id: 'nara', name: '奈良県' },
      { id: 'wakayama', name: '和歌山県' },
    ]
  },
  {
    name: '中国・四国',
    prefectures: [
      { id: 'tottori', name: '鳥取県' },
      { id: 'shimane', name: '島根県' },
      { id: 'okayama', name: '岡山県' },
      { id: 'hiroshima', name: '広島県' },
      { id: 'yamaguchi', name: '山口県' },
      { id: 'tokushima', name: '徳島県' },
      { id: 'kagawa', name: '香川県' },
      { id: 'ehime', name: '愛媛県' },
      { id: 'kochi', name: '高知県' },
    ]
  },
  {
    name: '九州・沖縄',
    prefectures: [
      { id: 'fukuoka', name: '福岡県' },
      { id: 'saga', name: '佐賀県' },
      { id: 'nagasaki', name: '長崎県' },
      { id: 'kumamoto', name: '熊本県' },
      { id: 'oita', name: '大分県' },
      { id: 'miyazaki', name: '宮崎県' },
      { id: 'kagoshima', name: '鹿児島県' },
      { id: 'okinawa', name: '沖縄県' },
    ]
  }
];

export default function AreaIndexPage() {
  return (
    <div className="min-h-screen bg-black pb-32">
      {/* ヒーローセクション */}
      <section className="relative pt-24 pb-16 px-4 border-b border-white/10 bg-neutral-900/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto relative text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Compass className="w-8 h-8 text-neutral-300" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            全国からタトゥースタジオを探す
          </h1>
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            日本全国47都道府県のタトゥースタジオ・アーティストをエリア別に検索。近所のスタジオや、旅行先で彫りたいアーティストを見つけましょう。
          </p>
        </div>
      </section>

      {/* エリアインデックス */}
      <section className="max-w-5xl mx-auto px-4 py-16 space-y-16">
        {REGIONS.map(region => (
          <div key={region.name} className="space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3 border-b border-white/10 pb-4">
              <MapPin className="w-6 h-6 text-neutral-500" />
              {region.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {region.prefectures.map(pref => (
                <Link 
                  key={pref.id} 
                  href={`/area/${pref.id}`}
                  className="group block bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:bg-neutral-800 hover:border-neutral-600 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-sm tracking-wide">{pref.name}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
