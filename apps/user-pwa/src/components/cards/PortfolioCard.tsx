import Link from 'next/link';
import Image from 'next/image';

type PortfolioWork = {
  id: string;
  mediaUrls: string[];
  artistId: string;
};

export default function PortfolioCard({ work }: { work: PortfolioWork }) {
  const imageUrl = work.mediaUrls[0] ?? null;
  return (
    <Link href={`/portfolio/${work.id}`} className="group block">
      <div className="aspect-square bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-neutral-600 transition-all duration-500 hover:shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"/>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="portfolio work"
            width={400}
            height={400}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative z-0">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#636366" strokeWidth="1.5">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
          </div>
        )}
      </div>
    </Link>
  );
}
