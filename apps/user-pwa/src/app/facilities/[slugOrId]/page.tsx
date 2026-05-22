import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, MapPin, Globe, ShieldAlert, AlertTriangle, FileText } from 'lucide-react';
import ReportFacilityButton from '@/components/facilities/ReportFacilityButton';

const API = 'http://localhost:3000';

async function getFacility(slugOrId: string) {
  const res = await fetch(`${API}/user-api/facilities/${slugOrId}`, { cache: 'no-store' });
  return res.ok ? res.json() : null;
}

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
    case 'COVERED_ONLY': return { label: 'シール等で隠して許可', color: 'bg-yellow-950/60 text-yellow-400 border-yellow-800', warning: 'タトゥーを露出しての入場・利用はできません。ラッシュガードやタトゥー隠しシールの着用が必須です。' };
    case 'PARTIAL_ONLY': return { label: 'ワンポイント等一部のみ可', color: 'bg-blue-950/60 text-blue-400 border-blue-800' };
    case 'BANNED': return { label: '一切禁止 (入館不可)', color: 'bg-red-950/60 text-red-400 border-red-800', warning: '当施設はタトゥー（刺青）のある方の入館・利用を一切お断りしています。予約しても入場できないためご注意ください。' };
    default: return { label: '要確認', color: 'bg-neutral-800/60 text-neutral-300 border-neutral-700' };
  }
};

export default async function FacilityDetailPage({
  params,
}: {
  params: Promise<{ slugOrId: string }>;
}) {
  const resolvedParams = await params;
  const facility = await getFacility(resolvedParams.slugOrId);

  if (!facility) {
    return (
      <div className="py-20 text-center border-2 border-dashed border-neutral-800 rounded-xl bg-neutral-900/50">
        <p className="text-neutral-400 font-bold mb-4">施設が見つかりません</p>
        <Link href="/facilities" className="inline-block px-6 py-3 bg-white text-black text-sm font-bold rounded-full hover:bg-neutral-200 transition-colors">
          一覧に戻る
        </Link>
      </div>
    );
  }

  const imageUrl = facility.mediaUrls?.[0] || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop';
  const area = [facility.prefecture, facility.city, facility.address].filter(Boolean).join(' ') || '未設定';

  return (
    <article className="pb-24">
      {/* 画面上部の戻るボタン */}
      <div className="absolute top-4 left-4 z-40">
         <Link href="/facilities" className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/70 transition-colors">
           <ChevronLeft className="w-6 h-6" />
         </Link>
      </div>

      {/* ヒーロー画像領域 */}
      <div className="-mx-4 -mt-6 h-[50vh] relative">
        <Image 
          src={imageUrl} 
          alt={facility.name} 
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-black/10" />
        
        {/* ヘッダー情報（オーバーレイ） */}
        <div className="absolute bottom-0 left-0 w-full p-4 pb-8 text-white">
          <div className="flex gap-2 mb-3">
            <span className="inline-block bg-white text-black px-3 py-1.5 text-xs font-bold tracking-widest rounded-full uppercase">
              {getTypeName(facility.type)}
            </span>
            <span className={`inline-block px-3 py-1.5 text-xs font-bold tracking-widest rounded-full border backdrop-blur-sm ${getAcceptanceInfo(facility.acceptanceLevel).color}`}>
              {getAcceptanceInfo(facility.acceptanceLevel).label}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold font-heading mb-2 leading-tight drop-shadow-lg">
            {facility.name}
          </h1>
          <p className="flex items-center gap-2 text-sm text-neutral-300 drop-shadow-md">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="line-clamp-1">{area}</span>
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto space-y-10 pt-6">
        {/* メインコンテンツ */}
        <div className="space-y-8 px-2">
          
          {/* 警告アラート */}
          {(facility.acceptanceLevel === 'BANNED' || facility.acceptanceLevel === 'COVERED_ONLY') && (
            <div className={`p-5 rounded-xl border flex items-start gap-3 ${
              facility.acceptanceLevel === 'BANNED' ? 'bg-red-950/30 border-red-900/50' : 'bg-yellow-950/30 border-yellow-900/50'
            }`}>
              {facility.acceptanceLevel === 'BANNED' ? (
                <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-yellow-500 shrink-0 mt-0.5" />
              )}
              <div>
                <h3 className={`text-sm font-bold mb-1 ${
                  facility.acceptanceLevel === 'BANNED' ? 'text-red-400' : 'text-yellow-400'
                }`}>
                  {facility.acceptanceLevel === 'BANNED' ? '予約に関する重要なお知らせ' : '利用に関する注意事項'}
                </h3>
                <p className={`text-xs leading-relaxed font-medium ${
                  facility.acceptanceLevel === 'BANNED' ? 'text-red-200' : 'text-yellow-200'
                }`}>
                  {getAcceptanceInfo(facility.acceptanceLevel).warning}
                </p>
              </div>
            </div>
          )}

          {/* タトゥーポリシー */}
          <section>
            <h2 className="flex items-center gap-2 text-sm font-bold text-white mb-4 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-brand-400" />
              Tattoo Policy
            </h2>
            <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl">
              <p className="whitespace-pre-wrap leading-relaxed text-sm text-neutral-300 font-medium">
                {facility.tattooPolicy || 'ポリシー情報の記載がありません。事前に施設へのご確認をおすすめします。'}
              </p>
            </div>
          </section>

          {/* 説明文 */}
          <section>
            <h2 className="text-sm font-bold text-white border-b border-neutral-800 pb-2 mb-4 uppercase tracking-wider">
              About
            </h2>
            <div className="prose prose-invert max-w-none text-sm">
              <p className="whitespace-pre-wrap leading-relaxed text-neutral-300">
                {facility.description || '概要情報の登録がありません。'}
              </p>
            </div>
          </section>

          {/* Information */}
          <section>
             <h2 className="text-sm font-bold text-white border-b border-neutral-800 pb-2 mb-4 uppercase tracking-wider">
              Information
            </h2>
            <dl className="space-y-4">
              <div className="flex gap-4">
                <dt className="text-xs text-neutral-500 uppercase font-bold mt-0.5 w-20 shrink-0">ADDRESS</dt>
                <dd className="text-sm text-neutral-200">{area}</dd>
              </div>
              
              {facility.websiteUrl && (
                <div className="flex gap-4">
                  <dt className="text-xs text-neutral-500 uppercase font-bold mt-0.5 w-20 shrink-0">WEBSITE</dt>
                  <dd className="flex-1">
                    <a 
                      href={facility.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-brand-400 hover:text-brand-300 hover:underline break-all inline-flex items-center gap-1"
                    >
                      <Globe className="w-3 h-3" />
                      公式サイトを開く
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <div className="pt-4 space-y-3">
            <ReportFacilityButton facilityId={facility.id} facilityName={facility.name} />
          </div>
        </div>
      </div>
    </article>
  );
}
