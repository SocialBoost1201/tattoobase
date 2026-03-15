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
      <div className="bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-neutral-600 transition-all duration-500 transform hover:-translate-y-1 hover:shadow-2xl">
        {/* アバター */}
        <div className="aspect-square bg-neutral-950 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-tr from-neutral-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
          <span className="text-3xl font-extrabold text-neutral-600 font-heading tracking-tight group-hover:scale-110 transition-transform duration-500">{initials}</span>
        </div>
        <div className="p-4 border-t border-neutral-800 bg-neutral-900 group-hover:bg-neutral-800/50 transition-colors duration-500">
          <p className="text-white font-semibold text-[15px] truncate">
            {artist.displayName}
          </p>
          {artist.studio && (
            <p className="text-neutral-400 text-xs mt-1 truncate tracking-wide">{artist.studio.name}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
