import Link from 'next/link';
import DesignCard from '@/components/cards/DesignCard';
import { MOCK_DESIGNS } from '@/lib/mock-data';

const STYLES = ['和彫', 'ブラックアンドグレー', 'ミニマル', 'トラディショナル', 'ファインライン', 'レタリング', 'ニュースクール', 'ジオメトリック', 'カラー', 'ポートレート'];
const BODY_PARTS = ['腕', '背中', '胸', '足', '首', '手', '肩', '脇腹'];

export default async function DesignsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const style = (params.style as string) ?? '';
  const bodyPart = (params.bodyPart as string) ?? '';
  const q = (params.q as string) ?? '';

  // Server-side filtering
  let results = MOCK_DESIGNS as typeof MOCK_DESIGNS;
  if (style) results = results.filter((d) => d.style === style);
  if (bodyPart) results = results.filter((d) => d.bodyPart === bodyPart);
  if (q) {
    const lower = q.toLowerCase();
    results = results.filter(
      (d) =>
        d.title.toLowerCase().includes(lower) ||
        d.style.toLowerCase().includes(lower) ||
        d.bodyPart.toLowerCase().includes(lower) ||
        (d.tags ?? []).some((tag) => tag.toLowerCase().includes(lower)) ||
        d.artistName.toLowerCase().includes(lower)
    );
  }

  const buildUrl = (overrides: Record<string, string>) => {
    const next: Record<string, string> = { style, bodyPart, q, ...overrides };
    const qs = Object.entries(next)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');
    return `/designs${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl text-white">DESIGNS</h1>
        <p className="text-white/45 text-xs mt-1">タトゥーデザインからインスピレーションを探す</p>
      </div>

      {/* Style filter chips */}
      <div className="space-y-2">
        <p className="text-white/35 text-[10px] font-semibold uppercase tracking-widest">スタイル</p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Link
            href={buildUrl({ style: '' })}
            className={`flex-none px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              !style ? 'bg-white text-black border-white font-bold' : 'glass text-white/50 hover:text-white border-white/15'
            }`}
          >
            ALL
          </Link>
          {STYLES.map((s) => (
            <Link
              key={s}
              href={buildUrl({ style: s })}
              className={`flex-none px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                style === s ? 'bg-white text-black border-white font-bold' : 'glass text-white/50 hover:text-white border-white/15'
              }`}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      {/* Body part filter chips */}
      <div className="space-y-2">
        <p className="text-white/35 text-[10px] font-semibold uppercase tracking-widest">部位</p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Link
            href={buildUrl({ bodyPart: '' })}
            className={`flex-none px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
              !bodyPart ? 'bg-white text-black border-white font-bold' : 'glass text-white/50 hover:text-white border-white/15'
            }`}
          >
            全部位
          </Link>
          {BODY_PARTS.map((bp) => (
            <Link
              key={bp}
              href={buildUrl({ bodyPart: bp })}
              className={`flex-none px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                bodyPart === bp ? 'bg-white text-black border-white font-bold' : 'glass text-white/50 hover:text-white border-white/15'
              }`}
            >
              {bp}
            </Link>
          ))}
        </div>
      </div>

      {/* Text search */}
      <form method="GET" action="/designs">
        {style && <input type="hidden" name="style" value={style} />}
        {bodyPart && <input type="hidden" name="bodyPart" value={bodyPart} />}
        <div className="relative">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="デザイン・スタイル・アーティストで検索"
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/25 transition-all"
          />
        </div>
      </form>

      {/* Results */}
      <section>
        {results.length > 0 ? (
          <>
            <p className="text-white/35 text-xs mb-3">{results.length}件のデザイン</p>
            <div className="grid grid-cols-3 gap-2">
              {results.map((design) => (
                <DesignCard key={design.id} design={design} />
              ))}
            </div>
          </>
        ) : (
          <div className="py-16 text-center glass rounded-2xl">
            <p className="text-white/45 text-sm">デザインが見つかりませんでした</p>
            {(style || bodyPart || q) && (
              <Link href="/designs" className="block mt-3 text-xs text-white/40 hover:text-white underline underline-offset-2">
                フィルターをリセット
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
