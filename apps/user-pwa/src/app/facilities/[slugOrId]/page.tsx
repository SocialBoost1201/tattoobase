import Link from 'next/link';
import Image from 'next/image';
import ReportFacilityButton from '@/components/facilities/ReportFacilityButton';
import { API_BASE } from '@/lib/api';
import { MOCK_FACILITIES } from '@/lib/mock-data';

async function getFacility(slugOrId: string) {
  try {
    const res = await fetch(`${API_BASE}/user-api/facilities/${slugOrId}`, { cache: 'no-store' });
    if (res.ok) return res.json();
  } catch {
    // API not available
  }
  return MOCK_FACILITIES.find((f) => f.slug === slugOrId || f.id === slugOrId) ?? null;
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
    case 'ALLOWED':
      return { label: '全面許可', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' };
    case 'COVERED_ONLY':
      return { label: '隠せばOK', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10', warning: 'タトゥーを露出しての入場・利用はできません。ラッシュガードやタトゥー隠しシールの着用が必須です。' };
    case 'PARTIAL_ONLY':
      return { label: 'ワンポイント可', color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' };
    case 'BANNED':
      return { label: '入館不可', color: 'text-red-400 border-red-500/30 bg-red-500/10', warning: '当施設はタトゥーのある方の入館・利用を一切お断りしています。予約しても入場できないためご注意ください。' };
    default:
      return { label: '要確認', color: 'text-white/40 border-white/10 bg-white/5' };
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
      <div className="py-16 text-center glass rounded-2xl space-y-4">
        <p className="text-white/40 text-sm">施設が見つかりませんでした</p>
        <Link href="/facilities" className="inline-block text-sm font-semibold text-white underline underline-offset-2">
          施設一覧に戻る
        </Link>
      </div>
    );
  }

  const imageUrl = facility.mediaUrls?.[0] || '';
  const area = [facility.prefecture, facility.city, facility.address].filter(Boolean).join(' ') || '未設定';
  const acceptanceInfo = getAcceptanceInfo(facility.acceptanceLevel);

  return (
    <div className="space-y-6 -mt-2">
      {/* Hero image */}
      <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/8">
        {imageUrl ? (
          <Image src={imageUrl} alt={facility.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 640px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/4">
            <span className="text-5xl font-extrabold text-white/15 tracking-tighter">TF</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-5">
          <div className="flex gap-2 mb-2">
            <span className="text-[10px] font-bold bg-white text-black px-2 py-0.5 rounded-md uppercase tracking-wide">
              {getTypeName(facility.type)}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${acceptanceInfo.color}`}>
              {acceptanceInfo.label}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold font-heading text-white leading-tight drop-shadow-lg">
            {facility.name}
          </h1>
          <p className="flex items-center gap-1.5 text-xs text-white/70 mt-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            {area}
          </p>
        </div>
      </div>

      {/* Warning */}
      {acceptanceInfo.warning && (
        <div className={`glass rounded-2xl p-4 border ${facility.acceptanceLevel === 'BANNED' ? 'border-red-500/30' : 'border-amber-500/30'}`}>
          <div className="flex items-start gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={facility.acceptanceLevel === 'BANNED' ? '#f87171' : '#fbbf24'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
            </svg>
            <p className={`text-sm leading-relaxed ${facility.acceptanceLevel === 'BANNED' ? 'text-red-300' : 'text-amber-300'}`}>
              {acceptanceInfo.warning}
            </p>
          </div>
        </div>
      )}

      {/* About */}
      <section className="space-y-2">
        <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">About</h2>
        <p className="whitespace-pre-wrap leading-relaxed text-white/55 text-sm">
          {facility.description || '概要情報の登録がありません。'}
        </p>
      </section>

      {/* Tattoo policy */}
      <section className="space-y-2">
        <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Tattoo Policy</h2>
        <div className="glass rounded-2xl p-4 border border-white/8">
          <p className="whitespace-pre-wrap leading-relaxed text-white/60 text-sm">
            {facility.tattooPolicy || 'ポリシー情報の記載がありません。事前に施設へのご確認をおすすめします。'}
          </p>
        </div>
      </section>

      {/* Information */}
      <section className="space-y-3">
        <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">Information</h2>
        <div className="glass rounded-2xl divide-y divide-white/8">
          <div className="px-4 py-3.5 flex justify-between items-center">
            <span className="text-white/40 text-xs uppercase tracking-wider">住所</span>
            <span className="text-white/70 text-sm text-right">{area}</span>
          </div>
          {facility.websiteUrl && (
            <div className="px-4 py-3.5 flex justify-between items-center">
              <span className="text-white/40 text-xs uppercase tracking-wider">Web</span>
              <a href={facility.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-sm hover:underline break-all text-right">
                サイトを開く
              </a>
            </div>
          )}
        </div>
      </section>

      <div className="space-y-3">
        <ReportFacilityButton facilityId={facility.id} facilityName={facility.name} />
        <Link
          href="/facilities"
          className="block text-center text-white/30 text-xs hover:text-white/60 transition-colors"
        >
          ← 施設一覧に戻る
        </Link>
      </div>
    </div>
  );
}
