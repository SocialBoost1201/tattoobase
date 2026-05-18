import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ChevronRight, Shield, Clock, DollarSign, Heart, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: '初めてのタトゥー完全ガイド 2026年版 | TattooBase',
  description: 'タトゥーを入れるのが初めての方向け完全ガイド。施術の流れ・価格相場・痛みの目安・アフターケア・スタジオ選びのポイントまで徹底解説。TattooBaseで安心してタトゥーデビュー。',
  openGraph: {
    title: '初めてのタトゥー完全ガイド 2026年版 | TattooBase',
    description: '施術の流れ・価格相場・痛み・アフターケアまで徹底解説。',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: '初めてのタトゥーを入れる手順',
  description: 'タトゥーを入れるための7ステップガイド',
  step: [
    { '@type': 'HowToStep', name: 'スタイルを決める', text: '和彫・ブラックアンドグレー等のスタイルから自分のイメージに合ったものを選ぶ' },
    { '@type': 'HowToStep', name: 'アーティストを探す', text: 'TattooBaseでポートフォリオを確認し、好みのスタイルが得意なアーティストを探す' },
    { '@type': 'HowToStep', name: 'カウンセリングを予約', text: '施術前のカウンセリングで部位・サイズ・デザインをアーティストと相談' },
    { '@type': 'HowToStep', name: 'デポジットを支払う', text: '予約確定のためのデポジット（予約金）を支払い、日程を確保' },
    { '@type': 'HowToStep', name: '施術当日', text: '飲酒と激しい運動を控えて来店。施術中はリラックスして過ごす' },
    { '@type': 'HowToStep', name: 'アフターケア', text: '施術後4〜6週間はラップ・保湿・日焼け止めでしっかりケア' },
    { '@type': 'HowToStep', name: '完成後のケア', text: '完全に癒えたら口コミを残してアーティストを応援する' },
  ],
};

const FAQ = [
  { q: 'タトゥーはどのくらい痛い？', a: '部位・サイズによって大きく異なります。一般的に、肋骨・脊椎・肘や膝の内側は痛みが強め。前腕・肩・太ももは比較的痛みが少ない傾向があります。' },
  { q: '未成年でもタトゥーを入れられる？', a: '日本では18歳未満は法律上タトゥーを入れることができません。TattooBaseでは予約時に成人確認を必須としています。' },
  { q: '価格の相場は？', a: 'ワンポイント（5cm以下）は¥10,000〜¥30,000が目安。ハーフスリーブは¥80,000〜、フルスリーブは¥200,000〜が一般的です。デザインの複雑さで変動します。' },
  { q: 'どのスタイルが人気？', a: '日本ではブラックアンドグレー・和彫・ミニマルが特に人気です。初めての方にはワンポイントやミニマルスタイルがおすすめです。' },
  { q: 'タトゥーを消すことはできる？', a: 'レーザー除去によって薄くすることは可能ですが、完全に消すには複数回の施術と高額な費用が必要です。慎重に検討しましょう。' },
];

export default function BeginnerGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="pb-20 space-y-10">
        {/* パンくず */}
        <nav className="text-xs text-neutral-500 flex items-center gap-1.5">
          <Link href="/" className="hover:text-white transition-colors">HOME</Link>
          <span>/</span>
          <Link href="/guide" className="hover:text-white transition-colors">ガイド</Link>
          <span>/</span>
          <span className="text-neutral-300">初めてのタトゥー</span>
        </nav>

        {/* Hero */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-neutral-400" />
            <span className="text-neutral-400 text-xs font-bold uppercase tracking-widest">Beginner Guide</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl text-white leading-tight">
            初めてのタトゥー<br />完全ガイド 2026年版
          </h1>
          <p className="text-neutral-400 text-sm leading-relaxed">
            施術の流れ・価格相場・痛みの目安・アフターケアまで、
            タトゥー未経験者が知っておくべき全てをまとめました。
          </p>
        </div>

        {/* 7ステップ */}
        <section className="space-y-4">
          <h2 className="font-heading font-bold text-white text-lg">施術の流れ — 7ステップ</h2>
          <ol className="space-y-3">
            {jsonLd.step.map((step, i) => (
              <li key={i} className="flex gap-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
                <div className="w-8 h-8 rounded-full bg-white text-black font-extrabold text-sm flex items-center justify-center shrink-0">{i + 1}</div>
                <div>
                  <p className="text-white font-bold text-sm">{step.name}</p>
                  <p className="text-neutral-400 text-xs mt-1 leading-relaxed">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 価格帯 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-neutral-400" />
            <h2 className="font-heading font-bold text-white text-lg">価格の目安</h2>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl divide-y divide-neutral-800 overflow-hidden">
            {[
              { label: 'ワンポイント（5cm以下）', price: '¥10,000〜¥30,000', time: '1〜2時間' },
              { label: 'スモール（5〜10cm）', price: '¥20,000〜¥50,000', time: '2〜4時間' },
              { label: 'ミディアム（10〜20cm）', price: '¥50,000〜¥120,000', time: '4〜8時間' },
              { label: 'ハーフスリーブ', price: '¥80,000〜¥200,000', time: '複数回' },
              { label: 'フルスリーブ', price: '¥200,000〜', time: '複数回（数ヶ月）' },
            ].map(({ label, price, time }) => (
              <div key={label} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-white text-sm font-semibold">{label}</p>
                  <p className="text-neutral-600 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{time}</p>
                </div>
                <span className="text-white font-bold text-sm">{price}</span>
              </div>
            ))}
          </div>
          <p className="text-neutral-600 text-xs px-1">※ デザインの複雑さ・アーティストの経歴により大きく変動します。</p>
        </section>

        {/* 注意事項 */}
        <section className="bg-amber-950/20 border border-amber-800/30 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertCircle className="w-4 h-4" />
            <h2 className="font-bold text-sm">施術前に確認すること</h2>
          </div>
          <ul className="space-y-2 text-neutral-300 text-sm">
            {['18歳以上であること（法律による制限）', '飲酒・激しい運動は24時間前から控える', 'ラテックスアレルギーの有無を確認する', '妊娠中・授乳中は施術を控える', '血液凝固に影響する薬を服用中は医師に相談'].map(item => (
              <li key={item} className="flex items-start gap-2">
                <Shield className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* アフターケア */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-neutral-400" />
            <h2 className="font-heading font-bold text-white text-lg">アフターケア</h2>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
            {[
              { label: '施術後すぐ〜24時間', text: 'ラップやフィルム包帯でカバー、清潔に保つ' },
              { label: '2〜14日間', text: '無香料の保湿剤を薄く塗布。患部をかかない' },
              { label: '3〜6週間', text: '直射日光を避け、UVカットクリームを使用' },
              { label: '完全に癒えたら', text: '口コミを残してアーティストを応援する' },
            ].map(({ label, text }) => (
              <div key={label} className="flex gap-3">
                <div className="w-1 bg-neutral-700 rounded-full shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm">{label}</p>
                  <p className="text-neutral-400 text-xs mt-0.5">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-3">
          <h2 className="font-heading font-bold text-white text-lg">よくある質問</h2>
          <div className="space-y-3">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden group">
                <summary className="px-5 py-4 text-white font-semibold text-sm cursor-pointer flex items-center justify-between list-none">
                  {q}
                  <ChevronRight className="w-4 h-4 text-neutral-500 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <div className="px-5 pb-4 text-neutral-400 text-sm leading-relaxed border-t border-neutral-800 pt-3">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center space-y-3">
          <p className="text-neutral-400 text-sm">準備ができたらアーティストを探しましょう</p>
          <Link href="/search" className="inline-flex items-center gap-2 bg-white text-black font-extrabold px-8 py-3.5 rounded-full hover:bg-neutral-200 transition-colors">
            アーティストを探す <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
