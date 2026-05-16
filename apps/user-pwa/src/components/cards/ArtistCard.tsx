import Link from 'next/link';

type Artist = {
  id: string;
  displayName: string;
  studio?: { name: string };
  avgRating?: number;
  reviewCount?: number;
};

export default function ArtistCard({ artist }: { artist: Artist }) {
  const initials = artist.displayName.slice(0, 2).toUpperCase();
  return (
    <Link href={`/artist/${artist.id}`} className="group block">
      <div className="glass glass-hover rounded-2xl overflow-hidden glow-white">
        <div className="aspect-square flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-16 h-16 rounded-full bg-white/8 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            <span className="text-2xl font-extrabold text-white/40 font-heading tracking-tight group-hover:text-white/70 transition-colors duration-500">
              {initials}
            </span>
          </div>
        </div>
        <div className="p-4 border-t border-white/6">
          <p className="text-white font-semibold text-[15px] truncate">{artist.displayName}</p>
          {artist.studio && (
            <p className="text-white/40 text-xs mt-0.5 truncate tracking-wide">{artist.studio.name}</p>
          )}
          {artist.avgRating != null && (
            <div className="flex items-center gap-1 mt-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-amber-400 text-xs font-bold">{artist.avgRating.toFixed(1)}</span>
              {artist.reviewCount != null && (
                <span className="text-white/30 text-xs">({artist.reviewCount})</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
