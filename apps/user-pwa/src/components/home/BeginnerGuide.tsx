import Link from 'next/link';
import { BookOpen, Info } from 'lucide-react';

export default function BeginnerGuide() {
  const guides = [
    { title: 'タトゥーを入れる前の準備', desc: '失敗しないスタジオ選びと予約のコツ', href: '#' },
    { title: '痛みの少ない部位ガイド', desc: '初めての方におすすめの場所とは', href: '#' },
    { title: '正しいアフターケア', desc: '色落ちを防ぐための必須知識', href: '#' },
  ];

  return (
    <section className="py-8 px-4">
      <div className="flex items-center gap-2 mb-5">
        <BookOpen className="w-5 h-5 text-neutral-400" />
        <h2 className="font-heading font-extrabold text-white text-lg tracking-tight">BEGINNER'S GUIDE</h2>
      </div>

      <div className="space-y-3">
        {guides.map((g, i) => (
          <Link key={i} href={g.href} className="group block bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-xl p-4 transition-colors">
            <h3 className="text-white font-bold text-sm mb-1 group-hover:underline underline-offset-4">{g.title}</h3>
            <p className="text-neutral-500 text-xs">{g.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-5 p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/50 flex items-start gap-3">
        <Info className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
        <p className="text-xs text-neutral-400 leading-relaxed">
          タトゥーは一生残る大切な決断です。TattooBaseでは、不安を取り除き、心から納得できる体験をサポートするための情報を提供しています。
        </p>
      </div>
    </section>
  );
}
