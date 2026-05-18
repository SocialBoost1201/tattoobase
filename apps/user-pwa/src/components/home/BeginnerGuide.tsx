import Link from 'next/link';

const GUIDES = [
  {
    title: 'タトゥーを入れる前の準備',
    desc: '失敗しないスタジオ選びと予約のコツ',
    icon: '📖',
    href: '#',
  },
  {
    title: '痛みの少ない部位ガイド',
    desc: '初めての方におすすめの場所とは',
    icon: '💡',
    href: '#',
  },
  {
    title: '正しいアフターケア',
    desc: '色落ちを防ぐための必須知識',
    icon: '✨',
    href: '#',
  },
];

export default function BeginnerGuide() {
  return (
    <section className="py-2 px-4">
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <h2 className="font-heading font-extrabold text-white text-xl tracking-tight">BEGINNER'S GUIDE</h2>
          <p className="text-white/35 text-xs mt-0.5">初めての方へ</p>
        </div>
      </div>

      <div className="space-y-2">
        {GUIDES.map((g) => (
          <Link key={g.title} href={g.href} className="group block">
            <div className="glass glass-hover rounded-2xl p-4 flex items-center gap-4 border border-white/8 hover:border-white/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center shrink-0 text-lg">
                {g.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm group-hover:text-white/90">{g.title}</p>
                <p className="text-white/40 text-xs mt-0.5">{g.desc}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 group-hover:translate-x-1 transition-transform">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 glass rounded-2xl p-4 border border-white/8">
        <p className="text-white/35 text-xs leading-relaxed">
          タトゥーは一生残る大切な決断です。TattooBaseでは、不安を取り除き、心から納得できる体験をサポートします。
        </p>
      </div>
    </section>
  );
}
