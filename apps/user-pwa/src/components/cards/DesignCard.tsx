import Link from 'next/link';
import Image from 'next/image';

type Design = {
  id: string;
  title: string;
  style: string;
  bodyPart: string;
  imageUrl: string;
  artistId: string;
  artistName: string;
  description?: string;
  tags?: string[];
};

export default function DesignCard({ design }: { design: Design }) {
  return (
    <Link href={`/artist/${design.artistId}`} className="group block">
      <div
        className="aspect-square rounded-xl overflow-hidden border border-white/8 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-black/60 relative glow-white"
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />

        {/* body part badge — top right, always visible */}
        <div className="absolute top-1.5 right-1.5 z-20">
          <span className="text-[9px] font-bold bg-black/50 backdrop-blur-sm text-white/70 px-1.5 py-0.5 rounded-md border border-white/10">
            {design.bodyPart}
          </span>
        </div>

        {/* style badge — bottom left, always visible */}
        <div className="absolute bottom-1.5 left-1.5 z-20">
          <span className="text-[9px] font-bold bg-black/60 backdrop-blur-sm text-white/80 px-1.5 py-0.5 rounded-md border border-white/10">
            {design.style}
          </span>
        </div>

        {/* hover: artist name + title */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white font-bold text-[10px] leading-tight truncate">{design.title}</p>
          <p className="text-white/60 text-[9px] truncate">{design.artistName}</p>
        </div>

        {/* image */}
        <Image
          src={design.imageUrl}
          alt={design.title}
          width={400}
          height={400}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out select-none"
        />
      </div>
    </Link>
  );
}
