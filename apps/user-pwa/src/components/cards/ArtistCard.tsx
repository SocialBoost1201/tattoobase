import Link from 'next/link';

type Artist = {
  id: string;
  displayName: string;
  studio?: { name: string };
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
        </div>
      </div>
    </Link>
  );
}
