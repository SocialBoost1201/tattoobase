import Link from 'next/link';
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
    case 'ALLOWED': return { label: '全面許可', color: 'bg-green-100 text-green-800 border-green-200' };
    case 'COVERED_ONLY': return { label: 'シール等で隠して許可', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', warning: 'タトゥーを露出しての入場・利用はできません。ラッシュガードやタトゥー隠しシールの着用が必須です。' };
    case 'PARTIAL_ONLY': return { label: 'ワンポイント等一部のみ可', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'BANNED': return { label: '一切禁止 (入館不可)', color: 'bg-red-100 text-red-800 border-red-200', warning: '当施設はタトゥー（刺青）のある方の入館・利用を一切お断りしています。予約しても入場できないためご注意ください。' };
    default: return { label: '要確認', color: 'bg-gray-100 text-gray-800 border-gray-200' };
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
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">施設が見つかりません</h1>
        <Link href="/facilities" className="text-amber-700 hover:underline">← 一覧に戻る</Link>
      </div>
    );
  }

  const imageUrl = facility.mediaUrls?.[0] || '';
  const area = [facility.prefecture, facility.city, facility.address].filter(Boolean).join(' ') || '未設定';

  return (
    <article className="pb-20">
      {/* ヒーロー画像領域 */}
      <div className="relative w-full h-[40vh] md:h-[60vh] bg-[#f0f0f0]">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={facility.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl font-extrabold text-[#d0d0d0] tracking-tighter">TF</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* ヘッダー情報（オーバーレイ） */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
          <div className="max-w-5xl mx-auto w-full">
            <div className="flex gap-2 mb-3">
              <span className="inline-block bg-white text-black px-3 py-1 text-xs font-bold tracking-widest rounded-sm uppercase">
                {getTypeName(facility.type)}
              </span>
              <span className={`inline-block px-3 py-1 text-xs font-bold tracking-widest rounded-sm border ${getAcceptanceInfo(facility.acceptanceLevel).color}`}>
                {getAcceptanceInfo(facility.acceptanceLevel).label}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold font-heading mb-3 leading-tight text-balance shadow-black drop-shadow-lg">
              {facility.name}
            </h1>
            <p className="flex items-center gap-2 text-sm md:text-base opacity-90 drop-shadow-md pb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              {area}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-12 py-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* 左側：メインコンテンツ */}
        <div className="md:col-span-2 space-y-12">
          
          {/* 警告アラート (必要な場合のみ) */}
          {(facility.acceptanceLevel === 'BANNED' || facility.acceptanceLevel === 'COVERED_ONLY') && (
            <div className={`p-6 rounded-md border-2 shadow-sm ${
              facility.acceptanceLevel === 'BANNED' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'
            }`}>
              <h3 className={`text-lg font-bold flex items-center gap-2 mb-2 ${
                facility.acceptanceLevel === 'BANNED' ? 'text-red-800' : 'text-yellow-800'
              }`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
                {facility.acceptanceLevel === 'BANNED' ? '予約に関する重要なお知らせ' : '利用に関する注意事項'}
              </h3>
              <p className={`font-medium leading-relaxed ${
                facility.acceptanceLevel === 'BANNED' ? 'text-red-900' : 'text-yellow-900'
              }`}>
                {getAcceptanceInfo(facility.acceptanceLevel).warning}
              </p>
            </div>
          )}

          {/* 説明文 */}
          <section>
            <h2 className="text-xl font-bold border-b-2 border-[#0a0a0a] pb-2 mb-6 uppercase tracking-wider">About</h2>
            <div className="prose prose-neutral max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed text-[#3b3b3b]">
                {facility.description || '概要情報の登録がありません。'}
              </p>
            </div>
          </section>

          {/* タトゥーポリシー */}
          <section>
            <h2 className="text-xl font-bold border-b-2 border-amber-700 pb-2 mb-6 uppercase tracking-wider flex items-center gap-2">
              <span className="bg-amber-700 text-white w-8 h-8 flex items-center justify-center rounded-sm">T</span>
              Tattoo Policy
            </h2>
            <div className="bg-amber-50 p-6 rounded-md border border-amber-200">
              <p className="whitespace-pre-wrap leading-relaxed font-medium text-amber-900">
                {facility.tattooPolicy || 'ポリシー情報の記載がありません。事前に施設へのご確認をおすすめします。'}
              </p>
            </div>
          </section>
        </div>

        {/* 右側：サイドバー */}
        <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-[#e0e0e0] md:pl-10 pt-10 md:pt-0">
          <div className="sticky top-6">
            <h3 className="text-sm font-bold tracking-widest uppercase text-[#6b6b6b] mb-4">Information</h3>
            
            <dl className="space-y-4">
              <div>
                <dt className="text-xs text-[#8b8b8b] uppercase font-bold mb-1">住所</dt>
                <dd className="text-sm text-[#0a0a0a]">{area}</dd>
              </div>
              
              {facility.websiteUrl && (
                <div>
                  <dt className="text-xs text-[#8b8b8b] uppercase font-bold mb-1">ウェブサイト</dt>
                  <dd>
                    <a 
                      href={facility.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline break-all"
                    >
                      {facility.websiteUrl}
                    </a>
                  </dd>
                </div>
              )}
            </dl>

            <div className="mt-8 space-y-3">
              <ReportFacilityButton facilityId={facility.id} facilityName={facility.name} />
              
              <Link 
                href="/facilities" 
                className="w-full block text-center bg-[#f5f5f5] hover:bg-neutral-300 transition-colors py-3 rounded-md text-sm font-bold text-[#0a0a0a]"
              >
                一覧へ戻る
              </Link>
            </div>
          </div>
        </div>

      </div>
    </article>
  );
}
