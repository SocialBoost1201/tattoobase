import { ShieldCheck, MessageCircle, Wallet } from 'lucide-react';

export default function TrustAndSafety() {
  const promises = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      title: "徹底した衛生管理",
      description: "ガイドラインをクリアした安全なスタジオのみを掲載しています。"
    },
    {
      icon: <Wallet className="w-6 h-6 text-white" />,
      title: "明朗・安心な会計",
      description: "不当な追加請求なし。事前に目安の料金を確認できます。"
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-white" />,
      title: "事前のチャット相談",
      description: "デザインや痛みの不安など、予約前に直接アーティストへ相談可能。"
    }
  ];

  return (
    <section className="py-8">
      <div className="text-center mb-6">
        <h2 className="font-heading font-extrabold text-white text-lg tracking-widest uppercase">3 Promises</h2>
        <p className="text-white/35 text-xs mt-1">TattooBaseが選ばれる理由</p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {promises.map((p, i) => (
          <div key={i} className="glass rounded-2xl flex items-start gap-4 p-5">
            <div className="shrink-0 w-11 h-11 bg-white/8 rounded-xl flex items-center justify-center border border-white/10">
              {p.icon}
            </div>
            <div>
              <h3 className="text-white font-bold text-sm mb-1">{p.title}</h3>
              <p className="text-white/45 text-xs leading-relaxed">{p.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
