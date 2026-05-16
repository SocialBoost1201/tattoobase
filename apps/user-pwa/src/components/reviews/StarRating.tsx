'use client';

export default function StarRating({
  rating,
  max = 5,
  size = 16,
  interactive = false,
  onChange,
}: {
  rating: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.round(rating);
        return (
          <button
            key={i}
            type={interactive ? 'button' : undefined}
            onClick={interactive && onChange ? () => onChange(i + 1) : undefined}
            className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
            disabled={!interactive}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={filled ? '#fbbf24' : 'none'}
              stroke={filled ? '#fbbf24' : 'rgba(255,255,255,0.2)'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
