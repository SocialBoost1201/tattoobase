import StarRating from './StarRating';

export type Review = {
  id: string;
  rating: number;
  title?: string;
  body: string;
  userId: string;
  createdAt: string;
};

export default function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
  const initials = review.userId.slice(0, 2).toUpperCase();

  return (
    <div className="glass rounded-2xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white/50">{initials}</span>
          </div>
          <div>
            <p className="text-white text-sm font-semibold">ユーザー</p>
            <p className="text-white/35 text-xs">{date}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size={14} />
      </div>

      {review.title && (
        <p className="text-white font-semibold text-sm">{review.title}</p>
      )}
      <p className="text-white/60 text-sm leading-relaxed">{review.body}</p>
    </div>
  );
}
