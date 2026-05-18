'use client';

import { useState } from 'react';
import StarRating from './StarRating';
import ReviewCard, { Review } from './ReviewCard';

type Aggregation = {
  averageRating: number;
  totalReviews: number;
  distribution: Record<string, number>;
};

const MOCK_REVIEWS: Review[] = [
  {
    id: 'mock-r-1',
    rating: 5,
    title: '最高の体験でした',
    body: 'デザインの相談から施術まで丁寧に対応していただきました。完成したタトゥーも想像以上で大満足です。また必ずお願いしたいです。',
    userId: 'user-abc123',
    createdAt: '2026-03-15T10:00:00Z',
  },
  {
    id: 'mock-r-2',
    rating: 5,
    title: 'プロフェッショナルな対応',
    body: '清潔感があり、説明も丁寧でした。痛みへの配慮もしてくれてリラックスして施術を受けられました。友人にも強くおすすめします。',
    userId: 'user-xyz456',
    createdAt: '2026-02-28T14:30:00Z',
  },
  {
    id: 'mock-r-3',
    rating: 4,
    title: '丁寧な仕事ぶり',
    body: 'こだわりのデザインを細かく再現してくれました。予約も取りやすく、時間通りに進んで助かりました。',
    userId: 'user-def789',
    createdAt: '2026-02-10T11:00:00Z',
  },
];

const MOCK_AGG: Aggregation = {
  averageRating: 4.7,
  totalReviews: 28,
  distribution: { '1': 0, '2': 1, '3': 2, '4': 7, '5': 18 },
};

export default function ReviewSection({
  artistId,
  reviews: initialReviews,
  aggregation: initialAgg,
}: {
  artistId: string;
  reviews: Review[];
  aggregation: Aggregation | null;
}) {
  const reviews = initialReviews.length > 0 ? initialReviews : MOCK_REVIEWS;
  const agg = initialAgg ?? MOCK_AGG;

  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setShowForm(false);
  };

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-extrabold text-base text-white tracking-tight">REVIEWS</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="text-xs font-semibold glass px-3 py-1.5 rounded-xl text-white/70 hover:text-white transition-colors"
        >
          レビューを書く
        </button>
      </div>

      {/* 評価サマリー */}
      <div className="glass rounded-2xl p-5 flex items-center gap-6">
        <div className="text-center shrink-0">
          <p className="text-4xl font-extrabold text-white leading-none">{agg.averageRating.toFixed(1)}</p>
          <StarRating rating={agg.averageRating} size={13} />
          <p className="text-white/35 text-xs mt-1">{agg.totalReviews}件</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = agg.distribution[String(star)] ?? 0;
            const pct = agg.totalReviews > 0 ? (count / agg.totalReviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-white/40 text-xs w-3">{star}</span>
                <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400/70 rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-white/30 text-xs w-4">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* レビュー投稿フォーム */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-5 space-y-4">
          <h3 className="text-white font-bold text-sm">レビューを投稿</h3>
          <div className="space-y-1">
            <label className="text-white/50 text-xs">評価</label>
            <StarRating rating={newRating} size={24} interactive onChange={setNewRating} />
          </div>
          <input
            type="text"
            placeholder="タイトル（任意）"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/25 transition-all"
          />
          <textarea
            required
            rows={3}
            placeholder="体験を共有してください..."
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/25 transition-all resize-none"
          />
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-white/10 text-white/50 text-sm font-semibold py-3 rounded-xl hover:bg-white/5 transition-all">
              キャンセル
            </button>
            <button type="submit" className="flex-1 bg-white text-black text-sm font-bold py-3 rounded-xl hover:bg-white/90 transition-all">
              投稿する
            </button>
          </div>
        </form>
      )}

      {submitted && (
        <div className="glass rounded-2xl p-4 border border-emerald-500/30">
          <p className="text-emerald-400 text-sm font-semibold">レビューを投稿しました。ありがとうございます！</p>
        </div>
      )}

      {/* レビュー一覧 */}
      <div className="space-y-3">
        {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
      </div>
    </section>
  );
}
