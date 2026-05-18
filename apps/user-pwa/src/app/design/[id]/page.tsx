import Link from 'next/link';
import { API_BASE } from '@/lib/api';

async function getDesign(id: string) {
  try {
    const res = await fetch(`${API_BASE}/user-api/designs/${id}`, { cache: 'no-store' });
    if (res.ok) return res.json();
  } catch {
    // API not available
  }
  return null;
}

const STATUS_LABELS: Record<string, string> = {
  Pending: '見積待ち',
  Quoted: '見積提示',
  Accepted: '承認済み',
  Rejected: 'お断り',
};

export default async function DesignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const design = await getDesign(id);

  if (!design) {
    return (
      <div className="py-16 text-center glass rounded-2xl space-y-4">
        <p className="text-white/40 text-sm">デザイン依頼が見つかりませんでした</p>
        <Link href="/account/designs" className="inline-block text-sm font-semibold text-white underline underline-offset-2">
          デザイン一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-white tracking-tight">DESIGN</h1>
          <p className="text-white/30 text-xs mt-0.5 tracking-wider">#{id.slice(-6).toUpperCase()}</p>
        </div>
        {design.status && (
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl border text-amber-400 border-amber-500/30 bg-amber-500/10">
            {STATUS_LABELS[design.status] ?? design.status}
          </span>
        )}
      </div>

      <div className="h-px bg-white/8" />

      <div className="glass rounded-2xl divide-y divide-white/8">
        {design.title && (
          <div className="px-4 py-3.5 flex justify-between items-center">
            <span className="text-white/40 text-xs uppercase tracking-wider">Title</span>
            <span className="text-white text-sm font-semibold">{design.title}</span>
          </div>
        )}
        {design.artist?.displayName && (
          <div className="px-4 py-3.5 flex justify-between items-center">
            <span className="text-white/40 text-xs uppercase tracking-wider">Artist</span>
            <span className="text-white/70 text-sm">{design.artist.displayName}</span>
          </div>
        )}
        {design.description && (
          <div className="px-4 py-3.5">
            <span className="text-white/40 text-xs uppercase tracking-wider block mb-2">Description</span>
            <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap">{design.description}</p>
          </div>
        )}
      </div>

      <Link href="/account/designs" className="block text-center text-white/30 text-xs hover:text-white/60 transition-colors">
        ← デザイン一覧に戻る
      </Link>
    </div>
  );
}
