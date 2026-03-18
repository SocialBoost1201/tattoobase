import Link from 'next/link';

const PREFS = ['東京都', '大阪府', '愛知県', '福岡県', '北海道', '神奈川県', '京都府', '兵庫県', '埼玉県', '千葉県'];
const PREF_SLUGS: Record<string, string> = {
  '東京都': 'tokyo', '大阪府': 'osaka', '愛知県': 'aichi', '福岡県': 'fukuoka',
  '北海道': 'hokkaido', '神奈川県': 'kanagawa', '京都府': 'kyoto', '兵庫県': 'hyogo',
  '埼玉県': 'saitama', '千葉県': 'chiba',
};
const STYLES = ['和彫', 'ブラックアンドグレー', 'トラディショナル', 'ニュースクール', 'ミニマル', 'レタリング', 'アニメ', 'ワンポイント', 'カバーアップ', 'トライバル'];
const GUIDES = [
  { label: '初めてのタトゥー完全ガイド', href: '/guide/beginner' },
  { label: '和彫りとは？スタイル完全解説', href: '/guide/styles/wabori' },
  { label: '価格相場ガイド', href: '/guide/pricing' },
  { label: 'アフターケアの方法', href: '/guide/aftercare' },
  { label: 'スタジオの選び方', href: '/guide/how-to-choose' },
];

export default function SeoFooter() {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 mt-16 pb-24 md:pb-8">
      {/* SEOリンク集 */}
      <div className="max-w-xl mx-auto md:max-w-7xl px-4 md:px-8 pt-10 grid gap-8">

        {/* エリア別 */}
        <div>
          <h3 className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest mb-3">エリアから探す</h3>
          <div className="flex flex-wrap gap-2">
            {PREFS.map(pref => (
              <Link key={pref} href={`/area/${PREF_SLUGS[pref] ?? pref}`}
                className="text-xs text-neutral-400 hover:text-white transition-colors underline underline-offset-2">
                {pref.replace(/都|府|道|県/, '')}のタトゥースタジオ
              </Link>
            ))}
          </div>
        </div>

        {/* スタイル別 */}
        <div>
          <h3 className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest mb-3">スタイルから探す</h3>
          <div className="flex flex-wrap gap-2">
            {STYLES.map(style => (
              <Link key={style} href={`/search?type=artist&genre=${encodeURIComponent(style)}`}
                className="text-xs text-neutral-400 hover:text-white transition-colors underline underline-offset-2">
                {style}のタトゥーアーティスト
              </Link>
            ))}
          </div>
        </div>

        {/* エリア × スタイル（SEO内部リンク） */}
        <div>
          <h3 className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest mb-3">エリア×スタイルで探す</h3>
          <div className="flex flex-wrap gap-2">
            {['東京都', '大阪府', '愛知県', '福岡県'].flatMap(pref =>
              ['和彫', 'ブラックアンドグレー', 'ミニマル'].map(style => (
                <Link key={`${pref}-${style}`}
                  href={`/search?type=artist&pref=${encodeURIComponent(pref)}&genre=${encodeURIComponent(style)}`}
                  className="text-xs text-neutral-400 hover:text-white transition-colors underline underline-offset-2">
                  {pref.replace(/都|府|道|県/, '')}の{style}アーティスト
                </Link>
              ))
            )}
          </div>
        </div>

        {/* ガイド */}
        <div>
          <h3 className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest mb-3">ガイド・読み物</h3>
          <div className="flex flex-col gap-1.5">
            {GUIDES.map(({ label, href }) => (
              <Link key={href} href={href} className="text-xs text-neutral-400 hover:text-white transition-colors underline underline-offset-2 w-fit">
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* コピーライト */}
        <div className="pt-4 border-t border-neutral-900">
          <div className="flex items-center justify-between text-[10px] text-neutral-700">
            <span>© 2026 TattooBase. All rights reserved.</span>
            <div className="flex gap-3">
              <Link href="/terms" className="hover:text-neutral-400 transition-colors">利用規約</Link>
              <Link href="/privacy" className="hover:text-neutral-400 transition-colors">プライバシーポリシー</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
