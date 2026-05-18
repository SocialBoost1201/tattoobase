'use client';

import { useState } from 'react';
import { Star, Send, CheckCircle2, MessageSquare } from 'lucide-react';

// モックレビューデータ
const MOCK_REVIEWS = [
  {
    id: '1',
    userName: 'さとう たかし',
    avatar: 'ST',
    rating: 5,
    date: '2025年12月',
    style: '和彫',
    body: '初めてのタトゥーでしたが、デザインの相談から丁寧に対応していただきました。仕上がりも想像以上で大満足です。また必ずお願いしたいです。',
    photos: 1,
  },
  {
    id: '2',
    userName: 'みつい れいか',
    avatar: 'MR',
    rating: 5,
    date: '2025年11月',
    style: 'ブラックアンドグレー',
    body: '施術中もずっと声を掛けてくれて安心できました。細かいシェーディングがとにかく綺麗。友人にも紹介したいと思います。',
    photos: 0,
  },
  {
    id: '3',
    userName: 'やまだ けんじ',
    avatar: 'YK',
    rating: 4,
    date: '2025年10月',
    style: 'ミニマル',
    body: 'デザインの仕上がりは最高でした。予約の連絡が少し遅かったですが、実際の施術は文句なしです。',
    photos: 0,
  },
];

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              n <= (hover || value)
                ? 'text-amber-400 fill-amber-400'
                : 'text-neutral-700'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

const RATING_LABELS: Record<number, string> = {
  1: '残念だった',
  2: 'もう少し',
  3: '普通',
  4: '良かった',
  5: '素晴らしかった！',
};

export default function ReviewSection({ artistId }: { artistId: string }) {
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0 || !body.trim()) return;
    setSubmitting(true);
    // モック: 1秒後に送信完了
    await new Promise(r => setTimeout(r, 900));
    const newReview = {
      id: Date.now().toString(),
      userName: 'あなた',
      avatar: 'ME',
      rating,
      date: '今月',
      style: '—',
      body: body.trim(),
      photos: 0,
    };
    setReviews(prev => [newReview, ...prev]);
    setRating(0);
    setBody('');
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section className="mt-8 space-y-6">
      {/* セクションヘッダー */}
      <div className="flex items-baseline justify-between px-1">
        <h2 className="font-heading font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-neutral-500" />
          REVIEWS
        </h2>
        <div className="flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-white font-bold text-sm">{avgRating}</span>
          <span className="text-neutral-600 text-xs">/ {reviews.length}件</span>
        </div>
      </div>

      {/* レビュー一覧 */}
      <div className="space-y-3">
        {reviews.map(r => (
          <div key={r.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {r.avatar}
                </div>
                <div>
                  <p className="text-white text-xs font-bold">{r.userName}</p>
                  <p className="text-neutral-600 text-xs">{r.date} · {r.style}</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(n => (
                  <Star key={n} className={`w-3 h-3 ${n <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-800'}`} />
                ))}
              </div>
            </div>
            <p className="text-neutral-300 text-[12px] leading-relaxed">{r.body}</p>
            {r.photos > 0 && (
              <p className="text-neutral-600 text-xs">📷 写真 {r.photos}枚</p>
            )}
          </div>
        ))}
      </div>

      {/* レビュー投稿フォーム */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
        <h3 className="text-white font-bold text-sm mb-4">レビューを投稿する</h3>

        {submitted && (
          <div className="flex items-center gap-2 bg-green-950/50 border border-green-800 text-green-400 text-xs font-bold px-3 py-2.5 rounded-xl mb-4">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            レビューを投稿しました。ありがとうございます！
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-neutral-500 text-xs font-bold uppercase tracking-widest block mb-2">
              総合評価 <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <StarRating value={rating} onChange={setRating} />
              {rating > 0 && (
                <span className="text-white text-xs font-semibold">{RATING_LABELS[rating]}</span>
              )}
            </div>
          </div>

          <div>
            <label className="text-neutral-500 text-xs font-bold uppercase tracking-widest block mb-2">
              コメント <span className="text-red-500">*</span>
            </label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="施術の感想・デザインの質・スタジオの雰囲気などをご記入ください..."
              rows={4}
              className="w-full bg-neutral-800 border border-neutral-700 focus:border-neutral-500 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 outline-none resize-none transition-colors"
            />
            <p className="text-neutral-700 text-xs text-right mt-1">{body.length} / 500</p>
          </div>

          <button
            type="submit"
            disabled={rating === 0 || !body.trim() || submitting}
            className="flex items-center gap-2 w-full justify-center py-3 rounded-full font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-white text-black hover:bg-neutral-200"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                投稿中...
              </span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                レビューを投稿する
              </>
            )}
          </button>

          <p className="text-neutral-700 text-xs text-center">
            ※ 本機能は現在モード。DB接続後に実際のレビューとして保存されます。
          </p>
        </form>
      </div>
    </section>
  );
}
