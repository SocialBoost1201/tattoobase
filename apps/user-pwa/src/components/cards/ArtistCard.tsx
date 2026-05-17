import Link from 'next/link';

type Artist = {
  id: string;
  displayName: string;
  studio?: { name: string };
  avgRating?: number;
  reviewCount?: number;
  specialties?: string[];
  prefecture?: string;
  priceRange?: string;
};

export default function ArtistCard({ artist }: { artist: Artist }) {
  const initials = artist.displayName.slice(0, 2).toUpperCase();
  return (
    <Link href={`/artist/${artist.id}`} className="group block">
      <div className="glass glass-hover rounded-2xl overflow-hidden glow-white">
        <div className="aspect-square flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {artist.prefecture && (
            <div className="absolute top-2 left-2 z-10">
              <span className="text-[9px] font-bold bg-black/50 backdrop-blur-sm text-white/60 px-1.5 py-0.5 rounded-md border border-white/10">
                {artist.prefecture}
              </span>
            </div>
          )}
          <div className="w-16 h-16 rounded-full bg-white/8 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <span className="text-2xl font-extrabold text-white/40 font-heading tracking-tight group-hover:text-white/70 transition-colors duration-500">
              {initials}
            </span>
          </div>
        </div>
        <div className="p-3 border-t border-white/6 space-y-2">
          <div>
            <p className="text-white font-semibold text-[14px] truncate">{artist.displayName}</p>
            {artist.studio && (
              <p className="text-white/40 text-[10px] mt-0.5 truncate tracking-wide">{artist.studio.name}</p>
            )}
          </div>
          {artist.specialties && artist.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {artist.specialties.slice(0, 2).map((s) => (
                <span key={s} className="text-[9px] font-semibold text-white/40 bg-white/5 border border-white/8 px-1.5 py-0.5 rounded-md">
                  {s}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            {artist.avgRating != null && (
              <div className="flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span className="text-amber-400 text-[11px] font-bold">{artist.avgRating.toFixed(1)}</span>
                {artist.reviewCount != null && (
                  <span className="text-white/25 text-[10px]">({artist.reviewCount})</span>
                )}
              </div>
            )}
            {artist.priceRange && (
              <span className="text-white/30 text-[10px] font-medium">{artist.priceRange}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
